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
      var apiService, broker, ex, metadataService, pageService, projectService, standardObjectsDir, standardObjectsPackageLoaderService, steedosService, uiService;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiQVBJU2VydmljZSIsIk1ldGFkYXRhU2VydmljZSIsImNvbmZpZyIsImUiLCJtb2xlY3VsZXIiLCJvYmplY3RxbCIsInBhY2thZ2VMb2FkZXIiLCJwYWNrYWdlU2VydmljZSIsInBhdGgiLCJzZXR0aW5ncyIsInN0ZWVkb3NDb3JlIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJyZXF1aXJlIiwiZ2V0U3RlZWRvc0NvbmZpZyIsImJ1aWx0X2luX3BsdWdpbnMiLCJwbHVnaW5zIiwiTWV0ZW9yIiwic3RhcnR1cCIsImFwaVNlcnZpY2UiLCJicm9rZXIiLCJleCIsIm1ldGFkYXRhU2VydmljZSIsInBhZ2VTZXJ2aWNlIiwicHJvamVjdFNlcnZpY2UiLCJzdGFuZGFyZE9iamVjdHNEaXIiLCJzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSIsInN0ZWVkb3NTZXJ2aWNlIiwidWlTZXJ2aWNlIiwiU2VydmljZUJyb2tlciIsIm5hbWVzcGFjZSIsIm5vZGVJRCIsIm1ldGFkYXRhIiwidHJhbnNwb3J0ZXIiLCJUUkFOU1BPUlRFUiIsImNhY2hlciIsIkNBQ0hFUiIsImxvZ0xldmVsIiwic2VyaWFsaXplciIsInJlcXVlc3RUaW1lb3V0IiwibWF4Q2FsbExldmVsIiwiaGVhcnRiZWF0SW50ZXJ2YWwiLCJoZWFydGJlYXRUaW1lb3V0IiwiY29udGV4dFBhcmFtc0Nsb25pbmciLCJ0cmFja2luZyIsImVuYWJsZWQiLCJzaHV0ZG93blRpbWVvdXQiLCJkaXNhYmxlQmFsYW5jZXIiLCJyZWdpc3RyeSIsInN0cmF0ZWd5IiwicHJlZmVyTG9jYWwiLCJidWxraGVhZCIsImNvbmN1cnJlbmN5IiwibWF4UXVldWVTaXplIiwidmFsaWRhdG9yIiwiZXJyb3JIYW5kbGVyIiwidHJhY2luZyIsImV4cG9ydGVyIiwidHlwZSIsIm9wdGlvbnMiLCJsb2dnZXIiLCJjb2xvcnMiLCJ3aWR0aCIsImdhdWdlV2lkdGgiLCJza2lwUHJvY2Vzc0V2ZW50UmVnaXN0cmF0aW9uIiwiY3JlYXRlZCIsIndhcm4iLCJjbGVhbiIsImluaXQiLCJjcmVhdGVTZXJ2aWNlIiwibmFtZSIsIm1peGlucyIsInBvcnQiLCJzdGFydGVkIiwic2V0VGltZW91dCIsImVtaXQiLCJnZXRTdGVlZG9zU2NoZW1hIiwiU3RhbmRhcmRPYmplY3RzUGF0aCIsInBhY2thZ2VJbmZvIiwid3JhcEFzeW5jIiwiY2IiLCJzdGFydCIsInRoZW4iLCJjb25uZWN0SGFuZGxlcnNFeHByZXNzIiwiZXhwcmVzcyIsIl9yZXN0YXJ0U2VydmljZSIsInVzZSIsInN0YXRpY1JvdXRlciIsIndhaXRGb3JTZXJ2aWNlcyIsImNvbnNvbGUiLCJsb2ciLCJTdGVlZG9zQXBpIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwicmVzb2x2ZSIsInJlamVjdCIsImVycm9yIiwiRmliZXIiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJsaXN0X3ZpZXdzIiwic3BhY2UiLCJnZXRDb2xsZWN0aW9uTmFtZSIsIl8iLCJjbG9uZSIsImNvbnZlcnRPYmplY3QiLCJPYmplY3QiLCJpbml0VHJpZ2dlcnMiLCJpbml0TGlzdFZpZXdzIiwiZ2V0T2JqZWN0TmFtZSIsImdldE9iamVjdCIsInNwYWNlX2lkIiwicmVmIiwicmVmMSIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJvYmplY3RzQnlOYW1lIiwiZ2V0T2JqZWN0QnlJZCIsIm9iamVjdF9pZCIsImZpbmRXaGVyZSIsIl9pZCIsInJlbW92ZU9iamVjdCIsImdldENvbGxlY3Rpb24iLCJzcGFjZUlkIiwiX2NvbGxlY3Rpb25fbmFtZSIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiZmllbGRzIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsImlzU3RyaW5nIiwiRm9ybXVsYXIiLCJjaGVja0Zvcm11bGEiLCJldmFsdWF0ZUZpbHRlcnMiLCJmaWx0ZXJzIiwic2VsZWN0b3IiLCJlYWNoIiwiZmlsdGVyIiwiYWN0aW9uIiwidmFsdWUiLCJsZW5ndGgiLCJpc0NvbW1vblNwYWNlIiwiZ2V0T3JkZXJseVNldEJ5SWRzIiwiZG9jcyIsImlkcyIsImlkX2tleSIsImhpdF9maXJzdCIsInZhbHVlcyIsImdldFByb3BlcnR5Iiwic29ydEJ5IiwiZG9jIiwiX2luZGV4Iiwic29ydGluZ01ldGhvZCIsInZhbHVlMSIsInZhbHVlMiIsImlzVmFsdWUxRW1wdHkiLCJpc1ZhbHVlMkVtcHR5IiwibG9jYWxlIiwia2V5IiwiRGF0ZSIsImdldFRpbWUiLCJTdGVlZG9zIiwidG9TdHJpbmciLCJsb2NhbGVDb21wYXJlIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfb2JqZWN0IiwicGVybWlzc2lvbnMiLCJyZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0TWFwIiwicmVsYXRlZF9vYmplY3RzIiwiaXNFbXB0eSIsIm9iak5hbWUiLCJpc09iamVjdCIsIm9iamVjdE5hbWUiLCJyZWxhdGVkX29iamVjdCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwicmVmZXJlbmNlX3RvIiwiZm9yZWlnbl9rZXkiLCJ3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCIsImVuYWJsZU9iak5hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJlbmFibGVfZmlsZXMiLCJwdXNoIiwic2ZzRmlsZXNPYmplY3QiLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImVuYWJsZV9hcHByb3ZhbHMiLCJlbmFibGVfcHJvY2VzcyIsImdldFVzZXJDb250ZXh0IiwiaXNVblNhZmVNb2RlIiwiVVNFUl9DT05URVhUIiwic3BhY2VfdXNlcl9vcmciLCJzdSIsInN1RmllbGRzIiwiRXJyb3IiLCJtb2JpbGUiLCJwb3NpdGlvbiIsImVtYWlsIiwiY29tcGFueSIsIm9yZ2FuaXphdGlvbiIsImNvbXBhbnlfaWQiLCJjb21wYW55X2lkcyIsInVzZXIiLCJmdWxsbmFtZSIsImdldFJlbGF0aXZlVXJsIiwidXJsIiwiaXNGdW5jdGlvbiIsImlzQ29yZG92YSIsInN0YXJ0c1dpdGgiLCJ0ZXN0IiwiX19tZXRlb3JfcnVudGltZV9jb25maWdfXyIsIlJPT1RfVVJMX1BBVEhfUFJFRklYIiwiZ2V0VXNlckNvbXBhbnlJZCIsImdldFVzZXJDb21wYW55SWRzIiwicHJvY2Vzc1Blcm1pc3Npb25zIiwicG8iLCJhbGxvd0NyZWF0ZSIsImFsbG93UmVhZCIsImFsbG93RWRpdCIsImFsbG93RGVsZXRlIiwidmlld0FsbFJlY29yZHMiLCJ2aWV3Q29tcGFueVJlY29yZHMiLCJtb2RpZnlDb21wYW55UmVjb3JkcyIsImFsbG93UmVhZEZpbGVzIiwidmlld0FsbEZpbGVzIiwiYWxsb3dDcmVhdGVGaWxlcyIsImFsbG93RWRpdEZpbGVzIiwiYWxsb3dEZWxldGVGaWxlcyIsIm1vZGlmeUFsbEZpbGVzIiwiZ2V0VGVtcGxhdGVTcGFjZUlkIiwidGVtcGxhdGVTcGFjZUlkIiwiZ2V0Q2xvdWRBZG1pblNwYWNlSWQiLCJjbG91ZEFkbWluU3BhY2VJZCIsImlzVGVtcGxhdGVTcGFjZSIsImlzQ2xvdWRBZG1pblNwYWNlIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsIm9wdGlvbnNfbGltaXQiLCJxdWVyeSIsInF1ZXJ5X29wdGlvbnMiLCJyZWNvcmRzIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsInBhcmFtcyIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJmaWx0ZXJRdWVyeSIsImxpbWl0IiwiZmluZCIsImZldGNoIiwicmVjb3JkIiwibGFiZWwiLCJtZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm94IiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJmbG93SWQiLCJoYXNoRGF0YSIsImlucyIsImluc0lkIiwicmVjb3JkX2lkIiwicmVkaXJlY3RfdXJsIiwicmVmMiIsInJlZjMiLCJyZWY0Iiwid29ya2Zsb3dVcmwiLCJ4X2F1dGhfdG9rZW4iLCJ4X3VzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsImJvZHkiLCJjaGVjayIsImluc3RhbmNlSWQiLCJmbG93IiwiaW5ib3hfdXNlcnMiLCJpbmNsdWRlcyIsImNjX3VzZXJzIiwib3V0Ym94X3VzZXJzIiwic3RhdGUiLCJzdWJtaXR0ZXIiLCJhcHBsaWNhbnQiLCJwZXJtaXNzaW9uTWFuYWdlciIsImdldEZsb3dQZXJtaXNzaW9ucyIsInNwYWNlcyIsIndlYnNlcnZpY2VzIiwid29ya2Zsb3ciLCJzZW5kUmVzdWx0IiwiY29kZSIsImRhdGEiLCJ1cGRhdGUiLCIkdW5zZXQiLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJnZXRJbml0V2lkdGhQZXJjZW50IiwiY29sdW1ucyIsIl9zY2hlbWEiLCJjb2x1bW5fbnVtIiwiaW5pdF93aWR0aF9wZXJjZW50IiwiZ2V0U2NoZW1hIiwiZmllbGRfbmFtZSIsImZpZWxkIiwiaXNfd2lkZSIsInBpY2siLCJhdXRvZm9ybSIsImdldEZpZWxkSXNXaWRlIiwiZ2V0VGFidWxhck9yZGVyIiwibGlzdF92aWV3X2lkIiwic2V0dGluZyIsIm1hcCIsImNvbHVtbiIsImhpZGRlbiIsImNvbXBhY3QiLCJvcmRlciIsImluZGV4IiwiZGVmYXVsdF9leHRyYV9jb2x1bW5zIiwiZXh0cmFfY29sdW1ucyIsImdldE9iamVjdERlZmF1bHRDb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyIsInVuaW9uIiwiZ2V0T2JqZWN0RGVmYXVsdFNvcnQiLCJUYWJ1bGFyU2VsZWN0ZWRJZHMiLCJjb252ZXJ0TGlzdFZpZXciLCJkZWZhdWx0X3ZpZXciLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfbmFtZSIsImRlZmF1bHRfY29sdW1ucyIsImRlZmF1bHRfbW9iaWxlX2NvbHVtbnMiLCJvaXRlbSIsIm1vYmlsZV9jb2x1bW5zIiwiaGFzIiwiaW5jbHVkZSIsImZpbHRlcl9zY29wZSIsInBhcnNlIiwiZm9yRWFjaCIsIl92YWx1ZSIsImdldFJlbGF0ZWRMaXN0IiwibGF5b3V0UmVsYXRlZExpc3QiLCJsaXN0IiwibWFwTGlzdCIsIm9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyIsInJlbGF0ZWRMaXN0TmFtZXMiLCJyZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInVucmVsYXRlZF9vYmplY3RzIiwicmVsYXRlZF9saXN0cyIsIml0ZW0iLCJyZUZpZWxkTmFtZSIsInJlT2JqZWN0TmFtZSIsInJlbGF0ZWQiLCJyZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lIiwic3BsaXQiLCJmaWVsZF9uYW1lcyIsImlzX2ZpbGUiLCJjdXN0b21SZWxhdGVkTGlzdE9iamVjdCIsImFjdGlvbnMiLCJidXR0b25zIiwidmlzaWJsZV9vbiIsInBhZ2Vfc2l6ZSIsIm9iak9yTmFtZSIsImdldFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfaXRlbSIsInJlbGF0ZWRPYmplY3QiLCJ0YWJ1bGFyX29yZGVyIiwiZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMiLCJ3aXRob3V0IiwidHJhbnNmb3JtU29ydFRvVGFidWxhciIsInJlcGxhY2UiLCJwbHVjayIsImRpZmZlcmVuY2UiLCJ2IiwiaXNBY3RpdmUiLCJhbGxvd19yZWxhdGVkTGlzdCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJmaXJzdCIsImdldExpc3RWaWV3cyIsImdldExpc3RWaWV3IiwiZXhhYyIsImxpc3RWaWV3cyIsImdldExpc3RWaWV3SXNSZWNlbnQiLCJsaXN0VmlldyIsInBpY2tPYmplY3RNb2JpbGVDb2x1bW5zIiwiY291bnQiLCJnZXRGaWVsZCIsImlzTmFtZUNvbHVtbiIsIml0ZW1Db3VudCIsIm1heENvdW50IiwibWF4Um93cyIsIm5hbWVDb2x1bW4iLCJuYW1lS2V5IiwicmVzdWx0IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJSZWdFeHAiLCJfcmVnRXhNZXNzYWdlcyIsIl9nbG9iYWxNZXNzYWdlcyIsInJlZ0V4IiwiZXhwIiwibXNnIiwibWVzc2FnZXMiLCJldmFsSW5Db250ZXh0IiwianMiLCJldmFsIiwiY2FsbCIsImNvbnZlcnRGaWVsZCIsImdldE9wdGlvbiIsIm9wdGlvbiIsImZvbyIsImNvbG9yIiwiYWxsT3B0aW9ucyIsInBpY2tsaXN0IiwicGlja2xpc3RPcHRpb25zIiwiZ2V0UGlja2xpc3QiLCJnZXRQaWNrTGlzdE9wdGlvbnMiLCJyZXZlcnNlIiwiZW5hYmxlIiwiZGVmYXVsdFZhbHVlIiwidHJpZ2dlcnMiLCJ0cmlnZ2VyIiwiX3RvZG8iLCJfdG9kb19mcm9tX2NvZGUiLCJfdG9kb19mcm9tX2RiIiwib24iLCJ0b2RvIiwic3lzdGVtQmFzZUZpZWxkcyIsIm9taXQiLCJyZXF1aXJlZCIsInJlYWRvbmx5IiwiZ2V0U3lzdGVtQmFzZUZpZWxkcyIsIl92aXNpYmxlIiwiZXJyb3IxIiwiYWN0aW9uc0J5TmFtZSIsInRyaW0iLCJpc0V4cHJlc3Npb24iLCJ2aXNpYmxlIiwicmVjb3JkX3Blcm1pc3Npb25zIiwiZ2xvYmFsRGF0YSIsImFzc2lnbiIsIm5vdyIsInBhcnNlU2luZ2xlRXhwcmVzc2lvbiIsIl9vcHRpb25zIiwiX3R5cGUiLCJiZWZvcmVPcGVuRnVuY3Rpb24iLCJpc19jb21wYW55X2xpbWl0ZWQiLCJtYXgiLCJtaW4iLCJfb3B0aW9uIiwiayIsIl9yZWdFeCIsIl9taW4iLCJfbWF4IiwiTnVtYmVyIiwiQm9vbGVhbiIsIl9vcHRpb25zRnVuY3Rpb24iLCJfcmVmZXJlbmNlX3RvIiwiX2NyZWF0ZUZ1bmN0aW9uIiwiX2JlZm9yZU9wZW5GdW5jdGlvbiIsIl9maWx0ZXJzRnVuY3Rpb24iLCJfZGVmYXVsdFZhbHVlIiwiX2lzX2NvbXBhbnlfbGltaXRlZCIsIl9maWx0ZXJzIiwiaXNEYXRlIiwicG9wIiwiX2lzX2RhdGUiLCJmb3JtIiwidmFsIiwicmVsYXRlZE9iakluZm8iLCJQUkVGSVgiLCJfcHJlcGVuZFByZWZpeEZvckZvcm11bGEiLCJwcmVmaXgiLCJmaWVsZFZhcmlhYmxlIiwicmVnIiwicmV2IiwibSIsIiQxIiwiZm9ybXVsYV9zdHIiLCJfQ09OVEVYVCIsIl9WQUxVRVMiLCJpc0Jvb2xlYW4iLCJ0b2FzdHIiLCJmb3JtYXRPYmplY3ROYW1lIiwiX2Jhc2VPYmplY3QiLCJfZGIiLCJkZWZhdWx0TGlzdFZpZXdJZCIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJzY2hlbWEiLCJzZWxmIiwiYmFzZU9iamVjdCIsInBlcm1pc3Npb25fc2V0IiwiaWNvbiIsImRlc2NyaXB0aW9uIiwiaXNfdmlldyIsImhhc0ltcG9ydFRlbXBsYXRlcyIsInZlcnNpb24iLCJpc19lbmFibGUiLCJhbGxvd19jdXN0b21BY3Rpb25zIiwiZXhjbHVkZV9hY3Rpb25zIiwiZW5hYmxlX3NlYXJjaCIsInBhZ2luZyIsImVuYWJsZV9hcGkiLCJjdXN0b20iLCJlbmFibGVfc2hhcmUiLCJlbmFibGVfdHJlZSIsInNpZGViYXIiLCJvcGVuX3dpbmRvdyIsImZpbHRlcl9jb21wYW55IiwiY2FsZW5kYXIiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJlbmFibGVfZm9sbG93IiwiZW5hYmxlX3dvcmtmbG93IiwiZW5hYmxlX2lubGluZV9lZGl0IiwiZGV0YWlscyIsIm1hc3RlcnMiLCJsb29rdXBfZGV0YWlscyIsImluX2RldmVsb3BtZW50IiwiaWRGaWVsZE5hbWUiLCJkYXRhYmFzZV9uYW1lIiwiaXNfbmFtZSIsInByaW1hcnkiLCJmaWx0ZXJhYmxlIiwiaXRlbV9uYW1lIiwiY29weUl0ZW0iLCJhZG1pbiIsImFsbCIsImxpc3Rfdmlld19pdGVtIiwiUmVhY3RpdmVWYXIiLCJjcmVhdGVDb2xsZWN0aW9uIiwiX25hbWUiLCJnZXRPYmplY3RTY2hlbWEiLCJjb250YWlucyIsImF0dGFjaFNjaGVtYSIsIl9zaW1wbGVTY2hlbWEiLCJnZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCIsImJvb3RzdHJhcExvYWRlZCIsImdldFNlbGVjdE9wdGlvbnMiLCJmaWVsZFNjaGVtYSIsImRhdGFfdHlwZSIsIm9wdGlvbkl0ZW0iLCJmaWVsZHNBcnIiLCJfcmVmX29iaiIsImF1dG9mb3JtX3R5cGUiLCJjb2xsZWN0aW9uTmFtZSIsImZzIiwiZnNUeXBlIiwiaXNVbkxpbWl0ZWQiLCJtdWx0aXBsZSIsInJvd3MiLCJsYW5ndWFnZSIsImlzTW9iaWxlIiwiaXNQYWQiLCJpc2lPUyIsImFmRmllbGRJbnB1dCIsInRpbWV6b25lSWQiLCJkeERhdGVCb3hPcHRpb25zIiwiZGlzcGxheUZvcm1hdCIsInBpY2tlclR5cGUiLCJkYXRlTW9iaWxlT3B0aW9ucyIsIm91dEZvcm1hdCIsInNob3dJY29uIiwiZGVwZW5kT24iLCJkZXBlbmRfb24iLCJjcmVhdGUiLCJsb29rdXBfZmllbGQiLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJvcGVyYXRpb24iLCJvblN1Y2Nlc3MiLCJhZGRJdGVtcyIsInJlZmVyZW5jZV9zb3J0Iiwib3B0aW9uc1NvcnQiLCJyZWZlcmVuY2VfbGltaXQiLCJvcHRpb25zTGltaXQiLCJyZWZlcmVuY2VfdG9fZmllbGQiLCJyZWZlcmVuY2VUb0ZpZWxkIiwiYmxhY2tib3giLCJvYmplY3RTd2l0Y2hlIiwib3B0aW9uc01ldGhvZCIsIm9wdGlvbnNNZXRob2RQYXJhbXMiLCJyZWZlcmVuY2VzIiwiX3JlZmVyZW5jZSIsImxpbmsiLCJkZWZhdWx0SWNvbiIsImZpcnN0T3B0aW9uIiwiZGVjaW1hbCIsInByZWNpc2lvbiIsInNjYWxlIiwiZGlzYWJsZWQiLCJBcnJheSIsImVkaXRhYmxlIiwiYWNjZXB0Iiwic3lzdGVtIiwiRW1haWwiLCJpc051bWJlciIsIm9wdGlvbmFsIiwidW5pcXVlIiwiZ3JvdXAiLCJzZWFyY2hhYmxlIiwiaW5saW5lSGVscFRleHQiLCJpc1Byb2R1Y3Rpb24iLCJzb3J0YWJsZSIsImdldEZpZWxkRGlzcGxheVZhbHVlIiwiZmllbGRfdmFsdWUiLCJodG1sIiwibW9tZW50IiwiZm9ybWF0IiwiY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5IiwiZmllbGRfdHlwZSIsInB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyIsIm9wZXJhdGlvbnMiLCJidWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJidWlsdGluSXRlbSIsImlzX2NoZWNrX29ubHkiLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uIiwiYmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJnZXRRdWFydGVyU3RhcnRNb250aCIsIm1vbnRoIiwiZ2V0TW9udGgiLCJnZXRMYXN0UXVhcnRlckZpcnN0RGF5IiwieWVhciIsImdldEZ1bGxZZWFyIiwiZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSIsImdldE1vbnRoRGF5cyIsImRheXMiLCJlbmREYXRlIiwibWlsbGlzZWNvbmQiLCJzdGFydERhdGUiLCJnZXRMYXN0TW9udGhGaXJzdERheSIsImN1cnJlbnRNb250aCIsImN1cnJlbnRZZWFyIiwiZW5kVmFsdWUiLCJmaXJzdERheSIsImxhc3REYXkiLCJsYXN0TW9uZGF5IiwibGFzdE1vbnRoRmluYWxEYXkiLCJsYXN0TW9udGhGaXJzdERheSIsImxhc3RRdWFydGVyRW5kRGF5IiwibGFzdFF1YXJ0ZXJTdGFydERheSIsImxhc3RTdW5kYXkiLCJsYXN0XzEyMF9kYXlzIiwibGFzdF8zMF9kYXlzIiwibGFzdF82MF9kYXlzIiwibGFzdF83X2RheXMiLCJsYXN0XzkwX2RheXMiLCJtaW51c0RheSIsIm1vbmRheSIsIm5leHRNb25kYXkiLCJuZXh0TW9udGhGaW5hbERheSIsIm5leHRNb250aEZpcnN0RGF5IiwibmV4dFF1YXJ0ZXJFbmREYXkiLCJuZXh0UXVhcnRlclN0YXJ0RGF5IiwibmV4dFN1bmRheSIsIm5leHRZZWFyIiwibmV4dF8xMjBfZGF5cyIsIm5leHRfMzBfZGF5cyIsIm5leHRfNjBfZGF5cyIsIm5leHRfN19kYXlzIiwibmV4dF85MF9kYXlzIiwicHJldmlvdXNZZWFyIiwic3RhcnRWYWx1ZSIsInN0ckVuZERheSIsInN0ckZpcnN0RGF5Iiwic3RyTGFzdERheSIsInN0ck1vbmRheSIsInN0clN0YXJ0RGF5Iiwic3RyU3VuZGF5Iiwic3RyVG9kYXkiLCJzdHJUb21vcnJvdyIsInN0clllc3RkYXkiLCJzdW5kYXkiLCJ0aGlzUXVhcnRlckVuZERheSIsInRoaXNRdWFydGVyU3RhcnREYXkiLCJ0b21vcnJvdyIsIndlZWsiLCJ5ZXN0ZGF5IiwiZ2V0RGF5IiwidCIsImZ2Iiwic2V0SG91cnMiLCJnZXRIb3VycyIsImdldFRpbWV6b25lT2Zmc2V0IiwiZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uIiwiZ2V0RmllbGRPcGVyYXRpb24iLCJvcHRpb25hbHMiLCJlcXVhbCIsInVuZXF1YWwiLCJsZXNzX3RoYW4iLCJncmVhdGVyX3RoYW4iLCJsZXNzX29yX2VxdWFsIiwiZ3JlYXRlcl9vcl9lcXVhbCIsIm5vdF9jb250YWluIiwic3RhcnRzX3dpdGgiLCJiZXR3ZWVuIiwiZ2V0T2JqZWN0RmllbGRzTmFtZSIsImZpZWxkc05hbWUiLCJzb3J0X25vIiwiY2xlYW5UcmlnZ2VyIiwiaW5pdFRyaWdnZXIiLCJfdHJpZ2dlcl9ob29rcyIsInJlZjUiLCJ0b2RvV3JhcHBlciIsImFwcGx5IiwiYXJndW1lbnRzIiwid2hlbiIsImJlZm9yZSIsImluc2VydCIsInJlbW92ZSIsImFmdGVyIiwiX2hvb2siLCJ0cmlnZ2VyX25hbWUiLCJfdHJpZ2dlcl9ob29rIiwiYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzIiwiZXh0ZW5kUGVybWlzc2lvblByb3BzIiwiZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCIsImZpbmRfcGVybWlzc2lvbl9vYmplY3QiLCJpbnRlcnNlY3Rpb25QbHVzIiwib3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzIiwib3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzIiwicGVybWlzc2lvblByb3BOYW1lcyIsInVuaW9uUGVybWlzc2lvbk9iamVjdHMiLCJ1bmlvblBsdXMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImdldFJlY29yZFBlcm1pc3Npb25zIiwiaXNPd25lciIsIm1hc3Rlck9iamVjdE5hbWUiLCJtYXN0ZXJSZWNvcmRQZXJtIiwicmVjb3JkX2NvbXBhbnlfaWQiLCJyZWNvcmRfY29tcGFueV9pZHMiLCJ1c2VyX2NvbXBhbnlfaWRzIiwib3duZXIiLCJwYXJlbnQiLCJuIiwiaW50ZXJzZWN0aW9uIiwibG9ja2VkIiwiZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyIsImN1cnJlbnRPYmplY3ROYW1lIiwicmVsYXRlZExpc3RJdGVtIiwiY3VycmVudFJlY29yZCIsImlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSIsIm1hc3RlckFsbG93IiwicmVsYXRlZE9iamVjdFBlcm1pc3Npb25zIiwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QiLCJnZXRPYmplY3RSZWNvcmQiLCJnZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIl9pIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwic3BhY2VVc2VyIiwib2JqZWN0cyIsImFzc2lnbmVkX2FwcHMiLCJwcm9maWxlIiwidXNlcnMiLCJwZXJtaXNzaW9uX3NldF9pZCIsIm1vZGlmaWVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwiZ2V0QXNzaWduZWRBcHBzIiwiYmluZCIsImFzc2lnbmVkX21lbnVzIiwiZ2V0QXNzaWduZWRNZW51cyIsInVzZXJfcGVybWlzc2lvbl9zZXRzIiwiYXJyYXkiLCJvdGhlciIsInRhcmdldCIsInByb3BzIiwiZmlsZXNQcm9OYW1lcyIsInByb3BOYW1lcyIsInByb3BOYW1lIiwiYXBwcyIsInBzZXRCYXNlIiwidXNlclByb2ZpbGUiLCJwc2V0IiwidW5pcSIsImFib3V0TWVudSIsImFkbWluTWVudXMiLCJhbGxNZW51cyIsImN1cnJlbnRQc2V0TmFtZXMiLCJtZW51cyIsIm90aGVyTWVudUFwcHMiLCJvdGhlck1lbnVzIiwiYWRtaW5fbWVudXMiLCJmbGF0dGVuIiwibWVudSIsInBzZXRzTWVudSIsInBlcm1pc3Npb25fc2V0cyIsInBlcm1pc3Npb25fb2JqZWN0cyIsImlzTnVsbCIsInBlcm1pc3Npb25fc2V0X2lkcyIsInBvcyIsIm9wcyIsIm9wc19rZXkiLCJjdXJyZW50UHNldCIsInRlbXBPcHMiLCJyZXBlYXRJbmRleCIsInJlcGVhdFBvIiwib3BzZXRBZG1pbiIsIm9wc2V0Q3VzdG9tZXIiLCJvcHNldEd1ZXN0Iiwib3BzZXRNZW1iZXIiLCJvcHNldFN1cHBsaWVyIiwib3BzZXRVc2VyIiwicG9zQWRtaW4iLCJwb3NDdXN0b21lciIsInBvc0d1ZXN0IiwicG9zTWVtYmVyIiwicG9zU3VwcGxpZXIiLCJwb3NVc2VyIiwicHJvZiIsImd1ZXN0IiwibWVtYmVyIiwic3VwcGxpZXIiLCJjdXN0b21lciIsImRpc2FibGVkX2FjdGlvbnMiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsInVuZWRpdGFibGVfZmllbGRzIiwiY3JlYXRvcl9kYl91cmwiLCJvcGxvZ191cmwiLCJNT05HT19VUkxfQ1JFQVRPUiIsIk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SIiwiX0NSRUFUT1JfREFUQVNPVVJDRSIsIl9kcml2ZXIiLCJNb25nb0ludGVybmFscyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvcGxvZ1VybCIsImNvbGxlY3Rpb25fa2V5IiwibmV3Q29sbGVjdGlvbiIsIlNNU1F1ZXVlIiwiX2RlbGV0ZVJlY29yZCIsImFjdGlvbl9uYW1lIiwiZXhlY3V0ZUFjdGlvbiIsIml0ZW1fZWxlbWVudCIsImNhbGxiYWNrIiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIk9iamVjdEdyaWQiLCJnZXRGaWx0ZXJzIiwid29yZF90ZW1wbGF0ZSIsIlN0ZWVkb3NGaWx0ZXJzIiwiZm9ybWF0RmlsdGVyc1RvT0RhdGFRdWVyeSIsImFic29sdXRlVXJsIiwid2luZG93Iiwib3BlbiIsIm9kYXRhIiwicHJvdG90eXBlIiwic2xpY2UiLCJjb25jYXQiLCJ3YXJuaW5nIiwicmVjb3JkX3RpdGxlIiwiY2FsbF9iYWNrIiwiY2FsbF9iYWNrX2Vycm9yIiwicHJldmlvdXNEb2MiLCJGb3JtTWFuYWdlciIsImdldFByZXZpb3VzRG9jIiwiaW5mbyIsInN1Y2Nlc3MiLCJydW5Ib29rIiwicmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3IiwiY29sbGVjdGlvbl9uYW1lIiwiY3VycmVudF9vYmplY3RfbmFtZSIsImN1cnJlbnRfcmVjb3JkX2lkIiwiZGVmYXVsdERvYyIsImluaXRpYWxWYWx1ZXMiLCJyZWxhdGVPYmplY3QiLCJzZXQiLCJnZXRSZWxhdGVkSW5pdGlhbFZhbHVlcyIsIlN0ZWVkb3NVSSIsInNob3dNb2RhbCIsInN0b3JlcyIsIkNvbXBvbmVudFJlZ2lzdHJ5IiwiY29tcG9uZW50cyIsIk9iamVjdEZvcm0iLCJvYmplY3RBcGlOYW1lIiwidGl0bGUiLCJhZnRlckluc2VydCIsInJlbG9hZFJlY29yZCIsIkZsb3dSb3V0ZXIiLCJyZWxvYWQiLCJpY29uUGF0aCIsImRlZmVyIiwiJCIsImNsaWNrIiwiZ3JpZE5hbWUiLCJpc1JlbGF0ZWQiLCJtYXN0ZXJSZWNvcmRJZCIsInJlbGF0ZWRGaWVsZE5hbWUiLCJzZWxlY3RlZFJvd3MiLCJncmlkUmVmcyIsImN1cnJlbnQiLCJhcGkiLCJnZXRTZWxlY3RlZFJvd3MiLCJncmlkUmVmIiwiZ2V0SW5pdGlhbFZhbHVlcyIsIlBhZ2UiLCJGb3JtIiwiU3RhbmRhcmROZXciLCJyZW5kZXIiLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwicmVkaXJlY3QiLCJTdGFuZGFyZEVkaXQiLCJiZWZvcmVIb29rIiwiaTE4blRleHRLZXkiLCJpMThuVGl0bGVLZXkiLCJuYW1lRmllbGQiLCJzZWxlY3RlZFJlY29yZHMiLCJ0ZXh0IiwiZ2V0VGFibGVTZWxlY3RlZFJvd3MiLCJzd2FsIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsImFmdGVyQmF0Y2hlc0RlbGV0ZSIsImRlbGV0ZUNvdW50ZXIiLCJfZSIsImFwcGlkIiwiZHhEYXRhR3JpZEluc3RhbmNlIiwiZ3JpZENvbnRhaW5lciIsImdyaWRPYmplY3ROYW1lQ2xhc3MiLCJpc09wZW5lclJlbW92ZSIsInJlY29yZFVybCIsInRlbXBOYXZSZW1vdmVkIiwib3BlbmVyIiwicm91dGUiLCJlbmRzV2l0aCIsInJlZnJlc2hHcmlkIiwiZHhUcmVlTGlzdCIsImR4RGF0YUdyaWQiLCJyZWZyZXNoIiwicmVtb3ZlVGVtcE5hdkl0ZW0iLCJjbG9zZSIsImdvIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsInJlY29yZFRpdGxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxLQUFDQSxFQUFELEdBQU0sRUFBTjs7QUFDQSxJQUFJLE9BQUFDLE9BQUEsb0JBQUFBLFlBQUEsSUFBSjtBQUNDLE9BQUNBLE9BQUQsR0FBVyxFQUFYO0FDRUE7O0FERERBLFFBQVFDLE9BQVIsR0FBa0IsRUFBbEI7QUFDQUQsUUFBUUUsV0FBUixHQUFzQixFQUF0QjtBQUNBRixRQUFRRyxLQUFSLEdBQWdCLEVBQWhCO0FBQ0FILFFBQVFJLElBQVIsR0FBZSxFQUFmO0FBQ0FKLFFBQVFLLFVBQVIsR0FBcUIsRUFBckI7QUFDQUwsUUFBUU0sT0FBUixHQUFrQixFQUFsQjtBQUNBTixRQUFRTyxJQUFSLEdBQWUsRUFBZjtBQUNBUCxRQUFRUSxhQUFSLEdBQXdCLEVBQXhCLEM7Ozs7Ozs7Ozs7OztB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QUF2QztBQ3dDUSx5QkR2Q1JSLG9CQ3VDUTtBRDFDaUUsaUJBQTFFLEVBSUc7QUN3Q00seUJEdkNSQSxvQkN1Q1E7QUQ1Q1Qsa0JDc0NPO0FEN0NSLGdCQ2tDTTtBRDdGUjtBQUREO0FDb0hJO0FENUhOLFFDcUJHO0FEM0lKO0FBQUEsR0FGRDtBQ3dQQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJAZGIgPSB7fVxuaWYgIUNyZWF0b3I/XG5cdEBDcmVhdG9yID0ge31cbkNyZWF0b3IuT2JqZWN0cyA9IHt9XG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge31cbkNyZWF0b3IuTWVudXMgPSBbXVxuQ3JlYXRvci5BcHBzID0ge31cbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9XG5DcmVhdG9yLlJlcG9ydHMgPSB7fVxuQ3JlYXRvci5zdWJzID0ge31cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9IiwidGhpcy5kYiA9IHt9O1xuXG5pZiAodHlwZW9mIENyZWF0b3IgPT09IFwidW5kZWZpbmVkXCIgfHwgQ3JlYXRvciA9PT0gbnVsbCkge1xuICB0aGlzLkNyZWF0b3IgPSB7fTtcbn1cblxuQ3JlYXRvci5PYmplY3RzID0ge307XG5cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fTtcblxuQ3JlYXRvci5NZW51cyA9IFtdO1xuXG5DcmVhdG9yLkFwcHMgPSB7fTtcblxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge307XG5cbkNyZWF0b3IuUmVwb3J0cyA9IHt9O1xuXG5DcmVhdG9yLnN1YnMgPSB7fTtcblxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge307XG4iLCJ0cnlcblx0aWYgcHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnXG5cdFx0c3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcblx0XHRvYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJylcblx0XHRtb2xlY3VsZXIgPSByZXF1aXJlKFwibW9sZWN1bGVyXCIpO1xuXHRcdHBhY2thZ2VMb2FkZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGVvci1wYWNrYWdlLWxvYWRlcicpO1xuXHRcdEFQSVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLWFwaScpO1xuXHRcdE1ldGFkYXRhU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0YWRhdGEtc2VydmVyJyk7XG5cdFx0cGFja2FnZVNlcnZpY2UgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIpO1xuXHRcdHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXHRcdGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcblx0XHRzZXR0aW5ncyA9IHtcblx0XHRcdGJ1aWx0X2luX3BsdWdpbnM6IFtcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1zcGFjZVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLWNtc1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLW9iamVjdC1kYXRhYmFzZVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3MtYXBwcm92YWxcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1jb2xsYWJvcmF0aW9uXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc3RhbmRhcmQtdWlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1wZXJtaXNzaW9uXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvd2ViYXBwLXB1YmxpY1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2FjaGVycy1tYW5hZ2VyXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvdW5wa2dcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93b3JrZmxvd1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL2FjY291bnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvcGx1Z2luLWNvbXBhbnlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9tZXRhZGF0YS1hcGlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9kYXRhLWltcG9ydFwiLFxuXHRcdFx0XHQjIFwiQHN0ZWVkb3Mvc2VydmljZS1maWVsZHMtaW5kZXhzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1hY2NvdW50c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2hhcnRzXCIsXG5cdFx0XHRcdCMgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1jbG91ZC1pbml0XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIsXG5cdFx0ICAgIFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXRvb2xcIjtcblx0XHRcdFx0IyBcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3NcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93ZWJhcHAtYWNjb3VudHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLXdvcmtmbG93XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wbHVnaW4tYW1pc1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtZmlsZXNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWlkZW50aXR5LWp3dFwiXG5cdFx0XHRdLFxuXHRcdFx0cGx1Z2luczogY29uZmlnLnBsdWdpbnNcblx0XHR9XG5cdFx0TWV0ZW9yLnN0YXJ0dXAgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuXHRcdFx0XHRcdG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG5cdFx0XHRcdFx0bm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuXHRcdFx0XHRcdG1ldGFkYXRhOiB7fSxcblx0XHRcdFx0XHR0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG5cdFx0XHRcdFx0Y2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG5cdFx0XHRcdFx0bG9nTGV2ZWw6IFwid2FyblwiLFxuXHRcdFx0XHRcdHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuXHRcdFx0XHRcdHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG5cdFx0XHRcdFx0bWF4Q2FsbExldmVsOiAxMDAsXG5cblx0XHRcdFx0XHRoZWFydGJlYXRJbnRlcnZhbDogMTAsXG5cdFx0XHRcdFx0aGVhcnRiZWF0VGltZW91dDogMzAsXG5cblx0XHRcdFx0XHRjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG5cblx0XHRcdFx0XHR0cmFja2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaHV0ZG93blRpbWVvdXQ6IDUwMDAsXG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG5cblx0XHRcdFx0XHRyZWdpc3RyeToge1xuXHRcdFx0XHRcdFx0c3RyYXRlZ3k6IFwiUm91bmRSb2JpblwiLFxuXHRcdFx0XHRcdFx0cHJlZmVyTG9jYWw6IHRydWVcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0YnVsa2hlYWQ6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0Y29uY3VycmVuY3k6IDEwLFxuXHRcdFx0XHRcdFx0bWF4UXVldWVTaXplOiAxMDAsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR2YWxpZGF0b3I6IHRydWUsXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBudWxsLFxuXHRcdFx0XHRcdHRyYWNpbmc6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZXhwb3J0ZXI6IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJDb25zb2xlXCIsXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0XHRsb2dnZXI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3JzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0XHRcdFx0Z2F1Z2VXaWR0aDogNDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2tpcFByb2Nlc3NFdmVudFJlZ2lzdHJhdGlvbjogdHJ1ZSxcblxuXHRcdFx0XHRcdGNyZWF0ZWQ6IChicm9rZXIpLT4gXG5cdFx0XHRcdFx0XHQjIENsZWFyIGFsbCBjYWNoZSBlbnRyaWVzXG5cdFx0XHRcdFx0XHRicm9rZXIubG9nZ2VyLndhcm4oJ0NsZWFyIGFsbCBjYWNoZSBlbnRyaWVzIG9uIHN0YXJ0dXAuJylcblx0XHRcdFx0XHRcdGJyb2tlci5jYWNoZXIuY2xlYW4oKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0b2JqZWN0cWwuYnJva2VyLmluaXQoYnJva2VyKTtcblx0XHRcdFx0XG5cdFx0XHRcdHByb2plY3RTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6IFwicHJvamVjdC1zZXJ2ZXJcIixcblx0XHRcdFx0XHRuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuXHRcdFx0XHRcdG1peGluczogW3BhY2thZ2VTZXJ2aWNlXSxcblx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHRtZXRhZGF0YVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogJ21ldGFkYXRhLXNlcnZlcicsXG5cdFx0XHRcdFx0bWl4aW5zOiBbTWV0YWRhdGFTZXJ2aWNlXSxcblx0XHRcdFx0XHRzZXR0aW5nczoge1xuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHVpU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHJlcXVpcmUoXCJAc3RlZWRvcy9zZXJ2aWNlLXVpXCIpKTtcblxuXHRcdFx0XHRhcGlTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6IFwiYXBpXCIsXG5cdFx0XHRcdFx0bWl4aW5zOiBbQVBJU2VydmljZV0sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdHBvcnQ6IG51bGxcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRwYWdlU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiBcIkBzdGVlZG9zL3NlcnZpY2UtcGFnZXNcIixcblx0XHRcdFx0XHRtaXhpbnM6IFtyZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzJyldLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRwb3J0OiBudWxsXG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0c3RlZWRvc1NlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogXCJzdGVlZG9zLXNlcnZlclwiLFxuXHRcdFx0XHRcdG1peGluczogW10sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdHBvcnQ6IG51bGxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHN0YXJ0ZWQ6ICgpLT5cblx0XHRcdFx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0XHRcdFx0YnJva2VyLmVtaXQgJ3N0ZWVkb3Mtc2VydmVyLnN0YXJ0ZWQnXG5cdFx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdFx0LCAxMDAwXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdG9iamVjdHFsLmdldFN0ZWVkb3NTY2hlbWEoYnJva2VyKTtcblx0XHRcdFx0c3RhbmRhcmRPYmplY3RzRGlyID0gb2JqZWN0cWwuU3RhbmRhcmRPYmplY3RzUGF0aDtcblx0XHRcdFx0c3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogJ3N0YW5kYXJkLW9iamVjdHMnLFxuXHRcdFx0XHRcdG1peGluczogW3BhY2thZ2VMb2FkZXJdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7IHBhY2thZ2VJbmZvOiB7XG5cdFx0XHRcdFx0XHRwYXRoOiBzdGFuZGFyZE9iamVjdHNEaXIsXG5cdFx0XHRcdFx0fSB9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdE1ldGVvci53cmFwQXN5bmMoKGNiKS0+XG5cdFx0XHRcdFx0YnJva2VyLnN0YXJ0KCkudGhlbigoKS0+XG5cdFx0XHRcdFx0XHRpZiAhYnJva2VyLnN0YXJ0ZWQgXG5cdFx0XHRcdFx0XHRcdGJyb2tlci5fcmVzdGFydFNlcnZpY2Uoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UpO1xuXHRcdFx0XHRcdFx0XHRicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKHVpU2VydmljZSk7XG5cblx0XHRcdFx0XHRcdGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5cdFx0XHRcdFx0XHRjb25uZWN0SGFuZGxlcnNFeHByZXNzID0gZXhwcmVzcygpO1xuXHRcdFx0XHRcdFx0Y29ubmVjdEhhbmRsZXJzRXhwcmVzcy51c2UocmVxdWlyZSgnQHN0ZWVkb3Mvcm91dGVyJykuc3RhdGljUm91dGVyKCkpO1xuXHRcdFx0XHRcdFx0YnJva2VyLndhaXRGb3JTZXJ2aWNlcygnfnBhY2thZ2VzLUBzdGVlZG9zL3NlcnZpY2UtdWknKS50aGVuICgpLT5cblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dhaXRGb3JTZXJ2aWNlcyB+cGFja2FnZXMtQHN0ZWVkb3Mvc2VydmljZS11aScpXG5cdFx0XHRcdFx0XHRcdGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MudXNlKFN0ZWVkb3NBcGkuZXhwcmVzcygpKVxuXHRcdFx0XHRcdFx0XHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShjb25uZWN0SGFuZGxlcnNFeHByZXNzKVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQjIHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4gKCktPlxuXHRcdFx0XHRcdFx0IyBcdGNiKCk7XG5cblx0XHRcdFx0XHRcdGJyb2tlci53YWl0Rm9yU2VydmljZXMoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UubmFtZSkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0XHRcdFx0XHRzdGVlZG9zQ29yZS5pbml0KHNldHRpbmdzKS50aGVuICgpLT5cblx0XHRcdFx0XHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpKClcblx0XHRcdGNhdGNoIGV4XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixleClcbmNhdGNoIGVcblx0Y29uc29sZS5lcnJvcihcImVycm9yOlwiLGUpIiwidmFyIEFQSVNlcnZpY2UsIE1ldGFkYXRhU2VydmljZSwgY29uZmlnLCBlLCBtb2xlY3VsZXIsIG9iamVjdHFsLCBwYWNrYWdlTG9hZGVyLCBwYWNrYWdlU2VydmljZSwgcGF0aCwgc2V0dGluZ3MsIHN0ZWVkb3NDb3JlO1xuXG50cnkge1xuICBpZiAocHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuICAgIG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcbiAgICBtb2xlY3VsZXIgPSByZXF1aXJlKFwibW9sZWN1bGVyXCIpO1xuICAgIHBhY2thZ2VMb2FkZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGVvci1wYWNrYWdlLWxvYWRlcicpO1xuICAgIEFQSVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLWFwaScpO1xuICAgIE1ldGFkYXRhU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0YWRhdGEtc2VydmVyJyk7XG4gICAgcGFja2FnZVNlcnZpY2UgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIpO1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgY29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xuICAgIHNldHRpbmdzID0ge1xuICAgICAgYnVpbHRfaW5fcGx1Z2luczogW1wiQHN0ZWVkb3Mvc3RhbmRhcmQtc3BhY2VcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1jbXNcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1vYmplY3QtZGF0YWJhc2VcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1wcm9jZXNzLWFwcHJvdmFsXCIsIFwiQHN0ZWVkb3Mvc3RhbmRhcmQtY29sbGFib3JhdGlvblwiLCBcIkBzdGVlZG9zL3N0YW5kYXJkLXVpXCIsIFwiQHN0ZWVkb3Mvc3RhbmRhcmQtcGVybWlzc2lvblwiLCBcIkBzdGVlZG9zL3dlYmFwcC1wdWJsaWNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWNhY2hlcnMtbWFuYWdlclwiLCBcIkBzdGVlZG9zL3VucGtnXCIsIFwiQHN0ZWVkb3Mvd29ya2Zsb3dcIiwgXCJAc3RlZWRvcy9hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3BsdWdpbi1jb21wYW55XCIsIFwiQHN0ZWVkb3MvbWV0YWRhdGEtYXBpXCIsIFwiQHN0ZWVkb3MvZGF0YS1pbXBvcnRcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWFjY291bnRzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1jaGFydHNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWNsb3VkLWluaXRcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhY2thZ2UtcmVnaXN0cnlcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhY2thZ2UtdG9vbFwiLCBcIkBzdGVlZG9zL3dlYmFwcC1hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2Utd29ya2Zsb3dcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBsdWdpbi1hbWlzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1maWxlc1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtaWRlbnRpdHktand0XCJdLFxuICAgICAgcGx1Z2luczogY29uZmlnLnBsdWdpbnNcbiAgICB9O1xuICAgIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFwaVNlcnZpY2UsIGJyb2tlciwgZXgsIG1ldGFkYXRhU2VydmljZSwgcGFnZVNlcnZpY2UsIHByb2plY3RTZXJ2aWNlLCBzdGFuZGFyZE9iamVjdHNEaXIsIHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlLCBzdGVlZG9zU2VydmljZSwgdWlTZXJ2aWNlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYnJva2VyID0gbmV3IG1vbGVjdWxlci5TZXJ2aWNlQnJva2VyKHtcbiAgICAgICAgICBuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuICAgICAgICAgIG5vZGVJRDogXCJzdGVlZG9zLWNyZWF0b3JcIixcbiAgICAgICAgICBtZXRhZGF0YToge30sXG4gICAgICAgICAgdHJhbnNwb3J0ZXI6IHByb2Nlc3MuZW52LlRSQU5TUE9SVEVSLFxuICAgICAgICAgIGNhY2hlcjogcHJvY2Vzcy5lbnYuQ0FDSEVSLFxuICAgICAgICAgIGxvZ0xldmVsOiBcIndhcm5cIixcbiAgICAgICAgICBzZXJpYWxpemVyOiBcIkpTT05cIixcbiAgICAgICAgICByZXF1ZXN0VGltZW91dDogNjAgKiAxMDAwLFxuICAgICAgICAgIG1heENhbGxMZXZlbDogMTAwLFxuICAgICAgICAgIGhlYXJ0YmVhdEludGVydmFsOiAxMCxcbiAgICAgICAgICBoZWFydGJlYXRUaW1lb3V0OiAzMCxcbiAgICAgICAgICBjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG4gICAgICAgICAgdHJhY2tpbmc6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgc2h1dGRvd25UaW1lb3V0OiA1MDAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkaXNhYmxlQmFsYW5jZXI6IGZhbHNlLFxuICAgICAgICAgIHJlZ2lzdHJ5OiB7XG4gICAgICAgICAgICBzdHJhdGVneTogXCJSb3VuZFJvYmluXCIsXG4gICAgICAgICAgICBwcmVmZXJMb2NhbDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVsa2hlYWQ6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgY29uY3VycmVuY3k6IDEwLFxuICAgICAgICAgICAgbWF4UXVldWVTaXplOiAxMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHZhbGlkYXRvcjogdHJ1ZSxcbiAgICAgICAgICBlcnJvckhhbmRsZXI6IG51bGwsXG4gICAgICAgICAgdHJhY2luZzoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBleHBvcnRlcjoge1xuICAgICAgICAgICAgICB0eXBlOiBcIkNvbnNvbGVcIixcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGxvZ2dlcjogbnVsbCxcbiAgICAgICAgICAgICAgICBjb2xvcnM6IHRydWUsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICAgICAgICBnYXVnZVdpZHRoOiA0MFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBza2lwUHJvY2Vzc0V2ZW50UmVnaXN0cmF0aW9uOiB0cnVlLFxuICAgICAgICAgIGNyZWF0ZWQ6IGZ1bmN0aW9uKGJyb2tlcikge1xuICAgICAgICAgICAgYnJva2VyLmxvZ2dlci53YXJuKCdDbGVhciBhbGwgY2FjaGUgZW50cmllcyBvbiBzdGFydHVwLicpO1xuICAgICAgICAgICAgcmV0dXJuIGJyb2tlci5jYWNoZXIuY2xlYW4oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBvYmplY3RxbC5icm9rZXIuaW5pdChicm9rZXIpO1xuICAgICAgICBwcm9qZWN0U2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiBcInByb2plY3Qtc2VydmVyXCIsXG4gICAgICAgICAgbmFtZXNwYWNlOiBcInN0ZWVkb3NcIixcbiAgICAgICAgICBtaXhpbnM6IFtwYWNrYWdlU2VydmljZV1cbiAgICAgICAgfSk7XG4gICAgICAgIG1ldGFkYXRhU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiAnbWV0YWRhdGEtc2VydmVyJyxcbiAgICAgICAgICBtaXhpbnM6IFtNZXRhZGF0YVNlcnZpY2VdLFxuICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICB9KTtcbiAgICAgICAgdWlTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2UocmVxdWlyZShcIkBzdGVlZG9zL3NlcnZpY2UtdWlcIikpO1xuICAgICAgICBhcGlTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6IFwiYXBpXCIsXG4gICAgICAgICAgbWl4aW5zOiBbQVBJU2VydmljZV0sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHBvcnQ6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwYWdlU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiBcIkBzdGVlZG9zL3NlcnZpY2UtcGFnZXNcIixcbiAgICAgICAgICBtaXhpbnM6IFtyZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzJyldLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBwb3J0OiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc3RlZWRvc1NlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogXCJzdGVlZG9zLXNlcnZlclwiLFxuICAgICAgICAgIG1peGluczogW10sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHBvcnQ6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN0YXJ0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGJyb2tlci5lbWl0KCdzdGVlZG9zLXNlcnZlci5zdGFydGVkJyk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBvYmplY3RxbC5nZXRTdGVlZG9zU2NoZW1hKGJyb2tlcik7XG4gICAgICAgIHN0YW5kYXJkT2JqZWN0c0RpciA9IG9iamVjdHFsLlN0YW5kYXJkT2JqZWN0c1BhdGg7XG4gICAgICAgIHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6ICdzdGFuZGFyZC1vYmplY3RzJyxcbiAgICAgICAgICBtaXhpbnM6IFtwYWNrYWdlTG9hZGVyXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcGFja2FnZUluZm86IHtcbiAgICAgICAgICAgICAgcGF0aDogc3RhbmRhcmRPYmplY3RzRGlyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oY2IpIHtcbiAgICAgICAgICByZXR1cm4gYnJva2VyLnN0YXJ0KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjb25uZWN0SGFuZGxlcnNFeHByZXNzLCBleHByZXNzO1xuICAgICAgICAgICAgaWYgKCFicm9rZXIuc3RhcnRlZCkge1xuICAgICAgICAgICAgICBicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlKTtcbiAgICAgICAgICAgICAgYnJva2VyLl9yZXN0YXJ0U2VydmljZSh1aVNlcnZpY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbiAgICAgICAgICAgIGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MgPSBleHByZXNzKCk7XG4gICAgICAgICAgICBjb25uZWN0SGFuZGxlcnNFeHByZXNzLnVzZShyZXF1aXJlKCdAc3RlZWRvcy9yb3V0ZXInKS5zdGF0aWNSb3V0ZXIoKSk7XG4gICAgICAgICAgICBicm9rZXIud2FpdEZvclNlcnZpY2VzKCd+cGFja2FnZXMtQHN0ZWVkb3Mvc2VydmljZS11aScpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3YWl0Rm9yU2VydmljZXMgfnBhY2thZ2VzLUBzdGVlZG9zL3NlcnZpY2UtdWknKTtcbiAgICAgICAgICAgICAgY29ubmVjdEhhbmRsZXJzRXhwcmVzcy51c2UoU3RlZWRvc0FwaS5leHByZXNzKCkpO1xuICAgICAgICAgICAgICByZXR1cm4gV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoY29ubmVjdEhhbmRsZXJzRXhwcmVzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBicm9rZXIud2FpdEZvclNlcnZpY2VzKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlLm5hbWUpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5pbml0KHNldHRpbmdzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KSgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIiwgZXgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBlID0gZXJyb3I7XG4gIGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIiwgZSk7XG59XG4iLCJDcmVhdG9yLmRlcHMgPSB7XG5cdGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxuXHRvYmplY3Q6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcbn07XG5cbkNyZWF0b3IuX1RFTVBMQVRFID0ge1xuXHRBcHBzOiB7fSxcblx0T2JqZWN0czoge31cbn1cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2ZpbHRlcnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe29wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2NyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXG4jIENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyDkvptzdGVlZG9zLWNsaemhueebruS9v+eUqFxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJylcblx0Q3JlYXRvci5maWJlckxvYWRPYmplY3RzID0gKG9iaiwgb2JqZWN0X25hbWUpLT5cblx0XHRGaWJlcigoKS0+XG5cdFx0XHRDcmVhdG9yLmxvYWRPYmplY3RzKG9iaiwgb2JqZWN0X25hbWUpXG5cdFx0KS5ydW4oKVxuXG5DcmVhdG9yLmxvYWRPYmplY3RzID0gKG9iaiwgb2JqZWN0X25hbWUpLT5cblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBvYmoubmFtZVxuXG5cdGlmICFvYmoubGlzdF92aWV3c1xuXHRcdG9iai5saXN0X3ZpZXdzID0ge31cblxuXHRpZiBvYmouc3BhY2Vcblx0XHRvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKVxuXHRpZiBvYmplY3RfbmFtZSA9PSAnY2ZzX2ZpbGVzX2ZpbGVyZWNvcmQnXG5cdFx0b2JqZWN0X25hbWUgPSAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXG5cdFx0b2JqID0gXy5jbG9uZShvYmopXG5cdFx0b2JqLm5hbWUgPSBvYmplY3RfbmFtZVxuXHRcdENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0gPSBvYmpcblxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKVxuXHRuZXcgQ3JlYXRvci5PYmplY3Qob2JqKTtcblxuXHRDcmVhdG9yLmluaXRUcmlnZ2VycyhvYmplY3RfbmFtZSlcblx0Q3JlYXRvci5pbml0TGlzdFZpZXdzKG9iamVjdF9uYW1lKVxuXHRyZXR1cm4gb2JqXG5cbkNyZWF0b3IuZ2V0T2JqZWN0TmFtZSA9IChvYmplY3QpIC0+XG5cdGlmIG9iamVjdC5zcGFjZVxuXHRcdHJldHVybiBcImNfI3tvYmplY3Quc3BhY2V9XyN7b2JqZWN0Lm5hbWV9XCJcblx0cmV0dXJuIG9iamVjdC5uYW1lXG5cbkNyZWF0b3IuZ2V0T2JqZWN0ID0gKG9iamVjdF9uYW1lLCBzcGFjZV9pZCktPlxuXHRpZiBfLmlzQXJyYXkob2JqZWN0X25hbWUpXG5cdFx0cmV0dXJuIDtcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0Q3JlYXRvci5kZXBzPy5vYmplY3Q/LmRlcGVuZCgpXG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cbiNcdGlmICFzcGFjZV9pZCAmJiBvYmplY3RfbmFtZVxuI1x0XHRpZiBNZXRlb3IuaXNDbGllbnQgJiYgIW9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2NfJylcbiNcdFx0XHRzcGFjZV9pZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXG5cdGlmIG9iamVjdF9uYW1lXG4jXHRcdGlmIHNwYWNlX2lkXG4jXHRcdFx0b2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY18je3NwYWNlX2lkfV8je29iamVjdF9uYW1lfVwiXVxuI1x0XHRcdGlmIG9ialxuI1x0XHRcdFx0cmV0dXJuIG9ialxuI1xuI1x0XHRvYmogPSBfLmZpbmQgQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAobyktPlxuI1x0XHRcdFx0cmV0dXJuIG8uX2NvbGxlY3Rpb25fbmFtZSA9PSBvYmplY3RfbmFtZVxuI1x0XHRpZiBvYmpcbiNcdFx0XHRyZXR1cm4gb2JqXG5cblx0XHRyZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSAob2JqZWN0X2lkKS0+XG5cdHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtfaWQ6IG9iamVjdF9pZH0pXG5cbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gKG9iamVjdF9uYW1lKS0+XG5cdGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKVxuXHRkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRkZWxldGUgQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSAob2JqZWN0X25hbWUsIHNwYWNlSWQpLT5cblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdGlmIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpPy5fY29sbGVjdGlvbl9uYW1lIHx8IG9iamVjdF9uYW1lXVxuXG5DcmVhdG9yLnJlbW92ZUNvbGxlY3Rpb24gPSAob2JqZWN0X25hbWUpLT5cblx0ZGVsZXRlIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuaXNTcGFjZUFkbWluID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdHNwYWNlID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIik/LmRiPy5maW5kT25lKHNwYWNlSWQse2ZpZWxkczp7YWRtaW5zOjF9fSlcblx0aWYgc3BhY2U/LmFkbWluc1xuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDBcblxuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IChmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyktPlxuXG5cdGlmICFfLmlzU3RyaW5nKGZvcm11bGFyKVxuXHRcdHJldHVybiBmb3JtdWxhclxuXG5cdGlmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKVxuXHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucylcblxuXHRyZXR1cm4gZm9ybXVsYXJcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSAoZmlsdGVycywgY29udGV4dCktPlxuXHRzZWxlY3RvciA9IHt9XG5cdF8uZWFjaCBmaWx0ZXJzLCAoZmlsdGVyKS0+XG5cdFx0aWYgZmlsdGVyPy5sZW5ndGggPT0gM1xuXHRcdFx0bmFtZSA9IGZpbHRlclswXVxuXHRcdFx0YWN0aW9uID0gZmlsdGVyWzFdXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgY29udGV4dClcblx0XHRcdHNlbGVjdG9yW25hbWVdID0ge31cblx0XHRcdHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZVxuXHQjIGNvbnNvbGUubG9nKFwiZXZhbHVhdGVGaWx0ZXJzLS0+c2VsZWN0b3JcIiwgc2VsZWN0b3IpXG5cdHJldHVybiBzZWxlY3RvclxuXG5DcmVhdG9yLmlzQ29tbW9uU3BhY2UgPSAoc3BhY2VJZCkgLT5cblx0cmV0dXJuIHNwYWNlSWQgPT0gJ2NvbW1vbidcblxuIyMjXG5cdGRvY3PvvJrlvoXmjpLluo/nmoTmlofmoaPmlbDnu4Rcblx0aWRz77yaX2lk6ZuG5ZCIXG5cdGlkX2tleTog6buY6K6k5Li6X2lkXG5cdHJldHVybiDmjInnhadpZHPnmoTpobrluo/ov5Tlm57mlrDnmoTmlofmoaPpm4blkIhcbiMjI1xuQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMgPSAoZG9jcywgaWRzLCBpZF9rZXksIGhpdF9maXJzdCktPlxuXG5cdGlmICFpZF9rZXlcblx0XHRpZF9rZXkgPSBcIl9pZFwiXG5cblx0aWYgaGl0X2ZpcnN0XG5cblx0XHQj55Sx5LqO5LiN6IO95L2/55SoXy5maW5kSW5kZXjlh73mlbDvvIzlm6DmraTmraTlpITlhYjlsIblr7nosaHmlbDnu4TovazkuLrmma7pgJrmlbDnu4TnsbvlnovvvIzlnKjojrflj5blhbZpbmRleFxuXHRcdHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KVxuXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XG5cdFx0XHRcdFx0X2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXG5cdFx0XHRcdFx0aWYgX2luZGV4ID4gLTFcblx0XHRcdFx0XHRcdHJldHVybiBfaW5kZXhcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gaWRzLmxlbmd0aCArIF8uaW5kZXhPZih2YWx1ZXMsIGRvY1tpZF9rZXldKVxuXHRlbHNlXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XG5cdFx0XHRyZXR1cm4gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXG5cbiMjI1xuXHTmjInnlKjmiLfmiYDlsZ7mnKzlnLDljJbor63oqIDov5vooYzmjpLluo/vvIzmlK/mjIHkuK3mlofjgIHmlbDlgLzjgIHml6XmnJ/nrYnlrZfmrrXmjpLluo9cblx05a+55LqOT2JqZWN057G75Z6L77yM5aaC5p6c5o+Q5L6b5L2c55So5Z+f5Lita2V55bGe5oCn77yM5YiZ5Y+W5YC85Li6dmFsdWVba2V5Xei/m+ihjOaOkuW6j+avlOi+g++8jOWPjeS5i+aVtOS4qk9iamVjdC50b1N0cmluZygp5ZCO5o6S5bqP5q+U6L6DXG4jIyNcbkNyZWF0b3Iuc29ydGluZ01ldGhvZCA9ICh2YWx1ZTEsIHZhbHVlMikgLT5cblx0aWYgdGhpcy5rZXlcblx0XHR2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldXG5cdFx0dmFsdWUyID0gdmFsdWUyW3RoaXMua2V5XVxuXHRpZiB2YWx1ZTEgaW5zdGFuY2VvZiBEYXRlXG5cdFx0dmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKVxuXHRpZiB2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlXG5cdFx0dmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKVxuXHRpZiB0eXBlb2YgdmFsdWUxIGlzIFwibnVtYmVyXCIgYW5kIHR5cGVvZiB2YWx1ZTIgaXMgXCJudW1iZXJcIlxuXHRcdHJldHVybiB2YWx1ZTEgLSB2YWx1ZTJcblx0IyBIYW5kbGluZyBudWxsIHZhbHVlc1xuXHRpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09IG51bGwgb3IgdmFsdWUxID09IHVuZGVmaW5lZFxuXHRpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09IG51bGwgb3IgdmFsdWUyID09IHVuZGVmaW5lZFxuXHRpZiBpc1ZhbHVlMUVtcHR5IGFuZCAhaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAtMVxuXHRpZiBpc1ZhbHVlMUVtcHR5IGFuZCBpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIDBcblx0aWYgIWlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gMVxuXHRsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG5cdHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlIHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGVcblxuXG4jIOivpeWHveaVsOWPquWcqOWIneWni+WMlk9iamVjdOaXtu+8jOaKiuebuOWFs+WvueixoeeahOiuoeeul+e7k+aenOS/neWtmOWIsE9iamVjdOeahHJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4re+8jOWQjue7reWPr+S7peebtOaOpeS7jnJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4reWPluW+l+iuoeeul+e7k+aenOiAjOS4jeeUqOWGjeasoeiwg+eUqOivpeWHveaVsOadpeiuoeeul1xuQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyA9IChvYmplY3RfbmFtZSktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IFtdXG5cdCMgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHQjIOWboENyZWF0b3IuZ2V0T2JqZWN05Ye95pWw5YaF6YOo6KaB6LCD55So6K+l5Ye95pWw77yM5omA5Lul6L+Z6YeM5LiN5Y+v5Lul6LCD55SoQ3JlYXRvci5nZXRPYmplY3Tlj5blr7nosaHvvIzlj6rog73osIPnlKhDcmVhdG9yLk9iamVjdHPmnaXlj5blr7nosaFcblx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0aWYgIV9vYmplY3Rcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cdFxuXHRyZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Rcblx0aWYgTWV0ZW9yLmlzQ2xpZW50ICYmICFfLmlzRW1wdHkgcmVsYXRlZExpc3Rcblx0XHRyZWxhdGVkTGlzdE1hcCA9IHt9XG5cdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0LCAob2JqTmFtZSktPlxuXHRcdFx0aWYgXy5pc09iamVjdCBvYmpOYW1lXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9XG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XG5cdFx0XHRcdGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgcmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWUgYW5kIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cdFx0XHRcdFx0IyDlvZNyZWxhdGVkX29iamVjdC5maWVsZHPkuK3mnInkuKTkuKrmiJbku6XkuIrnmoTlrZfmrrXmjIflkJFvYmplY3RfbmFtZeihqOekuueahOWvueixoeaXtu+8jOS8mOWFiOWPluesrOS4gOS4quS9nOS4uuWklumUruWFs+ezu+Wtl+aute+8jOS9huaYr3JlbGF0ZWRfZmllbGTkuLrkuLvlrZDooajml7blvLrooYzopobnm5bkuYvliY3nmoRyZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXeWAvFxuXHRcdFx0XHRcdGlmIF8uaXNFbXB0eSByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCJcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0geyBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddID0geyBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCIgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0geyBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiIH1cblx0XHRfLmVhY2ggWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIChlbmFibGVPYmpOYW1lKS0+XG5cdFx0XHRpZiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHsgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXVxuXHRcdFx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxuXHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHsgb2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0cmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMgcmVsYXRlZExpc3RNYXBcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cblx0aWYgX29iamVjdC5lbmFibGVfZmlsZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJ9XG5cblx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcblx0XHRcdCMgY2ZzLmZpbGVzLmZpbGVyZWNvcmTlr7nosaHlnKjnrKzkuozmrKHngrnlh7vnmoTml7blgJlyZWxhdGVkX29iamVjdOi/lOWbnueahOaYr2FwcC1idWlsZGVy5Lit55qEXCJtZXRhZGF0YS5wYXJlbnRcIuWtl+auteiiq+WIoOmZpOS6hu+8jOiusOWIsG1ldGFkYXRh5a2X5q6155qEc3ViX2ZpZWxkc+S4reS6hu+8jOaJgOS7peimgeWNleeLrOWkhOeQhuOAglxuXHRcdFx0c2ZzRmlsZXNPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpXG5cdFx0XHRzZnNGaWxlc09iamVjdCAmJiByZWxhdGVkX29iamVjdCA9IHNmc0ZpbGVzT2JqZWN0XG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcblx0XHRcdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcIm9iamVjdF9maWVsZHNcIlxuXHRcdFx0XHRcdCNUT0RPIOW+heebuOWFs+WIl+ihqOaUr+aMgeaOkuW6j+WQju+8jOWIoOmZpOatpOWIpOaWrVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWV9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkfVxuXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwidGFza3NcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ub3Rlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfZXZlbnRzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiZXZlbnRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIn1cblx0aWYgX29iamVjdC5lbmFibGVfYXBwcm92YWxzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfcHJvY2Vzc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcInByb2Nlc3NfaW5zdGFuY2VfaGlzdG9yeVwiLCBmb3JlaWduX2tleTogXCJ0YXJnZXRfb2JqZWN0XCJ9XG5cdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4Fcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblxuXHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSAodXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUXG5cdGVsc2Vcblx0XHRpZiAhKHVzZXJJZCBhbmQgc3BhY2VJZClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdHN1RmllbGRzID0ge25hbWU6IDEsIG1vYmlsZTogMSwgcG9zaXRpb246IDEsIGVtYWlsOiAxLCBjb21wYW55OiAxLCBvcmdhbml6YXRpb246IDEsIHNwYWNlOiAxLCBjb21wYW55X2lkOiAxLCBjb21wYW55X2lkczogMX1cblx0XHQjIGNoZWNrIGlmIHVzZXIgaW4gdGhlIHNwYWNlXG5cdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcblx0XHRpZiAhc3Vcblx0XHRcdHNwYWNlSWQgPSBudWxsXG5cblx0XHQjIGlmIHNwYWNlSWQgbm90IGV4aXN0cywgZ2V0IHRoZSBmaXJzdCBvbmUuXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdGlmIGlzVW5TYWZlTW9kZVxuXHRcdFx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXG5cdFx0XHRcdGlmICFzdVxuXHRcdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHRcdHNwYWNlSWQgPSBzdS5zcGFjZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0VVNFUl9DT05URVhUID0ge31cblx0XHRVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkXG5cdFx0VVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkXG5cdFx0VVNFUl9DT05URVhULnVzZXIgPSB7XG5cdFx0XHRfaWQ6IHVzZXJJZFxuXHRcdFx0bmFtZTogc3UubmFtZSxcblx0XHRcdG1vYmlsZTogc3UubW9iaWxlLFxuXHRcdFx0cG9zaXRpb246IHN1LnBvc2l0aW9uLFxuXHRcdFx0ZW1haWw6IHN1LmVtYWlsXG5cdFx0XHRjb21wYW55OiBzdS5jb21wYW55XG5cdFx0XHRjb21wYW55X2lkOiBzdS5jb21wYW55X2lkXG5cdFx0XHRjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcblx0XHR9XG5cdFx0c3BhY2VfdXNlcl9vcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpPy5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbilcblx0XHRpZiBzcGFjZV91c2VyX29yZ1xuXHRcdFx0VVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuXHRcdFx0XHRfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcblx0XHRcdFx0bmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcblx0XHRcdFx0ZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG5cdFx0XHR9XG5cdFx0cmV0dXJuIFVTRVJfQ09OVEVYVFxuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gKHVybCktPlxuXG5cdGlmIF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAodXJsPy5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpKVxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxuXHRcdHJldHVybiB1cmxcblxuXHRpZiB1cmxcblx0XHQjIHVybOW8gOWktOayoeaciVwiL1wi77yM6ZyA6KaB5re75YqgXCIvXCJcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybFxuXHRlbHNlXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVhcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gKHVzZXJJZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcblx0ZWxzZVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZDoxfX0pXG5cdHJldHVybiBzdS5jb21wYW55X2lkXG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSAodXNlcklkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxuXHRlbHNlXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkczoxfX0pXG5cdHJldHVybiBzdT8uY29tcGFueV9pZHNcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSAocG8pLT5cblx0aWYgcG8uYWxsb3dDcmVhdGVcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLmFsbG93RWRpdFxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8uYWxsb3dEZWxldGVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby52aWV3QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0cG8udmlld0FsbFJlY29yZHMgPSB0cnVlXG5cdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHRcblx0IyDlpoLmnpzpmYTku7bnm7jlhbPmnYPpmZDphY3nva7kuLrnqbrvvIzliJnlhbzlrrnkuYvliY3msqHmnInpmYTku7bmnYPpmZDphY3nva7ml7bnmoTop4TliJlcblx0aWYgcG8uYWxsb3dSZWFkXG5cdFx0dHlwZW9mIHBvLmFsbG93UmVhZEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby52aWV3QWxsRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8udmlld0FsbEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0VkaXRcblx0XHR0eXBlb2YgcG8uYWxsb3dDcmVhdGVGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0NyZWF0ZUZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby5hbGxvd0VkaXRGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHR0eXBlb2YgcG8uYWxsb3dEZWxldGVGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0dHlwZW9mIHBvLm1vZGlmeUFsbEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLm1vZGlmeUFsbEZpbGVzID0gdHJ1ZVxuXG5cdGlmIHBvLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0RmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dEZWxldGVGaWxlc1xuXHRcdHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZVxuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby52aWV3QWxsRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZVxuXHRcdHBvLnZpZXdBbGxGaWxlcyA9IHRydWVcblxuXHRyZXR1cm4gcG9cblxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSAoKS0+XG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWRcblxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9ICgpLT5cblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkXG5cbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gKHNwYWNlSWQpLT5cblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWQgPT0gc3BhY2VJZFxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gKHNwYWNlSWQpLT5cblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5jbG91ZEFkbWluU3BhY2VJZCA9PSBzcGFjZUlkXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUlxuXHQiLCJ2YXIgRmliZXI7XG5cbkNyZWF0b3IuZGVwcyA9IHtcbiAgYXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5LFxuICBvYmplY3Q6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcbn07XG5cbkNyZWF0b3IuX1RFTVBMQVRFID0ge1xuICBBcHBzOiB7fSxcbiAgT2JqZWN0czoge31cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgcmV0dXJuIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xufSk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcbiAgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmxvYWRPYmplY3RzKG9iaiwgb2JqZWN0X25hbWUpO1xuICAgIH0pLnJ1bigpO1xuICB9O1xufVxuXG5DcmVhdG9yLmxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmoubmFtZTtcbiAgfVxuICBpZiAoIW9iai5saXN0X3ZpZXdzKSB7XG4gICAgb2JqLmxpc3Rfdmlld3MgPSB7fTtcbiAgfVxuICBpZiAob2JqLnNwYWNlKSB7XG4gICAgb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iaik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lID09PSAnY2ZzX2ZpbGVzX2ZpbGVyZWNvcmQnKSB7XG4gICAgb2JqZWN0X25hbWUgPSAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnO1xuICAgIG9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICBvYmoubmFtZSA9IG9iamVjdF9uYW1lO1xuICAgIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0gPSBvYmo7XG4gIH1cbiAgQ3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iaik7XG4gIG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuICBDcmVhdG9yLmluaXRUcmlnZ2VycyhvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdC5zcGFjZSkge1xuICAgIHJldHVybiBcImNfXCIgKyBvYmplY3Quc3BhY2UgKyBcIl9cIiArIG9iamVjdC5uYW1lO1xuICB9XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKSB7XG4gIHZhciByZWYsIHJlZjE7XG4gIGlmIChfLmlzQXJyYXkob2JqZWN0X25hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoKHJlZiA9IENyZWF0b3IuZGVwcykgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWYxID0gcmVmLm9iamVjdCkgIT0gbnVsbCkge1xuICAgICAgICByZWYxLmRlcGVuZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gZnVuY3Rpb24ob2JqZWN0X2lkKSB7XG4gIHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtcbiAgICBfaWQ6IG9iamVjdF9pZFxuICB9KTtcbn07XG5cbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgY29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpO1xuICBkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1soKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5fY29sbGVjdGlvbl9uYW1lIDogdm9pZCAwKSB8fCBvYmplY3RfbmFtZV07XG4gIH1cbn07XG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgcmVmLCByZWYxLCBzcGFjZTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIikpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYikgIT0gbnVsbCA/IHJlZjEuZmluZE9uZShzcGFjZUlkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhZG1pbnM6IDFcbiAgICB9XG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBpZiAoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmFkbWlucyA6IHZvaWQgMCkge1xuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgaWYgKCFfLmlzU3RyaW5nKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBmb3JtdWxhcjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gZm9ybXVsYXI7XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGNvbnRleHQpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBzZWxlY3RvciA9IHt9O1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGFjdGlvbiwgbmFtZSwgdmFsdWU7XG4gICAgaWYgKChmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5sZW5ndGggOiB2b2lkIDApID09PSAzKSB7XG4gICAgICBuYW1lID0gZmlsdGVyWzBdO1xuICAgICAgYWN0aW9uID0gZmlsdGVyWzFdO1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpO1xuICAgICAgc2VsZWN0b3JbbmFtZV0gPSB7fTtcbiAgICAgIHJldHVybiBzZWxlY3RvcltuYW1lXVthY3Rpb25dID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICByZXR1cm4gc3BhY2VJZCA9PT0gJ2NvbW1vbic7XG59O1xuXG5cbi8qXG5cdGRvY3PvvJrlvoXmjpLluo/nmoTmlofmoaPmlbDnu4Rcblx0aWRz77yaX2lk6ZuG5ZCIXG5cdGlkX2tleTog6buY6K6k5Li6X2lkXG5cdHJldHVybiDmjInnhadpZHPnmoTpobrluo/ov5Tlm57mlrDnmoTmlofmoaPpm4blkIhcbiAqL1xuXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IGZ1bmN0aW9uKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpIHtcbiAgdmFyIHZhbHVlcztcbiAgaWYgKCFpZF9rZXkpIHtcbiAgICBpZF9rZXkgPSBcIl9pZFwiO1xuICB9XG4gIGlmIChoaXRfZmlyc3QpIHtcbiAgICB2YWx1ZXMgPSBkb2NzLmdldFByb3BlcnR5KGlkX2tleSk7XG4gICAgcmV0dXJuIF8uc29ydEJ5KGRvY3MsIGZ1bmN0aW9uKGRvYykge1xuICAgICAgdmFyIF9pbmRleDtcbiAgICAgIF9pbmRleCA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKTtcbiAgICAgIGlmIChfaW5kZXggPiAtMSkge1xuICAgICAgICByZXR1cm4gX2luZGV4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF8uc29ydEJ5KGRvY3MsIGZ1bmN0aW9uKGRvYykge1xuICAgICAgcmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKTtcbiAgICB9KTtcbiAgfVxufTtcblxuXG4vKlxuXHTmjInnlKjmiLfmiYDlsZ7mnKzlnLDljJbor63oqIDov5vooYzmjpLluo/vvIzmlK/mjIHkuK3mlofjgIHmlbDlgLzjgIHml6XmnJ/nrYnlrZfmrrXmjpLluo9cblx05a+55LqOT2JqZWN057G75Z6L77yM5aaC5p6c5o+Q5L6b5L2c55So5Z+f5Lita2V55bGe5oCn77yM5YiZ5Y+W5YC85Li6dmFsdWVba2V5Xei/m+ihjOaOkuW6j+avlOi+g++8jOWPjeS5i+aVtOS4qk9iamVjdC50b1N0cmluZygp5ZCO5o6S5bqP5q+U6L6DXG4gKi9cblxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gZnVuY3Rpb24odmFsdWUxLCB2YWx1ZTIpIHtcbiAgdmFyIGlzVmFsdWUxRW1wdHksIGlzVmFsdWUyRW1wdHksIGxvY2FsZTtcbiAgaWYgKHRoaXMua2V5KSB7XG4gICAgdmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XTtcbiAgICB2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldO1xuICB9XG4gIGlmICh2YWx1ZTEgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodmFsdWUyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZTEgPT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHZhbHVlMiA9PT0gXCJudW1iZXJcIikge1xuICAgIHJldHVybiB2YWx1ZTEgLSB2YWx1ZTI7XG4gIH1cbiAgaXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PT0gbnVsbCB8fCB2YWx1ZTEgPT09IHZvaWQgMDtcbiAgaXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PT0gbnVsbCB8fCB2YWx1ZTIgPT09IHZvaWQgMDtcbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgIWlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGlmICghaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgcmV0dXJuIHZhbHVlMS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUodmFsdWUyLnRvU3RyaW5nKCksIGxvY2FsZSk7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIHBlcm1pc3Npb25zLCByZWxhdGVkTGlzdCwgcmVsYXRlZExpc3RNYXAsIHJlbGF0ZWRfb2JqZWN0cztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICBpZiAoIV9vYmplY3QpIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xuICB9XG4gIHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5KHJlbGF0ZWRMaXN0KSkge1xuICAgIHJlbGF0ZWRMaXN0TWFwID0ge307XG4gICAgXy5lYWNoKHJlbGF0ZWRMaXN0LCBmdW5jdGlvbihvYmpOYW1lKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChvYmpOYW1lKSkge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbb2JqTmFtZS5vYmplY3ROYW1lXSA9IHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWVdID0ge307XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lICYmIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdKSB7XG4gICAgICAgICAgaWYgKF8uaXNFbXB0eShyZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0ge1xuICAgICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSkge1xuICAgICAgcmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgICB9O1xuICAgIH1cbiAgICBfLmVhY2goWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIGZ1bmN0aW9uKGVuYWJsZU9iak5hbWUpIHtcbiAgICAgIGlmIChyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSkge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsXG4gICAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10pIHtcbiAgICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgICByZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddID0ge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMocmVsYXRlZExpc3RNYXApO1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2ZpbGVzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgIH0pO1xuICB9XG4gIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgdmFyIHNmc0ZpbGVzT2JqZWN0O1xuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICAgIHNmc0ZpbGVzT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKTtcbiAgICAgIHNmc0ZpbGVzT2JqZWN0ICYmIChyZWxhdGVkX29iamVjdCA9IHNmc0ZpbGVzT2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgaWYgKChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RfZmllbGRzXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnNwbGljZSgwLCAwLCB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Rhc2tzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwidGFza3NcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ub3Rlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcIm5vdGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZXZlbnRzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiZXZlbnRzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfaW5zdGFuY2VzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfYXBwcm92YWxzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiYXBwcm92YWxzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfcHJvY2Vzcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInByb2Nlc3NfaW5zdGFuY2VfaGlzdG9yeVwiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwidGFyZ2V0X29iamVjdFwiXG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgaWYgKF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIChwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMCkpIHtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKSB7XG4gIHZhciBVU0VSX0NPTlRFWFQsIHJlZiwgc3BhY2VfdXNlcl9vcmcsIHN1LCBzdUZpZWxkcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiBDcmVhdG9yLlVTRVJfQ09OVEVYVDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoISh1c2VySWQgJiYgc3BhY2VJZCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzdUZpZWxkcyA9IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBtb2JpbGU6IDEsXG4gICAgICBwb3NpdGlvbjogMSxcbiAgICAgIGVtYWlsOiAxLFxuICAgICAgY29tcGFueTogMSxcbiAgICAgIG9yZ2FuaXphdGlvbjogMSxcbiAgICAgIHNwYWNlOiAxLFxuICAgICAgY29tcGFueV9pZDogMSxcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfTtcbiAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgIH0pO1xuICAgIGlmICghc3UpIHtcbiAgICAgIHNwYWNlSWQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIGlmIChpc1VuU2FmZU1vZGUpIHtcbiAgICAgICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXN1KSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3BhY2VJZCA9IHN1LnNwYWNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIFVTRVJfQ09OVEVYVCA9IHt9O1xuICAgIFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWQ7XG4gICAgVVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkO1xuICAgIFVTRVJfQ09OVEVYVC51c2VyID0ge1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBuYW1lOiBzdS5uYW1lLFxuICAgICAgbW9iaWxlOiBzdS5tb2JpbGUsXG4gICAgICBwb3NpdGlvbjogc3UucG9zaXRpb24sXG4gICAgICBlbWFpbDogc3UuZW1haWwsXG4gICAgICBjb21wYW55OiBzdS5jb21wYW55LFxuICAgICAgY29tcGFueV9pZDogc3UuY29tcGFueV9pZCxcbiAgICAgIGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuICAgIH07XG4gICAgc3BhY2VfdXNlcl9vcmcgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKSkgIT0gbnVsbCA/IHJlZi5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbikgOiB2b2lkIDA7XG4gICAgaWYgKHNwYWNlX3VzZXJfb3JnKSB7XG4gICAgICBVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG4gICAgICAgIF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuICAgICAgICBmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBVU0VSX0NPTlRFWFQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgaWYgKF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAoKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCIvYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcImFzc2V0c1wiKSA6IHZvaWQgMCkgfHwgKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCIvcGFja2FnZXNcIikgOiB2b2lkIDApKSkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgaWYgKHVybCkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1LmNvbXBhbnlfaWQ7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UgIT0gbnVsbCA/IHN1LmNvbXBhbnlfaWRzIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSBmdW5jdGlvbihwbykge1xuICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0RlbGV0ZSkge1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0FsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd1JlYWQpIHtcbiAgICB0eXBlb2YgcG8uYWxsb3dSZWFkRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd1JlYWRGaWxlcyA9IHRydWUpO1xuICAgIHR5cGVvZiBwby52aWV3QWxsRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby52aWV3QWxsRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgdHlwZW9mIHBvLmFsbG93Q3JlYXRlRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd0NyZWF0ZUZpbGVzID0gdHJ1ZSk7XG4gICAgdHlwZW9mIHBvLmFsbG93RWRpdEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlKTtcbiAgICB0eXBlb2YgcG8uYWxsb3dEZWxldGVGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgIHR5cGVvZiBwby5tb2RpZnlBbGxGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLm1vZGlmeUFsbEZpbGVzID0gdHJ1ZSk7XG4gIH1cbiAgaWYgKHBvLmFsbG93Q3JlYXRlRmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0RlbGV0ZUZpbGVzKSB7XG4gICAgcG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlO1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0FsbEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWU7XG4gICAgcG8udmlld0FsbEZpbGVzID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcG87XG59O1xuXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSO1xufVxuIiwiTWV0ZW9yLm1ldGhvZHNcblx0IyDnlKjmiLfojrflj5Zsb29rdXAg44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteeahOmAiemhueWAvFxuXHRcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogKG9wdGlvbnMpLT5cblx0XHRpZiBvcHRpb25zPy5wYXJhbXM/LnJlZmVyZW5jZV90b1xuXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKVxuXG5cdFx0XHRuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXG5cdFx0XHRxdWVyeSA9IHt9XG5cdFx0XHRpZiBvcHRpb25zLnBhcmFtcy5zcGFjZVxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cblx0XHRcdFx0c29ydCA9IG9wdGlvbnM/LnNvcnRcblxuXHRcdFx0XHRzZWxlY3RlZCA9IG9wdGlvbnM/LnNlbGVjdGVkIHx8IFtdXG5cblx0XHRcdFx0b3B0aW9uc19saW1pdCA9IG9wdGlvbnM/Lm9wdGlvbnNfbGltaXQgfHwgMTBcblxuXHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7JHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHR9XG5cblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319LCBzZWFyY2hUZXh0UXVlcnldXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX1dXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpXG5cdFx0XHRcdFx0cXVlcnkuX2lkID0geyRuaW46IHNlbGVjdGVkfVxuXG5cdFx0XHRcdGNvbGxlY3Rpb24gPSBvYmplY3QuZGJcblxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XG5cdFx0XHRcdFx0Xy5leHRlbmQgcXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnlcblxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiBvcHRpb25zX2xpbWl0fVxuXG5cdFx0XHRcdGlmIHNvcnQgJiYgXy5pc09iamVjdChzb3J0KVxuXHRcdFx0XHRcdHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnRcblxuXHRcdFx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRyZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpXG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gW11cblx0XHRcdFx0XHRcdF8uZWFjaCByZWNvcmRzLCAocmVjb3JkKS0+XG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaFxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlY29yZC5faWRcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzXG5cdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxuXHRcdHJldHVybiBbXSAiLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGUsIG5hbWVfZmllbGRfa2V5LCBvYmplY3QsIG9wdGlvbnNfbGltaXQsIHF1ZXJ5LCBxdWVyeV9vcHRpb25zLCByZWNvcmRzLCByZWYsIHJlZjEsIHJlc3VsdHMsIHNlYXJjaFRleHRRdWVyeSwgc2VsZWN0ZWQsIHNvcnQ7XG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYgPSBvcHRpb25zLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpO1xuICAgICAgbmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLnNwYWNlKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2U7XG4gICAgICAgIHNvcnQgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNvcnQgOiB2b2lkIDA7XG4gICAgICAgIHNlbGVjdGVkID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc2VsZWN0ZWQgOiB2b2lkIDApIHx8IFtdO1xuICAgICAgICBvcHRpb25zX2xpbWl0ID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMub3B0aW9uc19saW1pdCA6IHZvaWQgMCkgfHwgMTA7XG4gICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0ge1xuICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmMSA9IG9wdGlvbnMudmFsdWVzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIHNlYXJjaFRleHRRdWVyeVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgJG5pbjogc2VsZWN0ZWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbGxlY3Rpb24gPSBvYmplY3QuZGI7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlclF1ZXJ5KSB7XG4gICAgICAgICAgXy5leHRlbmQocXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXJ5X29wdGlvbnMgPSB7XG4gICAgICAgICAgbGltaXQ6IG9wdGlvbnNfbGltaXRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNvcnQgJiYgXy5pc09iamVjdChzb3J0KSkge1xuICAgICAgICAgIHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKTtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChyZWNvcmRzLCBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5faWRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvd29ya2Zsb3cvdmlldy86aW5zdGFuY2VJZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxuXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxuXHRcdG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWVcblx0XHRyZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWRcblx0XHRzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkXG5cblx0XHRjaGVjayBvYmplY3RfbmFtZSwgU3RyaW5nXG5cdFx0Y2hlY2sgcmVjb3JkX2lkLCBTdHJpbmdcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXG5cblx0XHRpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZFxuXHRcdHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ11cblx0XHR4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddXG5cblx0XHRyZWRpcmVjdF91cmwgPSBcIi9cIlxuXHRcdGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZClcblx0XHQjIC0g5oiR55qE6I2J56i/5bCx6Lez6L2s6Iez6I2J56i/566xXG5cdFx0IyAtIOaIkeeahOW+heWuoeaguOWwsei3s+i9rOiHs+W+heWuoeaguFxuXHRcdCMgLSDkuI3mmK/miJHnmoTnlLPor7fljZXliJnot7Povazoh7PmiZPljbDpobXpnaJcblx0XHQjIC0g5aaC55Sz6K+35Y2V5LiN5a2Y5Zyo5YiZ5o+Q56S655So5oi355Sz6K+35Y2V5bey5Yig6Zmk77yM5bm25LiU5pu05pawcmVjb3Jk55qE54q25oCB77yM5L2/55So5oi35Y+v5Lul6YeN5paw5Y+R6LW35a6h5om5XG5cdFx0aWYgaW5zXG5cdFx0XHRib3ggPSAnJ1xuXHRcdFx0c3BhY2VJZCA9IGlucy5zcGFjZVxuXHRcdFx0Zmxvd0lkID0gaW5zLmZsb3dcblxuXHRcdFx0aWYgKGlucy5pbmJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKSBvciAoaW5zLmNjX3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdGJveCA9ICdpbmJveCdcblx0XHRcdGVsc2UgaWYgaW5zLm91dGJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkXG5cdFx0XHRcdGJveCA9ICdvdXRib3gnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnZHJhZnQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxuXHRcdFx0XHRib3ggPSAnZHJhZnQnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAncGVuZGluZycgYW5kIChpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZCBvciBpbnMuYXBwbGljYW50IGlzIGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0Ym94ID0gJ3BlbmRpbmcnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnY29tcGxldGVkJyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcblx0XHRcdFx0Ym94ID0gJ2NvbXBsZXRlZCdcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDpqozor4Fsb2dpbiB1c2VyX2lk5a+56K+l5rWB56iL5pyJ566h55CG44CB6KeC5a+f55Sz6K+35Y2V55qE5p2D6ZmQXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHsgZmllbGRzOiB7IGFkbWluczogMSB9IH0pXG5cdFx0XHRcdGlmIHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgb3IgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJtb25pdG9yXCIpIG9yIHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdFx0Ym94ID0gJ21vbml0b3InXG5cdFx0XHR3b3JrZmxvd1VybCA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXM/LndvcmtmbG93Py51cmxcblx0XHRcdGlmIGJveFxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgXCJ3b3JrZmxvdy9zcGFjZS8je3NwYWNlSWR9LyN7Ym94fS8je2luc0lkfT9YLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgXCJ3b3JrZmxvdy9zcGFjZS8je3NwYWNlSWR9L3ByaW50LyN7aW5zSWR9P2JveD1tb25pdG9yJnByaW50X2lzX3Nob3dfdHJhY2VzPTEmcHJpbnRfaXNfc2hvd19hdHRhY2htZW50cz0xJlgtVXNlci1JZD0je3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSN7eF9hdXRoX3Rva2VufVwiXG5cblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogMjAwXG5cdFx0XHRcdGRhdGE6IHsgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmwgfVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXG5cdFx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRcdGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xuXHRcdFx0XHRcdCR1bnNldDoge1xuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZXNcIjogMSxcblx0XHRcdFx0XHRcdFwiaW5zdGFuY2Vfc3RhdGVcIjogMSxcblx0XHRcdFx0XHRcdFwibG9ja2VkXCI6IDFcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3InLCAn55Sz6K+35Y2V5bey5Yig6ZmkJylcblxuXHRjYXRjaCBlXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxuXHRcdH1cblxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJveCwgY29sbGVjdGlvbiwgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgZmxvd0lkLCBoYXNoRGF0YSwgaW5zLCBpbnNJZCwgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25zLCByZWNvcmRfaWQsIHJlZGlyZWN0X3VybCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCBzcGFjZSwgc3BhY2VJZCwgc3BhY2VfaWQsIHdvcmtmbG93VXJsLCB4X2F1dGhfdG9rZW4sIHhfdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWU7XG4gICAgcmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkO1xuICAgIHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWQ7XG4gICAgY2hlY2sob2JqZWN0X25hbWUsIFN0cmluZyk7XG4gICAgY2hlY2socmVjb3JkX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkO1xuICAgIHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgeF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXTtcbiAgICByZWRpcmVjdF91cmwgPSBcIi9cIjtcbiAgICBpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpO1xuICAgIGlmIChpbnMpIHtcbiAgICAgIGJveCA9ICcnO1xuICAgICAgc3BhY2VJZCA9IGlucy5zcGFjZTtcbiAgICAgIGZsb3dJZCA9IGlucy5mbG93O1xuICAgICAgaWYgKCgocmVmID0gaW5zLmluYm94X3VzZXJzKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHx8ICgocmVmMSA9IGlucy5jY191c2VycykgIT0gbnVsbCA/IHJlZjEuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgYm94ID0gJ2luYm94JztcbiAgICAgIH0gZWxzZSBpZiAoKHJlZjIgPSBpbnMub3V0Ym94X3VzZXJzKSAhPSBudWxsID8gcmVmMi5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSB7XG4gICAgICAgIGJveCA9ICdvdXRib3gnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdkcmFmdCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdkcmFmdCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ3BlbmRpbmcnICYmIChpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQgfHwgaW5zLmFwcGxpY2FudCA9PT0gY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICBib3ggPSAncGVuZGluZyc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2NvbXBsZXRlZCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdjb21wbGV0ZWQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpO1xuICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGFkbWluczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIHx8IHBlcm1pc3Npb25zLmluY2x1ZGVzKFwibW9uaXRvclwiKSB8fCBzcGFjZS5hZG1pbnMuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICAgIGJveCA9ICdtb25pdG9yJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgd29ya2Zsb3dVcmwgPSAocmVmMyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcykgIT0gbnVsbCA/IChyZWY0ID0gcmVmMy53b3JrZmxvdykgIT0gbnVsbCA/IHJlZjQudXJsIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGJveCkge1xuICAgICAgICByZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgKFwid29ya2Zsb3cvc3BhY2UvXCIgKyBzcGFjZUlkICsgXCIvXCIgKyBib3ggKyBcIi9cIiArIGluc0lkICsgXCI/WC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9wcmludC9cIiArIGluc0lkICsgXCI/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH1cbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKTtcbiAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xuICAgICAgICAgICR1bnNldDoge1xuICAgICAgICAgICAgXCJpbnN0YW5jZXNcIjogMSxcbiAgICAgICAgICAgIFwiaW5zdGFuY2Vfc3RhdGVcIjogMSxcbiAgICAgICAgICAgIFwibG9ja2VkXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKSAtPlxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpPy5fc2NoZW1hXG5cdGNvbHVtbl9udW0gPSAwXG5cdGlmIF9zY2hlbWFcblx0XHRfLmVhY2ggY29sdW1ucywgKGZpZWxkX25hbWUpIC0+XG5cdFx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxuXHRcdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxuXHRcdFx0aWYgaXNfd2lkZVxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDJcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y29sdW1uX251bSArPSAxXG5cblx0XHRpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtXG5cdFx0cmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudFxuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSAtPlxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWFcblx0aWYgX3NjaGVtYVxuXHRcdGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpXG5cdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxuXHRcdHJldHVybiBpc193aWRlXG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIC0+XG5cdHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zPy5zZXR0aW5ncz8uZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wifSlcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBfLm1hcCBjb2x1bW5zLCAoY29sdW1uKS0+XG5cdFx0ZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl1cblx0XHRpZiBmaWVsZD8udHlwZSBhbmQgIWZpZWxkLmhpZGRlblxuXHRcdFx0cmV0dXJuIGNvbHVtblxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0Y29sdW1ucyA9IF8uY29tcGFjdCBjb2x1bW5zXG5cdGlmIHNldHRpbmcgYW5kIHNldHRpbmcuc2V0dGluZ3Ncblx0XHRzb3J0ID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdPy5zb3J0IHx8IFtdXG5cdFx0c29ydCA9IF8ubWFwIHNvcnQsIChvcmRlciktPlxuXHRcdFx0a2V5ID0gb3JkZXJbMF1cblx0XHRcdGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSlcblx0XHRcdG9yZGVyWzBdID0gaW5kZXggKyAxXG5cdFx0XHRyZXR1cm4gb3JkZXJcblx0XHRyZXR1cm4gc29ydFxuXHRyZXR1cm4gW11cblxuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXG5cdGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXVxuXHRkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdXG5cdGlmIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xuXHRcdGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uIGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xuXG5cdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW11cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0Q3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHM/W29iamVjdF9uYW1lXSA9IFtdXG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gKGRlZmF1bHRfdmlldywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSktPlxuXHRkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/LmNvbHVtbnNcblx0ZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldz8ubW9iaWxlX2NvbHVtbnNcblx0dW5sZXNzIGxpc3Rfdmlld1xuXHRcdHJldHVyblxuXHRvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KVxuXHRpZiAhXy5oYXMob2l0ZW0sIFwibmFtZVwiKVxuXHRcdG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZVxuXHRpZiAhb2l0ZW0uY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRfY29sdW1uc1xuXHRcdFx0b2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1uc1xuXHRpZiAhb2l0ZW0uY29sdW1uc1xuXHRcdG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdXG5cdGlmICFvaXRlbS5tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcblx0XHRcdG9pdGVtLm1vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF9tb2JpbGVfY29sdW1uc1xuXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpXG5cdFx0XHRvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJylcblxuXG5cdGlmICFvaXRlbS5maWx0ZXJfc2NvcGVcblx0XHQjIGxpc3R2aWV36KeG5Zu+55qEZmlsdGVyX3Njb3Bl6buY6K6k5YC85pS55Li6c3BhY2UgIzEzMVxuXHRcdG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIlxuXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJfaWRcIilcblx0XHRvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZVxuXHRlbHNlXG5cdFx0b2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZVxuXG5cdGlmIF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucylcblx0XHRvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKVxuXG5cdF8uZm9yRWFjaCBvaXRlbS5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cblx0XHRpZiAhXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXG5cdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXG5cdHJldHVybiBvaXRlbVxuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gKG9iamVjdF9uYW1lKS0+XG5cdFx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0XHRyZXR1cm5cblx0XHRyZWxhdGVkTGlzdE9iamVjdHMgPSB7fVxuXHRcdHJlbGF0ZWRMaXN0TmFtZXMgPSBbXVxuXHRcdG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyA9IFtdO1xuXHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiBfb2JqZWN0XG5cdFx0XHRsYXlvdXRSZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZF9saXN0cztcblx0XHRcdCMgbGF5b3V0UmVsYXRlZExpc3Qg5piv5pWw57uE5bCx6KGo56S66YWN572u6L+H6aG16Z2i5biD5bGA77yM5bCx5ZCv55So6aG16Z2i5biD5bGA55qE55u45YWz5a2Q6KGo44CCXG5cdFx0XHRpZiBfLmlzQXJyYXkgbGF5b3V0UmVsYXRlZExpc3Rcblx0XHRcdFx0Xy5lYWNoIGxheW91dFJlbGF0ZWRMaXN0LCAoaXRlbSktPlxuXHRcdFx0XHRcdHJlT2JqZWN0TmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdFx0cmVGaWVsZE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gQ3JlYXRvci5nZXRPYmplY3QocmVPYmplY3ROYW1lKT8uZmllbGRzW3JlRmllbGROYW1lXT8ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiByZU9iamVjdE5hbWVcblx0XHRcdFx0XHRcdGNvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXNcblx0XHRcdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzXG5cdFx0XHRcdFx0XHRpc19maWxlOiByZU9iamVjdE5hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uOiBpdGVtLmZpbHRlcnNcblx0XHRcdFx0XHRcdHNvcnQ6IGl0ZW0uc29ydFxuXHRcdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiByZUZpZWxkTmFtZVxuXHRcdFx0XHRcdFx0Y3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWVcblx0XHRcdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXHRcdFx0XHRcdFx0bGFiZWw6IGl0ZW0ubGFiZWxcblx0XHRcdFx0XHRcdGFjdGlvbnM6IGl0ZW0uYnV0dG9uc1xuXHRcdFx0XHRcdFx0dmlzaWJsZV9vbjogaXRlbS52aXNpYmxlX29uXG5cdFx0XHRcdFx0XHRwYWdlX3NpemU6IGl0ZW0ucGFnZV9zaXplXG5cdFx0XHRcdFx0b2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLnB1c2gocmVsYXRlZClcblx0XHRcdFx0cmV0dXJuIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cztcblx0XHRcdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxuXHRcdFx0aWYgIV8uaXNFbXB0eSByZWxhdGVkTGlzdFxuXHRcdFx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpPck5hbWUpLT5cblx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0IG9iak9yTmFtZVxuXHRcdFx0XHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmpPck5hbWUub2JqZWN0TmFtZVxuXHRcdFx0XHRcdFx0XHRjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1uc1xuXHRcdFx0XHRcdFx0XHRtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdFx0XHRcdGlzX2ZpbGU6IG9iak9yTmFtZS5vYmplY3ROYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdFx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uOiBvYmpPck5hbWUuZmlsdGVyc1xuXHRcdFx0XHRcdFx0XHRzb3J0OiBvYmpPck5hbWUuc29ydFxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6ICcnXG5cdFx0XHRcdFx0XHRcdGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlXG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBvYmpPck5hbWUubGFiZWxcblx0XHRcdFx0XHRcdFx0YWN0aW9uczogb2JqT3JOYW1lLmFjdGlvbnNcblx0XHRcdFx0XHRcdFx0cGFnZV9zaXplOiBvYmpPck5hbWUucGFnZV9zaXplXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE9iamVjdHNbb2JqT3JOYW1lLm9iamVjdE5hbWVdID0gcmVsYXRlZFxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3ROYW1lcy5wdXNoIG9iak9yTmFtZS5vYmplY3ROYW1lXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzU3RyaW5nIG9iak9yTmFtZVxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3ROYW1lcy5wdXNoIG9iak9yTmFtZVxuXG5cdFx0bWFwTGlzdCA9IHt9XG5cdFx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3RfaXRlbSkgLT5cblx0XHRcdGlmICFyZWxhdGVkX29iamVjdF9pdGVtPy5vYmplY3RfbmFtZVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5XG5cdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSlcblx0XHRcdHVubGVzcyByZWxhdGVkX29iamVjdFxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cblx0XHRcdGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxuXHRcdFx0bW9iaWxlX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRydWUpIHx8IFtcIm5hbWVcIl1cblx0XHRcdG1vYmlsZV9jb2x1bW5zID0gXy53aXRob3V0KG1vYmlsZV9jb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpXG5cblx0XHRcdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKVxuXHRcdFx0dGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucylcblxuXHRcdFx0aWYgL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpXG5cdFx0XHRcdCMgb2JqZWN057G75Z6L5bim5a2Q5bGe5oCn55qEcmVsYXRlZF9maWVsZF9uYW1l6KaB5Y675o6J5Lit6Ze055qE576O5YWD56ym5Y+377yM5ZCm5YiZ5pi+56S65LiN5Ye65a2X5q615YC8XG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLFwiXCIpXG5cdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0b2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWVcblx0XHRcdFx0Y29sdW1uczogY29sdW1uc1xuXHRcdFx0XHRtb2JpbGVfY29sdW1uczogbW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiByZWxhdGVkX2ZpZWxkX25hbWVcblx0XHRcdFx0aXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXG5cdFx0XHRyZWxhdGVkT2JqZWN0ID0gcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuY29sdW1uc1xuXHRcdFx0XHRcdHJlbGF0ZWQuY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QuY29sdW1uc1xuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdFx0cmVsYXRlZC5tb2JpbGVfY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5zb3J0XG5cdFx0XHRcdFx0cmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uXG5cdFx0XHRcdFx0cmVsYXRlZC5maWx0ZXJzRnVuY3Rpb24gPSByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvblxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XG5cdFx0XHRcdFx0cmVsYXRlZC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCA9IHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Rcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5sYWJlbFxuXHRcdFx0XHRcdHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QucGFnZV9zaXplXG5cdFx0XHRcdFx0cmVsYXRlZC5wYWdlX3NpemUgPSByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZVxuXHRcdFx0XHRkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cblx0XHRcdG1hcExpc3RbcmVsYXRlZC5vYmplY3RfbmFtZV0gPSByZWxhdGVkXG5cblxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKVxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHNcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcblx0XHRfLmVhY2ggcmVsYXRlZExpc3RPYmplY3RzLCAodiwgcmVsYXRlZF9vYmplY3RfbmFtZSkgLT5cblx0XHRcdGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xXG5cdFx0XHRhbGxvd1JlYWQgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmFsbG93UmVhZFxuXHRcdFx0aWYgaXNBY3RpdmUgJiYgYWxsb3dSZWFkXG5cdFx0XHRcdG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2XG5cblx0XHRsaXN0ID0gW11cblx0XHRpZiBfLmlzRW1wdHkgcmVsYXRlZExpc3ROYW1lc1xuXHRcdFx0bGlzdCA9ICBfLnZhbHVlcyBtYXBMaXN0XG5cdFx0ZWxzZVxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0TmFtZXMsIChvYmplY3ROYW1lKSAtPlxuXHRcdFx0XHRpZiBtYXBMaXN0W29iamVjdE5hbWVdXG5cdFx0XHRcdFx0bGlzdC5wdXNoIG1hcExpc3Rbb2JqZWN0TmFtZV1cblxuXHRcdGlmIF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpXG5cdFx0XHRsaXN0ID0gXy5maWx0ZXIgbGlzdCwgKGl0ZW0pLT5cblx0XHRcdFx0cmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKVxuXG5cdFx0cmV0dXJuIGxpc3RcblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gKG9iamVjdF9uYW1lKS0+XG5cdHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSlcblxuIyMjIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiMjI1xuQ3JlYXRvci5nZXRMaXN0VmlldyA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRyZXR1cm5cblx0bGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXG5cdHVubGVzcyBsaXN0Vmlld3M/Lmxlbmd0aFxuXHRcdHJldHVyblxuXHRsaXN0X3ZpZXcgPSBfLmZpbmQobGlzdFZpZXdzLCAoaXRlbSktPiByZXR1cm4gaXRlbS5faWQgPT0gbGlzdF92aWV3X2lkIHx8IGl0ZW0ubmFtZSA9PSBsaXN0X3ZpZXdfaWQpXG5cdHVubGVzcyBsaXN0X3ZpZXdcblx0XHQjIOWmguaenOS4jemcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOWImem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvu+8jOWPjeS5i+i/lOWbnuepulxuXHRcdGlmIGV4YWNcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXVxuXHRyZXR1cm4gbGlzdF92aWV3XG5cbiPojrflj5ZsaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77mmK/lkKbmmK/mnIDov5Hmn6XnnIvop4blm75cbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0aWYgdHlwZW9mKGxpc3Rfdmlld19pZCkgPT0gXCJzdHJpbmdcIlxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmICFvYmplY3Rcblx0XHRcdHJldHVyblxuXHRcdGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3Mse19pZDogbGlzdF92aWV3X2lkfSlcblx0ZWxzZVxuXHRcdGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkXG5cdHJldHVybiBsaXN0Vmlldz8ubmFtZSA9PSBcInJlY2VudFwiXG5cblxuIyMjXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcblx06KeE5YiZ77yaXG5cdDEu5LyY5YWI5oqKY29sdW1uc+S4reeahG5hbWXlrZfmrrXmjpLlnKjnrKzkuIDkuKpcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXG4jIyNcbkNyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpLT5cblx0cmVzdWx0ID0gW11cblx0bWF4Um93cyA9IDIgXG5cdG1heENvdW50ID0gbWF4Um93cyAqIDJcblx0Y291bnQgPSAwXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRmaWVsZHMgPSBvYmplY3QuZmllbGRzXG5cdHVubGVzcyBvYmplY3Rcblx0XHRyZXR1cm4gY29sdW1uc1xuXHRuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cdGlzTmFtZUNvbHVtbiA9IChpdGVtKS0+XG5cdFx0aWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0cmV0dXJuIGl0ZW0uZmllbGQgPT0gbmFtZUtleVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBpdGVtID09IG5hbWVLZXlcblx0Z2V0RmllbGQgPSAoaXRlbSktPlxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdHJldHVybiBmaWVsZHNbaXRlbS5maWVsZF1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW1dXG5cdGlmIG5hbWVLZXlcblx0XHRuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kIChpdGVtKS0+XG5cdFx0XHRyZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pXG5cdGlmIG5hbWVDb2x1bW5cblx0XHRmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXG5cdFx0Y291bnQgKz0gaXRlbUNvdW50XG5cdFx0cmVzdWx0LnB1c2ggbmFtZUNvbHVtblxuXHRjb2x1bW5zLmZvckVhY2ggKGl0ZW0pLT5cblx0XHRmaWVsZCA9IGdldEZpZWxkKGl0ZW0pXG5cdFx0dW5sZXNzIGZpZWxkXG5cdFx0XHRyZXR1cm5cblx0XHRpdGVtQ291bnQgPSBpZiBmaWVsZC5pc193aWRlIHRoZW4gMiBlbHNlIDFcblx0XHRpZiBjb3VudCA8IG1heENvdW50IGFuZCByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgYW5kICFpc05hbWVDb2x1bW4oaXRlbSlcblx0XHRcdGNvdW50ICs9IGl0ZW1Db3VudFxuXHRcdFx0aWYgY291bnQgPD0gbWF4Q291bnRcblx0XHRcdFx0cmVzdWx0LnB1c2ggaXRlbVxuXHRcblx0cmV0dXJuIHJlc3VsdFxuXG4jIyNcbiAgICDojrflj5bpu5jorqTop4blm75cbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IChvYmplY3RfbmFtZSktPlxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0aWYgb2JqZWN0Py5saXN0X3ZpZXdzPy5kZWZhdWx0XG5cdFx0I1RPRE8g5q2k5Luj56CB5Y+q5piv5pqC5pe25YW85a655Lul5YmNY29kZeS4reWumuS5ieeahGRlZmF1bHTop4blm77vvIzlvoVjb2Rl5Lit55qEZGVmYXVsdOa4heeQhuWujOaIkOWQju+8jOmcgOimgeWIoOmZpOatpOS7o+eggVxuXHRcdGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3MuZGVmYXVsdFxuXHRlbHNlXG5cdFx0Xy5lYWNoIG9iamVjdD8ubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KS0+XG5cdFx0XHRpZiBsaXN0X3ZpZXcubmFtZSA9PSBcImFsbFwiIHx8IGtleSA9PSBcImFsbFwiXG5cdFx0XHRcdGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3XG5cdHJldHVybiBkZWZhdWx0VmlldztcblxuIyMjXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMgPSAob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucyktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBkZWZhdWx0Vmlldz8uY29sdW1uc1xuXHRpZiB1c2VfbW9iaWxlX2NvbHVtbnNcblx0XHRpZiBkZWZhdWx0Vmlldz8ubW9iaWxlX2NvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1uc1xuXHRcdGVsc2UgaWYgY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpXG5cdHJldHVybiBjb2x1bW5zXG5cbiMjI1xuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOesrOS4gOS4quinhuWbvuaYvuekuueahOWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zID0gKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBkZWZhdWx0Vmlldz8uY29sdW1uc1xuXHRpZiB1c2VfbW9iaWxlX2NvbHVtbnNcblx0XHRpZiBkZWZhdWx0Vmlldz8ubW9iaWxlX2NvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1uc1xuXHRcdGVsc2UgaWYgY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpXG5cdHJldHVybiBjb2x1bW5zXG5cbiMjI1xuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0cmV0dXJuIGRlZmF1bHRWaWV3Py5leHRyYV9jb2x1bW5zXG5cbiMjI1xuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IChvYmplY3RfbmFtZSktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXG5cdGlmIGRlZmF1bHRWaWV3XG5cdFx0aWYgZGVmYXVsdFZpZXcuc29ydFxuXHRcdFx0cmV0dXJuIGRlZmF1bHRWaWV3LnNvcnRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXVxuXG5cbiMjI1xuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XG4jIyNcbkNyZWF0b3IuaXNBbGxWaWV3ID0gKGxpc3RfdmlldyktPlxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwiYWxsXCJcblxuIyMjXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiMjI1xuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSAobGlzdF92aWV3KS0+XG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJyZWNlbnRcIlxuXG4jIyNcbiAgICDlsIZzb3J06L2s5o2i5Li6VGFidWxhcuaOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuIyMjXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSAoc29ydCwgdGFidWxhckNvbHVtbnMpLT5cblx0dGFidWxhcl9zb3J0ID0gW11cblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXG5cdFx0XHQjIOWFvOWuueaXp+eahOaVsOaNruagvOW8j1tbXCJmaWVsZF9uYW1lXCIsIFwib3JkZXJcIl1dXG5cdFx0XHRpZiBpdGVtLmxlbmd0aCA9PSAxXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBcImFzY1wiXVxuXHRcdFx0ZWxzZSBpZiBpdGVtLmxlbmd0aCA9PSAyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBpdGVtWzFdXVxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgb3JkZXJdXG5cblx0cmV0dXJuIHRhYnVsYXJfc29ydFxuXG4jIyNcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuIyMjXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gKHNvcnQpLT5cblx0ZHhfc29ydCA9IFtdXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxuXHRcdGlmIF8uaXNBcnJheShpdGVtKVxuXHRcdFx0I+WFvOWuueaXp+agvOW8j++8mltbXCJmaWVsZF9uYW1lXCIsIFwib3JkZXJcIl1dXG5cdFx0XHRkeF9zb3J0LnB1c2goaXRlbSlcblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdCPmlrDmlbDmja7moLzlvI/vvJpbe2ZpZWxkX25hbWU6ICwgb3JkZXI6IH1dXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcblx0XHRcdGlmIGZpZWxkX25hbWUgJiYgb3JkZXJcblx0XHRcdFx0ZHhfc29ydC5wdXNoIFtmaWVsZF9uYW1lLCBvcmRlcl1cblxuXHRyZXR1cm4gZHhfc29ydFxuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIF9zY2hlbWEsIGNvbHVtbl9udW0sIGluaXRfd2lkdGhfcGVyY2VudCwgcmVmO1xuICBfc2NoZW1hID0gKHJlZiA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5fc2NoZW1hIDogdm9pZCAwO1xuICBjb2x1bW5fbnVtID0gMDtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgICAgdmFyIGZpZWxkLCBpc193aWRlLCByZWYxLCByZWYyO1xuICAgICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgICBpc193aWRlID0gKHJlZjEgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjIuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc193aWRlKSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW07XG4gICAgcmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSB7XG4gIHZhciBfc2NoZW1hLCBmaWVsZCwgaXNfd2lkZSwgcmVmLCByZWYxO1xuICBfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWE7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgaXNfd2lkZSA9IChyZWYgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIHJldHVybiBpc193aWRlO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgdmFyIG9iaiwgcmVmLCByZWYxLCByZWYyLCBzZXR0aW5nLCBzb3J0O1xuICBzZXR0aW5nID0gKHJlZiA9IENyZWF0b3IuQ29sbGVjdGlvbnMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5zZXR0aW5ncykgIT0gbnVsbCA/IHJlZjEuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IF8ubWFwKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgIHZhciBmaWVsZDtcbiAgICBmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXTtcbiAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSAmJiAhZmllbGQuaGlkZGVuKSB7XG4gICAgICByZXR1cm4gY29sdW1uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgfSk7XG4gIGNvbHVtbnMgPSBfLmNvbXBhY3QoY29sdW1ucyk7XG4gIGlmIChzZXR0aW5nICYmIHNldHRpbmcuc2V0dGluZ3MpIHtcbiAgICBzb3J0ID0gKChyZWYyID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gcmVmMi5zb3J0IDogdm9pZCAwKSB8fCBbXTtcbiAgICBzb3J0ID0gXy5tYXAoc29ydCwgZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgIHZhciBpbmRleCwga2V5O1xuICAgICAga2V5ID0gb3JkZXJbMF07XG4gICAgICBpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpO1xuICAgICAgb3JkZXJbMF0gPSBpbmRleCArIDE7XG4gICAgICByZXR1cm4gb3JkZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucywgZXh0cmFfY29sdW1ucywgb2JqZWN0LCBvcmRlciwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICBleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl07XG4gIGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl07XG4gIGlmIChkZWZhdWx0X2V4dHJhX2NvbHVtbnMpIHtcbiAgICBleHRyYV9jb2x1bW5zID0gXy51bmlvbihleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMpO1xuICB9XG4gIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW107XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gKHJlZiA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzKSAhPSBudWxsID8gcmVmW29iamVjdF9uYW1lXSA9IFtdIDogdm9pZCAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IGZ1bmN0aW9uKGRlZmF1bHRfdmlldywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSkge1xuICB2YXIgZGVmYXVsdF9jb2x1bW5zLCBkZWZhdWx0X21vYmlsZV9jb2x1bW5zLCBvaXRlbTtcbiAgZGVmYXVsdF9jb2x1bW5zID0gZGVmYXVsdF92aWV3ICE9IG51bGwgPyBkZWZhdWx0X3ZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldyAhPSBudWxsID8gZGVmYXVsdF92aWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIHJldHVybjtcbiAgfVxuICBvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KTtcbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpKSB7XG4gICAgb2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lO1xuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdO1xuICB9XG4gIGlmICghb2l0ZW0ubW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9tb2JpbGVfY29sdW1ucykge1xuICAgICAgb2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJyk7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uZmlsdGVyX3Njb3BlKSB7XG4gICAgb2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiO1xuICB9XG4gIGlmICghXy5oYXMob2l0ZW0sIFwiX2lkXCIpKSB7XG4gICAgb2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWU7XG4gIH0gZWxzZSB7XG4gICAgb2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZTtcbiAgfVxuICBpZiAoXy5pc1N0cmluZyhvaXRlbS5vcHRpb25zKSkge1xuICAgIG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpO1xuICB9XG4gIF8uZm9yRWFjaChvaXRlbS5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgIGlmICghXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2l0ZW07XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVsYXRlZExpc3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciBfb2JqZWN0LCBsYXlvdXRSZWxhdGVkTGlzdCwgbGlzdCwgbWFwTGlzdCwgb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TmFtZXMsIHJlbGF0ZWRMaXN0T2JqZWN0cywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgc3BhY2VJZCwgdW5yZWxhdGVkX29iamVjdHMsIHVzZXJJZDtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlbGF0ZWRMaXN0T2JqZWN0cyA9IHt9O1xuICAgIHJlbGF0ZWRMaXN0TmFtZXMgPSBbXTtcbiAgICBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMgPSBbXTtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICBsYXlvdXRSZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZF9saXN0cztcbiAgICAgIGlmIChfLmlzQXJyYXkobGF5b3V0UmVsYXRlZExpc3QpKSB7XG4gICAgICAgIF8uZWFjaChsYXlvdXRSZWxhdGVkTGlzdCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHZhciByZUZpZWxkTmFtZSwgcmVPYmplY3ROYW1lLCByZWYsIHJlZjEsIHJlbGF0ZWQsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgICAgICAgIHJlT2JqZWN0TmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIHJlRmllbGROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QocmVPYmplY3ROYW1lKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmZpZWxkc1tyZUZpZWxkTmFtZV0pICE9IG51bGwgPyByZWYxLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVPYmplY3ROYW1lLFxuICAgICAgICAgICAgY29sdW1uczogaXRlbS5maWVsZF9uYW1lcyxcbiAgICAgICAgICAgIG1vYmlsZV9jb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzLFxuICAgICAgICAgICAgaXNfZmlsZTogcmVPYmplY3ROYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICAgICAgZmlsdGVyc0Z1bmN0aW9uOiBpdGVtLmZpbHRlcnMsXG4gICAgICAgICAgICBzb3J0OiBpdGVtLnNvcnQsXG4gICAgICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlRmllbGROYW1lLFxuICAgICAgICAgICAgY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWUsXG4gICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQsXG4gICAgICAgICAgICBsYWJlbDogaXRlbS5sYWJlbCxcbiAgICAgICAgICAgIGFjdGlvbnM6IGl0ZW0uYnV0dG9ucyxcbiAgICAgICAgICAgIHZpc2libGVfb246IGl0ZW0udmlzaWJsZV9vbixcbiAgICAgICAgICAgIHBhZ2Vfc2l6ZTogaXRlbS5wYWdlX3NpemVcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMucHVzaChyZWxhdGVkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHM7XG4gICAgICB9XG4gICAgICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gICAgICBpZiAoIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICAgICAgXy5lYWNoKHJlbGF0ZWRMaXN0LCBmdW5jdGlvbihvYmpPck5hbWUpIHtcbiAgICAgICAgICB2YXIgcmVsYXRlZDtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChvYmpPck5hbWUpKSB7XG4gICAgICAgICAgICByZWxhdGVkID0ge1xuICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWUsXG4gICAgICAgICAgICAgIGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zLFxuICAgICAgICAgICAgICBtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zLFxuICAgICAgICAgICAgICBpc19maWxlOiBvYmpPck5hbWUub2JqZWN0TmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgICAgICAgZmlsdGVyc0Z1bmN0aW9uOiBvYmpPck5hbWUuZmlsdGVycyxcbiAgICAgICAgICAgICAgc29ydDogb2JqT3JOYW1lLnNvcnQsXG4gICAgICAgICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogJycsXG4gICAgICAgICAgICAgIGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlLFxuICAgICAgICAgICAgICBsYWJlbDogb2JqT3JOYW1lLmxhYmVsLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBvYmpPck5hbWUuYWN0aW9ucyxcbiAgICAgICAgICAgICAgcGFnZV9zaXplOiBvYmpPck5hbWUucGFnZV9zaXplXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWQ7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3ROYW1lcy5wdXNoKG9iak9yTmFtZS5vYmplY3ROYW1lKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIG1hcExpc3QgPSB7fTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdF9pdGVtKSB7XG4gICAgICB2YXIgY29sdW1ucywgbW9iaWxlX2NvbHVtbnMsIG9yZGVyLCByZWxhdGVkLCByZWxhdGVkT2JqZWN0LCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lLCB0YWJ1bGFyX29yZGVyLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgIGlmICghKHJlbGF0ZWRfb2JqZWN0X2l0ZW0gIT0gbnVsbCA/IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWUgOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lO1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleTtcbiAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZF9vYmplY3RfaXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIXJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXTtcbiAgICAgIG1vYmlsZV9jb2x1bW5zID0gXy53aXRob3V0KG1vYmlsZV9jb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgdGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucyk7XG4gICAgICBpZiAoL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpKSB7XG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLCBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgICBtb2JpbGVfY29sdW1uczogbW9iaWxlX2NvbHVtbnMsXG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICBpc19maWxlOiByZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgIH07XG4gICAgICByZWxhdGVkT2JqZWN0ID0gcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKHJlbGF0ZWRPYmplY3QpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY29sdW1ucykge1xuICAgICAgICAgIHJlbGF0ZWQuY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QuY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucykge1xuICAgICAgICAgIHJlbGF0ZWQubW9iaWxlX2NvbHVtbnMgPSByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LnNvcnQpIHtcbiAgICAgICAgICByZWxhdGVkLnNvcnQgPSByZWxhdGVkT2JqZWN0LnNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgcmVsYXRlZC5maWx0ZXJzRnVuY3Rpb24gPSByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCkge1xuICAgICAgICAgIHJlbGF0ZWQuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QgPSByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmxhYmVsKSB7XG4gICAgICAgICAgcmVsYXRlZC5sYWJlbCA9IHJlbGF0ZWRPYmplY3QubGFiZWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QucGFnZV9zaXplKSB7XG4gICAgICAgICAgcmVsYXRlZC5wYWdlX3NpemUgPSByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hcExpc3RbcmVsYXRlZC5vYmplY3RfbmFtZV0gPSByZWxhdGVkO1xuICAgIH0pO1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfLnZhbHVlcyhyZWxhdGVkTGlzdE9iamVjdHMpLCBcIm9iamVjdF9uYW1lXCIpO1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICB1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgXy5lYWNoKHJlbGF0ZWRMaXN0T2JqZWN0cywgZnVuY3Rpb24odiwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZjtcbiAgICAgIGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xO1xuICAgICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNBY3RpdmUgJiYgYWxsb3dSZWFkKSB7XG4gICAgICAgIHJldHVybiBtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsaXN0ID0gW107XG4gICAgaWYgKF8uaXNFbXB0eShyZWxhdGVkTGlzdE5hbWVzKSkge1xuICAgICAgbGlzdCA9IF8udmFsdWVzKG1hcExpc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gocmVsYXRlZExpc3ROYW1lcywgZnVuY3Rpb24ob2JqZWN0TmFtZSkge1xuICAgICAgICBpZiAobWFwTGlzdFtvYmplY3ROYW1lXSkge1xuICAgICAgICAgIHJldHVybiBsaXN0LnB1c2gobWFwTGlzdFtvYmplY3ROYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoX29iamVjdCwgJ2FsbG93X3JlbGF0ZWRMaXN0JykpIHtcbiAgICAgIGxpc3QgPSBfLmZpbHRlcihsaXN0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBfLmluY2x1ZGUoX29iamVjdC5hbGxvd19yZWxhdGVkTGlzdCwgaXRlbS5vYmplY3RfbmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH07XG59XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSk7XG59O1xuXG5cbi8qIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiAqL1xuXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYykge1xuICB2YXIgbGlzdFZpZXdzLCBsaXN0X3ZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgaWYgKCEobGlzdFZpZXdzICE9IG51bGwgPyBsaXN0Vmlld3MubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0X3ZpZXcgPSBfLmZpbmQobGlzdFZpZXdzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0uX2lkID09PSBsaXN0X3ZpZXdfaWQgfHwgaXRlbS5uYW1lID09PSBsaXN0X3ZpZXdfaWQ7XG4gIH0pO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIGlmIChleGFjKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxpc3Rfdmlldztcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIGxpc3RWaWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiBsaXN0X3ZpZXdfaWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cywge1xuICAgICAgX2lkOiBsaXN0X3ZpZXdfaWRcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0VmlldyA9IGxpc3Rfdmlld19pZDtcbiAgfVxuICByZXR1cm4gKGxpc3RWaWV3ICE9IG51bGwgPyBsaXN0Vmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDku45jb2x1bW5z5Y+C5pWw5Lit6L+H5ruk5Ye655So5LqO5omL5py656uv5pi+56S655qEY29sdW1uc1xuXHTop4TliJnvvJpcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxuXHQyLuacgOWkmuWPqui/lOWbnjTkuKrlrZfmrrVcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcbiAqL1xuXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIGNvdW50LCBmaWVsZCwgZmllbGRzLCBnZXRGaWVsZCwgaXNOYW1lQ29sdW1uLCBpdGVtQ291bnQsIG1heENvdW50LCBtYXhSb3dzLCBuYW1lQ29sdW1uLCBuYW1lS2V5LCBvYmplY3QsIHJlc3VsdDtcbiAgcmVzdWx0ID0gW107XG4gIG1heFJvd3MgPSAyO1xuICBtYXhDb3VudCA9IG1heFJvd3MgKiAyO1xuICBjb3VudCA9IDA7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gb2JqZWN0LmZpZWxkcztcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuICBuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICBpc05hbWVDb2x1bW4gPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHJldHVybiBpdGVtLmZpZWxkID09PSBuYW1lS2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXRlbSA9PT0gbmFtZUtleTtcbiAgICB9XG4gIH07XG4gIGdldEZpZWxkID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW0uZmllbGRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW1dO1xuICAgIH1cbiAgfTtcbiAgaWYgKG5hbWVLZXkpIHtcbiAgICBuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKG5hbWVDb2x1bW4pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pO1xuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgcmVzdWx0LnB1c2gobmFtZUNvbHVtbik7XG4gIH1cbiAgY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKGl0ZW0pO1xuICAgIGlmICghZmllbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbUNvdW50ID0gZmllbGQuaXNfd2lkZSA/IDIgOiAxO1xuICAgIGlmIChjb3VudCA8IG1heENvdW50ICYmIHJlc3VsdC5sZW5ndGggPCBtYXhDb3VudCAmJiAhaXNOYW1lQ29sdW1uKGl0ZW0pKSB7XG4gICAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgICBpZiAoY291bnQgPD0gbWF4Q291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0Vmlldywgb2JqZWN0LCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICB9XG4gIGlmIChvYmplY3QgIT0gbnVsbCA/IChyZWYgPSBvYmplY3QubGlzdF92aWV3cykgIT0gbnVsbCA/IHJlZltcImRlZmF1bHRcIl0gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICBkZWZhdWx0VmlldyA9IG9iamVjdC5saXN0X3ZpZXdzW1wiZGVmYXVsdFwiXTtcbiAgfSBlbHNlIHtcbiAgICBfLmVhY2gob2JqZWN0ICE9IG51bGwgPyBvYmplY3QubGlzdF92aWV3cyA6IHZvaWQgMCwgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcbiAgICAgIGlmIChsaXN0X3ZpZXcubmFtZSA9PT0gXCJhbGxcIiB8fCBrZXkgPT09IFwiYWxsXCIpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBkZWZhdWx0Vmlldztcbn07XG5cblxuLypcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucykge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKHVzZV9tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDApIHtcbiAgICAgIGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucztcbiAgICB9IGVsc2UgaWYgKGNvbHVtbnMpIHtcbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbHVtbnM7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo56ys5LiA5Liq6KeG5Zu+5pi+56S655qE5a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyhvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKHVzZV9tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDApIHtcbiAgICAgIGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucztcbiAgICB9IGVsc2UgaWYgKGNvbHVtbnMpIHtcbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbHVtbnM7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5leHRyYV9jb2x1bW5zIDogdm9pZCAwO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBpZiAoZGVmYXVsdFZpZXcpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcuc29ydCkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3LnNvcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc0FsbFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJhbGxcIjtcbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuICovXG5cbkNyZWF0b3IuaXNSZWNlbnRWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSBmdW5jdGlvbihzb3J0LCB0YWJ1bGFyQ29sdW1ucykge1xuICB2YXIgdGFidWxhcl9zb3J0O1xuICB0YWJ1bGFyX3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgY29sdW1uX2luZGV4LCBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBpZiAoaXRlbS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpdGVtLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgaXRlbVsxXV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihmaWVsZF9uYW1lKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIG9yZGVyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFidWxhcl9zb3J0O1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9EWCA9IGZ1bmN0aW9uKHNvcnQpIHtcbiAgdmFyIGR4X3NvcnQ7XG4gIGR4X3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChpdGVtKTtcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICByZXR1cm4gZHhfc29ydC5wdXNoKFtmaWVsZF9uYW1lLCBvcmRlcl0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkeF9zb3J0O1xufTtcbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJylcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5zdGFydHVwICgpLT5cblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cblx0XHRfcmVnRXhNZXNzYWdlcy5wdXNoIHtleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wifVxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXG5cdFx0fSkiLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpO1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVnRXhNZXNzYWdlcztcbiAgICBfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW107XG4gICAgX3JlZ0V4TWVzc2FnZXMucHVzaCh7XG4gICAgICBleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIlxuICAgIH0pO1xuICAgIHJldHVybiBTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuICAgICAgcmVnRXg6IF9yZWdFeE1lc3NhZ2VzXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJ9XG5cdFx0U2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCIvLyDlm6DkuLptZXRlb3LnvJbor5Fjb2ZmZWVzY3JpcHTkvJrlr7zoh7RldmFs5Ye95pWw5oql6ZSZ77yM5omA5Lul5Y2V54us5YaZ5Zyo5LiA5LiqanPmlofku7bkuK3jgIJcbkNyZWF0b3IuZXZhbEluQ29udGV4dCA9IGZ1bmN0aW9uKGpzLCBjb250ZXh0KSB7XG4gICAgLy8jIFJldHVybiB0aGUgcmVzdWx0cyBvZiB0aGUgaW4tbGluZSBhbm9ueW1vdXMgZnVuY3Rpb24gd2UgLmNhbGwgd2l0aCB0aGUgcGFzc2VkIGNvbnRleHRcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7IFxuICAgIFx0cmV0dXJuIGV2YWwoanMpOyBcblx0fS5jYWxsKGNvbnRleHQpO1xufVxuXG5cbkNyZWF0b3IuZXZhbCA9IGZ1bmN0aW9uKGpzKXtcblx0dHJ5e1xuXHRcdHJldHVybiBldmFsKGpzKVxuXHR9Y2F0Y2ggKGUpe1xuXHRcdGNvbnNvbGUuZXJyb3IoZSwganMpO1xuXHR9XG59OyIsIlx0Z2V0T3B0aW9uID0gKG9wdGlvbiktPlxuXHRcdGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIilcblx0XHRpZiBmb28ubGVuZ3RoID4gMlxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdLCBjb2xvcjogZm9vWzJdfVxuXHRcdGVsc2UgaWYgZm9vLmxlbmd0aCA+IDFcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1sxXX1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMF19XG5cblx0Y29udmVydEZpZWxkID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCktPlxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiBzcGFjZUlkICYmIGZpZWxkLnR5cGUgPT0gJ3NlbGVjdCdcblx0XHRcdGNvZGUgPSBmaWVsZC5waWNrbGlzdCB8fCBcIiN7b2JqZWN0X25hbWV9LiN7ZmllbGRfbmFtZX1cIjtcblx0XHRcdGlmIGNvZGVcblx0XHRcdFx0cGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuXHRcdFx0XHRpZiBwaWNrbGlzdFxuXHRcdFx0XHRcdG9wdGlvbnMgPSBbXTtcblx0XHRcdFx0XHRhbGxPcHRpb25zID0gW107XG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gQ3JlYXRvci5nZXRQaWNrTGlzdE9wdGlvbnMocGlja2xpc3QpXG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpPy5yZXZlcnNlKCk7XG5cdFx0XHRcdFx0Xy5lYWNoIHBpY2tsaXN0T3B0aW9ucywgKGl0ZW0pLT5cblx0XHRcdFx0XHRcdGxhYmVsID0gaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHRhbGxPcHRpb25zLnB1c2goe2xhYmVsOiBsYWJlbCwgdmFsdWU6IHZhbHVlLCBlbmFibGU6IGl0ZW0uZW5hYmxlLCBjb2xvcjogaXRlbS5jb2xvcn0pXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVuYWJsZVxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLnB1c2goe2xhYmVsOiBsYWJlbCwgdmFsdWU6IHZhbHVlLCBjb2xvcjogaXRlbS5jb2xvcn0pXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmRlZmF1bHRcblx0XHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWVcblx0XHRcdFx0XHRpZiBvcHRpb25zLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBvcHRpb25zXG5cdFx0XHRcdFx0aWYgYWxsT3B0aW9ucy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRmaWVsZC5hbGxPcHRpb25zID0gYWxsT3B0aW9uc1xuXHRcdHJldHVybiBmaWVsZDtcblxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3QgPSAob2JqZWN0LCBzcGFjZUlkKS0+XG5cdFx0aWYgIW9iamVjdFxuXHRcdFx0cmV0dXJuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxuXG5cdFx0XHRpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIpXG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXI/Ll90b2RvXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSB0cmlnZ2VyLnRvZG9cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxuXHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXG5cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXG5cdFx0XHRcdFx0I+WPquaciXVwZGF0ZeaXtu+8jCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyDmiY3mnInlgLxcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph4/vvIzlsKTlhbbmmK9Db2xsZWN0aW9uXG5cdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiXG5cdFx0XHRcdF90b2RvID0gdHJpZ2dlci50b2RvXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcblx0XHRcdFx0XHR0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKVxuXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBrZXkpLT5cblxuXHRcdFx0XHRpZiBmaWVsZC5vbWl0XG5cdFx0XHRcdFx0IyBvbWl05a2X5q615a6M5YWo6ZqQ6JeP5LiN5pi+56S6XG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gdHJ1ZVxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlcXVpcmVkICYmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRcdFx0IyDpgJrnlKjlv4XloavlrZfmrrUgIzI5NTLvvIzlv4XloavlrZfmrrXorr7nva7kuLrpnZ7lj6ror7tcblx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IGZhbHNlXG5cblx0XHRcdFx0c3lzdGVtQmFzZUZpZWxkcyA9IENyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcygpXG5cdFx0XHRcdGlmIHN5c3RlbUJhc2VGaWVsZHMuaW5kZXhPZihrZXkpID4gLTFcblx0XHRcdFx0XHQjIOW8uuWItuWIm+W7uuS6uuWIm+W7uuaXtumXtOetieWtl+auteS4uuWPquivu1xuXHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24/Ll90b2RvXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSBhY3Rpb24/LnRvZG9cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2NvZGV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSlcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGJcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKGZ1bmN0aW9uKCl7I3tfdG9kb19mcm9tX2RifX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3JcblxuXHRcdFx0XHRfdmlzaWJsZSA9IGFjdGlvbj8uX3Zpc2libGVcblx0XHRcdFx0aWYgX3Zpc2libGVcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcoX3Zpc2libGUpXG5cdFx0XHRcdFx0XHRcdF92aXNpYmxlID0gX3Zpc2libGUudHJpbSgpXG5cdFx0XHRcdFx0XHRpZiBTdGVlZG9zLmlzRXhwcmVzc2lvbihfdmlzaWJsZSlcblx0XHRcdFx0XHRcdFx0IyDmlK/mjIHpobXpnaLluIPlsYDkuK3lhpl2aXNpYmxlX29u5Ye95pWw6KGo6L6+5byP77yM6aG16Z2i5biD5bGA5oyJ6ZKu55qE5pi+56S65p2h5Lu25LiN55Sf5pWIICMzMzQwXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi52aXNpYmxlID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF9wZXJtaXNzaW9ucywgcmVjb3JkKSAtPlxuXHRcdFx0XHRcdFx0XHRcdGdsb2JhbERhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBDcmVhdG9yLlVTRVJfQ09OVEVYVCwge25vdzogbmV3IERhdGUoKX0pXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uKF92aXNpYmxlLCByZWNvcmQsIFwiI1wiLCBnbG9iYWxEYXRhKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRhY3Rpb24udmlzaWJsZSA9IENyZWF0b3IuZXZhbChcIigje192aXNpYmxlfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5hY3Rpb25zLCAoYWN0aW9uLCBrZXkpLT5cblx0XHRcdFx0X3RvZG8gPSBhY3Rpb24/LnRvZG9cblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKClcblxuXHRcdFx0XHRfdmlzaWJsZSA9IGFjdGlvbj8udmlzaWJsZVxuXG5cdFx0XHRcdGlmIF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSlcblx0XHRcdFx0XHRhY3Rpb24uX3Zpc2libGUgPSBfdmlzaWJsZS50b1N0cmluZygpXG5cblx0XHRfLmZvckVhY2ggb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBrZXkpLT5cblxuXHRcdFx0ZmllbGQgPSBjb252ZXJ0RmllbGQob2JqZWN0Lm5hbWUsIGtleSwgZmllbGQsIHNwYWNlSWQpO1xuXG5cdFx0XHRpZiBmaWVsZC5vcHRpb25zICYmIF8uaXNTdHJpbmcoZmllbGQub3B0aW9ucylcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxuXHRcdFx0XHRcdCPmlK/mjIFcXG7miJbogIXoi7HmlofpgJflj7fliIblibIsXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIGZpZWxkLm9wdGlvbnMuc3BsaXQoXCJcXG5cIiksIChvcHRpb24pLT5cblx0XHRcdFx0XHRcdGlmIG9wdGlvbi5pbmRleE9mKFwiLFwiKVxuXHRcdFx0XHRcdFx0XHRvcHRpb25zID0gb3B0aW9uLnNwbGl0KFwiLFwiKVxuXHRcdFx0XHRcdFx0XHRfLmZvckVhY2ggb3B0aW9ucywgKF9vcHRpb24pLT5cblx0XHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSlcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvclxuXG5cdFx0XHRlbHNlIGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0XHQj5pSv5oyB5pWw57uE5Lit55u05o6l5a6a5LmJ5q+P5Liq6YCJ6aG555qE566A54mI5qC85byP5a2X56ym5LiyXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIGZpZWxkLm9wdGlvbnMsIChvcHRpb24pLT5cblx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcob3B0aW9uKVxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKG9wdGlvbilcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvclxuXG5cdFx0XHRlbHNlIGlmIGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucylcblx0XHRcdFx0X29wdGlvbnMgPSBbXVxuXHRcdFx0XHRfLmVhY2ggZmllbGQub3B0aW9ucywgKHYsIGspLT5cblx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoIHtsYWJlbDogdiwgdmFsdWU6IGt9XG5cdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRcdFx0aWYgb3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucylcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnMudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRvcHRpb25zID0gZmllbGQuX29wdGlvbnNcblx0XHRcdFx0aWYgb3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gQ3JlYXRvci5ldmFsKFwiKCN7b3B0aW9uc30pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQucmVnRXhcblx0XHRcdFx0aWYgcmVnRXhcblx0XHRcdFx0XHRmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlZ0V4ID0gZmllbGQuX3JlZ0V4XG5cdFx0XHRcdGlmIHJlZ0V4XG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5yZWdFeCA9IENyZWF0b3IuZXZhbChcIigje3JlZ0V4fSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0bWluID0gZmllbGQubWluXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtaW4pXG5cdFx0XHRcdFx0ZmllbGQuX21pbiA9IG1pbi50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG1pbiA9IGZpZWxkLl9taW5cblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtaW4pXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5taW4gPSBDcmVhdG9yLmV2YWwoXCIoI3ttaW59KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRtYXggPSBmaWVsZC5tYXhcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKG1heClcblx0XHRcdFx0XHRmaWVsZC5fbWF4ID0gbWF4LnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0bWF4ID0gZmllbGQuX21heFxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKG1heClcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLm1heCA9IENyZWF0b3IuZXZhbChcIigje21heH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS50eXBlXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc0Z1bmN0aW9uKF90eXBlKSAmJiBfdHlwZSAhPSBPYmplY3QgJiYgX3R5cGUgIT0gU3RyaW5nICYmIF90eXBlICE9IE51bWJlciAmJiBfdHlwZSAhPSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpXG5cdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgZmllbGQuYXV0b2Zvcm1cblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlXG5cdFx0XHRcdFx0aWYgX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSlcblx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3R5cGV9KVwiKVxuXHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb25cblxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2NyZWF0ZUZ1bmN0aW9uID0gY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKVxuXHRcdFx0XHRpZiBiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGJlZm9yZU9wZW5GdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKClcblxuXHRcdFx0XHRpZiBmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uID0gZmlsdGVyc0Z1bmN0aW9uLnRvU3RyaW5nKClcblx0XHRcdGVsc2VcblxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvXG5cdFx0XHRcdGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuX2NyZWF0ZUZ1bmN0aW9uXG5cdFx0XHRcdGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiB8fCBmaWVsZC5maWx0ZXJzRnVuY3Rpb25cblxuXHRcdFx0XHRpZiBvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9uc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7b3B0aW9uc0Z1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0ZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvci5ldmFsKFwiKCN7cmVmZXJlbmNlX3RvfSlcIilcblxuXHRcdFx0XHRpZiBjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7Y3JlYXRlRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tiZWZvcmVPcGVuRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXJzRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cdFx0XHRcdGlmIGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRcdGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlXG5cblx0XHRcdFx0aWYgIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXG5cdFx0XHRcdGlmIGRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2RlZmF1bHRWYWx1ZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3Jcblx0XHRcdFxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRpZiBpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZClcblx0XHRcdFx0XHRmaWVsZC5faXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRpZiBpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc1N0cmluZyhpc19jb21wYW55X2xpbWl0ZWQpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yLmV2YWwoXCIoI3tpc19jb21wYW55X2xpbWl0ZWR9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRfLmZvckVhY2ggb2JqZWN0Lmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcsIGtleSkgLT5cblx0XHRcdCMjI1xuXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXG5cdFx0XHTorqnov4fomZHlmajmlK/mjIHkuKTnp41mdW5jdGlvbuaWueW8j++8mlxuXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuXHRcdFx05aaC77yaXG5cdFx0XHRmaWx0ZXJzOiAoKS0+XG5cdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG5cdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cblx0XHRcdOWmgu+8mlxuXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG5cdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcblx0XHRcdF1dXG5cdFx0XHTmiJZcblx0XHRcdGZpbHRlcnM6IFt7XG5cdFx0XHRcdFwiZmllbGRcIjogXCJvYmplY3RfbmFtZVwiXG5cdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG5cdFx0XHRcdFwidmFsdWVcIjogKCktPlxuXHRcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcblx0XHRcdH1dXG5cdFx0XHQjIyNcblx0XHRcdGlmIF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycylcblx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0bGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZSBpZiBfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycylcblx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0bGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tsaXN0X3ZpZXcuX2ZpbHRlcnN9KVwiKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRfLmZvckVhY2ggbGlzdF92aWV3LmZpbHRlcnMsIChmaWx0ZXIsIF9pbmRleCktPlxuXHRcdFx0XHRcdGlmIF8uaXNBcnJheShmaWx0ZXIpXG5cdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLmxlbmd0aCA9PSAzIGFuZCBfLmlzRGF0ZShmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzmmK9EYXRl57G75Z6L77yM5YiZZmlsdGVyWzJd5YC85Yiw5YmN56uv5Lya6Ieq5Yqo6L2s5oiQ5a2X56ym5Liy77yM5qC85byP77yaXCIyMDE4LTAzLTI5VDAzOjQzOjIxLjc4N1pcIlxuXHRcdFx0XHRcdFx0XHRcdCMg5YyF5ousZ3JpZOWIl+ihqOivt+axgueahOaOpeWPo+WcqOWGheeahOaJgOaciU9EYXRh5o6l5Y+j77yMRGF0Zeexu+Wei+Wtl+autemDveS8muS7peS4iui/sOagvOW8j+i/lOWbnlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiREFURVwiXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJGVU5DVElPTlwiXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyWzJdfSlcIilcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkRBVEVcIlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIucG9wKClcblx0XHRcdFx0XHRlbHNlIGlmIF8uaXNPYmplY3QoZmlsdGVyKVxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNEYXRlKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl9pc19kYXRlID0gdHJ1ZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5faXNfZGF0ZSA9PSB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gbmV3IERhdGUoZmlsdGVyLnZhbHVlKVxuXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRpZiBvYmplY3QuZm9ybSAmJiAhXy5pc1N0cmluZyhvYmplY3QuZm9ybSlcblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XG5cdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdHJldHVybiB2YWwgKyAnJztcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdGVsc2UgaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRpZiBvYmplY3QuZm9ybVxuXHRcdFx0XHRvYmplY3QuZm9ybSA9IEpTT04ucGFyc2Ugb2JqZWN0LmZvcm0sIChrZXksIHZhbCktPlxuXHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKVxuXHRcdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkX2xpc3RzLCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbClcblx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXG5cdFx0XHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpbHRlcnNfY29kZVwiLCB2YWxcblx0XHRlbHNlXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LnJlbGF0ZWRfbGlzdHMsIChyZWxhdGVkT2JqSW5mbyktPlxuXHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKVxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKVxuXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LnJlbGF0ZWRMaXN0LCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbClcblx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3IuZXZhbChcIigje3ZhbH0pXCIpXG5cdFx0XHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpbHRlcnNfY29kZVwiLCB2YWxcblx0XHRlbHNlXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LnJlbGF0ZWRMaXN0LCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKVxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKClcblxuXHRcdHJldHVybiBvYmplY3RcblxuXG4iLCJ2YXIgY29udmVydEZpZWxkLCBnZXRPcHRpb247XG5cbmdldE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICB2YXIgZm9vO1xuICBmb28gPSBvcHRpb24uc3BsaXQoXCI6XCIpO1xuICBpZiAoZm9vLmxlbmd0aCA+IDIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV0sXG4gICAgICBjb2xvcjogZm9vWzJdXG4gICAgfTtcbiAgfSBlbHNlIGlmIChmb28ubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1sxXVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzBdXG4gICAgfTtcbiAgfVxufTtcblxuY29udmVydEZpZWxkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkLCBzcGFjZUlkKSB7XG4gIHZhciBhbGxPcHRpb25zLCBjb2RlLCBvcHRpb25zLCBwaWNrbGlzdCwgcGlja2xpc3RPcHRpb25zLCByZWY7XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgc3BhY2VJZCAmJiBmaWVsZC50eXBlID09PSAnc2VsZWN0Jykge1xuICAgIGNvZGUgPSBmaWVsZC5waWNrbGlzdCB8fCAob2JqZWN0X25hbWUgKyBcIi5cIiArIGZpZWxkX25hbWUpO1xuICAgIGlmIChjb2RlKSB7XG4gICAgICBwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XG4gICAgICBpZiAocGlja2xpc3QpIHtcbiAgICAgICAgb3B0aW9ucyA9IFtdO1xuICAgICAgICBhbGxPcHRpb25zID0gW107XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KTtcbiAgICAgICAgcGlja2xpc3RPcHRpb25zID0gKHJlZiA9IF8uc29ydEJ5KHBpY2tsaXN0T3B0aW9ucywgJ3NvcnRfbm8nKSkgIT0gbnVsbCA/IHJlZi5yZXZlcnNlKCkgOiB2b2lkIDA7XG4gICAgICAgIF8uZWFjaChwaWNrbGlzdE9wdGlvbnMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICB2YXIgbGFiZWwsIHZhbHVlO1xuICAgICAgICAgIGxhYmVsID0gaXRlbS5uYW1lO1xuICAgICAgICAgIHZhbHVlID0gaXRlbS52YWx1ZSB8fCBpdGVtLm5hbWU7XG4gICAgICAgICAgYWxsT3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGVuYWJsZTogaXRlbS5lbmFibGUsXG4gICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpdGVtLmVuYWJsZSkge1xuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgIGNvbG9yOiBpdGVtLmNvbG9yXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW1bXCJkZWZhdWx0XCJdKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbGxPcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5hbGxPcHRpb25zID0gYWxsT3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmllbGQ7XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRPYmplY3QgPSBmdW5jdGlvbihvYmplY3QsIHNwYWNlSWQpIHtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXy5mb3JFYWNoKG9iamVjdC50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwga2V5KSB7XG4gICAgdmFyIF90b2RvLCBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGI7XG4gICAgaWYgKChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSkge1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gdHJpZ2dlciAhPSBudWxsID8gdHJpZ2dlci5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpIHtcbiAgICAgIF90b2RvID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbykpIHtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGtleSkge1xuICAgICAgdmFyIHN5c3RlbUJhc2VGaWVsZHM7XG4gICAgICBpZiAoZmllbGQub21pdCkge1xuICAgICAgICBmaWVsZC5oaWRkZW4gPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkLnJlcXVpcmVkICYmIGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICAgIGZpZWxkLnJlYWRvbmx5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBzeXN0ZW1CYXNlRmllbGRzID0gQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzKCk7XG4gICAgICBpZiAoc3lzdGVtQmFzZUZpZWxkcy5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kb19mcm9tX2NvZGUsIF90b2RvX2Zyb21fZGIsIF92aXNpYmxlLCBlcnJvcjtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pKSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24oKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3Zpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoXy5pc1N0cmluZyhfdmlzaWJsZSkpIHtcbiAgICAgICAgICAgIF92aXNpYmxlID0gX3Zpc2libGUudHJpbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc0V4cHJlc3Npb24oX3Zpc2libGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfcGVybWlzc2lvbnMsIHJlY29yZCkge1xuICAgICAgICAgICAgICB2YXIgZ2xvYmFsRGF0YTtcbiAgICAgICAgICAgICAgZ2xvYmFsRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIENyZWF0b3IuVVNFUl9DT05URVhULCB7XG4gICAgICAgICAgICAgICAgbm93OiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gU3RlZWRvcy5wYXJzZVNpbmdsZUV4cHJlc3Npb24oX3Zpc2libGUsIHJlY29yZCwgXCIjXCIsIGdsb2JhbERhdGEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdmlzaWJsZSArIFwiKVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvLCBfdmlzaWJsZTtcbiAgICAgIF90b2RvID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnZpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKSkge1xuICAgICAgICByZXR1cm4gYWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGtleSkge1xuICAgIHZhciBfb3B0aW9ucywgX3R5cGUsIGJlZm9yZU9wZW5GdW5jdGlvbiwgY3JlYXRlRnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSwgZXJyb3IsIGZpbHRlcnNGdW5jdGlvbiwgaXNfY29tcGFueV9saW1pdGVkLCBtYXgsIG1pbiwgb3B0aW9ucywgb3B0aW9uc0Z1bmN0aW9uLCByZWZlcmVuY2VfdG8sIHJlZ0V4O1xuICAgIGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcbiAgICBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgaWYgKG9wdGlvbi5pbmRleE9mKFwiLFwiKSkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKF9vcHRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIGlmIChfLmlzU3RyaW5nKG9wdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1pbiA9IGZpZWxkLm1pbjtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWluKSkge1xuICAgICAgICBmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pbiA9IGZpZWxkLl9taW47XG4gICAgICBpZiAoXy5pc1N0cmluZyhtaW4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWluID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtaW4gKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtYXggPSBmaWVsZC5tYXg7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1heCkpIHtcbiAgICAgICAgZmllbGQuX21heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXggPSBmaWVsZC5fbWF4O1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWF4KSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1heCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWF4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT09IE9iamVjdCAmJiBfdHlwZSAhPT0gU3RyaW5nICYmIF90eXBlICE9PSBOdW1iZXIgJiYgX3R5cGUgIT09IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSkpIHtcbiAgICAgICAgICBmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdHlwZSArIFwiKVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9uc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWZlcmVuY2VfdG8gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGNyZWF0ZUZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBiZWZvcmVPcGVuRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlcnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZGVmYXVsdFZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICByZXR1cm4gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBpc19jb21wYW55X2xpbWl0ZWQgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBfLmZvckVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG5cbiAgICAvKlxuICAgIFx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuICAgIFx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG4gICAgXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6ICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG4gICAgXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0XV1cbiAgICBcdFx0XHTmiJZcbiAgICBcdFx0XHRmaWx0ZXJzOiBbe1xuICAgIFx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcbiAgICBcdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG4gICAgXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cbiAgICBcdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdH1dXG4gICAgICovXG4gICAgaWYgKF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBsaXN0X3ZpZXcuX2ZpbHRlcnMgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfLmZvckVhY2gobGlzdF92aWV3LmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNEYXRlKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiREFURVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkZVTkNUSU9OXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJbMl0gKyBcIilcIik7XG4gICAgICAgICAgICAgIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiREFURVwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNEYXRlKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl9pc19kYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuX2lzX2RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKG9iamVjdC5mb3JtICYmICFfLmlzU3RyaW5nKG9iamVjdC5mb3JtKSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbCArICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0pIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZF9saXN0cywgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImZpbHRlcnNfY29kZVwiLCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkX2xpc3RzLCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJmaWx0ZXJzX2NvZGVcIiwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fVxuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiXG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gKHByZWZpeCxmaWVsZFZhcmlhYmxlKS0+XG5cdHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuXG5cdHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZSByZWcsIChtLCAkMSktPlxuXHRcdHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLyxcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZyxcIlxcXCJdW1xcXCJcIik7XG5cblx0cmV0dXJuIHJldlxuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IChmb3JtdWxhX3N0ciktPlxuXHRpZiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTFcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSAoZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKS0+XG5cdGlmIGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpXG5cblx0XHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucz8uZXh0ZW5kKVxuXHRcdFx0ZXh0ZW5kID0gdHJ1ZVxuXG5cdFx0X1ZBTFVFUyA9IHt9XG5cdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKVxuXHRcdGlmIGV4dGVuZFxuXHRcdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucz8udXNlcklkLCBvcHRpb25zPy5zcGFjZUlkKSlcblx0XHRmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cilcblxuXHRcdHRyeVxuXHRcdFx0ZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUykgICAjIOatpOWkhOS4jeiDveeUqHdpbmRvdy5ldmFsIO+8jOS8muWvvOiHtOWPmOmHj+S9nOeUqOWfn+W8guW4uFxuXHRcdFx0cmV0dXJuIGRhdGFcblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9XCIsIGUpXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dG9hc3RyPy5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9I3tlfVwiXG5cblx0cmV0dXJuIGZvcm11bGFfc3RyXG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge307XG5cbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCI7XG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gZnVuY3Rpb24ocHJlZml4LCBmaWVsZFZhcmlhYmxlKSB7XG4gIHZhciByZWcsIHJldjtcbiAgcmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XG4gIHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG0sICQxKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLCBcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLCBcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csIFwiXFxcIl1bXFxcIlwiKTtcbiAgfSk7XG4gIHJldHVybiByZXY7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyKSB7XG4gIGlmIChfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucykge1xuICB2YXIgX1ZBTFVFUywgZGF0YSwgZSwgZXh0ZW5kO1xuICBpZiAoZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuZXh0ZW5kIDogdm9pZCAwKSkge1xuICAgICAgZXh0ZW5kID0gdHJ1ZTtcbiAgICB9XG4gICAgX1ZBTFVFUyA9IHt9O1xuICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVCk7XG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy51c2VySWQgOiB2b2lkIDAsIG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgIH1cbiAgICBmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cik7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciwgZSk7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG9hc3RyICE9PSBcInVuZGVmaW5lZFwiICYmIHRvYXN0ciAhPT0gbnVsbCkge1xuICAgICAgICAgIHRvYXN0ci5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIgKyBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFfc3RyO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9ICAgIyDmraTlr7nosaHlj6rog73lnKjnoa7kv53miYDmnIlPYmplY3TliJ3lp4vljJblrozmiJDlkI7osIPnlKjvvIwg5ZCm5YiZ6I635Y+W5Yiw55qEb2JqZWN05LiN5YWoXG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IChvYmplY3RfbmFtZSktPlxuXHRpZiBvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJylcblx0XHRvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpXG5cdHJldHVybiBvYmplY3RfbmFtZVxuXG5DcmVhdG9yLk9iamVjdCA9IChvcHRpb25zKS0+XG5cdF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdF9iYXNlT2JqZWN0ID0ge2FjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zICwgZmllbGRzOiB7fSwgdHJpZ2dlcnM6IHt9LCBwZXJtaXNzaW9uX3NldDoge319XG5cdHNlbGYgPSB0aGlzXG5cdGlmICghb3B0aW9ucy5uYW1lKVxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcblxuXHRzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZVxuXHRzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXHRzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWVcblx0c2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWxcblx0c2VsZi5pY29uID0gb3B0aW9ucy5pY29uXG5cdHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uXG5cdHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlld1xuXHRzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm1cblx0c2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Rcblx0c2VsZi5yZWxhdGVkX2xpc3RzID0gb3B0aW9ucy5yZWxhdGVkX2xpc3RzXG5cdHNlbGYuaGFzSW1wb3J0VGVtcGxhdGVzID0gb3B0aW9ucy5oYXNJbXBvcnRUZW1wbGF0ZXNcblx0c2VsZi52ZXJzaW9uID0gb3B0aW9ucy52ZXJzaW9uIHx8IDEuMFxuXHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpICB8fCBvcHRpb25zLmlzX2VuYWJsZSA9PSB0cnVlXG5cdFx0c2VsZi5pc19lbmFibGUgPSB0cnVlXG5cdGVsc2Vcblx0XHRzZWxmLmlzX2VuYWJsZSA9IGZhbHNlXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIF8uaGFzKG9wdGlvbnMsICdhbGxvd19jdXN0b21BY3Rpb25zJylcblx0XHRcdHNlbGYuYWxsb3dfY3VzdG9tQWN0aW9ucyA9IG9wdGlvbnMuYWxsb3dfY3VzdG9tQWN0aW9uc1xuXHRcdGlmIF8uaGFzKG9wdGlvbnMsICdleGNsdWRlX2FjdGlvbnMnKVxuXHRcdFx0c2VsZi5leGNsdWRlX2FjdGlvbnMgPSBvcHRpb25zLmV4Y2x1ZGVfYWN0aW9uc1xuXHRcdGlmIF8uaGFzKG9wdGlvbnMsICdhbGxvd19yZWxhdGVkTGlzdCcpXG5cdFx0XHRzZWxmLmFsbG93X3JlbGF0ZWRMaXN0ID0gb3B0aW9ucy5hbGxvd19yZWxhdGVkTGlzdFxuXHRzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2hcblx0c2VsZi5lbmFibGVfZmlsZXMgPSBvcHRpb25zLmVuYWJsZV9maWxlc1xuXHRzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzXG5cdHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXNcblx0c2VsZi5lbmFibGVfYXVkaXQgPSBvcHRpb25zLmVuYWJsZV9hdWRpdFxuXHRzZWxmLmVuYWJsZV9ldmVudHMgPSBvcHRpb25zLmVuYWJsZV9ldmVudHNcblx0aWYgb3B0aW9ucy5wYWdpbmdcblx0XHRzZWxmLnBhZ2luZyA9IG9wdGlvbnMucGFnaW5nXG5cdHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW5cblx0c2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PSB1bmRlZmluZWQpIG9yIG9wdGlvbnMuZW5hYmxlX2FwaVxuXHRzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tXG5cdHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmVcblx0c2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzXG5cdHNlbGYuZW5hYmxlX3Byb2Nlc3MgPSBvcHRpb25zLmVuYWJsZV9wcm9jZXNzXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKVxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcblx0XHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxuXHRlbHNlXG5cdFx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXG5cdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcblx0c2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3dcblx0c2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnlcblx0c2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcilcblx0c2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXJcblx0c2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaFxuXHRzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWxcblx0c2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzXG5cdHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvd1xuXHRzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93XG5cdHNlbGYuZW5hYmxlX2lubGluZV9lZGl0ID0gb3B0aW9ucy5lbmFibGVfaW5saW5lX2VkaXRcblx0c2VsZi5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzXG5cdHNlbGYubWFzdGVycyA9IG9wdGlvbnMubWFzdGVyc1xuXHRzZWxmLmxvb2t1cF9kZXRhaWxzID0gb3B0aW9ucy5sb29rdXBfZGV0YWlsc1xuXHRpZiBfLmhhcyhvcHRpb25zLCAnaW5fZGV2ZWxvcG1lbnQnKVxuXHRcdHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50XG5cdHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJ1xuXHRpZiBvcHRpb25zLmRhdGFiYXNlX25hbWVcblx0XHRzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWVcblx0aWYgKCFvcHRpb25zLmZpZWxkcylcblx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBmaWVsZHMnKTtcblxuXHRzZWxmLmZpZWxkcyA9IGNsb25lKG9wdGlvbnMuZmllbGRzKVxuXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgZmllbGQuaXNfbmFtZVxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcblx0XHRlbHNlIGlmIGZpZWxkX25hbWUgPT0gJ25hbWUnICYmICFzZWxmLk5BTUVfRklFTERfS0VZXG5cdFx0XHRzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZVxuXHRcdGlmIGZpZWxkLnByaW1hcnlcblx0XHRcdHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcblx0XHRcdFx0aWYgZmllbGRfbmFtZSA9PSAnc3BhY2UnXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcblx0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSBmYWxzZVxuXG5cdGlmICFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXG5cdFx0Xy5lYWNoIF9iYXNlT2JqZWN0LmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0XHRpZiAhc2VsZi5maWVsZHNbZmllbGRfbmFtZV1cblx0XHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fVxuXHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pXG5cblx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdmb3JtdWxhJ1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdzdW1tYXJ5J1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cblx0c2VsZi5saXN0X3ZpZXdzID0ge31cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KHNlbGYubmFtZSlcblx0Xy5lYWNoIG9wdGlvbnMubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdG9pdGVtID0gQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcoZGVmYXVsdFZpZXcsIGl0ZW0sIGl0ZW1fbmFtZSlcblx0XHRzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtXG5cblx0c2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QudHJpZ2dlcnMpXG5cdF8uZWFjaCBvcHRpb25zLnRyaWdnZXJzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZVxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSlcblxuXHRzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpXG5cdF8uZWFjaCBvcHRpb25zLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiAhc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge31cblx0XHRjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pXG5cdFx0ZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdICPlhYjliKDpmaTnm7jlhbPlsZ7mgKflho3ph43lu7rmiY3og73kv53or4HlkI7nu63ph43lpI3lrprkuYnnmoTlsZ7mgKfpobrluo/nlJ/mlYhcblx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKVxuXHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdLm9iamVjdF9uYW1lID0gc2VsZi5uYW1lXG5cblx0Xy5lYWNoIHNlbGYuYWN0aW9ucywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZVxuXG5cdHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpXG5cblx0IyDorqnmiYDmnIlvYmplY3Tpu5jorqTmnInmiYDmnIlsaXN0X3ZpZXdzL2FjdGlvbnMvcmVsYXRlZF9vYmplY3RzL3JlYWRhYmxlX2ZpZWxkcy9lZGl0YWJsZV9maWVsZHPlrozmlbTmnYPpmZDvvIzor6XmnYPpmZDlj6/og73ooqvmlbDmja7lupPkuK3orr7nva7nmoRhZG1pbi91c2Vy5p2D6ZmQ6KaG55uWXG5cdHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KVxuXHQjIGRlZmF1bHRMaXN0Vmlld3MgPSBfLmtleXMoc2VsZi5saXN0X3ZpZXdzKVxuXHQjIGRlZmF1bHRBY3Rpb25zID0gXy5rZXlzKHNlbGYuYWN0aW9ucylcblx0IyBkZWZhdWx0UmVsYXRlZE9iamVjdHMgPSBfLnBsdWNrKHNlbGYucmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblx0IyBkZWZhdWx0UmVhZGFibGVGaWVsZHMgPSBbXVxuXHQjIGRlZmF1bHRFZGl0YWJsZUZpZWxkcyA9IFtdXG5cdCMgXy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0IyBcdGlmICEoZmllbGQuaGlkZGVuKSAgICAjMjMxIG9taXTlrZfmrrXmlK/mjIHlnKjpnZ7nvJbovpHpobXpnaLmn6XnnIssIOWboOatpOWIoOmZpOS6huatpOWkhOWvuW9taXTnmoTliKTmlq1cblx0IyBcdFx0ZGVmYXVsdFJlYWRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxuXHQjIFx0XHRpZiAhZmllbGQucmVhZG9ubHlcblx0IyBcdFx0XHRkZWZhdWx0RWRpdGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXG5cblx0IyBfLmVhY2ggc2VsZi5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHQjIFx0aWYgaXRlbV9uYW1lID09IFwibm9uZVwiXG5cdCMgXHRcdHJldHVyblxuXHQjIFx0aWYgc2VsZi5saXN0X3ZpZXdzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5saXN0X3ZpZXdzID0gZGVmYXVsdExpc3RWaWV3c1xuXHQjIFx0aWYgc2VsZi5hY3Rpb25zXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5hY3Rpb25zID0gZGVmYXVsdEFjdGlvbnNcblx0IyBcdGlmIHNlbGYucmVsYXRlZF9vYmplY3RzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWxhdGVkX29iamVjdHMgPSBkZWZhdWx0UmVsYXRlZE9iamVjdHNcblx0IyBcdGlmIHNlbGYuZmllbGRzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWFkYWJsZV9maWVsZHMgPSBkZWZhdWx0UmVhZGFibGVGaWVsZHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmVkaXRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRFZGl0YWJsZUZpZWxkc1xuXHR1bmxlc3Mgb3B0aW9ucy5wZXJtaXNzaW9uX3NldFxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fVxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LmFkbWluKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSlcblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py51c2VyKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pXG5cdF8uZWFjaCBvcHRpb25zLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pXG5cblx0IyDliY3nq6/moLnmja5wZXJtaXNzaW9uc+aUueWGmWZpZWxk55u45YWz5bGe5oCn77yM5ZCO56uv5Y+q6KaB6LWw6buY6K6k5bGe5oCn5bCx6KGM77yM5LiN6ZyA6KaB5pS55YaZXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9uc1xuXHRcdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucz8uZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdGlmIGRpc2FibGVkX2xpc3Rfdmlld3M/Lmxlbmd0aFxuXHRcdFx0ZGVmYXVsdExpc3RWaWV3SWQgPSBvcHRpb25zLmxpc3Rfdmlld3M/LmFsbD8uX2lkXG5cdFx0XHRpZiBkZWZhdWx0TGlzdFZpZXdJZFxuXHRcdFx0XHQjIOaKiuinhuWbvuadg+mZkOmFjee9ruS4rem7mOiupOeahGFsbOinhuWbvmlk6L2s5o2i5oiQYWxs5YWz6ZSu5a2XXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcCBkaXNhYmxlZF9saXN0X3ZpZXdzLCAobGlzdF92aWV3X2l0ZW0pIC0+XG5cdFx0XHRcdFx0cmV0dXJuIGlmIGRlZmF1bHRMaXN0Vmlld0lkID09IGxpc3Rfdmlld19pdGVtIHRoZW4gXCJhbGxcIiBlbHNlIGxpc3Rfdmlld19pdGVtXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucylcbiNcdFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cbiNcdFx0XHRpZiBmaWVsZFxuI1x0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bnJlYWRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPCAwXG4jXHRcdFx0XHRcdGlmIGZpZWxkLmhpZGRlblxuI1x0XHRcdFx0XHRcdHJldHVyblxuI1x0XHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVuZWRpdGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA+IC0xXG4jXHRcdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG4jXHRcdFx0XHRcdFx0ZmllbGQuZGlzYWJsZWQgPSB0cnVlXG4jXHRcdFx0XHRcdFx0IyDlvZPlj6ror7vml7bvvIzlpoLmnpzkuI3ljrvmjonlv4XloavlrZfmrrXvvIxhdXRvZm9ybeaYr+S8muaKpemUmeeahFxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlcXVpcmVkID0gZmFsc2VcbiNcdFx0XHRcdGVsc2VcbiNcdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG51bGxcblxuXHRfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucylcblxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGJcblxuXHRzZWxmLmRiID0gX2RiXG5cblx0c2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lXG5cblx0c2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZilcblx0c2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSlcblx0aWYgc2VsZi5uYW1lICE9IFwidXNlcnNcIiBhbmQgc2VsZi5uYW1lICE9IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCIsIFwiYWN0aW9uX2ZpZWxkX3VwZGF0ZXNcIiwgXCJvYmplY3RfbGlzdHZpZXdzXCJdLCBzZWxmLm5hbWUpXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdFx0ZWxzZVxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXHRpZiBzZWxmLm5hbWUgPT0gXCJ1c2Vyc1wiXG5cdFx0X2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYVxuXG5cdGlmIF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSlcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblxuXHRDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGZcblxuXHRyZXR1cm4gc2VsZlxuXG4jIENyZWF0b3IuT2JqZWN0LnByb3RvdHlwZS5pMThuID0gKCktPlxuIyBcdCMgc2V0IG9iamVjdCBsYWJlbFxuIyBcdHNlbGYgPSB0aGlzXG5cbiMgXHRrZXkgPSBzZWxmLm5hbWVcbiMgXHRpZiB0KGtleSkgPT0ga2V5XG4jIFx0XHRpZiAhc2VsZi5sYWJlbFxuIyBcdFx0XHRzZWxmLmxhYmVsID0gc2VsZi5uYW1lXG4jIFx0ZWxzZVxuIyBcdFx0c2VsZi5sYWJlbCA9IHQoa2V5KVxuXG4jIFx0IyBzZXQgZmllbGQgbGFiZWxzXG4jIFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cbiMgXHRcdGZrZXkgPSBzZWxmLm5hbWUgKyBcIl9cIiArIGZpZWxkX25hbWVcbiMgXHRcdGlmIHQoZmtleSkgPT0gZmtleVxuIyBcdFx0XHRpZiAhZmllbGQubGFiZWxcbiMgXHRcdFx0XHRmaWVsZC5sYWJlbCA9IGZpZWxkX25hbWVcbiMgXHRcdGVsc2VcbiMgXHRcdFx0ZmllbGQubGFiZWwgPSB0KGZrZXkpXG4jIFx0XHRzZWxmLnNjaGVtYT8uX3NjaGVtYT9bZmllbGRfbmFtZV0/LmxhYmVsID0gZmllbGQubGFiZWxcblxuXG4jIFx0IyBzZXQgbGlzdHZpZXcgbGFiZWxzXG4jIFx0Xy5lYWNoIHNlbGYubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuIyBcdFx0aTE4bl9rZXkgPSBzZWxmLm5hbWUgKyBcIl9saXN0dmlld19cIiArIGl0ZW1fbmFtZVxuIyBcdFx0aWYgdChpMThuX2tleSkgPT0gaTE4bl9rZXlcbiMgXHRcdFx0aWYgIWl0ZW0ubGFiZWxcbiMgXHRcdFx0XHRpdGVtLmxhYmVsID0gaXRlbV9uYW1lXG4jIFx0XHRlbHNlXG4jIFx0XHRcdGl0ZW0ubGFiZWwgPSB0KGkxOG5fa2V5KVxuXG5cbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSAob2JqZWN0KS0+XG5cdHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIlxuXHQjIGlmIG9iamVjdFxuXHQjIFx0aWYgIW9iamVjdC5kYXRhYmFzZV9uYW1lIHx8IG9iamVjdC5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXG5cdCMgXHRcdHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIlxuXHQjIFx0ZWxzZVxuXHQjIFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhLyN7b2JqZWN0LmRhdGFiYXNlX25hbWV9XCJcblxuIyBpZiBNZXRlb3IuaXNDbGllbnRcblxuIyBcdE1ldGVvci5zdGFydHVwIC0+XG4jIFx0XHRUcmFja2VyLmF1dG9ydW4gLT5cbiMgXHRcdFx0aWYgU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAmJiBDcmVhdG9yLmJvb3RzdHJhcExvYWRlZD8uZ2V0KClcbiMgXHRcdFx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxuIyBcdFx0XHRcdFx0b2JqZWN0LmkxOG4oKVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRpZiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKG9iamVjdCktPlxuXHRcdFx0bmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdClcblxuIiwidmFyIGNsb25lO1xuXG5jbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5cbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9O1xuXG5DcmVhdG9yLmZvcm1hdE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBpZiAob2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwuJywgJ2cnKSwgJ18nKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0X25hbWU7XG59O1xuXG5DcmVhdG9yLk9iamVjdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIF9iYXNlT2JqZWN0LCBfZGIsIGRlZmF1bHRMaXN0Vmlld0lkLCBkZWZhdWx0VmlldywgZGlzYWJsZWRfbGlzdF92aWV3cywgcGVybWlzc2lvbnMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2NoZW1hLCBzZWxmO1xuICBfYmFzZU9iamVjdCA9IENyZWF0b3IuYmFzZU9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF9iYXNlT2JqZWN0ID0ge1xuICAgICAgYWN0aW9uczogQ3JlYXRvci5iYXNlT2JqZWN0LmFjdGlvbnMsXG4gICAgICBmaWVsZHM6IHt9LFxuICAgICAgdHJpZ2dlcnM6IHt9LFxuICAgICAgcGVybWlzc2lvbl9zZXQ6IHt9XG4gICAgfTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgaWYgKCFvcHRpb25zLm5hbWUpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuICB9XG4gIHNlbGYuX2lkID0gb3B0aW9ucy5faWQgfHwgb3B0aW9ucy5uYW1lO1xuICBzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgc2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICBzZWxmLmxhYmVsID0gb3B0aW9ucy5sYWJlbDtcbiAgc2VsZi5pY29uID0gb3B0aW9ucy5pY29uO1xuICBzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvbjtcbiAgc2VsZi5pc192aWV3ID0gb3B0aW9ucy5pc192aWV3O1xuICBzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm07XG4gIHNlbGYucmVsYXRlZExpc3QgPSBvcHRpb25zLnJlbGF0ZWRMaXN0O1xuICBzZWxmLnJlbGF0ZWRfbGlzdHMgPSBvcHRpb25zLnJlbGF0ZWRfbGlzdHM7XG4gIHNlbGYuaGFzSW1wb3J0VGVtcGxhdGVzID0gb3B0aW9ucy5oYXNJbXBvcnRUZW1wbGF0ZXM7XG4gIHNlbGYudmVyc2lvbiA9IG9wdGlvbnMudmVyc2lvbiB8fCAxLjA7XG4gIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09PSB0cnVlKSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gZmFsc2U7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpKSB7XG4gICAgICBzZWxmLmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvcHRpb25zLmFsbG93X2N1c3RvbUFjdGlvbnM7XG4gICAgfVxuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnZXhjbHVkZV9hY3Rpb25zJykpIHtcbiAgICAgIHNlbGYuZXhjbHVkZV9hY3Rpb25zID0gb3B0aW9ucy5leGNsdWRlX2FjdGlvbnM7XG4gICAgfVxuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKSkge1xuICAgICAgc2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3Q7XG4gICAgfVxuICB9XG4gIHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaDtcbiAgc2VsZi5lbmFibGVfZmlsZXMgPSBvcHRpb25zLmVuYWJsZV9maWxlcztcbiAgc2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrcztcbiAgc2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3RlcztcbiAgc2VsZi5lbmFibGVfYXVkaXQgPSBvcHRpb25zLmVuYWJsZV9hdWRpdDtcbiAgc2VsZi5lbmFibGVfZXZlbnRzID0gb3B0aW9ucy5lbmFibGVfZXZlbnRzO1xuICBpZiAob3B0aW9ucy5wYWdpbmcpIHtcbiAgICBzZWxmLnBhZ2luZyA9IG9wdGlvbnMucGFnaW5nO1xuICB9XG4gIHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW47XG4gIHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT09IHZvaWQgMCkgfHwgb3B0aW9ucy5lbmFibGVfYXBpO1xuICBzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tO1xuICBzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlO1xuICBzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXM7XG4gIHNlbGYuZW5hYmxlX3Byb2Nlc3MgPSBvcHRpb25zLmVuYWJsZV9wcm9jZXNzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSkge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICB9XG4gIHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93O1xuICBzZWxmLmZpbHRlcl9jb21wYW55ID0gb3B0aW9ucy5maWx0ZXJfY29tcGFueTtcbiAgc2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcik7XG4gIHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyO1xuICBzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoO1xuICBzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWw7XG4gIHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFscztcbiAgc2VsZi5lbmFibGVfZm9sbG93ID0gb3B0aW9ucy5lbmFibGVfZm9sbG93O1xuICBzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93O1xuICBzZWxmLmVuYWJsZV9pbmxpbmVfZWRpdCA9IG9wdGlvbnMuZW5hYmxlX2lubGluZV9lZGl0O1xuICBzZWxmLmRldGFpbHMgPSBvcHRpb25zLmRldGFpbHM7XG4gIHNlbGYubWFzdGVycyA9IG9wdGlvbnMubWFzdGVycztcbiAgc2VsZi5sb29rdXBfZGV0YWlscyA9IG9wdGlvbnMubG9va3VwX2RldGFpbHM7XG4gIGlmIChfLmhhcyhvcHRpb25zLCAnaW5fZGV2ZWxvcG1lbnQnKSkge1xuICAgIHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50O1xuICB9XG4gIHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJztcbiAgaWYgKG9wdGlvbnMuZGF0YWJhc2VfbmFtZSkge1xuICAgIHNlbGYuZGF0YWJhc2VfbmFtZSA9IG9wdGlvbnMuZGF0YWJhc2VfbmFtZTtcbiAgfVxuICBpZiAoIW9wdGlvbnMuZmllbGRzKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IGZpZWxkcycpO1xuICB9XG4gIHNlbGYuZmllbGRzID0gY2xvbmUob3B0aW9ucy5maWVsZHMpO1xuICBfLmVhY2goc2VsZi5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH0gZWxzZSBpZiAoZmllbGRfbmFtZSA9PT0gJ25hbWUnICYmICFzZWxmLk5BTUVfRklFTERfS0VZKSB7XG4gICAgICBzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLnByaW1hcnkpIHtcbiAgICAgIHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpKSB7XG4gICAgICAgIGlmIChmaWVsZF9uYW1lID09PSAnc3BhY2UnKSB7XG4gICAgICAgICAgZmllbGQuZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKCFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09PSAnbWV0ZW9yLW1vbmdvJykge1xuICAgIF8uZWFjaChfYmFzZU9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICBpZiAoIXNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKSB7XG4gICAgICAgIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pO1xuICAgIH0pO1xuICB9XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2Zvcm11bGEnKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHNlbGYubGlzdF92aWV3cyA9IHt9O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcoc2VsZi5uYW1lKTtcbiAgXy5lYWNoKG9wdGlvbnMubGlzdF92aWV3cywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgdmFyIG9pdGVtO1xuICAgIG9pdGVtID0gQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcoZGVmYXVsdFZpZXcsIGl0ZW0sIGl0ZW1fbmFtZSk7XG4gICAgcmV0dXJuIHNlbGYubGlzdF92aWV3c1tpdGVtX25hbWVdID0gb2l0ZW07XG4gIH0pO1xuICBzZWxmLnRyaWdnZXJzID0gXy5jbG9uZShfYmFzZU9iamVjdC50cmlnZ2Vycyk7XG4gIF8uZWFjaChvcHRpb25zLnRyaWdnZXJzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXS5uYW1lID0gaXRlbV9uYW1lO1xuICAgIHJldHVybiBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgc2VsZi5hY3Rpb25zID0gXy5jbG9uZShfYmFzZU9iamVjdC5hY3Rpb25zKTtcbiAgXy5lYWNoKG9wdGlvbnMuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgdmFyIGNvcHlJdGVtO1xuICAgIGlmICghc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIGNvcHlJdGVtID0gXy5jbG9uZShzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSk7XG4gICAgZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdO1xuICAgIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pO1xuICAgIHJldHVybiBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXS5vYmplY3RfbmFtZSA9IHNlbGYubmFtZTtcbiAgfSk7XG4gIF8uZWFjaChzZWxmLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHJldHVybiBpdGVtLm5hbWUgPSBpdGVtX25hbWU7XG4gIH0pO1xuICBzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKTtcbiAgc2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoX2Jhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpO1xuICBpZiAoIW9wdGlvbnMucGVybWlzc2lvbl9zZXQpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge307XG4gIH1cbiAgaWYgKCEoKHJlZiA9IG9wdGlvbnMucGVybWlzc2lvbl9zZXQpICE9IG51bGwgPyByZWYuYWRtaW4gOiB2b2lkIDApKSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKTtcbiAgfVxuICBpZiAoISgocmVmMSA9IG9wdGlvbnMucGVybWlzc2lvbl9zZXQpICE9IG51bGwgPyByZWYxLnVzZXIgOiB2b2lkIDApKSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldC51c2VyID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1widXNlclwiXSk7XG4gIH1cbiAgXy5lYWNoKG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBvcHRpb25zLnBlcm1pc3Npb25zO1xuICAgIGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA6IHZvaWQgMDtcbiAgICBpZiAoZGlzYWJsZWRfbGlzdF92aWV3cyAhPSBudWxsID8gZGlzYWJsZWRfbGlzdF92aWV3cy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgIGRlZmF1bHRMaXN0Vmlld0lkID0gKHJlZjIgPSBvcHRpb25zLmxpc3Rfdmlld3MpICE9IG51bGwgPyAocmVmMyA9IHJlZjIuYWxsKSAhPSBudWxsID8gcmVmMy5faWQgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IF8ubWFwKGRpc2FibGVkX2xpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgaWYgKGRlZmF1bHRMaXN0Vmlld0lkID09PSBsaXN0X3ZpZXdfaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiYWxsXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0X3ZpZXdfaXRlbTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLnBlcm1pc3Npb25zID0gbnVsbDtcbiAgfVxuICBfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucyk7XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYjtcbiAgc2VsZi5kYiA9IF9kYjtcbiAgc2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lO1xuICBzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKTtcbiAgc2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSk7XG4gIGlmIChzZWxmLm5hbWUgIT09IFwidXNlcnNcIiAmJiBzZWxmLm5hbWUgIT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCIsIFwiYWN0aW9uX2ZpZWxkX3VwZGF0ZXNcIiwgXCJvYmplY3RfbGlzdHZpZXdzXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHNlbGYubmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgX2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYTtcbiAgfVxuICBpZiAoXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtzZWxmLl9jb2xsZWN0aW9uX25hbWVdID0gc2VsZjtcbiAgcmV0dXJuIHNlbGY7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIjtcbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBpZiAoIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkICYmIENyZWF0b3IuT2JqZWN0cykge1xuICAgIHJldHVybiBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBuZXcgQ3JlYXRvci5PYmplY3Qob2JqZWN0KTtcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMgPSAoZmllbGRTY2hlbWEpIC0+XG5cdG9wdGlvbnMgPSBmaWVsZFNjaGVtYS5vcHRpb25zXG5cdHVubGVzcyBvcHRpb25zXG5cdFx0cmV0dXJuXG5cdGRhdGFfdHlwZSA9IGZpZWxkU2NoZW1hLmRhdGFfdHlwZVxuXHRpZiAhXy5pc0Z1bmN0aW9uKG9wdGlvbnMpIGFuZCBkYXRhX3R5cGUgYW5kIGRhdGFfdHlwZSAhPSAndGV4dCdcblx0XHQjIOmbtuS7o+eggeeVjOmdoumFjee9rm9wdGlvbnPpgInpobnlgLzlj6rmlK/mjIHlrZfnrKbkuLLvvIzmiYDku6XlvZNkYXRhX3R5cGXkuLrmlbDlgLzmiJZib29sZWFu5pe277yM5Y+q6IO95by66KGM5oqK6YCJ6aG55YC85YWI6L2s5o2i5Li65a+55bqU55qE57G75Z6LXG5cdFx0b3B0aW9ucy5mb3JFYWNoIChvcHRpb25JdGVtKSAtPlxuXHRcdFx0aWYgdHlwZW9mIG9wdGlvbkl0ZW0udmFsdWUgIT0gJ3N0cmluZydcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBbXG5cdFx0XHRcdCdudW1iZXInXG5cdFx0XHRcdCdjdXJyZW5jeSdcblx0XHRcdFx0J3BlcmNlbnQnXG5cdFx0XHRdLmluZGV4T2YoZGF0YV90eXBlKSA+IC0xXG5cdFx0XHRcdG9wdGlvbkl0ZW0udmFsdWUgPSBOdW1iZXIob3B0aW9uSXRlbS52YWx1ZSlcblx0XHRcdGVsc2UgaWYgZGF0YV90eXBlID09ICdib29sZWFuJ1xuXHRcdFx0XHQjIOWPquacieS4unRydWXmiY3kuLrnnJ9cblx0XHRcdFx0b3B0aW9uSXRlbS52YWx1ZSA9IG9wdGlvbkl0ZW0udmFsdWUgPT0gJ3RydWUnXG5cdHJldHVybiBvcHRpb25zXG5cbkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gKG9iaikgLT5cblx0dW5sZXNzIG9ialxuXHRcdHJldHVyblxuXHRzY2hlbWEgPSB7fVxuXG5cdGZpZWxkc0FyciA9IFtdXG5cblx0Xy5lYWNoIG9iai5maWVsZHMgLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRpZiAhXy5oYXMoZmllbGQsIFwibmFtZVwiKVxuXHRcdFx0ZmllbGQubmFtZSA9IGZpZWxkX25hbWVcblx0XHRmaWVsZHNBcnIucHVzaCBmaWVsZFxuXG5cdF8uZWFjaCBfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgKGZpZWxkKS0+XG5cblx0XHRmaWVsZF9uYW1lID0gZmllbGQubmFtZVxuXG5cdFx0ZnMgPSB7fVxuXHRcdGlmIGZpZWxkLnJlZ0V4XG5cdFx0XHRmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4XG5cdFx0ZnMuYXV0b2Zvcm0gPSB7fVxuXHRcdGZzLmF1dG9mb3JtLm11bHRpcGxlID0gZmllbGQubXVsdGlwbGVcblx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdGF1dG9mb3JtX3R5cGUgPSBmaWVsZC5hdXRvZm9ybT8udHlwZVxuXG5cdFx0aWYgZmllbGQudHlwZSA9PSBcInRleHRcIiBvciBmaWVsZC50eXBlID09IFwicGhvbmVcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIlt0ZXh0XVwiIG9yIGZpZWxkLnR5cGUgPT0gXCJbcGhvbmVdXCJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdjb2RlJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTJcblx0XHRcdGlmIGZpZWxkLmxhbmd1YWdlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmxhbmd1YWdlID0gZmllbGQubGFuZ3VhZ2Vcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0YXJlYVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwicGFzc3dvcmRcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxuXHRcdFx0ZnMudHlwZSA9IERhdGVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5pc2lPUygpXG5cdFx0XHRcdFx0XHQjIEZpeCBpb3MgMTQsIOaJi+acuuWuouaIt+err+W+heWuoeaguOaWh+S7tuaXpeacn+aOp+S7tuaYvuekuuaVhemanCAjOTkx77yMaW9z57uf5LiA55SoUEPnq6/kuIDmoLfnmoRqc+aOp+S7tlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcblx0XHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG5cdFx0XHRcdFx0XHRcdFx0cGlja2VyVHlwZTogXCJyb2xsZXJzXCJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcblx0XHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidGltZVwiXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHR0eXBlOiBcInRpbWVcIlxuXHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJISDptbVwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdFx0ZnMudHlwZSA9IERhdGVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5pc2lPUygpXG5cdFx0XHRcdFx0XHQjIEZpeCBpb3MgMTQsIOaJi+acuuWuouaIt+err+W+heWuoeaguOaWh+S7tuaXpeacn+aOp+S7tuaYvuekuuaVhemanCAjOTkx77yMaW9z57uf5LiA55SoUEPnq6/kuIDmoLfnmoRqc+aOp+S7tlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcblx0XHRcdFx0XHRcdFx0XHRwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxuXHRcdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW09iamVjdF1cIlxuXHRcdFx0ZnMudHlwZSA9IFtPYmplY3RdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaHRtbFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zSHRtbCc7XG5cdFx0XHQjIGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0IyBcdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0XHRcdCMgXHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PSBcInpoLUNOXCJcblx0XHRcdCMgXHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXHRcdFx0IyBcdGVsc2Vcblx0XHRcdCMgXHRcdGxvY2FsZSA9IFwiZW4tVVNcIlxuXHRcdFx0IyBcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHQjIFx0XHR0eXBlOiBcInN1bW1lcm5vdGVcIlxuXHRcdFx0IyBcdFx0Y2xhc3M6ICdzdW1tZXJub3RlLWVkaXRvcidcblx0XHRcdCMgXHRcdHNldHRpbmdzOlxuXHRcdFx0IyBcdFx0XHRoZWlnaHQ6IDIwMFxuXHRcdFx0IyBcdFx0XHRkaWFsb2dzSW5Cb2R5OiB0cnVlXG5cdFx0XHQjIFx0XHRcdHRvb2xiYXI6ICBbXG5cdFx0XHQjIFx0XHRcdFx0Wydmb250MScsIFsnc3R5bGUnXV0sXG5cdFx0XHQjIFx0XHRcdFx0Wydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsnZm9udDMnLCBbJ2ZvbnRuYW1lJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsnY29sb3InLCBbJ2NvbG9yJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsndGFibGUnLCBbJ3RhYmxlJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sXG5cdFx0XHQjIFx0XHRcdFx0Wyd2aWV3JywgWydjb2RldmlldyddXVxuXHRcdFx0IyBcdFx0XHRdXG5cdFx0XHQjIFx0XHRcdGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywn6buR5L2TJywn5b6u6L2v6ZuF6buRJywn5Lu/5a6LJywn5qW35L2TJywn6Zq25LmmJywn5bm85ZyGJ11cblx0XHRcdCMgXHRcdFx0bGFuZzogbG9jYWxlXG5cblx0XHRlbHNlIGlmIChmaWVsZC50eXBlID09IFwibG9va3VwXCIgb3IgZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb25cblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXG5cdFx0XHRpZiAhZmllbGQuaGlkZGVuXG5cblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnNcblxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vblxuXG5cdFx0XHRcdGlmIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXHRcdFx0XHRcdGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXG5cdFx0XHRcdGZzLmZpbHRlcnNGdW5jdGlvbiA9IGlmIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiB0aGVuIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiBlbHNlIENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzXG5cblx0XHRcdFx0aWYgZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cdFx0XHRcdFx0ZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdGlmIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dXG5cdFx0XHRcdFx0XHRcdFx0aWYgX3JlZl9vYmo/LnBlcm1pc3Npb25zPy5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSAobG9va3VwX2ZpZWxkKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy4je0NyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcm1JZDogXCJuZXcje2ZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywnXycpfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBcIiN7ZmllbGQucmVmZXJlbmNlX3RvfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wZXJhdGlvbjogXCJpbnNlcnRcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvblN1Y2Nlc3M6IChvcGVyYXRpb24sIHJlc3VsdCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVzdWx0Lm9iamVjdF9uYW1lID09IFwib2JqZWN0c1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSwgaWNvbjogcmVzdWx0LnZhbHVlLmljb259XSwgcmVzdWx0LnZhbHVlLm5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsIHZhbHVlOiByZXN1bHQuX2lkfV0sIHJlc3VsdC5faWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2VcblxuXHRcdFx0XHRcdGlmIF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSlcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZVxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3NvcnRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnRcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9saW1pdFxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0XG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VUb0ZpZWxkID0gZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkXG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJ1c2Vyc1wiXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzliIbpg6jkuIvnmoTmlbDmja5cblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWIhumDqOWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxuXHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5YiG6YOo6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc1VuTGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0IyDkvKDlhaXlvZPliY3lr7nosaHnmoTmnYPpmZDvvIzlnKjlh73mlbDkuK3moLnmja7mnYPpmZDorqHnrpfmmK/lkKbopoHpmZDliLblj6rmn6XnnIvmnKzliIbpg6hcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0IyDmnI3liqHnq6/nlKjkuI3liLBpc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRlbHNlIGlmIGZpZWxkLnJlZmVyZW5jZV90byA9PSBcIm9yZ2FuaXphdGlvbnNcIlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzliIbpg6jkuIvnmoTmlbDmja5cblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWIhumDqOWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxuXHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5YiG6YOo6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc1VuTGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0IyDkvKDlhaXlvZPliY3lr7nosaHnmoTmnYPpmZDvvIzlnKjlh73mlbDkuK3moLnmja7mnYPpmZDorqHnrpfmmK/lkKbopoHpmZDliLblj6rmn6XnnIvmnKzliIbpg6hcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0IyDmnI3liqHnq6/nlKjkuI3liLBpc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpZiB0eXBlb2YoZmllbGQucmVmZXJlbmNlX3RvKSA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KF9yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdGZzLnR5cGUgPSBPYmplY3Rcblx0XHRcdFx0XHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlXG5cblx0XHRcdFx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFN0cmluZ1xuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFtTdHJpbmddXG5cdFx0XHRcdFx0XHRcdFx0YXV0b2Zvcm06IHtvbWl0OiB0cnVlfVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXVxuXG5cdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dXG5cdFx0XHRcdFx0XHRpZiBfb2JqZWN0IGFuZCBfb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFRyZWVcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2QgPSBmaWVsZC5vcHRpb25zTWV0aG9kIHx8IFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiXG5cblx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZFBhcmFtcyA9ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX1cblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW11cblx0XHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvLmZvckVhY2ggKF9yZWZlcmVuY2UpLT5cblx0XHRcdFx0XHRcdFx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV1cblx0XHRcdFx0XHRcdFx0XHRcdGlmIF9vYmplY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3Q6IF9yZWZlcmVuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogX29iamVjdD8ubGFiZWxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBfb2JqZWN0Py5pY29uXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3Q6IF9yZWZlcmVuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW5rOiAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvblxuXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwic2VsZWN0XCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRcdFx0aWYgXy5oYXMoZmllbGQsICdmaXJzdE9wdGlvbicpXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBmaWVsZC5maXJzdE9wdGlvblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiXG5cdFx0XHQjIOWboOS4uuWIl+ihqOinhuWbvuWPs+S+p+i/h+a7pOWZqOi/mOaYr+eUqOeahOiAgeihqOWNleeahGxvb2t1cOWSjHNlbGVjdOaOp+S7tu+8jOaJgOS7peS4iumdoueahOS7o+eggeWni+e7iOS/neaMgeWOn+agt+mcgOimgeaJp+ihjFxuXHRcdFx0IyDkuIvpnaLmmK/phY3nva7kuoZkYXRhX3R5cGXml7bvvIzpop3lpJblpITnkIbnmoTpgLvovpFcblx0XHRcdGlmIGZpZWxkLmRhdGFfdHlwZSBhbmQgZmllbGQuZGF0YV90eXBlICE9IFwidGV4dFwiXG5cdFx0XHRcdGlmIFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCIsIFwicGVyY2VudFwiXS5pbmRleE9mKGZpZWxkLmRhdGFfdHlwZSkgPiAtMVxuXHRcdFx0XHRcdGZzVHlwZSA9IE51bWJlclxuXHRcdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0XHRcdGVsc2UgaWYgZmllbGQuZGF0YV90eXBlID09IFwiYm9vbGVhblwiXG5cdFx0XHRcdFx0ZnNUeXBlID0gQm9vbGVhblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnNUeXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLnR5cGUgPSBmc1R5cGVcblx0XHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0XHRmcy50eXBlID0gW2ZzVHlwZV1cblx0XHRcdFx0XHRcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IENyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyhmaWVsZClcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJjdXJyZW5jeVwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRcdGVsc2UgaWYgZmllbGQ/LnNjYWxlICE9IDBcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSAyXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibnVtYmVyXCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImJvb2xlYW5cIlxuXHRcdFx0ZnMudHlwZSA9IEJvb2xlYW5cblx0XHRcdGlmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0b2dnbGVcIlxuXHRcdFx0ZnMudHlwZSA9IEJvb2xlYW5cblx0XHRcdGlmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLXRvZ2dsZVwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwicmVmZXJlbmNlXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJjaGVja2JveFwiXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdC1jaGVja2JveFwiXG5cdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImZpbGVcIlxuXHRcdFx0Y29sbGVjdGlvbk5hbWUgPSBmaWVsZC5jb2xsZWN0aW9uIHx8IFwiZmlsZXNcIiAjIGNvbGxlY3Rpb24g6buY6K6k5pivICdmaWxlcydcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBjb2xsZWN0aW9uTmFtZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25OYW1lXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZXNpemVcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJPYmplY3RcIiB8fCBmaWVsZC50eXBlID09IFwib2JqZWN0XCJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3Rcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJncmlkXCJcblx0XHRcdGZzLnR5cGUgPSBBcnJheVxuXHRcdFx0ZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiXG5cblx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdHR5cGU6IE9iamVjdFxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImltYWdlXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnaW1hZ2VzJ1xuXHRcdFx0XHRcdFx0YWNjZXB0OiAnaW1hZ2UvKidcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdmF0YXJcIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdhdmF0YXJzJ1xuXHRcdFx0XHRcdFx0YWNjZXB0OiAnaW1hZ2UvKidcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXVkaW9cIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdhdWRpb3MnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdhdWRpby8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdhdWRpby8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInZpZGVvXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAndmlkZW9zJ1xuXHRcdFx0XHRcdFx0YWNjZXB0OiAndmlkZW8vKidcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAndmlkZW8vKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJsb2NhdGlvblwiXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJsb2NhdGlvblwiXG5cdFx0XHRmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiXG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJtYXJrZG93blwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0ZXh0XCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3VybCdcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdCMgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguVXJsXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdlbWFpbCdcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2F1dG9udW1iZXInXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdmb3JtdWxhJ1xuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3N1bW1hcnknXG5cdFx0XHRmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtmaWVsZHM6IHtmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHt0eXBlOiBmaWVsZC5kYXRhX3R5cGV9KX19KVtmaWVsZC5uYW1lXVxuXHRcdCMgZWxzZSBpZiBmaWVsZC50eXBlID09ICdzZWxlY3QnXG5cdFx0IyBcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdwZXJjZW50J1xuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdHVubGVzcyBfLmlzTnVtYmVyKGZpZWxkLnNjYWxlKVxuXHRcdFx0XHQjIOayoemFjee9ruWwj+aVsOS9jeaVsOWImeaMieWwj+aVsOS9jeaVsDDmnaXlpITnkIbvvIzljbPpu5jorqTmmL7npLrkuLrmlbTmlbDnmoTnmb7liIbmr5TvvIzmr5TlpoIyMCXvvIzmraTml7bmjqfku7blj6/ku6XovpPlhaUy5L2N5bCP5pWw77yM6L2s5oiQ55m+5YiG5q+U5bCx5piv5pW05pWwXG5cdFx0XHRcdGZpZWxkLnNjYWxlID0gMFxuXHRcdFx0IyBhdXRvZm9ybeaOp+S7tuS4reWwj+aVsOS9jeaVsOWni+e7iOavlOmFjee9rueahOS9jeaVsOWkmjLkvY1cblx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGUgKyAyXG5cdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdGZzLnR5cGUgPSBmaWVsZC50eXBlXG5cblx0XHRpZiBmaWVsZC5sYWJlbFxuXHRcdFx0ZnMubGFiZWwgPSBmaWVsZC5sYWJlbFxuXG4jXHRcdGlmIGZpZWxkLmFsbG93ZWRWYWx1ZXNcbiNcdFx0XHRmcy5hbGxvd2VkVmFsdWVzID0gZmllbGQuYWxsb3dlZFZhbHVlc1xuXG5cdFx0aWYgIWZpZWxkLnJlcXVpcmVkXG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcblxuXHRcdCMgW+etvue6puWvueixoeWQjOaXtumFjee9ruS6hmNvbXBhbnlfaWRz5b+F5aGr5Y+KdW5lZGl0YWJsZV9maWVsZHPpgKDmiJDpg6jliIbnlKjmiLfmlrDlu7rnrb7nuqblr7nosaHml7bmiqXplJkgIzE5Ml0oaHR0cHM6Ly9naXRodWIuY29tL3N0ZWVkb3Mvc3RlZWRvcy1wcm9qZWN0LWR6dWcvaXNzdWVzLzE5Milcblx0XHQjIOWQjuWPsOWni+e7iOiuvue9rnJlcXVpcmVk5Li6ZmFsc2Vcblx0XHRpZiAhTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLnVuaXF1ZVxuXHRcdFx0ZnMudW5pcXVlID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQub21pdFxuXHRcdFx0ZnMuYXV0b2Zvcm0ub21pdCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmdyb3VwXG5cdFx0XHRmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwXG5cblx0XHRpZiBmaWVsZC5pc193aWRlXG5cdFx0XHRmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuaGlkZGVuXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIlxuXG5cdFx0aWYgKGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuZmlsdGVyYWJsZSkgPT0gJ3VuZGVmaW5lZCdcblx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcblx0XHRpZiBmaWVsZC5uYW1lID09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuc2VhcmNoYWJsZSkgPT0gJ3VuZGVmaW5lZCdcblx0XHRcdFx0ZmllbGQuc2VhcmNoYWJsZSA9IHRydWVcblxuXHRcdGlmIGF1dG9mb3JtX3R5cGVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlXG5cblx0XHRpZiBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSAoKS0+XG5cdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge3VzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLCBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIG5vdzogbmV3IERhdGUoKX0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0IyBcdGlmICFfLmlzRnVuY3Rpb24oZmllbGQuZGVmYXVsdFZhbHVlKVxuXHRcdFx0IyBcdFx0ZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cblx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0ZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5kaXNhYmxlZFxuXHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5pbmxpbmVIZWxwVGV4dFxuXHRcdFx0ZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dFxuXG5cdFx0aWYgZmllbGQuYmxhY2tib3hcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXG5cdFx0aWYgXy5oYXMoZmllbGQsICdtaW4nKVxuXHRcdFx0ZnMubWluID0gZmllbGQubWluXG5cdFx0aWYgXy5oYXMoZmllbGQsICdtYXgnKVxuXHRcdFx0ZnMubWF4ID0gZmllbGQubWF4XG5cblx0XHQjIOWPquacieeUn+S6p+eOr+Wig+aJjemHjeW7uue0ouW8lVxuXHRcdGlmIE1ldGVvci5pc1Byb2R1Y3Rpb25cblx0XHRcdGlmIGZpZWxkLmluZGV4XG5cdFx0XHRcdGZzLmluZGV4ID0gZmllbGQuaW5kZXhcblx0XHRcdGVsc2UgaWYgZmllbGQuc29ydGFibGVcblx0XHRcdFx0ZnMuaW5kZXggPSB0cnVlXG5cblx0XHRzY2hlbWFbZmllbGRfbmFtZV0gPSBmc1xuXG5cdHJldHVybiBzY2hlbWFcblxuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSktPlxuXHRodG1sID0gZmllbGRfdmFsdWVcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRyZXR1cm4gXCJcIlxuXHRmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSlcblx0aWYgIWZpZWxkXG5cdFx0cmV0dXJuIFwiXCJcblxuXHRpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCBIOm1tJylcblx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJylcblxuXHRyZXR1cm4gaHRtbFxuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IChmaWVsZF90eXBlKS0+XG5cdHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJ0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSAoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyktPlxuXHRidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxuXHRpZiBidWlsdGluVmFsdWVzXG5cdFx0Xy5mb3JFYWNoIGJ1aWx0aW5WYWx1ZXMsIChidWlsdGluSXRlbSwga2V5KS0+XG5cdFx0XHRvcGVyYXRpb25zLnB1c2goe2xhYmVsOiBidWlsdGluSXRlbS5sYWJlbCwgdmFsdWU6IGtleX0pXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSAoZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSktPlxuXHQjIOi/h+a7pOWZqOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSlcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIGtleSlcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IChmaWVsZF90eXBlLCB2YWx1ZSktPlxuXHQjIOagueaNrui/h+a7pOWZqOeahOi/h+a7pOWAvO+8jOiOt+WPluWvueW6lOeahOWGhee9rui/kOeul+esplxuXHQjIOavlOWmgnZhbHVl5Li6bGFzdF95ZWFy77yM6L+U5ZueYmV0d2Vlbl90aW1lX2xhc3RfeWVhclxuXHR1bmxlc3MgXy5pc1N0cmluZyh2YWx1ZSlcblx0XHRyZXR1cm5cblx0YmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXG5cdHVubGVzcyBiZXR3ZWVuQnVpbHRpblZhbHVlc1xuXHRcdHJldHVyblxuXHRyZXN1bHQgPSBudWxsXG5cdF8uZWFjaCBiZXR3ZWVuQnVpbHRpblZhbHVlcywgKGl0ZW0sIG9wZXJhdGlvbiktPlxuXHRcdGlmIGl0ZW0ua2V5ID09IHZhbHVlXG5cdFx0XHRyZXN1bHQgPSBvcGVyYXRpb25cblx0cmV0dXJuIHJlc3VsdFxuXG4jIOWmguaenOWPquaYr+S4uuWIpOaWrW9wZXJhdGlvbuaYr+WQpuWtmOWcqO+8jOWImeayoeW/heimgeiuoeeul3ZhbHVlc++8jOS8oOWFpWlzX2NoZWNrX29ubHnkuLp0cnVl5Y2z5Y+vXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IChpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKS0+XG5cdCMg6L+H5ruk5Zmo5pe26Ze05a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdHJldHVybiB7XG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc195ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3llYXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3F1YXJ0ZXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc193ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3dlZWtcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcblx0XHRcImJldHdlZW5fdGltZV90b2RheVwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9kYXlcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzMwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMzBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzEyMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzEyMF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzYwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfNjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXG5cdH1cblxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IChtb250aCktPlxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0aWYgbW9udGggPCAzXG5cdFx0cmV0dXJuIDBcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRyZXR1cm4gM1xuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdHJldHVybiA2XG5cdFxuXHRyZXR1cm4gOVxuXG5cbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0aWYgbW9udGggPCAzXG5cdFx0eWVhci0tXG5cdFx0bW9udGggPSA5XG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0bW9udGggPSAwXG5cdGVsc2UgaWYgbW9udGggPCA5XG5cdFx0bW9udGggPSAzXG5cdGVsc2UgXG5cdFx0bW9udGggPSA2XG5cdFxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdFxuXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdG1vbnRoID0gM1xuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdG1vbnRoID0gNlxuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdG1vbnRoID0gOVxuXHRlbHNlXG5cdFx0eWVhcisrXG5cdFx0bW9udGggPSAwXG5cdFxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gKHllYXIsbW9udGgpLT5cblx0aWYgbW9udGggPT0gMTFcblx0XHRyZXR1cm4gMzFcblx0XG5cdG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNFxuXHRzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0ZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoKzEsIDEpXG5cdGRheXMgPSAoZW5kRGF0ZS1zdGFydERhdGUpL21pbGxpc2Vjb25kXG5cdHJldHVybiBkYXlzXG5cbkNyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkgPSAoeWVhciwgbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHQjIOaciOS7veS4ujDku6PooajmnKzlubTnmoTnrKzkuIDmnIhcblx0aWYgbW9udGggPT0gMFxuXHRcdG1vbnRoID0gMTFcblx0XHR5ZWFyLS1cblx0XHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdFxuXHQjIOWQpuWImSzlj6rlh4/ljrvmnIjku71cblx0bW9udGgtLTtcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxuXHQjIOi/h+a7pOWZqGJldHdlZW7ov5DnrpfnrKbvvIznjrDnrpfml6XmnJ8v5pel5pyf5pe26Ze057G75Z6L5a2X5q6155qEdmFsdWVz5YC8XG5cdG5vdyA9IG5ldyBEYXRlKClcblx0IyDkuIDlpKnnmoTmr6vnp5LmlbBcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cdHllc3RkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxuXHQjIOS4gOWRqOS4reeahOafkOS4gOWkqVxuXHR3ZWVrID0gbm93LmdldERheSgpXG5cdCMg5YeP5Y6755qE5aSp5pWwXG5cdG1pbnVzRGF5ID0gaWYgd2VlayAhPSAwIHRoZW4gd2VlayAtIDEgZWxzZSA2XG5cdG1vbmRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAobWludXNEYXkgKiBtaWxsaXNlY29uZCkpXG5cdHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDkuIrlkajml6Vcblx0bGFzdFN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0IyDkuIrlkajkuIBcblx0bGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpXG5cdCMg5LiL5ZGo5LiAXG5cdG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXG5cdCMg5LiL5ZGo5pelXG5cdG5leHRTdW5kYXkgPSBuZXcgRGF0ZShuZXh0TW9uZGF5LmdldFRpbWUoKSArIChtaWxsaXNlY29uZCAqIDYpKVxuXHRjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG5cdHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMVxuXHRuZXh0WWVhciA9IGN1cnJlbnRZZWFyICsgMVxuXHQjIOW9k+WJjeaciOS7vVxuXHRjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKVxuXHQjIOiuoeaVsOW5tOOAgeaciFxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcblx0bW9udGggPSBub3cuZ2V0TW9udGgoKVxuXHQjIOacrOaciOesrOS4gOWkqVxuXHRmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aCwxKVxuXG5cdCMg5b2T5Li6MTLmnIjnmoTml7blgJnlubTku73pnIDopoHliqAxXG5cdCMg5pyI5Lu96ZyA6KaB5pu05paw5Li6MCDkuZ/lsLHmmK/kuIvkuIDlubTnmoTnrKzkuIDkuKrmnIhcblx0aWYgY3VycmVudE1vbnRoID09IDExXG5cdFx0eWVhcisrXG5cdFx0bW9udGgrK1xuXHRlbHNlXG5cdFx0bW9udGgrK1xuXHRcblx0IyDkuIvmnIjnrKzkuIDlpKlcblx0bmV4dE1vbnRoRmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0IyDkuIvmnIjmnIDlkI7kuIDlpKlcblx0bmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLG1vbnRoLENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsbW9udGgpKVxuXHQjIOacrOaciOacgOWQjuS4gOWkqVxuXHRsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5LiK5pyI56ys5LiA5aSpXG5cdGxhc3RNb250aEZpcnN0RGF5ID0gQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiK5pyI5pyA5ZCO5LiA5aSpXG5cdGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5pys5a2j5bqm5byA5aeL5pelXG5cdHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksMSlcblx0IyDmnKzlraPluqbnu5PmnZ/ml6Vcblx0dGhpc1F1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkrMikpXG5cdCMg5LiK5a2j5bqm5byA5aeL5pelXG5cdGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4iuWto+W6pue7k+adn+aXpVxuXHRsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxuXHQjIOS4i+Wto+W6puW8gOWni+aXpVxuXHRuZXh0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIvlraPluqbnu5PmnZ/ml6Vcblx0bmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcblx0IyDov4fljrs35aSpIFxuXHRsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrszMOWkqVxuXHRsYXN0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDI5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzYw5aSpXG5cdGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67OTDlpKlcblx0bGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrsxMjDlpKlcblx0bGFzdF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMTE5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTflpKkgXG5cdG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTMw5aSpXG5cdG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lNjDlpKlcblx0bmV4dF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg1OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU5MOWkqVxuXHRuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTEyMOWkqVxuXHRuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpXG5cblx0c3dpdGNoIGtleVxuXHRcdHdoZW4gXCJsYXN0X3llYXJcIlxuXHRcdFx0I+WOu+W5tFxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF95ZWFyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3llYXJcIlxuXHRcdFx0I+S7iuW5tFxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje2N1cnJlbnRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje2N1cnJlbnRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF95ZWFyXCJcblx0XHRcdCPmmI7lubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tuZXh0WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tuZXh0WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfcXVhcnRlclwiXG5cdFx0XHQj5LiK5a2j5bqmXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChsYXN0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfcXVhcnRlclwiXG5cdFx0XHQj5pys5a2j5bqmXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3F1YXJ0ZXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfcXVhcnRlclwiXG5cdFx0XHQj5LiL5a2j5bqmXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfbW9udGhcIlxuXHRcdFx0I+S4iuaciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfbW9udGhcIlxuXHRcdFx0I+acrOaciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19tb250aFwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF9tb250aFwiXG5cdFx0XHQj5LiL5pyIXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF93ZWVrXCJcblx0XHRcdCPkuIrlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChsYXN0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3dlZWtcIlxuXHRcdFx0I+acrOWRqFxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc193ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3dlZWtcIlxuXHRcdFx0I+S4i+WRqFxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChuZXh0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInllc3RkYXlcIlxuXHRcdFx0I+aYqOWkqVxuXHRcdFx0c3RyWWVzdGRheSA9IG1vbWVudCh5ZXN0ZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRvZGF5XCJcblx0XHRcdCPku4rlpKlcblx0XHRcdHN0clRvZGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0b21vcnJvd1wiXG5cdFx0XHQj5piO5aSpXG5cdFx0XHRzdHJUb21vcnJvdyA9IG1vbWVudCh0b21vcnJvdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9tb3Jyb3d9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9tb3Jyb3d9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzdfZGF5c1wiXG5cdFx0XHQj6L+H5Y67N+WkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIikgXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzMwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzMw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMzBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzYwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzYw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzkwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzkw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzEyMF9kYXlzXCJcblx0XHRcdCPov4fljrsxMjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMTIwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF83X2RheXNcIlxuXHRcdFx0I+acquadpTflpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzMwX2RheXNcIlxuXHRcdFx0I+acquadpTMw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzYwX2RheXNcIlxuXHRcdFx0I+acquadpTYw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfNjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzkwX2RheXNcIlxuXHRcdFx0I+acquadpTkw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzEyMF9kYXlzXCJcblx0XHRcdCPmnKrmnaUxMjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XG5cdHZhbHVlcyA9IFtzdGFydFZhbHVlLCBlbmRWYWx1ZV1cblx0aWYgZmllbGRfdHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHQjIOaXtumXtOexu+Wei+Wtl+aute+8jOWGhee9ruaXtumXtOiMg+WbtOW6lOivpeiAg+iZkeWBj+enu+aXtuWMuuWAvO+8jOWQpuWImei/h+a7pOaVsOaNruWtmOWcqOWBj+W3rlxuXHRcdCMg6Z2e5YaF572u5pe26Ze06IyD5Zu05pe277yM55So5oi36YCa6L+H5pe26Ze05o6n5Lu26YCJ5oup55qE6IyD5Zu077yM5Lya6Ieq5Yqo5aSE55CG5pe25Yy65YGP5beu5oOF5Ya1XG5cdFx0IyDml6XmnJ/nsbvlnovlrZfmrrXvvIzmlbDmja7lupPmnKzmnaXlsLHlrZjnmoTmmK9VVEPnmoQw54K577yM5LiN5a2Y5Zyo5YGP5beuXG5cdFx0Xy5mb3JFYWNoIHZhbHVlcywgKGZ2KS0+XG5cdFx0XHRpZiBmdlxuXHRcdFx0XHRmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwIClcblx0XG5cdHJldHVybiB7XG5cdFx0bGFiZWw6IGxhYmVsXG5cdFx0a2V5OiBrZXlcblx0XHR2YWx1ZXM6IHZhbHVlc1xuXHR9XG5cbkNyZWF0b3IuZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uID0gKGZpZWxkX3R5cGUpLT5cblx0aWYgZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxuXHRcdHJldHVybiAnYmV0d2Vlbidcblx0ZWxzZSBpZiBbXCJ0ZXh0YXJlYVwiLCBcInRleHRcIiwgXCJjb2RlXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuICdjb250YWlucydcblx0ZWxzZVxuXHRcdHJldHVybiBcIj1cIlxuXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUpIC0+XG5cdCMg5pel5pyf57G75Z6LOiBkYXRlLCBkYXRldGltZSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcIjxcIiwgXCI+XCIsIFwiPD1cIiwgXCI+PVwiXG5cdCMg5paH5pys57G75Z6LOiB0ZXh0LCB0ZXh0YXJlYSwgaHRtbCAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIiwgXCJzdGFydHN3aXRoXCJcblx0IyDpgInmi6nnsbvlnos6IGxvb2t1cCwgbWFzdGVyX2RldGFpbCwgc2VsZWN0IOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxuXHQjIOaVsOWAvOexu+WeizogY3VycmVuY3ksIG51bWJlciAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcIjxcIiwgXCI+XCIsIFwiPD1cIiwgXCI+PVwiXG5cdCMg5biD5bCU57G75Z6LOiBib29sZWFuICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblx0IyDmlbDnu4Tnsbvlnos6IGNoZWNrYm94LCBbdGV4dF0gIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxuXG5cdG9wdGlvbmFscyA9IHtcblx0XHRlcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLCB2YWx1ZTogXCI9XCJ9LFxuXHRcdHVuZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl91bmVxdWFsXCIpLCB2YWx1ZTogXCI8PlwifSxcblx0XHRsZXNzX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksIHZhbHVlOiBcIjxcIn0sXG5cdFx0Z3JlYXRlcl90aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLCB2YWx1ZTogXCI+XCJ9LFxuXHRcdGxlc3Nfb3JfZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX29yX2VxdWFsXCIpLCB2YWx1ZTogXCI8PVwifSxcblx0XHRncmVhdGVyX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPj1cIn0sXG5cdFx0Y29udGFpbnM6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSwgdmFsdWU6IFwiY29udGFpbnNcIn0sXG5cdFx0bm90X2NvbnRhaW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9kb2VzX25vdF9jb250YWluXCIpLCB2YWx1ZTogXCJub3Rjb250YWluc1wifSxcblx0XHRzdGFydHNfd2l0aDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLCB2YWx1ZTogXCJzdGFydHN3aXRoXCJ9LFxuXHRcdGJldHdlZW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLCB2YWx1ZTogXCJiZXR3ZWVuXCJ9LFxuXHR9XG5cblx0aWYgZmllbGRfdHlwZSA9PSB1bmRlZmluZWRcblx0XHRyZXR1cm4gXy52YWx1ZXMob3B0aW9uYWxzKVxuXG5cdG9wZXJhdGlvbnMgPSBbXVxuXG5cdGlmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKVxuXHRcdENyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcInRleHRcIiBvciBmaWVsZF90eXBlID09IFwidGV4dGFyZWFcIiBvciBmaWVsZF90eXBlID09IFwiaHRtbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJjb2RlXCJcbiNcdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5jb250YWlucywgb3B0aW9uYWxzLm5vdF9jb250YWluLCBvcHRpb25hbHMuc3RhcnRzX3dpdGgpXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5jb250YWlucylcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwibG9va3VwXCIgb3IgZmllbGRfdHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBvciBmaWVsZF90eXBlID09IFwic2VsZWN0XCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiY3VycmVuY3lcIiBvciBmaWVsZF90eXBlID09IFwibnVtYmVyXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJib29sZWFuXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiY2hlY2tib3hcIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJbdGV4dF1cIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cblx0cmV0dXJuIG9wZXJhdGlvbnNcblxuIyMjXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXG4gICAg5YaN5bCG5rKh5pyJ5o6S5bqP5Y+355qE5pi+56S65ZyoXG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IChvYmplY3RfbmFtZSktPlxuXHRmaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LmZpZWxkc1xuXHRmaWVsZHNBcnIgPSBbXVxuXG5cdF8uZWFjaCBmaWVsZHMsIChmaWVsZCktPlxuXHRcdGZpZWxkc0Fyci5wdXNoIHtuYW1lOiBmaWVsZC5uYW1lLCBzb3J0X25vOiBmaWVsZC5zb3J0X25vfVxuXG5cdGZpZWxkc05hbWUgPSBbXVxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxuXHRcdGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKVxuXHRyZXR1cm4gZmllbGRzTmFtZVxuIiwiQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zID0gZnVuY3Rpb24oZmllbGRTY2hlbWEpIHtcbiAgdmFyIGRhdGFfdHlwZSwgb3B0aW9ucztcbiAgb3B0aW9ucyA9IGZpZWxkU2NoZW1hLm9wdGlvbnM7XG4gIGlmICghb3B0aW9ucykge1xuICAgIHJldHVybjtcbiAgfVxuICBkYXRhX3R5cGUgPSBmaWVsZFNjaGVtYS5kYXRhX3R5cGU7XG4gIGlmICghXy5pc0Z1bmN0aW9uKG9wdGlvbnMpICYmIGRhdGFfdHlwZSAmJiBkYXRhX3R5cGUgIT09ICd0ZXh0Jykge1xuICAgIG9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvcHRpb25JdGVtKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbkl0ZW0udmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChbJ251bWJlcicsICdjdXJyZW5jeScsICdwZXJjZW50J10uaW5kZXhPZihkYXRhX3R5cGUpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbkl0ZW0udmFsdWUgPSBOdW1iZXIob3B0aW9uSXRlbS52YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGRhdGFfdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25JdGVtLnZhbHVlID0gb3B0aW9uSXRlbS52YWx1ZSA9PT0gJ3RydWUnO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGZpZWxkc0Fyciwgc2NoZW1hO1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICBzY2hlbWEgPSB7fTtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChvYmouZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmICghXy5oYXMoZmllbGQsIFwibmFtZVwiKSkge1xuICAgICAgZmllbGQubmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaChmaWVsZCk7XG4gIH0pO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgdmFyIF9vYmplY3QsIF9yZWZfb2JqLCBfcmVmZXJlbmNlX3RvLCBhdXRvZm9ybV90eXBlLCBjb2xsZWN0aW9uTmFtZSwgZmllbGRfbmFtZSwgZnMsIGZzVHlwZSwgaXNVbkxpbWl0ZWQsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc2lPUygpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiLFxuICAgICAgICAgICAgICAgIHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCIsXG4gICAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGltZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgIHR5cGU6IFwidGltZVwiLFxuICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJISDptbVwiXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc2lPUygpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIixcbiAgICAgICAgICAgICAgICBwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgICBkYXRlTW9iaWxlT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIltPYmplY3RdXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbT2JqZWN0XTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiaHRtbFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NIdG1sJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIH1cbiAgICAgIGlmICghZmllbGQuaGlkZGVuKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzO1xuICAgICAgICBmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vbjtcbiAgICAgICAgaWYgKGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbikge1xuICAgICAgICAgIGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBmcy5maWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPyBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gOiBDcmVhdG9yLmV2YWx1YXRlRmlsdGVycztcbiAgICAgICAgaWYgKGZpZWxkLm9wdGlvbnNGdW5jdGlvbikge1xuICAgICAgICAgIGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgICAgIGlmIChfcmVmX29iaiAhPSBudWxsID8gKHJlZjEgPSBfcmVmX29iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjEuYWxsb3dDcmVhdGUgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKGxvb2t1cF9maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICBmb3JtSWQ6IFwibmV3XCIgKyAoZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCAnXycpKSxcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogXCJcIiArIGZpZWxkLnJlZmVyZW5jZV90byxcbiAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbihvcGVyYXRpb24sIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lm9iamVjdF9uYW1lID09PSBcIm9iamVjdHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogcmVzdWx0LnZhbHVlLmljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC52YWx1ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0Ll9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3NvcnQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfbGltaXQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90b19maWVsZCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlVG9GaWVsZCA9IGZpZWxkLnJlZmVyZW5jZV90b19maWVsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYyID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMi5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJvcmdhbml6YXRpb25zXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMyA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjMuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmllbGQucmVmZXJlbmNlX3RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoX3JlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgICAgICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogW1N0cmluZ10sXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXTtcbiAgICAgICAgICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI7XG4gICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdO1xuICAgICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8uZm9yRWFjaChmdW5jdGlvbihfcmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdO1xuICAgICAgICAgICAgICAgICAgaWYgKF9vYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmxhYmVsIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGljb246IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgICAgaWYgKF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZmllbGQuZGF0YV90eXBlICYmIGZpZWxkLmRhdGFfdHlwZSAhPT0gXCJ0ZXh0XCIpIHtcbiAgICAgICAgaWYgKFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCIsIFwicGVyY2VudFwiXS5pbmRleE9mKGZpZWxkLmRhdGFfdHlwZSkgPiAtMSkge1xuICAgICAgICAgIGZzVHlwZSA9IE51bWJlcjtcbiAgICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChmaWVsZC5kYXRhX3R5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgZnNUeXBlID0gQm9vbGVhbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmc1R5cGUgPSBTdHJpbmc7XG4gICAgICAgIH1cbiAgICAgICAgZnMudHlwZSA9IGZzVHlwZTtcbiAgICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgICAgZnMudHlwZSA9IFtmc1R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMoZmllbGQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjdXJyZW5jeVwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkgIT09IDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSAyO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBCb29sZWFuO1xuICAgICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ0b2dnbGVcIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLXRvZ2dsZVwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJyZWZlcmVuY2VcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCI7XG4gICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZmlsZVwiKSB7XG4gICAgICBjb2xsZWN0aW9uTmFtZSA9IGZpZWxkLmNvbGxlY3Rpb24gfHwgXCJmaWxlc1wiO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uTmFtZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTmFtZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZmlsZXNpemVcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJPYmplY3RcIiB8fCBmaWVsZC50eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJncmlkXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBBcnJheTtcbiAgICAgIGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCI7XG4gICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiaW1hZ2VcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnaW1hZ2VzJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2ltYWdlLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF2YXRhclwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdhdmF0YXJzJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2ltYWdlLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdWRpb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdhdWRpb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAnYXVkaW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdhdWRpby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidmlkZW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAndmlkZW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ3ZpZGVvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAndmlkZW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImxvY2F0aW9uXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJsb2NhdGlvblwiO1xuICAgICAgZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIjtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibWFya2Rvd25cIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInRleHRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICd1cmwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zVXJsJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdlbWFpbCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdhdXRvbnVtYmVyJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdmb3JtdWxhJykge1xuICAgICAgZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge1xuICAgICAgICAgICAgdHlwZTogZmllbGQuZGF0YV90eXBlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlbZmllbGQubmFtZV07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnc3VtbWFyeScpIHtcbiAgICAgIGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHtcbiAgICAgICAgICAgIHR5cGU6IGZpZWxkLmRhdGFfdHlwZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pW2ZpZWxkLm5hbWVdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3BlcmNlbnQnKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKCFfLmlzTnVtYmVyKGZpZWxkLnNjYWxlKSkge1xuICAgICAgICBmaWVsZC5zY2FsZSA9IDA7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlICsgMjtcbiAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcy50eXBlID0gZmllbGQudHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmxhYmVsKSB7XG4gICAgICBmcy5sYWJlbCA9IGZpZWxkLmxhYmVsO1xuICAgIH1cbiAgICBpZiAoIWZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC51bmlxdWUpIHtcbiAgICAgIGZzLnVuaXF1ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5vbWl0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmdyb3VwKSB7XG4gICAgICBmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaXNfd2lkZSkge1xuICAgICAgZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5oaWRkZW4pIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiO1xuICAgIH1cbiAgICBpZiAoKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHx8IChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLmZpbHRlcmFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQubmFtZSA9PT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuc2VhcmNoYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuc2VhcmNoYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvZm9ybV90eXBlKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRlZmF1bHRWYWx1ZSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHtcbiAgICAgICAgICAgIHVzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgICAgbm93OiBuZXcgRGF0ZSgpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGlzYWJsZWQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlubGluZUhlbHBUZXh0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0O1xuICAgIH1cbiAgICBpZiAoZmllbGQuYmxhY2tib3gpIHtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWluJykpIHtcbiAgICAgIGZzLm1pbiA9IGZpZWxkLm1pbjtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWF4JykpIHtcbiAgICAgIGZzLm1heCA9IGZpZWxkLm1heDtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1Byb2R1Y3Rpb24pIHtcbiAgICAgIGlmIChmaWVsZC5pbmRleCkge1xuICAgICAgICBmcy5pbmRleCA9IGZpZWxkLmluZGV4O1xuICAgICAgfSBlbHNlIGlmIChmaWVsZC5zb3J0YWJsZSkge1xuICAgICAgICBmcy5pbmRleCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzY2hlbWFbZmllbGRfbmFtZV0gPSBmcztcbiAgfSk7XG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKSB7XG4gIHZhciBmaWVsZCwgaHRtbCwgb2JqZWN0O1xuICBodG1sID0gZmllbGRfdmFsdWU7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSk7XG4gIGlmICghZmllbGQpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKTtcbiAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICB9XG4gIHJldHVybiBodG1sO1xufTtcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJ0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSk7XG59O1xuXG5DcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpIHtcbiAgdmFyIGJ1aWx0aW5WYWx1ZXM7XG4gIGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoYnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybiBfLmZvckVhY2goYnVpbHRpblZhbHVlcywgZnVuY3Rpb24oYnVpbHRpbkl0ZW0sIGtleSkge1xuICAgICAgcmV0dXJuIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBidWlsdGluSXRlbS5sYWJlbCxcbiAgICAgICAgdmFsdWU6IGtleVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBpc19jaGVja19vbmx5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgdmFsdWUpIHtcbiAgdmFyIGJldHdlZW5CdWlsdGluVmFsdWVzLCByZXN1bHQ7XG4gIGlmICghXy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoIWJldHdlZW5CdWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlc3VsdCA9IG51bGw7XG4gIF8uZWFjaChiZXR3ZWVuQnVpbHRpblZhbHVlcywgZnVuY3Rpb24oaXRlbSwgb3BlcmF0aW9uKSB7XG4gICAgaWYgKGl0ZW0ua2V5ID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdCA9IG9wZXJhdGlvbjtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKSB7XG4gIHJldHVybiB7XG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc195ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc193ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b2RheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9kYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzEyMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gZnVuY3Rpb24obW9udGgpIHtcbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICByZXR1cm4gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICByZXR1cm4gNjtcbiAgfVxuICByZXR1cm4gOTtcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICB5ZWFyLS07XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSB7XG4gICAgbW9udGggPSA2O1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gNjtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoID0gMDtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRNb250aERheXMgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICB2YXIgZGF5cywgZW5kRGF0ZSwgbWlsbGlzZWNvbmQsIHN0YXJ0RGF0ZTtcbiAgaWYgKG1vbnRoID09PSAxMSkge1xuICAgIHJldHVybiAzMTtcbiAgfVxuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMSk7XG4gIGRheXMgPSAoZW5kRGF0ZSAtIHN0YXJ0RGF0ZSkgLyBtaWxsaXNlY29uZDtcbiAgcmV0dXJuIGRheXM7XG59O1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoID09PSAwKSB7XG4gICAgbW9udGggPSAxMTtcbiAgICB5ZWFyLS07XG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgfVxuICBtb250aC0tO1xuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgdmFyIGN1cnJlbnRNb250aCwgY3VycmVudFllYXIsIGVuZFZhbHVlLCBmaXJzdERheSwgbGFiZWwsIGxhc3REYXksIGxhc3RNb25kYXksIGxhc3RNb250aEZpbmFsRGF5LCBsYXN0TW9udGhGaXJzdERheSwgbGFzdFF1YXJ0ZXJFbmREYXksIGxhc3RRdWFydGVyU3RhcnREYXksIGxhc3RTdW5kYXksIGxhc3RfMTIwX2RheXMsIGxhc3RfMzBfZGF5cywgbGFzdF82MF9kYXlzLCBsYXN0XzdfZGF5cywgbGFzdF85MF9kYXlzLCBtaWxsaXNlY29uZCwgbWludXNEYXksIG1vbmRheSwgbW9udGgsIG5leHRNb25kYXksIG5leHRNb250aEZpbmFsRGF5LCBuZXh0TW9udGhGaXJzdERheSwgbmV4dFF1YXJ0ZXJFbmREYXksIG5leHRRdWFydGVyU3RhcnREYXksIG5leHRTdW5kYXksIG5leHRZZWFyLCBuZXh0XzEyMF9kYXlzLCBuZXh0XzMwX2RheXMsIG5leHRfNjBfZGF5cywgbmV4dF83X2RheXMsIG5leHRfOTBfZGF5cywgbm93LCBwcmV2aW91c1llYXIsIHN0YXJ0VmFsdWUsIHN0ckVuZERheSwgc3RyRmlyc3REYXksIHN0ckxhc3REYXksIHN0ck1vbmRheSwgc3RyU3RhcnREYXksIHN0clN1bmRheSwgc3RyVG9kYXksIHN0clRvbW9ycm93LCBzdHJZZXN0ZGF5LCBzdW5kYXksIHRoaXNRdWFydGVyRW5kRGF5LCB0aGlzUXVhcnRlclN0YXJ0RGF5LCB0b21vcnJvdywgdmFsdWVzLCB3ZWVrLCB5ZWFyLCB5ZXN0ZGF5O1xuICBub3cgPSBuZXcgRGF0ZSgpO1xuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHllc3RkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIHdlZWsgPSBub3cuZ2V0RGF5KCk7XG4gIG1pbnVzRGF5ID0gd2VlayAhPT0gMCA/IHdlZWsgLSAxIDogNjtcbiAgbW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICBuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIGN1cnJlbnRZZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMTtcbiAgbmV4dFllYXIgPSBjdXJyZW50WWVhciArIDE7XG4gIGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpO1xuICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIG1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIGZpcnN0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgMSk7XG4gIGlmIChjdXJyZW50TW9udGggPT09IDExKSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoKys7XG4gIH0gZWxzZSB7XG4gICAgbW9udGgrKztcbiAgfVxuICBuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgbmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgQ3JlYXRvci5nZXRNb250aERheXMoeWVhciwgbW9udGgpKTtcbiAgbGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdGhpc1F1YXJ0ZXJTdGFydERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksIDEpO1xuICB0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMikpO1xuICBsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN3aXRjaCAoa2V5KSB7XG4gICAgY2FzZSBcImxhc3RfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChmaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChsYXN0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc193ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwieWVzdGRheVwiOlxuICAgICAgc3RyWWVzdGRheSA9IG1vbWVudCh5ZXN0ZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvZGF5XCI6XG4gICAgICBzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b2RheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9tb3Jyb3dcIjpcbiAgICAgIHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICB9XG4gIHZhbHVlcyA9IFtzdGFydFZhbHVlLCBlbmRWYWx1ZV07XG4gIGlmIChmaWVsZF90eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBfLmZvckVhY2godmFsdWVzLCBmdW5jdGlvbihmdikge1xuICAgICAgaWYgKGZ2KSB7XG4gICAgICAgIHJldHVybiBmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGxhYmVsOiBsYWJlbCxcbiAgICBrZXk6IGtleSxcbiAgICB2YWx1ZXM6IHZhbHVlc1xuICB9O1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIGlmIChmaWVsZF90eXBlICYmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdiZXR3ZWVuJztcbiAgfSBlbHNlIGlmIChbXCJ0ZXh0YXJlYVwiLCBcInRleHRcIiwgXCJjb2RlXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdjb250YWlucyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiPVwiO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICB2YXIgb3BlcmF0aW9ucywgb3B0aW9uYWxzO1xuICBvcHRpb25hbHMgPSB7XG4gICAgZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPVwiXG4gICAgfSxcbiAgICB1bmVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl91bmVxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD5cIlxuICAgIH0sXG4gICAgbGVzc190aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI8XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPlwiXG4gICAgfSxcbiAgICBsZXNzX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD1cIlxuICAgIH0sXG4gICAgZ3JlYXRlcl9vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj49XCJcbiAgICB9LFxuICAgIGNvbnRhaW5zOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSxcbiAgICAgIHZhbHVlOiBcImNvbnRhaW5zXCJcbiAgICB9LFxuICAgIG5vdF9jb250YWluOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9kb2VzX25vdF9jb250YWluXCIpLFxuICAgICAgdmFsdWU6IFwibm90Y29udGFpbnNcIlxuICAgIH0sXG4gICAgc3RhcnRzX3dpdGg6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLFxuICAgICAgdmFsdWU6IFwic3RhcnRzd2l0aFwiXG4gICAgfSxcbiAgICBiZXR3ZWVuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLFxuICAgICAgdmFsdWU6IFwiYmV0d2VlblwiXG4gICAgfVxuICB9O1xuICBpZiAoZmllbGRfdHlwZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscyk7XG4gIH1cbiAgb3BlcmF0aW9ucyA9IFtdO1xuICBpZiAoQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pO1xuICAgIENyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwidGV4dFwiIHx8IGZpZWxkX3R5cGUgPT09IFwidGV4dGFyZWFcIiB8fCBmaWVsZF90eXBlID09PSBcImh0bWxcIiB8fCBmaWVsZF90eXBlID09PSBcImNvZGVcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImN1cnJlbmN5XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMubGVzc190aGFuLCBvcHRpb25hbHMuZ3JlYXRlcl90aGFuLCBvcHRpb25hbHMubGVzc19vcl9lcXVhbCwgb3B0aW9uYWxzLmdyZWF0ZXJfb3JfZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcIlt0ZXh0XVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2Uge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfVxuICByZXR1cm4gb3BlcmF0aW9ucztcbn07XG5cblxuLypcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZmllbGRzLCBmaWVsZHNBcnIsIGZpZWxkc05hbWUsIHJlZjtcbiAgZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDA7XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaCh7XG4gICAgICBuYW1lOiBmaWVsZC5uYW1lLFxuICAgICAgc29ydF9ubzogZmllbGQuc29ydF9ub1xuICAgIH0pO1xuICB9KTtcbiAgZmllbGRzTmFtZSA9IFtdO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBmaWVsZHNOYW1lO1xufTtcbiIsIkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fVxuXG5pbml0VHJpZ2dlciA9IChvYmplY3RfbmFtZSwgdHJpZ2dlciktPlxuXHR0cnlcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRcdGlmICF0cmlnZ2VyLnRvZG9cblx0XHRcdHJldHVyblxuXHRcdHRvZG9XcmFwcGVyID0gKCktPlxuXHRcdFx0ICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWVcblx0XHRcdCAgcmV0dXJuIHRyaWdnZXIudG9kby5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG5cdFx0aWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLmluc2VydFwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/Lmluc2VydCh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLnVwZGF0ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnVwZGF0ZSh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLnJlbW92ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnJlbW92ZSh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIuaW5zZXJ0XCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy5pbnNlcnQodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnVwZGF0ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8udXBkYXRlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5yZW1vdmVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/LnJlbW92ZSh0b2RvV3JhcHBlcilcblx0Y2F0Y2ggZXJyb3Jcblx0XHRjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKVxuXG5jbGVhblRyaWdnZXIgPSAob2JqZWN0X25hbWUpLT5cblx0IyMjXG4gICAgXHTnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWw5piv5L2/55So5LiL5qCH5Yig6Zmk5a+56LGh55qE77yM5omA5Lul5q2k5aSE5Y+N6L2saG9va3Ppm4blkIjlkI7vvIzlho3liKDpmaRcbiAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuXHQjIyNcbiAgICAjVE9ETyDnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWwYnVnXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdPy5yZXZlcnNlKCkuZm9yRWFjaCAoX2hvb2spLT5cblx0XHRfaG9vay5yZW1vdmUoKVxuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IChvYmplY3RfbmFtZSktPlxuI1x0Y29uc29sZS5sb2coJ0NyZWF0b3IuaW5pdFRyaWdnZXJzIG9iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSlcblxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdXG5cblx0Xy5lYWNoIG9iai50cmlnZ2VycywgKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSktPlxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciBhbmQgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXG5cdFx0XHRpZiBfdHJpZ2dlcl9ob29rXG5cdFx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaylcblx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIiBhbmQgdHJpZ2dlci50b2RvIGFuZCB0cmlnZ2VyLndoZW5cblx0XHRcdF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlciBvYmplY3RfbmFtZSwgdHJpZ2dlclxuXHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKSIsInZhciBjbGVhblRyaWdnZXIsIGluaXRUcmlnZ2VyO1xuXG5DcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge307XG5cbmluaXRUcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHRyaWdnZXIpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGVycm9yLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHRvZG9XcmFwcGVyO1xuICB0cnkge1xuICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIGlmICghdHJpZ2dlci50b2RvKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRvZG9XcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZi5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYxID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYxLnVwZGF0ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjIgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjIucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYzID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjMuaW5zZXJ0KHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY0ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjQudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY1ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjUucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgIGVycm9yID0gZXJyb3IxO1xuICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKTtcbiAgfVxufTtcblxuY2xlYW5UcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcblxuICAvKlxuICAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuICAgKi9cbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSkgIT0gbnVsbCA/IHJlZi5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbihfaG9vaykge1xuICAgIHJldHVybiBfaG9vay5yZW1vdmUoKTtcbiAgfSkgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBvYmo7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0gPSBbXTtcbiAgcmV0dXJuIF8uZWFjaChvYmoudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSkge1xuICAgIHZhciBfdHJpZ2dlcl9ob29rO1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgaWYgKF90cmlnZ2VyX2hvb2spIHtcbiAgICAgICAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICByZXR1cm4gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKVxuXG5iYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJhbGxvd0NyZWF0ZVwiLCBcImFsbG93RGVsZXRlXCIsIFwiYWxsb3dFZGl0XCIsIFwiYWxsb3dSZWFkXCIsIFwibW9kaWZ5QWxsUmVjb3Jkc1wiLCBcInZpZXdBbGxSZWNvcmRzXCIsIFwibW9kaWZ5Q29tcGFueVJlY29yZHNcIiwgXCJ2aWV3Q29tcGFueVJlY29yZHNcIiwgXG5cdFwiYWxsb3dSZWFkRmlsZXNcIiwgXCJhbGxvd0VkaXRGaWxlc1wiLCBcImFsbG93Q3JlYXRlRmlsZXNcIiwgXCJhbGxvd0RlbGV0ZUZpbGVzXCIsIFwidmlld0FsbEZpbGVzXCIsIFwibW9kaWZ5QWxsRmlsZXNcIl0gXG5vdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJkaXNhYmxlZF9saXN0X3ZpZXdzXCIsIFwiZGlzYWJsZWRfYWN0aW9uc1wiLCBcInVucmVhZGFibGVfZmllbGRzXCIsIFwidW5lZGl0YWJsZV9maWVsZHNcIiwgXCJ1bnJlbGF0ZWRfb2JqZWN0c1wiLCBcInVuZWRpdGFibGVfcmVsYXRlZF9saXN0XCJdXG5wZXJtaXNzaW9uUHJvcE5hbWVzID0gXy51bmlvbiBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMsIG90aGVyUGVybWlzc2lvblByb3BOYW1lc1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiAhb2JqXG5cdFx0XHRyZXR1cm5cblx0XHRyZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpXG5cdGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGlmICFzcGFjZUlkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFxuXHQjIOmZhOS7tuadg+mZkOS4jeWGjeS4juWFtueItuiusOW9lee8lui+kemFjee9ruWFs+iBlFxuXHQjIGlmIHJlY29yZCBhbmQgb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIiBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdCMgXHQjIOWmguaenOaYr2Ntc19maWxlc+mZhOS7tu+8jOWImeadg+mZkOWPluWFtueItuiusOW9leadg+mZkFxuXHQjIFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJylcblx0IyBcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bor6bnu4bnlYzpnaJcblx0IyBcdFx0b2JqZWN0X25hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcblx0IyBcdFx0cmVjb3JkX2lkID0gcmVjb3JkLnBhcmVudC5faWQ7XG5cdCMgXHRlbHNlIFxuXHQjIFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tueahOeItuiusOW9leeVjOmdolxuXHQjIFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpO1xuXHQjIFx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcblx0IyBcdG9iamVjdF9maWVsZHNfa2V5cyA9IF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/LmZpZWxkcyBvciB7fSkgfHwgW107XG5cdCMgXHRzZWxlY3QgPSBfLmludGVyc2VjdGlvbihvYmplY3RfZmllbGRzX2tleXMsIFsnb3duZXInLCAnY29tcGFueV9pZCcsICdjb21wYW55X2lkcycsICdsb2NrZWQnXSkgfHwgW107XG5cdCMgXHRpZiBzZWxlY3QubGVuZ3RoID4gMFxuXHQjIFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3Quam9pbignLCcpKTtcblx0IyBcdGVsc2Vcblx0IyBcdFx0cmVjb3JkID0gbnVsbDtcblxuXHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSlcblxuXHRpZiByZWNvcmRcblx0XHRpZiAhXy5pc0VtcHR5KHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnMpXG5cdFx0XHRyZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9uc1xuXG5cdFx0aXNPd25lciA9IHJlY29yZC5vd25lciA9PSB1c2VySWQgfHwgcmVjb3JkLm93bmVyPy5faWQgPT0gdXNlcklkXG5cblx0XHRpZiBvYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHQjIOmZhOS7tueahOafpeeci+aJgOacieS/ruaUueaJgOacieadg+mZkOS4jumZhOS7tuWvueixoeeahHZpZXdBbGxSZWNvcmRz44CBbW9kaWZ5QWxsUmVjb3Jkc+aXoOWFs++8jOWPquS4juWFtuS4u+ihqOiusOW9leeahHZpZXdBbGxGaWxlc+WSjG1vZGlmeUFsbEZpbGVz5pyJ5YWzXG5cdFx0XHQjIOWmguaenOaYr2Ntc19maWxlc+mZhOS7tu+8jOWImeadg+mZkOmcgOimgemineWkluiAg+iZkeWFtueItuWvueixoeS4iuWFs+S6jumZhOS7tueahOadg+mZkOmFjee9rlxuXHRcdFx0bWFzdGVyT2JqZWN0TmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuXHRcdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMobWFzdGVyT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHBlcm1pc3Npb25zLmFsbG93RGVsZXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dEZWxldGVGaWxlc1xuXHRcdFx0aWYgIW1hc3RlclJlY29yZFBlcm0ubW9kaWZ5QWxsRmlsZXMgYW5kICFpc093bmVyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHBlcm1pc3Npb25zLmFsbG93UmVhZCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZEZpbGVzXG5cdFx0XHRpZiAhbWFzdGVyUmVjb3JkUGVybS52aWV3QWxsRmlsZXMgYW5kICFpc093bmVyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKVxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQ/LmNvbXBhbnlfaWRcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSBhbmQgcmVjb3JkX2NvbXBhbnlfaWQuX2lkXG5cdFx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWTmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahG9iamVjdO+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxuXHRcdFx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZFxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkPy5jb21wYW55X2lkc1xuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSlcblx0XHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZHPmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahFtvYmplY3Rd77yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XG5cdFx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoKG4pLT4gbi5faWQpXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSlcblx0XHRcdGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcblx0XHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdFxuXHRcdFx0aWYgcmVjb3JkLmxvY2tlZCBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXG5cdFx0XHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcblx0XHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+afpeeci1xuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6K6w5b2V5pyJY29tcGFueV9pZOWxnuaAp++8jOS9huaYr+W9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPkuLrnqbrml7bvvIzorqTkuLrml6DmnYPmn6XnnItcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFxuXHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXG4jIGN1cnJlbnRPYmplY3ROYW1l77ya5b2T5YmN5Li75a+56LGhXG4jIHJlbGF0ZWRMaXN0SXRlbe+8mkNyZWF0b3IuZ2V0UmVsYXRlZExpc3QoU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSwgU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikp5Lit5Y+WcmVsYXRlZF9vYmplY3RfbmFtZeWvueW6lOeahOWAvFxuIyBjdXJyZW50UmVjb3Jk5b2T5YmN5Li75a+56LGh55qE6K+m57uG6K6w5b2VXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Q3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxuXHRcdGlmICFjdXJyZW50T2JqZWN0TmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRcdGlmICFyZWxhdGVkTGlzdEl0ZW1cblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG5cdFx0XHRyZXR1cm4ge31cblxuXHRcdGlmICFjdXJyZW50UmVjb3JkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXG5cblx0XHRpZiAhdXNlcklkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdFx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXG5cdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZClcblx0XHRyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSlcblx0XHRyZXN1bHQgPSBfLmNsb25lIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9uc1xuXG5cdFx0aWYgcmVsYXRlZExpc3RJdGVtLmlzX2ZpbGVcblx0XHRcdHJlc3VsdC5hbGxvd0NyZWF0ZSA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRcdHJlc3VsdC5hbGxvd0VkaXQgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXNcblx0XHRlbHNlXG5cdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRMaXN0SXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB8fCBmYWxzZVxuXHRcdFx0bWFzdGVyQWxsb3cgPSBmYWxzZVxuXHRcdFx0aWYgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT0gdHJ1ZVxuXHRcdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkXG5cdFx0XHRlbHNlIGlmIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09IGZhbHNlXG5cdFx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRcblxuXHRcdFx0dW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSlcblx0XHRcdGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xXG5cblx0XHRcdHJlc3VsdC5hbGxvd0NyZWF0ZSA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlXG5cdFx0XHRyZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlXG5cdFx0cmV0dXJuIHJlc3VsdFxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCkgLT5cblx0XHRwZXJtaXNzaW9ucyA9XG5cdFx0XHRvYmplY3RzOiB7fVxuXHRcdFx0YXNzaWduZWRfYXBwczogW11cblx0XHQjIyNcblx0XHTmnYPpmZDpm4bor7TmmI46XG5cdFx05YaF572u5p2D6ZmQ6ZuGLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxuXHRcdOiHquWumuS5ieadg+mZkOmbhi3mlbDmja7lupPkuK3mlrDlu7rnmoTpmaTlhoXnva7mnYPpmZDpm4bku6XlpJbnmoTlhbbku5bmnYPpmZDpm4Zcblx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxuXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOmbhlxuXHRcdCMjI1xuXG5cdFx0aXNTcGFjZUFkbWluID0gZmFsc2Vcblx0XHRzcGFjZVVzZXIgPSBudWxsXG5cdFx0aWYgdXNlcklkXG5cdFx0XHRpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXG5cdFx0cHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0ZWxzZVxuXHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXG5cdFx0cHNldHNBZG1pbl9wb3MgPSBudWxsXG5cdFx0cHNldHNVc2VyX3BvcyA9IG51bGxcblx0XHRwc2V0c01lbWJlcl9wb3MgPSBudWxsXG5cdFx0cHNldHNHdWVzdF9wb3MgPSBudWxsXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IG51bGxcblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGxcblx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGxcblxuXHRcdGlmIHBzZXRzQWRtaW4/Ll9pZFxuXHRcdFx0cHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNVc2VyPy5faWRcblx0XHRcdHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c01lbWJlcj8uX2lkXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzR3Vlc3Q/Ll9pZFxuXHRcdFx0cHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNTdXBwbGllcj8uX2lkXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c0N1c3RvbWVyPy5faWRcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXG5cdFx0aWYgcHNldHNDdXJyZW50Lmxlbmd0aCA+IDBcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJfaWRcIlxuXHRcdFx0cHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogc2V0X2lkc319KS5mZXRjaCgpXG5cdFx0XHRwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIm5hbWVcIlxuXHRcdHBzZXRzID0ge1xuXHRcdFx0cHNldHNBZG1pbiwgXG5cdFx0XHRwc2V0c1VzZXIsIFxuXHRcdFx0cHNldHNDdXJyZW50LCBcblx0XHRcdHBzZXRzTWVtYmVyLCBcblx0XHRcdHBzZXRzR3Vlc3QsXG5cdFx0XHRwc2V0c1N1cHBsaWVyLFxuXHRcdFx0cHNldHNDdXN0b21lcixcblx0XHRcdGlzU3BhY2VBZG1pbixcblx0XHRcdHNwYWNlVXNlciwgXG5cdFx0XHRwc2V0c0FkbWluX3BvcywgXG5cdFx0XHRwc2V0c1VzZXJfcG9zLCBcblx0XHRcdHBzZXRzTWVtYmVyX3BvcywgXG5cdFx0XHRwc2V0c0d1ZXN0X3Bvcyxcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zLFxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MsXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zXG5cdFx0fVxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX2FwcHMgPSBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpXG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxuXHRcdHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXNcblx0XHRfaSA9IDBcblx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxuXHRcdFx0X2krK1xuXHRcdFx0aWYgIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT0gc3BhY2VJZFxuXHRcdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT0gJzAnICYmIGlzU3BhY2VBZG1pbilcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZClcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cdHVuaW9uUGx1cyA9IChhcnJheSwgb3RoZXIpIC0+XG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0XHRpZiAhYXJyYXlcblx0XHRcdGFycmF5ID0gW11cblx0XHRpZiAhb3RoZXJcblx0XHRcdG90aGVyID0gW11cblx0XHRyZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpXG5cblx0aW50ZXJzZWN0aW9uUGx1cyA9IChhcnJheSwgb3RoZXIpIC0+XG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0XHRpZiAhYXJyYXlcblx0XHRcdGFycmF5ID0gW11cblx0XHRpZiAhb3RoZXJcblx0XHRcdG90aGVyID0gW11cblx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKVxuXG5cdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyA9ICh0YXJnZXQsIHByb3BzKSAtPlxuXHRcdHByb3BOYW1lcyA9IHBlcm1pc3Npb25Qcm9wTmFtZXNcblx0XHRmaWxlc1Byb05hbWVzID0gXG5cdFx0aWYgcHJvcHNcblx0XHRcdF8uZWFjaCBwcm9wTmFtZXMsIChwcm9wTmFtZSkgLT5cblx0XHRcdFx0dGFyZ2V0W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXVxuXG5cdFx0XHQjIHRhcmdldC5hbGxvd0NyZWF0ZSA9IHByb3BzLmFsbG93Q3JlYXRlXG5cdFx0XHQjIHRhcmdldC5hbGxvd0RlbGV0ZSA9IHByb3BzLmFsbG93RGVsZXRlXG5cdFx0XHQjIHRhcmdldC5hbGxvd0VkaXQgPSBwcm9wcy5hbGxvd0VkaXRcblx0XHRcdCMgdGFyZ2V0LmFsbG93UmVhZCA9IHByb3BzLmFsbG93UmVhZFxuXHRcdFx0IyB0YXJnZXQubW9kaWZ5QWxsUmVjb3JkcyA9IHByb3BzLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdCMgdGFyZ2V0LnZpZXdBbGxSZWNvcmRzID0gcHJvcHMudmlld0FsbFJlY29yZHNcblx0XHRcdCMgdGFyZ2V0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcHJvcHMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdCMgdGFyZ2V0LnZpZXdDb21wYW55UmVjb3JkcyA9IHByb3BzLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHByb3BzLmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRcdCMgdGFyZ2V0LmRpc2FibGVkX2FjdGlvbnMgPSBwcm9wcy5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHQjIHRhcmdldC51bnJlYWRhYmxlX2ZpZWxkcyA9IHByb3BzLnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHQjIHRhcmdldC51bmVkaXRhYmxlX2ZpZWxkcyA9IHByb3BzLnVuZWRpdGFibGVfZmllbGRzXG5cdFx0XHQjIHRhcmdldC51bnJlbGF0ZWRfb2JqZWN0cyA9IHByb3BzLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0XHQjIHRhcmdldC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHByb3BzLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XG5cblx0b3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzID0gKHRhcmdldCwgcHJvcHMpIC0+XG5cdFx0cHJvcE5hbWVzID0gYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzXG5cdFx0Xy5lYWNoIHByb3BOYW1lcywgKHByb3BOYW1lKSAtPlxuXHRcdFx0aWYgcHJvcHNbcHJvcE5hbWVdXG5cdFx0XHRcdHRhcmdldFtwcm9wTmFtZV0gPSB0cnVlXG5cdFx0XG5cdFx0IyBpZiBwby5hbGxvd1JlYWRcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdCMgaWYgcG8uYWxsb3dDcmVhdGVcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0VkaXRcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdCMgaWYgcG8uYWxsb3dEZWxldGVcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0IyBpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlXG5cdFx0IyBpZiBwby52aWV3QWxsUmVjb3Jkc1xuXHRcdCMgXHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0XHQjIGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXHRcdCMgaWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblxuXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c1N1cHBsaWVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c0N1c3RvbWVyID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdCMgcHNldHNNZW1iZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHQjIHBzZXRzR3Vlc3QgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0c3BhY2VVc2VyID0gbnVsbDtcblx0XHRpZiB1c2VySWRcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0ZWxzZVxuXHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0YXBwcyA9IFtdXG5cdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHRyZXR1cm4gW11cblx0XHRlbHNlXG5cdFx0XHR1c2VyUHJvZmlsZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KT8ucHJvZmlsZVxuXHRcdFx0cHNldEJhc2UgPSBwc2V0c1VzZXJcblx0XHRcdGlmIHVzZXJQcm9maWxlXG5cdFx0XHRcdGlmIHVzZXJQcm9maWxlID09ICdzdXBwbGllcidcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXJcblx0XHRcdFx0ZWxzZSBpZiB1c2VyUHJvZmlsZSA9PSAnY3VzdG9tZXInXG5cdFx0XHRcdFx0cHNldEJhc2UgPSBwc2V0c0N1c3RvbWVyXG5cdFx0XHRpZiBwc2V0QmFzZT8uYXNzaWduZWRfYXBwcz8ubGVuZ3RoXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHNcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyB1c2Vy5p2D6ZmQ6ZuG5Lit55qEYXNzaWduZWRfYXBwc+ihqOekuuaJgOacieeUqOaIt+WFt+acieeahGFwcHPmnYPpmZDvvIzkuLrnqbrliJnooajnpLrmnInmiYDmnIlhcHBz5p2D6ZmQ77yM5LiN6ZyA6KaB5L2c5p2D6ZmQ5Yik5pat5LqGXG5cdFx0XHRcdHJldHVybiBbXVxuXHRcdFx0Xy5lYWNoIHBzZXRzLCAocHNldCktPlxuXHRcdFx0XHRpZiAhcHNldC5hc3NpZ25lZF9hcHBzXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGlmIHBzZXQubmFtZSA9PSBcImFkbWluXCIgfHwgIHBzZXQubmFtZSA9PSBcInVzZXJcIiB8fCBwc2V0Lm5hbWUgPT0gJ3N1cHBsaWVyJyB8fCBwc2V0Lm5hbWUgPT0gJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdCMg6L+Z6YeM5LmL5omA5Lul6KaB5o6S6ZmkYWRtaW4vdXNlcu+8jOaYr+WboOS4uui/meS4pOS4quadg+mZkOmbhuaYr+aJgOacieadg+mZkOmbhuS4rXVzZXJz5bGe5oCn5peg5pWI55qE5p2D6ZmQ6ZuG77yM54m55oyH5bel5L2c5Yy6566h55CG5ZGY5ZKM5omA5pyJ55So5oi3XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwc1xuXHRcdFx0cmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksdW5kZWZpbmVkLG51bGwpXG5cblx0Q3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRhZG1pbk1lbnVzID0gQ3JlYXRvci5BcHBzLmFkbWluPy5hZG1pbl9tZW51c1xuXHRcdCMg5aaC5p6c5rKh5pyJYWRtaW7oj5zljZXor7TmmI7kuI3pnIDopoHnm7jlhbPlip/og73vvIznm7TmjqXov5Tlm57nqbpcblx0XHR1bmxlc3MgYWRtaW5NZW51c1xuXHRcdFx0cmV0dXJuIFtdXG5cdFx0YWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kIChuKSAtPlxuXHRcdFx0bi5faWQgPT0gJ2Fib3V0J1xuXHRcdGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlciAobikgLT5cblx0XHRcdG4uX2lkICE9ICdhYm91dCdcblx0XHRvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkgXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgKG4pIC0+XG5cdFx0XHRyZXR1cm4gbi5hZG1pbl9tZW51cyBhbmQgbi5faWQgIT0gJ2FkbWluJ1xuXHRcdCksICdzb3J0J1xuXHRcdG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKVxuXHRcdCMg6I+c5Y2V5pyJ5LiJ6YOo5YiG57uE5oiQ77yM6K6+572uQVBQ6I+c5Y2V44CB5YW25LuWQVBQ6I+c5Y2V5Lul5Y+KYWJvdXToj5zljZVcblx0XHRhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pXG5cdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHQjIOW3peS9nOWMuueuoeeQhuWRmOacieWFqOmDqOiPnOWNleWKn+iDvVxuXHRcdFx0cmVzdWx0ID0gYWxsTWVudXNcblx0XHRlbHNlXG5cdFx0XHR1c2VyUHJvZmlsZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KT8ucHJvZmlsZSB8fCAndXNlcidcblx0XHRcdGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAgKG4pIC0+XG5cdFx0XHRcdHJldHVybiBuLm5hbWVcblx0XHRcdG1lbnVzID0gYWxsTWVudXMuZmlsdGVyIChtZW51KS0+XG5cdFx0XHRcdHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzXG5cdFx0XHRcdCMg5aaC5p6c5pmu6YCa55So5oi35pyJ5p2D6ZmQ77yM5YiZ55u05o6l6L+U5ZuedHJ1ZVxuXHRcdFx0XHRpZiBwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YodXNlclByb2ZpbGUpID4gLTFcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0XHQjIOWQpuWImeWPluW9k+WJjeeUqOaIt+eahOadg+mZkOmbhuS4jm1lbnXoj5zljZXopoHmsYLnmoTmnYPpmZDpm4blr7nmr5TvvIzlpoLmnpzkuqTpm4blpKfkuo4x5Liq5YiZ6L+U5ZuedHJ1ZVxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGhcblx0XHRcdHJlc3VsdCA9IG1lbnVzXG5cdFx0XG5cdFx0cmV0dXJuIF8uc29ydEJ5KHJlc3VsdCxcInNvcnRcIilcblxuXHRmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKS0+XG5cblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gXy5maW5kIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XG5cdFx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZH0pXG5cblx0ZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpLT5cblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gXy5maWx0ZXIgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cblx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHBlcm1pc3Npb25fc2V0X2lkc319KS5mZXRjaCgpXG5cblx0dW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IChwb3MsIG9iamVjdCwgcHNldHMpLT5cblx0XHQjIOaKimRi5Y+KeW1s5Lit55qEcGVybWlzc2lvbl9vYmplY3Rz5ZCI5bm277yM5LyY5YWI5Y+WZGLkuK3nmoRcblx0XHRyZXN1bHQgPSBbXVxuXHRcdF8uZWFjaCBvYmplY3QucGVybWlzc2lvbl9zZXQsIChvcHMsIG9wc19rZXkpLT5cblx0XHRcdCMg5oqKeW1s5Lit6Zmk5LqG54m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ6ZuGXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwi5aSW55qE5YW25LuW5a+56LGh5p2D6ZmQ5YWI5a2Y5YWlcmVzdWx0XG5cdFx0XHQjIGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCIsIFwid29ya2Zsb3dfYWRtaW5cIiwgXCJvcmdhbml6YXRpb25fYWRtaW5cIl0uaW5kZXhPZihvcHNfa2V5KSA8IDBcblx0XHRcdGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXG5cdFx0XHRcdGN1cnJlbnRQc2V0ID0gcHNldHMuZmluZCAocHNldCktPiByZXR1cm4gcHNldC5uYW1lID09IG9wc19rZXlcblx0XHRcdFx0aWYgY3VycmVudFBzZXRcblx0XHRcdFx0XHR0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9XG5cdFx0XHRcdFx0dGVtcE9wcy5wZXJtaXNzaW9uX3NldF9pZCA9IGN1cnJlbnRQc2V0Ll9pZFxuXHRcdFx0XHRcdHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZXN1bHQucHVzaCB0ZW1wT3BzXG5cdFx0aWYgcmVzdWx0Lmxlbmd0aFxuXHRcdFx0cG9zLmZvckVhY2ggKHBvKS0+XG5cdFx0XHRcdHJlcGVhdEluZGV4ID0gMFxuXHRcdFx0XHRyZXBlYXRQbyA9IHJlc3VsdC5maW5kKChpdGVtLCBpbmRleCktPiByZXBlYXRJbmRleCA9IGluZGV4O3JldHVybiBpdGVtLnBlcm1pc3Npb25fc2V0X2lkID09IHBvLnBlcm1pc3Npb25fc2V0X2lkKVxuXHRcdFx0XHQjIOWmguaenHltbOS4reW3sue7j+WtmOWcqHBv77yM5YiZ5pu/5o2i5Li65pWw5o2u5bqT5Lit55qEcG/vvIzlj43kuYvliJnmiormlbDmja7lupPkuK3nmoRwb+ebtOaOpee0r+WKoOi/m+WOu1xuXHRcdFx0XHRpZiByZXBlYXRQb1xuXHRcdFx0XHRcdHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwb1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggcG9cblx0XHRcdHJldHVybiByZXN1bHRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gcG9zXG5cblx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKS0+XG5cdFx0cGVybWlzc2lvbnMgPSB7fVxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKVxuXG5cdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09IFwidXNlcnNcIlxuXHRcdFx0cGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cblx0XHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cdFx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblx0XHRwc2V0c0FkbWluID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSBvciB0aGlzLnBzZXRzQWRtaW4gdGhlbiB0aGlzLnBzZXRzQWRtaW4gZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNVc2VyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIG9yIHRoaXMucHNldHNVc2VyIHRoZW4gdGhpcy5wc2V0c1VzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c01lbWJlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIG9yIHRoaXMucHNldHNNZW1iZXIgdGhlbiB0aGlzLnBzZXRzTWVtYmVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c0d1ZXN0ID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSBvciB0aGlzLnBzZXRzR3Vlc3QgdGhlbiB0aGlzLnBzZXRzR3Vlc3QgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxfX0pXG5cblx0XHRwc2V0c1N1cHBsaWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSBvciB0aGlzLnBzZXRzU3VwcGxpZXIgdGhlbiB0aGlzLnBzZXRzU3VwcGxpZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNDdXN0b21lciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgb3IgdGhpcy5wc2V0c0N1c3RvbWVyIHRoZW4gdGhpcy5wc2V0c0N1c3RvbWVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQ7XG5cdFx0aWYgIXBzZXRzXG5cdFx0XHRzcGFjZVVzZXIgPSBudWxsO1xuXHRcdFx0aWYgdXNlcklkXG5cdFx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblxuXHRcdHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3Bvc1xuXHRcdHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3Ncblx0XHRwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3Bvc1xuXHRcdHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3Bvc1xuXG5cdFx0cHNldHNTdXBwbGllcl9wb3MgPSB0aGlzLnBzZXRzU3VwcGxpZXJfcG9zXG5cdFx0cHNldHNDdXN0b21lcl9wb3MgPSB0aGlzLnBzZXRzQ3VzdG9tZXJfcG9zXG5cblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zXG5cblx0XHRvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9XG5cdFx0b3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge31cblx0XHRvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge31cblx0XHRvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XG5cblx0XHRvcHNldFN1cHBsaWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuc3VwcGxpZXIpIHx8IHt9XG5cdFx0b3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fVxuXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF9saXN0dmlld3MnKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzaGFyZWQ6IHRydWV9LCB7ZmllbGRzOntfaWQ6MX19KS5mZXRjaCgpXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBfLnBsdWNrKHNoYXJlZExpc3RWaWV3cyxcIl9pZFwiKVxuXHRcdCMgaWYgc2hhcmVkTGlzdFZpZXdzLmxlbmd0aFxuXHRcdCMgXHR1bmxlc3Mgb3BzZXRBZG1pbi5saXN0X3ZpZXdzXG5cdFx0IyBcdFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gW11cblx0XHQjIFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldEFkbWluLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xuXHRcdCMgXHR1bmxlc3Mgb3BzZXRVc2VyLmxpc3Rfdmlld3Ncblx0XHQjIFx0XHRvcHNldFVzZXIubGlzdF92aWV3cyA9IFtdXG5cdFx0IyBcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldFVzZXIubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXG5cdFx0IyDmlbDmja7lupPkuK3lpoLmnpzphY3nva7kuobpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ6ZuG6K6+572u77yM5bqU6K+l6KaG55uW5Luj56CB5LitYWRtaW4vdXNlcueahOadg+mZkOmbhuiuvue9rlxuXHRcdGlmIHBzZXRzQWRtaW5cblx0XHRcdHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0QWRtaW4sIHBvc0FkbWluXG5cdFx0aWYgcHNldHNVc2VyXG5cdFx0XHRwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldFVzZXIsIHBvc1VzZXJcblx0XHRpZiBwc2V0c01lbWJlclxuXHRcdFx0cG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRNZW1iZXIsIHBvc01lbWJlclxuXHRcdGlmIHBzZXRzR3Vlc3Rcblx0XHRcdHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0R3Vlc3QsIHBvc0d1ZXN0XG5cdFx0aWYgcHNldHNTdXBwbGllclxuXHRcdFx0cG9zU3VwcGxpZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzU3VwcGxpZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNTdXBwbGllci5faWQpO1xuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0U3VwcGxpZXIsIHBvc1N1cHBsaWVyXG5cdFx0aWYgcHNldHNDdXN0b21lclxuXHRcdFx0cG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0Q3VzdG9tZXIsIHBvc0N1c3RvbWVyXG5cblx0XHRpZiAhdXNlcklkXG5cdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cblx0XHRlbHNlXG5cdFx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2NvbW1vbidcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c3BhY2VVc2VyID0gaWYgXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIG9yIHRoaXMuc3BhY2VVc2VyIHRoZW4gdGhpcy5zcGFjZVVzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRcdFx0XHRpZiBzcGFjZVVzZXJcblx0XHRcdFx0XHRcdHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0XHRcdFx0aWYgcHJvZlxuXHRcdFx0XHRcdFx0XHRpZiBwcm9mIGlzICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnbWVtYmVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdndWVzdCdcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Rcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdzdXBwbGllcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdjdXN0b21lcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0Q3VzdG9tZXJcblx0XHRcdFx0XHRcdGVsc2UgIyDmsqHmnIlwcm9maWxl5YiZ6K6k5Li65pivdXNlcuadg+mZkFxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxuXHRcdGlmIHBzZXRzLmxlbmd0aCA+IDBcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzLCBcIl9pZFwiXG5cdFx0XHRwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKVxuXHRcdFx0cG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpXG5cdFx0XHRfLmVhY2ggcG9zLCAocG8pLT5cblx0XHRcdFx0aWYgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNBZG1pbj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1VzZXI/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNNZW1iZXI/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNHdWVzdD8uX2lkIG9yXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzU3VwcGxpZXI/Ll9pZCBvclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0N1c3RvbWVyPy5faWRcblx0XHRcdFx0XHQjIOm7mOiupOeahGFkbWluL3VzZXLmnYPpmZDlgLzlj6rlrp7ooYzkuIrpnaLnmoTpu5jorqTlgLzopobnm5bvvIzkuI3lgZrnrpfms5XliKTmlq1cblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgXy5pc0VtcHR5KHBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gcG9cblx0XHRcdFx0b3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzIHBlcm1pc3Npb25zLCBwb1xuXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpXG5cdFx0XG5cdFx0aWYgb2JqZWN0LmlzX3ZpZXdcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXVxuXHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cblx0XHRpZiBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcblx0XHRcdHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblxuXHQjIENyZWF0b3IuaW5pdFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lKSAtPlxuXG5cdFx0IyAjIOW6lOivpeaKiuiuoeeul+WHuuadpeeahFxuXHRcdCMgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV0uYWxsb3dcblx0XHQjIFx0aW5zZXJ0OiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdCAgICBcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cdFx0IyBcdHVwZGF0ZTogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RWRpdFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblx0XHQjIFx0cmVtb3ZlOiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cblx0TWV0ZW9yLm1ldGhvZHNcblx0XHQjIENhbGN1bGF0ZSBQZXJtaXNzaW9ucyBvbiBTZXJ2ZXJcblx0XHRcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IChzcGFjZUlkKS0+XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZClcbiIsInZhciBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMsIGNsb25lLCBleHRlbmRQZXJtaXNzaW9uUHJvcHMsIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QsIGZpbmRfcGVybWlzc2lvbl9vYmplY3QsIGludGVyc2VjdGlvblBsdXMsIG90aGVyUGVybWlzc2lvblByb3BOYW1lcywgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzLCBwZXJtaXNzaW9uUHJvcE5hbWVzLCB1bmlvblBlcm1pc3Npb25PYmplY3RzLCB1bmlvblBsdXM7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiYWxsb3dDcmVhdGVcIiwgXCJhbGxvd0RlbGV0ZVwiLCBcImFsbG93RWRpdFwiLCBcImFsbG93UmVhZFwiLCBcIm1vZGlmeUFsbFJlY29yZHNcIiwgXCJ2aWV3QWxsUmVjb3Jkc1wiLCBcIm1vZGlmeUNvbXBhbnlSZWNvcmRzXCIsIFwidmlld0NvbXBhbnlSZWNvcmRzXCIsIFwiYWxsb3dSZWFkRmlsZXNcIiwgXCJhbGxvd0VkaXRGaWxlc1wiLCBcImFsbG93Q3JlYXRlRmlsZXNcIiwgXCJhbGxvd0RlbGV0ZUZpbGVzXCIsIFwidmlld0FsbEZpbGVzXCIsIFwibW9kaWZ5QWxsRmlsZXNcIl07XG5cbm90aGVyUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImRpc2FibGVkX2xpc3Rfdmlld3NcIiwgXCJkaXNhYmxlZF9hY3Rpb25zXCIsIFwidW5yZWFkYWJsZV9maWVsZHNcIiwgXCJ1bmVkaXRhYmxlX2ZpZWxkc1wiLCBcInVucmVsYXRlZF9vYmplY3RzXCIsIFwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcIl07XG5cbnBlcm1pc3Npb25Qcm9wTmFtZXMgPSBfLnVuaW9uKGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzKTtcblxuQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIG9iajtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KCk7XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIGlzT3duZXIsIG1hc3Rlck9iamVjdE5hbWUsIG1hc3RlclJlY29yZFBlcm0sIHBlcm1pc3Npb25zLCByZWNvcmRfY29tcGFueV9pZCwgcmVjb3JkX2NvbXBhbnlfaWRzLCByZWYsIHVzZXJfY29tcGFueV9pZHM7XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICB9XG4gIHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKTtcbiAgaWYgKHJlY29yZCkge1xuICAgIGlmICghXy5pc0VtcHR5KHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnMpKSB7XG4gICAgICByZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucztcbiAgICB9XG4gICAgaXNPd25lciA9IHJlY29yZC5vd25lciA9PT0gdXNlcklkIHx8ICgocmVmID0gcmVjb3JkLm93bmVyKSAhPSBudWxsID8gcmVmLl9pZCA6IHZvaWQgMCkgPT09IHVzZXJJZDtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIG1hc3Rlck9iamVjdE5hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcbiAgICAgIG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG1hc3Rlck9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlcztcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RGVsZXRlRmlsZXM7XG4gICAgICBpZiAoIW1hc3RlclJlY29yZFBlcm0ubW9kaWZ5QWxsRmlsZXMgJiYgIWlzT3duZXIpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRGaWxlcztcbiAgICAgIGlmICghbWFzdGVyUmVjb3JkUGVybS52aWV3QWxsRmlsZXMgJiYgIWlzT3duZXIpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgdXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmNvbXBhbnlfaWQgOiB2b2lkIDA7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWQgJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgJiYgcmVjb3JkX2NvbXBhbnlfaWQuX2lkKSB7XG4gICAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkO1xuICAgICAgfVxuICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZHMgOiB2b2lkIDA7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZHNbMF0pKSB7XG4gICAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSk7XG4gICAgICBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlY29yZC5sb2NrZWQgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHVzZXJfY29tcGFueV9pZHMgJiYgdXNlcl9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcGVybWlzc2lvbnM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICAgIHZhciBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUsIG1hc3RlckFsbG93LCBtYXN0ZXJSZWNvcmRQZXJtLCByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMsIHJlc3VsdCwgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgIGlmICghY3VycmVudE9iamVjdE5hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghcmVsYXRlZExpc3RJdGVtKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwicmVsYXRlZExpc3RJdGVtIG11c3Qgbm90IGJlIGVtcHR5IGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zXCIpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAoIWN1cnJlbnRSZWNvcmQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50UmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zKGN1cnJlbnRPYmplY3ROYW1lLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpO1xuICAgIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKTtcbiAgICByZXN1bHQgPSBfLmNsb25lKHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0SXRlbS5pc19maWxlKSB7XG4gICAgICByZXN1bHQuYWxsb3dDcmVhdGUgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzO1xuICAgICAgcmVzdWx0LmFsbG93RWRpdCA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlcztcbiAgICB9IGVsc2Uge1xuICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkTGlzdEl0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfHwgZmFsc2U7XG4gICAgICBtYXN0ZXJBbGxvdyA9IGZhbHNlO1xuICAgICAgaWYgKHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09PSB0cnVlKSB7XG4gICAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWQ7XG4gICAgICB9IGVsc2UgaWYgKHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09PSBmYWxzZSkge1xuICAgICAgICBtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0O1xuICAgICAgfVxuICAgICAgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSk7XG4gICAgICBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMTtcbiAgICAgIHJlc3VsdC5hbGxvd0NyZWF0ZSA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgICAgcmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIF9pLCBpc1NwYWNlQWRtaW4sIHBlcm1pc3Npb25zLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudCwgcHNldHNDdXJyZW50TmFtZXMsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzQ3VzdG9tZXIsIHBzZXRzQ3VzdG9tZXJfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNTdXBwbGllciwgcHNldHNTdXBwbGllcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3Bvcywgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge1xuICAgICAgb2JqZWN0czoge30sXG4gICAgICBhc3NpZ25lZF9hcHBzOiBbXVxuICAgIH07XG5cbiAgICAvKlxuICAgIFx0XHTmnYPpmZDpm4bor7TmmI46XG4gICAgXHRcdOWGhee9ruadg+mZkOmbhi1hZG1pbix1c2VyLG1lbWJlcixndWVzdCx3b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW5cbiAgICBcdFx06Ieq5a6a5LmJ5p2D6ZmQ6ZuGLeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOmbhuS7peWklueahOWFtuS7luadg+mZkOmbhlxuICAgIFx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxuICAgIFx0XHTlj6/phY3nva7nlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+WPr+mFjee9ru+8iS13b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW7ku6Xlj4roh6rlrprkuYnmnYPpmZDpm4ZcbiAgICAgKi9cbiAgICBpc1NwYWNlQWRtaW4gPSBmYWxzZTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW5fcG9zID0gbnVsbDtcbiAgICBwc2V0c1VzZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c01lbWJlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gbnVsbDtcbiAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNDdXN0b21lcl9wb3MgPSBudWxsO1xuICAgIGlmIChwc2V0c0FkbWluICE9IG51bGwgPyBwc2V0c0FkbWluLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c01lbWJlci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0d1ZXN0ICE9IG51bGwgPyBwc2V0c0d1ZXN0Ll9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzU3VwcGxpZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNDdXN0b21lci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1cnJlbnQubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIl9pZFwiKTtcbiAgICAgIHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICAgJGluOiBzZXRfaWRzXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIm5hbWVcIik7XG4gICAgfVxuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnQsXG4gICAgICBwc2V0c01lbWJlcjogcHNldHNNZW1iZXIsXG4gICAgICBwc2V0c0d1ZXN0OiBwc2V0c0d1ZXN0LFxuICAgICAgcHNldHNTdXBwbGllcjogcHNldHNTdXBwbGllcixcbiAgICAgIHBzZXRzQ3VzdG9tZXI6IHBzZXRzQ3VzdG9tZXIsXG4gICAgICBpc1NwYWNlQWRtaW46IGlzU3BhY2VBZG1pbixcbiAgICAgIHNwYWNlVXNlcjogc3BhY2VVc2VyLFxuICAgICAgcHNldHNBZG1pbl9wb3M6IHBzZXRzQWRtaW5fcG9zLFxuICAgICAgcHNldHNVc2VyX3BvczogcHNldHNVc2VyX3BvcyxcbiAgICAgIHBzZXRzTWVtYmVyX3BvczogcHNldHNNZW1iZXJfcG9zLFxuICAgICAgcHNldHNHdWVzdF9wb3M6IHBzZXRzR3Vlc3RfcG9zLFxuICAgICAgcHNldHNTdXBwbGllcl9wb3M6IHBzZXRzU3VwcGxpZXJfcG9zLFxuICAgICAgcHNldHNDdXN0b21lcl9wb3M6IHBzZXRzQ3VzdG9tZXJfcG9zLFxuICAgICAgcHNldHNDdXJyZW50X3BvczogcHNldHNDdXJyZW50X3Bvc1xuICAgIH07XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzO1xuICAgIF9pID0gMDtcbiAgICBfLmVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvYmplY3QsIG9iamVjdF9uYW1lKSB7XG4gICAgICBfaSsrO1xuICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09PSBzcGFjZUlkKSB7XG4gICAgICAgIGlmICghXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT09ICcwJyB8fCAob2JqZWN0LmluX2RldmVsb3BtZW50ICE9PSAnMCcgJiYgaXNTcGFjZUFkbWluKSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKTtcbiAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIHVuaW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBpbnRlcnNlY3Rpb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLmludGVyc2VjdGlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBleHRlbmRQZXJtaXNzaW9uUHJvcHMgPSBmdW5jdGlvbih0YXJnZXQsIHByb3BzKSB7XG4gICAgdmFyIGZpbGVzUHJvTmFtZXMsIHByb3BOYW1lcztcbiAgICBwcm9wTmFtZXMgPSBwZXJtaXNzaW9uUHJvcE5hbWVzO1xuICAgIHJldHVybiBmaWxlc1Byb05hbWVzID0gcHJvcHMgPyBfLmVhY2gocHJvcE5hbWVzLCBmdW5jdGlvbihwcm9wTmFtZSkge1xuICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgfSkgOiB2b2lkIDA7XG4gIH07XG4gIG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcHMpIHtcbiAgICB2YXIgcHJvcE5hbWVzO1xuICAgIHByb3BOYW1lcyA9IGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcztcbiAgICByZXR1cm4gXy5lYWNoKHByb3BOYW1lcywgZnVuY3Rpb24ocHJvcE5hbWUpIHtcbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhcHBzLCBpc1NwYWNlQWRtaW4sIHBzZXRCYXNlLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNDdXN0b21lciwgcHNldHNTdXBwbGllciwgcHNldHNVc2VyLCByZWYsIHJlZjEsIHNwYWNlVXNlciwgdXNlclByb2ZpbGU7XG4gICAgcHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzU3VwcGxpZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICBpZiAodXNlcklkKSB7XG4gICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYXBwcyA9IFtdO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlclByb2ZpbGUgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZi5wcm9maWxlIDogdm9pZCAwO1xuICAgICAgcHNldEJhc2UgPSBwc2V0c1VzZXI7XG4gICAgICBpZiAodXNlclByb2ZpbGUpIHtcbiAgICAgICAgaWYgKHVzZXJQcm9maWxlID09PSAnc3VwcGxpZXInKSB7XG4gICAgICAgICAgcHNldEJhc2UgPSBwc2V0c1N1cHBsaWVyO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXJQcm9maWxlID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgcHNldEJhc2UgPSBwc2V0c0N1c3RvbWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHNldEJhc2UgIT0gbnVsbCA/IChyZWYxID0gcHNldEJhc2UuYXNzaWduZWRfYXBwcykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgXy5lYWNoKHBzZXRzLCBmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgIGlmICghcHNldC5hc3NpZ25lZF9hcHBzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwc2V0Lm5hbWUgPT09IFwiYWRtaW5cIiB8fCBwc2V0Lm5hbWUgPT09IFwidXNlclwiIHx8IHBzZXQubmFtZSA9PT0gJ3N1cHBsaWVyJyB8fCBwc2V0Lm5hbWUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLCB2b2lkIDAsIG51bGwpO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFib3V0TWVudSwgYWRtaW5NZW51cywgYWxsTWVudXMsIGN1cnJlbnRQc2V0TmFtZXMsIGlzU3BhY2VBZG1pbiwgbWVudXMsIG90aGVyTWVudUFwcHMsIG90aGVyTWVudXMsIHBzZXRzLCByZWYsIHJlZjEsIHJlc3VsdCwgdXNlclByb2ZpbGU7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIG5hbWU6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhZG1pbk1lbnVzID0gKHJlZiA9IENyZWF0b3IuQXBwcy5hZG1pbikgIT0gbnVsbCA/IHJlZi5hZG1pbl9tZW51cyA6IHZvaWQgMDtcbiAgICBpZiAoIWFkbWluTWVudXMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgYWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCA9PT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkICE9PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeShfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCBmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5hZG1pbl9tZW51cyAmJiBuLl9pZCAhPT0gJ2FkbWluJztcbiAgICB9KSwgJ3NvcnQnKTtcbiAgICBvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSk7XG4gICAgYWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXN1bHQgPSBhbGxNZW51cztcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlclByb2ZpbGUgPSAoKHJlZjEgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5wcm9maWxlIDogdm9pZCAwKSB8fCAndXNlcic7XG4gICAgICBjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4ubmFtZTtcbiAgICAgIH0pO1xuICAgICAgbWVudXMgPSBhbGxNZW51cy5maWx0ZXIoZnVuY3Rpb24obWVudSkge1xuICAgICAgICB2YXIgcHNldHNNZW51O1xuICAgICAgICBwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0cztcbiAgICAgICAgaWYgKHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZih1c2VyUHJvZmlsZSkgPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aDtcbiAgICAgIH0pO1xuICAgICAgcmVzdWx0ID0gbWVudXM7XG4gICAgfVxuICAgIHJldHVybiBfLnNvcnRCeShyZXN1bHQsIFwic29ydFwiKTtcbiAgfTtcbiAgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbmQocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWRcbiAgICB9KTtcbiAgfTtcbiAgZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcykge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAkaW46IHBlcm1pc3Npb25fc2V0X2lkc1xuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gIH07XG4gIHVuaW9uUGVybWlzc2lvbk9iamVjdHMgPSBmdW5jdGlvbihwb3MsIG9iamVjdCwgcHNldHMpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIHJlc3VsdCA9IFtdO1xuICAgIF8uZWFjaChvYmplY3QucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKG9wcywgb3BzX2tleSkge1xuICAgICAgdmFyIGN1cnJlbnRQc2V0LCB0ZW1wT3BzO1xuICAgICAgaWYgKFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwKSB7XG4gICAgICAgIGN1cnJlbnRQc2V0ID0gcHNldHMuZmluZChmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgICAgcmV0dXJuIHBzZXQubmFtZSA9PT0gb3BzX2tleTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjdXJyZW50UHNldCkge1xuICAgICAgICAgIHRlbXBPcHMgPSBfLmNsb25lKG9wcykgfHwge307XG4gICAgICAgICAgdGVtcE9wcy5wZXJtaXNzaW9uX3NldF9pZCA9IGN1cnJlbnRQc2V0Ll9pZDtcbiAgICAgICAgICB0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgICAgICAgIHJldHVybiByZXN1bHQucHVzaCh0ZW1wT3BzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XG4gICAgICBwb3MuZm9yRWFjaChmdW5jdGlvbihwbykge1xuICAgICAgICB2YXIgcmVwZWF0SW5kZXgsIHJlcGVhdFBvO1xuICAgICAgICByZXBlYXRJbmRleCA9IDA7XG4gICAgICAgIHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICByZXBlYXRJbmRleCA9IGluZGV4O1xuICAgICAgICAgIHJldHVybiBpdGVtLnBlcm1pc3Npb25fc2V0X2lkID09PSBwby5wZXJtaXNzaW9uX3NldF9pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZXBlYXRQbykge1xuICAgICAgICAgIHJldHVybiByZXN1bHRbcmVwZWF0SW5kZXhdID0gcG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHBvKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcG9zO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgaXNTcGFjZUFkbWluLCBvYmplY3QsIG9wc2V0QWRtaW4sIG9wc2V0Q3VzdG9tZXIsIG9wc2V0R3Vlc3QsIG9wc2V0TWVtYmVyLCBvcHNldFN1cHBsaWVyLCBvcHNldFVzZXIsIHBlcm1pc3Npb25zLCBwb3MsIHBvc0FkbWluLCBwb3NDdXN0b21lciwgcG9zR3Vlc3QsIHBvc01lbWJlciwgcG9zU3VwcGxpZXIsIHBvc1VzZXIsIHByb2YsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7fTtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk7XG4gICAgaWYgKHNwYWNlSWQgPT09ICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT09IFwidXNlcnNcIikge1xuICAgICAgcGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge307XG4gICAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIHx8IHRoaXMucHNldHNBZG1pbiA/IHRoaXMucHNldHNBZG1pbiA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSB8fCB0aGlzLnBzZXRzVXNlciA/IHRoaXMucHNldHNVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c01lbWJlciA9IF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIHx8IHRoaXMucHNldHNNZW1iZXIgPyB0aGlzLnBzZXRzTWVtYmVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzR3Vlc3QgPSBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIHx8IHRoaXMucHNldHNHdWVzdCA/IHRoaXMucHNldHNHdWVzdCA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzU3VwcGxpZXIpIHx8IHRoaXMucHNldHNTdXBwbGllciA/IHRoaXMucHNldHNTdXBwbGllciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzQ3VzdG9tZXIpIHx8IHRoaXMucHNldHNDdXN0b21lciA/IHRoaXMucHNldHNDdXN0b21lciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQ7XG4gICAgaWYgKCFwc2V0cykge1xuICAgICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICRvcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3BvcztcbiAgICBwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3BvcztcbiAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3M7XG4gICAgcHNldHNDdXN0b21lcl9wb3MgPSB0aGlzLnBzZXRzQ3VzdG9tZXJfcG9zO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3M7XG4gICAgb3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fTtcbiAgICBvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fTtcbiAgICBvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge307XG4gICAgb3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICBvcHNldFN1cHBsaWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuc3VwcGxpZXIpIHx8IHt9O1xuICAgIG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge307XG4gICAgaWYgKHBzZXRzQWRtaW4pIHtcbiAgICAgIHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldEFkbWluLCBwb3NBZG1pbik7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIpIHtcbiAgICAgIHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldFVzZXIsIHBvc1VzZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIpIHtcbiAgICAgIHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldE1lbWJlciwgcG9zTWVtYmVyKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QpIHtcbiAgICAgIHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldEd1ZXN0LCBwb3NHdWVzdCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1N1cHBsaWVyKSB7XG4gICAgICBwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRTdXBwbGllciwgcG9zU3VwcGxpZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lcikge1xuICAgICAgcG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0Q3VzdG9tZXIsIHBvc0N1c3RvbWVyKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3BhY2VJZCA9PT0gJ2NvbW1vbicpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFjZVVzZXIgPSBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgfHwgdGhpcy5zcGFjZVVzZXIgPyB0aGlzLnNwYWNlVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChzcGFjZVVzZXIpIHtcbiAgICAgICAgICAgIHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZTtcbiAgICAgICAgICAgIGlmIChwcm9mKSB7XG4gICAgICAgICAgICAgIGlmIChwcm9mID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnbWVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2d1ZXN0Jykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnc3VwcGxpZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0Q3VzdG9tZXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0cywgXCJfaWRcIik7XG4gICAgICBwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKTtcbiAgICAgIHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKTtcbiAgICAgIF8uZWFjaChwb3MsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIGlmIChwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pc0VtcHR5KHBlcm1pc3Npb25zKSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gcG87XG4gICAgICAgIH1cbiAgICAgICAgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzKHBlcm1pc3Npb25zLCBwbyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpO1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKTtcbiAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChvYmplY3QuaXNfdmlldykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW107XG4gICAgfVxuICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICBpZiAob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyKSB7XG4gICAgICBwZXJtaXNzaW9ucy5vd25lciA9IG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcjtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgXCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZCk7XG4gICAgfVxuICB9KTtcbn1cbiIsIlxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcblxuTWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SXG5cdG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXG5cdGlmIGNyZWF0b3JfZGJfdXJsXG5cdFx0aWYgIW9wbG9nX3VybFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpXG5cdFx0Q3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge19kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7b3Bsb2dVcmw6IG9wbG9nX3VybH0pfVxuXG5DcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lID0gKG9iamVjdCktPlxuI1x0aWYgb2JqZWN0LnRhYmxlX25hbWUgJiYgb2JqZWN0LnRhYmxlX25hbWUuZW5kc1dpdGgoXCJfX2NcIilcbiNcdFx0cmV0dXJuIG9iamVjdC50YWJsZV9uYW1lXG4jXHRlbHNlXG4jXHRcdHJldHVybiBvYmplY3QubmFtZVxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IChvYmplY3QpLT5cblx0Y29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdClcblx0aWYgZGJbY29sbGVjdGlvbl9rZXldXG5cdFx0cmV0dXJuIGRiW2NvbGxlY3Rpb25fa2V5XVxuXHRlbHNlIGlmIG9iamVjdC5kYlxuXHRcdHJldHVybiBvYmplY3QuZGJcblxuXHRpZiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxuXHRlbHNlXG5cdFx0aWYgb2JqZWN0LmN1c3RvbVxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSlcblx0XHRlbHNlXG5cdFx0XHRpZiBjb2xsZWN0aW9uX2tleSA9PSAnX3Ntc19xdWV1ZScgJiYgU01TUXVldWU/LmNvbGxlY3Rpb25cblx0XHRcdFx0cmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb25cblx0XHRcdHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5KVxuXG5cbiIsInZhciBzdGVlZG9zQ29yZTtcblxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJyk7XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRvcl9kYl91cmwsIG9wbG9nX3VybDtcbiAgY3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUjtcbiAgb3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1I7XG4gIGlmIChjcmVhdG9yX2RiX3VybCkge1xuICAgIGlmICghb3Bsb2dfdXJsKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIik7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7XG4gICAgICBfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge1xuICAgICAgICBvcGxvZ1VybDogb3Bsb2dfdXJsXG4gICAgICB9KVxuICAgIH07XG4gIH1cbn0pO1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgY29sbGVjdGlvbl9rZXk7XG4gIGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpO1xuICBpZiAoZGJbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIGRiW2NvbGxlY3Rpb25fa2V5XTtcbiAgfSBlbHNlIGlmIChvYmplY3QuZGIpIHtcbiAgICByZXR1cm4gb2JqZWN0LmRiO1xuICB9XG4gIGlmIChDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0LmN1c3RvbSkge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb2xsZWN0aW9uX2tleSA9PT0gJ19zbXNfcXVldWUnICYmICh0eXBlb2YgU01TUXVldWUgIT09IFwidW5kZWZpbmVkXCIgJiYgU01TUXVldWUgIT09IG51bGwgPyBTTVNRdWV1ZS5jb2xsZWN0aW9uIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm4gU01TUXVldWUuY29sbGVjdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5KTtcbiAgICB9XG4gIH1cbn07XG4iLCJDcmVhdG9yLmFjdGlvbnNCeU5hbWUgPSB7fVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0IyDlrprkuYnlhajlsYAgYWN0aW9ucyDlh73mlbBcdFxuXHRDcmVhdG9yLmFjdGlvbnMgPSAoYWN0aW9ucyktPlxuXHRcdF8uZWFjaCBhY3Rpb25zLCAodG9kbywgYWN0aW9uX25hbWUpLT5cblx0XHRcdENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvIFxuXG5cdENyZWF0b3IuZXhlY3V0ZUFjdGlvbiA9IChvYmplY3RfbmFtZSwgYWN0aW9uLCByZWNvcmRfaWQsIGl0ZW1fZWxlbWVudCwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxiYWNrKS0+XG5cdFx0aWYgYWN0aW9uICYmIGFjdGlvbi50eXBlID09ICd3b3JkLXByaW50J1xuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdGZpbHRlcnMgPSBbJ19pZCcsICc9JywgcmVjb3JkX2lkXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmaWx0ZXJzID0gT2JqZWN0R3JpZC5nZXRGaWx0ZXJzKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGZhbHNlLCBudWxsLCBudWxsKVxuXHRcdFx0dXJsID0gXCIvYXBpL3Y0L3dvcmRfdGVtcGxhdGVzL1wiICsgYWN0aW9uLndvcmRfdGVtcGxhdGUgKyBcIi9wcmludFwiICsgXCI/ZmlsdGVycz1cIiArIFN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkoZmlsdGVycyk7XG5cdFx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG5cdFx0XHRyZXR1cm4gd2luZG93Lm9wZW4odXJsKTtcblxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmIGFjdGlvbj8udG9kb1xuXHRcdFx0aWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwic3RyaW5nXCJcblx0XHRcdFx0dG9kbyA9IENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb24udG9kb11cblx0XHRcdGVsc2UgaWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHR0b2RvID0gYWN0aW9uLnRvZG9cdFxuXHRcdFx0aWYgIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWRcblx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdGlmIHRvZG9cblx0XHRcdFx0IyBpdGVtX2VsZW1lbnTkuLrnqbrml7blupTor6Xorr7nva7pu5jorqTlgLzvvIjlr7nosaHnmoRuYW1l5a2X5q6177yJ77yM5ZCm5YiZbW9yZUFyZ3Pmi7/liLDnmoTlkI7nu63lj4LmlbDkvY3nva7lsLHkuI3lr7lcblx0XHRcdFx0aXRlbV9lbGVtZW50ID0gaWYgaXRlbV9lbGVtZW50IHRoZW4gaXRlbV9lbGVtZW50IGVsc2UgXCJcIlxuXHRcdFx0XHRtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMylcblx0XHRcdFx0dG9kb0FyZ3MgPSBbb2JqZWN0X25hbWUsIHJlY29yZF9pZF0uY29uY2F0KG1vcmVBcmdzKVxuXHRcdFx0XHR0b2RvLmFwcGx5IHtcblx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZWNvcmRfaWQ6IHJlY29yZF9pZFxuXHRcdFx0XHRcdG9iamVjdDogb2JqXG5cdFx0XHRcdFx0YWN0aW9uOiBhY3Rpb25cblx0XHRcdFx0XHRpdGVtX2VsZW1lbnQ6IGl0ZW1fZWxlbWVudFxuXHRcdFx0XHRcdHJlY29yZDogcmVjb3JkXG5cdFx0XHRcdH0sIHRvZG9BcmdzXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKVxuXHRcdGVsc2Vcblx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKVxuXG5cblx0X2RlbGV0ZVJlY29yZCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2ssIGNhbGxfYmFja19lcnJvciktPlxuXHRcdCMgY29uc29sZS5sb2coXCI9PT1fZGVsZXRlUmVjb3JkPT09XCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaywgY2FsbF9iYWNrX2Vycm9yKTtcblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRwcmV2aW91c0RvYyA9IEZvcm1NYW5hZ2VyLmdldFByZXZpb3VzRG9jKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICdkZWxldGUnKVxuXHRcdENyZWF0b3Iub2RhdGEuZGVsZXRlIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICgpLT5cblx0XHRcdGlmIHJlY29yZF90aXRsZVxuXHRcdFx0XHQjIGluZm8gPSBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCIgKyBcIuW3suWIoOmZpFwiXG5cdFx0XHRcdGluZm8gPXQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKVxuXHRcdFx0dG9hc3RyLnN1Y2Nlc3MgaW5mb1xuXHRcdFx0aWYgY2FsbF9iYWNrIGFuZCB0eXBlb2YgY2FsbF9iYWNrID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRjYWxsX2JhY2soKVxuXG5cdFx0XHRGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2FmdGVyJywge19pZDogcmVjb3JkX2lkLCBwcmV2aW91c0RvYzogcHJldmlvdXNEb2N9KVxuXHRcdCwgKGVycm9yKS0+XG5cdFx0XHRpZiBjYWxsX2JhY2tfZXJyb3IgYW5kIHR5cGVvZiBjYWxsX2JhY2tfZXJyb3IgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdGNhbGxfYmFja19lcnJvcigpXG5cdFx0XHRGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2Vycm9yJywge19pZDogcmVjb3JkX2lkLCBlcnJvcjogZXJyb3J9KVxuXG5cdENyZWF0b3IucmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3ID0gKHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRyZWxhdGVPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKVxuXHRcdGNvbGxlY3Rpb25fbmFtZSA9IHJlbGF0ZU9iamVjdC5sYWJlbFxuXHRcdGNvbGxlY3Rpb24gPSBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKS5fY29sbGVjdGlvbl9uYW1lfVwiXG5cdFx0Y3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0aWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbcmVsYXRlZF9vYmplY3RfbmFtZV1cblx0XHRpbml0aWFsVmFsdWVzID0ge307XG5cdFx0aWYgaWRzPy5sZW5ndGhcblx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXG5cdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxuXHRcdFx0cmVjb3JkX2lkID0gaWRzWzBdXG5cdFx0XHRkb2MgPSBDcmVhdG9yLm9kYXRhLmdldChyZWxhdGVkX29iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRpbml0aWFsVmFsdWVzID0gZG9jXG5cdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcblx0XHRlbHNlXG5cdFx0XHRkZWZhdWx0RG9jID0gRm9ybU1hbmFnZXIuZ2V0UmVsYXRlZEluaXRpYWxWYWx1ZXMoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuXHRcdFx0aWYgIV8uaXNFbXB0eShkZWZhdWx0RG9jKVxuXHRcdFx0XHRpbml0aWFsVmFsdWVzID0gZGVmYXVsdERvY1xuXHRcdGlmIHJlbGF0ZU9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRyZXR1cm4gU3RlZWRvc1VJLnNob3dNb2RhbChzdG9yZXMuQ29tcG9uZW50UmVnaXN0cnkuY29tcG9uZW50cy5PYmplY3RGb3JtLCB7XG5cdFx0XHRcdG5hbWU6IFwiI3tyZWxhdGVkX29iamVjdF9uYW1lfV9zdGFuZGFyZF9uZXdfZm9ybVwiLFxuXHRcdFx0XHRvYmplY3RBcGlOYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuXHRcdFx0XHR0aXRsZTogJ+aWsOW7uiAnICsgcmVsYXRlT2JqZWN0LmxhYmVsLFxuXHRcdFx0XHRpbml0aWFsVmFsdWVzOiBpbml0aWFsVmFsdWVzLFxuXHRcdFx0XHRhZnRlckluc2VydDogKHJlc3VsdCktPlxuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCktPlxuXHRcdFx0XHRcdFx0IyBPYmplY3RGb3Jt5pyJ57yT5a2Y77yM5paw5bu65a2Q6KGo6K6w5b2V5Y+v6IO95Lya5pyJ5rGH5oC75a2X5q6177yM6ZyA6KaB5Yi35paw6KGo5Y2V5pWw5o2uXG5cdFx0XHRcdFx0XHRpZiBDcmVhdG9yLmdldE9iamVjdChjdXJyZW50X29iamVjdF9uYW1lKS52ZXJzaW9uID4gMVxuXHRcdFx0XHRcdFx0XHRTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKTtcblx0XHRcdFx0XHQsIDEpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSwgbnVsbCwge2ljb25QYXRoOiAnL2Fzc2V0cy9pY29ucyd9KVxuXG5cblx0XHRpZiBpZHM/Lmxlbmd0aFxuXHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cblx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XG5cdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXG5cdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcblx0XHRlbHNlXG5cdFx0XHRpZiAhXy5pc0VtcHR5KGluaXRpYWxWYWx1ZXMpXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblxuXHRcdFNlc3Npb24uc2V0KFwiYWN0aW9uX2ZpZWxkc1wiLCB1bmRlZmluZWQpXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fY29sbGVjdGlvblwiLCBjb2xsZWN0aW9uKVxuXHRcdFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25fbmFtZVwiLCBjb2xsZWN0aW9uX25hbWUpXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fc2F2ZV9hbmRfaW5zZXJ0XCIsIGZhbHNlKVxuXHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHQkKFwiLmNyZWF0b3ItYWRkLXJlbGF0ZWRcIikuY2xpY2soKVxuXHRcdHJldHVyblxuXG5cdENyZWF0b3IuYWN0aW9ucyBcblx0XHQjIOWcqOatpOWumuS5ieWFqOWxgCBhY3Rpb25zXG5cdFx0XCJzdGFuZGFyZF9xdWVyeVwiOiAoKS0+XG5cdFx0XHRNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIilcblxuXHRcdFwic3RhbmRhcmRfbmV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdCMgY3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRcdFx0IyBpZiBjdXJyZW50X3JlY29yZF9pZFxuXHRcdFx0IyBcdCMgYW1pcyDnm7jlhbPlrZDooajlj7PkuIrop5LmlrDlu7pcblx0XHRcdCMgXHRDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyhvYmplY3RfbmFtZSlcblx0XHRcdCMgXHRyZXR1cm4gXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG5cdFx0XHRncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuXHRcdFx0aXNSZWxhdGVkID0gdGhpcy5hY3Rpb24uaXNSZWxhdGVkO1xuXHRcdFx0aWYgaXNSZWxhdGVkXG5cdFx0XHRcdHJlbGF0ZWRGaWVsZE5hbWUgPSB0aGlzLmFjdGlvbi5yZWxhdGVkRmllbGROYW1lO1xuXHRcdFx0XHRtYXN0ZXJSZWNvcmRJZCA9IHRoaXMuYWN0aW9uLm1hc3RlclJlY29yZElkO1xuXHRcdFx0XHRpbml0aWFsVmFsdWVzID0gdGhpcy5hY3Rpb24uaW5pdGlhbFZhbHVlc1xuXHRcdFx0XHRpZiAhaW5pdGlhbFZhbHVlc1xuXHRcdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSB7fTtcblx0XHRcdFx0XHRpbml0aWFsVmFsdWVzW3JlbGF0ZWRGaWVsZE5hbWVdID0gbWFzdGVyUmVjb3JkSWRcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5pdGlhbFZhbHVlcz17fVxuXHRcdFx0XHRpZihncmlkTmFtZSlcblx0XHRcdFx0XHRzZWxlY3RlZFJvd3MgPSB3aW5kb3cuZ3JpZFJlZnM/W2dyaWROYW1lXS5jdXJyZW50Py5hcGk/LmdldFNlbGVjdGVkUm93cygpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzZWxlY3RlZFJvd3MgPSB3aW5kb3cuZ3JpZFJlZj8uY3VycmVudD8uYXBpPy5nZXRTZWxlY3RlZFJvd3MoKVx0XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBzZWxlY3RlZFJvd3M/Lmxlbmd0aFxuXHRcdFx0XHRcdHJlY29yZF9pZCA9IHNlbGVjdGVkUm93c1swXS5faWQ7XG5cdFx0XHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdFx0XHRpbml0aWFsVmFsdWVzID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IEZvcm1NYW5hZ2VyLmdldEluaXRpYWxWYWx1ZXMob2JqZWN0X25hbWUpXG5cblx0XHRcdGlmIG9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRcdHJldHVybiBTdGVlZG9zLlBhZ2UuRm9ybS5TdGFuZGFyZE5ldy5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCB0KCdOZXcnKSArICcgJyArIG9iamVjdC5sYWJlbCwgaW5pdGlhbFZhbHVlcyAsIHtncmlkTmFtZTogZ3JpZE5hbWV9KTtcblx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxuXHRcdFx0aWYgc2VsZWN0ZWRSb3dzPy5sZW5ndGhcblx0XHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cblx0XHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXHRcdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXG5cdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0XHQkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKClcblx0XHRcdHJldHVybiBcblxuXHRcdFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0Rmxvd1JvdXRlci5yZWRpcmVjdChocmVmKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcInN0YW5kYXJkX2VkaXRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcblx0XHRcdFx0aWYgb2JqZWN0Py52ZXJzaW9uID49IDJcblx0XHRcdFx0XHRyZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmRFZGl0LnJlbmRlcihTZXNzaW9uLmdldChcImFwcF9pZFwiKSwgb2JqZWN0X25hbWUsIHQoJ0VkaXQnKSArICcgJyArIG9iamVjdC5sYWJlbCwgcmVjb3JkX2lkLCB7XG5cdFx0XHRcdFx0XHRncmlkTmFtZTogdGhpcy5hY3Rpb24uZ3JpZE5hbWVcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2VcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcbiNcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgcmVjb3JkXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdyZWxvYWRfZHhsaXN0JywgZmFsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdFx0XHQkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcblxuXHRcdFwic3RhbmRhcmRfZGVsZXRlXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spLT5cblx0XHRcdGdyaWROYW1lID0gdGhpcy5hY3Rpb24uZ3JpZE5hbWU7XG5cdFx0XHQjIGNvbnNvbGUubG9nKFwiPT09c3RhbmRhcmRfZGVsZXRlPT09XCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjayk7XG5cdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0YmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge19pZDogcmVjb3JkX2lkfSlcblx0XHRcdFx0aWYgIWJlZm9yZUhvb2tcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRcdG5hbWVGaWVsZCA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWSB8fCBcIm5hbWVcIlxuXG5cdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXG5cdFx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXG5cdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXG5cdFx0XHRcdGxpc3Rfdmlld19pZCA9IFwiYWxsXCJcblxuXHRcdFx0aWYoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiByZWNvcmRfdGl0bGUpXG5cdFx0XHRcdHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZVtuYW1lRmllbGRdXG5cdFx0XHRcblx0XHRcdGlmIHJlY29yZCAmJiAhcmVjb3JkX3RpdGxlXG5cdFx0XHRcdHJlY29yZF90aXRsZSA9IHJlY29yZFtuYW1lRmllbGRdXG5cdFx0XHRcblx0XHRcdGkxOG5UaXRsZUtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVcIlxuXHRcdFx0aTE4blRleHRLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIlxuXG5cdFx0XHR1bmxlc3MgcmVjb3JkX2lkXG5cdFx0XHRcdGkxOG5UaXRsZUtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90aXRsZVwiXG5cdFx0XHRcdGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RleHRcIlxuXG5cdFx0XHRcdCMg5aaC5p6c5piv5om56YeP5Yig6Zmk77yM5YiZ5Lyg5YWl55qEbGlzdF92aWV3X2lk5Li65YiX6KGo6KeG5Zu+55qEbmFtZe+8jOeUqOS6juiOt+WPluWIl+ihqOmAieS4remhuVxuXHRcdFx0XHQjIOS4u+WIl+ihqOinhOWImeaYr1wibGlzdHZpZXdfI3tvYmplY3RfbmFtZX1fI3tsaXN0X3ZpZXdfaWR9XCLvvIznm7jlhbPooajop4TliJnmmK9cInJlbGF0ZWRfbGlzdHZpZXdfI3tvYmplY3RfbmFtZX1fI3tyZWxhdGVkX29iamVjdF9uYW1lfV8je3JlbGF0ZWRfZmllbGRfbmFtZX1cIlxuXHRcdFx0XHRzZWxlY3RlZFJlY29yZHMgPSBTdGVlZG9zVUkuZ2V0VGFibGVTZWxlY3RlZFJvd3MoZ3JpZE5hbWUgfHwgbGlzdF92aWV3X2lkKVxuXHRcdFx0XHRpZiAhc2VsZWN0ZWRSZWNvcmRzIHx8ICFzZWxlY3RlZFJlY29yZHMubGVuZ3RoXG5cdFx0XHRcdFx0dG9hc3RyLndhcm5pbmcodChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X25vX3NlbGVjdGlvblwiKSlcblx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0aWYgcmVjb3JkX3RpdGxlXG5cdFx0XHRcdHRleHQgPSB0IGkxOG5UZXh0S2V5LCBcIiN7b2JqZWN0LmxhYmVsfSBcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRleHQgPSB0IGkxOG5UZXh0S2V5LCBcIiN7b2JqZWN0LmxhYmVsfVwiXG5cdFx0XHRzd2FsXG5cdFx0XHRcdHRpdGxlOiB0IGkxOG5UaXRsZUtleSwgXCIje29iamVjdC5sYWJlbH1cIlxuXHRcdFx0XHR0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPiN7dGV4dH08L2Rpdj5cIlxuXHRcdFx0XHRodG1sOiB0cnVlXG5cdFx0XHRcdHNob3dDYW5jZWxCdXR0b246dHJ1ZVxuXHRcdFx0XHRjb25maXJtQnV0dG9uVGV4dDogdCgnRGVsZXRlJylcblx0XHRcdFx0Y2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcblx0XHRcdFx0KG9wdGlvbikgLT5cblx0XHRcdFx0XHRpZiBvcHRpb25cblx0XHRcdFx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRcdFx0XHQjIOWNleadoeiusOW9leWIoOmZpFxuXHRcdFx0XHRcdFx0XHRfZGVsZXRlUmVjb3JkIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsICgpLT5cblx0XHRcdFx0XHRcdFx0XHQjIOaWh+S7tueJiOacrOS4ulwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIu+8jOmcgOimgeabv+aNouS4ulwiY2ZzLWZpbGVzLWZpbGVyZWNvcmRcIlxuXHRcdFx0XHRcdFx0XHRcdGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZyxcIi1cIilcblx0XHRcdFx0XHRcdFx0XHRncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcblx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgZ3JpZENvbnRhaW5lcj8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiB3aW5kb3cub3BlbmVyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzT3BlbmVyUmVtb3ZlID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcblx0XHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRcdCMgT2JqZWN0Rm9ybeaciee8k+WtmO+8jOWIoOmZpOWtkOihqOiusOW9leWPr+iDveS8muacieaxh+aAu+Wtl+aute+8jOmcgOimgeWIt+aWsOihqOWNleaVsOaNrlxuXHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGN1cnJlbnRfb2JqZWN0X25hbWUgJiYgQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSk/LnZlcnNpb24gPiAxXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFN0ZWVkb3NVSS5yZWxvYWRSZWNvcmQoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBGbG93Um91dGVyLmN1cnJlbnQoKS5yb3V0ZS5wYXRoLmVuZHNXaXRoKFwiLzpyZWNvcmRfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0X25hbWUgIT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG5cdFx0XHRcdFx0XHRcdFx0Y2F0Y2ggX2Vcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoX2UpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIGdyaWRDb250YWluZXI/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJylcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKVxuXHRcdFx0XHRcdFx0XHRcdGlmIGR4RGF0YUdyaWRJbnN0YW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0X25hbWUgIT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMgZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIFx0VGVtcGxhdGUuY3JlYXRvcl9ncmlkLnJlZnJlc2goZHhEYXRhR3JpZEluc3RhbmNlKVxuXHRcdFx0XHRcdFx0XHRcdHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0dGVtcE5hdlJlbW92ZWQgPSBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpICPml6DorrrmmK/lnKjorrDlvZXor6bnu4bnlYzpnaLov5jmmK/liJfooajnlYzpnaLmiafooYzliKDpmaTmk43kvZzvvIzpg73kvJrmiorkuLTml7blr7zoiKrliKDpmaTmjolcblx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZSBvciAhZHhEYXRhR3JpZEluc3RhbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuY2xvc2UoKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgYW5kIGxpc3Rfdmlld19pZCAhPSAnY2FsZW5kYXInXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIHRlbXBOYXZSZW1vdmVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpznoa7lrp7liKDpmaTkuobkuLTml7blr7zoiKrvvIzlsLHlj6/og73lt7Lnu4/ph43lrprlkJHliLDkuIrkuIDkuKrpobXpnaLkuobvvIzmsqHlv4XopoHlho3ph43lrprlkJHkuIDmrKFcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLmdvIFwiL2FwcC8je2FwcGlkfS8je29iamVjdF9uYW1lfS9ncmlkLyN7bGlzdF92aWV3X2lkfVwiXG5cdFx0XHRcdFx0XHRcdFx0aWYgY2FsbF9iYWNrIGFuZCB0eXBlb2YgY2FsbF9iYWNrID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FsbF9iYWNrKClcdFx0XHRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0IyDmibnph4/liKDpmaRcblx0XHRcdFx0XHRcdFx0aWYgc2VsZWN0ZWRSZWNvcmRzICYmIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImxvYWRpbmdcIilcblx0XHRcdFx0XHRcdFx0XHRkZWxldGVDb3VudGVyID0gMDtcblx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUgPSAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxldGVDb3VudGVyKytcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGRlbGV0ZUNvdW50ZXIgPj0gc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIGNvbnNvbGUubG9nKFwiZGVsZXRlQ291bnRlciwgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aD09PVwiLCBkZWxldGVDb3VudGVyLCBzZWxlY3RlZFJlY29yZHMubGVuZ3RoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJsb2FkaW5nXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZWN0ZWRSZWNvcmRzLmZvckVhY2ggKHJlY29yZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2lkID0gcmVjb3JkLl9pZFxuXHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge19pZDogcmVjb3JkX2lkfSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmICFiZWZvcmVIb29rXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFmdGVyQmF0Y2hlc0RlbGV0ZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZFRpdGxlID0gcmVjb3JkW25hbWVGaWVsZF0gfHwgcmVjb3JkX2lkXG5cdFx0XHRcdFx0XHRcdFx0XHRfZGVsZXRlUmVjb3JkIG9iamVjdF9uYW1lLCByZWNvcmQuX2lkLCByZWNvcmRUaXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsICgoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCkgI+aXoOiuuuaYr+WcqOiusOW9leivpue7hueVjOmdoui/mOaYr+WIl+ihqOeVjOmdouaJp+ihjOWIoOmZpOaTjeS9nO+8jOmDveS8muaKiuS4tOaXtuWvvOiIquWIoOmZpOaOiVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKVxuXHRcdFx0XHRcdFx0XHRcdFx0KSwgKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKSIsInZhciBfZGVsZXRlUmVjb3JkO1xuXG5DcmVhdG9yLmFjdGlvbnNCeU5hbWUgPSB7fTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmFjdGlvbnMgPSBmdW5jdGlvbihhY3Rpb25zKSB7XG4gICAgcmV0dXJuIF8uZWFjaChhY3Rpb25zLCBmdW5jdGlvbih0b2RvLCBhY3Rpb25fbmFtZSkge1xuICAgICAgcmV0dXJuIENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmV4ZWN1dGVBY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgYWN0aW9uLCByZWNvcmRfaWQsIGl0ZW1fZWxlbWVudCwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGZpbHRlcnMsIG1vcmVBcmdzLCBvYmosIHRvZG8sIHRvZG9BcmdzLCB1cmw7XG4gICAgaWYgKGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gJ3dvcmQtcHJpbnQnKSB7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGZpbHRlcnMgPSBbJ19pZCcsICc9JywgcmVjb3JkX2lkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbHRlcnMgPSBPYmplY3RHcmlkLmdldEZpbHRlcnMob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZmFsc2UsIG51bGwsIG51bGwpO1xuICAgICAgfVxuICAgICAgdXJsID0gXCIvYXBpL3Y0L3dvcmRfdGVtcGxhdGVzL1wiICsgYWN0aW9uLndvcmRfdGVtcGxhdGUgKyBcIi9wcmludFwiICsgXCI/ZmlsdGVycz1cIiArIFN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkoZmlsdGVycyk7XG4gICAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG4gICAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsKTtcbiAgICB9XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwKSB7XG4gICAgICBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRvZG8gPSBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uLnRvZG9dO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uLnRvZG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0b2RvID0gYWN0aW9uLnRvZG87XG4gICAgICB9XG4gICAgICBpZiAoIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWQpIHtcbiAgICAgICAgcmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICB9XG4gICAgICBpZiAodG9kbykge1xuICAgICAgICBpdGVtX2VsZW1lbnQgPSBpdGVtX2VsZW1lbnQgPyBpdGVtX2VsZW1lbnQgOiBcIlwiO1xuICAgICAgICBtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG4gICAgICAgIHRvZG9BcmdzID0gW29iamVjdF9uYW1lLCByZWNvcmRfaWRdLmNvbmNhdChtb3JlQXJncyk7XG4gICAgICAgIHJldHVybiB0b2RvLmFwcGx5KHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgICAgcmVjb3JkX2lkOiByZWNvcmRfaWQsXG4gICAgICAgICAgb2JqZWN0OiBvYmosXG4gICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgaXRlbV9lbGVtZW50OiBpdGVtX2VsZW1lbnQsXG4gICAgICAgICAgcmVjb3JkOiByZWNvcmRcbiAgICAgICAgfSwgdG9kb0FyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKTtcbiAgICB9XG4gIH07XG4gIF9kZWxldGVSZWNvcmQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2ssIGNhbGxfYmFja19lcnJvcikge1xuICAgIHZhciBvYmplY3QsIHByZXZpb3VzRG9jO1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBwcmV2aW91c0RvYyA9IEZvcm1NYW5hZ2VyLmdldFByZXZpb3VzRG9jKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICdkZWxldGUnKTtcbiAgICByZXR1cm4gQ3JlYXRvci5vZGF0YVtcImRlbGV0ZVwiXShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpbmZvO1xuICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICBpbmZvID0gdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyAoXCJcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5mbyA9IHQoJ2NyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3N1YycpO1xuICAgICAgfVxuICAgICAgdG9hc3RyLnN1Y2Nlc3MoaW5mbyk7XG4gICAgICBpZiAoY2FsbF9iYWNrICYmIHR5cGVvZiBjYWxsX2JhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsX2JhY2soKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2FmdGVyJywge1xuICAgICAgICBfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgcHJldmlvdXNEb2M6IHByZXZpb3VzRG9jXG4gICAgICB9KTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgaWYgKGNhbGxfYmFja19lcnJvciAmJiB0eXBlb2YgY2FsbF9iYWNrX2Vycm9yID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbF9iYWNrX2Vycm9yKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdlcnJvcicsIHtcbiAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IucmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3ID0gZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgIHZhciBjb2xsZWN0aW9uLCBjb2xsZWN0aW9uX25hbWUsIGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkLCBkZWZhdWx0RG9jLCBkb2MsIGlkcywgaW5pdGlhbFZhbHVlcywgcmVjb3JkX2lkLCByZWxhdGVPYmplY3Q7XG4gICAgcmVsYXRlT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgY29sbGVjdGlvbl9uYW1lID0gcmVsYXRlT2JqZWN0LmxhYmVsO1xuICAgIGNvbGxlY3Rpb24gPSBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuXCIgKyAoQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSkuX2NvbGxlY3Rpb25fbmFtZSk7XG4gICAgY3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgY3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgICBpZHMgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkc1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICBpbml0aWFsVmFsdWVzID0ge307XG4gICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgcmVjb3JkX2lkID0gaWRzWzBdO1xuICAgICAgZG9jID0gQ3JlYXRvci5vZGF0YS5nZXQocmVsYXRlZF9vYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIGluaXRpYWxWYWx1ZXMgPSBkb2M7XG4gICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHREb2MgPSBGb3JtTWFuYWdlci5nZXRSZWxhdGVkSW5pdGlhbFZhbHVlcyhjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIV8uaXNFbXB0eShkZWZhdWx0RG9jKSkge1xuICAgICAgICBpbml0aWFsVmFsdWVzID0gZGVmYXVsdERvYztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKChyZWxhdGVPYmplY3QgIT0gbnVsbCA/IHJlbGF0ZU9iamVjdC52ZXJzaW9uIDogdm9pZCAwKSA+PSAyKSB7XG4gICAgICByZXR1cm4gU3RlZWRvc1VJLnNob3dNb2RhbChzdG9yZXMuQ29tcG9uZW50UmVnaXN0cnkuY29tcG9uZW50cy5PYmplY3RGb3JtLCB7XG4gICAgICAgIG5hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgKyBcIl9zdGFuZGFyZF9uZXdfZm9ybVwiLFxuICAgICAgICBvYmplY3RBcGlOYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICB0aXRsZTogJ+aWsOW7uiAnICsgcmVsYXRlT2JqZWN0LmxhYmVsLFxuICAgICAgICBpbml0aWFsVmFsdWVzOiBpbml0aWFsVmFsdWVzLFxuICAgICAgICBhZnRlckluc2VydDogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChDcmVhdG9yLmdldE9iamVjdChjdXJyZW50X29iamVjdF9uYW1lKS52ZXJzaW9uID4gMSkge1xuICAgICAgICAgICAgICBTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9LCBudWxsLCB7XG4gICAgICAgIGljb25QYXRoOiAnL2Fzc2V0cy9pY29ucydcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoaWRzICE9IG51bGwgPyBpZHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgIFNlc3Npb24uc2V0KCdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFfLmlzRW1wdHkoaW5pdGlhbFZhbHVlcykpIHtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICB9XG4gICAgfVxuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX2ZpZWxkc1wiLCB2b2lkIDApO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25cIiwgY29sbGVjdGlvbik7XG4gICAgU2Vzc2lvbi5zZXQoXCJhY3Rpb25fY29sbGVjdGlvbl9uYW1lXCIsIGNvbGxlY3Rpb25fbmFtZSk7XG4gICAgU2Vzc2lvbi5zZXQoXCJhY3Rpb25fc2F2ZV9hbmRfaW5zZXJ0XCIsIGZhbHNlKTtcbiAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJChcIi5jcmVhdG9yLWFkZC1yZWxhdGVkXCIpLmNsaWNrKCk7XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IuYWN0aW9ucyh7XG4gICAgXCJzdGFuZGFyZF9xdWVyeVwiOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIik7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX25ld1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBncmlkTmFtZSwgaW5pdGlhbFZhbHVlcywgaXNSZWxhdGVkLCBtYXN0ZXJSZWNvcmRJZCwgb2JqZWN0LCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlbGF0ZWRGaWVsZE5hbWUsIHNlbGVjdGVkUm93cztcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGdyaWROYW1lID0gdGhpcy5hY3Rpb24uZ3JpZE5hbWU7XG4gICAgICBpc1JlbGF0ZWQgPSB0aGlzLmFjdGlvbi5pc1JlbGF0ZWQ7XG4gICAgICBpZiAoaXNSZWxhdGVkKSB7XG4gICAgICAgIHJlbGF0ZWRGaWVsZE5hbWUgPSB0aGlzLmFjdGlvbi5yZWxhdGVkRmllbGROYW1lO1xuICAgICAgICBtYXN0ZXJSZWNvcmRJZCA9IHRoaXMuYWN0aW9uLm1hc3RlclJlY29yZElkO1xuICAgICAgICBpbml0aWFsVmFsdWVzID0gdGhpcy5hY3Rpb24uaW5pdGlhbFZhbHVlcztcbiAgICAgICAgaWYgKCFpbml0aWFsVmFsdWVzKSB7XG4gICAgICAgICAgaW5pdGlhbFZhbHVlcyA9IHt9O1xuICAgICAgICAgIGluaXRpYWxWYWx1ZXNbcmVsYXRlZEZpZWxkTmFtZV0gPSBtYXN0ZXJSZWNvcmRJZDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IHt9O1xuICAgICAgICBpZiAoZ3JpZE5hbWUpIHtcbiAgICAgICAgICBzZWxlY3RlZFJvd3MgPSAocmVmID0gd2luZG93LmdyaWRSZWZzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbZ3JpZE5hbWVdLmN1cnJlbnQpICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYXBpKSAhPSBudWxsID8gcmVmMi5nZXRTZWxlY3RlZFJvd3MoKSA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxlY3RlZFJvd3MgPSAocmVmMyA9IHdpbmRvdy5ncmlkUmVmKSAhPSBudWxsID8gKHJlZjQgPSByZWYzLmN1cnJlbnQpICE9IG51bGwgPyAocmVmNSA9IHJlZjQuYXBpKSAhPSBudWxsID8gcmVmNS5nZXRTZWxlY3RlZFJvd3MoKSA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0ZWRSb3dzICE9IG51bGwgPyBzZWxlY3RlZFJvd3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmVjb3JkX2lkID0gc2VsZWN0ZWRSb3dzWzBdLl9pZDtcbiAgICAgICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgICAgICBpbml0aWFsVmFsdWVzID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluaXRpYWxWYWx1ZXMgPSBGb3JtTWFuYWdlci5nZXRJbml0aWFsVmFsdWVzKG9iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC52ZXJzaW9uIDogdm9pZCAwKSA+PSAyKSB7XG4gICAgICAgIHJldHVybiBTdGVlZG9zLlBhZ2UuRm9ybS5TdGFuZGFyZE5ldy5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCB0KCdOZXcnKSArICcgJyArIG9iamVjdC5sYWJlbCwgaW5pdGlhbFZhbHVlcywge1xuICAgICAgICAgIGdyaWROYW1lOiBncmlkTmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoc2VsZWN0ZWRSb3dzICE9IG51bGwgPyBzZWxlY3RlZFJvd3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgIH1cbiAgICAgIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQoXCIuY3JlYXRvci1hZGRcIikuY2xpY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgaHJlZjtcbiAgICAgIGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2VkaXRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgb2JqZWN0O1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICAgIGlmICgob2JqZWN0ICE9IG51bGwgPyBvYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgICAgIHJldHVybiBTdGVlZG9zLlBhZ2UuRm9ybS5TdGFuZGFyZEVkaXQucmVuZGVyKFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpLCBvYmplY3RfbmFtZSwgdCgnRWRpdCcpICsgJyAnICsgb2JqZWN0LmxhYmVsLCByZWNvcmRfaWQsIHtcbiAgICAgICAgICAgIGdyaWROYW1lOiB0aGlzLmFjdGlvbi5ncmlkTmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2UpIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2RlbGV0ZVwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spIHtcbiAgICAgIHZhciBiZWZvcmVIb29rLCBncmlkTmFtZSwgaTE4blRleHRLZXksIGkxOG5UaXRsZUtleSwgbmFtZUZpZWxkLCBvYmplY3QsIHNlbGVjdGVkUmVjb3JkcywgdGV4dDtcbiAgICAgIGdyaWROYW1lID0gdGhpcy5hY3Rpb24uZ3JpZE5hbWU7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtcbiAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFiZWZvcmVIb29rKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBuYW1lRmllbGQgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVkgfHwgXCJuYW1lXCI7XG4gICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICAgIH1cbiAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgIGxpc3Rfdmlld19pZCA9IFwiYWxsXCI7XG4gICAgICB9XG4gICAgICBpZiAoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiByZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgcmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlW25hbWVGaWVsZF07XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkICYmICFyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgcmVjb3JkX3RpdGxlID0gcmVjb3JkW25hbWVGaWVsZF07XG4gICAgICB9XG4gICAgICBpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCI7XG4gICAgICBpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiO1xuICAgICAgaWYgKCFyZWNvcmRfaWQpIHtcbiAgICAgICAgaTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RpdGxlXCI7XG4gICAgICAgIGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RleHRcIjtcbiAgICAgICAgc2VsZWN0ZWRSZWNvcmRzID0gU3RlZWRvc1VJLmdldFRhYmxlU2VsZWN0ZWRSb3dzKGdyaWROYW1lIHx8IGxpc3Rfdmlld19pZCk7XG4gICAgICAgIGlmICghc2VsZWN0ZWRSZWNvcmRzIHx8ICFzZWxlY3RlZFJlY29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgdG9hc3RyLndhcm5pbmcodChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X25vX3NlbGVjdGlvblwiKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHRleHQgPSB0KGkxOG5UZXh0S2V5LCBvYmplY3QubGFiZWwgKyBcIiBcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gdChpMThuVGV4dEtleSwgXCJcIiArIG9iamVjdC5sYWJlbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3dhbCh7XG4gICAgICAgIHRpdGxlOiB0KGkxOG5UaXRsZUtleSwgXCJcIiArIG9iamVjdC5sYWJlbCksXG4gICAgICAgIHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+XCIgKyB0ZXh0ICsgXCI8L2Rpdj5cIixcbiAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpLFxuICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuICAgICAgfSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHZhciBhZnRlckJhdGNoZXNEZWxldGUsIGRlbGV0ZUNvdW50ZXI7XG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgICAgICByZXR1cm4gX2RlbGV0ZVJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIF9lLCBhcHBpZCwgY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIGR4RGF0YUdyaWRJbnN0YW5jZSwgZ3JpZENvbnRhaW5lciwgZ3JpZE9iamVjdE5hbWVDbGFzcywgaXNPcGVuZXJSZW1vdmUsIHJlY29yZFVybCwgcmVmLCB0ZW1wTmF2UmVtb3ZlZDtcbiAgICAgICAgICAgICAgZ3JpZE9iamVjdE5hbWVDbGFzcyA9IG9iamVjdF9uYW1lLnJlcGxhY2UoL1xcLi9nLCBcIi1cIik7XG4gICAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgICAgaWYgKCEoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgIGlzT3BlbmVyUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjdXJyZW50X29iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50X29iamVjdF9uYW1lICYmICgocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYudmVyc2lvbiA6IHZvaWQgMCkgPiAxKSB7XG4gICAgICAgICAgICAgICAgICBTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKEZsb3dSb3V0ZXIuY3VycmVudCgpLnJvdXRlLnBhdGguZW5kc1dpdGgoXCIvOnJlY29yZF9pZFwiKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgICBfZSA9IGVycm9yMTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKF9lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICAgICAgICB0ZW1wTmF2UmVtb3ZlZCA9IENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCk7XG4gICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSB8fCAhZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzT3BlbmVyUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgJiYgbGlzdF92aWV3X2lkICE9PSAnY2FsZW5kYXInKSB7XG4gICAgICAgICAgICAgICAgICBhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICAgICAgICAgICAgICAgICAgaWYgKCF0ZW1wTmF2UmVtb3ZlZCkge1xuICAgICAgICAgICAgICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcC9cIiArIGFwcGlkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoY2FsbF9iYWNrICYmIHR5cGVvZiBjYWxsX2JhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsX2JhY2soKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZFJlY29yZHMgJiYgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcImxvYWRpbmdcIik7XG4gICAgICAgICAgICAgIGRlbGV0ZUNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICBhZnRlckJhdGNoZXNEZWxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBkZWxldGVDb3VudGVyKys7XG4gICAgICAgICAgICAgICAgaWYgKGRlbGV0ZUNvdW50ZXIgPj0gc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJsb2FkaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlY29yZFRpdGxlO1xuICAgICAgICAgICAgICAgIHJlY29yZF9pZCA9IHJlY29yZC5faWQ7XG4gICAgICAgICAgICAgICAgYmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge1xuICAgICAgICAgICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIWJlZm9yZUhvb2spIHtcbiAgICAgICAgICAgICAgICAgIGFmdGVyQmF0Y2hlc0RlbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWNvcmRUaXRsZSA9IHJlY29yZFtuYW1lRmllbGRdIHx8IHJlY29yZF9pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2RlbGV0ZVJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkLl9pZCwgcmVjb3JkVGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcmVjb3JkVXJsO1xuICAgICAgICAgICAgICAgICAgcmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICAgICAgICAgICAgICBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyQmF0Y2hlc0RlbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH0pLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBhZnRlckJhdGNoZXNEZWxldGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIl19
