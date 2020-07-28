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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiZSIsInN0ZWVkb3NDb3JlIiwicmVxdWlyZSIsIk1ldGVvciIsImlzRGV2ZWxvcG1lbnQiLCJzdGFydHVwIiwiZXgiLCJpbml0IiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwiRmliZXIiLCJwYXRoIiwiZGVwcyIsImFwcCIsIlRyYWNrZXIiLCJEZXBlbmRlbmN5Iiwib2JqZWN0IiwiX1RFTVBMQVRFIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsImZpbHRlcnNGdW5jdGlvbiIsIk1hdGNoIiwiT3B0aW9uYWwiLCJPbmVPZiIsIkZ1bmN0aW9uIiwiU3RyaW5nIiwib3B0aW9uc0Z1bmN0aW9uIiwiY3JlYXRlRnVuY3Rpb24iLCJpc1NlcnZlciIsImZpYmVyTG9hZE9iamVjdHMiLCJvYmoiLCJvYmplY3RfbmFtZSIsImxvYWRPYmplY3RzIiwicnVuIiwibmFtZSIsImxpc3Rfdmlld3MiLCJzcGFjZSIsImdldENvbGxlY3Rpb25OYW1lIiwiXyIsImNsb25lIiwiY29udmVydE9iamVjdCIsIk9iamVjdCIsImluaXRUcmlnZ2VycyIsImluaXRMaXN0Vmlld3MiLCJnZXRPYmplY3ROYW1lIiwiZ2V0T2JqZWN0Iiwic3BhY2VfaWQiLCJyZWYiLCJyZWYxIiwiaXNBcnJheSIsImlzQ2xpZW50IiwiZGVwZW5kIiwiU2Vzc2lvbiIsImdldCIsIm9iamVjdHNCeU5hbWUiLCJnZXRPYmplY3RCeUlkIiwib2JqZWN0X2lkIiwiZmluZFdoZXJlIiwiX2lkIiwicmVtb3ZlT2JqZWN0IiwiZ2V0Q29sbGVjdGlvbiIsInNwYWNlSWQiLCJfY29sbGVjdGlvbl9uYW1lIiwicmVtb3ZlQ29sbGVjdGlvbiIsImlzU3BhY2VBZG1pbiIsInVzZXJJZCIsImZpbmRPbmUiLCJmaWVsZHMiLCJhZG1pbnMiLCJpbmRleE9mIiwiZXZhbHVhdGVGb3JtdWxhIiwiZm9ybXVsYXIiLCJjb250ZXh0Iiwib3B0aW9ucyIsImlzU3RyaW5nIiwiRm9ybXVsYXIiLCJjaGVja0Zvcm11bGEiLCJldmFsdWF0ZUZpbHRlcnMiLCJmaWx0ZXJzIiwic2VsZWN0b3IiLCJlYWNoIiwiZmlsdGVyIiwiYWN0aW9uIiwidmFsdWUiLCJsZW5ndGgiLCJpc0NvbW1vblNwYWNlIiwiZ2V0T3JkZXJseVNldEJ5SWRzIiwiZG9jcyIsImlkcyIsImlkX2tleSIsImhpdF9maXJzdCIsInZhbHVlcyIsImdldFByb3BlcnR5Iiwic29ydEJ5IiwiZG9jIiwiX2luZGV4Iiwic29ydGluZ01ldGhvZCIsInZhbHVlMSIsInZhbHVlMiIsImlzVmFsdWUxRW1wdHkiLCJpc1ZhbHVlMkVtcHR5IiwibG9jYWxlIiwia2V5IiwiRGF0ZSIsImdldFRpbWUiLCJTdGVlZG9zIiwidG9TdHJpbmciLCJsb2NhbGVDb21wYXJlIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfb2JqZWN0IiwicGVybWlzc2lvbnMiLCJyZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0TWFwIiwicmVsYXRlZF9vYmplY3RzIiwiaXNFbXB0eSIsIm9iak5hbWUiLCJpc09iamVjdCIsIm9iamVjdE5hbWUiLCJyZWxhdGVkX29iamVjdCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwidHlwZSIsInJlZmVyZW5jZV90byIsImZvcmVpZ25fa2V5Iiwic2hhcmluZyIsImVuYWJsZU9iak5hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJlbmFibGVfZmlsZXMiLCJwdXNoIiwic3BsaWNlIiwiZW5hYmxlX3Rhc2tzIiwiZW5hYmxlX25vdGVzIiwiZW5hYmxlX2V2ZW50cyIsImVuYWJsZV9pbnN0YW5jZXMiLCJlbmFibGVfYXBwcm92YWxzIiwiZ2V0VXNlckNvbnRleHQiLCJpc1VuU2FmZU1vZGUiLCJVU0VSX0NPTlRFWFQiLCJzcGFjZV91c2VyX29yZyIsInN1Iiwic3VGaWVsZHMiLCJFcnJvciIsIm1vYmlsZSIsInBvc2l0aW9uIiwiZW1haWwiLCJjb21wYW55Iiwib3JnYW5pemF0aW9uIiwiY29tcGFueV9pZCIsImNvbXBhbnlfaWRzIiwidXNlciIsImZ1bGxuYW1lIiwiZ2V0UmVsYXRpdmVVcmwiLCJ1cmwiLCJpc0Z1bmN0aW9uIiwiaXNDb3Jkb3ZhIiwic3RhcnRzV2l0aCIsInRlc3QiLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwiUk9PVF9VUkxfUEFUSF9QUkVGSVgiLCJnZXRVc2VyQ29tcGFueUlkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJwcm9jZXNzUGVybWlzc2lvbnMiLCJwbyIsImFsbG93Q3JlYXRlIiwiYWxsb3dSZWFkIiwiYWxsb3dFZGl0IiwiYWxsb3dEZWxldGUiLCJ2aWV3QWxsUmVjb3JkcyIsInZpZXdDb21wYW55UmVjb3JkcyIsIm1vZGlmeUNvbXBhbnlSZWNvcmRzIiwiZ2V0VGVtcGxhdGVTcGFjZUlkIiwic2V0dGluZ3MiLCJ0ZW1wbGF0ZVNwYWNlSWQiLCJnZXRDbG91ZEFkbWluU3BhY2VJZCIsImNsb3VkQWRtaW5TcGFjZUlkIiwiaXNUZW1wbGF0ZVNwYWNlIiwiaXNDbG91ZEFkbWluU3BhY2UiLCJwcm9jZXNzIiwiZW52IiwiU1RFRURPU19TVE9SQUdFX0RJUiIsInN0ZWVkb3NTdG9yYWdlRGlyIiwicmVzb2x2ZSIsImpvaW4iLCJfX21ldGVvcl9ib290c3RyYXBfXyIsInNlcnZlckRpciIsIm1ldGhvZHMiLCJjb2xsZWN0aW9uIiwibmFtZV9maWVsZF9rZXkiLCJvcHRpb25zX2xpbWl0IiwicXVlcnkiLCJxdWVyeV9vcHRpb25zIiwicmVjb3JkcyIsInJlc3VsdHMiLCJzZWFyY2hUZXh0UXVlcnkiLCJzZWxlY3RlZCIsInNvcnQiLCJwYXJhbXMiLCJOQU1FX0ZJRUxEX0tFWSIsInNlYXJjaFRleHQiLCIkcmVnZXgiLCIkb3IiLCIkaW4iLCJleHRlbmQiLCIkbmluIiwiZmlsdGVyUXVlcnkiLCJsaW1pdCIsImZpbmQiLCJmZXRjaCIsInJlY29yZCIsImxhYmVsIiwibWVzc2FnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsImJveCIsImN1cnJlbnRfdXNlcl9pZCIsImN1cnJlbnRfdXNlcl9pbmZvIiwiZmxvd0lkIiwiaGFzaERhdGEiLCJpbnMiLCJpbnNJZCIsInJlY29yZF9pZCIsInJlZGlyZWN0X3VybCIsInJlZjIiLCJ4X2F1dGhfdG9rZW4iLCJ4X3VzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsImJvZHkiLCJjaGVjayIsImluc3RhbmNlSWQiLCJmbG93IiwiaW5ib3hfdXNlcnMiLCJpbmNsdWRlcyIsImNjX3VzZXJzIiwib3V0Ym94X3VzZXJzIiwic3RhdGUiLCJzdWJtaXR0ZXIiLCJhcHBsaWNhbnQiLCJwZXJtaXNzaW9uTWFuYWdlciIsImdldEZsb3dQZXJtaXNzaW9ucyIsInNwYWNlcyIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsInVwZGF0ZSIsIiRwdWxsIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwicmVhc29uIiwiZ2V0SW5pdFdpZHRoUGVyY2VudCIsImNvbHVtbnMiLCJfc2NoZW1hIiwiY29sdW1uX251bSIsImluaXRfd2lkdGhfcGVyY2VudCIsImdldFNjaGVtYSIsImZpZWxkX25hbWUiLCJmaWVsZCIsImlzX3dpZGUiLCJwaWNrIiwiYXV0b2Zvcm0iLCJnZXRGaWVsZElzV2lkZSIsImdldFRhYnVsYXJPcmRlciIsImxpc3Rfdmlld19pZCIsInNldHRpbmciLCJtYXAiLCJjb2x1bW4iLCJoaWRkZW4iLCJjb21wYWN0Iiwib3JkZXIiLCJpbmRleCIsImRlZmF1bHRfZXh0cmFfY29sdW1ucyIsImV4dHJhX2NvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0Q29sdW1ucyIsImdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMiLCJ1bmlvbiIsImdldE9iamVjdERlZmF1bHRTb3J0IiwiVGFidWxhclNlbGVjdGVkSWRzIiwiY29udmVydExpc3RWaWV3IiwiZGVmYXVsdF92aWV3IiwibGlzdF92aWV3IiwibGlzdF92aWV3X25hbWUiLCJkZWZhdWx0X2NvbHVtbnMiLCJkZWZhdWx0X21vYmlsZV9jb2x1bW5zIiwib2l0ZW0iLCJtb2JpbGVfY29sdW1ucyIsImhhcyIsImluY2x1ZGUiLCJmaWx0ZXJfc2NvcGUiLCJwYXJzZSIsImZvckVhY2giLCJfdmFsdWUiLCJnZXRSZWxhdGVkTGlzdCIsImxpc3QiLCJtYXBMaXN0IiwicmVsYXRlZExpc3ROYW1lcyIsInJlbGF0ZWRMaXN0T2JqZWN0cyIsInJlbGF0ZWRfb2JqZWN0X25hbWVzIiwidW5yZWxhdGVkX29iamVjdHMiLCJvYmpPck5hbWUiLCJyZWxhdGVkIiwiaXNfZmlsZSIsImN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0IiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9pdGVtIiwicmVsYXRlZE9iamVjdCIsInRhYnVsYXJfb3JkZXIiLCJ3aXRob3V0IiwidHJhbnNmb3JtU29ydFRvVGFidWxhciIsInJlcGxhY2UiLCJwbHVjayIsImRpZmZlcmVuY2UiLCJ2IiwiaXNBY3RpdmUiLCJnZXRPYmplY3RGaXJzdExpc3RWaWV3IiwiZmlyc3QiLCJnZXRMaXN0Vmlld3MiLCJnZXRMaXN0VmlldyIsImV4YWMiLCJsaXN0Vmlld3MiLCJnZXRMaXN0Vmlld0lzUmVjZW50IiwibGlzdFZpZXciLCJwaWNrT2JqZWN0TW9iaWxlQ29sdW1ucyIsImNvdW50IiwiZ2V0RmllbGQiLCJpc05hbWVDb2x1bW4iLCJpdGVtQ291bnQiLCJtYXhDb3VudCIsIm1heFJvd3MiLCJuYW1lQ29sdW1uIiwibmFtZUtleSIsInJlc3VsdCIsIml0ZW0iLCJnZXRPYmplY3REZWZhdWx0VmlldyIsImRlZmF1bHRWaWV3IiwidXNlX21vYmlsZV9jb2x1bW5zIiwiaXNBbGxWaWV3IiwiaXNSZWNlbnRWaWV3IiwidGFidWxhckNvbHVtbnMiLCJ0YWJ1bGFyX3NvcnQiLCJjb2x1bW5faW5kZXgiLCJ0cmFuc2Zvcm1Tb3J0VG9EWCIsImR4X3NvcnQiLCJSZWdFeCIsIlJlZ0V4cCIsIl9yZWdFeE1lc3NhZ2VzIiwiX2dsb2JhbE1lc3NhZ2VzIiwicmVnRXgiLCJleHAiLCJtc2ciLCJtZXNzYWdlcyIsImV2YWxJbkNvbnRleHQiLCJqcyIsImV2YWwiLCJjYWxsIiwiY29udmVydEZpZWxkIiwiZ2V0T3B0aW9uIiwib3B0aW9uIiwiZm9vIiwic3BsaXQiLCJjb2xvciIsImFsbE9wdGlvbnMiLCJwaWNrbGlzdCIsInBpY2tsaXN0T3B0aW9ucyIsImdldFBpY2tsaXN0IiwiZ2V0UGlja0xpc3RPcHRpb25zIiwicmV2ZXJzZSIsImVuYWJsZSIsImRlZmF1bHRWYWx1ZSIsInRyaWdnZXJzIiwidHJpZ2dlciIsIl90b2RvIiwiX3RvZG9fZnJvbV9jb2RlIiwiX3RvZG9fZnJvbV9kYiIsIm9uIiwidG9kbyIsImFjdGlvbnMiLCJfdmlzaWJsZSIsImVycm9yMSIsImFjdGlvbnNCeU5hbWUiLCJ2aXNpYmxlIiwiX29wdGlvbnMiLCJfdHlwZSIsImJlZm9yZU9wZW5GdW5jdGlvbiIsImlzX2NvbXBhbnlfbGltaXRlZCIsIm1heCIsIm1pbiIsIl9vcHRpb24iLCJrIiwiX3JlZ0V4IiwiX21pbiIsIl9tYXgiLCJOdW1iZXIiLCJCb29sZWFuIiwiX29wdGlvbnNGdW5jdGlvbiIsIl9yZWZlcmVuY2VfdG8iLCJfY3JlYXRlRnVuY3Rpb24iLCJfYmVmb3JlT3BlbkZ1bmN0aW9uIiwiX2ZpbHRlcnNGdW5jdGlvbiIsIl9kZWZhdWx0VmFsdWUiLCJfaXNfY29tcGFueV9saW1pdGVkIiwiX2ZpbHRlcnMiLCJpc0RhdGUiLCJwb3AiLCJfaXNfZGF0ZSIsImZvcm0iLCJ2YWwiLCJyZWxhdGVkT2JqSW5mbyIsIlBSRUZJWCIsIl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSIsInByZWZpeCIsImZpZWxkVmFyaWFibGUiLCJyZWciLCJyZXYiLCJtIiwiJDEiLCJmb3JtdWxhX3N0ciIsIl9DT05URVhUIiwiX1ZBTFVFUyIsImlzQm9vbGVhbiIsInRvYXN0ciIsImZvcm1hdE9iamVjdE5hbWUiLCJfYmFzZU9iamVjdCIsIl9kYiIsImRlZmF1bHRMaXN0Vmlld0lkIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsInJlZjMiLCJzY2hlbWEiLCJzZWxmIiwiYmFzZU9iamVjdCIsInBlcm1pc3Npb25fc2V0IiwiaWNvbiIsImRlc2NyaXB0aW9uIiwiaXNfdmlldyIsImlzX2VuYWJsZSIsImFsbG93X2FjdGlvbnMiLCJlbmFibGVfc2VhcmNoIiwicGFnaW5nIiwiZW5hYmxlX2FwaSIsImN1c3RvbSIsImVuYWJsZV9zaGFyZSIsImVuYWJsZV90cmVlIiwic2lkZWJhciIsIm9wZW5fd2luZG93IiwiZmlsdGVyX2NvbXBhbnkiLCJjYWxlbmRhciIsImVuYWJsZV9jaGF0dGVyIiwiZW5hYmxlX3RyYXNoIiwiZW5hYmxlX3NwYWNlX2dsb2JhbCIsImVuYWJsZV9mb2xsb3ciLCJlbmFibGVfd29ya2Zsb3ciLCJpbl9kZXZlbG9wbWVudCIsImlkRmllbGROYW1lIiwiZGF0YWJhc2VfbmFtZSIsImlzX25hbWUiLCJwcmltYXJ5IiwiZmlsdGVyYWJsZSIsInJlYWRvbmx5IiwiaXRlbV9uYW1lIiwiY29weUl0ZW0iLCJhZG1pbiIsImFsbCIsImxpc3Rfdmlld19pdGVtIiwiUmVhY3RpdmVWYXIiLCJjcmVhdGVDb2xsZWN0aW9uIiwiX25hbWUiLCJnZXRPYmplY3RTY2hlbWEiLCJjb250YWlucyIsImF0dGFjaFNjaGVtYSIsIl9zaW1wbGVTY2hlbWEiLCJnZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCIsImJvb3RzdHJhcExvYWRlZCIsImZpZWxkc0FyciIsIl9yZWZfb2JqIiwiYXV0b2Zvcm1fdHlwZSIsImZzIiwiaXNVbkxpbWl0ZWQiLCJtdWx0aXBsZSIsInJvd3MiLCJsYW5ndWFnZSIsImlzTW9iaWxlIiwiaXNQYWQiLCJhZkZpZWxkSW5wdXQiLCJkYXRlTW9iaWxlT3B0aW9ucyIsIm91dEZvcm1hdCIsInRpbWV6b25lSWQiLCJkeERhdGVCb3hPcHRpb25zIiwiZGlzcGxheUZvcm1hdCIsImhlaWdodCIsImRpYWxvZ3NJbkJvZHkiLCJ0b29sYmFyIiwiZm9udE5hbWVzIiwibGFuZyIsInNob3dJY29uIiwiZGVwZW5kT24iLCJkZXBlbmRfb24iLCJjcmVhdGUiLCJsb29rdXBfZmllbGQiLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJvcGVyYXRpb24iLCJvblN1Y2Nlc3MiLCJhZGRJdGVtcyIsInJlZmVyZW5jZV9zb3J0Iiwib3B0aW9uc1NvcnQiLCJyZWZlcmVuY2VfbGltaXQiLCJvcHRpb25zTGltaXQiLCJvbWl0IiwiYmxhY2tib3giLCJvYmplY3RTd2l0Y2hlIiwib3B0aW9uc01ldGhvZCIsIm9wdGlvbnNNZXRob2RQYXJhbXMiLCJyZWZlcmVuY2VzIiwiX3JlZmVyZW5jZSIsImxpbmsiLCJkZWZhdWx0SWNvbiIsImZpcnN0T3B0aW9uIiwicHJlY2lzaW9uIiwic2NhbGUiLCJkZWNpbWFsIiwiZGlzYWJsZWQiLCJBcnJheSIsImVkaXRhYmxlIiwiYWNjZXB0Iiwic3lzdGVtIiwiRW1haWwiLCJyZXF1aXJlZCIsIm9wdGlvbmFsIiwidW5pcXVlIiwiZ3JvdXAiLCJzZWFyY2hhYmxlIiwiaW5saW5lSGVscFRleHQiLCJpc1Byb2R1Y3Rpb24iLCJzb3J0YWJsZSIsImdldEZpZWxkRGlzcGxheVZhbHVlIiwiZmllbGRfdmFsdWUiLCJodG1sIiwibW9tZW50IiwiZm9ybWF0IiwiY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5IiwiZmllbGRfdHlwZSIsInB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyIsIm9wZXJhdGlvbnMiLCJidWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJidWlsdGluSXRlbSIsImlzX2NoZWNrX29ubHkiLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uIiwiYmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJnZXRRdWFydGVyU3RhcnRNb250aCIsIm1vbnRoIiwiZ2V0TW9udGgiLCJnZXRMYXN0UXVhcnRlckZpcnN0RGF5IiwieWVhciIsImdldEZ1bGxZZWFyIiwiZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSIsImdldE1vbnRoRGF5cyIsImRheXMiLCJlbmREYXRlIiwibWlsbGlzZWNvbmQiLCJzdGFydERhdGUiLCJnZXRMYXN0TW9udGhGaXJzdERheSIsImN1cnJlbnRNb250aCIsImN1cnJlbnRZZWFyIiwiZW5kVmFsdWUiLCJmaXJzdERheSIsImxhc3REYXkiLCJsYXN0TW9uZGF5IiwibGFzdE1vbnRoRmluYWxEYXkiLCJsYXN0TW9udGhGaXJzdERheSIsImxhc3RRdWFydGVyRW5kRGF5IiwibGFzdFF1YXJ0ZXJTdGFydERheSIsImxhc3RTdW5kYXkiLCJsYXN0XzEyMF9kYXlzIiwibGFzdF8zMF9kYXlzIiwibGFzdF82MF9kYXlzIiwibGFzdF83X2RheXMiLCJsYXN0XzkwX2RheXMiLCJtaW51c0RheSIsIm1vbmRheSIsIm5leHRNb25kYXkiLCJuZXh0TW9udGhGaW5hbERheSIsIm5leHRNb250aEZpcnN0RGF5IiwibmV4dFF1YXJ0ZXJFbmREYXkiLCJuZXh0UXVhcnRlclN0YXJ0RGF5IiwibmV4dFN1bmRheSIsIm5leHRZZWFyIiwibmV4dF8xMjBfZGF5cyIsIm5leHRfMzBfZGF5cyIsIm5leHRfNjBfZGF5cyIsIm5leHRfN19kYXlzIiwibmV4dF85MF9kYXlzIiwibm93IiwicHJldmlvdXNZZWFyIiwic3RhcnRWYWx1ZSIsInN0ckVuZERheSIsInN0ckZpcnN0RGF5Iiwic3RyTGFzdERheSIsInN0ck1vbmRheSIsInN0clN0YXJ0RGF5Iiwic3RyU3VuZGF5Iiwic3RyVG9kYXkiLCJzdHJUb21vcnJvdyIsInN0clllc3RkYXkiLCJzdW5kYXkiLCJ0aGlzUXVhcnRlckVuZERheSIsInRoaXNRdWFydGVyU3RhcnREYXkiLCJ0b21vcnJvdyIsIndlZWsiLCJ5ZXN0ZGF5IiwiZ2V0RGF5IiwidCIsImZ2Iiwic2V0SG91cnMiLCJnZXRIb3VycyIsImdldFRpbWV6b25lT2Zmc2V0IiwiZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uIiwiZ2V0RmllbGRPcGVyYXRpb24iLCJvcHRpb25hbHMiLCJlcXVhbCIsInVuZXF1YWwiLCJsZXNzX3RoYW4iLCJncmVhdGVyX3RoYW4iLCJsZXNzX29yX2VxdWFsIiwiZ3JlYXRlcl9vcl9lcXVhbCIsIm5vdF9jb250YWluIiwic3RhcnRzX3dpdGgiLCJiZXR3ZWVuIiwiZ2V0T2JqZWN0RmllbGRzTmFtZSIsImZpZWxkc05hbWUiLCJzb3J0X25vIiwiY2xlYW5UcmlnZ2VyIiwiaW5pdFRyaWdnZXIiLCJfdHJpZ2dlcl9ob29rcyIsInJlZjQiLCJyZWY1IiwidG9kb1dyYXBwZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIndoZW4iLCJiZWZvcmUiLCJpbnNlcnQiLCJyZW1vdmUiLCJhZnRlciIsIl9ob29rIiwidHJpZ2dlcl9uYW1lIiwiX3RyaWdnZXJfaG9vayIsImZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QiLCJmaW5kX3Blcm1pc3Npb25fb2JqZWN0IiwiaW50ZXJzZWN0aW9uUGx1cyIsInVuaW9uUGVybWlzc2lvbk9iamVjdHMiLCJ1bmlvblBsdXMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImdldFJlY29yZFBlcm1pc3Npb25zIiwiaXNPd25lciIsIm9iamVjdF9maWVsZHNfa2V5cyIsInJlY29yZF9jb21wYW55X2lkIiwicmVjb3JkX2NvbXBhbnlfaWRzIiwic2VsZWN0IiwidXNlcl9jb21wYW55X2lkcyIsInBhcmVudCIsImtleXMiLCJpbnRlcnNlY3Rpb24iLCJnZXRPYmplY3RSZWNvcmQiLCJyZWNvcmRfcGVybWlzc2lvbnMiLCJvd25lciIsIm4iLCJsb2NrZWQiLCJnZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zIiwiY3VycmVudE9iamVjdE5hbWUiLCJyZWxhdGVkTGlzdEl0ZW0iLCJjdXJyZW50UmVjb3JkIiwiaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlIiwibWFzdGVyQWxsb3ciLCJtYXN0ZXJSZWNvcmRQZXJtIiwicmVsYXRlZE9iamVjdFBlcm1pc3Npb25zIiwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QiLCJnZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIl9pIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwic3BhY2VVc2VyIiwib2JqZWN0cyIsImFzc2lnbmVkX2FwcHMiLCJwcm9maWxlIiwidXNlcnMiLCJwZXJtaXNzaW9uX3NldF9pZCIsImNyZWF0ZWQiLCJtb2RpZmllZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZF9ieSIsImdldEFzc2lnbmVkQXBwcyIsImJpbmQiLCJhc3NpZ25lZF9tZW51cyIsImdldEFzc2lnbmVkTWVudXMiLCJ1c2VyX3Blcm1pc3Npb25fc2V0cyIsImFycmF5Iiwib3RoZXIiLCJhcHBzIiwicHNldEJhc2UiLCJ1c2VyUHJvZmlsZSIsInBzZXQiLCJ1bmlxIiwiYWJvdXRNZW51IiwiYWRtaW5NZW51cyIsImFsbE1lbnVzIiwiY3VycmVudFBzZXROYW1lcyIsIm1lbnVzIiwib3RoZXJNZW51QXBwcyIsIm90aGVyTWVudXMiLCJhZG1pbl9tZW51cyIsImZsYXR0ZW4iLCJtZW51IiwicHNldHNNZW51IiwicGVybWlzc2lvbl9zZXRzIiwicGVybWlzc2lvbl9vYmplY3RzIiwiaXNOdWxsIiwicGVybWlzc2lvbl9zZXRfaWRzIiwicG9zIiwib3BzIiwib3BzX2tleSIsImN1cnJlbnRQc2V0IiwidGVtcE9wcyIsInJlcGVhdEluZGV4IiwicmVwZWF0UG8iLCJvcHNldEFkbWluIiwib3BzZXRDdXN0b21lciIsIm9wc2V0R3Vlc3QiLCJvcHNldE1lbWJlciIsIm9wc2V0U3VwcGxpZXIiLCJvcHNldFVzZXIiLCJwb3NBZG1pbiIsInBvc0N1c3RvbWVyIiwicG9zR3Vlc3QiLCJwb3NNZW1iZXIiLCJwb3NTdXBwbGllciIsInBvc1VzZXIiLCJwcm9mIiwiZ3Vlc3QiLCJtZW1iZXIiLCJzdXBwbGllciIsImN1c3RvbWVyIiwiZGlzYWJsZWRfYWN0aW9ucyIsInVucmVhZGFibGVfZmllbGRzIiwidW5lZGl0YWJsZV9maWVsZHMiLCJjcmVhdG9yX2RiX3VybCIsIm9wbG9nX3VybCIsIk1PTkdPX1VSTF9DUkVBVE9SIiwiTU9OR09fT1BMT0dfVVJMX0NSRUFUT1IiLCJfQ1JFQVRPUl9EQVRBU09VUkNFIiwiX2RyaXZlciIsIk1vbmdvSW50ZXJuYWxzIiwiUmVtb3RlQ29sbGVjdGlvbkRyaXZlciIsIm9wbG9nVXJsIiwiY29sbGVjdGlvbl9rZXkiLCJuZXdDb2xsZWN0aW9uIiwiU01TUXVldWUiLCJhY3Rpb25fbmFtZSIsImV4ZWN1dGVBY3Rpb24iLCJpdGVtX2VsZW1lbnQiLCJtb3JlQXJncyIsInRvZG9BcmdzIiwib2RhdGEiLCJwcm90b3R5cGUiLCJzbGljZSIsImNvbmNhdCIsIndhcm5pbmciLCJzZXQiLCJGb3JtTWFuYWdlciIsImdldEluaXRpYWxWYWx1ZXMiLCJkZWZlciIsIiQiLCJjbGljayIsImhyZWYiLCJnZXRPYmplY3RVcmwiLCJGbG93Um91dGVyIiwicmVkaXJlY3QiLCJyZWNvcmRfdGl0bGUiLCJjYWxsX2JhY2siLCJ0ZXh0Iiwic3dhbCIsInRpdGxlIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsImFwcGlkIiwiZHhEYXRhR3JpZEluc3RhbmNlIiwiZ3JpZENvbnRhaW5lciIsImdyaWRPYmplY3ROYW1lQ2xhc3MiLCJpbmZvIiwiaXNPcGVuZXJSZW1vdmUiLCJzdWNjZXNzIiwid2luZG93Iiwib3BlbmVyIiwiZHhUcmVlTGlzdCIsImR4RGF0YUdyaWQiLCJyZWZyZXNoIiwiVGVtcGxhdGUiLCJjcmVhdG9yX2dyaWQiLCJjbG9zZSIsImdvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsS0FBQ0EsRUFBRCxHQUFNLEVBQU47O0FBQ0EsSUFBSSxPQUFBQyxPQUFBLG9CQUFBQSxZQUFBLElBQUo7QUFDQyxPQUFDQSxPQUFELEdBQVcsRUFBWDtBQ0VBOztBREREQSxRQUFRQyxPQUFSLEdBQWtCLEVBQWxCO0FBQ0FELFFBQVFFLFdBQVIsR0FBc0IsRUFBdEI7QUFDQUYsUUFBUUcsS0FBUixHQUFnQixFQUFoQjtBQUNBSCxRQUFRSSxJQUFSLEdBQWUsRUFBZjtBQUNBSixRQUFRSyxVQUFSLEdBQXFCLEVBQXJCO0FBQ0FMLFFBQVFNLE9BQVIsR0FBa0IsRUFBbEI7QUFDQU4sUUFBUU8sSUFBUixHQUFlLEVBQWY7QUFDQVAsUUFBUVEsYUFBUixHQUF3QixFQUF4QixDOzs7Ozs7Ozs7Ozs7QUVWQSxJQUFBQyxDQUFBLEVBQUFDLFdBQUE7O0FBQUE7QUFDQ0EsZ0JBQWNDLFFBQVEsZUFBUixDQUFkOztBQUNBLE1BQUdDLE9BQU9DLGFBQVY7QUFDQ0QsV0FBT0UsT0FBUCxDQUFlO0FBQ2QsVUFBQUMsRUFBQTs7QUFBQTtBQ0lLLGVESEpMLFlBQVlNLElBQVosRUNHSTtBREpMLGVBQUFD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IiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJAZGIgPSB7fVxyXG5pZiAhQ3JlYXRvcj9cclxuXHRAQ3JlYXRvciA9IHt9XHJcbkNyZWF0b3IuT2JqZWN0cyA9IHt9XHJcbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fVxyXG5DcmVhdG9yLk1lbnVzID0gW11cclxuQ3JlYXRvci5BcHBzID0ge31cclxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge31cclxuQ3JlYXRvci5SZXBvcnRzID0ge31cclxuQ3JlYXRvci5zdWJzID0ge31cclxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge30iLCJ0aGlzLmRiID0ge307XG5cbmlmICh0eXBlb2YgQ3JlYXRvciA9PT0gXCJ1bmRlZmluZWRcIiB8fCBDcmVhdG9yID09PSBudWxsKSB7XG4gIHRoaXMuQ3JlYXRvciA9IHt9O1xufVxuXG5DcmVhdG9yLk9iamVjdHMgPSB7fTtcblxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9O1xuXG5DcmVhdG9yLk1lbnVzID0gW107XG5cbkNyZWF0b3IuQXBwcyA9IHt9O1xuXG5DcmVhdG9yLkRhc2hib2FyZHMgPSB7fTtcblxuQ3JlYXRvci5SZXBvcnRzID0ge307XG5cbkNyZWF0b3Iuc3VicyA9IHt9O1xuXG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fTtcbiIsInRyeVxyXG5cdHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXHJcblx0aWYgTWV0ZW9yLmlzRGV2ZWxvcG1lbnRcclxuXHRcdE1ldGVvci5zdGFydHVwIC0+XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdHN0ZWVkb3NDb3JlLmluaXQoKVxyXG5cdFx0XHRjYXRjaCBleFxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGV4KVxyXG5jYXRjaCBlXHJcblx0Y29uc29sZS5sb2coZSkiLCJ2YXIgZSwgc3RlZWRvc0NvcmU7XG5cbnRyeSB7XG4gIHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuICBpZiAoTWV0ZW9yLmlzRGV2ZWxvcG1lbnQpIHtcbiAgICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBleDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5pbml0KCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coZXgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBlID0gZXJyb3I7XG4gIGNvbnNvbGUubG9nKGUpO1xufVxuIiwiQ3JlYXRvci5kZXBzID0ge1xyXG5cdGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxyXG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxyXG59O1xyXG5cclxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XHJcblx0QXBwczoge30sXHJcblx0T2JqZWN0czoge31cclxufVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxyXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXHJcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2NyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxyXG5cclxuIyBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMg5L6bc3RlZWRvcy1jbGnpobnnm67kvb/nlKhcclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxyXG5cdENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XHJcblx0XHRGaWJlcigoKS0+XHJcblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcclxuXHRcdCkucnVuKClcclxuXHJcbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBvYmoubmFtZVxyXG5cclxuXHRpZiAhb2JqLmxpc3Rfdmlld3NcclxuXHRcdG9iai5saXN0X3ZpZXdzID0ge31cclxuXHJcblx0aWYgb2JqLnNwYWNlXHJcblx0XHRvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKVxyXG5cdGlmIG9iamVjdF9uYW1lID09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCdcclxuXHRcdG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xyXG5cdFx0b2JqID0gXy5jbG9uZShvYmopXHJcblx0XHRvYmoubmFtZSA9IG9iamVjdF9uYW1lXHJcblx0XHRDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqXHJcblxyXG5cdENyZWF0b3IuY29udmVydE9iamVjdChvYmopXHJcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XHJcblxyXG5cdENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKVxyXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcclxuXHRyZXR1cm4gb2JqXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxyXG5cdGlmIG9iamVjdC5zcGFjZVxyXG5cdFx0cmV0dXJuIFwiY18je29iamVjdC5zcGFjZX1fI3tvYmplY3QubmFtZX1cIlxyXG5cdHJldHVybiBvYmplY3QubmFtZVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3QgPSAob2JqZWN0X25hbWUsIHNwYWNlX2lkKS0+XHJcblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxyXG5cdFx0cmV0dXJuIDtcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxyXG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcbiNcdGlmICFzcGFjZV9pZCAmJiBvYmplY3RfbmFtZVxyXG4jXHRcdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKVxyXG4jXHRcdFx0c3BhY2VfaWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHJcblx0aWYgb2JqZWN0X25hbWVcclxuI1x0XHRpZiBzcGFjZV9pZFxyXG4jXHRcdFx0b2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY18je3NwYWNlX2lkfV8je29iamVjdF9uYW1lfVwiXVxyXG4jXHRcdFx0aWYgb2JqXHJcbiNcdFx0XHRcdHJldHVybiBvYmpcclxuI1xyXG4jXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XHJcbiNcdFx0XHRcdHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT0gb2JqZWN0X25hbWVcclxuI1x0XHRpZiBvYmpcclxuI1x0XHRcdHJldHVybiBvYmpcclxuXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gKG9iamVjdF9pZCktPlxyXG5cdHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtfaWQ6IG9iamVjdF9pZH0pXHJcblxyXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IChvYmplY3RfbmFtZSktPlxyXG5cdGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKVxyXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXHJcblx0ZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cclxuXHJcbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0aWYgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW0NyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uX2NvbGxlY3Rpb25fbmFtZV1cclxuXHJcbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXVxyXG5cclxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRzcGFjZSA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpPy5kYj8uZmluZE9uZShzcGFjZUlkLHtmaWVsZHM6e2FkbWluczoxfX0pXHJcblx0aWYgc3BhY2U/LmFkbWluc1xyXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMFxyXG5cclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKS0+XHJcblxyXG5cdGlmICFfLmlzU3RyaW5nKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIGZvcm11bGFyXHJcblxyXG5cdGlmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKVxyXG5cclxuXHRyZXR1cm4gZm9ybXVsYXJcclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGNvbnRleHQpLT5cclxuXHRzZWxlY3RvciA9IHt9XHJcblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cclxuXHRcdGlmIGZpbHRlcj8ubGVuZ3RoID09IDNcclxuXHRcdFx0bmFtZSA9IGZpbHRlclswXVxyXG5cdFx0XHRhY3Rpb24gPSBmaWx0ZXJbMV1cclxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpXHJcblx0XHRcdHNlbGVjdG9yW25hbWVdID0ge31cclxuXHRcdFx0c2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlXHJcblx0Y29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3RvcilcclxuXHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IChzcGFjZUlkKSAtPlxyXG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXHJcblxyXG4jIyNcclxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXHJcblx0aWRz77yaX2lk6ZuG5ZCIXHJcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcclxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXHJcbiMjI1xyXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IChkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KS0+XHJcblxyXG5cdGlmICFpZF9rZXlcclxuXHRcdGlkX2tleSA9IFwiX2lkXCJcclxuXHJcblx0aWYgaGl0X2ZpcnN0XHJcblxyXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcclxuXHRcdHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KVxyXG5cclxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxyXG5cdFx0XHRcdFx0X2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXHJcblx0XHRcdFx0XHRpZiBfaW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XHJcblx0XHRcdHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcclxuXHJcbiMjI1xyXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xyXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xyXG4jIyNcclxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gKHZhbHVlMSwgdmFsdWUyKSAtPlxyXG5cdGlmIHRoaXMua2V5XHJcblx0XHR2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldXHJcblx0XHR2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldXHJcblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxyXG5cdFx0dmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKVxyXG5cdGlmIHZhbHVlMiBpbnN0YW5jZW9mIERhdGVcclxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcclxuXHRpZiB0eXBlb2YgdmFsdWUxIGlzIFwibnVtYmVyXCIgYW5kIHR5cGVvZiB2YWx1ZTIgaXMgXCJudW1iZXJcIlxyXG5cdFx0cmV0dXJuIHZhbHVlMSAtIHZhbHVlMlxyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcclxuXHRpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09IG51bGwgb3IgdmFsdWUxID09IHVuZGVmaW5lZFxyXG5cdGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT0gbnVsbCBvciB2YWx1ZTIgPT0gdW5kZWZpbmVkXHJcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAtMVxyXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAwXHJcblx0aWYgIWlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcclxuXHRcdHJldHVybiAxXHJcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxyXG5cdHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlIHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGVcclxuXHJcblxyXG4jIOivpeWHveaVsOWPquWcqOWIneWni+WMlk9iamVjdOaXtu+8jOaKiuebuOWFs+WvueixoeeahOiuoeeul+e7k+aenOS/neWtmOWIsE9iamVjdOeahHJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4re+8jOWQjue7reWPr+S7peebtOaOpeS7jnJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4reWPluW+l+iuoeeul+e7k+aenOiAjOS4jeeUqOWGjeasoeiwg+eUqOivpeWHveaVsOadpeiuoeeul1xyXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhb2JqZWN0X25hbWVcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IFtdXHJcblx0IyBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXHJcblx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cclxuXHRpZiAhX29iamVjdFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cdFxyXG5cdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxyXG5cdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XHJcblx0XHRyZWxhdGVkTGlzdE1hcCA9IHt9XHJcblx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpOYW1lKS0+XHJcblx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqTmFtZVxyXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fVxyXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XHJcblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cclxuXHRcdFx0XHRpZiAocmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lIGFuZCByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXVxyXG5cdFx0XHRcdFx0cmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7IG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmcgfVxyXG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddXHJcblx0XHRcdHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHsgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiIH1cclxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXVxyXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7IG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLCBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCIgfVxyXG5cdFx0Xy5lYWNoIFsndGFza3MnLCAnbm90ZXMnLCAnZXZlbnRzJywgJ2FwcHJvdmFscyddLCAoZW5hYmxlT2JqTmFtZSktPlxyXG5cdFx0XHRpZiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXVxyXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdID0geyBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiIH1cclxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ11cclxuXHRcdFx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxyXG5cdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXHJcblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHsgb2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XHJcblx0XHRyZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyByZWxhdGVkTGlzdE1hcFxyXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9maWxlc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwifVxyXG5cclxuXHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cclxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cclxuXHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcclxuXHRcdFx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwib2JqZWN0X2ZpZWxkc1wiXHJcblx0XHRcdFx0XHQjVE9ETyDlvoXnm7jlhbPliJfooajmlK/mjIHmjpLluo/lkI7vvIzliKDpmaTmraTliKTmlq1cclxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWV9KVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmd9XHJcblxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJ0YXNrc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfbm90ZXNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ldmVudHNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImV2ZW50c1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wifVxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX2FwcHJvdmFsc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHQjcmVjb3JkIOivpue7huS4i+eahGF1ZGl0X3JlY29yZHPku4Vtb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5Y+v6KeBXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXHJcblx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHJcblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xyXG5cclxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9ICh1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0cmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUXHJcblx0ZWxzZVxyXG5cdFx0aWYgISh1c2VySWQgYW5kIHNwYWNlSWQpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiXHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHRzdUZpZWxkcyA9IHtuYW1lOiAxLCBtb2JpbGU6IDEsIHBvc2l0aW9uOiAxLCBlbWFpbDogMSwgY29tcGFueTogMSwgb3JnYW5pemF0aW9uOiAxLCBzcGFjZTogMSwgY29tcGFueV9pZDogMSwgY29tcGFueV9pZHM6IDF9XHJcblx0XHQjIGNoZWNrIGlmIHVzZXIgaW4gdGhlIHNwYWNlXHJcblx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxyXG5cdFx0aWYgIXN1XHJcblx0XHRcdHNwYWNlSWQgPSBudWxsXHJcblxyXG5cdFx0IyBpZiBzcGFjZUlkIG5vdCBleGlzdHMsIGdldCB0aGUgZmlyc3Qgb25lLlxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0aWYgaXNVblNhZmVNb2RlXHJcblx0XHRcdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7dXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxyXG5cdFx0XHRcdGlmICFzdVxyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdFx0XHRzcGFjZUlkID0gc3Uuc3BhY2VcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBudWxsXHJcblxyXG5cdFx0VVNFUl9DT05URVhUID0ge31cclxuXHRcdFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWRcclxuXHRcdFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZFxyXG5cdFx0VVNFUl9DT05URVhULnVzZXIgPSB7XHJcblx0XHRcdF9pZDogdXNlcklkXHJcblx0XHRcdG5hbWU6IHN1Lm5hbWUsXHJcblx0XHRcdG1vYmlsZTogc3UubW9iaWxlLFxyXG5cdFx0XHRwb3NpdGlvbjogc3UucG9zaXRpb24sXHJcblx0XHRcdGVtYWlsOiBzdS5lbWFpbFxyXG5cdFx0XHRjb21wYW55OiBzdS5jb21wYW55XHJcblx0XHRcdGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWRcclxuXHRcdFx0Y29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXHJcblx0XHR9XHJcblx0XHRzcGFjZV91c2VyX29yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIik/LmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKVxyXG5cdFx0aWYgc3BhY2VfdXNlcl9vcmdcclxuXHRcdFx0VVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xyXG5cdFx0XHRcdF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxyXG5cdFx0XHRcdG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXHJcblx0XHRcdFx0ZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXHJcblx0XHRcdH1cclxuXHRcdHJldHVybiBVU0VSX0NPTlRFWFRcclxuXHJcbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSAodXJsKS0+XHJcblxyXG5cdGlmIF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAodXJsPy5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpKVxyXG5cdFx0aWYgIS9eXFwvLy50ZXN0KHVybClcclxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcclxuXHRcdHJldHVybiB1cmxcclxuXHJcblx0aWYgdXJsXHJcblx0XHQjIHVybOW8gOWktOayoeaciVwiL1wi77yM6ZyA6KaB5re75YqgXCIvXCJcclxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXHJcblx0XHRcdHVybCA9IFwiL1wiICsgdXJsXHJcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybFxyXG5cdGVsc2VcclxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYXHJcblxyXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSAodXNlcklkLCBzcGFjZUlkKS0+XHJcblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxyXG5cdGVsc2VcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcclxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWQ6MX19KVxyXG5cdHJldHVybiBzdS5jb21wYW55X2lkXHJcblxyXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gKHVzZXJJZCwgc3BhY2VJZCktPlxyXG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcclxuXHRlbHNlXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXHJcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkczoxfX0pXHJcblx0cmV0dXJuIHN1Py5jb21wYW55X2lkc1xyXG5cclxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSAocG8pLT5cclxuXHRpZiBwby5hbGxvd0NyZWF0ZVxyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLmFsbG93RWRpdFxyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLmFsbG93RGVsZXRlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0aWYgcG8udmlld0FsbFJlY29yZHNcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxyXG5cdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcclxuXHRyZXR1cm4gcG9cclxuXHJcbkNyZWF0b3IuZ2V0VGVtcGxhdGVTcGFjZUlkID0gKCktPlxyXG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWRcclxuXHJcbkNyZWF0b3IuZ2V0Q2xvdWRBZG1pblNwYWNlSWQgPSAoKS0+XHJcblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkXHJcblxyXG5DcmVhdG9yLmlzVGVtcGxhdGVTcGFjZSA9IChzcGFjZUlkKS0+XHJcblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWQgPT0gc3BhY2VJZFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSAoc3BhY2VJZCktPlxyXG5cdGlmIHNwYWNlSWQgJiYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWQgPT0gc3BhY2VJZFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdGlmIHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVJcclxuXHRcdENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSXHJcblx0ZWxzZVxyXG5cdFx0cGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG5cdFx0Q3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vY2ZzJykpXHJcbiIsInZhciBGaWJlciwgcGF0aDtcblxuQ3JlYXRvci5kZXBzID0ge1xuICBhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3ksXG4gIG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG4gIEFwcHM6IHt9LFxuICBPYmplY3RzOiB7fVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIG9wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICByZXR1cm4gU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGNyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG59KTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSk7XG4gICAgfSkucnVuKCk7XG4gIH07XG59XG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iai5uYW1lO1xuICB9XG4gIGlmICghb2JqLmxpc3Rfdmlld3MpIHtcbiAgICBvYmoubGlzdF92aWV3cyA9IHt9O1xuICB9XG4gIGlmIChvYmouc3BhY2UpIHtcbiAgICBvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUgPT09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCcpIHtcbiAgICBvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCc7XG4gICAgb2JqID0gXy5jbG9uZShvYmopO1xuICAgIG9iai5uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9iajtcbiAgfVxuICBDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKTtcbiAgbmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG4gIENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5pbml0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIG9iajtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0LnNwYWNlKSB7XG4gICAgcmV0dXJuIFwiY19cIiArIG9iamVjdC5zcGFjZSArIFwiX1wiICsgb2JqZWN0Lm5hbWU7XG4gIH1cbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgaWYgKF8uaXNBcnJheShvYmplY3RfbmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgICBpZiAoKHJlZjEgPSByZWYub2JqZWN0KSAhPSBudWxsKSB7XG4gICAgICAgIHJlZjEuZGVwZW5kKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSBmdW5jdGlvbihvYmplY3RfaWQpIHtcbiAgcmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge1xuICAgIF9pZDogb2JqZWN0X2lkXG4gIH0pO1xufTtcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSk7XG4gIGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zWyhyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuX2NvbGxlY3Rpb25fbmFtZSA6IHZvaWQgMF07XG4gIH1cbn07XG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgcmVmLCByZWYxLCBzcGFjZTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIikpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYikgIT0gbnVsbCA/IHJlZjEuZmluZE9uZShzcGFjZUlkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhZG1pbnM6IDFcbiAgICB9XG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBpZiAoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmFkbWlucyA6IHZvaWQgMCkge1xuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgaWYgKCFfLmlzU3RyaW5nKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBmb3JtdWxhcjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gZm9ybXVsYXI7XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGNvbnRleHQpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBzZWxlY3RvciA9IHt9O1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGFjdGlvbiwgbmFtZSwgdmFsdWU7XG4gICAgaWYgKChmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5sZW5ndGggOiB2b2lkIDApID09PSAzKSB7XG4gICAgICBuYW1lID0gZmlsdGVyWzBdO1xuICAgICAgYWN0aW9uID0gZmlsdGVyWzFdO1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpO1xuICAgICAgc2VsZWN0b3JbbmFtZV0gPSB7fTtcbiAgICAgIHJldHVybiBzZWxlY3RvcltuYW1lXVthY3Rpb25dID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgY29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3Rvcik7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIHNwYWNlSWQgPT09ICdjb21tb24nO1xufTtcblxuXG4vKlxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4gKi9cblxuQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMgPSBmdW5jdGlvbihkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KSB7XG4gIHZhciB2YWx1ZXM7XG4gIGlmICghaWRfa2V5KSB7XG4gICAgaWRfa2V5ID0gXCJfaWRcIjtcbiAgfVxuICBpZiAoaGl0X2ZpcnN0KSB7XG4gICAgdmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpO1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHZhciBfaW5kZXg7XG4gICAgICBfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgICBpZiAoX2luZGV4ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9pbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgfSk7XG4gIH1cbn07XG5cblxuLypcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuICovXG5cbkNyZWF0b3Iuc29ydGluZ01ldGhvZCA9IGZ1bmN0aW9uKHZhbHVlMSwgdmFsdWUyKSB7XG4gIHZhciBpc1ZhbHVlMUVtcHR5LCBpc1ZhbHVlMkVtcHR5LCBsb2NhbGU7XG4gIGlmICh0aGlzLmtleSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV07XG4gICAgdmFsdWUyID0gdmFsdWUyW3RoaXMua2V5XTtcbiAgfVxuICBpZiAodmFsdWUxIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHZhbHVlMiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTIgPSB2YWx1ZTIuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUxID09PSBcIm51bWJlclwiICYmIHR5cGVvZiB2YWx1ZTIgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gdmFsdWUxIC0gdmFsdWUyO1xuICB9XG4gIGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT09IG51bGwgfHwgdmFsdWUxID09PSB2b2lkIDA7XG4gIGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT09IG51bGwgfHwgdmFsdWUyID09PSB2b2lkIDA7XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmICFpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBpZiAoIWlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKCk7XG4gIHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlKHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGUpO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TWFwLCByZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IFtdO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICByZWxhdGVkTGlzdE1hcCA9IHt9O1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqTmFtZSkge1xuICAgICAgaWYgKF8uaXNPYmplY3Qob2JqTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSAmJiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgIHNoYXJpbmc6IHJlbGF0ZWRfZmllbGQuc2hhcmluZ1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICAgIH07XG4gICAgfVxuICAgIF8uZWFjaChbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgZnVuY3Rpb24oZW5hYmxlT2JqTmFtZSkge1xuICAgICAgaWYgKHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSxcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSkge1xuICAgICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyhyZWxhdGVkTGlzdE1hcCk7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZmlsZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiAmJiByZWxhdGVkX2ZpZWxkLnJlbGF0ZWRMaXN0KSkgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcIm9iamVjdF9maWVsZHNcIikge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgICAgICBzaGFyaW5nOiByZWxhdGVkX2ZpZWxkLnNoYXJpbmdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Rhc2tzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwidGFza3NcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ub3Rlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcIm5vdGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZXZlbnRzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiZXZlbnRzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfaW5zdGFuY2VzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfYXBwcm92YWxzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiYXBwcm92YWxzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpIHtcbiAgdmFyIFVTRVJfQ09OVEVYVCwgcmVmLCBzcGFjZV91c2VyX29yZywgc3UsIHN1RmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUO1xuICB9IGVsc2Uge1xuICAgIGlmICghKHVzZXJJZCAmJiBzcGFjZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN1RmllbGRzID0ge1xuICAgICAgbmFtZTogMSxcbiAgICAgIG1vYmlsZTogMSxcbiAgICAgIHBvc2l0aW9uOiAxLFxuICAgICAgZW1haWw6IDEsXG4gICAgICBjb21wYW55OiAxLFxuICAgICAgb3JnYW5pemF0aW9uOiAxLFxuICAgICAgc3BhY2U6IDEsXG4gICAgICBjb21wYW55X2lkOiAxLFxuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9O1xuICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgfSk7XG4gICAgaWYgKCFzdSkge1xuICAgICAgc3BhY2VJZCA9IG51bGw7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgaWYgKGlzVW5TYWZlTW9kZSkge1xuICAgICAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghc3UpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzcGFjZUlkID0gc3Uuc3BhY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgVVNFUl9DT05URVhUID0ge307XG4gICAgVVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZDtcbiAgICBVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWQ7XG4gICAgVVNFUl9DT05URVhULnVzZXIgPSB7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIG5hbWU6IHN1Lm5hbWUsXG4gICAgICBtb2JpbGU6IHN1Lm1vYmlsZSxcbiAgICAgIHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcbiAgICAgIGVtYWlsOiBzdS5lbWFpbCxcbiAgICAgIGNvbXBhbnk6IHN1LmNvbXBhbnksXG4gICAgICBjb21wYW55X2lkOiBzdS5jb21wYW55X2lkLFxuICAgICAgY29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXG4gICAgfTtcbiAgICBzcGFjZV91c2VyX29yZyA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpKSAhPSBudWxsID8gcmVmLmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKSA6IHZvaWQgMDtcbiAgICBpZiAoc3BhY2VfdXNlcl9vcmcpIHtcbiAgICAgIFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcbiAgICAgICAgX2lkOiBzcGFjZV91c2VyX29yZy5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXG4gICAgICAgIGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFVTRVJfQ09OVEVYVDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICBpZiAoXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICgodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9hc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSA6IHZvaWQgMCkpKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBpZiAodXJsKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWQ6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UuY29tcGFueV9pZDtcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdSAhPSBudWxsID8gc3UuY29tcGFueV9pZHMgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHBvKSB7XG4gIGlmIChwby5hbGxvd0NyZWF0ZSkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHBvO1xufTtcblxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYudGVtcGxhdGVTcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKHNwYWNlSWQgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYuY2xvdWRBZG1pblNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBpZiAocHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUikge1xuICAgIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSO1xuICB9IGVsc2Uge1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vY2ZzJykpO1xuICB9XG59XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdCMg55So5oi36I635Y+WbG9va3VwIOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrXnmoTpgInpobnlgLxcclxuXHRcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogKG9wdGlvbnMpLT5cclxuXHRcdGlmIG9wdGlvbnM/LnBhcmFtcz8ucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKVxyXG5cclxuXHRcdFx0bmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcclxuXHJcblx0XHRcdHF1ZXJ5ID0ge31cclxuXHRcdFx0aWYgb3B0aW9ucy5wYXJhbXMuc3BhY2VcclxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlXHJcblxyXG5cdFx0XHRcdHNvcnQgPSBvcHRpb25zPy5zb3J0XHJcblxyXG5cdFx0XHRcdHNlbGVjdGVkID0gb3B0aW9ucz8uc2VsZWN0ZWQgfHwgW11cclxuXHJcblx0XHRcdFx0b3B0aW9uc19saW1pdCA9IG9wdGlvbnM/Lm9wdGlvbnNfbGltaXQgfHwgMTBcclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XHJcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxyXG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH1cclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcclxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fSwgc2VhcmNoVGV4dFF1ZXJ5XVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fV1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdFx0XHRcdFx0Xy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSlcclxuXHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskbmluOiBzZWxlY3RlZH1cclxuXHJcblx0XHRcdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XHJcblx0XHRcdFx0XHRfLmV4dGVuZCBxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeVxyXG5cclxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiBvcHRpb25zX2xpbWl0fVxyXG5cclxuXHRcdFx0XHRpZiBzb3J0ICYmIF8uaXNPYmplY3Qoc29ydClcclxuXHRcdFx0XHRcdHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnRcclxuXHJcblx0XHRcdFx0aWYgY29sbGVjdGlvblxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKClcclxuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IFtdXHJcblx0XHRcdFx0XHRcdF8uZWFjaCByZWNvcmRzLCAocmVjb3JkKS0+XHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoXHJcblx0XHRcdFx0XHRcdFx0XHRsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XVxyXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlY29yZC5faWRcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcclxuXHRcdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxyXG5cdFx0cmV0dXJuIFtdICIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZSwgbmFtZV9maWVsZF9rZXksIG9iamVjdCwgb3B0aW9uc19saW1pdCwgcXVlcnksIHF1ZXJ5X29wdGlvbnMsIHJlY29yZHMsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2VhcmNoVGV4dFF1ZXJ5LCBzZWxlY3RlZCwgc29ydDtcbiAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZiA9IG9wdGlvbnMucGFyYW1zKSAhPSBudWxsID8gcmVmLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSk7XG4gICAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5wYXJhbXMuc3BhY2UpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZTtcbiAgICAgICAgc29ydCA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc29ydCA6IHZvaWQgMDtcbiAgICAgICAgc2VsZWN0ZWQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zZWxlY3RlZCA6IHZvaWQgMCkgfHwgW107XG4gICAgICAgIG9wdGlvbnNfbGltaXQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5vcHRpb25zX2xpbWl0IDogdm9pZCAwKSB8fCAxMDtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7XG4gICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYxID0gb3B0aW9ucy52YWx1ZXMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VhcmNoVGV4dFF1ZXJ5XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAkbmluOiBzZWxlY3RlZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyUXVlcnkpIHtcbiAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgcXVlcnlfb3B0aW9ucyA9IHtcbiAgICAgICAgICBsaW1pdDogb3B0aW9uc19saW1pdFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpKSB7XG4gICAgICAgICAgcXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpO1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHJlY29yZHMsIGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLl9pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxyXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXHJcblxyXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxyXG5cdFx0b2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZVxyXG5cdFx0cmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkXHJcblx0XHRzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkXHJcblxyXG5cdFx0Y2hlY2sgb2JqZWN0X25hbWUsIFN0cmluZ1xyXG5cdFx0Y2hlY2sgcmVjb3JkX2lkLCBTdHJpbmdcclxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcclxuXHJcblx0XHRpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZFxyXG5cdFx0eF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXVxyXG5cdFx0eF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXVxyXG5cclxuXHRcdHJlZGlyZWN0X3VybCA9IFwiL1wiXHJcblx0XHRpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpXHJcblx0XHQjIC0g5oiR55qE6I2J56i/5bCx6Lez6L2s6Iez6I2J56i/566xXHJcblx0XHQjIC0g5oiR55qE5b6F5a6h5qC45bCx6Lez6L2s6Iez5b6F5a6h5qC4XHJcblx0XHQjIC0g5LiN5piv5oiR55qE55Sz6K+35Y2V5YiZ6Lez6L2s6Iez5omT5Y2w6aG16Z2iXHJcblx0XHQjIC0g5aaC55Sz6K+35Y2V5LiN5a2Y5Zyo5YiZ5o+Q56S655So5oi355Sz6K+35Y2V5bey5Yig6Zmk77yM5bm25LiU5pu05pawcmVjb3Jk55qE54q25oCB77yM5L2/55So5oi35Y+v5Lul6YeN5paw5Y+R6LW35a6h5om5XHJcblx0XHRpZiBpbnNcclxuXHRcdFx0Ym94ID0gJydcclxuXHRcdFx0c3BhY2VJZCA9IGlucy5zcGFjZVxyXG5cdFx0XHRmbG93SWQgPSBpbnMuZmxvd1xyXG5cclxuXHRcdFx0aWYgKGlucy5pbmJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKSBvciAoaW5zLmNjX3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpXHJcblx0XHRcdFx0Ym94ID0gJ2luYm94J1xyXG5cdFx0XHRlbHNlIGlmIGlucy5vdXRib3hfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZFxyXG5cdFx0XHRcdGJveCA9ICdvdXRib3gnXHJcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdkcmFmdCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXHJcblx0XHRcdFx0Ym94ID0gJ2RyYWZ0J1xyXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAncGVuZGluZycgYW5kIChpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZCBvciBpbnMuYXBwbGljYW50IGlzIGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRib3ggPSAncGVuZGluZydcclxuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ2NvbXBsZXRlZCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXHJcblx0XHRcdFx0Ym94ID0gJ2NvbXBsZXRlZCdcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCMg6aqM6K+BbG9naW4gdXNlcl9pZOWvueivpea1geeoi+acieeuoeeQhueUs+ivt+WNleeahOadg+mZkFxyXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKVxyXG5cdFx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwgeyBmaWVsZHM6IHsgYWRtaW5zOiAxIH0gfSlcclxuXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIG9yIHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpXHJcblx0XHRcdFx0XHRib3ggPSAnbW9uaXRvcidcclxuXHJcblx0XHRcdGlmIGJveFxyXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9IFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS8je2JveH0vI3tpbnNJZH0/WC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9IFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS9wcmludC8je2luc0lkfT9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxyXG5cclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRcdGRhdGE6IHsgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmwgfVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcclxuXHRcdFx0aWYgY29sbGVjdGlvblxyXG5cdFx0XHRcdGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xyXG5cdFx0XHRcdFx0JHB1bGw6IHtcclxuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZXNcIjoge1xyXG5cdFx0XHRcdFx0XHRcdFwiX2lkXCI6IGluc0lkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKVxyXG5cclxuXHRjYXRjaCBlXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxyXG5cdFx0fVxyXG5cclxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJveCwgY29sbGVjdGlvbiwgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgZmxvd0lkLCBoYXNoRGF0YSwgaW5zLCBpbnNJZCwgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25zLCByZWNvcmRfaWQsIHJlZGlyZWN0X3VybCwgcmVmLCByZWYxLCByZWYyLCBzcGFjZSwgc3BhY2VJZCwgc3BhY2VfaWQsIHhfYXV0aF90b2tlbiwgeF91c2VyX2lkO1xuICB0cnkge1xuICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgY3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkO1xuICAgIGhhc2hEYXRhID0gcmVxLmJvZHk7XG4gICAgb2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZTtcbiAgICByZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWQ7XG4gICAgc3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZDtcbiAgICBjaGVjayhvYmplY3RfbmFtZSwgU3RyaW5nKTtcbiAgICBjaGVjayhyZWNvcmRfaWQsIFN0cmluZyk7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgaW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWQ7XG4gICAgeF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICB4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddO1xuICAgIHJlZGlyZWN0X3VybCA9IFwiL1wiO1xuICAgIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCk7XG4gICAgaWYgKGlucykge1xuICAgICAgYm94ID0gJyc7XG4gICAgICBzcGFjZUlkID0gaW5zLnNwYWNlO1xuICAgICAgZmxvd0lkID0gaW5zLmZsb3c7XG4gICAgICBpZiAoKChyZWYgPSBpbnMuaW5ib3hfdXNlcnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkgfHwgKChyZWYxID0gaW5zLmNjX3VzZXJzKSAhPSBudWxsID8gcmVmMS5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSkge1xuICAgICAgICBib3ggPSAnaW5ib3gnO1xuICAgICAgfSBlbHNlIGlmICgocmVmMiA9IGlucy5vdXRib3hfdXNlcnMpICE9IG51bGwgPyByZWYyLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHtcbiAgICAgICAgYm94ID0gJ291dGJveCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2RyYWZ0JyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2RyYWZ0JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAncGVuZGluZycgJiYgKGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCB8fCBpbnMuYXBwbGljYW50ID09PSBjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgIGJveCA9ICdwZW5kaW5nJztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2NvbXBsZXRlZCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZCk7XG4gICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgYWRtaW5zOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgfHwgc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkpIHtcbiAgICAgICAgICBib3ggPSAnbW9uaXRvcic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChib3gpIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9cIiArIGJveCArIFwiL1wiICsgaW5zSWQgKyBcIj9YLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWRpcmVjdF91cmwgPSBcIndvcmtmbG93L3NwYWNlL1wiICsgc3BhY2VJZCArIFwiL3ByaW50L1wiICsgaW5zSWQgKyBcIj9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW47XG4gICAgICB9XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICBjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgXCJpbnN0YW5jZXNcIjoge1xuICAgICAgICAgICAgICBcIl9pZFwiOiBpbnNJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+eUs+ivt+WNleW3suWIoOmZpCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpIC0+XHJcblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKT8uX3NjaGVtYVxyXG5cdGNvbHVtbl9udW0gPSAwXHJcblx0aWYgX3NjaGVtYVxyXG5cdFx0Xy5lYWNoIGNvbHVtbnMsIChmaWVsZF9uYW1lKSAtPlxyXG5cdFx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxyXG5cdFx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXHJcblx0XHRcdGlmIGlzX3dpZGVcclxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMVxyXG5cclxuXHRcdGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW1cclxuXHRcdHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnRcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIC0+XHJcblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hXHJcblx0aWYgX3NjaGVtYVxyXG5cdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcclxuXHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcclxuXHRcdHJldHVybiBpc193aWRlXHJcblxyXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSAtPlxyXG5cdHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zPy5zZXR0aW5ncz8uZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wifSlcclxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRjb2x1bW5zID0gXy5tYXAgY29sdW1ucywgKGNvbHVtbiktPlxyXG5cdFx0ZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl1cclxuXHRcdGlmIGZpZWxkPy50eXBlIGFuZCAhZmllbGQuaGlkZGVuXHJcblx0XHRcdHJldHVybiBjb2x1bW5cclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdGNvbHVtbnMgPSBfLmNvbXBhY3QgY29sdW1uc1xyXG5cdGlmIHNldHRpbmcgYW5kIHNldHRpbmcuc2V0dGluZ3NcclxuXHRcdHNvcnQgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0/LnNvcnQgfHwgW11cclxuXHRcdHNvcnQgPSBfLm1hcCBzb3J0LCAob3JkZXIpLT5cclxuXHRcdFx0a2V5ID0gb3JkZXJbMF1cclxuXHRcdFx0aW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KVxyXG5cdFx0XHRvcmRlclswXSA9IGluZGV4ICsgMVxyXG5cdFx0XHRyZXR1cm4gb3JkZXJcclxuXHRcdHJldHVybiBzb3J0XHJcblx0cmV0dXJuIFtdXHJcblxyXG5cclxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cclxuXHRleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl1cclxuXHRkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdXHJcblx0aWYgZGVmYXVsdF9leHRyYV9jb2x1bW5zXHJcblx0XHRleHRyYV9jb2x1bW5zID0gXy51bmlvbiBleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcclxuXHJcblx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0Q3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHM/W29iamVjdF9uYW1lXSA9IFtdXHJcblxyXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IChkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpLT5cclxuXHRkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/LmNvbHVtbnNcclxuXHRkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3Py5tb2JpbGVfY29sdW1uc1xyXG5cdHVubGVzcyBsaXN0X3ZpZXdcclxuXHRcdHJldHVyblxyXG5cdG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpXHJcblx0aWYgIV8uaGFzKG9pdGVtLCBcIm5hbWVcIilcclxuXHRcdG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZVxyXG5cdGlmICFvaXRlbS5jb2x1bW5zXHJcblx0XHRpZiBkZWZhdWx0X2NvbHVtbnNcclxuXHRcdFx0b2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1uc1xyXG5cdGlmICFvaXRlbS5jb2x1bW5zXHJcblx0XHRvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXVxyXG5cdGlmICFvaXRlbS5tb2JpbGVfY29sdW1uc1xyXG5cdFx0aWYgZGVmYXVsdF9tb2JpbGVfY29sdW1uc1xyXG5cdFx0XHRvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcclxuXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKVxyXG5cdFx0XHRvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJylcclxuXHJcblxyXG5cdGlmICFvaXRlbS5maWx0ZXJfc2NvcGVcclxuXHRcdCMgbGlzdHZpZXfop4blm77nmoRmaWx0ZXJfc2NvcGXpu5jorqTlgLzmlLnkuLpzcGFjZSAjMTMxXHJcblx0XHRvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCJcclxuXHJcblx0aWYgIV8uaGFzKG9pdGVtLCBcIl9pZFwiKVxyXG5cdFx0b2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWVcclxuXHRlbHNlXHJcblx0XHRvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lXHJcblxyXG5cdGlmIF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucylcclxuXHRcdG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpXHJcblxyXG5cdF8uZm9yRWFjaCBvaXRlbS5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cclxuXHRcdGlmICFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcilcclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXHJcblx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXHJcblx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcclxuXHRyZXR1cm4gb2l0ZW1cclxuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHR1bmxlc3Mgb2JqZWN0X25hbWVcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRyZWxhdGVkTGlzdE9iamVjdHMgPSB7fVxyXG5cdFx0cmVsYXRlZExpc3ROYW1lcyA9IFtdXHJcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxyXG5cdFx0aWYgX29iamVjdFxyXG5cdFx0XHRyZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3RcclxuXHRcdFx0aWYgIV8uaXNFbXB0eSByZWxhdGVkTGlzdFxyXG5cdFx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdCwgKG9iak9yTmFtZSktPlxyXG5cdFx0XHRcdFx0aWYgXy5pc09iamVjdCBvYmpPck5hbWVcclxuXHRcdFx0XHRcdFx0cmVsYXRlZCA9XHJcblx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lXHJcblx0XHRcdFx0XHRcdFx0Y29sdW1uczogb2JqT3JOYW1lLmNvbHVtbnNcclxuXHRcdFx0XHRcdFx0XHRtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zXHJcblx0XHRcdFx0XHRcdFx0aXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT0gXCJjbXNfZmlsZXNcIlxyXG5cdFx0XHRcdFx0XHRcdGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnNcclxuXHRcdFx0XHRcdFx0XHRzb3J0OiBvYmpPck5hbWUuc29ydFxyXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogJydcclxuXHRcdFx0XHRcdFx0XHRjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBvYmpPck5hbWUubGFiZWxcclxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWRcclxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3ROYW1lcy5wdXNoIG9iak9yTmFtZS5vYmplY3ROYW1lXHJcblx0XHRcdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcgb2JqT3JOYW1lXHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWVcclxuXHJcblx0XHRtYXBMaXN0ID0ge31cclxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXHJcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3RfaXRlbSkgLT5cclxuXHRcdFx0aWYgIXJlbGF0ZWRfb2JqZWN0X2l0ZW0/Lm9iamVjdF9uYW1lXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lXHJcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXlcclxuXHRcdFx0c2hhcmluZyA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uc2hhcmluZ1xyXG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHVubGVzcyByZWxhdGVkX29iamVjdFxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXHJcblx0XHRcdGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxyXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXVxyXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxyXG5cclxuXHRcdFx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpXHJcblxyXG5cdFx0XHRpZiAvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSlcclxuXHRcdFx0XHQjIG9iamVjdOexu+Wei+W4puWtkOWxnuaAp+eahHJlbGF0ZWRfZmllbGRfbmFtZeimgeWOu+aOieS4remXtOeahOe+juWFg+espuWPt++8jOWQpuWImeaYvuekuuS4jeWHuuWtl+auteWAvFxyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLFwiXCIpXHJcblx0XHRcdHJlbGF0ZWQgPVxyXG5cdFx0XHRcdG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lXHJcblx0XHRcdFx0Y29sdW1uczogY29sdW1uc1xyXG5cdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBtb2JpbGVfY29sdW1uc1xyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXHJcblx0XHRcdFx0aXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHRcdFx0c2hhcmluZzogc2hhcmluZ1xyXG5cclxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxyXG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0XHJcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jb2x1bW5zXHJcblx0XHRcdFx0XHRyZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnNcclxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXHJcblx0XHRcdFx0XHRyZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1uc1xyXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3Quc29ydFxyXG5cdFx0XHRcdFx0cmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0XHJcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cclxuXHRcdFx0XHRcdHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cclxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XHJcblx0XHRcdFx0XHRyZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxyXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubGFiZWxcclxuXHRcdFx0XHRcdHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsXHJcblx0XHRcdFx0ZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxyXG5cclxuXHRcdFx0bWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWRcclxuXHJcblxyXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXHJcblx0XHR1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcclxuXHRcdF8uZWFjaCByZWxhdGVkTGlzdE9iamVjdHMsICh2LCByZWxhdGVkX29iamVjdF9uYW1lKSAtPlxyXG5cdFx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxyXG5cdFx0XHRhbGxvd1JlYWQgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmFsbG93UmVhZFxyXG5cdFx0XHRpZiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWRcclxuXHRcdFx0XHRtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdlxyXG5cclxuXHRcdGxpc3QgPSBbXVxyXG5cdFx0aWYgXy5pc0VtcHR5IHJlbGF0ZWRMaXN0TmFtZXNcclxuXHRcdFx0bGlzdCA9ICBfLnZhbHVlcyBtYXBMaXN0XHJcblx0XHRlbHNlXHJcblx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdE5hbWVzLCAob2JqZWN0TmFtZSkgLT5cclxuXHRcdFx0XHRpZiBtYXBMaXN0W29iamVjdE5hbWVdXHJcblx0XHRcdFx0XHRsaXN0LnB1c2ggbWFwTGlzdFtvYmplY3ROYW1lXVxyXG5cclxuXHRcdHJldHVybiBsaXN0XHJcblxyXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUpLT5cclxuXHRyZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpXHJcblxyXG4jIyMgXHJcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XHJcblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cclxuIyMjXHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYyktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxyXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGlmICFvYmplY3RcclxuXHRcdHJldHVyblxyXG5cdGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKVxyXG5cdHVubGVzcyBsaXN0Vmlld3M/Lmxlbmd0aFxyXG5cdFx0cmV0dXJuXHJcblx0bGlzdF92aWV3ID0gXy5maW5kV2hlcmUobGlzdFZpZXdzLHtcIl9pZFwiOmxpc3Rfdmlld19pZH0pXHJcblx0dW5sZXNzIGxpc3Rfdmlld1xyXG5cdFx0IyDlpoLmnpzkuI3pnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzliJnpu5jorqTov5Tlm57nrKzkuIDkuKrop4blm77vvIzlj43kuYvov5Tlm57nqbpcclxuXHRcdGlmIGV4YWNcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRlbHNlXHJcblx0XHRcdGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXVxyXG5cdHJldHVybiBsaXN0X3ZpZXdcclxuXHJcbiPojrflj5ZsaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77mmK/lkKbmmK/mnIDov5Hmn6XnnIvop4blm75cclxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcclxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcclxuXHRpZiB0eXBlb2YobGlzdF92aWV3X2lkKSA9PSBcInN0cmluZ1wiXHJcblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRcdGlmICFvYmplY3RcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLHtfaWQ6IGxpc3Rfdmlld19pZH0pXHJcblx0ZWxzZVxyXG5cdFx0bGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWRcclxuXHRyZXR1cm4gbGlzdFZpZXc/Lm5hbWUgPT0gXCJyZWNlbnRcIlxyXG5cclxuXHJcbiMjI1xyXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcclxuXHTop4TliJnvvJpcclxuXHQxLuS8mOWFiOaKimNvbHVtbnPkuK3nmoRuYW1l5a2X5q615o6S5Zyo56ys5LiA5LiqXHJcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XHJcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcclxuIyMjXHJcbkNyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpLT5cclxuXHRyZXN1bHQgPSBbXVxyXG5cdG1heFJvd3MgPSAyIFxyXG5cdG1heENvdW50ID0gbWF4Um93cyAqIDJcclxuXHRjb3VudCA9IDBcclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRmaWVsZHMgPSBvYmplY3QuZmllbGRzXHJcblx0dW5sZXNzIG9iamVjdFxyXG5cdFx0cmV0dXJuIGNvbHVtbnNcclxuXHRuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXHJcblx0aXNOYW1lQ29sdW1uID0gKGl0ZW0pLT5cclxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0cmV0dXJuIGl0ZW0uZmllbGQgPT0gbmFtZUtleVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gaXRlbSA9PSBuYW1lS2V5XHJcblx0Z2V0RmllbGQgPSAoaXRlbSktPlxyXG5cdFx0aWYgXy5pc09iamVjdChpdGVtKVxyXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW0uZmllbGRdXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBmaWVsZHNbaXRlbV1cclxuXHRpZiBuYW1lS2V5XHJcblx0XHRuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kIChpdGVtKS0+XHJcblx0XHRcdHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSlcclxuXHRpZiBuYW1lQ29sdW1uXHJcblx0XHRmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pXHJcblx0XHRpdGVtQ291bnQgPSBpZiBmaWVsZC5pc193aWRlIHRoZW4gMiBlbHNlIDFcclxuXHRcdGNvdW50ICs9IGl0ZW1Db3VudFxyXG5cdFx0cmVzdWx0LnB1c2ggbmFtZUNvbHVtblxyXG5cdGNvbHVtbnMuZm9yRWFjaCAoaXRlbSktPlxyXG5cdFx0ZmllbGQgPSBnZXRGaWVsZChpdGVtKVxyXG5cdFx0dW5sZXNzIGZpZWxkXHJcblx0XHRcdHJldHVyblxyXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXHJcblx0XHRpZiBjb3VudCA8IG1heENvdW50IGFuZCByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgYW5kICFpc05hbWVDb2x1bW4oaXRlbSlcclxuXHRcdFx0Y291bnQgKz0gaXRlbUNvdW50XHJcblx0XHRcdGlmIGNvdW50IDw9IG1heENvdW50XHJcblx0XHRcdFx0cmVzdWx0LnB1c2ggaXRlbVxyXG5cdFxyXG5cdHJldHVybiByZXN1bHRcclxuXHJcbiMjI1xyXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XHJcbiMjI1xyXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0aWYgIW9iamVjdFxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxyXG5cdGlmIG9iamVjdD8ubGlzdF92aWV3cz8uZGVmYXVsdFxyXG5cdFx0I1RPRE8g5q2k5Luj56CB5Y+q5piv5pqC5pe25YW85a655Lul5YmNY29kZeS4reWumuS5ieeahGRlZmF1bHTop4blm77vvIzlvoVjb2Rl5Lit55qEZGVmYXVsdOa4heeQhuWujOaIkOWQju+8jOmcgOimgeWIoOmZpOatpOS7o+eggVxyXG5cdFx0ZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3cy5kZWZhdWx0XHJcblx0ZWxzZVxyXG5cdFx0Xy5lYWNoIG9iamVjdD8ubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KS0+XHJcblx0XHRcdGlmIGxpc3Rfdmlldy5uYW1lID09IFwiYWxsXCIgfHwga2V5ID09IFwiYWxsXCJcclxuXHRcdFx0XHRkZWZhdWx0VmlldyA9IGxpc3Rfdmlld1xyXG5cdHJldHVybiBkZWZhdWx0VmlldztcclxuXHJcbiMjI1xyXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XHJcbiMjI1xyXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpLT5cclxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXHJcblx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Py5jb2x1bW5zXHJcblx0aWYgdXNlX21vYmlsZV9jb2x1bW5zXHJcblx0XHRpZiBkZWZhdWx0Vmlldz8ubW9iaWxlX2NvbHVtbnNcclxuXHRcdFx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zXHJcblx0XHRlbHNlIGlmIGNvbHVtbnNcclxuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpXHJcblx0cmV0dXJuIGNvbHVtbnNcclxuXHJcbiMjI1xyXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdHJldHVybiBkZWZhdWx0Vmlldz8uZXh0cmFfY29sdW1uc1xyXG5cclxuIyMjXHJcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXHJcbiMjI1xyXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdGlmIGRlZmF1bHRWaWV3XHJcblx0XHRpZiBkZWZhdWx0Vmlldy5zb3J0XHJcblx0XHRcdHJldHVybiBkZWZhdWx0Vmlldy5zb3J0XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dXHJcblxyXG5cclxuIyMjXHJcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xyXG4jIyNcclxuQ3JlYXRvci5pc0FsbFZpZXcgPSAobGlzdF92aWV3KS0+XHJcblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcImFsbFwiXHJcblxyXG4jIyNcclxuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XHJcbiMjI1xyXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IChsaXN0X3ZpZXcpLT5cclxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwicmVjZW50XCJcclxuXHJcbiMjI1xyXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cclxuIyMjXHJcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IChzb3J0LCB0YWJ1bGFyQ29sdW1ucyktPlxyXG5cdHRhYnVsYXJfc29ydCA9IFtdXHJcblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XHJcblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcclxuXHRcdFx0IyDlhbzlrrnml6fnmoTmlbDmja7moLzlvI9bW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxyXG5cdFx0XHRpZiBpdGVtLmxlbmd0aCA9PSAxXHJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxyXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXHJcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBcImFzY1wiXVxyXG5cdFx0XHRlbHNlIGlmIGl0ZW0ubGVuZ3RoID09IDJcclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pXHJcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcclxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dXHJcblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cclxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxyXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSlcclxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgb3JkZXJdXHJcblxyXG5cdHJldHVybiB0YWJ1bGFyX3NvcnRcclxuXHJcbiMjI1xyXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cclxuIyMjXHJcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSAoc29ydCktPlxyXG5cdGR4X3NvcnQgPSBbXVxyXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxyXG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXHJcblx0XHRcdCPlhbzlrrnml6fmoLzlvI/vvJpbW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxyXG5cdFx0XHRkeF9zb3J0LnB1c2goaXRlbSlcclxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxyXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxyXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXHJcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXHJcblx0XHRcdFx0ZHhfc29ydC5wdXNoIFtmaWVsZF9uYW1lLCBvcmRlcl1cclxuXHJcblx0cmV0dXJuIGR4X3NvcnRcclxuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIF9zY2hlbWEsIGNvbHVtbl9udW0sIGluaXRfd2lkdGhfcGVyY2VudCwgcmVmO1xuICBfc2NoZW1hID0gKHJlZiA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5fc2NoZW1hIDogdm9pZCAwO1xuICBjb2x1bW5fbnVtID0gMDtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgICAgdmFyIGZpZWxkLCBpc193aWRlLCByZWYxLCByZWYyO1xuICAgICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgICBpc193aWRlID0gKHJlZjEgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjIuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc193aWRlKSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW07XG4gICAgcmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSB7XG4gIHZhciBfc2NoZW1hLCBmaWVsZCwgaXNfd2lkZSwgcmVmLCByZWYxO1xuICBfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWE7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgaXNfd2lkZSA9IChyZWYgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIHJldHVybiBpc193aWRlO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgdmFyIG9iaiwgcmVmLCByZWYxLCByZWYyLCBzZXR0aW5nLCBzb3J0O1xuICBzZXR0aW5nID0gKHJlZiA9IENyZWF0b3IuQ29sbGVjdGlvbnMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5zZXR0aW5ncykgIT0gbnVsbCA/IHJlZjEuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IF8ubWFwKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgIHZhciBmaWVsZDtcbiAgICBmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXTtcbiAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSAmJiAhZmllbGQuaGlkZGVuKSB7XG4gICAgICByZXR1cm4gY29sdW1uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgfSk7XG4gIGNvbHVtbnMgPSBfLmNvbXBhY3QoY29sdW1ucyk7XG4gIGlmIChzZXR0aW5nICYmIHNldHRpbmcuc2V0dGluZ3MpIHtcbiAgICBzb3J0ID0gKChyZWYyID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gcmVmMi5zb3J0IDogdm9pZCAwKSB8fCBbXTtcbiAgICBzb3J0ID0gXy5tYXAoc29ydCwgZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgIHZhciBpbmRleCwga2V5O1xuICAgICAga2V5ID0gb3JkZXJbMF07XG4gICAgICBpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpO1xuICAgICAgb3JkZXJbMF0gPSBpbmRleCArIDE7XG4gICAgICByZXR1cm4gb3JkZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucywgZXh0cmFfY29sdW1ucywgb2JqZWN0LCBvcmRlciwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICBleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl07XG4gIGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl07XG4gIGlmIChkZWZhdWx0X2V4dHJhX2NvbHVtbnMpIHtcbiAgICBleHRyYV9jb2x1bW5zID0gXy51bmlvbihleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMpO1xuICB9XG4gIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW107XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gKHJlZiA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzKSAhPSBudWxsID8gcmVmW29iamVjdF9uYW1lXSA9IFtdIDogdm9pZCAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IGZ1bmN0aW9uKGRlZmF1bHRfdmlldywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSkge1xuICB2YXIgZGVmYXVsdF9jb2x1bW5zLCBkZWZhdWx0X21vYmlsZV9jb2x1bW5zLCBvaXRlbTtcbiAgZGVmYXVsdF9jb2x1bW5zID0gZGVmYXVsdF92aWV3ICE9IG51bGwgPyBkZWZhdWx0X3ZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldyAhPSBudWxsID8gZGVmYXVsdF92aWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIHJldHVybjtcbiAgfVxuICBvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KTtcbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpKSB7XG4gICAgb2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lO1xuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdO1xuICB9XG4gIGlmICghb2l0ZW0ubW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9tb2JpbGVfY29sdW1ucykge1xuICAgICAgb2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJyk7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uZmlsdGVyX3Njb3BlKSB7XG4gICAgb2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiO1xuICB9XG4gIGlmICghXy5oYXMob2l0ZW0sIFwiX2lkXCIpKSB7XG4gICAgb2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWU7XG4gIH0gZWxzZSB7XG4gICAgb2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZTtcbiAgfVxuICBpZiAoXy5pc1N0cmluZyhvaXRlbS5vcHRpb25zKSkge1xuICAgIG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpO1xuICB9XG4gIF8uZm9yRWFjaChvaXRlbS5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgIGlmICghXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2l0ZW07XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVsYXRlZExpc3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciBfb2JqZWN0LCBsaXN0LCBtYXBMaXN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TmFtZXMsIHJlbGF0ZWRMaXN0T2JqZWN0cywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgc3BhY2VJZCwgdW5yZWxhdGVkX29iamVjdHMsIHVzZXJJZDtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlbGF0ZWRMaXN0T2JqZWN0cyA9IHt9O1xuICAgIHJlbGF0ZWRMaXN0TmFtZXMgPSBbXTtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgICBpZiAoX29iamVjdCkge1xuICAgICAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICAgICAgaWYgKCFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqT3JOYW1lKSB7XG4gICAgICAgICAgdmFyIHJlbGF0ZWQ7XG4gICAgICAgICAgaWYgKF8uaXNPYmplY3Qob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lLFxuICAgICAgICAgICAgICBjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1ucyxcbiAgICAgICAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG9iak9yTmFtZS5tb2JpbGVfY29sdW1ucyxcbiAgICAgICAgICAgICAgaXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgICAgICAgIGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnMsXG4gICAgICAgICAgICAgIHNvcnQ6IG9iak9yTmFtZS5zb3J0LFxuICAgICAgICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6ICcnLFxuICAgICAgICAgICAgICBjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgbGFiZWw6IG9iak9yTmFtZS5sYWJlbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUub2JqZWN0TmFtZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE5hbWVzLnB1c2gob2JqT3JOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBtYXBMaXN0ID0ge307XG4gICAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfaXRlbSkge1xuICAgICAgdmFyIGNvbHVtbnMsIG1vYmlsZV9jb2x1bW5zLCBvcmRlciwgcmVsYXRlZCwgcmVsYXRlZE9iamVjdCwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgc2hhcmluZywgdGFidWxhcl9vcmRlcjtcbiAgICAgIGlmICghKHJlbGF0ZWRfb2JqZWN0X2l0ZW0gIT0gbnVsbCA/IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWUgOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lO1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleTtcbiAgICAgIHNoYXJpbmcgPSByZWxhdGVkX29iamVjdF9pdGVtLnNoYXJpbmc7XG4gICAgICByZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFyZWxhdGVkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgY29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgbW9iaWxlX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRydWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpO1xuICAgICAgaWYgKC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKSkge1xuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLywgXCJcIik7XG4gICAgICB9XG4gICAgICByZWxhdGVkID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zLFxuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgaXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgc2hhcmluZzogc2hhcmluZ1xuICAgICAgfTtcbiAgICAgIHJlbGF0ZWRPYmplY3QgPSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgICBpZiAocmVsYXRlZE9iamVjdCkge1xuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5jb2x1bW5zKSB7XG4gICAgICAgICAgcmVsYXRlZC5jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5jb2x1bW5zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zKSB7XG4gICAgICAgICAgcmVsYXRlZC5tb2JpbGVfY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3Quc29ydCkge1xuICAgICAgICAgIHJlbGF0ZWQuc29ydCA9IHJlbGF0ZWRPYmplY3Quc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb24pIHtcbiAgICAgICAgICByZWxhdGVkLmZpbHRlcnNGdW5jdGlvbiA9IHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0KSB7XG4gICAgICAgICAgcmVsYXRlZC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCA9IHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubGFiZWwpIHtcbiAgICAgICAgICByZWxhdGVkLmxhYmVsID0gcmVsYXRlZE9iamVjdC5sYWJlbDtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hcExpc3RbcmVsYXRlZC5vYmplY3RfbmFtZV0gPSByZWxhdGVkO1xuICAgIH0pO1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfLnZhbHVlcyhyZWxhdGVkTGlzdE9iamVjdHMpLCBcIm9iamVjdF9uYW1lXCIpO1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICB1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgXy5lYWNoKHJlbGF0ZWRMaXN0T2JqZWN0cywgZnVuY3Rpb24odiwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZjtcbiAgICAgIGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xO1xuICAgICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNBY3RpdmUgJiYgYWxsb3dSZWFkKSB7XG4gICAgICAgIHJldHVybiBtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsaXN0ID0gW107XG4gICAgaWYgKF8uaXNFbXB0eShyZWxhdGVkTGlzdE5hbWVzKSkge1xuICAgICAgbGlzdCA9IF8udmFsdWVzKG1hcExpc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gocmVsYXRlZExpc3ROYW1lcywgZnVuY3Rpb24ob2JqZWN0TmFtZSkge1xuICAgICAgICBpZiAobWFwTGlzdFtvYmplY3ROYW1lXSkge1xuICAgICAgICAgIHJldHVybiBsaXN0LnB1c2gobWFwTGlzdFtvYmplY3ROYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdDtcbiAgfTtcbn1cblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKTtcbn07XG5cblxuLyogXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxuXHRleGFj5Li6dHJ1ZeaXtu+8jOmcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOS4jem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKSB7XG4gIHZhciBsaXN0Vmlld3MsIGxpc3Rfdmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICBpZiAoIShsaXN0Vmlld3MgIT0gbnVsbCA/IGxpc3RWaWV3cy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RfdmlldyA9IF8uZmluZFdoZXJlKGxpc3RWaWV3cywge1xuICAgIFwiX2lkXCI6IGxpc3Rfdmlld19pZFxuICB9KTtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICBpZiAoZXhhYykge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF07XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0X3ZpZXc7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3SXNSZWNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciBsaXN0Vmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgbGlzdF92aWV3X2lkID09PSBcInN0cmluZ1wiKSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3MsIHtcbiAgICAgIF9pZDogbGlzdF92aWV3X2lkXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWQ7XG4gIH1cbiAgcmV0dXJuIChsaXN0VmlldyAhPSBudWxsID8gbGlzdFZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcblx06KeE5YiZ77yaXG5cdDEu5LyY5YWI5oqKY29sdW1uc+S4reeahG5hbWXlrZfmrrXmjpLlnKjnrKzkuIDkuKpcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXG4gKi9cblxuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBjb3VudCwgZmllbGQsIGZpZWxkcywgZ2V0RmllbGQsIGlzTmFtZUNvbHVtbiwgaXRlbUNvdW50LCBtYXhDb3VudCwgbWF4Um93cywgbmFtZUNvbHVtbiwgbmFtZUtleSwgb2JqZWN0LCByZXN1bHQ7XG4gIHJlc3VsdCA9IFtdO1xuICBtYXhSb3dzID0gMjtcbiAgbWF4Q291bnQgPSBtYXhSb3dzICogMjtcbiAgY291bnQgPSAwO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IG9iamVjdC5maWVsZHM7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cbiAgbmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgaXNOYW1lQ29sdW1uID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gaXRlbS5maWVsZCA9PT0gbmFtZUtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZW0gPT09IG5hbWVLZXk7XG4gICAgfVxuICB9O1xuICBnZXRGaWVsZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtXTtcbiAgICB9XG4gIH07XG4gIGlmIChuYW1lS2V5KSB7XG4gICAgbmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZChmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pO1xuICAgIH0pO1xuICB9XG4gIGlmIChuYW1lQ29sdW1uKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKTtcbiAgICBpdGVtQ291bnQgPSBmaWVsZC5pc193aWRlID8gMiA6IDE7XG4gICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgIHJlc3VsdC5wdXNoKG5hbWVDb2x1bW4pO1xuICB9XG4gIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChpdGVtKTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBpZiAoY291bnQgPCBtYXhDb3VudCAmJiByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgJiYgIWlzTmFtZUNvbHVtbihpdGVtKSkge1xuICAgICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgICAgaWYgKGNvdW50IDw9IG1heENvdW50KSB7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKlxuICAgIOiOt+WPlum7mOiupOinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXcsIG9iamVjdCwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgfVxuICBpZiAob2JqZWN0ICE9IG51bGwgPyAocmVmID0gb2JqZWN0Lmxpc3Rfdmlld3MpICE9IG51bGwgPyByZWZbXCJkZWZhdWx0XCJdIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3c1tcImRlZmF1bHRcIl07XG4gIH0gZWxzZSB7XG4gICAgXy5lYWNoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0Lmxpc3Rfdmlld3MgOiB2b2lkIDAsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG4gICAgICBpZiAobGlzdF92aWV3Lm5hbWUgPT09IFwiYWxsXCIgfHwga2V5ID09PSBcImFsbFwiKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmlldyA9IGxpc3RfdmlldztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZpZXc7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICh1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwKSB7XG4gICAgICBjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChjb2x1bW5zKSB7XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2x1bW5zO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuZXh0cmFfY29sdW1ucyA6IHZvaWQgMDtcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgaWYgKGRlZmF1bHRWaWV3KSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3LnNvcnQpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0Vmlldy5zb3J0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXTtcbiAgICB9XG4gIH1cbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuICovXG5cbkNyZWF0b3IuaXNBbGxWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwiYWxsXCI7XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gZnVuY3Rpb24oc29ydCwgdGFidWxhckNvbHVtbnMpIHtcbiAgdmFyIHRhYnVsYXJfc29ydDtcbiAgdGFidWxhcl9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGNvbHVtbl9pbmRleCwgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgaWYgKGl0ZW0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBcImFzY1wiXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBvcmRlcl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhYnVsYXJfc29ydDtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBkeF9zb3J0O1xuICBkeF9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChbZmllbGRfbmFtZSwgb3JkZXJdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZHhfc29ydDtcbn07XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cclxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJ9XHJcblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xyXG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXHJcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cclxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJ9XHJcblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xyXG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXHJcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCIvLyDlm6DkuLptZXRlb3LnvJbor5Fjb2ZmZWVzY3JpcHTkvJrlr7zoh7RldmFs5Ye95pWw5oql6ZSZ77yM5omA5Lul5Y2V54us5YaZ5Zyo5LiA5LiqanPmlofku7bkuK3jgIJcclxuQ3JlYXRvci5ldmFsSW5Db250ZXh0ID0gZnVuY3Rpb24oanMsIGNvbnRleHQpIHtcclxuICAgIC8vIyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgdGhlIGluLWxpbmUgYW5vbnltb3VzIGZ1bmN0aW9uIHdlIC5jYWxsIHdpdGggdGhlIHBhc3NlZCBjb250ZXh0XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7IFxyXG4gICAgXHRyZXR1cm4gZXZhbChqcyk7IFxyXG5cdH0uY2FsbChjb250ZXh0KTtcclxufVxyXG5cclxuXHJcbkNyZWF0b3IuZXZhbCA9IGZ1bmN0aW9uKGpzKXtcclxuXHR0cnl7XHJcblx0XHRyZXR1cm4gZXZhbChqcylcclxuXHR9Y2F0Y2ggKGUpe1xyXG5cdFx0Y29uc29sZS5lcnJvcihlLCBqcyk7XHJcblx0fVxyXG59OyIsIlx0Z2V0T3B0aW9uID0gKG9wdGlvbiktPlxyXG5cdFx0Zm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKVxyXG5cdFx0aWYgZm9vLmxlbmd0aCA+IDJcclxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdLCBjb2xvcjogZm9vWzJdfVxyXG5cdFx0ZWxzZSBpZiBmb28ubGVuZ3RoID4gMVxyXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV19XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1swXX1cclxuXHJcblx0Y29udmVydEZpZWxkID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCktPlxyXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xyXG5cdFx0XHRjb2RlID0gZmllbGQucGlja2xpc3QgfHwgXCIje29iamVjdF9uYW1lfS4je2ZpZWxkX25hbWV9XCI7XHJcblx0XHRcdGlmIGNvZGVcclxuXHRcdFx0XHRwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0aWYgcGlja2xpc3RcclxuXHRcdFx0XHRcdG9wdGlvbnMgPSBbXTtcclxuXHRcdFx0XHRcdGFsbE9wdGlvbnMgPSBbXTtcclxuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KVxyXG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpPy5yZXZlcnNlKCk7XHJcblx0XHRcdFx0XHRfLmVhY2ggcGlja2xpc3RPcHRpb25zLCAoaXRlbSktPlxyXG5cdFx0XHRcdFx0XHRsYWJlbCA9IGl0ZW0ubmFtZVxyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdGFsbE9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGVuYWJsZTogaXRlbS5lbmFibGUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbmFibGVcclxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLnB1c2goe2xhYmVsOiBsYWJlbCwgdmFsdWU6IHZhbHVlLCBjb2xvcjogaXRlbS5jb2xvcn0pXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZGVmYXVsdFxyXG5cdFx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlXHJcblx0XHRcdFx0XHRpZiBvcHRpb25zLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IG9wdGlvbnNcclxuXHRcdFx0XHRcdGlmIGFsbE9wdGlvbnMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRmaWVsZC5hbGxPcHRpb25zID0gYWxsT3B0aW9uc1xyXG5cdFx0cmV0dXJuIGZpZWxkO1xyXG5cclxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3QgPSAob2JqZWN0LCBzcGFjZUlkKS0+XHJcblx0XHRpZiAhb2JqZWN0XHJcblx0XHRcdHJldHVyblxyXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxyXG5cclxuXHRcdFx0aWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiKVxyXG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXI/Ll90b2RvXHJcblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcclxuXHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxyXG5cdFx0XHRcdFx0I+WPquaciXVwZGF0ZeaXtu+8jCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyDmiY3mnInlgLxcclxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj++8jOWwpOWFtuaYr0NvbGxlY3Rpb25cclxuXHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXsje190b2RvX2Zyb21fZGJ9fSlcIilcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCJcclxuXHRcdFx0XHRfdG9kbyA9IHRyaWdnZXIudG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcclxuXHRcdFx0XHRcdHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpXHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XHJcblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uPy5fdG9kb1xyXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSBhY3Rpb24/LnRvZG9cclxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlXHJcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxyXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24oKXsje190b2RvX2Zyb21fZGJ9fSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3JcclxuXHJcblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/Ll92aXNpYmxlXHJcblx0XHRcdFx0aWYgX3Zpc2libGVcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRhY3Rpb24udmlzaWJsZSA9IENyZWF0b3IuZXZhbChcIigje192aXNpYmxlfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxyXG5cdFx0XHRcdF90b2RvID0gYWN0aW9uPy50b2RvXHJcblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxyXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXHJcblx0XHRcdFx0XHRhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpXHJcblxyXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy52aXNpYmxlXHJcblxyXG5cdFx0XHRcdGlmIF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSlcclxuXHRcdFx0XHRcdGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKClcclxuXHJcblx0XHRfLmZvckVhY2ggb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBrZXkpLT5cclxuXHJcblx0XHRcdGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcclxuXHJcblx0XHRcdGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKVxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdFx0I+aUr+aMgVxcbuaIluiAheiLseaWh+mAl+WPt+WIhuWJsixcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdGlmIG9wdGlvbi5pbmRleE9mKFwiLFwiKVxyXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpXHJcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSlcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXHJcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcclxuXHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcclxuXHJcblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucylcclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cclxuXHRcdFx0XHRcdCPmlK/mjIHmlbDnu4TkuK3nm7TmjqXlrprkuYnmr4/kuKrpgInpobnnmoTnroDniYjmoLzlvI/lrZfnrKbkuLJcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLCAob3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcob3B0aW9uKVxyXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKG9wdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xyXG5cdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvclxyXG5cclxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpXHJcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdF8uZWFjaCBmaWVsZC5vcHRpb25zLCAodiwgayktPlxyXG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IHYsIHZhbHVlOiBrfVxyXG5cdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcclxuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNGdW5jdGlvbihvcHRpb25zKVxyXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9uc1xyXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQucmVnRXhcclxuXHRcdFx0XHRpZiByZWdFeFxyXG5cdFx0XHRcdFx0ZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVnRXggPSBmaWVsZC5fcmVnRXhcclxuXHRcdFx0XHRpZiByZWdFeFxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLnJlZ0V4ID0gQ3JlYXRvci5ldmFsKFwiKCN7cmVnRXh9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0bWluID0gZmllbGQubWluXHJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKG1pbilcclxuXHRcdFx0XHRcdGZpZWxkLl9taW4gPSBtaW4udG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0bWluID0gZmllbGQuX21pblxyXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWluKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLm1pbiA9IENyZWF0b3IuZXZhbChcIigje21pbn0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRtYXggPSBmaWVsZC5tYXhcclxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWF4KVxyXG5cdFx0XHRcdFx0ZmllbGQuX21heCA9IG1heC50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRtYXggPSBmaWVsZC5fbWF4XHJcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtYXgpXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0ZmllbGQubWF4ID0gQ3JlYXRvci5ldmFsKFwiKCN7bWF4fSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXHJcblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGVcclxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT0gT2JqZWN0ICYmIF90eXBlICE9IFN0cmluZyAmJiBfdHlwZSAhPSBOdW1iZXIgJiYgX3R5cGUgIT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXHJcblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlXHJcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKVxyXG5cdFx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3R5cGV9KVwiKVxyXG5cdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHJcblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXHJcblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxyXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxyXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gPSBvcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKVxyXG5cclxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKVxyXG5cclxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpXHJcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uID0gZmlsdGVyc0Z1bmN0aW9uLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cclxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxyXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvblxyXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uXHJcblxyXG5cdFx0XHRcdGlmIG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnNGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3IuZXZhbChcIigje3JlZmVyZW5jZV90b30pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2NyZWF0ZUZ1bmN0aW9ufSlcIilcclxuXHJcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7YmVmb3JlT3BlbkZ1bmN0aW9ufSlcIilcclxuXHJcblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyc0Z1bmN0aW9ufSlcIilcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cdFx0XHRcdGlmIGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlXHJcblxyXG5cdFx0XHRcdGlmICFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcclxuXHRcdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cclxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZGVmYXVsdFZhbHVlfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHRcdFx0XHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKVxyXG5cdFx0XHRcdFx0ZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3IuZXZhbChcIigje2lzX2NvbXBhbnlfbGltaXRlZH0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpIC0+XHJcblx0XHRcdCMjI1xyXG5cdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcclxuXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcclxuXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxyXG5cdFx0XHTlpoLvvJpcclxuXHRcdFx0ZmlsdGVyczogKCktPlxyXG5cdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXHJcblx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxyXG5cdFx0XHTlpoLvvJpcclxuXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XHJcblx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxyXG5cdFx0XHRdXVxyXG5cdFx0XHTmiJZcclxuXHRcdFx0ZmlsdGVyczogW3tcclxuXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxyXG5cdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXHJcblx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XHJcblx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXHJcblx0XHRcdH1dXHJcblx0XHRcdCMjI1xyXG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpXHJcblx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0XHRsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpXHJcblx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpXHJcblx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3IuZXZhbChcIigje2xpc3Rfdmlldy5fZmlsdGVyc30pXCIpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRfLmZvckVhY2ggbGlzdF92aWV3LmZpbHRlcnMsIChmaWx0ZXIsIF9pbmRleCktPlxyXG5cdFx0XHRcdFx0aWYgXy5pc0FycmF5KGZpbHRlcilcclxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIlxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRGF0ZShmaWx0ZXJbMl0pXHJcblx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOaYr0RhdGXnsbvlnovvvIzliJlmaWx0ZXJbMl3lgLzliLDliY3nq6/kvJroh6rliqjovazmiJDlrZfnrKbkuLLvvIzmoLzlvI/vvJpcIjIwMTgtMDMtMjlUMDM6NDM6MjEuNzg3WlwiXHJcblx0XHRcdFx0XHRcdFx0XHQjIOWMheaLrGdyaWTliJfooajor7fmsYLnmoTmjqXlj6PlnKjlhoXnmoTmiYDmnIlPRGF0YeaOpeWPo++8jERhdGXnsbvlnovlrZfmrrXpg73kvJrku6XkuIrov7DmoLzlvI/ov5Tlm55cclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiREFURVwiXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiRlVOQ1RJT05cIlxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyWzJdfSlcIilcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJEQVRFXCJcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGZpbHRlcilcclxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNEYXRlKGZpbHRlcj8udmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIuX2lzX2RhdGUgPT0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gbmV3IERhdGUoZmlsdGVyLnZhbHVlKVxyXG5cclxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRpZiBvYmplY3QuZm9ybSAmJiAhXy5pc1N0cmluZyhvYmplY3QuZm9ybSlcclxuXHRcdFx0XHRvYmplY3QuZm9ybSA9IEpTT04uc3RyaW5naWZ5IG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cclxuXHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbih2YWwpXHJcblx0XHRcdFx0XHRcdHJldHVybiB2YWwgKyAnJztcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcclxuXHRcdGVsc2UgaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGlmIG9iamVjdC5mb3JtXHJcblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlIG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cclxuXHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcclxuXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XHJcblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XHJcblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXHJcblx0XHRcdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcclxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpbHRlcnNfY29kZVwiLCB2YWxcclxuXHRcdGVsc2VcclxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XHJcblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XHJcblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcclxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKClcclxuXHJcblx0XHRyZXR1cm4gb2JqZWN0XHJcblxyXG5cclxuIiwidmFyIGNvbnZlcnRGaWVsZCwgZ2V0T3B0aW9uO1xuXG5nZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdmFyIGZvbztcbiAgZm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKTtcbiAgaWYgKGZvby5sZW5ndGggPiAyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdLFxuICAgICAgY29sb3I6IGZvb1syXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZm9vLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1swXVxuICAgIH07XG4gIH1cbn07XG5cbmNvbnZlcnRGaWVsZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCkge1xuICB2YXIgYWxsT3B0aW9ucywgY29kZSwgb3B0aW9ucywgcGlja2xpc3QsIHBpY2tsaXN0T3B0aW9ucywgcmVmO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICBjb2RlID0gZmllbGQucGlja2xpc3QgfHwgKG9iamVjdF9uYW1lICsgXCIuXCIgKyBmaWVsZF9uYW1lKTtcbiAgICBpZiAoY29kZSkge1xuICAgICAgcGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuICAgICAgaWYgKHBpY2tsaXN0KSB7XG4gICAgICAgIG9wdGlvbnMgPSBbXTtcbiAgICAgICAgYWxsT3B0aW9ucyA9IFtdO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdCk7XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IChyZWYgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJykpICE9IG51bGwgPyByZWYucmV2ZXJzZSgpIDogdm9pZCAwO1xuICAgICAgICBfLmVhY2gocGlja2xpc3RPcHRpb25zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIGxhYmVsLCB2YWx1ZTtcbiAgICAgICAgICBsYWJlbCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lO1xuICAgICAgICAgIGFsbE9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbmFibGU6IGl0ZW0uZW5hYmxlLFxuICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXRlbS5lbmFibGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtW1wiZGVmYXVsdFwiXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0LCBzcGFjZUlkKSB7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIGtleSkge1xuICAgIHZhciBfdG9kbywgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiO1xuICAgIGlmICgoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikpIHtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXIgIT0gbnVsbCA/IHRyaWdnZXIuX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSB7XG4gICAgICBfdG9kbyA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYiwgX3Zpc2libGUsIGVycm9yO1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSkpIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbigpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3Zpc2libGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvLCBfdmlzaWJsZTtcbiAgICAgIF90b2RvID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnZpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKSkge1xuICAgICAgICByZXR1cm4gYWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGtleSkge1xuICAgIHZhciBfb3B0aW9ucywgX3R5cGUsIGJlZm9yZU9wZW5GdW5jdGlvbiwgY3JlYXRlRnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSwgZXJyb3IsIGZpbHRlcnNGdW5jdGlvbiwgaXNfY29tcGFueV9saW1pdGVkLCBtYXgsIG1pbiwgb3B0aW9ucywgb3B0aW9uc0Z1bmN0aW9uLCByZWZlcmVuY2VfdG8sIHJlZ0V4O1xuICAgIGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcbiAgICBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgaWYgKG9wdGlvbi5pbmRleE9mKFwiLFwiKSkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKF9vcHRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIGlmIChfLmlzU3RyaW5nKG9wdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1pbiA9IGZpZWxkLm1pbjtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWluKSkge1xuICAgICAgICBmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pbiA9IGZpZWxkLl9taW47XG4gICAgICBpZiAoXy5pc1N0cmluZyhtaW4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWluID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtaW4gKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtYXggPSBmaWVsZC5tYXg7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1heCkpIHtcbiAgICAgICAgZmllbGQuX21heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXggPSBmaWVsZC5fbWF4O1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWF4KSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1heCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWF4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT09IE9iamVjdCAmJiBfdHlwZSAhPT0gU3RyaW5nICYmIF90eXBlICE9PSBOdW1iZXIgJiYgX3R5cGUgIT09IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSkpIHtcbiAgICAgICAgICBmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdHlwZSArIFwiKVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQub3B0aW9uc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHJlZmVyZW5jZV90byArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgY3JlYXRlRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGJlZm9yZU9wZW5GdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZTtcbiAgICAgIGlmICghZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBkZWZhdWx0VmFsdWUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICBpZiAoaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNGdW5jdGlvbihpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHJldHVybiBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICBpZiAoaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGlzX2NvbXBhbnlfbGltaXRlZCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIF8uZm9yRWFjaChvYmplY3QubGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcblxuICAgIC8qXG4gICAgXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXG4gICAgXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcbiAgICBcdFx0XHQxLiDmlbTkuKpmaWx0ZXJz5Li6ZnVuY3Rpb246XG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFtbW1wib2JqZWN0X25hbWVcIixcIj1cIixcInByb2plY3RfaXNzdWVzXCJdLCdvcicsW1wib2JqZWN0X25hbWVcIixcIj1cIixcInRhc2tzXCJdXV1cbiAgICBcdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiBbW1wib2JqZWN0X25hbWVcIiwgXCI9XCIsICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHRdXVxuICAgIFx0XHRcdOaIllxuICAgIFx0XHRcdGZpbHRlcnM6IFt7XG4gICAgXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxuICAgIFx0XHRcdFx0XCJvcGVyYXRpb25cIjogXCI9XCJcbiAgICBcdFx0XHRcdFwidmFsdWVcIjogKCktPlxuICAgIFx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0fV1cbiAgICAgKi9cbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGxpc3Rfdmlldy5fZmlsdGVycyArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF8uZm9yRWFjaChsaXN0X3ZpZXcuZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICAgICAgaWYgKF8uaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDMgJiYgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbHRlci5sZW5ndGggPT09IDMgJiYgXy5pc0RhdGUoZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJEQVRFXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiRlVOQ1RJT05cIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlclsyXSArIFwiKVwiKTtcbiAgICAgICAgICAgICAgZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJEQVRFXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gbmV3IERhdGUoZmlsdGVyWzJdKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0RhdGUoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5fdmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbHRlci5faXNfZGF0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gbmV3IERhdGUoZmlsdGVyLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pKSB7XG4gICAgICBvYmplY3QuZm9ybSA9IEpTT04uc3RyaW5naWZ5KG9iamVjdC5mb3JtLCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsICsgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChvYmplY3QuZm9ybSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlKG9iamVjdC5mb3JtLCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyh2YWwpICYmIHZhbC5zdGFydHNXaXRoKCdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkTGlzdCwgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImZpbHRlcnNfY29kZVwiLCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkTGlzdCwgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9XHJcblxyXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiXHJcblxyXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IChwcmVmaXgsZmllbGRWYXJpYWJsZSktPlxyXG5cdHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xyXG5cclxuXHRyZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UgcmVnLCAobSwgJDEpLT5cclxuXHRcdHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLyxcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZyxcIlxcXCJdW1xcXCJcIik7XHJcblxyXG5cdHJldHVybiByZXZcclxuXHJcbkNyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhID0gKGZvcm11bGFfc3RyKS0+XHJcblx0aWYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdHJldHVybiBmYWxzZVxyXG5cclxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSAoZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKS0+XHJcblx0aWYgZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cilcclxuXHJcblx0XHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucz8uZXh0ZW5kKVxyXG5cdFx0XHRleHRlbmQgPSB0cnVlXHJcblxyXG5cdFx0X1ZBTFVFUyA9IHt9XHJcblx0XHRfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpXHJcblx0XHRpZiBleHRlbmRcclxuXHRcdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucz8udXNlcklkLCBvcHRpb25zPy5zcGFjZUlkKSlcclxuXHRcdGZvcm11bGFfc3RyID0gQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEoXCJ0aGlzXCIsIGZvcm11bGFfc3RyKVxyXG5cclxuXHRcdHRyeVxyXG5cdFx0XHRkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKSAgICMg5q2k5aSE5LiN6IO955Sod2luZG93LmV2YWwg77yM5Lya5a+86Ie05Y+Y6YeP5L2c55So5Z+f5byC5bi4XHJcblx0XHRcdHJldHVybiBkYXRhXHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogI3tmb3JtdWxhX3N0cn1cIiwgZSlcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0dG9hc3RyPy5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogI3tmb3JtdWxhX3N0cn0je2V9XCJcclxuXHJcblx0cmV0dXJuIGZvcm11bGFfc3RyXHJcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fTtcblxuQ3JlYXRvci5Gb3JtdWxhci5QUkVGSVggPSBcIl9WQUxVRVNcIjtcblxuQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEgPSBmdW5jdGlvbihwcmVmaXgsIGZpZWxkVmFyaWFibGUpIHtcbiAgdmFyIHJlZywgcmV2O1xuICByZWcgPSAvKFxce1tee31dKlxcfSkvZztcbiAgcmV2ID0gZmllbGRWYXJpYWJsZS5yZXBsYWNlKHJlZywgZnVuY3Rpb24obSwgJDEpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJDEucmVwbGFjZSgvXFx7XFxzKi8sIFwiW1xcXCJcIikucmVwbGFjZSgvXFxzKlxcfS8sIFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZywgXCJcXFwiXVtcXFwiXCIpO1xuICB9KTtcbiAgcmV0dXJuIHJldjtcbn07XG5cbkNyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYV9zdHIpIHtcbiAgaWYgKF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ7XCIpID4gLTEgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIn1cIikgPiAtMSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuRm9ybXVsYXIucnVuID0gZnVuY3Rpb24oZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKSB7XG4gIHZhciBfVkFMVUVTLCBkYXRhLCBlLCBleHRlbmQ7XG4gIGlmIChmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSkge1xuICAgIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5leHRlbmQgOiB2b2lkIDApKSB7XG4gICAgICBleHRlbmQgPSB0cnVlO1xuICAgIH1cbiAgICBfVkFMVUVTID0ge307XG4gICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKTtcbiAgICBpZiAoZXh0ZW5kKSB7XG4gICAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgQ3JlYXRvci5nZXRVc2VyQ29udGV4dChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnVzZXJJZCA6IHZvaWQgMCwgb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zcGFjZUlkIDogdm9pZCAwKSk7XG4gICAgfVxuICAgIGZvcm11bGFfc3RyID0gQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEoXCJ0aGlzXCIsIGZvcm11bGFfc3RyKTtcbiAgICB0cnkge1xuICAgICAgZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUyk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyLCBlKTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0b2FzdHIgIT09IFwidW5kZWZpbmVkXCIgJiYgdG9hc3RyICE9PSBudWxsKSB7XG4gICAgICAgICAgdG9hc3RyLmVycm9yKFwi5YWs5byP5omn6KGM5Ye66ZSZ5LqG77yM6K+35qOA5p+l5YWs5byP6YWN572u5piv5ZCm5q2j56Gu77yBXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciArIGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZm9ybXVsYV9zdHI7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xyXG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fSAgICMg5q2k5a+56LGh5Y+q6IO95Zyo56Gu5L+d5omA5pyJT2JqZWN05Yid5aeL5YyW5a6M5oiQ5ZCO6LCD55So77yMIOWQpuWImeiOt+WPluWIsOeahG9iamVjdOS4jeWFqFxyXG5cclxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gKG9iamVjdF9uYW1lKS0+XHJcblx0aWYgb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpXHJcblx0XHRvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpXHJcblx0cmV0dXJuIG9iamVjdF9uYW1lXHJcblxyXG5DcmVhdG9yLk9iamVjdCA9IChvcHRpb25zKS0+XHJcblx0X2Jhc2VPYmplY3QgPSBDcmVhdG9yLmJhc2VPYmplY3RcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdF9iYXNlT2JqZWN0ID0ge2FjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zICwgZmllbGRzOiB7fSwgdHJpZ2dlcnM6IHt9LCBwZXJtaXNzaW9uX3NldDoge319XHJcblx0c2VsZiA9IHRoaXNcclxuXHRpZiAoIW9wdGlvbnMubmFtZSlcclxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcclxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xyXG5cclxuXHRzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZVxyXG5cdHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlXHJcblx0c2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lXHJcblx0c2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWxcclxuXHRzZWxmLmljb24gPSBvcHRpb25zLmljb25cclxuXHRzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvblxyXG5cdHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlld1xyXG5cdHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybVxyXG5cdHNlbGYucmVsYXRlZExpc3QgPSBvcHRpb25zLnJlbGF0ZWRMaXN0XHJcblx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSAgfHwgb3B0aW9ucy5pc19lbmFibGUgPT0gdHJ1ZVxyXG5cdFx0c2VsZi5pc19lbmFibGUgPSB0cnVlXHJcblx0ZWxzZVxyXG5cdFx0c2VsZi5pc19lbmFibGUgPSBmYWxzZVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2FsbG93X2FjdGlvbnMnKVxyXG5cdFx0XHRzZWxmLmFsbG93X2FjdGlvbnMgPSBvcHRpb25zLmFsbG93X2FjdGlvbnNcclxuXHRzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2hcclxuXHRzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzXHJcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xyXG5cdHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXNcclxuXHRzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0XHJcblx0aWYgb3B0aW9ucy5wYWdpbmdcclxuXHRcdHNlbGYucGFnaW5nID0gb3B0aW9ucy5wYWdpbmdcclxuXHRzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuXHJcblx0c2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PSB1bmRlZmluZWQpIG9yIG9wdGlvbnMuZW5hYmxlX2FwaVxyXG5cdHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b21cclxuXHRzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlXHJcblx0c2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcclxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlXHJcblx0XHRlbHNlXHJcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXHJcblx0XHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxyXG5cdGVsc2VcclxuXHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxyXG5cdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcclxuXHRzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvd1xyXG5cdHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55XHJcblx0c2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcilcclxuXHRzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlclxyXG5cdHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2hcclxuXHRzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWxcclxuXHRzZWxmLmVuYWJsZV9hcHByb3ZhbHMgPSBvcHRpb25zLmVuYWJsZV9hcHByb3ZhbHNcclxuXHRzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3dcclxuXHRzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93XHJcblx0aWYgXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50JylcclxuXHRcdHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50XHJcblx0c2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnXHJcblx0aWYgb3B0aW9ucy5kYXRhYmFzZV9uYW1lXHJcblx0XHRzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWVcclxuXHRpZiAoIW9wdGlvbnMuZmllbGRzKVxyXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XHJcblxyXG5cdHNlbGYuZmllbGRzID0gY2xvbmUob3B0aW9ucy5maWVsZHMpXHJcblxyXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRpZiBmaWVsZC5pc19uYW1lXHJcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXHJcblx0XHRlbHNlIGlmIGZpZWxkX25hbWUgPT0gJ25hbWUnICYmICFzZWxmLk5BTUVfRklFTERfS0VZXHJcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXHJcblx0XHRpZiBmaWVsZC5wcmltYXJ5XHJcblx0XHRcdHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXHJcblx0XHRcdFx0aWYgZmllbGRfbmFtZSA9PSAnc3BhY2UnXHJcblx0XHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gZmFsc2VcclxuXHJcblx0aWYgIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcclxuXHRcdF8uZWFjaCBfYmFzZU9iamVjdC5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0XHRpZiAhc2VsZi5maWVsZHNbZmllbGRfbmFtZV1cclxuXHRcdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9XHJcblx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKVxyXG5cclxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0aWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcclxuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXHJcblxyXG5cdHNlbGYubGlzdF92aWV3cyA9IHt9XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KHNlbGYubmFtZSlcclxuXHRfLmVhY2ggb3B0aW9ucy5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRWaWV3LCBpdGVtLCBpdGVtX25hbWUpXHJcblx0XHRzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtXHJcblxyXG5cdHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKVxyXG5cdF8uZWFjaCBvcHRpb25zLnRyaWdnZXJzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpZiAhc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdXHJcblx0XHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9XHJcblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZVxyXG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pLCBpdGVtKVxyXG5cclxuXHRzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpXHJcblx0Xy5lYWNoIG9wdGlvbnMuYWN0aW9ucywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdFx0aWYgIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdXHJcblx0XHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge31cclxuXHRcdGNvcHlJdGVtID0gXy5jbG9uZShzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSlcclxuXHRcdGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSAj5YWI5Yig6Zmk55u45YWz5bGe5oCn5YaN6YeN5bu65omN6IO95L+d6K+B5ZCO57ut6YeN5aSN5a6a5LmJ55qE5bGe5oCn6aG65bqP55Sf5pWIXHJcblx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKVxyXG5cclxuXHRfLmVhY2ggc2VsZi5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpdGVtLm5hbWUgPSBpdGVtX25hbWVcclxuXHJcblx0c2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSlcclxuXHJcblx0IyDorqnmiYDmnIlvYmplY3Tpu5jorqTmnInmiYDmnIlsaXN0X3ZpZXdzL2FjdGlvbnMvcmVsYXRlZF9vYmplY3RzL3JlYWRhYmxlX2ZpZWxkcy9lZGl0YWJsZV9maWVsZHPlrozmlbTmnYPpmZDvvIzor6XmnYPpmZDlj6/og73ooqvmlbDmja7lupPkuK3orr7nva7nmoRhZG1pbi91c2Vy5p2D6ZmQ6KaG55uWXHJcblx0c2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoX2Jhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpXHJcblx0IyBkZWZhdWx0TGlzdFZpZXdzID0gXy5rZXlzKHNlbGYubGlzdF92aWV3cylcclxuXHQjIGRlZmF1bHRBY3Rpb25zID0gXy5rZXlzKHNlbGYuYWN0aW9ucylcclxuXHQjIGRlZmF1bHRSZWxhdGVkT2JqZWN0cyA9IF8ucGx1Y2soc2VsZi5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxyXG5cdCMgZGVmYXVsdFJlYWRhYmxlRmllbGRzID0gW11cclxuXHQjIGRlZmF1bHRFZGl0YWJsZUZpZWxkcyA9IFtdXHJcblx0IyBfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdCMgXHRpZiAhKGZpZWxkLmhpZGRlbikgICAgIzIzMSBvbWl05a2X5q615pSv5oyB5Zyo6Z2e57yW6L6R6aG16Z2i5p+l55yLLCDlm6DmraTliKDpmaTkuobmraTlpITlr7lvbWl055qE5Yik5patXHJcblx0IyBcdFx0ZGVmYXVsdFJlYWRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxyXG5cdCMgXHRcdGlmICFmaWVsZC5yZWFkb25seVxyXG5cdCMgXHRcdFx0ZGVmYXVsdEVkaXRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxyXG5cclxuXHQjIF8uZWFjaCBzZWxmLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0IyBcdGlmIGl0ZW1fbmFtZSA9PSBcIm5vbmVcIlxyXG5cdCMgXHRcdHJldHVyblxyXG5cdCMgXHRpZiBzZWxmLmxpc3Rfdmlld3NcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ubGlzdF92aWV3cyA9IGRlZmF1bHRMaXN0Vmlld3NcclxuXHQjIFx0aWYgc2VsZi5hY3Rpb25zXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmFjdGlvbnMgPSBkZWZhdWx0QWN0aW9uc1xyXG5cdCMgXHRpZiBzZWxmLnJlbGF0ZWRfb2JqZWN0c1xyXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWxhdGVkX29iamVjdHMgPSBkZWZhdWx0UmVsYXRlZE9iamVjdHNcclxuXHQjIFx0aWYgc2VsZi5maWVsZHNcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVhZGFibGVfZmllbGRzID0gZGVmYXVsdFJlYWRhYmxlRmllbGRzXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmVkaXRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRFZGl0YWJsZUZpZWxkc1xyXG5cdHVubGVzcyBvcHRpb25zLnBlcm1pc3Npb25fc2V0XHJcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge31cclxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LmFkbWluKVxyXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKVxyXG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8udXNlcilcclxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pXHJcblx0Xy5lYWNoIG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdGlmICFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV1cclxuXHRcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge31cclxuXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSlcclxuXHJcblx0IyDliY3nq6/moLnmja5wZXJtaXNzaW9uc+aUueWGmWZpZWxk55u45YWz5bGe5oCn77yM5ZCO56uv5Y+q6KaB6LWw6buY6K6k5bGe5oCn5bCx6KGM77yM5LiN6ZyA6KaB5pS55YaZXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnNcclxuXHRcdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucz8uZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0aWYgZGlzYWJsZWRfbGlzdF92aWV3cz8ubGVuZ3RoXHJcblx0XHRcdGRlZmF1bHRMaXN0Vmlld0lkID0gb3B0aW9ucy5saXN0X3ZpZXdzPy5hbGw/Ll9pZFxyXG5cdFx0XHRpZiBkZWZhdWx0TGlzdFZpZXdJZFxyXG5cdFx0XHRcdCMg5oqK6KeG5Zu+5p2D6ZmQ6YWN572u5Lit6buY6K6k55qEYWxs6KeG5Zu+aWTovazmjaLmiJBhbGzlhbPplK7lrZdcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAgZGlzYWJsZWRfbGlzdF92aWV3cywgKGxpc3Rfdmlld19pdGVtKSAtPlxyXG5cdFx0XHRcdFx0cmV0dXJuIGlmIGRlZmF1bHRMaXN0Vmlld0lkID09IGxpc3Rfdmlld19pdGVtIHRoZW4gXCJhbGxcIiBlbHNlIGxpc3Rfdmlld19pdGVtXHJcblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKVxyXG4jXHRcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcbiNcdFx0XHRpZiBmaWVsZFxyXG4jXHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVucmVhZGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA8IDBcclxuI1x0XHRcdFx0XHRpZiBmaWVsZC5oaWRkZW5cclxuI1x0XHRcdFx0XHRcdHJldHVyblxyXG4jXHRcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5lZGl0YWJsZV9maWVsZHMsIGZpZWxkX25hbWUpID4gLTFcclxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxyXG4jXHRcdFx0XHRcdFx0ZmllbGQuZGlzYWJsZWQgPSB0cnVlXHJcbiNcdFx0XHRcdFx0XHQjIOW9k+WPquivu+aXtu+8jOWmguaenOS4jeWOu+aOieW/heWhq+Wtl+aute+8jGF1dG9mb3Jt5piv5Lya5oql6ZSZ55qEXHJcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZXF1aXJlZCA9IGZhbHNlXHJcbiNcdFx0XHRcdGVsc2VcclxuI1x0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSB0cnVlXHJcblx0ZWxzZVxyXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG51bGxcclxuXHJcblx0X2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpXHJcblxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYlxyXG5cclxuXHRzZWxmLmRiID0gX2RiXHJcblxyXG5cdHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZVxyXG5cclxuXHRzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKVxyXG5cdHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpXHJcblx0aWYgc2VsZi5uYW1lICE9IFwidXNlcnNcIiBhbmQgc2VsZi5uYW1lICE9IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXHJcblx0aWYgc2VsZi5uYW1lID09IFwidXNlcnNcIlxyXG5cdFx0X2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYVxyXG5cclxuXHRpZiBfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxyXG5cclxuXHRDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGZcclxuXHJcblx0cmV0dXJuIHNlbGZcclxuXHJcbiMgQ3JlYXRvci5PYmplY3QucHJvdG90eXBlLmkxOG4gPSAoKS0+XHJcbiMgXHQjIHNldCBvYmplY3QgbGFiZWxcclxuIyBcdHNlbGYgPSB0aGlzXHJcblxyXG4jIFx0a2V5ID0gc2VsZi5uYW1lXHJcbiMgXHRpZiB0KGtleSkgPT0ga2V5XHJcbiMgXHRcdGlmICFzZWxmLmxhYmVsXHJcbiMgXHRcdFx0c2VsZi5sYWJlbCA9IHNlbGYubmFtZVxyXG4jIFx0ZWxzZVxyXG4jIFx0XHRzZWxmLmxhYmVsID0gdChrZXkpXHJcblxyXG4jIFx0IyBzZXQgZmllbGQgbGFiZWxzXHJcbiMgXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG4jIFx0XHRma2V5ID0gc2VsZi5uYW1lICsgXCJfXCIgKyBmaWVsZF9uYW1lXHJcbiMgXHRcdGlmIHQoZmtleSkgPT0gZmtleVxyXG4jIFx0XHRcdGlmICFmaWVsZC5sYWJlbFxyXG4jIFx0XHRcdFx0ZmllbGQubGFiZWwgPSBmaWVsZF9uYW1lXHJcbiMgXHRcdGVsc2VcclxuIyBcdFx0XHRmaWVsZC5sYWJlbCA9IHQoZmtleSlcclxuIyBcdFx0c2VsZi5zY2hlbWE/Ll9zY2hlbWE/W2ZpZWxkX25hbWVdPy5sYWJlbCA9IGZpZWxkLmxhYmVsXHJcblxyXG5cclxuIyBcdCMgc2V0IGxpc3R2aWV3IGxhYmVsc1xyXG4jIFx0Xy5lYWNoIHNlbGYubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG4jIFx0XHRpMThuX2tleSA9IHNlbGYubmFtZSArIFwiX2xpc3R2aWV3X1wiICsgaXRlbV9uYW1lXHJcbiMgXHRcdGlmIHQoaTE4bl9rZXkpID09IGkxOG5fa2V5XHJcbiMgXHRcdFx0aWYgIWl0ZW0ubGFiZWxcclxuIyBcdFx0XHRcdGl0ZW0ubGFiZWwgPSBpdGVtX25hbWVcclxuIyBcdFx0ZWxzZVxyXG4jIFx0XHRcdGl0ZW0ubGFiZWwgPSB0KGkxOG5fa2V5KVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSAob2JqZWN0KS0+XHJcblx0aWYgb2JqZWN0XHJcblx0XHRpZiAhb2JqZWN0LmRhdGFiYXNlX25hbWUgfHwgb2JqZWN0LmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcclxuXHRcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBcIi9hcGkvb2RhdGEvI3tvYmplY3QuZGF0YWJhc2VfbmFtZX1cIlxyXG5cclxuIyBpZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcbiMgXHRNZXRlb3Iuc3RhcnR1cCAtPlxyXG4jIFx0XHRUcmFja2VyLmF1dG9ydW4gLT5cclxuIyBcdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICYmIENyZWF0b3IuYm9vdHN0cmFwTG9hZGVkPy5nZXQoKVxyXG4jIFx0XHRcdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cclxuIyBcdFx0XHRcdFx0b2JqZWN0LmkxOG4oKVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRpZiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzXHJcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAob2JqZWN0KS0+XHJcblx0XHRcdG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpXHJcblxyXG4iLCJ2YXIgY2xvbmU7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge307XG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJykpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpO1xuICB9XG4gIHJldHVybiBvYmplY3RfbmFtZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX2Jhc2VPYmplY3QsIF9kYiwgZGVmYXVsdExpc3RWaWV3SWQsIGRlZmF1bHRWaWV3LCBkaXNhYmxlZF9saXN0X3ZpZXdzLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzY2hlbWEsIHNlbGY7XG4gIF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgX2Jhc2VPYmplY3QgPSB7XG4gICAgICBhY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyxcbiAgICAgIGZpZWxkczoge30sXG4gICAgICB0cmlnZ2Vyczoge30sXG4gICAgICBwZXJtaXNzaW9uX3NldDoge31cbiAgICB9O1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICBpZiAoIW9wdGlvbnMubmFtZSkge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gIH1cbiAgc2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWU7XG4gIHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICBzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gIHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsO1xuICBzZWxmLmljb24gPSBvcHRpb25zLmljb247XG4gIHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uO1xuICBzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXc7XG4gIHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybTtcbiAgc2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Q7XG4gIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09PSB0cnVlKSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gZmFsc2U7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYWxsb3dfYWN0aW9ucycpKSB7XG4gICAgICBzZWxmLmFsbG93X2FjdGlvbnMgPSBvcHRpb25zLmFsbG93X2FjdGlvbnM7XG4gICAgfVxuICB9XG4gIHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaDtcbiAgc2VsZi5lbmFibGVfZmlsZXMgPSBvcHRpb25zLmVuYWJsZV9maWxlcztcbiAgc2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrcztcbiAgc2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3RlcztcbiAgc2VsZi5lbmFibGVfYXVkaXQgPSBvcHRpb25zLmVuYWJsZV9hdWRpdDtcbiAgaWYgKG9wdGlvbnMucGFnaW5nKSB7XG4gICAgc2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZztcbiAgfVxuICBzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuO1xuICBzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09PSB2b2lkIDApIHx8IG9wdGlvbnMuZW5hYmxlX2FwaTtcbiAgc2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbTtcbiAgc2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZTtcbiAgc2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSkge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICB9XG4gIHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93O1xuICBzZWxmLmZpbHRlcl9jb21wYW55ID0gb3B0aW9ucy5maWx0ZXJfY29tcGFueTtcbiAgc2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcik7XG4gIHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyO1xuICBzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoO1xuICBzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWw7XG4gIHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFscztcbiAgc2VsZi5lbmFibGVfZm9sbG93ID0gb3B0aW9ucy5lbmFibGVfZm9sbG93O1xuICBzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93O1xuICBpZiAoXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50JykpIHtcbiAgICBzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudDtcbiAgfVxuICBzZWxmLmlkRmllbGROYW1lID0gJ19pZCc7XG4gIGlmIChvcHRpb25zLmRhdGFiYXNlX25hbWUpIHtcbiAgICBzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWU7XG4gIH1cbiAgaWYgKCFvcHRpb25zLmZpZWxkcykge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gIH1cbiAgc2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcyk7XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQuaXNfbmFtZSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZF9uYW1lID09PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVkpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoZmllbGQucHJpbWFyeSkge1xuICAgICAgc2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT09ICdtZXRlb3ItbW9uZ28nKSB7XG4gICAgXy5lYWNoKF9iYXNlT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmICghc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pIHtcbiAgICAgICAgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgc2VsZi5saXN0X3ZpZXdzID0ge307XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpO1xuICBfLmVhY2gob3B0aW9ucy5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgb2l0ZW07XG4gICAgb2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKTtcbiAgICByZXR1cm4gc2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbTtcbiAgfSk7XG4gIHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKTtcbiAgXy5lYWNoKG9wdGlvbnMudHJpZ2dlcnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWU7XG4gICAgcmV0dXJuIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpO1xuICBfLmVhY2gob3B0aW9ucy5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgY29weUl0ZW07XG4gICAgaWYgKCFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgY29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKTtcbiAgICBkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV07XG4gICAgcmV0dXJuIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pO1xuICB9KTtcbiAgXy5lYWNoKHNlbGYuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgfSk7XG4gIHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpO1xuICBzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldCk7XG4gIGlmICghb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fTtcbiAgfVxuICBpZiAoISgocmVmID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZi5hZG1pbiA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pO1xuICB9XG4gIGlmICghKChyZWYxID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZjEudXNlciA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKTtcbiAgfVxuICBfLmVhY2gob3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnM7XG4gICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwO1xuICAgIGlmIChkaXNhYmxlZF9saXN0X3ZpZXdzICE9IG51bGwgPyBkaXNhYmxlZF9saXN0X3ZpZXdzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZGVmYXVsdExpc3RWaWV3SWQgPSAocmVmMiA9IG9wdGlvbnMubGlzdF92aWV3cykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hbGwpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCkge1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAoZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQgPT09IGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Rfdmlld19pdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlbGYucGVybWlzc2lvbnMgPSBudWxsO1xuICB9XG4gIF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiO1xuICBzZWxmLmRiID0gX2RiO1xuICBzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWU7XG4gIHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpO1xuICBzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKTtcbiAgaWYgKHNlbGYubmFtZSAhPT0gXCJ1c2Vyc1wiICYmIHNlbGYubmFtZSAhPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoc2VsZi5uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICBfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hO1xuICB9XG4gIGlmIChfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgQ3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmO1xuICByZXR1cm4gc2VsZjtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCkge1xuICAgIGlmICghb2JqZWN0LmRhdGFiYXNlX25hbWUgfHwgb2JqZWN0LmRhdGFiYXNlX25hbWUgPT09ICdtZXRlb3ItbW9uZ28nKSB7XG4gICAgICByZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIi9hcGkvb2RhdGEvXCIgKyBvYmplY3QuZGF0YWJhc2VfbmFtZTtcbiAgICB9XG4gIH1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBpZiAoIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkICYmIENyZWF0b3IuT2JqZWN0cykge1xuICAgIHJldHVybiBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBuZXcgQ3JlYXRvci5PYmplY3Qob2JqZWN0KTtcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldE9iamVjdFNjaGVtYSA9IChvYmopIC0+XHJcblx0dW5sZXNzIG9ialxyXG5cdFx0cmV0dXJuXHJcblx0c2NoZW1hID0ge31cclxuXHJcblx0ZmllbGRzQXJyID0gW11cclxuXHJcblx0Xy5lYWNoIG9iai5maWVsZHMgLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuXHRcdGlmICFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpXHJcblx0XHRcdGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lXHJcblx0XHRmaWVsZHNBcnIucHVzaCBmaWVsZFxyXG5cclxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxyXG5cclxuXHRcdGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lXHJcblxyXG5cdFx0ZnMgPSB7fVxyXG5cdFx0aWYgZmllbGQucmVnRXhcclxuXHRcdFx0ZnMucmVnRXggPSBmaWVsZC5yZWdFeFxyXG5cdFx0ZnMuYXV0b2Zvcm0gPSB7fVxyXG5cdFx0ZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0YXV0b2Zvcm1fdHlwZSA9IGZpZWxkLmF1dG9mb3JtPy50eXBlXHJcblxyXG5cdFx0aWYgZmllbGQudHlwZSA9PSBcInRleHRcIiBvciBmaWVsZC50eXBlID09IFwicGhvbmVcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbdGV4dF1cIiBvciBmaWVsZC50eXBlID09IFwiW3Bob25lXVwiXHJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnY29kZSdcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyXHJcblx0XHRcdGlmIGZpZWxkLmxhbmd1YWdlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidGV4dGFyZWFcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwicGFzc3dvcmRcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxyXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpXHJcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcclxuXHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XHJcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXHJcblx0XHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcclxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxyXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXHJcblxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxyXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpXHJcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcclxuXHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XHJcblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxyXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxyXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbT2JqZWN0XVwiXHJcblx0XHRcdGZzLnR5cGUgPSBbT2JqZWN0XVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaHRtbFwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxyXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCIgfHwgbG9jYWxlID09IFwiemgtQ05cIlxyXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJlbi1VU1wiXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdHR5cGU6IFwic3VtbWVybm90ZVwiXHJcblx0XHRcdFx0XHRjbGFzczogJ3N1bW1lcm5vdGUtZWRpdG9yJ1xyXG5cdFx0XHRcdFx0c2V0dGluZ3M6XHJcblx0XHRcdFx0XHRcdGhlaWdodDogMjAwXHJcblx0XHRcdFx0XHRcdGRpYWxvZ3NJbkJvZHk6IHRydWVcclxuXHRcdFx0XHRcdFx0dG9vbGJhcjogIFtcclxuXHRcdFx0XHRcdFx0XHRbJ2ZvbnQxJywgWydzdHlsZSddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ2ZvbnQyJywgWydib2xkJywgJ3VuZGVybGluZScsICdpdGFsaWMnLCAnY2xlYXInXV0sXHJcblx0XHRcdFx0XHRcdFx0Wydmb250MycsIFsnZm9udG5hbWUnXV0sXHJcblx0XHRcdFx0XHRcdFx0Wydjb2xvcicsIFsnY29sb3InXV0sXHJcblx0XHRcdFx0XHRcdFx0WydwYXJhJywgWyd1bCcsICdvbCcsICdwYXJhZ3JhcGgnXV0sXHJcblx0XHRcdFx0XHRcdFx0Wyd0YWJsZScsIFsndGFibGUnXV0sXHJcblx0XHRcdFx0XHRcdFx0WydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZSddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ3ZpZXcnLCBbJ2NvZGV2aWV3J11dXHJcblx0XHRcdFx0XHRcdF1cclxuXHRcdFx0XHRcdFx0Zm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCfpu5HkvZMnLCflvq7ova/pm4Xpu5EnLCfku7/lrosnLCfmpbfkvZMnLCfpmrbkuaYnLCflubzlnIYnXVxyXG5cdFx0XHRcdFx0XHRsYW5nOiBsb2NhbGVcclxuXHJcblx0XHRlbHNlIGlmIChmaWVsZC50eXBlID09IFwibG9va3VwXCIgb3IgZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblxyXG5cdFx0XHRpZiAhZmllbGQuaGlkZGVuXHJcblxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzXHJcblxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlcGVuZE9uID0gZmllbGQuZGVwZW5kX29uXHJcblxyXG5cdFx0XHRcdGlmIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxyXG5cdFx0XHRcdFx0ZnMuYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXHJcblxyXG5cdFx0XHRcdGZzLmZpbHRlcnNGdW5jdGlvbiA9IGlmIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiB0aGVuIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiBlbHNlIENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzXHJcblxyXG5cdFx0XHRcdGlmIGZpZWxkLm9wdGlvbnNGdW5jdGlvblxyXG5cdFx0XHRcdFx0ZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXHJcblxyXG5cdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRpZiBmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRcdFx0XHRfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBfcmVmX29iaj8ucGVybWlzc2lvbnM/LmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSAobG9va3VwX2ZpZWxkKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0TW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZX1cIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcm1JZDogXCJuZXcje2ZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywnXycpfVwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IFwiI3tmaWVsZC5yZWZlcmVuY2VfdG99XCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVyYXRpb246IFwiaW5zZXJ0XCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvblN1Y2Nlc3M6IChvcGVyYXRpb24sIHJlc3VsdCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZXN1bHQub2JqZWN0X25hbWUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlc3VsdC5vYmplY3RfbmFtZSA9PSBcIm9iamVjdHNcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSwgaWNvbjogcmVzdWx0LnZhbHVlLmljb259XSwgcmVzdWx0LnZhbHVlLm5hbWUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLCB2YWx1ZTogcmVzdWx0Ll9pZH1dLCByZXN1bHQuX2lkKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlXHJcblxyXG5cdFx0XHRcdFx0aWYgXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKVxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGVcclxuXHJcblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2Vfc29ydFxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0XHJcblxyXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX2xpbWl0XHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdFxyXG5cclxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90byA9PSBcInVzZXJzXCJcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiXHJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcclxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOihqOekuui/h+a7pOaVsOaNruaXtuaYr+WQpuWPquaYvuekuuacrOWNleS9jeS4i+eahOaVsOaNrlxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXHJcblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxyXG5cdFx0XHRcdFx0XHRcdFx0IyDmnKrlrprkuYlpc19jb21wYW55X2xpbWl0ZWTlsZ7mgKfml7bpu5jorqTlpITnkIbpgLvovpHvvJpcclxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7ljZXkvY3liJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7ljZXkvY1cclxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcclxuXHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWNleS9jemDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzVW5MaW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOS8oOWFpeW9k+WJjeWvueixoeeahOadg+mZkO+8jOWcqOWHveaVsOS4reagueaNruadg+mZkOiuoeeul+aYr+WQpuimgemZkOWItuWPquafpeeci+acrOWNleS9jVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOacjeWKoeerr+eUqOS4jeWIsGlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdGVsc2UgaWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwib3JnYW5pemF0aW9uc1wiXHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiXHJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcclxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOihqOekuui/h+a7pOaVsOaNruaXtuaYr+WQpuWPquaYvuekuuacrOWNleS9jeS4i+eahOaVsOaNrlxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXHJcblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxyXG5cdFx0XHRcdFx0XHRcdFx0IyDmnKrlrprkuYlpc19jb21wYW55X2xpbWl0ZWTlsZ7mgKfml7bpu5jorqTlpITnkIbpgLvovpHvvJpcclxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7ljZXkvY3liJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7ljZXkvY1cclxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcclxuXHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWNleS9jemDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzVW5MaW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOS8oOWFpeW9k+WJjeWvueixoeeahOadg+mZkO+8jOWcqOWHveaVsOS4reagueaNruadg+mZkOiuoeeul+aYr+WQpuimgemZkOWItuWPquafpeeci+acrOWNleS9jVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOacjeWKoeerr+eUqOS4jeWIsGlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aWYgdHlwZW9mKGZpZWxkLnJlZmVyZW5jZV90bykgPT0gXCJmdW5jdGlvblwiXHJcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoX3JlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRmcy50eXBlID0gT2JqZWN0XHJcblx0XHRcdFx0XHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub2JqZWN0U3dpdGNoZSA9IHRydWVcclxuXHJcblx0XHRcdFx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogU3RyaW5nXHJcblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFtTdHJpbmddXHJcblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b11cclxuXHJcblx0XHRcdFx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV90b1swXV1cclxuXHRcdFx0XHRcdFx0aWYgX29iamVjdCBhbmQgX29iamVjdC5lbmFibGVfdHJlZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFRyZWVcIlxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2QgPSBmaWVsZC5vcHRpb25zTWV0aG9kIHx8IFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiXHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZFBhcmFtcyA9ICgpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfVxyXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdXHJcblx0XHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvLmZvckVhY2ggKF9yZWZlcmVuY2UpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlXVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfb2JqZWN0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IF9vYmplY3Q/LmxhYmVsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBfb2JqZWN0Py5pY29uXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW5rOiAoKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3Q6IF9yZWZlcmVuY2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0SWNvbiA9IGZpZWxkLmRlZmF1bHRJY29uXHJcblxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwic2VsZWN0XCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImN1cnJlbmN5XCJcclxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XHJcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcclxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxyXG5cdFx0XHRlbHNlIGlmIGZpZWxkPy5zY2FsZSAhPSAwXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSAyXHJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm51bWJlclwiXHJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxyXG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXHJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImJvb2xlYW5cIlxyXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxyXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidG9nZ2xlXCJcclxuXHRcdFx0ZnMudHlwZSA9IEJvb2xlYW5cclxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLXRvZ2dsZVwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJyZWZlcmVuY2VcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJjaGVja2JveFwiXHJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZVwiIGFuZCBmaWVsZC5jb2xsZWN0aW9uXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogZmllbGQuY29sbGVjdGlvblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gZmllbGQuY29sbGVjdGlvblxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZXNpemVcIlxyXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJPYmplY3RcIiB8fCBmaWVsZC50eXBlID09IFwib2JqZWN0XCJcclxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZ3JpZFwiXHJcblx0XHRcdGZzLnR5cGUgPSBBcnJheVxyXG5cdFx0XHRmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIlxyXG5cclxuXHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHR0eXBlOiBPYmplY3RcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImltYWdlXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnaW1hZ2VzJ1xyXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF2YXRhclwiXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cclxuXHRcdFx0XHRcdGF1dG9mb3JtOlxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F2YXRhcnMnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF1ZGlvXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXVkaW9zJ1xyXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdhdWRpby8qJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInZpZGVvXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAndmlkZW9zJ1xyXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICd2aWRlby8qJ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcydcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAndmlkZW8vKidcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImxvY2F0aW9uXCJcclxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJsb2NhdGlvblwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCJcclxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJtYXJrZG93blwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1tYXJrZG93blwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3VybCdcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHQjIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LlVybFxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2VtYWlsJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRlbHNlXHJcblx0XHRcdGZzLnR5cGUgPSBmaWVsZC50eXBlXHJcblxyXG5cdFx0aWYgZmllbGQubGFiZWxcclxuXHRcdFx0ZnMubGFiZWwgPSBmaWVsZC5sYWJlbFxyXG5cclxuI1x0XHRpZiBmaWVsZC5hbGxvd2VkVmFsdWVzXHJcbiNcdFx0XHRmcy5hbGxvd2VkVmFsdWVzID0gZmllbGQuYWxsb3dlZFZhbHVlc1xyXG5cclxuXHRcdGlmICFmaWVsZC5yZXF1aXJlZFxyXG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcclxuXHJcblx0XHQjIFvnrb7nuqblr7nosaHlkIzml7bphY3nva7kuoZjb21wYW55X2lkc+W/heWhq+WPinVuZWRpdGFibGVfZmllbGRz6YCg5oiQ6YOo5YiG55So5oi35paw5bu6562+57qm5a+56LGh5pe25oql6ZSZICMxOTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9zdGVlZG9zL3N0ZWVkb3MtcHJvamVjdC1kenVnL2lzc3Vlcy8xOTIpXHJcblx0XHQjIOWQjuWPsOWni+e7iOiuvue9rnJlcXVpcmVk5Li6ZmFsc2VcclxuXHRcdGlmICFNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQudW5pcXVlXHJcblx0XHRcdGZzLnVuaXF1ZSA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC5vbWl0XHJcblx0XHRcdGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuZ3JvdXBcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cFxyXG5cclxuXHRcdGlmIGZpZWxkLmlzX3dpZGVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC5oaWRkZW5cclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCJcclxuXHJcblx0XHRpZiAoZmllbGQudHlwZSA9PSBcInNlbGVjdFwiKSBvciAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBvciAoZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcclxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLmZpbHRlcmFibGUpID09ICd1bmRlZmluZWQnXHJcblx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcclxuXHRcdGlmIGZpZWxkLm5hbWUgPT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWVcclxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLnNlYXJjaGFibGUpID09ICd1bmRlZmluZWQnXHJcblx0XHRcdFx0ZmllbGQuc2VhcmNoYWJsZSA9IHRydWVcclxuXHJcblx0XHRpZiBhdXRvZm9ybV90eXBlXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlXHJcblxyXG5cdFx0aWYgZmllbGQuZGVmYXVsdFZhbHVlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9ICgpLT5cclxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHt1c2VySWQ6IE1ldGVvci51c2VySWQoKSwgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cdFx0XHRcdGlmICFfLmlzRnVuY3Rpb24oZmllbGQuZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0ZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXHJcblxyXG5cdFx0aWYgZmllbGQucmVhZG9ubHlcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuZGlzYWJsZWRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXHJcblxyXG5cdFx0aWYgZmllbGQuaW5saW5lSGVscFRleHRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dFxyXG5cclxuXHRcdGlmIGZpZWxkLmJsYWNrYm94XHJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxyXG5cclxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWluJylcclxuXHRcdFx0ZnMubWluID0gZmllbGQubWluXHJcblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21heCcpXHJcblx0XHRcdGZzLm1heCA9IGZpZWxkLm1heFxyXG5cclxuXHRcdCMg5Y+q5pyJ55Sf5Lqn546v5aKD5omN6YeN5bu657Si5byVXHJcblx0XHRpZiBNZXRlb3IuaXNQcm9kdWN0aW9uXHJcblx0XHRcdGlmIGZpZWxkLmluZGV4XHJcblx0XHRcdFx0ZnMuaW5kZXggPSBmaWVsZC5pbmRleFxyXG5cdFx0XHRlbHNlIGlmIGZpZWxkLnNvcnRhYmxlXHJcblx0XHRcdFx0ZnMuaW5kZXggPSB0cnVlXHJcblxyXG5cdFx0c2NoZW1hW2ZpZWxkX25hbWVdID0gZnNcclxuXHJcblx0cmV0dXJuIHNjaGVtYVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKS0+XHJcblx0aHRtbCA9IGZpZWxkX3ZhbHVlXHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0aWYgIW9iamVjdFxyXG5cdFx0cmV0dXJuIFwiXCJcclxuXHRmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSlcclxuXHRpZiAhZmllbGRcclxuXHRcdHJldHVybiBcIlwiXHJcblxyXG5cdGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpXHJcblx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXHJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxyXG5cclxuXHRyZXR1cm4gaHRtbFxyXG5cclxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSAoZmllbGRfdHlwZSktPlxyXG5cdHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cclxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSAoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyktPlxyXG5cdGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXHJcblx0aWYgYnVpbHRpblZhbHVlc1xyXG5cdFx0Xy5mb3JFYWNoIGJ1aWx0aW5WYWx1ZXMsIChidWlsdGluSXRlbSwga2V5KS0+XHJcblx0XHRcdG9wZXJhdGlvbnMucHVzaCh7bGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLCB2YWx1ZToga2V5fSlcclxuXHJcbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSAoZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSktPlxyXG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XHJcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSlcclxuXHJcbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XHJcblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcclxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpXHJcblxyXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUsIHZhbHVlKS0+XHJcblx0IyDmoLnmja7ov4fmu6TlmajnmoTov4fmu6TlgLzvvIzojrflj5blr7nlupTnmoTlhoXnva7ov5DnrpfnrKZcclxuXHQjIOavlOWmgnZhbHVl5Li6bGFzdF95ZWFy77yM6L+U5ZueYmV0d2Vlbl90aW1lX2xhc3RfeWVhclxyXG5cdHVubGVzcyBfLmlzU3RyaW5nKHZhbHVlKVxyXG5cdFx0cmV0dXJuXHJcblx0YmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXHJcblx0dW5sZXNzIGJldHdlZW5CdWlsdGluVmFsdWVzXHJcblx0XHRyZXR1cm5cclxuXHRyZXN1bHQgPSBudWxsXHJcblx0Xy5lYWNoIGJldHdlZW5CdWlsdGluVmFsdWVzLCAoaXRlbSwgb3BlcmF0aW9uKS0+XHJcblx0XHRpZiBpdGVtLmtleSA9PSB2YWx1ZVxyXG5cdFx0XHRyZXN1bHQgPSBvcGVyYXRpb25cclxuXHRyZXR1cm4gcmVzdWx0XHJcblxyXG4jIOWmguaenOWPquaYr+S4uuWIpOaWrW9wZXJhdGlvbuaYr+WQpuWtmOWcqO+8jOWImeayoeW/heimgeiuoeeul3ZhbHVlc++8jOS8oOWFpWlzX2NoZWNrX29ubHnkuLp0cnVl5Y2z5Y+vXHJcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpLT5cclxuXHQjIOi/h+a7pOWZqOaXtumXtOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxyXG5cdHJldHVybiB7XHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcclxuXHR9XHJcblxyXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gKG1vbnRoKS0+XHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdGlmIG1vbnRoIDwgM1xyXG5cdFx0cmV0dXJuIDBcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0cmV0dXJuIDNcclxuXHRlbHNlIGlmIG1vbnRoIDwgOVxyXG5cdFx0cmV0dXJuIDZcclxuXHRcclxuXHRyZXR1cm4gOVxyXG5cclxuXHJcbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0aWYgbW9udGggPCAzXHJcblx0XHR5ZWFyLS1cclxuXHRcdG1vbnRoID0gOVxyXG5cdGVsc2UgaWYgbW9udGggPCA2XHJcblx0XHRtb250aCA9IDBcclxuXHRlbHNlIGlmIG1vbnRoIDwgOVxyXG5cdFx0bW9udGggPSAzXHJcblx0ZWxzZSBcclxuXHRcdG1vbnRoID0gNlxyXG5cdFxyXG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHRcclxuXHJcbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0aWYgbW9udGggPCAzXHJcblx0XHRtb250aCA9IDNcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0bW9udGggPSA2XHJcblx0ZWxzZSBpZiBtb250aCA8IDlcclxuXHRcdG1vbnRoID0gOVxyXG5cdGVsc2VcclxuXHRcdHllYXIrK1xyXG5cdFx0bW9udGggPSAwXHJcblx0XHJcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cclxuQ3JlYXRvci5nZXRNb250aERheXMgPSAoeWVhcixtb250aCktPlxyXG5cdGlmIG1vbnRoID09IDExXHJcblx0XHRyZXR1cm4gMzFcclxuXHRcclxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcclxuXHRzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHRlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgrMSwgMSlcclxuXHRkYXlzID0gKGVuZERhdGUtc3RhcnREYXRlKS9taWxsaXNlY29uZFxyXG5cdHJldHVybiBkYXlzXHJcblxyXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gKHllYXIsIG1vbnRoKS0+XHJcblx0aWYgIXllYXJcclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcclxuXHRpZiAhbW9udGhcclxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXHJcblx0XHJcblx0IyDmnIjku73kuLow5Luj6KGo5pys5bm055qE56ys5LiA5pyIXHJcblx0aWYgbW9udGggPT0gMFxyXG5cdFx0bW9udGggPSAxMVxyXG5cdFx0eWVhci0tXHJcblx0XHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcblx0IyDlkKbliJks5Y+q5YeP5Y675pyI5Lu9XHJcblx0bW9udGgtLTtcclxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxyXG5cdCMg6L+H5ruk5ZmoYmV0d2Vlbui/kOeul+espu+8jOeOsOeul+aXpeacny/ml6XmnJ/ml7bpl7TnsbvlnovlrZfmrrXnmoR2YWx1ZXPlgLxcclxuXHRub3cgPSBuZXcgRGF0ZSgpXHJcblx0IyDkuIDlpKnnmoTmr6vnp5LmlbBcclxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcclxuXHR5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxyXG5cdHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiA5ZGo5Lit55qE5p+Q5LiA5aSpXHJcblx0d2VlayA9IG5vdy5nZXREYXkoKVxyXG5cdCMg5YeP5Y6755qE5aSp5pWwXHJcblx0bWludXNEYXkgPSBpZiB3ZWVrICE9IDAgdGhlbiB3ZWVrIC0gMSBlbHNlIDZcclxuXHRtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKVxyXG5cdHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOS4iuWRqOaXpVxyXG5cdGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDkuIrlkajkuIBcclxuXHRsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSlcclxuXHQjIOS4i+WRqOS4gFxyXG5cdG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXHJcblx0IyDkuIvlkajml6VcclxuXHRuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSlcclxuXHRjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcblx0cHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxXHJcblx0bmV4dFllYXIgPSBjdXJyZW50WWVhciArIDFcclxuXHQjIOW9k+WJjeaciOS7vVxyXG5cdGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpXHJcblx0IyDorqHmlbDlubTjgIHmnIhcclxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcclxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpXHJcblx0IyDmnKzmnIjnrKzkuIDlpKlcclxuXHRmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aCwxKVxyXG5cclxuXHQjIOW9k+S4ujEy5pyI55qE5pe25YCZ5bm05Lu96ZyA6KaB5YqgMVxyXG5cdCMg5pyI5Lu96ZyA6KaB5pu05paw5Li6MCDkuZ/lsLHmmK/kuIvkuIDlubTnmoTnrKzkuIDkuKrmnIhcclxuXHRpZiBjdXJyZW50TW9udGggPT0gMTFcclxuXHRcdHllYXIrK1xyXG5cdFx0bW9udGgrK1xyXG5cdGVsc2VcclxuXHRcdG1vbnRoKytcclxuXHRcclxuXHQjIOS4i+aciOesrOS4gOWkqVxyXG5cdG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0IyDkuIvmnIjmnIDlkI7kuIDlpKlcclxuXHRuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsbW9udGgsQ3JlYXRvci5nZXRNb250aERheXMoeWVhcixtb250aCkpXHJcblx0IyDmnKzmnIjmnIDlkI7kuIDlpKlcclxuXHRsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDkuIrmnIjnrKzkuIDlpKlcclxuXHRsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxyXG5cdCMg5LiK5pyI5pyA5ZCO5LiA5aSpXHJcblx0bGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcclxuXHQjIOacrOWto+W6puW8gOWni+aXpVxyXG5cdHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksMSlcclxuXHQjIOacrOWto+W6pue7k+adn+aXpVxyXG5cdHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIsQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIpKVxyXG5cdCMg5LiK5a2j5bqm5byA5aeL5pelXHJcblx0bGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXHJcblx0IyDkuIrlraPluqbnu5PmnZ/ml6VcclxuXHRsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxyXG5cdCMg5LiL5a2j5bqm5byA5aeL5pelXHJcblx0bmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXHJcblx0IyDkuIvlraPluqbnu5PmnZ/ml6VcclxuXHRuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxyXG5cdCMg6L+H5Y67N+WkqSBcclxuXHRsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzMw5aSpXHJcblx0bGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzYw5aSpXHJcblx0bGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzkw5aSpXHJcblx0bGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOi/h+WOuzEyMOWkqVxyXG5cdGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSlcclxuXHQjIOacquadpTflpKkgXHJcblx0bmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaUzMOWkqVxyXG5cdG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU2MOWkqVxyXG5cdG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU5MOWkqVxyXG5cdG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaUxMjDlpKlcclxuXHRuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpXHJcblxyXG5cdHN3aXRjaCBrZXlcclxuXHRcdHdoZW4gXCJsYXN0X3llYXJcIlxyXG5cdFx0XHQj5Y675bm0XHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc195ZWFyXCJcclxuXHRcdFx0I+S7iuW5tFxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje2N1cnJlbnRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X3llYXJcIlxyXG5cdFx0XHQj5piO5bm0XHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfcXVhcnRlclwiXHJcblx0XHRcdCPkuIrlraPluqZcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc19xdWFydGVyXCJcclxuXHRcdFx0I+acrOWto+W6plxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X3F1YXJ0ZXJcIlxyXG5cdFx0XHQj5LiL5a2j5bqmXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfbW9udGhcIlxyXG5cdFx0XHQj5LiK5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidGhpc19tb250aFwiXHJcblx0XHRcdCPmnKzmnIhcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfbW9udGhcIlxyXG5cdFx0XHQj5LiL5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF93ZWVrXCJcclxuXHRcdFx0I+S4iuWRqFxyXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfd2Vla1wiXHJcblx0XHRcdCPmnKzlkahcclxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF93ZWVrXCJcclxuXHRcdFx0I+S4i+WRqFxyXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInllc3RkYXlcIlxyXG5cdFx0XHQj5pio5aSpXHJcblx0XHRcdHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRvZGF5XCJcclxuXHRcdFx0I+S7iuWkqVxyXG5cdFx0XHRzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ0b21vcnJvd1wiXHJcblx0XHRcdCPmmI7lpKlcclxuXHRcdFx0c3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzdfZGF5c1wiXHJcblx0XHRcdCPov4fljrs35aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIFxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfMzBfZGF5c1wiXHJcblx0XHRcdCPov4fljrszMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF82MF9kYXlzXCJcclxuXHRcdFx0I+i/h+WOuzYw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzkwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67OTDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfMTIwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67MTIw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfN19kYXlzXCJcclxuXHRcdFx0I+acquadpTflpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzMwX2RheXNcIlxyXG5cdFx0XHQj5pyq5p2lMzDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfNjBfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaU2MOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF85MF9kYXlzXCJcclxuXHRcdFx0I+acquadpTkw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzEyMF9kYXlzXCJcclxuXHRcdFx0I+acquadpTEyMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcclxuXHR2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdXHJcblx0aWYgZmllbGRfdHlwZSA9PSBcImRhdGV0aW1lXCJcclxuXHRcdCMg5pe26Ze057G75Z6L5a2X5q6177yM5YaF572u5pe26Ze06IyD5Zu05bqU6K+l6ICD6JmR5YGP56e75pe25Yy65YC877yM5ZCm5YiZ6L+H5ruk5pWw5o2u5a2Y5Zyo5YGP5beuXHJcblx0XHQjIOmdnuWGhee9ruaXtumXtOiMg+WbtOaXtu+8jOeUqOaIt+mAmui/h+aXtumXtOaOp+S7tumAieaLqeeahOiMg+WbtO+8jOS8muiHquWKqOWkhOeQhuaXtuWMuuWBj+W3ruaDheWGtVxyXG5cdFx0IyDml6XmnJ/nsbvlnovlrZfmrrXvvIzmlbDmja7lupPmnKzmnaXlsLHlrZjnmoTmmK9VVEPnmoQw54K577yM5LiN5a2Y5Zyo5YGP5beuXHJcblx0XHRfLmZvckVhY2ggdmFsdWVzLCAoZnYpLT5cclxuXHRcdFx0aWYgZnZcclxuXHRcdFx0XHRmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwIClcclxuXHRcclxuXHRyZXR1cm4ge1xyXG5cdFx0bGFiZWw6IGxhYmVsXHJcblx0XHRrZXk6IGtleVxyXG5cdFx0dmFsdWVzOiB2YWx1ZXNcclxuXHR9XHJcblxyXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKS0+XHJcblx0aWYgZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuICdiZXR3ZWVuJ1xyXG5cdGVsc2UgaWYgW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuICdjb250YWlucydcclxuXHRlbHNlXHJcblx0XHRyZXR1cm4gXCI9XCJcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSkgLT5cclxuXHQjIOaXpeacn+exu+WeizogZGF0ZSwgZGF0ZXRpbWUgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxyXG5cdCMg5paH5pys57G75Z6LOiB0ZXh0LCB0ZXh0YXJlYSwgaHRtbCAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIiwgXCJzdGFydHN3aXRoXCJcclxuXHQjIOmAieaLqeexu+WeizogbG9va3VwLCBtYXN0ZXJfZGV0YWlsLCBzZWxlY3Qg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblx0IyDmlbDlgLznsbvlnos6IGN1cnJlbmN5LCBudW1iZXIgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxyXG5cdCMg5biD5bCU57G75Z6LOiBib29sZWFuICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcclxuXHQjIOaVsOe7hOexu+WeizogY2hlY2tib3gsIFt0ZXh0XSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblxyXG5cdG9wdGlvbmFscyA9IHtcclxuXHRcdGVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksIHZhbHVlOiBcIj1cIn0sXHJcblx0XHR1bmVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSwgdmFsdWU6IFwiPD5cIn0sXHJcblx0XHRsZXNzX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksIHZhbHVlOiBcIjxcIn0sXHJcblx0XHRncmVhdGVyX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksIHZhbHVlOiBcIj5cIn0sXHJcblx0XHRsZXNzX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPD1cIn0sXHJcblx0XHRncmVhdGVyX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPj1cIn0sXHJcblx0XHRjb250YWluczoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLCB2YWx1ZTogXCJjb250YWluc1wifSxcclxuXHRcdG5vdF9jb250YWluOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSwgdmFsdWU6IFwibm90Y29udGFpbnNcIn0sXHJcblx0XHRzdGFydHNfd2l0aDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLCB2YWx1ZTogXCJzdGFydHN3aXRoXCJ9LFxyXG5cdFx0YmV0d2Vlbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksIHZhbHVlOiBcImJldHdlZW5cIn0sXHJcblx0fVxyXG5cclxuXHRpZiBmaWVsZF90eXBlID09IHVuZGVmaW5lZFxyXG5cdFx0cmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscylcclxuXHJcblx0b3BlcmF0aW9ucyA9IFtdXHJcblxyXG5cdGlmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pXHJcblx0XHRDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcInRleHRcIiBvciBmaWVsZF90eXBlID09IFwidGV4dGFyZWFcIiBvciBmaWVsZF90eXBlID09IFwiaHRtbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJjb2RlXCJcclxuI1x0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmNvbnRhaW5zLCBvcHRpb25hbHMubm90X2NvbnRhaW4sIG9wdGlvbmFscy5zdGFydHNfd2l0aClcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwibG9va3VwXCIgb3IgZmllbGRfdHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBvciBmaWVsZF90eXBlID09IFwic2VsZWN0XCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImN1cnJlbmN5XCIgb3IgZmllbGRfdHlwZSA9PSBcIm51bWJlclwiXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImJvb2xlYW5cIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiY2hlY2tib3hcIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXHJcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiW3RleHRdXCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2VcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cclxuXHRyZXR1cm4gb3BlcmF0aW9uc1xyXG5cclxuIyMjXHJcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cclxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcclxuXHRmaWVsZHNBcnIgPSBbXVxyXG5cclxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQpLT5cclxuXHRcdGZpZWxkc0Fyci5wdXNoIHtuYW1lOiBmaWVsZC5uYW1lLCBzb3J0X25vOiBmaWVsZC5zb3J0X25vfVxyXG5cclxuXHRmaWVsZHNOYW1lID0gW11cclxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxyXG5cdFx0ZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpXHJcblx0cmV0dXJuIGZpZWxkc05hbWVcclxuIiwiQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGZpZWxkc0Fyciwgc2NoZW1hO1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICBzY2hlbWEgPSB7fTtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChvYmouZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmICghXy5oYXMoZmllbGQsIFwibmFtZVwiKSkge1xuICAgICAgZmllbGQubmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaChmaWVsZCk7XG4gIH0pO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgdmFyIF9vYmplY3QsIF9yZWZfb2JqLCBfcmVmZXJlbmNlX3RvLCBhdXRvZm9ybV90eXBlLCBmaWVsZF9uYW1lLCBmcywgaXNVbkxpbWl0ZWQsIGxvY2FsZSwgcGVybWlzc2lvbnMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMztcbiAgICBmaWVsZF9uYW1lID0gZmllbGQubmFtZTtcbiAgICBmcyA9IHt9O1xuICAgIGlmIChmaWVsZC5yZWdFeCkge1xuICAgICAgZnMucmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICB9XG4gICAgZnMuYXV0b2Zvcm0gPSB7fTtcbiAgICBmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlO1xuICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICBhdXRvZm9ybV90eXBlID0gKHJlZiA9IGZpZWxkLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dFwiIHx8IGZpZWxkLnR5cGUgPT09IFwicGhvbmVcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiW3RleHRdXCIgfHwgZmllbGQudHlwZSA9PT0gXCJbcGhvbmVdXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdjb2RlJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAxMjtcbiAgICAgIGlmIChmaWVsZC5sYW5ndWFnZSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInBhc3N3b3JkXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBEYXRlO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBEYXRlO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRldGltZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIltPYmplY3RdXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbT2JqZWN0XTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiaHRtbFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICAgICAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIgfHwgbG9jYWxlID09PSBcInpoLUNOXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJlbi1VU1wiO1xuICAgICAgICB9XG4gICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICB0eXBlOiBcInN1bW1lcm5vdGVcIixcbiAgICAgICAgICBcImNsYXNzXCI6ICdzdW1tZXJub3RlLWVkaXRvcicsXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIGhlaWdodDogMjAwLFxuICAgICAgICAgICAgZGlhbG9nc0luQm9keTogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2xiYXI6IFtbJ2ZvbnQxJywgWydzdHlsZSddXSwgWydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLCBbJ2ZvbnQzJywgWydmb250bmFtZSddXSwgWydjb2xvcicsIFsnY29sb3InXV0sIFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLCBbJ3RhYmxlJywgWyd0YWJsZSddXSwgWydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZSddXSwgWyd2aWV3JywgWydjb2RldmlldyddXV0sXG4gICAgICAgICAgICBmb250TmFtZXM6IFsnQXJpYWwnLCAnQ29taWMgU2FucyBNUycsICdDb3VyaWVyIE5ldycsICdIZWx2ZXRpY2EnLCAnSW1wYWN0JywgJ+Wui+S9kycsICfpu5HkvZMnLCAn5b6u6L2v6ZuF6buRJywgJ+S7v+WuiycsICfmpbfkvZMnLCAn6Zq25LmmJywgJ+W5vOWchiddLFxuICAgICAgICAgICAgbGFuZzogbG9jYWxlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb247XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgfVxuICAgICAgaWYgKCFmaWVsZC5oaWRkZW4pIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnM7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlcGVuZE9uID0gZmllbGQuZGVwZW5kX29uO1xuICAgICAgICBpZiAoZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uKSB7XG4gICAgICAgICAgZnMuYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGZzLmZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA/IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA6IENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzO1xuICAgICAgICBpZiAoZmllbGQub3B0aW9uc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8pIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICBpZiAoZmllbGQuY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b107XG4gICAgICAgICAgICAgICAgaWYgKF9yZWZfb2JqICE9IG51bGwgPyAocmVmMSA9IF9yZWZfb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMS5hbGxvd0NyZWF0ZSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24obG9va3VwX2ZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuXCIgKyAoQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bykuX25hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgIGZvcm1JZDogXCJuZXdcIiArIChmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsICdfJykpLFxuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBcIlwiICsgZmllbGQucmVmZXJlbmNlX3RvLFxuICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJpbnNlcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKG9wZXJhdGlvbiwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQub2JqZWN0X25hbWUgPT09IFwib2JqZWN0c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiByZXN1bHQudmFsdWUuaWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0LnZhbHVlLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZVtvYmplY3QuTkFNRV9GSUVMRF9LRVldIHx8IHJlc3VsdC52YWx1ZS5sYWJlbCB8fCByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2Vfc29ydCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc1NvcnQgPSBmaWVsZC5yZWZlcmVuY2Vfc29ydDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9saW1pdCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcInVzZXJzXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdHVzZXJcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gKHJlZjIgPSBvYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYyLmdldCgpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcIm9yZ2FuaXphdGlvbnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYzID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMy5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgICAgICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlO1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dO1xuICAgICAgICAgICAgaWYgKF9vYmplY3QgJiYgX29iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjtcbiAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW107XG4gICAgICAgICAgICAgICAgX3JlZmVyZW5jZV90by5mb3JFYWNoKGZ1bmN0aW9uKF9yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV07XG4gICAgICAgICAgICAgICAgICBpZiAoX29iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QubGFiZWwgOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgaWNvbjogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2U7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgICBmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRvZ2dsZVwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInJlZmVyZW5jZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIjtcbiAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlXCIgJiYgZmllbGQuY29sbGVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBmaWVsZC5jb2xsZWN0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGZpZWxkLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVzaXplXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZ3JpZFwiKSB7XG4gICAgICBmcy50eXBlID0gQXJyYXk7XG4gICAgICBmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWU7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiO1xuICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2ltYWdlcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdmF0YXJcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXZhdGFycycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXVkaW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2F1ZGlvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInZpZGVvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ3ZpZGVvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICd2aWRlby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb2NhdGlvblwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIjtcbiAgICAgIGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCI7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLW1hcmtkb3duXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAndXJsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZW1haWwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWw7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZzLnR5cGUgPSBmaWVsZC50eXBlO1xuICAgIH1cbiAgICBpZiAoZmllbGQubGFiZWwpIHtcbiAgICAgIGZzLmxhYmVsID0gZmllbGQubGFiZWw7XG4gICAgfVxuICAgIGlmICghZmllbGQucmVxdWlyZWQpIHtcbiAgICAgIGZzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLnVuaXF1ZSkge1xuICAgICAgZnMudW5pcXVlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLm9taXQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZ3JvdXApIHtcbiAgICAgIGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXA7XG4gICAgfVxuICAgIGlmIChmaWVsZC5pc193aWRlKSB7XG4gICAgICBmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmhpZGRlbikge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgfVxuICAgIGlmICgoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpIHx8IChmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuZmlsdGVyYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5uYW1lID09PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5zZWFyY2hhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF1dG9mb3JtX3R5cGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGVmYXVsdFZhbHVlKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge1xuICAgICAgICAgICAgdXNlcklkOiBNZXRlb3IudXNlcklkKCksXG4gICAgICAgICAgICBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24oZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICAgIGZzLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgIGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRpc2FibGVkKSB7XG4gICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5pbmxpbmVIZWxwVGV4dCkge1xuICAgICAgZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmJsYWNrYm94KSB7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChfLmhhcyhmaWVsZCwgJ21pbicpKSB7XG4gICAgICBmcy5taW4gPSBmaWVsZC5taW47XG4gICAgfVxuICAgIGlmIChfLmhhcyhmaWVsZCwgJ21heCcpKSB7XG4gICAgICBmcy5tYXggPSBmaWVsZC5tYXg7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNQcm9kdWN0aW9uKSB7XG4gICAgICBpZiAoZmllbGQuaW5kZXgpIHtcbiAgICAgICAgZnMuaW5kZXggPSBmaWVsZC5pbmRleDtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGQuc29ydGFibGUpIHtcbiAgICAgICAgZnMuaW5kZXggPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2NoZW1hW2ZpZWxkX25hbWVdID0gZnM7XG4gIH0pO1xuICByZXR1cm4gc2NoZW1hO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERpc3BsYXlWYWx1ZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSkge1xuICB2YXIgZmllbGQsIGh0bWwsIG9iamVjdDtcbiAgaHRtbCA9IGZpZWxkX3ZhbHVlO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpO1xuICBpZiAoIWZpZWxkKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCBIOm1tJyk7XG4gIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgfVxuICByZXR1cm4gaHRtbDtcbn07XG5cbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICByZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSk7XG59O1xuXG5DcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpIHtcbiAgdmFyIGJ1aWx0aW5WYWx1ZXM7XG4gIGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoYnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybiBfLmZvckVhY2goYnVpbHRpblZhbHVlcywgZnVuY3Rpb24oYnVpbHRpbkl0ZW0sIGtleSkge1xuICAgICAgcmV0dXJuIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBidWlsdGluSXRlbS5sYWJlbCxcbiAgICAgICAgdmFsdWU6IGtleVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBpc19jaGVja19vbmx5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgdmFsdWUpIHtcbiAgdmFyIGJldHdlZW5CdWlsdGluVmFsdWVzLCByZXN1bHQ7XG4gIGlmICghXy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoIWJldHdlZW5CdWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlc3VsdCA9IG51bGw7XG4gIF8uZWFjaChiZXR3ZWVuQnVpbHRpblZhbHVlcywgZnVuY3Rpb24oaXRlbSwgb3BlcmF0aW9uKSB7XG4gICAgaWYgKGl0ZW0ua2V5ID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdCA9IG9wZXJhdGlvbjtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKSB7XG4gIHJldHVybiB7XG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc195ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc193ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b2RheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9kYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzEyMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gZnVuY3Rpb24obW9udGgpIHtcbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICByZXR1cm4gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICByZXR1cm4gNjtcbiAgfVxuICByZXR1cm4gOTtcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICB5ZWFyLS07XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSB7XG4gICAgbW9udGggPSA2O1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gNjtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoID0gMDtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRNb250aERheXMgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICB2YXIgZGF5cywgZW5kRGF0ZSwgbWlsbGlzZWNvbmQsIHN0YXJ0RGF0ZTtcbiAgaWYgKG1vbnRoID09PSAxMSkge1xuICAgIHJldHVybiAzMTtcbiAgfVxuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMSk7XG4gIGRheXMgPSAoZW5kRGF0ZSAtIHN0YXJ0RGF0ZSkgLyBtaWxsaXNlY29uZDtcbiAgcmV0dXJuIGRheXM7XG59O1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoID09PSAwKSB7XG4gICAgbW9udGggPSAxMTtcbiAgICB5ZWFyLS07XG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgfVxuICBtb250aC0tO1xuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgdmFyIGN1cnJlbnRNb250aCwgY3VycmVudFllYXIsIGVuZFZhbHVlLCBmaXJzdERheSwgbGFiZWwsIGxhc3REYXksIGxhc3RNb25kYXksIGxhc3RNb250aEZpbmFsRGF5LCBsYXN0TW9udGhGaXJzdERheSwgbGFzdFF1YXJ0ZXJFbmREYXksIGxhc3RRdWFydGVyU3RhcnREYXksIGxhc3RTdW5kYXksIGxhc3RfMTIwX2RheXMsIGxhc3RfMzBfZGF5cywgbGFzdF82MF9kYXlzLCBsYXN0XzdfZGF5cywgbGFzdF85MF9kYXlzLCBtaWxsaXNlY29uZCwgbWludXNEYXksIG1vbmRheSwgbW9udGgsIG5leHRNb25kYXksIG5leHRNb250aEZpbmFsRGF5LCBuZXh0TW9udGhGaXJzdERheSwgbmV4dFF1YXJ0ZXJFbmREYXksIG5leHRRdWFydGVyU3RhcnREYXksIG5leHRTdW5kYXksIG5leHRZZWFyLCBuZXh0XzEyMF9kYXlzLCBuZXh0XzMwX2RheXMsIG5leHRfNjBfZGF5cywgbmV4dF83X2RheXMsIG5leHRfOTBfZGF5cywgbm93LCBwcmV2aW91c1llYXIsIHN0YXJ0VmFsdWUsIHN0ckVuZERheSwgc3RyRmlyc3REYXksIHN0ckxhc3REYXksIHN0ck1vbmRheSwgc3RyU3RhcnREYXksIHN0clN1bmRheSwgc3RyVG9kYXksIHN0clRvbW9ycm93LCBzdHJZZXN0ZGF5LCBzdW5kYXksIHRoaXNRdWFydGVyRW5kRGF5LCB0aGlzUXVhcnRlclN0YXJ0RGF5LCB0b21vcnJvdywgdmFsdWVzLCB3ZWVrLCB5ZWFyLCB5ZXN0ZGF5O1xuICBub3cgPSBuZXcgRGF0ZSgpO1xuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHllc3RkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIHdlZWsgPSBub3cuZ2V0RGF5KCk7XG4gIG1pbnVzRGF5ID0gd2VlayAhPT0gMCA/IHdlZWsgLSAxIDogNjtcbiAgbW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICBuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIGN1cnJlbnRZZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMTtcbiAgbmV4dFllYXIgPSBjdXJyZW50WWVhciArIDE7XG4gIGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpO1xuICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIG1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIGZpcnN0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgMSk7XG4gIGlmIChjdXJyZW50TW9udGggPT09IDExKSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoKys7XG4gIH0gZWxzZSB7XG4gICAgbW9udGgrKztcbiAgfVxuICBuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgbmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgQ3JlYXRvci5nZXRNb250aERheXMoeWVhciwgbW9udGgpKTtcbiAgbGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdGhpc1F1YXJ0ZXJTdGFydERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksIDEpO1xuICB0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMikpO1xuICBsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN3aXRjaCAoa2V5KSB7XG4gICAgY2FzZSBcImxhc3RfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChmaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChsYXN0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc193ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwieWVzdGRheVwiOlxuICAgICAgc3RyWWVzdGRheSA9IG1vbWVudCh5ZXN0ZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvZGF5XCI6XG4gICAgICBzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b2RheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9tb3Jyb3dcIjpcbiAgICAgIHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICB9XG4gIHZhbHVlcyA9IFtzdGFydFZhbHVlLCBlbmRWYWx1ZV07XG4gIGlmIChmaWVsZF90eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBfLmZvckVhY2godmFsdWVzLCBmdW5jdGlvbihmdikge1xuICAgICAgaWYgKGZ2KSB7XG4gICAgICAgIHJldHVybiBmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGxhYmVsOiBsYWJlbCxcbiAgICBrZXk6IGtleSxcbiAgICB2YWx1ZXM6IHZhbHVlc1xuICB9O1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIGlmIChmaWVsZF90eXBlICYmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdiZXR3ZWVuJztcbiAgfSBlbHNlIGlmIChbXCJ0ZXh0YXJlYVwiLCBcInRleHRcIiwgXCJjb2RlXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdjb250YWlucyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiPVwiO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICB2YXIgb3BlcmF0aW9ucywgb3B0aW9uYWxzO1xuICBvcHRpb25hbHMgPSB7XG4gICAgZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPVwiXG4gICAgfSxcbiAgICB1bmVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl91bmVxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD5cIlxuICAgIH0sXG4gICAgbGVzc190aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI8XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPlwiXG4gICAgfSxcbiAgICBsZXNzX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD1cIlxuICAgIH0sXG4gICAgZ3JlYXRlcl9vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj49XCJcbiAgICB9LFxuICAgIGNvbnRhaW5zOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSxcbiAgICAgIHZhbHVlOiBcImNvbnRhaW5zXCJcbiAgICB9LFxuICAgIG5vdF9jb250YWluOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9kb2VzX25vdF9jb250YWluXCIpLFxuICAgICAgdmFsdWU6IFwibm90Y29udGFpbnNcIlxuICAgIH0sXG4gICAgc3RhcnRzX3dpdGg6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLFxuICAgICAgdmFsdWU6IFwic3RhcnRzd2l0aFwiXG4gICAgfSxcbiAgICBiZXR3ZWVuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLFxuICAgICAgdmFsdWU6IFwiYmV0d2VlblwiXG4gICAgfVxuICB9O1xuICBpZiAoZmllbGRfdHlwZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscyk7XG4gIH1cbiAgb3BlcmF0aW9ucyA9IFtdO1xuICBpZiAoQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pO1xuICAgIENyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwidGV4dFwiIHx8IGZpZWxkX3R5cGUgPT09IFwidGV4dGFyZWFcIiB8fCBmaWVsZF90eXBlID09PSBcImh0bWxcIiB8fCBmaWVsZF90eXBlID09PSBcImNvZGVcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImN1cnJlbmN5XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMubGVzc190aGFuLCBvcHRpb25hbHMuZ3JlYXRlcl90aGFuLCBvcHRpb25hbHMubGVzc19vcl9lcXVhbCwgb3B0aW9uYWxzLmdyZWF0ZXJfb3JfZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcIlt0ZXh0XVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2Uge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfVxuICByZXR1cm4gb3BlcmF0aW9ucztcbn07XG5cblxuLypcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZmllbGRzLCBmaWVsZHNBcnIsIGZpZWxkc05hbWUsIHJlZjtcbiAgZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDA7XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaCh7XG4gICAgICBuYW1lOiBmaWVsZC5uYW1lLFxuICAgICAgc29ydF9ubzogZmllbGQuc29ydF9ub1xuICAgIH0pO1xuICB9KTtcbiAgZmllbGRzTmFtZSA9IFtdO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBmaWVsZHNOYW1lO1xufTtcbiIsIkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fVxyXG5cclxuaW5pdFRyaWdnZXIgPSAob2JqZWN0X25hbWUsIHRyaWdnZXIpLT5cclxuXHR0cnlcclxuXHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXHJcblx0XHRpZiAhdHJpZ2dlci50b2RvXHJcblx0XHRcdHJldHVyblxyXG5cdFx0dG9kb1dyYXBwZXIgPSAoKS0+XHJcblx0XHRcdCAgdGhpcy5vYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lXHJcblx0XHRcdCAgcmV0dXJuIHRyaWdnZXIudG9kby5hcHBseSh0aGlzLCBhcmd1bWVudHMpXHJcblx0XHRpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUuaW5zZXJ0XCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy5pbnNlcnQodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLnVwZGF0ZVwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8udXBkYXRlKHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS5yZW1vdmVcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnJlbW92ZSh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5pbnNlcnRcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnVwZGF0ZVwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy51cGRhdGUodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIucmVtb3ZlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/LnJlbW92ZSh0b2RvV3JhcHBlcilcclxuXHRjYXRjaCBlcnJvclxyXG5cdFx0Y29uc29sZS5lcnJvcignaW5pdFRyaWdnZXIgZXJyb3InLCBlcnJvcilcclxuXHJcbmNsZWFuVHJpZ2dlciA9IChvYmplY3RfbmFtZSktPlxyXG5cdCMjI1xyXG4gICAgXHTnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWw5piv5L2/55So5LiL5qCH5Yig6Zmk5a+56LGh55qE77yM5omA5Lul5q2k5aSE5Y+N6L2saG9va3Ppm4blkIjlkI7vvIzlho3liKDpmaRcclxuICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXHJcblx0IyMjXHJcbiAgICAjVE9ETyDnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWwYnVnXHJcblx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0/LnJldmVyc2UoKS5mb3JFYWNoIChfaG9vayktPlxyXG5cdFx0X2hvb2sucmVtb3ZlKClcclxuXHJcbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gKG9iamVjdF9uYW1lKS0+XHJcbiNcdGNvbnNvbGUubG9nKCdDcmVhdG9yLmluaXRUcmlnZ2VycyBvYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKVxyXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cclxuXHRjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpXHJcblxyXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW11cclxuXHJcblx0Xy5lYWNoIG9iai50cmlnZ2VycywgKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSktPlxyXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyIGFuZCB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXHJcblx0XHRcdF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlciBvYmplY3RfbmFtZSwgdHJpZ2dlclxyXG5cdFx0XHRpZiBfdHJpZ2dlcl9ob29rXHJcblx0XHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXHJcblx0XHRcdF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlciBvYmplY3RfbmFtZSwgdHJpZ2dlclxyXG5cdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spIiwidmFyIGNsZWFuVHJpZ2dlciwgaW5pdFRyaWdnZXI7XG5cbkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fTtcblxuaW5pdFRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdHJpZ2dlcikge1xuICB2YXIgY29sbGVjdGlvbiwgZXJyb3IsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgdG9kb1dyYXBwZXI7XG4gIHRyeSB7XG4gICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgaWYgKCF0cmlnZ2VyLnRvZG8pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdG9kb1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZTtcbiAgICAgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmLmluc2VydCh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjEgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjEudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmMi5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjMgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmMy5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjQgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNC51cGRhdGUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjUgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNS5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpO1xuICB9XG59O1xuXG5jbGVhblRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuXG4gIC8qXG4gICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXG4gICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG4gICAqL1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uKF9ob29rKSB7XG4gICAgcmV0dXJuIF9ob29rLnJlbW92ZSgpO1xuICB9KSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIG9iajtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdO1xuICByZXR1cm4gXy5lYWNoKG9iai50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwgdHJpZ2dlcl9uYW1lKSB7XG4gICAgdmFyIF90cmlnZ2VyX2hvb2s7XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICBpZiAoX3RyaWdnZXJfaG9vaykge1xuICAgICAgICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIHJldHVybiBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpXHJcblxyXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdFx0aWYgIW9ialxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KClcclxuXHRlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cclxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSwgcmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpLT5cclxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdGlmICFzcGFjZUlkIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcclxuXHRpZiByZWNvcmQgYW5kIG9iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCIgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0IyDlpoLmnpzmmK9jbXNfZmlsZXPpmYTku7bvvIzliJnmnYPpmZDlj5blhbbniLborrDlvZXmnYPpmZBcclxuXHRcdGlmIG9iamVjdF9uYW1lID09IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpXHJcblx0XHRcdCMg5b2T5YmN5aSE5LqOY21zX2ZpbGVz6ZmE5Lu26K+m57uG55WM6Z2iXHJcblx0XHRcdG9iamVjdF9uYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XHJcblx0XHRcdHJlY29yZF9pZCA9IHJlY29yZC5wYXJlbnQuX2lkO1xyXG5cdFx0ZWxzZSBcclxuXHRcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bnmoTniLborrDlvZXnlYzpnaJcclxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKTtcclxuXHRcdFx0cmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XHJcblx0XHRvYmplY3RfZmllbGRzX2tleXMgPSBfLmtleXMoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpPy5maWVsZHMgb3Ige30pIHx8IFtdO1xyXG5cdFx0c2VsZWN0ID0gXy5pbnRlcnNlY3Rpb24ob2JqZWN0X2ZpZWxkc19rZXlzLCBbJ293bmVyJywgJ2NvbXBhbnlfaWQnLCAnY29tcGFueV9pZHMnLCAnbG9ja2VkJ10pIHx8IFtdO1xyXG5cdFx0aWYgc2VsZWN0Lmxlbmd0aCA+IDBcclxuXHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0LmpvaW4oJywnKSk7XHJcblx0XHRlbHNlXHJcblx0XHRcdHJlY29yZCA9IG51bGw7XHJcblxyXG5cdHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKVxyXG5cclxuXHRpZiByZWNvcmRcclxuXHRcdGlmIHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnNcclxuXHRcdFx0cmV0dXJuIHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnNcclxuXHJcblx0XHRpc093bmVyID0gcmVjb3JkLm93bmVyID09IHVzZXJJZCB8fCByZWNvcmQub3duZXI/Ll9pZCA9PSB1c2VySWRcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpXHJcblx0XHRlbHNlXHJcblx0XHRcdHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZClcclxuXHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkPy5jb21wYW55X2lkXHJcblx0XHRpZiByZWNvcmRfY29tcGFueV9pZCBhbmQgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgYW5kIHJlY29yZF9jb21wYW55X2lkLl9pZFxyXG5cdFx0XHQjIOWboHJlY29yZF9jb21wYW55X2lk5pivbG9va3Vw57G75Z6L77yM5pyJ5Y+v6IO9ZHjmjqfku7bkvJrmiorlroPmmKDlsITovazkuLrlr7nlupTnmoRvYmplY3TvvIzmiYDku6Xov5nph4zlj5blh7rlhbZfaWTlgLxcclxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWRcclxuXHRcdHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZD8uY29tcGFueV9pZHNcclxuXHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCBhbmQgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZHNbMF0pXHJcblx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWRz5pivbG9va3Vw57G75Z6L77yM5pyJ5Y+v6IO9ZHjmjqfku7bkvJrmiorlroPmmKDlsITovazkuLrlr7nlupTnmoRbb2JqZWN0Xe+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxyXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmRfY29tcGFueV9pZHMubWFwKChuKS0+IG4uX2lkKVxyXG5cdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gXy51bmlvbihyZWNvcmRfY29tcGFueV9pZHMsIFtyZWNvcmRfY29tcGFueV9pZF0pXHJcblx0XHRpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGhcclxuXHRcdFx0XHRpZiB1c2VyX2NvbXBhbnlfaWRzIGFuZCB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aFxyXG5cdFx0XHRcdFx0aWYgIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoXHJcblx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPkv67mlLlcclxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMg6K6w5b2V5pyJY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp++8jOS9huaYr+W9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPkuLrnqbrml7bvvIzorqTkuLrml6DmnYPkv67mlLlcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblx0XHRcclxuXHRcdGlmIHJlY29yZC5sb2NrZWQgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcclxuXHJcblx0XHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXHJcblx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxyXG5cdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXHJcblx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcclxuXHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+afpeeci1xyXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMg6K6w5b2V5pyJY29tcGFueV9pZOWxnuaAp++8jOS9huaYr+W9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPkuLrnqbrml7bvvIzorqTkuLrml6DmnYPmn6XnnItcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXHJcblxyXG5cdHJldHVybiBwZXJtaXNzaW9uc1xyXG5cclxuXHJcbiMgY3VycmVudE9iamVjdE5hbWXvvJrlvZPliY3kuLvlr7nosaFcclxuIyByZWxhdGVkTGlzdEl0ZW3vvJpDcmVhdG9yLmdldFJlbGF0ZWRMaXN0KFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIiksIFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpKeS4reWPlnJlbGF0ZWRfb2JqZWN0X25hbWXlr7nlupTnmoTlgLxcclxuIyBjdXJyZW50UmVjb3Jk5b2T5YmN5Li75a+56LGh55qE6K+m57uG6K6w5b2VXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyA9IChjdXJyZW50T2JqZWN0TmFtZSwgcmVsYXRlZExpc3RJdGVtLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpLT5cclxuXHRcdGlmICFjdXJyZW50T2JqZWN0TmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cclxuXHRcdGlmICFyZWxhdGVkTGlzdEl0ZW1cclxuXHRcdFx0Y29uc29sZS5lcnJvcihcInJlbGF0ZWRMaXN0SXRlbSBtdXN0IG5vdCBiZSBlbXB0eSBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9uc1wiKTtcclxuXHRcdFx0cmV0dXJuIHt9XHJcblxyXG5cdFx0aWYgIWN1cnJlbnRSZWNvcmQgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRjdXJyZW50UmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKVxyXG5cclxuXHRcdGlmICF1c2VySWQgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHJcblx0XHRpZiAhc3BhY2VJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHJcblx0XHRzaGFyaW5nID0gcmVsYXRlZExpc3RJdGVtLnNoYXJpbmcgfHwgJ21hc3RlcldyaXRlJ1xyXG5cdFx0bWFzdGVyQWxsb3cgPSBmYWxzZVxyXG5cdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZClcclxuXHRcdGlmIHNoYXJpbmcgPT0gJ21hc3RlclJlYWQnXHJcblx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRcclxuXHRcdGVsc2UgaWYgc2hhcmluZyA9PSAnbWFzdGVyV3JpdGUnXHJcblx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRcclxuXHJcblx0XHR1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKVxyXG5cdFx0cmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpXHJcblx0XHRpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMVxyXG5cclxuXHRcdHJlc3VsdCA9IF8uY2xvbmUgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zXHJcblx0XHRyZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxyXG5cdFx0cmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxyXG5cdFx0cmV0dXJuIHJlc3VsdFxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblxyXG5cdENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkKSAtPlxyXG5cdFx0cGVybWlzc2lvbnMgPVxyXG5cdFx0XHRvYmplY3RzOiB7fVxyXG5cdFx0XHRhc3NpZ25lZF9hcHBzOiBbXVxyXG5cdFx0IyMjXHJcblx0XHTmnYPpmZDnu4Tor7TmmI46XHJcblx0XHTlhoXnva7mnYPpmZDnu4QtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXHJcblx0XHToh6rlrprkuYnmnYPpmZDnu4Qt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ57uE5Lul5aSW55qE5YW25LuW5p2D6ZmQ57uEXHJcblx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDnu4TvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxyXG5cdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ57uE77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ57uEXHJcblx0XHQjIyNcclxuXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxyXG5cdFx0c3BhY2VVc2VyID0gbnVsbFxyXG5cdFx0aWYgdXNlcklkXHJcblx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXHJcblxyXG5cdFx0cHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXHJcblx0XHRwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXHJcblx0XHRwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0cHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXHJcblxyXG5cdFx0cHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXHJcblx0XHRwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxyXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXHJcblx0XHRlbHNlXHJcblx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcclxuXHJcblx0XHRwc2V0c0FkbWluX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzVXNlcl9wb3MgPSBudWxsXHJcblx0XHRwc2V0c01lbWJlcl9wb3MgPSBudWxsXHJcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IG51bGxcclxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSBudWxsXHJcblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbFxyXG5cclxuXHRcdGlmIHBzZXRzQWRtaW4/Ll9pZFxyXG5cdFx0XHRwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzVXNlcj8uX2lkXHJcblx0XHRcdHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzTWVtYmVyPy5faWRcclxuXHRcdFx0cHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c01lbWJlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzR3Vlc3Q/Ll9pZFxyXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzU3VwcGxpZXI/Ll9pZFxyXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzQ3VzdG9tZXI/Ll9pZFxyXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNDdXN0b21lci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHJcblx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxyXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwiX2lkXCJcclxuXHRcdFx0cHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogc2V0X2lkc319KS5mZXRjaCgpXHJcblx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXHJcblxyXG5cdFx0cHNldHMgPSB7XHJcblx0XHRcdHBzZXRzQWRtaW4sIFxyXG5cdFx0XHRwc2V0c1VzZXIsIFxyXG5cdFx0XHRwc2V0c0N1cnJlbnQsIFxyXG5cdFx0XHRwc2V0c01lbWJlciwgXHJcblx0XHRcdHBzZXRzR3Vlc3QsXHJcblx0XHRcdHBzZXRzU3VwcGxpZXIsXHJcblx0XHRcdHBzZXRzQ3VzdG9tZXIsXHJcblx0XHRcdGlzU3BhY2VBZG1pbixcclxuXHRcdFx0c3BhY2VVc2VyLCBcclxuXHRcdFx0cHNldHNBZG1pbl9wb3MsIFxyXG5cdFx0XHRwc2V0c1VzZXJfcG9zLCBcclxuXHRcdFx0cHNldHNNZW1iZXJfcG9zLCBcclxuXHRcdFx0cHNldHNHdWVzdF9wb3MsXHJcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zLFxyXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyxcclxuXHRcdFx0cHNldHNDdXJyZW50X3Bvc1xyXG5cdFx0fVxyXG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXNcclxuXHRcdF9pID0gMFxyXG5cdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cclxuXHRcdFx0X2krK1xyXG5cdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PSBzcGFjZUlkXHJcblx0XHRcdFx0aWYgIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09ICcwJyB8fCAob2JqZWN0LmluX2RldmVsb3BtZW50ICE9ICcwJyAmJiBpc1NwYWNlQWRtaW4pXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHJcblx0dW5pb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cclxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXHJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcclxuXHRcdGlmICFhcnJheVxyXG5cdFx0XHRhcnJheSA9IFtdXHJcblx0XHRpZiAhb3RoZXJcclxuXHRcdFx0b3RoZXIgPSBbXVxyXG5cdFx0cmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKVxyXG5cclxuXHRpbnRlcnNlY3Rpb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cclxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXHJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcclxuXHRcdGlmICFhcnJheVxyXG5cdFx0XHRhcnJheSA9IFtdXHJcblx0XHRpZiAhb3RoZXJcclxuXHRcdFx0b3RoZXIgPSBbXVxyXG5cdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcilcclxuXHJcblx0Q3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0XHRwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0cHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdHBzZXRzU3VwcGxpZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0cHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdCMgcHNldHNNZW1iZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdCMgcHNldHNHdWVzdCA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcclxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0YXBwcyA9IFtdXHJcblx0XHRpZiBpc1NwYWNlQWRtaW5cclxuXHRcdFx0cmV0dXJuIFtdXHJcblx0XHRlbHNlXHJcblx0XHRcdHVzZXJQcm9maWxlID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pPy5wcm9maWxlXHJcblx0XHRcdHBzZXRCYXNlID0gcHNldHNVc2VyXHJcblx0XHRcdGlmIHVzZXJQcm9maWxlXHJcblx0XHRcdFx0aWYgdXNlclByb2ZpbGUgPT0gJ3N1cHBsaWVyJ1xyXG5cdFx0XHRcdFx0cHNldEJhc2UgPSBwc2V0c1N1cHBsaWVyXHJcblx0XHRcdFx0ZWxzZSBpZiB1c2VyUHJvZmlsZSA9PSAnY3VzdG9tZXInXHJcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXJcclxuXHRcdFx0aWYgcHNldEJhc2U/LmFzc2lnbmVkX2FwcHM/Lmxlbmd0aFxyXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHNcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCMgdXNlcuadg+mZkOe7hOS4reeahGFzc2lnbmVkX2FwcHPooajnpLrmiYDmnInnlKjmiLflhbfmnInnmoRhcHBz5p2D6ZmQ77yM5Li656m65YiZ6KGo56S65pyJ5omA5pyJYXBwc+adg+mZkO+8jOS4jemcgOimgeS9nOadg+mZkOWIpOaWreS6hlxyXG5cdFx0XHRcdHJldHVybiBbXVxyXG5cdFx0XHRfLmVhY2ggcHNldHMsIChwc2V0KS0+XHJcblx0XHRcdFx0aWYgIXBzZXQuYXNzaWduZWRfYXBwc1xyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0aWYgcHNldC5uYW1lID09IFwiYWRtaW5cIiB8fCAgcHNldC5uYW1lID09IFwidXNlclwiIHx8IHBzZXQubmFtZSA9PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PSAnY3VzdG9tZXInXHJcblx0XHRcdFx0XHQjIOi/memHjOS5i+aJgOS7peimgeaOkumZpGFkbWluL3VzZXLvvIzmmK/lm6DkuLrov5nkuKTkuKrmnYPpmZDnu4TmmK/miYDmnInmnYPpmZDnu4TkuK11c2Vyc+WxnuaAp+aXoOaViOeahOadg+mZkOe7hO+8jOeJueaMh+W3peS9nOWMuueuoeeQhuWRmOWSjOaJgOacieeUqOaIt1xyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzXHJcblx0XHRcdHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLHVuZGVmaW5lZCxudWxsKVxyXG5cclxuXHRDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0XHRwc2V0cyA9ICB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdGFkbWluTWVudXMgPSBDcmVhdG9yLkFwcHMuYWRtaW4/LmFkbWluX21lbnVzXHJcblx0XHQjIOWmguaenOayoeaciWFkbWlu6I+c5Y2V6K+05piO5LiN6ZyA6KaB55u45YWz5Yqf6IO977yM55u05o6l6L+U5Zue56m6XHJcblx0XHR1bmxlc3MgYWRtaW5NZW51c1xyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZCAobikgLT5cclxuXHRcdFx0bi5faWQgPT0gJ2Fib3V0J1xyXG5cdFx0YWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyIChuKSAtPlxyXG5cdFx0XHRuLl9pZCAhPSAnYWJvdXQnXHJcblx0XHRvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkgXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgKG4pIC0+XHJcblx0XHRcdHJldHVybiBuLmFkbWluX21lbnVzIGFuZCBuLl9pZCAhPSAnYWRtaW4nXHJcblx0XHQpLCAnc29ydCdcclxuXHRcdG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKVxyXG5cdFx0IyDoj5zljZXmnInkuInpg6jliIbnu4TmiJDvvIzorr7nva5BUFDoj5zljZXjgIHlhbbku5ZBUFDoj5zljZXku6Xlj4phYm91dOiPnOWNlVxyXG5cdFx0YWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKVxyXG5cdFx0aWYgaXNTcGFjZUFkbWluXHJcblx0XHRcdCMg5bel5L2c5Yy6566h55CG5ZGY5pyJ5YWo6YOo6I+c5Y2V5Yqf6IO9XHJcblx0XHRcdHJlc3VsdCA9IGFsbE1lbnVzXHJcblx0XHRlbHNlXHJcblx0XHRcdHVzZXJQcm9maWxlID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pPy5wcm9maWxlIHx8ICd1c2VyJ1xyXG5cdFx0XHRjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwIChuKSAtPlxyXG5cdFx0XHRcdHJldHVybiBuLm5hbWVcclxuXHRcdFx0bWVudXMgPSBhbGxNZW51cy5maWx0ZXIgKG1lbnUpLT5cclxuXHRcdFx0XHRwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0c1xyXG5cdFx0XHRcdCMg5aaC5p6c5pmu6YCa55So5oi35pyJ5p2D6ZmQ77yM5YiZ55u05o6l6L+U5ZuedHJ1ZVxyXG5cdFx0XHRcdGlmIHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZih1c2VyUHJvZmlsZSkgPiAtMVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0XHQjIOWQpuWImeWPluW9k+WJjeeUqOaIt+eahOadg+mZkOmbhuS4jm1lbnXoj5zljZXopoHmsYLnmoTmnYPpmZDpm4blr7nmr5TvvIzlpoLmnpzkuqTpm4blpKfkuo4x5Liq5YiZ6L+U5ZuedHJ1ZVxyXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aFxyXG5cdFx0XHRyZXN1bHQgPSBtZW51c1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gXy5zb3J0QnkocmVzdWx0LFwic29ydFwiKVxyXG5cclxuXHRmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKS0+XHJcblxyXG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcclxuXHRcdFx0cmV0dXJuIF8uZmluZCBwZXJtaXNzaW9uX29iamVjdHMsIChwbyktPlxyXG5cdFx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkfSlcclxuXHJcblx0ZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpLT5cclxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXHJcblx0XHRcdHJldHVybiBfLmZpbHRlciBwZXJtaXNzaW9uX29iamVjdHMsIChwbyktPlxyXG5cdFx0XHRcdHJldHVybiBwby5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxyXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHBlcm1pc3Npb25fc2V0X2lkc319KS5mZXRjaCgpXHJcblxyXG5cdHVuaW9uUGVybWlzc2lvbk9iamVjdHMgPSAocG9zLCBvYmplY3QsIHBzZXRzKS0+XHJcblx0XHQjIOaKimRi5Y+KeW1s5Lit55qEcGVybWlzc2lvbl9vYmplY3Rz5ZCI5bm277yM5LyY5YWI5Y+WZGLkuK3nmoRcclxuXHRcdHJlc3VsdCA9IFtdXHJcblx0XHRfLmVhY2ggb2JqZWN0LnBlcm1pc3Npb25fc2V0LCAob3BzLCBvcHNfa2V5KS0+XHJcblx0XHRcdCMg5oqKeW1s5Lit6Zmk5LqG54m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ57uEXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwi5aSW55qE5YW25LuW5a+56LGh5p2D6ZmQ5YWI5a2Y5YWlcmVzdWx0XHJcblx0XHRcdCMgaWYgW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIiwgXCJ3b3JrZmxvd19hZG1pblwiLCBcIm9yZ2FuaXphdGlvbl9hZG1pblwiXS5pbmRleE9mKG9wc19rZXkpIDwgMFxyXG5cdFx0XHRpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiXS5pbmRleE9mKG9wc19rZXkpIDwgMFxyXG5cdFx0XHRcdGN1cnJlbnRQc2V0ID0gcHNldHMuZmluZCAocHNldCktPiByZXR1cm4gcHNldC5uYW1lID09IG9wc19rZXlcclxuXHRcdFx0XHRpZiBjdXJyZW50UHNldFxyXG5cdFx0XHRcdFx0dGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fVxyXG5cdFx0XHRcdFx0dGVtcE9wcy5wZXJtaXNzaW9uX3NldF9pZCA9IGN1cnJlbnRQc2V0Ll9pZFxyXG5cdFx0XHRcdFx0dGVtcE9wcy5vYmplY3RfbmFtZSA9IG9iamVjdC5vYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggdGVtcE9wc1xyXG5cdFx0aWYgcmVzdWx0Lmxlbmd0aFxyXG5cdFx0XHRwb3MuZm9yRWFjaCAocG8pLT5cclxuXHRcdFx0XHRyZXBlYXRJbmRleCA9IDBcclxuXHRcdFx0XHRyZXBlYXRQbyA9IHJlc3VsdC5maW5kKChpdGVtLCBpbmRleCktPiByZXBlYXRJbmRleCA9IGluZGV4O3JldHVybiBpdGVtLnBlcm1pc3Npb25fc2V0X2lkID09IHBvLnBlcm1pc3Npb25fc2V0X2lkKVxyXG5cdFx0XHRcdCMg5aaC5p6ceW1s5Lit5bey57uP5a2Y5ZyocG/vvIzliJnmm7/mjaLkuLrmlbDmja7lupPkuK3nmoRwb++8jOWPjeS5i+WImeaKiuaVsOaNruW6k+S4reeahHBv55u05o6l57Sv5Yqg6L+b5Y67XHJcblx0XHRcdFx0aWYgcmVwZWF0UG9cclxuXHRcdFx0XHRcdHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwb1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoIHBvXHJcblx0XHRcdHJldHVybiByZXN1bHRcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHBvc1xyXG5cclxuXHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpLT5cclxuXHRcdHBlcm1pc3Npb25zID0ge31cclxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKVxyXG5cclxuXHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PSBcInVzZXJzXCJcclxuXHRcdFx0cGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cclxuXHRcdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcclxuXHRcdFx0cmV0dXJuIHBlcm1pc3Npb25zXHJcblx0XHRwc2V0c0FkbWluID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSBvciB0aGlzLnBzZXRzQWRtaW4gdGhlbiB0aGlzLnBzZXRzQWRtaW4gZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c1VzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgb3IgdGhpcy5wc2V0c1VzZXIgdGhlbiB0aGlzLnBzZXRzVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxyXG5cdFx0cHNldHNNZW1iZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSBvciB0aGlzLnBzZXRzTWVtYmVyIHRoZW4gdGhpcy5wc2V0c01lbWJlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c0d1ZXN0ID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSBvciB0aGlzLnBzZXRzR3Vlc3QgdGhlbiB0aGlzLnBzZXRzR3Vlc3QgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblxyXG5cdFx0cHNldHNTdXBwbGllciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgb3IgdGhpcy5wc2V0c1N1cHBsaWVyIHRoZW4gdGhpcy5wc2V0c1N1cHBsaWVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MX19KVxyXG5cdFx0cHNldHNDdXN0b21lciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgb3IgdGhpcy5wc2V0c0N1c3RvbWVyIHRoZW4gdGhpcy5wc2V0c0N1c3RvbWVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MX19KVxyXG5cdFx0cHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcclxuXHJcblx0XHRwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3NcclxuXHRcdHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3NcclxuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zXHJcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3NcclxuXHJcblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3NcclxuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gdGhpcy5wc2V0c0N1c3RvbWVyX3Bvc1xyXG5cclxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3NcclxuXHJcblx0XHRvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9XHJcblx0XHRvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fVxyXG5cdFx0b3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9XHJcblx0XHRvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XHJcblxyXG5cdFx0b3BzZXRTdXBwbGllciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnN1cHBsaWVyKSB8fCB7fVxyXG5cdFx0b3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fVxyXG5cclxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3RfbGlzdHZpZXdzJykuZmluZCh7c3BhY2U6IHNwYWNlSWQsIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc2hhcmVkOiB0cnVlfSwge2ZpZWxkczp7X2lkOjF9fSkuZmV0Y2goKVxyXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBfLnBsdWNrKHNoYXJlZExpc3RWaWV3cyxcIl9pZFwiKVxyXG5cdFx0IyBpZiBzaGFyZWRMaXN0Vmlld3MubGVuZ3RoXHJcblx0XHQjIFx0dW5sZXNzIG9wc2V0QWRtaW4ubGlzdF92aWV3c1xyXG5cdFx0IyBcdFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gW11cclxuXHRcdCMgXHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0QWRtaW4ubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXHJcblx0XHQjIFx0dW5sZXNzIG9wc2V0VXNlci5saXN0X3ZpZXdzXHJcblx0XHQjIFx0XHRvcHNldFVzZXIubGlzdF92aWV3cyA9IFtdXHJcblx0XHQjIFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0VXNlci5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3NcclxuXHRcdCMg5pWw5o2u5bqT5Lit5aaC5p6c6YWN572u5LqG6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOmbhuiuvue9ru+8jOW6lOivpeimhuebluS7o+eggeS4rWFkbWluL3VzZXLnmoTmnYPpmZDpm4borr7nva5cclxuXHRcdGlmIHBzZXRzQWRtaW5cclxuXHRcdFx0cG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpXHJcblx0XHRcdGlmIHBvc0FkbWluXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0NyZWF0ZSA9IHBvc0FkbWluLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc0FkbWluLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0VkaXQgPSBwb3NBZG1pbi5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldEFkbWluLmFsbG93UmVhZCA9IHBvc0FkbWluLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLnZpZXdBbGxSZWNvcmRzID0gcG9zQWRtaW4udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldEFkbWluLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NBZG1pbi5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0FkbWluLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0FkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblx0XHRpZiBwc2V0c1VzZXJcclxuXHRcdFx0cG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpXHJcblx0XHRcdGlmIHBvc1VzZXJcclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dDcmVhdGUgPSBwb3NVc2VyLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93RGVsZXRlID0gcG9zVXNlci5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd0VkaXQgPSBwb3NVc2VyLmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd1JlYWQgPSBwb3NVc2VyLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0VXNlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zVXNlci5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnZpZXdBbGxSZWNvcmRzID0gcG9zVXNlci52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldFVzZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zVXNlci52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldFVzZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1VzZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0VXNlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zVXNlci5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRVc2VyLnVucmVhZGFibGVfZmllbGRzID0gcG9zVXNlci51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldFVzZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NVc2VyLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zVXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxyXG5cdFx0aWYgcHNldHNNZW1iZXJcclxuXHRcdFx0cG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpXHJcblx0XHRcdGlmIHBvc01lbWJlclxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93Q3JlYXRlID0gcG9zTWVtYmVyLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dEZWxldGUgPSBwb3NNZW1iZXIuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd0VkaXQgPSBwb3NNZW1iZXIuYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dSZWFkID0gcG9zTWVtYmVyLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnZpZXdBbGxSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc01lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc01lbWJlci5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zTWVtYmVyLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcclxuXHRcdGlmIHBzZXRzR3Vlc3RcclxuXHRcdFx0cG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpXHJcblx0XHRcdGlmIHBvc0d1ZXN0XHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0NyZWF0ZSA9IHBvc0d1ZXN0LmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0RlbGV0ZSA9IHBvc0d1ZXN0LmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0VkaXQgPSBwb3NHdWVzdC5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmFsbG93UmVhZCA9IHBvc0d1ZXN0LmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LnZpZXdBbGxSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0d1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmRpc2FibGVkX2FjdGlvbnMgPSBwb3NHdWVzdC5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0d1ZXN0LnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblx0XHRpZiBwc2V0c1N1cHBsaWVyXHJcblx0XHRcdHBvc1N1cHBsaWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1N1cHBsaWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzU3VwcGxpZXIuX2lkKTtcclxuXHRcdFx0aWYgcG9zU3VwcGxpZXJcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmFsbG93Q3JlYXRlID0gcG9zU3VwcGxpZXIuYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmFsbG93RGVsZXRlID0gcG9zU3VwcGxpZXIuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmFsbG93RWRpdCA9IHBvc1N1cHBsaWVyLmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuYWxsb3dSZWFkID0gcG9zU3VwcGxpZXIuYWxsb3dSZWFkXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zU3VwcGxpZXIubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIudmlld0FsbFJlY29yZHMgPSBwb3NTdXBwbGllci52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NTdXBwbGllci5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zU3VwcGxpZXIudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zU3VwcGxpZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1N1cHBsaWVyLmRpc2FibGVkX2FjdGlvbnNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zU3VwcGxpZXIudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zU3VwcGxpZXIudW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zU3VwcGxpZXIudW5yZWxhdGVkX29iamVjdHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zU3VwcGxpZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcclxuXHRcdGlmIHBzZXRzQ3VzdG9tZXJcclxuXHRcdFx0cG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xyXG5cdFx0XHRpZiBwb3NDdXN0b21lclxyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuYWxsb3dDcmVhdGUgPSBwb3NDdXN0b21lci5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuYWxsb3dEZWxldGUgPSBwb3NDdXN0b21lci5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuYWxsb3dFZGl0ID0gcG9zQ3VzdG9tZXIuYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5hbGxvd1JlYWQgPSBwb3NDdXN0b21lci5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NDdXN0b21lci5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci52aWV3QWxsUmVjb3JkcyA9IHBvc0N1c3RvbWVyLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0N1c3RvbWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NDdXN0b21lci5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NDdXN0b21lci51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NDdXN0b21lci51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NDdXN0b21lci51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NDdXN0b21lci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxyXG5cclxuXHRcdGlmICF1c2VySWRcclxuXHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXHJcblx0XHRlbHNlXHJcblx0XHRcdGlmIGlzU3BhY2VBZG1pblxyXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnY29tbW9uJ1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRzcGFjZVVzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgb3IgdGhpcy5zcGFjZVVzZXIgdGhlbiB0aGlzLnNwYWNlVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxyXG5cdFx0XHRcdFx0aWYgc3BhY2VVc2VyXHJcblx0XHRcdFx0XHRcdHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZVxyXG5cdFx0XHRcdFx0XHRpZiBwcm9mXHJcblx0XHRcdFx0XHRcdFx0aWYgcHJvZiBpcyAndXNlcidcclxuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdtZW1iZXInXHJcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdndWVzdCdcclxuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnc3VwcGxpZXInXHJcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXJcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2N1c3RvbWVyJ1xyXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEN1c3RvbWVyXHJcblx0XHRcdFx0XHRcdGVsc2UgIyDmsqHmnIlwcm9maWxl5YiZ6K6k5Li65pivdXNlcuadg+mZkFxyXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxyXG5cdFx0aWYgcHNldHMubGVuZ3RoID4gMFxyXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0cywgXCJfaWRcIlxyXG5cdFx0XHRwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKVxyXG5cdFx0XHRwb3MgPSB1bmlvblBlcm1pc3Npb25PYmplY3RzKHBvcywgb2JqZWN0LCBwc2V0cylcclxuXHRcdFx0Xy5lYWNoIHBvcywgKHBvKS0+XHJcblx0XHRcdFx0aWYgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNBZG1pbj8uX2lkIG9yIFxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzVXNlcj8uX2lkIG9yIFxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzTWVtYmVyPy5faWQgb3IgXHJcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNHdWVzdD8uX2lkIG9yXHJcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNTdXBwbGllcj8uX2lkIG9yXHJcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNDdXN0b21lcj8uX2lkXHJcblx0XHRcdFx0XHQjIOm7mOiupOeahGFkbWluL3VzZXLmnYPpmZDlgLzlj6rlrp7ooYzkuIrpnaLnmoTpu5jorqTlgLzopobnm5bvvIzkuI3lgZrnrpfms5XliKTmlq1cclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdGlmIF8uaXNFbXB0eShwZXJtaXNzaW9ucylcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gcG9cclxuXHRcdFx0XHRpZiBwby5hbGxvd1JlYWRcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWVcclxuXHRcdFx0XHRpZiBwby5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dFZGl0XHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dEZWxldGVcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8udmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWVcclxuXHRcdFx0XHRpZiBwby52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcclxuXHJcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpXHJcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpXHJcblx0XHRcclxuXHRcdGlmIG9iamVjdC5pc192aWV3XHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZVxyXG5cdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW11cclxuXHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXHJcblxyXG5cdFx0aWYgb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXHJcblx0XHRcdHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXHJcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHJcblxyXG5cdCMgQ3JlYXRvci5pbml0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUpIC0+XHJcblxyXG5cdFx0IyAjIOW6lOivpeaKiuiuoeeul+WHuuadpeeahFxyXG5cdFx0IyBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXS5hbGxvd1xyXG5cdFx0IyBcdGluc2VydDogKHVzZXJJZCwgZG9jKSAtPlxyXG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2VcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0ICAgIFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0IyBcdHVwZGF0ZTogKHVzZXJJZCwgZG9jKSAtPlxyXG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2VcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RWRpdFxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdHJldHVybiB0cnVlXHJcblx0XHQjIFx0cmVtb3ZlOiAodXNlcklkLCBkb2MpIC0+XHJcblx0XHQjIFx0XHRpZiAhdXNlcklkXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRNZXRlb3IubWV0aG9kc1xyXG5cdFx0IyBDYWxjdWxhdGUgUGVybWlzc2lvbnMgb24gU2VydmVyXHJcblx0XHRcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IChzcGFjZUlkKS0+XHJcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKVxyXG4iLCJ2YXIgY2xvbmUsIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QsIGZpbmRfcGVybWlzc2lvbl9vYmplY3QsIGludGVyc2VjdGlvblBsdXMsIHVuaW9uUGVybWlzc2lvbk9iamVjdHMsIHVuaW9uUGx1cztcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgb2JqO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKTtcbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgaXNPd25lciwgb2JqZWN0X2ZpZWxkc19rZXlzLCBwZXJtaXNzaW9ucywgcmVjb3JkX2NvbXBhbnlfaWQsIHJlY29yZF9jb21wYW55X2lkcywgcmVjb3JkX2lkLCByZWYsIHJlZjEsIHNlbGVjdCwgdXNlcl9jb21wYW55X2lkcztcbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gIH1cbiAgaWYgKHJlY29yZCAmJiBvYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIiAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuICAgICAgcmVjb3JkX2lkID0gcmVjb3JkLnBhcmVudC5faWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XG4gICAgICByZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgICB9XG4gICAgb2JqZWN0X2ZpZWxkc19rZXlzID0gXy5rZXlzKCgocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMCkgfHwge30pIHx8IFtdO1xuICAgIHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcbiAgICBpZiAoc2VsZWN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdC5qb2luKCcsJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvcmQgPSBudWxsO1xuICAgIH1cbiAgfVxuICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSk7XG4gIGlmIChyZWNvcmQpIHtcbiAgICBpZiAocmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucykge1xuICAgICAgcmV0dXJuIHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnM7XG4gICAgfVxuICAgIGlzT3duZXIgPSByZWNvcmQub3duZXIgPT09IHVzZXJJZCB8fCAoKHJlZjEgPSByZWNvcmQub3duZXIpICE9IG51bGwgPyByZWYxLl9pZCA6IHZvaWQgMCkgPT09IHVzZXJJZDtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpO1xuICAgIH1cbiAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmNvbXBhbnlfaWQgOiB2b2lkIDA7XG4gICAgaWYgKHJlY29yZF9jb21wYW55X2lkICYmIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpICYmIHJlY29yZF9jb21wYW55X2lkLl9pZCkge1xuICAgICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWQ7XG4gICAgfVxuICAgIHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmNvbXBhbnlfaWRzIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSkpIHtcbiAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gXy51bmlvbihyZWNvcmRfY29tcGFueV9pZHMsIFtyZWNvcmRfY29tcGFueV9pZF0pO1xuICAgIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHVzZXJfY29tcGFueV9pZHMgJiYgdXNlcl9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJlY29yZC5sb2NrZWQgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICghXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcGVybWlzc2lvbnM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICAgIHZhciBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUsIG1hc3RlckFsbG93LCBtYXN0ZXJSZWNvcmRQZXJtLCByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMsIHJlc3VsdCwgc2hhcmluZywgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgaWYgKCFjdXJyZW50T2JqZWN0TmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFyZWxhdGVkTGlzdEl0ZW0pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmICghY3VycmVudFJlY29yZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgc2hhcmluZyA9IHJlbGF0ZWRMaXN0SXRlbS5zaGFyaW5nIHx8ICdtYXN0ZXJXcml0ZSc7XG4gICAgbWFzdGVyQWxsb3cgPSBmYWxzZTtcbiAgICBtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKTtcbiAgICBpZiAoc2hhcmluZyA9PT0gJ21hc3RlclJlYWQnKSB7XG4gICAgICBtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkO1xuICAgIH0gZWxzZSBpZiAoc2hhcmluZyA9PT0gJ21hc3RlcldyaXRlJykge1xuICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdDtcbiAgICB9XG4gICAgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSk7XG4gICAgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpO1xuICAgIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xO1xuICAgIHJlc3VsdCA9IF8uY2xvbmUocmVsYXRlZE9iamVjdFBlcm1pc3Npb25zKTtcbiAgICByZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICByZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBfaSwgaXNTcGFjZUFkbWluLCBwZXJtaXNzaW9ucywgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnQsIHBzZXRzQ3VycmVudE5hbWVzLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHtcbiAgICAgIG9iamVjdHM6IHt9LFxuICAgICAgYXNzaWduZWRfYXBwczogW11cbiAgICB9O1xuXG4gICAgLypcbiAgICBcdFx05p2D6ZmQ57uE6K+05piOOlxuICAgIFx0XHTlhoXnva7mnYPpmZDnu4QtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXG4gICAgXHRcdOiHquWumuS5ieadg+mZkOe7hC3mlbDmja7lupPkuK3mlrDlu7rnmoTpmaTlhoXnva7mnYPpmZDnu4Tku6XlpJbnmoTlhbbku5bmnYPpmZDnu4RcbiAgICBcdFx054m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ57uE77yI5Y2zdXNlcnPlsZ7mgKfkuI3lj6/phY3nva7vvIktYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3RcbiAgICBcdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ57uE77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ57uEXG4gICAgICovXG4gICAgaXNTcGFjZUFkbWluID0gZmFsc2U7XG4gICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICBpZiAodXNlcklkKSB7XG4gICAgICBpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBwc2V0c0FkbWluX3BvcyA9IG51bGw7XG4gICAgcHNldHNVc2VyX3BvcyA9IG51bGw7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0d1ZXN0X3BvcyA9IG51bGw7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IG51bGw7XG4gICAgcHNldHNTdXBwbGllcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbDtcbiAgICBpZiAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1N1cHBsaWVyICE9IG51bGwgPyBwc2V0c1N1cHBsaWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNTdXBwbGllcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXJyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJfaWRcIik7XG4gICAgICBwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAgICRpbjogc2V0X2lkc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgcHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJuYW1lXCIpO1xuICAgIH1cbiAgICBwc2V0cyA9IHtcbiAgICAgIHBzZXRzQWRtaW46IHBzZXRzQWRtaW4sXG4gICAgICBwc2V0c1VzZXI6IHBzZXRzVXNlcixcbiAgICAgIHBzZXRzQ3VycmVudDogcHNldHNDdXJyZW50LFxuICAgICAgcHNldHNNZW1iZXI6IHBzZXRzTWVtYmVyLFxuICAgICAgcHNldHNHdWVzdDogcHNldHNHdWVzdCxcbiAgICAgIHBzZXRzU3VwcGxpZXI6IHBzZXRzU3VwcGxpZXIsXG4gICAgICBwc2V0c0N1c3RvbWVyOiBwc2V0c0N1c3RvbWVyLFxuICAgICAgaXNTcGFjZUFkbWluOiBpc1NwYWNlQWRtaW4sXG4gICAgICBzcGFjZVVzZXI6IHNwYWNlVXNlcixcbiAgICAgIHBzZXRzQWRtaW5fcG9zOiBwc2V0c0FkbWluX3BvcyxcbiAgICAgIHBzZXRzVXNlcl9wb3M6IHBzZXRzVXNlcl9wb3MsXG4gICAgICBwc2V0c01lbWJlcl9wb3M6IHBzZXRzTWVtYmVyX3BvcyxcbiAgICAgIHBzZXRzR3Vlc3RfcG9zOiBwc2V0c0d1ZXN0X3BvcyxcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zOiBwc2V0c1N1cHBsaWVyX3BvcyxcbiAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zOiBwc2V0c0N1c3RvbWVyX3BvcyxcbiAgICAgIHBzZXRzQ3VycmVudF9wb3M6IHBzZXRzQ3VycmVudF9wb3NcbiAgICB9O1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX2FwcHMgPSBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lcztcbiAgICBfaSA9IDA7XG4gICAgXy5lYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24ob2JqZWN0LCBvYmplY3RfbmFtZSkge1xuICAgICAgX2krKztcbiAgICAgIGlmICghXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PT0gc3BhY2VJZCkge1xuICAgICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09PSAnMCcgfHwgKG9iamVjdC5pbl9kZXZlbG9wbWVudCAhPT0gJzAnICYmIGlzU3BhY2VBZG1pbikpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZCk7XG4gICAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICB1bmlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgaW50ZXJzZWN0aW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYXBwcywgaXNTcGFjZUFkbWluLCBwc2V0QmFzZSwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQ3VzdG9tZXIsIHBzZXRzU3VwcGxpZXIsIHBzZXRzVXNlciwgcmVmLCByZWYxLCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFwcHMgPSBbXTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJQcm9maWxlID0gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYucHJvZmlsZSA6IHZvaWQgMDtcbiAgICAgIHBzZXRCYXNlID0gcHNldHNVc2VyO1xuICAgICAgaWYgKHVzZXJQcm9maWxlKSB7XG4gICAgICAgIGlmICh1c2VyUHJvZmlsZSA9PT0gJ3N1cHBsaWVyJykge1xuICAgICAgICAgIHBzZXRCYXNlID0gcHNldHNTdXBwbGllcjtcbiAgICAgICAgfSBlbHNlIGlmICh1c2VyUHJvZmlsZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHBzZXRCYXNlID0gcHNldHNDdXN0b21lcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBzZXRCYXNlICE9IG51bGwgPyAocmVmMSA9IHBzZXRCYXNlLmFzc2lnbmVkX2FwcHMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIF8uZWFjaChwc2V0cywgZnVuY3Rpb24ocHNldCkge1xuICAgICAgICBpZiAoIXBzZXQuYXNzaWduZWRfYXBwcykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHNldC5uYW1lID09PSBcImFkbWluXCIgfHwgcHNldC5uYW1lID09PSBcInVzZXJcIiB8fCBwc2V0Lm5hbWUgPT09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy53aXRob3V0KF8udW5pcShhcHBzKSwgdm9pZCAwLCBudWxsKTtcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhYm91dE1lbnUsIGFkbWluTWVudXMsIGFsbE1lbnVzLCBjdXJyZW50UHNldE5hbWVzLCBpc1NwYWNlQWRtaW4sIG1lbnVzLCBvdGhlck1lbnVBcHBzLCBvdGhlck1lbnVzLCBwc2V0cywgcmVmLCByZWYxLCByZXN1bHQsIHVzZXJQcm9maWxlO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICB1c2VyczogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICBuYW1lOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYWRtaW5NZW51cyA9IChyZWYgPSBDcmVhdG9yLkFwcHMuYWRtaW4pICE9IG51bGwgPyByZWYuYWRtaW5fbWVudXMgOiB2b2lkIDA7XG4gICAgaWYgKCFhZG1pbk1lbnVzKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgPT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgYWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCAhPT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkoXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uYWRtaW5fbWVudXMgJiYgbi5faWQgIT09ICdhZG1pbic7XG4gICAgfSksICdzb3J0Jyk7XG4gICAgb3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpO1xuICAgIGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSk7XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmVzdWx0ID0gYWxsTWVudXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJQcm9maWxlID0gKChyZWYxID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjEucHJvZmlsZSA6IHZvaWQgMCkgfHwgJ3VzZXInO1xuICAgICAgY3VycmVudFBzZXROYW1lcyA9IHBzZXRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLm5hbWU7XG4gICAgICB9KTtcbiAgICAgIG1lbnVzID0gYWxsTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICAgICAgdmFyIHBzZXRzTWVudTtcbiAgICAgICAgcHNldHNNZW51ID0gbWVudS5wZXJtaXNzaW9uX3NldHM7XG4gICAgICAgIGlmIChwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YodXNlclByb2ZpbGUpID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGg7XG4gICAgICB9KTtcbiAgICAgIHJlc3VsdCA9IG1lbnVzO1xuICAgIH1cbiAgICByZXR1cm4gXy5zb3J0QnkocmVzdWx0LCBcInNvcnRcIik7XG4gIH07XG4gIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCkge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maW5kKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkXG4gICAgfSk7XG4gIH07XG4gIGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmlsdGVyKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgJGluOiBwZXJtaXNzaW9uX3NldF9pZHNcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICB9O1xuICB1bmlvblBlcm1pc3Npb25PYmplY3RzID0gZnVuY3Rpb24ocG9zLCBvYmplY3QsIHBzZXRzKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICByZXN1bHQgPSBbXTtcbiAgICBfLmVhY2gob2JqZWN0LnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihvcHMsIG9wc19rZXkpIHtcbiAgICAgIHZhciBjdXJyZW50UHNldCwgdGVtcE9wcztcbiAgICAgIGlmIChbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiXS5pbmRleE9mKG9wc19rZXkpIDwgMCkge1xuICAgICAgICBjdXJyZW50UHNldCA9IHBzZXRzLmZpbmQoZnVuY3Rpb24ocHNldCkge1xuICAgICAgICAgIHJldHVybiBwc2V0Lm5hbWUgPT09IG9wc19rZXk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY3VycmVudFBzZXQpIHtcbiAgICAgICAgICB0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9O1xuICAgICAgICAgIHRlbXBPcHMucGVybWlzc2lvbl9zZXRfaWQgPSBjdXJyZW50UHNldC5faWQ7XG4gICAgICAgICAgdGVtcE9wcy5vYmplY3RfbmFtZSA9IG9iamVjdC5vYmplY3RfbmFtZTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2godGVtcE9wcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCkge1xuICAgICAgcG9zLmZvckVhY2goZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgdmFyIHJlcGVhdEluZGV4LCByZXBlYXRQbztcbiAgICAgICAgcmVwZWF0SW5kZXggPSAwO1xuICAgICAgICByZXBlYXRQbyA9IHJlc3VsdC5maW5kKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgcmVwZWF0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICByZXR1cm4gaXRlbS5wZXJtaXNzaW9uX3NldF9pZCA9PT0gcG8ucGVybWlzc2lvbl9zZXRfaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVwZWF0UG8pIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZXN1bHQucHVzaChwbyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBvcztcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIGlzU3BhY2VBZG1pbiwgb2JqZWN0LCBvcHNldEFkbWluLCBvcHNldEN1c3RvbWVyLCBvcHNldEd1ZXN0LCBvcHNldE1lbWJlciwgb3BzZXRTdXBwbGllciwgb3BzZXRVc2VyLCBwZXJtaXNzaW9ucywgcG9zLCBwb3NBZG1pbiwgcG9zQ3VzdG9tZXIsIHBvc0d1ZXN0LCBwb3NNZW1iZXIsIHBvc1N1cHBsaWVyLCBwb3NVc2VyLCBwcm9mLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzQ3VzdG9tZXIsIHBzZXRzQ3VzdG9tZXJfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNTdXBwbGllciwgcHNldHNTdXBwbGllcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3Bvcywgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge307XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuICAgIGlmIChzcGFjZUlkID09PSAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSB8fCB0aGlzLnBzZXRzQWRtaW4gPyB0aGlzLnBzZXRzQWRtaW4gOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgfHwgdGhpcy5wc2V0c1VzZXIgPyB0aGlzLnBzZXRzVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNNZW1iZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSB8fCB0aGlzLnBzZXRzTWVtYmVyID8gdGhpcy5wc2V0c01lbWJlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0d1ZXN0ID0gXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSB8fCB0aGlzLnBzZXRzR3Vlc3QgPyB0aGlzLnBzZXRzR3Vlc3QgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1N1cHBsaWVyID0gXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSB8fCB0aGlzLnBzZXRzU3VwcGxpZXIgPyB0aGlzLnBzZXRzU3VwcGxpZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1c3RvbWVyID0gXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSB8fCB0aGlzLnBzZXRzQ3VzdG9tZXIgPyB0aGlzLnBzZXRzQ3VzdG9tZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3BvcztcbiAgICBwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3BvcztcbiAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3M7XG4gICAgcHNldHNDdXN0b21lcl9wb3MgPSB0aGlzLnBzZXRzQ3VzdG9tZXJfcG9zO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3M7XG4gICAgb3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fTtcbiAgICBvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fTtcbiAgICBvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge307XG4gICAgb3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICBvcHNldFN1cHBsaWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuc3VwcGxpZXIpIHx8IHt9O1xuICAgIG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge307XG4gICAgaWYgKHBzZXRzQWRtaW4pIHtcbiAgICAgIHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKTtcbiAgICAgIGlmIChwb3NBZG1pbikge1xuICAgICAgICBvcHNldEFkbWluLmFsbG93Q3JlYXRlID0gcG9zQWRtaW4uYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dEZWxldGUgPSBwb3NBZG1pbi5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd0VkaXQgPSBwb3NBZG1pbi5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dSZWFkID0gcG9zQWRtaW4uYWxsb3dSZWFkO1xuICAgICAgICBvcHNldEFkbWluLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLnZpZXdBbGxSZWNvcmRzID0gcG9zQWRtaW4udmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0QWRtaW4uZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0FkbWluLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5yZWFkYWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEFkbWluLnVucmVsYXRlZF9vYmplY3RzID0gcG9zQWRtaW4udW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NBZG1pbi51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlcikge1xuICAgICAgcG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpO1xuICAgICAgaWYgKHBvc1VzZXIpIHtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93Q3JlYXRlID0gcG9zVXNlci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93RGVsZXRlID0gcG9zVXNlci5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93RWRpdCA9IHBvc1VzZXIuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dSZWFkID0gcG9zVXNlci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0VXNlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zVXNlci5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIudmlld0FsbFJlY29yZHMgPSBwb3NVc2VyLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zVXNlci52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zVXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldFVzZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1VzZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRVc2VyLnVucmVhZGFibGVfZmllbGRzID0gcG9zVXNlci51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRVc2VyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zVXNlci51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRVc2VyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zVXNlci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRVc2VyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zVXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyKSB7XG4gICAgICBwb3NNZW1iZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzTWVtYmVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzTWVtYmVyLl9pZCk7XG4gICAgICBpZiAocG9zTWVtYmVyKSB7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93Q3JlYXRlID0gcG9zTWVtYmVyLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd0RlbGV0ZSA9IHBvc01lbWJlci5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dFZGl0ID0gcG9zTWVtYmVyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dSZWFkID0gcG9zTWVtYmVyLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRNZW1iZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci52aWV3QWxsUmVjb3JkcyA9IHBvc01lbWJlci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc01lbWJlci5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldE1lbWJlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zTWVtYmVyLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldE1lbWJlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc01lbWJlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QpIHtcbiAgICAgIHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKTtcbiAgICAgIGlmIChwb3NHdWVzdCkge1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93Q3JlYXRlID0gcG9zR3Vlc3QuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dEZWxldGUgPSBwb3NHdWVzdC5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd0VkaXQgPSBwb3NHdWVzdC5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dSZWFkID0gcG9zR3Vlc3QuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldEd1ZXN0Lm1vZGlmeUFsbFJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0LnZpZXdBbGxSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0d1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0R3Vlc3QuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0d1ZXN0LmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEd1ZXN0LnVucmVsYXRlZF9vYmplY3RzID0gcG9zR3Vlc3QudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NHdWVzdC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzU3VwcGxpZXIpIHtcbiAgICAgIHBvc1N1cHBsaWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1N1cHBsaWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzU3VwcGxpZXIuX2lkKTtcbiAgICAgIGlmIChwb3NTdXBwbGllcikge1xuICAgICAgICBvcHNldFN1cHBsaWVyLmFsbG93Q3JlYXRlID0gcG9zU3VwcGxpZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuYWxsb3dEZWxldGUgPSBwb3NTdXBwbGllci5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRTdXBwbGllci5hbGxvd0VkaXQgPSBwb3NTdXBwbGllci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuYWxsb3dSZWFkID0gcG9zU3VwcGxpZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldFN1cHBsaWVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NTdXBwbGllci5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnZpZXdBbGxSZWNvcmRzID0gcG9zU3VwcGxpZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NTdXBwbGllci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NTdXBwbGllci52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1N1cHBsaWVyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1N1cHBsaWVyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NTdXBwbGllci51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1N1cHBsaWVyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zU3VwcGxpZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NTdXBwbGllci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VzdG9tZXIpIHtcbiAgICAgIHBvc0N1c3RvbWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1c3RvbWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQ3VzdG9tZXIuX2lkKTtcbiAgICAgIGlmIChwb3NDdXN0b21lcikge1xuICAgICAgICBvcHNldEN1c3RvbWVyLmFsbG93Q3JlYXRlID0gcG9zQ3VzdG9tZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuYWxsb3dEZWxldGUgPSBwb3NDdXN0b21lci5hbGxvd0RlbGV0ZTtcbiAgICAgICAgb3BzZXRDdXN0b21lci5hbGxvd0VkaXQgPSBwb3NDdXN0b21lci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuYWxsb3dSZWFkID0gcG9zQ3VzdG9tZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldEN1c3RvbWVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NDdXN0b21lci5tb2RpZnlBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnZpZXdBbGxSZWNvcmRzID0gcG9zQ3VzdG9tZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NDdXN0b21lci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0N1c3RvbWVyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0N1c3RvbWVyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NDdXN0b21lci51bnJlYWRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0N1c3RvbWVyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zQ3VzdG9tZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NDdXN0b21lci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3BhY2VJZCA9PT0gJ2NvbW1vbicpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFjZVVzZXIgPSBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgfHwgdGhpcy5zcGFjZVVzZXIgPyB0aGlzLnNwYWNlVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChzcGFjZVVzZXIpIHtcbiAgICAgICAgICAgIHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZTtcbiAgICAgICAgICAgIGlmIChwcm9mKSB7XG4gICAgICAgICAgICAgIGlmIChwcm9mID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnbWVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2d1ZXN0Jykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnc3VwcGxpZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0Q3VzdG9tZXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0cywgXCJfaWRcIik7XG4gICAgICBwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKTtcbiAgICAgIHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKTtcbiAgICAgIF8uZWFjaChwb3MsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIGlmIChwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pc0VtcHR5KHBlcm1pc3Npb25zKSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gcG87XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93UmVhZCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93Q3JlYXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5hbGxvd0RlbGV0ZSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby52aWV3QWxsUmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpO1xuICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCBwby51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9iamVjdC5pc192aWV3KSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXTtcbiAgICB9XG4gICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgIGlmIChvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXIpIHtcbiAgICAgIHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyO1xuICAgIH1cbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICBcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiXHJcbnN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0Y3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUlxyXG5cdG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXHJcblx0aWYgY3JlYXRvcl9kYl91cmxcclxuXHRcdGlmICFvcGxvZ191cmxcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpXHJcblx0XHRDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7X2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtvcGxvZ1VybDogb3Bsb2dfdXJsfSl9XHJcblxyXG5DcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lID0gKG9iamVjdCktPlxyXG4jXHRpZiBvYmplY3QudGFibGVfbmFtZSAmJiBvYmplY3QudGFibGVfbmFtZS5lbmRzV2l0aChcIl9fY1wiKVxyXG4jXHRcdHJldHVybiBvYmplY3QudGFibGVfbmFtZVxyXG4jXHRlbHNlXHJcbiNcdFx0cmV0dXJuIG9iamVjdC5uYW1lXHJcblx0cmV0dXJuIG9iamVjdC5uYW1lXHJcbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IChvYmplY3QpLT5cclxuXHRjb2xsZWN0aW9uX2tleSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqZWN0KVxyXG5cdGlmIGRiW2NvbGxlY3Rpb25fa2V5XVxyXG5cdFx0cmV0dXJuIGRiW2NvbGxlY3Rpb25fa2V5XVxyXG5cdGVsc2UgaWYgb2JqZWN0LmRiXHJcblx0XHRyZXR1cm4gb2JqZWN0LmRiXHJcblxyXG5cdGlmIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cclxuXHRlbHNlXHJcblx0XHRpZiBvYmplY3QuY3VzdG9tXHJcblx0XHRcdHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpXHJcblx0XHRlbHNlXHJcblx0XHRcdGlmIGNvbGxlY3Rpb25fa2V5ID09ICdfc21zX3F1ZXVlJyAmJiBTTVNRdWV1ZT8uY29sbGVjdGlvblxyXG5cdFx0XHRcdHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uXHJcblx0XHRcdHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5KVxyXG5cclxuXHJcbiIsInZhciBzdGVlZG9zQ29yZTtcblxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJyk7XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRvcl9kYl91cmwsIG9wbG9nX3VybDtcbiAgY3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUjtcbiAgb3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1I7XG4gIGlmIChjcmVhdG9yX2RiX3VybCkge1xuICAgIGlmICghb3Bsb2dfdXJsKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIik7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7XG4gICAgICBfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge1xuICAgICAgICBvcGxvZ1VybDogb3Bsb2dfdXJsXG4gICAgICB9KVxuICAgIH07XG4gIH1cbn0pO1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgY29sbGVjdGlvbl9rZXk7XG4gIGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpO1xuICBpZiAoZGJbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIGRiW2NvbGxlY3Rpb25fa2V5XTtcbiAgfSBlbHNlIGlmIChvYmplY3QuZGIpIHtcbiAgICByZXR1cm4gb2JqZWN0LmRiO1xuICB9XG4gIGlmIChDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0LmN1c3RvbSkge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb2xsZWN0aW9uX2tleSA9PT0gJ19zbXNfcXVldWUnICYmICh0eXBlb2YgU01TUXVldWUgIT09IFwidW5kZWZpbmVkXCIgJiYgU01TUXVldWUgIT09IG51bGwgPyBTTVNRdWV1ZS5jb2xsZWN0aW9uIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm4gU01TUXVldWUuY29sbGVjdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5KTtcbiAgICB9XG4gIH1cbn07XG4iLCJDcmVhdG9yLmFjdGlvbnNCeU5hbWUgPSB7fVxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblxyXG5cdCMg5a6a5LmJ5YWo5bGAIGFjdGlvbnMg5Ye95pWwXHRcclxuXHRDcmVhdG9yLmFjdGlvbnMgPSAoYWN0aW9ucyktPlxyXG5cdFx0Xy5lYWNoIGFjdGlvbnMsICh0b2RvLCBhY3Rpb25fbmFtZSktPlxyXG5cdFx0XHRDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbyBcclxuXHJcblx0Q3JlYXRvci5leGVjdXRlQWN0aW9uID0gKG9iamVjdF9uYW1lLCBhY3Rpb24sIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50LCBsaXN0X3ZpZXdfaWQsIHJlY29yZCktPlxyXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRpZiBhY3Rpb24/LnRvZG9cclxuXHRcdFx0aWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwic3RyaW5nXCJcclxuXHRcdFx0XHR0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXVxyXG5cdFx0XHRlbHNlIGlmIHR5cGVvZiBhY3Rpb24udG9kbyA9PSBcImZ1bmN0aW9uXCJcclxuXHRcdFx0XHR0b2RvID0gYWN0aW9uLnRvZG9cdFxyXG5cdFx0XHRpZiAhcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxyXG5cdFx0XHRcdHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdGlmIHRvZG9cclxuXHRcdFx0XHQjIGl0ZW1fZWxlbWVudOS4uuepuuaXtuW6lOivpeiuvue9rum7mOiupOWAvO+8iOWvueixoeeahG5hbWXlrZfmrrXvvInvvIzlkKbliJltb3JlQXJnc+aLv+WIsOeahOWQjue7reWPguaVsOS9jee9ruWwseS4jeWvuVxyXG5cdFx0XHRcdGl0ZW1fZWxlbWVudCA9IGlmIGl0ZW1fZWxlbWVudCB0aGVuIGl0ZW1fZWxlbWVudCBlbHNlIFwiXCJcclxuXHRcdFx0XHRtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMylcclxuXHRcdFx0XHR0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpXHJcblx0XHRcdFx0dG9kby5hcHBseSB7XHJcblx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdHJlY29yZF9pZDogcmVjb3JkX2lkXHJcblx0XHRcdFx0XHRvYmplY3Q6IG9ialxyXG5cdFx0XHRcdFx0YWN0aW9uOiBhY3Rpb25cclxuXHRcdFx0XHRcdGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50XHJcblx0XHRcdFx0XHRyZWNvcmQ6IHJlY29yZFxyXG5cdFx0XHRcdH0sIHRvZG9BcmdzXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSlcclxuXHRcdGVsc2VcclxuXHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXHJcblxyXG5cdFx0XHRcdFxyXG5cclxuXHRDcmVhdG9yLmFjdGlvbnMgXHJcblx0XHQjIOWcqOatpOWumuS5ieWFqOWxgCBhY3Rpb25zXHJcblx0XHRcInN0YW5kYXJkX3F1ZXJ5XCI6ICgpLT5cclxuXHRcdFx0TW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpXHJcblxyXG5cdFx0XCJzdGFuZGFyZF9uZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxyXG5cdFx0XHRpZHMgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkc1tvYmplY3RfbmFtZV1cclxuXHRcdFx0aWYgaWRzPy5sZW5ndGhcclxuXHRcdFx0XHQjIOWIl+ihqOaciemAieS4remhueaXtu+8jOWPluesrOS4gOS4qumAieS4remhue+8jOWkjeWItuWFtuWGheWuueWIsOaWsOW7uueql+WPo+S4rVxyXG5cdFx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XHJcblx0XHRcdFx0cmVjb3JkX2lkID0gaWRzWzBdXHJcblx0XHRcdFx0ZG9jID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBkb2NcclxuXHRcdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxyXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKVxyXG5cdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxyXG5cdFx0XHRcdCQoXCIuY3JlYXRvci1hZGRcIikuY2xpY2soKVxyXG5cdFx0XHRyZXR1cm4gXHJcblxyXG5cdFx0XCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxyXG5cdFx0XHRocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuXHRcdFx0Rmxvd1JvdXRlci5yZWRpcmVjdChocmVmKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRcInN0YW5kYXJkX2VkaXRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxyXG5cdFx0XHRpZiByZWNvcmRfaWRcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2VcclxuI1x0XHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxyXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHJlY29yZFxyXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdyZWxvYWRfZHhsaXN0JywgZmFsc2VcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcclxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxyXG5cdFx0XHRcdFx0XHQkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxyXG5cdFx0XHRcdFx0aWYgdGhpcy5yZWNvcmRcclxuXHRcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgdGhpcy5yZWNvcmRcclxuXHRcdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cclxuXHRcdFx0XHRcdFx0XHQkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKVxyXG5cclxuXHRcdFwic3RhbmRhcmRfZGVsZXRlXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spLT5cclxuXHRcdFx0Y29uc29sZS5sb2coXCJzdGFuZGFyZF9kZWxldGVcIiwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQpXHJcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cclxuXHRcdFx0aWYoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiByZWNvcmRfdGl0bGU/Lm5hbWUpXHJcblx0XHRcdFx0cmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlPy5uYW1lXHJcblxyXG5cdFx0XHRpZiByZWNvcmRfdGl0bGVcclxuXHRcdFx0XHR0ZXh0ID0gdCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgXCIje29iamVjdC5sYWJlbH0gXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGV4dCA9IHQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCIsIFwiI3tvYmplY3QubGFiZWx9XCJcclxuXHRcdFx0c3dhbFxyXG5cdFx0XHRcdHRpdGxlOiB0IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVcIiwgXCIje29iamVjdC5sYWJlbH1cIlxyXG5cdFx0XHRcdHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+I3t0ZXh0fTwvZGl2PlwiXHJcblx0XHRcdFx0aHRtbDogdHJ1ZVxyXG5cdFx0XHRcdHNob3dDYW5jZWxCdXR0b246dHJ1ZVxyXG5cdFx0XHRcdGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKVxyXG5cdFx0XHRcdGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXHJcblx0XHRcdFx0KG9wdGlvbikgLT5cclxuXHRcdFx0XHRcdGlmIG9wdGlvblxyXG5cdFx0XHRcdFx0XHRDcmVhdG9yLm9kYXRhLmRlbGV0ZSBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAoKS0+XHJcblx0XHRcdFx0XHRcdFx0aWYgcmVjb3JkX3RpdGxlXHJcblx0XHRcdFx0XHRcdFx0XHQjIGluZm8gPSBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCIgKyBcIuW3suWIoOmZpFwiXHJcblx0XHRcdFx0XHRcdFx0XHRpbmZvID10IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVfc3VjXCIsIG9iamVjdC5sYWJlbCArIFwiXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKVxyXG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5zdWNjZXNzIGluZm9cclxuXHRcdFx0XHRcdFx0XHQjIOaWh+S7tueJiOacrOS4ulwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIu+8jOmcgOimgeabv+aNouS4ulwiY2ZzLWZpbGVzLWZpbGVyZWNvcmRcIlxyXG5cdFx0XHRcdFx0XHRcdGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZyxcIi1cIilcclxuXHRcdFx0XHRcdFx0XHRncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcclxuXHRcdFx0XHRcdFx0XHR1bmxlc3MgZ3JpZENvbnRhaW5lcj8ubGVuZ3RoXHJcblx0XHRcdFx0XHRcdFx0XHRpZiB3aW5kb3cub3BlbmVyXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlzT3BlbmVyUmVtb3ZlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGdyaWRDb250YWluZXI/Lmxlbmd0aFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJylcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGR4RGF0YUdyaWRJbnN0YW5jZVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKClcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0VGVtcGxhdGUuY3JlYXRvcl9ncmlkLnJlZnJlc2goZHhEYXRhR3JpZEluc3RhbmNlKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlIG9yICFkeERhdGFHcmlkSW5zdGFuY2VcclxuXHRcdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlXHJcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5jbG9zZSgpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIHJlY29yZF9pZCA9PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSBhbmQgIVN0ZWVkb3MuaXNNb2JpbGUoKSBhbmQgbGlzdF92aWV3X2lkICE9ICdjYWxlbmRhcidcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcclxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpc3Rfdmlld19pZCA9IFwiYWxsXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5nbyBcIi9hcHAvI3thcHBpZH0vI3tvYmplY3RfbmFtZX0vZ3JpZC8je2xpc3Rfdmlld19pZH1cIlxyXG5cdFx0XHRcdFx0XHRcdGlmIGNhbGxfYmFjayBhbmQgdHlwZW9mIGNhbGxfYmFjayA9PSBcImZ1bmN0aW9uXCJcclxuXHRcdFx0XHRcdFx0XHRcdGNhbGxfYmFjaygpXHJcbiIsIkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuYWN0aW9ucyA9IGZ1bmN0aW9uKGFjdGlvbnMpIHtcbiAgICByZXR1cm4gXy5lYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKHRvZG8sIGFjdGlvbl9uYW1lKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbl9uYW1lXSA9IHRvZG87XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IuZXhlY3V0ZUFjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhY3Rpb24sIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50LCBsaXN0X3ZpZXdfaWQsIHJlY29yZCkge1xuICAgIHZhciBtb3JlQXJncywgb2JqLCB0b2RvLCB0b2RvQXJncztcbiAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDApIHtcbiAgICAgIGlmICh0eXBlb2YgYWN0aW9uLnRvZG8gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdG9kbyA9IENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb24udG9kb107XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRvZG8gPSBhY3Rpb24udG9kbztcbiAgICAgIH1cbiAgICAgIGlmICghcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZCkge1xuICAgICAgICByZWNvcmQgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIH1cbiAgICAgIGlmICh0b2RvKSB7XG4gICAgICAgIGl0ZW1fZWxlbWVudCA9IGl0ZW1fZWxlbWVudCA/IGl0ZW1fZWxlbWVudCA6IFwiXCI7XG4gICAgICAgIG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcbiAgICAgICAgdG9kb0FyZ3MgPSBbb2JqZWN0X25hbWUsIHJlY29yZF9pZF0uY29uY2F0KG1vcmVBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRvZG8uYXBwbHkoe1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICByZWNvcmRfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICBvYmplY3Q6IG9iaixcbiAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICBpdGVtX2VsZW1lbnQ6IGl0ZW1fZWxlbWVudCxcbiAgICAgICAgICByZWNvcmQ6IHJlY29yZFxuICAgICAgICB9LCB0b2RvQXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5hY3Rpb25zKHtcbiAgICBcInN0YW5kYXJkX3F1ZXJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfbmV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGRvYywgaWRzO1xuICAgICAgaWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICByZWNvcmRfaWQgPSBpZHNbMF07XG4gICAgICAgIGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBkb2MpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKSk7XG4gICAgICB9XG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBGbG93Um91dGVyLnJlZGlyZWN0KGhyZWYpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9lZGl0XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlKSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9kZWxldGVcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKSB7XG4gICAgICB2YXIgb2JqZWN0LCB0ZXh0O1xuICAgICAgY29uc29sZS5sb2coXCJzdGFuZGFyZF9kZWxldGVcIiwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQpO1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgKHJlY29yZF90aXRsZSAhPSBudWxsID8gcmVjb3JkX3RpdGxlLm5hbWUgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZSAhPSBudWxsID8gcmVjb3JkX3RpdGxlLm5hbWUgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHRleHQgPSB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiLCBvYmplY3QubGFiZWwgKyBcIiBcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgXCJcIiArIG9iamVjdC5sYWJlbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3dhbCh7XG4gICAgICAgIHRpdGxlOiB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVcIiwgXCJcIiArIG9iamVjdC5sYWJlbCksXG4gICAgICAgIHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+XCIgKyB0ZXh0ICsgXCI8L2Rpdj5cIixcbiAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpLFxuICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuICAgICAgfSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5vZGF0YVtcImRlbGV0ZVwiXShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcHBpZCwgZHhEYXRhR3JpZEluc3RhbmNlLCBncmlkQ29udGFpbmVyLCBncmlkT2JqZWN0TmFtZUNsYXNzLCBpbmZvLCBpc09wZW5lclJlbW92ZTtcbiAgICAgICAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgICAgICAgaW5mbyA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgKFwiXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKGluZm8pO1xuICAgICAgICAgICAgZ3JpZE9iamVjdE5hbWVDbGFzcyA9IG9iamVjdF9uYW1lLnJlcGxhY2UoL1xcLi9nLCBcIi1cIik7XG4gICAgICAgICAgICBncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICBpZiAoIShncmlkQ29udGFpbmVyICE9IG51bGwgPyBncmlkQ29udGFpbmVyLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcbiAgICAgICAgICAgICAgICBpc09wZW5lclJlbW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChncmlkQ29udGFpbmVyICE9IG51bGwgPyBncmlkQ29udGFpbmVyLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSB8fCAhZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBsaXN0X3ZpZXdfaWQgIT09ICdjYWxlbmRhcicpIHtcbiAgICAgICAgICAgICAgICBhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICAgICAgICAgICAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgICAgICAgICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgICAgICAgICAgIGxpc3Rfdmlld19pZCA9IFwiYWxsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwL1wiICsgYXBwaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYWxsX2JhY2sgJiYgdHlwZW9mIGNhbGxfYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWxsX2JhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
