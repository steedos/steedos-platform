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
var Promise = Package.promise.Promise;
var HTML = Package.htmljs.HTML;
var meteorInstall = Package.modules.meteorInstall;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:objects":{"core.coffee":function module(){

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

},"loadStandardObjects.coffee":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/loadStandardObjects.coffee                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var e, moleculer, objectql, packageLoader, path, settings, steedosCore;

try {
  if (Meteor.isDevelopment) {
    steedosCore = require('@steedos/core');
    objectql = require('@steedos/objectql');
    moleculer = require("moleculer");
    packageLoader = require('@steedos/service-meteor-package-loader');
    path = require('path');
    settings = {
      built_in_plugins: ["@steedos/workflow", "@steedos/accounts", "@steedos/steedos-plugin-schema-builder", "@steedos/plugin-enterprise", "@steedos/word-template", "@steedos/plugin-qywx", "@steedos/metadata-api", "@steedos/plugin-dingtalk"],
      plugins: []
    };
    Meteor.startup(function () {
      var broker, ex, standardObjectsDir, standardObjectsPackageLoaderService;

      try {
        broker = new moleculer.ServiceBroker({
          namespace: "steedos",
          nodeID: "steedos-creator",
          metadata: {},
          transporter: process.env.TRANSPORTER,
          logLevel: "warn",
          serializer: "JSON",
          requestTimeout: 60 * 1000,
          maxCallLevel: 100,
          heartbeatInterval: 10,
          heartbeatTimeout: 30,
          contextParamsCloning: false,
          tracking: {
            enabled: false,
            shutdownTimeout: 5000
          },
          disableBalancer: false,
          registry: {
            strategy: "RoundRobin",
            preferLocal: true
          },
          bulkhead: {
            enabled: false,
            concurrency: 10,
            maxQueueSize: 100
          },
          validator: true,
          errorHandler: null,
          tracing: {
            enabled: false,
            exporter: {
              type: "Console",
              options: {
                logger: null,
                colors: true,
                width: 100,
                gaugeWidth: 40
              }
            }
          }
        });
        objectql.getSteedosSchema(broker);
        standardObjectsDir = objectql.StandardObjectsPath;
        standardObjectsPackageLoaderService = broker.createService({
          name: 'standard-objects',
          mixins: [packageLoader],
          settings: {
            packageInfo: {
              path: standardObjectsDir
            }
          }
        });
        return Meteor.wrapAsync(function (cb) {
          return broker.start().then(function () {
            if (!broker.started) {
              broker._restartService(standardObjectsPackageLoaderService);
            }

            return broker.waitForServices(standardObjectsPackageLoaderService.name).then(function (resolve, reject) {
              return steedosCore.init.call(settings).then(function () {
                return cb(reject, resolve);
              });
            });
          });
        })();
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

},"coreSupport.coffee":function module(require){

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

},"server":{"methods":{"object_options.coffee":function module(){

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

}},"routes":{"api_workflow_view_instance.coffee":function module(){

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

}}},"lib":{"listviews.coffee":function module(){

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
    _object = Creator.getObject(object_name);

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

},"add_simple_schema_validation_error.coffee":function module(){

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

},"field_simple_schema_validation_error.coffee":function module(){

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

},"eval.js":function module(){

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

},"convert.coffee":function module(){

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

},"formular.coffee":function module(){

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

},"object.coffee":function module(require){

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
  self.version = options.version || 1.0;

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

},"fields.coffee":function module(){

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

},"triggers.coffee":function module(){

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

},"permission_sets.coffee":function module(require){

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

},"collections.coffee":function module(require){

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

},"actions.coffee":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/actions.coffee                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var steedosFilters;
Creator.actionsByName = {};

if (Meteor.isClient) {
  steedosFilters = require("@steedos/filters");

  Creator.actions = function (actions) {
    return _.each(actions, function (todo, action_name) {
      return Creator.actionsByName[action_name] = todo;
    });
  };

  Creator.executeAction = function (object_name, action, record_id, item_element, list_view_id, record) {
    var filters, moreArgs, obj, todo, todoArgs, url;

    if (action && action.type === 'word-print') {
      if (record_id) {
        filters = ['_id', '=', record_id];
      } else {
        filters = ObjectGrid.getFilters(object_name, list_view_id, false, null, null);
      }

      url = "/api/v4/word_templates/" + action.word_template + "/print" + "?filters=" + steedosFilters.formatFiltersToODataQuery(filters);
      url = Steedos.absoluteUrl(url);
      return window.open(url);
    }

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
      var initialValues, object, selectedRows;
      object = Creator.getObject(object_name);
      initialValues = {};
      selectedRows = window.gridRef.current.api.getSelectedRows();

      if (selectedRows != null ? selectedRows.length : void 0) {
        record_id = selectedRows[0]._id;

        if (record_id) {
          initialValues = Creator.odata.get(object_name, record_id);
        }
      } else {
        initialValues = FormManager.getInitialValues(object_name);
      }

      if ((object != null ? object.version : void 0) >= 2) {
        return SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
          name: object_name + "_standard_new_form",
          objectApiName: object_name,
          title: '新建',
          initialValues: initialValues,
          afterInsert: function (result) {
            var record;

            if (result.length > 0) {
              record = result[0];
              setTimeout(function () {
                var app_id, url;
                app_id = Session.get("app_id");
                url = "/app/" + app_id + "/" + object_name + "/view/" + record._id;
                return FlowRouter.go(url);
              }, 1);
              return true;
            }
          }
        }, null, {
          iconPath: '/assets/icons'
        });
      }

      Session.set('action_object_name', object_name);

      if (selectedRows != null ? selectedRows.length : void 0) {
        Session.set('cmDoc', initialValues);
        Session.set('cmShowAgainDuplicated', true);
      } else {
        Session.set('cmDoc', initialValues);
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
      var object;

      if (record_id) {
        object = Creator.getObject(object_name);

        if ((object != null ? object.version : void 0) >= 2) {
          return SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
            name: object_name + "_standard_edit_form",
            objectApiName: object_name,
            recordId: record_id,
            title: '编辑',
            afterUpdate: function () {
              setTimeout(function () {
                if (FlowRouter.current().route.path.endsWith("/:record_id")) {
                  return FlowRouter.reload();
                } else {
                  return window.gridRef.current.api.refreshServerSideStore();
                }
              }, 1);
              return true;
            }
          }, null, {
            iconPath: '/assets/icons'
          });
        }

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
            var _e, appid, dxDataGridInstance, gridContainer, gridObjectNameClass, info, isOpenerRemove, recordUrl, tempNavRemoved;

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

            try {
              if (FlowRouter.current().route.path.endsWith("/:record_id")) {
                if (object_name !== Session.get("object_name")) {
                  FlowRouter.reload();
                }
              } else {
                window.gridRef.current.api.refreshServerSideStore();
              }
            } catch (error1) {
              _e = error1;
              console.error(_e);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiZSIsIm1vbGVjdWxlciIsIm9iamVjdHFsIiwicGFja2FnZUxvYWRlciIsInBhdGgiLCJzZXR0aW5ncyIsInN0ZWVkb3NDb3JlIiwiTWV0ZW9yIiwiaXNEZXZlbG9wbWVudCIsInJlcXVpcmUiLCJidWlsdF9pbl9wbHVnaW5zIiwicGx1Z2lucyIsInN0YXJ0dXAiLCJicm9rZXIiLCJleCIsInN0YW5kYXJkT2JqZWN0c0RpciIsInN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlIiwiU2VydmljZUJyb2tlciIsIm5hbWVzcGFjZSIsIm5vZGVJRCIsIm1ldGFkYXRhIiwidHJhbnNwb3J0ZXIiLCJwcm9jZXNzIiwiZW52IiwiVFJBTlNQT1JURVIiLCJsb2dMZXZlbCIsInNlcmlhbGl6ZXIiLCJyZXF1ZXN0VGltZW91dCIsIm1heENhbGxMZXZlbCIsImhlYXJ0YmVhdEludGVydmFsIiwiaGVhcnRiZWF0VGltZW91dCIsImNvbnRleHRQYXJhbXNDbG9uaW5nIiwidHJhY2tpbmciLCJlbmFibGVkIiwic2h1dGRvd25UaW1lb3V0IiwiZGlzYWJsZUJhbGFuY2VyIiwicmVnaXN0cnkiLCJzdHJhdGVneSIsInByZWZlckxvY2FsIiwiYnVsa2hlYWQiLCJjb25jdXJyZW5jeSIsIm1heFF1ZXVlU2l6ZSIsInZhbGlkYXRvciIsImVycm9ySGFuZGxlciIsInRyYWNpbmciLCJleHBvcnRlciIsInR5cGUiLCJvcHRpb25zIiwibG9nZ2VyIiwiY29sb3JzIiwid2lkdGgiLCJnYXVnZVdpZHRoIiwiZ2V0U3RlZWRvc1NjaGVtYSIsIlN0YW5kYXJkT2JqZWN0c1BhdGgiLCJjcmVhdGVTZXJ2aWNlIiwibmFtZSIsIm1peGlucyIsInBhY2thZ2VJbmZvIiwid3JhcEFzeW5jIiwiY2IiLCJzdGFydCIsInRoZW4iLCJzdGFydGVkIiwiX3Jlc3RhcnRTZXJ2aWNlIiwid2FpdEZvclNlcnZpY2VzIiwicmVzb2x2ZSIsInJlamVjdCIsImluaXQiLCJjYWxsIiwiZXJyb3IiLCJjb25zb2xlIiwiRmliZXIiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJsaXN0X3ZpZXdzIiwic3BhY2UiLCJnZXRDb2xsZWN0aW9uTmFtZSIsIl8iLCJjbG9uZSIsImNvbnZlcnRPYmplY3QiLCJPYmplY3QiLCJpbml0VHJpZ2dlcnMiLCJpbml0TGlzdFZpZXdzIiwiZ2V0T2JqZWN0TmFtZSIsImdldE9iamVjdCIsInNwYWNlX2lkIiwicmVmIiwicmVmMSIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJvYmplY3RzQnlOYW1lIiwiZ2V0T2JqZWN0QnlJZCIsIm9iamVjdF9pZCIsImZpbmRXaGVyZSIsIl9pZCIsInJlbW92ZU9iamVjdCIsImxvZyIsImdldENvbGxlY3Rpb24iLCJzcGFjZUlkIiwiX2NvbGxlY3Rpb25fbmFtZSIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiZmllbGRzIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsImlzU3RyaW5nIiwiRm9ybXVsYXIiLCJjaGVja0Zvcm11bGEiLCJldmFsdWF0ZUZpbHRlcnMiLCJmaWx0ZXJzIiwic2VsZWN0b3IiLCJlYWNoIiwiZmlsdGVyIiwiYWN0aW9uIiwidmFsdWUiLCJsZW5ndGgiLCJpc0NvbW1vblNwYWNlIiwiZ2V0T3JkZXJseVNldEJ5SWRzIiwiZG9jcyIsImlkcyIsImlkX2tleSIsImhpdF9maXJzdCIsInZhbHVlcyIsImdldFByb3BlcnR5Iiwic29ydEJ5IiwiZG9jIiwiX2luZGV4Iiwic29ydGluZ01ldGhvZCIsInZhbHVlMSIsInZhbHVlMiIsImlzVmFsdWUxRW1wdHkiLCJpc1ZhbHVlMkVtcHR5IiwibG9jYWxlIiwia2V5IiwiRGF0ZSIsImdldFRpbWUiLCJTdGVlZG9zIiwidG9TdHJpbmciLCJsb2NhbGVDb21wYXJlIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfb2JqZWN0IiwicGVybWlzc2lvbnMiLCJyZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0TWFwIiwicmVsYXRlZF9vYmplY3RzIiwiaXNFbXB0eSIsIm9iak5hbWUiLCJpc09iamVjdCIsIm9iamVjdE5hbWUiLCJyZWxhdGVkX29iamVjdCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwicmVmZXJlbmNlX3RvIiwiZm9yZWlnbl9rZXkiLCJ3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCIsImVuYWJsZU9iak5hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJlbmFibGVfZmlsZXMiLCJwdXNoIiwic3BsaWNlIiwiZW5hYmxlX3Rhc2tzIiwiZW5hYmxlX25vdGVzIiwiZW5hYmxlX2V2ZW50cyIsImVuYWJsZV9pbnN0YW5jZXMiLCJlbmFibGVfYXBwcm92YWxzIiwiZW5hYmxlX3Byb2Nlc3MiLCJnZXRVc2VyQ29udGV4dCIsImlzVW5TYWZlTW9kZSIsIlVTRVJfQ09OVEVYVCIsInNwYWNlX3VzZXJfb3JnIiwic3UiLCJzdUZpZWxkcyIsIkVycm9yIiwibW9iaWxlIiwicG9zaXRpb24iLCJlbWFpbCIsImNvbXBhbnkiLCJvcmdhbml6YXRpb24iLCJjb21wYW55X2lkIiwiY29tcGFueV9pZHMiLCJ1c2VyIiwiZnVsbG5hbWUiLCJnZXRSZWxhdGl2ZVVybCIsInVybCIsImlzRnVuY3Rpb24iLCJpc0NvcmRvdmEiLCJzdGFydHNXaXRoIiwidGVzdCIsIl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18iLCJST09UX1VSTF9QQVRIX1BSRUZJWCIsImdldFVzZXJDb21wYW55SWQiLCJnZXRVc2VyQ29tcGFueUlkcyIsInByb2Nlc3NQZXJtaXNzaW9ucyIsInBvIiwiYWxsb3dDcmVhdGUiLCJhbGxvd1JlYWQiLCJhbGxvd0VkaXQiLCJhbGxvd0RlbGV0ZSIsInZpZXdBbGxSZWNvcmRzIiwidmlld0NvbXBhbnlSZWNvcmRzIiwibW9kaWZ5Q29tcGFueVJlY29yZHMiLCJnZXRUZW1wbGF0ZVNwYWNlSWQiLCJ0ZW1wbGF0ZVNwYWNlSWQiLCJnZXRDbG91ZEFkbWluU3BhY2VJZCIsImNsb3VkQWRtaW5TcGFjZUlkIiwiaXNUZW1wbGF0ZVNwYWNlIiwiaXNDbG91ZEFkbWluU3BhY2UiLCJzdGVlZG9zU3RvcmFnZURpciIsIlNURUVET1NfU1RPUkFHRV9ESVIiLCJtZXRob2RzIiwiY29sbGVjdGlvbiIsIm5hbWVfZmllbGRfa2V5Iiwib3B0aW9uc19saW1pdCIsInF1ZXJ5IiwicXVlcnlfb3B0aW9ucyIsInJlY29yZHMiLCJyZXN1bHRzIiwic2VhcmNoVGV4dFF1ZXJ5Iiwic2VsZWN0ZWQiLCJzb3J0IiwicGFyYW1zIiwiTkFNRV9GSUVMRF9LRVkiLCJzZWFyY2hUZXh0IiwiJHJlZ2V4IiwiJG9yIiwiJGluIiwiZXh0ZW5kIiwiJG5pbiIsImZpbHRlclF1ZXJ5IiwibGltaXQiLCJmaW5kIiwiZmV0Y2giLCJyZWNvcmQiLCJsYWJlbCIsIm1lc3NhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiSnNvblJvdXRlcyIsImFkZCIsInJlcSIsInJlcyIsIm5leHQiLCJib3giLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImZsb3dJZCIsImhhc2hEYXRhIiwiaW5zIiwiaW5zSWQiLCJyZWNvcmRfaWQiLCJyZWRpcmVjdF91cmwiLCJyZWYyIiwicmVmMyIsInJlZjQiLCJ3b3JrZmxvd1VybCIsInhfYXV0aF90b2tlbiIsInhfdXNlcl9pZCIsInV1Zmxvd01hbmFnZXIiLCJjaGVja19hdXRob3JpemF0aW9uIiwiYm9keSIsImNoZWNrIiwiaW5zdGFuY2VJZCIsImZsb3ciLCJpbmJveF91c2VycyIsImluY2x1ZGVzIiwiY2NfdXNlcnMiLCJvdXRib3hfdXNlcnMiLCJzdGF0ZSIsInN1Ym1pdHRlciIsImFwcGxpY2FudCIsInBlcm1pc3Npb25NYW5hZ2VyIiwiZ2V0Rmxvd1Blcm1pc3Npb25zIiwic3BhY2VzIiwid2Vic2VydmljZXMiLCJ3b3JrZmxvdyIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsInVwZGF0ZSIsIiR1bnNldCIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsInJlYXNvbiIsImdldEluaXRXaWR0aFBlcmNlbnQiLCJjb2x1bW5zIiwiX3NjaGVtYSIsImNvbHVtbl9udW0iLCJpbml0X3dpZHRoX3BlcmNlbnQiLCJnZXRTY2hlbWEiLCJmaWVsZF9uYW1lIiwiZmllbGQiLCJpc193aWRlIiwicGljayIsImF1dG9mb3JtIiwiZ2V0RmllbGRJc1dpZGUiLCJnZXRUYWJ1bGFyT3JkZXIiLCJsaXN0X3ZpZXdfaWQiLCJzZXR0aW5nIiwibWFwIiwiY29sdW1uIiwiaGlkZGVuIiwiY29tcGFjdCIsIm9yZGVyIiwiaW5kZXgiLCJkZWZhdWx0X2V4dHJhX2NvbHVtbnMiLCJleHRyYV9jb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zIiwidW5pb24iLCJnZXRPYmplY3REZWZhdWx0U29ydCIsIlRhYnVsYXJTZWxlY3RlZElkcyIsImNvbnZlcnRMaXN0VmlldyIsImRlZmF1bHRfdmlldyIsImxpc3RfdmlldyIsImxpc3Rfdmlld19uYW1lIiwiZGVmYXVsdF9jb2x1bW5zIiwiZGVmYXVsdF9tb2JpbGVfY29sdW1ucyIsIm9pdGVtIiwibW9iaWxlX2NvbHVtbnMiLCJoYXMiLCJpbmNsdWRlIiwiZmlsdGVyX3Njb3BlIiwicGFyc2UiLCJmb3JFYWNoIiwiX3ZhbHVlIiwiZ2V0UmVsYXRlZExpc3QiLCJsaXN0IiwibWFwTGlzdCIsInJlbGF0ZWRMaXN0TmFtZXMiLCJyZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInVucmVsYXRlZF9vYmplY3RzIiwib2JqT3JOYW1lIiwicmVsYXRlZCIsImlzX2ZpbGUiLCJjdXN0b21SZWxhdGVkTGlzdE9iamVjdCIsImFjdGlvbnMiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRfb2JqZWN0X2l0ZW0iLCJyZWxhdGVkT2JqZWN0IiwidGFidWxhcl9vcmRlciIsIndpdGhvdXQiLCJ0cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyIiwicmVwbGFjZSIsInBsdWNrIiwiZGlmZmVyZW5jZSIsInYiLCJpc0FjdGl2ZSIsIml0ZW0iLCJhbGxvd19yZWxhdGVkTGlzdCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJmaXJzdCIsImdldExpc3RWaWV3cyIsImdldExpc3RWaWV3IiwiZXhhYyIsImxpc3RWaWV3cyIsImdldExpc3RWaWV3SXNSZWNlbnQiLCJsaXN0VmlldyIsInBpY2tPYmplY3RNb2JpbGVDb2x1bW5zIiwiY291bnQiLCJnZXRGaWVsZCIsImlzTmFtZUNvbHVtbiIsIml0ZW1Db3VudCIsIm1heENvdW50IiwibWF4Um93cyIsIm5hbWVDb2x1bW4iLCJuYW1lS2V5IiwicmVzdWx0IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJSZWdFeHAiLCJfcmVnRXhNZXNzYWdlcyIsIl9nbG9iYWxNZXNzYWdlcyIsInJlZ0V4IiwiZXhwIiwibXNnIiwibWVzc2FnZXMiLCJldmFsSW5Db250ZXh0IiwianMiLCJldmFsIiwiY29udmVydEZpZWxkIiwiZ2V0T3B0aW9uIiwib3B0aW9uIiwiZm9vIiwic3BsaXQiLCJjb2xvciIsImFsbE9wdGlvbnMiLCJwaWNrbGlzdCIsInBpY2tsaXN0T3B0aW9ucyIsImdldFBpY2tsaXN0IiwiZ2V0UGlja0xpc3RPcHRpb25zIiwicmV2ZXJzZSIsImVuYWJsZSIsImRlZmF1bHRWYWx1ZSIsInRyaWdnZXJzIiwidHJpZ2dlciIsIl90b2RvIiwiX3RvZG9fZnJvbV9jb2RlIiwiX3RvZG9fZnJvbV9kYiIsIm9uIiwidG9kbyIsIl92aXNpYmxlIiwiZXJyb3IxIiwiYWN0aW9uc0J5TmFtZSIsInZpc2libGUiLCJfb3B0aW9ucyIsIl90eXBlIiwiYmVmb3JlT3BlbkZ1bmN0aW9uIiwiaXNfY29tcGFueV9saW1pdGVkIiwibWF4IiwibWluIiwiX29wdGlvbiIsImsiLCJfcmVnRXgiLCJfbWluIiwiX21heCIsIk51bWJlciIsIkJvb2xlYW4iLCJfb3B0aW9uc0Z1bmN0aW9uIiwiX3JlZmVyZW5jZV90byIsIl9jcmVhdGVGdW5jdGlvbiIsIl9iZWZvcmVPcGVuRnVuY3Rpb24iLCJfZmlsdGVyc0Z1bmN0aW9uIiwiX2RlZmF1bHRWYWx1ZSIsIl9pc19jb21wYW55X2xpbWl0ZWQiLCJfZmlsdGVycyIsImlzRGF0ZSIsInBvcCIsIl9pc19kYXRlIiwiZm9ybSIsInZhbCIsInJlbGF0ZWRPYmpJbmZvIiwiUFJFRklYIiwiX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhIiwicHJlZml4IiwiZmllbGRWYXJpYWJsZSIsInJlZyIsInJldiIsIm0iLCIkMSIsImZvcm11bGFfc3RyIiwiX0NPTlRFWFQiLCJfVkFMVUVTIiwiaXNCb29sZWFuIiwidG9hc3RyIiwiZm9ybWF0T2JqZWN0TmFtZSIsIl9iYXNlT2JqZWN0IiwiX2RiIiwiZGVmYXVsdExpc3RWaWV3SWQiLCJkaXNhYmxlZF9saXN0X3ZpZXdzIiwic2NoZW1hIiwic2VsZiIsImJhc2VPYmplY3QiLCJwZXJtaXNzaW9uX3NldCIsImljb24iLCJkZXNjcmlwdGlvbiIsImlzX3ZpZXciLCJ2ZXJzaW9uIiwiaXNfZW5hYmxlIiwiYWxsb3dfY3VzdG9tQWN0aW9ucyIsImV4Y2x1ZGVfYWN0aW9ucyIsImVuYWJsZV9zZWFyY2giLCJwYWdpbmciLCJlbmFibGVfYXBpIiwiY3VzdG9tIiwiZW5hYmxlX3NoYXJlIiwiZW5hYmxlX3RyZWUiLCJzaWRlYmFyIiwib3Blbl93aW5kb3ciLCJmaWx0ZXJfY29tcGFueSIsImNhbGVuZGFyIiwiZW5hYmxlX2NoYXR0ZXIiLCJlbmFibGVfdHJhc2giLCJlbmFibGVfc3BhY2VfZ2xvYmFsIiwiZW5hYmxlX2ZvbGxvdyIsImVuYWJsZV93b3JrZmxvdyIsImVuYWJsZV9pbmxpbmVfZWRpdCIsImRldGFpbHMiLCJtYXN0ZXJzIiwibG9va3VwX2RldGFpbHMiLCJpbl9kZXZlbG9wbWVudCIsImlkRmllbGROYW1lIiwiZGF0YWJhc2VfbmFtZSIsImlzX25hbWUiLCJwcmltYXJ5IiwiZmlsdGVyYWJsZSIsInJlYWRvbmx5IiwiaXRlbV9uYW1lIiwiY29weUl0ZW0iLCJhZG1pbiIsImFsbCIsImxpc3Rfdmlld19pdGVtIiwiUmVhY3RpdmVWYXIiLCJjcmVhdGVDb2xsZWN0aW9uIiwiX25hbWUiLCJnZXRPYmplY3RTY2hlbWEiLCJjb250YWlucyIsImF0dGFjaFNjaGVtYSIsIl9zaW1wbGVTY2hlbWEiLCJnZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCIsImJvb3RzdHJhcExvYWRlZCIsImZpZWxkc0FyciIsIl9yZWZfb2JqIiwiYXV0b2Zvcm1fdHlwZSIsImZzIiwiaXNVbkxpbWl0ZWQiLCJtdWx0aXBsZSIsInJvd3MiLCJsYW5ndWFnZSIsImlzTW9iaWxlIiwiaXNQYWQiLCJpc2lPUyIsImFmRmllbGRJbnB1dCIsInRpbWV6b25lSWQiLCJkeERhdGVCb3hPcHRpb25zIiwiZGlzcGxheUZvcm1hdCIsInBpY2tlclR5cGUiLCJkYXRlTW9iaWxlT3B0aW9ucyIsIm91dEZvcm1hdCIsImhlaWdodCIsImRpYWxvZ3NJbkJvZHkiLCJ0b29sYmFyIiwiZm9udE5hbWVzIiwibGFuZyIsInNob3dJY29uIiwiZGVwZW5kT24iLCJkZXBlbmRfb24iLCJjcmVhdGUiLCJsb29rdXBfZmllbGQiLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJvcGVyYXRpb24iLCJvblN1Y2Nlc3MiLCJhZGRJdGVtcyIsInJlZmVyZW5jZV9zb3J0Iiwib3B0aW9uc1NvcnQiLCJyZWZlcmVuY2VfbGltaXQiLCJvcHRpb25zTGltaXQiLCJvbWl0IiwiYmxhY2tib3giLCJvYmplY3RTd2l0Y2hlIiwib3B0aW9uc01ldGhvZCIsIm9wdGlvbnNNZXRob2RQYXJhbXMiLCJyZWZlcmVuY2VzIiwiX3JlZmVyZW5jZSIsImxpbmsiLCJkZWZhdWx0SWNvbiIsImZpcnN0T3B0aW9uIiwicHJlY2lzaW9uIiwic2NhbGUiLCJkZWNpbWFsIiwiZGlzYWJsZWQiLCJBcnJheSIsImVkaXRhYmxlIiwiYWNjZXB0Iiwic3lzdGVtIiwiRW1haWwiLCJhc3NpZ24iLCJkYXRhX3R5cGUiLCJpc051bWJlciIsInJlcXVpcmVkIiwib3B0aW9uYWwiLCJ1bmlxdWUiLCJncm91cCIsInNlYXJjaGFibGUiLCJub3ciLCJpbmxpbmVIZWxwVGV4dCIsImlzUHJvZHVjdGlvbiIsInNvcnRhYmxlIiwiZ2V0RmllbGREaXNwbGF5VmFsdWUiLCJmaWVsZF92YWx1ZSIsImh0bWwiLCJtb21lbnQiLCJmb3JtYXQiLCJjaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkiLCJmaWVsZF90eXBlIiwicHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzIiwib3BlcmF0aW9ucyIsImJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyIsImJ1aWx0aW5JdGVtIiwiaXNfY2hlY2tfb25seSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24iLCJiZXR3ZWVuQnVpbHRpblZhbHVlcyIsImdldFF1YXJ0ZXJTdGFydE1vbnRoIiwibW9udGgiLCJnZXRNb250aCIsImdldExhc3RRdWFydGVyRmlyc3REYXkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJnZXROZXh0UXVhcnRlckZpcnN0RGF5IiwiZ2V0TW9udGhEYXlzIiwiZGF5cyIsImVuZERhdGUiLCJtaWxsaXNlY29uZCIsInN0YXJ0RGF0ZSIsImdldExhc3RNb250aEZpcnN0RGF5IiwiY3VycmVudE1vbnRoIiwiY3VycmVudFllYXIiLCJlbmRWYWx1ZSIsImZpcnN0RGF5IiwibGFzdERheSIsImxhc3RNb25kYXkiLCJsYXN0TW9udGhGaW5hbERheSIsImxhc3RNb250aEZpcnN0RGF5IiwibGFzdFF1YXJ0ZXJFbmREYXkiLCJsYXN0UXVhcnRlclN0YXJ0RGF5IiwibGFzdFN1bmRheSIsImxhc3RfMTIwX2RheXMiLCJsYXN0XzMwX2RheXMiLCJsYXN0XzYwX2RheXMiLCJsYXN0XzdfZGF5cyIsImxhc3RfOTBfZGF5cyIsIm1pbnVzRGF5IiwibW9uZGF5IiwibmV4dE1vbmRheSIsIm5leHRNb250aEZpbmFsRGF5IiwibmV4dE1vbnRoRmlyc3REYXkiLCJuZXh0UXVhcnRlckVuZERheSIsIm5leHRRdWFydGVyU3RhcnREYXkiLCJuZXh0U3VuZGF5IiwibmV4dFllYXIiLCJuZXh0XzEyMF9kYXlzIiwibmV4dF8zMF9kYXlzIiwibmV4dF82MF9kYXlzIiwibmV4dF83X2RheXMiLCJuZXh0XzkwX2RheXMiLCJwcmV2aW91c1llYXIiLCJzdGFydFZhbHVlIiwic3RyRW5kRGF5Iiwic3RyRmlyc3REYXkiLCJzdHJMYXN0RGF5Iiwic3RyTW9uZGF5Iiwic3RyU3RhcnREYXkiLCJzdHJTdW5kYXkiLCJzdHJUb2RheSIsInN0clRvbW9ycm93Iiwic3RyWWVzdGRheSIsInN1bmRheSIsInRoaXNRdWFydGVyRW5kRGF5IiwidGhpc1F1YXJ0ZXJTdGFydERheSIsInRvbW9ycm93Iiwid2VlayIsInllc3RkYXkiLCJnZXREYXkiLCJ0IiwiZnYiLCJzZXRIb3VycyIsImdldEhvdXJzIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJnZXRGaWVsZERlZmF1bHRPcGVyYXRpb24iLCJnZXRGaWVsZE9wZXJhdGlvbiIsIm9wdGlvbmFscyIsImVxdWFsIiwidW5lcXVhbCIsImxlc3NfdGhhbiIsImdyZWF0ZXJfdGhhbiIsImxlc3Nfb3JfZXF1YWwiLCJncmVhdGVyX29yX2VxdWFsIiwibm90X2NvbnRhaW4iLCJzdGFydHNfd2l0aCIsImJldHdlZW4iLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiZmllbGRzTmFtZSIsInNvcnRfbm8iLCJjbGVhblRyaWdnZXIiLCJpbml0VHJpZ2dlciIsIl90cmlnZ2VyX2hvb2tzIiwicmVmNSIsInRvZG9XcmFwcGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJ3aGVuIiwiYmVmb3JlIiwiaW5zZXJ0IiwicmVtb3ZlIiwiYWZ0ZXIiLCJfaG9vayIsInRyaWdnZXJfbmFtZSIsIl90cmlnZ2VyX2hvb2siLCJmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0IiwiZmluZF9wZXJtaXNzaW9uX29iamVjdCIsImludGVyc2VjdGlvblBsdXMiLCJ1bmlvblBlcm1pc3Npb25PYmplY3RzIiwidW5pb25QbHVzIiwiZ2V0T2JqZWN0UGVybWlzc2lvbnMiLCJnZXRSZWNvcmRQZXJtaXNzaW9ucyIsImlzT3duZXIiLCJvYmplY3RfZmllbGRzX2tleXMiLCJyZWNvcmRfY29tcGFueV9pZCIsInJlY29yZF9jb21wYW55X2lkcyIsInNlbGVjdCIsInVzZXJfY29tcGFueV9pZHMiLCJwYXJlbnQiLCJrZXlzIiwiaW50ZXJzZWN0aW9uIiwiZ2V0T2JqZWN0UmVjb3JkIiwiam9pbiIsInJlY29yZF9wZXJtaXNzaW9ucyIsIm93bmVyIiwibiIsImxvY2tlZCIsImdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMiLCJjdXJyZW50T2JqZWN0TmFtZSIsInJlbGF0ZWRMaXN0SXRlbSIsImN1cnJlbnRSZWNvcmQiLCJpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUiLCJtYXN0ZXJBbGxvdyIsIm1hc3RlclJlY29yZFBlcm0iLCJyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMiLCJ1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCIsImdldFJlY29yZFNhZmVSZWxhdGVkTGlzdCIsImdldEFsbFBlcm1pc3Npb25zIiwiX2kiLCJwc2V0cyIsInBzZXRzQWRtaW4iLCJwc2V0c0FkbWluX3BvcyIsInBzZXRzQ3VycmVudCIsInBzZXRzQ3VycmVudE5hbWVzIiwicHNldHNDdXJyZW50X3BvcyIsInBzZXRzQ3VzdG9tZXIiLCJwc2V0c0N1c3RvbWVyX3BvcyIsInBzZXRzR3Vlc3QiLCJwc2V0c0d1ZXN0X3BvcyIsInBzZXRzTWVtYmVyIiwicHNldHNNZW1iZXJfcG9zIiwicHNldHNTdXBwbGllciIsInBzZXRzU3VwcGxpZXJfcG9zIiwicHNldHNVc2VyIiwicHNldHNVc2VyX3BvcyIsInNldF9pZHMiLCJzcGFjZVVzZXIiLCJvYmplY3RzIiwiYXNzaWduZWRfYXBwcyIsInByb2ZpbGUiLCJ1c2VycyIsInBlcm1pc3Npb25fc2V0X2lkIiwiY3JlYXRlZCIsIm1vZGlmaWVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwiZ2V0QXNzaWduZWRBcHBzIiwiYmluZCIsImFzc2lnbmVkX21lbnVzIiwiZ2V0QXNzaWduZWRNZW51cyIsInVzZXJfcGVybWlzc2lvbl9zZXRzIiwiYXJyYXkiLCJvdGhlciIsImFwcHMiLCJwc2V0QmFzZSIsInVzZXJQcm9maWxlIiwicHNldCIsInVuaXEiLCJhYm91dE1lbnUiLCJhZG1pbk1lbnVzIiwiYWxsTWVudXMiLCJjdXJyZW50UHNldE5hbWVzIiwibWVudXMiLCJvdGhlck1lbnVBcHBzIiwib3RoZXJNZW51cyIsImFkbWluX21lbnVzIiwiZmxhdHRlbiIsIm1lbnUiLCJwc2V0c01lbnUiLCJwZXJtaXNzaW9uX3NldHMiLCJwZXJtaXNzaW9uX29iamVjdHMiLCJpc051bGwiLCJwZXJtaXNzaW9uX3NldF9pZHMiLCJwb3MiLCJvcHMiLCJvcHNfa2V5IiwiY3VycmVudFBzZXQiLCJ0ZW1wT3BzIiwicmVwZWF0SW5kZXgiLCJyZXBlYXRQbyIsIm9wc2V0QWRtaW4iLCJvcHNldEN1c3RvbWVyIiwib3BzZXRHdWVzdCIsIm9wc2V0TWVtYmVyIiwib3BzZXRTdXBwbGllciIsIm9wc2V0VXNlciIsInBvc0FkbWluIiwicG9zQ3VzdG9tZXIiLCJwb3NHdWVzdCIsInBvc01lbWJlciIsInBvc1N1cHBsaWVyIiwicG9zVXNlciIsInByb2YiLCJndWVzdCIsIm1lbWJlciIsInN1cHBsaWVyIiwiY3VzdG9tZXIiLCJkaXNhYmxlZF9hY3Rpb25zIiwidW5yZWFkYWJsZV9maWVsZHMiLCJ1bmVkaXRhYmxlX2ZpZWxkcyIsImNyZWF0b3JfZGJfdXJsIiwib3Bsb2dfdXJsIiwiTU9OR09fVVJMX0NSRUFUT1IiLCJNT05HT19PUExPR19VUkxfQ1JFQVRPUiIsIl9DUkVBVE9SX0RBVEFTT1VSQ0UiLCJfZHJpdmVyIiwiTW9uZ29JbnRlcm5hbHMiLCJSZW1vdGVDb2xsZWN0aW9uRHJpdmVyIiwib3Bsb2dVcmwiLCJjb2xsZWN0aW9uX2tleSIsIm5ld0NvbGxlY3Rpb24iLCJTTVNRdWV1ZSIsInN0ZWVkb3NGaWx0ZXJzIiwiYWN0aW9uX25hbWUiLCJleGVjdXRlQWN0aW9uIiwiaXRlbV9lbGVtZW50IiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIk9iamVjdEdyaWQiLCJnZXRGaWx0ZXJzIiwid29yZF90ZW1wbGF0ZSIsImZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkiLCJhYnNvbHV0ZVVybCIsIndpbmRvdyIsIm9wZW4iLCJvZGF0YSIsInByb3RvdHlwZSIsInNsaWNlIiwiY29uY2F0Iiwid2FybmluZyIsImluaXRpYWxWYWx1ZXMiLCJzZWxlY3RlZFJvd3MiLCJncmlkUmVmIiwiY3VycmVudCIsImFwaSIsImdldFNlbGVjdGVkUm93cyIsIkZvcm1NYW5hZ2VyIiwiZ2V0SW5pdGlhbFZhbHVlcyIsIlN0ZWVkb3NVSSIsInNob3dNb2RhbCIsInN0b3JlcyIsIkNvbXBvbmVudFJlZ2lzdHJ5IiwiY29tcG9uZW50cyIsIk9iamVjdEZvcm0iLCJvYmplY3RBcGlOYW1lIiwidGl0bGUiLCJhZnRlckluc2VydCIsInNldFRpbWVvdXQiLCJhcHBfaWQiLCJGbG93Um91dGVyIiwiZ28iLCJpY29uUGF0aCIsInNldCIsImRlZmVyIiwiJCIsImNsaWNrIiwiaHJlZiIsImdldE9iamVjdFVybCIsInJlZGlyZWN0IiwicmVjb3JkSWQiLCJhZnRlclVwZGF0ZSIsInJvdXRlIiwiZW5kc1dpdGgiLCJyZWxvYWQiLCJyZWZyZXNoU2VydmVyU2lkZVN0b3JlIiwicmVjb3JkX3RpdGxlIiwiY2FsbF9iYWNrIiwiYmVmb3JlSG9vayIsInRleHQiLCJydW5Ib29rIiwic3dhbCIsInNob3dDYW5jZWxCdXR0b24iLCJjb25maXJtQnV0dG9uVGV4dCIsImNhbmNlbEJ1dHRvblRleHQiLCJwcmV2aW91c0RvYyIsImdldFByZXZpb3VzRG9jIiwiX2UiLCJhcHBpZCIsImR4RGF0YUdyaWRJbnN0YW5jZSIsImdyaWRDb250YWluZXIiLCJncmlkT2JqZWN0TmFtZUNsYXNzIiwiaW5mbyIsImlzT3BlbmVyUmVtb3ZlIiwicmVjb3JkVXJsIiwidGVtcE5hdlJlbW92ZWQiLCJzdWNjZXNzIiwib3BlbmVyIiwiZHhUcmVlTGlzdCIsImR4RGF0YUdyaWQiLCJyZWZyZXNoIiwiVGVtcGxhdGUiLCJjcmVhdG9yX2dyaWQiLCJyZW1vdmVUZW1wTmF2SXRlbSIsImNsb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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OztBRGxDUixxQkFBT3VOLFlBQVA7QUFDQ0EsaUNBQWUsS0FBZjtBQ29DTzs7QURuQ1IscUJBQU9vbEIsY0FBUDtBQUVDbkMsNkJBQVdDLEVBQVgsQ0FBYyxVQUFRMkIsS0FBUixHQUFjLEdBQWQsR0FBaUJ6ekIsV0FBakIsR0FBNkIsUUFBN0IsR0FBcUM0TyxZQUFuRDtBQVJHO0FBSE47QUNpRE07O0FEckNOLGdCQUFHa2tCLGFBQWMsT0FBT0EsU0FBUCxLQUFvQixVQUFyQztBQUNDQTtBQ3VDSzs7QUFDRCxtQkR0Q0w5QixZQUFZaUMsT0FBWixDQUFvQmp6QixXQUFwQixFQUFpQyxRQUFqQyxFQUEyQyxPQUEzQyxFQUFvRDtBQUFDMEIsbUJBQUttSyxTQUFOO0FBQWlCeW5CLDJCQUFhQTtBQUE5QixhQUFwRCxDQ3NDSztBRDFGTixhQXFERSxVQUFDNTBCLEtBQUQ7QUMwQ0ksbUJEekNMc3lCLFlBQVlpQyxPQUFaLENBQW9CanpCLFdBQXBCLEVBQWlDLFFBQWpDLEVBQTJDLE9BQTNDLEVBQW9EO0FBQUMwQixtQkFBS21LLFNBQU47QUFBaUJuTixxQkFBT0E7QUFBeEIsYUFBcEQsQ0N5Q0s7QUQvRk4sWUN1Qkk7QUE2RUQ7QUQ5R04sUUNzQkc7QUQxSEo7QUFBQSxHQUZEO0FDd05BLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIkBkYiA9IHt9XHJcbmlmICFDcmVhdG9yP1xyXG5cdEBDcmVhdG9yID0ge31cclxuQ3JlYXRvci5PYmplY3RzID0ge31cclxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9XHJcbkNyZWF0b3IuTWVudXMgPSBbXVxyXG5DcmVhdG9yLkFwcHMgPSB7fVxyXG5DcmVhdG9yLkRhc2hib2FyZHMgPSB7fVxyXG5DcmVhdG9yLlJlcG9ydHMgPSB7fVxyXG5DcmVhdG9yLnN1YnMgPSB7fVxyXG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fSIsInRoaXMuZGIgPSB7fTtcblxuaWYgKHR5cGVvZiBDcmVhdG9yID09PSBcInVuZGVmaW5lZFwiIHx8IENyZWF0b3IgPT09IG51bGwpIHtcbiAgdGhpcy5DcmVhdG9yID0ge307XG59XG5cbkNyZWF0b3IuT2JqZWN0cyA9IHt9O1xuXG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge307XG5cbkNyZWF0b3IuTWVudXMgPSBbXTtcblxuQ3JlYXRvci5BcHBzID0ge307XG5cbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9O1xuXG5DcmVhdG9yLlJlcG9ydHMgPSB7fTtcblxuQ3JlYXRvci5zdWJzID0ge307XG5cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9O1xuIiwidHJ5XHJcblx0aWYgTWV0ZW9yLmlzRGV2ZWxvcG1lbnRcclxuXHRcdHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXHJcblx0XHRvYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJylcclxuXHRcdG1vbGVjdWxlciA9IHJlcXVpcmUoXCJtb2xlY3VsZXJcIik7XHJcblx0XHRwYWNrYWdlTG9hZGVyID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRlb3ItcGFja2FnZS1sb2FkZXInKTtcclxuXHRcdHBhdGggPSByZXF1aXJlKCdwYXRoJylcclxuXHRcdHNldHRpbmdzID0ge1xyXG5cdFx0XHRidWlsdF9pbl9wbHVnaW5zOiBbXHJcblx0XHRcdFx0XCJAc3RlZWRvcy93b3JrZmxvd1wiLFxyXG5cdFx0XHRcdFwiQHN0ZWVkb3MvYWNjb3VudHNcIixcclxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0ZWVkb3MtcGx1Z2luLXNjaGVtYS1idWlsZGVyXCIsXHJcblx0XHRcdFx0XCJAc3RlZWRvcy9wbHVnaW4tZW50ZXJwcmlzZVwiLFxyXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvd29yZC10ZW1wbGF0ZVwiLFxyXG5cdFx0XHRcdFwiQHN0ZWVkb3MvcGx1Z2luLXF5d3hcIixcclxuXHRcdFx0XHRcIkBzdGVlZG9zL21ldGFkYXRhLWFwaVwiLFxyXG5cdFx0XHRcdFwiQHN0ZWVkb3MvcGx1Z2luLWRpbmd0YWxrXCJdLFxyXG5cdFx0XHRwbHVnaW5zOiBbXVxyXG5cdFx0fVxyXG5cdFx0TWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0YnJva2VyID0gbmV3IG1vbGVjdWxlci5TZXJ2aWNlQnJva2VyKHtcclxuXHRcdFx0XHRcdG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXHJcblx0XHRcdFx0XHRub2RlSUQ6IFwic3RlZWRvcy1jcmVhdG9yXCIsXHJcblx0XHRcdFx0XHRtZXRhZGF0YToge30sXHJcblx0XHRcdFx0XHR0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXHJcblx0XHRcdFx0XHRsb2dMZXZlbDogXCJ3YXJuXCIsXHJcblx0XHRcdFx0XHRzZXJpYWxpemVyOiBcIkpTT05cIixcclxuXHRcdFx0XHRcdHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXHJcblx0XHRcdFx0XHRtYXhDYWxsTGV2ZWw6IDEwMCxcclxuXHJcblx0XHRcdFx0XHRoZWFydGJlYXRJbnRlcnZhbDogMTAsXHJcblx0XHRcdFx0XHRoZWFydGJlYXRUaW1lb3V0OiAzMCxcclxuXHJcblx0XHRcdFx0XHRjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXHJcblxyXG5cdFx0XHRcdFx0dHJhY2tpbmc6IHtcclxuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdHNodXRkb3duVGltZW91dDogNTAwMCxcclxuXHRcdFx0XHRcdH0sXHJcblxyXG5cdFx0XHRcdFx0ZGlzYWJsZUJhbGFuY2VyOiBmYWxzZSxcclxuXHJcblx0XHRcdFx0XHRyZWdpc3RyeToge1xyXG5cdFx0XHRcdFx0XHRzdHJhdGVneTogXCJSb3VuZFJvYmluXCIsXHJcblx0XHRcdFx0XHRcdHByZWZlckxvY2FsOiB0cnVlXHJcblx0XHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHRcdGJ1bGtoZWFkOiB7XHJcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRjb25jdXJyZW5jeTogMTAsXHJcblx0XHRcdFx0XHRcdG1heFF1ZXVlU2l6ZTogMTAwLFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHZhbGlkYXRvcjogdHJ1ZSxcclxuXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogbnVsbCxcclxuXHJcblx0XHRcdFx0XHR0cmFjaW5nOiB7XHJcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRleHBvcnRlcjoge1xyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiQ29uc29sZVwiLFxyXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdGxvZ2dlcjogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdGNvbG9yczogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAsXHJcblx0XHRcdFx0XHRcdFx0XHRnYXVnZVdpZHRoOiA0MFxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0b2JqZWN0cWwuZ2V0U3RlZWRvc1NjaGVtYShicm9rZXIpO1xyXG5cdFx0XHRcdHN0YW5kYXJkT2JqZWN0c0RpciA9IG9iamVjdHFsLlN0YW5kYXJkT2JqZWN0c1BhdGg7XHJcblx0XHRcdFx0c3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XHJcblx0XHRcdFx0XHRuYW1lOiAnc3RhbmRhcmQtb2JqZWN0cycsXHJcblx0XHRcdFx0XHRtaXhpbnM6IFtwYWNrYWdlTG9hZGVyXSxcclxuXHRcdFx0XHRcdHNldHRpbmdzOiB7IHBhY2thZ2VJbmZvOiB7XHJcblx0XHRcdFx0XHRcdHBhdGg6IHN0YW5kYXJkT2JqZWN0c0RpcixcclxuXHRcdFx0XHRcdH0gfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdE1ldGVvci53cmFwQXN5bmMoKGNiKS0+XHJcblx0XHRcdFx0XHRicm9rZXIuc3RhcnQoKS50aGVuKCgpLT5cclxuXHRcdFx0XHRcdFx0aWYgIWJyb2tlci5zdGFydGVkXHJcblx0XHRcdFx0XHRcdFx0YnJva2VyLl9yZXN0YXJ0U2VydmljZShzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSk7XHJcblxyXG5cdFx0XHRcdFx0XHRicm9rZXIud2FpdEZvclNlcnZpY2VzKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlLm5hbWUpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cclxuXHRcdFx0XHRcdFx0XHRzdGVlZG9zQ29yZS5pbml0LmNhbGwoc2V0dGluZ3MpLnRoZW4gKCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdCkoKVxyXG5cdFx0XHRjYXRjaCBleFxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixleClcclxuY2F0Y2ggZVxyXG5cdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixlKSIsInZhciBlLCBtb2xlY3VsZXIsIG9iamVjdHFsLCBwYWNrYWdlTG9hZGVyLCBwYXRoLCBzZXR0aW5ncywgc3RlZWRvc0NvcmU7XG5cbnRyeSB7XG4gIGlmIChNZXRlb3IuaXNEZXZlbG9wbWVudCkge1xuICAgIHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuICAgIG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcbiAgICBtb2xlY3VsZXIgPSByZXF1aXJlKFwibW9sZWN1bGVyXCIpO1xuICAgIHBhY2thZ2VMb2FkZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGVvci1wYWNrYWdlLWxvYWRlcicpO1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgc2V0dGluZ3MgPSB7XG4gICAgICBidWlsdF9pbl9wbHVnaW5zOiBbXCJAc3RlZWRvcy93b3JrZmxvd1wiLCBcIkBzdGVlZG9zL2FjY291bnRzXCIsIFwiQHN0ZWVkb3Mvc3RlZWRvcy1wbHVnaW4tc2NoZW1hLWJ1aWxkZXJcIiwgXCJAc3RlZWRvcy9wbHVnaW4tZW50ZXJwcmlzZVwiLCBcIkBzdGVlZG9zL3dvcmQtdGVtcGxhdGVcIiwgXCJAc3RlZWRvcy9wbHVnaW4tcXl3eFwiLCBcIkBzdGVlZG9zL21ldGFkYXRhLWFwaVwiLCBcIkBzdGVlZG9zL3BsdWdpbi1kaW5ndGFsa1wiXSxcbiAgICAgIHBsdWdpbnM6IFtdXG4gICAgfTtcbiAgICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBicm9rZXIsIGV4LCBzdGFuZGFyZE9iamVjdHNEaXIsIHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYnJva2VyID0gbmV3IG1vbGVjdWxlci5TZXJ2aWNlQnJva2VyKHtcbiAgICAgICAgICBuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuICAgICAgICAgIG5vZGVJRDogXCJzdGVlZG9zLWNyZWF0b3JcIixcbiAgICAgICAgICBtZXRhZGF0YToge30sXG4gICAgICAgICAgdHJhbnNwb3J0ZXI6IHByb2Nlc3MuZW52LlRSQU5TUE9SVEVSLFxuICAgICAgICAgIGxvZ0xldmVsOiBcIndhcm5cIixcbiAgICAgICAgICBzZXJpYWxpemVyOiBcIkpTT05cIixcbiAgICAgICAgICByZXF1ZXN0VGltZW91dDogNjAgKiAxMDAwLFxuICAgICAgICAgIG1heENhbGxMZXZlbDogMTAwLFxuICAgICAgICAgIGhlYXJ0YmVhdEludGVydmFsOiAxMCxcbiAgICAgICAgICBoZWFydGJlYXRUaW1lb3V0OiAzMCxcbiAgICAgICAgICBjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG4gICAgICAgICAgdHJhY2tpbmc6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgc2h1dGRvd25UaW1lb3V0OiA1MDAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkaXNhYmxlQmFsYW5jZXI6IGZhbHNlLFxuICAgICAgICAgIHJlZ2lzdHJ5OiB7XG4gICAgICAgICAgICBzdHJhdGVneTogXCJSb3VuZFJvYmluXCIsXG4gICAgICAgICAgICBwcmVmZXJMb2NhbDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVsa2hlYWQ6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgY29uY3VycmVuY3k6IDEwLFxuICAgICAgICAgICAgbWF4UXVldWVTaXplOiAxMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHZhbGlkYXRvcjogdHJ1ZSxcbiAgICAgICAgICBlcnJvckhhbmRsZXI6IG51bGwsXG4gICAgICAgICAgdHJhY2luZzoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBleHBvcnRlcjoge1xuICAgICAgICAgICAgICB0eXBlOiBcIkNvbnNvbGVcIixcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGxvZ2dlcjogbnVsbCxcbiAgICAgICAgICAgICAgICBjb2xvcnM6IHRydWUsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICAgICAgICBnYXVnZVdpZHRoOiA0MFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgb2JqZWN0cWwuZ2V0U3RlZWRvc1NjaGVtYShicm9rZXIpO1xuICAgICAgICBzdGFuZGFyZE9iamVjdHNEaXIgPSBvYmplY3RxbC5TdGFuZGFyZE9iamVjdHNQYXRoO1xuICAgICAgICBzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiAnc3RhbmRhcmQtb2JqZWN0cycsXG4gICAgICAgICAgbWl4aW5zOiBbcGFja2FnZUxvYWRlcl0sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvOiB7XG4gICAgICAgICAgICAgIHBhdGg6IHN0YW5kYXJkT2JqZWN0c0RpclxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgICAgcmV0dXJuIGJyb2tlci5zdGFydCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIWJyb2tlci5zdGFydGVkKSB7XG4gICAgICAgICAgICAgIGJyb2tlci5fcmVzdGFydFNlcnZpY2Uoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGJyb2tlci53YWl0Rm9yU2VydmljZXMoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UubmFtZSkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLmluaXQuY2FsbChzZXR0aW5ncykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4ID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgZSA9IGVycm9yO1xuICBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGUpO1xufVxuIiwiQ3JlYXRvci5kZXBzID0ge1xyXG5cdGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxyXG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxyXG59O1xyXG5cclxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XHJcblx0QXBwczoge30sXHJcblx0T2JqZWN0czoge31cclxufVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxyXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXHJcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2NyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxyXG5cclxuIyBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMg5L6bc3RlZWRvcy1jbGnpobnnm67kvb/nlKhcclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxyXG5cdENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XHJcblx0XHRGaWJlcigoKS0+XHJcblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcclxuXHRcdCkucnVuKClcclxuXHJcbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBvYmoubmFtZVxyXG5cclxuXHRpZiAhb2JqLmxpc3Rfdmlld3NcclxuXHRcdG9iai5saXN0X3ZpZXdzID0ge31cclxuXHJcblx0aWYgb2JqLnNwYWNlXHJcblx0XHRvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKVxyXG5cdGlmIG9iamVjdF9uYW1lID09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCdcclxuXHRcdG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xyXG5cdFx0b2JqID0gXy5jbG9uZShvYmopXHJcblx0XHRvYmoubmFtZSA9IG9iamVjdF9uYW1lXHJcblx0XHRDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqXHJcblxyXG5cdENyZWF0b3IuY29udmVydE9iamVjdChvYmopXHJcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XHJcblxyXG5cdENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKVxyXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcclxuXHRyZXR1cm4gb2JqXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxyXG5cdGlmIG9iamVjdC5zcGFjZVxyXG5cdFx0cmV0dXJuIFwiY18je29iamVjdC5zcGFjZX1fI3tvYmplY3QubmFtZX1cIlxyXG5cdHJldHVybiBvYmplY3QubmFtZVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3QgPSAob2JqZWN0X25hbWUsIHNwYWNlX2lkKS0+XHJcblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxyXG5cdFx0cmV0dXJuIDtcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxyXG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcbiNcdGlmICFzcGFjZV9pZCAmJiBvYmplY3RfbmFtZVxyXG4jXHRcdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKVxyXG4jXHRcdFx0c3BhY2VfaWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHJcblx0aWYgb2JqZWN0X25hbWVcclxuI1x0XHRpZiBzcGFjZV9pZFxyXG4jXHRcdFx0b2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY18je3NwYWNlX2lkfV8je29iamVjdF9uYW1lfVwiXVxyXG4jXHRcdFx0aWYgb2JqXHJcbiNcdFx0XHRcdHJldHVybiBvYmpcclxuI1xyXG4jXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XHJcbiNcdFx0XHRcdHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT0gb2JqZWN0X25hbWVcclxuI1x0XHRpZiBvYmpcclxuI1x0XHRcdHJldHVybiBvYmpcclxuXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxyXG5cclxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gKG9iamVjdF9pZCktPlxyXG5cdHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtfaWQ6IG9iamVjdF9pZH0pXHJcblxyXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IChvYmplY3RfbmFtZSktPlxyXG5cdGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKVxyXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXHJcblx0ZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cclxuXHJcbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxyXG5cdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0aWYgb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW0NyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uX2NvbGxlY3Rpb25fbmFtZV1cclxuXHJcbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxyXG5cdGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXVxyXG5cclxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRzcGFjZSA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpPy5kYj8uZmluZE9uZShzcGFjZUlkLHtmaWVsZHM6e2FkbWluczoxfX0pXHJcblx0aWYgc3BhY2U/LmFkbWluc1xyXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMFxyXG5cclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKS0+XHJcblxyXG5cdGlmICFfLmlzU3RyaW5nKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIGZvcm11bGFyXHJcblxyXG5cdGlmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKVxyXG5cclxuXHRyZXR1cm4gZm9ybXVsYXJcclxuXHJcbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGNvbnRleHQpLT5cclxuXHRzZWxlY3RvciA9IHt9XHJcblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cclxuXHRcdGlmIGZpbHRlcj8ubGVuZ3RoID09IDNcclxuXHRcdFx0bmFtZSA9IGZpbHRlclswXVxyXG5cdFx0XHRhY3Rpb24gPSBmaWx0ZXJbMV1cclxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpXHJcblx0XHRcdHNlbGVjdG9yW25hbWVdID0ge31cclxuXHRcdFx0c2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlXHJcblx0IyBjb25zb2xlLmxvZyhcImV2YWx1YXRlRmlsdGVycy0tPnNlbGVjdG9yXCIsIHNlbGVjdG9yKVxyXG5cdHJldHVybiBzZWxlY3RvclxyXG5cclxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gKHNwYWNlSWQpIC0+XHJcblx0cmV0dXJuIHNwYWNlSWQgPT0gJ2NvbW1vbidcclxuXHJcbiMjI1xyXG5cdGRvY3PvvJrlvoXmjpLluo/nmoTmlofmoaPmlbDnu4RcclxuXHRpZHPvvJpfaWTpm4blkIhcclxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxyXG5cdHJldHVybiDmjInnhadpZHPnmoTpobrluo/ov5Tlm57mlrDnmoTmlofmoaPpm4blkIhcclxuIyMjXHJcbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpLT5cclxuXHJcblx0aWYgIWlkX2tleVxyXG5cdFx0aWRfa2V5ID0gXCJfaWRcIlxyXG5cclxuXHRpZiBoaXRfZmlyc3RcclxuXHJcblx0XHQj55Sx5LqO5LiN6IO95L2/55SoXy5maW5kSW5kZXjlh73mlbDvvIzlm6DmraTmraTlpITlhYjlsIblr7nosaHmlbDnu4TovazkuLrmma7pgJrmlbDnu4TnsbvlnovvvIzlnKjojrflj5blhbZpbmRleFxyXG5cdFx0dmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpXHJcblxyXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XHJcblx0XHRcdFx0XHRfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcclxuXHRcdFx0XHRcdGlmIF9pbmRleCA+IC0xXHJcblx0XHRcdFx0XHRcdHJldHVybiBfaW5kZXhcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSlcclxuXHRlbHNlXHJcblx0XHRyZXR1cm5cdF8uc29ydEJ5IGRvY3MsIChkb2MpLT5cclxuXHRcdFx0cmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxyXG5cclxuIyMjXHJcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXHJcblx05a+55LqOT2JqZWN057G75Z6L77yM5aaC5p6c5o+Q5L6b5L2c55So5Z+f5Lita2V55bGe5oCn77yM5YiZ5Y+W5YC85Li6dmFsdWVba2V5Xei/m+ihjOaOkuW6j+avlOi+g++8jOWPjeS5i+aVtOS4qk9iamVjdC50b1N0cmluZygp5ZCO5o6S5bqP5q+U6L6DXHJcbiMjI1xyXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSAodmFsdWUxLCB2YWx1ZTIpIC0+XHJcblx0aWYgdGhpcy5rZXlcclxuXHRcdHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV1cclxuXHRcdHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV1cclxuXHRpZiB2YWx1ZTEgaW5zdGFuY2VvZiBEYXRlXHJcblx0XHR2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpXHJcblx0aWYgdmFsdWUyIGluc3RhbmNlb2YgRGF0ZVxyXG5cdFx0dmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKVxyXG5cdGlmIHR5cGVvZiB2YWx1ZTEgaXMgXCJudW1iZXJcIiBhbmQgdHlwZW9mIHZhbHVlMiBpcyBcIm51bWJlclwiXHJcblx0XHRyZXR1cm4gdmFsdWUxIC0gdmFsdWUyXHJcblx0IyBIYW5kbGluZyBudWxsIHZhbHVlc1xyXG5cdGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT0gbnVsbCBvciB2YWx1ZTEgPT0gdW5kZWZpbmVkXHJcblx0aXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PSBudWxsIG9yIHZhbHVlMiA9PSB1bmRlZmluZWRcclxuXHRpZiBpc1ZhbHVlMUVtcHR5IGFuZCAhaXNWYWx1ZTJFbXB0eVxyXG5cdFx0cmV0dXJuIC0xXHJcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxyXG5cdFx0cmV0dXJuIDBcclxuXHRpZiAhaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxyXG5cdFx0cmV0dXJuIDFcclxuXHRsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXHJcblx0cmV0dXJuIHZhbHVlMS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUgdmFsdWUyLnRvU3RyaW5nKCksIGxvY2FsZVxyXG5cclxuXHJcbiMg6K+l5Ye95pWw5Y+q5Zyo5Yid5aeL5YyWT2JqZWN05pe277yM5oqK55u45YWz5a+56LGh55qE6K6h566X57uT5p6c5L+d5a2Y5YiwT2JqZWN055qEcmVsYXRlZF9vYmplY3Rz5bGe5oCn5Lit77yM5ZCO57ut5Y+v5Lul55u05o6l5LuOcmVsYXRlZF9vYmplY3Rz5bGe5oCn5Lit5Y+W5b6X6K6h566X57uT5p6c6ICM5LiN55So5YaN5qyh6LCD55So6K+l5Ye95pWw5p2l6K6h566XXHJcbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSAob2JqZWN0X25hbWUpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0cmVsYXRlZF9vYmplY3RzID0gW11cclxuXHQjIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHQjIOWboENyZWF0b3IuZ2V0T2JqZWN05Ye95pWw5YaF6YOo6KaB6LCD55So6K+l5Ye95pWw77yM5omA5Lul6L+Z6YeM5LiN5Y+v5Lul6LCD55SoQ3JlYXRvci5nZXRPYmplY3Tlj5blr7nosaHvvIzlj6rog73osIPnlKhDcmVhdG9yLk9iamVjdHPmnaXlj5blr7nosaFcclxuXHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxyXG5cdGlmICFfb2JqZWN0XHJcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXHJcblx0XHJcblx0cmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50ICYmICFfLmlzRW1wdHkgcmVsYXRlZExpc3RcclxuXHRcdHJlbGF0ZWRMaXN0TWFwID0ge31cclxuXHRcdF8uZWFjaCByZWxhdGVkTGlzdCwgKG9iak5hbWUpLT5cclxuXHRcdFx0aWYgXy5pc09iamVjdCBvYmpOYW1lXHJcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZS5vYmplY3ROYW1lXSA9IHt9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9XHJcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cclxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxyXG5cdFx0XHRcdGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgcmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWUgYW5kIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdXHJcblx0XHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHsgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIH1cclxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXVxyXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10gPSB7IG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLCBmb3JlaWduX2tleTogXCJwYXJlbnRcIiB9XHJcblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ11cclxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0geyBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiIH1cclxuXHRcdF8uZWFjaCBbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgKGVuYWJsZU9iak5hbWUpLT5cclxuXHRcdFx0aWYgcmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV1cclxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHsgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XHJcblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddXHJcblx0XHRcdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4FcclxuXHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxyXG5cdFx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7IG9iamVjdF9uYW1lOlwiYXVkaXRfcmVjb3Jkc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCIgfVxyXG5cdFx0cmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMgcmVsYXRlZExpc3RNYXBcclxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdHNcclxuXHJcblx0aWYgX29iamVjdC5lbmFibGVfZmlsZXNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImNtc19maWxlc1wiLCBmb3JlaWduX2tleTogXCJwYXJlbnRcIn1cclxuXHJcblx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XHJcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XHJcblx0XHRcdGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiICYmIHJlbGF0ZWRfZmllbGQucmVsYXRlZExpc3QpKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXHJcblx0XHRcdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcIm9iamVjdF9maWVsZHNcIlxyXG5cdFx0XHRcdFx0I1RPRE8g5b6F55u45YWz5YiX6KGo5pSv5oyB5o6S5bqP5ZCO77yM5Yig6Zmk5q2k5Yik5patXHJcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lfSlcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6cmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWR9XHJcblxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJ0YXNrc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfbm90ZXNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ldmVudHNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImV2ZW50c1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XHJcblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wifVxyXG5cdGlmIF9vYmplY3QuZW5hYmxlX2FwcHJvdmFsc1xyXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cclxuXHRpZiBfb2JqZWN0LmVuYWJsZV9wcm9jZXNzXHJcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJwcm9jZXNzX2luc3RhbmNlX2hpc3RvcnlcIiwgZm9yZWlnbl9rZXk6IFwidGFyZ2V0X29iamVjdFwifVxyXG5cdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4FcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSlcclxuXHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImF1ZGl0X3JlY29yZHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxyXG5cclxuXHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXHJcblxyXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKS0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRyZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFRcclxuXHRlbHNlXHJcblx0XHRpZiAhKHVzZXJJZCBhbmQgc3BhY2VJZClcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCJcclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdHN1RmllbGRzID0ge25hbWU6IDEsIG1vYmlsZTogMSwgcG9zaXRpb246IDEsIGVtYWlsOiAxLCBjb21wYW55OiAxLCBvcmdhbml6YXRpb246IDEsIHNwYWNlOiAxLCBjb21wYW55X2lkOiAxLCBjb21wYW55X2lkczogMX1cclxuXHRcdCMgY2hlY2sgaWYgdXNlciBpbiB0aGUgc3BhY2VcclxuXHRcdHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXHJcblx0XHRpZiAhc3VcclxuXHRcdFx0c3BhY2VJZCA9IG51bGxcclxuXHJcblx0XHQjIGlmIHNwYWNlSWQgbm90IGV4aXN0cywgZ2V0IHRoZSBmaXJzdCBvbmUuXHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRpZiBpc1VuU2FmZU1vZGVcclxuXHRcdFx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXHJcblx0XHRcdFx0aWYgIXN1XHJcblx0XHRcdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0XHRcdHNwYWNlSWQgPSBzdS5zcGFjZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIG51bGxcclxuXHJcblx0XHRVU0VSX0NPTlRFWFQgPSB7fVxyXG5cdFx0VVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZFxyXG5cdFx0VVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkXHJcblx0XHRVU0VSX0NPTlRFWFQudXNlciA9IHtcclxuXHRcdFx0X2lkOiB1c2VySWRcclxuXHRcdFx0bmFtZTogc3UubmFtZSxcclxuXHRcdFx0bW9iaWxlOiBzdS5tb2JpbGUsXHJcblx0XHRcdHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcclxuXHRcdFx0ZW1haWw6IHN1LmVtYWlsXHJcblx0XHRcdGNvbXBhbnk6IHN1LmNvbXBhbnlcclxuXHRcdFx0Y29tcGFueV9pZDogc3UuY29tcGFueV9pZFxyXG5cdFx0XHRjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcclxuXHRcdH1cclxuXHRcdHNwYWNlX3VzZXJfb3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKT8uZmluZE9uZShzdS5vcmdhbml6YXRpb24pXHJcblx0XHRpZiBzcGFjZV91c2VyX29yZ1xyXG5cdFx0XHRVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XHJcblx0XHRcdFx0X2lkOiBzcGFjZV91c2VyX29yZy5faWQsXHJcblx0XHRcdFx0bmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcclxuXHRcdFx0XHRmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcclxuXHRcdFx0fVxyXG5cdFx0cmV0dXJuIFVTRVJfQ09OVEVYVFxyXG5cclxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9ICh1cmwpLT5cclxuXHJcblx0aWYgXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICh1cmw/LnN0YXJ0c1dpdGgoXCIvYXNzZXRzXCIpIHx8IHVybD8uc3RhcnRzV2l0aChcImFzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCIvcGFja2FnZXNcIikpXHJcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxyXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxyXG5cdFx0cmV0dXJuIHVybFxyXG5cclxuXHRpZiB1cmxcclxuXHRcdCMgdXJs5byA5aS05rKh5pyJXCIvXCLvvIzpnIDopoHmt7vliqBcIi9cIlxyXG5cdFx0aWYgIS9eXFwvLy50ZXN0KHVybClcclxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcclxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVhcclxuXHJcbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9ICh1c2VySWQsIHNwYWNlSWQpLT5cclxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpXHJcblx0ZWxzZVxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKVxyXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZDoxfX0pXHJcblx0cmV0dXJuIHN1LmNvbXBhbnlfaWRcclxuXHJcbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSAodXNlcklkLCBzcGFjZUlkKS0+XHJcblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxyXG5cdGVsc2VcclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcclxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWRzOjF9fSlcclxuXHRyZXR1cm4gc3U/LmNvbXBhbnlfaWRzXHJcblxyXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IChwbyktPlxyXG5cdGlmIHBvLmFsbG93Q3JlYXRlXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0aWYgcG8uYWxsb3dFZGl0XHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0aWYgcG8uYWxsb3dEZWxldGVcclxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRpZiBwby52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxyXG5cdGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcclxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxyXG5cdFx0cG8udmlld0FsbFJlY29yZHMgPSB0cnVlXHJcblx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXHJcblx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcclxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcclxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxyXG5cdFx0cG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxyXG5cdHJldHVybiBwb1xyXG5cclxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSAoKS0+XHJcblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZFxyXG5cclxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9ICgpLT5cclxuXHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWRcclxuXHJcbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gKHNwYWNlSWQpLT5cclxuXHRpZiBzcGFjZUlkICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZCA9PSBzcGFjZUlkXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdHJldHVybiBmYWxzZVxyXG5cclxuQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZSA9IChzcGFjZUlkKS0+XHJcblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5jbG91ZEFkbWluU3BhY2VJZCA9PSBzcGFjZUlkXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdHJldHVybiBmYWxzZVxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Q3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVJcclxuXHQiLCJ2YXIgRmliZXI7XG5cbkNyZWF0b3IuZGVwcyA9IHtcbiAgYXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5LFxuICBvYmplY3Q6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcbn07XG5cbkNyZWF0b3IuX1RFTVBMQVRFID0ge1xuICBBcHBzOiB7fSxcbiAgT2JqZWN0czoge31cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgcmV0dXJuIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xufSk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcbiAgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmxvYWRPYmplY3RzKG9iaiwgb2JqZWN0X25hbWUpO1xuICAgIH0pLnJ1bigpO1xuICB9O1xufVxuXG5DcmVhdG9yLmxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmoubmFtZTtcbiAgfVxuICBpZiAoIW9iai5saXN0X3ZpZXdzKSB7XG4gICAgb2JqLmxpc3Rfdmlld3MgPSB7fTtcbiAgfVxuICBpZiAob2JqLnNwYWNlKSB7XG4gICAgb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iaik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lID09PSAnY2ZzX2ZpbGVzX2ZpbGVyZWNvcmQnKSB7XG4gICAgb2JqZWN0X25hbWUgPSAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnO1xuICAgIG9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICBvYmoubmFtZSA9IG9iamVjdF9uYW1lO1xuICAgIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0gPSBvYmo7XG4gIH1cbiAgQ3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iaik7XG4gIG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuICBDcmVhdG9yLmluaXRUcmlnZ2VycyhvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdC5zcGFjZSkge1xuICAgIHJldHVybiBcImNfXCIgKyBvYmplY3Quc3BhY2UgKyBcIl9cIiArIG9iamVjdC5uYW1lO1xuICB9XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKSB7XG4gIHZhciByZWYsIHJlZjE7XG4gIGlmIChfLmlzQXJyYXkob2JqZWN0X25hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoKHJlZiA9IENyZWF0b3IuZGVwcykgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWYxID0gcmVmLm9iamVjdCkgIT0gbnVsbCkge1xuICAgICAgICByZWYxLmRlcGVuZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gZnVuY3Rpb24ob2JqZWN0X2lkKSB7XG4gIHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtcbiAgICBfaWQ6IG9iamVjdF9pZFxuICB9KTtcbn07XG5cbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgY29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpO1xuICBkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1socmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLl9jb2xsZWN0aW9uX25hbWUgOiB2b2lkIDBdO1xuICB9XG59O1xuXG5DcmVhdG9yLnJlbW92ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlZiwgcmVmMSwgc3BhY2U7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHNwYWNlID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZGIpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgIGZpZWxkczoge1xuICAgICAgYWRtaW5zOiAxXG4gICAgfVxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgaWYgKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghXy5pc1N0cmluZyhmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gZm9ybXVsYXI7XG4gIH1cbiAgaWYgKENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFyO1xufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBjb250ZXh0KSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgc2VsZWN0b3IgPSB7fTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBhY3Rpb24sIG5hbWUsIHZhbHVlO1xuICAgIGlmICgoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMykge1xuICAgICAgbmFtZSA9IGZpbHRlclswXTtcbiAgICAgIGFjdGlvbiA9IGZpbHRlclsxXTtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KTtcbiAgICAgIHNlbGVjdG9yW25hbWVdID0ge307XG4gICAgICByZXR1cm4gc2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIHNwYWNlSWQgPT09ICdjb21tb24nO1xufTtcblxuXG4vKlxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4gKi9cblxuQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMgPSBmdW5jdGlvbihkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KSB7XG4gIHZhciB2YWx1ZXM7XG4gIGlmICghaWRfa2V5KSB7XG4gICAgaWRfa2V5ID0gXCJfaWRcIjtcbiAgfVxuICBpZiAoaGl0X2ZpcnN0KSB7XG4gICAgdmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpO1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHZhciBfaW5kZXg7XG4gICAgICBfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgICBpZiAoX2luZGV4ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9pbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgfSk7XG4gIH1cbn07XG5cblxuLypcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuICovXG5cbkNyZWF0b3Iuc29ydGluZ01ldGhvZCA9IGZ1bmN0aW9uKHZhbHVlMSwgdmFsdWUyKSB7XG4gIHZhciBpc1ZhbHVlMUVtcHR5LCBpc1ZhbHVlMkVtcHR5LCBsb2NhbGU7XG4gIGlmICh0aGlzLmtleSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV07XG4gICAgdmFsdWUyID0gdmFsdWUyW3RoaXMua2V5XTtcbiAgfVxuICBpZiAodmFsdWUxIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHZhbHVlMiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTIgPSB2YWx1ZTIuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUxID09PSBcIm51bWJlclwiICYmIHR5cGVvZiB2YWx1ZTIgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gdmFsdWUxIC0gdmFsdWUyO1xuICB9XG4gIGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT09IG51bGwgfHwgdmFsdWUxID09PSB2b2lkIDA7XG4gIGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT09IG51bGwgfHwgdmFsdWUyID09PSB2b2lkIDA7XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmICFpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBpZiAoIWlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKCk7XG4gIHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlKHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGUpO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TWFwLCByZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IFtdO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICByZWxhdGVkTGlzdE1hcCA9IHt9O1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqTmFtZSkge1xuICAgICAgaWYgKF8uaXNPYmplY3Qob2JqTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSAmJiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSkge1xuICAgICAgcmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIlxuICAgICAgfTtcbiAgICB9XG4gICAgXy5lYWNoKFsndGFza3MnLCAnbm90ZXMnLCAnZXZlbnRzJywgJ2FwcHJvdmFscyddLCBmdW5jdGlvbihlbmFibGVPYmpOYW1lKSB7XG4gICAgICBpZiAocmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdID0ge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBlbmFibGVPYmpOYW1lLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpO1xuICAgICAgaWYgKF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIChwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJlbGF0ZWRfb2JqZWN0cyA9IF8udmFsdWVzKHJlbGF0ZWRMaXN0TWFwKTtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9maWxlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09PSBcImxvb2t1cFwiICYmIHJlbGF0ZWRfZmllbGQucmVsYXRlZExpc3QpKSAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwib2JqZWN0X2ZpZWxkc1wiKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGlmIChfb2JqZWN0LmVuYWJsZV90YXNrcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInRhc2tzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfbm90ZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJub3Rlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2V2ZW50cykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImV2ZW50c1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2luc3RhbmNlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2FwcHJvdmFscykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImFwcHJvdmFsc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Byb2Nlc3MpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJwcm9jZXNzX2luc3RhbmNlX2hpc3RvcnlcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInRhcmdldF9vYmplY3RcIlxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpO1xuICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSkge1xuICB2YXIgVVNFUl9DT05URVhULCByZWYsIHNwYWNlX3VzZXJfb3JnLCBzdSwgc3VGaWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCEodXNlcklkICYmIHNwYWNlSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJ0aGUgcGFyYW1zIHVzZXJJZCBhbmQgc3BhY2VJZCBpcyByZXF1aXJlZCBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0VXNlckNvbnRleHRcIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3VGaWVsZHMgPSB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgbW9iaWxlOiAxLFxuICAgICAgcG9zaXRpb246IDEsXG4gICAgICBlbWFpbDogMSxcbiAgICAgIGNvbXBhbnk6IDEsXG4gICAgICBvcmdhbml6YXRpb246IDEsXG4gICAgICBzcGFjZTogMSxcbiAgICAgIGNvbXBhbnlfaWQ6IDEsXG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH07XG4gICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICB9KTtcbiAgICBpZiAoIXN1KSB7XG4gICAgICBzcGFjZUlkID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBpZiAoaXNVblNhZmVNb2RlKSB7XG4gICAgICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFzdSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHNwYWNlSWQgPSBzdS5zcGFjZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBVU0VSX0NPTlRFWFQgPSB7fTtcbiAgICBVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkO1xuICAgIFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZDtcbiAgICBVU0VSX0NPTlRFWFQudXNlciA9IHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgbmFtZTogc3UubmFtZSxcbiAgICAgIG1vYmlsZTogc3UubW9iaWxlLFxuICAgICAgcG9zaXRpb246IHN1LnBvc2l0aW9uLFxuICAgICAgZW1haWw6IHN1LmVtYWlsLFxuICAgICAgY29tcGFueTogc3UuY29tcGFueSxcbiAgICAgIGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWQsXG4gICAgICBjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcbiAgICB9O1xuICAgIHNwYWNlX3VzZXJfb3JnID0gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIikpICE9IG51bGwgPyByZWYuZmluZE9uZShzdS5vcmdhbml6YXRpb24pIDogdm9pZCAwO1xuICAgIGlmIChzcGFjZV91c2VyX29yZykge1xuICAgICAgVVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuICAgICAgICBfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcbiAgICAgICAgbmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcbiAgICAgICAgZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gVVNFUl9DT05URVhUO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gIGlmIChfLmlzRnVuY3Rpb24oU3RlZWRvcy5pc0NvcmRvdmEpICYmIFN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgKCh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSA6IHZvaWQgMCkgfHwgKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpIDogdm9pZCAwKSkpIHtcbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIGlmICh1cmwpIHtcbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZDogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdS5jb21wYW55X2lkO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1ICE9IG51bGwgPyBzdS5jb21wYW55X2lkcyA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zID0gZnVuY3Rpb24ocG8pIHtcbiAgaWYgKHBvLmFsbG93Q3JlYXRlKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dEZWxldGUpIHtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcG87XG59O1xuXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSO1xufVxuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHQjIOeUqOaIt+iOt+WPlmxvb2t1cCDjgIFtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q6155qE6YCJ6aG55YC8XHJcblx0XCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IChvcHRpb25zKS0+XHJcblx0XHRpZiBvcHRpb25zPy5wYXJhbXM/LnJlZmVyZW5jZV90b1xyXG5cclxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSlcclxuXHJcblx0XHRcdG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXHJcblxyXG5cdFx0XHRxdWVyeSA9IHt9XHJcblx0XHRcdGlmIG9wdGlvbnMucGFyYW1zLnNwYWNlXHJcblx0XHRcdFx0cXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZVxyXG5cclxuXHRcdFx0XHRzb3J0ID0gb3B0aW9ucz8uc29ydFxyXG5cclxuXHRcdFx0XHRzZWxlY3RlZCA9IG9wdGlvbnM/LnNlbGVjdGVkIHx8IFtdXHJcblxyXG5cdFx0XHRcdG9wdGlvbnNfbGltaXQgPSBvcHRpb25zPy5vcHRpb25zX2xpbWl0IHx8IDEwXHJcblxyXG5cdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxyXG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5ID0ge31cclxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7JHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHR9XHJcblxyXG5cdFx0XHRcdGlmIG9wdGlvbnM/LnZhbHVlcz8ubGVuZ3RoXHJcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcclxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX0sIHNlYXJjaFRleHRRdWVyeV1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX1dXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XHJcblx0XHRcdFx0XHRcdF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpXHJcblx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JG5pbjogc2VsZWN0ZWR9XHJcblxyXG5cdFx0XHRcdGNvbGxlY3Rpb24gPSBvYmplY3QuZGJcclxuXHJcblx0XHRcdFx0aWYgb3B0aW9ucy5maWx0ZXJRdWVyeVxyXG5cdFx0XHRcdFx0Xy5leHRlbmQgcXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnlcclxuXHJcblx0XHRcdFx0cXVlcnlfb3B0aW9ucyA9IHtsaW1pdDogb3B0aW9uc19saW1pdH1cclxuXHJcblx0XHRcdFx0aWYgc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpXHJcblx0XHRcdFx0XHRxdWVyeV9vcHRpb25zLnNvcnQgPSBzb3J0XHJcblxyXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRyZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpXHJcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBbXVxyXG5cdFx0XHRcdFx0XHRfLmVhY2ggcmVjb3JkcywgKHJlY29yZCktPlxyXG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaFxyXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV1cclxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiByZWNvcmQuX2lkXHJcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzXHJcblx0XHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucylcclxuXHRcdHJldHVybiBbXSAiLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGUsIG5hbWVfZmllbGRfa2V5LCBvYmplY3QsIG9wdGlvbnNfbGltaXQsIHF1ZXJ5LCBxdWVyeV9vcHRpb25zLCByZWNvcmRzLCByZWYsIHJlZjEsIHJlc3VsdHMsIHNlYXJjaFRleHRRdWVyeSwgc2VsZWN0ZWQsIHNvcnQ7XG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYgPSBvcHRpb25zLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpO1xuICAgICAgbmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLnNwYWNlKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2U7XG4gICAgICAgIHNvcnQgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNvcnQgOiB2b2lkIDA7XG4gICAgICAgIHNlbGVjdGVkID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc2VsZWN0ZWQgOiB2b2lkIDApIHx8IFtdO1xuICAgICAgICBvcHRpb25zX2xpbWl0ID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMub3B0aW9uc19saW1pdCA6IHZvaWQgMCkgfHwgMTA7XG4gICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0ge1xuICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmMSA9IG9wdGlvbnMudmFsdWVzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIHNlYXJjaFRleHRRdWVyeVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgJG5pbjogc2VsZWN0ZWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbGxlY3Rpb24gPSBvYmplY3QuZGI7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlclF1ZXJ5KSB7XG4gICAgICAgICAgXy5leHRlbmQocXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXJ5X29wdGlvbnMgPSB7XG4gICAgICAgICAgbGltaXQ6IG9wdGlvbnNfbGltaXRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNvcnQgJiYgXy5pc09iamVjdChzb3J0KSkge1xuICAgICAgICAgIHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKTtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChyZWNvcmRzLCBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5faWRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvd29ya2Zsb3cvdmlldy86aW5zdGFuY2VJZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSlcclxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxyXG5cclxuXHRcdGhhc2hEYXRhID0gcmVxLmJvZHlcclxuXHRcdG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWVcclxuXHRcdHJlY29yZF9pZCA9IGhhc2hEYXRhLnJlY29yZF9pZFxyXG5cdFx0c3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZFxyXG5cclxuXHRcdGNoZWNrIG9iamVjdF9uYW1lLCBTdHJpbmdcclxuXHRcdGNoZWNrIHJlY29yZF9pZCwgU3RyaW5nXHJcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXHJcblxyXG5cdFx0aW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWRcclxuXHRcdHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ11cclxuXHRcdHhfYXV0aF90b2tlbiA9IHJlcS5xdWVyeVsnWC1BdXRoLVRva2VuJ11cclxuXHJcblx0XHRyZWRpcmVjdF91cmwgPSBcIi9cIlxyXG5cdFx0aW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkKVxyXG5cdFx0IyAtIOaIkeeahOiNieeov+Wwsei3s+i9rOiHs+iNieeov+eusVxyXG5cdFx0IyAtIOaIkeeahOW+heWuoeaguOWwsei3s+i9rOiHs+W+heWuoeaguFxyXG5cdFx0IyAtIOS4jeaYr+aIkeeahOeUs+ivt+WNleWImei3s+i9rOiHs+aJk+WNsOmhtemdolxyXG5cdFx0IyAtIOWmgueUs+ivt+WNleS4jeWtmOWcqOWImeaPkOekuueUqOaIt+eUs+ivt+WNleW3suWIoOmZpO+8jOW5tuS4lOabtOaWsHJlY29yZOeahOeKtuaAge+8jOS9v+eUqOaIt+WPr+S7pemHjeaWsOWPkei1t+WuoeaJuVxyXG5cdFx0aWYgaW5zXHJcblx0XHRcdGJveCA9ICcnXHJcblx0XHRcdHNwYWNlSWQgPSBpbnMuc3BhY2VcclxuXHRcdFx0Zmxvd0lkID0gaW5zLmZsb3dcclxuXHJcblx0XHRcdGlmIChpbnMuaW5ib3hfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZCkgb3IgKGlucy5jY191c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKVxyXG5cdFx0XHRcdGJveCA9ICdpbmJveCdcclxuXHRcdFx0ZWxzZSBpZiBpbnMub3V0Ym94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWRcclxuXHRcdFx0XHRib3ggPSAnb3V0Ym94J1xyXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnZHJhZnQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxyXG5cdFx0XHRcdGJveCA9ICdkcmFmdCdcclxuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ3BlbmRpbmcnIGFuZCAoaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWQgb3IgaW5zLmFwcGxpY2FudCBpcyBjdXJyZW50X3VzZXJfaWQpXHJcblx0XHRcdFx0Ym94ID0gJ3BlbmRpbmcnXHJcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdjb21wbGV0ZWQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxyXG5cdFx0XHRcdGJveCA9ICdjb21wbGV0ZWQnXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHQjIOmqjOivgWxvZ2luIHVzZXJfaWTlr7nor6XmtYHnqIvmnInnrqHnkIbjgIHop4Llr5/nlLPor7fljZXnmoTmnYPpmZBcclxuXHRcdFx0XHRwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHsgZmllbGRzOiB7IGFkbWluczogMSB9IH0pXHJcblx0XHRcdFx0aWYgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZG1pblwiKSBvciBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcIm1vbml0b3JcIikgb3Igc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZClcclxuXHRcdFx0XHRcdGJveCA9ICdtb25pdG9yJ1xyXG5cdFx0XHR3b3JrZmxvd1VybCA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXM/LndvcmtmbG93Py51cmxcclxuXHRcdFx0aWYgYm94XHJcblx0XHRcdFx0cmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS8je2JveH0vI3tpbnNJZH0/WC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vcHJpbnQvI3tpbnNJZH0/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcclxuXHJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0XHRkYXRhOiB7IHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGVsc2VcclxuXHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXHJcblx0XHRcdGlmIGNvbGxlY3Rpb25cclxuXHRcdFx0XHRjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcclxuXHRcdFx0XHRcdCR1bnNldDoge1xyXG5cdFx0XHRcdFx0XHRcImluc3RhbmNlc1wiOiAxLFxyXG5cdFx0XHRcdFx0XHRcImluc3RhbmNlX3N0YXRlXCI6IDFcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKVxyXG5cclxuXHRjYXRjaCBlXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxyXG5cdFx0fVxyXG5cclxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJveCwgY29sbGVjdGlvbiwgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgZmxvd0lkLCBoYXNoRGF0YSwgaW5zLCBpbnNJZCwgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25zLCByZWNvcmRfaWQsIHJlZGlyZWN0X3VybCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCBzcGFjZSwgc3BhY2VJZCwgc3BhY2VfaWQsIHdvcmtmbG93VXJsLCB4X2F1dGhfdG9rZW4sIHhfdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWU7XG4gICAgcmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkO1xuICAgIHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWQ7XG4gICAgY2hlY2sob2JqZWN0X25hbWUsIFN0cmluZyk7XG4gICAgY2hlY2socmVjb3JkX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkO1xuICAgIHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgeF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXTtcbiAgICByZWRpcmVjdF91cmwgPSBcIi9cIjtcbiAgICBpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpO1xuICAgIGlmIChpbnMpIHtcbiAgICAgIGJveCA9ICcnO1xuICAgICAgc3BhY2VJZCA9IGlucy5zcGFjZTtcbiAgICAgIGZsb3dJZCA9IGlucy5mbG93O1xuICAgICAgaWYgKCgocmVmID0gaW5zLmluYm94X3VzZXJzKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHx8ICgocmVmMSA9IGlucy5jY191c2VycykgIT0gbnVsbCA/IHJlZjEuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgYm94ID0gJ2luYm94JztcbiAgICAgIH0gZWxzZSBpZiAoKHJlZjIgPSBpbnMub3V0Ym94X3VzZXJzKSAhPSBudWxsID8gcmVmMi5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSB7XG4gICAgICAgIGJveCA9ICdvdXRib3gnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdkcmFmdCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdkcmFmdCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ3BlbmRpbmcnICYmIChpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQgfHwgaW5zLmFwcGxpY2FudCA9PT0gY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICBib3ggPSAncGVuZGluZyc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2NvbXBsZXRlZCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdjb21wbGV0ZWQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpO1xuICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGFkbWluczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIHx8IHBlcm1pc3Npb25zLmluY2x1ZGVzKFwibW9uaXRvclwiKSB8fCBzcGFjZS5hZG1pbnMuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICAgIGJveCA9ICdtb25pdG9yJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgd29ya2Zsb3dVcmwgPSAocmVmMyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcykgIT0gbnVsbCA/IChyZWY0ID0gcmVmMy53b3JrZmxvdykgIT0gbnVsbCA/IHJlZjQudXJsIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGJveCkge1xuICAgICAgICByZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgKFwid29ya2Zsb3cvc3BhY2UvXCIgKyBzcGFjZUlkICsgXCIvXCIgKyBib3ggKyBcIi9cIiArIGluc0lkICsgXCI/WC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9wcmludC9cIiArIGluc0lkICsgXCI/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH1cbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKTtcbiAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xuICAgICAgICAgICR1bnNldDoge1xuICAgICAgICAgICAgXCJpbnN0YW5jZXNcIjogMSxcbiAgICAgICAgICAgIFwiaW5zdGFuY2Vfc3RhdGVcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+eUs+ivt+WNleW3suWIoOmZpCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpIC0+XHJcblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKT8uX3NjaGVtYVxyXG5cdGNvbHVtbl9udW0gPSAwXHJcblx0aWYgX3NjaGVtYVxyXG5cdFx0Xy5lYWNoIGNvbHVtbnMsIChmaWVsZF9uYW1lKSAtPlxyXG5cdFx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxyXG5cdFx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXHJcblx0XHRcdGlmIGlzX3dpZGVcclxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMVxyXG5cclxuXHRcdGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW1cclxuXHRcdHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnRcclxuXHJcbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIC0+XHJcblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hXHJcblx0aWYgX3NjaGVtYVxyXG5cdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcclxuXHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcclxuXHRcdHJldHVybiBpc193aWRlXHJcblxyXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSAtPlxyXG5cdHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zPy5zZXR0aW5ncz8uZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wifSlcclxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRjb2x1bW5zID0gXy5tYXAgY29sdW1ucywgKGNvbHVtbiktPlxyXG5cdFx0ZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl1cclxuXHRcdGlmIGZpZWxkPy50eXBlIGFuZCAhZmllbGQuaGlkZGVuXHJcblx0XHRcdHJldHVybiBjb2x1bW5cclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxyXG5cdGNvbHVtbnMgPSBfLmNvbXBhY3QgY29sdW1uc1xyXG5cdGlmIHNldHRpbmcgYW5kIHNldHRpbmcuc2V0dGluZ3NcclxuXHRcdHNvcnQgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0/LnNvcnQgfHwgW11cclxuXHRcdHNvcnQgPSBfLm1hcCBzb3J0LCAob3JkZXIpLT5cclxuXHRcdFx0a2V5ID0gb3JkZXJbMF1cclxuXHRcdFx0aW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KVxyXG5cdFx0XHRvcmRlclswXSA9IGluZGV4ICsgMVxyXG5cdFx0XHRyZXR1cm4gb3JkZXJcclxuXHRcdHJldHVybiBzb3J0XHJcblx0cmV0dXJuIFtdXHJcblxyXG5cclxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cclxuXHRleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl1cclxuXHRkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdXHJcblx0aWYgZGVmYXVsdF9leHRyYV9jb2x1bW5zXHJcblx0XHRleHRyYV9jb2x1bW5zID0gXy51bmlvbiBleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcclxuXHJcblx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0Q3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHM/W29iamVjdF9uYW1lXSA9IFtdXHJcblxyXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IChkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpLT5cclxuXHRkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/LmNvbHVtbnNcclxuXHRkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3Py5tb2JpbGVfY29sdW1uc1xyXG5cdHVubGVzcyBsaXN0X3ZpZXdcclxuXHRcdHJldHVyblxyXG5cdG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpXHJcblx0aWYgIV8uaGFzKG9pdGVtLCBcIm5hbWVcIilcclxuXHRcdG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZVxyXG5cdGlmICFvaXRlbS5jb2x1bW5zXHJcblx0XHRpZiBkZWZhdWx0X2NvbHVtbnNcclxuXHRcdFx0b2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1uc1xyXG5cdGlmICFvaXRlbS5jb2x1bW5zXHJcblx0XHRvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXVxyXG5cdGlmICFvaXRlbS5tb2JpbGVfY29sdW1uc1xyXG5cdFx0aWYgZGVmYXVsdF9tb2JpbGVfY29sdW1uc1xyXG5cdFx0XHRvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcclxuXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKVxyXG5cdFx0XHRvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJylcclxuXHJcblxyXG5cdGlmICFvaXRlbS5maWx0ZXJfc2NvcGVcclxuXHRcdCMgbGlzdHZpZXfop4blm77nmoRmaWx0ZXJfc2NvcGXpu5jorqTlgLzmlLnkuLpzcGFjZSAjMTMxXHJcblx0XHRvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCJcclxuXHJcblx0aWYgIV8uaGFzKG9pdGVtLCBcIl9pZFwiKVxyXG5cdFx0b2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWVcclxuXHRlbHNlXHJcblx0XHRvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lXHJcblxyXG5cdGlmIF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucylcclxuXHRcdG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpXHJcblxyXG5cdF8uZm9yRWFjaCBvaXRlbS5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cclxuXHRcdGlmICFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcilcclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXHJcblx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXHJcblx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcclxuXHRyZXR1cm4gb2l0ZW1cclxuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHR1bmxlc3Mgb2JqZWN0X25hbWVcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRyZWxhdGVkTGlzdE9iamVjdHMgPSB7fVxyXG5cdFx0cmVsYXRlZExpc3ROYW1lcyA9IFtdXHJcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRpZiBfb2JqZWN0XHJcblx0XHRcdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxyXG5cdFx0XHRpZiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XHJcblx0XHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0LCAob2JqT3JOYW1lKS0+XHJcblx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0IG9iak9yTmFtZVxyXG5cdFx0XHRcdFx0XHRyZWxhdGVkID1cclxuXHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWVcclxuXHRcdFx0XHRcdFx0XHRjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1uc1xyXG5cdFx0XHRcdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBvYmpPck5hbWUubW9iaWxlX2NvbHVtbnNcclxuXHRcdFx0XHRcdFx0XHRpc19maWxlOiBvYmpPck5hbWUub2JqZWN0TmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHRcdFx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uOiBvYmpPck5hbWUuZmlsdGVyc1xyXG5cdFx0XHRcdFx0XHRcdHNvcnQ6IG9iak9yTmFtZS5zb3J0XHJcblx0XHRcdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiAnJ1xyXG5cdFx0XHRcdFx0XHRcdGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlXHJcblx0XHRcdFx0XHRcdFx0bGFiZWw6IG9iak9yTmFtZS5sYWJlbFxyXG5cdFx0XHRcdFx0XHRcdGFjdGlvbnM6IG9iak9yTmFtZS5hY3Rpb25zXHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkXHJcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWUub2JqZWN0TmFtZVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzU3RyaW5nIG9iak9yTmFtZVxyXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE5hbWVzLnB1c2ggb2JqT3JOYW1lXHJcblxyXG5cdFx0bWFwTGlzdCA9IHt9XHJcblx0XHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKVxyXG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIC0+XHJcblx0XHRcdGlmICFyZWxhdGVkX29iamVjdF9pdGVtPy5vYmplY3RfbmFtZVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZVxyXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5XHJcblx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZF9vYmplY3RfaXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxyXG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHVubGVzcyByZWxhdGVkX29iamVjdFxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXHJcblx0XHRcdGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxyXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXVxyXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxyXG5cclxuXHRcdFx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXHJcblx0XHRcdHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpXHJcblxyXG5cdFx0XHRpZiAvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSlcclxuXHRcdFx0XHQjIG9iamVjdOexu+Wei+W4puWtkOWxnuaAp+eahHJlbGF0ZWRfZmllbGRfbmFtZeimgeWOu+aOieS4remXtOeahOe+juWFg+espuWPt++8jOWQpuWImeaYvuekuuS4jeWHuuWtl+auteWAvFxyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLFwiXCIpXHJcblx0XHRcdHJlbGF0ZWQgPVxyXG5cdFx0XHRcdG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lXHJcblx0XHRcdFx0Y29sdW1uczogY29sdW1uc1xyXG5cdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBtb2JpbGVfY29sdW1uc1xyXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXHJcblx0XHRcdFx0aXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXHJcblx0XHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXHJcblxyXG5cdFx0XHRyZWxhdGVkT2JqZWN0ID0gcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXHJcblx0XHRcdGlmIHJlbGF0ZWRPYmplY3RcclxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmNvbHVtbnNcclxuXHRcdFx0XHRcdHJlbGF0ZWQuY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QuY29sdW1uc1xyXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnNcclxuXHRcdFx0XHRcdHJlbGF0ZWQubW9iaWxlX2NvbHVtbnMgPSByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXHJcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5zb3J0XHJcblx0XHRcdFx0XHRyZWxhdGVkLnNvcnQgPSByZWxhdGVkT2JqZWN0LnNvcnRcclxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvblxyXG5cdFx0XHRcdFx0cmVsYXRlZC5maWx0ZXJzRnVuY3Rpb24gPSByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvblxyXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3RcclxuXHRcdFx0XHRcdHJlbGF0ZWQuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QgPSByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XHJcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5sYWJlbFxyXG5cdFx0XHRcdFx0cmVsYXRlZC5sYWJlbCA9IHJlbGF0ZWRPYmplY3QubGFiZWxcclxuXHRcdFx0XHRkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXHJcblxyXG5cdFx0XHRtYXBMaXN0W3JlbGF0ZWQub2JqZWN0X25hbWVdID0gcmVsYXRlZFxyXG5cclxuXHJcblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfLnZhbHVlcyhyZWxhdGVkTGlzdE9iamVjdHMpLCBcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHNcclxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0T2JqZWN0cywgKHYsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIC0+XHJcblx0XHRcdGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xXHJcblx0XHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXHJcblx0XHRcdGlmIGlzQWN0aXZlICYmIGFsbG93UmVhZFxyXG5cdFx0XHRcdG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2XHJcblxyXG5cdFx0bGlzdCA9IFtdXHJcblx0XHRpZiBfLmlzRW1wdHkgcmVsYXRlZExpc3ROYW1lc1xyXG5cdFx0XHRsaXN0ID0gIF8udmFsdWVzIG1hcExpc3RcclxuXHRcdGVsc2VcclxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0TmFtZXMsIChvYmplY3ROYW1lKSAtPlxyXG5cdFx0XHRcdGlmIG1hcExpc3Rbb2JqZWN0TmFtZV1cclxuXHRcdFx0XHRcdGxpc3QucHVzaCBtYXBMaXN0W29iamVjdE5hbWVdXHJcblxyXG5cdFx0aWYgXy5oYXMoX29iamVjdCwgJ2FsbG93X3JlbGF0ZWRMaXN0JylcclxuXHRcdFx0bGlzdCA9IF8uZmlsdGVyIGxpc3QsIChpdGVtKS0+XHJcblx0XHRcdFx0cmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKVxyXG5cclxuXHRcdHJldHVybiBsaXN0XHJcblxyXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUpLT5cclxuXHRyZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpXHJcblxyXG4jIyMgXHJcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XHJcblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cclxuIyMjXHJcbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYyktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxyXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGlmICFvYmplY3RcclxuXHRcdHJldHVyblxyXG5cdGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKVxyXG5cdHVubGVzcyBsaXN0Vmlld3M/Lmxlbmd0aFxyXG5cdFx0cmV0dXJuXHJcblx0bGlzdF92aWV3ID0gXy5maW5kV2hlcmUobGlzdFZpZXdzLHtcIl9pZFwiOmxpc3Rfdmlld19pZH0pXHJcblx0dW5sZXNzIGxpc3Rfdmlld1xyXG5cdFx0IyDlpoLmnpzkuI3pnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzliJnpu5jorqTov5Tlm57nrKzkuIDkuKrop4blm77vvIzlj43kuYvov5Tlm57nqbpcclxuXHRcdGlmIGV4YWNcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRlbHNlXHJcblx0XHRcdGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXVxyXG5cdHJldHVybiBsaXN0X3ZpZXdcclxuXHJcbiPojrflj5ZsaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77mmK/lkKbmmK/mnIDov5Hmn6XnnIvop4blm75cclxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdGlmICFvYmplY3RfbmFtZVxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcclxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcclxuXHRpZiB0eXBlb2YobGlzdF92aWV3X2lkKSA9PSBcInN0cmluZ1wiXHJcblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRcdGlmICFvYmplY3RcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLHtfaWQ6IGxpc3Rfdmlld19pZH0pXHJcblx0ZWxzZVxyXG5cdFx0bGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWRcclxuXHRyZXR1cm4gbGlzdFZpZXc/Lm5hbWUgPT0gXCJyZWNlbnRcIlxyXG5cclxuXHJcbiMjI1xyXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcclxuXHTop4TliJnvvJpcclxuXHQxLuS8mOWFiOaKimNvbHVtbnPkuK3nmoRuYW1l5a2X5q615o6S5Zyo56ys5LiA5LiqXHJcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XHJcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcclxuIyMjXHJcbkNyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpLT5cclxuXHRyZXN1bHQgPSBbXVxyXG5cdG1heFJvd3MgPSAyIFxyXG5cdG1heENvdW50ID0gbWF4Um93cyAqIDJcclxuXHRjb3VudCA9IDBcclxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHRmaWVsZHMgPSBvYmplY3QuZmllbGRzXHJcblx0dW5sZXNzIG9iamVjdFxyXG5cdFx0cmV0dXJuIGNvbHVtbnNcclxuXHRuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXHJcblx0aXNOYW1lQ29sdW1uID0gKGl0ZW0pLT5cclxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0cmV0dXJuIGl0ZW0uZmllbGQgPT0gbmFtZUtleVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gaXRlbSA9PSBuYW1lS2V5XHJcblx0Z2V0RmllbGQgPSAoaXRlbSktPlxyXG5cdFx0aWYgXy5pc09iamVjdChpdGVtKVxyXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW0uZmllbGRdXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBmaWVsZHNbaXRlbV1cclxuXHRpZiBuYW1lS2V5XHJcblx0XHRuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kIChpdGVtKS0+XHJcblx0XHRcdHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSlcclxuXHRpZiBuYW1lQ29sdW1uXHJcblx0XHRmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pXHJcblx0XHRpdGVtQ291bnQgPSBpZiBmaWVsZC5pc193aWRlIHRoZW4gMiBlbHNlIDFcclxuXHRcdGNvdW50ICs9IGl0ZW1Db3VudFxyXG5cdFx0cmVzdWx0LnB1c2ggbmFtZUNvbHVtblxyXG5cdGNvbHVtbnMuZm9yRWFjaCAoaXRlbSktPlxyXG5cdFx0ZmllbGQgPSBnZXRGaWVsZChpdGVtKVxyXG5cdFx0dW5sZXNzIGZpZWxkXHJcblx0XHRcdHJldHVyblxyXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXHJcblx0XHRpZiBjb3VudCA8IG1heENvdW50IGFuZCByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgYW5kICFpc05hbWVDb2x1bW4oaXRlbSlcclxuXHRcdFx0Y291bnQgKz0gaXRlbUNvdW50XHJcblx0XHRcdGlmIGNvdW50IDw9IG1heENvdW50XHJcblx0XHRcdFx0cmVzdWx0LnB1c2ggaXRlbVxyXG5cdFxyXG5cdHJldHVybiByZXN1bHRcclxuXHJcbiMjI1xyXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XHJcbiMjI1xyXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0aWYgIW9iamVjdFxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxyXG5cdGlmIG9iamVjdD8ubGlzdF92aWV3cz8uZGVmYXVsdFxyXG5cdFx0I1RPRE8g5q2k5Luj56CB5Y+q5piv5pqC5pe25YW85a655Lul5YmNY29kZeS4reWumuS5ieeahGRlZmF1bHTop4blm77vvIzlvoVjb2Rl5Lit55qEZGVmYXVsdOa4heeQhuWujOaIkOWQju+8jOmcgOimgeWIoOmZpOatpOS7o+eggVxyXG5cdFx0ZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3cy5kZWZhdWx0XHJcblx0ZWxzZVxyXG5cdFx0Xy5lYWNoIG9iamVjdD8ubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KS0+XHJcblx0XHRcdGlmIGxpc3Rfdmlldy5uYW1lID09IFwiYWxsXCIgfHwga2V5ID09IFwiYWxsXCJcclxuXHRcdFx0XHRkZWZhdWx0VmlldyA9IGxpc3Rfdmlld1xyXG5cdHJldHVybiBkZWZhdWx0VmlldztcclxuXHJcbiMjI1xyXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XHJcbiMjI1xyXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpLT5cclxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXHJcblx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Py5jb2x1bW5zXHJcblx0aWYgdXNlX21vYmlsZV9jb2x1bW5zXHJcblx0XHRpZiBkZWZhdWx0Vmlldz8ubW9iaWxlX2NvbHVtbnNcclxuXHRcdFx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zXHJcblx0XHRlbHNlIGlmIGNvbHVtbnNcclxuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpXHJcblx0cmV0dXJuIGNvbHVtbnNcclxuXHJcbiMjI1xyXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxyXG4jIyNcclxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdHJldHVybiBkZWZhdWx0Vmlldz8uZXh0cmFfY29sdW1uc1xyXG5cclxuIyMjXHJcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXHJcbiMjI1xyXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gKG9iamVjdF9uYW1lKS0+XHJcblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxyXG5cdGlmIGRlZmF1bHRWaWV3XHJcblx0XHRpZiBkZWZhdWx0Vmlldy5zb3J0XHJcblx0XHRcdHJldHVybiBkZWZhdWx0Vmlldy5zb3J0XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dXHJcblxyXG5cclxuIyMjXHJcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xyXG4jIyNcclxuQ3JlYXRvci5pc0FsbFZpZXcgPSAobGlzdF92aWV3KS0+XHJcblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcImFsbFwiXHJcblxyXG4jIyNcclxuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XHJcbiMjI1xyXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IChsaXN0X3ZpZXcpLT5cclxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwicmVjZW50XCJcclxuXHJcbiMjI1xyXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cclxuIyMjXHJcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IChzb3J0LCB0YWJ1bGFyQ29sdW1ucyktPlxyXG5cdHRhYnVsYXJfc29ydCA9IFtdXHJcblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XHJcblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcclxuXHRcdFx0IyDlhbzlrrnml6fnmoTmlbDmja7moLzlvI9bW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxyXG5cdFx0XHRpZiBpdGVtLmxlbmd0aCA9PSAxXHJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxyXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXHJcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBcImFzY1wiXVxyXG5cdFx0XHRlbHNlIGlmIGl0ZW0ubGVuZ3RoID09IDJcclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pXHJcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcclxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dXHJcblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcclxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cclxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxyXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSlcclxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxyXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgb3JkZXJdXHJcblxyXG5cdHJldHVybiB0YWJ1bGFyX3NvcnRcclxuXHJcbiMjI1xyXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cclxuIyMjXHJcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSAoc29ydCktPlxyXG5cdGR4X3NvcnQgPSBbXVxyXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxyXG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXHJcblx0XHRcdCPlhbzlrrnml6fmoLzlvI/vvJpbW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxyXG5cdFx0XHRkeF9zb3J0LnB1c2goaXRlbSlcclxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxyXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxyXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXHJcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXHJcblx0XHRcdFx0ZHhfc29ydC5wdXNoIFtmaWVsZF9uYW1lLCBvcmRlcl1cclxuXHJcblx0cmV0dXJuIGR4X3NvcnRcclxuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIF9zY2hlbWEsIGNvbHVtbl9udW0sIGluaXRfd2lkdGhfcGVyY2VudCwgcmVmO1xuICBfc2NoZW1hID0gKHJlZiA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5fc2NoZW1hIDogdm9pZCAwO1xuICBjb2x1bW5fbnVtID0gMDtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgICAgdmFyIGZpZWxkLCBpc193aWRlLCByZWYxLCByZWYyO1xuICAgICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgICBpc193aWRlID0gKHJlZjEgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjIuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc193aWRlKSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW07XG4gICAgcmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSB7XG4gIHZhciBfc2NoZW1hLCBmaWVsZCwgaXNfd2lkZSwgcmVmLCByZWYxO1xuICBfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWE7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgaXNfd2lkZSA9IChyZWYgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIHJldHVybiBpc193aWRlO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgdmFyIG9iaiwgcmVmLCByZWYxLCByZWYyLCBzZXR0aW5nLCBzb3J0O1xuICBzZXR0aW5nID0gKHJlZiA9IENyZWF0b3IuQ29sbGVjdGlvbnMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5zZXR0aW5ncykgIT0gbnVsbCA/IHJlZjEuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IF8ubWFwKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgIHZhciBmaWVsZDtcbiAgICBmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXTtcbiAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSAmJiAhZmllbGQuaGlkZGVuKSB7XG4gICAgICByZXR1cm4gY29sdW1uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgfSk7XG4gIGNvbHVtbnMgPSBfLmNvbXBhY3QoY29sdW1ucyk7XG4gIGlmIChzZXR0aW5nICYmIHNldHRpbmcuc2V0dGluZ3MpIHtcbiAgICBzb3J0ID0gKChyZWYyID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gcmVmMi5zb3J0IDogdm9pZCAwKSB8fCBbXTtcbiAgICBzb3J0ID0gXy5tYXAoc29ydCwgZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgIHZhciBpbmRleCwga2V5O1xuICAgICAga2V5ID0gb3JkZXJbMF07XG4gICAgICBpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpO1xuICAgICAgb3JkZXJbMF0gPSBpbmRleCArIDE7XG4gICAgICByZXR1cm4gb3JkZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucywgZXh0cmFfY29sdW1ucywgb2JqZWN0LCBvcmRlciwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICBleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl07XG4gIGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl07XG4gIGlmIChkZWZhdWx0X2V4dHJhX2NvbHVtbnMpIHtcbiAgICBleHRyYV9jb2x1bW5zID0gXy51bmlvbihleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMpO1xuICB9XG4gIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW107XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gKHJlZiA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzKSAhPSBudWxsID8gcmVmW29iamVjdF9uYW1lXSA9IFtdIDogdm9pZCAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IGZ1bmN0aW9uKGRlZmF1bHRfdmlldywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSkge1xuICB2YXIgZGVmYXVsdF9jb2x1bW5zLCBkZWZhdWx0X21vYmlsZV9jb2x1bW5zLCBvaXRlbTtcbiAgZGVmYXVsdF9jb2x1bW5zID0gZGVmYXVsdF92aWV3ICE9IG51bGwgPyBkZWZhdWx0X3ZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldyAhPSBudWxsID8gZGVmYXVsdF92aWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIHJldHVybjtcbiAgfVxuICBvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KTtcbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpKSB7XG4gICAgb2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lO1xuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdO1xuICB9XG4gIGlmICghb2l0ZW0ubW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9tb2JpbGVfY29sdW1ucykge1xuICAgICAgb2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJyk7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uZmlsdGVyX3Njb3BlKSB7XG4gICAgb2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiO1xuICB9XG4gIGlmICghXy5oYXMob2l0ZW0sIFwiX2lkXCIpKSB7XG4gICAgb2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWU7XG4gIH0gZWxzZSB7XG4gICAgb2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZTtcbiAgfVxuICBpZiAoXy5pc1N0cmluZyhvaXRlbS5vcHRpb25zKSkge1xuICAgIG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpO1xuICB9XG4gIF8uZm9yRWFjaChvaXRlbS5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgIGlmICghXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2l0ZW07XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVsYXRlZExpc3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciBfb2JqZWN0LCBsaXN0LCBtYXBMaXN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TmFtZXMsIHJlbGF0ZWRMaXN0T2JqZWN0cywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgc3BhY2VJZCwgdW5yZWxhdGVkX29iamVjdHMsIHVzZXJJZDtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlbGF0ZWRMaXN0T2JqZWN0cyA9IHt9O1xuICAgIHJlbGF0ZWRMaXN0TmFtZXMgPSBbXTtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gICAgICBpZiAoIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICAgICAgXy5lYWNoKHJlbGF0ZWRMaXN0LCBmdW5jdGlvbihvYmpPck5hbWUpIHtcbiAgICAgICAgICB2YXIgcmVsYXRlZDtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChvYmpPck5hbWUpKSB7XG4gICAgICAgICAgICByZWxhdGVkID0ge1xuICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWUsXG4gICAgICAgICAgICAgIGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zLFxuICAgICAgICAgICAgICBtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zLFxuICAgICAgICAgICAgICBpc19maWxlOiBvYmpPck5hbWUub2JqZWN0TmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgICAgICAgZmlsdGVyc0Z1bmN0aW9uOiBvYmpPck5hbWUuZmlsdGVycyxcbiAgICAgICAgICAgICAgc29ydDogb2JqT3JOYW1lLnNvcnQsXG4gICAgICAgICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogJycsXG4gICAgICAgICAgICAgIGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlLFxuICAgICAgICAgICAgICBsYWJlbDogb2JqT3JOYW1lLmxhYmVsLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBvYmpPck5hbWUuYWN0aW9uc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUub2JqZWN0TmFtZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE5hbWVzLnB1c2gob2JqT3JOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBtYXBMaXN0ID0ge307XG4gICAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfaXRlbSkge1xuICAgICAgdmFyIGNvbHVtbnMsIG1vYmlsZV9jb2x1bW5zLCBvcmRlciwgcmVsYXRlZCwgcmVsYXRlZE9iamVjdCwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgdGFidWxhcl9vcmRlciwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICBpZiAoIShyZWxhdGVkX29iamVjdF9pdGVtICE9IG51bGwgPyByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZTtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXk7XG4gICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICByZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFyZWxhdGVkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgY29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgbW9iaWxlX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRydWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpO1xuICAgICAgaWYgKC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKSkge1xuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLywgXCJcIik7XG4gICAgICB9XG4gICAgICByZWxhdGVkID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zLFxuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgaXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICB9O1xuICAgICAgcmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChyZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmNvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5zb3J0KSB7XG4gICAgICAgICAgcmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbikge1xuICAgICAgICAgIHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QpIHtcbiAgICAgICAgICByZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5sYWJlbCkge1xuICAgICAgICAgIHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWQ7XG4gICAgfSk7XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF8udmFsdWVzKHJlbGF0ZWRMaXN0T2JqZWN0cyksIFwib2JqZWN0X25hbWVcIik7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UocmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzKTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3RPYmplY3RzLCBmdW5jdGlvbih2LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgYWxsb3dSZWFkLCBpc0FjdGl2ZSwgcmVmO1xuICAgICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgICBhbGxvd1JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLmFsbG93UmVhZCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0FjdGl2ZSAmJiBhbGxvd1JlYWQpIHtcbiAgICAgICAgcmV0dXJuIG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxpc3QgPSBbXTtcbiAgICBpZiAoXy5pc0VtcHR5KHJlbGF0ZWRMaXN0TmFtZXMpKSB7XG4gICAgICBsaXN0ID0gXy52YWx1ZXMobWFwTGlzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChyZWxhdGVkTGlzdE5hbWVzLCBmdW5jdGlvbihvYmplY3ROYW1lKSB7XG4gICAgICAgIGlmIChtYXBMaXN0W29iamVjdE5hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3QucHVzaChtYXBMaXN0W29iamVjdE5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmhhcyhfb2JqZWN0LCAnYWxsb3dfcmVsYXRlZExpc3QnKSkge1xuICAgICAgbGlzdCA9IF8uZmlsdGVyKGxpc3QsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdDtcbiAgfTtcbn1cblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKTtcbn07XG5cblxuLyogXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxuXHRleGFj5Li6dHJ1ZeaXtu+8jOmcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOS4jem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKSB7XG4gIHZhciBsaXN0Vmlld3MsIGxpc3Rfdmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICBpZiAoIShsaXN0Vmlld3MgIT0gbnVsbCA/IGxpc3RWaWV3cy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RfdmlldyA9IF8uZmluZFdoZXJlKGxpc3RWaWV3cywge1xuICAgIFwiX2lkXCI6IGxpc3Rfdmlld19pZFxuICB9KTtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICBpZiAoZXhhYykge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF07XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0X3ZpZXc7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3SXNSZWNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciBsaXN0Vmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgbGlzdF92aWV3X2lkID09PSBcInN0cmluZ1wiKSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3MsIHtcbiAgICAgIF9pZDogbGlzdF92aWV3X2lkXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWQ7XG4gIH1cbiAgcmV0dXJuIChsaXN0VmlldyAhPSBudWxsID8gbGlzdFZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcblx06KeE5YiZ77yaXG5cdDEu5LyY5YWI5oqKY29sdW1uc+S4reeahG5hbWXlrZfmrrXmjpLlnKjnrKzkuIDkuKpcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXG4gKi9cblxuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBjb3VudCwgZmllbGQsIGZpZWxkcywgZ2V0RmllbGQsIGlzTmFtZUNvbHVtbiwgaXRlbUNvdW50LCBtYXhDb3VudCwgbWF4Um93cywgbmFtZUNvbHVtbiwgbmFtZUtleSwgb2JqZWN0LCByZXN1bHQ7XG4gIHJlc3VsdCA9IFtdO1xuICBtYXhSb3dzID0gMjtcbiAgbWF4Q291bnQgPSBtYXhSb3dzICogMjtcbiAgY291bnQgPSAwO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IG9iamVjdC5maWVsZHM7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cbiAgbmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgaXNOYW1lQ29sdW1uID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gaXRlbS5maWVsZCA9PT0gbmFtZUtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZW0gPT09IG5hbWVLZXk7XG4gICAgfVxuICB9O1xuICBnZXRGaWVsZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtXTtcbiAgICB9XG4gIH07XG4gIGlmIChuYW1lS2V5KSB7XG4gICAgbmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZChmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pO1xuICAgIH0pO1xuICB9XG4gIGlmIChuYW1lQ29sdW1uKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKTtcbiAgICBpdGVtQ291bnQgPSBmaWVsZC5pc193aWRlID8gMiA6IDE7XG4gICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgIHJlc3VsdC5wdXNoKG5hbWVDb2x1bW4pO1xuICB9XG4gIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChpdGVtKTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBpZiAoY291bnQgPCBtYXhDb3VudCAmJiByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgJiYgIWlzTmFtZUNvbHVtbihpdGVtKSkge1xuICAgICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgICAgaWYgKGNvdW50IDw9IG1heENvdW50KSB7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKlxuICAgIOiOt+WPlum7mOiupOinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXcsIG9iamVjdCwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgfVxuICBpZiAob2JqZWN0ICE9IG51bGwgPyAocmVmID0gb2JqZWN0Lmxpc3Rfdmlld3MpICE9IG51bGwgPyByZWZbXCJkZWZhdWx0XCJdIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3c1tcImRlZmF1bHRcIl07XG4gIH0gZWxzZSB7XG4gICAgXy5lYWNoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0Lmxpc3Rfdmlld3MgOiB2b2lkIDAsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG4gICAgICBpZiAobGlzdF92aWV3Lm5hbWUgPT09IFwiYWxsXCIgfHwga2V5ID09PSBcImFsbFwiKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmlldyA9IGxpc3RfdmlldztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZpZXc7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICh1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwKSB7XG4gICAgICBjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChjb2x1bW5zKSB7XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2x1bW5zO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuZXh0cmFfY29sdW1ucyA6IHZvaWQgMDtcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgaWYgKGRlZmF1bHRWaWV3KSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3LnNvcnQpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0Vmlldy5zb3J0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXTtcbiAgICB9XG4gIH1cbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuICovXG5cbkNyZWF0b3IuaXNBbGxWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwiYWxsXCI7XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gZnVuY3Rpb24oc29ydCwgdGFidWxhckNvbHVtbnMpIHtcbiAgdmFyIHRhYnVsYXJfc29ydDtcbiAgdGFidWxhcl9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGNvbHVtbl9pbmRleCwgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgaWYgKGl0ZW0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBcImFzY1wiXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBvcmRlcl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhYnVsYXJfc29ydDtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBkeF9zb3J0O1xuICBkeF9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChbZmllbGRfbmFtZSwgb3JkZXJdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZHhfc29ydDtcbn07XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cclxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJ9XHJcblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xyXG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXHJcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cclxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJ9XHJcblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xyXG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXHJcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCIvLyDlm6DkuLptZXRlb3LnvJbor5Fjb2ZmZWVzY3JpcHTkvJrlr7zoh7RldmFs5Ye95pWw5oql6ZSZ77yM5omA5Lul5Y2V54us5YaZ5Zyo5LiA5LiqanPmlofku7bkuK3jgIJcclxuQ3JlYXRvci5ldmFsSW5Db250ZXh0ID0gZnVuY3Rpb24oanMsIGNvbnRleHQpIHtcclxuICAgIC8vIyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgdGhlIGluLWxpbmUgYW5vbnltb3VzIGZ1bmN0aW9uIHdlIC5jYWxsIHdpdGggdGhlIHBhc3NlZCBjb250ZXh0XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7IFxyXG4gICAgXHRyZXR1cm4gZXZhbChqcyk7IFxyXG5cdH0uY2FsbChjb250ZXh0KTtcclxufVxyXG5cclxuXHJcbkNyZWF0b3IuZXZhbCA9IGZ1bmN0aW9uKGpzKXtcclxuXHR0cnl7XHJcblx0XHRyZXR1cm4gZXZhbChqcylcclxuXHR9Y2F0Y2ggKGUpe1xyXG5cdFx0Y29uc29sZS5lcnJvcihlLCBqcyk7XHJcblx0fVxyXG59OyIsIlx0Z2V0T3B0aW9uID0gKG9wdGlvbiktPlxyXG5cdFx0Zm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKVxyXG5cdFx0aWYgZm9vLmxlbmd0aCA+IDJcclxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdLCBjb2xvcjogZm9vWzJdfVxyXG5cdFx0ZWxzZSBpZiBmb28ubGVuZ3RoID4gMVxyXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV19XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1swXX1cclxuXHJcblx0Y29udmVydEZpZWxkID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCktPlxyXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xyXG5cdFx0XHRjb2RlID0gZmllbGQucGlja2xpc3QgfHwgXCIje29iamVjdF9uYW1lfS4je2ZpZWxkX25hbWV9XCI7XHJcblx0XHRcdGlmIGNvZGVcclxuXHRcdFx0XHRwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0aWYgcGlja2xpc3RcclxuXHRcdFx0XHRcdG9wdGlvbnMgPSBbXTtcclxuXHRcdFx0XHRcdGFsbE9wdGlvbnMgPSBbXTtcclxuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KVxyXG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpPy5yZXZlcnNlKCk7XHJcblx0XHRcdFx0XHRfLmVhY2ggcGlja2xpc3RPcHRpb25zLCAoaXRlbSktPlxyXG5cdFx0XHRcdFx0XHRsYWJlbCA9IGl0ZW0ubmFtZVxyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdGFsbE9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGVuYWJsZTogaXRlbS5lbmFibGUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbmFibGVcclxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLnB1c2goe2xhYmVsOiBsYWJlbCwgdmFsdWU6IHZhbHVlLCBjb2xvcjogaXRlbS5jb2xvcn0pXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZGVmYXVsdFxyXG5cdFx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlXHJcblx0XHRcdFx0XHRpZiBvcHRpb25zLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IG9wdGlvbnNcclxuXHRcdFx0XHRcdGlmIGFsbE9wdGlvbnMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRmaWVsZC5hbGxPcHRpb25zID0gYWxsT3B0aW9uc1xyXG5cdFx0cmV0dXJuIGZpZWxkO1xyXG5cclxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3QgPSAob2JqZWN0LCBzcGFjZUlkKS0+XHJcblx0XHRpZiAhb2JqZWN0XHJcblx0XHRcdHJldHVyblxyXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxyXG5cclxuXHRcdFx0aWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiKVxyXG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXI/Ll90b2RvXHJcblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcclxuXHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxyXG5cdFx0XHRcdFx0I+WPquaciXVwZGF0ZeaXtu+8jCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyDmiY3mnInlgLxcclxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj++8jOWwpOWFtuaYr0NvbGxlY3Rpb25cclxuXHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXsje190b2RvX2Zyb21fZGJ9fSlcIilcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCJcclxuXHRcdFx0XHRfdG9kbyA9IHRyaWdnZXIudG9kb1xyXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcclxuXHRcdFx0XHRcdHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpXHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XHJcblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uPy5fdG9kb1xyXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSBhY3Rpb24/LnRvZG9cclxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlXHJcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXHJcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxyXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24oKXsje190b2RvX2Zyb21fZGJ9fSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3JcclxuXHJcblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/Ll92aXNpYmxlXHJcblx0XHRcdFx0aWYgX3Zpc2libGVcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRhY3Rpb24udmlzaWJsZSA9IENyZWF0b3IuZXZhbChcIigje192aXNpYmxlfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxyXG5cdFx0XHRcdF90b2RvID0gYWN0aW9uPy50b2RvXHJcblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxyXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXHJcblx0XHRcdFx0XHRhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpXHJcblxyXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy52aXNpYmxlXHJcblxyXG5cdFx0XHRcdGlmIF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSlcclxuXHRcdFx0XHRcdGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKClcclxuXHJcblx0XHRfLmZvckVhY2ggb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBrZXkpLT5cclxuXHJcblx0XHRcdGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcclxuXHJcblx0XHRcdGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKVxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdFx0I+aUr+aMgVxcbuaIluiAheiLseaWh+mAl+WPt+WIhuWJsixcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdGlmIG9wdGlvbi5pbmRleE9mKFwiLFwiKVxyXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpXHJcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSlcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXHJcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcclxuXHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcclxuXHJcblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucylcclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cclxuXHRcdFx0XHRcdCPmlK/mjIHmlbDnu4TkuK3nm7TmjqXlrprkuYnmr4/kuKrpgInpobnnmoTnroDniYjmoLzlvI/lrZfnrKbkuLJcclxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLCAob3B0aW9uKS0+XHJcblx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcob3B0aW9uKVxyXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKG9wdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xyXG5cdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvclxyXG5cclxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpXHJcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxyXG5cdFx0XHRcdF8uZWFjaCBmaWVsZC5vcHRpb25zLCAodiwgayktPlxyXG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IHYsIHZhbHVlOiBrfVxyXG5cdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcclxuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNGdW5jdGlvbihvcHRpb25zKVxyXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9uc1xyXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zfSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQucmVnRXhcclxuXHRcdFx0XHRpZiByZWdFeFxyXG5cdFx0XHRcdFx0ZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVnRXggPSBmaWVsZC5fcmVnRXhcclxuXHRcdFx0XHRpZiByZWdFeFxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLnJlZ0V4ID0gQ3JlYXRvci5ldmFsKFwiKCN7cmVnRXh9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdFx0bWluID0gZmllbGQubWluXHJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKG1pbilcclxuXHRcdFx0XHRcdGZpZWxkLl9taW4gPSBtaW4udG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0bWluID0gZmllbGQuX21pblxyXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWluKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLm1pbiA9IENyZWF0b3IuZXZhbChcIigje21pbn0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRtYXggPSBmaWVsZC5tYXhcclxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWF4KVxyXG5cdFx0XHRcdFx0ZmllbGQuX21heCA9IG1heC50b1N0cmluZygpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRtYXggPSBmaWVsZC5fbWF4XHJcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtYXgpXHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0ZmllbGQubWF4ID0gQ3JlYXRvci5ldmFsKFwiKCN7bWF4fSlcIilcclxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcclxuXHJcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXHJcblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGVcclxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT0gT2JqZWN0ICYmIF90eXBlICE9IFN0cmluZyAmJiBfdHlwZSAhPSBOdW1iZXIgJiYgX3R5cGUgIT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXHJcblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlXHJcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKVxyXG5cdFx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3R5cGV9KVwiKVxyXG5cdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHJcblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXHJcblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXHJcblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxyXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxyXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gPSBvcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKVxyXG5cclxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKVxyXG5cclxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpXHJcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKClcclxuXHJcblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uID0gZmlsdGVyc0Z1bmN0aW9uLnRvU3RyaW5nKClcclxuXHRcdFx0ZWxzZVxyXG5cclxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxyXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG9cclxuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvblxyXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxyXG5cclxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pXHJcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zRnVuY3Rpb259KVwiKVxyXG5cclxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pXHJcblx0XHRcdFx0XHRmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWZlcmVuY2VfdG99KVwiKVxyXG5cclxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKVxyXG5cdFx0XHRcdFx0ZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tjcmVhdGVGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2JlZm9yZU9wZW5GdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbilcclxuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlcnNGdW5jdGlvbn0pXCIpXHJcblxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0XHRcdGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZVxyXG5cclxuXHRcdFx0XHRpZiAhZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXHJcblx0XHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHJcblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2RlZmF1bHRWYWx1ZX0pXCIpXHJcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXHJcblx0XHRcdFxyXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRpZiBpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZClcclxuXHRcdFx0XHRcdGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZClcclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yLmV2YWwoXCIoI3tpc19jb21wYW55X2xpbWl0ZWR9KVwiKVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxyXG5cclxuXHRcdF8uZm9yRWFjaCBvYmplY3QubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KSAtPlxyXG5cdFx0XHQjIyNcclxuXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXHJcblx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXHJcblx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcclxuXHRcdFx05aaC77yaXHJcblx0XHRcdGZpbHRlcnM6ICgpLT5cclxuXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxyXG5cdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cclxuXHRcdFx05aaC77yaXHJcblx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxyXG5cdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcclxuXHRcdFx0XV1cclxuXHRcdFx05oiWXHJcblx0XHRcdGZpbHRlcnM6IFt7XHJcblx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcclxuXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxyXG5cdFx0XHRcdFwidmFsdWVcIjogKCktPlxyXG5cdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxyXG5cdFx0XHR9XVxyXG5cdFx0XHQjIyNcclxuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKVxyXG5cdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0bGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKVxyXG5cdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKVxyXG5cdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdFx0bGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tsaXN0X3ZpZXcuX2ZpbHRlcnN9KVwiKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Xy5mb3JFYWNoIGxpc3Rfdmlldy5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cclxuXHRcdFx0XHRcdGlmIF8uaXNBcnJheShmaWx0ZXIpXHJcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCJcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0RhdGUoZmlsdGVyWzJdKVxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzmmK9EYXRl57G75Z6L77yM5YiZZmlsdGVyWzJd5YC85Yiw5YmN56uv5Lya6Ieq5Yqo6L2s5oiQ5a2X56ym5Liy77yM5qC85byP77yaXCIyMDE4LTAzLTI5VDAzOjQzOjIxLjc4N1pcIlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDljIXmi6xncmlk5YiX6KGo6K+35rGC55qE5o6l5Y+j5Zyo5YaF55qE5omA5pyJT0RhdGHmjqXlj6PvvIxEYXRl57G75Z6L5a2X5q616YO95Lya5Lul5LiK6L+w5qC85byP6L+U5ZueXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkRBVEVcIlxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkZVTkNUSU9OXCJcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlclsyXX0pXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiREFURVwiXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pXHJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcclxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc09iamVjdChmaWx0ZXIpXHJcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRGF0ZShmaWx0ZXI/LnZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl9pc19kYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLl9pc19kYXRlID09IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSlcclxuXHJcblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0aWYgb2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pXHJcblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XHJcblx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24odmFsKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsICsgJyc7XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XHJcblx0XHRlbHNlIGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRpZiBvYmplY3QuZm9ybVxyXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XHJcblx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJylcclxuXHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxyXG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXHJcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxyXG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKVxyXG5cdFx0XHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXHJcblx0XHRlbHNlXHJcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxyXG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXHJcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxyXG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpXHJcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXHJcblxyXG5cdFx0cmV0dXJuIG9iamVjdFxyXG5cclxuXHJcbiIsInZhciBjb252ZXJ0RmllbGQsIGdldE9wdGlvbjtcblxuZ2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIHZhciBmb287XG4gIGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIik7XG4gIGlmIChmb28ubGVuZ3RoID4gMikge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1sxXSxcbiAgICAgIGNvbG9yOiBmb29bMl1cbiAgICB9O1xuICB9IGVsc2UgaWYgKGZvby5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMF1cbiAgICB9O1xuICB9XG59O1xuXG5jb252ZXJ0RmllbGQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGQsIHNwYWNlSWQpIHtcbiAgdmFyIGFsbE9wdGlvbnMsIGNvZGUsIG9wdGlvbnMsIHBpY2tsaXN0LCBwaWNrbGlzdE9wdGlvbnMsIHJlZjtcbiAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiBzcGFjZUlkICYmIGZpZWxkLnR5cGUgPT09ICdzZWxlY3QnKSB7XG4gICAgY29kZSA9IGZpZWxkLnBpY2tsaXN0IHx8IChvYmplY3RfbmFtZSArIFwiLlwiICsgZmllbGRfbmFtZSk7XG4gICAgaWYgKGNvZGUpIHtcbiAgICAgIHBpY2tsaXN0ID0gQ3JlYXRvci5nZXRQaWNrbGlzdChjb2RlLCBzcGFjZUlkKTtcbiAgICAgIGlmIChwaWNrbGlzdCkge1xuICAgICAgICBvcHRpb25zID0gW107XG4gICAgICAgIGFsbE9wdGlvbnMgPSBbXTtcbiAgICAgICAgcGlja2xpc3RPcHRpb25zID0gQ3JlYXRvci5nZXRQaWNrTGlzdE9wdGlvbnMocGlja2xpc3QpO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSAocmVmID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKSA6IHZvaWQgMDtcbiAgICAgICAgXy5lYWNoKHBpY2tsaXN0T3B0aW9ucywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHZhciBsYWJlbCwgdmFsdWU7XG4gICAgICAgICAgbGFiZWwgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgdmFsdWUgPSBpdGVtLnZhbHVlIHx8IGl0ZW0ubmFtZTtcbiAgICAgICAgICBhbGxPcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZW5hYmxlOiBpdGVtLmVuYWJsZSxcbiAgICAgICAgICAgIGNvbG9yOiBpdGVtLmNvbG9yXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGl0ZW0uZW5hYmxlKSB7XG4gICAgICAgICAgICBvcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbVtcImRlZmF1bHRcIl0pIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsbE9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkLmFsbE9wdGlvbnMgPSBhbGxPcHRpb25zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmaWVsZDtcbn07XG5cbkNyZWF0b3IuY29udmVydE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCwgc3BhY2VJZCkge1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCBrZXkpIHtcbiAgICB2YXIgX3RvZG8sIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYjtcbiAgICBpZiAoKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpKSB7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyICE9IG51bGwgPyB0cmlnZ2VyLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikge1xuICAgICAgX3RvZG8gPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICByZXR1cm4gdHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGIsIF92aXNpYmxlLCBlcnJvcjtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pKSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24oKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3Zpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF92aXNpYmxlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kbywgX3Zpc2libGU7XG4gICAgICBfdG9kbyA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICBhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi52aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSkpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICB2YXIgX29wdGlvbnMsIF90eXBlLCBiZWZvcmVPcGVuRnVuY3Rpb24sIGNyZWF0ZUZ1bmN0aW9uLCBkZWZhdWx0VmFsdWUsIGVycm9yLCBmaWx0ZXJzRnVuY3Rpb24sIGlzX2NvbXBhbnlfbGltaXRlZCwgbWF4LCBtaW4sIG9wdGlvbnMsIG9wdGlvbnNGdW5jdGlvbiwgcmVmZXJlbmNlX3RvLCByZWdFeDtcbiAgICBmaWVsZCA9IGNvbnZlcnRGaWVsZChvYmplY3QubmFtZSwga2V5LCBmaWVsZCwgc3BhY2VJZCk7XG4gICAgaWYgKGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMuc3BsaXQoXCJcXG5cIiksIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIHZhciBvcHRpb25zO1xuICAgICAgICAgIGlmIChvcHRpb24uaW5kZXhPZihcIixcIikpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihfb3B0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICBpZiAoXy5pc1N0cmluZyhvcHRpb24pKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgXy5lYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiB2LFxuICAgICAgICAgIHZhbHVlOiBrXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgaWYgKG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0gZmllbGQuX29wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9ucyArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVnRXggPSBmaWVsZC5fcmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5yZWdFeCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVnRXggKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtaW4gPSBmaWVsZC5taW47XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1pbikpIHtcbiAgICAgICAgZmllbGQuX21pbiA9IG1pbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtaW4gPSBmaWVsZC5fbWluO1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWluKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1pbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWluICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgbWF4ID0gZmllbGQubWF4O1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihtYXgpKSB7XG4gICAgICAgIGZpZWxkLl9tYXggPSBtYXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWF4ID0gZmllbGQuX21heDtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG1heCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5tYXggPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG1heCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9PSBPYmplY3QgJiYgX3R5cGUgIT09IFN0cmluZyAmJiBfdHlwZSAhPT0gTnVtYmVyICYmIF90eXBlICE9PSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpKSB7XG4gICAgICAgICAgZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlO1xuICAgICAgICBpZiAoX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSkpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3R5cGUgKyBcIilcIik7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgIGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb247XG4gICAgICBiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiB8fCBmaWVsZC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICBpZiAob3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG9wdGlvbnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVmZXJlbmNlX3RvICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBjcmVhdGVGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgYmVmb3JlT3BlbkZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJzRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKCFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGRlZmF1bHRWYWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc1N0cmluZyhpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgaXNfY29tcGFueV9saW1pdGVkICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgXy5mb3JFYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuXG4gICAgLypcbiAgICBcdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcbiAgICBcdFx0XHTorqnov4fomZHlmajmlK/mjIHkuKTnp41mdW5jdGlvbuaWueW8j++8mlxuICAgIFx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuICAgIFx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdF1dXG4gICAgXHRcdFx05oiWXG4gICAgXHRcdFx0ZmlsdGVyczogW3tcbiAgICBcdFx0XHRcdFwiZmllbGRcIjogXCJvYmplY3RfbmFtZVwiXG4gICAgXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuICAgIFx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XG4gICAgXHRcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHR9XVxuICAgICAqL1xuICAgIGlmIChfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbGlzdF92aWV3Ll9maWx0ZXJzICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXy5mb3JFYWNoKGxpc3Rfdmlldy5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRGF0ZShmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkRBVEVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJGVU5DVElPTlwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyWzJdICsgXCIpXCIpO1xuICAgICAgICAgICAgICBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkRBVEVcIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRGF0ZShmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5faXNfZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLl9pc19kYXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXIudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmIChvYmplY3QuZm9ybSAmJiAhXy5pc1N0cmluZyhvYmplY3QuZm9ybSkpIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgIHJldHVybiB2YWwgKyAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdC5mb3JtKSB7XG4gICAgICBvYmplY3QuZm9ybSA9IEpTT04ucGFyc2Uob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZmlsdGVyc19jb2RlXCIsIHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge31cclxuXHJcbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCJcclxuXHJcbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gKHByZWZpeCxmaWVsZFZhcmlhYmxlKS0+XHJcblx0cmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XHJcblxyXG5cdHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZSByZWcsIChtLCAkMSktPlxyXG5cdFx0cmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLFwiW1xcXCJcIikucmVwbGFjZSgvXFxzKlxcfS8sXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLFwiXFxcIl1bXFxcIlwiKTtcclxuXHJcblx0cmV0dXJuIHJldlxyXG5cclxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSAoZm9ybXVsYV9zdHIpLT5cclxuXHRpZiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTFcclxuXHRcdHJldHVybiB0cnVlXHJcblx0cmV0dXJuIGZhbHNlXHJcblxyXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IChmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpLT5cclxuXHRpZiBmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKVxyXG5cclxuXHRcdGlmICFfLmlzQm9vbGVhbihvcHRpb25zPy5leHRlbmQpXHJcblx0XHRcdGV4dGVuZCA9IHRydWVcclxuXHJcblx0XHRfVkFMVUVTID0ge31cclxuXHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVClcclxuXHRcdGlmIGV4dGVuZFxyXG5cdFx0XHRfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgQ3JlYXRvci5nZXRVc2VyQ29udGV4dChvcHRpb25zPy51c2VySWQsIG9wdGlvbnM/LnNwYWNlSWQpKVxyXG5cdFx0Zm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpXHJcblxyXG5cdFx0dHJ5XHJcblx0XHRcdGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpICAgIyDmraTlpITkuI3og73nlKh3aW5kb3cuZXZhbCDvvIzkvJrlr7zoh7Tlj5jph4/kvZznlKjln5/lvILluLhcclxuXHRcdFx0cmV0dXJuIGRhdGFcclxuXHRcdGNhdGNoIGVcclxuXHRcdFx0Y29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfVwiLCBlKVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHR0b2FzdHI/LmVycm9yKFwi5YWs5byP5omn6KGM5Ye66ZSZ5LqG77yM6K+35qOA5p+l5YWs5byP6YWN572u5piv5ZCm5q2j56Gu77yBXCIpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfSN7ZX1cIlxyXG5cclxuXHRyZXR1cm4gZm9ybXVsYV9zdHJcclxuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9O1xuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiO1xuXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IGZ1bmN0aW9uKHByZWZpeCwgZmllbGRWYXJpYWJsZSkge1xuICB2YXIgcmVnLCByZXY7XG4gIHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuICByZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UocmVnLCBmdW5jdGlvbihtLCAkMSkge1xuICAgIHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLywgXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LywgXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLCBcIlxcXCJdW1xcXCJcIik7XG4gIH0pO1xuICByZXR1cm4gcmV2O1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhX3N0cikge1xuICBpZiAoXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSBmdW5jdGlvbihmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpIHtcbiAgdmFyIF9WQUxVRVMsIGRhdGEsIGUsIGV4dGVuZDtcbiAgaWYgKGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpKSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmV4dGVuZCA6IHZvaWQgMCkpIHtcbiAgICAgIGV4dGVuZCA9IHRydWU7XG4gICAgfVxuICAgIF9WQUxVRVMgPSB7fTtcbiAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpO1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMudXNlcklkIDogdm9pZCAwLCBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNwYWNlSWQgOiB2b2lkIDApKTtcbiAgICB9XG4gICAgZm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpO1xuICAgIHRyeSB7XG4gICAgICBkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIsIGUpO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIHRvYXN0ciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0b2FzdHIgIT09IG51bGwpIHtcbiAgICAgICAgICB0b2FzdHIuZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyICsgZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmb3JtdWxhX3N0cjtcbn07XG4iLCJjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XHJcbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9ICAgIyDmraTlr7nosaHlj6rog73lnKjnoa7kv53miYDmnIlPYmplY3TliJ3lp4vljJblrozmiJDlkI7osIPnlKjvvIwg5ZCm5YiZ6I635Y+W5Yiw55qEb2JqZWN05LiN5YWoXHJcblxyXG5DcmVhdG9yLmZvcm1hdE9iamVjdE5hbWUgPSAob2JqZWN0X25hbWUpLT5cclxuXHRpZiBvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJylcclxuXHRcdG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJylcclxuXHRyZXR1cm4gb2JqZWN0X25hbWVcclxuXHJcbkNyZWF0b3IuT2JqZWN0ID0gKG9wdGlvbnMpLT5cclxuXHRfYmFzZU9iamVjdCA9IENyZWF0b3IuYmFzZU9iamVjdFxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0X2Jhc2VPYmplY3QgPSB7YWN0aW9uczogQ3JlYXRvci5iYXNlT2JqZWN0LmFjdGlvbnMgLCBmaWVsZHM6IHt9LCB0cmlnZ2Vyczoge30sIHBlcm1pc3Npb25fc2V0OiB7fX1cclxuXHRzZWxmID0gdGhpc1xyXG5cdGlmICghb3B0aW9ucy5uYW1lKVxyXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XHJcblxyXG5cdHNlbGYuX2lkID0gb3B0aW9ucy5faWQgfHwgb3B0aW9ucy5uYW1lXHJcblx0c2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2VcclxuXHRzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWVcclxuXHRzZWxmLmxhYmVsID0gb3B0aW9ucy5sYWJlbFxyXG5cdHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvblxyXG5cdHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uXHJcblx0c2VsZi5pc192aWV3ID0gb3B0aW9ucy5pc192aWV3XHJcblx0c2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtXHJcblx0c2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3RcclxuXHRzZWxmLnZlcnNpb24gPSBvcHRpb25zLnZlcnNpb24gfHwgMS4wXHJcblx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSAgfHwgb3B0aW9ucy5pc19lbmFibGUgPT0gdHJ1ZVxyXG5cdFx0c2VsZi5pc19lbmFibGUgPSB0cnVlXHJcblx0ZWxzZVxyXG5cdFx0c2VsZi5pc19lbmFibGUgPSBmYWxzZVxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKVxyXG5cdFx0XHRzZWxmLmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvcHRpb25zLmFsbG93X2N1c3RvbUFjdGlvbnNcclxuXHRcdGlmIF8uaGFzKG9wdGlvbnMsICdleGNsdWRlX2FjdGlvbnMnKVxyXG5cdFx0XHRzZWxmLmV4Y2x1ZGVfYWN0aW9ucyA9IG9wdGlvbnMuZXhjbHVkZV9hY3Rpb25zXHJcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKVxyXG5cdFx0XHRzZWxmLmFsbG93X3JlbGF0ZWRMaXN0ID0gb3B0aW9ucy5hbGxvd19yZWxhdGVkTGlzdFxyXG5cdHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaFxyXG5cdHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXNcclxuXHRzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzXHJcblx0c2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3Rlc1xyXG5cdHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXRcclxuXHRpZiBvcHRpb25zLnBhZ2luZ1xyXG5cdFx0c2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZ1xyXG5cdHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW5cclxuXHRzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09IHVuZGVmaW5lZCkgb3Igb3B0aW9ucy5lbmFibGVfYXBpXHJcblx0c2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbVxyXG5cdHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmVcclxuXHRzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXNcclxuXHRzZWxmLmVuYWJsZV9wcm9jZXNzID0gb3B0aW9ucy5lbmFibGVfcHJvY2Vzc1xyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXHJcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZVxyXG5cdFx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcclxuXHRlbHNlXHJcblx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcclxuXHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXHJcblx0c2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3dcclxuXHRzZWxmLmZpbHRlcl9jb21wYW55ID0gb3B0aW9ucy5maWx0ZXJfY29tcGFueVxyXG5cdHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpXHJcblx0c2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXJcclxuXHRzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoXHJcblx0c2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsXHJcblx0c2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzXHJcblx0c2VsZi5lbmFibGVfZm9sbG93ID0gb3B0aW9ucy5lbmFibGVfZm9sbG93XHJcblx0c2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvd1xyXG5cdHNlbGYuZW5hYmxlX2lubGluZV9lZGl0ID0gb3B0aW9ucy5lbmFibGVfaW5saW5lX2VkaXRcclxuXHRzZWxmLmRldGFpbHMgPSBvcHRpb25zLmRldGFpbHNcclxuXHRzZWxmLm1hc3RlcnMgPSBvcHRpb25zLm1hc3RlcnNcclxuXHRzZWxmLmxvb2t1cF9kZXRhaWxzID0gb3B0aW9ucy5sb29rdXBfZGV0YWlsc1xyXG5cdGlmIF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpXHJcblx0XHRzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudFxyXG5cdHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJ1xyXG5cdGlmIG9wdGlvbnMuZGF0YWJhc2VfbmFtZVxyXG5cdFx0c2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lXHJcblx0aWYgKCFvcHRpb25zLmZpZWxkcylcclxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcclxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XHJcblxyXG5cdHNlbGYuZmllbGRzID0gY2xvbmUob3B0aW9ucy5maWVsZHMpXHJcblxyXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0XHRpZiBmaWVsZC5pc19uYW1lXHJcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXHJcblx0XHRlbHNlIGlmIGZpZWxkX25hbWUgPT0gJ25hbWUnICYmICFzZWxmLk5BTUVfRklFTERfS0VZXHJcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXHJcblx0XHRpZiBmaWVsZC5wcmltYXJ5XHJcblx0XHRcdHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXHJcblx0XHRcdFx0aWYgZmllbGRfbmFtZSA9PSAnc3BhY2UnXHJcblx0XHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gZmFsc2VcclxuXHJcblx0aWYgIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcclxuXHRcdF8uZWFjaCBfYmFzZU9iamVjdC5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0XHRpZiAhc2VsZi5maWVsZHNbZmllbGRfbmFtZV1cclxuXHRcdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9XHJcblx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKVxyXG5cclxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0aWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcclxuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2Zvcm11bGEnXHJcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdzdW1tYXJ5J1xyXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcclxuXHJcblx0c2VsZi5saXN0X3ZpZXdzID0ge31cclxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcoc2VsZi5uYW1lKVxyXG5cdF8uZWFjaCBvcHRpb25zLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdG9pdGVtID0gQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcoZGVmYXVsdFZpZXcsIGl0ZW0sIGl0ZW1fbmFtZSlcclxuXHRcdHNlbGYubGlzdF92aWV3c1tpdGVtX25hbWVdID0gb2l0ZW1cclxuXHJcblx0c2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QudHJpZ2dlcnMpXHJcblx0Xy5lYWNoIG9wdGlvbnMudHJpZ2dlcnMsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdGlmICFzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV1cclxuXHRcdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge31cclxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXS5uYW1lID0gaXRlbV9uYW1lXHJcblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pXHJcblxyXG5cdHNlbGYuYWN0aW9ucyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QuYWN0aW9ucylcclxuXHRfLmVhY2ggb3B0aW9ucy5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XHJcblx0XHRpZiAhc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV1cclxuXHRcdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fVxyXG5cdFx0Y29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKVxyXG5cdFx0ZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdICPlhYjliKDpmaTnm7jlhbPlsZ7mgKflho3ph43lu7rmiY3og73kv53or4HlkI7nu63ph43lpI3lrprkuYnnmoTlsZ7mgKfpobrluo/nlJ/mlYhcclxuXHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pXHJcblxyXG5cdF8uZWFjaCBzZWxmLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHRcdGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZVxyXG5cclxuXHRzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKVxyXG5cclxuXHQjIOiuqeaJgOaciW9iamVjdOm7mOiupOacieaJgOaciWxpc3Rfdmlld3MvYWN0aW9ucy9yZWxhdGVkX29iamVjdHMvcmVhZGFibGVfZmllbGRzL2VkaXRhYmxlX2ZpZWxkc+WujOaVtOadg+mZkO+8jOivpeadg+mZkOWPr+iDveiiq+aVsOaNruW6k+S4reiuvue9rueahGFkbWluL3VzZXLmnYPpmZDopobnm5ZcclxuXHRzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldClcclxuXHQjIGRlZmF1bHRMaXN0Vmlld3MgPSBfLmtleXMoc2VsZi5saXN0X3ZpZXdzKVxyXG5cdCMgZGVmYXVsdEFjdGlvbnMgPSBfLmtleXMoc2VsZi5hY3Rpb25zKVxyXG5cdCMgZGVmYXVsdFJlbGF0ZWRPYmplY3RzID0gXy5wbHVjayhzZWxmLnJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXHJcblx0IyBkZWZhdWx0UmVhZGFibGVGaWVsZHMgPSBbXVxyXG5cdCMgZGVmYXVsdEVkaXRhYmxlRmllbGRzID0gW11cclxuXHQjIF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XHJcblx0IyBcdGlmICEoZmllbGQuaGlkZGVuKSAgICAjMjMxIG9taXTlrZfmrrXmlK/mjIHlnKjpnZ7nvJbovpHpobXpnaLmn6XnnIssIOWboOatpOWIoOmZpOS6huatpOWkhOWvuW9taXTnmoTliKTmlq1cclxuXHQjIFx0XHRkZWZhdWx0UmVhZGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXHJcblx0IyBcdFx0aWYgIWZpZWxkLnJlYWRvbmx5XHJcblx0IyBcdFx0XHRkZWZhdWx0RWRpdGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXHJcblxyXG5cdCMgXy5lYWNoIHNlbGYucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuXHQjIFx0aWYgaXRlbV9uYW1lID09IFwibm9uZVwiXHJcblx0IyBcdFx0cmV0dXJuXHJcblx0IyBcdGlmIHNlbGYubGlzdF92aWV3c1xyXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5saXN0X3ZpZXdzID0gZGVmYXVsdExpc3RWaWV3c1xyXG5cdCMgXHRpZiBzZWxmLmFjdGlvbnNcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uYWN0aW9ucyA9IGRlZmF1bHRBY3Rpb25zXHJcblx0IyBcdGlmIHNlbGYucmVsYXRlZF9vYmplY3RzXHJcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLnJlbGF0ZWRfb2JqZWN0cyA9IGRlZmF1bHRSZWxhdGVkT2JqZWN0c1xyXG5cdCMgXHRpZiBzZWxmLmZpZWxkc1xyXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWFkYWJsZV9maWVsZHMgPSBkZWZhdWx0UmVhZGFibGVGaWVsZHNcclxuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uZWRpdGFibGVfZmllbGRzID0gZGVmYXVsdEVkaXRhYmxlRmllbGRzXHJcblx0dW5sZXNzIG9wdGlvbnMucGVybWlzc2lvbl9zZXRcclxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fVxyXG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8uYWRtaW4pXHJcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pXHJcblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py51c2VyKVxyXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC51c2VyID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1widXNlclwiXSlcclxuXHRfLmVhY2ggb3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxyXG5cdFx0aWYgIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXVxyXG5cdFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSB7fVxyXG5cdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKVxyXG5cclxuXHQjIOWJjeerr+agueaNrnBlcm1pc3Npb25z5pS55YaZZmllbGTnm7jlhbPlsZ7mgKfvvIzlkI7nq6/lj6ropoHotbDpu5jorqTlsZ7mgKflsLHooYzvvIzkuI3pnIDopoHmlLnlhplcclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9uc1xyXG5cdFx0ZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zPy5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRpZiBkaXNhYmxlZF9saXN0X3ZpZXdzPy5sZW5ndGhcclxuXHRcdFx0ZGVmYXVsdExpc3RWaWV3SWQgPSBvcHRpb25zLmxpc3Rfdmlld3M/LmFsbD8uX2lkXHJcblx0XHRcdGlmIGRlZmF1bHRMaXN0Vmlld0lkXHJcblx0XHRcdFx0IyDmiorop4blm77mnYPpmZDphY3nva7kuK3pu5jorqTnmoRhbGzop4blm75pZOi9rOaNouaIkGFsbOWFs+mUruWtl1xyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcCBkaXNhYmxlZF9saXN0X3ZpZXdzLCAobGlzdF92aWV3X2l0ZW0pIC0+XHJcblx0XHRcdFx0XHRyZXR1cm4gaWYgZGVmYXVsdExpc3RWaWV3SWQgPT0gbGlzdF92aWV3X2l0ZW0gdGhlbiBcImFsbFwiIGVsc2UgbGlzdF92aWV3X2l0ZW1cclxuXHRcdHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpXHJcbiNcdFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuI1x0XHRcdGlmIGZpZWxkXHJcbiNcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5yZWFkYWJsZV9maWVsZHMsIGZpZWxkX25hbWUpIDwgMFxyXG4jXHRcdFx0XHRcdGlmIGZpZWxkLmhpZGRlblxyXG4jXHRcdFx0XHRcdFx0cmV0dXJuXHJcbiNcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bmVkaXRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPiAtMVxyXG4jXHRcdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXHJcbiNcdFx0XHRcdFx0XHRmaWVsZC5kaXNhYmxlZCA9IHRydWVcclxuI1x0XHRcdFx0XHRcdCMg5b2T5Y+q6K+75pe277yM5aaC5p6c5LiN5Y675o6J5b+F5aGr5a2X5q6177yMYXV0b2Zvcm3mmK/kvJrmiqXplJnnmoRcclxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlcXVpcmVkID0gZmFsc2VcclxuI1x0XHRcdFx0ZWxzZVxyXG4jXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IHRydWVcclxuXHRlbHNlXHJcblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbnVsbFxyXG5cclxuXHRfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucylcclxuXHJcblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiXHJcblxyXG5cdHNlbGYuZGIgPSBfZGJcclxuXHJcblx0c2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lXHJcblxyXG5cdHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpXHJcblx0c2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSlcclxuXHRpZiBzZWxmLm5hbWUgIT0gXCJ1c2Vyc1wiIGFuZCBzZWxmLm5hbWUgIT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIiwgXCJhY3Rpb25fZmllbGRfdXBkYXRlc1wiXSwgc2VsZi5uYW1lKVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcclxuXHRcdGVsc2VcclxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxyXG5cdGlmIHNlbGYubmFtZSA9PSBcInVzZXJzXCJcclxuXHRcdF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWFcclxuXHJcblx0aWYgXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcclxuXHJcblx0Q3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmXHJcblxyXG5cdHJldHVybiBzZWxmXHJcblxyXG4jIENyZWF0b3IuT2JqZWN0LnByb3RvdHlwZS5pMThuID0gKCktPlxyXG4jIFx0IyBzZXQgb2JqZWN0IGxhYmVsXHJcbiMgXHRzZWxmID0gdGhpc1xyXG5cclxuIyBcdGtleSA9IHNlbGYubmFtZVxyXG4jIFx0aWYgdChrZXkpID09IGtleVxyXG4jIFx0XHRpZiAhc2VsZi5sYWJlbFxyXG4jIFx0XHRcdHNlbGYubGFiZWwgPSBzZWxmLm5hbWVcclxuIyBcdGVsc2VcclxuIyBcdFx0c2VsZi5sYWJlbCA9IHQoa2V5KVxyXG5cclxuIyBcdCMgc2V0IGZpZWxkIGxhYmVsc1xyXG4jIFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cclxuIyBcdFx0ZmtleSA9IHNlbGYubmFtZSArIFwiX1wiICsgZmllbGRfbmFtZVxyXG4jIFx0XHRpZiB0KGZrZXkpID09IGZrZXlcclxuIyBcdFx0XHRpZiAhZmllbGQubGFiZWxcclxuIyBcdFx0XHRcdGZpZWxkLmxhYmVsID0gZmllbGRfbmFtZVxyXG4jIFx0XHRlbHNlXHJcbiMgXHRcdFx0ZmllbGQubGFiZWwgPSB0KGZrZXkpXHJcbiMgXHRcdHNlbGYuc2NoZW1hPy5fc2NoZW1hP1tmaWVsZF9uYW1lXT8ubGFiZWwgPSBmaWVsZC5sYWJlbFxyXG5cclxuXHJcbiMgXHQjIHNldCBsaXN0dmlldyBsYWJlbHNcclxuIyBcdF8uZWFjaCBzZWxmLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cclxuIyBcdFx0aTE4bl9rZXkgPSBzZWxmLm5hbWUgKyBcIl9saXN0dmlld19cIiArIGl0ZW1fbmFtZVxyXG4jIFx0XHRpZiB0KGkxOG5fa2V5KSA9PSBpMThuX2tleVxyXG4jIFx0XHRcdGlmICFpdGVtLmxhYmVsXHJcbiMgXHRcdFx0XHRpdGVtLmxhYmVsID0gaXRlbV9uYW1lXHJcbiMgXHRcdGVsc2VcclxuIyBcdFx0XHRpdGVtLmxhYmVsID0gdChpMThuX2tleSlcclxuXHJcblxyXG5DcmVhdG9yLmdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4ID0gKG9iamVjdCktPlxyXG5cdHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIlxyXG5cdCMgaWYgb2JqZWN0XHJcblx0IyBcdGlmICFvYmplY3QuZGF0YWJhc2VfbmFtZSB8fCBvYmplY3QuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xyXG5cdCMgXHRcdHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIlxyXG5cdCMgXHRlbHNlXHJcblx0IyBcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS8je29iamVjdC5kYXRhYmFzZV9uYW1lfVwiXHJcblxyXG4jIGlmIE1ldGVvci5pc0NsaWVudFxyXG5cclxuIyBcdE1ldGVvci5zdGFydHVwIC0+XHJcbiMgXHRcdFRyYWNrZXIuYXV0b3J1biAtPlxyXG4jIFx0XHRcdGlmIFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgJiYgQ3JlYXRvci5ib290c3RyYXBMb2FkZWQ/LmdldCgpXHJcbiMgXHRcdFx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxyXG4jIFx0XHRcdFx0XHRvYmplY3QuaTE4bigpXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdGlmICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHNcclxuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChvYmplY3QpLT5cclxuXHRcdFx0bmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdClcclxuXHJcbiIsInZhciBjbG9uZTtcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fTtcblxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgaWYgKG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJyk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdF9uYW1lO1xufTtcblxuQ3JlYXRvci5PYmplY3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHZhciBfYmFzZU9iamVjdCwgX2RiLCBkZWZhdWx0TGlzdFZpZXdJZCwgZGVmYXVsdFZpZXcsIGRpc2FibGVkX2xpc3Rfdmlld3MsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNjaGVtYSwgc2VsZjtcbiAgX2Jhc2VPYmplY3QgPSBDcmVhdG9yLmJhc2VPYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfYmFzZU9iamVjdCA9IHtcbiAgICAgIGFjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zLFxuICAgICAgZmllbGRzOiB7fSxcbiAgICAgIHRyaWdnZXJzOiB7fSxcbiAgICAgIHBlcm1pc3Npb25fc2V0OiB7fVxuICAgIH07XG4gIH1cbiAgc2VsZiA9IHRoaXM7XG4gIGlmICghb3B0aW9ucy5uYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcbiAgfVxuICBzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gIHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWw7XG4gIHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvbjtcbiAgc2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb247XG4gIHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlldztcbiAgc2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtO1xuICBzZWxmLnJlbGF0ZWRMaXN0ID0gb3B0aW9ucy5yZWxhdGVkTGlzdDtcbiAgc2VsZi52ZXJzaW9uID0gb3B0aW9ucy52ZXJzaW9uIHx8IDEuMDtcbiAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgfHwgb3B0aW9ucy5pc19lbmFibGUgPT09IHRydWUpIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSBmYWxzZTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhbGxvd19jdXN0b21BY3Rpb25zJykpIHtcbiAgICAgIHNlbGYuYWxsb3dfY3VzdG9tQWN0aW9ucyA9IG9wdGlvbnMuYWxsb3dfY3VzdG9tQWN0aW9ucztcbiAgICB9XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdleGNsdWRlX2FjdGlvbnMnKSkge1xuICAgICAgc2VsZi5leGNsdWRlX2FjdGlvbnMgPSBvcHRpb25zLmV4Y2x1ZGVfYWN0aW9ucztcbiAgICB9XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhbGxvd19yZWxhdGVkTGlzdCcpKSB7XG4gICAgICBzZWxmLmFsbG93X3JlbGF0ZWRMaXN0ID0gb3B0aW9ucy5hbGxvd19yZWxhdGVkTGlzdDtcbiAgICB9XG4gIH1cbiAgc2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoO1xuICBzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzO1xuICBzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzO1xuICBzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzO1xuICBzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0O1xuICBpZiAob3B0aW9ucy5wYWdpbmcpIHtcbiAgICBzZWxmLnBhZ2luZyA9IG9wdGlvbnMucGFnaW5nO1xuICB9XG4gIHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW47XG4gIHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT09IHZvaWQgMCkgfHwgb3B0aW9ucy5lbmFibGVfYXBpO1xuICBzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tO1xuICBzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlO1xuICBzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXM7XG4gIHNlbGYuZW5hYmxlX3Byb2Nlc3MgPSBvcHRpb25zLmVuYWJsZV9wcm9jZXNzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSkge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICB9XG4gIHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93O1xuICBzZWxmLmZpbHRlcl9jb21wYW55ID0gb3B0aW9ucy5maWx0ZXJfY29tcGFueTtcbiAgc2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcik7XG4gIHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyO1xuICBzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoO1xuICBzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWw7XG4gIHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFscztcbiAgc2VsZi5lbmFibGVfZm9sbG93ID0gb3B0aW9ucy5lbmFibGVfZm9sbG93O1xuICBzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93O1xuICBzZWxmLmVuYWJsZV9pbmxpbmVfZWRpdCA9IG9wdGlvbnMuZW5hYmxlX2lubGluZV9lZGl0O1xuICBzZWxmLmRldGFpbHMgPSBvcHRpb25zLmRldGFpbHM7XG4gIHNlbGYubWFzdGVycyA9IG9wdGlvbnMubWFzdGVycztcbiAgc2VsZi5sb29rdXBfZGV0YWlscyA9IG9wdGlvbnMubG9va3VwX2RldGFpbHM7XG4gIGlmIChfLmhhcyhvcHRpb25zLCAnaW5fZGV2ZWxvcG1lbnQnKSkge1xuICAgIHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50O1xuICB9XG4gIHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJztcbiAgaWYgKG9wdGlvbnMuZGF0YWJhc2VfbmFtZSkge1xuICAgIHNlbGYuZGF0YWJhc2VfbmFtZSA9IG9wdGlvbnMuZGF0YWJhc2VfbmFtZTtcbiAgfVxuICBpZiAoIW9wdGlvbnMuZmllbGRzKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IGZpZWxkcycpO1xuICB9XG4gIHNlbGYuZmllbGRzID0gY2xvbmUob3B0aW9ucy5maWVsZHMpO1xuICBfLmVhY2goc2VsZi5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH0gZWxzZSBpZiAoZmllbGRfbmFtZSA9PT0gJ25hbWUnICYmICFzZWxmLk5BTUVfRklFTERfS0VZKSB7XG4gICAgICBzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLnByaW1hcnkpIHtcbiAgICAgIHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpKSB7XG4gICAgICAgIGlmIChmaWVsZF9uYW1lID09PSAnc3BhY2UnKSB7XG4gICAgICAgICAgZmllbGQuZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKCFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09PSAnbWV0ZW9yLW1vbmdvJykge1xuICAgIF8uZWFjaChfYmFzZU9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICBpZiAoIXNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKSB7XG4gICAgICAgIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pO1xuICAgIH0pO1xuICB9XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2Zvcm11bGEnKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHNlbGYubGlzdF92aWV3cyA9IHt9O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcoc2VsZi5uYW1lKTtcbiAgXy5lYWNoKG9wdGlvbnMubGlzdF92aWV3cywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgdmFyIG9pdGVtO1xuICAgIG9pdGVtID0gQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcoZGVmYXVsdFZpZXcsIGl0ZW0sIGl0ZW1fbmFtZSk7XG4gICAgcmV0dXJuIHNlbGYubGlzdF92aWV3c1tpdGVtX25hbWVdID0gb2l0ZW07XG4gIH0pO1xuICBzZWxmLnRyaWdnZXJzID0gXy5jbG9uZShfYmFzZU9iamVjdC50cmlnZ2Vycyk7XG4gIF8uZWFjaChvcHRpb25zLnRyaWdnZXJzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXS5uYW1lID0gaXRlbV9uYW1lO1xuICAgIHJldHVybiBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgc2VsZi5hY3Rpb25zID0gXy5jbG9uZShfYmFzZU9iamVjdC5hY3Rpb25zKTtcbiAgXy5lYWNoKG9wdGlvbnMuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgdmFyIGNvcHlJdGVtO1xuICAgIGlmICghc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIGNvcHlJdGVtID0gXy5jbG9uZShzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSk7XG4gICAgZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdO1xuICAgIHJldHVybiBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKTtcbiAgfSk7XG4gIF8uZWFjaChzZWxmLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHJldHVybiBpdGVtLm5hbWUgPSBpdGVtX25hbWU7XG4gIH0pO1xuICBzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKTtcbiAgc2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoX2Jhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpO1xuICBpZiAoIW9wdGlvbnMucGVybWlzc2lvbl9zZXQpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge307XG4gIH1cbiAgaWYgKCEoKHJlZiA9IG9wdGlvbnMucGVybWlzc2lvbl9zZXQpICE9IG51bGwgPyByZWYuYWRtaW4gOiB2b2lkIDApKSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKTtcbiAgfVxuICBpZiAoISgocmVmMSA9IG9wdGlvbnMucGVybWlzc2lvbl9zZXQpICE9IG51bGwgPyByZWYxLnVzZXIgOiB2b2lkIDApKSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldC51c2VyID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1widXNlclwiXSk7XG4gIH1cbiAgXy5lYWNoKG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBvcHRpb25zLnBlcm1pc3Npb25zO1xuICAgIGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA6IHZvaWQgMDtcbiAgICBpZiAoZGlzYWJsZWRfbGlzdF92aWV3cyAhPSBudWxsID8gZGlzYWJsZWRfbGlzdF92aWV3cy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgIGRlZmF1bHRMaXN0Vmlld0lkID0gKHJlZjIgPSBvcHRpb25zLmxpc3Rfdmlld3MpICE9IG51bGwgPyAocmVmMyA9IHJlZjIuYWxsKSAhPSBudWxsID8gcmVmMy5faWQgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IF8ubWFwKGRpc2FibGVkX2xpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgaWYgKGRlZmF1bHRMaXN0Vmlld0lkID09PSBsaXN0X3ZpZXdfaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiYWxsXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0X3ZpZXdfaXRlbTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLnBlcm1pc3Npb25zID0gbnVsbDtcbiAgfVxuICBfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucyk7XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYjtcbiAgc2VsZi5kYiA9IF9kYjtcbiAgc2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lO1xuICBzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKTtcbiAgc2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSk7XG4gIGlmIChzZWxmLm5hbWUgIT09IFwidXNlcnNcIiAmJiBzZWxmLm5hbWUgIT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCIsIFwiYWN0aW9uX2ZpZWxkX3VwZGF0ZXNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoc2VsZi5uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICBfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hO1xuICB9XG4gIGlmIChfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgQ3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmO1xuICByZXR1cm4gc2VsZjtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiO1xufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIGlmICghQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzKSB7XG4gICAgcmV0dXJuIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gKG9iaikgLT5cclxuXHR1bmxlc3Mgb2JqXHJcblx0XHRyZXR1cm5cclxuXHRzY2hlbWEgPSB7fVxyXG5cclxuXHRmaWVsZHNBcnIgPSBbXVxyXG5cclxuXHRfLmVhY2ggb2JqLmZpZWxkcyAsIChmaWVsZCwgZmllbGRfbmFtZSktPlxyXG5cdFx0aWYgIV8uaGFzKGZpZWxkLCBcIm5hbWVcIilcclxuXHRcdFx0ZmllbGQubmFtZSA9IGZpZWxkX25hbWVcclxuXHRcdGZpZWxkc0Fyci5wdXNoIGZpZWxkXHJcblxyXG5cdF8uZWFjaCBfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgKGZpZWxkKS0+XHJcblxyXG5cdFx0ZmllbGRfbmFtZSA9IGZpZWxkLm5hbWVcclxuXHJcblx0XHRmcyA9IHt9XHJcblx0XHRpZiBmaWVsZC5yZWdFeFxyXG5cdFx0XHRmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4XHJcblx0XHRmcy5hdXRvZm9ybSA9IHt9XHJcblx0XHRmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlXHJcblx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRhdXRvZm9ybV90eXBlID0gZmllbGQuYXV0b2Zvcm0/LnR5cGVcclxuXHJcblx0XHRpZiBmaWVsZC50eXBlID09IFwidGV4dFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJwaG9uZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIlt0ZXh0XVwiIG9yIGZpZWxkLnR5cGUgPT0gXCJbcGhvbmVdXCJcclxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdjb2RlJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTJcclxuXHRcdFx0aWYgZmllbGQubGFuZ3VhZ2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0YXJlYVwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJwYXNzd29yZFwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcclxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxyXG5cdFx0XHRcdFx0XHQjIEZpeCBpb3MgMTQsIOaJi+acuuWuouaIt+err+W+heWuoeaguOaWh+S7tuaXpeacn+aOp+S7tuaYvuekuuaVhemanCAjOTkx77yMaW9z57uf5LiA55SoUEPnq6/kuIDmoLfnmoRqc+aOp+S7tlxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxyXG5cdFx0XHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcclxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcclxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXHJcblx0XHRcdFx0XHRcdFx0XHRwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXHJcblx0XHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcclxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXHJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcclxuXHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxyXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcclxuXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcclxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxyXG5cdFx0XHRcdFx0XHQjIEZpeCBpb3MgMTQsIOaJi+acuuWuouaIt+err+W+heWuoeaguOaWh+S7tuaXpeacn+aOp+S7tuaYvuekuuaVhemanCAjOTkx77yMaW9z57uf5LiA55SoUEPnq6/kuIDmoLfnmoRqc+aOp+S7tlxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxyXG5cdFx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcclxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXHJcblx0XHRcdFx0XHRcdFx0XHRwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXHJcblx0XHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cclxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXHJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XHJcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXHJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIltPYmplY3RdXCJcclxuXHRcdFx0ZnMudHlwZSA9IFtPYmplY3RdXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJodG1sXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHRsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXHJcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIiB8fCBsb2NhbGUgPT0gXCJ6aC1DTlwiXHJcblx0XHRcdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuLVVTXCJcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxyXG5cdFx0XHRcdFx0dHlwZTogXCJzdW1tZXJub3RlXCJcclxuXHRcdFx0XHRcdGNsYXNzOiAnc3VtbWVybm90ZS1lZGl0b3InXHJcblx0XHRcdFx0XHRzZXR0aW5nczpcclxuXHRcdFx0XHRcdFx0aGVpZ2h0OiAyMDBcclxuXHRcdFx0XHRcdFx0ZGlhbG9nc0luQm9keTogdHJ1ZVxyXG5cdFx0XHRcdFx0XHR0b29sYmFyOiAgW1xyXG5cdFx0XHRcdFx0XHRcdFsnZm9udDEnLCBbJ3N0eWxlJ11dLFxyXG5cdFx0XHRcdFx0XHRcdFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ2ZvbnQzJywgWydmb250bmFtZSddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ2NvbG9yJywgWydjb2xvciddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ3RhYmxlJywgWyd0YWJsZSddXSxcclxuXHRcdFx0XHRcdFx0XHRbJ2luc2VydCcsIFsnbGluaycsICdwaWN0dXJlJ11dLFxyXG5cdFx0XHRcdFx0XHRcdFsndmlldycsIFsnY29kZXZpZXcnXV1cclxuXHRcdFx0XHRcdFx0XVxyXG5cdFx0XHRcdFx0XHRmb250TmFtZXM6IFsnQXJpYWwnLCAnQ29taWMgU2FucyBNUycsICdDb3VyaWVyIE5ldycsICdIZWx2ZXRpY2EnLCAnSW1wYWN0JywgJ+Wui+S9kycsJ+m7keS9kycsJ+W+rui9r+mbhem7kScsJ+S7v+WuiycsJ+alt+S9kycsJ+matuS5picsJ+W5vOWchiddXHJcblx0XHRcdFx0XHRcdGxhbmc6IGxvY2FsZVxyXG5cclxuXHRcdGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIiBvciBmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb25cclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHJcblx0XHRcdGlmICFmaWVsZC5oaWRkZW5cclxuXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnNcclxuXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb25cclxuXHJcblx0XHRcdFx0aWYgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXHJcblx0XHRcdFx0XHRmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cclxuXHJcblx0XHRcdFx0ZnMuZmlsdGVyc0Z1bmN0aW9uID0gaWYgZmllbGQuZmlsdGVyc0Z1bmN0aW9uIHRoZW4gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIGVsc2UgQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnNcclxuXHJcblx0XHRcdFx0aWYgZmllbGQub3B0aW9uc0Z1bmN0aW9uXHJcblx0XHRcdFx0XHRmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb25cclxuXHJcblx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvXHJcblxyXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdGlmIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbilcclxuXHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bylcclxuXHRcdFx0XHRcdFx0XHRcdF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b11cclxuXHRcdFx0XHRcdFx0XHRcdGlmIF9yZWZfb2JqPy5wZXJtaXNzaW9ucz8uYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IChsb29rdXBfZmllbGQpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy4je0NyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lfVwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9ybUlkOiBcIm5ldyN7ZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCdfJyl9XCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogXCIje2ZpZWxkLnJlZmVyZW5jZV90b31cIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wZXJhdGlvbjogXCJpbnNlcnRcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uU3VjY2VzczogKG9wZXJhdGlvbiwgcmVzdWx0KS0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVzdWx0Lm9iamVjdF9uYW1lID09IFwib2JqZWN0c1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFt7bGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCwgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLCBpY29uOiByZXN1bHQudmFsdWUuaWNvbn1dLCByZXN1bHQudmFsdWUubmFtZSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsIHZhbHVlOiByZXN1bHQuX2lkfV0sIHJlc3VsdC5faWQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2VcclxuXHJcblx0XHRcdFx0XHRpZiBfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpXHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZVxyXG5cclxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9zb3J0XHJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnRcclxuXHJcblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfbGltaXRcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0XHJcblxyXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwidXNlcnNcIlxyXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCJcclxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXHJcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWIhumDqOWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWIhumDqFxyXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5YiG6YOo6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJvcmdhbml6YXRpb25zXCJcclxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCJcclxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxyXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXHJcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXHJcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxyXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWIhumDqOWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWIhumDqFxyXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5YiG6YOo6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpZiB0eXBlb2YoZmllbGQucmVmZXJlbmNlX3RvKSA9PSBcImZ1bmN0aW9uXCJcclxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKClcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cclxuXHJcblx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKVxyXG5cdFx0XHRcdFx0XHRcdGZzLnR5cGUgPSBPYmplY3RcclxuXHRcdFx0XHRcdFx0XHRmcy5ibGFja2JveCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBTdHJpbmdcclxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogW1N0cmluZ11cclxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXVxyXG5cclxuXHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXVxyXG5cdFx0XHRcdFx0XHRpZiBfb2JqZWN0IGFuZCBfb2JqZWN0LmVuYWJsZV90cmVlXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXHJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCJcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gKCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XHJcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW11cclxuXHRcdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8uZm9yRWFjaCAoX3JlZmVyZW5jZSktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF9vYmplY3RcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogX29iamVjdD8ubGFiZWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IF9vYmplY3Q/Lmljb25cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb25cclxuXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIlxyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXHJcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCJcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xyXG5cdFx0XHRcdGlmIF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKVxyXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBmaWVsZC5maXJzdE9wdGlvblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIlxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY3VycmVuY3lcIlxyXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxyXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcclxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxyXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXHJcblx0XHRcdGVsc2UgaWYgZmllbGQ/LnNjYWxlICE9IDBcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IDJcclxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibnVtYmVyXCJcclxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XHJcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcclxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYm9vbGVhblwiXHJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXHJcblx0XHRcdGlmIGZpZWxkLnJlYWRvbmx5XHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0b2dnbGVcIlxyXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxyXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInJlZmVyZW5jZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImNoZWNrYm94XCJcclxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdC1jaGVja2JveFwiXHJcblx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlXCIgYW5kIGZpZWxkLmNvbGxlY3Rpb25cclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBmaWVsZC5jb2xsZWN0aW9uXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBmaWVsZC5jb2xsZWN0aW9uXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlc2l6ZVwiXHJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT0gXCJvYmplY3RcIlxyXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJncmlkXCJcclxuXHRcdFx0ZnMudHlwZSA9IEFycmF5XHJcblx0XHRcdGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZVxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiXHJcblxyXG5cdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdHR5cGU6IE9iamVjdFxyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaW1hZ2VcIlxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdpbWFnZXMnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXZhdGFyXCJcclxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcclxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cclxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxyXG5cdFx0XHRcdFx0YXV0b2Zvcm06XHJcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXZhdGFycydcclxuXHRcdFx0XHRcdFx0YWNjZXB0OiAnaW1hZ2UvKidcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXVkaW9cIlxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdhdWRpb3MnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2F1ZGlvLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdhdWRpby8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidmlkZW9cIlxyXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxyXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxyXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XHJcblx0XHRcdFx0XHRhdXRvZm9ybTpcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXHJcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICd2aWRlb3MnXHJcblx0XHRcdFx0XHRcdGFjY2VwdDogJ3ZpZGVvLyonXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJ1xyXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJ1xyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibG9jYXRpb25cIlxyXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIlxyXG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm1hcmtkb3duXCJcclxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLW1hcmtkb3duXCJcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAndXJsJ1xyXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXHJcblx0XHRcdCMgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguVXJsXHJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZW1haWwnXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdFx0ZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnXHJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2F1dG9udW1iZXInXHJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcclxuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc3VtbWFyeSdcclxuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cclxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAncGVyY2VudCdcclxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XHJcblx0XHRcdHVubGVzcyBfLmlzTnVtYmVyKGZpZWxkLnNjYWxlKVxyXG5cdFx0XHRcdCMg5rKh6YWN572u5bCP5pWw5L2N5pWw5YiZ5oyJ5bCP5pWw5L2N5pWwMOadpeWkhOeQhu+8jOWNs+m7mOiupOaYvuekuuS4uuaVtOaVsOeahOeZvuWIhuavlO+8jOavlOWmgjIwJe+8jOatpOaXtuaOp+S7tuWPr+S7pei+k+WFpTLkvY3lsI/mlbDvvIzovazmiJDnmb7liIbmr5TlsLHmmK/mlbTmlbBcclxuXHRcdFx0XHRmaWVsZC5zY2FsZSA9IDBcclxuXHRcdFx0IyBhdXRvZm9ybeaOp+S7tuS4reWwj+aVsOS9jeaVsOWni+e7iOavlOmFjee9rueahOS9jeaVsOWkmjLkvY1cclxuXHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZSArIDJcclxuXHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcclxuXHRcdGVsc2VcclxuXHRcdFx0ZnMudHlwZSA9IGZpZWxkLnR5cGVcclxuXHJcblx0XHRpZiBmaWVsZC5sYWJlbFxyXG5cdFx0XHRmcy5sYWJlbCA9IGZpZWxkLmxhYmVsXHJcblxyXG4jXHRcdGlmIGZpZWxkLmFsbG93ZWRWYWx1ZXNcclxuI1x0XHRcdGZzLmFsbG93ZWRWYWx1ZXMgPSBmaWVsZC5hbGxvd2VkVmFsdWVzXHJcblxyXG5cdFx0aWYgIWZpZWxkLnJlcXVpcmVkXHJcblx0XHRcdGZzLm9wdGlvbmFsID0gdHJ1ZVxyXG5cclxuXHRcdCMgW+etvue6puWvueixoeWQjOaXtumFjee9ruS6hmNvbXBhbnlfaWRz5b+F5aGr5Y+KdW5lZGl0YWJsZV9maWVsZHPpgKDmiJDpg6jliIbnlKjmiLfmlrDlu7rnrb7nuqblr7nosaHml7bmiqXplJkgIzE5Ml0oaHR0cHM6Ly9naXRodWIuY29tL3N0ZWVkb3Mvc3RlZWRvcy1wcm9qZWN0LWR6dWcvaXNzdWVzLzE5MilcclxuXHRcdCMg5ZCO5Y+w5aeL57uI6K6+572ucmVxdWlyZWTkuLpmYWxzZVxyXG5cdFx0aWYgIU1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC51bmlxdWVcclxuXHRcdFx0ZnMudW5pcXVlID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLm9taXRcclxuXHRcdFx0ZnMuYXV0b2Zvcm0ub21pdCA9IHRydWVcclxuXHJcblx0XHRpZiBmaWVsZC5ncm91cFxyXG5cdFx0XHRmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwXHJcblxyXG5cdFx0aWYgZmllbGQuaXNfd2lkZVxyXG5cdFx0XHRmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLmhpZGRlblxyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIlxyXG5cclxuXHRcdGlmIChmaWVsZC50eXBlID09IFwic2VsZWN0XCIpIG9yIChmaWVsZC50eXBlID09IFwibG9va3VwXCIpIG9yIChmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxyXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuZmlsdGVyYWJsZSkgPT0gJ3VuZGVmaW5lZCdcclxuXHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxyXG5cdFx0aWYgZmllbGQubmFtZSA9PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZVxyXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuc2VhcmNoYWJsZSkgPT0gJ3VuZGVmaW5lZCdcclxuXHRcdFx0XHRmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGF1dG9mb3JtX3R5cGVcclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGVcclxuXHJcblx0XHRpZiBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpXHJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gKCktPlxyXG5cdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge3VzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLCBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIG5vdzogbmV3IERhdGUoKX0pXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcclxuXHRcdFx0XHRpZiAhXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0XHRcdGZzLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLnJlYWRvbmx5XHJcblx0XHRcdGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLmRpc2FibGVkXHJcblx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxyXG5cclxuXHRcdGlmIGZpZWxkLmlubGluZUhlbHBUZXh0XHJcblx0XHRcdGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHRcclxuXHJcblx0XHRpZiBmaWVsZC5ibGFja2JveFxyXG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcclxuXHJcblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21pbicpXHJcblx0XHRcdGZzLm1pbiA9IGZpZWxkLm1pblxyXG5cdFx0aWYgXy5oYXMoZmllbGQsICdtYXgnKVxyXG5cdFx0XHRmcy5tYXggPSBmaWVsZC5tYXhcclxuXHJcblx0XHQjIOWPquacieeUn+S6p+eOr+Wig+aJjemHjeW7uue0ouW8lVxyXG5cdFx0aWYgTWV0ZW9yLmlzUHJvZHVjdGlvblxyXG5cdFx0XHRpZiBmaWVsZC5pbmRleFxyXG5cdFx0XHRcdGZzLmluZGV4ID0gZmllbGQuaW5kZXhcclxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5zb3J0YWJsZVxyXG5cdFx0XHRcdGZzLmluZGV4ID0gdHJ1ZVxyXG5cclxuXHRcdHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzXHJcblxyXG5cdHJldHVybiBzY2hlbWFcclxuXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSktPlxyXG5cdGh0bWwgPSBmaWVsZF92YWx1ZVxyXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxyXG5cdGlmICFvYmplY3RcclxuXHRcdHJldHVybiBcIlwiXHJcblx0ZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpXHJcblx0aWYgIWZpZWxkXHJcblx0XHRyZXR1cm4gXCJcIlxyXG5cclxuXHRpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxyXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKVxyXG5cdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxyXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJylcclxuXHJcblx0cmV0dXJuIGh0bWxcclxuXHJcbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gKGZpZWxkX3R5cGUpLT5cclxuXHRyZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcclxuXHJcbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpLT5cclxuXHRidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxyXG5cdGlmIGJ1aWx0aW5WYWx1ZXNcclxuXHRcdF8uZm9yRWFjaCBidWlsdGluVmFsdWVzLCAoYnVpbHRpbkl0ZW0sIGtleSktPlxyXG5cdFx0XHRvcGVyYXRpb25zLnB1c2goe2xhYmVsOiBidWlsdGluSXRlbS5sYWJlbCwgdmFsdWU6IGtleX0pXHJcblxyXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpLT5cclxuXHQjIOi/h+a7pOWZqOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxyXG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpXHJcblxyXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxyXG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XHJcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KVxyXG5cclxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IChmaWVsZF90eXBlLCB2YWx1ZSktPlxyXG5cdCMg5qC55o2u6L+H5ruk5Zmo55qE6L+H5ruk5YC877yM6I635Y+W5a+55bqU55qE5YaF572u6L+Q566X56ymXHJcblx0IyDmr5TlpoJ2YWx1ZeS4umxhc3RfeWVhcu+8jOi/lOWbnmJldHdlZW5fdGltZV9sYXN0X3llYXJcclxuXHR1bmxlc3MgXy5pc1N0cmluZyh2YWx1ZSlcclxuXHRcdHJldHVyblxyXG5cdGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxyXG5cdHVubGVzcyBiZXR3ZWVuQnVpbHRpblZhbHVlc1xyXG5cdFx0cmV0dXJuXHJcblx0cmVzdWx0ID0gbnVsbFxyXG5cdF8uZWFjaCBiZXR3ZWVuQnVpbHRpblZhbHVlcywgKGl0ZW0sIG9wZXJhdGlvbiktPlxyXG5cdFx0aWYgaXRlbS5rZXkgPT0gdmFsdWVcclxuXHRcdFx0cmVzdWx0ID0gb3BlcmF0aW9uXHJcblx0cmV0dXJuIHJlc3VsdFxyXG5cclxuIyDlpoLmnpzlj6rmmK/kuLrliKTmlq1vcGVyYXRpb27mmK/lkKblrZjlnKjvvIzliJnmsqHlv4XopoHorqHnrpd2YWx1ZXPvvIzkvKDlhaVpc19jaGVja19vbmx55Li6dHJ1ZeWNs+WPr1xyXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IChpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKS0+XHJcblx0IyDov4fmu6Tlmajml7bpl7TlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcclxuXHRyZXR1cm4ge1xyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcclxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxyXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXHJcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXHJcblx0fVxyXG5cclxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IChtb250aCktPlxyXG5cdGlmICFtb250aFxyXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcclxuXHRcclxuXHRpZiBtb250aCA8IDNcclxuXHRcdHJldHVybiAwXHJcblx0ZWxzZSBpZiBtb250aCA8IDZcclxuXHRcdHJldHVybiAzXHJcblx0ZWxzZSBpZiBtb250aCA8IDlcclxuXHRcdHJldHVybiA2XHJcblx0XHJcblx0cmV0dXJuIDlcclxuXHJcblxyXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxyXG5cdGlmICF5ZWFyXHJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdGlmIG1vbnRoIDwgM1xyXG5cdFx0eWVhci0tXHJcblx0XHRtb250aCA9IDlcclxuXHRlbHNlIGlmIG1vbnRoIDwgNlxyXG5cdFx0bW9udGggPSAwXHJcblx0ZWxzZSBpZiBtb250aCA8IDlcclxuXHRcdG1vbnRoID0gM1xyXG5cdGVsc2UgXHJcblx0XHRtb250aCA9IDZcclxuXHRcclxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0XHJcblxyXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxyXG5cdGlmICF5ZWFyXHJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdGlmIG1vbnRoIDwgM1xyXG5cdFx0bW9udGggPSAzXHJcblx0ZWxzZSBpZiBtb250aCA8IDZcclxuXHRcdG1vbnRoID0gNlxyXG5cdGVsc2UgaWYgbW9udGggPCA5XHJcblx0XHRtb250aCA9IDlcclxuXHRlbHNlXHJcblx0XHR5ZWFyKytcclxuXHRcdG1vbnRoID0gMFxyXG5cdFxyXG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcclxuXHJcbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gKHllYXIsbW9udGgpLT5cclxuXHRpZiBtb250aCA9PSAxMVxyXG5cdFx0cmV0dXJuIDMxXHJcblx0XHJcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XHJcblx0c3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXHJcblx0ZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoKzEsIDEpXHJcblx0ZGF5cyA9IChlbmREYXRlLXN0YXJ0RGF0ZSkvbWlsbGlzZWNvbmRcclxuXHRyZXR1cm4gZGF5c1xyXG5cclxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9ICh5ZWFyLCBtb250aCktPlxyXG5cdGlmICF5ZWFyXHJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXHJcblx0aWYgIW1vbnRoXHJcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxyXG5cdFxyXG5cdCMg5pyI5Lu95Li6MOS7o+ihqOacrOW5tOeahOesrOS4gOaciFxyXG5cdGlmIG1vbnRoID09IDBcclxuXHRcdG1vbnRoID0gMTFcclxuXHRcdHllYXItLVxyXG5cdFx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cdFxyXG5cdCMg5ZCm5YiZLOWPquWHj+WOu+aciOS7vVxyXG5cdG1vbnRoLS07XHJcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cdFxyXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cclxuXHQjIOi/h+a7pOWZqGJldHdlZW7ov5DnrpfnrKbvvIznjrDnrpfml6XmnJ8v5pel5pyf5pe26Ze057G75Z6L5a2X5q6155qEdmFsdWVz5YC8XHJcblx0bm93ID0gbmV3IERhdGUoKVxyXG5cdCMg5LiA5aSp55qE5q+r56eS5pWwXHJcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XHJcblx0eWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcclxuXHR0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcclxuXHQjIOS4gOWRqOS4reeahOafkOS4gOWkqVxyXG5cdHdlZWsgPSBub3cuZ2V0RGF5KClcclxuXHQjIOWHj+WOu+eahOWkqeaVsFxyXG5cdG1pbnVzRGF5ID0gaWYgd2VlayAhPSAwIHRoZW4gd2VlayAtIDEgZWxzZSA2XHJcblx0bW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSlcclxuXHRzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDkuIrlkajml6VcclxuXHRsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiK5ZGo5LiAXHJcblx0bGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpXHJcblx0IyDkuIvlkajkuIBcclxuXHRuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiL5ZGo5pelXHJcblx0bmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpXHJcblx0Y3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxyXG5cdHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMVxyXG5cdG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxXHJcblx0IyDlvZPliY3mnIjku71cclxuXHRjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKVxyXG5cdCMg6K6h5pWw5bm044CB5pyIXHJcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcblx0bW9udGggPSBub3cuZ2V0TW9udGgoKVxyXG5cdCMg5pys5pyI56ys5LiA5aSpXHJcblx0Zmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixjdXJyZW50TW9udGgsMSlcclxuXHJcblx0IyDlvZPkuLoxMuaciOeahOaXtuWAmeW5tOS7vemcgOimgeWKoDFcclxuXHQjIOaciOS7vemcgOimgeabtOaWsOS4ujAg5Lmf5bCx5piv5LiL5LiA5bm055qE56ys5LiA5Liq5pyIXHJcblx0aWYgY3VycmVudE1vbnRoID09IDExXHJcblx0XHR5ZWFyKytcclxuXHRcdG1vbnRoKytcclxuXHRlbHNlXHJcblx0XHRtb250aCsrXHJcblx0XHJcblx0IyDkuIvmnIjnrKzkuIDlpKlcclxuXHRuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxyXG5cdCMg5LiL5pyI5pyA5ZCO5LiA5aSpXHJcblx0bmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLG1vbnRoLENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsbW9udGgpKVxyXG5cdCMg5pys5pyI5pyA5ZCO5LiA5aSpXHJcblx0bGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxyXG5cdCMg5LiK5pyI56ys5LiA5aSpXHJcblx0bGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcclxuXHQjIOS4iuaciOacgOWQjuS4gOWkqVxyXG5cdGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXHJcblx0IyDmnKzlraPluqblvIDlp4vml6VcclxuXHR0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLDEpXHJcblx0IyDmnKzlraPluqbnu5PmnZ/ml6VcclxuXHR0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyKSlcclxuXHQjIOS4iuWto+W6puW8gOWni+aXpVxyXG5cdGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxyXG5cdCMg5LiK5a2j5bqm57uT5p2f5pelXHJcblx0bGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcclxuXHQjIOS4i+Wto+W6puW8gOWni+aXpVxyXG5cdG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxyXG5cdCMg5LiL5a2j5bqm57uT5p2f5pelXHJcblx0bmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcclxuXHQjIOi/h+WOuzflpKkgXHJcblx0bGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrszMOWkqVxyXG5cdGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrs2MOWkqVxyXG5cdGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrs5MOWkqVxyXG5cdGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDov4fljrsxMjDlpKlcclxuXHRsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpXHJcblx0IyDmnKrmnaU35aSpIFxyXG5cdG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lMzDlpKlcclxuXHRuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lNjDlpKlcclxuXHRuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lOTDlpKlcclxuXHRuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKVxyXG5cdCMg5pyq5p2lMTIw5aSpXHJcblx0bmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKVxyXG5cclxuXHRzd2l0Y2gga2V5XHJcblx0XHR3aGVuIFwibGFzdF95ZWFyXCJcclxuXHRcdFx0I+WOu+W5tFxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfeWVhclwiXHJcblx0XHRcdCPku4rlubRcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7Y3VycmVudFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF95ZWFyXCJcclxuXHRcdFx0I+aYjuW5tFxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tuZXh0WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0X3F1YXJ0ZXJcIlxyXG5cdFx0XHQj5LiK5a2j5bqmXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfcXVhcnRlclwiXHJcblx0XHRcdCPmnKzlraPluqZcclxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF9xdWFydGVyXCJcclxuXHRcdFx0I+S4i+Wto+W6plxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0X21vbnRoXCJcclxuXHRcdFx0I+S4iuaciFxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcInRoaXNfbW9udGhcIlxyXG5cdFx0XHQj5pys5pyIXHJcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0X21vbnRoXCJcclxuXHRcdFx0I+S4i+aciFxyXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3Rfd2Vla1wiXHJcblx0XHRcdCPkuIrlkahcclxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ0aGlzX3dlZWtcIlxyXG5cdFx0XHQj5pys5ZGoXHJcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfd2Vla1wiXHJcblx0XHRcdCPkuIvlkahcclxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ5ZXN0ZGF5XCJcclxuXHRcdFx0I+aYqOWkqVxyXG5cdFx0XHRzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJ0b2RheVwiXHJcblx0XHRcdCPku4rlpKlcclxuXHRcdFx0c3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9kYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwidG9tb3Jyb3dcIlxyXG5cdFx0XHQj5piO5aSpXHJcblx0XHRcdHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9tb3Jyb3d9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF83X2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67N+WkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSBcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzMwX2RheXNcIlxyXG5cdFx0XHQj6L+H5Y67MzDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcImxhc3RfNjBfZGF5c1wiXHJcblx0XHRcdCPov4fljrs2MOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibGFzdF85MF9kYXlzXCJcclxuXHRcdFx0I+i/h+WOuzkw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJsYXN0XzEyMF9kYXlzXCJcclxuXHRcdFx0I+i/h+WOuzEyMOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzdfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaU35aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF8zMF9kYXlzXCJcclxuXHRcdFx0I+acquadpTMw5aSpXHJcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKVxyXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcclxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcclxuXHRcdHdoZW4gXCJuZXh0XzYwX2RheXNcIlxyXG5cdFx0XHQj5pyq5p2lNjDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpXHJcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxyXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxyXG5cdFx0d2hlbiBcIm5leHRfOTBfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaU5MOWkqVxyXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcclxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxyXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHR3aGVuIFwibmV4dF8xMjBfZGF5c1wiXHJcblx0XHRcdCPmnKrmnaUxMjDlpKlcclxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXHJcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIilcclxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXHJcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXHJcblx0XHJcblx0dmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXVxyXG5cdGlmIGZpZWxkX3R5cGUgPT0gXCJkYXRldGltZVwiXHJcblx0XHQjIOaXtumXtOexu+Wei+Wtl+aute+8jOWGhee9ruaXtumXtOiMg+WbtOW6lOivpeiAg+iZkeWBj+enu+aXtuWMuuWAvO+8jOWQpuWImei/h+a7pOaVsOaNruWtmOWcqOWBj+W3rlxyXG5cdFx0IyDpnZ7lhoXnva7ml7bpl7TojIPlm7Tml7bvvIznlKjmiLfpgJrov4fml7bpl7Tmjqfku7bpgInmi6nnmoTojIPlm7TvvIzkvJroh6rliqjlpITnkIbml7bljLrlgY/lt67mg4XlhrVcclxuXHRcdCMg5pel5pyf57G75Z6L5a2X5q6177yM5pWw5o2u5bqT5pys5p2l5bCx5a2Y55qE5pivVVRD55qEMOeCue+8jOS4jeWtmOWcqOWBj+W3rlxyXG5cdFx0Xy5mb3JFYWNoIHZhbHVlcywgKGZ2KS0+XHJcblx0XHRcdGlmIGZ2XHJcblx0XHRcdFx0ZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCApXHJcblx0XHJcblx0cmV0dXJuIHtcclxuXHRcdGxhYmVsOiBsYWJlbFxyXG5cdFx0a2V5OiBrZXlcclxuXHRcdHZhbHVlczogdmFsdWVzXHJcblx0fVxyXG5cclxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSktPlxyXG5cdGlmIGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcclxuXHRcdHJldHVybiAnYmV0d2VlbidcclxuXHRlbHNlIGlmIFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcclxuXHRcdHJldHVybiAnY29udGFpbnMnXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIFwiPVwiXHJcblxyXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUpIC0+XHJcblx0IyDml6XmnJ/nsbvlnos6IGRhdGUsIGRhdGV0aW1lICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcclxuXHQjIOaWh+acrOexu+WeizogdGV4dCwgdGV4dGFyZWEsIGh0bWwgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIsIFwic3RhcnRzd2l0aFwiXHJcblx0IyDpgInmi6nnsbvlnos6IGxvb2t1cCwgbWFzdGVyX2RldGFpbCwgc2VsZWN0IOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxyXG5cdCMg5pWw5YC857G75Z6LOiBjdXJyZW5jeSwgbnVtYmVyICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcclxuXHQjIOW4g+WwlOexu+WeizogYm9vbGVhbiAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXHJcblx0IyDmlbDnu4Tnsbvlnos6IGNoZWNrYm94LCBbdGV4dF0gIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxyXG5cclxuXHRvcHRpb25hbHMgPSB7XHJcblx0XHRlcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLCB2YWx1ZTogXCI9XCJ9LFxyXG5cdFx0dW5lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksIHZhbHVlOiBcIjw+XCJ9LFxyXG5cdFx0bGVzc190aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLCB2YWx1ZTogXCI8XCJ9LFxyXG5cdFx0Z3JlYXRlcl90aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLCB2YWx1ZTogXCI+XCJ9LFxyXG5cdFx0bGVzc19vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksIHZhbHVlOiBcIjw9XCJ9LFxyXG5cdFx0Z3JlYXRlcl9vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksIHZhbHVlOiBcIj49XCJ9LFxyXG5cdFx0Y29udGFpbnM6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSwgdmFsdWU6IFwiY29udGFpbnNcIn0sXHJcblx0XHRub3RfY29udGFpbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJ9LFxyXG5cdFx0c3RhcnRzX3dpdGg6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSwgdmFsdWU6IFwic3RhcnRzd2l0aFwifSxcclxuXHRcdGJldHdlZW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLCB2YWx1ZTogXCJiZXR3ZWVuXCJ9LFxyXG5cdH1cclxuXHJcblx0aWYgZmllbGRfdHlwZSA9PSB1bmRlZmluZWRcclxuXHRcdHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpXHJcblxyXG5cdG9wZXJhdGlvbnMgPSBbXVxyXG5cclxuXHRpZiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKVxyXG5cdFx0Q3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucylcclxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGRfdHlwZSA9PSBcInRleHRhcmVhXCIgb3IgZmllbGRfdHlwZSA9PSBcImh0bWxcIiBvciBmaWVsZF90eXBlID09IFwiY29kZVwiXHJcbiNcdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5jb250YWlucywgb3B0aW9uYWxzLm5vdF9jb250YWluLCBvcHRpb25hbHMuc3RhcnRzX3dpdGgpXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgb3IgZmllbGRfdHlwZSA9PSBcInNlbGVjdFwiXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcclxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJjdXJyZW5jeVwiIG9yIGZpZWxkX3R5cGUgPT0gXCJudW1iZXJcIlxyXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbClcclxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJib29sZWFuXCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImNoZWNrYm94XCJcclxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxyXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcIlt0ZXh0XVwiXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcclxuXHRlbHNlXHJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcclxuXHJcblx0cmV0dXJuIG9wZXJhdGlvbnNcclxuXHJcbiMjI1xyXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXHJcbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcclxuIyMjXHJcbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IChvYmplY3RfbmFtZSktPlxyXG5cdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXHJcblx0ZmllbGRzQXJyID0gW11cclxuXHJcblx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkKS0+XHJcblx0XHRmaWVsZHNBcnIucHVzaCB7bmFtZTogZmllbGQubmFtZSwgc29ydF9ubzogZmllbGQuc29ydF9ub31cclxuXHJcblx0ZmllbGRzTmFtZSA9IFtdXHJcblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cclxuXHRcdGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKVxyXG5cdHJldHVybiBmaWVsZHNOYW1lXHJcbiIsIkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBmaWVsZHNBcnIsIHNjaGVtYTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc2NoZW1hID0ge307XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2gob2JqLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoIV8uaGFzKGZpZWxkLCBcIm5hbWVcIikpIHtcbiAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goZmllbGQpO1xuICB9KTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHZhciBfb2JqZWN0LCBfcmVmX29iaiwgX3JlZmVyZW5jZV90bywgYXV0b2Zvcm1fdHlwZSwgZmllbGRfbmFtZSwgZnMsIGlzVW5MaW1pdGVkLCBsb2NhbGUsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc2lPUygpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiLFxuICAgICAgICAgICAgICAgIHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCIsXG4gICAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCIsXG4gICAgICAgICAgICAgICAgcGlja2VyVHlwZTogXCJyb2xsZXJzXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PT0gXCJ6aC1DTlwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAgICAgfVxuICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgdHlwZTogXCJzdW1tZXJub3RlXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiAnc3VtbWVybm90ZS1lZGl0b3InLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICAgIGRpYWxvZ3NJbkJvZHk6IHRydWUsXG4gICAgICAgICAgICB0b29sYmFyOiBbWydmb250MScsIFsnc3R5bGUnXV0sIFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSwgWydmb250MycsIFsnZm9udG5hbWUnXV0sIFsnY29sb3InLCBbJ2NvbG9yJ11dLCBbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSwgWyd0YWJsZScsIFsndGFibGUnXV0sIFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sIFsndmlldycsIFsnY29kZXZpZXcnXV1dLFxuICAgICAgICAgICAgZm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCAn6buR5L2TJywgJ+W+rui9r+mbhem7kScsICfku7/lrosnLCAn5qW35L2TJywgJ+matuS5picsICflubzlnIYnXSxcbiAgICAgICAgICAgIGxhbmc6IGxvY2FsZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIH1cbiAgICAgIGlmICghZmllbGQuaGlkZGVuKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzO1xuICAgICAgICBmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vbjtcbiAgICAgICAgaWYgKGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbikge1xuICAgICAgICAgIGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBmcy5maWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPyBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gOiBDcmVhdG9yLmV2YWx1YXRlRmlsdGVycztcbiAgICAgICAgaWYgKGZpZWxkLm9wdGlvbnNGdW5jdGlvbikge1xuICAgICAgICAgIGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgICAgIGlmIChfcmVmX29iaiAhPSBudWxsID8gKHJlZjEgPSBfcmVmX29iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjEuYWxsb3dDcmVhdGUgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKGxvb2t1cF9maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICBmb3JtSWQ6IFwibmV3XCIgKyAoZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCAnXycpKSxcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogXCJcIiArIGZpZWxkLnJlZmVyZW5jZV90byxcbiAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbihvcGVyYXRpb24sIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lm9iamVjdF9uYW1lID09PSBcIm9iamVjdHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogcmVzdWx0LnZhbHVlLmljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC52YWx1ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0Ll9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3NvcnQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfbGltaXQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYyID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMi5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJvcmdhbml6YXRpb25zXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMyA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjMuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmllbGQucmVmZXJlbmNlX3RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoX3JlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgICAgICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogW1N0cmluZ10sXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXTtcbiAgICAgICAgICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI7XG4gICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdO1xuICAgICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8uZm9yRWFjaChmdW5jdGlvbihfcmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdO1xuICAgICAgICAgICAgICAgICAgaWYgKF9vYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmxhYmVsIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGljb246IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgICAgaWYgKF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRvZ2dsZVwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInJlZmVyZW5jZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIjtcbiAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlXCIgJiYgZmllbGQuY29sbGVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBmaWVsZC5jb2xsZWN0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGZpZWxkLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVzaXplXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZ3JpZFwiKSB7XG4gICAgICBmcy50eXBlID0gQXJyYXk7XG4gICAgICBmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWU7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiO1xuICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2ltYWdlcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdmF0YXJcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXZhdGFycycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXVkaW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2F1ZGlvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInZpZGVvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ3ZpZGVvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICd2aWRlby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb2NhdGlvblwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIjtcbiAgICAgIGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCI7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLW1hcmtkb3duXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAndXJsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZW1haWwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWw7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHtcbiAgICAgICAgICAgIHR5cGU6IGZpZWxkLmRhdGFfdHlwZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pW2ZpZWxkLm5hbWVdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICBmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7XG4gICAgICAgICAgICB0eXBlOiBmaWVsZC5kYXRhX3R5cGVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVtmaWVsZC5uYW1lXTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdwZXJjZW50Jykge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmICghXy5pc051bWJlcihmaWVsZC5zY2FsZSkpIHtcbiAgICAgICAgZmllbGQuc2NhbGUgPSAwO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZSArIDI7XG4gICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnMudHlwZSA9IGZpZWxkLnR5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5sYWJlbCkge1xuICAgICAgZnMubGFiZWwgPSBmaWVsZC5sYWJlbDtcbiAgICB9XG4gICAgaWYgKCFmaWVsZC5yZXF1aXJlZCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQudW5pcXVlKSB7XG4gICAgICBmcy51bmlxdWUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQub21pdCkge1xuICAgICAgZnMuYXV0b2Zvcm0ub21pdCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ncm91cCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlzX3dpZGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaGlkZGVuKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIjtcbiAgICB9XG4gICAgaWYgKChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5maWx0ZXJhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLm5hbWUgPT09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLnNlYXJjaGFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXV0b2Zvcm1fdHlwZSkge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kZWZhdWx0VmFsdWUpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7XG4gICAgICAgICAgICB1c2VySWQ6IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSxcbiAgICAgICAgICAgIG5vdzogbmV3IERhdGUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgICAgZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGlzYWJsZWQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlubGluZUhlbHBUZXh0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0O1xuICAgIH1cbiAgICBpZiAoZmllbGQuYmxhY2tib3gpIHtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWluJykpIHtcbiAgICAgIGZzLm1pbiA9IGZpZWxkLm1pbjtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWF4JykpIHtcbiAgICAgIGZzLm1heCA9IGZpZWxkLm1heDtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1Byb2R1Y3Rpb24pIHtcbiAgICAgIGlmIChmaWVsZC5pbmRleCkge1xuICAgICAgICBmcy5pbmRleCA9IGZpZWxkLmluZGV4O1xuICAgICAgfSBlbHNlIGlmIChmaWVsZC5zb3J0YWJsZSkge1xuICAgICAgICBmcy5pbmRleCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzY2hlbWFbZmllbGRfbmFtZV0gPSBmcztcbiAgfSk7XG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKSB7XG4gIHZhciBmaWVsZCwgaHRtbCwgb2JqZWN0O1xuICBodG1sID0gZmllbGRfdmFsdWU7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSk7XG4gIGlmICghZmllbGQpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKTtcbiAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICB9XG4gIHJldHVybiBodG1sO1xufTtcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKTtcbn07XG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgb3BlcmF0aW9ucykge1xuICB2YXIgYnVpbHRpblZhbHVlcztcbiAgYnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmIChidWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuIF8uZm9yRWFjaChidWlsdGluVmFsdWVzLCBmdW5jdGlvbihidWlsdGluSXRlbSwga2V5KSB7XG4gICAgICByZXR1cm4gb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLFxuICAgICAgICB2YWx1ZToga2V5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIGtleSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlLCB2YWx1ZSkge1xuICB2YXIgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIHJlc3VsdDtcbiAgaWYgKCFfLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmICghYmV0d2VlbkJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVzdWx0ID0gbnVsbDtcbiAgXy5lYWNoKGJldHdlZW5CdWlsdGluVmFsdWVzLCBmdW5jdGlvbihpdGVtLCBvcGVyYXRpb24pIHtcbiAgICBpZiAoaXRlbS5rZXkgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzdWx0ID0gb3BlcmF0aW9uO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIHtcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSBmdW5jdGlvbihtb250aCkge1xuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHJldHVybiAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIHJldHVybiAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIHJldHVybiA2O1xuICB9XG4gIHJldHVybiA5O1xufTtcblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHllYXItLTtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIHtcbiAgICBtb250aCA9IDY7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSA2O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGggPSAwO1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIHZhciBkYXlzLCBlbmREYXRlLCBtaWxsaXNlY29uZCwgc3RhcnREYXRlO1xuICBpZiAobW9udGggPT09IDExKSB7XG4gICAgcmV0dXJuIDMxO1xuICB9XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgc3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAxKTtcbiAgZGF5cyA9IChlbmREYXRlIC0gc3RhcnREYXRlKSAvIG1pbGxpc2Vjb25kO1xuICByZXR1cm4gZGF5cztcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPT09IDApIHtcbiAgICBtb250aCA9IDExO1xuICAgIHllYXItLTtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICB9XG4gIG1vbnRoLS07XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICB2YXIgY3VycmVudE1vbnRoLCBjdXJyZW50WWVhciwgZW5kVmFsdWUsIGZpcnN0RGF5LCBsYWJlbCwgbGFzdERheSwgbGFzdE1vbmRheSwgbGFzdE1vbnRoRmluYWxEYXksIGxhc3RNb250aEZpcnN0RGF5LCBsYXN0UXVhcnRlckVuZERheSwgbGFzdFF1YXJ0ZXJTdGFydERheSwgbGFzdFN1bmRheSwgbGFzdF8xMjBfZGF5cywgbGFzdF8zMF9kYXlzLCBsYXN0XzYwX2RheXMsIGxhc3RfN19kYXlzLCBsYXN0XzkwX2RheXMsIG1pbGxpc2Vjb25kLCBtaW51c0RheSwgbW9uZGF5LCBtb250aCwgbmV4dE1vbmRheSwgbmV4dE1vbnRoRmluYWxEYXksIG5leHRNb250aEZpcnN0RGF5LCBuZXh0UXVhcnRlckVuZERheSwgbmV4dFF1YXJ0ZXJTdGFydERheSwgbmV4dFN1bmRheSwgbmV4dFllYXIsIG5leHRfMTIwX2RheXMsIG5leHRfMzBfZGF5cywgbmV4dF82MF9kYXlzLCBuZXh0XzdfZGF5cywgbmV4dF85MF9kYXlzLCBub3csIHByZXZpb3VzWWVhciwgc3RhcnRWYWx1ZSwgc3RyRW5kRGF5LCBzdHJGaXJzdERheSwgc3RyTGFzdERheSwgc3RyTW9uZGF5LCBzdHJTdGFydERheSwgc3RyU3VuZGF5LCBzdHJUb2RheSwgc3RyVG9tb3Jyb3csIHN0clllc3RkYXksIHN1bmRheSwgdGhpc1F1YXJ0ZXJFbmREYXksIHRoaXNRdWFydGVyU3RhcnREYXksIHRvbW9ycm93LCB2YWx1ZXMsIHdlZWssIHllYXIsIHllc3RkYXk7XG4gIG5vdyA9IG5ldyBEYXRlKCk7XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgeWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgd2VlayA9IG5vdy5nZXREYXkoKTtcbiAgbWludXNEYXkgPSB3ZWVrICE9PSAwID8gd2VlayAtIDEgOiA2O1xuICBtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdFN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgbmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIG5leHRTdW5kYXkgPSBuZXcgRGF0ZShuZXh0TW9uZGF5LmdldFRpbWUoKSArIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgY3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgcHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxO1xuICBuZXh0WWVhciA9IGN1cnJlbnRZZWFyICsgMTtcbiAgY3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgZmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCAxKTtcbiAgaWYgKGN1cnJlbnRNb250aCA9PT0gMTEpIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGgrKztcbiAgfSBlbHNlIHtcbiAgICBtb250aCsrO1xuICB9XG4gIG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLCBtb250aCkpO1xuICBsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwgMSk7XG4gIHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyKSk7XG4gIGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlIFwibGFzdF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc195ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3Rfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc193ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ5ZXN0ZGF5XCI6XG4gICAgICBzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9kYXlcIjpcbiAgICAgIHN0clRvZGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b21vcnJvd1wiOlxuICAgICAgc3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gIH1cbiAgdmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIF8uZm9yRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGZ2KSB7XG4gICAgICBpZiAoZnYpIHtcbiAgICAgICAgcmV0dXJuIGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGtleToga2V5LFxuICAgIHZhbHVlczogdmFsdWVzXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgaWYgKGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2JldHdlZW4nO1xuICB9IGVsc2UgaWYgKFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2NvbnRhaW5zJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCI9XCI7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHZhciBvcGVyYXRpb25zLCBvcHRpb25hbHM7XG4gIG9wdGlvbmFscyA9IHtcbiAgICBlcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI9XCJcbiAgICB9LFxuICAgIHVuZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PlwiXG4gICAgfSxcbiAgICBsZXNzX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIjxcIlxuICAgIH0sXG4gICAgZ3JlYXRlcl90aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI+XCJcbiAgICB9LFxuICAgIGxlc3Nfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PVwiXG4gICAgfSxcbiAgICBncmVhdGVyX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPj1cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLFxuICAgICAgdmFsdWU6IFwiY29udGFpbnNcIlxuICAgIH0sXG4gICAgbm90X2NvbnRhaW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksXG4gICAgICB2YWx1ZTogXCJub3Rjb250YWluc1wiXG4gICAgfSxcbiAgICBzdGFydHNfd2l0aDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksXG4gICAgICB2YWx1ZTogXCJzdGFydHN3aXRoXCJcbiAgICB9LFxuICAgIGJldHdlZW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksXG4gICAgICB2YWx1ZTogXCJiZXR3ZWVuXCJcbiAgICB9XG4gIH07XG4gIGlmIChmaWVsZF90eXBlID09PSB2b2lkIDApIHtcbiAgICByZXR1cm4gXy52YWx1ZXMob3B0aW9uYWxzKTtcbiAgfVxuICBvcGVyYXRpb25zID0gW107XG4gIGlmIChDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbik7XG4gICAgQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJ0ZXh0YXJlYVwiIHx8IGZpZWxkX3R5cGUgPT09IFwiaHRtbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwiY29kZVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5jb250YWlucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZF90eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCBmaWVsZF90eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY3VycmVuY3lcIiB8fCBmaWVsZF90eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiW3RleHRdXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9XG4gIHJldHVybiBvcGVyYXRpb25zO1xufTtcblxuXG4vKlxuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBmaWVsZHMsIGZpZWxkc0FyciwgZmllbGRzTmFtZSwgcmVmO1xuICBmaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKHtcbiAgICAgIG5hbWU6IGZpZWxkLm5hbWUsXG4gICAgICBzb3J0X25vOiBmaWVsZC5zb3J0X25vXG4gICAgfSk7XG4gIH0pO1xuICBmaWVsZHNOYW1lID0gW107XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIGZpZWxkc05hbWU7XG59O1xuIiwiQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9XHJcblxyXG5pbml0VHJpZ2dlciA9IChvYmplY3RfbmFtZSwgdHJpZ2dlciktPlxyXG5cdHRyeVxyXG5cdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcclxuXHRcdGlmICF0cmlnZ2VyLnRvZG9cclxuXHRcdFx0cmV0dXJuXHJcblx0XHR0b2RvV3JhcHBlciA9ICgpLT5cclxuXHRcdFx0ICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWVcclxuXHRcdFx0ICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcclxuXHRcdGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS5pbnNlcnRcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/Lmluc2VydCh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUudXBkYXRlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy51cGRhdGUodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLnJlbW92ZVwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxyXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLmluc2VydFwiXHJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy5pbnNlcnQodG9kb1dyYXBwZXIpXHJcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIudXBkYXRlXCJcclxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/LnVwZGF0ZSh0b2RvV3JhcHBlcilcclxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5yZW1vdmVcIlxyXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxyXG5cdGNhdGNoIGVycm9yXHJcblx0XHRjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKVxyXG5cclxuY2xlYW5UcmlnZ2VyID0gKG9iamVjdF9uYW1lKS0+XHJcblx0IyMjXHJcbiAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxyXG4gICAgXHTlm6DkuLrkuIDkuKrmlbDnu4TlhYPntKDliKDpmaTlkI7vvIzlhbbku5blhYPntKDnmoTkuIvmoIfkvJrlj5HnlJ/lj5jljJZcclxuXHQjIyNcclxuICAgICNUT0RPIOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbBidWdcclxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXT8ucmV2ZXJzZSgpLmZvckVhY2ggKF9ob29rKS0+XHJcblx0XHRfaG9vay5yZW1vdmUoKVxyXG5cclxuQ3JlYXRvci5pbml0VHJpZ2dlcnMgPSAob2JqZWN0X25hbWUpLT5cclxuI1x0Y29uc29sZS5sb2coJ0NyZWF0b3IuaW5pdFRyaWdnZXJzIG9iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpXHJcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblxyXG5cdGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSlcclxuXHJcblx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0gPSBbXVxyXG5cclxuXHRfLmVhY2ggb2JqLnRyaWdnZXJzLCAodHJpZ2dlciwgdHJpZ2dlcl9uYW1lKS0+XHJcblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgYW5kIHRyaWdnZXIub24gPT0gXCJzZXJ2ZXJcIiBhbmQgdHJpZ2dlci50b2RvIGFuZCB0cmlnZ2VyLndoZW5cclxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXHJcblx0XHRcdGlmIF90cmlnZ2VyX2hvb2tcclxuXHRcdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIiBhbmQgdHJpZ2dlci50b2RvIGFuZCB0cmlnZ2VyLndoZW5cclxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXHJcblx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaykiLCJ2YXIgY2xlYW5UcmlnZ2VyLCBpbml0VHJpZ2dlcjtcblxuQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9O1xuXG5pbml0VHJpZ2dlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB0cmlnZ2VyKSB7XG4gIHZhciBjb2xsZWN0aW9uLCBlcnJvciwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCB0b2RvV3JhcHBlcjtcbiAgdHJ5IHtcbiAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIXRyaWdnZXIudG9kbykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0b2RvV3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lO1xuICAgICAgcmV0dXJuIHRyaWdnZXIudG9kby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUuaW5zZXJ0XCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYuaW5zZXJ0KHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUudXBkYXRlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMSA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmMS51cGRhdGUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYyID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYyLnJlbW92ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIuaW5zZXJ0XCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMyA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWYzLmluc2VydCh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIudXBkYXRlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmNCA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWY0LnVwZGF0ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmNSA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWY1LnJlbW92ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICBlcnJvciA9IGVycm9yMTtcbiAgICByZXR1cm4gY29uc29sZS5lcnJvcignaW5pdFRyaWdnZXIgZXJyb3InLCBlcnJvcik7XG4gIH1cbn07XG5cbmNsZWFuVHJpZ2dlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG5cbiAgLypcbiAgICAgXHTnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWw5piv5L2/55So5LiL5qCH5Yig6Zmk5a+56LGh55qE77yM5omA5Lul5q2k5aSE5Y+N6L2saG9va3Ppm4blkIjlkI7vvIzlho3liKDpmaRcbiAgICAgXHTlm6DkuLrkuIDkuKrmlbDnu4TlhYPntKDliKDpmaTlkI7vvIzlhbbku5blhYPntKDnmoTkuIvmoIfkvJrlj5HnlJ/lj5jljJZcbiAgICovXG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0pICE9IG51bGwgPyByZWYucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24oX2hvb2spIHtcbiAgICByZXR1cm4gX2hvb2sucmVtb3ZlKCk7XG4gIH0pIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pbml0VHJpZ2dlcnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgb2JqO1xuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW107XG4gIHJldHVybiBfLmVhY2gob2JqLnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpIHtcbiAgICB2YXIgX3RyaWdnZXJfaG9vaztcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIGlmIChfdHJpZ2dlcl9ob29rKSB7XG4gICAgICAgIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vayk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgcmV0dXJuIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vayk7XG4gICAgfVxuICB9KTtcbn07XG4iLCJjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJylcclxuXHJcbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0aWYgIW9iamVjdF9uYW1lXHJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRpZiAhb2JqXHJcblx0XHRcdHJldHVyblxyXG5cdFx0cmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKVxyXG5cdGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblxyXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxyXG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcclxuXHJcblx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cdFxyXG5cdGlmIHJlY29yZCBhbmQgb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIiBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHQjIOWmguaenOaYr2Ntc19maWxlc+mZhOS7tu+8jOWImeadg+mZkOWPluWFtueItuiusOW9leadg+mZkFxyXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJylcclxuXHRcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bor6bnu4bnlYzpnaJcclxuXHRcdFx0b2JqZWN0X25hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcclxuXHRcdFx0cmVjb3JkX2lkID0gcmVjb3JkLnBhcmVudC5faWQ7XHJcblx0XHRlbHNlIFxyXG5cdFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tueahOeItuiusOW9leeVjOmdolxyXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpO1xyXG5cdFx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcclxuXHRcdG9iamVjdF9maWVsZHNfa2V5cyA9IF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/LmZpZWxkcyBvciB7fSkgfHwgW107XHJcblx0XHRzZWxlY3QgPSBfLmludGVyc2VjdGlvbihvYmplY3RfZmllbGRzX2tleXMsIFsnb3duZXInLCAnY29tcGFueV9pZCcsICdjb21wYW55X2lkcycsICdsb2NrZWQnXSkgfHwgW107XHJcblx0XHRpZiBzZWxlY3QubGVuZ3RoID4gMFxyXG5cdFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3Quam9pbignLCcpKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0cmVjb3JkID0gbnVsbDtcclxuXHJcblx0cGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpXHJcblxyXG5cdGlmIHJlY29yZFxyXG5cdFx0aWYgcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9uc1xyXG5cdFx0XHRyZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9uc1xyXG5cclxuXHRcdGlzT3duZXIgPSByZWNvcmQub3duZXIgPT0gdXNlcklkIHx8IHJlY29yZC5vd25lcj8uX2lkID09IHVzZXJJZFxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKClcclxuXHRcdGVsc2VcclxuXHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKVxyXG5cdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQ/LmNvbXBhbnlfaWRcclxuXHRcdGlmIHJlY29yZF9jb21wYW55X2lkIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSBhbmQgcmVjb3JkX2NvbXBhbnlfaWQuX2lkXHJcblx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWTmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahG9iamVjdO+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxyXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZFxyXG5cdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkPy5jb21wYW55X2lkc1xyXG5cdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSlcclxuXHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZHPmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahFtvYmplY3Rd77yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XHJcblx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoKG4pLT4gbi5faWQpXHJcblx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSlcclxuXHRcdGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcclxuXHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxyXG5cdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXHJcblx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcclxuXHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxyXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2VcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcclxuXHRcdFxyXG5cdFx0aWYgcmVjb3JkLmxvY2tlZCBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxyXG5cclxuXHRcdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2VcclxuXHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXHJcblx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcclxuXHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxyXG5cdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5p+l55yLXHJcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lk5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+afpeeci1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2VcclxuXHJcblx0cmV0dXJuIHBlcm1pc3Npb25zXHJcblxyXG5cclxuIyBjdXJyZW50T2JqZWN0TmFtZe+8muW9k+WJjeS4u+WvueixoVxyXG4jIHJlbGF0ZWRMaXN0SXRlbe+8mkNyZWF0b3IuZ2V0UmVsYXRlZExpc3QoU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSwgU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikp5Lit5Y+WcmVsYXRlZF9vYmplY3RfbmFtZeWvueW6lOeahOWAvFxyXG4jIGN1cnJlbnRSZWNvcmTlvZPliY3kuLvlr7nosaHnmoTor6bnu4borrDlvZVcclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0Q3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxyXG5cdFx0aWYgIWN1cnJlbnRPYmplY3ROYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0Y3VycmVudE9iamVjdE5hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblxyXG5cdFx0aWYgIXJlbGF0ZWRMaXN0SXRlbVxyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwicmVsYXRlZExpc3RJdGVtIG11c3Qgbm90IGJlIGVtcHR5IGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zXCIpO1xyXG5cdFx0XHRyZXR1cm4ge31cclxuXHJcblx0XHRpZiAhY3VycmVudFJlY29yZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXHJcblxyXG5cdFx0aWYgIXVzZXJJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cclxuXHRcdGlmICFzcGFjZUlkIGFuZCBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxyXG5cclxuXHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZExpc3RJdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIHx8IGZhbHNlXHJcblx0XHRtYXN0ZXJBbGxvdyA9IGZhbHNlXHJcblx0XHRtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKVxyXG5cdFx0aWYgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT0gdHJ1ZVxyXG5cdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkXHJcblx0XHRlbHNlIGlmIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09IGZhbHNlXHJcblx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRcclxuXHJcblx0XHR1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKVxyXG5cdFx0cmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpXHJcblx0XHRpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMVxyXG5cclxuXHRcdHJlc3VsdCA9IF8uY2xvbmUgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zXHJcblx0XHRyZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxyXG5cdFx0cmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxyXG5cdFx0cmV0dXJuIHJlc3VsdFxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblxyXG5cdENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkKSAtPlxyXG5cdFx0cGVybWlzc2lvbnMgPVxyXG5cdFx0XHRvYmplY3RzOiB7fVxyXG5cdFx0XHRhc3NpZ25lZF9hcHBzOiBbXVxyXG5cdFx0IyMjXHJcblx0XHTmnYPpmZDpm4bor7TmmI46XHJcblx0XHTlhoXnva7mnYPpmZDpm4YtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXHJcblx0XHToh6rlrprkuYnmnYPpmZDpm4Yt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ6ZuG5Lul5aSW55qE5YW25LuW5p2D6ZmQ6ZuGXHJcblx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxyXG5cdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ6ZuGXHJcblx0XHQjIyNcclxuXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxyXG5cdFx0c3BhY2VVc2VyID0gbnVsbFxyXG5cdFx0aWYgdXNlcklkXHJcblx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXHJcblxyXG5cdFx0cHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXHJcblx0XHRwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXHJcblx0XHRwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0cHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXHJcblxyXG5cdFx0cHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXHJcblx0XHRwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxyXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXHJcblx0XHRlbHNlXHJcblx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcclxuXHJcblx0XHRwc2V0c0FkbWluX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzVXNlcl9wb3MgPSBudWxsXHJcblx0XHRwc2V0c01lbWJlcl9wb3MgPSBudWxsXHJcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IG51bGxcclxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSBudWxsXHJcblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGxcclxuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbFxyXG5cclxuXHRcdGlmIHBzZXRzQWRtaW4/Ll9pZFxyXG5cdFx0XHRwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzVXNlcj8uX2lkXHJcblx0XHRcdHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzTWVtYmVyPy5faWRcclxuXHRcdFx0cHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c01lbWJlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzR3Vlc3Q/Ll9pZFxyXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzU3VwcGxpZXI/Ll9pZFxyXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdGlmIHBzZXRzQ3VzdG9tZXI/Ll9pZFxyXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNDdXN0b21lci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHJcblx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxyXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwiX2lkXCJcclxuXHRcdFx0cHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogc2V0X2lkc319KS5mZXRjaCgpXHJcblx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXHJcblxyXG5cdFx0cHNldHMgPSB7XHJcblx0XHRcdHBzZXRzQWRtaW4sIFxyXG5cdFx0XHRwc2V0c1VzZXIsIFxyXG5cdFx0XHRwc2V0c0N1cnJlbnQsIFxyXG5cdFx0XHRwc2V0c01lbWJlciwgXHJcblx0XHRcdHBzZXRzR3Vlc3QsXHJcblx0XHRcdHBzZXRzU3VwcGxpZXIsXHJcblx0XHRcdHBzZXRzQ3VzdG9tZXIsXHJcblx0XHRcdGlzU3BhY2VBZG1pbixcclxuXHRcdFx0c3BhY2VVc2VyLCBcclxuXHRcdFx0cHNldHNBZG1pbl9wb3MsIFxyXG5cdFx0XHRwc2V0c1VzZXJfcG9zLCBcclxuXHRcdFx0cHNldHNNZW1iZXJfcG9zLCBcclxuXHRcdFx0cHNldHNHdWVzdF9wb3MsXHJcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zLFxyXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyxcclxuXHRcdFx0cHNldHNDdXJyZW50X3Bvc1xyXG5cdFx0fVxyXG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcclxuXHRcdHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXNcclxuXHRcdF9pID0gMFxyXG5cdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cclxuXHRcdFx0X2krK1xyXG5cdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PSBzcGFjZUlkXHJcblx0XHRcdFx0aWYgIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09ICcwJyB8fCAob2JqZWN0LmluX2RldmVsb3BtZW50ICE9ICcwJyAmJiBpc1NwYWNlQWRtaW4pXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHJcblx0dW5pb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cclxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXHJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcclxuXHRcdGlmICFhcnJheVxyXG5cdFx0XHRhcnJheSA9IFtdXHJcblx0XHRpZiAhb3RoZXJcclxuXHRcdFx0b3RoZXIgPSBbXVxyXG5cdFx0cmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKVxyXG5cclxuXHRpbnRlcnNlY3Rpb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cclxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXHJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcclxuXHRcdGlmICFhcnJheVxyXG5cdFx0XHRhcnJheSA9IFtdXHJcblx0XHRpZiAhb3RoZXJcclxuXHRcdFx0b3RoZXIgPSBbXVxyXG5cdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcilcclxuXHJcblx0Q3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0XHRwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0cHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdHBzZXRzU3VwcGxpZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0cHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdCMgcHNldHNNZW1iZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdCMgcHNldHNHdWVzdCA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcclxuXHRcdHNwYWNlVXNlciA9IG51bGw7XHJcblx0XHRpZiB1c2VySWRcclxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXHJcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcclxuXHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXHJcblx0XHRlbHNlXHJcblx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRhcHBzID0gW11cclxuXHRcdGlmIGlzU3BhY2VBZG1pblxyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGVsc2VcclxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGVcclxuXHRcdFx0cHNldEJhc2UgPSBwc2V0c1VzZXJcclxuXHRcdFx0aWYgdXNlclByb2ZpbGVcclxuXHRcdFx0XHRpZiB1c2VyUHJvZmlsZSA9PSAnc3VwcGxpZXInXHJcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXJcclxuXHRcdFx0XHRlbHNlIGlmIHVzZXJQcm9maWxlID09ICdjdXN0b21lcidcclxuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNDdXN0b21lclxyXG5cdFx0XHRpZiBwc2V0QmFzZT8uYXNzaWduZWRfYXBwcz8ubGVuZ3RoXHJcblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwc1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyB1c2Vy5p2D6ZmQ6ZuG5Lit55qEYXNzaWduZWRfYXBwc+ihqOekuuaJgOacieeUqOaIt+WFt+acieeahGFwcHPmnYPpmZDvvIzkuLrnqbrliJnooajnpLrmnInmiYDmnIlhcHBz5p2D6ZmQ77yM5LiN6ZyA6KaB5L2c5p2D6ZmQ5Yik5pat5LqGXHJcblx0XHRcdFx0cmV0dXJuIFtdXHJcblx0XHRcdF8uZWFjaCBwc2V0cywgKHBzZXQpLT5cclxuXHRcdFx0XHRpZiAhcHNldC5hc3NpZ25lZF9hcHBzXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRpZiBwc2V0Lm5hbWUgPT0gXCJhZG1pblwiIHx8ICBwc2V0Lm5hbWUgPT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09ICdjdXN0b21lcidcclxuXHRcdFx0XHRcdCMg6L+Z6YeM5LmL5omA5Lul6KaB5o6S6ZmkYWRtaW4vdXNlcu+8jOaYr+WboOS4uui/meS4pOS4quadg+mZkOmbhuaYr+aJgOacieadg+mZkOmbhuS4rXVzZXJz5bGe5oCn5peg5pWI55qE5p2D6ZmQ6ZuG77yM54m55oyH5bel5L2c5Yy6566h55CG5ZGY5ZKM5omA5pyJ55So5oi3XHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHNcclxuXHRcdFx0cmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksdW5kZWZpbmVkLG51bGwpXHJcblxyXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcclxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0YWRtaW5NZW51cyA9IENyZWF0b3IuQXBwcy5hZG1pbj8uYWRtaW5fbWVudXNcclxuXHRcdCMg5aaC5p6c5rKh5pyJYWRtaW7oj5zljZXor7TmmI7kuI3pnIDopoHnm7jlhbPlip/og73vvIznm7TmjqXov5Tlm57nqbpcclxuXHRcdHVubGVzcyBhZG1pbk1lbnVzXHJcblx0XHRcdHJldHVybiBbXVxyXG5cdFx0YWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kIChuKSAtPlxyXG5cdFx0XHRuLl9pZCA9PSAnYWJvdXQnXHJcblx0XHRhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIgKG4pIC0+XHJcblx0XHRcdG4uX2lkICE9ICdhYm91dCdcclxuXHRcdG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeSBfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCAobikgLT5cclxuXHRcdFx0cmV0dXJuIG4uYWRtaW5fbWVudXMgYW5kIG4uX2lkICE9ICdhZG1pbidcclxuXHRcdCksICdzb3J0J1xyXG5cdFx0b3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpXHJcblx0XHQjIOiPnOWNleacieS4iemDqOWIhue7hOaIkO+8jOiuvue9rkFQUOiPnOWNleOAgeWFtuS7lkFQUOiPnOWNleS7peWPimFib3V06I+c5Y2VXHJcblx0XHRhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pXHJcblx0XHRpZiBpc1NwYWNlQWRtaW5cclxuXHRcdFx0IyDlt6XkvZzljLrnrqHnkIblkZjmnInlhajpg6joj5zljZXlip/og71cclxuXHRcdFx0cmVzdWx0ID0gYWxsTWVudXNcclxuXHRcdGVsc2VcclxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGUgfHwgJ3VzZXInXHJcblx0XHRcdGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAgKG4pIC0+XHJcblx0XHRcdFx0cmV0dXJuIG4ubmFtZVxyXG5cdFx0XHRtZW51cyA9IGFsbE1lbnVzLmZpbHRlciAobWVudSktPlxyXG5cdFx0XHRcdHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzXHJcblx0XHRcdFx0IyDlpoLmnpzmma7pgJrnlKjmiLfmnInmnYPpmZDvvIzliJnnm7TmjqXov5Tlm550cnVlXHJcblx0XHRcdFx0aWYgcHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xXHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRcdCMg5ZCm5YiZ5Y+W5b2T5YmN55So5oi355qE5p2D6ZmQ6ZuG5LiObWVudeiPnOWNleimgeaxgueahOadg+mZkOmbhuWvueavlO+8jOWmguaenOS6pOmbhuWkp+S6jjHkuKrliJnov5Tlm550cnVlXHJcblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoXHJcblx0XHRcdHJlc3VsdCA9IG1lbnVzXHJcblx0XHRcclxuXHRcdHJldHVybiBfLnNvcnRCeShyZXN1bHQsXCJzb3J0XCIpXHJcblxyXG5cdGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpLT5cclxuXHJcblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXHJcblx0XHRcdHJldHVybiBudWxsXHJcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxyXG5cdFx0XHRyZXR1cm4gXy5maW5kIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XHJcblx0XHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWR9KVxyXG5cclxuXHRmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcyktPlxyXG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcclxuXHRcdFx0cmV0dXJuIF8uZmlsdGVyIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XHJcblx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXHJcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogcGVybWlzc2lvbl9zZXRfaWRzfX0pLmZldGNoKClcclxuXHJcblx0dW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IChwb3MsIG9iamVjdCwgcHNldHMpLT5cclxuXHRcdCMg5oqKZGLlj4p5bWzkuK3nmoRwZXJtaXNzaW9uX29iamVjdHPlkIjlubbvvIzkvJjlhYjlj5ZkYuS4reeahFxyXG5cdFx0cmVzdWx0ID0gW11cclxuXHRcdF8uZWFjaCBvYmplY3QucGVybWlzc2lvbl9zZXQsIChvcHMsIG9wc19rZXkpLT5cclxuXHRcdFx0IyDmiop5bWzkuK3pmaTkuobnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4ZcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCLlpJbnmoTlhbbku5blr7nosaHmnYPpmZDlhYjlrZjlhaVyZXN1bHRcclxuXHRcdFx0IyBpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiLCBcIndvcmtmbG93X2FkbWluXCIsIFwib3JnYW5pemF0aW9uX2FkbWluXCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXHJcblx0XHRcdGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXHJcblx0XHRcdFx0Y3VycmVudFBzZXQgPSBwc2V0cy5maW5kIChwc2V0KS0+IHJldHVybiBwc2V0Lm5hbWUgPT0gb3BzX2tleVxyXG5cdFx0XHRcdGlmIGN1cnJlbnRQc2V0XHJcblx0XHRcdFx0XHR0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9XHJcblx0XHRcdFx0XHR0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkXHJcblx0XHRcdFx0XHR0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lXHJcblx0XHRcdFx0XHRyZXN1bHQucHVzaCB0ZW1wT3BzXHJcblx0XHRpZiByZXN1bHQubGVuZ3RoXHJcblx0XHRcdHBvcy5mb3JFYWNoIChwbyktPlxyXG5cdFx0XHRcdHJlcGVhdEluZGV4ID0gMFxyXG5cdFx0XHRcdHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoKGl0ZW0sIGluZGV4KS0+IHJlcGVhdEluZGV4ID0gaW5kZXg7cmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT0gcG8ucGVybWlzc2lvbl9zZXRfaWQpXHJcblx0XHRcdFx0IyDlpoLmnpx5bWzkuK3lt7Lnu4/lrZjlnKhwb++8jOWImeabv+aNouS4uuaVsOaNruW6k+S4reeahHBv77yM5Y+N5LmL5YiZ5oqK5pWw5o2u5bqT5Lit55qEcG/nm7TmjqXntK/liqDov5vljrtcclxuXHRcdFx0XHRpZiByZXBlYXRQb1xyXG5cdFx0XHRcdFx0cmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggcG9cclxuXHRcdFx0cmV0dXJuIHJlc3VsdFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gcG9zXHJcblxyXG5cdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSktPlxyXG5cdFx0cGVybWlzc2lvbnMgPSB7fVxyXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpXHJcblxyXG5cdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09IFwidXNlcnNcIlxyXG5cdFx0XHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxyXG5cdFx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xyXG5cdFx0XHRyZXR1cm4gcGVybWlzc2lvbnNcclxuXHRcdHBzZXRzQWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIG9yIHRoaXMucHNldHNBZG1pbiB0aGVuIHRoaXMucHNldHNBZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSBvciB0aGlzLnBzZXRzVXNlciB0aGVuIHRoaXMucHNldHNVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c01lbWJlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIG9yIHRoaXMucHNldHNNZW1iZXIgdGhlbiB0aGlzLnBzZXRzTWVtYmVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHRcdHBzZXRzR3Vlc3QgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIG9yIHRoaXMucHNldHNHdWVzdCB0aGVuIHRoaXMucHNldHNHdWVzdCBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjF9fSlcclxuXHJcblx0XHRwc2V0c1N1cHBsaWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSBvciB0aGlzLnBzZXRzU3VwcGxpZXIgdGhlbiB0aGlzLnBzZXRzU3VwcGxpZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0c0N1c3RvbWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSBvciB0aGlzLnBzZXRzQ3VzdG9tZXIgdGhlbiB0aGlzLnBzZXRzQ3VzdG9tZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXHJcblx0XHRwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50O1xyXG5cdFx0aWYgIXBzZXRzXHJcblx0XHRcdHNwYWNlVXNlciA9IG51bGw7XHJcblx0XHRcdGlmIHVzZXJJZFxyXG5cdFx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxyXG5cdFx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcclxuXHRcdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblxyXG5cdFx0cHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zXHJcblx0XHRwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zXHJcblx0XHRwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3Bvc1xyXG5cdFx0cHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zXHJcblxyXG5cdFx0cHNldHNTdXBwbGllcl9wb3MgPSB0aGlzLnBzZXRzU3VwcGxpZXJfcG9zXHJcblx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3NcclxuXHJcblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zXHJcblxyXG5cdFx0b3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fVxyXG5cdFx0b3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge31cclxuXHRcdG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fVxyXG5cdFx0b3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxyXG5cclxuXHRcdG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge31cclxuXHRcdG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge31cclxuXHJcblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X2xpc3R2aWV3cycpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNoYXJlZDogdHJ1ZX0sIHtmaWVsZHM6e19pZDoxfX0pLmZldGNoKClcclxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gXy5wbHVjayhzaGFyZWRMaXN0Vmlld3MsXCJfaWRcIilcclxuXHRcdCMgaWYgc2hhcmVkTGlzdFZpZXdzLmxlbmd0aFxyXG5cdFx0IyBcdHVubGVzcyBvcHNldEFkbWluLmxpc3Rfdmlld3NcclxuXHRcdCMgXHRcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IFtdXHJcblx0XHQjIFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldEFkbWluLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xyXG5cdFx0IyBcdHVubGVzcyBvcHNldFVzZXIubGlzdF92aWV3c1xyXG5cdFx0IyBcdFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBbXVxyXG5cdFx0IyBcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldFVzZXIubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXHJcblx0XHQjIOaVsOaNruW6k+S4reWmguaenOmFjee9ruS6hum7mOiupOeahGFkbWluL3VzZXLmnYPpmZDpm4borr7nva7vvIzlupTor6Xopobnm5bku6PnoIHkuK1hZG1pbi91c2Vy55qE5p2D6ZmQ6ZuG6K6+572uXHJcblx0XHRpZiBwc2V0c0FkbWluXHJcblx0XHRcdHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKVxyXG5cdFx0XHRpZiBwb3NBZG1pblxyXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NBZG1pbi5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dEZWxldGUgPSBwb3NBZG1pbi5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dFZGl0ID0gcG9zQWRtaW4uYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd1JlYWQgPSBwb3NBZG1pbi5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldEFkbWluLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NBZG1pbi5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc0FkbWluLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NBZG1pbi52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRBZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQWRtaW4uZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5yZWFkYWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NBZG1pbi51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NBZG1pbi51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxyXG5cdFx0aWYgcHNldHNVc2VyXHJcblx0XHRcdHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKVxyXG5cdFx0XHRpZiBwb3NVc2VyXHJcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93Q3JlYXRlID0gcG9zVXNlci5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd0RlbGV0ZSA9IHBvc1VzZXIuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dFZGl0ID0gcG9zVXNlci5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dSZWFkID0gcG9zVXNlci5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldFVzZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0VXNlci52aWV3QWxsUmVjb3JkcyA9IHBvc1VzZXIudmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldFVzZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldFVzZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1VzZXIuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0VXNlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldFVzZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NVc2VyLnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRVc2VyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zVXNlci51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0XHRcdG9wc2V0VXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1VzZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcclxuXHRcdGlmIHBzZXRzTWVtYmVyXHJcblx0XHRcdHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKVxyXG5cdFx0XHRpZiBwb3NNZW1iZXJcclxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd0NyZWF0ZSA9IHBvc01lbWJlci5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93RGVsZXRlID0gcG9zTWVtYmVyLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dFZGl0ID0gcG9zTWVtYmVyLmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmFsbG93UmVhZCA9IHBvc01lbWJlci5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldE1lbWJlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci52aWV3QWxsUmVjb3JkcyA9IHBvc01lbWJlci52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NNZW1iZXIuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldE1lbWJlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc01lbWJlci51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0XHRcdG9wc2V0TWVtYmVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zTWVtYmVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblx0XHRpZiBwc2V0c0d1ZXN0XHJcblx0XHRcdHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKVxyXG5cdFx0XHRpZiBwb3NHdWVzdFxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dDcmVhdGUgPSBwb3NHdWVzdC5hbGxvd0NyZWF0ZVxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dEZWxldGUgPSBwb3NHdWVzdC5hbGxvd0RlbGV0ZVxyXG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dFZGl0ID0gcG9zR3Vlc3QuYWxsb3dFZGl0XHJcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd1JlYWQgPSBwb3NHdWVzdC5hbGxvd1JlYWRcclxuXHRcdFx0XHRvcHNldEd1ZXN0Lm1vZGlmeUFsbFJlY29yZHMgPSBwb3NHdWVzdC5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC52aWV3QWxsUmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NHdWVzdC52aWV3Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldEd1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzXHJcblx0XHRcdFx0b3BzZXRHdWVzdC5kaXNhYmxlZF9hY3Rpb25zID0gcG9zR3Vlc3QuZGlzYWJsZWRfYWN0aW9uc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bnJlYWRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bmVkaXRhYmxlX2ZpZWxkc1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5yZWxhdGVkX29iamVjdHMgPSBwb3NHdWVzdC51bnJlbGF0ZWRfb2JqZWN0c1xyXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NHdWVzdC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxyXG5cdFx0aWYgcHNldHNTdXBwbGllclxyXG5cdFx0XHRwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XHJcblx0XHRcdGlmIHBvc1N1cHBsaWVyXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5hbGxvd0NyZWF0ZSA9IHBvc1N1cHBsaWVyLmFsbG93Q3JlYXRlXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5hbGxvd0RlbGV0ZSA9IHBvc1N1cHBsaWVyLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci5hbGxvd0VkaXQgPSBwb3NTdXBwbGllci5hbGxvd0VkaXRcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmFsbG93UmVhZCA9IHBvc1N1cHBsaWVyLmFsbG93UmVhZFxyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLm1vZGlmeUFsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnZpZXdBbGxSZWNvcmRzID0gcG9zU3VwcGxpZXIudmlld0FsbFJlY29yZHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zU3VwcGxpZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1N1cHBsaWVyLmRpc2FibGVkX2xpc3Rfdmlld3NcclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NTdXBwbGllci5kaXNhYmxlZF9hY3Rpb25zXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1N1cHBsaWVyLnVucmVhZGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1N1cHBsaWVyLnVuZWRpdGFibGVfZmllbGRzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc1N1cHBsaWVyLnVucmVsYXRlZF9vYmplY3RzXHJcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1N1cHBsaWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XHJcblx0XHRpZiBwc2V0c0N1c3RvbWVyXHJcblx0XHRcdHBvc0N1c3RvbWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1c3RvbWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQ3VzdG9tZXIuX2lkKTtcclxuXHRcdFx0aWYgcG9zQ3VzdG9tZXJcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmFsbG93Q3JlYXRlID0gcG9zQ3VzdG9tZXIuYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmFsbG93RGVsZXRlID0gcG9zQ3VzdG9tZXIuYWxsb3dEZWxldGVcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmFsbG93RWRpdCA9IHBvc0N1c3RvbWVyLmFsbG93RWRpdFxyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuYWxsb3dSZWFkID0gcG9zQ3VzdG9tZXIuYWxsb3dSZWFkXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zQ3VzdG9tZXIubW9kaWZ5QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudmlld0FsbFJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3QWxsUmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NDdXN0b21lci5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zQ3VzdG9tZXIudmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xyXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc0N1c3RvbWVyLmRpc2FibGVkX2FjdGlvbnNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zQ3VzdG9tZXIudW5yZWFkYWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQ3VzdG9tZXIudW5lZGl0YWJsZV9maWVsZHNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zQ3VzdG9tZXIudW5yZWxhdGVkX29iamVjdHNcclxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zQ3VzdG9tZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcclxuXHJcblx0XHRpZiAhdXNlcklkXHJcblx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBpc1NwYWNlQWRtaW5cclxuXHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2NvbW1vbidcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0c3BhY2VVc2VyID0gaWYgXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIG9yIHRoaXMuc3BhY2VVc2VyIHRoZW4gdGhpcy5zcGFjZVVzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcclxuXHRcdFx0XHRcdGlmIHNwYWNlVXNlclxyXG5cdFx0XHRcdFx0XHRwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGVcclxuXHRcdFx0XHRcdFx0aWYgcHJvZlxyXG5cdFx0XHRcdFx0XHRcdGlmIHByb2YgaXMgJ3VzZXInXHJcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnbWVtYmVyJ1xyXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldE1lbWJlclxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnZ3Vlc3QnXHJcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3RcclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ3N1cHBsaWVyJ1xyXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyXHJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdjdXN0b21lcidcclxuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lclxyXG5cdFx0XHRcdFx0XHRlbHNlICMg5rKh5pyJcHJvZmlsZeWImeiupOS4uuaYr3VzZXLmnYPpmZBcclxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3RcclxuXHRcdGlmIHBzZXRzLmxlbmd0aCA+IDBcclxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHMsIFwiX2lkXCJcclxuXHRcdFx0cG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcylcclxuXHRcdFx0cG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpXHJcblx0XHRcdF8uZWFjaCBwb3MsIChwbyktPlxyXG5cdFx0XHRcdGlmIHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQWRtaW4/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1VzZXI/Ll9pZCBvciBcclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c01lbWJlcj8uX2lkIG9yIFxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzR3Vlc3Q/Ll9pZCBvclxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzU3VwcGxpZXI/Ll9pZCBvclxyXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQ3VzdG9tZXI/Ll9pZFxyXG5cdFx0XHRcdFx0IyDpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ5YC85Y+q5a6e6KGM5LiK6Z2i55qE6buY6K6k5YC86KaG55uW77yM5LiN5YGa566X5rOV5Yik5patXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRpZiBfLmlzRW1wdHkocGVybWlzc2lvbnMpXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IHBvXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dSZWFkXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8uYWxsb3dDcmVhdGVcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLmFsbG93RWRpdFxyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLmFsbG93RGVsZXRlXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWVcclxuXHRcdFx0XHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZVxyXG5cdFx0XHRcdGlmIHBvLnZpZXdBbGxSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcclxuXHRcdFx0XHRpZiBwby5tb2RpZnlDb21wYW55UmVjb3Jkc1xyXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlXHJcblx0XHRcdFx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXHJcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlXHJcblxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpXHJcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKVxyXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpXHJcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cylcclxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHBvLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0KVxyXG5cdFx0XHJcblx0XHRpZiBvYmplY3QuaXNfdmlld1xyXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IGZhbHNlXHJcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2VcclxuXHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdXHJcblx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xyXG5cclxuXHRcdGlmIG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lclxyXG5cdFx0XHRwZXJtaXNzaW9ucy5vd25lciA9IG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lclxyXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXHJcblxyXG5cclxuXHQjIENyZWF0b3IuaW5pdFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lKSAtPlxyXG5cclxuXHRcdCMgIyDlupTor6XmiororqHnrpflh7rmnaXnmoRcclxuXHRcdCMgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV0uYWxsb3dcclxuXHRcdCMgXHRpbnNlcnQ6ICh1c2VySWQsIGRvYykgLT5cclxuXHRcdCMgXHRcdGlmICF1c2VySWRcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdCAgICBcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXHJcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcclxuXHRcdCMgXHR1cGRhdGU6ICh1c2VySWQsIGRvYykgLT5cclxuXHRcdCMgXHRcdGlmICF1c2VySWRcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcclxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0VkaXRcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0IyBcdHJlbW92ZTogKHVzZXJJZCwgZG9jKSAtPlxyXG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2VcclxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxyXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RGVsZXRlXHJcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcclxuXHJcblx0TWV0ZW9yLm1ldGhvZHNcclxuXHRcdCMgQ2FsY3VsYXRlIFBlcm1pc3Npb25zIG9uIFNlcnZlclxyXG5cdFx0XCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiAoc3BhY2VJZCktPlxyXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZClcclxuIiwidmFyIGNsb25lLCBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0LCBmaW5kX3Blcm1pc3Npb25fb2JqZWN0LCBpbnRlcnNlY3Rpb25QbHVzLCB1bmlvblBlcm1pc3Npb25PYmplY3RzLCB1bmlvblBsdXM7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIG9iajtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KCk7XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIGlzT3duZXIsIG9iamVjdF9maWVsZHNfa2V5cywgcGVybWlzc2lvbnMsIHJlY29yZF9jb21wYW55X2lkLCByZWNvcmRfY29tcGFueV9pZHMsIHJlY29yZF9pZCwgcmVmLCByZWYxLCBzZWxlY3QsIHVzZXJfY29tcGFueV9pZHM7XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICB9XG4gIGlmIChyZWNvcmQgJiYgb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKSkge1xuICAgICAgb2JqZWN0X25hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcbiAgICAgIHJlY29yZF9pZCA9IHJlY29yZC5wYXJlbnQuX2lkO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpO1xuICAgICAgcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG4gICAgfVxuICAgIG9iamVjdF9maWVsZHNfa2V5cyA9IF8ua2V5cygoKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDApIHx8IHt9KSB8fCBbXTtcbiAgICBzZWxlY3QgPSBfLmludGVyc2VjdGlvbihvYmplY3RfZmllbGRzX2tleXMsIFsnb3duZXInLCAnY29tcGFueV9pZCcsICdjb21wYW55X2lkcycsICdsb2NrZWQnXSkgfHwgW107XG4gICAgaWYgKHNlbGVjdC5sZW5ndGggPiAwKSB7XG4gICAgICByZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3Quam9pbignLCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVjb3JkID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpO1xuICBpZiAocmVjb3JkKSB7XG4gICAgaWYgKHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnMpIHtcbiAgICAgIHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zO1xuICAgIH1cbiAgICBpc093bmVyID0gcmVjb3JkLm93bmVyID09PSB1c2VySWQgfHwgKChyZWYxID0gcmVjb3JkLm93bmVyKSAhPSBudWxsID8gcmVmMS5faWQgOiB2b2lkIDApID09PSB1c2VySWQ7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKTtcbiAgICB9XG4gICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkIDogdm9pZCAwO1xuICAgIGlmIChyZWNvcmRfY29tcGFueV9pZCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSAmJiByZWNvcmRfY29tcGFueV9pZC5faWQpIHtcbiAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkO1xuICAgIH1cbiAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkcyA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZHNbMF0pKSB7XG4gICAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmRfY29tcGFueV9pZHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKTtcbiAgICBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyZWNvcmQubG9ja2VkICYmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHVzZXJfY29tcGFueV9pZHMgJiYgdXNlcl9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBlcm1pc3Npb25zO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihjdXJyZW50T2JqZWN0TmFtZSwgcmVsYXRlZExpc3RJdGVtLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlLCBtYXN0ZXJBbGxvdywgbWFzdGVyUmVjb3JkUGVybSwgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLCByZXN1bHQsIHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICBpZiAoIWN1cnJlbnRPYmplY3ROYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgY3VycmVudE9iamVjdE5hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXJlbGF0ZWRMaXN0SXRlbSkge1xuICAgICAgY29uc29sZS5lcnJvcihcInJlbGF0ZWRMaXN0SXRlbSBtdXN0IG5vdCBiZSBlbXB0eSBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9uc1wiKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgaWYgKCFjdXJyZW50UmVjb3JkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgY3VycmVudFJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKCk7XG4gICAgfVxuICAgIGlmICghdXNlcklkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRMaXN0SXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB8fCBmYWxzZTtcbiAgICBtYXN0ZXJBbGxvdyA9IGZhbHNlO1xuICAgIG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zKGN1cnJlbnRPYmplY3ROYW1lLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpO1xuICAgIGlmICh3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PT0gdHJ1ZSkge1xuICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZDtcbiAgICB9IGVsc2UgaWYgKHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09PSBmYWxzZSkge1xuICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdDtcbiAgICB9XG4gICAgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSk7XG4gICAgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpO1xuICAgIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xO1xuICAgIHJlc3VsdCA9IF8uY2xvbmUocmVsYXRlZE9iamVjdFBlcm1pc3Npb25zKTtcbiAgICByZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICByZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBfaSwgaXNTcGFjZUFkbWluLCBwZXJtaXNzaW9ucywgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnQsIHBzZXRzQ3VycmVudE5hbWVzLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHtcbiAgICAgIG9iamVjdHM6IHt9LFxuICAgICAgYXNzaWduZWRfYXBwczogW11cbiAgICB9O1xuXG4gICAgLypcbiAgICBcdFx05p2D6ZmQ6ZuG6K+05piOOlxuICAgIFx0XHTlhoXnva7mnYPpmZDpm4YtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXG4gICAgXHRcdOiHquWumuS5ieadg+mZkOmbhi3mlbDmja7lupPkuK3mlrDlu7rnmoTpmaTlhoXnva7mnYPpmZDpm4bku6XlpJbnmoTlhbbku5bmnYPpmZDpm4ZcbiAgICBcdFx054m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKfkuI3lj6/phY3nva7vvIktYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3RcbiAgICBcdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ6ZuGXG4gICAgICovXG4gICAgaXNTcGFjZUFkbWluID0gZmFsc2U7XG4gICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICBpZiAodXNlcklkKSB7XG4gICAgICBpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBwc2V0c0FkbWluX3BvcyA9IG51bGw7XG4gICAgcHNldHNVc2VyX3BvcyA9IG51bGw7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0d1ZXN0X3BvcyA9IG51bGw7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IG51bGw7XG4gICAgcHNldHNTdXBwbGllcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbDtcbiAgICBpZiAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1N1cHBsaWVyICE9IG51bGwgPyBwc2V0c1N1cHBsaWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNTdXBwbGllcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXJyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJfaWRcIik7XG4gICAgICBwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAgICRpbjogc2V0X2lkc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgcHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJuYW1lXCIpO1xuICAgIH1cbiAgICBwc2V0cyA9IHtcbiAgICAgIHBzZXRzQWRtaW46IHBzZXRzQWRtaW4sXG4gICAgICBwc2V0c1VzZXI6IHBzZXRzVXNlcixcbiAgICAgIHBzZXRzQ3VycmVudDogcHNldHNDdXJyZW50LFxuICAgICAgcHNldHNNZW1iZXI6IHBzZXRzTWVtYmVyLFxuICAgICAgcHNldHNHdWVzdDogcHNldHNHdWVzdCxcbiAgICAgIHBzZXRzU3VwcGxpZXI6IHBzZXRzU3VwcGxpZXIsXG4gICAgICBwc2V0c0N1c3RvbWVyOiBwc2V0c0N1c3RvbWVyLFxuICAgICAgaXNTcGFjZUFkbWluOiBpc1NwYWNlQWRtaW4sXG4gICAgICBzcGFjZVVzZXI6IHNwYWNlVXNlcixcbiAgICAgIHBzZXRzQWRtaW5fcG9zOiBwc2V0c0FkbWluX3BvcyxcbiAgICAgIHBzZXRzVXNlcl9wb3M6IHBzZXRzVXNlcl9wb3MsXG4gICAgICBwc2V0c01lbWJlcl9wb3M6IHBzZXRzTWVtYmVyX3BvcyxcbiAgICAgIHBzZXRzR3Vlc3RfcG9zOiBwc2V0c0d1ZXN0X3BvcyxcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zOiBwc2V0c1N1cHBsaWVyX3BvcyxcbiAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zOiBwc2V0c0N1c3RvbWVyX3BvcyxcbiAgICAgIHBzZXRzQ3VycmVudF9wb3M6IHBzZXRzQ3VycmVudF9wb3NcbiAgICB9O1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX2FwcHMgPSBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lcztcbiAgICBfaSA9IDA7XG4gICAgXy5lYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24ob2JqZWN0LCBvYmplY3RfbmFtZSkge1xuICAgICAgX2krKztcbiAgICAgIGlmICghXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PT0gc3BhY2VJZCkge1xuICAgICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09PSAnMCcgfHwgKG9iamVjdC5pbl9kZXZlbG9wbWVudCAhPT0gJzAnICYmIGlzU3BhY2VBZG1pbikpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZCk7XG4gICAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICB1bmlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgaW50ZXJzZWN0aW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYXBwcywgaXNTcGFjZUFkbWluLCBwc2V0QmFzZSwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQ3VzdG9tZXIsIHBzZXRzU3VwcGxpZXIsIHBzZXRzVXNlciwgcmVmLCByZWYxLCBzcGFjZVVzZXIsIHVzZXJQcm9maWxlO1xuICAgIHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1N1cHBsaWVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1c3RvbWVyID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFwcHMgPSBbXTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJQcm9maWxlID0gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYucHJvZmlsZSA6IHZvaWQgMDtcbiAgICAgIHBzZXRCYXNlID0gcHNldHNVc2VyO1xuICAgICAgaWYgKHVzZXJQcm9maWxlKSB7XG4gICAgICAgIGlmICh1c2VyUHJvZmlsZSA9PT0gJ3N1cHBsaWVyJykge1xuICAgICAgICAgIHBzZXRCYXNlID0gcHNldHNTdXBwbGllcjtcbiAgICAgICAgfSBlbHNlIGlmICh1c2VyUHJvZmlsZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHBzZXRCYXNlID0gcHNldHNDdXN0b21lcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBzZXRCYXNlICE9IG51bGwgPyAocmVmMSA9IHBzZXRCYXNlLmFzc2lnbmVkX2FwcHMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIF8uZWFjaChwc2V0cywgZnVuY3Rpb24ocHNldCkge1xuICAgICAgICBpZiAoIXBzZXQuYXNzaWduZWRfYXBwcykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHNldC5uYW1lID09PSBcImFkbWluXCIgfHwgcHNldC5uYW1lID09PSBcInVzZXJcIiB8fCBwc2V0Lm5hbWUgPT09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy53aXRob3V0KF8udW5pcShhcHBzKSwgdm9pZCAwLCBudWxsKTtcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhYm91dE1lbnUsIGFkbWluTWVudXMsIGFsbE1lbnVzLCBjdXJyZW50UHNldE5hbWVzLCBpc1NwYWNlQWRtaW4sIG1lbnVzLCBvdGhlck1lbnVBcHBzLCBvdGhlck1lbnVzLCBwc2V0cywgcmVmLCByZWYxLCByZXN1bHQsIHVzZXJQcm9maWxlO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICB1c2VyczogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICBuYW1lOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYWRtaW5NZW51cyA9IChyZWYgPSBDcmVhdG9yLkFwcHMuYWRtaW4pICE9IG51bGwgPyByZWYuYWRtaW5fbWVudXMgOiB2b2lkIDA7XG4gICAgaWYgKCFhZG1pbk1lbnVzKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgPT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgYWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCAhPT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkoXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uYWRtaW5fbWVudXMgJiYgbi5faWQgIT09ICdhZG1pbic7XG4gICAgfSksICdzb3J0Jyk7XG4gICAgb3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpO1xuICAgIGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSk7XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmVzdWx0ID0gYWxsTWVudXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJQcm9maWxlID0gKChyZWYxID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjEucHJvZmlsZSA6IHZvaWQgMCkgfHwgJ3VzZXInO1xuICAgICAgY3VycmVudFBzZXROYW1lcyA9IHBzZXRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLm5hbWU7XG4gICAgICB9KTtcbiAgICAgIG1lbnVzID0gYWxsTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICAgICAgdmFyIHBzZXRzTWVudTtcbiAgICAgICAgcHNldHNNZW51ID0gbWVudS5wZXJtaXNzaW9uX3NldHM7XG4gICAgICAgIGlmIChwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YodXNlclByb2ZpbGUpID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGg7XG4gICAgICB9KTtcbiAgICAgIHJlc3VsdCA9IG1lbnVzO1xuICAgIH1cbiAgICByZXR1cm4gXy5zb3J0QnkocmVzdWx0LCBcInNvcnRcIik7XG4gIH07XG4gIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCkge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maW5kKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkXG4gICAgfSk7XG4gIH07XG4gIGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmlsdGVyKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgJGluOiBwZXJtaXNzaW9uX3NldF9pZHNcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICB9O1xuICB1bmlvblBlcm1pc3Npb25PYmplY3RzID0gZnVuY3Rpb24ocG9zLCBvYmplY3QsIHBzZXRzKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICByZXN1bHQgPSBbXTtcbiAgICBfLmVhY2gob2JqZWN0LnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihvcHMsIG9wc19rZXkpIHtcbiAgICAgIHZhciBjdXJyZW50UHNldCwgdGVtcE9wcztcbiAgICAgIGlmIChbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiXS5pbmRleE9mKG9wc19rZXkpIDwgMCkge1xuICAgICAgICBjdXJyZW50UHNldCA9IHBzZXRzLmZpbmQoZnVuY3Rpb24ocHNldCkge1xuICAgICAgICAgIHJldHVybiBwc2V0Lm5hbWUgPT09IG9wc19rZXk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY3VycmVudFBzZXQpIHtcbiAgICAgICAgICB0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9O1xuICAgICAgICAgIHRlbXBPcHMucGVybWlzc2lvbl9zZXRfaWQgPSBjdXJyZW50UHNldC5faWQ7XG4gICAgICAgICAgdGVtcE9wcy5vYmplY3RfbmFtZSA9IG9iamVjdC5vYmplY3RfbmFtZTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2godGVtcE9wcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCkge1xuICAgICAgcG9zLmZvckVhY2goZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgdmFyIHJlcGVhdEluZGV4LCByZXBlYXRQbztcbiAgICAgICAgcmVwZWF0SW5kZXggPSAwO1xuICAgICAgICByZXBlYXRQbyA9IHJlc3VsdC5maW5kKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgcmVwZWF0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICByZXR1cm4gaXRlbS5wZXJtaXNzaW9uX3NldF9pZCA9PT0gcG8ucGVybWlzc2lvbl9zZXRfaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVwZWF0UG8pIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZXN1bHQucHVzaChwbyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBvcztcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIGlzU3BhY2VBZG1pbiwgb2JqZWN0LCBvcHNldEFkbWluLCBvcHNldEN1c3RvbWVyLCBvcHNldEd1ZXN0LCBvcHNldE1lbWJlciwgb3BzZXRTdXBwbGllciwgb3BzZXRVc2VyLCBwZXJtaXNzaW9ucywgcG9zLCBwb3NBZG1pbiwgcG9zQ3VzdG9tZXIsIHBvc0d1ZXN0LCBwb3NNZW1iZXIsIHBvc1N1cHBsaWVyLCBwb3NVc2VyLCBwcm9mLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzQ3VzdG9tZXIsIHBzZXRzQ3VzdG9tZXJfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNTdXBwbGllciwgcHNldHNTdXBwbGllcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3Bvcywgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge307XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuICAgIGlmIChzcGFjZUlkID09PSAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSB8fCB0aGlzLnBzZXRzQWRtaW4gPyB0aGlzLnBzZXRzQWRtaW4gOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgfHwgdGhpcy5wc2V0c1VzZXIgPyB0aGlzLnBzZXRzVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNNZW1iZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSB8fCB0aGlzLnBzZXRzTWVtYmVyID8gdGhpcy5wc2V0c01lbWJlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0d1ZXN0ID0gXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSB8fCB0aGlzLnBzZXRzR3Vlc3QgPyB0aGlzLnBzZXRzR3Vlc3QgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1N1cHBsaWVyID0gXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSB8fCB0aGlzLnBzZXRzU3VwcGxpZXIgPyB0aGlzLnBzZXRzU3VwcGxpZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1c3RvbWVyID0gXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSB8fCB0aGlzLnBzZXRzQ3VzdG9tZXIgPyB0aGlzLnBzZXRzQ3VzdG9tZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50O1xuICAgIGlmICghcHNldHMpIHtcbiAgICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3M7XG4gICAgcHNldHNVc2VyX3BvcyA9IHRoaXMucHNldHNVc2VyX3BvcztcbiAgICBwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3BvcztcbiAgICBwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3M7XG4gICAgcHNldHNTdXBwbGllcl9wb3MgPSB0aGlzLnBzZXRzU3VwcGxpZXJfcG9zO1xuICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gdGhpcy5wc2V0c0N1c3RvbWVyX3BvcztcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zO1xuICAgIG9wc2V0QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5hZG1pbikgfHwge307XG4gICAgb3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge307XG4gICAgb3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9O1xuICAgIG9wc2V0R3Vlc3QgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge307XG4gICAgb3BzZXRTdXBwbGllciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnN1cHBsaWVyKSB8fCB7fTtcbiAgICBvcHNldEN1c3RvbWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuY3VzdG9tZXIpIHx8IHt9O1xuICAgIGlmIChwc2V0c0FkbWluKSB7XG4gICAgICBwb3NBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0FkbWluLl9pZCk7XG4gICAgICBpZiAocG9zQWRtaW4pIHtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd0NyZWF0ZSA9IHBvc0FkbWluLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldEFkbWluLmFsbG93RGVsZXRlID0gcG9zQWRtaW4uYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dFZGl0ID0gcG9zQWRtaW4uYWxsb3dFZGl0O1xuICAgICAgICBvcHNldEFkbWluLmFsbG93UmVhZCA9IHBvc0FkbWluLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRBZG1pbi5tb2RpZnlBbGxSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi52aWV3QWxsUmVjb3JkcyA9IHBvc0FkbWluLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldEFkbWluLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NBZG1pbi5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldEFkbWluLnVucmVhZGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5lZGl0YWJsZV9maWVsZHMgPSBwb3NBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0FkbWluLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldEFkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zQWRtaW4udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIpIHtcbiAgICAgIHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKTtcbiAgICAgIGlmIChwb3NVc2VyKSB7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0NyZWF0ZSA9IHBvc1VzZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0RlbGV0ZSA9IHBvc1VzZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd0VkaXQgPSBwb3NVc2VyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRVc2VyLmFsbG93UmVhZCA9IHBvc1VzZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldFVzZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLnZpZXdBbGxSZWNvcmRzID0gcG9zVXNlci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zVXNlci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFVzZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc1VzZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRVc2VyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NVc2VyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0VXNlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0VXNlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0VXNlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc1VzZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0VXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1VzZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlcikge1xuICAgICAgcG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpO1xuICAgICAgaWYgKHBvc01lbWJlcikge1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd0NyZWF0ZSA9IHBvc01lbWJlci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dEZWxldGUgPSBwb3NNZW1iZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93RWRpdCA9IHBvc01lbWJlci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93UmVhZCA9IHBvc01lbWJlci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0TWVtYmVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudmlld0FsbFJlY29yZHMgPSBwb3NNZW1iZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zTWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0TWVtYmVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NNZW1iZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldE1lbWJlci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc01lbWJlci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c0d1ZXN0KSB7XG4gICAgICBwb3NHdWVzdCA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNHdWVzdF9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0d1ZXN0Ll9pZCk7XG4gICAgICBpZiAocG9zR3Vlc3QpIHtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd0NyZWF0ZSA9IHBvc0d1ZXN0LmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93RGVsZXRlID0gcG9zR3Vlc3QuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dFZGl0ID0gcG9zR3Vlc3QuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93UmVhZCA9IHBvc0d1ZXN0LmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRHdWVzdC5tb2RpZnlBbGxSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC52aWV3QWxsUmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldEd1ZXN0LmRpc2FibGVkX2FjdGlvbnMgPSBwb3NHdWVzdC5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldEd1ZXN0LnVucmVhZGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0d1ZXN0LnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldEd1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c1N1cHBsaWVyKSB7XG4gICAgICBwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG4gICAgICBpZiAocG9zU3VwcGxpZXIpIHtcbiAgICAgICAgb3BzZXRTdXBwbGllci5hbGxvd0NyZWF0ZSA9IHBvc1N1cHBsaWVyLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldFN1cHBsaWVyLmFsbG93RGVsZXRlID0gcG9zU3VwcGxpZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuYWxsb3dFZGl0ID0gcG9zU3VwcGxpZXIuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldFN1cHBsaWVyLmFsbG93UmVhZCA9IHBvc1N1cHBsaWVyLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRTdXBwbGllci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zU3VwcGxpZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci52aWV3QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zU3VwcGxpZXIubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zU3VwcGxpZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NTdXBwbGllci5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NTdXBwbGllci5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zU3VwcGxpZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NTdXBwbGllci51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc1N1cHBsaWVyLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zU3VwcGxpZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyKSB7XG4gICAgICBwb3NDdXN0b21lciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXN0b21lcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0N1c3RvbWVyLl9pZCk7XG4gICAgICBpZiAocG9zQ3VzdG9tZXIpIHtcbiAgICAgICAgb3BzZXRDdXN0b21lci5hbGxvd0NyZWF0ZSA9IHBvc0N1c3RvbWVyLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldEN1c3RvbWVyLmFsbG93RGVsZXRlID0gcG9zQ3VzdG9tZXIuYWxsb3dEZWxldGU7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuYWxsb3dFZGl0ID0gcG9zQ3VzdG9tZXIuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldEN1c3RvbWVyLmFsbG93UmVhZCA9IHBvc0N1c3RvbWVyLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRDdXN0b21lci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zQ3VzdG9tZXIubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci52aWV3QWxsUmVjb3JkcyA9IHBvc0N1c3RvbWVyLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQ3VzdG9tZXIubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zQ3VzdG9tZXIudmlld0NvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NDdXN0b21lci5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NDdXN0b21lci5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zQ3VzdG9tZXIudW5yZWFkYWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NDdXN0b21lci51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0N1c3RvbWVyLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zQ3VzdG9tZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Q7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNwYWNlSWQgPT09ICdjb21tb24nKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhY2VVc2VyID0gXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIHx8IHRoaXMuc3BhY2VVc2VyID8gdGhpcy5zcGFjZVVzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoc3BhY2VVc2VyKSB7XG4gICAgICAgICAgICBwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGU7XG4gICAgICAgICAgICBpZiAocHJvZikge1xuICAgICAgICAgICAgICBpZiAocHJvZiA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ21lbWJlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdndWVzdCcpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ3N1cHBsaWVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRTdXBwbGllcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEN1c3RvbWVyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHMubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHMsIFwiX2lkXCIpO1xuICAgICAgcG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcyk7XG4gICAgICBwb3MgPSB1bmlvblBlcm1pc3Npb25PYmplY3RzKHBvcywgb2JqZWN0LCBwc2V0cyk7XG4gICAgICBfLmVhY2gocG9zLCBmdW5jdGlvbihwbykge1xuICAgICAgICBpZiAocG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0FkbWluICE9IG51bGwgPyBwc2V0c0FkbWluLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0d1ZXN0ICE9IG51bGwgPyBwc2V0c0d1ZXN0Ll9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c1N1cHBsaWVyICE9IG51bGwgPyBwc2V0c1N1cHBsaWVyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8uaXNFbXB0eShwZXJtaXNzaW9ucykpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IHBvO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5hbGxvd1JlYWQpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5hbGxvd0NyZWF0ZSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dEZWxldGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8udmlld0FsbFJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpO1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKTtcbiAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChvYmplY3QuaXNfdmlldykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW107XG4gICAgfVxuICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICBpZiAob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyKSB7XG4gICAgICBwZXJtaXNzaW9ucy5vd25lciA9IG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcjtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgXCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZCk7XG4gICAgfVxuICB9KTtcbn1cbiIsIlxyXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG5cdGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1JcclxuXHRvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUlxyXG5cdGlmIGNyZWF0b3JfZGJfdXJsXHJcblx0XHRpZiAhb3Bsb2dfdXJsXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKVxyXG5cdFx0Q3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge19kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7b3Bsb2dVcmw6IG9wbG9nX3VybH0pfVxyXG5cclxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IChvYmplY3QpLT5cclxuI1x0aWYgb2JqZWN0LnRhYmxlX25hbWUgJiYgb2JqZWN0LnRhYmxlX25hbWUuZW5kc1dpdGgoXCJfX2NcIilcclxuI1x0XHRyZXR1cm4gb2JqZWN0LnRhYmxlX25hbWVcclxuI1x0ZWxzZVxyXG4jXHRcdHJldHVybiBvYmplY3QubmFtZVxyXG5cdHJldHVybiBvYmplY3QubmFtZVxyXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSAob2JqZWN0KS0+XHJcblx0Y29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdClcclxuXHRpZiBkYltjb2xsZWN0aW9uX2tleV1cclxuXHRcdHJldHVybiBkYltjb2xsZWN0aW9uX2tleV1cclxuXHRlbHNlIGlmIG9iamVjdC5kYlxyXG5cdFx0cmV0dXJuIG9iamVjdC5kYlxyXG5cclxuXHRpZiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXHJcblx0ZWxzZVxyXG5cdFx0aWYgb2JqZWN0LmN1c3RvbVxyXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBjb2xsZWN0aW9uX2tleSA9PSAnX3Ntc19xdWV1ZScgJiYgU01TUXVldWU/LmNvbGxlY3Rpb25cclxuXHRcdFx0XHRyZXR1cm4gU01TUXVldWUuY29sbGVjdGlvblxyXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSlcclxuXHJcblxyXG4iLCJ2YXIgc3RlZWRvc0NvcmU7XG5cbnN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0b3JfZGJfdXJsLCBvcGxvZ191cmw7XG4gIGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1I7XG4gIG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SO1xuICBpZiAoY3JlYXRvcl9kYl91cmwpIHtcbiAgICBpZiAoIW9wbG9nX3VybCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge1xuICAgICAgX2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtcbiAgICAgICAgb3Bsb2dVcmw6IG9wbG9nX3VybFxuICAgICAgfSlcbiAgICB9O1xuICB9XG59KTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGNvbGxlY3Rpb25fa2V5O1xuICBjb2xsZWN0aW9uX2tleSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqZWN0KTtcbiAgaWYgKGRiW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBkYltjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSBpZiAob2JqZWN0LmRiKSB7XG4gICAgcmV0dXJuIG9iamVjdC5kYjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdC5jdXN0b20pIHtcbiAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY29sbGVjdGlvbl9rZXkgPT09ICdfc21zX3F1ZXVlJyAmJiAodHlwZW9mIFNNU1F1ZXVlICE9PSBcInVuZGVmaW5lZFwiICYmIFNNU1F1ZXVlICE9PSBudWxsID8gU01TUXVldWUuY29sbGVjdGlvbiA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSk7XG4gICAgfVxuICB9XG59O1xuIiwiQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge31cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdHN0ZWVkb3NGaWx0ZXJzID0gcmVxdWlyZShcIkBzdGVlZG9zL2ZpbHRlcnNcIik7XHJcblx0IyDlrprkuYnlhajlsYAgYWN0aW9ucyDlh73mlbBcdFxyXG5cdENyZWF0b3IuYWN0aW9ucyA9IChhY3Rpb25zKS0+XHJcblx0XHRfLmVhY2ggYWN0aW9ucywgKHRvZG8sIGFjdGlvbl9uYW1lKS0+XHJcblx0XHRcdENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvIFxyXG5cclxuXHRDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSAob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKS0+XHJcblx0XHRpZiBhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT0gJ3dvcmQtcHJpbnQnXHJcblx0XHRcdGlmIHJlY29yZF9pZFxyXG5cdFx0XHRcdGZpbHRlcnMgPSBbJ19pZCcsICc9JywgcmVjb3JkX2lkXVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0ZmlsdGVycyA9IE9iamVjdEdyaWQuZ2V0RmlsdGVycyhvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBmYWxzZSwgbnVsbCwgbnVsbClcclxuXHRcdFx0dXJsID0gXCIvYXBpL3Y0L3dvcmRfdGVtcGxhdGVzL1wiICsgYWN0aW9uLndvcmRfdGVtcGxhdGUgKyBcIi9wcmludFwiICsgXCI/ZmlsdGVycz1cIiArIHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkoZmlsdGVycyk7XHJcblx0XHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcclxuXHRcdFx0cmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XHJcblxyXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXHJcblx0XHRpZiBhY3Rpb24/LnRvZG9cclxuXHRcdFx0aWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwic3RyaW5nXCJcclxuXHRcdFx0XHR0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXVxyXG5cdFx0XHRlbHNlIGlmIHR5cGVvZiBhY3Rpb24udG9kbyA9PSBcImZ1bmN0aW9uXCJcclxuXHRcdFx0XHR0b2RvID0gYWN0aW9uLnRvZG9cdFxyXG5cdFx0XHRpZiAhcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxyXG5cdFx0XHRcdHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXHJcblx0XHRcdGlmIHRvZG9cclxuXHRcdFx0XHQjIGl0ZW1fZWxlbWVudOS4uuepuuaXtuW6lOivpeiuvue9rum7mOiupOWAvO+8iOWvueixoeeahG5hbWXlrZfmrrXvvInvvIzlkKbliJltb3JlQXJnc+aLv+WIsOeahOWQjue7reWPguaVsOS9jee9ruWwseS4jeWvuVxyXG5cdFx0XHRcdGl0ZW1fZWxlbWVudCA9IGlmIGl0ZW1fZWxlbWVudCB0aGVuIGl0ZW1fZWxlbWVudCBlbHNlIFwiXCJcclxuXHRcdFx0XHRtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMylcclxuXHRcdFx0XHR0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpXHJcblx0XHRcdFx0dG9kby5hcHBseSB7XHJcblx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdHJlY29yZF9pZDogcmVjb3JkX2lkXHJcblx0XHRcdFx0XHRvYmplY3Q6IG9ialxyXG5cdFx0XHRcdFx0YWN0aW9uOiBhY3Rpb25cclxuXHRcdFx0XHRcdGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50XHJcblx0XHRcdFx0XHRyZWNvcmQ6IHJlY29yZFxyXG5cdFx0XHRcdH0sIHRvZG9BcmdzXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSlcclxuXHRcdGVsc2VcclxuXHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXHJcblxyXG5cdFx0XHRcdFxyXG5cclxuXHRDcmVhdG9yLmFjdGlvbnMgXHJcblx0XHQjIOWcqOatpOWumuS5ieWFqOWxgCBhY3Rpb25zXHJcblx0XHRcInN0YW5kYXJkX3F1ZXJ5XCI6ICgpLT5cclxuXHRcdFx0TW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpXHJcblxyXG5cdFx0XCJzdGFuZGFyZF9uZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxyXG5cdFx0XHQjVE9ETyDkvb/nlKjlr7nosaHniYjmnKzliKTmlq1cclxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xyXG5cdFx0XHRpbml0aWFsVmFsdWVzPXt9XHJcblx0XHRcdHNlbGVjdGVkUm93cyA9IHdpbmRvdy5ncmlkUmVmLmN1cnJlbnQuYXBpLmdldFNlbGVjdGVkUm93cygpXHJcblx0XHRcdGlmIHNlbGVjdGVkUm93cz8ubGVuZ3RoXHJcblx0XHRcdFx0cmVjb3JkX2lkID0gc2VsZWN0ZWRSb3dzWzBdLl9pZDtcclxuXHRcdFx0XHRpZiByZWNvcmRfaWRcclxuXHRcdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxyXG5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKVxyXG5cclxuXHRcdFx0aWYgb2JqZWN0Py52ZXJzaW9uID49IDJcclxuXHRcdFx0XHRyZXR1cm4gU3RlZWRvc1VJLnNob3dNb2RhbChzdG9yZXMuQ29tcG9uZW50UmVnaXN0cnkuY29tcG9uZW50cy5PYmplY3RGb3JtLCB7XHJcblx0XHRcdFx0XHRuYW1lOiBcIiN7b2JqZWN0X25hbWV9X3N0YW5kYXJkX25ld19mb3JtXCIsXHJcblx0XHRcdFx0XHRvYmplY3RBcGlOYW1lOiBvYmplY3RfbmFtZSxcclxuXHRcdFx0XHRcdHRpdGxlOiAn5paw5bu6JyxcclxuXHRcdFx0XHRcdGluaXRpYWxWYWx1ZXM6IGluaXRpYWxWYWx1ZXMsXHJcblx0XHRcdFx0XHRhZnRlckluc2VydDogKHJlc3VsdCktPlxyXG5cdFx0XHRcdFx0XHRpZihyZXN1bHQubGVuZ3RoID4gMClcclxuXHRcdFx0XHRcdFx0XHRyZWNvcmQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0dXJsID0gXCIvYXBwLyN7YXBwX2lkfS8je29iamVjdF9uYW1lfS92aWV3LyN7cmVjb3JkLl9pZH1cIlxyXG5cdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5nbyB1cmxcclxuXHRcdFx0XHRcdFx0XHQsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cclxuXHRcdFx0XHR9LCBudWxsLCB7aWNvblBhdGg6ICcvYXNzZXRzL2ljb25zJ30pXHJcblx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxyXG5cdFx0XHRpZiBzZWxlY3RlZFJvd3M/Lmxlbmd0aFxyXG5cdFx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXHJcblx0XHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcclxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXHJcblx0XHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cclxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xyXG5cdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxyXG5cdFx0XHRcdCQoXCIuY3JlYXRvci1hZGRcIikuY2xpY2soKVxyXG5cdFx0XHRyZXR1cm4gXHJcblxyXG5cdFx0XCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxyXG5cdFx0XHRocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuXHRcdFx0Rmxvd1JvdXRlci5yZWRpcmVjdChocmVmKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRcInN0YW5kYXJkX2VkaXRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxyXG5cdFx0XHRpZiByZWNvcmRfaWRcclxuXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XHJcblx0XHRcdFx0aWYgb2JqZWN0Py52ZXJzaW9uID49IDJcclxuXHRcdFx0XHRcdHJldHVybiBTdGVlZG9zVUkuc2hvd01vZGFsKHN0b3Jlcy5Db21wb25lbnRSZWdpc3RyeS5jb21wb25lbnRzLk9iamVjdEZvcm0sIHtcclxuXHRcdFx0XHRcdFx0bmFtZTogXCIje29iamVjdF9uYW1lfV9zdGFuZGFyZF9lZGl0X2Zvcm1cIixcclxuXHRcdFx0XHRcdFx0b2JqZWN0QXBpTmFtZTogb2JqZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdHJlY29yZElkOiByZWNvcmRfaWQsXHJcblx0XHRcdFx0XHRcdHRpdGxlOiAn57yW6L6RJyxcclxuXHRcdFx0XHRcdFx0YWZ0ZXJVcGRhdGU6ICgpLT5cclxuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpLT5cclxuXHRcdFx0XHRcdFx0XHRcdGlmIEZsb3dSb3V0ZXIuY3VycmVudCgpLnJvdXRlLnBhdGguZW5kc1dpdGgoXCIvOnJlY29yZF9pZFwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5ncmlkUmVmLmN1cnJlbnQuYXBpLnJlZnJlc2hTZXJ2ZXJTaWRlU3RvcmUoKVxyXG5cdFx0XHRcdFx0XHRcdCwgMSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHR9LCBudWxsLCB7aWNvblBhdGg6ICcvYXNzZXRzL2ljb25zJ30pXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlXHJcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCByZWNvcmRcclxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAncmVsb2FkX2R4bGlzdCcsIGZhbHNlXHJcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkXHJcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxyXG5cdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cclxuXHRcdFx0XHRcdFx0JChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcclxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHRoaXMucmVjb3JkXHJcblx0XHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XHJcblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcclxuXHJcblx0XHRcInN0YW5kYXJkX2RlbGV0ZVwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKS0+XHJcblx0XHRcdGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtfaWQ6IHJlY29yZF9pZH0pXHJcblx0XHRcdGlmICFiZWZvcmVIb29rXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcclxuXHJcblx0XHRcdGlmKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlPy5uYW1lKVxyXG5cdFx0XHRcdHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZT8ubmFtZVxyXG5cclxuXHRcdFx0aWYgcmVjb3JkX3RpdGxlXHJcblx0XHRcdFx0dGV4dCA9IHQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCIsIFwiI3tvYmplY3QubGFiZWx9IFxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRleHQgPSB0IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiLCBcIiN7b2JqZWN0LmxhYmVsfVwiXHJcblx0XHRcdHN3YWxcclxuXHRcdFx0XHR0aXRsZTogdCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCIsIFwiI3tvYmplY3QubGFiZWx9XCJcclxuXHRcdFx0XHR0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPiN7dGV4dH08L2Rpdj5cIlxyXG5cdFx0XHRcdGh0bWw6IHRydWVcclxuXHRcdFx0XHRzaG93Q2FuY2VsQnV0dG9uOnRydWVcclxuXHRcdFx0XHRjb25maXJtQnV0dG9uVGV4dDogdCgnRGVsZXRlJylcclxuXHRcdFx0XHRjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxyXG5cdFx0XHRcdChvcHRpb24pIC0+XHJcblx0XHRcdFx0XHRpZiBvcHRpb25cclxuXHRcdFx0XHRcdFx0cHJldmlvdXNEb2MgPSBGb3JtTWFuYWdlci5nZXRQcmV2aW91c0RvYyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAnZGVsZXRlJylcclxuXHRcdFx0XHRcdFx0Q3JlYXRvci5vZGF0YS5kZWxldGUgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgKCktPlxyXG5cdFx0XHRcdFx0XHRcdGlmIHJlY29yZF90aXRsZVxyXG5cdFx0XHRcdFx0XHRcdFx0IyBpbmZvID0gb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiICsgXCLlt7LliKDpmaRcIlxyXG5cdFx0XHRcdFx0XHRcdFx0aW5mbyA9dCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRpbmZvID0gdCgnY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfc3VjJylcclxuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyBpbmZvXHJcblx0XHRcdFx0XHRcdFx0IyDmlofku7bniYjmnKzkuLpcImNmcy5maWxlcy5maWxlcmVjb3JkXCLvvIzpnIDopoHmm7/mjaLkuLpcImNmcy1maWxlcy1maWxlcmVjb3JkXCJcclxuXHRcdFx0XHRcdFx0XHRncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csXCItXCIpXHJcblx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXHJcblx0XHRcdFx0XHRcdFx0dW5sZXNzIGdyaWRDb250YWluZXI/Lmxlbmd0aFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgd2luZG93Lm9wZW5lclxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc09wZW5lclJlbW92ZSA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcclxuXHRcdFx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0XHRcdGlmIEZsb3dSb3V0ZXIuY3VycmVudCgpLnJvdXRlLnBhdGguZW5kc1dpdGgoXCIvOnJlY29yZF9pZFwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RfbmFtZSAhPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKTtcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LmdyaWRSZWYuY3VycmVudC5hcGkucmVmcmVzaFNlcnZlclNpZGVTdG9yZSgpXHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggX2VcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoX2UpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIGdyaWRDb250YWluZXI/Lmxlbmd0aFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJylcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGR4RGF0YUdyaWRJbnN0YW5jZVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKClcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0X25hbWUgIT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRUZW1wbGF0ZS5jcmVhdG9yX2dyaWQucmVmcmVzaChkeERhdGFHcmlkSW5zdGFuY2UpXHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcclxuXHRcdFx0XHRcdFx0XHR0ZW1wTmF2UmVtb3ZlZCA9IENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCkgI+aXoOiuuuaYr+WcqOiusOW9leivpue7hueVjOmdoui/mOaYr+WIl+ihqOeVjOmdouaJp+ihjOWIoOmZpOaTjeS9nO+8jOmDveS8muaKiuS4tOaXtuWvvOiIquWIoOmZpOaOiVxyXG5cdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlIG9yICFkeERhdGFHcmlkSW5zdGFuY2VcclxuXHRcdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlXHJcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5jbG9zZSgpXHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIHJlY29yZF9pZCA9PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSBhbmQgbGlzdF92aWV3X2lkICE9ICdjYWxlbmRhcidcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcclxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpc3Rfdmlld19pZCA9IFwiYWxsXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIHRlbXBOYXZSZW1vdmVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpznoa7lrp7liKDpmaTkuobkuLTml7blr7zoiKrvvIzlsLHlj6/og73lt7Lnu4/ph43lrprlkJHliLDkuIrkuIDkuKrpobXpnaLkuobvvIzmsqHlv4XopoHlho3ph43lrprlkJHkuIDmrKFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLmdvIFwiL2FwcC8je2FwcGlkfS8je29iamVjdF9uYW1lfS9ncmlkLyN7bGlzdF92aWV3X2lkfVwiXHJcblx0XHRcdFx0XHRcdFx0aWYgY2FsbF9iYWNrIGFuZCB0eXBlb2YgY2FsbF9iYWNrID09IFwiZnVuY3Rpb25cIlxyXG5cdFx0XHRcdFx0XHRcdFx0Y2FsbF9iYWNrKClcclxuXHJcblx0XHRcdFx0XHRcdFx0Rm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtfaWQ6IHJlY29yZF9pZCwgcHJldmlvdXNEb2M6IHByZXZpb3VzRG9jfSlcclxuXHRcdFx0XHRcdFx0LCAoZXJyb3IpLT5cclxuXHRcdFx0XHRcdFx0XHRGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2Vycm9yJywge19pZDogcmVjb3JkX2lkLCBlcnJvcjogZXJyb3J9KSIsInZhciBzdGVlZG9zRmlsdGVycztcblxuQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgc3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKSB7XG4gICAgdmFyIGZpbHRlcnMsIG1vcmVBcmdzLCBvYmosIHRvZG8sIHRvZG9BcmdzLCB1cmw7XG4gICAgaWYgKGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gJ3dvcmQtcHJpbnQnKSB7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGZpbHRlcnMgPSBbJ19pZCcsICc9JywgcmVjb3JkX2lkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbHRlcnMgPSBPYmplY3RHcmlkLmdldEZpbHRlcnMob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZmFsc2UsIG51bGwsIG51bGwpO1xuICAgICAgfVxuICAgICAgdXJsID0gXCIvYXBpL3Y0L3dvcmRfdGVtcGxhdGVzL1wiICsgYWN0aW9uLndvcmRfdGVtcGxhdGUgKyBcIi9wcmludFwiICsgXCI/ZmlsdGVycz1cIiArIHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkoZmlsdGVycyk7XG4gICAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG4gICAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsKTtcbiAgICB9XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwKSB7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uLnRvZG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0b2RvID0gYWN0aW9uLnRvZG87XG4gICAgICB9XG4gICAgICBpZiAoIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICAgICAgcmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB9XG4gICAgICBpZiAodG9kbykge1xuICAgICAgICBpdGVtX2VsZW1lbnQgPSBpdGVtX2VsZW1lbnQgPyBpdGVtX2VsZW1lbnQgOiBcIlwiO1xuICAgICAgICBtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG4gICAgICAgIHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncyk7XG4gICAgICAgIHJldHVybiB0b2RvLmFwcGx5KHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgb2JqZWN0OiBvYmosXG4gICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgaXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnQsXG4gICAgICAgICAgcmVjb3JkOiByZWNvcmRcbiAgICAgICAgfSwgdG9kb0FyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKTtcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuYWN0aW9ucyh7XG4gICAgXCJzdGFuZGFyZF9xdWVyeVwiOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIik7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX25ld1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBpbml0aWFsVmFsdWVzLCBvYmplY3QsIHNlbGVjdGVkUm93cztcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgIHNlbGVjdGVkUm93cyA9IHdpbmRvdy5ncmlkUmVmLmN1cnJlbnQuYXBpLmdldFNlbGVjdGVkUm93cygpO1xuICAgICAgaWYgKHNlbGVjdGVkUm93cyAhPSBudWxsID8gc2VsZWN0ZWRSb3dzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICByZWNvcmRfaWQgPSBzZWxlY3RlZFJvd3NbMF0uX2lkO1xuICAgICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgICAgaW5pdGlhbFZhbHVlcyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFsVmFsdWVzID0gRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0LnZlcnNpb24gOiB2b2lkIDApID49IDIpIHtcbiAgICAgICAgcmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuICAgICAgICAgIG5hbWU6IG9iamVjdF9uYW1lICsgXCJfc3RhbmRhcmRfbmV3X2Zvcm1cIixcbiAgICAgICAgICBvYmplY3RBcGlOYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICB0aXRsZTogJ+aWsOW7uicsXG4gICAgICAgICAgaW5pdGlhbFZhbHVlczogaW5pdGlhbFZhbHVlcyxcbiAgICAgICAgICBhZnRlckluc2VydDogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICB2YXIgcmVjb3JkO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHJlY29yZCA9IHJlc3VsdFswXTtcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXBwX2lkLCB1cmw7XG4gICAgICAgICAgICAgICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gICAgICAgICAgICAgICAgdXJsID0gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmQuX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBGbG93Um91dGVyLmdvKHVybCk7XG4gICAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIG51bGwsIHtcbiAgICAgICAgICBpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChzZWxlY3RlZFJvd3MgIT0gbnVsbCA/IHNlbGVjdGVkUm93cy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgfVxuICAgICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX29wZW5fdmlld1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBocmVmO1xuICAgICAgaHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgRmxvd1JvdXRlci5yZWRpcmVjdChocmVmKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfZWRpdFwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBvYmplY3Q7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgICAgaWYgKChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC52ZXJzaW9uIDogdm9pZCAwKSA+PSAyKSB7XG4gICAgICAgICAgcmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuICAgICAgICAgICAgbmFtZTogb2JqZWN0X25hbWUgKyBcIl9zdGFuZGFyZF9lZGl0X2Zvcm1cIixcbiAgICAgICAgICAgIG9iamVjdEFwaU5hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgcmVjb3JkSWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICAgIHRpdGxlOiAn57yW6L6RJyxcbiAgICAgICAgICAgIGFmdGVyVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gRmxvd1JvdXRlci5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5ncmlkUmVmLmN1cnJlbnQuYXBpLnJlZnJlc2hTZXJ2ZXJTaWRlU3RvcmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBudWxsLCB7XG4gICAgICAgICAgICBpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBmYWxzZSkge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLWVkaXQtcmVjb3JkXCIpLmNsaWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgICByZXR1cm4gTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gJChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwic3RhbmRhcmRfZGVsZXRlXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaykge1xuICAgICAgdmFyIGJlZm9yZUhvb2ssIG9iamVjdCwgdGV4dDtcbiAgICAgIGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtcbiAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCFiZWZvcmVIb29rKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGlmICghXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIChyZWNvcmRfdGl0bGUgIT0gbnVsbCA/IHJlY29yZF90aXRsZS5uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGUgIT0gbnVsbCA/IHJlY29yZF90aXRsZS5uYW1lIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICB0ZXh0ID0gdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgb2JqZWN0LmxhYmVsICsgXCIgXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCIsIFwiXCIgKyBvYmplY3QubGFiZWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN3YWwoe1xuICAgICAgICB0aXRsZTogdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCIsIFwiXCIgKyBvYmplY3QubGFiZWwpLFxuICAgICAgICB0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPlwiICsgdGV4dCArIFwiPC9kaXY+XCIsXG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKSxcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcbiAgICAgIH0sIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB2YXIgcHJldmlvdXNEb2M7XG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICBwcmV2aW91c0RvYyA9IEZvcm1NYW5hZ2VyLmdldFByZXZpb3VzRG9jKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICdkZWxldGUnKTtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5vZGF0YVtcImRlbGV0ZVwiXShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBfZSwgYXBwaWQsIGR4RGF0YUdyaWRJbnN0YW5jZSwgZ3JpZENvbnRhaW5lciwgZ3JpZE9iamVjdE5hbWVDbGFzcywgaW5mbywgaXNPcGVuZXJSZW1vdmUsIHJlY29yZFVybCwgdGVtcE5hdlJlbW92ZWQ7XG4gICAgICAgICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgICAgICAgIGluZm8gPSB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVfc3VjXCIsIG9iamVjdC5sYWJlbCArIChcIlxcXCJcIiArIHJlY29yZF90aXRsZSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpbmZvID0gdCgnY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfc3VjJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhpbmZvKTtcbiAgICAgICAgICAgIGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZywgXCItXCIpO1xuICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgaWYgKCEoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XG4gICAgICAgICAgICAgICAgaXNPcGVuZXJSZW1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZ3JpZFJlZi5jdXJyZW50LmFwaS5yZWZyZXNoU2VydmVyU2lkZVN0b3JlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBfZSA9IGVycm9yMTtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihfZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0X25hbWUgIT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikpIHtcbiAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgICAgIHRlbXBOYXZSZW1vdmVkID0gQ3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKTtcbiAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSB8fCAhZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgJiYgbGlzdF92aWV3X2lkICE9PSAnY2FsZW5kYXInKSB7XG4gICAgICAgICAgICAgICAgYXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICAgICAgICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgICAgICAgICAgICBsaXN0X3ZpZXdfaWQgPSBcImFsbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRlbXBOYXZSZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcC9cIiArIGFwcGlkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgY2FsbF9iYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtcbiAgICAgICAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgICAgIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2Vycm9yJywge1xuICAgICAgICAgICAgICBfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
