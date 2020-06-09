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

Creator.convertListView = function (default_view, list_view, list_view_name) {
  var default_columns, default_mobile_columns, oitem;
  default_columns = default_view.columns;
  default_mobile_columns = default_view.mobile_columns;
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
    var _object, list, permissions, relatedList, relatedListObjects, related_object_names, related_objects, spaceId, unrelated_objects, userId;

    relatedListObjects = {};
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
              related_field_name: '',
              customRelatedListObject: true,
              label: objOrName.label
            };
            return relatedListObjects[objOrName.objectName] = related;
          }
        });
      }
    }

    list = [];
    related_objects = Creator.getRelatedObjects(object_name);

    _.each(related_objects, function (related_object_item) {
      var columns, order, related, relatedObject, related_field_name, related_object, related_object_name, sharing, tabular_order;
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
      relatedObject = relatedListObjects[related_object_name];

      if (relatedObject) {
        if (relatedObject.columns) {
          related.columns = relatedObject.columns;
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

      return list.push(related);
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
        return list.push(v);
      }
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
  var _db, defaultListViewId, defaultView, disabled_list_views, permissions, ref, ref1, ref2, ref3, schema, self;

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
  defaultView = Creator.getObjectDefaultView(self.name);

  _.each(options.list_views, function (item, item_name) {
    var oitem;
    oitem = Creator.convertListView(defaultView, item, item_name);
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
        if (option) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiZSIsInN0ZWVkb3NDb3JlIiwicmVxdWlyZSIsIk1ldGVvciIsImlzRGV2ZWxvcG1lbnQiLCJzdGFydHVwIiwiZXgiLCJpbml0IiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwiRmliZXIiLCJwYXRoIiwiZGVwcyIsImFwcCIsIlRyYWNrZXIiLCJEZXBlbmRlbmN5Iiwib2JqZWN0IiwiX1RFTVBMQVRFIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsImZpbHRlcnNGdW5jdGlvbiIsIk1hdGNoIiwiT3B0aW9uYWwiLCJPbmVPZiIsIkZ1bmN0aW9uIiwiU3RyaW5nIiwib3B0aW9uc0Z1bmN0aW9uIiwiY3JlYXRlRnVuY3Rpb24iLCJpc1NlcnZlciIsImZpYmVyTG9hZE9iamVjdHMiLCJvYmoiLCJvYmplY3RfbmFtZSIsImxvYWRPYmplY3RzIiwicnVuIiwibmFtZSIsImxpc3Rfdmlld3MiLCJzcGFjZSIsImdldENvbGxlY3Rpb25OYW1lIiwiXyIsImNsb25lIiwiY29udmVydE9iamVjdCIsIk9iamVjdCIsImluaXRUcmlnZ2VycyIsImluaXRMaXN0Vmlld3MiLCJnZXRPYmplY3ROYW1lIiwiZ2V0T2JqZWN0Iiwic3BhY2VfaWQiLCJyZWYiLCJyZWYxIiwiaXNBcnJheSIsImlzQ2xpZW50IiwiZGVwZW5kIiwiU2Vzc2lvbiIsImdldCIsIm9iamVjdHNCeU5hbWUiLCJnZXRPYmplY3RCeUlkIiwib2JqZWN0X2lkIiwiZmluZFdoZXJlIiwiX2lkIiwicmVtb3ZlT2JqZWN0IiwiZ2V0Q29sbGVjdGlvbiIsInNwYWNlSWQiLCJfY29sbGVjdGlvbl9uYW1lIiwicmVtb3ZlQ29sbGVjdGlvbiIsImlzU3BhY2VBZG1pbiIsInVzZXJJZCIsImZpbmRPbmUiLCJmaWVsZHMiLCJhZG1pbnMiLCJpbmRleE9mIiwiZXZhbHVhdGVGb3JtdWxhIiwiZm9ybXVsYXIiLCJjb250ZXh0Iiwib3B0aW9ucyIsImlzU3RyaW5nIiwiRm9ybXVsYXIiLCJjaGVja0Zvcm11bGEiLCJldmFsdWF0ZUZpbHRlcnMiLCJmaWx0ZXJzIiwic2VsZWN0b3IiLCJlYWNoIiwiZmlsdGVyIiwiYWN0aW9uIiwidmFsdWUiLCJsZW5ndGgiLCJpc0NvbW1vblNwYWNlIiwiZ2V0T3JkZXJseVNldEJ5SWRzIiwiZG9jcyIsImlkcyIsImlkX2tleSIsImhpdF9maXJzdCIsInZhbHVlcyIsImdldFByb3BlcnR5Iiwic29ydEJ5IiwiZG9jIiwiX2luZGV4Iiwic29ydGluZ01ldGhvZCIsInZhbHVlMSIsInZhbHVlMiIsImlzVmFsdWUxRW1wdHkiLCJpc1ZhbHVlMkVtcHR5IiwibG9jYWxlIiwia2V5IiwiRGF0ZSIsImdldFRpbWUiLCJTdGVlZG9zIiwidG9TdHJpbmciLCJsb2NhbGVDb21wYXJlIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfb2JqZWN0IiwicGVybWlzc2lvbnMiLCJyZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0TWFwIiwicmVsYXRlZF9vYmplY3RzIiwiaXNFbXB0eSIsIm9iak5hbWUiLCJpc09iamVjdCIsIm9iamVjdE5hbWUiLCJyZWxhdGVkX29iamVjdCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwidHlwZSIsInJlZmVyZW5jZV90byIsImZvcmVpZ25fa2V5Iiwic2hhcmluZyIsImVuYWJsZU9iak5hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJlbmFibGVfZmlsZXMiLCJwdXNoIiwic3BsaWNlIiwiZW5hYmxlX3Rhc2tzIiwiZW5hYmxlX25vdGVzIiwiZW5hYmxlX2V2ZW50cyIsImVuYWJsZV9pbnN0YW5jZXMiLCJlbmFibGVfYXBwcm92YWxzIiwiZ2V0VXNlckNvbnRleHQiLCJpc1VuU2FmZU1vZGUiLCJVU0VSX0NPTlRFWFQiLCJzcGFjZV91c2VyX29yZyIsInN1Iiwic3VGaWVsZHMiLCJFcnJvciIsIm1vYmlsZSIsInBvc2l0aW9uIiwiZW1haWwiLCJjb21wYW55Iiwib3JnYW5pemF0aW9uIiwiY29tcGFueV9pZCIsImNvbXBhbnlfaWRzIiwidXNlciIsImZ1bGxuYW1lIiwiZ2V0UmVsYXRpdmVVcmwiLCJ1cmwiLCJpc0Z1bmN0aW9uIiwiaXNDb3Jkb3ZhIiwic3RhcnRzV2l0aCIsInRlc3QiLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwiUk9PVF9VUkxfUEFUSF9QUkVGSVgiLCJnZXRVc2VyQ29tcGFueUlkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJwcm9jZXNzUGVybWlzc2lvbnMiLCJwbyIsImFsbG93Q3JlYXRlIiwiYWxsb3dSZWFkIiwiYWxsb3dFZGl0IiwiYWxsb3dEZWxldGUiLCJ2aWV3QWxsUmVjb3JkcyIsInZpZXdDb21wYW55UmVjb3JkcyIsIm1vZGlmeUNvbXBhbnlSZWNvcmRzIiwiZ2V0VGVtcGxhdGVTcGFjZUlkIiwic2V0dGluZ3MiLCJ0ZW1wbGF0ZVNwYWNlSWQiLCJnZXRDbG91ZEFkbWluU3BhY2VJZCIsImNsb3VkQWRtaW5TcGFjZUlkIiwiaXNUZW1wbGF0ZVNwYWNlIiwiaXNDbG91ZEFkbWluU3BhY2UiLCJwcm9jZXNzIiwiZW52IiwiU1RFRURPU19TVE9SQUdFX0RJUiIsInN0ZWVkb3NTdG9yYWdlRGlyIiwicmVzb2x2ZSIsImpvaW4iLCJfX21ldGVvcl9ib290c3RyYXBfXyIsInNlcnZlckRpciIsIm1ldGhvZHMiLCJjb2xsZWN0aW9uIiwibmFtZV9maWVsZF9rZXkiLCJvcHRpb25zX2xpbWl0IiwicXVlcnkiLCJxdWVyeV9vcHRpb25zIiwicmVjb3JkcyIsInJlc3VsdHMiLCJzZWFyY2hUZXh0UXVlcnkiLCJzZWxlY3RlZCIsInNvcnQiLCJwYXJhbXMiLCJOQU1FX0ZJRUxEX0tFWSIsInNlYXJjaFRleHQiLCIkcmVnZXgiLCIkb3IiLCIkaW4iLCJleHRlbmQiLCIkbmluIiwiZmlsdGVyUXVlcnkiLCJsaW1pdCIsImZpbmQiLCJmZXRjaCIsInJlY29yZCIsImxhYmVsIiwibWVzc2FnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsImJveCIsImN1cnJlbnRfdXNlcl9pZCIsImN1cnJlbnRfdXNlcl9pbmZvIiwiZmxvd0lkIiwiaGFzaERhdGEiLCJpbnMiLCJpbnNJZCIsInJlY29yZF9pZCIsInJlZGlyZWN0X3VybCIsInJlZjIiLCJ3b3JrZmxvd1VybCIsInhfYXV0aF90b2tlbiIsInhfdXNlcl9pZCIsInV1Zmxvd01hbmFnZXIiLCJjaGVja19hdXRob3JpemF0aW9uIiwiYm9keSIsImNoZWNrIiwiaW5zdGFuY2VJZCIsIndlYnNlcnZpY2VzIiwid29ya2Zsb3ciLCJmbG93IiwiaW5ib3hfdXNlcnMiLCJpbmNsdWRlcyIsImNjX3VzZXJzIiwib3V0Ym94X3VzZXJzIiwic3RhdGUiLCJzdWJtaXR0ZXIiLCJhcHBsaWNhbnQiLCJwZXJtaXNzaW9uTWFuYWdlciIsImdldEZsb3dQZXJtaXNzaW9ucyIsInNwYWNlcyIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsInVwZGF0ZSIsIiRwdWxsIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwicmVhc29uIiwiZ2V0SW5pdFdpZHRoUGVyY2VudCIsImNvbHVtbnMiLCJfc2NoZW1hIiwiY29sdW1uX251bSIsImluaXRfd2lkdGhfcGVyY2VudCIsImdldFNjaGVtYSIsImZpZWxkX25hbWUiLCJmaWVsZCIsImlzX3dpZGUiLCJwaWNrIiwiYXV0b2Zvcm0iLCJnZXRGaWVsZElzV2lkZSIsImdldFRhYnVsYXJPcmRlciIsImxpc3Rfdmlld19pZCIsInNldHRpbmciLCJtYXAiLCJjb2x1bW4iLCJoaWRkZW4iLCJjb21wYWN0Iiwib3JkZXIiLCJpbmRleCIsImRlZmF1bHRfZXh0cmFfY29sdW1ucyIsImV4dHJhX2NvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0Q29sdW1ucyIsImdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMiLCJ1bmlvbiIsImdldE9iamVjdERlZmF1bHRTb3J0IiwiVGFidWxhclNlbGVjdGVkSWRzIiwiY29udmVydExpc3RWaWV3IiwiZGVmYXVsdF92aWV3IiwibGlzdF92aWV3IiwibGlzdF92aWV3X25hbWUiLCJkZWZhdWx0X2NvbHVtbnMiLCJkZWZhdWx0X21vYmlsZV9jb2x1bW5zIiwib2l0ZW0iLCJtb2JpbGVfY29sdW1ucyIsImhhcyIsImluY2x1ZGUiLCJmaWx0ZXJfc2NvcGUiLCJwYXJzZSIsImZvckVhY2giLCJfdmFsdWUiLCJnZXRSZWxhdGVkTGlzdCIsImxpc3QiLCJyZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInVucmVsYXRlZF9vYmplY3RzIiwib2JqT3JOYW1lIiwicmVsYXRlZCIsImlzX2ZpbGUiLCJjdXN0b21SZWxhdGVkTGlzdE9iamVjdCIsImdldFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfaXRlbSIsInJlbGF0ZWRPYmplY3QiLCJ0YWJ1bGFyX29yZGVyIiwid2l0aG91dCIsInRyYW5zZm9ybVNvcnRUb1RhYnVsYXIiLCJyZXBsYWNlIiwicGx1Y2siLCJkaWZmZXJlbmNlIiwidiIsImlzQWN0aXZlIiwiZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyIsImZpcnN0IiwiZ2V0TGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXciLCJleGFjIiwibGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXdJc1JlY2VudCIsImxpc3RWaWV3IiwicGlja09iamVjdE1vYmlsZUNvbHVtbnMiLCJjb3VudCIsImdldEZpZWxkIiwiaXNOYW1lQ29sdW1uIiwiaXRlbUNvdW50IiwibWF4Q291bnQiLCJtYXhSb3dzIiwibmFtZUNvbHVtbiIsIm5hbWVLZXkiLCJyZXN1bHQiLCJpdGVtIiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJSZWdFeHAiLCJfcmVnRXhNZXNzYWdlcyIsIl9nbG9iYWxNZXNzYWdlcyIsInJlZ0V4IiwiZXhwIiwibXNnIiwibWVzc2FnZXMiLCJldmFsSW5Db250ZXh0IiwianMiLCJldmFsIiwiY2FsbCIsImNvbnZlcnRGaWVsZCIsImdldE9wdGlvbiIsIm9wdGlvbiIsImZvbyIsInNwbGl0IiwiYWxsT3B0aW9ucyIsInBpY2tsaXN0IiwicGlja2xpc3RPcHRpb25zIiwiZ2V0UGlja2xpc3QiLCJnZXRQaWNrTGlzdE9wdGlvbnMiLCJyZXZlcnNlIiwiZW5hYmxlIiwiZGVmYXVsdFZhbHVlIiwidHJpZ2dlcnMiLCJ0cmlnZ2VyIiwiX3RvZG8iLCJfdG9kb19mcm9tX2NvZGUiLCJfdG9kb19mcm9tX2RiIiwib24iLCJ0b2RvIiwiYWN0aW9ucyIsIl92aXNpYmxlIiwiZXJyb3IxIiwiYWN0aW9uc0J5TmFtZSIsInZpc2libGUiLCJfb3B0aW9ucyIsIl90eXBlIiwiYmVmb3JlT3BlbkZ1bmN0aW9uIiwiaXNfY29tcGFueV9saW1pdGVkIiwibWF4IiwibWluIiwiX29wdGlvbiIsImsiLCJfcmVnRXgiLCJfbWluIiwiX21heCIsIk51bWJlciIsIkJvb2xlYW4iLCJfb3B0aW9uc0Z1bmN0aW9uIiwiX3JlZmVyZW5jZV90byIsIl9jcmVhdGVGdW5jdGlvbiIsIl9iZWZvcmVPcGVuRnVuY3Rpb24iLCJfZmlsdGVyc0Z1bmN0aW9uIiwiX2RlZmF1bHRWYWx1ZSIsIl9pc19jb21wYW55X2xpbWl0ZWQiLCJfZmlsdGVycyIsImlzRGF0ZSIsInBvcCIsIl9pc19kYXRlIiwiZm9ybSIsInZhbCIsInJlbGF0ZWRPYmpJbmZvIiwiUFJFRklYIiwiX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhIiwicHJlZml4IiwiZmllbGRWYXJpYWJsZSIsInJlZyIsInJldiIsIm0iLCIkMSIsImZvcm11bGFfc3RyIiwiX0NPTlRFWFQiLCJfVkFMVUVTIiwiaXNCb29sZWFuIiwidG9hc3RyIiwiZm9ybWF0T2JqZWN0TmFtZSIsIl9kYiIsImRlZmF1bHRMaXN0Vmlld0lkIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsInJlZjMiLCJzY2hlbWEiLCJzZWxmIiwiaWNvbiIsImRlc2NyaXB0aW9uIiwiaXNfdmlldyIsImlzX2VuYWJsZSIsImVuYWJsZV9zZWFyY2giLCJwYWdpbmciLCJlbmFibGVfYXBpIiwiY3VzdG9tIiwiZW5hYmxlX3NoYXJlIiwiZW5hYmxlX3RyZWUiLCJzaWRlYmFyIiwib3Blbl93aW5kb3ciLCJmaWx0ZXJfY29tcGFueSIsImNhbGVuZGFyIiwiZW5hYmxlX2NoYXR0ZXIiLCJlbmFibGVfdHJhc2giLCJlbmFibGVfc3BhY2VfZ2xvYmFsIiwiZW5hYmxlX2ZvbGxvdyIsImVuYWJsZV93b3JrZmxvdyIsImluX2RldmVsb3BtZW50IiwiaWRGaWVsZE5hbWUiLCJkYXRhYmFzZV9uYW1lIiwiaXNfbmFtZSIsInByaW1hcnkiLCJmaWx0ZXJhYmxlIiwiYmFzZU9iamVjdCIsIml0ZW1fbmFtZSIsImNvcHlJdGVtIiwicGVybWlzc2lvbl9zZXQiLCJhZG1pbiIsImFsbCIsImxpc3Rfdmlld19pdGVtIiwiUmVhY3RpdmVWYXIiLCJjcmVhdGVDb2xsZWN0aW9uIiwiX25hbWUiLCJnZXRPYmplY3RTY2hlbWEiLCJjb250YWlucyIsImF0dGFjaFNjaGVtYSIsIl9zaW1wbGVTY2hlbWEiLCJnZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCIsImJvb3RzdHJhcExvYWRlZCIsImZpZWxkc0FyciIsIl9yZWZfb2JqIiwiYXV0b2Zvcm1fdHlwZSIsImZzIiwiaXNVbkxpbWl0ZWQiLCJtdWx0aXBsZSIsInJvd3MiLCJsYW5ndWFnZSIsImlzTW9iaWxlIiwiaXNQYWQiLCJhZkZpZWxkSW5wdXQiLCJkYXRlTW9iaWxlT3B0aW9ucyIsIm91dEZvcm1hdCIsInRpbWV6b25lSWQiLCJkeERhdGVCb3hPcHRpb25zIiwiZGlzcGxheUZvcm1hdCIsImhlaWdodCIsImRpYWxvZ3NJbkJvZHkiLCJ0b29sYmFyIiwiZm9udE5hbWVzIiwibGFuZyIsInNob3dJY29uIiwiZGVwZW5kT24iLCJkZXBlbmRfb24iLCJjcmVhdGUiLCJsb29rdXBfZmllbGQiLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJvcGVyYXRpb24iLCJvblN1Y2Nlc3MiLCJhZGRJdGVtcyIsInJlZmVyZW5jZV9zb3J0Iiwib3B0aW9uc1NvcnQiLCJyZWZlcmVuY2VfbGltaXQiLCJvcHRpb25zTGltaXQiLCJvbWl0IiwiYmxhY2tib3giLCJvYmplY3RTd2l0Y2hlIiwib3B0aW9uc01ldGhvZCIsIm9wdGlvbnNNZXRob2RQYXJhbXMiLCJyZWZlcmVuY2VzIiwiX3JlZmVyZW5jZSIsImxpbmsiLCJkZWZhdWx0SWNvbiIsImZpcnN0T3B0aW9uIiwicHJlY2lzaW9uIiwic2NhbGUiLCJkZWNpbWFsIiwicmVhZG9ubHkiLCJkaXNhYmxlZCIsIkFycmF5IiwiZWRpdGFibGUiLCJhY2NlcHQiLCJzeXN0ZW0iLCJFbWFpbCIsInJlcXVpcmVkIiwib3B0aW9uYWwiLCJ1bmlxdWUiLCJncm91cCIsInNlYXJjaGFibGUiLCJpbmxpbmVIZWxwVGV4dCIsImlzUHJvZHVjdGlvbiIsInNvcnRhYmxlIiwiZ2V0RmllbGREaXNwbGF5VmFsdWUiLCJmaWVsZF92YWx1ZSIsImh0bWwiLCJtb21lbnQiLCJmb3JtYXQiLCJjaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkiLCJmaWVsZF90eXBlIiwicHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzIiwib3BlcmF0aW9ucyIsImJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyIsImJ1aWx0aW5JdGVtIiwiaXNfY2hlY2tfb25seSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24iLCJiZXR3ZWVuQnVpbHRpblZhbHVlcyIsImdldFF1YXJ0ZXJTdGFydE1vbnRoIiwibW9udGgiLCJnZXRNb250aCIsImdldExhc3RRdWFydGVyRmlyc3REYXkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJnZXROZXh0UXVhcnRlckZpcnN0RGF5IiwiZ2V0TW9udGhEYXlzIiwiZGF5cyIsImVuZERhdGUiLCJtaWxsaXNlY29uZCIsInN0YXJ0RGF0ZSIsImdldExhc3RNb250aEZpcnN0RGF5IiwiY3VycmVudE1vbnRoIiwiY3VycmVudFllYXIiLCJlbmRWYWx1ZSIsImZpcnN0RGF5IiwibGFzdERheSIsImxhc3RNb25kYXkiLCJsYXN0TW9udGhGaW5hbERheSIsImxhc3RNb250aEZpcnN0RGF5IiwibGFzdFF1YXJ0ZXJFbmREYXkiLCJsYXN0UXVhcnRlclN0YXJ0RGF5IiwibGFzdFN1bmRheSIsImxhc3RfMTIwX2RheXMiLCJsYXN0XzMwX2RheXMiLCJsYXN0XzYwX2RheXMiLCJsYXN0XzdfZGF5cyIsImxhc3RfOTBfZGF5cyIsIm1pbnVzRGF5IiwibW9uZGF5IiwibmV4dE1vbmRheSIsIm5leHRNb250aEZpbmFsRGF5IiwibmV4dE1vbnRoRmlyc3REYXkiLCJuZXh0UXVhcnRlckVuZERheSIsIm5leHRRdWFydGVyU3RhcnREYXkiLCJuZXh0U3VuZGF5IiwibmV4dFllYXIiLCJuZXh0XzEyMF9kYXlzIiwibmV4dF8zMF9kYXlzIiwibmV4dF82MF9kYXlzIiwibmV4dF83X2RheXMiLCJuZXh0XzkwX2RheXMiLCJub3ciLCJwcmV2aW91c1llYXIiLCJzdGFydFZhbHVlIiwic3RyRW5kRGF5Iiwic3RyRmlyc3REYXkiLCJzdHJMYXN0RGF5Iiwic3RyTW9uZGF5Iiwic3RyU3RhcnREYXkiLCJzdHJTdW5kYXkiLCJzdHJUb2RheSIsInN0clRvbW9ycm93Iiwic3RyWWVzdGRheSIsInN1bmRheSIsInRoaXNRdWFydGVyRW5kRGF5IiwidGhpc1F1YXJ0ZXJTdGFydERheSIsInRvbW9ycm93Iiwid2VlayIsInllc3RkYXkiLCJnZXREYXkiLCJ0IiwiZnYiLCJzZXRIb3VycyIsImdldEhvdXJzIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJnZXRGaWVsZERlZmF1bHRPcGVyYXRpb24iLCJnZXRGaWVsZE9wZXJhdGlvbiIsIm9wdGlvbmFscyIsImVxdWFsIiwidW5lcXVhbCIsImxlc3NfdGhhbiIsImdyZWF0ZXJfdGhhbiIsImxlc3Nfb3JfZXF1YWwiLCJncmVhdGVyX29yX2VxdWFsIiwibm90X2NvbnRhaW4iLCJzdGFydHNfd2l0aCIsImJldHdlZW4iLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiZmllbGRzTmFtZSIsInNvcnRfbm8iLCJjbGVhblRyaWdnZXIiLCJpbml0VHJpZ2dlciIsIl90cmlnZ2VyX2hvb2tzIiwicmVmNCIsInJlZjUiLCJ0b2RvV3JhcHBlciIsImFwcGx5IiwiYXJndW1lbnRzIiwid2hlbiIsImJlZm9yZSIsImluc2VydCIsInJlbW92ZSIsImFmdGVyIiwiX2hvb2siLCJ0cmlnZ2VyX25hbWUiLCJfdHJpZ2dlcl9ob29rIiwiZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCIsImZpbmRfcGVybWlzc2lvbl9vYmplY3QiLCJpbnRlcnNlY3Rpb25QbHVzIiwidW5pb25QZXJtaXNzaW9uT2JqZWN0cyIsInVuaW9uUGx1cyIsImdldE9iamVjdFBlcm1pc3Npb25zIiwiZ2V0UmVjb3JkUGVybWlzc2lvbnMiLCJpc093bmVyIiwib2JqZWN0X2ZpZWxkc19rZXlzIiwicmVjb3JkX2NvbXBhbnlfaWQiLCJyZWNvcmRfY29tcGFueV9pZHMiLCJzZWxlY3QiLCJ1c2VyX2NvbXBhbnlfaWRzIiwicGFyZW50Iiwia2V5cyIsImludGVyc2VjdGlvbiIsImdldE9iamVjdFJlY29yZCIsInJlY29yZF9wZXJtaXNzaW9ucyIsIm93bmVyIiwibiIsImxvY2tlZCIsImdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMiLCJjdXJyZW50T2JqZWN0TmFtZSIsInJlbGF0ZWRMaXN0SXRlbSIsImN1cnJlbnRSZWNvcmQiLCJpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUiLCJtYXN0ZXJBbGxvdyIsIm1hc3RlclJlY29yZFBlcm0iLCJyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMiLCJ1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCIsImdldFJlY29yZFNhZmVSZWxhdGVkTGlzdCIsImdldEFsbFBlcm1pc3Npb25zIiwiX2kiLCJwc2V0cyIsInBzZXRzQWRtaW4iLCJwc2V0c0FkbWluX3BvcyIsInBzZXRzQ3VycmVudCIsInBzZXRzQ3VycmVudE5hbWVzIiwicHNldHNDdXJyZW50X3BvcyIsInBzZXRzQ3VzdG9tZXIiLCJwc2V0c0N1c3RvbWVyX3BvcyIsInBzZXRzR3Vlc3QiLCJwc2V0c0d1ZXN0X3BvcyIsInBzZXRzTWVtYmVyIiwicHNldHNNZW1iZXJfcG9zIiwicHNldHNTdXBwbGllciIsInBzZXRzU3VwcGxpZXJfcG9zIiwicHNldHNVc2VyIiwicHNldHNVc2VyX3BvcyIsInNldF9pZHMiLCJzcGFjZVVzZXIiLCJvYmplY3RzIiwiYXNzaWduZWRfYXBwcyIsInVzZXJzIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJwcm9maWxlIiwiZ2V0QXNzaWduZWRBcHBzIiwiYmluZCIsImFzc2lnbmVkX21lbnVzIiwiZ2V0QXNzaWduZWRNZW51cyIsInVzZXJfcGVybWlzc2lvbl9zZXRzIiwiYXJyYXkiLCJvdGhlciIsImFwcHMiLCJwc2V0QmFzZSIsInVzZXJQcm9maWxlIiwicHNldCIsInVuaXEiLCJhYm91dE1lbnUiLCJhZG1pbk1lbnVzIiwiYWxsTWVudXMiLCJjdXJyZW50UHNldE5hbWVzIiwibWVudXMiLCJvdGhlck1lbnVBcHBzIiwib3RoZXJNZW51cyIsImFkbWluX21lbnVzIiwiZmxhdHRlbiIsIm1lbnUiLCJwc2V0c01lbnUiLCJwZXJtaXNzaW9uX3NldHMiLCJwZXJtaXNzaW9uX29iamVjdHMiLCJpc051bGwiLCJwZXJtaXNzaW9uX3NldF9pZHMiLCJwb3MiLCJvcHMiLCJvcHNfa2V5IiwiY3VycmVudFBzZXQiLCJ0ZW1wT3BzIiwicmVwZWF0SW5kZXgiLCJyZXBlYXRQbyIsIm9wc2V0QWRtaW4iLCJvcHNldEN1c3RvbWVyIiwib3BzZXRHdWVzdCIsIm9wc2V0TWVtYmVyIiwib3BzZXRTdXBwbGllciIsIm9wc2V0VXNlciIsInBvc0FkbWluIiwicG9zQ3VzdG9tZXIiLCJwb3NHdWVzdCIsInBvc01lbWJlciIsInBvc1N1cHBsaWVyIiwicG9zVXNlciIsInByb2YiLCJndWVzdCIsIm1lbWJlciIsInN1cHBsaWVyIiwiY3VzdG9tZXIiLCJkaXNhYmxlZF9hY3Rpb25zIiwidW5yZWFkYWJsZV9maWVsZHMiLCJ1bmVkaXRhYmxlX2ZpZWxkcyIsImNyZWF0b3JfZGJfdXJsIiwib3Bsb2dfdXJsIiwiTU9OR09fVVJMX0NSRUFUT1IiLCJNT05HT19PUExPR19VUkxfQ1JFQVRPUiIsIl9DUkVBVE9SX0RBVEFTT1VSQ0UiLCJfZHJpdmVyIiwiTW9uZ29JbnRlcm5hbHMiLCJSZW1vdGVDb2xsZWN0aW9uRHJpdmVyIiwib3Bsb2dVcmwiLCJjb2xsZWN0aW9uX2tleSIsIm5ld0NvbGxlY3Rpb24iLCJTTVNRdWV1ZSIsImFjdGlvbl9uYW1lIiwiZXhlY3V0ZUFjdGlvbiIsIml0ZW1fZWxlbWVudCIsIm1vcmVBcmdzIiwidG9kb0FyZ3MiLCJvZGF0YSIsInByb3RvdHlwZSIsInNsaWNlIiwiY29uY2F0Iiwic2V0IiwiRm9ybU1hbmFnZXIiLCJnZXRJbml0aWFsVmFsdWVzIiwiZGVmZXIiLCIkIiwiY2xpY2siLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwid2luZG93Iiwib3BlbiIsInJlY29yZF90aXRsZSIsImNhbGxfYmFjayIsInRleHQiLCJzd2FsIiwidGl0bGUiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY29uZmlybUJ1dHRvblRleHQiLCJjYW5jZWxCdXR0b25UZXh0IiwiYXBwaWQiLCJkeERhdGFHcmlkSW5zdGFuY2UiLCJncmlkQ29udGFpbmVyIiwiZ3JpZE9iamVjdE5hbWVDbGFzcyIsImluZm8iLCJpc09wZW5lclJlbW92ZSIsInN1Y2Nlc3MiLCJvcGVuZXIiLCJkeFRyZWVMaXN0IiwiZHhEYXRhR3JpZCIsInJlZnJlc2giLCJUZW1wbGF0ZSIsImNyZWF0b3JfZ3JpZCIsImNsb3NlIiwiRmxvd1JvdXRlciIsImdvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsS0FBQ0EsRUFBRCxHQUFNLEVBQU47O0FBQ0EsSUFBSSxPQUFBQyxPQUFBLG9CQUFBQSxZQUFBLElBQUo7QUFDQyxPQUFDQSxPQUFELEdBQVcsRUFBWDtBQ0VBOztBREREQSxRQUFRQyxPQUFSLEdBQWtCLEVBQWxCO0FBQ0FELFFBQVFFLFdBQVIsR0FBc0IsRUFBdEI7QUFDQUYsUUFBUUcsS0FBUixHQUFnQixFQUFoQjtBQUNBSCxRQUFRSSxJQUFSLEdBQWUsRUFBZjtBQUNBSixRQUFRSyxVQUFSLEdBQXFCLEVBQXJCO0FBQ0FMLFFBQVFNLE9BQVIsR0FBa0IsRUFBbEI7QUFDQU4sUUFBUU8sSUFBUixHQUFlLEVBQWY7QUFDQVAsUUFBUVEsYUFBUixHQUF3QixFQUF4QixDOzs7Ozs7Ozs7Ozs7QUVWQSxJQUFBQyxDQUFBLEVBQUFDLFdBQUE7O0FBQUE7QUFDQ0EsZ0JBQWNDLFFBQVEsZUFBUixDQUFkOztBQUNBLE1BQUdDLE9BQU9DLGFBQVY7QUFDQ0QsV0FBT0UsT0FBUCxDQUFlO0FBQ2QsVUFBQUMsRUFBQTs7QUFBQTtBQ0lLLGVESEpMLFlBQVlNLElBQVosRUNHSTtBREpMLGVBQUFDLEtBQUE7QUFFTUYsYUFBQUUsS0FBQTtBQ0tELGVESkpDLFFBQVFDLEdB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aUJNOztBRFBOLGdCQUFHaWhCLGFBQWMsT0FBT0EsU0FBUCxLQUFvQixVQUFyQztBQ1NPLHFCRFJOQSxXQ1FNO0FBQ0Q7QUQ1Q1AsWUNGSTtBQWdERDtBRHZETixRQ0ZHO0FEbEVKO0FBQUEsR0FGRDtBQ2lJQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJAZGIgPSB7fVxyXG5pZiAhQ3JlYXRvcj9cclxuXHRAQ3JlYXRvciA9IHt9XHJcbkNyZWF0b3IuT2JqZWN0cyA9IHt9XHJcbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fVxyXG5DcmVhdG9yLk1lbnVzID0gW11cclxuQ3JlYXRvci5BcHBzID0ge31cclxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge31cclxuQ3JlYXRvci5SZXBvcnRzID0ge31cclxuQ3JlYXRvci5zdWJzID0ge31cclxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge30iLCJ0aGlzLmRiID0ge307XG5cbmlmICh0eXBlb2YgQ3JlYXRvciA9PT0gXCJ1bmRlZmluZWRcIiB8fCBDcmVhdG9yID09PSBudWxsKSB7XG4gIHRoaXMuQ3JlYXRvciA9IHt9O1xufVxuXG5DcmVhdG9yLk9iamVjdHMgPSB7fTtcblxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9O1xuXG5DcmVhdG9yLk1lbnVzID0gW107XG5cbkNyZWF0b3IuQXBwcyA9IHt9O1xuXG5DcmVhdG9yLkRhc2hib2FyZHMgPSB7fTtcblxuQ3JlYXRvci5SZXBvcnRzID0ge307XG5cbkNyZWF0b3Iuc3VicyA9IHt9O1xuXG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fTtcbiIsInRyeVxyXG5cdHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXHJcblx0aWYgTWV0ZW9yLmlzRGV2ZWxvcG1lbnRcclxuXHRcdE1ldGVvci5zdGFydHVwIC0+XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdHN0ZWVkb3NDb3JlLmluaXQoKVxyXG5cdFx0XHRjYXRjaCBleFxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGV4KVxyXG5jYXRjaCBlXHJcblx0Y29uc29sZS5sb2coZSkiLCJ2YXIgZSwgc3RlZWRvc0NvcmU7XG5cbnRyeSB7XG4gIHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuICBpZiAoTWV0ZW9yLmlzRGV2ZWxvcG1lbnQpIHtcbiAgICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBleDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5pbml0KCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coZXgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBlID0gZXJyb3I7XG4gIGNvbnNvbGUubG9nKGUpO1xufVxuIiwiQ3JlYXRvci5kZXBzID0ge1xyXG5cdGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxyXG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxyXG59O1xyXG5cclxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XHJcblx0QXBwczoge30sXHJcblx0T2JqZWN0czoge31cclxufVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxyXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXHJcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2NyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxyXG5cclxuIyBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMg5L6bc3RlZWRvcy1jbGnpobnnm67kvb/nlKhcclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxyXG5cdENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XHJcblx0XHRGaWJlcigoKS0+XHJcblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcclxuXHRcdCkucnVuKClcclxuXHJcbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBvYmoubmFtZVxyXG5cclxuXHRpZiAhb2JqLmxpc3Rfdmlld3NcclxuXHRcdG9iai5saXN0X3ZpZXdzID0ge31cclxuXHJcblx0aWYgb2JqLnNwYWNlXHJcblx0XHRvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKVxyXG5cdGlmIG9iamVjdF9uYW1lID09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCdcclxuXHRcdG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xyXG5cdFx0b2JqID0gXy5jbG9uZShvYmopXHJcblx0XHRvYmoubmFtZSA9IG9iamVjdF9uYW1lXHJcblx0XHRDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqXHJcblxyXG5cdENyZWF0b3IuY29udmVydE9iamVjdChvYmopXHJcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XHJcblxyXG5cdENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKVxyXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcclxuXHRyZXR1cm4gb2JqXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxyXG5cdGlmIG9iamVjdC5zcGFjZVxyXG5cdFx0cmV0dXJuIFwiY18je29iamVjdC5zcGFjZX1fI3tvYmplY3QubmFtZX1cIlxyXG5cdHJldHVybiBvYmplY3QubmFtZVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3QgPSAob2JqZWN0X25hbWUsIHNwYWNlX2lkKS0+XHJcblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxyXG5cdFx0cmV0dXJuIDtcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxyXG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcbiNcdGlmICFzcGFjZV9pZCAmJiBvYmplY3RfbmFtZVxyXG4jXHRcdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKVxyXG4jXHRcdFx0c3BhY2VfaWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHJcblx0aWYgb2JqZWN0X25hbWVcclxuI1x0XHRpZiBzcGFjZV9pZFxyXG4jXHRcdFx0b2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY18je3NwYWNlX2lkfV8je29iamVjdF9uYW1lfVwiXVxyXG4jXHRcdFx0aWYgb2JqXHJcbiNcdFx0XHRcdHJldHVybiBvYmpcclxuI1xyXG4jXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XHJcbiNcdFx0XHRcdHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT0gb2JqZWN0X25hbWVcclxuI1x0XHRpZiBvYmpcclxuI1x0XHRcdHJldHVybiBvYmpcclxuXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gKG9iamVjdF9pZCktPlxyXG5cdHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtfaWQ6IG9iamVjdF9pZH0pXHJcblxyXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IChvYmplY3RfbmFtZSktPlxyXG5cdGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKVxyXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXHJcblx0ZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cclxuXHJcbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0aWYgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW0NyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uX2NvbGxlY3Rpb25fbmFtZV1cclxuXHJcbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXVxyXG5cclxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRzcGFjZSA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpPy5kYj8uZmluZE9uZShzcGFjZUlkLHtmaWVsZHM6e2FkbWluczoxfX0pXHJcblx0aWYgc3BhY2U/LmFkbWluc1xyXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMFxyXG5cclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKS0+XHJcblxyXG5cdGlmICFfLmlzU3RyaW5nKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIGZvcm11bGFyXHJcblxyXG5cdGlmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKVxyXG5cclxuXHRyZXR1cm4gZm9ybXVsYXJcclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGNvbnRleHQpLT5cclxuXHRzZWxlY3RvciA9IHt9XHJcblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cclxuXHRcdGlmIGZpbHRlcj8ubGVuZ3RoID09IDNcclxuXHRcdFx0bmFtZSA9IGZpbHRlclswXVxyXG5cdFx0XHRhY3Rpb24gPSBmaWx0ZXJbMV1cclxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpXHJcblx0XHRcdHNlbGVjdG9yW25hbWVdID0ge31cclxuXHRcdFx0c2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlXHJcblx0Y29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3RvcilcclxuXHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IChzcGFjZUlkKSAtPlxyXG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXHJcblxyXG4jIyNcclxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXHJcblx0aWRz77yaX2lk6ZuG5ZCIXHJcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcclxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXHJcbiMjI1xyXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IChkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KS0+XHJcblxyXG5cdGlmICFpZF9rZXlcclxuXHRcdGlkX2tleSA9IFwiX2lkXCJcclxuXHJcblx0aWYgaGl0X2ZpcnN0XHJcblxyXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcclxuXHRcdHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KVxyXG5cclxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxyXG5cdFx0XHRcdFx0X2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXHJcblx0XHRcdFx0XHRpZiBfaW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XHJcblx0XHRcdHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcclxuXHJcbiMjI1xyXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xyXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xyXG4jIyNcclxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gKHZhbHVlMSwgdmFsdWUyKSAtPlxyXG5cdGlmIHRoaXMua2V5XHJcblx0XHR2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldXHJcblx0XHR2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldXHJcblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxyXG5cdFx0dmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKVxyXG5cdGlmIHZhbHVlMiBpbnN0YW5jZW9mIERhdGVcclxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcclxuXHRpZiB0eXBlb2YgdmFsdWUxIGlzIFwibnVtYmVyXCIgYW5kIHR5cGVvZiB2YWx1ZTIgaXMgXCJudW1iZXJcIlxyXG5cdFx0cmV0dXJuIHZhbHVlMSAtIHZhbHVlMlxyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcclxuXHRpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09IG51bGwgb3IgdmFsdWUxID09IHVuZGVmaW5lZFxyXG5cdGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT0gbnVsbCBvciB2YWx1ZTIgPT0gdW5kZWZpbmVkXHJcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAtMVxyXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAwXHJcblx0aWYgIWlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAxXHJcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxyXG5cdHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlIHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGVcclxuXHJcblxyXG4jIOivpeWHveaVsOWPquWcqOWIneWni+WMlk9iamVjdOaXtu+8jOaKiuebuOWFs+WvueixoeeahOiuoeeul+e7k+aenOS/neWtmOWIsE9iamVjdOeahHJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4re+8jOWQjue7reWPr+S7peebtOaOpeS7jnJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4reWPluW+l+iuoeeul+e7k+aenOiAjOS4jeeUqOWGjeasoeiwg+eUqOivpeWHveaVsOadpeiuoeeul1xyXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IFtdXHJcblx0IyBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXHJcblx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRpZiAhX29iamVjdFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cdFxyXG5cdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxyXG5cdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XHJcblx0XHRyZWxhdGVkTGlzdE1hcCA9IHt9XHJcblx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpOYW1lKS0+XHJcblx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqTmFtZVxyXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fVxyXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XHJcblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cclxuXHRcdFx0XHRpZiAocmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lIGFuZCByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXVxyXG5cdFx0XHRcdFx0cmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7IG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmcgfVxyXG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddXHJcblx0XHRcdHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHsgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiIH1cclxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXVxyXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7IG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLCBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCIgfVxyXG5cdFx0Xy5lYWNoIFsndGFza3MnLCAnbm90ZXMnLCAnZXZlbnRzJywgJ2FwcHJvdmFscyddLCAoZW5hYmxlT2JqTmFtZSktPlxyXG5cdFx0XHRpZiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXVxyXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdID0geyBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiIH1cclxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ11cclxuXHRcdFx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxyXG5cdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXHJcblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHsgb2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XHJcblx0XHRyZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyByZWxhdGVkTGlzdE1hcFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9maWxlc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwifVxyXG5cclxuXHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cclxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cclxuXHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcclxuXHRcdFx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwib2JqZWN0X2ZpZWxkc1wiXHJcblx0XHRcdFx0XHQjVE9ETyDlvoXnm7jlhbPliJfooajmlK/mjIHmjpLluo/lkI7vvIzliKDpmaTmraTliKTmlq1cclxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWV9KVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmd9XHJcblxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJ0YXNrc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfbm90ZXNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ldmVudHNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImV2ZW50c1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wifVxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX2FwcHJvdmFsc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHQjcmVjb3JkIOivpue7huS4i+eahGF1ZGl0X3JlY29yZHPku4Vtb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5Y+v6KeBXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXHJcblx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHJcblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9ICh1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0cmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUXHJcblx0ZWxzZVxyXG5cdFx0aWYgISh1c2VySWQgYW5kIHNwYWNlSWQpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiXHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHRzdUZpZWxkcyA9IHtuYW1lOiAxLCBtb2JpbGU6IDEsIHBvc2l0aW9uOiAxLCBlbWFpbDogMSwgY29tcGFueTogMSwgb3JnYW5pemF0aW9uOiAxLCBzcGFjZTogMSwgY29tcGFueV9pZDogMSwgY29tcGFueV9pZHM6IDF9XHJcblx0XHQjIGNoZWNrIGlmIHVzZXIgaW4gdGhlIHNwYWNlXHJcblx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxyXG5cdFx0aWYgIXN1XHJcblx0XHRcdHNwYWNlSWQgPSBudWxsXHJcblxyXG5cdFx0IyBpZiBzcGFjZUlkIG5vdCBleGlzdHMsIGdldCB0aGUgZmlyc3Qgb25lLlxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0aWYgaXNVblNhZmVNb2RlXHJcblx0XHRcdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7dXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxyXG5cdFx0XHRcdGlmICFzdVxyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdFx0XHRzcGFjZUlkID0gc3Uuc3BhY2VcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBudWxsXHJcblxyXG5cdFx0VVNFUl9DT05URVhUID0ge31cclxuXHRcdFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWRcclxuXHRcdFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZFxyXG5cdFx0VVNFUl9DT05URVhULnVzZXIgPSB7XHJcblx0XHRcdF9pZDogdXNlcklkXHJcblx0XHRcdG5hbWU6IHN1Lm5hbWUsXHJcblx0XHRcdG1vYmlsZTogc3UubW9iaWxlLFxyXG5cdFx0XHRwb3NpdGlvbjogc3UucG9zaXRpb24sXHJcblx0XHRcdGVtYWlsOiBzdS5lbWFpbFxyXG5cdFx0XHRjb21wYW55OiBzdS5jb21wYW55XHJcblx0XHRcdGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWRcclxuXHRcdFx0Y29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXHJcblx0XHR9XHJcblx0XHRzcGFjZV91c2VyX29yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIik/LmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKVxyXG5cdFx0aWYgc3BhY2VfdXNlcl9vcmdcclxuXHRcdFx0VVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xyXG5cdFx0XHRcdF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxyXG5cdFx0XHRcdG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXHJcblx0XHRcdFx0ZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXHJcblx0XHRcdH1cclxuXHRcdHJldHVybiBVU0VSX0NPTlRFWFRcclxuXHJcbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSAodXJsKS0+XHJcblxyXG5cdGlmIF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAodXJsPy5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpKVxyXG5cdFx0aWYgIS9eXFwvLy50ZXN0KHVybClcclxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcclxuXHRcdHJldHVybiB1cmxcclxuXHJcblx0aWYgdXJsXHJcblx0XHQjIHVybOW8gOWktOayoeaciVwiL1wi77yM6ZyA6KaB5re75YqgXCIvXCJcclxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXHJcblx0XHRcdHVybCA9IFwiL1wiICsgdXJsXHJcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybFxyXG5cdGVsc2VcclxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYXHJcblxyXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSAodXNlcklkLCBzcGFjZUlkKS0+XHJcblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxyXG5cdGVsc2VcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcclxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWQ6MX19KVxyXG5cdHJldHVybiBzdS5jb21wYW55X2lkXHJcblxyXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gKHVzZXJJZCwgc3BhY2VJZCktPlxyXG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcclxuXHRlbHNlXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXHJcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkczoxfX0pXHJcblx0cmV0dXJuIHN1Py5jb21wYW55X2lkc1xyXG5cclxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSAocG8pLT5cclxuXHRpZiBwby5hbGxvd0NyZWF0ZVxyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLmFsbG93RWRpdFxyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLmFsbG93RGVsZXRlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0aWYgcG8udmlld0FsbFJlY29yZHNcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxyXG5cdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcclxuXHRyZXR1cm4gcG9cclxuXHJcbkNyZWF0b3IuZ2V0VGVtcGxhdGVTcGFjZUlkID0gKCktPlxyXG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWRcclxuXHJcbkNyZWF0b3IuZ2V0Q2xvdWRBZG1pblNwYWNlSWQgPSAoKS0+XHJcblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkXHJcblxyXG5DcmVhdG9yLmlzVGVtcGxhdGVTcGFjZSA9IChzcGFjZUlkKS0+XHJcblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWQgPT0gc3BhY2VJZFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSAoc3BhY2VJZCktPlxyXG5cdGlmIHNwYWNlSWQgJiYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWQgPT0gc3BhY2VJZFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdGlmIHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVJcclxuXHRcdENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSXHJcblx0ZWxzZVxyXG5cdFx0cGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG5cdFx0Q3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vY2ZzJykpXHJcbiIsInZhciBGaWJlciwgcGF0aDtcblxuQ3JlYXRvci5kZXBzID0ge1xuICBhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3ksXG4gIG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG4gIEFwcHM6IHt9LFxuICBPYmplY3RzOiB7fVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIG9wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICByZXR1cm4gU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGNyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG59KTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSk7XG4gICAgfSkucnVuKCk7XG4gIH07XG59XG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iai5uYW1lO1xuICB9XG4gIGlmICghb2JqLmxpc3Rfdmlld3MpIHtcbiAgICBvYmoubGlzdF92aWV3cyA9IHt9O1xuICB9XG4gIGlmIChvYmouc3BhY2UpIHtcbiAgICBvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUgPT09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCcpIHtcbiAgICBvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCc7XG4gICAgb2JqID0gXy5jbG9uZShvYmopO1xuICAgIG9iai5uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9iajtcbiAgfVxuICBDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKTtcbiAgbmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG4gIENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5pbml0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIG9iajtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0LnNwYWNlKSB7XG4gICAgcmV0dXJuIFwiY19cIiArIG9iamVjdC5zcGFjZSArIFwiX1wiICsgb2JqZWN0Lm5hbWU7XG4gIH1cbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgaWYgKF8uaXNBcnJheShvYmplY3RfbmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgICBpZiAoKHJlZjEgPSByZWYub2JqZWN0KSAhPSBudWxsKSB7XG4gICAgICAgIHJlZjEuZGVwZW5kKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSBmdW5jdGlvbihvYmplY3RfaWQpIHtcbiAgcmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge1xuICAgIF9pZDogb2JqZWN0X2lkXG4gIH0pO1xufTtcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSk7XG4gIGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zWyhyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuX2NvbGxlY3Rpb25fbmFtZSA6IHZvaWQgMF07XG4gIH1cbn07XG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgcmVmLCByZWYxLCBzcGFjZTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIikpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYikgIT0gbnVsbCA/IHJlZjEuZmluZE9uZShzcGFjZUlkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhZG1pbnM6IDFcbiAgICB9XG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBpZiAoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmFkbWlucyA6IHZvaWQgMCkge1xuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgaWYgKCFfLmlzU3RyaW5nKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBmb3JtdWxhcjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gZm9ybXVsYXI7XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGNvbnRleHQpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBzZWxlY3RvciA9IHt9O1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGFjdGlvbiwgbmFtZSwgdmFsdWU7XG4gICAgaWYgKChmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5sZW5ndGggOiB2b2lkIDApID09PSAzKSB7XG4gICAgICBuYW1lID0gZmlsdGVyWzBdO1xuICAgICAgYWN0aW9uID0gZmlsdGVyWzFdO1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpO1xuICAgICAgc2VsZWN0b3JbbmFtZV0gPSB7fTtcbiAgICAgIHJldHVybiBzZWxlY3RvcltuYW1lXVthY3Rpb25dID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgY29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3Rvcik7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIHNwYWNlSWQgPT09ICdjb21tb24nO1xufTtcblxuXG4vKlxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4gKi9cblxuQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMgPSBmdW5jdGlvbihkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KSB7XG4gIHZhciB2YWx1ZXM7XG4gIGlmICghaWRfa2V5KSB7XG4gICAgaWRfa2V5ID0gXCJfaWRcIjtcbiAgfVxuICBpZiAoaGl0X2ZpcnN0KSB7XG4gICAgdmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpO1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHZhciBfaW5kZXg7XG4gICAgICBfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgICBpZiAoX2luZGV4ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9pbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgfSk7XG4gIH1cbn07XG5cblxuLypcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuICovXG5cbkNyZWF0b3Iuc29ydGluZ01ldGhvZCA9IGZ1bmN0aW9uKHZhbHVlMSwgdmFsdWUyKSB7XG4gIHZhciBpc1ZhbHVlMUVtcHR5LCBpc1ZhbHVlMkVtcHR5LCBsb2NhbGU7XG4gIGlmICh0aGlzLmtleSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV07XG4gICAgdmFsdWUyID0gdmFsdWUyW3RoaXMua2V5XTtcbiAgfVxuICBpZiAodmFsdWUxIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHZhbHVlMiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTIgPSB2YWx1ZTIuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUxID09PSBcIm51bWJlclwiICYmIHR5cGVvZiB2YWx1ZTIgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gdmFsdWUxIC0gdmFsdWUyO1xuICB9XG4gIGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT09IG51bGwgfHwgdmFsdWUxID09PSB2b2lkIDA7XG4gIGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT09IG51bGwgfHwgdmFsdWUyID09PSB2b2lkIDA7XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmICFpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBpZiAoIWlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKCk7XG4gIHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlKHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGUpO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TWFwLCByZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IFtdO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICByZWxhdGVkTGlzdE1hcCA9IHt9O1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqTmFtZSkge1xuICAgICAgaWYgKF8uaXNPYmplY3Qob2JqTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSAmJiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgIHNoYXJpbmc6IHJlbGF0ZWRfZmllbGQuc2hhcmluZ1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICAgIH07XG4gICAgfVxuICAgIF8uZWFjaChbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgZnVuY3Rpb24oZW5hYmxlT2JqTmFtZSkge1xuICAgICAgaWYgKHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSxcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSkge1xuICAgICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyhyZWxhdGVkTGlzdE1hcCk7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZmlsZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiAmJiByZWxhdGVkX2ZpZWxkLnJlbGF0ZWRMaXN0KSkgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcIm9iamVjdF9maWVsZHNcIikge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgICAgICBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Rhc2tzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwidGFza3NcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ub3Rlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcIm5vdGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZXZlbnRzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiZXZlbnRzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfaW5zdGFuY2VzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfYXBwcm92YWxzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiYXBwcm92YWxzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpIHtcbiAgdmFyIFVTRVJfQ09OVEVYVCwgcmVmLCBzcGFjZV91c2VyX29yZywgc3UsIHN1RmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUO1xuICB9IGVsc2Uge1xuICAgIGlmICghKHVzZXJJZCAmJiBzcGFjZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN1RmllbGRzID0ge1xuICAgICAgbmFtZTogMSxcbiAgICAgIG1vYmlsZTogMSxcbiAgICAgIHBvc2l0aW9uOiAxLFxuICAgICAgZW1haWw6IDEsXG4gICAgICBjb21wYW55OiAxLFxuICAgICAgb3JnYW5pemF0aW9uOiAxLFxuICAgICAgc3BhY2U6IDEsXG4gICAgICBjb21wYW55X2lkOiAxLFxuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9O1xuICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgfSk7XG4gICAgaWYgKCFzdSkge1xuICAgICAgc3BhY2VJZCA9IG51bGw7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgaWYgKGlzVW5TYWZlTW9kZSkge1xuICAgICAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghc3UpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzcGFjZUlkID0gc3Uuc3BhY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgVVNFUl9DT05URVhUID0ge307XG4gICAgVVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZDtcbiAgICBVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWQ7XG4gICAgVVNFUl9DT05URVhULnVzZXIgPSB7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIG5hbWU6IHN1Lm5hbWUsXG4gICAgICBtb2JpbGU6IHN1Lm1vYmlsZSxcbiAgICAgIHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcbiAgICAgIGVtYWlsOiBzdS5lbWFpbCxcbiAgICAgIGNvbXBhbnk6IHN1LmNvbXBhbnksXG4gICAgICBjb21wYW55X2lkOiBzdS5jb21wYW55X2lkLFxuICAgICAgY29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXG4gICAgfTtcbiAgICBzcGFjZV91c2VyX29yZyA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpKSAhPSBudWxsID8gcmVmLmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKSA6IHZvaWQgMDtcbiAgICBpZiAoc3BhY2VfdXNlcl9vcmcpIHtcbiAgICAgIFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcbiAgICAgICAgX2lkOiBzcGFjZV91c2VyX29yZy5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXG4gICAgICAgIGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFVTRVJfQ09OVEVYVDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICBpZiAoXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICgodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9hc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSA6IHZvaWQgMCkpKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBpZiAodXJsKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWQ6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UuY29tcGFueV9pZDtcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdSAhPSBudWxsID8gc3UuY29tcGFueV9pZHMgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHBvKSB7XG4gIGlmIChwby5hbGxvd0NyZWF0ZSkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHBvO1xufTtcblxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYudGVtcGxhdGVTcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKHNwYWNlSWQgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYuY2xvdWRBZG1pblNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBpZiAocHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUikge1xuICAgIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSO1xuICB9IGVsc2Uge1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vY2ZzJykpO1xuICB9XG59XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdCMg55So5oi36I635Y+WbG9va3VwIOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrXnmoTpgInpobnlgLxcclxuXHRcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogKG9wdGlvbnMpLT5cclxuXHRcdGlmIG9wdGlvbnM/LnBhcmFtcz8ucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKVxyXG5cclxuXHRcdFx0bmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcclxuXHJcblx0XHRcdHF1ZXJ5ID0ge31cclxuXHRcdFx0aWYgb3B0aW9ucy5wYXJhbXMuc3BhY2VcclxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlXHJcblxyXG5cdFx0XHRcdHNvcnQgPSBvcHRpb25zPy5zb3J0XHJcblxyXG5cdFx0XHRcdHNlbGVjdGVkID0gb3B0aW9ucz8uc2VsZWN0ZWQgfHwgW11cclxuXHJcblx0XHRcdFx0b3B0aW9uc19saW1pdCA9IG9wdGlvbnM/Lm9wdGlvbnNfbGltaXQgfHwgMTBcclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XHJcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxyXG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH1cclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcclxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fSwgc2VhcmNoVGV4dFF1ZXJ5XVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fV1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdFx0XHRcdFx0Xy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSlcclxuXHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskbmluOiBzZWxlY3RlZH1cclxuXHJcblx0XHRcdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XHJcblx0XHRcdFx0XHRfLmV4dGVuZCBxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeVxyXG5cclxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiBvcHRpb25zX2xpbWl0fVxyXG5cclxuXHRcdFx0XHRpZiBzb3J0ICYmIF8uaXNPYmplY3Qoc29ydClcclxuXHRcdFx0XHRcdHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnRcclxuXHJcblx0XHRcdFx0aWYgY29sbGVjdGlvblxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKClcclxuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IFtdXHJcblx0XHRcdFx0XHRcdF8uZWFjaCByZWNvcmRzLCAocmVjb3JkKS0+XHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoXHJcblx0XHRcdFx0XHRcdFx0XHRsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XVxyXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlY29yZC5faWRcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcclxuXHRcdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxyXG5cdFx0cmV0dXJuIFtdICIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZSwgbmFtZV9maWVsZF9rZXksIG9iamVjdCwgb3B0aW9uc19saW1pdCwgcXVlcnksIHF1ZXJ5X29wdGlvbnMsIHJlY29yZHMsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2VhcmNoVGV4dFF1ZXJ5LCBzZWxlY3RlZCwgc29ydDtcbiAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZiA9IG9wdGlvbnMucGFyYW1zKSAhPSBudWxsID8gcmVmLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSk7XG4gICAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5wYXJhbXMuc3BhY2UpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZTtcbiAgICAgICAgc29ydCA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc29ydCA6IHZvaWQgMDtcbiAgICAgICAgc2VsZWN0ZWQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zZWxlY3RlZCA6IHZvaWQgMCkgfHwgW107XG4gICAgICAgIG9wdGlvbnNfbGltaXQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5vcHRpb25zX2xpbWl0IDogdm9pZCAwKSB8fCAxMDtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7XG4gICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYxID0gb3B0aW9ucy52YWx1ZXMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VhcmNoVGV4dFF1ZXJ5XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAkbmluOiBzZWxlY3RlZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyUXVlcnkpIHtcbiAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgcXVlcnlfb3B0aW9ucyA9IHtcbiAgICAgICAgICBsaW1pdDogb3B0aW9uc19saW1pdFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpKSB7XG4gICAgICAgICAgcXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpO1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHJlY29yZHMsIGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLl9pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxyXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXHJcblxyXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxyXG5cdFx0b2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZVxyXG5cdFx0cmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkXHJcblx0XHRzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkXHJcblxyXG5cdFx0Y2hlY2sgb2JqZWN0X25hbWUsIFN0cmluZ1xyXG5cdFx0Y2hlY2sgcmVjb3JkX2lkLCBTdHJpbmdcclxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcclxuXHJcblx0XHRpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZFxyXG5cdFx0eF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXVxyXG5cdFx0eF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXVxyXG5cclxuXHRcdHJlZGlyZWN0X3VybCA9IFwiL1wiXHJcblx0XHRpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpXHJcblx0XHQjIC0g5oiR55qE6I2J56i/5bCx6Lez6L2s6Iez6I2J56i/566xXHJcblx0XHQjIC0g5oiR55qE5b6F5a6h5qC45bCx6Lez6L2s6Iez5b6F5a6h5qC4XHJcblx0XHQjIC0g5LiN5piv5oiR55qE55Sz6K+35Y2V5YiZ6Lez6L2s6Iez5omT5Y2w6aG16Z2iXHJcblx0XHQjIC0g5aaC55Sz6K+35Y2V5LiN5a2Y5Zyo5YiZ5o+Q56S655So5oi355Sz6K+35Y2V5bey5Yig6Zmk77yM5bm25LiU5pu05pawcmVjb3Jk55qE54q25oCB77yM5L2/55So5oi35Y+v5Lul6YeN5paw5Y+R6LW35a6h5om5XHJcblx0XHRpZiBpbnNcclxuXHRcdFx0d29ya2Zsb3dVcmwgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLndvcmtmbG93LnVybFxyXG5cdFx0XHRib3ggPSAnJ1xyXG5cdFx0XHRzcGFjZUlkID0gaW5zLnNwYWNlXHJcblx0XHRcdGZsb3dJZCA9IGlucy5mbG93XHJcblxyXG5cdFx0XHRpZiAoaW5zLmluYm94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpIG9yIChpbnMuY2NfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRib3ggPSAnaW5ib3gnXHJcblx0XHRcdGVsc2UgaWYgaW5zLm91dGJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkXHJcblx0XHRcdFx0Ym94ID0gJ291dGJveCdcclxuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ2RyYWZ0JyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcclxuXHRcdFx0XHRib3ggPSAnZHJhZnQnXHJcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdwZW5kaW5nJyBhbmQgKGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkIG9yIGlucy5hcHBsaWNhbnQgaXMgY3VycmVudF91c2VyX2lkKVxyXG5cdFx0XHRcdGJveCA9ICdwZW5kaW5nJ1xyXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnY29tcGxldGVkJyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcclxuXHRcdFx0XHRib3ggPSAnY29tcGxldGVkJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyDpqozor4Fsb2dpbiB1c2VyX2lk5a+56K+l5rWB56iL5pyJ566h55CG55Sz6K+35Y2V55qE5p2D6ZmQXHJcblx0XHRcdFx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpXHJcblx0XHRcdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkLCB7IGZpZWxkczogeyBhZG1pbnM6IDEgfSB9KVxyXG5cdFx0XHRcdGlmIHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgb3Igc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRcdGJveCA9ICdtb25pdG9yJ1xyXG5cclxuXHRcdFx0aWYgYm94XHJcblx0XHRcdFx0cmVkaXJlY3RfdXJsID0gd29ya2Zsb3dVcmwgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vI3tib3h9LyN7aW5zSWR9P1gtVXNlci1JZD0je3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSN7eF9hdXRoX3Rva2VufVwiXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSB3b3JrZmxvd1VybCArIFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS9wcmludC8je2luc0lkfT9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxyXG5cclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRcdGRhdGE6IHsgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmwgfVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcclxuXHRcdFx0aWYgY29sbGVjdGlvblxyXG5cdFx0XHRcdGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xyXG5cdFx0XHRcdFx0JHB1bGw6IHtcclxuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZXNcIjoge1xyXG5cdFx0XHRcdFx0XHRcdFwiX2lkXCI6IGluc0lkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKVxyXG5cclxuXHRjYXRjaCBlXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxyXG5cdFx0fVxyXG5cclxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJveCwgY29sbGVjdGlvbiwgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgZmxvd0lkLCBoYXNoRGF0YSwgaW5zLCBpbnNJZCwgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25zLCByZWNvcmRfaWQsIHJlZGlyZWN0X3VybCwgcmVmLCByZWYxLCByZWYyLCBzcGFjZSwgc3BhY2VJZCwgc3BhY2VfaWQsIHdvcmtmbG93VXJsLCB4X2F1dGhfdG9rZW4sIHhfdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWU7XG4gICAgcmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkO1xuICAgIHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWQ7XG4gICAgY2hlY2sob2JqZWN0X25hbWUsIFN0cmluZyk7XG4gICAgY2hlY2socmVjb3JkX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkO1xuICAgIHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgeF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXTtcbiAgICByZWRpcmVjdF91cmwgPSBcIi9cIjtcbiAgICBpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpO1xuICAgIGlmIChpbnMpIHtcbiAgICAgIHdvcmtmbG93VXJsID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLndvcmtmbG93LnVybDtcbiAgICAgIGJveCA9ICcnO1xuICAgICAgc3BhY2VJZCA9IGlucy5zcGFjZTtcbiAgICAgIGZsb3dJZCA9IGlucy5mbG93O1xuICAgICAgaWYgKCgocmVmID0gaW5zLmluYm94X3VzZXJzKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHx8ICgocmVmMSA9IGlucy5jY191c2VycykgIT0gbnVsbCA/IHJlZjEuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgYm94ID0gJ2luYm94JztcbiAgICAgIH0gZWxzZSBpZiAoKHJlZjIgPSBpbnMub3V0Ym94X3VzZXJzKSAhPSBudWxsID8gcmVmMi5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSB7XG4gICAgICAgIGJveCA9ICdvdXRib3gnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdkcmFmdCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdkcmFmdCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ3BlbmRpbmcnICYmIChpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQgfHwgaW5zLmFwcGxpY2FudCA9PT0gY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICBib3ggPSAncGVuZGluZyc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2NvbXBsZXRlZCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdjb21wbGV0ZWQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpO1xuICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGFkbWluczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIHx8IHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgICAgYm94ID0gJ21vbml0b3InO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoYm94KSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9IHdvcmtmbG93VXJsICsgKFwid29ya2Zsb3cvc3BhY2UvXCIgKyBzcGFjZUlkICsgXCIvXCIgKyBib3ggKyBcIi9cIiArIGluc0lkICsgXCI/WC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9IHdvcmtmbG93VXJsICsgKFwid29ya2Zsb3cvc3BhY2UvXCIgKyBzcGFjZUlkICsgXCIvcHJpbnQvXCIgKyBpbnNJZCArIFwiP2JveD1tb25pdG9yJnByaW50X2lzX3Nob3dfdHJhY2VzPTEmcHJpbnRfaXNfc2hvd19hdHRhY2htZW50cz0xJlgtVXNlci1JZD1cIiArIHhfdXNlcl9pZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIHhfYXV0aF90b2tlbik7XG4gICAgICB9XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICBjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgXCJpbnN0YW5jZXNcIjoge1xuICAgICAgICAgICAgICBcIl9pZFwiOiBpbnNJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+eUs+ivt+WNleW3suWIoOmZpCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpIC0+XHJcblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKT8uX3NjaGVtYVxyXG5cdGNvbHVtbl9udW0gPSAwXHJcblx0aWYgX3NjaGVtYVxyXG5cdFx0Xy5lYWNoIGNvbHVtbnMsIChmaWVsZF9uYW1lKSAtPlxyXG5cdFx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxyXG5cdFx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXHJcblx0XHRcdGlmIGlzX3dpZGVcclxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMVxyXG5cclxuXHRcdGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW1cclxuXHRcdHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnRcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIC0+XHJcblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hXHJcblx0aWYgX3NjaGVtYVxyXG5cdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcclxuXHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcclxuXHRcdHJldHVybiBpc193aWRlXHJcblxyXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSAtPlxyXG5cdHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zPy5zZXR0aW5ncz8uZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wifSlcclxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRjb2x1bW5zID0gXy5tYXAgY29sdW1ucywgKGNvbHVtbiktPlxyXG5cdFx0ZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl1cclxuXHRcdGlmIGZpZWxkPy50eXBlIGFuZCAhZmllbGQuaGlkZGVuXHJcblx0XHRcdHJldHVybiBjb2x1bW5cclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdGNvbHVtbnMgPSBfLmNvbXBhY3QgY29sdW1uc1xyXG5cdGlmIHNldHRpbmcgYW5kIHNldHRpbmcuc2V0dGluZ3NcclxuXHRcdHNvcnQgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0/LnNvcnQgfHwgW11cclxuXHRcdHNvcnQgPSBfLm1hcCBzb3J0LCAob3JkZXIpLT5cclxuXHRcdFx0a2V5ID0gb3JkZXJbMF1cclxuXHRcdFx0aW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KVxyXG5cdFx0XHRvcmRlclswXSA9IGluZGV4ICsgMVxyXG5cdFx0XHRyZXR1cm4gb3JkZXJcclxuXHRcdHJldHVybiBzb3J0XHJcblx0cmV0dXJuIFtdXHJcblxyXG5cclxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cclxuXHRleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl1cclxuXHRkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdXHJcblx0aWYgZGVmYXVsdF9leHRyYV9jb2x1bW5zXHJcblx0XHRleHRyYV9jb2x1bW5zID0gXy51bmlvbiBleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcclxuXHJcblx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0Q3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHM/W29iamVjdF9uYW1lXSA9IFtdXHJcblxyXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IChkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpLT5cclxuXHRkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcuY29sdW1uc1xyXG5cdGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcubW9iaWxlX2NvbHVtbnNcclxuXHRvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KVxyXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpXHJcblx0XHRvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWVcclxuXHRpZiAhb2l0ZW0uY29sdW1uc1xyXG5cdFx0aWYgZGVmYXVsdF9jb2x1bW5zXHJcblx0XHRcdG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnNcclxuXHRpZiAhb2l0ZW0uY29sdW1uc1xyXG5cdFx0b2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl1cclxuXHRpZiAhb2l0ZW0ubW9iaWxlX2NvbHVtbnNcclxuXHRcdGlmIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcclxuXHRcdFx0b2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zXHJcblxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpICYmICFfLmluY2x1ZGUob2l0ZW0uY29sdW1ucywgJ3NwYWNlJylcclxuXHRcdFx0b2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpXHJcblxyXG5cclxuXHRpZiAhb2l0ZW0uZmlsdGVyX3Njb3BlXHJcblx0XHQjIGxpc3R2aWV36KeG5Zu+55qEZmlsdGVyX3Njb3Bl6buY6K6k5YC85pS55Li6c3BhY2UgIzEzMVxyXG5cdFx0b2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiXHJcblxyXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJfaWRcIilcclxuXHRcdG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lXHJcblx0ZWxzZVxyXG5cdFx0b2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZVxyXG5cclxuXHRpZiBfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpXHJcblx0XHRvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKVxyXG5cclxuXHRfLmZvckVhY2ggb2l0ZW0uZmlsdGVycywgKGZpbHRlciwgX2luZGV4KS0+XHJcblx0XHRpZiAhXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxyXG5cdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXHJcblx0cmV0dXJuIG9pdGVtXHJcblxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0Q3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IChvYmplY3RfbmFtZSktPlxyXG5cdFx0cmVsYXRlZExpc3RPYmplY3RzID0ge31cclxuXHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXHJcblx0XHRpZiBfb2JqZWN0XHJcblx0XHRcdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxyXG5cdFx0XHRpZiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XHJcblx0XHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0LCAob2JqT3JOYW1lKS0+XHJcblx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0IG9iak9yTmFtZVxyXG5cdFx0XHRcdFx0XHRyZWxhdGVkID1cclxuXHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWVcclxuXHRcdFx0XHRcdFx0XHRjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1uc1xyXG5cdFx0XHRcdFx0XHRcdGlzX2ZpbGU6IG9iak9yTmFtZS5vYmplY3ROYW1lID09IFwiY21zX2ZpbGVzXCJcclxuXHRcdFx0XHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb246IG9iak9yTmFtZS5maWx0ZXJzXHJcblx0XHRcdFx0XHRcdFx0c29ydDogb2JqT3JOYW1lLnNvcnRcclxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6ICcnXHJcblx0XHRcdFx0XHRcdFx0Y3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWVcclxuXHRcdFx0XHRcdFx0XHRsYWJlbDogb2JqT3JOYW1lLmxhYmVsXHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkXHJcblxyXG5cdFx0bGlzdCA9IFtdXHJcblx0XHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKVxyXG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIC0+XHJcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lXHJcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXlcclxuXHRcdFx0c2hhcmluZyA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uc2hhcmluZ1xyXG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHVubGVzcyByZWxhdGVkX29iamVjdFxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXHJcblx0XHRcdGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxyXG5cclxuXHRcdFx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpXHJcblxyXG5cdFx0XHRpZiAvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSlcclxuXHRcdFx0XHQjIG9iamVjdOexu+Wei+W4puWtkOWxnuaAp+eahHJlbGF0ZWRfZmllbGRfbmFtZeimgeWOu+aOieS4remXtOeahOe+juWFg+espuWPt++8jOWQpuWImeaYvuekuuS4jeWHuuWtl+auteWAvFxyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLFwiXCIpXHJcblx0XHRcdHJlbGF0ZWQgPVxyXG5cdFx0XHRcdG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lXHJcblx0XHRcdFx0Y29sdW1uczogY29sdW1uc1xyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXHJcblx0XHRcdFx0aXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHRcdFx0c2hhcmluZzogc2hhcmluZ1xyXG5cclxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxyXG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0XHJcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jb2x1bW5zXHJcblx0XHRcdFx0XHRyZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnNcclxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LnNvcnRcclxuXHRcdFx0XHRcdHJlbGF0ZWQuc29ydCA9IHJlbGF0ZWRPYmplY3Quc29ydFxyXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uXHJcblx0XHRcdFx0XHRyZWxhdGVkLmZpbHRlcnNGdW5jdGlvbiA9IHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uXHJcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxyXG5cdFx0XHRcdFx0cmVsYXRlZC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCA9IHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3RcclxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmxhYmVsXHJcblx0XHRcdFx0XHRyZWxhdGVkLmxhYmVsID0gcmVsYXRlZE9iamVjdC5sYWJlbFxyXG5cdFx0XHRcdGRlbGV0ZSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV1cclxuXHJcblx0XHRcdGxpc3QucHVzaCByZWxhdGVkXHJcblxyXG5cclxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF8udmFsdWVzKHJlbGF0ZWRMaXN0T2JqZWN0cyksIFwib2JqZWN0X25hbWVcIilcclxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRfLmVhY2ggcmVsYXRlZExpc3RPYmplY3RzLCAodiwgcmVsYXRlZF9vYmplY3RfbmFtZSkgLT5cclxuXHRcdFx0aXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTFcclxuXHRcdFx0YWxsb3dSZWFkID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5hbGxvd1JlYWRcclxuXHRcdFx0aWYgaXNBY3RpdmUgJiYgYWxsb3dSZWFkXHJcblx0XHRcdFx0bGlzdC5wdXNoIHZcclxuXHJcblx0XHRyZXR1cm4gbGlzdFxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0cmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKVxyXG5cclxuIyMjIFxyXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxyXG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XHJcbiMjI1xyXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcclxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRpZiAhb2JqZWN0XHJcblx0XHRyZXR1cm5cclxuXHRsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSlcclxuXHR1bmxlc3MgbGlzdFZpZXdzPy5sZW5ndGhcclxuXHRcdHJldHVyblxyXG5cdGxpc3RfdmlldyA9IF8uZmluZFdoZXJlKGxpc3RWaWV3cyx7XCJfaWRcIjpsaXN0X3ZpZXdfaWR9KVxyXG5cdHVubGVzcyBsaXN0X3ZpZXdcclxuXHRcdCMg5aaC5p6c5LiN6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5YiZ6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+77yM5Y+N5LmL6L+U5Zue56m6XHJcblx0XHRpZiBleGFjXHJcblx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF1cclxuXHRyZXR1cm4gbGlzdF92aWV3XHJcblxyXG4j6I635Y+WbGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+5piv5ZCm5piv5pyA6L+R5p+l55yL6KeG5Zu+XHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRpZiAhbGlzdF92aWV3X2lkXHJcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXHJcblx0aWYgdHlwZW9mKGxpc3Rfdmlld19pZCkgPT0gXCJzdHJpbmdcIlxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRpZiAhb2JqZWN0XHJcblx0XHRcdHJldHVyblxyXG5cdFx0bGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cyx7X2lkOiBsaXN0X3ZpZXdfaWR9KVxyXG5cdGVsc2VcclxuXHRcdGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkXHJcblx0cmV0dXJuIGxpc3RWaWV3Py5uYW1lID09IFwicmVjZW50XCJcclxuXHJcblxyXG4jIyNcclxuICAgIOS7jmNvbHVtbnPlj4LmlbDkuK3ov4fmu6Tlh7rnlKjkuo7miYvmnLrnq6/mmL7npLrnmoRjb2x1bW5zXHJcblx06KeE5YiZ77yaXHJcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxyXG5cdDIu5pyA5aSa5Y+q6L+U5ZueNOS4quWtl+autVxyXG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXHJcbiMjI1xyXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKS0+XHJcblx0cmVzdWx0ID0gW11cclxuXHRtYXhSb3dzID0gMiBcclxuXHRtYXhDb3VudCA9IG1heFJvd3MgKiAyXHJcblx0Y291bnQgPSAwXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0ZmllbGRzID0gb2JqZWN0LmZpZWxkc1xyXG5cdHVubGVzcyBvYmplY3RcclxuXHRcdHJldHVybiBjb2x1bW5zXHJcblx0bmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxyXG5cdGlzTmFtZUNvbHVtbiA9IChpdGVtKS0+XHJcblx0XHRpZiBfLmlzT2JqZWN0KGl0ZW0pXHJcblx0XHRcdHJldHVybiBpdGVtLmZpZWxkID09IG5hbWVLZXlcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIGl0ZW0gPT0gbmFtZUtleVxyXG5cdGdldEZpZWxkID0gKGl0ZW0pLT5cclxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0cmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW1dXHJcblx0aWYgbmFtZUtleVxyXG5cdFx0bmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZCAoaXRlbSktPlxyXG5cdFx0XHRyZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pXHJcblx0aWYgbmFtZUNvbHVtblxyXG5cdFx0ZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKVxyXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXHJcblx0XHRjb3VudCArPSBpdGVtQ291bnRcclxuXHRcdHJlc3VsdC5wdXNoIG5hbWVDb2x1bW5cclxuXHRjb2x1bW5zLmZvckVhY2ggKGl0ZW0pLT5cclxuXHRcdGZpZWxkID0gZ2V0RmllbGQoaXRlbSlcclxuXHRcdHVubGVzcyBmaWVsZFxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGl0ZW1Db3VudCA9IGlmIGZpZWxkLmlzX3dpZGUgdGhlbiAyIGVsc2UgMVxyXG5cdFx0aWYgY291bnQgPCBtYXhDb3VudCBhbmQgcmVzdWx0Lmxlbmd0aCA8IG1heENvdW50IGFuZCAhaXNOYW1lQ29sdW1uKGl0ZW0pXHJcblx0XHRcdGNvdW50ICs9IGl0ZW1Db3VudFxyXG5cdFx0XHRpZiBjb3VudCA8PSBtYXhDb3VudFxyXG5cdFx0XHRcdHJlc3VsdC5wdXNoIGl0ZW1cclxuXHRcclxuXHRyZXR1cm4gcmVzdWx0XHJcblxyXG4jIyNcclxuICAgIOiOt+WPlum7mOiupOinhuWbvlxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IChvYmplY3RfbmFtZSktPlxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGlmICFvYmplY3RcclxuXHRcdG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRpZiBvYmplY3Q/Lmxpc3Rfdmlld3M/LmRlZmF1bHRcclxuXHRcdCNUT0RPIOatpOS7o+eggeWPquaYr+aaguaXtuWFvOWuueS7peWJjWNvZGXkuK3lrprkuYnnmoRkZWZhdWx06KeG5Zu+77yM5b6FY29kZeS4reeahGRlZmF1bHTmuIXnkIblrozmiJDlkI7vvIzpnIDopoHliKDpmaTmraTku6PnoIFcclxuXHRcdGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3MuZGVmYXVsdFxyXG5cdGVsc2VcclxuXHRcdF8uZWFjaCBvYmplY3Q/Lmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcsIGtleSktPlxyXG5cdFx0XHRpZiBsaXN0X3ZpZXcubmFtZSA9PSBcImFsbFwiIHx8IGtleSA9PSBcImFsbFwiXHJcblx0XHRcdFx0ZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXdcclxuXHRyZXR1cm4gZGVmYXVsdFZpZXc7XHJcblxyXG4jIyNcclxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IChvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdGNvbHVtbnMgPSBkZWZhdWx0Vmlldz8uY29sdW1uc1xyXG5cdGlmIHVzZV9tb2JpbGVfY29sdW1uc1xyXG5cdFx0aWYgZGVmYXVsdFZpZXc/Lm1vYmlsZV9jb2x1bW5zXHJcblx0XHRcdGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1uc1xyXG5cdFx0ZWxzZSBpZiBjb2x1bW5zXHJcblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKVxyXG5cdHJldHVybiBjb2x1bW5zXHJcblxyXG4jIyNcclxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcclxuIyMjXHJcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcclxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmV4dHJhX2NvbHVtbnNcclxuXHJcbiMjI1xyXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcclxuXHRpZiBkZWZhdWx0Vmlld1xyXG5cdFx0aWYgZGVmYXVsdFZpZXcuc29ydFxyXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFZpZXcuc29ydFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXVxyXG5cclxuXHJcbiMjI1xyXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcclxuIyMjXHJcbkNyZWF0b3IuaXNBbGxWaWV3ID0gKGxpc3RfdmlldyktPlxyXG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJhbGxcIlxyXG5cclxuIyMjXHJcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xyXG4jIyNcclxuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSAobGlzdF92aWV3KS0+XHJcblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcInJlY2VudFwiXHJcblxyXG4jIyNcclxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXHJcbiMjI1xyXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSAoc29ydCwgdGFidWxhckNvbHVtbnMpLT5cclxuXHR0YWJ1bGFyX3NvcnQgPSBbXVxyXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxyXG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXHJcblx0XHRcdCMg5YW85a655pen55qE5pWw5o2u5qC85byPW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cclxuXHRcdFx0aWYgaXRlbS5sZW5ndGggPT0gMVxyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcclxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgXCJhc2NcIl1cclxuXHRcdFx0ZWxzZSBpZiBpdGVtLmxlbmd0aCA9PSAyXHJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxyXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXHJcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBpdGVtWzFdXVxyXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXHJcblx0XHRcdCPmlrDmlbDmja7moLzlvI/vvJpbe2ZpZWxkX25hbWU6ICwgb3JkZXI6IH1dXHJcblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcclxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXHJcblx0XHRcdGlmIGZpZWxkX25hbWUgJiYgb3JkZXJcclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpXHJcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcclxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIG9yZGVyXVxyXG5cclxuXHRyZXR1cm4gdGFidWxhcl9zb3J0XHJcblxyXG4jIyNcclxuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXHJcbiMjI1xyXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gKHNvcnQpLT5cclxuXHRkeF9zb3J0ID0gW11cclxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cclxuXHRcdGlmIF8uaXNBcnJheShpdGVtKVxyXG5cdFx0XHQj5YW85a655pen5qC85byP77yaW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cclxuXHRcdFx0ZHhfc29ydC5wdXNoKGl0ZW0pXHJcblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cclxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxyXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxyXG5cdFx0XHRcdGR4X3NvcnQucHVzaCBbZmllbGRfbmFtZSwgb3JkZXJdXHJcblxyXG5cdHJldHVybiBkeF9zb3J0XHJcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBfc2NoZW1hLCBjb2x1bW5fbnVtLCBpbml0X3dpZHRoX3BlcmNlbnQsIHJlZjtcbiAgX3NjaGVtYSA9IChyZWYgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuX3NjaGVtYSA6IHZvaWQgMDtcbiAgY29sdW1uX251bSA9IDA7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICAgIHZhciBmaWVsZCwgaXNfd2lkZSwgcmVmMSwgcmVmMjtcbiAgICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgICAgaXNfd2lkZSA9IChyZWYxID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYyLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNfd2lkZSkge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtO1xuICAgIHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkge1xuICB2YXIgX3NjaGVtYSwgZmllbGQsIGlzX3dpZGUsIHJlZiwgcmVmMTtcbiAgX3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgIGlzX3dpZGUgPSAocmVmID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICByZXR1cm4gaXNfd2lkZTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRUYWJ1bGFyT3JkZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSB7XG4gIHZhciBvYmosIHJlZiwgcmVmMSwgcmVmMiwgc2V0dGluZywgc29ydDtcbiAgc2V0dGluZyA9IChyZWYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zKSAhPSBudWxsID8gKHJlZjEgPSByZWYuc2V0dGluZ3MpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBfLm1hcChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICB2YXIgZmllbGQ7XG4gICAgZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl07XG4gICAgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkgJiYgIWZpZWxkLmhpZGRlbikge1xuICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gIH0pO1xuICBjb2x1bW5zID0gXy5jb21wYWN0KGNvbHVtbnMpO1xuICBpZiAoc2V0dGluZyAmJiBzZXR0aW5nLnNldHRpbmdzKSB7XG4gICAgc29ydCA9ICgocmVmMiA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXSkgIT0gbnVsbCA/IHJlZjIuc29ydCA6IHZvaWQgMCkgfHwgW107XG4gICAgc29ydCA9IF8ubWFwKHNvcnQsIGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICB2YXIgaW5kZXgsIGtleTtcbiAgICAgIGtleSA9IG9yZGVyWzBdO1xuICAgICAgaW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KTtcbiAgICAgIG9yZGVyWzBdID0gaW5kZXggKyAxO1xuICAgICAgcmV0dXJuIG9yZGVyO1xuICAgIH0pO1xuICAgIHJldHVybiBzb3J0O1xuICB9XG4gIHJldHVybiBbXTtcbn07XG5cbkNyZWF0b3IuaW5pdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMsIGV4dHJhX2NvbHVtbnMsIG9iamVjdCwgb3JkZXIsIHJlZjtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXTtcbiAgZXh0cmFfY29sdW1ucyA9IFtcIm93bmVyXCJdO1xuICBkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdO1xuICBpZiAoZGVmYXVsdF9leHRyYV9jb2x1bW5zKSB7XG4gICAgZXh0cmFfY29sdW1ucyA9IF8udW5pb24oZXh0cmFfY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zKTtcbiAgfVxuICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkcykgIT0gbnVsbCA/IHJlZltvYmplY3RfbmFtZV0gPSBbXSA6IHZvaWQgMDtcbiAgfVxufTtcblxuQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcgPSBmdW5jdGlvbihkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRfY29sdW1ucywgZGVmYXVsdF9tb2JpbGVfY29sdW1ucywgb2l0ZW07XG4gIGRlZmF1bHRfY29sdW1ucyA9IGRlZmF1bHRfdmlldy5jb2x1bW5zO1xuICBkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3Lm1vYmlsZV9jb2x1bW5zO1xuICBvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KTtcbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpKSB7XG4gICAgb2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lO1xuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdO1xuICB9XG4gIGlmICghb2l0ZW0ubW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9tb2JpbGVfY29sdW1ucykge1xuICAgICAgb2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJyk7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uZmlsdGVyX3Njb3BlKSB7XG4gICAgb2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiO1xuICB9XG4gIGlmICghXy5oYXMob2l0ZW0sIFwiX2lkXCIpKSB7XG4gICAgb2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWU7XG4gIH0gZWxzZSB7XG4gICAgb2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZTtcbiAgfVxuICBpZiAoXy5pc1N0cmluZyhvaXRlbS5vcHRpb25zKSkge1xuICAgIG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpO1xuICB9XG4gIF8uZm9yRWFjaChvaXRlbS5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgIGlmICghXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2l0ZW07XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVsYXRlZExpc3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciBfb2JqZWN0LCBsaXN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0T2JqZWN0cywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgc3BhY2VJZCwgdW5yZWxhdGVkX29iamVjdHMsIHVzZXJJZDtcbiAgICByZWxhdGVkTGlzdE9iamVjdHMgPSB7fTtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgICBpZiAoX29iamVjdCkge1xuICAgICAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICAgICAgaWYgKCFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqT3JOYW1lKSB7XG4gICAgICAgICAgdmFyIHJlbGF0ZWQ7XG4gICAgICAgICAgaWYgKF8uaXNPYmplY3Qob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lLFxuICAgICAgICAgICAgICBjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1ucyxcbiAgICAgICAgICAgICAgaXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgICAgICAgIGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnMsXG4gICAgICAgICAgICAgIHNvcnQ6IG9iak9yTmFtZS5zb3J0LFxuICAgICAgICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6ICcnLFxuICAgICAgICAgICAgICBjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgbGFiZWw6IG9iak9yTmFtZS5sYWJlbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE9iamVjdHNbb2JqT3JOYW1lLm9iamVjdE5hbWVdID0gcmVsYXRlZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBsaXN0ID0gW107XG4gICAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfaXRlbSkge1xuICAgICAgdmFyIGNvbHVtbnMsIG9yZGVyLCByZWxhdGVkLCByZWxhdGVkT2JqZWN0LCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lLCBzaGFyaW5nLCB0YWJ1bGFyX29yZGVyO1xuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWU7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5O1xuICAgICAgc2hhcmluZyA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uc2hhcmluZztcbiAgICAgIHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIXJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gICAgICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICB0YWJ1bGFyX29yZGVyID0gQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyKG9yZGVyLCBjb2x1bW5zKTtcbiAgICAgIGlmICgvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSkpIHtcbiAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9maWVsZF9uYW1lLnJlcGxhY2UoL1xcJFxcLi8sIFwiXCIpO1xuICAgICAgfVxuICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICBpc19maWxlOiByZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICBzaGFyaW5nOiBzaGFyaW5nXG4gICAgICB9O1xuICAgICAgcmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChyZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmNvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3Quc29ydCkge1xuICAgICAgICAgIHJlbGF0ZWQuc29ydCA9IHJlbGF0ZWRPYmplY3Quc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb24pIHtcbiAgICAgICAgICByZWxhdGVkLmZpbHRlcnNGdW5jdGlvbiA9IHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0KSB7XG4gICAgICAgICAgcmVsYXRlZC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCA9IHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubGFiZWwpIHtcbiAgICAgICAgICByZWxhdGVkLmxhYmVsID0gcmVsYXRlZE9iamVjdC5sYWJlbDtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3QucHVzaChyZWxhdGVkKTtcbiAgICB9KTtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKTtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgdW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdE9iamVjdHMsIGZ1bmN0aW9uKHYsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWY7XG4gICAgICBpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMTtcbiAgICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgICAgaWYgKGlzQWN0aXZlICYmIGFsbG93UmVhZCkge1xuICAgICAgICByZXR1cm4gbGlzdC5wdXNoKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBsaXN0O1xuICB9O1xufVxuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpO1xufTtcblxuXG4vKiBcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpIHtcbiAgdmFyIGxpc3RWaWV3cywgbGlzdF92aWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIGlmICghKGxpc3RWaWV3cyAhPSBudWxsID8gbGlzdFZpZXdzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdF92aWV3ID0gXy5maW5kV2hlcmUobGlzdFZpZXdzLCB7XG4gICAgXCJfaWRcIjogbGlzdF92aWV3X2lkXG4gIH0pO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIGlmIChleGFjKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxpc3Rfdmlldztcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIGxpc3RWaWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiBsaXN0X3ZpZXdfaWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cywge1xuICAgICAgX2lkOiBsaXN0X3ZpZXdfaWRcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0VmlldyA9IGxpc3Rfdmlld19pZDtcbiAgfVxuICByZXR1cm4gKGxpc3RWaWV3ICE9IG51bGwgPyBsaXN0Vmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDku45jb2x1bW5z5Y+C5pWw5Lit6L+H5ruk5Ye655So5LqO5omL5py656uv5pi+56S655qEY29sdW1uc1xuXHTop4TliJnvvJpcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxuXHQyLuacgOWkmuWPqui/lOWbnjTkuKrlrZfmrrVcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcbiAqL1xuXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIGNvdW50LCBmaWVsZCwgZmllbGRzLCBnZXRGaWVsZCwgaXNOYW1lQ29sdW1uLCBpdGVtQ291bnQsIG1heENvdW50LCBtYXhSb3dzLCBuYW1lQ29sdW1uLCBuYW1lS2V5LCBvYmplY3QsIHJlc3VsdDtcbiAgcmVzdWx0ID0gW107XG4gIG1heFJvd3MgPSAyO1xuICBtYXhDb3VudCA9IG1heFJvd3MgKiAyO1xuICBjb3VudCA9IDA7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gb2JqZWN0LmZpZWxkcztcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuICBuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICBpc05hbWVDb2x1bW4gPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHJldHVybiBpdGVtLmZpZWxkID09PSBuYW1lS2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXRlbSA9PT0gbmFtZUtleTtcbiAgICB9XG4gIH07XG4gIGdldEZpZWxkID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW0uZmllbGRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW1dO1xuICAgIH1cbiAgfTtcbiAgaWYgKG5hbWVLZXkpIHtcbiAgICBuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKG5hbWVDb2x1bW4pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pO1xuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgcmVzdWx0LnB1c2gobmFtZUNvbHVtbik7XG4gIH1cbiAgY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKGl0ZW0pO1xuICAgIGlmICghZmllbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbUNvdW50ID0gZmllbGQuaXNfd2lkZSA/IDIgOiAxO1xuICAgIGlmIChjb3VudCA8IG1heENvdW50ICYmIHJlc3VsdC5sZW5ndGggPCBtYXhDb3VudCAmJiAhaXNOYW1lQ29sdW1uKGl0ZW0pKSB7XG4gICAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgICBpZiAoY291bnQgPD0gbWF4Q291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0Vmlldywgb2JqZWN0LCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICB9XG4gIGlmIChvYmplY3QgIT0gbnVsbCA/IChyZWYgPSBvYmplY3QubGlzdF92aWV3cykgIT0gbnVsbCA/IHJlZltcImRlZmF1bHRcIl0gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICBkZWZhdWx0VmlldyA9IG9iamVjdC5saXN0X3ZpZXdzW1wiZGVmYXVsdFwiXTtcbiAgfSBlbHNlIHtcbiAgICBfLmVhY2gob2JqZWN0ICE9IG51bGwgPyBvYmplY3QubGlzdF92aWV3cyA6IHZvaWQgMCwgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcbiAgICAgIGlmIChsaXN0X3ZpZXcubmFtZSA9PT0gXCJhbGxcIiB8fCBrZXkgPT09IFwiYWxsXCIpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBkZWZhdWx0Vmlldztcbn07XG5cblxuLypcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucykge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKHVzZV9tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDApIHtcbiAgICAgIGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucztcbiAgICB9IGVsc2UgaWYgKGNvbHVtbnMpIHtcbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbHVtbnM7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5leHRyYV9jb2x1bW5zIDogdm9pZCAwO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBpZiAoZGVmYXVsdFZpZXcpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcuc29ydCkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3LnNvcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc0FsbFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJhbGxcIjtcbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuICovXG5cbkNyZWF0b3IuaXNSZWNlbnRWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSBmdW5jdGlvbihzb3J0LCB0YWJ1bGFyQ29sdW1ucykge1xuICB2YXIgdGFidWxhcl9zb3J0O1xuICB0YWJ1bGFyX3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgY29sdW1uX2luZGV4LCBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBpZiAoaXRlbS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpdGVtLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgaXRlbVsxXV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihmaWVsZF9uYW1lKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIG9yZGVyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFidWxhcl9zb3J0O1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9EWCA9IGZ1bmN0aW9uKHNvcnQpIHtcbiAgdmFyIGR4X3NvcnQ7XG4gIGR4X3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChpdGVtKTtcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICByZXR1cm4gZHhfc29ydC5wdXNoKFtmaWVsZF9uYW1lLCBvcmRlcl0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkeF9zb3J0O1xufTtcbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJylcclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdE1ldGVvci5zdGFydHVwICgpLT5cclxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxyXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIn1cclxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XHJcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcclxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJylcclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdE1ldGVvci5zdGFydHVwICgpLT5cclxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxyXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIn1cclxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XHJcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcclxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIi8vIOWboOS4um1ldGVvcue8luivkWNvZmZlZXNjcmlwdOS8muWvvOiHtGV2YWzlh73mlbDmiqXplJnvvIzmiYDku6XljZXni6zlhpnlnKjkuIDkuKpqc+aWh+S7tuS4reOAglxyXG5DcmVhdG9yLmV2YWxJbkNvbnRleHQgPSBmdW5jdGlvbihqcywgY29udGV4dCkge1xyXG4gICAgLy8jIFJldHVybiB0aGUgcmVzdWx0cyBvZiB0aGUgaW4tbGluZSBhbm9ueW1vdXMgZnVuY3Rpb24gd2UgLmNhbGwgd2l0aCB0aGUgcGFzc2VkIGNvbnRleHRcclxuICAgIHJldHVybiBmdW5jdGlvbigpIHsgXHJcbiAgICBcdHJldHVybiBldmFsKGpzKTsgXHJcblx0fS5jYWxsKGNvbnRleHQpO1xyXG59XHJcblxyXG5cclxuQ3JlYXRvci5ldmFsID0gZnVuY3Rpb24oanMpe1xyXG5cdHRyeXtcclxuXHRcdHJldHVybiBldmFsKGpzKVxyXG5cdH1jYXRjaCAoZSl7XHJcblx0XHRjb25zb2xlLmVycm9yKGUsIGpzKTtcclxuXHR9XHJcbn07IiwiXHRnZXRPcHRpb24gPSAob3B0aW9uKS0+XHJcblx0XHRmb28gPSBvcHRpb24uc3BsaXQoXCI6XCIpXHJcblx0XHRpZiBmb28ubGVuZ3RoID4gMVxyXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV19XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1swXX1cclxuXHJcblx0Y29udmVydEZpZWxkID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCktPlxyXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xyXG5cdFx0XHRjb2RlID0gZmllbGQucGlja2xpc3QgfHwgXCIje29iamVjdF9uYW1lfS4je2ZpZWxkX25hbWV9XCI7XHJcblx0XHRcdGlmIGNvZGVcclxuXHRcdFx0XHRwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0aWYgcGlja2xpc3RcclxuXHRcdFx0XHRcdG9wdGlvbnMgPSBbXTtcclxuXHRcdFx0XHRcdGFsbE9wdGlvbnMgPSBbXTtcclxuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KVxyXG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpPy5yZXZlcnNlKCk7XHJcblx0XHRcdFx0XHRfLmVhY2ggcGlja2xpc3RPcHRpb25zLCAoaXRlbSktPlxyXG5cdFx0XHRcdFx0XHRsYWJlbCA9IGl0ZW0ubmFtZVxyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdGFsbE9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGVuYWJsZTogaXRlbS5lbmFibGV9KVxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVuYWJsZVxyXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWV9KVxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmRlZmF1bHRcclxuXHRcdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZVxyXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBvcHRpb25zXHJcblx0XHRcdFx0XHRpZiBhbGxPcHRpb25zLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0ZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnNcclxuXHRcdHJldHVybiBmaWVsZDtcclxuXHJcblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gKG9iamVjdCwgc3BhY2VJZCktPlxyXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxyXG5cclxuXHRcdFx0aWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiKVxyXG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXI/Ll90b2RvXHJcblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcclxuXHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxyXG5cdFx0XHRcdFx0I+WPquaciXVwZGF0ZeaXtu+8jCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyDmiY3mnInlgLxcclxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj++8jOWwpOWFtuaYr0NvbGxlY3Rpb25cclxuXHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXsje190b2RvX2Zyb21fZGJ9fSlcIilcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCJcclxuXHRcdFx0XHRfdG9kbyA9IHRyaWdnZXIudG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcclxuXHRcdFx0XHRcdHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpXHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XHJcblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uPy5fdG9kb1xyXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSBhY3Rpb24/LnRvZG9cclxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlXHJcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxyXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24oKXsje190b2RvX2Zyb21fZGJ9fSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3JcclxuXHJcblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/Ll92aXNpYmxlXHJcblx0XHRcdFx0aWYgX3Zpc2libGVcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRhY3Rpb24udmlzaWJsZSA9IENyZWF0b3IuZXZhbChcIigje192aXNpYmxlfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxyXG5cdFx0XHRcdF90b2RvID0gYWN0aW9uPy50b2RvXHJcblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxyXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXHJcblx0XHRcdFx0XHRhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpXHJcblxyXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy52aXNpYmxlXHJcblxyXG5cdFx0XHRcdGlmIF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSlcclxuXHRcdFx0XHRcdGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKClcclxuXHJcblx0XHRfLmZvckVhY2ggb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBrZXkpLT5cclxuXHJcblx0XHRcdGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcclxuXHJcblx0XHRcdGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKVxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdFx0I+aUr+aMgVxcbuaIluiAheiLseaWh+mAl+WPt+WIhuWJsixcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdGlmIG9wdGlvbi5pbmRleE9mKFwiLFwiKVxyXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpXHJcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSlcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXHJcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcclxuXHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcclxuXHJcblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiAhXy5pc0Z1bmN0aW9uKGZpZWxkLm9wdGlvbnMpICYmICFfLmlzQXJyYXkoZmllbGQub3B0aW9ucykgJiYgXy5pc09iamVjdChmaWVsZC5vcHRpb25zKVxyXG5cdFx0XHRcdF9vcHRpb25zID0gW11cclxuXHRcdFx0XHRfLmVhY2ggZmllbGQub3B0aW9ucywgKHYsIGspLT5cclxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiB2LCB2YWx1ZToga31cclxuXHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXHJcblx0XHRcdFx0aWYgb3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucylcclxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRvcHRpb25zID0gZmllbGQuX29wdGlvbnNcclxuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucylcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gQ3JlYXRvci5ldmFsKFwiKCN7b3B0aW9uc30pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLnJlZ0V4XHJcblx0XHRcdFx0aWYgcmVnRXhcclxuXHRcdFx0XHRcdGZpZWxkLl9yZWdFeCA9IGZpZWxkLnJlZ0V4LnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQuX3JlZ0V4XHJcblx0XHRcdFx0aWYgcmVnRXhcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5yZWdFeCA9IENyZWF0b3IuZXZhbChcIigje3JlZ0V4fSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdG1pbiA9IGZpZWxkLm1pblxyXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtaW4pXHJcblx0XHRcdFx0XHRmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG1pbiA9IGZpZWxkLl9taW5cclxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKG1pbilcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5taW4gPSBDcmVhdG9yLmV2YWwoXCIoI3ttaW59KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0bWF4ID0gZmllbGQubWF4XHJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKG1heClcclxuXHRcdFx0XHRcdGZpZWxkLl9tYXggPSBtYXgudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0bWF4ID0gZmllbGQuX21heFxyXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWF4KVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLm1heCA9IENyZWF0b3IuZXZhbChcIigje21heH0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxyXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS50eXBlXHJcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9IE9iamVjdCAmJiBfdHlwZSAhPSBTdHJpbmcgJiYgX3R5cGUgIT0gTnVtYmVyICYmIF90eXBlICE9IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSlcclxuXHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxyXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZVxyXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSlcclxuXHRcdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3IuZXZhbChcIigje190eXBlfSlcIilcclxuXHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBmaWVsZCAtPiB0eXBlIGVycm9yXCIsIGZpZWxkLCBlcnJvclxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblxyXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxyXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xyXG5cdFx0XHRcdGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cclxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb25cclxuXHJcblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2NyZWF0ZUZ1bmN0aW9uID0gY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKVxyXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpXHJcblxyXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyc0Z1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHJcblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb25cclxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb25cclxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uXHJcblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvblxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zRnVuY3Rpb259KVwiKVxyXG5cclxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWZlcmVuY2VfdG99KVwiKVxyXG5cclxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tjcmVhdGVGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2JlZm9yZU9wZW5GdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlcnNGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0XHRcdGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZVxyXG5cclxuXHRcdFx0XHRpZiAhZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHJcblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2RlZmF1bHRWYWx1ZX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblx0XHRcdFxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRpZiBpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZClcclxuXHRcdFx0XHRcdGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZClcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yLmV2YWwoXCIoI3tpc19jb21wYW55X2xpbWl0ZWR9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdF8uZm9yRWFjaCBvYmplY3QubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KSAtPlxyXG5cdFx0XHQjIyNcclxuXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXHJcblx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXHJcblx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcclxuXHRcdFx05aaC77yaXHJcblx0XHRcdGZpbHRlcnM6ICgpLT5cclxuXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxyXG5cdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cclxuXHRcdFx05aaC77yaXHJcblx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxyXG5cdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcclxuXHRcdFx0XV1cclxuXHRcdFx05oiWXHJcblx0XHRcdGZpbHRlcnM6IFt7XHJcblx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcclxuXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxyXG5cdFx0XHRcdFwidmFsdWVcIjogKCktPlxyXG5cdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxyXG5cdFx0XHR9XVxyXG5cdFx0XHQjIyNcclxuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKVxyXG5cdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0bGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKVxyXG5cdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0bGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tsaXN0X3ZpZXcuX2ZpbHRlcnN9KVwiKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Xy5mb3JFYWNoIGxpc3Rfdmlldy5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cclxuXHRcdFx0XHRcdGlmIF8uaXNBcnJheShmaWx0ZXIpXHJcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCJcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0RhdGUoZmlsdGVyWzJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzmmK9EYXRl57G75Z6L77yM5YiZZmlsdGVyWzJd5YC85Yiw5YmN56uv5Lya6Ieq5Yqo6L2s5oiQ5a2X56ym5Liy77yM5qC85byP77yaXCIyMDE4LTAzLTI5VDAzOjQzOjIxLjc4N1pcIlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDljIXmi6xncmlk5YiX6KGo6K+35rGC55qE5o6l5Y+j5Zyo5YaF55qE5omA5pyJT0RhdGHmjqXlj6PvvIxEYXRl57G75Z6L5a2X5q616YO95Lya5Lul5LiK6L+w5qC85byP6L+U5ZueXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkRBVEVcIlxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkZVTkNUSU9OXCJcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlclsyXX0pXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiREFURVwiXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcclxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc09iamVjdChmaWx0ZXIpXHJcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRGF0ZShmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl9pc19kYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLl9pc19kYXRlID09IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSlcclxuXHJcblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0aWYgb2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pXHJcblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XHJcblx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24odmFsKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsICsgJyc7XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XHJcblx0XHRlbHNlIGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRpZiBvYmplY3QuZm9ybVxyXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XHJcblx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJylcclxuXHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxyXG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXHJcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxyXG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKVxyXG5cdFx0XHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXHJcblx0XHRlbHNlXHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxyXG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXHJcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxyXG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpXHJcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXHJcblxyXG5cdFx0cmV0dXJuIG9iamVjdFxyXG5cclxuXHJcbiIsInZhciBjb252ZXJ0RmllbGQsIGdldE9wdGlvbjtcblxuZ2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIHZhciBmb287XG4gIGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIik7XG4gIGlmIChmb28ubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1sxXVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzBdXG4gICAgfTtcbiAgfVxufTtcblxuY29udmVydEZpZWxkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkLCBzcGFjZUlkKSB7XG4gIHZhciBhbGxPcHRpb25zLCBjb2RlLCBvcHRpb25zLCBwaWNrbGlzdCwgcGlja2xpc3RPcHRpb25zLCByZWY7XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgc3BhY2VJZCAmJiBmaWVsZC50eXBlID09PSAnc2VsZWN0Jykge1xuICAgIGNvZGUgPSBmaWVsZC5waWNrbGlzdCB8fCAob2JqZWN0X25hbWUgKyBcIi5cIiArIGZpZWxkX25hbWUpO1xuICAgIGlmIChjb2RlKSB7XG4gICAgICBwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XG4gICAgICBpZiAocGlja2xpc3QpIHtcbiAgICAgICAgb3B0aW9ucyA9IFtdO1xuICAgICAgICBhbGxPcHRpb25zID0gW107XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KTtcbiAgICAgICAgcGlja2xpc3RPcHRpb25zID0gKHJlZiA9IF8uc29ydEJ5KHBpY2tsaXN0T3B0aW9ucywgJ3NvcnRfbm8nKSkgIT0gbnVsbCA/IHJlZi5yZXZlcnNlKCkgOiB2b2lkIDA7XG4gICAgICAgIF8uZWFjaChwaWNrbGlzdE9wdGlvbnMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICB2YXIgbGFiZWwsIHZhbHVlO1xuICAgICAgICAgIGxhYmVsID0gaXRlbS5uYW1lO1xuICAgICAgICAgIHZhbHVlID0gaXRlbS52YWx1ZSB8fCBpdGVtLm5hbWU7XG4gICAgICAgICAgYWxsT3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGVuYWJsZTogaXRlbS5lbmFibGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXRlbS5lbmFibGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW1bXCJkZWZhdWx0XCJdKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbGxPcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5hbGxPcHRpb25zID0gYWxsT3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmllbGQ7XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRPYmplY3QgPSBmdW5jdGlvbihvYmplY3QsIHNwYWNlSWQpIHtcbiAgXy5mb3JFYWNoKG9iamVjdC50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwga2V5KSB7XG4gICAgdmFyIF90b2RvLCBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGI7XG4gICAgaWYgKChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSkge1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gdHJpZ2dlciAhPSBudWxsID8gdHJpZ2dlci5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpIHtcbiAgICAgIF90b2RvID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbykpIHtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiLCBfdmlzaWJsZSwgZXJyb3I7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKSkge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKCl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl92aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdmlzaWJsZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG8sIF92aXNpYmxlO1xuICAgICAgX3RvZG8gPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbykpIHtcbiAgICAgICAgYWN0aW9uLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24uX3Zpc2libGUgPSBfdmlzaWJsZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgdmFyIF9vcHRpb25zLCBfdHlwZSwgYmVmb3JlT3BlbkZ1bmN0aW9uLCBjcmVhdGVGdW5jdGlvbiwgZGVmYXVsdFZhbHVlLCBlcnJvciwgZmlsdGVyc0Z1bmN0aW9uLCBpc19jb21wYW55X2xpbWl0ZWQsIG1heCwgbWluLCBvcHRpb25zLCBvcHRpb25zRnVuY3Rpb24sIHJlZmVyZW5jZV90bywgcmVnRXg7XG4gICAgZmllbGQgPSBjb252ZXJ0RmllbGQob2JqZWN0Lm5hbWUsIGtleSwgZmllbGQsIHNwYWNlSWQpO1xuICAgIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNTdHJpbmcoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgICBpZiAob3B0aW9uLmluZGV4T2YoXCIsXCIpKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIHJldHVybiBfLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24oX29wdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1pbiA9IGZpZWxkLm1pbjtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWluKSkge1xuICAgICAgICBmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pbiA9IGZpZWxkLl9taW47XG4gICAgICBpZiAoXy5pc1N0cmluZyhtaW4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWluID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtaW4gKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtYXggPSBmaWVsZC5tYXg7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1heCkpIHtcbiAgICAgICAgZmllbGQuX21heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXggPSBmaWVsZC5fbWF4O1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWF4KSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1heCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWF4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT09IE9iamVjdCAmJiBfdHlwZSAhPT0gU3RyaW5nICYmIF90eXBlICE9PSBOdW1iZXIgJiYgX3R5cGUgIT09IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSkpIHtcbiAgICAgICAgICBmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdHlwZSArIFwiKVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQub3B0aW9uc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHJlZmVyZW5jZV90byArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgY3JlYXRlRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGJlZm9yZU9wZW5GdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZTtcbiAgICAgIGlmICghZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBkZWZhdWx0VmFsdWUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICBpZiAoaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNGdW5jdGlvbihpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHJldHVybiBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICBpZiAoaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGlzX2NvbXBhbnlfbGltaXRlZCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIF8uZm9yRWFjaChvYmplY3QubGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcblxuICAgIC8qXG4gICAgXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXG4gICAgXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcbiAgICBcdFx0XHQxLiDmlbTkuKpmaWx0ZXJz5Li6ZnVuY3Rpb246XG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFtbW1wib2JqZWN0X25hbWVcIixcIj1cIixcInByb2plY3RfaXNzdWVzXCJdLCdvcicsW1wib2JqZWN0X25hbWVcIixcIj1cIixcInRhc2tzXCJdXV1cbiAgICBcdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiBbW1wib2JqZWN0X25hbWVcIiwgXCI9XCIsICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHRdXVxuICAgIFx0XHRcdOaIllxuICAgIFx0XHRcdGZpbHRlcnM6IFt7XG4gICAgXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxuICAgIFx0XHRcdFx0XCJvcGVyYXRpb25cIjogXCI9XCJcbiAgICBcdFx0XHRcdFwidmFsdWVcIjogKCktPlxuICAgIFx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0fV1cbiAgICAgKi9cbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGxpc3Rfdmlldy5fZmlsdGVycyArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF8uZm9yRWFjaChsaXN0X3ZpZXcuZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICAgICAgaWYgKF8uaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDMgJiYgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbHRlci5sZW5ndGggPT09IDMgJiYgXy5pc0RhdGUoZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJEQVRFXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiRlVOQ1RJT05cIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlclsyXSArIFwiKVwiKTtcbiAgICAgICAgICAgICAgZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJEQVRFXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gbmV3IERhdGUoZmlsdGVyWzJdKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0RhdGUoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5fdmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbHRlci5faXNfZGF0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gbmV3IERhdGUoZmlsdGVyLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pKSB7XG4gICAgICBvYmplY3QuZm9ybSA9IEpTT04uc3RyaW5naWZ5KG9iamVjdC5mb3JtLCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsICsgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChvYmplY3QuZm9ybSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlKG9iamVjdC5mb3JtLCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyh2YWwpICYmIHZhbC5zdGFydHNXaXRoKCdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkTGlzdCwgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImZpbHRlcnNfY29kZVwiLCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkTGlzdCwgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9XHJcblxyXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiXHJcblxyXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IChwcmVmaXgsZmllbGRWYXJpYWJsZSktPlxyXG5cdHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xyXG5cclxuXHRyZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UgcmVnLCAobSwgJDEpLT5cclxuXHRcdHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLyxcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZyxcIlxcXCJdW1xcXCJcIik7XHJcblxyXG5cdHJldHVybiByZXZcclxuXHJcbkNyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhID0gKGZvcm11bGFfc3RyKS0+XHJcblx0aWYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdHJldHVybiBmYWxzZVxyXG5cclxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSAoZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKS0+XHJcblx0aWYgZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cilcclxuXHJcblx0XHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucz8uZXh0ZW5kKVxyXG5cdFx0XHRleHRlbmQgPSB0cnVlXHJcblxyXG5cdFx0X1ZBTFVFUyA9IHt9XHJcblx0XHRfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpXHJcblx0XHRpZiBleHRlbmRcclxuXHRcdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucz8udXNlcklkLCBvcHRpb25zPy5zcGFjZUlkKSlcclxuXHRcdGZvcm11bGFfc3RyID0gQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEoXCJ0aGlzXCIsIGZvcm11bGFfc3RyKVxyXG5cclxuXHRcdHRyeVxyXG5cdFx0XHRkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKSAgICMg5q2k5aSE5LiN6IO955Sod2luZG93LmV2YWwg77yM5Lya5a+86Ie05Y+Y6YeP5L2c55So5Z+f5byC5bi4XHJcblx0XHRcdHJldHVybiBkYXRhXHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogI3tmb3JtdWxhX3N0cn1cIiwgZSlcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0dG9hc3RyPy5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogI3tmb3JtdWxhX3N0cn0je2V9XCJcclxuXHJcblx0cmV0dXJuIGZvcm11bGFfc3RyXHJcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fTtcblxuQ3JlYXRvci5Gb3JtdWxhci5QUkVGSVggPSBcIl9WQUxVRVNcIjtcblxuQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEgPSBmdW5jdGlvbihwcmVmaXgsIGZpZWxkVmFyaWFibGUpIHtcbiAgdmFyIHJlZywgcmV2O1xuICByZWcgPSAvKFxce1tee31dKlxcfSkvZztcbiAgcmV2ID0gZmllbGRWYXJpYWJsZS5yZXBsYWNlKHJlZywgZnVuY3Rpb24obSwgJDEpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJDEucmVwbGFjZSgvXFx7XFxzKi8sIFwiW1xcXCJcIikucmVwbGFjZSgvXFxzKlxcfS8sIFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZywgXCJcXFwiXVtcXFwiXCIpO1xuICB9KTtcbiAgcmV0dXJuIHJldjtcbn07XG5cbkNyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYV9zdHIpIHtcbiAgaWYgKF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ7XCIpID4gLTEgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIn1cIikgPiAtMSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuRm9ybXVsYXIucnVuID0gZnVuY3Rpb24oZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKSB7XG4gIHZhciBfVkFMVUVTLCBkYXRhLCBlLCBleHRlbmQ7XG4gIGlmIChmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSkge1xuICAgIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5leHRlbmQgOiB2b2lkIDApKSB7XG4gICAgICBleHRlbmQgPSB0cnVlO1xuICAgIH1cbiAgICBfVkFMVUVTID0ge307XG4gICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKTtcbiAgICBpZiAoZXh0ZW5kKSB7XG4gICAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgQ3JlYXRvci5nZXRVc2VyQ29udGV4dChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnVzZXJJZCA6IHZvaWQgMCwgb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zcGFjZUlkIDogdm9pZCAwKSk7XG4gICAgfVxuICAgIGZvcm11bGFfc3RyID0gQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEoXCJ0aGlzXCIsIGZvcm11bGFfc3RyKTtcbiAgICB0cnkge1xuICAgICAgZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUyk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyLCBlKTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0b2FzdHIgIT09IFwidW5kZWZpbmVkXCIgJiYgdG9hc3RyICE9PSBudWxsKSB7XG4gICAgICAgICAgdG9hc3RyLmVycm9yKFwi5YWs5byP5omn6KGM5Ye66ZSZ5LqG77yM6K+35qOA5p+l5YWs5byP6YWN572u5piv5ZCm5q2j56Gu77yBXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciArIGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZm9ybXVsYV9zdHI7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xyXG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fSAgICMg5q2k5a+56LGh5Y+q6IO95Zyo56Gu5L+d5omA5pyJT2JqZWN05Yid5aeL5YyW5a6M5oiQ5ZCO6LCD55So77yMIOWQpuWImeiOt+WPluWIsOeahG9iamVjdOS4jeWFqFxyXG5cclxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gKG9iamVjdF9uYW1lKS0+XHJcblx0aWYgb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpXHJcblx0XHRvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpXHJcblx0cmV0dXJuIG9iamVjdF9uYW1lXHJcblxyXG5DcmVhdG9yLk9iamVjdCA9IChvcHRpb25zKS0+XHJcblx0c2VsZiA9IHRoaXNcclxuXHRpZiAoIW9wdGlvbnMubmFtZSlcclxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcclxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xyXG5cclxuXHRzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZVxyXG5cdHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlXHJcblx0c2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lXHJcblx0c2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWxcclxuXHRzZWxmLmljb24gPSBvcHRpb25zLmljb25cclxuXHRzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvblxyXG5cdHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlld1xyXG5cdHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybVxyXG5cdGlmICFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09IHRydWVcclxuXHRcdHNlbGYuaXNfZW5hYmxlID0gdHJ1ZVxyXG5cdGVsc2VcclxuXHRcdHNlbGYuaXNfZW5hYmxlID0gZmFsc2VcclxuXHRzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2hcclxuXHRzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzXHJcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xyXG5cdHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXNcclxuXHRzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0XHJcblx0aWYgb3B0aW9ucy5wYWdpbmdcclxuXHRcdHNlbGYucGFnaW5nID0gb3B0aW9ucy5wYWdpbmdcclxuXHRzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuXHJcblx0c2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PSB1bmRlZmluZWQpIG9yIG9wdGlvbnMuZW5hYmxlX2FwaVxyXG5cdHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b21cclxuXHRzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlXHJcblx0c2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcclxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlXHJcblx0XHRlbHNlXHJcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXHJcblx0XHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxyXG5cdGVsc2VcclxuXHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxyXG5cdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcclxuXHRzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvd1xyXG5cdHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55XHJcblx0c2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcilcclxuXHRzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlclxyXG5cdHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2hcclxuXHRzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWxcclxuXHRzZWxmLmVuYWJsZV9hcHByb3ZhbHMgPSBvcHRpb25zLmVuYWJsZV9hcHByb3ZhbHNcclxuXHRzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3dcclxuXHRzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93XHJcblx0aWYgXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50JylcclxuXHRcdHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50XHJcblx0c2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnXHJcblx0aWYgb3B0aW9ucy5kYXRhYmFzZV9uYW1lXHJcblx0XHRzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWVcclxuXHRpZiAoIW9wdGlvbnMuZmllbGRzKVxyXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XHJcblxyXG5cdHNlbGYuZmllbGRzID0gY2xvbmUob3B0aW9ucy5maWVsZHMpXHJcblxyXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRpZiBmaWVsZF9uYW1lID09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lXHJcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXHJcblx0XHRpZiBmaWVsZC5wcmltYXJ5XHJcblx0XHRcdHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXHJcblx0XHRcdFx0aWYgZmllbGRfbmFtZSA9PSAnc3BhY2UnXHJcblx0XHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gZmFsc2VcclxuXHJcblx0aWYgIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcclxuXHRcdF8uZWFjaCBDcmVhdG9yLmJhc2VPYmplY3QuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdFx0aWYgIXNlbGYuZmllbGRzW2ZpZWxkX25hbWVdXHJcblx0XHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fVxyXG5cdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSlcclxuXHJcblx0c2VsZi5saXN0X3ZpZXdzID0ge31cclxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcoc2VsZi5uYW1lKVxyXG5cdF8uZWFjaCBvcHRpb25zLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdG9pdGVtID0gQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcoZGVmYXVsdFZpZXcsIGl0ZW0sIGl0ZW1fbmFtZSlcclxuXHRcdHNlbGYubGlzdF92aWV3c1tpdGVtX25hbWVdID0gb2l0ZW1cclxuXHJcblx0c2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoQ3JlYXRvci5iYXNlT2JqZWN0LnRyaWdnZXJzKVxyXG5cdF8uZWFjaCBvcHRpb25zLnRyaWdnZXJzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpZiAhc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdXHJcblx0XHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9XHJcblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZVxyXG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pLCBpdGVtKVxyXG5cclxuXHRzZWxmLmFjdGlvbnMgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zKVxyXG5cdF8uZWFjaCBvcHRpb25zLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdGlmICFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXVxyXG5cdFx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9XHJcblx0XHRjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pXHJcblx0XHRkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gI+WFiOWIoOmZpOebuOWFs+WxnuaAp+WGjemHjeW7uuaJjeiDveS/neivgeWQjue7remHjeWkjeWumuS5ieeahOWxnuaAp+mhuuW6j+eUn+aViFxyXG5cdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSlcclxuXHJcblx0Xy5lYWNoIHNlbGYuYWN0aW9ucywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdFx0aXRlbS5uYW1lID0gaXRlbV9uYW1lXHJcblxyXG5cdHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpXHJcblxyXG5cdCMg6K6p5omA5pyJb2JqZWN06buY6K6k5pyJ5omA5pyJbGlzdF92aWV3cy9hY3Rpb25zL3JlbGF0ZWRfb2JqZWN0cy9yZWFkYWJsZV9maWVsZHMvZWRpdGFibGVfZmllbGRz5a6M5pW05p2D6ZmQ77yM6K+l5p2D6ZmQ5Y+v6IO96KKr5pWw5o2u5bqT5Lit6K6+572u55qEYWRtaW4vdXNlcuadg+mZkOimhuebllxyXG5cdHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldClcclxuXHQjIGRlZmF1bHRMaXN0Vmlld3MgPSBfLmtleXMoc2VsZi5saXN0X3ZpZXdzKVxyXG5cdCMgZGVmYXVsdEFjdGlvbnMgPSBfLmtleXMoc2VsZi5hY3Rpb25zKVxyXG5cdCMgZGVmYXVsdFJlbGF0ZWRPYmplY3RzID0gXy5wbHVjayhzZWxmLnJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXHJcblx0IyBkZWZhdWx0UmVhZGFibGVGaWVsZHMgPSBbXVxyXG5cdCMgZGVmYXVsdEVkaXRhYmxlRmllbGRzID0gW11cclxuXHQjIF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0IyBcdGlmICEoZmllbGQuaGlkZGVuKSAgICAjMjMxIG9taXTlrZfmrrXmlK/mjIHlnKjpnZ7nvJbovpHpobXpnaLmn6XnnIssIOWboOatpOWIoOmZpOS6huatpOWkhOWvuW9taXTnmoTliKTmlq1cclxuXHQjIFx0XHRkZWZhdWx0UmVhZGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXHJcblx0IyBcdFx0aWYgIWZpZWxkLnJlYWRvbmx5XHJcblx0IyBcdFx0XHRkZWZhdWx0RWRpdGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXHJcblxyXG5cdCMgXy5lYWNoIHNlbGYucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHQjIFx0aWYgaXRlbV9uYW1lID09IFwibm9uZVwiXHJcblx0IyBcdFx0cmV0dXJuXHJcblx0IyBcdGlmIHNlbGYubGlzdF92aWV3c1xyXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5saXN0X3ZpZXdzID0gZGVmYXVsdExpc3RWaWV3c1xyXG5cdCMgXHRpZiBzZWxmLmFjdGlvbnNcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uYWN0aW9ucyA9IGRlZmF1bHRBY3Rpb25zXHJcblx0IyBcdGlmIHNlbGYucmVsYXRlZF9vYmplY3RzXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLnJlbGF0ZWRfb2JqZWN0cyA9IGRlZmF1bHRSZWxhdGVkT2JqZWN0c1xyXG5cdCMgXHRpZiBzZWxmLmZpZWxkc1xyXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWFkYWJsZV9maWVsZHMgPSBkZWZhdWx0UmVhZGFibGVGaWVsZHNcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uZWRpdGFibGVfZmllbGRzID0gZGVmYXVsdEVkaXRhYmxlRmllbGRzXHJcblx0dW5sZXNzIG9wdGlvbnMucGVybWlzc2lvbl9zZXRcclxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fVxyXG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8uYWRtaW4pXHJcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pXHJcblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py51c2VyKVxyXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC51c2VyID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1widXNlclwiXSlcclxuXHRfLmVhY2ggb3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdFx0aWYgIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXVxyXG5cdFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSB7fVxyXG5cdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKVxyXG5cclxuXHQjIOWJjeerr+agueaNrnBlcm1pc3Npb25z5pS55YaZZmllbGTnm7jlhbPlsZ7mgKfvvIzlkI7nq6/lj6ropoHotbDpu5jorqTlsZ7mgKflsLHooYzvvIzkuI3pnIDopoHmlLnlhplcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9uc1xyXG5cdFx0ZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zPy5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRpZiBkaXNhYmxlZF9saXN0X3ZpZXdzPy5sZW5ndGhcclxuXHRcdFx0ZGVmYXVsdExpc3RWaWV3SWQgPSBvcHRpb25zLmxpc3Rfdmlld3M/LmFsbD8uX2lkXHJcblx0XHRcdGlmIGRlZmF1bHRMaXN0Vmlld0lkXHJcblx0XHRcdFx0IyDmiorop4blm77mnYPpmZDphY3nva7kuK3pu5jorqTnmoRhbGzop4blm75pZOi9rOaNouaIkGFsbOWFs+mUruWtl1xyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcCBkaXNhYmxlZF9saXN0X3ZpZXdzLCAobGlzdF92aWV3X2l0ZW0pIC0+XHJcblx0XHRcdFx0XHRyZXR1cm4gaWYgZGVmYXVsdExpc3RWaWV3SWQgPT0gbGlzdF92aWV3X2l0ZW0gdGhlbiBcImFsbFwiIGVsc2UgbGlzdF92aWV3X2l0ZW1cclxuXHRcdHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpXHJcbiNcdFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuI1x0XHRcdGlmIGZpZWxkXHJcbiNcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5yZWFkYWJsZV9maWVsZHMsIGZpZWxkX25hbWUpIDwgMFxyXG4jXHRcdFx0XHRcdGlmIGZpZWxkLmhpZGRlblxyXG4jXHRcdFx0XHRcdFx0cmV0dXJuXHJcbiNcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bmVkaXRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPiAtMVxyXG4jXHRcdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXHJcbiNcdFx0XHRcdFx0XHRmaWVsZC5kaXNhYmxlZCA9IHRydWVcclxuI1x0XHRcdFx0XHRcdCMg5b2T5Y+q6K+75pe277yM5aaC5p6c5LiN5Y675o6J5b+F5aGr5a2X5q6177yMYXV0b2Zvcm3mmK/kvJrmiqXplJnnmoRcclxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlcXVpcmVkID0gZmFsc2VcclxuI1x0XHRcdFx0ZWxzZVxyXG4jXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IHRydWVcclxuXHRlbHNlXHJcblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbnVsbFxyXG5cclxuXHRfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucylcclxuXHJcblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiXHJcblxyXG5cdHNlbGYuZGIgPSBfZGJcclxuXHJcblx0c2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lXHJcblxyXG5cdHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpXHJcblx0c2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSlcclxuXHRpZiBzZWxmLm5hbWUgIT0gXCJ1c2Vyc1wiIGFuZCBzZWxmLm5hbWUgIT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSlcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXHJcblx0XHRlbHNlXHJcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcclxuXHRpZiBzZWxmLm5hbWUgPT0gXCJ1c2Vyc1wiXHJcblx0XHRfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hXHJcblxyXG5cdGlmIF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSlcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXHJcblxyXG5cdENyZWF0b3Iub2JqZWN0c0J5TmFtZVtzZWxmLl9jb2xsZWN0aW9uX25hbWVdID0gc2VsZlxyXG5cclxuXHRyZXR1cm4gc2VsZlxyXG5cclxuIyBDcmVhdG9yLk9iamVjdC5wcm90b3R5cGUuaTE4biA9ICgpLT5cclxuIyBcdCMgc2V0IG9iamVjdCBsYWJlbFxyXG4jIFx0c2VsZiA9IHRoaXNcclxuXHJcbiMgXHRrZXkgPSBzZWxmLm5hbWVcclxuIyBcdGlmIHQoa2V5KSA9PSBrZXlcclxuIyBcdFx0aWYgIXNlbGYubGFiZWxcclxuIyBcdFx0XHRzZWxmLmxhYmVsID0gc2VsZi5uYW1lXHJcbiMgXHRlbHNlXHJcbiMgXHRcdHNlbGYubGFiZWwgPSB0KGtleSlcclxuXHJcbiMgXHQjIHNldCBmaWVsZCBsYWJlbHNcclxuIyBcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcbiMgXHRcdGZrZXkgPSBzZWxmLm5hbWUgKyBcIl9cIiArIGZpZWxkX25hbWVcclxuIyBcdFx0aWYgdChma2V5KSA9PSBma2V5XHJcbiMgXHRcdFx0aWYgIWZpZWxkLmxhYmVsXHJcbiMgXHRcdFx0XHRmaWVsZC5sYWJlbCA9IGZpZWxkX25hbWVcclxuIyBcdFx0ZWxzZVxyXG4jIFx0XHRcdGZpZWxkLmxhYmVsID0gdChma2V5KVxyXG4jIFx0XHRzZWxmLnNjaGVtYT8uX3NjaGVtYT9bZmllbGRfbmFtZV0/LmxhYmVsID0gZmllbGQubGFiZWxcclxuXHJcblxyXG4jIFx0IyBzZXQgbGlzdHZpZXcgbGFiZWxzXHJcbiMgXHRfLmVhY2ggc2VsZi5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcbiMgXHRcdGkxOG5fa2V5ID0gc2VsZi5uYW1lICsgXCJfbGlzdHZpZXdfXCIgKyBpdGVtX25hbWVcclxuIyBcdFx0aWYgdChpMThuX2tleSkgPT0gaTE4bl9rZXlcclxuIyBcdFx0XHRpZiAhaXRlbS5sYWJlbFxyXG4jIFx0XHRcdFx0aXRlbS5sYWJlbCA9IGl0ZW1fbmFtZVxyXG4jIFx0XHRlbHNlXHJcbiMgXHRcdFx0aXRlbS5sYWJlbCA9IHQoaTE4bl9rZXkpXHJcblxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IChvYmplY3QpLT5cclxuXHRpZiBvYmplY3RcclxuXHRcdGlmICFvYmplY3QuZGF0YWJhc2VfbmFtZSB8fCBvYmplY3QuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xyXG5cdFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS8je29iamVjdC5kYXRhYmFzZV9uYW1lfVwiXHJcblxyXG4jIGlmIE1ldGVvci5pc0NsaWVudFxyXG5cclxuIyBcdE1ldGVvci5zdGFydHVwIC0+XHJcbiMgXHRcdFRyYWNrZXIuYXV0b3J1biAtPlxyXG4jIFx0XHRcdGlmIFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgJiYgQ3JlYXRvci5ib290c3RyYXBMb2FkZWQ/LmdldCgpXHJcbiMgXHRcdFx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxyXG4jIFx0XHRcdFx0XHRvYmplY3QuaTE4bigpXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdGlmICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHNcclxuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChvYmplY3QpLT5cclxuXHRcdFx0bmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdClcclxuXHJcbiIsInZhciBjbG9uZTtcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fTtcblxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgaWYgKG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJyk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdF9uYW1lO1xufTtcblxuQ3JlYXRvci5PYmplY3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHZhciBfZGIsIGRlZmF1bHRMaXN0Vmlld0lkLCBkZWZhdWx0VmlldywgZGlzYWJsZWRfbGlzdF92aWV3cywgcGVybWlzc2lvbnMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2NoZW1hLCBzZWxmO1xuICBzZWxmID0gdGhpcztcbiAgaWYgKCFvcHRpb25zLm5hbWUpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuICB9XG4gIHNlbGYuX2lkID0gb3B0aW9ucy5faWQgfHwgb3B0aW9ucy5uYW1lO1xuICBzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgc2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICBzZWxmLmxhYmVsID0gb3B0aW9ucy5sYWJlbDtcbiAgc2VsZi5pY29uID0gb3B0aW9ucy5pY29uO1xuICBzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvbjtcbiAgc2VsZi5pc192aWV3ID0gb3B0aW9ucy5pc192aWV3O1xuICBzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm07XG4gIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09PSB0cnVlKSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gZmFsc2U7XG4gIH1cbiAgc2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoO1xuICBzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzO1xuICBzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzO1xuICBzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzO1xuICBzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0O1xuICBpZiAob3B0aW9ucy5wYWdpbmcpIHtcbiAgICBzZWxmLnBhZ2luZyA9IG9wdGlvbnMucGFnaW5nO1xuICB9XG4gIHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW47XG4gIHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT09IHZvaWQgMCkgfHwgb3B0aW9ucy5lbmFibGVfYXBpO1xuICBzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tO1xuICBzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlO1xuICBzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpKSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICAgICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gIH1cbiAgc2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3c7XG4gIHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55O1xuICBzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKTtcbiAgc2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXI7XG4gIHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2g7XG4gIHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbDtcbiAgc2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzO1xuICBzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3c7XG4gIHNlbGYuZW5hYmxlX3dvcmtmbG93ID0gb3B0aW9ucy5lbmFibGVfd29ya2Zsb3c7XG4gIGlmIChfLmhhcyhvcHRpb25zLCAnaW5fZGV2ZWxvcG1lbnQnKSkge1xuICAgIHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50O1xuICB9XG4gIHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJztcbiAgaWYgKG9wdGlvbnMuZGF0YWJhc2VfbmFtZSkge1xuICAgIHNlbGYuZGF0YWJhc2VfbmFtZSA9IG9wdGlvbnMuZGF0YWJhc2VfbmFtZTtcbiAgfVxuICBpZiAoIW9wdGlvbnMuZmllbGRzKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcbiAgfVxuICBzZWxmLmZpZWxkcyA9IGNsb25lKG9wdGlvbnMuZmllbGRzKTtcbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZF9uYW1lID09PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5wcmltYXJ5KSB7XG4gICAgICBzZWxmLmlkRmllbGROYW1lID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSkge1xuICAgICAgICBpZiAoZmllbGRfbmFtZSA9PT0gJ3NwYWNlJykge1xuICAgICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBmaWVsZC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmICghb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PT0gJ21ldGVvci1tb25nbycpIHtcbiAgICBfLmVhY2goQ3JlYXRvci5iYXNlT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmICghc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pIHtcbiAgICAgICAgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSk7XG4gICAgfSk7XG4gIH1cbiAgc2VsZi5saXN0X3ZpZXdzID0ge307XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpO1xuICBfLmVhY2gob3B0aW9ucy5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgb2l0ZW07XG4gICAgb2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKTtcbiAgICByZXR1cm4gc2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbTtcbiAgfSk7XG4gIHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC50cmlnZ2Vycyk7XG4gIF8uZWFjaChvcHRpb25zLnRyaWdnZXJzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXS5uYW1lID0gaXRlbV9uYW1lO1xuICAgIHJldHVybiBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgc2VsZi5hY3Rpb25zID0gXy5jbG9uZShDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyk7XG4gIF8uZWFjaChvcHRpb25zLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBjb3B5SXRlbTtcbiAgICBpZiAoIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICBjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pO1xuICAgIGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXTtcbiAgICByZXR1cm4gc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSk7XG4gIH0pO1xuICBfLmVhY2goc2VsZi5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lID0gaXRlbV9uYW1lO1xuICB9KTtcbiAgc2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSk7XG4gIHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKENyZWF0b3IuYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldCk7XG4gIGlmICghb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fTtcbiAgfVxuICBpZiAoISgocmVmID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZi5hZG1pbiA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pO1xuICB9XG4gIGlmICghKChyZWYxID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZjEudXNlciA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKTtcbiAgfVxuICBfLmVhY2gob3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnM7XG4gICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwO1xuICAgIGlmIChkaXNhYmxlZF9saXN0X3ZpZXdzICE9IG51bGwgPyBkaXNhYmxlZF9saXN0X3ZpZXdzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZGVmYXVsdExpc3RWaWV3SWQgPSAocmVmMiA9IG9wdGlvbnMubGlzdF92aWV3cykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hbGwpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCkge1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAoZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQgPT09IGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Rfdmlld19pdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlbGYucGVybWlzc2lvbnMgPSBudWxsO1xuICB9XG4gIF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiO1xuICBzZWxmLmRiID0gX2RiO1xuICBzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWU7XG4gIHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpO1xuICBzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKTtcbiAgaWYgKHNlbGYubmFtZSAhPT0gXCJ1c2Vyc1wiICYmIHNlbGYubmFtZSAhPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoc2VsZi5uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICBfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hO1xuICB9XG4gIGlmIChfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgQ3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmO1xuICByZXR1cm4gc2VsZjtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCkge1xuICAgIGlmICghb2JqZWN0LmRhdGFiYXNlX25hbWUgfHwgb2JqZWN0LmRhdGFiYXNlX25hbWUgPT09ICdtZXRlb3ItbW9uZ28nKSB7XG4gICAgICByZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIi9hcGkvb2RhdGEvXCIgKyBvYmplY3QuZGF0YWJhc2VfbmFtZTtcbiAgICB9XG4gIH1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBpZiAoIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkICYmIENyZWF0b3IuT2JqZWN0cykge1xuICAgIHJldHVybiBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBuZXcgQ3JlYXRvci5PYmplY3Qob2JqZWN0KTtcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldE9iamVjdFNjaGVtYSA9IChvYmopIC0+XHJcblx0c2NoZW1hID0ge31cclxuXHJcblx0ZmllbGRzQXJyID0gW11cclxuXHJcblx0Xy5lYWNoIG9iai5maWVsZHMgLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdGlmICFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpXHJcblx0XHRcdGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lXHJcblx0XHRmaWVsZHNBcnIucHVzaCBmaWVsZFxyXG5cclxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxyXG5cclxuXHRcdGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lXHJcblxyXG5cdFx0ZnMgPSB7fVxyXG5cdFx0aWYgZmllbGQucmVnRXhcclxuXHRcdFx0ZnMucmVnRXggPSBmaWVsZC5yZWdFeFxyXG5cdFx0ZnMuYXV0b2Zvcm0gPSB7fVxyXG5cdFx0ZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0YXV0b2Zvcm1fdHlwZSA9IGZpZWxkLmF1dG9mb3JtPy50eXBlXHJcblxyXG5cdFx0aWYgZmllbGQudHlwZSA9PSBcInRleHRcIiBvciBmaWVsZC50eXBlID09IFwicGhvbmVcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbdGV4dF1cIiBvciBmaWVsZC50eXBlID09IFwiW3Bob25lXVwiXHJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnY29kZSdcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyXHJcblx0XHRcdGlmIGZpZWxkLmxhbmd1YWdlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidGV4dGFyZWFcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwicGFzc3dvcmRcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxyXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpXHJcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcclxuXHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XHJcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXHJcblx0XHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcclxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxyXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXHJcblxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxyXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpXHJcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcclxuXHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxyXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxyXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbT2JqZWN0XVwiXHJcblx0XHRcdGZzLnR5cGUgPSBbT2JqZWN0XVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaHRtbFwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxyXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCIgfHwgbG9jYWxlID09IFwiemgtQ05cIlxyXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJlbi1VU1wiXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdHR5cGU6IFwic3VtbWVybm90ZVwiXHJcblx0XHRcdFx0XHRjbGFzczogJ3N1bW1lcm5vdGUtZWRpdG9yJ1xyXG5cdFx0XHRcdFx0c2V0dGluZ3M6XHJcblx0XHRcdFx0XHRcdGhlaWdodDogMjAwXHJcblx0XHRcdFx0XHRcdGRpYWxvZ3NJbkJvZHk6IHRydWVcclxuXHRcdFx0XHRcdFx0dG9vbGJhcjogIFtcclxuXHRcdFx0XHRcdFx0XHRbJ2ZvbnQxJywgWydzdHlsZSddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ2ZvbnQyJywgWydib2xkJywgJ3VuZGVybGluZScsICdpdGFsaWMnLCAnY2xlYXInXV0sXHJcblx0XHRcdFx0XHRcdFx0Wydmb250MycsIFsnZm9udG5hbWUnXV0sXHJcblx0XHRcdFx0XHRcdFx0Wydjb2xvcicsIFsnY29sb3InXV0sXHJcblx0XHRcdFx0XHRcdFx0WydwYXJhJywgWyd1bCcsICdvbCcsICdwYXJhZ3JhcGgnXV0sXHJcblx0XHRcdFx0XHRcdFx0Wyd0YWJsZScsIFsndGFibGUnXV0sXHJcblx0XHRcdFx0XHRcdFx0WydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZSddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ3ZpZXcnLCBbJ2NvZGV2aWV3J11dXHJcblx0XHRcdFx0XHRcdF1cclxuXHRcdFx0XHRcdFx0Zm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCfpu5HkvZMnLCflvq7ova/pm4Xpu5EnLCfku7/lrosnLCfmpbfkvZMnLCfpmrbkuaYnLCflubzlnIYnXVxyXG5cdFx0XHRcdFx0XHRsYW5nOiBsb2NhbGVcclxuXHJcblx0XHRlbHNlIGlmIChmaWVsZC50eXBlID09IFwibG9va3VwXCIgb3IgZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblxyXG5cdFx0XHRpZiAhZmllbGQuaGlkZGVuXHJcblxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzXHJcblxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlcGVuZE9uID0gZmllbGQuZGVwZW5kX29uXHJcblxyXG5cdFx0XHRcdGlmIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxyXG5cdFx0XHRcdFx0ZnMuYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXHJcblxyXG5cdFx0XHRcdGZzLmZpbHRlcnNGdW5jdGlvbiA9IGlmIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiB0aGVuIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiBlbHNlIENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzXHJcblxyXG5cdFx0XHRcdGlmIGZpZWxkLm9wdGlvbnNGdW5jdGlvblxyXG5cdFx0XHRcdFx0ZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXHJcblxyXG5cdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRpZiBmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0XHRfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBfcmVmX29iaj8ucGVybWlzc2lvbnM/LmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSAobG9va3VwX2ZpZWxkKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0TW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZX1cIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcm1JZDogXCJuZXcje2ZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywnXycpfVwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IFwiI3tmaWVsZC5yZWZlcmVuY2VfdG99XCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVyYXRpb246IFwiaW5zZXJ0XCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvblN1Y2Nlc3M6IChvcGVyYXRpb24sIHJlc3VsdCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZXN1bHQub2JqZWN0X25hbWUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlc3VsdC5vYmplY3RfbmFtZSA9PSBcIm9iamVjdHNcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSwgaWNvbjogcmVzdWx0LnZhbHVlLmljb259XSwgcmVzdWx0LnZhbHVlLm5hbWUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLCB2YWx1ZTogcmVzdWx0Ll9pZH1dLCByZXN1bHQuX2lkKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlXHJcblxyXG5cdFx0XHRcdFx0aWYgXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKVxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGVcclxuXHJcblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2Vfc29ydFxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0XHJcblxyXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX2xpbWl0XHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdFxyXG5cclxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90byA9PSBcInVzZXJzXCJcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiXHJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcclxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOihqOekuui/h+a7pOaVsOaNruaXtuaYr+WQpuWPquaYvuekuuacrOWNleS9jeS4i+eahOaVsOaNrlxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXHJcblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxyXG5cdFx0XHRcdFx0XHRcdFx0IyDmnKrlrprkuYlpc19jb21wYW55X2xpbWl0ZWTlsZ7mgKfml7bpu5jorqTlpITnkIbpgLvovpHvvJpcclxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7ljZXkvY3liJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7ljZXkvY1cclxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcclxuXHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWNleS9jemDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzVW5MaW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOS8oOWFpeW9k+WJjeWvueixoeeahOadg+mZkO+8jOWcqOWHveaVsOS4reagueaNruadg+mZkOiuoeeul+aYr+WQpuimgemZkOWItuWPquafpeeci+acrOWNleS9jVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOacjeWKoeerr+eUqOS4jeWIsGlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdGVsc2UgaWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwib3JnYW5pemF0aW9uc1wiXHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiXHJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcclxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOihqOekuui/h+a7pOaVsOaNruaXtuaYr+WQpuWPquaYvuekuuacrOWNleS9jeS4i+eahOaVsOaNrlxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXHJcblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxyXG5cdFx0XHRcdFx0XHRcdFx0IyDmnKrlrprkuYlpc19jb21wYW55X2xpbWl0ZWTlsZ7mgKfml7bpu5jorqTlpITnkIbpgLvovpHvvJpcclxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7ljZXkvY3liJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7ljZXkvY1cclxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcclxuXHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWNleS9jemDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzVW5MaW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOS8oOWFpeW9k+WJjeWvueixoeeahOadg+mZkO+8jOWcqOWHveaVsOS4reagueaNruadg+mZkOiuoeeul+aYr+WQpuimgemZkOWItuWPquafpeeci+acrOWNleS9jVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOacjeWKoeerr+eUqOS4jeWIsGlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aWYgdHlwZW9mKGZpZWxkLnJlZmVyZW5jZV90bykgPT0gXCJmdW5jdGlvblwiXHJcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoX3JlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRmcy50eXBlID0gT2JqZWN0XHJcblx0XHRcdFx0XHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub2JqZWN0U3dpdGNoZSA9IHRydWVcclxuXHJcblx0XHRcdFx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogU3RyaW5nXHJcblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFtTdHJpbmddXHJcblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b11cclxuXHJcblx0XHRcdFx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV90b1swXV1cclxuXHRcdFx0XHRcdFx0aWYgX29iamVjdCBhbmQgX29iamVjdC5lbmFibGVfdHJlZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFRyZWVcIlxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2QgPSBmaWVsZC5vcHRpb25zTWV0aG9kIHx8IFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiXHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZFBhcmFtcyA9ICgpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfVxyXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdXHJcblx0XHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvLmZvckVhY2ggKF9yZWZlcmVuY2UpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlXVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfb2JqZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IF9vYmplY3Q/LmxhYmVsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBfb2JqZWN0Py5pY29uXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW5rOiAoKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3Q6IF9yZWZlcmVuY2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0SWNvbiA9IGZpZWxkLmRlZmF1bHRJY29uXHJcblxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwic2VsZWN0XCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImN1cnJlbmN5XCJcclxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XHJcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcclxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxyXG5cdFx0XHRlbHNlIGlmIGZpZWxkPy5zY2FsZSAhPSAwXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSAyXHJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm51bWJlclwiXHJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxyXG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXHJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImJvb2xlYW5cIlxyXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxyXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwicmVmZXJlbmNlXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY2hlY2tib3hcIlxyXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImZpbGVcIiBhbmQgZmllbGQuY29sbGVjdGlvblxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IGZpZWxkLmNvbGxlY3Rpb25cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGZpZWxkLmNvbGxlY3Rpb25cclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImZpbGVzaXplXCJcclxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PSBcIm9iamVjdFwiXHJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3RcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImdyaWRcIlxyXG5cdFx0XHRmcy50eXBlID0gQXJyYXlcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCJcclxuXHJcblx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0dHlwZTogT2JqZWN0XHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJpbWFnZVwiXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2ltYWdlcydcclxuXHRcdFx0XHRcdFx0YWNjZXB0OiAnaW1hZ2UvKidcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdmF0YXJcIlxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdhdmF0YXJzJ1xyXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdWRpb1wiXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F1ZGlvcydcclxuXHRcdFx0XHRcdFx0YWNjZXB0OiAnYXVkaW8vKidcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ2aWRlb1wiXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ3ZpZGVvcydcclxuXHRcdFx0XHRcdFx0YWNjZXB0OiAndmlkZW8vKidcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJsb2NhdGlvblwiXHJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3RcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiXHJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibWFya2Rvd25cIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtbWFya2Rvd25cIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICd1cmwnXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0IyBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5VcmxcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zVXJsJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdlbWFpbCdcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRmcy50eXBlID0gZmllbGQudHlwZVxyXG5cclxuXHRcdGlmIGZpZWxkLmxhYmVsXHJcblx0XHRcdGZzLmxhYmVsID0gZmllbGQubGFiZWxcclxuXHJcbiNcdFx0aWYgZmllbGQuYWxsb3dlZFZhbHVlc1xyXG4jXHRcdFx0ZnMuYWxsb3dlZFZhbHVlcyA9IGZpZWxkLmFsbG93ZWRWYWx1ZXNcclxuXHJcblx0XHRpZiAhZmllbGQucmVxdWlyZWRcclxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXHJcblxyXG5cdFx0IyBb562+57qm5a+56LGh5ZCM5pe26YWN572u5LqGY29tcGFueV9pZHPlv4Xloavlj4p1bmVkaXRhYmxlX2ZpZWxkc+mAoOaIkOmDqOWIhueUqOaIt+aWsOW7uuetvue6puWvueixoeaXtuaKpemUmSAjMTkyXShodHRwczovL2dpdGh1Yi5jb20vc3RlZWRvcy9zdGVlZG9zLXByb2plY3QtZHp1Zy9pc3N1ZXMvMTkyKVxyXG5cdFx0IyDlkI7lj7Dlp4vnu4jorr7nva5yZXF1aXJlZOS4umZhbHNlXHJcblx0XHRpZiAhTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGZzLm9wdGlvbmFsID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLnVuaXF1ZVxyXG5cdFx0XHRmcy51bmlxdWUgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQub21pdFxyXG5cdFx0XHRmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLmdyb3VwXHJcblx0XHRcdGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXBcclxuXHJcblx0XHRpZiBmaWVsZC5pc193aWRlXHJcblx0XHRcdGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuaGlkZGVuXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiXHJcblxyXG5cdFx0aWYgKGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXHJcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5maWx0ZXJhYmxlKSA9PSAndW5kZWZpbmVkJ1xyXG5cdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXHJcblx0XHRpZiBmaWVsZC5uYW1lID09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lXHJcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5zZWFyY2hhYmxlKSA9PSAndW5kZWZpbmVkJ1xyXG5cdFx0XHRcdGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlXHJcblxyXG5cdFx0aWYgYXV0b2Zvcm1fdHlwZVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZVxyXG5cclxuXHRcdGlmIGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSAoKS0+XHJcblx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7dXNlcklkOiBNZXRlb3IudXNlcklkKCksIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX0pXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHRcdFx0XHRpZiAhXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0XHRcdGZzLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLnJlYWRvbmx5XHJcblx0XHRcdGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLmRpc2FibGVkXHJcblx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLmlubGluZUhlbHBUZXh0XHJcblx0XHRcdGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHRcclxuXHJcblx0XHRpZiBmaWVsZC5ibGFja2JveFxyXG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcclxuXHJcblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21pbicpXHJcblx0XHRcdGZzLm1pbiA9IGZpZWxkLm1pblxyXG5cdFx0aWYgXy5oYXMoZmllbGQsICdtYXgnKVxyXG5cdFx0XHRmcy5tYXggPSBmaWVsZC5tYXhcclxuXHJcblx0XHQjIOWPquacieeUn+S6p+eOr+Wig+aJjemHjeW7uue0ouW8lVxyXG5cdFx0aWYgTWV0ZW9yLmlzUHJvZHVjdGlvblxyXG5cdFx0XHRpZiBmaWVsZC5pbmRleFxyXG5cdFx0XHRcdGZzLmluZGV4ID0gZmllbGQuaW5kZXhcclxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5zb3J0YWJsZVxyXG5cdFx0XHRcdGZzLmluZGV4ID0gdHJ1ZVxyXG5cclxuXHRcdHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzXHJcblxyXG5cdHJldHVybiBzY2hlbWFcclxuXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSktPlxyXG5cdGh0bWwgPSBmaWVsZF92YWx1ZVxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGlmICFvYmplY3RcclxuXHRcdHJldHVybiBcIlwiXHJcblx0ZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpXHJcblx0aWYgIWZpZWxkXHJcblx0XHRyZXR1cm4gXCJcIlxyXG5cclxuXHRpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxyXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKVxyXG5cdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxyXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJylcclxuXHJcblx0cmV0dXJuIGh0bWxcclxuXHJcbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gKGZpZWxkX3R5cGUpLT5cclxuXHRyZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcclxuXHJcbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpLT5cclxuXHRidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxyXG5cdGlmIGJ1aWx0aW5WYWx1ZXNcclxuXHRcdF8uZm9yRWFjaCBidWlsdGluVmFsdWVzLCAoYnVpbHRpbkl0ZW0sIGtleSktPlxyXG5cdFx0XHRvcGVyYXRpb25zLnB1c2goe2xhYmVsOiBidWlsdGluSXRlbS5sYWJlbCwgdmFsdWU6IGtleX0pXHJcblxyXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpLT5cclxuXHQjIOi/h+a7pOWZqOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxyXG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpXHJcblxyXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxyXG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XHJcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KVxyXG5cclxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IChmaWVsZF90eXBlLCB2YWx1ZSktPlxyXG5cdCMg5qC55o2u6L+H5ruk5Zmo55qE6L+H5ruk5YC877yM6I635Y+W5a+55bqU55qE5YaF572u6L+Q566X56ymXHJcblx0IyDmr5TlpoJ2YWx1ZeS4umxhc3RfeWVhcu+8jOi/lOWbnmJldHdlZW5fdGltZV9sYXN0X3llYXJcclxuXHR1bmxlc3MgXy5pc1N0cmluZyh2YWx1ZSlcclxuXHRcdHJldHVyblxyXG5cdGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxyXG5cdHVubGVzcyBiZXR3ZWVuQnVpbHRpblZhbHVlc1xyXG5cdFx0cmV0dXJuXHJcblx0cmVzdWx0ID0gbnVsbFxyXG5cdF8uZWFjaCBiZXR3ZWVuQnVpbHRpblZhbHVlcywgKGl0ZW0sIG9wZXJhdGlvbiktPlxyXG5cdFx0aWYgaXRlbS5rZXkgPT0gdmFsdWVcclxuXHRcdFx0cmVzdWx0ID0gb3BlcmF0aW9uXHJcblx0cmV0dXJuIHJlc3VsdFxyXG5cclxuIyDlpoLmnpzlj6rmmK/kuLrliKTmlq1vcGVyYXRpb27mmK/lkKblrZjlnKjvvIzliJnmsqHlv4XopoHorqHnrpd2YWx1ZXPvvIzkvKDlhaVpc19jaGVja19vbmx55Li6dHJ1ZeWNs+WPr1xyXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IChpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKS0+XHJcblx0IyDov4fmu6Tlmajml7bpl7TlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcclxuXHRyZXR1cm4ge1xyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXHJcblx0fVxyXG5cclxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IChtb250aCktPlxyXG5cdGlmICFtb250aFxyXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcclxuXHRcclxuXHRpZiBtb250aCA8IDNcclxuXHRcdHJldHVybiAwXHJcblx0ZWxzZSBpZiBtb250aCA8IDZcclxuXHRcdHJldHVybiAzXHJcblx0ZWxzZSBpZiBtb250aCA8IDlcclxuXHRcdHJldHVybiA2XHJcblx0XHJcblx0cmV0dXJuIDlcclxuXHJcblxyXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxyXG5cdGlmICF5ZWFyXHJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdGlmIG1vbnRoIDwgM1xyXG5cdFx0eWVhci0tXHJcblx0XHRtb250aCA9IDlcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0bW9udGggPSAwXHJcblx0ZWxzZSBpZiBtb250aCA8IDlcclxuXHRcdG1vbnRoID0gM1xyXG5cdGVsc2UgXHJcblx0XHRtb250aCA9IDZcclxuXHRcclxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcblxyXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxyXG5cdGlmICF5ZWFyXHJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdGlmIG1vbnRoIDwgM1xyXG5cdFx0bW9udGggPSAzXHJcblx0ZWxzZSBpZiBtb250aCA8IDZcclxuXHRcdG1vbnRoID0gNlxyXG5cdGVsc2UgaWYgbW9udGggPCA5XHJcblx0XHRtb250aCA9IDlcclxuXHRlbHNlXHJcblx0XHR5ZWFyKytcclxuXHRcdG1vbnRoID0gMFxyXG5cdFxyXG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHJcbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gKHllYXIsbW9udGgpLT5cclxuXHRpZiBtb250aCA9PSAxMVxyXG5cdFx0cmV0dXJuIDMxXHJcblx0XHJcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XHJcblx0c3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0ZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoKzEsIDEpXHJcblx0ZGF5cyA9IChlbmREYXRlLXN0YXJ0RGF0ZSkvbWlsbGlzZWNvbmRcclxuXHRyZXR1cm4gZGF5c1xyXG5cclxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9ICh5ZWFyLCBtb250aCktPlxyXG5cdGlmICF5ZWFyXHJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdCMg5pyI5Lu95Li6MOS7o+ihqOacrOW5tOeahOesrOS4gOaciFxyXG5cdGlmIG1vbnRoID09IDBcclxuXHRcdG1vbnRoID0gMTFcclxuXHRcdHllYXItLVxyXG5cdFx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cdFxyXG5cdCMg5ZCm5YiZLOWPquWHj+WOu+aciOS7vVxyXG5cdG1vbnRoLS07XHJcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cdFxyXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cclxuXHQjIOi/h+a7pOWZqGJldHdlZW7ov5DnrpfnrKbvvIznjrDnrpfml6XmnJ8v5pel5pyf5pe26Ze057G75Z6L5a2X5q6155qEdmFsdWVz5YC8XHJcblx0bm93ID0gbmV3IERhdGUoKVxyXG5cdCMg5LiA5aSp55qE5q+r56eS5pWwXHJcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XHJcblx0eWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcclxuXHR0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcclxuXHQjIOS4gOWRqOS4reeahOafkOS4gOWkqVxyXG5cdHdlZWsgPSBub3cuZ2V0RGF5KClcclxuXHQjIOWHj+WOu+eahOWkqeaVsFxyXG5cdG1pbnVzRGF5ID0gaWYgd2VlayAhPSAwIHRoZW4gd2VlayAtIDEgZWxzZSA2XHJcblx0bW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSlcclxuXHRzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDkuIrlkajml6VcclxuXHRsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiK5ZGo5LiAXHJcblx0bGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpXHJcblx0IyDkuIvlkajkuIBcclxuXHRuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiL5ZGo5pelXHJcblx0bmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpXHJcblx0Y3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxyXG5cdHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMVxyXG5cdG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxXHJcblx0IyDlvZPliY3mnIjku71cclxuXHRjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKVxyXG5cdCMg6K6h5pWw5bm044CB5pyIXHJcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcblx0bW9udGggPSBub3cuZ2V0TW9udGgoKVxyXG5cdCMg5pys5pyI56ys5LiA5aSpXHJcblx0Zmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixjdXJyZW50TW9udGgsMSlcclxuXHJcblx0IyDlvZPkuLoxMuaciOeahOaXtuWAmeW5tOS7vemcgOimgeWKoDFcclxuXHQjIOaciOS7vemcgOimgeabtOaWsOS4ujAg5Lmf5bCx5piv5LiL5LiA5bm055qE56ys5LiA5Liq5pyIXHJcblx0aWYgY3VycmVudE1vbnRoID09IDExXHJcblx0XHR5ZWFyKytcclxuXHRcdG1vbnRoKytcclxuXHRlbHNlXHJcblx0XHRtb250aCsrXHJcblx0XHJcblx0IyDkuIvmnIjnrKzkuIDlpKlcclxuXHRuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cdCMg5LiL5pyI5pyA5ZCO5LiA5aSpXHJcblx0bmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLG1vbnRoLENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsbW9udGgpKVxyXG5cdCMg5pys5pyI5pyA5ZCO5LiA5aSpXHJcblx0bGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiK5pyI56ys5LiA5aSpXHJcblx0bGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcclxuXHQjIOS4iuaciOacgOWQjuS4gOWkqVxyXG5cdGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDmnKzlraPluqblvIDlp4vml6VcclxuXHR0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLDEpXHJcblx0IyDmnKzlraPluqbnu5PmnZ/ml6VcclxuXHR0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyKSlcclxuXHQjIOS4iuWto+W6puW8gOWni+aXpVxyXG5cdGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxyXG5cdCMg5LiK5a2j5bqm57uT5p2f5pelXHJcblx0bGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcclxuXHQjIOS4i+Wto+W6puW8gOWni+aXpVxyXG5cdG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxyXG5cdCMg5LiL5a2j5bqm57uT5p2f5pelXHJcblx0bmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcclxuXHQjIOi/h+WOuzflpKkgXHJcblx0bGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrszMOWkqVxyXG5cdGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrs2MOWkqVxyXG5cdGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrs5MOWkqVxyXG5cdGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrsxMjDlpKlcclxuXHRsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU35aSpIFxyXG5cdG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lMzDlpKlcclxuXHRuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lNjDlpKlcclxuXHRuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lOTDlpKlcclxuXHRuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lMTIw5aSpXHJcblx0bmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKVxyXG5cclxuXHRzd2l0Y2gga2V5XHJcblx0XHR3aGVuIFwibGFzdF95ZWFyXCJcclxuXHRcdFx0I+WOu+W5tFxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfeWVhclwiXHJcblx0XHRcdCPku4rlubRcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7Y3VycmVudFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF95ZWFyXCJcclxuXHRcdFx0I+aYjuW5tFxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tuZXh0WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0X3F1YXJ0ZXJcIlxyXG5cdFx0XHQj5LiK5a2j5bqmXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfcXVhcnRlclwiXHJcblx0XHRcdCPmnKzlraPluqZcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF9xdWFydGVyXCJcclxuXHRcdFx0I+S4i+Wto+W6plxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0X21vbnRoXCJcclxuXHRcdFx0I+S4iuaciFxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfbW9udGhcIlxyXG5cdFx0XHQj5pys5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X21vbnRoXCJcclxuXHRcdFx0I+S4i+aciFxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3Rfd2Vla1wiXHJcblx0XHRcdCPkuIrlkahcclxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ0aGlzX3dlZWtcIlxyXG5cdFx0XHQj5pys5ZGoXHJcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfd2Vla1wiXHJcblx0XHRcdCPkuIvlkahcclxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ5ZXN0ZGF5XCJcclxuXHRcdFx0I+aYqOWkqVxyXG5cdFx0XHRzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ0b2RheVwiXHJcblx0XHRcdCPku4rlpKlcclxuXHRcdFx0c3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidG9tb3Jyb3dcIlxyXG5cdFx0XHQj5piO5aSpXHJcblx0XHRcdHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9tb3Jyb3d9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF83X2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67N+WkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSBcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzMwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67MzDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfNjBfZGF5c1wiXHJcblx0XHRcdCPov4fljrs2MOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF85MF9kYXlzXCJcclxuXHRcdFx0I+i/h+WOuzkw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzEyMF9kYXlzXCJcclxuXHRcdFx0I+i/h+WOuzEyMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzdfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaU35aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF8zMF9kYXlzXCJcclxuXHRcdFx0I+acquadpTMw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzYwX2RheXNcIlxyXG5cdFx0XHQj5pyq5p2lNjDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfOTBfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaU5MOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF8xMjBfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaUxMjDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHJcblx0dmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXVxyXG5cdGlmIGZpZWxkX3R5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHQjIOaXtumXtOexu+Wei+Wtl+aute+8jOWGhee9ruaXtumXtOiMg+WbtOW6lOivpeiAg+iZkeWBj+enu+aXtuWMuuWAvO+8jOWQpuWImei/h+a7pOaVsOaNruWtmOWcqOWBj+W3rlxyXG5cdFx0IyDpnZ7lhoXnva7ml7bpl7TojIPlm7Tml7bvvIznlKjmiLfpgJrov4fml7bpl7Tmjqfku7bpgInmi6nnmoTojIPlm7TvvIzkvJroh6rliqjlpITnkIbml7bljLrlgY/lt67mg4XlhrVcclxuXHRcdCMg5pel5pyf57G75Z6L5a2X5q6177yM5pWw5o2u5bqT5pys5p2l5bCx5a2Y55qE5pivVVRD55qEMOeCue+8jOS4jeWtmOWcqOWBj+W3rlxyXG5cdFx0Xy5mb3JFYWNoIHZhbHVlcywgKGZ2KS0+XHJcblx0XHRcdGlmIGZ2XHJcblx0XHRcdFx0ZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCApXHJcblx0XHJcblx0cmV0dXJuIHtcclxuXHRcdGxhYmVsOiBsYWJlbFxyXG5cdFx0a2V5OiBrZXlcclxuXHRcdHZhbHVlczogdmFsdWVzXHJcblx0fVxyXG5cclxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSktPlxyXG5cdGlmIGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcclxuXHRcdHJldHVybiAnYmV0d2VlbidcclxuXHRlbHNlIGlmIFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcclxuXHRcdHJldHVybiAnY29udGFpbnMnXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIFwiPVwiXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUpIC0+XHJcblx0IyDml6XmnJ/nsbvlnos6IGRhdGUsIGRhdGV0aW1lICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcclxuXHQjIOaWh+acrOexu+WeizogdGV4dCwgdGV4dGFyZWEsIGh0bWwgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIsIFwic3RhcnRzd2l0aFwiXHJcblx0IyDpgInmi6nnsbvlnos6IGxvb2t1cCwgbWFzdGVyX2RldGFpbCwgc2VsZWN0IOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxyXG5cdCMg5pWw5YC857G75Z6LOiBjdXJyZW5jeSwgbnVtYmVyICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcclxuXHQjIOW4g+WwlOexu+WeizogYm9vbGVhbiAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblx0IyDmlbDnu4Tnsbvlnos6IGNoZWNrYm94LCBbdGV4dF0gIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxyXG5cclxuXHRvcHRpb25hbHMgPSB7XHJcblx0XHRlcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLCB2YWx1ZTogXCI9XCJ9LFxyXG5cdFx0dW5lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksIHZhbHVlOiBcIjw+XCJ9LFxyXG5cdFx0bGVzc190aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLCB2YWx1ZTogXCI8XCJ9LFxyXG5cdFx0Z3JlYXRlcl90aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLCB2YWx1ZTogXCI+XCJ9LFxyXG5cdFx0bGVzc19vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksIHZhbHVlOiBcIjw9XCJ9LFxyXG5cdFx0Z3JlYXRlcl9vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksIHZhbHVlOiBcIj49XCJ9LFxyXG5cdFx0Y29udGFpbnM6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSwgdmFsdWU6IFwiY29udGFpbnNcIn0sXHJcblx0XHRub3RfY29udGFpbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJ9LFxyXG5cdFx0c3RhcnRzX3dpdGg6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSwgdmFsdWU6IFwic3RhcnRzd2l0aFwifSxcclxuXHRcdGJldHdlZW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLCB2YWx1ZTogXCJiZXR3ZWVuXCJ9LFxyXG5cdH1cclxuXHJcblx0aWYgZmllbGRfdHlwZSA9PSB1bmRlZmluZWRcclxuXHRcdHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpXHJcblxyXG5cdG9wZXJhdGlvbnMgPSBbXVxyXG5cclxuXHRpZiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKVxyXG5cdFx0Q3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucylcclxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGRfdHlwZSA9PSBcInRleHRhcmVhXCIgb3IgZmllbGRfdHlwZSA9PSBcImh0bWxcIiBvciBmaWVsZF90eXBlID09IFwiY29kZVwiXHJcbiNcdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5jb250YWlucywgb3B0aW9uYWxzLm5vdF9jb250YWluLCBvcHRpb25hbHMuc3RhcnRzX3dpdGgpXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgb3IgZmllbGRfdHlwZSA9PSBcInNlbGVjdFwiXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcclxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJjdXJyZW5jeVwiIG9yIGZpZWxkX3R5cGUgPT0gXCJudW1iZXJcIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbClcclxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJib29sZWFuXCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImNoZWNrYm94XCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcIlt0ZXh0XVwiXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcclxuXHRlbHNlXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcclxuXHJcblx0cmV0dXJuIG9wZXJhdGlvbnNcclxuXHJcbiMjI1xyXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXHJcbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcclxuIyMjXHJcbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IChvYmplY3RfbmFtZSktPlxyXG5cdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXHJcblx0ZmllbGRzQXJyID0gW11cclxuXHJcblx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkKS0+XHJcblx0XHRmaWVsZHNBcnIucHVzaCB7bmFtZTogZmllbGQubmFtZSwgc29ydF9ubzogZmllbGQuc29ydF9ub31cclxuXHJcblx0ZmllbGRzTmFtZSA9IFtdXHJcblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cclxuXHRcdGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKVxyXG5cdHJldHVybiBmaWVsZHNOYW1lXHJcbiIsIkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBmaWVsZHNBcnIsIHNjaGVtYTtcbiAgc2NoZW1hID0ge307XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2gob2JqLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoIV8uaGFzKGZpZWxkLCBcIm5hbWVcIikpIHtcbiAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goZmllbGQpO1xuICB9KTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHZhciBfb2JqZWN0LCBfcmVmX29iaiwgX3JlZmVyZW5jZV90bywgYXV0b2Zvcm1fdHlwZSwgZmllbGRfbmFtZSwgZnMsIGlzVW5MaW1pdGVkLCBsb2NhbGUsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PT0gXCJ6aC1DTlwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAgICAgfVxuICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgdHlwZTogXCJzdW1tZXJub3RlXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiAnc3VtbWVybm90ZS1lZGl0b3InLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICAgIGRpYWxvZ3NJbkJvZHk6IHRydWUsXG4gICAgICAgICAgICB0b29sYmFyOiBbWydmb250MScsIFsnc3R5bGUnXV0sIFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSwgWydmb250MycsIFsnZm9udG5hbWUnXV0sIFsnY29sb3InLCBbJ2NvbG9yJ11dLCBbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSwgWyd0YWJsZScsIFsndGFibGUnXV0sIFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sIFsndmlldycsIFsnY29kZXZpZXcnXV1dLFxuICAgICAgICAgICAgZm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCAn6buR5L2TJywgJ+W+rui9r+mbhem7kScsICfku7/lrosnLCAn5qW35L2TJywgJ+matuS5picsICflubzlnIYnXSxcbiAgICAgICAgICAgIGxhbmc6IGxvY2FsZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIH1cbiAgICAgIGlmICghZmllbGQuaGlkZGVuKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzO1xuICAgICAgICBmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vbjtcbiAgICAgICAgaWYgKGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbikge1xuICAgICAgICAgIGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBmcy5maWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPyBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gOiBDcmVhdG9yLmV2YWx1YXRlRmlsdGVycztcbiAgICAgICAgaWYgKGZpZWxkLm9wdGlvbnNGdW5jdGlvbikge1xuICAgICAgICAgIGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgICAgIGlmIChfcmVmX29iaiAhPSBudWxsID8gKHJlZjEgPSBfcmVmX29iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjEuYWxsb3dDcmVhdGUgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKGxvb2t1cF9maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICBmb3JtSWQ6IFwibmV3XCIgKyAoZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCAnXycpKSxcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogXCJcIiArIGZpZWxkLnJlZmVyZW5jZV90byxcbiAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbihvcGVyYXRpb24sIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lm9iamVjdF9uYW1lID09PSBcIm9iamVjdHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogcmVzdWx0LnZhbHVlLmljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC52YWx1ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0Ll9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3NvcnQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfbGltaXQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYyID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMi5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJvcmdhbml6YXRpb25zXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMyA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjMuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmllbGQucmVmZXJlbmNlX3RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoX3JlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgICAgICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogW1N0cmluZ10sXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXTtcbiAgICAgICAgICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI7XG4gICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdO1xuICAgICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8uZm9yRWFjaChmdW5jdGlvbihfcmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdO1xuICAgICAgICAgICAgICAgICAgaWYgKF9vYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmxhYmVsIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGljb246IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgICAgZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjdXJyZW5jeVwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkgIT09IDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSAyO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBCb29sZWFuO1xuICAgICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJyZWZlcmVuY2VcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCI7XG4gICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZmlsZVwiICYmIGZpZWxkLmNvbGxlY3Rpb24pIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogZmllbGQuY29sbGVjdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBmaWVsZC5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlc2l6ZVwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImdyaWRcIikge1xuICAgICAgZnMudHlwZSA9IEFycmF5O1xuICAgICAgZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIjtcbiAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJpbWFnZVwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdpbWFnZXMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXZhdGFyXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F2YXRhcnMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF1ZGlvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F1ZGlvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdhdWRpby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ2aWRlb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICd2aWRlb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAndmlkZW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9jYXRpb25cIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCI7XG4gICAgICBmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiO1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJtYXJrZG93blwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1tYXJrZG93blwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3VybCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2VtYWlsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcy50eXBlID0gZmllbGQudHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmxhYmVsKSB7XG4gICAgICBmcy5sYWJlbCA9IGZpZWxkLmxhYmVsO1xuICAgIH1cbiAgICBpZiAoIWZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC51bmlxdWUpIHtcbiAgICAgIGZzLnVuaXF1ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5vbWl0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmdyb3VwKSB7XG4gICAgICBmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaXNfd2lkZSkge1xuICAgICAgZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5oaWRkZW4pIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiO1xuICAgIH1cbiAgICBpZiAoKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHx8IChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLmZpbHRlcmFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQubmFtZSA9PT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuc2VhcmNoYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuc2VhcmNoYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvZm9ybV90eXBlKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRlZmF1bHRWYWx1ZSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHtcbiAgICAgICAgICAgIHVzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgICBmcy5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICBmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kaXNhYmxlZCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaW5saW5lSGVscFRleHQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHQ7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ibGFja2JveCkge1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtaW4nKSkge1xuICAgICAgZnMubWluID0gZmllbGQubWluO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtYXgnKSkge1xuICAgICAgZnMubWF4ID0gZmllbGQubWF4O1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzUHJvZHVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLmluZGV4KSB7XG4gICAgICAgIGZzLmluZGV4ID0gZmllbGQuaW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLnNvcnRhYmxlKSB7XG4gICAgICAgIGZzLmluZGV4ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzO1xuICB9KTtcbiAgcmV0dXJuIHNjaGVtYTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpIHtcbiAgdmFyIGZpZWxkLCBodG1sLCBvYmplY3Q7XG4gIGh0bWwgPSBmaWVsZF92YWx1ZTtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKTtcbiAgaWYgKCFmaWVsZCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpO1xuICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gIH1cbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpO1xufTtcblxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBvcGVyYXRpb25zKSB7XG4gIHZhciBidWlsdGluVmFsdWVzO1xuICBidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKGJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm4gXy5mb3JFYWNoKGJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGJ1aWx0aW5JdGVtLCBrZXkpIHtcbiAgICAgIHJldHVybiBvcGVyYXRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsXG4gICAgICAgIHZhbHVlOiBrZXlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIHZhbHVlKSB7XG4gIHZhciBiZXR3ZWVuQnVpbHRpblZhbHVlcywgcmVzdWx0O1xuICBpZiAoIV8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKCFiZXR3ZWVuQnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybjtcbiAgfVxuICByZXN1bHQgPSBudWxsO1xuICBfLmVhY2goYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGl0ZW0sIG9wZXJhdGlvbikge1xuICAgIGlmIChpdGVtLmtleSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXN1bHQgPSBvcGVyYXRpb247XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSkge1xuICByZXR1cm4ge1xuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuICB9O1xufTtcblxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IGZ1bmN0aW9uKG1vbnRoKSB7XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgcmV0dXJuIDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgcmV0dXJuIDY7XG4gIH1cbiAgcmV0dXJuIDk7XG59O1xuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgeWVhci0tO1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoID0gNjtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDY7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2Uge1xuICAgIHllYXIrKztcbiAgICBtb250aCA9IDA7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgdmFyIGRheXMsIGVuZERhdGUsIG1pbGxpc2Vjb25kLCBzdGFydERhdGU7XG4gIGlmIChtb250aCA9PT0gMTEpIHtcbiAgICByZXR1cm4gMzE7XG4gIH1cbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICBzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDEpO1xuICBkYXlzID0gKGVuZERhdGUgLSBzdGFydERhdGUpIC8gbWlsbGlzZWNvbmQ7XG4gIHJldHVybiBkYXlzO1xufTtcblxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA9PT0gMCkge1xuICAgIG1vbnRoID0gMTE7XG4gICAgeWVhci0tO1xuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIH1cbiAgbW9udGgtLTtcbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIHZhciBjdXJyZW50TW9udGgsIGN1cnJlbnRZZWFyLCBlbmRWYWx1ZSwgZmlyc3REYXksIGxhYmVsLCBsYXN0RGF5LCBsYXN0TW9uZGF5LCBsYXN0TW9udGhGaW5hbERheSwgbGFzdE1vbnRoRmlyc3REYXksIGxhc3RRdWFydGVyRW5kRGF5LCBsYXN0UXVhcnRlclN0YXJ0RGF5LCBsYXN0U3VuZGF5LCBsYXN0XzEyMF9kYXlzLCBsYXN0XzMwX2RheXMsIGxhc3RfNjBfZGF5cywgbGFzdF83X2RheXMsIGxhc3RfOTBfZGF5cywgbWlsbGlzZWNvbmQsIG1pbnVzRGF5LCBtb25kYXksIG1vbnRoLCBuZXh0TW9uZGF5LCBuZXh0TW9udGhGaW5hbERheSwgbmV4dE1vbnRoRmlyc3REYXksIG5leHRRdWFydGVyRW5kRGF5LCBuZXh0UXVhcnRlclN0YXJ0RGF5LCBuZXh0U3VuZGF5LCBuZXh0WWVhciwgbmV4dF8xMjBfZGF5cywgbmV4dF8zMF9kYXlzLCBuZXh0XzYwX2RheXMsIG5leHRfN19kYXlzLCBuZXh0XzkwX2RheXMsIG5vdywgcHJldmlvdXNZZWFyLCBzdGFydFZhbHVlLCBzdHJFbmREYXksIHN0ckZpcnN0RGF5LCBzdHJMYXN0RGF5LCBzdHJNb25kYXksIHN0clN0YXJ0RGF5LCBzdHJTdW5kYXksIHN0clRvZGF5LCBzdHJUb21vcnJvdywgc3RyWWVzdGRheSwgc3VuZGF5LCB0aGlzUXVhcnRlckVuZERheSwgdGhpc1F1YXJ0ZXJTdGFydERheSwgdG9tb3Jyb3csIHZhbHVlcywgd2VlaywgeWVhciwgeWVzdGRheTtcbiAgbm93ID0gbmV3IERhdGUoKTtcbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICB5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdG9tb3Jyb3cgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICB3ZWVrID0gbm93LmdldERheSgpO1xuICBtaW51c0RheSA9IHdlZWsgIT09IDAgPyB3ZWVrIC0gMSA6IDY7XG4gIG1vbmRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAobWludXNEYXkgKiBtaWxsaXNlY29uZCkpO1xuICBzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpO1xuICBuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgbmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpO1xuICBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDE7XG4gIG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxO1xuICBjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpO1xuICBmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIDEpO1xuICBpZiAoY3VycmVudE1vbnRoID09PSAxMSkge1xuICAgIHllYXIrKztcbiAgICBtb250aCsrO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoKys7XG4gIH1cbiAgbmV4dE1vbnRoRmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsIG1vbnRoKSk7XG4gIGxhc3REYXkgPSBuZXcgRGF0ZShuZXh0TW9udGhGaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb250aEZpcnN0RGF5ID0gQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLCAxKTtcbiAgdGhpc1F1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIpKTtcbiAgbGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBuZXh0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIGxhc3RfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2UgXCJsYXN0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChsYXN0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChuZXh0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInllc3RkYXlcIjpcbiAgICAgIHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3llc3RkYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b2RheVwiOlxuICAgICAgc3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvbW9ycm93XCI6XG4gICAgICBzdHJUb21vcnJvdyA9IG1vbWVudCh0b21vcnJvdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgfVxuICB2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdO1xuICBpZiAoZmllbGRfdHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgXy5mb3JFYWNoKHZhbHVlcywgZnVuY3Rpb24oZnYpIHtcbiAgICAgIGlmIChmdikge1xuICAgICAgICByZXR1cm4gZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBsYWJlbDogbGFiZWwsXG4gICAga2V5OiBrZXksXG4gICAgdmFsdWVzOiB2YWx1ZXNcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICBpZiAoZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnYmV0d2Vlbic7XG4gIH0gZWxzZSBpZiAoW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnY29udGFpbnMnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIj1cIjtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgdmFyIG9wZXJhdGlvbnMsIG9wdGlvbmFscztcbiAgb3B0aW9uYWxzID0ge1xuICAgIGVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj1cIlxuICAgIH0sXG4gICAgdW5lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw+XCJcbiAgICB9LFxuICAgIGxlc3NfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPFwiXG4gICAgfSxcbiAgICBncmVhdGVyX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIj5cIlxuICAgIH0sXG4gICAgbGVzc19vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw9XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI+PVwiXG4gICAgfSxcbiAgICBjb250YWluczoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksXG4gICAgICB2YWx1ZTogXCJjb250YWluc1wiXG4gICAgfSxcbiAgICBub3RfY29udGFpbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSxcbiAgICAgIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJcbiAgICB9LFxuICAgIHN0YXJ0c193aXRoOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSxcbiAgICAgIHZhbHVlOiBcInN0YXJ0c3dpdGhcIlxuICAgIH0sXG4gICAgYmV0d2Vlbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSxcbiAgICAgIHZhbHVlOiBcImJldHdlZW5cIlxuICAgIH1cbiAgfTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpO1xuICB9XG4gIG9wZXJhdGlvbnMgPSBbXTtcbiAgaWYgKENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKTtcbiAgICBDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcInRleHRcIiB8fCBmaWVsZF90eXBlID09PSBcInRleHRhcmVhXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJodG1sXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJjb2RlXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkX3R5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjdXJyZW5jeVwiIHx8IGZpZWxkX3R5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJbdGV4dF1cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH1cbiAgcmV0dXJuIG9wZXJhdGlvbnM7XG59O1xuXG5cbi8qXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXG4gICAg5YaN5bCG5rKh5pyJ5o6S5bqP5Y+355qE5pi+56S65ZyoXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGZpZWxkcywgZmllbGRzQXJyLCBmaWVsZHNOYW1lLCByZWY7XG4gIGZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICBmaWVsZHNBcnIgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goe1xuICAgICAgbmFtZTogZmllbGQubmFtZSxcbiAgICAgIHNvcnRfbm86IGZpZWxkLnNvcnRfbm9cbiAgICB9KTtcbiAgfSk7XG4gIGZpZWxkc05hbWUgPSBbXTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gZmllbGRzTmFtZTtcbn07XG4iLCJDcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge31cclxuXHJcbmluaXRUcmlnZ2VyID0gKG9iamVjdF9uYW1lLCB0cmlnZ2VyKS0+XHJcblx0dHJ5XHJcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxyXG5cdFx0aWYgIXRyaWdnZXIudG9kb1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdHRvZG9XcmFwcGVyID0gKCktPlxyXG5cdFx0XHQgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZVxyXG5cdFx0XHQgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKVxyXG5cdFx0aWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLmluc2VydFwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS51cGRhdGVcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnVwZGF0ZSh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUucmVtb3ZlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy5yZW1vdmUodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIuaW5zZXJ0XCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/Lmluc2VydCh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci51cGRhdGVcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8udXBkYXRlKHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnJlbW92ZVwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy5yZW1vdmUodG9kb1dyYXBwZXIpXHJcblx0Y2F0Y2ggZXJyb3JcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpXHJcblxyXG5jbGVhblRyaWdnZXIgPSAob2JqZWN0X25hbWUpLT5cclxuXHQjIyNcclxuICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXHJcbiAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxyXG5cdCMjI1xyXG4gICAgI1RPRE8g55Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsGJ1Z1xyXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdPy5yZXZlcnNlKCkuZm9yRWFjaCAoX2hvb2spLT5cclxuXHRcdF9ob29rLnJlbW92ZSgpXHJcblxyXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IChvYmplY3RfbmFtZSktPlxyXG4jXHRjb25zb2xlLmxvZygnQ3JlYXRvci5pbml0VHJpZ2dlcnMgb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSlcclxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0Y2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKVxyXG5cclxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdXHJcblxyXG5cdF8uZWFjaCBvYmoudHJpZ2dlcnMsICh0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpLT5cclxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciBhbmQgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxyXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcclxuXHRcdFx0aWYgX3RyaWdnZXJfaG9va1xyXG5cdFx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaylcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxyXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcclxuXHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKSIsInZhciBjbGVhblRyaWdnZXIsIGluaXRUcmlnZ2VyO1xuXG5DcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge307XG5cbmluaXRUcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHRyaWdnZXIpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGVycm9yLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHRvZG9XcmFwcGVyO1xuICB0cnkge1xuICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIGlmICghdHJpZ2dlci50b2RvKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRvZG9XcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZi5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYxID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYxLnVwZGF0ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjIgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjIucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYzID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjMuaW5zZXJ0KHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY0ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjQudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY1ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjUucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgIGVycm9yID0gZXJyb3IxO1xuICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKTtcbiAgfVxufTtcblxuY2xlYW5UcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcblxuICAvKlxuICAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuICAgKi9cbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSkgIT0gbnVsbCA/IHJlZi5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbihfaG9vaykge1xuICAgIHJldHVybiBfaG9vay5yZW1vdmUoKTtcbiAgfSkgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBvYmo7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0gPSBbXTtcbiAgcmV0dXJuIF8uZWFjaChvYmoudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSkge1xuICAgIHZhciBfdHJpZ2dlcl9ob29rO1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgaWYgKF90cmlnZ2VyX2hvb2spIHtcbiAgICAgICAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICByZXR1cm4gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKVxyXG5cclxuQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRcdGlmICFvYmpcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRyZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpXHJcblx0ZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHJcbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XHJcblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRpZiAhc3BhY2VJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHJcblx0aWYgcmVjb3JkIGFuZCBvYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdCMg5aaC5p6c5pivY21zX2ZpbGVz6ZmE5Lu277yM5YiZ5p2D6ZmQ5Y+W5YW254i26K6w5b2V5p2D6ZmQXHJcblx0XHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKVxyXG5cdFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tuivpue7hueVjOmdolxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xyXG5cdFx0XHRyZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcclxuXHRcdGVsc2UgXHJcblx0XHRcdCMg5b2T5YmN5aSE5LqOY21zX2ZpbGVz6ZmE5Lu255qE54i26K6w5b2V55WM6Z2iXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XHJcblx0XHRcdHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xyXG5cdFx0b2JqZWN0X2ZpZWxkc19rZXlzID0gXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uZmllbGRzIG9yIHt9KSB8fCBbXTtcclxuXHRcdHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcclxuXHRcdGlmIHNlbGVjdC5sZW5ndGggPiAwXHJcblx0XHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdC5qb2luKCcsJykpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZWNvcmQgPSBudWxsO1xyXG5cclxuXHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSlcclxuXHJcblx0aWYgcmVjb3JkXHJcblx0XHRpZiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXHJcblx0XHRcdHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXHJcblxyXG5cdFx0aXNPd25lciA9IHJlY29yZC5vd25lciA9PSB1c2VySWQgfHwgcmVjb3JkLm93bmVyPy5faWQgPT0gdXNlcklkXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpXHJcblx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZD8uY29tcGFueV9pZFxyXG5cdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpIGFuZCByZWNvcmRfY29tcGFueV9pZC5faWRcclxuXHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZOaYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEb2JqZWN077yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XHJcblx0XHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkXHJcblx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQ/LmNvbXBhbnlfaWRzXHJcblx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWRzWzBdKVxyXG5cdFx0XHQjIOWboHJlY29yZF9jb21wYW55X2lkc+aYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEW29iamVjdF3vvIzmiYDku6Xov5nph4zlj5blh7rlhbZfaWTlgLxcclxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcCgobiktPiBuLl9pZClcclxuXHRcdHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKVxyXG5cdFx0aWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cdFx0ZWxzZSBpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXHJcblx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcclxuXHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxyXG5cdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5L+u5pS5XHJcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5L+u5pS5XHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cdFx0XHJcblx0XHRpZiByZWNvcmQubG9ja2VkIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblxyXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxyXG5cdFx0ZWxzZSBpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGhcclxuXHRcdFx0XHRpZiB1c2VyX2NvbXBhbnlfaWRzIGFuZCB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aFxyXG5cdFx0XHRcdFx0aWYgIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoXHJcblx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPmn6XnnItcclxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2VcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWTlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5p+l55yLXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxyXG5cclxuXHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHJcblxyXG4jIGN1cnJlbnRPYmplY3ROYW1l77ya5b2T5YmN5Li75a+56LGhXHJcbiMgcmVsYXRlZExpc3RJdGVt77yaQ3JlYXRvci5nZXRSZWxhdGVkTGlzdChTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpLCBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSnkuK3lj5ZyZWxhdGVkX29iamVjdF9uYW1l5a+55bqU55qE5YC8XHJcbiMgY3VycmVudFJlY29yZOW9k+WJjeS4u+WvueixoeeahOivpue7huiusOW9lVxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMgPSAoY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XHJcblx0XHRpZiAhY3VycmVudE9iamVjdE5hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0XHRpZiAhcmVsYXRlZExpc3RJdGVtXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XHJcblx0XHRcdHJldHVybiB7fVxyXG5cclxuXHRcdGlmICFjdXJyZW50UmVjb3JkIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0Y3VycmVudFJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcclxuXHJcblx0XHRpZiAhdXNlcklkIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblxyXG5cdFx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblxyXG5cdFx0c2hhcmluZyA9IHJlbGF0ZWRMaXN0SXRlbS5zaGFyaW5nIHx8ICdtYXN0ZXJXcml0ZSdcclxuXHRcdG1hc3RlckFsbG93ID0gZmFsc2VcclxuXHRcdG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zKGN1cnJlbnRPYmplY3ROYW1lLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpXHJcblx0XHRpZiBzaGFyaW5nID09ICdtYXN0ZXJSZWFkJ1xyXG5cdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkXHJcblx0XHRlbHNlIGlmIHNoYXJpbmcgPT0gJ21hc3RlcldyaXRlJ1xyXG5cdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0XHJcblxyXG5cdFx0dW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSlcclxuXHRcdHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKVxyXG5cdFx0aXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlID0gdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QuaW5kZXhPZihyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpID4gLTFcclxuXHJcblx0XHRyZXN1bHQgPSBfLmNsb25lIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9uc1xyXG5cdFx0cmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcclxuXHRcdHJlc3VsdC5hbGxvd0VkaXQgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcclxuXHRcdHJldHVybiByZXN1bHRcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cclxuXHRDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCkgLT5cclxuXHRcdHBlcm1pc3Npb25zID1cclxuXHRcdFx0b2JqZWN0czoge31cclxuXHRcdFx0YXNzaWduZWRfYXBwczogW11cclxuXHRcdCMjI1xyXG5cdFx05p2D6ZmQ57uE6K+05piOOlxyXG5cdFx05YaF572u5p2D6ZmQ57uELWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxyXG5cdFx06Ieq5a6a5LmJ5p2D6ZmQ57uELeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOe7hOS7peWklueahOWFtuS7luadg+mZkOe7hFxyXG5cdFx054m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ57uE77yI5Y2zdXNlcnPlsZ7mgKfkuI3lj6/phY3nva7vvIktYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3RcclxuXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOe7hO+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOe7hFxyXG5cdFx0IyMjXHJcblx0XHRwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXHJcblx0XHRwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHJcblx0XHRwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cclxuXHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcclxuXHJcblx0XHRwc2V0c0FkbWluX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzVXNlcl9wb3MgPSBudWxsXHJcblx0XHRwc2V0c01lbWJlcl9wb3MgPSBudWxsXHJcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IG51bGxcclxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSBudWxsXHJcblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbFxyXG5cclxuXHRcdGlmIHBzZXRzQWRtaW4/Ll9pZFxyXG5cdFx0XHRwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzVXNlcj8uX2lkXHJcblx0XHRcdHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzTWVtYmVyPy5faWRcclxuXHRcdFx0cHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c01lbWJlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzR3Vlc3Q/Ll9pZFxyXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzU3VwcGxpZXI/Ll9pZFxyXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzQ3VzdG9tZXI/Ll9pZFxyXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNDdXN0b21lci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHJcblx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxyXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwiX2lkXCJcclxuXHRcdFx0cHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogc2V0X2lkc319KS5mZXRjaCgpXHJcblx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxyXG5cdFx0c3BhY2VVc2VyID0gbnVsbFxyXG5cdFx0aWYgdXNlcklkXHJcblx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXHJcblxyXG5cdFx0cHNldHMgPSB7IFxyXG5cdFx0XHRwc2V0c0FkbWluLCBcclxuXHRcdFx0cHNldHNVc2VyLCBcclxuXHRcdFx0cHNldHNDdXJyZW50LCBcclxuXHRcdFx0cHNldHNNZW1iZXIsIFxyXG5cdFx0XHRwc2V0c0d1ZXN0LFxyXG5cdFx0XHRwc2V0c1N1cHBsaWVyLFxyXG5cdFx0XHRwc2V0c0N1c3RvbWVyLFxyXG5cdFx0XHRpc1NwYWNlQWRtaW4sIFxyXG5cdFx0XHRzcGFjZVVzZXIsIFxyXG5cdFx0XHRwc2V0c0FkbWluX3BvcywgXHJcblx0XHRcdHBzZXRzVXNlcl9wb3MsIFxyXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MsIFxyXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyxcclxuXHRcdFx0cHNldHNTdXBwbGllcl9wb3MsXHJcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zLFxyXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zXHJcblx0XHR9XHJcblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0cGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lc1xyXG5cdFx0X2kgPSAwXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxyXG5cdFx0XHRfaSsrXHJcblx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09IHNwYWNlSWRcclxuXHRcdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT0gJzAnICYmIGlzU3BhY2VBZG1pbilcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xyXG5cclxuXHR1bmlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxyXG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdFx0aWYgIWFycmF5XHJcblx0XHRcdGFycmF5ID0gW11cclxuXHRcdGlmICFvdGhlclxyXG5cdFx0XHRvdGhlciA9IFtdXHJcblx0XHRyZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpXHJcblxyXG5cdGludGVyc2VjdGlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxyXG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdFx0aWYgIWFycmF5XHJcblx0XHRcdGFycmF5ID0gW11cclxuXHRcdGlmICFvdGhlclxyXG5cdFx0XHRvdGhlciA9IFtdXHJcblx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKVxyXG5cclxuXHRDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRcdHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0cHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRwc2V0c0N1c3RvbWVyID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0IyBwc2V0c01lbWJlciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0IyBwc2V0c0d1ZXN0ID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0cHNldHMgPSAgdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRhcHBzID0gW11cclxuXHRcdGlmIGlzU3BhY2VBZG1pblxyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGVsc2VcclxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGVcclxuXHRcdFx0cHNldEJhc2UgPSBwc2V0c1VzZXJcclxuXHRcdFx0aWYgdXNlclByb2ZpbGVcclxuXHRcdFx0XHRpZiB1c2VyUHJvZmlsZSA9PSAnc3VwcGxpZXInXHJcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXJcclxuXHRcdFx0XHRlbHNlIGlmIHVzZXJQcm9maWxlID09ICdjdXN0b21lcidcclxuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNDdXN0b21lclxyXG5cdFx0XHRpZiBwc2V0QmFzZT8uYXNzaWduZWRfYXBwcz8ubGVuZ3RoXHJcblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwc1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyB1c2Vy5p2D6ZmQ57uE5Lit55qEYXNzaWduZWRfYXBwc+ihqOekuuaJgOacieeUqOaIt+WFt+acieeahGFwcHPmnYPpmZDvvIzkuLrnqbrliJnooajnpLrmnInmiYDmnIlhcHBz5p2D6ZmQ77yM5LiN6ZyA6KaB5L2c5p2D6ZmQ5Yik5pat5LqGXHJcblx0XHRcdFx0cmV0dXJuIFtdXHJcblx0XHRcdF8uZWFjaCBwc2V0cywgKHBzZXQpLT5cclxuXHRcdFx0XHRpZiAhcHNldC5hc3NpZ25lZF9hcHBzXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRpZiBwc2V0Lm5hbWUgPT0gXCJhZG1pblwiIHx8ICBwc2V0Lm5hbWUgPT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09ICdjdXN0b21lcidcclxuXHRcdFx0XHRcdCMg6L+Z6YeM5LmL5omA5Lul6KaB5o6S6ZmkYWRtaW4vdXNlcu+8jOaYr+WboOS4uui/meS4pOS4quadg+mZkOe7hOaYr+aJgOacieadg+mZkOe7hOS4rXVzZXJz5bGe5oCn5peg5pWI55qE5p2D6ZmQ57uE77yM54m55oyH5bel5L2c5Yy6566h55CG5ZGY5ZKM5omA5pyJ55So5oi3XHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHNcclxuXHRcdFx0cmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksdW5kZWZpbmVkLG51bGwpXHJcblxyXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcclxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0YWRtaW5NZW51cyA9IENyZWF0b3IuQXBwcy5hZG1pbj8uYWRtaW5fbWVudXNcclxuXHRcdCMg5aaC5p6c5rKh5pyJYWRtaW7oj5zljZXor7TmmI7kuI3pnIDopoHnm7jlhbPlip/og73vvIznm7TmjqXov5Tlm57nqbpcclxuXHRcdHVubGVzcyBhZG1pbk1lbnVzXHJcblx0XHRcdHJldHVybiBbXVxyXG5cdFx0YWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kIChuKSAtPlxyXG5cdFx0XHRuLl9pZCA9PSAnYWJvdXQnXHJcblx0XHRhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIgKG4pIC0+XHJcblx0XHRcdG4uX2lkICE9ICdhYm91dCdcclxuXHRcdG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeSBfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCAobikgLT5cclxuXHRcdFx0cmV0dXJuIG4uYWRtaW5fbWVudXMgYW5kIG4uX2lkICE9ICdhZG1pbidcclxuXHRcdCksICdzb3J0J1xyXG5cdFx0b3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpXHJcblx0XHQjIOiPnOWNleacieS4iemDqOWIhue7hOaIkO+8jOiuvue9rkFQUOiPnOWNleOAgeWFtuS7lkFQUOiPnOWNleS7peWPimFib3V06I+c5Y2VXHJcblx0XHRhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pXHJcblx0XHRpZiBpc1NwYWNlQWRtaW5cclxuXHRcdFx0IyDlt6XkvZzljLrnrqHnkIblkZjmnInlhajpg6joj5zljZXlip/og71cclxuXHRcdFx0cmVzdWx0ID0gYWxsTWVudXNcclxuXHRcdGVsc2VcclxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGUgfHwgJ3VzZXInXHJcblx0XHRcdGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAgKG4pIC0+XHJcblx0XHRcdFx0cmV0dXJuIG4ubmFtZVxyXG5cdFx0XHRtZW51cyA9IGFsbE1lbnVzLmZpbHRlciAobWVudSktPlxyXG5cdFx0XHRcdHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzXHJcblx0XHRcdFx0IyDlpoLmnpzmma7pgJrnlKjmiLfmnInmnYPpmZDvvIzliJnnm7TmjqXov5Tlm550cnVlXHJcblx0XHRcdFx0aWYgcHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xXHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRcdCMg5ZCm5YiZ5Y+W5b2T5YmN55So5oi355qE5p2D6ZmQ6ZuG5LiObWVudeiPnOWNleimgeaxgueahOadg+mZkOmbhuWvueavlO+8jOWmguaenOS6pOmbhuWkp+S6jjHkuKrliJnov5Tlm550cnVlXHJcblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoXHJcblx0XHRcdHJlc3VsdCA9IG1lbnVzXHJcblx0XHRcclxuXHRcdHJldHVybiBfLnNvcnRCeShyZXN1bHQsXCJzb3J0XCIpXHJcblxyXG5cdGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpLT5cclxuXHJcblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XHJcblx0XHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWR9KVxyXG5cclxuXHRmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcyktPlxyXG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcclxuXHRcdFx0cmV0dXJuIF8uZmlsdGVyIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XHJcblx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXHJcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogcGVybWlzc2lvbl9zZXRfaWRzfX0pLmZldGNoKClcclxuXHJcblx0dW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IChwb3MsIG9iamVjdCwgcHNldHMpLT5cclxuXHRcdCMg5oqKZGLlj4p5bWzkuK3nmoRwZXJtaXNzaW9uX29iamVjdHPlkIjlubbvvIzkvJjlhYjlj5ZkYuS4reeahFxyXG5cdFx0cmVzdWx0ID0gW11cclxuXHRcdF8uZWFjaCBvYmplY3QucGVybWlzc2lvbl9zZXQsIChvcHMsIG9wc19rZXkpLT5cclxuXHRcdFx0IyDmiop5bWzkuK3pmaTkuobnibnlrprnlKjmiLfpm4blkIjmnYPpmZDnu4RcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCLlpJbnmoTlhbbku5blr7nosaHmnYPpmZDlhYjlrZjlhaVyZXN1bHRcclxuXHRcdFx0IyBpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiLCBcIndvcmtmbG93X2FkbWluXCIsIFwib3JnYW5pemF0aW9uX2FkbWluXCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXHJcblx0XHRcdGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXHJcblx0XHRcdFx0Y3VycmVudFBzZXQgPSBwc2V0cy5maW5kIChwc2V0KS0+IHJldHVybiBwc2V0Lm5hbWUgPT0gb3BzX2tleVxyXG5cdFx0XHRcdGlmIGN1cnJlbnRQc2V0XHJcblx0XHRcdFx0XHR0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9XHJcblx0XHRcdFx0XHR0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkXHJcblx0XHRcdFx0XHR0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRyZXN1bHQucHVzaCB0ZW1wT3BzXHJcblx0XHRpZiByZXN1bHQubGVuZ3RoXHJcblx0XHRcdHBvcy5mb3JFYWNoIChwbyktPlxyXG5cdFx0XHRcdHJlcGVhdEluZGV4ID0gMFxyXG5cdFx0XHRcdHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoKGl0ZW0sIGluZGV4KS0+IHJlcGVhdEluZGV4ID0gaW5kZXg7cmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT0gcG8ucGVybWlzc2lvbl9zZXRfaWQpXHJcblx0XHRcdFx0IyDlpoLmnpx5bWzkuK3lt7Lnu4/lrZjlnKhwb++8jOWImeabv+aNouS4uuaVsOaNruW6k+S4reeahHBv77yM5Y+N5LmL5YiZ5oqK5pWw5o2u5bqT5Lit55qEcG/nm7TmjqXntK/liqDov5vljrtcclxuXHRcdFx0XHRpZiByZXBlYXRQb1xyXG5cdFx0XHRcdFx0cmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggcG9cclxuXHRcdFx0cmV0dXJuIHJlc3VsdFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gcG9zXHJcblxyXG5cdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSktPlxyXG5cdFx0cGVybWlzc2lvbnMgPSB7fVxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpXHJcblxyXG5cdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09IFwidXNlcnNcIlxyXG5cdFx0XHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxyXG5cdFx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xyXG5cdFx0XHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHRcdHBzZXRzQWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIG9yIHRoaXMucHNldHNBZG1pbiB0aGVuIHRoaXMucHNldHNBZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSBvciB0aGlzLnBzZXRzVXNlciB0aGVuIHRoaXMucHNldHNVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c01lbWJlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIG9yIHRoaXMucHNldHNNZW1iZXIgdGhlbiB0aGlzLnBzZXRzTWVtYmVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzR3Vlc3QgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIG9yIHRoaXMucHNldHNHdWVzdCB0aGVuIHRoaXMucHNldHNHdWVzdCBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHJcblx0XHRwc2V0c1N1cHBsaWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSBvciB0aGlzLnBzZXRzU3VwcGxpZXIgdGhlbiB0aGlzLnBzZXRzU3VwcGxpZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c0N1c3RvbWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSBvciB0aGlzLnBzZXRzQ3VzdG9tZXIgdGhlbiB0aGlzLnBzZXRzQ3VzdG9tZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblxyXG5cdFx0cHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcclxuXHJcblx0XHRwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3NcclxuXHRcdHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3NcclxuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zXHJcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3NcclxuXHJcblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3NcclxuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gdGhpcy5wc2V0c0N1c3RvbWVyX3Bvc1xyXG5cclxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3NcclxuXHJcblx0XHRvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9XHJcblx0XHRvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fVxyXG5cdFx0b3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9XHJcblx0XHRvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XHJcblxyXG5cdFx0b3BzZXRTdXBwbGllciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnN1cHBsaWVyKSB8fCB7fVxyXG5cdFx0b3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fVxyXG5cclxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3RfbGlzdHZpZXdzJykuZmluZCh7c3BhY2U6IHNwYWNlSWQsIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc2hhcmVkOiB0cnVlfSwge2ZpZWxkczp7X2lkOjF9fSkuZmV0Y2goKVxyXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBfLnBsdWNrKHNoYXJlZExpc3RWaWV3cyxcIl9pZFwiKVxyXG5cdFx0IyBpZiBzaGFyZWRMaXN0Vmlld3MubGVuZ3RoXHJcblx0XHQjIFx0dW5sZXNzIG9wc2V0QWRtaW4ubGlzdF92aWV3c1xyXG5cdFx0IyBcdFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gW11cclxuXHRcdCMgXHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0QWRtaW4ubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXHJcblx0XHQjIFx0dW5sZXNzIG9wc2V0VXNlci5saXN0X3ZpZXdzXHJcblx0XHQjIFx0XHRvcHNldFVzZXIubGlzdF92aWV3cyA9IFtdXHJcblx0XHQjIFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0VXNlci5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3NcclxuXHRcdCMg5pWw5o2u5bqT5Lit5aaC5p6c6YWN572u5LqG6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOmbhuiuvue9ru+8jOW6lOivpeimhuebluS7o+eggeS4rWFkbWluL3VzZXLnmoTmnYPpmZDpm4borr7nva5cclxuXHRcdGlmIHBzZXRzQWRtaW5cclxuXHRcdFx0cG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpXHJcblx0XHRcdGlmIHBvc0FkbWluXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0NyZWF0ZSA9IHBvc0FkbWluLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc0FkbWluLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0VkaXQgPSBwb3NBZG1pbi5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldEFkbWluLmFsbG93UmVhZCA9IHBvc0FkbWluLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLnZpZXdBbGxSZWNvcmRzID0gcG9zQWRtaW4udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldEFkbWluLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NBZG1pbi5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0FkbWluLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0FkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblx0XHRpZiBwc2V0c1VzZXJcclxuXHRcdFx0cG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpXHJcblx0XHRcdGlmIHBvc1VzZXJcclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dDcmVhdGUgPSBwb3NVc2VyLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93RGVsZXRlID0gcG9zVXNlci5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd0VkaXQgPSBwb3NVc2VyLmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd1JlYWQgPSBwb3NVc2VyLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0VXNlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zVXNlci5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnZpZXdBbGxSZWNvcmRzID0gcG9zVXNlci52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldFVzZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zVXNlci52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldFVzZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1VzZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0VXNlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zVXNlci5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRVc2VyLnVucmVhZGFibGVfZmllbGRzID0gcG9zVXNlci51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldFVzZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NVc2VyLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zVXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxyXG5cdFx0aWYgcHNldHNNZW1iZXJcclxuXHRcdFx0cG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpXHJcblx0XHRcdGlmIHBvc01lbWJlclxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93Q3JlYXRlID0gcG9zTWVtYmVyLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dEZWxldGUgPSBwb3NNZW1iZXIuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd0VkaXQgPSBwb3NNZW1iZXIuYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dSZWFkID0gcG9zTWVtYmVyLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnZpZXdBbGxSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc01lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc01lbWJlci5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zTWVtYmVyLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcclxuXHRcdGlmIHBzZXRzR3Vlc3RcclxuXHRcdFx0cG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpXHJcblx0XHRcdGlmIHBvc0d1ZXN0XHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0NyZWF0ZSA9IHBvc0d1ZXN0LmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0RlbGV0ZSA9IHBvc0d1ZXN0LmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0VkaXQgPSBwb3NHdWVzdC5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmFsbG93UmVhZCA9IHBvc0d1ZXN0LmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LnZpZXdBbGxSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0d1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmRpc2FibGVkX2FjdGlvbnMgPSBwb3NHdWVzdC5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0d1ZXN0LnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblx0XHRpZiBwc2V0c1N1cHBsaWVyXHJcblx0XHRcdHBvc1N1cHBsaWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1N1cHBsaWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzU3VwcGxpZXIuX2lkKTtcclxuXHRcdFx0aWYgcG9zU3VwcGxpZXJcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmFsbG93Q3JlYXRlID0gcG9zU3VwcGxpZXIuYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmFsbG93RGVsZXRlID0gcG9zU3VwcGxpZXIuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmFsbG93RWRpdCA9IHBvc1N1cHBsaWVyLmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuYWxsb3dSZWFkID0gcG9zU3VwcGxpZXIuYWxsb3dSZWFkXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zU3VwcGxpZXIubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIudmlld0FsbFJlY29yZHMgPSBwb3NTdXBwbGllci52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NTdXBwbGllci5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zU3VwcGxpZXIudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zU3VwcGxpZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1N1cHBsaWVyLmRpc2FibGVkX2FjdGlvbnNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zU3VwcGxpZXIudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zU3VwcGxpZXIudW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zU3VwcGxpZXIudW5yZWxhdGVkX29iamVjdHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zU3VwcGxpZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcclxuXHRcdGlmIHBzZXRzQ3VzdG9tZXJcclxuXHRcdFx0cG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xyXG5cdFx0XHRpZiBwb3NDdXN0b21lclxyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuYWxsb3dDcmVhdGUgPSBwb3NDdXN0b21lci5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuYWxsb3dEZWxldGUgPSBwb3NDdXN0b21lci5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuYWxsb3dFZGl0ID0gcG9zQ3VzdG9tZXIuYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5hbGxvd1JlYWQgPSBwb3NDdXN0b21lci5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NDdXN0b21lci5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci52aWV3QWxsUmVjb3JkcyA9IHBvc0N1c3RvbWVyLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0N1c3RvbWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NDdXN0b21lci5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NDdXN0b21lci51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NDdXN0b21lci51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NDdXN0b21lci51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NDdXN0b21lci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxyXG5cclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXHJcblx0XHRlbHNlXHJcblx0XHRcdGlmIGlzU3BhY2VBZG1pblxyXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnY29tbW9uJ1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRzcGFjZVVzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgb3IgdGhpcy5zcGFjZVVzZXIgdGhlbiB0aGlzLnNwYWNlVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxyXG5cdFx0XHRcdFx0aWYgc3BhY2VVc2VyXHJcblx0XHRcdFx0XHRcdHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZVxyXG5cdFx0XHRcdFx0XHRpZiBwcm9mXHJcblx0XHRcdFx0XHRcdFx0aWYgcHJvZiBpcyAndXNlcidcclxuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdtZW1iZXInXHJcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdndWVzdCdcclxuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnc3VwcGxpZXInXHJcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXJcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2N1c3RvbWVyJ1xyXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEN1c3RvbWVyXHJcblx0XHRcdFx0XHRcdGVsc2UgIyDmsqHmnIlwcm9maWxl5YiZ6K6k5Li65pivdXNlcuadg+mZkFxyXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxyXG5cclxuXHRcdGlmIHBzZXRzLmxlbmd0aCA+IDBcclxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHMsIFwiX2lkXCJcclxuXHRcdFx0cG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcylcclxuXHRcdFx0cG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpXHJcblx0XHRcdF8uZWFjaCBwb3MsIChwbyktPlxyXG5cdFx0XHRcdGlmIHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQWRtaW4/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1VzZXI/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c01lbWJlcj8uX2lkIG9yIFxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzR3Vlc3Q/Ll9pZCBvclxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzU3VwcGxpZXI/Ll9pZCBvclxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQ3VzdG9tZXI/Ll9pZFxyXG5cdFx0XHRcdFx0IyDpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ5YC85Y+q5a6e6KGM5LiK6Z2i55qE6buY6K6k5YC86KaG55uW77yM5LiN5YGa566X5rOV5Yik5patXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRpZiBwby5hbGxvd1JlYWRcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWVcclxuXHRcdFx0XHRpZiBwby5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dFZGl0XHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dEZWxldGVcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWVcclxuXHRcdFx0XHRpZiBwby52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcclxuXHJcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpXHJcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpXHJcblx0XHRcclxuXHRcdGlmIG9iamVjdC5pc192aWV3XHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW11cclxuXHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXHJcblxyXG5cdFx0aWYgb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXHJcblx0XHRcdHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXHJcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHJcblxyXG5cdCMgQ3JlYXRvci5pbml0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUpIC0+XHJcblxyXG5cdFx0IyAjIOW6lOivpeaKiuiuoeeul+WHuuadpeeahFxyXG5cdFx0IyBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXS5hbGxvd1xyXG5cdFx0IyBcdGluc2VydDogKHVzZXJJZCwgZG9jKSAtPlxyXG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2VcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0ICAgIFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0IyBcdHVwZGF0ZTogKHVzZXJJZCwgZG9jKSAtPlxyXG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2VcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RWRpdFxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdHJldHVybiB0cnVlXHJcblx0XHQjIFx0cmVtb3ZlOiAodXNlcklkLCBkb2MpIC0+XHJcblx0XHQjIFx0XHRpZiAhdXNlcklkXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRNZXRlb3IubWV0aG9kc1xyXG5cdFx0IyBDYWxjdWxhdGUgUGVybWlzc2lvbnMgb24gU2VydmVyXHJcblx0XHRcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IChzcGFjZUlkKS0+XHJcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKVxyXG4iLCJ2YXIgY2xvbmUsIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QsIGZpbmRfcGVybWlzc2lvbl9vYmplY3QsIGludGVyc2VjdGlvblBsdXMsIHVuaW9uUGVybWlzc2lvbk9iamVjdHMsIHVuaW9uUGx1cztcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgb2JqO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKTtcbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgaXNPd25lciwgb2JqZWN0X2ZpZWxkc19rZXlzLCBwZXJtaXNzaW9ucywgcmVjb3JkX2NvbXBhbnlfaWQsIHJlY29yZF9jb21wYW55X2lkcywgcmVjb3JkX2lkLCByZWYsIHJlZjEsIHNlbGVjdCwgdXNlcl9jb21wYW55X2lkcztcbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gIH1cbiAgaWYgKHJlY29yZCAmJiBvYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIiAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuICAgICAgcmVjb3JkX2lkID0gcmVjb3JkLnBhcmVudC5faWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XG4gICAgICByZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgICB9XG4gICAgb2JqZWN0X2ZpZWxkc19rZXlzID0gXy5rZXlzKCgocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCkgfHwge30pIHx8IFtdO1xuICAgIHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcbiAgICBpZiAoc2VsZWN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdC5qb2luKCcsJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvcmQgPSBudWxsO1xuICAgIH1cbiAgfVxuICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSk7XG4gIGlmIChyZWNvcmQpIHtcbiAgICBpZiAocmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucykge1xuICAgICAgcmV0dXJuIHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnM7XG4gICAgfVxuICAgIGlzT3duZXIgPSByZWNvcmQub3duZXIgPT09IHVzZXJJZCB8fCAoKHJlZjEgPSByZWNvcmQub3duZXIpICE9IG51bGwgPyByZWYxLl9pZCA6IHZvaWQgMCkgPT09IHVzZXJJZDtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpO1xuICAgIH1cbiAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmNvbXBhbnlfaWQgOiB2b2lkIDA7XG4gICAgaWYgKHJlY29yZF9jb21wYW55X2lkICYmIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpICYmIHJlY29yZF9jb21wYW55X2lkLl9pZCkge1xuICAgICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWQ7XG4gICAgfVxuICAgIHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmNvbXBhbnlfaWRzIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSkpIHtcbiAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gXy51bmlvbihyZWNvcmRfY29tcGFueV9pZHMsIFtyZWNvcmRfY29tcGFueV9pZF0pO1xuICAgIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHVzZXJfY29tcGFueV9pZHMgJiYgdXNlcl9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJlY29yZC5sb2NrZWQgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICghXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcGVybWlzc2lvbnM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICAgIHZhciBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUsIG1hc3RlckFsbG93LCBtYXN0ZXJSZWNvcmRQZXJtLCByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMsIHJlc3VsdCwgc2hhcmluZywgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgaWYgKCFjdXJyZW50T2JqZWN0TmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFyZWxhdGVkTGlzdEl0ZW0pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmICghY3VycmVudFJlY29yZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgc2hhcmluZyA9IHJlbGF0ZWRMaXN0SXRlbS5zaGFyaW5nIHx8ICdtYXN0ZXJXcml0ZSc7XG4gICAgbWFzdGVyQWxsb3cgPSBmYWxzZTtcbiAgICBtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKTtcbiAgICBpZiAoc2hhcmluZyA9PT0gJ21hc3RlclJlYWQnKSB7XG4gICAgICBtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkO1xuICAgIH0gZWxzZSBpZiAoc2hhcmluZyA9PT0gJ21hc3RlcldyaXRlJykge1xuICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdDtcbiAgICB9XG4gICAgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSk7XG4gICAgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpO1xuICAgIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xO1xuICAgIHJlc3VsdCA9IF8uY2xvbmUocmVsYXRlZE9iamVjdFBlcm1pc3Npb25zKTtcbiAgICByZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICByZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBfaSwgaXNTcGFjZUFkbWluLCBwZXJtaXNzaW9ucywgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnQsIHBzZXRzQ3VycmVudE5hbWVzLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHtcbiAgICAgIG9iamVjdHM6IHt9LFxuICAgICAgYXNzaWduZWRfYXBwczogW11cbiAgICB9O1xuXG4gICAgLypcbiAgICBcdFx05p2D6ZmQ57uE6K+05piOOlxuICAgIFx0XHTlhoXnva7mnYPpmZDnu4QtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXG4gICAgXHRcdOiHquWumuS5ieadg+mZkOe7hC3mlbDmja7lupPkuK3mlrDlu7rnmoTpmaTlhoXnva7mnYPpmZDnu4Tku6XlpJbnmoTlhbbku5bmnYPpmZDnu4RcbiAgICBcdFx054m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ57uE77yI5Y2zdXNlcnPlsZ7mgKfkuI3lj6/phY3nva7vvIktYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3RcbiAgICBcdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ57uE77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ57uEXG4gICAgICovXG4gICAgcHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICB1c2VyczogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICBuYW1lOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBwc2V0c0FkbWluX3BvcyA9IG51bGw7XG4gICAgcHNldHNVc2VyX3BvcyA9IG51bGw7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0d1ZXN0X3BvcyA9IG51bGw7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IG51bGw7XG4gICAgcHNldHNTdXBwbGllcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbDtcbiAgICBpZiAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1N1cHBsaWVyICE9IG51bGwgPyBwc2V0c1N1cHBsaWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNTdXBwbGllcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXJyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJfaWRcIik7XG4gICAgICBwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAgICRpbjogc2V0X2lkc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgcHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJuYW1lXCIpO1xuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBmYWxzZTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBwc2V0cyA9IHtcbiAgICAgIHBzZXRzQWRtaW46IHBzZXRzQWRtaW4sXG4gICAgICBwc2V0c1VzZXI6IHBzZXRzVXNlcixcbiAgICAgIHBzZXRzQ3VycmVudDogcHNldHNDdXJyZW50LFxuICAgICAgcHNldHNNZW1iZXI6IHBzZXRzTWVtYmVyLFxuICAgICAgcHNldHNHdWVzdDogcHNldHNHdWVzdCxcbiAgICAgIHBzZXRzU3VwcGxpZXI6IHBzZXRzU3VwcGxpZXIsXG4gICAgICBwc2V0c0N1c3RvbWVyOiBwc2V0c0N1c3RvbWVyLFxuICAgICAgaXNTcGFjZUFkbWluOiBpc1NwYWNlQWRtaW4sXG4gICAgICBzcGFjZVVzZXI6IHNwYWNlVXNlcixcbiAgICAgIHBzZXRzQWRtaW5fcG9zOiBwc2V0c0FkbWluX3BvcyxcbiAgICAgIHBzZXRzVXNlcl9wb3M6IHBzZXRzVXNlcl9wb3MsXG4gICAgICBwc2V0c01lbWJlcl9wb3M6IHBzZXRzTWVtYmVyX3BvcyxcbiAgICAgIHBzZXRzR3Vlc3RfcG9zOiBwc2V0c0d1ZXN0X3BvcyxcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zOiBwc2V0c1N1cHBsaWVyX3BvcyxcbiAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zOiBwc2V0c0N1c3RvbWVyX3BvcyxcbiAgICAgIHBzZXRzQ3VycmVudF9wb3M6IHBzZXRzQ3VycmVudF9wb3NcbiAgICB9O1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX2FwcHMgPSBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lcztcbiAgICBfaSA9IDA7XG4gICAgXy5lYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24ob2JqZWN0LCBvYmplY3RfbmFtZSkge1xuICAgICAgX2krKztcbiAgICAgIGlmICghXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PT0gc3BhY2VJZCkge1xuICAgICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09PSAnMCcgfHwgKG9iamVjdC5pbl9kZXZlbG9wbWVudCAhPT0gJzAnICYmIGlzU3BhY2VBZG1pbikpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZCk7XG4gICAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICB1bmlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgaW50ZXJzZWN0aW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYXBwcywgaXNTcGFjZUFkbWluLCBwc2V0QmFzZSwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQ3VzdG9tZXIsIHBzZXRzU3VwcGxpZXIsIHBzZXRzVXNlciwgcmVmLCByZWYxLCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFwcHMgPSBbXTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJQcm9maWxlID0gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYucHJvZmlsZSA6IHZvaWQgMDtcbiAgICAgIHBzZXRCYXNlID0gcHNldHNVc2VyO1xuICAgICAgaWYgKHVzZXJQcm9maWxlKSB7XG4gICAgICAgIGlmICh1c2VyUHJvZmlsZSA9PT0gJ3N1cHBsaWVyJykge1xuICAgICAgICAgIHBzZXRCYXNlID0gcHNldHNTdXBwbGllcjtcbiAgICAgICAgfSBlbHNlIGlmICh1c2VyUHJvZmlsZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHBzZXRCYXNlID0gcHNldHNDdXN0b21lcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBzZXRCYXNlICE9IG51bGwgPyAocmVmMSA9IHBzZXRCYXNlLmFzc2lnbmVkX2FwcHMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIF8uZWFjaChwc2V0cywgZnVuY3Rpb24ocHNldCkge1xuICAgICAgICBpZiAoIXBzZXQuYXNzaWduZWRfYXBwcykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHNldC5uYW1lID09PSBcImFkbWluXCIgfHwgcHNldC5uYW1lID09PSBcInVzZXJcIiB8fCBwc2V0Lm5hbWUgPT09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy53aXRob3V0KF8udW5pcShhcHBzKSwgdm9pZCAwLCBudWxsKTtcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhYm91dE1lbnUsIGFkbWluTWVudXMsIGFsbE1lbnVzLCBjdXJyZW50UHNldE5hbWVzLCBpc1NwYWNlQWRtaW4sIG1lbnVzLCBvdGhlck1lbnVBcHBzLCBvdGhlck1lbnVzLCBwc2V0cywgcmVmLCByZWYxLCByZXN1bHQsIHVzZXJQcm9maWxlO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICB1c2VyczogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICBuYW1lOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYWRtaW5NZW51cyA9IChyZWYgPSBDcmVhdG9yLkFwcHMuYWRtaW4pICE9IG51bGwgPyByZWYuYWRtaW5fbWVudXMgOiB2b2lkIDA7XG4gICAgaWYgKCFhZG1pbk1lbnVzKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgPT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgYWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCAhPT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkoXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uYWRtaW5fbWVudXMgJiYgbi5faWQgIT09ICdhZG1pbic7XG4gICAgfSksICdzb3J0Jyk7XG4gICAgb3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpO1xuICAgIGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSk7XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmVzdWx0ID0gYWxsTWVudXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJQcm9maWxlID0gKChyZWYxID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjEucHJvZmlsZSA6IHZvaWQgMCkgfHwgJ3VzZXInO1xuICAgICAgY3VycmVudFBzZXROYW1lcyA9IHBzZXRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLm5hbWU7XG4gICAgICB9KTtcbiAgICAgIG1lbnVzID0gYWxsTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICAgICAgdmFyIHBzZXRzTWVudTtcbiAgICAgICAgcHNldHNNZW51ID0gbWVudS5wZXJtaXNzaW9uX3NldHM7XG4gICAgICAgIGlmIChwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YodXNlclByb2ZpbGUpID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGg7XG4gICAgICB9KTtcbiAgICAgIHJlc3VsdCA9IG1lbnVzO1xuICAgIH1cbiAgICByZXR1cm4gXy5zb3J0QnkocmVzdWx0LCBcInNvcnRcIik7XG4gIH07XG4gIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCkge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maW5kKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkXG4gICAgfSk7XG4gIH07XG4gIGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmlsdGVyKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgJGluOiBwZXJtaXNzaW9uX3NldF9pZHNcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICB9O1xuICB1bmlvblBlcm1pc3Npb25PYmplY3RzID0gZnVuY3Rpb24ocG9zLCBvYmplY3QsIHBzZXRzKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICByZXN1bHQgPSBbXTtcbiAgICBfLmVhY2gob2JqZWN0LnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihvcHMsIG9wc19rZXkpIHtcbiAgICAgIHZhciBjdXJyZW50UHNldCwgdGVtcE9wcztcbiAgICAgIGlmIChbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiXS5pbmRleE9mKG9wc19rZXkpIDwgMCkge1xuICAgICAgICBjdXJyZW50UHNldCA9IHBzZXRzLmZpbmQoZnVuY3Rpb24ocHNldCkge1xuICAgICAgICAgIHJldHVybiBwc2V0Lm5hbWUgPT09IG9wc19rZXk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY3VycmVudFBzZXQpIHtcbiAgICAgICAgICB0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9O1xuICAgICAgICAgIHRlbXBPcHMucGVybWlzc2lvbl9zZXRfaWQgPSBjdXJyZW50UHNldC5faWQ7XG4gICAgICAgICAgdGVtcE9wcy5vYmplY3RfbmFtZSA9IG9iamVjdC5vYmplY3RfbmFtZTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2godGVtcE9wcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCkge1xuICAgICAgcG9zLmZvckVhY2goZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgdmFyIHJlcGVhdEluZGV4LCByZXBlYXRQbztcbiAgICAgICAgcmVwZWF0SW5kZXggPSAwO1xuICAgICAgICByZXBlYXRQbyA9IHJlc3VsdC5maW5kKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgcmVwZWF0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICByZXR1cm4gaXRlbS5wZXJtaXNzaW9uX3NldF9pZCA9PT0gcG8ucGVybWlzc2lvbl9zZXRfaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVwZWF0UG8pIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZXN1bHQucHVzaChwbyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBvcztcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIGlzU3BhY2VBZG1pbiwgb2JqZWN0LCBvcHNldEFkbWluLCBvcHNldEN1c3RvbWVyLCBvcHNldEd1ZXN0LCBvcHNldE1lbWJlciwgb3BzZXRTdXBwbGllciwgb3BzZXRVc2VyLCBwZXJtaXNzaW9ucywgcG9zLCBwb3NBZG1pbiwgcG9zQ3VzdG9tZXIsIHBvc0d1ZXN0LCBwb3NNZW1iZXIsIHBvc1N1cHBsaWVyLCBwb3NVc2VyLCBwcm9mLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzQ3VzdG9tZXIsIHBzZXRzQ3VzdG9tZXJfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNTdXBwbGllciwgcHNldHNTdXBwbGllcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3Bvcywgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge307XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuICAgIGlmIChzcGFjZUlkID09PSAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSB8fCB0aGlzLnBzZXRzQWRtaW4gPyB0aGlzLnBzZXRzQWRtaW4gOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgfHwgdGhpcy5wc2V0c1VzZXIgPyB0aGlzLnBzZXRzVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNNZW1iZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSB8fCB0aGlzLnBzZXRzTWVtYmVyID8gdGhpcy5wc2V0c01lbWJlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0d1ZXN0ID0gXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSB8fCB0aGlzLnBzZXRzR3Vlc3QgPyB0aGlzLnBzZXRzR3Vlc3QgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1N1cHBsaWVyID0gXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSB8fCB0aGlzLnBzZXRzU3VwcGxpZXIgPyB0aGlzLnBzZXRzU3VwcGxpZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1c3RvbWVyID0gXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSB8fCB0aGlzLnBzZXRzQ3VzdG9tZXIgPyB0aGlzLnBzZXRzQ3VzdG9tZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3BvcztcbiAgICBwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3BvcztcbiAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3M7XG4gICAgcHNldHNDdXN0b21lcl9wb3MgPSB0aGlzLnBzZXRzQ3VzdG9tZXJfcG9zO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3M7XG4gICAgb3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fTtcbiAgICBvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fTtcbiAgICBvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge307XG4gICAgb3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICBvcHNldFN1cHBsaWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuc3VwcGxpZXIpIHx8IHt9O1xuICAgIG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge307XG4gICAgaWYgKHBzZXRzQWRtaW4pIHtcbiAgICAgIHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKTtcbiAgICAgIGlmIChwb3NBZG1pbikge1xuICAgICAgICBvcHNldEFkbWluLmFsbG93Q3JlYXRlID0gcG9zQWRtaW4uYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dEZWxldGUgPSBwb3NBZG1pbi5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd0VkaXQgPSBwb3NBZG1pbi5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dSZWFkID0gcG9zQWRtaW4uYWxsb3dSZWFkO1xuICAgICAgICBvcHNldEFkbWluLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLnZpZXdBbGxSZWNvcmRzID0gcG9zQWRtaW4udmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0QWRtaW4uZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0FkbWluLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5yZWFkYWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEFkbWluLnVucmVsYXRlZF9vYmplY3RzID0gcG9zQWRtaW4udW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NBZG1pbi51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlcikge1xuICAgICAgcG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpO1xuICAgICAgaWYgKHBvc1VzZXIpIHtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93Q3JlYXRlID0gcG9zVXNlci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93RGVsZXRlID0gcG9zVXNlci5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93RWRpdCA9IHBvc1VzZXIuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dSZWFkID0gcG9zVXNlci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0VXNlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zVXNlci5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIudmlld0FsbFJlY29yZHMgPSBwb3NVc2VyLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zVXNlci52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zVXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldFVzZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1VzZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRVc2VyLnVucmVhZGFibGVfZmllbGRzID0gcG9zVXNlci51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRVc2VyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zVXNlci51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRVc2VyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zVXNlci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRVc2VyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zVXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyKSB7XG4gICAgICBwb3NNZW1iZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzTWVtYmVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzTWVtYmVyLl9pZCk7XG4gICAgICBpZiAocG9zTWVtYmVyKSB7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93Q3JlYXRlID0gcG9zTWVtYmVyLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd0RlbGV0ZSA9IHBvc01lbWJlci5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dFZGl0ID0gcG9zTWVtYmVyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dSZWFkID0gcG9zTWVtYmVyLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRNZW1iZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci52aWV3QWxsUmVjb3JkcyA9IHBvc01lbWJlci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc01lbWJlci5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldE1lbWJlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zTWVtYmVyLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldE1lbWJlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc01lbWJlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QpIHtcbiAgICAgIHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKTtcbiAgICAgIGlmIChwb3NHdWVzdCkge1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93Q3JlYXRlID0gcG9zR3Vlc3QuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dEZWxldGUgPSBwb3NHdWVzdC5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd0VkaXQgPSBwb3NHdWVzdC5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dSZWFkID0gcG9zR3Vlc3QuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldEd1ZXN0Lm1vZGlmeUFsbFJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0LnZpZXdBbGxSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0d1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0R3Vlc3QuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0d1ZXN0LmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEd1ZXN0LnVucmVsYXRlZF9vYmplY3RzID0gcG9zR3Vlc3QudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NHdWVzdC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzU3VwcGxpZXIpIHtcbiAgICAgIHBvc1N1cHBsaWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1N1cHBsaWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzU3VwcGxpZXIuX2lkKTtcbiAgICAgIGlmIChwb3NTdXBwbGllcikge1xuICAgICAgICBvcHNldFN1cHBsaWVyLmFsbG93Q3JlYXRlID0gcG9zU3VwcGxpZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuYWxsb3dEZWxldGUgPSBwb3NTdXBwbGllci5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRTdXBwbGllci5hbGxvd0VkaXQgPSBwb3NTdXBwbGllci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuYWxsb3dSZWFkID0gcG9zU3VwcGxpZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldFN1cHBsaWVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NTdXBwbGllci5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnZpZXdBbGxSZWNvcmRzID0gcG9zU3VwcGxpZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NTdXBwbGllci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NTdXBwbGllci52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1N1cHBsaWVyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1N1cHBsaWVyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NTdXBwbGllci51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1N1cHBsaWVyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zU3VwcGxpZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NTdXBwbGllci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VzdG9tZXIpIHtcbiAgICAgIHBvc0N1c3RvbWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1c3RvbWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQ3VzdG9tZXIuX2lkKTtcbiAgICAgIGlmIChwb3NDdXN0b21lcikge1xuICAgICAgICBvcHNldEN1c3RvbWVyLmFsbG93Q3JlYXRlID0gcG9zQ3VzdG9tZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuYWxsb3dEZWxldGUgPSBwb3NDdXN0b21lci5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRDdXN0b21lci5hbGxvd0VkaXQgPSBwb3NDdXN0b21lci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuYWxsb3dSZWFkID0gcG9zQ3VzdG9tZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldEN1c3RvbWVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NDdXN0b21lci5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnZpZXdBbGxSZWNvcmRzID0gcG9zQ3VzdG9tZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NDdXN0b21lci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0N1c3RvbWVyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0N1c3RvbWVyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NDdXN0b21lci51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0N1c3RvbWVyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zQ3VzdG9tZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NDdXN0b21lci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3BhY2VJZCA9PT0gJ2NvbW1vbicpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFjZVVzZXIgPSBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgfHwgdGhpcy5zcGFjZVVzZXIgPyB0aGlzLnNwYWNlVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChzcGFjZVVzZXIpIHtcbiAgICAgICAgICAgIHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZTtcbiAgICAgICAgICAgIGlmIChwcm9mKSB7XG4gICAgICAgICAgICAgIGlmIChwcm9mID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnbWVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2d1ZXN0Jykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnc3VwcGxpZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0Q3VzdG9tZXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0cywgXCJfaWRcIik7XG4gICAgICBwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKTtcbiAgICAgIHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKTtcbiAgICAgIF8uZWFjaChwb3MsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIGlmIChwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dSZWFkKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBwby5kaXNhYmxlZF9saXN0X3ZpZXdzKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIHBvLnVuZWRpdGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHBvLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAob2JqZWN0LmlzX3ZpZXcpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdO1xuICAgIH1cbiAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgaWYgKG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcikge1xuICAgICAgcGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXI7XG4gICAgfVxuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJcclxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcclxuXHJcbk1ldGVvci5zdGFydHVwICgpLT5cclxuXHRjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SXHJcblx0b3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcclxuXHRpZiBjcmVhdG9yX2RiX3VybFxyXG5cdFx0aWYgIW9wbG9nX3VybFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIilcclxuXHRcdENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge29wbG9nVXJsOiBvcGxvZ191cmx9KX1cclxuXHJcbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSAob2JqZWN0KS0+XHJcbiNcdGlmIG9iamVjdC50YWJsZV9uYW1lICYmIG9iamVjdC50YWJsZV9uYW1lLmVuZHNXaXRoKFwiX19jXCIpXHJcbiNcdFx0cmV0dXJuIG9iamVjdC50YWJsZV9uYW1lXHJcbiNcdGVsc2VcclxuI1x0XHRyZXR1cm4gb2JqZWN0Lm5hbWVcclxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcclxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gKG9iamVjdCktPlxyXG5cdGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpXHJcblx0aWYgZGJbY29sbGVjdGlvbl9rZXldXHJcblx0XHRyZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldXHJcblx0ZWxzZSBpZiBvYmplY3QuZGJcclxuXHRcdHJldHVybiBvYmplY3QuZGJcclxuXHJcblx0aWYgQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cclxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxyXG5cdGVsc2VcclxuXHRcdGlmIG9iamVjdC5jdXN0b21cclxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSlcclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgY29sbGVjdGlvbl9rZXkgPT0gJ19zbXNfcXVldWUnICYmIFNNU1F1ZXVlPy5jb2xsZWN0aW9uXHJcblx0XHRcdFx0cmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb25cclxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpXHJcblxyXG5cclxuIiwidmFyIHN0ZWVkb3NDb3JlO1xuXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdG9yX2RiX3VybCwgb3Bsb2dfdXJsO1xuICBjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SO1xuICBvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUjtcbiAgaWYgKGNyZWF0b3JfZGJfdXJsKSB7XG4gICAgaWYgKCFvcGxvZ191cmwpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtcbiAgICAgIF9kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7XG4gICAgICAgIG9wbG9nVXJsOiBvcGxvZ191cmxcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxufSk7XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBjb2xsZWN0aW9uX2tleTtcbiAgY29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdCk7XG4gIGlmIChkYltjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2UgaWYgKG9iamVjdC5kYikge1xuICAgIHJldHVybiBvYmplY3QuZGI7XG4gIH1cbiAgaWYgKENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3QuY3VzdG9tKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbGxlY3Rpb25fa2V5ID09PSAnX3Ntc19xdWV1ZScgJiYgKHR5cGVvZiBTTVNRdWV1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTTVNRdWV1ZSAhPT0gbnVsbCA/IFNNU1F1ZXVlLmNvbGxlY3Rpb24gOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpO1xuICAgIH1cbiAgfVxufTtcbiIsIkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9XHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcblx0IyDlrprkuYnlhajlsYAgYWN0aW9ucyDlh73mlbBcdFxyXG5cdENyZWF0b3IuYWN0aW9ucyA9IChhY3Rpb25zKS0+XHJcblx0XHRfLmVhY2ggYWN0aW9ucywgKHRvZG8sIGFjdGlvbl9uYW1lKS0+XHJcblx0XHRcdENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvIFxyXG5cclxuXHRDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSAob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKS0+XHJcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRcdGlmIGFjdGlvbj8udG9kb1xyXG5cdFx0XHRpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJzdHJpbmdcIlxyXG5cdFx0XHRcdHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dXHJcblx0XHRcdGVsc2UgaWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwiZnVuY3Rpb25cIlxyXG5cdFx0XHRcdHRvZG8gPSBhY3Rpb24udG9kb1x0XHJcblx0XHRcdGlmICFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkXHJcblx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuXHRcdFx0aWYgdG9kb1xyXG5cdFx0XHRcdCMgaXRlbV9lbGVtZW505Li656m65pe25bqU6K+l6K6+572u6buY6K6k5YC877yI5a+56LGh55qEbmFtZeWtl+aute+8ie+8jOWQpuWImW1vcmVBcmdz5ou/5Yiw55qE5ZCO57ut5Y+C5pWw5L2N572u5bCx5LiN5a+5XHJcblx0XHRcdFx0aXRlbV9lbGVtZW50ID0gaWYgaXRlbV9lbGVtZW50IHRoZW4gaXRlbV9lbGVtZW50IGVsc2UgXCJcIlxyXG5cdFx0XHRcdG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxyXG5cdFx0XHRcdHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncylcclxuXHRcdFx0XHR0b2RvLmFwcGx5IHtcclxuXHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0cmVjb3JkX2lkOiByZWNvcmRfaWRcclxuXHRcdFx0XHRcdG9iamVjdDogb2JqXHJcblx0XHRcdFx0XHRhY3Rpb246IGFjdGlvblxyXG5cdFx0XHRcdFx0aXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnRcclxuXHRcdFx0XHRcdHJlY29yZDogcmVjb3JkXHJcblx0XHRcdFx0fSwgdG9kb0FyZ3NcclxuXHRcdFx0XHRcclxuXHJcblx0Q3JlYXRvci5hY3Rpb25zIFxyXG5cdFx0IyDlnKjmraTlrprkuYnlhajlsYAgYWN0aW9uc1xyXG5cdFx0XCJzdGFuZGFyZF9xdWVyeVwiOiAoKS0+XHJcblx0XHRcdE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKVxyXG5cclxuXHRcdFwic3RhbmRhcmRfbmV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbb2JqZWN0X25hbWVdXHJcblx0XHRcdGlmIGlkcz8ubGVuZ3RoXHJcblx0XHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cclxuXHRcdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxyXG5cdFx0XHRcdHJlY29yZF9pZCA9IGlkc1swXVxyXG5cdFx0XHRcdGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgZG9jXHJcblx0XHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cclxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSlcclxuXHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cclxuXHRcdFx0XHQkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKClcclxuXHRcdFx0cmV0dXJuIFxyXG5cdFx0XHRcclxuXHRcdFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdHdpbmRvdy5vcGVuKFxyXG5cdFx0XHRcdGhyZWYsXHJcblx0XHRcdFx0J19ibGFuaycsXHJcblx0XHRcdFx0J3dpZHRoPTgwMCwgaGVpZ2h0PTYwMCwgbGVmdD01MCwgdG9wPSA1MCwgdG9vbGJhcj1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCByZXNpemFibGU9eWVzLCBzY3JvbGxiYXJzPXllcydcclxuXHRcdFx0KVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRcInN0YW5kYXJkX29wZW5fdmlld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XHJcblx0XHRcdGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxyXG5cdFx0XHR3aW5kb3cub3BlbihcclxuXHRcdFx0XHRocmVmLFxyXG5cdFx0XHRcdCdfYmxhbmsnLFxyXG5cdFx0XHRcdCd3aWR0aD04MDAsIGhlaWdodD02MDAsIGxlZnQ9NTAsIHRvcD0gNTAsIHRvb2xiYXI9bm8sIHN0YXR1cz1ubywgbWVudWJhcj1ubywgcmVzaXphYmxlPXllcywgc2Nyb2xsYmFycz15ZXMnXHJcblx0XHRcdClcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0XCJzdGFuZGFyZF9lZGl0XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cclxuXHRcdFx0aWYgcmVjb3JkX2lkXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlXHJcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCByZWNvcmRcclxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAncmVsb2FkX2R4bGlzdCcsIGZhbHNlXHJcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkXHJcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cclxuXHRcdFx0XHRcdFx0JChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcclxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XHJcblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcclxuXHJcblx0XHRcInN0YW5kYXJkX2RlbGV0ZVwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKS0+XHJcblx0XHRcdGNvbnNvbGUubG9nKFwic3RhbmRhcmRfZGVsZXRlXCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkKVxyXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0XHRcdGlmKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlPy5uYW1lKVxyXG5cdFx0XHRcdHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZT8ubmFtZVxyXG5cclxuXHRcdFx0aWYgcmVjb3JkX3RpdGxlXHJcblx0XHRcdFx0dGV4dCA9IHQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCIsIFwiI3tvYmplY3QubGFiZWx9IFxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRleHQgPSB0IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiLCBcIiN7b2JqZWN0LmxhYmVsfVwiXHJcblx0XHRcdHN3YWxcclxuXHRcdFx0XHR0aXRsZTogdCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCIsIFwiI3tvYmplY3QubGFiZWx9XCJcclxuXHRcdFx0XHR0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPiN7dGV4dH08L2Rpdj5cIlxyXG5cdFx0XHRcdGh0bWw6IHRydWVcclxuXHRcdFx0XHRzaG93Q2FuY2VsQnV0dG9uOnRydWVcclxuXHRcdFx0XHRjb25maXJtQnV0dG9uVGV4dDogdCgnRGVsZXRlJylcclxuXHRcdFx0XHRjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxyXG5cdFx0XHRcdChvcHRpb24pIC0+XHJcblx0XHRcdFx0XHRpZiBvcHRpb25cclxuXHRcdFx0XHRcdFx0Q3JlYXRvci5vZGF0YS5kZWxldGUgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgKCktPlxyXG5cdFx0XHRcdFx0XHRcdGlmIHJlY29yZF90aXRsZVxyXG5cdFx0XHRcdFx0XHRcdFx0IyBpbmZvID0gb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiICsgXCLlt7LliKDpmaRcIlxyXG5cdFx0XHRcdFx0XHRcdFx0aW5mbyA9dCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRpbmZvID0gdCgnY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfc3VjJylcclxuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyBpbmZvXHJcblx0XHRcdFx0XHRcdFx0IyDmlofku7bniYjmnKzkuLpcImNmcy5maWxlcy5maWxlcmVjb3JkXCLvvIzpnIDopoHmm7/mjaLkuLpcImNmcy1maWxlcy1maWxlcmVjb3JkXCJcclxuXHRcdFx0XHRcdFx0XHRncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csXCItXCIpXHJcblx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXHJcblx0XHRcdFx0XHRcdFx0dW5sZXNzIGdyaWRDb250YWluZXI/Lmxlbmd0aFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgd2luZG93Lm9wZW5lclxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc09wZW5lclJlbW92ZSA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcclxuXHRcdFx0XHRcdFx0XHRpZiBncmlkQ29udGFpbmVyPy5sZW5ndGhcclxuXHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJylcclxuXHRcdFx0XHRcdFx0XHRpZiBkeERhdGFHcmlkSW5zdGFuY2VcclxuXHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSlcclxuXHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZSBvciAhZHhEYXRhR3JpZEluc3RhbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuY2xvc2UoKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgYW5kICFTdGVlZG9zLmlzTW9iaWxlKCkgYW5kIGxpc3Rfdmlld19pZCAhPSAnY2FsZW5kYXInXHJcblx0XHRcdFx0XHRcdFx0XHRcdGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcclxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRcdHVubGVzcyBsaXN0X3ZpZXdfaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBcImFsbFwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIuZ28gXCIvYXBwLyN7YXBwaWR9LyN7b2JqZWN0X25hbWV9L2dyaWQvI3tsaXN0X3ZpZXdfaWR9XCJcclxuXHRcdFx0XHRcdFx0XHRpZiBjYWxsX2JhY2sgYW5kIHR5cGVvZiBjYWxsX2JhY2sgPT0gXCJmdW5jdGlvblwiXHJcblx0XHRcdFx0XHRcdFx0XHRjYWxsX2JhY2soKVxyXG4iLCJDcmVhdG9yLmFjdGlvbnNCeU5hbWUgPSB7fTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmFjdGlvbnMgPSBmdW5jdGlvbihhY3Rpb25zKSB7XG4gICAgcmV0dXJuIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbih0b2RvLCBhY3Rpb25fbmFtZSkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYWN0aW9uLCByZWNvcmRfaWQsIGl0ZW1fZWxlbWVudCwgbGlzdF92aWV3X2lkLCByZWNvcmQpIHtcbiAgICB2YXIgbW9yZUFyZ3MsIG9iaiwgdG9kbywgdG9kb0FyZ3M7XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwKSB7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uLnRvZG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0b2RvID0gYWN0aW9uLnRvZG87XG4gICAgICB9XG4gICAgICBpZiAoIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICAgICAgcmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB9XG4gICAgICBpZiAodG9kbykge1xuICAgICAgICBpdGVtX2VsZW1lbnQgPSBpdGVtX2VsZW1lbnQgPyBpdGVtX2VsZW1lbnQgOiBcIlwiO1xuICAgICAgICBtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG4gICAgICAgIHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncyk7XG4gICAgICAgIHJldHVybiB0b2RvLmFwcGx5KHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgb2JqZWN0OiBvYmosXG4gICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgaXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnQsXG4gICAgICAgICAgcmVjb3JkOiByZWNvcmRcbiAgICAgICAgfSwgdG9kb0FyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5hY3Rpb25zKHtcbiAgICBcInN0YW5kYXJkX3F1ZXJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfbmV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGRvYywgaWRzO1xuICAgICAgaWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICByZWNvcmRfaWQgPSBpZHNbMF07XG4gICAgICAgIGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBkb2MpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKSk7XG4gICAgICB9XG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB3aW5kb3cub3BlbihocmVmLCAnX2JsYW5rJywgJ3dpZHRoPTgwMCwgaGVpZ2h0PTYwMCwgbGVmdD01MCwgdG9wPSA1MCwgdG9vbGJhcj1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCByZXNpemFibGU9eWVzLCBzY3JvbGxiYXJzPXllcycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgaHJlZjtcbiAgICAgIGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIHdpbmRvdy5vcGVuKGhyZWYsICdfYmxhbmsnLCAnd2lkdGg9ODAwLCBoZWlnaHQ9NjAwLCBsZWZ0PTUwLCB0b3A9IDUwLCB0b29sYmFyPW5vLCBzdGF0dXM9bm8sIG1lbnViYXI9bm8sIHJlc2l6YWJsZT15ZXMsIHNjcm9sbGJhcnM9eWVzJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2VkaXRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2UpIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2RlbGV0ZVwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spIHtcbiAgICAgIHZhciBvYmplY3QsIHRleHQ7XG4gICAgICBjb25zb2xlLmxvZyhcInN0YW5kYXJkX2RlbGV0ZVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCk7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiAocmVjb3JkX3RpdGxlICE9IG51bGwgPyByZWNvcmRfdGl0bGUubmFtZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlICE9IG51bGwgPyByZWNvcmRfdGl0bGUubmFtZSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgdGV4dCA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCIsIG9iamVjdC5sYWJlbCArIFwiIFxcXCJcIiArIHJlY29yZF90aXRsZSArIFwiXFxcIlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHQgPSB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiLCBcIlwiICsgb2JqZWN0LmxhYmVsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzd2FsKHtcbiAgICAgICAgdGl0bGU6IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZVwiLCBcIlwiICsgb2JqZWN0LmxhYmVsKSxcbiAgICAgICAgdGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz5cIiArIHRleHQgKyBcIjwvZGl2PlwiLFxuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogdCgnRGVsZXRlJyksXG4gICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXG4gICAgICB9LCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgaWYgKG9wdGlvbikge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLm9kYXRhW1wiZGVsZXRlXCJdKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFwcGlkLCBkeERhdGFHcmlkSW5zdGFuY2UsIGdyaWRDb250YWluZXIsIGdyaWRPYmplY3ROYW1lQ2xhc3MsIGluZm8sIGlzT3BlbmVyUmVtb3ZlO1xuICAgICAgICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICAgICAgICBpbmZvID0gdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyAoXCJcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaW5mbyA9IHQoJ2NyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3N1YycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoaW5mbyk7XG4gICAgICAgICAgICBncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csIFwiLVwiKTtcbiAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgIGlmICghKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICBpZiAod2luZG93Lm9wZW5lcikge1xuICAgICAgICAgICAgICAgIGlzT3BlbmVyUmVtb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkeERhdGFHcmlkSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVGVtcGxhdGUuY3JlYXRvcl9ncmlkLnJlZnJlc2goZHhEYXRhR3JpZEluc3RhbmNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzT3BlbmVyUmVtb3ZlIHx8ICFkeERhdGFHcmlkSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgaWYgKGlzT3BlbmVyUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmIGxpc3Rfdmlld19pZCAhPT0gJ2NhbGVuZGFyJykge1xuICAgICAgICAgICAgICAgIGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgICAgICAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICAgICAgICAgICAgbGlzdF92aWV3X2lkID0gXCJhbGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHAvXCIgKyBhcHBpZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhbGxfYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIl19
