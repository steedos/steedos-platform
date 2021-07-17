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
var APIService, MetadataService, config, e, moleculer, objectql, packageLoader, path, settings, steedosCore;

try {
  if (process.env.CREATOR_NODE_ENV === 'development') {
    steedosCore = require('@steedos/core');
    objectql = require('@steedos/objectql');
    moleculer = require("moleculer");
    packageLoader = require('@steedos/service-meteor-package-loader');
    APIService = require('@steedos/service-api');
    MetadataService = require('@steedos/service-metadata-server');
    path = require('path');
    config = objectql.getSteedosConfig();
    settings = {
      built_in_plugins: ["@steedos/workflow", "@steedos/accounts", "@steedos/steedos-plugin-schema-builder", "@steedos/plugin-enterprise", "@steedos/word-template", "@steedos/metadata-api"],
      plugins: config.plugins
    };
    Meteor.startup(function () {
      var apiService, broker, ex, metadataService, standardObjectsDir, standardObjectsPackageLoaderService;

      try {
        broker = new moleculer.ServiceBroker({
          namespace: "steedos",
          nodeID: "steedos-creator",
          metadata: {},
          transporter: process.env.TRANSPORTER,
          cacher: process.env.CACHER,
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
        metadataService = broker.createService({
          name: 'metadata-server',
          mixins: [MetadataService],
          settings: {}
        });
        apiService = broker.createService({
          name: "api",
          mixins: [APIService],
          settings: {
            port: null
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

            WebApp.connectHandlers.use("/", apiService.express());
            return broker.waitForServices(standardObjectsPackageLoaderService.name).then(function (resolve, reject) {
              return steedosCore.init(settings).then(function () {
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
    return Creator.Collections[((ref = Creator.getObject(object_name, spaceId)) != null ? ref._collection_name : void 0) || object_name];
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
    var _object, layoutRelatedList, list, mapList, objectLayoutRelatedListObjects, permissions, relatedList, relatedListNames, relatedListObjects, related_object_names, related_objects, spaceId, unrelated_objects, userId;

    if (!object_name) {
      return;
    }

    relatedListObjects = {};
    relatedListNames = [];
    objectLayoutRelatedListObjects = [];
    _object = Creator.getObject(object_name);

    if (_object) {
      layoutRelatedList = _object.related_lists;

      if (!_.isEmpty(layoutRelatedList)) {
        _.each(layoutRelatedList, function (item) {
          var reFieldName, reObjectName, ref, ref1, related, write_requires_master_read;
          reObjectName = item.related_field_fullname.split('.')[0];
          reFieldName = item.related_field_fullname.split('.')[1];
          write_requires_master_read = (ref = Creator.getObject(reObjectName)) != null ? (ref1 = ref.fields[reFieldName]) != null ? ref1.write_requires_master_read : void 0 : void 0;
          related = {
            object_name: reObjectName,
            columns: item.field_names,
            mobile_columns: item.field_names,
            is_file: reObjectName === "cms_files",
            filtersFunction: item.filters,
            sort: item.sort,
            related_field_name: reFieldName,
            customRelatedListObject: true,
            write_requires_master_read: write_requires_master_read,
            label: item.label,
            actions: item.buttons,
            visible_on: item.visible_on,
            page_size: item.page_size
          };
          return objectLayoutRelatedListObjects.push(related);
        });

        return objectLayoutRelatedListObjects;
      }

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
              actions: objOrName.actions,
              page_size: objOrName.page_size
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

        if (relatedObject.page_size) {
          related.page_size = relatedObject.page_size;
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
    _.forEach(object.related_lists, function (relatedObjInfo) {
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
    _.forEach(object.related_lists, function (relatedObjInfo) {
      if (_.isObject(relatedObjInfo)) {
        return _.forEach(relatedObjInfo, function (val, key) {
          if (key === 'filters' && _.isFunction(val)) {
            return relatedObjInfo[key] = val.toString();
          }
        });
      }
    });
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
  self.related_lists = options.related_lists;
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
  self.enable_events = options.enable_events;

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

          if (field.reference_to_field) {
            fs.autoform.referenceToField = field.reference_to_field;
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

}},"node_modules":{"moleculer":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/steedos_objects/node_modules/moleculer/package.json                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "moleculer",
  "version": "0.14.12",
  "main": "index.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/steedos_objects/node_modules/moleculer/index.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiQVBJU2VydmljZSIsIk1ldGFkYXRhU2VydmljZSIsImNvbmZpZyIsImUiLCJtb2xlY3VsZXIiLCJvYmplY3RxbCIsInBhY2thZ2VMb2FkZXIiLCJwYXRoIiwic2V0dGluZ3MiLCJzdGVlZG9zQ29yZSIsInByb2Nlc3MiLCJlbnYiLCJDUkVBVE9SX05PREVfRU5WIiwicmVxdWlyZSIsImdldFN0ZWVkb3NDb25maWciLCJidWlsdF9pbl9wbHVnaW5zIiwicGx1Z2lucyIsIk1ldGVvciIsInN0YXJ0dXAiLCJhcGlTZXJ2aWNlIiwiYnJva2VyIiwiZXgiLCJtZXRhZGF0YVNlcnZpY2UiLCJzdGFuZGFyZE9iamVjdHNEaXIiLCJzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSIsIlNlcnZpY2VCcm9rZXIiLCJuYW1lc3BhY2UiLCJub2RlSUQiLCJtZXRhZGF0YSIsInRyYW5zcG9ydGVyIiwiVFJBTlNQT1JURVIiLCJjYWNoZXIiLCJDQUNIRVIiLCJsb2dMZXZlbCIsInNlcmlhbGl6ZXIiLCJyZXF1ZXN0VGltZW91dCIsIm1heENhbGxMZXZlbCIsImhlYXJ0YmVhdEludGVydmFsIiwiaGVhcnRiZWF0VGltZW91dCIsImNvbnRleHRQYXJhbXNDbG9uaW5nIiwidHJhY2tpbmciLCJlbmFibGVkIiwic2h1dGRvd25UaW1lb3V0IiwiZGlzYWJsZUJhbGFuY2VyIiwicmVnaXN0cnkiLCJzdHJhdGVneSIsInByZWZlckxvY2FsIiwiYnVsa2hlYWQiLCJjb25jdXJyZW5jeSIsIm1heFF1ZXVlU2l6ZSIsInZhbGlkYXRvciIsImVycm9ySGFuZGxlciIsInRyYWNpbmciLCJleHBvcnRlciIsInR5cGUiLCJvcHRpb25zIiwibG9nZ2VyIiwiY29sb3JzIiwid2lkdGgiLCJnYXVnZVdpZHRoIiwiY3JlYXRlU2VydmljZSIsIm5hbWUiLCJtaXhpbnMiLCJwb3J0IiwiZ2V0U3RlZWRvc1NjaGVtYSIsIlN0YW5kYXJkT2JqZWN0c1BhdGgiLCJwYWNrYWdlSW5mbyIsIndyYXBBc3luYyIsImNiIiwic3RhcnQiLCJ0aGVuIiwic3RhcnRlZCIsIl9yZXN0YXJ0U2VydmljZSIsIldlYkFwcCIsImNvbm5lY3RIYW5kbGVycyIsInVzZSIsImV4cHJlc3MiLCJ3YWl0Rm9yU2VydmljZXMiLCJyZXNvbHZlIiwicmVqZWN0IiwiaW5pdCIsImVycm9yIiwiY29uc29sZSIsIkZpYmVyIiwiZGVwcyIsImFwcCIsIlRyYWNrZXIiLCJEZXBlbmRlbmN5Iiwib2JqZWN0IiwiX1RFTVBMQVRFIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsImZpbHRlcnNGdW5jdGlvbiIsIk1hdGNoIiwiT3B0aW9uYWwiLCJPbmVPZiIsIkZ1bmN0aW9uIiwiU3RyaW5nIiwib3B0aW9uc0Z1bmN0aW9uIiwiY3JlYXRlRnVuY3Rpb24iLCJpc1NlcnZlciIsImZpYmVyTG9hZE9iamVjdHMiLCJvYmoiLCJvYmplY3RfbmFtZSIsImxvYWRPYmplY3RzIiwicnVuIiwibGlzdF92aWV3cyIsInNwYWNlIiwiZ2V0Q29sbGVjdGlvbk5hbWUiLCJfIiwiY2xvbmUiLCJjb252ZXJ0T2JqZWN0IiwiT2JqZWN0IiwiaW5pdFRyaWdnZXJzIiwiaW5pdExpc3RWaWV3cyIsImdldE9iamVjdE5hbWUiLCJnZXRPYmplY3QiLCJzcGFjZV9pZCIsInJlZiIsInJlZjEiLCJpc0FycmF5IiwiaXNDbGllbnQiLCJkZXBlbmQiLCJTZXNzaW9uIiwiZ2V0Iiwib2JqZWN0c0J5TmFtZSIsImdldE9iamVjdEJ5SWQiLCJvYmplY3RfaWQiLCJmaW5kV2hlcmUiLCJfaWQiLCJyZW1vdmVPYmplY3QiLCJsb2ciLCJnZXRDb2xsZWN0aW9uIiwic3BhY2VJZCIsIl9jb2xsZWN0aW9uX25hbWUiLCJyZW1vdmVDb2xsZWN0aW9uIiwiaXNTcGFjZUFkbWluIiwidXNlcklkIiwiZmluZE9uZSIsImZpZWxkcyIsImFkbWlucyIsImluZGV4T2YiLCJldmFsdWF0ZUZvcm11bGEiLCJmb3JtdWxhciIsImNvbnRleHQiLCJpc1N0cmluZyIsIkZvcm11bGFyIiwiY2hlY2tGb3JtdWxhIiwiZXZhbHVhdGVGaWx0ZXJzIiwiZmlsdGVycyIsInNlbGVjdG9yIiwiZWFjaCIsImZpbHRlciIsImFjdGlvbiIsInZhbHVlIiwibGVuZ3RoIiwiaXNDb21tb25TcGFjZSIsImdldE9yZGVybHlTZXRCeUlkcyIsImRvY3MiLCJpZHMiLCJpZF9rZXkiLCJoaXRfZmlyc3QiLCJ2YWx1ZXMiLCJnZXRQcm9wZXJ0eSIsInNvcnRCeSIsImRvYyIsIl9pbmRleCIsInNvcnRpbmdNZXRob2QiLCJ2YWx1ZTEiLCJ2YWx1ZTIiLCJpc1ZhbHVlMUVtcHR5IiwiaXNWYWx1ZTJFbXB0eSIsImxvY2FsZSIsImtleSIsIkRhdGUiLCJnZXRUaW1lIiwiU3RlZWRvcyIsInRvU3RyaW5nIiwibG9jYWxlQ29tcGFyZSIsImdldE9iamVjdFJlbGF0ZWRzIiwiX29iamVjdCIsInBlcm1pc3Npb25zIiwicmVsYXRlZExpc3QiLCJyZWxhdGVkTGlzdE1hcCIsInJlbGF0ZWRfb2JqZWN0cyIsImlzRW1wdHkiLCJvYmpOYW1lIiwiaXNPYmplY3QiLCJvYmplY3ROYW1lIiwicmVsYXRlZF9vYmplY3QiLCJyZWxhdGVkX29iamVjdF9uYW1lIiwicmVsYXRlZF9maWVsZCIsInJlbGF0ZWRfZmllbGRfbmFtZSIsInJlZmVyZW5jZV90byIsImZvcmVpZ25fa2V5Iiwid3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQiLCJlbmFibGVPYmpOYW1lIiwiZ2V0UGVybWlzc2lvbnMiLCJlbmFibGVfYXVkaXQiLCJtb2RpZnlBbGxSZWNvcmRzIiwiZW5hYmxlX2ZpbGVzIiwicHVzaCIsInNwbGljZSIsImVuYWJsZV90YXNrcyIsImVuYWJsZV9ub3RlcyIsImVuYWJsZV9ldmVudHMiLCJlbmFibGVfaW5zdGFuY2VzIiwiZW5hYmxlX2FwcHJvdmFscyIsImVuYWJsZV9wcm9jZXNzIiwiZ2V0VXNlckNvbnRleHQiLCJpc1VuU2FmZU1vZGUiLCJVU0VSX0NPTlRFWFQiLCJzcGFjZV91c2VyX29yZyIsInN1Iiwic3VGaWVsZHMiLCJFcnJvciIsIm1vYmlsZSIsInBvc2l0aW9uIiwiZW1haWwiLCJjb21wYW55Iiwib3JnYW5pemF0aW9uIiwiY29tcGFueV9pZCIsImNvbXBhbnlfaWRzIiwidXNlciIsImZ1bGxuYW1lIiwiZ2V0UmVsYXRpdmVVcmwiLCJ1cmwiLCJpc0Z1bmN0aW9uIiwiaXNDb3Jkb3ZhIiwic3RhcnRzV2l0aCIsInRlc3QiLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwiUk9PVF9VUkxfUEFUSF9QUkVGSVgiLCJnZXRVc2VyQ29tcGFueUlkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJwcm9jZXNzUGVybWlzc2lvbnMiLCJwbyIsImFsbG93Q3JlYXRlIiwiYWxsb3dSZWFkIiwiYWxsb3dFZGl0IiwiYWxsb3dEZWxldGUiLCJ2aWV3QWxsUmVjb3JkcyIsInZpZXdDb21wYW55UmVjb3JkcyIsIm1vZGlmeUNvbXBhbnlSZWNvcmRzIiwiZ2V0VGVtcGxhdGVTcGFjZUlkIiwidGVtcGxhdGVTcGFjZUlkIiwiZ2V0Q2xvdWRBZG1pblNwYWNlSWQiLCJjbG91ZEFkbWluU3BhY2VJZCIsImlzVGVtcGxhdGVTcGFjZSIsImlzQ2xvdWRBZG1pblNwYWNlIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsIm9wdGlvbnNfbGltaXQiLCJxdWVyeSIsInF1ZXJ5X29wdGlvbnMiLCJyZWNvcmRzIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsInBhcmFtcyIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJmaWx0ZXJRdWVyeSIsImxpbWl0IiwiZmluZCIsImZldGNoIiwicmVjb3JkIiwibGFiZWwiLCJtZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm94IiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJmbG93SWQiLCJoYXNoRGF0YSIsImlucyIsImluc0lkIiwicmVjb3JkX2lkIiwicmVkaXJlY3RfdXJsIiwicmVmMiIsInJlZjMiLCJyZWY0Iiwid29ya2Zsb3dVcmwiLCJ4X2F1dGhfdG9rZW4iLCJ4X3VzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsImJvZHkiLCJjaGVjayIsImluc3RhbmNlSWQiLCJmbG93IiwiaW5ib3hfdXNlcnMiLCJpbmNsdWRlcyIsImNjX3VzZXJzIiwib3V0Ym94X3VzZXJzIiwic3RhdGUiLCJzdWJtaXR0ZXIiLCJhcHBsaWNhbnQiLCJwZXJtaXNzaW9uTWFuYWdlciIsImdldEZsb3dQZXJtaXNzaW9ucyIsInNwYWNlcyIsIndlYnNlcnZpY2VzIiwid29ya2Zsb3ciLCJzZW5kUmVzdWx0IiwiY29kZSIsImRhdGEiLCJ1cGRhdGUiLCIkdW5zZXQiLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJnZXRJbml0V2lkdGhQZXJjZW50IiwiY29sdW1ucyIsIl9zY2hlbWEiLCJjb2x1bW5fbnVtIiwiaW5pdF93aWR0aF9wZXJjZW50IiwiZ2V0U2NoZW1hIiwiZmllbGRfbmFtZSIsImZpZWxkIiwiaXNfd2lkZSIsInBpY2siLCJhdXRvZm9ybSIsImdldEZpZWxkSXNXaWRlIiwiZ2V0VGFidWxhck9yZGVyIiwibGlzdF92aWV3X2lkIiwic2V0dGluZyIsIm1hcCIsImNvbHVtbiIsImhpZGRlbiIsImNvbXBhY3QiLCJvcmRlciIsImluZGV4IiwiZGVmYXVsdF9leHRyYV9jb2x1bW5zIiwiZXh0cmFfY29sdW1ucyIsImdldE9iamVjdERlZmF1bHRDb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyIsInVuaW9uIiwiZ2V0T2JqZWN0RGVmYXVsdFNvcnQiLCJUYWJ1bGFyU2VsZWN0ZWRJZHMiLCJjb252ZXJ0TGlzdFZpZXciLCJkZWZhdWx0X3ZpZXciLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfbmFtZSIsImRlZmF1bHRfY29sdW1ucyIsImRlZmF1bHRfbW9iaWxlX2NvbHVtbnMiLCJvaXRlbSIsIm1vYmlsZV9jb2x1bW5zIiwiaGFzIiwiaW5jbHVkZSIsImZpbHRlcl9zY29wZSIsInBhcnNlIiwiZm9yRWFjaCIsIl92YWx1ZSIsImdldFJlbGF0ZWRMaXN0IiwibGF5b3V0UmVsYXRlZExpc3QiLCJsaXN0IiwibWFwTGlzdCIsIm9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyIsInJlbGF0ZWRMaXN0TmFtZXMiLCJyZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInVucmVsYXRlZF9vYmplY3RzIiwicmVsYXRlZF9saXN0cyIsIml0ZW0iLCJyZUZpZWxkTmFtZSIsInJlT2JqZWN0TmFtZSIsInJlbGF0ZWQiLCJyZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lIiwic3BsaXQiLCJmaWVsZF9uYW1lcyIsImlzX2ZpbGUiLCJjdXN0b21SZWxhdGVkTGlzdE9iamVjdCIsImFjdGlvbnMiLCJidXR0b25zIiwidmlzaWJsZV9vbiIsInBhZ2Vfc2l6ZSIsIm9iak9yTmFtZSIsImdldFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfaXRlbSIsInJlbGF0ZWRPYmplY3QiLCJ0YWJ1bGFyX29yZGVyIiwid2l0aG91dCIsInRyYW5zZm9ybVNvcnRUb1RhYnVsYXIiLCJyZXBsYWNlIiwicGx1Y2siLCJkaWZmZXJlbmNlIiwidiIsImlzQWN0aXZlIiwiYWxsb3dfcmVsYXRlZExpc3QiLCJnZXRPYmplY3RGaXJzdExpc3RWaWV3IiwiZmlyc3QiLCJnZXRMaXN0Vmlld3MiLCJnZXRMaXN0VmlldyIsImV4YWMiLCJsaXN0Vmlld3MiLCJnZXRMaXN0Vmlld0lzUmVjZW50IiwibGlzdFZpZXciLCJwaWNrT2JqZWN0TW9iaWxlQ29sdW1ucyIsImNvdW50IiwiZ2V0RmllbGQiLCJpc05hbWVDb2x1bW4iLCJpdGVtQ291bnQiLCJtYXhDb3VudCIsIm1heFJvd3MiLCJuYW1lQ29sdW1uIiwibmFtZUtleSIsInJlc3VsdCIsImdldE9iamVjdERlZmF1bHRWaWV3IiwiZGVmYXVsdFZpZXciLCJ1c2VfbW9iaWxlX2NvbHVtbnMiLCJpc0FsbFZpZXciLCJpc1JlY2VudFZpZXciLCJ0YWJ1bGFyQ29sdW1ucyIsInRhYnVsYXJfc29ydCIsImNvbHVtbl9pbmRleCIsInRyYW5zZm9ybVNvcnRUb0RYIiwiZHhfc29ydCIsIlJlZ0V4IiwiUmVnRXhwIiwiX3JlZ0V4TWVzc2FnZXMiLCJfZ2xvYmFsTWVzc2FnZXMiLCJyZWdFeCIsImV4cCIsIm1zZyIsIm1lc3NhZ2VzIiwiZXZhbEluQ29udGV4dCIsImpzIiwiZXZhbCIsImNhbGwiLCJjb252ZXJ0RmllbGQiLCJnZXRPcHRpb24iLCJvcHRpb24iLCJmb28iLCJjb2xvciIsImFsbE9wdGlvbnMiLCJwaWNrbGlzdCIsInBpY2tsaXN0T3B0aW9ucyIsImdldFBpY2tsaXN0IiwiZ2V0UGlja0xpc3RPcHRpb25zIiwicmV2ZXJzZSIsImVuYWJsZSIsImRlZmF1bHRWYWx1ZSIsInRyaWdnZXJzIiwidHJpZ2dlciIsIl90b2RvIiwiX3RvZG9fZnJvbV9jb2RlIiwiX3RvZG9fZnJvbV9kYiIsIm9uIiwidG9kbyIsIl92aXNpYmxlIiwiZXJyb3IxIiwiYWN0aW9uc0J5TmFtZSIsInZpc2libGUiLCJfb3B0aW9ucyIsIl90eXBlIiwiYmVmb3JlT3BlbkZ1bmN0aW9uIiwiaXNfY29tcGFueV9saW1pdGVkIiwibWF4IiwibWluIiwiX29wdGlvbiIsImsiLCJfcmVnRXgiLCJfbWluIiwiX21heCIsIk51bWJlciIsIkJvb2xlYW4iLCJfb3B0aW9uc0Z1bmN0aW9uIiwiX3JlZmVyZW5jZV90byIsIl9jcmVhdGVGdW5jdGlvbiIsIl9iZWZvcmVPcGVuRnVuY3Rpb24iLCJfZmlsdGVyc0Z1bmN0aW9uIiwiX2RlZmF1bHRWYWx1ZSIsIl9pc19jb21wYW55X2xpbWl0ZWQiLCJfZmlsdGVycyIsImlzRGF0ZSIsInBvcCIsIl9pc19kYXRlIiwiZm9ybSIsInZhbCIsInJlbGF0ZWRPYmpJbmZvIiwiUFJFRklYIiwiX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhIiwicHJlZml4IiwiZmllbGRWYXJpYWJsZSIsInJlZyIsInJldiIsIm0iLCIkMSIsImZvcm11bGFfc3RyIiwiX0NPTlRFWFQiLCJfVkFMVUVTIiwiaXNCb29sZWFuIiwidG9hc3RyIiwiZm9ybWF0T2JqZWN0TmFtZSIsIl9iYXNlT2JqZWN0IiwiX2RiIiwiZGVmYXVsdExpc3RWaWV3SWQiLCJkaXNhYmxlZF9saXN0X3ZpZXdzIiwic2NoZW1hIiwic2VsZiIsImJhc2VPYmplY3QiLCJwZXJtaXNzaW9uX3NldCIsImljb24iLCJkZXNjcmlwdGlvbiIsImlzX3ZpZXciLCJ2ZXJzaW9uIiwiaXNfZW5hYmxlIiwiYWxsb3dfY3VzdG9tQWN0aW9ucyIsImV4Y2x1ZGVfYWN0aW9ucyIsImVuYWJsZV9zZWFyY2giLCJwYWdpbmciLCJlbmFibGVfYXBpIiwiY3VzdG9tIiwiZW5hYmxlX3NoYXJlIiwiZW5hYmxlX3RyZWUiLCJzaWRlYmFyIiwib3Blbl93aW5kb3ciLCJmaWx0ZXJfY29tcGFueSIsImNhbGVuZGFyIiwiZW5hYmxlX2NoYXR0ZXIiLCJlbmFibGVfdHJhc2giLCJlbmFibGVfc3BhY2VfZ2xvYmFsIiwiZW5hYmxlX2ZvbGxvdyIsImVuYWJsZV93b3JrZmxvdyIsImVuYWJsZV9pbmxpbmVfZWRpdCIsImRldGFpbHMiLCJtYXN0ZXJzIiwibG9va3VwX2RldGFpbHMiLCJpbl9kZXZlbG9wbWVudCIsImlkRmllbGROYW1lIiwiZGF0YWJhc2VfbmFtZSIsImlzX25hbWUiLCJwcmltYXJ5IiwiZmlsdGVyYWJsZSIsInJlYWRvbmx5IiwiaXRlbV9uYW1lIiwiY29weUl0ZW0iLCJhZG1pbiIsImFsbCIsImxpc3Rfdmlld19pdGVtIiwiUmVhY3RpdmVWYXIiLCJjcmVhdGVDb2xsZWN0aW9uIiwiX25hbWUiLCJnZXRPYmplY3RTY2hlbWEiLCJjb250YWlucyIsImF0dGFjaFNjaGVtYSIsIl9zaW1wbGVTY2hlbWEiLCJnZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCIsImJvb3RzdHJhcExvYWRlZCIsImZpZWxkc0FyciIsIl9yZWZfb2JqIiwiYXV0b2Zvcm1fdHlwZSIsImZzIiwiaXNVbkxpbWl0ZWQiLCJtdWx0aXBsZSIsInJvd3MiLCJsYW5ndWFnZSIsImlzTW9iaWxlIiwiaXNQYWQiLCJpc2lPUyIsImFmRmllbGRJbnB1dCIsInRpbWV6b25lSWQiLCJkeERhdGVCb3hPcHRpb25zIiwiZGlzcGxheUZvcm1hdCIsInBpY2tlclR5cGUiLCJkYXRlTW9iaWxlT3B0aW9ucyIsIm91dEZvcm1hdCIsImhlaWdodCIsImRpYWxvZ3NJbkJvZHkiLCJ0b29sYmFyIiwiZm9udE5hbWVzIiwibGFuZyIsInNob3dJY29uIiwiZGVwZW5kT24iLCJkZXBlbmRfb24iLCJjcmVhdGUiLCJsb29rdXBfZmllbGQiLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJvcGVyYXRpb24iLCJvblN1Y2Nlc3MiLCJhZGRJdGVtcyIsInJlZmVyZW5jZV9zb3J0Iiwib3B0aW9uc1NvcnQiLCJyZWZlcmVuY2VfbGltaXQiLCJvcHRpb25zTGltaXQiLCJyZWZlcmVuY2VfdG9fZmllbGQiLCJyZWZlcmVuY2VUb0ZpZWxkIiwib21pdCIsImJsYWNrYm94Iiwib2JqZWN0U3dpdGNoZSIsIm9wdGlvbnNNZXRob2QiLCJvcHRpb25zTWV0aG9kUGFyYW1zIiwicmVmZXJlbmNlcyIsIl9yZWZlcmVuY2UiLCJsaW5rIiwiZGVmYXVsdEljb24iLCJmaXJzdE9wdGlvbiIsInByZWNpc2lvbiIsInNjYWxlIiwiZGVjaW1hbCIsImRpc2FibGVkIiwiQXJyYXkiLCJlZGl0YWJsZSIsImFjY2VwdCIsInN5c3RlbSIsIkVtYWlsIiwiYXNzaWduIiwiZGF0YV90eXBlIiwiaXNOdW1iZXIiLCJyZXF1aXJlZCIsIm9wdGlvbmFsIiwidW5pcXVlIiwiZ3JvdXAiLCJzZWFyY2hhYmxlIiwibm93IiwiaW5saW5lSGVscFRleHQiLCJpc1Byb2R1Y3Rpb24iLCJzb3J0YWJsZSIsImdldEZpZWxkRGlzcGxheVZhbHVlIiwiZmllbGRfdmFsdWUiLCJodG1sIiwibW9tZW50IiwiZm9ybWF0IiwiY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5IiwiZmllbGRfdHlwZSIsInB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyIsIm9wZXJhdGlvbnMiLCJidWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJidWlsdGluSXRlbSIsImlzX2NoZWNrX29ubHkiLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uIiwiYmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJnZXRRdWFydGVyU3RhcnRNb250aCIsIm1vbnRoIiwiZ2V0TW9udGgiLCJnZXRMYXN0UXVhcnRlckZpcnN0RGF5IiwieWVhciIsImdldEZ1bGxZZWFyIiwiZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSIsImdldE1vbnRoRGF5cyIsImRheXMiLCJlbmREYXRlIiwibWlsbGlzZWNvbmQiLCJzdGFydERhdGUiLCJnZXRMYXN0TW9udGhGaXJzdERheSIsImN1cnJlbnRNb250aCIsImN1cnJlbnRZZWFyIiwiZW5kVmFsdWUiLCJmaXJzdERheSIsImxhc3REYXkiLCJsYXN0TW9uZGF5IiwibGFzdE1vbnRoRmluYWxEYXkiLCJsYXN0TW9udGhGaXJzdERheSIsImxhc3RRdWFydGVyRW5kRGF5IiwibGFzdFF1YXJ0ZXJTdGFydERheSIsImxhc3RTdW5kYXkiLCJsYXN0XzEyMF9kYXlzIiwibGFzdF8zMF9kYXlzIiwibGFzdF82MF9kYXlzIiwibGFzdF83X2RheXMiLCJsYXN0XzkwX2RheXMiLCJtaW51c0RheSIsIm1vbmRheSIsIm5leHRNb25kYXkiLCJuZXh0TW9udGhGaW5hbERheSIsIm5leHRNb250aEZpcnN0RGF5IiwibmV4dFF1YXJ0ZXJFbmREYXkiLCJuZXh0UXVhcnRlclN0YXJ0RGF5IiwibmV4dFN1bmRheSIsIm5leHRZZWFyIiwibmV4dF8xMjBfZGF5cyIsIm5leHRfMzBfZGF5cyIsIm5leHRfNjBfZGF5cyIsIm5leHRfN19kYXlzIiwibmV4dF85MF9kYXlzIiwicHJldmlvdXNZZWFyIiwic3RhcnRWYWx1ZSIsInN0ckVuZERheSIsInN0ckZpcnN0RGF5Iiwic3RyTGFzdERheSIsInN0ck1vbmRheSIsInN0clN0YXJ0RGF5Iiwic3RyU3VuZGF5Iiwic3RyVG9kYXkiLCJzdHJUb21vcnJvdyIsInN0clllc3RkYXkiLCJzdW5kYXkiLCJ0aGlzUXVhcnRlckVuZERheSIsInRoaXNRdWFydGVyU3RhcnREYXkiLCJ0b21vcnJvdyIsIndlZWsiLCJ5ZXN0ZGF5IiwiZ2V0RGF5IiwidCIsImZ2Iiwic2V0SG91cnMiLCJnZXRIb3VycyIsImdldFRpbWV6b25lT2Zmc2V0IiwiZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uIiwiZ2V0RmllbGRPcGVyYXRpb24iLCJvcHRpb25hbHMiLCJlcXVhbCIsInVuZXF1YWwiLCJsZXNzX3RoYW4iLCJncmVhdGVyX3RoYW4iLCJsZXNzX29yX2VxdWFsIiwiZ3JlYXRlcl9vcl9lcXVhbCIsIm5vdF9jb250YWluIiwic3RhcnRzX3dpdGgiLCJiZXR3ZWVuIiwiZ2V0T2JqZWN0RmllbGRzTmFtZSIsImZpZWxkc05hbWUiLCJzb3J0X25vIiwiY2xlYW5UcmlnZ2VyIiwiaW5pdFRyaWdnZXIiLCJfdHJpZ2dlcl9ob29rcyIsInJlZjUiLCJ0b2RvV3JhcHBlciIsImFwcGx5IiwiYXJndW1lbnRzIiwid2hlbiIsImJlZm9yZSIsImluc2VydCIsInJlbW92ZSIsImFmdGVyIiwiX2hvb2siLCJ0cmlnZ2VyX25hbWUiLCJfdHJpZ2dlcl9ob29rIiwiZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCIsImZpbmRfcGVybWlzc2lvbl9vYmplY3QiLCJpbnRlcnNlY3Rpb25QbHVzIiwidW5pb25QZXJtaXNzaW9uT2JqZWN0cyIsInVuaW9uUGx1cyIsImdldE9iamVjdFBlcm1pc3Npb25zIiwiZ2V0UmVjb3JkUGVybWlzc2lvbnMiLCJpc093bmVyIiwib2JqZWN0X2ZpZWxkc19rZXlzIiwicmVjb3JkX2NvbXBhbnlfaWQiLCJyZWNvcmRfY29tcGFueV9pZHMiLCJzZWxlY3QiLCJ1c2VyX2NvbXBhbnlfaWRzIiwicGFyZW50Iiwia2V5cyIsImludGVyc2VjdGlvbiIsImdldE9iamVjdFJlY29yZCIsImpvaW4iLCJyZWNvcmRfcGVybWlzc2lvbnMiLCJvd25lciIsIm4iLCJsb2NrZWQiLCJnZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zIiwiY3VycmVudE9iamVjdE5hbWUiLCJyZWxhdGVkTGlzdEl0ZW0iLCJjdXJyZW50UmVjb3JkIiwiaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlIiwibWFzdGVyQWxsb3ciLCJtYXN0ZXJSZWNvcmRQZXJtIiwicmVsYXRlZE9iamVjdFBlcm1pc3Npb25zIiwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QiLCJnZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIl9pIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwic3BhY2VVc2VyIiwib2JqZWN0cyIsImFzc2lnbmVkX2FwcHMiLCJwcm9maWxlIiwidXNlcnMiLCJwZXJtaXNzaW9uX3NldF9pZCIsImNyZWF0ZWQiLCJtb2RpZmllZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZF9ieSIsImdldEFzc2lnbmVkQXBwcyIsImJpbmQiLCJhc3NpZ25lZF9tZW51cyIsImdldEFzc2lnbmVkTWVudXMiLCJ1c2VyX3Blcm1pc3Npb25fc2V0cyIsImFycmF5Iiwib3RoZXIiLCJhcHBzIiwicHNldEJhc2UiLCJ1c2VyUHJvZmlsZSIsInBzZXQiLCJ1bmlxIiwiYWJvdXRNZW51IiwiYWRtaW5NZW51cyIsImFsbE1lbnVzIiwiY3VycmVudFBzZXROYW1lcyIsIm1lbnVzIiwib3RoZXJNZW51QXBwcyIsIm90aGVyTWVudXMiLCJhZG1pbl9tZW51cyIsImZsYXR0ZW4iLCJtZW51IiwicHNldHNNZW51IiwicGVybWlzc2lvbl9zZXRzIiwicGVybWlzc2lvbl9vYmplY3RzIiwiaXNOdWxsIiwicGVybWlzc2lvbl9zZXRfaWRzIiwicG9zIiwib3BzIiwib3BzX2tleSIsImN1cnJlbnRQc2V0IiwidGVtcE9wcyIsInJlcGVhdEluZGV4IiwicmVwZWF0UG8iLCJvcHNldEFkbWluIiwib3BzZXRDdXN0b21lciIsIm9wc2V0R3Vlc3QiLCJvcHNldE1lbWJlciIsIm9wc2V0U3VwcGxpZXIiLCJvcHNldFVzZXIiLCJwb3NBZG1pbiIsInBvc0N1c3RvbWVyIiwicG9zR3Vlc3QiLCJwb3NNZW1iZXIiLCJwb3NTdXBwbGllciIsInBvc1VzZXIiLCJwcm9mIiwiZ3Vlc3QiLCJtZW1iZXIiLCJzdXBwbGllciIsImN1c3RvbWVyIiwiZGlzYWJsZWRfYWN0aW9ucyIsInVucmVhZGFibGVfZmllbGRzIiwidW5lZGl0YWJsZV9maWVsZHMiLCJjcmVhdG9yX2RiX3VybCIsIm9wbG9nX3VybCIsIk1PTkdPX1VSTF9DUkVBVE9SIiwiTU9OR09fT1BMT0dfVVJMX0NSRUFUT1IiLCJfQ1JFQVRPUl9EQVRBU09VUkNFIiwiX2RyaXZlciIsIk1vbmdvSW50ZXJuYWxzIiwiUmVtb3RlQ29sbGVjdGlvbkRyaXZlciIsIm9wbG9nVXJsIiwiY29sbGVjdGlvbl9rZXkiLCJuZXdDb2xsZWN0aW9uIiwiU01TUXVldWUiLCJzdGVlZG9zRmlsdGVycyIsImFjdGlvbl9uYW1lIiwiZXhlY3V0ZUFjdGlvbiIsIml0ZW1fZWxlbWVudCIsIm1vcmVBcmdzIiwidG9kb0FyZ3MiLCJPYmplY3RHcmlkIiwiZ2V0RmlsdGVycyIsIndvcmRfdGVtcGxhdGUiLCJmb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5IiwiYWJzb2x1dGVVcmwiLCJ3aW5kb3ciLCJvcGVuIiwib2RhdGEiLCJwcm90b3R5cGUiLCJzbGljZSIsImNvbmNhdCIsIndhcm5pbmciLCJpbml0aWFsVmFsdWVzIiwic2VsZWN0ZWRSb3dzIiwiZ3JpZFJlZiIsImN1cnJlbnQiLCJhcGkiLCJnZXRTZWxlY3RlZFJvd3MiLCJGb3JtTWFuYWdlciIsImdldEluaXRpYWxWYWx1ZXMiLCJTdGVlZG9zVUkiLCJzaG93TW9kYWwiLCJzdG9yZXMiLCJDb21wb25lbnRSZWdpc3RyeSIsImNvbXBvbmVudHMiLCJPYmplY3RGb3JtIiwib2JqZWN0QXBpTmFtZSIsInRpdGxlIiwiYWZ0ZXJJbnNlcnQiLCJzZXRUaW1lb3V0IiwiYXBwX2lkIiwiRmxvd1JvdXRlciIsImdvIiwiaWNvblBhdGgiLCJzZXQiLCJkZWZlciIsIiQiLCJjbGljayIsImhyZWYiLCJnZXRPYmplY3RVcmwiLCJyZWRpcmVjdCIsInJlY29yZElkIiwiYWZ0ZXJVcGRhdGUiLCJyb3V0ZSIsImVuZHNXaXRoIiwicmVsb2FkIiwicmVmcmVzaFNlcnZlclNpZGVTdG9yZSIsInJlY29yZF90aXRsZSIsImNhbGxfYmFjayIsImJlZm9yZUhvb2siLCJ0ZXh0IiwicnVuSG9vayIsInN3YWwiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY29uZmlybUJ1dHRvblRleHQiLCJjYW5jZWxCdXR0b25UZXh0IiwicHJldmlvdXNEb2MiLCJnZXRQcmV2aW91c0RvYyIsIl9lIiwiYXBwaWQiLCJkeERhdGFHcmlkSW5zdGFuY2UiLCJncmlkQ29udGFpbmVyIiwiZ3JpZE9iamVjdE5hbWVDbGFzcyIsImluZm8iLCJpc09wZW5lclJlbW92ZSIsInJlY29yZFVybCIsInRlbXBOYXZSZW1vdmVkIiwic3VjY2VzcyIsIm9wZW5lciIsImR4VHJlZUxpc3QiLCJkeERhdGFHcmlkIiwicmVmcmVzaCIsIlRlbXBsYXRlIiwiY3JlYXRvcl9ncmlkIiwicmVtb3ZlVGVtcE5hdkl0ZW0iLCJjbG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsS0FBQ0EsRUFBRCxHQUFNLEVBQU47O0FBQ0EsSUFBSSxPQUFBQyxPQUFBLG9CQUFBQSxZQUFBLElBQUo7QUFDQyxPQUFDQSxPQUFELEdBQVcsRUFBWDtBQ0VBOztBREREQSxRQUFRQyxPQUFSLEdBQWtCLEVBQWxCO0FBQ0FELFFBQVFFLFdBQVIsR0FBc0IsRUFBdEI7QUFDQUYsUUFBUUcsS0FBUixHQUFnQixFQUFoQjtBQUNBSCxRQUFRSSxJQUFSLEdBQWUsRUFBZjtBQUNBSixRQUFRSyxVQUFSLEdBQXFCLEVBQXJCO0FBQ0FMLFFBQVFNLE9BQVIsR0FBa0IsRUFBbEI7QUFDQU4sUUFBUU8sSUFBUixHQUFlLEVBQWY7QUFDQVAsUUFBUVEsYUFBUixHQUF3QixFQUF4QixDOzs7Ozs7Ozs7Ozs7QUVWQSxJQUFBQyxVQUFBLEVBQUFDLGVBQUEsRUFBQUMsTUFBQSxFQUFBQyxDQUFBLEVBQUFDLFNBQUEsRUFBQUMsUUFBQSxFQUFBQyxhQUFBLEVBQUFDLElBQUEsRUFBQUMsUUFBQSxFQUFBQyxXQUFBOztBQUFBO0FBQ0MsTUFBR0MsUUFBUUMsR0FBUixDQUFZQyxnQkFBWixLQUFn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T0E7QUFBeEIsYUFBcEQsQ0N5Q0s7QUQvRk4sWUN1Qkk7QUE2RUQ7QUQ5R04sUUNzQkc7QUQxSEo7QUFBQSxHQUZEO0FDd05BLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIkBkYiA9IHt9XG5pZiAhQ3JlYXRvcj9cblx0QENyZWF0b3IgPSB7fVxuQ3JlYXRvci5PYmplY3RzID0ge31cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fVxuQ3JlYXRvci5NZW51cyA9IFtdXG5DcmVhdG9yLkFwcHMgPSB7fVxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge31cbkNyZWF0b3IuUmVwb3J0cyA9IHt9XG5DcmVhdG9yLnN1YnMgPSB7fVxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge30iLCJ0aGlzLmRiID0ge307XG5cbmlmICh0eXBlb2YgQ3JlYXRvciA9PT0gXCJ1bmRlZmluZWRcIiB8fCBDcmVhdG9yID09PSBudWxsKSB7XG4gIHRoaXMuQ3JlYXRvciA9IHt9O1xufVxuXG5DcmVhdG9yLk9iamVjdHMgPSB7fTtcblxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9O1xuXG5DcmVhdG9yLk1lbnVzID0gW107XG5cbkNyZWF0b3IuQXBwcyA9IHt9O1xuXG5DcmVhdG9yLkRhc2hib2FyZHMgPSB7fTtcblxuQ3JlYXRvci5SZXBvcnRzID0ge307XG5cbkNyZWF0b3Iuc3VicyA9IHt9O1xuXG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fTtcbiIsInRyeVxuXHRpZiBwcm9jZXNzLmVudi5DUkVBVE9SX05PREVfRU5WID09ICdkZXZlbG9wbWVudCdcblx0XHRzdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKVxuXHRcdG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKVxuXHRcdG1vbGVjdWxlciA9IHJlcXVpcmUoXCJtb2xlY3VsZXJcIik7XG5cdFx0cGFja2FnZUxvYWRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0ZW9yLXBhY2thZ2UtbG9hZGVyJyk7XG5cdFx0QVBJU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtYXBpJyk7XG5cdFx0TWV0YWRhdGFTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRhZGF0YS1zZXJ2ZXInKTtcblx0XHRwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cblx0XHRjb25maWcgPSBvYmplY3RxbC5nZXRTdGVlZG9zQ29uZmlnKCk7XG5cdFx0c2V0dGluZ3MgPSB7XG5cdFx0XHRidWlsdF9pbl9wbHVnaW5zOiBbXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvd29ya2Zsb3dcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9hY2NvdW50c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0ZWVkb3MtcGx1Z2luLXNjaGVtYS1idWlsZGVyXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvcGx1Z2luLWVudGVycHJpc2VcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93b3JkLXRlbXBsYXRlXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvbWV0YWRhdGEtYXBpXCJdLFxuXHRcdFx0cGx1Z2luczogY29uZmlnLnBsdWdpbnNcblx0XHR9XG5cdFx0TWV0ZW9yLnN0YXJ0dXAgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuXHRcdFx0XHRcdG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG5cdFx0XHRcdFx0bm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuXHRcdFx0XHRcdG1ldGFkYXRhOiB7fSxcblx0XHRcdFx0XHR0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG5cdFx0XHRcdFx0Y2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG5cdFx0XHRcdFx0bG9nTGV2ZWw6IFwid2FyblwiLFxuXHRcdFx0XHRcdHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuXHRcdFx0XHRcdHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG5cdFx0XHRcdFx0bWF4Q2FsbExldmVsOiAxMDAsXG5cblx0XHRcdFx0XHRoZWFydGJlYXRJbnRlcnZhbDogMTAsXG5cdFx0XHRcdFx0aGVhcnRiZWF0VGltZW91dDogMzAsXG5cblx0XHRcdFx0XHRjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG5cblx0XHRcdFx0XHR0cmFja2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaHV0ZG93blRpbWVvdXQ6IDUwMDAsXG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG5cblx0XHRcdFx0XHRyZWdpc3RyeToge1xuXHRcdFx0XHRcdFx0c3RyYXRlZ3k6IFwiUm91bmRSb2JpblwiLFxuXHRcdFx0XHRcdFx0cHJlZmVyTG9jYWw6IHRydWVcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0YnVsa2hlYWQ6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0Y29uY3VycmVuY3k6IDEwLFxuXHRcdFx0XHRcdFx0bWF4UXVldWVTaXplOiAxMDAsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR2YWxpZGF0b3I6IHRydWUsXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBudWxsLFxuXG5cdFx0XHRcdFx0dHJhY2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRleHBvcnRlcjoge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIkNvbnNvbGVcIixcblx0XHRcdFx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdFx0XHRcdGxvZ2dlcjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcnM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHRcdFx0XHRnYXVnZVdpZHRoOiA0MFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdG1ldGFkYXRhU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiAnbWV0YWRhdGEtc2VydmVyJyxcblx0XHRcdFx0XHRtaXhpbnM6IFtNZXRhZGF0YVNlcnZpY2VdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0YXBpU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiBcImFwaVwiLFxuXHRcdFx0XHRcdG1peGluczogW0FQSVNlcnZpY2VdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRwb3J0OiBudWxsXG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0b2JqZWN0cWwuZ2V0U3RlZWRvc1NjaGVtYShicm9rZXIpO1xuXHRcdFx0XHRzdGFuZGFyZE9iamVjdHNEaXIgPSBvYmplY3RxbC5TdGFuZGFyZE9iamVjdHNQYXRoO1xuXHRcdFx0XHRzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiAnc3RhbmRhcmQtb2JqZWN0cycsXG5cdFx0XHRcdFx0bWl4aW5zOiBbcGFja2FnZUxvYWRlcl0sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHsgcGFja2FnZUluZm86IHtcblx0XHRcdFx0XHRcdHBhdGg6IHN0YW5kYXJkT2JqZWN0c0Rpcixcblx0XHRcdFx0XHR9IH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0TWV0ZW9yLndyYXBBc3luYygoY2IpLT5cblx0XHRcdFx0XHRicm9rZXIuc3RhcnQoKS50aGVuKCgpLT5cblx0XHRcdFx0XHRcdGlmICFicm9rZXIuc3RhcnRlZCBcblx0XHRcdFx0XHRcdFx0YnJva2VyLl9yZXN0YXJ0U2VydmljZShzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSk7XG5cblx0XHRcdFx0XHRcdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKFwiL1wiLCBhcGlTZXJ2aWNlLmV4cHJlc3MoKSk7XG5cdFx0XHRcdFx0XHQjIHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4gKCktPlxuXHRcdFx0XHRcdFx0IyBcdGNiKCk7XG5cblx0XHRcdFx0XHRcdGJyb2tlci53YWl0Rm9yU2VydmljZXMoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UubmFtZSkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0XHRcdFx0XHRzdGVlZG9zQ29yZS5pbml0KHNldHRpbmdzKS50aGVuICgpLT5cblx0XHRcdFx0XHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpKClcblx0XHRcdGNhdGNoIGV4XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixleClcbmNhdGNoIGVcblx0Y29uc29sZS5lcnJvcihcImVycm9yOlwiLGUpIiwidmFyIEFQSVNlcnZpY2UsIE1ldGFkYXRhU2VydmljZSwgY29uZmlnLCBlLCBtb2xlY3VsZXIsIG9iamVjdHFsLCBwYWNrYWdlTG9hZGVyLCBwYXRoLCBzZXR0aW5ncywgc3RlZWRvc0NvcmU7XG5cbnRyeSB7XG4gIGlmIChwcm9jZXNzLmVudi5DUkVBVE9SX05PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJyk7XG4gICAgb2JqZWN0cWwgPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpO1xuICAgIG1vbGVjdWxlciA9IHJlcXVpcmUoXCJtb2xlY3VsZXJcIik7XG4gICAgcGFja2FnZUxvYWRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0ZW9yLXBhY2thZ2UtbG9hZGVyJyk7XG4gICAgQVBJU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtYXBpJyk7XG4gICAgTWV0YWRhdGFTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRhZGF0YS1zZXJ2ZXInKTtcbiAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgIGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcbiAgICBzZXR0aW5ncyA9IHtcbiAgICAgIGJ1aWx0X2luX3BsdWdpbnM6IFtcIkBzdGVlZG9zL3dvcmtmbG93XCIsIFwiQHN0ZWVkb3MvYWNjb3VudHNcIiwgXCJAc3RlZWRvcy9zdGVlZG9zLXBsdWdpbi1zY2hlbWEtYnVpbGRlclwiLCBcIkBzdGVlZG9zL3BsdWdpbi1lbnRlcnByaXNlXCIsIFwiQHN0ZWVkb3Mvd29yZC10ZW1wbGF0ZVwiLCBcIkBzdGVlZG9zL21ldGFkYXRhLWFwaVwiXSxcbiAgICAgIHBsdWdpbnM6IGNvbmZpZy5wbHVnaW5zXG4gICAgfTtcbiAgICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcGlTZXJ2aWNlLCBicm9rZXIsIGV4LCBtZXRhZGF0YVNlcnZpY2UsIHN0YW5kYXJkT2JqZWN0c0Rpciwgc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2U7XG4gICAgICB0cnkge1xuICAgICAgICBicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuICAgICAgICAgIG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG4gICAgICAgICAgbm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuICAgICAgICAgIG1ldGFkYXRhOiB7fSxcbiAgICAgICAgICB0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG4gICAgICAgICAgY2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG4gICAgICAgICAgbG9nTGV2ZWw6IFwid2FyblwiLFxuICAgICAgICAgIHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuICAgICAgICAgIHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG4gICAgICAgICAgbWF4Q2FsbExldmVsOiAxMDAsXG4gICAgICAgICAgaGVhcnRiZWF0SW50ZXJ2YWw6IDEwLFxuICAgICAgICAgIGhlYXJ0YmVhdFRpbWVvdXQ6IDMwLFxuICAgICAgICAgIGNvbnRleHRQYXJhbXNDbG9uaW5nOiBmYWxzZSxcbiAgICAgICAgICB0cmFja2luZzoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBzaHV0ZG93blRpbWVvdXQ6IDUwMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG4gICAgICAgICAgcmVnaXN0cnk6IHtcbiAgICAgICAgICAgIHN0cmF0ZWd5OiBcIlJvdW5kUm9iaW5cIixcbiAgICAgICAgICAgIHByZWZlckxvY2FsOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWxraGVhZDoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBjb25jdXJyZW5jeTogMTAsXG4gICAgICAgICAgICBtYXhRdWV1ZVNpemU6IDEwMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdmFsaWRhdG9yOiB0cnVlLFxuICAgICAgICAgIGVycm9ySGFuZGxlcjogbnVsbCxcbiAgICAgICAgICB0cmFjaW5nOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGV4cG9ydGVyOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiQ29uc29sZVwiLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvbG9yczogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgICAgICAgIGdhdWdlV2lkdGg6IDQwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtZXRhZGF0YVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogJ21ldGFkYXRhLXNlcnZlcicsXG4gICAgICAgICAgbWl4aW5zOiBbTWV0YWRhdGFTZXJ2aWNlXSxcbiAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgfSk7XG4gICAgICAgIGFwaVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogXCJhcGlcIixcbiAgICAgICAgICBtaXhpbnM6IFtBUElTZXJ2aWNlXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcG9ydDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9iamVjdHFsLmdldFN0ZWVkb3NTY2hlbWEoYnJva2VyKTtcbiAgICAgICAgc3RhbmRhcmRPYmplY3RzRGlyID0gb2JqZWN0cWwuU3RhbmRhcmRPYmplY3RzUGF0aDtcbiAgICAgICAgc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogJ3N0YW5kYXJkLW9iamVjdHMnLFxuICAgICAgICAgIG1peGluczogW3BhY2thZ2VMb2FkZXJdLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbzoge1xuICAgICAgICAgICAgICBwYXRoOiBzdGFuZGFyZE9iamVjdHNEaXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihjYikge1xuICAgICAgICAgIHJldHVybiBicm9rZXIuc3RhcnQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFicm9rZXIuc3RhcnRlZCkge1xuICAgICAgICAgICAgICBicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKFwiL1wiLCBhcGlTZXJ2aWNlLmV4cHJlc3MoKSk7XG4gICAgICAgICAgICByZXR1cm4gYnJva2VyLndhaXRGb3JTZXJ2aWNlcyhzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZS5uYW1lKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gc3RlZWRvc0NvcmUuaW5pdChzZXR0aW5ncykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4ID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgZSA9IGVycm9yO1xuICBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGUpO1xufVxuIiwiQ3JlYXRvci5kZXBzID0ge1xuXHRhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcblx0b2JqZWN0OiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG59O1xuXG5DcmVhdG9yLl9URU1QTEFURSA9IHtcblx0QXBwczoge30sXG5cdE9iamVjdHM6IHt9XG59XG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcblxuIyBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMg5L6bc3RlZWRvcy1jbGnpobnnm67kvb/nlKhcbmlmIE1ldGVvci5pc1NlcnZlclxuXHRGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpXG5cdENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XG5cdFx0RmliZXIoKCktPlxuXHRcdFx0Q3JlYXRvci5sb2FkT2JqZWN0cyhvYmosIG9iamVjdF9uYW1lKVxuXHRcdCkucnVuKClcblxuQ3JlYXRvci5sb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gb2JqLm5hbWVcblxuXHRpZiAhb2JqLmxpc3Rfdmlld3Ncblx0XHRvYmoubGlzdF92aWV3cyA9IHt9XG5cblx0aWYgb2JqLnNwYWNlXG5cdFx0b2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iailcblx0aWYgb2JqZWN0X25hbWUgPT0gJ2Nmc19maWxlc19maWxlcmVjb3JkJ1xuXHRcdG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xuXHRcdG9iaiA9IF8uY2xvbmUob2JqKVxuXHRcdG9iai5uYW1lID0gb2JqZWN0X25hbWVcblx0XHRDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqXG5cblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iailcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG5cblx0Q3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcblx0cmV0dXJuIG9ialxuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxuXHRpZiBvYmplY3Quc3BhY2Vcblx0XHRyZXR1cm4gXCJjXyN7b2JqZWN0LnNwYWNlfV8je29iamVjdC5uYW1lfVwiXG5cdHJldHVybiBvYmplY3QubmFtZVxuXG5DcmVhdG9yLmdldE9iamVjdCA9IChvYmplY3RfbmFtZSwgc3BhY2VfaWQpLT5cblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxuXHRcdHJldHVybiA7XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG4jXHRpZiAhc3BhY2VfaWQgJiYgb2JqZWN0X25hbWVcbiNcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50ICYmICFvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjXycpXG4jXHRcdFx0c3BhY2VfaWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblxuXHRpZiBvYmplY3RfbmFtZVxuI1x0XHRpZiBzcGFjZV9pZFxuI1x0XHRcdG9iaiA9IENyZWF0b3Iub2JqZWN0c0J5TmFtZVtcImNfI3tzcGFjZV9pZH1fI3tvYmplY3RfbmFtZX1cIl1cbiNcdFx0XHRpZiBvYmpcbiNcdFx0XHRcdHJldHVybiBvYmpcbiNcbiNcdFx0b2JqID0gXy5maW5kIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG8pLT5cbiNcdFx0XHRcdHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT0gb2JqZWN0X25hbWVcbiNcdFx0aWYgb2JqXG4jXHRcdFx0cmV0dXJuIG9ialxuXG5cdFx0cmV0dXJuIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gKG9iamVjdF9pZCktPlxuXHRyZXR1cm4gXy5maW5kV2hlcmUoQ3JlYXRvci5vYmplY3RzQnlOYW1lLCB7X2lkOiBvYmplY3RfaWR9KVxuXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IChvYmplY3RfbmFtZSktPlxuXHRjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSlcblx0ZGVsZXRlIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0ZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkKS0+XG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRpZiBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW0NyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uX2NvbGxlY3Rpb25fbmFtZSB8fCBvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5yZW1vdmVDb2xsZWN0aW9uID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXVxuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRzcGFjZSA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpPy5kYj8uZmluZE9uZShzcGFjZUlkLHtmaWVsZHM6e2FkbWluczoxfX0pXG5cdGlmIHNwYWNlPy5hZG1pbnNcblx0XHRyZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwXG5cblxuQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEgPSAoZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpLT5cblxuXHRpZiAhXy5pc1N0cmluZyhmb3JtdWxhcilcblx0XHRyZXR1cm4gZm9ybXVsYXJcblxuXHRpZiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmb3JtdWxhcilcblx0XHRyZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpXG5cblx0cmV0dXJuIGZvcm11bGFyXG5cbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGNvbnRleHQpLT5cblx0c2VsZWN0b3IgPSB7fVxuXHRfLmVhY2ggZmlsdGVycywgKGZpbHRlciktPlxuXHRcdGlmIGZpbHRlcj8ubGVuZ3RoID09IDNcblx0XHRcdG5hbWUgPSBmaWx0ZXJbMF1cblx0XHRcdGFjdGlvbiA9IGZpbHRlclsxXVxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpXG5cdFx0XHRzZWxlY3RvcltuYW1lXSA9IHt9XG5cdFx0XHRzZWxlY3RvcltuYW1lXVthY3Rpb25dID0gdmFsdWVcblx0IyBjb25zb2xlLmxvZyhcImV2YWx1YXRlRmlsdGVycy0tPnNlbGVjdG9yXCIsIHNlbGVjdG9yKVxuXHRyZXR1cm4gc2VsZWN0b3JcblxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gKHNwYWNlSWQpIC0+XG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXG5cbiMjI1xuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4jIyNcbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpLT5cblxuXHRpZiAhaWRfa2V5XG5cdFx0aWRfa2V5ID0gXCJfaWRcIlxuXG5cdGlmIGhpdF9maXJzdFxuXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcblx0XHR2YWx1ZXMgPSBkb2NzLmdldFByb3BlcnR5KGlkX2tleSlcblxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0XHRcdF9pbmRleCA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXHRcdFx0XHRcdGlmIF9pbmRleCA+IC0xXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSlcblx0ZWxzZVxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0cmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXG4jIyNcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuIyMjXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSAodmFsdWUxLCB2YWx1ZTIpIC0+XG5cdGlmIHRoaXMua2V5XG5cdFx0dmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XVxuXHRcdHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV1cblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKClcblx0aWYgdmFsdWUyIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcblx0aWYgdHlwZW9mIHZhbHVlMSBpcyBcIm51bWJlclwiIGFuZCB0eXBlb2YgdmFsdWUyIGlzIFwibnVtYmVyXCJcblx0XHRyZXR1cm4gdmFsdWUxIC0gdmFsdWUyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcblx0aXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PSBudWxsIG9yIHZhbHVlMSA9PSB1bmRlZmluZWRcblx0aXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PSBudWxsIG9yIHZhbHVlMiA9PSB1bmRlZmluZWRcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gLTFcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAwXG5cdGlmICFpc1ZhbHVlMUVtcHR5IGFuZCBpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIDFcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxuXHRyZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSB2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlXG5cblxuIyDor6Xlh73mlbDlj6rlnKjliJ3lp4vljJZPYmplY3Tml7bvvIzmiornm7jlhbPlr7nosaHnmoTorqHnrpfnu5Pmnpzkv53lrZjliLBPYmplY3TnmoRyZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3vvIzlkI7nu63lj6/ku6Xnm7TmjqXku45yZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3lj5blvpforqHnrpfnu5PmnpzogIzkuI3nlKjlho3mrKHosIPnlKjor6Xlh73mlbDmnaXorqHnrpdcbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRyZWxhdGVkX29iamVjdHMgPSBbXVxuXHQjIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXG5cdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGlmICFfb2JqZWN0XG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXHRcblx0cmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0XG5cdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XG5cdFx0cmVsYXRlZExpc3RNYXAgPSB7fVxuXHRcdF8uZWFjaCByZWxhdGVkTGlzdCwgKG9iak5hbWUpLT5cblx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqTmFtZVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtvYmpOYW1lLm9iamVjdE5hbWVdID0ge31cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fVxuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxuXHRcdFx0XHRpZiAocmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lIGFuZCByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0geyBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddID0geyBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCIgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0geyBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiIH1cblx0XHRfLmVhY2ggWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIChlbmFibGVPYmpOYW1lKS0+XG5cdFx0XHRpZiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHsgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXVxuXHRcdFx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxuXHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHsgb2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0cmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMgcmVsYXRlZExpc3RNYXBcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cblx0aWYgX29iamVjdC5lbmFibGVfZmlsZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJ9XG5cblx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcblx0XHRcdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcIm9iamVjdF9maWVsZHNcIlxuXHRcdFx0XHRcdCNUT0RPIOW+heebuOWFs+WIl+ihqOaUr+aMgeaOkuW6j+WQju+8jOWIoOmZpOatpOWIpOaWrVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWV9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkfVxuXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwidGFza3NcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ub3Rlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfZXZlbnRzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiZXZlbnRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIn1cblx0aWYgX29iamVjdC5lbmFibGVfYXBwcm92YWxzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfcHJvY2Vzc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcInByb2Nlc3NfaW5zdGFuY2VfaGlzdG9yeVwiLCBmb3JlaWduX2tleTogXCJ0YXJnZXRfb2JqZWN0XCJ9XG5cdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4Fcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblxuXHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSAodXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUXG5cdGVsc2Vcblx0XHRpZiAhKHVzZXJJZCBhbmQgc3BhY2VJZClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdHN1RmllbGRzID0ge25hbWU6IDEsIG1vYmlsZTogMSwgcG9zaXRpb246IDEsIGVtYWlsOiAxLCBjb21wYW55OiAxLCBvcmdhbml6YXRpb246IDEsIHNwYWNlOiAxLCBjb21wYW55X2lkOiAxLCBjb21wYW55X2lkczogMX1cblx0XHQjIGNoZWNrIGlmIHVzZXIgaW4gdGhlIHNwYWNlXG5cdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcblx0XHRpZiAhc3Vcblx0XHRcdHNwYWNlSWQgPSBudWxsXG5cblx0XHQjIGlmIHNwYWNlSWQgbm90IGV4aXN0cywgZ2V0IHRoZSBmaXJzdCBvbmUuXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdGlmIGlzVW5TYWZlTW9kZVxuXHRcdFx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXG5cdFx0XHRcdGlmICFzdVxuXHRcdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHRcdHNwYWNlSWQgPSBzdS5zcGFjZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0VVNFUl9DT05URVhUID0ge31cblx0XHRVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkXG5cdFx0VVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkXG5cdFx0VVNFUl9DT05URVhULnVzZXIgPSB7XG5cdFx0XHRfaWQ6IHVzZXJJZFxuXHRcdFx0bmFtZTogc3UubmFtZSxcblx0XHRcdG1vYmlsZTogc3UubW9iaWxlLFxuXHRcdFx0cG9zaXRpb246IHN1LnBvc2l0aW9uLFxuXHRcdFx0ZW1haWw6IHN1LmVtYWlsXG5cdFx0XHRjb21wYW55OiBzdS5jb21wYW55XG5cdFx0XHRjb21wYW55X2lkOiBzdS5jb21wYW55X2lkXG5cdFx0XHRjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcblx0XHR9XG5cdFx0c3BhY2VfdXNlcl9vcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpPy5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbilcblx0XHRpZiBzcGFjZV91c2VyX29yZ1xuXHRcdFx0VVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuXHRcdFx0XHRfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcblx0XHRcdFx0bmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcblx0XHRcdFx0ZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG5cdFx0XHR9XG5cdFx0cmV0dXJuIFVTRVJfQ09OVEVYVFxuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gKHVybCktPlxuXG5cdGlmIF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAodXJsPy5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpKVxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxuXHRcdHJldHVybiB1cmxcblxuXHRpZiB1cmxcblx0XHQjIHVybOW8gOWktOayoeaciVwiL1wi77yM6ZyA6KaB5re75YqgXCIvXCJcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybFxuXHRlbHNlXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVhcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gKHVzZXJJZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcblx0ZWxzZVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZDoxfX0pXG5cdHJldHVybiBzdS5jb21wYW55X2lkXG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSAodXNlcklkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxuXHRlbHNlXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkczoxfX0pXG5cdHJldHVybiBzdT8uY29tcGFueV9pZHNcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSAocG8pLT5cblx0aWYgcG8uYWxsb3dDcmVhdGVcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLmFsbG93RWRpdFxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8uYWxsb3dEZWxldGVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby52aWV3QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0cG8udmlld0FsbFJlY29yZHMgPSB0cnVlXG5cdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblx0cmV0dXJuIHBvXG5cbkNyZWF0b3IuZ2V0VGVtcGxhdGVTcGFjZUlkID0gKCktPlxuXHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8udGVtcGxhdGVTcGFjZUlkXG5cbkNyZWF0b3IuZ2V0Q2xvdWRBZG1pblNwYWNlSWQgPSAoKS0+XG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5jbG91ZEFkbWluU3BhY2VJZFxuXG5DcmVhdG9yLmlzVGVtcGxhdGVTcGFjZSA9IChzcGFjZUlkKS0+XG5cdGlmIHNwYWNlSWQgJiYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8udGVtcGxhdGVTcGFjZUlkID09IHNwYWNlSWRcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZSA9IChzcGFjZUlkKS0+XG5cdGlmIHNwYWNlSWQgJiYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWQgPT0gc3BhY2VJZFxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVJcblx0IiwidmFyIEZpYmVyO1xuXG5DcmVhdG9yLmRlcHMgPSB7XG4gIGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeSxcbiAgb2JqZWN0OiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG59O1xuXG5DcmVhdG9yLl9URU1QTEFURSA9IHtcbiAgQXBwczoge30sXG4gIE9iamVjdHM6IHt9XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGZpbHRlcnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgb3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIHJldHVybiBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgY3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbn0pO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG4gIENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5sb2FkT2JqZWN0cyhvYmosIG9iamVjdF9uYW1lKTtcbiAgICB9KS5ydW4oKTtcbiAgfTtcbn1cblxuQ3JlYXRvci5sb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqLm5hbWU7XG4gIH1cbiAgaWYgKCFvYmoubGlzdF92aWV3cykge1xuICAgIG9iai5saXN0X3ZpZXdzID0ge307XG4gIH1cbiAgaWYgKG9iai5zcGFjZSkge1xuICAgIG9iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmopO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSA9PT0gJ2Nmc19maWxlc19maWxlcmVjb3JkJykge1xuICAgIG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJztcbiAgICBvYmogPSBfLmNsb25lKG9iaik7XG4gICAgb2JqLm5hbWUgPSBvYmplY3RfbmFtZTtcbiAgICBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqO1xuICB9XG4gIENyZWF0b3IuY29udmVydE9iamVjdChvYmopO1xuICBuZXcgQ3JlYXRvci5PYmplY3Qob2JqKTtcbiAgQ3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICByZXR1cm4gb2JqO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3Quc3BhY2UpIHtcbiAgICByZXR1cm4gXCJjX1wiICsgb2JqZWN0LnNwYWNlICsgXCJfXCIgKyBvYmplY3QubmFtZTtcbiAgfVxuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmLCByZWYxO1xuICBpZiAoXy5pc0FycmF5KG9iamVjdF9uYW1lKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKChyZWYgPSBDcmVhdG9yLmRlcHMpICE9IG51bGwpIHtcbiAgICAgIGlmICgocmVmMSA9IHJlZi5vYmplY3QpICE9IG51bGwpIHtcbiAgICAgICAgcmVmMS5kZXBlbmQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IGZ1bmN0aW9uKG9iamVjdF9pZCkge1xuICByZXR1cm4gXy5maW5kV2hlcmUoQ3JlYXRvci5vYmplY3RzQnlOYW1lLCB7XG4gICAgX2lkOiBvYmplY3RfaWRcbiAgfSk7XG59O1xuXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKTtcbiAgZGVsZXRlIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbn07XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbKChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuX2NvbGxlY3Rpb25fbmFtZSA6IHZvaWQgMCkgfHwgb2JqZWN0X25hbWVdO1xuICB9XG59O1xuXG5DcmVhdG9yLnJlbW92ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlZiwgcmVmMSwgc3BhY2U7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHNwYWNlID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZGIpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgIGZpZWxkczoge1xuICAgICAgYWRtaW5zOiAxXG4gICAgfVxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgaWYgKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghXy5pc1N0cmluZyhmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gZm9ybXVsYXI7XG4gIH1cbiAgaWYgKENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFyO1xufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBjb250ZXh0KSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgc2VsZWN0b3IgPSB7fTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBhY3Rpb24sIG5hbWUsIHZhbHVlO1xuICAgIGlmICgoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMykge1xuICAgICAgbmFtZSA9IGZpbHRlclswXTtcbiAgICAgIGFjdGlvbiA9IGZpbHRlclsxXTtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KTtcbiAgICAgIHNlbGVjdG9yW25hbWVdID0ge307XG4gICAgICByZXR1cm4gc2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIHNwYWNlSWQgPT09ICdjb21tb24nO1xufTtcblxuXG4vKlxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4gKi9cblxuQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMgPSBmdW5jdGlvbihkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KSB7XG4gIHZhciB2YWx1ZXM7XG4gIGlmICghaWRfa2V5KSB7XG4gICAgaWRfa2V5ID0gXCJfaWRcIjtcbiAgfVxuICBpZiAoaGl0X2ZpcnN0KSB7XG4gICAgdmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpO1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHZhciBfaW5kZXg7XG4gICAgICBfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgICBpZiAoX2luZGV4ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9pbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgfSk7XG4gIH1cbn07XG5cblxuLypcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuICovXG5cbkNyZWF0b3Iuc29ydGluZ01ldGhvZCA9IGZ1bmN0aW9uKHZhbHVlMSwgdmFsdWUyKSB7XG4gIHZhciBpc1ZhbHVlMUVtcHR5LCBpc1ZhbHVlMkVtcHR5LCBsb2NhbGU7XG4gIGlmICh0aGlzLmtleSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV07XG4gICAgdmFsdWUyID0gdmFsdWUyW3RoaXMua2V5XTtcbiAgfVxuICBpZiAodmFsdWUxIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHZhbHVlMiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTIgPSB2YWx1ZTIuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUxID09PSBcIm51bWJlclwiICYmIHR5cGVvZiB2YWx1ZTIgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gdmFsdWUxIC0gdmFsdWUyO1xuICB9XG4gIGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT09IG51bGwgfHwgdmFsdWUxID09PSB2b2lkIDA7XG4gIGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT09IG51bGwgfHwgdmFsdWUyID09PSB2b2lkIDA7XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmICFpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBpZiAoIWlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKCk7XG4gIHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlKHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGUpO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TWFwLCByZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IFtdO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICByZWxhdGVkTGlzdE1hcCA9IHt9O1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqTmFtZSkge1xuICAgICAgaWYgKF8uaXNPYmplY3Qob2JqTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSAmJiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSkge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSkge1xuICAgICAgcmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIlxuICAgICAgfTtcbiAgICB9XG4gICAgXy5lYWNoKFsndGFza3MnLCAnbm90ZXMnLCAnZXZlbnRzJywgJ2FwcHJvdmFscyddLCBmdW5jdGlvbihlbmFibGVPYmpOYW1lKSB7XG4gICAgICBpZiAocmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdID0ge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBlbmFibGVPYmpOYW1lLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpO1xuICAgICAgaWYgKF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIChwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJlbGF0ZWRfb2JqZWN0cyA9IF8udmFsdWVzKHJlbGF0ZWRMaXN0TWFwKTtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9maWxlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09PSBcImxvb2t1cFwiICYmIHJlbGF0ZWRfZmllbGQucmVsYXRlZExpc3QpKSAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwib2JqZWN0X2ZpZWxkc1wiKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGlmIChfb2JqZWN0LmVuYWJsZV90YXNrcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInRhc2tzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfbm90ZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJub3Rlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2V2ZW50cykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImV2ZW50c1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2luc3RhbmNlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2FwcHJvdmFscykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImFwcHJvdmFsc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Byb2Nlc3MpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJwcm9jZXNzX2luc3RhbmNlX2hpc3RvcnlcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInRhcmdldF9vYmplY3RcIlxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpO1xuICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSkge1xuICB2YXIgVVNFUl9DT05URVhULCByZWYsIHNwYWNlX3VzZXJfb3JnLCBzdSwgc3VGaWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCEodXNlcklkICYmIHNwYWNlSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJ0aGUgcGFyYW1zIHVzZXJJZCBhbmQgc3BhY2VJZCBpcyByZXF1aXJlZCBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0VXNlckNvbnRleHRcIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3VGaWVsZHMgPSB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgbW9iaWxlOiAxLFxuICAgICAgcG9zaXRpb246IDEsXG4gICAgICBlbWFpbDogMSxcbiAgICAgIGNvbXBhbnk6IDEsXG4gICAgICBvcmdhbml6YXRpb246IDEsXG4gICAgICBzcGFjZTogMSxcbiAgICAgIGNvbXBhbnlfaWQ6IDEsXG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH07XG4gICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICB9KTtcbiAgICBpZiAoIXN1KSB7XG4gICAgICBzcGFjZUlkID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBpZiAoaXNVblNhZmVNb2RlKSB7XG4gICAgICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFzdSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHNwYWNlSWQgPSBzdS5zcGFjZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBVU0VSX0NPTlRFWFQgPSB7fTtcbiAgICBVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkO1xuICAgIFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZDtcbiAgICBVU0VSX0NPTlRFWFQudXNlciA9IHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgbmFtZTogc3UubmFtZSxcbiAgICAgIG1vYmlsZTogc3UubW9iaWxlLFxuICAgICAgcG9zaXRpb246IHN1LnBvc2l0aW9uLFxuICAgICAgZW1haWw6IHN1LmVtYWlsLFxuICAgICAgY29tcGFueTogc3UuY29tcGFueSxcbiAgICAgIGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWQsXG4gICAgICBjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcbiAgICB9O1xuICAgIHNwYWNlX3VzZXJfb3JnID0gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIikpICE9IG51bGwgPyByZWYuZmluZE9uZShzdS5vcmdhbml6YXRpb24pIDogdm9pZCAwO1xuICAgIGlmIChzcGFjZV91c2VyX29yZykge1xuICAgICAgVVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuICAgICAgICBfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcbiAgICAgICAgbmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcbiAgICAgICAgZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gVVNFUl9DT05URVhUO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gIGlmIChfLmlzRnVuY3Rpb24oU3RlZWRvcy5pc0NvcmRvdmEpICYmIFN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgKCh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSA6IHZvaWQgMCkgfHwgKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpIDogdm9pZCAwKSkpIHtcbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIGlmICh1cmwpIHtcbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZDogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdS5jb21wYW55X2lkO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1ICE9IG51bGwgPyBzdS5jb21wYW55X2lkcyA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zID0gZnVuY3Rpb24ocG8pIHtcbiAgaWYgKHBvLmFsbG93Q3JlYXRlKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dEZWxldGUpIHtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcG87XG59O1xuXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSO1xufVxuIiwiTWV0ZW9yLm1ldGhvZHNcblx0IyDnlKjmiLfojrflj5Zsb29rdXAg44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteeahOmAiemhueWAvFxuXHRcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogKG9wdGlvbnMpLT5cblx0XHRpZiBvcHRpb25zPy5wYXJhbXM/LnJlZmVyZW5jZV90b1xuXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKVxuXG5cdFx0XHRuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXG5cdFx0XHRxdWVyeSA9IHt9XG5cdFx0XHRpZiBvcHRpb25zLnBhcmFtcy5zcGFjZVxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cblx0XHRcdFx0c29ydCA9IG9wdGlvbnM/LnNvcnRcblxuXHRcdFx0XHRzZWxlY3RlZCA9IG9wdGlvbnM/LnNlbGVjdGVkIHx8IFtdXG5cblx0XHRcdFx0b3B0aW9uc19saW1pdCA9IG9wdGlvbnM/Lm9wdGlvbnNfbGltaXQgfHwgMTBcblxuXHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7JHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHR9XG5cblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319LCBzZWFyY2hUZXh0UXVlcnldXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX1dXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpXG5cdFx0XHRcdFx0cXVlcnkuX2lkID0geyRuaW46IHNlbGVjdGVkfVxuXG5cdFx0XHRcdGNvbGxlY3Rpb24gPSBvYmplY3QuZGJcblxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XG5cdFx0XHRcdFx0Xy5leHRlbmQgcXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnlcblxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiBvcHRpb25zX2xpbWl0fVxuXG5cdFx0XHRcdGlmIHNvcnQgJiYgXy5pc09iamVjdChzb3J0KVxuXHRcdFx0XHRcdHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnRcblxuXHRcdFx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRyZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpXG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gW11cblx0XHRcdFx0XHRcdF8uZWFjaCByZWNvcmRzLCAocmVjb3JkKS0+XG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaFxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlY29yZC5faWRcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzXG5cdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxuXHRcdHJldHVybiBbXSAiLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGUsIG5hbWVfZmllbGRfa2V5LCBvYmplY3QsIG9wdGlvbnNfbGltaXQsIHF1ZXJ5LCBxdWVyeV9vcHRpb25zLCByZWNvcmRzLCByZWYsIHJlZjEsIHJlc3VsdHMsIHNlYXJjaFRleHRRdWVyeSwgc2VsZWN0ZWQsIHNvcnQ7XG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYgPSBvcHRpb25zLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpO1xuICAgICAgbmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLnNwYWNlKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2U7XG4gICAgICAgIHNvcnQgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNvcnQgOiB2b2lkIDA7XG4gICAgICAgIHNlbGVjdGVkID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc2VsZWN0ZWQgOiB2b2lkIDApIHx8IFtdO1xuICAgICAgICBvcHRpb25zX2xpbWl0ID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMub3B0aW9uc19saW1pdCA6IHZvaWQgMCkgfHwgMTA7XG4gICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0ge1xuICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmMSA9IG9wdGlvbnMudmFsdWVzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIHNlYXJjaFRleHRRdWVyeVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgJG5pbjogc2VsZWN0ZWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbGxlY3Rpb24gPSBvYmplY3QuZGI7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlclF1ZXJ5KSB7XG4gICAgICAgICAgXy5leHRlbmQocXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXJ5X29wdGlvbnMgPSB7XG4gICAgICAgICAgbGltaXQ6IG9wdGlvbnNfbGltaXRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNvcnQgJiYgXy5pc09iamVjdChzb3J0KSkge1xuICAgICAgICAgIHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKTtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChyZWNvcmRzLCBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5faWRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvd29ya2Zsb3cvdmlldy86aW5zdGFuY2VJZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxuXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxuXHRcdG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWVcblx0XHRyZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWRcblx0XHRzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkXG5cblx0XHRjaGVjayBvYmplY3RfbmFtZSwgU3RyaW5nXG5cdFx0Y2hlY2sgcmVjb3JkX2lkLCBTdHJpbmdcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXG5cblx0XHRpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZFxuXHRcdHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ11cblx0XHR4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddXG5cblx0XHRyZWRpcmVjdF91cmwgPSBcIi9cIlxuXHRcdGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZClcblx0XHQjIC0g5oiR55qE6I2J56i/5bCx6Lez6L2s6Iez6I2J56i/566xXG5cdFx0IyAtIOaIkeeahOW+heWuoeaguOWwsei3s+i9rOiHs+W+heWuoeaguFxuXHRcdCMgLSDkuI3mmK/miJHnmoTnlLPor7fljZXliJnot7Povazoh7PmiZPljbDpobXpnaJcblx0XHQjIC0g5aaC55Sz6K+35Y2V5LiN5a2Y5Zyo5YiZ5o+Q56S655So5oi355Sz6K+35Y2V5bey5Yig6Zmk77yM5bm25LiU5pu05pawcmVjb3Jk55qE54q25oCB77yM5L2/55So5oi35Y+v5Lul6YeN5paw5Y+R6LW35a6h5om5XG5cdFx0aWYgaW5zXG5cdFx0XHRib3ggPSAnJ1xuXHRcdFx0c3BhY2VJZCA9IGlucy5zcGFjZVxuXHRcdFx0Zmxvd0lkID0gaW5zLmZsb3dcblxuXHRcdFx0aWYgKGlucy5pbmJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKSBvciAoaW5zLmNjX3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdGJveCA9ICdpbmJveCdcblx0XHRcdGVsc2UgaWYgaW5zLm91dGJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkXG5cdFx0XHRcdGJveCA9ICdvdXRib3gnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnZHJhZnQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxuXHRcdFx0XHRib3ggPSAnZHJhZnQnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAncGVuZGluZycgYW5kIChpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZCBvciBpbnMuYXBwbGljYW50IGlzIGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0Ym94ID0gJ3BlbmRpbmcnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnY29tcGxldGVkJyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcblx0XHRcdFx0Ym94ID0gJ2NvbXBsZXRlZCdcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDpqozor4Fsb2dpbiB1c2VyX2lk5a+56K+l5rWB56iL5pyJ566h55CG44CB6KeC5a+f55Sz6K+35Y2V55qE5p2D6ZmQXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHsgZmllbGRzOiB7IGFkbWluczogMSB9IH0pXG5cdFx0XHRcdGlmIHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgb3IgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJtb25pdG9yXCIpIG9yIHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdFx0Ym94ID0gJ21vbml0b3InXG5cdFx0XHR3b3JrZmxvd1VybCA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXM/LndvcmtmbG93Py51cmxcblx0XHRcdGlmIGJveFxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgXCJ3b3JrZmxvdy9zcGFjZS8je3NwYWNlSWR9LyN7Ym94fS8je2luc0lkfT9YLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgXCJ3b3JrZmxvdy9zcGFjZS8je3NwYWNlSWR9L3ByaW50LyN7aW5zSWR9P2JveD1tb25pdG9yJnByaW50X2lzX3Nob3dfdHJhY2VzPTEmcHJpbnRfaXNfc2hvd19hdHRhY2htZW50cz0xJlgtVXNlci1JZD0je3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSN7eF9hdXRoX3Rva2VufVwiXG5cblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogMjAwXG5cdFx0XHRcdGRhdGE6IHsgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmwgfVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXG5cdFx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRcdGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xuXHRcdFx0XHRcdCR1bnNldDoge1xuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZXNcIjogMSxcblx0XHRcdFx0XHRcdFwiaW5zdGFuY2Vfc3RhdGVcIjogMVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKVxuXG5cdGNhdGNoIGVcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XG5cdFx0fVxuXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL3dvcmtmbG93L3ZpZXcvOmluc3RhbmNlSWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYm94LCBjb2xsZWN0aW9uLCBjdXJyZW50X3VzZXJfaWQsIGN1cnJlbnRfdXNlcl9pbmZvLCBlLCBmbG93SWQsIGhhc2hEYXRhLCBpbnMsIGluc0lkLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbnMsIHJlY29yZF9pZCwgcmVkaXJlY3RfdXJsLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHNwYWNlLCBzcGFjZUlkLCBzcGFjZV9pZCwgd29ya2Zsb3dVcmwsIHhfYXV0aF90b2tlbiwgeF91c2VyX2lkO1xuICB0cnkge1xuICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgY3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkO1xuICAgIGhhc2hEYXRhID0gcmVxLmJvZHk7XG4gICAgb2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZTtcbiAgICByZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWQ7XG4gICAgc3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZDtcbiAgICBjaGVjayhvYmplY3RfbmFtZSwgU3RyaW5nKTtcbiAgICBjaGVjayhyZWNvcmRfaWQsIFN0cmluZyk7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgaW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWQ7XG4gICAgeF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICB4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddO1xuICAgIHJlZGlyZWN0X3VybCA9IFwiL1wiO1xuICAgIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCk7XG4gICAgaWYgKGlucykge1xuICAgICAgYm94ID0gJyc7XG4gICAgICBzcGFjZUlkID0gaW5zLnNwYWNlO1xuICAgICAgZmxvd0lkID0gaW5zLmZsb3c7XG4gICAgICBpZiAoKChyZWYgPSBpbnMuaW5ib3hfdXNlcnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkgfHwgKChyZWYxID0gaW5zLmNjX3VzZXJzKSAhPSBudWxsID8gcmVmMS5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSkge1xuICAgICAgICBib3ggPSAnaW5ib3gnO1xuICAgICAgfSBlbHNlIGlmICgocmVmMiA9IGlucy5vdXRib3hfdXNlcnMpICE9IG51bGwgPyByZWYyLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHtcbiAgICAgICAgYm94ID0gJ291dGJveCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2RyYWZ0JyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2RyYWZ0JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAncGVuZGluZycgJiYgKGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCB8fCBpbnMuYXBwbGljYW50ID09PSBjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgIGJveCA9ICdwZW5kaW5nJztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2NvbXBsZXRlZCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZCk7XG4gICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgYWRtaW5zOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgfHwgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJtb25pdG9yXCIpIHx8IHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgICAgYm94ID0gJ21vbml0b3InO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3b3JrZmxvd1VybCA9IChyZWYzID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjQgPSByZWYzLndvcmtmbG93KSAhPSBudWxsID8gcmVmNC51cmwgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoYm94KSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9cIiArIGJveCArIFwiL1wiICsgaW5zSWQgKyBcIj9YLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIChcIndvcmtmbG93L3NwYWNlL1wiICsgc3BhY2VJZCArIFwiL3ByaW50L1wiICsgaW5zSWQgKyBcIj9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfVxuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZWRpcmVjdF91cmw6IHJlZGlyZWN0X3VybFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpO1xuICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgY29sbGVjdGlvbi51cGRhdGUocmVjb3JkX2lkLCB7XG4gICAgICAgICAgJHVuc2V0OiB7XG4gICAgICAgICAgICBcImluc3RhbmNlc1wiOiAxLFxuICAgICAgICAgICAgXCJpbnN0YW5jZV9zdGF0ZVwiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3InLCAn55Sz6K+35Y2V5bey5Yig6ZmkJyk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IChvYmplY3RfbmFtZSwgY29sdW1ucykgLT5cblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKT8uX3NjaGVtYVxuXHRjb2x1bW5fbnVtID0gMFxuXHRpZiBfc2NoZW1hXG5cdFx0Xy5lYWNoIGNvbHVtbnMsIChmaWVsZF9uYW1lKSAtPlxuXHRcdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcblx0XHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcblx0XHRcdGlmIGlzX3dpZGVcblx0XHRcdFx0Y29sdW1uX251bSArPSAyXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMVxuXG5cdFx0aW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bVxuXHRcdHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnRcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkgLT5cblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hXG5cdGlmIF9zY2hlbWFcblx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxuXHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcblx0XHRyZXR1cm4gaXNfd2lkZVxuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSAtPlxuXHRzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucz8uc2V0dGluZ3M/LmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIn0pXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gXy5tYXAgY29sdW1ucywgKGNvbHVtbiktPlxuXHRcdGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dXG5cdFx0aWYgZmllbGQ/LnR5cGUgYW5kICFmaWVsZC5oaWRkZW5cblx0XHRcdHJldHVybiBjb2x1bW5cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdGNvbHVtbnMgPSBfLmNvbXBhY3QgY29sdW1uc1xuXHRpZiBzZXR0aW5nIGFuZCBzZXR0aW5nLnNldHRpbmdzXG5cdFx0c29ydCA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXT8uc29ydCB8fCBbXVxuXHRcdHNvcnQgPSBfLm1hcCBzb3J0LCAob3JkZXIpLT5cblx0XHRcdGtleSA9IG9yZGVyWzBdXG5cdFx0XHRpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpXG5cdFx0XHRvcmRlclswXSA9IGluZGV4ICsgMVxuXHRcdFx0cmV0dXJuIG9yZGVyXG5cdFx0cmV0dXJuIHNvcnRcblx0cmV0dXJuIFtdXG5cblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXVxuXHRleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl1cblx0ZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXVxuXHRpZiBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcblx0XHRleHRyYV9jb2x1bW5zID0gXy51bmlvbiBleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcblxuXHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzP1tvYmplY3RfbmFtZV0gPSBbXVxuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IChkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpLT5cblx0ZGVmYXVsdF9jb2x1bW5zID0gZGVmYXVsdF92aWV3Py5jb2x1bW5zXG5cdGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/Lm1vYmlsZV9jb2x1bW5zXG5cdHVubGVzcyBsaXN0X3ZpZXdcblx0XHRyZXR1cm5cblx0b2l0ZW0gPSBfLmNsb25lKGxpc3Rfdmlldylcblx0aWYgIV8uaGFzKG9pdGVtLCBcIm5hbWVcIilcblx0XHRvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWVcblx0aWYgIW9pdGVtLmNvbHVtbnNcblx0XHRpZiBkZWZhdWx0X2NvbHVtbnNcblx0XHRcdG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnNcblx0aWYgIW9pdGVtLmNvbHVtbnNcblx0XHRvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXVxuXHRpZiAhb2l0ZW0ubW9iaWxlX2NvbHVtbnNcblx0XHRpZiBkZWZhdWx0X21vYmlsZV9jb2x1bW5zXG5cdFx0XHRvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcblxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKVxuXHRcdFx0b2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpXG5cblxuXHRpZiAhb2l0ZW0uZmlsdGVyX3Njb3BlXG5cdFx0IyBsaXN0dmlld+inhuWbvueahGZpbHRlcl9zY29wZem7mOiupOWAvOaUueS4unNwYWNlICMxMzFcblx0XHRvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCJcblxuXHRpZiAhXy5oYXMob2l0ZW0sIFwiX2lkXCIpXG5cdFx0b2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWVcblx0ZWxzZVxuXHRcdG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWVcblxuXHRpZiBfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpXG5cdFx0b2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucylcblxuXHRfLmZvckVhY2ggb2l0ZW0uZmlsdGVycywgKGZpbHRlciwgX2luZGV4KS0+XG5cdFx0aWYgIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKVxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxuXHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxuXHRyZXR1cm4gb2l0ZW1cblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Q3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IChvYmplY3RfbmFtZSktPlxuXHRcdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdFx0cmV0dXJuXG5cdFx0cmVsYXRlZExpc3RPYmplY3RzID0ge31cblx0XHRyZWxhdGVkTGlzdE5hbWVzID0gW11cblx0XHRvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMgPSBbXTtcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgX29iamVjdFxuXHRcdFx0bGF5b3V0UmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRfbGlzdHM7XG5cdFx0XHRpZiAhXy5pc0VtcHR5IGxheW91dFJlbGF0ZWRMaXN0XG5cdFx0XHRcdF8uZWFjaCBsYXlvdXRSZWxhdGVkTGlzdCwgKGl0ZW0pLT5cblx0XHRcdFx0XHRyZU9iamVjdE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRcdHJlRmllbGROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMV1cblx0XHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlT2JqZWN0TmFtZSk/LmZpZWxkc1tyZUZpZWxkTmFtZV0/LndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogcmVPYmplY3ROYW1lXG5cdFx0XHRcdFx0XHRjb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzXG5cdFx0XHRcdFx0XHRtb2JpbGVfY29sdW1uczogaXRlbS5maWVsZF9uYW1lc1xuXHRcdFx0XHRcdFx0aXNfZmlsZTogcmVPYmplY3ROYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdFx0XHRcdGZpbHRlcnNGdW5jdGlvbjogaXRlbS5maWx0ZXJzXG5cdFx0XHRcdFx0XHRzb3J0OiBpdGVtLnNvcnRcblx0XHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVGaWVsZE5hbWVcblx0XHRcdFx0XHRcdGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlXG5cdFx0XHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdFx0XHRcdGxhYmVsOiBpdGVtLmxhYmVsXG5cdFx0XHRcdFx0XHRhY3Rpb25zOiBpdGVtLmJ1dHRvbnNcblx0XHRcdFx0XHRcdHZpc2libGVfb246IGl0ZW0udmlzaWJsZV9vblxuXHRcdFx0XHRcdFx0cGFnZV9zaXplOiBpdGVtLnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cy5wdXNoKHJlbGF0ZWQpXG5cdFx0XHRcdHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHM7XG5cdFx0XHRyZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Rcblx0XHRcdGlmICFfLmlzRW1wdHkgcmVsYXRlZExpc3Rcblx0XHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0LCAob2JqT3JOYW1lKS0+XG5cdFx0XHRcdFx0aWYgXy5pc09iamVjdCBvYmpPck5hbWVcblx0XHRcdFx0XHRcdHJlbGF0ZWQgPVxuXHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWVcblx0XHRcdFx0XHRcdFx0Y29sdW1uczogb2JqT3JOYW1lLmNvbHVtbnNcblx0XHRcdFx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IG9iak9yTmFtZS5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRcdFx0XHRpc19maWxlOiBvYmpPck5hbWUub2JqZWN0TmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRcdFx0XHRcdGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnNcblx0XHRcdFx0XHRcdFx0c29ydDogb2JqT3JOYW1lLnNvcnRcblx0XHRcdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiAnJ1xuXHRcdFx0XHRcdFx0XHRjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZVxuXHRcdFx0XHRcdFx0XHRsYWJlbDogb2JqT3JOYW1lLmxhYmVsXG5cdFx0XHRcdFx0XHRcdGFjdGlvbnM6IG9iak9yTmFtZS5hY3Rpb25zXG5cdFx0XHRcdFx0XHRcdHBhZ2Vfc2l6ZTogb2JqT3JOYW1lLnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWRcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWUub2JqZWN0TmFtZVxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyBvYmpPck5hbWVcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWVcblxuXHRcdG1hcExpc3QgPSB7fVxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIC0+XG5cdFx0XHRpZiAhcmVsYXRlZF9vYmplY3RfaXRlbT8ub2JqZWN0X25hbWVcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZVxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleVxuXHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkX29iamVjdF9pdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0XHR1bmxlc3MgcmVsYXRlZF9vYmplY3Rcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXG5cdFx0XHRjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSlcblx0XHRcdG1vYmlsZV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lLCB0cnVlKSB8fCBbXCJuYW1lXCJdXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxuXG5cdFx0XHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSlcblx0XHRcdHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpXG5cblx0XHRcdGlmIC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKVxuXHRcdFx0XHQjIG9iamVjdOexu+Wei+W4puWtkOWxnuaAp+eahHJlbGF0ZWRfZmllbGRfbmFtZeimgeWOu+aOieS4remXtOeahOe+juWFg+espuWPt++8jOWQpuWImeaYvuekuuS4jeWHuuWtl+auteWAvFxuXHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLyxcIlwiKVxuXHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lXG5cdFx0XHRcdGNvbHVtbnM6IGNvbHVtbnNcblx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0XHRcdGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdFx0aWYgcmVsYXRlZE9iamVjdFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmNvbHVtbnNcblx0XHRcdFx0XHRyZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnNcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRcdHJlbGF0ZWQubW9iaWxlX2NvbHVtbnMgPSByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3Quc29ydFxuXHRcdFx0XHRcdHJlbGF0ZWQuc29ydCA9IHJlbGF0ZWRPYmplY3Quc29ydFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvblxuXHRcdFx0XHRcdHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxuXHRcdFx0XHRcdHJlbGF0ZWQuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QgPSByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubGFiZWxcblx0XHRcdFx0XHRyZWxhdGVkLmxhYmVsID0gcmVsYXRlZE9iamVjdC5sYWJlbFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdHJlbGF0ZWQucGFnZV9zaXplID0gcmVsYXRlZE9iamVjdC5wYWdlX3NpemVcblx0XHRcdFx0ZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXG5cdFx0XHRtYXBMaXN0W3JlbGF0ZWQub2JqZWN0X25hbWVdID0gcmVsYXRlZFxuXG5cblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF8udmFsdWVzKHJlbGF0ZWRMaXN0T2JqZWN0cyksIFwib2JqZWN0X25hbWVcIilcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0XHR1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzXG5cdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0T2JqZWN0cywgKHYsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIC0+XG5cdFx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxuXHRcdFx0YWxsb3dSZWFkID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5hbGxvd1JlYWRcblx0XHRcdGlmIGlzQWN0aXZlICYmIGFsbG93UmVhZFxuXHRcdFx0XHRtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdlxuXG5cdFx0bGlzdCA9IFtdXG5cdFx0aWYgXy5pc0VtcHR5IHJlbGF0ZWRMaXN0TmFtZXNcblx0XHRcdGxpc3QgPSAgXy52YWx1ZXMgbWFwTGlzdFxuXHRcdGVsc2Vcblx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdE5hbWVzLCAob2JqZWN0TmFtZSkgLT5cblx0XHRcdFx0aWYgbWFwTGlzdFtvYmplY3ROYW1lXVxuXHRcdFx0XHRcdGxpc3QucHVzaCBtYXBMaXN0W29iamVjdE5hbWVdXG5cblx0XHRpZiBfLmhhcyhfb2JqZWN0LCAnYWxsb3dfcmVsYXRlZExpc3QnKVxuXHRcdFx0bGlzdCA9IF8uZmlsdGVyIGxpc3QsIChpdGVtKS0+XG5cdFx0XHRcdHJldHVybiBfLmluY2x1ZGUoX29iamVjdC5hbGxvd19yZWxhdGVkTGlzdCwgaXRlbS5vYmplY3RfbmFtZSlcblxuXHRcdHJldHVybiBsaXN0XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyA9IChvYmplY3RfbmFtZSktPlxuXHRyZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpXG5cbiMjIyBcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG4jIyNcbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYyktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuXG5cdGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKVxuXHR1bmxlc3MgbGlzdFZpZXdzPy5sZW5ndGhcblx0XHRyZXR1cm5cblx0bGlzdF92aWV3ID0gXy5maW5kV2hlcmUobGlzdFZpZXdzLHtcIl9pZFwiOmxpc3Rfdmlld19pZH0pXG5cdHVubGVzcyBsaXN0X3ZpZXdcblx0XHQjIOWmguaenOS4jemcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOWImem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvu+8jOWPjeS5i+i/lOWbnuepulxuXHRcdGlmIGV4YWNcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXVxuXHRyZXR1cm4gbGlzdF92aWV3XG5cbiPojrflj5ZsaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77mmK/lkKbmmK/mnIDov5Hmn6XnnIvop4blm75cbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0aWYgdHlwZW9mKGxpc3Rfdmlld19pZCkgPT0gXCJzdHJpbmdcIlxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmICFvYmplY3Rcblx0XHRcdHJldHVyblxuXHRcdGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3Mse19pZDogbGlzdF92aWV3X2lkfSlcblx0ZWxzZVxuXHRcdGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkXG5cdHJldHVybiBsaXN0Vmlldz8ubmFtZSA9PSBcInJlY2VudFwiXG5cblxuIyMjXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcblx06KeE5YiZ77yaXG5cdDEu5LyY5YWI5oqKY29sdW1uc+S4reeahG5hbWXlrZfmrrXmjpLlnKjnrKzkuIDkuKpcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXG4jIyNcbkNyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpLT5cblx0cmVzdWx0ID0gW11cblx0bWF4Um93cyA9IDIgXG5cdG1heENvdW50ID0gbWF4Um93cyAqIDJcblx0Y291bnQgPSAwXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRmaWVsZHMgPSBvYmplY3QuZmllbGRzXG5cdHVubGVzcyBvYmplY3Rcblx0XHRyZXR1cm4gY29sdW1uc1xuXHRuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cdGlzTmFtZUNvbHVtbiA9IChpdGVtKS0+XG5cdFx0aWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0cmV0dXJuIGl0ZW0uZmllbGQgPT0gbmFtZUtleVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBpdGVtID09IG5hbWVLZXlcblx0Z2V0RmllbGQgPSAoaXRlbSktPlxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdHJldHVybiBmaWVsZHNbaXRlbS5maWVsZF1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW1dXG5cdGlmIG5hbWVLZXlcblx0XHRuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kIChpdGVtKS0+XG5cdFx0XHRyZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pXG5cdGlmIG5hbWVDb2x1bW5cblx0XHRmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXG5cdFx0Y291bnQgKz0gaXRlbUNvdW50XG5cdFx0cmVzdWx0LnB1c2ggbmFtZUNvbHVtblxuXHRjb2x1bW5zLmZvckVhY2ggKGl0ZW0pLT5cblx0XHRmaWVsZCA9IGdldEZpZWxkKGl0ZW0pXG5cdFx0dW5sZXNzIGZpZWxkXG5cdFx0XHRyZXR1cm5cblx0XHRpdGVtQ291bnQgPSBpZiBmaWVsZC5pc193aWRlIHRoZW4gMiBlbHNlIDFcblx0XHRpZiBjb3VudCA8IG1heENvdW50IGFuZCByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgYW5kICFpc05hbWVDb2x1bW4oaXRlbSlcblx0XHRcdGNvdW50ICs9IGl0ZW1Db3VudFxuXHRcdFx0aWYgY291bnQgPD0gbWF4Q291bnRcblx0XHRcdFx0cmVzdWx0LnB1c2ggaXRlbVxuXHRcblx0cmV0dXJuIHJlc3VsdFxuXG4jIyNcbiAgICDojrflj5bpu5jorqTop4blm75cbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IChvYmplY3RfbmFtZSktPlxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0aWYgb2JqZWN0Py5saXN0X3ZpZXdzPy5kZWZhdWx0XG5cdFx0I1RPRE8g5q2k5Luj56CB5Y+q5piv5pqC5pe25YW85a655Lul5YmNY29kZeS4reWumuS5ieeahGRlZmF1bHTop4blm77vvIzlvoVjb2Rl5Lit55qEZGVmYXVsdOa4heeQhuWujOaIkOWQju+8jOmcgOimgeWIoOmZpOatpOS7o+eggVxuXHRcdGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3MuZGVmYXVsdFxuXHRlbHNlXG5cdFx0Xy5lYWNoIG9iamVjdD8ubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KS0+XG5cdFx0XHRpZiBsaXN0X3ZpZXcubmFtZSA9PSBcImFsbFwiIHx8IGtleSA9PSBcImFsbFwiXG5cdFx0XHRcdGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3XG5cdHJldHVybiBkZWZhdWx0VmlldztcblxuIyMjXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMgPSAob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucyktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBkZWZhdWx0Vmlldz8uY29sdW1uc1xuXHRpZiB1c2VfbW9iaWxlX2NvbHVtbnNcblx0XHRpZiBkZWZhdWx0Vmlldz8ubW9iaWxlX2NvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1uc1xuXHRcdGVsc2UgaWYgY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpXG5cdHJldHVybiBjb2x1bW5zXG5cbiMjI1xuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0cmV0dXJuIGRlZmF1bHRWaWV3Py5leHRyYV9jb2x1bW5zXG5cbiMjI1xuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IChvYmplY3RfbmFtZSktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXG5cdGlmIGRlZmF1bHRWaWV3XG5cdFx0aWYgZGVmYXVsdFZpZXcuc29ydFxuXHRcdFx0cmV0dXJuIGRlZmF1bHRWaWV3LnNvcnRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXVxuXG5cbiMjI1xuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XG4jIyNcbkNyZWF0b3IuaXNBbGxWaWV3ID0gKGxpc3RfdmlldyktPlxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwiYWxsXCJcblxuIyMjXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiMjI1xuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSAobGlzdF92aWV3KS0+XG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJyZWNlbnRcIlxuXG4jIyNcbiAgICDlsIZzb3J06L2s5o2i5Li6VGFidWxhcuaOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuIyMjXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSAoc29ydCwgdGFidWxhckNvbHVtbnMpLT5cblx0dGFidWxhcl9zb3J0ID0gW11cblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXG5cdFx0XHQjIOWFvOWuueaXp+eahOaVsOaNruagvOW8j1tbXCJmaWVsZF9uYW1lXCIsIFwib3JkZXJcIl1dXG5cdFx0XHRpZiBpdGVtLmxlbmd0aCA9PSAxXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBcImFzY1wiXVxuXHRcdFx0ZWxzZSBpZiBpdGVtLmxlbmd0aCA9PSAyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBpdGVtWzFdXVxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgb3JkZXJdXG5cblx0cmV0dXJuIHRhYnVsYXJfc29ydFxuXG4jIyNcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuIyMjXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gKHNvcnQpLT5cblx0ZHhfc29ydCA9IFtdXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxuXHRcdGlmIF8uaXNBcnJheShpdGVtKVxuXHRcdFx0I+WFvOWuueaXp+agvOW8j++8mltbXCJmaWVsZF9uYW1lXCIsIFwib3JkZXJcIl1dXG5cdFx0XHRkeF9zb3J0LnB1c2goaXRlbSlcblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdCPmlrDmlbDmja7moLzlvI/vvJpbe2ZpZWxkX25hbWU6ICwgb3JkZXI6IH1dXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcblx0XHRcdGlmIGZpZWxkX25hbWUgJiYgb3JkZXJcblx0XHRcdFx0ZHhfc29ydC5wdXNoIFtmaWVsZF9uYW1lLCBvcmRlcl1cblxuXHRyZXR1cm4gZHhfc29ydFxuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIF9zY2hlbWEsIGNvbHVtbl9udW0sIGluaXRfd2lkdGhfcGVyY2VudCwgcmVmO1xuICBfc2NoZW1hID0gKHJlZiA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5fc2NoZW1hIDogdm9pZCAwO1xuICBjb2x1bW5fbnVtID0gMDtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgICAgdmFyIGZpZWxkLCBpc193aWRlLCByZWYxLCByZWYyO1xuICAgICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgICBpc193aWRlID0gKHJlZjEgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjIuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc193aWRlKSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW07XG4gICAgcmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSB7XG4gIHZhciBfc2NoZW1hLCBmaWVsZCwgaXNfd2lkZSwgcmVmLCByZWYxO1xuICBfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWE7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgaXNfd2lkZSA9IChyZWYgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIHJldHVybiBpc193aWRlO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgdmFyIG9iaiwgcmVmLCByZWYxLCByZWYyLCBzZXR0aW5nLCBzb3J0O1xuICBzZXR0aW5nID0gKHJlZiA9IENyZWF0b3IuQ29sbGVjdGlvbnMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5zZXR0aW5ncykgIT0gbnVsbCA/IHJlZjEuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IF8ubWFwKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgIHZhciBmaWVsZDtcbiAgICBmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXTtcbiAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSAmJiAhZmllbGQuaGlkZGVuKSB7XG4gICAgICByZXR1cm4gY29sdW1uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgfSk7XG4gIGNvbHVtbnMgPSBfLmNvbXBhY3QoY29sdW1ucyk7XG4gIGlmIChzZXR0aW5nICYmIHNldHRpbmcuc2V0dGluZ3MpIHtcbiAgICBzb3J0ID0gKChyZWYyID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gcmVmMi5zb3J0IDogdm9pZCAwKSB8fCBbXTtcbiAgICBzb3J0ID0gXy5tYXAoc29ydCwgZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgIHZhciBpbmRleCwga2V5O1xuICAgICAga2V5ID0gb3JkZXJbMF07XG4gICAgICBpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpO1xuICAgICAgb3JkZXJbMF0gPSBpbmRleCArIDE7XG4gICAgICByZXR1cm4gb3JkZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucywgZXh0cmFfY29sdW1ucywgb2JqZWN0LCBvcmRlciwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICBleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl07XG4gIGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl07XG4gIGlmIChkZWZhdWx0X2V4dHJhX2NvbHVtbnMpIHtcbiAgICBleHRyYV9jb2x1bW5zID0gXy51bmlvbihleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMpO1xuICB9XG4gIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW107XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gKHJlZiA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzKSAhPSBudWxsID8gcmVmW29iamVjdF9uYW1lXSA9IFtdIDogdm9pZCAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IGZ1bmN0aW9uKGRlZmF1bHRfdmlldywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSkge1xuICB2YXIgZGVmYXVsdF9jb2x1bW5zLCBkZWZhdWx0X21vYmlsZV9jb2x1bW5zLCBvaXRlbTtcbiAgZGVmYXVsdF9jb2x1bW5zID0gZGVmYXVsdF92aWV3ICE9IG51bGwgPyBkZWZhdWx0X3ZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldyAhPSBudWxsID8gZGVmYXVsdF92aWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIHJldHVybjtcbiAgfVxuICBvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KTtcbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpKSB7XG4gICAgb2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lO1xuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdO1xuICB9XG4gIGlmICghb2l0ZW0ubW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9tb2JpbGVfY29sdW1ucykge1xuICAgICAgb2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJyk7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uZmlsdGVyX3Njb3BlKSB7XG4gICAgb2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiO1xuICB9XG4gIGlmICghXy5oYXMob2l0ZW0sIFwiX2lkXCIpKSB7XG4gICAgb2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWU7XG4gIH0gZWxzZSB7XG4gICAgb2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZTtcbiAgfVxuICBpZiAoXy5pc1N0cmluZyhvaXRlbS5vcHRpb25zKSkge1xuICAgIG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpO1xuICB9XG4gIF8uZm9yRWFjaChvaXRlbS5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgIGlmICghXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2l0ZW07XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVsYXRlZExpc3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciBfb2JqZWN0LCBsYXlvdXRSZWxhdGVkTGlzdCwgbGlzdCwgbWFwTGlzdCwgb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TmFtZXMsIHJlbGF0ZWRMaXN0T2JqZWN0cywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgc3BhY2VJZCwgdW5yZWxhdGVkX29iamVjdHMsIHVzZXJJZDtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlbGF0ZWRMaXN0T2JqZWN0cyA9IHt9O1xuICAgIHJlbGF0ZWRMaXN0TmFtZXMgPSBbXTtcbiAgICBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMgPSBbXTtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICBsYXlvdXRSZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZF9saXN0cztcbiAgICAgIGlmICghXy5pc0VtcHR5KGxheW91dFJlbGF0ZWRMaXN0KSkge1xuICAgICAgICBfLmVhY2gobGF5b3V0UmVsYXRlZExpc3QsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICB2YXIgcmVGaWVsZE5hbWUsIHJlT2JqZWN0TmFtZSwgcmVmLCByZWYxLCByZWxhdGVkLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgICAgICByZU9iamVjdE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICByZUZpZWxkTmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlT2JqZWN0TmFtZSkpICE9IG51bGwgPyAocmVmMSA9IHJlZi5maWVsZHNbcmVGaWVsZE5hbWVdKSAhPSBudWxsID8gcmVmMS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICByZWxhdGVkID0ge1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlT2JqZWN0TmFtZSxcbiAgICAgICAgICAgIGNvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXMsXG4gICAgICAgICAgICBtb2JpbGVfY29sdW1uczogaXRlbS5maWVsZF9uYW1lcyxcbiAgICAgICAgICAgIGlzX2ZpbGU6IHJlT2JqZWN0TmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgICAgIGZpbHRlcnNGdW5jdGlvbjogaXRlbS5maWx0ZXJzLFxuICAgICAgICAgICAgc29ydDogaXRlbS5zb3J0LFxuICAgICAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiByZUZpZWxkTmFtZSxcbiAgICAgICAgICAgIGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlLFxuICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkLFxuICAgICAgICAgICAgbGFiZWw6IGl0ZW0ubGFiZWwsXG4gICAgICAgICAgICBhY3Rpb25zOiBpdGVtLmJ1dHRvbnMsXG4gICAgICAgICAgICB2aXNpYmxlX29uOiBpdGVtLnZpc2libGVfb24sXG4gICAgICAgICAgICBwYWdlX3NpemU6IGl0ZW0ucGFnZV9zaXplXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLnB1c2gocmVsYXRlZCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzO1xuICAgICAgfVxuICAgICAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICAgICAgaWYgKCFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqT3JOYW1lKSB7XG4gICAgICAgICAgdmFyIHJlbGF0ZWQ7XG4gICAgICAgICAgaWYgKF8uaXNPYmplY3Qob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lLFxuICAgICAgICAgICAgICBjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1ucyxcbiAgICAgICAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG9iak9yTmFtZS5tb2JpbGVfY29sdW1ucyxcbiAgICAgICAgICAgICAgaXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgICAgICAgIGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnMsXG4gICAgICAgICAgICAgIHNvcnQ6IG9iak9yTmFtZS5zb3J0LFxuICAgICAgICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6ICcnLFxuICAgICAgICAgICAgICBjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgbGFiZWw6IG9iak9yTmFtZS5sYWJlbCxcbiAgICAgICAgICAgICAgYWN0aW9uczogb2JqT3JOYW1lLmFjdGlvbnMsXG4gICAgICAgICAgICAgIHBhZ2Vfc2l6ZTogb2JqT3JOYW1lLnBhZ2Vfc2l6ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUub2JqZWN0TmFtZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE5hbWVzLnB1c2gob2JqT3JOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBtYXBMaXN0ID0ge307XG4gICAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfaXRlbSkge1xuICAgICAgdmFyIGNvbHVtbnMsIG1vYmlsZV9jb2x1bW5zLCBvcmRlciwgcmVsYXRlZCwgcmVsYXRlZE9iamVjdCwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgdGFidWxhcl9vcmRlciwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICBpZiAoIShyZWxhdGVkX29iamVjdF9pdGVtICE9IG51bGwgPyByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZTtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXk7XG4gICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICByZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFyZWxhdGVkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgY29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgbW9iaWxlX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRydWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpO1xuICAgICAgaWYgKC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKSkge1xuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLywgXCJcIik7XG4gICAgICB9XG4gICAgICByZWxhdGVkID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zLFxuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgaXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICB9O1xuICAgICAgcmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChyZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmNvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5zb3J0KSB7XG4gICAgICAgICAgcmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbikge1xuICAgICAgICAgIHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QpIHtcbiAgICAgICAgICByZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5sYWJlbCkge1xuICAgICAgICAgIHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZSkge1xuICAgICAgICAgIHJlbGF0ZWQucGFnZV9zaXplID0gcmVsYXRlZE9iamVjdC5wYWdlX3NpemU7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXBMaXN0W3JlbGF0ZWQub2JqZWN0X25hbWVdID0gcmVsYXRlZDtcbiAgICB9KTtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKTtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgdW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdE9iamVjdHMsIGZ1bmN0aW9uKHYsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWY7XG4gICAgICBpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMTtcbiAgICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgICAgaWYgKGlzQWN0aXZlICYmIGFsbG93UmVhZCkge1xuICAgICAgICByZXR1cm4gbWFwTGlzdFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHY7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbGlzdCA9IFtdO1xuICAgIGlmIChfLmlzRW1wdHkocmVsYXRlZExpc3ROYW1lcykpIHtcbiAgICAgIGxpc3QgPSBfLnZhbHVlcyhtYXBMaXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKHJlbGF0ZWRMaXN0TmFtZXMsIGZ1bmN0aW9uKG9iamVjdE5hbWUpIHtcbiAgICAgICAgaWYgKG1hcExpc3Rbb2JqZWN0TmFtZV0pIHtcbiAgICAgICAgICByZXR1cm4gbGlzdC5wdXNoKG1hcExpc3Rbb2JqZWN0TmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpKSB7XG4gICAgICBsaXN0ID0gXy5maWx0ZXIobGlzdCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gXy5pbmNsdWRlKF9vYmplY3QuYWxsb3dfcmVsYXRlZExpc3QsIGl0ZW0ub2JqZWN0X25hbWUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsaXN0O1xuICB9O1xufVxuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpO1xufTtcblxuXG4vKiBcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpIHtcbiAgdmFyIGxpc3RWaWV3cywgbGlzdF92aWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIGlmICghKGxpc3RWaWV3cyAhPSBudWxsID8gbGlzdFZpZXdzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdF92aWV3ID0gXy5maW5kV2hlcmUobGlzdFZpZXdzLCB7XG4gICAgXCJfaWRcIjogbGlzdF92aWV3X2lkXG4gIH0pO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIGlmIChleGFjKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxpc3Rfdmlldztcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIGxpc3RWaWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiBsaXN0X3ZpZXdfaWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cywge1xuICAgICAgX2lkOiBsaXN0X3ZpZXdfaWRcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0VmlldyA9IGxpc3Rfdmlld19pZDtcbiAgfVxuICByZXR1cm4gKGxpc3RWaWV3ICE9IG51bGwgPyBsaXN0Vmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDku45jb2x1bW5z5Y+C5pWw5Lit6L+H5ruk5Ye655So5LqO5omL5py656uv5pi+56S655qEY29sdW1uc1xuXHTop4TliJnvvJpcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxuXHQyLuacgOWkmuWPqui/lOWbnjTkuKrlrZfmrrVcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcbiAqL1xuXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIGNvdW50LCBmaWVsZCwgZmllbGRzLCBnZXRGaWVsZCwgaXNOYW1lQ29sdW1uLCBpdGVtQ291bnQsIG1heENvdW50LCBtYXhSb3dzLCBuYW1lQ29sdW1uLCBuYW1lS2V5LCBvYmplY3QsIHJlc3VsdDtcbiAgcmVzdWx0ID0gW107XG4gIG1heFJvd3MgPSAyO1xuICBtYXhDb3VudCA9IG1heFJvd3MgKiAyO1xuICBjb3VudCA9IDA7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gb2JqZWN0LmZpZWxkcztcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuICBuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICBpc05hbWVDb2x1bW4gPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHJldHVybiBpdGVtLmZpZWxkID09PSBuYW1lS2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXRlbSA9PT0gbmFtZUtleTtcbiAgICB9XG4gIH07XG4gIGdldEZpZWxkID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW0uZmllbGRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW1dO1xuICAgIH1cbiAgfTtcbiAgaWYgKG5hbWVLZXkpIHtcbiAgICBuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKG5hbWVDb2x1bW4pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pO1xuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgcmVzdWx0LnB1c2gobmFtZUNvbHVtbik7XG4gIH1cbiAgY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKGl0ZW0pO1xuICAgIGlmICghZmllbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbUNvdW50ID0gZmllbGQuaXNfd2lkZSA/IDIgOiAxO1xuICAgIGlmIChjb3VudCA8IG1heENvdW50ICYmIHJlc3VsdC5sZW5ndGggPCBtYXhDb3VudCAmJiAhaXNOYW1lQ29sdW1uKGl0ZW0pKSB7XG4gICAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgICBpZiAoY291bnQgPD0gbWF4Q291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0Vmlldywgb2JqZWN0LCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICB9XG4gIGlmIChvYmplY3QgIT0gbnVsbCA/IChyZWYgPSBvYmplY3QubGlzdF92aWV3cykgIT0gbnVsbCA/IHJlZltcImRlZmF1bHRcIl0gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICBkZWZhdWx0VmlldyA9IG9iamVjdC5saXN0X3ZpZXdzW1wiZGVmYXVsdFwiXTtcbiAgfSBlbHNlIHtcbiAgICBfLmVhY2gob2JqZWN0ICE9IG51bGwgPyBvYmplY3QubGlzdF92aWV3cyA6IHZvaWQgMCwgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcbiAgICAgIGlmIChsaXN0X3ZpZXcubmFtZSA9PT0gXCJhbGxcIiB8fCBrZXkgPT09IFwiYWxsXCIpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBkZWZhdWx0Vmlldztcbn07XG5cblxuLypcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucykge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKHVzZV9tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDApIHtcbiAgICAgIGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucztcbiAgICB9IGVsc2UgaWYgKGNvbHVtbnMpIHtcbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbHVtbnM7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5leHRyYV9jb2x1bW5zIDogdm9pZCAwO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBpZiAoZGVmYXVsdFZpZXcpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcuc29ydCkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3LnNvcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc0FsbFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJhbGxcIjtcbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuICovXG5cbkNyZWF0b3IuaXNSZWNlbnRWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSBmdW5jdGlvbihzb3J0LCB0YWJ1bGFyQ29sdW1ucykge1xuICB2YXIgdGFidWxhcl9zb3J0O1xuICB0YWJ1bGFyX3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgY29sdW1uX2luZGV4LCBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBpZiAoaXRlbS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpdGVtLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgaXRlbVsxXV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihmaWVsZF9uYW1lKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIG9yZGVyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFidWxhcl9zb3J0O1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9EWCA9IGZ1bmN0aW9uKHNvcnQpIHtcbiAgdmFyIGR4X3NvcnQ7XG4gIGR4X3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChpdGVtKTtcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICByZXR1cm4gZHhfc29ydC5wdXNoKFtmaWVsZF9uYW1lLCBvcmRlcl0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkeF9zb3J0O1xufTtcbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJylcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5zdGFydHVwICgpLT5cblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cblx0XHRfcmVnRXhNZXNzYWdlcy5wdXNoIHtleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wifVxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXG5cdFx0fSkiLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpO1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVnRXhNZXNzYWdlcztcbiAgICBfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW107XG4gICAgX3JlZ0V4TWVzc2FnZXMucHVzaCh7XG4gICAgICBleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIlxuICAgIH0pO1xuICAgIHJldHVybiBTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuICAgICAgcmVnRXg6IF9yZWdFeE1lc3NhZ2VzXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJ9XG5cdFx0U2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCIvLyDlm6DkuLptZXRlb3LnvJbor5Fjb2ZmZWVzY3JpcHTkvJrlr7zoh7RldmFs5Ye95pWw5oql6ZSZ77yM5omA5Lul5Y2V54us5YaZ5Zyo5LiA5LiqanPmlofku7bkuK3jgIJcbkNyZWF0b3IuZXZhbEluQ29udGV4dCA9IGZ1bmN0aW9uKGpzLCBjb250ZXh0KSB7XG4gICAgLy8jIFJldHVybiB0aGUgcmVzdWx0cyBvZiB0aGUgaW4tbGluZSBhbm9ueW1vdXMgZnVuY3Rpb24gd2UgLmNhbGwgd2l0aCB0aGUgcGFzc2VkIGNvbnRleHRcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7IFxuICAgIFx0cmV0dXJuIGV2YWwoanMpOyBcblx0fS5jYWxsKGNvbnRleHQpO1xufVxuXG5cbkNyZWF0b3IuZXZhbCA9IGZ1bmN0aW9uKGpzKXtcblx0dHJ5e1xuXHRcdHJldHVybiBldmFsKGpzKVxuXHR9Y2F0Y2ggKGUpe1xuXHRcdGNvbnNvbGUuZXJyb3IoZSwganMpO1xuXHR9XG59OyIsIlx0Z2V0T3B0aW9uID0gKG9wdGlvbiktPlxuXHRcdGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIilcblx0XHRpZiBmb28ubGVuZ3RoID4gMlxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdLCBjb2xvcjogZm9vWzJdfVxuXHRcdGVsc2UgaWYgZm9vLmxlbmd0aCA+IDFcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1sxXX1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMF19XG5cblx0Y29udmVydEZpZWxkID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCktPlxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiBzcGFjZUlkICYmIGZpZWxkLnR5cGUgPT0gJ3NlbGVjdCdcblx0XHRcdGNvZGUgPSBmaWVsZC5waWNrbGlzdCB8fCBcIiN7b2JqZWN0X25hbWV9LiN7ZmllbGRfbmFtZX1cIjtcblx0XHRcdGlmIGNvZGVcblx0XHRcdFx0cGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuXHRcdFx0XHRpZiBwaWNrbGlzdFxuXHRcdFx0XHRcdG9wdGlvbnMgPSBbXTtcblx0XHRcdFx0XHRhbGxPcHRpb25zID0gW107XG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gQ3JlYXRvci5nZXRQaWNrTGlzdE9wdGlvbnMocGlja2xpc3QpXG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpPy5yZXZlcnNlKCk7XG5cdFx0XHRcdFx0Xy5lYWNoIHBpY2tsaXN0T3B0aW9ucywgKGl0ZW0pLT5cblx0XHRcdFx0XHRcdGxhYmVsID0gaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHRhbGxPcHRpb25zLnB1c2goe2xhYmVsOiBsYWJlbCwgdmFsdWU6IHZhbHVlLCBlbmFibGU6IGl0ZW0uZW5hYmxlLCBjb2xvcjogaXRlbS5jb2xvcn0pXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVuYWJsZVxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLnB1c2goe2xhYmVsOiBsYWJlbCwgdmFsdWU6IHZhbHVlLCBjb2xvcjogaXRlbS5jb2xvcn0pXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmRlZmF1bHRcblx0XHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWVcblx0XHRcdFx0XHRpZiBvcHRpb25zLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBvcHRpb25zXG5cdFx0XHRcdFx0aWYgYWxsT3B0aW9ucy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRmaWVsZC5hbGxPcHRpb25zID0gYWxsT3B0aW9uc1xuXHRcdHJldHVybiBmaWVsZDtcblxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3QgPSAob2JqZWN0LCBzcGFjZUlkKS0+XG5cdFx0aWYgIW9iamVjdFxuXHRcdFx0cmV0dXJuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxuXG5cdFx0XHRpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIpXG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXI/Ll90b2RvXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSB0cmlnZ2VyLnRvZG9cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxuXHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXG5cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXG5cdFx0XHRcdFx0I+WPquaciXVwZGF0ZeaXtu+8jCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyDmiY3mnInlgLxcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph4/vvIzlsKTlhbbmmK9Db2xsZWN0aW9uXG5cdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiXG5cdFx0XHRcdF90b2RvID0gdHJpZ2dlci50b2RvXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcblx0XHRcdFx0XHR0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKVxuXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24/Ll90b2RvXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSBhY3Rpb24/LnRvZG9cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2NvZGV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSlcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGJcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKGZ1bmN0aW9uKCl7I3tfdG9kb19mcm9tX2RifX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3JcblxuXHRcdFx0XHRfdmlzaWJsZSA9IGFjdGlvbj8uX3Zpc2libGVcblx0XHRcdFx0aWYgX3Zpc2libGVcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3Zpc2libGV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGVcblx0XHRlbHNlXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxuXHRcdFx0XHRfdG9kbyA9IGFjdGlvbj8udG9kb1xuXHRcdFx0XHRpZiBfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0YWN0aW9uLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKVxuXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy52aXNpYmxlXG5cblx0XHRcdFx0aWYgX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKVxuXHRcdFx0XHRcdGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKClcblxuXHRcdF8uZm9yRWFjaCBvYmplY3QuZmllbGRzLCAoZmllbGQsIGtleSktPlxuXG5cdFx0XHRmaWVsZCA9IGNvbnZlcnRGaWVsZChvYmplY3QubmFtZSwga2V5LCBmaWVsZCwgc3BhY2VJZCk7XG5cblx0XHRcdGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdFx0I+aUr+aMgVxcbuaIluiAheiLseaWh+mAl+WPt+WIhuWJsixcblx0XHRcdFx0XHRfLmZvckVhY2ggZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgKG9wdGlvbiktPlxuXHRcdFx0XHRcdFx0aWYgb3B0aW9uLmluZGV4T2YoXCIsXCIpXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpXG5cdFx0XHRcdFx0XHRcdF8uZm9yRWFjaCBvcHRpb25zLCAoX29wdGlvbiktPlxuXHRcdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xuXHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yXG5cblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucylcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxuXHRcdFx0XHRcdCPmlK/mjIHmlbDnu4TkuK3nm7TmjqXlrprkuYnmr4/kuKrpgInpobnnmoTnroDniYjmoLzlvI/lrZfnrKbkuLJcblx0XHRcdFx0XHRfLmZvckVhY2ggZmllbGQub3B0aW9ucywgKG9wdGlvbiktPlxuXHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhvcHRpb24pXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2gob3B0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xuXHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yXG5cblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiAhXy5pc0Z1bmN0aW9uKGZpZWxkLm9wdGlvbnMpICYmICFfLmlzQXJyYXkoZmllbGQub3B0aW9ucykgJiYgXy5pc09iamVjdChmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdF8uZWFjaCBmaWVsZC5vcHRpb25zLCAodiwgayktPlxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiB2LCB2YWx1ZToga31cblx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRvcHRpb25zID0gZmllbGQub3B0aW9uc1xuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNGdW5jdGlvbihvcHRpb25zKVxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9uc1xuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucylcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0cmVnRXggPSBmaWVsZC5yZWdFeFxuXHRcdFx0XHRpZiByZWdFeFxuXHRcdFx0XHRcdGZpZWxkLl9yZWdFeCA9IGZpZWxkLnJlZ0V4LnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVnRXggPSBmaWVsZC5fcmVnRXhcblx0XHRcdFx0aWYgcmVnRXhcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLnJlZ0V4ID0gQ3JlYXRvci5ldmFsKFwiKCN7cmVnRXh9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRtaW4gPSBmaWVsZC5taW5cblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKG1pbilcblx0XHRcdFx0XHRmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0bWluID0gZmllbGQuX21pblxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKG1pbilcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLm1pbiA9IENyZWF0b3IuZXZhbChcIigje21pbn0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG1heCA9IGZpZWxkLm1heFxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWF4KVxuXHRcdFx0XHRcdGZpZWxkLl9tYXggPSBtYXgudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtYXggPSBmaWVsZC5fbWF4XG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWF4KVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQubWF4ID0gQ3JlYXRvci5ldmFsKFwiKCN7bWF4fSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aWYgZmllbGQuYXV0b2Zvcm1cblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGVcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9IE9iamVjdCAmJiBfdHlwZSAhPSBTdHJpbmcgJiYgX3R5cGUgIT0gTnVtYmVyICYmIF90eXBlICE9IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSlcblx0XHRcdFx0XHRcdGZpZWxkLmF1dG9mb3JtLl90eXBlID0gX3R5cGUudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxuXHRcdFx0XHRcdF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGVcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKVxuXHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdGZpZWxkLmF1dG9mb3JtLnR5cGUgPSBDcmVhdG9yLmV2YWwoXCIoI3tfdHlwZX0pXCIpXG5cdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBmaWVsZCAtPiB0eXBlIGVycm9yXCIsIGZpZWxkLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0YmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gPSBvcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKVxuXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKVxuXG5cdFx0XHRcdGlmIGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihjcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKVxuXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gfHwgZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG9cblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0YmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvblxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWZlcmVuY2VfdG99KVwiKVxuXG5cdFx0XHRcdGlmIGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tjcmVhdGVGdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2JlZm9yZU9wZW5GdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlcnNGdW5jdGlvbn0pXCIpXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpXG5cdFx0XHRcdFx0ZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWVcblxuXHRcdFx0XHRpZiAhZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZGVmYXVsdFZhbHVlfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXHRcdFx0XG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKVxuXHRcdFx0XHRcdGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZClcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3IuZXZhbChcIigje2lzX2NvbXBhbnlfbGltaXRlZH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdF8uZm9yRWFjaCBvYmplY3QubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KSAtPlxuXHRcdFx0IyMjXG5cdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcblx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG5cdFx0XHQxLiDmlbTkuKpmaWx0ZXJz5Li6ZnVuY3Rpb246XG5cdFx0XHTlpoLvvJpcblx0XHRcdGZpbHRlcnM6ICgpLT5cblx0XHRcdFx0cmV0dXJuIFtbW1wib2JqZWN0X25hbWVcIixcIj1cIixcInByb2plY3RfaXNzdWVzXCJdLCdvcicsW1wib2JqZWN0X25hbWVcIixcIj1cIixcInRhc2tzXCJdXV1cblx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxuXHRcdFx05aaC77yaXG5cdFx0XHRmaWx0ZXJzOiBbW1wib2JqZWN0X25hbWVcIiwgXCI9XCIsICgpLT5cblx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuXHRcdFx0XV1cblx0XHRcdOaIllxuXHRcdFx0ZmlsdGVyczogW3tcblx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcblx0XHRcdFx0XCJvcGVyYXRpb25cIjogXCI9XCJcblx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XG5cdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuXHRcdFx0fV1cblx0XHRcdCMjI1xuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKVxuXHRcdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0XHRsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpXG5cdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKVxuXHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3IuZXZhbChcIigje2xpc3Rfdmlldy5fZmlsdGVyc30pXCIpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdF8uZm9yRWFjaCBsaXN0X3ZpZXcuZmlsdGVycywgKGZpbHRlciwgX2luZGV4KS0+XG5cdFx0XHRcdFx0aWYgXy5pc0FycmF5KGZpbHRlcilcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDMgYW5kIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIubGVuZ3RoID09IDMgYW5kIF8uaXNEYXRlKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOaYr0RhdGXnsbvlnovvvIzliJlmaWx0ZXJbMl3lgLzliLDliY3nq6/kvJroh6rliqjovazmiJDlrZfnrKbkuLLvvIzmoLzlvI/vvJpcIjIwMTgtMDMtMjlUMDM6NDM6MjEuNzg3WlwiXG5cdFx0XHRcdFx0XHRcdFx0IyDljIXmi6xncmlk5YiX6KGo6K+35rGC55qE5o6l5Y+j5Zyo5YaF55qE5omA5pyJT0RhdGHmjqXlj6PvvIxEYXRl57G75Z6L5a2X5q616YO95Lya5Lul5LiK6L+w5qC85byP6L+U5ZueXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzNdID0gXCJEQVRFXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkZVTkNUSU9OXCJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXJbMl19KVwiKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiREFURVwiXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gbmV3IERhdGUoZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc09iamVjdChmaWx0ZXIpXG5cdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0RhdGUoZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLl9pc19kYXRlID09IHRydWVcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXIudmFsdWUpXG5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdGlmIG9iamVjdC5mb3JtICYmICFfLmlzU3RyaW5nKG9iamVjdC5mb3JtKVxuXHRcdFx0XHRvYmplY3QuZm9ybSA9IEpTT04uc3RyaW5naWZ5IG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cblx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24odmFsKVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbCArICcnO1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0ZWxzZSBpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGlmIG9iamVjdC5mb3JtXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XG5cdFx0XHRcdFx0aWYgXy5pc1N0cmluZyh2YWwpICYmIHZhbC5zdGFydHNXaXRoKCdmdW5jdGlvbicpXG5cdFx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LnJlbGF0ZWRfbGlzdHMsIChyZWxhdGVkT2JqSW5mbyktPlxuXHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKVxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKVxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZmlsdGVyc19jb2RlXCIsIHZhbFxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZF9saXN0cywgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxuXHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKVxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKVxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZmlsdGVyc19jb2RlXCIsIHZhbFxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxuXHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKVxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKVxuXG5cdFx0cmV0dXJuIG9iamVjdFxuXG5cbiIsInZhciBjb252ZXJ0RmllbGQsIGdldE9wdGlvbjtcblxuZ2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIHZhciBmb287XG4gIGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIik7XG4gIGlmIChmb28ubGVuZ3RoID4gMikge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1sxXSxcbiAgICAgIGNvbG9yOiBmb29bMl1cbiAgICB9O1xuICB9IGVsc2UgaWYgKGZvby5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMF1cbiAgICB9O1xuICB9XG59O1xuXG5jb252ZXJ0RmllbGQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGQsIHNwYWNlSWQpIHtcbiAgdmFyIGFsbE9wdGlvbnMsIGNvZGUsIG9wdGlvbnMsIHBpY2tsaXN0LCBwaWNrbGlzdE9wdGlvbnMsIHJlZjtcbiAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiBzcGFjZUlkICYmIGZpZWxkLnR5cGUgPT09ICdzZWxlY3QnKSB7XG4gICAgY29kZSA9IGZpZWxkLnBpY2tsaXN0IHx8IChvYmplY3RfbmFtZSArIFwiLlwiICsgZmllbGRfbmFtZSk7XG4gICAgaWYgKGNvZGUpIHtcbiAgICAgIHBpY2tsaXN0ID0gQ3JlYXRvci5nZXRQaWNrbGlzdChjb2RlLCBzcGFjZUlkKTtcbiAgICAgIGlmIChwaWNrbGlzdCkge1xuICAgICAgICBvcHRpb25zID0gW107XG4gICAgICAgIGFsbE9wdGlvbnMgPSBbXTtcbiAgICAgICAgcGlja2xpc3RPcHRpb25zID0gQ3JlYXRvci5nZXRQaWNrTGlzdE9wdGlvbnMocGlja2xpc3QpO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSAocmVmID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKSA6IHZvaWQgMDtcbiAgICAgICAgXy5lYWNoKHBpY2tsaXN0T3B0aW9ucywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHZhciBsYWJlbCwgdmFsdWU7XG4gICAgICAgICAgbGFiZWwgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgdmFsdWUgPSBpdGVtLnZhbHVlIHx8IGl0ZW0ubmFtZTtcbiAgICAgICAgICBhbGxPcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZW5hYmxlOiBpdGVtLmVuYWJsZSxcbiAgICAgICAgICAgIGNvbG9yOiBpdGVtLmNvbG9yXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGl0ZW0uZW5hYmxlKSB7XG4gICAgICAgICAgICBvcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbVtcImRlZmF1bHRcIl0pIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsbE9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkLmFsbE9wdGlvbnMgPSBhbGxPcHRpb25zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmaWVsZDtcbn07XG5cbkNyZWF0b3IuY29udmVydE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCwgc3BhY2VJZCkge1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCBrZXkpIHtcbiAgICB2YXIgX3RvZG8sIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYjtcbiAgICBpZiAoKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpKSB7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyICE9IG51bGwgPyB0cmlnZ2VyLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikge1xuICAgICAgX3RvZG8gPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICByZXR1cm4gdHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGIsIF92aXNpYmxlLCBlcnJvcjtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pKSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24oKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3Zpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF92aXNpYmxlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kbywgX3Zpc2libGU7XG4gICAgICBfdG9kbyA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICBhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi52aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSkpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICB2YXIgX29wdGlvbnMsIF90eXBlLCBiZWZvcmVPcGVuRnVuY3Rpb24sIGNyZWF0ZUZ1bmN0aW9uLCBkZWZhdWx0VmFsdWUsIGVycm9yLCBmaWx0ZXJzRnVuY3Rpb24sIGlzX2NvbXBhbnlfbGltaXRlZCwgbWF4LCBtaW4sIG9wdGlvbnMsIG9wdGlvbnNGdW5jdGlvbiwgcmVmZXJlbmNlX3RvLCByZWdFeDtcbiAgICBmaWVsZCA9IGNvbnZlcnRGaWVsZChvYmplY3QubmFtZSwga2V5LCBmaWVsZCwgc3BhY2VJZCk7XG4gICAgaWYgKGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMuc3BsaXQoXCJcXG5cIiksIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIHZhciBvcHRpb25zO1xuICAgICAgICAgIGlmIChvcHRpb24uaW5kZXhPZihcIixcIikpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihfb3B0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICBpZiAoXy5pc1N0cmluZyhvcHRpb24pKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgXy5lYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiB2LFxuICAgICAgICAgIHZhbHVlOiBrXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgaWYgKG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0gZmllbGQuX29wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9ucyArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVnRXggPSBmaWVsZC5fcmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5yZWdFeCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVnRXggKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtaW4gPSBmaWVsZC5taW47XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1pbikpIHtcbiAgICAgICAgZmllbGQuX21pbiA9IG1pbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtaW4gPSBmaWVsZC5fbWluO1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWluKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1pbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWluICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgbWF4ID0gZmllbGQubWF4O1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihtYXgpKSB7XG4gICAgICAgIGZpZWxkLl9tYXggPSBtYXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWF4ID0gZmllbGQuX21heDtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG1heCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5tYXggPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG1heCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9PSBPYmplY3QgJiYgX3R5cGUgIT09IFN0cmluZyAmJiBfdHlwZSAhPT0gTnVtYmVyICYmIF90eXBlICE9PSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpKSB7XG4gICAgICAgICAgZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlO1xuICAgICAgICBpZiAoX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSkpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3R5cGUgKyBcIilcIik7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgIGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb247XG4gICAgICBiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiB8fCBmaWVsZC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICBpZiAob3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG9wdGlvbnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVmZXJlbmNlX3RvICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBjcmVhdGVGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgYmVmb3JlT3BlbkZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJzRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKCFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGRlZmF1bHRWYWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc1N0cmluZyhpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgaXNfY29tcGFueV9saW1pdGVkICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgXy5mb3JFYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuXG4gICAgLypcbiAgICBcdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcbiAgICBcdFx0XHTorqnov4fomZHlmajmlK/mjIHkuKTnp41mdW5jdGlvbuaWueW8j++8mlxuICAgIFx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuICAgIFx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdF1dXG4gICAgXHRcdFx05oiWXG4gICAgXHRcdFx0ZmlsdGVyczogW3tcbiAgICBcdFx0XHRcdFwiZmllbGRcIjogXCJvYmplY3RfbmFtZVwiXG4gICAgXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuICAgIFx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XG4gICAgXHRcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHR9XVxuICAgICAqL1xuICAgIGlmIChfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbGlzdF92aWV3Ll9maWx0ZXJzICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXy5mb3JFYWNoKGxpc3Rfdmlldy5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRGF0ZShmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkRBVEVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJGVU5DVElPTlwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyWzJdICsgXCIpXCIpO1xuICAgICAgICAgICAgICBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkRBVEVcIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRGF0ZShmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5faXNfZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLl9pc19kYXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXIudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmIChvYmplY3QuZm9ybSAmJiAhXy5pc1N0cmluZyhvYmplY3QuZm9ybSkpIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgIHJldHVybiB2YWwgKyAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdC5mb3JtKSB7XG4gICAgICBvYmplY3QuZm9ybSA9IEpTT04ucGFyc2Uob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRfbGlzdHMsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJmaWx0ZXJzX2NvZGVcIiwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZF9saXN0cywgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZmlsdGVyc19jb2RlXCIsIHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge31cblxuQ3JlYXRvci5Gb3JtdWxhci5QUkVGSVggPSBcIl9WQUxVRVNcIlxuXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IChwcmVmaXgsZmllbGRWYXJpYWJsZSktPlxuXHRyZWcgPSAvKFxce1tee31dKlxcfSkvZztcblxuXHRyZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UgcmVnLCAobSwgJDEpLT5cblx0XHRyZXR1cm4gcHJlZml4ICsgJDEucmVwbGFjZSgvXFx7XFxzKi8sXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LyxcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csXCJcXFwiXVtcXFwiXCIpO1xuXG5cdHJldHVybiByZXZcblxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSAoZm9ybXVsYV9zdHIpLT5cblx0aWYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbkNyZWF0b3IuRm9ybXVsYXIucnVuID0gKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucyktPlxuXHRpZiBmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKVxuXG5cdFx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnM/LmV4dGVuZClcblx0XHRcdGV4dGVuZCA9IHRydWVcblxuXHRcdF9WQUxVRVMgPSB7fVxuXHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVClcblx0XHRpZiBleHRlbmRcblx0XHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnM/LnVzZXJJZCwgb3B0aW9ucz8uc3BhY2VJZCkpXG5cdFx0Zm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpXG5cblx0XHR0cnlcblx0XHRcdGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpICAgIyDmraTlpITkuI3og73nlKh3aW5kb3cuZXZhbCDvvIzkvJrlr7zoh7Tlj5jph4/kvZznlKjln5/lvILluLhcblx0XHRcdHJldHVybiBkYXRhXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfVwiLCBlKVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdHRvYXN0cj8uZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIilcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfSN7ZX1cIlxuXG5cdHJldHVybiBmb3JtdWxhX3N0clxuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9O1xuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiO1xuXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IGZ1bmN0aW9uKHByZWZpeCwgZmllbGRWYXJpYWJsZSkge1xuICB2YXIgcmVnLCByZXY7XG4gIHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuICByZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UocmVnLCBmdW5jdGlvbihtLCAkMSkge1xuICAgIHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLywgXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LywgXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLCBcIlxcXCJdW1xcXCJcIik7XG4gIH0pO1xuICByZXR1cm4gcmV2O1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhX3N0cikge1xuICBpZiAoXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSBmdW5jdGlvbihmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpIHtcbiAgdmFyIF9WQUxVRVMsIGRhdGEsIGUsIGV4dGVuZDtcbiAgaWYgKGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpKSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmV4dGVuZCA6IHZvaWQgMCkpIHtcbiAgICAgIGV4dGVuZCA9IHRydWU7XG4gICAgfVxuICAgIF9WQUxVRVMgPSB7fTtcbiAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpO1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMudXNlcklkIDogdm9pZCAwLCBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNwYWNlSWQgOiB2b2lkIDApKTtcbiAgICB9XG4gICAgZm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpO1xuICAgIHRyeSB7XG4gICAgICBkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIsIGUpO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIHRvYXN0ciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0b2FzdHIgIT09IG51bGwpIHtcbiAgICAgICAgICB0b2FzdHIuZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyICsgZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmb3JtdWxhX3N0cjtcbn07XG4iLCJjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fSAgICMg5q2k5a+56LGh5Y+q6IO95Zyo56Gu5L+d5omA5pyJT2JqZWN05Yid5aeL5YyW5a6M5oiQ5ZCO6LCD55So77yMIOWQpuWImeiOt+WPluWIsOeahG9iamVjdOS4jeWFqFxuXG5DcmVhdG9yLmZvcm1hdE9iamVjdE5hbWUgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpXG5cdFx0b2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwuJywgJ2cnKSwgJ18nKVxuXHRyZXR1cm4gb2JqZWN0X25hbWVcblxuQ3JlYXRvci5PYmplY3QgPSAob3B0aW9ucyktPlxuXHRfYmFzZU9iamVjdCA9IENyZWF0b3IuYmFzZU9iamVjdFxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRfYmFzZU9iamVjdCA9IHthY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyAsIGZpZWxkczoge30sIHRyaWdnZXJzOiB7fSwgcGVybWlzc2lvbl9zZXQ6IHt9fVxuXHRzZWxmID0gdGhpc1xuXHRpZiAoIW9wdGlvbnMubmFtZSlcblx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG5cblx0c2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWVcblx0c2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2Vcblx0c2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lXG5cdHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsXG5cdHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvblxuXHRzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvblxuXHRzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXdcblx0c2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtXG5cdHNlbGYucmVsYXRlZExpc3QgPSBvcHRpb25zLnJlbGF0ZWRMaXN0XG5cdHNlbGYucmVsYXRlZF9saXN0cyA9IG9wdGlvbnMucmVsYXRlZF9saXN0c1xuXHRzZWxmLnZlcnNpb24gPSBvcHRpb25zLnZlcnNpb24gfHwgMS4wXG5cdGlmICFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09IHRydWVcblx0XHRzZWxmLmlzX2VuYWJsZSA9IHRydWVcblx0ZWxzZVxuXHRcdHNlbGYuaXNfZW5hYmxlID0gZmFsc2Vcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKVxuXHRcdFx0c2VsZi5hbGxvd19jdXN0b21BY3Rpb25zID0gb3B0aW9ucy5hbGxvd19jdXN0b21BY3Rpb25zXG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2V4Y2x1ZGVfYWN0aW9ucycpXG5cdFx0XHRzZWxmLmV4Y2x1ZGVfYWN0aW9ucyA9IG9wdGlvbnMuZXhjbHVkZV9hY3Rpb25zXG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2FsbG93X3JlbGF0ZWRMaXN0Jylcblx0XHRcdHNlbGYuYWxsb3dfcmVsYXRlZExpc3QgPSBvcHRpb25zLmFsbG93X3JlbGF0ZWRMaXN0XG5cdHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaFxuXHRzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzXG5cdHNlbGYuZW5hYmxlX3Rhc2tzID0gb3B0aW9ucy5lbmFibGVfdGFza3Ncblx0c2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3Rlc1xuXHRzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0XG5cdHNlbGYuZW5hYmxlX2V2ZW50cyA9IG9wdGlvbnMuZW5hYmxlX2V2ZW50c1xuXHRpZiBvcHRpb25zLnBhZ2luZ1xuXHRcdHNlbGYucGFnaW5nID0gb3B0aW9ucy5wYWdpbmdcblx0c2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlblxuXHRzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09IHVuZGVmaW5lZCkgb3Igb3B0aW9ucy5lbmFibGVfYXBpXG5cdHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b21cblx0c2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZVxuXHRzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXNcblx0c2VsZi5lbmFibGVfcHJvY2VzcyA9IG9wdGlvbnMuZW5hYmxlX3Byb2Nlc3Ncblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXG5cdFx0XHRzZWxmLmVuYWJsZV90cmVlID0gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZVxuXHRcdFx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXG5cdGVsc2Vcblx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcblx0XHRzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZVxuXHRzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvd1xuXHRzZWxmLmZpbHRlcl9jb21wYW55ID0gb3B0aW9ucy5maWx0ZXJfY29tcGFueVxuXHRzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKVxuXHRzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlclxuXHRzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoXG5cdHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbFxuXHRzZWxmLmVuYWJsZV9hcHByb3ZhbHMgPSBvcHRpb25zLmVuYWJsZV9hcHByb3ZhbHNcblx0c2VsZi5lbmFibGVfZm9sbG93ID0gb3B0aW9ucy5lbmFibGVfZm9sbG93XG5cdHNlbGYuZW5hYmxlX3dvcmtmbG93ID0gb3B0aW9ucy5lbmFibGVfd29ya2Zsb3dcblx0c2VsZi5lbmFibGVfaW5saW5lX2VkaXQgPSBvcHRpb25zLmVuYWJsZV9pbmxpbmVfZWRpdFxuXHRzZWxmLmRldGFpbHMgPSBvcHRpb25zLmRldGFpbHNcblx0c2VsZi5tYXN0ZXJzID0gb3B0aW9ucy5tYXN0ZXJzXG5cdHNlbGYubG9va3VwX2RldGFpbHMgPSBvcHRpb25zLmxvb2t1cF9kZXRhaWxzXG5cdGlmIF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpXG5cdFx0c2VsZi5pbl9kZXZlbG9wbWVudCA9IG9wdGlvbnMuaW5fZGV2ZWxvcG1lbnRcblx0c2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnXG5cdGlmIG9wdGlvbnMuZGF0YWJhc2VfbmFtZVxuXHRcdHNlbGYuZGF0YWJhc2VfbmFtZSA9IG9wdGlvbnMuZGF0YWJhc2VfbmFtZVxuXHRpZiAoIW9wdGlvbnMuZmllbGRzKVxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IGZpZWxkcycpO1xuXG5cdHNlbGYuZmllbGRzID0gY2xvbmUob3B0aW9ucy5maWVsZHMpXG5cblx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRpZiBmaWVsZC5pc19uYW1lXG5cdFx0XHRzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZVxuXHRcdGVsc2UgaWYgZmllbGRfbmFtZSA9PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVlcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXG5cdFx0aWYgZmllbGQucHJpbWFyeVxuXHRcdFx0c2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWVcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKVxuXHRcdFx0XHRpZiBmaWVsZF9uYW1lID09ICdzcGFjZSdcblx0XHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxuXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IGZhbHNlXG5cblx0aWYgIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcblx0XHRfLmVhY2ggX2Jhc2VPYmplY3QuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRcdGlmICFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXVxuXHRcdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9XG5cdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSlcblxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmIGZpZWxkLnR5cGUgPT0gJ2F1dG9udW1iZXInXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2Zvcm11bGEnXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3N1bW1hcnknXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblxuXHRzZWxmLmxpc3Rfdmlld3MgPSB7fVxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcoc2VsZi5uYW1lKVxuXHRfLmVhY2ggb3B0aW9ucy5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0b2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKVxuXHRcdHNlbGYubGlzdF92aWV3c1tpdGVtX25hbWVdID0gb2l0ZW1cblxuXHRzZWxmLnRyaWdnZXJzID0gXy5jbG9uZShfYmFzZU9iamVjdC50cmlnZ2Vycylcblx0Xy5lYWNoIG9wdGlvbnMudHJpZ2dlcnMsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiAhc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdXG5cdFx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fVxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXS5uYW1lID0gaXRlbV9uYW1lXG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pLCBpdGVtKVxuXG5cdHNlbGYuYWN0aW9ucyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QuYWN0aW9ucylcblx0Xy5lYWNoIG9wdGlvbnMuYWN0aW9ucywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fVxuXHRcdGNvcHlJdGVtID0gXy5jbG9uZShzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSlcblx0XHRkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gI+WFiOWIoOmZpOebuOWFs+WxnuaAp+WGjemHjeW7uuaJjeiDveS/neivgeWQjue7remHjeWkjeWumuS5ieeahOWxnuaAp+mhuuW6j+eUn+aViFxuXHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pXG5cblx0Xy5lYWNoIHNlbGYuYWN0aW9ucywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZVxuXG5cdHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpXG5cblx0IyDorqnmiYDmnIlvYmplY3Tpu5jorqTmnInmiYDmnIlsaXN0X3ZpZXdzL2FjdGlvbnMvcmVsYXRlZF9vYmplY3RzL3JlYWRhYmxlX2ZpZWxkcy9lZGl0YWJsZV9maWVsZHPlrozmlbTmnYPpmZDvvIzor6XmnYPpmZDlj6/og73ooqvmlbDmja7lupPkuK3orr7nva7nmoRhZG1pbi91c2Vy5p2D6ZmQ6KaG55uWXG5cdHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KVxuXHQjIGRlZmF1bHRMaXN0Vmlld3MgPSBfLmtleXMoc2VsZi5saXN0X3ZpZXdzKVxuXHQjIGRlZmF1bHRBY3Rpb25zID0gXy5rZXlzKHNlbGYuYWN0aW9ucylcblx0IyBkZWZhdWx0UmVsYXRlZE9iamVjdHMgPSBfLnBsdWNrKHNlbGYucmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblx0IyBkZWZhdWx0UmVhZGFibGVGaWVsZHMgPSBbXVxuXHQjIGRlZmF1bHRFZGl0YWJsZUZpZWxkcyA9IFtdXG5cdCMgXy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0IyBcdGlmICEoZmllbGQuaGlkZGVuKSAgICAjMjMxIG9taXTlrZfmrrXmlK/mjIHlnKjpnZ7nvJbovpHpobXpnaLmn6XnnIssIOWboOatpOWIoOmZpOS6huatpOWkhOWvuW9taXTnmoTliKTmlq1cblx0IyBcdFx0ZGVmYXVsdFJlYWRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxuXHQjIFx0XHRpZiAhZmllbGQucmVhZG9ubHlcblx0IyBcdFx0XHRkZWZhdWx0RWRpdGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXG5cblx0IyBfLmVhY2ggc2VsZi5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHQjIFx0aWYgaXRlbV9uYW1lID09IFwibm9uZVwiXG5cdCMgXHRcdHJldHVyblxuXHQjIFx0aWYgc2VsZi5saXN0X3ZpZXdzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5saXN0X3ZpZXdzID0gZGVmYXVsdExpc3RWaWV3c1xuXHQjIFx0aWYgc2VsZi5hY3Rpb25zXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5hY3Rpb25zID0gZGVmYXVsdEFjdGlvbnNcblx0IyBcdGlmIHNlbGYucmVsYXRlZF9vYmplY3RzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWxhdGVkX29iamVjdHMgPSBkZWZhdWx0UmVsYXRlZE9iamVjdHNcblx0IyBcdGlmIHNlbGYuZmllbGRzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWFkYWJsZV9maWVsZHMgPSBkZWZhdWx0UmVhZGFibGVGaWVsZHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmVkaXRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRFZGl0YWJsZUZpZWxkc1xuXHR1bmxlc3Mgb3B0aW9ucy5wZXJtaXNzaW9uX3NldFxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fVxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LmFkbWluKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSlcblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py51c2VyKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pXG5cdF8uZWFjaCBvcHRpb25zLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pXG5cblx0IyDliY3nq6/moLnmja5wZXJtaXNzaW9uc+aUueWGmWZpZWxk55u45YWz5bGe5oCn77yM5ZCO56uv5Y+q6KaB6LWw6buY6K6k5bGe5oCn5bCx6KGM77yM5LiN6ZyA6KaB5pS55YaZXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9uc1xuXHRcdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucz8uZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdGlmIGRpc2FibGVkX2xpc3Rfdmlld3M/Lmxlbmd0aFxuXHRcdFx0ZGVmYXVsdExpc3RWaWV3SWQgPSBvcHRpb25zLmxpc3Rfdmlld3M/LmFsbD8uX2lkXG5cdFx0XHRpZiBkZWZhdWx0TGlzdFZpZXdJZFxuXHRcdFx0XHQjIOaKiuinhuWbvuadg+mZkOmFjee9ruS4rem7mOiupOeahGFsbOinhuWbvmlk6L2s5o2i5oiQYWxs5YWz6ZSu5a2XXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcCBkaXNhYmxlZF9saXN0X3ZpZXdzLCAobGlzdF92aWV3X2l0ZW0pIC0+XG5cdFx0XHRcdFx0cmV0dXJuIGlmIGRlZmF1bHRMaXN0Vmlld0lkID09IGxpc3Rfdmlld19pdGVtIHRoZW4gXCJhbGxcIiBlbHNlIGxpc3Rfdmlld19pdGVtXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucylcbiNcdFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cbiNcdFx0XHRpZiBmaWVsZFxuI1x0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bnJlYWRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPCAwXG4jXHRcdFx0XHRcdGlmIGZpZWxkLmhpZGRlblxuI1x0XHRcdFx0XHRcdHJldHVyblxuI1x0XHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVuZWRpdGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA+IC0xXG4jXHRcdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG4jXHRcdFx0XHRcdFx0ZmllbGQuZGlzYWJsZWQgPSB0cnVlXG4jXHRcdFx0XHRcdFx0IyDlvZPlj6ror7vml7bvvIzlpoLmnpzkuI3ljrvmjonlv4XloavlrZfmrrXvvIxhdXRvZm9ybeaYr+S8muaKpemUmeeahFxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlcXVpcmVkID0gZmFsc2VcbiNcdFx0XHRcdGVsc2VcbiNcdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG51bGxcblxuXHRfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucylcblxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGJcblxuXHRzZWxmLmRiID0gX2RiXG5cblx0c2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lXG5cblx0c2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZilcblx0c2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSlcblx0aWYgc2VsZi5uYW1lICE9IFwidXNlcnNcIiBhbmQgc2VsZi5uYW1lICE9IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCIsIFwiYWN0aW9uX2ZpZWxkX3VwZGF0ZXNcIl0sIHNlbGYubmFtZSlcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblx0XHRlbHNlXG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdGlmIHNlbGYubmFtZSA9PSBcInVzZXJzXCJcblx0XHRfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hXG5cblx0aWYgXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXG5cdENyZWF0b3Iub2JqZWN0c0J5TmFtZVtzZWxmLl9jb2xsZWN0aW9uX25hbWVdID0gc2VsZlxuXG5cdHJldHVybiBzZWxmXG5cbiMgQ3JlYXRvci5PYmplY3QucHJvdG90eXBlLmkxOG4gPSAoKS0+XG4jIFx0IyBzZXQgb2JqZWN0IGxhYmVsXG4jIFx0c2VsZiA9IHRoaXNcblxuIyBcdGtleSA9IHNlbGYubmFtZVxuIyBcdGlmIHQoa2V5KSA9PSBrZXlcbiMgXHRcdGlmICFzZWxmLmxhYmVsXG4jIFx0XHRcdHNlbGYubGFiZWwgPSBzZWxmLm5hbWVcbiMgXHRlbHNlXG4jIFx0XHRzZWxmLmxhYmVsID0gdChrZXkpXG5cbiMgXHQjIHNldCBmaWVsZCBsYWJlbHNcbiMgXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuIyBcdFx0ZmtleSA9IHNlbGYubmFtZSArIFwiX1wiICsgZmllbGRfbmFtZVxuIyBcdFx0aWYgdChma2V5KSA9PSBma2V5XG4jIFx0XHRcdGlmICFmaWVsZC5sYWJlbFxuIyBcdFx0XHRcdGZpZWxkLmxhYmVsID0gZmllbGRfbmFtZVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHRmaWVsZC5sYWJlbCA9IHQoZmtleSlcbiMgXHRcdHNlbGYuc2NoZW1hPy5fc2NoZW1hP1tmaWVsZF9uYW1lXT8ubGFiZWwgPSBmaWVsZC5sYWJlbFxuXG5cbiMgXHQjIHNldCBsaXN0dmlldyBsYWJlbHNcbiMgXHRfLmVhY2ggc2VsZi5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG4jIFx0XHRpMThuX2tleSA9IHNlbGYubmFtZSArIFwiX2xpc3R2aWV3X1wiICsgaXRlbV9uYW1lXG4jIFx0XHRpZiB0KGkxOG5fa2V5KSA9PSBpMThuX2tleVxuIyBcdFx0XHRpZiAhaXRlbS5sYWJlbFxuIyBcdFx0XHRcdGl0ZW0ubGFiZWwgPSBpdGVtX25hbWVcbiMgXHRcdGVsc2VcbiMgXHRcdFx0aXRlbS5sYWJlbCA9IHQoaTE4bl9rZXkpXG5cblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IChvYmplY3QpLT5cblx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXG5cdCMgaWYgb2JqZWN0XG5cdCMgXHRpZiAhb2JqZWN0LmRhdGFiYXNlX25hbWUgfHwgb2JqZWN0LmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcblx0IyBcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXG5cdCMgXHRlbHNlXG5cdCMgXHRcdHJldHVybiBcIi9hcGkvb2RhdGEvI3tvYmplY3QuZGF0YWJhc2VfbmFtZX1cIlxuXG4jIGlmIE1ldGVvci5pc0NsaWVudFxuXG4jIFx0TWV0ZW9yLnN0YXJ0dXAgLT5cbiMgXHRcdFRyYWNrZXIuYXV0b3J1biAtPlxuIyBcdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICYmIENyZWF0b3IuYm9vdHN0cmFwTG9hZGVkPy5nZXQoKVxuIyBcdFx0XHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG4jIFx0XHRcdFx0XHRvYmplY3QuaTE4bigpXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdGlmICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHNcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAob2JqZWN0KS0+XG5cdFx0XHRuZXcgQ3JlYXRvci5PYmplY3Qob2JqZWN0KVxuXG4iLCJ2YXIgY2xvbmU7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge307XG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJykpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpO1xuICB9XG4gIHJldHVybiBvYmplY3RfbmFtZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX2Jhc2VPYmplY3QsIF9kYiwgZGVmYXVsdExpc3RWaWV3SWQsIGRlZmF1bHRWaWV3LCBkaXNhYmxlZF9saXN0X3ZpZXdzLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzY2hlbWEsIHNlbGY7XG4gIF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgX2Jhc2VPYmplY3QgPSB7XG4gICAgICBhY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyxcbiAgICAgIGZpZWxkczoge30sXG4gICAgICB0cmlnZ2Vyczoge30sXG4gICAgICBwZXJtaXNzaW9uX3NldDoge31cbiAgICB9O1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICBpZiAoIW9wdGlvbnMubmFtZSkge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gIH1cbiAgc2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWU7XG4gIHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICBzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gIHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsO1xuICBzZWxmLmljb24gPSBvcHRpb25zLmljb247XG4gIHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uO1xuICBzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXc7XG4gIHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybTtcbiAgc2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Q7XG4gIHNlbGYucmVsYXRlZF9saXN0cyA9IG9wdGlvbnMucmVsYXRlZF9saXN0cztcbiAgc2VsZi52ZXJzaW9uID0gb3B0aW9ucy52ZXJzaW9uIHx8IDEuMDtcbiAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgfHwgb3B0aW9ucy5pc19lbmFibGUgPT09IHRydWUpIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSBmYWxzZTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhbGxvd19jdXN0b21BY3Rpb25zJykpIHtcbiAgICAgIHNlbGYuYWxsb3dfY3VzdG9tQWN0aW9ucyA9IG9wdGlvbnMuYWxsb3dfY3VzdG9tQWN0aW9ucztcbiAgICB9XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdleGNsdWRlX2FjdGlvbnMnKSkge1xuICAgICAgc2VsZi5leGNsdWRlX2FjdGlvbnMgPSBvcHRpb25zLmV4Y2x1ZGVfYWN0aW9ucztcbiAgICB9XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhbGxvd19yZWxhdGVkTGlzdCcpKSB7XG4gICAgICBzZWxmLmFsbG93X3JlbGF0ZWRMaXN0ID0gb3B0aW9ucy5hbGxvd19yZWxhdGVkTGlzdDtcbiAgICB9XG4gIH1cbiAgc2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoO1xuICBzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzO1xuICBzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzO1xuICBzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzO1xuICBzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0O1xuICBzZWxmLmVuYWJsZV9ldmVudHMgPSBvcHRpb25zLmVuYWJsZV9ldmVudHM7XG4gIGlmIChvcHRpb25zLnBhZ2luZykge1xuICAgIHNlbGYucGFnaW5nID0gb3B0aW9ucy5wYWdpbmc7XG4gIH1cbiAgc2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlbjtcbiAgc2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PT0gdm9pZCAwKSB8fCBvcHRpb25zLmVuYWJsZV9hcGk7XG4gIHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b207XG4gIHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmU7XG4gIHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlcztcbiAgc2VsZi5lbmFibGVfcHJvY2VzcyA9IG9wdGlvbnMuZW5hYmxlX3Byb2Nlc3M7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpKSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICAgICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gIH1cbiAgc2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3c7XG4gIHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55O1xuICBzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKTtcbiAgc2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXI7XG4gIHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2g7XG4gIHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbDtcbiAgc2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzO1xuICBzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3c7XG4gIHNlbGYuZW5hYmxlX3dvcmtmbG93ID0gb3B0aW9ucy5lbmFibGVfd29ya2Zsb3c7XG4gIHNlbGYuZW5hYmxlX2lubGluZV9lZGl0ID0gb3B0aW9ucy5lbmFibGVfaW5saW5lX2VkaXQ7XG4gIHNlbGYuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlscztcbiAgc2VsZi5tYXN0ZXJzID0gb3B0aW9ucy5tYXN0ZXJzO1xuICBzZWxmLmxvb2t1cF9kZXRhaWxzID0gb3B0aW9ucy5sb29rdXBfZGV0YWlscztcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpKSB7XG4gICAgc2VsZi5pbl9kZXZlbG9wbWVudCA9IG9wdGlvbnMuaW5fZGV2ZWxvcG1lbnQ7XG4gIH1cbiAgc2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnO1xuICBpZiAob3B0aW9ucy5kYXRhYmFzZV9uYW1lKSB7XG4gICAgc2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lO1xuICB9XG4gIGlmICghb3B0aW9ucy5maWVsZHMpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XG4gIH1cbiAgc2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcyk7XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQuaXNfbmFtZSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZF9uYW1lID09PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVkpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoZmllbGQucHJpbWFyeSkge1xuICAgICAgc2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT09ICdtZXRlb3ItbW9uZ28nKSB7XG4gICAgXy5lYWNoKF9iYXNlT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmICghc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pIHtcbiAgICAgICAgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnc3VtbWFyeScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgc2VsZi5saXN0X3ZpZXdzID0ge307XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpO1xuICBfLmVhY2gob3B0aW9ucy5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgb2l0ZW07XG4gICAgb2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKTtcbiAgICByZXR1cm4gc2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbTtcbiAgfSk7XG4gIHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKTtcbiAgXy5lYWNoKG9wdGlvbnMudHJpZ2dlcnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWU7XG4gICAgcmV0dXJuIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpO1xuICBfLmVhY2gob3B0aW9ucy5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgY29weUl0ZW07XG4gICAgaWYgKCFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgY29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKTtcbiAgICBkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV07XG4gICAgcmV0dXJuIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pO1xuICB9KTtcbiAgXy5lYWNoKHNlbGYuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgfSk7XG4gIHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpO1xuICBzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldCk7XG4gIGlmICghb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fTtcbiAgfVxuICBpZiAoISgocmVmID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZi5hZG1pbiA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pO1xuICB9XG4gIGlmICghKChyZWYxID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZjEudXNlciA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKTtcbiAgfVxuICBfLmVhY2gob3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnM7XG4gICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwO1xuICAgIGlmIChkaXNhYmxlZF9saXN0X3ZpZXdzICE9IG51bGwgPyBkaXNhYmxlZF9saXN0X3ZpZXdzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZGVmYXVsdExpc3RWaWV3SWQgPSAocmVmMiA9IG9wdGlvbnMubGlzdF92aWV3cykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hbGwpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCkge1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAoZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQgPT09IGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Rfdmlld19pdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlbGYucGVybWlzc2lvbnMgPSBudWxsO1xuICB9XG4gIF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiO1xuICBzZWxmLmRiID0gX2RiO1xuICBzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWU7XG4gIHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpO1xuICBzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKTtcbiAgaWYgKHNlbGYubmFtZSAhPT0gXCJ1c2Vyc1wiICYmIHNlbGYubmFtZSAhPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIiwgXCJhY3Rpb25fZmllbGRfdXBkYXRlc1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzZWxmLm5hbWUgPT09IFwidXNlcnNcIikge1xuICAgIF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWE7XG4gIH1cbiAgaWYgKF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGY7XG4gIHJldHVybiBzZWxmO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCI7XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgaWYgKCFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHMpIHtcbiAgICByZXR1cm4gXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICByZXR1cm4gbmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdCk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSAob2JqKSAtPlxuXHR1bmxlc3Mgb2JqXG5cdFx0cmV0dXJuXG5cdHNjaGVtYSA9IHt9XG5cblx0ZmllbGRzQXJyID0gW11cblxuXHRfLmVhY2ggb2JqLmZpZWxkcyAsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmICFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpXG5cdFx0XHRmaWVsZC5uYW1lID0gZmllbGRfbmFtZVxuXHRcdGZpZWxkc0Fyci5wdXNoIGZpZWxkXG5cblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cblxuXHRcdGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lXG5cblx0XHRmcyA9IHt9XG5cdFx0aWYgZmllbGQucmVnRXhcblx0XHRcdGZzLnJlZ0V4ID0gZmllbGQucmVnRXhcblx0XHRmcy5hdXRvZm9ybSA9IHt9XG5cdFx0ZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZVxuXHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0YXV0b2Zvcm1fdHlwZSA9IGZpZWxkLmF1dG9mb3JtPy50eXBlXG5cblx0XHRpZiBmaWVsZC50eXBlID09IFwidGV4dFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJwaG9uZVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW3RleHRdXCIgb3IgZmllbGQudHlwZSA9PSBcIltwaG9uZV1cIlxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2NvZGUnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAxMlxuXHRcdFx0aWYgZmllbGQubGFuZ3VhZ2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRleHRhcmVhXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJwYXNzd29yZFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJwYXNzd29yZFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmlzaU9TKClcblx0XHRcdFx0XHRcdCMgRml4IGlvcyAxNCwg5omL5py65a6i5oi356uv5b6F5a6h5qC45paH5Lu25pel5pyf5o6n5Lu25pi+56S65pWF6ZqcICM5OTHvvIxpb3Pnu5/kuIDnlKhQQ+err+S4gOagt+eahGpz5o6n5Lu2XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcblx0XHRcdFx0XHRcdFx0XHRwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxuXHRcdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcblxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxuXHRcdFx0XHRcdFx0IyBGaXggaW9zIDE0LCDmiYvmnLrlrqLmiLfnq6/lvoXlrqHmoLjmlofku7bml6XmnJ/mjqfku7bmmL7npLrmlYXpmpwgIzk5Me+8jGlvc+e7n+S4gOeUqFBD56uv5LiA5qC355qEanPmjqfku7Zcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG5cdFx0XHRcdFx0XHRcdFx0cGlja2VyVHlwZTogXCJyb2xsZXJzXCJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcblx0XHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIltPYmplY3RdXCJcblx0XHRcdGZzLnR5cGUgPSBbT2JqZWN0XVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImh0bWxcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIiB8fCBsb2NhbGUgPT0gXCJ6aC1DTlwiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuLVVTXCJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHR0eXBlOiBcInN1bW1lcm5vdGVcIlxuXHRcdFx0XHRcdGNsYXNzOiAnc3VtbWVybm90ZS1lZGl0b3InXG5cdFx0XHRcdFx0c2V0dGluZ3M6XG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDIwMFxuXHRcdFx0XHRcdFx0ZGlhbG9nc0luQm9keTogdHJ1ZVxuXHRcdFx0XHRcdFx0dG9vbGJhcjogIFtcblx0XHRcdFx0XHRcdFx0Wydmb250MScsIFsnc3R5bGUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSxcblx0XHRcdFx0XHRcdFx0Wydmb250MycsIFsnZm9udG5hbWUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnY29sb3InLCBbJ2NvbG9yJ11dLFxuXHRcdFx0XHRcdFx0XHRbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSxcblx0XHRcdFx0XHRcdFx0Wyd0YWJsZScsIFsndGFibGUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sXG5cdFx0XHRcdFx0XHRcdFsndmlldycsIFsnY29kZXZpZXcnXV1cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywn6buR5L2TJywn5b6u6L2v6ZuF6buRJywn5Lu/5a6LJywn5qW35L2TJywn6Zq25LmmJywn5bm85ZyGJ11cblx0XHRcdFx0XHRcdGxhbmc6IGxvY2FsZVxuXG5cdFx0ZWxzZSBpZiAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblxuXHRcdFx0aWYgIWZpZWxkLmhpZGRlblxuXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzXG5cblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb25cblxuXHRcdFx0XHRpZiBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0XHRmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblxuXHRcdFx0XHRmcy5maWx0ZXJzRnVuY3Rpb24gPSBpZiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gdGhlbiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gZWxzZSBDcmVhdG9yLmV2YWx1YXRlRmlsdGVyc1xuXG5cdFx0XHRcdGlmIGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRcdGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRpZiBmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0X3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXVxuXHRcdFx0XHRcdFx0XHRcdGlmIF9yZWZfb2JqPy5wZXJtaXNzaW9ucz8uYWxsb3dDcmVhdGVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gKGxvb2t1cF9maWVsZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3JtSWQ6IFwibmV3I3tmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsJ18nKX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogXCIje2ZpZWxkLnJlZmVyZW5jZV90b31cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25TdWNjZXNzOiAob3BlcmF0aW9uLCByZXN1bHQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlc3VsdC5vYmplY3RfbmFtZSA9PSBcIm9iamVjdHNcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLCB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsIGljb246IHJlc3VsdC52YWx1ZS5pY29ufV0sIHJlc3VsdC52YWx1ZS5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLCB2YWx1ZTogcmVzdWx0Ll9pZH1dLCByZXN1bHQuX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlXG5cblx0XHRcdFx0XHRpZiBfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGVcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfbGltaXRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdFxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b19maWVsZFxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlVG9GaWVsZCA9IGZpZWxkLnJlZmVyZW5jZV90b19maWVsZFxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwidXNlcnNcIlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7liIbpg6jliJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7liIbpg6hcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWIhumDqOmDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJvcmdhbml6YXRpb25zXCJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7liIbpg6jliJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7liIbpg6hcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWIhumDqOmDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgdHlwZW9mKGZpZWxkLnJlZmVyZW5jZV90bykgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0XHRcdFx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZVxuXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBTdHJpbmdcblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBbU3RyaW5nXVxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b11cblxuXHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXVxuXHRcdFx0XHRcdFx0aWYgX29iamVjdCBhbmQgX29iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIlxuXG5cdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdXG5cdFx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90by5mb3JFYWNoIChfcmVmZXJlbmNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfb2JqZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IF9vYmplY3Q/LmxhYmVsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogX29iamVjdD8uaWNvblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb25cblxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb25cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImN1cnJlbmN5XCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdFx0ZWxzZSBpZiBmaWVsZD8uc2NhbGUgIT0gMFxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IDJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJudW1iZXJcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYm9vbGVhblwiXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRvZ2dsZVwiXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJyZWZlcmVuY2VcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCJcblx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZVwiIGFuZCBmaWVsZC5jb2xsZWN0aW9uXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogZmllbGQuY29sbGVjdGlvblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGZpZWxkLmNvbGxlY3Rpb25cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlc2l6ZVwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT0gXCJvYmplY3RcIlxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImdyaWRcIlxuXHRcdFx0ZnMudHlwZSA9IEFycmF5XG5cdFx0XHRmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCJcblxuXHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0dHlwZTogT2JqZWN0XG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaW1hZ2VcIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdpbWFnZXMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF2YXRhclwiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F2YXRhcnMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdWRpb1wiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F1ZGlvcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2F1ZGlvLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidmlkZW9cIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICd2aWRlb3MnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICd2aWRlby8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3Rcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm1hcmtkb3duXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtbWFya2Rvd25cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAndXJsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0IyBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5Vcmxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2VtYWlsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2Zvcm11bGEnXG5cdFx0XHRmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtmaWVsZHM6IHtmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHt0eXBlOiBmaWVsZC5kYXRhX3R5cGV9KX19KVtmaWVsZC5uYW1lXVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc3VtbWFyeSdcblx0XHRcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdwZXJjZW50J1xuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdHVubGVzcyBfLmlzTnVtYmVyKGZpZWxkLnNjYWxlKVxuXHRcdFx0XHQjIOayoemFjee9ruWwj+aVsOS9jeaVsOWImeaMieWwj+aVsOS9jeaVsDDmnaXlpITnkIbvvIzljbPpu5jorqTmmL7npLrkuLrmlbTmlbDnmoTnmb7liIbmr5TvvIzmr5TlpoIyMCXvvIzmraTml7bmjqfku7blj6/ku6XovpPlhaUy5L2N5bCP5pWw77yM6L2s5oiQ55m+5YiG5q+U5bCx5piv5pW05pWwXG5cdFx0XHRcdGZpZWxkLnNjYWxlID0gMFxuXHRcdFx0IyBhdXRvZm9ybeaOp+S7tuS4reWwj+aVsOS9jeaVsOWni+e7iOavlOmFjee9rueahOS9jeaVsOWkmjLkvY1cblx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGUgKyAyXG5cdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdGZzLnR5cGUgPSBmaWVsZC50eXBlXG5cblx0XHRpZiBmaWVsZC5sYWJlbFxuXHRcdFx0ZnMubGFiZWwgPSBmaWVsZC5sYWJlbFxuXG4jXHRcdGlmIGZpZWxkLmFsbG93ZWRWYWx1ZXNcbiNcdFx0XHRmcy5hbGxvd2VkVmFsdWVzID0gZmllbGQuYWxsb3dlZFZhbHVlc1xuXG5cdFx0aWYgIWZpZWxkLnJlcXVpcmVkXG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcblxuXHRcdCMgW+etvue6puWvueixoeWQjOaXtumFjee9ruS6hmNvbXBhbnlfaWRz5b+F5aGr5Y+KdW5lZGl0YWJsZV9maWVsZHPpgKDmiJDpg6jliIbnlKjmiLfmlrDlu7rnrb7nuqblr7nosaHml7bmiqXplJkgIzE5Ml0oaHR0cHM6Ly9naXRodWIuY29tL3N0ZWVkb3Mvc3RlZWRvcy1wcm9qZWN0LWR6dWcvaXNzdWVzLzE5Milcblx0XHQjIOWQjuWPsOWni+e7iOiuvue9rnJlcXVpcmVk5Li6ZmFsc2Vcblx0XHRpZiAhTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLnVuaXF1ZVxuXHRcdFx0ZnMudW5pcXVlID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQub21pdFxuXHRcdFx0ZnMuYXV0b2Zvcm0ub21pdCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmdyb3VwXG5cdFx0XHRmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwXG5cblx0XHRpZiBmaWVsZC5pc193aWRlXG5cdFx0XHRmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuaGlkZGVuXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIlxuXG5cdFx0aWYgKGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuZmlsdGVyYWJsZSkgPT0gJ3VuZGVmaW5lZCdcblx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcblx0XHRpZiBmaWVsZC5uYW1lID09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuc2VhcmNoYWJsZSkgPT0gJ3VuZGVmaW5lZCdcblx0XHRcdFx0ZmllbGQuc2VhcmNoYWJsZSA9IHRydWVcblxuXHRcdGlmIGF1dG9mb3JtX3R5cGVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlXG5cblx0XHRpZiBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSAoKS0+XG5cdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge3VzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLCBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIG5vdzogbmV3IERhdGUoKX0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0XHRpZiAhXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHRmcy5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblxuXHRcdGlmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmRpc2FibGVkXG5cdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmlubGluZUhlbHBUZXh0XG5cdFx0XHRmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0XG5cblx0XHRpZiBmaWVsZC5ibGFja2JveFxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21pbicpXG5cdFx0XHRmcy5taW4gPSBmaWVsZC5taW5cblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21heCcpXG5cdFx0XHRmcy5tYXggPSBmaWVsZC5tYXhcblxuXHRcdCMg5Y+q5pyJ55Sf5Lqn546v5aKD5omN6YeN5bu657Si5byVXG5cdFx0aWYgTWV0ZW9yLmlzUHJvZHVjdGlvblxuXHRcdFx0aWYgZmllbGQuaW5kZXhcblx0XHRcdFx0ZnMuaW5kZXggPSBmaWVsZC5pbmRleFxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5zb3J0YWJsZVxuXHRcdFx0XHRmcy5pbmRleCA9IHRydWVcblxuXHRcdHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzXG5cblx0cmV0dXJuIHNjaGVtYVxuXG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKS0+XG5cdGh0bWwgPSBmaWVsZF92YWx1ZVxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdHJldHVybiBcIlwiXG5cdGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKVxuXHRpZiAhZmllbGRcblx0XHRyZXR1cm4gXCJcIlxuXG5cdGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKVxuXHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRlXCJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxuXG5cdHJldHVybiBodG1sXG5cbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gKGZpZWxkX3R5cGUpLT5cblx0cmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpLT5cblx0YnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSlcblx0aWYgYnVpbHRpblZhbHVlc1xuXHRcdF8uZm9yRWFjaCBidWlsdGluVmFsdWVzLCAoYnVpbHRpbkl0ZW0sIGtleSktPlxuXHRcdFx0b3BlcmF0aW9ucy5wdXNoKHtsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsIHZhbHVlOiBrZXl9KVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpLT5cblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSAoZmllbGRfdHlwZSwgdmFsdWUpLT5cblx0IyDmoLnmja7ov4fmu6TlmajnmoTov4fmu6TlgLzvvIzojrflj5blr7nlupTnmoTlhoXnva7ov5DnrpfnrKZcblx0IyDmr5TlpoJ2YWx1ZeS4umxhc3RfeWVhcu+8jOi/lOWbnmJldHdlZW5fdGltZV9sYXN0X3llYXJcblx0dW5sZXNzIF8uaXNTdHJpbmcodmFsdWUpXG5cdFx0cmV0dXJuXG5cdGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxuXHR1bmxlc3MgYmV0d2VlbkJ1aWx0aW5WYWx1ZXNcblx0XHRyZXR1cm5cblx0cmVzdWx0ID0gbnVsbFxuXHRfLmVhY2ggYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIChpdGVtLCBvcGVyYXRpb24pLT5cblx0XHRpZiBpdGVtLmtleSA9PSB2YWx1ZVxuXHRcdFx0cmVzdWx0ID0gb3BlcmF0aW9uXG5cdHJldHVybiByZXN1bHRcblxuIyDlpoLmnpzlj6rmmK/kuLrliKTmlq1vcGVyYXRpb27mmK/lkKblrZjlnKjvvIzliJnmsqHlv4XopoHorqHnrpd2YWx1ZXPvvIzkvKDlhaVpc19jaGVja19vbmx55Li6dHJ1ZeWNs+WPr1xuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSAoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSktPlxuXHQjIOi/h+a7pOWZqOaXtumXtOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRyZXR1cm4ge1xuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuXHR9XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSAobW9udGgpLT5cblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHJldHVybiAwXG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0cmV0dXJuIDNcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRyZXR1cm4gNlxuXHRcblx0cmV0dXJuIDlcblxuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHllYXItLVxuXHRcdG1vbnRoID0gOVxuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdG1vbnRoID0gMFxuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdG1vbnRoID0gM1xuXHRlbHNlIFxuXHRcdG1vbnRoID0gNlxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gKHllYXIsbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHRtb250aCA9IDNcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRtb250aCA9IDZcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRtb250aCA9IDlcblx0ZWxzZVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoID0gMFxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmIG1vbnRoID09IDExXG5cdFx0cmV0dXJuIDMxXG5cdFxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcblx0c3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCsxLCAxKVxuXHRkYXlzID0gKGVuZERhdGUtc3RhcnREYXRlKS9taWxsaXNlY29uZFxuXHRyZXR1cm4gZGF5c1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gKHllYXIsIG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0IyDmnIjku73kuLow5Luj6KGo5pys5bm055qE56ys5LiA5pyIXG5cdGlmIG1vbnRoID09IDBcblx0XHRtb250aCA9IDExXG5cdFx0eWVhci0tXG5cdFx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblx0IyDlkKbliJks5Y+q5YeP5Y675pyI5Lu9XG5cdG1vbnRoLS07XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cblx0IyDov4fmu6TlmahiZXR3ZWVu6L+Q566X56ym77yM546w566X5pel5pyfL+aXpeacn+aXtumXtOexu+Wei+Wtl+auteeahHZhbHVlc+WAvFxuXHRub3cgPSBuZXcgRGF0ZSgpXG5cdCMg5LiA5aSp55qE5q+r56eS5pWwXG5cdG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNFxuXHR5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHR0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcblx0IyDkuIDlkajkuK3nmoTmn5DkuIDlpKlcblx0d2VlayA9IG5vdy5nZXREYXkoKVxuXHQjIOWHj+WOu+eahOWkqeaVsFxuXHRtaW51c0RheSA9IGlmIHdlZWsgIT0gMCB0aGVuIHdlZWsgLSAxIGVsc2UgNlxuXHRtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKVxuXHRzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg5LiK5ZGo5pelXG5cdGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5LiK5ZGo5LiAXG5cdGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKVxuXHQjIOS4i+WRqOS4gFxuXHRuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxuXHQjIOS4i+WRqOaXpVxuXHRuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSlcblx0Y3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDFcblx0bmV4dFllYXIgPSBjdXJyZW50WWVhciArIDFcblx0IyDlvZPliY3mnIjku71cblx0Y3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDorqHmlbDlubTjgIHmnIhcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG5cdG1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDmnKzmnIjnrKzkuIDlpKlcblx0Zmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixjdXJyZW50TW9udGgsMSlcblxuXHQjIOW9k+S4ujEy5pyI55qE5pe25YCZ5bm05Lu96ZyA6KaB5YqgMVxuXHQjIOaciOS7vemcgOimgeabtOaWsOS4ujAg5Lmf5bCx5piv5LiL5LiA5bm055qE56ys5LiA5Liq5pyIXG5cdGlmIGN1cnJlbnRNb250aCA9PSAxMVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoKytcblx0ZWxzZVxuXHRcdG1vbnRoKytcblx0XG5cdCMg5LiL5pyI56ys5LiA5aSpXG5cdG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdCMg5LiL5pyI5pyA5ZCO5LiA5aSpXG5cdG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhcixtb250aCxDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLG1vbnRoKSlcblx0IyDmnKzmnIjmnIDlkI7kuIDlpKlcblx0bGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOS4iuaciOesrOS4gOWkqVxuXHRsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4iuaciOacgOWQjuS4gOWkqVxuXHRsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOacrOWto+W6puW8gOWni+aXpVxuXHR0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLDEpXG5cdCMg5pys5a2j5bqm57uT5p2f5pelXG5cdHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIsQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIpKVxuXHQjIOS4iuWto+W6puW8gOWni+aXpVxuXHRsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIrlraPluqbnu5PmnZ/ml6Vcblx0bGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcblx0IyDkuIvlraPluqblvIDlp4vml6Vcblx0bmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiL5a2j5bqm57uT5p2f5pelXG5cdG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMikpXG5cdCMg6L+H5Y67N+WkqSBcblx0bGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MzDlpKlcblx0bGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrs2MOWkqVxuXHRsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzkw5aSpXG5cdGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MTIw5aSpXG5cdGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU35aSpIFxuXHRuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUzMOWkqVxuXHRuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTYw5aSpXG5cdG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lOTDlpKlcblx0bmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUxMjDlpKlcblx0bmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKVxuXG5cdHN3aXRjaCBrZXlcblx0XHR3aGVuIFwibGFzdF95ZWFyXCJcblx0XHRcdCPljrvlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7cHJldmlvdXNZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc195ZWFyXCJcblx0XHRcdCPku4rlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfeWVhclwiXG5cdFx0XHQj5piO5bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4iuWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3F1YXJ0ZXJcIlxuXHRcdFx0I+acrOWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4i+Wto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X21vbnRoXCJcblx0XHRcdCPkuIrmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX21vbnRoXCJcblx0XHRcdCPmnKzmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfbW9udGhcIlxuXHRcdFx0I+S4i+aciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3Rfd2Vla1wiXG5cdFx0XHQj5LiK5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc193ZWVrXCJcblx0XHRcdCPmnKzlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF93ZWVrXCJcblx0XHRcdCPkuIvlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ5ZXN0ZGF5XCJcblx0XHRcdCPmmKjlpKlcblx0XHRcdHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0b2RheVwiXG5cdFx0XHQj5LuK5aSpXG5cdFx0XHRzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidG9tb3Jyb3dcIlxuXHRcdFx0I+aYjuWkqVxuXHRcdFx0c3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF83X2RheXNcIlxuXHRcdFx0I+i/h+WOuzflpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIFxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8zMF9kYXlzXCJcblx0XHRcdCPov4fljrszMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF82MF9kYXlzXCJcblx0XHRcdCPov4fljrs2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF85MF9kYXlzXCJcblx0XHRcdCPov4fljrs5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8xMjBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67MTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfN19kYXlzXCJcblx0XHRcdCPmnKrmnaU35aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8zMF9kYXlzXCJcblx0XHRcdCPmnKrmnaUzMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF82MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF85MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8xMjBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lMTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFxuXHR2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdXG5cdGlmIGZpZWxkX3R5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0IyDml7bpl7TnsbvlnovlrZfmrrXvvIzlhoXnva7ml7bpl7TojIPlm7TlupTor6XogIPomZHlgY/np7vml7bljLrlgLzvvIzlkKbliJnov4fmu6TmlbDmja7lrZjlnKjlgY/lt65cblx0XHQjIOmdnuWGhee9ruaXtumXtOiMg+WbtOaXtu+8jOeUqOaIt+mAmui/h+aXtumXtOaOp+S7tumAieaLqeeahOiMg+WbtO+8jOS8muiHquWKqOWkhOeQhuaXtuWMuuWBj+W3ruaDheWGtVxuXHRcdCMg5pel5pyf57G75Z6L5a2X5q6177yM5pWw5o2u5bqT5pys5p2l5bCx5a2Y55qE5pivVVRD55qEMOeCue+8jOS4jeWtmOWcqOWBj+W3rlxuXHRcdF8uZm9yRWFjaCB2YWx1ZXMsIChmdiktPlxuXHRcdFx0aWYgZnZcblx0XHRcdFx0ZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCApXG5cdFxuXHRyZXR1cm4ge1xuXHRcdGxhYmVsOiBsYWJlbFxuXHRcdGtleToga2V5XG5cdFx0dmFsdWVzOiB2YWx1ZXNcblx0fVxuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKS0+XG5cdGlmIGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gJ2JldHdlZW4nXG5cdGVsc2UgaWYgW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiAnY29udGFpbnMnXG5cdGVsc2Vcblx0XHRyZXR1cm4gXCI9XCJcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKSAtPlxuXHQjIOaXpeacn+exu+WeizogZGF0ZSwgZGF0ZXRpbWUgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOaWh+acrOexu+WeizogdGV4dCwgdGV4dGFyZWEsIGh0bWwgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIsIFwic3RhcnRzd2l0aFwiXG5cdCMg6YCJ5oup57G75Z6LOiBsb29rdXAsIG1hc3Rlcl9kZXRhaWwsIHNlbGVjdCDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblx0IyDmlbDlgLznsbvlnos6IGN1cnJlbmN5LCBudW1iZXIgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOW4g+WwlOexu+WeizogYm9vbGVhbiAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cdCMg5pWw57uE57G75Z6LOiBjaGVja2JveCwgW3RleHRdICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblxuXHRvcHRpb25hbHMgPSB7XG5cdFx0ZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSwgdmFsdWU6IFwiPVwifSxcblx0XHR1bmVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSwgdmFsdWU6IFwiPD5cIn0sXG5cdFx0bGVzc190aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLCB2YWx1ZTogXCI8XCJ9LFxuXHRcdGdyZWF0ZXJfdGhhbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSwgdmFsdWU6IFwiPlwifSxcblx0XHRsZXNzX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPD1cIn0sXG5cdFx0Z3JlYXRlcl9vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksIHZhbHVlOiBcIj49XCJ9LFxuXHRcdGNvbnRhaW5zOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksIHZhbHVlOiBcImNvbnRhaW5zXCJ9LFxuXHRcdG5vdF9jb250YWluOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSwgdmFsdWU6IFwibm90Y29udGFpbnNcIn0sXG5cdFx0c3RhcnRzX3dpdGg6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSwgdmFsdWU6IFwic3RhcnRzd2l0aFwifSxcblx0XHRiZXR3ZWVuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSwgdmFsdWU6IFwiYmV0d2VlblwifSxcblx0fVxuXG5cdGlmIGZpZWxkX3R5cGUgPT0gdW5kZWZpbmVkXG5cdFx0cmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscylcblxuXHRvcGVyYXRpb25zID0gW11cblxuXHRpZiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbilcblx0XHRDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGRfdHlwZSA9PSBcInRleHRhcmVhXCIgb3IgZmllbGRfdHlwZSA9PSBcImh0bWxcIiBvciBmaWVsZF90eXBlID09IFwiY29kZVwiXG4jXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMuY29udGFpbnMsIG9wdGlvbmFscy5ub3RfY29udGFpbiwgb3B0aW9uYWxzLnN0YXJ0c193aXRoKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgb3IgZmllbGRfdHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImN1cnJlbmN5XCIgb3IgZmllbGRfdHlwZSA9PSBcIm51bWJlclwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiYm9vbGVhblwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiW3RleHRdXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXG5cdHJldHVybiBvcGVyYXRpb25zXG5cbiMjI1xuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuIyMjXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSAob2JqZWN0X25hbWUpLT5cblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcblx0ZmllbGRzQXJyID0gW11cblxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQpLT5cblx0XHRmaWVsZHNBcnIucHVzaCB7bmFtZTogZmllbGQubmFtZSwgc29ydF9ubzogZmllbGQuc29ydF9ub31cblxuXHRmaWVsZHNOYW1lID0gW11cblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cblx0XHRmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSlcblx0cmV0dXJuIGZpZWxkc05hbWVcbiIsIkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBmaWVsZHNBcnIsIHNjaGVtYTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc2NoZW1hID0ge307XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2gob2JqLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoIV8uaGFzKGZpZWxkLCBcIm5hbWVcIikpIHtcbiAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goZmllbGQpO1xuICB9KTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHZhciBfb2JqZWN0LCBfcmVmX29iaiwgX3JlZmVyZW5jZV90bywgYXV0b2Zvcm1fdHlwZSwgZmllbGRfbmFtZSwgZnMsIGlzVW5MaW1pdGVkLCBsb2NhbGUsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc2lPUygpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiLFxuICAgICAgICAgICAgICAgIHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCIsXG4gICAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCIsXG4gICAgICAgICAgICAgICAgcGlja2VyVHlwZTogXCJyb2xsZXJzXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PT0gXCJ6aC1DTlwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAgICAgfVxuICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgdHlwZTogXCJzdW1tZXJub3RlXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiAnc3VtbWVybm90ZS1lZGl0b3InLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICAgIGRpYWxvZ3NJbkJvZHk6IHRydWUsXG4gICAgICAgICAgICB0b29sYmFyOiBbWydmb250MScsIFsnc3R5bGUnXV0sIFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSwgWydmb250MycsIFsnZm9udG5hbWUnXV0sIFsnY29sb3InLCBbJ2NvbG9yJ11dLCBbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSwgWyd0YWJsZScsIFsndGFibGUnXV0sIFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sIFsndmlldycsIFsnY29kZXZpZXcnXV1dLFxuICAgICAgICAgICAgZm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCAn6buR5L2TJywgJ+W+rui9r+mbhem7kScsICfku7/lrosnLCAn5qW35L2TJywgJ+matuS5picsICflubzlnIYnXSxcbiAgICAgICAgICAgIGxhbmc6IGxvY2FsZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIH1cbiAgICAgIGlmICghZmllbGQuaGlkZGVuKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzO1xuICAgICAgICBmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vbjtcbiAgICAgICAgaWYgKGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbikge1xuICAgICAgICAgIGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBmcy5maWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPyBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gOiBDcmVhdG9yLmV2YWx1YXRlRmlsdGVycztcbiAgICAgICAgaWYgKGZpZWxkLm9wdGlvbnNGdW5jdGlvbikge1xuICAgICAgICAgIGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgICAgIGlmIChfcmVmX29iaiAhPSBudWxsID8gKHJlZjEgPSBfcmVmX29iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjEuYWxsb3dDcmVhdGUgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKGxvb2t1cF9maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICBmb3JtSWQ6IFwibmV3XCIgKyAoZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCAnXycpKSxcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogXCJcIiArIGZpZWxkLnJlZmVyZW5jZV90byxcbiAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbihvcGVyYXRpb24sIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lm9iamVjdF9uYW1lID09PSBcIm9iamVjdHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogcmVzdWx0LnZhbHVlLmljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC52YWx1ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0Ll9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3NvcnQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfbGltaXQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90b19maWVsZCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlVG9GaWVsZCA9IGZpZWxkLnJlZmVyZW5jZV90b19maWVsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYyID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMi5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJvcmdhbml6YXRpb25zXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMyA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjMuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmllbGQucmVmZXJlbmNlX3RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoX3JlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgICAgICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogW1N0cmluZ10sXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXTtcbiAgICAgICAgICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI7XG4gICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdO1xuICAgICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8uZm9yRWFjaChmdW5jdGlvbihfcmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdO1xuICAgICAgICAgICAgICAgICAgaWYgKF9vYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmxhYmVsIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGljb246IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgICAgaWYgKF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRvZ2dsZVwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInJlZmVyZW5jZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIjtcbiAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlXCIgJiYgZmllbGQuY29sbGVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBmaWVsZC5jb2xsZWN0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGZpZWxkLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVzaXplXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZ3JpZFwiKSB7XG4gICAgICBmcy50eXBlID0gQXJyYXk7XG4gICAgICBmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWU7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiO1xuICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2ltYWdlcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdmF0YXJcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXZhdGFycycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXVkaW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2F1ZGlvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInZpZGVvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ3ZpZGVvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICd2aWRlby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb2NhdGlvblwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIjtcbiAgICAgIGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCI7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLW1hcmtkb3duXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAndXJsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZW1haWwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWw7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHtcbiAgICAgICAgICAgIHR5cGU6IGZpZWxkLmRhdGFfdHlwZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pW2ZpZWxkLm5hbWVdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICBmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7XG4gICAgICAgICAgICB0eXBlOiBmaWVsZC5kYXRhX3R5cGVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVtmaWVsZC5uYW1lXTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdwZXJjZW50Jykge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmICghXy5pc051bWJlcihmaWVsZC5zY2FsZSkpIHtcbiAgICAgICAgZmllbGQuc2NhbGUgPSAwO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZSArIDI7XG4gICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnMudHlwZSA9IGZpZWxkLnR5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5sYWJlbCkge1xuICAgICAgZnMubGFiZWwgPSBmaWVsZC5sYWJlbDtcbiAgICB9XG4gICAgaWYgKCFmaWVsZC5yZXF1aXJlZCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQudW5pcXVlKSB7XG4gICAgICBmcy51bmlxdWUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQub21pdCkge1xuICAgICAgZnMuYXV0b2Zvcm0ub21pdCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ncm91cCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlzX3dpZGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaGlkZGVuKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIjtcbiAgICB9XG4gICAgaWYgKChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5maWx0ZXJhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLm5hbWUgPT09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLnNlYXJjaGFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXV0b2Zvcm1fdHlwZSkge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kZWZhdWx0VmFsdWUpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7XG4gICAgICAgICAgICB1c2VySWQ6IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSxcbiAgICAgICAgICAgIG5vdzogbmV3IERhdGUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgICAgZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGlzYWJsZWQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlubGluZUhlbHBUZXh0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0O1xuICAgIH1cbiAgICBpZiAoZmllbGQuYmxhY2tib3gpIHtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWluJykpIHtcbiAgICAgIGZzLm1pbiA9IGZpZWxkLm1pbjtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWF4JykpIHtcbiAgICAgIGZzLm1heCA9IGZpZWxkLm1heDtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1Byb2R1Y3Rpb24pIHtcbiAgICAgIGlmIChmaWVsZC5pbmRleCkge1xuICAgICAgICBmcy5pbmRleCA9IGZpZWxkLmluZGV4O1xuICAgICAgfSBlbHNlIGlmIChmaWVsZC5zb3J0YWJsZSkge1xuICAgICAgICBmcy5pbmRleCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzY2hlbWFbZmllbGRfbmFtZV0gPSBmcztcbiAgfSk7XG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKSB7XG4gIHZhciBmaWVsZCwgaHRtbCwgb2JqZWN0O1xuICBodG1sID0gZmllbGRfdmFsdWU7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSk7XG4gIGlmICghZmllbGQpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKTtcbiAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICB9XG4gIHJldHVybiBodG1sO1xufTtcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKTtcbn07XG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgb3BlcmF0aW9ucykge1xuICB2YXIgYnVpbHRpblZhbHVlcztcbiAgYnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmIChidWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuIF8uZm9yRWFjaChidWlsdGluVmFsdWVzLCBmdW5jdGlvbihidWlsdGluSXRlbSwga2V5KSB7XG4gICAgICByZXR1cm4gb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLFxuICAgICAgICB2YWx1ZToga2V5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIGtleSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlLCB2YWx1ZSkge1xuICB2YXIgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIHJlc3VsdDtcbiAgaWYgKCFfLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmICghYmV0d2VlbkJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVzdWx0ID0gbnVsbDtcbiAgXy5lYWNoKGJldHdlZW5CdWlsdGluVmFsdWVzLCBmdW5jdGlvbihpdGVtLCBvcGVyYXRpb24pIHtcbiAgICBpZiAoaXRlbS5rZXkgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzdWx0ID0gb3BlcmF0aW9uO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIHtcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSBmdW5jdGlvbihtb250aCkge1xuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHJldHVybiAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIHJldHVybiAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIHJldHVybiA2O1xuICB9XG4gIHJldHVybiA5O1xufTtcblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHllYXItLTtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIHtcbiAgICBtb250aCA9IDY7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSA2O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGggPSAwO1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIHZhciBkYXlzLCBlbmREYXRlLCBtaWxsaXNlY29uZCwgc3RhcnREYXRlO1xuICBpZiAobW9udGggPT09IDExKSB7XG4gICAgcmV0dXJuIDMxO1xuICB9XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgc3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAxKTtcbiAgZGF5cyA9IChlbmREYXRlIC0gc3RhcnREYXRlKSAvIG1pbGxpc2Vjb25kO1xuICByZXR1cm4gZGF5cztcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPT09IDApIHtcbiAgICBtb250aCA9IDExO1xuICAgIHllYXItLTtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICB9XG4gIG1vbnRoLS07XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICB2YXIgY3VycmVudE1vbnRoLCBjdXJyZW50WWVhciwgZW5kVmFsdWUsIGZpcnN0RGF5LCBsYWJlbCwgbGFzdERheSwgbGFzdE1vbmRheSwgbGFzdE1vbnRoRmluYWxEYXksIGxhc3RNb250aEZpcnN0RGF5LCBsYXN0UXVhcnRlckVuZERheSwgbGFzdFF1YXJ0ZXJTdGFydERheSwgbGFzdFN1bmRheSwgbGFzdF8xMjBfZGF5cywgbGFzdF8zMF9kYXlzLCBsYXN0XzYwX2RheXMsIGxhc3RfN19kYXlzLCBsYXN0XzkwX2RheXMsIG1pbGxpc2Vjb25kLCBtaW51c0RheSwgbW9uZGF5LCBtb250aCwgbmV4dE1vbmRheSwgbmV4dE1vbnRoRmluYWxEYXksIG5leHRNb250aEZpcnN0RGF5LCBuZXh0UXVhcnRlckVuZERheSwgbmV4dFF1YXJ0ZXJTdGFydERheSwgbmV4dFN1bmRheSwgbmV4dFllYXIsIG5leHRfMTIwX2RheXMsIG5leHRfMzBfZGF5cywgbmV4dF82MF9kYXlzLCBuZXh0XzdfZGF5cywgbmV4dF85MF9kYXlzLCBub3csIHByZXZpb3VzWWVhciwgc3RhcnRWYWx1ZSwgc3RyRW5kRGF5LCBzdHJGaXJzdERheSwgc3RyTGFzdERheSwgc3RyTW9uZGF5LCBzdHJTdGFydERheSwgc3RyU3VuZGF5LCBzdHJUb2RheSwgc3RyVG9tb3Jyb3csIHN0clllc3RkYXksIHN1bmRheSwgdGhpc1F1YXJ0ZXJFbmREYXksIHRoaXNRdWFydGVyU3RhcnREYXksIHRvbW9ycm93LCB2YWx1ZXMsIHdlZWssIHllYXIsIHllc3RkYXk7XG4gIG5vdyA9IG5ldyBEYXRlKCk7XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgeWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgd2VlayA9IG5vdy5nZXREYXkoKTtcbiAgbWludXNEYXkgPSB3ZWVrICE9PSAwID8gd2VlayAtIDEgOiA2O1xuICBtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdFN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgbmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIG5leHRTdW5kYXkgPSBuZXcgRGF0ZShuZXh0TW9uZGF5LmdldFRpbWUoKSArIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgY3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgcHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxO1xuICBuZXh0WWVhciA9IGN1cnJlbnRZZWFyICsgMTtcbiAgY3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgZmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCAxKTtcbiAgaWYgKGN1cnJlbnRNb250aCA9PT0gMTEpIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGgrKztcbiAgfSBlbHNlIHtcbiAgICBtb250aCsrO1xuICB9XG4gIG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLCBtb250aCkpO1xuICBsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwgMSk7XG4gIHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyKSk7XG4gIGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlIFwibGFzdF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc195ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3Rfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc193ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ5ZXN0ZGF5XCI6XG4gICAgICBzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9kYXlcIjpcbiAgICAgIHN0clRvZGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b21vcnJvd1wiOlxuICAgICAgc3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gIH1cbiAgdmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIF8uZm9yRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGZ2KSB7XG4gICAgICBpZiAoZnYpIHtcbiAgICAgICAgcmV0dXJuIGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGtleToga2V5LFxuICAgIHZhbHVlczogdmFsdWVzXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgaWYgKGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2JldHdlZW4nO1xuICB9IGVsc2UgaWYgKFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2NvbnRhaW5zJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCI9XCI7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHZhciBvcGVyYXRpb25zLCBvcHRpb25hbHM7XG4gIG9wdGlvbmFscyA9IHtcbiAgICBlcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI9XCJcbiAgICB9LFxuICAgIHVuZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PlwiXG4gICAgfSxcbiAgICBsZXNzX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIjxcIlxuICAgIH0sXG4gICAgZ3JlYXRlcl90aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI+XCJcbiAgICB9LFxuICAgIGxlc3Nfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PVwiXG4gICAgfSxcbiAgICBncmVhdGVyX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPj1cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLFxuICAgICAgdmFsdWU6IFwiY29udGFpbnNcIlxuICAgIH0sXG4gICAgbm90X2NvbnRhaW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksXG4gICAgICB2YWx1ZTogXCJub3Rjb250YWluc1wiXG4gICAgfSxcbiAgICBzdGFydHNfd2l0aDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksXG4gICAgICB2YWx1ZTogXCJzdGFydHN3aXRoXCJcbiAgICB9LFxuICAgIGJldHdlZW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksXG4gICAgICB2YWx1ZTogXCJiZXR3ZWVuXCJcbiAgICB9XG4gIH07XG4gIGlmIChmaWVsZF90eXBlID09PSB2b2lkIDApIHtcbiAgICByZXR1cm4gXy52YWx1ZXMob3B0aW9uYWxzKTtcbiAgfVxuICBvcGVyYXRpb25zID0gW107XG4gIGlmIChDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbik7XG4gICAgQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJ0ZXh0YXJlYVwiIHx8IGZpZWxkX3R5cGUgPT09IFwiaHRtbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwiY29kZVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5jb250YWlucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZF90eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCBmaWVsZF90eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY3VycmVuY3lcIiB8fCBmaWVsZF90eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiW3RleHRdXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9XG4gIHJldHVybiBvcGVyYXRpb25zO1xufTtcblxuXG4vKlxuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBmaWVsZHMsIGZpZWxkc0FyciwgZmllbGRzTmFtZSwgcmVmO1xuICBmaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKHtcbiAgICAgIG5hbWU6IGZpZWxkLm5hbWUsXG4gICAgICBzb3J0X25vOiBmaWVsZC5zb3J0X25vXG4gICAgfSk7XG4gIH0pO1xuICBmaWVsZHNOYW1lID0gW107XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIGZpZWxkc05hbWU7XG59O1xuIiwiQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9XG5cbmluaXRUcmlnZ2VyID0gKG9iamVjdF9uYW1lLCB0cmlnZ2VyKS0+XG5cdHRyeVxuXHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXG5cdFx0aWYgIXRyaWdnZXIudG9kb1xuXHRcdFx0cmV0dXJuXG5cdFx0dG9kb1dyYXBwZXIgPSAoKS0+XG5cdFx0XHQgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZVxuXHRcdFx0ICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcblx0XHRpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUuaW5zZXJ0XCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8udXBkYXRlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUucmVtb3ZlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5pbnNlcnRcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/Lmluc2VydCh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy51cGRhdGUodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnJlbW92ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRjYXRjaCBlcnJvclxuXHRcdGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpXG5cbmNsZWFuVHJpZ2dlciA9IChvYmplY3RfbmFtZSktPlxuXHQjIyNcbiAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG5cdCMjI1xuICAgICNUT0RPIOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbBidWdcblx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0/LnJldmVyc2UoKS5mb3JFYWNoIChfaG9vayktPlxuXHRcdF9ob29rLnJlbW92ZSgpXG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gKG9iamVjdF9uYW1lKS0+XG4jXHRjb25zb2xlLmxvZygnQ3JlYXRvci5pbml0VHJpZ2dlcnMgb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSlcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0Y2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKVxuXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW11cblxuXHRfLmVhY2ggb2JqLnRyaWdnZXJzLCAodHJpZ2dlciwgdHJpZ2dlcl9uYW1lKS0+XG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyIGFuZCB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcblx0XHRcdGlmIF90cmlnZ2VyX2hvb2tcblx0XHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXG5cdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spIiwidmFyIGNsZWFuVHJpZ2dlciwgaW5pdFRyaWdnZXI7XG5cbkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fTtcblxuaW5pdFRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdHJpZ2dlcikge1xuICB2YXIgY29sbGVjdGlvbiwgZXJyb3IsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgdG9kb1dyYXBwZXI7XG4gIHRyeSB7XG4gICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgaWYgKCF0cmlnZ2VyLnRvZG8pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdG9kb1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZTtcbiAgICAgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmLmluc2VydCh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjEgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjEudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmMi5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjMgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmMy5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjQgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNC51cGRhdGUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjUgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNS5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpO1xuICB9XG59O1xuXG5jbGVhblRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuXG4gIC8qXG4gICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXG4gICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG4gICAqL1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uKF9ob29rKSB7XG4gICAgcmV0dXJuIF9ob29rLnJlbW92ZSgpO1xuICB9KSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIG9iajtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdO1xuICByZXR1cm4gXy5lYWNoKG9iai50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwgdHJpZ2dlcl9uYW1lKSB7XG4gICAgdmFyIF90cmlnZ2VyX2hvb2s7XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICBpZiAoX3RyaWdnZXJfaG9vaykge1xuICAgICAgICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIHJldHVybiBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpXG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmICFvYmpcblx0XHRcdHJldHVyblxuXHRcdHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KClcblx0ZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XG5cdGlmIHJlY29yZCBhbmQgb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIiBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0IyDlpoLmnpzmmK9jbXNfZmlsZXPpmYTku7bvvIzliJnmnYPpmZDlj5blhbbniLborrDlvZXmnYPpmZBcblx0XHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKVxuXHRcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bor6bnu4bnlYzpnaJcblx0XHRcdG9iamVjdF9uYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG5cdFx0XHRyZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcblx0XHRlbHNlIFxuXHRcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bnmoTniLborrDlvZXnlYzpnaJcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XG5cdFx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcblx0XHRvYmplY3RfZmllbGRzX2tleXMgPSBfLmtleXMoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpPy5maWVsZHMgb3Ige30pIHx8IFtdO1xuXHRcdHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcblx0XHRpZiBzZWxlY3QubGVuZ3RoID4gMFxuXHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0LmpvaW4oJywnKSk7XG5cdFx0ZWxzZVxuXHRcdFx0cmVjb3JkID0gbnVsbDtcblxuXHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSlcblxuXHRpZiByZWNvcmRcblx0XHRpZiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXG5cdFx0XHRyZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9uc1xuXG5cdFx0aXNPd25lciA9IHJlY29yZC5vd25lciA9PSB1c2VySWQgfHwgcmVjb3JkLm93bmVyPy5faWQgPT0gdXNlcklkXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpXG5cdFx0ZWxzZVxuXHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKVxuXHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkPy5jb21wYW55X2lkXG5cdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpIGFuZCByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWTmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahG9iamVjdO+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQ/LmNvbXBhbnlfaWRzXG5cdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSlcblx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWRz5pivbG9va3Vw57G75Z6L77yM5pyJ5Y+v6IO9ZHjmjqfku7bkvJrmiorlroPmmKDlsITovazkuLrlr7nlupTnmoRbb2JqZWN0Xe+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcCgobiktPiBuLl9pZClcblx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSlcblx0XHRpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0aWYgIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoXG5cdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5L+u5pS5XG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFxuXHRcdGlmIHJlY29yZC5sb2NrZWQgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXG5cdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcblx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPmn6XnnItcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWTlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5p+l55yLXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2VcblxuXHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXG4jIGN1cnJlbnRPYmplY3ROYW1l77ya5b2T5YmN5Li75a+56LGhXG4jIHJlbGF0ZWRMaXN0SXRlbe+8mkNyZWF0b3IuZ2V0UmVsYXRlZExpc3QoU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSwgU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikp5Lit5Y+WcmVsYXRlZF9vYmplY3RfbmFtZeWvueW6lOeahOWAvFxuIyBjdXJyZW50UmVjb3Jk5b2T5YmN5Li75a+56LGh55qE6K+m57uG6K6w5b2VXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Q3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxuXHRcdGlmICFjdXJyZW50T2JqZWN0TmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRcdGlmICFyZWxhdGVkTGlzdEl0ZW1cblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG5cdFx0XHRyZXR1cm4ge31cblxuXHRcdGlmICFjdXJyZW50UmVjb3JkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXG5cblx0XHRpZiAhdXNlcklkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdFx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXG5cdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkTGlzdEl0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfHwgZmFsc2Vcblx0XHRtYXN0ZXJBbGxvdyA9IGZhbHNlXG5cdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZClcblx0XHRpZiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PSB0cnVlXG5cdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkXG5cdFx0ZWxzZSBpZiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PSBmYWxzZVxuXHRcdFx0bWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdFxuXG5cdFx0dW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSlcblx0XHRyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSlcblx0XHRpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMVxuXG5cdFx0cmVzdWx0ID0gXy5jbG9uZSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnNcblx0XHRyZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxuXHRcdHJlc3VsdC5hbGxvd0VkaXQgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcblx0XHRyZXR1cm4gcmVzdWx0XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkKSAtPlxuXHRcdHBlcm1pc3Npb25zID1cblx0XHRcdG9iamVjdHM6IHt9XG5cdFx0XHRhc3NpZ25lZF9hcHBzOiBbXVxuXHRcdCMjI1xuXHRcdOadg+mZkOmbhuivtOaYjjpcblx0XHTlhoXnva7mnYPpmZDpm4YtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXG5cdFx06Ieq5a6a5LmJ5p2D6ZmQ6ZuGLeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOmbhuS7peWklueahOWFtuS7luadg+mZkOmbhlxuXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG5cdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ6ZuGXG5cdFx0IyMjXG5cblx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxuXHRcdHNwYWNlVXNlciA9IG51bGxcblx0XHRpZiB1c2VySWRcblx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXG5cdFx0cHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cblx0XHRwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRlbHNlXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cblx0XHRwc2V0c0FkbWluX3BvcyA9IG51bGxcblx0XHRwc2V0c1VzZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IG51bGxcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IG51bGxcblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gbnVsbFxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbFxuXG5cdFx0aWYgcHNldHNBZG1pbj8uX2lkXG5cdFx0XHRwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxuXHRcdFx0cHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzTWVtYmVyPy5faWRcblx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNHdWVzdD8uX2lkXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1N1cHBsaWVyPy5faWRcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzQ3VzdG9tZXI/Ll9pZFxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cblx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIl9pZFwiXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiB7JGluOiBzZXRfaWRzfX0pLmZldGNoKClcblx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXG5cblx0XHRwc2V0cyA9IHtcblx0XHRcdHBzZXRzQWRtaW4sIFxuXHRcdFx0cHNldHNVc2VyLCBcblx0XHRcdHBzZXRzQ3VycmVudCwgXG5cdFx0XHRwc2V0c01lbWJlciwgXG5cdFx0XHRwc2V0c0d1ZXN0LFxuXHRcdFx0cHNldHNTdXBwbGllcixcblx0XHRcdHBzZXRzQ3VzdG9tZXIsXG5cdFx0XHRpc1NwYWNlQWRtaW4sXG5cdFx0XHRzcGFjZVVzZXIsIFxuXHRcdFx0cHNldHNBZG1pbl9wb3MsIFxuXHRcdFx0cHNldHNVc2VyX3BvcywgXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MsIFxuXHRcdFx0cHNldHNHdWVzdF9wb3MsXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3Bvcyxcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zLFxuXHRcdFx0cHNldHNDdXJyZW50X3Bvc1xuXHRcdH1cblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcblx0XHRwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzXG5cdFx0X2kgPSAwXG5cdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cblx0XHRcdF9pKytcblx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09IHNwYWNlSWRcblx0XHRcdFx0aWYgIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09ICcwJyB8fCAob2JqZWN0LmluX2RldmVsb3BtZW50ICE9ICcwJyAmJiBpc1NwYWNlQWRtaW4pXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXHR1bmlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdFx0aWYgIWFycmF5XG5cdFx0XHRhcnJheSA9IFtdXG5cdFx0aWYgIW90aGVyXG5cdFx0XHRvdGhlciA9IFtdXG5cdFx0cmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKVxuXG5cdGludGVyc2VjdGlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdFx0aWYgIWFycmF5XG5cdFx0XHRhcnJheSA9IFtdXG5cdFx0aWYgIW90aGVyXG5cdFx0XHRvdGhlciA9IFtdXG5cdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcilcblxuXHRDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHQjIHBzZXRzTWVtYmVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0IyBwc2V0c0d1ZXN0ID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHNwYWNlVXNlciA9IG51bGw7XG5cdFx0aWYgdXNlcklkXG5cdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGVsc2Vcblx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdGFwcHMgPSBbXVxuXHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0cmV0dXJuIFtdXG5cdFx0ZWxzZVxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGVcblx0XHRcdHBzZXRCYXNlID0gcHNldHNVc2VyXG5cdFx0XHRpZiB1c2VyUHJvZmlsZVxuXHRcdFx0XHRpZiB1c2VyUHJvZmlsZSA9PSAnc3VwcGxpZXInXG5cdFx0XHRcdFx0cHNldEJhc2UgPSBwc2V0c1N1cHBsaWVyXG5cdFx0XHRcdGVsc2UgaWYgdXNlclByb2ZpbGUgPT0gJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNDdXN0b21lclxuXHRcdFx0aWYgcHNldEJhc2U/LmFzc2lnbmVkX2FwcHM/Lmxlbmd0aFxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMgdXNlcuadg+mZkOmbhuS4reeahGFzc2lnbmVkX2FwcHPooajnpLrmiYDmnInnlKjmiLflhbfmnInnmoRhcHBz5p2D6ZmQ77yM5Li656m65YiZ6KGo56S65pyJ5omA5pyJYXBwc+adg+mZkO+8jOS4jemcgOimgeS9nOadg+mZkOWIpOaWreS6hlxuXHRcdFx0XHRyZXR1cm4gW11cblx0XHRcdF8uZWFjaCBwc2V0cywgKHBzZXQpLT5cblx0XHRcdFx0aWYgIXBzZXQuYXNzaWduZWRfYXBwc1xuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBwc2V0Lm5hbWUgPT0gXCJhZG1pblwiIHx8ICBwc2V0Lm5hbWUgPT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09ICdjdXN0b21lcidcblx0XHRcdFx0XHQjIOi/memHjOS5i+aJgOS7peimgeaOkumZpGFkbWluL3VzZXLvvIzmmK/lm6DkuLrov5nkuKTkuKrmnYPpmZDpm4bmmK/miYDmnInmnYPpmZDpm4bkuK11c2Vyc+WxnuaAp+aXoOaViOeahOadg+mZkOmbhu+8jOeJueaMh+W3peS9nOWMuueuoeeQhuWRmOWSjOaJgOacieeUqOaIt1xuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHNcblx0XHRcdHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLHVuZGVmaW5lZCxudWxsKVxuXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRwc2V0cyA9ICB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0YWRtaW5NZW51cyA9IENyZWF0b3IuQXBwcy5hZG1pbj8uYWRtaW5fbWVudXNcblx0XHQjIOWmguaenOayoeaciWFkbWlu6I+c5Y2V6K+05piO5LiN6ZyA6KaB55u45YWz5Yqf6IO977yM55u05o6l6L+U5Zue56m6XG5cdFx0dW5sZXNzIGFkbWluTWVudXNcblx0XHRcdHJldHVybiBbXVxuXHRcdGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZCAobikgLT5cblx0XHRcdG4uX2lkID09ICdhYm91dCdcblx0XHRhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIgKG4pIC0+XG5cdFx0XHRuLl9pZCAhPSAnYWJvdXQnXG5cdFx0b3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5IF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIChuKSAtPlxuXHRcdFx0cmV0dXJuIG4uYWRtaW5fbWVudXMgYW5kIG4uX2lkICE9ICdhZG1pbidcblx0XHQpLCAnc29ydCdcblx0XHRvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSlcblx0XHQjIOiPnOWNleacieS4iemDqOWIhue7hOaIkO+8jOiuvue9rkFQUOiPnOWNleOAgeWFtuS7lkFQUOiPnOWNleS7peWPimFib3V06I+c5Y2VXG5cdFx0YWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKVxuXHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0IyDlt6XkvZzljLrnrqHnkIblkZjmnInlhajpg6joj5zljZXlip/og71cblx0XHRcdHJlc3VsdCA9IGFsbE1lbnVzXG5cdFx0ZWxzZVxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGUgfHwgJ3VzZXInXG5cdFx0XHRjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5uYW1lXG5cdFx0XHRtZW51cyA9IGFsbE1lbnVzLmZpbHRlciAobWVudSktPlxuXHRcdFx0XHRwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0c1xuXHRcdFx0XHQjIOWmguaenOaZrumAmueUqOaIt+acieadg+mZkO+8jOWImeebtOaOpei/lOWbnnRydWVcblx0XHRcdFx0aWYgcHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xXG5cdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0IyDlkKbliJnlj5blvZPliY3nlKjmiLfnmoTmnYPpmZDpm4bkuI5tZW516I+c5Y2V6KaB5rGC55qE5p2D6ZmQ6ZuG5a+55q+U77yM5aaC5p6c5Lqk6ZuG5aSn5LqOMeS4quWImei/lOWbnnRydWVcblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoXG5cdFx0XHRyZXN1bHQgPSBtZW51c1xuXHRcdFxuXHRcdHJldHVybiBfLnNvcnRCeShyZXN1bHQsXCJzb3J0XCIpXG5cblx0ZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCktPlxuXG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIF8uZmluZCBwZXJtaXNzaW9uX29iamVjdHMsIChwbyktPlxuXHRcdFx0XHRcdHJldHVybiBwby5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWR9KVxuXG5cdGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKS0+XG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIF8uZmlsdGVyIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XG5cdFx0XHRcdHJldHVybiBwby5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxuXHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiB7JGluOiBwZXJtaXNzaW9uX3NldF9pZHN9fSkuZmV0Y2goKVxuXG5cdHVuaW9uUGVybWlzc2lvbk9iamVjdHMgPSAocG9zLCBvYmplY3QsIHBzZXRzKS0+XG5cdFx0IyDmiopkYuWPinltbOS4reeahHBlcm1pc3Npb25fb2JqZWN0c+WQiOW5tu+8jOS8mOWFiOWPlmRi5Lit55qEXG5cdFx0cmVzdWx0ID0gW11cblx0XHRfLmVhY2ggb2JqZWN0LnBlcm1pc3Npb25fc2V0LCAob3BzLCBvcHNfa2V5KS0+XG5cdFx0XHQjIOaKinltbOS4remZpOS6hueJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhlwiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIuWklueahOWFtuS7luWvueixoeadg+mZkOWFiOWtmOWFpXJlc3VsdFxuXHRcdFx0IyBpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiLCBcIndvcmtmbG93X2FkbWluXCIsIFwib3JnYW5pemF0aW9uX2FkbWluXCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXG5cdFx0XHRpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiXS5pbmRleE9mKG9wc19rZXkpIDwgMFxuXHRcdFx0XHRjdXJyZW50UHNldCA9IHBzZXRzLmZpbmQgKHBzZXQpLT4gcmV0dXJuIHBzZXQubmFtZSA9PSBvcHNfa2V5XG5cdFx0XHRcdGlmIGN1cnJlbnRQc2V0XG5cdFx0XHRcdFx0dGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fVxuXHRcdFx0XHRcdHRlbXBPcHMucGVybWlzc2lvbl9zZXRfaWQgPSBjdXJyZW50UHNldC5faWRcblx0XHRcdFx0XHR0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggdGVtcE9wc1xuXHRcdGlmIHJlc3VsdC5sZW5ndGhcblx0XHRcdHBvcy5mb3JFYWNoIChwbyktPlxuXHRcdFx0XHRyZXBlYXRJbmRleCA9IDBcblx0XHRcdFx0cmVwZWF0UG8gPSByZXN1bHQuZmluZCgoaXRlbSwgaW5kZXgpLT4gcmVwZWF0SW5kZXggPSBpbmRleDtyZXR1cm4gaXRlbS5wZXJtaXNzaW9uX3NldF9pZCA9PSBwby5wZXJtaXNzaW9uX3NldF9pZClcblx0XHRcdFx0IyDlpoLmnpx5bWzkuK3lt7Lnu4/lrZjlnKhwb++8jOWImeabv+aNouS4uuaVsOaNruW6k+S4reeahHBv77yM5Y+N5LmL5YiZ5oqK5pWw5o2u5bqT5Lit55qEcG/nm7TmjqXntK/liqDov5vljrtcblx0XHRcdFx0aWYgcmVwZWF0UG9cblx0XHRcdFx0XHRyZXN1bHRbcmVwZWF0SW5kZXhdID0gcG9cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoIHBvXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHBvc1xuXG5cdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSktPlxuXHRcdHBlcm1pc3Npb25zID0ge31cblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZClcblxuXHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PSBcInVzZXJzXCJcblx0XHRcdHBlcm1pc3Npb25zID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XG5cdFx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xuXHRcdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cdFx0cHNldHNBZG1pbiA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgb3IgdGhpcy5wc2V0c0FkbWluIHRoZW4gdGhpcy5wc2V0c0FkbWluIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSBvciB0aGlzLnBzZXRzVXNlciB0aGVuIHRoaXMucHNldHNVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNNZW1iZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSBvciB0aGlzLnBzZXRzTWVtYmVyIHRoZW4gdGhpcy5wc2V0c01lbWJlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNHdWVzdCA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgb3IgdGhpcy5wc2V0c0d1ZXN0IHRoZW4gdGhpcy5wc2V0c0d1ZXN0IGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MX19KVxuXG5cdFx0cHNldHNTdXBwbGllciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgb3IgdGhpcy5wc2V0c1N1cHBsaWVyIHRoZW4gdGhpcy5wc2V0c1N1cHBsaWVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzQ3VzdG9tZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQ3VzdG9tZXIpIG9yIHRoaXMucHNldHNDdXN0b21lciB0aGVuIHRoaXMucHNldHNDdXN0b21lciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50O1xuXHRcdGlmICFwc2V0c1xuXHRcdFx0c3BhY2VVc2VyID0gbnVsbDtcblx0XHRcdGlmIHVzZXJJZFxuXHRcdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cblx0XHRwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3Ncblx0XHRwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zXG5cdFx0cHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3Ncblx0XHRwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3NcblxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3Bvc1xuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gdGhpcy5wc2V0c0N1c3RvbWVyX3Bvc1xuXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3Bvc1xuXG5cdFx0b3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fVxuXHRcdG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9XG5cdFx0b3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9XG5cdFx0b3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxuXG5cdFx0b3BzZXRTdXBwbGllciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnN1cHBsaWVyKSB8fCB7fVxuXHRcdG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge31cblxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3RfbGlzdHZpZXdzJykuZmluZCh7c3BhY2U6IHNwYWNlSWQsIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc2hhcmVkOiB0cnVlfSwge2ZpZWxkczp7X2lkOjF9fSkuZmV0Y2goKVxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gXy5wbHVjayhzaGFyZWRMaXN0Vmlld3MsXCJfaWRcIilcblx0XHQjIGlmIHNoYXJlZExpc3RWaWV3cy5sZW5ndGhcblx0XHQjIFx0dW5sZXNzIG9wc2V0QWRtaW4ubGlzdF92aWV3c1xuXHRcdCMgXHRcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IFtdXG5cdFx0IyBcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IF8udW5pb24gb3BzZXRBZG1pbi5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3Ncblx0XHQjIFx0dW5sZXNzIG9wc2V0VXNlci5saXN0X3ZpZXdzXG5cdFx0IyBcdFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBbXVxuXHRcdCMgXHRvcHNldFVzZXIubGlzdF92aWV3cyA9IF8udW5pb24gb3BzZXRVc2VyLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xuXHRcdCMg5pWw5o2u5bqT5Lit5aaC5p6c6YWN572u5LqG6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOmbhuiuvue9ru+8jOW6lOivpeimhuebluS7o+eggeS4rWFkbWluL3VzZXLnmoTmnYPpmZDpm4borr7nva5cblx0XHRpZiBwc2V0c0FkbWluXG5cdFx0XHRwb3NBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0FkbWluLl9pZClcblx0XHRcdGlmIHBvc0FkbWluXG5cdFx0XHRcdG9wc2V0QWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NBZG1pbi5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRvcHNldEFkbWluLmFsbG93RGVsZXRlID0gcG9zQWRtaW4uYWxsb3dEZWxldGVcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd0VkaXQgPSBwb3NBZG1pbi5hbGxvd0VkaXRcblx0XHRcdFx0b3BzZXRBZG1pbi5hbGxvd1JlYWQgPSBwb3NBZG1pbi5hbGxvd1JlYWRcblx0XHRcdFx0b3BzZXRBZG1pbi5tb2RpZnlBbGxSZWNvcmRzID0gcG9zQWRtaW4ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldEFkbWluLnZpZXdBbGxSZWNvcmRzID0gcG9zQWRtaW4udmlld0FsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0QWRtaW4udmlld0NvbXBhbnlSZWNvcmRzID0gcG9zQWRtaW4udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0QWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0FkbWluLmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRcdFx0b3BzZXRBZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQWRtaW4uZGlzYWJsZWRfYWN0aW9uc1xuXHRcdFx0XHRvcHNldEFkbWluLnVucmVhZGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRBZG1pbi51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVuZWRpdGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0QWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NBZG1pbi51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdFx0XHRvcHNldEFkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zQWRtaW4udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Rcblx0XHRpZiBwc2V0c1VzZXJcblx0XHRcdHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKVxuXHRcdFx0aWYgcG9zVXNlclxuXHRcdFx0XHRvcHNldFVzZXIuYWxsb3dDcmVhdGUgPSBwb3NVc2VyLmFsbG93Q3JlYXRlXG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd0RlbGV0ZSA9IHBvc1VzZXIuYWxsb3dEZWxldGVcblx0XHRcdFx0b3BzZXRVc2VyLmFsbG93RWRpdCA9IHBvc1VzZXIuYWxsb3dFZGl0XG5cdFx0XHRcdG9wc2V0VXNlci5hbGxvd1JlYWQgPSBwb3NVc2VyLmFsbG93UmVhZFxuXHRcdFx0XHRvcHNldFVzZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldFVzZXIudmlld0FsbFJlY29yZHMgPSBwb3NVc2VyLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0VXNlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRVc2VyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0VXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zVXNlci5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHRcdG9wc2V0VXNlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zVXNlci5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHRcdG9wc2V0VXNlci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1VzZXIudW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRVc2VyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zVXNlci51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldFVzZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NVc2VyLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0XHRcdG9wc2V0VXNlci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1VzZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Rcblx0XHRpZiBwc2V0c01lbWJlclxuXHRcdFx0cG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpXG5cdFx0XHRpZiBwb3NNZW1iZXJcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dDcmVhdGUgPSBwb3NNZW1iZXIuYWxsb3dDcmVhdGVcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dEZWxldGUgPSBwb3NNZW1iZXIuYWxsb3dEZWxldGVcblx0XHRcdFx0b3BzZXRNZW1iZXIuYWxsb3dFZGl0ID0gcG9zTWVtYmVyLmFsbG93RWRpdFxuXHRcdFx0XHRvcHNldE1lbWJlci5hbGxvd1JlYWQgPSBwb3NNZW1iZXIuYWxsb3dSZWFkXG5cdFx0XHRcdG9wc2V0TWVtYmVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NNZW1iZXIubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldE1lbWJlci52aWV3QWxsUmVjb3JkcyA9IHBvc01lbWJlci52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldE1lbWJlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldE1lbWJlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0TWVtYmVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0XHRvcHNldE1lbWJlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zTWVtYmVyLmRpc2FibGVkX2FjdGlvbnNcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NNZW1iZXIudW5yZWxhdGVkX29iamVjdHNcblx0XHRcdFx0b3BzZXRNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NNZW1iZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Rcblx0XHRpZiBwc2V0c0d1ZXN0XG5cdFx0XHRwb3NHdWVzdCA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNHdWVzdF9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0d1ZXN0Ll9pZClcblx0XHRcdGlmIHBvc0d1ZXN0XG5cdFx0XHRcdG9wc2V0R3Vlc3QuYWxsb3dDcmVhdGUgPSBwb3NHdWVzdC5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRvcHNldEd1ZXN0LmFsbG93RGVsZXRlID0gcG9zR3Vlc3QuYWxsb3dEZWxldGVcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd0VkaXQgPSBwb3NHdWVzdC5hbGxvd0VkaXRcblx0XHRcdFx0b3BzZXRHdWVzdC5hbGxvd1JlYWQgPSBwb3NHdWVzdC5hbGxvd1JlYWRcblx0XHRcdFx0b3BzZXRHdWVzdC5tb2RpZnlBbGxSZWNvcmRzID0gcG9zR3Vlc3QubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldEd1ZXN0LnZpZXdBbGxSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0FsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0R3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zR3Vlc3Qudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdG9wc2V0R3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc0d1ZXN0LmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRcdFx0b3BzZXRHdWVzdC5kaXNhYmxlZF9hY3Rpb25zID0gcG9zR3Vlc3QuZGlzYWJsZWRfYWN0aW9uc1xuXHRcdFx0XHRvcHNldEd1ZXN0LnVucmVhZGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRHdWVzdC51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0R3Vlc3QudW5yZWxhdGVkX29iamVjdHMgPSBwb3NHdWVzdC51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdFx0XHRvcHNldEd1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3Rcblx0XHRpZiBwc2V0c1N1cHBsaWVyXG5cdFx0XHRwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG5cdFx0XHRpZiBwb3NTdXBwbGllclxuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmFsbG93Q3JlYXRlID0gcG9zU3VwcGxpZXIuYWxsb3dDcmVhdGVcblx0XHRcdFx0b3BzZXRTdXBwbGllci5hbGxvd0RlbGV0ZSA9IHBvc1N1cHBsaWVyLmFsbG93RGVsZXRlXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuYWxsb3dFZGl0ID0gcG9zU3VwcGxpZXIuYWxsb3dFZGl0XG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuYWxsb3dSZWFkID0gcG9zU3VwcGxpZXIuYWxsb3dSZWFkXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0b3BzZXRTdXBwbGllci52aWV3QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwb3NTdXBwbGllci5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRvcHNldFN1cHBsaWVyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NTdXBwbGllci5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIuZGlzYWJsZWRfYWN0aW9ucyA9IHBvc1N1cHBsaWVyLmRpc2FibGVkX2FjdGlvbnNcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1N1cHBsaWVyLnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHRcdG9wc2V0U3VwcGxpZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NTdXBwbGllci51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldFN1cHBsaWVyLnVucmVsYXRlZF9vYmplY3RzID0gcG9zU3VwcGxpZXIudW5yZWxhdGVkX29iamVjdHNcblx0XHRcdFx0b3BzZXRTdXBwbGllci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1N1cHBsaWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XG5cdFx0aWYgcHNldHNDdXN0b21lclxuXHRcdFx0cG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuXHRcdFx0aWYgcG9zQ3VzdG9tZXJcblx0XHRcdFx0b3BzZXRDdXN0b21lci5hbGxvd0NyZWF0ZSA9IHBvc0N1c3RvbWVyLmFsbG93Q3JlYXRlXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIuYWxsb3dEZWxldGUgPSBwb3NDdXN0b21lci5hbGxvd0RlbGV0ZVxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmFsbG93RWRpdCA9IHBvc0N1c3RvbWVyLmFsbG93RWRpdFxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmFsbG93UmVhZCA9IHBvc0N1c3RvbWVyLmFsbG93UmVhZFxuXHRcdFx0XHRvcHNldEN1c3RvbWVyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NDdXN0b21lci5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudmlld0FsbFJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRvcHNldEN1c3RvbWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcG9zQ3VzdG9tZXIubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0b3BzZXRDdXN0b21lci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0XHRvcHNldEN1c3RvbWVyLmRpc2FibGVkX2FjdGlvbnMgPSBwb3NDdXN0b21lci5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NDdXN0b21lci51bnJlYWRhYmxlX2ZpZWxkc1xuXHRcdFx0XHRvcHNldEN1c3RvbWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQ3VzdG9tZXIudW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdFx0b3BzZXRDdXN0b21lci51bnJlbGF0ZWRfb2JqZWN0cyA9IHBvc0N1c3RvbWVyLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0XHRcdG9wc2V0Q3VzdG9tZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NDdXN0b21lci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxuXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXG5cdFx0ZWxzZVxuXHRcdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBzcGFjZUlkIGlzICdjb21tb24nXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHNwYWNlVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSBvciB0aGlzLnNwYWNlVXNlciB0aGVuIHRoaXMuc3BhY2VVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0XHRcdFx0aWYgc3BhY2VVc2VyXG5cdFx0XHRcdFx0XHRwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdFx0XHRcdGlmIHByb2Zcblx0XHRcdFx0XHRcdFx0aWYgcHJvZiBpcyAndXNlcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ21lbWJlcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnZ3Vlc3QnXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnc3VwcGxpZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnY3VzdG9tZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEN1c3RvbWVyXG5cdFx0XHRcdFx0XHRlbHNlICMg5rKh5pyJcHJvZmlsZeWImeiupOS4uuaYr3VzZXLmnYPpmZBcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Rcblx0XHRpZiBwc2V0cy5sZW5ndGggPiAwXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0cywgXCJfaWRcIlxuXHRcdFx0cG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcylcblx0XHRcdHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKVxuXHRcdFx0Xy5lYWNoIHBvcywgKHBvKS0+XG5cdFx0XHRcdGlmIHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQWRtaW4/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNVc2VyPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzTWVtYmVyPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzR3Vlc3Q/Ll9pZCBvclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1N1cHBsaWVyPy5faWQgb3Jcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNDdXN0b21lcj8uX2lkXG5cdFx0XHRcdFx0IyDpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ5YC85Y+q5a6e6KGM5LiK6Z2i55qE6buY6K6k5YC86KaG55uW77yM5LiN5YGa566X5rOV5Yik5patXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGlmIF8uaXNFbXB0eShwZXJtaXNzaW9ucylcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IHBvXG5cdFx0XHRcdGlmIHBvLmFsbG93UmVhZFxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWVcblx0XHRcdFx0aWYgcG8uYWxsb3dDcmVhdGVcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWVcblx0XHRcdFx0aWYgcG8uYWxsb3dFZGl0XG5cdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdFx0XHRpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdFx0XHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgcG8udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHRcdFx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpXG5cdFx0XG5cdFx0aWYgb2JqZWN0LmlzX3ZpZXdcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXVxuXHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cblx0XHRpZiBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcblx0XHRcdHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblxuXHQjIENyZWF0b3IuaW5pdFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lKSAtPlxuXG5cdFx0IyAjIOW6lOivpeaKiuiuoeeul+WHuuadpeeahFxuXHRcdCMgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV0uYWxsb3dcblx0XHQjIFx0aW5zZXJ0OiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdCAgICBcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cdFx0IyBcdHVwZGF0ZTogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RWRpdFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblx0XHQjIFx0cmVtb3ZlOiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cblx0TWV0ZW9yLm1ldGhvZHNcblx0XHQjIENhbGN1bGF0ZSBQZXJtaXNzaW9ucyBvbiBTZXJ2ZXJcblx0XHRcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IChzcGFjZUlkKS0+XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZClcbiIsInZhciBjbG9uZSwgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCwgZmluZF9wZXJtaXNzaW9uX29iamVjdCwgaW50ZXJzZWN0aW9uUGx1cywgdW5pb25QZXJtaXNzaW9uT2JqZWN0cywgdW5pb25QbHVzO1xuXG5jbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBvYmo7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iaikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpO1xuICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIHJldHVybiBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBpc093bmVyLCBvYmplY3RfZmllbGRzX2tleXMsIHBlcm1pc3Npb25zLCByZWNvcmRfY29tcGFueV9pZCwgcmVjb3JkX2NvbXBhbnlfaWRzLCByZWNvcmRfaWQsIHJlZiwgcmVmMSwgc2VsZWN0LCB1c2VyX2NvbXBhbnlfaWRzO1xuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXNwYWNlSWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgfVxuICBpZiAocmVjb3JkICYmIG9iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJykpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG4gICAgICByZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKTtcbiAgICAgIHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICAgIH1cbiAgICBvYmplY3RfZmllbGRzX2tleXMgPSBfLmtleXMoKChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwKSB8fCB7fSkgfHwgW107XG4gICAgc2VsZWN0ID0gXy5pbnRlcnNlY3Rpb24ob2JqZWN0X2ZpZWxkc19rZXlzLCBbJ293bmVyJywgJ2NvbXBhbnlfaWQnLCAnY29tcGFueV9pZHMnLCAnbG9ja2VkJ10pIHx8IFtdO1xuICAgIGlmIChzZWxlY3QubGVuZ3RoID4gMCkge1xuICAgICAgcmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0LmpvaW4oJywnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlY29yZCA9IG51bGw7XG4gICAgfVxuICB9XG4gIHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKTtcbiAgaWYgKHJlY29yZCkge1xuICAgIGlmIChyZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zKSB7XG4gICAgICByZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucztcbiAgICB9XG4gICAgaXNPd25lciA9IHJlY29yZC5vd25lciA9PT0gdXNlcklkIHx8ICgocmVmMSA9IHJlY29yZC5vd25lcikgIT0gbnVsbCA/IHJlZjEuX2lkIDogdm9pZCAwKSA9PT0gdXNlcklkO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgfVxuICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZCA6IHZvaWQgMDtcbiAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWQgJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgJiYgcmVjb3JkX2NvbXBhbnlfaWQuX2lkKSB7XG4gICAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZDtcbiAgICB9XG4gICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZHMgOiB2b2lkIDA7XG4gICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoICYmIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWRzWzBdKSkge1xuICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSk7XG4gICAgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICghXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocmVjb3JkLmxvY2tlZCAmJiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwZXJtaXNzaW9ucztcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSwgbWFzdGVyQWxsb3csIG1hc3RlclJlY29yZFBlcm0sIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucywgcmVzdWx0LCB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgaWYgKCFjdXJyZW50T2JqZWN0TmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFyZWxhdGVkTGlzdEl0ZW0pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmICghY3VycmVudFJlY29yZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkTGlzdEl0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfHwgZmFsc2U7XG4gICAgbWFzdGVyQWxsb3cgPSBmYWxzZTtcbiAgICBtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKTtcbiAgICBpZiAod3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT09IHRydWUpIHtcbiAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWQ7XG4gICAgfSBlbHNlIGlmICh3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PT0gZmFsc2UpIHtcbiAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXQ7XG4gICAgfVxuICAgIHVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gQ3JlYXRvci5nZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QoY3VycmVudFJlY29yZCwgY3VycmVudE9iamVjdE5hbWUpO1xuICAgIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKTtcbiAgICBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMTtcbiAgICByZXN1bHQgPSBfLmNsb25lKHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyk7XG4gICAgcmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGU7XG4gICAgcmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgX2ksIGlzU3BhY2VBZG1pbiwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7XG4gICAgICBvYmplY3RzOiB7fSxcbiAgICAgIGFzc2lnbmVkX2FwcHM6IFtdXG4gICAgfTtcblxuICAgIC8qXG4gICAgXHRcdOadg+mZkOmbhuivtOaYjjpcbiAgICBcdFx05YaF572u5p2D6ZmQ6ZuGLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxuICAgIFx0XHToh6rlrprkuYnmnYPpmZDpm4Yt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ6ZuG5Lul5aSW55qE5YW25LuW5p2D6ZmQ6ZuGXG4gICAgXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG4gICAgXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOmbhlxuICAgICAqL1xuICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgcHNldHNBZG1pbl9wb3MgPSBudWxsO1xuICAgIHBzZXRzVXNlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNHdWVzdF9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGw7XG4gICAgaWYgKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VycmVudC5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwiX2lkXCIpO1xuICAgICAgcHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgICAkaW46IHNldF9pZHNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwibmFtZVwiKTtcbiAgICB9XG4gICAgcHNldHMgPSB7XG4gICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudCxcbiAgICAgIHBzZXRzTWVtYmVyOiBwc2V0c01lbWJlcixcbiAgICAgIHBzZXRzR3Vlc3Q6IHBzZXRzR3Vlc3QsXG4gICAgICBwc2V0c1N1cHBsaWVyOiBwc2V0c1N1cHBsaWVyLFxuICAgICAgcHNldHNDdXN0b21lcjogcHNldHNDdXN0b21lcixcbiAgICAgIGlzU3BhY2VBZG1pbjogaXNTcGFjZUFkbWluLFxuICAgICAgc3BhY2VVc2VyOiBzcGFjZVVzZXIsXG4gICAgICBwc2V0c0FkbWluX3BvczogcHNldHNBZG1pbl9wb3MsXG4gICAgICBwc2V0c1VzZXJfcG9zOiBwc2V0c1VzZXJfcG9zLFxuICAgICAgcHNldHNNZW1iZXJfcG9zOiBwc2V0c01lbWJlcl9wb3MsXG4gICAgICBwc2V0c0d1ZXN0X3BvczogcHNldHNHdWVzdF9wb3MsXG4gICAgICBwc2V0c1N1cHBsaWVyX3BvczogcHNldHNTdXBwbGllcl9wb3MsXG4gICAgICBwc2V0c0N1c3RvbWVyX3BvczogcHNldHNDdXN0b21lcl9wb3MsXG4gICAgICBwc2V0c0N1cnJlbnRfcG9zOiBwc2V0c0N1cnJlbnRfcG9zXG4gICAgfTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXM7XG4gICAgX2kgPSAwO1xuICAgIF8uZWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgIF9pKys7XG4gICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT09IHNwYWNlSWQpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT09ICcwJyAmJiBpc1NwYWNlQWRtaW4pKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpO1xuICAgICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgdW5pb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIGludGVyc2VjdGlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFwcHMsIGlzU3BhY2VBZG1pbiwgcHNldEJhc2UsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0N1c3RvbWVyLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1VzZXIsIHJlZiwgcmVmMSwgc3BhY2VVc2VyLCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhcHBzID0gW107XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmLnByb2ZpbGUgOiB2b2lkIDA7XG4gICAgICBwc2V0QmFzZSA9IHBzZXRzVXNlcjtcbiAgICAgIGlmICh1c2VyUHJvZmlsZSkge1xuICAgICAgICBpZiAodXNlclByb2ZpbGUgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXI7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlclByb2ZpbGUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwc2V0QmFzZSAhPSBudWxsID8gKHJlZjEgPSBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgYXBwcyA9IF8udW5pb24oYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBfLmVhY2gocHNldHMsIGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgaWYgKCFwc2V0LmFzc2lnbmVkX2FwcHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBzZXQubmFtZSA9PT0gXCJhZG1pblwiIHx8IHBzZXQubmFtZSA9PT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXBwcyA9IF8udW5pb24oYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksIHZvaWQgMCwgbnVsbCk7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYWJvdXRNZW51LCBhZG1pbk1lbnVzLCBhbGxNZW51cywgY3VycmVudFBzZXROYW1lcywgaXNTcGFjZUFkbWluLCBtZW51cywgb3RoZXJNZW51QXBwcywgb3RoZXJNZW51cywgcHNldHMsIHJlZiwgcmVmMSwgcmVzdWx0LCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFkbWluTWVudXMgPSAocmVmID0gQ3JlYXRvci5BcHBzLmFkbWluKSAhPSBudWxsID8gcmVmLmFkbWluX21lbnVzIDogdm9pZCAwO1xuICAgIGlmICghYWRtaW5NZW51cykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkID09PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgIT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgb3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5KF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmFkbWluX21lbnVzICYmIG4uX2lkICE9PSAnYWRtaW4nO1xuICAgIH0pLCAnc29ydCcpO1xuICAgIG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKTtcbiAgICBhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJlc3VsdCA9IGFsbE1lbnVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9ICgocmVmMSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYxLnByb2ZpbGUgOiB2b2lkIDApIHx8ICd1c2VyJztcbiAgICAgIGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5uYW1lO1xuICAgICAgfSk7XG4gICAgICBtZW51cyA9IGFsbE1lbnVzLmZpbHRlcihmdW5jdGlvbihtZW51KSB7XG4gICAgICAgIHZhciBwc2V0c01lbnU7XG4gICAgICAgIHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzO1xuICAgICAgICBpZiAocHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoO1xuICAgICAgfSk7XG4gICAgICByZXN1bHQgPSBtZW51cztcbiAgICB9XG4gICAgcmV0dXJuIF8uc29ydEJ5KHJlc3VsdCwgXCJzb3J0XCIpO1xuICB9O1xuICBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmluZChwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZFxuICAgIH0pO1xuICB9O1xuICBmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcihwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICRpbjogcGVybWlzc2lvbl9zZXRfaWRzXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgfTtcbiAgdW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IGZ1bmN0aW9uKHBvcywgb2JqZWN0LCBwc2V0cykge1xuICAgIHZhciByZXN1bHQ7XG4gICAgcmVzdWx0ID0gW107XG4gICAgXy5lYWNoKG9iamVjdC5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24ob3BzLCBvcHNfa2V5KSB7XG4gICAgICB2YXIgY3VycmVudFBzZXQsIHRlbXBPcHM7XG4gICAgICBpZiAoW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDApIHtcbiAgICAgICAgY3VycmVudFBzZXQgPSBwc2V0cy5maW5kKGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgICByZXR1cm4gcHNldC5uYW1lID09PSBvcHNfa2V5O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGN1cnJlbnRQc2V0KSB7XG4gICAgICAgICAgdGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fTtcbiAgICAgICAgICB0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkO1xuICAgICAgICAgIHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWU7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHRlbXBPcHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcbiAgICAgIHBvcy5mb3JFYWNoKGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHZhciByZXBlYXRJbmRleCwgcmVwZWF0UG87XG4gICAgICAgIHJlcGVhdEluZGV4ID0gMDtcbiAgICAgICAgcmVwZWF0UG8gPSByZXN1bHQuZmluZChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgIHJlcGVhdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT09IHBvLnBlcm1pc3Npb25fc2V0X2lkO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlcGVhdFBvKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2gocG8pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwb3M7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBpc1NwYWNlQWRtaW4sIG9iamVjdCwgb3BzZXRBZG1pbiwgb3BzZXRDdXN0b21lciwgb3BzZXRHdWVzdCwgb3BzZXRNZW1iZXIsIG9wc2V0U3VwcGxpZXIsIG9wc2V0VXNlciwgcGVybWlzc2lvbnMsIHBvcywgcG9zQWRtaW4sIHBvc0N1c3RvbWVyLCBwb3NHdWVzdCwgcG9zTWVtYmVyLCBwb3NTdXBwbGllciwgcG9zVXNlciwgcHJvZiwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHt9O1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgICBpZiAoc3BhY2VJZCA9PT0gJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgfHwgdGhpcy5wc2V0c0FkbWluID8gdGhpcy5wc2V0c0FkbWluIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIHx8IHRoaXMucHNldHNVc2VyID8gdGhpcy5wc2V0c1VzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzTWVtYmVyID0gXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgfHwgdGhpcy5wc2V0c01lbWJlciA/IHRoaXMucHNldHNNZW1iZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNHdWVzdCA9IF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgfHwgdGhpcy5wc2V0c0d1ZXN0ID8gdGhpcy5wc2V0c0d1ZXN0IDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgfHwgdGhpcy5wc2V0c1N1cHBsaWVyID8gdGhpcy5wc2V0c1N1cHBsaWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgfHwgdGhpcy5wc2V0c0N1c3RvbWVyID8gdGhpcy5wc2V0c0N1c3RvbWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudDtcbiAgICBpZiAoIXBzZXRzKSB7XG4gICAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zO1xuICAgIHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3M7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3M7XG4gICAgcHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3BvcztcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3M7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3BvcztcbiAgICBvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9O1xuICAgIG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9O1xuICAgIG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fTtcbiAgICBvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgIG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge307XG4gICAgb3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fTtcbiAgICBpZiAocHNldHNBZG1pbikge1xuICAgICAgcG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpO1xuICAgICAgaWYgKHBvc0FkbWluKSB7XG4gICAgICAgIG9wc2V0QWRtaW4uYWxsb3dDcmVhdGUgPSBwb3NBZG1pbi5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd0RlbGV0ZSA9IHBvc0FkbWluLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldEFkbWluLmFsbG93RWRpdCA9IHBvc0FkbWluLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRBZG1pbi5hbGxvd1JlYWQgPSBwb3NBZG1pbi5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0QWRtaW4ubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udmlld0FsbFJlY29yZHMgPSBwb3NBZG1pbi52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEFkbWluLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0FkbWluLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRBZG1pbi5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQWRtaW4uZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRBZG1pbi5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQWRtaW4uZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRBZG1pbi51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0FkbWluLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEFkbWluLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQWRtaW4udW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0QWRtaW4udW5yZWxhdGVkX29iamVjdHMgPSBwb3NBZG1pbi51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRBZG1pbi51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0FkbWluLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNVc2VyKSB7XG4gICAgICBwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZCk7XG4gICAgICBpZiAocG9zVXNlcikge1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dDcmVhdGUgPSBwb3NVc2VyLmFsbG93Q3JlYXRlO1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dEZWxldGUgPSBwb3NVc2VyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldFVzZXIuYWxsb3dFZGl0ID0gcG9zVXNlci5hbGxvd0VkaXQ7XG4gICAgICAgIG9wc2V0VXNlci5hbGxvd1JlYWQgPSBwb3NVc2VyLmFsbG93UmVhZDtcbiAgICAgICAgb3BzZXRVc2VyLm1vZGlmeUFsbFJlY29yZHMgPSBwb3NVc2VyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci52aWV3QWxsUmVjb3JkcyA9IHBvc1VzZXIudmlld0FsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1VzZXIubW9kaWZ5Q29tcGFueVJlY29yZHM7XG4gICAgICAgIG9wc2V0VXNlci52aWV3Q29tcGFueVJlY29yZHMgPSBwb3NVc2VyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwb3NVc2VyLmRpc2FibGVkX2xpc3Rfdmlld3M7XG4gICAgICAgIG9wc2V0VXNlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zVXNlci5kaXNhYmxlZF9hY3Rpb25zO1xuICAgICAgICBvcHNldFVzZXIudW5yZWFkYWJsZV9maWVsZHMgPSBwb3NVc2VyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFVzZXIudW5lZGl0YWJsZV9maWVsZHMgPSBwb3NVc2VyLnVuZWRpdGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFVzZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NVc2VyLnVucmVsYXRlZF9vYmplY3RzO1xuICAgICAgICBvcHNldFVzZXIudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwb3NVc2VyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIpIHtcbiAgICAgIHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKTtcbiAgICAgIGlmIChwb3NNZW1iZXIpIHtcbiAgICAgICAgb3BzZXRNZW1iZXIuYWxsb3dDcmVhdGUgPSBwb3NNZW1iZXIuYWxsb3dDcmVhdGU7XG4gICAgICAgIG9wc2V0TWVtYmVyLmFsbG93RGVsZXRlID0gcG9zTWVtYmVyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd0VkaXQgPSBwb3NNZW1iZXIuYWxsb3dFZGl0O1xuICAgICAgICBvcHNldE1lbWJlci5hbGxvd1JlYWQgPSBwb3NNZW1iZXIuYWxsb3dSZWFkO1xuICAgICAgICBvcHNldE1lbWJlci5tb2RpZnlBbGxSZWNvcmRzID0gcG9zTWVtYmVyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnZpZXdBbGxSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdBbGxSZWNvcmRzO1xuICAgICAgICBvcHNldE1lbWJlci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc01lbWJlci5tb2RpZnlDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudmlld0NvbXBhbnlSZWNvcmRzID0gcG9zTWVtYmVyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRNZW1iZXIuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBvc01lbWJlci5kaXNhYmxlZF9saXN0X3ZpZXdzO1xuICAgICAgICBvcHNldE1lbWJlci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zTWVtYmVyLmRpc2FibGVkX2FjdGlvbnM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVucmVhZGFibGVfZmllbGRzID0gcG9zTWVtYmVyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldE1lbWJlci51bmVkaXRhYmxlX2ZpZWxkcyA9IHBvc01lbWJlci51bmVkaXRhYmxlX2ZpZWxkcztcbiAgICAgICAgb3BzZXRNZW1iZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NNZW1iZXIudW5yZWxhdGVkX29iamVjdHM7XG4gICAgICAgIG9wc2V0TWVtYmVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcG9zTWVtYmVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCkge1xuICAgICAgcG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpO1xuICAgICAgaWYgKHBvc0d1ZXN0KSB7XG4gICAgICAgIG9wc2V0R3Vlc3QuYWxsb3dDcmVhdGUgPSBwb3NHdWVzdC5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd0RlbGV0ZSA9IHBvc0d1ZXN0LmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldEd1ZXN0LmFsbG93RWRpdCA9IHBvc0d1ZXN0LmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRHdWVzdC5hbGxvd1JlYWQgPSBwb3NHdWVzdC5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0R3Vlc3QubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0R3Vlc3Qudmlld0FsbFJlY29yZHMgPSBwb3NHdWVzdC52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEd1ZXN0LnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0d1ZXN0LnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRHdWVzdC5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zR3Vlc3QuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRHdWVzdC5kaXNhYmxlZF9hY3Rpb25zID0gcG9zR3Vlc3QuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRHdWVzdC51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0d1ZXN0LnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEd1ZXN0LnVuZWRpdGFibGVfZmllbGRzID0gcG9zR3Vlc3QudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0R3Vlc3QudW5yZWxhdGVkX29iamVjdHMgPSBwb3NHdWVzdC51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRHdWVzdC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0d1ZXN0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllcikge1xuICAgICAgcG9zU3VwcGxpZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzU3VwcGxpZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNTdXBwbGllci5faWQpO1xuICAgICAgaWYgKHBvc1N1cHBsaWVyKSB7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIuYWxsb3dDcmVhdGUgPSBwb3NTdXBwbGllci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRTdXBwbGllci5hbGxvd0RlbGV0ZSA9IHBvc1N1cHBsaWVyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldFN1cHBsaWVyLmFsbG93RWRpdCA9IHBvc1N1cHBsaWVyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRTdXBwbGllci5hbGxvd1JlYWQgPSBwb3NTdXBwbGllci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc1N1cHBsaWVyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudmlld0FsbFJlY29yZHMgPSBwb3NTdXBwbGllci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc1N1cHBsaWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc1N1cHBsaWVyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRTdXBwbGllci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zU3VwcGxpZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRTdXBwbGllci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zU3VwcGxpZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRTdXBwbGllci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc1N1cHBsaWVyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldFN1cHBsaWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zU3VwcGxpZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0U3VwcGxpZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NTdXBwbGllci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRTdXBwbGllci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc1N1cHBsaWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lcikge1xuICAgICAgcG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuICAgICAgaWYgKHBvc0N1c3RvbWVyKSB7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIuYWxsb3dDcmVhdGUgPSBwb3NDdXN0b21lci5hbGxvd0NyZWF0ZTtcbiAgICAgICAgb3BzZXRDdXN0b21lci5hbGxvd0RlbGV0ZSA9IHBvc0N1c3RvbWVyLmFsbG93RGVsZXRlO1xuICAgICAgICBvcHNldEN1c3RvbWVyLmFsbG93RWRpdCA9IHBvc0N1c3RvbWVyLmFsbG93RWRpdDtcbiAgICAgICAgb3BzZXRDdXN0b21lci5hbGxvd1JlYWQgPSBwb3NDdXN0b21lci5hbGxvd1JlYWQ7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIubW9kaWZ5QWxsUmVjb3JkcyA9IHBvc0N1c3RvbWVyLm1vZGlmeUFsbFJlY29yZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudmlld0FsbFJlY29yZHMgPSBwb3NDdXN0b21lci52aWV3QWxsUmVjb3JkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHBvc0N1c3RvbWVyLm1vZGlmeUNvbXBhbnlSZWNvcmRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnZpZXdDb21wYW55UmVjb3JkcyA9IHBvc0N1c3RvbWVyLnZpZXdDb21wYW55UmVjb3JkcztcbiAgICAgICAgb3BzZXRDdXN0b21lci5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfbGlzdF92aWV3cztcbiAgICAgICAgb3BzZXRDdXN0b21lci5kaXNhYmxlZF9hY3Rpb25zID0gcG9zQ3VzdG9tZXIuZGlzYWJsZWRfYWN0aW9ucztcbiAgICAgICAgb3BzZXRDdXN0b21lci51bnJlYWRhYmxlX2ZpZWxkcyA9IHBvc0N1c3RvbWVyLnVucmVhZGFibGVfZmllbGRzO1xuICAgICAgICBvcHNldEN1c3RvbWVyLnVuZWRpdGFibGVfZmllbGRzID0gcG9zQ3VzdG9tZXIudW5lZGl0YWJsZV9maWVsZHM7XG4gICAgICAgIG9wc2V0Q3VzdG9tZXIudW5yZWxhdGVkX29iamVjdHMgPSBwb3NDdXN0b21lci51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICAgICAgb3BzZXRDdXN0b21lci51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHBvc0N1c3RvbWVyLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzcGFjZUlkID09PSAnY29tbW9uJykge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYWNlVXNlciA9IF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSB8fCB0aGlzLnNwYWNlVXNlciA/IHRoaXMuc3BhY2VVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHNwYWNlVXNlcikge1xuICAgICAgICAgICAgcHJvZiA9IHNwYWNlVXNlci5wcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2YpIHtcbiAgICAgICAgICAgICAgaWYgKHByb2YgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdtZW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldE1lbWJlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnZ3Vlc3QnKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzLCBcIl9pZFwiKTtcbiAgICAgIHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpO1xuICAgICAgcG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpO1xuICAgICAgXy5lYWNoKHBvcywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgaWYgKHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLmlzRW1wdHkocGVybWlzc2lvbnMpKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBwbztcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dSZWFkKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBwby5kaXNhYmxlZF9saXN0X3ZpZXdzKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIHBvLnVuZWRpdGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHBvLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAob2JqZWN0LmlzX3ZpZXcpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdO1xuICAgIH1cbiAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgaWYgKG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcikge1xuICAgICAgcGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXI7XG4gICAgfVxuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJcbnN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXG5cbk1ldGVvci5zdGFydHVwICgpLT5cblx0Y3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUlxuXHRvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUlxuXHRpZiBjcmVhdG9yX2RiX3VybFxuXHRcdGlmICFvcGxvZ191cmxcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKVxuXHRcdENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge29wbG9nVXJsOiBvcGxvZ191cmx9KX1cblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IChvYmplY3QpLT5cbiNcdGlmIG9iamVjdC50YWJsZV9uYW1lICYmIG9iamVjdC50YWJsZV9uYW1lLmVuZHNXaXRoKFwiX19jXCIpXG4jXHRcdHJldHVybiBvYmplY3QudGFibGVfbmFtZVxuI1x0ZWxzZVxuI1x0XHRyZXR1cm4gb2JqZWN0Lm5hbWVcblx0cmV0dXJuIG9iamVjdC5uYW1lXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSAob2JqZWN0KS0+XG5cdGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpXG5cdGlmIGRiW2NvbGxlY3Rpb25fa2V5XVxuXHRcdHJldHVybiBkYltjb2xsZWN0aW9uX2tleV1cblx0ZWxzZSBpZiBvYmplY3QuZGJcblx0XHRyZXR1cm4gb2JqZWN0LmRiXG5cblx0aWYgQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cblx0ZWxzZVxuXHRcdGlmIG9iamVjdC5jdXN0b21cblx0XHRcdHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpXG5cdFx0ZWxzZVxuXHRcdFx0aWYgY29sbGVjdGlvbl9rZXkgPT0gJ19zbXNfcXVldWUnICYmIFNNU1F1ZXVlPy5jb2xsZWN0aW9uXG5cdFx0XHRcdHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSlcblxuXG4iLCJ2YXIgc3RlZWRvc0NvcmU7XG5cbnN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0b3JfZGJfdXJsLCBvcGxvZ191cmw7XG4gIGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1I7XG4gIG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SO1xuICBpZiAoY3JlYXRvcl9kYl91cmwpIHtcbiAgICBpZiAoIW9wbG9nX3VybCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge1xuICAgICAgX2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtcbiAgICAgICAgb3Bsb2dVcmw6IG9wbG9nX3VybFxuICAgICAgfSlcbiAgICB9O1xuICB9XG59KTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGNvbGxlY3Rpb25fa2V5O1xuICBjb2xsZWN0aW9uX2tleSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqZWN0KTtcbiAgaWYgKGRiW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBkYltjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSBpZiAob2JqZWN0LmRiKSB7XG4gICAgcmV0dXJuIG9iamVjdC5kYjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdC5jdXN0b20pIHtcbiAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY29sbGVjdGlvbl9rZXkgPT09ICdfc21zX3F1ZXVlJyAmJiAodHlwZW9mIFNNU1F1ZXVlICE9PSBcInVuZGVmaW5lZFwiICYmIFNNU1F1ZXVlICE9PSBudWxsID8gU01TUXVldWUuY29sbGVjdGlvbiA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSk7XG4gICAgfVxuICB9XG59O1xuIiwiQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge31cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdHN0ZWVkb3NGaWx0ZXJzID0gcmVxdWlyZShcIkBzdGVlZG9zL2ZpbHRlcnNcIik7XG5cdCMg5a6a5LmJ5YWo5bGAIGFjdGlvbnMg5Ye95pWwXHRcblx0Q3JlYXRvci5hY3Rpb25zID0gKGFjdGlvbnMpLT5cblx0XHRfLmVhY2ggYWN0aW9ucywgKHRvZG8sIGFjdGlvbl9uYW1lKS0+XG5cdFx0XHRDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbyBcblxuXHRDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSAob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKS0+XG5cdFx0aWYgYWN0aW9uICYmIGFjdGlvbi50eXBlID09ICd3b3JkLXByaW50J1xuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdGZpbHRlcnMgPSBbJ19pZCcsICc9JywgcmVjb3JkX2lkXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmaWx0ZXJzID0gT2JqZWN0R3JpZC5nZXRGaWx0ZXJzKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGZhbHNlLCBudWxsLCBudWxsKVxuXHRcdFx0dXJsID0gXCIvYXBpL3Y0L3dvcmRfdGVtcGxhdGVzL1wiICsgYWN0aW9uLndvcmRfdGVtcGxhdGUgKyBcIi9wcmludFwiICsgXCI/ZmlsdGVycz1cIiArIHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkoZmlsdGVycyk7XG5cdFx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG5cdFx0XHRyZXR1cm4gd2luZG93Lm9wZW4odXJsKTtcblxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmIGFjdGlvbj8udG9kb1xuXHRcdFx0aWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwic3RyaW5nXCJcblx0XHRcdFx0dG9kbyA9IENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb24udG9kb11cblx0XHRcdGVsc2UgaWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHR0b2RvID0gYWN0aW9uLnRvZG9cdFxuXHRcdFx0aWYgIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWRcblx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdGlmIHRvZG9cblx0XHRcdFx0IyBpdGVtX2VsZW1lbnTkuLrnqbrml7blupTor6Xorr7nva7pu5jorqTlgLzvvIjlr7nosaHnmoRuYW1l5a2X5q6177yJ77yM5ZCm5YiZbW9yZUFyZ3Pmi7/liLDnmoTlkI7nu63lj4LmlbDkvY3nva7lsLHkuI3lr7lcblx0XHRcdFx0aXRlbV9lbGVtZW50ID0gaWYgaXRlbV9lbGVtZW50IHRoZW4gaXRlbV9lbGVtZW50IGVsc2UgXCJcIlxuXHRcdFx0XHRtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMylcblx0XHRcdFx0dG9kb0FyZ3MgPSBbb2JqZWN0X25hbWUsIHJlY29yZF9pZF0uY29uY2F0KG1vcmVBcmdzKVxuXHRcdFx0XHR0b2RvLmFwcGx5IHtcblx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZWNvcmRfaWQ6IHJlY29yZF9pZFxuXHRcdFx0XHRcdG9iamVjdDogb2JqXG5cdFx0XHRcdFx0YWN0aW9uOiBhY3Rpb25cblx0XHRcdFx0XHRpdGVtX2VsZW1lbnQ6IGl0ZW1fZWxlbWVudFxuXHRcdFx0XHRcdHJlY29yZDogcmVjb3JkXG5cdFx0XHRcdH0sIHRvZG9BcmdzXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKVxuXHRcdGVsc2Vcblx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKVxuXG5cdFx0XHRcdFxuXG5cdENyZWF0b3IuYWN0aW9ucyBcblx0XHQjIOWcqOatpOWumuS5ieWFqOWxgCBhY3Rpb25zXG5cdFx0XCJzdGFuZGFyZF9xdWVyeVwiOiAoKS0+XG5cdFx0XHRNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIilcblxuXHRcdFwic3RhbmRhcmRfbmV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdCNUT0RPIOS9v+eUqOWvueixoeeJiOacrOWIpOaWrVxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuXHRcdFx0aW5pdGlhbFZhbHVlcz17fVxuXHRcdFx0c2VsZWN0ZWRSb3dzID0gd2luZG93LmdyaWRSZWYuY3VycmVudC5hcGkuZ2V0U2VsZWN0ZWRSb3dzKClcblx0XHRcdGlmIHNlbGVjdGVkUm93cz8ubGVuZ3RoXG5cdFx0XHRcdHJlY29yZF9pZCA9IHNlbGVjdGVkUm93c1swXS5faWQ7XG5cdFx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKVxuXG5cdFx0XHRpZiBvYmplY3Q/LnZlcnNpb24gPj0gMlxuXHRcdFx0XHRyZXR1cm4gU3RlZWRvc1VJLnNob3dNb2RhbChzdG9yZXMuQ29tcG9uZW50UmVnaXN0cnkuY29tcG9uZW50cy5PYmplY3RGb3JtLCB7XG5cdFx0XHRcdFx0bmFtZTogXCIje29iamVjdF9uYW1lfV9zdGFuZGFyZF9uZXdfZm9ybVwiLFxuXHRcdFx0XHRcdG9iamVjdEFwaU5hbWU6IG9iamVjdF9uYW1lLFxuXHRcdFx0XHRcdHRpdGxlOiAn5paw5bu6Jyxcblx0XHRcdFx0XHRpbml0aWFsVmFsdWVzOiBpbml0aWFsVmFsdWVzLFxuXHRcdFx0XHRcdGFmdGVySW5zZXJ0OiAocmVzdWx0KS0+XG5cdFx0XHRcdFx0XHRpZihyZXN1bHQubGVuZ3RoID4gMClcblx0XHRcdFx0XHRcdFx0cmVjb3JkID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpLT5cblx0XHRcdFx0XHRcdFx0XHRhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdHVybCA9IFwiL2FwcC8je2FwcF9pZH0vI3tvYmplY3RfbmFtZX0vdmlldy8je3JlY29yZC5faWR9XCJcblx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLmdvIHVybFxuXHRcdFx0XHRcdFx0XHQsIDEpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdFx0XHR9LCBudWxsLCB7aWNvblBhdGg6ICcvYXNzZXRzL2ljb25zJ30pXG5cdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdGlmIHNlbGVjdGVkUm93cz8ubGVuZ3RoXG5cdFx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXG5cdFx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblx0XHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0JChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpXG5cdFx0XHRyZXR1cm4gXG5cblx0XHRcInN0YW5kYXJkX29wZW5fdmlld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZilcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XCJzdGFuZGFyZF9lZGl0XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG5cdFx0XHRcdGlmIG9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRcdFx0cmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuXHRcdFx0XHRcdFx0bmFtZTogXCIje29iamVjdF9uYW1lfV9zdGFuZGFyZF9lZGl0X2Zvcm1cIixcblx0XHRcdFx0XHRcdG9iamVjdEFwaU5hbWU6IG9iamVjdF9uYW1lLFxuXHRcdFx0XHRcdFx0cmVjb3JkSWQ6IHJlY29yZF9pZCxcblx0XHRcdFx0XHRcdHRpdGxlOiAn57yW6L6RJyxcblx0XHRcdFx0XHRcdGFmdGVyVXBkYXRlOiAoKS0+XG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCktPlxuXHRcdFx0XHRcdFx0XHRcdGlmIEZsb3dSb3V0ZXIuY3VycmVudCgpLnJvdXRlLnBhdGguZW5kc1dpdGgoXCIvOnJlY29yZF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5ncmlkUmVmLmN1cnJlbnQuYXBpLnJlZnJlc2hTZXJ2ZXJTaWRlU3RvcmUoKVxuXHRcdFx0XHRcdFx0XHQsIDEpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9LCBudWxsLCB7aWNvblBhdGg6ICcvYXNzZXRzL2ljb25zJ30pXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBmYWxzZVxuI1x0XHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCByZWNvcmRcbiNcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ3JlbG9hZF9keGxpc3QnLCBmYWxzZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkXG5cdFx0XHRcdFx0aWYgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0XHRcdCQoXCIuYnRuLWVkaXQtcmVjb3JkXCIpLmNsaWNrKClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkXG5cdFx0XHRcdFx0aWYgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0XHRcdFx0XHQkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKVxuXG5cdFx0XCJzdGFuZGFyZF9kZWxldGVcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjayktPlxuXHRcdFx0YmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge19pZDogcmVjb3JkX2lkfSlcblx0XHRcdGlmICFiZWZvcmVIb29rXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdFx0XHRpZighXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIHJlY29yZF90aXRsZT8ubmFtZSlcblx0XHRcdFx0cmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlPy5uYW1lXG5cblx0XHRcdGlmIHJlY29yZF90aXRsZVxuXHRcdFx0XHR0ZXh0ID0gdCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgXCIje29iamVjdC5sYWJlbH0gXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0ZXh0ID0gdCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgXCIje29iamVjdC5sYWJlbH1cIlxuXHRcdFx0c3dhbFxuXHRcdFx0XHR0aXRsZTogdCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCIsIFwiI3tvYmplY3QubGFiZWx9XCJcblx0XHRcdFx0dGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz4je3RleHR9PC9kaXY+XCJcblx0XHRcdFx0aHRtbDogdHJ1ZVxuXHRcdFx0XHRzaG93Q2FuY2VsQnV0dG9uOnRydWVcblx0XHRcdFx0Y29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpXG5cdFx0XHRcdGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXG5cdFx0XHRcdChvcHRpb24pIC0+XG5cdFx0XHRcdFx0aWYgb3B0aW9uXG5cdFx0XHRcdFx0XHRwcmV2aW91c0RvYyA9IEZvcm1NYW5hZ2VyLmdldFByZXZpb3VzRG9jKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICdkZWxldGUnKVxuXHRcdFx0XHRcdFx0Q3JlYXRvci5vZGF0YS5kZWxldGUgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgKCktPlxuXHRcdFx0XHRcdFx0XHRpZiByZWNvcmRfdGl0bGVcblx0XHRcdFx0XHRcdFx0XHQjIGluZm8gPSBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCIgKyBcIuW3suWIoOmZpFwiXG5cdFx0XHRcdFx0XHRcdFx0aW5mbyA9dCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKVxuXHRcdFx0XHRcdFx0XHR0b2FzdHIuc3VjY2VzcyBpbmZvXG5cdFx0XHRcdFx0XHRcdCMg5paH5Lu254mI5pys5Li6XCJjZnMuZmlsZXMuZmlsZXJlY29yZFwi77yM6ZyA6KaB5pu/5o2i5Li6XCJjZnMtZmlsZXMtZmlsZXJlY29yZFwiXG5cdFx0XHRcdFx0XHRcdGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZyxcIi1cIilcblx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdHVubGVzcyBncmlkQ29udGFpbmVyPy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRpZiB3aW5kb3cub3BlbmVyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc09wZW5lclJlbW92ZSA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdGlmIEZsb3dSb3V0ZXIuY3VycmVudCgpLnJvdXRlLnBhdGguZW5kc1dpdGgoXCIvOnJlY29yZF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0X25hbWUgIT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5ncmlkUmVmLmN1cnJlbnQuYXBpLnJlZnJlc2hTZXJ2ZXJTaWRlU3RvcmUoKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBfZVxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoX2UpO1xuXHRcdFx0XHRcdFx0XHRpZiBncmlkQ29udGFpbmVyPy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3RyZWVcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJylcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpXG5cdFx0XHRcdFx0XHRcdGlmIGR4RGF0YUdyaWRJbnN0YW5jZVxuXHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdF9uYW1lICE9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0VGVtcGxhdGUuY3JlYXRvcl9ncmlkLnJlZnJlc2goZHhEYXRhR3JpZEluc3RhbmNlKVxuXHRcdFx0XHRcdFx0XHRyZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0XHR0ZW1wTmF2UmVtb3ZlZCA9IENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCkgI+aXoOiuuuaYr+WcqOiusOW9leivpue7hueVjOmdoui/mOaYr+WIl+ihqOeVjOmdouaJp+ihjOWIoOmZpOaTjeS9nO+8jOmDveS8muaKiuS4tOaXtuWvvOiIquWIoOmZpOaOiVxuXHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZSBvciAhZHhEYXRhR3JpZEluc3RhbmNlXG5cdFx0XHRcdFx0XHRcdFx0aWYgaXNPcGVuZXJSZW1vdmVcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5jbG9zZSgpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgYW5kIGxpc3Rfdmlld19pZCAhPSAnY2FsZW5kYXInXG5cdFx0XHRcdFx0XHRcdFx0XHRhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpc3Rfdmlld19pZCA9IFwiYWxsXCJcblx0XHRcdFx0XHRcdFx0XHRcdHVubGVzcyB0ZW1wTmF2UmVtb3ZlZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOehruWunuWIoOmZpOS6huS4tOaXtuWvvOiIqu+8jOWwseWPr+iDveW3sue7j+mHjeWumuWQkeWIsOS4iuS4gOS4qumhtemdouS6hu+8jOayoeW/heimgeWGjemHjeWumuWQkeS4gOasoVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLmdvIFwiL2FwcC8je2FwcGlkfS8je29iamVjdF9uYW1lfS9ncmlkLyN7bGlzdF92aWV3X2lkfVwiXG5cdFx0XHRcdFx0XHRcdGlmIGNhbGxfYmFjayBhbmQgdHlwZW9mIGNhbGxfYmFjayA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0XHRcdFx0XHRjYWxsX2JhY2soKVxuXG5cdFx0XHRcdFx0XHRcdEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYWZ0ZXInLCB7X2lkOiByZWNvcmRfaWQsIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY30pXG5cdFx0XHRcdFx0XHQsIChlcnJvciktPlxuXHRcdFx0XHRcdFx0XHRGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2Vycm9yJywge19pZDogcmVjb3JkX2lkLCBlcnJvcjogZXJyb3J9KSIsInZhciBzdGVlZG9zRmlsdGVycztcblxuQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgc3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkKSB7XG4gICAgdmFyIGZpbHRlcnMsIG1vcmVBcmdzLCBvYmosIHRvZG8sIHRvZG9BcmdzLCB1cmw7XG4gICAgaWYgKGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gJ3dvcmQtcHJpbnQnKSB7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGZpbHRlcnMgPSBbJ19pZCcsICc9JywgcmVjb3JkX2lkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbHRlcnMgPSBPYmplY3RHcmlkLmdldEZpbHRlcnMob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZmFsc2UsIG51bGwsIG51bGwpO1xuICAgICAgfVxuICAgICAgdXJsID0gXCIvYXBpL3Y0L3dvcmRfdGVtcGxhdGVzL1wiICsgYWN0aW9uLndvcmRfdGVtcGxhdGUgKyBcIi9wcmludFwiICsgXCI/ZmlsdGVycz1cIiArIHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkoZmlsdGVycyk7XG4gICAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG4gICAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsKTtcbiAgICB9XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwKSB7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uLnRvZG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0b2RvID0gYWN0aW9uLnRvZG87XG4gICAgICB9XG4gICAgICBpZiAoIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICAgICAgcmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB9XG4gICAgICBpZiAodG9kbykge1xuICAgICAgICBpdGVtX2VsZW1lbnQgPSBpdGVtX2VsZW1lbnQgPyBpdGVtX2VsZW1lbnQgOiBcIlwiO1xuICAgICAgICBtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG4gICAgICAgIHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncyk7XG4gICAgICAgIHJldHVybiB0b2RvLmFwcGx5KHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgb2JqZWN0OiBvYmosXG4gICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgaXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnQsXG4gICAgICAgICAgcmVjb3JkOiByZWNvcmRcbiAgICAgICAgfSwgdG9kb0FyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKTtcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuYWN0aW9ucyh7XG4gICAgXCJzdGFuZGFyZF9xdWVyeVwiOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIik7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX25ld1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBpbml0aWFsVmFsdWVzLCBvYmplY3QsIHNlbGVjdGVkUm93cztcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgIHNlbGVjdGVkUm93cyA9IHdpbmRvdy5ncmlkUmVmLmN1cnJlbnQuYXBpLmdldFNlbGVjdGVkUm93cygpO1xuICAgICAgaWYgKHNlbGVjdGVkUm93cyAhPSBudWxsID8gc2VsZWN0ZWRSb3dzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICByZWNvcmRfaWQgPSBzZWxlY3RlZFJvd3NbMF0uX2lkO1xuICAgICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgICAgaW5pdGlhbFZhbHVlcyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFsVmFsdWVzID0gRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0LnZlcnNpb24gOiB2b2lkIDApID49IDIpIHtcbiAgICAgICAgcmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuICAgICAgICAgIG5hbWU6IG9iamVjdF9uYW1lICsgXCJfc3RhbmRhcmRfbmV3X2Zvcm1cIixcbiAgICAgICAgICBvYmplY3RBcGlOYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICB0aXRsZTogJ+aWsOW7uicsXG4gICAgICAgICAgaW5pdGlhbFZhbHVlczogaW5pdGlhbFZhbHVlcyxcbiAgICAgICAgICBhZnRlckluc2VydDogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICB2YXIgcmVjb3JkO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHJlY29yZCA9IHJlc3VsdFswXTtcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXBwX2lkLCB1cmw7XG4gICAgICAgICAgICAgICAgYXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gICAgICAgICAgICAgICAgdXJsID0gXCIvYXBwL1wiICsgYXBwX2lkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL3ZpZXcvXCIgKyByZWNvcmQuX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBGbG93Um91dGVyLmdvKHVybCk7XG4gICAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIG51bGwsIHtcbiAgICAgICAgICBpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChzZWxlY3RlZFJvd3MgIT0gbnVsbCA/IHNlbGVjdGVkUm93cy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgfVxuICAgICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX29wZW5fdmlld1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBocmVmO1xuICAgICAgaHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgRmxvd1JvdXRlci5yZWRpcmVjdChocmVmKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfZWRpdFwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBvYmplY3Q7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgICAgaWYgKChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC52ZXJzaW9uIDogdm9pZCAwKSA+PSAyKSB7XG4gICAgICAgICAgcmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuICAgICAgICAgICAgbmFtZTogb2JqZWN0X25hbWUgKyBcIl9zdGFuZGFyZF9lZGl0X2Zvcm1cIixcbiAgICAgICAgICAgIG9iamVjdEFwaU5hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgcmVjb3JkSWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICAgIHRpdGxlOiAn57yW6L6RJyxcbiAgICAgICAgICAgIGFmdGVyVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gRmxvd1JvdXRlci5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5ncmlkUmVmLmN1cnJlbnQuYXBpLnJlZnJlc2hTZXJ2ZXJTaWRlU3RvcmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBudWxsLCB7XG4gICAgICAgICAgICBpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBmYWxzZSkge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLWVkaXQtcmVjb3JkXCIpLmNsaWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgICByZXR1cm4gTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gJChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwic3RhbmRhcmRfZGVsZXRlXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaykge1xuICAgICAgdmFyIGJlZm9yZUhvb2ssIG9iamVjdCwgdGV4dDtcbiAgICAgIGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtcbiAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCFiZWZvcmVIb29rKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGlmICghXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIChyZWNvcmRfdGl0bGUgIT0gbnVsbCA/IHJlY29yZF90aXRsZS5uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGUgIT0gbnVsbCA/IHJlY29yZF90aXRsZS5uYW1lIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICB0ZXh0ID0gdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgb2JqZWN0LmxhYmVsICsgXCIgXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCIsIFwiXCIgKyBvYmplY3QubGFiZWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN3YWwoe1xuICAgICAgICB0aXRsZTogdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCIsIFwiXCIgKyBvYmplY3QubGFiZWwpLFxuICAgICAgICB0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPlwiICsgdGV4dCArIFwiPC9kaXY+XCIsXG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKSxcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcbiAgICAgIH0sIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB2YXIgcHJldmlvdXNEb2M7XG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICBwcmV2aW91c0RvYyA9IEZvcm1NYW5hZ2VyLmdldFByZXZpb3VzRG9jKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICdkZWxldGUnKTtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5vZGF0YVtcImRlbGV0ZVwiXShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBfZSwgYXBwaWQsIGR4RGF0YUdyaWRJbnN0YW5jZSwgZ3JpZENvbnRhaW5lciwgZ3JpZE9iamVjdE5hbWVDbGFzcywgaW5mbywgaXNPcGVuZXJSZW1vdmUsIHJlY29yZFVybCwgdGVtcE5hdlJlbW92ZWQ7XG4gICAgICAgICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgICAgICAgIGluZm8gPSB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVfc3VjXCIsIG9iamVjdC5sYWJlbCArIChcIlxcXCJcIiArIHJlY29yZF90aXRsZSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpbmZvID0gdCgnY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfc3VjJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhpbmZvKTtcbiAgICAgICAgICAgIGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZywgXCItXCIpO1xuICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgaWYgKCEoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XG4gICAgICAgICAgICAgICAgaXNPcGVuZXJSZW1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZ3JpZFJlZi5jdXJyZW50LmFwaS5yZWZyZXNoU2VydmVyU2lkZVN0b3JlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBfZSA9IGVycm9yMTtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihfZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0X25hbWUgIT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikpIHtcbiAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgICAgIHRlbXBOYXZSZW1vdmVkID0gQ3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKTtcbiAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSB8fCAhZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgJiYgbGlzdF92aWV3X2lkICE9PSAnY2FsZW5kYXInKSB7XG4gICAgICAgICAgICAgICAgYXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICAgICAgICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgICAgICAgICAgICBsaXN0X3ZpZXdfaWQgPSBcImFsbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRlbXBOYXZSZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcC9cIiArIGFwcGlkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgY2FsbF9iYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtcbiAgICAgICAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgICAgIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2Vycm9yJywge1xuICAgICAgICAgICAgICBfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
