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
      var v;
      v = ids.indexOf(doc[id_key]);

      if (v < 0) {
        return 99999;
      } else {
        return v;
      }
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
    } else if (field.type === "grid" || field.type === "table") {
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
    } else if (field.type === 'color') {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiQVBJU2VydmljZSIsIk1ldGFkYXRhU2VydmljZSIsImNvbmZpZyIsImUiLCJtb2xlY3VsZXIiLCJvYmplY3RxbCIsInBhY2thZ2VMb2FkZXIiLCJwYWNrYWdlU2VydmljZSIsInBhdGgiLCJzZXR0aW5ncyIsInN0ZWVkb3NDb3JlIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJyZXF1aXJlIiwiZ2V0U3RlZWRvc0NvbmZpZyIsImJ1aWx0X2luX3BsdWdpbnMiLCJwbHVnaW5zIiwiTWV0ZW9yIiwic3RhcnR1cCIsImFwaVNlcnZpY2UiLCJicm9rZXIiLCJleCIsIm1ldGFkYXRhU2VydmljZSIsIm9iamVjdHFsU2VydmljZSIsInBhZ2VTZXJ2aWNlIiwicHJvamVjdFNlcnZpY2UiLCJzdGFuZGFyZE9iamVjdHNEaXIiLCJzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSIsInN0ZWVkb3NTZXJ2aWNlIiwidWlTZXJ2aWNlIiwiU2VydmljZUJyb2tlciIsIm5hbWVzcGFjZSIsIm5vZGVJRCIsIm1ldGFkYXRhIiwidHJhbnNwb3J0ZXIiLCJUUkFOU1BPUlRFUiIsImNhY2hlciIsIkNBQ0hFUiIsImxvZ0xldmVsIiwic2VyaWFsaXplciIsInJlcXVlc3RUaW1lb3V0IiwibWF4Q2FsbExldmVsIiwiaGVhcnRiZWF0SW50ZXJ2YWwiLCJoZWFydGJlYXRUaW1lb3V0IiwiY29udGV4dFBhcmFtc0Nsb25pbmciLCJ0cmFja2luZyIsImVuYWJsZWQiLCJzaHV0ZG93blRpbWVvdXQiLCJkaXNhYmxlQmFsYW5jZXIiLCJyZWdpc3RyeSIsInN0cmF0ZWd5IiwicHJlZmVyTG9jYWwiLCJidWxraGVhZCIsImNvbmN1cnJlbmN5IiwibWF4UXVldWVTaXplIiwidmFsaWRhdG9yIiwiZXJyb3JIYW5kbGVyIiwidHJhY2luZyIsImV4cG9ydGVyIiwidHlwZSIsIm9wdGlvbnMiLCJsb2dnZXIiLCJjb2xvcnMiLCJ3aWR0aCIsImdhdWdlV2lkdGgiLCJza2lwUHJvY2Vzc0V2ZW50UmVnaXN0cmF0aW9uIiwiY3JlYXRlZCIsIndhcm4iLCJjbGVhbiIsImluaXQiLCJjcmVhdGVTZXJ2aWNlIiwibmFtZSIsIm1peGlucyIsInBvcnQiLCJzdGFydGVkIiwic2V0VGltZW91dCIsImVtaXQiLCJnZXRTdGVlZG9zU2NoZW1hIiwiU3RhbmRhcmRPYmplY3RzUGF0aCIsInBhY2thZ2VJbmZvIiwid3JhcEFzeW5jIiwiY2IiLCJzdGFydCIsInRoZW4iLCJjb25uZWN0SGFuZGxlcnNFeHByZXNzIiwiZXhwcmVzcyIsIl9yZXN0YXJ0U2VydmljZSIsInVzZSIsInN0YXRpY1JvdXRlciIsIndhaXRGb3JTZXJ2aWNlcyIsImNvbnNvbGUiLCJsb2ciLCJTdGVlZG9zQXBpIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwicmVzb2x2ZSIsInJlamVjdCIsImVycm9yIiwiRmliZXIiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJsaXN0X3ZpZXdzIiwic3BhY2UiLCJnZXRDb2xsZWN0aW9uTmFtZSIsIl8iLCJjbG9uZSIsImNvbnZlcnRPYmplY3QiLCJPYmplY3QiLCJpbml0VHJpZ2dlcnMiLCJpbml0TGlzdFZpZXdzIiwiZ2V0T2JqZWN0TmFtZSIsImdldE9iamVjdCIsInNwYWNlX2lkIiwicmVmIiwicmVmMSIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJvYmplY3RzQnlOYW1lIiwiZ2V0T2JqZWN0QnlJZCIsIm9iamVjdF9pZCIsImZpbmRXaGVyZSIsIl9pZCIsInJlbW92ZU9iamVjdCIsImdldENvbGxlY3Rpb24iLCJzcGFjZUlkIiwiX2NvbGxlY3Rpb25fbmFtZSIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiZmllbGRzIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsImlzU3RyaW5nIiwiRm9ybXVsYXIiLCJjaGVja0Zvcm11bGEiLCJldmFsdWF0ZUZpbHRlcnMiLCJmaWx0ZXJzIiwic2VsZWN0b3IiLCJlYWNoIiwiZmlsdGVyIiwiYWN0aW9uIiwidmFsdWUiLCJsZW5ndGgiLCJpc0NvbW1vblNwYWNlIiwiZ2V0T3JkZXJseVNldEJ5SWRzIiwiZG9jcyIsImlkcyIsImlkX2tleSIsImhpdF9maXJzdCIsInZhbHVlcyIsImdldFByb3BlcnR5Iiwic29ydEJ5IiwiZG9jIiwiX2luZGV4IiwidiIsInNvcnRpbmdNZXRob2QiLCJ2YWx1ZTEiLCJ2YWx1ZTIiLCJpc1ZhbHVlMUVtcHR5IiwiaXNWYWx1ZTJFbXB0eSIsImxvY2FsZSIsImtleSIsIkRhdGUiLCJnZXRUaW1lIiwiU3RlZWRvcyIsInRvU3RyaW5nIiwibG9jYWxlQ29tcGFyZSIsImdldE9iamVjdFJlbGF0ZWRzIiwiX29iamVjdCIsInBlcm1pc3Npb25zIiwicmVsYXRlZExpc3QiLCJyZWxhdGVkTGlzdE1hcCIsInJlbGF0ZWRfb2JqZWN0cyIsImlzRW1wdHkiLCJvYmpOYW1lIiwiaXNPYmplY3QiLCJvYmplY3ROYW1lIiwicmVsYXRlZF9vYmplY3QiLCJyZWxhdGVkX29iamVjdF9uYW1lIiwicmVsYXRlZF9maWVsZCIsInJlbGF0ZWRfZmllbGRfbmFtZSIsInJlZmVyZW5jZV90byIsImZvcmVpZ25fa2V5Iiwid3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQiLCJlbmFibGVPYmpOYW1lIiwiZ2V0UGVybWlzc2lvbnMiLCJlbmFibGVfYXVkaXQiLCJtb2RpZnlBbGxSZWNvcmRzIiwiZW5hYmxlX2ZpbGVzIiwicHVzaCIsInNmc0ZpbGVzT2JqZWN0Iiwic3BsaWNlIiwiZW5hYmxlX3Rhc2tzIiwiZW5hYmxlX25vdGVzIiwiZW5hYmxlX2V2ZW50cyIsImVuYWJsZV9pbnN0YW5jZXMiLCJlbmFibGVfYXBwcm92YWxzIiwiZW5hYmxlX3Byb2Nlc3MiLCJnZXRVc2VyQ29udGV4dCIsImlzVW5TYWZlTW9kZSIsIlVTRVJfQ09OVEVYVCIsInNwYWNlX3VzZXJfb3JnIiwic3UiLCJzdUZpZWxkcyIsIkVycm9yIiwibW9iaWxlIiwicG9zaXRpb24iLCJlbWFpbCIsImNvbXBhbnkiLCJvcmdhbml6YXRpb24iLCJjb21wYW55X2lkIiwiY29tcGFueV9pZHMiLCJ1c2VyIiwiZnVsbG5hbWUiLCJnZXRSZWxhdGl2ZVVybCIsInVybCIsImlzRnVuY3Rpb24iLCJpc0NvcmRvdmEiLCJzdGFydHNXaXRoIiwidGVzdCIsIl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18iLCJST09UX1VSTF9QQVRIX1BSRUZJWCIsImdldFVzZXJDb21wYW55SWQiLCJnZXRVc2VyQ29tcGFueUlkcyIsInByb2Nlc3NQZXJtaXNzaW9ucyIsInBvIiwiYWxsb3dDcmVhdGUiLCJhbGxvd1JlYWQiLCJhbGxvd0VkaXQiLCJhbGxvd0RlbGV0ZSIsInZpZXdBbGxSZWNvcmRzIiwidmlld0NvbXBhbnlSZWNvcmRzIiwibW9kaWZ5Q29tcGFueVJlY29yZHMiLCJhbGxvd1JlYWRGaWxlcyIsInZpZXdBbGxGaWxlcyIsImFsbG93Q3JlYXRlRmlsZXMiLCJhbGxvd0VkaXRGaWxlcyIsImFsbG93RGVsZXRlRmlsZXMiLCJtb2RpZnlBbGxGaWxlcyIsImdldFRlbXBsYXRlU3BhY2VJZCIsInRlbXBsYXRlU3BhY2VJZCIsImdldENsb3VkQWRtaW5TcGFjZUlkIiwiY2xvdWRBZG1pblNwYWNlSWQiLCJpc1RlbXBsYXRlU3BhY2UiLCJpc0Nsb3VkQWRtaW5TcGFjZSIsInN0ZWVkb3NTdG9yYWdlRGlyIiwiU1RFRURPU19TVE9SQUdFX0RJUiIsIm1ldGhvZHMiLCJjb2xsZWN0aW9uIiwibmFtZV9maWVsZF9rZXkiLCJvcHRpb25zX2xpbWl0IiwicXVlcnkiLCJxdWVyeV9vcHRpb25zIiwicmVjb3JkcyIsInJlc3VsdHMiLCJzZWFyY2hUZXh0UXVlcnkiLCJzZWxlY3RlZCIsInNvcnQiLCJwYXJhbXMiLCJOQU1FX0ZJRUxEX0tFWSIsInNlYXJjaFRleHQiLCIkcmVnZXgiLCIkb3IiLCIkaW4iLCJleHRlbmQiLCIkbmluIiwiZmlsdGVyUXVlcnkiLCJsaW1pdCIsImZpbmQiLCJmZXRjaCIsInJlY29yZCIsImxhYmVsIiwibWVzc2FnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZXRJbml0V2lkdGhQZXJjZW50IiwiY29sdW1ucyIsIl9zY2hlbWEiLCJjb2x1bW5fbnVtIiwiaW5pdF93aWR0aF9wZXJjZW50IiwiZ2V0U2NoZW1hIiwiZmllbGRfbmFtZSIsImZpZWxkIiwiaXNfd2lkZSIsInJlZjIiLCJwaWNrIiwiYXV0b2Zvcm0iLCJnZXRGaWVsZElzV2lkZSIsImdldFRhYnVsYXJPcmRlciIsImxpc3Rfdmlld19pZCIsInNldHRpbmciLCJyZWNvcmRfaWQiLCJtYXAiLCJjb2x1bW4iLCJoaWRkZW4iLCJjb21wYWN0Iiwib3JkZXIiLCJpbmRleCIsImRlZmF1bHRfZXh0cmFfY29sdW1ucyIsImV4dHJhX2NvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0Q29sdW1ucyIsImdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMiLCJ1bmlvbiIsImdldE9iamVjdERlZmF1bHRTb3J0IiwiVGFidWxhclNlbGVjdGVkSWRzIiwiY29udmVydExpc3RWaWV3IiwiZGVmYXVsdF92aWV3IiwibGlzdF92aWV3IiwibGlzdF92aWV3X25hbWUiLCJkZWZhdWx0X2NvbHVtbnMiLCJkZWZhdWx0X21vYmlsZV9jb2x1bW5zIiwib2l0ZW0iLCJtb2JpbGVfY29sdW1ucyIsImhhcyIsImluY2x1ZGUiLCJmaWx0ZXJfc2NvcGUiLCJwYXJzZSIsImZvckVhY2giLCJfdmFsdWUiLCJnZXRSZWxhdGVkTGlzdCIsImxheW91dFJlbGF0ZWRMaXN0IiwibGlzdCIsIm1hcExpc3QiLCJvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkTGlzdE5hbWVzIiwicmVsYXRlZExpc3RPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfbmFtZXMiLCJ1bnJlbGF0ZWRfb2JqZWN0cyIsInJlbGF0ZWRfbGlzdHMiLCJpdGVtIiwicmVGaWVsZE5hbWUiLCJyZU9iamVjdE5hbWUiLCJyZWxhdGVkIiwicmVsYXRlZF9maWVsZF9mdWxsbmFtZSIsInNwbGl0IiwiZmllbGRfbmFtZXMiLCJpc19maWxlIiwiY3VzdG9tUmVsYXRlZExpc3RPYmplY3QiLCJhY3Rpb25zIiwiYnV0dG9ucyIsInZpc2libGVfb24iLCJwYWdlX3NpemUiLCJvYmpPck5hbWUiLCJnZXRSZWxhdGVkT2JqZWN0cyIsInJlbGF0ZWRfb2JqZWN0X2l0ZW0iLCJyZWxhdGVkT2JqZWN0IiwidGFidWxhcl9vcmRlciIsImdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zIiwid2l0aG91dCIsInRyYW5zZm9ybVNvcnRUb1RhYnVsYXIiLCJyZXBsYWNlIiwicGx1Y2siLCJkaWZmZXJlbmNlIiwiaXNBY3RpdmUiLCJhbGxvd19yZWxhdGVkTGlzdCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJmaXJzdCIsImdldExpc3RWaWV3cyIsImdldExpc3RWaWV3IiwiZXhhYyIsImxpc3RWaWV3cyIsImdldExpc3RWaWV3SXNSZWNlbnQiLCJsaXN0VmlldyIsInBpY2tPYmplY3RNb2JpbGVDb2x1bW5zIiwiY291bnQiLCJnZXRGaWVsZCIsImlzTmFtZUNvbHVtbiIsIml0ZW1Db3VudCIsIm1heENvdW50IiwibWF4Um93cyIsIm5hbWVDb2x1bW4iLCJuYW1lS2V5IiwicmVzdWx0IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJjb2RlIiwiUmVnRXhwIiwiX3JlZ0V4TWVzc2FnZXMiLCJfZ2xvYmFsTWVzc2FnZXMiLCJyZWdFeCIsImV4cCIsIm1zZyIsIm1lc3NhZ2VzIiwiZXZhbEluQ29udGV4dCIsImpzIiwiZXZhbCIsImNhbGwiLCJjb252ZXJ0RmllbGQiLCJnZXRPcHRpb24iLCJvcHRpb24iLCJmb28iLCJjb2xvciIsImFsbE9wdGlvbnMiLCJwaWNrbGlzdCIsInBpY2tsaXN0T3B0aW9ucyIsImdldFBpY2tsaXN0IiwiZ2V0UGlja0xpc3RPcHRpb25zIiwicmV2ZXJzZSIsImVuYWJsZSIsImRlZmF1bHRWYWx1ZSIsInRyaWdnZXJzIiwidHJpZ2dlciIsIl90b2RvIiwiX3RvZG9fZnJvbV9jb2RlIiwiX3RvZG9fZnJvbV9kYiIsIm9uIiwidG9kbyIsInN5c3RlbUJhc2VGaWVsZHMiLCJvbWl0IiwicmVxdWlyZWQiLCJyZWFkb25seSIsImdldFN5c3RlbUJhc2VGaWVsZHMiLCJfdmlzaWJsZSIsImVycm9yMSIsImFjdGlvbnNCeU5hbWUiLCJ0cmltIiwiaXNFeHByZXNzaW9uIiwidmlzaWJsZSIsInJlY29yZF9wZXJtaXNzaW9ucyIsImdsb2JhbERhdGEiLCJhc3NpZ24iLCJub3ciLCJwYXJzZVNpbmdsZUV4cHJlc3Npb24iLCJfb3B0aW9ucyIsIl90eXBlIiwiYmVmb3JlT3BlbkZ1bmN0aW9uIiwiaXNfY29tcGFueV9saW1pdGVkIiwibWF4IiwibWluIiwiX29wdGlvbiIsImsiLCJfcmVnRXgiLCJfbWluIiwiX21heCIsIk51bWJlciIsIkJvb2xlYW4iLCJfb3B0aW9uc0Z1bmN0aW9uIiwiX3JlZmVyZW5jZV90byIsIl9jcmVhdGVGdW5jdGlvbiIsIl9iZWZvcmVPcGVuRnVuY3Rpb24iLCJfZmlsdGVyc0Z1bmN0aW9uIiwiX2RlZmF1bHRWYWx1ZSIsIl9pc19jb21wYW55X2xpbWl0ZWQiLCJfZmlsdGVycyIsImlzRGF0ZSIsInBvcCIsIl9pc19kYXRlIiwiZm9ybSIsInZhbCIsInJlbGF0ZWRPYmpJbmZvIiwiUFJFRklYIiwiX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhIiwicHJlZml4IiwiZmllbGRWYXJpYWJsZSIsInJlZyIsInJldiIsIm0iLCIkMSIsImZvcm11bGFfc3RyIiwiX0NPTlRFWFQiLCJfVkFMVUVTIiwiZGF0YSIsImlzQm9vbGVhbiIsInRvYXN0ciIsImZvcm1hdE9iamVjdE5hbWUiLCJfYmFzZU9iamVjdCIsIl9kYiIsImRlZmF1bHRMaXN0Vmlld0lkIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsInJlZjMiLCJzY2hlbWEiLCJzZWxmIiwiYmFzZU9iamVjdCIsInBlcm1pc3Npb25fc2V0IiwiaWNvbiIsImRlc2NyaXB0aW9uIiwiaXNfdmlldyIsImhhc0ltcG9ydFRlbXBsYXRlcyIsInZlcnNpb24iLCJpc19lbmFibGUiLCJhbGxvd19jdXN0b21BY3Rpb25zIiwiZXhjbHVkZV9hY3Rpb25zIiwiZW5hYmxlX3NlYXJjaCIsInBhZ2luZyIsImVuYWJsZV9hcGkiLCJjdXN0b20iLCJlbmFibGVfc2hhcmUiLCJlbmFibGVfdHJlZSIsInNpZGViYXIiLCJvcGVuX3dpbmRvdyIsImZpbHRlcl9jb21wYW55IiwiY2FsZW5kYXIiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJlbmFibGVfZm9sbG93IiwiZW5hYmxlX3dvcmtmbG93IiwiZW5hYmxlX2lubGluZV9lZGl0IiwiZGV0YWlscyIsIm1hc3RlcnMiLCJsb29rdXBfZGV0YWlscyIsImluX2RldmVsb3BtZW50IiwiaWRGaWVsZE5hbWUiLCJkYXRhYmFzZV9uYW1lIiwiaXNfbmFtZSIsInByaW1hcnkiLCJmaWx0ZXJhYmxlIiwiaXRlbV9uYW1lIiwiY29weUl0ZW0iLCJhZG1pbiIsImFsbCIsImxpc3Rfdmlld19pdGVtIiwiUmVhY3RpdmVWYXIiLCJjcmVhdGVDb2xsZWN0aW9uIiwiX25hbWUiLCJnZXRPYmplY3RTY2hlbWEiLCJjb250YWlucyIsImF0dGFjaFNjaGVtYSIsIl9zaW1wbGVTY2hlbWEiLCJnZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCIsImJvb3RzdHJhcExvYWRlZCIsImdldFNlbGVjdE9wdGlvbnMiLCJmaWVsZFNjaGVtYSIsImRhdGFfdHlwZSIsIm9wdGlvbkl0ZW0iLCJmaWVsZHNBcnIiLCJfcmVmX29iaiIsImF1dG9mb3JtX3R5cGUiLCJjb2xsZWN0aW9uTmFtZSIsImZzIiwiZnNUeXBlIiwiaXNVbkxpbWl0ZWQiLCJtdWx0aXBsZSIsInJvd3MiLCJsYW5ndWFnZSIsImlzTW9iaWxlIiwiaXNQYWQiLCJpc2lPUyIsImFmRmllbGRJbnB1dCIsInRpbWV6b25lSWQiLCJkeERhdGVCb3hPcHRpb25zIiwiZGlzcGxheUZvcm1hdCIsInBpY2tlclR5cGUiLCJkYXRlTW9iaWxlT3B0aW9ucyIsIm91dEZvcm1hdCIsInNob3dJY29uIiwiZGVwZW5kT24iLCJkZXBlbmRfb24iLCJjcmVhdGUiLCJsb29rdXBfZmllbGQiLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJvcGVyYXRpb24iLCJvblN1Y2Nlc3MiLCJhZGRJdGVtcyIsInJlZmVyZW5jZV9zb3J0Iiwib3B0aW9uc1NvcnQiLCJyZWZlcmVuY2VfbGltaXQiLCJvcHRpb25zTGltaXQiLCJyZWZlcmVuY2VfdG9fZmllbGQiLCJyZWZlcmVuY2VUb0ZpZWxkIiwiYmxhY2tib3giLCJvYmplY3RTd2l0Y2hlIiwib3B0aW9uc01ldGhvZCIsIm9wdGlvbnNNZXRob2RQYXJhbXMiLCJyZWZlcmVuY2VzIiwiX3JlZmVyZW5jZSIsImxpbmsiLCJkZWZhdWx0SWNvbiIsImZpcnN0T3B0aW9uIiwiZGVjaW1hbCIsInByZWNpc2lvbiIsInNjYWxlIiwiZGlzYWJsZWQiLCJBcnJheSIsImVkaXRhYmxlIiwiYWNjZXB0Iiwic3lzdGVtIiwiRW1haWwiLCJpc051bWJlciIsIm9wdGlvbmFsIiwidW5pcXVlIiwiZ3JvdXAiLCJzZWFyY2hhYmxlIiwiaW5saW5lSGVscFRleHQiLCJpc1Byb2R1Y3Rpb24iLCJzb3J0YWJsZSIsImdldEZpZWxkRGlzcGxheVZhbHVlIiwiZmllbGRfdmFsdWUiLCJodG1sIiwibW9tZW50IiwiZm9ybWF0IiwiY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5IiwiZmllbGRfdHlwZSIsImluY2x1ZGVzIiwicHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzIiwib3BlcmF0aW9ucyIsImJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyIsImJ1aWx0aW5JdGVtIiwiaXNfY2hlY2tfb25seSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24iLCJiZXR3ZWVuQnVpbHRpblZhbHVlcyIsImdldFF1YXJ0ZXJTdGFydE1vbnRoIiwibW9udGgiLCJnZXRNb250aCIsImdldExhc3RRdWFydGVyRmlyc3REYXkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJnZXROZXh0UXVhcnRlckZpcnN0RGF5IiwiZ2V0TW9udGhEYXlzIiwiZGF5cyIsImVuZERhdGUiLCJtaWxsaXNlY29uZCIsInN0YXJ0RGF0ZSIsImdldExhc3RNb250aEZpcnN0RGF5IiwiY3VycmVudE1vbnRoIiwiY3VycmVudFllYXIiLCJlbmRWYWx1ZSIsImZpcnN0RGF5IiwibGFzdERheSIsImxhc3RNb25kYXkiLCJsYXN0TW9udGhGaW5hbERheSIsImxhc3RNb250aEZpcnN0RGF5IiwibGFzdFF1YXJ0ZXJFbmREYXkiLCJsYXN0UXVhcnRlclN0YXJ0RGF5IiwibGFzdFN1bmRheSIsImxhc3RfMTIwX2RheXMiLCJsYXN0XzMwX2RheXMiLCJsYXN0XzYwX2RheXMiLCJsYXN0XzdfZGF5cyIsImxhc3RfOTBfZGF5cyIsIm1pbnVzRGF5IiwibW9uZGF5IiwibmV4dE1vbmRheSIsIm5leHRNb250aEZpbmFsRGF5IiwibmV4dE1vbnRoRmlyc3REYXkiLCJuZXh0UXVhcnRlckVuZERheSIsIm5leHRRdWFydGVyU3RhcnREYXkiLCJuZXh0U3VuZGF5IiwibmV4dFllYXIiLCJuZXh0XzEyMF9kYXlzIiwibmV4dF8zMF9kYXlzIiwibmV4dF82MF9kYXlzIiwibmV4dF83X2RheXMiLCJuZXh0XzkwX2RheXMiLCJwcmV2aW91c1llYXIiLCJzdGFydFZhbHVlIiwic3RyRW5kRGF5Iiwic3RyRmlyc3REYXkiLCJzdHJMYXN0RGF5Iiwic3RyTW9uZGF5Iiwic3RyU3RhcnREYXkiLCJzdHJTdW5kYXkiLCJzdHJUb2RheSIsInN0clRvbW9ycm93Iiwic3RyWWVzdGRheSIsInN1bmRheSIsInRoaXNRdWFydGVyRW5kRGF5IiwidGhpc1F1YXJ0ZXJTdGFydERheSIsInRvbW9ycm93Iiwid2VlayIsInllc3RkYXkiLCJnZXREYXkiLCJ0IiwiZnYiLCJzZXRIb3VycyIsImdldEhvdXJzIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJnZXRGaWVsZERlZmF1bHRPcGVyYXRpb24iLCJnZXRGaWVsZE9wZXJhdGlvbiIsIm9wdGlvbmFscyIsImVxdWFsIiwidW5lcXVhbCIsImxlc3NfdGhhbiIsImdyZWF0ZXJfdGhhbiIsImxlc3Nfb3JfZXF1YWwiLCJncmVhdGVyX29yX2VxdWFsIiwibm90X2NvbnRhaW4iLCJzdGFydHNfd2l0aCIsImJldHdlZW4iLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiZmllbGRzTmFtZSIsInNvcnRfbm8iLCJjbGVhblRyaWdnZXIiLCJpbml0VHJpZ2dlciIsIl90cmlnZ2VyX2hvb2tzIiwicmVmNCIsInJlZjUiLCJ0b2RvV3JhcHBlciIsImFwcGx5IiwiYXJndW1lbnRzIiwid2hlbiIsImJlZm9yZSIsImluc2VydCIsInVwZGF0ZSIsInJlbW92ZSIsImFmdGVyIiwiX2hvb2siLCJ0cmlnZ2VyX25hbWUiLCJfdHJpZ2dlcl9ob29rIiwiYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzIiwiZXh0ZW5kUGVybWlzc2lvblByb3BzIiwiZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCIsImZpbmRfcGVybWlzc2lvbl9vYmplY3QiLCJpbnRlcnNlY3Rpb25QbHVzIiwib3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzIiwib3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzIiwicGVybWlzc2lvblByb3BOYW1lcyIsInVuaW9uUGVybWlzc2lvbk9iamVjdHMiLCJ1bmlvblBsdXMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImdldFJlY29yZFBlcm1pc3Npb25zIiwiaXNPd25lciIsIm1hc3Rlck9iamVjdE5hbWUiLCJtYXN0ZXJSZWNvcmRQZXJtIiwicmVjb3JkX2NvbXBhbnlfaWQiLCJyZWNvcmRfY29tcGFueV9pZHMiLCJ1c2VyX2NvbXBhbnlfaWRzIiwib3duZXIiLCJwYXJlbnQiLCJuIiwiaW50ZXJzZWN0aW9uIiwibG9ja2VkIiwiZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyIsImN1cnJlbnRPYmplY3ROYW1lIiwicmVsYXRlZExpc3RJdGVtIiwiY3VycmVudFJlY29yZCIsImlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSIsIm1hc3RlckFsbG93IiwicmVsYXRlZE9iamVjdFBlcm1pc3Npb25zIiwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QiLCJnZXRPYmplY3RSZWNvcmQiLCJnZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIl9pIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwic3BhY2VVc2VyIiwib2JqZWN0cyIsImFzc2lnbmVkX2FwcHMiLCJwcm9maWxlIiwidXNlcnMiLCJwZXJtaXNzaW9uX3NldF9pZCIsIm1vZGlmaWVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwiZ2V0QXNzaWduZWRBcHBzIiwiYmluZCIsImFzc2lnbmVkX21lbnVzIiwiZ2V0QXNzaWduZWRNZW51cyIsInVzZXJfcGVybWlzc2lvbl9zZXRzIiwiYXJyYXkiLCJvdGhlciIsInRhcmdldCIsInByb3BzIiwiZmlsZXNQcm9OYW1lcyIsInByb3BOYW1lcyIsInByb3BOYW1lIiwiYXBwcyIsInBzZXRCYXNlIiwidXNlclByb2ZpbGUiLCJwc2V0IiwidW5pcSIsImFib3V0TWVudSIsImFkbWluTWVudXMiLCJhbGxNZW51cyIsImN1cnJlbnRQc2V0TmFtZXMiLCJtZW51cyIsIm90aGVyTWVudUFwcHMiLCJvdGhlck1lbnVzIiwiYWRtaW5fbWVudXMiLCJmbGF0dGVuIiwibWVudSIsInBzZXRzTWVudSIsInBlcm1pc3Npb25fc2V0cyIsInBlcm1pc3Npb25fb2JqZWN0cyIsImlzTnVsbCIsInBlcm1pc3Npb25fc2V0X2lkcyIsInBvcyIsIm9wcyIsIm9wc19rZXkiLCJjdXJyZW50UHNldCIsInRlbXBPcHMiLCJyZXBlYXRJbmRleCIsInJlcGVhdFBvIiwib3BzZXRBZG1pbiIsIm9wc2V0Q3VzdG9tZXIiLCJvcHNldEd1ZXN0Iiwib3BzZXRNZW1iZXIiLCJvcHNldFN1cHBsaWVyIiwib3BzZXRVc2VyIiwicG9zQWRtaW4iLCJwb3NDdXN0b21lciIsInBvc0d1ZXN0IiwicG9zTWVtYmVyIiwicG9zU3VwcGxpZXIiLCJwb3NVc2VyIiwicHJvZiIsImd1ZXN0IiwibWVtYmVyIiwic3VwcGxpZXIiLCJjdXN0b21lciIsImRpc2FibGVkX2FjdGlvbnMiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsInVuZWRpdGFibGVfZmllbGRzIiwiY3JlYXRvcl9kYl91cmwiLCJvcGxvZ191cmwiLCJNT05HT19VUkxfQ1JFQVRPUiIsIk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SIiwiX0NSRUFUT1JfREFUQVNPVVJDRSIsIl9kcml2ZXIiLCJNb25nb0ludGVybmFscyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvcGxvZ1VybCIsImNvbGxlY3Rpb25fa2V5IiwibmV3Q29sbGVjdGlvbiIsIlNNU1F1ZXVlIiwiX2RlbGV0ZVJlY29yZCIsImFjdGlvbl9uYW1lIiwiZXhlY3V0ZUFjdGlvbiIsIml0ZW1fZWxlbWVudCIsImNhbGxiYWNrIiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIk9iamVjdEdyaWQiLCJnZXRGaWx0ZXJzIiwid29yZF90ZW1wbGF0ZSIsIlN0ZWVkb3NGaWx0ZXJzIiwiZm9ybWF0RmlsdGVyc1RvT0RhdGFRdWVyeSIsImFic29sdXRlVXJsIiwid2luZG93Iiwib3BlbiIsIm9kYXRhIiwicHJvdG90eXBlIiwic2xpY2UiLCJjb25jYXQiLCJ3YXJuaW5nIiwicmVjb3JkX3RpdGxlIiwiY2FsbF9iYWNrIiwiY2FsbF9iYWNrX2Vycm9yIiwicHJldmlvdXNEb2MiLCJGb3JtTWFuYWdlciIsImdldFByZXZpb3VzRG9jIiwiaW5mbyIsInN1Y2Nlc3MiLCJydW5Ib29rIiwicmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3IiwiY29sbGVjdGlvbl9uYW1lIiwiY3VycmVudF9vYmplY3RfbmFtZSIsImN1cnJlbnRfcmVjb3JkX2lkIiwiZGVmYXVsdERvYyIsImluaXRpYWxWYWx1ZXMiLCJyZWxhdGVPYmplY3QiLCJzZXQiLCJnZXRSZWxhdGVkSW5pdGlhbFZhbHVlcyIsIlN0ZWVkb3NVSSIsInNob3dNb2RhbCIsInN0b3JlcyIsIkNvbXBvbmVudFJlZ2lzdHJ5IiwiY29tcG9uZW50cyIsIk9iamVjdEZvcm0iLCJvYmplY3RBcGlOYW1lIiwidGl0bGUiLCJhZnRlckluc2VydCIsInJlbG9hZFJlY29yZCIsIkZsb3dSb3V0ZXIiLCJyZWxvYWQiLCJpY29uUGF0aCIsImRlZmVyIiwiJCIsImNsaWNrIiwiZ3JpZE5hbWUiLCJpc1JlbGF0ZWQiLCJtYXN0ZXJSZWNvcmRJZCIsInJlbGF0ZWRGaWVsZE5hbWUiLCJzZWxlY3RlZFJvd3MiLCJncmlkUmVmcyIsImN1cnJlbnQiLCJhcGkiLCJnZXRTZWxlY3RlZFJvd3MiLCJncmlkUmVmIiwiZ2V0SW5pdGlhbFZhbHVlcyIsIlBhZ2UiLCJGb3JtIiwiU3RhbmRhcmROZXciLCJyZW5kZXIiLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwicmVkaXJlY3QiLCJTdGFuZGFyZEVkaXQiLCJiZWZvcmVIb29rIiwiaTE4blRleHRLZXkiLCJpMThuVGl0bGVLZXkiLCJuYW1lRmllbGQiLCJzZWxlY3RlZFJlY29yZHMiLCJ0ZXh0IiwiZ2V0VGFibGVTZWxlY3RlZFJvd3MiLCJzd2FsIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsImFmdGVyQmF0Y2hlc0RlbGV0ZSIsImRlbGV0ZUNvdW50ZXIiLCJfZSIsImFwcGlkIiwiZHhEYXRhR3JpZEluc3RhbmNlIiwiZ3JpZENvbnRhaW5lciIsImdyaWRPYmplY3ROYW1lQ2xhc3MiLCJpc09wZW5lclJlbW92ZSIsInJlY29yZFVybCIsInRlbXBOYXZSZW1vdmVkIiwib3BlbmVyIiwicm91dGUiLCJlbmRzV2l0aCIsInJlZnJlc2hHcmlkIiwiZHhUcmVlTGlzdCIsImR4RGF0YUdyaWQiLCJyZWZyZXNoIiwicmVtb3ZlVGVtcE5hdkl0ZW0iLCJjbG9zZSIsImdvIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsInJlY29yZFRpdGxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxLQUFDQSxFQUFELEdBQU0sRUFBTjs7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eUJEdkNSUixvQkN1Q1E7QUQxQ2lFLGlCQUExRSxFQUlHO0FDd0NNLHlCRHZDUkEsb0JDdUNRO0FENUNULGtCQ3NDTztBRDdDUixnQkNrQ007QUQ3RlI7QUFERDtBQ29ISTtBRDVITixRQ3FCRztBRDNJSjtBQUFBLEdBRkQ7QUN3UEEsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQGRiID0ge31cbmlmICFDcmVhdG9yP1xuXHRAQ3JlYXRvciA9IHt9XG5DcmVhdG9yLk9iamVjdHMgPSB7fVxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9XG5DcmVhdG9yLk1lbnVzID0gW11cbkNyZWF0b3IuQXBwcyA9IHt9XG5DcmVhdG9yLkRhc2hib2FyZHMgPSB7fVxuQ3JlYXRvci5SZXBvcnRzID0ge31cbkNyZWF0b3Iuc3VicyA9IHt9XG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fSIsInRoaXMuZGIgPSB7fTtcblxuaWYgKHR5cGVvZiBDcmVhdG9yID09PSBcInVuZGVmaW5lZFwiIHx8IENyZWF0b3IgPT09IG51bGwpIHtcbiAgdGhpcy5DcmVhdG9yID0ge307XG59XG5cbkNyZWF0b3IuT2JqZWN0cyA9IHt9O1xuXG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge307XG5cbkNyZWF0b3IuTWVudXMgPSBbXTtcblxuQ3JlYXRvci5BcHBzID0ge307XG5cbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9O1xuXG5DcmVhdG9yLlJlcG9ydHMgPSB7fTtcblxuQ3JlYXRvci5zdWJzID0ge307XG5cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9O1xuIiwidHJ5XG5cdGlmIHByb2Nlc3MuZW52LkNSRUFUT1JfTk9ERV9FTlYgPT0gJ2RldmVsb3BtZW50J1xuXHRcdHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXG5cdFx0b2JqZWN0cWwgPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpXG5cdFx0bW9sZWN1bGVyID0gcmVxdWlyZShcIm1vbGVjdWxlclwiKTtcblx0XHRwYWNrYWdlTG9hZGVyID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRlb3ItcGFja2FnZS1sb2FkZXInKTtcblx0XHRBUElTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1hcGknKTtcblx0XHRNZXRhZGF0YVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGFkYXRhLXNlcnZlcicpO1xuXHRcdHBhY2thZ2VTZXJ2aWNlID0gcmVxdWlyZShcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS1yZWdpc3RyeVwiKTtcblx0XHRwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cblx0XHRjb25maWcgPSBvYmplY3RxbC5nZXRTdGVlZG9zQ29uZmlnKCk7XG5cdFx0c2V0dGluZ3MgPSB7XG5cdFx0XHRidWlsdF9pbl9wbHVnaW5zOiBbXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc3RhbmRhcmQtc3BhY2VcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1vYmplY3QtZGF0YWJhc2VcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1wcm9jZXNzLWFwcHJvdmFsXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc3RhbmRhcmQtY29sbGFib3JhdGlvblwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLXVpXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc3RhbmRhcmQtcGVybWlzc2lvblwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3dlYmFwcC1wdWJsaWNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWNhY2hlcnMtbWFuYWdlclwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3VucGtnXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvd29ya2Zsb3dcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9hY2NvdW50c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3BsdWdpbi1jb21wYW55XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvbWV0YWRhdGEtYXBpXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvZGF0YS1pbXBvcnRcIixcblx0XHRcdFx0IyBcIkBzdGVlZG9zL3NlcnZpY2UtZmllbGRzLWluZGV4c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtYWNjb3VudHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWNoYXJ0c1wiLFxuXHRcdFx0XHQjIFwiQHN0ZWVkb3Mvc2VydmljZS1wYWdlc1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS1yZWdpc3RyeVwiLFxuXHRcdCAgIFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS10b29sXCIsXG5cdFx0XHRcdCMgXCJAc3RlZWRvcy9zdGFuZGFyZC1wcm9jZXNzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvd2ViYXBwLWFjY291bnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS13b3JrZmxvd1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtcGx1Z2luLWFtaXNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWZpbGVzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1zZW50cnlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWlkZW50aXR5LWp3dFwiXG5cdFx0XHRdLFxuXHRcdFx0cGx1Z2luczogY29uZmlnLnBsdWdpbnNcblx0XHR9XG5cdFx0TWV0ZW9yLnN0YXJ0dXAgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuXHRcdFx0XHRcdG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG5cdFx0XHRcdFx0bm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuXHRcdFx0XHRcdG1ldGFkYXRhOiB7fSxcblx0XHRcdFx0XHR0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG5cdFx0XHRcdFx0Y2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG5cdFx0XHRcdFx0bG9nTGV2ZWw6IFwid2FyblwiLFxuXHRcdFx0XHRcdHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuXHRcdFx0XHRcdHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG5cdFx0XHRcdFx0bWF4Q2FsbExldmVsOiAxMDAsXG5cblx0XHRcdFx0XHRoZWFydGJlYXRJbnRlcnZhbDogMTAsXG5cdFx0XHRcdFx0aGVhcnRiZWF0VGltZW91dDogMzAsXG5cblx0XHRcdFx0XHRjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG5cblx0XHRcdFx0XHR0cmFja2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaHV0ZG93blRpbWVvdXQ6IDUwMDAsXG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG5cblx0XHRcdFx0XHRyZWdpc3RyeToge1xuXHRcdFx0XHRcdFx0c3RyYXRlZ3k6IFwiUm91bmRSb2JpblwiLFxuXHRcdFx0XHRcdFx0cHJlZmVyTG9jYWw6IHRydWVcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0YnVsa2hlYWQ6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0Y29uY3VycmVuY3k6IDEwLFxuXHRcdFx0XHRcdFx0bWF4UXVldWVTaXplOiAxMDAsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR2YWxpZGF0b3I6IHRydWUsXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBudWxsLFxuXHRcdFx0XHRcdHRyYWNpbmc6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZXhwb3J0ZXI6IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJDb25zb2xlXCIsXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0XHRsb2dnZXI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3JzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0XHRcdFx0Z2F1Z2VXaWR0aDogNDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2tpcFByb2Nlc3NFdmVudFJlZ2lzdHJhdGlvbjogdHJ1ZSxcblxuXHRcdFx0XHRcdGNyZWF0ZWQ6IChicm9rZXIpLT4gXG5cdFx0XHRcdFx0XHQjIENsZWFyIGFsbCBjYWNoZSBlbnRyaWVzXG5cdFx0XHRcdFx0XHRicm9rZXIubG9nZ2VyLndhcm4oJ0NsZWFyIGFsbCBjYWNoZSBlbnRyaWVzIG9uIHN0YXJ0dXAuJylcblx0XHRcdFx0XHRcdGJyb2tlci5jYWNoZXIuY2xlYW4oKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0b2JqZWN0cWwuYnJva2VyLmluaXQoYnJva2VyKTtcblxuXHRcdFx0XHRvYmplY3RxbFNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZShyZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1vYmplY3RxbFwiKSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRwcm9qZWN0U2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiBcInByb2plY3Qtc2VydmVyXCIsXG5cdFx0XHRcdFx0bmFtZXNwYWNlOiBcInN0ZWVkb3NcIixcblx0XHRcdFx0XHRtaXhpbnM6IFtwYWNrYWdlU2VydmljZV0sXG5cdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0bWV0YWRhdGFTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6ICdtZXRhZGF0YS1zZXJ2ZXInLFxuXHRcdFx0XHRcdG1peGluczogW01ldGFkYXRhU2VydmljZV0sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR1aVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZShyZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS11aVwiKSk7XG5cblx0XHRcdFx0YXBpU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiBcImFwaVwiLFxuXHRcdFx0XHRcdG1peGluczogW0FQSVNlcnZpY2VdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRwb3J0OiBudWxsXG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cGFnZVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogXCJAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzXCIsXG5cdFx0XHRcdFx0bWl4aW5zOiBbcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1wYWdlcycpXSxcblx0XHRcdFx0XHRzZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0cG9ydDogbnVsbFxuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHN0ZWVkb3NTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6IFwic3RlZWRvcy1zZXJ2ZXJcIixcblx0XHRcdFx0XHRtaXhpbnM6IFtdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRwb3J0OiBudWxsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdGFydGVkOiAoKS0+XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdFx0XHRcdGJyb2tlci5lbWl0ICdzdGVlZG9zLXNlcnZlci5zdGFydGVkJ1xuXHRcdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRcdCwgMTAwMFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRvYmplY3RxbC5nZXRTdGVlZG9zU2NoZW1hKGJyb2tlcik7XG5cdFx0XHRcdHN0YW5kYXJkT2JqZWN0c0RpciA9IG9iamVjdHFsLlN0YW5kYXJkT2JqZWN0c1BhdGg7XG5cdFx0XHRcdHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6ICdzdGFuZGFyZC1vYmplY3RzJyxcblx0XHRcdFx0XHRtaXhpbnM6IFtwYWNrYWdlTG9hZGVyXSxcblx0XHRcdFx0XHRzZXR0aW5nczogeyBwYWNrYWdlSW5mbzoge1xuXHRcdFx0XHRcdFx0cGF0aDogc3RhbmRhcmRPYmplY3RzRGlyLFxuXHRcdFx0XHRcdH0gfVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRNZXRlb3Iud3JhcEFzeW5jKChjYiktPlxuXHRcdFx0XHRcdGJyb2tlci5zdGFydCgpLnRoZW4oKCktPlxuXHRcdFx0XHRcdFx0aWYgIWJyb2tlci5zdGFydGVkIFxuXHRcdFx0XHRcdFx0XHRicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKG9iamVjdHFsU2VydmljZSk7XG5cdFx0XHRcdFx0XHRcdGJyb2tlci5fcmVzdGFydFNlcnZpY2Uoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UpO1xuXHRcdFx0XHRcdFx0XHRicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKHVpU2VydmljZSk7XG5cblx0XHRcdFx0XHRcdGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5cdFx0XHRcdFx0XHRjb25uZWN0SGFuZGxlcnNFeHByZXNzID0gZXhwcmVzcygpO1xuXHRcdFx0XHRcdFx0Y29ubmVjdEhhbmRsZXJzRXhwcmVzcy51c2UocmVxdWlyZSgnQHN0ZWVkb3Mvcm91dGVyJykuc3RhdGljUm91dGVyKCkpO1xuXHRcdFx0XHRcdFx0YnJva2VyLndhaXRGb3JTZXJ2aWNlcygnfnBhY2thZ2VzLUBzdGVlZG9zL3NlcnZpY2UtdWknKS50aGVuICgpLT5cblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dhaXRGb3JTZXJ2aWNlcyB+cGFja2FnZXMtQHN0ZWVkb3Mvc2VydmljZS11aScpXG5cdFx0XHRcdFx0XHRcdGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MudXNlKFN0ZWVkb3NBcGkuZXhwcmVzcygpKVxuXHRcdFx0XHRcdFx0XHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShjb25uZWN0SGFuZGxlcnNFeHByZXNzKVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQjIHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4gKCktPlxuXHRcdFx0XHRcdFx0IyBcdGNiKCk7XG5cblx0XHRcdFx0XHRcdGJyb2tlci53YWl0Rm9yU2VydmljZXMoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UubmFtZSkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0XHRcdFx0XHRzdGVlZG9zQ29yZS5pbml0KHNldHRpbmdzKS50aGVuICgpLT5cblx0XHRcdFx0XHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpKClcblx0XHRcdGNhdGNoIGV4XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixleClcbmNhdGNoIGVcblx0Y29uc29sZS5lcnJvcihcImVycm9yOlwiLGUpIiwidmFyIEFQSVNlcnZpY2UsIE1ldGFkYXRhU2VydmljZSwgY29uZmlnLCBlLCBtb2xlY3VsZXIsIG9iamVjdHFsLCBwYWNrYWdlTG9hZGVyLCBwYWNrYWdlU2VydmljZSwgcGF0aCwgc2V0dGluZ3MsIHN0ZWVkb3NDb3JlO1xuXG50cnkge1xuICBpZiAocHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuICAgIG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcbiAgICBtb2xlY3VsZXIgPSByZXF1aXJlKFwibW9sZWN1bGVyXCIpO1xuICAgIHBhY2thZ2VMb2FkZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGVvci1wYWNrYWdlLWxvYWRlcicpO1xuICAgIEFQSVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLWFwaScpO1xuICAgIE1ldGFkYXRhU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0YWRhdGEtc2VydmVyJyk7XG4gICAgcGFja2FnZVNlcnZpY2UgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIpO1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgY29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xuICAgIHNldHRpbmdzID0ge1xuICAgICAgYnVpbHRfaW5fcGx1Z2luczogW1wiQHN0ZWVkb3Mvc3RhbmRhcmQtc3BhY2VcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1vYmplY3QtZGF0YWJhc2VcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1wcm9jZXNzLWFwcHJvdmFsXCIsIFwiQHN0ZWVkb3Mvc3RhbmRhcmQtY29sbGFib3JhdGlvblwiLCBcIkBzdGVlZG9zL3N0YW5kYXJkLXVpXCIsIFwiQHN0ZWVkb3Mvc3RhbmRhcmQtcGVybWlzc2lvblwiLCBcIkBzdGVlZG9zL3dlYmFwcC1wdWJsaWNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWNhY2hlcnMtbWFuYWdlclwiLCBcIkBzdGVlZG9zL3VucGtnXCIsIFwiQHN0ZWVkb3Mvd29ya2Zsb3dcIiwgXCJAc3RlZWRvcy9hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3BsdWdpbi1jb21wYW55XCIsIFwiQHN0ZWVkb3MvbWV0YWRhdGEtYXBpXCIsIFwiQHN0ZWVkb3MvZGF0YS1pbXBvcnRcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWFjY291bnRzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1jaGFydHNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhY2thZ2UtcmVnaXN0cnlcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhY2thZ2UtdG9vbFwiLCBcIkBzdGVlZG9zL3dlYmFwcC1hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2Utd29ya2Zsb3dcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBsdWdpbi1hbWlzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1maWxlc1wiLCBcIkBzdGVlZG9zL3NlcnZpY2Utc2VudHJ5XCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1pZGVudGl0eS1qd3RcIl0sXG4gICAgICBwbHVnaW5zOiBjb25maWcucGx1Z2luc1xuICAgIH07XG4gICAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXBpU2VydmljZSwgYnJva2VyLCBleCwgbWV0YWRhdGFTZXJ2aWNlLCBvYmplY3RxbFNlcnZpY2UsIHBhZ2VTZXJ2aWNlLCBwcm9qZWN0U2VydmljZSwgc3RhbmRhcmRPYmplY3RzRGlyLCBzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSwgc3RlZWRvc1NlcnZpY2UsIHVpU2VydmljZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGJyb2tlciA9IG5ldyBtb2xlY3VsZXIuU2VydmljZUJyb2tlcih7XG4gICAgICAgICAgbmFtZXNwYWNlOiBcInN0ZWVkb3NcIixcbiAgICAgICAgICBub2RlSUQ6IFwic3RlZWRvcy1jcmVhdG9yXCIsXG4gICAgICAgICAgbWV0YWRhdGE6IHt9LFxuICAgICAgICAgIHRyYW5zcG9ydGVyOiBwcm9jZXNzLmVudi5UUkFOU1BPUlRFUixcbiAgICAgICAgICBjYWNoZXI6IHByb2Nlc3MuZW52LkNBQ0hFUixcbiAgICAgICAgICBsb2dMZXZlbDogXCJ3YXJuXCIsXG4gICAgICAgICAgc2VyaWFsaXplcjogXCJKU09OXCIsXG4gICAgICAgICAgcmVxdWVzdFRpbWVvdXQ6IDYwICogMTAwMCxcbiAgICAgICAgICBtYXhDYWxsTGV2ZWw6IDEwMCxcbiAgICAgICAgICBoZWFydGJlYXRJbnRlcnZhbDogMTAsXG4gICAgICAgICAgaGVhcnRiZWF0VGltZW91dDogMzAsXG4gICAgICAgICAgY29udGV4dFBhcmFtc0Nsb25pbmc6IGZhbHNlLFxuICAgICAgICAgIHRyYWNraW5nOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIHNodXRkb3duVGltZW91dDogNTAwMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGlzYWJsZUJhbGFuY2VyOiBmYWxzZSxcbiAgICAgICAgICByZWdpc3RyeToge1xuICAgICAgICAgICAgc3RyYXRlZ3k6IFwiUm91bmRSb2JpblwiLFxuICAgICAgICAgICAgcHJlZmVyTG9jYWw6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJ1bGtoZWFkOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmN1cnJlbmN5OiAxMCxcbiAgICAgICAgICAgIG1heFF1ZXVlU2l6ZTogMTAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB2YWxpZGF0b3I6IHRydWUsXG4gICAgICAgICAgZXJyb3JIYW5kbGVyOiBudWxsLFxuICAgICAgICAgIHRyYWNpbmc6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgZXhwb3J0ZXI6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJDb25zb2xlXCIsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBsb2dnZXI6IG51bGwsXG4gICAgICAgICAgICAgICAgY29sb3JzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgICAgICAgZ2F1Z2VXaWR0aDogNDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2tpcFByb2Nlc3NFdmVudFJlZ2lzdHJhdGlvbjogdHJ1ZSxcbiAgICAgICAgICBjcmVhdGVkOiBmdW5jdGlvbihicm9rZXIpIHtcbiAgICAgICAgICAgIGJyb2tlci5sb2dnZXIud2FybignQ2xlYXIgYWxsIGNhY2hlIGVudHJpZXMgb24gc3RhcnR1cC4nKTtcbiAgICAgICAgICAgIHJldHVybiBicm9rZXIuY2FjaGVyLmNsZWFuKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgb2JqZWN0cWwuYnJva2VyLmluaXQoYnJva2VyKTtcbiAgICAgICAgb2JqZWN0cWxTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2UocmVxdWlyZShcIkBzdGVlZG9zL3NlcnZpY2Utb2JqZWN0cWxcIikpO1xuICAgICAgICBwcm9qZWN0U2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiBcInByb2plY3Qtc2VydmVyXCIsXG4gICAgICAgICAgbmFtZXNwYWNlOiBcInN0ZWVkb3NcIixcbiAgICAgICAgICBtaXhpbnM6IFtwYWNrYWdlU2VydmljZV1cbiAgICAgICAgfSk7XG4gICAgICAgIG1ldGFkYXRhU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiAnbWV0YWRhdGEtc2VydmVyJyxcbiAgICAgICAgICBtaXhpbnM6IFtNZXRhZGF0YVNlcnZpY2VdLFxuICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICB9KTtcbiAgICAgICAgdWlTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2UocmVxdWlyZShcIkBzdGVlZG9zL3NlcnZpY2UtdWlcIikpO1xuICAgICAgICBhcGlTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6IFwiYXBpXCIsXG4gICAgICAgICAgbWl4aW5zOiBbQVBJU2VydmljZV0sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHBvcnQ6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwYWdlU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiBcIkBzdGVlZG9zL3NlcnZpY2UtcGFnZXNcIixcbiAgICAgICAgICBtaXhpbnM6IFtyZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzJyldLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBwb3J0OiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc3RlZWRvc1NlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogXCJzdGVlZG9zLXNlcnZlclwiLFxuICAgICAgICAgIG1peGluczogW10sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHBvcnQ6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN0YXJ0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGJyb2tlci5lbWl0KCdzdGVlZG9zLXNlcnZlci5zdGFydGVkJyk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBvYmplY3RxbC5nZXRTdGVlZG9zU2NoZW1hKGJyb2tlcik7XG4gICAgICAgIHN0YW5kYXJkT2JqZWN0c0RpciA9IG9iamVjdHFsLlN0YW5kYXJkT2JqZWN0c1BhdGg7XG4gICAgICAgIHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6ICdzdGFuZGFyZC1vYmplY3RzJyxcbiAgICAgICAgICBtaXhpbnM6IFtwYWNrYWdlTG9hZGVyXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcGFja2FnZUluZm86IHtcbiAgICAgICAgICAgICAgcGF0aDogc3RhbmRhcmRPYmplY3RzRGlyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oY2IpIHtcbiAgICAgICAgICByZXR1cm4gYnJva2VyLnN0YXJ0KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjb25uZWN0SGFuZGxlcnNFeHByZXNzLCBleHByZXNzO1xuICAgICAgICAgICAgaWYgKCFicm9rZXIuc3RhcnRlZCkge1xuICAgICAgICAgICAgICBicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKG9iamVjdHFsU2VydmljZSk7XG4gICAgICAgICAgICAgIGJyb2tlci5fcmVzdGFydFNlcnZpY2Uoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UpO1xuICAgICAgICAgICAgICBicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKHVpU2VydmljZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuICAgICAgICAgICAgY29ubmVjdEhhbmRsZXJzRXhwcmVzcyA9IGV4cHJlc3MoKTtcbiAgICAgICAgICAgIGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MudXNlKHJlcXVpcmUoJ0BzdGVlZG9zL3JvdXRlcicpLnN0YXRpY1JvdXRlcigpKTtcbiAgICAgICAgICAgIGJyb2tlci53YWl0Rm9yU2VydmljZXMoJ35wYWNrYWdlcy1Ac3RlZWRvcy9zZXJ2aWNlLXVpJykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3dhaXRGb3JTZXJ2aWNlcyB+cGFja2FnZXMtQHN0ZWVkb3Mvc2VydmljZS11aScpO1xuICAgICAgICAgICAgICBjb25uZWN0SGFuZGxlcnNFeHByZXNzLnVzZShTdGVlZG9zQXBpLmV4cHJlc3MoKSk7XG4gICAgICAgICAgICAgIHJldHVybiBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShjb25uZWN0SGFuZGxlcnNFeHByZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGJyb2tlci53YWl0Rm9yU2VydmljZXMoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UubmFtZSkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGUgPSBlcnJvcjtcbiAgY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBlKTtcbn1cbiIsIkNyZWF0b3IuZGVwcyA9IHtcblx0YXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG5cdEFwcHM6IHt9LFxuXHRPYmplY3RzOiB7fVxufVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7b3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Y3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cbiMgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzIOS+m3N0ZWVkb3MtY2xp6aG555uu5L2/55SoXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXHRDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRcdEZpYmVyKCgpLT5cblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcblx0XHQpLnJ1bigpXG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IG9iai5uYW1lXG5cblx0aWYgIW9iai5saXN0X3ZpZXdzXG5cdFx0b2JqLmxpc3Rfdmlld3MgPSB7fVxuXG5cdGlmIG9iai5zcGFjZVxuXHRcdG9iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmopXG5cdGlmIG9iamVjdF9uYW1lID09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCdcblx0XHRvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcblx0XHRvYmogPSBfLmNsb25lKG9iailcblx0XHRvYmoubmFtZSA9IG9iamVjdF9uYW1lXG5cdFx0Q3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9ialxuXG5cdENyZWF0b3IuY29udmVydE9iamVjdChvYmopXG5cdG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuXG5cdENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKVxuXHRDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXG5cdHJldHVybiBvYmpcblxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gKG9iamVjdCkgLT5cblx0aWYgb2JqZWN0LnNwYWNlXG5cdFx0cmV0dXJuIFwiY18je29iamVjdC5zcGFjZX1fI3tvYmplY3QubmFtZX1cIlxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcblxuQ3JlYXRvci5nZXRPYmplY3QgPSAob2JqZWN0X25hbWUsIHNwYWNlX2lkKS0+XG5cdGlmIF8uaXNBcnJheShvYmplY3RfbmFtZSlcblx0XHRyZXR1cm4gO1xuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRDcmVhdG9yLmRlcHM/Lm9iamVjdD8uZGVwZW5kKClcblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuI1x0aWYgIXNwYWNlX2lkICYmIG9iamVjdF9uYW1lXG4jXHRcdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKVxuI1x0XHRcdHNwYWNlX2lkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cblx0aWYgb2JqZWN0X25hbWVcbiNcdFx0aWYgc3BhY2VfaWRcbiNcdFx0XHRvYmogPSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbXCJjXyN7c3BhY2VfaWR9XyN7b2JqZWN0X25hbWV9XCJdXG4jXHRcdFx0aWYgb2JqXG4jXHRcdFx0XHRyZXR1cm4gb2JqXG4jXG4jXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XG4jXHRcdFx0XHRyZXR1cm4gby5fY29sbGVjdGlvbl9uYW1lID09IG9iamVjdF9uYW1lXG4jXHRcdGlmIG9ialxuI1x0XHRcdHJldHVybiBvYmpcblxuXHRcdHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IChvYmplY3RfaWQpLT5cblx0cmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge19pZDogb2JqZWN0X2lkfSlcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSAob2JqZWN0X25hbWUpLT5cblx0Y29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0aWYgb2JqZWN0X25hbWVcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHJldHVybiBkYltvYmplY3RfbmFtZV1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/Ll9jb2xsZWN0aW9uX25hbWUgfHwgb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxuXHRkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0c3BhY2UgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKT8uZGI/LmZpbmRPbmUoc3BhY2VJZCx7ZmllbGRzOnthZG1pbnM6MX19KVxuXHRpZiBzcGFjZT8uYWRtaW5zXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMFxuXG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKS0+XG5cblx0aWYgIV8uaXNTdHJpbmcoZm9ybXVsYXIpXG5cdFx0cmV0dXJuIGZvcm11bGFyXG5cblx0aWYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpXG5cdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKVxuXG5cdHJldHVybiBmb3JtdWxhclxuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IChmaWx0ZXJzLCBjb250ZXh0KS0+XG5cdHNlbGVjdG9yID0ge31cblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cblx0XHRpZiBmaWx0ZXI/Lmxlbmd0aCA9PSAzXG5cdFx0XHRuYW1lID0gZmlsdGVyWzBdXG5cdFx0XHRhY3Rpb24gPSBmaWx0ZXJbMV1cblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KVxuXHRcdFx0c2VsZWN0b3JbbmFtZV0gPSB7fVxuXHRcdFx0c2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlXG5cdCMgY29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3Rvcilcblx0cmV0dXJuIHNlbGVjdG9yXG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IChzcGFjZUlkKSAtPlxuXHRyZXR1cm4gc3BhY2VJZCA9PSAnY29tbW9uJ1xuXG4jIyNcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuIyMjXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IChkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KS0+XG5cblx0aWYgIWlkX2tleVxuXHRcdGlkX2tleSA9IFwiX2lkXCJcblxuXHRpZiBoaXRfZmlyc3RcblxuXHRcdCPnlLHkuo7kuI3og73kvb/nlKhfLmZpbmRJbmRleOWHveaVsO+8jOWboOatpOatpOWkhOWFiOWwhuWvueixoeaVsOe7hOi9rOS4uuaZrumAmuaVsOe7hOexu+Wei++8jOWcqOiOt+WPluWFtmluZGV4XG5cdFx0dmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpXG5cblx0XHRyZXR1cm5cdF8uc29ydEJ5IGRvY3MsIChkb2MpLT5cblx0XHRcdFx0XHRfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcblx0XHRcdFx0XHRpZiBfaW5kZXggPiAtMVxuXHRcdFx0XHRcdFx0cmV0dXJuIF9pbmRleFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pXG5cdGVsc2Vcblx0XHRyZXR1cm5cdF8uc29ydEJ5IGRvY3MsIChkb2MpLT5cblx0XHRcdHYgPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG5cdFx0XHRpZiB2IDwgMFxuXHRcdFx0XHRyZXR1cm4gOTk5OTlcblx0XHRcdGVsc2UgXG5cdFx0XHRcdHJldHVybiB2XG5cbiMjI1xuXHTmjInnlKjmiLfmiYDlsZ7mnKzlnLDljJbor63oqIDov5vooYzmjpLluo/vvIzmlK/mjIHkuK3mlofjgIHmlbDlgLzjgIHml6XmnJ/nrYnlrZfmrrXmjpLluo9cblx05a+55LqOT2JqZWN057G75Z6L77yM5aaC5p6c5o+Q5L6b5L2c55So5Z+f5Lita2V55bGe5oCn77yM5YiZ5Y+W5YC85Li6dmFsdWVba2V5Xei/m+ihjOaOkuW6j+avlOi+g++8jOWPjeS5i+aVtOS4qk9iamVjdC50b1N0cmluZygp5ZCO5o6S5bqP5q+U6L6DXG4jIyNcbkNyZWF0b3Iuc29ydGluZ01ldGhvZCA9ICh2YWx1ZTEsIHZhbHVlMikgLT5cblx0aWYgdGhpcy5rZXlcblx0XHR2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldXG5cdFx0dmFsdWUyID0gdmFsdWUyW3RoaXMua2V5XVxuXHRpZiB2YWx1ZTEgaW5zdGFuY2VvZiBEYXRlXG5cdFx0dmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKVxuXHRpZiB2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlXG5cdFx0dmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKVxuXHRpZiB0eXBlb2YgdmFsdWUxIGlzIFwibnVtYmVyXCIgYW5kIHR5cGVvZiB2YWx1ZTIgaXMgXCJudW1iZXJcIlxuXHRcdHJldHVybiB2YWx1ZTEgLSB2YWx1ZTJcblx0IyBIYW5kbGluZyBudWxsIHZhbHVlc1xuXHRpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09IG51bGwgb3IgdmFsdWUxID09IHVuZGVmaW5lZFxuXHRpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09IG51bGwgb3IgdmFsdWUyID09IHVuZGVmaW5lZFxuXHRpZiBpc1ZhbHVlMUVtcHR5IGFuZCAhaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAtMVxuXHRpZiBpc1ZhbHVlMUVtcHR5IGFuZCBpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIDBcblx0aWYgIWlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gMVxuXHRsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG5cdHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlIHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGVcblxuXG4jIOivpeWHveaVsOWPquWcqOWIneWni+WMlk9iamVjdOaXtu+8jOaKiuebuOWFs+WvueixoeeahOiuoeeul+e7k+aenOS/neWtmOWIsE9iamVjdOeahHJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4re+8jOWQjue7reWPr+S7peebtOaOpeS7jnJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4reWPluW+l+iuoeeul+e7k+aenOiAjOS4jeeUqOWGjeasoeiwg+eUqOivpeWHveaVsOadpeiuoeeul1xuQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyA9IChvYmplY3RfbmFtZSktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IFtdXG5cdCMgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHQjIOWboENyZWF0b3IuZ2V0T2JqZWN05Ye95pWw5YaF6YOo6KaB6LCD55So6K+l5Ye95pWw77yM5omA5Lul6L+Z6YeM5LiN5Y+v5Lul6LCD55SoQ3JlYXRvci5nZXRPYmplY3Tlj5blr7nosaHvvIzlj6rog73osIPnlKhDcmVhdG9yLk9iamVjdHPmnaXlj5blr7nosaFcblx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0aWYgIV9vYmplY3Rcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cdFxuXHRyZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Rcblx0aWYgTWV0ZW9yLmlzQ2xpZW50ICYmICFfLmlzRW1wdHkgcmVsYXRlZExpc3Rcblx0XHRyZWxhdGVkTGlzdE1hcCA9IHt9XG5cdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0LCAob2JqTmFtZSktPlxuXHRcdFx0aWYgXy5pc09iamVjdCBvYmpOYW1lXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9XG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XG5cdFx0XHRcdGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgcmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWUgYW5kIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cdFx0XHRcdFx0IyDlvZNyZWxhdGVkX29iamVjdC5maWVsZHPkuK3mnInkuKTkuKrmiJbku6XkuIrnmoTlrZfmrrXmjIflkJFvYmplY3RfbmFtZeihqOekuueahOWvueixoeaXtu+8jOS8mOWFiOWPluesrOS4gOS4quS9nOS4uuWklumUruWFs+ezu+Wtl+aute+8jOS9huaYr3JlbGF0ZWRfZmllbGTkuLrkuLvlrZDooajml7blvLrooYzopobnm5bkuYvliY3nmoRyZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXeWAvFxuXHRcdFx0XHRcdGlmIF8uaXNFbXB0eSByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCJcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0geyBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddID0geyBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCIgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0geyBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiIH1cblx0XHRfLmVhY2ggWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIChlbmFibGVPYmpOYW1lKS0+XG5cdFx0XHRpZiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHsgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXVxuXHRcdFx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxuXHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHsgb2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0cmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMgcmVsYXRlZExpc3RNYXBcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cblx0aWYgX29iamVjdC5lbmFibGVfZmlsZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJ9XG5cblx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcblx0XHRcdCMgY2ZzLmZpbGVzLmZpbGVyZWNvcmTlr7nosaHlnKjnrKzkuozmrKHngrnlh7vnmoTml7blgJlyZWxhdGVkX29iamVjdOi/lOWbnueahOaYr2FwcC1idWlsZGVy5Lit55qEXCJtZXRhZGF0YS5wYXJlbnRcIuWtl+auteiiq+WIoOmZpOS6hu+8jOiusOWIsG1ldGFkYXRh5a2X5q6155qEc3ViX2ZpZWxkc+S4reS6hu+8jOaJgOS7peimgeWNleeLrOWkhOeQhuOAglxuXHRcdFx0c2ZzRmlsZXNPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpXG5cdFx0XHRzZnNGaWxlc09iamVjdCAmJiByZWxhdGVkX29iamVjdCA9IHNmc0ZpbGVzT2JqZWN0XG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcblx0XHRcdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcIm9iamVjdF9maWVsZHNcIlxuXHRcdFx0XHRcdCNUT0RPIOW+heebuOWFs+WIl+ihqOaUr+aMgeaOkuW6j+WQju+8jOWIoOmZpOatpOWIpOaWrVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWV9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkfVxuXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwidGFza3NcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ub3Rlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfZXZlbnRzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiZXZlbnRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIn1cblx0aWYgX29iamVjdC5lbmFibGVfYXBwcm92YWxzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfcHJvY2Vzc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcInByb2Nlc3NfaW5zdGFuY2VfaGlzdG9yeVwiLCBmb3JlaWduX2tleTogXCJ0YXJnZXRfb2JqZWN0XCJ9XG5cdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4Fcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblxuXHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSAodXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUXG5cdGVsc2Vcblx0XHRpZiAhKHVzZXJJZCBhbmQgc3BhY2VJZClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdHN1RmllbGRzID0ge25hbWU6IDEsIG1vYmlsZTogMSwgcG9zaXRpb246IDEsIGVtYWlsOiAxLCBjb21wYW55OiAxLCBvcmdhbml6YXRpb246IDEsIHNwYWNlOiAxLCBjb21wYW55X2lkOiAxLCBjb21wYW55X2lkczogMX1cblx0XHQjIGNoZWNrIGlmIHVzZXIgaW4gdGhlIHNwYWNlXG5cdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcblx0XHRpZiAhc3Vcblx0XHRcdHNwYWNlSWQgPSBudWxsXG5cblx0XHQjIGlmIHNwYWNlSWQgbm90IGV4aXN0cywgZ2V0IHRoZSBmaXJzdCBvbmUuXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdGlmIGlzVW5TYWZlTW9kZVxuXHRcdFx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXG5cdFx0XHRcdGlmICFzdVxuXHRcdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHRcdHNwYWNlSWQgPSBzdS5zcGFjZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0VVNFUl9DT05URVhUID0ge31cblx0XHRVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkXG5cdFx0VVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkXG5cdFx0VVNFUl9DT05URVhULnVzZXIgPSB7XG5cdFx0XHRfaWQ6IHVzZXJJZFxuXHRcdFx0bmFtZTogc3UubmFtZSxcblx0XHRcdG1vYmlsZTogc3UubW9iaWxlLFxuXHRcdFx0cG9zaXRpb246IHN1LnBvc2l0aW9uLFxuXHRcdFx0ZW1haWw6IHN1LmVtYWlsXG5cdFx0XHRjb21wYW55OiBzdS5jb21wYW55XG5cdFx0XHRjb21wYW55X2lkOiBzdS5jb21wYW55X2lkXG5cdFx0XHRjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcblx0XHR9XG5cdFx0c3BhY2VfdXNlcl9vcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpPy5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbilcblx0XHRpZiBzcGFjZV91c2VyX29yZ1xuXHRcdFx0VVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuXHRcdFx0XHRfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcblx0XHRcdFx0bmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcblx0XHRcdFx0ZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG5cdFx0XHR9XG5cdFx0cmV0dXJuIFVTRVJfQ09OVEVYVFxuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gKHVybCktPlxuXG5cdGlmIF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAodXJsPy5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpKVxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxuXHRcdHJldHVybiB1cmxcblxuXHRpZiB1cmxcblx0XHQjIHVybOW8gOWktOayoeaciVwiL1wi77yM6ZyA6KaB5re75YqgXCIvXCJcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybFxuXHRlbHNlXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVhcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gKHVzZXJJZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcblx0ZWxzZVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZDoxfX0pXG5cdHJldHVybiBzdS5jb21wYW55X2lkXG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSAodXNlcklkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxuXHRlbHNlXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkczoxfX0pXG5cdHJldHVybiBzdT8uY29tcGFueV9pZHNcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSAocG8pLT5cblx0aWYgcG8uYWxsb3dDcmVhdGVcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLmFsbG93RWRpdFxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8uYWxsb3dEZWxldGVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby52aWV3QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0cG8udmlld0FsbFJlY29yZHMgPSB0cnVlXG5cdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHRcblx0IyDlpoLmnpzpmYTku7bnm7jlhbPmnYPpmZDphY3nva7kuLrnqbrvvIzliJnlhbzlrrnkuYvliY3msqHmnInpmYTku7bmnYPpmZDphY3nva7ml7bnmoTop4TliJlcblx0aWYgcG8uYWxsb3dSZWFkXG5cdFx0dHlwZW9mIHBvLmFsbG93UmVhZEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby52aWV3QWxsRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8udmlld0FsbEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0VkaXRcblx0XHR0eXBlb2YgcG8uYWxsb3dDcmVhdGVGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0NyZWF0ZUZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby5hbGxvd0VkaXRGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHR0eXBlb2YgcG8uYWxsb3dEZWxldGVGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0dHlwZW9mIHBvLm1vZGlmeUFsbEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLm1vZGlmeUFsbEZpbGVzID0gdHJ1ZVxuXG5cdGlmIHBvLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0RmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dEZWxldGVGaWxlc1xuXHRcdHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZVxuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby52aWV3QWxsRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZVxuXHRcdHBvLnZpZXdBbGxGaWxlcyA9IHRydWVcblxuXHRyZXR1cm4gcG9cblxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSAoKS0+XG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWRcblxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9ICgpLT5cblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkXG5cbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gKHNwYWNlSWQpLT5cblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWQgPT0gc3BhY2VJZFxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gKHNwYWNlSWQpLT5cblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5jbG91ZEFkbWluU3BhY2VJZCA9PSBzcGFjZUlkXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUlxuXHQiLCJ2YXIgRmliZXI7XG5cbkNyZWF0b3IuZGVwcyA9IHtcbiAgYXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5LFxuICBvYmplY3Q6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcbn07XG5cbkNyZWF0b3IuX1RFTVBMQVRFID0ge1xuICBBcHBzOiB7fSxcbiAgT2JqZWN0czoge31cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgcmV0dXJuIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xufSk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcbiAgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmxvYWRPYmplY3RzKG9iaiwgb2JqZWN0X25hbWUpO1xuICAgIH0pLnJ1bigpO1xuICB9O1xufVxuXG5DcmVhdG9yLmxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmoubmFtZTtcbiAgfVxuICBpZiAoIW9iai5saXN0X3ZpZXdzKSB7XG4gICAgb2JqLmxpc3Rfdmlld3MgPSB7fTtcbiAgfVxuICBpZiAob2JqLnNwYWNlKSB7XG4gICAgb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iaik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lID09PSAnY2ZzX2ZpbGVzX2ZpbGVyZWNvcmQnKSB7XG4gICAgb2JqZWN0X25hbWUgPSAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnO1xuICAgIG9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICBvYmoubmFtZSA9IG9iamVjdF9uYW1lO1xuICAgIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0gPSBvYmo7XG4gIH1cbiAgQ3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iaik7XG4gIG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuICBDcmVhdG9yLmluaXRUcmlnZ2VycyhvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdC5zcGFjZSkge1xuICAgIHJldHVybiBcImNfXCIgKyBvYmplY3Quc3BhY2UgKyBcIl9cIiArIG9iamVjdC5uYW1lO1xuICB9XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKSB7XG4gIHZhciByZWYsIHJlZjE7XG4gIGlmIChfLmlzQXJyYXkob2JqZWN0X25hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoKHJlZiA9IENyZWF0b3IuZGVwcykgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWYxID0gcmVmLm9iamVjdCkgIT0gbnVsbCkge1xuICAgICAgICByZWYxLmRlcGVuZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gZnVuY3Rpb24ob2JqZWN0X2lkKSB7XG4gIHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtcbiAgICBfaWQ6IG9iamVjdF9pZFxuICB9KTtcbn07XG5cbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgY29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpO1xuICBkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICByZXR1cm4gZGJbb2JqZWN0X25hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1soKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5fY29sbGVjdGlvbl9uYW1lIDogdm9pZCAwKSB8fCBvYmplY3RfbmFtZV07XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLnJlbW92ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlZiwgcmVmMSwgc3BhY2U7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHNwYWNlID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZGIpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgIGZpZWxkczoge1xuICAgICAgYWRtaW5zOiAxXG4gICAgfVxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgaWYgKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghXy5pc1N0cmluZyhmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gZm9ybXVsYXI7XG4gIH1cbiAgaWYgKENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFyO1xufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBjb250ZXh0KSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgc2VsZWN0b3IgPSB7fTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBhY3Rpb24sIG5hbWUsIHZhbHVlO1xuICAgIGlmICgoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMykge1xuICAgICAgbmFtZSA9IGZpbHRlclswXTtcbiAgICAgIGFjdGlvbiA9IGZpbHRlclsxXTtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KTtcbiAgICAgIHNlbGVjdG9yW25hbWVdID0ge307XG4gICAgICByZXR1cm4gc2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIHNwYWNlSWQgPT09ICdjb21tb24nO1xufTtcblxuXG4vKlxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4gKi9cblxuQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMgPSBmdW5jdGlvbihkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KSB7XG4gIHZhciB2YWx1ZXM7XG4gIGlmICghaWRfa2V5KSB7XG4gICAgaWRfa2V5ID0gXCJfaWRcIjtcbiAgfVxuICBpZiAoaGl0X2ZpcnN0KSB7XG4gICAgdmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpO1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHZhciBfaW5kZXg7XG4gICAgICBfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgICBpZiAoX2luZGV4ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9pbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHZhciB2O1xuICAgICAgdiA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKTtcbiAgICAgIGlmICh2IDwgMCkge1xuICAgICAgICByZXR1cm4gOTk5OTk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcblxuXG4vKlxuXHTmjInnlKjmiLfmiYDlsZ7mnKzlnLDljJbor63oqIDov5vooYzmjpLluo/vvIzmlK/mjIHkuK3mlofjgIHmlbDlgLzjgIHml6XmnJ/nrYnlrZfmrrXmjpLluo9cblx05a+55LqOT2JqZWN057G75Z6L77yM5aaC5p6c5o+Q5L6b5L2c55So5Z+f5Lita2V55bGe5oCn77yM5YiZ5Y+W5YC85Li6dmFsdWVba2V5Xei/m+ihjOaOkuW6j+avlOi+g++8jOWPjeS5i+aVtOS4qk9iamVjdC50b1N0cmluZygp5ZCO5o6S5bqP5q+U6L6DXG4gKi9cblxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gZnVuY3Rpb24odmFsdWUxLCB2YWx1ZTIpIHtcbiAgdmFyIGlzVmFsdWUxRW1wdHksIGlzVmFsdWUyRW1wdHksIGxvY2FsZTtcbiAgaWYgKHRoaXMua2V5KSB7XG4gICAgdmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XTtcbiAgICB2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldO1xuICB9XG4gIGlmICh2YWx1ZTEgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodmFsdWUyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZTEgPT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHZhbHVlMiA9PT0gXCJudW1iZXJcIikge1xuICAgIHJldHVybiB2YWx1ZTEgLSB2YWx1ZTI7XG4gIH1cbiAgaXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PT0gbnVsbCB8fCB2YWx1ZTEgPT09IHZvaWQgMDtcbiAgaXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PT0gbnVsbCB8fCB2YWx1ZTIgPT09IHZvaWQgMDtcbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgIWlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGlmICghaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgcmV0dXJuIHZhbHVlMS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUodmFsdWUyLnRvU3RyaW5nKCksIGxvY2FsZSk7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIHBlcm1pc3Npb25zLCByZWxhdGVkTGlzdCwgcmVsYXRlZExpc3RNYXAsIHJlbGF0ZWRfb2JqZWN0cztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICBpZiAoIV9vYmplY3QpIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xuICB9XG4gIHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5KHJlbGF0ZWRMaXN0KSkge1xuICAgIHJlbGF0ZWRMaXN0TWFwID0ge307XG4gICAgXy5lYWNoKHJlbGF0ZWRMaXN0LCBmdW5jdGlvbihvYmpOYW1lKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChvYmpOYW1lKSkge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbb2JqTmFtZS5vYmplY3ROYW1lXSA9IHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWVdID0ge307XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lICYmIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdKSB7XG4gICAgICAgICAgaWYgKF8uaXNFbXB0eShyZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0ge1xuICAgICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSkge1xuICAgICAgcmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgICB9O1xuICAgIH1cbiAgICBfLmVhY2goWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIGZ1bmN0aW9uKGVuYWJsZU9iak5hbWUpIHtcbiAgICAgIGlmIChyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSkge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsXG4gICAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10pIHtcbiAgICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgICByZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddID0ge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMocmVsYXRlZExpc3RNYXApO1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2ZpbGVzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgIH0pO1xuICB9XG4gIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgdmFyIHNmc0ZpbGVzT2JqZWN0O1xuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICAgIHNmc0ZpbGVzT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKTtcbiAgICAgIHNmc0ZpbGVzT2JqZWN0ICYmIChyZWxhdGVkX29iamVjdCA9IHNmc0ZpbGVzT2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgaWYgKChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RfZmllbGRzXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnNwbGljZSgwLCAwLCB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Rhc2tzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwidGFza3NcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ub3Rlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcIm5vdGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZXZlbnRzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiZXZlbnRzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfaW5zdGFuY2VzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfYXBwcm92YWxzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiYXBwcm92YWxzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfcHJvY2Vzcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInByb2Nlc3NfaW5zdGFuY2VfaGlzdG9yeVwiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwidGFyZ2V0X29iamVjdFwiXG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgaWYgKF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIChwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMCkpIHtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKSB7XG4gIHZhciBVU0VSX0NPTlRFWFQsIHJlZiwgc3BhY2VfdXNlcl9vcmcsIHN1LCBzdUZpZWxkcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiBDcmVhdG9yLlVTRVJfQ09OVEVYVDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoISh1c2VySWQgJiYgc3BhY2VJZCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzdUZpZWxkcyA9IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBtb2JpbGU6IDEsXG4gICAgICBwb3NpdGlvbjogMSxcbiAgICAgIGVtYWlsOiAxLFxuICAgICAgY29tcGFueTogMSxcbiAgICAgIG9yZ2FuaXphdGlvbjogMSxcbiAgICAgIHNwYWNlOiAxLFxuICAgICAgY29tcGFueV9pZDogMSxcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfTtcbiAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgIH0pO1xuICAgIGlmICghc3UpIHtcbiAgICAgIHNwYWNlSWQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIGlmIChpc1VuU2FmZU1vZGUpIHtcbiAgICAgICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXN1KSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3BhY2VJZCA9IHN1LnNwYWNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIFVTRVJfQ09OVEVYVCA9IHt9O1xuICAgIFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWQ7XG4gICAgVVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkO1xuICAgIFVTRVJfQ09OVEVYVC51c2VyID0ge1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBuYW1lOiBzdS5uYW1lLFxuICAgICAgbW9iaWxlOiBzdS5tb2JpbGUsXG4gICAgICBwb3NpdGlvbjogc3UucG9zaXRpb24sXG4gICAgICBlbWFpbDogc3UuZW1haWwsXG4gICAgICBjb21wYW55OiBzdS5jb21wYW55LFxuICAgICAgY29tcGFueV9pZDogc3UuY29tcGFueV9pZCxcbiAgICAgIGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuICAgIH07XG4gICAgc3BhY2VfdXNlcl9vcmcgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKSkgIT0gbnVsbCA/IHJlZi5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbikgOiB2b2lkIDA7XG4gICAgaWYgKHNwYWNlX3VzZXJfb3JnKSB7XG4gICAgICBVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG4gICAgICAgIF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuICAgICAgICBmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBVU0VSX0NPTlRFWFQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgaWYgKF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAoKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCIvYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcImFzc2V0c1wiKSA6IHZvaWQgMCkgfHwgKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCIvcGFja2FnZXNcIikgOiB2b2lkIDApKSkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgaWYgKHVybCkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1LmNvbXBhbnlfaWQ7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UgIT0gbnVsbCA/IHN1LmNvbXBhbnlfaWRzIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSBmdW5jdGlvbihwbykge1xuICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0RlbGV0ZSkge1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0FsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd1JlYWQpIHtcbiAgICB0eXBlb2YgcG8uYWxsb3dSZWFkRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd1JlYWRGaWxlcyA9IHRydWUpO1xuICAgIHR5cGVvZiBwby52aWV3QWxsRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby52aWV3QWxsRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgdHlwZW9mIHBvLmFsbG93Q3JlYXRlRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd0NyZWF0ZUZpbGVzID0gdHJ1ZSk7XG4gICAgdHlwZW9mIHBvLmFsbG93RWRpdEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlKTtcbiAgICB0eXBlb2YgcG8uYWxsb3dEZWxldGVGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgIHR5cGVvZiBwby5tb2RpZnlBbGxGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLm1vZGlmeUFsbEZpbGVzID0gdHJ1ZSk7XG4gIH1cbiAgaWYgKHBvLmFsbG93Q3JlYXRlRmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0RlbGV0ZUZpbGVzKSB7XG4gICAgcG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlO1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0FsbEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWU7XG4gICAgcG8udmlld0FsbEZpbGVzID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcG87XG59O1xuXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSO1xufVxuIiwiTWV0ZW9yLm1ldGhvZHNcblx0IyDnlKjmiLfojrflj5Zsb29rdXAg44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteeahOmAiemhueWAvFxuXHRcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogKG9wdGlvbnMpLT5cblx0XHRpZiBvcHRpb25zPy5wYXJhbXM/LnJlZmVyZW5jZV90b1xuXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKVxuXG5cdFx0XHRuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXG5cdFx0XHRxdWVyeSA9IHt9XG5cdFx0XHRpZiBvcHRpb25zLnBhcmFtcy5zcGFjZVxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cblx0XHRcdFx0c29ydCA9IG9wdGlvbnM/LnNvcnRcblxuXHRcdFx0XHRzZWxlY3RlZCA9IG9wdGlvbnM/LnNlbGVjdGVkIHx8IFtdXG5cblx0XHRcdFx0b3B0aW9uc19saW1pdCA9IG9wdGlvbnM/Lm9wdGlvbnNfbGltaXQgfHwgMTBcblxuXHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7JHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHR9XG5cblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319LCBzZWFyY2hUZXh0UXVlcnldXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX1dXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpXG5cdFx0XHRcdFx0cXVlcnkuX2lkID0geyRuaW46IHNlbGVjdGVkfVxuXG5cdFx0XHRcdGNvbGxlY3Rpb24gPSBvYmplY3QuZGJcblxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XG5cdFx0XHRcdFx0Xy5leHRlbmQgcXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnlcblxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiBvcHRpb25zX2xpbWl0fVxuXG5cdFx0XHRcdGlmIHNvcnQgJiYgXy5pc09iamVjdChzb3J0KVxuXHRcdFx0XHRcdHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnRcblxuXHRcdFx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRyZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpXG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gW11cblx0XHRcdFx0XHRcdF8uZWFjaCByZWNvcmRzLCAocmVjb3JkKS0+XG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaFxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlY29yZC5faWRcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzXG5cdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxuXHRcdHJldHVybiBbXSAiLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGUsIG5hbWVfZmllbGRfa2V5LCBvYmplY3QsIG9wdGlvbnNfbGltaXQsIHF1ZXJ5LCBxdWVyeV9vcHRpb25zLCByZWNvcmRzLCByZWYsIHJlZjEsIHJlc3VsdHMsIHNlYXJjaFRleHRRdWVyeSwgc2VsZWN0ZWQsIHNvcnQ7XG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYgPSBvcHRpb25zLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpO1xuICAgICAgbmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLnNwYWNlKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2U7XG4gICAgICAgIHNvcnQgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNvcnQgOiB2b2lkIDA7XG4gICAgICAgIHNlbGVjdGVkID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc2VsZWN0ZWQgOiB2b2lkIDApIHx8IFtdO1xuICAgICAgICBvcHRpb25zX2xpbWl0ID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMub3B0aW9uc19saW1pdCA6IHZvaWQgMCkgfHwgMTA7XG4gICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0ge1xuICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmMSA9IG9wdGlvbnMudmFsdWVzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIHNlYXJjaFRleHRRdWVyeVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgJG5pbjogc2VsZWN0ZWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbGxlY3Rpb24gPSBvYmplY3QuZGI7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlclF1ZXJ5KSB7XG4gICAgICAgICAgXy5leHRlbmQocXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXJ5X29wdGlvbnMgPSB7XG4gICAgICAgICAgbGltaXQ6IG9wdGlvbnNfbGltaXRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNvcnQgJiYgXy5pc09iamVjdChzb3J0KSkge1xuICAgICAgICAgIHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKTtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChyZWNvcmRzLCBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5faWRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IChvYmplY3RfbmFtZSwgY29sdW1ucykgLT5cblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKT8uX3NjaGVtYVxuXHRjb2x1bW5fbnVtID0gMFxuXHRpZiBfc2NoZW1hXG5cdFx0Xy5lYWNoIGNvbHVtbnMsIChmaWVsZF9uYW1lKSAtPlxuXHRcdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcblx0XHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcblx0XHRcdGlmIGlzX3dpZGVcblx0XHRcdFx0Y29sdW1uX251bSArPSAyXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMVxuXG5cdFx0aW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bVxuXHRcdHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnRcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkgLT5cblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hXG5cdGlmIF9zY2hlbWFcblx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxuXHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcblx0XHRyZXR1cm4gaXNfd2lkZVxuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSAtPlxuXHRzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucz8uc2V0dGluZ3M/LmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIn0pXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gXy5tYXAgY29sdW1ucywgKGNvbHVtbiktPlxuXHRcdGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dXG5cdFx0aWYgZmllbGQ/LnR5cGUgYW5kICFmaWVsZC5oaWRkZW5cblx0XHRcdHJldHVybiBjb2x1bW5cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdGNvbHVtbnMgPSBfLmNvbXBhY3QgY29sdW1uc1xuXHRpZiBzZXR0aW5nIGFuZCBzZXR0aW5nLnNldHRpbmdzXG5cdFx0c29ydCA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXT8uc29ydCB8fCBbXVxuXHRcdHNvcnQgPSBfLm1hcCBzb3J0LCAob3JkZXIpLT5cblx0XHRcdGtleSA9IG9yZGVyWzBdXG5cdFx0XHRpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpXG5cdFx0XHRvcmRlclswXSA9IGluZGV4ICsgMVxuXHRcdFx0cmV0dXJuIG9yZGVyXG5cdFx0cmV0dXJuIHNvcnRcblx0cmV0dXJuIFtdXG5cblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXVxuXHRleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl1cblx0ZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXVxuXHRpZiBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcblx0XHRleHRyYV9jb2x1bW5zID0gXy51bmlvbiBleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcblxuXHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzP1tvYmplY3RfbmFtZV0gPSBbXVxuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IChkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpLT5cblx0ZGVmYXVsdF9jb2x1bW5zID0gZGVmYXVsdF92aWV3Py5jb2x1bW5zXG5cdGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/Lm1vYmlsZV9jb2x1bW5zXG5cdHVubGVzcyBsaXN0X3ZpZXdcblx0XHRyZXR1cm5cblx0b2l0ZW0gPSBfLmNsb25lKGxpc3Rfdmlldylcblx0aWYgIV8uaGFzKG9pdGVtLCBcIm5hbWVcIilcblx0XHRvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWVcblx0aWYgIW9pdGVtLmNvbHVtbnNcblx0XHRpZiBkZWZhdWx0X2NvbHVtbnNcblx0XHRcdG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnNcblx0aWYgIW9pdGVtLmNvbHVtbnNcblx0XHRvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXVxuXHRpZiAhb2l0ZW0ubW9iaWxlX2NvbHVtbnNcblx0XHRpZiBkZWZhdWx0X21vYmlsZV9jb2x1bW5zXG5cdFx0XHRvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcblxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKVxuXHRcdFx0b2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpXG5cblxuXHRpZiAhb2l0ZW0uZmlsdGVyX3Njb3BlXG5cdFx0IyBsaXN0dmlld+inhuWbvueahGZpbHRlcl9zY29wZem7mOiupOWAvOaUueS4unNwYWNlICMxMzFcblx0XHRvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCJcblxuXHRpZiAhXy5oYXMob2l0ZW0sIFwiX2lkXCIpXG5cdFx0b2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWVcblx0ZWxzZVxuXHRcdG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWVcblxuXHRpZiBfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpXG5cdFx0b2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucylcblxuXHRfLmZvckVhY2ggb2l0ZW0uZmlsdGVycywgKGZpbHRlciwgX2luZGV4KS0+XG5cdFx0aWYgIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKVxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxuXHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxuXHRyZXR1cm4gb2l0ZW1cblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Q3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IChvYmplY3RfbmFtZSktPlxuXHRcdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdFx0cmV0dXJuXG5cdFx0cmVsYXRlZExpc3RPYmplY3RzID0ge31cblx0XHRyZWxhdGVkTGlzdE5hbWVzID0gW11cblx0XHRvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMgPSBbXTtcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgX29iamVjdFxuXHRcdFx0bGF5b3V0UmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRfbGlzdHM7XG5cdFx0XHQjIGxheW91dFJlbGF0ZWRMaXN0IOaYr+aVsOe7hOWwseihqOekuumFjee9rui/h+mhtemdouW4g+WxgO+8jOWwseWQr+eUqOmhtemdouW4g+WxgOeahOebuOWFs+WtkOihqOOAglxuXHRcdFx0aWYgXy5pc0FycmF5IGxheW91dFJlbGF0ZWRMaXN0XG5cdFx0XHRcdF8uZWFjaCBsYXlvdXRSZWxhdGVkTGlzdCwgKGl0ZW0pLT5cblx0XHRcdFx0XHRyZU9iamVjdE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRcdHJlRmllbGROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMV1cblx0XHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlT2JqZWN0TmFtZSk/LmZpZWxkc1tyZUZpZWxkTmFtZV0/LndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogcmVPYmplY3ROYW1lXG5cdFx0XHRcdFx0XHRjb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzXG5cdFx0XHRcdFx0XHRtb2JpbGVfY29sdW1uczogaXRlbS5maWVsZF9uYW1lc1xuXHRcdFx0XHRcdFx0aXNfZmlsZTogcmVPYmplY3ROYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdFx0XHRcdGZpbHRlcnNGdW5jdGlvbjogaXRlbS5maWx0ZXJzXG5cdFx0XHRcdFx0XHRzb3J0OiBpdGVtLnNvcnRcblx0XHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVGaWVsZE5hbWVcblx0XHRcdFx0XHRcdGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlXG5cdFx0XHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdFx0XHRcdGxhYmVsOiBpdGVtLmxhYmVsXG5cdFx0XHRcdFx0XHRhY3Rpb25zOiBpdGVtLmJ1dHRvbnNcblx0XHRcdFx0XHRcdHZpc2libGVfb246IGl0ZW0udmlzaWJsZV9vblxuXHRcdFx0XHRcdFx0cGFnZV9zaXplOiBpdGVtLnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cy5wdXNoKHJlbGF0ZWQpXG5cdFx0XHRcdHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHM7XG5cdFx0XHRyZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Rcblx0XHRcdGlmICFfLmlzRW1wdHkgcmVsYXRlZExpc3Rcblx0XHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0LCAob2JqT3JOYW1lKS0+XG5cdFx0XHRcdFx0aWYgXy5pc09iamVjdCBvYmpPck5hbWVcblx0XHRcdFx0XHRcdHJlbGF0ZWQgPVxuXHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWVcblx0XHRcdFx0XHRcdFx0Y29sdW1uczogb2JqT3JOYW1lLmNvbHVtbnNcblx0XHRcdFx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IG9iak9yTmFtZS5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRcdFx0XHRpc19maWxlOiBvYmpPck5hbWUub2JqZWN0TmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRcdFx0XHRcdGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnNcblx0XHRcdFx0XHRcdFx0c29ydDogb2JqT3JOYW1lLnNvcnRcblx0XHRcdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiAnJ1xuXHRcdFx0XHRcdFx0XHRjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZVxuXHRcdFx0XHRcdFx0XHRsYWJlbDogb2JqT3JOYW1lLmxhYmVsXG5cdFx0XHRcdFx0XHRcdGFjdGlvbnM6IG9iak9yTmFtZS5hY3Rpb25zXG5cdFx0XHRcdFx0XHRcdHBhZ2Vfc2l6ZTogb2JqT3JOYW1lLnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWRcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWUub2JqZWN0TmFtZVxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyBvYmpPck5hbWVcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWVcblxuXHRcdG1hcExpc3QgPSB7fVxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIC0+XG5cdFx0XHRpZiAhcmVsYXRlZF9vYmplY3RfaXRlbT8ub2JqZWN0X25hbWVcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZVxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleVxuXHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkX29iamVjdF9pdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0XHR1bmxlc3MgcmVsYXRlZF9vYmplY3Rcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXG5cdFx0XHRjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSlcblx0XHRcdG1vYmlsZV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lLCB0cnVlKSB8fCBbXCJuYW1lXCJdXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxuXG5cdFx0XHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSlcblx0XHRcdHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpXG5cblx0XHRcdGlmIC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKVxuXHRcdFx0XHQjIG9iamVjdOexu+Wei+W4puWtkOWxnuaAp+eahHJlbGF0ZWRfZmllbGRfbmFtZeimgeWOu+aOieS4remXtOeahOe+juWFg+espuWPt++8jOWQpuWImeaYvuekuuS4jeWHuuWtl+auteWAvFxuXHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLyxcIlwiKVxuXHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lXG5cdFx0XHRcdGNvbHVtbnM6IGNvbHVtbnNcblx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0XHRcdGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdFx0aWYgcmVsYXRlZE9iamVjdFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmNvbHVtbnNcblx0XHRcdFx0XHRyZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnNcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRcdHJlbGF0ZWQubW9iaWxlX2NvbHVtbnMgPSByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3Quc29ydFxuXHRcdFx0XHRcdHJlbGF0ZWQuc29ydCA9IHJlbGF0ZWRPYmplY3Quc29ydFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvblxuXHRcdFx0XHRcdHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxuXHRcdFx0XHRcdHJlbGF0ZWQuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QgPSByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubGFiZWxcblx0XHRcdFx0XHRyZWxhdGVkLmxhYmVsID0gcmVsYXRlZE9iamVjdC5sYWJlbFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdHJlbGF0ZWQucGFnZV9zaXplID0gcmVsYXRlZE9iamVjdC5wYWdlX3NpemVcblx0XHRcdFx0ZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXG5cdFx0XHRtYXBMaXN0W3JlbGF0ZWQub2JqZWN0X25hbWVdID0gcmVsYXRlZFxuXG5cblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF8udmFsdWVzKHJlbGF0ZWRMaXN0T2JqZWN0cyksIFwib2JqZWN0X25hbWVcIilcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0XHR1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzXG5cdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0T2JqZWN0cywgKHYsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIC0+XG5cdFx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxuXHRcdFx0YWxsb3dSZWFkID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5hbGxvd1JlYWRcblx0XHRcdGlmIGlzQWN0aXZlICYmIGFsbG93UmVhZFxuXHRcdFx0XHRtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdlxuXG5cdFx0bGlzdCA9IFtdXG5cdFx0aWYgXy5pc0VtcHR5IHJlbGF0ZWRMaXN0TmFtZXNcblx0XHRcdGxpc3QgPSAgXy52YWx1ZXMgbWFwTGlzdFxuXHRcdGVsc2Vcblx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdE5hbWVzLCAob2JqZWN0TmFtZSkgLT5cblx0XHRcdFx0aWYgbWFwTGlzdFtvYmplY3ROYW1lXVxuXHRcdFx0XHRcdGxpc3QucHVzaCBtYXBMaXN0W29iamVjdE5hbWVdXG5cblx0XHRpZiBfLmhhcyhfb2JqZWN0LCAnYWxsb3dfcmVsYXRlZExpc3QnKVxuXHRcdFx0bGlzdCA9IF8uZmlsdGVyIGxpc3QsIChpdGVtKS0+XG5cdFx0XHRcdHJldHVybiBfLmluY2x1ZGUoX29iamVjdC5hbGxvd19yZWxhdGVkTGlzdCwgaXRlbS5vYmplY3RfbmFtZSlcblxuXHRcdHJldHVybiBsaXN0XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyA9IChvYmplY3RfbmFtZSktPlxuXHRyZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpXG5cbiMjIyBcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG4jIyNcbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYyktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuXG5cdGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKVxuXHR1bmxlc3MgbGlzdFZpZXdzPy5sZW5ndGhcblx0XHRyZXR1cm5cblx0bGlzdF92aWV3ID0gXy5maW5kKGxpc3RWaWV3cywgKGl0ZW0pLT4gcmV0dXJuIGl0ZW0uX2lkID09IGxpc3Rfdmlld19pZCB8fCBpdGVtLm5hbWUgPT0gbGlzdF92aWV3X2lkKVxuXHR1bmxlc3MgbGlzdF92aWV3XG5cdFx0IyDlpoLmnpzkuI3pnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzliJnpu5jorqTov5Tlm57nrKzkuIDkuKrop4blm77vvIzlj43kuYvov5Tlm57nqbpcblx0XHRpZiBleGFjXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF1cblx0cmV0dXJuIGxpc3Rfdmlld1xuXG4j6I635Y+WbGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+5piv5ZCm5piv5pyA6L+R5p+l55yL6KeG5Zu+XG5DcmVhdG9yLmdldExpc3RWaWV3SXNSZWNlbnQgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXG5cdGlmIHR5cGVvZihsaXN0X3ZpZXdfaWQpID09IFwic3RyaW5nXCJcblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiAhb2JqZWN0XG5cdFx0XHRyZXR1cm5cblx0XHRsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLHtfaWQ6IGxpc3Rfdmlld19pZH0pXG5cdGVsc2Vcblx0XHRsaXN0VmlldyA9IGxpc3Rfdmlld19pZFxuXHRyZXR1cm4gbGlzdFZpZXc/Lm5hbWUgPT0gXCJyZWNlbnRcIlxuXG5cbiMjI1xuICAgIOS7jmNvbHVtbnPlj4LmlbDkuK3ov4fmu6Tlh7rnlKjkuo7miYvmnLrnq6/mmL7npLrnmoRjb2x1bW5zXG5cdOinhOWIme+8mlxuXHQxLuS8mOWFiOaKimNvbHVtbnPkuK3nmoRuYW1l5a2X5q615o6S5Zyo56ys5LiA5LiqXG5cdDIu5pyA5aSa5Y+q6L+U5ZueNOS4quWtl+autVxuXHQzLuiAg+iZkeWuveWtl+auteWNoOeUqOaVtOihjOinhOWImeadoeS7tuS4i++8jOacgOWkmuWPqui/lOWbnuS4pOihjFxuIyMjXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKS0+XG5cdHJlc3VsdCA9IFtdXG5cdG1heFJvd3MgPSAyIFxuXHRtYXhDb3VudCA9IG1heFJvd3MgKiAyXG5cdGNvdW50ID0gMFxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gb2JqZWN0LmZpZWxkc1xuXHR1bmxlc3Mgb2JqZWN0XG5cdFx0cmV0dXJuIGNvbHVtbnNcblx0bmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXHRpc05hbWVDb2x1bW4gPSAoaXRlbSktPlxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdHJldHVybiBpdGVtLmZpZWxkID09IG5hbWVLZXlcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gaXRlbSA9PSBuYW1lS2V5XG5cdGdldEZpZWxkID0gKGl0ZW0pLT5cblx0XHRpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW0uZmllbGRdXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZpZWxkc1tpdGVtXVxuXHRpZiBuYW1lS2V5XG5cdFx0bmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZCAoaXRlbSktPlxuXHRcdFx0cmV0dXJuIGlzTmFtZUNvbHVtbihpdGVtKVxuXHRpZiBuYW1lQ29sdW1uXG5cdFx0ZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKVxuXHRcdGl0ZW1Db3VudCA9IGlmIGZpZWxkLmlzX3dpZGUgdGhlbiAyIGVsc2UgMVxuXHRcdGNvdW50ICs9IGl0ZW1Db3VudFxuXHRcdHJlc3VsdC5wdXNoIG5hbWVDb2x1bW5cblx0Y29sdW1ucy5mb3JFYWNoIChpdGVtKS0+XG5cdFx0ZmllbGQgPSBnZXRGaWVsZChpdGVtKVxuXHRcdHVubGVzcyBmaWVsZFxuXHRcdFx0cmV0dXJuXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXG5cdFx0aWYgY291bnQgPCBtYXhDb3VudCBhbmQgcmVzdWx0Lmxlbmd0aCA8IG1heENvdW50IGFuZCAhaXNOYW1lQ29sdW1uKGl0ZW0pXG5cdFx0XHRjb3VudCArPSBpdGVtQ291bnRcblx0XHRcdGlmIGNvdW50IDw9IG1heENvdW50XG5cdFx0XHRcdHJlc3VsdC5wdXNoIGl0ZW1cblx0XG5cdHJldHVybiByZXN1bHRcblxuIyMjXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSAob2JqZWN0X25hbWUpLT5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGlmIG9iamVjdD8ubGlzdF92aWV3cz8uZGVmYXVsdFxuXHRcdCNUT0RPIOatpOS7o+eggeWPquaYr+aaguaXtuWFvOWuueS7peWJjWNvZGXkuK3lrprkuYnnmoRkZWZhdWx06KeG5Zu+77yM5b6FY29kZeS4reeahGRlZmF1bHTmuIXnkIblrozmiJDlkI7vvIzpnIDopoHliKDpmaTmraTku6PnoIFcblx0XHRkZWZhdWx0VmlldyA9IG9iamVjdC5saXN0X3ZpZXdzLmRlZmF1bHRcblx0ZWxzZVxuXHRcdF8uZWFjaCBvYmplY3Q/Lmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcsIGtleSktPlxuXHRcdFx0aWYgbGlzdF92aWV3Lm5hbWUgPT0gXCJhbGxcIiB8fCBrZXkgPT0gXCJhbGxcIlxuXHRcdFx0XHRkZWZhdWx0VmlldyA9IGxpc3Rfdmlld1xuXHRyZXR1cm4gZGVmYXVsdFZpZXc7XG5cbiMjI1xuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gZGVmYXVsdFZpZXc/LmNvbHVtbnNcblx0aWYgdXNlX21vYmlsZV9jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdFZpZXc/Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnNcblx0XHRlbHNlIGlmIGNvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKVxuXHRyZXR1cm4gY29sdW1uc1xuXG4jIyNcbiAgICDojrflj5blr7nosaHnmoTliJfooajnrKzkuIDkuKrop4blm77mmL7npLrnmoTlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyA9IChvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gZGVmYXVsdFZpZXc/LmNvbHVtbnNcblx0aWYgdXNlX21vYmlsZV9jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdFZpZXc/Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnNcblx0XHRlbHNlIGlmIGNvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKVxuXHRyZXR1cm4gY29sdW1uc1xuXG4jIyNcblx06I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k6aKd5aSW5Yqg6L2955qE5a2X5q61XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IChvYmplY3RfbmFtZSktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXG5cdHJldHVybiBkZWZhdWx0Vmlldz8uZXh0cmFfY29sdW1uc1xuXG4jIyNcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQgPSAob2JqZWN0X25hbWUpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRpZiBkZWZhdWx0Vmlld1xuXHRcdGlmIGRlZmF1bHRWaWV3LnNvcnRcblx0XHRcdHJldHVybiBkZWZhdWx0Vmlldy5zb3J0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIFtbXCJjcmVhdGVkXCIsIFwiZGVzY1wiXV1cblxuXG4jIyNcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuIyMjXG5DcmVhdG9yLmlzQWxsVmlldyA9IChsaXN0X3ZpZXcpLT5cblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcImFsbFwiXG5cbiMjI1xuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XG4jIyNcbkNyZWF0b3IuaXNSZWNlbnRWaWV3ID0gKGxpc3RfdmlldyktPlxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwicmVjZW50XCJcblxuIyMjXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiMjI1xuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gKHNvcnQsIHRhYnVsYXJDb2x1bW5zKS0+XG5cdHRhYnVsYXJfc29ydCA9IFtdXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxuXHRcdGlmIF8uaXNBcnJheShpdGVtKVxuXHRcdFx0IyDlhbzlrrnml6fnmoTmlbDmja7moLzlvI9bW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxuXHRcdFx0aWYgaXRlbS5sZW5ndGggPT0gMVxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgXCJhc2NcIl1cblx0XHRcdGVsc2UgaWYgaXRlbS5sZW5ndGggPT0gMlxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgaXRlbVsxXV1cblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdCPmlrDmlbDmja7moLzlvI/vvJpbe2ZpZWxkX25hbWU6ICwgb3JkZXI6IH1dXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcblx0XHRcdGlmIGZpZWxkX25hbWUgJiYgb3JkZXJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihmaWVsZF9uYW1lKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIG9yZGVyXVxuXG5cdHJldHVybiB0YWJ1bGFyX3NvcnRcblxuIyMjXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiMjI1xuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9EWCA9IChzb3J0KS0+XG5cdGR4X3NvcnQgPSBbXVxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcblx0XHRcdCPlhbzlrrnml6fmoLzlvI/vvJpbW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxuXHRcdFx0ZHhfc29ydC5wdXNoKGl0ZW0pXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXG5cdFx0XHRcdGR4X3NvcnQucHVzaCBbZmllbGRfbmFtZSwgb3JkZXJdXG5cblx0cmV0dXJuIGR4X3NvcnRcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBfc2NoZW1hLCBjb2x1bW5fbnVtLCBpbml0X3dpZHRoX3BlcmNlbnQsIHJlZjtcbiAgX3NjaGVtYSA9IChyZWYgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuX3NjaGVtYSA6IHZvaWQgMDtcbiAgY29sdW1uX251bSA9IDA7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICAgIHZhciBmaWVsZCwgaXNfd2lkZSwgcmVmMSwgcmVmMjtcbiAgICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgICAgaXNfd2lkZSA9IChyZWYxID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYyLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNfd2lkZSkge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtO1xuICAgIHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkge1xuICB2YXIgX3NjaGVtYSwgZmllbGQsIGlzX3dpZGUsIHJlZiwgcmVmMTtcbiAgX3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgIGlzX3dpZGUgPSAocmVmID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICByZXR1cm4gaXNfd2lkZTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRUYWJ1bGFyT3JkZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSB7XG4gIHZhciBvYmosIHJlZiwgcmVmMSwgcmVmMiwgc2V0dGluZywgc29ydDtcbiAgc2V0dGluZyA9IChyZWYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zKSAhPSBudWxsID8gKHJlZjEgPSByZWYuc2V0dGluZ3MpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBfLm1hcChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICB2YXIgZmllbGQ7XG4gICAgZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl07XG4gICAgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkgJiYgIWZpZWxkLmhpZGRlbikge1xuICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gIH0pO1xuICBjb2x1bW5zID0gXy5jb21wYWN0KGNvbHVtbnMpO1xuICBpZiAoc2V0dGluZyAmJiBzZXR0aW5nLnNldHRpbmdzKSB7XG4gICAgc29ydCA9ICgocmVmMiA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXSkgIT0gbnVsbCA/IHJlZjIuc29ydCA6IHZvaWQgMCkgfHwgW107XG4gICAgc29ydCA9IF8ubWFwKHNvcnQsIGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICB2YXIgaW5kZXgsIGtleTtcbiAgICAgIGtleSA9IG9yZGVyWzBdO1xuICAgICAgaW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KTtcbiAgICAgIG9yZGVyWzBdID0gaW5kZXggKyAxO1xuICAgICAgcmV0dXJuIG9yZGVyO1xuICAgIH0pO1xuICAgIHJldHVybiBzb3J0O1xuICB9XG4gIHJldHVybiBbXTtcbn07XG5cbkNyZWF0b3IuaW5pdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMsIGV4dHJhX2NvbHVtbnMsIG9iamVjdCwgb3JkZXIsIHJlZjtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXTtcbiAgZXh0cmFfY29sdW1ucyA9IFtcIm93bmVyXCJdO1xuICBkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdO1xuICBpZiAoZGVmYXVsdF9leHRyYV9jb2x1bW5zKSB7XG4gICAgZXh0cmFfY29sdW1ucyA9IF8udW5pb24oZXh0cmFfY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zKTtcbiAgfVxuICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkcykgIT0gbnVsbCA/IHJlZltvYmplY3RfbmFtZV0gPSBbXSA6IHZvaWQgMDtcbiAgfVxufTtcblxuQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcgPSBmdW5jdGlvbihkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRfY29sdW1ucywgZGVmYXVsdF9tb2JpbGVfY29sdW1ucywgb2l0ZW07XG4gIGRlZmF1bHRfY29sdW1ucyA9IGRlZmF1bHRfdmlldyAhPSBudWxsID8gZGVmYXVsdF92aWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcgIT0gbnVsbCA/IGRlZmF1bHRfdmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb2l0ZW0gPSBfLmNsb25lKGxpc3Rfdmlldyk7XG4gIGlmICghXy5oYXMob2l0ZW0sIFwibmFtZVwiKSkge1xuICAgIG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZTtcbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9jb2x1bW5zKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zID0gZGVmYXVsdF9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXTtcbiAgfVxuICBpZiAoIW9pdGVtLm1vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLm1vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF9tb2JpbGVfY29sdW1ucztcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKSkge1xuICAgICAgb2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmZpbHRlcl9zY29wZSkge1xuICAgIG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIjtcbiAgfVxuICBpZiAoIV8uaGFzKG9pdGVtLCBcIl9pZFwiKSkge1xuICAgIG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lO1xuICB9IGVsc2Uge1xuICAgIG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWU7XG4gIH1cbiAgaWYgKF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucykpIHtcbiAgICBvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKTtcbiAgfVxuICBfLmZvckVhY2gob2l0ZW0uZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICBpZiAoIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9pdGVtO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX29iamVjdCwgbGF5b3V0UmVsYXRlZExpc3QsIGxpc3QsIG1hcExpc3QsIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cywgcGVybWlzc2lvbnMsIHJlbGF0ZWRMaXN0LCByZWxhdGVkTGlzdE5hbWVzLCByZWxhdGVkTGlzdE9iamVjdHMsIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCByZWxhdGVkX29iamVjdHMsIHNwYWNlSWQsIHVucmVsYXRlZF9vYmplY3RzLCB1c2VySWQ7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZWxhdGVkTGlzdE9iamVjdHMgPSB7fTtcbiAgICByZWxhdGVkTGlzdE5hbWVzID0gW107XG4gICAgb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzID0gW107XG4gICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoX29iamVjdCkge1xuICAgICAgbGF5b3V0UmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRfbGlzdHM7XG4gICAgICBpZiAoXy5pc0FycmF5KGxheW91dFJlbGF0ZWRMaXN0KSkge1xuICAgICAgICBfLmVhY2gobGF5b3V0UmVsYXRlZExpc3QsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICB2YXIgcmVGaWVsZE5hbWUsIHJlT2JqZWN0TmFtZSwgcmVmLCByZWYxLCByZWxhdGVkLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgICAgICByZU9iamVjdE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICByZUZpZWxkTmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlT2JqZWN0TmFtZSkpICE9IG51bGwgPyAocmVmMSA9IHJlZi5maWVsZHNbcmVGaWVsZE5hbWVdKSAhPSBudWxsID8gcmVmMS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICByZWxhdGVkID0ge1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlT2JqZWN0TmFtZSxcbiAgICAgICAgICAgIGNvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXMsXG4gICAgICAgICAgICBtb2JpbGVfY29sdW1uczogaXRlbS5maWVsZF9uYW1lcyxcbiAgICAgICAgICAgIGlzX2ZpbGU6IHJlT2JqZWN0TmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgICAgIGZpbHRlcnNGdW5jdGlvbjogaXRlbS5maWx0ZXJzLFxuICAgICAgICAgICAgc29ydDogaXRlbS5zb3J0LFxuICAgICAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiByZUZpZWxkTmFtZSxcbiAgICAgICAgICAgIGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlLFxuICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkLFxuICAgICAgICAgICAgbGFiZWw6IGl0ZW0ubGFiZWwsXG4gICAgICAgICAgICBhY3Rpb25zOiBpdGVtLmJ1dHRvbnMsXG4gICAgICAgICAgICB2aXNpYmxlX29uOiBpdGVtLnZpc2libGVfb24sXG4gICAgICAgICAgICBwYWdlX3NpemU6IGl0ZW0ucGFnZV9zaXplXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLnB1c2gocmVsYXRlZCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzO1xuICAgICAgfVxuICAgICAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICAgICAgaWYgKCFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqT3JOYW1lKSB7XG4gICAgICAgICAgdmFyIHJlbGF0ZWQ7XG4gICAgICAgICAgaWYgKF8uaXNPYmplY3Qob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lLFxuICAgICAgICAgICAgICBjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1ucyxcbiAgICAgICAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG9iak9yTmFtZS5tb2JpbGVfY29sdW1ucyxcbiAgICAgICAgICAgICAgaXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgICAgICAgIGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnMsXG4gICAgICAgICAgICAgIHNvcnQ6IG9iak9yTmFtZS5zb3J0LFxuICAgICAgICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6ICcnLFxuICAgICAgICAgICAgICBjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgbGFiZWw6IG9iak9yTmFtZS5sYWJlbCxcbiAgICAgICAgICAgICAgYWN0aW9uczogb2JqT3JOYW1lLmFjdGlvbnMsXG4gICAgICAgICAgICAgIHBhZ2Vfc2l6ZTogb2JqT3JOYW1lLnBhZ2Vfc2l6ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUub2JqZWN0TmFtZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE5hbWVzLnB1c2gob2JqT3JOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBtYXBMaXN0ID0ge307XG4gICAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfaXRlbSkge1xuICAgICAgdmFyIGNvbHVtbnMsIG1vYmlsZV9jb2x1bW5zLCBvcmRlciwgcmVsYXRlZCwgcmVsYXRlZE9iamVjdCwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgdGFidWxhcl9vcmRlciwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICBpZiAoIShyZWxhdGVkX29iamVjdF9pdGVtICE9IG51bGwgPyByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZTtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXk7XG4gICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICByZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFyZWxhdGVkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgY29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgbW9iaWxlX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRydWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpO1xuICAgICAgaWYgKC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKSkge1xuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLywgXCJcIik7XG4gICAgICB9XG4gICAgICByZWxhdGVkID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zLFxuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgaXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICB9O1xuICAgICAgcmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChyZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmNvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5zb3J0KSB7XG4gICAgICAgICAgcmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbikge1xuICAgICAgICAgIHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QpIHtcbiAgICAgICAgICByZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5sYWJlbCkge1xuICAgICAgICAgIHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZSkge1xuICAgICAgICAgIHJlbGF0ZWQucGFnZV9zaXplID0gcmVsYXRlZE9iamVjdC5wYWdlX3NpemU7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXBMaXN0W3JlbGF0ZWQub2JqZWN0X25hbWVdID0gcmVsYXRlZDtcbiAgICB9KTtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKTtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgdW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdE9iamVjdHMsIGZ1bmN0aW9uKHYsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWY7XG4gICAgICBpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMTtcbiAgICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgICAgaWYgKGlzQWN0aXZlICYmIGFsbG93UmVhZCkge1xuICAgICAgICByZXR1cm4gbWFwTGlzdFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHY7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbGlzdCA9IFtdO1xuICAgIGlmIChfLmlzRW1wdHkocmVsYXRlZExpc3ROYW1lcykpIHtcbiAgICAgIGxpc3QgPSBfLnZhbHVlcyhtYXBMaXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKHJlbGF0ZWRMaXN0TmFtZXMsIGZ1bmN0aW9uKG9iamVjdE5hbWUpIHtcbiAgICAgICAgaWYgKG1hcExpc3Rbb2JqZWN0TmFtZV0pIHtcbiAgICAgICAgICByZXR1cm4gbGlzdC5wdXNoKG1hcExpc3Rbb2JqZWN0TmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpKSB7XG4gICAgICBsaXN0ID0gXy5maWx0ZXIobGlzdCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gXy5pbmNsdWRlKF9vYmplY3QuYWxsb3dfcmVsYXRlZExpc3QsIGl0ZW0ub2JqZWN0X25hbWUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsaXN0O1xuICB9O1xufVxuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpO1xufTtcblxuXG4vKiBcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpIHtcbiAgdmFyIGxpc3RWaWV3cywgbGlzdF92aWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIGlmICghKGxpc3RWaWV3cyAhPSBudWxsID8gbGlzdFZpZXdzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdF92aWV3ID0gXy5maW5kKGxpc3RWaWV3cywgZnVuY3Rpb24oaXRlbSkge1xuICAgIHJldHVybiBpdGVtLl9pZCA9PT0gbGlzdF92aWV3X2lkIHx8IGl0ZW0ubmFtZSA9PT0gbGlzdF92aWV3X2lkO1xuICB9KTtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICBpZiAoZXhhYykge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF07XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0X3ZpZXc7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3SXNSZWNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciBsaXN0Vmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgbGlzdF92aWV3X2lkID09PSBcInN0cmluZ1wiKSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3MsIHtcbiAgICAgIF9pZDogbGlzdF92aWV3X2lkXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWQ7XG4gIH1cbiAgcmV0dXJuIChsaXN0VmlldyAhPSBudWxsID8gbGlzdFZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcblx06KeE5YiZ77yaXG5cdDEu5LyY5YWI5oqKY29sdW1uc+S4reeahG5hbWXlrZfmrrXmjpLlnKjnrKzkuIDkuKpcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXG4gKi9cblxuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBjb3VudCwgZmllbGQsIGZpZWxkcywgZ2V0RmllbGQsIGlzTmFtZUNvbHVtbiwgaXRlbUNvdW50LCBtYXhDb3VudCwgbWF4Um93cywgbmFtZUNvbHVtbiwgbmFtZUtleSwgb2JqZWN0LCByZXN1bHQ7XG4gIHJlc3VsdCA9IFtdO1xuICBtYXhSb3dzID0gMjtcbiAgbWF4Q291bnQgPSBtYXhSb3dzICogMjtcbiAgY291bnQgPSAwO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IG9iamVjdC5maWVsZHM7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cbiAgbmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgaXNOYW1lQ29sdW1uID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gaXRlbS5maWVsZCA9PT0gbmFtZUtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZW0gPT09IG5hbWVLZXk7XG4gICAgfVxuICB9O1xuICBnZXRGaWVsZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtXTtcbiAgICB9XG4gIH07XG4gIGlmIChuYW1lS2V5KSB7XG4gICAgbmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZChmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pO1xuICAgIH0pO1xuICB9XG4gIGlmIChuYW1lQ29sdW1uKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKTtcbiAgICBpdGVtQ291bnQgPSBmaWVsZC5pc193aWRlID8gMiA6IDE7XG4gICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgIHJlc3VsdC5wdXNoKG5hbWVDb2x1bW4pO1xuICB9XG4gIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChpdGVtKTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBpZiAoY291bnQgPCBtYXhDb3VudCAmJiByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgJiYgIWlzTmFtZUNvbHVtbihpdGVtKSkge1xuICAgICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgICAgaWYgKGNvdW50IDw9IG1heENvdW50KSB7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKlxuICAgIOiOt+WPlum7mOiupOinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXcsIG9iamVjdCwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgfVxuICBpZiAob2JqZWN0ICE9IG51bGwgPyAocmVmID0gb2JqZWN0Lmxpc3Rfdmlld3MpICE9IG51bGwgPyByZWZbXCJkZWZhdWx0XCJdIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3c1tcImRlZmF1bHRcIl07XG4gIH0gZWxzZSB7XG4gICAgXy5lYWNoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0Lmxpc3Rfdmlld3MgOiB2b2lkIDAsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG4gICAgICBpZiAobGlzdF92aWV3Lm5hbWUgPT09IFwiYWxsXCIgfHwga2V5ID09PSBcImFsbFwiKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmlldyA9IGxpc3RfdmlldztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZpZXc7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICh1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwKSB7XG4gICAgICBjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChjb2x1bW5zKSB7XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2x1bW5zO1xufTtcblxuXG4vKlxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOesrOS4gOS4quinhuWbvuaYvuekuueahOWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICh1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwKSB7XG4gICAgICBjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChjb2x1bW5zKSB7XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2x1bW5zO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuZXh0cmFfY29sdW1ucyA6IHZvaWQgMDtcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgaWYgKGRlZmF1bHRWaWV3KSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3LnNvcnQpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0Vmlldy5zb3J0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXTtcbiAgICB9XG4gIH1cbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuICovXG5cbkNyZWF0b3IuaXNBbGxWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwiYWxsXCI7XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gZnVuY3Rpb24oc29ydCwgdGFidWxhckNvbHVtbnMpIHtcbiAgdmFyIHRhYnVsYXJfc29ydDtcbiAgdGFidWxhcl9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGNvbHVtbl9pbmRleCwgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgaWYgKGl0ZW0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBcImFzY1wiXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBvcmRlcl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhYnVsYXJfc29ydDtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBkeF9zb3J0O1xuICBkeF9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChbZmllbGRfbmFtZSwgb3JkZXJdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZHhfc29ydDtcbn07XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFx0X3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIn1cblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuXHRcdFx0cmVnRXg6IF9yZWdFeE1lc3NhZ2VzLFxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJylcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5zdGFydHVwICgpLT5cblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cblx0XHRfcmVnRXhNZXNzYWdlcy5wdXNoIHtleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwifVxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXG5cdFx0fSkiLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpO1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVnRXhNZXNzYWdlcztcbiAgICBfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW107XG4gICAgX3JlZ0V4TWVzc2FnZXMucHVzaCh7XG4gICAgICBleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIlxuICAgIH0pO1xuICAgIHJldHVybiBTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuICAgICAgcmVnRXg6IF9yZWdFeE1lc3NhZ2VzXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiLy8g5Zug5Li6bWV0ZW9y57yW6K+RY29mZmVlc2NyaXB05Lya5a+86Ie0ZXZhbOWHveaVsOaKpemUme+8jOaJgOS7peWNleeLrOWGmeWcqOS4gOS4qmpz5paH5Lu25Lit44CCXG5DcmVhdG9yLmV2YWxJbkNvbnRleHQgPSBmdW5jdGlvbihqcywgY29udGV4dCkge1xuICAgIC8vIyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgdGhlIGluLWxpbmUgYW5vbnltb3VzIGZ1bmN0aW9uIHdlIC5jYWxsIHdpdGggdGhlIHBhc3NlZCBjb250ZXh0XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyBcbiAgICBcdHJldHVybiBldmFsKGpzKTsgXG5cdH0uY2FsbChjb250ZXh0KTtcbn1cblxuXG5DcmVhdG9yLmV2YWwgPSBmdW5jdGlvbihqcyl7XG5cdHRyeXtcblx0XHRyZXR1cm4gZXZhbChqcylcblx0fWNhdGNoIChlKXtcblx0XHRjb25zb2xlLmVycm9yKGUsIGpzKTtcblx0fVxufTsiLCJcdGdldE9wdGlvbiA9IChvcHRpb24pLT5cblx0XHRmb28gPSBvcHRpb24uc3BsaXQoXCI6XCIpXG5cdFx0aWYgZm9vLmxlbmd0aCA+IDJcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1sxXSwgY29sb3I6IGZvb1syXX1cblx0XHRlbHNlIGlmIGZvby5sZW5ndGggPiAxXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV19XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzBdfVxuXG5cdGNvbnZlcnRGaWVsZCA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGQsIHNwYWNlSWQpLT5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgJiYgc3BhY2VJZCAmJiBmaWVsZC50eXBlID09ICdzZWxlY3QnXG5cdFx0XHRjb2RlID0gZmllbGQucGlja2xpc3QgfHwgXCIje29iamVjdF9uYW1lfS4je2ZpZWxkX25hbWV9XCI7XG5cdFx0XHRpZiBjb2RlXG5cdFx0XHRcdHBpY2tsaXN0ID0gQ3JlYXRvci5nZXRQaWNrbGlzdChjb2RlLCBzcGFjZUlkKTtcblx0XHRcdFx0aWYgcGlja2xpc3Rcblx0XHRcdFx0XHRvcHRpb25zID0gW107XG5cdFx0XHRcdFx0YWxsT3B0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KVxuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IF8uc29ydEJ5KHBpY2tsaXN0T3B0aW9ucywgJ3NvcnRfbm8nKT8ucmV2ZXJzZSgpO1xuXHRcdFx0XHRcdF8uZWFjaCBwaWNrbGlzdE9wdGlvbnMsIChpdGVtKS0+XG5cdFx0XHRcdFx0XHRsYWJlbCA9IGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBpdGVtLnZhbHVlIHx8IGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0YWxsT3B0aW9ucy5wdXNoKHtsYWJlbDogbGFiZWwsIHZhbHVlOiB2YWx1ZSwgZW5hYmxlOiBpdGVtLmVuYWJsZSwgY29sb3I6IGl0ZW0uY29sb3J9KVxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbmFibGVcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5wdXNoKHtsYWJlbDogbGFiZWwsIHZhbHVlOiB2YWx1ZSwgY29sb3I6IGl0ZW0uY29sb3J9KVxuXHRcdFx0XHRcdFx0aWYgaXRlbS5kZWZhdWx0XG5cdFx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gb3B0aW9uc1xuXHRcdFx0XHRcdGlmIGFsbE9wdGlvbnMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0ZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnNcblx0XHRyZXR1cm4gZmllbGQ7XG5cblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gKG9iamVjdCwgc3BhY2VJZCktPlxuXHRcdGlmICFvYmplY3Rcblx0XHRcdHJldHVyblxuXHRcdF8uZm9yRWFjaCBvYmplY3QudHJpZ2dlcnMsICh0cmlnZ2VyLCBrZXkpLT5cblxuXHRcdFx0aWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiKVxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyPy5fdG9kb1xuXHRcdFx0XHRfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcblx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2NvZGV9KVwiKVxuXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxuXHRcdFx0XHRcdCPlj6rmnIl1cGRhdGXml7bvvIwgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMg5omN5pyJ5YC8XG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YeP77yM5bCk5YW25pivQ29sbGVjdGlvblxuXHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXsje190b2RvX2Zyb21fZGJ9fSlcIilcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIlxuXHRcdFx0XHRfdG9kbyA9IHRyaWdnZXIudG9kb1xuXHRcdFx0XHRpZiBfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pXG5cdFx0XHRcdFx0dHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKClcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cblx0XHRcdFx0aWYgZmllbGQub21pdFxuXHRcdFx0XHRcdCMgb21pdOWtl+auteWujOWFqOmakOiXj+S4jeaYvuekulxuXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IHRydWVcblxuXHRcdFx0XHRpZiBmaWVsZC5yZXF1aXJlZCAmJiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRcdCMg6YCa55So5b+F5aGr5a2X5q61ICMyOTUy77yM5b+F5aGr5a2X5q616K6+572u5Li66Z2e5Y+q6K+7XG5cdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSBmYWxzZVxuXG5cdFx0XHRcdHN5c3RlbUJhc2VGaWVsZHMgPSBDcmVhdG9yLmdldFN5c3RlbUJhc2VGaWVsZHMoKVxuXHRcdFx0XHRpZiBzeXN0ZW1CYXNlRmllbGRzLmluZGV4T2Yoa2V5KSA+IC0xXG5cdFx0XHRcdFx0IyDlvLrliLbliJvlu7rkurrliJvlu7rml7bpl7TnrYnlrZfmrrXkuLrlj6ror7tcblx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5hY3Rpb25zLCAoYWN0aW9uLCBrZXkpLT5cblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uPy5fdG9kb1xuXHRcdFx0XHRfdG9kb19mcm9tX2RiID0gYWN0aW9uPy50b2RvXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZVxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYilcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbigpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yXG5cblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/Ll92aXNpYmxlXG5cdFx0XHRcdGlmIF92aXNpYmxlXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKF92aXNpYmxlKVxuXHRcdFx0XHRcdFx0XHRfdmlzaWJsZSA9IF92aXNpYmxlLnRyaW0oKVxuXHRcdFx0XHRcdFx0aWYgU3RlZWRvcy5pc0V4cHJlc3Npb24oX3Zpc2libGUpXG5cdFx0XHRcdFx0XHRcdCMg5pSv5oyB6aG16Z2i5biD5bGA5Lit5YaZdmlzaWJsZV9vbuWHveaVsOihqOi+vuW8j++8jOmhtemdouW4g+WxgOaMiemSrueahOaYvuekuuadoeS7tuS4jeeUn+aViCAjMzM0MFxuXHRcdFx0XHRcdFx0XHRhY3Rpb24udmlzaWJsZSA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfcGVybWlzc2lvbnMsIHJlY29yZCkgLT5cblx0XHRcdFx0XHRcdFx0XHRnbG9iYWxEYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgQ3JlYXRvci5VU0VSX0NPTlRFWFQsIHtub3c6IG5ldyBEYXRlKCl9KVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBTdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbihfdmlzaWJsZSwgcmVjb3JkLCBcIiNcIiwgZ2xvYmFsRGF0YSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0YWN0aW9uLnZpc2libGUgPSBDcmVhdG9yLmV2YWwoXCIoI3tfdmlzaWJsZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZVxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XG5cdFx0XHRcdF90b2RvID0gYWN0aW9uPy50b2RvXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHRhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpXG5cblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/LnZpc2libGVcblxuXHRcdFx0XHRpZiBfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpXG5cdFx0XHRcdFx0YWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKVxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cblx0XHRcdGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcblxuXHRcdFx0aWYgZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0XHQj5pSv5oyBXFxu5oiW6ICF6Iux5paH6YCX5Y+35YiG5YmyLFxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBvcHRpb24uaW5kZXhPZihcIixcIilcblx0XHRcdFx0XHRcdFx0b3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIilcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdFx0I+aUr+aMgeaVsOe7hOS4reebtOaOpeWumuS5ieavj+S4qumAiemhueeahOeugOeJiOagvOW8j+Wtl+espuS4slxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKG9wdGlvbilcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChvcHRpb24pXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0Xy5lYWNoIGZpZWxkLm9wdGlvbnMsICh2LCBrKS0+XG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IHYsIHZhbHVlOiBrfVxuXHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLl9vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnN9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLnJlZ0V4XG5cdFx0XHRcdGlmIHJlZ0V4XG5cdFx0XHRcdFx0ZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLl9yZWdFeFxuXHRcdFx0XHRpZiByZWdFeFxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQucmVnRXggPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWdFeH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG1pbiA9IGZpZWxkLm1pblxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWluKVxuXHRcdFx0XHRcdGZpZWxkLl9taW4gPSBtaW4udG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtaW4gPSBmaWVsZC5fbWluXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWluKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQubWluID0gQ3JlYXRvci5ldmFsKFwiKCN7bWlufSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0bWF4ID0gZmllbGQubWF4XG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtYXgpXG5cdFx0XHRcdFx0ZmllbGQuX21heCA9IG1heC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG1heCA9IGZpZWxkLl9tYXhcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtYXgpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5tYXggPSBDcmVhdG9yLmV2YWwoXCIoI3ttYXh9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxuXHRcdFx0XHRcdF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT0gT2JqZWN0ICYmIF90eXBlICE9IFN0cmluZyAmJiBfdHlwZSAhPSBOdW1iZXIgJiYgX3R5cGUgIT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKVxuXHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNTdHJpbmcoX3R5cGUpXG5cdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3IuZXZhbChcIigje190eXBlfSlcIilcblx0XHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0ZmllbGQuX3JlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90by50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKClcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQuX3JlZmVyZW5jZV90b1xuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gfHwgZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnNGdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3IuZXZhbChcIigje3JlZmVyZW5jZV90b30pXCIpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2NyZWF0ZUZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7YmVmb3JlT3BlbkZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyc0Z1bmN0aW9ufSlcIilcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHRmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZVxuXG5cdFx0XHRcdGlmICFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tkZWZhdWx0VmFsdWV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cdFx0XHRcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNGdW5jdGlvbihpc19jb21wYW55X2xpbWl0ZWQpXG5cdFx0XHRcdFx0ZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvci5ldmFsKFwiKCN7aXNfY29tcGFueV9saW1pdGVkfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpIC0+XG5cdFx0XHQjIyNcblx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcblx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcblx0XHRcdOWmgu+8mlxuXHRcdFx0ZmlsdGVyczogKCktPlxuXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG5cdFx0XHTlpoLvvJpcblx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHRdXVxuXHRcdFx05oiWXG5cdFx0XHRmaWx0ZXJzOiBbe1xuXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxuXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cblx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHR9XVxuXHRcdFx0IyMjXG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKClcblx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvci5ldmFsKFwiKCN7bGlzdF92aWV3Ll9maWx0ZXJzfSlcIilcblx0XHRcdGVsc2Vcblx0XHRcdFx0Xy5mb3JFYWNoIGxpc3Rfdmlldy5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cblx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoZmlsdGVyKVxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0RhdGUoZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5pivRGF0Zeexu+Wei++8jOWImWZpbHRlclsyXeWAvOWIsOWJjeerr+S8muiHquWKqOi9rOaIkOWtl+espuS4su+8jOagvOW8j++8mlwiMjAxOC0wMy0yOVQwMzo0MzoyMS43ODdaXCJcblx0XHRcdFx0XHRcdFx0XHQjIOWMheaLrGdyaWTliJfooajor7fmsYLnmoTmjqXlj6PlnKjlhoXnmoTmiYDmnIlPRGF0YeaOpeWPo++8jERhdGXnsbvlnovlrZfmrrXpg73kvJrku6XkuIrov7DmoLzlvI/ov5Tlm55cblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkRBVEVcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlclsyXX0pXCIpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJEQVRFXCJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGZpbHRlcilcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRGF0ZShmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5faXNfZGF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIuX2lzX2RhdGUgPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSlcblxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0aWYgb2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkgb2JqZWN0LmZvcm0sIChrZXksIHZhbCktPlxuXHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbih2YWwpXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsICsgJyc7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRlbHNlIGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgb2JqZWN0LmZvcm1cblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlIG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cblx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJylcblx0XHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZF9saXN0cywgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkX2xpc3RzLCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKVxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKClcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXG5cblx0XHRyZXR1cm4gb2JqZWN0XG5cblxuIiwidmFyIGNvbnZlcnRGaWVsZCwgZ2V0T3B0aW9uO1xuXG5nZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdmFyIGZvbztcbiAgZm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKTtcbiAgaWYgKGZvby5sZW5ndGggPiAyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdLFxuICAgICAgY29sb3I6IGZvb1syXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZm9vLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1swXVxuICAgIH07XG4gIH1cbn07XG5cbmNvbnZlcnRGaWVsZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCkge1xuICB2YXIgYWxsT3B0aW9ucywgY29kZSwgb3B0aW9ucywgcGlja2xpc3QsIHBpY2tsaXN0T3B0aW9ucywgcmVmO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICBjb2RlID0gZmllbGQucGlja2xpc3QgfHwgKG9iamVjdF9uYW1lICsgXCIuXCIgKyBmaWVsZF9uYW1lKTtcbiAgICBpZiAoY29kZSkge1xuICAgICAgcGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuICAgICAgaWYgKHBpY2tsaXN0KSB7XG4gICAgICAgIG9wdGlvbnMgPSBbXTtcbiAgICAgICAgYWxsT3B0aW9ucyA9IFtdO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdCk7XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IChyZWYgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJykpICE9IG51bGwgPyByZWYucmV2ZXJzZSgpIDogdm9pZCAwO1xuICAgICAgICBfLmVhY2gocGlja2xpc3RPcHRpb25zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIGxhYmVsLCB2YWx1ZTtcbiAgICAgICAgICBsYWJlbCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lO1xuICAgICAgICAgIGFsbE9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbmFibGU6IGl0ZW0uZW5hYmxlLFxuICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXRlbS5lbmFibGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtW1wiZGVmYXVsdFwiXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0LCBzcGFjZUlkKSB7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIGtleSkge1xuICAgIHZhciBfdG9kbywgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiO1xuICAgIGlmICgoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikpIHtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXIgIT0gbnVsbCA/IHRyaWdnZXIuX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSB7XG4gICAgICBfdG9kbyA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICAgIHZhciBzeXN0ZW1CYXNlRmllbGRzO1xuICAgICAgaWYgKGZpZWxkLm9taXQpIHtcbiAgICAgICAgZmllbGQuaGlkZGVuID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWVsZC5yZXF1aXJlZCAmJiBmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmaWVsZC5yZWFkb25seSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgc3lzdGVtQmFzZUZpZWxkcyA9IENyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcygpO1xuICAgICAgaWYgKHN5c3RlbUJhc2VGaWVsZHMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiLCBfdmlzaWJsZSwgZXJyb3I7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKSkge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKCl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl92aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF8uaXNTdHJpbmcoX3Zpc2libGUpKSB7XG4gICAgICAgICAgICBfdmlzaWJsZSA9IF92aXNpYmxlLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNFeHByZXNzaW9uKF92aXNpYmxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zLCByZWNvcmQpIHtcbiAgICAgICAgICAgICAgdmFyIGdsb2JhbERhdGE7XG4gICAgICAgICAgICAgIGdsb2JhbERhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBDcmVhdG9yLlVTRVJfQ09OVEVYVCwge1xuICAgICAgICAgICAgICAgIG5vdzogbmV3IERhdGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIFN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uKF92aXNpYmxlLCByZWNvcmQsIFwiI1wiLCBnbG9iYWxEYXRhKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3Zpc2libGUgKyBcIilcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kbywgX3Zpc2libGU7XG4gICAgICBfdG9kbyA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICBhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi52aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSkpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICB2YXIgX29wdGlvbnMsIF90eXBlLCBiZWZvcmVPcGVuRnVuY3Rpb24sIGNyZWF0ZUZ1bmN0aW9uLCBkZWZhdWx0VmFsdWUsIGVycm9yLCBmaWx0ZXJzRnVuY3Rpb24sIGlzX2NvbXBhbnlfbGltaXRlZCwgbWF4LCBtaW4sIG9wdGlvbnMsIG9wdGlvbnNGdW5jdGlvbiwgcmVmZXJlbmNlX3RvLCByZWdFeDtcbiAgICBmaWVsZCA9IGNvbnZlcnRGaWVsZChvYmplY3QubmFtZSwga2V5LCBmaWVsZCwgc3BhY2VJZCk7XG4gICAgaWYgKGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMuc3BsaXQoXCJcXG5cIiksIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIHZhciBvcHRpb25zO1xuICAgICAgICAgIGlmIChvcHRpb24uaW5kZXhPZihcIixcIikpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihfb3B0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICBpZiAoXy5pc1N0cmluZyhvcHRpb24pKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgXy5lYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiB2LFxuICAgICAgICAgIHZhbHVlOiBrXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgaWYgKG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0gZmllbGQuX29wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9ucyArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVnRXggPSBmaWVsZC5fcmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5yZWdFeCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVnRXggKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtaW4gPSBmaWVsZC5taW47XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1pbikpIHtcbiAgICAgICAgZmllbGQuX21pbiA9IG1pbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtaW4gPSBmaWVsZC5fbWluO1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWluKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1pbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWluICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgbWF4ID0gZmllbGQubWF4O1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihtYXgpKSB7XG4gICAgICAgIGZpZWxkLl9tYXggPSBtYXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWF4ID0gZmllbGQuX21heDtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG1heCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5tYXggPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG1heCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9PSBPYmplY3QgJiYgX3R5cGUgIT09IFN0cmluZyAmJiBfdHlwZSAhPT0gTnVtYmVyICYmIF90eXBlICE9PSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpKSB7XG4gICAgICAgICAgZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlO1xuICAgICAgICBpZiAoX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSkpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3R5cGUgKyBcIilcIik7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgIGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb247XG4gICAgICBiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiB8fCBmaWVsZC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICBpZiAob3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG9wdGlvbnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVmZXJlbmNlX3RvICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBjcmVhdGVGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgYmVmb3JlT3BlbkZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJzRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKCFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGRlZmF1bHRWYWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc1N0cmluZyhpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgaXNfY29tcGFueV9saW1pdGVkICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgXy5mb3JFYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuXG4gICAgLypcbiAgICBcdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcbiAgICBcdFx0XHTorqnov4fomZHlmajmlK/mjIHkuKTnp41mdW5jdGlvbuaWueW8j++8mlxuICAgIFx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuICAgIFx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdF1dXG4gICAgXHRcdFx05oiWXG4gICAgXHRcdFx0ZmlsdGVyczogW3tcbiAgICBcdFx0XHRcdFwiZmllbGRcIjogXCJvYmplY3RfbmFtZVwiXG4gICAgXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuICAgIFx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XG4gICAgXHRcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHR9XVxuICAgICAqL1xuICAgIGlmIChfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbGlzdF92aWV3Ll9maWx0ZXJzICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXy5mb3JFYWNoKGxpc3Rfdmlldy5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRGF0ZShmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkRBVEVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJGVU5DVElPTlwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyWzJdICsgXCIpXCIpO1xuICAgICAgICAgICAgICBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkRBVEVcIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRGF0ZShmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5faXNfZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLl9pc19kYXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXIudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmIChvYmplY3QuZm9ybSAmJiAhXy5pc1N0cmluZyhvYmplY3QuZm9ybSkpIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgIHJldHVybiB2YWwgKyAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdC5mb3JtKSB7XG4gICAgICBvYmplY3QuZm9ybSA9IEpTT04ucGFyc2Uob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRfbGlzdHMsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJmaWx0ZXJzX2NvZGVcIiwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZF9saXN0cywgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZmlsdGVyc19jb2RlXCIsIHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge31cblxuQ3JlYXRvci5Gb3JtdWxhci5QUkVGSVggPSBcIl9WQUxVRVNcIlxuXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IChwcmVmaXgsZmllbGRWYXJpYWJsZSktPlxuXHRyZWcgPSAvKFxce1tee31dKlxcfSkvZztcblxuXHRyZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UgcmVnLCAobSwgJDEpLT5cblx0XHRyZXR1cm4gcHJlZml4ICsgJDEucmVwbGFjZSgvXFx7XFxzKi8sXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LyxcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csXCJcXFwiXVtcXFwiXCIpO1xuXG5cdHJldHVybiByZXZcblxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSAoZm9ybXVsYV9zdHIpLT5cblx0aWYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbkNyZWF0b3IuRm9ybXVsYXIucnVuID0gKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucyktPlxuXHRpZiBmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKVxuXG5cdFx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnM/LmV4dGVuZClcblx0XHRcdGV4dGVuZCA9IHRydWVcblxuXHRcdF9WQUxVRVMgPSB7fVxuXHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVClcblx0XHRpZiBleHRlbmRcblx0XHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnM/LnVzZXJJZCwgb3B0aW9ucz8uc3BhY2VJZCkpXG5cdFx0Zm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpXG5cblx0XHR0cnlcblx0XHRcdGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpICAgIyDmraTlpITkuI3og73nlKh3aW5kb3cuZXZhbCDvvIzkvJrlr7zoh7Tlj5jph4/kvZznlKjln5/lvILluLhcblx0XHRcdHJldHVybiBkYXRhXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfVwiLCBlKVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdHRvYXN0cj8uZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIilcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfSN7ZX1cIlxuXG5cdHJldHVybiBmb3JtdWxhX3N0clxuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9O1xuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiO1xuXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IGZ1bmN0aW9uKHByZWZpeCwgZmllbGRWYXJpYWJsZSkge1xuICB2YXIgcmVnLCByZXY7XG4gIHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuICByZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UocmVnLCBmdW5jdGlvbihtLCAkMSkge1xuICAgIHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLywgXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LywgXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLCBcIlxcXCJdW1xcXCJcIik7XG4gIH0pO1xuICByZXR1cm4gcmV2O1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhX3N0cikge1xuICBpZiAoXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSBmdW5jdGlvbihmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpIHtcbiAgdmFyIF9WQUxVRVMsIGRhdGEsIGUsIGV4dGVuZDtcbiAgaWYgKGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpKSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmV4dGVuZCA6IHZvaWQgMCkpIHtcbiAgICAgIGV4dGVuZCA9IHRydWU7XG4gICAgfVxuICAgIF9WQUxVRVMgPSB7fTtcbiAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpO1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMudXNlcklkIDogdm9pZCAwLCBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNwYWNlSWQgOiB2b2lkIDApKTtcbiAgICB9XG4gICAgZm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpO1xuICAgIHRyeSB7XG4gICAgICBkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIsIGUpO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIHRvYXN0ciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0b2FzdHIgIT09IG51bGwpIHtcbiAgICAgICAgICB0b2FzdHIuZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyICsgZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmb3JtdWxhX3N0cjtcbn07XG4iLCJjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fSAgICMg5q2k5a+56LGh5Y+q6IO95Zyo56Gu5L+d5omA5pyJT2JqZWN05Yid5aeL5YyW5a6M5oiQ5ZCO6LCD55So77yMIOWQpuWImeiOt+WPluWIsOeahG9iamVjdOS4jeWFqFxuXG5DcmVhdG9yLmZvcm1hdE9iamVjdE5hbWUgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpXG5cdFx0b2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwuJywgJ2cnKSwgJ18nKVxuXHRyZXR1cm4gb2JqZWN0X25hbWVcblxuQ3JlYXRvci5PYmplY3QgPSAob3B0aW9ucyktPlxuXHRfYmFzZU9iamVjdCA9IENyZWF0b3IuYmFzZU9iamVjdFxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRfYmFzZU9iamVjdCA9IHthY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyAsIGZpZWxkczoge30sIHRyaWdnZXJzOiB7fSwgcGVybWlzc2lvbl9zZXQ6IHt9fVxuXHRzZWxmID0gdGhpc1xuXHRpZiAoIW9wdGlvbnMubmFtZSlcblx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG5cblx0c2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWVcblx0c2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2Vcblx0c2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lXG5cdHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsXG5cdHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvblxuXHRzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvblxuXHRzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXdcblx0c2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtXG5cdHNlbGYucmVsYXRlZExpc3QgPSBvcHRpb25zLnJlbGF0ZWRMaXN0XG5cdHNlbGYucmVsYXRlZF9saXN0cyA9IG9wdGlvbnMucmVsYXRlZF9saXN0c1xuXHRzZWxmLmhhc0ltcG9ydFRlbXBsYXRlcyA9IG9wdGlvbnMuaGFzSW1wb3J0VGVtcGxhdGVzXG5cdHNlbGYudmVyc2lvbiA9IG9wdGlvbnMudmVyc2lvbiB8fCAxLjBcblx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSAgfHwgb3B0aW9ucy5pc19lbmFibGUgPT0gdHJ1ZVxuXHRcdHNlbGYuaXNfZW5hYmxlID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5pc19lbmFibGUgPSBmYWxzZVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpXG5cdFx0XHRzZWxmLmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvcHRpb25zLmFsbG93X2N1c3RvbUFjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnZXhjbHVkZV9hY3Rpb25zJylcblx0XHRcdHNlbGYuZXhjbHVkZV9hY3Rpb25zID0gb3B0aW9ucy5leGNsdWRlX2FjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKVxuXHRcdFx0c2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3Rcblx0c2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoXG5cdHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXNcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xuXHRzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzXG5cdHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXRcblx0c2VsZi5lbmFibGVfZXZlbnRzID0gb3B0aW9ucy5lbmFibGVfZXZlbnRzXG5cdGlmIG9wdGlvbnMucGFnaW5nXG5cdFx0c2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZ1xuXHRzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuXG5cdHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT0gdW5kZWZpbmVkKSBvciBvcHRpb25zLmVuYWJsZV9hcGlcblx0c2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbVxuXHRzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlXG5cdHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlc1xuXHRzZWxmLmVuYWJsZV9wcm9jZXNzID0gb3B0aW9ucy5lbmFibGVfcHJvY2Vzc1xuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXG5cdFx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcblx0ZWxzZVxuXHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxuXHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXG5cdHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93XG5cdHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55XG5cdHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpXG5cdHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyXG5cdHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2hcblx0c2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsXG5cdHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFsc1xuXHRzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3dcblx0c2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvd1xuXHRzZWxmLmVuYWJsZV9pbmxpbmVfZWRpdCA9IG9wdGlvbnMuZW5hYmxlX2lubGluZV9lZGl0XG5cdHNlbGYuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlsc1xuXHRzZWxmLm1hc3RlcnMgPSBvcHRpb25zLm1hc3RlcnNcblx0c2VsZi5sb29rdXBfZGV0YWlscyA9IG9wdGlvbnMubG9va3VwX2RldGFpbHNcblx0aWYgXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50Jylcblx0XHRzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudFxuXHRzZWxmLmlkRmllbGROYW1lID0gJ19pZCdcblx0aWYgb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdFx0c2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdGlmICghb3B0aW9ucy5maWVsZHMpXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XG5cblx0c2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcylcblxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmIGZpZWxkLmlzX25hbWVcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXG5cdFx0ZWxzZSBpZiBmaWVsZF9uYW1lID09ICduYW1lJyAmJiAhc2VsZi5OQU1FX0ZJRUxEX0tFWVxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcblx0XHRpZiBmaWVsZC5wcmltYXJ5XG5cdFx0XHRzZWxmLmlkRmllbGROYW1lID0gZmllbGRfbmFtZVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXG5cdFx0XHRcdGlmIGZpZWxkX25hbWUgPT0gJ3NwYWNlJ1xuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gZmFsc2VcblxuXHRpZiAhb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xuXHRcdF8uZWFjaCBfYmFzZU9iamVjdC5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgIXNlbGYuZmllbGRzW2ZpZWxkX25hbWVdXG5cdFx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge31cblx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKVxuXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc3VtbWFyeSdcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdHNlbGYubGlzdF92aWV3cyA9IHt9XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpXG5cdF8uZWFjaCBvcHRpb25zLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRWaWV3LCBpdGVtLCBpdGVtX25hbWUpXG5cdFx0c2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbVxuXG5cdHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKVxuXHRfLmVhY2ggb3B0aW9ucy50cmlnZ2VycywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWVcblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pXG5cblx0c2VsZi5hY3Rpb25zID0gXy5jbG9uZShfYmFzZU9iamVjdC5hY3Rpb25zKVxuXHRfLmVhY2ggb3B0aW9ucy5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdXG5cdFx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0Y29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKVxuXHRcdGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSAj5YWI5Yig6Zmk55u45YWz5bGe5oCn5YaN6YeN5bu65omN6IO95L+d6K+B5ZCO57ut6YeN5aSN5a6a5LmJ55qE5bGe5oCn6aG65bqP55Sf5pWIXG5cdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSlcblx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXS5vYmplY3RfbmFtZSA9IHNlbGYubmFtZVxuXG5cdF8uZWFjaCBzZWxmLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpdGVtLm5hbWUgPSBpdGVtX25hbWVcblxuXHRzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKVxuXG5cdCMg6K6p5omA5pyJb2JqZWN06buY6K6k5pyJ5omA5pyJbGlzdF92aWV3cy9hY3Rpb25zL3JlbGF0ZWRfb2JqZWN0cy9yZWFkYWJsZV9maWVsZHMvZWRpdGFibGVfZmllbGRz5a6M5pW05p2D6ZmQ77yM6K+l5p2D6ZmQ5Y+v6IO96KKr5pWw5o2u5bqT5Lit6K6+572u55qEYWRtaW4vdXNlcuadg+mZkOimhuebllxuXHRzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldClcblx0IyBkZWZhdWx0TGlzdFZpZXdzID0gXy5rZXlzKHNlbGYubGlzdF92aWV3cylcblx0IyBkZWZhdWx0QWN0aW9ucyA9IF8ua2V5cyhzZWxmLmFjdGlvbnMpXG5cdCMgZGVmYXVsdFJlbGF0ZWRPYmplY3RzID0gXy5wbHVjayhzZWxmLnJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXG5cdCMgZGVmYXVsdFJlYWRhYmxlRmllbGRzID0gW11cblx0IyBkZWZhdWx0RWRpdGFibGVGaWVsZHMgPSBbXVxuXHQjIF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdCMgXHRpZiAhKGZpZWxkLmhpZGRlbikgICAgIzIzMSBvbWl05a2X5q615pSv5oyB5Zyo6Z2e57yW6L6R6aG16Z2i5p+l55yLLCDlm6DmraTliKDpmaTkuobmraTlpITlr7lvbWl055qE5Yik5patXG5cdCMgXHRcdGRlZmF1bHRSZWFkYWJsZUZpZWxkcy5wdXNoIGZpZWxkX25hbWVcblx0IyBcdFx0aWYgIWZpZWxkLnJlYWRvbmx5XG5cdCMgXHRcdFx0ZGVmYXVsdEVkaXRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxuXG5cdCMgXy5lYWNoIHNlbGYucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0IyBcdGlmIGl0ZW1fbmFtZSA9PSBcIm5vbmVcIlxuXHQjIFx0XHRyZXR1cm5cblx0IyBcdGlmIHNlbGYubGlzdF92aWV3c1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ubGlzdF92aWV3cyA9IGRlZmF1bHRMaXN0Vmlld3Ncblx0IyBcdGlmIHNlbGYuYWN0aW9uc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uYWN0aW9ucyA9IGRlZmF1bHRBY3Rpb25zXG5cdCMgXHRpZiBzZWxmLnJlbGF0ZWRfb2JqZWN0c1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVsYXRlZF9vYmplY3RzID0gZGVmYXVsdFJlbGF0ZWRPYmplY3RzXG5cdCMgXHRpZiBzZWxmLmZpZWxkc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVhZGFibGVfZmllbGRzID0gZGVmYXVsdFJlYWRhYmxlRmllbGRzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5lZGl0YWJsZV9maWVsZHMgPSBkZWZhdWx0RWRpdGFibGVGaWVsZHNcblx0dW5sZXNzIG9wdGlvbnMucGVybWlzc2lvbl9zZXRcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge31cblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py5hZG1pbilcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pXG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8udXNlcilcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKVxuXHRfLmVhY2ggb3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9XG5cdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKVxuXG5cdCMg5YmN56uv5qC55o2ucGVybWlzc2lvbnPmlLnlhplmaWVsZOebuOWFs+WxnuaAp++8jOWQjuerr+WPquimgei1sOm7mOiupOWxnuaAp+WwseihjO+8jOS4jemcgOimgeaUueWGmVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnNcblx0XHRkaXNhYmxlZF9saXN0X3ZpZXdzID0gcGVybWlzc2lvbnM/LmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRpZiBkaXNhYmxlZF9saXN0X3ZpZXdzPy5sZW5ndGhcblx0XHRcdGRlZmF1bHRMaXN0Vmlld0lkID0gb3B0aW9ucy5saXN0X3ZpZXdzPy5hbGw/Ll9pZFxuXHRcdFx0aWYgZGVmYXVsdExpc3RWaWV3SWRcblx0XHRcdFx0IyDmiorop4blm77mnYPpmZDphY3nva7kuK3pu5jorqTnmoRhbGzop4blm75pZOi9rOaNouaIkGFsbOWFs+mUruWtl1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAgZGlzYWJsZWRfbGlzdF92aWV3cywgKGxpc3Rfdmlld19pdGVtKSAtPlxuXHRcdFx0XHRcdHJldHVybiBpZiBkZWZhdWx0TGlzdFZpZXdJZCA9PSBsaXN0X3ZpZXdfaXRlbSB0aGVuIFwiYWxsXCIgZWxzZSBsaXN0X3ZpZXdfaXRlbVxuXHRcdHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpXG4jXHRcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG4jXHRcdFx0aWYgZmllbGRcbiNcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5yZWFkYWJsZV9maWVsZHMsIGZpZWxkX25hbWUpIDwgMFxuI1x0XHRcdFx0XHRpZiBmaWVsZC5oaWRkZW5cbiNcdFx0XHRcdFx0XHRyZXR1cm5cbiNcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bmVkaXRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPiAtMVxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuI1x0XHRcdFx0XHRcdGZpZWxkLmRpc2FibGVkID0gdHJ1ZVxuI1x0XHRcdFx0XHRcdCMg5b2T5Y+q6K+75pe277yM5aaC5p6c5LiN5Y675o6J5b+F5aGr5a2X5q6177yMYXV0b2Zvcm3mmK/kvJrmiqXplJnnmoRcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZXF1aXJlZCA9IGZhbHNlXG4jXHRcdFx0XHRlbHNlXG4jXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IHRydWVcblx0ZWxzZVxuXHRcdHNlbGYucGVybWlzc2lvbnMgPSBudWxsXG5cblx0X2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpXG5cblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiXG5cblx0c2VsZi5kYiA9IF9kYlxuXG5cdHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZVxuXG5cdHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpXG5cdHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpXG5cdGlmIHNlbGYubmFtZSAhPSBcInVzZXJzXCIgYW5kIHNlbGYubmFtZSAhPSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiLCBcImFjdGlvbl9maWVsZF91cGRhdGVzXCIsIFwib2JqZWN0X2xpc3R2aWV3c1wiXSwgc2VsZi5uYW1lKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXHRcdGVsc2Vcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblx0aWYgc2VsZi5uYW1lID09IFwidXNlcnNcIlxuXHRcdF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWFcblxuXHRpZiBfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cblx0Q3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmXG5cblx0cmV0dXJuIHNlbGZcblxuIyBDcmVhdG9yLk9iamVjdC5wcm90b3R5cGUuaTE4biA9ICgpLT5cbiMgXHQjIHNldCBvYmplY3QgbGFiZWxcbiMgXHRzZWxmID0gdGhpc1xuXG4jIFx0a2V5ID0gc2VsZi5uYW1lXG4jIFx0aWYgdChrZXkpID09IGtleVxuIyBcdFx0aWYgIXNlbGYubGFiZWxcbiMgXHRcdFx0c2VsZi5sYWJlbCA9IHNlbGYubmFtZVxuIyBcdGVsc2VcbiMgXHRcdHNlbGYubGFiZWwgPSB0KGtleSlcblxuIyBcdCMgc2V0IGZpZWxkIGxhYmVsc1xuIyBcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG4jIFx0XHRma2V5ID0gc2VsZi5uYW1lICsgXCJfXCIgKyBmaWVsZF9uYW1lXG4jIFx0XHRpZiB0KGZrZXkpID09IGZrZXlcbiMgXHRcdFx0aWYgIWZpZWxkLmxhYmVsXG4jIFx0XHRcdFx0ZmllbGQubGFiZWwgPSBmaWVsZF9uYW1lXG4jIFx0XHRlbHNlXG4jIFx0XHRcdGZpZWxkLmxhYmVsID0gdChma2V5KVxuIyBcdFx0c2VsZi5zY2hlbWE/Ll9zY2hlbWE/W2ZpZWxkX25hbWVdPy5sYWJlbCA9IGZpZWxkLmxhYmVsXG5cblxuIyBcdCMgc2V0IGxpc3R2aWV3IGxhYmVsc1xuIyBcdF8uZWFjaCBzZWxmLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cbiMgXHRcdGkxOG5fa2V5ID0gc2VsZi5uYW1lICsgXCJfbGlzdHZpZXdfXCIgKyBpdGVtX25hbWVcbiMgXHRcdGlmIHQoaTE4bl9rZXkpID09IGkxOG5fa2V5XG4jIFx0XHRcdGlmICFpdGVtLmxhYmVsXG4jIFx0XHRcdFx0aXRlbS5sYWJlbCA9IGl0ZW1fbmFtZVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHRpdGVtLmxhYmVsID0gdChpMThuX2tleSlcblxuXG5DcmVhdG9yLmdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4ID0gKG9iamVjdCktPlxuXHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcblx0IyBpZiBvYmplY3Rcblx0IyBcdGlmICFvYmplY3QuZGF0YWJhc2VfbmFtZSB8fCBvYmplY3QuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xuXHQjIFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcblx0IyBcdGVsc2Vcblx0IyBcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS8je29iamVjdC5kYXRhYmFzZV9uYW1lfVwiXG5cbiMgaWYgTWV0ZW9yLmlzQ2xpZW50XG5cbiMgXHRNZXRlb3Iuc3RhcnR1cCAtPlxuIyBcdFx0VHJhY2tlci5hdXRvcnVuIC0+XG4jIFx0XHRcdGlmIFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgJiYgQ3JlYXRvci5ib290c3RyYXBMb2FkZWQ/LmdldCgpXG4jIFx0XHRcdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cbiMgXHRcdFx0XHRcdG9iamVjdC5pMThuKClcblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0aWYgIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkICYmIENyZWF0b3IuT2JqZWN0c1xuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChvYmplY3QpLT5cblx0XHRcdG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpXG5cbiIsInZhciBjbG9uZTtcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fTtcblxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgaWYgKG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJyk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdF9uYW1lO1xufTtcblxuQ3JlYXRvci5PYmplY3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHZhciBfYmFzZU9iamVjdCwgX2RiLCBkZWZhdWx0TGlzdFZpZXdJZCwgZGVmYXVsdFZpZXcsIGRpc2FibGVkX2xpc3Rfdmlld3MsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNjaGVtYSwgc2VsZjtcbiAgX2Jhc2VPYmplY3QgPSBDcmVhdG9yLmJhc2VPYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfYmFzZU9iamVjdCA9IHtcbiAgICAgIGFjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zLFxuICAgICAgZmllbGRzOiB7fSxcbiAgICAgIHRyaWdnZXJzOiB7fSxcbiAgICAgIHBlcm1pc3Npb25fc2V0OiB7fVxuICAgIH07XG4gIH1cbiAgc2VsZiA9IHRoaXM7XG4gIGlmICghb3B0aW9ucy5uYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcbiAgfVxuICBzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gIHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWw7XG4gIHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvbjtcbiAgc2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb247XG4gIHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlldztcbiAgc2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtO1xuICBzZWxmLnJlbGF0ZWRMaXN0ID0gb3B0aW9ucy5yZWxhdGVkTGlzdDtcbiAgc2VsZi5yZWxhdGVkX2xpc3RzID0gb3B0aW9ucy5yZWxhdGVkX2xpc3RzO1xuICBzZWxmLmhhc0ltcG9ydFRlbXBsYXRlcyA9IG9wdGlvbnMuaGFzSW1wb3J0VGVtcGxhdGVzO1xuICBzZWxmLnZlcnNpb24gPSBvcHRpb25zLnZlcnNpb24gfHwgMS4wO1xuICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSB8fCBvcHRpb25zLmlzX2VuYWJsZSA9PT0gdHJ1ZSkge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IGZhbHNlO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKSkge1xuICAgICAgc2VsZi5hbGxvd19jdXN0b21BY3Rpb25zID0gb3B0aW9ucy5hbGxvd19jdXN0b21BY3Rpb25zO1xuICAgIH1cbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2V4Y2x1ZGVfYWN0aW9ucycpKSB7XG4gICAgICBzZWxmLmV4Y2x1ZGVfYWN0aW9ucyA9IG9wdGlvbnMuZXhjbHVkZV9hY3Rpb25zO1xuICAgIH1cbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2FsbG93X3JlbGF0ZWRMaXN0JykpIHtcbiAgICAgIHNlbGYuYWxsb3dfcmVsYXRlZExpc3QgPSBvcHRpb25zLmFsbG93X3JlbGF0ZWRMaXN0O1xuICAgIH1cbiAgfVxuICBzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2g7XG4gIHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXM7XG4gIHNlbGYuZW5hYmxlX3Rhc2tzID0gb3B0aW9ucy5lbmFibGVfdGFza3M7XG4gIHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXM7XG4gIHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXQ7XG4gIHNlbGYuZW5hYmxlX2V2ZW50cyA9IG9wdGlvbnMuZW5hYmxlX2V2ZW50cztcbiAgaWYgKG9wdGlvbnMucGFnaW5nKSB7XG4gICAgc2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZztcbiAgfVxuICBzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuO1xuICBzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09PSB2b2lkIDApIHx8IG9wdGlvbnMuZW5hYmxlX2FwaTtcbiAgc2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbTtcbiAgc2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZTtcbiAgc2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzO1xuICBzZWxmLmVuYWJsZV9wcm9jZXNzID0gb3B0aW9ucy5lbmFibGVfcHJvY2VzcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gICAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgfVxuICBzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvdztcbiAgc2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnk7XG4gIHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpO1xuICBzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlcjtcbiAgc2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaDtcbiAgc2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsO1xuICBzZWxmLmVuYWJsZV9hcHByb3ZhbHMgPSBvcHRpb25zLmVuYWJsZV9hcHByb3ZhbHM7XG4gIHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvdztcbiAgc2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvdztcbiAgc2VsZi5lbmFibGVfaW5saW5lX2VkaXQgPSBvcHRpb25zLmVuYWJsZV9pbmxpbmVfZWRpdDtcbiAgc2VsZi5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzO1xuICBzZWxmLm1hc3RlcnMgPSBvcHRpb25zLm1hc3RlcnM7XG4gIHNlbGYubG9va3VwX2RldGFpbHMgPSBvcHRpb25zLmxvb2t1cF9kZXRhaWxzO1xuICBpZiAoXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50JykpIHtcbiAgICBzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudDtcbiAgfVxuICBzZWxmLmlkRmllbGROYW1lID0gJ19pZCc7XG4gIGlmIChvcHRpb25zLmRhdGFiYXNlX25hbWUpIHtcbiAgICBzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWU7XG4gIH1cbiAgaWYgKCFvcHRpb25zLmZpZWxkcykge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBmaWVsZHMnKTtcbiAgfVxuICBzZWxmLmZpZWxkcyA9IGNsb25lKG9wdGlvbnMuZmllbGRzKTtcbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC5pc19uYW1lKSB7XG4gICAgICBzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkX25hbWUgPT09ICduYW1lJyAmJiAhc2VsZi5OQU1FX0ZJRUxEX0tFWSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5wcmltYXJ5KSB7XG4gICAgICBzZWxmLmlkRmllbGROYW1lID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSkge1xuICAgICAgICBpZiAoZmllbGRfbmFtZSA9PT0gJ3NwYWNlJykge1xuICAgICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBmaWVsZC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmICghb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PT0gJ21ldGVvci1tb25nbycpIHtcbiAgICBfLmVhY2goX2Jhc2VPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgaWYgKCFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSkge1xuICAgICAgICBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKTtcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goc2VsZi5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09ICdhdXRvbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdmb3JtdWxhJykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdzdW1tYXJ5Jykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBzZWxmLmxpc3Rfdmlld3MgPSB7fTtcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KHNlbGYubmFtZSk7XG4gIF8uZWFjaChvcHRpb25zLmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBvaXRlbTtcbiAgICBvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRWaWV3LCBpdGVtLCBpdGVtX25hbWUpO1xuICAgIHJldHVybiBzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtO1xuICB9KTtcbiAgc2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QudHJpZ2dlcnMpO1xuICBfLmVhY2gob3B0aW9ucy50cmlnZ2VycywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgICByZXR1cm4gc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIHNlbGYuYWN0aW9ucyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QuYWN0aW9ucyk7XG4gIF8uZWFjaChvcHRpb25zLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBjb3B5SXRlbTtcbiAgICBpZiAoIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICBjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pO1xuICAgIGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXTtcbiAgICBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKTtcbiAgICByZXR1cm4gc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0ub2JqZWN0X25hbWUgPSBzZWxmLm5hbWU7XG4gIH0pO1xuICBfLmVhY2goc2VsZi5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lID0gaXRlbV9uYW1lO1xuICB9KTtcbiAgc2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSk7XG4gIHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KTtcbiAgaWYgKCFvcHRpb25zLnBlcm1pc3Npb25fc2V0KSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldCA9IHt9O1xuICB9XG4gIGlmICghKChyZWYgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmLmFkbWluIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSk7XG4gIH1cbiAgaWYgKCEoKHJlZjEgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmMS51c2VyIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pO1xuICB9XG4gIF8uZWFjaChvcHRpb25zLnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHJldHVybiBzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9ucztcbiAgICBkaXNhYmxlZF9saXN0X3ZpZXdzID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgOiB2b2lkIDA7XG4gICAgaWYgKGRpc2FibGVkX2xpc3Rfdmlld3MgIT0gbnVsbCA/IGRpc2FibGVkX2xpc3Rfdmlld3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICBkZWZhdWx0TGlzdFZpZXdJZCA9IChyZWYyID0gb3B0aW9ucy5saXN0X3ZpZXdzKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLmFsbCkgIT0gbnVsbCA/IHJlZjMuX2lkIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGRlZmF1bHRMaXN0Vmlld0lkKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcChkaXNhYmxlZF9saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXdfaXRlbSkge1xuICAgICAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCA9PT0gbGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBcImFsbFwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdF92aWV3X2l0ZW07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG51bGw7XG4gIH1cbiAgX2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpO1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGI7XG4gIHNlbGYuZGIgPSBfZGI7XG4gIHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZTtcbiAgc2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZik7XG4gIHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpO1xuICBpZiAoc2VsZi5uYW1lICE9PSBcInVzZXJzXCIgJiYgc2VsZi5uYW1lICE9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiLCBcImFjdGlvbl9maWVsZF91cGRhdGVzXCIsIFwib2JqZWN0X2xpc3R2aWV3c1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzZWxmLm5hbWUgPT09IFwidXNlcnNcIikge1xuICAgIF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWE7XG4gIH1cbiAgaWYgKF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGY7XG4gIHJldHVybiBzZWxmO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCI7XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgaWYgKCFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHMpIHtcbiAgICByZXR1cm4gXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICByZXR1cm4gbmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdCk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zID0gKGZpZWxkU2NoZW1hKSAtPlxuXHRvcHRpb25zID0gZmllbGRTY2hlbWEub3B0aW9uc1xuXHR1bmxlc3Mgb3B0aW9uc1xuXHRcdHJldHVyblxuXHRkYXRhX3R5cGUgPSBmaWVsZFNjaGVtYS5kYXRhX3R5cGVcblx0aWYgIV8uaXNGdW5jdGlvbihvcHRpb25zKSBhbmQgZGF0YV90eXBlIGFuZCBkYXRhX3R5cGUgIT0gJ3RleHQnXG5cdFx0IyDpm7bku6PnoIHnlYzpnaLphY3nva5vcHRpb25z6YCJ6aG55YC85Y+q5pSv5oyB5a2X56ym5Liy77yM5omA5Lul5b2TZGF0YV90eXBl5Li65pWw5YC85oiWYm9vbGVhbuaXtu+8jOWPquiDveW8uuihjOaKiumAiemhueWAvOWFiOi9rOaNouS4uuWvueW6lOeahOexu+Wei1xuXHRcdG9wdGlvbnMuZm9yRWFjaCAob3B0aW9uSXRlbSkgLT5cblx0XHRcdGlmIHR5cGVvZiBvcHRpb25JdGVtLnZhbHVlICE9ICdzdHJpbmcnXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgW1xuXHRcdFx0XHQnbnVtYmVyJ1xuXHRcdFx0XHQnY3VycmVuY3knXG5cdFx0XHRcdCdwZXJjZW50J1xuXHRcdFx0XS5pbmRleE9mKGRhdGFfdHlwZSkgPiAtMVxuXHRcdFx0XHRvcHRpb25JdGVtLnZhbHVlID0gTnVtYmVyKG9wdGlvbkl0ZW0udmFsdWUpXG5cdFx0XHRlbHNlIGlmIGRhdGFfdHlwZSA9PSAnYm9vbGVhbidcblx0XHRcdFx0IyDlj6rmnInkuLp0cnVl5omN5Li655yfXG5cdFx0XHRcdG9wdGlvbkl0ZW0udmFsdWUgPSBvcHRpb25JdGVtLnZhbHVlID09ICd0cnVlJ1xuXHRyZXR1cm4gb3B0aW9uc1xuXG5DcmVhdG9yLmdldE9iamVjdFNjaGVtYSA9IChvYmopIC0+XG5cdHVubGVzcyBvYmpcblx0XHRyZXR1cm5cblx0c2NoZW1hID0ge31cblxuXHRmaWVsZHNBcnIgPSBbXVxuXG5cdF8uZWFjaCBvYmouZmllbGRzICwgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgIV8uaGFzKGZpZWxkLCBcIm5hbWVcIilcblx0XHRcdGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lXG5cdFx0ZmllbGRzQXJyLnB1c2ggZmllbGRcblxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxuXG5cdFx0ZmllbGRfbmFtZSA9IGZpZWxkLm5hbWVcblxuXHRcdGZzID0ge31cblx0XHRpZiBmaWVsZC5yZWdFeFxuXHRcdFx0ZnMucmVnRXggPSBmaWVsZC5yZWdFeFxuXHRcdGZzLmF1dG9mb3JtID0ge31cblx0XHRmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlXG5cdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRhdXRvZm9ybV90eXBlID0gZmllbGQuYXV0b2Zvcm0/LnR5cGVcblxuXHRcdGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGQudHlwZSA9PSBcInBob25lXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbdGV4dF1cIiBvciBmaWVsZC50eXBlID09IFwiW3Bob25lXVwiXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnY29kZSdcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyXG5cdFx0XHRpZiBmaWVsZC5sYW5ndWFnZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidGV4dGFyZWFcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInBhc3N3b3JkXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRlXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxuXHRcdFx0XHRcdFx0IyBGaXggaW9zIDE0LCDmiYvmnLrlrqLmiLfnq6/lvoXlrqHmoLjmlofku7bml6XmnJ/mjqfku7bmmL7npLrmlYXpmpwgIzk5Me+8jGlvc+e7n+S4gOeUqFBD56uv5LiA5qC355qEanPmjqfku7Zcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXG5cdFx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuXHRcdFx0XHRcdFx0XHRcdHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXG5cdFx0XHRcdFx0XHRcdGRhdGVNb2JpbGVPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRpbWVcIlxuXHRcdFx0ZnMudHlwZSA9IERhdGVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcblx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0dHlwZTogXCJ0aW1lXCJcblx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwiSEg6bW1cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxuXHRcdFx0XHRcdFx0IyBGaXggaW9zIDE0LCDmiYvmnLrlrqLmiLfnq6/lvoXlrqHmoLjmlofku7bml6XmnJ/mjqfku7bmmL7npLrmlYXpmpwgIzk5Me+8jGlvc+e7n+S4gOeUqFBD56uv5LiA5qC355qEanPmjqfku7Zcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG5cdFx0XHRcdFx0XHRcdFx0cGlja2VyVHlwZTogXCJyb2xsZXJzXCJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcblx0XHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIltPYmplY3RdXCJcblx0XHRcdGZzLnR5cGUgPSBbT2JqZWN0XVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImh0bWxcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0h0bWwnO1xuXHRcdFx0IyBpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdCMgXHRsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG5cdFx0XHQjIFx0aWYgbG9jYWxlID09IFwiemgtY25cIiB8fCBsb2NhbGUgPT0gXCJ6aC1DTlwiXG5cdFx0XHQjIFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblx0XHRcdCMgXHRlbHNlXG5cdFx0XHQjIFx0XHRsb2NhbGUgPSBcImVuLVVTXCJcblx0XHRcdCMgXHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0IyBcdFx0dHlwZTogXCJzdW1tZXJub3RlXCJcblx0XHRcdCMgXHRcdGNsYXNzOiAnc3VtbWVybm90ZS1lZGl0b3InXG5cdFx0XHQjIFx0XHRzZXR0aW5nczpcblx0XHRcdCMgXHRcdFx0aGVpZ2h0OiAyMDBcblx0XHRcdCMgXHRcdFx0ZGlhbG9nc0luQm9keTogdHJ1ZVxuXHRcdFx0IyBcdFx0XHR0b29sYmFyOiAgW1xuXHRcdFx0IyBcdFx0XHRcdFsnZm9udDEnLCBbJ3N0eWxlJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ2ZvbnQzJywgWydmb250bmFtZSddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ2NvbG9yJywgWydjb2xvciddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ3RhYmxlJywgWyd0YWJsZSddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ2luc2VydCcsIFsnbGluaycsICdwaWN0dXJlJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsndmlldycsIFsnY29kZXZpZXcnXV1cblx0XHRcdCMgXHRcdFx0XVxuXHRcdFx0IyBcdFx0XHRmb250TmFtZXM6IFsnQXJpYWwnLCAnQ29taWMgU2FucyBNUycsICdDb3VyaWVyIE5ldycsICdIZWx2ZXRpY2EnLCAnSW1wYWN0JywgJ+Wui+S9kycsJ+m7keS9kycsJ+W+rui9r+mbhem7kScsJ+S7v+WuiycsJ+alt+S9kycsJ+matuS5picsJ+W5vOWchiddXG5cdFx0XHQjIFx0XHRcdGxhbmc6IGxvY2FsZVxuXG5cdFx0ZWxzZSBpZiAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblxuXHRcdFx0aWYgIWZpZWxkLmhpZGRlblxuXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzXG5cblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb25cblxuXHRcdFx0XHRpZiBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0XHRmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblxuXHRcdFx0XHRmcy5maWx0ZXJzRnVuY3Rpb24gPSBpZiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gdGhlbiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gZWxzZSBDcmVhdG9yLmV2YWx1YXRlRmlsdGVyc1xuXG5cdFx0XHRcdGlmIGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRcdGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRpZiBmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0X3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXVxuXHRcdFx0XHRcdFx0XHRcdGlmIF9yZWZfb2JqPy5wZXJtaXNzaW9ucz8uYWxsb3dDcmVhdGVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gKGxvb2t1cF9maWVsZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3JtSWQ6IFwibmV3I3tmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsJ18nKX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogXCIje2ZpZWxkLnJlZmVyZW5jZV90b31cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25TdWNjZXNzOiAob3BlcmF0aW9uLCByZXN1bHQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlc3VsdC5vYmplY3RfbmFtZSA9PSBcIm9iamVjdHNcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLCB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsIGljb246IHJlc3VsdC52YWx1ZS5pY29ufV0sIHJlc3VsdC52YWx1ZS5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLCB2YWx1ZTogcmVzdWx0Ll9pZH1dLCByZXN1bHQuX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlXG5cblx0XHRcdFx0XHRpZiBfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGVcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfbGltaXRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdFxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b19maWVsZFxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlVG9GaWVsZCA9IGZpZWxkLnJlZmVyZW5jZV90b19maWVsZFxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwidXNlcnNcIlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7liIbpg6jliJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7liIbpg6hcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9uc1xuXHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5YiG6YOo6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc1VuTGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0IyDkvKDlhaXlvZPliY3lr7nosaHnmoTmnYPpmZDvvIzlnKjlh73mlbDkuK3moLnmja7mnYPpmZDorqHnrpfmmK/lkKbopoHpmZDliLblj6rmn6XnnIvmnKzliIbpg6hcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0IyDmnI3liqHnq6/nlKjkuI3liLBpc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRlbHNlIGlmIGZpZWxkLnJlZmVyZW5jZV90byA9PSBcIm9yZ2FuaXphdGlvbnNcIlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzliIbpg6jkuIvnmoTmlbDmja5cblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWIhumDqOWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzlrZfmrrXmiYDlsZ7lr7nosaHmmK/nlKjmiLfmiJbnu4Tnu4fvvIzliJnmmK/lkKbpmZDliLbmmL7npLrmiYDlsZ7liIbpg6jpg6jpl6jkuI5tb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5YWz6IGUXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzVW5MaW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRnVuY3Rpb24gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHQjIOS8oOWFpeW9k+WJjeWvueixoeeahOadg+mZkO+8jOWcqOWHveaVsOS4reagueaNruadg+mZkOiuoeeul+aYr+WQpuimgemZkOWItuWPquafpeeci+acrOWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucylcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOacjeWKoeerr+eUqOS4jeWIsGlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGlmIHR5cGVvZihmaWVsZC5yZWZlcmVuY2VfdG8pID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKClcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoX3JlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdFx0XHRcdFx0XHRmcy5ibGFja2JveCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub2JqZWN0U3dpdGNoZSA9IHRydWVcblxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogU3RyaW5nXG5cdFx0XHRcdFx0XHRcdFx0YXV0b2Zvcm06IHtvbWl0OiB0cnVlfVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogW1N0cmluZ11cblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dXG5cblx0XHRcdFx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV90b1swXV1cblx0XHRcdFx0XHRcdGlmIF9vYmplY3QgYW5kIF9vYmplY3QuZW5hYmxlX3RyZWVcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCJcblxuXHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfVxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMgPSBbXVxuXHRcdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8uZm9yRWFjaCAoX3JlZmVyZW5jZSktPlxuXHRcdFx0XHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlXVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgX29iamVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBfb2JqZWN0Py5sYWJlbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IF9vYmplY3Q/Lmljb25cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW5rOiAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0SWNvbiA9IGZpZWxkLmRlZmF1bHRJY29uXG5cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmYWxzZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RcIlxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xuXHRcdFx0XHRpZiBfLmhhcyhmaWVsZCwgJ2ZpcnN0T3B0aW9uJylcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IGZpZWxkLmZpcnN0T3B0aW9uXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCJcblx0XHRcdCMg5Zug5Li65YiX6KGo6KeG5Zu+5Y+z5L6n6L+H5ruk5Zmo6L+Y5piv55So55qE6ICB6KGo5Y2V55qEbG9va3Vw5ZKMc2VsZWN05o6n5Lu277yM5omA5Lul5LiK6Z2i55qE5Luj56CB5aeL57uI5L+d5oyB5Y6f5qC36ZyA6KaB5omn6KGMXG5cdFx0XHQjIOS4i+mdouaYr+mFjee9ruS6hmRhdGFfdHlwZeaXtu+8jOmineWkluWkhOeQhueahOmAu+i+kVxuXHRcdFx0aWYgZmllbGQuZGF0YV90eXBlIGFuZCBmaWVsZC5kYXRhX3R5cGUgIT0gXCJ0ZXh0XCJcblx0XHRcdFx0aWYgW1wibnVtYmVyXCIsIFwiY3VycmVuY3lcIiwgXCJwZXJjZW50XCJdLmluZGV4T2YoZmllbGQuZGF0YV90eXBlKSA+IC0xXG5cdFx0XHRcdFx0ZnNUeXBlID0gTnVtYmVyXG5cdFx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5kYXRhX3R5cGUgPT0gXCJib29sZWFuXCJcblx0XHRcdFx0XHRmc1R5cGUgPSBCb29sZWFuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmc1R5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMudHlwZSA9IGZzVHlwZVxuXHRcdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRcdGZzLnR5cGUgPSBbZnNUeXBlXVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zKGZpZWxkKVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImN1cnJlbmN5XCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdFx0ZWxzZSBpZiBmaWVsZD8uc2NhbGUgIT0gMFxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IDJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJudW1iZXJcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYm9vbGVhblwiXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRvZ2dsZVwiXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJyZWZlcmVuY2VcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCJcblx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZVwiXG5cdFx0XHRjb2xsZWN0aW9uTmFtZSA9IGZpZWxkLmNvbGxlY3Rpb24gfHwgXCJmaWxlc1wiICMgY29sbGVjdGlvbiDpu5jorqTmmK8gJ2ZpbGVzJ1xuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gY29sbGVjdGlvbk5hbWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlc2l6ZVwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT0gXCJvYmplY3RcIlxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImdyaWRcIiB8fCBmaWVsZC50eXBlID09IFwidGFibGVcIlxuXHRcdFx0ZnMudHlwZSA9IEFycmF5XG5cdFx0XHRmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCJcblxuXHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0dHlwZTogT2JqZWN0XG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaW1hZ2VcIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdpbWFnZXMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF2YXRhclwiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F2YXRhcnMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdWRpb1wiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F1ZGlvcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2F1ZGlvLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidmlkZW9cIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICd2aWRlb3MnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICd2aWRlby8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3Rcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm1hcmtkb3duXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRleHRcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAndXJsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0IyBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5Vcmxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2VtYWlsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2NvbG9yJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcblx0XHRcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdzdW1tYXJ5J1xuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cblx0XHQjIGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xuXHRcdCMgXHRmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtmaWVsZHM6IHtmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHt0eXBlOiBmaWVsZC5kYXRhX3R5cGV9KX19KVtmaWVsZC5uYW1lXVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAncGVyY2VudCdcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHR1bmxlc3MgXy5pc051bWJlcihmaWVsZC5zY2FsZSlcblx0XHRcdFx0IyDmsqHphY3nva7lsI/mlbDkvY3mlbDliJnmjInlsI/mlbDkvY3mlbAw5p2l5aSE55CG77yM5Y2z6buY6K6k5pi+56S65Li65pW05pWw55qE55m+5YiG5q+U77yM5q+U5aaCMjAl77yM5q2k5pe25o6n5Lu25Y+v5Lul6L6T5YWlMuS9jeWwj+aVsO+8jOi9rOaIkOeZvuWIhuavlOWwseaYr+aVtOaVsFxuXHRcdFx0XHRmaWVsZC5zY2FsZSA9IDBcblx0XHRcdCMgYXV0b2Zvcm3mjqfku7bkuK3lsI/mlbDkvY3mlbDlp4vnu4jmr5TphY3nva7nmoTkvY3mlbDlpJoy5L2NXG5cdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlICsgMlxuXHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlXG5cdFx0XHRmcy50eXBlID0gZmllbGQudHlwZVxuXG5cdFx0aWYgZmllbGQubGFiZWxcblx0XHRcdGZzLmxhYmVsID0gZmllbGQubGFiZWxcblxuI1x0XHRpZiBmaWVsZC5hbGxvd2VkVmFsdWVzXG4jXHRcdFx0ZnMuYWxsb3dlZFZhbHVlcyA9IGZpZWxkLmFsbG93ZWRWYWx1ZXNcblxuXHRcdGlmICFmaWVsZC5yZXF1aXJlZFxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXG5cblx0XHQjIFvnrb7nuqblr7nosaHlkIzml7bphY3nva7kuoZjb21wYW55X2lkc+W/heWhq+WPinVuZWRpdGFibGVfZmllbGRz6YCg5oiQ6YOo5YiG55So5oi35paw5bu6562+57qm5a+56LGh5pe25oql6ZSZICMxOTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9zdGVlZG9zL3N0ZWVkb3MtcHJvamVjdC1kenVnL2lzc3Vlcy8xOTIpXG5cdFx0IyDlkI7lj7Dlp4vnu4jorr7nva5yZXF1aXJlZOS4umZhbHNlXG5cdFx0aWYgIU1ldGVvci5pc0NsaWVudFxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC51bmlxdWVcblx0XHRcdGZzLnVuaXF1ZSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLm9taXRcblx0XHRcdGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5ncm91cFxuXHRcdFx0ZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cFxuXG5cdFx0aWYgZmllbGQuaXNfd2lkZVxuXHRcdFx0ZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmhpZGRlblxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCJcblxuXHRcdGlmIChmaWVsZC50eXBlID09IFwic2VsZWN0XCIpIG9yIChmaWVsZC50eXBlID09IFwibG9va3VwXCIpIG9yIChmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLmZpbHRlcmFibGUpID09ICd1bmRlZmluZWQnXG5cdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXG5cdFx0aWYgZmllbGQubmFtZSA9PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZVxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLnNlYXJjaGFibGUpID09ICd1bmRlZmluZWQnXG5cdFx0XHRcdGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlXG5cblx0XHRpZiBhdXRvZm9ybV90eXBlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZVxuXG5cdFx0aWYgZmllbGQuZGVmYXVsdFZhbHVlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gKCktPlxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHt1c2VySWQ6IE1ldGVvci51c2VySWQoKSwgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCBub3c6IG5ldyBEYXRlKCl9KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdCMgXHRpZiAhXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdCMgXHRcdGZzLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXG5cdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuZGlzYWJsZWRcblx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuaW5saW5lSGVscFRleHRcblx0XHRcdGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHRcblxuXHRcdGlmIGZpZWxkLmJsYWNrYm94XG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcblxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWluJylcblx0XHRcdGZzLm1pbiA9IGZpZWxkLm1pblxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWF4Jylcblx0XHRcdGZzLm1heCA9IGZpZWxkLm1heFxuXG5cdFx0IyDlj6rmnInnlJ/kuqfnjq/looPmiY3ph43lu7rntKLlvJVcblx0XHRpZiBNZXRlb3IuaXNQcm9kdWN0aW9uXG5cdFx0XHRpZiBmaWVsZC5pbmRleFxuXHRcdFx0XHRmcy5pbmRleCA9IGZpZWxkLmluZGV4XG5cdFx0XHRlbHNlIGlmIGZpZWxkLnNvcnRhYmxlXG5cdFx0XHRcdGZzLmluZGV4ID0gdHJ1ZVxuXG5cdFx0c2NoZW1hW2ZpZWxkX25hbWVdID0gZnNcblxuXHRyZXR1cm4gc2NoZW1hXG5cblxuQ3JlYXRvci5nZXRGaWVsZERpc3BsYXlWYWx1ZSA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpLT5cblx0aHRtbCA9IGZpZWxkX3ZhbHVlXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuIFwiXCJcblx0ZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpXG5cdGlmICFmaWVsZFxuXHRcdHJldHVybiBcIlwiXG5cblx0aWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpXG5cdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxuXHRcdGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG5cblx0cmV0dXJuIGh0bWxcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSAoZmllbGRfdHlwZSktPlxuXHRyZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwidGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpLT5cblx0YnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSlcblx0aWYgYnVpbHRpblZhbHVlc1xuXHRcdF8uZm9yRWFjaCBidWlsdGluVmFsdWVzLCAoYnVpbHRpbkl0ZW0sIGtleSktPlxuXHRcdFx0b3BlcmF0aW9ucy5wdXNoKHtsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsIHZhbHVlOiBrZXl9KVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpLT5cblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSAoZmllbGRfdHlwZSwgdmFsdWUpLT5cblx0IyDmoLnmja7ov4fmu6TlmajnmoTov4fmu6TlgLzvvIzojrflj5blr7nlupTnmoTlhoXnva7ov5DnrpfnrKZcblx0IyDmr5TlpoJ2YWx1ZeS4umxhc3RfeWVhcu+8jOi/lOWbnmJldHdlZW5fdGltZV9sYXN0X3llYXJcblx0dW5sZXNzIF8uaXNTdHJpbmcodmFsdWUpXG5cdFx0cmV0dXJuXG5cdGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxuXHR1bmxlc3MgYmV0d2VlbkJ1aWx0aW5WYWx1ZXNcblx0XHRyZXR1cm5cblx0cmVzdWx0ID0gbnVsbFxuXHRfLmVhY2ggYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIChpdGVtLCBvcGVyYXRpb24pLT5cblx0XHRpZiBpdGVtLmtleSA9PSB2YWx1ZVxuXHRcdFx0cmVzdWx0ID0gb3BlcmF0aW9uXG5cdHJldHVybiByZXN1bHRcblxuIyDlpoLmnpzlj6rmmK/kuLrliKTmlq1vcGVyYXRpb27mmK/lkKblrZjlnKjvvIzliJnmsqHlv4XopoHorqHnrpd2YWx1ZXPvvIzkvKDlhaVpc19jaGVja19vbmx55Li6dHJ1ZeWNs+WPr1xuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSAoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSktPlxuXHQjIOi/h+a7pOWZqOaXtumXtOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRyZXR1cm4ge1xuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuXHR9XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSAobW9udGgpLT5cblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHJldHVybiAwXG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0cmV0dXJuIDNcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRyZXR1cm4gNlxuXHRcblx0cmV0dXJuIDlcblxuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHllYXItLVxuXHRcdG1vbnRoID0gOVxuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdG1vbnRoID0gMFxuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdG1vbnRoID0gM1xuXHRlbHNlIFxuXHRcdG1vbnRoID0gNlxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gKHllYXIsbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHRtb250aCA9IDNcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRtb250aCA9IDZcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRtb250aCA9IDlcblx0ZWxzZVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoID0gMFxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmIG1vbnRoID09IDExXG5cdFx0cmV0dXJuIDMxXG5cdFxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcblx0c3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCsxLCAxKVxuXHRkYXlzID0gKGVuZERhdGUtc3RhcnREYXRlKS9taWxsaXNlY29uZFxuXHRyZXR1cm4gZGF5c1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gKHllYXIsIG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0IyDmnIjku73kuLow5Luj6KGo5pys5bm055qE56ys5LiA5pyIXG5cdGlmIG1vbnRoID09IDBcblx0XHRtb250aCA9IDExXG5cdFx0eWVhci0tXG5cdFx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblx0IyDlkKbliJks5Y+q5YeP5Y675pyI5Lu9XG5cdG1vbnRoLS07XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cblx0IyDov4fmu6TlmahiZXR3ZWVu6L+Q566X56ym77yM546w566X5pel5pyfL+aXpeacn+aXtumXtOexu+Wei+Wtl+auteeahHZhbHVlc+WAvFxuXHRub3cgPSBuZXcgRGF0ZSgpXG5cdCMg5LiA5aSp55qE5q+r56eS5pWwXG5cdG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNFxuXHR5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHR0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcblx0IyDkuIDlkajkuK3nmoTmn5DkuIDlpKlcblx0d2VlayA9IG5vdy5nZXREYXkoKVxuXHQjIOWHj+WOu+eahOWkqeaVsFxuXHRtaW51c0RheSA9IGlmIHdlZWsgIT0gMCB0aGVuIHdlZWsgLSAxIGVsc2UgNlxuXHRtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKVxuXHRzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg5LiK5ZGo5pelXG5cdGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5LiK5ZGo5LiAXG5cdGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKVxuXHQjIOS4i+WRqOS4gFxuXHRuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxuXHQjIOS4i+WRqOaXpVxuXHRuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSlcblx0Y3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDFcblx0bmV4dFllYXIgPSBjdXJyZW50WWVhciArIDFcblx0IyDlvZPliY3mnIjku71cblx0Y3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDorqHmlbDlubTjgIHmnIhcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG5cdG1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDmnKzmnIjnrKzkuIDlpKlcblx0Zmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixjdXJyZW50TW9udGgsMSlcblxuXHQjIOW9k+S4ujEy5pyI55qE5pe25YCZ5bm05Lu96ZyA6KaB5YqgMVxuXHQjIOaciOS7vemcgOimgeabtOaWsOS4ujAg5Lmf5bCx5piv5LiL5LiA5bm055qE56ys5LiA5Liq5pyIXG5cdGlmIGN1cnJlbnRNb250aCA9PSAxMVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoKytcblx0ZWxzZVxuXHRcdG1vbnRoKytcblx0XG5cdCMg5LiL5pyI56ys5LiA5aSpXG5cdG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdCMg5LiL5pyI5pyA5ZCO5LiA5aSpXG5cdG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhcixtb250aCxDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLG1vbnRoKSlcblx0IyDmnKzmnIjmnIDlkI7kuIDlpKlcblx0bGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOS4iuaciOesrOS4gOWkqVxuXHRsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4iuaciOacgOWQjuS4gOWkqVxuXHRsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOacrOWto+W6puW8gOWni+aXpVxuXHR0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLDEpXG5cdCMg5pys5a2j5bqm57uT5p2f5pelXG5cdHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIsQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIpKVxuXHQjIOS4iuWto+W6puW8gOWni+aXpVxuXHRsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIrlraPluqbnu5PmnZ/ml6Vcblx0bGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcblx0IyDkuIvlraPluqblvIDlp4vml6Vcblx0bmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiL5a2j5bqm57uT5p2f5pelXG5cdG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMikpXG5cdCMg6L+H5Y67N+WkqSBcblx0bGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MzDlpKlcblx0bGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrs2MOWkqVxuXHRsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzkw5aSpXG5cdGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MTIw5aSpXG5cdGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU35aSpIFxuXHRuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUzMOWkqVxuXHRuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTYw5aSpXG5cdG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lOTDlpKlcblx0bmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUxMjDlpKlcblx0bmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKVxuXG5cdHN3aXRjaCBrZXlcblx0XHR3aGVuIFwibGFzdF95ZWFyXCJcblx0XHRcdCPljrvlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7cHJldmlvdXNZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc195ZWFyXCJcblx0XHRcdCPku4rlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfeWVhclwiXG5cdFx0XHQj5piO5bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4iuWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3F1YXJ0ZXJcIlxuXHRcdFx0I+acrOWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4i+Wto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X21vbnRoXCJcblx0XHRcdCPkuIrmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX21vbnRoXCJcblx0XHRcdCPmnKzmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfbW9udGhcIlxuXHRcdFx0I+S4i+aciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3Rfd2Vla1wiXG5cdFx0XHQj5LiK5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc193ZWVrXCJcblx0XHRcdCPmnKzlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF93ZWVrXCJcblx0XHRcdCPkuIvlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ5ZXN0ZGF5XCJcblx0XHRcdCPmmKjlpKlcblx0XHRcdHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0b2RheVwiXG5cdFx0XHQj5LuK5aSpXG5cdFx0XHRzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidG9tb3Jyb3dcIlxuXHRcdFx0I+aYjuWkqVxuXHRcdFx0c3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF83X2RheXNcIlxuXHRcdFx0I+i/h+WOuzflpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIFxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8zMF9kYXlzXCJcblx0XHRcdCPov4fljrszMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF82MF9kYXlzXCJcblx0XHRcdCPov4fljrs2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF85MF9kYXlzXCJcblx0XHRcdCPov4fljrs5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8xMjBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67MTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfN19kYXlzXCJcblx0XHRcdCPmnKrmnaU35aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8zMF9kYXlzXCJcblx0XHRcdCPmnKrmnaUzMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF82MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF85MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8xMjBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lMTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFxuXHR2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdXG5cdGlmIGZpZWxkX3R5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0IyDml7bpl7TnsbvlnovlrZfmrrXvvIzlhoXnva7ml7bpl7TojIPlm7TlupTor6XogIPomZHlgY/np7vml7bljLrlgLzvvIzlkKbliJnov4fmu6TmlbDmja7lrZjlnKjlgY/lt65cblx0XHQjIOmdnuWGhee9ruaXtumXtOiMg+WbtOaXtu+8jOeUqOaIt+mAmui/h+aXtumXtOaOp+S7tumAieaLqeeahOiMg+WbtO+8jOS8muiHquWKqOWkhOeQhuaXtuWMuuWBj+W3ruaDheWGtVxuXHRcdCMg5pel5pyf57G75Z6L5a2X5q6177yM5pWw5o2u5bqT5pys5p2l5bCx5a2Y55qE5pivVVRD55qEMOeCue+8jOS4jeWtmOWcqOWBj+W3rlxuXHRcdF8uZm9yRWFjaCB2YWx1ZXMsIChmdiktPlxuXHRcdFx0aWYgZnZcblx0XHRcdFx0ZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCApXG5cdFxuXHRyZXR1cm4ge1xuXHRcdGxhYmVsOiBsYWJlbFxuXHRcdGtleToga2V5XG5cdFx0dmFsdWVzOiB2YWx1ZXNcblx0fVxuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKS0+XG5cdGlmIGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gJ2JldHdlZW4nXG5cdGVsc2UgaWYgW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiAnY29udGFpbnMnXG5cdGVsc2Vcblx0XHRyZXR1cm4gXCI9XCJcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKSAtPlxuXHQjIOaXpeacn+exu+WeizogZGF0ZSwgZGF0ZXRpbWUgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOaWh+acrOexu+WeizogdGV4dCwgdGV4dGFyZWEsIGh0bWwgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIsIFwic3RhcnRzd2l0aFwiXG5cdCMg6YCJ5oup57G75Z6LOiBsb29rdXAsIG1hc3Rlcl9kZXRhaWwsIHNlbGVjdCDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblx0IyDmlbDlgLznsbvlnos6IGN1cnJlbmN5LCBudW1iZXIgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOW4g+WwlOexu+WeizogYm9vbGVhbiAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cdCMg5pWw57uE57G75Z6LOiBjaGVja2JveCwgW3RleHRdICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblxuXHRvcHRpb25hbHMgPSB7XG5cdFx0ZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSwgdmFsdWU6IFwiPVwifSxcblx0XHR1bmVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSwgdmFsdWU6IFwiPD5cIn0sXG5cdFx0bGVzc190aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLCB2YWx1ZTogXCI8XCJ9LFxuXHRcdGdyZWF0ZXJfdGhhbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSwgdmFsdWU6IFwiPlwifSxcblx0XHRsZXNzX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPD1cIn0sXG5cdFx0Z3JlYXRlcl9vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksIHZhbHVlOiBcIj49XCJ9LFxuXHRcdGNvbnRhaW5zOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksIHZhbHVlOiBcImNvbnRhaW5zXCJ9LFxuXHRcdG5vdF9jb250YWluOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSwgdmFsdWU6IFwibm90Y29udGFpbnNcIn0sXG5cdFx0c3RhcnRzX3dpdGg6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSwgdmFsdWU6IFwic3RhcnRzd2l0aFwifSxcblx0XHRiZXR3ZWVuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSwgdmFsdWU6IFwiYmV0d2VlblwifSxcblx0fVxuXG5cdGlmIGZpZWxkX3R5cGUgPT0gdW5kZWZpbmVkXG5cdFx0cmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscylcblxuXHRvcGVyYXRpb25zID0gW11cblxuXHRpZiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbilcblx0XHRDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGRfdHlwZSA9PSBcInRleHRhcmVhXCIgb3IgZmllbGRfdHlwZSA9PSBcImh0bWxcIiBvciBmaWVsZF90eXBlID09IFwiY29kZVwiXG4jXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMuY29udGFpbnMsIG9wdGlvbmFscy5ub3RfY29udGFpbiwgb3B0aW9uYWxzLnN0YXJ0c193aXRoKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgb3IgZmllbGRfdHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImN1cnJlbmN5XCIgb3IgZmllbGRfdHlwZSA9PSBcIm51bWJlclwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiYm9vbGVhblwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiW3RleHRdXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXG5cdHJldHVybiBvcGVyYXRpb25zXG5cbiMjI1xuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuIyMjXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSAob2JqZWN0X25hbWUpLT5cblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcblx0ZmllbGRzQXJyID0gW11cblxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQpLT5cblx0XHRmaWVsZHNBcnIucHVzaCB7bmFtZTogZmllbGQubmFtZSwgc29ydF9ubzogZmllbGQuc29ydF9ub31cblxuXHRmaWVsZHNOYW1lID0gW11cblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cblx0XHRmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSlcblx0cmV0dXJuIGZpZWxkc05hbWVcbiIsIkNyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyA9IGZ1bmN0aW9uKGZpZWxkU2NoZW1hKSB7XG4gIHZhciBkYXRhX3R5cGUsIG9wdGlvbnM7XG4gIG9wdGlvbnMgPSBmaWVsZFNjaGVtYS5vcHRpb25zO1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGF0YV90eXBlID0gZmllbGRTY2hlbWEuZGF0YV90eXBlO1xuICBpZiAoIV8uaXNGdW5jdGlvbihvcHRpb25zKSAmJiBkYXRhX3R5cGUgJiYgZGF0YV90eXBlICE9PSAndGV4dCcpIHtcbiAgICBvcHRpb25zLmZvckVhY2goZnVuY3Rpb24ob3B0aW9uSXRlbSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25JdGVtLnZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoWydudW1iZXInLCAnY3VycmVuY3knLCAncGVyY2VudCddLmluZGV4T2YoZGF0YV90eXBlKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25JdGVtLnZhbHVlID0gTnVtYmVyKG9wdGlvbkl0ZW0udmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhX3R5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gb3B0aW9uSXRlbS52YWx1ZSA9IG9wdGlvbkl0ZW0udmFsdWUgPT09ICd0cnVlJztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBmaWVsZHNBcnIsIHNjaGVtYTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc2NoZW1hID0ge307XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2gob2JqLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoIV8uaGFzKGZpZWxkLCBcIm5hbWVcIikpIHtcbiAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goZmllbGQpO1xuICB9KTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHZhciBfb2JqZWN0LCBfcmVmX29iaiwgX3JlZmVyZW5jZV90bywgYXV0b2Zvcm1fdHlwZSwgY29sbGVjdGlvbk5hbWUsIGZpZWxkX25hbWUsIGZzLCBmc1R5cGUsIGlzVW5MaW1pdGVkLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxO1xuICAgIGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lO1xuICAgIGZzID0ge307XG4gICAgaWYgKGZpZWxkLnJlZ0V4KSB7XG4gICAgICBmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4O1xuICAgIH1cbiAgICBmcy5hdXRvZm9ybSA9IHt9O1xuICAgIGZzLmF1dG9mb3JtLm11bHRpcGxlID0gZmllbGQubXVsdGlwbGU7XG4gICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgIGF1dG9mb3JtX3R5cGUgPSAocmVmID0gZmllbGQuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMDtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJwaG9uZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbdGV4dF1cIiB8fCBmaWVsZC50eXBlID09PSBcIltwaG9uZV1cIikge1xuICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2NvZGUnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyO1xuICAgICAgaWYgKGZpZWxkLmxhbmd1YWdlKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmxhbmd1YWdlID0gZmllbGQubGFuZ3VhZ2U7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicGFzc3dvcmRcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIixcbiAgICAgICAgICAgICAgICBwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgICBkYXRlTW9iaWxlT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiBcInRpbWVcIixcbiAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwiSEg6bW1cIlxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCIsXG4gICAgICAgICAgICAgICAgcGlja2VyVHlwZTogXCJyb2xsZXJzXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zSHRtbCc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmaWVsZC5zaG93SWNvbjtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICB9XG4gICAgICBpZiAoIWZpZWxkLmhpZGRlbikge1xuICAgICAgICBmcy5hdXRvZm9ybS5maWx0ZXJzID0gZmllbGQuZmlsdGVycztcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb247XG4gICAgICAgIGlmIChmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgZnMuZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uID8gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIDogQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnM7XG4gICAgICAgIGlmIChmaWVsZC5vcHRpb25zRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90bykge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgX3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgICAgICBpZiAoX3JlZl9vYmogIT0gbnVsbCA/IChyZWYxID0gX3JlZl9vYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYxLmFsbG93Q3JlYXRlIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihsb29rdXBfZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy5cIiArIChDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgZm9ybUlkOiBcIm5ld1wiICsgKGZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywgJ18nKSksXG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IFwiXCIgKyBmaWVsZC5yZWZlcmVuY2VfdG8sXG4gICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImluc2VydFwiLFxuICAgICAgICAgICAgICAgICAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24ob3BlcmF0aW9uLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZXN1bHQub2JqZWN0X25hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IHJlc3VsdC52YWx1ZS5pY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQudmFsdWUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSkpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9zb3J0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX2xpbWl0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTGltaXQgPSBmaWVsZC5yZWZlcmVuY2VfbGltaXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZVRvRmllbGQgPSBmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwidXNlcnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnM7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwib3JnYW5pemF0aW9uc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RvcmdcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KF9yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgICAgICAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub2JqZWN0U3dpdGNoZSA9IHRydWU7XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFtTdHJpbmddLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV90b1swXV07XG4gICAgICAgICAgICBpZiAoX29iamVjdCAmJiBfb2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFRyZWVcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2QgPSBmaWVsZC5vcHRpb25zTWV0aG9kIHx8IFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiO1xuICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZFBhcmFtcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvLmZvckVhY2goZnVuY3Rpb24oX3JlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlXTtcbiAgICAgICAgICAgICAgICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5sYWJlbCA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBpY29uOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0SWNvbiA9IGZpZWxkLmRlZmF1bHRJY29uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmYWxzZTtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICAgIGlmIChfLmhhcyhmaWVsZCwgJ2ZpcnN0T3B0aW9uJykpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IGZpZWxkLmZpcnN0T3B0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZpZWxkLmRhdGFfdHlwZSAmJiBmaWVsZC5kYXRhX3R5cGUgIT09IFwidGV4dFwiKSB7XG4gICAgICAgIGlmIChbXCJudW1iZXJcIiwgXCJjdXJyZW5jeVwiLCBcInBlcmNlbnRcIl0uaW5kZXhPZihmaWVsZC5kYXRhX3R5cGUpID4gLTEpIHtcbiAgICAgICAgICBmc1R5cGUgPSBOdW1iZXI7XG4gICAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZmllbGQuZGF0YV90eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgIGZzVHlwZSA9IEJvb2xlYW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnNUeXBlID0gU3RyaW5nO1xuICAgICAgICB9XG4gICAgICAgIGZzLnR5cGUgPSBmc1R5cGU7XG4gICAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICAgIGZzLnR5cGUgPSBbZnNUeXBlXTtcbiAgICAgICAgfVxuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zKGZpZWxkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiY3VycmVuY3lcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApICE9PSAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gMjtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidG9nZ2xlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBCb29sZWFuO1xuICAgICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi10b2dnbGVcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicmVmZXJlbmNlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdC1jaGVja2JveFwiO1xuICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVcIikge1xuICAgICAgY29sbGVjdGlvbk5hbWUgPSBmaWVsZC5jb2xsZWN0aW9uIHx8IFwiZmlsZXNcIjtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWVcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gY29sbGVjdGlvbk5hbWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVzaXplXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZ3JpZFwiIHx8IGZpZWxkLnR5cGUgPT09IFwidGFibGVcIikge1xuICAgICAgZnMudHlwZSA9IEFycmF5O1xuICAgICAgZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIjtcbiAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJpbWFnZVwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdpbWFnZXMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXZhdGFyXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F2YXRhcnMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF1ZGlvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F1ZGlvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdhdWRpby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ2aWRlb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICd2aWRlb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAndmlkZW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9jYXRpb25cIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCI7XG4gICAgICBmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiO1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJtYXJrZG93blwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGV4dFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3VybCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2VtYWlsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2NvbG9yJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdmb3JtdWxhJykge1xuICAgICAgZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge1xuICAgICAgICAgICAgdHlwZTogZmllbGQuZGF0YV90eXBlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlbZmllbGQubmFtZV07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnc3VtbWFyeScpIHtcbiAgICAgIGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHtcbiAgICAgICAgICAgIHR5cGU6IGZpZWxkLmRhdGFfdHlwZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pW2ZpZWxkLm5hbWVdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3BlcmNlbnQnKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKCFfLmlzTnVtYmVyKGZpZWxkLnNjYWxlKSkge1xuICAgICAgICBmaWVsZC5zY2FsZSA9IDA7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlICsgMjtcbiAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcy50eXBlID0gZmllbGQudHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmxhYmVsKSB7XG4gICAgICBmcy5sYWJlbCA9IGZpZWxkLmxhYmVsO1xuICAgIH1cbiAgICBpZiAoIWZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC51bmlxdWUpIHtcbiAgICAgIGZzLnVuaXF1ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5vbWl0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmdyb3VwKSB7XG4gICAgICBmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaXNfd2lkZSkge1xuICAgICAgZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5oaWRkZW4pIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiO1xuICAgIH1cbiAgICBpZiAoKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHx8IChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLmZpbHRlcmFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQubmFtZSA9PT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuc2VhcmNoYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuc2VhcmNoYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvZm9ybV90eXBlKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRlZmF1bHRWYWx1ZSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHtcbiAgICAgICAgICAgIHVzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgICAgbm93OiBuZXcgRGF0ZSgpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGlzYWJsZWQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlubGluZUhlbHBUZXh0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0O1xuICAgIH1cbiAgICBpZiAoZmllbGQuYmxhY2tib3gpIHtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWluJykpIHtcbiAgICAgIGZzLm1pbiA9IGZpZWxkLm1pbjtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWF4JykpIHtcbiAgICAgIGZzLm1heCA9IGZpZWxkLm1heDtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1Byb2R1Y3Rpb24pIHtcbiAgICAgIGlmIChmaWVsZC5pbmRleCkge1xuICAgICAgICBmcy5pbmRleCA9IGZpZWxkLmluZGV4O1xuICAgICAgfSBlbHNlIGlmIChmaWVsZC5zb3J0YWJsZSkge1xuICAgICAgICBmcy5pbmRleCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzY2hlbWFbZmllbGRfbmFtZV0gPSBmcztcbiAgfSk7XG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKSB7XG4gIHZhciBmaWVsZCwgaHRtbCwgb2JqZWN0O1xuICBodG1sID0gZmllbGRfdmFsdWU7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSk7XG4gIGlmICghZmllbGQpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKTtcbiAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICB9XG4gIHJldHVybiBodG1sO1xufTtcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJ0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSk7XG59O1xuXG5DcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpIHtcbiAgdmFyIGJ1aWx0aW5WYWx1ZXM7XG4gIGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoYnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybiBfLmZvckVhY2goYnVpbHRpblZhbHVlcywgZnVuY3Rpb24oYnVpbHRpbkl0ZW0sIGtleSkge1xuICAgICAgcmV0dXJuIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBidWlsdGluSXRlbS5sYWJlbCxcbiAgICAgICAgdmFsdWU6IGtleVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBpc19jaGVja19vbmx5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgdmFsdWUpIHtcbiAgdmFyIGJldHdlZW5CdWlsdGluVmFsdWVzLCByZXN1bHQ7XG4gIGlmICghXy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoIWJldHdlZW5CdWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlc3VsdCA9IG51bGw7XG4gIF8uZWFjaChiZXR3ZWVuQnVpbHRpblZhbHVlcywgZnVuY3Rpb24oaXRlbSwgb3BlcmF0aW9uKSB7XG4gICAgaWYgKGl0ZW0ua2V5ID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdCA9IG9wZXJhdGlvbjtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKSB7XG4gIHJldHVybiB7XG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc195ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc193ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b2RheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9kYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzEyMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gZnVuY3Rpb24obW9udGgpIHtcbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICByZXR1cm4gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICByZXR1cm4gNjtcbiAgfVxuICByZXR1cm4gOTtcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICB5ZWFyLS07XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSB7XG4gICAgbW9udGggPSA2O1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gNjtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoID0gMDtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRNb250aERheXMgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICB2YXIgZGF5cywgZW5kRGF0ZSwgbWlsbGlzZWNvbmQsIHN0YXJ0RGF0ZTtcbiAgaWYgKG1vbnRoID09PSAxMSkge1xuICAgIHJldHVybiAzMTtcbiAgfVxuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMSk7XG4gIGRheXMgPSAoZW5kRGF0ZSAtIHN0YXJ0RGF0ZSkgLyBtaWxsaXNlY29uZDtcbiAgcmV0dXJuIGRheXM7XG59O1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoID09PSAwKSB7XG4gICAgbW9udGggPSAxMTtcbiAgICB5ZWFyLS07XG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgfVxuICBtb250aC0tO1xuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgdmFyIGN1cnJlbnRNb250aCwgY3VycmVudFllYXIsIGVuZFZhbHVlLCBmaXJzdERheSwgbGFiZWwsIGxhc3REYXksIGxhc3RNb25kYXksIGxhc3RNb250aEZpbmFsRGF5LCBsYXN0TW9udGhGaXJzdERheSwgbGFzdFF1YXJ0ZXJFbmREYXksIGxhc3RRdWFydGVyU3RhcnREYXksIGxhc3RTdW5kYXksIGxhc3RfMTIwX2RheXMsIGxhc3RfMzBfZGF5cywgbGFzdF82MF9kYXlzLCBsYXN0XzdfZGF5cywgbGFzdF85MF9kYXlzLCBtaWxsaXNlY29uZCwgbWludXNEYXksIG1vbmRheSwgbW9udGgsIG5leHRNb25kYXksIG5leHRNb250aEZpbmFsRGF5LCBuZXh0TW9udGhGaXJzdERheSwgbmV4dFF1YXJ0ZXJFbmREYXksIG5leHRRdWFydGVyU3RhcnREYXksIG5leHRTdW5kYXksIG5leHRZZWFyLCBuZXh0XzEyMF9kYXlzLCBuZXh0XzMwX2RheXMsIG5leHRfNjBfZGF5cywgbmV4dF83X2RheXMsIG5leHRfOTBfZGF5cywgbm93LCBwcmV2aW91c1llYXIsIHN0YXJ0VmFsdWUsIHN0ckVuZERheSwgc3RyRmlyc3REYXksIHN0ckxhc3REYXksIHN0ck1vbmRheSwgc3RyU3RhcnREYXksIHN0clN1bmRheSwgc3RyVG9kYXksIHN0clRvbW9ycm93LCBzdHJZZXN0ZGF5LCBzdW5kYXksIHRoaXNRdWFydGVyRW5kRGF5LCB0aGlzUXVhcnRlclN0YXJ0RGF5LCB0b21vcnJvdywgdmFsdWVzLCB3ZWVrLCB5ZWFyLCB5ZXN0ZGF5O1xuICBub3cgPSBuZXcgRGF0ZSgpO1xuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHllc3RkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIHdlZWsgPSBub3cuZ2V0RGF5KCk7XG4gIG1pbnVzRGF5ID0gd2VlayAhPT0gMCA/IHdlZWsgLSAxIDogNjtcbiAgbW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICBuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIGN1cnJlbnRZZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMTtcbiAgbmV4dFllYXIgPSBjdXJyZW50WWVhciArIDE7XG4gIGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpO1xuICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIG1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIGZpcnN0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgMSk7XG4gIGlmIChjdXJyZW50TW9udGggPT09IDExKSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoKys7XG4gIH0gZWxzZSB7XG4gICAgbW9udGgrKztcbiAgfVxuICBuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgbmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgQ3JlYXRvci5nZXRNb250aERheXMoeWVhciwgbW9udGgpKTtcbiAgbGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdGhpc1F1YXJ0ZXJTdGFydERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksIDEpO1xuICB0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMikpO1xuICBsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN3aXRjaCAoa2V5KSB7XG4gICAgY2FzZSBcImxhc3RfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChmaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChsYXN0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc193ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwieWVzdGRheVwiOlxuICAgICAgc3RyWWVzdGRheSA9IG1vbWVudCh5ZXN0ZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvZGF5XCI6XG4gICAgICBzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b2RheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9tb3Jyb3dcIjpcbiAgICAgIHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICB9XG4gIHZhbHVlcyA9IFtzdGFydFZhbHVlLCBlbmRWYWx1ZV07XG4gIGlmIChmaWVsZF90eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBfLmZvckVhY2godmFsdWVzLCBmdW5jdGlvbihmdikge1xuICAgICAgaWYgKGZ2KSB7XG4gICAgICAgIHJldHVybiBmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGxhYmVsOiBsYWJlbCxcbiAgICBrZXk6IGtleSxcbiAgICB2YWx1ZXM6IHZhbHVlc1xuICB9O1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIGlmIChmaWVsZF90eXBlICYmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdiZXR3ZWVuJztcbiAgfSBlbHNlIGlmIChbXCJ0ZXh0YXJlYVwiLCBcInRleHRcIiwgXCJjb2RlXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdjb250YWlucyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiPVwiO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICB2YXIgb3BlcmF0aW9ucywgb3B0aW9uYWxzO1xuICBvcHRpb25hbHMgPSB7XG4gICAgZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPVwiXG4gICAgfSxcbiAgICB1bmVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl91bmVxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD5cIlxuICAgIH0sXG4gICAgbGVzc190aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI8XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPlwiXG4gICAgfSxcbiAgICBsZXNzX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD1cIlxuICAgIH0sXG4gICAgZ3JlYXRlcl9vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj49XCJcbiAgICB9LFxuICAgIGNvbnRhaW5zOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSxcbiAgICAgIHZhbHVlOiBcImNvbnRhaW5zXCJcbiAgICB9LFxuICAgIG5vdF9jb250YWluOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9kb2VzX25vdF9jb250YWluXCIpLFxuICAgICAgdmFsdWU6IFwibm90Y29udGFpbnNcIlxuICAgIH0sXG4gICAgc3RhcnRzX3dpdGg6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLFxuICAgICAgdmFsdWU6IFwic3RhcnRzd2l0aFwiXG4gICAgfSxcbiAgICBiZXR3ZWVuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLFxuICAgICAgdmFsdWU6IFwiYmV0d2VlblwiXG4gICAgfVxuICB9O1xuICBpZiAoZmllbGRfdHlwZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscyk7XG4gIH1cbiAgb3BlcmF0aW9ucyA9IFtdO1xuICBpZiAoQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pO1xuICAgIENyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwidGV4dFwiIHx8IGZpZWxkX3R5cGUgPT09IFwidGV4dGFyZWFcIiB8fCBmaWVsZF90eXBlID09PSBcImh0bWxcIiB8fCBmaWVsZF90eXBlID09PSBcImNvZGVcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImN1cnJlbmN5XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMubGVzc190aGFuLCBvcHRpb25hbHMuZ3JlYXRlcl90aGFuLCBvcHRpb25hbHMubGVzc19vcl9lcXVhbCwgb3B0aW9uYWxzLmdyZWF0ZXJfb3JfZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcIlt0ZXh0XVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2Uge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfVxuICByZXR1cm4gb3BlcmF0aW9ucztcbn07XG5cblxuLypcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZmllbGRzLCBmaWVsZHNBcnIsIGZpZWxkc05hbWUsIHJlZjtcbiAgZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDA7XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaCh7XG4gICAgICBuYW1lOiBmaWVsZC5uYW1lLFxuICAgICAgc29ydF9ubzogZmllbGQuc29ydF9ub1xuICAgIH0pO1xuICB9KTtcbiAgZmllbGRzTmFtZSA9IFtdO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBmaWVsZHNOYW1lO1xufTtcbiIsIkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fVxuXG5pbml0VHJpZ2dlciA9IChvYmplY3RfbmFtZSwgdHJpZ2dlciktPlxuXHR0cnlcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRcdGlmICF0cmlnZ2VyLnRvZG9cblx0XHRcdHJldHVyblxuXHRcdHRvZG9XcmFwcGVyID0gKCktPlxuXHRcdFx0ICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWVcblx0XHRcdCAgcmV0dXJuIHRyaWdnZXIudG9kby5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG5cdFx0aWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLmluc2VydFwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/Lmluc2VydCh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLnVwZGF0ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnVwZGF0ZSh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLnJlbW92ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnJlbW92ZSh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIuaW5zZXJ0XCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy5pbnNlcnQodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnVwZGF0ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8udXBkYXRlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5yZW1vdmVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/LnJlbW92ZSh0b2RvV3JhcHBlcilcblx0Y2F0Y2ggZXJyb3Jcblx0XHRjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKVxuXG5jbGVhblRyaWdnZXIgPSAob2JqZWN0X25hbWUpLT5cblx0IyMjXG4gICAgXHTnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWw5piv5L2/55So5LiL5qCH5Yig6Zmk5a+56LGh55qE77yM5omA5Lul5q2k5aSE5Y+N6L2saG9va3Ppm4blkIjlkI7vvIzlho3liKDpmaRcbiAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuXHQjIyNcbiAgICAjVE9ETyDnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWwYnVnXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdPy5yZXZlcnNlKCkuZm9yRWFjaCAoX2hvb2spLT5cblx0XHRfaG9vay5yZW1vdmUoKVxuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IChvYmplY3RfbmFtZSktPlxuI1x0Y29uc29sZS5sb2coJ0NyZWF0b3IuaW5pdFRyaWdnZXJzIG9iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSlcblxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdXG5cblx0Xy5lYWNoIG9iai50cmlnZ2VycywgKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSktPlxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciBhbmQgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXG5cdFx0XHRpZiBfdHJpZ2dlcl9ob29rXG5cdFx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaylcblx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIiBhbmQgdHJpZ2dlci50b2RvIGFuZCB0cmlnZ2VyLndoZW5cblx0XHRcdF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlciBvYmplY3RfbmFtZSwgdHJpZ2dlclxuXHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKSIsInZhciBjbGVhblRyaWdnZXIsIGluaXRUcmlnZ2VyO1xuXG5DcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge307XG5cbmluaXRUcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHRyaWdnZXIpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGVycm9yLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHRvZG9XcmFwcGVyO1xuICB0cnkge1xuICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIGlmICghdHJpZ2dlci50b2RvKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRvZG9XcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZi5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYxID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYxLnVwZGF0ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjIgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjIucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYzID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjMuaW5zZXJ0KHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY0ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjQudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY1ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjUucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgIGVycm9yID0gZXJyb3IxO1xuICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKTtcbiAgfVxufTtcblxuY2xlYW5UcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcblxuICAvKlxuICAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuICAgKi9cbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSkgIT0gbnVsbCA/IHJlZi5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbihfaG9vaykge1xuICAgIHJldHVybiBfaG9vay5yZW1vdmUoKTtcbiAgfSkgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBvYmo7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0gPSBbXTtcbiAgcmV0dXJuIF8uZWFjaChvYmoudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSkge1xuICAgIHZhciBfdHJpZ2dlcl9ob29rO1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgaWYgKF90cmlnZ2VyX2hvb2spIHtcbiAgICAgICAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICByZXR1cm4gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKVxuXG5iYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJhbGxvd0NyZWF0ZVwiLCBcImFsbG93RGVsZXRlXCIsIFwiYWxsb3dFZGl0XCIsIFwiYWxsb3dSZWFkXCIsIFwibW9kaWZ5QWxsUmVjb3Jkc1wiLCBcInZpZXdBbGxSZWNvcmRzXCIsIFwibW9kaWZ5Q29tcGFueVJlY29yZHNcIiwgXCJ2aWV3Q29tcGFueVJlY29yZHNcIiwgXG5cdFwiYWxsb3dSZWFkRmlsZXNcIiwgXCJhbGxvd0VkaXRGaWxlc1wiLCBcImFsbG93Q3JlYXRlRmlsZXNcIiwgXCJhbGxvd0RlbGV0ZUZpbGVzXCIsIFwidmlld0FsbEZpbGVzXCIsIFwibW9kaWZ5QWxsRmlsZXNcIl0gXG5vdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJkaXNhYmxlZF9saXN0X3ZpZXdzXCIsIFwiZGlzYWJsZWRfYWN0aW9uc1wiLCBcInVucmVhZGFibGVfZmllbGRzXCIsIFwidW5lZGl0YWJsZV9maWVsZHNcIiwgXCJ1bnJlbGF0ZWRfb2JqZWN0c1wiLCBcInVuZWRpdGFibGVfcmVsYXRlZF9saXN0XCJdXG5wZXJtaXNzaW9uUHJvcE5hbWVzID0gXy51bmlvbiBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMsIG90aGVyUGVybWlzc2lvblByb3BOYW1lc1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiAhb2JqXG5cdFx0XHRyZXR1cm5cblx0XHRyZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpXG5cdGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGlmICFzcGFjZUlkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFxuXHQjIOmZhOS7tuadg+mZkOS4jeWGjeS4juWFtueItuiusOW9lee8lui+kemFjee9ruWFs+iBlFxuXHQjIGlmIHJlY29yZCBhbmQgb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIiBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdCMgXHQjIOWmguaenOaYr2Ntc19maWxlc+mZhOS7tu+8jOWImeadg+mZkOWPluWFtueItuiusOW9leadg+mZkFxuXHQjIFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJylcblx0IyBcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bor6bnu4bnlYzpnaJcblx0IyBcdFx0b2JqZWN0X25hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcblx0IyBcdFx0cmVjb3JkX2lkID0gcmVjb3JkLnBhcmVudC5faWQ7XG5cdCMgXHRlbHNlIFxuXHQjIFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tueahOeItuiusOW9leeVjOmdolxuXHQjIFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpO1xuXHQjIFx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcblx0IyBcdG9iamVjdF9maWVsZHNfa2V5cyA9IF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/LmZpZWxkcyBvciB7fSkgfHwgW107XG5cdCMgXHRzZWxlY3QgPSBfLmludGVyc2VjdGlvbihvYmplY3RfZmllbGRzX2tleXMsIFsnb3duZXInLCAnY29tcGFueV9pZCcsICdjb21wYW55X2lkcycsICdsb2NrZWQnXSkgfHwgW107XG5cdCMgXHRpZiBzZWxlY3QubGVuZ3RoID4gMFxuXHQjIFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3Quam9pbignLCcpKTtcblx0IyBcdGVsc2Vcblx0IyBcdFx0cmVjb3JkID0gbnVsbDtcblxuXHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSlcblxuXHRpZiByZWNvcmRcblx0XHRpZiAhXy5pc0VtcHR5KHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnMpXG5cdFx0XHRyZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9uc1xuXG5cdFx0aXNPd25lciA9IHJlY29yZC5vd25lciA9PSB1c2VySWQgfHwgcmVjb3JkLm93bmVyPy5faWQgPT0gdXNlcklkXG5cblx0XHRpZiBvYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHQjIOmZhOS7tueahOafpeeci+aJgOacieS/ruaUueaJgOacieadg+mZkOS4jumZhOS7tuWvueixoeeahHZpZXdBbGxSZWNvcmRz44CBbW9kaWZ5QWxsUmVjb3Jkc+aXoOWFs++8jOWPquS4juWFtuS4u+ihqOiusOW9leeahHZpZXdBbGxGaWxlc+WSjG1vZGlmeUFsbEZpbGVz5pyJ5YWzXG5cdFx0XHQjIOWmguaenOaYr2Ntc19maWxlc+mZhOS7tu+8jOWImeadg+mZkOmcgOimgemineWkluiAg+iZkeWFtueItuWvueixoeS4iuWFs+S6jumZhOS7tueahOadg+mZkOmFjee9rlxuXHRcdFx0bWFzdGVyT2JqZWN0TmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuXHRcdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMobWFzdGVyT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHBlcm1pc3Npb25zLmFsbG93RGVsZXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dEZWxldGVGaWxlc1xuXHRcdFx0aWYgIW1hc3RlclJlY29yZFBlcm0ubW9kaWZ5QWxsRmlsZXMgYW5kICFpc093bmVyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHBlcm1pc3Npb25zLmFsbG93UmVhZCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZEZpbGVzXG5cdFx0XHRpZiAhbWFzdGVyUmVjb3JkUGVybS52aWV3QWxsRmlsZXMgYW5kICFpc093bmVyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKVxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQ/LmNvbXBhbnlfaWRcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSBhbmQgcmVjb3JkX2NvbXBhbnlfaWQuX2lkXG5cdFx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWTmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahG9iamVjdO+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxuXHRcdFx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZFxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkPy5jb21wYW55X2lkc1xuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSlcblx0XHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZHPmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahFtvYmplY3Rd77yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XG5cdFx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoKG4pLT4gbi5faWQpXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSlcblx0XHRcdGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcblx0XHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdFxuXHRcdFx0aWYgcmVjb3JkLmxvY2tlZCBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXG5cdFx0XHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcblx0XHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+afpeeci1xuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6K6w5b2V5pyJY29tcGFueV9pZOWxnuaAp++8jOS9huaYr+W9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPkuLrnqbrml7bvvIzorqTkuLrml6DmnYPmn6XnnItcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFxuXHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXG4jIGN1cnJlbnRPYmplY3ROYW1l77ya5b2T5YmN5Li75a+56LGhXG4jIHJlbGF0ZWRMaXN0SXRlbe+8mkNyZWF0b3IuZ2V0UmVsYXRlZExpc3QoU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSwgU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikp5Lit5Y+WcmVsYXRlZF9vYmplY3RfbmFtZeWvueW6lOeahOWAvFxuIyBjdXJyZW50UmVjb3Jk5b2T5YmN5Li75a+56LGh55qE6K+m57uG6K6w5b2VXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Q3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxuXHRcdGlmICFjdXJyZW50T2JqZWN0TmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRcdGlmICFyZWxhdGVkTGlzdEl0ZW1cblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG5cdFx0XHRyZXR1cm4ge31cblxuXHRcdGlmICFjdXJyZW50UmVjb3JkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXG5cblx0XHRpZiAhdXNlcklkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdFx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXG5cdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZClcblx0XHRyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSlcblx0XHRyZXN1bHQgPSBfLmNsb25lIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9uc1xuXG5cdFx0aWYgcmVsYXRlZExpc3RJdGVtLmlzX2ZpbGVcblx0XHRcdHJlc3VsdC5hbGxvd0NyZWF0ZSA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRcdHJlc3VsdC5hbGxvd0VkaXQgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXNcblx0XHRlbHNlXG5cdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRMaXN0SXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB8fCBmYWxzZVxuXHRcdFx0bWFzdGVyQWxsb3cgPSBmYWxzZVxuXHRcdFx0aWYgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT0gdHJ1ZVxuXHRcdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkXG5cdFx0XHRlbHNlIGlmIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09IGZhbHNlXG5cdFx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRcblxuXHRcdFx0dW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSlcblx0XHRcdGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xXG5cblx0XHRcdHJlc3VsdC5hbGxvd0NyZWF0ZSA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlXG5cdFx0XHRyZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlXG5cdFx0cmV0dXJuIHJlc3VsdFxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCkgLT5cblx0XHRwZXJtaXNzaW9ucyA9XG5cdFx0XHRvYmplY3RzOiB7fVxuXHRcdFx0YXNzaWduZWRfYXBwczogW11cblx0XHQjIyNcblx0XHTmnYPpmZDpm4bor7TmmI46XG5cdFx05YaF572u5p2D6ZmQ6ZuGLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxuXHRcdOiHquWumuS5ieadg+mZkOmbhi3mlbDmja7lupPkuK3mlrDlu7rnmoTpmaTlhoXnva7mnYPpmZDpm4bku6XlpJbnmoTlhbbku5bmnYPpmZDpm4Zcblx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxuXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOmbhlxuXHRcdCMjI1xuXG5cdFx0aXNTcGFjZUFkbWluID0gZmFsc2Vcblx0XHRzcGFjZVVzZXIgPSBudWxsXG5cdFx0aWYgdXNlcklkXG5cdFx0XHRpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXG5cdFx0cHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0ZWxzZVxuXHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXG5cdFx0cHNldHNBZG1pbl9wb3MgPSBudWxsXG5cdFx0cHNldHNVc2VyX3BvcyA9IG51bGxcblx0XHRwc2V0c01lbWJlcl9wb3MgPSBudWxsXG5cdFx0cHNldHNHdWVzdF9wb3MgPSBudWxsXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IG51bGxcblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGxcblx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGxcblxuXHRcdGlmIHBzZXRzQWRtaW4/Ll9pZFxuXHRcdFx0cHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNVc2VyPy5faWRcblx0XHRcdHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c01lbWJlcj8uX2lkXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzR3Vlc3Q/Ll9pZFxuXHRcdFx0cHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNTdXBwbGllcj8uX2lkXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c0N1c3RvbWVyPy5faWRcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXG5cdFx0aWYgcHNldHNDdXJyZW50Lmxlbmd0aCA+IDBcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJfaWRcIlxuXHRcdFx0cHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogc2V0X2lkc319KS5mZXRjaCgpXG5cdFx0XHRwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIm5hbWVcIlxuXHRcdHBzZXRzID0ge1xuXHRcdFx0cHNldHNBZG1pbiwgXG5cdFx0XHRwc2V0c1VzZXIsIFxuXHRcdFx0cHNldHNDdXJyZW50LCBcblx0XHRcdHBzZXRzTWVtYmVyLCBcblx0XHRcdHBzZXRzR3Vlc3QsXG5cdFx0XHRwc2V0c1N1cHBsaWVyLFxuXHRcdFx0cHNldHNDdXN0b21lcixcblx0XHRcdGlzU3BhY2VBZG1pbixcblx0XHRcdHNwYWNlVXNlciwgXG5cdFx0XHRwc2V0c0FkbWluX3BvcywgXG5cdFx0XHRwc2V0c1VzZXJfcG9zLCBcblx0XHRcdHBzZXRzTWVtYmVyX3BvcywgXG5cdFx0XHRwc2V0c0d1ZXN0X3Bvcyxcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zLFxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MsXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zXG5cdFx0fVxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX2FwcHMgPSBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpXG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxuXHRcdHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXNcblx0XHRfaSA9IDBcblx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxuXHRcdFx0X2krK1xuXHRcdFx0aWYgIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT0gc3BhY2VJZFxuXHRcdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT0gJzAnICYmIGlzU3BhY2VBZG1pbilcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZClcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cdHVuaW9uUGx1cyA9IChhcnJheSwgb3RoZXIpIC0+XG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0XHRpZiAhYXJyYXlcblx0XHRcdGFycmF5ID0gW11cblx0XHRpZiAhb3RoZXJcblx0XHRcdG90aGVyID0gW11cblx0XHRyZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpXG5cblx0aW50ZXJzZWN0aW9uUGx1cyA9IChhcnJheSwgb3RoZXIpIC0+XG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0XHRpZiAhYXJyYXlcblx0XHRcdGFycmF5ID0gW11cblx0XHRpZiAhb3RoZXJcblx0XHRcdG90aGVyID0gW11cblx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKVxuXG5cdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyA9ICh0YXJnZXQsIHByb3BzKSAtPlxuXHRcdHByb3BOYW1lcyA9IHBlcm1pc3Npb25Qcm9wTmFtZXNcblx0XHRmaWxlc1Byb05hbWVzID0gXG5cdFx0aWYgcHJvcHNcblx0XHRcdF8uZWFjaCBwcm9wTmFtZXMsIChwcm9wTmFtZSkgLT5cblx0XHRcdFx0dGFyZ2V0W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXVxuXG5cdFx0XHQjIHRhcmdldC5hbGxvd0NyZWF0ZSA9IHByb3BzLmFsbG93Q3JlYXRlXG5cdFx0XHQjIHRhcmdldC5hbGxvd0RlbGV0ZSA9IHByb3BzLmFsbG93RGVsZXRlXG5cdFx0XHQjIHRhcmdldC5hbGxvd0VkaXQgPSBwcm9wcy5hbGxvd0VkaXRcblx0XHRcdCMgdGFyZ2V0LmFsbG93UmVhZCA9IHByb3BzLmFsbG93UmVhZFxuXHRcdFx0IyB0YXJnZXQubW9kaWZ5QWxsUmVjb3JkcyA9IHByb3BzLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdCMgdGFyZ2V0LnZpZXdBbGxSZWNvcmRzID0gcHJvcHMudmlld0FsbFJlY29yZHNcblx0XHRcdCMgdGFyZ2V0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcHJvcHMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdCMgdGFyZ2V0LnZpZXdDb21wYW55UmVjb3JkcyA9IHByb3BzLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHByb3BzLmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRcdCMgdGFyZ2V0LmRpc2FibGVkX2FjdGlvbnMgPSBwcm9wcy5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHQjIHRhcmdldC51bnJlYWRhYmxlX2ZpZWxkcyA9IHByb3BzLnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHQjIHRhcmdldC51bmVkaXRhYmxlX2ZpZWxkcyA9IHByb3BzLnVuZWRpdGFibGVfZmllbGRzXG5cdFx0XHQjIHRhcmdldC51bnJlbGF0ZWRfb2JqZWN0cyA9IHByb3BzLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0XHQjIHRhcmdldC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHByb3BzLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XG5cblx0b3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzID0gKHRhcmdldCwgcHJvcHMpIC0+XG5cdFx0cHJvcE5hbWVzID0gYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzXG5cdFx0Xy5lYWNoIHByb3BOYW1lcywgKHByb3BOYW1lKSAtPlxuXHRcdFx0aWYgcHJvcHNbcHJvcE5hbWVdXG5cdFx0XHRcdHRhcmdldFtwcm9wTmFtZV0gPSB0cnVlXG5cdFx0XG5cdFx0IyBpZiBwby5hbGxvd1JlYWRcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdCMgaWYgcG8uYWxsb3dDcmVhdGVcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0VkaXRcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdCMgaWYgcG8uYWxsb3dEZWxldGVcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0IyBpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlXG5cdFx0IyBpZiBwby52aWV3QWxsUmVjb3Jkc1xuXHRcdCMgXHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0XHQjIGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXHRcdCMgaWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblxuXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c1N1cHBsaWVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c0N1c3RvbWVyID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdCMgcHNldHNNZW1iZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHQjIHBzZXRzR3Vlc3QgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0c3BhY2VVc2VyID0gbnVsbDtcblx0XHRpZiB1c2VySWRcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0ZWxzZVxuXHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0YXBwcyA9IFtdXG5cdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHRyZXR1cm4gW11cblx0XHRlbHNlXG5cdFx0XHR1c2VyUHJvZmlsZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KT8ucHJvZmlsZVxuXHRcdFx0cHNldEJhc2UgPSBwc2V0c1VzZXJcblx0XHRcdGlmIHVzZXJQcm9maWxlXG5cdFx0XHRcdGlmIHVzZXJQcm9maWxlID09ICdzdXBwbGllcidcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXJcblx0XHRcdFx0ZWxzZSBpZiB1c2VyUHJvZmlsZSA9PSAnY3VzdG9tZXInXG5cdFx0XHRcdFx0cHNldEJhc2UgPSBwc2V0c0N1c3RvbWVyXG5cdFx0XHRpZiBwc2V0QmFzZT8uYXNzaWduZWRfYXBwcz8ubGVuZ3RoXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHNcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyB1c2Vy5p2D6ZmQ6ZuG5Lit55qEYXNzaWduZWRfYXBwc+ihqOekuuaJgOacieeUqOaIt+WFt+acieeahGFwcHPmnYPpmZDvvIzkuLrnqbrliJnooajnpLrmnInmiYDmnIlhcHBz5p2D6ZmQ77yM5LiN6ZyA6KaB5L2c5p2D6ZmQ5Yik5pat5LqGXG5cdFx0XHRcdHJldHVybiBbXVxuXHRcdFx0Xy5lYWNoIHBzZXRzLCAocHNldCktPlxuXHRcdFx0XHRpZiAhcHNldC5hc3NpZ25lZF9hcHBzXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGlmIHBzZXQubmFtZSA9PSBcImFkbWluXCIgfHwgIHBzZXQubmFtZSA9PSBcInVzZXJcIiB8fCBwc2V0Lm5hbWUgPT0gJ3N1cHBsaWVyJyB8fCBwc2V0Lm5hbWUgPT0gJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdCMg6L+Z6YeM5LmL5omA5Lul6KaB5o6S6ZmkYWRtaW4vdXNlcu+8jOaYr+WboOS4uui/meS4pOS4quadg+mZkOmbhuaYr+aJgOacieadg+mZkOmbhuS4rXVzZXJz5bGe5oCn5peg5pWI55qE5p2D6ZmQ6ZuG77yM54m55oyH5bel5L2c5Yy6566h55CG5ZGY5ZKM5omA5pyJ55So5oi3XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwc1xuXHRcdFx0cmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksdW5kZWZpbmVkLG51bGwpXG5cblx0Q3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRhZG1pbk1lbnVzID0gQ3JlYXRvci5BcHBzLmFkbWluPy5hZG1pbl9tZW51c1xuXHRcdCMg5aaC5p6c5rKh5pyJYWRtaW7oj5zljZXor7TmmI7kuI3pnIDopoHnm7jlhbPlip/og73vvIznm7TmjqXov5Tlm57nqbpcblx0XHR1bmxlc3MgYWRtaW5NZW51c1xuXHRcdFx0cmV0dXJuIFtdXG5cdFx0YWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kIChuKSAtPlxuXHRcdFx0bi5faWQgPT0gJ2Fib3V0J1xuXHRcdGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlciAobikgLT5cblx0XHRcdG4uX2lkICE9ICdhYm91dCdcblx0XHRvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkgXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgKG4pIC0+XG5cdFx0XHRyZXR1cm4gbi5hZG1pbl9tZW51cyBhbmQgbi5faWQgIT0gJ2FkbWluJ1xuXHRcdCksICdzb3J0J1xuXHRcdG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKVxuXHRcdCMg6I+c5Y2V5pyJ5LiJ6YOo5YiG57uE5oiQ77yM6K6+572uQVBQ6I+c5Y2V44CB5YW25LuWQVBQ6I+c5Y2V5Lul5Y+KYWJvdXToj5zljZVcblx0XHRhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pXG5cdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHQjIOW3peS9nOWMuueuoeeQhuWRmOacieWFqOmDqOiPnOWNleWKn+iDvVxuXHRcdFx0cmVzdWx0ID0gYWxsTWVudXNcblx0XHRlbHNlXG5cdFx0XHR1c2VyUHJvZmlsZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KT8ucHJvZmlsZSB8fCAndXNlcidcblx0XHRcdGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAgKG4pIC0+XG5cdFx0XHRcdHJldHVybiBuLm5hbWVcblx0XHRcdG1lbnVzID0gYWxsTWVudXMuZmlsdGVyIChtZW51KS0+XG5cdFx0XHRcdHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzXG5cdFx0XHRcdCMg5aaC5p6c5pmu6YCa55So5oi35pyJ5p2D6ZmQ77yM5YiZ55u05o6l6L+U5ZuedHJ1ZVxuXHRcdFx0XHRpZiBwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YodXNlclByb2ZpbGUpID4gLTFcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0XHQjIOWQpuWImeWPluW9k+WJjeeUqOaIt+eahOadg+mZkOmbhuS4jm1lbnXoj5zljZXopoHmsYLnmoTmnYPpmZDpm4blr7nmr5TvvIzlpoLmnpzkuqTpm4blpKfkuo4x5Liq5YiZ6L+U5ZuedHJ1ZVxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGhcblx0XHRcdHJlc3VsdCA9IG1lbnVzXG5cdFx0XG5cdFx0cmV0dXJuIF8uc29ydEJ5KHJlc3VsdCxcInNvcnRcIilcblxuXHRmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKS0+XG5cblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gXy5maW5kIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XG5cdFx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZH0pXG5cblx0ZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpLT5cblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gXy5maWx0ZXIgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cblx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHBlcm1pc3Npb25fc2V0X2lkc319KS5mZXRjaCgpXG5cblx0dW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IChwb3MsIG9iamVjdCwgcHNldHMpLT5cblx0XHQjIOaKimRi5Y+KeW1s5Lit55qEcGVybWlzc2lvbl9vYmplY3Rz5ZCI5bm277yM5LyY5YWI5Y+WZGLkuK3nmoRcblx0XHRyZXN1bHQgPSBbXVxuXHRcdF8uZWFjaCBvYmplY3QucGVybWlzc2lvbl9zZXQsIChvcHMsIG9wc19rZXkpLT5cblx0XHRcdCMg5oqKeW1s5Lit6Zmk5LqG54m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ6ZuGXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwi5aSW55qE5YW25LuW5a+56LGh5p2D6ZmQ5YWI5a2Y5YWlcmVzdWx0XG5cdFx0XHQjIGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCIsIFwid29ya2Zsb3dfYWRtaW5cIiwgXCJvcmdhbml6YXRpb25fYWRtaW5cIl0uaW5kZXhPZihvcHNfa2V5KSA8IDBcblx0XHRcdGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXG5cdFx0XHRcdGN1cnJlbnRQc2V0ID0gcHNldHMuZmluZCAocHNldCktPiByZXR1cm4gcHNldC5uYW1lID09IG9wc19rZXlcblx0XHRcdFx0aWYgY3VycmVudFBzZXRcblx0XHRcdFx0XHR0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9XG5cdFx0XHRcdFx0dGVtcE9wcy5wZXJtaXNzaW9uX3NldF9pZCA9IGN1cnJlbnRQc2V0Ll9pZFxuXHRcdFx0XHRcdHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZXN1bHQucHVzaCB0ZW1wT3BzXG5cdFx0aWYgcmVzdWx0Lmxlbmd0aFxuXHRcdFx0cG9zLmZvckVhY2ggKHBvKS0+XG5cdFx0XHRcdHJlcGVhdEluZGV4ID0gMFxuXHRcdFx0XHRyZXBlYXRQbyA9IHJlc3VsdC5maW5kKChpdGVtLCBpbmRleCktPiByZXBlYXRJbmRleCA9IGluZGV4O3JldHVybiBpdGVtLnBlcm1pc3Npb25fc2V0X2lkID09IHBvLnBlcm1pc3Npb25fc2V0X2lkKVxuXHRcdFx0XHQjIOWmguaenHltbOS4reW3sue7j+WtmOWcqHBv77yM5YiZ5pu/5o2i5Li65pWw5o2u5bqT5Lit55qEcG/vvIzlj43kuYvliJnmiormlbDmja7lupPkuK3nmoRwb+ebtOaOpee0r+WKoOi/m+WOu1xuXHRcdFx0XHRpZiByZXBlYXRQb1xuXHRcdFx0XHRcdHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwb1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggcG9cblx0XHRcdHJldHVybiByZXN1bHRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gcG9zXG5cblx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKS0+XG5cdFx0cGVybWlzc2lvbnMgPSB7fVxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKVxuXG5cdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09IFwidXNlcnNcIlxuXHRcdFx0cGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cblx0XHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cdFx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblx0XHRwc2V0c0FkbWluID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSBvciB0aGlzLnBzZXRzQWRtaW4gdGhlbiB0aGlzLnBzZXRzQWRtaW4gZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNVc2VyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIG9yIHRoaXMucHNldHNVc2VyIHRoZW4gdGhpcy5wc2V0c1VzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c01lbWJlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIG9yIHRoaXMucHNldHNNZW1iZXIgdGhlbiB0aGlzLnBzZXRzTWVtYmVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c0d1ZXN0ID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSBvciB0aGlzLnBzZXRzR3Vlc3QgdGhlbiB0aGlzLnBzZXRzR3Vlc3QgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxfX0pXG5cblx0XHRwc2V0c1N1cHBsaWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSBvciB0aGlzLnBzZXRzU3VwcGxpZXIgdGhlbiB0aGlzLnBzZXRzU3VwcGxpZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNDdXN0b21lciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgb3IgdGhpcy5wc2V0c0N1c3RvbWVyIHRoZW4gdGhpcy5wc2V0c0N1c3RvbWVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQ7XG5cdFx0aWYgIXBzZXRzXG5cdFx0XHRzcGFjZVVzZXIgPSBudWxsO1xuXHRcdFx0aWYgdXNlcklkXG5cdFx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblxuXHRcdHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3Bvc1xuXHRcdHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3Ncblx0XHRwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3Bvc1xuXHRcdHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3Bvc1xuXG5cdFx0cHNldHNTdXBwbGllcl9wb3MgPSB0aGlzLnBzZXRzU3VwcGxpZXJfcG9zXG5cdFx0cHNldHNDdXN0b21lcl9wb3MgPSB0aGlzLnBzZXRzQ3VzdG9tZXJfcG9zXG5cblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zXG5cblx0XHRvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9XG5cdFx0b3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge31cblx0XHRvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge31cblx0XHRvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XG5cblx0XHRvcHNldFN1cHBsaWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuc3VwcGxpZXIpIHx8IHt9XG5cdFx0b3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fVxuXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF9saXN0dmlld3MnKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzaGFyZWQ6IHRydWV9LCB7ZmllbGRzOntfaWQ6MX19KS5mZXRjaCgpXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBfLnBsdWNrKHNoYXJlZExpc3RWaWV3cyxcIl9pZFwiKVxuXHRcdCMgaWYgc2hhcmVkTGlzdFZpZXdzLmxlbmd0aFxuXHRcdCMgXHR1bmxlc3Mgb3BzZXRBZG1pbi5saXN0X3ZpZXdzXG5cdFx0IyBcdFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gW11cblx0XHQjIFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldEFkbWluLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xuXHRcdCMgXHR1bmxlc3Mgb3BzZXRVc2VyLmxpc3Rfdmlld3Ncblx0XHQjIFx0XHRvcHNldFVzZXIubGlzdF92aWV3cyA9IFtdXG5cdFx0IyBcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldFVzZXIubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXG5cdFx0IyDmlbDmja7lupPkuK3lpoLmnpzphY3nva7kuobpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ6ZuG6K6+572u77yM5bqU6K+l6KaG55uW5Luj56CB5LitYWRtaW4vdXNlcueahOadg+mZkOmbhuiuvue9rlxuXHRcdGlmIHBzZXRzQWRtaW5cblx0XHRcdHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0QWRtaW4sIHBvc0FkbWluXG5cdFx0aWYgcHNldHNVc2VyXG5cdFx0XHRwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldFVzZXIsIHBvc1VzZXJcblx0XHRpZiBwc2V0c01lbWJlclxuXHRcdFx0cG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRNZW1iZXIsIHBvc01lbWJlclxuXHRcdGlmIHBzZXRzR3Vlc3Rcblx0XHRcdHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0R3Vlc3QsIHBvc0d1ZXN0XG5cdFx0aWYgcHNldHNTdXBwbGllclxuXHRcdFx0cG9zU3VwcGxpZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzU3VwcGxpZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNTdXBwbGllci5faWQpO1xuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0U3VwcGxpZXIsIHBvc1N1cHBsaWVyXG5cdFx0aWYgcHNldHNDdXN0b21lclxuXHRcdFx0cG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0Q3VzdG9tZXIsIHBvc0N1c3RvbWVyXG5cblx0XHRpZiAhdXNlcklkXG5cdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cblx0XHRlbHNlXG5cdFx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2NvbW1vbidcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c3BhY2VVc2VyID0gaWYgXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIG9yIHRoaXMuc3BhY2VVc2VyIHRoZW4gdGhpcy5zcGFjZVVzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRcdFx0XHRpZiBzcGFjZVVzZXJcblx0XHRcdFx0XHRcdHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0XHRcdFx0aWYgcHJvZlxuXHRcdFx0XHRcdFx0XHRpZiBwcm9mIGlzICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnbWVtYmVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdndWVzdCdcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Rcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdzdXBwbGllcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdjdXN0b21lcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0Q3VzdG9tZXJcblx0XHRcdFx0XHRcdGVsc2UgIyDmsqHmnIlwcm9maWxl5YiZ6K6k5Li65pivdXNlcuadg+mZkFxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxuXHRcdGlmIHBzZXRzLmxlbmd0aCA+IDBcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzLCBcIl9pZFwiXG5cdFx0XHRwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKVxuXHRcdFx0cG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpXG5cdFx0XHRfLmVhY2ggcG9zLCAocG8pLT5cblx0XHRcdFx0aWYgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNBZG1pbj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1VzZXI/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNNZW1iZXI/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNHdWVzdD8uX2lkIG9yXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzU3VwcGxpZXI/Ll9pZCBvclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0N1c3RvbWVyPy5faWRcblx0XHRcdFx0XHQjIOm7mOiupOeahGFkbWluL3VzZXLmnYPpmZDlgLzlj6rlrp7ooYzkuIrpnaLnmoTpu5jorqTlgLzopobnm5bvvIzkuI3lgZrnrpfms5XliKTmlq1cblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgXy5pc0VtcHR5KHBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gcG9cblx0XHRcdFx0b3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzIHBlcm1pc3Npb25zLCBwb1xuXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpXG5cdFx0XG5cdFx0aWYgb2JqZWN0LmlzX3ZpZXdcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXVxuXHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cblx0XHRpZiBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcblx0XHRcdHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblxuXHQjIENyZWF0b3IuaW5pdFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lKSAtPlxuXG5cdFx0IyAjIOW6lOivpeaKiuiuoeeul+WHuuadpeeahFxuXHRcdCMgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV0uYWxsb3dcblx0XHQjIFx0aW5zZXJ0OiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdCAgICBcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cdFx0IyBcdHVwZGF0ZTogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RWRpdFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblx0XHQjIFx0cmVtb3ZlOiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cblx0TWV0ZW9yLm1ldGhvZHNcblx0XHQjIENhbGN1bGF0ZSBQZXJtaXNzaW9ucyBvbiBTZXJ2ZXJcblx0XHRcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IChzcGFjZUlkKS0+XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZClcbiIsInZhciBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMsIGNsb25lLCBleHRlbmRQZXJtaXNzaW9uUHJvcHMsIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QsIGZpbmRfcGVybWlzc2lvbl9vYmplY3QsIGludGVyc2VjdGlvblBsdXMsIG90aGVyUGVybWlzc2lvblByb3BOYW1lcywgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzLCBwZXJtaXNzaW9uUHJvcE5hbWVzLCB1bmlvblBlcm1pc3Npb25PYmplY3RzLCB1bmlvblBsdXM7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiYWxsb3dDcmVhdGVcIiwgXCJhbGxvd0RlbGV0ZVwiLCBcImFsbG93RWRpdFwiLCBcImFsbG93UmVhZFwiLCBcIm1vZGlmeUFsbFJlY29yZHNcIiwgXCJ2aWV3QWxsUmVjb3Jkc1wiLCBcIm1vZGlmeUNvbXBhbnlSZWNvcmRzXCIsIFwidmlld0NvbXBhbnlSZWNvcmRzXCIsIFwiYWxsb3dSZWFkRmlsZXNcIiwgXCJhbGxvd0VkaXRGaWxlc1wiLCBcImFsbG93Q3JlYXRlRmlsZXNcIiwgXCJhbGxvd0RlbGV0ZUZpbGVzXCIsIFwidmlld0FsbEZpbGVzXCIsIFwibW9kaWZ5QWxsRmlsZXNcIl07XG5cbm90aGVyUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImRpc2FibGVkX2xpc3Rfdmlld3NcIiwgXCJkaXNhYmxlZF9hY3Rpb25zXCIsIFwidW5yZWFkYWJsZV9maWVsZHNcIiwgXCJ1bmVkaXRhYmxlX2ZpZWxkc1wiLCBcInVucmVsYXRlZF9vYmplY3RzXCIsIFwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcIl07XG5cbnBlcm1pc3Npb25Qcm9wTmFtZXMgPSBfLnVuaW9uKGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzKTtcblxuQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIG9iajtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KCk7XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIGlzT3duZXIsIG1hc3Rlck9iamVjdE5hbWUsIG1hc3RlclJlY29yZFBlcm0sIHBlcm1pc3Npb25zLCByZWNvcmRfY29tcGFueV9pZCwgcmVjb3JkX2NvbXBhbnlfaWRzLCByZWYsIHVzZXJfY29tcGFueV9pZHM7XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICB9XG4gIHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKTtcbiAgaWYgKHJlY29yZCkge1xuICAgIGlmICghXy5pc0VtcHR5KHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnMpKSB7XG4gICAgICByZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucztcbiAgICB9XG4gICAgaXNPd25lciA9IHJlY29yZC5vd25lciA9PT0gdXNlcklkIHx8ICgocmVmID0gcmVjb3JkLm93bmVyKSAhPSBudWxsID8gcmVmLl9pZCA6IHZvaWQgMCkgPT09IHVzZXJJZDtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIG1hc3Rlck9iamVjdE5hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcbiAgICAgIG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG1hc3Rlck9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlcztcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RGVsZXRlRmlsZXM7XG4gICAgICBpZiAoIW1hc3RlclJlY29yZFBlcm0ubW9kaWZ5QWxsRmlsZXMgJiYgIWlzT3duZXIpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRGaWxlcztcbiAgICAgIGlmICghbWFzdGVyUmVjb3JkUGVybS52aWV3QWxsRmlsZXMgJiYgIWlzT3duZXIpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgdXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmNvbXBhbnlfaWQgOiB2b2lkIDA7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWQgJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgJiYgcmVjb3JkX2NvbXBhbnlfaWQuX2lkKSB7XG4gICAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkO1xuICAgICAgfVxuICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZHMgOiB2b2lkIDA7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZHNbMF0pKSB7XG4gICAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSk7XG4gICAgICBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlY29yZC5sb2NrZWQgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHVzZXJfY29tcGFueV9pZHMgJiYgdXNlcl9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcGVybWlzc2lvbnM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICAgIHZhciBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUsIG1hc3RlckFsbG93LCBtYXN0ZXJSZWNvcmRQZXJtLCByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMsIHJlc3VsdCwgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgIGlmICghY3VycmVudE9iamVjdE5hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghcmVsYXRlZExpc3RJdGVtKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwicmVsYXRlZExpc3RJdGVtIG11c3Qgbm90IGJlIGVtcHR5IGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zXCIpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAoIWN1cnJlbnRSZWNvcmQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50UmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zKGN1cnJlbnRPYmplY3ROYW1lLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpO1xuICAgIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKTtcbiAgICByZXN1bHQgPSBfLmNsb25lKHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0SXRlbS5pc19maWxlKSB7XG4gICAgICByZXN1bHQuYWxsb3dDcmVhdGUgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzO1xuICAgICAgcmVzdWx0LmFsbG93RWRpdCA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlcztcbiAgICB9IGVsc2Uge1xuICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkTGlzdEl0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfHwgZmFsc2U7XG4gICAgICBtYXN0ZXJBbGxvdyA9IGZhbHNlO1xuICAgICAgaWYgKHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09PSB0cnVlKSB7XG4gICAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWQ7XG4gICAgICB9IGVsc2UgaWYgKHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09PSBmYWxzZSkge1xuICAgICAgICBtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0O1xuICAgICAgfVxuICAgICAgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSk7XG4gICAgICBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMTtcbiAgICAgIHJlc3VsdC5hbGxvd0NyZWF0ZSA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgICAgcmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIF9pLCBpc1NwYWNlQWRtaW4sIHBlcm1pc3Npb25zLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudCwgcHNldHNDdXJyZW50TmFtZXMsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzQ3VzdG9tZXIsIHBzZXRzQ3VzdG9tZXJfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNTdXBwbGllciwgcHNldHNTdXBwbGllcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3Bvcywgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge1xuICAgICAgb2JqZWN0czoge30sXG4gICAgICBhc3NpZ25lZF9hcHBzOiBbXVxuICAgIH07XG5cbiAgICAvKlxuICAgIFx0XHTmnYPpmZDpm4bor7TmmI46XG4gICAgXHRcdOWGhee9ruadg+mZkOmbhi1hZG1pbix1c2VyLG1lbWJlcixndWVzdCx3b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW5cbiAgICBcdFx06Ieq5a6a5LmJ5p2D6ZmQ6ZuGLeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOmbhuS7peWklueahOWFtuS7luadg+mZkOmbhlxuICAgIFx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxuICAgIFx0XHTlj6/phY3nva7nlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+WPr+mFjee9ru+8iS13b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW7ku6Xlj4roh6rlrprkuYnmnYPpmZDpm4ZcbiAgICAgKi9cbiAgICBpc1NwYWNlQWRtaW4gPSBmYWxzZTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW5fcG9zID0gbnVsbDtcbiAgICBwc2V0c1VzZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c01lbWJlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gbnVsbDtcbiAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNDdXN0b21lcl9wb3MgPSBudWxsO1xuICAgIGlmIChwc2V0c0FkbWluICE9IG51bGwgPyBwc2V0c0FkbWluLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c01lbWJlci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0d1ZXN0ICE9IG51bGwgPyBwc2V0c0d1ZXN0Ll9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzU3VwcGxpZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNDdXN0b21lci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1cnJlbnQubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIl9pZFwiKTtcbiAgICAgIHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICAgJGluOiBzZXRfaWRzXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIm5hbWVcIik7XG4gICAgfVxuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnQsXG4gICAgICBwc2V0c01lbWJlcjogcHNldHNNZW1iZXIsXG4gICAgICBwc2V0c0d1ZXN0OiBwc2V0c0d1ZXN0LFxuICAgICAgcHNldHNTdXBwbGllcjogcHNldHNTdXBwbGllcixcbiAgICAgIHBzZXRzQ3VzdG9tZXI6IHBzZXRzQ3VzdG9tZXIsXG4gICAgICBpc1NwYWNlQWRtaW46IGlzU3BhY2VBZG1pbixcbiAgICAgIHNwYWNlVXNlcjogc3BhY2VVc2VyLFxuICAgICAgcHNldHNBZG1pbl9wb3M6IHBzZXRzQWRtaW5fcG9zLFxuICAgICAgcHNldHNVc2VyX3BvczogcHNldHNVc2VyX3BvcyxcbiAgICAgIHBzZXRzTWVtYmVyX3BvczogcHNldHNNZW1iZXJfcG9zLFxuICAgICAgcHNldHNHdWVzdF9wb3M6IHBzZXRzR3Vlc3RfcG9zLFxuICAgICAgcHNldHNTdXBwbGllcl9wb3M6IHBzZXRzU3VwcGxpZXJfcG9zLFxuICAgICAgcHNldHNDdXN0b21lcl9wb3M6IHBzZXRzQ3VzdG9tZXJfcG9zLFxuICAgICAgcHNldHNDdXJyZW50X3BvczogcHNldHNDdXJyZW50X3Bvc1xuICAgIH07XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzO1xuICAgIF9pID0gMDtcbiAgICBfLmVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvYmplY3QsIG9iamVjdF9uYW1lKSB7XG4gICAgICBfaSsrO1xuICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09PSBzcGFjZUlkKSB7XG4gICAgICAgIGlmICghXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT09ICcwJyB8fCAob2JqZWN0LmluX2RldmVsb3BtZW50ICE9PSAnMCcgJiYgaXNTcGFjZUFkbWluKSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKTtcbiAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIHVuaW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBpbnRlcnNlY3Rpb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLmludGVyc2VjdGlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBleHRlbmRQZXJtaXNzaW9uUHJvcHMgPSBmdW5jdGlvbih0YXJnZXQsIHByb3BzKSB7XG4gICAgdmFyIGZpbGVzUHJvTmFtZXMsIHByb3BOYW1lcztcbiAgICBwcm9wTmFtZXMgPSBwZXJtaXNzaW9uUHJvcE5hbWVzO1xuICAgIHJldHVybiBmaWxlc1Byb05hbWVzID0gcHJvcHMgPyBfLmVhY2gocHJvcE5hbWVzLCBmdW5jdGlvbihwcm9wTmFtZSkge1xuICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgfSkgOiB2b2lkIDA7XG4gIH07XG4gIG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcHMpIHtcbiAgICB2YXIgcHJvcE5hbWVzO1xuICAgIHByb3BOYW1lcyA9IGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcztcbiAgICByZXR1cm4gXy5lYWNoKHByb3BOYW1lcywgZnVuY3Rpb24ocHJvcE5hbWUpIHtcbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhcHBzLCBpc1NwYWNlQWRtaW4sIHBzZXRCYXNlLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNDdXN0b21lciwgcHNldHNTdXBwbGllciwgcHNldHNVc2VyLCByZWYsIHJlZjEsIHNwYWNlVXNlciwgdXNlclByb2ZpbGU7XG4gICAgcHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzU3VwcGxpZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICBpZiAodXNlcklkKSB7XG4gICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYXBwcyA9IFtdO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlclByb2ZpbGUgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZi5wcm9maWxlIDogdm9pZCAwO1xuICAgICAgcHNldEJhc2UgPSBwc2V0c1VzZXI7XG4gICAgICBpZiAodXNlclByb2ZpbGUpIHtcbiAgICAgICAgaWYgKHVzZXJQcm9maWxlID09PSAnc3VwcGxpZXInKSB7XG4gICAgICAgICAgcHNldEJhc2UgPSBwc2V0c1N1cHBsaWVyO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXJQcm9maWxlID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgcHNldEJhc2UgPSBwc2V0c0N1c3RvbWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHNldEJhc2UgIT0gbnVsbCA/IChyZWYxID0gcHNldEJhc2UuYXNzaWduZWRfYXBwcykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgXy5lYWNoKHBzZXRzLCBmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgIGlmICghcHNldC5hc3NpZ25lZF9hcHBzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwc2V0Lm5hbWUgPT09IFwiYWRtaW5cIiB8fCBwc2V0Lm5hbWUgPT09IFwidXNlclwiIHx8IHBzZXQubmFtZSA9PT0gJ3N1cHBsaWVyJyB8fCBwc2V0Lm5hbWUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLCB2b2lkIDAsIG51bGwpO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFib3V0TWVudSwgYWRtaW5NZW51cywgYWxsTWVudXMsIGN1cnJlbnRQc2V0TmFtZXMsIGlzU3BhY2VBZG1pbiwgbWVudXMsIG90aGVyTWVudUFwcHMsIG90aGVyTWVudXMsIHBzZXRzLCByZWYsIHJlZjEsIHJlc3VsdCwgdXNlclByb2ZpbGU7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIG5hbWU6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhZG1pbk1lbnVzID0gKHJlZiA9IENyZWF0b3IuQXBwcy5hZG1pbikgIT0gbnVsbCA/IHJlZi5hZG1pbl9tZW51cyA6IHZvaWQgMDtcbiAgICBpZiAoIWFkbWluTWVudXMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgYWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCA9PT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkICE9PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeShfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCBmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5hZG1pbl9tZW51cyAmJiBuLl9pZCAhPT0gJ2FkbWluJztcbiAgICB9KSwgJ3NvcnQnKTtcbiAgICBvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSk7XG4gICAgYWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXN1bHQgPSBhbGxNZW51cztcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlclByb2ZpbGUgPSAoKHJlZjEgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5wcm9maWxlIDogdm9pZCAwKSB8fCAndXNlcic7XG4gICAgICBjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4ubmFtZTtcbiAgICAgIH0pO1xuICAgICAgbWVudXMgPSBhbGxNZW51cy5maWx0ZXIoZnVuY3Rpb24obWVudSkge1xuICAgICAgICB2YXIgcHNldHNNZW51O1xuICAgICAgICBwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0cztcbiAgICAgICAgaWYgKHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZih1c2VyUHJvZmlsZSkgPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aDtcbiAgICAgIH0pO1xuICAgICAgcmVzdWx0ID0gbWVudXM7XG4gICAgfVxuICAgIHJldHVybiBfLnNvcnRCeShyZXN1bHQsIFwic29ydFwiKTtcbiAgfTtcbiAgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbmQocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWRcbiAgICB9KTtcbiAgfTtcbiAgZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcykge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAkaW46IHBlcm1pc3Npb25fc2V0X2lkc1xuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gIH07XG4gIHVuaW9uUGVybWlzc2lvbk9iamVjdHMgPSBmdW5jdGlvbihwb3MsIG9iamVjdCwgcHNldHMpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIHJlc3VsdCA9IFtdO1xuICAgIF8uZWFjaChvYmplY3QucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKG9wcywgb3BzX2tleSkge1xuICAgICAgdmFyIGN1cnJlbnRQc2V0LCB0ZW1wT3BzO1xuICAgICAgaWYgKFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwKSB7XG4gICAgICAgIGN1cnJlbnRQc2V0ID0gcHNldHMuZmluZChmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgICAgcmV0dXJuIHBzZXQubmFtZSA9PT0gb3BzX2tleTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjdXJyZW50UHNldCkge1xuICAgICAgICAgIHRlbXBPcHMgPSBfLmNsb25lKG9wcykgfHwge307XG4gICAgICAgICAgdGVtcE9wcy5wZXJtaXNzaW9uX3NldF9pZCA9IGN1cnJlbnRQc2V0Ll9pZDtcbiAgICAgICAgICB0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgICAgICAgIHJldHVybiByZXN1bHQucHVzaCh0ZW1wT3BzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XG4gICAgICBwb3MuZm9yRWFjaChmdW5jdGlvbihwbykge1xuICAgICAgICB2YXIgcmVwZWF0SW5kZXgsIHJlcGVhdFBvO1xuICAgICAgICByZXBlYXRJbmRleCA9IDA7XG4gICAgICAgIHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICByZXBlYXRJbmRleCA9IGluZGV4O1xuICAgICAgICAgIHJldHVybiBpdGVtLnBlcm1pc3Npb25fc2V0X2lkID09PSBwby5wZXJtaXNzaW9uX3NldF9pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZXBlYXRQbykge1xuICAgICAgICAgIHJldHVybiByZXN1bHRbcmVwZWF0SW5kZXhdID0gcG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHBvKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcG9zO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgaXNTcGFjZUFkbWluLCBvYmplY3QsIG9wc2V0QWRtaW4sIG9wc2V0Q3VzdG9tZXIsIG9wc2V0R3Vlc3QsIG9wc2V0TWVtYmVyLCBvcHNldFN1cHBsaWVyLCBvcHNldFVzZXIsIHBlcm1pc3Npb25zLCBwb3MsIHBvc0FkbWluLCBwb3NDdXN0b21lciwgcG9zR3Vlc3QsIHBvc01lbWJlciwgcG9zU3VwcGxpZXIsIHBvc1VzZXIsIHByb2YsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7fTtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk7XG4gICAgaWYgKHNwYWNlSWQgPT09ICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT09IFwidXNlcnNcIikge1xuICAgICAgcGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge307XG4gICAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIHx8IHRoaXMucHNldHNBZG1pbiA/IHRoaXMucHNldHNBZG1pbiA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSB8fCB0aGlzLnBzZXRzVXNlciA/IHRoaXMucHNldHNVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c01lbWJlciA9IF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIHx8IHRoaXMucHNldHNNZW1iZXIgPyB0aGlzLnBzZXRzTWVtYmVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzR3Vlc3QgPSBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIHx8IHRoaXMucHNldHNHdWVzdCA/IHRoaXMucHNldHNHdWVzdCA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzU3VwcGxpZXIpIHx8IHRoaXMucHNldHNTdXBwbGllciA/IHRoaXMucHNldHNTdXBwbGllciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzQ3VzdG9tZXIpIHx8IHRoaXMucHNldHNDdXN0b21lciA/IHRoaXMucHNldHNDdXN0b21lciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQ7XG4gICAgaWYgKCFwc2V0cykge1xuICAgICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICRvcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3BvcztcbiAgICBwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3BvcztcbiAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3M7XG4gICAgcHNldHNDdXN0b21lcl9wb3MgPSB0aGlzLnBzZXRzQ3VzdG9tZXJfcG9zO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3M7XG4gICAgb3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fTtcbiAgICBvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fTtcbiAgICBvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge307XG4gICAgb3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICBvcHNldFN1cHBsaWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuc3VwcGxpZXIpIHx8IHt9O1xuICAgIG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge307XG4gICAgaWYgKHBzZXRzQWRtaW4pIHtcbiAgICAgIHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldEFkbWluLCBwb3NBZG1pbik7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIpIHtcbiAgICAgIHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldFVzZXIsIHBvc1VzZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIpIHtcbiAgICAgIHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldE1lbWJlciwgcG9zTWVtYmVyKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QpIHtcbiAgICAgIHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldEd1ZXN0LCBwb3NHdWVzdCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1N1cHBsaWVyKSB7XG4gICAgICBwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRTdXBwbGllciwgcG9zU3VwcGxpZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lcikge1xuICAgICAgcG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0Q3VzdG9tZXIsIHBvc0N1c3RvbWVyKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3BhY2VJZCA9PT0gJ2NvbW1vbicpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFjZVVzZXIgPSBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgfHwgdGhpcy5zcGFjZVVzZXIgPyB0aGlzLnNwYWNlVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChzcGFjZVVzZXIpIHtcbiAgICAgICAgICAgIHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZTtcbiAgICAgICAgICAgIGlmIChwcm9mKSB7XG4gICAgICAgICAgICAgIGlmIChwcm9mID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnbWVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2d1ZXN0Jykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnc3VwcGxpZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0Q3VzdG9tZXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0cywgXCJfaWRcIik7XG4gICAgICBwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKTtcbiAgICAgIHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKTtcbiAgICAgIF8uZWFjaChwb3MsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIGlmIChwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pc0VtcHR5KHBlcm1pc3Npb25zKSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gcG87XG4gICAgICAgIH1cbiAgICAgICAgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzKHBlcm1pc3Npb25zLCBwbyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpO1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKTtcbiAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChvYmplY3QuaXNfdmlldykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW107XG4gICAgfVxuICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICBpZiAob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyKSB7XG4gICAgICBwZXJtaXNzaW9ucy5vd25lciA9IG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcjtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgXCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZCk7XG4gICAgfVxuICB9KTtcbn1cbiIsIlxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcblxuTWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SXG5cdG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXG5cdGlmIGNyZWF0b3JfZGJfdXJsXG5cdFx0aWYgIW9wbG9nX3VybFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpXG5cdFx0Q3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge19kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7b3Bsb2dVcmw6IG9wbG9nX3VybH0pfVxuXG5DcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lID0gKG9iamVjdCktPlxuI1x0aWYgb2JqZWN0LnRhYmxlX25hbWUgJiYgb2JqZWN0LnRhYmxlX25hbWUuZW5kc1dpdGgoXCJfX2NcIilcbiNcdFx0cmV0dXJuIG9iamVjdC50YWJsZV9uYW1lXG4jXHRlbHNlXG4jXHRcdHJldHVybiBvYmplY3QubmFtZVxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IChvYmplY3QpLT5cblx0Y29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdClcblx0aWYgZGJbY29sbGVjdGlvbl9rZXldXG5cdFx0cmV0dXJuIGRiW2NvbGxlY3Rpb25fa2V5XVxuXHRlbHNlIGlmIG9iamVjdC5kYlxuXHRcdHJldHVybiBvYmplY3QuZGJcblxuXHRpZiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxuXHRlbHNlXG5cdFx0aWYgb2JqZWN0LmN1c3RvbVxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSlcblx0XHRlbHNlXG5cdFx0XHRpZiBjb2xsZWN0aW9uX2tleSA9PSAnX3Ntc19xdWV1ZScgJiYgU01TUXVldWU/LmNvbGxlY3Rpb25cblx0XHRcdFx0cmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb25cblx0XHRcdHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5KVxuXG5cbiIsInZhciBzdGVlZG9zQ29yZTtcblxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJyk7XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRvcl9kYl91cmwsIG9wbG9nX3VybDtcbiAgY3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUjtcbiAgb3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1I7XG4gIGlmIChjcmVhdG9yX2RiX3VybCkge1xuICAgIGlmICghb3Bsb2dfdXJsKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIik7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7XG4gICAgICBfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge1xuICAgICAgICBvcGxvZ1VybDogb3Bsb2dfdXJsXG4gICAgICB9KVxuICAgIH07XG4gIH1cbn0pO1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgY29sbGVjdGlvbl9rZXk7XG4gIGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpO1xuICBpZiAoZGJbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIGRiW2NvbGxlY3Rpb25fa2V5XTtcbiAgfSBlbHNlIGlmIChvYmplY3QuZGIpIHtcbiAgICByZXR1cm4gb2JqZWN0LmRiO1xuICB9XG4gIGlmIChDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0LmN1c3RvbSkge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb2xsZWN0aW9uX2tleSA9PT0gJ19zbXNfcXVldWUnICYmICh0eXBlb2YgU01TUXVldWUgIT09IFwidW5kZWZpbmVkXCIgJiYgU01TUXVldWUgIT09IG51bGwgPyBTTVNRdWV1ZS5jb2xsZWN0aW9uIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm4gU01TUXVldWUuY29sbGVjdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5KTtcbiAgICB9XG4gIH1cbn07XG4iLCJDcmVhdG9yLmFjdGlvbnNCeU5hbWUgPSB7fVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0IyDlrprkuYnlhajlsYAgYWN0aW9ucyDlh73mlbBcdFxuXHRDcmVhdG9yLmFjdGlvbnMgPSAoYWN0aW9ucyktPlxuXHRcdF8uZWFjaCBhY3Rpb25zLCAodG9kbywgYWN0aW9uX25hbWUpLT5cblx0XHRcdENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvIFxuXG5cdENyZWF0b3IuZXhlY3V0ZUFjdGlvbiA9IChvYmplY3RfbmFtZSwgYWN0aW9uLCByZWNvcmRfaWQsIGl0ZW1fZWxlbWVudCwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxiYWNrKS0+XG5cdFx0aWYgYWN0aW9uICYmIGFjdGlvbi50eXBlID09ICd3b3JkLXByaW50J1xuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdGZpbHRlcnMgPSBbJ19pZCcsICc9JywgcmVjb3JkX2lkXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmaWx0ZXJzID0gT2JqZWN0R3JpZC5nZXRGaWx0ZXJzKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGZhbHNlLCBudWxsLCBudWxsKVxuXHRcdFx0dXJsID0gXCIvYXBpL3Y0L3dvcmRfdGVtcGxhdGVzL1wiICsgYWN0aW9uLndvcmRfdGVtcGxhdGUgKyBcIi9wcmludFwiICsgXCI/ZmlsdGVycz1cIiArIFN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkoZmlsdGVycyk7XG5cdFx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG5cdFx0XHRyZXR1cm4gd2luZG93Lm9wZW4odXJsKTtcblxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmIGFjdGlvbj8udG9kb1xuXHRcdFx0aWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwic3RyaW5nXCJcblx0XHRcdFx0dG9kbyA9IENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb24udG9kb11cblx0XHRcdGVsc2UgaWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHR0b2RvID0gYWN0aW9uLnRvZG9cdFxuXHRcdFx0aWYgIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWRcblx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdGlmIHRvZG9cblx0XHRcdFx0IyBpdGVtX2VsZW1lbnTkuLrnqbrml7blupTor6Xorr7nva7pu5jorqTlgLzvvIjlr7nosaHnmoRuYW1l5a2X5q6177yJ77yM5ZCm5YiZbW9yZUFyZ3Pmi7/liLDnmoTlkI7nu63lj4LmlbDkvY3nva7lsLHkuI3lr7lcblx0XHRcdFx0aXRlbV9lbGVtZW50ID0gaWYgaXRlbV9lbGVtZW50IHRoZW4gaXRlbV9lbGVtZW50IGVsc2UgXCJcIlxuXHRcdFx0XHRtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMylcblx0XHRcdFx0dG9kb0FyZ3MgPSBbb2JqZWN0X25hbWUsIHJlY29yZF9pZF0uY29uY2F0KG1vcmVBcmdzKVxuXHRcdFx0XHR0b2RvLmFwcGx5IHtcblx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZWNvcmRfaWQ6IHJlY29yZF9pZFxuXHRcdFx0XHRcdG9iamVjdDogb2JqXG5cdFx0XHRcdFx0YWN0aW9uOiBhY3Rpb25cblx0XHRcdFx0XHRpdGVtX2VsZW1lbnQ6IGl0ZW1fZWxlbWVudFxuXHRcdFx0XHRcdHJlY29yZDogcmVjb3JkXG5cdFx0XHRcdH0sIHRvZG9BcmdzXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKVxuXHRcdGVsc2Vcblx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKVxuXG5cblx0X2RlbGV0ZVJlY29yZCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2ssIGNhbGxfYmFja19lcnJvciktPlxuXHRcdCMgY29uc29sZS5sb2coXCI9PT1fZGVsZXRlUmVjb3JkPT09XCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaywgY2FsbF9iYWNrX2Vycm9yKTtcblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRwcmV2aW91c0RvYyA9IEZvcm1NYW5hZ2VyLmdldFByZXZpb3VzRG9jKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICdkZWxldGUnKVxuXHRcdENyZWF0b3Iub2RhdGEuZGVsZXRlIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICgpLT5cblx0XHRcdGlmIHJlY29yZF90aXRsZVxuXHRcdFx0XHQjIGluZm8gPSBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCIgKyBcIuW3suWIoOmZpFwiXG5cdFx0XHRcdGluZm8gPXQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKVxuXHRcdFx0dG9hc3RyLnN1Y2Nlc3MgaW5mb1xuXHRcdFx0aWYgY2FsbF9iYWNrIGFuZCB0eXBlb2YgY2FsbF9iYWNrID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRjYWxsX2JhY2soKVxuXG5cdFx0XHRGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2FmdGVyJywge19pZDogcmVjb3JkX2lkLCBwcmV2aW91c0RvYzogcHJldmlvdXNEb2N9KVxuXHRcdCwgKGVycm9yKS0+XG5cdFx0XHRpZiBjYWxsX2JhY2tfZXJyb3IgYW5kIHR5cGVvZiBjYWxsX2JhY2tfZXJyb3IgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdGNhbGxfYmFja19lcnJvcigpXG5cdFx0XHRGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2Vycm9yJywge19pZDogcmVjb3JkX2lkLCBlcnJvcjogZXJyb3J9KVxuXG5cdENyZWF0b3IucmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3ID0gKHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRyZWxhdGVPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKVxuXHRcdGNvbGxlY3Rpb25fbmFtZSA9IHJlbGF0ZU9iamVjdC5sYWJlbFxuXHRcdGNvbGxlY3Rpb24gPSBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKS5fY29sbGVjdGlvbl9uYW1lfVwiXG5cdFx0Y3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0aWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbcmVsYXRlZF9vYmplY3RfbmFtZV1cblx0XHRpbml0aWFsVmFsdWVzID0ge307XG5cdFx0aWYgaWRzPy5sZW5ndGhcblx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXG5cdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxuXHRcdFx0cmVjb3JkX2lkID0gaWRzWzBdXG5cdFx0XHRkb2MgPSBDcmVhdG9yLm9kYXRhLmdldChyZWxhdGVkX29iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRpbml0aWFsVmFsdWVzID0gZG9jXG5cdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcblx0XHRlbHNlXG5cdFx0XHRkZWZhdWx0RG9jID0gRm9ybU1hbmFnZXIuZ2V0UmVsYXRlZEluaXRpYWxWYWx1ZXMoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuXHRcdFx0aWYgIV8uaXNFbXB0eShkZWZhdWx0RG9jKVxuXHRcdFx0XHRpbml0aWFsVmFsdWVzID0gZGVmYXVsdERvY1xuXHRcdGlmIHJlbGF0ZU9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRyZXR1cm4gU3RlZWRvc1VJLnNob3dNb2RhbChzdG9yZXMuQ29tcG9uZW50UmVnaXN0cnkuY29tcG9uZW50cy5PYmplY3RGb3JtLCB7XG5cdFx0XHRcdG5hbWU6IFwiI3tyZWxhdGVkX29iamVjdF9uYW1lfV9zdGFuZGFyZF9uZXdfZm9ybVwiLFxuXHRcdFx0XHRvYmplY3RBcGlOYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuXHRcdFx0XHR0aXRsZTogJ+aWsOW7uiAnICsgcmVsYXRlT2JqZWN0LmxhYmVsLFxuXHRcdFx0XHRpbml0aWFsVmFsdWVzOiBpbml0aWFsVmFsdWVzLFxuXHRcdFx0XHRhZnRlckluc2VydDogKHJlc3VsdCktPlxuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCktPlxuXHRcdFx0XHRcdFx0IyBPYmplY3RGb3Jt5pyJ57yT5a2Y77yM5paw5bu65a2Q6KGo6K6w5b2V5Y+v6IO95Lya5pyJ5rGH5oC75a2X5q6177yM6ZyA6KaB5Yi35paw6KGo5Y2V5pWw5o2uXG5cdFx0XHRcdFx0XHRpZiBDcmVhdG9yLmdldE9iamVjdChjdXJyZW50X29iamVjdF9uYW1lKS52ZXJzaW9uID4gMVxuXHRcdFx0XHRcdFx0XHRTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKTtcblx0XHRcdFx0XHQsIDEpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSwgbnVsbCwge2ljb25QYXRoOiAnL2Fzc2V0cy9pY29ucyd9KVxuXG5cblx0XHRpZiBpZHM/Lmxlbmd0aFxuXHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cblx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XG5cdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXG5cdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcblx0XHRlbHNlXG5cdFx0XHRpZiAhXy5pc0VtcHR5KGluaXRpYWxWYWx1ZXMpXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblxuXHRcdFNlc3Npb24uc2V0KFwiYWN0aW9uX2ZpZWxkc1wiLCB1bmRlZmluZWQpXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fY29sbGVjdGlvblwiLCBjb2xsZWN0aW9uKVxuXHRcdFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25fbmFtZVwiLCBjb2xsZWN0aW9uX25hbWUpXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fc2F2ZV9hbmRfaW5zZXJ0XCIsIGZhbHNlKVxuXHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHQkKFwiLmNyZWF0b3ItYWRkLXJlbGF0ZWRcIikuY2xpY2soKVxuXHRcdHJldHVyblxuXG5cdENyZWF0b3IuYWN0aW9ucyBcblx0XHQjIOWcqOatpOWumuS5ieWFqOWxgCBhY3Rpb25zXG5cdFx0XCJzdGFuZGFyZF9xdWVyeVwiOiAoKS0+XG5cdFx0XHRNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIilcblxuXHRcdFwic3RhbmRhcmRfbmV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdCMgY3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRcdFx0IyBpZiBjdXJyZW50X3JlY29yZF9pZFxuXHRcdFx0IyBcdCMgYW1pcyDnm7jlhbPlrZDooajlj7PkuIrop5LmlrDlu7pcblx0XHRcdCMgXHRDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyhvYmplY3RfbmFtZSlcblx0XHRcdCMgXHRyZXR1cm4gXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG5cdFx0XHRncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuXHRcdFx0aXNSZWxhdGVkID0gdGhpcy5hY3Rpb24uaXNSZWxhdGVkO1xuXHRcdFx0aWYgaXNSZWxhdGVkXG5cdFx0XHRcdHJlbGF0ZWRGaWVsZE5hbWUgPSB0aGlzLmFjdGlvbi5yZWxhdGVkRmllbGROYW1lO1xuXHRcdFx0XHRtYXN0ZXJSZWNvcmRJZCA9IHRoaXMuYWN0aW9uLm1hc3RlclJlY29yZElkO1xuXHRcdFx0XHRpbml0aWFsVmFsdWVzID0gdGhpcy5hY3Rpb24uaW5pdGlhbFZhbHVlc1xuXHRcdFx0XHRpZiAhaW5pdGlhbFZhbHVlc1xuXHRcdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSB7fTtcblx0XHRcdFx0XHRpbml0aWFsVmFsdWVzW3JlbGF0ZWRGaWVsZE5hbWVdID0gbWFzdGVyUmVjb3JkSWRcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5pdGlhbFZhbHVlcz17fVxuXHRcdFx0XHRpZihncmlkTmFtZSlcblx0XHRcdFx0XHRzZWxlY3RlZFJvd3MgPSB3aW5kb3cuZ3JpZFJlZnM/W2dyaWROYW1lXS5jdXJyZW50Py5hcGk/LmdldFNlbGVjdGVkUm93cygpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzZWxlY3RlZFJvd3MgPSB3aW5kb3cuZ3JpZFJlZj8uY3VycmVudD8uYXBpPy5nZXRTZWxlY3RlZFJvd3MoKVx0XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBzZWxlY3RlZFJvd3M/Lmxlbmd0aFxuXHRcdFx0XHRcdHJlY29yZF9pZCA9IHNlbGVjdGVkUm93c1swXS5faWQ7XG5cdFx0XHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdFx0XHRpbml0aWFsVmFsdWVzID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IEZvcm1NYW5hZ2VyLmdldEluaXRpYWxWYWx1ZXMob2JqZWN0X25hbWUpXG5cblx0XHRcdGlmIG9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRcdHJldHVybiBTdGVlZG9zLlBhZ2UuRm9ybS5TdGFuZGFyZE5ldy5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCB0KCdOZXcnKSArICcgJyArIG9iamVjdC5sYWJlbCwgaW5pdGlhbFZhbHVlcyAsIHtncmlkTmFtZTogZ3JpZE5hbWV9KTtcblx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxuXHRcdFx0aWYgc2VsZWN0ZWRSb3dzPy5sZW5ndGhcblx0XHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cblx0XHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXHRcdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXG5cdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0XHQkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKClcblx0XHRcdHJldHVybiBcblxuXHRcdFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0Rmxvd1JvdXRlci5yZWRpcmVjdChocmVmKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcInN0YW5kYXJkX2VkaXRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcblx0XHRcdFx0aWYgb2JqZWN0Py52ZXJzaW9uID49IDJcblx0XHRcdFx0XHRyZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmRFZGl0LnJlbmRlcihTZXNzaW9uLmdldChcImFwcF9pZFwiKSwgb2JqZWN0X25hbWUsIHQoJ0VkaXQnKSArICcgJyArIG9iamVjdC5sYWJlbCwgcmVjb3JkX2lkLCB7XG5cdFx0XHRcdFx0XHRncmlkTmFtZTogdGhpcy5hY3Rpb24uZ3JpZE5hbWVcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2VcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcbiNcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgcmVjb3JkXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdyZWxvYWRfZHhsaXN0JywgZmFsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdFx0XHQkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcblxuXHRcdFwic3RhbmRhcmRfZGVsZXRlXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spLT5cblx0XHRcdGdyaWROYW1lID0gdGhpcy5hY3Rpb24uZ3JpZE5hbWU7XG5cdFx0XHQjIGNvbnNvbGUubG9nKFwiPT09c3RhbmRhcmRfZGVsZXRlPT09XCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjayk7XG5cdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0YmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge19pZDogcmVjb3JkX2lkfSlcblx0XHRcdFx0aWYgIWJlZm9yZUhvb2tcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRcdG5hbWVGaWVsZCA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWSB8fCBcIm5hbWVcIlxuXG5cdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXG5cdFx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXG5cdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXG5cdFx0XHRcdGxpc3Rfdmlld19pZCA9IFwiYWxsXCJcblxuXHRcdFx0aWYoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiByZWNvcmRfdGl0bGUpXG5cdFx0XHRcdHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZVtuYW1lRmllbGRdXG5cdFx0XHRcblx0XHRcdGlmIHJlY29yZCAmJiAhcmVjb3JkX3RpdGxlXG5cdFx0XHRcdHJlY29yZF90aXRsZSA9IHJlY29yZFtuYW1lRmllbGRdXG5cdFx0XHRcblx0XHRcdGkxOG5UaXRsZUtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVcIlxuXHRcdFx0aTE4blRleHRLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIlxuXG5cdFx0XHR1bmxlc3MgcmVjb3JkX2lkXG5cdFx0XHRcdGkxOG5UaXRsZUtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90aXRsZVwiXG5cdFx0XHRcdGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RleHRcIlxuXG5cdFx0XHRcdCMg5aaC5p6c5piv5om56YeP5Yig6Zmk77yM5YiZ5Lyg5YWl55qEbGlzdF92aWV3X2lk5Li65YiX6KGo6KeG5Zu+55qEbmFtZe+8jOeUqOS6juiOt+WPluWIl+ihqOmAieS4remhuVxuXHRcdFx0XHQjIOS4u+WIl+ihqOinhOWImeaYr1wibGlzdHZpZXdfI3tvYmplY3RfbmFtZX1fI3tsaXN0X3ZpZXdfaWR9XCLvvIznm7jlhbPooajop4TliJnmmK9cInJlbGF0ZWRfbGlzdHZpZXdfI3tvYmplY3RfbmFtZX1fI3tyZWxhdGVkX29iamVjdF9uYW1lfV8je3JlbGF0ZWRfZmllbGRfbmFtZX1cIlxuXHRcdFx0XHRzZWxlY3RlZFJlY29yZHMgPSBTdGVlZG9zVUkuZ2V0VGFibGVTZWxlY3RlZFJvd3MoZ3JpZE5hbWUgfHwgbGlzdF92aWV3X2lkKVxuXHRcdFx0XHRpZiAhc2VsZWN0ZWRSZWNvcmRzIHx8ICFzZWxlY3RlZFJlY29yZHMubGVuZ3RoXG5cdFx0XHRcdFx0dG9hc3RyLndhcm5pbmcodChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X25vX3NlbGVjdGlvblwiKSlcblx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0aWYgcmVjb3JkX3RpdGxlXG5cdFx0XHRcdHRleHQgPSB0IGkxOG5UZXh0S2V5LCBcIiN7b2JqZWN0LmxhYmVsfSBcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRleHQgPSB0IGkxOG5UZXh0S2V5LCBcIiN7b2JqZWN0LmxhYmVsfVwiXG5cdFx0XHRzd2FsXG5cdFx0XHRcdHRpdGxlOiB0IGkxOG5UaXRsZUtleSwgXCIje29iamVjdC5sYWJlbH1cIlxuXHRcdFx0XHR0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPiN7dGV4dH08L2Rpdj5cIlxuXHRcdFx0XHRodG1sOiB0cnVlXG5cdFx0XHRcdHNob3dDYW5jZWxCdXR0b246dHJ1ZVxuXHRcdFx0XHRjb25maXJtQnV0dG9uVGV4dDogdCgnRGVsZXRlJylcblx0XHRcdFx0Y2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcblx0XHRcdFx0KG9wdGlvbikgLT5cblx0XHRcdFx0XHRpZiBvcHRpb25cblx0XHRcdFx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRcdFx0XHQjIOWNleadoeiusOW9leWIoOmZpFxuXHRcdFx0XHRcdFx0XHRfZGVsZXRlUmVjb3JkIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsICgpLT5cblx0XHRcdFx0XHRcdFx0XHQjIOaWh+S7tueJiOacrOS4ulwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIu+8jOmcgOimgeabv+aNouS4ulwiY2ZzLWZpbGVzLWZpbGVyZWNvcmRcIlxuXHRcdFx0XHRcdFx0XHRcdGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZyxcIi1cIilcblx0XHRcdFx0XHRcdFx0XHRncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcblx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgZ3JpZENvbnRhaW5lcj8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiB3aW5kb3cub3BlbmVyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzT3BlbmVyUmVtb3ZlID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcblx0XHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRcdCMgT2JqZWN0Rm9ybeaciee8k+WtmO+8jOWIoOmZpOWtkOihqOiusOW9leWPr+iDveS8muacieaxh+aAu+Wtl+aute+8jOmcgOimgeWIt+aWsOihqOWNleaVsOaNrlxuXHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGN1cnJlbnRfb2JqZWN0X25hbWUgJiYgQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSk/LnZlcnNpb24gPiAxXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFN0ZWVkb3NVSS5yZWxvYWRSZWNvcmQoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBGbG93Um91dGVyLmN1cnJlbnQoKS5yb3V0ZS5wYXRoLmVuZHNXaXRoKFwiLzpyZWNvcmRfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0X25hbWUgIT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG5cdFx0XHRcdFx0XHRcdFx0Y2F0Y2ggX2Vcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoX2UpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIGdyaWRDb250YWluZXI/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJylcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKVxuXHRcdFx0XHRcdFx0XHRcdGlmIGR4RGF0YUdyaWRJbnN0YW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0X25hbWUgIT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMgZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIFx0VGVtcGxhdGUuY3JlYXRvcl9ncmlkLnJlZnJlc2goZHhEYXRhR3JpZEluc3RhbmNlKVxuXHRcdFx0XHRcdFx0XHRcdHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0dGVtcE5hdlJlbW92ZWQgPSBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpICPml6DorrrmmK/lnKjorrDlvZXor6bnu4bnlYzpnaLov5jmmK/liJfooajnlYzpnaLmiafooYzliKDpmaTmk43kvZzvvIzpg73kvJrmiorkuLTml7blr7zoiKrliKDpmaTmjolcblx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZSBvciAhZHhEYXRhR3JpZEluc3RhbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuY2xvc2UoKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgYW5kIGxpc3Rfdmlld19pZCAhPSAnY2FsZW5kYXInXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIHRlbXBOYXZSZW1vdmVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpznoa7lrp7liKDpmaTkuobkuLTml7blr7zoiKrvvIzlsLHlj6/og73lt7Lnu4/ph43lrprlkJHliLDkuIrkuIDkuKrpobXpnaLkuobvvIzmsqHlv4XopoHlho3ph43lrprlkJHkuIDmrKFcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLmdvIFwiL2FwcC8je2FwcGlkfS8je29iamVjdF9uYW1lfS9ncmlkLyN7bGlzdF92aWV3X2lkfVwiXG5cdFx0XHRcdFx0XHRcdFx0aWYgY2FsbF9iYWNrIGFuZCB0eXBlb2YgY2FsbF9iYWNrID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FsbF9iYWNrKClcdFx0XHRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0IyDmibnph4/liKDpmaRcblx0XHRcdFx0XHRcdFx0aWYgc2VsZWN0ZWRSZWNvcmRzICYmIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImxvYWRpbmdcIilcblx0XHRcdFx0XHRcdFx0XHRkZWxldGVDb3VudGVyID0gMDtcblx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUgPSAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxldGVDb3VudGVyKytcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGRlbGV0ZUNvdW50ZXIgPj0gc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIGNvbnNvbGUubG9nKFwiZGVsZXRlQ291bnRlciwgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aD09PVwiLCBkZWxldGVDb3VudGVyLCBzZWxlY3RlZFJlY29yZHMubGVuZ3RoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJsb2FkaW5nXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZWN0ZWRSZWNvcmRzLmZvckVhY2ggKHJlY29yZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2lkID0gcmVjb3JkLl9pZFxuXHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge19pZDogcmVjb3JkX2lkfSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmICFiZWZvcmVIb29rXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFmdGVyQmF0Y2hlc0RlbGV0ZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZFRpdGxlID0gcmVjb3JkW25hbWVGaWVsZF0gfHwgcmVjb3JkX2lkXG5cdFx0XHRcdFx0XHRcdFx0XHRfZGVsZXRlUmVjb3JkIG9iamVjdF9uYW1lLCByZWNvcmQuX2lkLCByZWNvcmRUaXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsICgoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCkgI+aXoOiuuuaYr+WcqOiusOW9leivpue7hueVjOmdoui/mOaYr+WIl+ihqOeVjOmdouaJp+ihjOWIoOmZpOaTjeS9nO+8jOmDveS8muaKiuS4tOaXtuWvvOiIquWIoOmZpOaOiVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKVxuXHRcdFx0XHRcdFx0XHRcdFx0KSwgKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKSIsInZhciBfZGVsZXRlUmVjb3JkO1xuXG5DcmVhdG9yLmFjdGlvbnNCeU5hbWUgPSB7fTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmFjdGlvbnMgPSBmdW5jdGlvbihhY3Rpb25zKSB7XG4gICAgcmV0dXJuIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbih0b2RvLCBhY3Rpb25fbmFtZSkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYWN0aW9uLCByZWNvcmRfaWQsIGl0ZW1fZWxlbWVudCwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGZpbHRlcnMsIG1vcmVBcmdzLCBvYmosIHRvZG8sIHRvZG9BcmdzLCB1cmw7XG4gICAgaWYgKGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gJ3dvcmQtcHJpbnQnKSB7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGZpbHRlcnMgPSBbJ19pZCcsICc9JywgcmVjb3JkX2lkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbHRlcnMgPSBPYmplY3RHcmlkLmdldEZpbHRlcnMob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZmFsc2UsIG51bGwsIG51bGwpO1xuICAgICAgfVxuICAgICAgdXJsID0gXCIvYXBpL3Y0L3dvcmRfdGVtcGxhdGVzL1wiICsgYWN0aW9uLndvcmRfdGVtcGxhdGUgKyBcIi9wcmludFwiICsgXCI/ZmlsdGVycz1cIiArIFN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkoZmlsdGVycyk7XG4gICAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG4gICAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsKTtcbiAgICB9XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwKSB7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uLnRvZG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0b2RvID0gYWN0aW9uLnRvZG87XG4gICAgICB9XG4gICAgICBpZiAoIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICAgICAgcmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB9XG4gICAgICBpZiAodG9kbykge1xuICAgICAgICBpdGVtX2VsZW1lbnQgPSBpdGVtX2VsZW1lbnQgPyBpdGVtX2VsZW1lbnQgOiBcIlwiO1xuICAgICAgICBtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG4gICAgICAgIHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncyk7XG4gICAgICAgIHJldHVybiB0b2RvLmFwcGx5KHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgb2JqZWN0OiBvYmosXG4gICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgaXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnQsXG4gICAgICAgICAgcmVjb3JkOiByZWNvcmRcbiAgICAgICAgfSwgdG9kb0FyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKTtcbiAgICB9XG4gIH07XG4gIF9kZWxldGVSZWNvcmQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2ssIGNhbGxfYmFja19lcnJvcikge1xuICAgIHZhciBvYmplY3QsIHByZXZpb3VzRG9jO1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBwcmV2aW91c0RvYyA9IEZvcm1NYW5hZ2VyLmdldFByZXZpb3VzRG9jKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICdkZWxldGUnKTtcbiAgICByZXR1cm4gQ3JlYXRvci5vZGF0YVtcImRlbGV0ZVwiXShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpbmZvO1xuICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICBpbmZvID0gdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyAoXCJcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5mbyA9IHQoJ2NyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3N1YycpO1xuICAgICAgfVxuICAgICAgdG9hc3RyLnN1Y2Nlc3MoaW5mbyk7XG4gICAgICBpZiAoY2FsbF9iYWNrICYmIHR5cGVvZiBjYWxsX2JhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsX2JhY2soKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2FmdGVyJywge1xuICAgICAgICBfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgcHJldmlvdXNEb2M6IHByZXZpb3VzRG9jXG4gICAgICB9KTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgaWYgKGNhbGxfYmFja19lcnJvciAmJiB0eXBlb2YgY2FsbF9iYWNrX2Vycm9yID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbF9iYWNrX2Vycm9yKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdlcnJvcicsIHtcbiAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IucmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3ID0gZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgIHZhciBjb2xsZWN0aW9uLCBjb2xsZWN0aW9uX25hbWUsIGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkLCBkZWZhdWx0RG9jLCBkb2MsIGlkcywgaW5pdGlhbFZhbHVlcywgcmVjb3JkX2lkLCByZWxhdGVPYmplY3Q7XG4gICAgcmVsYXRlT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgY29sbGVjdGlvbl9uYW1lID0gcmVsYXRlT2JqZWN0LmxhYmVsO1xuICAgIGNvbGxlY3Rpb24gPSBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuXCIgKyAoQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSkuX2NvbGxlY3Rpb25fbmFtZSk7XG4gICAgY3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgY3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgICBpZHMgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkc1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICBpbml0aWFsVmFsdWVzID0ge307XG4gICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgcmVjb3JkX2lkID0gaWRzWzBdO1xuICAgICAgZG9jID0gQ3JlYXRvci5vZGF0YS5nZXQocmVsYXRlZF9vYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIGluaXRpYWxWYWx1ZXMgPSBkb2M7XG4gICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHREb2MgPSBGb3JtTWFuYWdlci5nZXRSZWxhdGVkSW5pdGlhbFZhbHVlcyhjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIV8uaXNFbXB0eShkZWZhdWx0RG9jKSkge1xuICAgICAgICBpbml0aWFsVmFsdWVzID0gZGVmYXVsdERvYztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKChyZWxhdGVPYmplY3QgIT0gbnVsbCA/IHJlbGF0ZU9iamVjdC52ZXJzaW9uIDogdm9pZCAwKSA+PSAyKSB7XG4gICAgICByZXR1cm4gU3RlZWRvc1VJLnNob3dNb2RhbChzdG9yZXMuQ29tcG9uZW50UmVnaXN0cnkuY29tcG9uZW50cy5PYmplY3RGb3JtLCB7XG4gICAgICAgIG5hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIl9zdGFuZGFyZF9uZXdfZm9ybVwiLFxuICAgICAgICBvYmplY3RBcGlOYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICB0aXRsZTogJ+aWsOW7uiAnICsgcmVsYXRlT2JqZWN0LmxhYmVsLFxuICAgICAgICBpbml0aWFsVmFsdWVzOiBpbml0aWFsVmFsdWVzLFxuICAgICAgICBhZnRlckluc2VydDogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChDcmVhdG9yLmdldE9iamVjdChjdXJyZW50X29iamVjdF9uYW1lKS52ZXJzaW9uID4gMSkge1xuICAgICAgICAgICAgICBTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9LCBudWxsLCB7XG4gICAgICAgIGljb25QYXRoOiAnL2Fzc2V0cy9pY29ucydcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoaWRzICE9IG51bGwgPyBpZHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgIFNlc3Npb24uc2V0KCdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFfLmlzRW1wdHkoaW5pdGlhbFZhbHVlcykpIHtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICB9XG4gICAgfVxuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX2ZpZWxkc1wiLCB2b2lkIDApO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25cIiwgY29sbGVjdGlvbik7XG4gICAgU2Vzc2lvbi5zZXQoXCJhY3Rpb25fY29sbGVjdGlvbl9uYW1lXCIsIGNvbGxlY3Rpb25fbmFtZSk7XG4gICAgU2Vzc2lvbi5zZXQoXCJhY3Rpb25fc2F2ZV9hbmRfaW5zZXJ0XCIsIGZhbHNlKTtcbiAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJChcIi5jcmVhdG9yLWFkZC1yZWxhdGVkXCIpLmNsaWNrKCk7XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IuYWN0aW9ucyh7XG4gICAgXCJzdGFuZGFyZF9xdWVyeVwiOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIik7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX25ld1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBncmlkTmFtZSwgaW5pdGlhbFZhbHVlcywgaXNSZWxhdGVkLCBtYXN0ZXJSZWNvcmRJZCwgb2JqZWN0LCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlbGF0ZWRGaWVsZE5hbWUsIHNlbGVjdGVkUm93cztcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGdyaWROYW1lID0gdGhpcy5hY3Rpb24uZ3JpZE5hbWU7XG4gICAgICBpc1JlbGF0ZWQgPSB0aGlzLmFjdGlvbi5pc1JlbGF0ZWQ7XG4gICAgICBpZiAoaXNSZWxhdGVkKSB7XG4gICAgICAgIHJlbGF0ZWRGaWVsZE5hbWUgPSB0aGlzLmFjdGlvbi5yZWxhdGVkRmllbGROYW1lO1xuICAgICAgICBtYXN0ZXJSZWNvcmRJZCA9IHRoaXMuYWN0aW9uLm1hc3RlclJlY29yZElkO1xuICAgICAgICBpbml0aWFsVmFsdWVzID0gdGhpcy5hY3Rpb24uaW5pdGlhbFZhbHVlcztcbiAgICAgICAgaWYgKCFpbml0aWFsVmFsdWVzKSB7XG4gICAgICAgICAgaW5pdGlhbFZhbHVlcyA9IHt9O1xuICAgICAgICAgIGluaXRpYWxWYWx1ZXNbcmVsYXRlZEZpZWxkTmFtZV0gPSBtYXN0ZXJSZWNvcmRJZDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IHt9O1xuICAgICAgICBpZiAoZ3JpZE5hbWUpIHtcbiAgICAgICAgICBzZWxlY3RlZFJvd3MgPSAocmVmID0gd2luZG93LmdyaWRSZWZzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbZ3JpZE5hbWVdLmN1cnJlbnQpICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYXBpKSAhPSBudWxsID8gcmVmMi5nZXRTZWxlY3RlZFJvd3MoKSA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxlY3RlZFJvd3MgPSAocmVmMyA9IHdpbmRvdy5ncmlkUmVmKSAhPSBudWxsID8gKHJlZjQgPSByZWYzLmN1cnJlbnQpICE9IG51bGwgPyAocmVmNSA9IHJlZjQuYXBpKSAhPSBudWxsID8gcmVmNS5nZXRTZWxlY3RlZFJvd3MoKSA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0ZWRSb3dzICE9IG51bGwgPyBzZWxlY3RlZFJvd3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmVjb3JkX2lkID0gc2VsZWN0ZWRSb3dzWzBdLl9pZDtcbiAgICAgICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgICAgICBpbml0aWFsVmFsdWVzID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluaXRpYWxWYWx1ZXMgPSBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC52ZXJzaW9uIDogdm9pZCAwKSA+PSAyKSB7XG4gICAgICAgIHJldHVybiBTdGVlZG9zLlBhZ2UuRm9ybS5TdGFuZGFyZE5ldy5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCB0KCdOZXcnKSArICcgJyArIG9iamVjdC5sYWJlbCwgaW5pdGlhbFZhbHVlcywge1xuICAgICAgICAgIGdyaWROYW1lOiBncmlkTmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoc2VsZWN0ZWRSb3dzICE9IG51bGwgPyBzZWxlY3RlZFJvd3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgIH1cbiAgICAgIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQoXCIuY3JlYXRvci1hZGRcIikuY2xpY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgaHJlZjtcbiAgICAgIGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2VkaXRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgb2JqZWN0O1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICAgIGlmICgob2JqZWN0ICE9IG51bGwgPyBvYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgICAgIHJldHVybiBTdGVlZG9zLlBhZ2UuRm9ybS5TdGFuZGFyZEVkaXQucmVuZGVyKFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpLCBvYmplY3RfbmFtZSwgdCgnRWRpdCcpICsgJyAnICsgb2JqZWN0LmxhYmVsLCByZWNvcmRfaWQsIHtcbiAgICAgICAgICAgIGdyaWROYW1lOiB0aGlzLmFjdGlvbi5ncmlkTmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2UpIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2RlbGV0ZVwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spIHtcbiAgICAgIHZhciBiZWZvcmVIb29rLCBncmlkTmFtZSwgaTE4blRleHRLZXksIGkxOG5UaXRsZUtleSwgbmFtZUZpZWxkLCBvYmplY3QsIHNlbGVjdGVkUmVjb3JkcywgdGV4dDtcbiAgICAgIGdyaWROYW1lID0gdGhpcy5hY3Rpb24uZ3JpZE5hbWU7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtcbiAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFiZWZvcmVIb29rKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBuYW1lRmllbGQgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVkgfHwgXCJuYW1lXCI7XG4gICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICAgIH1cbiAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgIGxpc3Rfdmlld19pZCA9IFwiYWxsXCI7XG4gICAgICB9XG4gICAgICBpZiAoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiByZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgcmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlW25hbWVGaWVsZF07XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkICYmICFyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgcmVjb3JkX3RpdGxlID0gcmVjb3JkW25hbWVGaWVsZF07XG4gICAgICB9XG4gICAgICBpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCI7XG4gICAgICBpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiO1xuICAgICAgaWYgKCFyZWNvcmRfaWQpIHtcbiAgICAgICAgaTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RpdGxlXCI7XG4gICAgICAgIGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RleHRcIjtcbiAgICAgICAgc2VsZWN0ZWRSZWNvcmRzID0gU3RlZWRvc1VJLmdldFRhYmxlU2VsZWN0ZWRSb3dzKGdyaWROYW1lIHx8IGxpc3Rfdmlld19pZCk7XG4gICAgICAgIGlmICghc2VsZWN0ZWRSZWNvcmRzIHx8ICFzZWxlY3RlZFJlY29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgdG9hc3RyLndhcm5pbmcodChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X25vX3NlbGVjdGlvblwiKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHRleHQgPSB0KGkxOG5UZXh0S2V5LCBvYmplY3QubGFiZWwgKyBcIiBcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gdChpMThuVGV4dEtleSwgXCJcIiArIG9iamVjdC5sYWJlbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3dhbCh7XG4gICAgICAgIHRpdGxlOiB0KGkxOG5UaXRsZUtleSwgXCJcIiArIG9iamVjdC5sYWJlbCksXG4gICAgICAgIHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+XCIgKyB0ZXh0ICsgXCI8L2Rpdj5cIixcbiAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpLFxuICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuICAgICAgfSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHZhciBhZnRlckJhdGNoZXNEZWxldGUsIGRlbGV0ZUNvdW50ZXI7XG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgICAgICByZXR1cm4gX2RlbGV0ZVJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIF9lLCBhcHBpZCwgY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIGR4RGF0YUdyaWRJbnN0YW5jZSwgZ3JpZENvbnRhaW5lciwgZ3JpZE9iamVjdE5hbWVDbGFzcywgaXNPcGVuZXJSZW1vdmUsIHJlY29yZFVybCwgcmVmLCB0ZW1wTmF2UmVtb3ZlZDtcbiAgICAgICAgICAgICAgZ3JpZE9iamVjdE5hbWVDbGFzcyA9IG9iamVjdF9uYW1lLnJlcGxhY2UoL1xcLi9nLCBcIi1cIik7XG4gICAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgICAgaWYgKCEoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgIGlzT3BlbmVyUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjdXJyZW50X29iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50X29iamVjdF9uYW1lICYmICgocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYudmVyc2lvbiA6IHZvaWQgMCkgPiAxKSB7XG4gICAgICAgICAgICAgICAgICBTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKEZsb3dSb3V0ZXIuY3VycmVudCgpLnJvdXRlLnBhdGguZW5kc1dpdGgoXCIvOnJlY29yZF9pZFwiKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgICBfZSA9IGVycm9yMTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKF9lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICAgICAgICB0ZW1wTmF2UmVtb3ZlZCA9IENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCk7XG4gICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSB8fCAhZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzT3BlbmVyUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgJiYgbGlzdF92aWV3X2lkICE9PSAnY2FsZW5kYXInKSB7XG4gICAgICAgICAgICAgICAgICBhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICAgICAgICAgICAgICAgICAgaWYgKCF0ZW1wTmF2UmVtb3ZlZCkge1xuICAgICAgICAgICAgICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcC9cIiArIGFwcGlkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoY2FsbF9iYWNrICYmIHR5cGVvZiBjYWxsX2JhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsX2JhY2soKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZFJlY29yZHMgJiYgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcImxvYWRpbmdcIik7XG4gICAgICAgICAgICAgIGRlbGV0ZUNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICBhZnRlckJhdGNoZXNEZWxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBkZWxldGVDb3VudGVyKys7XG4gICAgICAgICAgICAgICAgaWYgKGRlbGV0ZUNvdW50ZXIgPj0gc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJsb2FkaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlY29yZFRpdGxlO1xuICAgICAgICAgICAgICAgIHJlY29yZF9pZCA9IHJlY29yZC5faWQ7XG4gICAgICAgICAgICAgICAgYmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge1xuICAgICAgICAgICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIWJlZm9yZUhvb2spIHtcbiAgICAgICAgICAgICAgICAgIGFmdGVyQmF0Y2hlc0RlbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWNvcmRUaXRsZSA9IHJlY29yZFtuYW1lRmllbGRdIHx8IHJlY29yZF9pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2RlbGV0ZVJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkLl9pZCwgcmVjb3JkVGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcmVjb3JkVXJsO1xuICAgICAgICAgICAgICAgICAgcmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICAgICAgICAgICAgICBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyQmF0Y2hlc0RlbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH0pLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBhZnRlckJhdGNoZXNEZWxldGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIl19
