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
JsonRoutes.add('post', '/api/workflow/view/:instanceId', function (req, res, next) {
  var box, collection, current_user_id, current_user_info, e, flowId, hashData, ins, insId, object_name, permissions, record_id, redirect_url, ref, ref1, ref2, space, spaceId, space_id, x_auth_token, x_user_id;

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

      if (box) {
        redirect_url = "workflow/space/" + spaceId + "/" + box + "/" + insId + "?X-User-Id=" + x_user_id + "&X-Auth-Token=" + x_auth_token;
      } else {
        redirect_url = "workflow/space/" + spaceId + "/print/" + insId + "?box=monitor&print_is_show_traces=1&print_is_show_attachments=1&X-User-Id=" + x_user_id + "&X-Auth-Token=" + x_auth_token;
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
              label: objOrName.label
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fields.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/fields.coffee                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var processFormulaType;

processFormulaType = function (field, fs) {
  if (field.formula_type === "text") {
    fs.type = String;

    if (field.multiple) {
      fs.type = [String];
      return fs.autoform.type = "tags";
    }
  } else if (field.formula_type === "date") {
    fs.type = Date;

    if (Meteor.isClient) {
      if (Steedos.isMobile() || Steedos.isPad()) {
        return fs.autoform.afFieldInput = {
          type: "steedos-date-mobile",
          dateMobileOptions: {
            type: "date"
          }
        };
      } else {
        fs.autoform.outFormat = 'yyyy-MM-dd';
        return fs.autoform.afFieldInput = {
          type: "dx-date-box",
          timezoneId: "utc",
          dxDateBoxOptions: {
            type: "date",
            displayFormat: "yyyy-MM-dd"
          }
        };
      }
    }
  } else if (field.formula_type === "datetime") {
    fs.type = Date;

    if (Meteor.isClient) {
      if (Steedos.isMobile() || Steedos.isPad()) {
        return fs.autoform.afFieldInput = {
          type: "steedos-date-mobile",
          dateMobileOptions: {
            type: "datetime"
          }
        };
      } else {
        return fs.autoform.afFieldInput = {
          type: "dx-date-box",
          dxDateBoxOptions: {
            type: "datetime",
            displayFormat: "yyyy-MM-dd HH:mm"
          }
        };
      }
    }
  } else if (field.formula_type === "currency") {
    fs.type = Number;
    fs.autoform.type = "steedosNumber";
    fs.autoform.precision = field.precision || 18;

    if (field != null ? field.scale : void 0) {
      fs.autoform.scale = field.scale;
      return fs.decimal = true;
    } else if ((field != null ? field.scale : void 0) !== 0) {
      fs.autoform.scale = 2;
      return fs.decimal = true;
    }
  } else if (field.formula_type === "number") {
    fs.type = Number;
    fs.autoform.type = "steedosNumber";
    fs.autoform.precision = field.precision || 18;

    if (field != null ? field.scale : void 0) {
      fs.autoform.scale = field.scale;
      return fs.decimal = true;
    }
  } else if (field.formula_type === "boolean") {
    fs.type = Boolean;

    if (field.readonly) {
      fs.autoform.disabled = true;
    }

    return fs.autoform.type = "steedos-boolean-toggle";
  } else {
    return fs.type = String;
  }
};

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
      processFormulaType(field, fs);
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
            var appid, dxDataGridInstance, gridContainer, gridObjectNameClass, info, isOpenerRemove;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiZSIsIm9iamVjdHFsIiwic3RlZWRvc0NvcmUiLCJNZXRlb3IiLCJpc0RldmVsb3BtZW50IiwicmVxdWlyZSIsInN0YXJ0dXAiLCJleCIsIndyYXBBc3luYyIsImluaXQiLCJlcnJvciIsImNvbnNvbGUiLCJGaWJlciIsInBhdGgiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJuYW1lIiwibGlzdF92aWV3cyIsInNwYWNlIiwiZ2V0Q29sbGVjdGlvbk5hbWUiLCJfIiwiY2xvbmUiLCJjb252ZXJ0T2JqZWN0IiwiT2JqZWN0IiwiaW5pdFRyaWdnZXJzIiwiaW5pdExpc3RWaWV3cyIsImdldE9iamVjdE5hbWUiLCJnZXRPYmplY3QiLCJzcGFjZV9pZCIsInJlZiIsInJlZjEiLCJpc0FycmF5IiwiaXNDbGllbnQiLCJkZXBlbmQiLCJTZXNzaW9uIiwiZ2V0Iiwib2JqZWN0c0J5TmFtZSIsImdldE9iamVjdEJ5SWQiLCJvYmplY3RfaWQiLCJmaW5kV2hlcmUiLCJfaWQiLCJyZW1vdmVPYmplY3QiLCJsb2ciLCJnZXRDb2xsZWN0aW9uIiwic3BhY2VJZCIsIl9jb2xsZWN0aW9uX25hbWUiLCJyZW1vdmVDb2xsZWN0aW9uIiwiaXNTcGFjZUFkbWluIiwidXNlcklkIiwiZmluZE9uZSIsImZpZWxkcyIsImFkbWlucyIsImluZGV4T2YiLCJldmFsdWF0ZUZvcm11bGEiLCJmb3JtdWxhciIsImNvbnRleHQiLCJvcHRpb25zIiwiaXNTdHJpbmciLCJGb3JtdWxhciIsImNoZWNrRm9ybXVsYSIsImV2YWx1YXRlRmlsdGVycyIsImZpbHRlcnMiLCJzZWxlY3RvciIsImVhY2giLCJmaWx0ZXIiLCJhY3Rpb24iLCJ2YWx1ZSIsImxlbmd0aCIsImlzQ29tbW9uU3BhY2UiLCJnZXRPcmRlcmx5U2V0QnlJZHMiLCJkb2NzIiwiaWRzIiwiaWRfa2V5IiwiaGl0X2ZpcnN0IiwidmFsdWVzIiwiZ2V0UHJvcGVydHkiLCJzb3J0QnkiLCJkb2MiLCJfaW5kZXgiLCJzb3J0aW5nTWV0aG9kIiwidmFsdWUxIiwidmFsdWUyIiwiaXNWYWx1ZTFFbXB0eSIsImlzVmFsdWUyRW1wdHkiLCJsb2NhbGUiLCJrZXkiLCJEYXRlIiwiZ2V0VGltZSIsIlN0ZWVkb3MiLCJ0b1N0cmluZyIsImxvY2FsZUNvbXBhcmUiLCJnZXRPYmplY3RSZWxhdGVkcyIsIl9vYmplY3QiLCJwZXJtaXNzaW9ucyIsInJlbGF0ZWRMaXN0IiwicmVsYXRlZExpc3RNYXAiLCJyZWxhdGVkX29iamVjdHMiLCJpc0VtcHR5Iiwib2JqTmFtZSIsImlzT2JqZWN0Iiwib2JqZWN0TmFtZSIsInJlbGF0ZWRfb2JqZWN0IiwicmVsYXRlZF9vYmplY3RfbmFtZSIsInJlbGF0ZWRfZmllbGQiLCJyZWxhdGVkX2ZpZWxkX25hbWUiLCJ0eXBlIiwicmVmZXJlbmNlX3RvIiwiZm9yZWlnbl9rZXkiLCJzaGFyaW5nIiwiZW5hYmxlT2JqTmFtZSIsImdldFBlcm1pc3Npb25zIiwiZW5hYmxlX2F1ZGl0IiwibW9kaWZ5QWxsUmVjb3JkcyIsImVuYWJsZV9maWxlcyIsInB1c2giLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImVuYWJsZV9hcHByb3ZhbHMiLCJnZXRVc2VyQ29udGV4dCIsImlzVW5TYWZlTW9kZSIsIlVTRVJfQ09OVEVYVCIsInNwYWNlX3VzZXJfb3JnIiwic3UiLCJzdUZpZWxkcyIsIkVycm9yIiwibW9iaWxlIiwicG9zaXRpb24iLCJlbWFpbCIsImNvbXBhbnkiLCJvcmdhbml6YXRpb24iLCJjb21wYW55X2lkIiwiY29tcGFueV9pZHMiLCJ1c2VyIiwiZnVsbG5hbWUiLCJnZXRSZWxhdGl2ZVVybCIsInVybCIsImlzRnVuY3Rpb24iLCJpc0NvcmRvdmEiLCJzdGFydHNXaXRoIiwidGVzdCIsIl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18iLCJST09UX1VSTF9QQVRIX1BSRUZJWCIsImdldFVzZXJDb21wYW55SWQiLCJnZXRVc2VyQ29tcGFueUlkcyIsInByb2Nlc3NQZXJtaXNzaW9ucyIsInBvIiwiYWxsb3dDcmVhdGUiLCJhbGxvd1JlYWQiLCJhbGxvd0VkaXQiLCJhbGxvd0RlbGV0ZSIsInZpZXdBbGxSZWNvcmRzIiwidmlld0NvbXBhbnlSZWNvcmRzIiwibW9kaWZ5Q29tcGFueVJlY29yZHMiLCJnZXRUZW1wbGF0ZVNwYWNlSWQiLCJzZXR0aW5ncyIsInRlbXBsYXRlU3BhY2VJZCIsImdldENsb3VkQWRtaW5TcGFjZUlkIiwiY2xvdWRBZG1pblNwYWNlSWQiLCJpc1RlbXBsYXRlU3BhY2UiLCJpc0Nsb3VkQWRtaW5TcGFjZSIsInByb2Nlc3MiLCJlbnYiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJyZXNvbHZlIiwiam9pbiIsIl9fbWV0ZW9yX2Jvb3RzdHJhcF9fIiwic2VydmVyRGlyIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsIm9wdGlvbnNfbGltaXQiLCJxdWVyeSIsInF1ZXJ5X29wdGlvbnMiLCJyZWNvcmRzIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsInBhcmFtcyIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJmaWx0ZXJRdWVyeSIsImxpbWl0IiwiZmluZCIsImZldGNoIiwicmVjb3JkIiwibGFiZWwiLCJtZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm94IiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJmbG93SWQiLCJoYXNoRGF0YSIsImlucyIsImluc0lkIiwicmVjb3JkX2lkIiwicmVkaXJlY3RfdXJsIiwicmVmMiIsInhfYXV0aF90b2tlbiIsInhfdXNlcl9pZCIsInV1Zmxvd01hbmFnZXIiLCJjaGVja19hdXRob3JpemF0aW9uIiwiYm9keSIsImNoZWNrIiwiaW5zdGFuY2VJZCIsImZsb3ciLCJpbmJveF91c2VycyIsImluY2x1ZGVzIiwiY2NfdXNlcnMiLCJvdXRib3hfdXNlcnMiLCJzdGF0ZSIsInN1Ym1pdHRlciIsImFwcGxpY2FudCIsInBlcm1pc3Npb25NYW5hZ2VyIiwiZ2V0Rmxvd1Blcm1pc3Npb25zIiwic3BhY2VzIiwic2VuZFJlc3VsdCIsImNvZGUiLCJkYXRhIiwidXBkYXRlIiwiJHB1bGwiLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJnZXRJbml0V2lkdGhQZXJjZW50IiwiY29sdW1ucyIsIl9zY2hlbWEiLCJjb2x1bW5fbnVtIiwiaW5pdF93aWR0aF9wZXJjZW50IiwiZ2V0U2NoZW1hIiwiZmllbGRfbmFtZSIsImZpZWxkIiwiaXNfd2lkZSIsInBpY2siLCJhdXRvZm9ybSIsImdldEZpZWxkSXNXaWRlIiwiZ2V0VGFidWxhck9yZGVyIiwibGlzdF92aWV3X2lkIiwic2V0dGluZyIsIm1hcCIsImNvbHVtbiIsImhpZGRlbiIsImNvbXBhY3QiLCJvcmRlciIsImluZGV4IiwiZGVmYXVsdF9leHRyYV9jb2x1bW5zIiwiZXh0cmFfY29sdW1ucyIsImdldE9iamVjdERlZmF1bHRDb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyIsInVuaW9uIiwiZ2V0T2JqZWN0RGVmYXVsdFNvcnQiLCJUYWJ1bGFyU2VsZWN0ZWRJZHMiLCJjb252ZXJ0TGlzdFZpZXciLCJkZWZhdWx0X3ZpZXciLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfbmFtZSIsImRlZmF1bHRfY29sdW1ucyIsImRlZmF1bHRfbW9iaWxlX2NvbHVtbnMiLCJvaXRlbSIsIm1vYmlsZV9jb2x1bW5zIiwiaGFzIiwiaW5jbHVkZSIsImZpbHRlcl9zY29wZSIsInBhcnNlIiwiZm9yRWFjaCIsIl92YWx1ZSIsImdldFJlbGF0ZWRMaXN0IiwibGlzdCIsIm1hcExpc3QiLCJyZWxhdGVkTGlzdE5hbWVzIiwicmVsYXRlZExpc3RPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfbmFtZXMiLCJ1bnJlbGF0ZWRfb2JqZWN0cyIsIm9iak9yTmFtZSIsInJlbGF0ZWQiLCJpc19maWxlIiwiY3VzdG9tUmVsYXRlZExpc3RPYmplY3QiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRfb2JqZWN0X2l0ZW0iLCJyZWxhdGVkT2JqZWN0IiwidGFidWxhcl9vcmRlciIsIndpdGhvdXQiLCJ0cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyIiwicmVwbGFjZSIsInBsdWNrIiwiZGlmZmVyZW5jZSIsInYiLCJpc0FjdGl2ZSIsIml0ZW0iLCJhbGxvd19yZWxhdGVkTGlzdCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJmaXJzdCIsImdldExpc3RWaWV3cyIsImdldExpc3RWaWV3IiwiZXhhYyIsImxpc3RWaWV3cyIsImdldExpc3RWaWV3SXNSZWNlbnQiLCJsaXN0VmlldyIsInBpY2tPYmplY3RNb2JpbGVDb2x1bW5zIiwiY291bnQiLCJnZXRGaWVsZCIsImlzTmFtZUNvbHVtbiIsIml0ZW1Db3VudCIsIm1heENvdW50IiwibWF4Um93cyIsIm5hbWVDb2x1bW4iLCJuYW1lS2V5IiwicmVzdWx0IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJSZWdFeHAiLCJfcmVnRXhNZXNzYWdlcyIsIl9nbG9iYWxNZXNzYWdlcyIsInJlZ0V4IiwiZXhwIiwibXNnIiwibWVzc2FnZXMiLCJldmFsSW5Db250ZXh0IiwianMiLCJldmFsIiwiY2FsbCIsImNvbnZlcnRGaWVsZCIsImdldE9wdGlvbiIsIm9wdGlvbiIsImZvbyIsInNwbGl0IiwiY29sb3IiLCJhbGxPcHRpb25zIiwicGlja2xpc3QiLCJwaWNrbGlzdE9wdGlvbnMiLCJnZXRQaWNrbGlzdCIsImdldFBpY2tMaXN0T3B0aW9ucyIsInJldmVyc2UiLCJlbmFibGUiLCJkZWZhdWx0VmFsdWUiLCJ0cmlnZ2VycyIsInRyaWdnZXIiLCJfdG9kbyIsIl90b2RvX2Zyb21fY29kZSIsIl90b2RvX2Zyb21fZGIiLCJvbiIsInRvZG8iLCJhY3Rpb25zIiwiX3Zpc2libGUiLCJlcnJvcjEiLCJhY3Rpb25zQnlOYW1lIiwidmlzaWJsZSIsIl9vcHRpb25zIiwiX3R5cGUiLCJiZWZvcmVPcGVuRnVuY3Rpb24iLCJpc19jb21wYW55X2xpbWl0ZWQiLCJtYXgiLCJtaW4iLCJfb3B0aW9uIiwiayIsIl9yZWdFeCIsIl9taW4iLCJfbWF4IiwiTnVtYmVyIiwiQm9vbGVhbiIsIl9vcHRpb25zRnVuY3Rpb24iLCJfcmVmZXJlbmNlX3RvIiwiX2NyZWF0ZUZ1bmN0aW9uIiwiX2JlZm9yZU9wZW5GdW5jdGlvbiIsIl9maWx0ZXJzRnVuY3Rpb24iLCJfZGVmYXVsdFZhbHVlIiwiX2lzX2NvbXBhbnlfbGltaXRlZCIsIl9maWx0ZXJzIiwiaXNEYXRlIiwicG9wIiwiX2lzX2RhdGUiLCJmb3JtIiwidmFsIiwicmVsYXRlZE9iakluZm8iLCJQUkVGSVgiLCJfcHJlcGVuZFByZWZpeEZvckZvcm11bGEiLCJwcmVmaXgiLCJmaWVsZFZhcmlhYmxlIiwicmVnIiwicmV2IiwibSIsIiQxIiwiZm9ybXVsYV9zdHIiLCJfQ09OVEVYVCIsIl9WQUxVRVMiLCJpc0Jvb2xlYW4iLCJ0b2FzdHIiLCJmb3JtYXRPYmplY3ROYW1lIiwiX2Jhc2VPYmplY3QiLCJfZGIiLCJkZWZhdWx0TGlzdFZpZXdJZCIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJyZWYzIiwic2NoZW1hIiwic2VsZiIsImJhc2VPYmplY3QiLCJwZXJtaXNzaW9uX3NldCIsImljb24iLCJkZXNjcmlwdGlvbiIsImlzX3ZpZXciLCJpc19lbmFibGUiLCJhbGxvd19hY3Rpb25zIiwiZW5hYmxlX3NlYXJjaCIsInBhZ2luZyIsImVuYWJsZV9hcGkiLCJjdXN0b20iLCJlbmFibGVfc2hhcmUiLCJlbmFibGVfdHJlZSIsInNpZGViYXIiLCJvcGVuX3dpbmRvdyIsImZpbHRlcl9jb21wYW55IiwiY2FsZW5kYXIiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJlbmFibGVfZm9sbG93IiwiZW5hYmxlX3dvcmtmbG93IiwiaW5fZGV2ZWxvcG1lbnQiLCJpZEZpZWxkTmFtZSIsImRhdGFiYXNlX25hbWUiLCJpc19uYW1lIiwicHJpbWFyeSIsImZpbHRlcmFibGUiLCJyZWFkb25seSIsIml0ZW1fbmFtZSIsImNvcHlJdGVtIiwiYWRtaW4iLCJhbGwiLCJsaXN0X3ZpZXdfaXRlbSIsIlJlYWN0aXZlVmFyIiwiY3JlYXRlQ29sbGVjdGlvbiIsIl9uYW1lIiwiZ2V0T2JqZWN0U2NoZW1hIiwiY29udGFpbnMiLCJhdHRhY2hTY2hlbWEiLCJfc2ltcGxlU2NoZW1hIiwiZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXgiLCJib290c3RyYXBMb2FkZWQiLCJwcm9jZXNzRm9ybXVsYVR5cGUiLCJmcyIsImZvcm11bGFfdHlwZSIsIm11bHRpcGxlIiwiaXNNb2JpbGUiLCJpc1BhZCIsImFmRmllbGRJbnB1dCIsImRhdGVNb2JpbGVPcHRpb25zIiwib3V0Rm9ybWF0IiwidGltZXpvbmVJZCIsImR4RGF0ZUJveE9wdGlvbnMiLCJkaXNwbGF5Rm9ybWF0IiwicHJlY2lzaW9uIiwic2NhbGUiLCJkZWNpbWFsIiwiZGlzYWJsZWQiLCJmaWVsZHNBcnIiLCJfcmVmX29iaiIsImF1dG9mb3JtX3R5cGUiLCJpc1VuTGltaXRlZCIsInJvd3MiLCJsYW5ndWFnZSIsImhlaWdodCIsImRpYWxvZ3NJbkJvZHkiLCJ0b29sYmFyIiwiZm9udE5hbWVzIiwibGFuZyIsInNob3dJY29uIiwiZGVwZW5kT24iLCJkZXBlbmRfb24iLCJjcmVhdGUiLCJsb29rdXBfZmllbGQiLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJvcGVyYXRpb24iLCJvblN1Y2Nlc3MiLCJhZGRJdGVtcyIsInJlZmVyZW5jZV9zb3J0Iiwib3B0aW9uc1NvcnQiLCJyZWZlcmVuY2VfbGltaXQiLCJvcHRpb25zTGltaXQiLCJvbWl0IiwiYmxhY2tib3giLCJvYmplY3RTd2l0Y2hlIiwib3B0aW9uc01ldGhvZCIsIm9wdGlvbnNNZXRob2RQYXJhbXMiLCJyZWZlcmVuY2VzIiwiX3JlZmVyZW5jZSIsImxpbmsiLCJkZWZhdWx0SWNvbiIsImZpcnN0T3B0aW9uIiwiQXJyYXkiLCJlZGl0YWJsZSIsImFjY2VwdCIsInN5c3RlbSIsIkVtYWlsIiwicmVxdWlyZWQiLCJvcHRpb25hbCIsInVuaXF1ZSIsImdyb3VwIiwic2VhcmNoYWJsZSIsIm5vdyIsImlubGluZUhlbHBUZXh0IiwiaXNQcm9kdWN0aW9uIiwic29ydGFibGUiLCJnZXRGaWVsZERpc3BsYXlWYWx1ZSIsImZpZWxkX3ZhbHVlIiwiaHRtbCIsIm1vbWVudCIsImZvcm1hdCIsImNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSIsImZpZWxkX3R5cGUiLCJwdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMiLCJvcGVyYXRpb25zIiwiYnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVzIiwiYnVpbHRpbkl0ZW0iLCJpc19jaGVja19vbmx5IiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0iLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0iLCJnZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiIsImJldHdlZW5CdWlsdGluVmFsdWVzIiwiZ2V0UXVhcnRlclN0YXJ0TW9udGgiLCJtb250aCIsImdldE1vbnRoIiwiZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSIsInllYXIiLCJnZXRGdWxsWWVhciIsImdldE5leHRRdWFydGVyRmlyc3REYXkiLCJnZXRNb250aERheXMiLCJkYXlzIiwiZW5kRGF0ZSIsIm1pbGxpc2Vjb25kIiwic3RhcnREYXRlIiwiZ2V0TGFzdE1vbnRoRmlyc3REYXkiLCJjdXJyZW50TW9udGgiLCJjdXJyZW50WWVhciIsImVuZFZhbHVlIiwiZmlyc3REYXkiLCJsYXN0RGF5IiwibGFzdE1vbmRheSIsImxhc3RNb250aEZpbmFsRGF5IiwibGFzdE1vbnRoRmlyc3REYXkiLCJsYXN0UXVhcnRlckVuZERheSIsImxhc3RRdWFydGVyU3RhcnREYXkiLCJsYXN0U3VuZGF5IiwibGFzdF8xMjBfZGF5cyIsImxhc3RfMzBfZGF5cyIsImxhc3RfNjBfZGF5cyIsImxhc3RfN19kYXlzIiwibGFzdF85MF9kYXlzIiwibWludXNEYXkiLCJtb25kYXkiLCJuZXh0TW9uZGF5IiwibmV4dE1vbnRoRmluYWxEYXkiLCJuZXh0TW9udGhGaXJzdERheSIsIm5leHRRdWFydGVyRW5kRGF5IiwibmV4dFF1YXJ0ZXJTdGFydERheSIsIm5leHRTdW5kYXkiLCJuZXh0WWVhciIsIm5leHRfMTIwX2RheXMiLCJuZXh0XzMwX2RheXMiLCJuZXh0XzYwX2RheXMiLCJuZXh0XzdfZGF5cyIsIm5leHRfOTBfZGF5cyIsInByZXZpb3VzWWVhciIsInN0YXJ0VmFsdWUiLCJzdHJFbmREYXkiLCJzdHJGaXJzdERheSIsInN0ckxhc3REYXkiLCJzdHJNb25kYXkiLCJzdHJTdGFydERheSIsInN0clN1bmRheSIsInN0clRvZGF5Iiwic3RyVG9tb3Jyb3ciLCJzdHJZZXN0ZGF5Iiwic3VuZGF5IiwidGhpc1F1YXJ0ZXJFbmREYXkiLCJ0aGlzUXVhcnRlclN0YXJ0RGF5IiwidG9tb3Jyb3ciLCJ3ZWVrIiwieWVzdGRheSIsImdldERheSIsInQiLCJmdiIsInNldEhvdXJzIiwiZ2V0SG91cnMiLCJnZXRUaW1lem9uZU9mZnNldCIsImdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiIsImdldEZpZWxkT3BlcmF0aW9uIiwib3B0aW9uYWxzIiwiZXF1YWwiLCJ1bmVxdWFsIiwibGVzc190aGFuIiwiZ3JlYXRlcl90aGFuIiwibGVzc19vcl9lcXVhbCIsImdyZWF0ZXJfb3JfZXF1YWwiLCJub3RfY29udGFpbiIsInN0YXJ0c193aXRoIiwiYmV0d2VlbiIsImdldE9iamVjdEZpZWxkc05hbWUiLCJmaWVsZHNOYW1lIiwic29ydF9ubyIsImNsZWFuVHJpZ2dlciIsImluaXRUcmlnZ2VyIiwiX3RyaWdnZXJfaG9va3MiLCJyZWY0IiwicmVmNSIsInRvZG9XcmFwcGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJ3aGVuIiwiYmVmb3JlIiwiaW5zZXJ0IiwicmVtb3ZlIiwiYWZ0ZXIiLCJfaG9vayIsInRyaWdnZXJfbmFtZSIsIl90cmlnZ2VyX2hvb2siLCJmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0IiwiZmluZF9wZXJtaXNzaW9uX29iamVjdCIsImludGVyc2VjdGlvblBsdXMiLCJ1bmlvblBlcm1pc3Npb25PYmplY3RzIiwidW5pb25QbHVzIiwiZ2V0T2JqZWN0UGVybWlzc2lvbnMiLCJnZXRSZWNvcmRQZXJtaXNzaW9ucyIsImlzT3duZXIiLCJvYmplY3RfZmllbGRzX2tleXMiLCJyZWNvcmRfY29tcGFueV9pZCIsInJlY29yZF9jb21wYW55X2lkcyIsInNlbGVjdCIsInVzZXJfY29tcGFueV9pZHMiLCJwYXJlbnQiLCJrZXlzIiwiaW50ZXJzZWN0aW9uIiwiZ2V0T2JqZWN0UmVjb3JkIiwicmVjb3JkX3Blcm1pc3Npb25zIiwib3duZXIiLCJuIiwibG9ja2VkIiwiZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyIsImN1cnJlbnRPYmplY3ROYW1lIiwicmVsYXRlZExpc3RJdGVtIiwiY3VycmVudFJlY29yZCIsImlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSIsIm1hc3RlckFsbG93IiwibWFzdGVyUmVjb3JkUGVybSIsInJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyIsInVuZWRpdGFibGVfcmVsYXRlZF9saXN0IiwiZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0IiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJfaSIsInBzZXRzIiwicHNldHNBZG1pbiIsInBzZXRzQWRtaW5fcG9zIiwicHNldHNDdXJyZW50IiwicHNldHNDdXJyZW50TmFtZXMiLCJwc2V0c0N1cnJlbnRfcG9zIiwicHNldHNDdXN0b21lciIsInBzZXRzQ3VzdG9tZXJfcG9zIiwicHNldHNHdWVzdCIsInBzZXRzR3Vlc3RfcG9zIiwicHNldHNNZW1iZXIiLCJwc2V0c01lbWJlcl9wb3MiLCJwc2V0c1N1cHBsaWVyIiwicHNldHNTdXBwbGllcl9wb3MiLCJwc2V0c1VzZXIiLCJwc2V0c1VzZXJfcG9zIiwic2V0X2lkcyIsInNwYWNlVXNlciIsIm9iamVjdHMiLCJhc3NpZ25lZF9hcHBzIiwicHJvZmlsZSIsInVzZXJzIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJnZXRBc3NpZ25lZEFwcHMiLCJiaW5kIiwiYXNzaWduZWRfbWVudXMiLCJnZXRBc3NpZ25lZE1lbnVzIiwidXNlcl9wZXJtaXNzaW9uX3NldHMiLCJhcnJheSIsIm90aGVyIiwiYXBwcyIsInBzZXRCYXNlIiwidXNlclByb2ZpbGUiLCJwc2V0IiwidW5pcSIsImFib3V0TWVudSIsImFkbWluTWVudXMiLCJhbGxNZW51cyIsImN1cnJlbnRQc2V0TmFtZXMiLCJtZW51cyIsIm90aGVyTWVudUFwcHMiLCJvdGhlck1lbnVzIiwiYWRtaW5fbWVudXMiLCJmbGF0dGVuIiwibWVudSIsInBzZXRzTWVudSIsInBlcm1pc3Npb25fc2V0cyIsInBlcm1pc3Npb25fb2JqZWN0cyIsImlzTnVsbCIsInBlcm1pc3Npb25fc2V0X2lkcyIsInBvcyIsIm9wcyIsIm9wc19rZXkiLCJjdXJyZW50UHNldCIsInRlbXBPcHMiLCJyZXBlYXRJbmRleCIsInJlcGVhdFBvIiwib3BzZXRBZG1pbiIsIm9wc2V0Q3VzdG9tZXIiLCJvcHNldEd1ZXN0Iiwib3BzZXRNZW1iZXIiLCJvcHNldFN1cHBsaWVyIiwib3BzZXRVc2VyIiwicG9zQWRtaW4iLCJwb3NDdXN0b21lciIsInBvc0d1ZXN0IiwicG9zTWVtYmVyIiwicG9zU3VwcGxpZXIiLCJwb3NVc2VyIiwicHJvZiIsImd1ZXN0IiwibWVtYmVyIiwic3VwcGxpZXIiLCJjdXN0b21lciIsImRpc2FibGVkX2FjdGlvbnMiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsInVuZWRpdGFibGVfZmllbGRzIiwiY3JlYXRvcl9kYl91cmwiLCJvcGxvZ191cmwiLCJNT05HT19VUkxfQ1JFQVRPUiIsIk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SIiwiX0NSRUFUT1JfREFUQVNPVVJDRSIsIl9kcml2ZXIiLCJNb25nb0ludGVybmFscyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvcGxvZ1VybCIsImNvbGxlY3Rpb25fa2V5IiwibmV3Q29sbGVjdGlvbiIsIlNNU1F1ZXVlIiwiYWN0aW9uX25hbWUiLCJleGVjdXRlQWN0aW9uIiwiaXRlbV9lbGVtZW50IiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIm9kYXRhIiwicHJvdG90eXBlIiwic2xpY2UiLCJjb25jYXQiLCJ3YXJuaW5nIiwic2V0IiwiRm9ybU1hbmFnZXIiLCJnZXRJbml0aWFsVmFsdWVzIiwiZGVmZXIiLCIkIiwiY2xpY2siLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwiRmxvd1JvdXRlciIsInJlZGlyZWN0IiwicmVjb3JkX3RpdGxlIiwiY2FsbF9iYWNrIiwiYmVmb3JlSG9vayIsInRleHQiLCJydW5Ib29rIiwic3dhbCIsInRpdGxlIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsInByZXZpb3VzRG9jIiwiZ2V0UHJldmlvdXNEb2MiLCJhcHBpZCIsImR4RGF0YUdyaWRJbnN0YW5jZSIsImdyaWRDb250YWluZXIiLCJncmlkT2JqZWN0TmFtZUNsYXNzIiwiaW5mbyIsImlzT3BlbmVyUmVtb3ZlIiwic3VjY2VzcyIsIndpbmRvdyIsIm9wZW5lciIsImR4VHJlZUxpc3QiLCJkeERhdGFHcmlkIiwicmVmcmVzaCIsInJlbG9hZCIsIlRlbXBsYXRlIiwiY3JlYXRvcl9ncmlkIiwiY2xvc2UiLCJnbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEtBQUNBLEVBQUQsR0FBTSxFQUFOOztBQUNBLElBQUksT0FBQUMsT0FBQSxvQkFBQUEsWUFBQSxJQUFKO0FBQ0MsT0FBQ0EsT0FBRCxHQUFXLEVBQVg7QUNFQTs7QUREREEsUUFBUUMsT0FBUixHQUFrQixFQUFsQjtBQUNBRCxRQUFRRSxXQUFSLEdBQXNCLEVBQXRCO0FBQ0FGLFFBQVFHLEtBQVIsR0FBZ0IsRUFBaEI7QUFDQUgsUUFBUUksSUFBUixHQUFlLEVBQWY7QUFDQUosUUFBUUssVUFBUixHQUFxQixFQUFyQjtBQUNBTCxRQUFRTSxPQUFSLEdBQWtCLEVBQWxCO0FBQ0FOLFFBQVFPLElBQVIsR0FBZSxFQUFmO0FBQ0FQLFFBQVFRLGFBQVIsR0FBd0IsRUFBeEIsQzs7Ozs7Ozs7Ozs7O0FFVkEsSUFBQUMsQ0FBQSxFQUFBQyxR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RSx1QkFBT1EsS0FBUDtBQURELHFCQUVLLElBQUc5bEIsY0FBYWpMLFFBQVFDLEdBQVIsQ0FBWSxXQUFaLENBQWIsSUFBMEMsQ0FBQ3FELFFBQVEyWCxRQUFSLEVBQTNDLElBQWtFdE4saUJBQWdCLFVBQXJGO0FBQ0pxaUIsd0JBQVFod0IsUUFBUUMsR0FBUixDQUFZLFFBQVosQ0FBUjs7QUFDQSxxQkFBTzBOLFlBQVA7QUFDQ0EsaUNBQWUzTixRQUFRQyxHQUFSLENBQVksY0FBWixDQUFmO0FDZ0JPOztBRGZSLHFCQUFPME4sWUFBUDtBQUNDQSxpQ0FBZSxLQUFmO0FDaUJPOztBRGhCUnVoQiwyQkFBVzhCLEVBQVgsQ0FBYyxVQUFRaEIsS0FBUixHQUFjLEdBQWQsR0FBaUJyeEIsV0FBakIsR0FBNkIsUUFBN0IsR0FBcUNnUCxZQUFuRDtBQVRGO0FDNEJNOztBRGxCTixnQkFBRzBoQixhQUFjLE9BQU9BLFNBQVAsS0FBb0IsVUFBckM7QUFDQ0E7QUNvQks7O0FBQ0QsbUJEbkJMVixZQUFZYSxPQUFaLENBQW9CN3dCLFdBQXBCLEVBQWlDLFFBQWpDLEVBQTJDLE9BQTNDLEVBQW9EO0FBQUMyQixtQkFBSzJLLFNBQU47QUFBaUI2a0IsMkJBQWFBO0FBQTlCLGFBQXBELENDbUJLO0FEM0ROLGFBeUNFLFVBQUMxeUIsS0FBRDtBQ3VCSSxtQkR0Qkx1eEIsWUFBWWEsT0FBWixDQUFvQjd3QixXQUFwQixFQUFpQyxRQUFqQyxFQUEyQyxPQUEzQyxFQUFvRDtBQUFDMkIsbUJBQUsySyxTQUFOO0FBQWlCN04scUJBQU9BO0FBQXhCLGFBQXBELENDc0JLO0FEaEVOLFlDUUk7QUE2REQ7QUQvRU4sUUNPRztBRGpFSjtBQUFBLEdBRkQ7QUMrSUEsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQGRiID0ge31cclxuaWYgIUNyZWF0b3I/XHJcblx0QENyZWF0b3IgPSB7fVxyXG5DcmVhdG9yLk9iamVjdHMgPSB7fVxyXG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge31cclxuQ3JlYXRvci5NZW51cyA9IFtdXHJcbkNyZWF0b3IuQXBwcyA9IHt9XHJcbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9XHJcbkNyZWF0b3IuUmVwb3J0cyA9IHt9XHJcbkNyZWF0b3Iuc3VicyA9IHt9XHJcbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9IiwidGhpcy5kYiA9IHt9O1xuXG5pZiAodHlwZW9mIENyZWF0b3IgPT09IFwidW5kZWZpbmVkXCIgfHwgQ3JlYXRvciA9PT0gbnVsbCkge1xuICB0aGlzLkNyZWF0b3IgPSB7fTtcbn1cblxuQ3JlYXRvci5PYmplY3RzID0ge307XG5cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fTtcblxuQ3JlYXRvci5NZW51cyA9IFtdO1xuXG5DcmVhdG9yLkFwcHMgPSB7fTtcblxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge307XG5cbkNyZWF0b3IuUmVwb3J0cyA9IHt9O1xuXG5DcmVhdG9yLnN1YnMgPSB7fTtcblxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge307XG4iLCJ0cnlcclxuXHRpZiBNZXRlb3IuaXNEZXZlbG9wbWVudFxyXG5cdFx0c3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcclxuXHRcdG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKVxyXG5cdFx0TWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0b2JqZWN0cWwud3JhcEFzeW5jKHN0ZWVkb3NDb3JlLmluaXQpXHJcblx0XHRcdGNhdGNoIGV4XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcImVycm9yOlwiLGV4KVxyXG5jYXRjaCBlXHJcblx0Y29uc29sZS5lcnJvcihcImVycm9yOlwiLGUpIiwidmFyIGUsIG9iamVjdHFsLCBzdGVlZG9zQ29yZTtcblxudHJ5IHtcbiAgaWYgKE1ldGVvci5pc0RldmVsb3BtZW50KSB7XG4gICAgc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJyk7XG4gICAgb2JqZWN0cWwgPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpO1xuICAgIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGV4O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIG9iamVjdHFsLndyYXBBc3luYyhzdGVlZG9zQ29yZS5pbml0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4ID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgZSA9IGVycm9yO1xuICBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGUpO1xufVxuIiwiQ3JlYXRvci5kZXBzID0ge1xyXG5cdGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxyXG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxyXG59O1xyXG5cclxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XHJcblx0QXBwczoge30sXHJcblx0T2JqZWN0czoge31cclxufVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxyXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXHJcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2NyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxyXG5cclxuIyBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMg5L6bc3RlZWRvcy1jbGnpobnnm67kvb/nlKhcclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxyXG5cdENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XHJcblx0XHRGaWJlcigoKS0+XHJcblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcclxuXHRcdCkucnVuKClcclxuXHJcbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBvYmoubmFtZVxyXG5cclxuXHRpZiAhb2JqLmxpc3Rfdmlld3NcclxuXHRcdG9iai5saXN0X3ZpZXdzID0ge31cclxuXHJcblx0aWYgb2JqLnNwYWNlXHJcblx0XHRvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKVxyXG5cdGlmIG9iamVjdF9uYW1lID09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCdcclxuXHRcdG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xyXG5cdFx0b2JqID0gXy5jbG9uZShvYmopXHJcblx0XHRvYmoubmFtZSA9IG9iamVjdF9uYW1lXHJcblx0XHRDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqXHJcblxyXG5cdENyZWF0b3IuY29udmVydE9iamVjdChvYmopXHJcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XHJcblxyXG5cdENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKVxyXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcclxuXHRyZXR1cm4gb2JqXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxyXG5cdGlmIG9iamVjdC5zcGFjZVxyXG5cdFx0cmV0dXJuIFwiY18je29iamVjdC5zcGFjZX1fI3tvYmplY3QubmFtZX1cIlxyXG5cdHJldHVybiBvYmplY3QubmFtZVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3QgPSAob2JqZWN0X25hbWUsIHNwYWNlX2lkKS0+XHJcblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxyXG5cdFx0cmV0dXJuIDtcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxyXG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcbiNcdGlmICFzcGFjZV9pZCAmJiBvYmplY3RfbmFtZVxyXG4jXHRcdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKVxyXG4jXHRcdFx0c3BhY2VfaWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHJcblx0aWYgb2JqZWN0X25hbWVcclxuI1x0XHRpZiBzcGFjZV9pZFxyXG4jXHRcdFx0b2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY18je3NwYWNlX2lkfV8je29iamVjdF9uYW1lfVwiXVxyXG4jXHRcdFx0aWYgb2JqXHJcbiNcdFx0XHRcdHJldHVybiBvYmpcclxuI1xyXG4jXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XHJcbiNcdFx0XHRcdHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT0gb2JqZWN0X25hbWVcclxuI1x0XHRpZiBvYmpcclxuI1x0XHRcdHJldHVybiBvYmpcclxuXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gKG9iamVjdF9pZCktPlxyXG5cdHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtfaWQ6IG9iamVjdF9pZH0pXHJcblxyXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IChvYmplY3RfbmFtZSktPlxyXG5cdGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKVxyXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXHJcblx0ZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cclxuXHJcbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0aWYgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW0NyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uX2NvbGxlY3Rpb25fbmFtZV1cclxuXHJcbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXVxyXG5cclxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRzcGFjZSA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpPy5kYj8uZmluZE9uZShzcGFjZUlkLHtmaWVsZHM6e2FkbWluczoxfX0pXHJcblx0aWYgc3BhY2U/LmFkbWluc1xyXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMFxyXG5cclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKS0+XHJcblxyXG5cdGlmICFfLmlzU3RyaW5nKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIGZvcm11bGFyXHJcblxyXG5cdGlmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKVxyXG5cclxuXHRyZXR1cm4gZm9ybXVsYXJcclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGNvbnRleHQpLT5cclxuXHRzZWxlY3RvciA9IHt9XHJcblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cclxuXHRcdGlmIGZpbHRlcj8ubGVuZ3RoID09IDNcclxuXHRcdFx0bmFtZSA9IGZpbHRlclswXVxyXG5cdFx0XHRhY3Rpb24gPSBmaWx0ZXJbMV1cclxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpXHJcblx0XHRcdHNlbGVjdG9yW25hbWVdID0ge31cclxuXHRcdFx0c2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlXHJcblx0Y29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3RvcilcclxuXHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IChzcGFjZUlkKSAtPlxyXG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXHJcblxyXG4jIyNcclxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXHJcblx0aWRz77yaX2lk6ZuG5ZCIXHJcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcclxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXHJcbiMjI1xyXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IChkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KS0+XHJcblxyXG5cdGlmICFpZF9rZXlcclxuXHRcdGlkX2tleSA9IFwiX2lkXCJcclxuXHJcblx0aWYgaGl0X2ZpcnN0XHJcblxyXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcclxuXHRcdHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KVxyXG5cclxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxyXG5cdFx0XHRcdFx0X2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXHJcblx0XHRcdFx0XHRpZiBfaW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XHJcblx0XHRcdHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcclxuXHJcbiMjI1xyXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xyXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xyXG4jIyNcclxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gKHZhbHVlMSwgdmFsdWUyKSAtPlxyXG5cdGlmIHRoaXMua2V5XHJcblx0XHR2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldXHJcblx0XHR2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldXHJcblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxyXG5cdFx0dmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKVxyXG5cdGlmIHZhbHVlMiBpbnN0YW5jZW9mIERhdGVcclxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcclxuXHRpZiB0eXBlb2YgdmFsdWUxIGlzIFwibnVtYmVyXCIgYW5kIHR5cGVvZiB2YWx1ZTIgaXMgXCJudW1iZXJcIlxyXG5cdFx0cmV0dXJuIHZhbHVlMSAtIHZhbHVlMlxyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcclxuXHRpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09IG51bGwgb3IgdmFsdWUxID09IHVuZGVmaW5lZFxyXG5cdGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT0gbnVsbCBvciB2YWx1ZTIgPT0gdW5kZWZpbmVkXHJcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAtMVxyXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAwXHJcblx0aWYgIWlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAxXHJcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxyXG5cdHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlIHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGVcclxuXHJcblxyXG4jIOivpeWHveaVsOWPquWcqOWIneWni+WMlk9iamVjdOaXtu+8jOaKiuebuOWFs+WvueixoeeahOiuoeeul+e7k+aenOS/neWtmOWIsE9iamVjdOeahHJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4re+8jOWQjue7reWPr+S7peebtOaOpeS7jnJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4reWPluW+l+iuoeeul+e7k+aenOiAjOS4jeeUqOWGjeasoeiwg+eUqOivpeWHveaVsOadpeiuoeeul1xyXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IFtdXHJcblx0IyBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXHJcblx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRpZiAhX29iamVjdFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cdFxyXG5cdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxyXG5cdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XHJcblx0XHRyZWxhdGVkTGlzdE1hcCA9IHt9XHJcblx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpOYW1lKS0+XHJcblx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqTmFtZVxyXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fVxyXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XHJcblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cclxuXHRcdFx0XHRpZiAocmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lIGFuZCByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXVxyXG5cdFx0XHRcdFx0cmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7IG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmcgfVxyXG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddXHJcblx0XHRcdHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHsgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiIH1cclxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXVxyXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7IG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLCBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCIgfVxyXG5cdFx0Xy5lYWNoIFsndGFza3MnLCAnbm90ZXMnLCAnZXZlbnRzJywgJ2FwcHJvdmFscyddLCAoZW5hYmxlT2JqTmFtZSktPlxyXG5cdFx0XHRpZiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXVxyXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdID0geyBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiIH1cclxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ11cclxuXHRcdFx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxyXG5cdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXHJcblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHsgb2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XHJcblx0XHRyZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyByZWxhdGVkTGlzdE1hcFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9maWxlc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwifVxyXG5cclxuXHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cclxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cclxuXHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcclxuXHRcdFx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwib2JqZWN0X2ZpZWxkc1wiXHJcblx0XHRcdFx0XHQjVE9ETyDlvoXnm7jlhbPliJfooajmlK/mjIHmjpLluo/lkI7vvIzliKDpmaTmraTliKTmlq1cclxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWV9KVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmd9XHJcblxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJ0YXNrc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfbm90ZXNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ldmVudHNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImV2ZW50c1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wifVxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX2FwcHJvdmFsc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHQjcmVjb3JkIOivpue7huS4i+eahGF1ZGl0X3JlY29yZHPku4Vtb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5Y+v6KeBXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXHJcblx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHJcblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9ICh1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0cmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUXHJcblx0ZWxzZVxyXG5cdFx0aWYgISh1c2VySWQgYW5kIHNwYWNlSWQpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiXHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHRzdUZpZWxkcyA9IHtuYW1lOiAxLCBtb2JpbGU6IDEsIHBvc2l0aW9uOiAxLCBlbWFpbDogMSwgY29tcGFueTogMSwgb3JnYW5pemF0aW9uOiAxLCBzcGFjZTogMSwgY29tcGFueV9pZDogMSwgY29tcGFueV9pZHM6IDF9XHJcblx0XHQjIGNoZWNrIGlmIHVzZXIgaW4gdGhlIHNwYWNlXHJcblx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxyXG5cdFx0aWYgIXN1XHJcblx0XHRcdHNwYWNlSWQgPSBudWxsXHJcblxyXG5cdFx0IyBpZiBzcGFjZUlkIG5vdCBleGlzdHMsIGdldCB0aGUgZmlyc3Qgb25lLlxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0aWYgaXNVblNhZmVNb2RlXHJcblx0XHRcdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7dXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxyXG5cdFx0XHRcdGlmICFzdVxyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdFx0XHRzcGFjZUlkID0gc3Uuc3BhY2VcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBudWxsXHJcblxyXG5cdFx0VVNFUl9DT05URVhUID0ge31cclxuXHRcdFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWRcclxuXHRcdFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZFxyXG5cdFx0VVNFUl9DT05URVhULnVzZXIgPSB7XHJcblx0XHRcdF9pZDogdXNlcklkXHJcblx0XHRcdG5hbWU6IHN1Lm5hbWUsXHJcblx0XHRcdG1vYmlsZTogc3UubW9iaWxlLFxyXG5cdFx0XHRwb3NpdGlvbjogc3UucG9zaXRpb24sXHJcblx0XHRcdGVtYWlsOiBzdS5lbWFpbFxyXG5cdFx0XHRjb21wYW55OiBzdS5jb21wYW55XHJcblx0XHRcdGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWRcclxuXHRcdFx0Y29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXHJcblx0XHR9XHJcblx0XHRzcGFjZV91c2VyX29yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIik/LmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKVxyXG5cdFx0aWYgc3BhY2VfdXNlcl9vcmdcclxuXHRcdFx0VVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xyXG5cdFx0XHRcdF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxyXG5cdFx0XHRcdG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXHJcblx0XHRcdFx0ZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXHJcblx0XHRcdH1cclxuXHRcdHJldHVybiBVU0VSX0NPTlRFWFRcclxuXHJcbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSAodXJsKS0+XHJcblxyXG5cdGlmIF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAodXJsPy5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpKVxyXG5cdFx0aWYgIS9eXFwvLy50ZXN0KHVybClcclxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcclxuXHRcdHJldHVybiB1cmxcclxuXHJcblx0aWYgdXJsXHJcblx0XHQjIHVybOW8gOWktOayoeaciVwiL1wi77yM6ZyA6KaB5re75YqgXCIvXCJcclxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXHJcblx0XHRcdHVybCA9IFwiL1wiICsgdXJsXHJcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybFxyXG5cdGVsc2VcclxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYXHJcblxyXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSAodXNlcklkLCBzcGFjZUlkKS0+XHJcblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxyXG5cdGVsc2VcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcclxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWQ6MX19KVxyXG5cdHJldHVybiBzdS5jb21wYW55X2lkXHJcblxyXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gKHVzZXJJZCwgc3BhY2VJZCktPlxyXG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcclxuXHRlbHNlXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXHJcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkczoxfX0pXHJcblx0cmV0dXJuIHN1Py5jb21wYW55X2lkc1xyXG5cclxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSAocG8pLT5cclxuXHRpZiBwby5hbGxvd0NyZWF0ZVxyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLmFsbG93RWRpdFxyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLmFsbG93RGVsZXRlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0aWYgcG8udmlld0FsbFJlY29yZHNcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxyXG5cdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcclxuXHRyZXR1cm4gcG9cclxuXHJcbkNyZWF0b3IuZ2V0VGVtcGxhdGVTcGFjZUlkID0gKCktPlxyXG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWRcclxuXHJcbkNyZWF0b3IuZ2V0Q2xvdWRBZG1pblNwYWNlSWQgPSAoKS0+XHJcblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkXHJcblxyXG5DcmVhdG9yLmlzVGVtcGxhdGVTcGFjZSA9IChzcGFjZUlkKS0+XHJcblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWQgPT0gc3BhY2VJZFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSAoc3BhY2VJZCktPlxyXG5cdGlmIHNwYWNlSWQgJiYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWQgPT0gc3BhY2VJZFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdGlmIHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVJcclxuXHRcdENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSXHJcblx0ZWxzZVxyXG5cdFx0cGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG5cdFx0Q3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vY2ZzJykpXHJcbiIsInZhciBGaWJlciwgcGF0aDtcblxuQ3JlYXRvci5kZXBzID0ge1xuICBhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3ksXG4gIG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG4gIEFwcHM6IHt9LFxuICBPYmplY3RzOiB7fVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIG9wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICByZXR1cm4gU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGNyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG59KTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSk7XG4gICAgfSkucnVuKCk7XG4gIH07XG59XG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iai5uYW1lO1xuICB9XG4gIGlmICghb2JqLmxpc3Rfdmlld3MpIHtcbiAgICBvYmoubGlzdF92aWV3cyA9IHt9O1xuICB9XG4gIGlmIChvYmouc3BhY2UpIHtcbiAgICBvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUgPT09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCcpIHtcbiAgICBvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCc7XG4gICAgb2JqID0gXy5jbG9uZShvYmopO1xuICAgIG9iai5uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9iajtcbiAgfVxuICBDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKTtcbiAgbmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG4gIENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5pbml0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIG9iajtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0LnNwYWNlKSB7XG4gICAgcmV0dXJuIFwiY19cIiArIG9iamVjdC5zcGFjZSArIFwiX1wiICsgb2JqZWN0Lm5hbWU7XG4gIH1cbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgaWYgKF8uaXNBcnJheShvYmplY3RfbmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgICBpZiAoKHJlZjEgPSByZWYub2JqZWN0KSAhPSBudWxsKSB7XG4gICAgICAgIHJlZjEuZGVwZW5kKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSBmdW5jdGlvbihvYmplY3RfaWQpIHtcbiAgcmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge1xuICAgIF9pZDogb2JqZWN0X2lkXG4gIH0pO1xufTtcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSk7XG4gIGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zWyhyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuX2NvbGxlY3Rpb25fbmFtZSA6IHZvaWQgMF07XG4gIH1cbn07XG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgcmVmLCByZWYxLCBzcGFjZTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIikpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYikgIT0gbnVsbCA/IHJlZjEuZmluZE9uZShzcGFjZUlkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhZG1pbnM6IDFcbiAgICB9XG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBpZiAoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmFkbWlucyA6IHZvaWQgMCkge1xuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgaWYgKCFfLmlzU3RyaW5nKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBmb3JtdWxhcjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gZm9ybXVsYXI7XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGNvbnRleHQpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBzZWxlY3RvciA9IHt9O1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGFjdGlvbiwgbmFtZSwgdmFsdWU7XG4gICAgaWYgKChmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5sZW5ndGggOiB2b2lkIDApID09PSAzKSB7XG4gICAgICBuYW1lID0gZmlsdGVyWzBdO1xuICAgICAgYWN0aW9uID0gZmlsdGVyWzFdO1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpO1xuICAgICAgc2VsZWN0b3JbbmFtZV0gPSB7fTtcbiAgICAgIHJldHVybiBzZWxlY3RvcltuYW1lXVthY3Rpb25dID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgY29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3Rvcik7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIHNwYWNlSWQgPT09ICdjb21tb24nO1xufTtcblxuXG4vKlxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4gKi9cblxuQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMgPSBmdW5jdGlvbihkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KSB7XG4gIHZhciB2YWx1ZXM7XG4gIGlmICghaWRfa2V5KSB7XG4gICAgaWRfa2V5ID0gXCJfaWRcIjtcbiAgfVxuICBpZiAoaGl0X2ZpcnN0KSB7XG4gICAgdmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpO1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHZhciBfaW5kZXg7XG4gICAgICBfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgICBpZiAoX2luZGV4ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9pbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgfSk7XG4gIH1cbn07XG5cblxuLypcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuICovXG5cbkNyZWF0b3Iuc29ydGluZ01ldGhvZCA9IGZ1bmN0aW9uKHZhbHVlMSwgdmFsdWUyKSB7XG4gIHZhciBpc1ZhbHVlMUVtcHR5LCBpc1ZhbHVlMkVtcHR5LCBsb2NhbGU7XG4gIGlmICh0aGlzLmtleSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV07XG4gICAgdmFsdWUyID0gdmFsdWUyW3RoaXMua2V5XTtcbiAgfVxuICBpZiAodmFsdWUxIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHZhbHVlMiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTIgPSB2YWx1ZTIuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUxID09PSBcIm51bWJlclwiICYmIHR5cGVvZiB2YWx1ZTIgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gdmFsdWUxIC0gdmFsdWUyO1xuICB9XG4gIGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT09IG51bGwgfHwgdmFsdWUxID09PSB2b2lkIDA7XG4gIGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT09IG51bGwgfHwgdmFsdWUyID09PSB2b2lkIDA7XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmICFpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBpZiAoIWlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKCk7XG4gIHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlKHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGUpO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TWFwLCByZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IFtdO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICByZWxhdGVkTGlzdE1hcCA9IHt9O1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqTmFtZSkge1xuICAgICAgaWYgKF8uaXNPYmplY3Qob2JqTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSAmJiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgIHNoYXJpbmc6IHJlbGF0ZWRfZmllbGQuc2hhcmluZ1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICAgIH07XG4gICAgfVxuICAgIF8uZWFjaChbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgZnVuY3Rpb24oZW5hYmxlT2JqTmFtZSkge1xuICAgICAgaWYgKHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSxcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSkge1xuICAgICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyhyZWxhdGVkTGlzdE1hcCk7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZmlsZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiAmJiByZWxhdGVkX2ZpZWxkLnJlbGF0ZWRMaXN0KSkgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcIm9iamVjdF9maWVsZHNcIikge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgICAgICBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Rhc2tzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwidGFza3NcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ub3Rlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcIm5vdGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZXZlbnRzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiZXZlbnRzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfaW5zdGFuY2VzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfYXBwcm92YWxzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiYXBwcm92YWxzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpIHtcbiAgdmFyIFVTRVJfQ09OVEVYVCwgcmVmLCBzcGFjZV91c2VyX29yZywgc3UsIHN1RmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUO1xuICB9IGVsc2Uge1xuICAgIGlmICghKHVzZXJJZCAmJiBzcGFjZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN1RmllbGRzID0ge1xuICAgICAgbmFtZTogMSxcbiAgICAgIG1vYmlsZTogMSxcbiAgICAgIHBvc2l0aW9uOiAxLFxuICAgICAgZW1haWw6IDEsXG4gICAgICBjb21wYW55OiAxLFxuICAgICAgb3JnYW5pemF0aW9uOiAxLFxuICAgICAgc3BhY2U6IDEsXG4gICAgICBjb21wYW55X2lkOiAxLFxuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9O1xuICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgfSk7XG4gICAgaWYgKCFzdSkge1xuICAgICAgc3BhY2VJZCA9IG51bGw7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgaWYgKGlzVW5TYWZlTW9kZSkge1xuICAgICAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghc3UpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzcGFjZUlkID0gc3Uuc3BhY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgVVNFUl9DT05URVhUID0ge307XG4gICAgVVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZDtcbiAgICBVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWQ7XG4gICAgVVNFUl9DT05URVhULnVzZXIgPSB7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIG5hbWU6IHN1Lm5hbWUsXG4gICAgICBtb2JpbGU6IHN1Lm1vYmlsZSxcbiAgICAgIHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcbiAgICAgIGVtYWlsOiBzdS5lbWFpbCxcbiAgICAgIGNvbXBhbnk6IHN1LmNvbXBhbnksXG4gICAgICBjb21wYW55X2lkOiBzdS5jb21wYW55X2lkLFxuICAgICAgY29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXG4gICAgfTtcbiAgICBzcGFjZV91c2VyX29yZyA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpKSAhPSBudWxsID8gcmVmLmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKSA6IHZvaWQgMDtcbiAgICBpZiAoc3BhY2VfdXNlcl9vcmcpIHtcbiAgICAgIFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcbiAgICAgICAgX2lkOiBzcGFjZV91c2VyX29yZy5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXG4gICAgICAgIGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFVTRVJfQ09OVEVYVDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICBpZiAoXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICgodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9hc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSA6IHZvaWQgMCkpKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBpZiAodXJsKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWQ6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UuY29tcGFueV9pZDtcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdSAhPSBudWxsID8gc3UuY29tcGFueV9pZHMgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHBvKSB7XG4gIGlmIChwby5hbGxvd0NyZWF0ZSkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHBvO1xufTtcblxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYudGVtcGxhdGVTcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKHNwYWNlSWQgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYuY2xvdWRBZG1pblNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBpZiAocHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUikge1xuICAgIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSO1xuICB9IGVsc2Uge1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vY2ZzJykpO1xuICB9XG59XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdCMg55So5oi36I635Y+WbG9va3VwIOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrXnmoTpgInpobnlgLxcclxuXHRcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogKG9wdGlvbnMpLT5cclxuXHRcdGlmIG9wdGlvbnM/LnBhcmFtcz8ucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKVxyXG5cclxuXHRcdFx0bmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcclxuXHJcblx0XHRcdHF1ZXJ5ID0ge31cclxuXHRcdFx0aWYgb3B0aW9ucy5wYXJhbXMuc3BhY2VcclxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlXHJcblxyXG5cdFx0XHRcdHNvcnQgPSBvcHRpb25zPy5zb3J0XHJcblxyXG5cdFx0XHRcdHNlbGVjdGVkID0gb3B0aW9ucz8uc2VsZWN0ZWQgfHwgW11cclxuXHJcblx0XHRcdFx0b3B0aW9uc19saW1pdCA9IG9wdGlvbnM/Lm9wdGlvbnNfbGltaXQgfHwgMTBcclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XHJcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxyXG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH1cclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcclxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fSwgc2VhcmNoVGV4dFF1ZXJ5XVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fV1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdFx0XHRcdFx0Xy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSlcclxuXHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskbmluOiBzZWxlY3RlZH1cclxuXHJcblx0XHRcdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XHJcblx0XHRcdFx0XHRfLmV4dGVuZCBxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeVxyXG5cclxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiBvcHRpb25zX2xpbWl0fVxyXG5cclxuXHRcdFx0XHRpZiBzb3J0ICYmIF8uaXNPYmplY3Qoc29ydClcclxuXHRcdFx0XHRcdHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnRcclxuXHJcblx0XHRcdFx0aWYgY29sbGVjdGlvblxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKClcclxuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IFtdXHJcblx0XHRcdFx0XHRcdF8uZWFjaCByZWNvcmRzLCAocmVjb3JkKS0+XHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoXHJcblx0XHRcdFx0XHRcdFx0XHRsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XVxyXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlY29yZC5faWRcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcclxuXHRcdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxyXG5cdFx0cmV0dXJuIFtdICIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZSwgbmFtZV9maWVsZF9rZXksIG9iamVjdCwgb3B0aW9uc19saW1pdCwgcXVlcnksIHF1ZXJ5X29wdGlvbnMsIHJlY29yZHMsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2VhcmNoVGV4dFF1ZXJ5LCBzZWxlY3RlZCwgc29ydDtcbiAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZiA9IG9wdGlvbnMucGFyYW1zKSAhPSBudWxsID8gcmVmLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSk7XG4gICAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5wYXJhbXMuc3BhY2UpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZTtcbiAgICAgICAgc29ydCA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc29ydCA6IHZvaWQgMDtcbiAgICAgICAgc2VsZWN0ZWQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zZWxlY3RlZCA6IHZvaWQgMCkgfHwgW107XG4gICAgICAgIG9wdGlvbnNfbGltaXQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5vcHRpb25zX2xpbWl0IDogdm9pZCAwKSB8fCAxMDtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7XG4gICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYxID0gb3B0aW9ucy52YWx1ZXMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VhcmNoVGV4dFF1ZXJ5XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAkbmluOiBzZWxlY3RlZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyUXVlcnkpIHtcbiAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgcXVlcnlfb3B0aW9ucyA9IHtcbiAgICAgICAgICBsaW1pdDogb3B0aW9uc19saW1pdFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpKSB7XG4gICAgICAgICAgcXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpO1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHJlY29yZHMsIGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLl9pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxyXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXHJcblxyXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxyXG5cdFx0b2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZVxyXG5cdFx0cmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkXHJcblx0XHRzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkXHJcblxyXG5cdFx0Y2hlY2sgb2JqZWN0X25hbWUsIFN0cmluZ1xyXG5cdFx0Y2hlY2sgcmVjb3JkX2lkLCBTdHJpbmdcclxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcclxuXHJcblx0XHRpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZFxyXG5cdFx0eF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXVxyXG5cdFx0eF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXVxyXG5cclxuXHRcdHJlZGlyZWN0X3VybCA9IFwiL1wiXHJcblx0XHRpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpXHJcblx0XHQjIC0g5oiR55qE6I2J56i/5bCx6Lez6L2s6Iez6I2J56i/566xXHJcblx0XHQjIC0g5oiR55qE5b6F5a6h5qC45bCx6Lez6L2s6Iez5b6F5a6h5qC4XHJcblx0XHQjIC0g5LiN5piv5oiR55qE55Sz6K+35Y2V5YiZ6Lez6L2s6Iez5omT5Y2w6aG16Z2iXHJcblx0XHQjIC0g5aaC55Sz6K+35Y2V5LiN5a2Y5Zyo5YiZ5o+Q56S655So5oi355Sz6K+35Y2V5bey5Yig6Zmk77yM5bm25LiU5pu05pawcmVjb3Jk55qE54q25oCB77yM5L2/55So5oi35Y+v5Lul6YeN5paw5Y+R6LW35a6h5om5XHJcblx0XHRpZiBpbnNcclxuXHRcdFx0Ym94ID0gJydcclxuXHRcdFx0c3BhY2VJZCA9IGlucy5zcGFjZVxyXG5cdFx0XHRmbG93SWQgPSBpbnMuZmxvd1xyXG5cclxuXHRcdFx0aWYgKGlucy5pbmJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKSBvciAoaW5zLmNjX3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpXHJcblx0XHRcdFx0Ym94ID0gJ2luYm94J1xyXG5cdFx0XHRlbHNlIGlmIGlucy5vdXRib3hfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZFxyXG5cdFx0XHRcdGJveCA9ICdvdXRib3gnXHJcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdkcmFmdCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXHJcblx0XHRcdFx0Ym94ID0gJ2RyYWZ0J1xyXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAncGVuZGluZycgYW5kIChpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZCBvciBpbnMuYXBwbGljYW50IGlzIGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRib3ggPSAncGVuZGluZydcclxuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ2NvbXBsZXRlZCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXHJcblx0XHRcdFx0Ym94ID0gJ2NvbXBsZXRlZCdcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCMg6aqM6K+BbG9naW4gdXNlcl9pZOWvueivpea1geeoi+acieeuoeeQhueUs+ivt+WNleeahOadg+mZkFxyXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKVxyXG5cdFx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwgeyBmaWVsZHM6IHsgYWRtaW5zOiAxIH0gfSlcclxuXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIG9yIHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpXHJcblx0XHRcdFx0XHRib3ggPSAnbW9uaXRvcidcclxuXHJcblx0XHRcdGlmIGJveFxyXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9IFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS8je2JveH0vI3tpbnNJZH0/WC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9IFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS9wcmludC8je2luc0lkfT9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxyXG5cclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRcdGRhdGE6IHsgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmwgfVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcclxuXHRcdFx0aWYgY29sbGVjdGlvblxyXG5cdFx0XHRcdGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xyXG5cdFx0XHRcdFx0JHB1bGw6IHtcclxuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZXNcIjoge1xyXG5cdFx0XHRcdFx0XHRcdFwiX2lkXCI6IGluc0lkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKVxyXG5cclxuXHRjYXRjaCBlXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxyXG5cdFx0fVxyXG5cclxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJveCwgY29sbGVjdGlvbiwgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgZmxvd0lkLCBoYXNoRGF0YSwgaW5zLCBpbnNJZCwgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25zLCByZWNvcmRfaWQsIHJlZGlyZWN0X3VybCwgcmVmLCByZWYxLCByZWYyLCBzcGFjZSwgc3BhY2VJZCwgc3BhY2VfaWQsIHhfYXV0aF90b2tlbiwgeF91c2VyX2lkO1xuICB0cnkge1xuICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgY3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkO1xuICAgIGhhc2hEYXRhID0gcmVxLmJvZHk7XG4gICAgb2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZTtcbiAgICByZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWQ7XG4gICAgc3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZDtcbiAgICBjaGVjayhvYmplY3RfbmFtZSwgU3RyaW5nKTtcbiAgICBjaGVjayhyZWNvcmRfaWQsIFN0cmluZyk7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgaW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWQ7XG4gICAgeF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICB4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddO1xuICAgIHJlZGlyZWN0X3VybCA9IFwiL1wiO1xuICAgIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCk7XG4gICAgaWYgKGlucykge1xuICAgICAgYm94ID0gJyc7XG4gICAgICBzcGFjZUlkID0gaW5zLnNwYWNlO1xuICAgICAgZmxvd0lkID0gaW5zLmZsb3c7XG4gICAgICBpZiAoKChyZWYgPSBpbnMuaW5ib3hfdXNlcnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkgfHwgKChyZWYxID0gaW5zLmNjX3VzZXJzKSAhPSBudWxsID8gcmVmMS5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSkge1xuICAgICAgICBib3ggPSAnaW5ib3gnO1xuICAgICAgfSBlbHNlIGlmICgocmVmMiA9IGlucy5vdXRib3hfdXNlcnMpICE9IG51bGwgPyByZWYyLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHtcbiAgICAgICAgYm94ID0gJ291dGJveCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2RyYWZ0JyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2RyYWZ0JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAncGVuZGluZycgJiYgKGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCB8fCBpbnMuYXBwbGljYW50ID09PSBjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgIGJveCA9ICdwZW5kaW5nJztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2NvbXBsZXRlZCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZCk7XG4gICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgYWRtaW5zOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgfHwgc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkpIHtcbiAgICAgICAgICBib3ggPSAnbW9uaXRvcic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChib3gpIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9cIiArIGJveCArIFwiL1wiICsgaW5zSWQgKyBcIj9YLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWRpcmVjdF91cmwgPSBcIndvcmtmbG93L3NwYWNlL1wiICsgc3BhY2VJZCArIFwiL3ByaW50L1wiICsgaW5zSWQgKyBcIj9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW47XG4gICAgICB9XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICBjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgXCJpbnN0YW5jZXNcIjoge1xuICAgICAgICAgICAgICBcIl9pZFwiOiBpbnNJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+eUs+ivt+WNleW3suWIoOmZpCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpIC0+XHJcblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKT8uX3NjaGVtYVxyXG5cdGNvbHVtbl9udW0gPSAwXHJcblx0aWYgX3NjaGVtYVxyXG5cdFx0Xy5lYWNoIGNvbHVtbnMsIChmaWVsZF9uYW1lKSAtPlxyXG5cdFx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxyXG5cdFx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXHJcblx0XHRcdGlmIGlzX3dpZGVcclxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMVxyXG5cclxuXHRcdGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW1cclxuXHRcdHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnRcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIC0+XHJcblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hXHJcblx0aWYgX3NjaGVtYVxyXG5cdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcclxuXHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcclxuXHRcdHJldHVybiBpc193aWRlXHJcblxyXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSAtPlxyXG5cdHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zPy5zZXR0aW5ncz8uZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wifSlcclxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRjb2x1bW5zID0gXy5tYXAgY29sdW1ucywgKGNvbHVtbiktPlxyXG5cdFx0ZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl1cclxuXHRcdGlmIGZpZWxkPy50eXBlIGFuZCAhZmllbGQuaGlkZGVuXHJcblx0XHRcdHJldHVybiBjb2x1bW5cclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdGNvbHVtbnMgPSBfLmNvbXBhY3QgY29sdW1uc1xyXG5cdGlmIHNldHRpbmcgYW5kIHNldHRpbmcuc2V0dGluZ3NcclxuXHRcdHNvcnQgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0/LnNvcnQgfHwgW11cclxuXHRcdHNvcnQgPSBfLm1hcCBzb3J0LCAob3JkZXIpLT5cclxuXHRcdFx0a2V5ID0gb3JkZXJbMF1cclxuXHRcdFx0aW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KVxyXG5cdFx0XHRvcmRlclswXSA9IGluZGV4ICsgMVxyXG5cdFx0XHRyZXR1cm4gb3JkZXJcclxuXHRcdHJldHVybiBzb3J0XHJcblx0cmV0dXJuIFtdXHJcblxyXG5cclxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cclxuXHRleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl1cclxuXHRkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdXHJcblx0aWYgZGVmYXVsdF9leHRyYV9jb2x1bW5zXHJcblx0XHRleHRyYV9jb2x1bW5zID0gXy51bmlvbiBleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcclxuXHJcblx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0Q3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHM/W29iamVjdF9uYW1lXSA9IFtdXHJcblxyXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IChkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpLT5cclxuXHRkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/LmNvbHVtbnNcclxuXHRkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3Py5tb2JpbGVfY29sdW1uc1xyXG5cdHVubGVzcyBsaXN0X3ZpZXdcclxuXHRcdHJldHVyblxyXG5cdG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpXHJcblx0aWYgIV8uaGFzKG9pdGVtLCBcIm5hbWVcIilcclxuXHRcdG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZVxyXG5cdGlmICFvaXRlbS5jb2x1bW5zXHJcblx0XHRpZiBkZWZhdWx0X2NvbHVtbnNcclxuXHRcdFx0b2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1uc1xyXG5cdGlmICFvaXRlbS5jb2x1bW5zXHJcblx0XHRvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXVxyXG5cdGlmICFvaXRlbS5tb2JpbGVfY29sdW1uc1xyXG5cdFx0aWYgZGVmYXVsdF9tb2JpbGVfY29sdW1uc1xyXG5cdFx0XHRvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcclxuXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKVxyXG5cdFx0XHRvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJylcclxuXHJcblxyXG5cdGlmICFvaXRlbS5maWx0ZXJfc2NvcGVcclxuXHRcdCMgbGlzdHZpZXfop4blm77nmoRmaWx0ZXJfc2NvcGXpu5jorqTlgLzmlLnkuLpzcGFjZSAjMTMxXHJcblx0XHRvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCJcclxuXHJcblx0aWYgIV8uaGFzKG9pdGVtLCBcIl9pZFwiKVxyXG5cdFx0b2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWVcclxuXHRlbHNlXHJcblx0XHRvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lXHJcblxyXG5cdGlmIF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucylcclxuXHRcdG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpXHJcblxyXG5cdF8uZm9yRWFjaCBvaXRlbS5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cclxuXHRcdGlmICFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcilcclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXHJcblx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXHJcblx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcclxuXHRyZXR1cm4gb2l0ZW1cclxuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHR1bmxlc3Mgb2JqZWN0X25hbWVcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRyZWxhdGVkTGlzdE9iamVjdHMgPSB7fVxyXG5cdFx0cmVsYXRlZExpc3ROYW1lcyA9IFtdXHJcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxyXG5cdFx0aWYgX29iamVjdFxyXG5cdFx0XHRyZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3RcclxuXHRcdFx0aWYgIV8uaXNFbXB0eSByZWxhdGVkTGlzdFxyXG5cdFx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdCwgKG9iak9yTmFtZSktPlxyXG5cdFx0XHRcdFx0aWYgXy5pc09iamVjdCBvYmpPck5hbWVcclxuXHRcdFx0XHRcdFx0cmVsYXRlZCA9XHJcblx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lXHJcblx0XHRcdFx0XHRcdFx0Y29sdW1uczogb2JqT3JOYW1lLmNvbHVtbnNcclxuXHRcdFx0XHRcdFx0XHRtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zXHJcblx0XHRcdFx0XHRcdFx0aXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT0gXCJjbXNfZmlsZXNcIlxyXG5cdFx0XHRcdFx0XHRcdGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnNcclxuXHRcdFx0XHRcdFx0XHRzb3J0OiBvYmpPck5hbWUuc29ydFxyXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogJydcclxuXHRcdFx0XHRcdFx0XHRjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBvYmpPck5hbWUubGFiZWxcclxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWRcclxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3ROYW1lcy5wdXNoIG9iak9yTmFtZS5vYmplY3ROYW1lXHJcblx0XHRcdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcgb2JqT3JOYW1lXHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWVcclxuXHJcblx0XHRtYXBMaXN0ID0ge31cclxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXHJcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3RfaXRlbSkgLT5cclxuXHRcdFx0aWYgIXJlbGF0ZWRfb2JqZWN0X2l0ZW0/Lm9iamVjdF9uYW1lXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lXHJcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXlcclxuXHRcdFx0c2hhcmluZyA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uc2hhcmluZ1xyXG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHVubGVzcyByZWxhdGVkX29iamVjdFxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXHJcblx0XHRcdGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxyXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXVxyXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxyXG5cclxuXHRcdFx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpXHJcblxyXG5cdFx0XHRpZiAvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSlcclxuXHRcdFx0XHQjIG9iamVjdOexu+Wei+W4puWtkOWxnuaAp+eahHJlbGF0ZWRfZmllbGRfbmFtZeimgeWOu+aOieS4remXtOeahOe+juWFg+espuWPt++8jOWQpuWImeaYvuekuuS4jeWHuuWtl+auteWAvFxyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLFwiXCIpXHJcblx0XHRcdHJlbGF0ZWQgPVxyXG5cdFx0XHRcdG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lXHJcblx0XHRcdFx0Y29sdW1uczogY29sdW1uc1xyXG5cdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBtb2JpbGVfY29sdW1uc1xyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXHJcblx0XHRcdFx0aXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHRcdFx0c2hhcmluZzogc2hhcmluZ1xyXG5cclxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxyXG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0XHJcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jb2x1bW5zXHJcblx0XHRcdFx0XHRyZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnNcclxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXHJcblx0XHRcdFx0XHRyZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1uc1xyXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3Quc29ydFxyXG5cdFx0XHRcdFx0cmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0XHJcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cclxuXHRcdFx0XHRcdHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cclxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XHJcblx0XHRcdFx0XHRyZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxyXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubGFiZWxcclxuXHRcdFx0XHRcdHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsXHJcblx0XHRcdFx0ZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxyXG5cclxuXHRcdFx0bWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWRcclxuXHJcblxyXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0XHR1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcclxuXHRcdF8uZWFjaCByZWxhdGVkTGlzdE9iamVjdHMsICh2LCByZWxhdGVkX29iamVjdF9uYW1lKSAtPlxyXG5cdFx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxyXG5cdFx0XHRhbGxvd1JlYWQgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmFsbG93UmVhZFxyXG5cdFx0XHRpZiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWRcclxuXHRcdFx0XHRtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdlxyXG5cclxuXHRcdGxpc3QgPSBbXVxyXG5cdFx0aWYgXy5pc0VtcHR5IHJlbGF0ZWRMaXN0TmFtZXNcclxuXHRcdFx0bGlzdCA9ICBfLnZhbHVlcyBtYXBMaXN0XHJcblx0XHRlbHNlXHJcblx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdE5hbWVzLCAob2JqZWN0TmFtZSkgLT5cclxuXHRcdFx0XHRpZiBtYXBMaXN0W29iamVjdE5hbWVdXHJcblx0XHRcdFx0XHRsaXN0LnB1c2ggbWFwTGlzdFtvYmplY3ROYW1lXVxyXG5cclxuXHRcdGlmIF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpXHJcblx0XHRcdGxpc3QgPSBfLmZpbHRlciBsaXN0LCAoaXRlbSktPlxyXG5cdFx0XHRcdHJldHVybiBfLmluY2x1ZGUoX29iamVjdC5hbGxvd19yZWxhdGVkTGlzdCwgaXRlbS5vYmplY3RfbmFtZSlcclxuXHJcblx0XHRyZXR1cm4gbGlzdFxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0cmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKVxyXG5cclxuIyMjIFxyXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxyXG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XHJcbiMjI1xyXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcclxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRpZiAhb2JqZWN0XHJcblx0XHRyZXR1cm5cclxuXHRsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSlcclxuXHR1bmxlc3MgbGlzdFZpZXdzPy5sZW5ndGhcclxuXHRcdHJldHVyblxyXG5cdGxpc3RfdmlldyA9IF8uZmluZFdoZXJlKGxpc3RWaWV3cyx7XCJfaWRcIjpsaXN0X3ZpZXdfaWR9KVxyXG5cdHVubGVzcyBsaXN0X3ZpZXdcclxuXHRcdCMg5aaC5p6c5LiN6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5YiZ6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+77yM5Y+N5LmL6L+U5Zue56m6XHJcblx0XHRpZiBleGFjXHJcblx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF1cclxuXHRyZXR1cm4gbGlzdF92aWV3XHJcblxyXG4j6I635Y+WbGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+5piv5ZCm5piv5pyA6L+R5p+l55yL6KeG5Zu+XHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRpZiAhbGlzdF92aWV3X2lkXHJcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXHJcblx0aWYgdHlwZW9mKGxpc3Rfdmlld19pZCkgPT0gXCJzdHJpbmdcIlxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRpZiAhb2JqZWN0XHJcblx0XHRcdHJldHVyblxyXG5cdFx0bGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cyx7X2lkOiBsaXN0X3ZpZXdfaWR9KVxyXG5cdGVsc2VcclxuXHRcdGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkXHJcblx0cmV0dXJuIGxpc3RWaWV3Py5uYW1lID09IFwicmVjZW50XCJcclxuXHJcblxyXG4jIyNcclxuICAgIOS7jmNvbHVtbnPlj4LmlbDkuK3ov4fmu6Tlh7rnlKjkuo7miYvmnLrnq6/mmL7npLrnmoRjb2x1bW5zXHJcblx06KeE5YiZ77yaXHJcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxyXG5cdDIu5pyA5aSa5Y+q6L+U5ZueNOS4quWtl+autVxyXG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXHJcbiMjI1xyXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKS0+XHJcblx0cmVzdWx0ID0gW11cclxuXHRtYXhSb3dzID0gMiBcclxuXHRtYXhDb3VudCA9IG1heFJvd3MgKiAyXHJcblx0Y291bnQgPSAwXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0ZmllbGRzID0gb2JqZWN0LmZpZWxkc1xyXG5cdHVubGVzcyBvYmplY3RcclxuXHRcdHJldHVybiBjb2x1bW5zXHJcblx0bmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxyXG5cdGlzTmFtZUNvbHVtbiA9IChpdGVtKS0+XHJcblx0XHRpZiBfLmlzT2JqZWN0KGl0ZW0pXHJcblx0XHRcdHJldHVybiBpdGVtLmZpZWxkID09IG5hbWVLZXlcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIGl0ZW0gPT0gbmFtZUtleVxyXG5cdGdldEZpZWxkID0gKGl0ZW0pLT5cclxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0cmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW1dXHJcblx0aWYgbmFtZUtleVxyXG5cdFx0bmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZCAoaXRlbSktPlxyXG5cdFx0XHRyZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pXHJcblx0aWYgbmFtZUNvbHVtblxyXG5cdFx0ZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKVxyXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXHJcblx0XHRjb3VudCArPSBpdGVtQ291bnRcclxuXHRcdHJlc3VsdC5wdXNoIG5hbWVDb2x1bW5cclxuXHRjb2x1bW5zLmZvckVhY2ggKGl0ZW0pLT5cclxuXHRcdGZpZWxkID0gZ2V0RmllbGQoaXRlbSlcclxuXHRcdHVubGVzcyBmaWVsZFxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGl0ZW1Db3VudCA9IGlmIGZpZWxkLmlzX3dpZGUgdGhlbiAyIGVsc2UgMVxyXG5cdFx0aWYgY291bnQgPCBtYXhDb3VudCBhbmQgcmVzdWx0Lmxlbmd0aCA8IG1heENvdW50IGFuZCAhaXNOYW1lQ29sdW1uKGl0ZW0pXHJcblx0XHRcdGNvdW50ICs9IGl0ZW1Db3VudFxyXG5cdFx0XHRpZiBjb3VudCA8PSBtYXhDb3VudFxyXG5cdFx0XHRcdHJlc3VsdC5wdXNoIGl0ZW1cclxuXHRcclxuXHRyZXR1cm4gcmVzdWx0XHJcblxyXG4jIyNcclxuICAgIOiOt+WPlum7mOiupOinhuWbvlxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IChvYmplY3RfbmFtZSktPlxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGlmICFvYmplY3RcclxuXHRcdG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRpZiBvYmplY3Q/Lmxpc3Rfdmlld3M/LmRlZmF1bHRcclxuXHRcdCNUT0RPIOatpOS7o+eggeWPquaYr+aaguaXtuWFvOWuueS7peWJjWNvZGXkuK3lrprkuYnnmoRkZWZhdWx06KeG5Zu+77yM5b6FY29kZeS4reeahGRlZmF1bHTmuIXnkIblrozmiJDlkI7vvIzpnIDopoHliKDpmaTmraTku6PnoIFcclxuXHRcdGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3MuZGVmYXVsdFxyXG5cdGVsc2VcclxuXHRcdF8uZWFjaCBvYmplY3Q/Lmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcsIGtleSktPlxyXG5cdFx0XHRpZiBsaXN0X3ZpZXcubmFtZSA9PSBcImFsbFwiIHx8IGtleSA9PSBcImFsbFwiXHJcblx0XHRcdFx0ZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXdcclxuXHRyZXR1cm4gZGVmYXVsdFZpZXc7XHJcblxyXG4jIyNcclxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IChvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdGNvbHVtbnMgPSBkZWZhdWx0Vmlldz8uY29sdW1uc1xyXG5cdGlmIHVzZV9tb2JpbGVfY29sdW1uc1xyXG5cdFx0aWYgZGVmYXVsdFZpZXc/Lm1vYmlsZV9jb2x1bW5zXHJcblx0XHRcdGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1uc1xyXG5cdFx0ZWxzZSBpZiBjb2x1bW5zXHJcblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKVxyXG5cdHJldHVybiBjb2x1bW5zXHJcblxyXG4jIyNcclxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcclxuIyMjXHJcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcclxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmV4dHJhX2NvbHVtbnNcclxuXHJcbiMjI1xyXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcclxuXHRpZiBkZWZhdWx0Vmlld1xyXG5cdFx0aWYgZGVmYXVsdFZpZXcuc29ydFxyXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFZpZXcuc29ydFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXVxyXG5cclxuXHJcbiMjI1xyXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcclxuIyMjXHJcbkNyZWF0b3IuaXNBbGxWaWV3ID0gKGxpc3RfdmlldyktPlxyXG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJhbGxcIlxyXG5cclxuIyMjXHJcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xyXG4jIyNcclxuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSAobGlzdF92aWV3KS0+XHJcblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcInJlY2VudFwiXHJcblxyXG4jIyNcclxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXHJcbiMjI1xyXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSAoc29ydCwgdGFidWxhckNvbHVtbnMpLT5cclxuXHR0YWJ1bGFyX3NvcnQgPSBbXVxyXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxyXG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXHJcblx0XHRcdCMg5YW85a655pen55qE5pWw5o2u5qC85byPW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cclxuXHRcdFx0aWYgaXRlbS5sZW5ndGggPT0gMVxyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcclxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgXCJhc2NcIl1cclxuXHRcdFx0ZWxzZSBpZiBpdGVtLmxlbmd0aCA9PSAyXHJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxyXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXHJcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBpdGVtWzFdXVxyXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXHJcblx0XHRcdCPmlrDmlbDmja7moLzlvI/vvJpbe2ZpZWxkX25hbWU6ICwgb3JkZXI6IH1dXHJcblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcclxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXHJcblx0XHRcdGlmIGZpZWxkX25hbWUgJiYgb3JkZXJcclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpXHJcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcclxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIG9yZGVyXVxyXG5cclxuXHRyZXR1cm4gdGFidWxhcl9zb3J0XHJcblxyXG4jIyNcclxuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXHJcbiMjI1xyXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gKHNvcnQpLT5cclxuXHRkeF9zb3J0ID0gW11cclxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cclxuXHRcdGlmIF8uaXNBcnJheShpdGVtKVxyXG5cdFx0XHQj5YW85a655pen5qC85byP77yaW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cclxuXHRcdFx0ZHhfc29ydC5wdXNoKGl0ZW0pXHJcblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cclxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxyXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxyXG5cdFx0XHRcdGR4X3NvcnQucHVzaCBbZmllbGRfbmFtZSwgb3JkZXJdXHJcblxyXG5cdHJldHVybiBkeF9zb3J0XHJcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBfc2NoZW1hLCBjb2x1bW5fbnVtLCBpbml0X3dpZHRoX3BlcmNlbnQsIHJlZjtcbiAgX3NjaGVtYSA9IChyZWYgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuX3NjaGVtYSA6IHZvaWQgMDtcbiAgY29sdW1uX251bSA9IDA7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICAgIHZhciBmaWVsZCwgaXNfd2lkZSwgcmVmMSwgcmVmMjtcbiAgICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgICAgaXNfd2lkZSA9IChyZWYxID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYyLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNfd2lkZSkge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtO1xuICAgIHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkge1xuICB2YXIgX3NjaGVtYSwgZmllbGQsIGlzX3dpZGUsIHJlZiwgcmVmMTtcbiAgX3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgIGlzX3dpZGUgPSAocmVmID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICByZXR1cm4gaXNfd2lkZTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRUYWJ1bGFyT3JkZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSB7XG4gIHZhciBvYmosIHJlZiwgcmVmMSwgcmVmMiwgc2V0dGluZywgc29ydDtcbiAgc2V0dGluZyA9IChyZWYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zKSAhPSBudWxsID8gKHJlZjEgPSByZWYuc2V0dGluZ3MpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBfLm1hcChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICB2YXIgZmllbGQ7XG4gICAgZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl07XG4gICAgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkgJiYgIWZpZWxkLmhpZGRlbikge1xuICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gIH0pO1xuICBjb2x1bW5zID0gXy5jb21wYWN0KGNvbHVtbnMpO1xuICBpZiAoc2V0dGluZyAmJiBzZXR0aW5nLnNldHRpbmdzKSB7XG4gICAgc29ydCA9ICgocmVmMiA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXSkgIT0gbnVsbCA/IHJlZjIuc29ydCA6IHZvaWQgMCkgfHwgW107XG4gICAgc29ydCA9IF8ubWFwKHNvcnQsIGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICB2YXIgaW5kZXgsIGtleTtcbiAgICAgIGtleSA9IG9yZGVyWzBdO1xuICAgICAgaW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KTtcbiAgICAgIG9yZGVyWzBdID0gaW5kZXggKyAxO1xuICAgICAgcmV0dXJuIG9yZGVyO1xuICAgIH0pO1xuICAgIHJldHVybiBzb3J0O1xuICB9XG4gIHJldHVybiBbXTtcbn07XG5cbkNyZWF0b3IuaW5pdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMsIGV4dHJhX2NvbHVtbnMsIG9iamVjdCwgb3JkZXIsIHJlZjtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXTtcbiAgZXh0cmFfY29sdW1ucyA9IFtcIm93bmVyXCJdO1xuICBkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdO1xuICBpZiAoZGVmYXVsdF9leHRyYV9jb2x1bW5zKSB7XG4gICAgZXh0cmFfY29sdW1ucyA9IF8udW5pb24oZXh0cmFfY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zKTtcbiAgfVxuICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkcykgIT0gbnVsbCA/IHJlZltvYmplY3RfbmFtZV0gPSBbXSA6IHZvaWQgMDtcbiAgfVxufTtcblxuQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcgPSBmdW5jdGlvbihkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRfY29sdW1ucywgZGVmYXVsdF9tb2JpbGVfY29sdW1ucywgb2l0ZW07XG4gIGRlZmF1bHRfY29sdW1ucyA9IGRlZmF1bHRfdmlldyAhPSBudWxsID8gZGVmYXVsdF92aWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcgIT0gbnVsbCA/IGRlZmF1bHRfdmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb2l0ZW0gPSBfLmNsb25lKGxpc3Rfdmlldyk7XG4gIGlmICghXy5oYXMob2l0ZW0sIFwibmFtZVwiKSkge1xuICAgIG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZTtcbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9jb2x1bW5zKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zID0gZGVmYXVsdF9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXTtcbiAgfVxuICBpZiAoIW9pdGVtLm1vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLm1vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF9tb2JpbGVfY29sdW1ucztcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKSkge1xuICAgICAgb2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmZpbHRlcl9zY29wZSkge1xuICAgIG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIjtcbiAgfVxuICBpZiAoIV8uaGFzKG9pdGVtLCBcIl9pZFwiKSkge1xuICAgIG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lO1xuICB9IGVsc2Uge1xuICAgIG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWU7XG4gIH1cbiAgaWYgKF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucykpIHtcbiAgICBvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKTtcbiAgfVxuICBfLmZvckVhY2gob2l0ZW0uZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICBpZiAoIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9pdGVtO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX29iamVjdCwgbGlzdCwgbWFwTGlzdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRMaXN0LCByZWxhdGVkTGlzdE5hbWVzLCByZWxhdGVkTGlzdE9iamVjdHMsIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCByZWxhdGVkX29iamVjdHMsIHNwYWNlSWQsIHVucmVsYXRlZF9vYmplY3RzLCB1c2VySWQ7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZWxhdGVkTGlzdE9iamVjdHMgPSB7fTtcbiAgICByZWxhdGVkTGlzdE5hbWVzID0gW107XG4gICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gICAgaWYgKF9vYmplY3QpIHtcbiAgICAgIHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdDtcbiAgICAgIGlmICghXy5pc0VtcHR5KHJlbGF0ZWRMaXN0KSkge1xuICAgICAgICBfLmVhY2gocmVsYXRlZExpc3QsIGZ1bmN0aW9uKG9iak9yTmFtZSkge1xuICAgICAgICAgIHZhciByZWxhdGVkO1xuICAgICAgICAgIGlmIChfLmlzT2JqZWN0KG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmpPck5hbWUub2JqZWN0TmFtZSxcbiAgICAgICAgICAgICAgY29sdW1uczogb2JqT3JOYW1lLmNvbHVtbnMsXG4gICAgICAgICAgICAgIG1vYmlsZV9jb2x1bW5zOiBvYmpPck5hbWUubW9iaWxlX2NvbHVtbnMsXG4gICAgICAgICAgICAgIGlzX2ZpbGU6IG9iak9yTmFtZS5vYmplY3ROYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICAgICAgICBmaWx0ZXJzRnVuY3Rpb246IG9iak9yTmFtZS5maWx0ZXJzLFxuICAgICAgICAgICAgICBzb3J0OiBvYmpPck5hbWUuc29ydCxcbiAgICAgICAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiAnJyxcbiAgICAgICAgICAgICAgY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWUsXG4gICAgICAgICAgICAgIGxhYmVsOiBvYmpPck5hbWUubGFiZWxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZWxhdGVkTGlzdE9iamVjdHNbb2JqT3JOYW1lLm9iamVjdE5hbWVdID0gcmVsYXRlZDtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE5hbWVzLnB1c2gob2JqT3JOYW1lLm9iamVjdE5hbWUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhvYmpPck5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3ROYW1lcy5wdXNoKG9iak9yTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgbWFwTGlzdCA9IHt9O1xuICAgIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpO1xuICAgIF8uZWFjaChyZWxhdGVkX29iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIHtcbiAgICAgIHZhciBjb2x1bW5zLCBtb2JpbGVfY29sdW1ucywgb3JkZXIsIHJlbGF0ZWQsIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNoYXJpbmcsIHRhYnVsYXJfb3JkZXI7XG4gICAgICBpZiAoIShyZWxhdGVkX29iamVjdF9pdGVtICE9IG51bGwgPyByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZTtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXk7XG4gICAgICBzaGFyaW5nID0gcmVsYXRlZF9vYmplY3RfaXRlbS5zaGFyaW5nO1xuICAgICAgcmVsYXRlZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIGlmICghcmVsYXRlZF9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXTtcbiAgICAgIGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG1vYmlsZV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lLCB0cnVlKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgbW9iaWxlX2NvbHVtbnMgPSBfLndpdGhvdXQobW9iaWxlX2NvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gICAgICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICB0YWJ1bGFyX29yZGVyID0gQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyKG9yZGVyLCBjb2x1bW5zKTtcbiAgICAgIGlmICgvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSkpIHtcbiAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9maWVsZF9uYW1lLnJlcGxhY2UoL1xcJFxcLi8sIFwiXCIpO1xuICAgICAgfVxuICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgIG1vYmlsZV9jb2x1bW5zOiBtb2JpbGVfY29sdW1ucyxcbiAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgIGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIHNoYXJpbmc6IHNoYXJpbmdcbiAgICAgIH07XG4gICAgICByZWxhdGVkT2JqZWN0ID0gcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKHJlbGF0ZWRPYmplY3QpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY29sdW1ucykge1xuICAgICAgICAgIHJlbGF0ZWQuY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QuY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucykge1xuICAgICAgICAgIHJlbGF0ZWQubW9iaWxlX2NvbHVtbnMgPSByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LnNvcnQpIHtcbiAgICAgICAgICByZWxhdGVkLnNvcnQgPSByZWxhdGVkT2JqZWN0LnNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgcmVsYXRlZC5maWx0ZXJzRnVuY3Rpb24gPSByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCkge1xuICAgICAgICAgIHJlbGF0ZWQuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QgPSByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmxhYmVsKSB7XG4gICAgICAgICAgcmVsYXRlZC5sYWJlbCA9IHJlbGF0ZWRPYmplY3QubGFiZWw7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXBMaXN0W3JlbGF0ZWQub2JqZWN0X25hbWVdID0gcmVsYXRlZDtcbiAgICB9KTtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKTtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgdW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdE9iamVjdHMsIGZ1bmN0aW9uKHYsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWY7XG4gICAgICBpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMTtcbiAgICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgICAgaWYgKGlzQWN0aXZlICYmIGFsbG93UmVhZCkge1xuICAgICAgICByZXR1cm4gbWFwTGlzdFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHY7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbGlzdCA9IFtdO1xuICAgIGlmIChfLmlzRW1wdHkocmVsYXRlZExpc3ROYW1lcykpIHtcbiAgICAgIGxpc3QgPSBfLnZhbHVlcyhtYXBMaXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKHJlbGF0ZWRMaXN0TmFtZXMsIGZ1bmN0aW9uKG9iamVjdE5hbWUpIHtcbiAgICAgICAgaWYgKG1hcExpc3Rbb2JqZWN0TmFtZV0pIHtcbiAgICAgICAgICByZXR1cm4gbGlzdC5wdXNoKG1hcExpc3Rbb2JqZWN0TmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpKSB7XG4gICAgICBsaXN0ID0gXy5maWx0ZXIobGlzdCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gXy5pbmNsdWRlKF9vYmplY3QuYWxsb3dfcmVsYXRlZExpc3QsIGl0ZW0ub2JqZWN0X25hbWUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsaXN0O1xuICB9O1xufVxuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpO1xufTtcblxuXG4vKiBcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpIHtcbiAgdmFyIGxpc3RWaWV3cywgbGlzdF92aWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIGlmICghKGxpc3RWaWV3cyAhPSBudWxsID8gbGlzdFZpZXdzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdF92aWV3ID0gXy5maW5kV2hlcmUobGlzdFZpZXdzLCB7XG4gICAgXCJfaWRcIjogbGlzdF92aWV3X2lkXG4gIH0pO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIGlmIChleGFjKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxpc3Rfdmlldztcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIGxpc3RWaWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiBsaXN0X3ZpZXdfaWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cywge1xuICAgICAgX2lkOiBsaXN0X3ZpZXdfaWRcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0VmlldyA9IGxpc3Rfdmlld19pZDtcbiAgfVxuICByZXR1cm4gKGxpc3RWaWV3ICE9IG51bGwgPyBsaXN0Vmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDku45jb2x1bW5z5Y+C5pWw5Lit6L+H5ruk5Ye655So5LqO5omL5py656uv5pi+56S655qEY29sdW1uc1xuXHTop4TliJnvvJpcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxuXHQyLuacgOWkmuWPqui/lOWbnjTkuKrlrZfmrrVcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcbiAqL1xuXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIGNvdW50LCBmaWVsZCwgZmllbGRzLCBnZXRGaWVsZCwgaXNOYW1lQ29sdW1uLCBpdGVtQ291bnQsIG1heENvdW50LCBtYXhSb3dzLCBuYW1lQ29sdW1uLCBuYW1lS2V5LCBvYmplY3QsIHJlc3VsdDtcbiAgcmVzdWx0ID0gW107XG4gIG1heFJvd3MgPSAyO1xuICBtYXhDb3VudCA9IG1heFJvd3MgKiAyO1xuICBjb3VudCA9IDA7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gb2JqZWN0LmZpZWxkcztcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuICBuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICBpc05hbWVDb2x1bW4gPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHJldHVybiBpdGVtLmZpZWxkID09PSBuYW1lS2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXRlbSA9PT0gbmFtZUtleTtcbiAgICB9XG4gIH07XG4gIGdldEZpZWxkID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW0uZmllbGRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW1dO1xuICAgIH1cbiAgfTtcbiAgaWYgKG5hbWVLZXkpIHtcbiAgICBuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKG5hbWVDb2x1bW4pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pO1xuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgcmVzdWx0LnB1c2gobmFtZUNvbHVtbik7XG4gIH1cbiAgY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKGl0ZW0pO1xuICAgIGlmICghZmllbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbUNvdW50ID0gZmllbGQuaXNfd2lkZSA/IDIgOiAxO1xuICAgIGlmIChjb3VudCA8IG1heENvdW50ICYmIHJlc3VsdC5sZW5ndGggPCBtYXhDb3VudCAmJiAhaXNOYW1lQ29sdW1uKGl0ZW0pKSB7XG4gICAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgICBpZiAoY291bnQgPD0gbWF4Q291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0Vmlldywgb2JqZWN0LCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICB9XG4gIGlmIChvYmplY3QgIT0gbnVsbCA/IChyZWYgPSBvYmplY3QubGlzdF92aWV3cykgIT0gbnVsbCA/IHJlZltcImRlZmF1bHRcIl0gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICBkZWZhdWx0VmlldyA9IG9iamVjdC5saXN0X3ZpZXdzW1wiZGVmYXVsdFwiXTtcbiAgfSBlbHNlIHtcbiAgICBfLmVhY2gob2JqZWN0ICE9IG51bGwgPyBvYmplY3QubGlzdF92aWV3cyA6IHZvaWQgMCwgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcbiAgICAgIGlmIChsaXN0X3ZpZXcubmFtZSA9PT0gXCJhbGxcIiB8fCBrZXkgPT09IFwiYWxsXCIpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBkZWZhdWx0Vmlldztcbn07XG5cblxuLypcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucykge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKHVzZV9tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDApIHtcbiAgICAgIGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucztcbiAgICB9IGVsc2UgaWYgKGNvbHVtbnMpIHtcbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbHVtbnM7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5leHRyYV9jb2x1bW5zIDogdm9pZCAwO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBpZiAoZGVmYXVsdFZpZXcpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcuc29ydCkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3LnNvcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc0FsbFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJhbGxcIjtcbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuICovXG5cbkNyZWF0b3IuaXNSZWNlbnRWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSBmdW5jdGlvbihzb3J0LCB0YWJ1bGFyQ29sdW1ucykge1xuICB2YXIgdGFidWxhcl9zb3J0O1xuICB0YWJ1bGFyX3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgY29sdW1uX2luZGV4LCBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBpZiAoaXRlbS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpdGVtLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgaXRlbVsxXV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihmaWVsZF9uYW1lKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIG9yZGVyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFidWxhcl9zb3J0O1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9EWCA9IGZ1bmN0aW9uKHNvcnQpIHtcbiAgdmFyIGR4X3NvcnQ7XG4gIGR4X3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChpdGVtKTtcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICByZXR1cm4gZHhfc29ydC5wdXNoKFtmaWVsZF9uYW1lLCBvcmRlcl0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkeF9zb3J0O1xufTtcbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJylcclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdE1ldGVvci5zdGFydHVwICgpLT5cclxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxyXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIn1cclxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XHJcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcclxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJylcclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdE1ldGVvci5zdGFydHVwICgpLT5cclxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxyXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIn1cclxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XHJcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcclxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIi8vIOWboOS4um1ldGVvcue8luivkWNvZmZlZXNjcmlwdOS8muWvvOiHtGV2YWzlh73mlbDmiqXplJnvvIzmiYDku6XljZXni6zlhpnlnKjkuIDkuKpqc+aWh+S7tuS4reOAglxyXG5DcmVhdG9yLmV2YWxJbkNvbnRleHQgPSBmdW5jdGlvbihqcywgY29udGV4dCkge1xyXG4gICAgLy8jIFJldHVybiB0aGUgcmVzdWx0cyBvZiB0aGUgaW4tbGluZSBhbm9ueW1vdXMgZnVuY3Rpb24gd2UgLmNhbGwgd2l0aCB0aGUgcGFzc2VkIGNvbnRleHRcclxuICAgIHJldHVybiBmdW5jdGlvbigpIHsgXHJcbiAgICBcdHJldHVybiBldmFsKGpzKTsgXHJcblx0fS5jYWxsKGNvbnRleHQpO1xyXG59XHJcblxyXG5cclxuQ3JlYXRvci5ldmFsID0gZnVuY3Rpb24oanMpe1xyXG5cdHRyeXtcclxuXHRcdHJldHVybiBldmFsKGpzKVxyXG5cdH1jYXRjaCAoZSl7XHJcblx0XHRjb25zb2xlLmVycm9yKGUsIGpzKTtcclxuXHR9XHJcbn07IiwiXHRnZXRPcHRpb24gPSAob3B0aW9uKS0+XHJcblx0XHRmb28gPSBvcHRpb24uc3BsaXQoXCI6XCIpXHJcblx0XHRpZiBmb28ubGVuZ3RoID4gMlxyXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV0sIGNvbG9yOiBmb29bMl19XHJcblx0XHRlbHNlIGlmIGZvby5sZW5ndGggPiAxXHJcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1sxXX1cclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzBdfVxyXG5cclxuXHRjb252ZXJ0RmllbGQgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkLCBzcGFjZUlkKS0+XHJcblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgJiYgc3BhY2VJZCAmJiBmaWVsZC50eXBlID09ICdzZWxlY3QnXHJcblx0XHRcdGNvZGUgPSBmaWVsZC5waWNrbGlzdCB8fCBcIiN7b2JqZWN0X25hbWV9LiN7ZmllbGRfbmFtZX1cIjtcclxuXHRcdFx0aWYgY29kZVxyXG5cdFx0XHRcdHBpY2tsaXN0ID0gQ3JlYXRvci5nZXRQaWNrbGlzdChjb2RlLCBzcGFjZUlkKTtcclxuXHRcdFx0XHRpZiBwaWNrbGlzdFxyXG5cdFx0XHRcdFx0b3B0aW9ucyA9IFtdO1xyXG5cdFx0XHRcdFx0YWxsT3B0aW9ucyA9IFtdO1xyXG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gQ3JlYXRvci5nZXRQaWNrTGlzdE9wdGlvbnMocGlja2xpc3QpXHJcblx0XHRcdFx0XHRwaWNrbGlzdE9wdGlvbnMgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJyk/LnJldmVyc2UoKTtcclxuXHRcdFx0XHRcdF8uZWFjaCBwaWNrbGlzdE9wdGlvbnMsIChpdGVtKS0+XHJcblx0XHRcdFx0XHRcdGxhYmVsID0gaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdHZhbHVlID0gaXRlbS52YWx1ZSB8fCBpdGVtLm5hbWVcclxuXHRcdFx0XHRcdFx0YWxsT3B0aW9ucy5wdXNoKHtsYWJlbDogbGFiZWwsIHZhbHVlOiB2YWx1ZSwgZW5hYmxlOiBpdGVtLmVuYWJsZSwgY29sb3I6IGl0ZW0uY29sb3J9KVxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVuYWJsZVxyXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5kZWZhdWx0XHJcblx0XHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWVcclxuXHRcdFx0XHRcdGlmIG9wdGlvbnMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gb3B0aW9uc1xyXG5cdFx0XHRcdFx0aWYgYWxsT3B0aW9ucy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdGZpZWxkLmFsbE9wdGlvbnMgPSBhbGxPcHRpb25zXHJcblx0XHRyZXR1cm4gZmllbGQ7XHJcblxyXG5cdENyZWF0b3IuY29udmVydE9iamVjdCA9IChvYmplY3QsIHNwYWNlSWQpLT5cclxuXHRcdGlmICFvYmplY3RcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRfLmZvckVhY2ggb2JqZWN0LnRyaWdnZXJzLCAodHJpZ2dlciwga2V5KS0+XHJcblxyXG5cdFx0XHRpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIpXHJcblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gdHJpZ2dlcj8uX3RvZG9cclxuXHRcdFx0XHRfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvXHJcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxyXG5cdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcclxuXHJcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXHJcblx0XHRcdFx0XHQj5Y+q5pyJdXBkYXRl5pe277yMIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zIOaJjeacieWAvFxyXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YeP77yM5bCk5YW25pivQ29sbGVjdGlvblxyXG5cdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcclxuXHRcdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIlxyXG5cdFx0XHRcdF90b2RvID0gdHJpZ2dlci50b2RvXHJcblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxyXG5cdFx0XHRcdFx0dHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKClcclxuXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5hY3Rpb25zLCAoYWN0aW9uLCBrZXkpLT5cclxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24/Ll90b2RvXHJcblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IGFjdGlvbj8udG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcclxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGVcclxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYilcclxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pXHJcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGJcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbigpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvclxyXG5cclxuXHRcdFx0XHRfdmlzaWJsZSA9IGFjdGlvbj8uX3Zpc2libGVcclxuXHRcdFx0XHRpZiBfdmlzaWJsZVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3Zpc2libGV9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlXHJcblx0XHRlbHNlXHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XHJcblx0XHRcdFx0X3RvZG8gPSBhY3Rpb24/LnRvZG9cclxuXHRcdFx0XHRpZiBfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/LnZpc2libGVcclxuXHJcblx0XHRcdFx0aWYgX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKVxyXG5cdFx0XHRcdFx0YWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKVxyXG5cclxuXHRcdF8uZm9yRWFjaCBvYmplY3QuZmllbGRzLCAoZmllbGQsIGtleSktPlxyXG5cclxuXHRcdFx0ZmllbGQgPSBjb252ZXJ0RmllbGQob2JqZWN0Lm5hbWUsIGtleSwgZmllbGQsIHNwYWNlSWQpO1xyXG5cclxuXHRcdFx0aWYgZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpXHJcblx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRfb3B0aW9ucyA9IFtdXHJcblx0XHRcdFx0XHQj5pSv5oyBXFxu5oiW6ICF6Iux5paH6YCX5Y+35YiG5YmyLFxyXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIGZpZWxkLm9wdGlvbnMuc3BsaXQoXCJcXG5cIiksIChvcHRpb24pLT5cclxuXHRcdFx0XHRcdFx0aWYgb3B0aW9uLmluZGV4T2YoXCIsXCIpXHJcblx0XHRcdFx0XHRcdFx0b3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIilcclxuXHRcdFx0XHRcdFx0XHRfLmZvckVhY2ggb3B0aW9ucywgKF9vcHRpb24pLT5cclxuXHRcdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSlcclxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xyXG5cdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvclxyXG5cclxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKVxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdFx0I+aUr+aMgeaVsOe7hOS4reebtOaOpeWumuS5ieavj+S4qumAiemhueeahOeugOeJiOagvOW8j+Wtl+espuS4slxyXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIGZpZWxkLm9wdGlvbnMsIChvcHRpb24pLT5cclxuXHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhvcHRpb24pXHJcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSlcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2gob3B0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXHJcblx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yXHJcblxyXG5cdFx0XHRlbHNlIGlmIGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucylcclxuXHRcdFx0XHRfb3B0aW9ucyA9IFtdXHJcblx0XHRcdFx0Xy5lYWNoIGZpZWxkLm9wdGlvbnMsICh2LCBrKS0+XHJcblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogdiwgdmFsdWU6IGt9XHJcblx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRvcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpXHJcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnMudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLl9vcHRpb25zXHJcblx0XHRcdFx0aWYgb3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnN9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0cmVnRXggPSBmaWVsZC5yZWdFeFxyXG5cdFx0XHRcdGlmIHJlZ0V4XHJcblx0XHRcdFx0XHRmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLl9yZWdFeFxyXG5cdFx0XHRcdGlmIHJlZ0V4XHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0ZmllbGQucmVnRXggPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWdFeH0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRtaW4gPSBmaWVsZC5taW5cclxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWluKVxyXG5cdFx0XHRcdFx0ZmllbGQuX21pbiA9IG1pbi50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRtaW4gPSBmaWVsZC5fbWluXHJcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtaW4pXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0ZmllbGQubWluID0gQ3JlYXRvci5ldmFsKFwiKCN7bWlufSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdG1heCA9IGZpZWxkLm1heFxyXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtYXgpXHJcblx0XHRcdFx0XHRmaWVsZC5fbWF4ID0gbWF4LnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG1heCA9IGZpZWxkLl9tYXhcclxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKG1heClcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5tYXggPSBDcmVhdG9yLmV2YWwoXCIoI3ttYXh9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0aWYgZmllbGQuYXV0b2Zvcm1cclxuXHRcdFx0XHRcdF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZVxyXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc0Z1bmN0aW9uKF90eXBlKSAmJiBfdHlwZSAhPSBPYmplY3QgJiYgX3R5cGUgIT0gU3RyaW5nICYmIF90eXBlICE9IE51bWJlciAmJiBfdHlwZSAhPSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpXHJcblx0XHRcdFx0XHRcdGZpZWxkLmF1dG9mb3JtLl90eXBlID0gX3R5cGUudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aWYgZmllbGQuYXV0b2Zvcm1cclxuXHRcdFx0XHRcdF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGVcclxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNTdHJpbmcoX3R5cGUpXHJcblx0XHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRcdGZpZWxkLmF1dG9mb3JtLnR5cGUgPSBDcmVhdG9yLmV2YWwoXCIoI3tfdHlwZX0pXCIpXHJcblx0XHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3JcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cclxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb25cclxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uXHJcblx0XHRcdFx0YmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXHJcblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uXHJcblxyXG5cdFx0XHRcdGlmIG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpXHJcblxyXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0ZmllbGQuX3JlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90by50b1N0cmluZygpXHJcblxyXG5cdFx0XHRcdGlmIGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihjcmVhdGVGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKClcclxuXHRcdFx0XHRpZiBiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGJlZm9yZU9wZW5GdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKVxyXG5cclxuXHRcdFx0XHRpZiBmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblxyXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gfHwgZmllbGQub3B0aW9uc0Z1bmN0aW9uXHJcblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQuX3JlZmVyZW5jZV90b1xyXG5cdFx0XHRcdGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuX2NyZWF0ZUZ1bmN0aW9uXHJcblx0XHRcdFx0YmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvblxyXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gfHwgZmllbGQuZmlsdGVyc0Z1bmN0aW9uXHJcblxyXG5cdFx0XHRcdGlmIG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnNGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3IuZXZhbChcIigje3JlZmVyZW5jZV90b30pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2NyZWF0ZUZ1bmN0aW9ufSlcIilcclxuXHJcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7YmVmb3JlT3BlbkZ1bmN0aW9ufSlcIilcclxuXHJcblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyc0Z1bmN0aW9ufSlcIilcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cdFx0XHRcdGlmIGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlXHJcblxyXG5cdFx0XHRcdGlmICFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcclxuXHRcdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cclxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZGVmYXVsdFZhbHVlfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHRcdFx0XHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3IuZXZhbChcIigje2lzX2NvbXBhbnlfbGltaXRlZH0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpIC0+XHJcblx0XHRcdCMjI1xyXG5cdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcclxuXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcclxuXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxyXG5cdFx0XHTlpoLvvJpcclxuXHRcdFx0ZmlsdGVyczogKCktPlxyXG5cdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXHJcblx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxyXG5cdFx0XHTlpoLvvJpcclxuXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XHJcblx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxyXG5cdFx0XHRdXVxyXG5cdFx0XHTmiJZcclxuXHRcdFx0ZmlsdGVyczogW3tcclxuXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxyXG5cdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXHJcblx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XHJcblx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXHJcblx0XHRcdH1dXHJcblx0XHRcdCMjI1xyXG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpXHJcblx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0XHRsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpXHJcblx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpXHJcblx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3IuZXZhbChcIigje2xpc3Rfdmlldy5fZmlsdGVyc30pXCIpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRfLmZvckVhY2ggbGlzdF92aWV3LmZpbHRlcnMsIChmaWx0ZXIsIF9pbmRleCktPlxyXG5cdFx0XHRcdFx0aWYgXy5pc0FycmF5KGZpbHRlcilcclxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIlxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRGF0ZShmaWx0ZXJbMl0pXHJcblx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOaYr0RhdGXnsbvlnovvvIzliJlmaWx0ZXJbMl3lgLzliLDliY3nq6/kvJroh6rliqjovazmiJDlrZfnrKbkuLLvvIzmoLzlvI/vvJpcIjIwMTgtMDMtMjlUMDM6NDM6MjEuNzg3WlwiXHJcblx0XHRcdFx0XHRcdFx0XHQjIOWMheaLrGdyaWTliJfooajor7fmsYLnmoTmjqXlj6PlnKjlhoXnmoTmiYDmnIlPRGF0YeaOpeWPo++8jERhdGXnsbvlnovlrZfmrrXpg73kvJrku6XkuIrov7DmoLzlvI/ov5Tlm55cclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiREFURVwiXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiRlVOQ1RJT05cIlxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyWzJdfSlcIilcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJEQVRFXCJcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGZpbHRlcilcclxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNEYXRlKGZpbHRlcj8udmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIuX2lzX2RhdGUgPT0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gbmV3IERhdGUoZmlsdGVyLnZhbHVlKVxyXG5cclxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRpZiBvYmplY3QuZm9ybSAmJiAhXy5pc1N0cmluZyhvYmplY3QuZm9ybSlcclxuXHRcdFx0XHRvYmplY3QuZm9ybSA9IEpTT04uc3RyaW5naWZ5IG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cclxuXHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbih2YWwpXHJcblx0XHRcdFx0XHRcdHJldHVybiB2YWwgKyAnJztcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcclxuXHRcdGVsc2UgaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGlmIG9iamVjdC5mb3JtXHJcblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlIG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cclxuXHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcclxuXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XHJcblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XHJcblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXHJcblx0XHRcdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcclxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpbHRlcnNfY29kZVwiLCB2YWxcclxuXHRcdGVsc2VcclxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XHJcblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XHJcblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcclxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKClcclxuXHJcblx0XHRyZXR1cm4gb2JqZWN0XHJcblxyXG5cclxuIiwidmFyIGNvbnZlcnRGaWVsZCwgZ2V0T3B0aW9uO1xuXG5nZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdmFyIGZvbztcbiAgZm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKTtcbiAgaWYgKGZvby5sZW5ndGggPiAyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdLFxuICAgICAgY29sb3I6IGZvb1syXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZm9vLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1swXVxuICAgIH07XG4gIH1cbn07XG5cbmNvbnZlcnRGaWVsZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCkge1xuICB2YXIgYWxsT3B0aW9ucywgY29kZSwgb3B0aW9ucywgcGlja2xpc3QsIHBpY2tsaXN0T3B0aW9ucywgcmVmO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICBjb2RlID0gZmllbGQucGlja2xpc3QgfHwgKG9iamVjdF9uYW1lICsgXCIuXCIgKyBmaWVsZF9uYW1lKTtcbiAgICBpZiAoY29kZSkge1xuICAgICAgcGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuICAgICAgaWYgKHBpY2tsaXN0KSB7XG4gICAgICAgIG9wdGlvbnMgPSBbXTtcbiAgICAgICAgYWxsT3B0aW9ucyA9IFtdO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdCk7XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IChyZWYgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJykpICE9IG51bGwgPyByZWYucmV2ZXJzZSgpIDogdm9pZCAwO1xuICAgICAgICBfLmVhY2gocGlja2xpc3RPcHRpb25zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIGxhYmVsLCB2YWx1ZTtcbiAgICAgICAgICBsYWJlbCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lO1xuICAgICAgICAgIGFsbE9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbmFibGU6IGl0ZW0uZW5hYmxlLFxuICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXRlbS5lbmFibGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtW1wiZGVmYXVsdFwiXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0LCBzcGFjZUlkKSB7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIGtleSkge1xuICAgIHZhciBfdG9kbywgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiO1xuICAgIGlmICgoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikpIHtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXIgIT0gbnVsbCA/IHRyaWdnZXIuX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSB7XG4gICAgICBfdG9kbyA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYiwgX3Zpc2libGUsIGVycm9yO1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSkpIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbigpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3Zpc2libGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvLCBfdmlzaWJsZTtcbiAgICAgIF90b2RvID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnZpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKSkge1xuICAgICAgICByZXR1cm4gYWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGtleSkge1xuICAgIHZhciBfb3B0aW9ucywgX3R5cGUsIGJlZm9yZU9wZW5GdW5jdGlvbiwgY3JlYXRlRnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSwgZXJyb3IsIGZpbHRlcnNGdW5jdGlvbiwgaXNfY29tcGFueV9saW1pdGVkLCBtYXgsIG1pbiwgb3B0aW9ucywgb3B0aW9uc0Z1bmN0aW9uLCByZWZlcmVuY2VfdG8sIHJlZ0V4O1xuICAgIGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcbiAgICBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgaWYgKG9wdGlvbi5pbmRleE9mKFwiLFwiKSkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKF9vcHRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIGlmIChfLmlzU3RyaW5nKG9wdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1pbiA9IGZpZWxkLm1pbjtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWluKSkge1xuICAgICAgICBmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pbiA9IGZpZWxkLl9taW47XG4gICAgICBpZiAoXy5pc1N0cmluZyhtaW4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWluID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtaW4gKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtYXggPSBmaWVsZC5tYXg7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1heCkpIHtcbiAgICAgICAgZmllbGQuX21heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXggPSBmaWVsZC5fbWF4O1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWF4KSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1heCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWF4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT09IE9iamVjdCAmJiBfdHlwZSAhPT0gU3RyaW5nICYmIF90eXBlICE9PSBOdW1iZXIgJiYgX3R5cGUgIT09IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSkpIHtcbiAgICAgICAgICBmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdHlwZSArIFwiKVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9uc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWZlcmVuY2VfdG8gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGNyZWF0ZUZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBiZWZvcmVPcGVuRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlcnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZGVmYXVsdFZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICByZXR1cm4gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBpc19jb21wYW55X2xpbWl0ZWQgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBfLmZvckVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG5cbiAgICAvKlxuICAgIFx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuICAgIFx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG4gICAgXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6ICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG4gICAgXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0XV1cbiAgICBcdFx0XHTmiJZcbiAgICBcdFx0XHRmaWx0ZXJzOiBbe1xuICAgIFx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcbiAgICBcdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG4gICAgXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cbiAgICBcdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdH1dXG4gICAgICovXG4gICAgaWYgKF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBsaXN0X3ZpZXcuX2ZpbHRlcnMgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfLmZvckVhY2gobGlzdF92aWV3LmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNEYXRlKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiREFURVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkZVTkNUSU9OXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJbMl0gKyBcIilcIik7XG4gICAgICAgICAgICAgIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiREFURVwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNEYXRlKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl9pc19kYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuX2lzX2RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKG9iamVjdC5mb3JtICYmICFfLmlzU3RyaW5nKG9iamVjdC5mb3JtKSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbCArICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0pIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJmaWx0ZXJzX2NvZGVcIiwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fVxyXG5cclxuQ3JlYXRvci5Gb3JtdWxhci5QUkVGSVggPSBcIl9WQUxVRVNcIlxyXG5cclxuQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEgPSAocHJlZml4LGZpZWxkVmFyaWFibGUpLT5cclxuXHRyZWcgPSAvKFxce1tee31dKlxcfSkvZztcclxuXHJcblx0cmV2ID0gZmllbGRWYXJpYWJsZS5yZXBsYWNlIHJlZywgKG0sICQxKS0+XHJcblx0XHRyZXR1cm4gcHJlZml4ICsgJDEucmVwbGFjZSgvXFx7XFxzKi8sXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LyxcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csXCJcXFwiXVtcXFwiXCIpO1xyXG5cclxuXHRyZXR1cm4gcmV2XHJcblxyXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IChmb3JtdWxhX3N0ciktPlxyXG5cdGlmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ7XCIpID4gLTEgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIn1cIikgPiAtMVxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcbkNyZWF0b3IuRm9ybXVsYXIucnVuID0gKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucyktPlxyXG5cdGlmIGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpXHJcblxyXG5cdFx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnM/LmV4dGVuZClcclxuXHRcdFx0ZXh0ZW5kID0gdHJ1ZVxyXG5cclxuXHRcdF9WQUxVRVMgPSB7fVxyXG5cdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKVxyXG5cdFx0aWYgZXh0ZW5kXHJcblx0XHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnM/LnVzZXJJZCwgb3B0aW9ucz8uc3BhY2VJZCkpXHJcblx0XHRmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cilcclxuXHJcblx0XHR0cnlcclxuXHRcdFx0ZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUykgICAjIOatpOWkhOS4jeiDveeUqHdpbmRvdy5ldmFsIO+8jOS8muWvvOiHtOWPmOmHj+S9nOeUqOWfn+W8guW4uFxyXG5cdFx0XHRyZXR1cm4gZGF0YVxyXG5cdFx0Y2F0Y2ggZVxyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9XCIsIGUpXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdHRvYXN0cj8uZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIilcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9I3tlfVwiXHJcblxyXG5cdHJldHVybiBmb3JtdWxhX3N0clxyXG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge307XG5cbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCI7XG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gZnVuY3Rpb24ocHJlZml4LCBmaWVsZFZhcmlhYmxlKSB7XG4gIHZhciByZWcsIHJldjtcbiAgcmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XG4gIHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG0sICQxKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLCBcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLCBcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csIFwiXFxcIl1bXFxcIlwiKTtcbiAgfSk7XG4gIHJldHVybiByZXY7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyKSB7XG4gIGlmIChfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucykge1xuICB2YXIgX1ZBTFVFUywgZGF0YSwgZSwgZXh0ZW5kO1xuICBpZiAoZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuZXh0ZW5kIDogdm9pZCAwKSkge1xuICAgICAgZXh0ZW5kID0gdHJ1ZTtcbiAgICB9XG4gICAgX1ZBTFVFUyA9IHt9O1xuICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVCk7XG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy51c2VySWQgOiB2b2lkIDAsIG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgIH1cbiAgICBmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cik7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciwgZSk7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG9hc3RyICE9PSBcInVuZGVmaW5lZFwiICYmIHRvYXN0ciAhPT0gbnVsbCkge1xuICAgICAgICAgIHRvYXN0ci5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIgKyBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFfc3RyO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcclxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge30gICAjIOatpOWvueixoeWPquiDveWcqOehruS/neaJgOaciU9iamVjdOWIneWni+WMluWujOaIkOWQjuiwg+eUqO+8jCDlkKbliJnojrflj5bliLDnmoRvYmplY3TkuI3lhahcclxuXHJcbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IChvYmplY3RfbmFtZSktPlxyXG5cdGlmIG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKVxyXG5cdFx0b2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwuJywgJ2cnKSwgJ18nKVxyXG5cdHJldHVybiBvYmplY3RfbmFtZVxyXG5cclxuQ3JlYXRvci5PYmplY3QgPSAob3B0aW9ucyktPlxyXG5cdF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRfYmFzZU9iamVjdCA9IHthY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyAsIGZpZWxkczoge30sIHRyaWdnZXJzOiB7fSwgcGVybWlzc2lvbl9zZXQ6IHt9fVxyXG5cdHNlbGYgPSB0aGlzXHJcblx0aWYgKCFvcHRpb25zLm5hbWUpXHJcblx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMpXHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcclxuXHJcblx0c2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWVcclxuXHRzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZVxyXG5cdHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZVxyXG5cdHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsXHJcblx0c2VsZi5pY29uID0gb3B0aW9ucy5pY29uXHJcblx0c2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb25cclxuXHRzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXdcclxuXHRzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm1cclxuXHRzZWxmLnJlbGF0ZWRMaXN0ID0gb3B0aW9ucy5yZWxhdGVkTGlzdFxyXG5cdGlmICFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09IHRydWVcclxuXHRcdHNlbGYuaXNfZW5hYmxlID0gdHJ1ZVxyXG5cdGVsc2VcclxuXHRcdHNlbGYuaXNfZW5hYmxlID0gZmFsc2VcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmIF8uaGFzKG9wdGlvbnMsICdhbGxvd19hY3Rpb25zJylcclxuXHRcdFx0c2VsZi5hbGxvd19hY3Rpb25zID0gb3B0aW9ucy5hbGxvd19hY3Rpb25zXHJcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKVxyXG5cdFx0XHRzZWxmLmFsbG93X3JlbGF0ZWRMaXN0ID0gb3B0aW9ucy5hbGxvd19yZWxhdGVkTGlzdFxyXG5cdHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaFxyXG5cdHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXNcclxuXHRzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzXHJcblx0c2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3Rlc1xyXG5cdHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXRcclxuXHRpZiBvcHRpb25zLnBhZ2luZ1xyXG5cdFx0c2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZ1xyXG5cdHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW5cclxuXHRzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09IHVuZGVmaW5lZCkgb3Igb3B0aW9ucy5lbmFibGVfYXBpXHJcblx0c2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbVxyXG5cdHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmVcclxuXHRzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXNcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKVxyXG5cdFx0XHRzZWxmLmVuYWJsZV90cmVlID0gZmFsc2VcclxuXHRcdGVsc2VcclxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcclxuXHRcdFx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXHJcblx0ZWxzZVxyXG5cdFx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXHJcblx0XHRzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZVxyXG5cdHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93XHJcblx0c2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnlcclxuXHRzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKVxyXG5cdHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyXHJcblx0c2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaFxyXG5cdHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbFxyXG5cdHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFsc1xyXG5cdHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvd1xyXG5cdHNlbGYuZW5hYmxlX3dvcmtmbG93ID0gb3B0aW9ucy5lbmFibGVfd29ya2Zsb3dcclxuXHRpZiBfLmhhcyhvcHRpb25zLCAnaW5fZGV2ZWxvcG1lbnQnKVxyXG5cdFx0c2VsZi5pbl9kZXZlbG9wbWVudCA9IG9wdGlvbnMuaW5fZGV2ZWxvcG1lbnRcclxuXHRzZWxmLmlkRmllbGROYW1lID0gJ19pZCdcclxuXHRpZiBvcHRpb25zLmRhdGFiYXNlX25hbWVcclxuXHRcdHNlbGYuZGF0YWJhc2VfbmFtZSA9IG9wdGlvbnMuZGF0YWJhc2VfbmFtZVxyXG5cdGlmICghb3B0aW9ucy5maWVsZHMpXHJcblx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMpXHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcclxuXHJcblx0c2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcylcclxuXHJcblx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdGlmIGZpZWxkLmlzX25hbWVcclxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcclxuXHRcdGVsc2UgaWYgZmllbGRfbmFtZSA9PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVlcclxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcclxuXHRcdGlmIGZpZWxkLnByaW1hcnlcclxuXHRcdFx0c2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWVcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcclxuXHRcdFx0XHRpZiBmaWVsZF9uYW1lID09ICdzcGFjZSdcclxuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXHJcblx0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSBmYWxzZVxyXG5cclxuXHRpZiAhb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xyXG5cdFx0Xy5lYWNoIF9iYXNlT2JqZWN0LmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRcdGlmICFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXVxyXG5cdFx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge31cclxuXHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pXHJcblxyXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xyXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcclxuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXHJcblxyXG5cdHNlbGYubGlzdF92aWV3cyA9IHt9XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KHNlbGYubmFtZSlcclxuXHRfLmVhY2ggb3B0aW9ucy5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRWaWV3LCBpdGVtLCBpdGVtX25hbWUpXHJcblx0XHRzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtXHJcblxyXG5cdHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKVxyXG5cdF8uZWFjaCBvcHRpb25zLnRyaWdnZXJzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpZiAhc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdXHJcblx0XHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9XHJcblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZVxyXG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pLCBpdGVtKVxyXG5cclxuXHRzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpXHJcblx0Xy5lYWNoIG9wdGlvbnMuYWN0aW9ucywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdFx0aWYgIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdXHJcblx0XHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge31cclxuXHRcdGNvcHlJdGVtID0gXy5jbG9uZShzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSlcclxuXHRcdGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSAj5YWI5Yig6Zmk55u45YWz5bGe5oCn5YaN6YeN5bu65omN6IO95L+d6K+B5ZCO57ut6YeN5aSN5a6a5LmJ55qE5bGe5oCn6aG65bqP55Sf5pWIXHJcblx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKVxyXG5cclxuXHRfLmVhY2ggc2VsZi5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpdGVtLm5hbWUgPSBpdGVtX25hbWVcclxuXHJcblx0c2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSlcclxuXHJcblx0IyDorqnmiYDmnIlvYmplY3Tpu5jorqTmnInmiYDmnIlsaXN0X3ZpZXdzL2FjdGlvbnMvcmVsYXRlZF9vYmplY3RzL3JlYWRhYmxlX2ZpZWxkcy9lZGl0YWJsZV9maWVsZHPlrozmlbTmnYPpmZDvvIzor6XmnYPpmZDlj6/og73ooqvmlbDmja7lupPkuK3orr7nva7nmoRhZG1pbi91c2Vy5p2D6ZmQ6KaG55uWXHJcblx0c2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoX2Jhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpXHJcblx0IyBkZWZhdWx0TGlzdFZpZXdzID0gXy5rZXlzKHNlbGYubGlzdF92aWV3cylcclxuXHQjIGRlZmF1bHRBY3Rpb25zID0gXy5rZXlzKHNlbGYuYWN0aW9ucylcclxuXHQjIGRlZmF1bHRSZWxhdGVkT2JqZWN0cyA9IF8ucGx1Y2soc2VsZi5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxyXG5cdCMgZGVmYXVsdFJlYWRhYmxlRmllbGRzID0gW11cclxuXHQjIGRlZmF1bHRFZGl0YWJsZUZpZWxkcyA9IFtdXHJcblx0IyBfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdCMgXHRpZiAhKGZpZWxkLmhpZGRlbikgICAgIzIzMSBvbWl05a2X5q615pSv5oyB5Zyo6Z2e57yW6L6R6aG16Z2i5p+l55yLLCDlm6DmraTliKDpmaTkuobmraTlpITlr7lvbWl055qE5Yik5patXHJcblx0IyBcdFx0ZGVmYXVsdFJlYWRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxyXG5cdCMgXHRcdGlmICFmaWVsZC5yZWFkb25seVxyXG5cdCMgXHRcdFx0ZGVmYXVsdEVkaXRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxyXG5cclxuXHQjIF8uZWFjaCBzZWxmLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0IyBcdGlmIGl0ZW1fbmFtZSA9PSBcIm5vbmVcIlxyXG5cdCMgXHRcdHJldHVyblxyXG5cdCMgXHRpZiBzZWxmLmxpc3Rfdmlld3NcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ubGlzdF92aWV3cyA9IGRlZmF1bHRMaXN0Vmlld3NcclxuXHQjIFx0aWYgc2VsZi5hY3Rpb25zXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmFjdGlvbnMgPSBkZWZhdWx0QWN0aW9uc1xyXG5cdCMgXHRpZiBzZWxmLnJlbGF0ZWRfb2JqZWN0c1xyXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWxhdGVkX29iamVjdHMgPSBkZWZhdWx0UmVsYXRlZE9iamVjdHNcclxuXHQjIFx0aWYgc2VsZi5maWVsZHNcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVhZGFibGVfZmllbGRzID0gZGVmYXVsdFJlYWRhYmxlRmllbGRzXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmVkaXRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRFZGl0YWJsZUZpZWxkc1xyXG5cdHVubGVzcyBvcHRpb25zLnBlcm1pc3Npb25fc2V0XHJcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge31cclxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LmFkbWluKVxyXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKVxyXG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8udXNlcilcclxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pXHJcblx0Xy5lYWNoIG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdGlmICFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV1cclxuXHRcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge31cclxuXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSlcclxuXHJcblx0IyDliY3nq6/moLnmja5wZXJtaXNzaW9uc+aUueWGmWZpZWxk55u45YWz5bGe5oCn77yM5ZCO56uv5Y+q6KaB6LWw6buY6K6k5bGe5oCn5bCx6KGM77yM5LiN6ZyA6KaB5pS55YaZXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnNcclxuXHRcdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucz8uZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0aWYgZGlzYWJsZWRfbGlzdF92aWV3cz8ubGVuZ3RoXHJcblx0XHRcdGRlZmF1bHRMaXN0Vmlld0lkID0gb3B0aW9ucy5saXN0X3ZpZXdzPy5hbGw/Ll9pZFxyXG5cdFx0XHRpZiBkZWZhdWx0TGlzdFZpZXdJZFxyXG5cdFx0XHRcdCMg5oqK6KeG5Zu+5p2D6ZmQ6YWN572u5Lit6buY6K6k55qEYWxs6KeG5Zu+aWTovazmjaLmiJBhbGzlhbPplK7lrZdcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAgZGlzYWJsZWRfbGlzdF92aWV3cywgKGxpc3Rfdmlld19pdGVtKSAtPlxyXG5cdFx0XHRcdFx0cmV0dXJuIGlmIGRlZmF1bHRMaXN0Vmlld0lkID09IGxpc3Rfdmlld19pdGVtIHRoZW4gXCJhbGxcIiBlbHNlIGxpc3Rfdmlld19pdGVtXHJcblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKVxyXG4jXHRcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcbiNcdFx0XHRpZiBmaWVsZFxyXG4jXHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVucmVhZGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA8IDBcclxuI1x0XHRcdFx0XHRpZiBmaWVsZC5oaWRkZW5cclxuI1x0XHRcdFx0XHRcdHJldHVyblxyXG4jXHRcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5lZGl0YWJsZV9maWVsZHMsIGZpZWxkX25hbWUpID4gLTFcclxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxyXG4jXHRcdFx0XHRcdFx0ZmllbGQuZGlzYWJsZWQgPSB0cnVlXHJcbiNcdFx0XHRcdFx0XHQjIOW9k+WPquivu+aXtu+8jOWmguaenOS4jeWOu+aOieW/heWhq+Wtl+aute+8jGF1dG9mb3Jt5piv5Lya5oql6ZSZ55qEXHJcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZXF1aXJlZCA9IGZhbHNlXHJcbiNcdFx0XHRcdGVsc2VcclxuI1x0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSB0cnVlXHJcblx0ZWxzZVxyXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG51bGxcclxuXHJcblx0X2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpXHJcblxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYlxyXG5cclxuXHRzZWxmLmRiID0gX2RiXHJcblxyXG5cdHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZVxyXG5cclxuXHRzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKVxyXG5cdHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpXHJcblx0aWYgc2VsZi5uYW1lICE9IFwidXNlcnNcIiBhbmQgc2VsZi5uYW1lICE9IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXHJcblx0aWYgc2VsZi5uYW1lID09IFwidXNlcnNcIlxyXG5cdFx0X2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYVxyXG5cclxuXHRpZiBfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxyXG5cclxuXHRDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGZcclxuXHJcblx0cmV0dXJuIHNlbGZcclxuXHJcbiMgQ3JlYXRvci5PYmplY3QucHJvdG90eXBlLmkxOG4gPSAoKS0+XHJcbiMgXHQjIHNldCBvYmplY3QgbGFiZWxcclxuIyBcdHNlbGYgPSB0aGlzXHJcblxyXG4jIFx0a2V5ID0gc2VsZi5uYW1lXHJcbiMgXHRpZiB0KGtleSkgPT0ga2V5XHJcbiMgXHRcdGlmICFzZWxmLmxhYmVsXHJcbiMgXHRcdFx0c2VsZi5sYWJlbCA9IHNlbGYubmFtZVxyXG4jIFx0ZWxzZVxyXG4jIFx0XHRzZWxmLmxhYmVsID0gdChrZXkpXHJcblxyXG4jIFx0IyBzZXQgZmllbGQgbGFiZWxzXHJcbiMgXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG4jIFx0XHRma2V5ID0gc2VsZi5uYW1lICsgXCJfXCIgKyBmaWVsZF9uYW1lXHJcbiMgXHRcdGlmIHQoZmtleSkgPT0gZmtleVxyXG4jIFx0XHRcdGlmICFmaWVsZC5sYWJlbFxyXG4jIFx0XHRcdFx0ZmllbGQubGFiZWwgPSBmaWVsZF9uYW1lXHJcbiMgXHRcdGVsc2VcclxuIyBcdFx0XHRmaWVsZC5sYWJlbCA9IHQoZmtleSlcclxuIyBcdFx0c2VsZi5zY2hlbWE/Ll9zY2hlbWE/W2ZpZWxkX25hbWVdPy5sYWJlbCA9IGZpZWxkLmxhYmVsXHJcblxyXG5cclxuIyBcdCMgc2V0IGxpc3R2aWV3IGxhYmVsc1xyXG4jIFx0Xy5lYWNoIHNlbGYubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG4jIFx0XHRpMThuX2tleSA9IHNlbGYubmFtZSArIFwiX2xpc3R2aWV3X1wiICsgaXRlbV9uYW1lXHJcbiMgXHRcdGlmIHQoaTE4bl9rZXkpID09IGkxOG5fa2V5XHJcbiMgXHRcdFx0aWYgIWl0ZW0ubGFiZWxcclxuIyBcdFx0XHRcdGl0ZW0ubGFiZWwgPSBpdGVtX25hbWVcclxuIyBcdFx0ZWxzZVxyXG4jIFx0XHRcdGl0ZW0ubGFiZWwgPSB0KGkxOG5fa2V5KVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSAob2JqZWN0KS0+XHJcblx0aWYgb2JqZWN0XHJcblx0XHRpZiAhb2JqZWN0LmRhdGFiYXNlX25hbWUgfHwgb2JqZWN0LmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcclxuXHRcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBcIi9hcGkvb2RhdGEvI3tvYmplY3QuZGF0YWJhc2VfbmFtZX1cIlxyXG5cclxuIyBpZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcbiMgXHRNZXRlb3Iuc3RhcnR1cCAtPlxyXG4jIFx0XHRUcmFja2VyLmF1dG9ydW4gLT5cclxuIyBcdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICYmIENyZWF0b3IuYm9vdHN0cmFwTG9hZGVkPy5nZXQoKVxyXG4jIFx0XHRcdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cclxuIyBcdFx0XHRcdFx0b2JqZWN0LmkxOG4oKVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRpZiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAob2JqZWN0KS0+XHJcblx0XHRcdG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpXHJcblxyXG4iLCJ2YXIgY2xvbmU7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge307XG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJykpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpO1xuICB9XG4gIHJldHVybiBvYmplY3RfbmFtZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX2Jhc2VPYmplY3QsIF9kYiwgZGVmYXVsdExpc3RWaWV3SWQsIGRlZmF1bHRWaWV3LCBkaXNhYmxlZF9saXN0X3ZpZXdzLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzY2hlbWEsIHNlbGY7XG4gIF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgX2Jhc2VPYmplY3QgPSB7XG4gICAgICBhY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyxcbiAgICAgIGZpZWxkczoge30sXG4gICAgICB0cmlnZ2Vyczoge30sXG4gICAgICBwZXJtaXNzaW9uX3NldDoge31cbiAgICB9O1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICBpZiAoIW9wdGlvbnMubmFtZSkge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gIH1cbiAgc2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWU7XG4gIHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICBzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gIHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsO1xuICBzZWxmLmljb24gPSBvcHRpb25zLmljb247XG4gIHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uO1xuICBzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXc7XG4gIHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybTtcbiAgc2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Q7XG4gIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09PSB0cnVlKSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gZmFsc2U7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYWxsb3dfYWN0aW9ucycpKSB7XG4gICAgICBzZWxmLmFsbG93X2FjdGlvbnMgPSBvcHRpb25zLmFsbG93X2FjdGlvbnM7XG4gICAgfVxuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKSkge1xuICAgICAgc2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3Q7XG4gICAgfVxuICB9XG4gIHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaDtcbiAgc2VsZi5lbmFibGVfZmlsZXMgPSBvcHRpb25zLmVuYWJsZV9maWxlcztcbiAgc2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrcztcbiAgc2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3RlcztcbiAgc2VsZi5lbmFibGVfYXVkaXQgPSBvcHRpb25zLmVuYWJsZV9hdWRpdDtcbiAgaWYgKG9wdGlvbnMucGFnaW5nKSB7XG4gICAgc2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZztcbiAgfVxuICBzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuO1xuICBzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09PSB2b2lkIDApIHx8IG9wdGlvbnMuZW5hYmxlX2FwaTtcbiAgc2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbTtcbiAgc2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZTtcbiAgc2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSkge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICB9XG4gIHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93O1xuICBzZWxmLmZpbHRlcl9jb21wYW55ID0gb3B0aW9ucy5maWx0ZXJfY29tcGFueTtcbiAgc2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcik7XG4gIHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyO1xuICBzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoO1xuICBzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWw7XG4gIHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFscztcbiAgc2VsZi5lbmFibGVfZm9sbG93ID0gb3B0aW9ucy5lbmFibGVfZm9sbG93O1xuICBzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93O1xuICBpZiAoXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50JykpIHtcbiAgICBzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudDtcbiAgfVxuICBzZWxmLmlkRmllbGROYW1lID0gJ19pZCc7XG4gIGlmIChvcHRpb25zLmRhdGFiYXNlX25hbWUpIHtcbiAgICBzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWU7XG4gIH1cbiAgaWYgKCFvcHRpb25zLmZpZWxkcykge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gIH1cbiAgc2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcyk7XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQuaXNfbmFtZSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZF9uYW1lID09PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVkpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoZmllbGQucHJpbWFyeSkge1xuICAgICAgc2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT09ICdtZXRlb3ItbW9uZ28nKSB7XG4gICAgXy5lYWNoKF9iYXNlT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmICghc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pIHtcbiAgICAgICAgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgc2VsZi5saXN0X3ZpZXdzID0ge307XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpO1xuICBfLmVhY2gob3B0aW9ucy5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgb2l0ZW07XG4gICAgb2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKTtcbiAgICByZXR1cm4gc2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbTtcbiAgfSk7XG4gIHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKTtcbiAgXy5lYWNoKG9wdGlvbnMudHJpZ2dlcnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWU7XG4gICAgcmV0dXJuIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpO1xuICBfLmVhY2gob3B0aW9ucy5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgY29weUl0ZW07XG4gICAgaWYgKCFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgY29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKTtcbiAgICBkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV07XG4gICAgcmV0dXJuIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pO1xuICB9KTtcbiAgXy5lYWNoKHNlbGYuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgfSk7XG4gIHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpO1xuICBzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldCk7XG4gIGlmICghb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fTtcbiAgfVxuICBpZiAoISgocmVmID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZi5hZG1pbiA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pO1xuICB9XG4gIGlmICghKChyZWYxID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZjEudXNlciA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKTtcbiAgfVxuICBfLmVhY2gob3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnM7XG4gICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwO1xuICAgIGlmIChkaXNhYmxlZF9saXN0X3ZpZXdzICE9IG51bGwgPyBkaXNhYmxlZF9saXN0X3ZpZXdzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZGVmYXVsdExpc3RWaWV3SWQgPSAocmVmMiA9IG9wdGlvbnMubGlzdF92aWV3cykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hbGwpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCkge1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAoZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQgPT09IGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Rfdmlld19pdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlbGYucGVybWlzc2lvbnMgPSBudWxsO1xuICB9XG4gIF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiO1xuICBzZWxmLmRiID0gX2RiO1xuICBzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWU7XG4gIHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpO1xuICBzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKTtcbiAgaWYgKHNlbGYubmFtZSAhPT0gXCJ1c2Vyc1wiICYmIHNlbGYubmFtZSAhPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoc2VsZi5uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICBfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hO1xuICB9XG4gIGlmIChfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgQ3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmO1xuICByZXR1cm4gc2VsZjtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCkge1xuICAgIGlmICghb2JqZWN0LmRhdGFiYXNlX25hbWUgfHwgb2JqZWN0LmRhdGFiYXNlX25hbWUgPT09ICdtZXRlb3ItbW9uZ28nKSB7XG4gICAgICByZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIi9hcGkvb2RhdGEvXCIgKyBvYmplY3QuZGF0YWJhc2VfbmFtZTtcbiAgICB9XG4gIH1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBpZiAoIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkICYmIENyZWF0b3IuT2JqZWN0cykge1xuICAgIHJldHVybiBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBuZXcgQ3JlYXRvci5PYmplY3Qob2JqZWN0KTtcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJwcm9jZXNzRm9ybXVsYVR5cGUgPSAoZmllbGQsIGZzKS0+XHJcblx0aWYgZmllbGQuZm9ybXVsYV90eXBlID09IFwidGV4dFwiXHJcblx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXHJcblx0ZWxzZSBpZiBmaWVsZC5mb3JtdWxhX3R5cGUgPT0gXCJkYXRlXCJcclxuXHRcdGZzLnR5cGUgPSBEYXRlXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxyXG5cdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXHJcblx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcclxuXHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcclxuXHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcclxuXHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcclxuXHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXHJcblx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXHJcblx0ZWxzZSBpZiBmaWVsZC5mb3JtdWxhX3R5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHRmcy50eXBlID0gRGF0ZVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcclxuXHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxyXG5cdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXHJcblx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcclxuXHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcclxuXHRlbHNlIGlmIGZpZWxkLmZvcm11bGFfdHlwZSA9PSBcImN1cnJlbmN5XCJcclxuXHRcdGZzLnR5cGUgPSBOdW1iZXJcclxuXHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxyXG5cdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XHJcblx0XHRpZiBmaWVsZD8uc2NhbGVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxyXG5cdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZD8uc2NhbGUgIT0gMFxyXG5cdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IDJcclxuXHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcclxuXHRlbHNlIGlmIGZpZWxkLmZvcm11bGFfdHlwZSA9PSBcIm51bWJlclwiXHJcblx0XHRmcy50eXBlID0gTnVtYmVyXHJcblx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcclxuXHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxyXG5cdFx0aWYgZmllbGQ/LnNjYWxlXHJcblx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcclxuXHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcclxuXHRlbHNlIGlmIGZpZWxkLmZvcm11bGFfdHlwZSA9PSBcImJvb2xlYW5cIlxyXG5cdFx0ZnMudHlwZSA9IEJvb2xlYW5cclxuXHRcdGlmIGZpZWxkLnJlYWRvbmx5XHJcblx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxyXG5cdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLXRvZ2dsZVwiXHJcblx0ZWxzZVxyXG5cdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSAob2JqKSAtPlxyXG5cdHVubGVzcyBvYmpcclxuXHRcdHJldHVyblxyXG5cdHNjaGVtYSA9IHt9XHJcblxyXG5cdGZpZWxkc0FyciA9IFtdXHJcblxyXG5cdF8uZWFjaCBvYmouZmllbGRzICwgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRpZiAhXy5oYXMoZmllbGQsIFwibmFtZVwiKVxyXG5cdFx0XHRmaWVsZC5uYW1lID0gZmllbGRfbmFtZVxyXG5cdFx0ZmllbGRzQXJyLnB1c2ggZmllbGRcclxuXHJcblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cclxuXHJcblx0XHRmaWVsZF9uYW1lID0gZmllbGQubmFtZVxyXG5cclxuXHRcdGZzID0ge31cclxuXHRcdGlmIGZpZWxkLnJlZ0V4XHJcblx0XHRcdGZzLnJlZ0V4ID0gZmllbGQucmVnRXhcclxuXHRcdGZzLmF1dG9mb3JtID0ge31cclxuXHRcdGZzLmF1dG9mb3JtLm11bHRpcGxlID0gZmllbGQubXVsdGlwbGVcclxuXHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdGF1dG9mb3JtX3R5cGUgPSBmaWVsZC5hdXRvZm9ybT8udHlwZVxyXG5cclxuXHRcdGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGQudHlwZSA9PSBcInBob25lXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW3RleHRdXCIgb3IgZmllbGQudHlwZSA9PSBcIltwaG9uZV1cIlxyXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2NvZGUnXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAxMlxyXG5cdFx0XHRpZiBmaWVsZC5sYW5ndWFnZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmxhbmd1YWdlID0gZmllbGQubGFuZ3VhZ2VcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRleHRhcmVhXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInBhc3N3b3JkXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJwYXNzd29yZFwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRlXCJcclxuXHRcdFx0ZnMudHlwZSA9IERhdGVcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxyXG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXHJcblx0XHRcdFx0XHRcdGRhdGVNb2JpbGVPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xyXG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxyXG5cdFx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXHJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcclxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxyXG5cclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcclxuXHRcdFx0ZnMudHlwZSA9IERhdGVcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxyXG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXHJcblx0XHRcdFx0XHRcdGRhdGVNb2JpbGVPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcclxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcclxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW09iamVjdF1cIlxyXG5cdFx0XHRmcy50eXBlID0gW09iamVjdF1cclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImh0bWxcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcclxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PSBcInpoLUNOXCJcclxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiZW4tVVNcIlxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0XHR0eXBlOiBcInN1bW1lcm5vdGVcIlxyXG5cdFx0XHRcdFx0Y2xhc3M6ICdzdW1tZXJub3RlLWVkaXRvcidcclxuXHRcdFx0XHRcdHNldHRpbmdzOlxyXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDIwMFxyXG5cdFx0XHRcdFx0XHRkaWFsb2dzSW5Cb2R5OiB0cnVlXHJcblx0XHRcdFx0XHRcdHRvb2xiYXI6ICBbXHJcblx0XHRcdFx0XHRcdFx0Wydmb250MScsIFsnc3R5bGUnXV0sXHJcblx0XHRcdFx0XHRcdFx0Wydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLFxyXG5cdFx0XHRcdFx0XHRcdFsnZm9udDMnLCBbJ2ZvbnRuYW1lJ11dLFxyXG5cdFx0XHRcdFx0XHRcdFsnY29sb3InLCBbJ2NvbG9yJ11dLFxyXG5cdFx0XHRcdFx0XHRcdFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLFxyXG5cdFx0XHRcdFx0XHRcdFsndGFibGUnLCBbJ3RhYmxlJ11dLFxyXG5cdFx0XHRcdFx0XHRcdFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sXHJcblx0XHRcdFx0XHRcdFx0Wyd2aWV3JywgWydjb2RldmlldyddXVxyXG5cdFx0XHRcdFx0XHRdXHJcblx0XHRcdFx0XHRcdGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywn6buR5L2TJywn5b6u6L2v6ZuF6buRJywn5Lu/5a6LJywn5qW35L2TJywn6Zq25LmmJywn5bm85ZyGJ11cclxuXHRcdFx0XHRcdFx0bGFuZzogbG9jYWxlXHJcblxyXG5cdFx0ZWxzZSBpZiAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmaWVsZC5zaG93SWNvblxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cclxuXHRcdFx0aWYgIWZpZWxkLmhpZGRlblxyXG5cclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5maWx0ZXJzID0gZmllbGQuZmlsdGVyc1xyXG5cclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vblxyXG5cclxuXHRcdFx0XHRpZiBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHRcdFx0XHRcdGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxyXG5cclxuXHRcdFx0XHRmcy5maWx0ZXJzRnVuY3Rpb24gPSBpZiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gdGhlbiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gZWxzZSBDcmVhdG9yLmV2YWx1YXRlRmlsdGVyc1xyXG5cclxuXHRcdFx0XHRpZiBmaWVsZC5vcHRpb25zRnVuY3Rpb25cclxuXHRcdFx0XHRcdGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxyXG5cclxuXHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0aWYgZmllbGQuY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmllbGQucmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdFx0X3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgX3JlZl9vYmo/LnBlcm1pc3Npb25zPy5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gKGxvb2t1cF9maWVsZCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLiN7Q3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bykuX25hbWV9XCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3JtSWQ6IFwibmV3I3tmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsJ18nKX1cIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBcIiN7ZmllbGQucmVmZXJlbmNlX3RvfVwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3BlcmF0aW9uOiBcImluc2VydFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25TdWNjZXNzOiAob3BlcmF0aW9uLCByZXN1bHQpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZXN1bHQub2JqZWN0X25hbWUgPT0gXCJvYmplY3RzXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLCB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsIGljb246IHJlc3VsdC52YWx1ZS5pY29ufV0sIHJlc3VsdC52YWx1ZS5uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFt7bGFiZWw6IHJlc3VsdC52YWx1ZVtvYmplY3QuTkFNRV9GSUVMRF9LRVldIHx8IHJlc3VsdC52YWx1ZS5sYWJlbCB8fCByZXN1bHQudmFsdWUubmFtZSwgdmFsdWU6IHJlc3VsdC5faWR9XSwgcmVzdWx0Ll9pZClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmYWxzZVxyXG5cclxuXHRcdFx0XHRcdGlmIF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSlcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlXHJcblxyXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3NvcnRcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc1NvcnQgPSBmaWVsZC5yZWZlcmVuY2Vfc29ydFxyXG5cclxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9saW1pdFxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTGltaXQgPSBmaWVsZC5yZWZlcmVuY2VfbGltaXRcclxuXHJcblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJ1c2Vyc1wiXHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdHVzZXJcIlxyXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzljZXkvY3kuIvnmoTmlbDmja5cclxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOWPr+S7peiiq+aUueWGmeimhuebluaIkHRydWUvZmFsc2XmiJblhbbku5ZmdW5jdGlvblxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcclxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXHJcblx0XHRcdFx0XHRcdFx0XHQjIOWvueW9k+WJjeWvueixoeaciXZpZXdBbGxSZWNvcmRz5p2D6ZmQ5YiZ5LiN6ZmQ5Yi25omA5bGe5Y2V5L2N5YiX6KGo5p+l55yL5p2D6ZmQ77yM5ZCm5YiZ5Y+q5pi+56S65b2T5YmN5omA5bGe5Y2V5L2NXHJcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnM/LmdldCgpXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzlrZfmrrXmiYDlsZ7lr7nosaHmmK/nlKjmiLfmiJbnu4Tnu4fvvIzliJnmmK/lkKbpmZDliLbmmL7npLrmiYDlsZ7ljZXkvY3pg6jpl6jkuI5tb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5YWz6IGUXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc1VuTGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRnVuY3Rpb24gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0IyDkvKDlhaXlvZPliY3lr7nosaHnmoTmnYPpmZDvvIzlnKjlh73mlbDkuK3moLnmja7mnYPpmZDorqHnrpfmmK/lkKbopoHpmZDliLblj6rmn6XnnIvmnKzljZXkvY1cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucylcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0IyDmnI3liqHnq6/nlKjkuI3liLBpc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRlbHNlIGlmIGZpZWxkLnJlZmVyZW5jZV90byA9PSBcIm9yZ2FuaXphdGlvbnNcIlxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RvcmdcIlxyXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzljZXkvY3kuIvnmoTmlbDmja5cclxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOWPr+S7peiiq+aUueWGmeimhuebluaIkHRydWUvZmFsc2XmiJblhbbku5ZmdW5jdGlvblxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcclxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXHJcblx0XHRcdFx0XHRcdFx0XHQjIOWvueW9k+WJjeWvueixoeaciXZpZXdBbGxSZWNvcmRz5p2D6ZmQ5YiZ5LiN6ZmQ5Yi25omA5bGe5Y2V5L2N5YiX6KGo5p+l55yL5p2D6ZmQ77yM5ZCm5YiZ5Y+q5pi+56S65b2T5YmN5omA5bGe5Y2V5L2NXHJcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnM/LmdldCgpXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzlrZfmrrXmiYDlsZ7lr7nosaHmmK/nlKjmiLfmiJbnu4Tnu4fvvIzliJnmmK/lkKbpmZDliLbmmL7npLrmiYDlsZ7ljZXkvY3pg6jpl6jkuI5tb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5YWz6IGUXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc1VuTGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRnVuY3Rpb24gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0IyDkvKDlhaXlvZPliY3lr7nosaHnmoTmnYPpmZDvvIzlnKjlh73mlbDkuK3moLnmja7mnYPpmZDorqHnrpfmmK/lkKbopoHpmZDliLblj6rmn6XnnIvmnKzljZXkvY1cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucylcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0IyDmnI3liqHnq6/nlKjkuI3liLBpc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdGlmIHR5cGVvZihmaWVsZC5yZWZlcmVuY2VfdG8pID09IFwiZnVuY3Rpb25cIlxyXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KF9yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0ZnMudHlwZSA9IE9iamVjdFxyXG5cdFx0XHRcdFx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlXHJcblxyXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFN0cmluZ1xyXG5cdFx0XHRcdFx0XHRcdFx0YXV0b2Zvcm06IHtvbWl0OiB0cnVlfVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBbU3RyaW5nXVxyXG5cdFx0XHRcdFx0XHRcdFx0YXV0b2Zvcm06IHtvbWl0OiB0cnVlfVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dXHJcblxyXG5cdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dXHJcblx0XHRcdFx0XHRcdGlmIF9vYmplY3QgYW5kIF9vYmplY3QuZW5hYmxlX3RyZWVcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCJcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIlxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSAoKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX1cclxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMgPSBbXVxyXG5cdFx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90by5mb3JFYWNoIChfcmVmZXJlbmNlKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV1cclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgX29iamVjdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3Q6IF9yZWZlcmVuY2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBfb2JqZWN0Py5sYWJlbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogX29iamVjdD8uaWNvblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW5rOiAoKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvblxyXG5cclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInNlbGVjdFwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmYWxzZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RcIlxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJjdXJyZW5jeVwiXHJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxyXG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXHJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcclxuXHRcdFx0ZWxzZSBpZiBmaWVsZD8uc2NhbGUgIT0gMFxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gMlxyXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJudW1iZXJcIlxyXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcclxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxyXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJib29sZWFuXCJcclxuXHRcdFx0ZnMudHlwZSA9IEJvb2xlYW5cclxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRvZ2dsZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXHJcblx0XHRcdGlmIGZpZWxkLnJlYWRvbmx5XHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi10b2dnbGVcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwicmVmZXJlbmNlXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY2hlY2tib3hcIlxyXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImZpbGVcIiBhbmQgZmllbGQuY29sbGVjdGlvblxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IGZpZWxkLmNvbGxlY3Rpb25cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGZpZWxkLmNvbGxlY3Rpb25cclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImZpbGVzaXplXCJcclxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PSBcIm9iamVjdFwiXHJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3RcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImdyaWRcIlxyXG5cdFx0XHRmcy50eXBlID0gQXJyYXlcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCJcclxuXHJcblx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0dHlwZTogT2JqZWN0XHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJpbWFnZVwiXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2ltYWdlcydcclxuXHRcdFx0XHRcdFx0YWNjZXB0OiAnaW1hZ2UvKidcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdmF0YXJcIlxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdhdmF0YXJzJ1xyXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdWRpb1wiXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F1ZGlvcydcclxuXHRcdFx0XHRcdFx0YWNjZXB0OiAnYXVkaW8vKidcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ2aWRlb1wiXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ3ZpZGVvcydcclxuXHRcdFx0XHRcdFx0YWNjZXB0OiAndmlkZW8vKidcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJsb2NhdGlvblwiXHJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3RcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiXHJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibWFya2Rvd25cIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtbWFya2Rvd25cIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICd1cmwnXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0IyBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5VcmxcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zVXJsJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdlbWFpbCdcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdmb3JtdWxhJ1xyXG5cdFx0XHRwcm9jZXNzRm9ybXVsYVR5cGUoZmllbGQsIGZzKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRmcy50eXBlID0gZmllbGQudHlwZVxyXG5cclxuXHRcdGlmIGZpZWxkLmxhYmVsXHJcblx0XHRcdGZzLmxhYmVsID0gZmllbGQubGFiZWxcclxuXHJcbiNcdFx0aWYgZmllbGQuYWxsb3dlZFZhbHVlc1xyXG4jXHRcdFx0ZnMuYWxsb3dlZFZhbHVlcyA9IGZpZWxkLmFsbG93ZWRWYWx1ZXNcclxuXHJcblx0XHRpZiAhZmllbGQucmVxdWlyZWRcclxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXHJcblxyXG5cdFx0IyBb562+57qm5a+56LGh5ZCM5pe26YWN572u5LqGY29tcGFueV9pZHPlv4Xloavlj4p1bmVkaXRhYmxlX2ZpZWxkc+mAoOaIkOmDqOWIhueUqOaIt+aWsOW7uuetvue6puWvueixoeaXtuaKpemUmSAjMTkyXShodHRwczovL2dpdGh1Yi5jb20vc3RlZWRvcy9zdGVlZG9zLXByb2plY3QtZHp1Zy9pc3N1ZXMvMTkyKVxyXG5cdFx0IyDlkI7lj7Dlp4vnu4jorr7nva5yZXF1aXJlZOS4umZhbHNlXHJcblx0XHRpZiAhTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGZzLm9wdGlvbmFsID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLnVuaXF1ZVxyXG5cdFx0XHRmcy51bmlxdWUgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQub21pdFxyXG5cdFx0XHRmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLmdyb3VwXHJcblx0XHRcdGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXBcclxuXHJcblx0XHRpZiBmaWVsZC5pc193aWRlXHJcblx0XHRcdGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuaGlkZGVuXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiXHJcblxyXG5cdFx0aWYgKGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXHJcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5maWx0ZXJhYmxlKSA9PSAndW5kZWZpbmVkJ1xyXG5cdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXHJcblx0XHRpZiBmaWVsZC5uYW1lID09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lXHJcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5zZWFyY2hhYmxlKSA9PSAndW5kZWZpbmVkJ1xyXG5cdFx0XHRcdGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlXHJcblxyXG5cdFx0aWYgYXV0b2Zvcm1fdHlwZVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZVxyXG5cclxuXHRcdGlmIGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSAoKS0+XHJcblx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7dXNlcklkOiBNZXRlb3IudXNlcklkKCksIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgbm93OiBuZXcgRGF0ZSgpfSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cdFx0XHRcdGlmICFfLmlzRnVuY3Rpb24oZmllbGQuZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0ZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXHJcblxyXG5cdFx0aWYgZmllbGQucmVhZG9ubHlcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuZGlzYWJsZWRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuaW5saW5lSGVscFRleHRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dFxyXG5cclxuXHRcdGlmIGZpZWxkLmJsYWNrYm94XHJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxyXG5cclxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWluJylcclxuXHRcdFx0ZnMubWluID0gZmllbGQubWluXHJcblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21heCcpXHJcblx0XHRcdGZzLm1heCA9IGZpZWxkLm1heFxyXG5cclxuXHRcdCMg5Y+q5pyJ55Sf5Lqn546v5aKD5omN6YeN5bu657Si5byVXHJcblx0XHRpZiBNZXRlb3IuaXNQcm9kdWN0aW9uXHJcblx0XHRcdGlmIGZpZWxkLmluZGV4XHJcblx0XHRcdFx0ZnMuaW5kZXggPSBmaWVsZC5pbmRleFxyXG5cdFx0XHRlbHNlIGlmIGZpZWxkLnNvcnRhYmxlXHJcblx0XHRcdFx0ZnMuaW5kZXggPSB0cnVlXHJcblxyXG5cdFx0c2NoZW1hW2ZpZWxkX25hbWVdID0gZnNcclxuXHJcblx0cmV0dXJuIHNjaGVtYVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKS0+XHJcblx0aHRtbCA9IGZpZWxkX3ZhbHVlXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0aWYgIW9iamVjdFxyXG5cdFx0cmV0dXJuIFwiXCJcclxuXHRmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSlcclxuXHRpZiAhZmllbGRcclxuXHRcdHJldHVybiBcIlwiXHJcblxyXG5cdGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpXHJcblx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXHJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxyXG5cclxuXHRyZXR1cm4gaHRtbFxyXG5cclxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSAoZmllbGRfdHlwZSktPlxyXG5cdHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cclxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSAoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyktPlxyXG5cdGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXHJcblx0aWYgYnVpbHRpblZhbHVlc1xyXG5cdFx0Xy5mb3JFYWNoIGJ1aWx0aW5WYWx1ZXMsIChidWlsdGluSXRlbSwga2V5KS0+XHJcblx0XHRcdG9wZXJhdGlvbnMucHVzaCh7bGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLCB2YWx1ZToga2V5fSlcclxuXHJcbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSAoZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSktPlxyXG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XHJcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSlcclxuXHJcbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XHJcblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcclxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpXHJcblxyXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUsIHZhbHVlKS0+XHJcblx0IyDmoLnmja7ov4fmu6TlmajnmoTov4fmu6TlgLzvvIzojrflj5blr7nlupTnmoTlhoXnva7ov5DnrpfnrKZcclxuXHQjIOavlOWmgnZhbHVl5Li6bGFzdF95ZWFy77yM6L+U5ZueYmV0d2Vlbl90aW1lX2xhc3RfeWVhclxyXG5cdHVubGVzcyBfLmlzU3RyaW5nKHZhbHVlKVxyXG5cdFx0cmV0dXJuXHJcblx0YmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXHJcblx0dW5sZXNzIGJldHdlZW5CdWlsdGluVmFsdWVzXHJcblx0XHRyZXR1cm5cclxuXHRyZXN1bHQgPSBudWxsXHJcblx0Xy5lYWNoIGJldHdlZW5CdWlsdGluVmFsdWVzLCAoaXRlbSwgb3BlcmF0aW9uKS0+XHJcblx0XHRpZiBpdGVtLmtleSA9PSB2YWx1ZVxyXG5cdFx0XHRyZXN1bHQgPSBvcGVyYXRpb25cclxuXHRyZXR1cm4gcmVzdWx0XHJcblxyXG4jIOWmguaenOWPquaYr+S4uuWIpOaWrW9wZXJhdGlvbuaYr+WQpuWtmOWcqO+8jOWImeayoeW/heimgeiuoeeul3ZhbHVlc++8jOS8oOWFpWlzX2NoZWNrX29ubHnkuLp0cnVl5Y2z5Y+vXHJcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpLT5cclxuXHQjIOi/h+a7pOWZqOaXtumXtOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxyXG5cdHJldHVybiB7XHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcclxuXHR9XHJcblxyXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gKG1vbnRoKS0+XHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdGlmIG1vbnRoIDwgM1xyXG5cdFx0cmV0dXJuIDBcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0cmV0dXJuIDNcclxuXHRlbHNlIGlmIG1vbnRoIDwgOVxyXG5cdFx0cmV0dXJuIDZcclxuXHRcclxuXHRyZXR1cm4gOVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0aWYgbW9udGggPCAzXHJcblx0XHR5ZWFyLS1cclxuXHRcdG1vbnRoID0gOVxyXG5cdGVsc2UgaWYgbW9udGggPCA2XHJcblx0XHRtb250aCA9IDBcclxuXHRlbHNlIGlmIG1vbnRoIDwgOVxyXG5cdFx0bW9udGggPSAzXHJcblx0ZWxzZSBcclxuXHRcdG1vbnRoID0gNlxyXG5cdFxyXG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHRcclxuXHJcbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0aWYgbW9udGggPCAzXHJcblx0XHRtb250aCA9IDNcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0bW9udGggPSA2XHJcblx0ZWxzZSBpZiBtb250aCA8IDlcclxuXHRcdG1vbnRoID0gOVxyXG5cdGVsc2VcclxuXHRcdHllYXIrK1xyXG5cdFx0bW9udGggPSAwXHJcblx0XHJcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cclxuQ3JlYXRvci5nZXRNb250aERheXMgPSAoeWVhcixtb250aCktPlxyXG5cdGlmIG1vbnRoID09IDExXHJcblx0XHRyZXR1cm4gMzFcclxuXHRcclxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcclxuXHRzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHRlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgrMSwgMSlcclxuXHRkYXlzID0gKGVuZERhdGUtc3RhcnREYXRlKS9taWxsaXNlY29uZFxyXG5cdHJldHVybiBkYXlzXHJcblxyXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gKHllYXIsIG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0IyDmnIjku73kuLow5Luj6KGo5pys5bm055qE56ys5LiA5pyIXHJcblx0aWYgbW9udGggPT0gMFxyXG5cdFx0bW9udGggPSAxMVxyXG5cdFx0eWVhci0tXHJcblx0XHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcblx0IyDlkKbliJks5Y+q5YeP5Y675pyI5Lu9XHJcblx0bW9udGgtLTtcclxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxyXG5cdCMg6L+H5ruk5ZmoYmV0d2Vlbui/kOeul+espu+8jOeOsOeul+aXpeacny/ml6XmnJ/ml7bpl7TnsbvlnovlrZfmrrXnmoR2YWx1ZXPlgLxcclxuXHRub3cgPSBuZXcgRGF0ZSgpXHJcblx0IyDkuIDlpKnnmoTmr6vnp5LmlbBcclxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcclxuXHR5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxyXG5cdHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiA5ZGo5Lit55qE5p+Q5LiA5aSpXHJcblx0d2VlayA9IG5vdy5nZXREYXkoKVxyXG5cdCMg5YeP5Y6755qE5aSp5pWwXHJcblx0bWludXNEYXkgPSBpZiB3ZWVrICE9IDAgdGhlbiB3ZWVrIC0gMSBlbHNlIDZcclxuXHRtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKVxyXG5cdHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOS4iuWRqOaXpVxyXG5cdGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDkuIrlkajkuIBcclxuXHRsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSlcclxuXHQjIOS4i+WRqOS4gFxyXG5cdG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXHJcblx0IyDkuIvlkajml6VcclxuXHRuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSlcclxuXHRjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcblx0cHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxXHJcblx0bmV4dFllYXIgPSBjdXJyZW50WWVhciArIDFcclxuXHQjIOW9k+WJjeaciOS7vVxyXG5cdGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpXHJcblx0IyDorqHmlbDlubTjgIHmnIhcclxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcclxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpXHJcblx0IyDmnKzmnIjnrKzkuIDlpKlcclxuXHRmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aCwxKVxyXG5cclxuXHQjIOW9k+S4ujEy5pyI55qE5pe25YCZ5bm05Lu96ZyA6KaB5YqgMVxyXG5cdCMg5pyI5Lu96ZyA6KaB5pu05paw5Li6MCDkuZ/lsLHmmK/kuIvkuIDlubTnmoTnrKzkuIDkuKrmnIhcclxuXHRpZiBjdXJyZW50TW9udGggPT0gMTFcclxuXHRcdHllYXIrK1xyXG5cdFx0bW9udGgrK1xyXG5cdGVsc2VcclxuXHRcdG1vbnRoKytcclxuXHRcclxuXHQjIOS4i+aciOesrOS4gOWkqVxyXG5cdG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0IyDkuIvmnIjmnIDlkI7kuIDlpKlcclxuXHRuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsbW9udGgsQ3JlYXRvci5nZXRNb250aERheXMoeWVhcixtb250aCkpXHJcblx0IyDmnKzmnIjmnIDlkI7kuIDlpKlcclxuXHRsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDkuIrmnIjnrKzkuIDlpKlcclxuXHRsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxyXG5cdCMg5LiK5pyI5pyA5ZCO5LiA5aSpXHJcblx0bGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcclxuXHQjIOacrOWto+W6puW8gOWni+aXpVxyXG5cdHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksMSlcclxuXHQjIOacrOWto+W6pue7k+adn+aXpVxyXG5cdHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIsQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIpKVxyXG5cdCMg5LiK5a2j5bqm5byA5aeL5pelXHJcblx0bGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXHJcblx0IyDkuIrlraPluqbnu5PmnZ/ml6VcclxuXHRsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxyXG5cdCMg5LiL5a2j5bqm5byA5aeL5pelXHJcblx0bmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXHJcblx0IyDkuIvlraPluqbnu5PmnZ/ml6VcclxuXHRuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxyXG5cdCMg6L+H5Y67N+WkqSBcclxuXHRsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzMw5aSpXHJcblx0bGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzYw5aSpXHJcblx0bGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzkw5aSpXHJcblx0bGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzEyMOWkqVxyXG5cdGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOacquadpTflpKkgXHJcblx0bmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaUzMOWkqVxyXG5cdG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU2MOWkqVxyXG5cdG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU5MOWkqVxyXG5cdG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaUxMjDlpKlcclxuXHRuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpXHJcblxyXG5cdHN3aXRjaCBrZXlcclxuXHRcdHdoZW4gXCJsYXN0X3llYXJcIlxyXG5cdFx0XHQj5Y675bm0XHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc195ZWFyXCJcclxuXHRcdFx0I+S7iuW5tFxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje2N1cnJlbnRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X3llYXJcIlxyXG5cdFx0XHQj5piO5bm0XHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfcXVhcnRlclwiXHJcblx0XHRcdCPkuIrlraPluqZcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc19xdWFydGVyXCJcclxuXHRcdFx0I+acrOWto+W6plxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X3F1YXJ0ZXJcIlxyXG5cdFx0XHQj5LiL5a2j5bqmXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfbW9udGhcIlxyXG5cdFx0XHQj5LiK5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc19tb250aFwiXHJcblx0XHRcdCPmnKzmnIhcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfbW9udGhcIlxyXG5cdFx0XHQj5LiL5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF93ZWVrXCJcclxuXHRcdFx0I+S4iuWRqFxyXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfd2Vla1wiXHJcblx0XHRcdCPmnKzlkahcclxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF93ZWVrXCJcclxuXHRcdFx0I+S4i+WRqFxyXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInllc3RkYXlcIlxyXG5cdFx0XHQj5pio5aSpXHJcblx0XHRcdHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRvZGF5XCJcclxuXHRcdFx0I+S7iuWkqVxyXG5cdFx0XHRzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ0b21vcnJvd1wiXHJcblx0XHRcdCPmmI7lpKlcclxuXHRcdFx0c3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzdfZGF5c1wiXHJcblx0XHRcdCPov4fljrs35aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIFxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfMzBfZGF5c1wiXHJcblx0XHRcdCPov4fljrszMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF82MF9kYXlzXCJcclxuXHRcdFx0I+i/h+WOuzYw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzkwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67OTDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfMTIwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67MTIw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfN19kYXlzXCJcclxuXHRcdFx0I+acquadpTflpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzMwX2RheXNcIlxyXG5cdFx0XHQj5pyq5p2lMzDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfNjBfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaU2MOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF85MF9kYXlzXCJcclxuXHRcdFx0I+acquadpTkw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzEyMF9kYXlzXCJcclxuXHRcdFx0I+acquadpTEyMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcclxuXHR2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdXHJcblx0aWYgZmllbGRfdHlwZSA9PSBcImRhdGV0aW1lXCJcclxuXHRcdCMg5pe26Ze057G75Z6L5a2X5q6177yM5YaF572u5pe26Ze06IyD5Zu05bqU6K+l6ICD6JmR5YGP56e75pe25Yy65YC877yM5ZCm5YiZ6L+H5ruk5pWw5o2u5a2Y5Zyo5YGP5beuXHJcblx0XHQjIOmdnuWGhee9ruaXtumXtOiMg+WbtOaXtu+8jOeUqOaIt+mAmui/h+aXtumXtOaOp+S7tumAieaLqeeahOiMg+WbtO+8jOS8muiHquWKqOWkhOeQhuaXtuWMuuWBj+W3ruaDheWGtVxyXG5cdFx0IyDml6XmnJ/nsbvlnovlrZfmrrXvvIzmlbDmja7lupPmnKzmnaXlsLHlrZjnmoTmmK9VVEPnmoQw54K577yM5LiN5a2Y5Zyo5YGP5beuXHJcblx0XHRfLmZvckVhY2ggdmFsdWVzLCAoZnYpLT5cclxuXHRcdFx0aWYgZnZcclxuXHRcdFx0XHRmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwIClcclxuXHRcclxuXHRyZXR1cm4ge1xyXG5cdFx0bGFiZWw6IGxhYmVsXHJcblx0XHRrZXk6IGtleVxyXG5cdFx0dmFsdWVzOiB2YWx1ZXNcclxuXHR9XHJcblxyXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKS0+XHJcblx0aWYgZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuICdiZXR3ZWVuJ1xyXG5cdGVsc2UgaWYgW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuICdjb250YWlucydcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gXCI9XCJcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSkgLT5cclxuXHQjIOaXpeacn+exu+WeizogZGF0ZSwgZGF0ZXRpbWUgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxyXG5cdCMg5paH5pys57G75Z6LOiB0ZXh0LCB0ZXh0YXJlYSwgaHRtbCAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIiwgXCJzdGFydHN3aXRoXCJcclxuXHQjIOmAieaLqeexu+WeizogbG9va3VwLCBtYXN0ZXJfZGV0YWlsLCBzZWxlY3Qg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblx0IyDmlbDlgLznsbvlnos6IGN1cnJlbmN5LCBudW1iZXIgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxyXG5cdCMg5biD5bCU57G75Z6LOiBib29sZWFuICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcclxuXHQjIOaVsOe7hOexu+WeizogY2hlY2tib3gsIFt0ZXh0XSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblxyXG5cdG9wdGlvbmFscyA9IHtcclxuXHRcdGVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksIHZhbHVlOiBcIj1cIn0sXHJcblx0XHR1bmVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSwgdmFsdWU6IFwiPD5cIn0sXHJcblx0XHRsZXNzX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksIHZhbHVlOiBcIjxcIn0sXHJcblx0XHRncmVhdGVyX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksIHZhbHVlOiBcIj5cIn0sXHJcblx0XHRsZXNzX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPD1cIn0sXHJcblx0XHRncmVhdGVyX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPj1cIn0sXHJcblx0XHRjb250YWluczoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLCB2YWx1ZTogXCJjb250YWluc1wifSxcclxuXHRcdG5vdF9jb250YWluOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSwgdmFsdWU6IFwibm90Y29udGFpbnNcIn0sXHJcblx0XHRzdGFydHNfd2l0aDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLCB2YWx1ZTogXCJzdGFydHN3aXRoXCJ9LFxyXG5cdFx0YmV0d2Vlbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksIHZhbHVlOiBcImJldHdlZW5cIn0sXHJcblx0fVxyXG5cclxuXHRpZiBmaWVsZF90eXBlID09IHVuZGVmaW5lZFxyXG5cdFx0cmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscylcclxuXHJcblx0b3BlcmF0aW9ucyA9IFtdXHJcblxyXG5cdGlmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pXHJcblx0XHRDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcInRleHRcIiBvciBmaWVsZF90eXBlID09IFwidGV4dGFyZWFcIiBvciBmaWVsZF90eXBlID09IFwiaHRtbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJjb2RlXCJcclxuI1x0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmNvbnRhaW5zLCBvcHRpb25hbHMubm90X2NvbnRhaW4sIG9wdGlvbmFscy5zdGFydHNfd2l0aClcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwibG9va3VwXCIgb3IgZmllbGRfdHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBvciBmaWVsZF90eXBlID09IFwic2VsZWN0XCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImN1cnJlbmN5XCIgb3IgZmllbGRfdHlwZSA9PSBcIm51bWJlclwiXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImJvb2xlYW5cIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiY2hlY2tib3hcIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiW3RleHRdXCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2VcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cclxuXHRyZXR1cm4gb3BlcmF0aW9uc1xyXG5cclxuIyMjXHJcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cclxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcclxuXHRmaWVsZHNBcnIgPSBbXVxyXG5cclxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQpLT5cclxuXHRcdGZpZWxkc0Fyci5wdXNoIHtuYW1lOiBmaWVsZC5uYW1lLCBzb3J0X25vOiBmaWVsZC5zb3J0X25vfVxyXG5cclxuXHRmaWVsZHNOYW1lID0gW11cclxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxyXG5cdFx0ZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpXHJcblx0cmV0dXJuIGZpZWxkc05hbWVcclxuIiwidmFyIHByb2Nlc3NGb3JtdWxhVHlwZTtcblxucHJvY2Vzc0Zvcm11bGFUeXBlID0gZnVuY3Rpb24oZmllbGQsIGZzKSB7XG4gIGlmIChmaWVsZC5mb3JtdWxhX3R5cGUgPT09IFwidGV4dFwiKSB7XG4gICAgZnMudHlwZSA9IFN0cmluZztcbiAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIHJldHVybiBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfVxuICB9IGVsc2UgaWYgKGZpZWxkLmZvcm11bGFfdHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICBmcy50eXBlID0gRGF0ZTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKSkge1xuICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiBcImRhdGVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChmaWVsZC5mb3JtdWxhX3R5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIGZzLnR5cGUgPSBEYXRlO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgdHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCIsXG4gICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChmaWVsZC5mb3JtdWxhX3R5cGUgPT09IFwiY3VycmVuY3lcIikge1xuICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlO1xuICAgICAgcmV0dXJuIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkgIT09IDApIHtcbiAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gMjtcbiAgICAgIHJldHVybiBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZmllbGQuZm9ybXVsYV90eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICByZXR1cm4gZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKGZpZWxkLmZvcm11bGFfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi10b2dnbGVcIjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZnMudHlwZSA9IFN0cmluZztcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGZpZWxkc0Fyciwgc2NoZW1hO1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICBzY2hlbWEgPSB7fTtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChvYmouZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmICghXy5oYXMoZmllbGQsIFwibmFtZVwiKSkge1xuICAgICAgZmllbGQubmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaChmaWVsZCk7XG4gIH0pO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgdmFyIF9vYmplY3QsIF9yZWZfb2JqLCBfcmVmZXJlbmNlX3RvLCBhdXRvZm9ybV90eXBlLCBmaWVsZF9uYW1lLCBmcywgaXNVbkxpbWl0ZWQsIGxvY2FsZSwgcGVybWlzc2lvbnMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMztcbiAgICBmaWVsZF9uYW1lID0gZmllbGQubmFtZTtcbiAgICBmcyA9IHt9O1xuICAgIGlmIChmaWVsZC5yZWdFeCkge1xuICAgICAgZnMucmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICB9XG4gICAgZnMuYXV0b2Zvcm0gPSB7fTtcbiAgICBmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlO1xuICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICBhdXRvZm9ybV90eXBlID0gKHJlZiA9IGZpZWxkLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dFwiIHx8IGZpZWxkLnR5cGUgPT09IFwicGhvbmVcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiW3RleHRdXCIgfHwgZmllbGQudHlwZSA9PT0gXCJbcGhvbmVdXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdjb2RlJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAxMjtcbiAgICAgIGlmIChmaWVsZC5sYW5ndWFnZSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInBhc3N3b3JkXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBEYXRlO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBEYXRlO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRldGltZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIltPYmplY3RdXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbT2JqZWN0XTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiaHRtbFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICAgICAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIgfHwgbG9jYWxlID09PSBcInpoLUNOXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJlbi1VU1wiO1xuICAgICAgICB9XG4gICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICB0eXBlOiBcInN1bW1lcm5vdGVcIixcbiAgICAgICAgICBcImNsYXNzXCI6ICdzdW1tZXJub3RlLWVkaXRvcicsXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIGhlaWdodDogMjAwLFxuICAgICAgICAgICAgZGlhbG9nc0luQm9keTogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2xiYXI6IFtbJ2ZvbnQxJywgWydzdHlsZSddXSwgWydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLCBbJ2ZvbnQzJywgWydmb250bmFtZSddXSwgWydjb2xvcicsIFsnY29sb3InXV0sIFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLCBbJ3RhYmxlJywgWyd0YWJsZSddXSwgWydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZSddXSwgWyd2aWV3JywgWydjb2RldmlldyddXV0sXG4gICAgICAgICAgICBmb250TmFtZXM6IFsnQXJpYWwnLCAnQ29taWMgU2FucyBNUycsICdDb3VyaWVyIE5ldycsICdIZWx2ZXRpY2EnLCAnSW1wYWN0JywgJ+Wui+S9kycsICfpu5HkvZMnLCAn5b6u6L2v6ZuF6buRJywgJ+S7v+WuiycsICfmpbfkvZMnLCAn6Zq25LmmJywgJ+W5vOWchiddLFxuICAgICAgICAgICAgbGFuZzogbG9jYWxlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb247XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgfVxuICAgICAgaWYgKCFmaWVsZC5oaWRkZW4pIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnM7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlcGVuZE9uID0gZmllbGQuZGVwZW5kX29uO1xuICAgICAgICBpZiAoZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uKSB7XG4gICAgICAgICAgZnMuYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGZzLmZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA/IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA6IENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzO1xuICAgICAgICBpZiAoZmllbGQub3B0aW9uc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8pIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICBpZiAoZmllbGQuY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b107XG4gICAgICAgICAgICAgICAgaWYgKF9yZWZfb2JqICE9IG51bGwgPyAocmVmMSA9IF9yZWZfb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMS5hbGxvd0NyZWF0ZSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24obG9va3VwX2ZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuXCIgKyAoQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bykuX25hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgIGZvcm1JZDogXCJuZXdcIiArIChmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsICdfJykpLFxuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBcIlwiICsgZmllbGQucmVmZXJlbmNlX3RvLFxuICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJpbnNlcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKG9wZXJhdGlvbiwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQub2JqZWN0X25hbWUgPT09IFwib2JqZWN0c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiByZXN1bHQudmFsdWUuaWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0LnZhbHVlLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZVtvYmplY3QuTkFNRV9GSUVMRF9LRVldIHx8IHJlc3VsdC52YWx1ZS5sYWJlbCB8fCByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2Vfc29ydCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc1NvcnQgPSBmaWVsZC5yZWZlcmVuY2Vfc29ydDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9saW1pdCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcInVzZXJzXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdHVzZXJcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gKHJlZjIgPSBvYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYyLmdldCgpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcIm9yZ2FuaXphdGlvbnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYzID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMy5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgICAgICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlO1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dO1xuICAgICAgICAgICAgaWYgKF9vYmplY3QgJiYgX29iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjtcbiAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW107XG4gICAgICAgICAgICAgICAgX3JlZmVyZW5jZV90by5mb3JFYWNoKGZ1bmN0aW9uKF9yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV07XG4gICAgICAgICAgICAgICAgICBpZiAoX29iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QubGFiZWwgOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgaWNvbjogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2U7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgICBmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRvZ2dsZVwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInJlZmVyZW5jZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIjtcbiAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlXCIgJiYgZmllbGQuY29sbGVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBmaWVsZC5jb2xsZWN0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGZpZWxkLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVzaXplXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZ3JpZFwiKSB7XG4gICAgICBmcy50eXBlID0gQXJyYXk7XG4gICAgICBmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWU7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiO1xuICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2ltYWdlcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdmF0YXJcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXZhdGFycycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXVkaW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2F1ZGlvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInZpZGVvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ3ZpZGVvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICd2aWRlby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb2NhdGlvblwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIjtcbiAgICAgIGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCI7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLW1hcmtkb3duXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAndXJsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZW1haWwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWw7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIHByb2Nlc3NGb3JtdWxhVHlwZShmaWVsZCwgZnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcy50eXBlID0gZmllbGQudHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmxhYmVsKSB7XG4gICAgICBmcy5sYWJlbCA9IGZpZWxkLmxhYmVsO1xuICAgIH1cbiAgICBpZiAoIWZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC51bmlxdWUpIHtcbiAgICAgIGZzLnVuaXF1ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5vbWl0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmdyb3VwKSB7XG4gICAgICBmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaXNfd2lkZSkge1xuICAgICAgZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5oaWRkZW4pIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiO1xuICAgIH1cbiAgICBpZiAoKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHx8IChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLmZpbHRlcmFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQubmFtZSA9PT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuc2VhcmNoYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuc2VhcmNoYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvZm9ybV90eXBlKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRlZmF1bHRWYWx1ZSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHtcbiAgICAgICAgICAgIHVzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgICAgbm93OiBuZXcgRGF0ZSgpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgICBmcy5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICBmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kaXNhYmxlZCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaW5saW5lSGVscFRleHQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHQ7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ibGFja2JveCkge1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtaW4nKSkge1xuICAgICAgZnMubWluID0gZmllbGQubWluO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtYXgnKSkge1xuICAgICAgZnMubWF4ID0gZmllbGQubWF4O1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzUHJvZHVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLmluZGV4KSB7XG4gICAgICAgIGZzLmluZGV4ID0gZmllbGQuaW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLnNvcnRhYmxlKSB7XG4gICAgICAgIGZzLmluZGV4ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzO1xuICB9KTtcbiAgcmV0dXJuIHNjaGVtYTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpIHtcbiAgdmFyIGZpZWxkLCBodG1sLCBvYmplY3Q7XG4gIGh0bWwgPSBmaWVsZF92YWx1ZTtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKTtcbiAgaWYgKCFmaWVsZCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpO1xuICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gIH1cbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpO1xufTtcblxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBvcGVyYXRpb25zKSB7XG4gIHZhciBidWlsdGluVmFsdWVzO1xuICBidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKGJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm4gXy5mb3JFYWNoKGJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGJ1aWx0aW5JdGVtLCBrZXkpIHtcbiAgICAgIHJldHVybiBvcGVyYXRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsXG4gICAgICAgIHZhbHVlOiBrZXlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIHZhbHVlKSB7XG4gIHZhciBiZXR3ZWVuQnVpbHRpblZhbHVlcywgcmVzdWx0O1xuICBpZiAoIV8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKCFiZXR3ZWVuQnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybjtcbiAgfVxuICByZXN1bHQgPSBudWxsO1xuICBfLmVhY2goYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGl0ZW0sIG9wZXJhdGlvbikge1xuICAgIGlmIChpdGVtLmtleSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXN1bHQgPSBvcGVyYXRpb247XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSkge1xuICByZXR1cm4ge1xuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuICB9O1xufTtcblxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IGZ1bmN0aW9uKG1vbnRoKSB7XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgcmV0dXJuIDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgcmV0dXJuIDY7XG4gIH1cbiAgcmV0dXJuIDk7XG59O1xuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgeWVhci0tO1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoID0gNjtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDY7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2Uge1xuICAgIHllYXIrKztcbiAgICBtb250aCA9IDA7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgdmFyIGRheXMsIGVuZERhdGUsIG1pbGxpc2Vjb25kLCBzdGFydERhdGU7XG4gIGlmIChtb250aCA9PT0gMTEpIHtcbiAgICByZXR1cm4gMzE7XG4gIH1cbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICBzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDEpO1xuICBkYXlzID0gKGVuZERhdGUgLSBzdGFydERhdGUpIC8gbWlsbGlzZWNvbmQ7XG4gIHJldHVybiBkYXlzO1xufTtcblxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA9PT0gMCkge1xuICAgIG1vbnRoID0gMTE7XG4gICAgeWVhci0tO1xuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIH1cbiAgbW9udGgtLTtcbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIHZhciBjdXJyZW50TW9udGgsIGN1cnJlbnRZZWFyLCBlbmRWYWx1ZSwgZmlyc3REYXksIGxhYmVsLCBsYXN0RGF5LCBsYXN0TW9uZGF5LCBsYXN0TW9udGhGaW5hbERheSwgbGFzdE1vbnRoRmlyc3REYXksIGxhc3RRdWFydGVyRW5kRGF5LCBsYXN0UXVhcnRlclN0YXJ0RGF5LCBsYXN0U3VuZGF5LCBsYXN0XzEyMF9kYXlzLCBsYXN0XzMwX2RheXMsIGxhc3RfNjBfZGF5cywgbGFzdF83X2RheXMsIGxhc3RfOTBfZGF5cywgbWlsbGlzZWNvbmQsIG1pbnVzRGF5LCBtb25kYXksIG1vbnRoLCBuZXh0TW9uZGF5LCBuZXh0TW9udGhGaW5hbERheSwgbmV4dE1vbnRoRmlyc3REYXksIG5leHRRdWFydGVyRW5kRGF5LCBuZXh0UXVhcnRlclN0YXJ0RGF5LCBuZXh0U3VuZGF5LCBuZXh0WWVhciwgbmV4dF8xMjBfZGF5cywgbmV4dF8zMF9kYXlzLCBuZXh0XzYwX2RheXMsIG5leHRfN19kYXlzLCBuZXh0XzkwX2RheXMsIG5vdywgcHJldmlvdXNZZWFyLCBzdGFydFZhbHVlLCBzdHJFbmREYXksIHN0ckZpcnN0RGF5LCBzdHJMYXN0RGF5LCBzdHJNb25kYXksIHN0clN0YXJ0RGF5LCBzdHJTdW5kYXksIHN0clRvZGF5LCBzdHJUb21vcnJvdywgc3RyWWVzdGRheSwgc3VuZGF5LCB0aGlzUXVhcnRlckVuZERheSwgdGhpc1F1YXJ0ZXJTdGFydERheSwgdG9tb3Jyb3csIHZhbHVlcywgd2VlaywgeWVhciwgeWVzdGRheTtcbiAgbm93ID0gbmV3IERhdGUoKTtcbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICB5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdG9tb3Jyb3cgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICB3ZWVrID0gbm93LmdldERheSgpO1xuICBtaW51c0RheSA9IHdlZWsgIT09IDAgPyB3ZWVrIC0gMSA6IDY7XG4gIG1vbmRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAobWludXNEYXkgKiBtaWxsaXNlY29uZCkpO1xuICBzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpO1xuICBuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgbmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpO1xuICBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDE7XG4gIG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxO1xuICBjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpO1xuICBmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIDEpO1xuICBpZiAoY3VycmVudE1vbnRoID09PSAxMSkge1xuICAgIHllYXIrKztcbiAgICBtb250aCsrO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoKys7XG4gIH1cbiAgbmV4dE1vbnRoRmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsIG1vbnRoKSk7XG4gIGxhc3REYXkgPSBuZXcgRGF0ZShuZXh0TW9udGhGaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb250aEZpcnN0RGF5ID0gQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLCAxKTtcbiAgdGhpc1F1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIpKTtcbiAgbGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBuZXh0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIGxhc3RfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2UgXCJsYXN0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChsYXN0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChuZXh0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInllc3RkYXlcIjpcbiAgICAgIHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3llc3RkYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b2RheVwiOlxuICAgICAgc3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvbW9ycm93XCI6XG4gICAgICBzdHJUb21vcnJvdyA9IG1vbWVudCh0b21vcnJvdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgfVxuICB2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdO1xuICBpZiAoZmllbGRfdHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgXy5mb3JFYWNoKHZhbHVlcywgZnVuY3Rpb24oZnYpIHtcbiAgICAgIGlmIChmdikge1xuICAgICAgICByZXR1cm4gZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBsYWJlbDogbGFiZWwsXG4gICAga2V5OiBrZXksXG4gICAgdmFsdWVzOiB2YWx1ZXNcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICBpZiAoZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnYmV0d2Vlbic7XG4gIH0gZWxzZSBpZiAoW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnY29udGFpbnMnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIj1cIjtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgdmFyIG9wZXJhdGlvbnMsIG9wdGlvbmFscztcbiAgb3B0aW9uYWxzID0ge1xuICAgIGVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj1cIlxuICAgIH0sXG4gICAgdW5lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw+XCJcbiAgICB9LFxuICAgIGxlc3NfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPFwiXG4gICAgfSxcbiAgICBncmVhdGVyX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIj5cIlxuICAgIH0sXG4gICAgbGVzc19vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw9XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI+PVwiXG4gICAgfSxcbiAgICBjb250YWluczoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksXG4gICAgICB2YWx1ZTogXCJjb250YWluc1wiXG4gICAgfSxcbiAgICBub3RfY29udGFpbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSxcbiAgICAgIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJcbiAgICB9LFxuICAgIHN0YXJ0c193aXRoOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSxcbiAgICAgIHZhbHVlOiBcInN0YXJ0c3dpdGhcIlxuICAgIH0sXG4gICAgYmV0d2Vlbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSxcbiAgICAgIHZhbHVlOiBcImJldHdlZW5cIlxuICAgIH1cbiAgfTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpO1xuICB9XG4gIG9wZXJhdGlvbnMgPSBbXTtcbiAgaWYgKENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKTtcbiAgICBDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcInRleHRcIiB8fCBmaWVsZF90eXBlID09PSBcInRleHRhcmVhXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJodG1sXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJjb2RlXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkX3R5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjdXJyZW5jeVwiIHx8IGZpZWxkX3R5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJbdGV4dF1cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH1cbiAgcmV0dXJuIG9wZXJhdGlvbnM7XG59O1xuXG5cbi8qXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXG4gICAg5YaN5bCG5rKh5pyJ5o6S5bqP5Y+355qE5pi+56S65ZyoXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGZpZWxkcywgZmllbGRzQXJyLCBmaWVsZHNOYW1lLCByZWY7XG4gIGZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICBmaWVsZHNBcnIgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goe1xuICAgICAgbmFtZTogZmllbGQubmFtZSxcbiAgICAgIHNvcnRfbm86IGZpZWxkLnNvcnRfbm9cbiAgICB9KTtcbiAgfSk7XG4gIGZpZWxkc05hbWUgPSBbXTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gZmllbGRzTmFtZTtcbn07XG4iLCJDcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge31cclxuXHJcbmluaXRUcmlnZ2VyID0gKG9iamVjdF9uYW1lLCB0cmlnZ2VyKS0+XHJcblx0dHJ5XHJcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxyXG5cdFx0aWYgIXRyaWdnZXIudG9kb1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdHRvZG9XcmFwcGVyID0gKCktPlxyXG5cdFx0XHQgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZVxyXG5cdFx0XHQgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKVxyXG5cdFx0aWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLmluc2VydFwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS51cGRhdGVcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnVwZGF0ZSh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUucmVtb3ZlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy5yZW1vdmUodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIuaW5zZXJ0XCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/Lmluc2VydCh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci51cGRhdGVcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8udXBkYXRlKHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnJlbW92ZVwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy5yZW1vdmUodG9kb1dyYXBwZXIpXHJcblx0Y2F0Y2ggZXJyb3JcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpXHJcblxyXG5jbGVhblRyaWdnZXIgPSAob2JqZWN0X25hbWUpLT5cclxuXHQjIyNcclxuICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXHJcbiAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxyXG5cdCMjI1xyXG4gICAgI1RPRE8g55Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsGJ1Z1xyXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdPy5yZXZlcnNlKCkuZm9yRWFjaCAoX2hvb2spLT5cclxuXHRcdF9ob29rLnJlbW92ZSgpXHJcblxyXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IChvYmplY3RfbmFtZSktPlxyXG4jXHRjb25zb2xlLmxvZygnQ3JlYXRvci5pbml0VHJpZ2dlcnMgb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSlcclxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0Y2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKVxyXG5cclxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdXHJcblxyXG5cdF8uZWFjaCBvYmoudHJpZ2dlcnMsICh0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpLT5cclxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciBhbmQgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxyXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcclxuXHRcdFx0aWYgX3RyaWdnZXJfaG9va1xyXG5cdFx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaylcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxyXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcclxuXHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKSIsInZhciBjbGVhblRyaWdnZXIsIGluaXRUcmlnZ2VyO1xuXG5DcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge307XG5cbmluaXRUcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHRyaWdnZXIpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGVycm9yLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHRvZG9XcmFwcGVyO1xuICB0cnkge1xuICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIGlmICghdHJpZ2dlci50b2RvKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRvZG9XcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZi5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYxID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYxLnVwZGF0ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjIgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjIucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYzID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjMuaW5zZXJ0KHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY0ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjQudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY1ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjUucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgIGVycm9yID0gZXJyb3IxO1xuICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKTtcbiAgfVxufTtcblxuY2xlYW5UcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcblxuICAvKlxuICAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuICAgKi9cbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSkgIT0gbnVsbCA/IHJlZi5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbihfaG9vaykge1xuICAgIHJldHVybiBfaG9vay5yZW1vdmUoKTtcbiAgfSkgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBvYmo7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0gPSBbXTtcbiAgcmV0dXJuIF8uZWFjaChvYmoudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSkge1xuICAgIHZhciBfdHJpZ2dlcl9ob29rO1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgaWYgKF90cmlnZ2VyX2hvb2spIHtcbiAgICAgICAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICByZXR1cm4gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKVxyXG5cclxuQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRcdGlmICFvYmpcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRyZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpXHJcblx0ZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHJcbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XHJcblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRpZiAhc3BhY2VJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHJcblx0aWYgcmVjb3JkIGFuZCBvYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdCMg5aaC5p6c5pivY21zX2ZpbGVz6ZmE5Lu277yM5YiZ5p2D6ZmQ5Y+W5YW254i26K6w5b2V5p2D6ZmQXHJcblx0XHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKVxyXG5cdFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tuivpue7hueVjOmdolxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xyXG5cdFx0XHRyZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcclxuXHRcdGVsc2UgXHJcblx0XHRcdCMg5b2T5YmN5aSE5LqOY21zX2ZpbGVz6ZmE5Lu255qE54i26K6w5b2V55WM6Z2iXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XHJcblx0XHRcdHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xyXG5cdFx0b2JqZWN0X2ZpZWxkc19rZXlzID0gXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uZmllbGRzIG9yIHt9KSB8fCBbXTtcclxuXHRcdHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcclxuXHRcdGlmIHNlbGVjdC5sZW5ndGggPiAwXHJcblx0XHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdC5qb2luKCcsJykpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZWNvcmQgPSBudWxsO1xyXG5cclxuXHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSlcclxuXHJcblx0aWYgcmVjb3JkXHJcblx0XHRpZiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXHJcblx0XHRcdHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXHJcblxyXG5cdFx0aXNPd25lciA9IHJlY29yZC5vd25lciA9PSB1c2VySWQgfHwgcmVjb3JkLm93bmVyPy5faWQgPT0gdXNlcklkXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpXHJcblx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZD8uY29tcGFueV9pZFxyXG5cdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpIGFuZCByZWNvcmRfY29tcGFueV9pZC5faWRcclxuXHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZOaYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEb2JqZWN077yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XHJcblx0XHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkXHJcblx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQ/LmNvbXBhbnlfaWRzXHJcblx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWRzWzBdKVxyXG5cdFx0XHQjIOWboHJlY29yZF9jb21wYW55X2lkc+aYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEW29iamVjdF3vvIzmiYDku6Xov5nph4zlj5blh7rlhbZfaWTlgLxcclxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcCgobiktPiBuLl9pZClcclxuXHRcdHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKVxyXG5cdFx0aWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cdFx0ZWxzZSBpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXHJcblx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcclxuXHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxyXG5cdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5L+u5pS5XHJcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5L+u5pS5XHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cdFx0XHJcblx0XHRpZiByZWNvcmQubG9ja2VkIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblxyXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxyXG5cdFx0ZWxzZSBpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGhcclxuXHRcdFx0XHRpZiB1c2VyX2NvbXBhbnlfaWRzIGFuZCB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aFxyXG5cdFx0XHRcdFx0aWYgIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoXHJcblx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPmn6XnnItcclxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2VcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWTlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5p+l55yLXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxyXG5cclxuXHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHJcblxyXG4jIGN1cnJlbnRPYmplY3ROYW1l77ya5b2T5YmN5Li75a+56LGhXHJcbiMgcmVsYXRlZExpc3RJdGVt77yaQ3JlYXRvci5nZXRSZWxhdGVkTGlzdChTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpLCBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSnkuK3lj5ZyZWxhdGVkX29iamVjdF9uYW1l5a+55bqU55qE5YC8XHJcbiMgY3VycmVudFJlY29yZOW9k+WJjeS4u+WvueixoeeahOivpue7huiusOW9lVxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMgPSAoY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XHJcblx0XHRpZiAhY3VycmVudE9iamVjdE5hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0XHRpZiAhcmVsYXRlZExpc3RJdGVtXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XHJcblx0XHRcdHJldHVybiB7fVxyXG5cclxuXHRcdGlmICFjdXJyZW50UmVjb3JkIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0Y3VycmVudFJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcclxuXHJcblx0XHRpZiAhdXNlcklkIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdFx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblxyXG5cdFx0c2hhcmluZyA9IHJlbGF0ZWRMaXN0SXRlbS5zaGFyaW5nIHx8ICdtYXN0ZXJXcml0ZSdcclxuXHRcdG1hc3RlckFsbG93ID0gZmFsc2VcclxuXHRcdG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zKGN1cnJlbnRPYmplY3ROYW1lLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpXHJcblx0XHRpZiBzaGFyaW5nID09ICdtYXN0ZXJSZWFkJ1xyXG5cdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkXHJcblx0XHRlbHNlIGlmIHNoYXJpbmcgPT0gJ21hc3RlcldyaXRlJ1xyXG5cdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0XHJcblxyXG5cdFx0dW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSlcclxuXHRcdHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKVxyXG5cdFx0aXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlID0gdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QuaW5kZXhPZihyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpID4gLTFcclxuXHJcblx0XHRyZXN1bHQgPSBfLmNsb25lIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9uc1xyXG5cdFx0cmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcclxuXHRcdHJlc3VsdC5hbGxvd0VkaXQgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcclxuXHRcdHJldHVybiByZXN1bHRcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cclxuXHRDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCkgLT5cclxuXHRcdHBlcm1pc3Npb25zID1cclxuXHRcdFx0b2JqZWN0czoge31cclxuXHRcdFx0YXNzaWduZWRfYXBwczogW11cclxuXHRcdCMjI1xyXG5cdFx05p2D6ZmQ57uE6K+05piOOlxyXG5cdFx05YaF572u5p2D6ZmQ57uELWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxyXG5cdFx06Ieq5a6a5LmJ5p2D6ZmQ57uELeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOe7hOS7peWklueahOWFtuS7luadg+mZkOe7hFxyXG5cdFx054m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ57uE77yI5Y2zdXNlcnPlsZ7mgKfkuI3lj6/phY3nva7vvIktYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3RcclxuXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOe7hO+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOe7hFxyXG5cdFx0IyMjXHJcblxyXG5cdFx0aXNTcGFjZUFkbWluID0gZmFsc2VcclxuXHRcdHNwYWNlVXNlciA9IG51bGxcclxuXHRcdGlmIHVzZXJJZFxyXG5cdFx0XHRpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxyXG5cclxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0cHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cclxuXHRcdHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0cHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXHJcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcclxuXHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXHJcblxyXG5cdFx0cHNldHNBZG1pbl9wb3MgPSBudWxsXHJcblx0XHRwc2V0c1VzZXJfcG9zID0gbnVsbFxyXG5cdFx0cHNldHNNZW1iZXJfcG9zID0gbnVsbFxyXG5cdFx0cHNldHNHdWVzdF9wb3MgPSBudWxsXHJcblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gbnVsbFxyXG5cdFx0cHNldHNTdXBwbGllcl9wb3MgPSBudWxsXHJcblx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGxcclxuXHJcblx0XHRpZiBwc2V0c0FkbWluPy5faWRcclxuXHRcdFx0cHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxyXG5cdFx0XHRwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblx0XHRpZiBwc2V0c01lbWJlcj8uX2lkXHJcblx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblx0XHRpZiBwc2V0c0d1ZXN0Py5faWRcclxuXHRcdFx0cHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblx0XHRpZiBwc2V0c1N1cHBsaWVyPy5faWRcclxuXHRcdFx0cHNldHNTdXBwbGllcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzU3VwcGxpZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblx0XHRpZiBwc2V0c0N1c3RvbWVyPy5faWRcclxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblxyXG5cdFx0aWYgcHNldHNDdXJyZW50Lmxlbmd0aCA+IDBcclxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIl9pZFwiXHJcblx0XHRcdHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHNldF9pZHN9fSkuZmV0Y2goKVxyXG5cdFx0XHRwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIm5hbWVcIlxyXG5cclxuXHRcdHBzZXRzID0ge1xyXG5cdFx0XHRwc2V0c0FkbWluLCBcclxuXHRcdFx0cHNldHNVc2VyLCBcclxuXHRcdFx0cHNldHNDdXJyZW50LCBcclxuXHRcdFx0cHNldHNNZW1iZXIsIFxyXG5cdFx0XHRwc2V0c0d1ZXN0LFxyXG5cdFx0XHRwc2V0c1N1cHBsaWVyLFxyXG5cdFx0XHRwc2V0c0N1c3RvbWVyLFxyXG5cdFx0XHRpc1NwYWNlQWRtaW4sXHJcblx0XHRcdHNwYWNlVXNlciwgXHJcblx0XHRcdHBzZXRzQWRtaW5fcG9zLCBcclxuXHRcdFx0cHNldHNVc2VyX3BvcywgXHJcblx0XHRcdHBzZXRzTWVtYmVyX3BvcywgXHJcblx0XHRcdHBzZXRzR3Vlc3RfcG9zLFxyXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyxcclxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MsXHJcblx0XHRcdHBzZXRzQ3VycmVudF9wb3NcclxuXHRcdH1cclxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX2FwcHMgPSBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzXHJcblx0XHRfaSA9IDBcclxuXHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XHJcblx0XHRcdF9pKytcclxuXHRcdFx0aWYgIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT0gc3BhY2VJZFxyXG5cdFx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PSAnMCcgfHwgKG9iamVjdC5pbl9kZXZlbG9wbWVudCAhPSAnMCcgJiYgaXNTcGFjZUFkbWluKVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXHJcblxyXG5cdHVuaW9uUGx1cyA9IChhcnJheSwgb3RoZXIpIC0+XHJcblx0XHRpZiAhYXJyYXkgYW5kICFvdGhlclxyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXHJcblx0XHRpZiAhYXJyYXlcclxuXHRcdFx0YXJyYXkgPSBbXVxyXG5cdFx0aWYgIW90aGVyXHJcblx0XHRcdG90aGVyID0gW11cclxuXHRcdHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcilcclxuXHJcblx0aW50ZXJzZWN0aW9uUGx1cyA9IChhcnJheSwgb3RoZXIpIC0+XHJcblx0XHRpZiAhYXJyYXkgYW5kICFvdGhlclxyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXHJcblx0XHRpZiAhYXJyYXlcclxuXHRcdFx0YXJyYXkgPSBbXVxyXG5cdFx0aWYgIW90aGVyXHJcblx0XHRcdG90aGVyID0gW11cclxuXHRcdHJldHVybiBfLmludGVyc2VjdGlvbihhcnJheSwgb3RoZXIpXHJcblxyXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdFx0cHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRwc2V0c1N1cHBsaWVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdHBzZXRzQ3VzdG9tZXIgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHQjIHBzZXRzTWVtYmVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHQjIHBzZXRzR3Vlc3QgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRwc2V0cyA9ICB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdGFwcHMgPSBbXVxyXG5cdFx0aWYgaXNTcGFjZUFkbWluXHJcblx0XHRcdHJldHVybiBbXVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR1c2VyUHJvZmlsZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KT8ucHJvZmlsZVxyXG5cdFx0XHRwc2V0QmFzZSA9IHBzZXRzVXNlclxyXG5cdFx0XHRpZiB1c2VyUHJvZmlsZVxyXG5cdFx0XHRcdGlmIHVzZXJQcm9maWxlID09ICdzdXBwbGllcidcclxuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNTdXBwbGllclxyXG5cdFx0XHRcdGVsc2UgaWYgdXNlclByb2ZpbGUgPT0gJ2N1c3RvbWVyJ1xyXG5cdFx0XHRcdFx0cHNldEJhc2UgPSBwc2V0c0N1c3RvbWVyXHJcblx0XHRcdGlmIHBzZXRCYXNlPy5hc3NpZ25lZF9hcHBzPy5sZW5ndGhcclxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHQjIHVzZXLmnYPpmZDnu4TkuK3nmoRhc3NpZ25lZF9hcHBz6KGo56S65omA5pyJ55So5oi35YW35pyJ55qEYXBwc+adg+mZkO+8jOS4uuepuuWImeihqOekuuacieaJgOaciWFwcHPmnYPpmZDvvIzkuI3pnIDopoHkvZzmnYPpmZDliKTmlq3kuoZcclxuXHRcdFx0XHRyZXR1cm4gW11cclxuXHRcdFx0Xy5lYWNoIHBzZXRzLCAocHNldCktPlxyXG5cdFx0XHRcdGlmICFwc2V0LmFzc2lnbmVkX2FwcHNcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdGlmIHBzZXQubmFtZSA9PSBcImFkbWluXCIgfHwgIHBzZXQubmFtZSA9PSBcInVzZXJcIiB8fCBwc2V0Lm5hbWUgPT0gJ3N1cHBsaWVyJyB8fCBwc2V0Lm5hbWUgPT0gJ2N1c3RvbWVyJ1xyXG5cdFx0XHRcdFx0IyDov5nph4zkuYvmiYDku6XopoHmjpLpmaRhZG1pbi91c2Vy77yM5piv5Zug5Li66L+Z5Lik5Liq5p2D6ZmQ57uE5piv5omA5pyJ5p2D6ZmQ57uE5LitdXNlcnPlsZ7mgKfml6DmlYjnmoTmnYPpmZDnu4TvvIznibnmjIflt6XkvZzljLrnrqHnkIblkZjlkozmiYDmnInnlKjmiLdcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwc1xyXG5cdFx0XHRyZXR1cm4gXy53aXRob3V0KF8udW5pcShhcHBzKSx1bmRlZmluZWQsbnVsbClcclxuXHJcblx0Q3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdFx0cHNldHMgPSAgdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRhZG1pbk1lbnVzID0gQ3JlYXRvci5BcHBzLmFkbWluPy5hZG1pbl9tZW51c1xyXG5cdFx0IyDlpoLmnpzmsqHmnIlhZG1pbuiPnOWNleivtOaYjuS4jemcgOimgeebuOWFs+WKn+iDve+8jOebtOaOpei/lOWbnuepulxyXG5cdFx0dW5sZXNzIGFkbWluTWVudXNcclxuXHRcdFx0cmV0dXJuIFtdXHJcblx0XHRhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQgKG4pIC0+XHJcblx0XHRcdG4uX2lkID09ICdhYm91dCdcclxuXHRcdGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlciAobikgLT5cclxuXHRcdFx0bi5faWQgIT0gJ2Fib3V0J1xyXG5cdFx0b3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5IF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIChuKSAtPlxyXG5cdFx0XHRyZXR1cm4gbi5hZG1pbl9tZW51cyBhbmQgbi5faWQgIT0gJ2FkbWluJ1xyXG5cdFx0KSwgJ3NvcnQnXHJcblx0XHRvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSlcclxuXHRcdCMg6I+c5Y2V5pyJ5LiJ6YOo5YiG57uE5oiQ77yM6K6+572uQVBQ6I+c5Y2V44CB5YW25LuWQVBQ6I+c5Y2V5Lul5Y+KYWJvdXToj5zljZVcclxuXHRcdGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSlcclxuXHRcdGlmIGlzU3BhY2VBZG1pblxyXG5cdFx0XHQjIOW3peS9nOWMuueuoeeQhuWRmOacieWFqOmDqOiPnOWNleWKn+iDvVxyXG5cdFx0XHRyZXN1bHQgPSBhbGxNZW51c1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR1c2VyUHJvZmlsZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KT8ucHJvZmlsZSB8fCAndXNlcidcclxuXHRcdFx0Y3VycmVudFBzZXROYW1lcyA9IHBzZXRzLm1hcCAobikgLT5cclxuXHRcdFx0XHRyZXR1cm4gbi5uYW1lXHJcblx0XHRcdG1lbnVzID0gYWxsTWVudXMuZmlsdGVyIChtZW51KS0+XHJcblx0XHRcdFx0cHNldHNNZW51ID0gbWVudS5wZXJtaXNzaW9uX3NldHNcclxuXHRcdFx0XHQjIOWmguaenOaZrumAmueUqOaIt+acieadg+mZkO+8jOWImeebtOaOpei/lOWbnnRydWVcclxuXHRcdFx0XHRpZiBwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YodXNlclByb2ZpbGUpID4gLTFcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdFx0IyDlkKbliJnlj5blvZPliY3nlKjmiLfnmoTmnYPpmZDpm4bkuI5tZW516I+c5Y2V6KaB5rGC55qE5p2D6ZmQ6ZuG5a+55q+U77yM5aaC5p6c5Lqk6ZuG5aSn5LqOMeS4quWImei/lOWbnnRydWVcclxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGhcclxuXHRcdFx0cmVzdWx0ID0gbWVudXNcclxuXHRcdFxyXG5cdFx0cmV0dXJuIF8uc29ydEJ5KHJlc3VsdCxcInNvcnRcIilcclxuXHJcblx0ZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCktPlxyXG5cclxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXHJcblx0XHRcdHJldHVybiBfLmZpbmQgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cclxuXHRcdFx0XHRcdHJldHVybiBwby5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZH0pXHJcblxyXG5cdGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKS0+XHJcblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxyXG5cdFx0XHRyZXR1cm4gXy5maWx0ZXIgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cclxuXHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcclxuXHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiB7JGluOiBwZXJtaXNzaW9uX3NldF9pZHN9fSkuZmV0Y2goKVxyXG5cclxuXHR1bmlvblBlcm1pc3Npb25PYmplY3RzID0gKHBvcywgb2JqZWN0LCBwc2V0cyktPlxyXG5cdFx0IyDmiopkYuWPinltbOS4reeahHBlcm1pc3Npb25fb2JqZWN0c+WQiOW5tu+8jOS8mOWFiOWPlmRi5Lit55qEXHJcblx0XHRyZXN1bHQgPSBbXVxyXG5cdFx0Xy5lYWNoIG9iamVjdC5wZXJtaXNzaW9uX3NldCwgKG9wcywgb3BzX2tleSktPlxyXG5cdFx0XHQjIOaKinltbOS4remZpOS6hueJueWumueUqOaIt+mbhuWQiOadg+mZkOe7hFwiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIuWklueahOWFtuS7luWvueixoeadg+mZkOWFiOWtmOWFpXJlc3VsdFxyXG5cdFx0XHQjIGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCIsIFwid29ya2Zsb3dfYWRtaW5cIiwgXCJvcmdhbml6YXRpb25fYWRtaW5cIl0uaW5kZXhPZihvcHNfa2V5KSA8IDBcclxuXHRcdFx0aWYgW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDBcclxuXHRcdFx0XHRjdXJyZW50UHNldCA9IHBzZXRzLmZpbmQgKHBzZXQpLT4gcmV0dXJuIHBzZXQubmFtZSA9PSBvcHNfa2V5XHJcblx0XHRcdFx0aWYgY3VycmVudFBzZXRcclxuXHRcdFx0XHRcdHRlbXBPcHMgPSBfLmNsb25lKG9wcykgfHwge31cclxuXHRcdFx0XHRcdHRlbXBPcHMucGVybWlzc2lvbl9zZXRfaWQgPSBjdXJyZW50UHNldC5faWRcclxuXHRcdFx0XHRcdHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoIHRlbXBPcHNcclxuXHRcdGlmIHJlc3VsdC5sZW5ndGhcclxuXHRcdFx0cG9zLmZvckVhY2ggKHBvKS0+XHJcblx0XHRcdFx0cmVwZWF0SW5kZXggPSAwXHJcblx0XHRcdFx0cmVwZWF0UG8gPSByZXN1bHQuZmluZCgoaXRlbSwgaW5kZXgpLT4gcmVwZWF0SW5kZXggPSBpbmRleDtyZXR1cm4gaXRlbS5wZXJtaXNzaW9uX3NldF9pZCA9PSBwby5wZXJtaXNzaW9uX3NldF9pZClcclxuXHRcdFx0XHQjIOWmguaenHltbOS4reW3sue7j+WtmOWcqHBv77yM5YiZ5pu/5o2i5Li65pWw5o2u5bqT5Lit55qEcG/vvIzlj43kuYvliJnmiormlbDmja7lupPkuK3nmoRwb+ebtOaOpee0r+WKoOi/m+WOu1xyXG5cdFx0XHRcdGlmIHJlcGVhdFBvXHJcblx0XHRcdFx0XHRyZXN1bHRbcmVwZWF0SW5kZXhdID0gcG9cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXN1bHQucHVzaCBwb1xyXG5cdFx0XHRyZXR1cm4gcmVzdWx0XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBwb3NcclxuXHJcblx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKS0+XHJcblx0XHRwZXJtaXNzaW9ucyA9IHt9XHJcblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZClcclxuXHJcblx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT0gXCJ1c2Vyc1wiXHJcblx0XHRcdHBlcm1pc3Npb25zID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XHJcblx0XHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXHJcblx0XHRcdHJldHVybiBwZXJtaXNzaW9uc1xyXG5cdFx0cHNldHNBZG1pbiA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgb3IgdGhpcy5wc2V0c0FkbWluIHRoZW4gdGhpcy5wc2V0c0FkbWluIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MX19KVxyXG5cdFx0cHNldHNVc2VyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIG9yIHRoaXMucHNldHNVc2VyIHRoZW4gdGhpcy5wc2V0c1VzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzTWVtYmVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgb3IgdGhpcy5wc2V0c01lbWJlciB0aGVuIHRoaXMucHNldHNNZW1iZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxyXG5cdFx0cHNldHNHdWVzdCA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgb3IgdGhpcy5wc2V0c0d1ZXN0IHRoZW4gdGhpcy5wc2V0c0d1ZXN0IGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MX19KVxyXG5cclxuXHRcdHBzZXRzU3VwcGxpZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzU3VwcGxpZXIpIG9yIHRoaXMucHNldHNTdXBwbGllciB0aGVuIHRoaXMucHNldHNTdXBwbGllciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzQ3VzdG9tZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQ3VzdG9tZXIpIG9yIHRoaXMucHNldHNDdXN0b21lciB0aGVuIHRoaXMucHNldHNDdXN0b21lciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblxyXG5cdFx0cHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zXHJcblx0XHRwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zXHJcblx0XHRwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3Bvc1xyXG5cdFx0cHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zXHJcblxyXG5cdFx0cHNldHNTdXBwbGllcl9wb3MgPSB0aGlzLnBzZXRzU3VwcGxpZXJfcG9zXHJcblx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3NcclxuXHJcblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zXHJcblxyXG5cdFx0b3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fVxyXG5cdFx0b3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge31cclxuXHRcdG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fVxyXG5cdFx0b3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxyXG5cclxuXHRcdG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge31cclxuXHRcdG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge31cclxuXHJcblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X2xpc3R2aWV3cycpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNoYXJlZDogdHJ1ZX0sIHtmaWVsZHM6e19pZDoxfX0pLmZldGNoKClcclxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gXy5wbHVjayhzaGFyZWRMaXN0Vmlld3MsXCJfaWRcIilcclxuXHRcdCMgaWYgc2hhcmVkTGlzdFZpZXdzLmxlbmd0aFxyXG5cdFx0IyBcdHVubGVzcyBvcHNldEFkbWluLmxpc3Rfdmlld3NcclxuXHRcdCMgXHRcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IFtdXHJcblx0XHQjIFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldEFkbWluLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xyXG5cdFx0IyBcdHVubGVzcyBvcHNldFVzZXIubGlzdF92aWV3c1xyXG5cdFx0IyBcdFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBbXVxyXG5cdFx0IyBcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldFVzZXIubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXHJcblx0XHQjIOaVsOaNruW6k+S4reWmguaenOmFjee9ruS6hum7mOiupOeahGFkbWluL3VzZXLmnYPpmZDpm4borr7nva7vvIzlupTor6Xopobnm5bku6PnoIHkuK1hZG1pbi91c2Vy55qE5p2D6ZmQ6ZuG6K6+572uXHJcblx0XHRpZiBwc2V0c0FkbWluXHJcblx0XHRcdHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKVxyXG5cdFx0XHRpZiBwb3NBZG1pblxyXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NBZG1pbi5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dEZWxldGUgPSBwb3NBZG1pbi5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dFZGl0ID0gcG9zQWRtaW4uYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd1JlYWQgPSBwb3NBZG1pbi5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldEFkbWluLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc0FkbWluLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQWRtaW4uZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5yZWFkYWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NBZG1pbi51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NBZG1pbi51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxyXG5cdFx0aWYgcHNldHNVc2VyXHJcblx0XHRcdHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKVxyXG5cdFx0XHRpZiBwb3NVc2VyXHJcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93Q3JlYXRlID0gcG9zVXNlci5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd0RlbGV0ZSA9IHBvc1VzZXIuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dFZGl0ID0gcG9zVXNlci5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dSZWFkID0gcG9zVXNlci5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldFVzZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci52aWV3QWxsUmVjb3JkcyA9IHBvc1VzZXIudmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldFVzZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldFVzZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1VzZXIuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0VXNlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldFVzZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NVc2VyLnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zVXNlci51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0XHRcdG9wc2V0VXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1VzZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcclxuXHRcdGlmIHBzZXRzTWVtYmVyXHJcblx0XHRcdHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKVxyXG5cdFx0XHRpZiBwb3NNZW1iZXJcclxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd0NyZWF0ZSA9IHBvc01lbWJlci5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93RGVsZXRlID0gcG9zTWVtYmVyLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dFZGl0ID0gcG9zTWVtYmVyLmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93UmVhZCA9IHBvc01lbWJlci5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldE1lbWJlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci52aWV3QWxsUmVjb3JkcyA9IHBvc01lbWJlci52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NNZW1iZXIuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc01lbWJlci51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zTWVtYmVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblx0XHRpZiBwc2V0c0d1ZXN0XHJcblx0XHRcdHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKVxyXG5cdFx0XHRpZiBwb3NHdWVzdFxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dDcmVhdGUgPSBwb3NHdWVzdC5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dEZWxldGUgPSBwb3NHdWVzdC5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dFZGl0ID0gcG9zR3Vlc3QuYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd1JlYWQgPSBwb3NHdWVzdC5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldEd1ZXN0Lm1vZGlmeUFsbFJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC52aWV3QWxsUmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5kaXNhYmxlZF9hY3Rpb25zID0gcG9zR3Vlc3QuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5yZWxhdGVkX29iamVjdHMgPSBwb3NHdWVzdC51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NHdWVzdC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxyXG5cdFx0aWYgcHNldHNTdXBwbGllclxyXG5cdFx0XHRwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XHJcblx0XHRcdGlmIHBvc1N1cHBsaWVyXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5hbGxvd0NyZWF0ZSA9IHBvc1N1cHBsaWVyLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5hbGxvd0RlbGV0ZSA9IHBvc1N1cHBsaWVyLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5hbGxvd0VkaXQgPSBwb3NTdXBwbGllci5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmFsbG93UmVhZCA9IHBvc1N1cHBsaWVyLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnZpZXdBbGxSZWNvcmRzID0gcG9zU3VwcGxpZXIudmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zU3VwcGxpZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1N1cHBsaWVyLmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NTdXBwbGllci5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1N1cHBsaWVyLnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1N1cHBsaWVyLnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc1N1cHBsaWVyLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1N1cHBsaWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblx0XHRpZiBwc2V0c0N1c3RvbWVyXHJcblx0XHRcdHBvc0N1c3RvbWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1c3RvbWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQ3VzdG9tZXIuX2lkKTtcclxuXHRcdFx0aWYgcG9zQ3VzdG9tZXJcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmFsbG93Q3JlYXRlID0gcG9zQ3VzdG9tZXIuYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmFsbG93RGVsZXRlID0gcG9zQ3VzdG9tZXIuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmFsbG93RWRpdCA9IHBvc0N1c3RvbWVyLmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuYWxsb3dSZWFkID0gcG9zQ3VzdG9tZXIuYWxsb3dSZWFkXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zQ3VzdG9tZXIubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudmlld0FsbFJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NDdXN0b21lci5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zQ3VzdG9tZXIudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0N1c3RvbWVyLmRpc2FibGVkX2FjdGlvbnNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zQ3VzdG9tZXIudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQ3VzdG9tZXIudW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zQ3VzdG9tZXIudW5yZWxhdGVkX29iamVjdHNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zQ3VzdG9tZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcclxuXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBpc1NwYWNlQWRtaW5cclxuXHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2NvbW1vbidcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0c3BhY2VVc2VyID0gaWYgXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIG9yIHRoaXMuc3BhY2VVc2VyIHRoZW4gdGhpcy5zcGFjZVVzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcclxuXHRcdFx0XHRcdGlmIHNwYWNlVXNlclxyXG5cdFx0XHRcdFx0XHRwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGVcclxuXHRcdFx0XHRcdFx0aWYgcHJvZlxyXG5cdFx0XHRcdFx0XHRcdGlmIHByb2YgaXMgJ3VzZXInXHJcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnbWVtYmVyJ1xyXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldE1lbWJlclxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnZ3Vlc3QnXHJcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3RcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ3N1cHBsaWVyJ1xyXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdjdXN0b21lcidcclxuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lclxyXG5cdFx0XHRcdFx0XHRlbHNlICMg5rKh5pyJcHJvZmlsZeWImeiupOS4uuaYr3VzZXLmnYPpmZBcclxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3RcclxuXHRcdGlmIHBzZXRzLmxlbmd0aCA+IDBcclxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHMsIFwiX2lkXCJcclxuXHRcdFx0cG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcylcclxuXHRcdFx0cG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpXHJcblx0XHRcdF8uZWFjaCBwb3MsIChwbyktPlxyXG5cdFx0XHRcdGlmIHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQWRtaW4/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1VzZXI/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c01lbWJlcj8uX2lkIG9yIFxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzR3Vlc3Q/Ll9pZCBvclxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzU3VwcGxpZXI/Ll9pZCBvclxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQ3VzdG9tZXI/Ll9pZFxyXG5cdFx0XHRcdFx0IyDpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ5YC85Y+q5a6e6KGM5LiK6Z2i55qE6buY6K6k5YC86KaG55uW77yM5LiN5YGa566X5rOV5Yik5patXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRpZiBfLmlzRW1wdHkocGVybWlzc2lvbnMpXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IHBvXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dSZWFkXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLmFsbG93RWRpdFxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdFx0XHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcclxuXHRcdFx0XHRpZiBwby5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlXHJcblxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpXHJcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpXHJcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHBvLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0KVxyXG5cdFx0XHJcblx0XHRpZiBvYmplY3QuaXNfdmlld1xyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdXHJcblx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xyXG5cclxuXHRcdGlmIG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lclxyXG5cdFx0XHRwZXJtaXNzaW9ucy5vd25lciA9IG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lclxyXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXHJcblxyXG5cclxuXHQjIENyZWF0b3IuaW5pdFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lKSAtPlxyXG5cclxuXHRcdCMgIyDlupTor6XmiororqHnrpflh7rmnaXnmoRcclxuXHRcdCMgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV0uYWxsb3dcclxuXHRcdCMgXHRpbnNlcnQ6ICh1c2VySWQsIGRvYykgLT5cclxuXHRcdCMgXHRcdGlmICF1c2VySWRcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdCAgICBcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcclxuXHRcdCMgXHR1cGRhdGU6ICh1c2VySWQsIGRvYykgLT5cclxuXHRcdCMgXHRcdGlmICF1c2VySWRcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0VkaXRcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0IyBcdHJlbW92ZTogKHVzZXJJZCwgZG9jKSAtPlxyXG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2VcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RGVsZXRlXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcclxuXHJcblx0TWV0ZW9yLm1ldGhvZHNcclxuXHRcdCMgQ2FsY3VsYXRlIFBlcm1pc3Npb25zIG9uIFNlcnZlclxyXG5cdFx0XCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiAoc3BhY2VJZCktPlxyXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZClcclxuIiwidmFyIGNsb25lLCBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0LCBmaW5kX3Blcm1pc3Npb25fb2JqZWN0LCBpbnRlcnNlY3Rpb25QbHVzLCB1bmlvblBlcm1pc3Npb25PYmplY3RzLCB1bmlvblBsdXM7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIG9iajtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KCk7XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIGlzT3duZXIsIG9iamVjdF9maWVsZHNfa2V5cywgcGVybWlzc2lvbnMsIHJlY29yZF9jb21wYW55X2lkLCByZWNvcmRfY29tcGFueV9pZHMsIHJlY29yZF9pZCwgcmVmLCByZWYxLCBzZWxlY3QsIHVzZXJfY29tcGFueV9pZHM7XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICB9XG4gIGlmIChyZWNvcmQgJiYgb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKSkge1xuICAgICAgb2JqZWN0X25hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcbiAgICAgIHJlY29yZF9pZCA9IHJlY29yZC5wYXJlbnQuX2lkO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpO1xuICAgICAgcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG4gICAgfVxuICAgIG9iamVjdF9maWVsZHNfa2V5cyA9IF8ua2V5cygoKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDApIHx8IHt9KSB8fCBbXTtcbiAgICBzZWxlY3QgPSBfLmludGVyc2VjdGlvbihvYmplY3RfZmllbGRzX2tleXMsIFsnb3duZXInLCAnY29tcGFueV9pZCcsICdjb21wYW55X2lkcycsICdsb2NrZWQnXSkgfHwgW107XG4gICAgaWYgKHNlbGVjdC5sZW5ndGggPiAwKSB7XG4gICAgICByZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3Quam9pbignLCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVjb3JkID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpO1xuICBpZiAocmVjb3JkKSB7XG4gICAgaWYgKHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnMpIHtcbiAgICAgIHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zO1xuICAgIH1cbiAgICBpc093bmVyID0gcmVjb3JkLm93bmVyID09PSB1c2VySWQgfHwgKChyZWYxID0gcmVjb3JkLm93bmVyKSAhPSBudWxsID8gcmVmMS5faWQgOiB2b2lkIDApID09PSB1c2VySWQ7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKTtcbiAgICB9XG4gICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmRfY29tcGFueV9pZCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSAmJiByZWNvcmRfY29tcGFueV9pZC5faWQpIHtcbiAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkO1xuICAgIH1cbiAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkcyA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZHNbMF0pKSB7XG4gICAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmRfY29tcGFueV9pZHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKTtcbiAgICBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyZWNvcmQubG9ja2VkICYmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHVzZXJfY29tcGFueV9pZHMgJiYgdXNlcl9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBlcm1pc3Npb25zO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihjdXJyZW50T2JqZWN0TmFtZSwgcmVsYXRlZExpc3RJdGVtLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlLCBtYXN0ZXJBbGxvdywgbWFzdGVyUmVjb3JkUGVybSwgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLCByZXN1bHQsIHNoYXJpbmcsIHVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgIGlmICghY3VycmVudE9iamVjdE5hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghcmVsYXRlZExpc3RJdGVtKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwicmVsYXRlZExpc3RJdGVtIG11c3Qgbm90IGJlIGVtcHR5IGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zXCIpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAoIWN1cnJlbnRSZWNvcmQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50UmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIHNoYXJpbmcgPSByZWxhdGVkTGlzdEl0ZW0uc2hhcmluZyB8fCAnbWFzdGVyV3JpdGUnO1xuICAgIG1hc3RlckFsbG93ID0gZmFsc2U7XG4gICAgbWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgaWYgKHNoYXJpbmcgPT09ICdtYXN0ZXJSZWFkJykge1xuICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZDtcbiAgICB9IGVsc2UgaWYgKHNoYXJpbmcgPT09ICdtYXN0ZXJXcml0ZScpIHtcbiAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXQ7XG4gICAgfVxuICAgIHVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gQ3JlYXRvci5nZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QoY3VycmVudFJlY29yZCwgY3VycmVudE9iamVjdE5hbWUpO1xuICAgIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKTtcbiAgICBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMTtcbiAgICByZXN1bHQgPSBfLmNsb25lKHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyk7XG4gICAgcmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGU7XG4gICAgcmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgX2ksIGlzU3BhY2VBZG1pbiwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7XG4gICAgICBvYmplY3RzOiB7fSxcbiAgICAgIGFzc2lnbmVkX2FwcHM6IFtdXG4gICAgfTtcblxuICAgIC8qXG4gICAgXHRcdOadg+mZkOe7hOivtOaYjjpcbiAgICBcdFx05YaF572u5p2D6ZmQ57uELWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxuICAgIFx0XHToh6rlrprkuYnmnYPpmZDnu4Qt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ57uE5Lul5aSW55qE5YW25LuW5p2D6ZmQ57uEXG4gICAgXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOe7hO+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG4gICAgXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOe7hO+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOe7hFxuICAgICAqL1xuICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgcHNldHNBZG1pbl9wb3MgPSBudWxsO1xuICAgIHBzZXRzVXNlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNHdWVzdF9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGw7XG4gICAgaWYgKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VycmVudC5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwiX2lkXCIpO1xuICAgICAgcHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgICAkaW46IHNldF9pZHNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwibmFtZVwiKTtcbiAgICB9XG4gICAgcHNldHMgPSB7XG4gICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudCxcbiAgICAgIHBzZXRzTWVtYmVyOiBwc2V0c01lbWJlcixcbiAgICAgIHBzZXRzR3Vlc3Q6IHBzZXRzR3Vlc3QsXG4gICAgICBwc2V0c1N1cHBsaWVyOiBwc2V0c1N1cHBsaWVyLFxuICAgICAgcHNldHNDdXN0b21lcjogcHNldHNDdXN0b21lcixcbiAgICAgIGlzU3BhY2VBZG1pbjogaXNTcGFjZUFkbWluLFxuICAgICAgc3BhY2VVc2VyOiBzcGFjZVVzZXIsXG4gICAgICBwc2V0c0FkbWluX3BvczogcHNldHNBZG1pbl9wb3MsXG4gICAgICBwc2V0c1VzZXJfcG9zOiBwc2V0c1VzZXJfcG9zLFxuICAgICAgcHNldHNNZW1iZXJfcG9zOiBwc2V0c01lbWJlcl9wb3MsXG4gICAgICBwc2V0c0d1ZXN0X3BvczogcHNldHNHdWVzdF9wb3MsXG4gICAgICBwc2V0c1N1cHBsaWVyX3BvczogcHNldHNTdXBwbGllcl9wb3MsXG4gICAgICBwc2V0c0N1c3RvbWVyX3BvczogcHNldHNDdXN0b21lcl9wb3MsXG4gICAgICBwc2V0c0N1cnJlbnRfcG9zOiBwc2V0c0N1cnJlbnRfcG9zXG4gICAgfTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXM7XG4gICAgX2kgPSAwO1xuICAgIF8uZWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgIF9pKys7XG4gICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT09IHNwYWNlSWQpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT09ICcwJyAmJiBpc1NwYWNlQWRtaW4pKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpO1xuICAgICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgdW5pb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIGludGVyc2VjdGlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFwcHMsIGlzU3BhY2VBZG1pbiwgcHNldEJhc2UsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0N1c3RvbWVyLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1VzZXIsIHJlZiwgcmVmMSwgdXNlclByb2ZpbGU7XG4gICAgcHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzU3VwcGxpZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIG5hbWU6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhcHBzID0gW107XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmLnByb2ZpbGUgOiB2b2lkIDA7XG4gICAgICBwc2V0QmFzZSA9IHBzZXRzVXNlcjtcbiAgICAgIGlmICh1c2VyUHJvZmlsZSkge1xuICAgICAgICBpZiAodXNlclByb2ZpbGUgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXI7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlclByb2ZpbGUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwc2V0QmFzZSAhPSBudWxsID8gKHJlZjEgPSBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgYXBwcyA9IF8udW5pb24oYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBfLmVhY2gocHNldHMsIGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgaWYgKCFwc2V0LmFzc2lnbmVkX2FwcHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBzZXQubmFtZSA9PT0gXCJhZG1pblwiIHx8IHBzZXQubmFtZSA9PT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXBwcyA9IF8udW5pb24oYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksIHZvaWQgMCwgbnVsbCk7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYWJvdXRNZW51LCBhZG1pbk1lbnVzLCBhbGxNZW51cywgY3VycmVudFBzZXROYW1lcywgaXNTcGFjZUFkbWluLCBtZW51cywgb3RoZXJNZW51QXBwcywgb3RoZXJNZW51cywgcHNldHMsIHJlZiwgcmVmMSwgcmVzdWx0LCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFkbWluTWVudXMgPSAocmVmID0gQ3JlYXRvci5BcHBzLmFkbWluKSAhPSBudWxsID8gcmVmLmFkbWluX21lbnVzIDogdm9pZCAwO1xuICAgIGlmICghYWRtaW5NZW51cykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkID09PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgIT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgb3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5KF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmFkbWluX21lbnVzICYmIG4uX2lkICE9PSAnYWRtaW4nO1xuICAgIH0pLCAnc29ydCcpO1xuICAgIG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKTtcbiAgICBhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJlc3VsdCA9IGFsbE1lbnVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9ICgocmVmMSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYxLnByb2ZpbGUgOiB2b2lkIDApIHx8ICd1c2VyJztcbiAgICAgIGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5uYW1lO1xuICAgICAgfSk7XG4gICAgICBtZW51cyA9IGFsbE1lbnVzLmZpbHRlcihmdW5jdGlvbihtZW51KSB7XG4gICAgICAgIHZhciBwc2V0c01lbnU7XG4gICAgICAgIHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzO1xuICAgICAgICBpZiAocHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoO1xuICAgICAgfSk7XG4gICAgICByZXN1bHQgPSBtZW51cztcbiAgICB9XG4gICAgcmV0dXJuIF8uc29ydEJ5KHJlc3VsdCwgXCJzb3J0XCIpO1xuICB9O1xuICBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmluZChwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZFxuICAgIH0pO1xuICB9O1xuICBmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcihwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICRpbjogcGVybWlzc2lvbl9zZXRfaWRzXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgfTtcbiAgdW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IGZ1bmN0aW9uKHBvcywgb2JqZWN0LCBwc2V0cykge1xuICAgIHZhciByZXN1bHQ7XG4gICAgcmVzdWx0ID0gW107XG4gICAgXy5lYWNoKG9iamVjdC5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24ob3BzLCBvcHNfa2V5KSB7XG4gICAgICB2YXIgY3VycmVudFBzZXQsIHRlbXBPcHM7XG4gICAgICBpZiAoW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDApIHtcbiAgICAgICAgY3VycmVudFBzZXQgPSBwc2V0cy5maW5kKGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgICByZXR1cm4gcHNldC5uYW1lID09PSBvcHNfa2V5O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGN1cnJlbnRQc2V0KSB7XG4gICAgICAgICAgdGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fTtcbiAgICAgICAgICB0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkO1xuICAgICAgICAgIHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWU7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHRlbXBPcHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcbiAgICAgIHBvcy5mb3JFYWNoKGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHZhciByZXBlYXRJbmRleCwgcmVwZWF0UG87XG4gICAgICAgIHJlcGVhdEluZGV4ID0gMDtcbiAgICAgICAgcmVwZWF0UG8gPSByZXN1bHQuZmluZChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgIHJlcGVhdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT09IHBvLnBlcm1pc3Npb25fc2V0X2lkO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlcGVhdFBvKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2gocG8pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwb3M7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBpc1NwYWNlQWRtaW4sIG9iamVjdCwgb3BzZXRBZG1pbiwgb3BzZXRDdXN0b21lciwgb3BzZXRHdWVzdCwgb3BzZXRNZW1iZXIsIG9wc2V0U3VwcGxpZXIsIG9wc2V0VXNlciwgcGVybWlzc2lvbnMsIHBvcywgcG9zQWRtaW4sIHBvc0N1c3RvbWVyLCBwb3NHdWVzdCwgcG9zTWVtYmVyLCBwb3NTdXBwbGllciwgcG9zVXNlciwgcHJvZiwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHt9O1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgICBpZiAoc3BhY2VJZCA9PT0gJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgfHwgdGhpcy5wc2V0c0FkbWluID8gdGhpcy5wc2V0c0FkbWluIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIHx8IHRoaXMucHNldHNVc2VyID8gdGhpcy5wc2V0c1VzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzTWVtYmVyID0gXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgfHwgdGhpcy5wc2V0c01lbWJlciA/IHRoaXMucHNldHNNZW1iZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNHdWVzdCA9IF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgfHwgdGhpcy5wc2V0c0d1ZXN0ID8gdGhpcy5wc2V0c0d1ZXN0IDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgfHwgdGhpcy5wc2V0c1N1cHBsaWVyID8gdGhpcy5wc2V0c1N1cHBsaWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgfHwgdGhpcy5wc2V0c0N1c3RvbWVyID8gdGhpcy5wc2V0c0N1c3RvbWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIG5hbWU6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3M7XG4gICAgcHNldHNVc2VyX3BvcyA9IHRoaXMucHNldHNVc2VyX3BvcztcbiAgICBwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3BvcztcbiAgICBwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3M7XG4gICAgcHNldHNTdXBwbGllcl9wb3MgPSB0aGlzLnBzZXRzU3VwcGxpZXJfcG9zO1xuICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gdGhpcy5wc2V0c0N1c3RvbWVyX3BvcztcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zO1xuICAgIG9wc2V0QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5hZG1pbikgfHwge307XG4gICAgb3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge307XG4gICAgb3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9O1xuICAgIG9wc2V0R3Vlc3QgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge307XG4gICAgb3BzZXRTdXBwbGllciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnN1cHBsaWVyKSB8fCB7fTtcbiAgICBvcHNldEN1c3RvbWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuY3VzdG9tZXIpIHx8IHt9O1xuICAgIGlmIChwc2V0c0FkbWluKSB7XG4gICAgICBwb3NBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0FkbWluLl9pZCk7XG4gICAgICBpZiAocG9zQWRtaW4pIHtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd0NyZWF0ZSA9IHBvc0FkbWluLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldEFkbWluLmFsbG93RGVsZXRlID0gcG9zQWRtaW4uYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dFZGl0ID0gcG9zQWRtaW4uYWxsb3dFZGl0O1xuICAgICAgICBvcHNldEFkbWluLmFsbG93UmVhZCA9IHBvc0FkbWluLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRBZG1pbi5tb2RpZnlBbGxSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc0FkbWluLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldEFkbWluLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NBZG1pbi5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldEFkbWluLnVucmVhZGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0FkbWluLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldEFkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zQWRtaW4udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIpIHtcbiAgICAgIHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKTtcbiAgICAgIGlmIChwb3NVc2VyKSB7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0NyZWF0ZSA9IHBvc1VzZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0RlbGV0ZSA9IHBvc1VzZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0VkaXQgPSBwb3NVc2VyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93UmVhZCA9IHBvc1VzZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldFVzZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLnZpZXdBbGxSZWNvcmRzID0gcG9zVXNlci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zVXNlci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1VzZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRVc2VyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NVc2VyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0VXNlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0VXNlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0VXNlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc1VzZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0VXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1VzZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlcikge1xuICAgICAgcG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpO1xuICAgICAgaWYgKHBvc01lbWJlcikge1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd0NyZWF0ZSA9IHBvc01lbWJlci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dEZWxldGUgPSBwb3NNZW1iZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93RWRpdCA9IHBvc01lbWJlci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93UmVhZCA9IHBvc01lbWJlci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0TWVtYmVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudmlld0FsbFJlY29yZHMgPSBwb3NNZW1iZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zTWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0TWVtYmVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldE1lbWJlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc01lbWJlci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c0d1ZXN0KSB7XG4gICAgICBwb3NHdWVzdCA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNHdWVzdF9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0d1ZXN0Ll9pZCk7XG4gICAgICBpZiAocG9zR3Vlc3QpIHtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd0NyZWF0ZSA9IHBvc0d1ZXN0LmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93RGVsZXRlID0gcG9zR3Vlc3QuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dFZGl0ID0gcG9zR3Vlc3QuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93UmVhZCA9IHBvc0d1ZXN0LmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRHdWVzdC5tb2RpZnlBbGxSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC52aWV3QWxsUmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldEd1ZXN0LmRpc2FibGVkX2FjdGlvbnMgPSBwb3NHdWVzdC5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldEd1ZXN0LnVucmVhZGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0d1ZXN0LnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldEd1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c1N1cHBsaWVyKSB7XG4gICAgICBwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG4gICAgICBpZiAocG9zU3VwcGxpZXIpIHtcbiAgICAgICAgb3BzZXRTdXBwbGllci5hbGxvd0NyZWF0ZSA9IHBvc1N1cHBsaWVyLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldFN1cHBsaWVyLmFsbG93RGVsZXRlID0gcG9zU3VwcGxpZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuYWxsb3dFZGl0ID0gcG9zU3VwcGxpZXIuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldFN1cHBsaWVyLmFsbG93UmVhZCA9IHBvc1N1cHBsaWVyLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRTdXBwbGllci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zU3VwcGxpZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci52aWV3QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zU3VwcGxpZXIubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zU3VwcGxpZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NTdXBwbGllci5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NTdXBwbGllci5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zU3VwcGxpZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NTdXBwbGllci51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc1N1cHBsaWVyLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zU3VwcGxpZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyKSB7XG4gICAgICBwb3NDdXN0b21lciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXN0b21lcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0N1c3RvbWVyLl9pZCk7XG4gICAgICBpZiAocG9zQ3VzdG9tZXIpIHtcbiAgICAgICAgb3BzZXRDdXN0b21lci5hbGxvd0NyZWF0ZSA9IHBvc0N1c3RvbWVyLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldEN1c3RvbWVyLmFsbG93RGVsZXRlID0gcG9zQ3VzdG9tZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuYWxsb3dFZGl0ID0gcG9zQ3VzdG9tZXIuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldEN1c3RvbWVyLmFsbG93UmVhZCA9IHBvc0N1c3RvbWVyLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRDdXN0b21lci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zQ3VzdG9tZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci52aWV3QWxsUmVjb3JkcyA9IHBvc0N1c3RvbWVyLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQ3VzdG9tZXIubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zQ3VzdG9tZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NDdXN0b21lci5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NDdXN0b21lci5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zQ3VzdG9tZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NDdXN0b21lci51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0N1c3RvbWVyLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zQ3VzdG9tZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNwYWNlSWQgPT09ICdjb21tb24nKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhY2VVc2VyID0gXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIHx8IHRoaXMuc3BhY2VVc2VyID8gdGhpcy5zcGFjZVVzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoc3BhY2VVc2VyKSB7XG4gICAgICAgICAgICBwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGU7XG4gICAgICAgICAgICBpZiAocHJvZikge1xuICAgICAgICAgICAgICBpZiAocHJvZiA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ21lbWJlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdndWVzdCcpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ3N1cHBsaWVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRTdXBwbGllcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEN1c3RvbWVyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHMubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHMsIFwiX2lkXCIpO1xuICAgICAgcG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcyk7XG4gICAgICBwb3MgPSB1bmlvblBlcm1pc3Npb25PYmplY3RzKHBvcywgb2JqZWN0LCBwc2V0cyk7XG4gICAgICBfLmVhY2gocG9zLCBmdW5jdGlvbihwbykge1xuICAgICAgICBpZiAocG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0FkbWluICE9IG51bGwgPyBwc2V0c0FkbWluLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0d1ZXN0ICE9IG51bGwgPyBwc2V0c0d1ZXN0Ll9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c1N1cHBsaWVyICE9IG51bGwgPyBwc2V0c1N1cHBsaWVyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8uaXNFbXB0eShwZXJtaXNzaW9ucykpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IHBvO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5hbGxvd1JlYWQpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5hbGxvd0NyZWF0ZSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dEZWxldGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8udmlld0FsbFJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpO1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKTtcbiAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChvYmplY3QuaXNfdmlldykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW107XG4gICAgfVxuICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICBpZiAob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyKSB7XG4gICAgICBwZXJtaXNzaW9ucy5vd25lciA9IG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcjtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgXCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZCk7XG4gICAgfVxuICB9KTtcbn1cbiIsIlxyXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG5cdGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1JcclxuXHRvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUlxyXG5cdGlmIGNyZWF0b3JfZGJfdXJsXHJcblx0XHRpZiAhb3Bsb2dfdXJsXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKVxyXG5cdFx0Q3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge19kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7b3Bsb2dVcmw6IG9wbG9nX3VybH0pfVxyXG5cclxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IChvYmplY3QpLT5cclxuI1x0aWYgb2JqZWN0LnRhYmxlX25hbWUgJiYgb2JqZWN0LnRhYmxlX25hbWUuZW5kc1dpdGgoXCJfX2NcIilcclxuI1x0XHRyZXR1cm4gb2JqZWN0LnRhYmxlX25hbWVcclxuI1x0ZWxzZVxyXG4jXHRcdHJldHVybiBvYmplY3QubmFtZVxyXG5cdHJldHVybiBvYmplY3QubmFtZVxyXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSAob2JqZWN0KS0+XHJcblx0Y29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdClcclxuXHRpZiBkYltjb2xsZWN0aW9uX2tleV1cclxuXHRcdHJldHVybiBkYltjb2xsZWN0aW9uX2tleV1cclxuXHRlbHNlIGlmIG9iamVjdC5kYlxyXG5cdFx0cmV0dXJuIG9iamVjdC5kYlxyXG5cclxuXHRpZiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXHJcblx0ZWxzZVxyXG5cdFx0aWYgb2JqZWN0LmN1c3RvbVxyXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBjb2xsZWN0aW9uX2tleSA9PSAnX3Ntc19xdWV1ZScgJiYgU01TUXVldWU/LmNvbGxlY3Rpb25cclxuXHRcdFx0XHRyZXR1cm4gU01TUXVldWUuY29sbGVjdGlvblxyXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSlcclxuXHJcblxyXG4iLCJ2YXIgc3RlZWRvc0NvcmU7XG5cbnN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0b3JfZGJfdXJsLCBvcGxvZ191cmw7XG4gIGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1I7XG4gIG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SO1xuICBpZiAoY3JlYXRvcl9kYl91cmwpIHtcbiAgICBpZiAoIW9wbG9nX3VybCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge1xuICAgICAgX2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtcbiAgICAgICAgb3Bsb2dVcmw6IG9wbG9nX3VybFxuICAgICAgfSlcbiAgICB9O1xuICB9XG59KTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGNvbGxlY3Rpb25fa2V5O1xuICBjb2xsZWN0aW9uX2tleSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqZWN0KTtcbiAgaWYgKGRiW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBkYltjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSBpZiAob2JqZWN0LmRiKSB7XG4gICAgcmV0dXJuIG9iamVjdC5kYjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdC5jdXN0b20pIHtcbiAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY29sbGVjdGlvbl9rZXkgPT09ICdfc21zX3F1ZXVlJyAmJiAodHlwZW9mIFNNU1F1ZXVlICE9PSBcInVuZGVmaW5lZFwiICYmIFNNU1F1ZXVlICE9PSBudWxsID8gU01TUXVldWUuY29sbGVjdGlvbiA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSk7XG4gICAgfVxuICB9XG59O1xuIiwiQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge31cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cclxuXHQjIOWumuS5ieWFqOWxgCBhY3Rpb25zIOWHveaVsFx0XHJcblx0Q3JlYXRvci5hY3Rpb25zID0gKGFjdGlvbnMpLT5cclxuXHRcdF8uZWFjaCBhY3Rpb25zLCAodG9kbywgYWN0aW9uX25hbWUpLT5cclxuXHRcdFx0Q3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbl9uYW1lXSA9IHRvZG8gXHJcblxyXG5cdENyZWF0b3IuZXhlY3V0ZUFjdGlvbiA9IChvYmplY3RfbmFtZSwgYWN0aW9uLCByZWNvcmRfaWQsIGl0ZW1fZWxlbWVudCwgbGlzdF92aWV3X2lkLCByZWNvcmQpLT5cclxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdFx0aWYgYWN0aW9uPy50b2RvXHJcblx0XHRcdGlmIHR5cGVvZiBhY3Rpb24udG9kbyA9PSBcInN0cmluZ1wiXHJcblx0XHRcdFx0dG9kbyA9IENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb24udG9kb11cclxuXHRcdFx0ZWxzZSBpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJmdW5jdGlvblwiXHJcblx0XHRcdFx0dG9kbyA9IGFjdGlvbi50b2RvXHRcclxuXHRcdFx0aWYgIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWRcclxuXHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxyXG5cdFx0XHRpZiB0b2RvXHJcblx0XHRcdFx0IyBpdGVtX2VsZW1lbnTkuLrnqbrml7blupTor6Xorr7nva7pu5jorqTlgLzvvIjlr7nosaHnmoRuYW1l5a2X5q6177yJ77yM5ZCm5YiZbW9yZUFyZ3Pmi7/liLDnmoTlkI7nu63lj4LmlbDkvY3nva7lsLHkuI3lr7lcclxuXHRcdFx0XHRpdGVtX2VsZW1lbnQgPSBpZiBpdGVtX2VsZW1lbnQgdGhlbiBpdGVtX2VsZW1lbnQgZWxzZSBcIlwiXHJcblx0XHRcdFx0bW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpXHJcblx0XHRcdFx0dG9kb0FyZ3MgPSBbb2JqZWN0X25hbWUsIHJlY29yZF9pZF0uY29uY2F0KG1vcmVBcmdzKVxyXG5cdFx0XHRcdHRvZG8uYXBwbHkge1xyXG5cdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRyZWNvcmRfaWQ6IHJlY29yZF9pZFxyXG5cdFx0XHRcdFx0b2JqZWN0OiBvYmpcclxuXHRcdFx0XHRcdGFjdGlvbjogYWN0aW9uXHJcblx0XHRcdFx0XHRpdGVtX2VsZW1lbnQ6IGl0ZW1fZWxlbWVudFxyXG5cdFx0XHRcdFx0cmVjb3JkOiByZWNvcmRcclxuXHRcdFx0XHR9LCB0b2RvQXJnc1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXHJcblx0XHRlbHNlXHJcblx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKVxyXG5cclxuXHRcdFx0XHRcclxuXHJcblx0Q3JlYXRvci5hY3Rpb25zIFxyXG5cdFx0IyDlnKjmraTlrprkuYnlhajlsYAgYWN0aW9uc1xyXG5cdFx0XCJzdGFuZGFyZF9xdWVyeVwiOiAoKS0+XHJcblx0XHRcdE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKVxyXG5cclxuXHRcdFwic3RhbmRhcmRfbmV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbb2JqZWN0X25hbWVdXHJcblx0XHRcdGlmIGlkcz8ubGVuZ3RoXHJcblx0XHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cclxuXHRcdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxyXG5cdFx0XHRcdHJlY29yZF9pZCA9IGlkc1swXVxyXG5cdFx0XHRcdGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgZG9jXHJcblx0XHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cclxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSlcclxuXHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cclxuXHRcdFx0XHQkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKClcclxuXHRcdFx0cmV0dXJuIFxyXG5cclxuXHRcdFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZilcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0XCJzdGFuZGFyZF9lZGl0XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aWYgcmVjb3JkX2lkXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlXHJcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCByZWNvcmRcclxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAncmVsb2FkX2R4bGlzdCcsIGZhbHNlXHJcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkXHJcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cclxuXHRcdFx0XHRcdFx0JChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcclxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XHJcblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcclxuXHJcblx0XHRcInN0YW5kYXJkX2RlbGV0ZVwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKS0+XHJcblx0XHRcdGNvbnNvbGUubG9nKFwic3RhbmRhcmRfZGVsZXRlXCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkKVxyXG5cdFx0XHRiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7X2lkOiByZWNvcmRfaWR9KVxyXG5cdFx0XHRpZiAhYmVmb3JlSG9va1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdFx0XHRpZighXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIHJlY29yZF90aXRsZT8ubmFtZSlcclxuXHRcdFx0XHRyZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGU/Lm5hbWVcclxuXHJcblx0XHRcdGlmIHJlY29yZF90aXRsZVxyXG5cdFx0XHRcdHRleHQgPSB0IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiLCBcIiN7b2JqZWN0LmxhYmVsfSBcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0ZXh0ID0gdCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgXCIje29iamVjdC5sYWJlbH1cIlxyXG5cdFx0XHRzd2FsXHJcblx0XHRcdFx0dGl0bGU6IHQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZVwiLCBcIiN7b2JqZWN0LmxhYmVsfVwiXHJcblx0XHRcdFx0dGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz4je3RleHR9PC9kaXY+XCJcclxuXHRcdFx0XHRodG1sOiB0cnVlXHJcblx0XHRcdFx0c2hvd0NhbmNlbEJ1dHRvbjp0cnVlXHJcblx0XHRcdFx0Y29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpXHJcblx0XHRcdFx0Y2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcclxuXHRcdFx0XHQob3B0aW9uKSAtPlxyXG5cdFx0XHRcdFx0aWYgb3B0aW9uXHJcblx0XHRcdFx0XHRcdHByZXZpb3VzRG9jID0gRm9ybU1hbmFnZXIuZ2V0UHJldmlvdXNEb2Mob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgJ2RlbGV0ZScpXHJcblx0XHRcdFx0XHRcdENyZWF0b3Iub2RhdGEuZGVsZXRlIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICgpLT5cclxuXHRcdFx0XHRcdFx0XHRpZiByZWNvcmRfdGl0bGVcclxuXHRcdFx0XHRcdFx0XHRcdCMgaW5mbyA9IG9iamVjdC5sYWJlbCArIFwiXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIiArIFwi5bey5Yig6ZmkXCJcclxuXHRcdFx0XHRcdFx0XHRcdGluZm8gPXQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0aW5mbyA9IHQoJ2NyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3N1YycpXHJcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MgaW5mb1xyXG5cdFx0XHRcdFx0XHRcdCMg5paH5Lu254mI5pys5Li6XCJjZnMuZmlsZXMuZmlsZXJlY29yZFwi77yM6ZyA6KaB5pu/5o2i5Li6XCJjZnMtZmlsZXMtZmlsZXJlY29yZFwiXHJcblx0XHRcdFx0XHRcdFx0Z3JpZE9iamVjdE5hbWVDbGFzcyA9IG9iamVjdF9uYW1lLnJlcGxhY2UoL1xcLi9nLFwiLVwiKVxyXG5cdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxyXG5cdFx0XHRcdFx0XHRcdHVubGVzcyBncmlkQ29udGFpbmVyPy5sZW5ndGhcclxuXHRcdFx0XHRcdFx0XHRcdGlmIHdpbmRvdy5vcGVuZXJcclxuXHRcdFx0XHRcdFx0XHRcdFx0aXNPcGVuZXJSZW1vdmUgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXHJcblx0XHRcdFx0XHRcdFx0aWYgZ3JpZENvbnRhaW5lcj8ubGVuZ3RoXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3RyZWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpXHJcblx0XHRcdFx0XHRcdFx0aWYgZHhEYXRhR3JpZEluc3RhbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3RyZWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RfbmFtZSAhPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSlcclxuXHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZSBvciAhZHhEYXRhR3JpZEluc3RhbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuY2xvc2UoKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgYW5kICFTdGVlZG9zLmlzTW9iaWxlKCkgYW5kIGxpc3Rfdmlld19pZCAhPSAnY2FsZW5kYXInXHJcblx0XHRcdFx0XHRcdFx0XHRcdGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcclxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRcdHVubGVzcyBsaXN0X3ZpZXdfaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBcImFsbFwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIuZ28gXCIvYXBwLyN7YXBwaWR9LyN7b2JqZWN0X25hbWV9L2dyaWQvI3tsaXN0X3ZpZXdfaWR9XCJcclxuXHRcdFx0XHRcdFx0XHRpZiBjYWxsX2JhY2sgYW5kIHR5cGVvZiBjYWxsX2JhY2sgPT0gXCJmdW5jdGlvblwiXHJcblx0XHRcdFx0XHRcdFx0XHRjYWxsX2JhY2soKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2FmdGVyJywge19pZDogcmVjb3JkX2lkLCBwcmV2aW91c0RvYzogcHJldmlvdXNEb2N9KVxyXG5cdFx0XHRcdFx0XHQsIChlcnJvciktPlxyXG5cdFx0XHRcdFx0XHRcdEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7X2lkOiByZWNvcmRfaWQsIGVycm9yOiBlcnJvcn0pIiwiQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKSB7XG4gICAgdmFyIG1vcmVBcmdzLCBvYmosIHRvZG8sIHRvZG9BcmdzO1xuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMCkge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9kbyA9IGFjdGlvbi50b2RvO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgaXRlbV9lbGVtZW50ID0gaXRlbV9lbGVtZW50ID8gaXRlbV9lbGVtZW50IDogXCJcIjtcbiAgICAgICAgbW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuICAgICAgICB0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpO1xuICAgICAgICByZXR1cm4gdG9kby5hcHBseSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdDogb2JqLFxuICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgIGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50LFxuICAgICAgICAgIHJlY29yZDogcmVjb3JkXG4gICAgICAgIH0sIHRvZG9BcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmFjdGlvbnMoe1xuICAgIFwic3RhbmRhcmRfcXVlcnlcIjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9uZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgZG9jLCBpZHM7XG4gICAgICBpZHMgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkc1tvYmplY3RfbmFtZV07XG4gICAgICBpZiAoaWRzICE9IG51bGwgPyBpZHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgIHJlY29yZF9pZCA9IGlkc1swXTtcbiAgICAgICAgZG9jID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGRvYyk7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIEZvcm1NYW5hZ2VyLmdldEluaXRpYWxWYWx1ZXMob2JqZWN0X25hbWUpKTtcbiAgICAgIH1cbiAgICAgIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQoXCIuY3JlYXRvci1hZGRcIikuY2xpY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgaHJlZjtcbiAgICAgIGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2VkaXRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2UpIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2RlbGV0ZVwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spIHtcbiAgICAgIHZhciBiZWZvcmVIb29rLCBvYmplY3QsIHRleHQ7XG4gICAgICBjb25zb2xlLmxvZyhcInN0YW5kYXJkX2RlbGV0ZVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCk7XG4gICAgICBiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7XG4gICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICB9KTtcbiAgICAgIGlmICghYmVmb3JlSG9vaykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiAocmVjb3JkX3RpdGxlICE9IG51bGwgPyByZWNvcmRfdGl0bGUubmFtZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlICE9IG51bGwgPyByZWNvcmRfdGl0bGUubmFtZSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgdGV4dCA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCIsIG9iamVjdC5sYWJlbCArIFwiIFxcXCJcIiArIHJlY29yZF90aXRsZSArIFwiXFxcIlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHQgPSB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiLCBcIlwiICsgb2JqZWN0LmxhYmVsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzd2FsKHtcbiAgICAgICAgdGl0bGU6IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZVwiLCBcIlwiICsgb2JqZWN0LmxhYmVsKSxcbiAgICAgICAgdGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz5cIiArIHRleHQgKyBcIjwvZGl2PlwiLFxuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogdCgnRGVsZXRlJyksXG4gICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXG4gICAgICB9LCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgdmFyIHByZXZpb3VzRG9jO1xuICAgICAgICBpZiAob3B0aW9uKSB7XG4gICAgICAgICAgcHJldmlvdXNEb2MgPSBGb3JtTWFuYWdlci5nZXRQcmV2aW91c0RvYyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAnZGVsZXRlJyk7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3Iub2RhdGFbXCJkZWxldGVcIl0ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXBwaWQsIGR4RGF0YUdyaWRJbnN0YW5jZSwgZ3JpZENvbnRhaW5lciwgZ3JpZE9iamVjdE5hbWVDbGFzcywgaW5mbywgaXNPcGVuZXJSZW1vdmU7XG4gICAgICAgICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgICAgICAgIGluZm8gPSB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVfc3VjXCIsIG9iamVjdC5sYWJlbCArIChcIlxcXCJcIiArIHJlY29yZF90aXRsZSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpbmZvID0gdCgnY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfc3VjJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhpbmZvKTtcbiAgICAgICAgICAgIGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZywgXCItXCIpO1xuICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgaWYgKCEoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XG4gICAgICAgICAgICAgICAgaXNPcGVuZXJSZW1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0X25hbWUgIT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikpIHtcbiAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUgfHwgIWR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZWNvcmRfaWQgPT09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgbGlzdF92aWV3X2lkICE9PSAnY2FsZW5kYXInKSB7XG4gICAgICAgICAgICAgICAgYXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICAgICAgICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgICAgICAgICAgICBsaXN0X3ZpZXdfaWQgPSBcImFsbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcC9cIiArIGFwcGlkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FsbF9iYWNrICYmIHR5cGVvZiBjYWxsX2JhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBjYWxsX2JhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2FmdGVyJywge1xuICAgICAgICAgICAgICBfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICAgICAgcHJldmlvdXNEb2M6IHByZXZpb3VzRG9jXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7XG4gICAgICAgICAgICAgIF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgICAgICBlcnJvcjogZXJyb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIl19
