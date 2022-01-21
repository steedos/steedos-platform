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
      built_in_plugins: ["@steedos/workflow", "@steedos/accounts", "@steedos/steedos-plugin-schema-builder", "@steedos/plugin-enterprise", "@steedos/metadata-api", "@steedos/plugin-dingtalk", "@steedos/data-import", "@steedos/service-fields-indexs", "@steedos/service-accounts", "@steedos/service-charts", "@steedos/service-pages", "@steedos/service-cloud-init", "@steedos/service-package-registry"],
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
          if (_.isEmpty(relatedListMap[related_object_name] || related_field.type === "master_detail")) {
            return relatedListMap[related_object_name] = {
              object_name: related_object_name,
              foreign_key: related_field_name,
              write_requires_master_read: related_field.write_requires_master_read
            };
          }
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
    var sfsFilesObject;

    if (related_object_name === "cfs.files.filerecord") {
      sfsFilesObject = Creator.getObject("cfs.files.filerecord");
      sfsFilesObject && (related_object = sfsFilesObject);
    }

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

  if (po.allowRead) {
    typeof po.allowReadFiles !== "boolean" && (po.allowReadFiles = true);
    typeof po.viewAllFiles !== "boolean" && (po.viewAllFiles = true);
  }

  if (po.allowEdit) {
    typeof po.allowCreateFiles !== "boolean" && (po.allowCreateFiles = true);
    typeof po.allowEditFiles !== "boolean" && (po.allowEditFiles = true);
    typeof po.allowDeleteFiles !== "boolean" && (po.allowDeleteFiles = true);
  }

  if (po.modifyAllRecords) {
    typeof po.modifyAllFiles !== "boolean" && (po.modifyAllFiles = true);
  }

  if (po.allowCreateFiles) {
    po.allowReadFiles = true;
  }

  if (po.allowEditFiles) {
    po.allowReadFiles = true;
  }

  if (po.allowDeleteFiles) {
    po.allowEditFiles = true;
    po.allowReadFiles = true;
  }

  if (po.viewAllFiles) {
    po.allowReadFiles = true;
  }

  if (po.modifyAllFiles) {
    po.allowReadFiles = true;
    po.allowEditFiles = true;
    po.allowDeleteFiles = true;
    po.viewAllFiles = true;
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
            "instance_state": 1,
            "locked": 1
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

      if (_.isArray(layoutRelatedList)) {
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

      columns = Creator.getObjectFirstListViewColumns(related_object_name) || ["name"];
      columns = _.without(columns, related_field_name);
      mobile_columns = Creator.getObjectFirstListViewColumns(related_object_name, true) || ["name"];
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

  list_view = _.find(listViews, function (item) {
    return item._id === list_view_id || item.name === list_view_id;
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
       获取对象的列表第一个视图显示的字段
    */

Creator.getObjectFirstListViewColumns = function (object_name, use_mobile_columns) {
  var columns, defaultView;
  defaultView = Creator.getObjectFirstListView(object_name);
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

  if (self.name !== "users" && self.name !== "cfs.files.filerecord" && !self.is_view && !_.contains(["flows", "forms", "instances", "organizations", "action_field_updates", "object_listviews"], self.name)) {
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
Creator.getSelectOptions = function (fieldSchema) {
  var data_type, options;
  options = fieldSchema.options;

  if (!options) {
    return;
  }

  data_type = fieldSchema.data_type;

  if (!_.isFunction(options) && data_type && data_type !== 'text') {
    options.forEach(function (optionItem) {
      if (typeof optionItem.value !== 'string') {
        return;
      }

      if (['number', 'currency', 'percent'].indexOf(data_type) > -1) {
        return optionItem.value = Number(optionItem.value);
      } else if (data_type === 'boolean') {
        return optionItem.value = optionItem.value === 'true';
      }
    });
  }

  return options;
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
    var _object, _ref_obj, _reference_to, autoform_type, collectionName, field_name, fs, fsType, isUnLimited, locale, permissions, ref, ref1, ref2, ref3;

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

      if (field.data_type && field.data_type !== "text") {
        if (["number", "currency", "percent"].indexOf(field.data_type) > -1) {
          fsType = Number;
          fs.decimal = true;
        } else if (field.data_type === "boolean") {
          fsType = Boolean;
        } else {
          fsType = String;
        }

        fs.type = fsType;

        if (field.multiple) {
          fs.type = [fsType];
        }

        fs.autoform.options = Creator.getSelectOptions(field);
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
    } else if (field.type === "file") {
      collectionName = field.collection || "files";

      if (field.multiple) {
        fs.type = [String];
        schema[field_name + ".$"] = {
          autoform: {
            type: 'fileUpload',
            collection: collectionName
          }
        };
      } else {
        fs.type = String;
        fs.autoform.type = 'fileUpload';
        fs.autoform.collection = collectionName;
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
var baseBooleanPermissionPropNames, clone, extendPermissionProps, findOne_permission_object, find_permission_object, intersectionPlus, otherPermissionPropNames, overlayBaseBooleanPermissionProps, permissionPropNames, unionPermissionObjects, unionPlus;
clone = require('clone');
baseBooleanPermissionPropNames = ["allowCreate", "allowDelete", "allowEdit", "allowRead", "modifyAllRecords", "viewAllRecords", "modifyCompanyRecords", "viewCompanyRecords", "allowReadFiles", "allowEditFiles", "allowCreateFiles", "allowDeleteFiles", "viewAllFiles", "modifyAllFiles"];
otherPermissionPropNames = ["disabled_list_views", "disabled_actions", "unreadable_fields", "uneditable_fields", "unrelated_objects", "uneditable_related_list"];
permissionPropNames = _.union(baseBooleanPermissionPropNames, otherPermissionPropNames);

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
  var isOwner, masterObjectName, masterRecordPerm, permissions, record_company_id, record_company_ids, ref, user_company_ids;

  if (!object_name && Meteor.isClient) {
    object_name = Session.get("object_name");
  }

  if (!spaceId && Meteor.isClient) {
    spaceId = Session.get("spaceId");
  }

  permissions = _.clone(Creator.getPermissions(object_name, spaceId, userId));

  if (record) {
    if (record.record_permissions) {
      return record.record_permissions;
    }

    isOwner = record.owner === userId || ((ref = record.owner) != null ? ref._id : void 0) === userId;

    if (object_name === "cms_files") {
      masterObjectName = record.parent['reference_to._o'];
      masterRecordPerm = Creator.getPermissions(masterObjectName, spaceId, userId);
      permissions.allowCreate = permissions.allowCreate && masterRecordPerm.allowCreateFiles;
      permissions.allowEdit = permissions.allowEdit && masterRecordPerm.allowEditFiles;
      permissions.allowDelete = permissions.allowDelete && masterRecordPerm.allowDeleteFiles;

      if (!masterRecordPerm.modifyAllFiles && !isOwner) {
        permissions.allowEdit = false;
        permissions.allowDelete = false;
      }

      permissions.allowRead = permissions.allowRead && masterRecordPerm.allowReadFiles;

      if (!masterRecordPerm.viewAllFiles && !isOwner) {
        permissions.allowRead = false;
      }
    } else {
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

    masterRecordPerm = Creator.getRecordPermissions(currentObjectName, currentRecord, userId, spaceId);
    relatedObjectPermissions = Creator.getPermissions(relatedListItem.object_name);
    result = _.clone(relatedObjectPermissions);

    if (relatedListItem.is_file) {
      result.allowCreate = relatedObjectPermissions.allowCreate && masterRecordPerm.allowCreateFiles;
      result.allowEdit = relatedObjectPermissions.allowEdit && masterRecordPerm.allowEditFiles;
    } else {
      write_requires_master_read = relatedListItem.write_requires_master_read || false;
      masterAllow = false;

      if (write_requires_master_read === true) {
        masterAllow = masterRecordPerm.allowRead;
      } else if (write_requires_master_read === false) {
        masterAllow = masterRecordPerm.allowEdit;
      }

      uneditable_related_list = Creator.getRecordSafeRelatedList(currentRecord, currentObjectName);
      isRelateObjectUneditable = uneditable_related_list.indexOf(relatedListItem.object_name) > -1;
      result.allowCreate = masterAllow && relatedObjectPermissions.allowCreate && !isRelateObjectUneditable;
      result.allowEdit = masterAllow && relatedObjectPermissions.allowEdit && !isRelateObjectUneditable;
    }

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

  extendPermissionProps = function (target, props) {
    var filesProNames, propNames;
    propNames = permissionPropNames;
    return filesProNames = props ? _.each(propNames, function (propName) {
      return target[propName] = props[propName];
    }) : void 0;
  };

  overlayBaseBooleanPermissionProps = function (target, props) {
    var propNames;
    propNames = baseBooleanPermissionPropNames;
    return _.each(propNames, function (propName) {
      if (props[propName]) {
        return target[propName] = true;
      }
    });
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
      extendPermissionProps(opsetAdmin, posAdmin);
    }

    if (psetsUser) {
      posUser = findOne_permission_object(psetsUser_pos, object_name, psetsUser._id);
      extendPermissionProps(opsetUser, posUser);
    }

    if (psetsMember) {
      posMember = findOne_permission_object(psetsMember_pos, object_name, psetsMember._id);
      extendPermissionProps(opsetMember, posMember);
    }

    if (psetsGuest) {
      posGuest = findOne_permission_object(psetsGuest_pos, object_name, psetsGuest._id);
      extendPermissionProps(opsetGuest, posGuest);
    }

    if (psetsSupplier) {
      posSupplier = findOne_permission_object(psetsSupplier_pos, object_name, psetsSupplier._id);
      extendPermissionProps(opsetSupplier, posSupplier);
    }

    if (psetsCustomer) {
      posCustomer = findOne_permission_object(psetsCustomer_pos, object_name, psetsCustomer._id);
      extendPermissionProps(opsetCustomer, posCustomer);
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

        overlayBaseBooleanPermissionProps(permissions, po);
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
var _deleteRecord, steedosFilters;

Creator.actionsByName = {};

if (Meteor.isClient) {
  steedosFilters = require("@steedos/filters");

  Creator.actions = function (actions) {
    return _.each(actions, function (todo, action_name) {
      return Creator.actionsByName[action_name] = todo;
    });
  };

  Creator.executeAction = function (object_name, action, record_id, item_element, list_view_id, record, callback) {
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

  _deleteRecord = function (object_name, record_id, record_title, list_view_id, record, call_back, call_back_error) {
    var object, previousDoc;
    object = Creator.getObject(object_name);
    previousDoc = FormManager.getPreviousDoc(object_name, record_id, 'delete');
    return Creator.odata["delete"](object_name, record_id, function () {
      var info;

      if (record_title) {
        info = t("creator_record_remove_swal_title_suc", object.label + ("\"" + record_title + "\""));
      } else {
        info = t('creator_record_remove_swal_suc');
      }

      toastr.success(info);

      if (call_back && typeof call_back === "function") {
        call_back();
      }

      return FormManager.runHook(object_name, 'delete', 'after', {
        _id: record_id,
        previousDoc: previousDoc
      });
    }, function (error) {
      if (call_back_error && typeof call_back_error === "function") {
        call_back_error();
      }

      return FormManager.runHook(object_name, 'delete', 'error', {
        _id: record_id,
        error: error
      });
    });
  };

  Creator.actions({
    "standard_query": function () {
      return Modal.show("standard_query_modal");
    },
    "standard_new": function (object_name, record_id, fields) {
      var initialValues, object, ref, ref1, ref2, selectedRows;
      object = Creator.getObject(object_name);
      initialValues = {};
      selectedRows = (ref = window.gridRef) != null ? (ref1 = ref.current) != null ? (ref2 = ref1.api) != null ? ref2.getSelectedRows() : void 0 : void 0 : void 0;

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
          title: '新建 ' + object.label,
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
            title: '编辑 ' + object.label,
            afterUpdate: function () {
              setTimeout(function () {
                if (FlowRouter.current().route.path.endsWith("/:record_id")) {
                  FlowRouter.reload();
                  return SteedosUI.reloadRecord(Session.get("object_name"), Session.get("record_id"));
                } else {
                  window.refreshDxSchedulerInstance();
                  return window.refreshGrid();
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
      var beforeHook, i18nTextKey, i18nTitleKey, nameField, object, selectedRecords, text;

      if (record_id) {
        beforeHook = FormManager.runHook(object_name, 'delete', 'before', {
          _id: record_id
        });

        if (!beforeHook) {
          return false;
        }
      }

      object = Creator.getObject(object_name);
      nameField = object.NAME_FIELD_KEY || "name";

      if (!list_view_id) {
        list_view_id = Session.get("list_view_id");
      }

      if (!list_view_id) {
        list_view_id = "all";
      }

      if (!_.isString(record_title) && record_title) {
        record_title = record_title[nameField];
      }

      if (record && !record_title) {
        record_title = record[nameField];
      }

      i18nTitleKey = "creator_record_remove_swal_title";
      i18nTextKey = "creator_record_remove_swal_text";

      if (!record_id) {
        i18nTitleKey = "creator_record_remove_many_swal_title";
        i18nTextKey = "creator_record_remove_many_swal_text";
        selectedRecords = SteedosUI.getTableSelectedRows(list_view_id);

        if (!selectedRecords || !selectedRecords.length) {
          toastr.warning(t("creator_record_remove_many_no_selection"));
          return;
        }
      }

      if (record_title) {
        text = t(i18nTextKey, object.label + " \"" + record_title + "\"");
      } else {
        text = t(i18nTextKey, "" + object.label);
      }

      return swal({
        title: t(i18nTitleKey, "" + object.label),
        text: "<div class='delete-creator-warning'>" + text + "</div>",
        html: true,
        showCancelButton: true,
        confirmButtonText: t('Delete'),
        cancelButtonText: t('Cancel')
      }, function (option) {
        var afterBatchesDelete, deleteCounter;

        if (option) {
          if (record_id) {
            return _deleteRecord(object_name, record_id, record_title, list_view_id, record, function () {
              var _e, appid, current_object_name, current_record_id, dxDataGridInstance, gridContainer, gridObjectNameClass, isOpenerRemove, recordUrl, tempNavRemoved;

              gridObjectNameClass = object_name.replace(/\./g, "-");
              gridContainer = $(".gridContainer." + gridObjectNameClass);

              if (!(gridContainer != null ? gridContainer.length : void 0)) {
                if (window.opener) {
                  isOpenerRemove = false;
                  gridContainer = window.opener.$(".gridContainer." + gridObjectNameClass);
                }
              }

              try {
                current_object_name = Session.get("object_name");
                current_record_id = Session.get("record_id");

                if (Creator.getObject(current_object_name).version > 1) {
                  SteedosUI.reloadRecord(current_object_name, current_record_id);
                }

                if (FlowRouter.current().route.path.endsWith("/:record_id")) {
                  if (object_name !== Session.get("object_name")) {
                    FlowRouter.reload();
                  }
                } else {
                  window.refreshGrid();
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

                  if (!tempNavRemoved) {
                    FlowRouter.go("/app/" + appid + "/" + object_name + "/grid/" + list_view_id);
                  }
                }
              }

              if (call_back && typeof call_back === "function") {
                return call_back();
              }
            });
          } else {
            if (selectedRecords && selectedRecords.length) {
              $("body").addClass("loading");
              deleteCounter = 0;

              afterBatchesDelete = function () {
                deleteCounter++;

                if (deleteCounter >= selectedRecords.length) {
                  $("body").removeClass("loading");
                  return window.refreshGrid();
                }
              };

              return selectedRecords.forEach(function (record) {
                var recordTitle;
                record_id = record._id;
                beforeHook = FormManager.runHook(object_name, 'delete', 'before', {
                  _id: record_id
                });

                if (!beforeHook) {
                  afterBatchesDelete();
                  return;
                }

                recordTitle = record[nameField] || record_id;
                return _deleteRecord(object_name, record._id, recordTitle, list_view_id, record, function () {
                  var recordUrl;
                  recordUrl = Creator.getObjectUrl(object_name, record_id);
                  Creator.removeTempNavItem(object_name, recordUrl);
                  return afterBatchesDelete();
                }, function () {
                  return afterBatchesDelete();
                });
              });
            }
          }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiQVBJU2VydmljZSIsIk1ldGFkYXRhU2VydmljZSIsImNvbmZpZyIsImUiLCJtb2xlY3VsZXIiLCJvYmplY3RxbCIsInBhY2thZ2VMb2FkZXIiLCJwYXRoIiwic2V0dGluZ3MiLCJzdGVlZG9zQ29yZSIsInByb2Nlc3MiLCJlbnYiLCJDUkVBVE9SX05PREVfRU5WIiwicmVxdWlyZSIsImdldFN0ZWVkb3NDb25maWciLCJidWlsdF9pbl9wbHVnaW5zIiwicGx1Z2lucyIsIk1ldGVvciIsInN0YXJ0dXAiLCJhcGlTZXJ2aWNlIiwiYnJva2VyIiwiZXgiLCJtZXRhZGF0YVNlcnZpY2UiLCJzdGFuZGFyZE9iamVjdHNEaXIiLCJzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSIsIlNlcnZpY2VCcm9rZXIiLCJuYW1lc3BhY2UiLCJub2RlSUQiLCJtZXRhZGF0YSIsInRyYW5zcG9ydGVyIiwiVFJBTlNQT1JURVIiLCJjYWNoZXIiLCJDQUNIRVIiLCJsb2dMZXZlbCIsInNlcmlhbGl6ZXIiLCJyZXF1ZXN0VGltZW91dCIsIm1heENhbGxMZXZlbCIsImhlYXJ0YmVhdEludGVydmFsIiwiaGVhcnRiZWF0VGltZW91dCIsImNvbnRleHRQYXJhbXNDbG9uaW5nIiwidHJhY2tpbmciLCJlbmFibGVkIiwic2h1dGRvd25UaW1lb3V0IiwiZGlzYWJsZUJhbGFuY2VyIiwicmVnaXN0cnkiLCJzdHJhdGVneSIsInByZWZlckxvY2FsIiwiYnVsa2hlYWQiLCJjb25jdXJyZW5jeSIsIm1heFF1ZXVlU2l6ZSIsInZhbGlkYXRvciIsImVycm9ySGFuZGxlciIsInRyYWNpbmciLCJleHBvcnRlciIsInR5cGUiLCJvcHRpb25zIiwibG9nZ2VyIiwiY29sb3JzIiwid2lkdGgiLCJnYXVnZVdpZHRoIiwiY3JlYXRlU2VydmljZSIsIm5hbWUiLCJtaXhpbnMiLCJwb3J0IiwiZ2V0U3RlZWRvc1NjaGVtYSIsIlN0YW5kYXJkT2JqZWN0c1BhdGgiLCJwYWNrYWdlSW5mbyIsIndyYXBBc3luYyIsImNiIiwic3RhcnQiLCJ0aGVuIiwic3RhcnRlZCIsIl9yZXN0YXJ0U2VydmljZSIsIldlYkFwcCIsImNvbm5lY3RIYW5kbGVycyIsInVzZSIsImV4cHJlc3MiLCJ3YWl0Rm9yU2VydmljZXMiLCJyZXNvbHZlIiwicmVqZWN0IiwiaW5pdCIsImVycm9yIiwiY29uc29sZSIsIkZpYmVyIiwiZGVwcyIsImFwcCIsIlRyYWNrZXIiLCJEZXBlbmRlbmN5Iiwib2JqZWN0IiwiX1RFTVBMQVRFIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsImZpbHRlcnNGdW5jdGlvbiIsIk1hdGNoIiwiT3B0aW9uYWwiLCJPbmVPZiIsIkZ1bmN0aW9uIiwiU3RyaW5nIiwib3B0aW9uc0Z1bmN0aW9uIiwiY3JlYXRlRnVuY3Rpb24iLCJpc1NlcnZlciIsImZpYmVyTG9hZE9iamVjdHMiLCJvYmoiLCJvYmplY3RfbmFtZSIsImxvYWRPYmplY3RzIiwicnVuIiwibGlzdF92aWV3cyIsInNwYWNlIiwiZ2V0Q29sbGVjdGlvbk5hbWUiLCJfIiwiY2xvbmUiLCJjb252ZXJ0T2JqZWN0IiwiT2JqZWN0IiwiaW5pdFRyaWdnZXJzIiwiaW5pdExpc3RWaWV3cyIsImdldE9iamVjdE5hbWUiLCJnZXRPYmplY3QiLCJzcGFjZV9pZCIsInJlZiIsInJlZjEiLCJpc0FycmF5IiwiaXNDbGllbnQiLCJkZXBlbmQiLCJTZXNzaW9uIiwiZ2V0Iiwib2JqZWN0c0J5TmFtZSIsImdldE9iamVjdEJ5SWQiLCJvYmplY3RfaWQiLCJmaW5kV2hlcmUiLCJfaWQiLCJyZW1vdmVPYmplY3QiLCJsb2ciLCJnZXRDb2xsZWN0aW9uIiwic3BhY2VJZCIsIl9jb2xsZWN0aW9uX25hbWUiLCJyZW1vdmVDb2xsZWN0aW9uIiwiaXNTcGFjZUFkbWluIiwidXNlcklkIiwiZmluZE9uZSIsImZpZWxkcyIsImFkbWlucyIsImluZGV4T2YiLCJldmFsdWF0ZUZvcm11bGEiLCJmb3JtdWxhciIsImNvbnRleHQiLCJpc1N0cmluZyIsIkZvcm11bGFyIiwiY2hlY2tGb3JtdWxhIiwiZXZhbHVhdGVGaWx0ZXJzIiwiZmlsdGVycyIsInNlbGVjdG9yIiwiZWFjaCIsImZpbHRlciIsImFjdGlvbiIsInZhbHVlIiwibGVuZ3RoIiwiaXNDb21tb25TcGFjZSIsImdldE9yZGVybHlTZXRCeUlkcyIsImRvY3MiLCJpZHMiLCJpZF9rZXkiLCJoaXRfZmlyc3QiLCJ2YWx1ZXMiLCJnZXRQcm9wZXJ0eSIsInNvcnRCeSIsImRvYyIsIl9pbmRleCIsInNvcnRpbmdNZXRob2QiLCJ2YWx1ZTEiLCJ2YWx1ZTIiLCJpc1ZhbHVlMUVtcHR5IiwiaXNWYWx1ZTJFbXB0eSIsImxvY2FsZSIsImtleSIsIkRhdGUiLCJnZXRUaW1lIiwiU3RlZWRvcyIsInRvU3RyaW5nIiwibG9jYWxlQ29tcGFyZSIsImdldE9iamVjdFJlbGF0ZWRzIiwiX29iamVjdCIsInBlcm1pc3Npb25zIiwicmVsYXRlZExpc3QiLCJyZWxhdGVkTGlzdE1hcCIsInJlbGF0ZWRfb2JqZWN0cyIsImlzRW1wdHkiLCJvYmpOYW1lIiwiaXNPYmplY3QiLCJvYmplY3ROYW1lIiwicmVsYXRlZF9vYmplY3QiLCJyZWxhdGVkX29iamVjdF9uYW1lIiwicmVsYXRlZF9maWVsZCIsInJlbGF0ZWRfZmllbGRfbmFtZSIsInJlZmVyZW5jZV90byIsImZvcmVpZ25fa2V5Iiwid3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQiLCJlbmFibGVPYmpOYW1lIiwiZ2V0UGVybWlzc2lvbnMiLCJlbmFibGVfYXVkaXQiLCJtb2RpZnlBbGxSZWNvcmRzIiwiZW5hYmxlX2ZpbGVzIiwicHVzaCIsInNmc0ZpbGVzT2JqZWN0Iiwic3BsaWNlIiwiZW5hYmxlX3Rhc2tzIiwiZW5hYmxlX25vdGVzIiwiZW5hYmxlX2V2ZW50cyIsImVuYWJsZV9pbnN0YW5jZXMiLCJlbmFibGVfYXBwcm92YWxzIiwiZW5hYmxlX3Byb2Nlc3MiLCJnZXRVc2VyQ29udGV4dCIsImlzVW5TYWZlTW9kZSIsIlVTRVJfQ09OVEVYVCIsInNwYWNlX3VzZXJfb3JnIiwic3UiLCJzdUZpZWxkcyIsIkVycm9yIiwibW9iaWxlIiwicG9zaXRpb24iLCJlbWFpbCIsImNvbXBhbnkiLCJvcmdhbml6YXRpb24iLCJjb21wYW55X2lkIiwiY29tcGFueV9pZHMiLCJ1c2VyIiwiZnVsbG5hbWUiLCJnZXRSZWxhdGl2ZVVybCIsInVybCIsImlzRnVuY3Rpb24iLCJpc0NvcmRvdmEiLCJzdGFydHNXaXRoIiwidGVzdCIsIl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18iLCJST09UX1VSTF9QQVRIX1BSRUZJWCIsImdldFVzZXJDb21wYW55SWQiLCJnZXRVc2VyQ29tcGFueUlkcyIsInByb2Nlc3NQZXJtaXNzaW9ucyIsInBvIiwiYWxsb3dDcmVhdGUiLCJhbGxvd1JlYWQiLCJhbGxvd0VkaXQiLCJhbGxvd0RlbGV0ZSIsInZpZXdBbGxSZWNvcmRzIiwidmlld0NvbXBhbnlSZWNvcmRzIiwibW9kaWZ5Q29tcGFueVJlY29yZHMiLCJhbGxvd1JlYWRGaWxlcyIsInZpZXdBbGxGaWxlcyIsImFsbG93Q3JlYXRlRmlsZXMiLCJhbGxvd0VkaXRGaWxlcyIsImFsbG93RGVsZXRlRmlsZXMiLCJtb2RpZnlBbGxGaWxlcyIsImdldFRlbXBsYXRlU3BhY2VJZCIsInRlbXBsYXRlU3BhY2VJZCIsImdldENsb3VkQWRtaW5TcGFjZUlkIiwiY2xvdWRBZG1pblNwYWNlSWQiLCJpc1RlbXBsYXRlU3BhY2UiLCJpc0Nsb3VkQWRtaW5TcGFjZSIsInN0ZWVkb3NTdG9yYWdlRGlyIiwiU1RFRURPU19TVE9SQUdFX0RJUiIsIm1ldGhvZHMiLCJjb2xsZWN0aW9uIiwibmFtZV9maWVsZF9rZXkiLCJvcHRpb25zX2xpbWl0IiwicXVlcnkiLCJxdWVyeV9vcHRpb25zIiwicmVjb3JkcyIsInJlc3VsdHMiLCJzZWFyY2hUZXh0UXVlcnkiLCJzZWxlY3RlZCIsInNvcnQiLCJwYXJhbXMiLCJOQU1FX0ZJRUxEX0tFWSIsInNlYXJjaFRleHQiLCIkcmVnZXgiLCIkb3IiLCIkaW4iLCJleHRlbmQiLCIkbmluIiwiZmlsdGVyUXVlcnkiLCJsaW1pdCIsImZpbmQiLCJmZXRjaCIsInJlY29yZCIsImxhYmVsIiwibWVzc2FnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsImJveCIsImN1cnJlbnRfdXNlcl9pZCIsImN1cnJlbnRfdXNlcl9pbmZvIiwiZmxvd0lkIiwiaGFzaERhdGEiLCJpbnMiLCJpbnNJZCIsInJlY29yZF9pZCIsInJlZGlyZWN0X3VybCIsInJlZjIiLCJyZWYzIiwicmVmNCIsIndvcmtmbG93VXJsIiwieF9hdXRoX3Rva2VuIiwieF91c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJib2R5IiwiY2hlY2siLCJpbnN0YW5jZUlkIiwiZmxvdyIsImluYm94X3VzZXJzIiwiaW5jbHVkZXMiLCJjY191c2VycyIsIm91dGJveF91c2VycyIsInN0YXRlIiwic3VibWl0dGVyIiwiYXBwbGljYW50IiwicGVybWlzc2lvbk1hbmFnZXIiLCJnZXRGbG93UGVybWlzc2lvbnMiLCJzcGFjZXMiLCJ3ZWJzZXJ2aWNlcyIsIndvcmtmbG93Iiwic2VuZFJlc3VsdCIsImNvZGUiLCJkYXRhIiwidXBkYXRlIiwiJHVuc2V0IiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwicmVhc29uIiwiZ2V0SW5pdFdpZHRoUGVyY2VudCIsImNvbHVtbnMiLCJfc2NoZW1hIiwiY29sdW1uX251bSIsImluaXRfd2lkdGhfcGVyY2VudCIsImdldFNjaGVtYSIsImZpZWxkX25hbWUiLCJmaWVsZCIsImlzX3dpZGUiLCJwaWNrIiwiYXV0b2Zvcm0iLCJnZXRGaWVsZElzV2lkZSIsImdldFRhYnVsYXJPcmRlciIsImxpc3Rfdmlld19pZCIsInNldHRpbmciLCJtYXAiLCJjb2x1bW4iLCJoaWRkZW4iLCJjb21wYWN0Iiwib3JkZXIiLCJpbmRleCIsImRlZmF1bHRfZXh0cmFfY29sdW1ucyIsImV4dHJhX2NvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0Q29sdW1ucyIsImdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMiLCJ1bmlvbiIsImdldE9iamVjdERlZmF1bHRTb3J0IiwiVGFidWxhclNlbGVjdGVkSWRzIiwiY29udmVydExpc3RWaWV3IiwiZGVmYXVsdF92aWV3IiwibGlzdF92aWV3IiwibGlzdF92aWV3X25hbWUiLCJkZWZhdWx0X2NvbHVtbnMiLCJkZWZhdWx0X21vYmlsZV9jb2x1bW5zIiwib2l0ZW0iLCJtb2JpbGVfY29sdW1ucyIsImhhcyIsImluY2x1ZGUiLCJmaWx0ZXJfc2NvcGUiLCJwYXJzZSIsImZvckVhY2giLCJfdmFsdWUiLCJnZXRSZWxhdGVkTGlzdCIsImxheW91dFJlbGF0ZWRMaXN0IiwibGlzdCIsIm1hcExpc3QiLCJvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkTGlzdE5hbWVzIiwicmVsYXRlZExpc3RPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfbmFtZXMiLCJ1bnJlbGF0ZWRfb2JqZWN0cyIsInJlbGF0ZWRfbGlzdHMiLCJpdGVtIiwicmVGaWVsZE5hbWUiLCJyZU9iamVjdE5hbWUiLCJyZWxhdGVkIiwicmVsYXRlZF9maWVsZF9mdWxsbmFtZSIsInNwbGl0IiwiZmllbGRfbmFtZXMiLCJpc19maWxlIiwiY3VzdG9tUmVsYXRlZExpc3RPYmplY3QiLCJhY3Rpb25zIiwiYnV0dG9ucyIsInZpc2libGVfb24iLCJwYWdlX3NpemUiLCJvYmpPck5hbWUiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRfb2JqZWN0X2l0ZW0iLCJyZWxhdGVkT2JqZWN0IiwidGFidWxhcl9vcmRlciIsImdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zIiwid2l0aG91dCIsInRyYW5zZm9ybVNvcnRUb1RhYnVsYXIiLCJyZXBsYWNlIiwicGx1Y2siLCJkaWZmZXJlbmNlIiwidiIsImlzQWN0aXZlIiwiYWxsb3dfcmVsYXRlZExpc3QiLCJnZXRPYmplY3RGaXJzdExpc3RWaWV3IiwiZmlyc3QiLCJnZXRMaXN0Vmlld3MiLCJnZXRMaXN0VmlldyIsImV4YWMiLCJsaXN0Vmlld3MiLCJnZXRMaXN0Vmlld0lzUmVjZW50IiwibGlzdFZpZXciLCJwaWNrT2JqZWN0TW9iaWxlQ29sdW1ucyIsImNvdW50IiwiZ2V0RmllbGQiLCJpc05hbWVDb2x1bW4iLCJpdGVtQ291bnQiLCJtYXhDb3VudCIsIm1heFJvd3MiLCJuYW1lQ29sdW1uIiwibmFtZUtleSIsInJlc3VsdCIsImdldE9iamVjdERlZmF1bHRWaWV3IiwiZGVmYXVsdFZpZXciLCJ1c2VfbW9iaWxlX2NvbHVtbnMiLCJpc0FsbFZpZXciLCJpc1JlY2VudFZpZXciLCJ0YWJ1bGFyQ29sdW1ucyIsInRhYnVsYXJfc29ydCIsImNvbHVtbl9pbmRleCIsInRyYW5zZm9ybVNvcnRUb0RYIiwiZHhfc29ydCIsIlJlZ0V4IiwiUmVnRXhwIiwiX3JlZ0V4TWVzc2FnZXMiLCJfZ2xvYmFsTWVzc2FnZXMiLCJyZWdFeCIsImV4cCIsIm1zZyIsIm1lc3NhZ2VzIiwiZXZhbEluQ29udGV4dCIsImpzIiwiZXZhbCIsImNhbGwiLCJjb252ZXJ0RmllbGQiLCJnZXRPcHRpb24iLCJvcHRpb24iLCJmb28iLCJjb2xvciIsImFsbE9wdGlvbnMiLCJwaWNrbGlzdCIsInBpY2tsaXN0T3B0aW9ucyIsImdldFBpY2tsaXN0IiwiZ2V0UGlja0xpc3RPcHRpb25zIiwicmV2ZXJzZSIsImVuYWJsZSIsImRlZmF1bHRWYWx1ZSIsInRyaWdnZXJzIiwidHJpZ2dlciIsIl90b2RvIiwiX3RvZG9fZnJvbV9jb2RlIiwiX3RvZG9fZnJvbV9kYiIsIm9uIiwidG9kbyIsIl92aXNpYmxlIiwiZXJyb3IxIiwiYWN0aW9uc0J5TmFtZSIsInZpc2libGUiLCJfb3B0aW9ucyIsIl90eXBlIiwiYmVmb3JlT3BlbkZ1bmN0aW9uIiwiaXNfY29tcGFueV9saW1pdGVkIiwibWF4IiwibWluIiwiX29wdGlvbiIsImsiLCJfcmVnRXgiLCJfbWluIiwiX21heCIsIk51bWJlciIsIkJvb2xlYW4iLCJfb3B0aW9uc0Z1bmN0aW9uIiwiX3JlZmVyZW5jZV90byIsIl9jcmVhdGVGdW5jdGlvbiIsIl9iZWZvcmVPcGVuRnVuY3Rpb24iLCJfZmlsdGVyc0Z1bmN0aW9uIiwiX2RlZmF1bHRWYWx1ZSIsIl9pc19jb21wYW55X2xpbWl0ZWQiLCJfZmlsdGVycyIsImlzRGF0ZSIsInBvcCIsIl9pc19kYXRlIiwiZm9ybSIsInZhbCIsInJlbGF0ZWRPYmpJbmZvIiwiUFJFRklYIiwiX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhIiwicHJlZml4IiwiZmllbGRWYXJpYWJsZSIsInJlZyIsInJldiIsIm0iLCIkMSIsImZvcm11bGFfc3RyIiwiX0NPTlRFWFQiLCJfVkFMVUVTIiwiaXNCb29sZWFuIiwidG9hc3RyIiwiZm9ybWF0T2JqZWN0TmFtZSIsIl9iYXNlT2JqZWN0IiwiX2RiIiwiZGVmYXVsdExpc3RWaWV3SWQiLCJkaXNhYmxlZF9saXN0X3ZpZXdzIiwic2NoZW1hIiwic2VsZiIsImJhc2VPYmplY3QiLCJwZXJtaXNzaW9uX3NldCIsImljb24iLCJkZXNjcmlwdGlvbiIsImlzX3ZpZXciLCJ2ZXJzaW9uIiwiaXNfZW5hYmxlIiwiYWxsb3dfY3VzdG9tQWN0aW9ucyIsImV4Y2x1ZGVfYWN0aW9ucyIsImVuYWJsZV9zZWFyY2giLCJwYWdpbmciLCJlbmFibGVfYXBpIiwiY3VzdG9tIiwiZW5hYmxlX3NoYXJlIiwiZW5hYmxlX3RyZWUiLCJzaWRlYmFyIiwib3Blbl93aW5kb3ciLCJmaWx0ZXJfY29tcGFueSIsImNhbGVuZGFyIiwiZW5hYmxlX2NoYXR0ZXIiLCJlbmFibGVfdHJhc2giLCJlbmFibGVfc3BhY2VfZ2xvYmFsIiwiZW5hYmxlX2ZvbGxvdyIsImVuYWJsZV93b3JrZmxvdyIsImVuYWJsZV9pbmxpbmVfZWRpdCIsImRldGFpbHMiLCJtYXN0ZXJzIiwibG9va3VwX2RldGFpbHMiLCJpbl9kZXZlbG9wbWVudCIsImlkRmllbGROYW1lIiwiZGF0YWJhc2VfbmFtZSIsImlzX25hbWUiLCJwcmltYXJ5IiwiZmlsdGVyYWJsZSIsInJlYWRvbmx5IiwiaXRlbV9uYW1lIiwiY29weUl0ZW0iLCJhZG1pbiIsImFsbCIsImxpc3Rfdmlld19pdGVtIiwiUmVhY3RpdmVWYXIiLCJjcmVhdGVDb2xsZWN0aW9uIiwiX25hbWUiLCJnZXRPYmplY3RTY2hlbWEiLCJjb250YWlucyIsImF0dGFjaFNjaGVtYSIsIl9zaW1wbGVTY2hlbWEiLCJnZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCIsImJvb3RzdHJhcExvYWRlZCIsImdldFNlbGVjdE9wdGlvbnMiLCJmaWVsZFNjaGVtYSIsImRhdGFfdHlwZSIsIm9wdGlvbkl0ZW0iLCJmaWVsZHNBcnIiLCJfcmVmX29iaiIsImF1dG9mb3JtX3R5cGUiLCJjb2xsZWN0aW9uTmFtZSIsImZzIiwiZnNUeXBlIiwiaXNVbkxpbWl0ZWQiLCJtdWx0aXBsZSIsInJvd3MiLCJsYW5ndWFnZSIsImlzTW9iaWxlIiwiaXNQYWQiLCJpc2lPUyIsImFmRmllbGRJbnB1dCIsInRpbWV6b25lSWQiLCJkeERhdGVCb3hPcHRpb25zIiwiZGlzcGxheUZvcm1hdCIsInBpY2tlclR5cGUiLCJkYXRlTW9iaWxlT3B0aW9ucyIsIm91dEZvcm1hdCIsImhlaWdodCIsImRpYWxvZ3NJbkJvZHkiLCJ0b29sYmFyIiwiZm9udE5hbWVzIiwibGFuZyIsInNob3dJY29uIiwiZGVwZW5kT24iLCJkZXBlbmRfb24iLCJjcmVhdGUiLCJsb29rdXBfZmllbGQiLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJvcGVyYXRpb24iLCJvblN1Y2Nlc3MiLCJhZGRJdGVtcyIsInJlZmVyZW5jZV9zb3J0Iiwib3B0aW9uc1NvcnQiLCJyZWZlcmVuY2VfbGltaXQiLCJvcHRpb25zTGltaXQiLCJyZWZlcmVuY2VfdG9fZmllbGQiLCJyZWZlcmVuY2VUb0ZpZWxkIiwib21pdCIsImJsYWNrYm94Iiwib2JqZWN0U3dpdGNoZSIsIm9wdGlvbnNNZXRob2QiLCJvcHRpb25zTWV0aG9kUGFyYW1zIiwicmVmZXJlbmNlcyIsIl9yZWZlcmVuY2UiLCJsaW5rIiwiZGVmYXVsdEljb24iLCJmaXJzdE9wdGlvbiIsImRlY2ltYWwiLCJwcmVjaXNpb24iLCJzY2FsZSIsImRpc2FibGVkIiwiQXJyYXkiLCJlZGl0YWJsZSIsImFjY2VwdCIsInN5c3RlbSIsIkVtYWlsIiwiYXNzaWduIiwiaXNOdW1iZXIiLCJyZXF1aXJlZCIsIm9wdGlvbmFsIiwidW5pcXVlIiwiZ3JvdXAiLCJzZWFyY2hhYmxlIiwibm93IiwiaW5saW5lSGVscFRleHQiLCJpc1Byb2R1Y3Rpb24iLCJzb3J0YWJsZSIsImdldEZpZWxkRGlzcGxheVZhbHVlIiwiZmllbGRfdmFsdWUiLCJodG1sIiwibW9tZW50IiwiZm9ybWF0IiwiY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5IiwiZmllbGRfdHlwZSIsInB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyIsIm9wZXJhdGlvbnMiLCJidWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJidWlsdGluSXRlbSIsImlzX2NoZWNrX29ubHkiLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uIiwiYmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJnZXRRdWFydGVyU3RhcnRNb250aCIsIm1vbnRoIiwiZ2V0TW9udGgiLCJnZXRMYXN0UXVhcnRlckZpcnN0RGF5IiwieWVhciIsImdldEZ1bGxZZWFyIiwiZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSIsImdldE1vbnRoRGF5cyIsImRheXMiLCJlbmREYXRlIiwibWlsbGlzZWNvbmQiLCJzdGFydERhdGUiLCJnZXRMYXN0TW9udGhGaXJzdERheSIsImN1cnJlbnRNb250aCIsImN1cnJlbnRZZWFyIiwiZW5kVmFsdWUiLCJmaXJzdERheSIsImxhc3REYXkiLCJsYXN0TW9uZGF5IiwibGFzdE1vbnRoRmluYWxEYXkiLCJsYXN0TW9udGhGaXJzdERheSIsImxhc3RRdWFydGVyRW5kRGF5IiwibGFzdFF1YXJ0ZXJTdGFydERheSIsImxhc3RTdW5kYXkiLCJsYXN0XzEyMF9kYXlzIiwibGFzdF8zMF9kYXlzIiwibGFzdF82MF9kYXlzIiwibGFzdF83X2RheXMiLCJsYXN0XzkwX2RheXMiLCJtaW51c0RheSIsIm1vbmRheSIsIm5leHRNb25kYXkiLCJuZXh0TW9udGhGaW5hbERheSIsIm5leHRNb250aEZpcnN0RGF5IiwibmV4dFF1YXJ0ZXJFbmREYXkiLCJuZXh0UXVhcnRlclN0YXJ0RGF5IiwibmV4dFN1bmRheSIsIm5leHRZZWFyIiwibmV4dF8xMjBfZGF5cyIsIm5leHRfMzBfZGF5cyIsIm5leHRfNjBfZGF5cyIsIm5leHRfN19kYXlzIiwibmV4dF85MF9kYXlzIiwicHJldmlvdXNZZWFyIiwic3RhcnRWYWx1ZSIsInN0ckVuZERheSIsInN0ckZpcnN0RGF5Iiwic3RyTGFzdERheSIsInN0ck1vbmRheSIsInN0clN0YXJ0RGF5Iiwic3RyU3VuZGF5Iiwic3RyVG9kYXkiLCJzdHJUb21vcnJvdyIsInN0clllc3RkYXkiLCJzdW5kYXkiLCJ0aGlzUXVhcnRlckVuZERheSIsInRoaXNRdWFydGVyU3RhcnREYXkiLCJ0b21vcnJvdyIsIndlZWsiLCJ5ZXN0ZGF5IiwiZ2V0RGF5IiwidCIsImZ2Iiwic2V0SG91cnMiLCJnZXRIb3VycyIsImdldFRpbWV6b25lT2Zmc2V0IiwiZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uIiwiZ2V0RmllbGRPcGVyYXRpb24iLCJvcHRpb25hbHMiLCJlcXVhbCIsInVuZXF1YWwiLCJsZXNzX3RoYW4iLCJncmVhdGVyX3RoYW4iLCJsZXNzX29yX2VxdWFsIiwiZ3JlYXRlcl9vcl9lcXVhbCIsIm5vdF9jb250YWluIiwic3RhcnRzX3dpdGgiLCJiZXR3ZWVuIiwiZ2V0T2JqZWN0RmllbGRzTmFtZSIsImZpZWxkc05hbWUiLCJzb3J0X25vIiwiY2xlYW5UcmlnZ2VyIiwiaW5pdFRyaWdnZXIiLCJfdHJpZ2dlcl9ob29rcyIsInJlZjUiLCJ0b2RvV3JhcHBlciIsImFwcGx5IiwiYXJndW1lbnRzIiwid2hlbiIsImJlZm9yZSIsImluc2VydCIsInJlbW92ZSIsImFmdGVyIiwiX2hvb2siLCJ0cmlnZ2VyX25hbWUiLCJfdHJpZ2dlcl9ob29rIiwiYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzIiwiZXh0ZW5kUGVybWlzc2lvblByb3BzIiwiZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCIsImZpbmRfcGVybWlzc2lvbl9vYmplY3QiLCJpbnRlcnNlY3Rpb25QbHVzIiwib3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzIiwib3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzIiwicGVybWlzc2lvblByb3BOYW1lcyIsInVuaW9uUGVybWlzc2lvbk9iamVjdHMiLCJ1bmlvblBsdXMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImdldFJlY29yZFBlcm1pc3Npb25zIiwiaXNPd25lciIsIm1hc3Rlck9iamVjdE5hbWUiLCJtYXN0ZXJSZWNvcmRQZXJtIiwicmVjb3JkX2NvbXBhbnlfaWQiLCJyZWNvcmRfY29tcGFueV9pZHMiLCJ1c2VyX2NvbXBhbnlfaWRzIiwicmVjb3JkX3Blcm1pc3Npb25zIiwib3duZXIiLCJwYXJlbnQiLCJuIiwiaW50ZXJzZWN0aW9uIiwibG9ja2VkIiwiZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyIsImN1cnJlbnRPYmplY3ROYW1lIiwicmVsYXRlZExpc3RJdGVtIiwiY3VycmVudFJlY29yZCIsImlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSIsIm1hc3RlckFsbG93IiwicmVsYXRlZE9iamVjdFBlcm1pc3Npb25zIiwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QiLCJnZXRPYmplY3RSZWNvcmQiLCJnZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIl9pIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwic3BhY2VVc2VyIiwib2JqZWN0cyIsImFzc2lnbmVkX2FwcHMiLCJwcm9maWxlIiwidXNlcnMiLCJwZXJtaXNzaW9uX3NldF9pZCIsImNyZWF0ZWQiLCJtb2RpZmllZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZF9ieSIsImdldEFzc2lnbmVkQXBwcyIsImJpbmQiLCJhc3NpZ25lZF9tZW51cyIsImdldEFzc2lnbmVkTWVudXMiLCJ1c2VyX3Blcm1pc3Npb25fc2V0cyIsImFycmF5Iiwib3RoZXIiLCJ0YXJnZXQiLCJwcm9wcyIsImZpbGVzUHJvTmFtZXMiLCJwcm9wTmFtZXMiLCJwcm9wTmFtZSIsImFwcHMiLCJwc2V0QmFzZSIsInVzZXJQcm9maWxlIiwicHNldCIsInVuaXEiLCJhYm91dE1lbnUiLCJhZG1pbk1lbnVzIiwiYWxsTWVudXMiLCJjdXJyZW50UHNldE5hbWVzIiwibWVudXMiLCJvdGhlck1lbnVBcHBzIiwib3RoZXJNZW51cyIsImFkbWluX21lbnVzIiwiZmxhdHRlbiIsIm1lbnUiLCJwc2V0c01lbnUiLCJwZXJtaXNzaW9uX3NldHMiLCJwZXJtaXNzaW9uX29iamVjdHMiLCJpc051bGwiLCJwZXJtaXNzaW9uX3NldF9pZHMiLCJwb3MiLCJvcHMiLCJvcHNfa2V5IiwiY3VycmVudFBzZXQiLCJ0ZW1wT3BzIiwicmVwZWF0SW5kZXgiLCJyZXBlYXRQbyIsIm9wc2V0QWRtaW4iLCJvcHNldEN1c3RvbWVyIiwib3BzZXRHdWVzdCIsIm9wc2V0TWVtYmVyIiwib3BzZXRTdXBwbGllciIsIm9wc2V0VXNlciIsInBvc0FkbWluIiwicG9zQ3VzdG9tZXIiLCJwb3NHdWVzdCIsInBvc01lbWJlciIsInBvc1N1cHBsaWVyIiwicG9zVXNlciIsInByb2YiLCJndWVzdCIsIm1lbWJlciIsInN1cHBsaWVyIiwiY3VzdG9tZXIiLCJkaXNhYmxlZF9hY3Rpb25zIiwidW5yZWFkYWJsZV9maWVsZHMiLCJ1bmVkaXRhYmxlX2ZpZWxkcyIsImNyZWF0b3JfZGJfdXJsIiwib3Bsb2dfdXJsIiwiTU9OR09fVVJMX0NSRUFUT1IiLCJNT05HT19PUExPR19VUkxfQ1JFQVRPUiIsIl9DUkVBVE9SX0RBVEFTT1VSQ0UiLCJfZHJpdmVyIiwiTW9uZ29JbnRlcm5hbHMiLCJSZW1vdGVDb2xsZWN0aW9uRHJpdmVyIiwib3Bsb2dVcmwiLCJjb2xsZWN0aW9uX2tleSIsIm5ld0NvbGxlY3Rpb24iLCJTTVNRdWV1ZSIsIl9kZWxldGVSZWNvcmQiLCJzdGVlZG9zRmlsdGVycyIsImFjdGlvbl9uYW1lIiwiZXhlY3V0ZUFjdGlvbiIsIml0ZW1fZWxlbWVudCIsImNhbGxiYWNrIiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIk9iamVjdEdyaWQiLCJnZXRGaWx0ZXJzIiwid29yZF90ZW1wbGF0ZSIsImZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkiLCJhYnNvbHV0ZVVybCIsIndpbmRvdyIsIm9wZW4iLCJvZGF0YSIsInByb3RvdHlwZSIsInNsaWNlIiwiY29uY2F0Iiwid2FybmluZyIsInJlY29yZF90aXRsZSIsImNhbGxfYmFjayIsImNhbGxfYmFja19lcnJvciIsInByZXZpb3VzRG9jIiwiRm9ybU1hbmFnZXIiLCJnZXRQcmV2aW91c0RvYyIsImluZm8iLCJzdWNjZXNzIiwicnVuSG9vayIsImluaXRpYWxWYWx1ZXMiLCJzZWxlY3RlZFJvd3MiLCJncmlkUmVmIiwiY3VycmVudCIsImFwaSIsImdldFNlbGVjdGVkUm93cyIsImdldEluaXRpYWxWYWx1ZXMiLCJTdGVlZG9zVUkiLCJzaG93TW9kYWwiLCJzdG9yZXMiLCJDb21wb25lbnRSZWdpc3RyeSIsImNvbXBvbmVudHMiLCJPYmplY3RGb3JtIiwib2JqZWN0QXBpTmFtZSIsInRpdGxlIiwiYWZ0ZXJJbnNlcnQiLCJzZXRUaW1lb3V0IiwiYXBwX2lkIiwiRmxvd1JvdXRlciIsImdvIiwiaWNvblBhdGgiLCJzZXQiLCJkZWZlciIsIiQiLCJjbGljayIsImhyZWYiLCJnZXRPYmplY3RVcmwiLCJyZWRpcmVjdCIsInJlY29yZElkIiwiYWZ0ZXJVcGRhdGUiLCJyb3V0ZSIsImVuZHNXaXRoIiwicmVsb2FkIiwicmVsb2FkUmVjb3JkIiwicmVmcmVzaER4U2NoZWR1bGVySW5zdGFuY2UiLCJyZWZyZXNoR3JpZCIsImJlZm9yZUhvb2siLCJpMThuVGV4dEtleSIsImkxOG5UaXRsZUtleSIsIm5hbWVGaWVsZCIsInNlbGVjdGVkUmVjb3JkcyIsInRleHQiLCJnZXRUYWJsZVNlbGVjdGVkUm93cyIsInN3YWwiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY29uZmlybUJ1dHRvblRleHQiLCJjYW5jZWxCdXR0b25UZXh0IiwiYWZ0ZXJCYXRjaGVzRGVsZXRlIiwiZGVsZXRlQ291bnRlciIsIl9lIiwiYXBwaWQiLCJjdXJyZW50X29iamVjdF9uYW1lIiwiY3VycmVudF9yZWNvcmRfaWQiLCJkeERhdGFHcmlkSW5zdGFuY2UiLCJncmlkQ29udGFpbmVyIiwiZ3JpZE9iamVjdE5hbWVDbGFzcyIsImlzT3BlbmVyUmVtb3ZlIiwicmVjb3JkVXJsIiwidGVtcE5hdlJlbW92ZWQiLCJvcGVuZXIiLCJkeFRyZWVMaXN0IiwiZHhEYXRhR3JpZCIsInJlZnJlc2giLCJUZW1wbGF0ZSIsImNyZWF0b3JfZ3JpZCIsInJlbW92ZVRlbXBOYXZJdGVtIiwiY2xvc2UiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwicmVjb3JkVGl0bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEtBQUNBLEVBQUQsR0FBTSxFQUFOOztBQUNBLElBQUksT0FBQUMsT0FBQSxvQkFBQUEsWUFBQSxJQUFKO0FBQ0MsT0FBQ0EsT0FBRCxHQUFXLEVBQVg7QUNFQTs7QUREREEsUUFBUUMsT0FBUixHQUFrQixFQUFsQjtBQUNBRCxRQUFRRSxXQUFSLEdBQXNCLEVBQXRCO0FBQ0FGLFFBQVFHLEtBQVIsR0FBZ0IsRUFBaEI7QUFDQUgsUUFBUUksSUFBUixHQUFlLEVBQWY7QUFDQUosUUFBUUssVUFBUixHQUFxQixFQUFyQjtBQUNBTCxRQUFRTSxPQUFSLEdBQWtCLEVBQWxCO0FBQ0FOLFFBQVFPLElBQVIsR0FBZSxFQUFmO0FBQ0FQLFFBQVFRLGFBQVIsR0FBd0IsRUFBeEIsQzs7Ozs7Ozs7Ozs7O0FFVkEsSUFBQUMsVUFBQSxFQUFBQyxlQUFBLEVBQUFDLE1BQUEsRUFBQUMsQ0FBQSxFQUFBQyxTQUFBLEVBQUFDLFFBQUEsRUFBQUMsYUFBQSxFQUFBQyxJQUFBLEVBQUFDLFFBQUEsRUFBQUMsV0FBQTs7QUFBQTtBQUNDLE1BQUdDLFFBQVFDLEdBQVIsQ0FBWUMsZ0JBQVosS0FBZ0MsYUFBbkM7QUFDQ0gsa0JBQWNJLFFBQVEsZUFBUixDQUFkO0FBQ0FSLGVBQVdRLFFBQVEsbUJBQVIsQ0FBWDtBQUNBVCxnQkFBWVMsUUFBUSxXQUFSLENBQVo7QUFDQVAsb0JBQWdCTyxRQUFRLHdDQUFSLENBQWhCO0FBQ0FiLGlCQUFhYSxRQUFRLHNCQUFSLENBQWI7QUFDQVosc0JBQWtCWSxRQUFRLGtDQUFSLENBQWxCO0FBQ0FOLFdBQU9NLFFBQVEsTUFBUixDQUFQO0FBRUFYLGFBQVNHLFNB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ZXMvc3RlZWRvc19vYmplY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQGRiID0ge31cbmlmICFDcmVhdG9yP1xuXHRAQ3JlYXRvciA9IHt9XG5DcmVhdG9yLk9iamVjdHMgPSB7fVxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9XG5DcmVhdG9yLk1lbnVzID0gW11cbkNyZWF0b3IuQXBwcyA9IHt9XG5DcmVhdG9yLkRhc2hib2FyZHMgPSB7fVxuQ3JlYXRvci5SZXBvcnRzID0ge31cbkNyZWF0b3Iuc3VicyA9IHt9XG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fSIsInRoaXMuZGIgPSB7fTtcblxuaWYgKHR5cGVvZiBDcmVhdG9yID09PSBcInVuZGVmaW5lZFwiIHx8IENyZWF0b3IgPT09IG51bGwpIHtcbiAgdGhpcy5DcmVhdG9yID0ge307XG59XG5cbkNyZWF0b3IuT2JqZWN0cyA9IHt9O1xuXG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge307XG5cbkNyZWF0b3IuTWVudXMgPSBbXTtcblxuQ3JlYXRvci5BcHBzID0ge307XG5cbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9O1xuXG5DcmVhdG9yLlJlcG9ydHMgPSB7fTtcblxuQ3JlYXRvci5zdWJzID0ge307XG5cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9O1xuIiwidHJ5XG5cdGlmIHByb2Nlc3MuZW52LkNSRUFUT1JfTk9ERV9FTlYgPT0gJ2RldmVsb3BtZW50J1xuXHRcdHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXG5cdFx0b2JqZWN0cWwgPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpXG5cdFx0bW9sZWN1bGVyID0gcmVxdWlyZShcIm1vbGVjdWxlclwiKTtcblx0XHRwYWNrYWdlTG9hZGVyID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRlb3ItcGFja2FnZS1sb2FkZXInKTtcblx0XHRBUElTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1hcGknKTtcblx0XHRNZXRhZGF0YVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGFkYXRhLXNlcnZlcicpO1xuXHRcdHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXHRcdGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcblx0XHRzZXR0aW5ncyA9IHtcblx0XHRcdGJ1aWx0X2luX3BsdWdpbnM6IFtcblx0XHRcdFx0XCJAc3RlZWRvcy93b3JrZmxvd1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL2FjY291bnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc3RlZWRvcy1wbHVnaW4tc2NoZW1hLWJ1aWxkZXJcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9wbHVnaW4tZW50ZXJwcmlzZVwiLFxuXHRcdFx0XHQjIFwiQHN0ZWVkb3Mvd29yZC10ZW1wbGF0ZVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL21ldGFkYXRhLWFwaVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3BsdWdpbi1kaW5ndGFsa1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL2RhdGEtaW1wb3J0XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1maWVsZHMtaW5kZXhzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1hY2NvdW50c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2hhcnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wYWdlc1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2xvdWQtaW5pdFwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS1yZWdpc3RyeVwiXG5cdFx0XHRcdF0sXG5cdFx0XHRwbHVnaW5zOiBjb25maWcucGx1Z2luc1xuXHRcdH1cblx0XHRNZXRlb3Iuc3RhcnR1cCAtPlxuXHRcdFx0dHJ5XG5cdFx0XHRcdGJyb2tlciA9IG5ldyBtb2xlY3VsZXIuU2VydmljZUJyb2tlcih7XG5cdFx0XHRcdFx0bmFtZXNwYWNlOiBcInN0ZWVkb3NcIixcblx0XHRcdFx0XHRub2RlSUQ6IFwic3RlZWRvcy1jcmVhdG9yXCIsXG5cdFx0XHRcdFx0bWV0YWRhdGE6IHt9LFxuXHRcdFx0XHRcdHRyYW5zcG9ydGVyOiBwcm9jZXNzLmVudi5UUkFOU1BPUlRFUixcblx0XHRcdFx0XHRjYWNoZXI6IHByb2Nlc3MuZW52LkNBQ0hFUixcblx0XHRcdFx0XHRsb2dMZXZlbDogXCJ3YXJuXCIsXG5cdFx0XHRcdFx0c2VyaWFsaXplcjogXCJKU09OXCIsXG5cdFx0XHRcdFx0cmVxdWVzdFRpbWVvdXQ6IDYwICogMTAwMCxcblx0XHRcdFx0XHRtYXhDYWxsTGV2ZWw6IDEwMCxcblxuXHRcdFx0XHRcdGhlYXJ0YmVhdEludGVydmFsOiAxMCxcblx0XHRcdFx0XHRoZWFydGJlYXRUaW1lb3V0OiAzMCxcblxuXHRcdFx0XHRcdGNvbnRleHRQYXJhbXNDbG9uaW5nOiBmYWxzZSxcblxuXHRcdFx0XHRcdHRyYWNraW5nOiB7XG5cdFx0XHRcdFx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHRcdFx0XHRcdHNodXRkb3duVGltZW91dDogNTAwMCxcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0ZGlzYWJsZUJhbGFuY2VyOiBmYWxzZSxcblxuXHRcdFx0XHRcdHJlZ2lzdHJ5OiB7XG5cdFx0XHRcdFx0XHRzdHJhdGVneTogXCJSb3VuZFJvYmluXCIsXG5cdFx0XHRcdFx0XHRwcmVmZXJMb2NhbDogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHRidWxraGVhZDoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRjb25jdXJyZW5jeTogMTAsXG5cdFx0XHRcdFx0XHRtYXhRdWV1ZVNpemU6IDEwMCxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHZhbGlkYXRvcjogdHJ1ZSxcblx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IG51bGwsXG5cblx0XHRcdFx0XHR0cmFjaW5nOiB7XG5cdFx0XHRcdFx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHRcdFx0XHRcdGV4cG9ydGVyOiB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiQ29uc29sZVwiLFxuXHRcdFx0XHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdFx0bG9nZ2VyOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdGNvbG9yczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdFx0XHRcdGdhdWdlV2lkdGg6IDQwXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0bWV0YWRhdGFTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6ICdtZXRhZGF0YS1zZXJ2ZXInLFxuXHRcdFx0XHRcdG1peGluczogW01ldGFkYXRhU2VydmljZV0sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRhcGlTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6IFwiYXBpXCIsXG5cdFx0XHRcdFx0bWl4aW5zOiBbQVBJU2VydmljZV0sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdHBvcnQ6IG51bGxcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRvYmplY3RxbC5nZXRTdGVlZG9zU2NoZW1hKGJyb2tlcik7XG5cdFx0XHRcdHN0YW5kYXJkT2JqZWN0c0RpciA9IG9iamVjdHFsLlN0YW5kYXJkT2JqZWN0c1BhdGg7XG5cdFx0XHRcdHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6ICdzdGFuZGFyZC1vYmplY3RzJyxcblx0XHRcdFx0XHRtaXhpbnM6IFtwYWNrYWdlTG9hZGVyXSxcblx0XHRcdFx0XHRzZXR0aW5nczogeyBwYWNrYWdlSW5mbzoge1xuXHRcdFx0XHRcdFx0cGF0aDogc3RhbmRhcmRPYmplY3RzRGlyLFxuXHRcdFx0XHRcdH0gfVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRNZXRlb3Iud3JhcEFzeW5jKChjYiktPlxuXHRcdFx0XHRcdGJyb2tlci5zdGFydCgpLnRoZW4oKCktPlxuXHRcdFx0XHRcdFx0aWYgIWJyb2tlci5zdGFydGVkIFxuXHRcdFx0XHRcdFx0XHRicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlKTtcblxuXHRcdFx0XHRcdFx0V2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoXCIvXCIsIGFwaVNlcnZpY2UuZXhwcmVzcygpKTtcblx0XHRcdFx0XHRcdCMgc3RlZWRvc0NvcmUuaW5pdChzZXR0aW5ncykudGhlbiAoKS0+XG5cdFx0XHRcdFx0XHQjIFx0Y2IoKTtcblxuXHRcdFx0XHRcdFx0YnJva2VyLndhaXRGb3JTZXJ2aWNlcyhzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZS5uYW1lKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG5cdFx0XHRcdFx0XHRcdHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4gKCktPlxuXHRcdFx0XHRcdFx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCkoKVxuXHRcdFx0Y2F0Y2ggZXhcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcImVycm9yOlwiLGV4KVxuY2F0Y2ggZVxuXHRjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsZSkiLCJ2YXIgQVBJU2VydmljZSwgTWV0YWRhdGFTZXJ2aWNlLCBjb25maWcsIGUsIG1vbGVjdWxlciwgb2JqZWN0cWwsIHBhY2thZ2VMb2FkZXIsIHBhdGgsIHNldHRpbmdzLCBzdGVlZG9zQ29yZTtcblxudHJ5IHtcbiAgaWYgKHByb2Nlc3MuZW52LkNSRUFUT1JfTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBzdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcbiAgICBvYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XG4gICAgbW9sZWN1bGVyID0gcmVxdWlyZShcIm1vbGVjdWxlclwiKTtcbiAgICBwYWNrYWdlTG9hZGVyID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRlb3ItcGFja2FnZS1sb2FkZXInKTtcbiAgICBBUElTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1hcGknKTtcbiAgICBNZXRhZGF0YVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGFkYXRhLXNlcnZlcicpO1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgY29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xuICAgIHNldHRpbmdzID0ge1xuICAgICAgYnVpbHRfaW5fcGx1Z2luczogW1wiQHN0ZWVkb3Mvd29ya2Zsb3dcIiwgXCJAc3RlZWRvcy9hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3N0ZWVkb3MtcGx1Z2luLXNjaGVtYS1idWlsZGVyXCIsIFwiQHN0ZWVkb3MvcGx1Z2luLWVudGVycHJpc2VcIiwgXCJAc3RlZWRvcy9tZXRhZGF0YS1hcGlcIiwgXCJAc3RlZWRvcy9wbHVnaW4tZGluZ3RhbGtcIiwgXCJAc3RlZWRvcy9kYXRhLWltcG9ydFwiLCBcIkBzdGVlZG9zL3NlcnZpY2UtZmllbGRzLWluZGV4c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtYWNjb3VudHNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWNoYXJ0c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtcGFnZXNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWNsb3VkLWluaXRcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhY2thZ2UtcmVnaXN0cnlcIl0sXG4gICAgICBwbHVnaW5zOiBjb25maWcucGx1Z2luc1xuICAgIH07XG4gICAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXBpU2VydmljZSwgYnJva2VyLCBleCwgbWV0YWRhdGFTZXJ2aWNlLCBzdGFuZGFyZE9iamVjdHNEaXIsIHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYnJva2VyID0gbmV3IG1vbGVjdWxlci5TZXJ2aWNlQnJva2VyKHtcbiAgICAgICAgICBuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuICAgICAgICAgIG5vZGVJRDogXCJzdGVlZG9zLWNyZWF0b3JcIixcbiAgICAgICAgICBtZXRhZGF0YToge30sXG4gICAgICAgICAgdHJhbnNwb3J0ZXI6IHByb2Nlc3MuZW52LlRSQU5TUE9SVEVSLFxuICAgICAgICAgIGNhY2hlcjogcHJvY2Vzcy5lbnYuQ0FDSEVSLFxuICAgICAgICAgIGxvZ0xldmVsOiBcIndhcm5cIixcbiAgICAgICAgICBzZXJpYWxpemVyOiBcIkpTT05cIixcbiAgICAgICAgICByZXF1ZXN0VGltZW91dDogNjAgKiAxMDAwLFxuICAgICAgICAgIG1heENhbGxMZXZlbDogMTAwLFxuICAgICAgICAgIGhlYXJ0YmVhdEludGVydmFsOiAxMCxcbiAgICAgICAgICBoZWFydGJlYXRUaW1lb3V0OiAzMCxcbiAgICAgICAgICBjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG4gICAgICAgICAgdHJhY2tpbmc6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgc2h1dGRvd25UaW1lb3V0OiA1MDAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkaXNhYmxlQmFsYW5jZXI6IGZhbHNlLFxuICAgICAgICAgIHJlZ2lzdHJ5OiB7XG4gICAgICAgICAgICBzdHJhdGVneTogXCJSb3VuZFJvYmluXCIsXG4gICAgICAgICAgICBwcmVmZXJMb2NhbDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVsa2hlYWQ6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgY29uY3VycmVuY3k6IDEwLFxuICAgICAgICAgICAgbWF4UXVldWVTaXplOiAxMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHZhbGlkYXRvcjogdHJ1ZSxcbiAgICAgICAgICBlcnJvckhhbmRsZXI6IG51bGwsXG4gICAgICAgICAgdHJhY2luZzoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBleHBvcnRlcjoge1xuICAgICAgICAgICAgICB0eXBlOiBcIkNvbnNvbGVcIixcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGxvZ2dlcjogbnVsbCxcbiAgICAgICAgICAgICAgICBjb2xvcnM6IHRydWUsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICAgICAgICBnYXVnZVdpZHRoOiA0MFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbWV0YWRhdGFTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6ICdtZXRhZGF0YS1zZXJ2ZXInLFxuICAgICAgICAgIG1peGluczogW01ldGFkYXRhU2VydmljZV0sXG4gICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgIH0pO1xuICAgICAgICBhcGlTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6IFwiYXBpXCIsXG4gICAgICAgICAgbWl4aW5zOiBbQVBJU2VydmljZV0sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHBvcnQ6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBvYmplY3RxbC5nZXRTdGVlZG9zU2NoZW1hKGJyb2tlcik7XG4gICAgICAgIHN0YW5kYXJkT2JqZWN0c0RpciA9IG9iamVjdHFsLlN0YW5kYXJkT2JqZWN0c1BhdGg7XG4gICAgICAgIHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6ICdzdGFuZGFyZC1vYmplY3RzJyxcbiAgICAgICAgICBtaXhpbnM6IFtwYWNrYWdlTG9hZGVyXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcGFja2FnZUluZm86IHtcbiAgICAgICAgICAgICAgcGF0aDogc3RhbmRhcmRPYmplY3RzRGlyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oY2IpIHtcbiAgICAgICAgICByZXR1cm4gYnJva2VyLnN0YXJ0KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghYnJva2VyLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgYnJva2VyLl9yZXN0YXJ0U2VydmljZShzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShcIi9cIiwgYXBpU2VydmljZS5leHByZXNzKCkpO1xuICAgICAgICAgICAgcmV0dXJuIGJyb2tlci53YWl0Rm9yU2VydmljZXMoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UubmFtZSkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGUgPSBlcnJvcjtcbiAgY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBlKTtcbn1cbiIsIkNyZWF0b3IuZGVwcyA9IHtcblx0YXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG5cdEFwcHM6IHt9LFxuXHRPYmplY3RzOiB7fVxufVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7b3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Y3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cbiMgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzIOS+m3N0ZWVkb3MtY2xp6aG555uu5L2/55SoXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXHRDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRcdEZpYmVyKCgpLT5cblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcblx0XHQpLnJ1bigpXG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IG9iai5uYW1lXG5cblx0aWYgIW9iai5saXN0X3ZpZXdzXG5cdFx0b2JqLmxpc3Rfdmlld3MgPSB7fVxuXG5cdGlmIG9iai5zcGFjZVxuXHRcdG9iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmopXG5cdGlmIG9iamVjdF9uYW1lID09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCdcblx0XHRvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcblx0XHRvYmogPSBfLmNsb25lKG9iailcblx0XHRvYmoubmFtZSA9IG9iamVjdF9uYW1lXG5cdFx0Q3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9ialxuXG5cdENyZWF0b3IuY29udmVydE9iamVjdChvYmopXG5cdG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuXG5cdENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKVxuXHRDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXG5cdHJldHVybiBvYmpcblxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gKG9iamVjdCkgLT5cblx0aWYgb2JqZWN0LnNwYWNlXG5cdFx0cmV0dXJuIFwiY18je29iamVjdC5zcGFjZX1fI3tvYmplY3QubmFtZX1cIlxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcblxuQ3JlYXRvci5nZXRPYmplY3QgPSAob2JqZWN0X25hbWUsIHNwYWNlX2lkKS0+XG5cdGlmIF8uaXNBcnJheShvYmplY3RfbmFtZSlcblx0XHRyZXR1cm4gO1xuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRDcmVhdG9yLmRlcHM/Lm9iamVjdD8uZGVwZW5kKClcblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuI1x0aWYgIXNwYWNlX2lkICYmIG9iamVjdF9uYW1lXG4jXHRcdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKVxuI1x0XHRcdHNwYWNlX2lkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cblx0aWYgb2JqZWN0X25hbWVcbiNcdFx0aWYgc3BhY2VfaWRcbiNcdFx0XHRvYmogPSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbXCJjXyN7c3BhY2VfaWR9XyN7b2JqZWN0X25hbWV9XCJdXG4jXHRcdFx0aWYgb2JqXG4jXHRcdFx0XHRyZXR1cm4gb2JqXG4jXG4jXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XG4jXHRcdFx0XHRyZXR1cm4gby5fY29sbGVjdGlvbl9uYW1lID09IG9iamVjdF9uYW1lXG4jXHRcdGlmIG9ialxuI1x0XHRcdHJldHVybiBvYmpcblxuXHRcdHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IChvYmplY3RfaWQpLT5cblx0cmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge19pZDogb2JqZWN0X2lkfSlcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSAob2JqZWN0X25hbWUpLT5cblx0Y29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0aWYgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/Ll9jb2xsZWN0aW9uX25hbWUgfHwgb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxuXHRkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0c3BhY2UgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKT8uZGI/LmZpbmRPbmUoc3BhY2VJZCx7ZmllbGRzOnthZG1pbnM6MX19KVxuXHRpZiBzcGFjZT8uYWRtaW5zXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMFxuXG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKS0+XG5cblx0aWYgIV8uaXNTdHJpbmcoZm9ybXVsYXIpXG5cdFx0cmV0dXJuIGZvcm11bGFyXG5cblx0aWYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpXG5cdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKVxuXG5cdHJldHVybiBmb3JtdWxhclxuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IChmaWx0ZXJzLCBjb250ZXh0KS0+XG5cdHNlbGVjdG9yID0ge31cblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cblx0XHRpZiBmaWx0ZXI/Lmxlbmd0aCA9PSAzXG5cdFx0XHRuYW1lID0gZmlsdGVyWzBdXG5cdFx0XHRhY3Rpb24gPSBmaWx0ZXJbMV1cblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KVxuXHRcdFx0c2VsZWN0b3JbbmFtZV0gPSB7fVxuXHRcdFx0c2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlXG5cdCMgY29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3Rvcilcblx0cmV0dXJuIHNlbGVjdG9yXG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IChzcGFjZUlkKSAtPlxuXHRyZXR1cm4gc3BhY2VJZCA9PSAnY29tbW9uJ1xuXG4jIyNcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuIyMjXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IChkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KS0+XG5cblx0aWYgIWlkX2tleVxuXHRcdGlkX2tleSA9IFwiX2lkXCJcblxuXHRpZiBoaXRfZmlyc3RcblxuXHRcdCPnlLHkuo7kuI3og73kvb/nlKhfLmZpbmRJbmRleOWHveaVsO+8jOWboOatpOatpOWkhOWFiOWwhuWvueixoeaVsOe7hOi9rOS4uuaZrumAmuaVsOe7hOexu+Wei++8jOWcqOiOt+WPluWFtmluZGV4XG5cdFx0dmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpXG5cblx0XHRyZXR1cm5cdF8uc29ydEJ5IGRvY3MsIChkb2MpLT5cblx0XHRcdFx0XHRfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcblx0XHRcdFx0XHRpZiBfaW5kZXggPiAtMVxuXHRcdFx0XHRcdFx0cmV0dXJuIF9pbmRleFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pXG5cdGVsc2Vcblx0XHRyZXR1cm5cdF8uc29ydEJ5IGRvY3MsIChkb2MpLT5cblx0XHRcdHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcblxuIyMjXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiMjI1xuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gKHZhbHVlMSwgdmFsdWUyKSAtPlxuXHRpZiB0aGlzLmtleVxuXHRcdHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV1cblx0XHR2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldXG5cdGlmIHZhbHVlMSBpbnN0YW5jZW9mIERhdGVcblx0XHR2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpXG5cdGlmIHZhbHVlMiBpbnN0YW5jZW9mIERhdGVcblx0XHR2YWx1ZTIgPSB2YWx1ZTIuZ2V0VGltZSgpXG5cdGlmIHR5cGVvZiB2YWx1ZTEgaXMgXCJudW1iZXJcIiBhbmQgdHlwZW9mIHZhbHVlMiBpcyBcIm51bWJlclwiXG5cdFx0cmV0dXJuIHZhbHVlMSAtIHZhbHVlMlxuXHQjIEhhbmRsaW5nIG51bGwgdmFsdWVzXG5cdGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT0gbnVsbCBvciB2YWx1ZTEgPT0gdW5kZWZpbmVkXG5cdGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT0gbnVsbCBvciB2YWx1ZTIgPT0gdW5kZWZpbmVkXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kICFpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIC0xXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gMFxuXHRpZiAhaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAxXG5cdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0cmV0dXJuIHZhbHVlMS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUgdmFsdWUyLnRvU3RyaW5nKCksIGxvY2FsZVxuXG5cbiMg6K+l5Ye95pWw5Y+q5Zyo5Yid5aeL5YyWT2JqZWN05pe277yM5oqK55u45YWz5a+56LGh55qE6K6h566X57uT5p6c5L+d5a2Y5YiwT2JqZWN055qEcmVsYXRlZF9vYmplY3Rz5bGe5oCn5Lit77yM5ZCO57ut5Y+v5Lul55u05o6l5LuOcmVsYXRlZF9vYmplY3Rz5bGe5oCn5Lit5Y+W5b6X6K6h566X57uT5p6c6ICM5LiN55So5YaN5qyh6LCD55So6K+l5Ye95pWw5p2l6K6h566XXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gKG9iamVjdF9uYW1lKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0cmVsYXRlZF9vYmplY3RzID0gW11cblx0IyBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdCMg5ZugQ3JlYXRvci5nZXRPYmplY3Tlh73mlbDlhoXpg6jopoHosIPnlKjor6Xlh73mlbDvvIzmiYDku6Xov5nph4zkuI3lj6/ku6XosIPnlKhDcmVhdG9yLmdldE9iamVjdOWPluWvueixoe+8jOWPquiDveiwg+eUqENyZWF0b3IuT2JqZWN0c+adpeWPluWvueixoVxuXHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRpZiAhX29iamVjdFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdHNcblx0XG5cdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxuXHRpZiBNZXRlb3IuaXNDbGllbnQgJiYgIV8uaXNFbXB0eSByZWxhdGVkTGlzdFxuXHRcdHJlbGF0ZWRMaXN0TWFwID0ge31cblx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpOYW1lKS0+XG5cdFx0XHRpZiBfLmlzT2JqZWN0IG9iak5hbWVcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZS5vYmplY3ROYW1lXSA9IHt9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWVdID0ge31cblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIikgYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PSBvYmplY3RfbmFtZSBhbmQgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV1cblx0XHRcdFx0XHQjIOW9k3JlbGF0ZWRfb2JqZWN0LmZpZWxkc+S4reacieS4pOS4quaIluS7peS4iueahOWtl+auteaMh+WQkW9iamVjdF9uYW1l6KGo56S655qE5a+56LGh5pe277yM5LyY5YWI5Y+W56ys5LiA5Liq5L2c5Li65aSW6ZSu5YWz57O75a2X5q6177yM5L2G5pivcmVsYXRlZF9maWVsZOS4uuS4u+WtkOihqOaXtuW8uuihjOimhuebluS5i+WJjeeahHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVd5YC8XG5cdFx0XHRcdFx0aWYgXy5pc0VtcHR5IHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIlxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7IG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10gPSB7IG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLCBmb3JlaWduX2tleTogXCJwYXJlbnRcIiB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7IG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLCBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCIgfVxuXHRcdF8uZWFjaCBbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgKGVuYWJsZU9iak5hbWUpLT5cblx0XHRcdGlmIHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdID0geyBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiIH1cblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddXG5cdFx0XHQjcmVjb3JkIOivpue7huS4i+eahGF1ZGl0X3JlY29yZHPku4Vtb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5Y+v6KeBXG5cdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXG5cdFx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddID0geyBvYmplY3RfbmFtZTpcImF1ZGl0X3JlY29yZHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiIH1cblx0XHRyZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyByZWxhdGVkTGlzdE1hcFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdHNcblxuXHRpZiBfb2JqZWN0LmVuYWJsZV9maWxlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImNtc19maWxlc1wiLCBmb3JlaWduX2tleTogXCJwYXJlbnRcIn1cblxuXHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxuXHRcdFx0IyBjZnMuZmlsZXMuZmlsZXJlY29yZOWvueixoeWcqOesrOS6jOasoeeCueWHu+eahOaXtuWAmXJlbGF0ZWRfb2JqZWN06L+U5Zue55qE5pivYXBwLWJ1aWxkZXLkuK3nmoRcIm1ldGFkYXRhLnBhcmVudFwi5a2X5q616KKr5Yig6Zmk5LqG77yM6K6w5YiwbWV0YWRhdGHlrZfmrrXnmoRzdWJfZmllbGRz5Lit5LqG77yM5omA5Lul6KaB5Y2V54us5aSE55CG44CCXG5cdFx0XHRzZnNGaWxlc09iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIilcblx0XHRcdHNmc0ZpbGVzT2JqZWN0ICYmIHJlbGF0ZWRfb2JqZWN0ID0gc2ZzRmlsZXNPYmplY3Rcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XG5cdFx0XHRpZiAocmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIHx8IChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIiAmJiByZWxhdGVkX2ZpZWxkLnJlbGF0ZWRMaXN0KSkgYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PSBvYmplY3RfbmFtZVxuXHRcdFx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwib2JqZWN0X2ZpZWxkc1wiXG5cdFx0XHRcdFx0I1RPRE8g5b6F55u45YWz5YiX6KGo5pSv5oyB5o6S5bqP5ZCO77yM5Yig6Zmk5q2k5Yik5patXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RzLnNwbGljZSgwLCAwLCB7b2JqZWN0X25hbWU6cmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZX0pXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6cmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWR9XG5cblx0aWYgX29iamVjdC5lbmFibGVfdGFza3Ncblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJ0YXNrc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX25vdGVzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwibm90ZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ldmVudHNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJldmVudHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9pbnN0YW5jZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9hcHByb3ZhbHNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhcHByb3ZhbHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9wcm9jZXNzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwicHJvY2Vzc19pbnN0YW5jZV9oaXN0b3J5XCIsIGZvcmVpZ25fa2V5OiBcInRhcmdldF9vYmplY3RcIn1cblx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXG5cdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImF1ZGl0X3JlY29yZHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9ICh1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRyZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFRcblx0ZWxzZVxuXHRcdGlmICEodXNlcklkIGFuZCBzcGFjZUlkKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCJcblx0XHRcdHJldHVybiBudWxsXG5cdFx0c3VGaWVsZHMgPSB7bmFtZTogMSwgbW9iaWxlOiAxLCBwb3NpdGlvbjogMSwgZW1haWw6IDEsIGNvbXBhbnk6IDEsIG9yZ2FuaXphdGlvbjogMSwgc3BhY2U6IDEsIGNvbXBhbnlfaWQ6IDEsIGNvbXBhbnlfaWRzOiAxfVxuXHRcdCMgY2hlY2sgaWYgdXNlciBpbiB0aGUgc3BhY2Vcblx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxuXHRcdGlmICFzdVxuXHRcdFx0c3BhY2VJZCA9IG51bGxcblxuXHRcdCMgaWYgc3BhY2VJZCBub3QgZXhpc3RzLCBnZXQgdGhlIGZpcnN0IG9uZS5cblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0aWYgaXNVblNhZmVNb2RlXG5cdFx0XHRcdHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3VzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcblx0XHRcdFx0aWYgIXN1XG5cdFx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdFx0c3BhY2VJZCA9IHN1LnNwYWNlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBudWxsXG5cblx0XHRVU0VSX0NPTlRFWFQgPSB7fVxuXHRcdFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWRcblx0XHRVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWRcblx0XHRVU0VSX0NPTlRFWFQudXNlciA9IHtcblx0XHRcdF9pZDogdXNlcklkXG5cdFx0XHRuYW1lOiBzdS5uYW1lLFxuXHRcdFx0bW9iaWxlOiBzdS5tb2JpbGUsXG5cdFx0XHRwb3NpdGlvbjogc3UucG9zaXRpb24sXG5cdFx0XHRlbWFpbDogc3UuZW1haWxcblx0XHRcdGNvbXBhbnk6IHN1LmNvbXBhbnlcblx0XHRcdGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWRcblx0XHRcdGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuXHRcdH1cblx0XHRzcGFjZV91c2VyX29yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIik/LmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKVxuXHRcdGlmIHNwYWNlX3VzZXJfb3JnXG5cdFx0XHRVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG5cdFx0XHRcdF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuXHRcdFx0XHRuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuXHRcdFx0XHRmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcblx0XHRcdH1cblx0XHRyZXR1cm4gVVNFUl9DT05URVhUXG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSAodXJsKS0+XG5cblx0aWYgXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICh1cmw/LnN0YXJ0c1dpdGgoXCIvYXNzZXRzXCIpIHx8IHVybD8uc3RhcnRzV2l0aChcImFzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCIvcGFja2FnZXNcIikpXG5cdFx0aWYgIS9eXFwvLy50ZXN0KHVybClcblx0XHRcdHVybCA9IFwiL1wiICsgdXJsXG5cdFx0cmV0dXJuIHVybFxuXG5cdGlmIHVybFxuXHRcdCMgdXJs5byA5aS05rKh5pyJXCIvXCLvvIzpnIDopoHmt7vliqBcIi9cIlxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsXG5cdGVsc2Vcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWFxuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSAodXNlcklkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxuXHRlbHNlXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkOjF9fSlcblx0cmV0dXJuIHN1LmNvbXBhbnlfaWRcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9ICh1c2VySWQsIHNwYWNlSWQpLT5cblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpXG5cdGVsc2Vcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKVxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWRzOjF9fSlcblx0cmV0dXJuIHN1Py5jb21wYW55X2lkc1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IChwbyktPlxuXHRpZiBwby5hbGxvd0NyZWF0ZVxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0XG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLnZpZXdBbGxSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHRwby52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0cG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXHRcdFxuXHQjIOWmguaenOmZhOS7tuebuOWFs+adg+mZkOmFjee9ruS4uuepuu+8jOWImeWFvOWuueS5i+WJjeayoeaciemZhOS7tuadg+mZkOmFjee9ruaXtueahOinhOWImVxuXHRpZiBwby5hbGxvd1JlYWRcblx0XHR0eXBlb2YgcG8uYWxsb3dSZWFkRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdFx0dHlwZW9mIHBvLnZpZXdBbGxGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby52aWV3QWxsRmlsZXMgPSB0cnVlXG5cdGlmIHBvLmFsbG93RWRpdFxuXHRcdHR5cGVvZiBwby5hbGxvd0NyZWF0ZUZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93Q3JlYXRlRmlsZXMgPSB0cnVlXG5cdFx0dHlwZW9mIHBvLmFsbG93RWRpdEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby5hbGxvd0RlbGV0ZUZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlXG5cdGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcblx0XHR0eXBlb2YgcG8ubW9kaWZ5QWxsRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8ubW9kaWZ5QWxsRmlsZXMgPSB0cnVlXG5cblx0aWYgcG8uYWxsb3dDcmVhdGVGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0VkaXRGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0RlbGV0ZUZpbGVzXG5cdFx0cG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlXG5cdFx0cG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdGlmIHBvLnZpZXdBbGxGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRcdHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlXG5cdFx0cG8udmlld0FsbEZpbGVzID0gdHJ1ZVxuXG5cdHJldHVybiBwb1xuXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9ICgpLT5cblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZFxuXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gKCktPlxuXHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWRcblxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSAoc3BhY2VJZCktPlxuXHRpZiBzcGFjZUlkICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZCA9PSBzcGFjZUlkXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSAoc3BhY2VJZCktPlxuXHRpZiBzcGFjZUlkICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkID09IHNwYWNlSWRcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSXG5cdCIsInZhciBGaWJlcjtcblxuQ3JlYXRvci5kZXBzID0ge1xuICBhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3ksXG4gIG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG4gIEFwcHM6IHt9LFxuICBPYmplY3RzOiB7fVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIG9wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICByZXR1cm4gU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGNyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG59KTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSk7XG4gICAgfSkucnVuKCk7XG4gIH07XG59XG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iai5uYW1lO1xuICB9XG4gIGlmICghb2JqLmxpc3Rfdmlld3MpIHtcbiAgICBvYmoubGlzdF92aWV3cyA9IHt9O1xuICB9XG4gIGlmIChvYmouc3BhY2UpIHtcbiAgICBvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUgPT09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCcpIHtcbiAgICBvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCc7XG4gICAgb2JqID0gXy5jbG9uZShvYmopO1xuICAgIG9iai5uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9iajtcbiAgfVxuICBDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKTtcbiAgbmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG4gIENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5pbml0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIG9iajtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0LnNwYWNlKSB7XG4gICAgcmV0dXJuIFwiY19cIiArIG9iamVjdC5zcGFjZSArIFwiX1wiICsgb2JqZWN0Lm5hbWU7XG4gIH1cbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgaWYgKF8uaXNBcnJheShvYmplY3RfbmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgICBpZiAoKHJlZjEgPSByZWYub2JqZWN0KSAhPSBudWxsKSB7XG4gICAgICAgIHJlZjEuZGVwZW5kKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSBmdW5jdGlvbihvYmplY3RfaWQpIHtcbiAgcmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge1xuICAgIF9pZDogb2JqZWN0X2lkXG4gIH0pO1xufTtcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSk7XG4gIGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zWygocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLl9jb2xsZWN0aW9uX25hbWUgOiB2b2lkIDApIHx8IG9iamVjdF9uYW1lXTtcbiAgfVxufTtcblxuQ3JlYXRvci5yZW1vdmVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXTtcbn07XG5cbkNyZWF0b3IuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciByZWYsIHJlZjEsIHNwYWNlO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBzcGFjZSA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmRiKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHNwYWNlSWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGFkbWluczogMVxuICAgIH1cbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIGlmIChzcGFjZSAhPSBudWxsID8gc3BhY2UuYWRtaW5zIDogdm9pZCAwKSB7XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfVxufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucykge1xuICBpZiAoIV8uaXNTdHJpbmcoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIGZvcm11bGFyO1xuICB9XG4gIGlmIChDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG4gIHJldHVybiBmb3JtdWxhcjtcbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgY29udGV4dCkge1xuICB2YXIgc2VsZWN0b3I7XG4gIHNlbGVjdG9yID0ge307XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgYWN0aW9uLCBuYW1lLCB2YWx1ZTtcbiAgICBpZiAoKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLmxlbmd0aCA6IHZvaWQgMCkgPT09IDMpIHtcbiAgICAgIG5hbWUgPSBmaWx0ZXJbMF07XG4gICAgICBhY3Rpb24gPSBmaWx0ZXJbMV07XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgY29udGV4dCk7XG4gICAgICBzZWxlY3RvcltuYW1lXSA9IHt9O1xuICAgICAgcmV0dXJuIHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQ29tbW9uU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHJldHVybiBzcGFjZUlkID09PSAnY29tbW9uJztcbn07XG5cblxuLypcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuICovXG5cbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gZnVuY3Rpb24oZG9jcywgaWRzLCBpZF9rZXksIGhpdF9maXJzdCkge1xuICB2YXIgdmFsdWVzO1xuICBpZiAoIWlkX2tleSkge1xuICAgIGlkX2tleSA9IFwiX2lkXCI7XG4gIH1cbiAgaWYgKGhpdF9maXJzdCkge1xuICAgIHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KTtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICB2YXIgX2luZGV4O1xuICAgICAgX2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgICAgaWYgKF9pbmRleCA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfaW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaWRzLmxlbmd0aCArIF8uaW5kZXhPZih2YWx1ZXMsIGRvY1tpZF9rZXldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICByZXR1cm4gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5cbi8qXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiAqL1xuXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSBmdW5jdGlvbih2YWx1ZTEsIHZhbHVlMikge1xuICB2YXIgaXNWYWx1ZTFFbXB0eSwgaXNWYWx1ZTJFbXB0eSwgbG9jYWxlO1xuICBpZiAodGhpcy5rZXkpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldO1xuICAgIHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV07XG4gIH1cbiAgaWYgKHZhbHVlMSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlMSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgdmFsdWUyID09PSBcIm51bWJlclwiKSB7XG4gICAgcmV0dXJuIHZhbHVlMSAtIHZhbHVlMjtcbiAgfVxuICBpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09PSBudWxsIHx8IHZhbHVlMSA9PT0gdm9pZCAwO1xuICBpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09PSBudWxsIHx8IHZhbHVlMiA9PT0gdm9pZCAwO1xuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiAhaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgaWYgKCFpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICByZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSh2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlKTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRMaXN0LCByZWxhdGVkTGlzdE1hcCwgcmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmICFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgcmVsYXRlZExpc3RNYXAgPSB7fTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3QsIGZ1bmN0aW9uKG9iak5hbWUpIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KG9iak5hbWUpKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lLm9iamVjdE5hbWVdID0ge307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgcmVsYXRlZF9maWVsZC50eXBlID09PSBcImxvb2t1cFwiKSAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUgJiYgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0pIHtcbiAgICAgICAgICBpZiAoXy5pc0VtcHR5KHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7XG4gICAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICAgIH07XG4gICAgfVxuICAgIF8uZWFjaChbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgZnVuY3Rpb24oZW5hYmxlT2JqTmFtZSkge1xuICAgICAgaWYgKHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSxcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSkge1xuICAgICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyhyZWxhdGVkTGlzdE1hcCk7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZmlsZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgc2ZzRmlsZXNPYmplY3Q7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgICAgc2ZzRmlsZXNPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpO1xuICAgICAgc2ZzRmlsZXNPYmplY3QgJiYgKHJlbGF0ZWRfb2JqZWN0ID0gc2ZzRmlsZXNPYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiAmJiByZWxhdGVkX2ZpZWxkLnJlbGF0ZWRMaXN0KSkgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcIm9iamVjdF9maWVsZHNcIikge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBpZiAoX29iamVjdC5lbmFibGVfdGFza3MpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJ0YXNrc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX25vdGVzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwibm90ZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ldmVudHMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJldmVudHNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9pbnN0YW5jZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9hcHByb3ZhbHMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJhcHByb3ZhbHNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9wcm9jZXNzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwicHJvY2Vzc19pbnN0YW5jZV9oaXN0b3J5XCIsXG4gICAgICBmb3JlaWduX2tleTogXCJ0YXJnZXRfb2JqZWN0XCJcbiAgICB9KTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpIHtcbiAgdmFyIFVTRVJfQ09OVEVYVCwgcmVmLCBzcGFjZV91c2VyX29yZywgc3UsIHN1RmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUO1xuICB9IGVsc2Uge1xuICAgIGlmICghKHVzZXJJZCAmJiBzcGFjZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN1RmllbGRzID0ge1xuICAgICAgbmFtZTogMSxcbiAgICAgIG1vYmlsZTogMSxcbiAgICAgIHBvc2l0aW9uOiAxLFxuICAgICAgZW1haWw6IDEsXG4gICAgICBjb21wYW55OiAxLFxuICAgICAgb3JnYW5pemF0aW9uOiAxLFxuICAgICAgc3BhY2U6IDEsXG4gICAgICBjb21wYW55X2lkOiAxLFxuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9O1xuICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgfSk7XG4gICAgaWYgKCFzdSkge1xuICAgICAgc3BhY2VJZCA9IG51bGw7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgaWYgKGlzVW5TYWZlTW9kZSkge1xuICAgICAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghc3UpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzcGFjZUlkID0gc3Uuc3BhY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgVVNFUl9DT05URVhUID0ge307XG4gICAgVVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZDtcbiAgICBVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWQ7XG4gICAgVVNFUl9DT05URVhULnVzZXIgPSB7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIG5hbWU6IHN1Lm5hbWUsXG4gICAgICBtb2JpbGU6IHN1Lm1vYmlsZSxcbiAgICAgIHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcbiAgICAgIGVtYWlsOiBzdS5lbWFpbCxcbiAgICAgIGNvbXBhbnk6IHN1LmNvbXBhbnksXG4gICAgICBjb21wYW55X2lkOiBzdS5jb21wYW55X2lkLFxuICAgICAgY29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXG4gICAgfTtcbiAgICBzcGFjZV91c2VyX29yZyA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpKSAhPSBudWxsID8gcmVmLmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKSA6IHZvaWQgMDtcbiAgICBpZiAoc3BhY2VfdXNlcl9vcmcpIHtcbiAgICAgIFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcbiAgICAgICAgX2lkOiBzcGFjZV91c2VyX29yZy5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXG4gICAgICAgIGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFVTRVJfQ09OVEVYVDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICBpZiAoXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICgodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9hc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSA6IHZvaWQgMCkpKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBpZiAodXJsKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWQ6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UuY29tcGFueV9pZDtcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdSAhPSBudWxsID8gc3UuY29tcGFueV9pZHMgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHBvKSB7XG4gIGlmIChwby5hbGxvd0NyZWF0ZSkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93UmVhZCkge1xuICAgIHR5cGVvZiBwby5hbGxvd1JlYWRGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZSk7XG4gICAgdHlwZW9mIHBvLnZpZXdBbGxGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLnZpZXdBbGxGaWxlcyA9IHRydWUpO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICB0eXBlb2YgcG8uYWxsb3dDcmVhdGVGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93Q3JlYXRlRmlsZXMgPSB0cnVlKTtcbiAgICB0eXBlb2YgcG8uYWxsb3dFZGl0RmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd0VkaXRGaWxlcyA9IHRydWUpO1xuICAgIHR5cGVvZiBwby5hbGxvd0RlbGV0ZUZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWUpO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgdHlwZW9mIHBvLm1vZGlmeUFsbEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8ubW9kaWZ5QWxsRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8uYWxsb3dDcmVhdGVGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0RmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlRmlsZXMpIHtcbiAgICBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWU7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsRmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZTtcbiAgICBwby52aWV3QWxsRmlsZXMgPSB0cnVlO1xuICB9XG4gIHJldHVybiBwbztcbn07XG5cbkNyZWF0b3IuZ2V0VGVtcGxhdGVTcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0Q2xvdWRBZG1pblNwYWNlSWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYuY2xvdWRBZG1pblNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmlzVGVtcGxhdGVTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKHNwYWNlSWQgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYudGVtcGxhdGVTcGFjZUlkIDogdm9pZCAwKSA9PT0gc3BhY2VJZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwKSA9PT0gc3BhY2VJZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVI7XG59XG4iLCJNZXRlb3IubWV0aG9kc1xuXHQjIOeUqOaIt+iOt+WPlmxvb2t1cCDjgIFtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q6155qE6YCJ6aG55YC8XG5cdFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiAob3B0aW9ucyktPlxuXHRcdGlmIG9wdGlvbnM/LnBhcmFtcz8ucmVmZXJlbmNlX3RvXG5cblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpXG5cblx0XHRcdG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cblx0XHRcdHF1ZXJ5ID0ge31cblx0XHRcdGlmIG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cdFx0XHRcdHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2VcblxuXHRcdFx0XHRzb3J0ID0gb3B0aW9ucz8uc29ydFxuXG5cdFx0XHRcdHNlbGVjdGVkID0gb3B0aW9ucz8uc2VsZWN0ZWQgfHwgW11cblxuXHRcdFx0XHRvcHRpb25zX2xpbWl0ID0gb3B0aW9ucz8ub3B0aW9uc19saW1pdCB8fCAxMFxuXG5cdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeSA9IHt9XG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH1cblxuXHRcdFx0XHRpZiBvcHRpb25zPy52YWx1ZXM/Lmxlbmd0aFxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX0sIHNlYXJjaFRleHRRdWVyeV1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fV1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0Xy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSlcblx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JG5pbjogc2VsZWN0ZWR9XG5cblx0XHRcdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxuXG5cdFx0XHRcdGlmIG9wdGlvbnMuZmlsdGVyUXVlcnlcblx0XHRcdFx0XHRfLmV4dGVuZCBxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeVxuXG5cdFx0XHRcdHF1ZXJ5X29wdGlvbnMgPSB7bGltaXQ6IG9wdGlvbnNfbGltaXR9XG5cblx0XHRcdFx0aWYgc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpXG5cdFx0XHRcdFx0cXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydFxuXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKClcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBbXVxuXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY29yZHMsIChyZWNvcmQpLT5cblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcmVjb3JkLl9pZFxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcblx0XHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpXG5cdFx0cmV0dXJuIFtdICIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZSwgbmFtZV9maWVsZF9rZXksIG9iamVjdCwgb3B0aW9uc19saW1pdCwgcXVlcnksIHF1ZXJ5X29wdGlvbnMsIHJlY29yZHMsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2VhcmNoVGV4dFF1ZXJ5LCBzZWxlY3RlZCwgc29ydDtcbiAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZiA9IG9wdGlvbnMucGFyYW1zKSAhPSBudWxsID8gcmVmLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSk7XG4gICAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5wYXJhbXMuc3BhY2UpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZTtcbiAgICAgICAgc29ydCA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc29ydCA6IHZvaWQgMDtcbiAgICAgICAgc2VsZWN0ZWQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zZWxlY3RlZCA6IHZvaWQgMCkgfHwgW107XG4gICAgICAgIG9wdGlvbnNfbGltaXQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5vcHRpb25zX2xpbWl0IDogdm9pZCAwKSB8fCAxMDtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7XG4gICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYxID0gb3B0aW9ucy52YWx1ZXMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VhcmNoVGV4dFF1ZXJ5XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAkbmluOiBzZWxlY3RlZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyUXVlcnkpIHtcbiAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgcXVlcnlfb3B0aW9ucyA9IHtcbiAgICAgICAgICBsaW1pdDogb3B0aW9uc19saW1pdFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpKSB7XG4gICAgICAgICAgcXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpO1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHJlY29yZHMsIGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLl9pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXG5cblx0XHRoYXNoRGF0YSA9IHJlcS5ib2R5XG5cdFx0b2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZVxuXHRcdHJlY29yZF9pZCA9IGhhc2hEYXRhLnJlY29yZF9pZFxuXHRcdHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWRcblxuXHRcdGNoZWNrIG9iamVjdF9uYW1lLCBTdHJpbmdcblx0XHRjaGVjayByZWNvcmRfaWQsIFN0cmluZ1xuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcblxuXHRcdGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkXG5cdFx0eF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXVxuXHRcdHhfYXV0aF90b2tlbiA9IHJlcS5xdWVyeVsnWC1BdXRoLVRva2VuJ11cblxuXHRcdHJlZGlyZWN0X3VybCA9IFwiL1wiXG5cdFx0aW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkKVxuXHRcdCMgLSDmiJHnmoTojYnnqL/lsLHot7Povazoh7PojYnnqL/nrrFcblx0XHQjIC0g5oiR55qE5b6F5a6h5qC45bCx6Lez6L2s6Iez5b6F5a6h5qC4XG5cdFx0IyAtIOS4jeaYr+aIkeeahOeUs+ivt+WNleWImei3s+i9rOiHs+aJk+WNsOmhtemdolxuXHRcdCMgLSDlpoLnlLPor7fljZXkuI3lrZjlnKjliJnmj5DnpLrnlKjmiLfnlLPor7fljZXlt7LliKDpmaTvvIzlubbkuJTmm7TmlrByZWNvcmTnmoTnirbmgIHvvIzkvb/nlKjmiLflj6/ku6Xph43mlrDlj5HotbflrqHmiblcblx0XHRpZiBpbnNcblx0XHRcdGJveCA9ICcnXG5cdFx0XHRzcGFjZUlkID0gaW5zLnNwYWNlXG5cdFx0XHRmbG93SWQgPSBpbnMuZmxvd1xuXG5cdFx0XHRpZiAoaW5zLmluYm94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpIG9yIChpbnMuY2NfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0Ym94ID0gJ2luYm94J1xuXHRcdFx0ZWxzZSBpZiBpbnMub3V0Ym94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWRcblx0XHRcdFx0Ym94ID0gJ291dGJveCdcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdkcmFmdCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXG5cdFx0XHRcdGJveCA9ICdkcmFmdCdcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdwZW5kaW5nJyBhbmQgKGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkIG9yIGlucy5hcHBsaWNhbnQgaXMgY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRib3ggPSAncGVuZGluZydcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdjb21wbGV0ZWQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxuXHRcdFx0XHRib3ggPSAnY29tcGxldGVkJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOmqjOivgWxvZ2luIHVzZXJfaWTlr7nor6XmtYHnqIvmnInnrqHnkIbjgIHop4Llr5/nlLPor7fljZXnmoTmnYPpmZBcblx0XHRcdFx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwgeyBmaWVsZHM6IHsgYWRtaW5zOiAxIH0gfSlcblx0XHRcdFx0aWYgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZG1pblwiKSBvciBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcIm1vbml0b3JcIikgb3Igc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0XHRib3ggPSAnbW9uaXRvcidcblx0XHRcdHdvcmtmbG93VXJsID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcz8ud29ya2Zsb3c/LnVybFxuXHRcdFx0aWYgYm94XG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vI3tib3h9LyN7aW5zSWR9P1gtVXNlci1JZD0je3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSN7eF9hdXRoX3Rva2VufVwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vcHJpbnQvI3tpbnNJZH0/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcblxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0XHRjb2RlOiAyMDBcblx0XHRcdFx0ZGF0YTogeyByZWRpcmVjdF91cmw6IHJlZGlyZWN0X3VybCB9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcblx0XHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdFx0Y29sbGVjdGlvbi51cGRhdGUocmVjb3JkX2lkLCB7XG5cdFx0XHRcdFx0JHVuc2V0OiB7XG5cdFx0XHRcdFx0XHRcImluc3RhbmNlc1wiOiAxLFxuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZV9zdGF0ZVwiOiAxLFxuXHRcdFx0XHRcdFx0XCJsb2NrZWRcIjogMVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKVxuXG5cdGNhdGNoIGVcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XG5cdFx0fVxuXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL3dvcmtmbG93L3ZpZXcvOmluc3RhbmNlSWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYm94LCBjb2xsZWN0aW9uLCBjdXJyZW50X3VzZXJfaWQsIGN1cnJlbnRfdXNlcl9pbmZvLCBlLCBmbG93SWQsIGhhc2hEYXRhLCBpbnMsIGluc0lkLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbnMsIHJlY29yZF9pZCwgcmVkaXJlY3RfdXJsLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHNwYWNlLCBzcGFjZUlkLCBzcGFjZV9pZCwgd29ya2Zsb3dVcmwsIHhfYXV0aF90b2tlbiwgeF91c2VyX2lkO1xuICB0cnkge1xuICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgY3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkO1xuICAgIGhhc2hEYXRhID0gcmVxLmJvZHk7XG4gICAgb2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZTtcbiAgICByZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWQ7XG4gICAgc3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZDtcbiAgICBjaGVjayhvYmplY3RfbmFtZSwgU3RyaW5nKTtcbiAgICBjaGVjayhyZWNvcmRfaWQsIFN0cmluZyk7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgaW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWQ7XG4gICAgeF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICB4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddO1xuICAgIHJlZGlyZWN0X3VybCA9IFwiL1wiO1xuICAgIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCk7XG4gICAgaWYgKGlucykge1xuICAgICAgYm94ID0gJyc7XG4gICAgICBzcGFjZUlkID0gaW5zLnNwYWNlO1xuICAgICAgZmxvd0lkID0gaW5zLmZsb3c7XG4gICAgICBpZiAoKChyZWYgPSBpbnMuaW5ib3hfdXNlcnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkgfHwgKChyZWYxID0gaW5zLmNjX3VzZXJzKSAhPSBudWxsID8gcmVmMS5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSkge1xuICAgICAgICBib3ggPSAnaW5ib3gnO1xuICAgICAgfSBlbHNlIGlmICgocmVmMiA9IGlucy5vdXRib3hfdXNlcnMpICE9IG51bGwgPyByZWYyLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHtcbiAgICAgICAgYm94ID0gJ291dGJveCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2RyYWZ0JyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2RyYWZ0JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAncGVuZGluZycgJiYgKGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCB8fCBpbnMuYXBwbGljYW50ID09PSBjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgIGJveCA9ICdwZW5kaW5nJztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2NvbXBsZXRlZCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZCk7XG4gICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgYWRtaW5zOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgfHwgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJtb25pdG9yXCIpIHx8IHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgICAgYm94ID0gJ21vbml0b3InO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3b3JrZmxvd1VybCA9IChyZWYzID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjQgPSByZWYzLndvcmtmbG93KSAhPSBudWxsID8gcmVmNC51cmwgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoYm94KSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9cIiArIGJveCArIFwiL1wiICsgaW5zSWQgKyBcIj9YLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIChcIndvcmtmbG93L3NwYWNlL1wiICsgc3BhY2VJZCArIFwiL3ByaW50L1wiICsgaW5zSWQgKyBcIj9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfVxuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZWRpcmVjdF91cmw6IHJlZGlyZWN0X3VybFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpO1xuICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgY29sbGVjdGlvbi51cGRhdGUocmVjb3JkX2lkLCB7XG4gICAgICAgICAgJHVuc2V0OiB7XG4gICAgICAgICAgICBcImluc3RhbmNlc1wiOiAxLFxuICAgICAgICAgICAgXCJpbnN0YW5jZV9zdGF0ZVwiOiAxLFxuICAgICAgICAgICAgXCJsb2NrZWRcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+eUs+ivt+WNleW3suWIoOmZpCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpIC0+XG5cdF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSk/Ll9zY2hlbWFcblx0Y29sdW1uX251bSA9IDBcblx0aWYgX3NjaGVtYVxuXHRcdF8uZWFjaCBjb2x1bW5zLCAoZmllbGRfbmFtZSkgLT5cblx0XHRcdGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpXG5cdFx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXG5cdFx0XHRpZiBpc193aWRlXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDFcblxuXHRcdGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW1cblx0XHRyZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50XG5cbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIC0+XG5cdF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYVxuXHRpZiBfc2NoZW1hXG5cdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcblx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXG5cdFx0cmV0dXJuIGlzX3dpZGVcblxuQ3JlYXRvci5nZXRUYWJ1bGFyT3JkZXIgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykgLT5cblx0c2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnM/LnNldHRpbmdzPy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJ9KVxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IF8ubWFwIGNvbHVtbnMsIChjb2x1bW4pLT5cblx0XHRmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXVxuXHRcdGlmIGZpZWxkPy50eXBlIGFuZCAhZmllbGQuaGlkZGVuXG5cdFx0XHRyZXR1cm4gY29sdW1uXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRjb2x1bW5zID0gXy5jb21wYWN0IGNvbHVtbnNcblx0aWYgc2V0dGluZyBhbmQgc2V0dGluZy5zZXR0aW5nc1xuXHRcdHNvcnQgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0/LnNvcnQgfHwgW11cblx0XHRzb3J0ID0gXy5tYXAgc29ydCwgKG9yZGVyKS0+XG5cdFx0XHRrZXkgPSBvcmRlclswXVxuXHRcdFx0aW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KVxuXHRcdFx0b3JkZXJbMF0gPSBpbmRleCArIDFcblx0XHRcdHJldHVybiBvcmRlclxuXHRcdHJldHVybiBzb3J0XG5cdHJldHVybiBbXVxuXG5cbkNyZWF0b3IuaW5pdExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSktPlxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cblx0ZXh0cmFfY29sdW1ucyA9IFtcIm93bmVyXCJdXG5cdGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl1cblx0aWYgZGVmYXVsdF9leHRyYV9jb2x1bW5zXG5cdFx0ZXh0cmFfY29sdW1ucyA9IF8udW5pb24gZXh0cmFfY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zXG5cblx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkcz9bb2JqZWN0X25hbWVdID0gW11cblxuQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcgPSAoZGVmYXVsdF92aWV3LCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19uYW1lKS0+XG5cdGRlZmF1bHRfY29sdW1ucyA9IGRlZmF1bHRfdmlldz8uY29sdW1uc1xuXHRkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3Py5tb2JpbGVfY29sdW1uc1xuXHR1bmxlc3MgbGlzdF92aWV3XG5cdFx0cmV0dXJuXG5cdG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpXG5cdFx0b2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lXG5cdGlmICFvaXRlbS5jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdF9jb2x1bW5zXG5cdFx0XHRvaXRlbS5jb2x1bW5zID0gZGVmYXVsdF9jb2x1bW5zXG5cdGlmICFvaXRlbS5jb2x1bW5zXG5cdFx0b2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl1cblx0aWYgIW9pdGVtLm1vYmlsZV9jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdF9tb2JpbGVfY29sdW1uc1xuXHRcdFx0b2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zXG5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpICYmICFfLmluY2x1ZGUob2l0ZW0uY29sdW1ucywgJ3NwYWNlJylcblx0XHRcdG9pdGVtLmNvbHVtbnMucHVzaCgnc3BhY2UnKVxuXG5cblx0aWYgIW9pdGVtLmZpbHRlcl9zY29wZVxuXHRcdCMgbGlzdHZpZXfop4blm77nmoRmaWx0ZXJfc2NvcGXpu5jorqTlgLzmlLnkuLpzcGFjZSAjMTMxXG5cdFx0b2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiXG5cblx0aWYgIV8uaGFzKG9pdGVtLCBcIl9pZFwiKVxuXHRcdG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lXG5cdGVsc2Vcblx0XHRvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lXG5cblx0aWYgXy5pc1N0cmluZyhvaXRlbS5vcHRpb25zKVxuXHRcdG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpXG5cblx0Xy5mb3JFYWNoIG9pdGVtLmZpbHRlcnMsIChmaWx0ZXIsIF9pbmRleCktPlxuXHRcdGlmICFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcilcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcblx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcblx0cmV0dXJuIG9pdGVtXG5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdENyZWF0b3IuZ2V0UmVsYXRlZExpc3QgPSAob2JqZWN0X25hbWUpLT5cblx0XHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRcdHJldHVyblxuXHRcdHJlbGF0ZWRMaXN0T2JqZWN0cyA9IHt9XG5cdFx0cmVsYXRlZExpc3ROYW1lcyA9IFtdXG5cdFx0b2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzID0gW107XG5cdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmIF9vYmplY3Rcblx0XHRcdGxheW91dFJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkX2xpc3RzO1xuXHRcdFx0IyBsYXlvdXRSZWxhdGVkTGlzdCDmmK/mlbDnu4TlsLHooajnpLrphY3nva7ov4fpobXpnaLluIPlsYDvvIzlsLHlkK/nlKjpobXpnaLluIPlsYDnmoTnm7jlhbPlrZDooajjgIJcblx0XHRcdGlmIF8uaXNBcnJheSBsYXlvdXRSZWxhdGVkTGlzdFxuXHRcdFx0XHRfLmVhY2ggbGF5b3V0UmVsYXRlZExpc3QsIChpdGVtKS0+XG5cdFx0XHRcdFx0cmVPYmplY3ROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0XHRyZUZpZWxkTmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSBDcmVhdG9yLmdldE9iamVjdChyZU9iamVjdE5hbWUpPy5maWVsZHNbcmVGaWVsZE5hbWVdPy53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXHRcdFx0XHRcdHJlbGF0ZWQgPVxuXHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IHJlT2JqZWN0TmFtZVxuXHRcdFx0XHRcdFx0Y29sdW1uczogaXRlbS5maWVsZF9uYW1lc1xuXHRcdFx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXNcblx0XHRcdFx0XHRcdGlzX2ZpbGU6IHJlT2JqZWN0TmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb246IGl0ZW0uZmlsdGVyc1xuXHRcdFx0XHRcdFx0c29ydDogaXRlbS5zb3J0XG5cdFx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6IHJlRmllbGROYW1lXG5cdFx0XHRcdFx0XHRjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZVxuXHRcdFx0XHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRcdFx0XHRsYWJlbDogaXRlbS5sYWJlbFxuXHRcdFx0XHRcdFx0YWN0aW9uczogaXRlbS5idXR0b25zXG5cdFx0XHRcdFx0XHR2aXNpYmxlX29uOiBpdGVtLnZpc2libGVfb25cblx0XHRcdFx0XHRcdHBhZ2Vfc2l6ZTogaXRlbS5wYWdlX3NpemVcblx0XHRcdFx0XHRvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMucHVzaChyZWxhdGVkKVxuXHRcdFx0XHRyZXR1cm4gb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzO1xuXHRcdFx0cmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0XG5cdFx0XHRpZiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XG5cdFx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdCwgKG9iak9yTmFtZSktPlxuXHRcdFx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqT3JOYW1lXG5cdFx0XHRcdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lXG5cdFx0XHRcdFx0XHRcdGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zXG5cdFx0XHRcdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBvYmpPck5hbWUubW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0XHRcdFx0aXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb246IG9iak9yTmFtZS5maWx0ZXJzXG5cdFx0XHRcdFx0XHRcdHNvcnQ6IG9iak9yTmFtZS5zb3J0XG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogJydcblx0XHRcdFx0XHRcdFx0Y3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWVcblx0XHRcdFx0XHRcdFx0bGFiZWw6IG9iak9yTmFtZS5sYWJlbFxuXHRcdFx0XHRcdFx0XHRhY3Rpb25zOiBvYmpPck5hbWUuYWN0aW9uc1xuXHRcdFx0XHRcdFx0XHRwYWdlX3NpemU6IG9iak9yTmFtZS5wYWdlX3NpemVcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE5hbWVzLnB1c2ggb2JqT3JOYW1lLm9iamVjdE5hbWVcblx0XHRcdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcgb2JqT3JOYW1lXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE5hbWVzLnB1c2ggb2JqT3JOYW1lXG5cblx0XHRtYXBMaXN0ID0ge31cblx0XHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKVxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdHMsIChyZWxhdGVkX29iamVjdF9pdGVtKSAtPlxuXHRcdFx0aWYgIXJlbGF0ZWRfb2JqZWN0X2l0ZW0/Lm9iamVjdF9uYW1lXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWVcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXlcblx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZF9vYmplY3RfaXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXHRcdFx0cmVsYXRlZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKVxuXHRcdFx0dW5sZXNzIHJlbGF0ZWRfb2JqZWN0XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXVxuXHRcdFx0Y29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXVxuXHRcdFx0bW9iaWxlX2NvbHVtbnMgPSBfLndpdGhvdXQobW9iaWxlX2NvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSlcblxuXHRcdFx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0XHR0YWJ1bGFyX29yZGVyID0gQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyKG9yZGVyLCBjb2x1bW5zKVxuXG5cdFx0XHRpZiAvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSlcblx0XHRcdFx0IyBvYmplY3TnsbvlnovluKblrZDlsZ7mgKfnmoRyZWxhdGVkX2ZpZWxkX25hbWXopoHljrvmjonkuK3pl7TnmoTnvo7lhYPnrKblj7fvvIzlkKbliJnmmL7npLrkuI3lh7rlrZfmrrXlgLxcblx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9maWVsZF9uYW1lLnJlcGxhY2UoL1xcJFxcLi8sXCJcIilcblx0XHRcdHJlbGF0ZWQgPVxuXHRcdFx0XHRvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZVxuXHRcdFx0XHRjb2x1bW5zOiBjb2x1bW5zXG5cdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBtb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZVxuXHRcdFx0XHRpc19maWxlOiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cblx0XHRcdHJlbGF0ZWRPYmplY3QgPSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV1cblx0XHRcdGlmIHJlbGF0ZWRPYmplY3Rcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jb2x1bW5zXG5cdFx0XHRcdFx0cmVsYXRlZC5jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5jb2x1bW5zXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0XHRyZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LnNvcnRcblx0XHRcdFx0XHRyZWxhdGVkLnNvcnQgPSByZWxhdGVkT2JqZWN0LnNvcnRcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cblx0XHRcdFx0XHRyZWxhdGVkLmZpbHRlcnNGdW5jdGlvbiA9IHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Rcblx0XHRcdFx0XHRyZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmxhYmVsXG5cdFx0XHRcdFx0cmVsYXRlZC5sYWJlbCA9IHJlbGF0ZWRPYmplY3QubGFiZWxcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5wYWdlX3NpemVcblx0XHRcdFx0XHRyZWxhdGVkLnBhZ2Vfc2l6ZSA9IHJlbGF0ZWRPYmplY3QucGFnZV9zaXplXG5cdFx0XHRcdGRlbGV0ZSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV1cblxuXHRcdFx0bWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWRcblxuXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfLnZhbHVlcyhyZWxhdGVkTGlzdE9iamVjdHMpLCBcIm9iamVjdF9uYW1lXCIpXG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdFx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdF8uZWFjaCByZWxhdGVkTGlzdE9iamVjdHMsICh2LCByZWxhdGVkX29iamVjdF9uYW1lKSAtPlxuXHRcdFx0aXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTFcblx0XHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXG5cdFx0XHRpZiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWRcblx0XHRcdFx0bWFwTGlzdFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHZcblxuXHRcdGxpc3QgPSBbXVxuXHRcdGlmIF8uaXNFbXB0eSByZWxhdGVkTGlzdE5hbWVzXG5cdFx0XHRsaXN0ID0gIF8udmFsdWVzIG1hcExpc3Rcblx0XHRlbHNlXG5cdFx0XHRfLmVhY2ggcmVsYXRlZExpc3ROYW1lcywgKG9iamVjdE5hbWUpIC0+XG5cdFx0XHRcdGlmIG1hcExpc3Rbb2JqZWN0TmFtZV1cblx0XHRcdFx0XHRsaXN0LnB1c2ggbWFwTGlzdFtvYmplY3ROYW1lXVxuXG5cdFx0aWYgXy5oYXMoX29iamVjdCwgJ2FsbG93X3JlbGF0ZWRMaXN0Jylcblx0XHRcdGxpc3QgPSBfLmZpbHRlciBsaXN0LCAoaXRlbSktPlxuXHRcdFx0XHRyZXR1cm4gXy5pbmNsdWRlKF9vYmplY3QuYWxsb3dfcmVsYXRlZExpc3QsIGl0ZW0ub2JqZWN0X25hbWUpXG5cblx0XHRyZXR1cm4gbGlzdFxuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUpLT5cblx0cmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKVxuXG4jIyMgXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxuXHRleGFj5Li6dHJ1ZeaXtu+8jOmcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOS4jem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvlxuIyMjXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhbGlzdF92aWV3X2lkXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdHJldHVyblxuXHRsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSlcblx0dW5sZXNzIGxpc3RWaWV3cz8ubGVuZ3RoXG5cdFx0cmV0dXJuXG5cdGxpc3RfdmlldyA9IF8uZmluZChsaXN0Vmlld3MsIChpdGVtKS0+IHJldHVybiBpdGVtLl9pZCA9PSBsaXN0X3ZpZXdfaWQgfHwgaXRlbS5uYW1lID09IGxpc3Rfdmlld19pZClcblx0dW5sZXNzIGxpc3Rfdmlld1xuXHRcdCMg5aaC5p6c5LiN6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5YiZ6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+77yM5Y+N5LmL6L+U5Zue56m6XG5cdFx0aWYgZXhhY1xuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0bGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdXG5cdHJldHVybiBsaXN0X3ZpZXdcblxuI+iOt+WPlmxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvuaYr+WQpuaYr+acgOi/keafpeeci+inhuWbvlxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhbGlzdF92aWV3X2lkXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRpZiB0eXBlb2YobGlzdF92aWV3X2lkKSA9PSBcInN0cmluZ1wiXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgIW9iamVjdFxuXHRcdFx0cmV0dXJuXG5cdFx0bGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cyx7X2lkOiBsaXN0X3ZpZXdfaWR9KVxuXHRlbHNlXG5cdFx0bGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWRcblx0cmV0dXJuIGxpc3RWaWV3Py5uYW1lID09IFwicmVjZW50XCJcblxuXG4jIyNcbiAgICDku45jb2x1bW5z5Y+C5pWw5Lit6L+H5ruk5Ye655So5LqO5omL5py656uv5pi+56S655qEY29sdW1uc1xuXHTop4TliJnvvJpcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxuXHQyLuacgOWkmuWPqui/lOWbnjTkuKrlrZfmrrVcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcbiMjI1xuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IChvYmplY3RfbmFtZSwgY29sdW1ucyktPlxuXHRyZXN1bHQgPSBbXVxuXHRtYXhSb3dzID0gMiBcblx0bWF4Q291bnQgPSBtYXhSb3dzICogMlxuXHRjb3VudCA9IDBcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IG9iamVjdC5maWVsZHNcblx0dW5sZXNzIG9iamVjdFxuXHRcdHJldHVybiBjb2x1bW5zXG5cdG5hbWVLZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcblx0aXNOYW1lQ29sdW1uID0gKGl0ZW0pLT5cblx0XHRpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHRyZXR1cm4gaXRlbS5maWVsZCA9PSBuYW1lS2V5XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGl0ZW0gPT0gbmFtZUtleVxuXHRnZXRGaWVsZCA9IChpdGVtKS0+XG5cdFx0aWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0cmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmaWVsZHNbaXRlbV1cblx0aWYgbmFtZUtleVxuXHRcdG5hbWVDb2x1bW4gPSBjb2x1bW5zLmZpbmQgKGl0ZW0pLT5cblx0XHRcdHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSlcblx0aWYgbmFtZUNvbHVtblxuXHRcdGZpZWxkID0gZ2V0RmllbGQobmFtZUNvbHVtbilcblx0XHRpdGVtQ291bnQgPSBpZiBmaWVsZC5pc193aWRlIHRoZW4gMiBlbHNlIDFcblx0XHRjb3VudCArPSBpdGVtQ291bnRcblx0XHRyZXN1bHQucHVzaCBuYW1lQ29sdW1uXG5cdGNvbHVtbnMuZm9yRWFjaCAoaXRlbSktPlxuXHRcdGZpZWxkID0gZ2V0RmllbGQoaXRlbSlcblx0XHR1bmxlc3MgZmllbGRcblx0XHRcdHJldHVyblxuXHRcdGl0ZW1Db3VudCA9IGlmIGZpZWxkLmlzX3dpZGUgdGhlbiAyIGVsc2UgMVxuXHRcdGlmIGNvdW50IDwgbWF4Q291bnQgYW5kIHJlc3VsdC5sZW5ndGggPCBtYXhDb3VudCBhbmQgIWlzTmFtZUNvbHVtbihpdGVtKVxuXHRcdFx0Y291bnQgKz0gaXRlbUNvdW50XG5cdFx0XHRpZiBjb3VudCA8PSBtYXhDb3VudFxuXHRcdFx0XHRyZXN1bHQucHVzaCBpdGVtXG5cdFxuXHRyZXR1cm4gcmVzdWx0XG5cbiMjI1xuICAgIOiOt+WPlum7mOiupOinhuWbvlxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gKG9iamVjdF9uYW1lKS0+XG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRpZiBvYmplY3Q/Lmxpc3Rfdmlld3M/LmRlZmF1bHRcblx0XHQjVE9ETyDmraTku6PnoIHlj6rmmK/mmoLml7blhbzlrrnku6XliY1jb2Rl5Lit5a6a5LmJ55qEZGVmYXVsdOinhuWbvu+8jOW+hWNvZGXkuK3nmoRkZWZhdWx05riF55CG5a6M5oiQ5ZCO77yM6ZyA6KaB5Yig6Zmk5q2k5Luj56CBXG5cdFx0ZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3cy5kZWZhdWx0XG5cdGVsc2Vcblx0XHRfLmVhY2ggb2JqZWN0Py5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpLT5cblx0XHRcdGlmIGxpc3Rfdmlldy5uYW1lID09IFwiYWxsXCIgfHwga2V5ID09IFwiYWxsXCJcblx0XHRcdFx0ZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXdcblx0cmV0dXJuIGRlZmF1bHRWaWV3O1xuXG4jIyNcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IChvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Py5jb2x1bW5zXG5cdGlmIHVzZV9tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRWaWV3Py5tb2JpbGVfY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zXG5cdFx0ZWxzZSBpZiBjb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucylcblx0cmV0dXJuIGNvbHVtbnNcblxuIyMjXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo56ys5LiA5Liq6KeG5Zu+5pi+56S655qE5a2X5q61XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMgPSAob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucyktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyhvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Py5jb2x1bW5zXG5cdGlmIHVzZV9tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRWaWV3Py5tb2JpbGVfY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zXG5cdFx0ZWxzZSBpZiBjb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucylcblx0cmV0dXJuIGNvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSAob2JqZWN0X25hbWUpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmV4dHJhX2NvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0aWYgZGVmYXVsdFZpZXdcblx0XHRpZiBkZWZhdWx0Vmlldy5zb3J0XG5cdFx0XHRyZXR1cm4gZGVmYXVsdFZpZXcuc29ydFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dXG5cblxuIyMjXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcbiMjI1xuQ3JlYXRvci5pc0FsbFZpZXcgPSAobGlzdF92aWV3KS0+XG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJhbGxcIlxuXG4jIyNcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuIyMjXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IChsaXN0X3ZpZXcpLT5cblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcInJlY2VudFwiXG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IChzb3J0LCB0YWJ1bGFyQ29sdW1ucyktPlxuXHR0YWJ1bGFyX3NvcnQgPSBbXVxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcblx0XHRcdCMg5YW85a655pen55qE5pWw5o2u5qC85byPW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGlmIGl0ZW0ubGVuZ3RoID09IDFcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdXG5cdFx0XHRlbHNlIGlmIGl0ZW0ubGVuZ3RoID09IDJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBvcmRlcl1cblxuXHRyZXR1cm4gdGFidWxhcl9zb3J0XG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSAoc29ydCktPlxuXHRkeF9zb3J0ID0gW11cblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXG5cdFx0XHQj5YW85a655pen5qC85byP77yaW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGR4X3NvcnQucHVzaChpdGVtKVxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxuXHRcdFx0XHRkeF9zb3J0LnB1c2ggW2ZpZWxkX25hbWUsIG9yZGVyXVxuXG5cdHJldHVybiBkeF9zb3J0XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgY29sdW1ucykge1xuICB2YXIgX3NjaGVtYSwgY29sdW1uX251bSwgaW5pdF93aWR0aF9wZXJjZW50LCByZWY7XG4gIF9zY2hlbWEgPSAocmVmID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLl9zY2hlbWEgOiB2b2lkIDA7XG4gIGNvbHVtbl9udW0gPSAwO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgICB2YXIgZmllbGQsIGlzX3dpZGUsIHJlZjEsIHJlZjI7XG4gICAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICAgIGlzX3dpZGUgPSAocmVmMSA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMi5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGlzX3dpZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bTtcbiAgICByZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50O1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIHtcbiAgdmFyIF9zY2hlbWEsIGZpZWxkLCBpc193aWRlLCByZWYsIHJlZjE7XG4gIF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYTtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICBpc193aWRlID0gKHJlZiA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgcmV0dXJuIGlzX3dpZGU7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykge1xuICB2YXIgb2JqLCByZWYsIHJlZjEsIHJlZjIsIHNldHRpbmcsIHNvcnQ7XG4gIHNldHRpbmcgPSAocmVmID0gQ3JlYXRvci5Db2xsZWN0aW9ucykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnNldHRpbmdzKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gXy5tYXAoY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgdmFyIGZpZWxkO1xuICAgIGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dO1xuICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnR5cGUgOiB2b2lkIDApICYmICFmaWVsZC5oaWRkZW4pIHtcbiAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICB9KTtcbiAgY29sdW1ucyA9IF8uY29tcGFjdChjb2x1bW5zKTtcbiAgaWYgKHNldHRpbmcgJiYgc2V0dGluZy5zZXR0aW5ncykge1xuICAgIHNvcnQgPSAoKHJlZjIgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0pICE9IG51bGwgPyByZWYyLnNvcnQgOiB2b2lkIDApIHx8IFtdO1xuICAgIHNvcnQgPSBfLm1hcChzb3J0LCBmdW5jdGlvbihvcmRlcikge1xuICAgICAgdmFyIGluZGV4LCBrZXk7XG4gICAgICBrZXkgPSBvcmRlclswXTtcbiAgICAgIGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSk7XG4gICAgICBvcmRlclswXSA9IGluZGV4ICsgMTtcbiAgICAgIHJldHVybiBvcmRlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gc29ydDtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zLCBleHRyYV9jb2x1bW5zLCBvYmplY3QsIG9yZGVyLCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gIGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXTtcbiAgZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXTtcbiAgaWYgKGRlZmF1bHRfZXh0cmFfY29sdW1ucykge1xuICAgIGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uKGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucyk7XG4gIH1cbiAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiAocmVmID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHMpICE9IG51bGwgPyByZWZbb2JqZWN0X25hbWVdID0gW10gOiB2b2lkIDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gZnVuY3Rpb24oZGVmYXVsdF92aWV3LCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19uYW1lKSB7XG4gIHZhciBkZWZhdWx0X2NvbHVtbnMsIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMsIG9pdGVtO1xuICBkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcgIT0gbnVsbCA/IGRlZmF1bHRfdmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3ICE9IG51bGwgPyBkZWZhdWx0X3ZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICghbGlzdF92aWV3KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpO1xuICBpZiAoIV8uaGFzKG9pdGVtLCBcIm5hbWVcIikpIHtcbiAgICBvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWU7XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfY29sdW1ucykge1xuICAgICAgb2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1ucztcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgb2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl07XG4gIH1cbiAgaWYgKCFvaXRlbS5tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X21vYmlsZV9jb2x1bW5zKSB7XG4gICAgICBvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpICYmICFfLmluY2x1ZGUob2l0ZW0uY29sdW1ucywgJ3NwYWNlJykpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMucHVzaCgnc3BhY2UnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5maWx0ZXJfc2NvcGUpIHtcbiAgICBvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCI7XG4gIH1cbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJfaWRcIikpIHtcbiAgICBvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZTtcbiAgfSBlbHNlIHtcbiAgICBvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lO1xuICB9XG4gIGlmIChfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpKSB7XG4gICAgb2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucyk7XG4gIH1cbiAgXy5mb3JFYWNoKG9pdGVtLmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgaWYgKCFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5fdmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvaXRlbTtcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF9vYmplY3QsIGxheW91dFJlbGF0ZWRMaXN0LCBsaXN0LCBtYXBMaXN0LCBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMsIHBlcm1pc3Npb25zLCByZWxhdGVkTGlzdCwgcmVsYXRlZExpc3ROYW1lcywgcmVsYXRlZExpc3RPYmplY3RzLCByZWxhdGVkX29iamVjdF9uYW1lcywgcmVsYXRlZF9vYmplY3RzLCBzcGFjZUlkLCB1bnJlbGF0ZWRfb2JqZWN0cywgdXNlcklkO1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVsYXRlZExpc3RPYmplY3RzID0ge307XG4gICAgcmVsYXRlZExpc3ROYW1lcyA9IFtdO1xuICAgIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyA9IFtdO1xuICAgIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKF9vYmplY3QpIHtcbiAgICAgIGxheW91dFJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkX2xpc3RzO1xuICAgICAgaWYgKF8uaXNBcnJheShsYXlvdXRSZWxhdGVkTGlzdCkpIHtcbiAgICAgICAgXy5lYWNoKGxheW91dFJlbGF0ZWRMaXN0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIHJlRmllbGROYW1lLCByZU9iamVjdE5hbWUsIHJlZiwgcmVmMSwgcmVsYXRlZCwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICAgICAgcmVPYmplY3ROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgcmVGaWVsZE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChyZU9iamVjdE5hbWUpKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZmllbGRzW3JlRmllbGROYW1lXSkgIT0gbnVsbCA/IHJlZjEud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZU9iamVjdE5hbWUsXG4gICAgICAgICAgICBjb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzLFxuICAgICAgICAgICAgbW9iaWxlX2NvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXMsXG4gICAgICAgICAgICBpc19maWxlOiByZU9iamVjdE5hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgICAgICBmaWx0ZXJzRnVuY3Rpb246IGl0ZW0uZmlsdGVycyxcbiAgICAgICAgICAgIHNvcnQ6IGl0ZW0uc29ydCxcbiAgICAgICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogcmVGaWVsZE5hbWUsXG4gICAgICAgICAgICBjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCxcbiAgICAgICAgICAgIGxhYmVsOiBpdGVtLmxhYmVsLFxuICAgICAgICAgICAgYWN0aW9uczogaXRlbS5idXR0b25zLFxuICAgICAgICAgICAgdmlzaWJsZV9vbjogaXRlbS52aXNpYmxlX29uLFxuICAgICAgICAgICAgcGFnZV9zaXplOiBpdGVtLnBhZ2Vfc2l6ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cy5wdXNoKHJlbGF0ZWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cztcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdDtcbiAgICAgIGlmICghXy5pc0VtcHR5KHJlbGF0ZWRMaXN0KSkge1xuICAgICAgICBfLmVhY2gocmVsYXRlZExpc3QsIGZ1bmN0aW9uKG9iak9yTmFtZSkge1xuICAgICAgICAgIHZhciByZWxhdGVkO1xuICAgICAgICAgIGlmIChfLmlzT2JqZWN0KG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmpPck5hbWUub2JqZWN0TmFtZSxcbiAgICAgICAgICAgICAgY29sdW1uczogb2JqT3JOYW1lLmNvbHVtbnMsXG4gICAgICAgICAgICAgIG1vYmlsZV9jb2x1bW5zOiBvYmpPck5hbWUubW9iaWxlX2NvbHVtbnMsXG4gICAgICAgICAgICAgIGlzX2ZpbGU6IG9iak9yTmFtZS5vYmplY3ROYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICAgICAgICBmaWx0ZXJzRnVuY3Rpb246IG9iak9yTmFtZS5maWx0ZXJzLFxuICAgICAgICAgICAgICBzb3J0OiBvYmpPck5hbWUuc29ydCxcbiAgICAgICAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiAnJyxcbiAgICAgICAgICAgICAgY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWUsXG4gICAgICAgICAgICAgIGxhYmVsOiBvYmpPck5hbWUubGFiZWwsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IG9iak9yTmFtZS5hY3Rpb25zLFxuICAgICAgICAgICAgICBwYWdlX3NpemU6IG9iak9yTmFtZS5wYWdlX3NpemVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZWxhdGVkTGlzdE9iamVjdHNbb2JqT3JOYW1lLm9iamVjdE5hbWVdID0gcmVsYXRlZDtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE5hbWVzLnB1c2gob2JqT3JOYW1lLm9iamVjdE5hbWUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhvYmpPck5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3ROYW1lcy5wdXNoKG9iak9yTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgbWFwTGlzdCA9IHt9O1xuICAgIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpO1xuICAgIF8uZWFjaChyZWxhdGVkX29iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIHtcbiAgICAgIHZhciBjb2x1bW5zLCBtb2JpbGVfY29sdW1ucywgb3JkZXIsIHJlbGF0ZWQsIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRhYnVsYXJfb3JkZXIsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgICAgaWYgKCEocmVsYXRlZF9vYmplY3RfaXRlbSAhPSBudWxsID8gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWU7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5O1xuICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkX29iamVjdF9pdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgICAgcmVsYXRlZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIGlmICghcmVsYXRlZF9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXTtcbiAgICAgIGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG1vYmlsZV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lLCB0cnVlKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgbW9iaWxlX2NvbHVtbnMgPSBfLndpdGhvdXQobW9iaWxlX2NvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gICAgICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICB0YWJ1bGFyX29yZGVyID0gQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyKG9yZGVyLCBjb2x1bW5zKTtcbiAgICAgIGlmICgvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSkpIHtcbiAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9maWVsZF9uYW1lLnJlcGxhY2UoL1xcJFxcLi8sIFwiXCIpO1xuICAgICAgfVxuICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgIG1vYmlsZV9jb2x1bW5zOiBtb2JpbGVfY29sdW1ucyxcbiAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgIGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuICAgICAgfTtcbiAgICAgIHJlbGF0ZWRPYmplY3QgPSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgICBpZiAocmVsYXRlZE9iamVjdCkge1xuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5jb2x1bW5zKSB7XG4gICAgICAgICAgcmVsYXRlZC5jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5jb2x1bW5zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zKSB7XG4gICAgICAgICAgcmVsYXRlZC5tb2JpbGVfY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3Quc29ydCkge1xuICAgICAgICAgIHJlbGF0ZWQuc29ydCA9IHJlbGF0ZWRPYmplY3Quc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb24pIHtcbiAgICAgICAgICByZWxhdGVkLmZpbHRlcnNGdW5jdGlvbiA9IHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0KSB7XG4gICAgICAgICAgcmVsYXRlZC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCA9IHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubGFiZWwpIHtcbiAgICAgICAgICByZWxhdGVkLmxhYmVsID0gcmVsYXRlZE9iamVjdC5sYWJlbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5wYWdlX3NpemUpIHtcbiAgICAgICAgICByZWxhdGVkLnBhZ2Vfc2l6ZSA9IHJlbGF0ZWRPYmplY3QucGFnZV9zaXplO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWQ7XG4gICAgfSk7XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF8udmFsdWVzKHJlbGF0ZWRMaXN0T2JqZWN0cyksIFwib2JqZWN0X25hbWVcIik7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UocmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzKTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3RPYmplY3RzLCBmdW5jdGlvbih2LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgYWxsb3dSZWFkLCBpc0FjdGl2ZSwgcmVmO1xuICAgICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgICBhbGxvd1JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLmFsbG93UmVhZCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0FjdGl2ZSAmJiBhbGxvd1JlYWQpIHtcbiAgICAgICAgcmV0dXJuIG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxpc3QgPSBbXTtcbiAgICBpZiAoXy5pc0VtcHR5KHJlbGF0ZWRMaXN0TmFtZXMpKSB7XG4gICAgICBsaXN0ID0gXy52YWx1ZXMobWFwTGlzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChyZWxhdGVkTGlzdE5hbWVzLCBmdW5jdGlvbihvYmplY3ROYW1lKSB7XG4gICAgICAgIGlmIChtYXBMaXN0W29iamVjdE5hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3QucHVzaChtYXBMaXN0W29iamVjdE5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmhhcyhfb2JqZWN0LCAnYWxsb3dfcmVsYXRlZExpc3QnKSkge1xuICAgICAgbGlzdCA9IF8uZmlsdGVyKGxpc3QsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdDtcbiAgfTtcbn1cblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKTtcbn07XG5cblxuLyogXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxuXHRleGFj5Li6dHJ1ZeaXtu+8jOmcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOS4jem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKSB7XG4gIHZhciBsaXN0Vmlld3MsIGxpc3Rfdmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICBpZiAoIShsaXN0Vmlld3MgIT0gbnVsbCA/IGxpc3RWaWV3cy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RfdmlldyA9IF8uZmluZChsaXN0Vmlld3MsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5faWQgPT09IGxpc3Rfdmlld19pZCB8fCBpdGVtLm5hbWUgPT09IGxpc3Rfdmlld19pZDtcbiAgfSk7XG4gIGlmICghbGlzdF92aWV3KSB7XG4gICAgaWYgKGV4YWMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbGlzdF92aWV3O1xufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCkge1xuICB2YXIgbGlzdFZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIGxpc3Rfdmlld19pZCA9PT0gXCJzdHJpbmdcIikge1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLCB7XG4gICAgICBfaWQ6IGxpc3Rfdmlld19pZFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkO1xuICB9XG4gIHJldHVybiAobGlzdFZpZXcgIT0gbnVsbCA/IGxpc3RWaWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOS7jmNvbHVtbnPlj4LmlbDkuK3ov4fmu6Tlh7rnlKjkuo7miYvmnLrnq6/mmL7npLrnmoRjb2x1bW5zXG5cdOinhOWIme+8mlxuXHQxLuS8mOWFiOaKimNvbHVtbnPkuK3nmoRuYW1l5a2X5q615o6S5Zyo56ys5LiA5LiqXG5cdDIu5pyA5aSa5Y+q6L+U5ZueNOS4quWtl+autVxuXHQzLuiAg+iZkeWuveWtl+auteWNoOeUqOaVtOihjOinhOWImeadoeS7tuS4i++8jOacgOWkmuWPqui/lOWbnuS4pOihjFxuICovXG5cbkNyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgY29sdW1ucykge1xuICB2YXIgY291bnQsIGZpZWxkLCBmaWVsZHMsIGdldEZpZWxkLCBpc05hbWVDb2x1bW4sIGl0ZW1Db3VudCwgbWF4Q291bnQsIG1heFJvd3MsIG5hbWVDb2x1bW4sIG5hbWVLZXksIG9iamVjdCwgcmVzdWx0O1xuICByZXN1bHQgPSBbXTtcbiAgbWF4Um93cyA9IDI7XG4gIG1heENvdW50ID0gbWF4Um93cyAqIDI7XG4gIGNvdW50ID0gMDtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBvYmplY3QuZmllbGRzO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBjb2x1bW5zO1xuICB9XG4gIG5hbWVLZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gIGlzTmFtZUNvbHVtbiA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgcmV0dXJuIGl0ZW0uZmllbGQgPT09IG5hbWVLZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpdGVtID09PSBuYW1lS2V5O1xuICAgIH1cbiAgfTtcbiAgZ2V0RmllbGQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHJldHVybiBmaWVsZHNbaXRlbS5maWVsZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZHNbaXRlbV07XG4gICAgfVxuICB9O1xuICBpZiAobmFtZUtleSkge1xuICAgIG5hbWVDb2x1bW4gPSBjb2x1bW5zLmZpbmQoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIGlzTmFtZUNvbHVtbihpdGVtKTtcbiAgICB9KTtcbiAgfVxuICBpZiAobmFtZUNvbHVtbikge1xuICAgIGZpZWxkID0gZ2V0RmllbGQobmFtZUNvbHVtbik7XG4gICAgaXRlbUNvdW50ID0gZmllbGQuaXNfd2lkZSA/IDIgOiAxO1xuICAgIGNvdW50ICs9IGl0ZW1Db3VudDtcbiAgICByZXN1bHQucHVzaChuYW1lQ29sdW1uKTtcbiAgfVxuICBjb2x1bW5zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgIGZpZWxkID0gZ2V0RmllbGQoaXRlbSk7XG4gICAgaWYgKCFmaWVsZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpdGVtQ291bnQgPSBmaWVsZC5pc193aWRlID8gMiA6IDE7XG4gICAgaWYgKGNvdW50IDwgbWF4Q291bnQgJiYgcmVzdWx0Lmxlbmd0aCA8IG1heENvdW50ICYmICFpc05hbWVDb2x1bW4oaXRlbSkpIHtcbiAgICAgIGNvdW50ICs9IGl0ZW1Db3VudDtcbiAgICAgIGlmIChjb3VudCA8PSBtYXhDb3VudCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuLypcbiAgICDojrflj5bpu5jorqTop4blm75cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3LCBvYmplY3QsIHJlZjtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIH1cbiAgaWYgKG9iamVjdCAhPSBudWxsID8gKHJlZiA9IG9iamVjdC5saXN0X3ZpZXdzKSAhPSBudWxsID8gcmVmW1wiZGVmYXVsdFwiXSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgIGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3NbXCJkZWZhdWx0XCJdO1xuICB9IGVsc2Uge1xuICAgIF8uZWFjaChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC5saXN0X3ZpZXdzIDogdm9pZCAwLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuICAgICAgaWYgKGxpc3Rfdmlldy5uYW1lID09PSBcImFsbFwiIHx8IGtleSA9PT0gXCJhbGxcIikge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXc7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWaWV3O1xufTtcblxuXG4vKlxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAodXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMCkge1xuICAgICAgY29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zO1xuICAgIH0gZWxzZSBpZiAoY29sdW1ucykge1xuICAgICAgY29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29sdW1ucztcbn07XG5cblxuLypcbiAgICDojrflj5blr7nosaHnmoTliJfooajnrKzkuIDkuKrop4blm77mmL7npLrnmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucykge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAodXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMCkge1xuICAgICAgY29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zO1xuICAgIH0gZWxzZSBpZiAoY29sdW1ucykge1xuICAgICAgY29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29sdW1ucztcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k6aKd5aSW5Yqg6L2955qE5a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICByZXR1cm4gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmV4dHJhX2NvbHVtbnMgOiB2b2lkIDA7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIGlmIChkZWZhdWx0Vmlldykge1xuICAgIGlmIChkZWZhdWx0Vmlldy5zb3J0KSB7XG4gICAgICByZXR1cm4gZGVmYXVsdFZpZXcuc29ydDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtbXCJjcmVhdGVkXCIsIFwiZGVzY1wiXV07XG4gICAgfVxuICB9XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzQWxsVmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcImFsbFwiO1xufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6VGFidWxhcuaOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IGZ1bmN0aW9uKHNvcnQsIHRhYnVsYXJDb2x1bW5zKSB7XG4gIHZhciB0YWJ1bGFyX3NvcnQ7XG4gIHRhYnVsYXJfc29ydCA9IFtdO1xuICBfLmVhY2goc29ydCwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBjb2x1bW5faW5kZXgsIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGlmIChpdGVtLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgXCJhc2NcIl0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0ubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBpdGVtWzFdXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgb3JkZXJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YWJ1bGFyX3NvcnQ7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gZnVuY3Rpb24oc29ydCkge1xuICB2YXIgZHhfc29ydDtcbiAgZHhfc29ydCA9IFtdO1xuICBfLmVhY2goc29ydCwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZHhfc29ydC5wdXNoKGl0ZW0pO1xuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goW2ZpZWxkX25hbWUsIG9yZGVyXSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGR4X3NvcnQ7XG59O1xuIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJ9XG5cdFx0U2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFx0X3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIn1cblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuXHRcdFx0cmVnRXg6IF9yZWdFeE1lc3NhZ2VzLFxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIi8vIOWboOS4um1ldGVvcue8luivkWNvZmZlZXNjcmlwdOS8muWvvOiHtGV2YWzlh73mlbDmiqXplJnvvIzmiYDku6XljZXni6zlhpnlnKjkuIDkuKpqc+aWh+S7tuS4reOAglxuQ3JlYXRvci5ldmFsSW5Db250ZXh0ID0gZnVuY3Rpb24oanMsIGNvbnRleHQpIHtcbiAgICAvLyMgUmV0dXJuIHRoZSByZXN1bHRzIG9mIHRoZSBpbi1saW5lIGFub255bW91cyBmdW5jdGlvbiB3ZSAuY2FsbCB3aXRoIHRoZSBwYXNzZWQgY29udGV4dFxuICAgIHJldHVybiBmdW5jdGlvbigpIHsgXG4gICAgXHRyZXR1cm4gZXZhbChqcyk7IFxuXHR9LmNhbGwoY29udGV4dCk7XG59XG5cblxuQ3JlYXRvci5ldmFsID0gZnVuY3Rpb24oanMpe1xuXHR0cnl7XG5cdFx0cmV0dXJuIGV2YWwoanMpXG5cdH1jYXRjaCAoZSl7XG5cdFx0Y29uc29sZS5lcnJvcihlLCBqcyk7XG5cdH1cbn07IiwiXHRnZXRPcHRpb24gPSAob3B0aW9uKS0+XG5cdFx0Zm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKVxuXHRcdGlmIGZvby5sZW5ndGggPiAyXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV0sIGNvbG9yOiBmb29bMl19XG5cdFx0ZWxzZSBpZiBmb28ubGVuZ3RoID4gMVxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1swXX1cblxuXHRjb252ZXJ0RmllbGQgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkLCBzcGFjZUlkKS0+XG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xuXHRcdFx0Y29kZSA9IGZpZWxkLnBpY2tsaXN0IHx8IFwiI3tvYmplY3RfbmFtZX0uI3tmaWVsZF9uYW1lfVwiO1xuXHRcdFx0aWYgY29kZVxuXHRcdFx0XHRwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XG5cdFx0XHRcdGlmIHBpY2tsaXN0XG5cdFx0XHRcdFx0b3B0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdGFsbE9wdGlvbnMgPSBbXTtcblx0XHRcdFx0XHRwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdClcblx0XHRcdFx0XHRwaWNrbGlzdE9wdGlvbnMgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJyk/LnJldmVyc2UoKTtcblx0XHRcdFx0XHRfLmVhY2ggcGlja2xpc3RPcHRpb25zLCAoaXRlbSktPlxuXHRcdFx0XHRcdFx0bGFiZWwgPSBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdHZhbHVlID0gaXRlbS52YWx1ZSB8fCBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdGFsbE9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGVuYWJsZTogaXRlbS5lbmFibGUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW5hYmxlXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZGVmYXVsdFxuXHRcdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZVxuXHRcdFx0XHRcdGlmIG9wdGlvbnMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IG9wdGlvbnNcblx0XHRcdFx0XHRpZiBhbGxPcHRpb25zLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGZpZWxkLmFsbE9wdGlvbnMgPSBhbGxPcHRpb25zXG5cdFx0cmV0dXJuIGZpZWxkO1xuXG5cdENyZWF0b3IuY29udmVydE9iamVjdCA9IChvYmplY3QsIHNwYWNlSWQpLT5cblx0XHRpZiAhb2JqZWN0XG5cdFx0XHRyZXR1cm5cblx0XHRfLmZvckVhY2ggb2JqZWN0LnRyaWdnZXJzLCAodHJpZ2dlciwga2V5KS0+XG5cblx0XHRcdGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIilcblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gdHJpZ2dlcj8uX3RvZG9cblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kb1xuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXG5cdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcblxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYilcblx0XHRcdFx0XHQj5Y+q5pyJdXBkYXRl5pe277yMIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zIOaJjeacieWAvFxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj++8jOWwpOWFtuaYr0NvbGxlY3Rpb25cblx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyl7I3tfdG9kb19mcm9tX2RifX0pXCIpXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCJcblx0XHRcdFx0X3RvZG8gPSB0cmlnZ2VyLnRvZG9cblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxuXHRcdFx0XHRcdHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpXG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbj8uX3RvZG9cblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IGFjdGlvbj8udG9kb1xuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGVcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKVxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYlxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24oKXsje190b2RvX2Zyb21fZGJ9fSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvclxuXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy5fdmlzaWJsZVxuXHRcdFx0XHRpZiBfdmlzaWJsZVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0YWN0aW9uLnZpc2libGUgPSBDcmVhdG9yLmV2YWwoXCIoI3tfdmlzaWJsZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZVxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XG5cdFx0XHRcdF90b2RvID0gYWN0aW9uPy50b2RvXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHRhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpXG5cblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/LnZpc2libGVcblxuXHRcdFx0XHRpZiBfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpXG5cdFx0XHRcdFx0YWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKVxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cblx0XHRcdGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcblxuXHRcdFx0aWYgZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0XHQj5pSv5oyBXFxu5oiW6ICF6Iux5paH6YCX5Y+35YiG5YmyLFxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBvcHRpb24uaW5kZXhPZihcIixcIilcblx0XHRcdFx0XHRcdFx0b3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIilcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdFx0I+aUr+aMgeaVsOe7hOS4reebtOaOpeWumuS5ieavj+S4qumAiemhueeahOeugOeJiOagvOW8j+Wtl+espuS4slxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKG9wdGlvbilcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChvcHRpb24pXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0Xy5lYWNoIGZpZWxkLm9wdGlvbnMsICh2LCBrKS0+XG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IHYsIHZhbHVlOiBrfVxuXHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLl9vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnN9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLnJlZ0V4XG5cdFx0XHRcdGlmIHJlZ0V4XG5cdFx0XHRcdFx0ZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLl9yZWdFeFxuXHRcdFx0XHRpZiByZWdFeFxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQucmVnRXggPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWdFeH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG1pbiA9IGZpZWxkLm1pblxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWluKVxuXHRcdFx0XHRcdGZpZWxkLl9taW4gPSBtaW4udG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtaW4gPSBmaWVsZC5fbWluXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWluKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQubWluID0gQ3JlYXRvci5ldmFsKFwiKCN7bWlufSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0bWF4ID0gZmllbGQubWF4XG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtYXgpXG5cdFx0XHRcdFx0ZmllbGQuX21heCA9IG1heC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG1heCA9IGZpZWxkLl9tYXhcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtYXgpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5tYXggPSBDcmVhdG9yLmV2YWwoXCIoI3ttYXh9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxuXHRcdFx0XHRcdF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT0gT2JqZWN0ICYmIF90eXBlICE9IFN0cmluZyAmJiBfdHlwZSAhPSBOdW1iZXIgJiYgX3R5cGUgIT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKVxuXHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNTdHJpbmcoX3R5cGUpXG5cdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3IuZXZhbChcIigje190eXBlfSlcIilcblx0XHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0ZmllbGQuX3JlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90by50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKClcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQuX3JlZmVyZW5jZV90b1xuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gfHwgZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnNGdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3IuZXZhbChcIigje3JlZmVyZW5jZV90b30pXCIpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2NyZWF0ZUZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7YmVmb3JlT3BlbkZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyc0Z1bmN0aW9ufSlcIilcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHRmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZVxuXG5cdFx0XHRcdGlmICFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tkZWZhdWx0VmFsdWV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cdFx0XHRcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNGdW5jdGlvbihpc19jb21wYW55X2xpbWl0ZWQpXG5cdFx0XHRcdFx0ZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvci5ldmFsKFwiKCN7aXNfY29tcGFueV9saW1pdGVkfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpIC0+XG5cdFx0XHQjIyNcblx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcblx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcblx0XHRcdOWmgu+8mlxuXHRcdFx0ZmlsdGVyczogKCktPlxuXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG5cdFx0XHTlpoLvvJpcblx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHRdXVxuXHRcdFx05oiWXG5cdFx0XHRmaWx0ZXJzOiBbe1xuXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxuXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cblx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHR9XVxuXHRcdFx0IyMjXG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKClcblx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvci5ldmFsKFwiKCN7bGlzdF92aWV3Ll9maWx0ZXJzfSlcIilcblx0XHRcdGVsc2Vcblx0XHRcdFx0Xy5mb3JFYWNoIGxpc3Rfdmlldy5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cblx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoZmlsdGVyKVxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0RhdGUoZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5pivRGF0Zeexu+Wei++8jOWImWZpbHRlclsyXeWAvOWIsOWJjeerr+S8muiHquWKqOi9rOaIkOWtl+espuS4su+8jOagvOW8j++8mlwiMjAxOC0wMy0yOVQwMzo0MzoyMS43ODdaXCJcblx0XHRcdFx0XHRcdFx0XHQjIOWMheaLrGdyaWTliJfooajor7fmsYLnmoTmjqXlj6PlnKjlhoXnmoTmiYDmnIlPRGF0YeaOpeWPo++8jERhdGXnsbvlnovlrZfmrrXpg73kvJrku6XkuIrov7DmoLzlvI/ov5Tlm55cblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkRBVEVcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlclsyXX0pXCIpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJEQVRFXCJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGZpbHRlcilcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRGF0ZShmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5faXNfZGF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIuX2lzX2RhdGUgPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSlcblxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0aWYgb2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkgb2JqZWN0LmZvcm0sIChrZXksIHZhbCktPlxuXHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbih2YWwpXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsICsgJyc7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRlbHNlIGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgb2JqZWN0LmZvcm1cblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlIG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cblx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJylcblx0XHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZF9saXN0cywgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkX2xpc3RzLCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKVxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKClcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXG5cblx0XHRyZXR1cm4gb2JqZWN0XG5cblxuIiwidmFyIGNvbnZlcnRGaWVsZCwgZ2V0T3B0aW9uO1xuXG5nZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdmFyIGZvbztcbiAgZm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKTtcbiAgaWYgKGZvby5sZW5ndGggPiAyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdLFxuICAgICAgY29sb3I6IGZvb1syXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZm9vLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1swXVxuICAgIH07XG4gIH1cbn07XG5cbmNvbnZlcnRGaWVsZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCkge1xuICB2YXIgYWxsT3B0aW9ucywgY29kZSwgb3B0aW9ucywgcGlja2xpc3QsIHBpY2tsaXN0T3B0aW9ucywgcmVmO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICBjb2RlID0gZmllbGQucGlja2xpc3QgfHwgKG9iamVjdF9uYW1lICsgXCIuXCIgKyBmaWVsZF9uYW1lKTtcbiAgICBpZiAoY29kZSkge1xuICAgICAgcGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuICAgICAgaWYgKHBpY2tsaXN0KSB7XG4gICAgICAgIG9wdGlvbnMgPSBbXTtcbiAgICAgICAgYWxsT3B0aW9ucyA9IFtdO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdCk7XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IChyZWYgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJykpICE9IG51bGwgPyByZWYucmV2ZXJzZSgpIDogdm9pZCAwO1xuICAgICAgICBfLmVhY2gocGlja2xpc3RPcHRpb25zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIGxhYmVsLCB2YWx1ZTtcbiAgICAgICAgICBsYWJlbCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lO1xuICAgICAgICAgIGFsbE9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbmFibGU6IGl0ZW0uZW5hYmxlLFxuICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXRlbS5lbmFibGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtW1wiZGVmYXVsdFwiXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0LCBzcGFjZUlkKSB7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIGtleSkge1xuICAgIHZhciBfdG9kbywgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiO1xuICAgIGlmICgoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikpIHtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXIgIT0gbnVsbCA/IHRyaWdnZXIuX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSB7XG4gICAgICBfdG9kbyA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYiwgX3Zpc2libGUsIGVycm9yO1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSkpIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbigpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3Zpc2libGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvLCBfdmlzaWJsZTtcbiAgICAgIF90b2RvID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnZpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKSkge1xuICAgICAgICByZXR1cm4gYWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGtleSkge1xuICAgIHZhciBfb3B0aW9ucywgX3R5cGUsIGJlZm9yZU9wZW5GdW5jdGlvbiwgY3JlYXRlRnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSwgZXJyb3IsIGZpbHRlcnNGdW5jdGlvbiwgaXNfY29tcGFueV9saW1pdGVkLCBtYXgsIG1pbiwgb3B0aW9ucywgb3B0aW9uc0Z1bmN0aW9uLCByZWZlcmVuY2VfdG8sIHJlZ0V4O1xuICAgIGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcbiAgICBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgaWYgKG9wdGlvbi5pbmRleE9mKFwiLFwiKSkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKF9vcHRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIGlmIChfLmlzU3RyaW5nKG9wdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1pbiA9IGZpZWxkLm1pbjtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWluKSkge1xuICAgICAgICBmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pbiA9IGZpZWxkLl9taW47XG4gICAgICBpZiAoXy5pc1N0cmluZyhtaW4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWluID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtaW4gKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtYXggPSBmaWVsZC5tYXg7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1heCkpIHtcbiAgICAgICAgZmllbGQuX21heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXggPSBmaWVsZC5fbWF4O1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWF4KSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1heCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWF4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT09IE9iamVjdCAmJiBfdHlwZSAhPT0gU3RyaW5nICYmIF90eXBlICE9PSBOdW1iZXIgJiYgX3R5cGUgIT09IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSkpIHtcbiAgICAgICAgICBmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdHlwZSArIFwiKVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9uc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWZlcmVuY2VfdG8gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGNyZWF0ZUZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBiZWZvcmVPcGVuRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlcnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZGVmYXVsdFZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICByZXR1cm4gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBpc19jb21wYW55X2xpbWl0ZWQgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBfLmZvckVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG5cbiAgICAvKlxuICAgIFx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuICAgIFx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG4gICAgXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6ICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG4gICAgXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0XV1cbiAgICBcdFx0XHTmiJZcbiAgICBcdFx0XHRmaWx0ZXJzOiBbe1xuICAgIFx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcbiAgICBcdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG4gICAgXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cbiAgICBcdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdH1dXG4gICAgICovXG4gICAgaWYgKF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBsaXN0X3ZpZXcuX2ZpbHRlcnMgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfLmZvckVhY2gobGlzdF92aWV3LmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNEYXRlKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiREFURVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkZVTkNUSU9OXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJbMl0gKyBcIilcIik7XG4gICAgICAgICAgICAgIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiREFURVwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNEYXRlKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl9pc19kYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuX2lzX2RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKG9iamVjdC5mb3JtICYmICFfLmlzU3RyaW5nKG9iamVjdC5mb3JtKSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbCArICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0pIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZF9saXN0cywgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImZpbHRlcnNfY29kZVwiLCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkX2xpc3RzLCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJmaWx0ZXJzX2NvZGVcIiwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fVxuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiXG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gKHByZWZpeCxmaWVsZFZhcmlhYmxlKS0+XG5cdHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuXG5cdHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZSByZWcsIChtLCAkMSktPlxuXHRcdHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLyxcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZyxcIlxcXCJdW1xcXCJcIik7XG5cblx0cmV0dXJuIHJldlxuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IChmb3JtdWxhX3N0ciktPlxuXHRpZiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTFcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSAoZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKS0+XG5cdGlmIGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpXG5cblx0XHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucz8uZXh0ZW5kKVxuXHRcdFx0ZXh0ZW5kID0gdHJ1ZVxuXG5cdFx0X1ZBTFVFUyA9IHt9XG5cdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKVxuXHRcdGlmIGV4dGVuZFxuXHRcdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucz8udXNlcklkLCBvcHRpb25zPy5zcGFjZUlkKSlcblx0XHRmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cilcblxuXHRcdHRyeVxuXHRcdFx0ZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUykgICAjIOatpOWkhOS4jeiDveeUqHdpbmRvdy5ldmFsIO+8jOS8muWvvOiHtOWPmOmHj+S9nOeUqOWfn+W8guW4uFxuXHRcdFx0cmV0dXJuIGRhdGFcblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9XCIsIGUpXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dG9hc3RyPy5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9I3tlfVwiXG5cblx0cmV0dXJuIGZvcm11bGFfc3RyXG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge307XG5cbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCI7XG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gZnVuY3Rpb24ocHJlZml4LCBmaWVsZFZhcmlhYmxlKSB7XG4gIHZhciByZWcsIHJldjtcbiAgcmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XG4gIHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG0sICQxKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLCBcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLCBcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csIFwiXFxcIl1bXFxcIlwiKTtcbiAgfSk7XG4gIHJldHVybiByZXY7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyKSB7XG4gIGlmIChfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucykge1xuICB2YXIgX1ZBTFVFUywgZGF0YSwgZSwgZXh0ZW5kO1xuICBpZiAoZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuZXh0ZW5kIDogdm9pZCAwKSkge1xuICAgICAgZXh0ZW5kID0gdHJ1ZTtcbiAgICB9XG4gICAgX1ZBTFVFUyA9IHt9O1xuICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVCk7XG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy51c2VySWQgOiB2b2lkIDAsIG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgIH1cbiAgICBmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cik7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciwgZSk7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG9hc3RyICE9PSBcInVuZGVmaW5lZFwiICYmIHRvYXN0ciAhPT0gbnVsbCkge1xuICAgICAgICAgIHRvYXN0ci5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIgKyBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFfc3RyO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9ICAgIyDmraTlr7nosaHlj6rog73lnKjnoa7kv53miYDmnIlPYmplY3TliJ3lp4vljJblrozmiJDlkI7osIPnlKjvvIwg5ZCm5YiZ6I635Y+W5Yiw55qEb2JqZWN05LiN5YWoXG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IChvYmplY3RfbmFtZSktPlxuXHRpZiBvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJylcblx0XHRvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpXG5cdHJldHVybiBvYmplY3RfbmFtZVxuXG5DcmVhdG9yLk9iamVjdCA9IChvcHRpb25zKS0+XG5cdF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdF9iYXNlT2JqZWN0ID0ge2FjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zICwgZmllbGRzOiB7fSwgdHJpZ2dlcnM6IHt9LCBwZXJtaXNzaW9uX3NldDoge319XG5cdHNlbGYgPSB0aGlzXG5cdGlmICghb3B0aW9ucy5uYW1lKVxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcblxuXHRzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZVxuXHRzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXHRzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWVcblx0c2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWxcblx0c2VsZi5pY29uID0gb3B0aW9ucy5pY29uXG5cdHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uXG5cdHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlld1xuXHRzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm1cblx0c2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Rcblx0c2VsZi5yZWxhdGVkX2xpc3RzID0gb3B0aW9ucy5yZWxhdGVkX2xpc3RzXG5cdHNlbGYudmVyc2lvbiA9IG9wdGlvbnMudmVyc2lvbiB8fCAxLjBcblx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSAgfHwgb3B0aW9ucy5pc19lbmFibGUgPT0gdHJ1ZVxuXHRcdHNlbGYuaXNfZW5hYmxlID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5pc19lbmFibGUgPSBmYWxzZVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpXG5cdFx0XHRzZWxmLmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvcHRpb25zLmFsbG93X2N1c3RvbUFjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnZXhjbHVkZV9hY3Rpb25zJylcblx0XHRcdHNlbGYuZXhjbHVkZV9hY3Rpb25zID0gb3B0aW9ucy5leGNsdWRlX2FjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKVxuXHRcdFx0c2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3Rcblx0c2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoXG5cdHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXNcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xuXHRzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzXG5cdHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXRcblx0c2VsZi5lbmFibGVfZXZlbnRzID0gb3B0aW9ucy5lbmFibGVfZXZlbnRzXG5cdGlmIG9wdGlvbnMucGFnaW5nXG5cdFx0c2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZ1xuXHRzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuXG5cdHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT0gdW5kZWZpbmVkKSBvciBvcHRpb25zLmVuYWJsZV9hcGlcblx0c2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbVxuXHRzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlXG5cdHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlc1xuXHRzZWxmLmVuYWJsZV9wcm9jZXNzID0gb3B0aW9ucy5lbmFibGVfcHJvY2Vzc1xuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXG5cdFx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcblx0ZWxzZVxuXHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxuXHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXG5cdHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93XG5cdHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55XG5cdHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpXG5cdHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyXG5cdHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2hcblx0c2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsXG5cdHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFsc1xuXHRzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3dcblx0c2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvd1xuXHRzZWxmLmVuYWJsZV9pbmxpbmVfZWRpdCA9IG9wdGlvbnMuZW5hYmxlX2lubGluZV9lZGl0XG5cdHNlbGYuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlsc1xuXHRzZWxmLm1hc3RlcnMgPSBvcHRpb25zLm1hc3RlcnNcblx0c2VsZi5sb29rdXBfZGV0YWlscyA9IG9wdGlvbnMubG9va3VwX2RldGFpbHNcblx0aWYgXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50Jylcblx0XHRzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudFxuXHRzZWxmLmlkRmllbGROYW1lID0gJ19pZCdcblx0aWYgb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdFx0c2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdGlmICghb3B0aW9ucy5maWVsZHMpXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XG5cblx0c2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcylcblxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmIGZpZWxkLmlzX25hbWVcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXG5cdFx0ZWxzZSBpZiBmaWVsZF9uYW1lID09ICduYW1lJyAmJiAhc2VsZi5OQU1FX0ZJRUxEX0tFWVxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcblx0XHRpZiBmaWVsZC5wcmltYXJ5XG5cdFx0XHRzZWxmLmlkRmllbGROYW1lID0gZmllbGRfbmFtZVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXG5cdFx0XHRcdGlmIGZpZWxkX25hbWUgPT0gJ3NwYWNlJ1xuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gZmFsc2VcblxuXHRpZiAhb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xuXHRcdF8uZWFjaCBfYmFzZU9iamVjdC5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgIXNlbGYuZmllbGRzW2ZpZWxkX25hbWVdXG5cdFx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge31cblx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKVxuXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc3VtbWFyeSdcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdHNlbGYubGlzdF92aWV3cyA9IHt9XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpXG5cdF8uZWFjaCBvcHRpb25zLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRWaWV3LCBpdGVtLCBpdGVtX25hbWUpXG5cdFx0c2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbVxuXG5cdHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKVxuXHRfLmVhY2ggb3B0aW9ucy50cmlnZ2VycywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWVcblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pXG5cblx0c2VsZi5hY3Rpb25zID0gXy5jbG9uZShfYmFzZU9iamVjdC5hY3Rpb25zKVxuXHRfLmVhY2ggb3B0aW9ucy5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdXG5cdFx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0Y29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKVxuXHRcdGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSAj5YWI5Yig6Zmk55u45YWz5bGe5oCn5YaN6YeN5bu65omN6IO95L+d6K+B5ZCO57ut6YeN5aSN5a6a5LmJ55qE5bGe5oCn6aG65bqP55Sf5pWIXG5cdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSlcblxuXHRfLmVhY2ggc2VsZi5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aXRlbS5uYW1lID0gaXRlbV9uYW1lXG5cblx0c2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSlcblxuXHQjIOiuqeaJgOaciW9iamVjdOm7mOiupOacieaJgOaciWxpc3Rfdmlld3MvYWN0aW9ucy9yZWxhdGVkX29iamVjdHMvcmVhZGFibGVfZmllbGRzL2VkaXRhYmxlX2ZpZWxkc+WujOaVtOadg+mZkO+8jOivpeadg+mZkOWPr+iDveiiq+aVsOaNruW6k+S4reiuvue9rueahGFkbWluL3VzZXLmnYPpmZDopobnm5Zcblx0c2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoX2Jhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpXG5cdCMgZGVmYXVsdExpc3RWaWV3cyA9IF8ua2V5cyhzZWxmLmxpc3Rfdmlld3MpXG5cdCMgZGVmYXVsdEFjdGlvbnMgPSBfLmtleXMoc2VsZi5hY3Rpb25zKVxuXHQjIGRlZmF1bHRSZWxhdGVkT2JqZWN0cyA9IF8ucGx1Y2soc2VsZi5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXHQjIGRlZmF1bHRSZWFkYWJsZUZpZWxkcyA9IFtdXG5cdCMgZGVmYXVsdEVkaXRhYmxlRmllbGRzID0gW11cblx0IyBfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHQjIFx0aWYgIShmaWVsZC5oaWRkZW4pICAgICMyMzEgb21pdOWtl+auteaUr+aMgeWcqOmdnue8lui+kemhtemdouafpeeciywg5Zug5q2k5Yig6Zmk5LqG5q2k5aSE5a+5b21pdOeahOWIpOaWrVxuXHQjIFx0XHRkZWZhdWx0UmVhZGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXG5cdCMgXHRcdGlmICFmaWVsZC5yZWFkb25seVxuXHQjIFx0XHRcdGRlZmF1bHRFZGl0YWJsZUZpZWxkcy5wdXNoIGZpZWxkX25hbWVcblxuXHQjIF8uZWFjaCBzZWxmLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdCMgXHRpZiBpdGVtX25hbWUgPT0gXCJub25lXCJcblx0IyBcdFx0cmV0dXJuXG5cdCMgXHRpZiBzZWxmLmxpc3Rfdmlld3Ncblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmxpc3Rfdmlld3MgPSBkZWZhdWx0TGlzdFZpZXdzXG5cdCMgXHRpZiBzZWxmLmFjdGlvbnNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmFjdGlvbnMgPSBkZWZhdWx0QWN0aW9uc1xuXHQjIFx0aWYgc2VsZi5yZWxhdGVkX29iamVjdHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLnJlbGF0ZWRfb2JqZWN0cyA9IGRlZmF1bHRSZWxhdGVkT2JqZWN0c1xuXHQjIFx0aWYgc2VsZi5maWVsZHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLnJlYWRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRSZWFkYWJsZUZpZWxkc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uZWRpdGFibGVfZmllbGRzID0gZGVmYXVsdEVkaXRhYmxlRmllbGRzXG5cdHVubGVzcyBvcHRpb25zLnBlcm1pc3Npb25fc2V0XG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldCA9IHt9XG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8uYWRtaW4pXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKVxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LnVzZXIpXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC51c2VyID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1widXNlclwiXSlcblx0Xy5lYWNoIG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiAhc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdXG5cdFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSB7fVxuXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSlcblxuXHQjIOWJjeerr+agueaNrnBlcm1pc3Npb25z5pS55YaZZmllbGTnm7jlhbPlsZ7mgKfvvIzlkI7nq6/lj6ropoHotbDpu5jorqTlsZ7mgKflsLHooYzvvIzkuI3pnIDopoHmlLnlhplcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cGVybWlzc2lvbnMgPSBvcHRpb25zLnBlcm1pc3Npb25zXG5cdFx0ZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zPy5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0aWYgZGlzYWJsZWRfbGlzdF92aWV3cz8ubGVuZ3RoXG5cdFx0XHRkZWZhdWx0TGlzdFZpZXdJZCA9IG9wdGlvbnMubGlzdF92aWV3cz8uYWxsPy5faWRcblx0XHRcdGlmIGRlZmF1bHRMaXN0Vmlld0lkXG5cdFx0XHRcdCMg5oqK6KeG5Zu+5p2D6ZmQ6YWN572u5Lit6buY6K6k55qEYWxs6KeG5Zu+aWTovazmjaLmiJBhbGzlhbPplK7lrZdcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IF8ubWFwIGRpc2FibGVkX2xpc3Rfdmlld3MsIChsaXN0X3ZpZXdfaXRlbSkgLT5cblx0XHRcdFx0XHRyZXR1cm4gaWYgZGVmYXVsdExpc3RWaWV3SWQgPT0gbGlzdF92aWV3X2l0ZW0gdGhlbiBcImFsbFwiIGVsc2UgbGlzdF92aWV3X2l0ZW1cblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKVxuI1x0XHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuI1x0XHRcdGlmIGZpZWxkXG4jXHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVucmVhZGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA8IDBcbiNcdFx0XHRcdFx0aWYgZmllbGQuaGlkZGVuXG4jXHRcdFx0XHRcdFx0cmV0dXJuXG4jXHRcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5lZGl0YWJsZV9maWVsZHMsIGZpZWxkX25hbWUpID4gLTFcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcbiNcdFx0XHRcdFx0XHRmaWVsZC5kaXNhYmxlZCA9IHRydWVcbiNcdFx0XHRcdFx0XHQjIOW9k+WPquivu+aXtu+8jOWmguaenOS4jeWOu+aOieW/heWhq+Wtl+aute+8jGF1dG9mb3Jt5piv5Lya5oql6ZSZ55qEXG4jXHRcdFx0XHRcdFx0ZmllbGQucmVxdWlyZWQgPSBmYWxzZVxuI1x0XHRcdFx0ZWxzZVxuI1x0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSB0cnVlXG5cdGVsc2Vcblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbnVsbFxuXG5cdF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKVxuXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYlxuXG5cdHNlbGYuZGIgPSBfZGJcblxuXHRzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWVcblxuXHRzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKVxuXHRzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKVxuXHRpZiBzZWxmLm5hbWUgIT0gXCJ1c2Vyc1wiIGFuZCBzZWxmLm5hbWUgIT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIiwgXCJhY3Rpb25fZmllbGRfdXBkYXRlc1wiLCBcIm9iamVjdF9saXN0dmlld3NcIl0sIHNlbGYubmFtZSlcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblx0XHRlbHNlXG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdGlmIHNlbGYubmFtZSA9PSBcInVzZXJzXCJcblx0XHRfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hXG5cblx0aWYgXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXG5cdENyZWF0b3Iub2JqZWN0c0J5TmFtZVtzZWxmLl9jb2xsZWN0aW9uX25hbWVdID0gc2VsZlxuXG5cdHJldHVybiBzZWxmXG5cbiMgQ3JlYXRvci5PYmplY3QucHJvdG90eXBlLmkxOG4gPSAoKS0+XG4jIFx0IyBzZXQgb2JqZWN0IGxhYmVsXG4jIFx0c2VsZiA9IHRoaXNcblxuIyBcdGtleSA9IHNlbGYubmFtZVxuIyBcdGlmIHQoa2V5KSA9PSBrZXlcbiMgXHRcdGlmICFzZWxmLmxhYmVsXG4jIFx0XHRcdHNlbGYubGFiZWwgPSBzZWxmLm5hbWVcbiMgXHRlbHNlXG4jIFx0XHRzZWxmLmxhYmVsID0gdChrZXkpXG5cbiMgXHQjIHNldCBmaWVsZCBsYWJlbHNcbiMgXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuIyBcdFx0ZmtleSA9IHNlbGYubmFtZSArIFwiX1wiICsgZmllbGRfbmFtZVxuIyBcdFx0aWYgdChma2V5KSA9PSBma2V5XG4jIFx0XHRcdGlmICFmaWVsZC5sYWJlbFxuIyBcdFx0XHRcdGZpZWxkLmxhYmVsID0gZmllbGRfbmFtZVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHRmaWVsZC5sYWJlbCA9IHQoZmtleSlcbiMgXHRcdHNlbGYuc2NoZW1hPy5fc2NoZW1hP1tmaWVsZF9uYW1lXT8ubGFiZWwgPSBmaWVsZC5sYWJlbFxuXG5cbiMgXHQjIHNldCBsaXN0dmlldyBsYWJlbHNcbiMgXHRfLmVhY2ggc2VsZi5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG4jIFx0XHRpMThuX2tleSA9IHNlbGYubmFtZSArIFwiX2xpc3R2aWV3X1wiICsgaXRlbV9uYW1lXG4jIFx0XHRpZiB0KGkxOG5fa2V5KSA9PSBpMThuX2tleVxuIyBcdFx0XHRpZiAhaXRlbS5sYWJlbFxuIyBcdFx0XHRcdGl0ZW0ubGFiZWwgPSBpdGVtX25hbWVcbiMgXHRcdGVsc2VcbiMgXHRcdFx0aXRlbS5sYWJlbCA9IHQoaTE4bl9rZXkpXG5cblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IChvYmplY3QpLT5cblx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXG5cdCMgaWYgb2JqZWN0XG5cdCMgXHRpZiAhb2JqZWN0LmRhdGFiYXNlX25hbWUgfHwgb2JqZWN0LmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcblx0IyBcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXG5cdCMgXHRlbHNlXG5cdCMgXHRcdHJldHVybiBcIi9hcGkvb2RhdGEvI3tvYmplY3QuZGF0YWJhc2VfbmFtZX1cIlxuXG4jIGlmIE1ldGVvci5pc0NsaWVudFxuXG4jIFx0TWV0ZW9yLnN0YXJ0dXAgLT5cbiMgXHRcdFRyYWNrZXIuYXV0b3J1biAtPlxuIyBcdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICYmIENyZWF0b3IuYm9vdHN0cmFwTG9hZGVkPy5nZXQoKVxuIyBcdFx0XHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG4jIFx0XHRcdFx0XHRvYmplY3QuaTE4bigpXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdGlmICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHNcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAob2JqZWN0KS0+XG5cdFx0XHRuZXcgQ3JlYXRvci5PYmplY3Qob2JqZWN0KVxuXG4iLCJ2YXIgY2xvbmU7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge307XG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJykpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpO1xuICB9XG4gIHJldHVybiBvYmplY3RfbmFtZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX2Jhc2VPYmplY3QsIF9kYiwgZGVmYXVsdExpc3RWaWV3SWQsIGRlZmF1bHRWaWV3LCBkaXNhYmxlZF9saXN0X3ZpZXdzLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzY2hlbWEsIHNlbGY7XG4gIF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgX2Jhc2VPYmplY3QgPSB7XG4gICAgICBhY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyxcbiAgICAgIGZpZWxkczoge30sXG4gICAgICB0cmlnZ2Vyczoge30sXG4gICAgICBwZXJtaXNzaW9uX3NldDoge31cbiAgICB9O1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICBpZiAoIW9wdGlvbnMubmFtZSkge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gIH1cbiAgc2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWU7XG4gIHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICBzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gIHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsO1xuICBzZWxmLmljb24gPSBvcHRpb25zLmljb247XG4gIHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uO1xuICBzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXc7XG4gIHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybTtcbiAgc2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Q7XG4gIHNlbGYucmVsYXRlZF9saXN0cyA9IG9wdGlvbnMucmVsYXRlZF9saXN0cztcbiAgc2VsZi52ZXJzaW9uID0gb3B0aW9ucy52ZXJzaW9uIHx8IDEuMDtcbiAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgfHwgb3B0aW9ucy5pc19lbmFibGUgPT09IHRydWUpIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSBmYWxzZTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhbGxvd19jdXN0b21BY3Rpb25zJykpIHtcbiAgICAgIHNlbGYuYWxsb3dfY3VzdG9tQWN0aW9ucyA9IG9wdGlvbnMuYWxsb3dfY3VzdG9tQWN0aW9ucztcbiAgICB9XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdleGNsdWRlX2FjdGlvbnMnKSkge1xuICAgICAgc2VsZi5leGNsdWRlX2FjdGlvbnMgPSBvcHRpb25zLmV4Y2x1ZGVfYWN0aW9ucztcbiAgICB9XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhbGxvd19yZWxhdGVkTGlzdCcpKSB7XG4gICAgICBzZWxmLmFsbG93X3JlbGF0ZWRMaXN0ID0gb3B0aW9ucy5hbGxvd19yZWxhdGVkTGlzdDtcbiAgICB9XG4gIH1cbiAgc2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoO1xuICBzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzO1xuICBzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzO1xuICBzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzO1xuICBzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0O1xuICBzZWxmLmVuYWJsZV9ldmVudHMgPSBvcHRpb25zLmVuYWJsZV9ldmVudHM7XG4gIGlmIChvcHRpb25zLnBhZ2luZykge1xuICAgIHNlbGYucGFnaW5nID0gb3B0aW9ucy5wYWdpbmc7XG4gIH1cbiAgc2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlbjtcbiAgc2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PT0gdm9pZCAwKSB8fCBvcHRpb25zLmVuYWJsZV9hcGk7XG4gIHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b207XG4gIHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmU7XG4gIHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlcztcbiAgc2VsZi5lbmFibGVfcHJvY2VzcyA9IG9wdGlvbnMuZW5hYmxlX3Byb2Nlc3M7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpKSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICAgICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gIH1cbiAgc2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3c7XG4gIHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55O1xuICBzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKTtcbiAgc2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXI7XG4gIHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2g7XG4gIHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbDtcbiAgc2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzO1xuICBzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3c7XG4gIHNlbGYuZW5hYmxlX3dvcmtmbG93ID0gb3B0aW9ucy5lbmFibGVfd29ya2Zsb3c7XG4gIHNlbGYuZW5hYmxlX2lubGluZV9lZGl0ID0gb3B0aW9ucy5lbmFibGVfaW5saW5lX2VkaXQ7XG4gIHNlbGYuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlscztcbiAgc2VsZi5tYXN0ZXJzID0gb3B0aW9ucy5tYXN0ZXJzO1xuICBzZWxmLmxvb2t1cF9kZXRhaWxzID0gb3B0aW9ucy5sb29rdXBfZGV0YWlscztcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpKSB7XG4gICAgc2VsZi5pbl9kZXZlbG9wbWVudCA9IG9wdGlvbnMuaW5fZGV2ZWxvcG1lbnQ7XG4gIH1cbiAgc2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnO1xuICBpZiAob3B0aW9ucy5kYXRhYmFzZV9uYW1lKSB7XG4gICAgc2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lO1xuICB9XG4gIGlmICghb3B0aW9ucy5maWVsZHMpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XG4gIH1cbiAgc2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcyk7XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQuaXNfbmFtZSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZF9uYW1lID09PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVkpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoZmllbGQucHJpbWFyeSkge1xuICAgICAgc2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT09ICdtZXRlb3ItbW9uZ28nKSB7XG4gICAgXy5lYWNoKF9iYXNlT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmICghc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pIHtcbiAgICAgICAgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnc3VtbWFyeScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgc2VsZi5saXN0X3ZpZXdzID0ge307XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpO1xuICBfLmVhY2gob3B0aW9ucy5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgb2l0ZW07XG4gICAgb2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKTtcbiAgICByZXR1cm4gc2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbTtcbiAgfSk7XG4gIHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKTtcbiAgXy5lYWNoKG9wdGlvbnMudHJpZ2dlcnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWU7XG4gICAgcmV0dXJuIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpO1xuICBfLmVhY2gob3B0aW9ucy5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgY29weUl0ZW07XG4gICAgaWYgKCFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgY29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKTtcbiAgICBkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV07XG4gICAgcmV0dXJuIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pO1xuICB9KTtcbiAgXy5lYWNoKHNlbGYuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgfSk7XG4gIHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpO1xuICBzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldCk7XG4gIGlmICghb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fTtcbiAgfVxuICBpZiAoISgocmVmID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZi5hZG1pbiA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pO1xuICB9XG4gIGlmICghKChyZWYxID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZjEudXNlciA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKTtcbiAgfVxuICBfLmVhY2gob3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnM7XG4gICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwO1xuICAgIGlmIChkaXNhYmxlZF9saXN0X3ZpZXdzICE9IG51bGwgPyBkaXNhYmxlZF9saXN0X3ZpZXdzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZGVmYXVsdExpc3RWaWV3SWQgPSAocmVmMiA9IG9wdGlvbnMubGlzdF92aWV3cykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hbGwpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCkge1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAoZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQgPT09IGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Rfdmlld19pdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlbGYucGVybWlzc2lvbnMgPSBudWxsO1xuICB9XG4gIF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiO1xuICBzZWxmLmRiID0gX2RiO1xuICBzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWU7XG4gIHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpO1xuICBzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKTtcbiAgaWYgKHNlbGYubmFtZSAhPT0gXCJ1c2Vyc1wiICYmIHNlbGYubmFtZSAhPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIiwgXCJhY3Rpb25fZmllbGRfdXBkYXRlc1wiLCBcIm9iamVjdF9saXN0dmlld3NcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoc2VsZi5uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICBfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hO1xuICB9XG4gIGlmIChfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgQ3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmO1xuICByZXR1cm4gc2VsZjtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiO1xufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIGlmICghQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzKSB7XG4gICAgcmV0dXJuIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyA9IChmaWVsZFNjaGVtYSkgLT5cblx0b3B0aW9ucyA9IGZpZWxkU2NoZW1hLm9wdGlvbnNcblx0dW5sZXNzIG9wdGlvbnNcblx0XHRyZXR1cm5cblx0ZGF0YV90eXBlID0gZmllbGRTY2hlbWEuZGF0YV90eXBlXG5cdGlmICFfLmlzRnVuY3Rpb24ob3B0aW9ucykgYW5kIGRhdGFfdHlwZSBhbmQgZGF0YV90eXBlICE9ICd0ZXh0J1xuXHRcdCMg6Zu25Luj56CB55WM6Z2i6YWN572ub3B0aW9uc+mAiemhueWAvOWPquaUr+aMgeWtl+espuS4su+8jOaJgOS7peW9k2RhdGFfdHlwZeS4uuaVsOWAvOaIlmJvb2xlYW7ml7bvvIzlj6rog73lvLrooYzmiorpgInpobnlgLzlhYjovazmjaLkuLrlr7nlupTnmoTnsbvlnotcblx0XHRvcHRpb25zLmZvckVhY2ggKG9wdGlvbkl0ZW0pIC0+XG5cdFx0XHRpZiB0eXBlb2Ygb3B0aW9uSXRlbS52YWx1ZSAhPSAnc3RyaW5nJ1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIFtcblx0XHRcdFx0J251bWJlcidcblx0XHRcdFx0J2N1cnJlbmN5J1xuXHRcdFx0XHQncGVyY2VudCdcblx0XHRcdF0uaW5kZXhPZihkYXRhX3R5cGUpID4gLTFcblx0XHRcdFx0b3B0aW9uSXRlbS52YWx1ZSA9IE51bWJlcihvcHRpb25JdGVtLnZhbHVlKVxuXHRcdFx0ZWxzZSBpZiBkYXRhX3R5cGUgPT0gJ2Jvb2xlYW4nXG5cdFx0XHRcdCMg5Y+q5pyJ5Li6dHJ1ZeaJjeS4uuecn1xuXHRcdFx0XHRvcHRpb25JdGVtLnZhbHVlID0gb3B0aW9uSXRlbS52YWx1ZSA9PSAndHJ1ZSdcblx0cmV0dXJuIG9wdGlvbnNcblxuQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSAob2JqKSAtPlxuXHR1bmxlc3Mgb2JqXG5cdFx0cmV0dXJuXG5cdHNjaGVtYSA9IHt9XG5cblx0ZmllbGRzQXJyID0gW11cblxuXHRfLmVhY2ggb2JqLmZpZWxkcyAsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmICFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpXG5cdFx0XHRmaWVsZC5uYW1lID0gZmllbGRfbmFtZVxuXHRcdGZpZWxkc0Fyci5wdXNoIGZpZWxkXG5cblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cblxuXHRcdGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lXG5cblx0XHRmcyA9IHt9XG5cdFx0aWYgZmllbGQucmVnRXhcblx0XHRcdGZzLnJlZ0V4ID0gZmllbGQucmVnRXhcblx0XHRmcy5hdXRvZm9ybSA9IHt9XG5cdFx0ZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZVxuXHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0YXV0b2Zvcm1fdHlwZSA9IGZpZWxkLmF1dG9mb3JtPy50eXBlXG5cblx0XHRpZiBmaWVsZC50eXBlID09IFwidGV4dFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJwaG9uZVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW3RleHRdXCIgb3IgZmllbGQudHlwZSA9PSBcIltwaG9uZV1cIlxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2NvZGUnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAxMlxuXHRcdFx0aWYgZmllbGQubGFuZ3VhZ2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRleHRhcmVhXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJwYXNzd29yZFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJwYXNzd29yZFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmlzaU9TKClcblx0XHRcdFx0XHRcdCMgRml4IGlvcyAxNCwg5omL5py65a6i5oi356uv5b6F5a6h5qC45paH5Lu25pel5pyf5o6n5Lu25pi+56S65pWF6ZqcICM5OTHvvIxpb3Pnu5/kuIDnlKhQQ+err+S4gOagt+eahGpz5o6n5Lu2XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcblx0XHRcdFx0XHRcdFx0XHRwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxuXHRcdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcblxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxuXHRcdFx0XHRcdFx0IyBGaXggaW9zIDE0LCDmiYvmnLrlrqLmiLfnq6/lvoXlrqHmoLjmlofku7bml6XmnJ/mjqfku7bmmL7npLrmlYXpmpwgIzk5Me+8jGlvc+e7n+S4gOeUqFBD56uv5LiA5qC355qEanPmjqfku7Zcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG5cdFx0XHRcdFx0XHRcdFx0cGlja2VyVHlwZTogXCJyb2xsZXJzXCJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcblx0XHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIltPYmplY3RdXCJcblx0XHRcdGZzLnR5cGUgPSBbT2JqZWN0XVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImh0bWxcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIiB8fCBsb2NhbGUgPT0gXCJ6aC1DTlwiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuLVVTXCJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHR0eXBlOiBcInN1bW1lcm5vdGVcIlxuXHRcdFx0XHRcdGNsYXNzOiAnc3VtbWVybm90ZS1lZGl0b3InXG5cdFx0XHRcdFx0c2V0dGluZ3M6XG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDIwMFxuXHRcdFx0XHRcdFx0ZGlhbG9nc0luQm9keTogdHJ1ZVxuXHRcdFx0XHRcdFx0dG9vbGJhcjogIFtcblx0XHRcdFx0XHRcdFx0Wydmb250MScsIFsnc3R5bGUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSxcblx0XHRcdFx0XHRcdFx0Wydmb250MycsIFsnZm9udG5hbWUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnY29sb3InLCBbJ2NvbG9yJ11dLFxuXHRcdFx0XHRcdFx0XHRbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSxcblx0XHRcdFx0XHRcdFx0Wyd0YWJsZScsIFsndGFibGUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sXG5cdFx0XHRcdFx0XHRcdFsndmlldycsIFsnY29kZXZpZXcnXV1cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywn6buR5L2TJywn5b6u6L2v6ZuF6buRJywn5Lu/5a6LJywn5qW35L2TJywn6Zq25LmmJywn5bm85ZyGJ11cblx0XHRcdFx0XHRcdGxhbmc6IGxvY2FsZVxuXG5cdFx0ZWxzZSBpZiAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblxuXHRcdFx0aWYgIWZpZWxkLmhpZGRlblxuXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzXG5cblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb25cblxuXHRcdFx0XHRpZiBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0XHRmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblxuXHRcdFx0XHRmcy5maWx0ZXJzRnVuY3Rpb24gPSBpZiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gdGhlbiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gZWxzZSBDcmVhdG9yLmV2YWx1YXRlRmlsdGVyc1xuXG5cdFx0XHRcdGlmIGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRcdGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRpZiBmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0X3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXVxuXHRcdFx0XHRcdFx0XHRcdGlmIF9yZWZfb2JqPy5wZXJtaXNzaW9ucz8uYWxsb3dDcmVhdGVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gKGxvb2t1cF9maWVsZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3JtSWQ6IFwibmV3I3tmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsJ18nKX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogXCIje2ZpZWxkLnJlZmVyZW5jZV90b31cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25TdWNjZXNzOiAob3BlcmF0aW9uLCByZXN1bHQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlc3VsdC5vYmplY3RfbmFtZSA9PSBcIm9iamVjdHNcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLCB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsIGljb246IHJlc3VsdC52YWx1ZS5pY29ufV0sIHJlc3VsdC52YWx1ZS5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLCB2YWx1ZTogcmVzdWx0Ll9pZH1dLCByZXN1bHQuX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlXG5cblx0XHRcdFx0XHRpZiBfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGVcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfbGltaXRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdFxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b19maWVsZFxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlVG9GaWVsZCA9IGZpZWxkLnJlZmVyZW5jZV90b19maWVsZFxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwidXNlcnNcIlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7liIbpg6jliJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7liIbpg6hcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWIhumDqOmDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJvcmdhbml6YXRpb25zXCJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7liIbpg6jliJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7liIbpg6hcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWIhumDqOmDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgdHlwZW9mKGZpZWxkLnJlZmVyZW5jZV90bykgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0XHRcdFx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZVxuXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBTdHJpbmdcblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBbU3RyaW5nXVxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b11cblxuXHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXVxuXHRcdFx0XHRcdFx0aWYgX29iamVjdCBhbmQgX29iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIlxuXG5cdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdXG5cdFx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90by5mb3JFYWNoIChfcmVmZXJlbmNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfb2JqZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IF9vYmplY3Q/LmxhYmVsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogX29iamVjdD8uaWNvblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb25cblxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb25cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIlxuXHRcdFx0IyDlm6DkuLrliJfooajop4blm77lj7Pkvqfov4fmu6Tlmajov5jmmK/nlKjnmoTogIHooajljZXnmoRsb29rdXDlkoxzZWxlY3Tmjqfku7bvvIzmiYDku6XkuIrpnaLnmoTku6PnoIHlp4vnu4jkv53mjIHljp/moLfpnIDopoHmiafooYxcblx0XHRcdCMg5LiL6Z2i5piv6YWN572u5LqGZGF0YV90eXBl5pe277yM6aKd5aSW5aSE55CG55qE6YC76L6RXG5cdFx0XHRpZiBmaWVsZC5kYXRhX3R5cGUgYW5kIGZpZWxkLmRhdGFfdHlwZSAhPSBcInRleHRcIlxuXHRcdFx0XHRpZiBbXCJudW1iZXJcIiwgXCJjdXJyZW5jeVwiLCBcInBlcmNlbnRcIl0uaW5kZXhPZihmaWVsZC5kYXRhX3R5cGUpID4gLTFcblx0XHRcdFx0XHRmc1R5cGUgPSBOdW1iZXJcblx0XHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdFx0XHRlbHNlIGlmIGZpZWxkLmRhdGFfdHlwZSA9PSBcImJvb2xlYW5cIlxuXHRcdFx0XHRcdGZzVHlwZSA9IEJvb2xlYW5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzVHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy50eXBlID0gZnNUeXBlXG5cdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdFx0ZnMudHlwZSA9IFtmc1R5cGVdXG5cdFx0XHRcdFx0XG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMoZmllbGQpXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY3VycmVuY3lcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0XHRlbHNlIGlmIGZpZWxkPy5zY2FsZSAhPSAwXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gMlxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm51bWJlclwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJib29sZWFuXCJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidG9nZ2xlXCJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi10b2dnbGVcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInJlZmVyZW5jZVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY2hlY2tib3hcIlxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlXCJcblx0XHRcdGNvbGxlY3Rpb25OYW1lID0gZmllbGQuY29sbGVjdGlvbiB8fCBcImZpbGVzXCIgIyBjb2xsZWN0aW9uIOm7mOiupOaYryAnZmlsZXMnXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTmFtZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImZpbGVzaXplXCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PSBcIm9iamVjdFwiXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZ3JpZFwiXG5cdFx0XHRmcy50eXBlID0gQXJyYXlcblx0XHRcdGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIlxuXG5cdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHR0eXBlOiBPYmplY3Rcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJpbWFnZVwiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2ltYWdlcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXZhdGFyXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXZhdGFycydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF1ZGlvXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXVkaW9zJ1xuXHRcdFx0XHRcdFx0YWNjZXB0OiAnYXVkaW8vKidcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ2aWRlb1wiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ3ZpZGVvcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ3ZpZGVvLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibG9jYXRpb25cIlxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIlxuXHRcdFx0ZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIlxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibWFya2Rvd25cIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1tYXJrZG93blwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICd1cmwnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHQjIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LlVybFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zVXJsJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZW1haWwnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcblx0XHRcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdzdW1tYXJ5J1xuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cblx0XHQjIGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xuXHRcdCMgXHRmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtmaWVsZHM6IHtmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHt0eXBlOiBmaWVsZC5kYXRhX3R5cGV9KX19KVtmaWVsZC5uYW1lXVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAncGVyY2VudCdcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHR1bmxlc3MgXy5pc051bWJlcihmaWVsZC5zY2FsZSlcblx0XHRcdFx0IyDmsqHphY3nva7lsI/mlbDkvY3mlbDliJnmjInlsI/mlbDkvY3mlbAw5p2l5aSE55CG77yM5Y2z6buY6K6k5pi+56S65Li65pW05pWw55qE55m+5YiG5q+U77yM5q+U5aaCMjAl77yM5q2k5pe25o6n5Lu25Y+v5Lul6L6T5YWlMuS9jeWwj+aVsO+8jOi9rOaIkOeZvuWIhuavlOWwseaYr+aVtOaVsFxuXHRcdFx0XHRmaWVsZC5zY2FsZSA9IDBcblx0XHRcdCMgYXV0b2Zvcm3mjqfku7bkuK3lsI/mlbDkvY3mlbDlp4vnu4jmr5TphY3nva7nmoTkvY3mlbDlpJoy5L2NXG5cdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlICsgMlxuXHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlXG5cdFx0XHRmcy50eXBlID0gZmllbGQudHlwZVxuXG5cdFx0aWYgZmllbGQubGFiZWxcblx0XHRcdGZzLmxhYmVsID0gZmllbGQubGFiZWxcblxuI1x0XHRpZiBmaWVsZC5hbGxvd2VkVmFsdWVzXG4jXHRcdFx0ZnMuYWxsb3dlZFZhbHVlcyA9IGZpZWxkLmFsbG93ZWRWYWx1ZXNcblxuXHRcdGlmICFmaWVsZC5yZXF1aXJlZFxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXG5cblx0XHQjIFvnrb7nuqblr7nosaHlkIzml7bphY3nva7kuoZjb21wYW55X2lkc+W/heWhq+WPinVuZWRpdGFibGVfZmllbGRz6YCg5oiQ6YOo5YiG55So5oi35paw5bu6562+57qm5a+56LGh5pe25oql6ZSZICMxOTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9zdGVlZG9zL3N0ZWVkb3MtcHJvamVjdC1kenVnL2lzc3Vlcy8xOTIpXG5cdFx0IyDlkI7lj7Dlp4vnu4jorr7nva5yZXF1aXJlZOS4umZhbHNlXG5cdFx0aWYgIU1ldGVvci5pc0NsaWVudFxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC51bmlxdWVcblx0XHRcdGZzLnVuaXF1ZSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLm9taXRcblx0XHRcdGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5ncm91cFxuXHRcdFx0ZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cFxuXG5cdFx0aWYgZmllbGQuaXNfd2lkZVxuXHRcdFx0ZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmhpZGRlblxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCJcblxuXHRcdGlmIChmaWVsZC50eXBlID09IFwic2VsZWN0XCIpIG9yIChmaWVsZC50eXBlID09IFwibG9va3VwXCIpIG9yIChmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLmZpbHRlcmFibGUpID09ICd1bmRlZmluZWQnXG5cdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXG5cdFx0aWYgZmllbGQubmFtZSA9PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZVxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLnNlYXJjaGFibGUpID09ICd1bmRlZmluZWQnXG5cdFx0XHRcdGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlXG5cblx0XHRpZiBhdXRvZm9ybV90eXBlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZVxuXG5cdFx0aWYgZmllbGQuZGVmYXVsdFZhbHVlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gKCktPlxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHt1c2VySWQ6IE1ldGVvci51c2VySWQoKSwgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCBub3c6IG5ldyBEYXRlKCl9KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdFx0aWYgIV8uaXNGdW5jdGlvbihmaWVsZC5kZWZhdWx0VmFsdWUpXG5cdFx0XHRcdFx0ZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cblx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0ZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5kaXNhYmxlZFxuXHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5pbmxpbmVIZWxwVGV4dFxuXHRcdFx0ZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dFxuXG5cdFx0aWYgZmllbGQuYmxhY2tib3hcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXG5cdFx0aWYgXy5oYXMoZmllbGQsICdtaW4nKVxuXHRcdFx0ZnMubWluID0gZmllbGQubWluXG5cdFx0aWYgXy5oYXMoZmllbGQsICdtYXgnKVxuXHRcdFx0ZnMubWF4ID0gZmllbGQubWF4XG5cblx0XHQjIOWPquacieeUn+S6p+eOr+Wig+aJjemHjeW7uue0ouW8lVxuXHRcdGlmIE1ldGVvci5pc1Byb2R1Y3Rpb25cblx0XHRcdGlmIGZpZWxkLmluZGV4XG5cdFx0XHRcdGZzLmluZGV4ID0gZmllbGQuaW5kZXhcblx0XHRcdGVsc2UgaWYgZmllbGQuc29ydGFibGVcblx0XHRcdFx0ZnMuaW5kZXggPSB0cnVlXG5cblx0XHRzY2hlbWFbZmllbGRfbmFtZV0gPSBmc1xuXG5cdHJldHVybiBzY2hlbWFcblxuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSktPlxuXHRodG1sID0gZmllbGRfdmFsdWVcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRyZXR1cm4gXCJcIlxuXHRmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSlcblx0aWYgIWZpZWxkXG5cdFx0cmV0dXJuIFwiXCJcblxuXHRpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCBIOm1tJylcblx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJylcblxuXHRyZXR1cm4gaHRtbFxuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IChmaWVsZF90eXBlKS0+XG5cdHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXG5DcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyA9IChmaWVsZF90eXBlLCBvcGVyYXRpb25zKS0+XG5cdGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXG5cdGlmIGJ1aWx0aW5WYWx1ZXNcblx0XHRfLmZvckVhY2ggYnVpbHRpblZhbHVlcywgKGJ1aWx0aW5JdGVtLCBrZXkpLT5cblx0XHRcdG9wZXJhdGlvbnMucHVzaCh7bGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLCB2YWx1ZToga2V5fSlcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IChmaWVsZF90eXBlLCBpc19jaGVja19vbmx5KS0+XG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxuXHQjIOi/h+a7pOWZqOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUsIHZhbHVlKS0+XG5cdCMg5qC55o2u6L+H5ruk5Zmo55qE6L+H5ruk5YC877yM6I635Y+W5a+55bqU55qE5YaF572u6L+Q566X56ymXG5cdCMg5q+U5aaCdmFsdWXkuLpsYXN0X3llYXLvvIzov5Tlm55iZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXG5cdHVubGVzcyBfLmlzU3RyaW5nKHZhbHVlKVxuXHRcdHJldHVyblxuXHRiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSlcblx0dW5sZXNzIGJldHdlZW5CdWlsdGluVmFsdWVzXG5cdFx0cmV0dXJuXG5cdHJlc3VsdCA9IG51bGxcblx0Xy5lYWNoIGJldHdlZW5CdWlsdGluVmFsdWVzLCAoaXRlbSwgb3BlcmF0aW9uKS0+XG5cdFx0aWYgaXRlbS5rZXkgPT0gdmFsdWVcblx0XHRcdHJlc3VsdCA9IG9wZXJhdGlvblxuXHRyZXR1cm4gcmVzdWx0XG5cbiMg5aaC5p6c5Y+q5piv5Li65Yik5patb3BlcmF0aW9u5piv5ZCm5a2Y5Zyo77yM5YiZ5rKh5b+F6KaB6K6h566XdmFsdWVz77yM5Lyg5YWlaXNfY2hlY2tfb25seeS4unRydWXljbPlj69cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpLT5cblx0IyDov4fmu6Tlmajml7bpl7TlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0cmV0dXJuIHtcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcblx0XHRcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcblx0fVxuXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gKG1vbnRoKS0+XG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHRyZXR1cm4gMFxuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdHJldHVybiAzXG5cdGVsc2UgaWYgbW9udGggPCA5XG5cdFx0cmV0dXJuIDZcblx0XG5cdHJldHVybiA5XG5cblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gKHllYXIsbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHR5ZWFyLS1cblx0XHRtb250aCA9IDlcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRtb250aCA9IDBcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRtb250aCA9IDNcblx0ZWxzZSBcblx0XHRtb250aCA9IDZcblx0XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0aWYgbW9udGggPCAzXG5cdFx0bW9udGggPSAzXG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0bW9udGggPSA2XG5cdGVsc2UgaWYgbW9udGggPCA5XG5cdFx0bW9udGggPSA5XG5cdGVsc2Vcblx0XHR5ZWFyKytcblx0XHRtb250aCA9IDBcblx0XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblxuQ3JlYXRvci5nZXRNb250aERheXMgPSAoeWVhcixtb250aCktPlxuXHRpZiBtb250aCA9PSAxMVxuXHRcdHJldHVybiAzMVxuXHRcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cdHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgrMSwgMSlcblx0ZGF5cyA9IChlbmREYXRlLXN0YXJ0RGF0ZSkvbWlsbGlzZWNvbmRcblx0cmV0dXJuIGRheXNcblxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9ICh5ZWFyLCBtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdCMg5pyI5Lu95Li6MOS7o+ihqOacrOW5tOeahOesrOS4gOaciFxuXHRpZiBtb250aCA9PSAwXG5cdFx0bW9udGggPSAxMVxuXHRcdHllYXItLVxuXHRcdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5cdCMg5ZCm5YiZLOWPquWHj+WOu+aciOS7vVxuXHRtb250aC0tO1xuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdFxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XG5cdCMg6L+H5ruk5ZmoYmV0d2Vlbui/kOeul+espu+8jOeOsOeul+aXpeacny/ml6XmnJ/ml7bpl7TnsbvlnovlrZfmrrXnmoR2YWx1ZXPlgLxcblx0bm93ID0gbmV3IERhdGUoKVxuXHQjIOS4gOWkqeeahOavq+enkuaVsFxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcblx0eWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0dG9tb3Jyb3cgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXG5cdCMg5LiA5ZGo5Lit55qE5p+Q5LiA5aSpXG5cdHdlZWsgPSBub3cuZ2V0RGF5KClcblx0IyDlh4/ljrvnmoTlpKnmlbBcblx0bWludXNEYXkgPSBpZiB3ZWVrICE9IDAgdGhlbiB3ZWVrIC0gMSBlbHNlIDZcblx0bW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSlcblx0c3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKVxuXHQjIOS4iuWRqOaXpVxuXHRsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOS4iuWRqOS4gFxuXHRsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSlcblx0IyDkuIvlkajkuIBcblx0bmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcblx0IyDkuIvlkajml6Vcblx0bmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpXG5cdGN1cnJlbnRZZWFyID0gbm93LmdldEZ1bGxZZWFyKClcblx0cHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxXG5cdG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxXG5cdCMg5b2T5YmN5pyI5Lu9XG5cdGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpXG5cdCMg6K6h5pWw5bm044CB5pyIXG5cdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpXG5cdCMg5pys5pyI56ys5LiA5aSpXG5cdGZpcnN0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsY3VycmVudE1vbnRoLDEpXG5cblx0IyDlvZPkuLoxMuaciOeahOaXtuWAmeW5tOS7vemcgOimgeWKoDFcblx0IyDmnIjku73pnIDopoHmm7TmlrDkuLowIOS5n+WwseaYr+S4i+S4gOW5tOeahOesrOS4gOS4quaciFxuXHRpZiBjdXJyZW50TW9udGggPT0gMTFcblx0XHR5ZWFyKytcblx0XHRtb250aCsrXG5cdGVsc2Vcblx0XHRtb250aCsrXG5cdFxuXHQjIOS4i+aciOesrOS4gOWkqVxuXHRuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHQjIOS4i+aciOacgOWQjuS4gOWkqVxuXHRuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsbW9udGgsQ3JlYXRvci5nZXRNb250aERheXMoeWVhcixtb250aCkpXG5cdCMg5pys5pyI5pyA5ZCO5LiA5aSpXG5cdGxhc3REYXkgPSBuZXcgRGF0ZShuZXh0TW9udGhGaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0IyDkuIrmnIjnrKzkuIDlpKlcblx0bGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIrmnIjmnIDlkI7kuIDlpKlcblx0bGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0IyDmnKzlraPluqblvIDlp4vml6Vcblx0dGhpc1F1YXJ0ZXJTdGFydERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwxKVxuXHQjIOacrOWto+W6pue7k+adn+aXpVxuXHR0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyKSlcblx0IyDkuIrlraPluqblvIDlp4vml6Vcblx0bGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiK5a2j5bqm57uT5p2f5pelXG5cdGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMikpXG5cdCMg5LiL5a2j5bqm5byA5aeL5pelXG5cdG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4i+Wto+W6pue7k+adn+aXpVxuXHRuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxuXHQjIOi/h+WOuzflpKkgXG5cdGxhc3RfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg2ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzMw5aSpXG5cdGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67NjDlpKlcblx0bGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrs5MOWkqVxuXHRsYXN0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDg5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzEyMOWkqVxuXHRsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lN+WkqSBcblx0bmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lMzDlpKlcblx0bmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU2MOWkqVxuXHRuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTkw5aSpXG5cdG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lMTIw5aSpXG5cdG5leHRfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDExOSAqIG1pbGxpc2Vjb25kKSlcblxuXHRzd2l0Y2gga2V5XG5cdFx0d2hlbiBcImxhc3RfeWVhclwiXG5cdFx0XHQj5Y675bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7cHJldmlvdXNZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfeWVhclwiXG5cdFx0XHQj5LuK5bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7Y3VycmVudFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7Y3VycmVudFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3llYXJcIlxuXHRcdFx0I+aYjuW5tFxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF9xdWFydGVyXCJcblx0XHRcdCPkuIrlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc19xdWFydGVyXCJcblx0XHRcdCPmnKzlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF9xdWFydGVyXCJcblx0XHRcdCPkuIvlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF9tb250aFwiXG5cdFx0XHQj5LiK5pyIXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc19tb250aFwiXG5cdFx0XHQj5pys5pyIXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChmaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X21vbnRoXCJcblx0XHRcdCPkuIvmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X3dlZWtcIlxuXHRcdFx0I+S4iuWRqFxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChsYXN0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfd2Vla1wiXG5cdFx0XHQj5pys5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfd2Vla1wiXG5cdFx0XHQj5LiL5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwieWVzdGRheVwiXG5cdFx0XHQj5pio5aSpXG5cdFx0XHRzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3llc3RkYXlcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidG9kYXlcIlxuXHRcdFx0I+S7iuWkqVxuXHRcdFx0c3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b2RheVwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRvbW9ycm93XCJcblx0XHRcdCPmmI7lpKlcblx0XHRcdHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfN19kYXlzXCJcblx0XHRcdCPov4fljrs35aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSBcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfMzBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67MzDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfNjBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67NjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfOTBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67OTDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfMTIwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzEyMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzdfZGF5c1wiXG5cdFx0XHQj5pyq5p2lN+WkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfMzBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lMzDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfNjBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lNjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfOTBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lOTDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfMTIwX2RheXNcIlxuXHRcdFx0I+acquadpTEyMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcblx0dmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXVxuXHRpZiBmaWVsZF90eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdCMg5pe26Ze057G75Z6L5a2X5q6177yM5YaF572u5pe26Ze06IyD5Zu05bqU6K+l6ICD6JmR5YGP56e75pe25Yy65YC877yM5ZCm5YiZ6L+H5ruk5pWw5o2u5a2Y5Zyo5YGP5beuXG5cdFx0IyDpnZ7lhoXnva7ml7bpl7TojIPlm7Tml7bvvIznlKjmiLfpgJrov4fml7bpl7Tmjqfku7bpgInmi6nnmoTojIPlm7TvvIzkvJroh6rliqjlpITnkIbml7bljLrlgY/lt67mg4XlhrVcblx0XHQjIOaXpeacn+exu+Wei+Wtl+aute+8jOaVsOaNruW6k+acrOadpeWwseWtmOeahOaYr1VUQ+eahDDngrnvvIzkuI3lrZjlnKjlgY/lt65cblx0XHRfLmZvckVhY2ggdmFsdWVzLCAoZnYpLT5cblx0XHRcdGlmIGZ2XG5cdFx0XHRcdGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjAgKVxuXHRcblx0cmV0dXJuIHtcblx0XHRsYWJlbDogbGFiZWxcblx0XHRrZXk6IGtleVxuXHRcdHZhbHVlczogdmFsdWVzXG5cdH1cblxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSktPlxuXHRpZiBmaWVsZF90eXBlICYmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuICdiZXR3ZWVuJ1xuXHRlbHNlIGlmIFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gJ2NvbnRhaW5zJ1xuXHRlbHNlXG5cdFx0cmV0dXJuIFwiPVwiXG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSkgLT5cblx0IyDml6XmnJ/nsbvlnos6IGRhdGUsIGRhdGV0aW1lICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcblx0IyDmlofmnKznsbvlnos6IHRleHQsIHRleHRhcmVhLCBodG1sICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiY29udGFpbnNcIiwgXCJub3Rjb250YWluc1wiLCBcInN0YXJ0c3dpdGhcIlxuXHQjIOmAieaLqeexu+WeizogbG9va3VwLCBtYXN0ZXJfZGV0YWlsLCBzZWxlY3Qg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cdCMg5pWw5YC857G75Z6LOiBjdXJyZW5jeSwgbnVtYmVyICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcblx0IyDluIPlsJTnsbvlnos6IGJvb2xlYW4gIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxuXHQjIOaVsOe7hOexu+WeizogY2hlY2tib3gsIFt0ZXh0XSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cblx0b3B0aW9uYWxzID0ge1xuXHRcdGVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksIHZhbHVlOiBcIj1cIn0sXG5cdFx0dW5lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksIHZhbHVlOiBcIjw+XCJ9LFxuXHRcdGxlc3NfdGhhbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSwgdmFsdWU6IFwiPFwifSxcblx0XHRncmVhdGVyX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksIHZhbHVlOiBcIj5cIn0sXG5cdFx0bGVzc19vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksIHZhbHVlOiBcIjw9XCJ9LFxuXHRcdGdyZWF0ZXJfb3JfZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLCB2YWx1ZTogXCI+PVwifSxcblx0XHRjb250YWluczoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLCB2YWx1ZTogXCJjb250YWluc1wifSxcblx0XHRub3RfY29udGFpbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJ9LFxuXHRcdHN0YXJ0c193aXRoOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksIHZhbHVlOiBcInN0YXJ0c3dpdGhcIn0sXG5cdFx0YmV0d2Vlbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksIHZhbHVlOiBcImJldHdlZW5cIn0sXG5cdH1cblxuXHRpZiBmaWVsZF90eXBlID09IHVuZGVmaW5lZFxuXHRcdHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpXG5cblx0b3BlcmF0aW9ucyA9IFtdXG5cblx0aWYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pXG5cdFx0Q3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucylcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwidGV4dFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0YXJlYVwiIG9yIGZpZWxkX3R5cGUgPT0gXCJodG1sXCIgb3IgZmllbGRfdHlwZSA9PSBcImNvZGVcIlxuI1x0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmNvbnRhaW5zLCBvcHRpb25hbHMubm90X2NvbnRhaW4sIG9wdGlvbmFscy5zdGFydHNfd2l0aClcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJsb29rdXBcIiBvciBmaWVsZF90eXBlID09IFwibWFzdGVyX2RldGFpbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJjdXJyZW5jeVwiIG9yIGZpZWxkX3R5cGUgPT0gXCJudW1iZXJcIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMubGVzc190aGFuLCBvcHRpb25hbHMuZ3JlYXRlcl90aGFuLCBvcHRpb25hbHMubGVzc19vcl9lcXVhbCwgb3B0aW9uYWxzLmdyZWF0ZXJfb3JfZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImJvb2xlYW5cIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJjaGVja2JveFwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcIlt0ZXh0XVwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2Vcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblxuXHRyZXR1cm4gb3BlcmF0aW9uc1xuXG4jIyNcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gKG9iamVjdF9uYW1lKS0+XG5cdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXG5cdGZpZWxkc0FyciA9IFtdXG5cblx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkKS0+XG5cdFx0ZmllbGRzQXJyLnB1c2gge25hbWU6IGZpZWxkLm5hbWUsIHNvcnRfbm86IGZpZWxkLnNvcnRfbm99XG5cblx0ZmllbGRzTmFtZSA9IFtdXG5cdF8uZWFjaCBfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgKGZpZWxkKS0+XG5cdFx0ZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpXG5cdHJldHVybiBmaWVsZHNOYW1lXG4iLCJDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMgPSBmdW5jdGlvbihmaWVsZFNjaGVtYSkge1xuICB2YXIgZGF0YV90eXBlLCBvcHRpb25zO1xuICBvcHRpb25zID0gZmllbGRTY2hlbWEub3B0aW9ucztcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRhdGFfdHlwZSA9IGZpZWxkU2NoZW1hLmRhdGFfdHlwZTtcbiAgaWYgKCFfLmlzRnVuY3Rpb24ob3B0aW9ucykgJiYgZGF0YV90eXBlICYmIGRhdGFfdHlwZSAhPT0gJ3RleHQnKSB7XG4gICAgb3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG9wdGlvbkl0ZW0pIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uSXRlbS52YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFsnbnVtYmVyJywgJ2N1cnJlbmN5JywgJ3BlcmNlbnQnXS5pbmRleE9mKGRhdGFfdHlwZSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gb3B0aW9uSXRlbS52YWx1ZSA9IE51bWJlcihvcHRpb25JdGVtLnZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YV90eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbkl0ZW0udmFsdWUgPSBvcHRpb25JdGVtLnZhbHVlID09PSAndHJ1ZSc7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFNjaGVtYSA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgZmllbGRzQXJyLCBzY2hlbWE7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNjaGVtYSA9IHt9O1xuICBmaWVsZHNBcnIgPSBbXTtcbiAgXy5lYWNoKG9iai5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKCFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpKSB7XG4gICAgICBmaWVsZC5uYW1lID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKGZpZWxkKTtcbiAgfSk7XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICB2YXIgX29iamVjdCwgX3JlZl9vYmosIF9yZWZlcmVuY2VfdG8sIGF1dG9mb3JtX3R5cGUsIGNvbGxlY3Rpb25OYW1lLCBmaWVsZF9uYW1lLCBmcywgZnNUeXBlLCBpc1VuTGltaXRlZCwgbG9jYWxlLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxLCByZWYyLCByZWYzO1xuICAgIGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lO1xuICAgIGZzID0ge307XG4gICAgaWYgKGZpZWxkLnJlZ0V4KSB7XG4gICAgICBmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4O1xuICAgIH1cbiAgICBmcy5hdXRvZm9ybSA9IHt9O1xuICAgIGZzLmF1dG9mb3JtLm11bHRpcGxlID0gZmllbGQubXVsdGlwbGU7XG4gICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgIGF1dG9mb3JtX3R5cGUgPSAocmVmID0gZmllbGQuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMDtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJwaG9uZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbdGV4dF1cIiB8fCBmaWVsZC50eXBlID09PSBcIltwaG9uZV1cIikge1xuICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2NvZGUnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyO1xuICAgICAgaWYgKGZpZWxkLmxhbmd1YWdlKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmxhbmd1YWdlID0gZmllbGQubGFuZ3VhZ2U7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicGFzc3dvcmRcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIixcbiAgICAgICAgICAgICAgICBwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgICBkYXRlTW9iaWxlT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBEYXRlO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKSkge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmlzaU9TKCkpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRldGltZVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiLFxuICAgICAgICAgICAgICAgIHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCIsXG4gICAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRldGltZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRldGltZVwiLFxuICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiW09iamVjdF1cIikge1xuICAgICAgZnMudHlwZSA9IFtPYmplY3RdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJodG1sXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKCk7XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIiB8fCBsb2NhbGUgPT09IFwiemgtQ05cIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbGUgPSBcImVuLVVTXCI7XG4gICAgICAgIH1cbiAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgIHR5cGU6IFwic3VtbWVybm90ZVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogJ3N1bW1lcm5vdGUtZWRpdG9yJyxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICAgICAgICBkaWFsb2dzSW5Cb2R5OiB0cnVlLFxuICAgICAgICAgICAgdG9vbGJhcjogW1snZm9udDEnLCBbJ3N0eWxlJ11dLCBbJ2ZvbnQyJywgWydib2xkJywgJ3VuZGVybGluZScsICdpdGFsaWMnLCAnY2xlYXInXV0sIFsnZm9udDMnLCBbJ2ZvbnRuYW1lJ11dLCBbJ2NvbG9yJywgWydjb2xvciddXSwgWydwYXJhJywgWyd1bCcsICdvbCcsICdwYXJhZ3JhcGgnXV0sIFsndGFibGUnLCBbJ3RhYmxlJ11dLCBbJ2luc2VydCcsIFsnbGluaycsICdwaWN0dXJlJ11dLCBbJ3ZpZXcnLCBbJ2NvZGV2aWV3J11dXSxcbiAgICAgICAgICAgIGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywgJ+m7keS9kycsICflvq7ova/pm4Xpu5EnLCAn5Lu/5a6LJywgJ+alt+S9kycsICfpmrbkuaYnLCAn5bm85ZyGJ10sXG4gICAgICAgICAgICBsYW5nOiBsb2NhbGVcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmaWVsZC5zaG93SWNvbjtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICB9XG4gICAgICBpZiAoIWZpZWxkLmhpZGRlbikge1xuICAgICAgICBmcy5hdXRvZm9ybS5maWx0ZXJzID0gZmllbGQuZmlsdGVycztcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb247XG4gICAgICAgIGlmIChmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgZnMuZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uID8gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIDogQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnM7XG4gICAgICAgIGlmIChmaWVsZC5vcHRpb25zRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90bykge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgX3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgICAgICBpZiAoX3JlZl9vYmogIT0gbnVsbCA/IChyZWYxID0gX3JlZl9vYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYxLmFsbG93Q3JlYXRlIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihsb29rdXBfZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy5cIiArIChDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgZm9ybUlkOiBcIm5ld1wiICsgKGZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywgJ18nKSksXG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IFwiXCIgKyBmaWVsZC5yZWZlcmVuY2VfdG8sXG4gICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImluc2VydFwiLFxuICAgICAgICAgICAgICAgICAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24ob3BlcmF0aW9uLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZXN1bHQub2JqZWN0X25hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IHJlc3VsdC52YWx1ZS5pY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQudmFsdWUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSkpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9zb3J0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX2xpbWl0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTGltaXQgPSBmaWVsZC5yZWZlcmVuY2VfbGltaXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZVRvRmllbGQgPSBmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwidXNlcnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMiA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwib3JnYW5pemF0aW9uc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RvcmdcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gKHJlZjMgPSBvYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYzLmdldCgpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KF9yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgICAgICAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub2JqZWN0U3dpdGNoZSA9IHRydWU7XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFtTdHJpbmddLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV90b1swXV07XG4gICAgICAgICAgICBpZiAoX29iamVjdCAmJiBfb2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFRyZWVcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2QgPSBmaWVsZC5vcHRpb25zTWV0aG9kIHx8IFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiO1xuICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZFBhcmFtcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvLmZvckVhY2goZnVuY3Rpb24oX3JlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlXTtcbiAgICAgICAgICAgICAgICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5sYWJlbCA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBpY29uOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0SWNvbiA9IGZpZWxkLmRlZmF1bHRJY29uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmYWxzZTtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICAgIGlmIChfLmhhcyhmaWVsZCwgJ2ZpcnN0T3B0aW9uJykpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IGZpZWxkLmZpcnN0T3B0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZpZWxkLmRhdGFfdHlwZSAmJiBmaWVsZC5kYXRhX3R5cGUgIT09IFwidGV4dFwiKSB7XG4gICAgICAgIGlmIChbXCJudW1iZXJcIiwgXCJjdXJyZW5jeVwiLCBcInBlcmNlbnRcIl0uaW5kZXhPZihmaWVsZC5kYXRhX3R5cGUpID4gLTEpIHtcbiAgICAgICAgICBmc1R5cGUgPSBOdW1iZXI7XG4gICAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZmllbGQuZGF0YV90eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgIGZzVHlwZSA9IEJvb2xlYW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnNUeXBlID0gU3RyaW5nO1xuICAgICAgICB9XG4gICAgICAgIGZzLnR5cGUgPSBmc1R5cGU7XG4gICAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICAgIGZzLnR5cGUgPSBbZnNUeXBlXTtcbiAgICAgICAgfVxuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zKGZpZWxkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiY3VycmVuY3lcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApICE9PSAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gMjtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidG9nZ2xlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBCb29sZWFuO1xuICAgICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi10b2dnbGVcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicmVmZXJlbmNlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdC1jaGVja2JveFwiO1xuICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVcIikge1xuICAgICAgY29sbGVjdGlvbk5hbWUgPSBmaWVsZC5jb2xsZWN0aW9uIHx8IFwiZmlsZXNcIjtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWVcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gY29sbGVjdGlvbk5hbWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVzaXplXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZ3JpZFwiKSB7XG4gICAgICBmcy50eXBlID0gQXJyYXk7XG4gICAgICBmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWU7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiO1xuICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2ltYWdlcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdmF0YXJcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXZhdGFycycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXVkaW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2F1ZGlvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInZpZGVvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ3ZpZGVvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICd2aWRlby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb2NhdGlvblwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIjtcbiAgICAgIGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCI7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLW1hcmtkb3duXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAndXJsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZW1haWwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWw7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHtcbiAgICAgICAgICAgIHR5cGU6IGZpZWxkLmRhdGFfdHlwZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pW2ZpZWxkLm5hbWVdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICBmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7XG4gICAgICAgICAgICB0eXBlOiBmaWVsZC5kYXRhX3R5cGVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVtmaWVsZC5uYW1lXTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdwZXJjZW50Jykge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmICghXy5pc051bWJlcihmaWVsZC5zY2FsZSkpIHtcbiAgICAgICAgZmllbGQuc2NhbGUgPSAwO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZSArIDI7XG4gICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnMudHlwZSA9IGZpZWxkLnR5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5sYWJlbCkge1xuICAgICAgZnMubGFiZWwgPSBmaWVsZC5sYWJlbDtcbiAgICB9XG4gICAgaWYgKCFmaWVsZC5yZXF1aXJlZCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQudW5pcXVlKSB7XG4gICAgICBmcy51bmlxdWUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQub21pdCkge1xuICAgICAgZnMuYXV0b2Zvcm0ub21pdCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ncm91cCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlzX3dpZGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaGlkZGVuKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIjtcbiAgICB9XG4gICAgaWYgKChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5maWx0ZXJhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLm5hbWUgPT09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLnNlYXJjaGFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXV0b2Zvcm1fdHlwZSkge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kZWZhdWx0VmFsdWUpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7XG4gICAgICAgICAgICB1c2VySWQ6IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSxcbiAgICAgICAgICAgIG5vdzogbmV3IERhdGUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgICAgZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGlzYWJsZWQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlubGluZUhlbHBUZXh0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0O1xuICAgIH1cbiAgICBpZiAoZmllbGQuYmxhY2tib3gpIHtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWluJykpIHtcbiAgICAgIGZzLm1pbiA9IGZpZWxkLm1pbjtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWF4JykpIHtcbiAgICAgIGZzLm1heCA9IGZpZWxkLm1heDtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1Byb2R1Y3Rpb24pIHtcbiAgICAgIGlmIChmaWVsZC5pbmRleCkge1xuICAgICAgICBmcy5pbmRleCA9IGZpZWxkLmluZGV4O1xuICAgICAgfSBlbHNlIGlmIChmaWVsZC5zb3J0YWJsZSkge1xuICAgICAgICBmcy5pbmRleCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzY2hlbWFbZmllbGRfbmFtZV0gPSBmcztcbiAgfSk7XG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKSB7XG4gIHZhciBmaWVsZCwgaHRtbCwgb2JqZWN0O1xuICBodG1sID0gZmllbGRfdmFsdWU7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSk7XG4gIGlmICghZmllbGQpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKTtcbiAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICB9XG4gIHJldHVybiBodG1sO1xufTtcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKTtcbn07XG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgb3BlcmF0aW9ucykge1xuICB2YXIgYnVpbHRpblZhbHVlcztcbiAgYnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmIChidWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuIF8uZm9yRWFjaChidWlsdGluVmFsdWVzLCBmdW5jdGlvbihidWlsdGluSXRlbSwga2V5KSB7XG4gICAgICByZXR1cm4gb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLFxuICAgICAgICB2YWx1ZToga2V5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIGtleSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlLCB2YWx1ZSkge1xuICB2YXIgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIHJlc3VsdDtcbiAgaWYgKCFfLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmICghYmV0d2VlbkJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVzdWx0ID0gbnVsbDtcbiAgXy5lYWNoKGJldHdlZW5CdWlsdGluVmFsdWVzLCBmdW5jdGlvbihpdGVtLCBvcGVyYXRpb24pIHtcbiAgICBpZiAoaXRlbS5rZXkgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzdWx0ID0gb3BlcmF0aW9uO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIHtcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSBmdW5jdGlvbihtb250aCkge1xuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHJldHVybiAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIHJldHVybiAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIHJldHVybiA2O1xuICB9XG4gIHJldHVybiA5O1xufTtcblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHllYXItLTtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIHtcbiAgICBtb250aCA9IDY7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSA2O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGggPSAwO1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIHZhciBkYXlzLCBlbmREYXRlLCBtaWxsaXNlY29uZCwgc3RhcnREYXRlO1xuICBpZiAobW9udGggPT09IDExKSB7XG4gICAgcmV0dXJuIDMxO1xuICB9XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgc3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAxKTtcbiAgZGF5cyA9IChlbmREYXRlIC0gc3RhcnREYXRlKSAvIG1pbGxpc2Vjb25kO1xuICByZXR1cm4gZGF5cztcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPT09IDApIHtcbiAgICBtb250aCA9IDExO1xuICAgIHllYXItLTtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICB9XG4gIG1vbnRoLS07XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICB2YXIgY3VycmVudE1vbnRoLCBjdXJyZW50WWVhciwgZW5kVmFsdWUsIGZpcnN0RGF5LCBsYWJlbCwgbGFzdERheSwgbGFzdE1vbmRheSwgbGFzdE1vbnRoRmluYWxEYXksIGxhc3RNb250aEZpcnN0RGF5LCBsYXN0UXVhcnRlckVuZERheSwgbGFzdFF1YXJ0ZXJTdGFydERheSwgbGFzdFN1bmRheSwgbGFzdF8xMjBfZGF5cywgbGFzdF8zMF9kYXlzLCBsYXN0XzYwX2RheXMsIGxhc3RfN19kYXlzLCBsYXN0XzkwX2RheXMsIG1pbGxpc2Vjb25kLCBtaW51c0RheSwgbW9uZGF5LCBtb250aCwgbmV4dE1vbmRheSwgbmV4dE1vbnRoRmluYWxEYXksIG5leHRNb250aEZpcnN0RGF5LCBuZXh0UXVhcnRlckVuZERheSwgbmV4dFF1YXJ0ZXJTdGFydERheSwgbmV4dFN1bmRheSwgbmV4dFllYXIsIG5leHRfMTIwX2RheXMsIG5leHRfMzBfZGF5cywgbmV4dF82MF9kYXlzLCBuZXh0XzdfZGF5cywgbmV4dF85MF9kYXlzLCBub3csIHByZXZpb3VzWWVhciwgc3RhcnRWYWx1ZSwgc3RyRW5kRGF5LCBzdHJGaXJzdERheSwgc3RyTGFzdERheSwgc3RyTW9uZGF5LCBzdHJTdGFydERheSwgc3RyU3VuZGF5LCBzdHJUb2RheSwgc3RyVG9tb3Jyb3csIHN0clllc3RkYXksIHN1bmRheSwgdGhpc1F1YXJ0ZXJFbmREYXksIHRoaXNRdWFydGVyU3RhcnREYXksIHRvbW9ycm93LCB2YWx1ZXMsIHdlZWssIHllYXIsIHllc3RkYXk7XG4gIG5vdyA9IG5ldyBEYXRlKCk7XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgeWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgd2VlayA9IG5vdy5nZXREYXkoKTtcbiAgbWludXNEYXkgPSB3ZWVrICE9PSAwID8gd2VlayAtIDEgOiA2O1xuICBtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdFN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgbmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIG5leHRTdW5kYXkgPSBuZXcgRGF0ZShuZXh0TW9uZGF5LmdldFRpbWUoKSArIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgY3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgcHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxO1xuICBuZXh0WWVhciA9IGN1cnJlbnRZZWFyICsgMTtcbiAgY3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgZmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCAxKTtcbiAgaWYgKGN1cnJlbnRNb250aCA9PT0gMTEpIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGgrKztcbiAgfSBlbHNlIHtcbiAgICBtb250aCsrO1xuICB9XG4gIG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLCBtb250aCkpO1xuICBsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwgMSk7XG4gIHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyKSk7XG4gIGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlIFwibGFzdF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc195ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3Rfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc193ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ5ZXN0ZGF5XCI6XG4gICAgICBzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9kYXlcIjpcbiAgICAgIHN0clRvZGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b21vcnJvd1wiOlxuICAgICAgc3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gIH1cbiAgdmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIF8uZm9yRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGZ2KSB7XG4gICAgICBpZiAoZnYpIHtcbiAgICAgICAgcmV0dXJuIGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGtleToga2V5LFxuICAgIHZhbHVlczogdmFsdWVzXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgaWYgKGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2JldHdlZW4nO1xuICB9IGVsc2UgaWYgKFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2NvbnRhaW5zJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCI9XCI7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHZhciBvcGVyYXRpb25zLCBvcHRpb25hbHM7XG4gIG9wdGlvbmFscyA9IHtcbiAgICBlcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI9XCJcbiAgICB9LFxuICAgIHVuZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PlwiXG4gICAgfSxcbiAgICBsZXNzX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIjxcIlxuICAgIH0sXG4gICAgZ3JlYXRlcl90aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI+XCJcbiAgICB9LFxuICAgIGxlc3Nfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PVwiXG4gICAgfSxcbiAgICBncmVhdGVyX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPj1cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLFxuICAgICAgdmFsdWU6IFwiY29udGFpbnNcIlxuICAgIH0sXG4gICAgbm90X2NvbnRhaW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksXG4gICAgICB2YWx1ZTogXCJub3Rjb250YWluc1wiXG4gICAgfSxcbiAgICBzdGFydHNfd2l0aDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksXG4gICAgICB2YWx1ZTogXCJzdGFydHN3aXRoXCJcbiAgICB9LFxuICAgIGJldHdlZW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksXG4gICAgICB2YWx1ZTogXCJiZXR3ZWVuXCJcbiAgICB9XG4gIH07XG4gIGlmIChmaWVsZF90eXBlID09PSB2b2lkIDApIHtcbiAgICByZXR1cm4gXy52YWx1ZXMob3B0aW9uYWxzKTtcbiAgfVxuICBvcGVyYXRpb25zID0gW107XG4gIGlmIChDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbik7XG4gICAgQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJ0ZXh0YXJlYVwiIHx8IGZpZWxkX3R5cGUgPT09IFwiaHRtbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwiY29kZVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5jb250YWlucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZF90eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCBmaWVsZF90eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY3VycmVuY3lcIiB8fCBmaWVsZF90eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiW3RleHRdXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9XG4gIHJldHVybiBvcGVyYXRpb25zO1xufTtcblxuXG4vKlxuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBmaWVsZHMsIGZpZWxkc0FyciwgZmllbGRzTmFtZSwgcmVmO1xuICBmaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKHtcbiAgICAgIG5hbWU6IGZpZWxkLm5hbWUsXG4gICAgICBzb3J0X25vOiBmaWVsZC5zb3J0X25vXG4gICAgfSk7XG4gIH0pO1xuICBmaWVsZHNOYW1lID0gW107XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIGZpZWxkc05hbWU7XG59O1xuIiwiQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9XG5cbmluaXRUcmlnZ2VyID0gKG9iamVjdF9uYW1lLCB0cmlnZ2VyKS0+XG5cdHRyeVxuXHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXG5cdFx0aWYgIXRyaWdnZXIudG9kb1xuXHRcdFx0cmV0dXJuXG5cdFx0dG9kb1dyYXBwZXIgPSAoKS0+XG5cdFx0XHQgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZVxuXHRcdFx0ICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcblx0XHRpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUuaW5zZXJ0XCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8udXBkYXRlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUucmVtb3ZlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5pbnNlcnRcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/Lmluc2VydCh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy51cGRhdGUodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnJlbW92ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRjYXRjaCBlcnJvclxuXHRcdGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpXG5cbmNsZWFuVHJpZ2dlciA9IChvYmplY3RfbmFtZSktPlxuXHQjIyNcbiAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG5cdCMjI1xuICAgICNUT0RPIOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbBidWdcblx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0/LnJldmVyc2UoKS5mb3JFYWNoIChfaG9vayktPlxuXHRcdF9ob29rLnJlbW92ZSgpXG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gKG9iamVjdF9uYW1lKS0+XG4jXHRjb25zb2xlLmxvZygnQ3JlYXRvci5pbml0VHJpZ2dlcnMgb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSlcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0Y2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKVxuXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW11cblxuXHRfLmVhY2ggb2JqLnRyaWdnZXJzLCAodHJpZ2dlciwgdHJpZ2dlcl9uYW1lKS0+XG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyIGFuZCB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcblx0XHRcdGlmIF90cmlnZ2VyX2hvb2tcblx0XHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXG5cdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spIiwidmFyIGNsZWFuVHJpZ2dlciwgaW5pdFRyaWdnZXI7XG5cbkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fTtcblxuaW5pdFRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdHJpZ2dlcikge1xuICB2YXIgY29sbGVjdGlvbiwgZXJyb3IsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgdG9kb1dyYXBwZXI7XG4gIHRyeSB7XG4gICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgaWYgKCF0cmlnZ2VyLnRvZG8pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdG9kb1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZTtcbiAgICAgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmLmluc2VydCh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjEgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjEudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmMi5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjMgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmMy5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjQgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNC51cGRhdGUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjUgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNS5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpO1xuICB9XG59O1xuXG5jbGVhblRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuXG4gIC8qXG4gICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXG4gICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG4gICAqL1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uKF9ob29rKSB7XG4gICAgcmV0dXJuIF9ob29rLnJlbW92ZSgpO1xuICB9KSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIG9iajtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdO1xuICByZXR1cm4gXy5lYWNoKG9iai50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwgdHJpZ2dlcl9uYW1lKSB7XG4gICAgdmFyIF90cmlnZ2VyX2hvb2s7XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICBpZiAoX3RyaWdnZXJfaG9vaykge1xuICAgICAgICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIHJldHVybiBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpXG5cbmJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImFsbG93Q3JlYXRlXCIsIFwiYWxsb3dEZWxldGVcIiwgXCJhbGxvd0VkaXRcIiwgXCJhbGxvd1JlYWRcIiwgXCJtb2RpZnlBbGxSZWNvcmRzXCIsIFwidmlld0FsbFJlY29yZHNcIiwgXCJtb2RpZnlDb21wYW55UmVjb3Jkc1wiLCBcInZpZXdDb21wYW55UmVjb3Jkc1wiLCBcblx0XCJhbGxvd1JlYWRGaWxlc1wiLCBcImFsbG93RWRpdEZpbGVzXCIsIFwiYWxsb3dDcmVhdGVGaWxlc1wiLCBcImFsbG93RGVsZXRlRmlsZXNcIiwgXCJ2aWV3QWxsRmlsZXNcIiwgXCJtb2RpZnlBbGxGaWxlc1wiXSBcbm90aGVyUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImRpc2FibGVkX2xpc3Rfdmlld3NcIiwgXCJkaXNhYmxlZF9hY3Rpb25zXCIsIFwidW5yZWFkYWJsZV9maWVsZHNcIiwgXCJ1bmVkaXRhYmxlX2ZpZWxkc1wiLCBcInVucmVsYXRlZF9vYmplY3RzXCIsIFwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcIl1cbnBlcm1pc3Npb25Qcm9wTmFtZXMgPSBfLnVuaW9uIGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzXG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmICFvYmpcblx0XHRcdHJldHVyblxuXHRcdHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KClcblx0ZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XG5cdCMg6ZmE5Lu25p2D6ZmQ5LiN5YaN5LiO5YW254i26K6w5b2V57yW6L6R6YWN572u5YWz6IGUXG5cdCMgaWYgcmVjb3JkIGFuZCBvYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0IyBcdCMg5aaC5p6c5pivY21zX2ZpbGVz6ZmE5Lu277yM5YiZ5p2D6ZmQ5Y+W5YW254i26K6w5b2V5p2D6ZmQXG5cdCMgXHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKVxuXHQjIFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tuivpue7hueVjOmdolxuXHQjIFx0XHRvYmplY3RfbmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuXHQjIFx0XHRyZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcblx0IyBcdGVsc2UgXG5cdCMgXHRcdCMg5b2T5YmN5aSE5LqOY21zX2ZpbGVz6ZmE5Lu255qE54i26K6w5b2V55WM6Z2iXG5cdCMgXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XG5cdCMgXHRcdHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuXHQjIFx0b2JqZWN0X2ZpZWxkc19rZXlzID0gXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uZmllbGRzIG9yIHt9KSB8fCBbXTtcblx0IyBcdHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcblx0IyBcdGlmIHNlbGVjdC5sZW5ndGggPiAwXG5cdCMgXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdC5qb2luKCcsJykpO1xuXHQjIFx0ZWxzZVxuXHQjIFx0XHRyZWNvcmQgPSBudWxsO1xuXG5cdHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKVxuXG5cdGlmIHJlY29yZFxuXHRcdGlmIHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnNcblx0XHRcdHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXG5cblx0XHRpc093bmVyID0gcmVjb3JkLm93bmVyID09IHVzZXJJZCB8fCByZWNvcmQub3duZXI/Ll9pZCA9PSB1c2VySWRcblxuXHRcdGlmIG9iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdCMg6ZmE5Lu255qE5p+l55yL5omA5pyJ5L+u5pS55omA5pyJ5p2D6ZmQ5LiO6ZmE5Lu25a+56LGh55qEdmlld0FsbFJlY29yZHPjgIFtb2RpZnlBbGxSZWNvcmRz5peg5YWz77yM5Y+q5LiO5YW25Li76KGo6K6w5b2V55qEdmlld0FsbEZpbGVz5ZKMbW9kaWZ5QWxsRmlsZXPmnInlhbNcblx0XHRcdCMg5aaC5p6c5pivY21zX2ZpbGVz6ZmE5Lu277yM5YiZ5p2D6ZmQ6ZyA6KaB6aKd5aSW6ICD6JmR5YW254i25a+56LGh5LiK5YWz5LqO6ZmE5Lu255qE5p2D6ZmQ6YWN572uXG5cdFx0XHRtYXN0ZXJPYmplY3ROYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG5cdFx0XHRtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhtYXN0ZXJPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gcGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXNcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0RlbGV0ZUZpbGVzXG5cdFx0XHRpZiAhbWFzdGVyUmVjb3JkUGVybS5tb2RpZnlBbGxGaWxlcyBhbmQgIWlzT3duZXJcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gcGVybWlzc2lvbnMuYWxsb3dSZWFkICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkRmlsZXNcblx0XHRcdGlmICFtYXN0ZXJSZWNvcmRQZXJtLnZpZXdBbGxGaWxlcyBhbmQgIWlzT3duZXJcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZD8uY29tcGFueV9pZFxuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpIGFuZCByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZOaYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEb2JqZWN077yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XG5cdFx0XHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQ/LmNvbXBhbnlfaWRzXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWRzWzBdKVxuXHRcdFx0XHQjIOWboHJlY29yZF9jb21wYW55X2lkc+aYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEW29iamVjdF3vvIzmiYDku6Xov5nph4zlj5blh7rlhbZfaWTlgLxcblx0XHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcCgobiktPiBuLl9pZClcblx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKVxuXHRcdFx0aWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0ZWxzZSBpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5L+u5pS5XG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5L+u5pS5XG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRpZiByZWNvcmQubG9ja2VkIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cblx0XHRcdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5p+l55yLXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lk5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+afpeeci1xuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XG5cdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cbiMgY3VycmVudE9iamVjdE5hbWXvvJrlvZPliY3kuLvlr7nosaFcbiMgcmVsYXRlZExpc3RJdGVt77yaQ3JlYXRvci5nZXRSZWxhdGVkTGlzdChTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpLCBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSnkuK3lj5ZyZWxhdGVkX29iamVjdF9uYW1l5a+55bqU55qE5YC8XG4jIGN1cnJlbnRSZWNvcmTlvZPliY3kuLvlr7nosaHnmoTor6bnu4borrDlvZVcbmlmIE1ldGVvci5pc0NsaWVudFxuXHRDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMgPSAoY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XG5cdFx0aWYgIWN1cnJlbnRPYmplY3ROYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdFx0aWYgIXJlbGF0ZWRMaXN0SXRlbVxuXHRcdFx0Y29uc29sZS5lcnJvcihcInJlbGF0ZWRMaXN0SXRlbSBtdXN0IG5vdCBiZSBlbXB0eSBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9uc1wiKTtcblx0XHRcdHJldHVybiB7fVxuXG5cdFx0aWYgIWN1cnJlbnRSZWNvcmQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Y3VycmVudFJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcblxuXHRcdGlmICF1c2VySWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0XHRpZiAhc3BhY2VJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cblx0XHRtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKVxuXHRcdHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKVxuXHRcdHJlc3VsdCA9IF8uY2xvbmUgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zXG5cblx0XHRpZiByZWxhdGVkTGlzdEl0ZW0uaXNfZmlsZVxuXHRcdFx0cmVzdWx0LmFsbG93Q3JlYXRlID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlc1xuXHRcdFx0cmVzdWx0LmFsbG93RWRpdCA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlc1xuXHRcdGVsc2Vcblx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZExpc3RJdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIHx8IGZhbHNlXG5cdFx0XHRtYXN0ZXJBbGxvdyA9IGZhbHNlXG5cdFx0XHRpZiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PSB0cnVlXG5cdFx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRcblx0XHRcdGVsc2UgaWYgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT0gZmFsc2Vcblx0XHRcdFx0bWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdFxuXG5cdFx0XHR1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKVxuXHRcdFx0aXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlID0gdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QuaW5kZXhPZihyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpID4gLTFcblxuXHRcdFx0cmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcblx0XHRcdHJlc3VsdC5hbGxvd0VkaXQgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcblx0XHRyZXR1cm4gcmVzdWx0XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkKSAtPlxuXHRcdHBlcm1pc3Npb25zID1cblx0XHRcdG9iamVjdHM6IHt9XG5cdFx0XHRhc3NpZ25lZF9hcHBzOiBbXVxuXHRcdCMjI1xuXHRcdOadg+mZkOmbhuivtOaYjjpcblx0XHTlhoXnva7mnYPpmZDpm4YtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXG5cdFx06Ieq5a6a5LmJ5p2D6ZmQ6ZuGLeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOmbhuS7peWklueahOWFtuS7luadg+mZkOmbhlxuXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG5cdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ6ZuGXG5cdFx0IyMjXG5cblx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxuXHRcdHNwYWNlVXNlciA9IG51bGxcblx0XHRpZiB1c2VySWRcblx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXG5cdFx0cHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cblx0XHRwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRlbHNlXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cblx0XHRwc2V0c0FkbWluX3BvcyA9IG51bGxcblx0XHRwc2V0c1VzZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IG51bGxcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IG51bGxcblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gbnVsbFxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbFxuXG5cdFx0aWYgcHNldHNBZG1pbj8uX2lkXG5cdFx0XHRwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxuXHRcdFx0cHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzTWVtYmVyPy5faWRcblx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNHdWVzdD8uX2lkXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1N1cHBsaWVyPy5faWRcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzQ3VzdG9tZXI/Ll9pZFxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cblx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIl9pZFwiXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiB7JGluOiBzZXRfaWRzfX0pLmZldGNoKClcblx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXG5cdFx0cHNldHMgPSB7XG5cdFx0XHRwc2V0c0FkbWluLCBcblx0XHRcdHBzZXRzVXNlciwgXG5cdFx0XHRwc2V0c0N1cnJlbnQsIFxuXHRcdFx0cHNldHNNZW1iZXIsIFxuXHRcdFx0cHNldHNHdWVzdCxcblx0XHRcdHBzZXRzU3VwcGxpZXIsXG5cdFx0XHRwc2V0c0N1c3RvbWVyLFxuXHRcdFx0aXNTcGFjZUFkbWluLFxuXHRcdFx0c3BhY2VVc2VyLCBcblx0XHRcdHBzZXRzQWRtaW5fcG9zLCBcblx0XHRcdHBzZXRzVXNlcl9wb3MsIFxuXHRcdFx0cHNldHNNZW1iZXJfcG9zLCBcblx0XHRcdHBzZXRzR3Vlc3RfcG9zLFxuXHRcdFx0cHNldHNTdXBwbGllcl9wb3MsXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3Bvcyxcblx0XHRcdHBzZXRzQ3VycmVudF9wb3Ncblx0XHR9XG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpXG5cdFx0cGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lc1xuXHRcdF9pID0gMFxuXHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG5cdFx0XHRfaSsrXG5cdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PSBzcGFjZUlkXG5cdFx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PSAnMCcgfHwgKG9iamVjdC5pbl9kZXZlbG9wbWVudCAhPSAnMCcgJiYgaXNTcGFjZUFkbWluKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblx0dW5pb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cblx0XHRpZiAhYXJyYXkgYW5kICFvdGhlclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRcdGlmICFhcnJheVxuXHRcdFx0YXJyYXkgPSBbXVxuXHRcdGlmICFvdGhlclxuXHRcdFx0b3RoZXIgPSBbXVxuXHRcdHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcilcblxuXHRpbnRlcnNlY3Rpb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cblx0XHRpZiAhYXJyYXkgYW5kICFvdGhlclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRcdGlmICFhcnJheVxuXHRcdFx0YXJyYXkgPSBbXVxuXHRcdGlmICFvdGhlclxuXHRcdFx0b3RoZXIgPSBbXVxuXHRcdHJldHVybiBfLmludGVyc2VjdGlvbihhcnJheSwgb3RoZXIpXG5cblx0ZXh0ZW5kUGVybWlzc2lvblByb3BzID0gKHRhcmdldCwgcHJvcHMpIC0+XG5cdFx0cHJvcE5hbWVzID0gcGVybWlzc2lvblByb3BOYW1lc1xuXHRcdGZpbGVzUHJvTmFtZXMgPSBcblx0XHRpZiBwcm9wc1xuXHRcdFx0Xy5lYWNoIHByb3BOYW1lcywgKHByb3BOYW1lKSAtPlxuXHRcdFx0XHR0YXJnZXRbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdXG5cblx0XHRcdCMgdGFyZ2V0LmFsbG93Q3JlYXRlID0gcHJvcHMuYWxsb3dDcmVhdGVcblx0XHRcdCMgdGFyZ2V0LmFsbG93RGVsZXRlID0gcHJvcHMuYWxsb3dEZWxldGVcblx0XHRcdCMgdGFyZ2V0LmFsbG93RWRpdCA9IHByb3BzLmFsbG93RWRpdFxuXHRcdFx0IyB0YXJnZXQuYWxsb3dSZWFkID0gcHJvcHMuYWxsb3dSZWFkXG5cdFx0XHQjIHRhcmdldC5tb2RpZnlBbGxSZWNvcmRzID0gcHJvcHMubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQudmlld0FsbFJlY29yZHMgPSBwcm9wcy52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwcm9wcy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQudmlld0NvbXBhbnlSZWNvcmRzID0gcHJvcHMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHQjIHRhcmdldC5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcHJvcHMuZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0IyB0YXJnZXQuZGlzYWJsZWRfYWN0aW9ucyA9IHByb3BzLmRpc2FibGVkX2FjdGlvbnNcblx0XHRcdCMgdGFyZ2V0LnVucmVhZGFibGVfZmllbGRzID0gcHJvcHMudW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdCMgdGFyZ2V0LnVuZWRpdGFibGVfZmllbGRzID0gcHJvcHMudW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdCMgdGFyZ2V0LnVucmVsYXRlZF9vYmplY3RzID0gcHJvcHMudW5yZWxhdGVkX29iamVjdHNcblx0XHRcdCMgdGFyZ2V0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcHJvcHMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcblxuXHRvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMgPSAodGFyZ2V0LCBwcm9wcykgLT5cblx0XHRwcm9wTmFtZXMgPSBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXNcblx0XHRfLmVhY2ggcHJvcE5hbWVzLCAocHJvcE5hbWUpIC0+XG5cdFx0XHRpZiBwcm9wc1twcm9wTmFtZV1cblx0XHRcdFx0dGFyZ2V0W3Byb3BOYW1lXSA9IHRydWVcblx0XHRcblx0XHQjIGlmIHBvLmFsbG93UmVhZFxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0NyZWF0ZVxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWVcblx0XHQjIGlmIHBvLmFsbG93RWRpdFxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHQjIGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWVcblx0XHQjIGlmIHBvLnZpZXdBbGxSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxuXHRcdCMgaWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cdFx0IyBpZiBwby52aWV3Q29tcGFueVJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXG5cblx0Q3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0cHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzU3VwcGxpZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzQ3VzdG9tZXIgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0IyBwc2V0c01lbWJlciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdCMgcHNldHNHdWVzdCA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRzcGFjZVVzZXIgPSBudWxsO1xuXHRcdGlmIHVzZXJJZFxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRlbHNlXG5cdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRhcHBzID0gW11cblx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdHJldHVybiBbXVxuXHRcdGVsc2Vcblx0XHRcdHVzZXJQcm9maWxlID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pPy5wcm9maWxlXG5cdFx0XHRwc2V0QmFzZSA9IHBzZXRzVXNlclxuXHRcdFx0aWYgdXNlclByb2ZpbGVcblx0XHRcdFx0aWYgdXNlclByb2ZpbGUgPT0gJ3N1cHBsaWVyJ1xuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNTdXBwbGllclxuXHRcdFx0XHRlbHNlIGlmIHVzZXJQcm9maWxlID09ICdjdXN0b21lcidcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXJcblx0XHRcdGlmIHBzZXRCYXNlPy5hc3NpZ25lZF9hcHBzPy5sZW5ndGhcblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIHVzZXLmnYPpmZDpm4bkuK3nmoRhc3NpZ25lZF9hcHBz6KGo56S65omA5pyJ55So5oi35YW35pyJ55qEYXBwc+adg+mZkO+8jOS4uuepuuWImeihqOekuuacieaJgOaciWFwcHPmnYPpmZDvvIzkuI3pnIDopoHkvZzmnYPpmZDliKTmlq3kuoZcblx0XHRcdFx0cmV0dXJuIFtdXG5cdFx0XHRfLmVhY2ggcHNldHMsIChwc2V0KS0+XG5cdFx0XHRcdGlmICFwc2V0LmFzc2lnbmVkX2FwcHNcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgcHNldC5uYW1lID09IFwiYWRtaW5cIiB8fCAgcHNldC5uYW1lID09IFwidXNlclwiIHx8IHBzZXQubmFtZSA9PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PSAnY3VzdG9tZXInXG5cdFx0XHRcdFx0IyDov5nph4zkuYvmiYDku6XopoHmjpLpmaRhZG1pbi91c2Vy77yM5piv5Zug5Li66L+Z5Lik5Liq5p2D6ZmQ6ZuG5piv5omA5pyJ5p2D6ZmQ6ZuG5LitdXNlcnPlsZ7mgKfml6DmlYjnmoTmnYPpmZDpm4bvvIznibnmjIflt6XkvZzljLrnrqHnkIblkZjlkozmiYDmnInnlKjmiLdcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzXG5cdFx0XHRyZXR1cm4gXy53aXRob3V0KF8udW5pcShhcHBzKSx1bmRlZmluZWQsbnVsbClcblxuXHRDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0cHNldHMgPSAgdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdGFkbWluTWVudXMgPSBDcmVhdG9yLkFwcHMuYWRtaW4/LmFkbWluX21lbnVzXG5cdFx0IyDlpoLmnpzmsqHmnIlhZG1pbuiPnOWNleivtOaYjuS4jemcgOimgeebuOWFs+WKn+iDve+8jOebtOaOpei/lOWbnuepulxuXHRcdHVubGVzcyBhZG1pbk1lbnVzXG5cdFx0XHRyZXR1cm4gW11cblx0XHRhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQgKG4pIC0+XG5cdFx0XHRuLl9pZCA9PSAnYWJvdXQnXG5cdFx0YWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyIChuKSAtPlxuXHRcdFx0bi5faWQgIT0gJ2Fib3V0J1xuXHRcdG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeSBfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCAobikgLT5cblx0XHRcdHJldHVybiBuLmFkbWluX21lbnVzIGFuZCBuLl9pZCAhPSAnYWRtaW4nXG5cdFx0KSwgJ3NvcnQnXG5cdFx0b3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpXG5cdFx0IyDoj5zljZXmnInkuInpg6jliIbnu4TmiJDvvIzorr7nva5BUFDoj5zljZXjgIHlhbbku5ZBUFDoj5zljZXku6Xlj4phYm91dOiPnOWNlVxuXHRcdGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSlcblx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdCMg5bel5L2c5Yy6566h55CG5ZGY5pyJ5YWo6YOo6I+c5Y2V5Yqf6IO9XG5cdFx0XHRyZXN1bHQgPSBhbGxNZW51c1xuXHRcdGVsc2Vcblx0XHRcdHVzZXJQcm9maWxlID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pPy5wcm9maWxlIHx8ICd1c2VyJ1xuXHRcdFx0Y3VycmVudFBzZXROYW1lcyA9IHBzZXRzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4ubmFtZVxuXHRcdFx0bWVudXMgPSBhbGxNZW51cy5maWx0ZXIgKG1lbnUpLT5cblx0XHRcdFx0cHNldHNNZW51ID0gbWVudS5wZXJtaXNzaW9uX3NldHNcblx0XHRcdFx0IyDlpoLmnpzmma7pgJrnlKjmiLfmnInmnYPpmZDvvIzliJnnm7TmjqXov5Tlm550cnVlXG5cdFx0XHRcdGlmIHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZih1c2VyUHJvZmlsZSkgPiAtMVxuXHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRcdCMg5ZCm5YiZ5Y+W5b2T5YmN55So5oi355qE5p2D6ZmQ6ZuG5LiObWVudeiPnOWNleimgeaxgueahOadg+mZkOmbhuWvueavlO+8jOWmguaenOS6pOmbhuWkp+S6jjHkuKrliJnov5Tlm550cnVlXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aFxuXHRcdFx0cmVzdWx0ID0gbWVudXNcblx0XHRcblx0XHRyZXR1cm4gXy5zb3J0QnkocmVzdWx0LFwic29ydFwiKVxuXG5cdGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpLT5cblxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBudWxsXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBfLmZpbmQgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cblx0XHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkfSlcblxuXHRmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcyktPlxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBudWxsXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBfLmZpbHRlciBwZXJtaXNzaW9uX29iamVjdHMsIChwbyktPlxuXHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogcGVybWlzc2lvbl9zZXRfaWRzfX0pLmZldGNoKClcblxuXHR1bmlvblBlcm1pc3Npb25PYmplY3RzID0gKHBvcywgb2JqZWN0LCBwc2V0cyktPlxuXHRcdCMg5oqKZGLlj4p5bWzkuK3nmoRwZXJtaXNzaW9uX29iamVjdHPlkIjlubbvvIzkvJjlhYjlj5ZkYuS4reeahFxuXHRcdHJlc3VsdCA9IFtdXG5cdFx0Xy5lYWNoIG9iamVjdC5wZXJtaXNzaW9uX3NldCwgKG9wcywgb3BzX2tleSktPlxuXHRcdFx0IyDmiop5bWzkuK3pmaTkuobnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4ZcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCLlpJbnmoTlhbbku5blr7nosaHmnYPpmZDlhYjlrZjlhaVyZXN1bHRcblx0XHRcdCMgaWYgW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIiwgXCJ3b3JrZmxvd19hZG1pblwiLCBcIm9yZ2FuaXphdGlvbl9hZG1pblwiXS5pbmRleE9mKG9wc19rZXkpIDwgMFxuXHRcdFx0aWYgW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDBcblx0XHRcdFx0Y3VycmVudFBzZXQgPSBwc2V0cy5maW5kIChwc2V0KS0+IHJldHVybiBwc2V0Lm5hbWUgPT0gb3BzX2tleVxuXHRcdFx0XHRpZiBjdXJyZW50UHNldFxuXHRcdFx0XHRcdHRlbXBPcHMgPSBfLmNsb25lKG9wcykgfHwge31cblx0XHRcdFx0XHR0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkXG5cdFx0XHRcdFx0dGVtcE9wcy5vYmplY3RfbmFtZSA9IG9iamVjdC5vYmplY3RfbmFtZVxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoIHRlbXBPcHNcblx0XHRpZiByZXN1bHQubGVuZ3RoXG5cdFx0XHRwb3MuZm9yRWFjaCAocG8pLT5cblx0XHRcdFx0cmVwZWF0SW5kZXggPSAwXG5cdFx0XHRcdHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoKGl0ZW0sIGluZGV4KS0+IHJlcGVhdEluZGV4ID0gaW5kZXg7cmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT0gcG8ucGVybWlzc2lvbl9zZXRfaWQpXG5cdFx0XHRcdCMg5aaC5p6ceW1s5Lit5bey57uP5a2Y5ZyocG/vvIzliJnmm7/mjaLkuLrmlbDmja7lupPkuK3nmoRwb++8jOWPjeS5i+WImeaKiuaVsOaNruW6k+S4reeahHBv55u05o6l57Sv5Yqg6L+b5Y67XG5cdFx0XHRcdGlmIHJlcGVhdFBvXG5cdFx0XHRcdFx0cmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXN1bHQucHVzaCBwb1xuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBwb3NcblxuXHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpLT5cblx0XHRwZXJtaXNzaW9ucyA9IHt9XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpXG5cblx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT0gXCJ1c2Vyc1wiXG5cdFx0XHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxuXHRcdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcblx0XHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXHRcdHBzZXRzQWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIG9yIHRoaXMucHNldHNBZG1pbiB0aGVuIHRoaXMucHNldHNBZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c1VzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgb3IgdGhpcy5wc2V0c1VzZXIgdGhlbiB0aGlzLnBzZXRzVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzTWVtYmVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgb3IgdGhpcy5wc2V0c01lbWJlciB0aGVuIHRoaXMucHNldHNNZW1iZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzR3Vlc3QgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIG9yIHRoaXMucHNldHNHdWVzdCB0aGVuIHRoaXMucHNldHNHdWVzdCBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjF9fSlcblxuXHRcdHBzZXRzU3VwcGxpZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzU3VwcGxpZXIpIG9yIHRoaXMucHNldHNTdXBwbGllciB0aGVuIHRoaXMucHNldHNTdXBwbGllciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c0N1c3RvbWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSBvciB0aGlzLnBzZXRzQ3VzdG9tZXIgdGhlbiB0aGlzLnBzZXRzQ3VzdG9tZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudDtcblx0XHRpZiAhcHNldHNcblx0XHRcdHNwYWNlVXNlciA9IG51bGw7XG5cdFx0XHRpZiB1c2VySWRcblx0XHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXG5cdFx0cHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zXG5cdFx0cHNldHNVc2VyX3BvcyA9IHRoaXMucHNldHNVc2VyX3Bvc1xuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zXG5cdFx0cHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zXG5cblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3Ncblx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3NcblxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3NcblxuXHRcdG9wc2V0QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5hZG1pbikgfHwge31cblx0XHRvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fVxuXHRcdG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fVxuXHRcdG9wc2V0R3Vlc3QgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cblxuXHRcdG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge31cblx0XHRvcHNldEN1c3RvbWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuY3VzdG9tZXIpIHx8IHt9XG5cblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X2xpc3R2aWV3cycpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNoYXJlZDogdHJ1ZX0sIHtmaWVsZHM6e19pZDoxfX0pLmZldGNoKClcblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IF8ucGx1Y2soc2hhcmVkTGlzdFZpZXdzLFwiX2lkXCIpXG5cdFx0IyBpZiBzaGFyZWRMaXN0Vmlld3MubGVuZ3RoXG5cdFx0IyBcdHVubGVzcyBvcHNldEFkbWluLmxpc3Rfdmlld3Ncblx0XHQjIFx0XHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBbXVxuXHRcdCMgXHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0QWRtaW4ubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXG5cdFx0IyBcdHVubGVzcyBvcHNldFVzZXIubGlzdF92aWV3c1xuXHRcdCMgXHRcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gW11cblx0XHQjIFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0VXNlci5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3Ncblx0XHQjIOaVsOaNruW6k+S4reWmguaenOmFjee9ruS6hum7mOiupOeahGFkbWluL3VzZXLmnYPpmZDpm4borr7nva7vvIzlupTor6Xopobnm5bku6PnoIHkuK1hZG1pbi91c2Vy55qE5p2D6ZmQ6ZuG6K6+572uXG5cdFx0aWYgcHNldHNBZG1pblxuXHRcdFx0cG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRBZG1pbiwgcG9zQWRtaW5cblx0XHRpZiBwc2V0c1VzZXJcblx0XHRcdHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0VXNlciwgcG9zVXNlclxuXHRcdGlmIHBzZXRzTWVtYmVyXG5cdFx0XHRwb3NNZW1iZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzTWVtYmVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzTWVtYmVyLl9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldE1lbWJlciwgcG9zTWVtYmVyXG5cdFx0aWYgcHNldHNHdWVzdFxuXHRcdFx0cG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRHdWVzdCwgcG9zR3Vlc3Rcblx0XHRpZiBwc2V0c1N1cHBsaWVyXG5cdFx0XHRwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRTdXBwbGllciwgcG9zU3VwcGxpZXJcblx0XHRpZiBwc2V0c0N1c3RvbWVyXG5cdFx0XHRwb3NDdXN0b21lciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXN0b21lcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0N1c3RvbWVyLl9pZCk7XG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRDdXN0b21lciwgcG9zQ3VzdG9tZXJcblxuXHRcdGlmICF1c2VySWRcblx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxuXHRcdGVsc2Vcblx0XHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnY29tbW9uJ1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzcGFjZVVzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgb3IgdGhpcy5zcGFjZVVzZXIgdGhlbiB0aGlzLnNwYWNlVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdFx0XHRcdGlmIHNwYWNlVXNlclxuXHRcdFx0XHRcdFx0cHJvZiA9IHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRcdFx0XHRpZiBwcm9mXG5cdFx0XHRcdFx0XHRcdGlmIHByb2YgaXMgJ3VzZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdtZW1iZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldE1lbWJlclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2d1ZXN0J1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ3N1cHBsaWVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRTdXBwbGllclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lclxuXHRcdFx0XHRcdFx0ZWxzZSAjIOayoeaciXByb2ZpbGXliJnorqTkuLrmmK91c2Vy5p2D6ZmQXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XG5cdFx0aWYgcHNldHMubGVuZ3RoID4gMFxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHMsIFwiX2lkXCJcblx0XHRcdHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpXG5cdFx0XHRwb3MgPSB1bmlvblBlcm1pc3Npb25PYmplY3RzKHBvcywgb2JqZWN0LCBwc2V0cylcblx0XHRcdF8uZWFjaCBwb3MsIChwbyktPlxuXHRcdFx0XHRpZiBwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0FkbWluPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzVXNlcj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c01lbWJlcj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0d1ZXN0Py5faWQgb3Jcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNTdXBwbGllcj8uX2lkIG9yXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQ3VzdG9tZXI/Ll9pZFxuXHRcdFx0XHRcdCMg6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOWAvOWPquWunuihjOS4iumdoueahOm7mOiupOWAvOimhueblu+8jOS4jeWBmueul+azleWIpOaWrVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBfLmlzRW1wdHkocGVybWlzc2lvbnMpXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBwb1xuXHRcdFx0XHRvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMgcGVybWlzc2lvbnMsIHBvXG5cblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cylcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCBwby51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdClcblx0XHRcblx0XHRpZiBvYmplY3QuaXNfdmlld1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdXG5cdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcblxuXHRcdGlmIG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lclxuXHRcdFx0cGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXG5cdCMgQ3JlYXRvci5pbml0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUpIC0+XG5cblx0XHQjICMg5bqU6K+l5oqK6K6h566X5Ye65p2l55qEXG5cdFx0IyBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXS5hbGxvd1xuXHRcdCMgXHRpbnNlcnQ6ICh1c2VySWQsIGRvYykgLT5cblx0XHQjIFx0XHRpZiAhdXNlcklkXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0ICAgIFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblx0XHQjIFx0dXBkYXRlOiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dFZGl0XG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdCMgXHRyZW1vdmU6ICh1c2VySWQsIGRvYykgLT5cblx0XHQjIFx0XHRpZiAhdXNlcklkXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblxuXHRNZXRlb3IubWV0aG9kc1xuXHRcdCMgQ2FsY3VsYXRlIFBlcm1pc3Npb25zIG9uIFNlcnZlclxuXHRcdFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogKHNwYWNlSWQpLT5cblx0XHRcdHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKVxuIiwidmFyIGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgY2xvbmUsIGV4dGVuZFBlcm1pc3Npb25Qcm9wcywgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCwgZmluZF9wZXJtaXNzaW9uX29iamVjdCwgaW50ZXJzZWN0aW9uUGx1cywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzLCBvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMsIHBlcm1pc3Npb25Qcm9wTmFtZXMsIHVuaW9uUGVybWlzc2lvbk9iamVjdHMsIHVuaW9uUGx1cztcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5iYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJhbGxvd0NyZWF0ZVwiLCBcImFsbG93RGVsZXRlXCIsIFwiYWxsb3dFZGl0XCIsIFwiYWxsb3dSZWFkXCIsIFwibW9kaWZ5QWxsUmVjb3Jkc1wiLCBcInZpZXdBbGxSZWNvcmRzXCIsIFwibW9kaWZ5Q29tcGFueVJlY29yZHNcIiwgXCJ2aWV3Q29tcGFueVJlY29yZHNcIiwgXCJhbGxvd1JlYWRGaWxlc1wiLCBcImFsbG93RWRpdEZpbGVzXCIsIFwiYWxsb3dDcmVhdGVGaWxlc1wiLCBcImFsbG93RGVsZXRlRmlsZXNcIiwgXCJ2aWV3QWxsRmlsZXNcIiwgXCJtb2RpZnlBbGxGaWxlc1wiXTtcblxub3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiZGlzYWJsZWRfbGlzdF92aWV3c1wiLCBcImRpc2FibGVkX2FjdGlvbnNcIiwgXCJ1bnJlYWRhYmxlX2ZpZWxkc1wiLCBcInVuZWRpdGFibGVfZmllbGRzXCIsIFwidW5yZWxhdGVkX29iamVjdHNcIiwgXCJ1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFwiXTtcblxucGVybWlzc2lvblByb3BOYW1lcyA9IF8udW5pb24oYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzLCBvdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMpO1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgb2JqO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKTtcbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgaXNPd25lciwgbWFzdGVyT2JqZWN0TmFtZSwgbWFzdGVyUmVjb3JkUGVybSwgcGVybWlzc2lvbnMsIHJlY29yZF9jb21wYW55X2lkLCByZWNvcmRfY29tcGFueV9pZHMsIHJlZiwgdXNlcl9jb21wYW55X2lkcztcbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpO1xuICBpZiAocmVjb3JkKSB7XG4gICAgaWYgKHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnMpIHtcbiAgICAgIHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zO1xuICAgIH1cbiAgICBpc093bmVyID0gcmVjb3JkLm93bmVyID09PSB1c2VySWQgfHwgKChyZWYgPSByZWNvcmQub3duZXIpICE9IG51bGwgPyByZWYuX2lkIDogdm9pZCAwKSA9PT0gdXNlcklkO1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgbWFzdGVyT2JqZWN0TmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuICAgICAgbWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMobWFzdGVyT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gcGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXM7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHBlcm1pc3Npb25zLmFsbG93RGVsZXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dEZWxldGVGaWxlcztcbiAgICAgIGlmICghbWFzdGVyUmVjb3JkUGVybS5tb2RpZnlBbGxGaWxlcyAmJiAhaXNPd25lcikge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHBlcm1pc3Npb25zLmFsbG93UmVhZCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZEZpbGVzO1xuICAgICAgaWYgKCFtYXN0ZXJSZWNvcmRQZXJtLnZpZXdBbGxGaWxlcyAmJiAhaXNPd25lcikge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICB1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKTtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZCA6IHZvaWQgMDtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSAmJiByZWNvcmRfY29tcGFueV9pZC5faWQpIHtcbiAgICAgICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWQ7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkcyA6IHZvaWQgMDtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSkpIHtcbiAgICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKTtcbiAgICAgIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkLmxvY2tlZCAmJiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwZXJtaXNzaW9ucztcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSwgbWFzdGVyQWxsb3csIG1hc3RlclJlY29yZFBlcm0sIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucywgcmVzdWx0LCB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgaWYgKCFjdXJyZW50T2JqZWN0TmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFyZWxhdGVkTGlzdEl0ZW0pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmICghY3VycmVudFJlY29yZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgbWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpO1xuICAgIHJlc3VsdCA9IF8uY2xvbmUocmVsYXRlZE9iamVjdFBlcm1pc3Npb25zKTtcbiAgICBpZiAocmVsYXRlZExpc3RJdGVtLmlzX2ZpbGUpIHtcbiAgICAgIHJlc3VsdC5hbGxvd0NyZWF0ZSA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXM7XG4gICAgICByZXN1bHQuYWxsb3dFZGl0ID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRMaXN0SXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB8fCBmYWxzZTtcbiAgICAgIG1hc3RlckFsbG93ID0gZmFsc2U7XG4gICAgICBpZiAod3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT09IHRydWUpIHtcbiAgICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZDtcbiAgICAgIH0gZWxzZSBpZiAod3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT09IGZhbHNlKSB7XG4gICAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXQ7XG4gICAgICB9XG4gICAgICB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKTtcbiAgICAgIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xO1xuICAgICAgcmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGU7XG4gICAgICByZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgX2ksIGlzU3BhY2VBZG1pbiwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7XG4gICAgICBvYmplY3RzOiB7fSxcbiAgICAgIGFzc2lnbmVkX2FwcHM6IFtdXG4gICAgfTtcblxuICAgIC8qXG4gICAgXHRcdOadg+mZkOmbhuivtOaYjjpcbiAgICBcdFx05YaF572u5p2D6ZmQ6ZuGLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxuICAgIFx0XHToh6rlrprkuYnmnYPpmZDpm4Yt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ6ZuG5Lul5aSW55qE5YW25LuW5p2D6ZmQ6ZuGXG4gICAgXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG4gICAgXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOmbhlxuICAgICAqL1xuICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgcHNldHNBZG1pbl9wb3MgPSBudWxsO1xuICAgIHBzZXRzVXNlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNHdWVzdF9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGw7XG4gICAgaWYgKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VycmVudC5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwiX2lkXCIpO1xuICAgICAgcHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgICAkaW46IHNldF9pZHNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwibmFtZVwiKTtcbiAgICB9XG4gICAgcHNldHMgPSB7XG4gICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudCxcbiAgICAgIHBzZXRzTWVtYmVyOiBwc2V0c01lbWJlcixcbiAgICAgIHBzZXRzR3Vlc3Q6IHBzZXRzR3Vlc3QsXG4gICAgICBwc2V0c1N1cHBsaWVyOiBwc2V0c1N1cHBsaWVyLFxuICAgICAgcHNldHNDdXN0b21lcjogcHNldHNDdXN0b21lcixcbiAgICAgIGlzU3BhY2VBZG1pbjogaXNTcGFjZUFkbWluLFxuICAgICAgc3BhY2VVc2VyOiBzcGFjZVVzZXIsXG4gICAgICBwc2V0c0FkbWluX3BvczogcHNldHNBZG1pbl9wb3MsXG4gICAgICBwc2V0c1VzZXJfcG9zOiBwc2V0c1VzZXJfcG9zLFxuICAgICAgcHNldHNNZW1iZXJfcG9zOiBwc2V0c01lbWJlcl9wb3MsXG4gICAgICBwc2V0c0d1ZXN0X3BvczogcHNldHNHdWVzdF9wb3MsXG4gICAgICBwc2V0c1N1cHBsaWVyX3BvczogcHNldHNTdXBwbGllcl9wb3MsXG4gICAgICBwc2V0c0N1c3RvbWVyX3BvczogcHNldHNDdXN0b21lcl9wb3MsXG4gICAgICBwc2V0c0N1cnJlbnRfcG9zOiBwc2V0c0N1cnJlbnRfcG9zXG4gICAgfTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXM7XG4gICAgX2kgPSAwO1xuICAgIF8uZWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgIF9pKys7XG4gICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT09IHNwYWNlSWQpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT09ICcwJyAmJiBpc1NwYWNlQWRtaW4pKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpO1xuICAgICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgdW5pb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIGludGVyc2VjdGlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcHMpIHtcbiAgICB2YXIgZmlsZXNQcm9OYW1lcywgcHJvcE5hbWVzO1xuICAgIHByb3BOYW1lcyA9IHBlcm1pc3Npb25Qcm9wTmFtZXM7XG4gICAgcmV0dXJuIGZpbGVzUHJvTmFtZXMgPSBwcm9wcyA/IF8uZWFjaChwcm9wTmFtZXMsIGZ1bmN0aW9uKHByb3BOYW1lKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICB9KSA6IHZvaWQgMDtcbiAgfTtcbiAgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wcykge1xuICAgIHZhciBwcm9wTmFtZXM7XG4gICAgcHJvcE5hbWVzID0gYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzO1xuICAgIHJldHVybiBfLmVhY2gocHJvcE5hbWVzLCBmdW5jdGlvbihwcm9wTmFtZSkge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFwcHMsIGlzU3BhY2VBZG1pbiwgcHNldEJhc2UsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0N1c3RvbWVyLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1VzZXIsIHJlZiwgcmVmMSwgc3BhY2VVc2VyLCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhcHBzID0gW107XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmLnByb2ZpbGUgOiB2b2lkIDA7XG4gICAgICBwc2V0QmFzZSA9IHBzZXRzVXNlcjtcbiAgICAgIGlmICh1c2VyUHJvZmlsZSkge1xuICAgICAgICBpZiAodXNlclByb2ZpbGUgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXI7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlclByb2ZpbGUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwc2V0QmFzZSAhPSBudWxsID8gKHJlZjEgPSBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgYXBwcyA9IF8udW5pb24oYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBfLmVhY2gocHNldHMsIGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgaWYgKCFwc2V0LmFzc2lnbmVkX2FwcHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBzZXQubmFtZSA9PT0gXCJhZG1pblwiIHx8IHBzZXQubmFtZSA9PT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXBwcyA9IF8udW5pb24oYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksIHZvaWQgMCwgbnVsbCk7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYWJvdXRNZW51LCBhZG1pbk1lbnVzLCBhbGxNZW51cywgY3VycmVudFBzZXROYW1lcywgaXNTcGFjZUFkbWluLCBtZW51cywgb3RoZXJNZW51QXBwcywgb3RoZXJNZW51cywgcHNldHMsIHJlZiwgcmVmMSwgcmVzdWx0LCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFkbWluTWVudXMgPSAocmVmID0gQ3JlYXRvci5BcHBzLmFkbWluKSAhPSBudWxsID8gcmVmLmFkbWluX21lbnVzIDogdm9pZCAwO1xuICAgIGlmICghYWRtaW5NZW51cykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkID09PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgIT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgb3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5KF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmFkbWluX21lbnVzICYmIG4uX2lkICE9PSAnYWRtaW4nO1xuICAgIH0pLCAnc29ydCcpO1xuICAgIG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKTtcbiAgICBhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJlc3VsdCA9IGFsbE1lbnVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9ICgocmVmMSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYxLnByb2ZpbGUgOiB2b2lkIDApIHx8ICd1c2VyJztcbiAgICAgIGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5uYW1lO1xuICAgICAgfSk7XG4gICAgICBtZW51cyA9IGFsbE1lbnVzLmZpbHRlcihmdW5jdGlvbihtZW51KSB7XG4gICAgICAgIHZhciBwc2V0c01lbnU7XG4gICAgICAgIHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzO1xuICAgICAgICBpZiAocHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoO1xuICAgICAgfSk7XG4gICAgICByZXN1bHQgPSBtZW51cztcbiAgICB9XG4gICAgcmV0dXJuIF8uc29ydEJ5KHJlc3VsdCwgXCJzb3J0XCIpO1xuICB9O1xuICBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmluZChwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZFxuICAgIH0pO1xuICB9O1xuICBmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcihwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICRpbjogcGVybWlzc2lvbl9zZXRfaWRzXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgfTtcbiAgdW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IGZ1bmN0aW9uKHBvcywgb2JqZWN0LCBwc2V0cykge1xuICAgIHZhciByZXN1bHQ7XG4gICAgcmVzdWx0ID0gW107XG4gICAgXy5lYWNoKG9iamVjdC5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24ob3BzLCBvcHNfa2V5KSB7XG4gICAgICB2YXIgY3VycmVudFBzZXQsIHRlbXBPcHM7XG4gICAgICBpZiAoW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDApIHtcbiAgICAgICAgY3VycmVudFBzZXQgPSBwc2V0cy5maW5kKGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgICByZXR1cm4gcHNldC5uYW1lID09PSBvcHNfa2V5O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGN1cnJlbnRQc2V0KSB7XG4gICAgICAgICAgdGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fTtcbiAgICAgICAgICB0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkO1xuICAgICAgICAgIHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWU7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHRlbXBPcHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcbiAgICAgIHBvcy5mb3JFYWNoKGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHZhciByZXBlYXRJbmRleCwgcmVwZWF0UG87XG4gICAgICAgIHJlcGVhdEluZGV4ID0gMDtcbiAgICAgICAgcmVwZWF0UG8gPSByZXN1bHQuZmluZChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgIHJlcGVhdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT09IHBvLnBlcm1pc3Npb25fc2V0X2lkO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlcGVhdFBvKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2gocG8pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwb3M7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBpc1NwYWNlQWRtaW4sIG9iamVjdCwgb3BzZXRBZG1pbiwgb3BzZXRDdXN0b21lciwgb3BzZXRHdWVzdCwgb3BzZXRNZW1iZXIsIG9wc2V0U3VwcGxpZXIsIG9wc2V0VXNlciwgcGVybWlzc2lvbnMsIHBvcywgcG9zQWRtaW4sIHBvc0N1c3RvbWVyLCBwb3NHdWVzdCwgcG9zTWVtYmVyLCBwb3NTdXBwbGllciwgcG9zVXNlciwgcHJvZiwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHt9O1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgICBpZiAoc3BhY2VJZCA9PT0gJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgfHwgdGhpcy5wc2V0c0FkbWluID8gdGhpcy5wc2V0c0FkbWluIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIHx8IHRoaXMucHNldHNVc2VyID8gdGhpcy5wc2V0c1VzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzTWVtYmVyID0gXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgfHwgdGhpcy5wc2V0c01lbWJlciA/IHRoaXMucHNldHNNZW1iZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNHdWVzdCA9IF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgfHwgdGhpcy5wc2V0c0d1ZXN0ID8gdGhpcy5wc2V0c0d1ZXN0IDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgfHwgdGhpcy5wc2V0c1N1cHBsaWVyID8gdGhpcy5wc2V0c1N1cHBsaWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgfHwgdGhpcy5wc2V0c0N1c3RvbWVyID8gdGhpcy5wc2V0c0N1c3RvbWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudDtcbiAgICBpZiAoIXBzZXRzKSB7XG4gICAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zO1xuICAgIHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3M7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3M7XG4gICAgcHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3BvcztcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3M7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3BvcztcbiAgICBvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9O1xuICAgIG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9O1xuICAgIG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fTtcbiAgICBvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgIG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge307XG4gICAgb3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fTtcbiAgICBpZiAocHNldHNBZG1pbikge1xuICAgICAgcG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0QWRtaW4sIHBvc0FkbWluKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlcikge1xuICAgICAgcG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0VXNlciwgcG9zVXNlcik7XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlcikge1xuICAgICAgcG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0TWVtYmVyLCBwb3NNZW1iZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCkge1xuICAgICAgcG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0R3Vlc3QsIHBvc0d1ZXN0KTtcbiAgICB9XG4gICAgaWYgKHBzZXRzU3VwcGxpZXIpIHtcbiAgICAgIHBvc1N1cHBsaWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1N1cHBsaWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzU3VwcGxpZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldFN1cHBsaWVyLCBwb3NTdXBwbGllcik7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyKSB7XG4gICAgICBwb3NDdXN0b21lciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXN0b21lcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0N1c3RvbWVyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRDdXN0b21lciwgcG9zQ3VzdG9tZXIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzcGFjZUlkID09PSAnY29tbW9uJykge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYWNlVXNlciA9IF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSB8fCB0aGlzLnNwYWNlVXNlciA/IHRoaXMuc3BhY2VVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHNwYWNlVXNlcikge1xuICAgICAgICAgICAgcHJvZiA9IHNwYWNlVXNlci5wcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2YpIHtcbiAgICAgICAgICAgICAgaWYgKHByb2YgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdtZW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldE1lbWJlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnZ3Vlc3QnKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzLCBcIl9pZFwiKTtcbiAgICAgIHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpO1xuICAgICAgcG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpO1xuICAgICAgXy5lYWNoKHBvcywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgaWYgKHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLmlzRW1wdHkocGVybWlzc2lvbnMpKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBwbztcbiAgICAgICAgfVxuICAgICAgICBvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMocGVybWlzc2lvbnMsIHBvKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpO1xuICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCBwby51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9iamVjdC5pc192aWV3KSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXTtcbiAgICB9XG4gICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgIGlmIChvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXIpIHtcbiAgICAgIHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyO1xuICAgIH1cbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICBcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKVxuXG5NZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1Jcblx0b3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1Jcblx0aWYgY3JlYXRvcl9kYl91cmxcblx0XHRpZiAhb3Bsb2dfdXJsXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIilcblx0XHRDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7X2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtvcGxvZ1VybDogb3Bsb2dfdXJsfSl9XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSAob2JqZWN0KS0+XG4jXHRpZiBvYmplY3QudGFibGVfbmFtZSAmJiBvYmplY3QudGFibGVfbmFtZS5lbmRzV2l0aChcIl9fY1wiKVxuI1x0XHRyZXR1cm4gb2JqZWN0LnRhYmxlX25hbWVcbiNcdGVsc2VcbiNcdFx0cmV0dXJuIG9iamVjdC5uYW1lXG5cdHJldHVybiBvYmplY3QubmFtZVxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gKG9iamVjdCktPlxuXHRjb2xsZWN0aW9uX2tleSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqZWN0KVxuXHRpZiBkYltjb2xsZWN0aW9uX2tleV1cblx0XHRyZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldXG5cdGVsc2UgaWYgb2JqZWN0LmRiXG5cdFx0cmV0dXJuIG9iamVjdC5kYlxuXG5cdGlmIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXG5cdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXG5cdGVsc2Vcblx0XHRpZiBvYmplY3QuY3VzdG9tXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKVxuXHRcdGVsc2Vcblx0XHRcdGlmIGNvbGxlY3Rpb25fa2V5ID09ICdfc21zX3F1ZXVlJyAmJiBTTVNRdWV1ZT8uY29sbGVjdGlvblxuXHRcdFx0XHRyZXR1cm4gU01TUXVldWUuY29sbGVjdGlvblxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpXG5cblxuIiwidmFyIHN0ZWVkb3NDb3JlO1xuXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdG9yX2RiX3VybCwgb3Bsb2dfdXJsO1xuICBjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SO1xuICBvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUjtcbiAgaWYgKGNyZWF0b3JfZGJfdXJsKSB7XG4gICAgaWYgKCFvcGxvZ191cmwpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtcbiAgICAgIF9kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7XG4gICAgICAgIG9wbG9nVXJsOiBvcGxvZ191cmxcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxufSk7XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBjb2xsZWN0aW9uX2tleTtcbiAgY29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdCk7XG4gIGlmIChkYltjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2UgaWYgKG9iamVjdC5kYikge1xuICAgIHJldHVybiBvYmplY3QuZGI7XG4gIH1cbiAgaWYgKENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3QuY3VzdG9tKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbGxlY3Rpb25fa2V5ID09PSAnX3Ntc19xdWV1ZScgJiYgKHR5cGVvZiBTTVNRdWV1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTTVNRdWV1ZSAhPT0gbnVsbCA/IFNNU1F1ZXVlLmNvbGxlY3Rpb24gOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpO1xuICAgIH1cbiAgfVxufTtcbiIsIkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9XG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRzdGVlZG9zRmlsdGVycyA9IHJlcXVpcmUoXCJAc3RlZWRvcy9maWx0ZXJzXCIpO1xuXHQjIOWumuS5ieWFqOWxgCBhY3Rpb25zIOWHveaVsFx0XG5cdENyZWF0b3IuYWN0aW9ucyA9IChhY3Rpb25zKS0+XG5cdFx0Xy5lYWNoIGFjdGlvbnMsICh0b2RvLCBhY3Rpb25fbmFtZSktPlxuXHRcdFx0Q3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbl9uYW1lXSA9IHRvZG8gXG5cblx0Q3JlYXRvci5leGVjdXRlQWN0aW9uID0gKG9iamVjdF9uYW1lLCBhY3Rpb24sIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50LCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbGJhY2spLT5cblx0XHRpZiBhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT0gJ3dvcmQtcHJpbnQnXG5cdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0ZmlsdGVycyA9IFsnX2lkJywgJz0nLCByZWNvcmRfaWRdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZpbHRlcnMgPSBPYmplY3RHcmlkLmdldEZpbHRlcnMob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZmFsc2UsIG51bGwsIG51bGwpXG5cdFx0XHR1cmwgPSBcIi9hcGkvdjQvd29yZF90ZW1wbGF0ZXMvXCIgKyBhY3Rpb24ud29yZF90ZW1wbGF0ZSArIFwiL3ByaW50XCIgKyBcIj9maWx0ZXJzPVwiICsgc3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvT0RhdGFRdWVyeShmaWx0ZXJzKTtcblx0XHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcblx0XHRcdHJldHVybiB3aW5kb3cub3Blbih1cmwpO1xuXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgYWN0aW9uPy50b2RvXG5cdFx0XHRpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJzdHJpbmdcIlxuXHRcdFx0XHR0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXVxuXHRcdFx0ZWxzZSBpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdHRvZG8gPSBhY3Rpb24udG9kb1x0XG5cdFx0XHRpZiAhcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxuXHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0aWYgdG9kb1xuXHRcdFx0XHQjIGl0ZW1fZWxlbWVudOS4uuepuuaXtuW6lOivpeiuvue9rum7mOiupOWAvO+8iOWvueixoeeahG5hbWXlrZfmrrXvvInvvIzlkKbliJltb3JlQXJnc+aLv+WIsOeahOWQjue7reWPguaVsOS9jee9ruWwseS4jeWvuVxuXHRcdFx0XHRpdGVtX2VsZW1lbnQgPSBpZiBpdGVtX2VsZW1lbnQgdGhlbiBpdGVtX2VsZW1lbnQgZWxzZSBcIlwiXG5cdFx0XHRcdG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxuXHRcdFx0XHR0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpXG5cdFx0XHRcdHRvZG8uYXBwbHkge1xuXHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdHJlY29yZF9pZDogcmVjb3JkX2lkXG5cdFx0XHRcdFx0b2JqZWN0OiBvYmpcblx0XHRcdFx0XHRhY3Rpb246IGFjdGlvblxuXHRcdFx0XHRcdGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50XG5cdFx0XHRcdFx0cmVjb3JkOiByZWNvcmRcblx0XHRcdFx0fSwgdG9kb0FyZ3Ncblx0XHRcdGVsc2Vcblx0XHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXG5cdFx0ZWxzZVxuXHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXG5cblxuXHRfZGVsZXRlUmVjb3JkID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaywgY2FsbF9iYWNrX2Vycm9yKS0+XG5cdFx0IyBjb25zb2xlLmxvZyhcIj09PV9kZWxldGVSZWNvcmQ9PT1cIiwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpO1xuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdHByZXZpb3VzRG9jID0gRm9ybU1hbmFnZXIuZ2V0UHJldmlvdXNEb2Mob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgJ2RlbGV0ZScpXG5cdFx0Q3JlYXRvci5vZGF0YS5kZWxldGUgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgKCktPlxuXHRcdFx0aWYgcmVjb3JkX3RpdGxlXG5cdFx0XHRcdCMgaW5mbyA9IG9iamVjdC5sYWJlbCArIFwiXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIiArIFwi5bey5Yig6ZmkXCJcblx0XHRcdFx0aW5mbyA9dCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5mbyA9IHQoJ2NyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3N1YycpXG5cdFx0XHR0b2FzdHIuc3VjY2VzcyBpbmZvXG5cdFx0XHRpZiBjYWxsX2JhY2sgYW5kIHR5cGVvZiBjYWxsX2JhY2sgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdGNhbGxfYmFjaygpXG5cblx0XHRcdEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYWZ0ZXInLCB7X2lkOiByZWNvcmRfaWQsIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY30pXG5cdFx0LCAoZXJyb3IpLT5cblx0XHRcdGlmIGNhbGxfYmFja19lcnJvciBhbmQgdHlwZW9mIGNhbGxfYmFja19lcnJvciA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0Y2FsbF9iYWNrX2Vycm9yKClcblx0XHRcdEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7X2lkOiByZWNvcmRfaWQsIGVycm9yOiBlcnJvcn0pXG5cblx0Q3JlYXRvci5hY3Rpb25zIFxuXHRcdCMg5Zyo5q2k5a6a5LmJ5YWo5bGAIGFjdGlvbnNcblx0XHRcInN0YW5kYXJkX3F1ZXJ5XCI6ICgpLT5cblx0XHRcdE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKVxuXG5cdFx0XCJzdGFuZGFyZF9uZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0I1RPRE8g5L2/55So5a+56LGh54mI5pys5Yik5patXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG5cdFx0XHRpbml0aWFsVmFsdWVzPXt9XG5cdFx0XHRzZWxlY3RlZFJvd3MgPSB3aW5kb3cuZ3JpZFJlZj8uY3VycmVudD8uYXBpPy5nZXRTZWxlY3RlZFJvd3MoKVx0XG5cdFx0XHRpZiBzZWxlY3RlZFJvd3M/Lmxlbmd0aFxuXHRcdFx0XHRyZWNvcmRfaWQgPSBzZWxlY3RlZFJvd3NbMF0uX2lkO1xuXHRcdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0XHRpbml0aWFsVmFsdWVzID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbml0aWFsVmFsdWVzID0gRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSlcblxuXHRcdFx0aWYgb2JqZWN0Py52ZXJzaW9uID49IDJcblx0XHRcdFx0cmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuXHRcdFx0XHRcdG5hbWU6IFwiI3tvYmplY3RfbmFtZX1fc3RhbmRhcmRfbmV3X2Zvcm1cIixcblx0XHRcdFx0XHRvYmplY3RBcGlOYW1lOiBvYmplY3RfbmFtZSxcblx0XHRcdFx0XHR0aXRsZTogJ+aWsOW7uiAnICsgb2JqZWN0LmxhYmVsLFxuXHRcdFx0XHRcdGluaXRpYWxWYWx1ZXM6IGluaXRpYWxWYWx1ZXMsXG5cdFx0XHRcdFx0YWZ0ZXJJbnNlcnQ6IChyZXN1bHQpLT5cblx0XHRcdFx0XHRcdGlmKHJlc3VsdC5sZW5ndGggPiAwKVxuXHRcdFx0XHRcdFx0XHRyZWNvcmQgPSByZXN1bHRbMF07XG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCktPlxuXHRcdFx0XHRcdFx0XHRcdGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0dXJsID0gXCIvYXBwLyN7YXBwX2lkfS8je29iamVjdF9uYW1lfS92aWV3LyN7cmVjb3JkLl9pZH1cIlxuXHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIuZ28gdXJsXG5cdFx0XHRcdFx0XHRcdCwgMSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHRcdH0sIG51bGwsIHtpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnfSlcblx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxuXHRcdFx0aWYgc2VsZWN0ZWRSb3dzPy5sZW5ndGhcblx0XHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cblx0XHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXHRcdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXG5cdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0XHQkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKClcblx0XHRcdHJldHVybiBcblxuXHRcdFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0Rmxvd1JvdXRlci5yZWRpcmVjdChocmVmKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcInN0YW5kYXJkX2VkaXRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcblx0XHRcdFx0aWYgb2JqZWN0Py52ZXJzaW9uID49IDJcblx0XHRcdFx0XHRyZXR1cm4gU3RlZWRvc1VJLnNob3dNb2RhbChzdG9yZXMuQ29tcG9uZW50UmVnaXN0cnkuY29tcG9uZW50cy5PYmplY3RGb3JtLCB7XG5cdFx0XHRcdFx0XHRuYW1lOiBcIiN7b2JqZWN0X25hbWV9X3N0YW5kYXJkX2VkaXRfZm9ybVwiLFxuXHRcdFx0XHRcdFx0b2JqZWN0QXBpTmFtZTogb2JqZWN0X25hbWUsXG5cdFx0XHRcdFx0XHRyZWNvcmRJZDogcmVjb3JkX2lkLFxuXHRcdFx0XHRcdFx0dGl0bGU6ICfnvJbovpEgJyArIG9iamVjdC5sYWJlbCxcblx0XHRcdFx0XHRcdGFmdGVyVXBkYXRlOiAoKS0+XG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCktPlxuXHRcdFx0XHRcdFx0XHRcdGlmIEZsb3dSb3V0ZXIuY3VycmVudCgpLnJvdXRlLnBhdGguZW5kc1dpdGgoXCIvOnJlY29yZF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKVxuXHRcdFx0XHRcdFx0XHRcdFx0IyBPYmplY3RGb3Jt5pyJ57yT5a2Y77yM5L+u5pS55a2Q6KGo6K6w5b2V5Y+v6IO95Lya5pyJ5Li76KGo6K6w5b2V55qE5rGH5oC75a2X5q615Y+Y5pu077yM6ZyA6KaB5Yi35paw6KGo5Y2V5pWw5o2uXG5cdFx0XHRcdFx0XHRcdFx0XHRTdGVlZG9zVUkucmVsb2FkUmVjb3JkKFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIiksIFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5yZWZyZXNoRHhTY2hlZHVsZXJJbnN0YW5jZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVmcmVzaEdyaWQoKTtcblx0XHRcdFx0XHRcdFx0LCAxKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSwgbnVsbCwge2ljb25QYXRoOiAnL2Fzc2V0cy9pY29ucyd9KVxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2VcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcbiNcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgcmVjb3JkXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdyZWxvYWRfZHhsaXN0JywgZmFsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdFx0XHQkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcblxuXHRcdFwic3RhbmRhcmRfZGVsZXRlXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spLT5cblx0XHRcdCMgY29uc29sZS5sb2coXCI9PT1zdGFuZGFyZF9kZWxldGU9PT1cIiwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKTtcblx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7X2lkOiByZWNvcmRfaWR9KVxuXHRcdFx0XHRpZiAhYmVmb3JlSG9va1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdFx0bmFtZUZpZWxkID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZIHx8IFwibmFtZVwiXG5cblx0XHRcdHVubGVzcyBsaXN0X3ZpZXdfaWRcblx0XHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0XHRcdHVubGVzcyBsaXN0X3ZpZXdfaWRcblx0XHRcdFx0bGlzdF92aWV3X2lkID0gXCJhbGxcIlxuXG5cdFx0XHRpZighXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIHJlY29yZF90aXRsZSlcblx0XHRcdFx0cmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlW25hbWVGaWVsZF1cblx0XHRcdFxuXHRcdFx0aWYgcmVjb3JkICYmICFyZWNvcmRfdGl0bGVcblx0XHRcdFx0cmVjb3JkX3RpdGxlID0gcmVjb3JkW25hbWVGaWVsZF1cblx0XHRcdFxuXHRcdFx0aTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZVwiXG5cdFx0XHRpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiXG5cblx0XHRcdHVubGVzcyByZWNvcmRfaWRcblx0XHRcdFx0aTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RpdGxlXCJcblx0XHRcdFx0aTE4blRleHRLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X3N3YWxfdGV4dFwiXG5cblx0XHRcdFx0IyDlpoLmnpzmmK/mibnph4/liKDpmaTvvIzliJnkvKDlhaXnmoRsaXN0X3ZpZXdfaWTkuLrliJfooajop4blm77nmoRuYW1l77yM55So5LqO6I635Y+W5YiX6KGo6YCJ5Lit6aG5XG5cdFx0XHRcdCMg5Li75YiX6KGo6KeE5YiZ5pivXCJsaXN0dmlld18je29iamVjdF9uYW1lfV8je2xpc3Rfdmlld19pZH1cIu+8jOebuOWFs+ihqOinhOWImeaYr1wicmVsYXRlZF9saXN0dmlld18je29iamVjdF9uYW1lfV8je3JlbGF0ZWRfb2JqZWN0X25hbWV9XyN7cmVsYXRlZF9maWVsZF9uYW1lfVwiXG5cdFx0XHRcdHNlbGVjdGVkUmVjb3JkcyA9IFN0ZWVkb3NVSS5nZXRUYWJsZVNlbGVjdGVkUm93cyhsaXN0X3ZpZXdfaWQpXG5cdFx0XHRcdGlmICFzZWxlY3RlZFJlY29yZHMgfHwgIXNlbGVjdGVkUmVjb3Jkcy5sZW5ndGhcblx0XHRcdFx0XHR0b2FzdHIud2FybmluZyh0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfbm9fc2VsZWN0aW9uXCIpKVxuXHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRpZiByZWNvcmRfdGl0bGVcblx0XHRcdFx0dGV4dCA9IHQgaTE4blRleHRLZXksIFwiI3tvYmplY3QubGFiZWx9IFxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGV4dCA9IHQgaTE4blRleHRLZXksIFwiI3tvYmplY3QubGFiZWx9XCJcblx0XHRcdHN3YWxcblx0XHRcdFx0dGl0bGU6IHQgaTE4blRpdGxlS2V5LCBcIiN7b2JqZWN0LmxhYmVsfVwiXG5cdFx0XHRcdHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+I3t0ZXh0fTwvZGl2PlwiXG5cdFx0XHRcdGh0bWw6IHRydWVcblx0XHRcdFx0c2hvd0NhbmNlbEJ1dHRvbjp0cnVlXG5cdFx0XHRcdGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKVxuXHRcdFx0XHRjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuXHRcdFx0XHQob3B0aW9uKSAtPlxuXHRcdFx0XHRcdGlmIG9wdGlvblxuXHRcdFx0XHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdFx0XHRcdCMg5Y2V5p2h6K6w5b2V5Yig6ZmkXG5cdFx0XHRcdFx0XHRcdF9kZWxldGVSZWNvcmQgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgKCktPlxuXHRcdFx0XHRcdFx0XHRcdCMg5paH5Lu254mI5pys5Li6XCJjZnMuZmlsZXMuZmlsZXJlY29yZFwi77yM6ZyA6KaB5pu/5o2i5Li6XCJjZnMtZmlsZXMtZmlsZXJlY29yZFwiXG5cdFx0XHRcdFx0XHRcdFx0Z3JpZE9iamVjdE5hbWVDbGFzcyA9IG9iamVjdF9uYW1lLnJlcGxhY2UoL1xcLi9nLFwiLVwiKVxuXHRcdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxuXHRcdFx0XHRcdFx0XHRcdHVubGVzcyBncmlkQ29udGFpbmVyPy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRcdGlmIHdpbmRvdy5vcGVuZXJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNPcGVuZXJSZW1vdmUgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxuXHRcdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdFx0IyBPYmplY3RGb3Jt5pyJ57yT5a2Y77yM5Yig6Zmk5a2Q6KGo6K6w5b2V5Y+v6IO95Lya5pyJ5rGH5oC75a2X5q6177yM6ZyA6KaB5Yi35paw6KGo5Y2V5pWw5o2uXG5cdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50X29iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkudmVyc2lvbiA+IDFcblx0XHRcdFx0XHRcdFx0XHRcdFx0U3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZClcblx0XHRcdFx0XHRcdFx0XHRcdGlmIEZsb3dSb3V0ZXIuY3VycmVudCgpLnJvdXRlLnBhdGguZW5kc1dpdGgoXCIvOnJlY29yZF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RfbmFtZSAhPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LnJlZnJlc2hHcmlkKCk7XG5cdFx0XHRcdFx0XHRcdFx0Y2F0Y2ggX2Vcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoX2UpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIGdyaWRDb250YWluZXI/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJylcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKVxuXHRcdFx0XHRcdFx0XHRcdGlmIGR4RGF0YUdyaWRJbnN0YW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0X25hbWUgIT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRUZW1wbGF0ZS5jcmVhdG9yX2dyaWQucmVmcmVzaChkeERhdGFHcmlkSW5zdGFuY2UpXG5cdFx0XHRcdFx0XHRcdFx0cmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdFx0XHRcdFx0XHR0ZW1wTmF2UmVtb3ZlZCA9IENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCkgI+aXoOiuuuaYr+WcqOiusOW9leivpue7hueVjOmdoui/mOaYr+WIl+ihqOeVjOmdouaJp+ihjOWIoOmZpOaTjeS9nO+8jOmDveS8muaKiuS4tOaXtuWvvOiIquWIoOmZpOaOiVxuXHRcdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlIG9yICFkeERhdGFHcmlkSW5zdGFuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5jbG9zZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIHJlY29yZF9pZCA9PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSBhbmQgbGlzdF92aWV3X2lkICE9ICdjYWxlbmRhcidcblx0XHRcdFx0XHRcdFx0XHRcdFx0YXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgdGVtcE5hdlJlbW92ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOehruWunuWIoOmZpOS6huS4tOaXtuWvvOiIqu+8jOWwseWPr+iDveW3sue7j+mHjeWumuWQkeWIsOS4iuS4gOS4qumhtemdouS6hu+8jOayoeW/heimgeWGjemHjeWumuWQkeS4gOasoVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIuZ28gXCIvYXBwLyN7YXBwaWR9LyN7b2JqZWN0X25hbWV9L2dyaWQvI3tsaXN0X3ZpZXdfaWR9XCJcblx0XHRcdFx0XHRcdFx0XHRpZiBjYWxsX2JhY2sgYW5kIHR5cGVvZiBjYWxsX2JhY2sgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0XHRcdFx0XHRjYWxsX2JhY2soKVx0XHRcdFxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHQjIOaJuemHj+WIoOmZpFxuXHRcdFx0XHRcdFx0XHRpZiBzZWxlY3RlZFJlY29yZHMgJiYgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwibG9hZGluZ1wiKVxuXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZUNvdW50ZXIgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdGFmdGVyQmF0Y2hlc0RlbGV0ZSA9ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdGRlbGV0ZUNvdW50ZXIrK1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgZGVsZXRlQ291bnRlciA+PSBzZWxlY3RlZFJlY29yZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMgY29uc29sZS5sb2coXCJkZWxldGVDb3VudGVyLCBzZWxlY3RlZFJlY29yZHMubGVuZ3RoPT09XCIsIGRlbGV0ZUNvdW50ZXIsIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImxvYWRpbmdcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LnJlZnJlc2hHcmlkKCk7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZWN0ZWRSZWNvcmRzLmZvckVhY2ggKHJlY29yZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2lkID0gcmVjb3JkLl9pZFxuXHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge19pZDogcmVjb3JkX2lkfSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmICFiZWZvcmVIb29rXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFmdGVyQmF0Y2hlc0RlbGV0ZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZFRpdGxlID0gcmVjb3JkW25hbWVGaWVsZF0gfHwgcmVjb3JkX2lkXG5cdFx0XHRcdFx0XHRcdFx0XHRfZGVsZXRlUmVjb3JkIG9iamVjdF9uYW1lLCByZWNvcmQuX2lkLCByZWNvcmRUaXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsICgoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCkgI+aXoOiuuuaYr+WcqOiusOW9leivpue7hueVjOmdoui/mOaYr+WIl+ihqOeVjOmdouaJp+ihjOWIoOmZpOaTjeS9nO+8jOmDveS8muaKiuS4tOaXtuWvvOiIquWIoOmZpOaOiVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKVxuXHRcdFx0XHRcdFx0XHRcdFx0KSwgKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKSIsInZhciBfZGVsZXRlUmVjb3JkLCBzdGVlZG9zRmlsdGVycztcblxuQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgc3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsYmFjaykge1xuICAgIHZhciBmaWx0ZXJzLCBtb3JlQXJncywgb2JqLCB0b2RvLCB0b2RvQXJncywgdXJsO1xuICAgIGlmIChhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT09ICd3b3JkLXByaW50Jykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBmaWx0ZXJzID0gWydfaWQnLCAnPScsIHJlY29yZF9pZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWx0ZXJzID0gT2JqZWN0R3JpZC5nZXRGaWx0ZXJzKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGZhbHNlLCBudWxsLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIHVybCA9IFwiL2FwaS92NC93b3JkX3RlbXBsYXRlcy9cIiArIGFjdGlvbi53b3JkX3RlbXBsYXRlICsgXCIvcHJpbnRcIiArIFwiP2ZpbHRlcnM9XCIgKyBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5KGZpbHRlcnMpO1xuICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMCkge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9kbyA9IGFjdGlvbi50b2RvO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgaXRlbV9lbGVtZW50ID0gaXRlbV9lbGVtZW50ID8gaXRlbV9lbGVtZW50IDogXCJcIjtcbiAgICAgICAgbW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuICAgICAgICB0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpO1xuICAgICAgICByZXR1cm4gdG9kby5hcHBseSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdDogb2JqLFxuICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgIGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50LFxuICAgICAgICAgIHJlY29yZDogcmVjb3JkXG4gICAgICAgIH0sIHRvZG9BcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgfVxuICB9O1xuICBfZGVsZXRlUmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpIHtcbiAgICB2YXIgb2JqZWN0LCBwcmV2aW91c0RvYztcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgcHJldmlvdXNEb2MgPSBGb3JtTWFuYWdlci5nZXRQcmV2aW91c0RvYyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAnZGVsZXRlJyk7XG4gICAgcmV0dXJuIENyZWF0b3Iub2RhdGFbXCJkZWxldGVcIl0ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5mbztcbiAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgaW5mbyA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgKFwiXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKTtcbiAgICAgIH1cbiAgICAgIHRvYXN0ci5zdWNjZXNzKGluZm8pO1xuICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbF9iYWNrKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtcbiAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY1xuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGlmIChjYWxsX2JhY2tfZXJyb3IgJiYgdHlwZW9mIGNhbGxfYmFja19lcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxfYmFja19lcnJvcigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7XG4gICAgICAgIF9pZDogcmVjb3JkX2lkLFxuICAgICAgICBlcnJvcjogZXJyb3JcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmFjdGlvbnMoe1xuICAgIFwic3RhbmRhcmRfcXVlcnlcIjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9uZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgaW5pdGlhbFZhbHVlcywgb2JqZWN0LCByZWYsIHJlZjEsIHJlZjIsIHNlbGVjdGVkUm93cztcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgIHNlbGVjdGVkUm93cyA9IChyZWYgPSB3aW5kb3cuZ3JpZFJlZikgIT0gbnVsbCA/IChyZWYxID0gcmVmLmN1cnJlbnQpICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYXBpKSAhPSBudWxsID8gcmVmMi5nZXRTZWxlY3RlZFJvd3MoKSA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChzZWxlY3RlZFJvd3MgIT0gbnVsbCA/IHNlbGVjdGVkUm93cy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgcmVjb3JkX2lkID0gc2VsZWN0ZWRSb3dzWzBdLl9pZDtcbiAgICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICAgIGluaXRpYWxWYWx1ZXMgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IEZvcm1NYW5hZ2VyLmdldEluaXRpYWxWYWx1ZXMob2JqZWN0X25hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC52ZXJzaW9uIDogdm9pZCAwKSA+PSAyKSB7XG4gICAgICAgIHJldHVybiBTdGVlZG9zVUkuc2hvd01vZGFsKHN0b3Jlcy5Db21wb25lbnRSZWdpc3RyeS5jb21wb25lbnRzLk9iamVjdEZvcm0sIHtcbiAgICAgICAgICBuYW1lOiBvYmplY3RfbmFtZSArIFwiX3N0YW5kYXJkX25ld19mb3JtXCIsXG4gICAgICAgICAgb2JqZWN0QXBpTmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgICAgdGl0bGU6ICfmlrDlu7ogJyArIG9iamVjdC5sYWJlbCxcbiAgICAgICAgICBpbml0aWFsVmFsdWVzOiBpbml0aWFsVmFsdWVzLFxuICAgICAgICAgIGFmdGVySW5zZXJ0OiBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIHZhciByZWNvcmQ7XG4gICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgcmVjb3JkID0gcmVzdWx0WzBdO1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBhcHBfaWQsIHVybDtcbiAgICAgICAgICAgICAgICBhcHBfaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgICAgICAgICAgICAgICB1cmwgPSBcIi9hcHAvXCIgKyBhcHBfaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvdmlldy9cIiArIHJlY29yZC5faWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZsb3dSb3V0ZXIuZ28odXJsKTtcbiAgICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgbnVsbCwge1xuICAgICAgICAgIGljb25QYXRoOiAnL2Fzc2V0cy9pY29ucydcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKHNlbGVjdGVkUm93cyAhPSBudWxsID8gc2VsZWN0ZWRSb3dzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICB9XG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBGbG93Um91dGVyLnJlZGlyZWN0KGhyZWYpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9lZGl0XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIGlmIChyZWNvcmRfaWQpIHtcbiAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgICBpZiAoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0LnZlcnNpb24gOiB2b2lkIDApID49IDIpIHtcbiAgICAgICAgICByZXR1cm4gU3RlZWRvc1VJLnNob3dNb2RhbChzdG9yZXMuQ29tcG9uZW50UmVnaXN0cnkuY29tcG9uZW50cy5PYmplY3RGb3JtLCB7XG4gICAgICAgICAgICBuYW1lOiBvYmplY3RfbmFtZSArIFwiX3N0YW5kYXJkX2VkaXRfZm9ybVwiLFxuICAgICAgICAgICAgb2JqZWN0QXBpTmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgICAgICByZWNvcmRJZDogcmVjb3JkX2lkLFxuICAgICAgICAgICAgdGl0bGU6ICfnvJbovpEgJyArIG9iamVjdC5sYWJlbCxcbiAgICAgICAgICAgIGFmdGVyVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpKSB7XG4gICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFN0ZWVkb3NVSS5yZWxvYWRSZWNvcmQoU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSwgU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cucmVmcmVzaER4U2NoZWR1bGVySW5zdGFuY2UoKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cucmVmcmVzaEdyaWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBudWxsLCB7XG4gICAgICAgICAgICBpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBmYWxzZSkge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLWVkaXQtcmVjb3JkXCIpLmNsaWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgICByZXR1cm4gTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gJChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwic3RhbmRhcmRfZGVsZXRlXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaykge1xuICAgICAgdmFyIGJlZm9yZUhvb2ssIGkxOG5UZXh0S2V5LCBpMThuVGl0bGVLZXksIG5hbWVGaWVsZCwgb2JqZWN0LCBzZWxlY3RlZFJlY29yZHMsIHRleHQ7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtcbiAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFiZWZvcmVIb29rKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBuYW1lRmllbGQgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVkgfHwgXCJuYW1lXCI7XG4gICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICAgIH1cbiAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgIGxpc3Rfdmlld19pZCA9IFwiYWxsXCI7XG4gICAgICB9XG4gICAgICBpZiAoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiByZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgcmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlW25hbWVGaWVsZF07XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkICYmICFyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgcmVjb3JkX3RpdGxlID0gcmVjb3JkW25hbWVGaWVsZF07XG4gICAgICB9XG4gICAgICBpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCI7XG4gICAgICBpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiO1xuICAgICAgaWYgKCFyZWNvcmRfaWQpIHtcbiAgICAgICAgaTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RpdGxlXCI7XG4gICAgICAgIGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RleHRcIjtcbiAgICAgICAgc2VsZWN0ZWRSZWNvcmRzID0gU3RlZWRvc1VJLmdldFRhYmxlU2VsZWN0ZWRSb3dzKGxpc3Rfdmlld19pZCk7XG4gICAgICAgIGlmICghc2VsZWN0ZWRSZWNvcmRzIHx8ICFzZWxlY3RlZFJlY29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgdG9hc3RyLndhcm5pbmcodChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X25vX3NlbGVjdGlvblwiKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHRleHQgPSB0KGkxOG5UZXh0S2V5LCBvYmplY3QubGFiZWwgKyBcIiBcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gdChpMThuVGV4dEtleSwgXCJcIiArIG9iamVjdC5sYWJlbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3dhbCh7XG4gICAgICAgIHRpdGxlOiB0KGkxOG5UaXRsZUtleSwgXCJcIiArIG9iamVjdC5sYWJlbCksXG4gICAgICAgIHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+XCIgKyB0ZXh0ICsgXCI8L2Rpdj5cIixcbiAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpLFxuICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuICAgICAgfSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHZhciBhZnRlckJhdGNoZXNEZWxldGUsIGRlbGV0ZUNvdW50ZXI7XG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgICAgICByZXR1cm4gX2RlbGV0ZVJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIF9lLCBhcHBpZCwgY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIGR4RGF0YUdyaWRJbnN0YW5jZSwgZ3JpZENvbnRhaW5lciwgZ3JpZE9iamVjdE5hbWVDbGFzcywgaXNPcGVuZXJSZW1vdmUsIHJlY29yZFVybCwgdGVtcE5hdlJlbW92ZWQ7XG4gICAgICAgICAgICAgIGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZywgXCItXCIpO1xuICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgIGlmICghKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XG4gICAgICAgICAgICAgICAgICBpc09wZW5lclJlbW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgICAgICAgICAgICAgY3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkudmVyc2lvbiA+IDEpIHtcbiAgICAgICAgICAgICAgICAgIFN0ZWVkb3NVSS5yZWxvYWRSZWNvcmQoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpKSB7XG4gICAgICAgICAgICAgICAgICBpZiAob2JqZWN0X25hbWUgIT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgRmxvd1JvdXRlci5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgd2luZG93LnJlZnJlc2hHcmlkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgICBfZSA9IGVycm9yMTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKF9lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBUZW1wbGF0ZS5jcmVhdG9yX2dyaWQucmVmcmVzaChkeERhdGFHcmlkSW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgICAgICAgdGVtcE5hdlJlbW92ZWQgPSBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpO1xuICAgICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUgfHwgIWR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSkge1xuICAgICAgICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZWNvcmRfaWQgPT09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpICYmIGxpc3Rfdmlld19pZCAhPT0gJ2NhbGVuZGFyJykge1xuICAgICAgICAgICAgICAgICAgYXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgICAgICAgICAgICAgICAgIGlmICghdGVtcE5hdlJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHAvXCIgKyBhcHBpZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbF9iYWNrKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRSZWNvcmRzICYmIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJsb2FkaW5nXCIpO1xuICAgICAgICAgICAgICBkZWxldGVDb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgYWZ0ZXJCYXRjaGVzRGVsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlQ291bnRlcisrO1xuICAgICAgICAgICAgICAgIGlmIChkZWxldGVDb3VudGVyID49IHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwibG9hZGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cucmVmcmVzaEdyaWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHJldHVybiBzZWxlY3RlZFJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVjb3JkVGl0bGU7XG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkID0gcmVjb3JkLl9pZDtcbiAgICAgICAgICAgICAgICBiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICghYmVmb3JlSG9vaykge1xuICAgICAgICAgICAgICAgICAgYWZ0ZXJCYXRjaGVzRGVsZXRlKCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlY29yZFRpdGxlID0gcmVjb3JkW25hbWVGaWVsZF0gfHwgcmVjb3JkX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBfZGVsZXRlUmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmQuX2lkLCByZWNvcmRUaXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHZhciByZWNvcmRVcmw7XG4gICAgICAgICAgICAgICAgICByZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgICAgICAgICAgIENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gYWZ0ZXJCYXRjaGVzRGVsZXRlKCk7XG4gICAgICAgICAgICAgICAgfSksIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyQmF0Y2hlc0RlbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
