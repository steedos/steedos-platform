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
      built_in_plugins: ["@steedos/standard-space", "@steedos/standard-cms", "@steedos/standard-object-database", "@steedos/standard-process-approval", "@steedos/standard-collaboration", "@steedos/standard-ui", "@steedos/standard-permission", "@steedos/webapp-public", "@steedos/service-cachers-manager", "@steedos/unpkg", "@steedos/workflow", "@steedos/accounts", "@steedos/plugin-company", "@steedos/metadata-api", "@steedos/data-import", "@steedos/service-accounts", "@steedos/service-charts", "@steedos/service-cloud-init", "@steedos/service-package-registry", "@steedos/service-package-tool", "@steedos/webapp-accounts", "@steedos/service-workflow", "@steedos/service-plugin-amis", "@steedos/service-files", "@steedos/service-identity-jwt"],
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
        throw new Meteor.Error('error', '未找到申请单，可能已被删除，请重新发起审批。');
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
    var _object, _ref_obj, _reference_to, autoform_type, collectionName, field_name, fs, fsType, isUnLimited, permissions, ref, ref1, ref2, ref3;

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
require("/node_modules/meteor/steedos:objects/server/routes/api_workflow_view_instance.coffee");

/* Exports */
Package._define("steedos:objects");

})();

//# sourceURL=meteor://💻app/packages/steedos_objects.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiQVBJU2VydmljZSIsIk1ldGFkYXRhU2VydmljZSIsImNvbmZpZyIsImUiLCJtb2xlY3VsZXIiLCJvYmplY3RxbCIsInBhY2thZ2VMb2FkZXIiLCJwYWNrYWdlU2VydmljZSIsInBhdGgiLCJzZXR0aW5ncyIsInN0ZWVkb3NDb3JlIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJyZXF1aXJlIiwiZ2V0U3RlZWRvc0NvbmZpZyIsImJ1aWx0X2luX3BsdWdpbnMiLCJwbHVnaW5zIiwiTWV0ZW9yIiwic3RhcnR1cCIsImFwaVNlcnZpY2UiLCJicm9rZXIiLCJleCIsIm1ldGFkYXRhU2VydmljZSIsIm9iamVjdHFsU2VydmljZSIsInBhZ2VTZXJ2aWNlIiwicHJvamVjdFNlcnZpY2UiLCJzdGFuZGFyZE9iamVjdHNEaXIiLCJzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSIsInN0ZWVkb3NTZXJ2aWNlIiwidWlTZXJ2aWNlIiwiU2VydmljZUJyb2tlciIsIm5hbWVzcGFjZSIsIm5vZGVJRCIsIm1ldGFkYXRhIiwidHJhbnNwb3J0ZXIiLCJUUkFOU1BPUlRFUiIsImNhY2hlciIsIkNBQ0hFUiIsImxvZ0xldmVsIiwic2VyaWFsaXplciIsInJlcXVlc3RUaW1lb3V0IiwibWF4Q2FsbExldmVsIiwiaGVhcnRiZWF0SW50ZXJ2YWwiLCJoZWFydGJlYXRUaW1lb3V0IiwiY29udGV4dFBhcmFtc0Nsb25pbmciLCJ0cmFja2luZyIsImVuYWJsZWQiLCJzaHV0ZG93blRpbWVvdXQiLCJkaXNhYmxlQmFsYW5jZXIiLCJyZWdpc3RyeSIsInN0cmF0ZWd5IiwicHJlZmVyTG9jYWwiLCJidWxraGVhZCIsImNvbmN1cnJlbmN5IiwibWF4UXVldWVTaXplIiwidmFsaWRhdG9yIiwiZXJyb3JIYW5kbGVyIiwidHJhY2luZyIsImV4cG9ydGVyIiwidHlwZSIsIm9wdGlvbnMiLCJsb2dnZXIiLCJjb2xvcnMiLCJ3aWR0aCIsImdhdWdlV2lkdGgiLCJza2lwUHJvY2Vzc0V2ZW50UmVnaXN0cmF0aW9uIiwiY3JlYXRlZCIsIndhcm4iLCJjbGVhbiIsImluaXQiLCJjcmVhdGVTZXJ2aWNlIiwibmFtZSIsIm1peGlucyIsInBvcnQiLCJzdGFydGVkIiwic2V0VGltZW91dCIsImVtaXQiLCJnZXRTdGVlZG9zU2NoZW1hIiwiU3RhbmRhcmRPYmplY3RzUGF0aCIsInBhY2thZ2VJbmZvIiwid3JhcEFzeW5jIiwiY2IiLCJzdGFydCIsInRoZW4iLCJjb25uZWN0SGFuZGxlcnNFeHByZXNzIiwiZXhwcmVzcyIsIl9yZXN0YXJ0U2VydmljZSIsInVzZSIsInN0YXRpY1JvdXRlciIsIndhaXRGb3JTZXJ2aWNlcyIsImNvbnNvbGUiLCJsb2ciLCJTdGVlZG9zQXBpIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwicmVzb2x2ZSIsInJlamVjdCIsImVycm9yIiwiRmliZXIiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJsaXN0X3ZpZXdzIiwic3BhY2UiLCJnZXRDb2xsZWN0aW9uTmFtZSIsIl8iLCJjbG9uZSIsImNvbnZlcnRPYmplY3QiLCJPYmplY3QiLCJpbml0VHJpZ2dlcnMiLCJpbml0TGlzdFZpZXdzIiwiZ2V0T2JqZWN0TmFtZSIsImdldE9iamVjdCIsInNwYWNlX2lkIiwicmVmIiwicmVmMSIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJvYmplY3RzQnlOYW1lIiwiZ2V0T2JqZWN0QnlJZCIsIm9iamVjdF9pZCIsImZpbmRXaGVyZSIsIl9pZCIsInJlbW92ZU9iamVjdCIsImdldENvbGxlY3Rpb24iLCJzcGFjZUlkIiwiX2NvbGxlY3Rpb25fbmFtZSIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiZmllbGRzIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsImlzU3RyaW5nIiwiRm9ybXVsYXIiLCJjaGVja0Zvcm11bGEiLCJldmFsdWF0ZUZpbHRlcnMiLCJmaWx0ZXJzIiwic2VsZWN0b3IiLCJlYWNoIiwiZmlsdGVyIiwiYWN0aW9uIiwidmFsdWUiLCJsZW5ndGgiLCJpc0NvbW1vblNwYWNlIiwiZ2V0T3JkZXJseVNldEJ5SWRzIiwiZG9jcyIsImlkcyIsImlkX2tleSIsImhpdF9maXJzdCIsInZhbHVlcyIsImdldFByb3BlcnR5Iiwic29ydEJ5IiwiZG9jIiwiX2luZGV4Iiwic29ydGluZ01ldGhvZCIsInZhbHVlMSIsInZhbHVlMiIsImlzVmFsdWUxRW1wdHkiLCJpc1ZhbHVlMkVtcHR5IiwibG9jYWxlIiwia2V5IiwiRGF0ZSIsImdldFRpbWUiLCJTdGVlZG9zIiwidG9TdHJpbmciLCJsb2NhbGVDb21wYXJlIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfb2JqZWN0IiwicGVybWlzc2lvbnMiLCJyZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0TWFwIiwicmVsYXRlZF9vYmplY3RzIiwiaXNFbXB0eSIsIm9iak5hbWUiLCJpc09iamVjdCIsIm9iamVjdE5hbWUiLCJyZWxhdGVkX29iamVjdCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwicmVmZXJlbmNlX3RvIiwiZm9yZWlnbl9rZXkiLCJ3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCIsImVuYWJsZU9iak5hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJlbmFibGVfZmlsZXMiLCJwdXNoIiwic2ZzRmlsZXNPYmplY3QiLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImVuYWJsZV9hcHByb3ZhbHMiLCJlbmFibGVfcHJvY2VzcyIsImdldFVzZXJDb250ZXh0IiwiaXNVblNhZmVNb2RlIiwiVVNFUl9DT05URVhUIiwic3BhY2VfdXNlcl9vcmciLCJzdSIsInN1RmllbGRzIiwiRXJyb3IiLCJtb2JpbGUiLCJwb3NpdGlvbiIsImVtYWlsIiwiY29tcGFueSIsIm9yZ2FuaXphdGlvbiIsImNvbXBhbnlfaWQiLCJjb21wYW55X2lkcyIsInVzZXIiLCJmdWxsbmFtZSIsImdldFJlbGF0aXZlVXJsIiwidXJsIiwiaXNGdW5jdGlvbiIsImlzQ29yZG92YSIsInN0YXJ0c1dpdGgiLCJ0ZXN0IiwiX19tZXRlb3JfcnVudGltZV9jb25maWdfXyIsIlJPT1RfVVJMX1BBVEhfUFJFRklYIiwiZ2V0VXNlckNvbXBhbnlJZCIsImdldFVzZXJDb21wYW55SWRzIiwicHJvY2Vzc1Blcm1pc3Npb25zIiwicG8iLCJhbGxvd0NyZWF0ZSIsImFsbG93UmVhZCIsImFsbG93RWRpdCIsImFsbG93RGVsZXRlIiwidmlld0FsbFJlY29yZHMiLCJ2aWV3Q29tcGFueVJlY29yZHMiLCJtb2RpZnlDb21wYW55UmVjb3JkcyIsImFsbG93UmVhZEZpbGVzIiwidmlld0FsbEZpbGVzIiwiYWxsb3dDcmVhdGVGaWxlcyIsImFsbG93RWRpdEZpbGVzIiwiYWxsb3dEZWxldGVGaWxlcyIsIm1vZGlmeUFsbEZpbGVzIiwiZ2V0VGVtcGxhdGVTcGFjZUlkIiwidGVtcGxhdGVTcGFjZUlkIiwiZ2V0Q2xvdWRBZG1pblNwYWNlSWQiLCJjbG91ZEFkbWluU3BhY2VJZCIsImlzVGVtcGxhdGVTcGFjZSIsImlzQ2xvdWRBZG1pblNwYWNlIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsIm9wdGlvbnNfbGltaXQiLCJxdWVyeSIsInF1ZXJ5X29wdGlvbnMiLCJyZWNvcmRzIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsInBhcmFtcyIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJmaWx0ZXJRdWVyeSIsImxpbWl0IiwiZmluZCIsImZldGNoIiwicmVjb3JkIiwibGFiZWwiLCJtZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm94IiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJmbG93SWQiLCJoYXNoRGF0YSIsImlucyIsImluc0lkIiwicmVjb3JkX2lkIiwicmVkaXJlY3RfdXJsIiwicmVmMiIsInJlZjMiLCJyZWY0Iiwid29ya2Zsb3dVcmwiLCJ4X2F1dGhfdG9rZW4iLCJ4X3VzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsImJvZHkiLCJjaGVjayIsImluc3RhbmNlSWQiLCJmbG93IiwiaW5ib3hfdXNlcnMiLCJpbmNsdWRlcyIsImNjX3VzZXJzIiwib3V0Ym94X3VzZXJzIiwic3RhdGUiLCJzdWJtaXR0ZXIiLCJhcHBsaWNhbnQiLCJwZXJtaXNzaW9uTWFuYWdlciIsImdldEZsb3dQZXJtaXNzaW9ucyIsInNwYWNlcyIsIndlYnNlcnZpY2VzIiwid29ya2Zsb3ciLCJzZW5kUmVzdWx0IiwiY29kZSIsImRhdGEiLCJ1cGRhdGUiLCIkdW5zZXQiLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJnZXRJbml0V2lkdGhQZXJjZW50IiwiY29sdW1ucyIsIl9zY2hlbWEiLCJjb2x1bW5fbnVtIiwiaW5pdF93aWR0aF9wZXJjZW50IiwiZ2V0U2NoZW1hIiwiZmllbGRfbmFtZSIsImZpZWxkIiwiaXNfd2lkZSIsInBpY2siLCJhdXRvZm9ybSIsImdldEZpZWxkSXNXaWRlIiwiZ2V0VGFidWxhck9yZGVyIiwibGlzdF92aWV3X2lkIiwic2V0dGluZyIsIm1hcCIsImNvbHVtbiIsImhpZGRlbiIsImNvbXBhY3QiLCJvcmRlciIsImluZGV4IiwiZGVmYXVsdF9leHRyYV9jb2x1bW5zIiwiZXh0cmFfY29sdW1ucyIsImdldE9iamVjdERlZmF1bHRDb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyIsInVuaW9uIiwiZ2V0T2JqZWN0RGVmYXVsdFNvcnQiLCJUYWJ1bGFyU2VsZWN0ZWRJZHMiLCJjb252ZXJ0TGlzdFZpZXciLCJkZWZhdWx0X3ZpZXciLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfbmFtZSIsImRlZmF1bHRfY29sdW1ucyIsImRlZmF1bHRfbW9iaWxlX2NvbHVtbnMiLCJvaXRlbSIsIm1vYmlsZV9jb2x1bW5zIiwiaGFzIiwiaW5jbHVkZSIsImZpbHRlcl9zY29wZSIsInBhcnNlIiwiZm9yRWFjaCIsIl92YWx1ZSIsImdldFJlbGF0ZWRMaXN0IiwibGF5b3V0UmVsYXRlZExpc3QiLCJsaXN0IiwibWFwTGlzdCIsIm9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyIsInJlbGF0ZWRMaXN0TmFtZXMiLCJyZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInVucmVsYXRlZF9vYmplY3RzIiwicmVsYXRlZF9saXN0cyIsIml0ZW0iLCJyZUZpZWxkTmFtZSIsInJlT2JqZWN0TmFtZSIsInJlbGF0ZWQiLCJyZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lIiwic3BsaXQiLCJmaWVsZF9uYW1lcyIsImlzX2ZpbGUiLCJjdXN0b21SZWxhdGVkTGlzdE9iamVjdCIsImFjdGlvbnMiLCJidXR0b25zIiwidmlzaWJsZV9vbiIsInBhZ2Vfc2l6ZSIsIm9iak9yTmFtZSIsImdldFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfaXRlbSIsInJlbGF0ZWRPYmplY3QiLCJ0YWJ1bGFyX29yZGVyIiwiZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMiLCJ3aXRob3V0IiwidHJhbnNmb3JtU29ydFRvVGFidWxhciIsInJlcGxhY2UiLCJwbHVjayIsImRpZmZlcmVuY2UiLCJ2IiwiaXNBY3RpdmUiLCJhbGxvd19yZWxhdGVkTGlzdCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJmaXJzdCIsImdldExpc3RWaWV3cyIsImdldExpc3RWaWV3IiwiZXhhYyIsImxpc3RWaWV3cyIsImdldExpc3RWaWV3SXNSZWNlbnQiLCJsaXN0VmlldyIsInBpY2tPYmplY3RNb2JpbGVDb2x1bW5zIiwiY291bnQiLCJnZXRGaWVsZCIsImlzTmFtZUNvbHVtbiIsIml0ZW1Db3VudCIsIm1heENvdW50IiwibWF4Um93cyIsIm5hbWVDb2x1bW4iLCJuYW1lS2V5IiwicmVzdWx0IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJSZWdFeHAiLCJfcmVnRXhNZXNzYWdlcyIsIl9nbG9iYWxNZXNzYWdlcyIsInJlZ0V4IiwiZXhwIiwibXNnIiwibWVzc2FnZXMiLCJldmFsSW5Db250ZXh0IiwianMiLCJldmFsIiwiY2FsbCIsImNvbnZlcnRGaWVsZCIsImdldE9wdGlvbiIsIm9wdGlvbiIsImZvbyIsImNvbG9yIiwiYWxsT3B0aW9ucyIsInBpY2tsaXN0IiwicGlja2xpc3RPcHRpb25zIiwiZ2V0UGlja2xpc3QiLCJnZXRQaWNrTGlzdE9wdGlvbnMiLCJyZXZlcnNlIiwiZW5hYmxlIiwiZGVmYXVsdFZhbHVlIiwidHJpZ2dlcnMiLCJ0cmlnZ2VyIiwiX3RvZG8iLCJfdG9kb19mcm9tX2NvZGUiLCJfdG9kb19mcm9tX2RiIiwib24iLCJ0b2RvIiwic3lzdGVtQmFzZUZpZWxkcyIsIm9taXQiLCJyZXF1aXJlZCIsInJlYWRvbmx5IiwiZ2V0U3lzdGVtQmFzZUZpZWxkcyIsIl92aXNpYmxlIiwiZXJyb3IxIiwiYWN0aW9uc0J5TmFtZSIsInRyaW0iLCJpc0V4cHJlc3Npb24iLCJ2aXNpYmxlIiwicmVjb3JkX3Blcm1pc3Npb25zIiwiZ2xvYmFsRGF0YSIsImFzc2lnbiIsIm5vdyIsInBhcnNlU2luZ2xlRXhwcmVzc2lvbiIsIl9vcHRpb25zIiwiX3R5cGUiLCJiZWZvcmVPcGVuRnVuY3Rpb24iLCJpc19jb21wYW55X2xpbWl0ZWQiLCJtYXgiLCJtaW4iLCJfb3B0aW9uIiwiayIsIl9yZWdFeCIsIl9taW4iLCJfbWF4IiwiTnVtYmVyIiwiQm9vbGVhbiIsIl9vcHRpb25zRnVuY3Rpb24iLCJfcmVmZXJlbmNlX3RvIiwiX2NyZWF0ZUZ1bmN0aW9uIiwiX2JlZm9yZU9wZW5GdW5jdGlvbiIsIl9maWx0ZXJzRnVuY3Rpb24iLCJfZGVmYXVsdFZhbHVlIiwiX2lzX2NvbXBhbnlfbGltaXRlZCIsIl9maWx0ZXJzIiwiaXNEYXRlIiwicG9wIiwiX2lzX2RhdGUiLCJmb3JtIiwidmFsIiwicmVsYXRlZE9iakluZm8iLCJQUkVGSVgiLCJfcHJlcGVuZFByZWZpeEZvckZvcm11bGEiLCJwcmVmaXgiLCJmaWVsZFZhcmlhYmxlIiwicmVnIiwicmV2IiwibSIsIiQxIiwiZm9ybXVsYV9zdHIiLCJfQ09OVEVYVCIsIl9WQUxVRVMiLCJpc0Jvb2xlYW4iLCJ0b2FzdHIiLCJmb3JtYXRPYmplY3ROYW1lIiwiX2Jhc2VPYmplY3QiLCJfZGIiLCJkZWZhdWx0TGlzdFZpZXdJZCIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJzY2hlbWEiLCJzZWxmIiwiYmFzZU9iamVjdCIsInBlcm1pc3Npb25fc2V0IiwiaWNvbiIsImRlc2NyaXB0aW9uIiwiaXNfdmlldyIsImhhc0ltcG9ydFRlbXBsYXRlcyIsInZlcnNpb24iLCJpc19lbmFibGUiLCJhbGxvd19jdXN0b21BY3Rpb25zIiwiZXhjbHVkZV9hY3Rpb25zIiwiZW5hYmxlX3NlYXJjaCIsInBhZ2luZyIsImVuYWJsZV9hcGkiLCJjdXN0b20iLCJlbmFibGVfc2hhcmUiLCJlbmFibGVfdHJlZSIsInNpZGViYXIiLCJvcGVuX3dpbmRvdyIsImZpbHRlcl9jb21wYW55IiwiY2FsZW5kYXIiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJlbmFibGVfZm9sbG93IiwiZW5hYmxlX3dvcmtmbG93IiwiZW5hYmxlX2lubGluZV9lZGl0IiwiZGV0YWlscyIsIm1hc3RlcnMiLCJsb29rdXBfZGV0YWlscyIsImluX2RldmVsb3BtZW50IiwiaWRGaWVsZE5hbWUiLCJkYXRhYmFzZV9uYW1lIiwiaXNfbmFtZSIsInByaW1hcnkiLCJmaWx0ZXJhYmxlIiwiaXRlbV9uYW1lIiwiY29weUl0ZW0iLCJhZG1pbiIsImFsbCIsImxpc3Rfdmlld19pdGVtIiwiUmVhY3RpdmVWYXIiLCJjcmVhdGVDb2xsZWN0aW9uIiwiX25hbWUiLCJnZXRPYmplY3RTY2hlbWEiLCJjb250YWlucyIsImF0dGFjaFNjaGVtYSIsIl9zaW1wbGVTY2hlbWEiLCJnZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCIsImJvb3RzdHJhcExvYWRlZCIsImdldFNlbGVjdE9wdGlvbnMiLCJmaWVsZFNjaGVtYSIsImRhdGFfdHlwZSIsIm9wdGlvbkl0ZW0iLCJmaWVsZHNBcnIiLCJfcmVmX29iaiIsImF1dG9mb3JtX3R5cGUiLCJjb2xsZWN0aW9uTmFtZSIsImZzIiwiZnNUeXBlIiwiaXNVbkxpbWl0ZWQiLCJtdWx0aXBsZSIsInJvd3MiLCJsYW5ndWFnZSIsImlzTW9iaWxlIiwiaXNQYWQiLCJpc2lPUyIsImFmRmllbGRJbnB1dCIsInRpbWV6b25lSWQiLCJkeERhdGVCb3hPcHRpb25zIiwiZGlzcGxheUZvcm1hdCIsInBpY2tlclR5cGUiLCJkYXRlTW9iaWxlT3B0aW9ucyIsIm91dEZvcm1hdCIsInNob3dJY29uIiwiZGVwZW5kT24iLCJkZXBlbmRfb24iLCJjcmVhdGUiLCJsb29rdXBfZmllbGQiLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJvcGVyYXRpb24iLCJvblN1Y2Nlc3MiLCJhZGRJdGVtcyIsInJlZmVyZW5jZV9zb3J0Iiwib3B0aW9uc1NvcnQiLCJyZWZlcmVuY2VfbGltaXQiLCJvcHRpb25zTGltaXQiLCJyZWZlcmVuY2VfdG9fZmllbGQiLCJyZWZlcmVuY2VUb0ZpZWxkIiwiYmxhY2tib3giLCJvYmplY3RTd2l0Y2hlIiwib3B0aW9uc01ldGhvZCIsIm9wdGlvbnNNZXRob2RQYXJhbXMiLCJyZWZlcmVuY2VzIiwiX3JlZmVyZW5jZSIsImxpbmsiLCJkZWZhdWx0SWNvbiIsImZpcnN0T3B0aW9uIiwiZGVjaW1hbCIsInByZWNpc2lvbiIsInNjYWxlIiwiZGlzYWJsZWQiLCJBcnJheSIsImVkaXRhYmxlIiwiYWNjZXB0Iiwic3lzdGVtIiwiRW1haWwiLCJpc051bWJlciIsIm9wdGlvbmFsIiwidW5pcXVlIiwiZ3JvdXAiLCJzZWFyY2hhYmxlIiwiaW5saW5lSGVscFRleHQiLCJpc1Byb2R1Y3Rpb24iLCJzb3J0YWJsZSIsImdldEZpZWxkRGlzcGxheVZhbHVlIiwiZmllbGRfdmFsdWUiLCJodG1sIiwibW9tZW50IiwiZm9ybWF0IiwiY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5IiwiZmllbGRfdHlwZSIsInB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyIsIm9wZXJhdGlvbnMiLCJidWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJidWlsdGluSXRlbSIsImlzX2NoZWNrX29ubHkiLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uIiwiYmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJnZXRRdWFydGVyU3RhcnRNb250aCIsIm1vbnRoIiwiZ2V0TW9udGgiLCJnZXRMYXN0UXVhcnRlckZpcnN0RGF5IiwieWVhciIsImdldEZ1bGxZZWFyIiwiZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSIsImdldE1vbnRoRGF5cyIsImRheXMiLCJlbmREYXRlIiwibWlsbGlzZWNvbmQiLCJzdGFydERhdGUiLCJnZXRMYXN0TW9udGhGaXJzdERheSIsImN1cnJlbnRNb250aCIsImN1cnJlbnRZZWFyIiwiZW5kVmFsdWUiLCJmaXJzdERheSIsImxhc3REYXkiLCJsYXN0TW9uZGF5IiwibGFzdE1vbnRoRmluYWxEYXkiLCJsYXN0TW9udGhGaXJzdERheSIsImxhc3RRdWFydGVyRW5kRGF5IiwibGFzdFF1YXJ0ZXJTdGFydERheSIsImxhc3RTdW5kYXkiLCJsYXN0XzEyMF9kYXlzIiwibGFzdF8zMF9kYXlzIiwibGFzdF82MF9kYXlzIiwibGFzdF83X2RheXMiLCJsYXN0XzkwX2RheXMiLCJtaW51c0RheSIsIm1vbmRheSIsIm5leHRNb25kYXkiLCJuZXh0TW9udGhGaW5hbERheSIsIm5leHRNb250aEZpcnN0RGF5IiwibmV4dFF1YXJ0ZXJFbmREYXkiLCJuZXh0UXVhcnRlclN0YXJ0RGF5IiwibmV4dFN1bmRheSIsIm5leHRZZWFyIiwibmV4dF8xMjBfZGF5cyIsIm5leHRfMzBfZGF5cyIsIm5leHRfNjBfZGF5cyIsIm5leHRfN19kYXlzIiwibmV4dF85MF9kYXlzIiwicHJldmlvdXNZZWFyIiwic3RhcnRWYWx1ZSIsInN0ckVuZERheSIsInN0ckZpcnN0RGF5Iiwic3RyTGFzdERheSIsInN0ck1vbmRheSIsInN0clN0YXJ0RGF5Iiwic3RyU3VuZGF5Iiwic3RyVG9kYXkiLCJzdHJUb21vcnJvdyIsInN0clllc3RkYXkiLCJzdW5kYXkiLCJ0aGlzUXVhcnRlckVuZERheSIsInRoaXNRdWFydGVyU3RhcnREYXkiLCJ0b21vcnJvdyIsIndlZWsiLCJ5ZXN0ZGF5IiwiZ2V0RGF5IiwidCIsImZ2Iiwic2V0SG91cnMiLCJnZXRIb3VycyIsImdldFRpbWV6b25lT2Zmc2V0IiwiZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uIiwiZ2V0RmllbGRPcGVyYXRpb24iLCJvcHRpb25hbHMiLCJlcXVhbCIsInVuZXF1YWwiLCJsZXNzX3RoYW4iLCJncmVhdGVyX3RoYW4iLCJsZXNzX29yX2VxdWFsIiwiZ3JlYXRlcl9vcl9lcXVhbCIsIm5vdF9jb250YWluIiwic3RhcnRzX3dpdGgiLCJiZXR3ZWVuIiwiZ2V0T2JqZWN0RmllbGRzTmFtZSIsImZpZWxkc05hbWUiLCJzb3J0X25vIiwiY2xlYW5UcmlnZ2VyIiwiaW5pdFRyaWdnZXIiLCJfdHJpZ2dlcl9ob29rcyIsInJlZjUiLCJ0b2RvV3JhcHBlciIsImFwcGx5IiwiYXJndW1lbnRzIiwid2hlbiIsImJlZm9yZSIsImluc2VydCIsInJlbW92ZSIsImFmdGVyIiwiX2hvb2siLCJ0cmlnZ2VyX25hbWUiLCJfdHJpZ2dlcl9ob29rIiwiYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzIiwiZXh0ZW5kUGVybWlzc2lvblByb3BzIiwiZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCIsImZpbmRfcGVybWlzc2lvbl9vYmplY3QiLCJpbnRlcnNlY3Rpb25QbHVzIiwib3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzIiwib3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzIiwicGVybWlzc2lvblByb3BOYW1lcyIsInVuaW9uUGVybWlzc2lvbk9iamVjdHMiLCJ1bmlvblBsdXMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImdldFJlY29yZFBlcm1pc3Npb25zIiwiaXNPd25lciIsIm1hc3Rlck9iamVjdE5hbWUiLCJtYXN0ZXJSZWNvcmRQZXJtIiwicmVjb3JkX2NvbXBhbnlfaWQiLCJyZWNvcmRfY29tcGFueV9pZHMiLCJ1c2VyX2NvbXBhbnlfaWRzIiwib3duZXIiLCJwYXJlbnQiLCJuIiwiaW50ZXJzZWN0aW9uIiwibG9ja2VkIiwiZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyIsImN1cnJlbnRPYmplY3ROYW1lIiwicmVsYXRlZExpc3RJdGVtIiwiY3VycmVudFJlY29yZCIsImlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSIsIm1hc3RlckFsbG93IiwicmVsYXRlZE9iamVjdFBlcm1pc3Npb25zIiwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QiLCJnZXRPYmplY3RSZWNvcmQiLCJnZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIl9pIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwic3BhY2VVc2VyIiwib2JqZWN0cyIsImFzc2lnbmVkX2FwcHMiLCJwcm9maWxlIiwidXNlcnMiLCJwZXJtaXNzaW9uX3NldF9pZCIsIm1vZGlmaWVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwiZ2V0QXNzaWduZWRBcHBzIiwiYmluZCIsImFzc2lnbmVkX21lbnVzIiwiZ2V0QXNzaWduZWRNZW51cyIsInVzZXJfcGVybWlzc2lvbl9zZXRzIiwiYXJyYXkiLCJvdGhlciIsInRhcmdldCIsInByb3BzIiwiZmlsZXNQcm9OYW1lcyIsInByb3BOYW1lcyIsInByb3BOYW1lIiwiYXBwcyIsInBzZXRCYXNlIiwidXNlclByb2ZpbGUiLCJwc2V0IiwidW5pcSIsImFib3V0TWVudSIsImFkbWluTWVudXMiLCJhbGxNZW51cyIsImN1cnJlbnRQc2V0TmFtZXMiLCJtZW51cyIsIm90aGVyTWVudUFwcHMiLCJvdGhlck1lbnVzIiwiYWRtaW5fbWVudXMiLCJmbGF0dGVuIiwibWVudSIsInBzZXRzTWVudSIsInBlcm1pc3Npb25fc2V0cyIsInBlcm1pc3Npb25fb2JqZWN0cyIsImlzTnVsbCIsInBlcm1pc3Npb25fc2V0X2lkcyIsInBvcyIsIm9wcyIsIm9wc19rZXkiLCJjdXJyZW50UHNldCIsInRlbXBPcHMiLCJyZXBlYXRJbmRleCIsInJlcGVhdFBvIiwib3BzZXRBZG1pbiIsIm9wc2V0Q3VzdG9tZXIiLCJvcHNldEd1ZXN0Iiwib3BzZXRNZW1iZXIiLCJvcHNldFN1cHBsaWVyIiwib3BzZXRVc2VyIiwicG9zQWRtaW4iLCJwb3NDdXN0b21lciIsInBvc0d1ZXN0IiwicG9zTWVtYmVyIiwicG9zU3VwcGxpZXIiLCJwb3NVc2VyIiwicHJvZiIsImd1ZXN0IiwibWVtYmVyIiwic3VwcGxpZXIiLCJjdXN0b21lciIsImRpc2FibGVkX2FjdGlvbnMiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsInVuZWRpdGFibGVfZmllbGRzIiwiY3JlYXRvcl9kYl91cmwiLCJvcGxvZ191cmwiLCJNT05HT19VUkxfQ1JFQVRPUiIsIk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SIiwiX0NSRUFUT1JfREFUQVNPVVJDRSIsIl9kcml2ZXIiLCJNb25nb0ludGVybmFscyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvcGxvZ1VybCIsImNvbGxlY3Rpb25fa2V5IiwibmV3Q29sbGVjdGlvbiIsIlNNU1F1ZXVlIiwiX2RlbGV0ZVJlY29yZCIsImFjdGlvbl9uYW1lIiwiZXhlY3V0ZUFjdGlvbiIsIml0ZW1fZWxlbWVudCIsImNhbGxiYWNrIiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIk9iamVjdEdyaWQiLCJnZXRGaWx0ZXJzIiwid29yZF90ZW1wbGF0ZSIsIlN0ZWVkb3NGaWx0ZXJzIiwiZm9ybWF0RmlsdGVyc1RvT0RhdGFRdWVyeSIsImFic29sdXRlVXJsIiwid2luZG93Iiwib3BlbiIsIm9kYXRhIiwicHJvdG90eXBlIiwic2xpY2UiLCJjb25jYXQiLCJ3YXJuaW5nIiwicmVjb3JkX3RpdGxlIiwiY2FsbF9iYWNrIiwiY2FsbF9iYWNrX2Vycm9yIiwicHJldmlvdXNEb2MiLCJGb3JtTWFuYWdlciIsImdldFByZXZpb3VzRG9jIiwiaW5mbyIsInN1Y2Nlc3MiLCJydW5Ib29rIiwicmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3IiwiY29sbGVjdGlvbl9uYW1lIiwiY3VycmVudF9vYmplY3RfbmFtZSIsImN1cnJlbnRfcmVjb3JkX2lkIiwiZGVmYXVsdERvYyIsImluaXRpYWxWYWx1ZXMiLCJyZWxhdGVPYmplY3QiLCJzZXQiLCJnZXRSZWxhdGVkSW5pdGlhbFZhbHVlcyIsIlN0ZWVkb3NVSSIsInNob3dNb2RhbCIsInN0b3JlcyIsIkNvbXBvbmVudFJlZ2lzdHJ5IiwiY29tcG9uZW50cyIsIk9iamVjdEZvcm0iLCJvYmplY3RBcGlOYW1lIiwidGl0bGUiLCJhZnRlckluc2VydCIsInJlbG9hZFJlY29yZCIsIkZsb3dSb3V0ZXIiLCJyZWxvYWQiLCJpY29uUGF0aCIsImRlZmVyIiwiJCIsImNsaWNrIiwiZ3JpZE5hbWUiLCJpc1JlbGF0ZWQiLCJtYXN0ZXJSZWNvcmRJZCIsInJlbGF0ZWRGaWVsZE5hbWUiLCJzZWxlY3RlZFJvd3MiLCJncmlkUmVmcyIsImN1cnJlbnQiLCJhcGkiLCJnZXRTZWxlY3RlZFJvd3MiLCJncmlkUmVmIiwiZ2V0SW5pdGlhbFZhbHVlcyIsIlBhZ2UiLCJGb3JtIiwiU3RhbmRhcmROZXciLCJyZW5kZXIiLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwicmVkaXJlY3QiLCJTdGFuZGFyZEVkaXQiLCJiZWZvcmVIb29rIiwiaTE4blRleHRLZXkiLCJpMThuVGl0bGVLZXkiLCJuYW1lRmllbGQiLCJzZWxlY3RlZFJlY29yZHMiLCJ0ZXh0IiwiZ2V0VGFibGVTZWxlY3RlZFJvd3MiLCJzd2FsIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsImFmdGVyQmF0Y2hlc0RlbGV0ZSIsImRlbGV0ZUNvdW50ZXIiLCJfZSIsImFwcGlkIiwiZHhEYXRhR3JpZEluc3RhbmNlIiwiZ3JpZENvbnRhaW5lciIsImdyaWRPYmplY3ROYW1lQ2xhc3MiLCJpc09wZW5lclJlbW92ZSIsInJlY29yZFVybCIsInRlbXBOYXZSZW1vdmVkIiwib3BlbmVyIiwicm91dGUiLCJlbmRzV2l0aCIsInJlZnJlc2hHcmlkIiwiZHhUcmVlTGlzdCIsImR4RGF0YUdyaWQiLCJyZWZyZXNoIiwicmVtb3ZlVGVtcE5hdkl0ZW0iLCJjbG9zZSIsImdvIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsInJlY29yZFRpdGxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxLQUFDQSxFQUFELEdBQU0sRUFBTjs7QUFDQSxJQUFJLE9BQUFDLE9BQUEsb0JBQUFBLFlBQUEsSUFBSjtBQUNDLE9BQUNBLE9BQUQsR0FBVyxFQUFYO0FDRUE7O0FERERBLFFBQVFDLE9BQVIsR0FBa0IsRUFBbEI7QUFDQUQsUUFBUUUsV0FBUixHQUFzQixFQUF0QjtBQUNBRixRQUFRRyxLQUFSLEdBQWdCLEVBQWhCO0FBQ0FILFFBQVFJLElBQVIsR0FBZSxFQUFmO0FBQ0FKLFFBQVFLLFVBQVIsR0FBcUIsRUFBckI7QUFDQUwsUUFBUU0sT0FBUixHQUFrQixFQUFsQjtBQUNBTixRQUFRTyxJQUFSLEdBQWUsRUFBZjtBQUNBUCxRQUFRUSxhQUFSLEdBQXdCLEVB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LEdBQWxDLEVBQXVDeTJCLFdBQXZDLEVBQW9EanBCLFlBQXBELEVBQWtFaEUsTUFBbEUsRUFBMkU7QUFDMUUsc0JBQUFtc0IsU0FBQTtBQUFBQSw4QkFBWXIvQixRQUFRKzlCLFlBQVIsQ0FBcUIvMUIsV0FBckIsRUFBa0NtTSxTQUFsQyxDQUFaO0FBQ0FuVSwwQkFBUTgvQixpQkFBUixDQUEwQjkzQixXQUExQixFQUF1Q3EzQixTQUF2QztBQ3dDUSx5QkR2Q1JSLG9CQ3VDUTtBRDFDaUUsaUJBQTFFLEVBSUc7QUN3Q00seUJEdkNSQSxvQkN1Q1E7QUQ1Q1Qsa0JDc0NPO0FEN0NSLGdCQ2tDTTtBRDdGUjtBQUREO0FDb0hJO0FENUhOLFFDcUJHO0FEM0lKO0FBQUEsR0FGRDtBQ3dQQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJAZGIgPSB7fVxuaWYgIUNyZWF0b3I/XG5cdEBDcmVhdG9yID0ge31cbkNyZWF0b3IuT2JqZWN0cyA9IHt9XG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge31cbkNyZWF0b3IuTWVudXMgPSBbXVxuQ3JlYXRvci5BcHBzID0ge31cbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9XG5DcmVhdG9yLlJlcG9ydHMgPSB7fVxuQ3JlYXRvci5zdWJzID0ge31cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9IiwidGhpcy5kYiA9IHt9O1xuXG5pZiAodHlwZW9mIENyZWF0b3IgPT09IFwidW5kZWZpbmVkXCIgfHwgQ3JlYXRvciA9PT0gbnVsbCkge1xuICB0aGlzLkNyZWF0b3IgPSB7fTtcbn1cblxuQ3JlYXRvci5PYmplY3RzID0ge307XG5cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fTtcblxuQ3JlYXRvci5NZW51cyA9IFtdO1xuXG5DcmVhdG9yLkFwcHMgPSB7fTtcblxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge307XG5cbkNyZWF0b3IuUmVwb3J0cyA9IHt9O1xuXG5DcmVhdG9yLnN1YnMgPSB7fTtcblxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge307XG4iLCJ0cnlcblx0aWYgcHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnXG5cdFx0c3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcblx0XHRvYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJylcblx0XHRtb2xlY3VsZXIgPSByZXF1aXJlKFwibW9sZWN1bGVyXCIpO1xuXHRcdHBhY2thZ2VMb2FkZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGVvci1wYWNrYWdlLWxvYWRlcicpO1xuXHRcdEFQSVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLWFwaScpO1xuXHRcdE1ldGFkYXRhU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0YWRhdGEtc2VydmVyJyk7XG5cdFx0cGFja2FnZVNlcnZpY2UgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIpO1xuXHRcdHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXHRcdGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcblx0XHRzZXR0aW5ncyA9IHtcblx0XHRcdGJ1aWx0X2luX3BsdWdpbnM6IFtcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1zcGFjZVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLWNtc1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLW9iamVjdC1kYXRhYmFzZVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3MtYXBwcm92YWxcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1jb2xsYWJvcmF0aW9uXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc3RhbmRhcmQtdWlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1wZXJtaXNzaW9uXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvd2ViYXBwLXB1YmxpY1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2FjaGVycy1tYW5hZ2VyXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvdW5wa2dcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93b3JrZmxvd1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL2FjY291bnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvcGx1Z2luLWNvbXBhbnlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9tZXRhZGF0YS1hcGlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9kYXRhLWltcG9ydFwiLFxuXHRcdFx0XHQjIFwiQHN0ZWVkb3Mvc2VydmljZS1maWVsZHMtaW5kZXhzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1hY2NvdW50c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2hhcnRzXCIsXG5cdFx0XHRcdCMgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1jbG91ZC1pbml0XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIsXG5cdFx0ICAgIFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXRvb2xcIjtcblx0XHRcdFx0IyBcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3NcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93ZWJhcHAtYWNjb3VudHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLXdvcmtmbG93XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wbHVnaW4tYW1pc1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtZmlsZXNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWlkZW50aXR5LWp3dFwiXG5cdFx0XHRdLFxuXHRcdFx0cGx1Z2luczogY29uZmlnLnBsdWdpbnNcblx0XHR9XG5cdFx0TWV0ZW9yLnN0YXJ0dXAgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuXHRcdFx0XHRcdG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG5cdFx0XHRcdFx0bm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuXHRcdFx0XHRcdG1ldGFkYXRhOiB7fSxcblx0XHRcdFx0XHR0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG5cdFx0XHRcdFx0Y2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG5cdFx0XHRcdFx0bG9nTGV2ZWw6IFwid2FyblwiLFxuXHRcdFx0XHRcdHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuXHRcdFx0XHRcdHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG5cdFx0XHRcdFx0bWF4Q2FsbExldmVsOiAxMDAsXG5cblx0XHRcdFx0XHRoZWFydGJlYXRJbnRlcnZhbDogMTAsXG5cdFx0XHRcdFx0aGVhcnRiZWF0VGltZW91dDogMzAsXG5cblx0XHRcdFx0XHRjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG5cblx0XHRcdFx0XHR0cmFja2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaHV0ZG93blRpbWVvdXQ6IDUwMDAsXG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG5cblx0XHRcdFx0XHRyZWdpc3RyeToge1xuXHRcdFx0XHRcdFx0c3RyYXRlZ3k6IFwiUm91bmRSb2JpblwiLFxuXHRcdFx0XHRcdFx0cHJlZmVyTG9jYWw6IHRydWVcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0YnVsa2hlYWQ6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0Y29uY3VycmVuY3k6IDEwLFxuXHRcdFx0XHRcdFx0bWF4UXVldWVTaXplOiAxMDAsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR2YWxpZGF0b3I6IHRydWUsXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBudWxsLFxuXHRcdFx0XHRcdHRyYWNpbmc6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZXhwb3J0ZXI6IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJDb25zb2xlXCIsXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0XHRsb2dnZXI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3JzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0XHRcdFx0Z2F1Z2VXaWR0aDogNDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2tpcFByb2Nlc3NFdmVudFJlZ2lzdHJhdGlvbjogdHJ1ZSxcblxuXHRcdFx0XHRcdGNyZWF0ZWQ6IChicm9rZXIpLT4gXG5cdFx0XHRcdFx0XHQjIENsZWFyIGFsbCBjYWNoZSBlbnRyaWVzXG5cdFx0XHRcdFx0XHRicm9rZXIubG9nZ2VyLndhcm4oJ0NsZWFyIGFsbCBjYWNoZSBlbnRyaWVzIG9uIHN0YXJ0dXAuJylcblx0XHRcdFx0XHRcdGJyb2tlci5jYWNoZXIuY2xlYW4oKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0b2JqZWN0cWwuYnJva2VyLmluaXQoYnJva2VyKTtcblxuXHRcdFx0XHRvYmplY3RxbFNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZShyZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1vYmplY3RxbFwiKSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRwcm9qZWN0U2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiBcInByb2plY3Qtc2VydmVyXCIsXG5cdFx0XHRcdFx0bmFtZXNwYWNlOiBcInN0ZWVkb3NcIixcblx0XHRcdFx0XHRtaXhpbnM6IFtwYWNrYWdlU2VydmljZV0sXG5cdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0bWV0YWRhdGFTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6ICdtZXRhZGF0YS1zZXJ2ZXInLFxuXHRcdFx0XHRcdG1peGluczogW01ldGFkYXRhU2VydmljZV0sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR1aVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZShyZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS11aVwiKSk7XG5cblx0XHRcdFx0YXBpU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiBcImFwaVwiLFxuXHRcdFx0XHRcdG1peGluczogW0FQSVNlcnZpY2VdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRwb3J0OiBudWxsXG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cGFnZVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogXCJAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzXCIsXG5cdFx0XHRcdFx0bWl4aW5zOiBbcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1wYWdlcycpXSxcblx0XHRcdFx0XHRzZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0cG9ydDogbnVsbFxuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHN0ZWVkb3NTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6IFwic3RlZWRvcy1zZXJ2ZXJcIixcblx0XHRcdFx0XHRtaXhpbnM6IFtdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRwb3J0OiBudWxsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdGFydGVkOiAoKS0+XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdFx0XHRcdGJyb2tlci5lbWl0ICdzdGVlZG9zLXNlcnZlci5zdGFydGVkJ1xuXHRcdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRcdCwgMTAwMFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRvYmplY3RxbC5nZXRTdGVlZG9zU2NoZW1hKGJyb2tlcik7XG5cdFx0XHRcdHN0YW5kYXJkT2JqZWN0c0RpciA9IG9iamVjdHFsLlN0YW5kYXJkT2JqZWN0c1BhdGg7XG5cdFx0XHRcdHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6ICdzdGFuZGFyZC1vYmplY3RzJyxcblx0XHRcdFx0XHRtaXhpbnM6IFtwYWNrYWdlTG9hZGVyXSxcblx0XHRcdFx0XHRzZXR0aW5nczogeyBwYWNrYWdlSW5mbzoge1xuXHRcdFx0XHRcdFx0cGF0aDogc3RhbmRhcmRPYmplY3RzRGlyLFxuXHRcdFx0XHRcdH0gfVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRNZXRlb3Iud3JhcEFzeW5jKChjYiktPlxuXHRcdFx0XHRcdGJyb2tlci5zdGFydCgpLnRoZW4oKCktPlxuXHRcdFx0XHRcdFx0aWYgIWJyb2tlci5zdGFydGVkIFxuXHRcdFx0XHRcdFx0XHRicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKG9iamVjdHFsU2VydmljZSk7XG5cdFx0XHRcdFx0XHRcdGJyb2tlci5fcmVzdGFydFNlcnZpY2Uoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UpO1xuXHRcdFx0XHRcdFx0XHRicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKHVpU2VydmljZSk7XG5cblx0XHRcdFx0XHRcdGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5cdFx0XHRcdFx0XHRjb25uZWN0SGFuZGxlcnNFeHByZXNzID0gZXhwcmVzcygpO1xuXHRcdFx0XHRcdFx0Y29ubmVjdEhhbmRsZXJzRXhwcmVzcy51c2UocmVxdWlyZSgnQHN0ZWVkb3Mvcm91dGVyJykuc3RhdGljUm91dGVyKCkpO1xuXHRcdFx0XHRcdFx0YnJva2VyLndhaXRGb3JTZXJ2aWNlcygnfnBhY2thZ2VzLUBzdGVlZG9zL3NlcnZpY2UtdWknKS50aGVuICgpLT5cblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dhaXRGb3JTZXJ2aWNlcyB+cGFja2FnZXMtQHN0ZWVkb3Mvc2VydmljZS11aScpXG5cdFx0XHRcdFx0XHRcdGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MudXNlKFN0ZWVkb3NBcGkuZXhwcmVzcygpKVxuXHRcdFx0XHRcdFx0XHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShjb25uZWN0SGFuZGxlcnNFeHByZXNzKVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQjIHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4gKCktPlxuXHRcdFx0XHRcdFx0IyBcdGNiKCk7XG5cblx0XHRcdFx0XHRcdGJyb2tlci53YWl0Rm9yU2VydmljZXMoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UubmFtZSkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0XHRcdFx0XHRzdGVlZG9zQ29yZS5pbml0KHNldHRpbmdzKS50aGVuICgpLT5cblx0XHRcdFx0XHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpKClcblx0XHRcdGNhdGNoIGV4XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixleClcbmNhdGNoIGVcblx0Y29uc29sZS5lcnJvcihcImVycm9yOlwiLGUpIiwidmFyIEFQSVNlcnZpY2UsIE1ldGFkYXRhU2VydmljZSwgY29uZmlnLCBlLCBtb2xlY3VsZXIsIG9iamVjdHFsLCBwYWNrYWdlTG9hZGVyLCBwYWNrYWdlU2VydmljZSwgcGF0aCwgc2V0dGluZ3MsIHN0ZWVkb3NDb3JlO1xuXG50cnkge1xuICBpZiAocHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuICAgIG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcbiAgICBtb2xlY3VsZXIgPSByZXF1aXJlKFwibW9sZWN1bGVyXCIpO1xuICAgIHBhY2thZ2VMb2FkZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGVvci1wYWNrYWdlLWxvYWRlcicpO1xuICAgIEFQSVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLWFwaScpO1xuICAgIE1ldGFkYXRhU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0YWRhdGEtc2VydmVyJyk7XG4gICAgcGFja2FnZVNlcnZpY2UgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIpO1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgY29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xuICAgIHNldHRpbmdzID0ge1xuICAgICAgYnVpbHRfaW5fcGx1Z2luczogW1wiQHN0ZWVkb3Mvc3RhbmRhcmQtc3BhY2VcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1jbXNcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1vYmplY3QtZGF0YWJhc2VcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1wcm9jZXNzLWFwcHJvdmFsXCIsIFwiQHN0ZWVkb3Mvc3RhbmRhcmQtY29sbGFib3JhdGlvblwiLCBcIkBzdGVlZG9zL3N0YW5kYXJkLXVpXCIsIFwiQHN0ZWVkb3Mvc3RhbmRhcmQtcGVybWlzc2lvblwiLCBcIkBzdGVlZG9zL3dlYmFwcC1wdWJsaWNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWNhY2hlcnMtbWFuYWdlclwiLCBcIkBzdGVlZG9zL3VucGtnXCIsIFwiQHN0ZWVkb3Mvd29ya2Zsb3dcIiwgXCJAc3RlZWRvcy9hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3BsdWdpbi1jb21wYW55XCIsIFwiQHN0ZWVkb3MvbWV0YWRhdGEtYXBpXCIsIFwiQHN0ZWVkb3MvZGF0YS1pbXBvcnRcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWFjY291bnRzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1jaGFydHNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWNsb3VkLWluaXRcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhY2thZ2UtcmVnaXN0cnlcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhY2thZ2UtdG9vbFwiLCBcIkBzdGVlZG9zL3dlYmFwcC1hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2Utd29ya2Zsb3dcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBsdWdpbi1hbWlzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1maWxlc1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtaWRlbnRpdHktand0XCJdLFxuICAgICAgcGx1Z2luczogY29uZmlnLnBsdWdpbnNcbiAgICB9O1xuICAgIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFwaVNlcnZpY2UsIGJyb2tlciwgZXgsIG1ldGFkYXRhU2VydmljZSwgb2JqZWN0cWxTZXJ2aWNlLCBwYWdlU2VydmljZSwgcHJvamVjdFNlcnZpY2UsIHN0YW5kYXJkT2JqZWN0c0Rpciwgc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UsIHN0ZWVkb3NTZXJ2aWNlLCB1aVNlcnZpY2U7XG4gICAgICB0cnkge1xuICAgICAgICBicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuICAgICAgICAgIG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG4gICAgICAgICAgbm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuICAgICAgICAgIG1ldGFkYXRhOiB7fSxcbiAgICAgICAgICB0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG4gICAgICAgICAgY2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG4gICAgICAgICAgbG9nTGV2ZWw6IFwid2FyblwiLFxuICAgICAgICAgIHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuICAgICAgICAgIHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG4gICAgICAgICAgbWF4Q2FsbExldmVsOiAxMDAsXG4gICAgICAgICAgaGVhcnRiZWF0SW50ZXJ2YWw6IDEwLFxuICAgICAgICAgIGhlYXJ0YmVhdFRpbWVvdXQ6IDMwLFxuICAgICAgICAgIGNvbnRleHRQYXJhbXNDbG9uaW5nOiBmYWxzZSxcbiAgICAgICAgICB0cmFja2luZzoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBzaHV0ZG93blRpbWVvdXQ6IDUwMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG4gICAgICAgICAgcmVnaXN0cnk6IHtcbiAgICAgICAgICAgIHN0cmF0ZWd5OiBcIlJvdW5kUm9iaW5cIixcbiAgICAgICAgICAgIHByZWZlckxvY2FsOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWxraGVhZDoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBjb25jdXJyZW5jeTogMTAsXG4gICAgICAgICAgICBtYXhRdWV1ZVNpemU6IDEwMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdmFsaWRhdG9yOiB0cnVlLFxuICAgICAgICAgIGVycm9ySGFuZGxlcjogbnVsbCxcbiAgICAgICAgICB0cmFjaW5nOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGV4cG9ydGVyOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiQ29uc29sZVwiLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvbG9yczogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgICAgICAgIGdhdWdlV2lkdGg6IDQwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNraXBQcm9jZXNzRXZlbnRSZWdpc3RyYXRpb246IHRydWUsXG4gICAgICAgICAgY3JlYXRlZDogZnVuY3Rpb24oYnJva2VyKSB7XG4gICAgICAgICAgICBicm9rZXIubG9nZ2VyLndhcm4oJ0NsZWFyIGFsbCBjYWNoZSBlbnRyaWVzIG9uIHN0YXJ0dXAuJyk7XG4gICAgICAgICAgICByZXR1cm4gYnJva2VyLmNhY2hlci5jbGVhbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9iamVjdHFsLmJyb2tlci5pbml0KGJyb2tlcik7XG4gICAgICAgIG9iamVjdHFsU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHJlcXVpcmUoXCJAc3RlZWRvcy9zZXJ2aWNlLW9iamVjdHFsXCIpKTtcbiAgICAgICAgcHJvamVjdFNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogXCJwcm9qZWN0LXNlcnZlclwiLFxuICAgICAgICAgIG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG4gICAgICAgICAgbWl4aW5zOiBbcGFja2FnZVNlcnZpY2VdXG4gICAgICAgIH0pO1xuICAgICAgICBtZXRhZGF0YVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogJ21ldGFkYXRhLXNlcnZlcicsXG4gICAgICAgICAgbWl4aW5zOiBbTWV0YWRhdGFTZXJ2aWNlXSxcbiAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgfSk7XG4gICAgICAgIHVpU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHJlcXVpcmUoXCJAc3RlZWRvcy9zZXJ2aWNlLXVpXCIpKTtcbiAgICAgICAgYXBpU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiBcImFwaVwiLFxuICAgICAgICAgIG1peGluczogW0FQSVNlcnZpY2VdLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBwb3J0OiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcGFnZVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogXCJAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzXCIsXG4gICAgICAgICAgbWl4aW5zOiBbcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1wYWdlcycpXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcG9ydDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHN0ZWVkb3NTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6IFwic3RlZWRvcy1zZXJ2ZXJcIixcbiAgICAgICAgICBtaXhpbnM6IFtdLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBwb3J0OiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdGFydGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBicm9rZXIuZW1pdCgnc3RlZWRvcy1zZXJ2ZXIuc3RhcnRlZCcpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgb2JqZWN0cWwuZ2V0U3RlZWRvc1NjaGVtYShicm9rZXIpO1xuICAgICAgICBzdGFuZGFyZE9iamVjdHNEaXIgPSBvYmplY3RxbC5TdGFuZGFyZE9iamVjdHNQYXRoO1xuICAgICAgICBzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiAnc3RhbmRhcmQtb2JqZWN0cycsXG4gICAgICAgICAgbWl4aW5zOiBbcGFja2FnZUxvYWRlcl0sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvOiB7XG4gICAgICAgICAgICAgIHBhdGg6IHN0YW5kYXJkT2JqZWN0c0RpclxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgICAgcmV0dXJuIGJyb2tlci5zdGFydCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY29ubmVjdEhhbmRsZXJzRXhwcmVzcywgZXhwcmVzcztcbiAgICAgICAgICAgIGlmICghYnJva2VyLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgYnJva2VyLl9yZXN0YXJ0U2VydmljZShvYmplY3RxbFNlcnZpY2UpO1xuICAgICAgICAgICAgICBicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlKTtcbiAgICAgICAgICAgICAgYnJva2VyLl9yZXN0YXJ0U2VydmljZSh1aVNlcnZpY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbiAgICAgICAgICAgIGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MgPSBleHByZXNzKCk7XG4gICAgICAgICAgICBjb25uZWN0SGFuZGxlcnNFeHByZXNzLnVzZShyZXF1aXJlKCdAc3RlZWRvcy9yb3V0ZXInKS5zdGF0aWNSb3V0ZXIoKSk7XG4gICAgICAgICAgICBicm9rZXIud2FpdEZvclNlcnZpY2VzKCd+cGFja2FnZXMtQHN0ZWVkb3Mvc2VydmljZS11aScpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3YWl0Rm9yU2VydmljZXMgfnBhY2thZ2VzLUBzdGVlZG9zL3NlcnZpY2UtdWknKTtcbiAgICAgICAgICAgICAgY29ubmVjdEhhbmRsZXJzRXhwcmVzcy51c2UoU3RlZWRvc0FwaS5leHByZXNzKCkpO1xuICAgICAgICAgICAgICByZXR1cm4gV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoY29ubmVjdEhhbmRsZXJzRXhwcmVzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBicm9rZXIud2FpdEZvclNlcnZpY2VzKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlLm5hbWUpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5pbml0KHNldHRpbmdzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KSgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIiwgZXgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBlID0gZXJyb3I7XG4gIGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIiwgZSk7XG59XG4iLCJDcmVhdG9yLmRlcHMgPSB7XG5cdGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxuXHRvYmplY3Q6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcbn07XG5cbkNyZWF0b3IuX1RFTVBMQVRFID0ge1xuXHRBcHBzOiB7fSxcblx0T2JqZWN0czoge31cbn1cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2ZpbHRlcnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe29wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2NyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXG4jIENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyDkvptzdGVlZG9zLWNsaemhueebruS9v+eUqFxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJylcblx0Q3JlYXRvci5maWJlckxvYWRPYmplY3RzID0gKG9iaiwgb2JqZWN0X25hbWUpLT5cblx0XHRGaWJlcigoKS0+XG5cdFx0XHRDcmVhdG9yLmxvYWRPYmplY3RzKG9iaiwgb2JqZWN0X25hbWUpXG5cdFx0KS5ydW4oKVxuXG5DcmVhdG9yLmxvYWRPYmplY3RzID0gKG9iaiwgb2JqZWN0X25hbWUpLT5cblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBvYmoubmFtZVxuXG5cdGlmICFvYmoubGlzdF92aWV3c1xuXHRcdG9iai5saXN0X3ZpZXdzID0ge31cblxuXHRpZiBvYmouc3BhY2Vcblx0XHRvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKVxuXHRpZiBvYmplY3RfbmFtZSA9PSAnY2ZzX2ZpbGVzX2ZpbGVyZWNvcmQnXG5cdFx0b2JqZWN0X25hbWUgPSAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXG5cdFx0b2JqID0gXy5jbG9uZShvYmopXG5cdFx0b2JqLm5hbWUgPSBvYmplY3RfbmFtZVxuXHRcdENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0gPSBvYmpcblxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKVxuXHRuZXcgQ3JlYXRvci5PYmplY3Qob2JqKTtcblxuXHRDcmVhdG9yLmluaXRUcmlnZ2VycyhvYmplY3RfbmFtZSlcblx0Q3JlYXRvci5pbml0TGlzdFZpZXdzKG9iamVjdF9uYW1lKVxuXHRyZXR1cm4gb2JqXG5cbkNyZWF0b3IuZ2V0T2JqZWN0TmFtZSA9IChvYmplY3QpIC0+XG5cdGlmIG9iamVjdC5zcGFjZVxuXHRcdHJldHVybiBcImNfI3tvYmplY3Quc3BhY2V9XyN7b2JqZWN0Lm5hbWV9XCJcblx0cmV0dXJuIG9iamVjdC5uYW1lXG5cbkNyZWF0b3IuZ2V0T2JqZWN0ID0gKG9iamVjdF9uYW1lLCBzcGFjZV9pZCktPlxuXHRpZiBfLmlzQXJyYXkob2JqZWN0X25hbWUpXG5cdFx0cmV0dXJuIDtcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0Q3JlYXRvci5kZXBzPy5vYmplY3Q/LmRlcGVuZCgpXG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cbiNcdGlmICFzcGFjZV9pZCAmJiBvYmplY3RfbmFtZVxuI1x0XHRpZiBNZXRlb3IuaXNDbGllbnQgJiYgIW9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2NfJylcbiNcdFx0XHRzcGFjZV9pZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXG5cdGlmIG9iamVjdF9uYW1lXG4jXHRcdGlmIHNwYWNlX2lkXG4jXHRcdFx0b2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY18je3NwYWNlX2lkfV8je29iamVjdF9uYW1lfVwiXVxuI1x0XHRcdGlmIG9ialxuI1x0XHRcdFx0cmV0dXJuIG9ialxuI1xuI1x0XHRvYmogPSBfLmZpbmQgQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAobyktPlxuI1x0XHRcdFx0cmV0dXJuIG8uX2NvbGxlY3Rpb25fbmFtZSA9PSBvYmplY3RfbmFtZVxuI1x0XHRpZiBvYmpcbiNcdFx0XHRyZXR1cm4gb2JqXG5cblx0XHRyZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSAob2JqZWN0X2lkKS0+XG5cdHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtfaWQ6IG9iamVjdF9pZH0pXG5cbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gKG9iamVjdF9uYW1lKS0+XG5cdGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKVxuXHRkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRkZWxldGUgQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSAob2JqZWN0X25hbWUsIHNwYWNlSWQpLT5cblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdGlmIG9iamVjdF9uYW1lXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRyZXR1cm4gZGJbb2JqZWN0X25hbWVdXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpPy5fY29sbGVjdGlvbl9uYW1lIHx8IG9iamVjdF9uYW1lXVxuXG5DcmVhdG9yLnJlbW92ZUNvbGxlY3Rpb24gPSAob2JqZWN0X25hbWUpLT5cblx0ZGVsZXRlIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuaXNTcGFjZUFkbWluID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdHNwYWNlID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIik/LmRiPy5maW5kT25lKHNwYWNlSWQse2ZpZWxkczp7YWRtaW5zOjF9fSlcblx0aWYgc3BhY2U/LmFkbWluc1xuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDBcblxuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IChmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyktPlxuXG5cdGlmICFfLmlzU3RyaW5nKGZvcm11bGFyKVxuXHRcdHJldHVybiBmb3JtdWxhclxuXG5cdGlmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKVxuXHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucylcblxuXHRyZXR1cm4gZm9ybXVsYXJcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSAoZmlsdGVycywgY29udGV4dCktPlxuXHRzZWxlY3RvciA9IHt9XG5cdF8uZWFjaCBmaWx0ZXJzLCAoZmlsdGVyKS0+XG5cdFx0aWYgZmlsdGVyPy5sZW5ndGggPT0gM1xuXHRcdFx0bmFtZSA9IGZpbHRlclswXVxuXHRcdFx0YWN0aW9uID0gZmlsdGVyWzFdXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgY29udGV4dClcblx0XHRcdHNlbGVjdG9yW25hbWVdID0ge31cblx0XHRcdHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZVxuXHQjIGNvbnNvbGUubG9nKFwiZXZhbHVhdGVGaWx0ZXJzLS0+c2VsZWN0b3JcIiwgc2VsZWN0b3IpXG5cdHJldHVybiBzZWxlY3RvclxuXG5DcmVhdG9yLmlzQ29tbW9uU3BhY2UgPSAoc3BhY2VJZCkgLT5cblx0cmV0dXJuIHNwYWNlSWQgPT0gJ2NvbW1vbidcblxuIyMjXG5cdGRvY3PvvJrlvoXmjpLluo/nmoTmlofmoaPmlbDnu4Rcblx0aWRz77yaX2lk6ZuG5ZCIXG5cdGlkX2tleTog6buY6K6k5Li6X2lkXG5cdHJldHVybiDmjInnhadpZHPnmoTpobrluo/ov5Tlm57mlrDnmoTmlofmoaPpm4blkIhcbiMjI1xuQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMgPSAoZG9jcywgaWRzLCBpZF9rZXksIGhpdF9maXJzdCktPlxuXG5cdGlmICFpZF9rZXlcblx0XHRpZF9rZXkgPSBcIl9pZFwiXG5cblx0aWYgaGl0X2ZpcnN0XG5cblx0XHQj55Sx5LqO5LiN6IO95L2/55SoXy5maW5kSW5kZXjlh73mlbDvvIzlm6DmraTmraTlpITlhYjlsIblr7nosaHmlbDnu4TovazkuLrmma7pgJrmlbDnu4TnsbvlnovvvIzlnKjojrflj5blhbZpbmRleFxuXHRcdHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KVxuXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XG5cdFx0XHRcdFx0X2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXG5cdFx0XHRcdFx0aWYgX2luZGV4ID4gLTFcblx0XHRcdFx0XHRcdHJldHVybiBfaW5kZXhcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gaWRzLmxlbmd0aCArIF8uaW5kZXhPZih2YWx1ZXMsIGRvY1tpZF9rZXldKVxuXHRlbHNlXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XG5cdFx0XHRyZXR1cm4gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXG5cbiMjI1xuXHTmjInnlKjmiLfmiYDlsZ7mnKzlnLDljJbor63oqIDov5vooYzmjpLluo/vvIzmlK/mjIHkuK3mlofjgIHmlbDlgLzjgIHml6XmnJ/nrYnlrZfmrrXmjpLluo9cblx05a+55LqOT2JqZWN057G75Z6L77yM5aaC5p6c5o+Q5L6b5L2c55So5Z+f5Lita2V55bGe5oCn77yM5YiZ5Y+W5YC85Li6dmFsdWVba2V5Xei/m+ihjOaOkuW6j+avlOi+g++8jOWPjeS5i+aVtOS4qk9iamVjdC50b1N0cmluZygp5ZCO5o6S5bqP5q+U6L6DXG4jIyNcbkNyZWF0b3Iuc29ydGluZ01ldGhvZCA9ICh2YWx1ZTEsIHZhbHVlMikgLT5cblx0aWYgdGhpcy5rZXlcblx0XHR2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldXG5cdFx0dmFsdWUyID0gdmFsdWUyW3RoaXMua2V5XVxuXHRpZiB2YWx1ZTEgaW5zdGFuY2VvZiBEYXRlXG5cdFx0dmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKVxuXHRpZiB2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlXG5cdFx0dmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKVxuXHRpZiB0eXBlb2YgdmFsdWUxIGlzIFwibnVtYmVyXCIgYW5kIHR5cGVvZiB2YWx1ZTIgaXMgXCJudW1iZXJcIlxuXHRcdHJldHVybiB2YWx1ZTEgLSB2YWx1ZTJcblx0IyBIYW5kbGluZyBudWxsIHZhbHVlc1xuXHRpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09IG51bGwgb3IgdmFsdWUxID09IHVuZGVmaW5lZFxuXHRpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09IG51bGwgb3IgdmFsdWUyID09IHVuZGVmaW5lZFxuXHRpZiBpc1ZhbHVlMUVtcHR5IGFuZCAhaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAtMVxuXHRpZiBpc1ZhbHVlMUVtcHR5IGFuZCBpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIDBcblx0aWYgIWlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gMVxuXHRsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG5cdHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlIHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGVcblxuXG4jIOivpeWHveaVsOWPquWcqOWIneWni+WMlk9iamVjdOaXtu+8jOaKiuebuOWFs+WvueixoeeahOiuoeeul+e7k+aenOS/neWtmOWIsE9iamVjdOeahHJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4re+8jOWQjue7reWPr+S7peebtOaOpeS7jnJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4reWPluW+l+iuoeeul+e7k+aenOiAjOS4jeeUqOWGjeasoeiwg+eUqOivpeWHveaVsOadpeiuoeeul1xuQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyA9IChvYmplY3RfbmFtZSktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IFtdXG5cdCMgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHQjIOWboENyZWF0b3IuZ2V0T2JqZWN05Ye95pWw5YaF6YOo6KaB6LCD55So6K+l5Ye95pWw77yM5omA5Lul6L+Z6YeM5LiN5Y+v5Lul6LCD55SoQ3JlYXRvci5nZXRPYmplY3Tlj5blr7nosaHvvIzlj6rog73osIPnlKhDcmVhdG9yLk9iamVjdHPmnaXlj5blr7nosaFcblx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0aWYgIV9vYmplY3Rcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cdFxuXHRyZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Rcblx0aWYgTWV0ZW9yLmlzQ2xpZW50ICYmICFfLmlzRW1wdHkgcmVsYXRlZExpc3Rcblx0XHRyZWxhdGVkTGlzdE1hcCA9IHt9XG5cdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0LCAob2JqTmFtZSktPlxuXHRcdFx0aWYgXy5pc09iamVjdCBvYmpOYW1lXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9XG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XG5cdFx0XHRcdGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgcmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWUgYW5kIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cdFx0XHRcdFx0IyDlvZNyZWxhdGVkX29iamVjdC5maWVsZHPkuK3mnInkuKTkuKrmiJbku6XkuIrnmoTlrZfmrrXmjIflkJFvYmplY3RfbmFtZeihqOekuueahOWvueixoeaXtu+8jOS8mOWFiOWPluesrOS4gOS4quS9nOS4uuWklumUruWFs+ezu+Wtl+aute+8jOS9huaYr3JlbGF0ZWRfZmllbGTkuLrkuLvlrZDooajml7blvLrooYzopobnm5bkuYvliY3nmoRyZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXeWAvFxuXHRcdFx0XHRcdGlmIF8uaXNFbXB0eSByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCJcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0geyBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddID0geyBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCIgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0geyBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiIH1cblx0XHRfLmVhY2ggWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIChlbmFibGVPYmpOYW1lKS0+XG5cdFx0XHRpZiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHsgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXVxuXHRcdFx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxuXHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHsgb2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0cmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMgcmVsYXRlZExpc3RNYXBcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cblx0aWYgX29iamVjdC5lbmFibGVfZmlsZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJ9XG5cblx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcblx0XHRcdCMgY2ZzLmZpbGVzLmZpbGVyZWNvcmTlr7nosaHlnKjnrKzkuozmrKHngrnlh7vnmoTml7blgJlyZWxhdGVkX29iamVjdOi/lOWbnueahOaYr2FwcC1idWlsZGVy5Lit55qEXCJtZXRhZGF0YS5wYXJlbnRcIuWtl+auteiiq+WIoOmZpOS6hu+8jOiusOWIsG1ldGFkYXRh5a2X5q6155qEc3ViX2ZpZWxkc+S4reS6hu+8jOaJgOS7peimgeWNleeLrOWkhOeQhuOAglxuXHRcdFx0c2ZzRmlsZXNPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpXG5cdFx0XHRzZnNGaWxlc09iamVjdCAmJiByZWxhdGVkX29iamVjdCA9IHNmc0ZpbGVzT2JqZWN0XG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcblx0XHRcdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcIm9iamVjdF9maWVsZHNcIlxuXHRcdFx0XHRcdCNUT0RPIOW+heebuOWFs+WIl+ihqOaUr+aMgeaOkuW6j+WQju+8jOWIoOmZpOatpOWIpOaWrVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWV9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkfVxuXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwidGFza3NcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ub3Rlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfZXZlbnRzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiZXZlbnRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIn1cblx0aWYgX29iamVjdC5lbmFibGVfYXBwcm92YWxzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfcHJvY2Vzc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcInByb2Nlc3NfaW5zdGFuY2VfaGlzdG9yeVwiLCBmb3JlaWduX2tleTogXCJ0YXJnZXRfb2JqZWN0XCJ9XG5cdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4Fcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblxuXHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSAodXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUXG5cdGVsc2Vcblx0XHRpZiAhKHVzZXJJZCBhbmQgc3BhY2VJZClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdHN1RmllbGRzID0ge25hbWU6IDEsIG1vYmlsZTogMSwgcG9zaXRpb246IDEsIGVtYWlsOiAxLCBjb21wYW55OiAxLCBvcmdhbml6YXRpb246IDEsIHNwYWNlOiAxLCBjb21wYW55X2lkOiAxLCBjb21wYW55X2lkczogMX1cblx0XHQjIGNoZWNrIGlmIHVzZXIgaW4gdGhlIHNwYWNlXG5cdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcblx0XHRpZiAhc3Vcblx0XHRcdHNwYWNlSWQgPSBudWxsXG5cblx0XHQjIGlmIHNwYWNlSWQgbm90IGV4aXN0cywgZ2V0IHRoZSBmaXJzdCBvbmUuXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdGlmIGlzVW5TYWZlTW9kZVxuXHRcdFx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXG5cdFx0XHRcdGlmICFzdVxuXHRcdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHRcdHNwYWNlSWQgPSBzdS5zcGFjZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0VVNFUl9DT05URVhUID0ge31cblx0XHRVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkXG5cdFx0VVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkXG5cdFx0VVNFUl9DT05URVhULnVzZXIgPSB7XG5cdFx0XHRfaWQ6IHVzZXJJZFxuXHRcdFx0bmFtZTogc3UubmFtZSxcblx0XHRcdG1vYmlsZTogc3UubW9iaWxlLFxuXHRcdFx0cG9zaXRpb246IHN1LnBvc2l0aW9uLFxuXHRcdFx0ZW1haWw6IHN1LmVtYWlsXG5cdFx0XHRjb21wYW55OiBzdS5jb21wYW55XG5cdFx0XHRjb21wYW55X2lkOiBzdS5jb21wYW55X2lkXG5cdFx0XHRjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcblx0XHR9XG5cdFx0c3BhY2VfdXNlcl9vcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpPy5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbilcblx0XHRpZiBzcGFjZV91c2VyX29yZ1xuXHRcdFx0VVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuXHRcdFx0XHRfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcblx0XHRcdFx0bmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcblx0XHRcdFx0ZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG5cdFx0XHR9XG5cdFx0cmV0dXJuIFVTRVJfQ09OVEVYVFxuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gKHVybCktPlxuXG5cdGlmIF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAodXJsPy5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpKVxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxuXHRcdHJldHVybiB1cmxcblxuXHRpZiB1cmxcblx0XHQjIHVybOW8gOWktOayoeaciVwiL1wi77yM6ZyA6KaB5re75YqgXCIvXCJcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybFxuXHRlbHNlXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVhcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gKHVzZXJJZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcblx0ZWxzZVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZDoxfX0pXG5cdHJldHVybiBzdS5jb21wYW55X2lkXG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSAodXNlcklkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxuXHRlbHNlXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkczoxfX0pXG5cdHJldHVybiBzdT8uY29tcGFueV9pZHNcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSAocG8pLT5cblx0aWYgcG8uYWxsb3dDcmVhdGVcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLmFsbG93RWRpdFxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8uYWxsb3dEZWxldGVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby52aWV3QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0cG8udmlld0FsbFJlY29yZHMgPSB0cnVlXG5cdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHRcblx0IyDlpoLmnpzpmYTku7bnm7jlhbPmnYPpmZDphY3nva7kuLrnqbrvvIzliJnlhbzlrrnkuYvliY3msqHmnInpmYTku7bmnYPpmZDphY3nva7ml7bnmoTop4TliJlcblx0aWYgcG8uYWxsb3dSZWFkXG5cdFx0dHlwZW9mIHBvLmFsbG93UmVhZEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby52aWV3QWxsRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8udmlld0FsbEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0VkaXRcblx0XHR0eXBlb2YgcG8uYWxsb3dDcmVhdGVGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0NyZWF0ZUZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby5hbGxvd0VkaXRGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHR0eXBlb2YgcG8uYWxsb3dEZWxldGVGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0dHlwZW9mIHBvLm1vZGlmeUFsbEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLm1vZGlmeUFsbEZpbGVzID0gdHJ1ZVxuXG5cdGlmIHBvLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0RmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dEZWxldGVGaWxlc1xuXHRcdHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZVxuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby52aWV3QWxsRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZVxuXHRcdHBvLnZpZXdBbGxGaWxlcyA9IHRydWVcblxuXHRyZXR1cm4gcG9cblxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSAoKS0+XG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWRcblxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9ICgpLT5cblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkXG5cbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gKHNwYWNlSWQpLT5cblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWQgPT0gc3BhY2VJZFxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gKHNwYWNlSWQpLT5cblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5jbG91ZEFkbWluU3BhY2VJZCA9PSBzcGFjZUlkXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUlxuXHQiLCJ2YXIgRmliZXI7XG5cbkNyZWF0b3IuZGVwcyA9IHtcbiAgYXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5LFxuICBvYmplY3Q6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcbn07XG5cbkNyZWF0b3IuX1RFTVBMQVRFID0ge1xuICBBcHBzOiB7fSxcbiAgT2JqZWN0czoge31cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgcmV0dXJuIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xufSk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcbiAgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmxvYWRPYmplY3RzKG9iaiwgb2JqZWN0X25hbWUpO1xuICAgIH0pLnJ1bigpO1xuICB9O1xufVxuXG5DcmVhdG9yLmxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmoubmFtZTtcbiAgfVxuICBpZiAoIW9iai5saXN0X3ZpZXdzKSB7XG4gICAgb2JqLmxpc3Rfdmlld3MgPSB7fTtcbiAgfVxuICBpZiAob2JqLnNwYWNlKSB7XG4gICAgb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iaik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lID09PSAnY2ZzX2ZpbGVzX2ZpbGVyZWNvcmQnKSB7XG4gICAgb2JqZWN0X25hbWUgPSAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnO1xuICAgIG9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICBvYmoubmFtZSA9IG9iamVjdF9uYW1lO1xuICAgIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0gPSBvYmo7XG4gIH1cbiAgQ3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iaik7XG4gIG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuICBDcmVhdG9yLmluaXRUcmlnZ2VycyhvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdC5zcGFjZSkge1xuICAgIHJldHVybiBcImNfXCIgKyBvYmplY3Quc3BhY2UgKyBcIl9cIiArIG9iamVjdC5uYW1lO1xuICB9XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKSB7XG4gIHZhciByZWYsIHJlZjE7XG4gIGlmIChfLmlzQXJyYXkob2JqZWN0X25hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoKHJlZiA9IENyZWF0b3IuZGVwcykgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWYxID0gcmVmLm9iamVjdCkgIT0gbnVsbCkge1xuICAgICAgICByZWYxLmRlcGVuZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gZnVuY3Rpb24ob2JqZWN0X2lkKSB7XG4gIHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtcbiAgICBfaWQ6IG9iamVjdF9pZFxuICB9KTtcbn07XG5cbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgY29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpO1xuICBkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICByZXR1cm4gZGJbb2JqZWN0X25hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1soKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5fY29sbGVjdGlvbl9uYW1lIDogdm9pZCAwKSB8fCBvYmplY3RfbmFtZV07XG4gICAgfVxuICB9XG59O1xuXG5DcmVhdG9yLnJlbW92ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlZiwgcmVmMSwgc3BhY2U7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHNwYWNlID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZGIpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgIGZpZWxkczoge1xuICAgICAgYWRtaW5zOiAxXG4gICAgfVxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgaWYgKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghXy5pc1N0cmluZyhmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gZm9ybXVsYXI7XG4gIH1cbiAgaWYgKENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFyO1xufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBjb250ZXh0KSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgc2VsZWN0b3IgPSB7fTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBhY3Rpb24sIG5hbWUsIHZhbHVlO1xuICAgIGlmICgoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMykge1xuICAgICAgbmFtZSA9IGZpbHRlclswXTtcbiAgICAgIGFjdGlvbiA9IGZpbHRlclsxXTtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KTtcbiAgICAgIHNlbGVjdG9yW25hbWVdID0ge307XG4gICAgICByZXR1cm4gc2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIHNwYWNlSWQgPT09ICdjb21tb24nO1xufTtcblxuXG4vKlxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4gKi9cblxuQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMgPSBmdW5jdGlvbihkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KSB7XG4gIHZhciB2YWx1ZXM7XG4gIGlmICghaWRfa2V5KSB7XG4gICAgaWRfa2V5ID0gXCJfaWRcIjtcbiAgfVxuICBpZiAoaGl0X2ZpcnN0KSB7XG4gICAgdmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpO1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHZhciBfaW5kZXg7XG4gICAgICBfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgICBpZiAoX2luZGV4ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9pbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgfSk7XG4gIH1cbn07XG5cblxuLypcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuICovXG5cbkNyZWF0b3Iuc29ydGluZ01ldGhvZCA9IGZ1bmN0aW9uKHZhbHVlMSwgdmFsdWUyKSB7XG4gIHZhciBpc1ZhbHVlMUVtcHR5LCBpc1ZhbHVlMkVtcHR5LCBsb2NhbGU7XG4gIGlmICh0aGlzLmtleSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV07XG4gICAgdmFsdWUyID0gdmFsdWUyW3RoaXMua2V5XTtcbiAgfVxuICBpZiAodmFsdWUxIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHZhbHVlMiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTIgPSB2YWx1ZTIuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUxID09PSBcIm51bWJlclwiICYmIHR5cGVvZiB2YWx1ZTIgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gdmFsdWUxIC0gdmFsdWUyO1xuICB9XG4gIGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT09IG51bGwgfHwgdmFsdWUxID09PSB2b2lkIDA7XG4gIGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT09IG51bGwgfHwgdmFsdWUyID09PSB2b2lkIDA7XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmICFpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBpZiAoIWlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKCk7XG4gIHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlKHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGUpO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TWFwLCByZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IFtdO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICByZWxhdGVkTGlzdE1hcCA9IHt9O1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqTmFtZSkge1xuICAgICAgaWYgKF8uaXNPYmplY3Qob2JqTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSAmJiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSkge1xuICAgICAgICAgIGlmIChfLmlzRW1wdHkocmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gfHwgcmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHtcbiAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSkge1xuICAgICAgcmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIlxuICAgICAgfTtcbiAgICB9XG4gICAgXy5lYWNoKFsndGFza3MnLCAnbm90ZXMnLCAnZXZlbnRzJywgJ2FwcHJvdmFscyddLCBmdW5jdGlvbihlbmFibGVPYmpOYW1lKSB7XG4gICAgICBpZiAocmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdID0ge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBlbmFibGVPYmpOYW1lLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpO1xuICAgICAgaWYgKF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIChwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJlbGF0ZWRfb2JqZWN0cyA9IF8udmFsdWVzKHJlbGF0ZWRMaXN0TWFwKTtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9maWxlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgIHZhciBzZnNGaWxlc09iamVjdDtcbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgICBzZnNGaWxlc09iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIik7XG4gICAgICBzZnNGaWxlc09iamVjdCAmJiAocmVsYXRlZF9vYmplY3QgPSBzZnNGaWxlc09iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09PSBcImxvb2t1cFwiICYmIHJlbGF0ZWRfZmllbGQucmVsYXRlZExpc3QpKSAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwib2JqZWN0X2ZpZWxkc1wiKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGlmIChfb2JqZWN0LmVuYWJsZV90YXNrcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInRhc2tzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfbm90ZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJub3Rlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2V2ZW50cykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImV2ZW50c1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2luc3RhbmNlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2FwcHJvdmFscykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImFwcHJvdmFsc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Byb2Nlc3MpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJwcm9jZXNzX2luc3RhbmNlX2hpc3RvcnlcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInRhcmdldF9vYmplY3RcIlxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpO1xuICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSkge1xuICB2YXIgVVNFUl9DT05URVhULCByZWYsIHNwYWNlX3VzZXJfb3JnLCBzdSwgc3VGaWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCEodXNlcklkICYmIHNwYWNlSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJ0aGUgcGFyYW1zIHVzZXJJZCBhbmQgc3BhY2VJZCBpcyByZXF1aXJlZCBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0VXNlckNvbnRleHRcIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3VGaWVsZHMgPSB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgbW9iaWxlOiAxLFxuICAgICAgcG9zaXRpb246IDEsXG4gICAgICBlbWFpbDogMSxcbiAgICAgIGNvbXBhbnk6IDEsXG4gICAgICBvcmdhbml6YXRpb246IDEsXG4gICAgICBzcGFjZTogMSxcbiAgICAgIGNvbXBhbnlfaWQ6IDEsXG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH07XG4gICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICB9KTtcbiAgICBpZiAoIXN1KSB7XG4gICAgICBzcGFjZUlkID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBpZiAoaXNVblNhZmVNb2RlKSB7XG4gICAgICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFzdSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHNwYWNlSWQgPSBzdS5zcGFjZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBVU0VSX0NPTlRFWFQgPSB7fTtcbiAgICBVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkO1xuICAgIFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZDtcbiAgICBVU0VSX0NPTlRFWFQudXNlciA9IHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgbmFtZTogc3UubmFtZSxcbiAgICAgIG1vYmlsZTogc3UubW9iaWxlLFxuICAgICAgcG9zaXRpb246IHN1LnBvc2l0aW9uLFxuICAgICAgZW1haWw6IHN1LmVtYWlsLFxuICAgICAgY29tcGFueTogc3UuY29tcGFueSxcbiAgICAgIGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWQsXG4gICAgICBjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcbiAgICB9O1xuICAgIHNwYWNlX3VzZXJfb3JnID0gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIikpICE9IG51bGwgPyByZWYuZmluZE9uZShzdS5vcmdhbml6YXRpb24pIDogdm9pZCAwO1xuICAgIGlmIChzcGFjZV91c2VyX29yZykge1xuICAgICAgVVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuICAgICAgICBfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcbiAgICAgICAgbmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcbiAgICAgICAgZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gVVNFUl9DT05URVhUO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gIGlmIChfLmlzRnVuY3Rpb24oU3RlZWRvcy5pc0NvcmRvdmEpICYmIFN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgKCh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSA6IHZvaWQgMCkgfHwgKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpIDogdm9pZCAwKSkpIHtcbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIGlmICh1cmwpIHtcbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZDogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdS5jb21wYW55X2lkO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1ICE9IG51bGwgPyBzdS5jb21wYW55X2lkcyA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zID0gZnVuY3Rpb24ocG8pIHtcbiAgaWYgKHBvLmFsbG93Q3JlYXRlKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dEZWxldGUpIHtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dSZWFkKSB7XG4gICAgdHlwZW9mIHBvLmFsbG93UmVhZEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlKTtcbiAgICB0eXBlb2YgcG8udmlld0FsbEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8udmlld0FsbEZpbGVzID0gdHJ1ZSk7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgIHR5cGVvZiBwby5hbGxvd0NyZWF0ZUZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dDcmVhdGVGaWxlcyA9IHRydWUpO1xuICAgIHR5cGVvZiBwby5hbGxvd0VkaXRGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZSk7XG4gICAgdHlwZW9mIHBvLmFsbG93RGVsZXRlRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZSk7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICB0eXBlb2YgcG8ubW9kaWZ5QWxsRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5tb2RpZnlBbGxGaWxlcyA9IHRydWUpO1xuICB9XG4gIGlmIChwby5hbGxvd0NyZWF0ZUZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXRGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dEZWxldGVGaWxlcykge1xuICAgIHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZTtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdBbGxGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsRmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlO1xuICAgIHBvLnZpZXdBbGxGaWxlcyA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHBvO1xufTtcblxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYudGVtcGxhdGVTcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKHNwYWNlSWQgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYuY2xvdWRBZG1pblNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUjtcbn1cbiIsIk1ldGVvci5tZXRob2RzXG5cdCMg55So5oi36I635Y+WbG9va3VwIOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrXnmoTpgInpobnlgLxcblx0XCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IChvcHRpb25zKS0+XG5cdFx0aWYgb3B0aW9ucz8ucGFyYW1zPy5yZWZlcmVuY2VfdG9cblxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSlcblxuXHRcdFx0bmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcblxuXHRcdFx0cXVlcnkgPSB7fVxuXHRcdFx0aWYgb3B0aW9ucy5wYXJhbXMuc3BhY2Vcblx0XHRcdFx0cXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZVxuXG5cdFx0XHRcdHNvcnQgPSBvcHRpb25zPy5zb3J0XG5cblx0XHRcdFx0c2VsZWN0ZWQgPSBvcHRpb25zPy5zZWxlY3RlZCB8fCBbXVxuXG5cdFx0XHRcdG9wdGlvbnNfbGltaXQgPSBvcHRpb25zPy5vcHRpb25zX2xpbWl0IHx8IDEwXG5cblx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5ID0ge31cblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0geyRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0fVxuXG5cdFx0XHRcdGlmIG9wdGlvbnM/LnZhbHVlcz8ubGVuZ3RoXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fSwgc2VhcmNoVGV4dFF1ZXJ5XVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319XVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XG5cdFx0XHRcdFx0XHRfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KVxuXHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskbmluOiBzZWxlY3RlZH1cblxuXHRcdFx0XHRjb2xsZWN0aW9uID0gb2JqZWN0LmRiXG5cblx0XHRcdFx0aWYgb3B0aW9ucy5maWx0ZXJRdWVyeVxuXHRcdFx0XHRcdF8uZXh0ZW5kIHF1ZXJ5LCBvcHRpb25zLmZpbHRlclF1ZXJ5XG5cblx0XHRcdFx0cXVlcnlfb3B0aW9ucyA9IHtsaW1pdDogb3B0aW9uc19saW1pdH1cblxuXHRcdFx0XHRpZiBzb3J0ICYmIF8uaXNPYmplY3Qoc29ydClcblx0XHRcdFx0XHRxdWVyeV9vcHRpb25zLnNvcnQgPSBzb3J0XG5cblx0XHRcdFx0aWYgY29sbGVjdGlvblxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0cmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKVxuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IFtdXG5cdFx0XHRcdFx0XHRfLmVhY2ggcmVjb3JkcywgKHJlY29yZCktPlxuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2hcblx0XHRcdFx0XHRcdFx0XHRsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XVxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiByZWNvcmQuX2lkXG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0c1xuXHRcdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucylcblx0XHRyZXR1cm4gW10gIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uLCBlLCBuYW1lX2ZpZWxkX2tleSwgb2JqZWN0LCBvcHRpb25zX2xpbWl0LCBxdWVyeSwgcXVlcnlfb3B0aW9ucywgcmVjb3JkcywgcmVmLCByZWYxLCByZXN1bHRzLCBzZWFyY2hUZXh0UXVlcnksIHNlbGVjdGVkLCBzb3J0O1xuICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmID0gb3B0aW9ucy5wYXJhbXMpICE9IG51bGwgPyByZWYucmVmZXJlbmNlX3RvIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKTtcbiAgICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgcXVlcnkgPSB7fTtcbiAgICAgIGlmIChvcHRpb25zLnBhcmFtcy5zcGFjZSkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlO1xuICAgICAgICBzb3J0ID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zb3J0IDogdm9pZCAwO1xuICAgICAgICBzZWxlY3RlZCA9IChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNlbGVjdGVkIDogdm9pZCAwKSB8fCBbXTtcbiAgICAgICAgb3B0aW9uc19saW1pdCA9IChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLm9wdGlvbnNfbGltaXQgOiB2b2lkIDApIHx8IDEwO1xuICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgc2VhcmNoVGV4dFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHtcbiAgICAgICAgICAgICRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZjEgPSBvcHRpb25zLnZhbHVlcykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LCBzZWFyY2hUZXh0UXVlcnlcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgXy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICRuaW46IHNlbGVjdGVkXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb2xsZWN0aW9uID0gb2JqZWN0LmRiO1xuICAgICAgICBpZiAob3B0aW9ucy5maWx0ZXJRdWVyeSkge1xuICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBvcHRpb25zLmZpbHRlclF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICBxdWVyeV9vcHRpb25zID0ge1xuICAgICAgICAgIGxpbWl0OiBvcHRpb25zX2xpbWl0XG4gICAgICAgIH07XG4gICAgICAgIGlmIChzb3J0ICYmIF8uaXNPYmplY3Qoc29ydCkpIHtcbiAgICAgICAgICBxdWVyeV9vcHRpb25zLnNvcnQgPSBzb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKCk7XG4gICAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgICBfLmVhY2gocmVjb3JkcywgZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuX2lkXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufSk7XG4iLCJKc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL3dvcmtmbG93L3ZpZXcvOmluc3RhbmNlSWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSlcblx0XHRjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWRcblxuXHRcdGhhc2hEYXRhID0gcmVxLmJvZHlcblx0XHRvYmplY3RfbmFtZSA9IGhhc2hEYXRhLm9iamVjdF9uYW1lXG5cdFx0cmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkXG5cdFx0c3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZFxuXG5cdFx0Y2hlY2sgb2JqZWN0X25hbWUsIFN0cmluZ1xuXHRcdGNoZWNrIHJlY29yZF9pZCwgU3RyaW5nXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZ1xuXG5cdFx0aW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWRcblx0XHR4X3VzZXJfaWQgPSByZXEucXVlcnlbJ1gtVXNlci1JZCddXG5cdFx0eF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXVxuXG5cdFx0cmVkaXJlY3RfdXJsID0gXCIvXCJcblx0XHRpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpXG5cdFx0IyAtIOaIkeeahOiNieeov+Wwsei3s+i9rOiHs+iNieeov+eusVxuXHRcdCMgLSDmiJHnmoTlvoXlrqHmoLjlsLHot7Povazoh7PlvoXlrqHmoLhcblx0XHQjIC0g5LiN5piv5oiR55qE55Sz6K+35Y2V5YiZ6Lez6L2s6Iez5omT5Y2w6aG16Z2iXG5cdFx0IyAtIOWmgueUs+ivt+WNleS4jeWtmOWcqOWImeaPkOekuueUqOaIt+eUs+ivt+WNleW3suWIoOmZpO+8jOW5tuS4lOabtOaWsHJlY29yZOeahOeKtuaAge+8jOS9v+eUqOaIt+WPr+S7pemHjeaWsOWPkei1t+WuoeaJuVxuXHRcdGlmIGluc1xuXHRcdFx0Ym94ID0gJydcblx0XHRcdHNwYWNlSWQgPSBpbnMuc3BhY2Vcblx0XHRcdGZsb3dJZCA9IGlucy5mbG93XG5cblx0XHRcdGlmIChpbnMuaW5ib3hfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZCkgb3IgKGlucy5jY191c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRib3ggPSAnaW5ib3gnXG5cdFx0XHRlbHNlIGlmIGlucy5vdXRib3hfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZFxuXHRcdFx0XHRib3ggPSAnb3V0Ym94J1xuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ2RyYWZ0JyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcblx0XHRcdFx0Ym94ID0gJ2RyYWZ0J1xuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ3BlbmRpbmcnIGFuZCAoaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWQgb3IgaW5zLmFwcGxpY2FudCBpcyBjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdGJveCA9ICdwZW5kaW5nJ1xuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ2NvbXBsZXRlZCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXG5cdFx0XHRcdGJveCA9ICdjb21wbGV0ZWQnXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg6aqM6K+BbG9naW4gdXNlcl9pZOWvueivpea1geeoi+acieeuoeeQhuOAgeinguWvn+eUs+ivt+WNleeahOadg+mZkFxuXHRcdFx0XHRwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkLCB7IGZpZWxkczogeyBhZG1pbnM6IDEgfSB9KVxuXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIG9yIHBlcm1pc3Npb25zLmluY2x1ZGVzKFwibW9uaXRvclwiKSBvciBzcGFjZS5hZG1pbnMuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRcdGJveCA9ICdtb25pdG9yJ1xuXHRcdFx0d29ya2Zsb3dVcmwgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzPy53b3JrZmxvdz8udXJsXG5cdFx0XHRpZiBib3hcblx0XHRcdFx0cmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS8je2JveH0vI3tpbnNJZH0/WC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS9wcmludC8je2luc0lkfT9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxuXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0XHRkYXRhOiB7IHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsIH1cblx0XHRcdH1cblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKVxuXHRcdFx0aWYgY29sbGVjdGlvblxuXHRcdFx0XHRjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcblx0XHRcdFx0XHQkdW5zZXQ6IHtcblx0XHRcdFx0XHRcdFwiaW5zdGFuY2VzXCI6IDEsXG5cdFx0XHRcdFx0XHRcImluc3RhbmNlX3N0YXRlXCI6IDEsXG5cdFx0XHRcdFx0XHRcImxvY2tlZFwiOiAxXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+acquaJvuWIsOeUs+ivt+WNle+8jOWPr+iDveW3suiiq+WIoOmZpO+8jOivt+mHjeaWsOWPkei1t+WuoeaJueOAgicpXG5cblx0Y2F0Y2ggZVxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7IGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlIH1dIH1cblx0XHR9XG5cbiIsIkpzb25Sb3V0ZXMuYWRkKCdwb3N0JywgJy9hcGkvd29ya2Zsb3cvdmlldy86aW5zdGFuY2VJZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBib3gsIGNvbGxlY3Rpb24sIGN1cnJlbnRfdXNlcl9pZCwgY3VycmVudF91c2VyX2luZm8sIGUsIGZsb3dJZCwgaGFzaERhdGEsIGlucywgaW5zSWQsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9ucywgcmVjb3JkX2lkLCByZWRpcmVjdF91cmwsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgc3BhY2UsIHNwYWNlSWQsIHNwYWNlX2lkLCB3b3JrZmxvd1VybCwgeF9hdXRoX3Rva2VuLCB4X3VzZXJfaWQ7XG4gIHRyeSB7XG4gICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICBjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWQ7XG4gICAgaGFzaERhdGEgPSByZXEuYm9keTtcbiAgICBvYmplY3RfbmFtZSA9IGhhc2hEYXRhLm9iamVjdF9uYW1lO1xuICAgIHJlY29yZF9pZCA9IGhhc2hEYXRhLnJlY29yZF9pZDtcbiAgICBzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkO1xuICAgIGNoZWNrKG9iamVjdF9uYW1lLCBTdHJpbmcpO1xuICAgIGNoZWNrKHJlY29yZF9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZDtcbiAgICB4X3VzZXJfaWQgPSByZXEucXVlcnlbJ1gtVXNlci1JZCddO1xuICAgIHhfYXV0aF90b2tlbiA9IHJlcS5xdWVyeVsnWC1BdXRoLVRva2VuJ107XG4gICAgcmVkaXJlY3RfdXJsID0gXCIvXCI7XG4gICAgaW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkKTtcbiAgICBpZiAoaW5zKSB7XG4gICAgICBib3ggPSAnJztcbiAgICAgIHNwYWNlSWQgPSBpbnMuc3BhY2U7XG4gICAgICBmbG93SWQgPSBpbnMuZmxvdztcbiAgICAgIGlmICgoKHJlZiA9IGlucy5pbmJveF91c2VycykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSB8fCAoKHJlZjEgPSBpbnMuY2NfdXNlcnMpICE9IG51bGwgPyByZWYxLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApKSB7XG4gICAgICAgIGJveCA9ICdpbmJveCc7XG4gICAgICB9IGVsc2UgaWYgKChyZWYyID0gaW5zLm91dGJveF91c2VycykgIT0gbnVsbCA/IHJlZjIuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkge1xuICAgICAgICBib3ggPSAnb3V0Ym94JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnZHJhZnQnICYmIGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCkge1xuICAgICAgICBib3ggPSAnZHJhZnQnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdwZW5kaW5nJyAmJiAoaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkIHx8IGlucy5hcHBsaWNhbnQgPT09IGN1cnJlbnRfdXNlcl9pZCkpIHtcbiAgICAgICAgYm94ID0gJ3BlbmRpbmcnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCkge1xuICAgICAgICBib3ggPSAnY29tcGxldGVkJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKTtcbiAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkLCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBhZG1pbnM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZG1pblwiKSB8fCBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcIm1vbml0b3JcIikgfHwgc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkpIHtcbiAgICAgICAgICBib3ggPSAnbW9uaXRvcic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHdvcmtmbG93VXJsID0gKHJlZjMgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMpICE9IG51bGwgPyAocmVmNCA9IHJlZjMud29ya2Zsb3cpICE9IG51bGwgPyByZWY0LnVybCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChib3gpIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIChcIndvcmtmbG93L3NwYWNlL1wiICsgc3BhY2VJZCArIFwiL1wiICsgYm94ICsgXCIvXCIgKyBpbnNJZCArIFwiP1gtVXNlci1JZD1cIiArIHhfdXNlcl9pZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIHhfYXV0aF90b2tlbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgKFwid29ya2Zsb3cvc3BhY2UvXCIgKyBzcGFjZUlkICsgXCIvcHJpbnQvXCIgKyBpbnNJZCArIFwiP2JveD1tb25pdG9yJnByaW50X2lzX3Nob3dfdHJhY2VzPTEmcHJpbnRfaXNfc2hvd19hdHRhY2htZW50cz0xJlgtVXNlci1JZD1cIiArIHhfdXNlcl9pZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIHhfYXV0aF90b2tlbik7XG4gICAgICB9XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICBjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcbiAgICAgICAgICAkdW5zZXQ6IHtcbiAgICAgICAgICAgIFwiaW5zdGFuY2VzXCI6IDEsXG4gICAgICAgICAgICBcImluc3RhbmNlX3N0YXRlXCI6IDEsXG4gICAgICAgICAgICBcImxvY2tlZFwiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3InLCAn5pyq5om+5Yiw55Sz6K+35Y2V77yM5Y+v6IO95bey6KKr5Yig6Zmk77yM6K+36YeN5paw5Y+R6LW35a6h5om544CCJyk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IChvYmplY3RfbmFtZSwgY29sdW1ucykgLT5cblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKT8uX3NjaGVtYVxuXHRjb2x1bW5fbnVtID0gMFxuXHRpZiBfc2NoZW1hXG5cdFx0Xy5lYWNoIGNvbHVtbnMsIChmaWVsZF9uYW1lKSAtPlxuXHRcdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcblx0XHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcblx0XHRcdGlmIGlzX3dpZGVcblx0XHRcdFx0Y29sdW1uX251bSArPSAyXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMVxuXG5cdFx0aW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bVxuXHRcdHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnRcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkgLT5cblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hXG5cdGlmIF9zY2hlbWFcblx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxuXHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcblx0XHRyZXR1cm4gaXNfd2lkZVxuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSAtPlxuXHRzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucz8uc2V0dGluZ3M/LmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIn0pXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gXy5tYXAgY29sdW1ucywgKGNvbHVtbiktPlxuXHRcdGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dXG5cdFx0aWYgZmllbGQ/LnR5cGUgYW5kICFmaWVsZC5oaWRkZW5cblx0XHRcdHJldHVybiBjb2x1bW5cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdGNvbHVtbnMgPSBfLmNvbXBhY3QgY29sdW1uc1xuXHRpZiBzZXR0aW5nIGFuZCBzZXR0aW5nLnNldHRpbmdzXG5cdFx0c29ydCA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXT8uc29ydCB8fCBbXVxuXHRcdHNvcnQgPSBfLm1hcCBzb3J0LCAob3JkZXIpLT5cblx0XHRcdGtleSA9IG9yZGVyWzBdXG5cdFx0XHRpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpXG5cdFx0XHRvcmRlclswXSA9IGluZGV4ICsgMVxuXHRcdFx0cmV0dXJuIG9yZGVyXG5cdFx0cmV0dXJuIHNvcnRcblx0cmV0dXJuIFtdXG5cblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXVxuXHRleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl1cblx0ZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXVxuXHRpZiBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcblx0XHRleHRyYV9jb2x1bW5zID0gXy51bmlvbiBleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcblxuXHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzP1tvYmplY3RfbmFtZV0gPSBbXVxuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IChkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpLT5cblx0ZGVmYXVsdF9jb2x1bW5zID0gZGVmYXVsdF92aWV3Py5jb2x1bW5zXG5cdGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/Lm1vYmlsZV9jb2x1bW5zXG5cdHVubGVzcyBsaXN0X3ZpZXdcblx0XHRyZXR1cm5cblx0b2l0ZW0gPSBfLmNsb25lKGxpc3Rfdmlldylcblx0aWYgIV8uaGFzKG9pdGVtLCBcIm5hbWVcIilcblx0XHRvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWVcblx0aWYgIW9pdGVtLmNvbHVtbnNcblx0XHRpZiBkZWZhdWx0X2NvbHVtbnNcblx0XHRcdG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnNcblx0aWYgIW9pdGVtLmNvbHVtbnNcblx0XHRvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXVxuXHRpZiAhb2l0ZW0ubW9iaWxlX2NvbHVtbnNcblx0XHRpZiBkZWZhdWx0X21vYmlsZV9jb2x1bW5zXG5cdFx0XHRvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcblxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKVxuXHRcdFx0b2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpXG5cblxuXHRpZiAhb2l0ZW0uZmlsdGVyX3Njb3BlXG5cdFx0IyBsaXN0dmlld+inhuWbvueahGZpbHRlcl9zY29wZem7mOiupOWAvOaUueS4unNwYWNlICMxMzFcblx0XHRvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCJcblxuXHRpZiAhXy5oYXMob2l0ZW0sIFwiX2lkXCIpXG5cdFx0b2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWVcblx0ZWxzZVxuXHRcdG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWVcblxuXHRpZiBfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpXG5cdFx0b2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucylcblxuXHRfLmZvckVhY2ggb2l0ZW0uZmlsdGVycywgKGZpbHRlciwgX2luZGV4KS0+XG5cdFx0aWYgIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKVxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxuXHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxuXHRyZXR1cm4gb2l0ZW1cblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Q3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IChvYmplY3RfbmFtZSktPlxuXHRcdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdFx0cmV0dXJuXG5cdFx0cmVsYXRlZExpc3RPYmplY3RzID0ge31cblx0XHRyZWxhdGVkTGlzdE5hbWVzID0gW11cblx0XHRvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMgPSBbXTtcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgX29iamVjdFxuXHRcdFx0bGF5b3V0UmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRfbGlzdHM7XG5cdFx0XHQjIGxheW91dFJlbGF0ZWRMaXN0IOaYr+aVsOe7hOWwseihqOekuumFjee9rui/h+mhtemdouW4g+WxgO+8jOWwseWQr+eUqOmhtemdouW4g+WxgOeahOebuOWFs+WtkOihqOOAglxuXHRcdFx0aWYgXy5pc0FycmF5IGxheW91dFJlbGF0ZWRMaXN0XG5cdFx0XHRcdF8uZWFjaCBsYXlvdXRSZWxhdGVkTGlzdCwgKGl0ZW0pLT5cblx0XHRcdFx0XHRyZU9iamVjdE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRcdHJlRmllbGROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMV1cblx0XHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlT2JqZWN0TmFtZSk/LmZpZWxkc1tyZUZpZWxkTmFtZV0/LndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogcmVPYmplY3ROYW1lXG5cdFx0XHRcdFx0XHRjb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzXG5cdFx0XHRcdFx0XHRtb2JpbGVfY29sdW1uczogaXRlbS5maWVsZF9uYW1lc1xuXHRcdFx0XHRcdFx0aXNfZmlsZTogcmVPYmplY3ROYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdFx0XHRcdGZpbHRlcnNGdW5jdGlvbjogaXRlbS5maWx0ZXJzXG5cdFx0XHRcdFx0XHRzb3J0OiBpdGVtLnNvcnRcblx0XHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVGaWVsZE5hbWVcblx0XHRcdFx0XHRcdGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlXG5cdFx0XHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdFx0XHRcdGxhYmVsOiBpdGVtLmxhYmVsXG5cdFx0XHRcdFx0XHRhY3Rpb25zOiBpdGVtLmJ1dHRvbnNcblx0XHRcdFx0XHRcdHZpc2libGVfb246IGl0ZW0udmlzaWJsZV9vblxuXHRcdFx0XHRcdFx0cGFnZV9zaXplOiBpdGVtLnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cy5wdXNoKHJlbGF0ZWQpXG5cdFx0XHRcdHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHM7XG5cdFx0XHRyZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Rcblx0XHRcdGlmICFfLmlzRW1wdHkgcmVsYXRlZExpc3Rcblx0XHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0LCAob2JqT3JOYW1lKS0+XG5cdFx0XHRcdFx0aWYgXy5pc09iamVjdCBvYmpPck5hbWVcblx0XHRcdFx0XHRcdHJlbGF0ZWQgPVxuXHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWVcblx0XHRcdFx0XHRcdFx0Y29sdW1uczogb2JqT3JOYW1lLmNvbHVtbnNcblx0XHRcdFx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IG9iak9yTmFtZS5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRcdFx0XHRpc19maWxlOiBvYmpPck5hbWUub2JqZWN0TmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRcdFx0XHRcdGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnNcblx0XHRcdFx0XHRcdFx0c29ydDogb2JqT3JOYW1lLnNvcnRcblx0XHRcdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiAnJ1xuXHRcdFx0XHRcdFx0XHRjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZVxuXHRcdFx0XHRcdFx0XHRsYWJlbDogb2JqT3JOYW1lLmxhYmVsXG5cdFx0XHRcdFx0XHRcdGFjdGlvbnM6IG9iak9yTmFtZS5hY3Rpb25zXG5cdFx0XHRcdFx0XHRcdHBhZ2Vfc2l6ZTogb2JqT3JOYW1lLnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWRcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWUub2JqZWN0TmFtZVxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyBvYmpPck5hbWVcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWVcblxuXHRcdG1hcExpc3QgPSB7fVxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIC0+XG5cdFx0XHRpZiAhcmVsYXRlZF9vYmplY3RfaXRlbT8ub2JqZWN0X25hbWVcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZVxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleVxuXHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkX29iamVjdF9pdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0XHR1bmxlc3MgcmVsYXRlZF9vYmplY3Rcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXG5cdFx0XHRjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSlcblx0XHRcdG1vYmlsZV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lLCB0cnVlKSB8fCBbXCJuYW1lXCJdXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxuXG5cdFx0XHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSlcblx0XHRcdHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpXG5cblx0XHRcdGlmIC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKVxuXHRcdFx0XHQjIG9iamVjdOexu+Wei+W4puWtkOWxnuaAp+eahHJlbGF0ZWRfZmllbGRfbmFtZeimgeWOu+aOieS4remXtOeahOe+juWFg+espuWPt++8jOWQpuWImeaYvuekuuS4jeWHuuWtl+auteWAvFxuXHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLyxcIlwiKVxuXHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lXG5cdFx0XHRcdGNvbHVtbnM6IGNvbHVtbnNcblx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0XHRcdGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdFx0aWYgcmVsYXRlZE9iamVjdFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmNvbHVtbnNcblx0XHRcdFx0XHRyZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnNcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRcdHJlbGF0ZWQubW9iaWxlX2NvbHVtbnMgPSByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3Quc29ydFxuXHRcdFx0XHRcdHJlbGF0ZWQuc29ydCA9IHJlbGF0ZWRPYmplY3Quc29ydFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvblxuXHRcdFx0XHRcdHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxuXHRcdFx0XHRcdHJlbGF0ZWQuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QgPSByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubGFiZWxcblx0XHRcdFx0XHRyZWxhdGVkLmxhYmVsID0gcmVsYXRlZE9iamVjdC5sYWJlbFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdHJlbGF0ZWQucGFnZV9zaXplID0gcmVsYXRlZE9iamVjdC5wYWdlX3NpemVcblx0XHRcdFx0ZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXG5cdFx0XHRtYXBMaXN0W3JlbGF0ZWQub2JqZWN0X25hbWVdID0gcmVsYXRlZFxuXG5cblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF8udmFsdWVzKHJlbGF0ZWRMaXN0T2JqZWN0cyksIFwib2JqZWN0X25hbWVcIilcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0XHR1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzXG5cdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0T2JqZWN0cywgKHYsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIC0+XG5cdFx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxuXHRcdFx0YWxsb3dSZWFkID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5hbGxvd1JlYWRcblx0XHRcdGlmIGlzQWN0aXZlICYmIGFsbG93UmVhZFxuXHRcdFx0XHRtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdlxuXG5cdFx0bGlzdCA9IFtdXG5cdFx0aWYgXy5pc0VtcHR5IHJlbGF0ZWRMaXN0TmFtZXNcblx0XHRcdGxpc3QgPSAgXy52YWx1ZXMgbWFwTGlzdFxuXHRcdGVsc2Vcblx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdE5hbWVzLCAob2JqZWN0TmFtZSkgLT5cblx0XHRcdFx0aWYgbWFwTGlzdFtvYmplY3ROYW1lXVxuXHRcdFx0XHRcdGxpc3QucHVzaCBtYXBMaXN0W29iamVjdE5hbWVdXG5cblx0XHRpZiBfLmhhcyhfb2JqZWN0LCAnYWxsb3dfcmVsYXRlZExpc3QnKVxuXHRcdFx0bGlzdCA9IF8uZmlsdGVyIGxpc3QsIChpdGVtKS0+XG5cdFx0XHRcdHJldHVybiBfLmluY2x1ZGUoX29iamVjdC5hbGxvd19yZWxhdGVkTGlzdCwgaXRlbS5vYmplY3RfbmFtZSlcblxuXHRcdHJldHVybiBsaXN0XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyA9IChvYmplY3RfbmFtZSktPlxuXHRyZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpXG5cbiMjIyBcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG4jIyNcbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYyktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuXG5cdGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKVxuXHR1bmxlc3MgbGlzdFZpZXdzPy5sZW5ndGhcblx0XHRyZXR1cm5cblx0bGlzdF92aWV3ID0gXy5maW5kKGxpc3RWaWV3cywgKGl0ZW0pLT4gcmV0dXJuIGl0ZW0uX2lkID09IGxpc3Rfdmlld19pZCB8fCBpdGVtLm5hbWUgPT0gbGlzdF92aWV3X2lkKVxuXHR1bmxlc3MgbGlzdF92aWV3XG5cdFx0IyDlpoLmnpzkuI3pnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzliJnpu5jorqTov5Tlm57nrKzkuIDkuKrop4blm77vvIzlj43kuYvov5Tlm57nqbpcblx0XHRpZiBleGFjXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF1cblx0cmV0dXJuIGxpc3Rfdmlld1xuXG4j6I635Y+WbGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+5piv5ZCm5piv5pyA6L+R5p+l55yL6KeG5Zu+XG5DcmVhdG9yLmdldExpc3RWaWV3SXNSZWNlbnQgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXG5cdGlmIHR5cGVvZihsaXN0X3ZpZXdfaWQpID09IFwic3RyaW5nXCJcblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiAhb2JqZWN0XG5cdFx0XHRyZXR1cm5cblx0XHRsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLHtfaWQ6IGxpc3Rfdmlld19pZH0pXG5cdGVsc2Vcblx0XHRsaXN0VmlldyA9IGxpc3Rfdmlld19pZFxuXHRyZXR1cm4gbGlzdFZpZXc/Lm5hbWUgPT0gXCJyZWNlbnRcIlxuXG5cbiMjI1xuICAgIOS7jmNvbHVtbnPlj4LmlbDkuK3ov4fmu6Tlh7rnlKjkuo7miYvmnLrnq6/mmL7npLrnmoRjb2x1bW5zXG5cdOinhOWIme+8mlxuXHQxLuS8mOWFiOaKimNvbHVtbnPkuK3nmoRuYW1l5a2X5q615o6S5Zyo56ys5LiA5LiqXG5cdDIu5pyA5aSa5Y+q6L+U5ZueNOS4quWtl+autVxuXHQzLuiAg+iZkeWuveWtl+auteWNoOeUqOaVtOihjOinhOWImeadoeS7tuS4i++8jOacgOWkmuWPqui/lOWbnuS4pOihjFxuIyMjXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKS0+XG5cdHJlc3VsdCA9IFtdXG5cdG1heFJvd3MgPSAyIFxuXHRtYXhDb3VudCA9IG1heFJvd3MgKiAyXG5cdGNvdW50ID0gMFxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gb2JqZWN0LmZpZWxkc1xuXHR1bmxlc3Mgb2JqZWN0XG5cdFx0cmV0dXJuIGNvbHVtbnNcblx0bmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXHRpc05hbWVDb2x1bW4gPSAoaXRlbSktPlxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdHJldHVybiBpdGVtLmZpZWxkID09IG5hbWVLZXlcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gaXRlbSA9PSBuYW1lS2V5XG5cdGdldEZpZWxkID0gKGl0ZW0pLT5cblx0XHRpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW0uZmllbGRdXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZpZWxkc1tpdGVtXVxuXHRpZiBuYW1lS2V5XG5cdFx0bmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZCAoaXRlbSktPlxuXHRcdFx0cmV0dXJuIGlzTmFtZUNvbHVtbihpdGVtKVxuXHRpZiBuYW1lQ29sdW1uXG5cdFx0ZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKVxuXHRcdGl0ZW1Db3VudCA9IGlmIGZpZWxkLmlzX3dpZGUgdGhlbiAyIGVsc2UgMVxuXHRcdGNvdW50ICs9IGl0ZW1Db3VudFxuXHRcdHJlc3VsdC5wdXNoIG5hbWVDb2x1bW5cblx0Y29sdW1ucy5mb3JFYWNoIChpdGVtKS0+XG5cdFx0ZmllbGQgPSBnZXRGaWVsZChpdGVtKVxuXHRcdHVubGVzcyBmaWVsZFxuXHRcdFx0cmV0dXJuXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXG5cdFx0aWYgY291bnQgPCBtYXhDb3VudCBhbmQgcmVzdWx0Lmxlbmd0aCA8IG1heENvdW50IGFuZCAhaXNOYW1lQ29sdW1uKGl0ZW0pXG5cdFx0XHRjb3VudCArPSBpdGVtQ291bnRcblx0XHRcdGlmIGNvdW50IDw9IG1heENvdW50XG5cdFx0XHRcdHJlc3VsdC5wdXNoIGl0ZW1cblx0XG5cdHJldHVybiByZXN1bHRcblxuIyMjXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSAob2JqZWN0X25hbWUpLT5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGlmIG9iamVjdD8ubGlzdF92aWV3cz8uZGVmYXVsdFxuXHRcdCNUT0RPIOatpOS7o+eggeWPquaYr+aaguaXtuWFvOWuueS7peWJjWNvZGXkuK3lrprkuYnnmoRkZWZhdWx06KeG5Zu+77yM5b6FY29kZeS4reeahGRlZmF1bHTmuIXnkIblrozmiJDlkI7vvIzpnIDopoHliKDpmaTmraTku6PnoIFcblx0XHRkZWZhdWx0VmlldyA9IG9iamVjdC5saXN0X3ZpZXdzLmRlZmF1bHRcblx0ZWxzZVxuXHRcdF8uZWFjaCBvYmplY3Q/Lmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcsIGtleSktPlxuXHRcdFx0aWYgbGlzdF92aWV3Lm5hbWUgPT0gXCJhbGxcIiB8fCBrZXkgPT0gXCJhbGxcIlxuXHRcdFx0XHRkZWZhdWx0VmlldyA9IGxpc3Rfdmlld1xuXHRyZXR1cm4gZGVmYXVsdFZpZXc7XG5cbiMjI1xuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gZGVmYXVsdFZpZXc/LmNvbHVtbnNcblx0aWYgdXNlX21vYmlsZV9jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdFZpZXc/Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnNcblx0XHRlbHNlIGlmIGNvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKVxuXHRyZXR1cm4gY29sdW1uc1xuXG4jIyNcbiAgICDojrflj5blr7nosaHnmoTliJfooajnrKzkuIDkuKrop4blm77mmL7npLrnmoTlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyA9IChvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gZGVmYXVsdFZpZXc/LmNvbHVtbnNcblx0aWYgdXNlX21vYmlsZV9jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdFZpZXc/Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnNcblx0XHRlbHNlIGlmIGNvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKVxuXHRyZXR1cm4gY29sdW1uc1xuXG4jIyNcblx06I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k6aKd5aSW5Yqg6L2955qE5a2X5q61XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IChvYmplY3RfbmFtZSktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXG5cdHJldHVybiBkZWZhdWx0Vmlldz8uZXh0cmFfY29sdW1uc1xuXG4jIyNcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQgPSAob2JqZWN0X25hbWUpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRpZiBkZWZhdWx0Vmlld1xuXHRcdGlmIGRlZmF1bHRWaWV3LnNvcnRcblx0XHRcdHJldHVybiBkZWZhdWx0Vmlldy5zb3J0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIFtbXCJjcmVhdGVkXCIsIFwiZGVzY1wiXV1cblxuXG4jIyNcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuIyMjXG5DcmVhdG9yLmlzQWxsVmlldyA9IChsaXN0X3ZpZXcpLT5cblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcImFsbFwiXG5cbiMjI1xuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XG4jIyNcbkNyZWF0b3IuaXNSZWNlbnRWaWV3ID0gKGxpc3RfdmlldyktPlxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwicmVjZW50XCJcblxuIyMjXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiMjI1xuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gKHNvcnQsIHRhYnVsYXJDb2x1bW5zKS0+XG5cdHRhYnVsYXJfc29ydCA9IFtdXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxuXHRcdGlmIF8uaXNBcnJheShpdGVtKVxuXHRcdFx0IyDlhbzlrrnml6fnmoTmlbDmja7moLzlvI9bW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxuXHRcdFx0aWYgaXRlbS5sZW5ndGggPT0gMVxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgXCJhc2NcIl1cblx0XHRcdGVsc2UgaWYgaXRlbS5sZW5ndGggPT0gMlxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgaXRlbVsxXV1cblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdCPmlrDmlbDmja7moLzlvI/vvJpbe2ZpZWxkX25hbWU6ICwgb3JkZXI6IH1dXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcblx0XHRcdGlmIGZpZWxkX25hbWUgJiYgb3JkZXJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihmaWVsZF9uYW1lKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIG9yZGVyXVxuXG5cdHJldHVybiB0YWJ1bGFyX3NvcnRcblxuIyMjXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiMjI1xuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9EWCA9IChzb3J0KS0+XG5cdGR4X3NvcnQgPSBbXVxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcblx0XHRcdCPlhbzlrrnml6fmoLzlvI/vvJpbW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxuXHRcdFx0ZHhfc29ydC5wdXNoKGl0ZW0pXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXG5cdFx0XHRcdGR4X3NvcnQucHVzaCBbZmllbGRfbmFtZSwgb3JkZXJdXG5cblx0cmV0dXJuIGR4X3NvcnRcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBfc2NoZW1hLCBjb2x1bW5fbnVtLCBpbml0X3dpZHRoX3BlcmNlbnQsIHJlZjtcbiAgX3NjaGVtYSA9IChyZWYgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuX3NjaGVtYSA6IHZvaWQgMDtcbiAgY29sdW1uX251bSA9IDA7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICAgIHZhciBmaWVsZCwgaXNfd2lkZSwgcmVmMSwgcmVmMjtcbiAgICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgICAgaXNfd2lkZSA9IChyZWYxID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYyLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNfd2lkZSkge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtO1xuICAgIHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkge1xuICB2YXIgX3NjaGVtYSwgZmllbGQsIGlzX3dpZGUsIHJlZiwgcmVmMTtcbiAgX3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgIGlzX3dpZGUgPSAocmVmID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICByZXR1cm4gaXNfd2lkZTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRUYWJ1bGFyT3JkZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSB7XG4gIHZhciBvYmosIHJlZiwgcmVmMSwgcmVmMiwgc2V0dGluZywgc29ydDtcbiAgc2V0dGluZyA9IChyZWYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zKSAhPSBudWxsID8gKHJlZjEgPSByZWYuc2V0dGluZ3MpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBfLm1hcChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICB2YXIgZmllbGQ7XG4gICAgZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl07XG4gICAgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkgJiYgIWZpZWxkLmhpZGRlbikge1xuICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gIH0pO1xuICBjb2x1bW5zID0gXy5jb21wYWN0KGNvbHVtbnMpO1xuICBpZiAoc2V0dGluZyAmJiBzZXR0aW5nLnNldHRpbmdzKSB7XG4gICAgc29ydCA9ICgocmVmMiA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXSkgIT0gbnVsbCA/IHJlZjIuc29ydCA6IHZvaWQgMCkgfHwgW107XG4gICAgc29ydCA9IF8ubWFwKHNvcnQsIGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICB2YXIgaW5kZXgsIGtleTtcbiAgICAgIGtleSA9IG9yZGVyWzBdO1xuICAgICAgaW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KTtcbiAgICAgIG9yZGVyWzBdID0gaW5kZXggKyAxO1xuICAgICAgcmV0dXJuIG9yZGVyO1xuICAgIH0pO1xuICAgIHJldHVybiBzb3J0O1xuICB9XG4gIHJldHVybiBbXTtcbn07XG5cbkNyZWF0b3IuaW5pdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMsIGV4dHJhX2NvbHVtbnMsIG9iamVjdCwgb3JkZXIsIHJlZjtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXTtcbiAgZXh0cmFfY29sdW1ucyA9IFtcIm93bmVyXCJdO1xuICBkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdO1xuICBpZiAoZGVmYXVsdF9leHRyYV9jb2x1bW5zKSB7XG4gICAgZXh0cmFfY29sdW1ucyA9IF8udW5pb24oZXh0cmFfY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zKTtcbiAgfVxuICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkcykgIT0gbnVsbCA/IHJlZltvYmplY3RfbmFtZV0gPSBbXSA6IHZvaWQgMDtcbiAgfVxufTtcblxuQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcgPSBmdW5jdGlvbihkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRfY29sdW1ucywgZGVmYXVsdF9tb2JpbGVfY29sdW1ucywgb2l0ZW07XG4gIGRlZmF1bHRfY29sdW1ucyA9IGRlZmF1bHRfdmlldyAhPSBudWxsID8gZGVmYXVsdF92aWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcgIT0gbnVsbCA/IGRlZmF1bHRfdmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb2l0ZW0gPSBfLmNsb25lKGxpc3Rfdmlldyk7XG4gIGlmICghXy5oYXMob2l0ZW0sIFwibmFtZVwiKSkge1xuICAgIG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZTtcbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9jb2x1bW5zKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zID0gZGVmYXVsdF9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXTtcbiAgfVxuICBpZiAoIW9pdGVtLm1vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLm1vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF9tb2JpbGVfY29sdW1ucztcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKSkge1xuICAgICAgb2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmZpbHRlcl9zY29wZSkge1xuICAgIG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIjtcbiAgfVxuICBpZiAoIV8uaGFzKG9pdGVtLCBcIl9pZFwiKSkge1xuICAgIG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lO1xuICB9IGVsc2Uge1xuICAgIG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWU7XG4gIH1cbiAgaWYgKF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucykpIHtcbiAgICBvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKTtcbiAgfVxuICBfLmZvckVhY2gob2l0ZW0uZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICBpZiAoIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9pdGVtO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX29iamVjdCwgbGF5b3V0UmVsYXRlZExpc3QsIGxpc3QsIG1hcExpc3QsIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cywgcGVybWlzc2lvbnMsIHJlbGF0ZWRMaXN0LCByZWxhdGVkTGlzdE5hbWVzLCByZWxhdGVkTGlzdE9iamVjdHMsIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCByZWxhdGVkX29iamVjdHMsIHNwYWNlSWQsIHVucmVsYXRlZF9vYmplY3RzLCB1c2VySWQ7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZWxhdGVkTGlzdE9iamVjdHMgPSB7fTtcbiAgICByZWxhdGVkTGlzdE5hbWVzID0gW107XG4gICAgb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzID0gW107XG4gICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoX29iamVjdCkge1xuICAgICAgbGF5b3V0UmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRfbGlzdHM7XG4gICAgICBpZiAoXy5pc0FycmF5KGxheW91dFJlbGF0ZWRMaXN0KSkge1xuICAgICAgICBfLmVhY2gobGF5b3V0UmVsYXRlZExpc3QsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICB2YXIgcmVGaWVsZE5hbWUsIHJlT2JqZWN0TmFtZSwgcmVmLCByZWYxLCByZWxhdGVkLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgICAgICByZU9iamVjdE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICByZUZpZWxkTmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlT2JqZWN0TmFtZSkpICE9IG51bGwgPyAocmVmMSA9IHJlZi5maWVsZHNbcmVGaWVsZE5hbWVdKSAhPSBudWxsID8gcmVmMS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICByZWxhdGVkID0ge1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlT2JqZWN0TmFtZSxcbiAgICAgICAgICAgIGNvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXMsXG4gICAgICAgICAgICBtb2JpbGVfY29sdW1uczogaXRlbS5maWVsZF9uYW1lcyxcbiAgICAgICAgICAgIGlzX2ZpbGU6IHJlT2JqZWN0TmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgICAgIGZpbHRlcnNGdW5jdGlvbjogaXRlbS5maWx0ZXJzLFxuICAgICAgICAgICAgc29ydDogaXRlbS5zb3J0LFxuICAgICAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiByZUZpZWxkTmFtZSxcbiAgICAgICAgICAgIGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlLFxuICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkLFxuICAgICAgICAgICAgbGFiZWw6IGl0ZW0ubGFiZWwsXG4gICAgICAgICAgICBhY3Rpb25zOiBpdGVtLmJ1dHRvbnMsXG4gICAgICAgICAgICB2aXNpYmxlX29uOiBpdGVtLnZpc2libGVfb24sXG4gICAgICAgICAgICBwYWdlX3NpemU6IGl0ZW0ucGFnZV9zaXplXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLnB1c2gocmVsYXRlZCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzO1xuICAgICAgfVxuICAgICAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICAgICAgaWYgKCFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqT3JOYW1lKSB7XG4gICAgICAgICAgdmFyIHJlbGF0ZWQ7XG4gICAgICAgICAgaWYgKF8uaXNPYmplY3Qob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lLFxuICAgICAgICAgICAgICBjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1ucyxcbiAgICAgICAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG9iak9yTmFtZS5tb2JpbGVfY29sdW1ucyxcbiAgICAgICAgICAgICAgaXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgICAgICAgIGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnMsXG4gICAgICAgICAgICAgIHNvcnQ6IG9iak9yTmFtZS5zb3J0LFxuICAgICAgICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6ICcnLFxuICAgICAgICAgICAgICBjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgbGFiZWw6IG9iak9yTmFtZS5sYWJlbCxcbiAgICAgICAgICAgICAgYWN0aW9uczogb2JqT3JOYW1lLmFjdGlvbnMsXG4gICAgICAgICAgICAgIHBhZ2Vfc2l6ZTogb2JqT3JOYW1lLnBhZ2Vfc2l6ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUub2JqZWN0TmFtZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE5hbWVzLnB1c2gob2JqT3JOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBtYXBMaXN0ID0ge307XG4gICAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfaXRlbSkge1xuICAgICAgdmFyIGNvbHVtbnMsIG1vYmlsZV9jb2x1bW5zLCBvcmRlciwgcmVsYXRlZCwgcmVsYXRlZE9iamVjdCwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgdGFidWxhcl9vcmRlciwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICBpZiAoIShyZWxhdGVkX29iamVjdF9pdGVtICE9IG51bGwgPyByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZTtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXk7XG4gICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICByZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFyZWxhdGVkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgY29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgbW9iaWxlX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRydWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpO1xuICAgICAgaWYgKC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKSkge1xuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLywgXCJcIik7XG4gICAgICB9XG4gICAgICByZWxhdGVkID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zLFxuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgaXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICB9O1xuICAgICAgcmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChyZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmNvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5zb3J0KSB7XG4gICAgICAgICAgcmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbikge1xuICAgICAgICAgIHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QpIHtcbiAgICAgICAgICByZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5sYWJlbCkge1xuICAgICAgICAgIHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZSkge1xuICAgICAgICAgIHJlbGF0ZWQucGFnZV9zaXplID0gcmVsYXRlZE9iamVjdC5wYWdlX3NpemU7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXBMaXN0W3JlbGF0ZWQub2JqZWN0X25hbWVdID0gcmVsYXRlZDtcbiAgICB9KTtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKTtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgdW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdE9iamVjdHMsIGZ1bmN0aW9uKHYsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWY7XG4gICAgICBpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMTtcbiAgICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgICAgaWYgKGlzQWN0aXZlICYmIGFsbG93UmVhZCkge1xuICAgICAgICByZXR1cm4gbWFwTGlzdFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHY7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbGlzdCA9IFtdO1xuICAgIGlmIChfLmlzRW1wdHkocmVsYXRlZExpc3ROYW1lcykpIHtcbiAgICAgIGxpc3QgPSBfLnZhbHVlcyhtYXBMaXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKHJlbGF0ZWRMaXN0TmFtZXMsIGZ1bmN0aW9uKG9iamVjdE5hbWUpIHtcbiAgICAgICAgaWYgKG1hcExpc3Rbb2JqZWN0TmFtZV0pIHtcbiAgICAgICAgICByZXR1cm4gbGlzdC5wdXNoKG1hcExpc3Rbb2JqZWN0TmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpKSB7XG4gICAgICBsaXN0ID0gXy5maWx0ZXIobGlzdCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gXy5pbmNsdWRlKF9vYmplY3QuYWxsb3dfcmVsYXRlZExpc3QsIGl0ZW0ub2JqZWN0X25hbWUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsaXN0O1xuICB9O1xufVxuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpO1xufTtcblxuXG4vKiBcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpIHtcbiAgdmFyIGxpc3RWaWV3cywgbGlzdF92aWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIGlmICghKGxpc3RWaWV3cyAhPSBudWxsID8gbGlzdFZpZXdzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdF92aWV3ID0gXy5maW5kKGxpc3RWaWV3cywgZnVuY3Rpb24oaXRlbSkge1xuICAgIHJldHVybiBpdGVtLl9pZCA9PT0gbGlzdF92aWV3X2lkIHx8IGl0ZW0ubmFtZSA9PT0gbGlzdF92aWV3X2lkO1xuICB9KTtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICBpZiAoZXhhYykge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF07XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0X3ZpZXc7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3SXNSZWNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciBsaXN0Vmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgbGlzdF92aWV3X2lkID09PSBcInN0cmluZ1wiKSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3MsIHtcbiAgICAgIF9pZDogbGlzdF92aWV3X2lkXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWQ7XG4gIH1cbiAgcmV0dXJuIChsaXN0VmlldyAhPSBudWxsID8gbGlzdFZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcblx06KeE5YiZ77yaXG5cdDEu5LyY5YWI5oqKY29sdW1uc+S4reeahG5hbWXlrZfmrrXmjpLlnKjnrKzkuIDkuKpcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXG4gKi9cblxuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBjb3VudCwgZmllbGQsIGZpZWxkcywgZ2V0RmllbGQsIGlzTmFtZUNvbHVtbiwgaXRlbUNvdW50LCBtYXhDb3VudCwgbWF4Um93cywgbmFtZUNvbHVtbiwgbmFtZUtleSwgb2JqZWN0LCByZXN1bHQ7XG4gIHJlc3VsdCA9IFtdO1xuICBtYXhSb3dzID0gMjtcbiAgbWF4Q291bnQgPSBtYXhSb3dzICogMjtcbiAgY291bnQgPSAwO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IG9iamVjdC5maWVsZHM7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cbiAgbmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgaXNOYW1lQ29sdW1uID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gaXRlbS5maWVsZCA9PT0gbmFtZUtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZW0gPT09IG5hbWVLZXk7XG4gICAgfVxuICB9O1xuICBnZXRGaWVsZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtXTtcbiAgICB9XG4gIH07XG4gIGlmIChuYW1lS2V5KSB7XG4gICAgbmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZChmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pO1xuICAgIH0pO1xuICB9XG4gIGlmIChuYW1lQ29sdW1uKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKTtcbiAgICBpdGVtQ291bnQgPSBmaWVsZC5pc193aWRlID8gMiA6IDE7XG4gICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgIHJlc3VsdC5wdXNoKG5hbWVDb2x1bW4pO1xuICB9XG4gIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChpdGVtKTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBpZiAoY291bnQgPCBtYXhDb3VudCAmJiByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgJiYgIWlzTmFtZUNvbHVtbihpdGVtKSkge1xuICAgICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgICAgaWYgKGNvdW50IDw9IG1heENvdW50KSB7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKlxuICAgIOiOt+WPlum7mOiupOinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXcsIG9iamVjdCwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgfVxuICBpZiAob2JqZWN0ICE9IG51bGwgPyAocmVmID0gb2JqZWN0Lmxpc3Rfdmlld3MpICE9IG51bGwgPyByZWZbXCJkZWZhdWx0XCJdIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3c1tcImRlZmF1bHRcIl07XG4gIH0gZWxzZSB7XG4gICAgXy5lYWNoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0Lmxpc3Rfdmlld3MgOiB2b2lkIDAsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG4gICAgICBpZiAobGlzdF92aWV3Lm5hbWUgPT09IFwiYWxsXCIgfHwga2V5ID09PSBcImFsbFwiKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmlldyA9IGxpc3RfdmlldztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZpZXc7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICh1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwKSB7XG4gICAgICBjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChjb2x1bW5zKSB7XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2x1bW5zO1xufTtcblxuXG4vKlxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOesrOS4gOS4quinhuWbvuaYvuekuueahOWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICh1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwKSB7XG4gICAgICBjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChjb2x1bW5zKSB7XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2x1bW5zO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuZXh0cmFfY29sdW1ucyA6IHZvaWQgMDtcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgaWYgKGRlZmF1bHRWaWV3KSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3LnNvcnQpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0Vmlldy5zb3J0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXTtcbiAgICB9XG4gIH1cbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuICovXG5cbkNyZWF0b3IuaXNBbGxWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwiYWxsXCI7XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gZnVuY3Rpb24oc29ydCwgdGFidWxhckNvbHVtbnMpIHtcbiAgdmFyIHRhYnVsYXJfc29ydDtcbiAgdGFidWxhcl9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGNvbHVtbl9pbmRleCwgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgaWYgKGl0ZW0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBcImFzY1wiXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBvcmRlcl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhYnVsYXJfc29ydDtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBkeF9zb3J0O1xuICBkeF9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChbZmllbGRfbmFtZSwgb3JkZXJdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZHhfc29ydDtcbn07XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFx0X3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIn1cblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuXHRcdFx0cmVnRXg6IF9yZWdFeE1lc3NhZ2VzLFxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJylcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5zdGFydHVwICgpLT5cblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cblx0XHRfcmVnRXhNZXNzYWdlcy5wdXNoIHtleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwifVxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXG5cdFx0fSkiLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpO1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVnRXhNZXNzYWdlcztcbiAgICBfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW107XG4gICAgX3JlZ0V4TWVzc2FnZXMucHVzaCh7XG4gICAgICBleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIlxuICAgIH0pO1xuICAgIHJldHVybiBTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuICAgICAgcmVnRXg6IF9yZWdFeE1lc3NhZ2VzXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiLy8g5Zug5Li6bWV0ZW9y57yW6K+RY29mZmVlc2NyaXB05Lya5a+86Ie0ZXZhbOWHveaVsOaKpemUme+8jOaJgOS7peWNleeLrOWGmeWcqOS4gOS4qmpz5paH5Lu25Lit44CCXG5DcmVhdG9yLmV2YWxJbkNvbnRleHQgPSBmdW5jdGlvbihqcywgY29udGV4dCkge1xuICAgIC8vIyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgdGhlIGluLWxpbmUgYW5vbnltb3VzIGZ1bmN0aW9uIHdlIC5jYWxsIHdpdGggdGhlIHBhc3NlZCBjb250ZXh0XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyBcbiAgICBcdHJldHVybiBldmFsKGpzKTsgXG5cdH0uY2FsbChjb250ZXh0KTtcbn1cblxuXG5DcmVhdG9yLmV2YWwgPSBmdW5jdGlvbihqcyl7XG5cdHRyeXtcblx0XHRyZXR1cm4gZXZhbChqcylcblx0fWNhdGNoIChlKXtcblx0XHRjb25zb2xlLmVycm9yKGUsIGpzKTtcblx0fVxufTsiLCJcdGdldE9wdGlvbiA9IChvcHRpb24pLT5cblx0XHRmb28gPSBvcHRpb24uc3BsaXQoXCI6XCIpXG5cdFx0aWYgZm9vLmxlbmd0aCA+IDJcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1sxXSwgY29sb3I6IGZvb1syXX1cblx0XHRlbHNlIGlmIGZvby5sZW5ndGggPiAxXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV19XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzBdfVxuXG5cdGNvbnZlcnRGaWVsZCA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGQsIHNwYWNlSWQpLT5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgJiYgc3BhY2VJZCAmJiBmaWVsZC50eXBlID09ICdzZWxlY3QnXG5cdFx0XHRjb2RlID0gZmllbGQucGlja2xpc3QgfHwgXCIje29iamVjdF9uYW1lfS4je2ZpZWxkX25hbWV9XCI7XG5cdFx0XHRpZiBjb2RlXG5cdFx0XHRcdHBpY2tsaXN0ID0gQ3JlYXRvci5nZXRQaWNrbGlzdChjb2RlLCBzcGFjZUlkKTtcblx0XHRcdFx0aWYgcGlja2xpc3Rcblx0XHRcdFx0XHRvcHRpb25zID0gW107XG5cdFx0XHRcdFx0YWxsT3B0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KVxuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IF8uc29ydEJ5KHBpY2tsaXN0T3B0aW9ucywgJ3NvcnRfbm8nKT8ucmV2ZXJzZSgpO1xuXHRcdFx0XHRcdF8uZWFjaCBwaWNrbGlzdE9wdGlvbnMsIChpdGVtKS0+XG5cdFx0XHRcdFx0XHRsYWJlbCA9IGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBpdGVtLnZhbHVlIHx8IGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0YWxsT3B0aW9ucy5wdXNoKHtsYWJlbDogbGFiZWwsIHZhbHVlOiB2YWx1ZSwgZW5hYmxlOiBpdGVtLmVuYWJsZSwgY29sb3I6IGl0ZW0uY29sb3J9KVxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbmFibGVcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5wdXNoKHtsYWJlbDogbGFiZWwsIHZhbHVlOiB2YWx1ZSwgY29sb3I6IGl0ZW0uY29sb3J9KVxuXHRcdFx0XHRcdFx0aWYgaXRlbS5kZWZhdWx0XG5cdFx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gb3B0aW9uc1xuXHRcdFx0XHRcdGlmIGFsbE9wdGlvbnMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0ZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnNcblx0XHRyZXR1cm4gZmllbGQ7XG5cblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gKG9iamVjdCwgc3BhY2VJZCktPlxuXHRcdGlmICFvYmplY3Rcblx0XHRcdHJldHVyblxuXHRcdF8uZm9yRWFjaCBvYmplY3QudHJpZ2dlcnMsICh0cmlnZ2VyLCBrZXkpLT5cblxuXHRcdFx0aWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiKVxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyPy5fdG9kb1xuXHRcdFx0XHRfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcblx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2NvZGV9KVwiKVxuXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxuXHRcdFx0XHRcdCPlj6rmnIl1cGRhdGXml7bvvIwgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMg5omN5pyJ5YC8XG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YeP77yM5bCk5YW25pivQ29sbGVjdGlvblxuXHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXsje190b2RvX2Zyb21fZGJ9fSlcIilcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIlxuXHRcdFx0XHRfdG9kbyA9IHRyaWdnZXIudG9kb1xuXHRcdFx0XHRpZiBfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pXG5cdFx0XHRcdFx0dHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKClcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cblx0XHRcdFx0aWYgZmllbGQub21pdFxuXHRcdFx0XHRcdCMgb21pdOWtl+auteWujOWFqOmakOiXj+S4jeaYvuekulxuXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IHRydWVcblxuXHRcdFx0XHRpZiBmaWVsZC5yZXF1aXJlZCAmJiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRcdCMg6YCa55So5b+F5aGr5a2X5q61ICMyOTUy77yM5b+F5aGr5a2X5q616K6+572u5Li66Z2e5Y+q6K+7XG5cdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSBmYWxzZVxuXG5cdFx0XHRcdHN5c3RlbUJhc2VGaWVsZHMgPSBDcmVhdG9yLmdldFN5c3RlbUJhc2VGaWVsZHMoKVxuXHRcdFx0XHRpZiBzeXN0ZW1CYXNlRmllbGRzLmluZGV4T2Yoa2V5KSA+IC0xXG5cdFx0XHRcdFx0IyDlvLrliLbliJvlu7rkurrliJvlu7rml7bpl7TnrYnlrZfmrrXkuLrlj6ror7tcblx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5hY3Rpb25zLCAoYWN0aW9uLCBrZXkpLT5cblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uPy5fdG9kb1xuXHRcdFx0XHRfdG9kb19mcm9tX2RiID0gYWN0aW9uPy50b2RvXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZVxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYilcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbigpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yXG5cblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/Ll92aXNpYmxlXG5cdFx0XHRcdGlmIF92aXNpYmxlXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKF92aXNpYmxlKVxuXHRcdFx0XHRcdFx0XHRfdmlzaWJsZSA9IF92aXNpYmxlLnRyaW0oKVxuXHRcdFx0XHRcdFx0aWYgU3RlZWRvcy5pc0V4cHJlc3Npb24oX3Zpc2libGUpXG5cdFx0XHRcdFx0XHRcdCMg5pSv5oyB6aG16Z2i5biD5bGA5Lit5YaZdmlzaWJsZV9vbuWHveaVsOihqOi+vuW8j++8jOmhtemdouW4g+WxgOaMiemSrueahOaYvuekuuadoeS7tuS4jeeUn+aViCAjMzM0MFxuXHRcdFx0XHRcdFx0XHRhY3Rpb24udmlzaWJsZSA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfcGVybWlzc2lvbnMsIHJlY29yZCkgLT5cblx0XHRcdFx0XHRcdFx0XHRnbG9iYWxEYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgQ3JlYXRvci5VU0VSX0NPTlRFWFQsIHtub3c6IG5ldyBEYXRlKCl9KVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBTdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbihfdmlzaWJsZSwgcmVjb3JkLCBcIiNcIiwgZ2xvYmFsRGF0YSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0YWN0aW9uLnZpc2libGUgPSBDcmVhdG9yLmV2YWwoXCIoI3tfdmlzaWJsZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZVxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XG5cdFx0XHRcdF90b2RvID0gYWN0aW9uPy50b2RvXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHRhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpXG5cblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/LnZpc2libGVcblxuXHRcdFx0XHRpZiBfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpXG5cdFx0XHRcdFx0YWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKVxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cblx0XHRcdGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcblxuXHRcdFx0aWYgZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0XHQj5pSv5oyBXFxu5oiW6ICF6Iux5paH6YCX5Y+35YiG5YmyLFxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBvcHRpb24uaW5kZXhPZihcIixcIilcblx0XHRcdFx0XHRcdFx0b3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIilcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdFx0I+aUr+aMgeaVsOe7hOS4reebtOaOpeWumuS5ieavj+S4qumAiemhueeahOeugOeJiOagvOW8j+Wtl+espuS4slxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKG9wdGlvbilcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChvcHRpb24pXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0Xy5lYWNoIGZpZWxkLm9wdGlvbnMsICh2LCBrKS0+XG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IHYsIHZhbHVlOiBrfVxuXHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLl9vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnN9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLnJlZ0V4XG5cdFx0XHRcdGlmIHJlZ0V4XG5cdFx0XHRcdFx0ZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLl9yZWdFeFxuXHRcdFx0XHRpZiByZWdFeFxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQucmVnRXggPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWdFeH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG1pbiA9IGZpZWxkLm1pblxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWluKVxuXHRcdFx0XHRcdGZpZWxkLl9taW4gPSBtaW4udG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtaW4gPSBmaWVsZC5fbWluXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWluKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQubWluID0gQ3JlYXRvci5ldmFsKFwiKCN7bWlufSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0bWF4ID0gZmllbGQubWF4XG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtYXgpXG5cdFx0XHRcdFx0ZmllbGQuX21heCA9IG1heC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG1heCA9IGZpZWxkLl9tYXhcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtYXgpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5tYXggPSBDcmVhdG9yLmV2YWwoXCIoI3ttYXh9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxuXHRcdFx0XHRcdF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT0gT2JqZWN0ICYmIF90eXBlICE9IFN0cmluZyAmJiBfdHlwZSAhPSBOdW1iZXIgJiYgX3R5cGUgIT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKVxuXHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNTdHJpbmcoX3R5cGUpXG5cdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3IuZXZhbChcIigje190eXBlfSlcIilcblx0XHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0ZmllbGQuX3JlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90by50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKClcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQuX3JlZmVyZW5jZV90b1xuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gfHwgZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnNGdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3IuZXZhbChcIigje3JlZmVyZW5jZV90b30pXCIpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2NyZWF0ZUZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7YmVmb3JlT3BlbkZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyc0Z1bmN0aW9ufSlcIilcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHRmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZVxuXG5cdFx0XHRcdGlmICFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tkZWZhdWx0VmFsdWV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cdFx0XHRcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNGdW5jdGlvbihpc19jb21wYW55X2xpbWl0ZWQpXG5cdFx0XHRcdFx0ZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvci5ldmFsKFwiKCN7aXNfY29tcGFueV9saW1pdGVkfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpIC0+XG5cdFx0XHQjIyNcblx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcblx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcblx0XHRcdOWmgu+8mlxuXHRcdFx0ZmlsdGVyczogKCktPlxuXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG5cdFx0XHTlpoLvvJpcblx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHRdXVxuXHRcdFx05oiWXG5cdFx0XHRmaWx0ZXJzOiBbe1xuXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxuXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cblx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHR9XVxuXHRcdFx0IyMjXG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKClcblx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvci5ldmFsKFwiKCN7bGlzdF92aWV3Ll9maWx0ZXJzfSlcIilcblx0XHRcdGVsc2Vcblx0XHRcdFx0Xy5mb3JFYWNoIGxpc3Rfdmlldy5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cblx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoZmlsdGVyKVxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0RhdGUoZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5pivRGF0Zeexu+Wei++8jOWImWZpbHRlclsyXeWAvOWIsOWJjeerr+S8muiHquWKqOi9rOaIkOWtl+espuS4su+8jOagvOW8j++8mlwiMjAxOC0wMy0yOVQwMzo0MzoyMS43ODdaXCJcblx0XHRcdFx0XHRcdFx0XHQjIOWMheaLrGdyaWTliJfooajor7fmsYLnmoTmjqXlj6PlnKjlhoXnmoTmiYDmnIlPRGF0YeaOpeWPo++8jERhdGXnsbvlnovlrZfmrrXpg73kvJrku6XkuIrov7DmoLzlvI/ov5Tlm55cblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkRBVEVcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlclsyXX0pXCIpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJEQVRFXCJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGZpbHRlcilcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRGF0ZShmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5faXNfZGF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIuX2lzX2RhdGUgPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSlcblxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0aWYgb2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkgb2JqZWN0LmZvcm0sIChrZXksIHZhbCktPlxuXHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbih2YWwpXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsICsgJyc7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRlbHNlIGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgb2JqZWN0LmZvcm1cblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlIG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cblx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJylcblx0XHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZF9saXN0cywgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkX2xpc3RzLCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKVxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKClcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXG5cblx0XHRyZXR1cm4gb2JqZWN0XG5cblxuIiwidmFyIGNvbnZlcnRGaWVsZCwgZ2V0T3B0aW9uO1xuXG5nZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdmFyIGZvbztcbiAgZm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKTtcbiAgaWYgKGZvby5sZW5ndGggPiAyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdLFxuICAgICAgY29sb3I6IGZvb1syXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZm9vLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1swXVxuICAgIH07XG4gIH1cbn07XG5cbmNvbnZlcnRGaWVsZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCkge1xuICB2YXIgYWxsT3B0aW9ucywgY29kZSwgb3B0aW9ucywgcGlja2xpc3QsIHBpY2tsaXN0T3B0aW9ucywgcmVmO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICBjb2RlID0gZmllbGQucGlja2xpc3QgfHwgKG9iamVjdF9uYW1lICsgXCIuXCIgKyBmaWVsZF9uYW1lKTtcbiAgICBpZiAoY29kZSkge1xuICAgICAgcGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuICAgICAgaWYgKHBpY2tsaXN0KSB7XG4gICAgICAgIG9wdGlvbnMgPSBbXTtcbiAgICAgICAgYWxsT3B0aW9ucyA9IFtdO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdCk7XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IChyZWYgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJykpICE9IG51bGwgPyByZWYucmV2ZXJzZSgpIDogdm9pZCAwO1xuICAgICAgICBfLmVhY2gocGlja2xpc3RPcHRpb25zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIGxhYmVsLCB2YWx1ZTtcbiAgICAgICAgICBsYWJlbCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lO1xuICAgICAgICAgIGFsbE9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbmFibGU6IGl0ZW0uZW5hYmxlLFxuICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXRlbS5lbmFibGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtW1wiZGVmYXVsdFwiXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0LCBzcGFjZUlkKSB7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIGtleSkge1xuICAgIHZhciBfdG9kbywgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiO1xuICAgIGlmICgoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikpIHtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXIgIT0gbnVsbCA/IHRyaWdnZXIuX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSB7XG4gICAgICBfdG9kbyA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICAgIHZhciBzeXN0ZW1CYXNlRmllbGRzO1xuICAgICAgaWYgKGZpZWxkLm9taXQpIHtcbiAgICAgICAgZmllbGQuaGlkZGVuID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWVsZC5yZXF1aXJlZCAmJiBmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmaWVsZC5yZWFkb25seSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgc3lzdGVtQmFzZUZpZWxkcyA9IENyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcygpO1xuICAgICAgaWYgKHN5c3RlbUJhc2VGaWVsZHMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiLCBfdmlzaWJsZSwgZXJyb3I7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKSkge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKCl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl92aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF8uaXNTdHJpbmcoX3Zpc2libGUpKSB7XG4gICAgICAgICAgICBfdmlzaWJsZSA9IF92aXNpYmxlLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNFeHByZXNzaW9uKF92aXNpYmxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zLCByZWNvcmQpIHtcbiAgICAgICAgICAgICAgdmFyIGdsb2JhbERhdGE7XG4gICAgICAgICAgICAgIGdsb2JhbERhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBDcmVhdG9yLlVTRVJfQ09OVEVYVCwge1xuICAgICAgICAgICAgICAgIG5vdzogbmV3IERhdGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIFN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uKF92aXNpYmxlLCByZWNvcmQsIFwiI1wiLCBnbG9iYWxEYXRhKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3Zpc2libGUgKyBcIilcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kbywgX3Zpc2libGU7XG4gICAgICBfdG9kbyA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICBhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi52aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSkpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICB2YXIgX29wdGlvbnMsIF90eXBlLCBiZWZvcmVPcGVuRnVuY3Rpb24sIGNyZWF0ZUZ1bmN0aW9uLCBkZWZhdWx0VmFsdWUsIGVycm9yLCBmaWx0ZXJzRnVuY3Rpb24sIGlzX2NvbXBhbnlfbGltaXRlZCwgbWF4LCBtaW4sIG9wdGlvbnMsIG9wdGlvbnNGdW5jdGlvbiwgcmVmZXJlbmNlX3RvLCByZWdFeDtcbiAgICBmaWVsZCA9IGNvbnZlcnRGaWVsZChvYmplY3QubmFtZSwga2V5LCBmaWVsZCwgc3BhY2VJZCk7XG4gICAgaWYgKGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMuc3BsaXQoXCJcXG5cIiksIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIHZhciBvcHRpb25zO1xuICAgICAgICAgIGlmIChvcHRpb24uaW5kZXhPZihcIixcIikpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihfb3B0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICBpZiAoXy5pc1N0cmluZyhvcHRpb24pKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgXy5lYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiB2LFxuICAgICAgICAgIHZhbHVlOiBrXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgaWYgKG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0gZmllbGQuX29wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9ucyArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVnRXggPSBmaWVsZC5fcmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5yZWdFeCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVnRXggKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtaW4gPSBmaWVsZC5taW47XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1pbikpIHtcbiAgICAgICAgZmllbGQuX21pbiA9IG1pbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtaW4gPSBmaWVsZC5fbWluO1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWluKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1pbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWluICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgbWF4ID0gZmllbGQubWF4O1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihtYXgpKSB7XG4gICAgICAgIGZpZWxkLl9tYXggPSBtYXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWF4ID0gZmllbGQuX21heDtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG1heCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5tYXggPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG1heCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9PSBPYmplY3QgJiYgX3R5cGUgIT09IFN0cmluZyAmJiBfdHlwZSAhPT0gTnVtYmVyICYmIF90eXBlICE9PSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpKSB7XG4gICAgICAgICAgZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlO1xuICAgICAgICBpZiAoX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSkpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3R5cGUgKyBcIilcIik7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgIGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb247XG4gICAgICBiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiB8fCBmaWVsZC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICBpZiAob3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG9wdGlvbnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVmZXJlbmNlX3RvICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBjcmVhdGVGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgYmVmb3JlT3BlbkZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJzRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKCFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGRlZmF1bHRWYWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc1N0cmluZyhpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgaXNfY29tcGFueV9saW1pdGVkICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgXy5mb3JFYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuXG4gICAgLypcbiAgICBcdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcbiAgICBcdFx0XHTorqnov4fomZHlmajmlK/mjIHkuKTnp41mdW5jdGlvbuaWueW8j++8mlxuICAgIFx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuICAgIFx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdF1dXG4gICAgXHRcdFx05oiWXG4gICAgXHRcdFx0ZmlsdGVyczogW3tcbiAgICBcdFx0XHRcdFwiZmllbGRcIjogXCJvYmplY3RfbmFtZVwiXG4gICAgXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuICAgIFx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XG4gICAgXHRcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHR9XVxuICAgICAqL1xuICAgIGlmIChfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbGlzdF92aWV3Ll9maWx0ZXJzICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXy5mb3JFYWNoKGxpc3Rfdmlldy5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRGF0ZShmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkRBVEVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJGVU5DVElPTlwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyWzJdICsgXCIpXCIpO1xuICAgICAgICAgICAgICBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkRBVEVcIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRGF0ZShmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5faXNfZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLl9pc19kYXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXIudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmIChvYmplY3QuZm9ybSAmJiAhXy5pc1N0cmluZyhvYmplY3QuZm9ybSkpIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgIHJldHVybiB2YWwgKyAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdC5mb3JtKSB7XG4gICAgICBvYmplY3QuZm9ybSA9IEpTT04ucGFyc2Uob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRfbGlzdHMsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJmaWx0ZXJzX2NvZGVcIiwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZF9saXN0cywgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZmlsdGVyc19jb2RlXCIsIHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge31cblxuQ3JlYXRvci5Gb3JtdWxhci5QUkVGSVggPSBcIl9WQUxVRVNcIlxuXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IChwcmVmaXgsZmllbGRWYXJpYWJsZSktPlxuXHRyZWcgPSAvKFxce1tee31dKlxcfSkvZztcblxuXHRyZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UgcmVnLCAobSwgJDEpLT5cblx0XHRyZXR1cm4gcHJlZml4ICsgJDEucmVwbGFjZSgvXFx7XFxzKi8sXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LyxcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csXCJcXFwiXVtcXFwiXCIpO1xuXG5cdHJldHVybiByZXZcblxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSAoZm9ybXVsYV9zdHIpLT5cblx0aWYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbkNyZWF0b3IuRm9ybXVsYXIucnVuID0gKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucyktPlxuXHRpZiBmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKVxuXG5cdFx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnM/LmV4dGVuZClcblx0XHRcdGV4dGVuZCA9IHRydWVcblxuXHRcdF9WQUxVRVMgPSB7fVxuXHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVClcblx0XHRpZiBleHRlbmRcblx0XHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnM/LnVzZXJJZCwgb3B0aW9ucz8uc3BhY2VJZCkpXG5cdFx0Zm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpXG5cblx0XHR0cnlcblx0XHRcdGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpICAgIyDmraTlpITkuI3og73nlKh3aW5kb3cuZXZhbCDvvIzkvJrlr7zoh7Tlj5jph4/kvZznlKjln5/lvILluLhcblx0XHRcdHJldHVybiBkYXRhXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfVwiLCBlKVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdHRvYXN0cj8uZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIilcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfSN7ZX1cIlxuXG5cdHJldHVybiBmb3JtdWxhX3N0clxuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9O1xuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiO1xuXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IGZ1bmN0aW9uKHByZWZpeCwgZmllbGRWYXJpYWJsZSkge1xuICB2YXIgcmVnLCByZXY7XG4gIHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuICByZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UocmVnLCBmdW5jdGlvbihtLCAkMSkge1xuICAgIHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLywgXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LywgXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLCBcIlxcXCJdW1xcXCJcIik7XG4gIH0pO1xuICByZXR1cm4gcmV2O1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhX3N0cikge1xuICBpZiAoXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSBmdW5jdGlvbihmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpIHtcbiAgdmFyIF9WQUxVRVMsIGRhdGEsIGUsIGV4dGVuZDtcbiAgaWYgKGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpKSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmV4dGVuZCA6IHZvaWQgMCkpIHtcbiAgICAgIGV4dGVuZCA9IHRydWU7XG4gICAgfVxuICAgIF9WQUxVRVMgPSB7fTtcbiAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpO1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMudXNlcklkIDogdm9pZCAwLCBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNwYWNlSWQgOiB2b2lkIDApKTtcbiAgICB9XG4gICAgZm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpO1xuICAgIHRyeSB7XG4gICAgICBkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIsIGUpO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIHRvYXN0ciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0b2FzdHIgIT09IG51bGwpIHtcbiAgICAgICAgICB0b2FzdHIuZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyICsgZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmb3JtdWxhX3N0cjtcbn07XG4iLCJjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fSAgICMg5q2k5a+56LGh5Y+q6IO95Zyo56Gu5L+d5omA5pyJT2JqZWN05Yid5aeL5YyW5a6M5oiQ5ZCO6LCD55So77yMIOWQpuWImeiOt+WPluWIsOeahG9iamVjdOS4jeWFqFxuXG5DcmVhdG9yLmZvcm1hdE9iamVjdE5hbWUgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpXG5cdFx0b2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwuJywgJ2cnKSwgJ18nKVxuXHRyZXR1cm4gb2JqZWN0X25hbWVcblxuQ3JlYXRvci5PYmplY3QgPSAob3B0aW9ucyktPlxuXHRfYmFzZU9iamVjdCA9IENyZWF0b3IuYmFzZU9iamVjdFxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRfYmFzZU9iamVjdCA9IHthY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyAsIGZpZWxkczoge30sIHRyaWdnZXJzOiB7fSwgcGVybWlzc2lvbl9zZXQ6IHt9fVxuXHRzZWxmID0gdGhpc1xuXHRpZiAoIW9wdGlvbnMubmFtZSlcblx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG5cblx0c2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWVcblx0c2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2Vcblx0c2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lXG5cdHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsXG5cdHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvblxuXHRzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvblxuXHRzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXdcblx0c2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtXG5cdHNlbGYucmVsYXRlZExpc3QgPSBvcHRpb25zLnJlbGF0ZWRMaXN0XG5cdHNlbGYucmVsYXRlZF9saXN0cyA9IG9wdGlvbnMucmVsYXRlZF9saXN0c1xuXHRzZWxmLmhhc0ltcG9ydFRlbXBsYXRlcyA9IG9wdGlvbnMuaGFzSW1wb3J0VGVtcGxhdGVzXG5cdHNlbGYudmVyc2lvbiA9IG9wdGlvbnMudmVyc2lvbiB8fCAxLjBcblx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSAgfHwgb3B0aW9ucy5pc19lbmFibGUgPT0gdHJ1ZVxuXHRcdHNlbGYuaXNfZW5hYmxlID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5pc19lbmFibGUgPSBmYWxzZVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpXG5cdFx0XHRzZWxmLmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvcHRpb25zLmFsbG93X2N1c3RvbUFjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnZXhjbHVkZV9hY3Rpb25zJylcblx0XHRcdHNlbGYuZXhjbHVkZV9hY3Rpb25zID0gb3B0aW9ucy5leGNsdWRlX2FjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKVxuXHRcdFx0c2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3Rcblx0c2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoXG5cdHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXNcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xuXHRzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzXG5cdHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXRcblx0c2VsZi5lbmFibGVfZXZlbnRzID0gb3B0aW9ucy5lbmFibGVfZXZlbnRzXG5cdGlmIG9wdGlvbnMucGFnaW5nXG5cdFx0c2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZ1xuXHRzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuXG5cdHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT0gdW5kZWZpbmVkKSBvciBvcHRpb25zLmVuYWJsZV9hcGlcblx0c2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbVxuXHRzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlXG5cdHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlc1xuXHRzZWxmLmVuYWJsZV9wcm9jZXNzID0gb3B0aW9ucy5lbmFibGVfcHJvY2Vzc1xuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXG5cdFx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcblx0ZWxzZVxuXHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxuXHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXG5cdHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93XG5cdHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55XG5cdHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpXG5cdHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyXG5cdHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2hcblx0c2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsXG5cdHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFsc1xuXHRzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3dcblx0c2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvd1xuXHRzZWxmLmVuYWJsZV9pbmxpbmVfZWRpdCA9IG9wdGlvbnMuZW5hYmxlX2lubGluZV9lZGl0XG5cdHNlbGYuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlsc1xuXHRzZWxmLm1hc3RlcnMgPSBvcHRpb25zLm1hc3RlcnNcblx0c2VsZi5sb29rdXBfZGV0YWlscyA9IG9wdGlvbnMubG9va3VwX2RldGFpbHNcblx0aWYgXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50Jylcblx0XHRzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudFxuXHRzZWxmLmlkRmllbGROYW1lID0gJ19pZCdcblx0aWYgb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdFx0c2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdGlmICghb3B0aW9ucy5maWVsZHMpXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XG5cblx0c2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcylcblxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmIGZpZWxkLmlzX25hbWVcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXG5cdFx0ZWxzZSBpZiBmaWVsZF9uYW1lID09ICduYW1lJyAmJiAhc2VsZi5OQU1FX0ZJRUxEX0tFWVxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcblx0XHRpZiBmaWVsZC5wcmltYXJ5XG5cdFx0XHRzZWxmLmlkRmllbGROYW1lID0gZmllbGRfbmFtZVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXG5cdFx0XHRcdGlmIGZpZWxkX25hbWUgPT0gJ3NwYWNlJ1xuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gZmFsc2VcblxuXHRpZiAhb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xuXHRcdF8uZWFjaCBfYmFzZU9iamVjdC5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgIXNlbGYuZmllbGRzW2ZpZWxkX25hbWVdXG5cdFx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge31cblx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKVxuXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc3VtbWFyeSdcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdHNlbGYubGlzdF92aWV3cyA9IHt9XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpXG5cdF8uZWFjaCBvcHRpb25zLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRWaWV3LCBpdGVtLCBpdGVtX25hbWUpXG5cdFx0c2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbVxuXG5cdHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKVxuXHRfLmVhY2ggb3B0aW9ucy50cmlnZ2VycywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWVcblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pXG5cblx0c2VsZi5hY3Rpb25zID0gXy5jbG9uZShfYmFzZU9iamVjdC5hY3Rpb25zKVxuXHRfLmVhY2ggb3B0aW9ucy5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdXG5cdFx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0Y29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKVxuXHRcdGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSAj5YWI5Yig6Zmk55u45YWz5bGe5oCn5YaN6YeN5bu65omN6IO95L+d6K+B5ZCO57ut6YeN5aSN5a6a5LmJ55qE5bGe5oCn6aG65bqP55Sf5pWIXG5cdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSlcblx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXS5vYmplY3RfbmFtZSA9IHNlbGYubmFtZVxuXG5cdF8uZWFjaCBzZWxmLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpdGVtLm5hbWUgPSBpdGVtX25hbWVcblxuXHRzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKVxuXG5cdCMg6K6p5omA5pyJb2JqZWN06buY6K6k5pyJ5omA5pyJbGlzdF92aWV3cy9hY3Rpb25zL3JlbGF0ZWRfb2JqZWN0cy9yZWFkYWJsZV9maWVsZHMvZWRpdGFibGVfZmllbGRz5a6M5pW05p2D6ZmQ77yM6K+l5p2D6ZmQ5Y+v6IO96KKr5pWw5o2u5bqT5Lit6K6+572u55qEYWRtaW4vdXNlcuadg+mZkOimhuebllxuXHRzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldClcblx0IyBkZWZhdWx0TGlzdFZpZXdzID0gXy5rZXlzKHNlbGYubGlzdF92aWV3cylcblx0IyBkZWZhdWx0QWN0aW9ucyA9IF8ua2V5cyhzZWxmLmFjdGlvbnMpXG5cdCMgZGVmYXVsdFJlbGF0ZWRPYmplY3RzID0gXy5wbHVjayhzZWxmLnJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXG5cdCMgZGVmYXVsdFJlYWRhYmxlRmllbGRzID0gW11cblx0IyBkZWZhdWx0RWRpdGFibGVGaWVsZHMgPSBbXVxuXHQjIF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdCMgXHRpZiAhKGZpZWxkLmhpZGRlbikgICAgIzIzMSBvbWl05a2X5q615pSv5oyB5Zyo6Z2e57yW6L6R6aG16Z2i5p+l55yLLCDlm6DmraTliKDpmaTkuobmraTlpITlr7lvbWl055qE5Yik5patXG5cdCMgXHRcdGRlZmF1bHRSZWFkYWJsZUZpZWxkcy5wdXNoIGZpZWxkX25hbWVcblx0IyBcdFx0aWYgIWZpZWxkLnJlYWRvbmx5XG5cdCMgXHRcdFx0ZGVmYXVsdEVkaXRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxuXG5cdCMgXy5lYWNoIHNlbGYucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0IyBcdGlmIGl0ZW1fbmFtZSA9PSBcIm5vbmVcIlxuXHQjIFx0XHRyZXR1cm5cblx0IyBcdGlmIHNlbGYubGlzdF92aWV3c1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ubGlzdF92aWV3cyA9IGRlZmF1bHRMaXN0Vmlld3Ncblx0IyBcdGlmIHNlbGYuYWN0aW9uc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uYWN0aW9ucyA9IGRlZmF1bHRBY3Rpb25zXG5cdCMgXHRpZiBzZWxmLnJlbGF0ZWRfb2JqZWN0c1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVsYXRlZF9vYmplY3RzID0gZGVmYXVsdFJlbGF0ZWRPYmplY3RzXG5cdCMgXHRpZiBzZWxmLmZpZWxkc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVhZGFibGVfZmllbGRzID0gZGVmYXVsdFJlYWRhYmxlRmllbGRzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5lZGl0YWJsZV9maWVsZHMgPSBkZWZhdWx0RWRpdGFibGVGaWVsZHNcblx0dW5sZXNzIG9wdGlvbnMucGVybWlzc2lvbl9zZXRcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge31cblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py5hZG1pbilcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pXG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8udXNlcilcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKVxuXHRfLmVhY2ggb3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9XG5cdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKVxuXG5cdCMg5YmN56uv5qC55o2ucGVybWlzc2lvbnPmlLnlhplmaWVsZOebuOWFs+WxnuaAp++8jOWQjuerr+WPquimgei1sOm7mOiupOWxnuaAp+WwseihjO+8jOS4jemcgOimgeaUueWGmVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnNcblx0XHRkaXNhYmxlZF9saXN0X3ZpZXdzID0gcGVybWlzc2lvbnM/LmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRpZiBkaXNhYmxlZF9saXN0X3ZpZXdzPy5sZW5ndGhcblx0XHRcdGRlZmF1bHRMaXN0Vmlld0lkID0gb3B0aW9ucy5saXN0X3ZpZXdzPy5hbGw/Ll9pZFxuXHRcdFx0aWYgZGVmYXVsdExpc3RWaWV3SWRcblx0XHRcdFx0IyDmiorop4blm77mnYPpmZDphY3nva7kuK3pu5jorqTnmoRhbGzop4blm75pZOi9rOaNouaIkGFsbOWFs+mUruWtl1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAgZGlzYWJsZWRfbGlzdF92aWV3cywgKGxpc3Rfdmlld19pdGVtKSAtPlxuXHRcdFx0XHRcdHJldHVybiBpZiBkZWZhdWx0TGlzdFZpZXdJZCA9PSBsaXN0X3ZpZXdfaXRlbSB0aGVuIFwiYWxsXCIgZWxzZSBsaXN0X3ZpZXdfaXRlbVxuXHRcdHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpXG4jXHRcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG4jXHRcdFx0aWYgZmllbGRcbiNcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5yZWFkYWJsZV9maWVsZHMsIGZpZWxkX25hbWUpIDwgMFxuI1x0XHRcdFx0XHRpZiBmaWVsZC5oaWRkZW5cbiNcdFx0XHRcdFx0XHRyZXR1cm5cbiNcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bmVkaXRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPiAtMVxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuI1x0XHRcdFx0XHRcdGZpZWxkLmRpc2FibGVkID0gdHJ1ZVxuI1x0XHRcdFx0XHRcdCMg5b2T5Y+q6K+75pe277yM5aaC5p6c5LiN5Y675o6J5b+F5aGr5a2X5q6177yMYXV0b2Zvcm3mmK/kvJrmiqXplJnnmoRcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZXF1aXJlZCA9IGZhbHNlXG4jXHRcdFx0XHRlbHNlXG4jXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IHRydWVcblx0ZWxzZVxuXHRcdHNlbGYucGVybWlzc2lvbnMgPSBudWxsXG5cblx0X2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpXG5cblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiXG5cblx0c2VsZi5kYiA9IF9kYlxuXG5cdHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZVxuXG5cdHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpXG5cdHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpXG5cdGlmIHNlbGYubmFtZSAhPSBcInVzZXJzXCIgYW5kIHNlbGYubmFtZSAhPSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiLCBcImFjdGlvbl9maWVsZF91cGRhdGVzXCIsIFwib2JqZWN0X2xpc3R2aWV3c1wiXSwgc2VsZi5uYW1lKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXHRcdGVsc2Vcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblx0aWYgc2VsZi5uYW1lID09IFwidXNlcnNcIlxuXHRcdF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWFcblxuXHRpZiBfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cblx0Q3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmXG5cblx0cmV0dXJuIHNlbGZcblxuIyBDcmVhdG9yLk9iamVjdC5wcm90b3R5cGUuaTE4biA9ICgpLT5cbiMgXHQjIHNldCBvYmplY3QgbGFiZWxcbiMgXHRzZWxmID0gdGhpc1xuXG4jIFx0a2V5ID0gc2VsZi5uYW1lXG4jIFx0aWYgdChrZXkpID09IGtleVxuIyBcdFx0aWYgIXNlbGYubGFiZWxcbiMgXHRcdFx0c2VsZi5sYWJlbCA9IHNlbGYubmFtZVxuIyBcdGVsc2VcbiMgXHRcdHNlbGYubGFiZWwgPSB0KGtleSlcblxuIyBcdCMgc2V0IGZpZWxkIGxhYmVsc1xuIyBcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG4jIFx0XHRma2V5ID0gc2VsZi5uYW1lICsgXCJfXCIgKyBmaWVsZF9uYW1lXG4jIFx0XHRpZiB0KGZrZXkpID09IGZrZXlcbiMgXHRcdFx0aWYgIWZpZWxkLmxhYmVsXG4jIFx0XHRcdFx0ZmllbGQubGFiZWwgPSBmaWVsZF9uYW1lXG4jIFx0XHRlbHNlXG4jIFx0XHRcdGZpZWxkLmxhYmVsID0gdChma2V5KVxuIyBcdFx0c2VsZi5zY2hlbWE/Ll9zY2hlbWE/W2ZpZWxkX25hbWVdPy5sYWJlbCA9IGZpZWxkLmxhYmVsXG5cblxuIyBcdCMgc2V0IGxpc3R2aWV3IGxhYmVsc1xuIyBcdF8uZWFjaCBzZWxmLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cbiMgXHRcdGkxOG5fa2V5ID0gc2VsZi5uYW1lICsgXCJfbGlzdHZpZXdfXCIgKyBpdGVtX25hbWVcbiMgXHRcdGlmIHQoaTE4bl9rZXkpID09IGkxOG5fa2V5XG4jIFx0XHRcdGlmICFpdGVtLmxhYmVsXG4jIFx0XHRcdFx0aXRlbS5sYWJlbCA9IGl0ZW1fbmFtZVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHRpdGVtLmxhYmVsID0gdChpMThuX2tleSlcblxuXG5DcmVhdG9yLmdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4ID0gKG9iamVjdCktPlxuXHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcblx0IyBpZiBvYmplY3Rcblx0IyBcdGlmICFvYmplY3QuZGF0YWJhc2VfbmFtZSB8fCBvYmplY3QuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xuXHQjIFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcblx0IyBcdGVsc2Vcblx0IyBcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS8je29iamVjdC5kYXRhYmFzZV9uYW1lfVwiXG5cbiMgaWYgTWV0ZW9yLmlzQ2xpZW50XG5cbiMgXHRNZXRlb3Iuc3RhcnR1cCAtPlxuIyBcdFx0VHJhY2tlci5hdXRvcnVuIC0+XG4jIFx0XHRcdGlmIFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgJiYgQ3JlYXRvci5ib290c3RyYXBMb2FkZWQ/LmdldCgpXG4jIFx0XHRcdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cbiMgXHRcdFx0XHRcdG9iamVjdC5pMThuKClcblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0aWYgIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkICYmIENyZWF0b3IuT2JqZWN0c1xuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChvYmplY3QpLT5cblx0XHRcdG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpXG5cbiIsInZhciBjbG9uZTtcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fTtcblxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgaWYgKG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJyk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdF9uYW1lO1xufTtcblxuQ3JlYXRvci5PYmplY3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHZhciBfYmFzZU9iamVjdCwgX2RiLCBkZWZhdWx0TGlzdFZpZXdJZCwgZGVmYXVsdFZpZXcsIGRpc2FibGVkX2xpc3Rfdmlld3MsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNjaGVtYSwgc2VsZjtcbiAgX2Jhc2VPYmplY3QgPSBDcmVhdG9yLmJhc2VPYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfYmFzZU9iamVjdCA9IHtcbiAgICAgIGFjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zLFxuICAgICAgZmllbGRzOiB7fSxcbiAgICAgIHRyaWdnZXJzOiB7fSxcbiAgICAgIHBlcm1pc3Npb25fc2V0OiB7fVxuICAgIH07XG4gIH1cbiAgc2VsZiA9IHRoaXM7XG4gIGlmICghb3B0aW9ucy5uYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcbiAgfVxuICBzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gIHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWw7XG4gIHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvbjtcbiAgc2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb247XG4gIHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlldztcbiAgc2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtO1xuICBzZWxmLnJlbGF0ZWRMaXN0ID0gb3B0aW9ucy5yZWxhdGVkTGlzdDtcbiAgc2VsZi5yZWxhdGVkX2xpc3RzID0gb3B0aW9ucy5yZWxhdGVkX2xpc3RzO1xuICBzZWxmLmhhc0ltcG9ydFRlbXBsYXRlcyA9IG9wdGlvbnMuaGFzSW1wb3J0VGVtcGxhdGVzO1xuICBzZWxmLnZlcnNpb24gPSBvcHRpb25zLnZlcnNpb24gfHwgMS4wO1xuICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSB8fCBvcHRpb25zLmlzX2VuYWJsZSA9PT0gdHJ1ZSkge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IGZhbHNlO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKSkge1xuICAgICAgc2VsZi5hbGxvd19jdXN0b21BY3Rpb25zID0gb3B0aW9ucy5hbGxvd19jdXN0b21BY3Rpb25zO1xuICAgIH1cbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2V4Y2x1ZGVfYWN0aW9ucycpKSB7XG4gICAgICBzZWxmLmV4Y2x1ZGVfYWN0aW9ucyA9IG9wdGlvbnMuZXhjbHVkZV9hY3Rpb25zO1xuICAgIH1cbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2FsbG93X3JlbGF0ZWRMaXN0JykpIHtcbiAgICAgIHNlbGYuYWxsb3dfcmVsYXRlZExpc3QgPSBvcHRpb25zLmFsbG93X3JlbGF0ZWRMaXN0O1xuICAgIH1cbiAgfVxuICBzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2g7XG4gIHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXM7XG4gIHNlbGYuZW5hYmxlX3Rhc2tzID0gb3B0aW9ucy5lbmFibGVfdGFza3M7XG4gIHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXM7XG4gIHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXQ7XG4gIHNlbGYuZW5hYmxlX2V2ZW50cyA9IG9wdGlvbnMuZW5hYmxlX2V2ZW50cztcbiAgaWYgKG9wdGlvbnMucGFnaW5nKSB7XG4gICAgc2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZztcbiAgfVxuICBzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuO1xuICBzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09PSB2b2lkIDApIHx8IG9wdGlvbnMuZW5hYmxlX2FwaTtcbiAgc2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbTtcbiAgc2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZTtcbiAgc2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzO1xuICBzZWxmLmVuYWJsZV9wcm9jZXNzID0gb3B0aW9ucy5lbmFibGVfcHJvY2VzcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gICAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgfVxuICBzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvdztcbiAgc2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnk7XG4gIHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpO1xuICBzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlcjtcbiAgc2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaDtcbiAgc2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsO1xuICBzZWxmLmVuYWJsZV9hcHByb3ZhbHMgPSBvcHRpb25zLmVuYWJsZV9hcHByb3ZhbHM7XG4gIHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvdztcbiAgc2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvdztcbiAgc2VsZi5lbmFibGVfaW5saW5lX2VkaXQgPSBvcHRpb25zLmVuYWJsZV9pbmxpbmVfZWRpdDtcbiAgc2VsZi5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzO1xuICBzZWxmLm1hc3RlcnMgPSBvcHRpb25zLm1hc3RlcnM7XG4gIHNlbGYubG9va3VwX2RldGFpbHMgPSBvcHRpb25zLmxvb2t1cF9kZXRhaWxzO1xuICBpZiAoXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50JykpIHtcbiAgICBzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudDtcbiAgfVxuICBzZWxmLmlkRmllbGROYW1lID0gJ19pZCc7XG4gIGlmIChvcHRpb25zLmRhdGFiYXNlX25hbWUpIHtcbiAgICBzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWU7XG4gIH1cbiAgaWYgKCFvcHRpb25zLmZpZWxkcykge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBmaWVsZHMnKTtcbiAgfVxuICBzZWxmLmZpZWxkcyA9IGNsb25lKG9wdGlvbnMuZmllbGRzKTtcbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC5pc19uYW1lKSB7XG4gICAgICBzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkX25hbWUgPT09ICduYW1lJyAmJiAhc2VsZi5OQU1FX0ZJRUxEX0tFWSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5wcmltYXJ5KSB7XG4gICAgICBzZWxmLmlkRmllbGROYW1lID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSkge1xuICAgICAgICBpZiAoZmllbGRfbmFtZSA9PT0gJ3NwYWNlJykge1xuICAgICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBmaWVsZC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmICghb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PT0gJ21ldGVvci1tb25nbycpIHtcbiAgICBfLmVhY2goX2Jhc2VPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgaWYgKCFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSkge1xuICAgICAgICBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKTtcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goc2VsZi5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09ICdhdXRvbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdmb3JtdWxhJykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdzdW1tYXJ5Jykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBzZWxmLmxpc3Rfdmlld3MgPSB7fTtcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KHNlbGYubmFtZSk7XG4gIF8uZWFjaChvcHRpb25zLmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBvaXRlbTtcbiAgICBvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRWaWV3LCBpdGVtLCBpdGVtX25hbWUpO1xuICAgIHJldHVybiBzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtO1xuICB9KTtcbiAgc2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QudHJpZ2dlcnMpO1xuICBfLmVhY2gob3B0aW9ucy50cmlnZ2VycywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgICByZXR1cm4gc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIHNlbGYuYWN0aW9ucyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QuYWN0aW9ucyk7XG4gIF8uZWFjaChvcHRpb25zLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBjb3B5SXRlbTtcbiAgICBpZiAoIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICBjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pO1xuICAgIGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXTtcbiAgICBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKTtcbiAgICByZXR1cm4gc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0ub2JqZWN0X25hbWUgPSBzZWxmLm5hbWU7XG4gIH0pO1xuICBfLmVhY2goc2VsZi5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lID0gaXRlbV9uYW1lO1xuICB9KTtcbiAgc2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSk7XG4gIHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KTtcbiAgaWYgKCFvcHRpb25zLnBlcm1pc3Npb25fc2V0KSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldCA9IHt9O1xuICB9XG4gIGlmICghKChyZWYgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmLmFkbWluIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSk7XG4gIH1cbiAgaWYgKCEoKHJlZjEgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmMS51c2VyIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pO1xuICB9XG4gIF8uZWFjaChvcHRpb25zLnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHJldHVybiBzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9ucztcbiAgICBkaXNhYmxlZF9saXN0X3ZpZXdzID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgOiB2b2lkIDA7XG4gICAgaWYgKGRpc2FibGVkX2xpc3Rfdmlld3MgIT0gbnVsbCA/IGRpc2FibGVkX2xpc3Rfdmlld3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICBkZWZhdWx0TGlzdFZpZXdJZCA9IChyZWYyID0gb3B0aW9ucy5saXN0X3ZpZXdzKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLmFsbCkgIT0gbnVsbCA/IHJlZjMuX2lkIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGRlZmF1bHRMaXN0Vmlld0lkKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcChkaXNhYmxlZF9saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXdfaXRlbSkge1xuICAgICAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCA9PT0gbGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBcImFsbFwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdF92aWV3X2l0ZW07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG51bGw7XG4gIH1cbiAgX2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpO1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGI7XG4gIHNlbGYuZGIgPSBfZGI7XG4gIHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZTtcbiAgc2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZik7XG4gIHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpO1xuICBpZiAoc2VsZi5uYW1lICE9PSBcInVzZXJzXCIgJiYgc2VsZi5uYW1lICE9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiLCBcImFjdGlvbl9maWVsZF91cGRhdGVzXCIsIFwib2JqZWN0X2xpc3R2aWV3c1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzZWxmLm5hbWUgPT09IFwidXNlcnNcIikge1xuICAgIF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWE7XG4gIH1cbiAgaWYgKF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGY7XG4gIHJldHVybiBzZWxmO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCI7XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgaWYgKCFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHMpIHtcbiAgICByZXR1cm4gXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICByZXR1cm4gbmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdCk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zID0gKGZpZWxkU2NoZW1hKSAtPlxuXHRvcHRpb25zID0gZmllbGRTY2hlbWEub3B0aW9uc1xuXHR1bmxlc3Mgb3B0aW9uc1xuXHRcdHJldHVyblxuXHRkYXRhX3R5cGUgPSBmaWVsZFNjaGVtYS5kYXRhX3R5cGVcblx0aWYgIV8uaXNGdW5jdGlvbihvcHRpb25zKSBhbmQgZGF0YV90eXBlIGFuZCBkYXRhX3R5cGUgIT0gJ3RleHQnXG5cdFx0IyDpm7bku6PnoIHnlYzpnaLphY3nva5vcHRpb25z6YCJ6aG55YC85Y+q5pSv5oyB5a2X56ym5Liy77yM5omA5Lul5b2TZGF0YV90eXBl5Li65pWw5YC85oiWYm9vbGVhbuaXtu+8jOWPquiDveW8uuihjOaKiumAiemhueWAvOWFiOi9rOaNouS4uuWvueW6lOeahOexu+Wei1xuXHRcdG9wdGlvbnMuZm9yRWFjaCAob3B0aW9uSXRlbSkgLT5cblx0XHRcdGlmIHR5cGVvZiBvcHRpb25JdGVtLnZhbHVlICE9ICdzdHJpbmcnXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgW1xuXHRcdFx0XHQnbnVtYmVyJ1xuXHRcdFx0XHQnY3VycmVuY3knXG5cdFx0XHRcdCdwZXJjZW50J1xuXHRcdFx0XS5pbmRleE9mKGRhdGFfdHlwZSkgPiAtMVxuXHRcdFx0XHRvcHRpb25JdGVtLnZhbHVlID0gTnVtYmVyKG9wdGlvbkl0ZW0udmFsdWUpXG5cdFx0XHRlbHNlIGlmIGRhdGFfdHlwZSA9PSAnYm9vbGVhbidcblx0XHRcdFx0IyDlj6rmnInkuLp0cnVl5omN5Li655yfXG5cdFx0XHRcdG9wdGlvbkl0ZW0udmFsdWUgPSBvcHRpb25JdGVtLnZhbHVlID09ICd0cnVlJ1xuXHRyZXR1cm4gb3B0aW9uc1xuXG5DcmVhdG9yLmdldE9iamVjdFNjaGVtYSA9IChvYmopIC0+XG5cdHVubGVzcyBvYmpcblx0XHRyZXR1cm5cblx0c2NoZW1hID0ge31cblxuXHRmaWVsZHNBcnIgPSBbXVxuXG5cdF8uZWFjaCBvYmouZmllbGRzICwgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgIV8uaGFzKGZpZWxkLCBcIm5hbWVcIilcblx0XHRcdGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lXG5cdFx0ZmllbGRzQXJyLnB1c2ggZmllbGRcblxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxuXG5cdFx0ZmllbGRfbmFtZSA9IGZpZWxkLm5hbWVcblxuXHRcdGZzID0ge31cblx0XHRpZiBmaWVsZC5yZWdFeFxuXHRcdFx0ZnMucmVnRXggPSBmaWVsZC5yZWdFeFxuXHRcdGZzLmF1dG9mb3JtID0ge31cblx0XHRmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlXG5cdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRhdXRvZm9ybV90eXBlID0gZmllbGQuYXV0b2Zvcm0/LnR5cGVcblxuXHRcdGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGQudHlwZSA9PSBcInBob25lXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbdGV4dF1cIiBvciBmaWVsZC50eXBlID09IFwiW3Bob25lXVwiXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnY29kZSdcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyXG5cdFx0XHRpZiBmaWVsZC5sYW5ndWFnZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidGV4dGFyZWFcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInBhc3N3b3JkXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRlXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxuXHRcdFx0XHRcdFx0IyBGaXggaW9zIDE0LCDmiYvmnLrlrqLmiLfnq6/lvoXlrqHmoLjmlofku7bml6XmnJ/mjqfku7bmmL7npLrmlYXpmpwgIzk5Me+8jGlvc+e7n+S4gOeUqFBD56uv5LiA5qC355qEanPmjqfku7Zcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXG5cdFx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuXHRcdFx0XHRcdFx0XHRcdHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXG5cdFx0XHRcdFx0XHRcdGRhdGVNb2JpbGVPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRpbWVcIlxuXHRcdFx0ZnMudHlwZSA9IERhdGVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcblx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0dHlwZTogXCJ0aW1lXCJcblx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwiSEg6bW1cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxuXHRcdFx0XHRcdFx0IyBGaXggaW9zIDE0LCDmiYvmnLrlrqLmiLfnq6/lvoXlrqHmoLjmlofku7bml6XmnJ/mjqfku7bmmL7npLrmlYXpmpwgIzk5Me+8jGlvc+e7n+S4gOeUqFBD56uv5LiA5qC355qEanPmjqfku7Zcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG5cdFx0XHRcdFx0XHRcdFx0cGlja2VyVHlwZTogXCJyb2xsZXJzXCJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcblx0XHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIltPYmplY3RdXCJcblx0XHRcdGZzLnR5cGUgPSBbT2JqZWN0XVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImh0bWxcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0h0bWwnO1xuXHRcdFx0IyBpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdCMgXHRsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG5cdFx0XHQjIFx0aWYgbG9jYWxlID09IFwiemgtY25cIiB8fCBsb2NhbGUgPT0gXCJ6aC1DTlwiXG5cdFx0XHQjIFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblx0XHRcdCMgXHRlbHNlXG5cdFx0XHQjIFx0XHRsb2NhbGUgPSBcImVuLVVTXCJcblx0XHRcdCMgXHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0IyBcdFx0dHlwZTogXCJzdW1tZXJub3RlXCJcblx0XHRcdCMgXHRcdGNsYXNzOiAnc3VtbWVybm90ZS1lZGl0b3InXG5cdFx0XHQjIFx0XHRzZXR0aW5nczpcblx0XHRcdCMgXHRcdFx0aGVpZ2h0OiAyMDBcblx0XHRcdCMgXHRcdFx0ZGlhbG9nc0luQm9keTogdHJ1ZVxuXHRcdFx0IyBcdFx0XHR0b29sYmFyOiAgW1xuXHRcdFx0IyBcdFx0XHRcdFsnZm9udDEnLCBbJ3N0eWxlJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ2ZvbnQzJywgWydmb250bmFtZSddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ2NvbG9yJywgWydjb2xvciddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ3RhYmxlJywgWyd0YWJsZSddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ2luc2VydCcsIFsnbGluaycsICdwaWN0dXJlJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsndmlldycsIFsnY29kZXZpZXcnXV1cblx0XHRcdCMgXHRcdFx0XVxuXHRcdFx0IyBcdFx0XHRmb250TmFtZXM6IFsnQXJpYWwnLCAnQ29taWMgU2FucyBNUycsICdDb3VyaWVyIE5ldycsICdIZWx2ZXRpY2EnLCAnSW1wYWN0JywgJ+Wui+S9kycsJ+m7keS9kycsJ+W+rui9r+mbhem7kScsJ+S7v+WuiycsJ+alt+S9kycsJ+matuS5picsJ+W5vOWchiddXG5cdFx0XHQjIFx0XHRcdGxhbmc6IGxvY2FsZVxuXG5cdFx0ZWxzZSBpZiAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblxuXHRcdFx0aWYgIWZpZWxkLmhpZGRlblxuXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzXG5cblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb25cblxuXHRcdFx0XHRpZiBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0XHRmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblxuXHRcdFx0XHRmcy5maWx0ZXJzRnVuY3Rpb24gPSBpZiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gdGhlbiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gZWxzZSBDcmVhdG9yLmV2YWx1YXRlRmlsdGVyc1xuXG5cdFx0XHRcdGlmIGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRcdGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRpZiBmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0X3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXVxuXHRcdFx0XHRcdFx0XHRcdGlmIF9yZWZfb2JqPy5wZXJtaXNzaW9ucz8uYWxsb3dDcmVhdGVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gKGxvb2t1cF9maWVsZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3JtSWQ6IFwibmV3I3tmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsJ18nKX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogXCIje2ZpZWxkLnJlZmVyZW5jZV90b31cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25TdWNjZXNzOiAob3BlcmF0aW9uLCByZXN1bHQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlc3VsdC5vYmplY3RfbmFtZSA9PSBcIm9iamVjdHNcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLCB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsIGljb246IHJlc3VsdC52YWx1ZS5pY29ufV0sIHJlc3VsdC52YWx1ZS5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLCB2YWx1ZTogcmVzdWx0Ll9pZH1dLCByZXN1bHQuX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlXG5cblx0XHRcdFx0XHRpZiBfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGVcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfbGltaXRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdFxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b19maWVsZFxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlVG9GaWVsZCA9IGZpZWxkLnJlZmVyZW5jZV90b19maWVsZFxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwidXNlcnNcIlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7liIbpg6jliJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7liIbpg6hcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWIhumDqOmDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJvcmdhbml6YXRpb25zXCJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7liIbpg6jliJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7liIbpg6hcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWIhumDqOmDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgdHlwZW9mKGZpZWxkLnJlZmVyZW5jZV90bykgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0XHRcdFx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZVxuXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBTdHJpbmdcblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBbU3RyaW5nXVxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b11cblxuXHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXVxuXHRcdFx0XHRcdFx0aWYgX29iamVjdCBhbmQgX29iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIlxuXG5cdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdXG5cdFx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90by5mb3JFYWNoIChfcmVmZXJlbmNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfb2JqZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IF9vYmplY3Q/LmxhYmVsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogX29iamVjdD8uaWNvblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb25cblxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb25cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIlxuXHRcdFx0IyDlm6DkuLrliJfooajop4blm77lj7Pkvqfov4fmu6Tlmajov5jmmK/nlKjnmoTogIHooajljZXnmoRsb29rdXDlkoxzZWxlY3Tmjqfku7bvvIzmiYDku6XkuIrpnaLnmoTku6PnoIHlp4vnu4jkv53mjIHljp/moLfpnIDopoHmiafooYxcblx0XHRcdCMg5LiL6Z2i5piv6YWN572u5LqGZGF0YV90eXBl5pe277yM6aKd5aSW5aSE55CG55qE6YC76L6RXG5cdFx0XHRpZiBmaWVsZC5kYXRhX3R5cGUgYW5kIGZpZWxkLmRhdGFfdHlwZSAhPSBcInRleHRcIlxuXHRcdFx0XHRpZiBbXCJudW1iZXJcIiwgXCJjdXJyZW5jeVwiLCBcInBlcmNlbnRcIl0uaW5kZXhPZihmaWVsZC5kYXRhX3R5cGUpID4gLTFcblx0XHRcdFx0XHRmc1R5cGUgPSBOdW1iZXJcblx0XHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdFx0XHRlbHNlIGlmIGZpZWxkLmRhdGFfdHlwZSA9PSBcImJvb2xlYW5cIlxuXHRcdFx0XHRcdGZzVHlwZSA9IEJvb2xlYW5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzVHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy50eXBlID0gZnNUeXBlXG5cdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdFx0ZnMudHlwZSA9IFtmc1R5cGVdXG5cdFx0XHRcdFx0XG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMoZmllbGQpXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY3VycmVuY3lcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0XHRlbHNlIGlmIGZpZWxkPy5zY2FsZSAhPSAwXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gMlxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm51bWJlclwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJib29sZWFuXCJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidG9nZ2xlXCJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi10b2dnbGVcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInJlZmVyZW5jZVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY2hlY2tib3hcIlxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlXCJcblx0XHRcdGNvbGxlY3Rpb25OYW1lID0gZmllbGQuY29sbGVjdGlvbiB8fCBcImZpbGVzXCIgIyBjb2xsZWN0aW9uIOm7mOiupOaYryAnZmlsZXMnXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTmFtZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImZpbGVzaXplXCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PSBcIm9iamVjdFwiXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZ3JpZFwiXG5cdFx0XHRmcy50eXBlID0gQXJyYXlcblx0XHRcdGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIlxuXG5cdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHR0eXBlOiBPYmplY3Rcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJpbWFnZVwiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2ltYWdlcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXZhdGFyXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXZhdGFycydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF1ZGlvXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXVkaW9zJ1xuXHRcdFx0XHRcdFx0YWNjZXB0OiAnYXVkaW8vKidcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ2aWRlb1wiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ3ZpZGVvcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ3ZpZGVvLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibG9jYXRpb25cIlxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIlxuXHRcdFx0ZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIlxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibWFya2Rvd25cIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGV4dFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICd1cmwnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHQjIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LlVybFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zVXJsJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZW1haWwnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcblx0XHRcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdzdW1tYXJ5J1xuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cblx0XHQjIGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xuXHRcdCMgXHRmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtmaWVsZHM6IHtmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHt0eXBlOiBmaWVsZC5kYXRhX3R5cGV9KX19KVtmaWVsZC5uYW1lXVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAncGVyY2VudCdcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHR1bmxlc3MgXy5pc051bWJlcihmaWVsZC5zY2FsZSlcblx0XHRcdFx0IyDmsqHphY3nva7lsI/mlbDkvY3mlbDliJnmjInlsI/mlbDkvY3mlbAw5p2l5aSE55CG77yM5Y2z6buY6K6k5pi+56S65Li65pW05pWw55qE55m+5YiG5q+U77yM5q+U5aaCMjAl77yM5q2k5pe25o6n5Lu25Y+v5Lul6L6T5YWlMuS9jeWwj+aVsO+8jOi9rOaIkOeZvuWIhuavlOWwseaYr+aVtOaVsFxuXHRcdFx0XHRmaWVsZC5zY2FsZSA9IDBcblx0XHRcdCMgYXV0b2Zvcm3mjqfku7bkuK3lsI/mlbDkvY3mlbDlp4vnu4jmr5TphY3nva7nmoTkvY3mlbDlpJoy5L2NXG5cdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlICsgMlxuXHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlXG5cdFx0XHRmcy50eXBlID0gZmllbGQudHlwZVxuXG5cdFx0aWYgZmllbGQubGFiZWxcblx0XHRcdGZzLmxhYmVsID0gZmllbGQubGFiZWxcblxuI1x0XHRpZiBmaWVsZC5hbGxvd2VkVmFsdWVzXG4jXHRcdFx0ZnMuYWxsb3dlZFZhbHVlcyA9IGZpZWxkLmFsbG93ZWRWYWx1ZXNcblxuXHRcdGlmICFmaWVsZC5yZXF1aXJlZFxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXG5cblx0XHQjIFvnrb7nuqblr7nosaHlkIzml7bphY3nva7kuoZjb21wYW55X2lkc+W/heWhq+WPinVuZWRpdGFibGVfZmllbGRz6YCg5oiQ6YOo5YiG55So5oi35paw5bu6562+57qm5a+56LGh5pe25oql6ZSZICMxOTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9zdGVlZG9zL3N0ZWVkb3MtcHJvamVjdC1kenVnL2lzc3Vlcy8xOTIpXG5cdFx0IyDlkI7lj7Dlp4vnu4jorr7nva5yZXF1aXJlZOS4umZhbHNlXG5cdFx0aWYgIU1ldGVvci5pc0NsaWVudFxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC51bmlxdWVcblx0XHRcdGZzLnVuaXF1ZSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLm9taXRcblx0XHRcdGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5ncm91cFxuXHRcdFx0ZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cFxuXG5cdFx0aWYgZmllbGQuaXNfd2lkZVxuXHRcdFx0ZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmhpZGRlblxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCJcblxuXHRcdGlmIChmaWVsZC50eXBlID09IFwic2VsZWN0XCIpIG9yIChmaWVsZC50eXBlID09IFwibG9va3VwXCIpIG9yIChmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLmZpbHRlcmFibGUpID09ICd1bmRlZmluZWQnXG5cdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXG5cdFx0aWYgZmllbGQubmFtZSA9PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZVxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLnNlYXJjaGFibGUpID09ICd1bmRlZmluZWQnXG5cdFx0XHRcdGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlXG5cblx0XHRpZiBhdXRvZm9ybV90eXBlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZVxuXG5cdFx0aWYgZmllbGQuZGVmYXVsdFZhbHVlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gKCktPlxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHt1c2VySWQ6IE1ldGVvci51c2VySWQoKSwgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCBub3c6IG5ldyBEYXRlKCl9KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdCMgXHRpZiAhXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdCMgXHRcdGZzLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXG5cdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuZGlzYWJsZWRcblx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuaW5saW5lSGVscFRleHRcblx0XHRcdGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHRcblxuXHRcdGlmIGZpZWxkLmJsYWNrYm94XG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcblxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWluJylcblx0XHRcdGZzLm1pbiA9IGZpZWxkLm1pblxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWF4Jylcblx0XHRcdGZzLm1heCA9IGZpZWxkLm1heFxuXG5cdFx0IyDlj6rmnInnlJ/kuqfnjq/looPmiY3ph43lu7rntKLlvJVcblx0XHRpZiBNZXRlb3IuaXNQcm9kdWN0aW9uXG5cdFx0XHRpZiBmaWVsZC5pbmRleFxuXHRcdFx0XHRmcy5pbmRleCA9IGZpZWxkLmluZGV4XG5cdFx0XHRlbHNlIGlmIGZpZWxkLnNvcnRhYmxlXG5cdFx0XHRcdGZzLmluZGV4ID0gdHJ1ZVxuXG5cdFx0c2NoZW1hW2ZpZWxkX25hbWVdID0gZnNcblxuXHRyZXR1cm4gc2NoZW1hXG5cblxuQ3JlYXRvci5nZXRGaWVsZERpc3BsYXlWYWx1ZSA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpLT5cblx0aHRtbCA9IGZpZWxkX3ZhbHVlXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuIFwiXCJcblx0ZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpXG5cdGlmICFmaWVsZFxuXHRcdHJldHVybiBcIlwiXG5cblx0aWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpXG5cdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxuXHRcdGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG5cblx0cmV0dXJuIGh0bWxcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSAoZmllbGRfdHlwZSktPlxuXHRyZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwidGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpLT5cblx0YnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSlcblx0aWYgYnVpbHRpblZhbHVlc1xuXHRcdF8uZm9yRWFjaCBidWlsdGluVmFsdWVzLCAoYnVpbHRpbkl0ZW0sIGtleSktPlxuXHRcdFx0b3BlcmF0aW9ucy5wdXNoKHtsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsIHZhbHVlOiBrZXl9KVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpLT5cblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSAoZmllbGRfdHlwZSwgdmFsdWUpLT5cblx0IyDmoLnmja7ov4fmu6TlmajnmoTov4fmu6TlgLzvvIzojrflj5blr7nlupTnmoTlhoXnva7ov5DnrpfnrKZcblx0IyDmr5TlpoJ2YWx1ZeS4umxhc3RfeWVhcu+8jOi/lOWbnmJldHdlZW5fdGltZV9sYXN0X3llYXJcblx0dW5sZXNzIF8uaXNTdHJpbmcodmFsdWUpXG5cdFx0cmV0dXJuXG5cdGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxuXHR1bmxlc3MgYmV0d2VlbkJ1aWx0aW5WYWx1ZXNcblx0XHRyZXR1cm5cblx0cmVzdWx0ID0gbnVsbFxuXHRfLmVhY2ggYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIChpdGVtLCBvcGVyYXRpb24pLT5cblx0XHRpZiBpdGVtLmtleSA9PSB2YWx1ZVxuXHRcdFx0cmVzdWx0ID0gb3BlcmF0aW9uXG5cdHJldHVybiByZXN1bHRcblxuIyDlpoLmnpzlj6rmmK/kuLrliKTmlq1vcGVyYXRpb27mmK/lkKblrZjlnKjvvIzliJnmsqHlv4XopoHorqHnrpd2YWx1ZXPvvIzkvKDlhaVpc19jaGVja19vbmx55Li6dHJ1ZeWNs+WPr1xuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSAoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSktPlxuXHQjIOi/h+a7pOWZqOaXtumXtOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRyZXR1cm4ge1xuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuXHR9XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSAobW9udGgpLT5cblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHJldHVybiAwXG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0cmV0dXJuIDNcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRyZXR1cm4gNlxuXHRcblx0cmV0dXJuIDlcblxuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHllYXItLVxuXHRcdG1vbnRoID0gOVxuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdG1vbnRoID0gMFxuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdG1vbnRoID0gM1xuXHRlbHNlIFxuXHRcdG1vbnRoID0gNlxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gKHllYXIsbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHRtb250aCA9IDNcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRtb250aCA9IDZcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRtb250aCA9IDlcblx0ZWxzZVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoID0gMFxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmIG1vbnRoID09IDExXG5cdFx0cmV0dXJuIDMxXG5cdFxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcblx0c3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCsxLCAxKVxuXHRkYXlzID0gKGVuZERhdGUtc3RhcnREYXRlKS9taWxsaXNlY29uZFxuXHRyZXR1cm4gZGF5c1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gKHllYXIsIG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0IyDmnIjku73kuLow5Luj6KGo5pys5bm055qE56ys5LiA5pyIXG5cdGlmIG1vbnRoID09IDBcblx0XHRtb250aCA9IDExXG5cdFx0eWVhci0tXG5cdFx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblx0IyDlkKbliJks5Y+q5YeP5Y675pyI5Lu9XG5cdG1vbnRoLS07XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cblx0IyDov4fmu6TlmahiZXR3ZWVu6L+Q566X56ym77yM546w566X5pel5pyfL+aXpeacn+aXtumXtOexu+Wei+Wtl+auteeahHZhbHVlc+WAvFxuXHRub3cgPSBuZXcgRGF0ZSgpXG5cdCMg5LiA5aSp55qE5q+r56eS5pWwXG5cdG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNFxuXHR5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHR0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcblx0IyDkuIDlkajkuK3nmoTmn5DkuIDlpKlcblx0d2VlayA9IG5vdy5nZXREYXkoKVxuXHQjIOWHj+WOu+eahOWkqeaVsFxuXHRtaW51c0RheSA9IGlmIHdlZWsgIT0gMCB0aGVuIHdlZWsgLSAxIGVsc2UgNlxuXHRtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKVxuXHRzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg5LiK5ZGo5pelXG5cdGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5LiK5ZGo5LiAXG5cdGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKVxuXHQjIOS4i+WRqOS4gFxuXHRuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxuXHQjIOS4i+WRqOaXpVxuXHRuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSlcblx0Y3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDFcblx0bmV4dFllYXIgPSBjdXJyZW50WWVhciArIDFcblx0IyDlvZPliY3mnIjku71cblx0Y3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDorqHmlbDlubTjgIHmnIhcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG5cdG1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDmnKzmnIjnrKzkuIDlpKlcblx0Zmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixjdXJyZW50TW9udGgsMSlcblxuXHQjIOW9k+S4ujEy5pyI55qE5pe25YCZ5bm05Lu96ZyA6KaB5YqgMVxuXHQjIOaciOS7vemcgOimgeabtOaWsOS4ujAg5Lmf5bCx5piv5LiL5LiA5bm055qE56ys5LiA5Liq5pyIXG5cdGlmIGN1cnJlbnRNb250aCA9PSAxMVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoKytcblx0ZWxzZVxuXHRcdG1vbnRoKytcblx0XG5cdCMg5LiL5pyI56ys5LiA5aSpXG5cdG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdCMg5LiL5pyI5pyA5ZCO5LiA5aSpXG5cdG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhcixtb250aCxDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLG1vbnRoKSlcblx0IyDmnKzmnIjmnIDlkI7kuIDlpKlcblx0bGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOS4iuaciOesrOS4gOWkqVxuXHRsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4iuaciOacgOWQjuS4gOWkqVxuXHRsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOacrOWto+W6puW8gOWni+aXpVxuXHR0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLDEpXG5cdCMg5pys5a2j5bqm57uT5p2f5pelXG5cdHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIsQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIpKVxuXHQjIOS4iuWto+W6puW8gOWni+aXpVxuXHRsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIrlraPluqbnu5PmnZ/ml6Vcblx0bGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcblx0IyDkuIvlraPluqblvIDlp4vml6Vcblx0bmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiL5a2j5bqm57uT5p2f5pelXG5cdG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMikpXG5cdCMg6L+H5Y67N+WkqSBcblx0bGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MzDlpKlcblx0bGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrs2MOWkqVxuXHRsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzkw5aSpXG5cdGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MTIw5aSpXG5cdGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU35aSpIFxuXHRuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUzMOWkqVxuXHRuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTYw5aSpXG5cdG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lOTDlpKlcblx0bmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUxMjDlpKlcblx0bmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKVxuXG5cdHN3aXRjaCBrZXlcblx0XHR3aGVuIFwibGFzdF95ZWFyXCJcblx0XHRcdCPljrvlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7cHJldmlvdXNZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc195ZWFyXCJcblx0XHRcdCPku4rlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfeWVhclwiXG5cdFx0XHQj5piO5bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4iuWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3F1YXJ0ZXJcIlxuXHRcdFx0I+acrOWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4i+Wto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X21vbnRoXCJcblx0XHRcdCPkuIrmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX21vbnRoXCJcblx0XHRcdCPmnKzmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfbW9udGhcIlxuXHRcdFx0I+S4i+aciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3Rfd2Vla1wiXG5cdFx0XHQj5LiK5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc193ZWVrXCJcblx0XHRcdCPmnKzlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF93ZWVrXCJcblx0XHRcdCPkuIvlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ5ZXN0ZGF5XCJcblx0XHRcdCPmmKjlpKlcblx0XHRcdHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0b2RheVwiXG5cdFx0XHQj5LuK5aSpXG5cdFx0XHRzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidG9tb3Jyb3dcIlxuXHRcdFx0I+aYjuWkqVxuXHRcdFx0c3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF83X2RheXNcIlxuXHRcdFx0I+i/h+WOuzflpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIFxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8zMF9kYXlzXCJcblx0XHRcdCPov4fljrszMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF82MF9kYXlzXCJcblx0XHRcdCPov4fljrs2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF85MF9kYXlzXCJcblx0XHRcdCPov4fljrs5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8xMjBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67MTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfN19kYXlzXCJcblx0XHRcdCPmnKrmnaU35aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8zMF9kYXlzXCJcblx0XHRcdCPmnKrmnaUzMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF82MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF85MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8xMjBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lMTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFxuXHR2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdXG5cdGlmIGZpZWxkX3R5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0IyDml7bpl7TnsbvlnovlrZfmrrXvvIzlhoXnva7ml7bpl7TojIPlm7TlupTor6XogIPomZHlgY/np7vml7bljLrlgLzvvIzlkKbliJnov4fmu6TmlbDmja7lrZjlnKjlgY/lt65cblx0XHQjIOmdnuWGhee9ruaXtumXtOiMg+WbtOaXtu+8jOeUqOaIt+mAmui/h+aXtumXtOaOp+S7tumAieaLqeeahOiMg+WbtO+8jOS8muiHquWKqOWkhOeQhuaXtuWMuuWBj+W3ruaDheWGtVxuXHRcdCMg5pel5pyf57G75Z6L5a2X5q6177yM5pWw5o2u5bqT5pys5p2l5bCx5a2Y55qE5pivVVRD55qEMOeCue+8jOS4jeWtmOWcqOWBj+W3rlxuXHRcdF8uZm9yRWFjaCB2YWx1ZXMsIChmdiktPlxuXHRcdFx0aWYgZnZcblx0XHRcdFx0ZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCApXG5cdFxuXHRyZXR1cm4ge1xuXHRcdGxhYmVsOiBsYWJlbFxuXHRcdGtleToga2V5XG5cdFx0dmFsdWVzOiB2YWx1ZXNcblx0fVxuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKS0+XG5cdGlmIGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gJ2JldHdlZW4nXG5cdGVsc2UgaWYgW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiAnY29udGFpbnMnXG5cdGVsc2Vcblx0XHRyZXR1cm4gXCI9XCJcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKSAtPlxuXHQjIOaXpeacn+exu+WeizogZGF0ZSwgZGF0ZXRpbWUgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOaWh+acrOexu+WeizogdGV4dCwgdGV4dGFyZWEsIGh0bWwgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIsIFwic3RhcnRzd2l0aFwiXG5cdCMg6YCJ5oup57G75Z6LOiBsb29rdXAsIG1hc3Rlcl9kZXRhaWwsIHNlbGVjdCDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblx0IyDmlbDlgLznsbvlnos6IGN1cnJlbmN5LCBudW1iZXIgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOW4g+WwlOexu+WeizogYm9vbGVhbiAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cdCMg5pWw57uE57G75Z6LOiBjaGVja2JveCwgW3RleHRdICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblxuXHRvcHRpb25hbHMgPSB7XG5cdFx0ZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSwgdmFsdWU6IFwiPVwifSxcblx0XHR1bmVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSwgdmFsdWU6IFwiPD5cIn0sXG5cdFx0bGVzc190aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLCB2YWx1ZTogXCI8XCJ9LFxuXHRcdGdyZWF0ZXJfdGhhbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSwgdmFsdWU6IFwiPlwifSxcblx0XHRsZXNzX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPD1cIn0sXG5cdFx0Z3JlYXRlcl9vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksIHZhbHVlOiBcIj49XCJ9LFxuXHRcdGNvbnRhaW5zOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksIHZhbHVlOiBcImNvbnRhaW5zXCJ9LFxuXHRcdG5vdF9jb250YWluOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSwgdmFsdWU6IFwibm90Y29udGFpbnNcIn0sXG5cdFx0c3RhcnRzX3dpdGg6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSwgdmFsdWU6IFwic3RhcnRzd2l0aFwifSxcblx0XHRiZXR3ZWVuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSwgdmFsdWU6IFwiYmV0d2VlblwifSxcblx0fVxuXG5cdGlmIGZpZWxkX3R5cGUgPT0gdW5kZWZpbmVkXG5cdFx0cmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscylcblxuXHRvcGVyYXRpb25zID0gW11cblxuXHRpZiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbilcblx0XHRDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGRfdHlwZSA9PSBcInRleHRhcmVhXCIgb3IgZmllbGRfdHlwZSA9PSBcImh0bWxcIiBvciBmaWVsZF90eXBlID09IFwiY29kZVwiXG4jXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMuY29udGFpbnMsIG9wdGlvbmFscy5ub3RfY29udGFpbiwgb3B0aW9uYWxzLnN0YXJ0c193aXRoKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgb3IgZmllbGRfdHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImN1cnJlbmN5XCIgb3IgZmllbGRfdHlwZSA9PSBcIm51bWJlclwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiYm9vbGVhblwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiW3RleHRdXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXG5cdHJldHVybiBvcGVyYXRpb25zXG5cbiMjI1xuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuIyMjXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSAob2JqZWN0X25hbWUpLT5cblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcblx0ZmllbGRzQXJyID0gW11cblxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQpLT5cblx0XHRmaWVsZHNBcnIucHVzaCB7bmFtZTogZmllbGQubmFtZSwgc29ydF9ubzogZmllbGQuc29ydF9ub31cblxuXHRmaWVsZHNOYW1lID0gW11cblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cblx0XHRmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSlcblx0cmV0dXJuIGZpZWxkc05hbWVcbiIsIkNyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyA9IGZ1bmN0aW9uKGZpZWxkU2NoZW1hKSB7XG4gIHZhciBkYXRhX3R5cGUsIG9wdGlvbnM7XG4gIG9wdGlvbnMgPSBmaWVsZFNjaGVtYS5vcHRpb25zO1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGF0YV90eXBlID0gZmllbGRTY2hlbWEuZGF0YV90eXBlO1xuICBpZiAoIV8uaXNGdW5jdGlvbihvcHRpb25zKSAmJiBkYXRhX3R5cGUgJiYgZGF0YV90eXBlICE9PSAndGV4dCcpIHtcbiAgICBvcHRpb25zLmZvckVhY2goZnVuY3Rpb24ob3B0aW9uSXRlbSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25JdGVtLnZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoWydudW1iZXInLCAnY3VycmVuY3knLCAncGVyY2VudCddLmluZGV4T2YoZGF0YV90eXBlKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25JdGVtLnZhbHVlID0gTnVtYmVyKG9wdGlvbkl0ZW0udmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhX3R5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gb3B0aW9uSXRlbS52YWx1ZSA9IG9wdGlvbkl0ZW0udmFsdWUgPT09ICd0cnVlJztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBmaWVsZHNBcnIsIHNjaGVtYTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc2NoZW1hID0ge307XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2gob2JqLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoIV8uaGFzKGZpZWxkLCBcIm5hbWVcIikpIHtcbiAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goZmllbGQpO1xuICB9KTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHZhciBfb2JqZWN0LCBfcmVmX29iaiwgX3JlZmVyZW5jZV90bywgYXV0b2Zvcm1fdHlwZSwgY29sbGVjdGlvbk5hbWUsIGZpZWxkX25hbWUsIGZzLCBmc1R5cGUsIGlzVW5MaW1pdGVkLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxLCByZWYyLCByZWYzO1xuICAgIGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lO1xuICAgIGZzID0ge307XG4gICAgaWYgKGZpZWxkLnJlZ0V4KSB7XG4gICAgICBmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4O1xuICAgIH1cbiAgICBmcy5hdXRvZm9ybSA9IHt9O1xuICAgIGZzLmF1dG9mb3JtLm11bHRpcGxlID0gZmllbGQubXVsdGlwbGU7XG4gICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgIGF1dG9mb3JtX3R5cGUgPSAocmVmID0gZmllbGQuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMDtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJwaG9uZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbdGV4dF1cIiB8fCBmaWVsZC50eXBlID09PSBcIltwaG9uZV1cIikge1xuICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2NvZGUnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyO1xuICAgICAgaWYgKGZpZWxkLmxhbmd1YWdlKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmxhbmd1YWdlID0gZmllbGQubGFuZ3VhZ2U7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicGFzc3dvcmRcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIixcbiAgICAgICAgICAgICAgICBwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgICBkYXRlTW9iaWxlT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiBcInRpbWVcIixcbiAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwiSEg6bW1cIlxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCIsXG4gICAgICAgICAgICAgICAgcGlja2VyVHlwZTogXCJyb2xsZXJzXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zSHRtbCc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmaWVsZC5zaG93SWNvbjtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICB9XG4gICAgICBpZiAoIWZpZWxkLmhpZGRlbikge1xuICAgICAgICBmcy5hdXRvZm9ybS5maWx0ZXJzID0gZmllbGQuZmlsdGVycztcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb247XG4gICAgICAgIGlmIChmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgZnMuZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uID8gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIDogQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnM7XG4gICAgICAgIGlmIChmaWVsZC5vcHRpb25zRnVuY3Rpb24pIHtcbiAgICAgICAgICBmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90bykge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgX3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgICAgICBpZiAoX3JlZl9vYmogIT0gbnVsbCA/IChyZWYxID0gX3JlZl9vYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYxLmFsbG93Q3JlYXRlIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihsb29rdXBfZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy5cIiArIChDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgZm9ybUlkOiBcIm5ld1wiICsgKGZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywgJ18nKSksXG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IFwiXCIgKyBmaWVsZC5yZWZlcmVuY2VfdG8sXG4gICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImluc2VydFwiLFxuICAgICAgICAgICAgICAgICAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24ob3BlcmF0aW9uLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZXN1bHQub2JqZWN0X25hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IHJlc3VsdC52YWx1ZS5pY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQudmFsdWUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSkpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9zb3J0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX2xpbWl0KSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTGltaXQgPSBmaWVsZC5yZWZlcmVuY2VfbGltaXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZVRvRmllbGQgPSBmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwidXNlcnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMiA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjIuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwib3JnYW5pemF0aW9uc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RvcmdcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gKHJlZjMgPSBvYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYzLmdldCgpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KF9yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgICAgICAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub2JqZWN0U3dpdGNoZSA9IHRydWU7XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFtTdHJpbmddLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV90b1swXV07XG4gICAgICAgICAgICBpZiAoX29iamVjdCAmJiBfb2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFRyZWVcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2QgPSBmaWVsZC5vcHRpb25zTWV0aG9kIHx8IFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiO1xuICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZFBhcmFtcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvLmZvckVhY2goZnVuY3Rpb24oX3JlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlXTtcbiAgICAgICAgICAgICAgICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5sYWJlbCA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBpY29uOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0Lmljb24gOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIvYXBwL1wiICsgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkgKyBcIi9cIiArIF9yZWZlcmVuY2UgKyBcIi92aWV3L1wiO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0SWNvbiA9IGZpZWxkLmRlZmF1bHRJY29uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmYWxzZTtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RcIjtcbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICAgIGlmIChfLmhhcyhmaWVsZCwgJ2ZpcnN0T3B0aW9uJykpIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IGZpZWxkLmZpcnN0T3B0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZpZWxkLmRhdGFfdHlwZSAmJiBmaWVsZC5kYXRhX3R5cGUgIT09IFwidGV4dFwiKSB7XG4gICAgICAgIGlmIChbXCJudW1iZXJcIiwgXCJjdXJyZW5jeVwiLCBcInBlcmNlbnRcIl0uaW5kZXhPZihmaWVsZC5kYXRhX3R5cGUpID4gLTEpIHtcbiAgICAgICAgICBmc1R5cGUgPSBOdW1iZXI7XG4gICAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZmllbGQuZGF0YV90eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgIGZzVHlwZSA9IEJvb2xlYW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnNUeXBlID0gU3RyaW5nO1xuICAgICAgICB9XG4gICAgICAgIGZzLnR5cGUgPSBmc1R5cGU7XG4gICAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICAgIGZzLnR5cGUgPSBbZnNUeXBlXTtcbiAgICAgICAgfVxuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zKGZpZWxkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiY3VycmVuY3lcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApICE9PSAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gMjtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidG9nZ2xlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBCb29sZWFuO1xuICAgICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi10b2dnbGVcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicmVmZXJlbmNlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdC1jaGVja2JveFwiO1xuICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVcIikge1xuICAgICAgY29sbGVjdGlvbk5hbWUgPSBmaWVsZC5jb2xsZWN0aW9uIHx8IFwiZmlsZXNcIjtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWVcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gY29sbGVjdGlvbk5hbWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImZpbGVzaXplXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZ3JpZFwiKSB7XG4gICAgICBmcy50eXBlID0gQXJyYXk7XG4gICAgICBmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWU7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiO1xuICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2ltYWdlcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdmF0YXJcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXZhdGFycycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdpbWFnZS8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXVkaW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2F1ZGlvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInZpZGVvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ3ZpZGVvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICd2aWRlby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb2NhdGlvblwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIjtcbiAgICAgIGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCI7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0ZXh0XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAndXJsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZW1haWwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWw7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHtcbiAgICAgICAgICAgIHR5cGU6IGZpZWxkLmRhdGFfdHlwZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pW2ZpZWxkLm5hbWVdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICBmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7XG4gICAgICAgICAgICB0eXBlOiBmaWVsZC5kYXRhX3R5cGVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVtmaWVsZC5uYW1lXTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdwZXJjZW50Jykge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmICghXy5pc051bWJlcihmaWVsZC5zY2FsZSkpIHtcbiAgICAgICAgZmllbGQuc2NhbGUgPSAwO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZSArIDI7XG4gICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnMudHlwZSA9IGZpZWxkLnR5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5sYWJlbCkge1xuICAgICAgZnMubGFiZWwgPSBmaWVsZC5sYWJlbDtcbiAgICB9XG4gICAgaWYgKCFmaWVsZC5yZXF1aXJlZCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZnMub3B0aW9uYWwgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQudW5pcXVlKSB7XG4gICAgICBmcy51bmlxdWUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQub21pdCkge1xuICAgICAgZnMuYXV0b2Zvcm0ub21pdCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ncm91cCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlzX3dpZGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaGlkZGVuKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIjtcbiAgICB9XG4gICAgaWYgKChmaWVsZC50eXBlID09PSBcInNlbGVjdFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5maWx0ZXJhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLm5hbWUgPT09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLnNlYXJjaGFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXV0b2Zvcm1fdHlwZSkge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kZWZhdWx0VmFsdWUpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7XG4gICAgICAgICAgICB1c2VySWQ6IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSxcbiAgICAgICAgICAgIG5vdzogbmV3IERhdGUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgIGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRpc2FibGVkKSB7XG4gICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5pbmxpbmVIZWxwVGV4dCkge1xuICAgICAgZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmJsYWNrYm94KSB7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChfLmhhcyhmaWVsZCwgJ21pbicpKSB7XG4gICAgICBmcy5taW4gPSBmaWVsZC5taW47XG4gICAgfVxuICAgIGlmIChfLmhhcyhmaWVsZCwgJ21heCcpKSB7XG4gICAgICBmcy5tYXggPSBmaWVsZC5tYXg7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNQcm9kdWN0aW9uKSB7XG4gICAgICBpZiAoZmllbGQuaW5kZXgpIHtcbiAgICAgICAgZnMuaW5kZXggPSBmaWVsZC5pbmRleDtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGQuc29ydGFibGUpIHtcbiAgICAgICAgZnMuaW5kZXggPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2NoZW1hW2ZpZWxkX25hbWVdID0gZnM7XG4gIH0pO1xuICByZXR1cm4gc2NoZW1hO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERpc3BsYXlWYWx1ZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSkge1xuICB2YXIgZmllbGQsIGh0bWwsIG9iamVjdDtcbiAgaHRtbCA9IGZpZWxkX3ZhbHVlO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpO1xuICBpZiAoIWZpZWxkKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCBIOm1tJyk7XG4gIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgfVxuICByZXR1cm4gaHRtbDtcbn07XG5cbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICByZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwidGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpO1xufTtcblxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBvcGVyYXRpb25zKSB7XG4gIHZhciBidWlsdGluVmFsdWVzO1xuICBidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKGJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm4gXy5mb3JFYWNoKGJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGJ1aWx0aW5JdGVtLCBrZXkpIHtcbiAgICAgIHJldHVybiBvcGVyYXRpb25zLnB1c2goe1xuICAgICAgICBsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsXG4gICAgICAgIHZhbHVlOiBrZXlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIHZhbHVlKSB7XG4gIHZhciBiZXR3ZWVuQnVpbHRpblZhbHVlcywgcmVzdWx0O1xuICBpZiAoIV8uaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKTtcbiAgaWYgKCFiZXR3ZWVuQnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybjtcbiAgfVxuICByZXN1bHQgPSBudWxsO1xuICBfLmVhY2goYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIGZ1bmN0aW9uKGl0ZW0sIG9wZXJhdGlvbikge1xuICAgIGlmIChpdGVtLmtleSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXN1bHQgPSBvcGVyYXRpb247XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gZnVuY3Rpb24oaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSkge1xuICByZXR1cm4ge1xuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuICB9O1xufTtcblxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IGZ1bmN0aW9uKG1vbnRoKSB7XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgcmV0dXJuIDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgcmV0dXJuIDY7XG4gIH1cbiAgcmV0dXJuIDk7XG59O1xuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgeWVhci0tO1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDA7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoID0gNjtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICBtb250aCA9IDY7XG4gIH0gZWxzZSBpZiAobW9udGggPCA5KSB7XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2Uge1xuICAgIHllYXIrKztcbiAgICBtb250aCA9IDA7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgdmFyIGRheXMsIGVuZERhdGUsIG1pbGxpc2Vjb25kLCBzdGFydERhdGU7XG4gIGlmIChtb250aCA9PT0gMTEpIHtcbiAgICByZXR1cm4gMzE7XG4gIH1cbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICBzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDEpO1xuICBkYXlzID0gKGVuZERhdGUgLSBzdGFydERhdGUpIC8gbWlsbGlzZWNvbmQ7XG4gIHJldHVybiBkYXlzO1xufTtcblxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA9PT0gMCkge1xuICAgIG1vbnRoID0gMTE7XG4gICAgeWVhci0tO1xuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIH1cbiAgbW9udGgtLTtcbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gZnVuY3Rpb24oZmllbGRfdHlwZSwga2V5KSB7XG4gIHZhciBjdXJyZW50TW9udGgsIGN1cnJlbnRZZWFyLCBlbmRWYWx1ZSwgZmlyc3REYXksIGxhYmVsLCBsYXN0RGF5LCBsYXN0TW9uZGF5LCBsYXN0TW9udGhGaW5hbERheSwgbGFzdE1vbnRoRmlyc3REYXksIGxhc3RRdWFydGVyRW5kRGF5LCBsYXN0UXVhcnRlclN0YXJ0RGF5LCBsYXN0U3VuZGF5LCBsYXN0XzEyMF9kYXlzLCBsYXN0XzMwX2RheXMsIGxhc3RfNjBfZGF5cywgbGFzdF83X2RheXMsIGxhc3RfOTBfZGF5cywgbWlsbGlzZWNvbmQsIG1pbnVzRGF5LCBtb25kYXksIG1vbnRoLCBuZXh0TW9uZGF5LCBuZXh0TW9udGhGaW5hbERheSwgbmV4dE1vbnRoRmlyc3REYXksIG5leHRRdWFydGVyRW5kRGF5LCBuZXh0UXVhcnRlclN0YXJ0RGF5LCBuZXh0U3VuZGF5LCBuZXh0WWVhciwgbmV4dF8xMjBfZGF5cywgbmV4dF8zMF9kYXlzLCBuZXh0XzYwX2RheXMsIG5leHRfN19kYXlzLCBuZXh0XzkwX2RheXMsIG5vdywgcHJldmlvdXNZZWFyLCBzdGFydFZhbHVlLCBzdHJFbmREYXksIHN0ckZpcnN0RGF5LCBzdHJMYXN0RGF5LCBzdHJNb25kYXksIHN0clN0YXJ0RGF5LCBzdHJTdW5kYXksIHN0clRvZGF5LCBzdHJUb21vcnJvdywgc3RyWWVzdGRheSwgc3VuZGF5LCB0aGlzUXVhcnRlckVuZERheSwgdGhpc1F1YXJ0ZXJTdGFydERheSwgdG9tb3Jyb3csIHZhbHVlcywgd2VlaywgeWVhciwgeWVzdGRheTtcbiAgbm93ID0gbmV3IERhdGUoKTtcbiAgbWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICB5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdG9tb3Jyb3cgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICB3ZWVrID0gbm93LmdldERheSgpO1xuICBtaW51c0RheSA9IHdlZWsgIT09IDAgPyB3ZWVrIC0gMSA6IDY7XG4gIG1vbmRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAobWludXNEYXkgKiBtaWxsaXNlY29uZCkpO1xuICBzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpO1xuICBuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgbmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpO1xuICBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDE7XG4gIG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxO1xuICBjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICBtb250aCA9IG5vdy5nZXRNb250aCgpO1xuICBmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIDEpO1xuICBpZiAoY3VycmVudE1vbnRoID09PSAxMSkge1xuICAgIHllYXIrKztcbiAgICBtb250aCsrO1xuICB9IGVsc2Uge1xuICAgIG1vbnRoKys7XG4gIH1cbiAgbmV4dE1vbnRoRmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG4gIG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsIG1vbnRoKSk7XG4gIGxhc3REYXkgPSBuZXcgRGF0ZShuZXh0TW9udGhGaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb250aEZpcnN0RGF5ID0gQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLCAxKTtcbiAgdGhpc1F1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIpKTtcbiAgbGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBuZXh0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIGxhc3RfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2UgXCJsYXN0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc19tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChsYXN0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF93ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0clN1bmRheSA9IG1vbWVudChuZXh0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInllc3RkYXlcIjpcbiAgICAgIHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3llc3RkYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyWWVzdGRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b2RheVwiOlxuICAgICAgc3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvbW9ycm93XCI6XG4gICAgICBzdHJUb21vcnJvdyA9IG1vbWVudCh0b21vcnJvdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzdfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzMwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzYwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzkwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0XzEyMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyU3RhcnREYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckVuZERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgfVxuICB2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdO1xuICBpZiAoZmllbGRfdHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgXy5mb3JFYWNoKHZhbHVlcywgZnVuY3Rpb24oZnYpIHtcbiAgICAgIGlmIChmdikge1xuICAgICAgICByZXR1cm4gZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBsYWJlbDogbGFiZWwsXG4gICAga2V5OiBrZXksXG4gICAgdmFsdWVzOiB2YWx1ZXNcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICBpZiAoZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnYmV0d2Vlbic7XG4gIH0gZWxzZSBpZiAoW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiAnY29udGFpbnMnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIj1cIjtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgdmFyIG9wZXJhdGlvbnMsIG9wdGlvbmFscztcbiAgb3B0aW9uYWxzID0ge1xuICAgIGVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj1cIlxuICAgIH0sXG4gICAgdW5lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw+XCJcbiAgICB9LFxuICAgIGxlc3NfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPFwiXG4gICAgfSxcbiAgICBncmVhdGVyX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIj5cIlxuICAgIH0sXG4gICAgbGVzc19vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIjw9XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI+PVwiXG4gICAgfSxcbiAgICBjb250YWluczoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksXG4gICAgICB2YWx1ZTogXCJjb250YWluc1wiXG4gICAgfSxcbiAgICBub3RfY29udGFpbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSxcbiAgICAgIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJcbiAgICB9LFxuICAgIHN0YXJ0c193aXRoOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSxcbiAgICAgIHZhbHVlOiBcInN0YXJ0c3dpdGhcIlxuICAgIH0sXG4gICAgYmV0d2Vlbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSxcbiAgICAgIHZhbHVlOiBcImJldHdlZW5cIlxuICAgIH1cbiAgfTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpO1xuICB9XG4gIG9wZXJhdGlvbnMgPSBbXTtcbiAgaWYgKENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKTtcbiAgICBDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcInRleHRcIiB8fCBmaWVsZF90eXBlID09PSBcInRleHRhcmVhXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJodG1sXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJjb2RlXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImxvb2t1cFwiIHx8IGZpZWxkX3R5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjdXJyZW5jeVwiIHx8IGZpZWxkX3R5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImNoZWNrYm94XCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJbdGV4dF1cIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH1cbiAgcmV0dXJuIG9wZXJhdGlvbnM7XG59O1xuXG5cbi8qXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXG4gICAg5YaN5bCG5rKh5pyJ5o6S5bqP5Y+355qE5pi+56S65ZyoXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGZpZWxkcywgZmllbGRzQXJyLCBmaWVsZHNOYW1lLCByZWY7XG4gIGZpZWxkcyA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuZmllbGRzIDogdm9pZCAwO1xuICBmaWVsZHNBcnIgPSBbXTtcbiAgXy5lYWNoKGZpZWxkcywgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goe1xuICAgICAgbmFtZTogZmllbGQubmFtZSxcbiAgICAgIHNvcnRfbm86IGZpZWxkLnNvcnRfbm9cbiAgICB9KTtcbiAgfSk7XG4gIGZpZWxkc05hbWUgPSBbXTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gZmllbGRzTmFtZTtcbn07XG4iLCJDcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge31cblxuaW5pdFRyaWdnZXIgPSAob2JqZWN0X25hbWUsIHRyaWdnZXIpLT5cblx0dHJ5XG5cdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSlcblx0XHRpZiAhdHJpZ2dlci50b2RvXG5cdFx0XHRyZXR1cm5cblx0XHR0b2RvV3JhcHBlciA9ICgpLT5cblx0XHRcdCAgdGhpcy5vYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lXG5cdFx0XHQgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuXHRcdGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS5pbnNlcnRcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy5pbnNlcnQodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS51cGRhdGVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy51cGRhdGUodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImJlZm9yZS5yZW1vdmVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYmVmb3JlPy5yZW1vdmUodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLmluc2VydFwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci51cGRhdGVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/LnVwZGF0ZSh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIucmVtb3ZlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy5yZW1vdmUodG9kb1dyYXBwZXIpXG5cdGNhdGNoIGVycm9yXG5cdFx0Y29uc29sZS5lcnJvcignaW5pdFRyaWdnZXIgZXJyb3InLCBlcnJvcilcblxuY2xlYW5UcmlnZ2VyID0gKG9iamVjdF9uYW1lKS0+XG5cdCMjI1xuICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXG4gICAgXHTlm6DkuLrkuIDkuKrmlbDnu4TlhYPntKDliKDpmaTlkI7vvIzlhbbku5blhYPntKDnmoTkuIvmoIfkvJrlj5HnlJ/lj5jljJZcblx0IyMjXG4gICAgI1RPRE8g55Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsGJ1Z1xuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXT8ucmV2ZXJzZSgpLmZvckVhY2ggKF9ob29rKS0+XG5cdFx0X2hvb2sucmVtb3ZlKClcblxuQ3JlYXRvci5pbml0VHJpZ2dlcnMgPSAob2JqZWN0X25hbWUpLT5cbiNcdGNvbnNvbGUubG9nKCdDcmVhdG9yLmluaXRUcmlnZ2VycyBvYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKVxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpXG5cblx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0gPSBbXVxuXG5cdF8uZWFjaCBvYmoudHJpZ2dlcnMsICh0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpLT5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgYW5kIHRyaWdnZXIub24gPT0gXCJzZXJ2ZXJcIiBhbmQgdHJpZ2dlci50b2RvIGFuZCB0cmlnZ2VyLndoZW5cblx0XHRcdF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlciBvYmplY3RfbmFtZSwgdHJpZ2dlclxuXHRcdFx0aWYgX3RyaWdnZXJfaG9va1xuXHRcdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcblx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaykiLCJ2YXIgY2xlYW5UcmlnZ2VyLCBpbml0VHJpZ2dlcjtcblxuQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9O1xuXG5pbml0VHJpZ2dlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB0cmlnZ2VyKSB7XG4gIHZhciBjb2xsZWN0aW9uLCBlcnJvciwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCB0b2RvV3JhcHBlcjtcbiAgdHJ5IHtcbiAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIXRyaWdnZXIudG9kbykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0b2RvV3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lO1xuICAgICAgcmV0dXJuIHRyaWdnZXIudG9kby5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUuaW5zZXJ0XCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYuaW5zZXJ0KHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUudXBkYXRlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMSA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmMS51cGRhdGUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYyID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYyLnJlbW92ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIuaW5zZXJ0XCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMyA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWYzLmluc2VydCh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIudXBkYXRlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmNCA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWY0LnVwZGF0ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYWZ0ZXIucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmNSA9IGNvbGxlY3Rpb24uYWZ0ZXIpICE9IG51bGwgPyByZWY1LnJlbW92ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICBlcnJvciA9IGVycm9yMTtcbiAgICByZXR1cm4gY29uc29sZS5lcnJvcignaW5pdFRyaWdnZXIgZXJyb3InLCBlcnJvcik7XG4gIH1cbn07XG5cbmNsZWFuVHJpZ2dlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG5cbiAgLypcbiAgICAgXHTnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWw5piv5L2/55So5LiL5qCH5Yig6Zmk5a+56LGh55qE77yM5omA5Lul5q2k5aSE5Y+N6L2saG9va3Ppm4blkIjlkI7vvIzlho3liKDpmaRcbiAgICAgXHTlm6DkuLrkuIDkuKrmlbDnu4TlhYPntKDliKDpmaTlkI7vvIzlhbbku5blhYPntKDnmoTkuIvmoIfkvJrlj5HnlJ/lj5jljJZcbiAgICovXG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0pICE9IG51bGwgPyByZWYucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24oX2hvb2spIHtcbiAgICByZXR1cm4gX2hvb2sucmVtb3ZlKCk7XG4gIH0pIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pbml0VHJpZ2dlcnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgb2JqO1xuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW107XG4gIHJldHVybiBfLmVhY2gob2JqLnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCB0cmlnZ2VyX25hbWUpIHtcbiAgICB2YXIgX3RyaWdnZXJfaG9vaztcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIGlmIChfdHJpZ2dlcl9ob29rKSB7XG4gICAgICAgIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vayk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgcmV0dXJuIENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vayk7XG4gICAgfVxuICB9KTtcbn07XG4iLCJjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJylcblxuYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiYWxsb3dDcmVhdGVcIiwgXCJhbGxvd0RlbGV0ZVwiLCBcImFsbG93RWRpdFwiLCBcImFsbG93UmVhZFwiLCBcIm1vZGlmeUFsbFJlY29yZHNcIiwgXCJ2aWV3QWxsUmVjb3Jkc1wiLCBcIm1vZGlmeUNvbXBhbnlSZWNvcmRzXCIsIFwidmlld0NvbXBhbnlSZWNvcmRzXCIsIFxuXHRcImFsbG93UmVhZEZpbGVzXCIsIFwiYWxsb3dFZGl0RmlsZXNcIiwgXCJhbGxvd0NyZWF0ZUZpbGVzXCIsIFwiYWxsb3dEZWxldGVGaWxlc1wiLCBcInZpZXdBbGxGaWxlc1wiLCBcIm1vZGlmeUFsbEZpbGVzXCJdIFxub3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiZGlzYWJsZWRfbGlzdF92aWV3c1wiLCBcImRpc2FibGVkX2FjdGlvbnNcIiwgXCJ1bnJlYWRhYmxlX2ZpZWxkc1wiLCBcInVuZWRpdGFibGVfZmllbGRzXCIsIFwidW5yZWxhdGVkX29iamVjdHNcIiwgXCJ1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFwiXVxucGVybWlzc2lvblByb3BOYW1lcyA9IF8udW5pb24gYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzLCBvdGhlclBlcm1pc3Npb25Qcm9wTmFtZXNcblxuQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgIW9ialxuXHRcdFx0cmV0dXJuXG5cdFx0cmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKVxuXHRlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSwgcmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpLT5cblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRpZiAhc3BhY2VJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcblx0IyDpmYTku7bmnYPpmZDkuI3lho3kuI7lhbbniLborrDlvZXnvJbovpHphY3nva7lhbPogZRcblx0IyBpZiByZWNvcmQgYW5kIG9iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCIgYW5kIE1ldGVvci5pc0NsaWVudFxuXHQjIFx0IyDlpoLmnpzmmK9jbXNfZmlsZXPpmYTku7bvvIzliJnmnYPpmZDlj5blhbbniLborrDlvZXmnYPpmZBcblx0IyBcdGlmIG9iamVjdF9uYW1lID09IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpXG5cdCMgXHRcdCMg5b2T5YmN5aSE5LqOY21zX2ZpbGVz6ZmE5Lu26K+m57uG55WM6Z2iXG5cdCMgXHRcdG9iamVjdF9uYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG5cdCMgXHRcdHJlY29yZF9pZCA9IHJlY29yZC5wYXJlbnQuX2lkO1xuXHQjIFx0ZWxzZSBcblx0IyBcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bnmoTniLborrDlvZXnlYzpnaJcblx0IyBcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKTtcblx0IyBcdFx0cmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG5cdCMgXHRvYmplY3RfZmllbGRzX2tleXMgPSBfLmtleXMoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpPy5maWVsZHMgb3Ige30pIHx8IFtdO1xuXHQjIFx0c2VsZWN0ID0gXy5pbnRlcnNlY3Rpb24ob2JqZWN0X2ZpZWxkc19rZXlzLCBbJ293bmVyJywgJ2NvbXBhbnlfaWQnLCAnY29tcGFueV9pZHMnLCAnbG9ja2VkJ10pIHx8IFtdO1xuXHQjIFx0aWYgc2VsZWN0Lmxlbmd0aCA+IDBcblx0IyBcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgc2VsZWN0LmpvaW4oJywnKSk7XG5cdCMgXHRlbHNlXG5cdCMgXHRcdHJlY29yZCA9IG51bGw7XG5cblx0cGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpXG5cblx0aWYgcmVjb3JkXG5cdFx0aWYgIV8uaXNFbXB0eShyZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zKVxuXHRcdFx0cmV0dXJuIHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnNcblxuXHRcdGlzT3duZXIgPSByZWNvcmQub3duZXIgPT0gdXNlcklkIHx8IHJlY29yZC5vd25lcj8uX2lkID09IHVzZXJJZFxuXG5cdFx0aWYgb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0IyDpmYTku7bnmoTmn6XnnIvmiYDmnInkv67mlLnmiYDmnInmnYPpmZDkuI7pmYTku7blr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+OAgW1vZGlmeUFsbFJlY29yZHPml6DlhbPvvIzlj6rkuI7lhbbkuLvooajorrDlvZXnmoR2aWV3QWxsRmlsZXPlkoxtb2RpZnlBbGxGaWxlc+acieWFs1xuXHRcdFx0IyDlpoLmnpzmmK9jbXNfZmlsZXPpmYTku7bvvIzliJnmnYPpmZDpnIDopoHpop3lpJbogIPomZHlhbbniLblr7nosaHkuIrlhbPkuo7pmYTku7bnmoTmnYPpmZDphY3nva5cblx0XHRcdG1hc3Rlck9iamVjdE5hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcblx0XHRcdG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG1hc3Rlck9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RGVsZXRlRmlsZXNcblx0XHRcdGlmICFtYXN0ZXJSZWNvcmRQZXJtLm1vZGlmeUFsbEZpbGVzIGFuZCAhaXNPd25lclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRGaWxlc1xuXHRcdFx0aWYgIW1hc3RlclJlY29yZFBlcm0udmlld0FsbEZpbGVzIGFuZCAhaXNPd25lclxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZClcblx0XHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkPy5jb21wYW55X2lkXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZCBhbmQgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgYW5kIHJlY29yZF9jb21wYW55X2lkLl9pZFxuXHRcdFx0XHQjIOWboHJlY29yZF9jb21wYW55X2lk5pivbG9va3Vw57G75Z6L77yM5pyJ5Y+v6IO9ZHjmjqfku7bkvJrmiorlroPmmKDlsITovazkuLrlr7nlupTnmoRvYmplY3TvvIzmiYDku6Xov5nph4zlj5blh7rlhbZfaWTlgLxcblx0XHRcdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZD8uY29tcGFueV9pZHNcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCBhbmQgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZHNbMF0pXG5cdFx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWRz5pivbG9va3Vw57G75Z6L77yM5pyJ5Y+v6IO9ZHjmjqfku7bkvJrmiorlroPmmKDlsITovazkuLrlr7nlupTnmoRbb2JqZWN0Xe+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxuXHRcdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmRfY29tcGFueV9pZHMubWFwKChuKS0+IG4uX2lkKVxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gXy51bmlvbihyZWNvcmRfY29tcGFueV9pZHMsIFtyZWNvcmRfY29tcGFueV9pZF0pXG5cdFx0XHRpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRpZiB1c2VyX2NvbXBhbnlfaWRzIGFuZCB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdFx0aWYgIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPkv67mlLlcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6K6w5b2V5pyJY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp++8jOS9huaYr+W9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPkuLrnqbrml7bvvIzorqTkuLrml6DmnYPkv67mlLlcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRcblx0XHRcdGlmIHJlY29yZC5sb2NrZWQgYW5kICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2VcblxuXHRcdFx0aWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxuXHRcdFx0ZWxzZSBpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRpZiB1c2VyX2NvbXBhbnlfaWRzIGFuZCB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdFx0aWYgIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdCMg6K6w5b2V55qEY29tcGFueV9pZC9jb21wYW55X2lkc+WxnuaAp+S4jeWcqOW9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPojIPlm7TlhoXml7bvvIzorqTkuLrml6DmnYPmn6XnnItcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWTlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5p+l55yLXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxuXHRcblx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblxuIyBjdXJyZW50T2JqZWN0TmFtZe+8muW9k+WJjeS4u+WvueixoVxuIyByZWxhdGVkTGlzdEl0ZW3vvJpDcmVhdG9yLmdldFJlbGF0ZWRMaXN0KFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIiksIFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpKeS4reWPlnJlbGF0ZWRfb2JqZWN0X25hbWXlr7nlupTnmoTlgLxcbiMgY3VycmVudFJlY29yZOW9k+WJjeS4u+WvueixoeeahOivpue7huiusOW9lVxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyA9IChjdXJyZW50T2JqZWN0TmFtZSwgcmVsYXRlZExpc3RJdGVtLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpLT5cblx0XHRpZiAhY3VycmVudE9iamVjdE5hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Y3VycmVudE9iamVjdE5hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0XHRpZiAhcmVsYXRlZExpc3RJdGVtXG5cdFx0XHRjb25zb2xlLmVycm9yKFwicmVsYXRlZExpc3RJdGVtIG11c3Qgbm90IGJlIGVtcHR5IGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zXCIpO1xuXHRcdFx0cmV0dXJuIHt9XG5cblx0XHRpZiAhY3VycmVudFJlY29yZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRjdXJyZW50UmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKVxuXG5cdFx0aWYgIXVzZXJJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRcdGlmICFzcGFjZUlkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblxuXHRcdG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zKGN1cnJlbnRPYmplY3ROYW1lLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpXG5cdFx0cmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpXG5cdFx0cmVzdWx0ID0gXy5jbG9uZSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnNcblxuXHRcdGlmIHJlbGF0ZWRMaXN0SXRlbS5pc19maWxlXG5cdFx0XHRyZXN1bHQuYWxsb3dDcmVhdGUgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzXG5cdFx0XHRyZXN1bHQuYWxsb3dFZGl0ID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzXG5cdFx0ZWxzZVxuXHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkTGlzdEl0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfHwgZmFsc2Vcblx0XHRcdG1hc3RlckFsbG93ID0gZmFsc2Vcblx0XHRcdGlmIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09IHRydWVcblx0XHRcdFx0bWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZFxuXHRcdFx0ZWxzZSBpZiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PSBmYWxzZVxuXHRcdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0XG5cblx0XHRcdHVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gQ3JlYXRvci5nZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QoY3VycmVudFJlY29yZCwgY3VycmVudE9iamVjdE5hbWUpXG5cdFx0XHRpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMVxuXG5cdFx0XHRyZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxuXHRcdFx0cmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZVxuXHRcdHJldHVybiByZXN1bHRcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0Q3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyA9IChzcGFjZUlkLCB1c2VySWQpIC0+XG5cdFx0cGVybWlzc2lvbnMgPVxuXHRcdFx0b2JqZWN0czoge31cblx0XHRcdGFzc2lnbmVkX2FwcHM6IFtdXG5cdFx0IyMjXG5cdFx05p2D6ZmQ6ZuG6K+05piOOlxuXHRcdOWGhee9ruadg+mZkOmbhi1hZG1pbix1c2VyLG1lbWJlcixndWVzdCx3b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW5cblx0XHToh6rlrprkuYnmnYPpmZDpm4Yt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ6ZuG5Lul5aSW55qE5YW25LuW5p2D6ZmQ6ZuGXG5cdFx054m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKfkuI3lj6/phY3nva7vvIktYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Rcblx0XHTlj6/phY3nva7nlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+WPr+mFjee9ru+8iS13b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW7ku6Xlj4roh6rlrprkuYnmnYPpmZDpm4Zcblx0XHQjIyNcblxuXHRcdGlzU3BhY2VBZG1pbiA9IGZhbHNlXG5cdFx0c3BhY2VVc2VyID0gbnVsbFxuXHRcdGlmIHVzZXJJZFxuXHRcdFx0aXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cblx0XHRwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblxuXHRcdHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGVsc2Vcblx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblxuXHRcdHBzZXRzQWRtaW5fcG9zID0gbnVsbFxuXHRcdHBzZXRzVXNlcl9wb3MgPSBudWxsXG5cdFx0cHNldHNNZW1iZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzR3Vlc3RfcG9zID0gbnVsbFxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSBudWxsXG5cdFx0cHNldHNTdXBwbGllcl9wb3MgPSBudWxsXG5cdFx0cHNldHNDdXN0b21lcl9wb3MgPSBudWxsXG5cblx0XHRpZiBwc2V0c0FkbWluPy5faWRcblx0XHRcdHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzVXNlcj8uX2lkXG5cdFx0XHRwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNNZW1iZXI/Ll9pZFxuXHRcdFx0cHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c01lbWJlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c0d1ZXN0Py5faWRcblx0XHRcdHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzU3VwcGxpZXI/Ll9pZFxuXHRcdFx0cHNldHNTdXBwbGllcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzU3VwcGxpZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNDdXN0b21lcj8uX2lkXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNDdXN0b21lci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblxuXHRcdGlmIHBzZXRzQ3VycmVudC5sZW5ndGggPiAwXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwiX2lkXCJcblx0XHRcdHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHNldF9pZHN9fSkuZmV0Y2goKVxuXHRcdFx0cHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJuYW1lXCJcblx0XHRwc2V0cyA9IHtcblx0XHRcdHBzZXRzQWRtaW4sIFxuXHRcdFx0cHNldHNVc2VyLCBcblx0XHRcdHBzZXRzQ3VycmVudCwgXG5cdFx0XHRwc2V0c01lbWJlciwgXG5cdFx0XHRwc2V0c0d1ZXN0LFxuXHRcdFx0cHNldHNTdXBwbGllcixcblx0XHRcdHBzZXRzQ3VzdG9tZXIsXG5cdFx0XHRpc1NwYWNlQWRtaW4sXG5cdFx0XHRzcGFjZVVzZXIsIFxuXHRcdFx0cHNldHNBZG1pbl9wb3MsIFxuXHRcdFx0cHNldHNVc2VyX3BvcywgXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MsIFxuXHRcdFx0cHNldHNHdWVzdF9wb3MsXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3Bvcyxcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zLFxuXHRcdFx0cHNldHNDdXJyZW50X3Bvc1xuXHRcdH1cblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcblx0XHRwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzXG5cdFx0X2kgPSAwXG5cdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cblx0XHRcdF9pKytcblx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09IHNwYWNlSWRcblx0XHRcdFx0aWYgIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09ICcwJyB8fCAob2JqZWN0LmluX2RldmVsb3BtZW50ICE9ICcwJyAmJiBpc1NwYWNlQWRtaW4pXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXHR1bmlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdFx0aWYgIWFycmF5XG5cdFx0XHRhcnJheSA9IFtdXG5cdFx0aWYgIW90aGVyXG5cdFx0XHRvdGhlciA9IFtdXG5cdFx0cmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKVxuXG5cdGludGVyc2VjdGlvblBsdXMgPSAoYXJyYXksIG90aGVyKSAtPlxuXHRcdGlmICFhcnJheSBhbmQgIW90aGVyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdFx0aWYgIWFycmF5XG5cdFx0XHRhcnJheSA9IFtdXG5cdFx0aWYgIW90aGVyXG5cdFx0XHRvdGhlciA9IFtdXG5cdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcilcblxuXHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgPSAodGFyZ2V0LCBwcm9wcykgLT5cblx0XHRwcm9wTmFtZXMgPSBwZXJtaXNzaW9uUHJvcE5hbWVzXG5cdFx0ZmlsZXNQcm9OYW1lcyA9IFxuXHRcdGlmIHByb3BzXG5cdFx0XHRfLmVhY2ggcHJvcE5hbWVzLCAocHJvcE5hbWUpIC0+XG5cdFx0XHRcdHRhcmdldFtwcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV1cblxuXHRcdFx0IyB0YXJnZXQuYWxsb3dDcmVhdGUgPSBwcm9wcy5hbGxvd0NyZWF0ZVxuXHRcdFx0IyB0YXJnZXQuYWxsb3dEZWxldGUgPSBwcm9wcy5hbGxvd0RlbGV0ZVxuXHRcdFx0IyB0YXJnZXQuYWxsb3dFZGl0ID0gcHJvcHMuYWxsb3dFZGl0XG5cdFx0XHQjIHRhcmdldC5hbGxvd1JlYWQgPSBwcm9wcy5hbGxvd1JlYWRcblx0XHRcdCMgdGFyZ2V0Lm1vZGlmeUFsbFJlY29yZHMgPSBwcm9wcy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHQjIHRhcmdldC52aWV3QWxsUmVjb3JkcyA9IHByb3BzLnZpZXdBbGxSZWNvcmRzXG5cdFx0XHQjIHRhcmdldC5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHByb3BzLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHQjIHRhcmdldC52aWV3Q29tcGFueVJlY29yZHMgPSBwcm9wcy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdCMgdGFyZ2V0LmRpc2FibGVkX2xpc3Rfdmlld3MgPSBwcm9wcy5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0XHQjIHRhcmdldC5kaXNhYmxlZF9hY3Rpb25zID0gcHJvcHMuZGlzYWJsZWRfYWN0aW9uc1xuXHRcdFx0IyB0YXJnZXQudW5yZWFkYWJsZV9maWVsZHMgPSBwcm9wcy51bnJlYWRhYmxlX2ZpZWxkc1xuXHRcdFx0IyB0YXJnZXQudW5lZGl0YWJsZV9maWVsZHMgPSBwcm9wcy51bmVkaXRhYmxlX2ZpZWxkc1xuXHRcdFx0IyB0YXJnZXQudW5yZWxhdGVkX29iamVjdHMgPSBwcm9wcy51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdFx0IyB0YXJnZXQudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBwcm9wcy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFxuXG5cdG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyA9ICh0YXJnZXQsIHByb3BzKSAtPlxuXHRcdHByb3BOYW1lcyA9IGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lc1xuXHRcdF8uZWFjaCBwcm9wTmFtZXMsIChwcm9wTmFtZSkgLT5cblx0XHRcdGlmIHByb3BzW3Byb3BOYW1lXVxuXHRcdFx0XHR0YXJnZXRbcHJvcE5hbWVdID0gdHJ1ZVxuXHRcdFxuXHRcdCMgaWYgcG8uYWxsb3dSZWFkXG5cdFx0IyBcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHRydWVcblx0XHQjIGlmIHBvLmFsbG93Q3JlYXRlXG5cdFx0IyBcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gdHJ1ZVxuXHRcdCMgaWYgcG8uYWxsb3dFZGl0XG5cdFx0IyBcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHRydWVcblx0XHQjIGlmIHBvLmFsbG93RGVsZXRlXG5cdFx0IyBcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdCMgaWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdCMgXHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gdHJ1ZVxuXHRcdCMgaWYgcG8udmlld0FsbFJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgPSB0cnVlXG5cdFx0IyBpZiBwby5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdCMgXHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHQjIGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdCMgXHRwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cblxuXHRDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHQjIHBzZXRzTWVtYmVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0IyBwc2V0c0d1ZXN0ID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHNwYWNlVXNlciA9IG51bGw7XG5cdFx0aWYgdXNlcklkXG5cdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGVsc2Vcblx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdGFwcHMgPSBbXVxuXHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0cmV0dXJuIFtdXG5cdFx0ZWxzZVxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGVcblx0XHRcdHBzZXRCYXNlID0gcHNldHNVc2VyXG5cdFx0XHRpZiB1c2VyUHJvZmlsZVxuXHRcdFx0XHRpZiB1c2VyUHJvZmlsZSA9PSAnc3VwcGxpZXInXG5cdFx0XHRcdFx0cHNldEJhc2UgPSBwc2V0c1N1cHBsaWVyXG5cdFx0XHRcdGVsc2UgaWYgdXNlclByb2ZpbGUgPT0gJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNDdXN0b21lclxuXHRcdFx0aWYgcHNldEJhc2U/LmFzc2lnbmVkX2FwcHM/Lmxlbmd0aFxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMgdXNlcuadg+mZkOmbhuS4reeahGFzc2lnbmVkX2FwcHPooajnpLrmiYDmnInnlKjmiLflhbfmnInnmoRhcHBz5p2D6ZmQ77yM5Li656m65YiZ6KGo56S65pyJ5omA5pyJYXBwc+adg+mZkO+8jOS4jemcgOimgeS9nOadg+mZkOWIpOaWreS6hlxuXHRcdFx0XHRyZXR1cm4gW11cblx0XHRcdF8uZWFjaCBwc2V0cywgKHBzZXQpLT5cblx0XHRcdFx0aWYgIXBzZXQuYXNzaWduZWRfYXBwc1xuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBwc2V0Lm5hbWUgPT0gXCJhZG1pblwiIHx8ICBwc2V0Lm5hbWUgPT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09ICdjdXN0b21lcidcblx0XHRcdFx0XHQjIOi/memHjOS5i+aJgOS7peimgeaOkumZpGFkbWluL3VzZXLvvIzmmK/lm6DkuLrov5nkuKTkuKrmnYPpmZDpm4bmmK/miYDmnInmnYPpmZDpm4bkuK11c2Vyc+WxnuaAp+aXoOaViOeahOadg+mZkOmbhu+8jOeJueaMh+W3peS9nOWMuueuoeeQhuWRmOWSjOaJgOacieeUqOaIt1xuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRhcHBzID0gXy51bmlvbiBhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHNcblx0XHRcdHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLHVuZGVmaW5lZCxudWxsKVxuXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRwc2V0cyA9ICB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0YWRtaW5NZW51cyA9IENyZWF0b3IuQXBwcy5hZG1pbj8uYWRtaW5fbWVudXNcblx0XHQjIOWmguaenOayoeaciWFkbWlu6I+c5Y2V6K+05piO5LiN6ZyA6KaB55u45YWz5Yqf6IO977yM55u05o6l6L+U5Zue56m6XG5cdFx0dW5sZXNzIGFkbWluTWVudXNcblx0XHRcdHJldHVybiBbXVxuXHRcdGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZCAobikgLT5cblx0XHRcdG4uX2lkID09ICdhYm91dCdcblx0XHRhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIgKG4pIC0+XG5cdFx0XHRuLl9pZCAhPSAnYWJvdXQnXG5cdFx0b3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5IF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIChuKSAtPlxuXHRcdFx0cmV0dXJuIG4uYWRtaW5fbWVudXMgYW5kIG4uX2lkICE9ICdhZG1pbidcblx0XHQpLCAnc29ydCdcblx0XHRvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSlcblx0XHQjIOiPnOWNleacieS4iemDqOWIhue7hOaIkO+8jOiuvue9rkFQUOiPnOWNleOAgeWFtuS7lkFQUOiPnOWNleS7peWPimFib3V06I+c5Y2VXG5cdFx0YWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKVxuXHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0IyDlt6XkvZzljLrnrqHnkIblkZjmnInlhajpg6joj5zljZXlip/og71cblx0XHRcdHJlc3VsdCA9IGFsbE1lbnVzXG5cdFx0ZWxzZVxuXHRcdFx0dXNlclByb2ZpbGUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk/LnByb2ZpbGUgfHwgJ3VzZXInXG5cdFx0XHRjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5uYW1lXG5cdFx0XHRtZW51cyA9IGFsbE1lbnVzLmZpbHRlciAobWVudSktPlxuXHRcdFx0XHRwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0c1xuXHRcdFx0XHQjIOWmguaenOaZrumAmueUqOaIt+acieadg+mZkO+8jOWImeebtOaOpei/lOWbnnRydWVcblx0XHRcdFx0aWYgcHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xXG5cdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0IyDlkKbliJnlj5blvZPliY3nlKjmiLfnmoTmnYPpmZDpm4bkuI5tZW516I+c5Y2V6KaB5rGC55qE5p2D6ZmQ6ZuG5a+55q+U77yM5aaC5p6c5Lqk6ZuG5aSn5LqOMeS4quWImei/lOWbnnRydWVcblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoXG5cdFx0XHRyZXN1bHQgPSBtZW51c1xuXHRcdFxuXHRcdHJldHVybiBfLnNvcnRCeShyZXN1bHQsXCJzb3J0XCIpXG5cblx0ZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCktPlxuXG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIF8uZmluZCBwZXJtaXNzaW9uX29iamVjdHMsIChwbyktPlxuXHRcdFx0XHRcdHJldHVybiBwby5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWR9KVxuXG5cdGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKS0+XG5cdFx0aWYgXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRpZiBfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKVxuXHRcdFx0cmV0dXJuIF8uZmlsdGVyIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XG5cdFx0XHRcdHJldHVybiBwby5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxuXHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiB7JGluOiBwZXJtaXNzaW9uX3NldF9pZHN9fSkuZmV0Y2goKVxuXG5cdHVuaW9uUGVybWlzc2lvbk9iamVjdHMgPSAocG9zLCBvYmplY3QsIHBzZXRzKS0+XG5cdFx0IyDmiopkYuWPinltbOS4reeahHBlcm1pc3Npb25fb2JqZWN0c+WQiOW5tu+8jOS8mOWFiOWPlmRi5Lit55qEXG5cdFx0cmVzdWx0ID0gW11cblx0XHRfLmVhY2ggb2JqZWN0LnBlcm1pc3Npb25fc2V0LCAob3BzLCBvcHNfa2V5KS0+XG5cdFx0XHQjIOaKinltbOS4remZpOS6hueJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhlwiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIuWklueahOWFtuS7luWvueixoeadg+mZkOWFiOWtmOWFpXJlc3VsdFxuXHRcdFx0IyBpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiLCBcIndvcmtmbG93X2FkbWluXCIsIFwib3JnYW5pemF0aW9uX2FkbWluXCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXG5cdFx0XHRpZiBbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiXS5pbmRleE9mKG9wc19rZXkpIDwgMFxuXHRcdFx0XHRjdXJyZW50UHNldCA9IHBzZXRzLmZpbmQgKHBzZXQpLT4gcmV0dXJuIHBzZXQubmFtZSA9PSBvcHNfa2V5XG5cdFx0XHRcdGlmIGN1cnJlbnRQc2V0XG5cdFx0XHRcdFx0dGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fVxuXHRcdFx0XHRcdHRlbXBPcHMucGVybWlzc2lvbl9zZXRfaWQgPSBjdXJyZW50UHNldC5faWRcblx0XHRcdFx0XHR0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggdGVtcE9wc1xuXHRcdGlmIHJlc3VsdC5sZW5ndGhcblx0XHRcdHBvcy5mb3JFYWNoIChwbyktPlxuXHRcdFx0XHRyZXBlYXRJbmRleCA9IDBcblx0XHRcdFx0cmVwZWF0UG8gPSByZXN1bHQuZmluZCgoaXRlbSwgaW5kZXgpLT4gcmVwZWF0SW5kZXggPSBpbmRleDtyZXR1cm4gaXRlbS5wZXJtaXNzaW9uX3NldF9pZCA9PSBwby5wZXJtaXNzaW9uX3NldF9pZClcblx0XHRcdFx0IyDlpoLmnpx5bWzkuK3lt7Lnu4/lrZjlnKhwb++8jOWImeabv+aNouS4uuaVsOaNruW6k+S4reeahHBv77yM5Y+N5LmL5YiZ5oqK5pWw5o2u5bqT5Lit55qEcG/nm7TmjqXntK/liqDov5vljrtcblx0XHRcdFx0aWYgcmVwZWF0UG9cblx0XHRcdFx0XHRyZXN1bHRbcmVwZWF0SW5kZXhdID0gcG9cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoIHBvXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHBvc1xuXG5cdENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSktPlxuXHRcdHBlcm1pc3Npb25zID0ge31cblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZClcblxuXHRcdGlmIHNwYWNlSWQgaXMgJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PSBcInVzZXJzXCJcblx0XHRcdHBlcm1pc3Npb25zID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XG5cdFx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xuXHRcdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cdFx0cHNldHNBZG1pbiA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgb3IgdGhpcy5wc2V0c0FkbWluIHRoZW4gdGhpcy5wc2V0c0FkbWluIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSBvciB0aGlzLnBzZXRzVXNlciB0aGVuIHRoaXMucHNldHNVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNNZW1iZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSBvciB0aGlzLnBzZXRzTWVtYmVyIHRoZW4gdGhpcy5wc2V0c01lbWJlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNHdWVzdCA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgb3IgdGhpcy5wc2V0c0d1ZXN0IHRoZW4gdGhpcy5wc2V0c0d1ZXN0IGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MX19KVxuXG5cdFx0cHNldHNTdXBwbGllciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgb3IgdGhpcy5wc2V0c1N1cHBsaWVyIHRoZW4gdGhpcy5wc2V0c1N1cHBsaWVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzQ3VzdG9tZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQ3VzdG9tZXIpIG9yIHRoaXMucHNldHNDdXN0b21lciB0aGVuIHRoaXMucHNldHNDdXN0b21lciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50O1xuXHRcdGlmICFwc2V0c1xuXHRcdFx0c3BhY2VVc2VyID0gbnVsbDtcblx0XHRcdGlmIHVzZXJJZFxuXHRcdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cblx0XHRwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3Ncblx0XHRwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zXG5cdFx0cHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3Ncblx0XHRwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3NcblxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3Bvc1xuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gdGhpcy5wc2V0c0N1c3RvbWVyX3Bvc1xuXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3Bvc1xuXG5cdFx0b3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fVxuXHRcdG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9XG5cdFx0b3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9XG5cdFx0b3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxuXG5cdFx0b3BzZXRTdXBwbGllciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnN1cHBsaWVyKSB8fCB7fVxuXHRcdG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge31cblxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3RfbGlzdHZpZXdzJykuZmluZCh7c3BhY2U6IHNwYWNlSWQsIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgc2hhcmVkOiB0cnVlfSwge2ZpZWxkczp7X2lkOjF9fSkuZmV0Y2goKVxuXHRcdCMgc2hhcmVkTGlzdFZpZXdzID0gXy5wbHVjayhzaGFyZWRMaXN0Vmlld3MsXCJfaWRcIilcblx0XHQjIGlmIHNoYXJlZExpc3RWaWV3cy5sZW5ndGhcblx0XHQjIFx0dW5sZXNzIG9wc2V0QWRtaW4ubGlzdF92aWV3c1xuXHRcdCMgXHRcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IFtdXG5cdFx0IyBcdG9wc2V0QWRtaW4ubGlzdF92aWV3cyA9IF8udW5pb24gb3BzZXRBZG1pbi5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3Ncblx0XHQjIFx0dW5sZXNzIG9wc2V0VXNlci5saXN0X3ZpZXdzXG5cdFx0IyBcdFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBbXVxuXHRcdCMgXHRvcHNldFVzZXIubGlzdF92aWV3cyA9IF8udW5pb24gb3BzZXRVc2VyLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xuXHRcdCMg5pWw5o2u5bqT5Lit5aaC5p6c6YWN572u5LqG6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOmbhuiuvue9ru+8jOW6lOivpeimhuebluS7o+eggeS4rWFkbWluL3VzZXLnmoTmnYPpmZDpm4borr7nva5cblx0XHRpZiBwc2V0c0FkbWluXG5cdFx0XHRwb3NBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0FkbWluLl9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldEFkbWluLCBwb3NBZG1pblxuXHRcdGlmIHBzZXRzVXNlclxuXHRcdFx0cG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRVc2VyLCBwb3NVc2VyXG5cdFx0aWYgcHNldHNNZW1iZXJcblx0XHRcdHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0TWVtYmVyLCBwb3NNZW1iZXJcblx0XHRpZiBwc2V0c0d1ZXN0XG5cdFx0XHRwb3NHdWVzdCA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNHdWVzdF9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0d1ZXN0Ll9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldEd1ZXN0LCBwb3NHdWVzdFxuXHRcdGlmIHBzZXRzU3VwcGxpZXJcblx0XHRcdHBvc1N1cHBsaWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1N1cHBsaWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzU3VwcGxpZXIuX2lkKTtcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldFN1cHBsaWVyLCBwb3NTdXBwbGllclxuXHRcdGlmIHBzZXRzQ3VzdG9tZXJcblx0XHRcdHBvc0N1c3RvbWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1c3RvbWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQ3VzdG9tZXIuX2lkKTtcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldEN1c3RvbWVyLCBwb3NDdXN0b21lclxuXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXG5cdFx0ZWxzZVxuXHRcdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBzcGFjZUlkIGlzICdjb21tb24nXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHNwYWNlVXNlciA9IGlmIF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSBvciB0aGlzLnNwYWNlVXNlciB0aGVuIHRoaXMuc3BhY2VVc2VyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0XHRcdFx0aWYgc3BhY2VVc2VyXG5cdFx0XHRcdFx0XHRwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdFx0XHRcdGlmIHByb2Zcblx0XHRcdFx0XHRcdFx0aWYgcHJvZiBpcyAndXNlcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ21lbWJlcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnZ3Vlc3QnXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnc3VwcGxpZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnY3VzdG9tZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEN1c3RvbWVyXG5cdFx0XHRcdFx0XHRlbHNlICMg5rKh5pyJcHJvZmlsZeWImeiupOS4uuaYr3VzZXLmnYPpmZBcblx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Rcblx0XHRpZiBwc2V0cy5sZW5ndGggPiAwXG5cdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0cywgXCJfaWRcIlxuXHRcdFx0cG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcylcblx0XHRcdHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKVxuXHRcdFx0Xy5lYWNoIHBvcywgKHBvKS0+XG5cdFx0XHRcdGlmIHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQWRtaW4/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNVc2VyPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzTWVtYmVyPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzR3Vlc3Q/Ll9pZCBvclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1N1cHBsaWVyPy5faWQgb3Jcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNDdXN0b21lcj8uX2lkXG5cdFx0XHRcdFx0IyDpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ5YC85Y+q5a6e6KGM5LiK6Z2i55qE6buY6K6k5YC86KaG55uW77yM5LiN5YGa566X5rOV5Yik5patXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGlmIF8uaXNFbXB0eShwZXJtaXNzaW9ucylcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IHBvXG5cdFx0XHRcdG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyBwZXJtaXNzaW9ucywgcG9cblxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBwby5kaXNhYmxlZF9saXN0X3ZpZXdzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIHBvLnVuZWRpdGFibGVfZmllbGRzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKVxuXHRcdFx0XHRwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHBvLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0KVxuXHRcdFxuXHRcdGlmIG9iamVjdC5pc192aWV3XG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW11cblx0XHRDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyBwZXJtaXNzaW9uc1xuXG5cdFx0aWYgb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXG5cdFx0XHRwZXJtaXNzaW9ucy5vd25lciA9IG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lclxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cblx0IyBDcmVhdG9yLmluaXRQZXJtaXNzaW9ucyA9IChvYmplY3RfbmFtZSkgLT5cblxuXHRcdCMgIyDlupTor6XmiororqHnrpflh7rmnaXnmoRcblx0XHQjIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdLmFsbG93XG5cdFx0IyBcdGluc2VydDogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHQgICAgXHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdCMgXHR1cGRhdGU6ICh1c2VySWQsIGRvYykgLT5cblx0XHQjIFx0XHRpZiAhdXNlcklkXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0VkaXRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cdFx0IyBcdHJlbW92ZTogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RGVsZXRlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdE1ldGVvci5tZXRob2RzXG5cdFx0IyBDYWxjdWxhdGUgUGVybWlzc2lvbnMgb24gU2VydmVyXG5cdFx0XCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiAoc3BhY2VJZCktPlxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpXG4iLCJ2YXIgYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzLCBjbG9uZSwgZXh0ZW5kUGVybWlzc2lvblByb3BzLCBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0LCBmaW5kX3Blcm1pc3Npb25fb2JqZWN0LCBpbnRlcnNlY3Rpb25QbHVzLCBvdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMsIG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcywgcGVybWlzc2lvblByb3BOYW1lcywgdW5pb25QZXJtaXNzaW9uT2JqZWN0cywgdW5pb25QbHVzO1xuXG5jbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5cbmJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImFsbG93Q3JlYXRlXCIsIFwiYWxsb3dEZWxldGVcIiwgXCJhbGxvd0VkaXRcIiwgXCJhbGxvd1JlYWRcIiwgXCJtb2RpZnlBbGxSZWNvcmRzXCIsIFwidmlld0FsbFJlY29yZHNcIiwgXCJtb2RpZnlDb21wYW55UmVjb3Jkc1wiLCBcInZpZXdDb21wYW55UmVjb3Jkc1wiLCBcImFsbG93UmVhZEZpbGVzXCIsIFwiYWxsb3dFZGl0RmlsZXNcIiwgXCJhbGxvd0NyZWF0ZUZpbGVzXCIsIFwiYWxsb3dEZWxldGVGaWxlc1wiLCBcInZpZXdBbGxGaWxlc1wiLCBcIm1vZGlmeUFsbEZpbGVzXCJdO1xuXG5vdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJkaXNhYmxlZF9saXN0X3ZpZXdzXCIsIFwiZGlzYWJsZWRfYWN0aW9uc1wiLCBcInVucmVhZGFibGVfZmllbGRzXCIsIFwidW5lZGl0YWJsZV9maWVsZHNcIiwgXCJ1bnJlbGF0ZWRfb2JqZWN0c1wiLCBcInVuZWRpdGFibGVfcmVsYXRlZF9saXN0XCJdO1xuXG5wZXJtaXNzaW9uUHJvcE5hbWVzID0gXy51bmlvbihiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMsIG90aGVyUGVybWlzc2lvblByb3BOYW1lcyk7XG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciBvYmo7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iaikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpO1xuICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIHJldHVybiBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBpc093bmVyLCBtYXN0ZXJPYmplY3ROYW1lLCBtYXN0ZXJSZWNvcmRQZXJtLCBwZXJtaXNzaW9ucywgcmVjb3JkX2NvbXBhbnlfaWQsIHJlY29yZF9jb21wYW55X2lkcywgcmVmLCB1c2VyX2NvbXBhbnlfaWRzO1xuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAoIXNwYWNlSWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgfVxuICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSk7XG4gIGlmIChyZWNvcmQpIHtcbiAgICBpZiAoIV8uaXNFbXB0eShyZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zKSkge1xuICAgICAgcmV0dXJuIHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnM7XG4gICAgfVxuICAgIGlzT3duZXIgPSByZWNvcmQub3duZXIgPT09IHVzZXJJZCB8fCAoKHJlZiA9IHJlY29yZC5vd25lcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDApID09PSB1c2VySWQ7XG4gICAgaWYgKG9iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiKSB7XG4gICAgICBtYXN0ZXJPYmplY3ROYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG4gICAgICBtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhtYXN0ZXJPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXM7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlcztcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0RlbGV0ZUZpbGVzO1xuICAgICAgaWYgKCFtYXN0ZXJSZWNvcmRQZXJtLm1vZGlmeUFsbEZpbGVzICYmICFpc093bmVyKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gcGVybWlzc2lvbnMuYWxsb3dSZWFkICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkRmlsZXM7XG4gICAgICBpZiAoIW1hc3RlclJlY29yZFBlcm0udmlld0FsbEZpbGVzICYmICFpc093bmVyKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpO1xuICAgICAgfVxuICAgICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkIDogdm9pZCAwO1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkICYmIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpICYmIHJlY29yZF9jb21wYW55X2lkLl9pZCkge1xuICAgICAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZDtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmNvbXBhbnlfaWRzIDogdm9pZCAwO1xuICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoICYmIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWRzWzBdKSkge1xuICAgICAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmRfY29tcGFueV9pZHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gXy51bmlvbihyZWNvcmRfY29tcGFueV9pZHMsIFtyZWNvcmRfY29tcGFueV9pZF0pO1xuICAgICAgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHVzZXJfY29tcGFueV9pZHMgJiYgdXNlcl9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZWNvcmQubG9ja2VkICYmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBlcm1pc3Npb25zO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihjdXJyZW50T2JqZWN0TmFtZSwgcmVsYXRlZExpc3RJdGVtLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpIHtcbiAgICB2YXIgaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlLCBtYXN0ZXJBbGxvdywgbWFzdGVyUmVjb3JkUGVybSwgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLCByZXN1bHQsIHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICBpZiAoIWN1cnJlbnRPYmplY3ROYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgY3VycmVudE9iamVjdE5hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIXJlbGF0ZWRMaXN0SXRlbSkge1xuICAgICAgY29uc29sZS5lcnJvcihcInJlbGF0ZWRMaXN0SXRlbSBtdXN0IG5vdCBiZSBlbXB0eSBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9uc1wiKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgaWYgKCFjdXJyZW50UmVjb3JkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgY3VycmVudFJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKCk7XG4gICAgfVxuICAgIGlmICghdXNlcklkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKTtcbiAgICByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSk7XG4gICAgcmVzdWx0ID0gXy5jbG9uZShyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMpO1xuICAgIGlmIChyZWxhdGVkTGlzdEl0ZW0uaXNfZmlsZSkge1xuICAgICAgcmVzdWx0LmFsbG93Q3JlYXRlID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlcztcbiAgICAgIHJlc3VsdC5hbGxvd0VkaXQgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZExpc3RJdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIHx8IGZhbHNlO1xuICAgICAgbWFzdGVyQWxsb3cgPSBmYWxzZTtcbiAgICAgIGlmICh3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PT0gdHJ1ZSkge1xuICAgICAgICBtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkO1xuICAgICAgfSBlbHNlIGlmICh3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdDtcbiAgICAgIH1cbiAgICAgIHVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gQ3JlYXRvci5nZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QoY3VycmVudFJlY29yZCwgY3VycmVudE9iamVjdE5hbWUpO1xuICAgICAgaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlID0gdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QuaW5kZXhPZihyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpID4gLTE7XG4gICAgICByZXN1bHQuYWxsb3dDcmVhdGUgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICAgIHJlc3VsdC5hbGxvd0VkaXQgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBfaSwgaXNTcGFjZUFkbWluLCBwZXJtaXNzaW9ucywgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnQsIHBzZXRzQ3VycmVudE5hbWVzLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHtcbiAgICAgIG9iamVjdHM6IHt9LFxuICAgICAgYXNzaWduZWRfYXBwczogW11cbiAgICB9O1xuXG4gICAgLypcbiAgICBcdFx05p2D6ZmQ6ZuG6K+05piOOlxuICAgIFx0XHTlhoXnva7mnYPpmZDpm4YtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXG4gICAgXHRcdOiHquWumuS5ieadg+mZkOmbhi3mlbDmja7lupPkuK3mlrDlu7rnmoTpmaTlhoXnva7mnYPpmZDpm4bku6XlpJbnmoTlhbbku5bmnYPpmZDpm4ZcbiAgICBcdFx054m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKfkuI3lj6/phY3nva7vvIktYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3RcbiAgICBcdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ6ZuGXG4gICAgICovXG4gICAgaXNTcGFjZUFkbWluID0gZmFsc2U7XG4gICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICBpZiAodXNlcklkKSB7XG4gICAgICBpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBwc2V0c0FkbWluX3BvcyA9IG51bGw7XG4gICAgcHNldHNVc2VyX3BvcyA9IG51bGw7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0d1ZXN0X3BvcyA9IG51bGw7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IG51bGw7XG4gICAgcHNldHNTdXBwbGllcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbDtcbiAgICBpZiAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1N1cHBsaWVyICE9IG51bGwgPyBwc2V0c1N1cHBsaWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNTdXBwbGllcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXJyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJfaWRcIik7XG4gICAgICBwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAgICRpbjogc2V0X2lkc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgcHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJuYW1lXCIpO1xuICAgIH1cbiAgICBwc2V0cyA9IHtcbiAgICAgIHBzZXRzQWRtaW46IHBzZXRzQWRtaW4sXG4gICAgICBwc2V0c1VzZXI6IHBzZXRzVXNlcixcbiAgICAgIHBzZXRzQ3VycmVudDogcHNldHNDdXJyZW50LFxuICAgICAgcHNldHNNZW1iZXI6IHBzZXRzTWVtYmVyLFxuICAgICAgcHNldHNHdWVzdDogcHNldHNHdWVzdCxcbiAgICAgIHBzZXRzU3VwcGxpZXI6IHBzZXRzU3VwcGxpZXIsXG4gICAgICBwc2V0c0N1c3RvbWVyOiBwc2V0c0N1c3RvbWVyLFxuICAgICAgaXNTcGFjZUFkbWluOiBpc1NwYWNlQWRtaW4sXG4gICAgICBzcGFjZVVzZXI6IHNwYWNlVXNlcixcbiAgICAgIHBzZXRzQWRtaW5fcG9zOiBwc2V0c0FkbWluX3BvcyxcbiAgICAgIHBzZXRzVXNlcl9wb3M6IHBzZXRzVXNlcl9wb3MsXG4gICAgICBwc2V0c01lbWJlcl9wb3M6IHBzZXRzTWVtYmVyX3BvcyxcbiAgICAgIHBzZXRzR3Vlc3RfcG9zOiBwc2V0c0d1ZXN0X3BvcyxcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zOiBwc2V0c1N1cHBsaWVyX3BvcyxcbiAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zOiBwc2V0c0N1c3RvbWVyX3BvcyxcbiAgICAgIHBzZXRzQ3VycmVudF9wb3M6IHBzZXRzQ3VycmVudF9wb3NcbiAgICB9O1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX2FwcHMgPSBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLmFzc2lnbmVkX21lbnVzID0gQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lcztcbiAgICBfaSA9IDA7XG4gICAgXy5lYWNoKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgZnVuY3Rpb24ob2JqZWN0LCBvYmplY3RfbmFtZSkge1xuICAgICAgX2krKztcbiAgICAgIGlmICghXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PT0gc3BhY2VJZCkge1xuICAgICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ2luX2RldmVsb3BtZW50JykgfHwgb2JqZWN0LmluX2RldmVsb3BtZW50ID09PSAnMCcgfHwgKG9iamVjdC5pbl9kZXZlbG9wbWVudCAhPT0gJzAnICYmIGlzU3BhY2VBZG1pbikpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZCk7XG4gICAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICB1bmlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8udW5pb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgaW50ZXJzZWN0aW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKTtcbiAgfTtcbiAgZXh0ZW5kUGVybWlzc2lvblByb3BzID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wcykge1xuICAgIHZhciBmaWxlc1Byb05hbWVzLCBwcm9wTmFtZXM7XG4gICAgcHJvcE5hbWVzID0gcGVybWlzc2lvblByb3BOYW1lcztcbiAgICByZXR1cm4gZmlsZXNQcm9OYW1lcyA9IHByb3BzID8gXy5lYWNoKHByb3BOYW1lcywgZnVuY3Rpb24ocHJvcE5hbWUpIHtcbiAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIH0pIDogdm9pZCAwO1xuICB9O1xuICBvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMgPSBmdW5jdGlvbih0YXJnZXQsIHByb3BzKSB7XG4gICAgdmFyIHByb3BOYW1lcztcbiAgICBwcm9wTmFtZXMgPSBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXM7XG4gICAgcmV0dXJuIF8uZWFjaChwcm9wTmFtZXMsIGZ1bmN0aW9uKHByb3BOYW1lKSB7XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRbcHJvcE5hbWVdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYXBwcywgaXNTcGFjZUFkbWluLCBwc2V0QmFzZSwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQ3VzdG9tZXIsIHBzZXRzU3VwcGxpZXIsIHBzZXRzVXNlciwgcmVmLCByZWYxLCBzcGFjZVVzZXIsIHVzZXJQcm9maWxlO1xuICAgIHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1N1cHBsaWVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1c3RvbWVyID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFwcHMgPSBbXTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJQcm9maWxlID0gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYucHJvZmlsZSA6IHZvaWQgMDtcbiAgICAgIHBzZXRCYXNlID0gcHNldHNVc2VyO1xuICAgICAgaWYgKHVzZXJQcm9maWxlKSB7XG4gICAgICAgIGlmICh1c2VyUHJvZmlsZSA9PT0gJ3N1cHBsaWVyJykge1xuICAgICAgICAgIHBzZXRCYXNlID0gcHNldHNTdXBwbGllcjtcbiAgICAgICAgfSBlbHNlIGlmICh1c2VyUHJvZmlsZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHBzZXRCYXNlID0gcHNldHNDdXN0b21lcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBzZXRCYXNlICE9IG51bGwgPyAocmVmMSA9IHBzZXRCYXNlLmFzc2lnbmVkX2FwcHMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIF8uZWFjaChwc2V0cywgZnVuY3Rpb24ocHNldCkge1xuICAgICAgICBpZiAoIXBzZXQuYXNzaWduZWRfYXBwcykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHNldC5uYW1lID09PSBcImFkbWluXCIgfHwgcHNldC5uYW1lID09PSBcInVzZXJcIiB8fCBwc2V0Lm5hbWUgPT09ICdzdXBwbGllcicgfHwgcHNldC5uYW1lID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcHBzID0gXy51bmlvbihhcHBzLCBwc2V0LmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy53aXRob3V0KF8udW5pcShhcHBzKSwgdm9pZCAwLCBudWxsKTtcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhYm91dE1lbnUsIGFkbWluTWVudXMsIGFsbE1lbnVzLCBjdXJyZW50UHNldE5hbWVzLCBpc1NwYWNlQWRtaW4sIG1lbnVzLCBvdGhlck1lbnVBcHBzLCBvdGhlck1lbnVzLCBwc2V0cywgcmVmLCByZWYxLCByZXN1bHQsIHVzZXJQcm9maWxlO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICB1c2VyczogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICBuYW1lOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYWRtaW5NZW51cyA9IChyZWYgPSBDcmVhdG9yLkFwcHMuYWRtaW4pICE9IG51bGwgPyByZWYuYWRtaW5fbWVudXMgOiB2b2lkIDA7XG4gICAgaWYgKCFhZG1pbk1lbnVzKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGFib3V0TWVudSA9IGFkbWluTWVudXMuZmluZChmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgPT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgYWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCAhPT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkoXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uYWRtaW5fbWVudXMgJiYgbi5faWQgIT09ICdhZG1pbic7XG4gICAgfSksICdzb3J0Jyk7XG4gICAgb3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpO1xuICAgIGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSk7XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmVzdWx0ID0gYWxsTWVudXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJQcm9maWxlID0gKChyZWYxID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjEucHJvZmlsZSA6IHZvaWQgMCkgfHwgJ3VzZXInO1xuICAgICAgY3VycmVudFBzZXROYW1lcyA9IHBzZXRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLm5hbWU7XG4gICAgICB9KTtcbiAgICAgIG1lbnVzID0gYWxsTWVudXMuZmlsdGVyKGZ1bmN0aW9uKG1lbnUpIHtcbiAgICAgICAgdmFyIHBzZXRzTWVudTtcbiAgICAgICAgcHNldHNNZW51ID0gbWVudS5wZXJtaXNzaW9uX3NldHM7XG4gICAgICAgIGlmIChwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YodXNlclByb2ZpbGUpID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGg7XG4gICAgICB9KTtcbiAgICAgIHJlc3VsdCA9IG1lbnVzO1xuICAgIH1cbiAgICByZXR1cm4gXy5zb3J0QnkocmVzdWx0LCBcInNvcnRcIik7XG4gIH07XG4gIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZCkge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maW5kKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkXG4gICAgfSk7XG4gIH07XG4gIGZpbmRfcGVybWlzc2lvbl9vYmplY3QgPSBmdW5jdGlvbihwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmlsdGVyKHBlcm1pc3Npb25fb2JqZWN0cywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgcmV0dXJuIHBvLm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgJGluOiBwZXJtaXNzaW9uX3NldF9pZHNcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICB9O1xuICB1bmlvblBlcm1pc3Npb25PYmplY3RzID0gZnVuY3Rpb24ocG9zLCBvYmplY3QsIHBzZXRzKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICByZXN1bHQgPSBbXTtcbiAgICBfLmVhY2gob2JqZWN0LnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihvcHMsIG9wc19rZXkpIHtcbiAgICAgIHZhciBjdXJyZW50UHNldCwgdGVtcE9wcztcbiAgICAgIGlmIChbXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwiXS5pbmRleE9mKG9wc19rZXkpIDwgMCkge1xuICAgICAgICBjdXJyZW50UHNldCA9IHBzZXRzLmZpbmQoZnVuY3Rpb24ocHNldCkge1xuICAgICAgICAgIHJldHVybiBwc2V0Lm5hbWUgPT09IG9wc19rZXk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY3VycmVudFBzZXQpIHtcbiAgICAgICAgICB0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9O1xuICAgICAgICAgIHRlbXBPcHMucGVybWlzc2lvbl9zZXRfaWQgPSBjdXJyZW50UHNldC5faWQ7XG4gICAgICAgICAgdGVtcE9wcy5vYmplY3RfbmFtZSA9IG9iamVjdC5vYmplY3RfbmFtZTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2godGVtcE9wcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCkge1xuICAgICAgcG9zLmZvckVhY2goZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgdmFyIHJlcGVhdEluZGV4LCByZXBlYXRQbztcbiAgICAgICAgcmVwZWF0SW5kZXggPSAwO1xuICAgICAgICByZXBlYXRQbyA9IHJlc3VsdC5maW5kKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgcmVwZWF0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICByZXR1cm4gaXRlbS5wZXJtaXNzaW9uX3NldF9pZCA9PT0gcG8ucGVybWlzc2lvbl9zZXRfaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVwZWF0UG8pIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZXN1bHQucHVzaChwbyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBvcztcbiAgICB9XG4gIH07XG4gIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIGlzU3BhY2VBZG1pbiwgb2JqZWN0LCBvcHNldEFkbWluLCBvcHNldEN1c3RvbWVyLCBvcHNldEd1ZXN0LCBvcHNldE1lbWJlciwgb3BzZXRTdXBwbGllciwgb3BzZXRVc2VyLCBwZXJtaXNzaW9ucywgcG9zLCBwb3NBZG1pbiwgcG9zQ3VzdG9tZXIsIHBvc0d1ZXN0LCBwb3NNZW1iZXIsIHBvc1N1cHBsaWVyLCBwb3NVc2VyLCBwcm9mLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzQ3VzdG9tZXIsIHBzZXRzQ3VzdG9tZXJfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNTdXBwbGllciwgcHNldHNTdXBwbGllcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3Bvcywgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge307XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpO1xuICAgIGlmIChzcGFjZUlkID09PSAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSB8fCB0aGlzLnBzZXRzQWRtaW4gPyB0aGlzLnBzZXRzQWRtaW4gOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgfHwgdGhpcy5wc2V0c1VzZXIgPyB0aGlzLnBzZXRzVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNNZW1iZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzTWVtYmVyKSB8fCB0aGlzLnBzZXRzTWVtYmVyID8gdGhpcy5wc2V0c01lbWJlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0d1ZXN0ID0gXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSB8fCB0aGlzLnBzZXRzR3Vlc3QgPyB0aGlzLnBzZXRzR3Vlc3QgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1N1cHBsaWVyID0gXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSB8fCB0aGlzLnBzZXRzU3VwcGxpZXIgPyB0aGlzLnBzZXRzU3VwcGxpZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1c3RvbWVyID0gXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSB8fCB0aGlzLnBzZXRzQ3VzdG9tZXIgPyB0aGlzLnBzZXRzQ3VzdG9tZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50O1xuICAgIGlmICghcHNldHMpIHtcbiAgICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwc2V0c0FkbWluX3BvcyA9IHRoaXMucHNldHNBZG1pbl9wb3M7XG4gICAgcHNldHNVc2VyX3BvcyA9IHRoaXMucHNldHNVc2VyX3BvcztcbiAgICBwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3BvcztcbiAgICBwc2V0c0d1ZXN0X3BvcyA9IHRoaXMucHNldHNHdWVzdF9wb3M7XG4gICAgcHNldHNTdXBwbGllcl9wb3MgPSB0aGlzLnBzZXRzU3VwcGxpZXJfcG9zO1xuICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gdGhpcy5wc2V0c0N1c3RvbWVyX3BvcztcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zO1xuICAgIG9wc2V0QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5hZG1pbikgfHwge307XG4gICAgb3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge307XG4gICAgb3BzZXRNZW1iZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5tZW1iZXIpIHx8IHt9O1xuICAgIG9wc2V0R3Vlc3QgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge307XG4gICAgb3BzZXRTdXBwbGllciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnN1cHBsaWVyKSB8fCB7fTtcbiAgICBvcHNldEN1c3RvbWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuY3VzdG9tZXIpIHx8IHt9O1xuICAgIGlmIChwc2V0c0FkbWluKSB7XG4gICAgICBwb3NBZG1pbiA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNBZG1pbl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0FkbWluLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRBZG1pbiwgcG9zQWRtaW4pO1xuICAgIH1cbiAgICBpZiAocHNldHNVc2VyKSB7XG4gICAgICBwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRVc2VyLCBwb3NVc2VyKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyKSB7XG4gICAgICBwb3NNZW1iZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzTWVtYmVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzTWVtYmVyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRNZW1iZXIsIHBvc01lbWJlcik7XG4gICAgfVxuICAgIGlmIChwc2V0c0d1ZXN0KSB7XG4gICAgICBwb3NHdWVzdCA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNHdWVzdF9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0d1ZXN0Ll9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRHdWVzdCwgcG9zR3Vlc3QpO1xuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllcikge1xuICAgICAgcG9zU3VwcGxpZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzU3VwcGxpZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNTdXBwbGllci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0U3VwcGxpZXIsIHBvc1N1cHBsaWVyKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VzdG9tZXIpIHtcbiAgICAgIHBvc0N1c3RvbWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1c3RvbWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQ3VzdG9tZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldEN1c3RvbWVyLCBwb3NDdXN0b21lcik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNwYWNlSWQgPT09ICdjb21tb24nKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BhY2VVc2VyID0gXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIHx8IHRoaXMuc3BhY2VVc2VyID8gdGhpcy5zcGFjZVVzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoc3BhY2VVc2VyKSB7XG4gICAgICAgICAgICBwcm9mID0gc3BhY2VVc2VyLnByb2ZpbGU7XG4gICAgICAgICAgICBpZiAocHJvZikge1xuICAgICAgICAgICAgICBpZiAocHJvZiA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ21lbWJlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0TWVtYmVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdndWVzdCcpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ3N1cHBsaWVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRTdXBwbGllcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEN1c3RvbWVyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHNldHMubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHMsIFwiX2lkXCIpO1xuICAgICAgcG9zID0gZmluZF9wZXJtaXNzaW9uX29iamVjdChwc2V0c0N1cnJlbnRfcG9zLCBvYmplY3RfbmFtZSwgc2V0X2lkcyk7XG4gICAgICBwb3MgPSB1bmlvblBlcm1pc3Npb25PYmplY3RzKHBvcywgb2JqZWN0LCBwc2V0cyk7XG4gICAgICBfLmVhY2gocG9zLCBmdW5jdGlvbihwbykge1xuICAgICAgICBpZiAocG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0FkbWluICE9IG51bGwgPyBwc2V0c0FkbWluLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0d1ZXN0ICE9IG51bGwgPyBwc2V0c0d1ZXN0Ll9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c1N1cHBsaWVyICE9IG51bGwgPyBwc2V0c1N1cHBsaWVyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8uaXNFbXB0eShwZXJtaXNzaW9ucykpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IHBvO1xuICAgICAgICB9XG4gICAgICAgIG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyhwZXJtaXNzaW9ucywgcG8pO1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzLCBwby5kaXNhYmxlZF9saXN0X3ZpZXdzKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIHBvLnVuZWRpdGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHBvLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAob2JqZWN0LmlzX3ZpZXcpIHtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdO1xuICAgIH1cbiAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgaWYgKG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcikge1xuICAgICAgcGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXI7XG4gICAgfVxuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdGhpcy51c2VySWQpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJcbnN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpXG5cbk1ldGVvci5zdGFydHVwICgpLT5cblx0Y3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUlxuXHRvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUlxuXHRpZiBjcmVhdG9yX2RiX3VybFxuXHRcdGlmICFvcGxvZ191cmxcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKVxuXHRcdENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge29wbG9nVXJsOiBvcGxvZ191cmx9KX1cblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IChvYmplY3QpLT5cbiNcdGlmIG9iamVjdC50YWJsZV9uYW1lICYmIG9iamVjdC50YWJsZV9uYW1lLmVuZHNXaXRoKFwiX19jXCIpXG4jXHRcdHJldHVybiBvYmplY3QudGFibGVfbmFtZVxuI1x0ZWxzZVxuI1x0XHRyZXR1cm4gb2JqZWN0Lm5hbWVcblx0cmV0dXJuIG9iamVjdC5uYW1lXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSAob2JqZWN0KS0+XG5cdGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpXG5cdGlmIGRiW2NvbGxlY3Rpb25fa2V5XVxuXHRcdHJldHVybiBkYltjb2xsZWN0aW9uX2tleV1cblx0ZWxzZSBpZiBvYmplY3QuZGJcblx0XHRyZXR1cm4gb2JqZWN0LmRiXG5cblx0aWYgQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV1cblx0ZWxzZVxuXHRcdGlmIG9iamVjdC5jdXN0b21cblx0XHRcdHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpXG5cdFx0ZWxzZVxuXHRcdFx0aWYgY29sbGVjdGlvbl9rZXkgPT0gJ19zbXNfcXVldWUnICYmIFNNU1F1ZXVlPy5jb2xsZWN0aW9uXG5cdFx0XHRcdHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSlcblxuXG4iLCJ2YXIgc3RlZWRvc0NvcmU7XG5cbnN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0b3JfZGJfdXJsLCBvcGxvZ191cmw7XG4gIGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1I7XG4gIG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SO1xuICBpZiAoY3JlYXRvcl9kYl91cmwpIHtcbiAgICBpZiAoIW9wbG9nX3VybCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpO1xuICAgIH1cbiAgICByZXR1cm4gQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge1xuICAgICAgX2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtcbiAgICAgICAgb3Bsb2dVcmw6IG9wbG9nX3VybFxuICAgICAgfSlcbiAgICB9O1xuICB9XG59KTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGNvbGxlY3Rpb25fa2V5O1xuICBjb2xsZWN0aW9uX2tleSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqZWN0KTtcbiAgaWYgKGRiW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBkYltjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSBpZiAob2JqZWN0LmRiKSB7XG4gICAgcmV0dXJuIG9iamVjdC5kYjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tjb2xsZWN0aW9uX2tleV07XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iamVjdC5jdXN0b20pIHtcbiAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5LCBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY29sbGVjdGlvbl9rZXkgPT09ICdfc21zX3F1ZXVlJyAmJiAodHlwZW9mIFNNU1F1ZXVlICE9PSBcInVuZGVmaW5lZFwiICYmIFNNU1F1ZXVlICE9PSBudWxsID8gU01TUXVldWUuY29sbGVjdGlvbiA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSk7XG4gICAgfVxuICB9XG59O1xuIiwiQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge31cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdCMg5a6a5LmJ5YWo5bGAIGFjdGlvbnMg5Ye95pWwXHRcblx0Q3JlYXRvci5hY3Rpb25zID0gKGFjdGlvbnMpLT5cblx0XHRfLmVhY2ggYWN0aW9ucywgKHRvZG8sIGFjdGlvbl9uYW1lKS0+XG5cdFx0XHRDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbyBcblxuXHRDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSAob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsYmFjayktPlxuXHRcdGlmIGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PSAnd29yZC1wcmludCdcblx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRmaWx0ZXJzID0gWydfaWQnLCAnPScsIHJlY29yZF9pZF1cblx0XHRcdGVsc2Vcblx0XHRcdFx0ZmlsdGVycyA9IE9iamVjdEdyaWQuZ2V0RmlsdGVycyhvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBmYWxzZSwgbnVsbCwgbnVsbClcblx0XHRcdHVybCA9IFwiL2FwaS92NC93b3JkX3RlbXBsYXRlcy9cIiArIGFjdGlvbi53b3JkX3RlbXBsYXRlICsgXCIvcHJpbnRcIiArIFwiP2ZpbHRlcnM9XCIgKyBTdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5KGZpbHRlcnMpO1xuXHRcdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XG5cblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiBhY3Rpb24/LnRvZG9cblx0XHRcdGlmIHR5cGVvZiBhY3Rpb24udG9kbyA9PSBcInN0cmluZ1wiXG5cdFx0XHRcdHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dXG5cdFx0XHRlbHNlIGlmIHR5cGVvZiBhY3Rpb24udG9kbyA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0dG9kbyA9IGFjdGlvbi50b2RvXHRcblx0XHRcdGlmICFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkXG5cdFx0XHRcdHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRpZiB0b2RvXG5cdFx0XHRcdCMgaXRlbV9lbGVtZW505Li656m65pe25bqU6K+l6K6+572u6buY6K6k5YC877yI5a+56LGh55qEbmFtZeWtl+aute+8ie+8jOWQpuWImW1vcmVBcmdz5ou/5Yiw55qE5ZCO57ut5Y+C5pWw5L2N572u5bCx5LiN5a+5XG5cdFx0XHRcdGl0ZW1fZWxlbWVudCA9IGlmIGl0ZW1fZWxlbWVudCB0aGVuIGl0ZW1fZWxlbWVudCBlbHNlIFwiXCJcblx0XHRcdFx0bW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpXG5cdFx0XHRcdHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncylcblx0XHRcdFx0dG9kby5hcHBseSB7XG5cdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0cmVjb3JkX2lkOiByZWNvcmRfaWRcblx0XHRcdFx0XHRvYmplY3Q6IG9ialxuXHRcdFx0XHRcdGFjdGlvbjogYWN0aW9uXG5cdFx0XHRcdFx0aXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnRcblx0XHRcdFx0XHRyZWNvcmQ6IHJlY29yZFxuXHRcdFx0XHR9LCB0b2RvQXJnc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSlcblx0XHRlbHNlXG5cdFx0XHR0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSlcblxuXG5cdF9kZWxldGVSZWNvcmQgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpLT5cblx0XHQjIGNvbnNvbGUubG9nKFwiPT09X2RlbGV0ZVJlY29yZD09PVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2ssIGNhbGxfYmFja19lcnJvcik7XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0cHJldmlvdXNEb2MgPSBGb3JtTWFuYWdlci5nZXRQcmV2aW91c0RvYyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAnZGVsZXRlJylcblx0XHRDcmVhdG9yLm9kYXRhLmRlbGV0ZSBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAoKS0+XG5cdFx0XHRpZiByZWNvcmRfdGl0bGVcblx0XHRcdFx0IyBpbmZvID0gb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiICsgXCLlt7LliKDpmaRcIlxuXHRcdFx0XHRpbmZvID10IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVfc3VjXCIsIG9iamVjdC5sYWJlbCArIFwiXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbmZvID0gdCgnY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfc3VjJylcblx0XHRcdHRvYXN0ci5zdWNjZXNzIGluZm9cblx0XHRcdGlmIGNhbGxfYmFjayBhbmQgdHlwZW9mIGNhbGxfYmFjayA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0Y2FsbF9iYWNrKClcblxuXHRcdFx0Rm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtfaWQ6IHJlY29yZF9pZCwgcHJldmlvdXNEb2M6IHByZXZpb3VzRG9jfSlcblx0XHQsIChlcnJvciktPlxuXHRcdFx0aWYgY2FsbF9iYWNrX2Vycm9yIGFuZCB0eXBlb2YgY2FsbF9iYWNrX2Vycm9yID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRjYWxsX2JhY2tfZXJyb3IoKVxuXHRcdFx0Rm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdlcnJvcicsIHtfaWQ6IHJlY29yZF9pZCwgZXJyb3I6IGVycm9yfSlcblxuXHRDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyA9IChyZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0cmVsYXRlT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSlcblx0XHRjb2xsZWN0aW9uX25hbWUgPSByZWxhdGVPYmplY3QubGFiZWxcblx0XHRjb2xsZWN0aW9uID0gXCJDcmVhdG9yLkNvbGxlY3Rpb25zLiN7Q3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSkuX2NvbGxlY3Rpb25fbmFtZX1cIlxuXHRcdGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0Y3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRcdGlkcyA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cdFx0aW5pdGlhbFZhbHVlcyA9IHt9O1xuXHRcdGlmIGlkcz8ubGVuZ3RoXG5cdFx0XHQjIOWIl+ihqOaciemAieS4remhueaXtu+8jOWPluesrOS4gOS4qumAieS4remhue+8jOWkjeWItuWFtuWGheWuueWIsOaWsOW7uueql+WPo+S4rVxuXHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcblx0XHRcdHJlY29yZF9pZCA9IGlkc1swXVxuXHRcdFx0ZG9jID0gQ3JlYXRvci5vZGF0YS5nZXQocmVsYXRlZF9vYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0aW5pdGlhbFZhbHVlcyA9IGRvY1xuXHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cblx0XHRcdFNlc3Npb24uc2V0ICdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0ZGVmYXVsdERvYyA9IEZvcm1NYW5hZ2VyLmdldFJlbGF0ZWRJbml0aWFsVmFsdWVzKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lKTtcblx0XHRcdGlmICFfLmlzRW1wdHkoZGVmYXVsdERvYylcblx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IGRlZmF1bHREb2Ncblx0XHRpZiByZWxhdGVPYmplY3Q/LnZlcnNpb24gPj0gMlxuXHRcdFx0cmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuXHRcdFx0XHRuYW1lOiBcIiN7cmVsYXRlZF9vYmplY3RfbmFtZX1fc3RhbmRhcmRfbmV3X2Zvcm1cIixcblx0XHRcdFx0b2JqZWN0QXBpTmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcblx0XHRcdFx0dGl0bGU6ICfmlrDlu7ogJyArIHJlbGF0ZU9iamVjdC5sYWJlbCxcblx0XHRcdFx0aW5pdGlhbFZhbHVlczogaW5pdGlhbFZhbHVlcyxcblx0XHRcdFx0YWZ0ZXJJbnNlcnQ6IChyZXN1bHQpLT5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpLT5cblx0XHRcdFx0XHRcdCMgT2JqZWN0Rm9ybeaciee8k+WtmO+8jOaWsOW7uuWtkOihqOiusOW9leWPr+iDveS8muacieaxh+aAu+Wtl+aute+8jOmcgOimgeWIt+aWsOihqOWNleaVsOaNrlxuXHRcdFx0XHRcdFx0aWYgQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkudmVyc2lvbiA+IDFcblx0XHRcdFx0XHRcdFx0U3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZClcblx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XG5cdFx0XHRcdFx0LCAxKTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0sIG51bGwsIHtpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnfSlcblxuXG5cdFx0aWYgaWRzPy5sZW5ndGhcblx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXG5cdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cblx0XHRcdFNlc3Npb24uc2V0ICdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0aWYgIV8uaXNFbXB0eShpbml0aWFsVmFsdWVzKVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXG5cblx0XHRTZXNzaW9uLnNldChcImFjdGlvbl9maWVsZHNcIiwgdW5kZWZpbmVkKVxuXHRcdFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25cIiwgY29sbGVjdGlvbilcblx0XHRTZXNzaW9uLnNldChcImFjdGlvbl9jb2xsZWN0aW9uX25hbWVcIiwgY29sbGVjdGlvbl9uYW1lKVxuXHRcdFNlc3Npb24uc2V0KFwiYWN0aW9uX3NhdmVfYW5kX2luc2VydFwiLCBmYWxzZSlcblx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0JChcIi5jcmVhdG9yLWFkZC1yZWxhdGVkXCIpLmNsaWNrKClcblx0XHRyZXR1cm5cblxuXHRDcmVhdG9yLmFjdGlvbnMgXG5cdFx0IyDlnKjmraTlrprkuYnlhajlsYAgYWN0aW9uc1xuXHRcdFwic3RhbmRhcmRfcXVlcnlcIjogKCktPlxuXHRcdFx0TW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpXG5cblx0XHRcInN0YW5kYXJkX25ld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHQjIGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0XHRcdCMgaWYgY3VycmVudF9yZWNvcmRfaWRcblx0XHRcdCMgXHQjIGFtaXMg55u45YWz5a2Q6KGo5Y+z5LiK6KeS5paw5bu6XG5cdFx0XHQjIFx0Q3JlYXRvci5yZWxhdGVkT2JqZWN0U3RhbmRhcmROZXcob2JqZWN0X25hbWUpXG5cdFx0XHQjIFx0cmV0dXJuIFxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuXHRcdFx0Z3JpZE5hbWUgPSB0aGlzLmFjdGlvbi5ncmlkTmFtZTtcblx0XHRcdGlzUmVsYXRlZCA9IHRoaXMuYWN0aW9uLmlzUmVsYXRlZDtcblx0XHRcdGlmIGlzUmVsYXRlZFxuXHRcdFx0XHRyZWxhdGVkRmllbGROYW1lID0gdGhpcy5hY3Rpb24ucmVsYXRlZEZpZWxkTmFtZTtcblx0XHRcdFx0bWFzdGVyUmVjb3JkSWQgPSB0aGlzLmFjdGlvbi5tYXN0ZXJSZWNvcmRJZDtcblx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IHRoaXMuYWN0aW9uLmluaXRpYWxWYWx1ZXNcblx0XHRcdFx0aWYgIWluaXRpYWxWYWx1ZXNcblx0XHRcdFx0XHRpbml0aWFsVmFsdWVzID0ge307XG5cdFx0XHRcdFx0aW5pdGlhbFZhbHVlc1tyZWxhdGVkRmllbGROYW1lXSA9IG1hc3RlclJlY29yZElkXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluaXRpYWxWYWx1ZXM9e31cblx0XHRcdFx0aWYoZ3JpZE5hbWUpXG5cdFx0XHRcdFx0c2VsZWN0ZWRSb3dzID0gd2luZG93LmdyaWRSZWZzP1tncmlkTmFtZV0uY3VycmVudD8uYXBpPy5nZXRTZWxlY3RlZFJvd3MoKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c2VsZWN0ZWRSb3dzID0gd2luZG93LmdyaWRSZWY/LmN1cnJlbnQ/LmFwaT8uZ2V0U2VsZWN0ZWRSb3dzKClcdFxuXHRcdFx0XHRcblx0XHRcdFx0aWYgc2VsZWN0ZWRSb3dzPy5sZW5ndGhcblx0XHRcdFx0XHRyZWNvcmRfaWQgPSBzZWxlY3RlZFJvd3NbMF0uX2lkO1xuXHRcdFx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKVxuXG5cdFx0XHRpZiBvYmplY3Q/LnZlcnNpb24gPj0gMlxuXHRcdFx0XHRyZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmROZXcucmVuZGVyKFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpLCBvYmplY3RfbmFtZSwgdCgnTmV3JykgKyAnICcgKyBvYmplY3QubGFiZWwsIGluaXRpYWxWYWx1ZXMgLCB7Z3JpZE5hbWU6IGdyaWROYW1lfSk7XG5cdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdGlmIHNlbGVjdGVkUm93cz8ubGVuZ3RoXG5cdFx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXG5cdFx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblx0XHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0JChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpXG5cdFx0XHRyZXR1cm4gXG5cblx0XHRcInN0YW5kYXJkX29wZW5fdmlld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZilcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XCJzdGFuZGFyZF9lZGl0XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG5cdFx0XHRcdGlmIG9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRcdFx0cmV0dXJuIFN0ZWVkb3MuUGFnZS5Gb3JtLlN0YW5kYXJkRWRpdC5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCB0KCdFZGl0JykgKyAnICcgKyBvYmplY3QubGFiZWwsIHJlY29yZF9pZCwge1xuXHRcdFx0XHRcdFx0Z3JpZE5hbWU6IHRoaXMuYWN0aW9uLmdyaWROYW1lXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlXG4jXHRcdFx0XHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHJlY29yZFxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAncmVsb2FkX2R4bGlzdCcsIGZhbHNlXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0XHRcdFx0JChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdFx0XHRcdCQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpXG5cblx0XHRcInN0YW5kYXJkX2RlbGV0ZVwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKS0+XG5cdFx0XHRncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuXHRcdFx0IyBjb25zb2xlLmxvZyhcIj09PXN0YW5kYXJkX2RlbGV0ZT09PVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spO1xuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtfaWQ6IHJlY29yZF9pZH0pXG5cdFx0XHRcdGlmICFiZWZvcmVIb29rXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0XHRuYW1lRmllbGQgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVkgfHwgXCJuYW1lXCJcblxuXHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBcImFsbFwiXG5cblx0XHRcdGlmKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlKVxuXHRcdFx0XHRyZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGVbbmFtZUZpZWxkXVxuXHRcdFx0XG5cdFx0XHRpZiByZWNvcmQgJiYgIXJlY29yZF90aXRsZVxuXHRcdFx0XHRyZWNvcmRfdGl0bGUgPSByZWNvcmRbbmFtZUZpZWxkXVxuXHRcdFx0XG5cdFx0XHRpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCJcblx0XHRcdGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCJcblxuXHRcdFx0dW5sZXNzIHJlY29yZF9pZFxuXHRcdFx0XHRpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X3N3YWxfdGl0bGVcIlxuXHRcdFx0XHRpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90ZXh0XCJcblxuXHRcdFx0XHQjIOWmguaenOaYr+aJuemHj+WIoOmZpO+8jOWImeS8oOWFpeeahGxpc3Rfdmlld19pZOS4uuWIl+ihqOinhuWbvueahG5hbWXvvIznlKjkuo7ojrflj5bliJfooajpgInkuK3poblcblx0XHRcdFx0IyDkuLvliJfooajop4TliJnmmK9cImxpc3R2aWV3XyN7b2JqZWN0X25hbWV9XyN7bGlzdF92aWV3X2lkfVwi77yM55u45YWz6KGo6KeE5YiZ5pivXCJyZWxhdGVkX2xpc3R2aWV3XyN7b2JqZWN0X25hbWV9XyN7cmVsYXRlZF9vYmplY3RfbmFtZX1fI3tyZWxhdGVkX2ZpZWxkX25hbWV9XCJcblx0XHRcdFx0c2VsZWN0ZWRSZWNvcmRzID0gU3RlZWRvc1VJLmdldFRhYmxlU2VsZWN0ZWRSb3dzKGdyaWROYW1lIHx8IGxpc3Rfdmlld19pZClcblx0XHRcdFx0aWYgIXNlbGVjdGVkUmVjb3JkcyB8fCAhc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aFxuXHRcdFx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9ub19zZWxlY3Rpb25cIikpXG5cdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdGlmIHJlY29yZF90aXRsZVxuXHRcdFx0XHR0ZXh0ID0gdCBpMThuVGV4dEtleSwgXCIje29iamVjdC5sYWJlbH0gXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0ZXh0ID0gdCBpMThuVGV4dEtleSwgXCIje29iamVjdC5sYWJlbH1cIlxuXHRcdFx0c3dhbFxuXHRcdFx0XHR0aXRsZTogdCBpMThuVGl0bGVLZXksIFwiI3tvYmplY3QubGFiZWx9XCJcblx0XHRcdFx0dGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz4je3RleHR9PC9kaXY+XCJcblx0XHRcdFx0aHRtbDogdHJ1ZVxuXHRcdFx0XHRzaG93Q2FuY2VsQnV0dG9uOnRydWVcblx0XHRcdFx0Y29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpXG5cdFx0XHRcdGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXG5cdFx0XHRcdChvcHRpb24pIC0+XG5cdFx0XHRcdFx0aWYgb3B0aW9uXG5cdFx0XHRcdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0XHRcdFx0IyDljZXmnaHorrDlvZXliKDpmaRcblx0XHRcdFx0XHRcdFx0X2RlbGV0ZVJlY29yZCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0IyDmlofku7bniYjmnKzkuLpcImNmcy5maWxlcy5maWxlcmVjb3JkXCLvvIzpnIDopoHmm7/mjaLkuLpcImNmcy1maWxlcy1maWxlcmVjb3JkXCJcblx0XHRcdFx0XHRcdFx0XHRncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csXCItXCIpXG5cdFx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGdyaWRDb250YWluZXI/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgd2luZG93Lm9wZW5lclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc09wZW5lclJlbW92ZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0XHQjIE9iamVjdEZvcm3mnInnvJPlrZjvvIzliKDpmaTlrZDooajorrDlvZXlj6/og73kvJrmnInmsYfmgLvlrZfmrrXvvIzpnIDopoHliLfmlrDooajljZXmlbDmja5cblx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBjdXJyZW50X29iamVjdF9uYW1lICYmIENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpPy52ZXJzaW9uID4gMVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdF9uYW1lICE9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuXHRcdFx0XHRcdFx0XHRcdGNhdGNoIF9lXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKF9lKTtcblx0XHRcdFx0XHRcdFx0XHRpZiBncmlkQ29udGFpbmVyPy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJylcblx0XHRcdFx0XHRcdFx0XHRpZiBkeERhdGFHcmlkSW5zdGFuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdF9uYW1lICE9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyBcdFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSlcblx0XHRcdFx0XHRcdFx0XHRyZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0XHRcdHRlbXBOYXZSZW1vdmVkID0gQ3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKSAj5peg6K665piv5Zyo6K6w5b2V6K+m57uG55WM6Z2i6L+Y5piv5YiX6KGo55WM6Z2i5omn6KGM5Yig6Zmk5pON5L2c77yM6YO95Lya5oqK5Li05pe25a+86Iiq5Yig6Zmk5o6JXG5cdFx0XHRcdFx0XHRcdFx0aWYgaXNPcGVuZXJSZW1vdmUgb3IgIWR4RGF0YUdyaWRJbnN0YW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNPcGVuZXJSZW1vdmVcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LmNsb3NlKClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpIGFuZCBsaXN0X3ZpZXdfaWQgIT0gJ2NhbGVuZGFyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVubGVzcyB0ZW1wTmF2UmVtb3ZlZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c56Gu5a6e5Yig6Zmk5LqG5Li05pe25a+86Iiq77yM5bCx5Y+v6IO95bey57uP6YeN5a6a5ZCR5Yiw5LiK5LiA5Liq6aG16Z2i5LqG77yM5rKh5b+F6KaB5YaN6YeN5a6a5ZCR5LiA5qyhXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5nbyBcIi9hcHAvI3thcHBpZH0vI3tvYmplY3RfbmFtZX0vZ3JpZC8je2xpc3Rfdmlld19pZH1cIlxuXHRcdFx0XHRcdFx0XHRcdGlmIGNhbGxfYmFjayBhbmQgdHlwZW9mIGNhbGxfYmFjayA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0XHRcdFx0XHRcdGNhbGxfYmFjaygpXHRcdFx0XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdCMg5om56YeP5Yig6ZmkXG5cdFx0XHRcdFx0XHRcdGlmIHNlbGVjdGVkUmVjb3JkcyAmJiBzZWxlY3RlZFJlY29yZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJsb2FkaW5nXCIpXG5cdFx0XHRcdFx0XHRcdFx0ZGVsZXRlQ291bnRlciA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0YWZ0ZXJCYXRjaGVzRGVsZXRlID0gKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlQ291bnRlcisrXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBkZWxldGVDb3VudGVyID49IHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyBjb25zb2xlLmxvZyhcImRlbGV0ZUNvdW50ZXIsIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGg9PT1cIiwgZGVsZXRlQ291bnRlciwgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwibG9hZGluZ1wiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuXHRcdFx0XHRcdFx0XHRcdHNlbGVjdGVkUmVjb3Jkcy5mb3JFYWNoIChyZWNvcmQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZF9pZCA9IHJlY29yZC5faWRcblx0XHRcdFx0XHRcdFx0XHRcdGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtfaWQ6IHJlY29yZF9pZH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAhYmVmb3JlSG9va1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRUaXRsZSA9IHJlY29yZFtuYW1lRmllbGRdIHx8IHJlY29yZF9pZFxuXHRcdFx0XHRcdFx0XHRcdFx0X2RlbGV0ZVJlY29yZCBvYmplY3RfbmFtZSwgcmVjb3JkLl9pZCwgcmVjb3JkVGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCAoKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpICPml6DorrrmmK/lnKjorrDlvZXor6bnu4bnlYzpnaLov5jmmK/liJfooajnlYzpnaLmiafooYzliKDpmaTmk43kvZzvvIzpg73kvJrmiorkuLTml7blr7zoiKrliKDpmaTmjolcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWZ0ZXJCYXRjaGVzRGVsZXRlKClcblx0XHRcdFx0XHRcdFx0XHRcdCksICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0YWZ0ZXJCYXRjaGVzRGVsZXRlKCkiLCJ2YXIgX2RlbGV0ZVJlY29yZDtcblxuQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsYmFjaykge1xuICAgIHZhciBmaWx0ZXJzLCBtb3JlQXJncywgb2JqLCB0b2RvLCB0b2RvQXJncywgdXJsO1xuICAgIGlmIChhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT09ICd3b3JkLXByaW50Jykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBmaWx0ZXJzID0gWydfaWQnLCAnPScsIHJlY29yZF9pZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWx0ZXJzID0gT2JqZWN0R3JpZC5nZXRGaWx0ZXJzKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGZhbHNlLCBudWxsLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIHVybCA9IFwiL2FwaS92NC93b3JkX3RlbXBsYXRlcy9cIiArIGFjdGlvbi53b3JkX3RlbXBsYXRlICsgXCIvcHJpbnRcIiArIFwiP2ZpbHRlcnM9XCIgKyBTdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5KGZpbHRlcnMpO1xuICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMCkge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9kbyA9IGFjdGlvbi50b2RvO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgaXRlbV9lbGVtZW50ID0gaXRlbV9lbGVtZW50ID8gaXRlbV9lbGVtZW50IDogXCJcIjtcbiAgICAgICAgbW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuICAgICAgICB0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpO1xuICAgICAgICByZXR1cm4gdG9kby5hcHBseSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdDogb2JqLFxuICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgIGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50LFxuICAgICAgICAgIHJlY29yZDogcmVjb3JkXG4gICAgICAgIH0sIHRvZG9BcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgfVxuICB9O1xuICBfZGVsZXRlUmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpIHtcbiAgICB2YXIgb2JqZWN0LCBwcmV2aW91c0RvYztcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgcHJldmlvdXNEb2MgPSBGb3JtTWFuYWdlci5nZXRQcmV2aW91c0RvYyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAnZGVsZXRlJyk7XG4gICAgcmV0dXJuIENyZWF0b3Iub2RhdGFbXCJkZWxldGVcIl0ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5mbztcbiAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgaW5mbyA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgKFwiXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKTtcbiAgICAgIH1cbiAgICAgIHRvYXN0ci5zdWNjZXNzKGluZm8pO1xuICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbF9iYWNrKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtcbiAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY1xuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGlmIChjYWxsX2JhY2tfZXJyb3IgJiYgdHlwZW9mIGNhbGxfYmFja19lcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxfYmFja19lcnJvcigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7XG4gICAgICAgIF9pZDogcmVjb3JkX2lkLFxuICAgICAgICBlcnJvcjogZXJyb3JcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyA9IGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgY29sbGVjdGlvbl9uYW1lLCBjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCwgZGVmYXVsdERvYywgZG9jLCBpZHMsIGluaXRpYWxWYWx1ZXMsIHJlY29yZF9pZCwgcmVsYXRlT2JqZWN0O1xuICAgIHJlbGF0ZU9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgIGNvbGxlY3Rpb25fbmFtZSA9IHJlbGF0ZU9iamVjdC5sYWJlbDtcbiAgICBjb2xsZWN0aW9uID0gXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpLl9jb2xsZWN0aW9uX25hbWUpO1xuICAgIGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG4gICAgaWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgaW5pdGlhbFZhbHVlcyA9IHt9O1xuICAgIGlmIChpZHMgIT0gbnVsbCA/IGlkcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgIHJlY29yZF9pZCA9IGlkc1swXTtcbiAgICAgIGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBpbml0aWFsVmFsdWVzID0gZG9jO1xuICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0RG9jID0gRm9ybU1hbmFnZXIuZ2V0UmVsYXRlZEluaXRpYWxWYWx1ZXMoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFfLmlzRW1wdHkoZGVmYXVsdERvYykpIHtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IGRlZmF1bHREb2M7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgocmVsYXRlT2JqZWN0ICE9IG51bGwgPyByZWxhdGVPYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgcmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuICAgICAgICBuYW1lOiByZWxhdGVkX29iamVjdF9uYW1lICsgXCJfc3RhbmRhcmRfbmV3X2Zvcm1cIixcbiAgICAgICAgb2JqZWN0QXBpTmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgdGl0bGU6ICfmlrDlu7ogJyArIHJlbGF0ZU9iamVjdC5sYWJlbCxcbiAgICAgICAgaW5pdGlhbFZhbHVlczogaW5pdGlhbFZhbHVlcyxcbiAgICAgICAgYWZ0ZXJJbnNlcnQ6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkudmVyc2lvbiA+IDEpIHtcbiAgICAgICAgICAgICAgU3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gRmxvd1JvdXRlci5yZWxvYWQoKTtcbiAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSwgbnVsbCwge1xuICAgICAgICBpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghXy5pc0VtcHR5KGluaXRpYWxWYWx1ZXMpKSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgfVxuICAgIH1cbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9maWVsZHNcIiwgdm9pZCAwKTtcbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9jb2xsZWN0aW9uXCIsIGNvbGxlY3Rpb24pO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25fbmFtZVwiLCBjb2xsZWN0aW9uX25hbWUpO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX3NhdmVfYW5kX2luc2VydFwiLCBmYWxzZSk7XG4gICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICQoXCIuY3JlYXRvci1hZGQtcmVsYXRlZFwiKS5jbGljaygpO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmFjdGlvbnMoe1xuICAgIFwic3RhbmRhcmRfcXVlcnlcIjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9uZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgZ3JpZE5hbWUsIGluaXRpYWxWYWx1ZXMsIGlzUmVsYXRlZCwgbWFzdGVyUmVjb3JkSWQsIG9iamVjdCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWxhdGVkRmllbGROYW1lLCBzZWxlY3RlZFJvd3M7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuICAgICAgaXNSZWxhdGVkID0gdGhpcy5hY3Rpb24uaXNSZWxhdGVkO1xuICAgICAgaWYgKGlzUmVsYXRlZCkge1xuICAgICAgICByZWxhdGVkRmllbGROYW1lID0gdGhpcy5hY3Rpb24ucmVsYXRlZEZpZWxkTmFtZTtcbiAgICAgICAgbWFzdGVyUmVjb3JkSWQgPSB0aGlzLmFjdGlvbi5tYXN0ZXJSZWNvcmRJZDtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IHRoaXMuYWN0aW9uLmluaXRpYWxWYWx1ZXM7XG4gICAgICAgIGlmICghaW5pdGlhbFZhbHVlcykge1xuICAgICAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgICAgICBpbml0aWFsVmFsdWVzW3JlbGF0ZWRGaWVsZE5hbWVdID0gbWFzdGVyUmVjb3JkSWQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgICAgaWYgKGdyaWROYW1lKSB7XG4gICAgICAgICAgc2VsZWN0ZWRSb3dzID0gKHJlZiA9IHdpbmRvdy5ncmlkUmVmcykgIT0gbnVsbCA/IChyZWYxID0gcmVmW2dyaWROYW1lXS5jdXJyZW50KSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmFwaSkgIT0gbnVsbCA/IHJlZjIuZ2V0U2VsZWN0ZWRSb3dzKCkgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZWN0ZWRSb3dzID0gKHJlZjMgPSB3aW5kb3cuZ3JpZFJlZikgIT0gbnVsbCA/IChyZWY0ID0gcmVmMy5jdXJyZW50KSAhPSBudWxsID8gKHJlZjUgPSByZWY0LmFwaSkgIT0gbnVsbCA/IHJlZjUuZ2V0U2VsZWN0ZWRSb3dzKCkgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGVkUm93cyAhPSBudWxsID8gc2VsZWN0ZWRSb3dzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgIHJlY29yZF9pZCA9IHNlbGVjdGVkUm93c1swXS5faWQ7XG4gICAgICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICAgICAgaW5pdGlhbFZhbHVlcyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbml0aWFsVmFsdWVzID0gRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICgob2JqZWN0ICE9IG51bGwgPyBvYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgICByZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmROZXcucmVuZGVyKFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpLCBvYmplY3RfbmFtZSwgdCgnTmV3JykgKyAnICcgKyBvYmplY3QubGFiZWwsIGluaXRpYWxWYWx1ZXMsIHtcbiAgICAgICAgICBncmlkTmFtZTogZ3JpZE5hbWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKHNlbGVjdGVkUm93cyAhPSBudWxsID8gc2VsZWN0ZWRSb3dzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICB9XG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBGbG93Um91dGVyLnJlZGlyZWN0KGhyZWYpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9lZGl0XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIGlmIChyZWNvcmRfaWQpIHtcbiAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgICBpZiAoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0LnZlcnNpb24gOiB2b2lkIDApID49IDIpIHtcbiAgICAgICAgICByZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmRFZGl0LnJlbmRlcihTZXNzaW9uLmdldChcImFwcF9pZFwiKSwgb2JqZWN0X25hbWUsIHQoJ0VkaXQnKSArICcgJyArIG9iamVjdC5sYWJlbCwgcmVjb3JkX2lkLCB7XG4gICAgICAgICAgICBncmlkTmFtZTogdGhpcy5hY3Rpb24uZ3JpZE5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlKSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9kZWxldGVcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKSB7XG4gICAgICB2YXIgYmVmb3JlSG9vaywgZ3JpZE5hbWUsIGkxOG5UZXh0S2V5LCBpMThuVGl0bGVLZXksIG5hbWVGaWVsZCwgb2JqZWN0LCBzZWxlY3RlZFJlY29yZHMsIHRleHQ7XG4gICAgICBncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghYmVmb3JlSG9vaykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgbmFtZUZpZWxkID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZIHx8IFwibmFtZVwiO1xuICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgICB9XG4gICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICBsaXN0X3ZpZXdfaWQgPSBcImFsbFwiO1xuICAgICAgfVxuICAgICAgaWYgKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZVtuYW1lRmllbGRdO1xuICAgICAgfVxuICAgICAgaWYgKHJlY29yZCAmJiAhcmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZFtuYW1lRmllbGRdO1xuICAgICAgfVxuICAgICAgaTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZVwiO1xuICAgICAgaTE4blRleHRLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIjtcbiAgICAgIGlmICghcmVjb3JkX2lkKSB7XG4gICAgICAgIGkxOG5UaXRsZUtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90aXRsZVwiO1xuICAgICAgICBpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90ZXh0XCI7XG4gICAgICAgIHNlbGVjdGVkUmVjb3JkcyA9IFN0ZWVkb3NVSS5nZXRUYWJsZVNlbGVjdGVkUm93cyhncmlkTmFtZSB8fCBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICBpZiAoIXNlbGVjdGVkUmVjb3JkcyB8fCAhc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgIHRvYXN0ci53YXJuaW5nKHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9ub19zZWxlY3Rpb25cIikpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICB0ZXh0ID0gdChpMThuVGV4dEtleSwgb2JqZWN0LmxhYmVsICsgXCIgXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IHQoaTE4blRleHRLZXksIFwiXCIgKyBvYmplY3QubGFiZWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN3YWwoe1xuICAgICAgICB0aXRsZTogdChpMThuVGl0bGVLZXksIFwiXCIgKyBvYmplY3QubGFiZWwpLFxuICAgICAgICB0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPlwiICsgdGV4dCArIFwiPC9kaXY+XCIsXG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKSxcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcbiAgICAgIH0sIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB2YXIgYWZ0ZXJCYXRjaGVzRGVsZXRlLCBkZWxldGVDb3VudGVyO1xuICAgICAgICBpZiAob3B0aW9uKSB7XG4gICAgICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICAgICAgcmV0dXJuIF9kZWxldGVSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciBfZSwgYXBwaWQsIGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkLCBkeERhdGFHcmlkSW5zdGFuY2UsIGdyaWRDb250YWluZXIsIGdyaWRPYmplY3ROYW1lQ2xhc3MsIGlzT3BlbmVyUmVtb3ZlLCByZWNvcmRVcmwsIHJlZiwgdGVtcE5hdlJlbW92ZWQ7XG4gICAgICAgICAgICAgIGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZywgXCItXCIpO1xuICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgIGlmICghKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XG4gICAgICAgICAgICAgICAgICBpc09wZW5lclJlbW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgICAgICAgICAgICAgY3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudF9vYmplY3RfbmFtZSAmJiAoKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLnZlcnNpb24gOiB2b2lkIDApID4gMSkge1xuICAgICAgICAgICAgICAgICAgU3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChGbG93Um91dGVyLmN1cnJlbnQoKS5yb3V0ZS5wYXRoLmVuZHNXaXRoKFwiLzpyZWNvcmRfaWRcIikpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RfbmFtZSAhPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgICAgX2UgPSBlcnJvcjE7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihfZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RfbmFtZSAhPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgICAgICAgdGVtcE5hdlJlbW92ZWQgPSBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpO1xuICAgICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUgfHwgIWR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSkge1xuICAgICAgICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZWNvcmRfaWQgPT09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpICYmIGxpc3Rfdmlld19pZCAhPT0gJ2NhbGVuZGFyJykge1xuICAgICAgICAgICAgICAgICAgYXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgICAgICAgICAgICAgICAgIGlmICghdGVtcE5hdlJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHAvXCIgKyBhcHBpZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbF9iYWNrKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRSZWNvcmRzICYmIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJsb2FkaW5nXCIpO1xuICAgICAgICAgICAgICBkZWxldGVDb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgYWZ0ZXJCYXRjaGVzRGVsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlQ291bnRlcisrO1xuICAgICAgICAgICAgICAgIGlmIChkZWxldGVDb3VudGVyID49IHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwibG9hZGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkUmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICAgIHZhciByZWNvcmRUaXRsZTtcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQgPSByZWNvcmQuX2lkO1xuICAgICAgICAgICAgICAgIGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtcbiAgICAgICAgICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFiZWZvcmVIb29rKSB7XG4gICAgICAgICAgICAgICAgICBhZnRlckJhdGNoZXNEZWxldGUoKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVjb3JkVGl0bGUgPSByZWNvcmRbbmFtZUZpZWxkXSB8fCByZWNvcmRfaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9kZWxldGVSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZC5faWQsIHJlY29yZFRpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIHJlY29yZFVybDtcbiAgICAgICAgICAgICAgICAgIHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICAgICAgICAgICAgQ3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBhZnRlckJhdGNoZXNEZWxldGUoKTtcbiAgICAgICAgICAgICAgICB9KSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gYWZ0ZXJCYXRjaGVzRGVsZXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
