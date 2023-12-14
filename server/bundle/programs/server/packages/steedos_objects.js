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
var APIService, MetadataService, config, e, moleculer, objectql, packageLoader, packageService, path, settings, steedosCore;

try {
  if (process.env.CREATOR_NODE_ENV === 'development') {
    steedosCore = require('@steedos/core');
    objectql = require('@steedos/objectql');
    moleculer = require("moleculer");
    packageLoader = require('@steedos/service-meteor-package-loader');
    APIService = require('@steedos/service-api');
    MetadataService = require('@steedos/service-metadata-server');
    packageService = require("@steedos/service-package-registry");
    path = require('path');
    config = objectql.getSteedosConfig();
    settings = {
      built_in_plugins: ["@steedos/standard-space", "@steedos/standard-object-database", "@steedos/standard-process-approval", "@steedos/standard-collaboration", "@steedos/standard-ui", "@steedos/standard-permission", "@steedos/webapp-public", "@steedos/service-cachers-manager", "@steedos/unpkg", "@steedos/workflow", "@steedos/accounts", "@steedos/plugin-company", "@steedos/metadata-api", "@steedos/data-import", "@steedos/service-accounts", "@steedos/service-charts", "@steedos/service-package-registry", "@steedos/service-package-tool", "@steedos/webapp-accounts", "@steedos/service-workflow", "@steedos/service-plugin-amis", "@steedos/service-files", "@steedos/service-sentry", "@steedos/service-identity-jwt"],
      plugins: config.plugins
    };
    Meteor.startup(function () {
      var apiService, broker, ex, metadataService, objectqlService, pageService, projectService, standardObjectsDir, standardObjectsPackageLoaderService, steedosService, uiService;

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
          },
          skipProcessEventRegistration: true,
          created: function (broker) {
            broker.logger.warn('Clear all cache entries on startup.');
            return broker.cacher.clean();
          }
        });
        objectql.broker.init(broker);
        objectqlService = broker.createService(require("@steedos/service-objectql"));
        projectService = broker.createService({
          name: "project-server",
          namespace: "steedos",
          mixins: [packageService]
        });
        metadataService = broker.createService({
          name: 'metadata-server',
          mixins: [MetadataService],
          settings: {}
        });
        uiService = broker.createService(require("@steedos/service-ui"));
        apiService = broker.createService({
          name: "api",
          mixins: [APIService],
          settings: {
            port: null
          }
        });
        pageService = broker.createService({
          name: "@steedos/service-pages",
          mixins: [require('@steedos/service-pages')],
          settings: {
            port: null
          }
        });
        steedosService = broker.createService({
          name: "steedos-server",
          mixins: [],
          settings: {
            port: null
          },
          started: function () {
            return setTimeout(function () {
              broker.emit('steedos-server.started');
            }, 1000);
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
            var connectHandlersExpress, express;

            if (!broker.started) {
              broker._restartService(objectqlService);

              broker._restartService(standardObjectsPackageLoaderService);

              broker._restartService(uiService);
            }

            express = require('express');
            connectHandlersExpress = express();
            connectHandlersExpress.use(require('@steedos/router').staticRouter());
            broker.waitForServices('~packages-@steedos/service-ui').then(function () {
              console.log('waitForServices ~packages-@steedos/service-ui');
              connectHandlersExpress.use(SteedosApi.express());
              return WebApp.connectHandlers.use(connectHandlersExpress);
            });
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
    if (Meteor.isClient) {
      return db[object_name];
    } else {
      return Creator.Collections[((ref = Creator.getObject(object_name, spaceId)) != null ? ref._collection_name : void 0) || object_name];
    }
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
    _.forEach(object.fields, function (field, key) {
      var systemBaseFields;

      if (field.omit) {
        field.hidden = true;
      }

      if (field.required && field.readonly) {
        field.readonly = false;
      }

      systemBaseFields = Creator.getSystemBaseFields();

      if (systemBaseFields.indexOf(key) > -1) {
        return field.readonly = true;
      }
    });

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
          if (_.isString(_visible)) {
            _visible = _visible.trim();
          }

          if (Steedos.isExpression(_visible)) {
            return action.visible = function (object_name, record_id, record_permissions, record) {
              var globalData;
              globalData = Object.assign({}, Creator.USER_CONTEXT, {
                now: new Date()
              });
              return Steedos.parseSingleExpression(_visible, record, "#", globalData);
            };
          } else {
            return action.visible = Creator["eval"]("(" + _visible + ")");
          }
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
  self.hasImportTemplates = options.hasImportTemplates;
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
    self.actions[item_name] = _.extend(copyItem, item);
    return self.actions[item_name].object_name = self.name;
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
    var _object, _ref_obj, _reference_to, autoform_type, collectionName, field_name, fs, fsType, isUnLimited, permissions, ref, ref1;

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
    } else if (field.type === "color") {
      fs.type = String;
      fs.autoform.type = "color";
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
    } else if (field.type === "time") {
      fs.type = Date;

      if (Meteor.isClient) {
        fs.autoform.afFieldInput = {
          type: "dx-date-box",
          timezoneId: "utc",
          dxDateBoxOptions: {
            type: "time",
            displayFormat: "HH:mm"
          }
        };
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
        fs.autoform.type = 'steedosHtml';
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
                  permissions = obj.permissions;
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
                  permissions = obj.permissions;
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
      fs.autoform.type = "text";
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
  return ["date", "datetime", "time", "currency", "number"].includes(field_type);
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
    if (!_.isEmpty(record.record_permissions)) {
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

},"actions.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_objects/lib/actions.coffee                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _deleteRecord;

Creator.actionsByName = {};

if (Meteor.isClient) {
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

      url = "/api/v4/word_templates/" + action.word_template + "/print" + "?filters=" + SteedosFilters.formatFiltersToODataQuery(filters);
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

  Creator.relatedObjectStandardNew = function (related_object_name) {
    var collection, collection_name, current_object_name, current_record_id, defaultDoc, doc, ids, initialValues, record_id, relateObject;
    relateObject = Creator.getObject(related_object_name);
    collection_name = relateObject.label;
    collection = "Creator.Collections." + Creator.getObject(related_object_name)._collection_name;
    current_object_name = Session.get("object_name");
    current_record_id = Session.get("record_id");
    ids = Creator.TabularSelectedIds[related_object_name];
    initialValues = {};

    if (ids != null ? ids.length : void 0) {
      record_id = ids[0];
      doc = Creator.odata.get(related_object_name, record_id);
      initialValues = doc;
      Session.set('cmShowAgainDuplicated', true);
    } else {
      defaultDoc = FormManager.getRelatedInitialValues(current_object_name, current_record_id, related_object_name);

      if (!_.isEmpty(defaultDoc)) {
        initialValues = defaultDoc;
      }
    }

    if ((relateObject != null ? relateObject.version : void 0) >= 2) {
      return SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
        name: related_object_name + "_standard_new_form",
        objectApiName: related_object_name,
        title: '新建 ' + relateObject.label,
        initialValues: initialValues,
        afterInsert: function (result) {
          setTimeout(function () {
            if (Creator.getObject(current_object_name).version > 1) {
              SteedosUI.reloadRecord(current_object_name, current_record_id);
            }

            return FlowRouter.reload();
          }, 1);
          return true;
        }
      }, null, {
        iconPath: '/assets/icons'
      });
    }

    if (ids != null ? ids.length : void 0) {
      Session.set('cmDoc', initialValues);
      Session.set('cmShowAgainDuplicated', true);
    } else {
      if (!_.isEmpty(initialValues)) {
        Session.set('cmDoc', initialValues);
      }
    }

    Session.set("action_fields", void 0);
    Session.set("action_collection", collection);
    Session.set("action_collection_name", collection_name);
    Session.set("action_save_and_insert", false);
    Meteor.defer(function () {
      return $(".creator-add-related").click();
    });
  };

  Creator.actions({
    "standard_query": function () {
      return Modal.show("standard_query_modal");
    },
    "standard_new": function (object_name, record_id, fields) {
      var gridName, initialValues, isRelated, masterRecordId, object, ref, ref1, ref2, ref3, ref4, ref5, relatedFieldName, selectedRows;
      object = Creator.getObject(object_name);
      gridName = this.action.gridName;
      isRelated = this.action.isRelated;

      if (isRelated) {
        relatedFieldName = this.action.relatedFieldName;
        masterRecordId = this.action.masterRecordId;
        initialValues = this.action.initialValues;

        if (!initialValues) {
          initialValues = {};
          initialValues[relatedFieldName] = masterRecordId;
        }
      } else {
        initialValues = {};

        if (gridName) {
          selectedRows = (ref = window.gridRefs) != null ? (ref1 = ref[gridName].current) != null ? (ref2 = ref1.api) != null ? ref2.getSelectedRows() : void 0 : void 0 : void 0;
        } else {
          selectedRows = (ref3 = window.gridRef) != null ? (ref4 = ref3.current) != null ? (ref5 = ref4.api) != null ? ref5.getSelectedRows() : void 0 : void 0 : void 0;
        }

        if (selectedRows != null ? selectedRows.length : void 0) {
          record_id = selectedRows[0]._id;

          if (record_id) {
            initialValues = Creator.odata.get(object_name, record_id);
          }
        } else {
          initialValues = FormManager.getInitialValues(object_name);
        }
      }

      if ((object != null ? object.version : void 0) >= 2) {
        return Steedos.Page.Form.StandardNew.render(Session.get("app_id"), object_name, t('New') + ' ' + object.label, initialValues, {
          gridName: gridName
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
          return Steedos.Page.Form.StandardEdit.render(Session.get("app_id"), object_name, t('Edit') + ' ' + object.label, record_id, {
            gridName: this.action.gridName
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
      var beforeHook, gridName, i18nTextKey, i18nTitleKey, nameField, object, selectedRecords, text;
      gridName = this.action.gridName;

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
        selectedRecords = SteedosUI.getTableSelectedRows(gridName || list_view_id);

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
              var _e, appid, current_object_name, current_record_id, dxDataGridInstance, gridContainer, gridObjectNameClass, isOpenerRemove, recordUrl, ref, tempNavRemoved;

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

                if (current_object_name && ((ref = Creator.getObject(current_object_name)) != null ? ref.version : void 0) > 1) {
                  SteedosUI.reloadRecord(current_object_name, current_record_id);
                }

                if (FlowRouter.current().route.path.endsWith("/:record_id")) {
                  if (object_name !== Session.get("object_name")) {
                    FlowRouter.reload();
                  }
                } else {
                  window.refreshGrid(gridName);
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
                  return window.refreshGrid(gridName);
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

/* Exports */
Package._define("steedos:objects");

})();

//# sourceURL=meteor://💻app/packages/steedos_objects.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiQVBJU2VydmljZSIsIk1ldGFkYXRhU2VydmljZSIsImNvbmZpZyIsImUiLCJtb2xlY3VsZXIiLCJvYmplY3RxbCIsInBhY2thZ2VMb2FkZXIiLCJwYWNrYWdlU2VydmljZSIsInBhdGgiLCJzZXR0aW5ncyIsInN0ZWVkb3NDb3JlIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJyZXF1aXJlIiwiZ2V0U3RlZWRvc0NvbmZpZyIsImJ1aWx0X2luX3BsdWdpbnMiLCJwbHVnaW5zIiwiTWV0ZW9yIiwic3RhcnR1cCIsImFwaVNlcnZpY2UiLCJicm9rZXIiLCJleCIsIm1ldGFkYXRhU2VydmljZSIsIm9iamVjdHFsU2VydmljZSIsInBhZ2VTZXJ2aWNlIiwicHJvamVjdFNlcnZpY2UiLCJzdGFuZGFyZE9iamVjdHNEaXIiLCJzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSIsInN0ZWVkb3NTZXJ2aWNlIiwidWlTZXJ2aWNlIiwiU2VydmljZUJyb2tlciIsIm5hbWVzcGFjZSIsIm5vZGVJRCIsIm1ldGFkYXRhIiwidHJhbnNwb3J0ZXIiLCJUUkFOU1BPUlRFUiIsImNhY2hlciIsIkNBQ0hFUiIsImxvZ0xldmVsIiwic2VyaWFsaXplciIsInJlcXVlc3RUaW1lb3V0IiwibWF4Q2FsbExldmVsIiwiaGVhcnRiZWF0SW50ZXJ2YWwiLCJoZWFydGJlYXRUaW1lb3V0IiwiY29udGV4dFBhcmFtc0Nsb25pbmciLCJ0cmFja2luZyIsImVuYWJsZWQiLCJzaHV0ZG93blRpbWVvdXQiLCJkaXNhYmxlQmFsYW5jZXIiLCJyZWdpc3RyeSIsInN0cmF0ZWd5IiwicHJlZmVyTG9jYWwiLCJidWxraGVhZCIsImNvbmN1cnJlbmN5IiwibWF4UXVldWVTaXplIiwidmFsaWRhdG9yIiwiZXJyb3JIYW5kbGVyIiwidHJhY2luZyIsImV4cG9ydGVyIiwidHlwZSIsIm9wdGlvbnMiLCJsb2dnZXIiLCJjb2xvcnMiLCJ3aWR0aCIsImdhdWdlV2lkdGgiLCJza2lwUHJvY2Vzc0V2ZW50UmVnaXN0cmF0aW9uIiwiY3JlYXRlZCIsIndhcm4iLCJjbGVhbiIsImluaXQiLCJjcmVhdGVTZXJ2aWNlIiwibmFtZSIsIm1peGlucyIsInBvcnQiLCJzdGFydGVkIiwic2V0VGltZW91dCIsImVtaXQiLCJnZXRTdGVlZG9zU2NoZW1hIiwiU3RhbmRhcmRPYmplY3RzUGF0aCIsInBhY2thZ2VJbmZvIiwid3JhcEFzeW5jIiwiY2IiLCJzdGFydCIsInRoZW4iLCJjb25uZWN0SGFuZGxlcnNFeHByZXNzIiwiZXhwcmVzcyIsIl9yZXN0YXJ0U2VydmljZSIsInVzZSIsInN0YXRpY1JvdXRlciIsIndhaXRGb3JTZXJ2aWNlcyIsImNvbnNvbGUiLCJsb2ciLCJTdGVlZG9zQXBpIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwicmVzb2x2ZSIsInJlamVjdCIsImVycm9yIiwiRmliZXIiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJsaXN0X3ZpZXdzIiwic3BhY2UiLCJnZXRDb2xsZWN0aW9uTmFtZSIsIl8iLCJjbG9uZSIsImNvbnZlcnRPYmplY3QiLCJPYmplY3QiLCJpbml0VHJpZ2dlcnMiLCJpbml0TGlzdFZpZXdzIiwiZ2V0T2JqZWN0TmFtZSIsImdldE9iamVjdCIsInNwYWNlX2lkIiwicmVmIiwicmVmMSIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJvYmplY3RzQnlOYW1lIiwiZ2V0T2JqZWN0QnlJZCIsIm9iamVjdF9pZCIsImZpbmRXaGVyZSIsIl9pZCIsInJlbW92ZU9iamVjdCIsImdldENvbGxlY3Rpb24iLCJzcGFjZUlkIiwiX2NvbGxlY3Rpb25fbmFtZSIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiZmllbGRzIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsImlzU3RyaW5nIiwiRm9ybXVsYXIiLCJjaGVja0Zvcm11bGEiLCJldmFsdWF0ZUZpbHRlcnMiLCJmaWx0ZXJzIiwic2VsZWN0b3IiLCJlYWNoIiwiZmlsdGVyIiwiYWN0aW9uIiwidmFsdWUiLCJsZW5ndGgiLCJpc0NvbW1vblNwYWNlIiwiZ2V0T3JkZXJseVNldEJ5SWRzIiwiZG9jcyIsImlkcyIsImlkX2tleSIsImhpdF9maXJzdCIsInZhbHVlcyIsImdldFByb3BlcnR5Iiwic29ydEJ5IiwiZG9jIiwiX2luZGV4Iiwic29ydGluZ01ldGhvZCIsInZhbHVlMSIsInZhbHVlMiIsImlzVmFsdWUxRW1wdHkiLCJpc1ZhbHVlMkVtcHR5IiwibG9jYWxlIiwia2V5IiwiRGF0ZSIsImdldFRpbWUiLCJTdGVlZG9zIiwidG9TdHJpbmciLCJsb2NhbGVDb21wYXJlIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfb2JqZWN0IiwicGVybWlzc2lvbnMiLCJyZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0TWFwIiwicmVsYXRlZF9vYmplY3RzIiwiaXNFbXB0eSIsIm9iak5hbWUiLCJpc09iamVjdCIsIm9iamVjdE5hbWUiLCJyZWxhdGVkX29iamVjdCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwicmVmZXJlbmNlX3RvIiwiZm9yZWlnbl9rZXkiLCJ3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCIsImVuYWJsZU9iak5hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJlbmFibGVfZmlsZXMiLCJwdXNoIiwic2ZzRmlsZXNPYmplY3QiLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImVuYWJsZV9hcHByb3ZhbHMiLCJlbmFibGVfcHJvY2VzcyIsImdldFVzZXJDb250ZXh0IiwiaXNVblNhZmVNb2RlIiwiVVNFUl9DT05URVhUIiwic3BhY2VfdXNlcl9vcmciLCJzdSIsInN1RmllbGRzIiwiRXJyb3IiLCJtb2JpbGUiLCJwb3NpdGlvbiIsImVtYWlsIiwiY29tcGFueSIsIm9yZ2FuaXphdGlvbiIsImNvbXBhbnlfaWQiLCJjb21wYW55X2lkcyIsInVzZXIiLCJmdWxsbmFtZSIsImdldFJlbGF0aXZlVXJsIiwidXJsIiwiaXNGdW5jdGlvbiIsImlzQ29yZG92YSIsInN0YXJ0c1dpdGgiLCJ0ZXN0IiwiX19tZXRlb3JfcnVudGltZV9jb25maWdfXyIsIlJPT1RfVVJMX1BBVEhfUFJFRklYIiwiZ2V0VXNlckNvbXBhbnlJZCIsImdldFVzZXJDb21wYW55SWRzIiwicHJvY2Vzc1Blcm1pc3Npb25zIiwicG8iLCJhbGxvd0NyZWF0ZSIsImFsbG93UmVhZCIsImFsbG93RWRpdCIsImFsbG93RGVsZXRlIiwidmlld0FsbFJlY29yZHMiLCJ2aWV3Q29tcGFueVJlY29yZHMiLCJtb2RpZnlDb21wYW55UmVjb3JkcyIsImFsbG93UmVhZEZpbGVzIiwidmlld0FsbEZpbGVzIiwiYWxsb3dDcmVhdGVGaWxlcyIsImFsbG93RWRpdEZpbGVzIiwiYWxsb3dEZWxldGVGaWxlcyIsIm1vZGlmeUFsbEZpbGVzIiwiZ2V0VGVtcGxhdGVTcGFjZUlkIiwidGVtcGxhdGVTcGFjZUlkIiwiZ2V0Q2xvdWRBZG1pblNwYWNlSWQiLCJjbG91ZEFkbWluU3BhY2VJZCIsImlzVGVtcGxhdGVTcGFjZSIsImlzQ2xvdWRBZG1pblNwYWNlIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsIm9wdGlvbnNfbGltaXQiLCJxdWVyeSIsInF1ZXJ5X29wdGlvbnMiLCJyZWNvcmRzIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsInBhcmFtcyIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJmaWx0ZXJRdWVyeSIsImxpbWl0IiwiZmluZCIsImZldGNoIiwicmVjb3JkIiwibGFiZWwiLCJtZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldEluaXRXaWR0aFBlcmNlbnQiLCJjb2x1bW5zIiwiX3NjaGVtYSIsImNvbHVtbl9udW0iLCJpbml0X3dpZHRoX3BlcmNlbnQiLCJnZXRTY2hlbWEiLCJmaWVsZF9uYW1lIiwiZmllbGQiLCJpc193aWRlIiwicmVmMiIsInBpY2siLCJhdXRvZm9ybSIsImdldEZpZWxkSXNXaWRlIiwiZ2V0VGFidWxhck9yZGVyIiwibGlzdF92aWV3X2lkIiwic2V0dGluZyIsInJlY29yZF9pZCIsIm1hcCIsImNvbHVtbiIsImhpZGRlbiIsImNvbXBhY3QiLCJvcmRlciIsImluZGV4IiwiZGVmYXVsdF9leHRyYV9jb2x1bW5zIiwiZXh0cmFfY29sdW1ucyIsImdldE9iamVjdERlZmF1bHRDb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyIsInVuaW9uIiwiZ2V0T2JqZWN0RGVmYXVsdFNvcnQiLCJUYWJ1bGFyU2VsZWN0ZWRJZHMiLCJjb252ZXJ0TGlzdFZpZXciLCJkZWZhdWx0X3ZpZXciLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfbmFtZSIsImRlZmF1bHRfY29sdW1ucyIsImRlZmF1bHRfbW9iaWxlX2NvbHVtbnMiLCJvaXRlbSIsIm1vYmlsZV9jb2x1bW5zIiwiaGFzIiwiaW5jbHVkZSIsImZpbHRlcl9zY29wZSIsInBhcnNlIiwiZm9yRWFjaCIsIl92YWx1ZSIsImdldFJlbGF0ZWRMaXN0IiwibGF5b3V0UmVsYXRlZExpc3QiLCJsaXN0IiwibWFwTGlzdCIsIm9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyIsInJlbGF0ZWRMaXN0TmFtZXMiLCJyZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInVucmVsYXRlZF9vYmplY3RzIiwicmVsYXRlZF9saXN0cyIsIml0ZW0iLCJyZUZpZWxkTmFtZSIsInJlT2JqZWN0TmFtZSIsInJlbGF0ZWQiLCJyZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lIiwic3BsaXQiLCJmaWVsZF9uYW1lcyIsImlzX2ZpbGUiLCJjdXN0b21SZWxhdGVkTGlzdE9iamVjdCIsImFjdGlvbnMiLCJidXR0b25zIiwidmlzaWJsZV9vbiIsInBhZ2Vfc2l6ZSIsIm9iak9yTmFtZSIsImdldFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfaXRlbSIsInJlbGF0ZWRPYmplY3QiLCJ0YWJ1bGFyX29yZGVyIiwiZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMiLCJ3aXRob3V0IiwidHJhbnNmb3JtU29ydFRvVGFidWxhciIsInJlcGxhY2UiLCJwbHVjayIsImRpZmZlcmVuY2UiLCJ2IiwiaXNBY3RpdmUiLCJhbGxvd19yZWxhdGVkTGlzdCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJmaXJzdCIsImdldExpc3RWaWV3cyIsImdldExpc3RWaWV3IiwiZXhhYyIsImxpc3RWaWV3cyIsImdldExpc3RWaWV3SXNSZWNlbnQiLCJsaXN0VmlldyIsInBpY2tPYmplY3RNb2JpbGVDb2x1bW5zIiwiY291bnQiLCJnZXRGaWVsZCIsImlzTmFtZUNvbHVtbiIsIml0ZW1Db3VudCIsIm1heENvdW50IiwibWF4Um93cyIsIm5hbWVDb2x1bW4iLCJuYW1lS2V5IiwicmVzdWx0IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJjb2RlIiwiUmVnRXhwIiwiX3JlZ0V4TWVzc2FnZXMiLCJfZ2xvYmFsTWVzc2FnZXMiLCJyZWdFeCIsImV4cCIsIm1zZyIsIm1lc3NhZ2VzIiwiZXZhbEluQ29udGV4dCIsImpzIiwiZXZhbCIsImNhbGwiLCJjb252ZXJ0RmllbGQiLCJnZXRPcHRpb24iLCJvcHRpb24iLCJmb28iLCJjb2xvciIsImFsbE9wdGlvbnMiLCJwaWNrbGlzdCIsInBpY2tsaXN0T3B0aW9ucyIsImdldFBpY2tsaXN0IiwiZ2V0UGlja0xpc3RPcHRpb25zIiwicmV2ZXJzZSIsImVuYWJsZSIsImRlZmF1bHRWYWx1ZSIsInRyaWdnZXJzIiwidHJpZ2dlciIsIl90b2RvIiwiX3RvZG9fZnJvbV9jb2RlIiwiX3RvZG9fZnJvbV9kYiIsIm9uIiwidG9kbyIsInN5c3RlbUJhc2VGaWVsZHMiLCJvbWl0IiwicmVxdWlyZWQiLCJyZWFkb25seSIsImdldFN5c3RlbUJhc2VGaWVsZHMiLCJfdmlzaWJsZSIsImVycm9yMSIsImFjdGlvbnNCeU5hbWUiLCJ0cmltIiwiaXNFeHByZXNzaW9uIiwidmlzaWJsZSIsInJlY29yZF9wZXJtaXNzaW9ucyIsImdsb2JhbERhdGEiLCJhc3NpZ24iLCJub3ciLCJwYXJzZVNpbmdsZUV4cHJlc3Npb24iLCJfb3B0aW9ucyIsIl90eXBlIiwiYmVmb3JlT3BlbkZ1bmN0aW9uIiwiaXNfY29tcGFueV9saW1pdGVkIiwibWF4IiwibWluIiwiX29wdGlvbiIsImsiLCJfcmVnRXgiLCJfbWluIiwiX21heCIsIk51bWJlciIsIkJvb2xlYW4iLCJfb3B0aW9uc0Z1bmN0aW9uIiwiX3JlZmVyZW5jZV90byIsIl9jcmVhdGVGdW5jdGlvbiIsIl9iZWZvcmVPcGVuRnVuY3Rpb24iLCJfZmlsdGVyc0Z1bmN0aW9uIiwiX2RlZmF1bHRWYWx1ZSIsIl9pc19jb21wYW55X2xpbWl0ZWQiLCJfZmlsdGVycyIsImlzRGF0ZSIsInBvcCIsIl9pc19kYXRlIiwiZm9ybSIsInZhbCIsInJlbGF0ZWRPYmpJbmZvIiwiUFJFRklYIiwiX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhIiwicHJlZml4IiwiZmllbGRWYXJpYWJsZSIsInJlZyIsInJldiIsIm0iLCIkMSIsImZvcm11bGFfc3RyIiwiX0NPTlRFWFQiLCJfVkFMVUVTIiwiZGF0YSIsImlzQm9vbGVhbiIsInRvYXN0ciIsImZvcm1hdE9iamVjdE5hbWUiLCJfYmFzZU9iamVjdCIsIl9kYiIsImRlZmF1bHRMaXN0Vmlld0lkIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsInJlZjMiLCJzY2hlbWEiLCJzZWxmIiwiYmFzZU9iamVjdCIsInBlcm1pc3Npb25fc2V0IiwiaWNvbiIsImRlc2NyaXB0aW9uIiwiaXNfdmlldyIsImhhc0ltcG9ydFRlbXBsYXRlcyIsInZlcnNpb24iLCJpc19lbmFibGUiLCJhbGxvd19jdXN0b21BY3Rpb25zIiwiZXhjbHVkZV9hY3Rpb25zIiwiZW5hYmxlX3NlYXJjaCIsInBhZ2luZyIsImVuYWJsZV9hcGkiLCJjdXN0b20iLCJlbmFibGVfc2hhcmUiLCJlbmFibGVfdHJlZSIsInNpZGViYXIiLCJvcGVuX3dpbmRvdyIsImZpbHRlcl9jb21wYW55IiwiY2FsZW5kYXIiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJlbmFibGVfZm9sbG93IiwiZW5hYmxlX3dvcmtmbG93IiwiZW5hYmxlX2lubGluZV9lZGl0IiwiZGV0YWlscyIsIm1hc3RlcnMiLCJsb29rdXBfZGV0YWlscyIsImluX2RldmVsb3BtZW50IiwiaWRGaWVsZE5hbWUiLCJkYXRhYmFzZV9uYW1lIiwiaXNfbmFtZSIsInByaW1hcnkiLCJmaWx0ZXJhYmxlIiwiaXRlbV9uYW1lIiwiY29weUl0ZW0iLCJhZG1pbiIsImFsbCIsImxpc3Rfdmlld19pdGVtIiwiUmVhY3RpdmVWYXIiLCJjcmVhdGVDb2xsZWN0aW9uIiwiX25hbWUiLCJnZXRPYmplY3RTY2hlbWEiLCJjb250YWlucyIsImF0dGFjaFNjaGVtYSIsIl9zaW1wbGVTY2hlbWEiLCJnZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCIsImJvb3RzdHJhcExvYWRlZCIsImdldFNlbGVjdE9wdGlvbnMiLCJmaWVsZFNjaGVtYSIsImRhdGFfdHlwZSIsIm9wdGlvbkl0ZW0iLCJmaWVsZHNBcnIiLCJfcmVmX29iaiIsImF1dG9mb3JtX3R5cGUiLCJjb2xsZWN0aW9uTmFtZSIsImZzIiwiZnNUeXBlIiwiaXNVbkxpbWl0ZWQiLCJtdWx0aXBsZSIsInJvd3MiLCJsYW5ndWFnZSIsImlzTW9iaWxlIiwiaXNQYWQiLCJpc2lPUyIsImFmRmllbGRJbnB1dCIsInRpbWV6b25lSWQiLCJkeERhdGVCb3hPcHRpb25zIiwiZGlzcGxheUZvcm1hdCIsInBpY2tlclR5cGUiLCJkYXRlTW9iaWxlT3B0aW9ucyIsIm91dEZvcm1hdCIsInNob3dJY29uIiwiZGVwZW5kT24iLCJkZXBlbmRfb24iLCJjcmVhdGUiLCJsb29rdXBfZmllbGQiLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJvcGVyYXRpb24iLCJvblN1Y2Nlc3MiLCJhZGRJdGVtcyIsInJlZmVyZW5jZV9zb3J0Iiwib3B0aW9uc1NvcnQiLCJyZWZlcmVuY2VfbGltaXQiLCJvcHRpb25zTGltaXQiLCJyZWZlcmVuY2VfdG9fZmllbGQiLCJyZWZlcmVuY2VUb0ZpZWxkIiwiYmxhY2tib3giLCJvYmplY3RTd2l0Y2hlIiwib3B0aW9uc01ldGhvZCIsIm9wdGlvbnNNZXRob2RQYXJhbXMiLCJyZWZlcmVuY2VzIiwiX3JlZmVyZW5jZSIsImxpbmsiLCJkZWZhdWx0SWNvbiIsImZpcnN0T3B0aW9uIiwiZGVjaW1hbCIsInByZWNpc2lvbiIsInNjYWxlIiwiZGlzYWJsZWQiLCJBcnJheSIsImVkaXRhYmxlIiwiYWNjZXB0Iiwic3lzdGVtIiwiRW1haWwiLCJpc051bWJlciIsIm9wdGlvbmFsIiwidW5pcXVlIiwiZ3JvdXAiLCJzZWFyY2hhYmxlIiwiaW5saW5lSGVscFRleHQiLCJpc1Byb2R1Y3Rpb24iLCJzb3J0YWJsZSIsImdldEZpZWxkRGlzcGxheVZhbHVlIiwiZmllbGRfdmFsdWUiLCJodG1sIiwibW9tZW50IiwiZm9ybWF0IiwiY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5IiwiZmllbGRfdHlwZSIsImluY2x1ZGVzIiwicHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzIiwib3BlcmF0aW9ucyIsImJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyIsImJ1aWx0aW5JdGVtIiwiaXNfY2hlY2tfb25seSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24iLCJiZXR3ZWVuQnVpbHRpblZhbHVlcyIsImdldFF1YXJ0ZXJTdGFydE1vbnRoIiwibW9udGgiLCJnZXRNb250aCIsImdldExhc3RRdWFydGVyRmlyc3REYXkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJnZXROZXh0UXVhcnRlckZpcnN0RGF5IiwiZ2V0TW9udGhEYXlzIiwiZGF5cyIsImVuZERhdGUiLCJtaWxsaXNlY29uZCIsInN0YXJ0RGF0ZSIsImdldExhc3RNb250aEZpcnN0RGF5IiwiY3VycmVudE1vbnRoIiwiY3VycmVudFllYXIiLCJlbmRWYWx1ZSIsImZpcnN0RGF5IiwibGFzdERheSIsImxhc3RNb25kYXkiLCJsYXN0TW9udGhGaW5hbERheSIsImxhc3RNb250aEZpcnN0RGF5IiwibGFzdFF1YXJ0ZXJFbmREYXkiLCJsYXN0UXVhcnRlclN0YXJ0RGF5IiwibGFzdFN1bmRheSIsImxhc3RfMTIwX2RheXMiLCJsYXN0XzMwX2RheXMiLCJsYXN0XzYwX2RheXMiLCJsYXN0XzdfZGF5cyIsImxhc3RfOTBfZGF5cyIsIm1pbnVzRGF5IiwibW9uZGF5IiwibmV4dE1vbmRheSIsIm5leHRNb250aEZpbmFsRGF5IiwibmV4dE1vbnRoRmlyc3REYXkiLCJuZXh0UXVhcnRlckVuZERheSIsIm5leHRRdWFydGVyU3RhcnREYXkiLCJuZXh0U3VuZGF5IiwibmV4dFllYXIiLCJuZXh0XzEyMF9kYXlzIiwibmV4dF8zMF9kYXlzIiwibmV4dF82MF9kYXlzIiwibmV4dF83X2RheXMiLCJuZXh0XzkwX2RheXMiLCJwcmV2aW91c1llYXIiLCJzdGFydFZhbHVlIiwic3RyRW5kRGF5Iiwic3RyRmlyc3REYXkiLCJzdHJMYXN0RGF5Iiwic3RyTW9uZGF5Iiwic3RyU3RhcnREYXkiLCJzdHJTdW5kYXkiLCJzdHJUb2RheSIsInN0clRvbW9ycm93Iiwic3RyWWVzdGRheSIsInN1bmRheSIsInRoaXNRdWFydGVyRW5kRGF5IiwidGhpc1F1YXJ0ZXJTdGFydERheSIsInRvbW9ycm93Iiwid2VlayIsInllc3RkYXkiLCJnZXREYXkiLCJ0IiwiZnYiLCJzZXRIb3VycyIsImdldEhvdXJzIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJnZXRGaWVsZERlZmF1bHRPcGVyYXRpb24iLCJnZXRGaWVsZE9wZXJhdGlvbiIsIm9wdGlvbmFscyIsImVxdWFsIiwidW5lcXVhbCIsImxlc3NfdGhhbiIsImdyZWF0ZXJfdGhhbiIsImxlc3Nfb3JfZXF1YWwiLCJncmVhdGVyX29yX2VxdWFsIiwibm90X2NvbnRhaW4iLCJzdGFydHNfd2l0aCIsImJldHdlZW4iLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiZmllbGRzTmFtZSIsInNvcnRfbm8iLCJjbGVhblRyaWdnZXIiLCJpbml0VHJpZ2dlciIsIl90cmlnZ2VyX2hvb2tzIiwicmVmNCIsInJlZjUiLCJ0b2RvV3JhcHBlciIsImFwcGx5IiwiYXJndW1lbnRzIiwid2hlbiIsImJlZm9yZSIsImluc2VydCIsInVwZGF0ZSIsInJlbW92ZSIsImFmdGVyIiwiX2hvb2siLCJ0cmlnZ2VyX25hbWUiLCJfdHJpZ2dlcl9ob29rIiwiYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzIiwiZXh0ZW5kUGVybWlzc2lvblByb3BzIiwiZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCIsImZpbmRfcGVybWlzc2lvbl9vYmplY3QiLCJpbnRlcnNlY3Rpb25QbHVzIiwib3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzIiwib3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzIiwicGVybWlzc2lvblByb3BOYW1lcyIsInVuaW9uUGVybWlzc2lvbk9iamVjdHMiLCJ1bmlvblBsdXMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImdldFJlY29yZFBlcm1pc3Npb25zIiwiaXNPd25lciIsIm1hc3Rlck9iamVjdE5hbWUiLCJtYXN0ZXJSZWNvcmRQZXJtIiwicmVjb3JkX2NvbXBhbnlfaWQiLCJyZWNvcmRfY29tcGFueV9pZHMiLCJ1c2VyX2NvbXBhbnlfaWRzIiwib3duZXIiLCJwYXJlbnQiLCJuIiwiaW50ZXJzZWN0aW9uIiwibG9ja2VkIiwiZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyIsImN1cnJlbnRPYmplY3ROYW1lIiwicmVsYXRlZExpc3RJdGVtIiwiY3VycmVudFJlY29yZCIsImlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSIsIm1hc3RlckFsbG93IiwicmVsYXRlZE9iamVjdFBlcm1pc3Npb25zIiwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QiLCJnZXRPYmplY3RSZWNvcmQiLCJnZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIl9pIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwic3BhY2VVc2VyIiwib2JqZWN0cyIsImFzc2lnbmVkX2FwcHMiLCJwcm9maWxlIiwidXNlcnMiLCJwZXJtaXNzaW9uX3NldF9pZCIsIm1vZGlmaWVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwiZ2V0QXNzaWduZWRBcHBzIiwiYmluZCIsImFzc2lnbmVkX21lbnVzIiwiZ2V0QXNzaWduZWRNZW51cyIsInVzZXJfcGVybWlzc2lvbl9zZXRzIiwiYXJyYXkiLCJvdGhlciIsInRhcmdldCIsInByb3BzIiwiZmlsZXNQcm9OYW1lcyIsInByb3BOYW1lcyIsInByb3BOYW1lIiwiYXBwcyIsInBzZXRCYXNlIiwidXNlclByb2ZpbGUiLCJwc2V0IiwidW5pcSIsImFib3V0TWVudSIsImFkbWluTWVudXMiLCJhbGxNZW51cyIsImN1cnJlbnRQc2V0TmFtZXMiLCJtZW51cyIsIm90aGVyTWVudUFwcHMiLCJvdGhlck1lbnVzIiwiYWRtaW5fbWVudXMiLCJmbGF0dGVuIiwibWVudSIsInBzZXRzTWVudSIsInBlcm1pc3Npb25fc2V0cyIsInBlcm1pc3Npb25fb2JqZWN0cyIsImlzTnVsbCIsInBlcm1pc3Npb25fc2V0X2lkcyIsInBvcyIsIm9wcyIsIm9wc19rZXkiLCJjdXJyZW50UHNldCIsInRlbXBPcHMiLCJyZXBlYXRJbmRleCIsInJlcGVhdFBvIiwib3BzZXRBZG1pbiIsIm9wc2V0Q3VzdG9tZXIiLCJvcHNldEd1ZXN0Iiwib3BzZXRNZW1iZXIiLCJvcHNldFN1cHBsaWVyIiwib3BzZXRVc2VyIiwicG9zQWRtaW4iLCJwb3NDdXN0b21lciIsInBvc0d1ZXN0IiwicG9zTWVtYmVyIiwicG9zU3VwcGxpZXIiLCJwb3NVc2VyIiwicHJvZiIsImd1ZXN0IiwibWVtYmVyIiwic3VwcGxpZXIiLCJjdXN0b21lciIsImRpc2FibGVkX2FjdGlvbnMiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsInVuZWRpdGFibGVfZmllbGRzIiwiY3JlYXRvcl9kYl91cmwiLCJvcGxvZ191cmwiLCJNT05HT19VUkxfQ1JFQVRPUiIsIk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SIiwiX0NSRUFUT1JfREFUQVNPVVJDRSIsIl9kcml2ZXIiLCJNb25nb0ludGVybmFscyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvcGxvZ1VybCIsImNvbGxlY3Rpb25fa2V5IiwibmV3Q29sbGVjdGlvbiIsIlNNU1F1ZXVlIiwiX2RlbGV0ZVJlY29yZCIsImFjdGlvbl9uYW1lIiwiZXhlY3V0ZUFjdGlvbiIsIml0ZW1fZWxlbWVudCIsImNhbGxiYWNrIiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIk9iamVjdEdyaWQiLCJnZXRGaWx0ZXJzIiwid29yZF90ZW1wbGF0ZSIsIlN0ZWVkb3NGaWx0ZXJzIiwiZm9ybWF0RmlsdGVyc1RvT0RhdGFRdWVyeSIsImFic29sdXRlVXJsIiwid2luZG93Iiwib3BlbiIsIm9kYXRhIiwicHJvdG90eXBlIiwic2xpY2UiLCJjb25jYXQiLCJ3YXJuaW5nIiwicmVjb3JkX3RpdGxlIiwiY2FsbF9iYWNrIiwiY2FsbF9iYWNrX2Vycm9yIiwicHJldmlvdXNEb2MiLCJGb3JtTWFuYWdlciIsImdldFByZXZpb3VzRG9jIiwiaW5mbyIsInN1Y2Nlc3MiLCJydW5Ib29rIiwicmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3IiwiY29sbGVjdGlvbl9uYW1lIiwiY3VycmVudF9vYmplY3RfbmFtZSIsImN1cnJlbnRfcmVjb3JkX2lkIiwiZGVmYXVsdERvYyIsImluaXRpYWxWYWx1ZXMiLCJyZWxhdGVPYmplY3QiLCJzZXQiLCJnZXRSZWxhdGVkSW5pdGlhbFZhbHVlcyIsIlN0ZWVkb3NVSSIsInNob3dNb2RhbCIsInN0b3JlcyIsIkNvbXBvbmVudFJlZ2lzdHJ5IiwiY29tcG9uZW50cyIsIk9iamVjdEZvcm0iLCJvYmplY3RBcGlOYW1lIiwidGl0bGUiLCJhZnRlckluc2VydCIsInJlbG9hZFJlY29yZCIsIkZsb3dSb3V0ZXIiLCJyZWxvYWQiLCJpY29uUGF0aCIsImRlZmVyIiwiJCIsImNsaWNrIiwiZ3JpZE5hbWUiLCJpc1JlbGF0ZWQiLCJtYXN0ZXJSZWNvcmRJZCIsInJlbGF0ZWRGaWVsZE5hbWUiLCJzZWxlY3RlZFJvd3MiLCJncmlkUmVmcyIsImN1cnJlbnQiLCJhcGkiLCJnZXRTZWxlY3RlZFJvd3MiLCJncmlkUmVmIiwiZ2V0SW5pdGlhbFZhbHVlcyIsIlBhZ2UiLCJGb3JtIiwiU3RhbmRhcmROZXciLCJyZW5kZXIiLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwicmVkaXJlY3QiLCJTdGFuZGFyZEVkaXQiLCJiZWZvcmVIb29rIiwiaTE4blRleHRLZXkiLCJpMThuVGl0bGVLZXkiLCJuYW1lRmllbGQiLCJzZWxlY3RlZFJlY29yZHMiLCJ0ZXh0IiwiZ2V0VGFibGVTZWxlY3RlZFJvd3MiLCJzd2FsIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsImFmdGVyQmF0Y2hlc0RlbGV0ZSIsImRlbGV0ZUNvdW50ZXIiLCJfZSIsImFwcGlkIiwiZHhEYXRhR3JpZEluc3RhbmNlIiwiZ3JpZENvbnRhaW5lciIsImdyaWRPYmplY3ROYW1lQ2xhc3MiLCJpc09wZW5lclJlbW92ZSIsInJlY29yZFVybCIsInRlbXBOYXZSZW1vdmVkIiwib3BlbmVyIiwicm91dGUiLCJlbmRzV2l0aCIsInJlZnJlc2hHcmlkIiwiZHhUcmVlTGlzdCIsImR4RGF0YUdyaWQiLCJyZWZyZXNoIiwicmVtb3ZlVGVtcE5hdkl0ZW0iLCJjbG9zZSIsImdvIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsInJlY29yZFRpdGxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxLQUFDQSxFQUFELEdBQU0sRUFBTjs7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Q29udGVudCI6WyJAZGIgPSB7fVxuaWYgIUNyZWF0b3I/XG5cdEBDcmVhdG9yID0ge31cbkNyZWF0b3IuT2JqZWN0cyA9IHt9XG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge31cbkNyZWF0b3IuTWVudXMgPSBbXVxuQ3JlYXRvci5BcHBzID0ge31cbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9XG5DcmVhdG9yLlJlcG9ydHMgPSB7fVxuQ3JlYXRvci5zdWJzID0ge31cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9IiwidGhpcy5kYiA9IHt9O1xuXG5pZiAodHlwZW9mIENyZWF0b3IgPT09IFwidW5kZWZpbmVkXCIgfHwgQ3JlYXRvciA9PT0gbnVsbCkge1xuICB0aGlzLkNyZWF0b3IgPSB7fTtcbn1cblxuQ3JlYXRvci5PYmplY3RzID0ge307XG5cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fTtcblxuQ3JlYXRvci5NZW51cyA9IFtdO1xuXG5DcmVhdG9yLkFwcHMgPSB7fTtcblxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge307XG5cbkNyZWF0b3IuUmVwb3J0cyA9IHt9O1xuXG5DcmVhdG9yLnN1YnMgPSB7fTtcblxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge307XG4iLCJ0cnlcblx0aWYgcHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnXG5cdFx0c3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcblx0XHRvYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJylcblx0XHRtb2xlY3VsZXIgPSByZXF1aXJlKFwibW9sZWN1bGVyXCIpO1xuXHRcdHBhY2thZ2VMb2FkZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGVvci1wYWNrYWdlLWxvYWRlcicpO1xuXHRcdEFQSVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLWFwaScpO1xuXHRcdE1ldGFkYXRhU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0YWRhdGEtc2VydmVyJyk7XG5cdFx0cGFja2FnZVNlcnZpY2UgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIpO1xuXHRcdHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXHRcdGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcblx0XHRzZXR0aW5ncyA9IHtcblx0XHRcdGJ1aWx0X2luX3BsdWdpbnM6IFtcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1zcGFjZVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLW9iamVjdC1kYXRhYmFzZVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3MtYXBwcm92YWxcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1jb2xsYWJvcmF0aW9uXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc3RhbmRhcmQtdWlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1wZXJtaXNzaW9uXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvd2ViYXBwLXB1YmxpY1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2FjaGVycy1tYW5hZ2VyXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvdW5wa2dcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93b3JrZmxvd1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL2FjY291bnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvcGx1Z2luLWNvbXBhbnlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9tZXRhZGF0YS1hcGlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9kYXRhLWltcG9ydFwiLFxuXHRcdFx0XHQjIFwiQHN0ZWVkb3Mvc2VydmljZS1maWVsZHMtaW5kZXhzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1hY2NvdW50c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2hhcnRzXCIsXG5cdFx0XHRcdCMgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIsXG5cdFx0ICAgXHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXRvb2xcIixcblx0XHRcdFx0IyBcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3NcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93ZWJhcHAtYWNjb3VudHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLXdvcmtmbG93XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wbHVnaW4tYW1pc1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtZmlsZXNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLXNlbnRyeVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtaWRlbnRpdHktand0XCJcblx0XHRcdF0sXG5cdFx0XHRwbHVnaW5zOiBjb25maWcucGx1Z2luc1xuXHRcdH1cblx0XHRNZXRlb3Iuc3RhcnR1cCAtPlxuXHRcdFx0dHJ5XG5cdFx0XHRcdGJyb2tlciA9IG5ldyBtb2xlY3VsZXIuU2VydmljZUJyb2tlcih7XG5cdFx0XHRcdFx0bmFtZXNwYWNlOiBcInN0ZWVkb3NcIixcblx0XHRcdFx0XHRub2RlSUQ6IFwic3RlZWRvcy1jcmVhdG9yXCIsXG5cdFx0XHRcdFx0bWV0YWRhdGE6IHt9LFxuXHRcdFx0XHRcdHRyYW5zcG9ydGVyOiBwcm9jZXNzLmVudi5UUkFOU1BPUlRFUixcblx0XHRcdFx0XHRjYWNoZXI6IHByb2Nlc3MuZW52LkNBQ0hFUixcblx0XHRcdFx0XHRsb2dMZXZlbDogXCJ3YXJuXCIsXG5cdFx0XHRcdFx0c2VyaWFsaXplcjogXCJKU09OXCIsXG5cdFx0XHRcdFx0cmVxdWVzdFRpbWVvdXQ6IDYwICogMTAwMCxcblx0XHRcdFx0XHRtYXhDYWxsTGV2ZWw6IDEwMCxcblxuXHRcdFx0XHRcdGhlYXJ0YmVhdEludGVydmFsOiAxMCxcblx0XHRcdFx0XHRoZWFydGJlYXRUaW1lb3V0OiAzMCxcblxuXHRcdFx0XHRcdGNvbnRleHRQYXJhbXNDbG9uaW5nOiBmYWxzZSxcblxuXHRcdFx0XHRcdHRyYWNraW5nOiB7XG5cdFx0XHRcdFx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHRcdFx0XHRcdHNodXRkb3duVGltZW91dDogNTAwMCxcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0ZGlzYWJsZUJhbGFuY2VyOiBmYWxzZSxcblxuXHRcdFx0XHRcdHJlZ2lzdHJ5OiB7XG5cdFx0XHRcdFx0XHRzdHJhdGVneTogXCJSb3VuZFJvYmluXCIsXG5cdFx0XHRcdFx0XHRwcmVmZXJMb2NhbDogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHRidWxraGVhZDoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRjb25jdXJyZW5jeTogMTAsXG5cdFx0XHRcdFx0XHRtYXhRdWV1ZVNpemU6IDEwMCxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHZhbGlkYXRvcjogdHJ1ZSxcblx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IG51bGwsXG5cdFx0XHRcdFx0dHJhY2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRleHBvcnRlcjoge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIkNvbnNvbGVcIixcblx0XHRcdFx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdFx0XHRcdGxvZ2dlcjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcnM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHRcdFx0XHRnYXVnZVdpZHRoOiA0MFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRza2lwUHJvY2Vzc0V2ZW50UmVnaXN0cmF0aW9uOiB0cnVlLFxuXG5cdFx0XHRcdFx0Y3JlYXRlZDogKGJyb2tlciktPiBcblx0XHRcdFx0XHRcdCMgQ2xlYXIgYWxsIGNhY2hlIGVudHJpZXNcblx0XHRcdFx0XHRcdGJyb2tlci5sb2dnZXIud2FybignQ2xlYXIgYWxsIGNhY2hlIGVudHJpZXMgb24gc3RhcnR1cC4nKVxuXHRcdFx0XHRcdFx0YnJva2VyLmNhY2hlci5jbGVhbigpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRvYmplY3RxbC5icm9rZXIuaW5pdChicm9rZXIpO1xuXG5cdFx0XHRcdG9iamVjdHFsU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHJlcXVpcmUoXCJAc3RlZWRvcy9zZXJ2aWNlLW9iamVjdHFsXCIpKTtcblx0XHRcdFx0XG5cdFx0XHRcdHByb2plY3RTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6IFwicHJvamVjdC1zZXJ2ZXJcIixcblx0XHRcdFx0XHRuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuXHRcdFx0XHRcdG1peGluczogW3BhY2thZ2VTZXJ2aWNlXSxcblx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHRtZXRhZGF0YVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogJ21ldGFkYXRhLXNlcnZlcicsXG5cdFx0XHRcdFx0bWl4aW5zOiBbTWV0YWRhdGFTZXJ2aWNlXSxcblx0XHRcdFx0XHRzZXR0aW5nczoge1xuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHVpU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHJlcXVpcmUoXCJAc3RlZWRvcy9zZXJ2aWNlLXVpXCIpKTtcblxuXHRcdFx0XHRhcGlTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6IFwiYXBpXCIsXG5cdFx0XHRcdFx0bWl4aW5zOiBbQVBJU2VydmljZV0sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdHBvcnQ6IG51bGxcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRwYWdlU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiBcIkBzdGVlZG9zL3NlcnZpY2UtcGFnZXNcIixcblx0XHRcdFx0XHRtaXhpbnM6IFtyZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzJyldLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRwb3J0OiBudWxsXG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0c3RlZWRvc1NlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogXCJzdGVlZG9zLXNlcnZlclwiLFxuXHRcdFx0XHRcdG1peGluczogW10sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdHBvcnQ6IG51bGxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN0YXJ0ZWQ6ICgpLT5cblx0XHRcdFx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0XHRcdFx0YnJva2VyLmVtaXQgJ3N0ZWVkb3Mtc2VydmVyLnN0YXJ0ZWQnXG5cdFx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdFx0LCAxMDAwXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdG9iamVjdHFsLmdldFN0ZWVkb3NTY2hlbWEoYnJva2VyKTtcblx0XHRcdFx0c3RhbmRhcmRPYmplY3RzRGlyID0gb2JqZWN0cWwuU3RhbmRhcmRPYmplY3RzUGF0aDtcblx0XHRcdFx0c3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogJ3N0YW5kYXJkLW9iamVjdHMnLFxuXHRcdFx0XHRcdG1peGluczogW3BhY2thZ2VMb2FkZXJdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7IHBhY2thZ2VJbmZvOiB7XG5cdFx0XHRcdFx0XHRwYXRoOiBzdGFuZGFyZE9iamVjdHNEaXIsXG5cdFx0XHRcdFx0fSB9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdE1ldGVvci53cmFwQXN5bmMoKGNiKS0+XG5cdFx0XHRcdFx0YnJva2VyLnN0YXJ0KCkudGhlbigoKS0+XG5cdFx0XHRcdFx0XHRpZiAhYnJva2VyLnN0YXJ0ZWQgXG5cdFx0XHRcdFx0XHRcdGJyb2tlci5fcmVzdGFydFNlcnZpY2Uob2JqZWN0cWxTZXJ2aWNlKTtcblx0XHRcdFx0XHRcdFx0YnJva2VyLl9yZXN0YXJ0U2VydmljZShzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSk7XG5cdFx0XHRcdFx0XHRcdGJyb2tlci5fcmVzdGFydFNlcnZpY2UodWlTZXJ2aWNlKTtcblxuXHRcdFx0XHRcdFx0ZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcblx0XHRcdFx0XHRcdGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MgPSBleHByZXNzKCk7XG5cdFx0XHRcdFx0XHRjb25uZWN0SGFuZGxlcnNFeHByZXNzLnVzZShyZXF1aXJlKCdAc3RlZWRvcy9yb3V0ZXInKS5zdGF0aWNSb3V0ZXIoKSk7XG5cdFx0XHRcdFx0XHRicm9rZXIud2FpdEZvclNlcnZpY2VzKCd+cGFja2FnZXMtQHN0ZWVkb3Mvc2VydmljZS11aScpLnRoZW4gKCktPlxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnd2FpdEZvclNlcnZpY2VzIH5wYWNrYWdlcy1Ac3RlZWRvcy9zZXJ2aWNlLXVpJylcblx0XHRcdFx0XHRcdFx0Y29ubmVjdEhhbmRsZXJzRXhwcmVzcy51c2UoU3RlZWRvc0FwaS5leHByZXNzKCkpXG5cdFx0XHRcdFx0XHRcdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MpXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdCMgc3RlZWRvc0NvcmUuaW5pdChzZXR0aW5ncykudGhlbiAoKS0+XG5cdFx0XHRcdFx0XHQjIFx0Y2IoKTtcblxuXHRcdFx0XHRcdFx0YnJva2VyLndhaXRGb3JTZXJ2aWNlcyhzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZS5uYW1lKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG5cdFx0XHRcdFx0XHRcdHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4gKCktPlxuXHRcdFx0XHRcdFx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCkoKVxuXHRcdFx0Y2F0Y2ggZXhcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcImVycm9yOlwiLGV4KVxuY2F0Y2ggZVxuXHRjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsZSkiLCJ2YXIgQVBJU2VydmljZSwgTWV0YWRhdGFTZXJ2aWNlLCBjb25maWcsIGUsIG1vbGVjdWxlciwgb2JqZWN0cWwsIHBhY2thZ2VMb2FkZXIsIHBhY2thZ2VTZXJ2aWNlLCBwYXRoLCBzZXR0aW5ncywgc3RlZWRvc0NvcmU7XG5cbnRyeSB7XG4gIGlmIChwcm9jZXNzLmVudi5DUkVBVE9SX05PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJyk7XG4gICAgb2JqZWN0cWwgPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpO1xuICAgIG1vbGVjdWxlciA9IHJlcXVpcmUoXCJtb2xlY3VsZXJcIik7XG4gICAgcGFja2FnZUxvYWRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0ZW9yLXBhY2thZ2UtbG9hZGVyJyk7XG4gICAgQVBJU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtYXBpJyk7XG4gICAgTWV0YWRhdGFTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRhZGF0YS1zZXJ2ZXInKTtcbiAgICBwYWNrYWdlU2VydmljZSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9zZXJ2aWNlLXBhY2thZ2UtcmVnaXN0cnlcIik7XG4gICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICBjb25maWcgPSBvYmplY3RxbC5nZXRTdGVlZG9zQ29uZmlnKCk7XG4gICAgc2V0dGluZ3MgPSB7XG4gICAgICBidWlsdF9pbl9wbHVnaW5zOiBbXCJAc3RlZWRvcy9zdGFuZGFyZC1zcGFjZVwiLCBcIkBzdGVlZG9zL3N0YW5kYXJkLW9iamVjdC1kYXRhYmFzZVwiLCBcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3MtYXBwcm92YWxcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1jb2xsYWJvcmF0aW9uXCIsIFwiQHN0ZWVkb3Mvc3RhbmRhcmQtdWlcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1wZXJtaXNzaW9uXCIsIFwiQHN0ZWVkb3Mvd2ViYXBwLXB1YmxpY1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtY2FjaGVycy1tYW5hZ2VyXCIsIFwiQHN0ZWVkb3MvdW5wa2dcIiwgXCJAc3RlZWRvcy93b3JrZmxvd1wiLCBcIkBzdGVlZG9zL2FjY291bnRzXCIsIFwiQHN0ZWVkb3MvcGx1Z2luLWNvbXBhbnlcIiwgXCJAc3RlZWRvcy9tZXRhZGF0YS1hcGlcIiwgXCJAc3RlZWRvcy9kYXRhLWltcG9ydFwiLCBcIkBzdGVlZG9zL3NlcnZpY2UtYWNjb3VudHNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWNoYXJ0c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS1yZWdpc3RyeVwiLCBcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS10b29sXCIsIFwiQHN0ZWVkb3Mvd2ViYXBwLWFjY291bnRzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS13b3JrZmxvd1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtcGx1Z2luLWFtaXNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWZpbGVzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1zZW50cnlcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWlkZW50aXR5LWp3dFwiXSxcbiAgICAgIHBsdWdpbnM6IGNvbmZpZy5wbHVnaW5zXG4gICAgfTtcbiAgICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcGlTZXJ2aWNlLCBicm9rZXIsIGV4LCBtZXRhZGF0YVNlcnZpY2UsIG9iamVjdHFsU2VydmljZSwgcGFnZVNlcnZpY2UsIHByb2plY3RTZXJ2aWNlLCBzdGFuZGFyZE9iamVjdHNEaXIsIHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlLCBzdGVlZG9zU2VydmljZSwgdWlTZXJ2aWNlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYnJva2VyID0gbmV3IG1vbGVjdWxlci5TZXJ2aWNlQnJva2VyKHtcbiAgICAgICAgICBuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuICAgICAgICAgIG5vZGVJRDogXCJzdGVlZG9zLWNyZWF0b3JcIixcbiAgICAgICAgICBtZXRhZGF0YToge30sXG4gICAgICAgICAgdHJhbnNwb3J0ZXI6IHByb2Nlc3MuZW52LlRSQU5TUE9SVEVSLFxuICAgICAgICAgIGNhY2hlcjogcHJvY2Vzcy5lbnYuQ0FDSEVSLFxuICAgICAgICAgIGxvZ0xldmVsOiBcIndhcm5cIixcbiAgICAgICAgICBzZXJpYWxpemVyOiBcIkpTT05cIixcbiAgICAgICAgICByZXF1ZXN0VGltZW91dDogNjAgKiAxMDAwLFxuICAgICAgICAgIG1heENhbGxMZXZlbDogMTAwLFxuICAgICAgICAgIGhlYXJ0YmVhdEludGVydmFsOiAxMCxcbiAgICAgICAgICBoZWFydGJlYXRUaW1lb3V0OiAzMCxcbiAgICAgICAgICBjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG4gICAgICAgICAgdHJhY2tpbmc6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgc2h1dGRvd25UaW1lb3V0OiA1MDAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkaXNhYmxlQmFsYW5jZXI6IGZhbHNlLFxuICAgICAgICAgIHJlZ2lzdHJ5OiB7XG4gICAgICAgICAgICBzdHJhdGVneTogXCJSb3VuZFJvYmluXCIsXG4gICAgICAgICAgICBwcmVmZXJMb2NhbDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVsa2hlYWQ6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgY29uY3VycmVuY3k6IDEwLFxuICAgICAgICAgICAgbWF4UXVldWVTaXplOiAxMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHZhbGlkYXRvcjogdHJ1ZSxcbiAgICAgICAgICBlcnJvckhhbmRsZXI6IG51bGwsXG4gICAgICAgICAgdHJhY2luZzoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBleHBvcnRlcjoge1xuICAgICAgICAgICAgICB0eXBlOiBcIkNvbnNvbGVcIixcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGxvZ2dlcjogbnVsbCxcbiAgICAgICAgICAgICAgICBjb2xvcnM6IHRydWUsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICAgICAgICBnYXVnZVdpZHRoOiA0MFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBza2lwUHJvY2Vzc0V2ZW50UmVnaXN0cmF0aW9uOiB0cnVlLFxuICAgICAgICAgIGNyZWF0ZWQ6IGZ1bmN0aW9uKGJyb2tlcikge1xuICAgICAgICAgICAgYnJva2VyLmxvZ2dlci53YXJuKCdDbGVhciBhbGwgY2FjaGUgZW50cmllcyBvbiBzdGFydHVwLicpO1xuICAgICAgICAgICAgcmV0dXJuIGJyb2tlci5jYWNoZXIuY2xlYW4oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBvYmplY3RxbC5icm9rZXIuaW5pdChicm9rZXIpO1xuICAgICAgICBvYmplY3RxbFNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZShyZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1vYmplY3RxbFwiKSk7XG4gICAgICAgIHByb2plY3RTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6IFwicHJvamVjdC1zZXJ2ZXJcIixcbiAgICAgICAgICBuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuICAgICAgICAgIG1peGluczogW3BhY2thZ2VTZXJ2aWNlXVxuICAgICAgICB9KTtcbiAgICAgICAgbWV0YWRhdGFTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6ICdtZXRhZGF0YS1zZXJ2ZXInLFxuICAgICAgICAgIG1peGluczogW01ldGFkYXRhU2VydmljZV0sXG4gICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgIH0pO1xuICAgICAgICB1aVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZShyZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS11aVwiKSk7XG4gICAgICAgIGFwaVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogXCJhcGlcIixcbiAgICAgICAgICBtaXhpbnM6IFtBUElTZXJ2aWNlXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcG9ydDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhZ2VTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6IFwiQHN0ZWVkb3Mvc2VydmljZS1wYWdlc1wiLFxuICAgICAgICAgIG1peGluczogW3JlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtcGFnZXMnKV0sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHBvcnQ6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzdGVlZG9zU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiBcInN0ZWVkb3Mtc2VydmVyXCIsXG4gICAgICAgICAgbWl4aW5zOiBbXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcG9ydDogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3RhcnRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgYnJva2VyLmVtaXQoJ3N0ZWVkb3Mtc2VydmVyLnN0YXJ0ZWQnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9iamVjdHFsLmdldFN0ZWVkb3NTY2hlbWEoYnJva2VyKTtcbiAgICAgICAgc3RhbmRhcmRPYmplY3RzRGlyID0gb2JqZWN0cWwuU3RhbmRhcmRPYmplY3RzUGF0aDtcbiAgICAgICAgc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogJ3N0YW5kYXJkLW9iamVjdHMnLFxuICAgICAgICAgIG1peGluczogW3BhY2thZ2VMb2FkZXJdLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbzoge1xuICAgICAgICAgICAgICBwYXRoOiBzdGFuZGFyZE9iamVjdHNEaXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihjYikge1xuICAgICAgICAgIHJldHVybiBicm9rZXIuc3RhcnQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MsIGV4cHJlc3M7XG4gICAgICAgICAgICBpZiAoIWJyb2tlci5zdGFydGVkKSB7XG4gICAgICAgICAgICAgIGJyb2tlci5fcmVzdGFydFNlcnZpY2Uob2JqZWN0cWxTZXJ2aWNlKTtcbiAgICAgICAgICAgICAgYnJva2VyLl9yZXN0YXJ0U2VydmljZShzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSk7XG4gICAgICAgICAgICAgIGJyb2tlci5fcmVzdGFydFNlcnZpY2UodWlTZXJ2aWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG4gICAgICAgICAgICBjb25uZWN0SGFuZGxlcnNFeHByZXNzID0gZXhwcmVzcygpO1xuICAgICAgICAgICAgY29ubmVjdEhhbmRsZXJzRXhwcmVzcy51c2UocmVxdWlyZSgnQHN0ZWVkb3Mvcm91dGVyJykuc3RhdGljUm91dGVyKCkpO1xuICAgICAgICAgICAgYnJva2VyLndhaXRGb3JTZXJ2aWNlcygnfnBhY2thZ2VzLUBzdGVlZG9zL3NlcnZpY2UtdWknKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnd2FpdEZvclNlcnZpY2VzIH5wYWNrYWdlcy1Ac3RlZWRvcy9zZXJ2aWNlLXVpJyk7XG4gICAgICAgICAgICAgIGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MudXNlKFN0ZWVkb3NBcGkuZXhwcmVzcygpKTtcbiAgICAgICAgICAgICAgcmV0dXJuIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gYnJva2VyLndhaXRGb3JTZXJ2aWNlcyhzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZS5uYW1lKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gc3RlZWRvc0NvcmUuaW5pdChzZXR0aW5ncykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4ID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgZSA9IGVycm9yO1xuICBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGUpO1xufVxuIiwiQ3JlYXRvci5kZXBzID0ge1xuXHRhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcblx0b2JqZWN0OiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG59O1xuXG5DcmVhdG9yLl9URU1QTEFURSA9IHtcblx0QXBwczoge30sXG5cdE9iamVjdHM6IHt9XG59XG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcblxuIyBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMg5L6bc3RlZWRvcy1jbGnpobnnm67kvb/nlKhcbmlmIE1ldGVvci5pc1NlcnZlclxuXHRGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpXG5cdENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XG5cdFx0RmliZXIoKCktPlxuXHRcdFx0Q3JlYXRvci5sb2FkT2JqZWN0cyhvYmosIG9iamVjdF9uYW1lKVxuXHRcdCkucnVuKClcblxuQ3JlYXRvci5sb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gb2JqLm5hbWVcblxuXHRpZiAhb2JqLmxpc3Rfdmlld3Ncblx0XHRvYmoubGlzdF92aWV3cyA9IHt9XG5cblx0aWYgb2JqLnNwYWNlXG5cdFx0b2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iailcblx0aWYgb2JqZWN0X25hbWUgPT0gJ2Nmc19maWxlc19maWxlcmVjb3JkJ1xuXHRcdG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xuXHRcdG9iaiA9IF8uY2xvbmUob2JqKVxuXHRcdG9iai5uYW1lID0gb2JqZWN0X25hbWVcblx0XHRDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqXG5cblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iailcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG5cblx0Q3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcblx0cmV0dXJuIG9ialxuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxuXHRpZiBvYmplY3Quc3BhY2Vcblx0XHRyZXR1cm4gXCJjXyN7b2JqZWN0LnNwYWNlfV8je29iamVjdC5uYW1lfVwiXG5cdHJldHVybiBvYmplY3QubmFtZVxuXG5DcmVhdG9yLmdldE9iamVjdCA9IChvYmplY3RfbmFtZSwgc3BhY2VfaWQpLT5cblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxuXHRcdHJldHVybiA7XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG4jXHRpZiAhc3BhY2VfaWQgJiYgb2JqZWN0X25hbWVcbiNcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50ICYmICFvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjXycpXG4jXHRcdFx0c3BhY2VfaWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblxuXHRpZiBvYmplY3RfbmFtZVxuI1x0XHRpZiBzcGFjZV9pZFxuI1x0XHRcdG9iaiA9IENyZWF0b3Iub2JqZWN0c0J5TmFtZVtcImNfI3tzcGFjZV9pZH1fI3tvYmplY3RfbmFtZX1cIl1cbiNcdFx0XHRpZiBvYmpcbiNcdFx0XHRcdHJldHVybiBvYmpcbiNcbiNcdFx0b2JqID0gXy5maW5kIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG8pLT5cbiNcdFx0XHRcdHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT0gb2JqZWN0X25hbWVcbiNcdFx0aWYgb2JqXG4jXHRcdFx0cmV0dXJuIG9ialxuXG5cdFx0cmV0dXJuIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gKG9iamVjdF9pZCktPlxuXHRyZXR1cm4gXy5maW5kV2hlcmUoQ3JlYXRvci5vYmplY3RzQnlOYW1lLCB7X2lkOiBvYmplY3RfaWR9KVxuXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IChvYmplY3RfbmFtZSktPlxuXHRjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSlcblx0ZGVsZXRlIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0ZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkKS0+XG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRpZiBvYmplY3RfbmFtZVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0cmV0dXJuIGRiW29iamVjdF9uYW1lXVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW0NyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uX2NvbGxlY3Rpb25fbmFtZSB8fCBvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5yZW1vdmVDb2xsZWN0aW9uID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXVxuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRzcGFjZSA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpPy5kYj8uZmluZE9uZShzcGFjZUlkLHtmaWVsZHM6e2FkbWluczoxfX0pXG5cdGlmIHNwYWNlPy5hZG1pbnNcblx0XHRyZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwXG5cblxuQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEgPSAoZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpLT5cblxuXHRpZiAhXy5pc1N0cmluZyhmb3JtdWxhcilcblx0XHRyZXR1cm4gZm9ybXVsYXJcblxuXHRpZiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmb3JtdWxhcilcblx0XHRyZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpXG5cblx0cmV0dXJuIGZvcm11bGFyXG5cbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGNvbnRleHQpLT5cblx0c2VsZWN0b3IgPSB7fVxuXHRfLmVhY2ggZmlsdGVycywgKGZpbHRlciktPlxuXHRcdGlmIGZpbHRlcj8ubGVuZ3RoID09IDNcblx0XHRcdG5hbWUgPSBmaWx0ZXJbMF1cblx0XHRcdGFjdGlvbiA9IGZpbHRlclsxXVxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpXG5cdFx0XHRzZWxlY3RvcltuYW1lXSA9IHt9XG5cdFx0XHRzZWxlY3RvcltuYW1lXVthY3Rpb25dID0gdmFsdWVcblx0IyBjb25zb2xlLmxvZyhcImV2YWx1YXRlRmlsdGVycy0tPnNlbGVjdG9yXCIsIHNlbGVjdG9yKVxuXHRyZXR1cm4gc2VsZWN0b3JcblxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gKHNwYWNlSWQpIC0+XG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXG5cbiMjI1xuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4jIyNcbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpLT5cblxuXHRpZiAhaWRfa2V5XG5cdFx0aWRfa2V5ID0gXCJfaWRcIlxuXG5cdGlmIGhpdF9maXJzdFxuXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcblx0XHR2YWx1ZXMgPSBkb2NzLmdldFByb3BlcnR5KGlkX2tleSlcblxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0XHRcdF9pbmRleCA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXHRcdFx0XHRcdGlmIF9pbmRleCA+IC0xXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSlcblx0ZWxzZVxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0cmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXG4jIyNcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuIyMjXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSAodmFsdWUxLCB2YWx1ZTIpIC0+XG5cdGlmIHRoaXMua2V5XG5cdFx0dmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XVxuXHRcdHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV1cblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKClcblx0aWYgdmFsdWUyIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcblx0aWYgdHlwZW9mIHZhbHVlMSBpcyBcIm51bWJlclwiIGFuZCB0eXBlb2YgdmFsdWUyIGlzIFwibnVtYmVyXCJcblx0XHRyZXR1cm4gdmFsdWUxIC0gdmFsdWUyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcblx0aXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PSBudWxsIG9yIHZhbHVlMSA9PSB1bmRlZmluZWRcblx0aXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PSBudWxsIG9yIHZhbHVlMiA9PSB1bmRlZmluZWRcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gLTFcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAwXG5cdGlmICFpc1ZhbHVlMUVtcHR5IGFuZCBpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIDFcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxuXHRyZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSB2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlXG5cblxuIyDor6Xlh73mlbDlj6rlnKjliJ3lp4vljJZPYmplY3Tml7bvvIzmiornm7jlhbPlr7nosaHnmoTorqHnrpfnu5Pmnpzkv53lrZjliLBPYmplY3TnmoRyZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3vvIzlkI7nu63lj6/ku6Xnm7TmjqXku45yZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3lj5blvpforqHnrpfnu5PmnpzogIzkuI3nlKjlho3mrKHosIPnlKjor6Xlh73mlbDmnaXorqHnrpdcbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRyZWxhdGVkX29iamVjdHMgPSBbXVxuXHQjIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXG5cdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGlmICFfb2JqZWN0XG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXHRcblx0cmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0XG5cdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XG5cdFx0cmVsYXRlZExpc3RNYXAgPSB7fVxuXHRcdF8uZWFjaCByZWxhdGVkTGlzdCwgKG9iak5hbWUpLT5cblx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqTmFtZVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtvYmpOYW1lLm9iamVjdE5hbWVdID0ge31cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fVxuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxuXHRcdFx0XHRpZiAocmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lIGFuZCByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdFx0XHRcdCMg5b2TcmVsYXRlZF9vYmplY3QuZmllbGRz5Lit5pyJ5Lik5Liq5oiW5Lul5LiK55qE5a2X5q615oyH5ZCRb2JqZWN0X25hbWXooajnpLrnmoTlr7nosaHml7bvvIzkvJjlhYjlj5bnrKzkuIDkuKrkvZzkuLrlpJbplK7lhbPns7vlrZfmrrXvvIzkvYbmmK9yZWxhdGVkX2ZpZWxk5Li65Li75a2Q6KGo5pe25by66KGM6KaG55uW5LmL5YmN55qEcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV3lgLxcblx0XHRcdFx0XHRpZiBfLmlzRW1wdHkgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gfHwgcmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHsgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIH1cblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ11cblx0XHRcdHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHsgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiIH1cblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ11cblx0XHRcdHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSA9IHsgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIiB9XG5cdFx0Xy5lYWNoIFsndGFza3MnLCAnbm90ZXMnLCAnZXZlbnRzJywgJ2FwcHJvdmFscyddLCAoZW5hYmxlT2JqTmFtZSktPlxuXHRcdFx0aWYgcmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV1cblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0gPSB7IG9iamVjdF9uYW1lOiBlbmFibGVPYmpOYW1lLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCIgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ11cblx0XHRcdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4Fcblx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSlcblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7IG9iamVjdF9uYW1lOlwiYXVkaXRfcmVjb3Jkc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCIgfVxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IF8udmFsdWVzIHJlbGF0ZWRMaXN0TWFwXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG5cdGlmIF9vYmplY3QuZW5hYmxlX2ZpbGVzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwifVxuXG5cdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXG5cdFx0XHQjIGNmcy5maWxlcy5maWxlcmVjb3Jk5a+56LGh5Zyo56ys5LqM5qyh54K55Ye755qE5pe25YCZcmVsYXRlZF9vYmplY3Tov5Tlm57nmoTmmK9hcHAtYnVpbGRlcuS4reeahFwibWV0YWRhdGEucGFyZW50XCLlrZfmrrXooqvliKDpmaTkuobvvIzorrDliLBtZXRhZGF0YeWtl+auteeahHN1Yl9maWVsZHPkuK3kuobvvIzmiYDku6XopoHljZXni6zlpITnkIbjgIJcblx0XHRcdHNmc0ZpbGVzT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKVxuXHRcdFx0c2ZzRmlsZXNPYmplY3QgJiYgcmVsYXRlZF9vYmplY3QgPSBzZnNGaWxlc09iamVjdFxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiICYmIHJlbGF0ZWRfZmllbGQucmVsYXRlZExpc3QpKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXG5cdFx0XHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfZmllbGRzXCJcblx0XHRcdFx0XHQjVE9ETyDlvoXnm7jlhbPliJfooajmlK/mjIHmjpLluo/lkI7vvIzliKDpmaTmraTliKTmlq1cblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lfSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZH1cblxuXHRpZiBfb2JqZWN0LmVuYWJsZV90YXNrc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcInRhc2tzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfbm90ZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJub3Rlc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX2V2ZW50c1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImV2ZW50c1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX2luc3RhbmNlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImluc3RhbmNlc1wiLCBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX2FwcHJvdmFsc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImFwcHJvdmFsc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX3Byb2Nlc3Ncblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJwcm9jZXNzX2luc3RhbmNlX2hpc3RvcnlcIiwgZm9yZWlnbl9rZXk6IFwidGFyZ2V0X29iamVjdFwifVxuXHQjcmVjb3JkIOivpue7huS4i+eahGF1ZGl0X3JlY29yZHPku4Vtb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5Y+v6KeBXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSlcblx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXVkaXRfcmVjb3Jkc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHJldHVybiBDcmVhdG9yLlVTRVJfQ09OVEVYVFxuXHRlbHNlXG5cdFx0aWYgISh1c2VySWQgYW5kIHNwYWNlSWQpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJ0aGUgcGFyYW1zIHVzZXJJZCBhbmQgc3BhY2VJZCBpcyByZXF1aXJlZCBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0VXNlckNvbnRleHRcIlxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRzdUZpZWxkcyA9IHtuYW1lOiAxLCBtb2JpbGU6IDEsIHBvc2l0aW9uOiAxLCBlbWFpbDogMSwgY29tcGFueTogMSwgb3JnYW5pemF0aW9uOiAxLCBzcGFjZTogMSwgY29tcGFueV9pZDogMSwgY29tcGFueV9pZHM6IDF9XG5cdFx0IyBjaGVjayBpZiB1c2VyIGluIHRoZSBzcGFjZVxuXHRcdHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXG5cdFx0aWYgIXN1XG5cdFx0XHRzcGFjZUlkID0gbnVsbFxuXG5cdFx0IyBpZiBzcGFjZUlkIG5vdCBleGlzdHMsIGdldCB0aGUgZmlyc3Qgb25lLlxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRpZiBpc1VuU2FmZU1vZGVcblx0XHRcdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7dXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxuXHRcdFx0XHRpZiAhc3Vcblx0XHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0XHRzcGFjZUlkID0gc3Uuc3BhY2Vcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdFVTRVJfQ09OVEVYVCA9IHt9XG5cdFx0VVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZFxuXHRcdFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZFxuXHRcdFVTRVJfQ09OVEVYVC51c2VyID0ge1xuXHRcdFx0X2lkOiB1c2VySWRcblx0XHRcdG5hbWU6IHN1Lm5hbWUsXG5cdFx0XHRtb2JpbGU6IHN1Lm1vYmlsZSxcblx0XHRcdHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcblx0XHRcdGVtYWlsOiBzdS5lbWFpbFxuXHRcdFx0Y29tcGFueTogc3UuY29tcGFueVxuXHRcdFx0Y29tcGFueV9pZDogc3UuY29tcGFueV9pZFxuXHRcdFx0Y29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXG5cdFx0fVxuXHRcdHNwYWNlX3VzZXJfb3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKT8uZmluZE9uZShzdS5vcmdhbml6YXRpb24pXG5cdFx0aWYgc3BhY2VfdXNlcl9vcmdcblx0XHRcdFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcblx0XHRcdFx0X2lkOiBzcGFjZV91c2VyX29yZy5faWQsXG5cdFx0XHRcdG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXG5cdFx0XHRcdGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxuXHRcdFx0fVxuXHRcdHJldHVybiBVU0VSX0NPTlRFWFRcblxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9ICh1cmwpLT5cblxuXHRpZiBfLmlzRnVuY3Rpb24oU3RlZWRvcy5pc0NvcmRvdmEpICYmIFN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgKHVybD8uc3RhcnRzV2l0aChcIi9hc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIHx8IHVybD8uc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSlcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcblx0XHRyZXR1cm4gdXJsXG5cblx0aWYgdXJsXG5cdFx0IyB1cmzlvIDlpLTmsqHmnIlcIi9cIu+8jOmcgOimgea3u+WKoFwiL1wiXG5cdFx0aWYgIS9eXFwvLy50ZXN0KHVybClcblx0XHRcdHVybCA9IFwiL1wiICsgdXJsXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmxcblx0ZWxzZVxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYXG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9ICh1c2VySWQsIHNwYWNlSWQpLT5cblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpXG5cdGVsc2Vcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKVxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWQ6MX19KVxuXHRyZXR1cm4gc3UuY29tcGFueV9pZFxuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gKHVzZXJJZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcblx0ZWxzZVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZHM6MX19KVxuXHRyZXR1cm4gc3U/LmNvbXBhbnlfaWRzXG5cbkNyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zID0gKHBvKS0+XG5cdGlmIHBvLmFsbG93Q3JlYXRlXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0VkaXRcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLmFsbG93RGVsZXRlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8udmlld0FsbFJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxuXHRpZiBwby52aWV3Q29tcGFueVJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHRwby52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cdFx0XG5cdCMg5aaC5p6c6ZmE5Lu255u45YWz5p2D6ZmQ6YWN572u5Li656m677yM5YiZ5YW85a655LmL5YmN5rKh5pyJ6ZmE5Lu25p2D6ZmQ6YWN572u5pe255qE6KeE5YiZXG5cdGlmIHBvLmFsbG93UmVhZFxuXHRcdHR5cGVvZiBwby5hbGxvd1JlYWRGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0XHR0eXBlb2YgcG8udmlld0FsbEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLnZpZXdBbGxGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0XG5cdFx0dHlwZW9mIHBvLmFsbG93Q3JlYXRlRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8uYWxsb3dDcmVhdGVGaWxlcyA9IHRydWVcblx0XHR0eXBlb2YgcG8uYWxsb3dFZGl0RmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlXG5cdFx0dHlwZW9mIHBvLmFsbG93RGVsZXRlRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdHR5cGVvZiBwby5tb2RpZnlBbGxGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5tb2RpZnlBbGxGaWxlcyA9IHRydWVcblxuXHRpZiBwby5hbGxvd0NyZWF0ZUZpbGVzXG5cdFx0cG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdGlmIHBvLmFsbG93RWRpdEZpbGVzXG5cdFx0cG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdGlmIHBvLmFsbG93RGVsZXRlRmlsZXNcblx0XHRwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8udmlld0FsbEZpbGVzXG5cdFx0cG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdGlmIHBvLm1vZGlmeUFsbEZpbGVzXG5cdFx0cG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdFx0cG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWVcblx0XHRwby52aWV3QWxsRmlsZXMgPSB0cnVlXG5cblx0cmV0dXJuIHBvXG5cbkNyZWF0b3IuZ2V0VGVtcGxhdGVTcGFjZUlkID0gKCktPlxuXHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8udGVtcGxhdGVTcGFjZUlkXG5cbkNyZWF0b3IuZ2V0Q2xvdWRBZG1pblNwYWNlSWQgPSAoKS0+XG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5jbG91ZEFkbWluU3BhY2VJZFxuXG5DcmVhdG9yLmlzVGVtcGxhdGVTcGFjZSA9IChzcGFjZUlkKS0+XG5cdGlmIHNwYWNlSWQgJiYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8udGVtcGxhdGVTcGFjZUlkID09IHNwYWNlSWRcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZSA9IChzcGFjZUlkKS0+XG5cdGlmIHNwYWNlSWQgJiYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWQgPT0gc3BhY2VJZFxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVJcblx0IiwidmFyIEZpYmVyO1xuXG5DcmVhdG9yLmRlcHMgPSB7XG4gIGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeSxcbiAgb2JqZWN0OiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG59O1xuXG5DcmVhdG9yLl9URU1QTEFURSA9IHtcbiAgQXBwczoge30sXG4gIE9iamVjdHM6IHt9XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGZpbHRlcnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgb3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIHJldHVybiBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgY3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbn0pO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG4gIENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5sb2FkT2JqZWN0cyhvYmosIG9iamVjdF9uYW1lKTtcbiAgICB9KS5ydW4oKTtcbiAgfTtcbn1cblxuQ3JlYXRvci5sb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqLm5hbWU7XG4gIH1cbiAgaWYgKCFvYmoubGlzdF92aWV3cykge1xuICAgIG9iai5saXN0X3ZpZXdzID0ge307XG4gIH1cbiAgaWYgKG9iai5zcGFjZSkge1xuICAgIG9iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmopO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSA9PT0gJ2Nmc19maWxlc19maWxlcmVjb3JkJykge1xuICAgIG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJztcbiAgICBvYmogPSBfLmNsb25lKG9iaik7XG4gICAgb2JqLm5hbWUgPSBvYmplY3RfbmFtZTtcbiAgICBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqO1xuICB9XG4gIENyZWF0b3IuY29udmVydE9iamVjdChvYmopO1xuICBuZXcgQ3JlYXRvci5PYmplY3Qob2JqKTtcbiAgQ3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICByZXR1cm4gb2JqO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3Quc3BhY2UpIHtcbiAgICByZXR1cm4gXCJjX1wiICsgb2JqZWN0LnNwYWNlICsgXCJfXCIgKyBvYmplY3QubmFtZTtcbiAgfVxuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmLCByZWYxO1xuICBpZiAoXy5pc0FycmF5KG9iamVjdF9uYW1lKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKChyZWYgPSBDcmVhdG9yLmRlcHMpICE9IG51bGwpIHtcbiAgICAgIGlmICgocmVmMSA9IHJlZi5vYmplY3QpICE9IG51bGwpIHtcbiAgICAgICAgcmVmMS5kZXBlbmQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IGZ1bmN0aW9uKG9iamVjdF9pZCkge1xuICByZXR1cm4gXy5maW5kV2hlcmUoQ3JlYXRvci5vYmplY3RzQnlOYW1lLCB7XG4gICAgX2lkOiBvYmplY3RfaWRcbiAgfSk7XG59O1xuXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKTtcbiAgZGVsZXRlIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbn07XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgcmV0dXJuIGRiW29iamVjdF9uYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbKChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuX2NvbGxlY3Rpb25fbmFtZSA6IHZvaWQgMCkgfHwgb2JqZWN0X25hbWVdO1xuICAgIH1cbiAgfVxufTtcblxuQ3JlYXRvci5yZW1vdmVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXTtcbn07XG5cbkNyZWF0b3IuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciByZWYsIHJlZjEsIHNwYWNlO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBzcGFjZSA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmRiKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHNwYWNlSWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGFkbWluczogMVxuICAgIH1cbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIGlmIChzcGFjZSAhPSBudWxsID8gc3BhY2UuYWRtaW5zIDogdm9pZCAwKSB7XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfVxufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucykge1xuICBpZiAoIV8uaXNTdHJpbmcoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIGZvcm11bGFyO1xuICB9XG4gIGlmIChDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG4gIHJldHVybiBmb3JtdWxhcjtcbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgY29udGV4dCkge1xuICB2YXIgc2VsZWN0b3I7XG4gIHNlbGVjdG9yID0ge307XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgYWN0aW9uLCBuYW1lLCB2YWx1ZTtcbiAgICBpZiAoKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLmxlbmd0aCA6IHZvaWQgMCkgPT09IDMpIHtcbiAgICAgIG5hbWUgPSBmaWx0ZXJbMF07XG4gICAgICBhY3Rpb24gPSBmaWx0ZXJbMV07XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgY29udGV4dCk7XG4gICAgICBzZWxlY3RvcltuYW1lXSA9IHt9O1xuICAgICAgcmV0dXJuIHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQ29tbW9uU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHJldHVybiBzcGFjZUlkID09PSAnY29tbW9uJztcbn07XG5cblxuLypcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuICovXG5cbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gZnVuY3Rpb24oZG9jcywgaWRzLCBpZF9rZXksIGhpdF9maXJzdCkge1xuICB2YXIgdmFsdWVzO1xuICBpZiAoIWlkX2tleSkge1xuICAgIGlkX2tleSA9IFwiX2lkXCI7XG4gIH1cbiAgaWYgKGhpdF9maXJzdCkge1xuICAgIHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KTtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICB2YXIgX2luZGV4O1xuICAgICAgX2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgICAgaWYgKF9pbmRleCA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfaW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaWRzLmxlbmd0aCArIF8uaW5kZXhPZih2YWx1ZXMsIGRvY1tpZF9rZXldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICByZXR1cm4gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5cbi8qXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiAqL1xuXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSBmdW5jdGlvbih2YWx1ZTEsIHZhbHVlMikge1xuICB2YXIgaXNWYWx1ZTFFbXB0eSwgaXNWYWx1ZTJFbXB0eSwgbG9jYWxlO1xuICBpZiAodGhpcy5rZXkpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldO1xuICAgIHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV07XG4gIH1cbiAgaWYgKHZhbHVlMSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlMSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgdmFsdWUyID09PSBcIm51bWJlclwiKSB7XG4gICAgcmV0dXJuIHZhbHVlMSAtIHZhbHVlMjtcbiAgfVxuICBpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09PSBudWxsIHx8IHZhbHVlMSA9PT0gdm9pZCAwO1xuICBpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09PSBudWxsIHx8IHZhbHVlMiA9PT0gdm9pZCAwO1xuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiAhaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgaWYgKCFpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICByZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSh2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlKTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRMaXN0LCByZWxhdGVkTGlzdE1hcCwgcmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmICFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgcmVsYXRlZExpc3RNYXAgPSB7fTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3QsIGZ1bmN0aW9uKG9iak5hbWUpIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KG9iak5hbWUpKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lLm9iamVjdE5hbWVdID0ge307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgcmVsYXRlZF9maWVsZC50eXBlID09PSBcImxvb2t1cFwiKSAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUgJiYgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0pIHtcbiAgICAgICAgICBpZiAoXy5pc0VtcHR5KHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7XG4gICAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICAgIH07XG4gICAgfVxuICAgIF8uZWFjaChbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgZnVuY3Rpb24oZW5hYmxlT2JqTmFtZSkge1xuICAgICAgaWYgKHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSxcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSkge1xuICAgICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyhyZWxhdGVkTGlzdE1hcCk7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZmlsZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgc2ZzRmlsZXNPYmplY3Q7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgICAgc2ZzRmlsZXNPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpO1xuICAgICAgc2ZzRmlsZXNPYmplY3QgJiYgKHJlbGF0ZWRfb2JqZWN0ID0gc2ZzRmlsZXNPYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiAmJiByZWxhdGVkX2ZpZWxkLnJlbGF0ZWRMaXN0KSkgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcIm9iamVjdF9maWVsZHNcIikge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBpZiAoX29iamVjdC5lbmFibGVfdGFza3MpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJ0YXNrc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX25vdGVzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwibm90ZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ldmVudHMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJldmVudHNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9pbnN0YW5jZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9hcHByb3ZhbHMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJhcHByb3ZhbHNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9wcm9jZXNzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwicHJvY2Vzc19pbnN0YW5jZV9oaXN0b3J5XCIsXG4gICAgICBmb3JlaWduX2tleTogXCJ0YXJnZXRfb2JqZWN0XCJcbiAgICB9KTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpIHtcbiAgdmFyIFVTRVJfQ09OVEVYVCwgcmVmLCBzcGFjZV91c2VyX29yZywgc3UsIHN1RmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUO1xuICB9IGVsc2Uge1xuICAgIGlmICghKHVzZXJJZCAmJiBzcGFjZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN1RmllbGRzID0ge1xuICAgICAgbmFtZTogMSxcbiAgICAgIG1vYmlsZTogMSxcbiAgICAgIHBvc2l0aW9uOiAxLFxuICAgICAgZW1haWw6IDEsXG4gICAgICBjb21wYW55OiAxLFxuICAgICAgb3JnYW5pemF0aW9uOiAxLFxuICAgICAgc3BhY2U6IDEsXG4gICAgICBjb21wYW55X2lkOiAxLFxuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9O1xuICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgfSk7XG4gICAgaWYgKCFzdSkge1xuICAgICAgc3BhY2VJZCA9IG51bGw7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgaWYgKGlzVW5TYWZlTW9kZSkge1xuICAgICAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghc3UpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzcGFjZUlkID0gc3Uuc3BhY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgVVNFUl9DT05URVhUID0ge307XG4gICAgVVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZDtcbiAgICBVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWQ7XG4gICAgVVNFUl9DT05URVhULnVzZXIgPSB7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIG5hbWU6IHN1Lm5hbWUsXG4gICAgICBtb2JpbGU6IHN1Lm1vYmlsZSxcbiAgICAgIHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcbiAgICAgIGVtYWlsOiBzdS5lbWFpbCxcbiAgICAgIGNvbXBhbnk6IHN1LmNvbXBhbnksXG4gICAgICBjb21wYW55X2lkOiBzdS5jb21wYW55X2lkLFxuICAgICAgY29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXG4gICAgfTtcbiAgICBzcGFjZV91c2VyX29yZyA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpKSAhPSBudWxsID8gcmVmLmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKSA6IHZvaWQgMDtcbiAgICBpZiAoc3BhY2VfdXNlcl9vcmcpIHtcbiAgICAgIFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcbiAgICAgICAgX2lkOiBzcGFjZV91c2VyX29yZy5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXG4gICAgICAgIGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFVTRVJfQ09OVEVYVDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICBpZiAoXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICgodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9hc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSA6IHZvaWQgMCkpKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBpZiAodXJsKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWQ6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UuY29tcGFueV9pZDtcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdSAhPSBudWxsID8gc3UuY29tcGFueV9pZHMgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHBvKSB7XG4gIGlmIChwby5hbGxvd0NyZWF0ZSkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93UmVhZCkge1xuICAgIHR5cGVvZiBwby5hbGxvd1JlYWRGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZSk7XG4gICAgdHlwZW9mIHBvLnZpZXdBbGxGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLnZpZXdBbGxGaWxlcyA9IHRydWUpO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICB0eXBlb2YgcG8uYWxsb3dDcmVhdGVGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93Q3JlYXRlRmlsZXMgPSB0cnVlKTtcbiAgICB0eXBlb2YgcG8uYWxsb3dFZGl0RmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd0VkaXRGaWxlcyA9IHRydWUpO1xuICAgIHR5cGVvZiBwby5hbGxvd0RlbGV0ZUZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWUpO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgdHlwZW9mIHBvLm1vZGlmeUFsbEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8ubW9kaWZ5QWxsRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8uYWxsb3dDcmVhdGVGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0RmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlRmlsZXMpIHtcbiAgICBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWU7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsRmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZTtcbiAgICBwby52aWV3QWxsRmlsZXMgPSB0cnVlO1xuICB9XG4gIHJldHVybiBwbztcbn07XG5cbkNyZWF0b3IuZ2V0VGVtcGxhdGVTcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0Q2xvdWRBZG1pblNwYWNlSWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYuY2xvdWRBZG1pblNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmlzVGVtcGxhdGVTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKHNwYWNlSWQgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYudGVtcGxhdGVTcGFjZUlkIDogdm9pZCAwKSA9PT0gc3BhY2VJZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwKSA9PT0gc3BhY2VJZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVI7XG59XG4iLCJNZXRlb3IubWV0aG9kc1xuXHQjIOeUqOaIt+iOt+WPlmxvb2t1cCDjgIFtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q6155qE6YCJ6aG55YC8XG5cdFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiAob3B0aW9ucyktPlxuXHRcdGlmIG9wdGlvbnM/LnBhcmFtcz8ucmVmZXJlbmNlX3RvXG5cblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpXG5cblx0XHRcdG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cblx0XHRcdHF1ZXJ5ID0ge31cblx0XHRcdGlmIG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cdFx0XHRcdHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2VcblxuXHRcdFx0XHRzb3J0ID0gb3B0aW9ucz8uc29ydFxuXG5cdFx0XHRcdHNlbGVjdGVkID0gb3B0aW9ucz8uc2VsZWN0ZWQgfHwgW11cblxuXHRcdFx0XHRvcHRpb25zX2xpbWl0ID0gb3B0aW9ucz8ub3B0aW9uc19saW1pdCB8fCAxMFxuXG5cdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeSA9IHt9XG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH1cblxuXHRcdFx0XHRpZiBvcHRpb25zPy52YWx1ZXM/Lmxlbmd0aFxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX0sIHNlYXJjaFRleHRRdWVyeV1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fV1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0Xy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSlcblx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JG5pbjogc2VsZWN0ZWR9XG5cblx0XHRcdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxuXG5cdFx0XHRcdGlmIG9wdGlvbnMuZmlsdGVyUXVlcnlcblx0XHRcdFx0XHRfLmV4dGVuZCBxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeVxuXG5cdFx0XHRcdHF1ZXJ5X29wdGlvbnMgPSB7bGltaXQ6IG9wdGlvbnNfbGltaXR9XG5cblx0XHRcdFx0aWYgc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpXG5cdFx0XHRcdFx0cXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydFxuXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKClcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBbXVxuXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY29yZHMsIChyZWNvcmQpLT5cblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcmVjb3JkLl9pZFxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcblx0XHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpXG5cdFx0cmV0dXJuIFtdICIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZSwgbmFtZV9maWVsZF9rZXksIG9iamVjdCwgb3B0aW9uc19saW1pdCwgcXVlcnksIHF1ZXJ5X29wdGlvbnMsIHJlY29yZHMsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2VhcmNoVGV4dFF1ZXJ5LCBzZWxlY3RlZCwgc29ydDtcbiAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZiA9IG9wdGlvbnMucGFyYW1zKSAhPSBudWxsID8gcmVmLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSk7XG4gICAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5wYXJhbXMuc3BhY2UpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZTtcbiAgICAgICAgc29ydCA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc29ydCA6IHZvaWQgMDtcbiAgICAgICAgc2VsZWN0ZWQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zZWxlY3RlZCA6IHZvaWQgMCkgfHwgW107XG4gICAgICAgIG9wdGlvbnNfbGltaXQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5vcHRpb25zX2xpbWl0IDogdm9pZCAwKSB8fCAxMDtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7XG4gICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYxID0gb3B0aW9ucy52YWx1ZXMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VhcmNoVGV4dFF1ZXJ5XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAkbmluOiBzZWxlY3RlZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyUXVlcnkpIHtcbiAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgcXVlcnlfb3B0aW9ucyA9IHtcbiAgICAgICAgICBsaW1pdDogb3B0aW9uc19saW1pdFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpKSB7XG4gICAgICAgICAgcXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpO1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHJlY29yZHMsIGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLl9pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKSAtPlxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpPy5fc2NoZW1hXG5cdGNvbHVtbl9udW0gPSAwXG5cdGlmIF9zY2hlbWFcblx0XHRfLmVhY2ggY29sdW1ucywgKGZpZWxkX25hbWUpIC0+XG5cdFx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxuXHRcdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxuXHRcdFx0aWYgaXNfd2lkZVxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDJcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y29sdW1uX251bSArPSAxXG5cblx0XHRpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtXG5cdFx0cmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudFxuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSAtPlxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWFcblx0aWYgX3NjaGVtYVxuXHRcdGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpXG5cdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxuXHRcdHJldHVybiBpc193aWRlXG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIC0+XG5cdHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zPy5zZXR0aW5ncz8uZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wifSlcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBfLm1hcCBjb2x1bW5zLCAoY29sdW1uKS0+XG5cdFx0ZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl1cblx0XHRpZiBmaWVsZD8udHlwZSBhbmQgIWZpZWxkLmhpZGRlblxuXHRcdFx0cmV0dXJuIGNvbHVtblxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0Y29sdW1ucyA9IF8uY29tcGFjdCBjb2x1bW5zXG5cdGlmIHNldHRpbmcgYW5kIHNldHRpbmcuc2V0dGluZ3Ncblx0XHRzb3J0ID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdPy5zb3J0IHx8IFtdXG5cdFx0c29ydCA9IF8ubWFwIHNvcnQsIChvcmRlciktPlxuXHRcdFx0a2V5ID0gb3JkZXJbMF1cblx0XHRcdGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSlcblx0XHRcdG9yZGVyWzBdID0gaW5kZXggKyAxXG5cdFx0XHRyZXR1cm4gb3JkZXJcblx0XHRyZXR1cm4gc29ydFxuXHRyZXR1cm4gW11cblxuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXG5cdGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXVxuXHRkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdXG5cdGlmIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xuXHRcdGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uIGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xuXG5cdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW11cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0Q3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHM/W29iamVjdF9uYW1lXSA9IFtdXG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gKGRlZmF1bHRfdmlldywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSktPlxuXHRkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/LmNvbHVtbnNcblx0ZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldz8ubW9iaWxlX2NvbHVtbnNcblx0dW5sZXNzIGxpc3Rfdmlld1xuXHRcdHJldHVyblxuXHRvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KVxuXHRpZiAhXy5oYXMob2l0ZW0sIFwibmFtZVwiKVxuXHRcdG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZVxuXHRpZiAhb2l0ZW0uY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRfY29sdW1uc1xuXHRcdFx0b2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1uc1xuXHRpZiAhb2l0ZW0uY29sdW1uc1xuXHRcdG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdXG5cdGlmICFvaXRlbS5tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcblx0XHRcdG9pdGVtLm1vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF9tb2JpbGVfY29sdW1uc1xuXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpXG5cdFx0XHRvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJylcblxuXG5cdGlmICFvaXRlbS5maWx0ZXJfc2NvcGVcblx0XHQjIGxpc3R2aWV36KeG5Zu+55qEZmlsdGVyX3Njb3Bl6buY6K6k5YC85pS55Li6c3BhY2UgIzEzMVxuXHRcdG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIlxuXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJfaWRcIilcblx0XHRvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZVxuXHRlbHNlXG5cdFx0b2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZVxuXG5cdGlmIF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucylcblx0XHRvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKVxuXG5cdF8uZm9yRWFjaCBvaXRlbS5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cblx0XHRpZiAhXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXG5cdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXG5cdHJldHVybiBvaXRlbVxuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gKG9iamVjdF9uYW1lKS0+XG5cdFx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0XHRyZXR1cm5cblx0XHRyZWxhdGVkTGlzdE9iamVjdHMgPSB7fVxuXHRcdHJlbGF0ZWRMaXN0TmFtZXMgPSBbXVxuXHRcdG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyA9IFtdO1xuXHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiBfb2JqZWN0XG5cdFx0XHRsYXlvdXRSZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZF9saXN0cztcblx0XHRcdCMgbGF5b3V0UmVsYXRlZExpc3Qg5piv5pWw57uE5bCx6KGo56S66YWN572u6L+H6aG16Z2i5biD5bGA77yM5bCx5ZCv55So6aG16Z2i5biD5bGA55qE55u45YWz5a2Q6KGo44CCXG5cdFx0XHRpZiBfLmlzQXJyYXkgbGF5b3V0UmVsYXRlZExpc3Rcblx0XHRcdFx0Xy5lYWNoIGxheW91dFJlbGF0ZWRMaXN0LCAoaXRlbSktPlxuXHRcdFx0XHRcdHJlT2JqZWN0TmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdFx0cmVGaWVsZE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gQ3JlYXRvci5nZXRPYmplY3QocmVPYmplY3ROYW1lKT8uZmllbGRzW3JlRmllbGROYW1lXT8ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiByZU9iamVjdE5hbWVcblx0XHRcdFx0XHRcdGNvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXNcblx0XHRcdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzXG5cdFx0XHRcdFx0XHRpc19maWxlOiByZU9iamVjdE5hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uOiBpdGVtLmZpbHRlcnNcblx0XHRcdFx0XHRcdHNvcnQ6IGl0ZW0uc29ydFxuXHRcdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiByZUZpZWxkTmFtZVxuXHRcdFx0XHRcdFx0Y3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWVcblx0XHRcdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXHRcdFx0XHRcdFx0bGFiZWw6IGl0ZW0ubGFiZWxcblx0XHRcdFx0XHRcdGFjdGlvbnM6IGl0ZW0uYnV0dG9uc1xuXHRcdFx0XHRcdFx0dmlzaWJsZV9vbjogaXRlbS52aXNpYmxlX29uXG5cdFx0XHRcdFx0XHRwYWdlX3NpemU6IGl0ZW0ucGFnZV9zaXplXG5cdFx0XHRcdFx0b2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLnB1c2gocmVsYXRlZClcblx0XHRcdFx0cmV0dXJuIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cztcblx0XHRcdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxuXHRcdFx0aWYgIV8uaXNFbXB0eSByZWxhdGVkTGlzdFxuXHRcdFx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpPck5hbWUpLT5cblx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0IG9iak9yTmFtZVxuXHRcdFx0XHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmpPck5hbWUub2JqZWN0TmFtZVxuXHRcdFx0XHRcdFx0XHRjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1uc1xuXHRcdFx0XHRcdFx0XHRtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdFx0XHRcdGlzX2ZpbGU6IG9iak9yTmFtZS5vYmplY3ROYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdFx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uOiBvYmpPck5hbWUuZmlsdGVyc1xuXHRcdFx0XHRcdFx0XHRzb3J0OiBvYmpPck5hbWUuc29ydFxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6ICcnXG5cdFx0XHRcdFx0XHRcdGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlXG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBvYmpPck5hbWUubGFiZWxcblx0XHRcdFx0XHRcdFx0YWN0aW9uczogb2JqT3JOYW1lLmFjdGlvbnNcblx0XHRcdFx0XHRcdFx0cGFnZV9zaXplOiBvYmpPck5hbWUucGFnZV9zaXplXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE9iamVjdHNbb2JqT3JOYW1lLm9iamVjdE5hbWVdID0gcmVsYXRlZFxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3ROYW1lcy5wdXNoIG9iak9yTmFtZS5vYmplY3ROYW1lXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzU3RyaW5nIG9iak9yTmFtZVxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3ROYW1lcy5wdXNoIG9iak9yTmFtZVxuXG5cdFx0bWFwTGlzdCA9IHt9XG5cdFx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3RfaXRlbSkgLT5cblx0XHRcdGlmICFyZWxhdGVkX29iamVjdF9pdGVtPy5vYmplY3RfbmFtZVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5XG5cdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSlcblx0XHRcdHVubGVzcyByZWxhdGVkX29iamVjdFxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cblx0XHRcdGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxuXHRcdFx0bW9iaWxlX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRydWUpIHx8IFtcIm5hbWVcIl1cblx0XHRcdG1vYmlsZV9jb2x1bW5zID0gXy53aXRob3V0KG1vYmlsZV9jb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpXG5cblx0XHRcdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKVxuXHRcdFx0dGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucylcblxuXHRcdFx0aWYgL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpXG5cdFx0XHRcdCMgb2JqZWN057G75Z6L5bim5a2Q5bGe5oCn55qEcmVsYXRlZF9maWVsZF9uYW1l6KaB5Y675o6J5Lit6Ze055qE576O5YWD56ym5Y+377yM5ZCm5YiZ5pi+56S65LiN5Ye65a2X5q615YC8XG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLFwiXCIpXG5cdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0b2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWVcblx0XHRcdFx0Y29sdW1uczogY29sdW1uc1xuXHRcdFx0XHRtb2JpbGVfY29sdW1uczogbW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiByZWxhdGVkX2ZpZWxkX25hbWVcblx0XHRcdFx0aXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXG5cdFx0XHRyZWxhdGVkT2JqZWN0ID0gcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuY29sdW1uc1xuXHRcdFx0XHRcdHJlbGF0ZWQuY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QuY29sdW1uc1xuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdFx0cmVsYXRlZC5tb2JpbGVfY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5zb3J0XG5cdFx0XHRcdFx0cmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uXG5cdFx0XHRcdFx0cmVsYXRlZC5maWx0ZXJzRnVuY3Rpb24gPSByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvblxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XG5cdFx0XHRcdFx0cmVsYXRlZC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCA9IHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Rcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5sYWJlbFxuXHRcdFx0XHRcdHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QucGFnZV9zaXplXG5cdFx0XHRcdFx0cmVsYXRlZC5wYWdlX3NpemUgPSByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZVxuXHRcdFx0XHRkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cblx0XHRcdG1hcExpc3RbcmVsYXRlZC5vYmplY3RfbmFtZV0gPSByZWxhdGVkXG5cblxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKVxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHNcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcblx0XHRfLmVhY2ggcmVsYXRlZExpc3RPYmplY3RzLCAodiwgcmVsYXRlZF9vYmplY3RfbmFtZSkgLT5cblx0XHRcdGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xXG5cdFx0XHRhbGxvd1JlYWQgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmFsbG93UmVhZFxuXHRcdFx0aWYgaXNBY3RpdmUgJiYgYWxsb3dSZWFkXG5cdFx0XHRcdG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2XG5cblx0XHRsaXN0ID0gW11cblx0XHRpZiBfLmlzRW1wdHkgcmVsYXRlZExpc3ROYW1lc1xuXHRcdFx0bGlzdCA9ICBfLnZhbHVlcyBtYXBMaXN0XG5cdFx0ZWxzZVxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0TmFtZXMsIChvYmplY3ROYW1lKSAtPlxuXHRcdFx0XHRpZiBtYXBMaXN0W29iamVjdE5hbWVdXG5cdFx0XHRcdFx0bGlzdC5wdXNoIG1hcExpc3Rbb2JqZWN0TmFtZV1cblxuXHRcdGlmIF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpXG5cdFx0XHRsaXN0ID0gXy5maWx0ZXIgbGlzdCwgKGl0ZW0pLT5cblx0XHRcdFx0cmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKVxuXG5cdFx0cmV0dXJuIGxpc3RcblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gKG9iamVjdF9uYW1lKS0+XG5cdHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSlcblxuIyMjIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiMjI1xuQ3JlYXRvci5nZXRMaXN0VmlldyA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRyZXR1cm5cblx0bGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXG5cdHVubGVzcyBsaXN0Vmlld3M/Lmxlbmd0aFxuXHRcdHJldHVyblxuXHRsaXN0X3ZpZXcgPSBfLmZpbmQobGlzdFZpZXdzLCAoaXRlbSktPiByZXR1cm4gaXRlbS5faWQgPT0gbGlzdF92aWV3X2lkIHx8IGl0ZW0ubmFtZSA9PSBsaXN0X3ZpZXdfaWQpXG5cdHVubGVzcyBsaXN0X3ZpZXdcblx0XHQjIOWmguaenOS4jemcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOWImem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvu+8jOWPjeS5i+i/lOWbnuepulxuXHRcdGlmIGV4YWNcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXVxuXHRyZXR1cm4gbGlzdF92aWV3XG5cbiPojrflj5ZsaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77mmK/lkKbmmK/mnIDov5Hmn6XnnIvop4blm75cbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0aWYgdHlwZW9mKGxpc3Rfdmlld19pZCkgPT0gXCJzdHJpbmdcIlxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmICFvYmplY3Rcblx0XHRcdHJldHVyblxuXHRcdGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3Mse19pZDogbGlzdF92aWV3X2lkfSlcblx0ZWxzZVxuXHRcdGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkXG5cdHJldHVybiBsaXN0Vmlldz8ubmFtZSA9PSBcInJlY2VudFwiXG5cblxuIyMjXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcblx06KeE5YiZ77yaXG5cdDEu5LyY5YWI5oqKY29sdW1uc+S4reeahG5hbWXlrZfmrrXmjpLlnKjnrKzkuIDkuKpcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXG4jIyNcbkNyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpLT5cblx0cmVzdWx0ID0gW11cblx0bWF4Um93cyA9IDIgXG5cdG1heENvdW50ID0gbWF4Um93cyAqIDJcblx0Y291bnQgPSAwXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRmaWVsZHMgPSBvYmplY3QuZmllbGRzXG5cdHVubGVzcyBvYmplY3Rcblx0XHRyZXR1cm4gY29sdW1uc1xuXHRuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cdGlzTmFtZUNvbHVtbiA9IChpdGVtKS0+XG5cdFx0aWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0cmV0dXJuIGl0ZW0uZmllbGQgPT0gbmFtZUtleVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBpdGVtID09IG5hbWVLZXlcblx0Z2V0RmllbGQgPSAoaXRlbSktPlxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdHJldHVybiBmaWVsZHNbaXRlbS5maWVsZF1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW1dXG5cdGlmIG5hbWVLZXlcblx0XHRuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kIChpdGVtKS0+XG5cdFx0XHRyZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pXG5cdGlmIG5hbWVDb2x1bW5cblx0XHRmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXG5cdFx0Y291bnQgKz0gaXRlbUNvdW50XG5cdFx0cmVzdWx0LnB1c2ggbmFtZUNvbHVtblxuXHRjb2x1bW5zLmZvckVhY2ggKGl0ZW0pLT5cblx0XHRmaWVsZCA9IGdldEZpZWxkKGl0ZW0pXG5cdFx0dW5sZXNzIGZpZWxkXG5cdFx0XHRyZXR1cm5cblx0XHRpdGVtQ291bnQgPSBpZiBmaWVsZC5pc193aWRlIHRoZW4gMiBlbHNlIDFcblx0XHRpZiBjb3VudCA8IG1heENvdW50IGFuZCByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgYW5kICFpc05hbWVDb2x1bW4oaXRlbSlcblx0XHRcdGNvdW50ICs9IGl0ZW1Db3VudFxuXHRcdFx0aWYgY291bnQgPD0gbWF4Q291bnRcblx0XHRcdFx0cmVzdWx0LnB1c2ggaXRlbVxuXHRcblx0cmV0dXJuIHJlc3VsdFxuXG4jIyNcbiAgICDojrflj5bpu5jorqTop4blm75cbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IChvYmplY3RfbmFtZSktPlxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0aWYgb2JqZWN0Py5saXN0X3ZpZXdzPy5kZWZhdWx0XG5cdFx0I1RPRE8g5q2k5Luj56CB5Y+q5piv5pqC5pe25YW85a655Lul5YmNY29kZeS4reWumuS5ieeahGRlZmF1bHTop4blm77vvIzlvoVjb2Rl5Lit55qEZGVmYXVsdOa4heeQhuWujOaIkOWQju+8jOmcgOimgeWIoOmZpOatpOS7o+eggVxuXHRcdGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3MuZGVmYXVsdFxuXHRlbHNlXG5cdFx0Xy5lYWNoIG9iamVjdD8ubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KS0+XG5cdFx0XHRpZiBsaXN0X3ZpZXcubmFtZSA9PSBcImFsbFwiIHx8IGtleSA9PSBcImFsbFwiXG5cdFx0XHRcdGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3XG5cdHJldHVybiBkZWZhdWx0VmlldztcblxuIyMjXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMgPSAob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucyktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBkZWZhdWx0Vmlldz8uY29sdW1uc1xuXHRpZiB1c2VfbW9iaWxlX2NvbHVtbnNcblx0XHRpZiBkZWZhdWx0Vmlldz8ubW9iaWxlX2NvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1uc1xuXHRcdGVsc2UgaWYgY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpXG5cdHJldHVybiBjb2x1bW5zXG5cbiMjI1xuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOesrOS4gOS4quinhuWbvuaYvuekuueahOWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zID0gKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBkZWZhdWx0Vmlldz8uY29sdW1uc1xuXHRpZiB1c2VfbW9iaWxlX2NvbHVtbnNcblx0XHRpZiBkZWZhdWx0Vmlldz8ubW9iaWxlX2NvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1uc1xuXHRcdGVsc2UgaWYgY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpXG5cdHJldHVybiBjb2x1bW5zXG5cbiMjI1xuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0cmV0dXJuIGRlZmF1bHRWaWV3Py5leHRyYV9jb2x1bW5zXG5cbiMjI1xuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IChvYmplY3RfbmFtZSktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXG5cdGlmIGRlZmF1bHRWaWV3XG5cdFx0aWYgZGVmYXVsdFZpZXcuc29ydFxuXHRcdFx0cmV0dXJuIGRlZmF1bHRWaWV3LnNvcnRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXVxuXG5cbiMjI1xuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XG4jIyNcbkNyZWF0b3IuaXNBbGxWaWV3ID0gKGxpc3RfdmlldyktPlxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwiYWxsXCJcblxuIyMjXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiMjI1xuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSAobGlzdF92aWV3KS0+XG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJyZWNlbnRcIlxuXG4jIyNcbiAgICDlsIZzb3J06L2s5o2i5Li6VGFidWxhcuaOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuIyMjXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSAoc29ydCwgdGFidWxhckNvbHVtbnMpLT5cblx0dGFidWxhcl9zb3J0ID0gW11cblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXG5cdFx0XHQjIOWFvOWuueaXp+eahOaVsOaNruagvOW8j1tbXCJmaWVsZF9uYW1lXCIsIFwib3JkZXJcIl1dXG5cdFx0XHRpZiBpdGVtLmxlbmd0aCA9PSAxXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBcImFzY1wiXVxuXHRcdFx0ZWxzZSBpZiBpdGVtLmxlbmd0aCA9PSAyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBpdGVtWzFdXVxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgb3JkZXJdXG5cblx0cmV0dXJuIHRhYnVsYXJfc29ydFxuXG4jIyNcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuIyMjXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gKHNvcnQpLT5cblx0ZHhfc29ydCA9IFtdXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxuXHRcdGlmIF8uaXNBcnJheShpdGVtKVxuXHRcdFx0I+WFvOWuueaXp+agvOW8j++8mltbXCJmaWVsZF9uYW1lXCIsIFwib3JkZXJcIl1dXG5cdFx0XHRkeF9zb3J0LnB1c2goaXRlbSlcblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdCPmlrDmlbDmja7moLzlvI/vvJpbe2ZpZWxkX25hbWU6ICwgb3JkZXI6IH1dXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcblx0XHRcdGlmIGZpZWxkX25hbWUgJiYgb3JkZXJcblx0XHRcdFx0ZHhfc29ydC5wdXNoIFtmaWVsZF9uYW1lLCBvcmRlcl1cblxuXHRyZXR1cm4gZHhfc29ydFxuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIF9zY2hlbWEsIGNvbHVtbl9udW0sIGluaXRfd2lkdGhfcGVyY2VudCwgcmVmO1xuICBfc2NoZW1hID0gKHJlZiA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5fc2NoZW1hIDogdm9pZCAwO1xuICBjb2x1bW5fbnVtID0gMDtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgICAgdmFyIGZpZWxkLCBpc193aWRlLCByZWYxLCByZWYyO1xuICAgICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgICBpc193aWRlID0gKHJlZjEgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjIuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc193aWRlKSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW07XG4gICAgcmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSB7XG4gIHZhciBfc2NoZW1hLCBmaWVsZCwgaXNfd2lkZSwgcmVmLCByZWYxO1xuICBfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWE7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgaXNfd2lkZSA9IChyZWYgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIHJldHVybiBpc193aWRlO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgdmFyIG9iaiwgcmVmLCByZWYxLCByZWYyLCBzZXR0aW5nLCBzb3J0O1xuICBzZXR0aW5nID0gKHJlZiA9IENyZWF0b3IuQ29sbGVjdGlvbnMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5zZXR0aW5ncykgIT0gbnVsbCA/IHJlZjEuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IF8ubWFwKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgIHZhciBmaWVsZDtcbiAgICBmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXTtcbiAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSAmJiAhZmllbGQuaGlkZGVuKSB7XG4gICAgICByZXR1cm4gY29sdW1uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgfSk7XG4gIGNvbHVtbnMgPSBfLmNvbXBhY3QoY29sdW1ucyk7XG4gIGlmIChzZXR0aW5nICYmIHNldHRpbmcuc2V0dGluZ3MpIHtcbiAgICBzb3J0ID0gKChyZWYyID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gcmVmMi5zb3J0IDogdm9pZCAwKSB8fCBbXTtcbiAgICBzb3J0ID0gXy5tYXAoc29ydCwgZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgIHZhciBpbmRleCwga2V5O1xuICAgICAga2V5ID0gb3JkZXJbMF07XG4gICAgICBpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpO1xuICAgICAgb3JkZXJbMF0gPSBpbmRleCArIDE7XG4gICAgICByZXR1cm4gb3JkZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucywgZXh0cmFfY29sdW1ucywgb2JqZWN0LCBvcmRlciwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICBleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl07XG4gIGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl07XG4gIGlmIChkZWZhdWx0X2V4dHJhX2NvbHVtbnMpIHtcbiAgICBleHRyYV9jb2x1bW5zID0gXy51bmlvbihleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMpO1xuICB9XG4gIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW107XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gKHJlZiA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzKSAhPSBudWxsID8gcmVmW29iamVjdF9uYW1lXSA9IFtdIDogdm9pZCAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IGZ1bmN0aW9uKGRlZmF1bHRfdmlldywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSkge1xuICB2YXIgZGVmYXVsdF9jb2x1bW5zLCBkZWZhdWx0X21vYmlsZV9jb2x1bW5zLCBvaXRlbTtcbiAgZGVmYXVsdF9jb2x1bW5zID0gZGVmYXVsdF92aWV3ICE9IG51bGwgPyBkZWZhdWx0X3ZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldyAhPSBudWxsID8gZGVmYXVsdF92aWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIHJldHVybjtcbiAgfVxuICBvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KTtcbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpKSB7XG4gICAgb2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lO1xuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdO1xuICB9XG4gIGlmICghb2l0ZW0ubW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9tb2JpbGVfY29sdW1ucykge1xuICAgICAgb2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJyk7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uZmlsdGVyX3Njb3BlKSB7XG4gICAgb2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiO1xuICB9XG4gIGlmICghXy5oYXMob2l0ZW0sIFwiX2lkXCIpKSB7XG4gICAgb2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWU7XG4gIH0gZWxzZSB7XG4gICAgb2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZTtcbiAgfVxuICBpZiAoXy5pc1N0cmluZyhvaXRlbS5vcHRpb25zKSkge1xuICAgIG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpO1xuICB9XG4gIF8uZm9yRWFjaChvaXRlbS5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgIGlmICghXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2l0ZW07XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVsYXRlZExpc3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciBfb2JqZWN0LCBsYXlvdXRSZWxhdGVkTGlzdCwgbGlzdCwgbWFwTGlzdCwgb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TmFtZXMsIHJlbGF0ZWRMaXN0T2JqZWN0cywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgc3BhY2VJZCwgdW5yZWxhdGVkX29iamVjdHMsIHVzZXJJZDtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlbGF0ZWRMaXN0T2JqZWN0cyA9IHt9O1xuICAgIHJlbGF0ZWRMaXN0TmFtZXMgPSBbXTtcbiAgICBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMgPSBbXTtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICBsYXlvdXRSZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZF9saXN0cztcbiAgICAgIGlmIChfLmlzQXJyYXkobGF5b3V0UmVsYXRlZExpc3QpKSB7XG4gICAgICAgIF8uZWFjaChsYXlvdXRSZWxhdGVkTGlzdCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHZhciByZUZpZWxkTmFtZSwgcmVPYmplY3ROYW1lLCByZWYsIHJlZjEsIHJlbGF0ZWQsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgICAgICAgIHJlT2JqZWN0TmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIHJlRmllbGROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QocmVPYmplY3ROYW1lKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmZpZWxkc1tyZUZpZWxkTmFtZV0pICE9IG51bGwgPyByZWYxLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVPYmplY3ROYW1lLFxuICAgICAgICAgICAgY29sdW1uczogaXRlbS5maWVsZF9uYW1lcyxcbiAgICAgICAgICAgIG1vYmlsZV9jb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzLFxuICAgICAgICAgICAgaXNfZmlsZTogcmVPYmplY3ROYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICAgICAgZmlsdGVyc0Z1bmN0aW9uOiBpdGVtLmZpbHRlcnMsXG4gICAgICAgICAgICBzb3J0OiBpdGVtLnNvcnQsXG4gICAgICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlRmllbGROYW1lLFxuICAgICAgICAgICAgY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWUsXG4gICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQsXG4gICAgICAgICAgICBsYWJlbDogaXRlbS5sYWJlbCxcbiAgICAgICAgICAgIGFjdGlvbnM6IGl0ZW0uYnV0dG9ucyxcbiAgICAgICAgICAgIHZpc2libGVfb246IGl0ZW0udmlzaWJsZV9vbixcbiAgICAgICAgICAgIHBhZ2Vfc2l6ZTogaXRlbS5wYWdlX3NpemVcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMucHVzaChyZWxhdGVkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHM7XG4gICAgICB9XG4gICAgICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gICAgICBpZiAoIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICAgICAgXy5lYWNoKHJlbGF0ZWRMaXN0LCBmdW5jdGlvbihvYmpPck5hbWUpIHtcbiAgICAgICAgICB2YXIgcmVsYXRlZDtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChvYmpPck5hbWUpKSB7XG4gICAgICAgICAgICByZWxhdGVkID0ge1xuICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWUsXG4gICAgICAgICAgICAgIGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zLFxuICAgICAgICAgICAgICBtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zLFxuICAgICAgICAgICAgICBpc19maWxlOiBvYmpPck5hbWUub2JqZWN0TmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgICAgICAgZmlsdGVyc0Z1bmN0aW9uOiBvYmpPck5hbWUuZmlsdGVycyxcbiAgICAgICAgICAgICAgc29ydDogb2JqT3JOYW1lLnNvcnQsXG4gICAgICAgICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogJycsXG4gICAgICAgICAgICAgIGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlLFxuICAgICAgICAgICAgICBsYWJlbDogb2JqT3JOYW1lLmxhYmVsLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBvYmpPck5hbWUuYWN0aW9ucyxcbiAgICAgICAgICAgICAgcGFnZV9zaXplOiBvYmpPck5hbWUucGFnZV9zaXplXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWQ7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3ROYW1lcy5wdXNoKG9iak9yTmFtZS5vYmplY3ROYW1lKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIG1hcExpc3QgPSB7fTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdF9pdGVtKSB7XG4gICAgICB2YXIgY29sdW1ucywgbW9iaWxlX2NvbHVtbnMsIG9yZGVyLCByZWxhdGVkLCByZWxhdGVkT2JqZWN0LCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lLCB0YWJ1bGFyX29yZGVyLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgIGlmICghKHJlbGF0ZWRfb2JqZWN0X2l0ZW0gIT0gbnVsbCA/IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWUgOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lO1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleTtcbiAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZF9vYmplY3RfaXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIXJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXTtcbiAgICAgIG1vYmlsZV9jb2x1bW5zID0gXy53aXRob3V0KG1vYmlsZV9jb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgdGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucyk7XG4gICAgICBpZiAoL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpKSB7XG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLCBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgICBtb2JpbGVfY29sdW1uczogbW9iaWxlX2NvbHVtbnMsXG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICBpc19maWxlOiByZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgIH07XG4gICAgICByZWxhdGVkT2JqZWN0ID0gcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKHJlbGF0ZWRPYmplY3QpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY29sdW1ucykge1xuICAgICAgICAgIHJlbGF0ZWQuY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QuY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucykge1xuICAgICAgICAgIHJlbGF0ZWQubW9iaWxlX2NvbHVtbnMgPSByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LnNvcnQpIHtcbiAgICAgICAgICByZWxhdGVkLnNvcnQgPSByZWxhdGVkT2JqZWN0LnNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgcmVsYXRlZC5maWx0ZXJzRnVuY3Rpb24gPSByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCkge1xuICAgICAgICAgIHJlbGF0ZWQuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QgPSByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmxhYmVsKSB7XG4gICAgICAgICAgcmVsYXRlZC5sYWJlbCA9IHJlbGF0ZWRPYmplY3QubGFiZWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QucGFnZV9zaXplKSB7XG4gICAgICAgICAgcmVsYXRlZC5wYWdlX3NpemUgPSByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hcExpc3RbcmVsYXRlZC5vYmplY3RfbmFtZV0gPSByZWxhdGVkO1xuICAgIH0pO1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfLnZhbHVlcyhyZWxhdGVkTGlzdE9iamVjdHMpLCBcIm9iamVjdF9uYW1lXCIpO1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICB1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgXy5lYWNoKHJlbGF0ZWRMaXN0T2JqZWN0cywgZnVuY3Rpb24odiwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZjtcbiAgICAgIGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xO1xuICAgICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNBY3RpdmUgJiYgYWxsb3dSZWFkKSB7XG4gICAgICAgIHJldHVybiBtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsaXN0ID0gW107XG4gICAgaWYgKF8uaXNFbXB0eShyZWxhdGVkTGlzdE5hbWVzKSkge1xuICAgICAgbGlzdCA9IF8udmFsdWVzKG1hcExpc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gocmVsYXRlZExpc3ROYW1lcywgZnVuY3Rpb24ob2JqZWN0TmFtZSkge1xuICAgICAgICBpZiAobWFwTGlzdFtvYmplY3ROYW1lXSkge1xuICAgICAgICAgIHJldHVybiBsaXN0LnB1c2gobWFwTGlzdFtvYmplY3ROYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoX29iamVjdCwgJ2FsbG93X3JlbGF0ZWRMaXN0JykpIHtcbiAgICAgIGxpc3QgPSBfLmZpbHRlcihsaXN0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBfLmluY2x1ZGUoX29iamVjdC5hbGxvd19yZWxhdGVkTGlzdCwgaXRlbS5vYmplY3RfbmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH07XG59XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSk7XG59O1xuXG5cbi8qIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiAqL1xuXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYykge1xuICB2YXIgbGlzdFZpZXdzLCBsaXN0X3ZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgaWYgKCEobGlzdFZpZXdzICE9IG51bGwgPyBsaXN0Vmlld3MubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0X3ZpZXcgPSBfLmZpbmQobGlzdFZpZXdzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0uX2lkID09PSBsaXN0X3ZpZXdfaWQgfHwgaXRlbS5uYW1lID09PSBsaXN0X3ZpZXdfaWQ7XG4gIH0pO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIGlmIChleGFjKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxpc3Rfdmlldztcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIGxpc3RWaWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiBsaXN0X3ZpZXdfaWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cywge1xuICAgICAgX2lkOiBsaXN0X3ZpZXdfaWRcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0VmlldyA9IGxpc3Rfdmlld19pZDtcbiAgfVxuICByZXR1cm4gKGxpc3RWaWV3ICE9IG51bGwgPyBsaXN0Vmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDku45jb2x1bW5z5Y+C5pWw5Lit6L+H5ruk5Ye655So5LqO5omL5py656uv5pi+56S655qEY29sdW1uc1xuXHTop4TliJnvvJpcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxuXHQyLuacgOWkmuWPqui/lOWbnjTkuKrlrZfmrrVcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcbiAqL1xuXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIGNvdW50LCBmaWVsZCwgZmllbGRzLCBnZXRGaWVsZCwgaXNOYW1lQ29sdW1uLCBpdGVtQ291bnQsIG1heENvdW50LCBtYXhSb3dzLCBuYW1lQ29sdW1uLCBuYW1lS2V5LCBvYmplY3QsIHJlc3VsdDtcbiAgcmVzdWx0ID0gW107XG4gIG1heFJvd3MgPSAyO1xuICBtYXhDb3VudCA9IG1heFJvd3MgKiAyO1xuICBjb3VudCA9IDA7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gb2JqZWN0LmZpZWxkcztcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuICBuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICBpc05hbWVDb2x1bW4gPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHJldHVybiBpdGVtLmZpZWxkID09PSBuYW1lS2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXRlbSA9PT0gbmFtZUtleTtcbiAgICB9XG4gIH07XG4gIGdldEZpZWxkID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW0uZmllbGRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW1dO1xuICAgIH1cbiAgfTtcbiAgaWYgKG5hbWVLZXkpIHtcbiAgICBuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKG5hbWVDb2x1bW4pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pO1xuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgcmVzdWx0LnB1c2gobmFtZUNvbHVtbik7XG4gIH1cbiAgY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKGl0ZW0pO1xuICAgIGlmICghZmllbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbUNvdW50ID0gZmllbGQuaXNfd2lkZSA/IDIgOiAxO1xuICAgIGlmIChjb3VudCA8IG1heENvdW50ICYmIHJlc3VsdC5sZW5ndGggPCBtYXhDb3VudCAmJiAhaXNOYW1lQ29sdW1uKGl0ZW0pKSB7XG4gICAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgICBpZiAoY291bnQgPD0gbWF4Q291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0Vmlldywgb2JqZWN0LCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICB9XG4gIGlmIChvYmplY3QgIT0gbnVsbCA/IChyZWYgPSBvYmplY3QubGlzdF92aWV3cykgIT0gbnVsbCA/IHJlZltcImRlZmF1bHRcIl0gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICBkZWZhdWx0VmlldyA9IG9iamVjdC5saXN0X3ZpZXdzW1wiZGVmYXVsdFwiXTtcbiAgfSBlbHNlIHtcbiAgICBfLmVhY2gob2JqZWN0ICE9IG51bGwgPyBvYmplY3QubGlzdF92aWV3cyA6IHZvaWQgMCwgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcbiAgICAgIGlmIChsaXN0X3ZpZXcubmFtZSA9PT0gXCJhbGxcIiB8fCBrZXkgPT09IFwiYWxsXCIpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBkZWZhdWx0Vmlldztcbn07XG5cblxuLypcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucykge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKHVzZV9tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDApIHtcbiAgICAgIGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucztcbiAgICB9IGVsc2UgaWYgKGNvbHVtbnMpIHtcbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbHVtbnM7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo56ys5LiA5Liq6KeG5Zu+5pi+56S655qE5a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyhvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKHVzZV9tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDApIHtcbiAgICAgIGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucztcbiAgICB9IGVsc2UgaWYgKGNvbHVtbnMpIHtcbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbHVtbnM7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5leHRyYV9jb2x1bW5zIDogdm9pZCAwO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBpZiAoZGVmYXVsdFZpZXcpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcuc29ydCkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3LnNvcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc0FsbFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJhbGxcIjtcbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuICovXG5cbkNyZWF0b3IuaXNSZWNlbnRWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSBmdW5jdGlvbihzb3J0LCB0YWJ1bGFyQ29sdW1ucykge1xuICB2YXIgdGFidWxhcl9zb3J0O1xuICB0YWJ1bGFyX3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgY29sdW1uX2luZGV4LCBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBpZiAoaXRlbS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpdGVtLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgaXRlbVsxXV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihmaWVsZF9uYW1lKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIG9yZGVyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFidWxhcl9zb3J0O1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9EWCA9IGZ1bmN0aW9uKHNvcnQpIHtcbiAgdmFyIGR4X3NvcnQ7XG4gIGR4X3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChpdGVtKTtcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICByZXR1cm4gZHhfc29ydC5wdXNoKFtmaWVsZF9uYW1lLCBvcmRlcl0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkeF9zb3J0O1xufTtcbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJylcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5zdGFydHVwICgpLT5cblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cblx0XHRfcmVnRXhNZXNzYWdlcy5wdXNoIHtleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wifVxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXG5cdFx0fSkiLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpO1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVnRXhNZXNzYWdlcztcbiAgICBfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW107XG4gICAgX3JlZ0V4TWVzc2FnZXMucHVzaCh7XG4gICAgICBleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIlxuICAgIH0pO1xuICAgIHJldHVybiBTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuICAgICAgcmVnRXg6IF9yZWdFeE1lc3NhZ2VzXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJ9XG5cdFx0U2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCIvLyDlm6DkuLptZXRlb3LnvJbor5Fjb2ZmZWVzY3JpcHTkvJrlr7zoh7RldmFs5Ye95pWw5oql6ZSZ77yM5omA5Lul5Y2V54us5YaZ5Zyo5LiA5LiqanPmlofku7bkuK3jgIJcbkNyZWF0b3IuZXZhbEluQ29udGV4dCA9IGZ1bmN0aW9uKGpzLCBjb250ZXh0KSB7XG4gICAgLy8jIFJldHVybiB0aGUgcmVzdWx0cyBvZiB0aGUgaW4tbGluZSBhbm9ueW1vdXMgZnVuY3Rpb24gd2UgLmNhbGwgd2l0aCB0aGUgcGFzc2VkIGNvbnRleHRcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7IFxuICAgIFx0cmV0dXJuIGV2YWwoanMpOyBcblx0fS5jYWxsKGNvbnRleHQpO1xufVxuXG5cbkNyZWF0b3IuZXZhbCA9IGZ1bmN0aW9uKGpzKXtcblx0dHJ5e1xuXHRcdHJldHVybiBldmFsKGpzKVxuXHR9Y2F0Y2ggKGUpe1xuXHRcdGNvbnNvbGUuZXJyb3IoZSwganMpO1xuXHR9XG59OyIsIlx0Z2V0T3B0aW9uID0gKG9wdGlvbiktPlxuXHRcdGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIilcblx0XHRpZiBmb28ubGVuZ3RoID4gMlxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdLCBjb2xvcjogZm9vWzJdfVxuXHRcdGVsc2UgaWYgZm9vLmxlbmd0aCA+IDFcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1sxXX1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMF19XG5cblx0Y29udmVydEZpZWxkID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCktPlxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiBzcGFjZUlkICYmIGZpZWxkLnR5cGUgPT0gJ3NlbGVjdCdcblx0XHRcdGNvZGUgPSBmaWVsZC5waWNrbGlzdCB8fCBcIiN7b2JqZWN0X25hbWV9LiN7ZmllbGRfbmFtZX1cIjtcblx0XHRcdGlmIGNvZGVcblx0XHRcdFx0cGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuXHRcdFx0XHRpZiBwaWNrbGlzdFxuXHRcdFx0XHRcdG9wdGlvbnMgPSBbXTtcblx0XHRcdFx0XHRhbGxPcHRpb25zID0gW107XG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gQ3JlYXRvci5nZXRQaWNrTGlzdE9wdGlvbnMocGlja2xpc3QpXG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpPy5yZXZlcnNlKCk7XG5cdFx0XHRcdFx0Xy5lYWNoIHBpY2tsaXN0T3B0aW9ucywgKGl0ZW0pLT5cblx0XHRcdFx0XHRcdGxhYmVsID0gaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHRhbGxPcHRpb25zLnB1c2goe2xhYmVsOiBsYWJlbCwgdmFsdWU6IHZhbHVlLCBlbmFibGU6IGl0ZW0uZW5hYmxlLCBjb2xvcjogaXRlbS5jb2xvcn0pXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVuYWJsZVxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLnB1c2goe2xhYmVsOiBsYWJlbCwgdmFsdWU6IHZhbHVlLCBjb2xvcjogaXRlbS5jb2xvcn0pXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmRlZmF1bHRcblx0XHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWVcblx0XHRcdFx0XHRpZiBvcHRpb25zLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBvcHRpb25zXG5cdFx0XHRcdFx0aWYgYWxsT3B0aW9ucy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRmaWVsZC5hbGxPcHRpb25zID0gYWxsT3B0aW9uc1xuXHRcdHJldHVybiBmaWVsZDtcblxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3QgPSAob2JqZWN0LCBzcGFjZUlkKS0+XG5cdFx0aWYgIW9iamVjdFxuXHRcdFx0cmV0dXJuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxuXG5cdFx0XHRpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIpXG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXI/Ll90b2RvXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSB0cmlnZ2VyLnRvZG9cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxuXHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXG5cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXG5cdFx0XHRcdFx0I+WPquaciXVwZGF0ZeaXtu+8jCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyDmiY3mnInlgLxcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph4/vvIzlsKTlhbbmmK9Db2xsZWN0aW9uXG5cdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiXG5cdFx0XHRcdF90b2RvID0gdHJpZ2dlci50b2RvXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcblx0XHRcdFx0XHR0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKVxuXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBrZXkpLT5cblxuXHRcdFx0XHRpZiBmaWVsZC5vbWl0XG5cdFx0XHRcdFx0IyBvbWl05a2X5q615a6M5YWo6ZqQ6JeP5LiN5pi+56S6XG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gdHJ1ZVxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlcXVpcmVkICYmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRcdFx0IyDpgJrnlKjlv4XloavlrZfmrrUgIzI5NTLvvIzlv4XloavlrZfmrrXorr7nva7kuLrpnZ7lj6ror7tcblx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IGZhbHNlXG5cblx0XHRcdFx0c3lzdGVtQmFzZUZpZWxkcyA9IENyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcygpXG5cdFx0XHRcdGlmIHN5c3RlbUJhc2VGaWVsZHMuaW5kZXhPZihrZXkpID4gLTFcblx0XHRcdFx0XHQjIOW8uuWItuWIm+W7uuS6uuWIm+W7uuaXtumXtOetieWtl+auteS4uuWPquivu1xuXHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24/Ll90b2RvXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSBhY3Rpb24/LnRvZG9cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2NvZGV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSlcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGJcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKGZ1bmN0aW9uKCl7I3tfdG9kb19mcm9tX2RifX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3JcblxuXHRcdFx0XHRfdmlzaWJsZSA9IGFjdGlvbj8uX3Zpc2libGVcblx0XHRcdFx0aWYgX3Zpc2libGVcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcoX3Zpc2libGUpXG5cdFx0XHRcdFx0XHRcdF92aXNpYmxlID0gX3Zpc2libGUudHJpbSgpXG5cdFx0XHRcdFx0XHRpZiBTdGVlZG9zLmlzRXhwcmVzc2lvbihfdmlzaWJsZSlcblx0XHRcdFx0XHRcdFx0IyDmlK/mjIHpobXpnaLluIPlsYDkuK3lhpl2aXNpYmxlX29u5Ye95pWw6KGo6L6+5byP77yM6aG16Z2i5biD5bGA5oyJ6ZKu55qE5pi+56S65p2h5Lu25LiN55Sf5pWIICMzMzQwXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi52aXNpYmxlID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF9wZXJtaXNzaW9ucywgcmVjb3JkKSAtPlxuXHRcdFx0XHRcdFx0XHRcdGdsb2JhbERhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBDcmVhdG9yLlVTRVJfQ09OVEVYVCwge25vdzogbmV3IERhdGUoKX0pXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uKF92aXNpYmxlLCByZWNvcmQsIFwiI1wiLCBnbG9iYWxEYXRhKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRhY3Rpb24udmlzaWJsZSA9IENyZWF0b3IuZXZhbChcIigje192aXNpYmxlfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5hY3Rpb25zLCAoYWN0aW9uLCBrZXkpLT5cblx0XHRcdFx0X3RvZG8gPSBhY3Rpb24/LnRvZG9cblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKClcblxuXHRcdFx0XHRfdmlzaWJsZSA9IGFjdGlvbj8udmlzaWJsZVxuXG5cdFx0XHRcdGlmIF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSlcblx0XHRcdFx0XHRhY3Rpb24uX3Zpc2libGUgPSBfdmlzaWJsZS50b1N0cmluZygpXG5cblx0XHRfLmZvckVhY2ggb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBrZXkpLT5cblxuXHRcdFx0ZmllbGQgPSBjb252ZXJ0RmllbGQob2JqZWN0Lm5hbWUsIGtleSwgZmllbGQsIHNwYWNlSWQpO1xuXG5cdFx0XHRpZiBmaWVsZC5vcHRpb25zICYmIF8uaXNTdHJpbmcoZmllbGQub3B0aW9ucylcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxuXHRcdFx0XHRcdCPmlK/mjIFcXG7miJbogIXoi7HmlofpgJflj7fliIblibIsXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIGZpZWxkLm9wdGlvbnMuc3BsaXQoXCJcXG5cIiksIChvcHRpb24pLT5cblx0XHRcdFx0XHRcdGlmIG9wdGlvbi5pbmRleE9mKFwiLFwiKVxuXHRcdFx0XHRcdFx0XHRvcHRpb25zID0gb3B0aW9uLnNwbGl0KFwiLFwiKVxuXHRcdFx0XHRcdFx0XHRfLmZvckVhY2ggb3B0aW9ucywgKF9vcHRpb24pLT5cblx0XHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSlcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvclxuXG5cdFx0XHRlbHNlIGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0XHQj5pSv5oyB5pWw57uE5Lit55u05o6l5a6a5LmJ5q+P5Liq6YCJ6aG555qE566A54mI5qC85byP5a2X56ym5LiyXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIGZpZWxkLm9wdGlvbnMsIChvcHRpb24pLT5cblx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcob3B0aW9uKVxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKG9wdGlvbilcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvclxuXG5cdFx0XHRlbHNlIGlmIGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucylcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxuXHRcdFx0XHRfLmVhY2ggZmllbGQub3B0aW9ucywgKHYsIGspLT5cblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogdiwgdmFsdWU6IGt9XG5cdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRcdFx0aWYgb3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucylcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnMudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRvcHRpb25zID0gZmllbGQuX29wdGlvbnNcblx0XHRcdFx0aWYgb3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gQ3JlYXRvci5ldmFsKFwiKCN7b3B0aW9uc30pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQucmVnRXhcblx0XHRcdFx0aWYgcmVnRXhcblx0XHRcdFx0XHRmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQuX3JlZ0V4XG5cdFx0XHRcdGlmIHJlZ0V4XG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5yZWdFeCA9IENyZWF0b3IuZXZhbChcIigje3JlZ0V4fSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0bWluID0gZmllbGQubWluXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtaW4pXG5cdFx0XHRcdFx0ZmllbGQuX21pbiA9IG1pbi50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG1pbiA9IGZpZWxkLl9taW5cblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtaW4pXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5taW4gPSBDcmVhdG9yLmV2YWwoXCIoI3ttaW59KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRtYXggPSBmaWVsZC5tYXhcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKG1heClcblx0XHRcdFx0XHRmaWVsZC5fbWF4ID0gbWF4LnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0bWF4ID0gZmllbGQuX21heFxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKG1heClcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLm1heCA9IENyZWF0b3IuZXZhbChcIigje21heH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS50eXBlXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc0Z1bmN0aW9uKF90eXBlKSAmJiBfdHlwZSAhPSBPYmplY3QgJiYgX3R5cGUgIT0gU3RyaW5nICYmIF90eXBlICE9IE51bWJlciAmJiBfdHlwZSAhPSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpXG5cdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgZmllbGQuYXV0b2Zvcm1cblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSlcblx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3R5cGV9KVwiKVxuXHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb25cblxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2NyZWF0ZUZ1bmN0aW9uID0gY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKVxuXHRcdFx0XHRpZiBiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGJlZm9yZU9wZW5GdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiBmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uID0gZmlsdGVyc0Z1bmN0aW9uLnRvU3RyaW5nKClcblx0XHRcdGVsc2VcblxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvXG5cdFx0XHRcdGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuX2NyZWF0ZUZ1bmN0aW9uXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiB8fCBmaWVsZC5maWx0ZXJzRnVuY3Rpb25cblxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9uc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7b3B0aW9uc0Z1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0ZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvci5ldmFsKFwiKCN7cmVmZXJlbmNlX3RvfSlcIilcblxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7Y3JlYXRlRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tiZWZvcmVPcGVuRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXJzRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cdFx0XHRcdGlmIGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRcdGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlXG5cblx0XHRcdFx0aWYgIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXG5cdFx0XHRcdGlmIGRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2RlZmF1bHRWYWx1ZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3Jcblx0XHRcdFxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRpZiBpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZClcblx0XHRcdFx0XHRmaWVsZC5faXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRpZiBpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc1N0cmluZyhpc19jb21wYW55X2xpbWl0ZWQpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yLmV2YWwoXCIoI3tpc19jb21wYW55X2xpbWl0ZWR9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRfLmZvckVhY2ggb2JqZWN0Lmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcsIGtleSkgLT5cblx0XHRcdCMjI1xuXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXG5cdFx0XHTorqnov4fomZHlmajmlK/mjIHkuKTnp41mdW5jdGlvbuaWueW8j++8mlxuXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuXHRcdFx05aaC77yaXG5cdFx0XHRmaWx0ZXJzOiAoKS0+XG5cdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG5cdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cblx0XHRcdOWmgu+8mlxuXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG5cdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcblx0XHRcdF1dXG5cdFx0XHTmiJZcblx0XHRcdGZpbHRlcnM6IFt7XG5cdFx0XHRcdFwiZmllbGRcIjogXCJvYmplY3RfbmFtZVwiXG5cdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG5cdFx0XHRcdFwidmFsdWVcIjogKCktPlxuXHRcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcblx0XHRcdH1dXG5cdFx0XHQjIyNcblx0XHRcdGlmIF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycylcblx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0bGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZSBpZiBfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycylcblx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0bGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tsaXN0X3ZpZXcuX2ZpbHRlcnN9KVwiKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRfLmZvckVhY2ggbGlzdF92aWV3LmZpbHRlcnMsIChmaWx0ZXIsIF9pbmRleCktPlxuXHRcdFx0XHRcdGlmIF8uaXNBcnJheShmaWx0ZXIpXG5cdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRGF0ZShmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzmmK9EYXRl57G75Z6L77yM5YiZZmlsdGVyWzJd5YC85Yiw5YmN56uv5Lya6Ieq5Yqo6L2s5oiQ5a2X56ym5Liy77yM5qC85byP77yaXCIyMDE4LTAzLTI5VDAzOjQzOjIxLjc4N1pcIlxuXHRcdFx0XHRcdFx0XHRcdCMg5YyF5ousZ3JpZOWIl+ihqOivt+axgueahOaOpeWPo+WcqOWGheeahOaJgOaciU9EYXRh5o6l5Y+j77yMRGF0Zeexu+Wei+Wtl+autemDveS8muS7peS4iui/sOagvOW8j+i/lOWbnlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiREFURVwiXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJGVU5DVElPTlwiXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyWzJdfSlcIilcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkRBVEVcIlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcblx0XHRcdFx0XHRlbHNlIGlmIF8uaXNPYmplY3QoZmlsdGVyKVxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNEYXRlKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl9pc19kYXRlID0gdHJ1ZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5faXNfZGF0ZSA9PSB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gbmV3IERhdGUoZmlsdGVyLnZhbHVlKVxuXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRpZiBvYmplY3QuZm9ybSAmJiAhXy5pc1N0cmluZyhvYmplY3QuZm9ybSlcblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XG5cdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdHJldHVybiB2YWwgKyAnJztcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdGVsc2UgaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRpZiBvYmplY3QuZm9ybVxuXHRcdFx0XHRvYmplY3QuZm9ybSA9IEpTT04ucGFyc2Ugb2JqZWN0LmZvcm0sIChrZXksIHZhbCktPlxuXHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKVxuXHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkX2xpc3RzLCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbClcblx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXG5cdFx0XHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpbHRlcnNfY29kZVwiLCB2YWxcblx0XHRlbHNlXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LnJlbGF0ZWRfbGlzdHMsIChyZWxhdGVkT2JqSW5mbyktPlxuXHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKVxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKVxuXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LnJlbGF0ZWRMaXN0LCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbClcblx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXG5cdFx0XHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpbHRlcnNfY29kZVwiLCB2YWxcblx0XHRlbHNlXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LnJlbGF0ZWRMaXN0LCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKVxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKClcblxuXHRcdHJldHVybiBvYmplY3RcblxuXG4iLCJ2YXIgY29udmVydEZpZWxkLCBnZXRPcHRpb247XG5cbmdldE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICB2YXIgZm9vO1xuICBmb28gPSBvcHRpb24uc3BsaXQoXCI6XCIpO1xuICBpZiAoZm9vLmxlbmd0aCA+IDIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV0sXG4gICAgICBjb2xvcjogZm9vWzJdXG4gICAgfTtcbiAgfSBlbHNlIGlmIChmb28ubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1sxXVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzBdXG4gICAgfTtcbiAgfVxufTtcblxuY29udmVydEZpZWxkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkLCBzcGFjZUlkKSB7XG4gIHZhciBhbGxPcHRpb25zLCBjb2RlLCBvcHRpb25zLCBwaWNrbGlzdCwgcGlja2xpc3RPcHRpb25zLCByZWY7XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgc3BhY2VJZCAmJiBmaWVsZC50eXBlID09PSAnc2VsZWN0Jykge1xuICAgIGNvZGUgPSBmaWVsZC5waWNrbGlzdCB8fCAob2JqZWN0X25hbWUgKyBcIi5cIiArIGZpZWxkX25hbWUpO1xuICAgIGlmIChjb2RlKSB7XG4gICAgICBwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XG4gICAgICBpZiAocGlja2xpc3QpIHtcbiAgICAgICAgb3B0aW9ucyA9IFtdO1xuICAgICAgICBhbGxPcHRpb25zID0gW107XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KTtcbiAgICAgICAgcGlja2xpc3RPcHRpb25zID0gKHJlZiA9IF8uc29ydEJ5KHBpY2tsaXN0T3B0aW9ucywgJ3NvcnRfbm8nKSkgIT0gbnVsbCA/IHJlZi5yZXZlcnNlKCkgOiB2b2lkIDA7XG4gICAgICAgIF8uZWFjaChwaWNrbGlzdE9wdGlvbnMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICB2YXIgbGFiZWwsIHZhbHVlO1xuICAgICAgICAgIGxhYmVsID0gaXRlbS5uYW1lO1xuICAgICAgICAgIHZhbHVlID0gaXRlbS52YWx1ZSB8fCBpdGVtLm5hbWU7XG4gICAgICAgICAgYWxsT3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGVuYWJsZTogaXRlbS5lbmFibGUsXG4gICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpdGVtLmVuYWJsZSkge1xuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgIGNvbG9yOiBpdGVtLmNvbG9yXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW1bXCJkZWZhdWx0XCJdKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbGxPcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5hbGxPcHRpb25zID0gYWxsT3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmllbGQ7XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRPYmplY3QgPSBmdW5jdGlvbihvYmplY3QsIHNwYWNlSWQpIHtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXy5mb3JFYWNoKG9iamVjdC50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwga2V5KSB7XG4gICAgdmFyIF90b2RvLCBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGI7XG4gICAgaWYgKChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSkge1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gdHJpZ2dlciAhPSBudWxsID8gdHJpZ2dlci5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpIHtcbiAgICAgIF90b2RvID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbykpIHtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGtleSkge1xuICAgICAgdmFyIHN5c3RlbUJhc2VGaWVsZHM7XG4gICAgICBpZiAoZmllbGQub21pdCkge1xuICAgICAgICBmaWVsZC5oaWRkZW4gPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkLnJlcXVpcmVkICYmIGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICAgIGZpZWxkLnJlYWRvbmx5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBzeXN0ZW1CYXNlRmllbGRzID0gQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzKCk7XG4gICAgICBpZiAoc3lzdGVtQmFzZUZpZWxkcy5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGIsIF92aXNpYmxlLCBlcnJvcjtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pKSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24oKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3Zpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoXy5pc1N0cmluZyhfdmlzaWJsZSkpIHtcbiAgICAgICAgICAgIF92aXNpYmxlID0gX3Zpc2libGUudHJpbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc0V4cHJlc3Npb24oX3Zpc2libGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfcGVybWlzc2lvbnMsIHJlY29yZCkge1xuICAgICAgICAgICAgICB2YXIgZ2xvYmFsRGF0YTtcbiAgICAgICAgICAgICAgZ2xvYmFsRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIENyZWF0b3IuVVNFUl9DT05URVhULCB7XG4gICAgICAgICAgICAgICAgbm93OiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gU3RlZWRvcy5wYXJzZVNpbmdsZUV4cHJlc3Npb24oX3Zpc2libGUsIHJlY29yZCwgXCIjXCIsIGdsb2JhbERhdGEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdmlzaWJsZSArIFwiKVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvLCBfdmlzaWJsZTtcbiAgICAgIF90b2RvID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnZpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKSkge1xuICAgICAgICByZXR1cm4gYWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGtleSkge1xuICAgIHZhciBfb3B0aW9ucywgX3R5cGUsIGJlZm9yZU9wZW5GdW5jdGlvbiwgY3JlYXRlRnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSwgZXJyb3IsIGZpbHRlcnNGdW5jdGlvbiwgaXNfY29tcGFueV9saW1pdGVkLCBtYXgsIG1pbiwgb3B0aW9ucywgb3B0aW9uc0Z1bmN0aW9uLCByZWZlcmVuY2VfdG8sIHJlZ0V4O1xuICAgIGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcbiAgICBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgaWYgKG9wdGlvbi5pbmRleE9mKFwiLFwiKSkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKF9vcHRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIGlmIChfLmlzU3RyaW5nKG9wdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1pbiA9IGZpZWxkLm1pbjtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWluKSkge1xuICAgICAgICBmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pbiA9IGZpZWxkLl9taW47XG4gICAgICBpZiAoXy5pc1N0cmluZyhtaW4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWluID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtaW4gKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtYXggPSBmaWVsZC5tYXg7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1heCkpIHtcbiAgICAgICAgZmllbGQuX21heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXggPSBmaWVsZC5fbWF4O1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWF4KSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1heCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWF4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT09IE9iamVjdCAmJiBfdHlwZSAhPT0gU3RyaW5nICYmIF90eXBlICE9PSBOdW1iZXIgJiYgX3R5cGUgIT09IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSkpIHtcbiAgICAgICAgICBmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdHlwZSArIFwiKVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9uc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWZlcmVuY2VfdG8gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGNyZWF0ZUZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBiZWZvcmVPcGVuRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlcnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZGVmYXVsdFZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICByZXR1cm4gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBpc19jb21wYW55X2xpbWl0ZWQgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBfLmZvckVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG5cbiAgICAvKlxuICAgIFx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuICAgIFx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG4gICAgXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6ICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG4gICAgXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0XV1cbiAgICBcdFx0XHTmiJZcbiAgICBcdFx0XHRmaWx0ZXJzOiBbe1xuICAgIFx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcbiAgICBcdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG4gICAgXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cbiAgICBcdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdH1dXG4gICAgICovXG4gICAgaWYgKF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBsaXN0X3ZpZXcuX2ZpbHRlcnMgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfLmZvckVhY2gobGlzdF92aWV3LmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNEYXRlKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiREFURVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkZVTkNUSU9OXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJbMl0gKyBcIilcIik7XG4gICAgICAgICAgICAgIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiREFURVwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNEYXRlKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl9pc19kYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuX2lzX2RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKG9iamVjdC5mb3JtICYmICFfLmlzU3RyaW5nKG9iamVjdC5mb3JtKSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbCArICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0pIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZF9saXN0cywgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImZpbHRlcnNfY29kZVwiLCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkX2xpc3RzLCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJmaWx0ZXJzX2NvZGVcIiwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fVxuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiXG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gKHByZWZpeCxmaWVsZFZhcmlhYmxlKS0+XG5cdHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuXG5cdHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZSByZWcsIChtLCAkMSktPlxuXHRcdHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLyxcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZyxcIlxcXCJdW1xcXCJcIik7XG5cblx0cmV0dXJuIHJldlxuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IChmb3JtdWxhX3N0ciktPlxuXHRpZiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTFcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSAoZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKS0+XG5cdGlmIGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpXG5cblx0XHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucz8uZXh0ZW5kKVxuXHRcdFx0ZXh0ZW5kID0gdHJ1ZVxuXG5cdFx0X1ZBTFVFUyA9IHt9XG5cdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKVxuXHRcdGlmIGV4dGVuZFxuXHRcdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucz8udXNlcklkLCBvcHRpb25zPy5zcGFjZUlkKSlcblx0XHRmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cilcblxuXHRcdHRyeVxuXHRcdFx0ZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUykgICAjIOatpOWkhOS4jeiDveeUqHdpbmRvdy5ldmFsIO+8jOS8muWvvOiHtOWPmOmHj+S9nOeUqOWfn+W8guW4uFxuXHRcdFx0cmV0dXJuIGRhdGFcblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9XCIsIGUpXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dG9hc3RyPy5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9I3tlfVwiXG5cblx0cmV0dXJuIGZvcm11bGFfc3RyXG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge307XG5cbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCI7XG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gZnVuY3Rpb24ocHJlZml4LCBmaWVsZFZhcmlhYmxlKSB7XG4gIHZhciByZWcsIHJldjtcbiAgcmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XG4gIHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG0sICQxKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLCBcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLCBcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csIFwiXFxcIl1bXFxcIlwiKTtcbiAgfSk7XG4gIHJldHVybiByZXY7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyKSB7XG4gIGlmIChfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucykge1xuICB2YXIgX1ZBTFVFUywgZGF0YSwgZSwgZXh0ZW5kO1xuICBpZiAoZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuZXh0ZW5kIDogdm9pZCAwKSkge1xuICAgICAgZXh0ZW5kID0gdHJ1ZTtcbiAgICB9XG4gICAgX1ZBTFVFUyA9IHt9O1xuICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVCk7XG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy51c2VySWQgOiB2b2lkIDAsIG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgIH1cbiAgICBmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cik7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciwgZSk7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG9hc3RyICE9PSBcInVuZGVmaW5lZFwiICYmIHRvYXN0ciAhPT0gbnVsbCkge1xuICAgICAgICAgIHRvYXN0ci5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIgKyBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFfc3RyO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9ICAgIyDmraTlr7nosaHlj6rog73lnKjnoa7kv53miYDmnIlPYmplY3TliJ3lp4vljJblrozmiJDlkI7osIPnlKjvvIwg5ZCm5YiZ6I635Y+W5Yiw55qEb2JqZWN05LiN5YWoXG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IChvYmplY3RfbmFtZSktPlxuXHRpZiBvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJylcblx0XHRvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpXG5cdHJldHVybiBvYmplY3RfbmFtZVxuXG5DcmVhdG9yLk9iamVjdCA9IChvcHRpb25zKS0+XG5cdF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdF9iYXNlT2JqZWN0ID0ge2FjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zICwgZmllbGRzOiB7fSwgdHJpZ2dlcnM6IHt9LCBwZXJtaXNzaW9uX3NldDoge319XG5cdHNlbGYgPSB0aGlzXG5cdGlmICghb3B0aW9ucy5uYW1lKVxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcblxuXHRzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZVxuXHRzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXHRzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWVcblx0c2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWxcblx0c2VsZi5pY29uID0gb3B0aW9ucy5pY29uXG5cdHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uXG5cdHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlld1xuXHRzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm1cblx0c2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Rcblx0c2VsZi5yZWxhdGVkX2xpc3RzID0gb3B0aW9ucy5yZWxhdGVkX2xpc3RzXG5cdHNlbGYuaGFzSW1wb3J0VGVtcGxhdGVzID0gb3B0aW9ucy5oYXNJbXBvcnRUZW1wbGF0ZXNcblx0c2VsZi52ZXJzaW9uID0gb3B0aW9ucy52ZXJzaW9uIHx8IDEuMFxuXHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpICB8fCBvcHRpb25zLmlzX2VuYWJsZSA9PSB0cnVlXG5cdFx0c2VsZi5pc19lbmFibGUgPSB0cnVlXG5cdGVsc2Vcblx0XHRzZWxmLmlzX2VuYWJsZSA9IGZhbHNlXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIF8uaGFzKG9wdGlvbnMsICdhbGxvd19jdXN0b21BY3Rpb25zJylcblx0XHRcdHNlbGYuYWxsb3dfY3VzdG9tQWN0aW9ucyA9IG9wdGlvbnMuYWxsb3dfY3VzdG9tQWN0aW9uc1xuXHRcdGlmIF8uaGFzKG9wdGlvbnMsICdleGNsdWRlX2FjdGlvbnMnKVxuXHRcdFx0c2VsZi5leGNsdWRlX2FjdGlvbnMgPSBvcHRpb25zLmV4Y2x1ZGVfYWN0aW9uc1xuXHRcdGlmIF8uaGFzKG9wdGlvbnMsICdhbGxvd19yZWxhdGVkTGlzdCcpXG5cdFx0XHRzZWxmLmFsbG93X3JlbGF0ZWRMaXN0ID0gb3B0aW9ucy5hbGxvd19yZWxhdGVkTGlzdFxuXHRzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2hcblx0c2VsZi5lbmFibGVfZmlsZXMgPSBvcHRpb25zLmVuYWJsZV9maWxlc1xuXHRzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzXG5cdHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXNcblx0c2VsZi5lbmFibGVfYXVkaXQgPSBvcHRpb25zLmVuYWJsZV9hdWRpdFxuXHRzZWxmLmVuYWJsZV9ldmVudHMgPSBvcHRpb25zLmVuYWJsZV9ldmVudHNcblx0aWYgb3B0aW9ucy5wYWdpbmdcblx0XHRzZWxmLnBhZ2luZyA9IG9wdGlvbnMucGFnaW5nXG5cdHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW5cblx0c2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PSB1bmRlZmluZWQpIG9yIG9wdGlvbnMuZW5hYmxlX2FwaVxuXHRzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tXG5cdHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmVcblx0c2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzXG5cdHNlbGYuZW5hYmxlX3Byb2Nlc3MgPSBvcHRpb25zLmVuYWJsZV9wcm9jZXNzXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKVxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcblx0XHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxuXHRlbHNlXG5cdFx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXG5cdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcblx0c2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3dcblx0c2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnlcblx0c2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcilcblx0c2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXJcblx0c2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaFxuXHRzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWxcblx0c2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzXG5cdHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvd1xuXHRzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93XG5cdHNlbGYuZW5hYmxlX2lubGluZV9lZGl0ID0gb3B0aW9ucy5lbmFibGVfaW5saW5lX2VkaXRcblx0c2VsZi5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzXG5cdHNlbGYubWFzdGVycyA9IG9wdGlvbnMubWFzdGVyc1xuXHRzZWxmLmxvb2t1cF9kZXRhaWxzID0gb3B0aW9ucy5sb29rdXBfZGV0YWlsc1xuXHRpZiBfLmhhcyhvcHRpb25zLCAnaW5fZGV2ZWxvcG1lbnQnKVxuXHRcdHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50XG5cdHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJ1xuXHRpZiBvcHRpb25zLmRhdGFiYXNlX25hbWVcblx0XHRzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWVcblx0aWYgKCFvcHRpb25zLmZpZWxkcylcblx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBmaWVsZHMnKTtcblxuXHRzZWxmLmZpZWxkcyA9IGNsb25lKG9wdGlvbnMuZmllbGRzKVxuXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgZmllbGQuaXNfbmFtZVxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcblx0XHRlbHNlIGlmIGZpZWxkX25hbWUgPT0gJ25hbWUnICYmICFzZWxmLk5BTUVfRklFTERfS0VZXG5cdFx0XHRzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZVxuXHRcdGlmIGZpZWxkLnByaW1hcnlcblx0XHRcdHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcblx0XHRcdFx0aWYgZmllbGRfbmFtZSA9PSAnc3BhY2UnXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcblx0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSBmYWxzZVxuXG5cdGlmICFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXG5cdFx0Xy5lYWNoIF9iYXNlT2JqZWN0LmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0XHRpZiAhc2VsZi5maWVsZHNbZmllbGRfbmFtZV1cblx0XHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fVxuXHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pXG5cblx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdmb3JtdWxhJ1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdzdW1tYXJ5J1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cblx0c2VsZi5saXN0X3ZpZXdzID0ge31cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KHNlbGYubmFtZSlcblx0Xy5lYWNoIG9wdGlvbnMubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdG9pdGVtID0gQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcoZGVmYXVsdFZpZXcsIGl0ZW0sIGl0ZW1fbmFtZSlcblx0XHRzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtXG5cblx0c2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QudHJpZ2dlcnMpXG5cdF8uZWFjaCBvcHRpb25zLnRyaWdnZXJzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZVxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSlcblxuXHRzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpXG5cdF8uZWFjaCBvcHRpb25zLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiAhc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge31cblx0XHRjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pXG5cdFx0ZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdICPlhYjliKDpmaTnm7jlhbPlsZ7mgKflho3ph43lu7rmiY3og73kv53or4HlkI7nu63ph43lpI3lrprkuYnnmoTlsZ7mgKfpobrluo/nlJ/mlYhcblx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKVxuXHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdLm9iamVjdF9uYW1lID0gc2VsZi5uYW1lXG5cblx0Xy5lYWNoIHNlbGYuYWN0aW9ucywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZVxuXG5cdHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpXG5cblx0IyDorqnmiYDmnIlvYmplY3Tpu5jorqTmnInmiYDmnIlsaXN0X3ZpZXdzL2FjdGlvbnMvcmVsYXRlZF9vYmplY3RzL3JlYWRhYmxlX2ZpZWxkcy9lZGl0YWJsZV9maWVsZHPlrozmlbTmnYPpmZDvvIzor6XmnYPpmZDlj6/og73ooqvmlbDmja7lupPkuK3orr7nva7nmoRhZG1pbi91c2Vy5p2D6ZmQ6KaG55uWXG5cdHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KVxuXHQjIGRlZmF1bHRMaXN0Vmlld3MgPSBfLmtleXMoc2VsZi5saXN0X3ZpZXdzKVxuXHQjIGRlZmF1bHRBY3Rpb25zID0gXy5rZXlzKHNlbGYuYWN0aW9ucylcblx0IyBkZWZhdWx0UmVsYXRlZE9iamVjdHMgPSBfLnBsdWNrKHNlbGYucmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblx0IyBkZWZhdWx0UmVhZGFibGVGaWVsZHMgPSBbXVxuXHQjIGRlZmF1bHRFZGl0YWJsZUZpZWxkcyA9IFtdXG5cdCMgXy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0IyBcdGlmICEoZmllbGQuaGlkZGVuKSAgICAjMjMxIG9taXTlrZfmrrXmlK/mjIHlnKjpnZ7nvJbovpHpobXpnaLmn6XnnIssIOWboOatpOWIoOmZpOS6huatpOWkhOWvuW9taXTnmoTliKTmlq1cblx0IyBcdFx0ZGVmYXVsdFJlYWRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxuXHQjIFx0XHRpZiAhZmllbGQucmVhZG9ubHlcblx0IyBcdFx0XHRkZWZhdWx0RWRpdGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXG5cblx0IyBfLmVhY2ggc2VsZi5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHQjIFx0aWYgaXRlbV9uYW1lID09IFwibm9uZVwiXG5cdCMgXHRcdHJldHVyblxuXHQjIFx0aWYgc2VsZi5saXN0X3ZpZXdzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5saXN0X3ZpZXdzID0gZGVmYXVsdExpc3RWaWV3c1xuXHQjIFx0aWYgc2VsZi5hY3Rpb25zXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5hY3Rpb25zID0gZGVmYXVsdEFjdGlvbnNcblx0IyBcdGlmIHNlbGYucmVsYXRlZF9vYmplY3RzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWxhdGVkX29iamVjdHMgPSBkZWZhdWx0UmVsYXRlZE9iamVjdHNcblx0IyBcdGlmIHNlbGYuZmllbGRzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWFkYWJsZV9maWVsZHMgPSBkZWZhdWx0UmVhZGFibGVGaWVsZHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmVkaXRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRFZGl0YWJsZUZpZWxkc1xuXHR1bmxlc3Mgb3B0aW9ucy5wZXJtaXNzaW9uX3NldFxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fVxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LmFkbWluKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSlcblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py51c2VyKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pXG5cdF8uZWFjaCBvcHRpb25zLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pXG5cblx0IyDliY3nq6/moLnmja5wZXJtaXNzaW9uc+aUueWGmWZpZWxk55u45YWz5bGe5oCn77yM5ZCO56uv5Y+q6KaB6LWw6buY6K6k5bGe5oCn5bCx6KGM77yM5LiN6ZyA6KaB5pS55YaZXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9uc1xuXHRcdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucz8uZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdGlmIGRpc2FibGVkX2xpc3Rfdmlld3M/Lmxlbmd0aFxuXHRcdFx0ZGVmYXVsdExpc3RWaWV3SWQgPSBvcHRpb25zLmxpc3Rfdmlld3M/LmFsbD8uX2lkXG5cdFx0XHRpZiBkZWZhdWx0TGlzdFZpZXdJZFxuXHRcdFx0XHQjIOaKiuinhuWbvuadg+mZkOmFjee9ruS4rem7mOiupOeahGFsbOinhuWbvmlk6L2s5o2i5oiQYWxs5YWz6ZSu5a2XXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcCBkaXNhYmxlZF9saXN0X3ZpZXdzLCAobGlzdF92aWV3X2l0ZW0pIC0+XG5cdFx0XHRcdFx0cmV0dXJuIGlmIGRlZmF1bHRMaXN0Vmlld0lkID09IGxpc3Rfdmlld19pdGVtIHRoZW4gXCJhbGxcIiBlbHNlIGxpc3Rfdmlld19pdGVtXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucylcbiNcdFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cbiNcdFx0XHRpZiBmaWVsZFxuI1x0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bnJlYWRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPCAwXG4jXHRcdFx0XHRcdGlmIGZpZWxkLmhpZGRlblxuI1x0XHRcdFx0XHRcdHJldHVyblxuI1x0XHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVuZWRpdGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA+IC0xXG4jXHRcdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG4jXHRcdFx0XHRcdFx0ZmllbGQuZGlzYWJsZWQgPSB0cnVlXG4jXHRcdFx0XHRcdFx0IyDlvZPlj6ror7vml7bvvIzlpoLmnpzkuI3ljrvmjonlv4XloavlrZfmrrXvvIxhdXRvZm9ybeaYr+S8muaKpemUmeeahFxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlcXVpcmVkID0gZmFsc2VcbiNcdFx0XHRcdGVsc2VcbiNcdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG51bGxcblxuXHRfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucylcblxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGJcblxuXHRzZWxmLmRiID0gX2RiXG5cblx0c2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lXG5cblx0c2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZilcblx0c2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSlcblx0aWYgc2VsZi5uYW1lICE9IFwidXNlcnNcIiBhbmQgc2VsZi5uYW1lICE9IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCIsIFwiYWN0aW9uX2ZpZWxkX3VwZGF0ZXNcIiwgXCJvYmplY3RfbGlzdHZpZXdzXCJdLCBzZWxmLm5hbWUpXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdFx0ZWxzZVxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXHRpZiBzZWxmLm5hbWUgPT0gXCJ1c2Vyc1wiXG5cdFx0X2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYVxuXG5cdGlmIF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSlcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblxuXHRDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGZcblxuXHRyZXR1cm4gc2VsZlxuXG4jIENyZWF0b3IuT2JqZWN0LnByb3RvdHlwZS5pMThuID0gKCktPlxuIyBcdCMgc2V0IG9iamVjdCBsYWJlbFxuIyBcdHNlbGYgPSB0aGlzXG5cbiMgXHRrZXkgPSBzZWxmLm5hbWVcbiMgXHRpZiB0KGtleSkgPT0ga2V5XG4jIFx0XHRpZiAhc2VsZi5sYWJlbFxuIyBcdFx0XHRzZWxmLmxhYmVsID0gc2VsZi5uYW1lXG4jIFx0ZWxzZVxuIyBcdFx0c2VsZi5sYWJlbCA9IHQoa2V5KVxuXG4jIFx0IyBzZXQgZmllbGQgbGFiZWxzXG4jIFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cbiMgXHRcdGZrZXkgPSBzZWxmLm5hbWUgKyBcIl9cIiArIGZpZWxkX25hbWVcbiMgXHRcdGlmIHQoZmtleSkgPT0gZmtleVxuIyBcdFx0XHRpZiAhZmllbGQubGFiZWxcbiMgXHRcdFx0XHRmaWVsZC5sYWJlbCA9IGZpZWxkX25hbWVcbiMgXHRcdGVsc2VcbiMgXHRcdFx0ZmllbGQubGFiZWwgPSB0KGZrZXkpXG4jIFx0XHRzZWxmLnNjaGVtYT8uX3NjaGVtYT9bZmllbGRfbmFtZV0/LmxhYmVsID0gZmllbGQubGFiZWxcblxuXG4jIFx0IyBzZXQgbGlzdHZpZXcgbGFiZWxzXG4jIFx0Xy5lYWNoIHNlbGYubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuIyBcdFx0aTE4bl9rZXkgPSBzZWxmLm5hbWUgKyBcIl9saXN0dmlld19cIiArIGl0ZW1fbmFtZVxuIyBcdFx0aWYgdChpMThuX2tleSkgPT0gaTE4bl9rZXlcbiMgXHRcdFx0aWYgIWl0ZW0ubGFiZWxcbiMgXHRcdFx0XHRpdGVtLmxhYmVsID0gaXRlbV9uYW1lXG4jIFx0XHRlbHNlXG4jIFx0XHRcdGl0ZW0ubGFiZWwgPSB0KGkxOG5fa2V5KVxuXG5cbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSAob2JqZWN0KS0+XG5cdHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIlxuXHQjIGlmIG9iamVjdFxuXHQjIFx0aWYgIW9iamVjdC5kYXRhYmFzZV9uYW1lIHx8IG9iamVjdC5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXG5cdCMgXHRcdHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIlxuXHQjIFx0ZWxzZVxuXHQjIFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhLyN7b2JqZWN0LmRhdGFiYXNlX25hbWV9XCJcblxuIyBpZiBNZXRlb3IuaXNDbGllbnRcblxuIyBcdE1ldGVvci5zdGFydHVwIC0+XG4jIFx0XHRUcmFja2VyLmF1dG9ydW4gLT5cbiMgXHRcdFx0aWYgU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAmJiBDcmVhdG9yLmJvb3RzdHJhcExvYWRlZD8uZ2V0KClcbiMgXHRcdFx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxuIyBcdFx0XHRcdFx0b2JqZWN0LmkxOG4oKVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRpZiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKG9iamVjdCktPlxuXHRcdFx0bmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdClcblxuIiwidmFyIGNsb25lO1xuXG5jbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5cbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9O1xuXG5DcmVhdG9yLmZvcm1hdE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBpZiAob2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwuJywgJ2cnKSwgJ18nKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0X25hbWU7XG59O1xuXG5DcmVhdG9yLk9iamVjdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIF9iYXNlT2JqZWN0LCBfZGIsIGRlZmF1bHRMaXN0Vmlld0lkLCBkZWZhdWx0VmlldywgZGlzYWJsZWRfbGlzdF92aWV3cywgcGVybWlzc2lvbnMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2NoZW1hLCBzZWxmO1xuICBfYmFzZU9iamVjdCA9IENyZWF0b3IuYmFzZU9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF9iYXNlT2JqZWN0ID0ge1xuICAgICAgYWN0aW9uczogQ3JlYXRvci5iYXNlT2JqZWN0LmFjdGlvbnMsXG4gICAgICBmaWVsZHM6IHt9LFxuICAgICAgdHJpZ2dlcnM6IHt9LFxuICAgICAgcGVybWlzc2lvbl9zZXQ6IHt9XG4gICAgfTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgaWYgKCFvcHRpb25zLm5hbWUpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuICB9XG4gIHNlbGYuX2lkID0gb3B0aW9ucy5faWQgfHwgb3B0aW9ucy5uYW1lO1xuICBzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgc2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICBzZWxmLmxhYmVsID0gb3B0aW9ucy5sYWJlbDtcbiAgc2VsZi5pY29uID0gb3B0aW9ucy5pY29uO1xuICBzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvbjtcbiAgc2VsZi5pc192aWV3ID0gb3B0aW9ucy5pc192aWV3O1xuICBzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm07XG4gIHNlbGYucmVsYXRlZExpc3QgPSBvcHRpb25zLnJlbGF0ZWRMaXN0O1xuICBzZWxmLnJlbGF0ZWRfbGlzdHMgPSBvcHRpb25zLnJlbGF0ZWRfbGlzdHM7XG4gIHNlbGYuaGFzSW1wb3J0VGVtcGxhdGVzID0gb3B0aW9ucy5oYXNJbXBvcnRUZW1wbGF0ZXM7XG4gIHNlbGYudmVyc2lvbiA9IG9wdGlvbnMudmVyc2lvbiB8fCAxLjA7XG4gIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09PSB0cnVlKSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gZmFsc2U7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpKSB7XG4gICAgICBzZWxmLmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvcHRpb25zLmFsbG93X2N1c3RvbUFjdGlvbnM7XG4gICAgfVxuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnZXhjbHVkZV9hY3Rpb25zJykpIHtcbiAgICAgIHNlbGYuZXhjbHVkZV9hY3Rpb25zID0gb3B0aW9ucy5leGNsdWRlX2FjdGlvbnM7XG4gICAgfVxuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKSkge1xuICAgICAgc2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3Q7XG4gICAgfVxuICB9XG4gIHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaDtcbiAgc2VsZi5lbmFibGVfZmlsZXMgPSBvcHRpb25zLmVuYWJsZV9maWxlcztcbiAgc2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrcztcbiAgc2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3RlcztcbiAgc2VsZi5lbmFibGVfYXVkaXQgPSBvcHRpb25zLmVuYWJsZV9hdWRpdDtcbiAgc2VsZi5lbmFibGVfZXZlbnRzID0gb3B0aW9ucy5lbmFibGVfZXZlbnRzO1xuICBpZiAob3B0aW9ucy5wYWdpbmcpIHtcbiAgICBzZWxmLnBhZ2luZyA9IG9wdGlvbnMucGFnaW5nO1xuICB9XG4gIHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW47XG4gIHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT09IHZvaWQgMCkgfHwgb3B0aW9ucy5lbmFibGVfYXBpO1xuICBzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tO1xuICBzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlO1xuICBzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXM7XG4gIHNlbGYuZW5hYmxlX3Byb2Nlc3MgPSBvcHRpb25zLmVuYWJsZV9wcm9jZXNzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSkge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICB9XG4gIHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93O1xuICBzZWxmLmZpbHRlcl9jb21wYW55ID0gb3B0aW9ucy5maWx0ZXJfY29tcGFueTtcbiAgc2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcik7XG4gIHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyO1xuICBzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoO1xuICBzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWw7XG4gIHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFscztcbiAgc2VsZi5lbmFibGVfZm9sbG93ID0gb3B0aW9ucy5lbmFibGVfZm9sbG93O1xuICBzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93O1xuICBzZWxmLmVuYWJsZV9pbmxpbmVfZWRpdCA9IG9wdGlvbnMuZW5hYmxlX2lubGluZV9lZGl0O1xuICBzZWxmLmRldGFpbHMgPSBvcHRpb25zLmRldGFpbHM7XG4gIHNlbGYubWFzdGVycyA9IG9wdGlvbnMubWFzdGVycztcbiAgc2VsZi5sb29rdXBfZGV0YWlscyA9IG9wdGlvbnMubG9va3VwX2RldGFpbHM7XG4gIGlmIChfLmhhcyhvcHRpb25zLCAnaW5fZGV2ZWxvcG1lbnQnKSkge1xuICAgIHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50O1xuICB9XG4gIHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJztcbiAgaWYgKG9wdGlvbnMuZGF0YWJhc2VfbmFtZSkge1xuICAgIHNlbGYuZGF0YWJhc2VfbmFtZSA9IG9wdGlvbnMuZGF0YWJhc2VfbmFtZTtcbiAgfVxuICBpZiAoIW9wdGlvbnMuZmllbGRzKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IGZpZWxkcycpO1xuICB9XG4gIHNlbGYuZmllbGRzID0gY2xvbmUob3B0aW9ucy5maWVsZHMpO1xuICBfLmVhY2goc2VsZi5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH0gZWxzZSBpZiAoZmllbGRfbmFtZSA9PT0gJ25hbWUnICYmICFzZWxmLk5BTUVfRklFTERfS0VZKSB7XG4gICAgICBzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLnByaW1hcnkpIHtcbiAgICAgIHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpKSB7XG4gICAgICAgIGlmIChmaWVsZF9uYW1lID09PSAnc3BhY2UnKSB7XG4gICAgICAgICAgZmllbGQuZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKCFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09PSAnbWV0ZW9yLW1vbmdvJykge1xuICAgIF8uZWFjaChfYmFzZU9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICBpZiAoIXNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKSB7XG4gICAgICAgIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pO1xuICAgIH0pO1xuICB9XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2Zvcm11bGEnKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHNlbGYubGlzdF92aWV3cyA9IHt9O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcoc2VsZi5uYW1lKTtcbiAgXy5lYWNoKG9wdGlvbnMubGlzdF92aWV3cywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgdmFyIG9pdGVtO1xuICAgIG9pdGVtID0gQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcoZGVmYXVsdFZpZXcsIGl0ZW0sIGl0ZW1fbmFtZSk7XG4gICAgcmV0dXJuIHNlbGYubGlzdF92aWV3c1tpdGVtX25hbWVdID0gb2l0ZW07XG4gIH0pO1xuICBzZWxmLnRyaWdnZXJzID0gXy5jbG9uZShfYmFzZU9iamVjdC50cmlnZ2Vycyk7XG4gIF8uZWFjaChvcHRpb25zLnRyaWdnZXJzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXS5uYW1lID0gaXRlbV9uYW1lO1xuICAgIHJldHVybiBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgc2VsZi5hY3Rpb25zID0gXy5jbG9uZShfYmFzZU9iamVjdC5hY3Rpb25zKTtcbiAgXy5lYWNoKG9wdGlvbnMuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgdmFyIGNvcHlJdGVtO1xuICAgIGlmICghc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIGNvcHlJdGVtID0gXy5jbG9uZShzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSk7XG4gICAgZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdO1xuICAgIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pO1xuICAgIHJldHVybiBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXS5vYmplY3RfbmFtZSA9IHNlbGYubmFtZTtcbiAgfSk7XG4gIF8uZWFjaChzZWxmLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHJldHVybiBpdGVtLm5hbWUgPSBpdGVtX25hbWU7XG4gIH0pO1xuICBzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKTtcbiAgc2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoX2Jhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpO1xuICBpZiAoIW9wdGlvbnMucGVybWlzc2lvbl9zZXQpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge307XG4gIH1cbiAgaWYgKCEoKHJlZiA9IG9wdGlvbnMucGVybWlzc2lvbl9zZXQpICE9IG51bGwgPyByZWYuYWRtaW4gOiB2b2lkIDApKSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKTtcbiAgfVxuICBpZiAoISgocmVmMSA9IG9wdGlvbnMucGVybWlzc2lvbl9zZXQpICE9IG51bGwgPyByZWYxLnVzZXIgOiB2b2lkIDApKSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldC51c2VyID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1widXNlclwiXSk7XG4gIH1cbiAgXy5lYWNoKG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBvcHRpb25zLnBlcm1pc3Npb25zO1xuICAgIGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA6IHZvaWQgMDtcbiAgICBpZiAoZGlzYWJsZWRfbGlzdF92aWV3cyAhPSBudWxsID8gZGlzYWJsZWRfbGlzdF92aWV3cy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgIGRlZmF1bHRMaXN0Vmlld0lkID0gKHJlZjIgPSBvcHRpb25zLmxpc3Rfdmlld3MpICE9IG51bGwgPyAocmVmMyA9IHJlZjIuYWxsKSAhPSBudWxsID8gcmVmMy5faWQgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IF8ubWFwKGRpc2FibGVkX2xpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgaWYgKGRlZmF1bHRMaXN0Vmlld0lkID09PSBsaXN0X3ZpZXdfaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiYWxsXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0X3ZpZXdfaXRlbTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLnBlcm1pc3Npb25zID0gbnVsbDtcbiAgfVxuICBfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucyk7XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYjtcbiAgc2VsZi5kYiA9IF9kYjtcbiAgc2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lO1xuICBzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKTtcbiAgc2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSk7XG4gIGlmIChzZWxmLm5hbWUgIT09IFwidXNlcnNcIiAmJiBzZWxmLm5hbWUgIT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCIsIFwiYWN0aW9uX2ZpZWxkX3VwZGF0ZXNcIiwgXCJvYmplY3RfbGlzdHZpZXdzXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHNlbGYubmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgX2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYTtcbiAgfVxuICBpZiAoXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtzZWxmLl9jb2xsZWN0aW9uX25hbWVdID0gc2VsZjtcbiAgcmV0dXJuIHNlbGY7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIjtcbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBpZiAoIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkICYmIENyZWF0b3IuT2JqZWN0cykge1xuICAgIHJldHVybiBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBuZXcgQ3JlYXRvci5PYmplY3Qob2JqZWN0KTtcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMgPSAoZmllbGRTY2hlbWEpIC0+XG5cdG9wdGlvbnMgPSBmaWVsZFNjaGVtYS5vcHRpb25zXG5cdHVubGVzcyBvcHRpb25zXG5cdFx0cmV0dXJuXG5cdGRhdGFfdHlwZSA9IGZpZWxkU2NoZW1hLmRhdGFfdHlwZVxuXHRpZiAhXy5pc0Z1bmN0aW9uKG9wdGlvbnMpIGFuZCBkYXRhX3R5cGUgYW5kIGRhdGFfdHlwZSAhPSAndGV4dCdcblx0XHQjIOmbtuS7o+eggeeVjOmdoumFjee9rm9wdGlvbnPpgInpobnlgLzlj6rmlK/mjIHlrZfnrKbkuLLvvIzmiYDku6XlvZNkYXRhX3R5cGXkuLrmlbDlgLzmiJZib29sZWFu5pe277yM5Y+q6IO95by66KGM5oqK6YCJ6aG55YC85YWI6L2s5o2i5Li65a+55bqU55qE57G75Z6LXG5cdFx0b3B0aW9ucy5mb3JFYWNoIChvcHRpb25JdGVtKSAtPlxuXHRcdFx0aWYgdHlwZW9mIG9wdGlvbkl0ZW0udmFsdWUgIT0gJ3N0cmluZydcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBbXG5cdFx0XHRcdCdudW1iZXInXG5cdFx0XHRcdCdjdXJyZW5jeSdcblx0XHRcdFx0J3BlcmNlbnQnXG5cdFx0XHRdLmluZGV4T2YoZGF0YV90eXBlKSA+IC0xXG5cdFx0XHRcdG9wdGlvbkl0ZW0udmFsdWUgPSBOdW1iZXIob3B0aW9uSXRlbS52YWx1ZSlcblx0XHRcdGVsc2UgaWYgZGF0YV90eXBlID09ICdib29sZWFuJ1xuXHRcdFx0XHQjIOWPquacieS4unRydWXmiY3kuLrnnJ9cblx0XHRcdFx0b3B0aW9uSXRlbS52YWx1ZSA9IG9wdGlvbkl0ZW0udmFsdWUgPT0gJ3RydWUnXG5cdHJldHVybiBvcHRpb25zXG5cbkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gKG9iaikgLT5cblx0dW5sZXNzIG9ialxuXHRcdHJldHVyblxuXHRzY2hlbWEgPSB7fVxuXG5cdGZpZWxkc0FyciA9IFtdXG5cblx0Xy5lYWNoIG9iai5maWVsZHMgLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRpZiAhXy5oYXMoZmllbGQsIFwibmFtZVwiKVxuXHRcdFx0ZmllbGQubmFtZSA9IGZpZWxkX25hbWVcblx0XHRmaWVsZHNBcnIucHVzaCBmaWVsZFxuXG5cdF8uZWFjaCBfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgKGZpZWxkKS0+XG5cblx0XHRmaWVsZF9uYW1lID0gZmllbGQubmFtZVxuXG5cdFx0ZnMgPSB7fVxuXHRcdGlmIGZpZWxkLnJlZ0V4XG5cdFx0XHRmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4XG5cdFx0ZnMuYXV0b2Zvcm0gPSB7fVxuXHRcdGZzLmF1dG9mb3JtLm11bHRpcGxlID0gZmllbGQubXVsdGlwbGVcblx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdGF1dG9mb3JtX3R5cGUgPSBmaWVsZC5hdXRvZm9ybT8udHlwZVxuXG5cdFx0aWYgZmllbGQudHlwZSA9PSBcInRleHRcIiBvciBmaWVsZC50eXBlID09IFwicGhvbmVcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIlt0ZXh0XVwiIG9yIGZpZWxkLnR5cGUgPT0gXCJbcGhvbmVdXCJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdjb2RlJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTJcblx0XHRcdGlmIGZpZWxkLmxhbmd1YWdlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmxhbmd1YWdlID0gZmllbGQubGFuZ3VhZ2Vcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0YXJlYVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwicGFzc3dvcmRcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxuXHRcdFx0ZnMudHlwZSA9IERhdGVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5pc2lPUygpXG5cdFx0XHRcdFx0XHQjIEZpeCBpb3MgMTQsIOaJi+acuuWuouaIt+err+W+heWuoeaguOaWh+S7tuaXpeacn+aOp+S7tuaYvuekuuaVhemanCAjOTkx77yMaW9z57uf5LiA55SoUEPnq6/kuIDmoLfnmoRqc+aOp+S7tlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcblx0XHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG5cdFx0XHRcdFx0XHRcdFx0cGlja2VyVHlwZTogXCJyb2xsZXJzXCJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcblx0XHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidGltZVwiXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHR0eXBlOiBcInRpbWVcIlxuXHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJISDptbVwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdFx0ZnMudHlwZSA9IERhdGVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5pc2lPUygpXG5cdFx0XHRcdFx0XHQjIEZpeCBpb3MgMTQsIOaJi+acuuWuouaIt+err+W+heWuoeaguOaWh+S7tuaXpeacn+aOp+S7tuaYvuekuuaVhemanCAjOTkx77yMaW9z57uf5LiA55SoUEPnq6/kuIDmoLfnmoRqc+aOp+S7tlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcblx0XHRcdFx0XHRcdFx0XHRwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxuXHRcdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW09iamVjdF1cIlxuXHRcdFx0ZnMudHlwZSA9IFtPYmplY3RdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaHRtbFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zSHRtbCc7XG5cdFx0XHQjIGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0IyBcdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0XHRcdCMgXHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PSBcInpoLUNOXCJcblx0XHRcdCMgXHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXHRcdFx0IyBcdGVsc2Vcblx0XHRcdCMgXHRcdGxvY2FsZSA9IFwiZW4tVVNcIlxuXHRcdFx0IyBcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHQjIFx0XHR0eXBlOiBcInN1bW1lcm5vdGVcIlxuXHRcdFx0IyBcdFx0Y2xhc3M6ICdzdW1tZXJub3RlLWVkaXRvcidcblx0XHRcdCMgXHRcdHNldHRpbmdzOlxuXHRcdFx0IyBcdFx0XHRoZWlnaHQ6IDIwMFxuXHRcdFx0IyBcdFx0XHRkaWFsb2dzSW5Cb2R5OiB0cnVlXG5cdFx0XHQjIFx0XHRcdHRvb2xiYXI6ICBbXG5cdFx0XHQjIFx0XHRcdFx0Wydmb250MScsIFsnc3R5bGUnXV0sXG5cdFx0XHQjIFx0XHRcdFx0Wydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsnZm9udDMnLCBbJ2ZvbnRuYW1lJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsnY29sb3InLCBbJ2NvbG9yJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsndGFibGUnLCBbJ3RhYmxlJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sXG5cdFx0XHQjIFx0XHRcdFx0Wyd2aWV3JywgWydjb2RldmlldyddXVxuXHRcdFx0IyBcdFx0XHRdXG5cdFx0XHQjIFx0XHRcdGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywn6buR5L2TJywn5b6u6L2v6ZuF6buRJywn5Lu/5a6LJywn5qW35L2TJywn6Zq25LmmJywn5bm85ZyGJ11cblx0XHRcdCMgXHRcdFx0bGFuZzogbG9jYWxlXG5cblx0XHRlbHNlIGlmIChmaWVsZC50eXBlID09IFwibG9va3VwXCIgb3IgZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb25cblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXG5cdFx0XHRpZiAhZmllbGQuaGlkZGVuXG5cblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnNcblxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vblxuXG5cdFx0XHRcdGlmIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXHRcdFx0XHRcdGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXG5cdFx0XHRcdGZzLmZpbHRlcnNGdW5jdGlvbiA9IGlmIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiB0aGVuIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiBlbHNlIENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzXG5cblx0XHRcdFx0aWYgZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cdFx0XHRcdFx0ZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdGlmIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dXG5cdFx0XHRcdFx0XHRcdFx0aWYgX3JlZl9vYmo/LnBlcm1pc3Npb25zPy5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSAobG9va3VwX2ZpZWxkKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy4je0NyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcm1JZDogXCJuZXcje2ZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywnXycpfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBcIiN7ZmllbGQucmVmZXJlbmNlX3RvfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wZXJhdGlvbjogXCJpbnNlcnRcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvblN1Y2Nlc3M6IChvcGVyYXRpb24sIHJlc3VsdCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVzdWx0Lm9iamVjdF9uYW1lID09IFwib2JqZWN0c1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSwgaWNvbjogcmVzdWx0LnZhbHVlLmljb259XSwgcmVzdWx0LnZhbHVlLm5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsIHZhbHVlOiByZXN1bHQuX2lkfV0sIHJlc3VsdC5faWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2VcblxuXHRcdFx0XHRcdGlmIF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSlcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZVxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3NvcnRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnRcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9saW1pdFxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0XG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VUb0ZpZWxkID0gZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkXG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJ1c2Vyc1wiXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzliIbpg6jkuIvnmoTmlbDmja5cblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWIhumDqOWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzlrZfmrrXmiYDlsZ7lr7nosaHmmK/nlKjmiLfmiJbnu4Tnu4fvvIzliJnmmK/lkKbpmZDliLbmmL7npLrmiYDlsZ7liIbpg6jpg6jpl6jkuI5tb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5YWz6IGUXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzVW5MaW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRnVuY3Rpb24gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHQjIOS8oOWFpeW9k+WJjeWvueixoeeahOadg+mZkO+8jOWcqOWHveaVsOS4reagueaNruadg+mZkOiuoeeul+aYr+WQpuimgemZkOWItuWPquafpeeci+acrOWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucylcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOacjeWKoeerr+eUqOS4jeWIsGlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdGVsc2UgaWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwib3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RvcmdcIlxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOihqOekuui/h+a7pOaVsOaNruaXtuaYr+WQpuWPquaYvuekuuacrOWIhumDqOS4i+eahOaVsOaNrlxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOWPr+S7peiiq+aUueWGmeimhuebluaIkHRydWUvZmFsc2XmiJblhbbku5ZmdW5jdGlvblxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdFx0IyDmnKrlrprkuYlpc19jb21wYW55X2xpbWl0ZWTlsZ7mgKfml7bpu5jorqTlpITnkIbpgLvovpHvvJpcblx0XHRcdFx0XHRcdFx0XHQjIOWvueW9k+WJjeWvueixoeaciXZpZXdBbGxSZWNvcmRz5p2D6ZmQ5YiZ5LiN6ZmQ5Yi25omA5bGe5YiG6YOo5YiX6KGo5p+l55yL5p2D6ZmQ77yM5ZCm5YiZ5Y+q5pi+56S65b2T5YmN5omA5bGe5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnNcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWIhumDqOmDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgdHlwZW9mKGZpZWxkLnJlZmVyZW5jZV90bykgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0XHRcdFx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZVxuXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBTdHJpbmdcblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBbU3RyaW5nXVxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b11cblxuXHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXVxuXHRcdFx0XHRcdFx0aWYgX29iamVjdCBhbmQgX29iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIlxuXG5cdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdXG5cdFx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90by5mb3JFYWNoIChfcmVmZXJlbmNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfb2JqZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IF9vYmplY3Q/LmxhYmVsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogX29iamVjdD8uaWNvblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb25cblxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb25cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIlxuXHRcdFx0IyDlm6DkuLrliJfooajop4blm77lj7Pkvqfov4fmu6Tlmajov5jmmK/nlKjnmoTogIHooajljZXnmoRsb29rdXDlkoxzZWxlY3Tmjqfku7bvvIzmiYDku6XkuIrpnaLnmoTku6PnoIHlp4vnu4jkv53mjIHljp/moLfpnIDopoHmiafooYxcblx0XHRcdCMg5LiL6Z2i5piv6YWN572u5LqGZGF0YV90eXBl5pe277yM6aKd5aSW5aSE55CG55qE6YC76L6RXG5cdFx0XHRpZiBmaWVsZC5kYXRhX3R5cGUgYW5kIGZpZWxkLmRhdGFfdHlwZSAhPSBcInRleHRcIlxuXHRcdFx0XHRpZiBbXCJudW1iZXJcIiwgXCJjdXJyZW5jeVwiLCBcInBlcmNlbnRcIl0uaW5kZXhPZihmaWVsZC5kYXRhX3R5cGUpID4gLTFcblx0XHRcdFx0XHRmc1R5cGUgPSBOdW1iZXJcblx0XHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdFx0XHRlbHNlIGlmIGZpZWxkLmRhdGFfdHlwZSA9PSBcImJvb2xlYW5cIlxuXHRcdFx0XHRcdGZzVHlwZSA9IEJvb2xlYW5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzVHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy50eXBlID0gZnNUeXBlXG5cdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdFx0ZnMudHlwZSA9IFtmc1R5cGVdXG5cdFx0XHRcdFx0XG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMoZmllbGQpXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY3VycmVuY3lcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0XHRlbHNlIGlmIGZpZWxkPy5zY2FsZSAhPSAwXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gMlxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm51bWJlclwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJib29sZWFuXCJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidG9nZ2xlXCJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi10b2dnbGVcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInJlZmVyZW5jZVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY2hlY2tib3hcIlxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlXCJcblx0XHRcdGNvbGxlY3Rpb25OYW1lID0gZmllbGQuY29sbGVjdGlvbiB8fCBcImZpbGVzXCIgIyBjb2xsZWN0aW9uIOm7mOiupOaYryAnZmlsZXMnXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTmFtZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImZpbGVzaXplXCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PSBcIm9iamVjdFwiXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZ3JpZFwiXG5cdFx0XHRmcy50eXBlID0gQXJyYXlcblx0XHRcdGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIlxuXG5cdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHR0eXBlOiBPYmplY3Rcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJpbWFnZVwiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2ltYWdlcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXZhdGFyXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXZhdGFycydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF1ZGlvXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXVkaW9zJ1xuXHRcdFx0XHRcdFx0YWNjZXB0OiAnYXVkaW8vKidcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ2aWRlb1wiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ3ZpZGVvcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ3ZpZGVvLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibG9jYXRpb25cIlxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIlxuXHRcdFx0ZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIlxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibWFya2Rvd25cIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGV4dFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICd1cmwnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHQjIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LlVybFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zVXJsJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZW1haWwnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcblx0XHRcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdzdW1tYXJ5J1xuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cblx0XHQjIGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xuXHRcdCMgXHRmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtmaWVsZHM6IHtmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHt0eXBlOiBmaWVsZC5kYXRhX3R5cGV9KX19KVtmaWVsZC5uYW1lXVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAncGVyY2VudCdcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHR1bmxlc3MgXy5pc051bWJlcihmaWVsZC5zY2FsZSlcblx0XHRcdFx0IyDmsqHphY3nva7lsI/mlbDkvY3mlbDliJnmjInlsI/mlbDkvY3mlbAw5p2l5aSE55CG77yM5Y2z6buY6K6k5pi+56S65Li65pW05pWw55qE55m+5YiG5q+U77yM5q+U5aaCMjAl77yM5q2k5pe25o6n5Lu25Y+v5Lul6L6T5YWlMuS9jeWwj+aVsO+8jOi9rOaIkOeZvuWIhuavlOWwseaYr+aVtOaVsFxuXHRcdFx0XHRmaWVsZC5zY2FsZSA9IDBcblx0XHRcdCMgYXV0b2Zvcm3mjqfku7bkuK3lsI/mlbDkvY3mlbDlp4vnu4jmr5TphY3nva7nmoTkvY3mlbDlpJoy5L2NXG5cdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlICsgMlxuXHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlXG5cdFx0XHRmcy50eXBlID0gZmllbGQudHlwZVxuXG5cdFx0aWYgZmllbGQubGFiZWxcblx0XHRcdGZzLmxhYmVsID0gZmllbGQubGFiZWxcblxuI1x0XHRpZiBmaWVsZC5hbGxvd2VkVmFsdWVzXG4jXHRcdFx0ZnMuYWxsb3dlZFZhbHVlcyA9IGZpZWxkLmFsbG93ZWRWYWx1ZXNcblxuXHRcdGlmICFmaWVsZC5yZXF1aXJlZFxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXG5cblx0XHQjIFvnrb7nuqblr7nosaHlkIzml7bphY3nva7kuoZjb21wYW55X2lkc+W/heWhq+WPinVuZWRpdGFibGVfZmllbGRz6YCg5oiQ6YOo5YiG55So5oi35paw5bu6562+57qm5a+56LGh5pe25oql6ZSZICMxOTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9zdGVlZG9zL3N0ZWVkb3MtcHJvamVjdC1kenVnL2lzc3Vlcy8xOTIpXG5cdFx0IyDlkI7lj7Dlp4vnu4jorr7nva5yZXF1aXJlZOS4umZhbHNlXG5cdFx0aWYgIU1ldGVvci5pc0NsaWVudFxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC51bmlxdWVcblx0XHRcdGZzLnVuaXF1ZSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLm9taXRcblx0XHRcdGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5ncm91cFxuXHRcdFx0ZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cFxuXG5cdFx0aWYgZmllbGQuaXNfd2lkZVxuXHRcdFx0ZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmhpZGRlblxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCJcblxuXHRcdGlmIChmaWVsZC50eXBlID09IFwic2VsZWN0XCIpIG9yIChmaWVsZC50eXBlID09IFwibG9va3VwXCIpIG9yIChmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLmZpbHRlcmFibGUpID09ICd1bmRlZmluZWQnXG5cdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXG5cdFx0aWYgZmllbGQubmFtZSA9PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZVxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLnNlYXJjaGFibGUpID09ICd1bmRlZmluZWQnXG5cdFx0XHRcdGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlXG5cblx0XHRpZiBhdXRvZm9ybV90eXBlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZVxuXG5cdFx0aWYgZmllbGQuZGVmYXVsdFZhbHVlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gKCktPlxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHt1c2VySWQ6IE1ldGVvci51c2VySWQoKSwgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCBub3c6IG5ldyBEYXRlKCl9KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdCMgXHRpZiAhXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdCMgXHRcdGZzLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXG5cdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuZGlzYWJsZWRcblx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuaW5saW5lSGVscFRleHRcblx0XHRcdGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHRcblxuXHRcdGlmIGZpZWxkLmJsYWNrYm94XG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcblxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWluJylcblx0XHRcdGZzLm1pbiA9IGZpZWxkLm1pblxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWF4Jylcblx0XHRcdGZzLm1heCA9IGZpZWxkLm1heFxuXG5cdFx0IyDlj6rmnInnlJ/kuqfnjq/looPmiY3ph43lu7rntKLlvJVcblx0XHRpZiBNZXRlb3IuaXNQcm9kdWN0aW9uXG5cdFx0XHRpZiBmaWVsZC5pbmRleFxuXHRcdFx0XHRmcy5pbmRleCA9IGZpZWxkLmluZGV4XG5cdFx0XHRlbHNlIGlmIGZpZWxkLnNvcnRhYmxlXG5cdFx0XHRcdGZzLmluZGV4ID0gdHJ1ZVxuXG5cdFx0c2NoZW1hW2ZpZWxkX25hbWVdID0gZnNcblxuXHRyZXR1cm4gc2NoZW1hXG5cblxuQ3JlYXRvci5nZXRGaWVsZERpc3BsYXlWYWx1ZSA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpLT5cblx0aHRtbCA9IGZpZWxkX3ZhbHVlXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuIFwiXCJcblx0ZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpXG5cdGlmICFmaWVsZFxuXHRcdHJldHVybiBcIlwiXG5cblx0aWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpXG5cdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxuXHRcdGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG5cblx0cmV0dXJuIGh0bWxcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSAoZmllbGRfdHlwZSktPlxuXHRyZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwidGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpLT5cblx0YnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSlcblx0aWYgYnVpbHRpblZhbHVlc1xuXHRcdF8uZm9yRWFjaCBidWlsdGluVmFsdWVzLCAoYnVpbHRpbkl0ZW0sIGtleSktPlxuXHRcdFx0b3BlcmF0aW9ucy5wdXNoKHtsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsIHZhbHVlOiBrZXl9KVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpLT5cblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSAoZmllbGRfdHlwZSwgdmFsdWUpLT5cblx0IyDmoLnmja7ov4fmu6TlmajnmoTov4fmu6TlgLzvvIzojrflj5blr7nlupTnmoTlhoXnva7ov5DnrpfnrKZcblx0IyDmr5TlpoJ2YWx1ZeS4umxhc3RfeWVhcu+8jOi/lOWbnmJldHdlZW5fdGltZV9sYXN0X3llYXJcblx0dW5sZXNzIF8uaXNTdHJpbmcodmFsdWUpXG5cdFx0cmV0dXJuXG5cdGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxuXHR1bmxlc3MgYmV0d2VlbkJ1aWx0aW5WYWx1ZXNcblx0XHRyZXR1cm5cblx0cmVzdWx0ID0gbnVsbFxuXHRfLmVhY2ggYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIChpdGVtLCBvcGVyYXRpb24pLT5cblx0XHRpZiBpdGVtLmtleSA9PSB2YWx1ZVxuXHRcdFx0cmVzdWx0ID0gb3BlcmF0aW9uXG5cdHJldHVybiByZXN1bHRcblxuIyDlpoLmnpzlj6rmmK/kuLrliKTmlq1vcGVyYXRpb27mmK/lkKblrZjlnKjvvIzliJnmsqHlv4XopoHorqHnrpd2YWx1ZXPvvIzkvKDlhaVpc19jaGVja19vbmx55Li6dHJ1ZeWNs+WPr1xuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSAoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSktPlxuXHQjIOi/h+a7pOWZqOaXtumXtOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRyZXR1cm4ge1xuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuXHR9XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSAobW9udGgpLT5cblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHJldHVybiAwXG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0cmV0dXJuIDNcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRyZXR1cm4gNlxuXHRcblx0cmV0dXJuIDlcblxuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHllYXItLVxuXHRcdG1vbnRoID0gOVxuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdG1vbnRoID0gMFxuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdG1vbnRoID0gM1xuXHRlbHNlIFxuXHRcdG1vbnRoID0gNlxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gKHllYXIsbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHRtb250aCA9IDNcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRtb250aCA9IDZcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRtb250aCA9IDlcblx0ZWxzZVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoID0gMFxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmIG1vbnRoID09IDExXG5cdFx0cmV0dXJuIDMxXG5cdFxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcblx0c3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCsxLCAxKVxuXHRkYXlzID0gKGVuZERhdGUtc3RhcnREYXRlKS9taWxsaXNlY29uZFxuXHRyZXR1cm4gZGF5c1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gKHllYXIsIG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0IyDmnIjku73kuLow5Luj6KGo5pys5bm055qE56ys5LiA5pyIXG5cdGlmIG1vbnRoID09IDBcblx0XHRtb250aCA9IDExXG5cdFx0eWVhci0tXG5cdFx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblx0IyDlkKbliJks5Y+q5YeP5Y675pyI5Lu9XG5cdG1vbnRoLS07XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cblx0IyDov4fmu6TlmahiZXR3ZWVu6L+Q566X56ym77yM546w566X5pel5pyfL+aXpeacn+aXtumXtOexu+Wei+Wtl+auteeahHZhbHVlc+WAvFxuXHRub3cgPSBuZXcgRGF0ZSgpXG5cdCMg5LiA5aSp55qE5q+r56eS5pWwXG5cdG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNFxuXHR5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHR0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcblx0IyDkuIDlkajkuK3nmoTmn5DkuIDlpKlcblx0d2VlayA9IG5vdy5nZXREYXkoKVxuXHQjIOWHj+WOu+eahOWkqeaVsFxuXHRtaW51c0RheSA9IGlmIHdlZWsgIT0gMCB0aGVuIHdlZWsgLSAxIGVsc2UgNlxuXHRtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKVxuXHRzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg5LiK5ZGo5pelXG5cdGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5LiK5ZGo5LiAXG5cdGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKVxuXHQjIOS4i+WRqOS4gFxuXHRuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxuXHQjIOS4i+WRqOaXpVxuXHRuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSlcblx0Y3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDFcblx0bmV4dFllYXIgPSBjdXJyZW50WWVhciArIDFcblx0IyDlvZPliY3mnIjku71cblx0Y3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDorqHmlbDlubTjgIHmnIhcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG5cdG1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDmnKzmnIjnrKzkuIDlpKlcblx0Zmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixjdXJyZW50TW9udGgsMSlcblxuXHQjIOW9k+S4ujEy5pyI55qE5pe25YCZ5bm05Lu96ZyA6KaB5YqgMVxuXHQjIOaciOS7vemcgOimgeabtOaWsOS4ujAg5Lmf5bCx5piv5LiL5LiA5bm055qE56ys5LiA5Liq5pyIXG5cdGlmIGN1cnJlbnRNb250aCA9PSAxMVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoKytcblx0ZWxzZVxuXHRcdG1vbnRoKytcblx0XG5cdCMg5LiL5pyI56ys5LiA5aSpXG5cdG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdCMg5LiL5pyI5pyA5ZCO5LiA5aSpXG5cdG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhcixtb250aCxDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLG1vbnRoKSlcblx0IyDmnKzmnIjmnIDlkI7kuIDlpKlcblx0bGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOS4iuaciOesrOS4gOWkqVxuXHRsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4iuaciOacgOWQjuS4gOWkqVxuXHRsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOacrOWto+W6puW8gOWni+aXpVxuXHR0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLDEpXG5cdCMg5pys5a2j5bqm57uT5p2f5pelXG5cdHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIsQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIpKVxuXHQjIOS4iuWto+W6puW8gOWni+aXpVxuXHRsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIrlraPluqbnu5PmnZ/ml6Vcblx0bGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcblx0IyDkuIvlraPluqblvIDlp4vml6Vcblx0bmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiL5a2j5bqm57uT5p2f5pelXG5cdG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMikpXG5cdCMg6L+H5Y67N+WkqSBcblx0bGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MzDlpKlcblx0bGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrs2MOWkqVxuXHRsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzkw5aSpXG5cdGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MTIw5aSpXG5cdGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU35aSpIFxuXHRuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUzMOWkqVxuXHRuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTYw5aSpXG5cdG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lOTDlpKlcblx0bmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUxMjDlpKlcblx0bmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKVxuXG5cdHN3aXRjaCBrZXlcblx0XHR3aGVuIFwibGFzdF95ZWFyXCJcblx0XHRcdCPljrvlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7cHJldmlvdXNZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc195ZWFyXCJcblx0XHRcdCPku4rlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfeWVhclwiXG5cdFx0XHQj5piO5bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4iuWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3F1YXJ0ZXJcIlxuXHRcdFx0I+acrOWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4i+Wto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X21vbnRoXCJcblx0XHRcdCPkuIrmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX21vbnRoXCJcblx0XHRcdCPmnKzmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfbW9udGhcIlxuXHRcdFx0I+S4i+aciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3Rfd2Vla1wiXG5cdFx0XHQj5LiK5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc193ZWVrXCJcblx0XHRcdCPmnKzlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF93ZWVrXCJcblx0XHRcdCPkuIvlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ5ZXN0ZGF5XCJcblx0XHRcdCPmmKjlpKlcblx0XHRcdHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0b2RheVwiXG5cdFx0XHQj5LuK5aSpXG5cdFx0XHRzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidG9tb3Jyb3dcIlxuXHRcdFx0I+aYjuWkqVxuXHRcdFx0c3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF83X2RheXNcIlxuXHRcdFx0I+i/h+WOuzflpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIFxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8zMF9kYXlzXCJcblx0XHRcdCPov4fljrszMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF82MF9kYXlzXCJcblx0XHRcdCPov4fljrs2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF85MF9kYXlzXCJcblx0XHRcdCPov4fljrs5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8xMjBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67MTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfN19kYXlzXCJcblx0XHRcdCPmnKrmnaU35aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8zMF9kYXlzXCJcblx0XHRcdCPmnKrmnaUzMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF82MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF85MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8xMjBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lMTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFxuXHR2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdXG5cdGlmIGZpZWxkX3R5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0IyDml7bpl7TnsbvlnovlrZfmrrXvvIzlhoXnva7ml7bpl7TojIPlm7TlupTor6XogIPomZHlgY/np7vml7bljLrlgLzvvIzlkKbliJnov4fmu6TmlbDmja7lrZjlnKjlgY/lt65cblx0XHQjIOmdnuWGhee9ruaXtumXtOiMg+WbtOaXtu+8jOeUqOaIt+mAmui/h+aXtumXtOaOp+S7tumAieaLqeeahOiMg+WbtO+8jOS8muiHquWKqOWkhOeQhuaXtuWMuuWBj+W3ruaDheWGtVxuXHRcdCMg5pel5pyf57G75Z6L5a2X5q6177yM5pWw5o2u5bqT5pys5p2l5bCx5a2Y55qE5pivVVRD55qEMOeCue+8jOS4jeWtmOWcqOWBj+W3rlxuXHRcdF8uZm9yRWFjaCB2YWx1ZXMsIChmdiktPlxuXHRcdFx0aWYgZnZcblx0XHRcdFx0ZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCApXG5cdFxuXHRyZXR1cm4ge1xuXHRcdGxhYmVsOiBsYWJlbFxuXHRcdGtleToga2V5XG5cdFx0dmFsdWVzOiB2YWx1ZXNcblx0fVxuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKS0+XG5cdGlmIGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gJ2JldHdlZW4nXG5cdGVsc2UgaWYgW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiAnY29udGFpbnMnXG5cdGVsc2Vcblx0XHRyZXR1cm4gXCI9XCJcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKSAtPlxuXHQjIOaXpeacn+exu+WeizogZGF0ZSwgZGF0ZXRpbWUgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOaWh+acrOexu+WeizogdGV4dCwgdGV4dGFyZWEsIGh0bWwgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIsIFwic3RhcnRzd2l0aFwiXG5cdCMg6YCJ5oup57G75Z6LOiBsb29rdXAsIG1hc3Rlcl9kZXRhaWwsIHNlbGVjdCDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblx0IyDmlbDlgLznsbvlnos6IGN1cnJlbmN5LCBudW1iZXIgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOW4g+WwlOexu+WeizogYm9vbGVhbiAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cdCMg5pWw57uE57G75Z6LOiBjaGVja2JveCwgW3RleHRdICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblxuXHRvcHRpb25hbHMgPSB7XG5cdFx0ZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSwgdmFsdWU6IFwiPVwifSxcblx0XHR1bmVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSwgdmFsdWU6IFwiPD5cIn0sXG5cdFx0bGVzc190aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLCB2YWx1ZTogXCI8XCJ9LFxuXHRcdGdyZWF0ZXJfdGhhbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSwgdmFsdWU6IFwiPlwifSxcblx0XHRsZXNzX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPD1cIn0sXG5cdFx0Z3JlYXRlcl9vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksIHZhbHVlOiBcIj49XCJ9LFxuXHRcdGNvbnRhaW5zOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksIHZhbHVlOiBcImNvbnRhaW5zXCJ9LFxuXHRcdG5vdF9jb250YWluOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSwgdmFsdWU6IFwibm90Y29udGFpbnNcIn0sXG5cdFx0c3RhcnRzX3dpdGg6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSwgdmFsdWU6IFwic3RhcnRzd2l0aFwifSxcblx0XHRiZXR3ZWVuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSwgdmFsdWU6IFwiYmV0d2VlblwifSxcblx0fVxuXG5cdGlmIGZpZWxkX3R5cGUgPT0gdW5kZWZpbmVkXG5cdFx0cmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscylcblxuXHRvcGVyYXRpb25zID0gW11cblxuXHRpZiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbilcblx0XHRDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGRfdHlwZSA9PSBcInRleHRhcmVhXCIgb3IgZmllbGRfdHlwZSA9PSBcImh0bWxcIiBvciBmaWVsZF90eXBlID09IFwiY29kZVwiXG4jXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMuY29udGFpbnMsIG9wdGlvbmFscy5ub3RfY29udGFpbiwgb3B0aW9uYWxzLnN0YXJ0c193aXRoKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgb3IgZmllbGRfdHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImN1cnJlbmN5XCIgb3IgZmllbGRfdHlwZSA9PSBcIm51bWJlclwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiYm9vbGVhblwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiW3RleHRdXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXG5cdHJldHVybiBvcGVyYXRpb25zXG5cbiMjI1xuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuIyMjXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSAob2JqZWN0X25hbWUpLT5cblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcblx0ZmllbGRzQXJyID0gW11cblxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQpLT5cblx0XHRmaWVsZHNBcnIucHVzaCB7bmFtZTogZmllbGQubmFtZSwgc29ydF9ubzogZmllbGQuc29ydF9ub31cblxuXHRmaWVsZHNOYW1lID0gW11cblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cblx0XHRmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSlcblx0cmV0dXJuIGZpZWxkc05hbWVcbiIsIkNyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyA9IGZ1bmN0aW9uKGZpZWxkU2NoZW1hKSB7XG4gIHZhciBkYXRhX3R5cGUsIG9wdGlvbnM7XG4gIG9wdGlvbnMgPSBmaWVsZFNjaGVtYS5vcHRpb25zO1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGF0YV90eXBlID0gZmllbGRTY2hlbWEuZGF0YV90eXBlO1xuICBpZiAoIV8uaXNGdW5jdGlvbihvcHRpb25zKSAmJiBkYXRhX3R5cGUgJiYgZGF0YV90eXBlICE9PSAndGV4dCcpIHtcbiAgICBvcHRpb25zLmZvckVhY2goZnVuY3Rpb24ob3B0aW9uSXRlbSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25JdGVtLnZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoWydudW1iZXInLCAnY3VycmVuY3knLCAncGVyY2VudCddLmluZGV4T2YoZGF0YV90eXBlKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25JdGVtLnZhbHVlID0gTnVtYmVyKG9wdGlvbkl0ZW0udmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhX3R5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gb3B0aW9uSXRlbS52YWx1ZSA9IG9wdGlvbkl0ZW0udmFsdWUgPT09ICd0cnVlJztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBmaWVsZHNBcnIsIHNjaGVtYTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc2NoZW1hID0ge307XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2gob2JqLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoIV8uaGFzKGZpZWxkLCBcIm5hbWVcIikpIHtcbiAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goZmllbGQpO1xuICB9KTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHZhciBfb2JqZWN0LCBfcmVmX29iaiwgX3JlZmVyZW5jZV90bywgYXV0b2Zvcm1fdHlwZSwgY29sbGVjdGlvbk5hbWUsIGZpZWxkX25hbWUsIGZzLCBmc1R5cGUsIGlzVW5MaW1pdGVkLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxO1xuICAgIGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lO1xuICAgIGZzID0ge307XG4gICAgaWYgKGZpZWxkLnJlZ0V4KSB7XG4gICAgICBmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4O1xuICAgIH1cbiAgICBmcy5hdXRvZm9ybSA9IHt9O1xuICAgIGZzLmF1dG9mb3JtLm11bHRpcGxlID0gZmllbGQubXVsdGlwbGU7XG4gICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgIGF1dG9mb3JtX3R5cGUgPSAocmVmID0gZmllbGQuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMDtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJwaG9uZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbdGV4dF1cIiB8fCBmaWVsZC50eXBlID09PSBcIltwaG9uZV1cIikge1xuICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2NvZGUnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyO1xuICAgICAgaWYgKGZpZWxkLmxhbmd1YWdlKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmxhbmd1YWdlID0gZmllbGQubGFuZ3VhZ2U7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicGFzc3dvcmRcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIixcbiAgICAgICAgICAgICAgICBwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgICBkYXRlTW9iaWxlT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiBcInRpbWVcIixcbiAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwiSEg6bW1cIlxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCIsXG4gICAgICAgICAgICAgICAgcGlja2VyVHlwZTogXCJyb2xsZXJzXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zSHRtbCc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmaWVsZC5zaG93SWNvbjtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICB9XG4gICAgICBpZiAoIWZpZWxkLmhpZGRlbikge1xuICAgICAgICBmcy5hdXRvZm9ybS5maWx0ZXJzID0gZmllbGQuZmlsdGVycztcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb247XG4gICAgICAgIGlmIChmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgZnMuZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uID8gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIDogQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnM7XG4gICAgICAgIGlmIChmaWVsZC5vcHRpb25zRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90bykge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgX3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgICAgICBpZiAoX3JlZl9vYmogIT0gbnVsbCA/IChyZWYxID0gX3JlZl9vYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYxLmFsbG93Q3JlYXRlIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihsb29rdXBfZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy5cIiArIChDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgZm9ybUlkOiBcIm5ld1wiICsgKGZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywgJ18nKSksXG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IFwiXCIgKyBmaWVsZC5yZWZlcmVuY2VfdG8sXG4gICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImluc2VydFwiLFxuICAgICAgICAgICAgICAgICAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24ob3BlcmF0aW9uLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZXN1bHQub2JqZWN0X25hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IHJlc3VsdC52YWx1ZS5pY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQudmFsdWUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSkpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9zb3J0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX2xpbWl0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTGltaXQgPSBmaWVsZC5yZWZlcmVuY2VfbGltaXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZVRvRmllbGQgPSBmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwidXNlcnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnM7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwib3JnYW5pemF0aW9uc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RvcmdcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KF9yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgICAgICAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub2JqZWN0U3dpdGNoZSA9IHRydWU7XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFtTdHJpbmddLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV90b1swXV07XG4gICAgICAgICAgICBpZiAoX29iamVjdCAmJiBfb2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFRyZWVcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2QgPSBmaWVsZC5vcHRpb25zTWV0aG9kIHx8IFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiO1xuICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZFBhcmFtcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvLmZvckVhY2goZnVuY3Rpb24oX3JlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlXTtcbiAgICAgICAgICAgICAgICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5sYWJlbCA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBpY29uOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0SWNvbiA9IGZpZWxkLmRlZmF1bHRJY29uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmYWxzZTtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICAgIGlmIChfLmhhcyhmaWVsZCwgJ2ZpcnN0T3B0aW9uJykpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IGZpZWxkLmZpcnN0T3B0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZpZWxkLmRhdGFfdHlwZSAmJiBmaWVsZC5kYXRhX3R5cGUgIT09IFwidGV4dFwiKSB7XG4gICAgICAgIGlmIChbXCJudW1iZXJcIiwgXCJjdXJyZW5jeVwiLCBcInBlcmNlbnRcIl0uaW5kZXhPZihmaWVsZC5kYXRhX3R5cGUpID4gLTEpIHtcbiAgICAgICAgICBmc1R5cGUgPSBOdW1iZXI7XG4gICAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZmllbGQuZGF0YV90eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgIGZzVHlwZSA9IEJvb2xlYW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnNUeXBlID0gU3RyaW5nO1xuICAgICAgICB9XG4gICAgICAgIGZzLnR5cGUgPSBmc1R5cGU7XG4gICAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICAgIGZzLnR5cGUgPSBbZnNUeXBlXTtcbiAgICAgICAgfVxuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zKGZpZWxkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiY3VycmVuY3lcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApICE9PSAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gMjtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidG9nZ2xlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBCb29sZWFuO1xuICAgICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi10b2dnbGVcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicmVmZXJlbmNlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdC1jaGVja2JveFwiO1xuICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVcIikge1xuICAgICAgY29sbGVjdGlvbk5hbWUgPSBmaWVsZC5jb2xsZWN0aW9uIHx8IFwiZmlsZXNcIjtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWVcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gY29sbGVjdGlvbk5hbWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVzaXplXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZ3JpZFwiKSB7XG4gICAgICBmcy50eXBlID0gQXJyYXk7XG4gICAgICBmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWU7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiO1xuICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2ltYWdlcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdmF0YXJcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXZhdGFycycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXVkaW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2F1ZGlvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInZpZGVvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ3ZpZGVvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICd2aWRlby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb2NhdGlvblwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIjtcbiAgICAgIGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCI7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0ZXh0XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAndXJsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZW1haWwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWw7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHtcbiAgICAgICAgICAgIHR5cGU6IGZpZWxkLmRhdGFfdHlwZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pW2ZpZWxkLm5hbWVdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICBmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7XG4gICAgICAgICAgICB0eXBlOiBmaWVsZC5kYXRhX3R5cGVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVtmaWVsZC5uYW1lXTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdwZXJjZW50Jykge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmICghXy5pc051bWJlcihmaWVsZC5zY2FsZSkpIHtcbiAgICAgICAgZmllbGQuc2NhbGUgPSAwO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZSArIDI7XG4gICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnMudHlwZSA9IGZpZWxkLnR5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5sYWJlbCkge1xuICAgICAgZnMubGFiZWwgPSBmaWVsZC5sYWJlbDtcbiAgICB9XG4gICAgaWYgKCFmaWVsZC5yZXF1aXJlZCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQudW5pcXVlKSB7XG4gICAgICBmcy51bmlxdWUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQub21pdCkge1xuICAgICAgZnMuYXV0b2Zvcm0ub21pdCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ncm91cCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlzX3dpZGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaGlkZGVuKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIjtcbiAgICB9XG4gICAgaWYgKChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5maWx0ZXJhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLm5hbWUgPT09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLnNlYXJjaGFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXV0b2Zvcm1fdHlwZSkge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kZWZhdWx0VmFsdWUpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7XG4gICAgICAgICAgICB1c2VySWQ6IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSxcbiAgICAgICAgICAgIG5vdzogbmV3IERhdGUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgIGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRpc2FibGVkKSB7XG4gICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5pbmxpbmVIZWxwVGV4dCkge1xuICAgICAgZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmJsYWNrYm94KSB7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChfLmhhcyhmaWVsZCwgJ21pbicpKSB7XG4gICAgICBmcy5taW4gPSBmaWVsZC5taW47XG4gICAgfVxuICAgIGlmIChfLmhhcyhmaWVsZCwgJ21heCcpKSB7XG4gICAgICBmcy5tYXggPSBmaWVsZC5tYXg7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNQcm9kdWN0aW9uKSB7XG4gICAgICBpZiAoZmllbGQuaW5kZXgpIHtcbiAgICAgICAgZnMuaW5kZXggPSBmaWVsZC5pbmRleDtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGQuc29ydGFibGUpIHtcbiAgICAgICAgZnMuaW5kZXggPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2NoZW1hW2ZpZWxkX25hbWVdID0gZnM7XG4gIH0pO1xuICByZXR1cm4gc2NoZW1hO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERpc3BsYXlWYWx1ZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSkge1xuICB2YXIgZmllbGQsIGh0bWwsIG9iamVjdDtcbiAgaHRtbCA9IGZpZWxkX3ZhbHVlO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpO1xuICBpZiAoIWZpZWxkKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCBIOm1tJyk7XG4gIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgfVxuICByZXR1cm4gaHRtbDtcbn07XG5cbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICByZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwidGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpO1xufTtcblxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBvcGVyYXRpb25zKSB7XG4gIHZhciBidWlsdGluVmFsdWVzO1xuICBidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKGJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm4gXy5mb3JFYWNoKGJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGJ1aWx0aW5JdGVtLCBrZXkpIHtcbiAgICAgIHJldHVybiBvcGVyYXRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsXG4gICAgICAgIHZhbHVlOiBrZXlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIHZhbHVlKSB7XG4gIHZhciBiZXR3ZWVuQnVpbHRpblZhbHVlcywgcmVzdWx0O1xuICBpZiAoIV8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKCFiZXR3ZWVuQnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybjtcbiAgfVxuICByZXN1bHQgPSBudWxsO1xuICBfLmVhY2goYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGl0ZW0sIG9wZXJhdGlvbikge1xuICAgIGlmIChpdGVtLmtleSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXN1bHQgPSBvcGVyYXRpb247XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSkge1xuICByZXR1cm4ge1xuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuICB9O1xufTtcblxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IGZ1bmN0aW9uKG1vbnRoKSB7XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgcmV0dXJuIDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgcmV0dXJuIDY7XG4gIH1cbiAgcmV0dXJuIDk7XG59O1xuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgeWVhci0tO1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoID0gNjtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDY7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2Uge1xuICAgIHllYXIrKztcbiAgICBtb250aCA9IDA7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgdmFyIGRheXMsIGVuZERhdGUsIG1pbGxpc2Vjb25kLCBzdGFydERhdGU7XG4gIGlmIChtb250aCA9PT0gMTEpIHtcbiAgICByZXR1cm4gMzE7XG4gIH1cbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICBzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDEpO1xuICBkYXlzID0gKGVuZERhdGUgLSBzdGFydERhdGUpIC8gbWlsbGlzZWNvbmQ7XG4gIHJldHVybiBkYXlzO1xufTtcblxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA9PT0gMCkge1xuICAgIG1vbnRoID0gMTE7XG4gICAgeWVhci0tO1xuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIH1cbiAgbW9udGgtLTtcbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIHZhciBjdXJyZW50TW9udGgsIGN1cnJlbnRZZWFyLCBlbmRWYWx1ZSwgZmlyc3REYXksIGxhYmVsLCBsYXN0RGF5LCBsYXN0TW9uZGF5LCBsYXN0TW9udGhGaW5hbERheSwgbGFzdE1vbnRoRmlyc3REYXksIGxhc3RRdWFydGVyRW5kRGF5LCBsYXN0UXVhcnRlclN0YXJ0RGF5LCBsYXN0U3VuZGF5LCBsYXN0XzEyMF9kYXlzLCBsYXN0XzMwX2RheXMsIGxhc3RfNjBfZGF5cywgbGFzdF83X2RheXMsIGxhc3RfOTBfZGF5cywgbWlsbGlzZWNvbmQsIG1pbnVzRGF5LCBtb25kYXksIG1vbnRoLCBuZXh0TW9uZGF5LCBuZXh0TW9udGhGaW5hbERheSwgbmV4dE1vbnRoRmlyc3REYXksIG5leHRRdWFydGVyRW5kRGF5LCBuZXh0UXVhcnRlclN0YXJ0RGF5LCBuZXh0U3VuZGF5LCBuZXh0WWVhciwgbmV4dF8xMjBfZGF5cywgbmV4dF8zMF9kYXlzLCBuZXh0XzYwX2RheXMsIG5leHRfN19kYXlzLCBuZXh0XzkwX2RheXMsIG5vdywgcHJldmlvdXNZZWFyLCBzdGFydFZhbHVlLCBzdHJFbmREYXksIHN0ckZpcnN0RGF5LCBzdHJMYXN0RGF5LCBzdHJNb25kYXksIHN0clN0YXJ0RGF5LCBzdHJTdW5kYXksIHN0clRvZGF5LCBzdHJUb21vcnJvdywgc3RyWWVzdGRheSwgc3VuZGF5LCB0aGlzUXVhcnRlckVuZERheSwgdGhpc1F1YXJ0ZXJTdGFydERheSwgdG9tb3Jyb3csIHZhbHVlcywgd2VlaywgeWVhciwgeWVzdGRheTtcbiAgbm93ID0gbmV3IERhdGUoKTtcbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICB5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdG9tb3Jyb3cgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICB3ZWVrID0gbm93LmdldERheSgpO1xuICBtaW51c0RheSA9IHdlZWsgIT09IDAgPyB3ZWVrIC0gMSA6IDY7XG4gIG1vbmRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAobWludXNEYXkgKiBtaWxsaXNlY29uZCkpO1xuICBzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpO1xuICBuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgbmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpO1xuICBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDE7XG4gIG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxO1xuICBjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpO1xuICBmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIDEpO1xuICBpZiAoY3VycmVudE1vbnRoID09PSAxMSkge1xuICAgIHllYXIrKztcbiAgICBtb250aCsrO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoKys7XG4gIH1cbiAgbmV4dE1vbnRoRmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsIG1vbnRoKSk7XG4gIGxhc3REYXkgPSBuZXcgRGF0ZShuZXh0TW9udGhGaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb250aEZpcnN0RGF5ID0gQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLCAxKTtcbiAgdGhpc1F1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIpKTtcbiAgbGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBuZXh0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIGxhc3RfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2UgXCJsYXN0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChsYXN0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChuZXh0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInllc3RkYXlcIjpcbiAgICAgIHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3llc3RkYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b2RheVwiOlxuICAgICAgc3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvbW9ycm93XCI6XG4gICAgICBzdHJUb21vcnJvdyA9IG1vbWVudCh0b21vcnJvdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgfVxuICB2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdO1xuICBpZiAoZmllbGRfdHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgXy5mb3JFYWNoKHZhbHVlcywgZnVuY3Rpb24oZnYpIHtcbiAgICAgIGlmIChmdikge1xuICAgICAgICByZXR1cm4gZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBsYWJlbDogbGFiZWwsXG4gICAga2V5OiBrZXksXG4gICAgdmFsdWVzOiB2YWx1ZXNcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICBpZiAoZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnYmV0d2Vlbic7XG4gIH0gZWxzZSBpZiAoW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnY29udGFpbnMnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIj1cIjtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgdmFyIG9wZXJhdGlvbnMsIG9wdGlvbmFscztcbiAgb3B0aW9uYWxzID0ge1xuICAgIGVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj1cIlxuICAgIH0sXG4gICAgdW5lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw+XCJcbiAgICB9LFxuICAgIGxlc3NfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPFwiXG4gICAgfSxcbiAgICBncmVhdGVyX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIj5cIlxuICAgIH0sXG4gICAgbGVzc19vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw9XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI+PVwiXG4gICAgfSxcbiAgICBjb250YWluczoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksXG4gICAgICB2YWx1ZTogXCJjb250YWluc1wiXG4gICAgfSxcbiAgICBub3RfY29udGFpbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSxcbiAgICAgIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJcbiAgICB9LFxuICAgIHN0YXJ0c193aXRoOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSxcbiAgICAgIHZhbHVlOiBcInN0YXJ0c3dpdGhcIlxuICAgIH0sXG4gICAgYmV0d2Vlbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSxcbiAgICAgIHZhbHVlOiBcImJldHdlZW5cIlxuICAgIH1cbiAgfTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpO1xuICB9XG4gIG9wZXJhdGlvbnMgPSBbXTtcbiAgaWYgKENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKTtcbiAgICBDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcInRleHRcIiB8fCBmaWVsZF90eXBlID09PSBcInRleHRhcmVhXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJodG1sXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJjb2RlXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkX3R5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjdXJyZW5jeVwiIHx8IGZpZWxkX3R5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJbdGV4dF1cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH1cbiAgcmV0dXJuIG9wZXJhdGlvbnM7XG59O1xuXG5cbi8qXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXG4gICAg5YaN5bCG5rKh5pyJ5o6S5bqP5Y+355qE5pi+56S65ZyoXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGZpZWxkcywgZmllbGRzQXJyLCBmaWVsZHNOYW1lLCByZWY7XG4gIGZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICBmaWVsZHNBcnIgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goe1xuICAgICAgbmFtZTogZmllbGQubmFtZSxcbiAgICAgIHNvcnRfbm86IGZpZWxkLnNvcnRfbm9cbiAgICB9KTtcbiAgfSk7XG4gIGZpZWxkc05hbWUgPSBbXTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gZmllbGRzTmFtZTtcbn07XG4iLCJDcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge31cblxuaW5pdFRyaWdnZXIgPSAob2JqZWN0X25hbWUsIHRyaWdnZXIpLT5cblx0dHJ5XG5cdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcblx0XHRpZiAhdHJpZ2dlci50b2RvXG5cdFx0XHRyZXR1cm5cblx0XHR0b2RvV3JhcHBlciA9ICgpLT5cblx0XHRcdCAgdGhpcy5vYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lXG5cdFx0XHQgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuXHRcdGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS5pbnNlcnRcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy5pbnNlcnQodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS51cGRhdGVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy51cGRhdGUodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS5yZW1vdmVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy5yZW1vdmUodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLmluc2VydFwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci51cGRhdGVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/LnVwZGF0ZSh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIucmVtb3ZlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy5yZW1vdmUodG9kb1dyYXBwZXIpXG5cdGNhdGNoIGVycm9yXG5cdFx0Y29uc29sZS5lcnJvcignaW5pdFRyaWdnZXIgZXJyb3InLCBlcnJvcilcblxuY2xlYW5UcmlnZ2VyID0gKG9iamVjdF9uYW1lKS0+XG5cdCMjI1xuICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXG4gICAgXHTlm6DkuLrkuIDkuKrmlbDnu4TlhYPntKDliKDpmaTlkI7vvIzlhbbku5blhYPntKDnmoTkuIvmoIfkvJrlj5HnlJ/lj5jljJZcblx0IyMjXG4gICAgI1RPRE8g55Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsGJ1Z1xuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXT8ucmV2ZXJzZSgpLmZvckVhY2ggKF9ob29rKS0+XG5cdFx0X2hvb2sucmVtb3ZlKClcblxuQ3JlYXRvci5pbml0VHJpZ2dlcnMgPSAob2JqZWN0X25hbWUpLT5cbiNcdGNvbnNvbGUubG9nKCdDcmVhdG9yLmluaXRUcmlnZ2VycyBvYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKVxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpXG5cblx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0gPSBbXVxuXG5cdF8uZWFjaCBvYmoudHJpZ2dlcnMsICh0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpLT5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgYW5kIHRyaWdnZXIub24gPT0gXCJzZXJ2ZXJcIiBhbmQgdHJpZ2dlci50b2RvIGFuZCB0cmlnZ2VyLndoZW5cblx0XHRcdF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlciBvYmplY3RfbmFtZSwgdHJpZ2dlclxuXHRcdFx0aWYgX3RyaWdnZXJfaG9va1xuXHRcdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcblx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaykiLCJ2YXIgY2xlYW5UcmlnZ2VyLCBpbml0VHJpZ2dlcjtcblxuQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9O1xuXG5pbml0VHJpZ2dlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB0cmlnZ2VyKSB7XG4gIHZhciBjb2xsZWN0aW9uLCBlcnJvciwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCB0b2RvV3JhcHBlcjtcbiAgdHJ5IHtcbiAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIXRyaWdnZXIudG9kbykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0b2RvV3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lO1xuICAgICAgcmV0dXJuIHRyaWdnZXIudG9kby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUuaW5zZXJ0XCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYuaW5zZXJ0KHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUudXBkYXRlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMSA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmMS51cGRhdGUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYyID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYyLnJlbW92ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIuaW5zZXJ0XCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMyA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWYzLmluc2VydCh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIudXBkYXRlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmNCA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWY0LnVwZGF0ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmNSA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWY1LnJlbW92ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICBlcnJvciA9IGVycm9yMTtcbiAgICByZXR1cm4gY29uc29sZS5lcnJvcignaW5pdFRyaWdnZXIgZXJyb3InLCBlcnJvcik7XG4gIH1cbn07XG5cbmNsZWFuVHJpZ2dlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG5cbiAgLypcbiAgICAgXHTnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWw5piv5L2/55So5LiL5qCH5Yig6Zmk5a+56LGh55qE77yM5omA5Lul5q2k5aSE5Y+N6L2saG9va3Ppm4blkIjlkI7vvIzlho3liKDpmaRcbiAgICAgXHTlm6DkuLrkuIDkuKrmlbDnu4TlhYPntKDliKDpmaTlkI7vvIzlhbbku5blhYPntKDnmoTkuIvmoIfkvJrlj5HnlJ/lj5jljJZcbiAgICovXG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0pICE9IG51bGwgPyByZWYucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24oX2hvb2spIHtcbiAgICByZXR1cm4gX2hvb2sucmVtb3ZlKCk7XG4gIH0pIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pbml0VHJpZ2dlcnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgb2JqO1xuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW107XG4gIHJldHVybiBfLmVhY2gob2JqLnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpIHtcbiAgICB2YXIgX3RyaWdnZXJfaG9vaztcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIGlmIChfdHJpZ2dlcl9ob29rKSB7XG4gICAgICAgIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vayk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgcmV0dXJuIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vayk7XG4gICAgfVxuICB9KTtcbn07XG4iLCJjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJylcblxuYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiYWxsb3dDcmVhdGVcIiwgXCJhbGxvd0RlbGV0ZVwiLCBcImFsbG93RWRpdFwiLCBcImFsbG93UmVhZFwiLCBcIm1vZGlmeUFsbFJlY29yZHNcIiwgXCJ2aWV3QWxsUmVjb3Jkc1wiLCBcIm1vZGlmeUNvbXBhbnlSZWNvcmRzXCIsIFwidmlld0NvbXBhbnlSZWNvcmRzXCIsIFxuXHRcImFsbG93UmVhZEZpbGVzXCIsIFwiYWxsb3dFZGl0RmlsZXNcIiwgXCJhbGxvd0NyZWF0ZUZpbGVzXCIsIFwiYWxsb3dEZWxldGVGaWxlc1wiLCBcInZpZXdBbGxGaWxlc1wiLCBcIm1vZGlmeUFsbEZpbGVzXCJdIFxub3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiZGlzYWJsZWRfbGlzdF92aWV3c1wiLCBcImRpc2FibGVkX2FjdGlvbnNcIiwgXCJ1bnJlYWRhYmxlX2ZpZWxkc1wiLCBcInVuZWRpdGFibGVfZmllbGRzXCIsIFwidW5yZWxhdGVkX29iamVjdHNcIiwgXCJ1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFwiXVxucGVybWlzc2lvblByb3BOYW1lcyA9IF8udW5pb24gYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzLCBvdGhlclBlcm1pc3Npb25Qcm9wTmFtZXNcblxuQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgIW9ialxuXHRcdFx0cmV0dXJuXG5cdFx0cmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKVxuXHRlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSwgcmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpLT5cblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRpZiAhc3BhY2VJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcblx0IyDpmYTku7bmnYPpmZDkuI3lho3kuI7lhbbniLborrDlvZXnvJbovpHphY3nva7lhbPogZRcblx0IyBpZiByZWNvcmQgYW5kIG9iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCIgYW5kIE1ldGVvci5pc0NsaWVudFxuXHQjIFx0IyDlpoLmnpzmmK9jbXNfZmlsZXPpmYTku7bvvIzliJnmnYPpmZDlj5blhbbniLborrDlvZXmnYPpmZBcblx0IyBcdGlmIG9iamVjdF9uYW1lID09IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpXG5cdCMgXHRcdCMg5b2T5YmN5aSE5LqOY21zX2ZpbGVz6ZmE5Lu26K+m57uG55WM6Z2iXG5cdCMgXHRcdG9iamVjdF9uYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG5cdCMgXHRcdHJlY29yZF9pZCA9IHJlY29yZC5wYXJlbnQuX2lkO1xuXHQjIFx0ZWxzZSBcblx0IyBcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bnmoTniLborrDlvZXnlYzpnaJcblx0IyBcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKTtcblx0IyBcdFx0cmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG5cdCMgXHRvYmplY3RfZmllbGRzX2tleXMgPSBfLmtleXMoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpPy5maWVsZHMgb3Ige30pIHx8IFtdO1xuXHQjIFx0c2VsZWN0ID0gXy5pbnRlcnNlY3Rpb24ob2JqZWN0X2ZpZWxkc19rZXlzLCBbJ293bmVyJywgJ2NvbXBhbnlfaWQnLCAnY29tcGFueV9pZHMnLCAnbG9ja2VkJ10pIHx8IFtdO1xuXHQjIFx0aWYgc2VsZWN0Lmxlbmd0aCA+IDBcblx0IyBcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0LmpvaW4oJywnKSk7XG5cdCMgXHRlbHNlXG5cdCMgXHRcdHJlY29yZCA9IG51bGw7XG5cblx0cGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpXG5cblx0aWYgcmVjb3JkXG5cdFx0aWYgIV8uaXNFbXB0eShyZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zKVxuXHRcdFx0cmV0dXJuIHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnNcblxuXHRcdGlzT3duZXIgPSByZWNvcmQub3duZXIgPT0gdXNlcklkIHx8IHJlY29yZC5vd25lcj8uX2lkID09IHVzZXJJZFxuXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0IyDpmYTku7bnmoTmn6XnnIvmiYDmnInkv67mlLnmiYDmnInmnYPpmZDkuI7pmYTku7blr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+OAgW1vZGlmeUFsbFJlY29yZHPml6DlhbPvvIzlj6rkuI7lhbbkuLvooajorrDlvZXnmoR2aWV3QWxsRmlsZXPlkoxtb2RpZnlBbGxGaWxlc+acieWFs1xuXHRcdFx0IyDlpoLmnpzmmK9jbXNfZmlsZXPpmYTku7bvvIzliJnmnYPpmZDpnIDopoHpop3lpJbogIPomZHlhbbniLblr7nosaHkuIrlhbPkuo7pmYTku7bnmoTmnYPpmZDphY3nva5cblx0XHRcdG1hc3Rlck9iamVjdE5hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcblx0XHRcdG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG1hc3Rlck9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RGVsZXRlRmlsZXNcblx0XHRcdGlmICFtYXN0ZXJSZWNvcmRQZXJtLm1vZGlmeUFsbEZpbGVzIGFuZCAhaXNPd25lclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRGaWxlc1xuXHRcdFx0aWYgIW1hc3RlclJlY29yZFBlcm0udmlld0FsbEZpbGVzIGFuZCAhaXNPd25lclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZClcblx0XHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkPy5jb21wYW55X2lkXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZCBhbmQgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgYW5kIHJlY29yZF9jb21wYW55X2lkLl9pZFxuXHRcdFx0XHQjIOWboHJlY29yZF9jb21wYW55X2lk5pivbG9va3Vw57G75Z6L77yM5pyJ5Y+v6IO9ZHjmjqfku7bkvJrmiorlroPmmKDlsITovazkuLrlr7nlupTnmoRvYmplY3TvvIzmiYDku6Xov5nph4zlj5blh7rlhbZfaWTlgLxcblx0XHRcdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZD8uY29tcGFueV9pZHNcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCBhbmQgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZHNbMF0pXG5cdFx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWRz5pivbG9va3Vw57G75Z6L77yM5pyJ5Y+v6IO9ZHjmjqfku7bkvJrmiorlroPmmKDlsITovazkuLrlr7nlupTnmoRbb2JqZWN0Xe+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxuXHRcdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmRfY29tcGFueV9pZHMubWFwKChuKS0+IG4uX2lkKVxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gXy51bmlvbihyZWNvcmRfY29tcGFueV9pZHMsIFtyZWNvcmRfY29tcGFueV9pZF0pXG5cdFx0XHRpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRpZiB1c2VyX2NvbXBhbnlfaWRzIGFuZCB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdFx0aWYgIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPkv67mlLlcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6K6w5b2V5pyJY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp++8jOS9huaYr+W9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPkuLrnqbrml7bvvIzorqTkuLrml6DmnYPkv67mlLlcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRcblx0XHRcdGlmIHJlY29yZC5sb2NrZWQgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcblxuXHRcdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxuXHRcdFx0ZWxzZSBpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRpZiB1c2VyX2NvbXBhbnlfaWRzIGFuZCB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdFx0aWYgIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPmn6XnnItcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWTlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5p+l55yLXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxuXHRcblx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblxuIyBjdXJyZW50T2JqZWN0TmFtZe+8muW9k+WJjeS4u+WvueixoVxuIyByZWxhdGVkTGlzdEl0ZW3vvJpDcmVhdG9yLmdldFJlbGF0ZWRMaXN0KFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIiksIFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpKeS4reWPlnJlbGF0ZWRfb2JqZWN0X25hbWXlr7nlupTnmoTlgLxcbiMgY3VycmVudFJlY29yZOW9k+WJjeS4u+WvueixoeeahOivpue7huiusOW9lVxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyA9IChjdXJyZW50T2JqZWN0TmFtZSwgcmVsYXRlZExpc3RJdGVtLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpLT5cblx0XHRpZiAhY3VycmVudE9iamVjdE5hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Y3VycmVudE9iamVjdE5hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0XHRpZiAhcmVsYXRlZExpc3RJdGVtXG5cdFx0XHRjb25zb2xlLmVycm9yKFwicmVsYXRlZExpc3RJdGVtIG11c3Qgbm90IGJlIGVtcHR5IGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zXCIpO1xuXHRcdFx0cmV0dXJuIHt9XG5cblx0XHRpZiAhY3VycmVudFJlY29yZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRjdXJyZW50UmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKVxuXG5cdFx0aWYgIXVzZXJJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRcdGlmICFzcGFjZUlkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblxuXHRcdG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zKGN1cnJlbnRPYmplY3ROYW1lLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpXG5cdFx0cmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpXG5cdFx0cmVzdWx0ID0gXy5jbG9uZSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnNcblxuXHRcdGlmIHJlbGF0ZWRMaXN0SXRlbS5pc19maWxlXG5cdFx0XHRyZXN1bHQuYWxsb3dDcmVhdGUgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzXG5cdFx0XHRyZXN1bHQuYWxsb3dFZGl0ID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzXG5cdFx0ZWxzZVxuXHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkTGlzdEl0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfHwgZmFsc2Vcblx0XHRcdG1hc3RlckFsbG93ID0gZmFsc2Vcblx0XHRcdGlmIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09IHRydWVcblx0XHRcdFx0bWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZFxuXHRcdFx0ZWxzZSBpZiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PSBmYWxzZVxuXHRcdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0XG5cblx0XHRcdHVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gQ3JlYXRvci5nZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QoY3VycmVudFJlY29yZCwgY3VycmVudE9iamVjdE5hbWUpXG5cdFx0XHRpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMVxuXG5cdFx0XHRyZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxuXHRcdFx0cmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxuXHRcdHJldHVybiByZXN1bHRcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0Q3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyA9IChzcGFjZUlkLCB1c2VySWQpIC0+XG5cdFx0cGVybWlzc2lvbnMgPVxuXHRcdFx0b2JqZWN0czoge31cblx0XHRcdGFzc2lnbmVkX2FwcHM6IFtdXG5cdFx0IyMjXG5cdFx05p2D6ZmQ6ZuG6K+05piOOlxuXHRcdOWGhee9ruadg+mZkOmbhi1hZG1pbix1c2VyLG1lbWJlcixndWVzdCx3b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW5cblx0XHToh6rlrprkuYnmnYPpmZDpm4Yt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ6ZuG5Lul5aSW55qE5YW25LuW5p2D6ZmQ6ZuGXG5cdFx054m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKfkuI3lj6/phY3nva7vvIktYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Rcblx0XHTlj6/phY3nva7nlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+WPr+mFjee9ru+8iS13b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW7ku6Xlj4roh6rlrprkuYnmnYPpmZDpm4Zcblx0XHQjIyNcblxuXHRcdGlzU3BhY2VBZG1pbiA9IGZhbHNlXG5cdFx0c3BhY2VVc2VyID0gbnVsbFxuXHRcdGlmIHVzZXJJZFxuXHRcdFx0aXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cblx0XHRwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblxuXHRcdHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGVsc2Vcblx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblxuXHRcdHBzZXRzQWRtaW5fcG9zID0gbnVsbFxuXHRcdHBzZXRzVXNlcl9wb3MgPSBudWxsXG5cdFx0cHNldHNNZW1iZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzR3Vlc3RfcG9zID0gbnVsbFxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSBudWxsXG5cdFx0cHNldHNTdXBwbGllcl9wb3MgPSBudWxsXG5cdFx0cHNldHNDdXN0b21lcl9wb3MgPSBudWxsXG5cblx0XHRpZiBwc2V0c0FkbWluPy5faWRcblx0XHRcdHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzVXNlcj8uX2lkXG5cdFx0XHRwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNNZW1iZXI/Ll9pZFxuXHRcdFx0cHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c01lbWJlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c0d1ZXN0Py5faWRcblx0XHRcdHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzU3VwcGxpZXI/Ll9pZFxuXHRcdFx0cHNldHNTdXBwbGllcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzU3VwcGxpZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNDdXN0b21lcj8uX2lkXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNDdXN0b21lci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblxuXHRcdGlmIHBzZXRzQ3VycmVudC5sZW5ndGggPiAwXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwiX2lkXCJcblx0XHRcdHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHNldF9pZHN9fSkuZmV0Y2goKVxuXHRcdFx0cHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJuYW1lXCJcblx0XHRwc2V0cyA9IHtcblx0XHRcdHBzZXRzQWRtaW4sIFxuXHRcdFx0cHNldHNVc2VyLCBcblx0XHRcdHBzZXRzQ3VycmVudCwgXG5cdFx0XHRwc2V0c01lbWJlciwgXG5cdFx0XHRwc2V0c0d1ZXN0LFxuXHRcdFx0cHNldHNTdXBwbGllcixcblx0XHRcdHBzZXRzQ3VzdG9tZXIsXG5cdFx0XHRpc1NwYWNlQWRtaW4sXG5cdFx0XHRzcGFjZVVzZXIsIFxuXHRcdFx0cHNldHNBZG1pbl9wb3MsIFxuXHRcdFx0cHNldHNVc2VyX3BvcywgXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MsIFxuXHRcdFx0cHNldHNHdWVzdF9wb3MsXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3Bvcyxcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zLFxuXHRcdFx0cHNldHNDdXJyZW50X3Bvc1xuXHRcdH1cblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcblx0XHRwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzXG5cdFx0X2kgPSAwXG5cdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cblx0XHRcdF9pKytcblx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09IHNwYWNlSWRcblx0XHRcdFx0aWYgIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09ICcwJyB8fCAob2JqZWN0LmluX2RldmVsb3BtZW50ICE9ICcwJyAmJiBpc1NwYWNlQWRtaW4pXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXHR1bmlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdFx0aWYgIWFycmF5XG5cdFx0XHRhcnJheSA9IFtdXG5cdFx0aWYgIW90aGVyXG5cdFx0XHRvdGhlciA9IFtdXG5cdFx0cmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKVxuXG5cdGludGVyc2VjdGlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdFx0aWYgIWFycmF5XG5cdFx0XHRhcnJheSA9IFtdXG5cdFx0aWYgIW90aGVyXG5cdFx0XHRvdGhlciA9IFtdXG5cdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcilcblxuXHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgPSAodGFyZ2V0LCBwcm9wcykgLT5cblx0XHRwcm9wTmFtZXMgPSBwZXJtaXNzaW9uUHJvcE5hbWVzXG5cdFx0ZmlsZXNQcm9OYW1lcyA9IFxuXHRcdGlmIHByb3BzXG5cdFx0XHRfLmVhY2ggcHJvcE5hbWVzLCAocHJvcE5hbWUpIC0+XG5cdFx0XHRcdHRhcmdldFtwcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV1cblxuXHRcdFx0IyB0YXJnZXQuYWxsb3dDcmVhdGUgPSBwcm9wcy5hbGxvd0NyZWF0ZVxuXHRcdFx0IyB0YXJnZXQuYWxsb3dEZWxldGUgPSBwcm9wcy5hbGxvd0RlbGV0ZVxuXHRcdFx0IyB0YXJnZXQuYWxsb3dFZGl0ID0gcHJvcHMuYWxsb3dFZGl0XG5cdFx0XHQjIHRhcmdldC5hbGxvd1JlYWQgPSBwcm9wcy5hbGxvd1JlYWRcblx0XHRcdCMgdGFyZ2V0Lm1vZGlmeUFsbFJlY29yZHMgPSBwcm9wcy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHQjIHRhcmdldC52aWV3QWxsUmVjb3JkcyA9IHByb3BzLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHQjIHRhcmdldC5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHByb3BzLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHQjIHRhcmdldC52aWV3Q29tcGFueVJlY29yZHMgPSBwcm9wcy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdCMgdGFyZ2V0LmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwcm9wcy5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHQjIHRhcmdldC5kaXNhYmxlZF9hY3Rpb25zID0gcHJvcHMuZGlzYWJsZWRfYWN0aW9uc1xuXHRcdFx0IyB0YXJnZXQudW5yZWFkYWJsZV9maWVsZHMgPSBwcm9wcy51bnJlYWRhYmxlX2ZpZWxkc1xuXHRcdFx0IyB0YXJnZXQudW5lZGl0YWJsZV9maWVsZHMgPSBwcm9wcy51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0IyB0YXJnZXQudW5yZWxhdGVkX29iamVjdHMgPSBwcm9wcy51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdFx0IyB0YXJnZXQudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwcm9wcy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxuXG5cdG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyA9ICh0YXJnZXQsIHByb3BzKSAtPlxuXHRcdHByb3BOYW1lcyA9IGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lc1xuXHRcdF8uZWFjaCBwcm9wTmFtZXMsIChwcm9wTmFtZSkgLT5cblx0XHRcdGlmIHByb3BzW3Byb3BOYW1lXVxuXHRcdFx0XHR0YXJnZXRbcHJvcE5hbWVdID0gdHJ1ZVxuXHRcdFxuXHRcdCMgaWYgcG8uYWxsb3dSZWFkXG5cdFx0IyBcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWVcblx0XHQjIGlmIHBvLmFsbG93Q3JlYXRlXG5cdFx0IyBcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZVxuXHRcdCMgaWYgcG8uYWxsb3dFZGl0XG5cdFx0IyBcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWVcblx0XHQjIGlmIHBvLmFsbG93RGVsZXRlXG5cdFx0IyBcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdCMgaWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdCMgXHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZVxuXHRcdCMgaWYgcG8udmlld0FsbFJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlXG5cdFx0IyBpZiBwby5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdCMgXHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHQjIGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdCMgXHRwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cblxuXHRDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHQjIHBzZXRzTWVtYmVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0IyBwc2V0c0d1ZXN0ID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHNwYWNlVXNlciA9IG51bGw7XG5cdFx0aWYgdXNlcklkXG5cdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGVsc2Vcblx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdGFwcHMgPSBbXVxuXHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0cmV0dXJuIFtdXG5cdFx0ZWxzZVxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGVcblx0XHRcdHBzZXRCYXNlID0gcHNldHNVc2VyXG5cdFx0XHRpZiB1c2VyUHJvZmlsZVxuXHRcdFx0XHRpZiB1c2VyUHJvZmlsZSA9PSAnc3VwcGxpZXInXG5cdFx0XHRcdFx0cHNldEJhc2UgPSBwc2V0c1N1cHBsaWVyXG5cdFx0XHRcdGVsc2UgaWYgdXNlclByb2ZpbGUgPT0gJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNDdXN0b21lclxuXHRcdFx0aWYgcHNldEJhc2U/LmFzc2lnbmVkX2FwcHM/Lmxlbmd0aFxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMgdXNlcuadg+mZkOmbhuS4reeahGFzc2lnbmVkX2FwcHPooajnpLrmiYDmnInnlKjmiLflhbfmnInnmoRhcHBz5p2D6ZmQ77yM5Li656m65YiZ6KGo56S65pyJ5omA5pyJYXBwc+adg+mZkO+8jOS4jemcgOimgeS9nOadg+mZkOWIpOaWreS6hlxuXHRcdFx0XHRyZXR1cm4gW11cblx0XHRcdF8uZWFjaCBwc2V0cywgKHBzZXQpLT5cblx0XHRcdFx0aWYgIXBzZXQuYXNzaWduZWRfYXBwc1xuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBwc2V0Lm5hbWUgPT0gXCJhZG1pblwiIHx8ICBwc2V0Lm5hbWUgPT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09ICdjdXN0b21lcidcblx0XHRcdFx0XHQjIOi/memHjOS5i+aJgOS7peimgeaOkumZpGFkbWluL3VzZXLvvIzmmK/lm6DkuLrov5nkuKTkuKrmnYPpmZDpm4bmmK/miYDmnInmnYPpmZDpm4bkuK11c2Vyc+WxnuaAp+aXoOaViOeahOadg+mZkOmbhu+8jOeJueaMh+W3peS9nOWMuueuoeeQhuWRmOWSjOaJgOacieeUqOaIt1xuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHNcblx0XHRcdHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLHVuZGVmaW5lZCxudWxsKVxuXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRwc2V0cyA9ICB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0YWRtaW5NZW51cyA9IENyZWF0b3IuQXBwcy5hZG1pbj8uYWRtaW5fbWVudXNcblx0XHQjIOWmguaenOayoeaciWFkbWlu6I+c5Y2V6K+05piO5LiN6ZyA6KaB55u45YWz5Yqf6IO977yM55u05o6l6L+U5Zue56m6XG5cdFx0dW5sZXNzIGFkbWluTWVudXNcblx0XHRcdHJldHVybiBbXVxuXHRcdGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZCAobikgLT5cblx0XHRcdG4uX2lkID09ICdhYm91dCdcblx0XHRhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIgKG4pIC0+XG5cdFx0XHRuLl9pZCAhPSAnYWJvdXQnXG5cdFx0b3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5IF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIChuKSAtPlxuXHRcdFx0cmV0dXJuIG4uYWRtaW5fbWVudXMgYW5kIG4uX2lkICE9ICdhZG1pbidcblx0XHQpLCAnc29ydCdcblx0XHRvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSlcblx0XHQjIOiPnOWNleacieS4iemDqOWIhue7hOaIkO+8jOiuvue9rkFQUOiPnOWNleOAgeWFtuS7lkFQUOiPnOWNleS7peWPimFib3V06I+c5Y2VXG5cdFx0YWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKVxuXHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0IyDlt6XkvZzljLrnrqHnkIblkZjmnInlhajpg6joj5zljZXlip/og71cblx0XHRcdHJlc3VsdCA9IGFsbE1lbnVzXG5cdFx0ZWxzZVxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGUgfHwgJ3VzZXInXG5cdFx0XHRjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5uYW1lXG5cdFx0XHRtZW51cyA9IGFsbE1lbnVzLmZpbHRlciAobWVudSktPlxuXHRcdFx0XHRwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0c1xuXHRcdFx0XHQjIOWmguaenOaZrumAmueUqOaIt+acieadg+mZkO+8jOWImeebtOaOpei/lOWbnnRydWVcblx0XHRcdFx0aWYgcHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xXG5cdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0IyDlkKbliJnlj5blvZPliY3nlKjmiLfnmoTmnYPpmZDpm4bkuI5tZW516I+c5Y2V6KaB5rGC55qE5p2D6ZmQ6ZuG5a+55q+U77yM5aaC5p6c5Lqk6ZuG5aSn5LqOMeS4quWImei/lOWbnnRydWVcblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoXG5cdFx0XHRyZXN1bHQgPSBtZW51c1xuXHRcdFxuXHRcdHJldHVybiBfLnNvcnRCeShyZXN1bHQsXCJzb3J0XCIpXG5cblx0ZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCktPlxuXG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIF8uZmluZCBwZXJtaXNzaW9uX29iamVjdHMsIChwbyktPlxuXHRcdFx0XHRcdHJldHVybiBwby5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWR9KVxuXG5cdGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKS0+XG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIF8uZmlsdGVyIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XG5cdFx0XHRcdHJldHVybiBwby5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxuXHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiB7JGluOiBwZXJtaXNzaW9uX3NldF9pZHN9fSkuZmV0Y2goKVxuXG5cdHVuaW9uUGVybWlzc2lvbk9iamVjdHMgPSAocG9zLCBvYmplY3QsIHBzZXRzKS0+XG5cdFx0IyDmiopkYuWPinltbOS4reeahHBlcm1pc3Npb25fb2JqZWN0c+WQiOW5tu+8jOS8mOWFiOWPlmRi5Lit55qEXG5cdFx0cmVzdWx0ID0gW11cblx0XHRfLmVhY2ggb2JqZWN0LnBlcm1pc3Npb25fc2V0LCAob3BzLCBvcHNfa2V5KS0+XG5cdFx0XHQjIOaKinltbOS4remZpOS6hueJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhlwiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIuWklueahOWFtuS7luWvueixoeadg+mZkOWFiOWtmOWFpXJlc3VsdFxuXHRcdFx0IyBpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiLCBcIndvcmtmbG93X2FkbWluXCIsIFwib3JnYW5pemF0aW9uX2FkbWluXCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXG5cdFx0XHRpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiXS5pbmRleE9mKG9wc19rZXkpIDwgMFxuXHRcdFx0XHRjdXJyZW50UHNldCA9IHBzZXRzLmZpbmQgKHBzZXQpLT4gcmV0dXJuIHBzZXQubmFtZSA9PSBvcHNfa2V5XG5cdFx0XHRcdGlmIGN1cnJlbnRQc2V0XG5cdFx0XHRcdFx0dGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fVxuXHRcdFx0XHRcdHRlbXBPcHMucGVybWlzc2lvbl9zZXRfaWQgPSBjdXJyZW50UHNldC5faWRcblx0XHRcdFx0XHR0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggdGVtcE9wc1xuXHRcdGlmIHJlc3VsdC5sZW5ndGhcblx0XHRcdHBvcy5mb3JFYWNoIChwbyktPlxuXHRcdFx0XHRyZXBlYXRJbmRleCA9IDBcblx0XHRcdFx0cmVwZWF0UG8gPSByZXN1bHQuZmluZCgoaXRlbSwgaW5kZXgpLT4gcmVwZWF0SW5kZXggPSBpbmRleDtyZXR1cm4gaXRlbS5wZXJtaXNzaW9uX3NldF9pZCA9PSBwby5wZXJtaXNzaW9uX3NldF9pZClcblx0XHRcdFx0IyDlpoLmnpx5bWzkuK3lt7Lnu4/lrZjlnKhwb++8jOWImeabv+aNouS4uuaVsOaNruW6k+S4reeahHBv77yM5Y+N5LmL5YiZ5oqK5pWw5o2u5bqT5Lit55qEcG/nm7TmjqXntK/liqDov5vljrtcblx0XHRcdFx0aWYgcmVwZWF0UG9cblx0XHRcdFx0XHRyZXN1bHRbcmVwZWF0SW5kZXhdID0gcG9cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoIHBvXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHBvc1xuXG5cdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSktPlxuXHRcdHBlcm1pc3Npb25zID0ge31cblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZClcblxuXHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PSBcInVzZXJzXCJcblx0XHRcdHBlcm1pc3Npb25zID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XG5cdFx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xuXHRcdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cdFx0cHNldHNBZG1pbiA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgb3IgdGhpcy5wc2V0c0FkbWluIHRoZW4gdGhpcy5wc2V0c0FkbWluIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSBvciB0aGlzLnBzZXRzVXNlciB0aGVuIHRoaXMucHNldHNVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNNZW1iZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSBvciB0aGlzLnBzZXRzTWVtYmVyIHRoZW4gdGhpcy5wc2V0c01lbWJlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNHdWVzdCA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgb3IgdGhpcy5wc2V0c0d1ZXN0IHRoZW4gdGhpcy5wc2V0c0d1ZXN0IGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MX19KVxuXG5cdFx0cHNldHNTdXBwbGllciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgb3IgdGhpcy5wc2V0c1N1cHBsaWVyIHRoZW4gdGhpcy5wc2V0c1N1cHBsaWVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzQ3VzdG9tZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQ3VzdG9tZXIpIG9yIHRoaXMucHNldHNDdXN0b21lciB0aGVuIHRoaXMucHNldHNDdXN0b21lciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50O1xuXHRcdGlmICFwc2V0c1xuXHRcdFx0c3BhY2VVc2VyID0gbnVsbDtcblx0XHRcdGlmIHVzZXJJZFxuXHRcdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cblx0XHRwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3Ncblx0XHRwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zXG5cdFx0cHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3Ncblx0XHRwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3NcblxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3Bvc1xuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gdGhpcy5wc2V0c0N1c3RvbWVyX3Bvc1xuXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3Bvc1xuXG5cdFx0b3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fVxuXHRcdG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9XG5cdFx0b3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9XG5cdFx0b3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxuXG5cdFx0b3BzZXRTdXBwbGllciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnN1cHBsaWVyKSB8fCB7fVxuXHRcdG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge31cblxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3RfbGlzdHZpZXdzJykuZmluZCh7c3BhY2U6IHNwYWNlSWQsIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc2hhcmVkOiB0cnVlfSwge2ZpZWxkczp7X2lkOjF9fSkuZmV0Y2goKVxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gXy5wbHVjayhzaGFyZWRMaXN0Vmlld3MsXCJfaWRcIilcblx0XHQjIGlmIHNoYXJlZExpc3RWaWV3cy5sZW5ndGhcblx0XHQjIFx0dW5sZXNzIG9wc2V0QWRtaW4ubGlzdF92aWV3c1xuXHRcdCMgXHRcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IFtdXG5cdFx0IyBcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IF8udW5pb24gb3BzZXRBZG1pbi5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3Ncblx0XHQjIFx0dW5sZXNzIG9wc2V0VXNlci5saXN0X3ZpZXdzXG5cdFx0IyBcdFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBbXVxuXHRcdCMgXHRvcHNldFVzZXIubGlzdF92aWV3cyA9IF8udW5pb24gb3BzZXRVc2VyLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xuXHRcdCMg5pWw5o2u5bqT5Lit5aaC5p6c6YWN572u5LqG6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOmbhuiuvue9ru+8jOW6lOivpeimhuebluS7o+eggeS4rWFkbWluL3VzZXLnmoTmnYPpmZDpm4borr7nva5cblx0XHRpZiBwc2V0c0FkbWluXG5cdFx0XHRwb3NBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0FkbWluLl9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldEFkbWluLCBwb3NBZG1pblxuXHRcdGlmIHBzZXRzVXNlclxuXHRcdFx0cG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRVc2VyLCBwb3NVc2VyXG5cdFx0aWYgcHNldHNNZW1iZXJcblx0XHRcdHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0TWVtYmVyLCBwb3NNZW1iZXJcblx0XHRpZiBwc2V0c0d1ZXN0XG5cdFx0XHRwb3NHdWVzdCA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNHdWVzdF9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0d1ZXN0Ll9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldEd1ZXN0LCBwb3NHdWVzdFxuXHRcdGlmIHBzZXRzU3VwcGxpZXJcblx0XHRcdHBvc1N1cHBsaWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1N1cHBsaWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzU3VwcGxpZXIuX2lkKTtcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldFN1cHBsaWVyLCBwb3NTdXBwbGllclxuXHRcdGlmIHBzZXRzQ3VzdG9tZXJcblx0XHRcdHBvc0N1c3RvbWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1c3RvbWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQ3VzdG9tZXIuX2lkKTtcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldEN1c3RvbWVyLCBwb3NDdXN0b21lclxuXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXG5cdFx0ZWxzZVxuXHRcdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBzcGFjZUlkIGlzICdjb21tb24nXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHNwYWNlVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSBvciB0aGlzLnNwYWNlVXNlciB0aGVuIHRoaXMuc3BhY2VVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0XHRcdFx0aWYgc3BhY2VVc2VyXG5cdFx0XHRcdFx0XHRwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdFx0XHRcdGlmIHByb2Zcblx0XHRcdFx0XHRcdFx0aWYgcHJvZiBpcyAndXNlcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ21lbWJlcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnZ3Vlc3QnXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnc3VwcGxpZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnY3VzdG9tZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEN1c3RvbWVyXG5cdFx0XHRcdFx0XHRlbHNlICMg5rKh5pyJcHJvZmlsZeWImeiupOS4uuaYr3VzZXLmnYPpmZBcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Rcblx0XHRpZiBwc2V0cy5sZW5ndGggPiAwXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0cywgXCJfaWRcIlxuXHRcdFx0cG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcylcblx0XHRcdHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKVxuXHRcdFx0Xy5lYWNoIHBvcywgKHBvKS0+XG5cdFx0XHRcdGlmIHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQWRtaW4/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNVc2VyPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzTWVtYmVyPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzR3Vlc3Q/Ll9pZCBvclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1N1cHBsaWVyPy5faWQgb3Jcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNDdXN0b21lcj8uX2lkXG5cdFx0XHRcdFx0IyDpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ5YC85Y+q5a6e6KGM5LiK6Z2i55qE6buY6K6k5YC86KaG55uW77yM5LiN5YGa566X5rOV5Yik5patXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGlmIF8uaXNFbXB0eShwZXJtaXNzaW9ucylcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IHBvXG5cdFx0XHRcdG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyBwZXJtaXNzaW9ucywgcG9cblxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBwby5kaXNhYmxlZF9saXN0X3ZpZXdzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIHBvLnVuZWRpdGFibGVfZmllbGRzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHBvLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0KVxuXHRcdFxuXHRcdGlmIG9iamVjdC5pc192aWV3XG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW11cblx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xuXG5cdFx0aWYgb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXG5cdFx0XHRwZXJtaXNzaW9ucy5vd25lciA9IG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lclxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cblx0IyBDcmVhdG9yLmluaXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSkgLT5cblxuXHRcdCMgIyDlupTor6XmiororqHnrpflh7rmnaXnmoRcblx0XHQjIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdLmFsbG93XG5cdFx0IyBcdGluc2VydDogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHQgICAgXHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdCMgXHR1cGRhdGU6ICh1c2VySWQsIGRvYykgLT5cblx0XHQjIFx0XHRpZiAhdXNlcklkXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0VkaXRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cdFx0IyBcdHJlbW92ZTogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RGVsZXRlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdE1ldGVvci5tZXRob2RzXG5cdFx0IyBDYWxjdWxhdGUgUGVybWlzc2lvbnMgb24gU2VydmVyXG5cdFx0XCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiAoc3BhY2VJZCktPlxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpXG4iLCJ2YXIgYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzLCBjbG9uZSwgZXh0ZW5kUGVybWlzc2lvblByb3BzLCBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0LCBmaW5kX3Blcm1pc3Npb25fb2JqZWN0LCBpbnRlcnNlY3Rpb25QbHVzLCBvdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMsIG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcywgcGVybWlzc2lvblByb3BOYW1lcywgdW5pb25QZXJtaXNzaW9uT2JqZWN0cywgdW5pb25QbHVzO1xuXG5jbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5cbmJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImFsbG93Q3JlYXRlXCIsIFwiYWxsb3dEZWxldGVcIiwgXCJhbGxvd0VkaXRcIiwgXCJhbGxvd1JlYWRcIiwgXCJtb2RpZnlBbGxSZWNvcmRzXCIsIFwidmlld0FsbFJlY29yZHNcIiwgXCJtb2RpZnlDb21wYW55UmVjb3Jkc1wiLCBcInZpZXdDb21wYW55UmVjb3Jkc1wiLCBcImFsbG93UmVhZEZpbGVzXCIsIFwiYWxsb3dFZGl0RmlsZXNcIiwgXCJhbGxvd0NyZWF0ZUZpbGVzXCIsIFwiYWxsb3dEZWxldGVGaWxlc1wiLCBcInZpZXdBbGxGaWxlc1wiLCBcIm1vZGlmeUFsbEZpbGVzXCJdO1xuXG5vdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJkaXNhYmxlZF9saXN0X3ZpZXdzXCIsIFwiZGlzYWJsZWRfYWN0aW9uc1wiLCBcInVucmVhZGFibGVfZmllbGRzXCIsIFwidW5lZGl0YWJsZV9maWVsZHNcIiwgXCJ1bnJlbGF0ZWRfb2JqZWN0c1wiLCBcInVuZWRpdGFibGVfcmVsYXRlZF9saXN0XCJdO1xuXG5wZXJtaXNzaW9uUHJvcE5hbWVzID0gXy51bmlvbihiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMsIG90aGVyUGVybWlzc2lvblByb3BOYW1lcyk7XG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBvYmo7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iaikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpO1xuICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIHJldHVybiBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBpc093bmVyLCBtYXN0ZXJPYmplY3ROYW1lLCBtYXN0ZXJSZWNvcmRQZXJtLCBwZXJtaXNzaW9ucywgcmVjb3JkX2NvbXBhbnlfaWQsIHJlY29yZF9jb21wYW55X2lkcywgcmVmLCB1c2VyX2NvbXBhbnlfaWRzO1xuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXNwYWNlSWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgfVxuICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSk7XG4gIGlmIChyZWNvcmQpIHtcbiAgICBpZiAoIV8uaXNFbXB0eShyZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zKSkge1xuICAgICAgcmV0dXJuIHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnM7XG4gICAgfVxuICAgIGlzT3duZXIgPSByZWNvcmQub3duZXIgPT09IHVzZXJJZCB8fCAoKHJlZiA9IHJlY29yZC5vd25lcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDApID09PSB1c2VySWQ7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICBtYXN0ZXJPYmplY3ROYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG4gICAgICBtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhtYXN0ZXJPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXM7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlcztcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0RlbGV0ZUZpbGVzO1xuICAgICAgaWYgKCFtYXN0ZXJSZWNvcmRQZXJtLm1vZGlmeUFsbEZpbGVzICYmICFpc093bmVyKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gcGVybWlzc2lvbnMuYWxsb3dSZWFkICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkRmlsZXM7XG4gICAgICBpZiAoIW1hc3RlclJlY29yZFBlcm0udmlld0FsbEZpbGVzICYmICFpc093bmVyKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpO1xuICAgICAgfVxuICAgICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkIDogdm9pZCAwO1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkICYmIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpICYmIHJlY29yZF9jb21wYW55X2lkLl9pZCkge1xuICAgICAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZDtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmNvbXBhbnlfaWRzIDogdm9pZCAwO1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoICYmIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWRzWzBdKSkge1xuICAgICAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmRfY29tcGFueV9pZHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gXy51bmlvbihyZWNvcmRfY29tcGFueV9pZHMsIFtyZWNvcmRfY29tcGFueV9pZF0pO1xuICAgICAgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHVzZXJfY29tcGFueV9pZHMgJiYgdXNlcl9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZWNvcmQubG9ja2VkICYmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBlcm1pc3Npb25zO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihjdXJyZW50T2JqZWN0TmFtZSwgcmVsYXRlZExpc3RJdGVtLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlLCBtYXN0ZXJBbGxvdywgbWFzdGVyUmVjb3JkUGVybSwgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLCByZXN1bHQsIHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICBpZiAoIWN1cnJlbnRPYmplY3ROYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgY3VycmVudE9iamVjdE5hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXJlbGF0ZWRMaXN0SXRlbSkge1xuICAgICAgY29uc29sZS5lcnJvcihcInJlbGF0ZWRMaXN0SXRlbSBtdXN0IG5vdCBiZSBlbXB0eSBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9uc1wiKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgaWYgKCFjdXJyZW50UmVjb3JkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgY3VycmVudFJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKCk7XG4gICAgfVxuICAgIGlmICghdXNlcklkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKTtcbiAgICByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSk7XG4gICAgcmVzdWx0ID0gXy5jbG9uZShyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMpO1xuICAgIGlmIChyZWxhdGVkTGlzdEl0ZW0uaXNfZmlsZSkge1xuICAgICAgcmVzdWx0LmFsbG93Q3JlYXRlID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlcztcbiAgICAgIHJlc3VsdC5hbGxvd0VkaXQgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZExpc3RJdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIHx8IGZhbHNlO1xuICAgICAgbWFzdGVyQWxsb3cgPSBmYWxzZTtcbiAgICAgIGlmICh3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PT0gdHJ1ZSkge1xuICAgICAgICBtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkO1xuICAgICAgfSBlbHNlIGlmICh3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdDtcbiAgICAgIH1cbiAgICAgIHVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gQ3JlYXRvci5nZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QoY3VycmVudFJlY29yZCwgY3VycmVudE9iamVjdE5hbWUpO1xuICAgICAgaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlID0gdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QuaW5kZXhPZihyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpID4gLTE7XG4gICAgICByZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICAgIHJlc3VsdC5hbGxvd0VkaXQgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBfaSwgaXNTcGFjZUFkbWluLCBwZXJtaXNzaW9ucywgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnQsIHBzZXRzQ3VycmVudE5hbWVzLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHtcbiAgICAgIG9iamVjdHM6IHt9LFxuICAgICAgYXNzaWduZWRfYXBwczogW11cbiAgICB9O1xuXG4gICAgLypcbiAgICBcdFx05p2D6ZmQ6ZuG6K+05piOOlxuICAgIFx0XHTlhoXnva7mnYPpmZDpm4YtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXG4gICAgXHRcdOiHquWumuS5ieadg+mZkOmbhi3mlbDmja7lupPkuK3mlrDlu7rnmoTpmaTlhoXnva7mnYPpmZDpm4bku6XlpJbnmoTlhbbku5bmnYPpmZDpm4ZcbiAgICBcdFx054m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKfkuI3lj6/phY3nva7vvIktYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3RcbiAgICBcdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ6ZuGXG4gICAgICovXG4gICAgaXNTcGFjZUFkbWluID0gZmFsc2U7XG4gICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICBpZiAodXNlcklkKSB7XG4gICAgICBpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBwc2V0c0FkbWluX3BvcyA9IG51bGw7XG4gICAgcHNldHNVc2VyX3BvcyA9IG51bGw7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0d1ZXN0X3BvcyA9IG51bGw7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IG51bGw7XG4gICAgcHNldHNTdXBwbGllcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbDtcbiAgICBpZiAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1N1cHBsaWVyICE9IG51bGwgPyBwc2V0c1N1cHBsaWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNTdXBwbGllcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXJyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJfaWRcIik7XG4gICAgICBwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAgICRpbjogc2V0X2lkc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgcHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJuYW1lXCIpO1xuICAgIH1cbiAgICBwc2V0cyA9IHtcbiAgICAgIHBzZXRzQWRtaW46IHBzZXRzQWRtaW4sXG4gICAgICBwc2V0c1VzZXI6IHBzZXRzVXNlcixcbiAgICAgIHBzZXRzQ3VycmVudDogcHNldHNDdXJyZW50LFxuICAgICAgcHNldHNNZW1iZXI6IHBzZXRzTWVtYmVyLFxuICAgICAgcHNldHNHdWVzdDogcHNldHNHdWVzdCxcbiAgICAgIHBzZXRzU3VwcGxpZXI6IHBzZXRzU3VwcGxpZXIsXG4gICAgICBwc2V0c0N1c3RvbWVyOiBwc2V0c0N1c3RvbWVyLFxuICAgICAgaXNTcGFjZUFkbWluOiBpc1NwYWNlQWRtaW4sXG4gICAgICBzcGFjZVVzZXI6IHNwYWNlVXNlcixcbiAgICAgIHBzZXRzQWRtaW5fcG9zOiBwc2V0c0FkbWluX3BvcyxcbiAgICAgIHBzZXRzVXNlcl9wb3M6IHBzZXRzVXNlcl9wb3MsXG4gICAgICBwc2V0c01lbWJlcl9wb3M6IHBzZXRzTWVtYmVyX3BvcyxcbiAgICAgIHBzZXRzR3Vlc3RfcG9zOiBwc2V0c0d1ZXN0X3BvcyxcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zOiBwc2V0c1N1cHBsaWVyX3BvcyxcbiAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zOiBwc2V0c0N1c3RvbWVyX3BvcyxcbiAgICAgIHBzZXRzQ3VycmVudF9wb3M6IHBzZXRzQ3VycmVudF9wb3NcbiAgICB9O1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX2FwcHMgPSBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lcztcbiAgICBfaSA9IDA7XG4gICAgXy5lYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24ob2JqZWN0LCBvYmplY3RfbmFtZSkge1xuICAgICAgX2krKztcbiAgICAgIGlmICghXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PT0gc3BhY2VJZCkge1xuICAgICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09PSAnMCcgfHwgKG9iamVjdC5pbl9kZXZlbG9wbWVudCAhPT0gJzAnICYmIGlzU3BhY2VBZG1pbikpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZCk7XG4gICAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICB1bmlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgaW50ZXJzZWN0aW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgZXh0ZW5kUGVybWlzc2lvblByb3BzID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wcykge1xuICAgIHZhciBmaWxlc1Byb05hbWVzLCBwcm9wTmFtZXM7XG4gICAgcHJvcE5hbWVzID0gcGVybWlzc2lvblByb3BOYW1lcztcbiAgICByZXR1cm4gZmlsZXNQcm9OYW1lcyA9IHByb3BzID8gXy5lYWNoKHByb3BOYW1lcywgZnVuY3Rpb24ocHJvcE5hbWUpIHtcbiAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIH0pIDogdm9pZCAwO1xuICB9O1xuICBvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMgPSBmdW5jdGlvbih0YXJnZXQsIHByb3BzKSB7XG4gICAgdmFyIHByb3BOYW1lcztcbiAgICBwcm9wTmFtZXMgPSBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXM7XG4gICAgcmV0dXJuIF8uZWFjaChwcm9wTmFtZXMsIGZ1bmN0aW9uKHByb3BOYW1lKSB7XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYXBwcywgaXNTcGFjZUFkbWluLCBwc2V0QmFzZSwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQ3VzdG9tZXIsIHBzZXRzU3VwcGxpZXIsIHBzZXRzVXNlciwgcmVmLCByZWYxLCBzcGFjZVVzZXIsIHVzZXJQcm9maWxlO1xuICAgIHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1N1cHBsaWVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1c3RvbWVyID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFwcHMgPSBbXTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJQcm9maWxlID0gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYucHJvZmlsZSA6IHZvaWQgMDtcbiAgICAgIHBzZXRCYXNlID0gcHNldHNVc2VyO1xuICAgICAgaWYgKHVzZXJQcm9maWxlKSB7XG4gICAgICAgIGlmICh1c2VyUHJvZmlsZSA9PT0gJ3N1cHBsaWVyJykge1xuICAgICAgICAgIHBzZXRCYXNlID0gcHNldHNTdXBwbGllcjtcbiAgICAgICAgfSBlbHNlIGlmICh1c2VyUHJvZmlsZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHBzZXRCYXNlID0gcHNldHNDdXN0b21lcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBzZXRCYXNlICE9IG51bGwgPyAocmVmMSA9IHBzZXRCYXNlLmFzc2lnbmVkX2FwcHMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIF8uZWFjaChwc2V0cywgZnVuY3Rpb24ocHNldCkge1xuICAgICAgICBpZiAoIXBzZXQuYXNzaWduZWRfYXBwcykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHNldC5uYW1lID09PSBcImFkbWluXCIgfHwgcHNldC5uYW1lID09PSBcInVzZXJcIiB8fCBwc2V0Lm5hbWUgPT09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy53aXRob3V0KF8udW5pcShhcHBzKSwgdm9pZCAwLCBudWxsKTtcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhYm91dE1lbnUsIGFkbWluTWVudXMsIGFsbE1lbnVzLCBjdXJyZW50UHNldE5hbWVzLCBpc1NwYWNlQWRtaW4sIG1lbnVzLCBvdGhlck1lbnVBcHBzLCBvdGhlck1lbnVzLCBwc2V0cywgcmVmLCByZWYxLCByZXN1bHQsIHVzZXJQcm9maWxlO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICB1c2VyczogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICBuYW1lOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYWRtaW5NZW51cyA9IChyZWYgPSBDcmVhdG9yLkFwcHMuYWRtaW4pICE9IG51bGwgPyByZWYuYWRtaW5fbWVudXMgOiB2b2lkIDA7XG4gICAgaWYgKCFhZG1pbk1lbnVzKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgPT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgYWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCAhPT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkoXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uYWRtaW5fbWVudXMgJiYgbi5faWQgIT09ICdhZG1pbic7XG4gICAgfSksICdzb3J0Jyk7XG4gICAgb3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpO1xuICAgIGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSk7XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmVzdWx0ID0gYWxsTWVudXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJQcm9maWxlID0gKChyZWYxID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjEucHJvZmlsZSA6IHZvaWQgMCkgfHwgJ3VzZXInO1xuICAgICAgY3VycmVudFBzZXROYW1lcyA9IHBzZXRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLm5hbWU7XG4gICAgICB9KTtcbiAgICAgIG1lbnVzID0gYWxsTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICAgICAgdmFyIHBzZXRzTWVudTtcbiAgICAgICAgcHNldHNNZW51ID0gbWVudS5wZXJtaXNzaW9uX3NldHM7XG4gICAgICAgIGlmIChwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YodXNlclByb2ZpbGUpID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGg7XG4gICAgICB9KTtcbiAgICAgIHJlc3VsdCA9IG1lbnVzO1xuICAgIH1cbiAgICByZXR1cm4gXy5zb3J0QnkocmVzdWx0LCBcInNvcnRcIik7XG4gIH07XG4gIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCkge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maW5kKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkXG4gICAgfSk7XG4gIH07XG4gIGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmlsdGVyKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgJGluOiBwZXJtaXNzaW9uX3NldF9pZHNcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICB9O1xuICB1bmlvblBlcm1pc3Npb25PYmplY3RzID0gZnVuY3Rpb24ocG9zLCBvYmplY3QsIHBzZXRzKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICByZXN1bHQgPSBbXTtcbiAgICBfLmVhY2gob2JqZWN0LnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihvcHMsIG9wc19rZXkpIHtcbiAgICAgIHZhciBjdXJyZW50UHNldCwgdGVtcE9wcztcbiAgICAgIGlmIChbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiXS5pbmRleE9mKG9wc19rZXkpIDwgMCkge1xuICAgICAgICBjdXJyZW50UHNldCA9IHBzZXRzLmZpbmQoZnVuY3Rpb24ocHNldCkge1xuICAgICAgICAgIHJldHVybiBwc2V0Lm5hbWUgPT09IG9wc19rZXk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY3VycmVudFBzZXQpIHtcbiAgICAgICAgICB0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9O1xuICAgICAgICAgIHRlbXBPcHMucGVybWlzc2lvbl9zZXRfaWQgPSBjdXJyZW50UHNldC5faWQ7XG4gICAgICAgICAgdGVtcE9wcy5vYmplY3RfbmFtZSA9IG9iamVjdC5vYmplY3RfbmFtZTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2godGVtcE9wcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCkge1xuICAgICAgcG9zLmZvckVhY2goZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgdmFyIHJlcGVhdEluZGV4LCByZXBlYXRQbztcbiAgICAgICAgcmVwZWF0SW5kZXggPSAwO1xuICAgICAgICByZXBlYXRQbyA9IHJlc3VsdC5maW5kKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgcmVwZWF0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICByZXR1cm4gaXRlbS5wZXJtaXNzaW9uX3NldF9pZCA9PT0gcG8ucGVybWlzc2lvbl9zZXRfaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVwZWF0UG8pIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZXN1bHQucHVzaChwbyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBvcztcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIGlzU3BhY2VBZG1pbiwgb2JqZWN0LCBvcHNldEFkbWluLCBvcHNldEN1c3RvbWVyLCBvcHNldEd1ZXN0LCBvcHNldE1lbWJlciwgb3BzZXRTdXBwbGllciwgb3BzZXRVc2VyLCBwZXJtaXNzaW9ucywgcG9zLCBwb3NBZG1pbiwgcG9zQ3VzdG9tZXIsIHBvc0d1ZXN0LCBwb3NNZW1iZXIsIHBvc1N1cHBsaWVyLCBwb3NVc2VyLCBwcm9mLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzQ3VzdG9tZXIsIHBzZXRzQ3VzdG9tZXJfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNTdXBwbGllciwgcHNldHNTdXBwbGllcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3Bvcywgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge307XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuICAgIGlmIChzcGFjZUlkID09PSAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSB8fCB0aGlzLnBzZXRzQWRtaW4gPyB0aGlzLnBzZXRzQWRtaW4gOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgfHwgdGhpcy5wc2V0c1VzZXIgPyB0aGlzLnBzZXRzVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNNZW1iZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSB8fCB0aGlzLnBzZXRzTWVtYmVyID8gdGhpcy5wc2V0c01lbWJlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0d1ZXN0ID0gXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSB8fCB0aGlzLnBzZXRzR3Vlc3QgPyB0aGlzLnBzZXRzR3Vlc3QgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1N1cHBsaWVyID0gXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSB8fCB0aGlzLnBzZXRzU3VwcGxpZXIgPyB0aGlzLnBzZXRzU3VwcGxpZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1c3RvbWVyID0gXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSB8fCB0aGlzLnBzZXRzQ3VzdG9tZXIgPyB0aGlzLnBzZXRzQ3VzdG9tZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50O1xuICAgIGlmICghcHNldHMpIHtcbiAgICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3M7XG4gICAgcHNldHNVc2VyX3BvcyA9IHRoaXMucHNldHNVc2VyX3BvcztcbiAgICBwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3BvcztcbiAgICBwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3M7XG4gICAgcHNldHNTdXBwbGllcl9wb3MgPSB0aGlzLnBzZXRzU3VwcGxpZXJfcG9zO1xuICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gdGhpcy5wc2V0c0N1c3RvbWVyX3BvcztcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zO1xuICAgIG9wc2V0QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5hZG1pbikgfHwge307XG4gICAgb3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge307XG4gICAgb3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9O1xuICAgIG9wc2V0R3Vlc3QgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge307XG4gICAgb3BzZXRTdXBwbGllciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnN1cHBsaWVyKSB8fCB7fTtcbiAgICBvcHNldEN1c3RvbWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuY3VzdG9tZXIpIHx8IHt9O1xuICAgIGlmIChwc2V0c0FkbWluKSB7XG4gICAgICBwb3NBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0FkbWluLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRBZG1pbiwgcG9zQWRtaW4pO1xuICAgIH1cbiAgICBpZiAocHNldHNVc2VyKSB7XG4gICAgICBwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRVc2VyLCBwb3NVc2VyKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyKSB7XG4gICAgICBwb3NNZW1iZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzTWVtYmVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzTWVtYmVyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRNZW1iZXIsIHBvc01lbWJlcik7XG4gICAgfVxuICAgIGlmIChwc2V0c0d1ZXN0KSB7XG4gICAgICBwb3NHdWVzdCA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNHdWVzdF9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0d1ZXN0Ll9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRHdWVzdCwgcG9zR3Vlc3QpO1xuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllcikge1xuICAgICAgcG9zU3VwcGxpZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzU3VwcGxpZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNTdXBwbGllci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0U3VwcGxpZXIsIHBvc1N1cHBsaWVyKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VzdG9tZXIpIHtcbiAgICAgIHBvc0N1c3RvbWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1c3RvbWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQ3VzdG9tZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldEN1c3RvbWVyLCBwb3NDdXN0b21lcik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNwYWNlSWQgPT09ICdjb21tb24nKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhY2VVc2VyID0gXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIHx8IHRoaXMuc3BhY2VVc2VyID8gdGhpcy5zcGFjZVVzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoc3BhY2VVc2VyKSB7XG4gICAgICAgICAgICBwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGU7XG4gICAgICAgICAgICBpZiAocHJvZikge1xuICAgICAgICAgICAgICBpZiAocHJvZiA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ21lbWJlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdndWVzdCcpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ3N1cHBsaWVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRTdXBwbGllcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEN1c3RvbWVyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHMubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHMsIFwiX2lkXCIpO1xuICAgICAgcG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcyk7XG4gICAgICBwb3MgPSB1bmlvblBlcm1pc3Npb25PYmplY3RzKHBvcywgb2JqZWN0LCBwc2V0cyk7XG4gICAgICBfLmVhY2gocG9zLCBmdW5jdGlvbihwbykge1xuICAgICAgICBpZiAocG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0FkbWluICE9IG51bGwgPyBwc2V0c0FkbWluLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0d1ZXN0ICE9IG51bGwgPyBwc2V0c0d1ZXN0Ll9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c1N1cHBsaWVyICE9IG51bGwgPyBwc2V0c1N1cHBsaWVyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8uaXNFbXB0eShwZXJtaXNzaW9ucykpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IHBvO1xuICAgICAgICB9XG4gICAgICAgIG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyhwZXJtaXNzaW9ucywgcG8pO1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBwby5kaXNhYmxlZF9saXN0X3ZpZXdzKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIHBvLnVuZWRpdGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHBvLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAob2JqZWN0LmlzX3ZpZXcpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdO1xuICAgIH1cbiAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgaWYgKG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcikge1xuICAgICAgcGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXI7XG4gICAgfVxuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJcbnN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXG5cbk1ldGVvci5zdGFydHVwICgpLT5cblx0Y3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUlxuXHRvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUlxuXHRpZiBjcmVhdG9yX2RiX3VybFxuXHRcdGlmICFvcGxvZ191cmxcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKVxuXHRcdENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge29wbG9nVXJsOiBvcGxvZ191cmx9KX1cblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IChvYmplY3QpLT5cbiNcdGlmIG9iamVjdC50YWJsZV9uYW1lICYmIG9iamVjdC50YWJsZV9uYW1lLmVuZHNXaXRoKFwiX19jXCIpXG4jXHRcdHJldHVybiBvYmplY3QudGFibGVfbmFtZVxuI1x0ZWxzZVxuI1x0XHRyZXR1cm4gb2JqZWN0Lm5hbWVcblx0cmV0dXJuIG9iamVjdC5uYW1lXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSAob2JqZWN0KS0+XG5cdGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpXG5cdGlmIGRiW2NvbGxlY3Rpb25fa2V5XVxuXHRcdHJldHVybiBkYltjb2xsZWN0aW9uX2tleV1cblx0ZWxzZSBpZiBvYmplY3QuZGJcblx0XHRyZXR1cm4gb2JqZWN0LmRiXG5cblx0aWYgQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cblx0ZWxzZVxuXHRcdGlmIG9iamVjdC5jdXN0b21cblx0XHRcdHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpXG5cdFx0ZWxzZVxuXHRcdFx0aWYgY29sbGVjdGlvbl9rZXkgPT0gJ19zbXNfcXVldWUnICYmIFNNU1F1ZXVlPy5jb2xsZWN0aW9uXG5cdFx0XHRcdHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSlcblxuXG4iLCJ2YXIgc3RlZWRvc0NvcmU7XG5cbnN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0b3JfZGJfdXJsLCBvcGxvZ191cmw7XG4gIGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1I7XG4gIG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SO1xuICBpZiAoY3JlYXRvcl9kYl91cmwpIHtcbiAgICBpZiAoIW9wbG9nX3VybCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge1xuICAgICAgX2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtcbiAgICAgICAgb3Bsb2dVcmw6IG9wbG9nX3VybFxuICAgICAgfSlcbiAgICB9O1xuICB9XG59KTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGNvbGxlY3Rpb25fa2V5O1xuICBjb2xsZWN0aW9uX2tleSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqZWN0KTtcbiAgaWYgKGRiW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBkYltjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSBpZiAob2JqZWN0LmRiKSB7XG4gICAgcmV0dXJuIG9iamVjdC5kYjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdC5jdXN0b20pIHtcbiAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY29sbGVjdGlvbl9rZXkgPT09ICdfc21zX3F1ZXVlJyAmJiAodHlwZW9mIFNNU1F1ZXVlICE9PSBcInVuZGVmaW5lZFwiICYmIFNNU1F1ZXVlICE9PSBudWxsID8gU01TUXVldWUuY29sbGVjdGlvbiA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSk7XG4gICAgfVxuICB9XG59O1xuIiwiQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge31cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdCMg5a6a5LmJ5YWo5bGAIGFjdGlvbnMg5Ye95pWwXHRcblx0Q3JlYXRvci5hY3Rpb25zID0gKGFjdGlvbnMpLT5cblx0XHRfLmVhY2ggYWN0aW9ucywgKHRvZG8sIGFjdGlvbl9uYW1lKS0+XG5cdFx0XHRDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbyBcblxuXHRDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSAob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsYmFjayktPlxuXHRcdGlmIGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PSAnd29yZC1wcmludCdcblx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRmaWx0ZXJzID0gWydfaWQnLCAnPScsIHJlY29yZF9pZF1cblx0XHRcdGVsc2Vcblx0XHRcdFx0ZmlsdGVycyA9IE9iamVjdEdyaWQuZ2V0RmlsdGVycyhvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBmYWxzZSwgbnVsbCwgbnVsbClcblx0XHRcdHVybCA9IFwiL2FwaS92NC93b3JkX3RlbXBsYXRlcy9cIiArIGFjdGlvbi53b3JkX3RlbXBsYXRlICsgXCIvcHJpbnRcIiArIFwiP2ZpbHRlcnM9XCIgKyBTdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5KGZpbHRlcnMpO1xuXHRcdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XG5cblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiBhY3Rpb24/LnRvZG9cblx0XHRcdGlmIHR5cGVvZiBhY3Rpb24udG9kbyA9PSBcInN0cmluZ1wiXG5cdFx0XHRcdHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dXG5cdFx0XHRlbHNlIGlmIHR5cGVvZiBhY3Rpb24udG9kbyA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0dG9kbyA9IGFjdGlvbi50b2RvXHRcblx0XHRcdGlmICFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkXG5cdFx0XHRcdHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRpZiB0b2RvXG5cdFx0XHRcdCMgaXRlbV9lbGVtZW505Li656m65pe25bqU6K+l6K6+572u6buY6K6k5YC877yI5a+56LGh55qEbmFtZeWtl+aute+8ie+8jOWQpuWImW1vcmVBcmdz5ou/5Yiw55qE5ZCO57ut5Y+C5pWw5L2N572u5bCx5LiN5a+5XG5cdFx0XHRcdGl0ZW1fZWxlbWVudCA9IGlmIGl0ZW1fZWxlbWVudCB0aGVuIGl0ZW1fZWxlbWVudCBlbHNlIFwiXCJcblx0XHRcdFx0bW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpXG5cdFx0XHRcdHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncylcblx0XHRcdFx0dG9kby5hcHBseSB7XG5cdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0cmVjb3JkX2lkOiByZWNvcmRfaWRcblx0XHRcdFx0XHRvYmplY3Q6IG9ialxuXHRcdFx0XHRcdGFjdGlvbjogYWN0aW9uXG5cdFx0XHRcdFx0aXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnRcblx0XHRcdFx0XHRyZWNvcmQ6IHJlY29yZFxuXHRcdFx0XHR9LCB0b2RvQXJnc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSlcblx0XHRlbHNlXG5cdFx0XHR0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSlcblxuXG5cdF9kZWxldGVSZWNvcmQgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpLT5cblx0XHQjIGNvbnNvbGUubG9nKFwiPT09X2RlbGV0ZVJlY29yZD09PVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2ssIGNhbGxfYmFja19lcnJvcik7XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0cHJldmlvdXNEb2MgPSBGb3JtTWFuYWdlci5nZXRQcmV2aW91c0RvYyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAnZGVsZXRlJylcblx0XHRDcmVhdG9yLm9kYXRhLmRlbGV0ZSBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAoKS0+XG5cdFx0XHRpZiByZWNvcmRfdGl0bGVcblx0XHRcdFx0IyBpbmZvID0gb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiICsgXCLlt7LliKDpmaRcIlxuXHRcdFx0XHRpbmZvID10IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVfc3VjXCIsIG9iamVjdC5sYWJlbCArIFwiXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbmZvID0gdCgnY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfc3VjJylcblx0XHRcdHRvYXN0ci5zdWNjZXNzIGluZm9cblx0XHRcdGlmIGNhbGxfYmFjayBhbmQgdHlwZW9mIGNhbGxfYmFjayA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0Y2FsbF9iYWNrKClcblxuXHRcdFx0Rm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtfaWQ6IHJlY29yZF9pZCwgcHJldmlvdXNEb2M6IHByZXZpb3VzRG9jfSlcblx0XHQsIChlcnJvciktPlxuXHRcdFx0aWYgY2FsbF9iYWNrX2Vycm9yIGFuZCB0eXBlb2YgY2FsbF9iYWNrX2Vycm9yID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRjYWxsX2JhY2tfZXJyb3IoKVxuXHRcdFx0Rm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdlcnJvcicsIHtfaWQ6IHJlY29yZF9pZCwgZXJyb3I6IGVycm9yfSlcblxuXHRDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyA9IChyZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0cmVsYXRlT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSlcblx0XHRjb2xsZWN0aW9uX25hbWUgPSByZWxhdGVPYmplY3QubGFiZWxcblx0XHRjb2xsZWN0aW9uID0gXCJDcmVhdG9yLkNvbGxlY3Rpb25zLiN7Q3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSkuX2NvbGxlY3Rpb25fbmFtZX1cIlxuXHRcdGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0Y3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRcdGlkcyA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cdFx0aW5pdGlhbFZhbHVlcyA9IHt9O1xuXHRcdGlmIGlkcz8ubGVuZ3RoXG5cdFx0XHQjIOWIl+ihqOaciemAieS4remhueaXtu+8jOWPluesrOS4gOS4qumAieS4remhue+8jOWkjeWItuWFtuWGheWuueWIsOaWsOW7uueql+WPo+S4rVxuXHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcblx0XHRcdHJlY29yZF9pZCA9IGlkc1swXVxuXHRcdFx0ZG9jID0gQ3JlYXRvci5vZGF0YS5nZXQocmVsYXRlZF9vYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0aW5pdGlhbFZhbHVlcyA9IGRvY1xuXHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cblx0XHRcdFNlc3Npb24uc2V0ICdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0ZGVmYXVsdERvYyA9IEZvcm1NYW5hZ2VyLmdldFJlbGF0ZWRJbml0aWFsVmFsdWVzKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lKTtcblx0XHRcdGlmICFfLmlzRW1wdHkoZGVmYXVsdERvYylcblx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IGRlZmF1bHREb2Ncblx0XHRpZiByZWxhdGVPYmplY3Q/LnZlcnNpb24gPj0gMlxuXHRcdFx0cmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuXHRcdFx0XHRuYW1lOiBcIiN7cmVsYXRlZF9vYmplY3RfbmFtZX1fc3RhbmRhcmRfbmV3X2Zvcm1cIixcblx0XHRcdFx0b2JqZWN0QXBpTmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcblx0XHRcdFx0dGl0bGU6ICfmlrDlu7ogJyArIHJlbGF0ZU9iamVjdC5sYWJlbCxcblx0XHRcdFx0aW5pdGlhbFZhbHVlczogaW5pdGlhbFZhbHVlcyxcblx0XHRcdFx0YWZ0ZXJJbnNlcnQ6IChyZXN1bHQpLT5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpLT5cblx0XHRcdFx0XHRcdCMgT2JqZWN0Rm9ybeaciee8k+WtmO+8jOaWsOW7uuWtkOihqOiusOW9leWPr+iDveS8muacieaxh+aAu+Wtl+aute+8jOmcgOimgeWIt+aWsOihqOWNleaVsOaNrlxuXHRcdFx0XHRcdFx0aWYgQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkudmVyc2lvbiA+IDFcblx0XHRcdFx0XHRcdFx0U3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZClcblx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XG5cdFx0XHRcdFx0LCAxKTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0sIG51bGwsIHtpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnfSlcblxuXG5cdFx0aWYgaWRzPy5sZW5ndGhcblx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXG5cdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cblx0XHRcdFNlc3Npb24uc2V0ICdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0aWYgIV8uaXNFbXB0eShpbml0aWFsVmFsdWVzKVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXG5cblx0XHRTZXNzaW9uLnNldChcImFjdGlvbl9maWVsZHNcIiwgdW5kZWZpbmVkKVxuXHRcdFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25cIiwgY29sbGVjdGlvbilcblx0XHRTZXNzaW9uLnNldChcImFjdGlvbl9jb2xsZWN0aW9uX25hbWVcIiwgY29sbGVjdGlvbl9uYW1lKVxuXHRcdFNlc3Npb24uc2V0KFwiYWN0aW9uX3NhdmVfYW5kX2luc2VydFwiLCBmYWxzZSlcblx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0JChcIi5jcmVhdG9yLWFkZC1yZWxhdGVkXCIpLmNsaWNrKClcblx0XHRyZXR1cm5cblxuXHRDcmVhdG9yLmFjdGlvbnMgXG5cdFx0IyDlnKjmraTlrprkuYnlhajlsYAgYWN0aW9uc1xuXHRcdFwic3RhbmRhcmRfcXVlcnlcIjogKCktPlxuXHRcdFx0TW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpXG5cblx0XHRcInN0YW5kYXJkX25ld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHQjIGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0XHRcdCMgaWYgY3VycmVudF9yZWNvcmRfaWRcblx0XHRcdCMgXHQjIGFtaXMg55u45YWz5a2Q6KGo5Y+z5LiK6KeS5paw5bu6XG5cdFx0XHQjIFx0Q3JlYXRvci5yZWxhdGVkT2JqZWN0U3RhbmRhcmROZXcob2JqZWN0X25hbWUpXG5cdFx0XHQjIFx0cmV0dXJuIFxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuXHRcdFx0Z3JpZE5hbWUgPSB0aGlzLmFjdGlvbi5ncmlkTmFtZTtcblx0XHRcdGlzUmVsYXRlZCA9IHRoaXMuYWN0aW9uLmlzUmVsYXRlZDtcblx0XHRcdGlmIGlzUmVsYXRlZFxuXHRcdFx0XHRyZWxhdGVkRmllbGROYW1lID0gdGhpcy5hY3Rpb24ucmVsYXRlZEZpZWxkTmFtZTtcblx0XHRcdFx0bWFzdGVyUmVjb3JkSWQgPSB0aGlzLmFjdGlvbi5tYXN0ZXJSZWNvcmRJZDtcblx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IHRoaXMuYWN0aW9uLmluaXRpYWxWYWx1ZXNcblx0XHRcdFx0aWYgIWluaXRpYWxWYWx1ZXNcblx0XHRcdFx0XHRpbml0aWFsVmFsdWVzID0ge307XG5cdFx0XHRcdFx0aW5pdGlhbFZhbHVlc1tyZWxhdGVkRmllbGROYW1lXSA9IG1hc3RlclJlY29yZElkXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluaXRpYWxWYWx1ZXM9e31cblx0XHRcdFx0aWYoZ3JpZE5hbWUpXG5cdFx0XHRcdFx0c2VsZWN0ZWRSb3dzID0gd2luZG93LmdyaWRSZWZzP1tncmlkTmFtZV0uY3VycmVudD8uYXBpPy5nZXRTZWxlY3RlZFJvd3MoKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c2VsZWN0ZWRSb3dzID0gd2luZG93LmdyaWRSZWY/LmN1cnJlbnQ/LmFwaT8uZ2V0U2VsZWN0ZWRSb3dzKClcdFxuXHRcdFx0XHRcblx0XHRcdFx0aWYgc2VsZWN0ZWRSb3dzPy5sZW5ndGhcblx0XHRcdFx0XHRyZWNvcmRfaWQgPSBzZWxlY3RlZFJvd3NbMF0uX2lkO1xuXHRcdFx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKVxuXG5cdFx0XHRpZiBvYmplY3Q/LnZlcnNpb24gPj0gMlxuXHRcdFx0XHRyZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmROZXcucmVuZGVyKFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpLCBvYmplY3RfbmFtZSwgdCgnTmV3JykgKyAnICcgKyBvYmplY3QubGFiZWwsIGluaXRpYWxWYWx1ZXMgLCB7Z3JpZE5hbWU6IGdyaWROYW1lfSk7XG5cdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdGlmIHNlbGVjdGVkUm93cz8ubGVuZ3RoXG5cdFx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXG5cdFx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblx0XHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0JChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpXG5cdFx0XHRyZXR1cm4gXG5cblx0XHRcInN0YW5kYXJkX29wZW5fdmlld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZilcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XCJzdGFuZGFyZF9lZGl0XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG5cdFx0XHRcdGlmIG9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRcdFx0cmV0dXJuIFN0ZWVkb3MuUGFnZS5Gb3JtLlN0YW5kYXJkRWRpdC5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCB0KCdFZGl0JykgKyAnICcgKyBvYmplY3QubGFiZWwsIHJlY29yZF9pZCwge1xuXHRcdFx0XHRcdFx0Z3JpZE5hbWU6IHRoaXMuYWN0aW9uLmdyaWROYW1lXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlXG4jXHRcdFx0XHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHJlY29yZFxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAncmVsb2FkX2R4bGlzdCcsIGZhbHNlXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0XHRcdFx0JChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdFx0XHRcdCQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpXG5cblx0XHRcInN0YW5kYXJkX2RlbGV0ZVwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKS0+XG5cdFx0XHRncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuXHRcdFx0IyBjb25zb2xlLmxvZyhcIj09PXN0YW5kYXJkX2RlbGV0ZT09PVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spO1xuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtfaWQ6IHJlY29yZF9pZH0pXG5cdFx0XHRcdGlmICFiZWZvcmVIb29rXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0XHRuYW1lRmllbGQgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVkgfHwgXCJuYW1lXCJcblxuXHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBcImFsbFwiXG5cblx0XHRcdGlmKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlKVxuXHRcdFx0XHRyZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGVbbmFtZUZpZWxkXVxuXHRcdFx0XG5cdFx0XHRpZiByZWNvcmQgJiYgIXJlY29yZF90aXRsZVxuXHRcdFx0XHRyZWNvcmRfdGl0bGUgPSByZWNvcmRbbmFtZUZpZWxkXVxuXHRcdFx0XG5cdFx0XHRpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCJcblx0XHRcdGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCJcblxuXHRcdFx0dW5sZXNzIHJlY29yZF9pZFxuXHRcdFx0XHRpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X3N3YWxfdGl0bGVcIlxuXHRcdFx0XHRpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90ZXh0XCJcblxuXHRcdFx0XHQjIOWmguaenOaYr+aJuemHj+WIoOmZpO+8jOWImeS8oOWFpeeahGxpc3Rfdmlld19pZOS4uuWIl+ihqOinhuWbvueahG5hbWXvvIznlKjkuo7ojrflj5bliJfooajpgInkuK3poblcblx0XHRcdFx0IyDkuLvliJfooajop4TliJnmmK9cImxpc3R2aWV3XyN7b2JqZWN0X25hbWV9XyN7bGlzdF92aWV3X2lkfVwi77yM55u45YWz6KGo6KeE5YiZ5pivXCJyZWxhdGVkX2xpc3R2aWV3XyN7b2JqZWN0X25hbWV9XyN7cmVsYXRlZF9vYmplY3RfbmFtZX1fI3tyZWxhdGVkX2ZpZWxkX25hbWV9XCJcblx0XHRcdFx0c2VsZWN0ZWRSZWNvcmRzID0gU3RlZWRvc1VJLmdldFRhYmxlU2VsZWN0ZWRSb3dzKGdyaWROYW1lIHx8IGxpc3Rfdmlld19pZClcblx0XHRcdFx0aWYgIXNlbGVjdGVkUmVjb3JkcyB8fCAhc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aFxuXHRcdFx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9ub19zZWxlY3Rpb25cIikpXG5cdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdGlmIHJlY29yZF90aXRsZVxuXHRcdFx0XHR0ZXh0ID0gdCBpMThuVGV4dEtleSwgXCIje29iamVjdC5sYWJlbH0gXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0ZXh0ID0gdCBpMThuVGV4dEtleSwgXCIje29iamVjdC5sYWJlbH1cIlxuXHRcdFx0c3dhbFxuXHRcdFx0XHR0aXRsZTogdCBpMThuVGl0bGVLZXksIFwiI3tvYmplY3QubGFiZWx9XCJcblx0XHRcdFx0dGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz4je3RleHR9PC9kaXY+XCJcblx0XHRcdFx0aHRtbDogdHJ1ZVxuXHRcdFx0XHRzaG93Q2FuY2VsQnV0dG9uOnRydWVcblx0XHRcdFx0Y29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpXG5cdFx0XHRcdGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXG5cdFx0XHRcdChvcHRpb24pIC0+XG5cdFx0XHRcdFx0aWYgb3B0aW9uXG5cdFx0XHRcdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0XHRcdFx0IyDljZXmnaHorrDlvZXliKDpmaRcblx0XHRcdFx0XHRcdFx0X2RlbGV0ZVJlY29yZCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0IyDmlofku7bniYjmnKzkuLpcImNmcy5maWxlcy5maWxlcmVjb3JkXCLvvIzpnIDopoHmm7/mjaLkuLpcImNmcy1maWxlcy1maWxlcmVjb3JkXCJcblx0XHRcdFx0XHRcdFx0XHRncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csXCItXCIpXG5cdFx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGdyaWRDb250YWluZXI/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgd2luZG93Lm9wZW5lclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc09wZW5lclJlbW92ZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0XHQjIE9iamVjdEZvcm3mnInnvJPlrZjvvIzliKDpmaTlrZDooajorrDlvZXlj6/og73kvJrmnInmsYfmgLvlrZfmrrXvvIzpnIDopoHliLfmlrDooajljZXmlbDmja5cblx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBjdXJyZW50X29iamVjdF9uYW1lICYmIENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpPy52ZXJzaW9uID4gMVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdF9uYW1lICE9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuXHRcdFx0XHRcdFx0XHRcdGNhdGNoIF9lXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKF9lKTtcblx0XHRcdFx0XHRcdFx0XHRpZiBncmlkQ29udGFpbmVyPy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJylcblx0XHRcdFx0XHRcdFx0XHRpZiBkeERhdGFHcmlkSW5zdGFuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdF9uYW1lICE9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyBcdFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSlcblx0XHRcdFx0XHRcdFx0XHRyZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0XHRcdHRlbXBOYXZSZW1vdmVkID0gQ3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKSAj5peg6K665piv5Zyo6K6w5b2V6K+m57uG55WM6Z2i6L+Y5piv5YiX6KGo55WM6Z2i5omn6KGM5Yig6Zmk5pON5L2c77yM6YO95Lya5oqK5Li05pe25a+86Iiq5Yig6Zmk5o6JXG5cdFx0XHRcdFx0XHRcdFx0aWYgaXNPcGVuZXJSZW1vdmUgb3IgIWR4RGF0YUdyaWRJbnN0YW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNPcGVuZXJSZW1vdmVcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LmNsb3NlKClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpIGFuZCBsaXN0X3ZpZXdfaWQgIT0gJ2NhbGVuZGFyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVubGVzcyB0ZW1wTmF2UmVtb3ZlZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c56Gu5a6e5Yig6Zmk5LqG5Li05pe25a+86Iiq77yM5bCx5Y+v6IO95bey57uP6YeN5a6a5ZCR5Yiw5LiK5LiA5Liq6aG16Z2i5LqG77yM5rKh5b+F6KaB5YaN6YeN5a6a5ZCR5LiA5qyhXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5nbyBcIi9hcHAvI3thcHBpZH0vI3tvYmplY3RfbmFtZX0vZ3JpZC8je2xpc3Rfdmlld19pZH1cIlxuXHRcdFx0XHRcdFx0XHRcdGlmIGNhbGxfYmFjayBhbmQgdHlwZW9mIGNhbGxfYmFjayA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0XHRcdFx0XHRcdGNhbGxfYmFjaygpXHRcdFx0XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdCMg5om56YeP5Yig6ZmkXG5cdFx0XHRcdFx0XHRcdGlmIHNlbGVjdGVkUmVjb3JkcyAmJiBzZWxlY3RlZFJlY29yZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJsb2FkaW5nXCIpXG5cdFx0XHRcdFx0XHRcdFx0ZGVsZXRlQ291bnRlciA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0YWZ0ZXJCYXRjaGVzRGVsZXRlID0gKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlQ291bnRlcisrXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBkZWxldGVDb3VudGVyID49IHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyBjb25zb2xlLmxvZyhcImRlbGV0ZUNvdW50ZXIsIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGg9PT1cIiwgZGVsZXRlQ291bnRlciwgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwibG9hZGluZ1wiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuXHRcdFx0XHRcdFx0XHRcdHNlbGVjdGVkUmVjb3Jkcy5mb3JFYWNoIChyZWNvcmQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZF9pZCA9IHJlY29yZC5faWRcblx0XHRcdFx0XHRcdFx0XHRcdGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtfaWQ6IHJlY29yZF9pZH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAhYmVmb3JlSG9va1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRUaXRsZSA9IHJlY29yZFtuYW1lRmllbGRdIHx8IHJlY29yZF9pZFxuXHRcdFx0XHRcdFx0XHRcdFx0X2RlbGV0ZVJlY29yZCBvYmplY3RfbmFtZSwgcmVjb3JkLl9pZCwgcmVjb3JkVGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCAoKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpICPml6DorrrmmK/lnKjorrDlvZXor6bnu4bnlYzpnaLov5jmmK/liJfooajnlYzpnaLmiafooYzliKDpmaTmk43kvZzvvIzpg73kvJrmiorkuLTml7blr7zoiKrliKDpmaTmjolcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWZ0ZXJCYXRjaGVzRGVsZXRlKClcblx0XHRcdFx0XHRcdFx0XHRcdCksICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0YWZ0ZXJCYXRjaGVzRGVsZXRlKCkiLCJ2YXIgX2RlbGV0ZVJlY29yZDtcblxuQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsYmFjaykge1xuICAgIHZhciBmaWx0ZXJzLCBtb3JlQXJncywgb2JqLCB0b2RvLCB0b2RvQXJncywgdXJsO1xuICAgIGlmIChhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT09ICd3b3JkLXByaW50Jykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBmaWx0ZXJzID0gWydfaWQnLCAnPScsIHJlY29yZF9pZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWx0ZXJzID0gT2JqZWN0R3JpZC5nZXRGaWx0ZXJzKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGZhbHNlLCBudWxsLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIHVybCA9IFwiL2FwaS92NC93b3JkX3RlbXBsYXRlcy9cIiArIGFjdGlvbi53b3JkX3RlbXBsYXRlICsgXCIvcHJpbnRcIiArIFwiP2ZpbHRlcnM9XCIgKyBTdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5KGZpbHRlcnMpO1xuICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMCkge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9kbyA9IGFjdGlvbi50b2RvO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgaXRlbV9lbGVtZW50ID0gaXRlbV9lbGVtZW50ID8gaXRlbV9lbGVtZW50IDogXCJcIjtcbiAgICAgICAgbW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuICAgICAgICB0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpO1xuICAgICAgICByZXR1cm4gdG9kby5hcHBseSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdDogb2JqLFxuICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgIGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50LFxuICAgICAgICAgIHJlY29yZDogcmVjb3JkXG4gICAgICAgIH0sIHRvZG9BcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgfVxuICB9O1xuICBfZGVsZXRlUmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpIHtcbiAgICB2YXIgb2JqZWN0LCBwcmV2aW91c0RvYztcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgcHJldmlvdXNEb2MgPSBGb3JtTWFuYWdlci5nZXRQcmV2aW91c0RvYyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAnZGVsZXRlJyk7XG4gICAgcmV0dXJuIENyZWF0b3Iub2RhdGFbXCJkZWxldGVcIl0ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5mbztcbiAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgaW5mbyA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgKFwiXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKTtcbiAgICAgIH1cbiAgICAgIHRvYXN0ci5zdWNjZXNzKGluZm8pO1xuICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbF9iYWNrKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtcbiAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY1xuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGlmIChjYWxsX2JhY2tfZXJyb3IgJiYgdHlwZW9mIGNhbGxfYmFja19lcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxfYmFja19lcnJvcigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7XG4gICAgICAgIF9pZDogcmVjb3JkX2lkLFxuICAgICAgICBlcnJvcjogZXJyb3JcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyA9IGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgY29sbGVjdGlvbl9uYW1lLCBjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCwgZGVmYXVsdERvYywgZG9jLCBpZHMsIGluaXRpYWxWYWx1ZXMsIHJlY29yZF9pZCwgcmVsYXRlT2JqZWN0O1xuICAgIHJlbGF0ZU9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgIGNvbGxlY3Rpb25fbmFtZSA9IHJlbGF0ZU9iamVjdC5sYWJlbDtcbiAgICBjb2xsZWN0aW9uID0gXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpLl9jb2xsZWN0aW9uX25hbWUpO1xuICAgIGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG4gICAgaWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgaW5pdGlhbFZhbHVlcyA9IHt9O1xuICAgIGlmIChpZHMgIT0gbnVsbCA/IGlkcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgIHJlY29yZF9pZCA9IGlkc1swXTtcbiAgICAgIGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBpbml0aWFsVmFsdWVzID0gZG9jO1xuICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0RG9jID0gRm9ybU1hbmFnZXIuZ2V0UmVsYXRlZEluaXRpYWxWYWx1ZXMoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFfLmlzRW1wdHkoZGVmYXVsdERvYykpIHtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IGRlZmF1bHREb2M7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgocmVsYXRlT2JqZWN0ICE9IG51bGwgPyByZWxhdGVPYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgcmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuICAgICAgICBuYW1lOiByZWxhdGVkX29iamVjdF9uYW1lICsgXCJfc3RhbmRhcmRfbmV3X2Zvcm1cIixcbiAgICAgICAgb2JqZWN0QXBpTmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgdGl0bGU6ICfmlrDlu7ogJyArIHJlbGF0ZU9iamVjdC5sYWJlbCxcbiAgICAgICAgaW5pdGlhbFZhbHVlczogaW5pdGlhbFZhbHVlcyxcbiAgICAgICAgYWZ0ZXJJbnNlcnQ6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkudmVyc2lvbiA+IDEpIHtcbiAgICAgICAgICAgICAgU3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gRmxvd1JvdXRlci5yZWxvYWQoKTtcbiAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSwgbnVsbCwge1xuICAgICAgICBpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghXy5pc0VtcHR5KGluaXRpYWxWYWx1ZXMpKSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgfVxuICAgIH1cbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9maWVsZHNcIiwgdm9pZCAwKTtcbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9jb2xsZWN0aW9uXCIsIGNvbGxlY3Rpb24pO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25fbmFtZVwiLCBjb2xsZWN0aW9uX25hbWUpO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX3NhdmVfYW5kX2luc2VydFwiLCBmYWxzZSk7XG4gICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICQoXCIuY3JlYXRvci1hZGQtcmVsYXRlZFwiKS5jbGljaygpO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmFjdGlvbnMoe1xuICAgIFwic3RhbmRhcmRfcXVlcnlcIjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9uZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgZ3JpZE5hbWUsIGluaXRpYWxWYWx1ZXMsIGlzUmVsYXRlZCwgbWFzdGVyUmVjb3JkSWQsIG9iamVjdCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWxhdGVkRmllbGROYW1lLCBzZWxlY3RlZFJvd3M7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuICAgICAgaXNSZWxhdGVkID0gdGhpcy5hY3Rpb24uaXNSZWxhdGVkO1xuICAgICAgaWYgKGlzUmVsYXRlZCkge1xuICAgICAgICByZWxhdGVkRmllbGROYW1lID0gdGhpcy5hY3Rpb24ucmVsYXRlZEZpZWxkTmFtZTtcbiAgICAgICAgbWFzdGVyUmVjb3JkSWQgPSB0aGlzLmFjdGlvbi5tYXN0ZXJSZWNvcmRJZDtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IHRoaXMuYWN0aW9uLmluaXRpYWxWYWx1ZXM7XG4gICAgICAgIGlmICghaW5pdGlhbFZhbHVlcykge1xuICAgICAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgICAgICBpbml0aWFsVmFsdWVzW3JlbGF0ZWRGaWVsZE5hbWVdID0gbWFzdGVyUmVjb3JkSWQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgICAgaWYgKGdyaWROYW1lKSB7XG4gICAgICAgICAgc2VsZWN0ZWRSb3dzID0gKHJlZiA9IHdpbmRvdy5ncmlkUmVmcykgIT0gbnVsbCA/IChyZWYxID0gcmVmW2dyaWROYW1lXS5jdXJyZW50KSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmFwaSkgIT0gbnVsbCA/IHJlZjIuZ2V0U2VsZWN0ZWRSb3dzKCkgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZWN0ZWRSb3dzID0gKHJlZjMgPSB3aW5kb3cuZ3JpZFJlZikgIT0gbnVsbCA/IChyZWY0ID0gcmVmMy5jdXJyZW50KSAhPSBudWxsID8gKHJlZjUgPSByZWY0LmFwaSkgIT0gbnVsbCA/IHJlZjUuZ2V0U2VsZWN0ZWRSb3dzKCkgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGVkUm93cyAhPSBudWxsID8gc2VsZWN0ZWRSb3dzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgIHJlY29yZF9pZCA9IHNlbGVjdGVkUm93c1swXS5faWQ7XG4gICAgICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICAgICAgaW5pdGlhbFZhbHVlcyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbml0aWFsVmFsdWVzID0gRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICgob2JqZWN0ICE9IG51bGwgPyBvYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgICByZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmROZXcucmVuZGVyKFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpLCBvYmplY3RfbmFtZSwgdCgnTmV3JykgKyAnICcgKyBvYmplY3QubGFiZWwsIGluaXRpYWxWYWx1ZXMsIHtcbiAgICAgICAgICBncmlkTmFtZTogZ3JpZE5hbWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKHNlbGVjdGVkUm93cyAhPSBudWxsID8gc2VsZWN0ZWRSb3dzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICB9XG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBGbG93Um91dGVyLnJlZGlyZWN0KGhyZWYpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9lZGl0XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIGlmIChyZWNvcmRfaWQpIHtcbiAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgICBpZiAoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0LnZlcnNpb24gOiB2b2lkIDApID49IDIpIHtcbiAgICAgICAgICByZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmRFZGl0LnJlbmRlcihTZXNzaW9uLmdldChcImFwcF9pZFwiKSwgb2JqZWN0X25hbWUsIHQoJ0VkaXQnKSArICcgJyArIG9iamVjdC5sYWJlbCwgcmVjb3JkX2lkLCB7XG4gICAgICAgICAgICBncmlkTmFtZTogdGhpcy5hY3Rpb24uZ3JpZE5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlKSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9kZWxldGVcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKSB7XG4gICAgICB2YXIgYmVmb3JlSG9vaywgZ3JpZE5hbWUsIGkxOG5UZXh0S2V5LCBpMThuVGl0bGVLZXksIG5hbWVGaWVsZCwgb2JqZWN0LCBzZWxlY3RlZFJlY29yZHMsIHRleHQ7XG4gICAgICBncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghYmVmb3JlSG9vaykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgbmFtZUZpZWxkID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZIHx8IFwibmFtZVwiO1xuICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgICB9XG4gICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICBsaXN0X3ZpZXdfaWQgPSBcImFsbFwiO1xuICAgICAgfVxuICAgICAgaWYgKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZVtuYW1lRmllbGRdO1xuICAgICAgfVxuICAgICAgaWYgKHJlY29yZCAmJiAhcmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZFtuYW1lRmllbGRdO1xuICAgICAgfVxuICAgICAgaTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZVwiO1xuICAgICAgaTE4blRleHRLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIjtcbiAgICAgIGlmICghcmVjb3JkX2lkKSB7XG4gICAgICAgIGkxOG5UaXRsZUtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90aXRsZVwiO1xuICAgICAgICBpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90ZXh0XCI7XG4gICAgICAgIHNlbGVjdGVkUmVjb3JkcyA9IFN0ZWVkb3NVSS5nZXRUYWJsZVNlbGVjdGVkUm93cyhncmlkTmFtZSB8fCBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICBpZiAoIXNlbGVjdGVkUmVjb3JkcyB8fCAhc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgIHRvYXN0ci53YXJuaW5nKHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9ub19zZWxlY3Rpb25cIikpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICB0ZXh0ID0gdChpMThuVGV4dEtleSwgb2JqZWN0LmxhYmVsICsgXCIgXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IHQoaTE4blRleHRLZXksIFwiXCIgKyBvYmplY3QubGFiZWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN3YWwoe1xuICAgICAgICB0aXRsZTogdChpMThuVGl0bGVLZXksIFwiXCIgKyBvYmplY3QubGFiZWwpLFxuICAgICAgICB0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPlwiICsgdGV4dCArIFwiPC9kaXY+XCIsXG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKSxcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcbiAgICAgIH0sIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB2YXIgYWZ0ZXJCYXRjaGVzRGVsZXRlLCBkZWxldGVDb3VudGVyO1xuICAgICAgICBpZiAob3B0aW9uKSB7XG4gICAgICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICAgICAgcmV0dXJuIF9kZWxldGVSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciBfZSwgYXBwaWQsIGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkLCBkeERhdGFHcmlkSW5zdGFuY2UsIGdyaWRDb250YWluZXIsIGdyaWRPYmplY3ROYW1lQ2xhc3MsIGlzT3BlbmVyUmVtb3ZlLCByZWNvcmRVcmwsIHJlZiwgdGVtcE5hdlJlbW92ZWQ7XG4gICAgICAgICAgICAgIGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZywgXCItXCIpO1xuICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgIGlmICghKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XG4gICAgICAgICAgICAgICAgICBpc09wZW5lclJlbW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgICAgICAgICAgICAgY3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudF9vYmplY3RfbmFtZSAmJiAoKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLnZlcnNpb24gOiB2b2lkIDApID4gMSkge1xuICAgICAgICAgICAgICAgICAgU3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChGbG93Um91dGVyLmN1cnJlbnQoKS5yb3V0ZS5wYXRoLmVuZHNXaXRoKFwiLzpyZWNvcmRfaWRcIikpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RfbmFtZSAhPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgICAgX2UgPSBlcnJvcjE7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihfZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RfbmFtZSAhPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgICAgICAgdGVtcE5hdlJlbW92ZWQgPSBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpO1xuICAgICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUgfHwgIWR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSkge1xuICAgICAgICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZWNvcmRfaWQgPT09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpICYmIGxpc3Rfdmlld19pZCAhPT0gJ2NhbGVuZGFyJykge1xuICAgICAgICAgICAgICAgICAgYXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgICAgICAgICAgICAgICAgIGlmICghdGVtcE5hdlJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHAvXCIgKyBhcHBpZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbF9iYWNrKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRSZWNvcmRzICYmIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJsb2FkaW5nXCIpO1xuICAgICAgICAgICAgICBkZWxldGVDb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgYWZ0ZXJCYXRjaGVzRGVsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlQ291bnRlcisrO1xuICAgICAgICAgICAgICAgIGlmIChkZWxldGVDb3VudGVyID49IHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwibG9hZGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkUmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICAgIHZhciByZWNvcmRUaXRsZTtcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQgPSByZWNvcmQuX2lkO1xuICAgICAgICAgICAgICAgIGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtcbiAgICAgICAgICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFiZWZvcmVIb29rKSB7XG4gICAgICAgICAgICAgICAgICBhZnRlckJhdGNoZXNEZWxldGUoKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVjb3JkVGl0bGUgPSByZWNvcmRbbmFtZUZpZWxkXSB8fCByZWNvcmRfaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9kZWxldGVSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZC5faWQsIHJlY29yZFRpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIHJlY29yZFVybDtcbiAgICAgICAgICAgICAgICAgIHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICAgICAgICAgICAgQ3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBhZnRlckJhdGNoZXNEZWxldGUoKTtcbiAgICAgICAgICAgICAgICB9KSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gYWZ0ZXJCYXRjaGVzRGVsZXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
