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
          skipProcessEventRegistration: true
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiQVBJU2VydmljZSIsIk1ldGFkYXRhU2VydmljZSIsImNvbmZpZyIsImUiLCJtb2xlY3VsZXIiLCJvYmplY3RxbCIsInBhY2thZ2VMb2FkZXIiLCJwYWNrYWdlU2VydmljZSIsInBhdGgiLCJzZXR0aW5ncyIsInN0ZWVkb3NDb3JlIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJyZXF1aXJlIiwiZ2V0U3RlZWRvc0NvbmZpZyIsImJ1aWx0X2luX3BsdWdpbnMiLCJwbHVnaW5zIiwiTWV0ZW9yIiwic3RhcnR1cCIsImFwaVNlcnZpY2UiLCJicm9rZXIiLCJleCIsIm1ldGFkYXRhU2VydmljZSIsInBhZ2VTZXJ2aWNlIiwicHJvamVjdFNlcnZpY2UiLCJzdGFuZGFyZE9iamVjdHNEaXIiLCJzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSIsInN0ZWVkb3NTZXJ2aWNlIiwidWlTZXJ2aWNlIiwiU2VydmljZUJyb2tlciIsIm5hbWVzcGFjZSIsIm5vZGVJRCIsIm1ldGFkYXRhIiwidHJhbnNwb3J0ZXIiLCJUUkFOU1BPUlRFUiIsImNhY2hlciIsIkNBQ0hFUiIsImxvZ0xldmVsIiwic2VyaWFsaXplciIsInJlcXVlc3RUaW1lb3V0IiwibWF4Q2FsbExldmVsIiwiaGVhcnRiZWF0SW50ZXJ2YWwiLCJoZWFydGJlYXRUaW1lb3V0IiwiY29udGV4dFBhcmFtc0Nsb25pbmciLCJ0cmFja2luZyIsImVuYWJsZWQiLCJzaHV0ZG93blRpbWVvdXQiLCJkaXNhYmxlQmFsYW5jZXIiLCJyZWdpc3RyeSIsInN0cmF0ZWd5IiwicHJlZmVyTG9jYWwiLCJidWxraGVhZCIsImNvbmN1cnJlbmN5IiwibWF4UXVldWVTaXplIiwidmFsaWRhdG9yIiwiZXJyb3JIYW5kbGVyIiwidHJhY2luZyIsImV4cG9ydGVyIiwidHlwZSIsIm9wdGlvbnMiLCJsb2dnZXIiLCJjb2xvcnMiLCJ3aWR0aCIsImdhdWdlV2lkdGgiLCJza2lwUHJvY2Vzc0V2ZW50UmVnaXN0cmF0aW9uIiwiaW5pdCIsImNyZWF0ZVNlcnZpY2UiLCJuYW1lIiwibWl4aW5zIiwicG9ydCIsInN0YXJ0ZWQiLCJzZXRUaW1lb3V0IiwiZW1pdCIsImdldFN0ZWVkb3NTY2hlbWEiLCJTdGFuZGFyZE9iamVjdHNQYXRoIiwicGFja2FnZUluZm8iLCJ3cmFwQXN5bmMiLCJjYiIsInN0YXJ0IiwidGhlbiIsImNvbm5lY3RIYW5kbGVyc0V4cHJlc3MiLCJleHByZXNzIiwiX3Jlc3RhcnRTZXJ2aWNlIiwidXNlIiwic3RhdGljUm91dGVyIiwid2FpdEZvclNlcnZpY2VzIiwiY29uc29sZSIsImxvZyIsIlN0ZWVkb3NBcGkiLCJXZWJBcHAiLCJjb25uZWN0SGFuZGxlcnMiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyb3IiLCJGaWJlciIsImRlcHMiLCJhcHAiLCJUcmFja2VyIiwiRGVwZW5kZW5jeSIsIm9iamVjdCIsIl9URU1QTEFURSIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJmaWx0ZXJzRnVuY3Rpb24iLCJNYXRjaCIsIk9wdGlvbmFsIiwiT25lT2YiLCJGdW5jdGlvbiIsIlN0cmluZyIsIm9wdGlvbnNGdW5jdGlvbiIsImNyZWF0ZUZ1bmN0aW9uIiwiaXNTZXJ2ZXIiLCJmaWJlckxvYWRPYmplY3RzIiwib2JqIiwib2JqZWN0X25hbWUiLCJsb2FkT2JqZWN0cyIsInJ1biIsImxpc3Rfdmlld3MiLCJzcGFjZSIsImdldENvbGxlY3Rpb25OYW1lIiwiXyIsImNsb25lIiwiY29udmVydE9iamVjdCIsIk9iamVjdCIsImluaXRUcmlnZ2VycyIsImluaXRMaXN0Vmlld3MiLCJnZXRPYmplY3ROYW1lIiwiZ2V0T2JqZWN0Iiwic3BhY2VfaWQiLCJyZWYiLCJyZWYxIiwiaXNBcnJheSIsImlzQ2xpZW50IiwiZGVwZW5kIiwiU2Vzc2lvbiIsImdldCIsIm9iamVjdHNCeU5hbWUiLCJnZXRPYmplY3RCeUlkIiwib2JqZWN0X2lkIiwiZmluZFdoZXJlIiwiX2lkIiwicmVtb3ZlT2JqZWN0IiwiZ2V0Q29sbGVjdGlvbiIsInNwYWNlSWQiLCJfY29sbGVjdGlvbl9uYW1lIiwicmVtb3ZlQ29sbGVjdGlvbiIsImlzU3BhY2VBZG1pbiIsInVzZXJJZCIsImZpbmRPbmUiLCJmaWVsZHMiLCJhZG1pbnMiLCJpbmRleE9mIiwiZXZhbHVhdGVGb3JtdWxhIiwiZm9ybXVsYXIiLCJjb250ZXh0IiwiaXNTdHJpbmciLCJGb3JtdWxhciIsImNoZWNrRm9ybXVsYSIsImV2YWx1YXRlRmlsdGVycyIsImZpbHRlcnMiLCJzZWxlY3RvciIsImVhY2giLCJmaWx0ZXIiLCJhY3Rpb24iLCJ2YWx1ZSIsImxlbmd0aCIsImlzQ29tbW9uU3BhY2UiLCJnZXRPcmRlcmx5U2V0QnlJZHMiLCJkb2NzIiwiaWRzIiwiaWRfa2V5IiwiaGl0X2ZpcnN0IiwidmFsdWVzIiwiZ2V0UHJvcGVydHkiLCJzb3J0QnkiLCJkb2MiLCJfaW5kZXgiLCJzb3J0aW5nTWV0aG9kIiwidmFsdWUxIiwidmFsdWUyIiwiaXNWYWx1ZTFFbXB0eSIsImlzVmFsdWUyRW1wdHkiLCJsb2NhbGUiLCJrZXkiLCJEYXRlIiwiZ2V0VGltZSIsIlN0ZWVkb3MiLCJ0b1N0cmluZyIsImxvY2FsZUNvbXBhcmUiLCJnZXRPYmplY3RSZWxhdGVkcyIsIl9vYmplY3QiLCJwZXJtaXNzaW9ucyIsInJlbGF0ZWRMaXN0IiwicmVsYXRlZExpc3RNYXAiLCJyZWxhdGVkX29iamVjdHMiLCJpc0VtcHR5Iiwib2JqTmFtZSIsImlzT2JqZWN0Iiwib2JqZWN0TmFtZSIsInJlbGF0ZWRfb2JqZWN0IiwicmVsYXRlZF9vYmplY3RfbmFtZSIsInJlbGF0ZWRfZmllbGQiLCJyZWxhdGVkX2ZpZWxkX25hbWUiLCJyZWZlcmVuY2VfdG8iLCJmb3JlaWduX2tleSIsIndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIiwiZW5hYmxlT2JqTmFtZSIsImdldFBlcm1pc3Npb25zIiwiZW5hYmxlX2F1ZGl0IiwibW9kaWZ5QWxsUmVjb3JkcyIsImVuYWJsZV9maWxlcyIsInB1c2giLCJzZnNGaWxlc09iamVjdCIsInNwbGljZSIsImVuYWJsZV90YXNrcyIsImVuYWJsZV9ub3RlcyIsImVuYWJsZV9ldmVudHMiLCJlbmFibGVfaW5zdGFuY2VzIiwiZW5hYmxlX2FwcHJvdmFscyIsImVuYWJsZV9wcm9jZXNzIiwiZ2V0VXNlckNvbnRleHQiLCJpc1VuU2FmZU1vZGUiLCJVU0VSX0NPTlRFWFQiLCJzcGFjZV91c2VyX29yZyIsInN1Iiwic3VGaWVsZHMiLCJFcnJvciIsIm1vYmlsZSIsInBvc2l0aW9uIiwiZW1haWwiLCJjb21wYW55Iiwib3JnYW5pemF0aW9uIiwiY29tcGFueV9pZCIsImNvbXBhbnlfaWRzIiwidXNlciIsImZ1bGxuYW1lIiwiZ2V0UmVsYXRpdmVVcmwiLCJ1cmwiLCJpc0Z1bmN0aW9uIiwiaXNDb3Jkb3ZhIiwic3RhcnRzV2l0aCIsInRlc3QiLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwiUk9PVF9VUkxfUEFUSF9QUkVGSVgiLCJnZXRVc2VyQ29tcGFueUlkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJwcm9jZXNzUGVybWlzc2lvbnMiLCJwbyIsImFsbG93Q3JlYXRlIiwiYWxsb3dSZWFkIiwiYWxsb3dFZGl0IiwiYWxsb3dEZWxldGUiLCJ2aWV3QWxsUmVjb3JkcyIsInZpZXdDb21wYW55UmVjb3JkcyIsIm1vZGlmeUNvbXBhbnlSZWNvcmRzIiwiYWxsb3dSZWFkRmlsZXMiLCJ2aWV3QWxsRmlsZXMiLCJhbGxvd0NyZWF0ZUZpbGVzIiwiYWxsb3dFZGl0RmlsZXMiLCJhbGxvd0RlbGV0ZUZpbGVzIiwibW9kaWZ5QWxsRmlsZXMiLCJnZXRUZW1wbGF0ZVNwYWNlSWQiLCJ0ZW1wbGF0ZVNwYWNlSWQiLCJnZXRDbG91ZEFkbWluU3BhY2VJZCIsImNsb3VkQWRtaW5TcGFjZUlkIiwiaXNUZW1wbGF0ZVNwYWNlIiwiaXNDbG91ZEFkbWluU3BhY2UiLCJzdGVlZG9zU3RvcmFnZURpciIsIlNURUVET1NfU1RPUkFHRV9ESVIiLCJtZXRob2RzIiwiY29sbGVjdGlvbiIsIm5hbWVfZmllbGRfa2V5Iiwib3B0aW9uc19saW1pdCIsInF1ZXJ5IiwicXVlcnlfb3B0aW9ucyIsInJlY29yZHMiLCJyZXN1bHRzIiwic2VhcmNoVGV4dFF1ZXJ5Iiwic2VsZWN0ZWQiLCJzb3J0IiwicGFyYW1zIiwiTkFNRV9GSUVMRF9LRVkiLCJzZWFyY2hUZXh0IiwiJHJlZ2V4IiwiJG9yIiwiJGluIiwiZXh0ZW5kIiwiJG5pbiIsImZpbHRlclF1ZXJ5IiwibGltaXQiLCJmaW5kIiwiZmV0Y2giLCJyZWNvcmQiLCJsYWJlbCIsIm1lc3NhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiSnNvblJvdXRlcyIsImFkZCIsInJlcSIsInJlcyIsIm5leHQiLCJib3giLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImZsb3dJZCIsImhhc2hEYXRhIiwiaW5zIiwiaW5zSWQiLCJyZWNvcmRfaWQiLCJyZWRpcmVjdF91cmwiLCJyZWYyIiwicmVmMyIsInJlZjQiLCJ3b3JrZmxvd1VybCIsInhfYXV0aF90b2tlbiIsInhfdXNlcl9pZCIsInV1Zmxvd01hbmFnZXIiLCJjaGVja19hdXRob3JpemF0aW9uIiwiYm9keSIsImNoZWNrIiwiaW5zdGFuY2VJZCIsImZsb3ciLCJpbmJveF91c2VycyIsImluY2x1ZGVzIiwiY2NfdXNlcnMiLCJvdXRib3hfdXNlcnMiLCJzdGF0ZSIsInN1Ym1pdHRlciIsImFwcGxpY2FudCIsInBlcm1pc3Npb25NYW5hZ2VyIiwiZ2V0Rmxvd1Blcm1pc3Npb25zIiwic3BhY2VzIiwid2Vic2VydmljZXMiLCJ3b3JrZmxvdyIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsInVwZGF0ZSIsIiR1bnNldCIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsInJlYXNvbiIsImdldEluaXRXaWR0aFBlcmNlbnQiLCJjb2x1bW5zIiwiX3NjaGVtYSIsImNvbHVtbl9udW0iLCJpbml0X3dpZHRoX3BlcmNlbnQiLCJnZXRTY2hlbWEiLCJmaWVsZF9uYW1lIiwiZmllbGQiLCJpc193aWRlIiwicGljayIsImF1dG9mb3JtIiwiZ2V0RmllbGRJc1dpZGUiLCJnZXRUYWJ1bGFyT3JkZXIiLCJsaXN0X3ZpZXdfaWQiLCJzZXR0aW5nIiwibWFwIiwiY29sdW1uIiwiaGlkZGVuIiwiY29tcGFjdCIsIm9yZGVyIiwiaW5kZXgiLCJkZWZhdWx0X2V4dHJhX2NvbHVtbnMiLCJleHRyYV9jb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zIiwidW5pb24iLCJnZXRPYmplY3REZWZhdWx0U29ydCIsIlRhYnVsYXJTZWxlY3RlZElkcyIsImNvbnZlcnRMaXN0VmlldyIsImRlZmF1bHRfdmlldyIsImxpc3RfdmlldyIsImxpc3Rfdmlld19uYW1lIiwiZGVmYXVsdF9jb2x1bW5zIiwiZGVmYXVsdF9tb2JpbGVfY29sdW1ucyIsIm9pdGVtIiwibW9iaWxlX2NvbHVtbnMiLCJoYXMiLCJpbmNsdWRlIiwiZmlsdGVyX3Njb3BlIiwicGFyc2UiLCJmb3JFYWNoIiwiX3ZhbHVlIiwiZ2V0UmVsYXRlZExpc3QiLCJsYXlvdXRSZWxhdGVkTGlzdCIsImxpc3QiLCJtYXBMaXN0Iiwib2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzIiwicmVsYXRlZExpc3ROYW1lcyIsInJlbGF0ZWRMaXN0T2JqZWN0cyIsInJlbGF0ZWRfb2JqZWN0X25hbWVzIiwidW5yZWxhdGVkX29iamVjdHMiLCJyZWxhdGVkX2xpc3RzIiwiaXRlbSIsInJlRmllbGROYW1lIiwicmVPYmplY3ROYW1lIiwicmVsYXRlZCIsInJlbGF0ZWRfZmllbGRfZnVsbG5hbWUiLCJzcGxpdCIsImZpZWxkX25hbWVzIiwiaXNfZmlsZSIsImN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0IiwiYWN0aW9ucyIsImJ1dHRvbnMiLCJ2aXNpYmxlX29uIiwicGFnZV9zaXplIiwib2JqT3JOYW1lIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9pdGVtIiwicmVsYXRlZE9iamVjdCIsInRhYnVsYXJfb3JkZXIiLCJnZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyIsIndpdGhvdXQiLCJ0cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyIiwicmVwbGFjZSIsInBsdWNrIiwiZGlmZmVyZW5jZSIsInYiLCJpc0FjdGl2ZSIsImFsbG93X3JlbGF0ZWRMaXN0IiwiZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyIsImZpcnN0IiwiZ2V0TGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXciLCJleGFjIiwibGlzdFZpZXdzIiwiZ2V0TGlzdFZpZXdJc1JlY2VudCIsImxpc3RWaWV3IiwicGlja09iamVjdE1vYmlsZUNvbHVtbnMiLCJjb3VudCIsImdldEZpZWxkIiwiaXNOYW1lQ29sdW1uIiwiaXRlbUNvdW50IiwibWF4Q291bnQiLCJtYXhSb3dzIiwibmFtZUNvbHVtbiIsIm5hbWVLZXkiLCJyZXN1bHQiLCJnZXRPYmplY3REZWZhdWx0VmlldyIsImRlZmF1bHRWaWV3IiwidXNlX21vYmlsZV9jb2x1bW5zIiwiaXNBbGxWaWV3IiwiaXNSZWNlbnRWaWV3IiwidGFidWxhckNvbHVtbnMiLCJ0YWJ1bGFyX3NvcnQiLCJjb2x1bW5faW5kZXgiLCJ0cmFuc2Zvcm1Tb3J0VG9EWCIsImR4X3NvcnQiLCJSZWdFeCIsIlJlZ0V4cCIsIl9yZWdFeE1lc3NhZ2VzIiwiX2dsb2JhbE1lc3NhZ2VzIiwicmVnRXgiLCJleHAiLCJtc2ciLCJtZXNzYWdlcyIsImV2YWxJbkNvbnRleHQiLCJqcyIsImV2YWwiLCJjYWxsIiwiY29udmVydEZpZWxkIiwiZ2V0T3B0aW9uIiwib3B0aW9uIiwiZm9vIiwiY29sb3IiLCJhbGxPcHRpb25zIiwicGlja2xpc3QiLCJwaWNrbGlzdE9wdGlvbnMiLCJnZXRQaWNrbGlzdCIsImdldFBpY2tMaXN0T3B0aW9ucyIsInJldmVyc2UiLCJlbmFibGUiLCJkZWZhdWx0VmFsdWUiLCJ0cmlnZ2VycyIsInRyaWdnZXIiLCJfdG9kbyIsIl90b2RvX2Zyb21fY29kZSIsIl90b2RvX2Zyb21fZGIiLCJvbiIsInRvZG8iLCJzeXN0ZW1CYXNlRmllbGRzIiwib21pdCIsInJlcXVpcmVkIiwicmVhZG9ubHkiLCJnZXRTeXN0ZW1CYXNlRmllbGRzIiwiX3Zpc2libGUiLCJlcnJvcjEiLCJhY3Rpb25zQnlOYW1lIiwidHJpbSIsImlzRXhwcmVzc2lvbiIsInZpc2libGUiLCJyZWNvcmRfcGVybWlzc2lvbnMiLCJnbG9iYWxEYXRhIiwiYXNzaWduIiwibm93IiwicGFyc2VTaW5nbGVFeHByZXNzaW9uIiwiX29wdGlvbnMiLCJfdHlwZSIsImJlZm9yZU9wZW5GdW5jdGlvbiIsImlzX2NvbXBhbnlfbGltaXRlZCIsIm1heCIsIm1pbiIsIl9vcHRpb24iLCJrIiwiX3JlZ0V4IiwiX21pbiIsIl9tYXgiLCJOdW1iZXIiLCJCb29sZWFuIiwiX29wdGlvbnNGdW5jdGlvbiIsIl9yZWZlcmVuY2VfdG8iLCJfY3JlYXRlRnVuY3Rpb24iLCJfYmVmb3JlT3BlbkZ1bmN0aW9uIiwiX2ZpbHRlcnNGdW5jdGlvbiIsIl9kZWZhdWx0VmFsdWUiLCJfaXNfY29tcGFueV9saW1pdGVkIiwiX2ZpbHRlcnMiLCJpc0RhdGUiLCJwb3AiLCJfaXNfZGF0ZSIsImZvcm0iLCJ2YWwiLCJyZWxhdGVkT2JqSW5mbyIsIlBSRUZJWCIsIl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSIsInByZWZpeCIsImZpZWxkVmFyaWFibGUiLCJyZWciLCJyZXYiLCJtIiwiJDEiLCJmb3JtdWxhX3N0ciIsIl9DT05URVhUIiwiX1ZBTFVFUyIsImlzQm9vbGVhbiIsInRvYXN0ciIsImZvcm1hdE9iamVjdE5hbWUiLCJfYmFzZU9iamVjdCIsIl9kYiIsImRlZmF1bHRMaXN0Vmlld0lkIiwiZGlzYWJsZWRfbGlzdF92aWV3cyIsInNjaGVtYSIsInNlbGYiLCJiYXNlT2JqZWN0IiwicGVybWlzc2lvbl9zZXQiLCJpY29uIiwiZGVzY3JpcHRpb24iLCJpc192aWV3IiwiaGFzSW1wb3J0VGVtcGxhdGVzIiwidmVyc2lvbiIsImlzX2VuYWJsZSIsImFsbG93X2N1c3RvbUFjdGlvbnMiLCJleGNsdWRlX2FjdGlvbnMiLCJlbmFibGVfc2VhcmNoIiwicGFnaW5nIiwiZW5hYmxlX2FwaSIsImN1c3RvbSIsImVuYWJsZV9zaGFyZSIsImVuYWJsZV90cmVlIiwic2lkZWJhciIsIm9wZW5fd2luZG93IiwiZmlsdGVyX2NvbXBhbnkiLCJjYWxlbmRhciIsImVuYWJsZV9jaGF0dGVyIiwiZW5hYmxlX3RyYXNoIiwiZW5hYmxlX3NwYWNlX2dsb2JhbCIsImVuYWJsZV9mb2xsb3ciLCJlbmFibGVfd29ya2Zsb3ciLCJlbmFibGVfaW5saW5lX2VkaXQiLCJkZXRhaWxzIiwibWFzdGVycyIsImxvb2t1cF9kZXRhaWxzIiwiaW5fZGV2ZWxvcG1lbnQiLCJpZEZpZWxkTmFtZSIsImRhdGFiYXNlX25hbWUiLCJpc19uYW1lIiwicHJpbWFyeSIsImZpbHRlcmFibGUiLCJpdGVtX25hbWUiLCJjb3B5SXRlbSIsImFkbWluIiwiYWxsIiwibGlzdF92aWV3X2l0ZW0iLCJSZWFjdGl2ZVZhciIsImNyZWF0ZUNvbGxlY3Rpb24iLCJfbmFtZSIsImdldE9iamVjdFNjaGVtYSIsImNvbnRhaW5zIiwiYXR0YWNoU2NoZW1hIiwiX3NpbXBsZVNjaGVtYSIsImdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4IiwiYm9vdHN0cmFwTG9hZGVkIiwiZ2V0U2VsZWN0T3B0aW9ucyIsImZpZWxkU2NoZW1hIiwiZGF0YV90eXBlIiwib3B0aW9uSXRlbSIsImZpZWxkc0FyciIsIl9yZWZfb2JqIiwiYXV0b2Zvcm1fdHlwZSIsImNvbGxlY3Rpb25OYW1lIiwiZnMiLCJmc1R5cGUiLCJpc1VuTGltaXRlZCIsIm11bHRpcGxlIiwicm93cyIsImxhbmd1YWdlIiwiaXNNb2JpbGUiLCJpc1BhZCIsImlzaU9TIiwiYWZGaWVsZElucHV0IiwidGltZXpvbmVJZCIsImR4RGF0ZUJveE9wdGlvbnMiLCJkaXNwbGF5Rm9ybWF0IiwicGlja2VyVHlwZSIsImRhdGVNb2JpbGVPcHRpb25zIiwib3V0Rm9ybWF0Iiwic2hvd0ljb24iLCJkZXBlbmRPbiIsImRlcGVuZF9vbiIsImNyZWF0ZSIsImxvb2t1cF9maWVsZCIsIk1vZGFsIiwic2hvdyIsImZvcm1JZCIsIm9wZXJhdGlvbiIsIm9uU3VjY2VzcyIsImFkZEl0ZW1zIiwicmVmZXJlbmNlX3NvcnQiLCJvcHRpb25zU29ydCIsInJlZmVyZW5jZV9saW1pdCIsIm9wdGlvbnNMaW1pdCIsInJlZmVyZW5jZV90b19maWVsZCIsInJlZmVyZW5jZVRvRmllbGQiLCJibGFja2JveCIsIm9iamVjdFN3aXRjaGUiLCJvcHRpb25zTWV0aG9kIiwib3B0aW9uc01ldGhvZFBhcmFtcyIsInJlZmVyZW5jZXMiLCJfcmVmZXJlbmNlIiwibGluayIsImRlZmF1bHRJY29uIiwiZmlyc3RPcHRpb24iLCJkZWNpbWFsIiwicHJlY2lzaW9uIiwic2NhbGUiLCJkaXNhYmxlZCIsIkFycmF5IiwiZWRpdGFibGUiLCJhY2NlcHQiLCJzeXN0ZW0iLCJFbWFpbCIsImlzTnVtYmVyIiwib3B0aW9uYWwiLCJ1bmlxdWUiLCJncm91cCIsInNlYXJjaGFibGUiLCJpbmxpbmVIZWxwVGV4dCIsImlzUHJvZHVjdGlvbiIsInNvcnRhYmxlIiwiZ2V0RmllbGREaXNwbGF5VmFsdWUiLCJmaWVsZF92YWx1ZSIsImh0bWwiLCJtb21lbnQiLCJmb3JtYXQiLCJjaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkiLCJmaWVsZF90eXBlIiwicHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzIiwib3BlcmF0aW9ucyIsImJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyIsImJ1aWx0aW5JdGVtIiwiaXNfY2hlY2tfb25seSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtIiwiZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24iLCJiZXR3ZWVuQnVpbHRpblZhbHVlcyIsImdldFF1YXJ0ZXJTdGFydE1vbnRoIiwibW9udGgiLCJnZXRNb250aCIsImdldExhc3RRdWFydGVyRmlyc3REYXkiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJnZXROZXh0UXVhcnRlckZpcnN0RGF5IiwiZ2V0TW9udGhEYXlzIiwiZGF5cyIsImVuZERhdGUiLCJtaWxsaXNlY29uZCIsInN0YXJ0RGF0ZSIsImdldExhc3RNb250aEZpcnN0RGF5IiwiY3VycmVudE1vbnRoIiwiY3VycmVudFllYXIiLCJlbmRWYWx1ZSIsImZpcnN0RGF5IiwibGFzdERheSIsImxhc3RNb25kYXkiLCJsYXN0TW9udGhGaW5hbERheSIsImxhc3RNb250aEZpcnN0RGF5IiwibGFzdFF1YXJ0ZXJFbmREYXkiLCJsYXN0UXVhcnRlclN0YXJ0RGF5IiwibGFzdFN1bmRheSIsImxhc3RfMTIwX2RheXMiLCJsYXN0XzMwX2RheXMiLCJsYXN0XzYwX2RheXMiLCJsYXN0XzdfZGF5cyIsImxhc3RfOTBfZGF5cyIsIm1pbnVzRGF5IiwibW9uZGF5IiwibmV4dE1vbmRheSIsIm5leHRNb250aEZpbmFsRGF5IiwibmV4dE1vbnRoRmlyc3REYXkiLCJuZXh0UXVhcnRlckVuZERheSIsIm5leHRRdWFydGVyU3RhcnREYXkiLCJuZXh0U3VuZGF5IiwibmV4dFllYXIiLCJuZXh0XzEyMF9kYXlzIiwibmV4dF8zMF9kYXlzIiwibmV4dF82MF9kYXlzIiwibmV4dF83X2RheXMiLCJuZXh0XzkwX2RheXMiLCJwcmV2aW91c1llYXIiLCJzdGFydFZhbHVlIiwic3RyRW5kRGF5Iiwic3RyRmlyc3REYXkiLCJzdHJMYXN0RGF5Iiwic3RyTW9uZGF5Iiwic3RyU3RhcnREYXkiLCJzdHJTdW5kYXkiLCJzdHJUb2RheSIsInN0clRvbW9ycm93Iiwic3RyWWVzdGRheSIsInN1bmRheSIsInRoaXNRdWFydGVyRW5kRGF5IiwidGhpc1F1YXJ0ZXJTdGFydERheSIsInRvbW9ycm93Iiwid2VlayIsInllc3RkYXkiLCJnZXREYXkiLCJ0IiwiZnYiLCJzZXRIb3VycyIsImdldEhvdXJzIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJnZXRGaWVsZERlZmF1bHRPcGVyYXRpb24iLCJnZXRGaWVsZE9wZXJhdGlvbiIsIm9wdGlvbmFscyIsImVxdWFsIiwidW5lcXVhbCIsImxlc3NfdGhhbiIsImdyZWF0ZXJfdGhhbiIsImxlc3Nfb3JfZXF1YWwiLCJncmVhdGVyX29yX2VxdWFsIiwibm90X2NvbnRhaW4iLCJzdGFydHNfd2l0aCIsImJldHdlZW4iLCJnZXRPYmplY3RGaWVsZHNOYW1lIiwiZmllbGRzTmFtZSIsInNvcnRfbm8iLCJjbGVhblRyaWdnZXIiLCJpbml0VHJpZ2dlciIsIl90cmlnZ2VyX2hvb2tzIiwicmVmNSIsInRvZG9XcmFwcGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJ3aGVuIiwiYmVmb3JlIiwiaW5zZXJ0IiwicmVtb3ZlIiwiYWZ0ZXIiLCJfaG9vayIsInRyaWdnZXJfbmFtZSIsIl90cmlnZ2VyX2hvb2siLCJiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMiLCJleHRlbmRQZXJtaXNzaW9uUHJvcHMiLCJmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0IiwiZmluZF9wZXJtaXNzaW9uX29iamVjdCIsImludGVyc2VjdGlvblBsdXMiLCJvdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMiLCJvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMiLCJwZXJtaXNzaW9uUHJvcE5hbWVzIiwidW5pb25QZXJtaXNzaW9uT2JqZWN0cyIsInVuaW9uUGx1cyIsImdldE9iamVjdFBlcm1pc3Npb25zIiwiZ2V0UmVjb3JkUGVybWlzc2lvbnMiLCJpc093bmVyIiwibWFzdGVyT2JqZWN0TmFtZSIsIm1hc3RlclJlY29yZFBlcm0iLCJyZWNvcmRfY29tcGFueV9pZCIsInJlY29yZF9jb21wYW55X2lkcyIsInVzZXJfY29tcGFueV9pZHMiLCJvd25lciIsInBhcmVudCIsIm4iLCJpbnRlcnNlY3Rpb24iLCJsb2NrZWQiLCJnZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zIiwiY3VycmVudE9iamVjdE5hbWUiLCJyZWxhdGVkTGlzdEl0ZW0iLCJjdXJyZW50UmVjb3JkIiwiaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlIiwibWFzdGVyQWxsb3ciLCJyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMiLCJ1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCIsImdldE9iamVjdFJlY29yZCIsImdldFJlY29yZFNhZmVSZWxhdGVkTGlzdCIsImdldEFsbFBlcm1pc3Npb25zIiwiX2kiLCJwc2V0cyIsInBzZXRzQWRtaW4iLCJwc2V0c0FkbWluX3BvcyIsInBzZXRzQ3VycmVudCIsInBzZXRzQ3VycmVudE5hbWVzIiwicHNldHNDdXJyZW50X3BvcyIsInBzZXRzQ3VzdG9tZXIiLCJwc2V0c0N1c3RvbWVyX3BvcyIsInBzZXRzR3Vlc3QiLCJwc2V0c0d1ZXN0X3BvcyIsInBzZXRzTWVtYmVyIiwicHNldHNNZW1iZXJfcG9zIiwicHNldHNTdXBwbGllciIsInBzZXRzU3VwcGxpZXJfcG9zIiwicHNldHNVc2VyIiwicHNldHNVc2VyX3BvcyIsInNldF9pZHMiLCJzcGFjZVVzZXIiLCJvYmplY3RzIiwiYXNzaWduZWRfYXBwcyIsInByb2ZpbGUiLCJ1c2VycyIsInBlcm1pc3Npb25fc2V0X2lkIiwiY3JlYXRlZCIsIm1vZGlmaWVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkX2J5IiwiZ2V0QXNzaWduZWRBcHBzIiwiYmluZCIsImFzc2lnbmVkX21lbnVzIiwiZ2V0QXNzaWduZWRNZW51cyIsInVzZXJfcGVybWlzc2lvbl9zZXRzIiwiYXJyYXkiLCJvdGhlciIsInRhcmdldCIsInByb3BzIiwiZmlsZXNQcm9OYW1lcyIsInByb3BOYW1lcyIsInByb3BOYW1lIiwiYXBwcyIsInBzZXRCYXNlIiwidXNlclByb2ZpbGUiLCJwc2V0IiwidW5pcSIsImFib3V0TWVudSIsImFkbWluTWVudXMiLCJhbGxNZW51cyIsImN1cnJlbnRQc2V0TmFtZXMiLCJtZW51cyIsIm90aGVyTWVudUFwcHMiLCJvdGhlck1lbnVzIiwiYWRtaW5fbWVudXMiLCJmbGF0dGVuIiwibWVudSIsInBzZXRzTWVudSIsInBlcm1pc3Npb25fc2V0cyIsInBlcm1pc3Npb25fb2JqZWN0cyIsImlzTnVsbCIsInBlcm1pc3Npb25fc2V0X2lkcyIsInBvcyIsIm9wcyIsIm9wc19rZXkiLCJjdXJyZW50UHNldCIsInRlbXBPcHMiLCJyZXBlYXRJbmRleCIsInJlcGVhdFBvIiwib3BzZXRBZG1pbiIsIm9wc2V0Q3VzdG9tZXIiLCJvcHNldEd1ZXN0Iiwib3BzZXRNZW1iZXIiLCJvcHNldFN1cHBsaWVyIiwib3BzZXRVc2VyIiwicG9zQWRtaW4iLCJwb3NDdXN0b21lciIsInBvc0d1ZXN0IiwicG9zTWVtYmVyIiwicG9zU3VwcGxpZXIiLCJwb3NVc2VyIiwicHJvZiIsImd1ZXN0IiwibWVtYmVyIiwic3VwcGxpZXIiLCJjdXN0b21lciIsImRpc2FibGVkX2FjdGlvbnMiLCJ1bnJlYWRhYmxlX2ZpZWxkcyIsInVuZWRpdGFibGVfZmllbGRzIiwiY3JlYXRvcl9kYl91cmwiLCJvcGxvZ191cmwiLCJNT05HT19VUkxfQ1JFQVRPUiIsIk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SIiwiX0NSRUFUT1JfREFUQVNPVVJDRSIsIl9kcml2ZXIiLCJNb25nb0ludGVybmFscyIsIlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJvcGxvZ1VybCIsImNvbGxlY3Rpb25fa2V5IiwibmV3Q29sbGVjdGlvbiIsIlNNU1F1ZXVlIiwiX2RlbGV0ZVJlY29yZCIsImFjdGlvbl9uYW1lIiwiZXhlY3V0ZUFjdGlvbiIsIml0ZW1fZWxlbWVudCIsImNhbGxiYWNrIiwibW9yZUFyZ3MiLCJ0b2RvQXJncyIsIk9iamVjdEdyaWQiLCJnZXRGaWx0ZXJzIiwid29yZF90ZW1wbGF0ZSIsIlN0ZWVkb3NGaWx0ZXJzIiwiZm9ybWF0RmlsdGVyc1RvT0RhdGFRdWVyeSIsImFic29sdXRlVXJsIiwid2luZG93Iiwib3BlbiIsIm9kYXRhIiwicHJvdG90eXBlIiwic2xpY2UiLCJjb25jYXQiLCJ3YXJuaW5nIiwicmVjb3JkX3RpdGxlIiwiY2FsbF9iYWNrIiwiY2FsbF9iYWNrX2Vycm9yIiwicHJldmlvdXNEb2MiLCJGb3JtTWFuYWdlciIsImdldFByZXZpb3VzRG9jIiwiaW5mbyIsInN1Y2Nlc3MiLCJydW5Ib29rIiwicmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3IiwiY29sbGVjdGlvbl9uYW1lIiwiY3VycmVudF9vYmplY3RfbmFtZSIsImN1cnJlbnRfcmVjb3JkX2lkIiwiZGVmYXVsdERvYyIsImluaXRpYWxWYWx1ZXMiLCJyZWxhdGVPYmplY3QiLCJzZXQiLCJnZXRSZWxhdGVkSW5pdGlhbFZhbHVlcyIsIlN0ZWVkb3NVSSIsInNob3dNb2RhbCIsInN0b3JlcyIsIkNvbXBvbmVudFJlZ2lzdHJ5IiwiY29tcG9uZW50cyIsIk9iamVjdEZvcm0iLCJvYmplY3RBcGlOYW1lIiwidGl0bGUiLCJhZnRlckluc2VydCIsInJlbG9hZFJlY29yZCIsIkZsb3dSb3V0ZXIiLCJyZWxvYWQiLCJpY29uUGF0aCIsImRlZmVyIiwiJCIsImNsaWNrIiwiZ3JpZE5hbWUiLCJpc1JlbGF0ZWQiLCJtYXN0ZXJSZWNvcmRJZCIsInJlbGF0ZWRGaWVsZE5hbWUiLCJzZWxlY3RlZFJvd3MiLCJncmlkUmVmcyIsImN1cnJlbnQiLCJhcGkiLCJnZXRTZWxlY3RlZFJvd3MiLCJncmlkUmVmIiwiZ2V0SW5pdGlhbFZhbHVlcyIsIlBhZ2UiLCJGb3JtIiwiU3RhbmRhcmROZXciLCJyZW5kZXIiLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwicmVkaXJlY3QiLCJTdGFuZGFyZEVkaXQiLCJiZWZvcmVIb29rIiwiaTE4blRleHRLZXkiLCJpMThuVGl0bGVLZXkiLCJuYW1lRmllbGQiLCJzZWxlY3RlZFJlY29yZHMiLCJ0ZXh0IiwiZ2V0VGFibGVTZWxlY3RlZFJvd3MiLCJzd2FsIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsImFmdGVyQmF0Y2hlc0RlbGV0ZSIsImRlbGV0ZUNvdW50ZXIiLCJfZSIsImFwcGlkIiwiZHhEYXRhR3JpZEluc3RhbmNlIiwiZ3JpZENvbnRhaW5lciIsImdyaWRPYmplY3ROYW1lQ2xhc3MiLCJpc09wZW5lclJlbW92ZSIsInJlY29yZFVybCIsInRlbXBOYXZSZW1vdmVkIiwib3BlbmVyIiwicm91dGUiLCJlbmRzV2l0aCIsInJlZnJlc2hHcmlkIiwiZHhUcmVlTGlzdCIsImR4RGF0YUdyaWQiLCJyZWZyZXNoIiwiVGVtcGxhdGUiLCJjcmVhdG9yX2dyaWQiLCJyZW1vdmVUZW1wTmF2SXRlbSIsImNsb3NlIiwiZ28iLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwicmVjb3JkVGl0bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEtBQUNBLEVBQUQsR0FBTSxFQUFOOztBQUNBLElBQUksT0FBQUMsT0FBQSxvQkFBQUEsWUFBQSxJQUFKO0FBQ0MsT0FBQ0EsT0FBRCxHQUFXLEVBQVg7QUNFQTs7QUREREEsUUFBUUMsT0FBUixHQUFrQixFQUFsQjtBQUNBRCxRQUFRRSxXQUFSLEdBQXNCLEVBQXRCO0FBQ0FGLFFBQVFHLEtBQVIsR0FBZ0IsRUFBaEI7QUFDQUgsUUFBUUksSUFBUixHQUFlLEVBQWY7QUFDQUosUUFBUUssVUFBUixHQUFxQixFQUFyQjtBQUNBTCxRQUFRTSxPQUFSLEdBQWtCLEVBQWxCO0FBQ0FOLFFBQVFPLElBQVIsR0FBZSxFQUFmO0FBQ0FQLFFBQVFRLGFBQVIsR0FBd0IsRUFBeEIsQzs7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L0NSLGdCQ29DTTtBRC9GUjtBQUREO0FDc0hJO0FEOUhOLFFDcUJHO0FEM0lKO0FBQUEsR0FGRDtBQzBQQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJAZGIgPSB7fVxuaWYgIUNyZWF0b3I/XG5cdEBDcmVhdG9yID0ge31cbkNyZWF0b3IuT2JqZWN0cyA9IHt9XG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge31cbkNyZWF0b3IuTWVudXMgPSBbXVxuQ3JlYXRvci5BcHBzID0ge31cbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9XG5DcmVhdG9yLlJlcG9ydHMgPSB7fVxuQ3JlYXRvci5zdWJzID0ge31cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9IiwidGhpcy5kYiA9IHt9O1xuXG5pZiAodHlwZW9mIENyZWF0b3IgPT09IFwidW5kZWZpbmVkXCIgfHwgQ3JlYXRvciA9PT0gbnVsbCkge1xuICB0aGlzLkNyZWF0b3IgPSB7fTtcbn1cblxuQ3JlYXRvci5PYmplY3RzID0ge307XG5cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fTtcblxuQ3JlYXRvci5NZW51cyA9IFtdO1xuXG5DcmVhdG9yLkFwcHMgPSB7fTtcblxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge307XG5cbkNyZWF0b3IuUmVwb3J0cyA9IHt9O1xuXG5DcmVhdG9yLnN1YnMgPSB7fTtcblxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge307XG4iLCJ0cnlcblx0aWYgcHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnXG5cdFx0c3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcblx0XHRvYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJylcblx0XHRtb2xlY3VsZXIgPSByZXF1aXJlKFwibW9sZWN1bGVyXCIpO1xuXHRcdHBhY2thZ2VMb2FkZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGVvci1wYWNrYWdlLWxvYWRlcicpO1xuXHRcdEFQSVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLWFwaScpO1xuXHRcdE1ldGFkYXRhU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0YWRhdGEtc2VydmVyJyk7XG5cdFx0cGFja2FnZVNlcnZpY2UgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIpO1xuXHRcdHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXHRcdGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcblx0XHRzZXR0aW5ncyA9IHtcblx0XHRcdGJ1aWx0X2luX3BsdWdpbnM6IFtcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1zcGFjZVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLWNtc1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLW9iamVjdC1kYXRhYmFzZVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3MtYXBwcm92YWxcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1jb2xsYWJvcmF0aW9uXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc3RhbmRhcmQtdWlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGFuZGFyZC1wZXJtaXNzaW9uXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvd2ViYXBwLXB1YmxpY1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2FjaGVycy1tYW5hZ2VyXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvdW5wa2dcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93b3JrZmxvd1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL2FjY291bnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvcGx1Z2luLWNvbXBhbnlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9tZXRhZGF0YS1hcGlcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9kYXRhLWltcG9ydFwiLFxuXHRcdFx0XHQjIFwiQHN0ZWVkb3Mvc2VydmljZS1maWVsZHMtaW5kZXhzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1hY2NvdW50c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2hhcnRzXCIsXG5cdFx0XHRcdCMgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1jbG91ZC1pbml0XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIsXG5cdFx0ICAgIFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXRvb2xcIjtcblx0XHRcdFx0IyBcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3NcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93ZWJhcHAtYWNjb3VudHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLXdvcmtmbG93XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wbHVnaW4tYW1pc1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtZmlsZXNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWlkZW50aXR5LWp3dFwiXG5cdFx0XHRdLFxuXHRcdFx0cGx1Z2luczogY29uZmlnLnBsdWdpbnNcblx0XHR9XG5cdFx0TWV0ZW9yLnN0YXJ0dXAgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuXHRcdFx0XHRcdG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG5cdFx0XHRcdFx0bm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuXHRcdFx0XHRcdG1ldGFkYXRhOiB7fSxcblx0XHRcdFx0XHR0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG5cdFx0XHRcdFx0Y2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG5cdFx0XHRcdFx0bG9nTGV2ZWw6IFwid2FyblwiLFxuXHRcdFx0XHRcdHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuXHRcdFx0XHRcdHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG5cdFx0XHRcdFx0bWF4Q2FsbExldmVsOiAxMDAsXG5cblx0XHRcdFx0XHRoZWFydGJlYXRJbnRlcnZhbDogMTAsXG5cdFx0XHRcdFx0aGVhcnRiZWF0VGltZW91dDogMzAsXG5cblx0XHRcdFx0XHRjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG5cblx0XHRcdFx0XHR0cmFja2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaHV0ZG93blRpbWVvdXQ6IDUwMDAsXG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG5cblx0XHRcdFx0XHRyZWdpc3RyeToge1xuXHRcdFx0XHRcdFx0c3RyYXRlZ3k6IFwiUm91bmRSb2JpblwiLFxuXHRcdFx0XHRcdFx0cHJlZmVyTG9jYWw6IHRydWVcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0YnVsa2hlYWQ6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0Y29uY3VycmVuY3k6IDEwLFxuXHRcdFx0XHRcdFx0bWF4UXVldWVTaXplOiAxMDAsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR2YWxpZGF0b3I6IHRydWUsXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBudWxsLFxuXHRcdFx0XHRcdHRyYWNpbmc6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZXhwb3J0ZXI6IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJDb25zb2xlXCIsXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0XHRsb2dnZXI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3JzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0XHRcdFx0Z2F1Z2VXaWR0aDogNDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2tpcFByb2Nlc3NFdmVudFJlZ2lzdHJhdGlvbjogdHJ1ZVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRvYmplY3RxbC5icm9rZXIuaW5pdChicm9rZXIpO1xuXHRcdFx0XHRcblx0XHRcdFx0cHJvamVjdFNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogXCJwcm9qZWN0LXNlcnZlclwiLFxuXHRcdFx0XHRcdG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG5cdFx0XHRcdFx0bWl4aW5zOiBbcGFja2FnZVNlcnZpY2VdLFxuXHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdG1ldGFkYXRhU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiAnbWV0YWRhdGEtc2VydmVyJyxcblx0XHRcdFx0XHRtaXhpbnM6IFtNZXRhZGF0YVNlcnZpY2VdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dWlTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2UocmVxdWlyZShcIkBzdGVlZG9zL3NlcnZpY2UtdWlcIikpO1xuXG5cdFx0XHRcdGFwaVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogXCJhcGlcIixcblx0XHRcdFx0XHRtaXhpbnM6IFtBUElTZXJ2aWNlXSxcblx0XHRcdFx0XHRzZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0cG9ydDogbnVsbFxuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHBhZ2VTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6IFwiQHN0ZWVkb3Mvc2VydmljZS1wYWdlc1wiLFxuXHRcdFx0XHRcdG1peGluczogW3JlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtcGFnZXMnKV0sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdHBvcnQ6IG51bGxcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRzdGVlZG9zU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiBcInN0ZWVkb3Mtc2VydmVyXCIsXG5cdFx0XHRcdFx0bWl4aW5zOiBbXSxcblx0XHRcdFx0XHRzZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0cG9ydDogbnVsbFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c3RhcnRlZDogKCktPlxuXHRcdFx0XHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHRcdFx0XHRicm9rZXIuZW1pdCAnc3RlZWRvcy1zZXJ2ZXIuc3RhcnRlZCdcblx0XHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0XHQsIDEwMDBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0b2JqZWN0cWwuZ2V0U3RlZWRvc1NjaGVtYShicm9rZXIpO1xuXHRcdFx0XHRzdGFuZGFyZE9iamVjdHNEaXIgPSBvYmplY3RxbC5TdGFuZGFyZE9iamVjdHNQYXRoO1xuXHRcdFx0XHRzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiAnc3RhbmRhcmQtb2JqZWN0cycsXG5cdFx0XHRcdFx0bWl4aW5zOiBbcGFja2FnZUxvYWRlcl0sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHsgcGFja2FnZUluZm86IHtcblx0XHRcdFx0XHRcdHBhdGg6IHN0YW5kYXJkT2JqZWN0c0Rpcixcblx0XHRcdFx0XHR9IH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0TWV0ZW9yLndyYXBBc3luYygoY2IpLT5cblx0XHRcdFx0XHRicm9rZXIuc3RhcnQoKS50aGVuKCgpLT5cblx0XHRcdFx0XHRcdGlmICFicm9rZXIuc3RhcnRlZCBcblx0XHRcdFx0XHRcdFx0YnJva2VyLl9yZXN0YXJ0U2VydmljZShzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSk7XG5cdFx0XHRcdFx0XHRcdGJyb2tlci5fcmVzdGFydFNlcnZpY2UodWlTZXJ2aWNlKTtcblxuXHRcdFx0XHRcdFx0ZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcblx0XHRcdFx0XHRcdGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MgPSBleHByZXNzKCk7XG5cdFx0XHRcdFx0XHRjb25uZWN0SGFuZGxlcnNFeHByZXNzLnVzZShyZXF1aXJlKCdAc3RlZWRvcy9yb3V0ZXInKS5zdGF0aWNSb3V0ZXIoKSk7XG5cdFx0XHRcdFx0XHRicm9rZXIud2FpdEZvclNlcnZpY2VzKCd+cGFja2FnZXMtQHN0ZWVkb3Mvc2VydmljZS11aScpLnRoZW4gKCktPlxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnd2FpdEZvclNlcnZpY2VzIH5wYWNrYWdlcy1Ac3RlZWRvcy9zZXJ2aWNlLXVpJylcblx0XHRcdFx0XHRcdFx0Y29ubmVjdEhhbmRsZXJzRXhwcmVzcy51c2UoU3RlZWRvc0FwaS5leHByZXNzKCkpXG5cdFx0XHRcdFx0XHRcdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MpXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdCMgc3RlZWRvc0NvcmUuaW5pdChzZXR0aW5ncykudGhlbiAoKS0+XG5cdFx0XHRcdFx0XHQjIFx0Y2IoKTtcblxuXHRcdFx0XHRcdFx0YnJva2VyLndhaXRGb3JTZXJ2aWNlcyhzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZS5uYW1lKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG5cdFx0XHRcdFx0XHRcdHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4gKCktPlxuXHRcdFx0XHRcdFx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCkoKVxuXHRcdFx0Y2F0Y2ggZXhcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcImVycm9yOlwiLGV4KVxuY2F0Y2ggZVxuXHRjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsZSkiLCJ2YXIgQVBJU2VydmljZSwgTWV0YWRhdGFTZXJ2aWNlLCBjb25maWcsIGUsIG1vbGVjdWxlciwgb2JqZWN0cWwsIHBhY2thZ2VMb2FkZXIsIHBhY2thZ2VTZXJ2aWNlLCBwYXRoLCBzZXR0aW5ncywgc3RlZWRvc0NvcmU7XG5cbnRyeSB7XG4gIGlmIChwcm9jZXNzLmVudi5DUkVBVE9SX05PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJyk7XG4gICAgb2JqZWN0cWwgPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpO1xuICAgIG1vbGVjdWxlciA9IHJlcXVpcmUoXCJtb2xlY3VsZXJcIik7XG4gICAgcGFja2FnZUxvYWRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0ZW9yLXBhY2thZ2UtbG9hZGVyJyk7XG4gICAgQVBJU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtYXBpJyk7XG4gICAgTWV0YWRhdGFTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRhZGF0YS1zZXJ2ZXInKTtcbiAgICBwYWNrYWdlU2VydmljZSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9zZXJ2aWNlLXBhY2thZ2UtcmVnaXN0cnlcIik7XG4gICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICBjb25maWcgPSBvYmplY3RxbC5nZXRTdGVlZG9zQ29uZmlnKCk7XG4gICAgc2V0dGluZ3MgPSB7XG4gICAgICBidWlsdF9pbl9wbHVnaW5zOiBbXCJAc3RlZWRvcy9zdGFuZGFyZC1zcGFjZVwiLCBcIkBzdGVlZG9zL3N0YW5kYXJkLWNtc1wiLCBcIkBzdGVlZG9zL3N0YW5kYXJkLW9iamVjdC1kYXRhYmFzZVwiLCBcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3MtYXBwcm92YWxcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1jb2xsYWJvcmF0aW9uXCIsIFwiQHN0ZWVkb3Mvc3RhbmRhcmQtdWlcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1wZXJtaXNzaW9uXCIsIFwiQHN0ZWVkb3Mvd2ViYXBwLXB1YmxpY1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtY2FjaGVycy1tYW5hZ2VyXCIsIFwiQHN0ZWVkb3MvdW5wa2dcIiwgXCJAc3RlZWRvcy93b3JrZmxvd1wiLCBcIkBzdGVlZG9zL2FjY291bnRzXCIsIFwiQHN0ZWVkb3MvcGx1Z2luLWNvbXBhbnlcIiwgXCJAc3RlZWRvcy9tZXRhZGF0YS1hcGlcIiwgXCJAc3RlZWRvcy9kYXRhLWltcG9ydFwiLCBcIkBzdGVlZG9zL3NlcnZpY2UtYWNjb3VudHNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWNoYXJ0c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtY2xvdWQtaW5pdFwiLCBcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS1yZWdpc3RyeVwiLCBcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS10b29sXCIsIFwiQHN0ZWVkb3Mvd2ViYXBwLWFjY291bnRzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS13b3JrZmxvd1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtcGx1Z2luLWFtaXNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWZpbGVzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1pZGVudGl0eS1qd3RcIl0sXG4gICAgICBwbHVnaW5zOiBjb25maWcucGx1Z2luc1xuICAgIH07XG4gICAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXBpU2VydmljZSwgYnJva2VyLCBleCwgbWV0YWRhdGFTZXJ2aWNlLCBwYWdlU2VydmljZSwgcHJvamVjdFNlcnZpY2UsIHN0YW5kYXJkT2JqZWN0c0Rpciwgc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UsIHN0ZWVkb3NTZXJ2aWNlLCB1aVNlcnZpY2U7XG4gICAgICB0cnkge1xuICAgICAgICBicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuICAgICAgICAgIG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG4gICAgICAgICAgbm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuICAgICAgICAgIG1ldGFkYXRhOiB7fSxcbiAgICAgICAgICB0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG4gICAgICAgICAgY2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG4gICAgICAgICAgbG9nTGV2ZWw6IFwid2FyblwiLFxuICAgICAgICAgIHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuICAgICAgICAgIHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG4gICAgICAgICAgbWF4Q2FsbExldmVsOiAxMDAsXG4gICAgICAgICAgaGVhcnRiZWF0SW50ZXJ2YWw6IDEwLFxuICAgICAgICAgIGhlYXJ0YmVhdFRpbWVvdXQ6IDMwLFxuICAgICAgICAgIGNvbnRleHRQYXJhbXNDbG9uaW5nOiBmYWxzZSxcbiAgICAgICAgICB0cmFja2luZzoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBzaHV0ZG93blRpbWVvdXQ6IDUwMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG4gICAgICAgICAgcmVnaXN0cnk6IHtcbiAgICAgICAgICAgIHN0cmF0ZWd5OiBcIlJvdW5kUm9iaW5cIixcbiAgICAgICAgICAgIHByZWZlckxvY2FsOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWxraGVhZDoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBjb25jdXJyZW5jeTogMTAsXG4gICAgICAgICAgICBtYXhRdWV1ZVNpemU6IDEwMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdmFsaWRhdG9yOiB0cnVlLFxuICAgICAgICAgIGVycm9ySGFuZGxlcjogbnVsbCxcbiAgICAgICAgICB0cmFjaW5nOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGV4cG9ydGVyOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiQ29uc29sZVwiLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvbG9yczogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgICAgICAgIGdhdWdlV2lkdGg6IDQwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNraXBQcm9jZXNzRXZlbnRSZWdpc3RyYXRpb246IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIG9iamVjdHFsLmJyb2tlci5pbml0KGJyb2tlcik7XG4gICAgICAgIHByb2plY3RTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6IFwicHJvamVjdC1zZXJ2ZXJcIixcbiAgICAgICAgICBuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuICAgICAgICAgIG1peGluczogW3BhY2thZ2VTZXJ2aWNlXVxuICAgICAgICB9KTtcbiAgICAgICAgbWV0YWRhdGFTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6ICdtZXRhZGF0YS1zZXJ2ZXInLFxuICAgICAgICAgIG1peGluczogW01ldGFkYXRhU2VydmljZV0sXG4gICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgIH0pO1xuICAgICAgICB1aVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZShyZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS11aVwiKSk7XG4gICAgICAgIGFwaVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogXCJhcGlcIixcbiAgICAgICAgICBtaXhpbnM6IFtBUElTZXJ2aWNlXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcG9ydDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhZ2VTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6IFwiQHN0ZWVkb3Mvc2VydmljZS1wYWdlc1wiLFxuICAgICAgICAgIG1peGluczogW3JlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtcGFnZXMnKV0sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHBvcnQ6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzdGVlZG9zU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiBcInN0ZWVkb3Mtc2VydmVyXCIsXG4gICAgICAgICAgbWl4aW5zOiBbXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcG9ydDogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3RhcnRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgYnJva2VyLmVtaXQoJ3N0ZWVkb3Mtc2VydmVyLnN0YXJ0ZWQnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9iamVjdHFsLmdldFN0ZWVkb3NTY2hlbWEoYnJva2VyKTtcbiAgICAgICAgc3RhbmRhcmRPYmplY3RzRGlyID0gb2JqZWN0cWwuU3RhbmRhcmRPYmplY3RzUGF0aDtcbiAgICAgICAgc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogJ3N0YW5kYXJkLW9iamVjdHMnLFxuICAgICAgICAgIG1peGluczogW3BhY2thZ2VMb2FkZXJdLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbzoge1xuICAgICAgICAgICAgICBwYXRoOiBzdGFuZGFyZE9iamVjdHNEaXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihjYikge1xuICAgICAgICAgIHJldHVybiBicm9rZXIuc3RhcnQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MsIGV4cHJlc3M7XG4gICAgICAgICAgICBpZiAoIWJyb2tlci5zdGFydGVkKSB7XG4gICAgICAgICAgICAgIGJyb2tlci5fcmVzdGFydFNlcnZpY2Uoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UpO1xuICAgICAgICAgICAgICBicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKHVpU2VydmljZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuICAgICAgICAgICAgY29ubmVjdEhhbmRsZXJzRXhwcmVzcyA9IGV4cHJlc3MoKTtcbiAgICAgICAgICAgIGNvbm5lY3RIYW5kbGVyc0V4cHJlc3MudXNlKHJlcXVpcmUoJ0BzdGVlZG9zL3JvdXRlcicpLnN0YXRpY1JvdXRlcigpKTtcbiAgICAgICAgICAgIGJyb2tlci53YWl0Rm9yU2VydmljZXMoJ35wYWNrYWdlcy1Ac3RlZWRvcy9zZXJ2aWNlLXVpJykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3dhaXRGb3JTZXJ2aWNlcyB+cGFja2FnZXMtQHN0ZWVkb3Mvc2VydmljZS11aScpO1xuICAgICAgICAgICAgICBjb25uZWN0SGFuZGxlcnNFeHByZXNzLnVzZShTdGVlZG9zQXBpLmV4cHJlc3MoKSk7XG4gICAgICAgICAgICAgIHJldHVybiBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShjb25uZWN0SGFuZGxlcnNFeHByZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGJyb2tlci53YWl0Rm9yU2VydmljZXMoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UubmFtZSkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGUgPSBlcnJvcjtcbiAgY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBlKTtcbn1cbiIsIkNyZWF0b3IuZGVwcyA9IHtcblx0YXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG5cdEFwcHM6IHt9LFxuXHRPYmplY3RzOiB7fVxufVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7b3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Y3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cbiMgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzIOS+m3N0ZWVkb3MtY2xp6aG555uu5L2/55SoXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXHRDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRcdEZpYmVyKCgpLT5cblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcblx0XHQpLnJ1bigpXG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IG9iai5uYW1lXG5cblx0aWYgIW9iai5saXN0X3ZpZXdzXG5cdFx0b2JqLmxpc3Rfdmlld3MgPSB7fVxuXG5cdGlmIG9iai5zcGFjZVxuXHRcdG9iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmopXG5cdGlmIG9iamVjdF9uYW1lID09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCdcblx0XHRvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcblx0XHRvYmogPSBfLmNsb25lKG9iailcblx0XHRvYmoubmFtZSA9IG9iamVjdF9uYW1lXG5cdFx0Q3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9ialxuXG5cdENyZWF0b3IuY29udmVydE9iamVjdChvYmopXG5cdG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuXG5cdENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKVxuXHRDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXG5cdHJldHVybiBvYmpcblxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gKG9iamVjdCkgLT5cblx0aWYgb2JqZWN0LnNwYWNlXG5cdFx0cmV0dXJuIFwiY18je29iamVjdC5zcGFjZX1fI3tvYmplY3QubmFtZX1cIlxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcblxuQ3JlYXRvci5nZXRPYmplY3QgPSAob2JqZWN0X25hbWUsIHNwYWNlX2lkKS0+XG5cdGlmIF8uaXNBcnJheShvYmplY3RfbmFtZSlcblx0XHRyZXR1cm4gO1xuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRDcmVhdG9yLmRlcHM/Lm9iamVjdD8uZGVwZW5kKClcblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuI1x0aWYgIXNwYWNlX2lkICYmIG9iamVjdF9uYW1lXG4jXHRcdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKVxuI1x0XHRcdHNwYWNlX2lkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cblx0aWYgb2JqZWN0X25hbWVcbiNcdFx0aWYgc3BhY2VfaWRcbiNcdFx0XHRvYmogPSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbXCJjXyN7c3BhY2VfaWR9XyN7b2JqZWN0X25hbWV9XCJdXG4jXHRcdFx0aWYgb2JqXG4jXHRcdFx0XHRyZXR1cm4gb2JqXG4jXG4jXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XG4jXHRcdFx0XHRyZXR1cm4gby5fY29sbGVjdGlvbl9uYW1lID09IG9iamVjdF9uYW1lXG4jXHRcdGlmIG9ialxuI1x0XHRcdHJldHVybiBvYmpcblxuXHRcdHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IChvYmplY3RfaWQpLT5cblx0cmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge19pZDogb2JqZWN0X2lkfSlcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSAob2JqZWN0X25hbWUpLT5cblx0Y29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0aWYgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/Ll9jb2xsZWN0aW9uX25hbWUgfHwgb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxuXHRkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0c3BhY2UgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKT8uZGI/LmZpbmRPbmUoc3BhY2VJZCx7ZmllbGRzOnthZG1pbnM6MX19KVxuXHRpZiBzcGFjZT8uYWRtaW5zXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMFxuXG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKS0+XG5cblx0aWYgIV8uaXNTdHJpbmcoZm9ybXVsYXIpXG5cdFx0cmV0dXJuIGZvcm11bGFyXG5cblx0aWYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpXG5cdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKVxuXG5cdHJldHVybiBmb3JtdWxhclxuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IChmaWx0ZXJzLCBjb250ZXh0KS0+XG5cdHNlbGVjdG9yID0ge31cblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cblx0XHRpZiBmaWx0ZXI/Lmxlbmd0aCA9PSAzXG5cdFx0XHRuYW1lID0gZmlsdGVyWzBdXG5cdFx0XHRhY3Rpb24gPSBmaWx0ZXJbMV1cblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KVxuXHRcdFx0c2VsZWN0b3JbbmFtZV0gPSB7fVxuXHRcdFx0c2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlXG5cdCMgY29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3Rvcilcblx0cmV0dXJuIHNlbGVjdG9yXG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IChzcGFjZUlkKSAtPlxuXHRyZXR1cm4gc3BhY2VJZCA9PSAnY29tbW9uJ1xuXG4jIyNcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuIyMjXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IChkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KS0+XG5cblx0aWYgIWlkX2tleVxuXHRcdGlkX2tleSA9IFwiX2lkXCJcblxuXHRpZiBoaXRfZmlyc3RcblxuXHRcdCPnlLHkuo7kuI3og73kvb/nlKhfLmZpbmRJbmRleOWHveaVsO+8jOWboOatpOatpOWkhOWFiOWwhuWvueixoeaVsOe7hOi9rOS4uuaZrumAmuaVsOe7hOexu+Wei++8jOWcqOiOt+WPluWFtmluZGV4XG5cdFx0dmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpXG5cblx0XHRyZXR1cm5cdF8uc29ydEJ5IGRvY3MsIChkb2MpLT5cblx0XHRcdFx0XHRfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcblx0XHRcdFx0XHRpZiBfaW5kZXggPiAtMVxuXHRcdFx0XHRcdFx0cmV0dXJuIF9pbmRleFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pXG5cdGVsc2Vcblx0XHRyZXR1cm5cdF8uc29ydEJ5IGRvY3MsIChkb2MpLT5cblx0XHRcdHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcblxuIyMjXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiMjI1xuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gKHZhbHVlMSwgdmFsdWUyKSAtPlxuXHRpZiB0aGlzLmtleVxuXHRcdHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV1cblx0XHR2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldXG5cdGlmIHZhbHVlMSBpbnN0YW5jZW9mIERhdGVcblx0XHR2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpXG5cdGlmIHZhbHVlMiBpbnN0YW5jZW9mIERhdGVcblx0XHR2YWx1ZTIgPSB2YWx1ZTIuZ2V0VGltZSgpXG5cdGlmIHR5cGVvZiB2YWx1ZTEgaXMgXCJudW1iZXJcIiBhbmQgdHlwZW9mIHZhbHVlMiBpcyBcIm51bWJlclwiXG5cdFx0cmV0dXJuIHZhbHVlMSAtIHZhbHVlMlxuXHQjIEhhbmRsaW5nIG51bGwgdmFsdWVzXG5cdGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT0gbnVsbCBvciB2YWx1ZTEgPT0gdW5kZWZpbmVkXG5cdGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT0gbnVsbCBvciB2YWx1ZTIgPT0gdW5kZWZpbmVkXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kICFpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIC0xXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gMFxuXHRpZiAhaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAxXG5cdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0cmV0dXJuIHZhbHVlMS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUgdmFsdWUyLnRvU3RyaW5nKCksIGxvY2FsZVxuXG5cbiMg6K+l5Ye95pWw5Y+q5Zyo5Yid5aeL5YyWT2JqZWN05pe277yM5oqK55u45YWz5a+56LGh55qE6K6h566X57uT5p6c5L+d5a2Y5YiwT2JqZWN055qEcmVsYXRlZF9vYmplY3Rz5bGe5oCn5Lit77yM5ZCO57ut5Y+v5Lul55u05o6l5LuOcmVsYXRlZF9vYmplY3Rz5bGe5oCn5Lit5Y+W5b6X6K6h566X57uT5p6c6ICM5LiN55So5YaN5qyh6LCD55So6K+l5Ye95pWw5p2l6K6h566XXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gKG9iamVjdF9uYW1lKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0cmVsYXRlZF9vYmplY3RzID0gW11cblx0IyBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdCMg5ZugQ3JlYXRvci5nZXRPYmplY3Tlh73mlbDlhoXpg6jopoHosIPnlKjor6Xlh73mlbDvvIzmiYDku6Xov5nph4zkuI3lj6/ku6XosIPnlKhDcmVhdG9yLmdldE9iamVjdOWPluWvueixoe+8jOWPquiDveiwg+eUqENyZWF0b3IuT2JqZWN0c+adpeWPluWvueixoVxuXHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRpZiAhX29iamVjdFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdHNcblx0XG5cdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxuXHRpZiBNZXRlb3IuaXNDbGllbnQgJiYgIV8uaXNFbXB0eSByZWxhdGVkTGlzdFxuXHRcdHJlbGF0ZWRMaXN0TWFwID0ge31cblx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpOYW1lKS0+XG5cdFx0XHRpZiBfLmlzT2JqZWN0IG9iak5hbWVcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZS5vYmplY3ROYW1lXSA9IHt9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWVdID0ge31cblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIikgYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PSBvYmplY3RfbmFtZSBhbmQgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV1cblx0XHRcdFx0XHQjIOW9k3JlbGF0ZWRfb2JqZWN0LmZpZWxkc+S4reacieS4pOS4quaIluS7peS4iueahOWtl+auteaMh+WQkW9iamVjdF9uYW1l6KGo56S655qE5a+56LGh5pe277yM5LyY5YWI5Y+W56ys5LiA5Liq5L2c5Li65aSW6ZSu5YWz57O75a2X5q6177yM5L2G5pivcmVsYXRlZF9maWVsZOS4uuS4u+WtkOihqOaXtuW8uuihjOimhuebluS5i+WJjeeahHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVd5YC8XG5cdFx0XHRcdFx0aWYgXy5pc0VtcHR5IHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIlxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7IG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10gPSB7IG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLCBmb3JlaWduX2tleTogXCJwYXJlbnRcIiB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7IG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLCBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCIgfVxuXHRcdF8uZWFjaCBbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgKGVuYWJsZU9iak5hbWUpLT5cblx0XHRcdGlmIHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdID0geyBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiIH1cblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddXG5cdFx0XHQjcmVjb3JkIOivpue7huS4i+eahGF1ZGl0X3JlY29yZHPku4Vtb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5Y+v6KeBXG5cdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXG5cdFx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddID0geyBvYmplY3RfbmFtZTpcImF1ZGl0X3JlY29yZHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiIH1cblx0XHRyZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyByZWxhdGVkTGlzdE1hcFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdHNcblxuXHRpZiBfb2JqZWN0LmVuYWJsZV9maWxlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImNtc19maWxlc1wiLCBmb3JlaWduX2tleTogXCJwYXJlbnRcIn1cblxuXHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxuXHRcdFx0IyBjZnMuZmlsZXMuZmlsZXJlY29yZOWvueixoeWcqOesrOS6jOasoeeCueWHu+eahOaXtuWAmXJlbGF0ZWRfb2JqZWN06L+U5Zue55qE5pivYXBwLWJ1aWxkZXLkuK3nmoRcIm1ldGFkYXRhLnBhcmVudFwi5a2X5q616KKr5Yig6Zmk5LqG77yM6K6w5YiwbWV0YWRhdGHlrZfmrrXnmoRzdWJfZmllbGRz5Lit5LqG77yM5omA5Lul6KaB5Y2V54us5aSE55CG44CCXG5cdFx0XHRzZnNGaWxlc09iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIilcblx0XHRcdHNmc0ZpbGVzT2JqZWN0ICYmIHJlbGF0ZWRfb2JqZWN0ID0gc2ZzRmlsZXNPYmplY3Rcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XG5cdFx0XHRpZiAocmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIHx8IChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIiAmJiByZWxhdGVkX2ZpZWxkLnJlbGF0ZWRMaXN0KSkgYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PSBvYmplY3RfbmFtZVxuXHRcdFx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwib2JqZWN0X2ZpZWxkc1wiXG5cdFx0XHRcdFx0I1RPRE8g5b6F55u45YWz5YiX6KGo5pSv5oyB5o6S5bqP5ZCO77yM5Yig6Zmk5q2k5Yik5patXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RzLnNwbGljZSgwLCAwLCB7b2JqZWN0X25hbWU6cmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZX0pXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6cmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWR9XG5cblx0aWYgX29iamVjdC5lbmFibGVfdGFza3Ncblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJ0YXNrc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX25vdGVzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwibm90ZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ldmVudHNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJldmVudHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9pbnN0YW5jZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9hcHByb3ZhbHNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhcHByb3ZhbHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9wcm9jZXNzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwicHJvY2Vzc19pbnN0YW5jZV9oaXN0b3J5XCIsIGZvcmVpZ25fa2V5OiBcInRhcmdldF9vYmplY3RcIn1cblx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXG5cdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImF1ZGl0X3JlY29yZHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9ICh1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRyZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFRcblx0ZWxzZVxuXHRcdGlmICEodXNlcklkIGFuZCBzcGFjZUlkKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCJcblx0XHRcdHJldHVybiBudWxsXG5cdFx0c3VGaWVsZHMgPSB7bmFtZTogMSwgbW9iaWxlOiAxLCBwb3NpdGlvbjogMSwgZW1haWw6IDEsIGNvbXBhbnk6IDEsIG9yZ2FuaXphdGlvbjogMSwgc3BhY2U6IDEsIGNvbXBhbnlfaWQ6IDEsIGNvbXBhbnlfaWRzOiAxfVxuXHRcdCMgY2hlY2sgaWYgdXNlciBpbiB0aGUgc3BhY2Vcblx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxuXHRcdGlmICFzdVxuXHRcdFx0c3BhY2VJZCA9IG51bGxcblxuXHRcdCMgaWYgc3BhY2VJZCBub3QgZXhpc3RzLCBnZXQgdGhlIGZpcnN0IG9uZS5cblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0aWYgaXNVblNhZmVNb2RlXG5cdFx0XHRcdHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3VzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcblx0XHRcdFx0aWYgIXN1XG5cdFx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdFx0c3BhY2VJZCA9IHN1LnNwYWNlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBudWxsXG5cblx0XHRVU0VSX0NPTlRFWFQgPSB7fVxuXHRcdFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWRcblx0XHRVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWRcblx0XHRVU0VSX0NPTlRFWFQudXNlciA9IHtcblx0XHRcdF9pZDogdXNlcklkXG5cdFx0XHRuYW1lOiBzdS5uYW1lLFxuXHRcdFx0bW9iaWxlOiBzdS5tb2JpbGUsXG5cdFx0XHRwb3NpdGlvbjogc3UucG9zaXRpb24sXG5cdFx0XHRlbWFpbDogc3UuZW1haWxcblx0XHRcdGNvbXBhbnk6IHN1LmNvbXBhbnlcblx0XHRcdGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWRcblx0XHRcdGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuXHRcdH1cblx0XHRzcGFjZV91c2VyX29yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIik/LmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKVxuXHRcdGlmIHNwYWNlX3VzZXJfb3JnXG5cdFx0XHRVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG5cdFx0XHRcdF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuXHRcdFx0XHRuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuXHRcdFx0XHRmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcblx0XHRcdH1cblx0XHRyZXR1cm4gVVNFUl9DT05URVhUXG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSAodXJsKS0+XG5cblx0aWYgXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICh1cmw/LnN0YXJ0c1dpdGgoXCIvYXNzZXRzXCIpIHx8IHVybD8uc3RhcnRzV2l0aChcImFzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCIvcGFja2FnZXNcIikpXG5cdFx0aWYgIS9eXFwvLy50ZXN0KHVybClcblx0XHRcdHVybCA9IFwiL1wiICsgdXJsXG5cdFx0cmV0dXJuIHVybFxuXG5cdGlmIHVybFxuXHRcdCMgdXJs5byA5aS05rKh5pyJXCIvXCLvvIzpnIDopoHmt7vliqBcIi9cIlxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsXG5cdGVsc2Vcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWFxuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSAodXNlcklkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxuXHRlbHNlXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkOjF9fSlcblx0cmV0dXJuIHN1LmNvbXBhbnlfaWRcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9ICh1c2VySWQsIHNwYWNlSWQpLT5cblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpXG5cdGVsc2Vcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKVxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWRzOjF9fSlcblx0cmV0dXJuIHN1Py5jb21wYW55X2lkc1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IChwbyktPlxuXHRpZiBwby5hbGxvd0NyZWF0ZVxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0XG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLnZpZXdBbGxSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHRwby52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0cG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXHRcdFxuXHQjIOWmguaenOmZhOS7tuebuOWFs+adg+mZkOmFjee9ruS4uuepuu+8jOWImeWFvOWuueS5i+WJjeayoeaciemZhOS7tuadg+mZkOmFjee9ruaXtueahOinhOWImVxuXHRpZiBwby5hbGxvd1JlYWRcblx0XHR0eXBlb2YgcG8uYWxsb3dSZWFkRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdFx0dHlwZW9mIHBvLnZpZXdBbGxGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby52aWV3QWxsRmlsZXMgPSB0cnVlXG5cdGlmIHBvLmFsbG93RWRpdFxuXHRcdHR5cGVvZiBwby5hbGxvd0NyZWF0ZUZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93Q3JlYXRlRmlsZXMgPSB0cnVlXG5cdFx0dHlwZW9mIHBvLmFsbG93RWRpdEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby5hbGxvd0RlbGV0ZUZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlXG5cdGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcblx0XHR0eXBlb2YgcG8ubW9kaWZ5QWxsRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8ubW9kaWZ5QWxsRmlsZXMgPSB0cnVlXG5cblx0aWYgcG8uYWxsb3dDcmVhdGVGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0VkaXRGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0RlbGV0ZUZpbGVzXG5cdFx0cG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlXG5cdFx0cG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdGlmIHBvLnZpZXdBbGxGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRcdHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlXG5cdFx0cG8udmlld0FsbEZpbGVzID0gdHJ1ZVxuXG5cdHJldHVybiBwb1xuXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9ICgpLT5cblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZFxuXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gKCktPlxuXHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWRcblxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSAoc3BhY2VJZCktPlxuXHRpZiBzcGFjZUlkICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZCA9PSBzcGFjZUlkXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSAoc3BhY2VJZCktPlxuXHRpZiBzcGFjZUlkICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkID09IHNwYWNlSWRcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSXG5cdCIsInZhciBGaWJlcjtcblxuQ3JlYXRvci5kZXBzID0ge1xuICBhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3ksXG4gIG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG4gIEFwcHM6IHt9LFxuICBPYmplY3RzOiB7fVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIG9wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICByZXR1cm4gU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGNyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG59KTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSk7XG4gICAgfSkucnVuKCk7XG4gIH07XG59XG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iai5uYW1lO1xuICB9XG4gIGlmICghb2JqLmxpc3Rfdmlld3MpIHtcbiAgICBvYmoubGlzdF92aWV3cyA9IHt9O1xuICB9XG4gIGlmIChvYmouc3BhY2UpIHtcbiAgICBvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUgPT09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCcpIHtcbiAgICBvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCc7XG4gICAgb2JqID0gXy5jbG9uZShvYmopO1xuICAgIG9iai5uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9iajtcbiAgfVxuICBDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKTtcbiAgbmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG4gIENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5pbml0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIG9iajtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0LnNwYWNlKSB7XG4gICAgcmV0dXJuIFwiY19cIiArIG9iamVjdC5zcGFjZSArIFwiX1wiICsgb2JqZWN0Lm5hbWU7XG4gIH1cbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgaWYgKF8uaXNBcnJheShvYmplY3RfbmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgICBpZiAoKHJlZjEgPSByZWYub2JqZWN0KSAhPSBudWxsKSB7XG4gICAgICAgIHJlZjEuZGVwZW5kKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSBmdW5jdGlvbihvYmplY3RfaWQpIHtcbiAgcmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge1xuICAgIF9pZDogb2JqZWN0X2lkXG4gIH0pO1xufTtcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSk7XG4gIGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zWygocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLl9jb2xsZWN0aW9uX25hbWUgOiB2b2lkIDApIHx8IG9iamVjdF9uYW1lXTtcbiAgfVxufTtcblxuQ3JlYXRvci5yZW1vdmVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXTtcbn07XG5cbkNyZWF0b3IuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciByZWYsIHJlZjEsIHNwYWNlO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBzcGFjZSA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmRiKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHNwYWNlSWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGFkbWluczogMVxuICAgIH1cbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIGlmIChzcGFjZSAhPSBudWxsID8gc3BhY2UuYWRtaW5zIDogdm9pZCAwKSB7XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfVxufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucykge1xuICBpZiAoIV8uaXNTdHJpbmcoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIGZvcm11bGFyO1xuICB9XG4gIGlmIChDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG4gIHJldHVybiBmb3JtdWxhcjtcbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgY29udGV4dCkge1xuICB2YXIgc2VsZWN0b3I7XG4gIHNlbGVjdG9yID0ge307XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgYWN0aW9uLCBuYW1lLCB2YWx1ZTtcbiAgICBpZiAoKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLmxlbmd0aCA6IHZvaWQgMCkgPT09IDMpIHtcbiAgICAgIG5hbWUgPSBmaWx0ZXJbMF07XG4gICAgICBhY3Rpb24gPSBmaWx0ZXJbMV07XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgY29udGV4dCk7XG4gICAgICBzZWxlY3RvcltuYW1lXSA9IHt9O1xuICAgICAgcmV0dXJuIHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQ29tbW9uU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHJldHVybiBzcGFjZUlkID09PSAnY29tbW9uJztcbn07XG5cblxuLypcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuICovXG5cbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gZnVuY3Rpb24oZG9jcywgaWRzLCBpZF9rZXksIGhpdF9maXJzdCkge1xuICB2YXIgdmFsdWVzO1xuICBpZiAoIWlkX2tleSkge1xuICAgIGlkX2tleSA9IFwiX2lkXCI7XG4gIH1cbiAgaWYgKGhpdF9maXJzdCkge1xuICAgIHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KTtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICB2YXIgX2luZGV4O1xuICAgICAgX2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgICAgaWYgKF9pbmRleCA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfaW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaWRzLmxlbmd0aCArIF8uaW5kZXhPZih2YWx1ZXMsIGRvY1tpZF9rZXldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICByZXR1cm4gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5cbi8qXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiAqL1xuXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSBmdW5jdGlvbih2YWx1ZTEsIHZhbHVlMikge1xuICB2YXIgaXNWYWx1ZTFFbXB0eSwgaXNWYWx1ZTJFbXB0eSwgbG9jYWxlO1xuICBpZiAodGhpcy5rZXkpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldO1xuICAgIHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV07XG4gIH1cbiAgaWYgKHZhbHVlMSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlMSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgdmFsdWUyID09PSBcIm51bWJlclwiKSB7XG4gICAgcmV0dXJuIHZhbHVlMSAtIHZhbHVlMjtcbiAgfVxuICBpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09PSBudWxsIHx8IHZhbHVlMSA9PT0gdm9pZCAwO1xuICBpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09PSBudWxsIHx8IHZhbHVlMiA9PT0gdm9pZCAwO1xuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiAhaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgaWYgKCFpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICByZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSh2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlKTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRMaXN0LCByZWxhdGVkTGlzdE1hcCwgcmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmICFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgcmVsYXRlZExpc3RNYXAgPSB7fTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3QsIGZ1bmN0aW9uKG9iak5hbWUpIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KG9iak5hbWUpKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lLm9iamVjdE5hbWVdID0ge307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgcmVsYXRlZF9maWVsZC50eXBlID09PSBcImxvb2t1cFwiKSAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUgJiYgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0pIHtcbiAgICAgICAgICBpZiAoXy5pc0VtcHR5KHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7XG4gICAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICAgIH07XG4gICAgfVxuICAgIF8uZWFjaChbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgZnVuY3Rpb24oZW5hYmxlT2JqTmFtZSkge1xuICAgICAgaWYgKHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSxcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSkge1xuICAgICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyhyZWxhdGVkTGlzdE1hcCk7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZmlsZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgc2ZzRmlsZXNPYmplY3Q7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgICAgc2ZzRmlsZXNPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpO1xuICAgICAgc2ZzRmlsZXNPYmplY3QgJiYgKHJlbGF0ZWRfb2JqZWN0ID0gc2ZzRmlsZXNPYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiAmJiByZWxhdGVkX2ZpZWxkLnJlbGF0ZWRMaXN0KSkgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcIm9iamVjdF9maWVsZHNcIikge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBpZiAoX29iamVjdC5lbmFibGVfdGFza3MpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJ0YXNrc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX25vdGVzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwibm90ZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ldmVudHMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJldmVudHNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9pbnN0YW5jZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9hcHByb3ZhbHMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJhcHByb3ZhbHNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9wcm9jZXNzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwicHJvY2Vzc19pbnN0YW5jZV9oaXN0b3J5XCIsXG4gICAgICBmb3JlaWduX2tleTogXCJ0YXJnZXRfb2JqZWN0XCJcbiAgICB9KTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpIHtcbiAgdmFyIFVTRVJfQ09OVEVYVCwgcmVmLCBzcGFjZV91c2VyX29yZywgc3UsIHN1RmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUO1xuICB9IGVsc2Uge1xuICAgIGlmICghKHVzZXJJZCAmJiBzcGFjZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN1RmllbGRzID0ge1xuICAgICAgbmFtZTogMSxcbiAgICAgIG1vYmlsZTogMSxcbiAgICAgIHBvc2l0aW9uOiAxLFxuICAgICAgZW1haWw6IDEsXG4gICAgICBjb21wYW55OiAxLFxuICAgICAgb3JnYW5pemF0aW9uOiAxLFxuICAgICAgc3BhY2U6IDEsXG4gICAgICBjb21wYW55X2lkOiAxLFxuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9O1xuICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgfSk7XG4gICAgaWYgKCFzdSkge1xuICAgICAgc3BhY2VJZCA9IG51bGw7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgaWYgKGlzVW5TYWZlTW9kZSkge1xuICAgICAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghc3UpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzcGFjZUlkID0gc3Uuc3BhY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgVVNFUl9DT05URVhUID0ge307XG4gICAgVVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZDtcbiAgICBVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWQ7XG4gICAgVVNFUl9DT05URVhULnVzZXIgPSB7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIG5hbWU6IHN1Lm5hbWUsXG4gICAgICBtb2JpbGU6IHN1Lm1vYmlsZSxcbiAgICAgIHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcbiAgICAgIGVtYWlsOiBzdS5lbWFpbCxcbiAgICAgIGNvbXBhbnk6IHN1LmNvbXBhbnksXG4gICAgICBjb21wYW55X2lkOiBzdS5jb21wYW55X2lkLFxuICAgICAgY29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXG4gICAgfTtcbiAgICBzcGFjZV91c2VyX29yZyA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpKSAhPSBudWxsID8gcmVmLmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKSA6IHZvaWQgMDtcbiAgICBpZiAoc3BhY2VfdXNlcl9vcmcpIHtcbiAgICAgIFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcbiAgICAgICAgX2lkOiBzcGFjZV91c2VyX29yZy5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXG4gICAgICAgIGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFVTRVJfQ09OVEVYVDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICBpZiAoXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICgodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9hc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSA6IHZvaWQgMCkpKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBpZiAodXJsKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWQ6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UuY29tcGFueV9pZDtcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdSAhPSBudWxsID8gc3UuY29tcGFueV9pZHMgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHBvKSB7XG4gIGlmIChwby5hbGxvd0NyZWF0ZSkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93UmVhZCkge1xuICAgIHR5cGVvZiBwby5hbGxvd1JlYWRGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZSk7XG4gICAgdHlwZW9mIHBvLnZpZXdBbGxGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLnZpZXdBbGxGaWxlcyA9IHRydWUpO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICB0eXBlb2YgcG8uYWxsb3dDcmVhdGVGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93Q3JlYXRlRmlsZXMgPSB0cnVlKTtcbiAgICB0eXBlb2YgcG8uYWxsb3dFZGl0RmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd0VkaXRGaWxlcyA9IHRydWUpO1xuICAgIHR5cGVvZiBwby5hbGxvd0RlbGV0ZUZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWUpO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgdHlwZW9mIHBvLm1vZGlmeUFsbEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8ubW9kaWZ5QWxsRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8uYWxsb3dDcmVhdGVGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0RmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlRmlsZXMpIHtcbiAgICBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWU7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsRmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZTtcbiAgICBwby52aWV3QWxsRmlsZXMgPSB0cnVlO1xuICB9XG4gIHJldHVybiBwbztcbn07XG5cbkNyZWF0b3IuZ2V0VGVtcGxhdGVTcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0Q2xvdWRBZG1pblNwYWNlSWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYuY2xvdWRBZG1pblNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmlzVGVtcGxhdGVTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKHNwYWNlSWQgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYudGVtcGxhdGVTcGFjZUlkIDogdm9pZCAwKSA9PT0gc3BhY2VJZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwKSA9PT0gc3BhY2VJZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVI7XG59XG4iLCJNZXRlb3IubWV0aG9kc1xuXHQjIOeUqOaIt+iOt+WPlmxvb2t1cCDjgIFtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q6155qE6YCJ6aG55YC8XG5cdFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiAob3B0aW9ucyktPlxuXHRcdGlmIG9wdGlvbnM/LnBhcmFtcz8ucmVmZXJlbmNlX3RvXG5cblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpXG5cblx0XHRcdG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cblx0XHRcdHF1ZXJ5ID0ge31cblx0XHRcdGlmIG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cdFx0XHRcdHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2VcblxuXHRcdFx0XHRzb3J0ID0gb3B0aW9ucz8uc29ydFxuXG5cdFx0XHRcdHNlbGVjdGVkID0gb3B0aW9ucz8uc2VsZWN0ZWQgfHwgW11cblxuXHRcdFx0XHRvcHRpb25zX2xpbWl0ID0gb3B0aW9ucz8ub3B0aW9uc19saW1pdCB8fCAxMFxuXG5cdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeSA9IHt9XG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH1cblxuXHRcdFx0XHRpZiBvcHRpb25zPy52YWx1ZXM/Lmxlbmd0aFxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX0sIHNlYXJjaFRleHRRdWVyeV1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fV1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0Xy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSlcblx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JG5pbjogc2VsZWN0ZWR9XG5cblx0XHRcdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxuXG5cdFx0XHRcdGlmIG9wdGlvbnMuZmlsdGVyUXVlcnlcblx0XHRcdFx0XHRfLmV4dGVuZCBxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeVxuXG5cdFx0XHRcdHF1ZXJ5X29wdGlvbnMgPSB7bGltaXQ6IG9wdGlvbnNfbGltaXR9XG5cblx0XHRcdFx0aWYgc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpXG5cdFx0XHRcdFx0cXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydFxuXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKClcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBbXVxuXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY29yZHMsIChyZWNvcmQpLT5cblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcmVjb3JkLl9pZFxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcblx0XHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpXG5cdFx0cmV0dXJuIFtdICIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZSwgbmFtZV9maWVsZF9rZXksIG9iamVjdCwgb3B0aW9uc19saW1pdCwgcXVlcnksIHF1ZXJ5X29wdGlvbnMsIHJlY29yZHMsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2VhcmNoVGV4dFF1ZXJ5LCBzZWxlY3RlZCwgc29ydDtcbiAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZiA9IG9wdGlvbnMucGFyYW1zKSAhPSBudWxsID8gcmVmLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSk7XG4gICAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5wYXJhbXMuc3BhY2UpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZTtcbiAgICAgICAgc29ydCA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc29ydCA6IHZvaWQgMDtcbiAgICAgICAgc2VsZWN0ZWQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zZWxlY3RlZCA6IHZvaWQgMCkgfHwgW107XG4gICAgICAgIG9wdGlvbnNfbGltaXQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5vcHRpb25zX2xpbWl0IDogdm9pZCAwKSB8fCAxMDtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7XG4gICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYxID0gb3B0aW9ucy52YWx1ZXMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VhcmNoVGV4dFF1ZXJ5XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAkbmluOiBzZWxlY3RlZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyUXVlcnkpIHtcbiAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgcXVlcnlfb3B0aW9ucyA9IHtcbiAgICAgICAgICBsaW1pdDogb3B0aW9uc19saW1pdFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpKSB7XG4gICAgICAgICAgcXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpO1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHJlY29yZHMsIGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLl9pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXG5cblx0XHRoYXNoRGF0YSA9IHJlcS5ib2R5XG5cdFx0b2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZVxuXHRcdHJlY29yZF9pZCA9IGhhc2hEYXRhLnJlY29yZF9pZFxuXHRcdHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWRcblxuXHRcdGNoZWNrIG9iamVjdF9uYW1lLCBTdHJpbmdcblx0XHRjaGVjayByZWNvcmRfaWQsIFN0cmluZ1xuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcblxuXHRcdGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkXG5cdFx0eF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXVxuXHRcdHhfYXV0aF90b2tlbiA9IHJlcS5xdWVyeVsnWC1BdXRoLVRva2VuJ11cblxuXHRcdHJlZGlyZWN0X3VybCA9IFwiL1wiXG5cdFx0aW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkKVxuXHRcdCMgLSDmiJHnmoTojYnnqL/lsLHot7Povazoh7PojYnnqL/nrrFcblx0XHQjIC0g5oiR55qE5b6F5a6h5qC45bCx6Lez6L2s6Iez5b6F5a6h5qC4XG5cdFx0IyAtIOS4jeaYr+aIkeeahOeUs+ivt+WNleWImei3s+i9rOiHs+aJk+WNsOmhtemdolxuXHRcdCMgLSDlpoLnlLPor7fljZXkuI3lrZjlnKjliJnmj5DnpLrnlKjmiLfnlLPor7fljZXlt7LliKDpmaTvvIzlubbkuJTmm7TmlrByZWNvcmTnmoTnirbmgIHvvIzkvb/nlKjmiLflj6/ku6Xph43mlrDlj5HotbflrqHmiblcblx0XHRpZiBpbnNcblx0XHRcdGJveCA9ICcnXG5cdFx0XHRzcGFjZUlkID0gaW5zLnNwYWNlXG5cdFx0XHRmbG93SWQgPSBpbnMuZmxvd1xuXG5cdFx0XHRpZiAoaW5zLmluYm94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpIG9yIChpbnMuY2NfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0Ym94ID0gJ2luYm94J1xuXHRcdFx0ZWxzZSBpZiBpbnMub3V0Ym94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWRcblx0XHRcdFx0Ym94ID0gJ291dGJveCdcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdkcmFmdCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXG5cdFx0XHRcdGJveCA9ICdkcmFmdCdcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdwZW5kaW5nJyBhbmQgKGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkIG9yIGlucy5hcHBsaWNhbnQgaXMgY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRib3ggPSAncGVuZGluZydcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdjb21wbGV0ZWQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxuXHRcdFx0XHRib3ggPSAnY29tcGxldGVkJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOmqjOivgWxvZ2luIHVzZXJfaWTlr7nor6XmtYHnqIvmnInnrqHnkIbjgIHop4Llr5/nlLPor7fljZXnmoTmnYPpmZBcblx0XHRcdFx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwgeyBmaWVsZHM6IHsgYWRtaW5zOiAxIH0gfSlcblx0XHRcdFx0aWYgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZG1pblwiKSBvciBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcIm1vbml0b3JcIikgb3Igc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0XHRib3ggPSAnbW9uaXRvcidcblx0XHRcdHdvcmtmbG93VXJsID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcz8ud29ya2Zsb3c/LnVybFxuXHRcdFx0aWYgYm94XG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vI3tib3h9LyN7aW5zSWR9P1gtVXNlci1JZD0je3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSN7eF9hdXRoX3Rva2VufVwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vcHJpbnQvI3tpbnNJZH0/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcblxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0XHRjb2RlOiAyMDBcblx0XHRcdFx0ZGF0YTogeyByZWRpcmVjdF91cmw6IHJlZGlyZWN0X3VybCB9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcblx0XHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdFx0Y29sbGVjdGlvbi51cGRhdGUocmVjb3JkX2lkLCB7XG5cdFx0XHRcdFx0JHVuc2V0OiB7XG5cdFx0XHRcdFx0XHRcImluc3RhbmNlc1wiOiAxLFxuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZV9zdGF0ZVwiOiAxLFxuXHRcdFx0XHRcdFx0XCJsb2NrZWRcIjogMVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKVxuXG5cdGNhdGNoIGVcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XG5cdFx0fVxuXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL3dvcmtmbG93L3ZpZXcvOmluc3RhbmNlSWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYm94LCBjb2xsZWN0aW9uLCBjdXJyZW50X3VzZXJfaWQsIGN1cnJlbnRfdXNlcl9pbmZvLCBlLCBmbG93SWQsIGhhc2hEYXRhLCBpbnMsIGluc0lkLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbnMsIHJlY29yZF9pZCwgcmVkaXJlY3RfdXJsLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHNwYWNlLCBzcGFjZUlkLCBzcGFjZV9pZCwgd29ya2Zsb3dVcmwsIHhfYXV0aF90b2tlbiwgeF91c2VyX2lkO1xuICB0cnkge1xuICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgY3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkO1xuICAgIGhhc2hEYXRhID0gcmVxLmJvZHk7XG4gICAgb2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZTtcbiAgICByZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWQ7XG4gICAgc3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZDtcbiAgICBjaGVjayhvYmplY3RfbmFtZSwgU3RyaW5nKTtcbiAgICBjaGVjayhyZWNvcmRfaWQsIFN0cmluZyk7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgaW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWQ7XG4gICAgeF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICB4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddO1xuICAgIHJlZGlyZWN0X3VybCA9IFwiL1wiO1xuICAgIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCk7XG4gICAgaWYgKGlucykge1xuICAgICAgYm94ID0gJyc7XG4gICAgICBzcGFjZUlkID0gaW5zLnNwYWNlO1xuICAgICAgZmxvd0lkID0gaW5zLmZsb3c7XG4gICAgICBpZiAoKChyZWYgPSBpbnMuaW5ib3hfdXNlcnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkgfHwgKChyZWYxID0gaW5zLmNjX3VzZXJzKSAhPSBudWxsID8gcmVmMS5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSkge1xuICAgICAgICBib3ggPSAnaW5ib3gnO1xuICAgICAgfSBlbHNlIGlmICgocmVmMiA9IGlucy5vdXRib3hfdXNlcnMpICE9IG51bGwgPyByZWYyLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHtcbiAgICAgICAgYm94ID0gJ291dGJveCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2RyYWZ0JyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2RyYWZ0JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAncGVuZGluZycgJiYgKGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCB8fCBpbnMuYXBwbGljYW50ID09PSBjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgIGJveCA9ICdwZW5kaW5nJztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2NvbXBsZXRlZCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZCk7XG4gICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgYWRtaW5zOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgfHwgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJtb25pdG9yXCIpIHx8IHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgICAgYm94ID0gJ21vbml0b3InO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3b3JrZmxvd1VybCA9IChyZWYzID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjQgPSByZWYzLndvcmtmbG93KSAhPSBudWxsID8gcmVmNC51cmwgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoYm94KSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9cIiArIGJveCArIFwiL1wiICsgaW5zSWQgKyBcIj9YLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIChcIndvcmtmbG93L3NwYWNlL1wiICsgc3BhY2VJZCArIFwiL3ByaW50L1wiICsgaW5zSWQgKyBcIj9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfVxuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZWRpcmVjdF91cmw6IHJlZGlyZWN0X3VybFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpO1xuICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgY29sbGVjdGlvbi51cGRhdGUocmVjb3JkX2lkLCB7XG4gICAgICAgICAgJHVuc2V0OiB7XG4gICAgICAgICAgICBcImluc3RhbmNlc1wiOiAxLFxuICAgICAgICAgICAgXCJpbnN0YW5jZV9zdGF0ZVwiOiAxLFxuICAgICAgICAgICAgXCJsb2NrZWRcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+eUs+ivt+WNleW3suWIoOmZpCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpIC0+XG5cdF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSk/Ll9zY2hlbWFcblx0Y29sdW1uX251bSA9IDBcblx0aWYgX3NjaGVtYVxuXHRcdF8uZWFjaCBjb2x1bW5zLCAoZmllbGRfbmFtZSkgLT5cblx0XHRcdGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpXG5cdFx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXG5cdFx0XHRpZiBpc193aWRlXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDFcblxuXHRcdGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW1cblx0XHRyZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50XG5cbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIC0+XG5cdF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYVxuXHRpZiBfc2NoZW1hXG5cdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcblx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXG5cdFx0cmV0dXJuIGlzX3dpZGVcblxuQ3JlYXRvci5nZXRUYWJ1bGFyT3JkZXIgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykgLT5cblx0c2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnM/LnNldHRpbmdzPy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJ9KVxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IF8ubWFwIGNvbHVtbnMsIChjb2x1bW4pLT5cblx0XHRmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXVxuXHRcdGlmIGZpZWxkPy50eXBlIGFuZCAhZmllbGQuaGlkZGVuXG5cdFx0XHRyZXR1cm4gY29sdW1uXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRjb2x1bW5zID0gXy5jb21wYWN0IGNvbHVtbnNcblx0aWYgc2V0dGluZyBhbmQgc2V0dGluZy5zZXR0aW5nc1xuXHRcdHNvcnQgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0/LnNvcnQgfHwgW11cblx0XHRzb3J0ID0gXy5tYXAgc29ydCwgKG9yZGVyKS0+XG5cdFx0XHRrZXkgPSBvcmRlclswXVxuXHRcdFx0aW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KVxuXHRcdFx0b3JkZXJbMF0gPSBpbmRleCArIDFcblx0XHRcdHJldHVybiBvcmRlclxuXHRcdHJldHVybiBzb3J0XG5cdHJldHVybiBbXVxuXG5cbkNyZWF0b3IuaW5pdExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSktPlxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cblx0ZXh0cmFfY29sdW1ucyA9IFtcIm93bmVyXCJdXG5cdGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl1cblx0aWYgZGVmYXVsdF9leHRyYV9jb2x1bW5zXG5cdFx0ZXh0cmFfY29sdW1ucyA9IF8udW5pb24gZXh0cmFfY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zXG5cblx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkcz9bb2JqZWN0X25hbWVdID0gW11cblxuQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcgPSAoZGVmYXVsdF92aWV3LCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19uYW1lKS0+XG5cdGRlZmF1bHRfY29sdW1ucyA9IGRlZmF1bHRfdmlldz8uY29sdW1uc1xuXHRkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3Py5tb2JpbGVfY29sdW1uc1xuXHR1bmxlc3MgbGlzdF92aWV3XG5cdFx0cmV0dXJuXG5cdG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpXG5cdFx0b2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lXG5cdGlmICFvaXRlbS5jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdF9jb2x1bW5zXG5cdFx0XHRvaXRlbS5jb2x1bW5zID0gZGVmYXVsdF9jb2x1bW5zXG5cdGlmICFvaXRlbS5jb2x1bW5zXG5cdFx0b2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl1cblx0aWYgIW9pdGVtLm1vYmlsZV9jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdF9tb2JpbGVfY29sdW1uc1xuXHRcdFx0b2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zXG5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpICYmICFfLmluY2x1ZGUob2l0ZW0uY29sdW1ucywgJ3NwYWNlJylcblx0XHRcdG9pdGVtLmNvbHVtbnMucHVzaCgnc3BhY2UnKVxuXG5cblx0aWYgIW9pdGVtLmZpbHRlcl9zY29wZVxuXHRcdCMgbGlzdHZpZXfop4blm77nmoRmaWx0ZXJfc2NvcGXpu5jorqTlgLzmlLnkuLpzcGFjZSAjMTMxXG5cdFx0b2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiXG5cblx0aWYgIV8uaGFzKG9pdGVtLCBcIl9pZFwiKVxuXHRcdG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lXG5cdGVsc2Vcblx0XHRvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lXG5cblx0aWYgXy5pc1N0cmluZyhvaXRlbS5vcHRpb25zKVxuXHRcdG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpXG5cblx0Xy5mb3JFYWNoIG9pdGVtLmZpbHRlcnMsIChmaWx0ZXIsIF9pbmRleCktPlxuXHRcdGlmICFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcilcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcblx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcblx0cmV0dXJuIG9pdGVtXG5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdENyZWF0b3IuZ2V0UmVsYXRlZExpc3QgPSAob2JqZWN0X25hbWUpLT5cblx0XHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRcdHJldHVyblxuXHRcdHJlbGF0ZWRMaXN0T2JqZWN0cyA9IHt9XG5cdFx0cmVsYXRlZExpc3ROYW1lcyA9IFtdXG5cdFx0b2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzID0gW107XG5cdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmIF9vYmplY3Rcblx0XHRcdGxheW91dFJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkX2xpc3RzO1xuXHRcdFx0IyBsYXlvdXRSZWxhdGVkTGlzdCDmmK/mlbDnu4TlsLHooajnpLrphY3nva7ov4fpobXpnaLluIPlsYDvvIzlsLHlkK/nlKjpobXpnaLluIPlsYDnmoTnm7jlhbPlrZDooajjgIJcblx0XHRcdGlmIF8uaXNBcnJheSBsYXlvdXRSZWxhdGVkTGlzdFxuXHRcdFx0XHRfLmVhY2ggbGF5b3V0UmVsYXRlZExpc3QsIChpdGVtKS0+XG5cdFx0XHRcdFx0cmVPYmplY3ROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0XHRyZUZpZWxkTmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSBDcmVhdG9yLmdldE9iamVjdChyZU9iamVjdE5hbWUpPy5maWVsZHNbcmVGaWVsZE5hbWVdPy53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXHRcdFx0XHRcdHJlbGF0ZWQgPVxuXHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IHJlT2JqZWN0TmFtZVxuXHRcdFx0XHRcdFx0Y29sdW1uczogaXRlbS5maWVsZF9uYW1lc1xuXHRcdFx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXNcblx0XHRcdFx0XHRcdGlzX2ZpbGU6IHJlT2JqZWN0TmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb246IGl0ZW0uZmlsdGVyc1xuXHRcdFx0XHRcdFx0c29ydDogaXRlbS5zb3J0XG5cdFx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6IHJlRmllbGROYW1lXG5cdFx0XHRcdFx0XHRjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZVxuXHRcdFx0XHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRcdFx0XHRsYWJlbDogaXRlbS5sYWJlbFxuXHRcdFx0XHRcdFx0YWN0aW9uczogaXRlbS5idXR0b25zXG5cdFx0XHRcdFx0XHR2aXNpYmxlX29uOiBpdGVtLnZpc2libGVfb25cblx0XHRcdFx0XHRcdHBhZ2Vfc2l6ZTogaXRlbS5wYWdlX3NpemVcblx0XHRcdFx0XHRvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMucHVzaChyZWxhdGVkKVxuXHRcdFx0XHRyZXR1cm4gb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzO1xuXHRcdFx0cmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0XG5cdFx0XHRpZiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XG5cdFx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdCwgKG9iak9yTmFtZSktPlxuXHRcdFx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqT3JOYW1lXG5cdFx0XHRcdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lXG5cdFx0XHRcdFx0XHRcdGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zXG5cdFx0XHRcdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBvYmpPck5hbWUubW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0XHRcdFx0aXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb246IG9iak9yTmFtZS5maWx0ZXJzXG5cdFx0XHRcdFx0XHRcdHNvcnQ6IG9iak9yTmFtZS5zb3J0XG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogJydcblx0XHRcdFx0XHRcdFx0Y3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWVcblx0XHRcdFx0XHRcdFx0bGFiZWw6IG9iak9yTmFtZS5sYWJlbFxuXHRcdFx0XHRcdFx0XHRhY3Rpb25zOiBvYmpPck5hbWUuYWN0aW9uc1xuXHRcdFx0XHRcdFx0XHRwYWdlX3NpemU6IG9iak9yTmFtZS5wYWdlX3NpemVcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE5hbWVzLnB1c2ggb2JqT3JOYW1lLm9iamVjdE5hbWVcblx0XHRcdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcgb2JqT3JOYW1lXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE5hbWVzLnB1c2ggb2JqT3JOYW1lXG5cblx0XHRtYXBMaXN0ID0ge31cblx0XHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKVxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdHMsIChyZWxhdGVkX29iamVjdF9pdGVtKSAtPlxuXHRcdFx0aWYgIXJlbGF0ZWRfb2JqZWN0X2l0ZW0/Lm9iamVjdF9uYW1lXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWVcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXlcblx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZF9vYmplY3RfaXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXHRcdFx0cmVsYXRlZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKVxuXHRcdFx0dW5sZXNzIHJlbGF0ZWRfb2JqZWN0XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXVxuXHRcdFx0Y29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXVxuXHRcdFx0bW9iaWxlX2NvbHVtbnMgPSBfLndpdGhvdXQobW9iaWxlX2NvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSlcblxuXHRcdFx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0XHR0YWJ1bGFyX29yZGVyID0gQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyKG9yZGVyLCBjb2x1bW5zKVxuXG5cdFx0XHRpZiAvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSlcblx0XHRcdFx0IyBvYmplY3TnsbvlnovluKblrZDlsZ7mgKfnmoRyZWxhdGVkX2ZpZWxkX25hbWXopoHljrvmjonkuK3pl7TnmoTnvo7lhYPnrKblj7fvvIzlkKbliJnmmL7npLrkuI3lh7rlrZfmrrXlgLxcblx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9maWVsZF9uYW1lLnJlcGxhY2UoL1xcJFxcLi8sXCJcIilcblx0XHRcdHJlbGF0ZWQgPVxuXHRcdFx0XHRvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZVxuXHRcdFx0XHRjb2x1bW5zOiBjb2x1bW5zXG5cdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBtb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZVxuXHRcdFx0XHRpc19maWxlOiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cblx0XHRcdHJlbGF0ZWRPYmplY3QgPSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV1cblx0XHRcdGlmIHJlbGF0ZWRPYmplY3Rcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jb2x1bW5zXG5cdFx0XHRcdFx0cmVsYXRlZC5jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5jb2x1bW5zXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0XHRyZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LnNvcnRcblx0XHRcdFx0XHRyZWxhdGVkLnNvcnQgPSByZWxhdGVkT2JqZWN0LnNvcnRcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cblx0XHRcdFx0XHRyZWxhdGVkLmZpbHRlcnNGdW5jdGlvbiA9IHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Rcblx0XHRcdFx0XHRyZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmxhYmVsXG5cdFx0XHRcdFx0cmVsYXRlZC5sYWJlbCA9IHJlbGF0ZWRPYmplY3QubGFiZWxcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5wYWdlX3NpemVcblx0XHRcdFx0XHRyZWxhdGVkLnBhZ2Vfc2l6ZSA9IHJlbGF0ZWRPYmplY3QucGFnZV9zaXplXG5cdFx0XHRcdGRlbGV0ZSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV1cblxuXHRcdFx0bWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWRcblxuXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfLnZhbHVlcyhyZWxhdGVkTGlzdE9iamVjdHMpLCBcIm9iamVjdF9uYW1lXCIpXG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdFx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdF8uZWFjaCByZWxhdGVkTGlzdE9iamVjdHMsICh2LCByZWxhdGVkX29iamVjdF9uYW1lKSAtPlxuXHRcdFx0aXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTFcblx0XHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXG5cdFx0XHRpZiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWRcblx0XHRcdFx0bWFwTGlzdFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHZcblxuXHRcdGxpc3QgPSBbXVxuXHRcdGlmIF8uaXNFbXB0eSByZWxhdGVkTGlzdE5hbWVzXG5cdFx0XHRsaXN0ID0gIF8udmFsdWVzIG1hcExpc3Rcblx0XHRlbHNlXG5cdFx0XHRfLmVhY2ggcmVsYXRlZExpc3ROYW1lcywgKG9iamVjdE5hbWUpIC0+XG5cdFx0XHRcdGlmIG1hcExpc3Rbb2JqZWN0TmFtZV1cblx0XHRcdFx0XHRsaXN0LnB1c2ggbWFwTGlzdFtvYmplY3ROYW1lXVxuXG5cdFx0aWYgXy5oYXMoX29iamVjdCwgJ2FsbG93X3JlbGF0ZWRMaXN0Jylcblx0XHRcdGxpc3QgPSBfLmZpbHRlciBsaXN0LCAoaXRlbSktPlxuXHRcdFx0XHRyZXR1cm4gXy5pbmNsdWRlKF9vYmplY3QuYWxsb3dfcmVsYXRlZExpc3QsIGl0ZW0ub2JqZWN0X25hbWUpXG5cblx0XHRyZXR1cm4gbGlzdFxuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUpLT5cblx0cmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKVxuXG4jIyMgXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxuXHRleGFj5Li6dHJ1ZeaXtu+8jOmcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOS4jem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvlxuIyMjXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhbGlzdF92aWV3X2lkXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdHJldHVyblxuXHRsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSlcblx0dW5sZXNzIGxpc3RWaWV3cz8ubGVuZ3RoXG5cdFx0cmV0dXJuXG5cdGxpc3RfdmlldyA9IF8uZmluZChsaXN0Vmlld3MsIChpdGVtKS0+IHJldHVybiBpdGVtLl9pZCA9PSBsaXN0X3ZpZXdfaWQgfHwgaXRlbS5uYW1lID09IGxpc3Rfdmlld19pZClcblx0dW5sZXNzIGxpc3Rfdmlld1xuXHRcdCMg5aaC5p6c5LiN6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5YiZ6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+77yM5Y+N5LmL6L+U5Zue56m6XG5cdFx0aWYgZXhhY1xuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0bGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdXG5cdHJldHVybiBsaXN0X3ZpZXdcblxuI+iOt+WPlmxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvuaYr+WQpuaYr+acgOi/keafpeeci+inhuWbvlxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhbGlzdF92aWV3X2lkXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRpZiB0eXBlb2YobGlzdF92aWV3X2lkKSA9PSBcInN0cmluZ1wiXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgIW9iamVjdFxuXHRcdFx0cmV0dXJuXG5cdFx0bGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cyx7X2lkOiBsaXN0X3ZpZXdfaWR9KVxuXHRlbHNlXG5cdFx0bGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWRcblx0cmV0dXJuIGxpc3RWaWV3Py5uYW1lID09IFwicmVjZW50XCJcblxuXG4jIyNcbiAgICDku45jb2x1bW5z5Y+C5pWw5Lit6L+H5ruk5Ye655So5LqO5omL5py656uv5pi+56S655qEY29sdW1uc1xuXHTop4TliJnvvJpcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxuXHQyLuacgOWkmuWPqui/lOWbnjTkuKrlrZfmrrVcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcbiMjI1xuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IChvYmplY3RfbmFtZSwgY29sdW1ucyktPlxuXHRyZXN1bHQgPSBbXVxuXHRtYXhSb3dzID0gMiBcblx0bWF4Q291bnQgPSBtYXhSb3dzICogMlxuXHRjb3VudCA9IDBcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IG9iamVjdC5maWVsZHNcblx0dW5sZXNzIG9iamVjdFxuXHRcdHJldHVybiBjb2x1bW5zXG5cdG5hbWVLZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcblx0aXNOYW1lQ29sdW1uID0gKGl0ZW0pLT5cblx0XHRpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHRyZXR1cm4gaXRlbS5maWVsZCA9PSBuYW1lS2V5XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGl0ZW0gPT0gbmFtZUtleVxuXHRnZXRGaWVsZCA9IChpdGVtKS0+XG5cdFx0aWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0cmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmaWVsZHNbaXRlbV1cblx0aWYgbmFtZUtleVxuXHRcdG5hbWVDb2x1bW4gPSBjb2x1bW5zLmZpbmQgKGl0ZW0pLT5cblx0XHRcdHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSlcblx0aWYgbmFtZUNvbHVtblxuXHRcdGZpZWxkID0gZ2V0RmllbGQobmFtZUNvbHVtbilcblx0XHRpdGVtQ291bnQgPSBpZiBmaWVsZC5pc193aWRlIHRoZW4gMiBlbHNlIDFcblx0XHRjb3VudCArPSBpdGVtQ291bnRcblx0XHRyZXN1bHQucHVzaCBuYW1lQ29sdW1uXG5cdGNvbHVtbnMuZm9yRWFjaCAoaXRlbSktPlxuXHRcdGZpZWxkID0gZ2V0RmllbGQoaXRlbSlcblx0XHR1bmxlc3MgZmllbGRcblx0XHRcdHJldHVyblxuXHRcdGl0ZW1Db3VudCA9IGlmIGZpZWxkLmlzX3dpZGUgdGhlbiAyIGVsc2UgMVxuXHRcdGlmIGNvdW50IDwgbWF4Q291bnQgYW5kIHJlc3VsdC5sZW5ndGggPCBtYXhDb3VudCBhbmQgIWlzTmFtZUNvbHVtbihpdGVtKVxuXHRcdFx0Y291bnQgKz0gaXRlbUNvdW50XG5cdFx0XHRpZiBjb3VudCA8PSBtYXhDb3VudFxuXHRcdFx0XHRyZXN1bHQucHVzaCBpdGVtXG5cdFxuXHRyZXR1cm4gcmVzdWx0XG5cbiMjI1xuICAgIOiOt+WPlum7mOiupOinhuWbvlxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gKG9iamVjdF9uYW1lKS0+XG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRpZiBvYmplY3Q/Lmxpc3Rfdmlld3M/LmRlZmF1bHRcblx0XHQjVE9ETyDmraTku6PnoIHlj6rmmK/mmoLml7blhbzlrrnku6XliY1jb2Rl5Lit5a6a5LmJ55qEZGVmYXVsdOinhuWbvu+8jOW+hWNvZGXkuK3nmoRkZWZhdWx05riF55CG5a6M5oiQ5ZCO77yM6ZyA6KaB5Yig6Zmk5q2k5Luj56CBXG5cdFx0ZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3cy5kZWZhdWx0XG5cdGVsc2Vcblx0XHRfLmVhY2ggb2JqZWN0Py5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpLT5cblx0XHRcdGlmIGxpc3Rfdmlldy5uYW1lID09IFwiYWxsXCIgfHwga2V5ID09IFwiYWxsXCJcblx0XHRcdFx0ZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXdcblx0cmV0dXJuIGRlZmF1bHRWaWV3O1xuXG4jIyNcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IChvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Py5jb2x1bW5zXG5cdGlmIHVzZV9tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRWaWV3Py5tb2JpbGVfY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zXG5cdFx0ZWxzZSBpZiBjb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucylcblx0cmV0dXJuIGNvbHVtbnNcblxuIyMjXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo56ys5LiA5Liq6KeG5Zu+5pi+56S655qE5a2X5q61XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMgPSAob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucyktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyhvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Py5jb2x1bW5zXG5cdGlmIHVzZV9tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRWaWV3Py5tb2JpbGVfY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zXG5cdFx0ZWxzZSBpZiBjb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucylcblx0cmV0dXJuIGNvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSAob2JqZWN0X25hbWUpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmV4dHJhX2NvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0aWYgZGVmYXVsdFZpZXdcblx0XHRpZiBkZWZhdWx0Vmlldy5zb3J0XG5cdFx0XHRyZXR1cm4gZGVmYXVsdFZpZXcuc29ydFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dXG5cblxuIyMjXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcbiMjI1xuQ3JlYXRvci5pc0FsbFZpZXcgPSAobGlzdF92aWV3KS0+XG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJhbGxcIlxuXG4jIyNcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuIyMjXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IChsaXN0X3ZpZXcpLT5cblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcInJlY2VudFwiXG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IChzb3J0LCB0YWJ1bGFyQ29sdW1ucyktPlxuXHR0YWJ1bGFyX3NvcnQgPSBbXVxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcblx0XHRcdCMg5YW85a655pen55qE5pWw5o2u5qC85byPW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGlmIGl0ZW0ubGVuZ3RoID09IDFcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdXG5cdFx0XHRlbHNlIGlmIGl0ZW0ubGVuZ3RoID09IDJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBvcmRlcl1cblxuXHRyZXR1cm4gdGFidWxhcl9zb3J0XG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSAoc29ydCktPlxuXHRkeF9zb3J0ID0gW11cblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXG5cdFx0XHQj5YW85a655pen5qC85byP77yaW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGR4X3NvcnQucHVzaChpdGVtKVxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxuXHRcdFx0XHRkeF9zb3J0LnB1c2ggW2ZpZWxkX25hbWUsIG9yZGVyXVxuXG5cdHJldHVybiBkeF9zb3J0XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgY29sdW1ucykge1xuICB2YXIgX3NjaGVtYSwgY29sdW1uX251bSwgaW5pdF93aWR0aF9wZXJjZW50LCByZWY7XG4gIF9zY2hlbWEgPSAocmVmID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLl9zY2hlbWEgOiB2b2lkIDA7XG4gIGNvbHVtbl9udW0gPSAwO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgICB2YXIgZmllbGQsIGlzX3dpZGUsIHJlZjEsIHJlZjI7XG4gICAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICAgIGlzX3dpZGUgPSAocmVmMSA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMi5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGlzX3dpZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bTtcbiAgICByZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50O1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIHtcbiAgdmFyIF9zY2hlbWEsIGZpZWxkLCBpc193aWRlLCByZWYsIHJlZjE7XG4gIF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYTtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICBpc193aWRlID0gKHJlZiA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgcmV0dXJuIGlzX3dpZGU7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykge1xuICB2YXIgb2JqLCByZWYsIHJlZjEsIHJlZjIsIHNldHRpbmcsIHNvcnQ7XG4gIHNldHRpbmcgPSAocmVmID0gQ3JlYXRvci5Db2xsZWN0aW9ucykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnNldHRpbmdzKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gXy5tYXAoY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgdmFyIGZpZWxkO1xuICAgIGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dO1xuICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnR5cGUgOiB2b2lkIDApICYmICFmaWVsZC5oaWRkZW4pIHtcbiAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICB9KTtcbiAgY29sdW1ucyA9IF8uY29tcGFjdChjb2x1bW5zKTtcbiAgaWYgKHNldHRpbmcgJiYgc2V0dGluZy5zZXR0aW5ncykge1xuICAgIHNvcnQgPSAoKHJlZjIgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0pICE9IG51bGwgPyByZWYyLnNvcnQgOiB2b2lkIDApIHx8IFtdO1xuICAgIHNvcnQgPSBfLm1hcChzb3J0LCBmdW5jdGlvbihvcmRlcikge1xuICAgICAgdmFyIGluZGV4LCBrZXk7XG4gICAgICBrZXkgPSBvcmRlclswXTtcbiAgICAgIGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSk7XG4gICAgICBvcmRlclswXSA9IGluZGV4ICsgMTtcbiAgICAgIHJldHVybiBvcmRlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gc29ydDtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zLCBleHRyYV9jb2x1bW5zLCBvYmplY3QsIG9yZGVyLCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gIGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXTtcbiAgZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXTtcbiAgaWYgKGRlZmF1bHRfZXh0cmFfY29sdW1ucykge1xuICAgIGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uKGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucyk7XG4gIH1cbiAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiAocmVmID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHMpICE9IG51bGwgPyByZWZbb2JqZWN0X25hbWVdID0gW10gOiB2b2lkIDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gZnVuY3Rpb24oZGVmYXVsdF92aWV3LCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19uYW1lKSB7XG4gIHZhciBkZWZhdWx0X2NvbHVtbnMsIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMsIG9pdGVtO1xuICBkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcgIT0gbnVsbCA/IGRlZmF1bHRfdmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3ICE9IG51bGwgPyBkZWZhdWx0X3ZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICghbGlzdF92aWV3KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpO1xuICBpZiAoIV8uaGFzKG9pdGVtLCBcIm5hbWVcIikpIHtcbiAgICBvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWU7XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfY29sdW1ucykge1xuICAgICAgb2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1ucztcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgb2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl07XG4gIH1cbiAgaWYgKCFvaXRlbS5tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X21vYmlsZV9jb2x1bW5zKSB7XG4gICAgICBvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpICYmICFfLmluY2x1ZGUob2l0ZW0uY29sdW1ucywgJ3NwYWNlJykpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMucHVzaCgnc3BhY2UnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5maWx0ZXJfc2NvcGUpIHtcbiAgICBvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCI7XG4gIH1cbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJfaWRcIikpIHtcbiAgICBvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZTtcbiAgfSBlbHNlIHtcbiAgICBvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lO1xuICB9XG4gIGlmIChfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpKSB7XG4gICAgb2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucyk7XG4gIH1cbiAgXy5mb3JFYWNoKG9pdGVtLmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgaWYgKCFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5fdmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvaXRlbTtcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF9vYmplY3QsIGxheW91dFJlbGF0ZWRMaXN0LCBsaXN0LCBtYXBMaXN0LCBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMsIHBlcm1pc3Npb25zLCByZWxhdGVkTGlzdCwgcmVsYXRlZExpc3ROYW1lcywgcmVsYXRlZExpc3RPYmplY3RzLCByZWxhdGVkX29iamVjdF9uYW1lcywgcmVsYXRlZF9vYmplY3RzLCBzcGFjZUlkLCB1bnJlbGF0ZWRfb2JqZWN0cywgdXNlcklkO1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVsYXRlZExpc3RPYmplY3RzID0ge307XG4gICAgcmVsYXRlZExpc3ROYW1lcyA9IFtdO1xuICAgIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyA9IFtdO1xuICAgIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKF9vYmplY3QpIHtcbiAgICAgIGxheW91dFJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkX2xpc3RzO1xuICAgICAgaWYgKF8uaXNBcnJheShsYXlvdXRSZWxhdGVkTGlzdCkpIHtcbiAgICAgICAgXy5lYWNoKGxheW91dFJlbGF0ZWRMaXN0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIHJlRmllbGROYW1lLCByZU9iamVjdE5hbWUsIHJlZiwgcmVmMSwgcmVsYXRlZCwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICAgICAgcmVPYmplY3ROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgcmVGaWVsZE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChyZU9iamVjdE5hbWUpKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZmllbGRzW3JlRmllbGROYW1lXSkgIT0gbnVsbCA/IHJlZjEud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZU9iamVjdE5hbWUsXG4gICAgICAgICAgICBjb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzLFxuICAgICAgICAgICAgbW9iaWxlX2NvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXMsXG4gICAgICAgICAgICBpc19maWxlOiByZU9iamVjdE5hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgICAgICBmaWx0ZXJzRnVuY3Rpb246IGl0ZW0uZmlsdGVycyxcbiAgICAgICAgICAgIHNvcnQ6IGl0ZW0uc29ydCxcbiAgICAgICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogcmVGaWVsZE5hbWUsXG4gICAgICAgICAgICBjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCxcbiAgICAgICAgICAgIGxhYmVsOiBpdGVtLmxhYmVsLFxuICAgICAgICAgICAgYWN0aW9uczogaXRlbS5idXR0b25zLFxuICAgICAgICAgICAgdmlzaWJsZV9vbjogaXRlbS52aXNpYmxlX29uLFxuICAgICAgICAgICAgcGFnZV9zaXplOiBpdGVtLnBhZ2Vfc2l6ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cy5wdXNoKHJlbGF0ZWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cztcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdDtcbiAgICAgIGlmICghXy5pc0VtcHR5KHJlbGF0ZWRMaXN0KSkge1xuICAgICAgICBfLmVhY2gocmVsYXRlZExpc3QsIGZ1bmN0aW9uKG9iak9yTmFtZSkge1xuICAgICAgICAgIHZhciByZWxhdGVkO1xuICAgICAgICAgIGlmIChfLmlzT2JqZWN0KG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmpPck5hbWUub2JqZWN0TmFtZSxcbiAgICAgICAgICAgICAgY29sdW1uczogb2JqT3JOYW1lLmNvbHVtbnMsXG4gICAgICAgICAgICAgIG1vYmlsZV9jb2x1bW5zOiBvYmpPck5hbWUubW9iaWxlX2NvbHVtbnMsXG4gICAgICAgICAgICAgIGlzX2ZpbGU6IG9iak9yTmFtZS5vYmplY3ROYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICAgICAgICBmaWx0ZXJzRnVuY3Rpb246IG9iak9yTmFtZS5maWx0ZXJzLFxuICAgICAgICAgICAgICBzb3J0OiBvYmpPck5hbWUuc29ydCxcbiAgICAgICAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiAnJyxcbiAgICAgICAgICAgICAgY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWUsXG4gICAgICAgICAgICAgIGxhYmVsOiBvYmpPck5hbWUubGFiZWwsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IG9iak9yTmFtZS5hY3Rpb25zLFxuICAgICAgICAgICAgICBwYWdlX3NpemU6IG9iak9yTmFtZS5wYWdlX3NpemVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZWxhdGVkTGlzdE9iamVjdHNbb2JqT3JOYW1lLm9iamVjdE5hbWVdID0gcmVsYXRlZDtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE5hbWVzLnB1c2gob2JqT3JOYW1lLm9iamVjdE5hbWUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhvYmpPck5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3ROYW1lcy5wdXNoKG9iak9yTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgbWFwTGlzdCA9IHt9O1xuICAgIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpO1xuICAgIF8uZWFjaChyZWxhdGVkX29iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIHtcbiAgICAgIHZhciBjb2x1bW5zLCBtb2JpbGVfY29sdW1ucywgb3JkZXIsIHJlbGF0ZWQsIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRhYnVsYXJfb3JkZXIsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgICAgaWYgKCEocmVsYXRlZF9vYmplY3RfaXRlbSAhPSBudWxsID8gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWU7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5O1xuICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkX29iamVjdF9pdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgICAgcmVsYXRlZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIGlmICghcmVsYXRlZF9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXTtcbiAgICAgIGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG1vYmlsZV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lLCB0cnVlKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgbW9iaWxlX2NvbHVtbnMgPSBfLndpdGhvdXQobW9iaWxlX2NvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gICAgICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICB0YWJ1bGFyX29yZGVyID0gQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyKG9yZGVyLCBjb2x1bW5zKTtcbiAgICAgIGlmICgvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSkpIHtcbiAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9maWVsZF9uYW1lLnJlcGxhY2UoL1xcJFxcLi8sIFwiXCIpO1xuICAgICAgfVxuICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgIG1vYmlsZV9jb2x1bW5zOiBtb2JpbGVfY29sdW1ucyxcbiAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgIGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuICAgICAgfTtcbiAgICAgIHJlbGF0ZWRPYmplY3QgPSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgICBpZiAocmVsYXRlZE9iamVjdCkge1xuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5jb2x1bW5zKSB7XG4gICAgICAgICAgcmVsYXRlZC5jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5jb2x1bW5zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zKSB7XG4gICAgICAgICAgcmVsYXRlZC5tb2JpbGVfY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3Quc29ydCkge1xuICAgICAgICAgIHJlbGF0ZWQuc29ydCA9IHJlbGF0ZWRPYmplY3Quc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb24pIHtcbiAgICAgICAgICByZWxhdGVkLmZpbHRlcnNGdW5jdGlvbiA9IHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0KSB7XG4gICAgICAgICAgcmVsYXRlZC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCA9IHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubGFiZWwpIHtcbiAgICAgICAgICByZWxhdGVkLmxhYmVsID0gcmVsYXRlZE9iamVjdC5sYWJlbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5wYWdlX3NpemUpIHtcbiAgICAgICAgICByZWxhdGVkLnBhZ2Vfc2l6ZSA9IHJlbGF0ZWRPYmplY3QucGFnZV9zaXplO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWQ7XG4gICAgfSk7XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF8udmFsdWVzKHJlbGF0ZWRMaXN0T2JqZWN0cyksIFwib2JqZWN0X25hbWVcIik7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UocmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzKTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3RPYmplY3RzLCBmdW5jdGlvbih2LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgYWxsb3dSZWFkLCBpc0FjdGl2ZSwgcmVmO1xuICAgICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgICBhbGxvd1JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLmFsbG93UmVhZCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0FjdGl2ZSAmJiBhbGxvd1JlYWQpIHtcbiAgICAgICAgcmV0dXJuIG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxpc3QgPSBbXTtcbiAgICBpZiAoXy5pc0VtcHR5KHJlbGF0ZWRMaXN0TmFtZXMpKSB7XG4gICAgICBsaXN0ID0gXy52YWx1ZXMobWFwTGlzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChyZWxhdGVkTGlzdE5hbWVzLCBmdW5jdGlvbihvYmplY3ROYW1lKSB7XG4gICAgICAgIGlmIChtYXBMaXN0W29iamVjdE5hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3QucHVzaChtYXBMaXN0W29iamVjdE5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmhhcyhfb2JqZWN0LCAnYWxsb3dfcmVsYXRlZExpc3QnKSkge1xuICAgICAgbGlzdCA9IF8uZmlsdGVyKGxpc3QsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdDtcbiAgfTtcbn1cblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKTtcbn07XG5cblxuLyogXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxuXHRleGFj5Li6dHJ1ZeaXtu+8jOmcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOS4jem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKSB7XG4gIHZhciBsaXN0Vmlld3MsIGxpc3Rfdmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICBpZiAoIShsaXN0Vmlld3MgIT0gbnVsbCA/IGxpc3RWaWV3cy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RfdmlldyA9IF8uZmluZChsaXN0Vmlld3MsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5faWQgPT09IGxpc3Rfdmlld19pZCB8fCBpdGVtLm5hbWUgPT09IGxpc3Rfdmlld19pZDtcbiAgfSk7XG4gIGlmICghbGlzdF92aWV3KSB7XG4gICAgaWYgKGV4YWMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbGlzdF92aWV3O1xufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCkge1xuICB2YXIgbGlzdFZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIGxpc3Rfdmlld19pZCA9PT0gXCJzdHJpbmdcIikge1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLCB7XG4gICAgICBfaWQ6IGxpc3Rfdmlld19pZFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkO1xuICB9XG4gIHJldHVybiAobGlzdFZpZXcgIT0gbnVsbCA/IGxpc3RWaWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOS7jmNvbHVtbnPlj4LmlbDkuK3ov4fmu6Tlh7rnlKjkuo7miYvmnLrnq6/mmL7npLrnmoRjb2x1bW5zXG5cdOinhOWIme+8mlxuXHQxLuS8mOWFiOaKimNvbHVtbnPkuK3nmoRuYW1l5a2X5q615o6S5Zyo56ys5LiA5LiqXG5cdDIu5pyA5aSa5Y+q6L+U5ZueNOS4quWtl+autVxuXHQzLuiAg+iZkeWuveWtl+auteWNoOeUqOaVtOihjOinhOWImeadoeS7tuS4i++8jOacgOWkmuWPqui/lOWbnuS4pOihjFxuICovXG5cbkNyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgY29sdW1ucykge1xuICB2YXIgY291bnQsIGZpZWxkLCBmaWVsZHMsIGdldEZpZWxkLCBpc05hbWVDb2x1bW4sIGl0ZW1Db3VudCwgbWF4Q291bnQsIG1heFJvd3MsIG5hbWVDb2x1bW4sIG5hbWVLZXksIG9iamVjdCwgcmVzdWx0O1xuICByZXN1bHQgPSBbXTtcbiAgbWF4Um93cyA9IDI7XG4gIG1heENvdW50ID0gbWF4Um93cyAqIDI7XG4gIGNvdW50ID0gMDtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBvYmplY3QuZmllbGRzO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBjb2x1bW5zO1xuICB9XG4gIG5hbWVLZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gIGlzTmFtZUNvbHVtbiA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgcmV0dXJuIGl0ZW0uZmllbGQgPT09IG5hbWVLZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpdGVtID09PSBuYW1lS2V5O1xuICAgIH1cbiAgfTtcbiAgZ2V0RmllbGQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHJldHVybiBmaWVsZHNbaXRlbS5maWVsZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZHNbaXRlbV07XG4gICAgfVxuICB9O1xuICBpZiAobmFtZUtleSkge1xuICAgIG5hbWVDb2x1bW4gPSBjb2x1bW5zLmZpbmQoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIGlzTmFtZUNvbHVtbihpdGVtKTtcbiAgICB9KTtcbiAgfVxuICBpZiAobmFtZUNvbHVtbikge1xuICAgIGZpZWxkID0gZ2V0RmllbGQobmFtZUNvbHVtbik7XG4gICAgaXRlbUNvdW50ID0gZmllbGQuaXNfd2lkZSA/IDIgOiAxO1xuICAgIGNvdW50ICs9IGl0ZW1Db3VudDtcbiAgICByZXN1bHQucHVzaChuYW1lQ29sdW1uKTtcbiAgfVxuICBjb2x1bW5zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgIGZpZWxkID0gZ2V0RmllbGQoaXRlbSk7XG4gICAgaWYgKCFmaWVsZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpdGVtQ291bnQgPSBmaWVsZC5pc193aWRlID8gMiA6IDE7XG4gICAgaWYgKGNvdW50IDwgbWF4Q291bnQgJiYgcmVzdWx0Lmxlbmd0aCA8IG1heENvdW50ICYmICFpc05hbWVDb2x1bW4oaXRlbSkpIHtcbiAgICAgIGNvdW50ICs9IGl0ZW1Db3VudDtcbiAgICAgIGlmIChjb3VudCA8PSBtYXhDb3VudCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuLypcbiAgICDojrflj5bpu5jorqTop4blm75cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3LCBvYmplY3QsIHJlZjtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIH1cbiAgaWYgKG9iamVjdCAhPSBudWxsID8gKHJlZiA9IG9iamVjdC5saXN0X3ZpZXdzKSAhPSBudWxsID8gcmVmW1wiZGVmYXVsdFwiXSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgIGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3NbXCJkZWZhdWx0XCJdO1xuICB9IGVsc2Uge1xuICAgIF8uZWFjaChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC5saXN0X3ZpZXdzIDogdm9pZCAwLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuICAgICAgaWYgKGxpc3Rfdmlldy5uYW1lID09PSBcImFsbFwiIHx8IGtleSA9PT0gXCJhbGxcIikge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXc7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWaWV3O1xufTtcblxuXG4vKlxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAodXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMCkge1xuICAgICAgY29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zO1xuICAgIH0gZWxzZSBpZiAoY29sdW1ucykge1xuICAgICAgY29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29sdW1ucztcbn07XG5cblxuLypcbiAgICDojrflj5blr7nosaHnmoTliJfooajnrKzkuIDkuKrop4blm77mmL7npLrnmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucykge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAodXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMCkge1xuICAgICAgY29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zO1xuICAgIH0gZWxzZSBpZiAoY29sdW1ucykge1xuICAgICAgY29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29sdW1ucztcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k6aKd5aSW5Yqg6L2955qE5a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICByZXR1cm4gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmV4dHJhX2NvbHVtbnMgOiB2b2lkIDA7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIGlmIChkZWZhdWx0Vmlldykge1xuICAgIGlmIChkZWZhdWx0Vmlldy5zb3J0KSB7XG4gICAgICByZXR1cm4gZGVmYXVsdFZpZXcuc29ydDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtbXCJjcmVhdGVkXCIsIFwiZGVzY1wiXV07XG4gICAgfVxuICB9XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzQWxsVmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcImFsbFwiO1xufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6VGFidWxhcuaOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IGZ1bmN0aW9uKHNvcnQsIHRhYnVsYXJDb2x1bW5zKSB7XG4gIHZhciB0YWJ1bGFyX3NvcnQ7XG4gIHRhYnVsYXJfc29ydCA9IFtdO1xuICBfLmVhY2goc29ydCwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBjb2x1bW5faW5kZXgsIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGlmIChpdGVtLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgXCJhc2NcIl0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0ubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBpdGVtWzFdXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgb3JkZXJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YWJ1bGFyX3NvcnQ7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gZnVuY3Rpb24oc29ydCkge1xuICB2YXIgZHhfc29ydDtcbiAgZHhfc29ydCA9IFtdO1xuICBfLmVhY2goc29ydCwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZHhfc29ydC5wdXNoKGl0ZW0pO1xuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goW2ZpZWxkX25hbWUsIG9yZGVyXSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGR4X3NvcnQ7XG59O1xuIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJ9XG5cdFx0U2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFx0X3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIn1cblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuXHRcdFx0cmVnRXg6IF9yZWdFeE1lc3NhZ2VzLFxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIi8vIOWboOS4um1ldGVvcue8luivkWNvZmZlZXNjcmlwdOS8muWvvOiHtGV2YWzlh73mlbDmiqXplJnvvIzmiYDku6XljZXni6zlhpnlnKjkuIDkuKpqc+aWh+S7tuS4reOAglxuQ3JlYXRvci5ldmFsSW5Db250ZXh0ID0gZnVuY3Rpb24oanMsIGNvbnRleHQpIHtcbiAgICAvLyMgUmV0dXJuIHRoZSByZXN1bHRzIG9mIHRoZSBpbi1saW5lIGFub255bW91cyBmdW5jdGlvbiB3ZSAuY2FsbCB3aXRoIHRoZSBwYXNzZWQgY29udGV4dFxuICAgIHJldHVybiBmdW5jdGlvbigpIHsgXG4gICAgXHRyZXR1cm4gZXZhbChqcyk7IFxuXHR9LmNhbGwoY29udGV4dCk7XG59XG5cblxuQ3JlYXRvci5ldmFsID0gZnVuY3Rpb24oanMpe1xuXHR0cnl7XG5cdFx0cmV0dXJuIGV2YWwoanMpXG5cdH1jYXRjaCAoZSl7XG5cdFx0Y29uc29sZS5lcnJvcihlLCBqcyk7XG5cdH1cbn07IiwiXHRnZXRPcHRpb24gPSAob3B0aW9uKS0+XG5cdFx0Zm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKVxuXHRcdGlmIGZvby5sZW5ndGggPiAyXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV0sIGNvbG9yOiBmb29bMl19XG5cdFx0ZWxzZSBpZiBmb28ubGVuZ3RoID4gMVxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1swXX1cblxuXHRjb252ZXJ0RmllbGQgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkLCBzcGFjZUlkKS0+XG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xuXHRcdFx0Y29kZSA9IGZpZWxkLnBpY2tsaXN0IHx8IFwiI3tvYmplY3RfbmFtZX0uI3tmaWVsZF9uYW1lfVwiO1xuXHRcdFx0aWYgY29kZVxuXHRcdFx0XHRwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XG5cdFx0XHRcdGlmIHBpY2tsaXN0XG5cdFx0XHRcdFx0b3B0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdGFsbE9wdGlvbnMgPSBbXTtcblx0XHRcdFx0XHRwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdClcblx0XHRcdFx0XHRwaWNrbGlzdE9wdGlvbnMgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJyk/LnJldmVyc2UoKTtcblx0XHRcdFx0XHRfLmVhY2ggcGlja2xpc3RPcHRpb25zLCAoaXRlbSktPlxuXHRcdFx0XHRcdFx0bGFiZWwgPSBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdHZhbHVlID0gaXRlbS52YWx1ZSB8fCBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdGFsbE9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGVuYWJsZTogaXRlbS5lbmFibGUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW5hYmxlXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZGVmYXVsdFxuXHRcdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZVxuXHRcdFx0XHRcdGlmIG9wdGlvbnMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IG9wdGlvbnNcblx0XHRcdFx0XHRpZiBhbGxPcHRpb25zLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGZpZWxkLmFsbE9wdGlvbnMgPSBhbGxPcHRpb25zXG5cdFx0cmV0dXJuIGZpZWxkO1xuXG5cdENyZWF0b3IuY29udmVydE9iamVjdCA9IChvYmplY3QsIHNwYWNlSWQpLT5cblx0XHRpZiAhb2JqZWN0XG5cdFx0XHRyZXR1cm5cblx0XHRfLmZvckVhY2ggb2JqZWN0LnRyaWdnZXJzLCAodHJpZ2dlciwga2V5KS0+XG5cblx0XHRcdGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIilcblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gdHJpZ2dlcj8uX3RvZG9cblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kb1xuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXG5cdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcblxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYilcblx0XHRcdFx0XHQj5Y+q5pyJdXBkYXRl5pe277yMIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zIOaJjeacieWAvFxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj++8jOWwpOWFtuaYr0NvbGxlY3Rpb25cblx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyl7I3tfdG9kb19mcm9tX2RifX0pXCIpXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCJcblx0XHRcdFx0X3RvZG8gPSB0cmlnZ2VyLnRvZG9cblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxuXHRcdFx0XHRcdHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpXG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuZmllbGRzLCAoZmllbGQsIGtleSktPlxuXG5cdFx0XHRcdGlmIGZpZWxkLm9taXRcblx0XHRcdFx0XHQjIG9taXTlrZfmrrXlrozlhajpmpDol4/kuI3mmL7npLpcblx0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSB0cnVlXG5cblx0XHRcdFx0aWYgZmllbGQucmVxdWlyZWQgJiYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0XHQjIOmAmueUqOW/heWhq+Wtl+autSAjMjk1Mu+8jOW/heWhq+Wtl+auteiuvue9ruS4uumdnuWPquivu1xuXHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gZmFsc2VcblxuXHRcdFx0XHRzeXN0ZW1CYXNlRmllbGRzID0gQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzKClcblx0XHRcdFx0aWYgc3lzdGVtQmFzZUZpZWxkcy5pbmRleE9mKGtleSkgPiAtMVxuXHRcdFx0XHRcdCMg5by65Yi25Yib5bu65Lq65Yib5bu65pe26Ze0562J5a2X5q615Li65Y+q6K+7XG5cdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbj8uX3RvZG9cblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IGFjdGlvbj8udG9kb1xuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGVcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKVxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYlxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24oKXsje190b2RvX2Zyb21fZGJ9fSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvclxuXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy5fdmlzaWJsZVxuXHRcdFx0XHRpZiBfdmlzaWJsZVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhfdmlzaWJsZSlcblx0XHRcdFx0XHRcdFx0X3Zpc2libGUgPSBfdmlzaWJsZS50cmltKClcblx0XHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNFeHByZXNzaW9uKF92aXNpYmxlKVxuXHRcdFx0XHRcdFx0XHQjIOaUr+aMgemhtemdouW4g+WxgOS4reWGmXZpc2libGVfb27lh73mlbDooajovr7lvI/vvIzpobXpnaLluIPlsYDmjInpkq7nmoTmmL7npLrmnaHku7bkuI3nlJ/mlYggIzMzNDBcblx0XHRcdFx0XHRcdFx0YWN0aW9uLnZpc2libGUgPSAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zLCByZWNvcmQpIC0+XG5cdFx0XHRcdFx0XHRcdFx0Z2xvYmFsRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIENyZWF0b3IuVVNFUl9DT05URVhULCB7bm93OiBuZXcgRGF0ZSgpfSlcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gU3RlZWRvcy5wYXJzZVNpbmdsZUV4cHJlc3Npb24oX3Zpc2libGUsIHJlY29yZCwgXCIjXCIsIGdsb2JhbERhdGEpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3Zpc2libGV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGVcblx0XHRlbHNlXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxuXHRcdFx0XHRfdG9kbyA9IGFjdGlvbj8udG9kb1xuXHRcdFx0XHRpZiBfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0YWN0aW9uLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKVxuXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy52aXNpYmxlXG5cblx0XHRcdFx0aWYgX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKVxuXHRcdFx0XHRcdGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKClcblxuXHRcdF8uZm9yRWFjaCBvYmplY3QuZmllbGRzLCAoZmllbGQsIGtleSktPlxuXG5cdFx0XHRmaWVsZCA9IGNvbnZlcnRGaWVsZChvYmplY3QubmFtZSwga2V5LCBmaWVsZCwgc3BhY2VJZCk7XG5cblx0XHRcdGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdFx0I+aUr+aMgVxcbuaIluiAheiLseaWh+mAl+WPt+WIhuWJsixcblx0XHRcdFx0XHRfLmZvckVhY2ggZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgKG9wdGlvbiktPlxuXHRcdFx0XHRcdFx0aWYgb3B0aW9uLmluZGV4T2YoXCIsXCIpXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpXG5cdFx0XHRcdFx0XHRcdF8uZm9yRWFjaCBvcHRpb25zLCAoX29wdGlvbiktPlxuXHRcdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xuXHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yXG5cblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucylcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxuXHRcdFx0XHRcdCPmlK/mjIHmlbDnu4TkuK3nm7TmjqXlrprkuYnmr4/kuKrpgInpobnnmoTnroDniYjmoLzlvI/lrZfnrKbkuLJcblx0XHRcdFx0XHRfLmZvckVhY2ggZmllbGQub3B0aW9ucywgKG9wdGlvbiktPlxuXHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhvcHRpb24pXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2gob3B0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xuXHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yXG5cblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiAhXy5pc0Z1bmN0aW9uKGZpZWxkLm9wdGlvbnMpICYmICFfLmlzQXJyYXkoZmllbGQub3B0aW9ucykgJiYgXy5pc09iamVjdChmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdF8uZWFjaCBmaWVsZC5vcHRpb25zLCAodiwgayktPlxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiB2LCB2YWx1ZToga31cblx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRvcHRpb25zID0gZmllbGQub3B0aW9uc1xuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNGdW5jdGlvbihvcHRpb25zKVxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9uc1xuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucylcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0cmVnRXggPSBmaWVsZC5yZWdFeFxuXHRcdFx0XHRpZiByZWdFeFxuXHRcdFx0XHRcdGZpZWxkLl9yZWdFeCA9IGZpZWxkLnJlZ0V4LnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVnRXggPSBmaWVsZC5fcmVnRXhcblx0XHRcdFx0aWYgcmVnRXhcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLnJlZ0V4ID0gQ3JlYXRvci5ldmFsKFwiKCN7cmVnRXh9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRtaW4gPSBmaWVsZC5taW5cblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKG1pbilcblx0XHRcdFx0XHRmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0bWluID0gZmllbGQuX21pblxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKG1pbilcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLm1pbiA9IENyZWF0b3IuZXZhbChcIigje21pbn0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG1heCA9IGZpZWxkLm1heFxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWF4KVxuXHRcdFx0XHRcdGZpZWxkLl9tYXggPSBtYXgudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtYXggPSBmaWVsZC5fbWF4XG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWF4KVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQubWF4ID0gQ3JlYXRvci5ldmFsKFwiKCN7bWF4fSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aWYgZmllbGQuYXV0b2Zvcm1cblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGVcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9IE9iamVjdCAmJiBfdHlwZSAhPSBTdHJpbmcgJiYgX3R5cGUgIT0gTnVtYmVyICYmIF90eXBlICE9IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSlcblx0XHRcdFx0XHRcdGZpZWxkLmF1dG9mb3JtLl90eXBlID0gX3R5cGUudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxuXHRcdFx0XHRcdF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGVcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKVxuXHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdGZpZWxkLmF1dG9mb3JtLnR5cGUgPSBDcmVhdG9yLmV2YWwoXCIoI3tfdHlwZX0pXCIpXG5cdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBmaWVsZCAtPiB0eXBlIGVycm9yXCIsIGZpZWxkLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0YmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gPSBvcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKVxuXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKVxuXG5cdFx0XHRcdGlmIGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihjcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKVxuXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gfHwgZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG9cblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0YmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvblxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWZlcmVuY2VfdG99KVwiKVxuXG5cdFx0XHRcdGlmIGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tjcmVhdGVGdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2JlZm9yZU9wZW5GdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlcnNGdW5jdGlvbn0pXCIpXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpXG5cdFx0XHRcdFx0ZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWVcblxuXHRcdFx0XHRpZiAhZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZGVmYXVsdFZhbHVlfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXHRcdFx0XG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKVxuXHRcdFx0XHRcdGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZClcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3IuZXZhbChcIigje2lzX2NvbXBhbnlfbGltaXRlZH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdF8uZm9yRWFjaCBvYmplY3QubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KSAtPlxuXHRcdFx0IyMjXG5cdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcblx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG5cdFx0XHQxLiDmlbTkuKpmaWx0ZXJz5Li6ZnVuY3Rpb246XG5cdFx0XHTlpoLvvJpcblx0XHRcdGZpbHRlcnM6ICgpLT5cblx0XHRcdFx0cmV0dXJuIFtbW1wib2JqZWN0X25hbWVcIixcIj1cIixcInByb2plY3RfaXNzdWVzXCJdLCdvcicsW1wib2JqZWN0X25hbWVcIixcIj1cIixcInRhc2tzXCJdXV1cblx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxuXHRcdFx05aaC77yaXG5cdFx0XHRmaWx0ZXJzOiBbW1wib2JqZWN0X25hbWVcIiwgXCI9XCIsICgpLT5cblx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuXHRcdFx0XV1cblx0XHRcdOaIllxuXHRcdFx0ZmlsdGVyczogW3tcblx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcblx0XHRcdFx0XCJvcGVyYXRpb25cIjogXCI9XCJcblx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XG5cdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuXHRcdFx0fV1cblx0XHRcdCMjI1xuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKVxuXHRcdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0XHRsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpXG5cdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKVxuXHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3IuZXZhbChcIigje2xpc3Rfdmlldy5fZmlsdGVyc30pXCIpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdF8uZm9yRWFjaCBsaXN0X3ZpZXcuZmlsdGVycywgKGZpbHRlciwgX2luZGV4KS0+XG5cdFx0XHRcdFx0aWYgXy5pc0FycmF5KGZpbHRlcilcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDMgYW5kIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIubGVuZ3RoID09IDMgYW5kIF8uaXNEYXRlKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOaYr0RhdGXnsbvlnovvvIzliJlmaWx0ZXJbMl3lgLzliLDliY3nq6/kvJroh6rliqjovazmiJDlrZfnrKbkuLLvvIzmoLzlvI/vvJpcIjIwMTgtMDMtMjlUMDM6NDM6MjEuNzg3WlwiXG5cdFx0XHRcdFx0XHRcdFx0IyDljIXmi6xncmlk5YiX6KGo6K+35rGC55qE5o6l5Y+j5Zyo5YaF55qE5omA5pyJT0RhdGHmjqXlj6PvvIxEYXRl57G75Z6L5a2X5q616YO95Lya5Lul5LiK6L+w5qC85byP6L+U5ZueXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzNdID0gXCJEQVRFXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkZVTkNUSU9OXCJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXJbMl19KVwiKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiREFURVwiXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gbmV3IERhdGUoZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc09iamVjdChmaWx0ZXIpXG5cdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0RhdGUoZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLl9pc19kYXRlID09IHRydWVcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXIudmFsdWUpXG5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdGlmIG9iamVjdC5mb3JtICYmICFfLmlzU3RyaW5nKG9iamVjdC5mb3JtKVxuXHRcdFx0XHRvYmplY3QuZm9ybSA9IEpTT04uc3RyaW5naWZ5IG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cblx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24odmFsKVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbCArICcnO1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0ZWxzZSBpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGlmIG9iamVjdC5mb3JtXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XG5cdFx0XHRcdFx0aWYgXy5pc1N0cmluZyh2YWwpICYmIHZhbC5zdGFydHNXaXRoKCdmdW5jdGlvbicpXG5cdFx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LnJlbGF0ZWRfbGlzdHMsIChyZWxhdGVkT2JqSW5mbyktPlxuXHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKVxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKVxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZmlsdGVyc19jb2RlXCIsIHZhbFxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZF9saXN0cywgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxuXHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKVxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKVxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZmlsdGVyc19jb2RlXCIsIHZhbFxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxuXHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKVxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKVxuXG5cdFx0cmV0dXJuIG9iamVjdFxuXG5cbiIsInZhciBjb252ZXJ0RmllbGQsIGdldE9wdGlvbjtcblxuZ2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIHZhciBmb287XG4gIGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIik7XG4gIGlmIChmb28ubGVuZ3RoID4gMikge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1sxXSxcbiAgICAgIGNvbG9yOiBmb29bMl1cbiAgICB9O1xuICB9IGVsc2UgaWYgKGZvby5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMF1cbiAgICB9O1xuICB9XG59O1xuXG5jb252ZXJ0RmllbGQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGQsIHNwYWNlSWQpIHtcbiAgdmFyIGFsbE9wdGlvbnMsIGNvZGUsIG9wdGlvbnMsIHBpY2tsaXN0LCBwaWNrbGlzdE9wdGlvbnMsIHJlZjtcbiAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiBzcGFjZUlkICYmIGZpZWxkLnR5cGUgPT09ICdzZWxlY3QnKSB7XG4gICAgY29kZSA9IGZpZWxkLnBpY2tsaXN0IHx8IChvYmplY3RfbmFtZSArIFwiLlwiICsgZmllbGRfbmFtZSk7XG4gICAgaWYgKGNvZGUpIHtcbiAgICAgIHBpY2tsaXN0ID0gQ3JlYXRvci5nZXRQaWNrbGlzdChjb2RlLCBzcGFjZUlkKTtcbiAgICAgIGlmIChwaWNrbGlzdCkge1xuICAgICAgICBvcHRpb25zID0gW107XG4gICAgICAgIGFsbE9wdGlvbnMgPSBbXTtcbiAgICAgICAgcGlja2xpc3RPcHRpb25zID0gQ3JlYXRvci5nZXRQaWNrTGlzdE9wdGlvbnMocGlja2xpc3QpO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSAocmVmID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKSA6IHZvaWQgMDtcbiAgICAgICAgXy5lYWNoKHBpY2tsaXN0T3B0aW9ucywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHZhciBsYWJlbCwgdmFsdWU7XG4gICAgICAgICAgbGFiZWwgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgdmFsdWUgPSBpdGVtLnZhbHVlIHx8IGl0ZW0ubmFtZTtcbiAgICAgICAgICBhbGxPcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZW5hYmxlOiBpdGVtLmVuYWJsZSxcbiAgICAgICAgICAgIGNvbG9yOiBpdGVtLmNvbG9yXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGl0ZW0uZW5hYmxlKSB7XG4gICAgICAgICAgICBvcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbVtcImRlZmF1bHRcIl0pIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsbE9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkLmFsbE9wdGlvbnMgPSBhbGxPcHRpb25zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmaWVsZDtcbn07XG5cbkNyZWF0b3IuY29udmVydE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCwgc3BhY2VJZCkge1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCBrZXkpIHtcbiAgICB2YXIgX3RvZG8sIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYjtcbiAgICBpZiAoKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpKSB7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyICE9IG51bGwgPyB0cmlnZ2VyLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikge1xuICAgICAgX3RvZG8gPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICByZXR1cm4gdHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgICB2YXIgc3lzdGVtQmFzZUZpZWxkcztcbiAgICAgIGlmIChmaWVsZC5vbWl0KSB7XG4gICAgICAgIGZpZWxkLmhpZGRlbiA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoZmllbGQucmVxdWlyZWQgJiYgZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZmllbGQucmVhZG9ubHkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHN5c3RlbUJhc2VGaWVsZHMgPSBDcmVhdG9yLmdldFN5c3RlbUJhc2VGaWVsZHMoKTtcbiAgICAgIGlmIChzeXN0ZW1CYXNlRmllbGRzLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYiwgX3Zpc2libGUsIGVycm9yO1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSkpIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbigpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfLmlzU3RyaW5nKF92aXNpYmxlKSkge1xuICAgICAgICAgICAgX3Zpc2libGUgPSBfdmlzaWJsZS50cmltKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChTdGVlZG9zLmlzRXhwcmVzc2lvbihfdmlzaWJsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF9wZXJtaXNzaW9ucywgcmVjb3JkKSB7XG4gICAgICAgICAgICAgIHZhciBnbG9iYWxEYXRhO1xuICAgICAgICAgICAgICBnbG9iYWxEYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgQ3JlYXRvci5VU0VSX0NPTlRFWFQsIHtcbiAgICAgICAgICAgICAgICBub3c6IG5ldyBEYXRlKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBTdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbihfdmlzaWJsZSwgcmVjb3JkLCBcIiNcIiwgZ2xvYmFsRGF0YSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnZpc2libGUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF92aXNpYmxlICsgXCIpXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG8sIF92aXNpYmxlO1xuICAgICAgX3RvZG8gPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbykpIHtcbiAgICAgICAgYWN0aW9uLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24uX3Zpc2libGUgPSBfdmlzaWJsZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgdmFyIF9vcHRpb25zLCBfdHlwZSwgYmVmb3JlT3BlbkZ1bmN0aW9uLCBjcmVhdGVGdW5jdGlvbiwgZGVmYXVsdFZhbHVlLCBlcnJvciwgZmlsdGVyc0Z1bmN0aW9uLCBpc19jb21wYW55X2xpbWl0ZWQsIG1heCwgbWluLCBvcHRpb25zLCBvcHRpb25zRnVuY3Rpb24sIHJlZmVyZW5jZV90bywgcmVnRXg7XG4gICAgZmllbGQgPSBjb252ZXJ0RmllbGQob2JqZWN0Lm5hbWUsIGtleSwgZmllbGQsIHNwYWNlSWQpO1xuICAgIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNTdHJpbmcoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgICBpZiAob3B0aW9uLmluZGV4T2YoXCIsXCIpKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIHJldHVybiBfLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24oX29wdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgaWYgKF8uaXNTdHJpbmcob3B0aW9uKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChvcHRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQub3B0aW9ucyAmJiAhXy5pc0Z1bmN0aW9uKGZpZWxkLm9wdGlvbnMpICYmICFfLmlzQXJyYXkoZmllbGQub3B0aW9ucykgJiYgXy5pc09iamVjdChmaWVsZC5vcHRpb25zKSkge1xuICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgIF8uZWFjaChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogdixcbiAgICAgICAgICB2YWx1ZToga1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNGdW5jdGlvbihvcHRpb25zKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnMudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLl9vcHRpb25zO1xuICAgICAgaWYgKG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm9wdGlvbnMgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG9wdGlvbnMgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZWdFeCA9IGZpZWxkLnJlZ0V4O1xuICAgICAgaWYgKHJlZ0V4KSB7XG4gICAgICAgIGZpZWxkLl9yZWdFeCA9IGZpZWxkLnJlZ0V4LnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZ0V4ID0gZmllbGQuX3JlZ0V4O1xuICAgICAgaWYgKHJlZ0V4KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQucmVnRXggPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHJlZ0V4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgbWluID0gZmllbGQubWluO1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihtaW4pKSB7XG4gICAgICAgIGZpZWxkLl9taW4gPSBtaW4udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWluID0gZmllbGQuX21pbjtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG1pbikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5taW4gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG1pbiArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1heCA9IGZpZWxkLm1heDtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWF4KSkge1xuICAgICAgICBmaWVsZC5fbWF4ID0gbWF4LnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1heCA9IGZpZWxkLl9tYXg7XG4gICAgICBpZiAoXy5pc1N0cmluZyhtYXgpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWF4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtYXggKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBpZiAoZmllbGQuYXV0b2Zvcm0pIHtcbiAgICAgICAgX3R5cGUgPSBmaWVsZC5hdXRvZm9ybS50eXBlO1xuICAgICAgICBpZiAoX3R5cGUgJiYgXy5pc0Z1bmN0aW9uKF90eXBlKSAmJiBfdHlwZSAhPT0gT2JqZWN0ICYmIF90eXBlICE9PSBTdHJpbmcgJiYgX3R5cGUgIT09IE51bWJlciAmJiBfdHlwZSAhPT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKSkge1xuICAgICAgICAgIGZpZWxkLmF1dG9mb3JtLl90eXBlID0gX3R5cGUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZmllbGQuYXV0b2Zvcm0pIHtcbiAgICAgICAgX3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNTdHJpbmcoX3R5cGUpKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZpZWxkLmF1dG9mb3JtLnR5cGUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90eXBlICsgXCIpXCIpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBmaWVsZCAtPiB0eXBlIGVycm9yXCIsIGZpZWxkLCBlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgIGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb247XG4gICAgICBiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICBpZiAob3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gPSBvcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWZlcmVuY2VfdG8gJiYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQuX3JlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90by50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2NyZWF0ZUZ1bmN0aW9uID0gY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uID0gZmlsdGVyc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gfHwgZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQuX3JlZmVyZW5jZV90bztcbiAgICAgIGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuX2NyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgIGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gfHwgZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQub3B0aW9uc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHJlZmVyZW5jZV90byArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgY3JlYXRlRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGJlZm9yZU9wZW5GdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZTtcbiAgICAgIGlmICghZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBkZWZhdWx0VmFsdWUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICBpZiAoaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNGdW5jdGlvbihpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHJldHVybiBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICBpZiAoaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGlzX2NvbXBhbnlfbGltaXRlZCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIF8uZm9yRWFjaChvYmplY3QubGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcblxuICAgIC8qXG4gICAgXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXG4gICAgXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcbiAgICBcdFx0XHQxLiDmlbTkuKpmaWx0ZXJz5Li6ZnVuY3Rpb246XG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFtbW1wib2JqZWN0X25hbWVcIixcIj1cIixcInByb2plY3RfaXNzdWVzXCJdLCdvcicsW1wib2JqZWN0X25hbWVcIixcIj1cIixcInRhc2tzXCJdXV1cbiAgICBcdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiBbW1wib2JqZWN0X25hbWVcIiwgXCI9XCIsICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHRdXVxuICAgIFx0XHRcdOaIllxuICAgIFx0XHRcdGZpbHRlcnM6IFt7XG4gICAgXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxuICAgIFx0XHRcdFx0XCJvcGVyYXRpb25cIjogXCI9XCJcbiAgICBcdFx0XHRcdFwidmFsdWVcIjogKCktPlxuICAgIFx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0fV1cbiAgICAgKi9cbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGxpc3Rfdmlldy5fZmlsdGVycyArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF8uZm9yRWFjaChsaXN0X3ZpZXcuZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICAgICAgaWYgKF8uaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDMgJiYgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbHRlci5sZW5ndGggPT09IDMgJiYgXy5pc0RhdGUoZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJEQVRFXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiRlVOQ1RJT05cIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlclsyXSArIFwiKVwiKTtcbiAgICAgICAgICAgICAgZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJEQVRFXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gbmV3IERhdGUoZmlsdGVyWzJdKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0RhdGUoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5fdmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbHRlci5faXNfZGF0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gbmV3IERhdGUoZmlsdGVyLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pKSB7XG4gICAgICBvYmplY3QuZm9ybSA9IEpTT04uc3RyaW5naWZ5KG9iamVjdC5mb3JtLCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsICsgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChvYmplY3QuZm9ybSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlKG9iamVjdC5mb3JtLCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyh2YWwpICYmIHZhbC5zdGFydHNXaXRoKCdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkX2xpc3RzLCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZmlsdGVyc19jb2RlXCIsIHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRfbGlzdHMsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkTGlzdCwgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImZpbHRlcnNfY29kZVwiLCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkTGlzdCwgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9XG5cbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCJcblxuQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEgPSAocHJlZml4LGZpZWxkVmFyaWFibGUpLT5cblx0cmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XG5cblx0cmV2ID0gZmllbGRWYXJpYWJsZS5yZXBsYWNlIHJlZywgKG0sICQxKS0+XG5cdFx0cmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLFwiW1xcXCJcIikucmVwbGFjZSgvXFxzKlxcfS8sXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLFwiXFxcIl1bXFxcIlwiKTtcblxuXHRyZXR1cm4gcmV2XG5cbkNyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhID0gKGZvcm11bGFfc3RyKS0+XG5cdGlmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ7XCIpID4gLTEgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIn1cIikgPiAtMVxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IChmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpLT5cblx0aWYgZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cilcblxuXHRcdGlmICFfLmlzQm9vbGVhbihvcHRpb25zPy5leHRlbmQpXG5cdFx0XHRleHRlbmQgPSB0cnVlXG5cblx0XHRfVkFMVUVTID0ge31cblx0XHRfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpXG5cdFx0aWYgZXh0ZW5kXG5cdFx0XHRfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgQ3JlYXRvci5nZXRVc2VyQ29udGV4dChvcHRpb25zPy51c2VySWQsIG9wdGlvbnM/LnNwYWNlSWQpKVxuXHRcdGZvcm11bGFfc3RyID0gQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEoXCJ0aGlzXCIsIGZvcm11bGFfc3RyKVxuXG5cdFx0dHJ5XG5cdFx0XHRkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKSAgICMg5q2k5aSE5LiN6IO955Sod2luZG93LmV2YWwg77yM5Lya5a+86Ie05Y+Y6YeP5L2c55So5Z+f5byC5bi4XG5cdFx0XHRyZXR1cm4gZGF0YVxuXHRcdGNhdGNoIGVcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogI3tmb3JtdWxhX3N0cn1cIiwgZSlcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHR0b2FzdHI/LmVycm9yKFwi5YWs5byP5omn6KGM5Ye66ZSZ5LqG77yM6K+35qOA5p+l5YWs5byP6YWN572u5piv5ZCm5q2j56Gu77yBXCIpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogI3tmb3JtdWxhX3N0cn0je2V9XCJcblxuXHRyZXR1cm4gZm9ybXVsYV9zdHJcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fTtcblxuQ3JlYXRvci5Gb3JtdWxhci5QUkVGSVggPSBcIl9WQUxVRVNcIjtcblxuQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEgPSBmdW5jdGlvbihwcmVmaXgsIGZpZWxkVmFyaWFibGUpIHtcbiAgdmFyIHJlZywgcmV2O1xuICByZWcgPSAvKFxce1tee31dKlxcfSkvZztcbiAgcmV2ID0gZmllbGRWYXJpYWJsZS5yZXBsYWNlKHJlZywgZnVuY3Rpb24obSwgJDEpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJDEucmVwbGFjZSgvXFx7XFxzKi8sIFwiW1xcXCJcIikucmVwbGFjZSgvXFxzKlxcfS8sIFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZywgXCJcXFwiXVtcXFwiXCIpO1xuICB9KTtcbiAgcmV0dXJuIHJldjtcbn07XG5cbkNyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYV9zdHIpIHtcbiAgaWYgKF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ7XCIpID4gLTEgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIn1cIikgPiAtMSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuRm9ybXVsYXIucnVuID0gZnVuY3Rpb24oZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKSB7XG4gIHZhciBfVkFMVUVTLCBkYXRhLCBlLCBleHRlbmQ7XG4gIGlmIChmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSkge1xuICAgIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5leHRlbmQgOiB2b2lkIDApKSB7XG4gICAgICBleHRlbmQgPSB0cnVlO1xuICAgIH1cbiAgICBfVkFMVUVTID0ge307XG4gICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKTtcbiAgICBpZiAoZXh0ZW5kKSB7XG4gICAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgQ3JlYXRvci5nZXRVc2VyQ29udGV4dChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnVzZXJJZCA6IHZvaWQgMCwgb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zcGFjZUlkIDogdm9pZCAwKSk7XG4gICAgfVxuICAgIGZvcm11bGFfc3RyID0gQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEoXCJ0aGlzXCIsIGZvcm11bGFfc3RyKTtcbiAgICB0cnkge1xuICAgICAgZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUyk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyLCBlKTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0b2FzdHIgIT09IFwidW5kZWZpbmVkXCIgJiYgdG9hc3RyICE9PSBudWxsKSB7XG4gICAgICAgICAgdG9hc3RyLmVycm9yKFwi5YWs5byP5omn6KGM5Ye66ZSZ5LqG77yM6K+35qOA5p+l5YWs5byP6YWN572u5piv5ZCm5q2j56Gu77yBXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciArIGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZm9ybXVsYV9zdHI7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge30gICAjIOatpOWvueixoeWPquiDveWcqOehruS/neaJgOaciU9iamVjdOWIneWni+WMluWujOaIkOWQjuiwg+eUqO+8jCDlkKbliJnojrflj5bliLDnmoRvYmplY3TkuI3lhahcblxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gKG9iamVjdF9uYW1lKS0+XG5cdGlmIG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKVxuXHRcdG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJylcblx0cmV0dXJuIG9iamVjdF9uYW1lXG5cbkNyZWF0b3IuT2JqZWN0ID0gKG9wdGlvbnMpLT5cblx0X2Jhc2VPYmplY3QgPSBDcmVhdG9yLmJhc2VPYmplY3Rcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0X2Jhc2VPYmplY3QgPSB7YWN0aW9uczogQ3JlYXRvci5iYXNlT2JqZWN0LmFjdGlvbnMgLCBmaWVsZHM6IHt9LCB0cmlnZ2Vyczoge30sIHBlcm1pc3Npb25fc2V0OiB7fX1cblx0c2VsZiA9IHRoaXNcblx0aWYgKCFvcHRpb25zLm5hbWUpXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuXG5cdHNlbGYuX2lkID0gb3B0aW9ucy5faWQgfHwgb3B0aW9ucy5uYW1lXG5cdHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlXG5cdHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZVxuXHRzZWxmLmxhYmVsID0gb3B0aW9ucy5sYWJlbFxuXHRzZWxmLmljb24gPSBvcHRpb25zLmljb25cblx0c2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb25cblx0c2VsZi5pc192aWV3ID0gb3B0aW9ucy5pc192aWV3XG5cdHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybVxuXHRzZWxmLnJlbGF0ZWRMaXN0ID0gb3B0aW9ucy5yZWxhdGVkTGlzdFxuXHRzZWxmLnJlbGF0ZWRfbGlzdHMgPSBvcHRpb25zLnJlbGF0ZWRfbGlzdHNcblx0c2VsZi5oYXNJbXBvcnRUZW1wbGF0ZXMgPSBvcHRpb25zLmhhc0ltcG9ydFRlbXBsYXRlc1xuXHRzZWxmLnZlcnNpb24gPSBvcHRpb25zLnZlcnNpb24gfHwgMS4wXG5cdGlmICFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09IHRydWVcblx0XHRzZWxmLmlzX2VuYWJsZSA9IHRydWVcblx0ZWxzZVxuXHRcdHNlbGYuaXNfZW5hYmxlID0gZmFsc2Vcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKVxuXHRcdFx0c2VsZi5hbGxvd19jdXN0b21BY3Rpb25zID0gb3B0aW9ucy5hbGxvd19jdXN0b21BY3Rpb25zXG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2V4Y2x1ZGVfYWN0aW9ucycpXG5cdFx0XHRzZWxmLmV4Y2x1ZGVfYWN0aW9ucyA9IG9wdGlvbnMuZXhjbHVkZV9hY3Rpb25zXG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2FsbG93X3JlbGF0ZWRMaXN0Jylcblx0XHRcdHNlbGYuYWxsb3dfcmVsYXRlZExpc3QgPSBvcHRpb25zLmFsbG93X3JlbGF0ZWRMaXN0XG5cdHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaFxuXHRzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzXG5cdHNlbGYuZW5hYmxlX3Rhc2tzID0gb3B0aW9ucy5lbmFibGVfdGFza3Ncblx0c2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3Rlc1xuXHRzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0XG5cdHNlbGYuZW5hYmxlX2V2ZW50cyA9IG9wdGlvbnMuZW5hYmxlX2V2ZW50c1xuXHRpZiBvcHRpb25zLnBhZ2luZ1xuXHRcdHNlbGYucGFnaW5nID0gb3B0aW9ucy5wYWdpbmdcblx0c2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlblxuXHRzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09IHVuZGVmaW5lZCkgb3Igb3B0aW9ucy5lbmFibGVfYXBpXG5cdHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b21cblx0c2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZVxuXHRzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXNcblx0c2VsZi5lbmFibGVfcHJvY2VzcyA9IG9wdGlvbnMuZW5hYmxlX3Byb2Nlc3Ncblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXG5cdFx0XHRzZWxmLmVuYWJsZV90cmVlID0gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZVxuXHRcdFx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXG5cdGVsc2Vcblx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcblx0XHRzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZVxuXHRzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvd1xuXHRzZWxmLmZpbHRlcl9jb21wYW55ID0gb3B0aW9ucy5maWx0ZXJfY29tcGFueVxuXHRzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKVxuXHRzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlclxuXHRzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoXG5cdHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbFxuXHRzZWxmLmVuYWJsZV9hcHByb3ZhbHMgPSBvcHRpb25zLmVuYWJsZV9hcHByb3ZhbHNcblx0c2VsZi5lbmFibGVfZm9sbG93ID0gb3B0aW9ucy5lbmFibGVfZm9sbG93XG5cdHNlbGYuZW5hYmxlX3dvcmtmbG93ID0gb3B0aW9ucy5lbmFibGVfd29ya2Zsb3dcblx0c2VsZi5lbmFibGVfaW5saW5lX2VkaXQgPSBvcHRpb25zLmVuYWJsZV9pbmxpbmVfZWRpdFxuXHRzZWxmLmRldGFpbHMgPSBvcHRpb25zLmRldGFpbHNcblx0c2VsZi5tYXN0ZXJzID0gb3B0aW9ucy5tYXN0ZXJzXG5cdHNlbGYubG9va3VwX2RldGFpbHMgPSBvcHRpb25zLmxvb2t1cF9kZXRhaWxzXG5cdGlmIF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpXG5cdFx0c2VsZi5pbl9kZXZlbG9wbWVudCA9IG9wdGlvbnMuaW5fZGV2ZWxvcG1lbnRcblx0c2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnXG5cdGlmIG9wdGlvbnMuZGF0YWJhc2VfbmFtZVxuXHRcdHNlbGYuZGF0YWJhc2VfbmFtZSA9IG9wdGlvbnMuZGF0YWJhc2VfbmFtZVxuXHRpZiAoIW9wdGlvbnMuZmllbGRzKVxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IGZpZWxkcycpO1xuXG5cdHNlbGYuZmllbGRzID0gY2xvbmUob3B0aW9ucy5maWVsZHMpXG5cblx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRpZiBmaWVsZC5pc19uYW1lXG5cdFx0XHRzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZVxuXHRcdGVsc2UgaWYgZmllbGRfbmFtZSA9PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVlcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXG5cdFx0aWYgZmllbGQucHJpbWFyeVxuXHRcdFx0c2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWVcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKVxuXHRcdFx0XHRpZiBmaWVsZF9uYW1lID09ICdzcGFjZSdcblx0XHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxuXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IGZhbHNlXG5cblx0aWYgIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcblx0XHRfLmVhY2ggX2Jhc2VPYmplY3QuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRcdGlmICFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXVxuXHRcdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9XG5cdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSlcblxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmIGZpZWxkLnR5cGUgPT0gJ2F1dG9udW1iZXInXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2Zvcm11bGEnXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3N1bW1hcnknXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblxuXHRzZWxmLmxpc3Rfdmlld3MgPSB7fVxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcoc2VsZi5uYW1lKVxuXHRfLmVhY2ggb3B0aW9ucy5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0b2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKVxuXHRcdHNlbGYubGlzdF92aWV3c1tpdGVtX25hbWVdID0gb2l0ZW1cblxuXHRzZWxmLnRyaWdnZXJzID0gXy5jbG9uZShfYmFzZU9iamVjdC50cmlnZ2Vycylcblx0Xy5lYWNoIG9wdGlvbnMudHJpZ2dlcnMsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiAhc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdXG5cdFx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fVxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXS5uYW1lID0gaXRlbV9uYW1lXG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pLCBpdGVtKVxuXG5cdHNlbGYuYWN0aW9ucyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QuYWN0aW9ucylcblx0Xy5lYWNoIG9wdGlvbnMuYWN0aW9ucywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fVxuXHRcdGNvcHlJdGVtID0gXy5jbG9uZShzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSlcblx0XHRkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gI+WFiOWIoOmZpOebuOWFs+WxnuaAp+WGjemHjeW7uuaJjeiDveS/neivgeWQjue7remHjeWkjeWumuS5ieeahOWxnuaAp+mhuuW6j+eUn+aViFxuXHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pXG5cdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0ub2JqZWN0X25hbWUgPSBzZWxmLm5hbWVcblxuXHRfLmVhY2ggc2VsZi5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aXRlbS5uYW1lID0gaXRlbV9uYW1lXG5cblx0c2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSlcblxuXHQjIOiuqeaJgOaciW9iamVjdOm7mOiupOacieaJgOaciWxpc3Rfdmlld3MvYWN0aW9ucy9yZWxhdGVkX29iamVjdHMvcmVhZGFibGVfZmllbGRzL2VkaXRhYmxlX2ZpZWxkc+WujOaVtOadg+mZkO+8jOivpeadg+mZkOWPr+iDveiiq+aVsOaNruW6k+S4reiuvue9rueahGFkbWluL3VzZXLmnYPpmZDopobnm5Zcblx0c2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoX2Jhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpXG5cdCMgZGVmYXVsdExpc3RWaWV3cyA9IF8ua2V5cyhzZWxmLmxpc3Rfdmlld3MpXG5cdCMgZGVmYXVsdEFjdGlvbnMgPSBfLmtleXMoc2VsZi5hY3Rpb25zKVxuXHQjIGRlZmF1bHRSZWxhdGVkT2JqZWN0cyA9IF8ucGx1Y2soc2VsZi5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXHQjIGRlZmF1bHRSZWFkYWJsZUZpZWxkcyA9IFtdXG5cdCMgZGVmYXVsdEVkaXRhYmxlRmllbGRzID0gW11cblx0IyBfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHQjIFx0aWYgIShmaWVsZC5oaWRkZW4pICAgICMyMzEgb21pdOWtl+auteaUr+aMgeWcqOmdnue8lui+kemhtemdouafpeeciywg5Zug5q2k5Yig6Zmk5LqG5q2k5aSE5a+5b21pdOeahOWIpOaWrVxuXHQjIFx0XHRkZWZhdWx0UmVhZGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXG5cdCMgXHRcdGlmICFmaWVsZC5yZWFkb25seVxuXHQjIFx0XHRcdGRlZmF1bHRFZGl0YWJsZUZpZWxkcy5wdXNoIGZpZWxkX25hbWVcblxuXHQjIF8uZWFjaCBzZWxmLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdCMgXHRpZiBpdGVtX25hbWUgPT0gXCJub25lXCJcblx0IyBcdFx0cmV0dXJuXG5cdCMgXHRpZiBzZWxmLmxpc3Rfdmlld3Ncblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmxpc3Rfdmlld3MgPSBkZWZhdWx0TGlzdFZpZXdzXG5cdCMgXHRpZiBzZWxmLmFjdGlvbnNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmFjdGlvbnMgPSBkZWZhdWx0QWN0aW9uc1xuXHQjIFx0aWYgc2VsZi5yZWxhdGVkX29iamVjdHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLnJlbGF0ZWRfb2JqZWN0cyA9IGRlZmF1bHRSZWxhdGVkT2JqZWN0c1xuXHQjIFx0aWYgc2VsZi5maWVsZHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLnJlYWRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRSZWFkYWJsZUZpZWxkc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uZWRpdGFibGVfZmllbGRzID0gZGVmYXVsdEVkaXRhYmxlRmllbGRzXG5cdHVubGVzcyBvcHRpb25zLnBlcm1pc3Npb25fc2V0XG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldCA9IHt9XG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8uYWRtaW4pXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKVxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LnVzZXIpXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC51c2VyID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1widXNlclwiXSlcblx0Xy5lYWNoIG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiAhc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdXG5cdFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSB7fVxuXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSlcblxuXHQjIOWJjeerr+agueaNrnBlcm1pc3Npb25z5pS55YaZZmllbGTnm7jlhbPlsZ7mgKfvvIzlkI7nq6/lj6ropoHotbDpu5jorqTlsZ7mgKflsLHooYzvvIzkuI3pnIDopoHmlLnlhplcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cGVybWlzc2lvbnMgPSBvcHRpb25zLnBlcm1pc3Npb25zXG5cdFx0ZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zPy5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0aWYgZGlzYWJsZWRfbGlzdF92aWV3cz8ubGVuZ3RoXG5cdFx0XHRkZWZhdWx0TGlzdFZpZXdJZCA9IG9wdGlvbnMubGlzdF92aWV3cz8uYWxsPy5faWRcblx0XHRcdGlmIGRlZmF1bHRMaXN0Vmlld0lkXG5cdFx0XHRcdCMg5oqK6KeG5Zu+5p2D6ZmQ6YWN572u5Lit6buY6K6k55qEYWxs6KeG5Zu+aWTovazmjaLmiJBhbGzlhbPplK7lrZdcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IF8ubWFwIGRpc2FibGVkX2xpc3Rfdmlld3MsIChsaXN0X3ZpZXdfaXRlbSkgLT5cblx0XHRcdFx0XHRyZXR1cm4gaWYgZGVmYXVsdExpc3RWaWV3SWQgPT0gbGlzdF92aWV3X2l0ZW0gdGhlbiBcImFsbFwiIGVsc2UgbGlzdF92aWV3X2l0ZW1cblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKVxuI1x0XHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuI1x0XHRcdGlmIGZpZWxkXG4jXHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVucmVhZGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA8IDBcbiNcdFx0XHRcdFx0aWYgZmllbGQuaGlkZGVuXG4jXHRcdFx0XHRcdFx0cmV0dXJuXG4jXHRcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5lZGl0YWJsZV9maWVsZHMsIGZpZWxkX25hbWUpID4gLTFcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcbiNcdFx0XHRcdFx0XHRmaWVsZC5kaXNhYmxlZCA9IHRydWVcbiNcdFx0XHRcdFx0XHQjIOW9k+WPquivu+aXtu+8jOWmguaenOS4jeWOu+aOieW/heWhq+Wtl+aute+8jGF1dG9mb3Jt5piv5Lya5oql6ZSZ55qEXG4jXHRcdFx0XHRcdFx0ZmllbGQucmVxdWlyZWQgPSBmYWxzZVxuI1x0XHRcdFx0ZWxzZVxuI1x0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSB0cnVlXG5cdGVsc2Vcblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbnVsbFxuXG5cdF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKVxuXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYlxuXG5cdHNlbGYuZGIgPSBfZGJcblxuXHRzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWVcblxuXHRzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKVxuXHRzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKVxuXHRpZiBzZWxmLm5hbWUgIT0gXCJ1c2Vyc1wiIGFuZCBzZWxmLm5hbWUgIT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIiwgXCJhY3Rpb25fZmllbGRfdXBkYXRlc1wiLCBcIm9iamVjdF9saXN0dmlld3NcIl0sIHNlbGYubmFtZSlcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblx0XHRlbHNlXG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdGlmIHNlbGYubmFtZSA9PSBcInVzZXJzXCJcblx0XHRfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hXG5cblx0aWYgXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXG5cdENyZWF0b3Iub2JqZWN0c0J5TmFtZVtzZWxmLl9jb2xsZWN0aW9uX25hbWVdID0gc2VsZlxuXG5cdHJldHVybiBzZWxmXG5cbiMgQ3JlYXRvci5PYmplY3QucHJvdG90eXBlLmkxOG4gPSAoKS0+XG4jIFx0IyBzZXQgb2JqZWN0IGxhYmVsXG4jIFx0c2VsZiA9IHRoaXNcblxuIyBcdGtleSA9IHNlbGYubmFtZVxuIyBcdGlmIHQoa2V5KSA9PSBrZXlcbiMgXHRcdGlmICFzZWxmLmxhYmVsXG4jIFx0XHRcdHNlbGYubGFiZWwgPSBzZWxmLm5hbWVcbiMgXHRlbHNlXG4jIFx0XHRzZWxmLmxhYmVsID0gdChrZXkpXG5cbiMgXHQjIHNldCBmaWVsZCBsYWJlbHNcbiMgXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuIyBcdFx0ZmtleSA9IHNlbGYubmFtZSArIFwiX1wiICsgZmllbGRfbmFtZVxuIyBcdFx0aWYgdChma2V5KSA9PSBma2V5XG4jIFx0XHRcdGlmICFmaWVsZC5sYWJlbFxuIyBcdFx0XHRcdGZpZWxkLmxhYmVsID0gZmllbGRfbmFtZVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHRmaWVsZC5sYWJlbCA9IHQoZmtleSlcbiMgXHRcdHNlbGYuc2NoZW1hPy5fc2NoZW1hP1tmaWVsZF9uYW1lXT8ubGFiZWwgPSBmaWVsZC5sYWJlbFxuXG5cbiMgXHQjIHNldCBsaXN0dmlldyBsYWJlbHNcbiMgXHRfLmVhY2ggc2VsZi5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG4jIFx0XHRpMThuX2tleSA9IHNlbGYubmFtZSArIFwiX2xpc3R2aWV3X1wiICsgaXRlbV9uYW1lXG4jIFx0XHRpZiB0KGkxOG5fa2V5KSA9PSBpMThuX2tleVxuIyBcdFx0XHRpZiAhaXRlbS5sYWJlbFxuIyBcdFx0XHRcdGl0ZW0ubGFiZWwgPSBpdGVtX25hbWVcbiMgXHRcdGVsc2VcbiMgXHRcdFx0aXRlbS5sYWJlbCA9IHQoaTE4bl9rZXkpXG5cblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IChvYmplY3QpLT5cblx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXG5cdCMgaWYgb2JqZWN0XG5cdCMgXHRpZiAhb2JqZWN0LmRhdGFiYXNlX25hbWUgfHwgb2JqZWN0LmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcblx0IyBcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXG5cdCMgXHRlbHNlXG5cdCMgXHRcdHJldHVybiBcIi9hcGkvb2RhdGEvI3tvYmplY3QuZGF0YWJhc2VfbmFtZX1cIlxuXG4jIGlmIE1ldGVvci5pc0NsaWVudFxuXG4jIFx0TWV0ZW9yLnN0YXJ0dXAgLT5cbiMgXHRcdFRyYWNrZXIuYXV0b3J1biAtPlxuIyBcdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICYmIENyZWF0b3IuYm9vdHN0cmFwTG9hZGVkPy5nZXQoKVxuIyBcdFx0XHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG4jIFx0XHRcdFx0XHRvYmplY3QuaTE4bigpXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdGlmICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHNcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAob2JqZWN0KS0+XG5cdFx0XHRuZXcgQ3JlYXRvci5PYmplY3Qob2JqZWN0KVxuXG4iLCJ2YXIgY2xvbmU7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge307XG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJykpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpO1xuICB9XG4gIHJldHVybiBvYmplY3RfbmFtZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX2Jhc2VPYmplY3QsIF9kYiwgZGVmYXVsdExpc3RWaWV3SWQsIGRlZmF1bHRWaWV3LCBkaXNhYmxlZF9saXN0X3ZpZXdzLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzY2hlbWEsIHNlbGY7XG4gIF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgX2Jhc2VPYmplY3QgPSB7XG4gICAgICBhY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyxcbiAgICAgIGZpZWxkczoge30sXG4gICAgICB0cmlnZ2Vyczoge30sXG4gICAgICBwZXJtaXNzaW9uX3NldDoge31cbiAgICB9O1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICBpZiAoIW9wdGlvbnMubmFtZSkge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gIH1cbiAgc2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWU7XG4gIHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICBzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gIHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsO1xuICBzZWxmLmljb24gPSBvcHRpb25zLmljb247XG4gIHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uO1xuICBzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXc7XG4gIHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybTtcbiAgc2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Q7XG4gIHNlbGYucmVsYXRlZF9saXN0cyA9IG9wdGlvbnMucmVsYXRlZF9saXN0cztcbiAgc2VsZi5oYXNJbXBvcnRUZW1wbGF0ZXMgPSBvcHRpb25zLmhhc0ltcG9ydFRlbXBsYXRlcztcbiAgc2VsZi52ZXJzaW9uID0gb3B0aW9ucy52ZXJzaW9uIHx8IDEuMDtcbiAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgfHwgb3B0aW9ucy5pc19lbmFibGUgPT09IHRydWUpIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSBmYWxzZTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhbGxvd19jdXN0b21BY3Rpb25zJykpIHtcbiAgICAgIHNlbGYuYWxsb3dfY3VzdG9tQWN0aW9ucyA9IG9wdGlvbnMuYWxsb3dfY3VzdG9tQWN0aW9ucztcbiAgICB9XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdleGNsdWRlX2FjdGlvbnMnKSkge1xuICAgICAgc2VsZi5leGNsdWRlX2FjdGlvbnMgPSBvcHRpb25zLmV4Y2x1ZGVfYWN0aW9ucztcbiAgICB9XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhbGxvd19yZWxhdGVkTGlzdCcpKSB7XG4gICAgICBzZWxmLmFsbG93X3JlbGF0ZWRMaXN0ID0gb3B0aW9ucy5hbGxvd19yZWxhdGVkTGlzdDtcbiAgICB9XG4gIH1cbiAgc2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoO1xuICBzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzO1xuICBzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzO1xuICBzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzO1xuICBzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0O1xuICBzZWxmLmVuYWJsZV9ldmVudHMgPSBvcHRpb25zLmVuYWJsZV9ldmVudHM7XG4gIGlmIChvcHRpb25zLnBhZ2luZykge1xuICAgIHNlbGYucGFnaW5nID0gb3B0aW9ucy5wYWdpbmc7XG4gIH1cbiAgc2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlbjtcbiAgc2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PT0gdm9pZCAwKSB8fCBvcHRpb25zLmVuYWJsZV9hcGk7XG4gIHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b207XG4gIHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmU7XG4gIHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlcztcbiAgc2VsZi5lbmFibGVfcHJvY2VzcyA9IG9wdGlvbnMuZW5hYmxlX3Byb2Nlc3M7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpKSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICAgICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gIH1cbiAgc2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3c7XG4gIHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55O1xuICBzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKTtcbiAgc2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXI7XG4gIHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2g7XG4gIHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbDtcbiAgc2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzO1xuICBzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3c7XG4gIHNlbGYuZW5hYmxlX3dvcmtmbG93ID0gb3B0aW9ucy5lbmFibGVfd29ya2Zsb3c7XG4gIHNlbGYuZW5hYmxlX2lubGluZV9lZGl0ID0gb3B0aW9ucy5lbmFibGVfaW5saW5lX2VkaXQ7XG4gIHNlbGYuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlscztcbiAgc2VsZi5tYXN0ZXJzID0gb3B0aW9ucy5tYXN0ZXJzO1xuICBzZWxmLmxvb2t1cF9kZXRhaWxzID0gb3B0aW9ucy5sb29rdXBfZGV0YWlscztcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpKSB7XG4gICAgc2VsZi5pbl9kZXZlbG9wbWVudCA9IG9wdGlvbnMuaW5fZGV2ZWxvcG1lbnQ7XG4gIH1cbiAgc2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnO1xuICBpZiAob3B0aW9ucy5kYXRhYmFzZV9uYW1lKSB7XG4gICAgc2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lO1xuICB9XG4gIGlmICghb3B0aW9ucy5maWVsZHMpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XG4gIH1cbiAgc2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcyk7XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQuaXNfbmFtZSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZF9uYW1lID09PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVkpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoZmllbGQucHJpbWFyeSkge1xuICAgICAgc2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT09ICdtZXRlb3ItbW9uZ28nKSB7XG4gICAgXy5lYWNoKF9iYXNlT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmICghc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pIHtcbiAgICAgICAgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnc3VtbWFyeScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgc2VsZi5saXN0X3ZpZXdzID0ge307XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpO1xuICBfLmVhY2gob3B0aW9ucy5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgb2l0ZW07XG4gICAgb2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKTtcbiAgICByZXR1cm4gc2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbTtcbiAgfSk7XG4gIHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKTtcbiAgXy5lYWNoKG9wdGlvbnMudHJpZ2dlcnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWU7XG4gICAgcmV0dXJuIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpO1xuICBfLmVhY2gob3B0aW9ucy5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgY29weUl0ZW07XG4gICAgaWYgKCFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgY29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKTtcbiAgICBkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV07XG4gICAgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSk7XG4gICAgcmV0dXJuIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdLm9iamVjdF9uYW1lID0gc2VsZi5uYW1lO1xuICB9KTtcbiAgXy5lYWNoKHNlbGYuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgfSk7XG4gIHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpO1xuICBzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldCk7XG4gIGlmICghb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fTtcbiAgfVxuICBpZiAoISgocmVmID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZi5hZG1pbiA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pO1xuICB9XG4gIGlmICghKChyZWYxID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZjEudXNlciA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKTtcbiAgfVxuICBfLmVhY2gob3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnM7XG4gICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwO1xuICAgIGlmIChkaXNhYmxlZF9saXN0X3ZpZXdzICE9IG51bGwgPyBkaXNhYmxlZF9saXN0X3ZpZXdzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZGVmYXVsdExpc3RWaWV3SWQgPSAocmVmMiA9IG9wdGlvbnMubGlzdF92aWV3cykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hbGwpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCkge1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAoZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQgPT09IGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Rfdmlld19pdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlbGYucGVybWlzc2lvbnMgPSBudWxsO1xuICB9XG4gIF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiO1xuICBzZWxmLmRiID0gX2RiO1xuICBzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWU7XG4gIHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpO1xuICBzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKTtcbiAgaWYgKHNlbGYubmFtZSAhPT0gXCJ1c2Vyc1wiICYmIHNlbGYubmFtZSAhPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIiwgXCJhY3Rpb25fZmllbGRfdXBkYXRlc1wiLCBcIm9iamVjdF9saXN0dmlld3NcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoc2VsZi5uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICBfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hO1xuICB9XG4gIGlmIChfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgQ3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmO1xuICByZXR1cm4gc2VsZjtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiO1xufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIGlmICghQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzKSB7XG4gICAgcmV0dXJuIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyA9IChmaWVsZFNjaGVtYSkgLT5cblx0b3B0aW9ucyA9IGZpZWxkU2NoZW1hLm9wdGlvbnNcblx0dW5sZXNzIG9wdGlvbnNcblx0XHRyZXR1cm5cblx0ZGF0YV90eXBlID0gZmllbGRTY2hlbWEuZGF0YV90eXBlXG5cdGlmICFfLmlzRnVuY3Rpb24ob3B0aW9ucykgYW5kIGRhdGFfdHlwZSBhbmQgZGF0YV90eXBlICE9ICd0ZXh0J1xuXHRcdCMg6Zu25Luj56CB55WM6Z2i6YWN572ub3B0aW9uc+mAiemhueWAvOWPquaUr+aMgeWtl+espuS4su+8jOaJgOS7peW9k2RhdGFfdHlwZeS4uuaVsOWAvOaIlmJvb2xlYW7ml7bvvIzlj6rog73lvLrooYzmiorpgInpobnlgLzlhYjovazmjaLkuLrlr7nlupTnmoTnsbvlnotcblx0XHRvcHRpb25zLmZvckVhY2ggKG9wdGlvbkl0ZW0pIC0+XG5cdFx0XHRpZiB0eXBlb2Ygb3B0aW9uSXRlbS52YWx1ZSAhPSAnc3RyaW5nJ1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIFtcblx0XHRcdFx0J251bWJlcidcblx0XHRcdFx0J2N1cnJlbmN5J1xuXHRcdFx0XHQncGVyY2VudCdcblx0XHRcdF0uaW5kZXhPZihkYXRhX3R5cGUpID4gLTFcblx0XHRcdFx0b3B0aW9uSXRlbS52YWx1ZSA9IE51bWJlcihvcHRpb25JdGVtLnZhbHVlKVxuXHRcdFx0ZWxzZSBpZiBkYXRhX3R5cGUgPT0gJ2Jvb2xlYW4nXG5cdFx0XHRcdCMg5Y+q5pyJ5Li6dHJ1ZeaJjeS4uuecn1xuXHRcdFx0XHRvcHRpb25JdGVtLnZhbHVlID0gb3B0aW9uSXRlbS52YWx1ZSA9PSAndHJ1ZSdcblx0cmV0dXJuIG9wdGlvbnNcblxuQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSAob2JqKSAtPlxuXHR1bmxlc3Mgb2JqXG5cdFx0cmV0dXJuXG5cdHNjaGVtYSA9IHt9XG5cblx0ZmllbGRzQXJyID0gW11cblxuXHRfLmVhY2ggb2JqLmZpZWxkcyAsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmICFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpXG5cdFx0XHRmaWVsZC5uYW1lID0gZmllbGRfbmFtZVxuXHRcdGZpZWxkc0Fyci5wdXNoIGZpZWxkXG5cblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cblxuXHRcdGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lXG5cblx0XHRmcyA9IHt9XG5cdFx0aWYgZmllbGQucmVnRXhcblx0XHRcdGZzLnJlZ0V4ID0gZmllbGQucmVnRXhcblx0XHRmcy5hdXRvZm9ybSA9IHt9XG5cdFx0ZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZVxuXHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0YXV0b2Zvcm1fdHlwZSA9IGZpZWxkLmF1dG9mb3JtPy50eXBlXG5cblx0XHRpZiBmaWVsZC50eXBlID09IFwidGV4dFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJwaG9uZVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW3RleHRdXCIgb3IgZmllbGQudHlwZSA9PSBcIltwaG9uZV1cIlxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2NvZGUnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAxMlxuXHRcdFx0aWYgZmllbGQubGFuZ3VhZ2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRleHRhcmVhXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJwYXNzd29yZFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJwYXNzd29yZFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmlzaU9TKClcblx0XHRcdFx0XHRcdCMgRml4IGlvcyAxNCwg5omL5py65a6i5oi356uv5b6F5a6h5qC45paH5Lu25pel5pyf5o6n5Lu25pi+56S65pWF6ZqcICM5OTHvvIxpb3Pnu5/kuIDnlKhQQ+err+S4gOagt+eahGpz5o6n5Lu2XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcblx0XHRcdFx0XHRcdFx0XHRwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxuXHRcdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0aW1lXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXG5cdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdHR5cGU6IFwidGltZVwiXG5cdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcIkhIOm1tXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmlzaU9TKClcblx0XHRcdFx0XHRcdCMgRml4IGlvcyAxNCwg5omL5py65a6i5oi356uv5b6F5a6h5qC45paH5Lu25pel5pyf5o6n5Lu25pi+56S65pWF6ZqcICM5OTHvvIxpb3Pnu5/kuIDnlKhQQ+err+S4gOagt+eahGpz5o6n5Lu2XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxuXHRcdFx0XHRcdFx0XHRcdHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXG5cdFx0XHRcdFx0XHRcdGRhdGVNb2JpbGVPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbT2JqZWN0XVwiXG5cdFx0XHRmcy50eXBlID0gW09iamVjdF1cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJodG1sXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NIdG1sJztcblx0XHRcdCMgaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHQjIFx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxuXHRcdFx0IyBcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCIgfHwgbG9jYWxlID09IFwiemgtQ05cIlxuXHRcdFx0IyBcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdFx0XHQjIFx0ZWxzZVxuXHRcdFx0IyBcdFx0bG9jYWxlID0gXCJlbi1VU1wiXG5cdFx0XHQjIFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdCMgXHRcdHR5cGU6IFwic3VtbWVybm90ZVwiXG5cdFx0XHQjIFx0XHRjbGFzczogJ3N1bW1lcm5vdGUtZWRpdG9yJ1xuXHRcdFx0IyBcdFx0c2V0dGluZ3M6XG5cdFx0XHQjIFx0XHRcdGhlaWdodDogMjAwXG5cdFx0XHQjIFx0XHRcdGRpYWxvZ3NJbkJvZHk6IHRydWVcblx0XHRcdCMgXHRcdFx0dG9vbGJhcjogIFtcblx0XHRcdCMgXHRcdFx0XHRbJ2ZvbnQxJywgWydzdHlsZSddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ2ZvbnQyJywgWydib2xkJywgJ3VuZGVybGluZScsICdpdGFsaWMnLCAnY2xlYXInXV0sXG5cdFx0XHQjIFx0XHRcdFx0Wydmb250MycsIFsnZm9udG5hbWUnXV0sXG5cdFx0XHQjIFx0XHRcdFx0Wydjb2xvcicsIFsnY29sb3InXV0sXG5cdFx0XHQjIFx0XHRcdFx0WydwYXJhJywgWyd1bCcsICdvbCcsICdwYXJhZ3JhcGgnXV0sXG5cdFx0XHQjIFx0XHRcdFx0Wyd0YWJsZScsIFsndGFibGUnXV0sXG5cdFx0XHQjIFx0XHRcdFx0WydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZSddXSxcblx0XHRcdCMgXHRcdFx0XHRbJ3ZpZXcnLCBbJ2NvZGV2aWV3J11dXG5cdFx0XHQjIFx0XHRcdF1cblx0XHRcdCMgXHRcdFx0Zm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCfpu5HkvZMnLCflvq7ova/pm4Xpu5EnLCfku7/lrosnLCfmpbfkvZMnLCfpmrbkuaYnLCflubzlnIYnXVxuXHRcdFx0IyBcdFx0XHRsYW5nOiBsb2NhbGVcblxuXHRcdGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIiBvciBmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmaWVsZC5zaG93SWNvblxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cblx0XHRcdGlmICFmaWVsZC5oaWRkZW5cblxuXHRcdFx0XHRmcy5hdXRvZm9ybS5maWx0ZXJzID0gZmllbGQuZmlsdGVyc1xuXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlcGVuZE9uID0gZmllbGQuZGVwZW5kX29uXG5cblx0XHRcdFx0aWYgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXG5cdFx0XHRcdFx0ZnMuYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXG5cblx0XHRcdFx0ZnMuZmlsdGVyc0Z1bmN0aW9uID0gaWYgZmllbGQuZmlsdGVyc0Z1bmN0aW9uIHRoZW4gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIGVsc2UgQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnNcblxuXHRcdFx0XHRpZiBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblx0XHRcdFx0XHRmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblxuXHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0aWYgZmllbGQuY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b11cblx0XHRcdFx0XHRcdFx0XHRpZiBfcmVmX29iaj8ucGVybWlzc2lvbnM/LmFsbG93Q3JlYXRlXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IChsb29rdXBfZmllbGQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0TW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLiN7Q3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bykuX25hbWV9XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9ybUlkOiBcIm5ldyN7ZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCdfJyl9XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IFwiI3tmaWVsZC5yZWZlcmVuY2VfdG99XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3BlcmF0aW9uOiBcImluc2VydFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uU3VjY2VzczogKG9wZXJhdGlvbiwgcmVzdWx0KS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZXN1bHQub2JqZWN0X25hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZXN1bHQub2JqZWN0X25hbWUgPT0gXCJvYmplY3RzXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFt7bGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCwgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLCBpY29uOiByZXN1bHQudmFsdWUuaWNvbn1dLCByZXN1bHQudmFsdWUubmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFt7bGFiZWw6IHJlc3VsdC52YWx1ZVtvYmplY3QuTkFNRV9GSUVMRF9LRVldIHx8IHJlc3VsdC52YWx1ZS5sYWJlbCB8fCByZXN1bHQudmFsdWUubmFtZSwgdmFsdWU6IHJlc3VsdC5faWR9XSwgcmVzdWx0Ll9pZClcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmYWxzZVxuXG5cdFx0XHRcdFx0aWYgXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKVxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlXG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2Vfc29ydFxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc1NvcnQgPSBmaWVsZC5yZWZlcmVuY2Vfc29ydFxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX2xpbWl0XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTGltaXQgPSBmaWVsZC5yZWZlcmVuY2VfbGltaXRcblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZVRvRmllbGQgPSBmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGRcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90byA9PSBcInVzZXJzXCJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdHVzZXJcIlxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOihqOekuui/h+a7pOaVsOaNruaXtuaYr+WQpuWPquaYvuekuuacrOWIhumDqOS4i+eahOaVsOaNrlxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOWPr+S7peiiq+aUueWGmeimhuebluaIkHRydWUvZmFsc2XmiJblhbbku5ZmdW5jdGlvblxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdFx0IyDmnKrlrprkuYlpc19jb21wYW55X2xpbWl0ZWTlsZ7mgKfml7bpu5jorqTlpITnkIbpgLvovpHvvJpcblx0XHRcdFx0XHRcdFx0XHQjIOWvueW9k+WJjeWvueixoeaciXZpZXdBbGxSZWNvcmRz5p2D6ZmQ5YiZ5LiN6ZmQ5Yi25omA5bGe5YiG6YOo5YiX6KGo5p+l55yL5p2D6ZmQ77yM5ZCm5YiZ5Y+q5pi+56S65b2T5YmN5omA5bGe5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnM/LmdldCgpXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzlrZfmrrXmiYDlsZ7lr7nosaHmmK/nlKjmiLfmiJbnu4Tnu4fvvIzliJnmmK/lkKbpmZDliLbmmL7npLrmiYDlsZ7liIbpg6jpg6jpl6jkuI5tb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5YWz6IGUXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzVW5MaW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRnVuY3Rpb24gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHQjIOS8oOWFpeW9k+WJjeWvueixoeeahOadg+mZkO+8jOWcqOWHveaVsOS4reagueaNruadg+mZkOiuoeeul+aYr+WQpuimgemZkOWItuWPquafpeeci+acrOWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucylcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOacjeWKoeerr+eUqOS4jeWIsGlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdGVsc2UgaWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwib3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RvcmdcIlxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOihqOekuui/h+a7pOaVsOaNruaXtuaYr+WQpuWPquaYvuekuuacrOWIhumDqOS4i+eahOaVsOaNrlxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOWPr+S7peiiq+aUueWGmeimhuebluaIkHRydWUvZmFsc2XmiJblhbbku5ZmdW5jdGlvblxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdFx0IyDmnKrlrprkuYlpc19jb21wYW55X2xpbWl0ZWTlsZ7mgKfml7bpu5jorqTlpITnkIbpgLvovpHvvJpcblx0XHRcdFx0XHRcdFx0XHQjIOWvueW9k+WJjeWvueixoeaciXZpZXdBbGxSZWNvcmRz5p2D6ZmQ5YiZ5LiN6ZmQ5Yi25omA5bGe5YiG6YOo5YiX6KGo5p+l55yL5p2D6ZmQ77yM5ZCm5YiZ5Y+q5pi+56S65b2T5YmN5omA5bGe5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnM/LmdldCgpXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzlrZfmrrXmiYDlsZ7lr7nosaHmmK/nlKjmiLfmiJbnu4Tnu4fvvIzliJnmmK/lkKbpmZDliLbmmL7npLrmiYDlsZ7liIbpg6jpg6jpl6jkuI5tb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5YWz6IGUXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzVW5MaW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRnVuY3Rpb24gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHQjIOS8oOWFpeW9k+WJjeWvueixoeeahOadg+mZkO+8jOWcqOWHveaVsOS4reagueaNruadg+mZkOiuoeeul+aYr+WQpuimgemZkOWItuWPquafpeeci+acrOWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucylcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOacjeWKoeerr+eUqOS4jeWIsGlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGlmIHR5cGVvZihmaWVsZC5yZWZlcmVuY2VfdG8pID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKClcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoX3JlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdFx0XHRcdFx0XHRmcy5ibGFja2JveCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub2JqZWN0U3dpdGNoZSA9IHRydWVcblxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogU3RyaW5nXG5cdFx0XHRcdFx0XHRcdFx0YXV0b2Zvcm06IHtvbWl0OiB0cnVlfVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogW1N0cmluZ11cblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dXG5cblx0XHRcdFx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV90b1swXV1cblx0XHRcdFx0XHRcdGlmIF9vYmplY3QgYW5kIF9vYmplY3QuZW5hYmxlX3RyZWVcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCJcblxuXHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfVxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMgPSBbXVxuXHRcdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8uZm9yRWFjaCAoX3JlZmVyZW5jZSktPlxuXHRcdFx0XHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlXVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgX29iamVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBfb2JqZWN0Py5sYWJlbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IF9vYmplY3Q/Lmljb25cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW5rOiAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0SWNvbiA9IGZpZWxkLmRlZmF1bHRJY29uXG5cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmYWxzZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RcIlxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xuXHRcdFx0XHRpZiBfLmhhcyhmaWVsZCwgJ2ZpcnN0T3B0aW9uJylcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IGZpZWxkLmZpcnN0T3B0aW9uXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCJcblx0XHRcdCMg5Zug5Li65YiX6KGo6KeG5Zu+5Y+z5L6n6L+H5ruk5Zmo6L+Y5piv55So55qE6ICB6KGo5Y2V55qEbG9va3Vw5ZKMc2VsZWN05o6n5Lu277yM5omA5Lul5LiK6Z2i55qE5Luj56CB5aeL57uI5L+d5oyB5Y6f5qC36ZyA6KaB5omn6KGMXG5cdFx0XHQjIOS4i+mdouaYr+mFjee9ruS6hmRhdGFfdHlwZeaXtu+8jOmineWkluWkhOeQhueahOmAu+i+kVxuXHRcdFx0aWYgZmllbGQuZGF0YV90eXBlIGFuZCBmaWVsZC5kYXRhX3R5cGUgIT0gXCJ0ZXh0XCJcblx0XHRcdFx0aWYgW1wibnVtYmVyXCIsIFwiY3VycmVuY3lcIiwgXCJwZXJjZW50XCJdLmluZGV4T2YoZmllbGQuZGF0YV90eXBlKSA+IC0xXG5cdFx0XHRcdFx0ZnNUeXBlID0gTnVtYmVyXG5cdFx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5kYXRhX3R5cGUgPT0gXCJib29sZWFuXCJcblx0XHRcdFx0XHRmc1R5cGUgPSBCb29sZWFuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmc1R5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMudHlwZSA9IGZzVHlwZVxuXHRcdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRcdGZzLnR5cGUgPSBbZnNUeXBlXVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zKGZpZWxkKVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImN1cnJlbmN5XCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdFx0ZWxzZSBpZiBmaWVsZD8uc2NhbGUgIT0gMFxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IDJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJudW1iZXJcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYm9vbGVhblwiXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRvZ2dsZVwiXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJyZWZlcmVuY2VcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCJcblx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZVwiXG5cdFx0XHRjb2xsZWN0aW9uTmFtZSA9IGZpZWxkLmNvbGxlY3Rpb24gfHwgXCJmaWxlc1wiICMgY29sbGVjdGlvbiDpu5jorqTmmK8gJ2ZpbGVzJ1xuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gY29sbGVjdGlvbk5hbWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlc2l6ZVwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT0gXCJvYmplY3RcIlxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImdyaWRcIlxuXHRcdFx0ZnMudHlwZSA9IEFycmF5XG5cdFx0XHRmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCJcblxuXHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0dHlwZTogT2JqZWN0XG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaW1hZ2VcIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdpbWFnZXMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF2YXRhclwiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F2YXRhcnMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdWRpb1wiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F1ZGlvcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2F1ZGlvLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidmlkZW9cIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICd2aWRlb3MnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICd2aWRlby8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3Rcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm1hcmtkb3duXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRleHRcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAndXJsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0IyBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5Vcmxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2VtYWlsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2Zvcm11bGEnXG5cdFx0XHRmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtmaWVsZHM6IHtmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHt0eXBlOiBmaWVsZC5kYXRhX3R5cGV9KX19KVtmaWVsZC5uYW1lXVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc3VtbWFyeSdcblx0XHRcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0IyBlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3NlbGVjdCdcblx0XHQjIFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3BlcmNlbnQnXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxuXHRcdFx0dW5sZXNzIF8uaXNOdW1iZXIoZmllbGQuc2NhbGUpXG5cdFx0XHRcdCMg5rKh6YWN572u5bCP5pWw5L2N5pWw5YiZ5oyJ5bCP5pWw5L2N5pWwMOadpeWkhOeQhu+8jOWNs+m7mOiupOaYvuekuuS4uuaVtOaVsOeahOeZvuWIhuavlO+8jOavlOWmgjIwJe+8jOatpOaXtuaOp+S7tuWPr+S7pei+k+WFpTLkvY3lsI/mlbDvvIzovazmiJDnmb7liIbmr5TlsLHmmK/mlbTmlbBcblx0XHRcdFx0ZmllbGQuc2NhbGUgPSAwXG5cdFx0XHQjIGF1dG9mb3Jt5o6n5Lu25Lit5bCP5pWw5L2N5pWw5aeL57uI5q+U6YWN572u55qE5L2N5pWw5aSaMuS9jVxuXHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZSArIDJcblx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0ZnMudHlwZSA9IGZpZWxkLnR5cGVcblxuXHRcdGlmIGZpZWxkLmxhYmVsXG5cdFx0XHRmcy5sYWJlbCA9IGZpZWxkLmxhYmVsXG5cbiNcdFx0aWYgZmllbGQuYWxsb3dlZFZhbHVlc1xuI1x0XHRcdGZzLmFsbG93ZWRWYWx1ZXMgPSBmaWVsZC5hbGxvd2VkVmFsdWVzXG5cblx0XHRpZiAhZmllbGQucmVxdWlyZWRcblx0XHRcdGZzLm9wdGlvbmFsID0gdHJ1ZVxuXG5cdFx0IyBb562+57qm5a+56LGh5ZCM5pe26YWN572u5LqGY29tcGFueV9pZHPlv4Xloavlj4p1bmVkaXRhYmxlX2ZpZWxkc+mAoOaIkOmDqOWIhueUqOaIt+aWsOW7uuetvue6puWvueixoeaXtuaKpemUmSAjMTkyXShodHRwczovL2dpdGh1Yi5jb20vc3RlZWRvcy9zdGVlZG9zLXByb2plY3QtZHp1Zy9pc3N1ZXMvMTkyKVxuXHRcdCMg5ZCO5Y+w5aeL57uI6K6+572ucmVxdWlyZWTkuLpmYWxzZVxuXHRcdGlmICFNZXRlb3IuaXNDbGllbnRcblx0XHRcdGZzLm9wdGlvbmFsID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQudW5pcXVlXG5cdFx0XHRmcy51bmlxdWUgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5vbWl0XG5cdFx0XHRmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuZ3JvdXBcblx0XHRcdGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXBcblxuXHRcdGlmIGZpZWxkLmlzX3dpZGVcblx0XHRcdGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5oaWRkZW5cblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiXG5cblx0XHRpZiAoZmllbGQudHlwZSA9PSBcInNlbGVjdFwiKSBvciAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBvciAoZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5maWx0ZXJhYmxlKSA9PSAndW5kZWZpbmVkJ1xuXHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxuXHRcdGlmIGZpZWxkLm5hbWUgPT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWVcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5zZWFyY2hhYmxlKSA9PSAndW5kZWZpbmVkJ1xuXHRcdFx0XHRmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZVxuXG5cdFx0aWYgYXV0b2Zvcm1fdHlwZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGVcblxuXHRcdGlmIGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9ICgpLT5cblx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7dXNlcklkOiBNZXRlb3IudXNlcklkKCksIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgbm93OiBuZXcgRGF0ZSgpfSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cdFx0XHQjIFx0aWYgIV8uaXNGdW5jdGlvbihmaWVsZC5kZWZhdWx0VmFsdWUpXG5cdFx0XHQjIFx0XHRmcy5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblxuXHRcdGlmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmRpc2FibGVkXG5cdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmlubGluZUhlbHBUZXh0XG5cdFx0XHRmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0XG5cblx0XHRpZiBmaWVsZC5ibGFja2JveFxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21pbicpXG5cdFx0XHRmcy5taW4gPSBmaWVsZC5taW5cblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21heCcpXG5cdFx0XHRmcy5tYXggPSBmaWVsZC5tYXhcblxuXHRcdCMg5Y+q5pyJ55Sf5Lqn546v5aKD5omN6YeN5bu657Si5byVXG5cdFx0aWYgTWV0ZW9yLmlzUHJvZHVjdGlvblxuXHRcdFx0aWYgZmllbGQuaW5kZXhcblx0XHRcdFx0ZnMuaW5kZXggPSBmaWVsZC5pbmRleFxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5zb3J0YWJsZVxuXHRcdFx0XHRmcy5pbmRleCA9IHRydWVcblxuXHRcdHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzXG5cblx0cmV0dXJuIHNjaGVtYVxuXG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKS0+XG5cdGh0bWwgPSBmaWVsZF92YWx1ZVxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdHJldHVybiBcIlwiXG5cdGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKVxuXHRpZiAhZmllbGRcblx0XHRyZXR1cm4gXCJcIlxuXG5cdGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKVxuXHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRlXCJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxuXG5cdHJldHVybiBodG1sXG5cbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gKGZpZWxkX3R5cGUpLT5cblx0cmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcInRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXG5DcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyA9IChmaWVsZF90eXBlLCBvcGVyYXRpb25zKS0+XG5cdGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXG5cdGlmIGJ1aWx0aW5WYWx1ZXNcblx0XHRfLmZvckVhY2ggYnVpbHRpblZhbHVlcywgKGJ1aWx0aW5JdGVtLCBrZXkpLT5cblx0XHRcdG9wZXJhdGlvbnMucHVzaCh7bGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLCB2YWx1ZToga2V5fSlcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IChmaWVsZF90eXBlLCBpc19jaGVja19vbmx5KS0+XG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxuXHQjIOi/h+a7pOWZqOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUsIHZhbHVlKS0+XG5cdCMg5qC55o2u6L+H5ruk5Zmo55qE6L+H5ruk5YC877yM6I635Y+W5a+55bqU55qE5YaF572u6L+Q566X56ymXG5cdCMg5q+U5aaCdmFsdWXkuLpsYXN0X3llYXLvvIzov5Tlm55iZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXG5cdHVubGVzcyBfLmlzU3RyaW5nKHZhbHVlKVxuXHRcdHJldHVyblxuXHRiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSlcblx0dW5sZXNzIGJldHdlZW5CdWlsdGluVmFsdWVzXG5cdFx0cmV0dXJuXG5cdHJlc3VsdCA9IG51bGxcblx0Xy5lYWNoIGJldHdlZW5CdWlsdGluVmFsdWVzLCAoaXRlbSwgb3BlcmF0aW9uKS0+XG5cdFx0aWYgaXRlbS5rZXkgPT0gdmFsdWVcblx0XHRcdHJlc3VsdCA9IG9wZXJhdGlvblxuXHRyZXR1cm4gcmVzdWx0XG5cbiMg5aaC5p6c5Y+q5piv5Li65Yik5patb3BlcmF0aW9u5piv5ZCm5a2Y5Zyo77yM5YiZ5rKh5b+F6KaB6K6h566XdmFsdWVz77yM5Lyg5YWlaXNfY2hlY2tfb25seeS4unRydWXljbPlj69cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpLT5cblx0IyDov4fmu6Tlmajml7bpl7TlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0cmV0dXJuIHtcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcblx0XHRcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcblx0fVxuXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gKG1vbnRoKS0+XG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHRyZXR1cm4gMFxuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdHJldHVybiAzXG5cdGVsc2UgaWYgbW9udGggPCA5XG5cdFx0cmV0dXJuIDZcblx0XG5cdHJldHVybiA5XG5cblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gKHllYXIsbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHR5ZWFyLS1cblx0XHRtb250aCA9IDlcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRtb250aCA9IDBcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRtb250aCA9IDNcblx0ZWxzZSBcblx0XHRtb250aCA9IDZcblx0XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0aWYgbW9udGggPCAzXG5cdFx0bW9udGggPSAzXG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0bW9udGggPSA2XG5cdGVsc2UgaWYgbW9udGggPCA5XG5cdFx0bW9udGggPSA5XG5cdGVsc2Vcblx0XHR5ZWFyKytcblx0XHRtb250aCA9IDBcblx0XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblxuQ3JlYXRvci5nZXRNb250aERheXMgPSAoeWVhcixtb250aCktPlxuXHRpZiBtb250aCA9PSAxMVxuXHRcdHJldHVybiAzMVxuXHRcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cdHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgrMSwgMSlcblx0ZGF5cyA9IChlbmREYXRlLXN0YXJ0RGF0ZSkvbWlsbGlzZWNvbmRcblx0cmV0dXJuIGRheXNcblxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9ICh5ZWFyLCBtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdCMg5pyI5Lu95Li6MOS7o+ihqOacrOW5tOeahOesrOS4gOaciFxuXHRpZiBtb250aCA9PSAwXG5cdFx0bW9udGggPSAxMVxuXHRcdHllYXItLVxuXHRcdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5cdCMg5ZCm5YiZLOWPquWHj+WOu+aciOS7vVxuXHRtb250aC0tO1xuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdFxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XG5cdCMg6L+H5ruk5ZmoYmV0d2Vlbui/kOeul+espu+8jOeOsOeul+aXpeacny/ml6XmnJ/ml7bpl7TnsbvlnovlrZfmrrXnmoR2YWx1ZXPlgLxcblx0bm93ID0gbmV3IERhdGUoKVxuXHQjIOS4gOWkqeeahOavq+enkuaVsFxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcblx0eWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0dG9tb3Jyb3cgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXG5cdCMg5LiA5ZGo5Lit55qE5p+Q5LiA5aSpXG5cdHdlZWsgPSBub3cuZ2V0RGF5KClcblx0IyDlh4/ljrvnmoTlpKnmlbBcblx0bWludXNEYXkgPSBpZiB3ZWVrICE9IDAgdGhlbiB3ZWVrIC0gMSBlbHNlIDZcblx0bW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSlcblx0c3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKVxuXHQjIOS4iuWRqOaXpVxuXHRsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOS4iuWRqOS4gFxuXHRsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSlcblx0IyDkuIvlkajkuIBcblx0bmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcblx0IyDkuIvlkajml6Vcblx0bmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpXG5cdGN1cnJlbnRZZWFyID0gbm93LmdldEZ1bGxZZWFyKClcblx0cHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxXG5cdG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxXG5cdCMg5b2T5YmN5pyI5Lu9XG5cdGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpXG5cdCMg6K6h5pWw5bm044CB5pyIXG5cdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpXG5cdCMg5pys5pyI56ys5LiA5aSpXG5cdGZpcnN0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsY3VycmVudE1vbnRoLDEpXG5cblx0IyDlvZPkuLoxMuaciOeahOaXtuWAmeW5tOS7vemcgOimgeWKoDFcblx0IyDmnIjku73pnIDopoHmm7TmlrDkuLowIOS5n+WwseaYr+S4i+S4gOW5tOeahOesrOS4gOS4quaciFxuXHRpZiBjdXJyZW50TW9udGggPT0gMTFcblx0XHR5ZWFyKytcblx0XHRtb250aCsrXG5cdGVsc2Vcblx0XHRtb250aCsrXG5cdFxuXHQjIOS4i+aciOesrOS4gOWkqVxuXHRuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHQjIOS4i+aciOacgOWQjuS4gOWkqVxuXHRuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsbW9udGgsQ3JlYXRvci5nZXRNb250aERheXMoeWVhcixtb250aCkpXG5cdCMg5pys5pyI5pyA5ZCO5LiA5aSpXG5cdGxhc3REYXkgPSBuZXcgRGF0ZShuZXh0TW9udGhGaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0IyDkuIrmnIjnrKzkuIDlpKlcblx0bGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIrmnIjmnIDlkI7kuIDlpKlcblx0bGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0IyDmnKzlraPluqblvIDlp4vml6Vcblx0dGhpc1F1YXJ0ZXJTdGFydERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwxKVxuXHQjIOacrOWto+W6pue7k+adn+aXpVxuXHR0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyKSlcblx0IyDkuIrlraPluqblvIDlp4vml6Vcblx0bGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiK5a2j5bqm57uT5p2f5pelXG5cdGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMikpXG5cdCMg5LiL5a2j5bqm5byA5aeL5pelXG5cdG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4i+Wto+W6pue7k+adn+aXpVxuXHRuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxuXHQjIOi/h+WOuzflpKkgXG5cdGxhc3RfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg2ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzMw5aSpXG5cdGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67NjDlpKlcblx0bGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrs5MOWkqVxuXHRsYXN0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDg5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzEyMOWkqVxuXHRsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lN+WkqSBcblx0bmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lMzDlpKlcblx0bmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU2MOWkqVxuXHRuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTkw5aSpXG5cdG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lMTIw5aSpXG5cdG5leHRfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDExOSAqIG1pbGxpc2Vjb25kKSlcblxuXHRzd2l0Y2gga2V5XG5cdFx0d2hlbiBcImxhc3RfeWVhclwiXG5cdFx0XHQj5Y675bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7cHJldmlvdXNZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfeWVhclwiXG5cdFx0XHQj5LuK5bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7Y3VycmVudFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7Y3VycmVudFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3llYXJcIlxuXHRcdFx0I+aYjuW5tFxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF9xdWFydGVyXCJcblx0XHRcdCPkuIrlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc19xdWFydGVyXCJcblx0XHRcdCPmnKzlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF9xdWFydGVyXCJcblx0XHRcdCPkuIvlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF9tb250aFwiXG5cdFx0XHQj5LiK5pyIXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc19tb250aFwiXG5cdFx0XHQj5pys5pyIXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChmaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X21vbnRoXCJcblx0XHRcdCPkuIvmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X3dlZWtcIlxuXHRcdFx0I+S4iuWRqFxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChsYXN0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfd2Vla1wiXG5cdFx0XHQj5pys5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfd2Vla1wiXG5cdFx0XHQj5LiL5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwieWVzdGRheVwiXG5cdFx0XHQj5pio5aSpXG5cdFx0XHRzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3llc3RkYXlcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidG9kYXlcIlxuXHRcdFx0I+S7iuWkqVxuXHRcdFx0c3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b2RheVwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRvbW9ycm93XCJcblx0XHRcdCPmmI7lpKlcblx0XHRcdHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfN19kYXlzXCJcblx0XHRcdCPov4fljrs35aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSBcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfMzBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67MzDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfNjBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67NjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfOTBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67OTDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfMTIwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzEyMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzdfZGF5c1wiXG5cdFx0XHQj5pyq5p2lN+WkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfMzBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lMzDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfNjBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lNjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfOTBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lOTDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfMTIwX2RheXNcIlxuXHRcdFx0I+acquadpTEyMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcblx0dmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXVxuXHRpZiBmaWVsZF90eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdCMg5pe26Ze057G75Z6L5a2X5q6177yM5YaF572u5pe26Ze06IyD5Zu05bqU6K+l6ICD6JmR5YGP56e75pe25Yy65YC877yM5ZCm5YiZ6L+H5ruk5pWw5o2u5a2Y5Zyo5YGP5beuXG5cdFx0IyDpnZ7lhoXnva7ml7bpl7TojIPlm7Tml7bvvIznlKjmiLfpgJrov4fml7bpl7Tmjqfku7bpgInmi6nnmoTojIPlm7TvvIzkvJroh6rliqjlpITnkIbml7bljLrlgY/lt67mg4XlhrVcblx0XHQjIOaXpeacn+exu+Wei+Wtl+aute+8jOaVsOaNruW6k+acrOadpeWwseWtmOeahOaYr1VUQ+eahDDngrnvvIzkuI3lrZjlnKjlgY/lt65cblx0XHRfLmZvckVhY2ggdmFsdWVzLCAoZnYpLT5cblx0XHRcdGlmIGZ2XG5cdFx0XHRcdGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjAgKVxuXHRcblx0cmV0dXJuIHtcblx0XHRsYWJlbDogbGFiZWxcblx0XHRrZXk6IGtleVxuXHRcdHZhbHVlczogdmFsdWVzXG5cdH1cblxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSktPlxuXHRpZiBmaWVsZF90eXBlICYmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuICdiZXR3ZWVuJ1xuXHRlbHNlIGlmIFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gJ2NvbnRhaW5zJ1xuXHRlbHNlXG5cdFx0cmV0dXJuIFwiPVwiXG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSkgLT5cblx0IyDml6XmnJ/nsbvlnos6IGRhdGUsIGRhdGV0aW1lICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcblx0IyDmlofmnKznsbvlnos6IHRleHQsIHRleHRhcmVhLCBodG1sICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiY29udGFpbnNcIiwgXCJub3Rjb250YWluc1wiLCBcInN0YXJ0c3dpdGhcIlxuXHQjIOmAieaLqeexu+WeizogbG9va3VwLCBtYXN0ZXJfZGV0YWlsLCBzZWxlY3Qg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cdCMg5pWw5YC857G75Z6LOiBjdXJyZW5jeSwgbnVtYmVyICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcblx0IyDluIPlsJTnsbvlnos6IGJvb2xlYW4gIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxuXHQjIOaVsOe7hOexu+WeizogY2hlY2tib3gsIFt0ZXh0XSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cblx0b3B0aW9uYWxzID0ge1xuXHRcdGVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksIHZhbHVlOiBcIj1cIn0sXG5cdFx0dW5lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksIHZhbHVlOiBcIjw+XCJ9LFxuXHRcdGxlc3NfdGhhbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSwgdmFsdWU6IFwiPFwifSxcblx0XHRncmVhdGVyX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksIHZhbHVlOiBcIj5cIn0sXG5cdFx0bGVzc19vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksIHZhbHVlOiBcIjw9XCJ9LFxuXHRcdGdyZWF0ZXJfb3JfZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLCB2YWx1ZTogXCI+PVwifSxcblx0XHRjb250YWluczoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLCB2YWx1ZTogXCJjb250YWluc1wifSxcblx0XHRub3RfY29udGFpbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJ9LFxuXHRcdHN0YXJ0c193aXRoOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksIHZhbHVlOiBcInN0YXJ0c3dpdGhcIn0sXG5cdFx0YmV0d2Vlbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksIHZhbHVlOiBcImJldHdlZW5cIn0sXG5cdH1cblxuXHRpZiBmaWVsZF90eXBlID09IHVuZGVmaW5lZFxuXHRcdHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpXG5cblx0b3BlcmF0aW9ucyA9IFtdXG5cblx0aWYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pXG5cdFx0Q3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucylcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwidGV4dFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0YXJlYVwiIG9yIGZpZWxkX3R5cGUgPT0gXCJodG1sXCIgb3IgZmllbGRfdHlwZSA9PSBcImNvZGVcIlxuI1x0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmNvbnRhaW5zLCBvcHRpb25hbHMubm90X2NvbnRhaW4sIG9wdGlvbmFscy5zdGFydHNfd2l0aClcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJsb29rdXBcIiBvciBmaWVsZF90eXBlID09IFwibWFzdGVyX2RldGFpbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJjdXJyZW5jeVwiIG9yIGZpZWxkX3R5cGUgPT0gXCJudW1iZXJcIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMubGVzc190aGFuLCBvcHRpb25hbHMuZ3JlYXRlcl90aGFuLCBvcHRpb25hbHMubGVzc19vcl9lcXVhbCwgb3B0aW9uYWxzLmdyZWF0ZXJfb3JfZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImJvb2xlYW5cIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJjaGVja2JveFwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcIlt0ZXh0XVwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2Vcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblxuXHRyZXR1cm4gb3BlcmF0aW9uc1xuXG4jIyNcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gKG9iamVjdF9uYW1lKS0+XG5cdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXG5cdGZpZWxkc0FyciA9IFtdXG5cblx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkKS0+XG5cdFx0ZmllbGRzQXJyLnB1c2gge25hbWU6IGZpZWxkLm5hbWUsIHNvcnRfbm86IGZpZWxkLnNvcnRfbm99XG5cblx0ZmllbGRzTmFtZSA9IFtdXG5cdF8uZWFjaCBfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgKGZpZWxkKS0+XG5cdFx0ZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpXG5cdHJldHVybiBmaWVsZHNOYW1lXG4iLCJDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMgPSBmdW5jdGlvbihmaWVsZFNjaGVtYSkge1xuICB2YXIgZGF0YV90eXBlLCBvcHRpb25zO1xuICBvcHRpb25zID0gZmllbGRTY2hlbWEub3B0aW9ucztcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRhdGFfdHlwZSA9IGZpZWxkU2NoZW1hLmRhdGFfdHlwZTtcbiAgaWYgKCFfLmlzRnVuY3Rpb24ob3B0aW9ucykgJiYgZGF0YV90eXBlICYmIGRhdGFfdHlwZSAhPT0gJ3RleHQnKSB7XG4gICAgb3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG9wdGlvbkl0ZW0pIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uSXRlbS52YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFsnbnVtYmVyJywgJ2N1cnJlbmN5JywgJ3BlcmNlbnQnXS5pbmRleE9mKGRhdGFfdHlwZSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gb3B0aW9uSXRlbS52YWx1ZSA9IE51bWJlcihvcHRpb25JdGVtLnZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YV90eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbkl0ZW0udmFsdWUgPSBvcHRpb25JdGVtLnZhbHVlID09PSAndHJ1ZSc7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFNjaGVtYSA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgZmllbGRzQXJyLCBzY2hlbWE7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNjaGVtYSA9IHt9O1xuICBmaWVsZHNBcnIgPSBbXTtcbiAgXy5lYWNoKG9iai5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKCFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpKSB7XG4gICAgICBmaWVsZC5uYW1lID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKGZpZWxkKTtcbiAgfSk7XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICB2YXIgX29iamVjdCwgX3JlZl9vYmosIF9yZWZlcmVuY2VfdG8sIGF1dG9mb3JtX3R5cGUsIGNvbGxlY3Rpb25OYW1lLCBmaWVsZF9uYW1lLCBmcywgZnNUeXBlLCBpc1VuTGltaXRlZCwgcGVybWlzc2lvbnMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMztcbiAgICBmaWVsZF9uYW1lID0gZmllbGQubmFtZTtcbiAgICBmcyA9IHt9O1xuICAgIGlmIChmaWVsZC5yZWdFeCkge1xuICAgICAgZnMucmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICB9XG4gICAgZnMuYXV0b2Zvcm0gPSB7fTtcbiAgICBmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlO1xuICAgIGZzLmF1dG9mb3JtLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICBhdXRvZm9ybV90eXBlID0gKHJlZiA9IGZpZWxkLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dFwiIHx8IGZpZWxkLnR5cGUgPT09IFwicGhvbmVcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiW3RleHRdXCIgfHwgZmllbGQudHlwZSA9PT0gXCJbcGhvbmVdXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdjb2RlJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAxMjtcbiAgICAgIGlmIChmaWVsZC5sYW5ndWFnZSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInBhc3N3b3JkXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJwYXNzd29yZFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBEYXRlO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKSkge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmlzaU9TKCkpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCIsXG4gICAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCIsXG4gICAgICAgICAgICAgICAgcGlja2VyVHlwZTogXCJyb2xsZXJzXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ0aW1lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBEYXRlO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgdHlwZTogXCJ0aW1lXCIsXG4gICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcIkhIOm1tXCJcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBEYXRlO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKSkge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmlzaU9TKCkpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRldGltZVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiLFxuICAgICAgICAgICAgICAgIHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCIsXG4gICAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRldGltZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJkYXRldGltZVwiLFxuICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiW09iamVjdF1cIikge1xuICAgICAgZnMudHlwZSA9IFtPYmplY3RdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJodG1sXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0h0bWwnO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb247XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgfVxuICAgICAgaWYgKCFmaWVsZC5oaWRkZW4pIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnM7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlcGVuZE9uID0gZmllbGQuZGVwZW5kX29uO1xuICAgICAgICBpZiAoZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uKSB7XG4gICAgICAgICAgZnMuYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGZzLmZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA/IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA6IENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzO1xuICAgICAgICBpZiAoZmllbGQub3B0aW9uc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8pIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICBpZiAoZmllbGQuY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b107XG4gICAgICAgICAgICAgICAgaWYgKF9yZWZfb2JqICE9IG51bGwgPyAocmVmMSA9IF9yZWZfb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMS5hbGxvd0NyZWF0ZSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24obG9va3VwX2ZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuXCIgKyAoQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bykuX25hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgIGZvcm1JZDogXCJuZXdcIiArIChmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsICdfJykpLFxuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBcIlwiICsgZmllbGQucmVmZXJlbmNlX3RvLFxuICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJpbnNlcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKG9wZXJhdGlvbiwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQub2JqZWN0X25hbWUgPT09IFwib2JqZWN0c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiByZXN1bHQudmFsdWUuaWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0LnZhbHVlLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZVtvYmplY3QuTkFNRV9GSUVMRF9LRVldIHx8IHJlc3VsdC52YWx1ZS5sYWJlbCB8fCByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2Vfc29ydCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc1NvcnQgPSBmaWVsZC5yZWZlcmVuY2Vfc29ydDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9saW1pdCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VUb0ZpZWxkID0gZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcInVzZXJzXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdHVzZXJcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gKHJlZjIgPSBvYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYyLmdldCgpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcIm9yZ2FuaXphdGlvbnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYzID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMy5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgICAgICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlO1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dO1xuICAgICAgICAgICAgaWYgKF9vYmplY3QgJiYgX29iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjtcbiAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW107XG4gICAgICAgICAgICAgICAgX3JlZmVyZW5jZV90by5mb3JFYWNoKGZ1bmN0aW9uKF9yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV07XG4gICAgICAgICAgICAgICAgICBpZiAoX29iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QubGFiZWwgOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgaWNvbjogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2U7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgICBpZiAoXy5oYXMoZmllbGQsICdmaXJzdE9wdGlvbicpKSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBmaWVsZC5maXJzdE9wdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmaWVsZC5kYXRhX3R5cGUgJiYgZmllbGQuZGF0YV90eXBlICE9PSBcInRleHRcIikge1xuICAgICAgICBpZiAoW1wibnVtYmVyXCIsIFwiY3VycmVuY3lcIiwgXCJwZXJjZW50XCJdLmluZGV4T2YoZmllbGQuZGF0YV90eXBlKSA+IC0xKSB7XG4gICAgICAgICAgZnNUeXBlID0gTnVtYmVyO1xuICAgICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLmRhdGFfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICBmc1R5cGUgPSBCb29sZWFuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzVHlwZSA9IFN0cmluZztcbiAgICAgICAgfVxuICAgICAgICBmcy50eXBlID0gZnNUeXBlO1xuICAgICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgICBmcy50eXBlID0gW2ZzVHlwZV07XG4gICAgICAgIH1cbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IENyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyhmaWVsZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRvZ2dsZVwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInJlZmVyZW5jZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIjtcbiAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlXCIpIHtcbiAgICAgIGNvbGxlY3Rpb25OYW1lID0gZmllbGQuY29sbGVjdGlvbiB8fCBcImZpbGVzXCI7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25OYW1lO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlc2l6ZVwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImdyaWRcIikge1xuICAgICAgZnMudHlwZSA9IEFycmF5O1xuICAgICAgZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIjtcbiAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJpbWFnZVwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdpbWFnZXMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXZhdGFyXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F2YXRhcnMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF1ZGlvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F1ZGlvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdhdWRpby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ2aWRlb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICd2aWRlb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAndmlkZW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9jYXRpb25cIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCI7XG4gICAgICBmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiO1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJtYXJrZG93blwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGV4dFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3VybCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2VtYWlsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2Zvcm11bGEnKSB7XG4gICAgICBmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7XG4gICAgICAgICAgICB0eXBlOiBmaWVsZC5kYXRhX3R5cGVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVtmaWVsZC5uYW1lXTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdzdW1tYXJ5Jykge1xuICAgICAgZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge1xuICAgICAgICAgICAgdHlwZTogZmllbGQuZGF0YV90eXBlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlbZmllbGQubmFtZV07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAncGVyY2VudCcpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoIV8uaXNOdW1iZXIoZmllbGQuc2NhbGUpKSB7XG4gICAgICAgIGZpZWxkLnNjYWxlID0gMDtcbiAgICAgIH1cbiAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGUgKyAyO1xuICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZzLnR5cGUgPSBmaWVsZC50eXBlO1xuICAgIH1cbiAgICBpZiAoZmllbGQubGFiZWwpIHtcbiAgICAgIGZzLmxhYmVsID0gZmllbGQubGFiZWw7XG4gICAgfVxuICAgIGlmICghZmllbGQucmVxdWlyZWQpIHtcbiAgICAgIGZzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLnVuaXF1ZSkge1xuICAgICAgZnMudW5pcXVlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLm9taXQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZ3JvdXApIHtcbiAgICAgIGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXA7XG4gICAgfVxuICAgIGlmIChmaWVsZC5pc193aWRlKSB7XG4gICAgICBmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmhpZGRlbikge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgfVxuICAgIGlmICgoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpIHx8IChmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuZmlsdGVyYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5uYW1lID09PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5zZWFyY2hhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF1dG9mb3JtX3R5cGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGVmYXVsdFZhbHVlKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge1xuICAgICAgICAgICAgdXNlcklkOiBNZXRlb3IudXNlcklkKCksXG4gICAgICAgICAgICBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksXG4gICAgICAgICAgICBub3c6IG5ldyBEYXRlKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICBmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kaXNhYmxlZCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaW5saW5lSGVscFRleHQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHQ7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ibGFja2JveCkge1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtaW4nKSkge1xuICAgICAgZnMubWluID0gZmllbGQubWluO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtYXgnKSkge1xuICAgICAgZnMubWF4ID0gZmllbGQubWF4O1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzUHJvZHVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLmluZGV4KSB7XG4gICAgICAgIGZzLmluZGV4ID0gZmllbGQuaW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLnNvcnRhYmxlKSB7XG4gICAgICAgIGZzLmluZGV4ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzO1xuICB9KTtcbiAgcmV0dXJuIHNjaGVtYTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpIHtcbiAgdmFyIGZpZWxkLCBodG1sLCBvYmplY3Q7XG4gIGh0bWwgPSBmaWVsZF92YWx1ZTtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKTtcbiAgaWYgKCFmaWVsZCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpO1xuICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gIH1cbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcInRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKTtcbn07XG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgb3BlcmF0aW9ucykge1xuICB2YXIgYnVpbHRpblZhbHVlcztcbiAgYnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmIChidWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuIF8uZm9yRWFjaChidWlsdGluVmFsdWVzLCBmdW5jdGlvbihidWlsdGluSXRlbSwga2V5KSB7XG4gICAgICByZXR1cm4gb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLFxuICAgICAgICB2YWx1ZToga2V5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIGtleSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlLCB2YWx1ZSkge1xuICB2YXIgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIHJlc3VsdDtcbiAgaWYgKCFfLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmICghYmV0d2VlbkJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVzdWx0ID0gbnVsbDtcbiAgXy5lYWNoKGJldHdlZW5CdWlsdGluVmFsdWVzLCBmdW5jdGlvbihpdGVtLCBvcGVyYXRpb24pIHtcbiAgICBpZiAoaXRlbS5rZXkgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzdWx0ID0gb3BlcmF0aW9uO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIHtcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSBmdW5jdGlvbihtb250aCkge1xuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHJldHVybiAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIHJldHVybiAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIHJldHVybiA2O1xuICB9XG4gIHJldHVybiA5O1xufTtcblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHllYXItLTtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIHtcbiAgICBtb250aCA9IDY7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSA2O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGggPSAwO1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIHZhciBkYXlzLCBlbmREYXRlLCBtaWxsaXNlY29uZCwgc3RhcnREYXRlO1xuICBpZiAobW9udGggPT09IDExKSB7XG4gICAgcmV0dXJuIDMxO1xuICB9XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgc3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAxKTtcbiAgZGF5cyA9IChlbmREYXRlIC0gc3RhcnREYXRlKSAvIG1pbGxpc2Vjb25kO1xuICByZXR1cm4gZGF5cztcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPT09IDApIHtcbiAgICBtb250aCA9IDExO1xuICAgIHllYXItLTtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICB9XG4gIG1vbnRoLS07XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICB2YXIgY3VycmVudE1vbnRoLCBjdXJyZW50WWVhciwgZW5kVmFsdWUsIGZpcnN0RGF5LCBsYWJlbCwgbGFzdERheSwgbGFzdE1vbmRheSwgbGFzdE1vbnRoRmluYWxEYXksIGxhc3RNb250aEZpcnN0RGF5LCBsYXN0UXVhcnRlckVuZERheSwgbGFzdFF1YXJ0ZXJTdGFydERheSwgbGFzdFN1bmRheSwgbGFzdF8xMjBfZGF5cywgbGFzdF8zMF9kYXlzLCBsYXN0XzYwX2RheXMsIGxhc3RfN19kYXlzLCBsYXN0XzkwX2RheXMsIG1pbGxpc2Vjb25kLCBtaW51c0RheSwgbW9uZGF5LCBtb250aCwgbmV4dE1vbmRheSwgbmV4dE1vbnRoRmluYWxEYXksIG5leHRNb250aEZpcnN0RGF5LCBuZXh0UXVhcnRlckVuZERheSwgbmV4dFF1YXJ0ZXJTdGFydERheSwgbmV4dFN1bmRheSwgbmV4dFllYXIsIG5leHRfMTIwX2RheXMsIG5leHRfMzBfZGF5cywgbmV4dF82MF9kYXlzLCBuZXh0XzdfZGF5cywgbmV4dF85MF9kYXlzLCBub3csIHByZXZpb3VzWWVhciwgc3RhcnRWYWx1ZSwgc3RyRW5kRGF5LCBzdHJGaXJzdERheSwgc3RyTGFzdERheSwgc3RyTW9uZGF5LCBzdHJTdGFydERheSwgc3RyU3VuZGF5LCBzdHJUb2RheSwgc3RyVG9tb3Jyb3csIHN0clllc3RkYXksIHN1bmRheSwgdGhpc1F1YXJ0ZXJFbmREYXksIHRoaXNRdWFydGVyU3RhcnREYXksIHRvbW9ycm93LCB2YWx1ZXMsIHdlZWssIHllYXIsIHllc3RkYXk7XG4gIG5vdyA9IG5ldyBEYXRlKCk7XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgeWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgd2VlayA9IG5vdy5nZXREYXkoKTtcbiAgbWludXNEYXkgPSB3ZWVrICE9PSAwID8gd2VlayAtIDEgOiA2O1xuICBtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdFN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgbmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIG5leHRTdW5kYXkgPSBuZXcgRGF0ZShuZXh0TW9uZGF5LmdldFRpbWUoKSArIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgY3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgcHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxO1xuICBuZXh0WWVhciA9IGN1cnJlbnRZZWFyICsgMTtcbiAgY3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgZmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCAxKTtcbiAgaWYgKGN1cnJlbnRNb250aCA9PT0gMTEpIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGgrKztcbiAgfSBlbHNlIHtcbiAgICBtb250aCsrO1xuICB9XG4gIG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLCBtb250aCkpO1xuICBsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwgMSk7XG4gIHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyKSk7XG4gIGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlIFwibGFzdF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc195ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3Rfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc193ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ5ZXN0ZGF5XCI6XG4gICAgICBzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9kYXlcIjpcbiAgICAgIHN0clRvZGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b21vcnJvd1wiOlxuICAgICAgc3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gIH1cbiAgdmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIF8uZm9yRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGZ2KSB7XG4gICAgICBpZiAoZnYpIHtcbiAgICAgICAgcmV0dXJuIGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGtleToga2V5LFxuICAgIHZhbHVlczogdmFsdWVzXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgaWYgKGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2JldHdlZW4nO1xuICB9IGVsc2UgaWYgKFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2NvbnRhaW5zJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCI9XCI7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHZhciBvcGVyYXRpb25zLCBvcHRpb25hbHM7XG4gIG9wdGlvbmFscyA9IHtcbiAgICBlcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI9XCJcbiAgICB9LFxuICAgIHVuZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PlwiXG4gICAgfSxcbiAgICBsZXNzX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIjxcIlxuICAgIH0sXG4gICAgZ3JlYXRlcl90aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI+XCJcbiAgICB9LFxuICAgIGxlc3Nfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PVwiXG4gICAgfSxcbiAgICBncmVhdGVyX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPj1cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLFxuICAgICAgdmFsdWU6IFwiY29udGFpbnNcIlxuICAgIH0sXG4gICAgbm90X2NvbnRhaW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksXG4gICAgICB2YWx1ZTogXCJub3Rjb250YWluc1wiXG4gICAgfSxcbiAgICBzdGFydHNfd2l0aDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksXG4gICAgICB2YWx1ZTogXCJzdGFydHN3aXRoXCJcbiAgICB9LFxuICAgIGJldHdlZW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksXG4gICAgICB2YWx1ZTogXCJiZXR3ZWVuXCJcbiAgICB9XG4gIH07XG4gIGlmIChmaWVsZF90eXBlID09PSB2b2lkIDApIHtcbiAgICByZXR1cm4gXy52YWx1ZXMob3B0aW9uYWxzKTtcbiAgfVxuICBvcGVyYXRpb25zID0gW107XG4gIGlmIChDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbik7XG4gICAgQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJ0ZXh0YXJlYVwiIHx8IGZpZWxkX3R5cGUgPT09IFwiaHRtbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwiY29kZVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5jb250YWlucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZF90eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCBmaWVsZF90eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY3VycmVuY3lcIiB8fCBmaWVsZF90eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiW3RleHRdXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9XG4gIHJldHVybiBvcGVyYXRpb25zO1xufTtcblxuXG4vKlxuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBmaWVsZHMsIGZpZWxkc0FyciwgZmllbGRzTmFtZSwgcmVmO1xuICBmaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKHtcbiAgICAgIG5hbWU6IGZpZWxkLm5hbWUsXG4gICAgICBzb3J0X25vOiBmaWVsZC5zb3J0X25vXG4gICAgfSk7XG4gIH0pO1xuICBmaWVsZHNOYW1lID0gW107XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIGZpZWxkc05hbWU7XG59O1xuIiwiQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9XG5cbmluaXRUcmlnZ2VyID0gKG9iamVjdF9uYW1lLCB0cmlnZ2VyKS0+XG5cdHRyeVxuXHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXG5cdFx0aWYgIXRyaWdnZXIudG9kb1xuXHRcdFx0cmV0dXJuXG5cdFx0dG9kb1dyYXBwZXIgPSAoKS0+XG5cdFx0XHQgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZVxuXHRcdFx0ICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcblx0XHRpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUuaW5zZXJ0XCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8udXBkYXRlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUucmVtb3ZlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5pbnNlcnRcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/Lmluc2VydCh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy51cGRhdGUodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnJlbW92ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRjYXRjaCBlcnJvclxuXHRcdGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpXG5cbmNsZWFuVHJpZ2dlciA9IChvYmplY3RfbmFtZSktPlxuXHQjIyNcbiAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG5cdCMjI1xuICAgICNUT0RPIOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbBidWdcblx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0/LnJldmVyc2UoKS5mb3JFYWNoIChfaG9vayktPlxuXHRcdF9ob29rLnJlbW92ZSgpXG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gKG9iamVjdF9uYW1lKS0+XG4jXHRjb25zb2xlLmxvZygnQ3JlYXRvci5pbml0VHJpZ2dlcnMgb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSlcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0Y2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKVxuXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW11cblxuXHRfLmVhY2ggb2JqLnRyaWdnZXJzLCAodHJpZ2dlciwgdHJpZ2dlcl9uYW1lKS0+XG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyIGFuZCB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcblx0XHRcdGlmIF90cmlnZ2VyX2hvb2tcblx0XHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXG5cdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spIiwidmFyIGNsZWFuVHJpZ2dlciwgaW5pdFRyaWdnZXI7XG5cbkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fTtcblxuaW5pdFRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdHJpZ2dlcikge1xuICB2YXIgY29sbGVjdGlvbiwgZXJyb3IsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgdG9kb1dyYXBwZXI7XG4gIHRyeSB7XG4gICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgaWYgKCF0cmlnZ2VyLnRvZG8pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdG9kb1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZTtcbiAgICAgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmLmluc2VydCh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjEgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjEudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmMi5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjMgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmMy5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjQgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNC51cGRhdGUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjUgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNS5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpO1xuICB9XG59O1xuXG5jbGVhblRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuXG4gIC8qXG4gICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXG4gICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG4gICAqL1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uKF9ob29rKSB7XG4gICAgcmV0dXJuIF9ob29rLnJlbW92ZSgpO1xuICB9KSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIG9iajtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdO1xuICByZXR1cm4gXy5lYWNoKG9iai50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwgdHJpZ2dlcl9uYW1lKSB7XG4gICAgdmFyIF90cmlnZ2VyX2hvb2s7XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICBpZiAoX3RyaWdnZXJfaG9vaykge1xuICAgICAgICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIHJldHVybiBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpXG5cbmJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImFsbG93Q3JlYXRlXCIsIFwiYWxsb3dEZWxldGVcIiwgXCJhbGxvd0VkaXRcIiwgXCJhbGxvd1JlYWRcIiwgXCJtb2RpZnlBbGxSZWNvcmRzXCIsIFwidmlld0FsbFJlY29yZHNcIiwgXCJtb2RpZnlDb21wYW55UmVjb3Jkc1wiLCBcInZpZXdDb21wYW55UmVjb3Jkc1wiLCBcblx0XCJhbGxvd1JlYWRGaWxlc1wiLCBcImFsbG93RWRpdEZpbGVzXCIsIFwiYWxsb3dDcmVhdGVGaWxlc1wiLCBcImFsbG93RGVsZXRlRmlsZXNcIiwgXCJ2aWV3QWxsRmlsZXNcIiwgXCJtb2RpZnlBbGxGaWxlc1wiXSBcbm90aGVyUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImRpc2FibGVkX2xpc3Rfdmlld3NcIiwgXCJkaXNhYmxlZF9hY3Rpb25zXCIsIFwidW5yZWFkYWJsZV9maWVsZHNcIiwgXCJ1bmVkaXRhYmxlX2ZpZWxkc1wiLCBcInVucmVsYXRlZF9vYmplY3RzXCIsIFwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcIl1cbnBlcm1pc3Npb25Qcm9wTmFtZXMgPSBfLnVuaW9uIGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzXG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmICFvYmpcblx0XHRcdHJldHVyblxuXHRcdHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KClcblx0ZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XG5cdCMg6ZmE5Lu25p2D6ZmQ5LiN5YaN5LiO5YW254i26K6w5b2V57yW6L6R6YWN572u5YWz6IGUXG5cdCMgaWYgcmVjb3JkIGFuZCBvYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0IyBcdCMg5aaC5p6c5pivY21zX2ZpbGVz6ZmE5Lu277yM5YiZ5p2D6ZmQ5Y+W5YW254i26K6w5b2V5p2D6ZmQXG5cdCMgXHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKVxuXHQjIFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tuivpue7hueVjOmdolxuXHQjIFx0XHRvYmplY3RfbmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuXHQjIFx0XHRyZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcblx0IyBcdGVsc2UgXG5cdCMgXHRcdCMg5b2T5YmN5aSE5LqOY21zX2ZpbGVz6ZmE5Lu255qE54i26K6w5b2V55WM6Z2iXG5cdCMgXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XG5cdCMgXHRcdHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuXHQjIFx0b2JqZWN0X2ZpZWxkc19rZXlzID0gXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uZmllbGRzIG9yIHt9KSB8fCBbXTtcblx0IyBcdHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcblx0IyBcdGlmIHNlbGVjdC5sZW5ndGggPiAwXG5cdCMgXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdC5qb2luKCcsJykpO1xuXHQjIFx0ZWxzZVxuXHQjIFx0XHRyZWNvcmQgPSBudWxsO1xuXG5cdHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKVxuXG5cdGlmIHJlY29yZFxuXHRcdGlmICFfLmlzRW1wdHkocmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucylcblx0XHRcdHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXG5cblx0XHRpc093bmVyID0gcmVjb3JkLm93bmVyID09IHVzZXJJZCB8fCByZWNvcmQub3duZXI/Ll9pZCA9PSB1c2VySWRcblxuXHRcdGlmIG9iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdCMg6ZmE5Lu255qE5p+l55yL5omA5pyJ5L+u5pS55omA5pyJ5p2D6ZmQ5LiO6ZmE5Lu25a+56LGh55qEdmlld0FsbFJlY29yZHPjgIFtb2RpZnlBbGxSZWNvcmRz5peg5YWz77yM5Y+q5LiO5YW25Li76KGo6K6w5b2V55qEdmlld0FsbEZpbGVz5ZKMbW9kaWZ5QWxsRmlsZXPmnInlhbNcblx0XHRcdCMg5aaC5p6c5pivY21zX2ZpbGVz6ZmE5Lu277yM5YiZ5p2D6ZmQ6ZyA6KaB6aKd5aSW6ICD6JmR5YW254i25a+56LGh5LiK5YWz5LqO6ZmE5Lu255qE5p2D6ZmQ6YWN572uXG5cdFx0XHRtYXN0ZXJPYmplY3ROYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG5cdFx0XHRtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhtYXN0ZXJPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gcGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXNcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0RlbGV0ZUZpbGVzXG5cdFx0XHRpZiAhbWFzdGVyUmVjb3JkUGVybS5tb2RpZnlBbGxGaWxlcyBhbmQgIWlzT3duZXJcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gcGVybWlzc2lvbnMuYWxsb3dSZWFkICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkRmlsZXNcblx0XHRcdGlmICFtYXN0ZXJSZWNvcmRQZXJtLnZpZXdBbGxGaWxlcyBhbmQgIWlzT3duZXJcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZD8uY29tcGFueV9pZFxuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpIGFuZCByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZOaYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEb2JqZWN077yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XG5cdFx0XHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQ/LmNvbXBhbnlfaWRzXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWRzWzBdKVxuXHRcdFx0XHQjIOWboHJlY29yZF9jb21wYW55X2lkc+aYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEW29iamVjdF3vvIzmiYDku6Xov5nph4zlj5blh7rlhbZfaWTlgLxcblx0XHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcCgobiktPiBuLl9pZClcblx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKVxuXHRcdFx0aWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0ZWxzZSBpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5L+u5pS5XG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5L+u5pS5XG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRpZiByZWNvcmQubG9ja2VkIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cblx0XHRcdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5p+l55yLXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lk5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+afpeeci1xuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XG5cdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cbiMgY3VycmVudE9iamVjdE5hbWXvvJrlvZPliY3kuLvlr7nosaFcbiMgcmVsYXRlZExpc3RJdGVt77yaQ3JlYXRvci5nZXRSZWxhdGVkTGlzdChTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpLCBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSnkuK3lj5ZyZWxhdGVkX29iamVjdF9uYW1l5a+55bqU55qE5YC8XG4jIGN1cnJlbnRSZWNvcmTlvZPliY3kuLvlr7nosaHnmoTor6bnu4borrDlvZVcbmlmIE1ldGVvci5pc0NsaWVudFxuXHRDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMgPSAoY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XG5cdFx0aWYgIWN1cnJlbnRPYmplY3ROYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdFx0aWYgIXJlbGF0ZWRMaXN0SXRlbVxuXHRcdFx0Y29uc29sZS5lcnJvcihcInJlbGF0ZWRMaXN0SXRlbSBtdXN0IG5vdCBiZSBlbXB0eSBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9uc1wiKTtcblx0XHRcdHJldHVybiB7fVxuXG5cdFx0aWYgIWN1cnJlbnRSZWNvcmQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Y3VycmVudFJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcblxuXHRcdGlmICF1c2VySWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0XHRpZiAhc3BhY2VJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cblx0XHRtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKVxuXHRcdHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKVxuXHRcdHJlc3VsdCA9IF8uY2xvbmUgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zXG5cblx0XHRpZiByZWxhdGVkTGlzdEl0ZW0uaXNfZmlsZVxuXHRcdFx0cmVzdWx0LmFsbG93Q3JlYXRlID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlc1xuXHRcdFx0cmVzdWx0LmFsbG93RWRpdCA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlc1xuXHRcdGVsc2Vcblx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZExpc3RJdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIHx8IGZhbHNlXG5cdFx0XHRtYXN0ZXJBbGxvdyA9IGZhbHNlXG5cdFx0XHRpZiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PSB0cnVlXG5cdFx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRcblx0XHRcdGVsc2UgaWYgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT0gZmFsc2Vcblx0XHRcdFx0bWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdFxuXG5cdFx0XHR1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKVxuXHRcdFx0aXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlID0gdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QuaW5kZXhPZihyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpID4gLTFcblxuXHRcdFx0cmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcblx0XHRcdHJlc3VsdC5hbGxvd0VkaXQgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcblx0XHRyZXR1cm4gcmVzdWx0XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkKSAtPlxuXHRcdHBlcm1pc3Npb25zID1cblx0XHRcdG9iamVjdHM6IHt9XG5cdFx0XHRhc3NpZ25lZF9hcHBzOiBbXVxuXHRcdCMjI1xuXHRcdOadg+mZkOmbhuivtOaYjjpcblx0XHTlhoXnva7mnYPpmZDpm4YtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXG5cdFx06Ieq5a6a5LmJ5p2D6ZmQ6ZuGLeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOmbhuS7peWklueahOWFtuS7luadg+mZkOmbhlxuXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG5cdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ6ZuGXG5cdFx0IyMjXG5cblx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxuXHRcdHNwYWNlVXNlciA9IG51bGxcblx0XHRpZiB1c2VySWRcblx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXG5cdFx0cHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cblx0XHRwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRlbHNlXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cblx0XHRwc2V0c0FkbWluX3BvcyA9IG51bGxcblx0XHRwc2V0c1VzZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IG51bGxcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IG51bGxcblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gbnVsbFxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbFxuXG5cdFx0aWYgcHNldHNBZG1pbj8uX2lkXG5cdFx0XHRwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxuXHRcdFx0cHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzTWVtYmVyPy5faWRcblx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNHdWVzdD8uX2lkXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1N1cHBsaWVyPy5faWRcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzQ3VzdG9tZXI/Ll9pZFxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cblx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIl9pZFwiXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiB7JGluOiBzZXRfaWRzfX0pLmZldGNoKClcblx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXG5cdFx0cHNldHMgPSB7XG5cdFx0XHRwc2V0c0FkbWluLCBcblx0XHRcdHBzZXRzVXNlciwgXG5cdFx0XHRwc2V0c0N1cnJlbnQsIFxuXHRcdFx0cHNldHNNZW1iZXIsIFxuXHRcdFx0cHNldHNHdWVzdCxcblx0XHRcdHBzZXRzU3VwcGxpZXIsXG5cdFx0XHRwc2V0c0N1c3RvbWVyLFxuXHRcdFx0aXNTcGFjZUFkbWluLFxuXHRcdFx0c3BhY2VVc2VyLCBcblx0XHRcdHBzZXRzQWRtaW5fcG9zLCBcblx0XHRcdHBzZXRzVXNlcl9wb3MsIFxuXHRcdFx0cHNldHNNZW1iZXJfcG9zLCBcblx0XHRcdHBzZXRzR3Vlc3RfcG9zLFxuXHRcdFx0cHNldHNTdXBwbGllcl9wb3MsXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3Bvcyxcblx0XHRcdHBzZXRzQ3VycmVudF9wb3Ncblx0XHR9XG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpXG5cdFx0cGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lc1xuXHRcdF9pID0gMFxuXHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG5cdFx0XHRfaSsrXG5cdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PSBzcGFjZUlkXG5cdFx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PSAnMCcgfHwgKG9iamVjdC5pbl9kZXZlbG9wbWVudCAhPSAnMCcgJiYgaXNTcGFjZUFkbWluKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblx0dW5pb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cblx0XHRpZiAhYXJyYXkgYW5kICFvdGhlclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRcdGlmICFhcnJheVxuXHRcdFx0YXJyYXkgPSBbXVxuXHRcdGlmICFvdGhlclxuXHRcdFx0b3RoZXIgPSBbXVxuXHRcdHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcilcblxuXHRpbnRlcnNlY3Rpb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cblx0XHRpZiAhYXJyYXkgYW5kICFvdGhlclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRcdGlmICFhcnJheVxuXHRcdFx0YXJyYXkgPSBbXVxuXHRcdGlmICFvdGhlclxuXHRcdFx0b3RoZXIgPSBbXVxuXHRcdHJldHVybiBfLmludGVyc2VjdGlvbihhcnJheSwgb3RoZXIpXG5cblx0ZXh0ZW5kUGVybWlzc2lvblByb3BzID0gKHRhcmdldCwgcHJvcHMpIC0+XG5cdFx0cHJvcE5hbWVzID0gcGVybWlzc2lvblByb3BOYW1lc1xuXHRcdGZpbGVzUHJvTmFtZXMgPSBcblx0XHRpZiBwcm9wc1xuXHRcdFx0Xy5lYWNoIHByb3BOYW1lcywgKHByb3BOYW1lKSAtPlxuXHRcdFx0XHR0YXJnZXRbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdXG5cblx0XHRcdCMgdGFyZ2V0LmFsbG93Q3JlYXRlID0gcHJvcHMuYWxsb3dDcmVhdGVcblx0XHRcdCMgdGFyZ2V0LmFsbG93RGVsZXRlID0gcHJvcHMuYWxsb3dEZWxldGVcblx0XHRcdCMgdGFyZ2V0LmFsbG93RWRpdCA9IHByb3BzLmFsbG93RWRpdFxuXHRcdFx0IyB0YXJnZXQuYWxsb3dSZWFkID0gcHJvcHMuYWxsb3dSZWFkXG5cdFx0XHQjIHRhcmdldC5tb2RpZnlBbGxSZWNvcmRzID0gcHJvcHMubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQudmlld0FsbFJlY29yZHMgPSBwcm9wcy52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwcm9wcy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQudmlld0NvbXBhbnlSZWNvcmRzID0gcHJvcHMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHQjIHRhcmdldC5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcHJvcHMuZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0IyB0YXJnZXQuZGlzYWJsZWRfYWN0aW9ucyA9IHByb3BzLmRpc2FibGVkX2FjdGlvbnNcblx0XHRcdCMgdGFyZ2V0LnVucmVhZGFibGVfZmllbGRzID0gcHJvcHMudW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdCMgdGFyZ2V0LnVuZWRpdGFibGVfZmllbGRzID0gcHJvcHMudW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdCMgdGFyZ2V0LnVucmVsYXRlZF9vYmplY3RzID0gcHJvcHMudW5yZWxhdGVkX29iamVjdHNcblx0XHRcdCMgdGFyZ2V0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcHJvcHMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcblxuXHRvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMgPSAodGFyZ2V0LCBwcm9wcykgLT5cblx0XHRwcm9wTmFtZXMgPSBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXNcblx0XHRfLmVhY2ggcHJvcE5hbWVzLCAocHJvcE5hbWUpIC0+XG5cdFx0XHRpZiBwcm9wc1twcm9wTmFtZV1cblx0XHRcdFx0dGFyZ2V0W3Byb3BOYW1lXSA9IHRydWVcblx0XHRcblx0XHQjIGlmIHBvLmFsbG93UmVhZFxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0NyZWF0ZVxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWVcblx0XHQjIGlmIHBvLmFsbG93RWRpdFxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHQjIGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWVcblx0XHQjIGlmIHBvLnZpZXdBbGxSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxuXHRcdCMgaWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cdFx0IyBpZiBwby52aWV3Q29tcGFueVJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXG5cblx0Q3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0cHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzU3VwcGxpZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzQ3VzdG9tZXIgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0IyBwc2V0c01lbWJlciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdCMgcHNldHNHdWVzdCA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRzcGFjZVVzZXIgPSBudWxsO1xuXHRcdGlmIHVzZXJJZFxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRlbHNlXG5cdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRhcHBzID0gW11cblx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdHJldHVybiBbXVxuXHRcdGVsc2Vcblx0XHRcdHVzZXJQcm9maWxlID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pPy5wcm9maWxlXG5cdFx0XHRwc2V0QmFzZSA9IHBzZXRzVXNlclxuXHRcdFx0aWYgdXNlclByb2ZpbGVcblx0XHRcdFx0aWYgdXNlclByb2ZpbGUgPT0gJ3N1cHBsaWVyJ1xuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNTdXBwbGllclxuXHRcdFx0XHRlbHNlIGlmIHVzZXJQcm9maWxlID09ICdjdXN0b21lcidcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXJcblx0XHRcdGlmIHBzZXRCYXNlPy5hc3NpZ25lZF9hcHBzPy5sZW5ndGhcblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIHVzZXLmnYPpmZDpm4bkuK3nmoRhc3NpZ25lZF9hcHBz6KGo56S65omA5pyJ55So5oi35YW35pyJ55qEYXBwc+adg+mZkO+8jOS4uuepuuWImeihqOekuuacieaJgOaciWFwcHPmnYPpmZDvvIzkuI3pnIDopoHkvZzmnYPpmZDliKTmlq3kuoZcblx0XHRcdFx0cmV0dXJuIFtdXG5cdFx0XHRfLmVhY2ggcHNldHMsIChwc2V0KS0+XG5cdFx0XHRcdGlmICFwc2V0LmFzc2lnbmVkX2FwcHNcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgcHNldC5uYW1lID09IFwiYWRtaW5cIiB8fCAgcHNldC5uYW1lID09IFwidXNlclwiIHx8IHBzZXQubmFtZSA9PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PSAnY3VzdG9tZXInXG5cdFx0XHRcdFx0IyDov5nph4zkuYvmiYDku6XopoHmjpLpmaRhZG1pbi91c2Vy77yM5piv5Zug5Li66L+Z5Lik5Liq5p2D6ZmQ6ZuG5piv5omA5pyJ5p2D6ZmQ6ZuG5LitdXNlcnPlsZ7mgKfml6DmlYjnmoTmnYPpmZDpm4bvvIznibnmjIflt6XkvZzljLrnrqHnkIblkZjlkozmiYDmnInnlKjmiLdcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzXG5cdFx0XHRyZXR1cm4gXy53aXRob3V0KF8udW5pcShhcHBzKSx1bmRlZmluZWQsbnVsbClcblxuXHRDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0cHNldHMgPSAgdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdGFkbWluTWVudXMgPSBDcmVhdG9yLkFwcHMuYWRtaW4/LmFkbWluX21lbnVzXG5cdFx0IyDlpoLmnpzmsqHmnIlhZG1pbuiPnOWNleivtOaYjuS4jemcgOimgeebuOWFs+WKn+iDve+8jOebtOaOpei/lOWbnuepulxuXHRcdHVubGVzcyBhZG1pbk1lbnVzXG5cdFx0XHRyZXR1cm4gW11cblx0XHRhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQgKG4pIC0+XG5cdFx0XHRuLl9pZCA9PSAnYWJvdXQnXG5cdFx0YWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyIChuKSAtPlxuXHRcdFx0bi5faWQgIT0gJ2Fib3V0J1xuXHRcdG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeSBfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCAobikgLT5cblx0XHRcdHJldHVybiBuLmFkbWluX21lbnVzIGFuZCBuLl9pZCAhPSAnYWRtaW4nXG5cdFx0KSwgJ3NvcnQnXG5cdFx0b3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpXG5cdFx0IyDoj5zljZXmnInkuInpg6jliIbnu4TmiJDvvIzorr7nva5BUFDoj5zljZXjgIHlhbbku5ZBUFDoj5zljZXku6Xlj4phYm91dOiPnOWNlVxuXHRcdGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSlcblx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdCMg5bel5L2c5Yy6566h55CG5ZGY5pyJ5YWo6YOo6I+c5Y2V5Yqf6IO9XG5cdFx0XHRyZXN1bHQgPSBhbGxNZW51c1xuXHRcdGVsc2Vcblx0XHRcdHVzZXJQcm9maWxlID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pPy5wcm9maWxlIHx8ICd1c2VyJ1xuXHRcdFx0Y3VycmVudFBzZXROYW1lcyA9IHBzZXRzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4ubmFtZVxuXHRcdFx0bWVudXMgPSBhbGxNZW51cy5maWx0ZXIgKG1lbnUpLT5cblx0XHRcdFx0cHNldHNNZW51ID0gbWVudS5wZXJtaXNzaW9uX3NldHNcblx0XHRcdFx0IyDlpoLmnpzmma7pgJrnlKjmiLfmnInmnYPpmZDvvIzliJnnm7TmjqXov5Tlm550cnVlXG5cdFx0XHRcdGlmIHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZih1c2VyUHJvZmlsZSkgPiAtMVxuXHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRcdCMg5ZCm5YiZ5Y+W5b2T5YmN55So5oi355qE5p2D6ZmQ6ZuG5LiObWVudeiPnOWNleimgeaxgueahOadg+mZkOmbhuWvueavlO+8jOWmguaenOS6pOmbhuWkp+S6jjHkuKrliJnov5Tlm550cnVlXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aFxuXHRcdFx0cmVzdWx0ID0gbWVudXNcblx0XHRcblx0XHRyZXR1cm4gXy5zb3J0QnkocmVzdWx0LFwic29ydFwiKVxuXG5cdGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpLT5cblxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBudWxsXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBfLmZpbmQgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cblx0XHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkfSlcblxuXHRmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcyktPlxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBudWxsXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBfLmZpbHRlciBwZXJtaXNzaW9uX29iamVjdHMsIChwbyktPlxuXHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogcGVybWlzc2lvbl9zZXRfaWRzfX0pLmZldGNoKClcblxuXHR1bmlvblBlcm1pc3Npb25PYmplY3RzID0gKHBvcywgb2JqZWN0LCBwc2V0cyktPlxuXHRcdCMg5oqKZGLlj4p5bWzkuK3nmoRwZXJtaXNzaW9uX29iamVjdHPlkIjlubbvvIzkvJjlhYjlj5ZkYuS4reeahFxuXHRcdHJlc3VsdCA9IFtdXG5cdFx0Xy5lYWNoIG9iamVjdC5wZXJtaXNzaW9uX3NldCwgKG9wcywgb3BzX2tleSktPlxuXHRcdFx0IyDmiop5bWzkuK3pmaTkuobnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4ZcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCLlpJbnmoTlhbbku5blr7nosaHmnYPpmZDlhYjlrZjlhaVyZXN1bHRcblx0XHRcdCMgaWYgW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIiwgXCJ3b3JrZmxvd19hZG1pblwiLCBcIm9yZ2FuaXphdGlvbl9hZG1pblwiXS5pbmRleE9mKG9wc19rZXkpIDwgMFxuXHRcdFx0aWYgW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDBcblx0XHRcdFx0Y3VycmVudFBzZXQgPSBwc2V0cy5maW5kIChwc2V0KS0+IHJldHVybiBwc2V0Lm5hbWUgPT0gb3BzX2tleVxuXHRcdFx0XHRpZiBjdXJyZW50UHNldFxuXHRcdFx0XHRcdHRlbXBPcHMgPSBfLmNsb25lKG9wcykgfHwge31cblx0XHRcdFx0XHR0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkXG5cdFx0XHRcdFx0dGVtcE9wcy5vYmplY3RfbmFtZSA9IG9iamVjdC5vYmplY3RfbmFtZVxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoIHRlbXBPcHNcblx0XHRpZiByZXN1bHQubGVuZ3RoXG5cdFx0XHRwb3MuZm9yRWFjaCAocG8pLT5cblx0XHRcdFx0cmVwZWF0SW5kZXggPSAwXG5cdFx0XHRcdHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoKGl0ZW0sIGluZGV4KS0+IHJlcGVhdEluZGV4ID0gaW5kZXg7cmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT0gcG8ucGVybWlzc2lvbl9zZXRfaWQpXG5cdFx0XHRcdCMg5aaC5p6ceW1s5Lit5bey57uP5a2Y5ZyocG/vvIzliJnmm7/mjaLkuLrmlbDmja7lupPkuK3nmoRwb++8jOWPjeS5i+WImeaKiuaVsOaNruW6k+S4reeahHBv55u05o6l57Sv5Yqg6L+b5Y67XG5cdFx0XHRcdGlmIHJlcGVhdFBvXG5cdFx0XHRcdFx0cmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXN1bHQucHVzaCBwb1xuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBwb3NcblxuXHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpLT5cblx0XHRwZXJtaXNzaW9ucyA9IHt9XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpXG5cblx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT0gXCJ1c2Vyc1wiXG5cdFx0XHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxuXHRcdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcblx0XHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXHRcdHBzZXRzQWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIG9yIHRoaXMucHNldHNBZG1pbiB0aGVuIHRoaXMucHNldHNBZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c1VzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgb3IgdGhpcy5wc2V0c1VzZXIgdGhlbiB0aGlzLnBzZXRzVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzTWVtYmVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgb3IgdGhpcy5wc2V0c01lbWJlciB0aGVuIHRoaXMucHNldHNNZW1iZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzR3Vlc3QgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIG9yIHRoaXMucHNldHNHdWVzdCB0aGVuIHRoaXMucHNldHNHdWVzdCBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjF9fSlcblxuXHRcdHBzZXRzU3VwcGxpZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzU3VwcGxpZXIpIG9yIHRoaXMucHNldHNTdXBwbGllciB0aGVuIHRoaXMucHNldHNTdXBwbGllciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c0N1c3RvbWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSBvciB0aGlzLnBzZXRzQ3VzdG9tZXIgdGhlbiB0aGlzLnBzZXRzQ3VzdG9tZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudDtcblx0XHRpZiAhcHNldHNcblx0XHRcdHNwYWNlVXNlciA9IG51bGw7XG5cdFx0XHRpZiB1c2VySWRcblx0XHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXG5cdFx0cHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zXG5cdFx0cHNldHNVc2VyX3BvcyA9IHRoaXMucHNldHNVc2VyX3Bvc1xuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zXG5cdFx0cHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zXG5cblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3Ncblx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3NcblxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3NcblxuXHRcdG9wc2V0QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5hZG1pbikgfHwge31cblx0XHRvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fVxuXHRcdG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fVxuXHRcdG9wc2V0R3Vlc3QgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cblxuXHRcdG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge31cblx0XHRvcHNldEN1c3RvbWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuY3VzdG9tZXIpIHx8IHt9XG5cblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X2xpc3R2aWV3cycpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNoYXJlZDogdHJ1ZX0sIHtmaWVsZHM6e19pZDoxfX0pLmZldGNoKClcblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IF8ucGx1Y2soc2hhcmVkTGlzdFZpZXdzLFwiX2lkXCIpXG5cdFx0IyBpZiBzaGFyZWRMaXN0Vmlld3MubGVuZ3RoXG5cdFx0IyBcdHVubGVzcyBvcHNldEFkbWluLmxpc3Rfdmlld3Ncblx0XHQjIFx0XHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBbXVxuXHRcdCMgXHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0QWRtaW4ubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXG5cdFx0IyBcdHVubGVzcyBvcHNldFVzZXIubGlzdF92aWV3c1xuXHRcdCMgXHRcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gW11cblx0XHQjIFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0VXNlci5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3Ncblx0XHQjIOaVsOaNruW6k+S4reWmguaenOmFjee9ruS6hum7mOiupOeahGFkbWluL3VzZXLmnYPpmZDpm4borr7nva7vvIzlupTor6Xopobnm5bku6PnoIHkuK1hZG1pbi91c2Vy55qE5p2D6ZmQ6ZuG6K6+572uXG5cdFx0aWYgcHNldHNBZG1pblxuXHRcdFx0cG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRBZG1pbiwgcG9zQWRtaW5cblx0XHRpZiBwc2V0c1VzZXJcblx0XHRcdHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0VXNlciwgcG9zVXNlclxuXHRcdGlmIHBzZXRzTWVtYmVyXG5cdFx0XHRwb3NNZW1iZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzTWVtYmVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzTWVtYmVyLl9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldE1lbWJlciwgcG9zTWVtYmVyXG5cdFx0aWYgcHNldHNHdWVzdFxuXHRcdFx0cG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRHdWVzdCwgcG9zR3Vlc3Rcblx0XHRpZiBwc2V0c1N1cHBsaWVyXG5cdFx0XHRwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRTdXBwbGllciwgcG9zU3VwcGxpZXJcblx0XHRpZiBwc2V0c0N1c3RvbWVyXG5cdFx0XHRwb3NDdXN0b21lciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXN0b21lcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0N1c3RvbWVyLl9pZCk7XG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRDdXN0b21lciwgcG9zQ3VzdG9tZXJcblxuXHRcdGlmICF1c2VySWRcblx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxuXHRcdGVsc2Vcblx0XHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnY29tbW9uJ1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzcGFjZVVzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgb3IgdGhpcy5zcGFjZVVzZXIgdGhlbiB0aGlzLnNwYWNlVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdFx0XHRcdGlmIHNwYWNlVXNlclxuXHRcdFx0XHRcdFx0cHJvZiA9IHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRcdFx0XHRpZiBwcm9mXG5cdFx0XHRcdFx0XHRcdGlmIHByb2YgaXMgJ3VzZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdtZW1iZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldE1lbWJlclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2d1ZXN0J1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ3N1cHBsaWVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRTdXBwbGllclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lclxuXHRcdFx0XHRcdFx0ZWxzZSAjIOayoeaciXByb2ZpbGXliJnorqTkuLrmmK91c2Vy5p2D6ZmQXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XG5cdFx0aWYgcHNldHMubGVuZ3RoID4gMFxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHMsIFwiX2lkXCJcblx0XHRcdHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpXG5cdFx0XHRwb3MgPSB1bmlvblBlcm1pc3Npb25PYmplY3RzKHBvcywgb2JqZWN0LCBwc2V0cylcblx0XHRcdF8uZWFjaCBwb3MsIChwbyktPlxuXHRcdFx0XHRpZiBwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0FkbWluPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzVXNlcj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c01lbWJlcj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0d1ZXN0Py5faWQgb3Jcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNTdXBwbGllcj8uX2lkIG9yXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQ3VzdG9tZXI/Ll9pZFxuXHRcdFx0XHRcdCMg6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOWAvOWPquWunuihjOS4iumdoueahOm7mOiupOWAvOimhueblu+8jOS4jeWBmueul+azleWIpOaWrVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBfLmlzRW1wdHkocGVybWlzc2lvbnMpXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBwb1xuXHRcdFx0XHRvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMgcGVybWlzc2lvbnMsIHBvXG5cblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cylcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCBwby51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdClcblx0XHRcblx0XHRpZiBvYmplY3QuaXNfdmlld1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdXG5cdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcblxuXHRcdGlmIG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lclxuXHRcdFx0cGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXG5cdCMgQ3JlYXRvci5pbml0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUpIC0+XG5cblx0XHQjICMg5bqU6K+l5oqK6K6h566X5Ye65p2l55qEXG5cdFx0IyBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXS5hbGxvd1xuXHRcdCMgXHRpbnNlcnQ6ICh1c2VySWQsIGRvYykgLT5cblx0XHQjIFx0XHRpZiAhdXNlcklkXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0ICAgIFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblx0XHQjIFx0dXBkYXRlOiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dFZGl0XG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdCMgXHRyZW1vdmU6ICh1c2VySWQsIGRvYykgLT5cblx0XHQjIFx0XHRpZiAhdXNlcklkXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblxuXHRNZXRlb3IubWV0aG9kc1xuXHRcdCMgQ2FsY3VsYXRlIFBlcm1pc3Npb25zIG9uIFNlcnZlclxuXHRcdFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogKHNwYWNlSWQpLT5cblx0XHRcdHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKVxuIiwidmFyIGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgY2xvbmUsIGV4dGVuZFBlcm1pc3Npb25Qcm9wcywgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCwgZmluZF9wZXJtaXNzaW9uX29iamVjdCwgaW50ZXJzZWN0aW9uUGx1cywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzLCBvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMsIHBlcm1pc3Npb25Qcm9wTmFtZXMsIHVuaW9uUGVybWlzc2lvbk9iamVjdHMsIHVuaW9uUGx1cztcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5iYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJhbGxvd0NyZWF0ZVwiLCBcImFsbG93RGVsZXRlXCIsIFwiYWxsb3dFZGl0XCIsIFwiYWxsb3dSZWFkXCIsIFwibW9kaWZ5QWxsUmVjb3Jkc1wiLCBcInZpZXdBbGxSZWNvcmRzXCIsIFwibW9kaWZ5Q29tcGFueVJlY29yZHNcIiwgXCJ2aWV3Q29tcGFueVJlY29yZHNcIiwgXCJhbGxvd1JlYWRGaWxlc1wiLCBcImFsbG93RWRpdEZpbGVzXCIsIFwiYWxsb3dDcmVhdGVGaWxlc1wiLCBcImFsbG93RGVsZXRlRmlsZXNcIiwgXCJ2aWV3QWxsRmlsZXNcIiwgXCJtb2RpZnlBbGxGaWxlc1wiXTtcblxub3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiZGlzYWJsZWRfbGlzdF92aWV3c1wiLCBcImRpc2FibGVkX2FjdGlvbnNcIiwgXCJ1bnJlYWRhYmxlX2ZpZWxkc1wiLCBcInVuZWRpdGFibGVfZmllbGRzXCIsIFwidW5yZWxhdGVkX29iamVjdHNcIiwgXCJ1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFwiXTtcblxucGVybWlzc2lvblByb3BOYW1lcyA9IF8udW5pb24oYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzLCBvdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMpO1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgb2JqO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKTtcbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgaXNPd25lciwgbWFzdGVyT2JqZWN0TmFtZSwgbWFzdGVyUmVjb3JkUGVybSwgcGVybWlzc2lvbnMsIHJlY29yZF9jb21wYW55X2lkLCByZWNvcmRfY29tcGFueV9pZHMsIHJlZiwgdXNlcl9jb21wYW55X2lkcztcbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpO1xuICBpZiAocmVjb3JkKSB7XG4gICAgaWYgKCFfLmlzRW1wdHkocmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucykpIHtcbiAgICAgIHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zO1xuICAgIH1cbiAgICBpc093bmVyID0gcmVjb3JkLm93bmVyID09PSB1c2VySWQgfHwgKChyZWYgPSByZWNvcmQub3duZXIpICE9IG51bGwgPyByZWYuX2lkIDogdm9pZCAwKSA9PT0gdXNlcklkO1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgbWFzdGVyT2JqZWN0TmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuICAgICAgbWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMobWFzdGVyT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gcGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXM7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHBlcm1pc3Npb25zLmFsbG93RGVsZXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dEZWxldGVGaWxlcztcbiAgICAgIGlmICghbWFzdGVyUmVjb3JkUGVybS5tb2RpZnlBbGxGaWxlcyAmJiAhaXNPd25lcikge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHBlcm1pc3Npb25zLmFsbG93UmVhZCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZEZpbGVzO1xuICAgICAgaWYgKCFtYXN0ZXJSZWNvcmRQZXJtLnZpZXdBbGxGaWxlcyAmJiAhaXNPd25lcikge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICB1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKTtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZCA6IHZvaWQgMDtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSAmJiByZWNvcmRfY29tcGFueV9pZC5faWQpIHtcbiAgICAgICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWQ7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkcyA6IHZvaWQgMDtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSkpIHtcbiAgICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKTtcbiAgICAgIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkLmxvY2tlZCAmJiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwZXJtaXNzaW9ucztcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSwgbWFzdGVyQWxsb3csIG1hc3RlclJlY29yZFBlcm0sIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucywgcmVzdWx0LCB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgaWYgKCFjdXJyZW50T2JqZWN0TmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFyZWxhdGVkTGlzdEl0ZW0pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmICghY3VycmVudFJlY29yZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgbWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpO1xuICAgIHJlc3VsdCA9IF8uY2xvbmUocmVsYXRlZE9iamVjdFBlcm1pc3Npb25zKTtcbiAgICBpZiAocmVsYXRlZExpc3RJdGVtLmlzX2ZpbGUpIHtcbiAgICAgIHJlc3VsdC5hbGxvd0NyZWF0ZSA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXM7XG4gICAgICByZXN1bHQuYWxsb3dFZGl0ID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRMaXN0SXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB8fCBmYWxzZTtcbiAgICAgIG1hc3RlckFsbG93ID0gZmFsc2U7XG4gICAgICBpZiAod3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT09IHRydWUpIHtcbiAgICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZDtcbiAgICAgIH0gZWxzZSBpZiAod3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT09IGZhbHNlKSB7XG4gICAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXQ7XG4gICAgICB9XG4gICAgICB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKTtcbiAgICAgIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xO1xuICAgICAgcmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGU7XG4gICAgICByZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgX2ksIGlzU3BhY2VBZG1pbiwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7XG4gICAgICBvYmplY3RzOiB7fSxcbiAgICAgIGFzc2lnbmVkX2FwcHM6IFtdXG4gICAgfTtcblxuICAgIC8qXG4gICAgXHRcdOadg+mZkOmbhuivtOaYjjpcbiAgICBcdFx05YaF572u5p2D6ZmQ6ZuGLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxuICAgIFx0XHToh6rlrprkuYnmnYPpmZDpm4Yt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ6ZuG5Lul5aSW55qE5YW25LuW5p2D6ZmQ6ZuGXG4gICAgXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG4gICAgXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOmbhlxuICAgICAqL1xuICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgcHNldHNBZG1pbl9wb3MgPSBudWxsO1xuICAgIHBzZXRzVXNlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNHdWVzdF9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGw7XG4gICAgaWYgKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VycmVudC5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwiX2lkXCIpO1xuICAgICAgcHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgICAkaW46IHNldF9pZHNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwibmFtZVwiKTtcbiAgICB9XG4gICAgcHNldHMgPSB7XG4gICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudCxcbiAgICAgIHBzZXRzTWVtYmVyOiBwc2V0c01lbWJlcixcbiAgICAgIHBzZXRzR3Vlc3Q6IHBzZXRzR3Vlc3QsXG4gICAgICBwc2V0c1N1cHBsaWVyOiBwc2V0c1N1cHBsaWVyLFxuICAgICAgcHNldHNDdXN0b21lcjogcHNldHNDdXN0b21lcixcbiAgICAgIGlzU3BhY2VBZG1pbjogaXNTcGFjZUFkbWluLFxuICAgICAgc3BhY2VVc2VyOiBzcGFjZVVzZXIsXG4gICAgICBwc2V0c0FkbWluX3BvczogcHNldHNBZG1pbl9wb3MsXG4gICAgICBwc2V0c1VzZXJfcG9zOiBwc2V0c1VzZXJfcG9zLFxuICAgICAgcHNldHNNZW1iZXJfcG9zOiBwc2V0c01lbWJlcl9wb3MsXG4gICAgICBwc2V0c0d1ZXN0X3BvczogcHNldHNHdWVzdF9wb3MsXG4gICAgICBwc2V0c1N1cHBsaWVyX3BvczogcHNldHNTdXBwbGllcl9wb3MsXG4gICAgICBwc2V0c0N1c3RvbWVyX3BvczogcHNldHNDdXN0b21lcl9wb3MsXG4gICAgICBwc2V0c0N1cnJlbnRfcG9zOiBwc2V0c0N1cnJlbnRfcG9zXG4gICAgfTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXM7XG4gICAgX2kgPSAwO1xuICAgIF8uZWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgIF9pKys7XG4gICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT09IHNwYWNlSWQpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT09ICcwJyAmJiBpc1NwYWNlQWRtaW4pKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpO1xuICAgICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgdW5pb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIGludGVyc2VjdGlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcHMpIHtcbiAgICB2YXIgZmlsZXNQcm9OYW1lcywgcHJvcE5hbWVzO1xuICAgIHByb3BOYW1lcyA9IHBlcm1pc3Npb25Qcm9wTmFtZXM7XG4gICAgcmV0dXJuIGZpbGVzUHJvTmFtZXMgPSBwcm9wcyA/IF8uZWFjaChwcm9wTmFtZXMsIGZ1bmN0aW9uKHByb3BOYW1lKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICB9KSA6IHZvaWQgMDtcbiAgfTtcbiAgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wcykge1xuICAgIHZhciBwcm9wTmFtZXM7XG4gICAgcHJvcE5hbWVzID0gYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzO1xuICAgIHJldHVybiBfLmVhY2gocHJvcE5hbWVzLCBmdW5jdGlvbihwcm9wTmFtZSkge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFwcHMsIGlzU3BhY2VBZG1pbiwgcHNldEJhc2UsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0N1c3RvbWVyLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1VzZXIsIHJlZiwgcmVmMSwgc3BhY2VVc2VyLCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhcHBzID0gW107XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmLnByb2ZpbGUgOiB2b2lkIDA7XG4gICAgICBwc2V0QmFzZSA9IHBzZXRzVXNlcjtcbiAgICAgIGlmICh1c2VyUHJvZmlsZSkge1xuICAgICAgICBpZiAodXNlclByb2ZpbGUgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXI7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlclByb2ZpbGUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwc2V0QmFzZSAhPSBudWxsID8gKHJlZjEgPSBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgYXBwcyA9IF8udW5pb24oYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBfLmVhY2gocHNldHMsIGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgaWYgKCFwc2V0LmFzc2lnbmVkX2FwcHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBzZXQubmFtZSA9PT0gXCJhZG1pblwiIHx8IHBzZXQubmFtZSA9PT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXBwcyA9IF8udW5pb24oYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksIHZvaWQgMCwgbnVsbCk7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYWJvdXRNZW51LCBhZG1pbk1lbnVzLCBhbGxNZW51cywgY3VycmVudFBzZXROYW1lcywgaXNTcGFjZUFkbWluLCBtZW51cywgb3RoZXJNZW51QXBwcywgb3RoZXJNZW51cywgcHNldHMsIHJlZiwgcmVmMSwgcmVzdWx0LCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFkbWluTWVudXMgPSAocmVmID0gQ3JlYXRvci5BcHBzLmFkbWluKSAhPSBudWxsID8gcmVmLmFkbWluX21lbnVzIDogdm9pZCAwO1xuICAgIGlmICghYWRtaW5NZW51cykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkID09PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgIT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgb3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5KF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmFkbWluX21lbnVzICYmIG4uX2lkICE9PSAnYWRtaW4nO1xuICAgIH0pLCAnc29ydCcpO1xuICAgIG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKTtcbiAgICBhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJlc3VsdCA9IGFsbE1lbnVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9ICgocmVmMSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYxLnByb2ZpbGUgOiB2b2lkIDApIHx8ICd1c2VyJztcbiAgICAgIGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5uYW1lO1xuICAgICAgfSk7XG4gICAgICBtZW51cyA9IGFsbE1lbnVzLmZpbHRlcihmdW5jdGlvbihtZW51KSB7XG4gICAgICAgIHZhciBwc2V0c01lbnU7XG4gICAgICAgIHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzO1xuICAgICAgICBpZiAocHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoO1xuICAgICAgfSk7XG4gICAgICByZXN1bHQgPSBtZW51cztcbiAgICB9XG4gICAgcmV0dXJuIF8uc29ydEJ5KHJlc3VsdCwgXCJzb3J0XCIpO1xuICB9O1xuICBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmluZChwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZFxuICAgIH0pO1xuICB9O1xuICBmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcihwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICRpbjogcGVybWlzc2lvbl9zZXRfaWRzXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgfTtcbiAgdW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IGZ1bmN0aW9uKHBvcywgb2JqZWN0LCBwc2V0cykge1xuICAgIHZhciByZXN1bHQ7XG4gICAgcmVzdWx0ID0gW107XG4gICAgXy5lYWNoKG9iamVjdC5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24ob3BzLCBvcHNfa2V5KSB7XG4gICAgICB2YXIgY3VycmVudFBzZXQsIHRlbXBPcHM7XG4gICAgICBpZiAoW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDApIHtcbiAgICAgICAgY3VycmVudFBzZXQgPSBwc2V0cy5maW5kKGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgICByZXR1cm4gcHNldC5uYW1lID09PSBvcHNfa2V5O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGN1cnJlbnRQc2V0KSB7XG4gICAgICAgICAgdGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fTtcbiAgICAgICAgICB0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkO1xuICAgICAgICAgIHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWU7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHRlbXBPcHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcbiAgICAgIHBvcy5mb3JFYWNoKGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHZhciByZXBlYXRJbmRleCwgcmVwZWF0UG87XG4gICAgICAgIHJlcGVhdEluZGV4ID0gMDtcbiAgICAgICAgcmVwZWF0UG8gPSByZXN1bHQuZmluZChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgIHJlcGVhdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT09IHBvLnBlcm1pc3Npb25fc2V0X2lkO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlcGVhdFBvKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2gocG8pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwb3M7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBpc1NwYWNlQWRtaW4sIG9iamVjdCwgb3BzZXRBZG1pbiwgb3BzZXRDdXN0b21lciwgb3BzZXRHdWVzdCwgb3BzZXRNZW1iZXIsIG9wc2V0U3VwcGxpZXIsIG9wc2V0VXNlciwgcGVybWlzc2lvbnMsIHBvcywgcG9zQWRtaW4sIHBvc0N1c3RvbWVyLCBwb3NHdWVzdCwgcG9zTWVtYmVyLCBwb3NTdXBwbGllciwgcG9zVXNlciwgcHJvZiwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHt9O1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgICBpZiAoc3BhY2VJZCA9PT0gJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgfHwgdGhpcy5wc2V0c0FkbWluID8gdGhpcy5wc2V0c0FkbWluIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIHx8IHRoaXMucHNldHNVc2VyID8gdGhpcy5wc2V0c1VzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzTWVtYmVyID0gXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgfHwgdGhpcy5wc2V0c01lbWJlciA/IHRoaXMucHNldHNNZW1iZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNHdWVzdCA9IF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgfHwgdGhpcy5wc2V0c0d1ZXN0ID8gdGhpcy5wc2V0c0d1ZXN0IDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgfHwgdGhpcy5wc2V0c1N1cHBsaWVyID8gdGhpcy5wc2V0c1N1cHBsaWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgfHwgdGhpcy5wc2V0c0N1c3RvbWVyID8gdGhpcy5wc2V0c0N1c3RvbWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudDtcbiAgICBpZiAoIXBzZXRzKSB7XG4gICAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zO1xuICAgIHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3M7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3M7XG4gICAgcHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3BvcztcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3M7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3BvcztcbiAgICBvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9O1xuICAgIG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9O1xuICAgIG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fTtcbiAgICBvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgIG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge307XG4gICAgb3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fTtcbiAgICBpZiAocHNldHNBZG1pbikge1xuICAgICAgcG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0QWRtaW4sIHBvc0FkbWluKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlcikge1xuICAgICAgcG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0VXNlciwgcG9zVXNlcik7XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlcikge1xuICAgICAgcG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0TWVtYmVyLCBwb3NNZW1iZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCkge1xuICAgICAgcG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0R3Vlc3QsIHBvc0d1ZXN0KTtcbiAgICB9XG4gICAgaWYgKHBzZXRzU3VwcGxpZXIpIHtcbiAgICAgIHBvc1N1cHBsaWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1N1cHBsaWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzU3VwcGxpZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldFN1cHBsaWVyLCBwb3NTdXBwbGllcik7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyKSB7XG4gICAgICBwb3NDdXN0b21lciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXN0b21lcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0N1c3RvbWVyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRDdXN0b21lciwgcG9zQ3VzdG9tZXIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzcGFjZUlkID09PSAnY29tbW9uJykge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYWNlVXNlciA9IF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSB8fCB0aGlzLnNwYWNlVXNlciA/IHRoaXMuc3BhY2VVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHNwYWNlVXNlcikge1xuICAgICAgICAgICAgcHJvZiA9IHNwYWNlVXNlci5wcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2YpIHtcbiAgICAgICAgICAgICAgaWYgKHByb2YgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdtZW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldE1lbWJlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnZ3Vlc3QnKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzLCBcIl9pZFwiKTtcbiAgICAgIHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpO1xuICAgICAgcG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpO1xuICAgICAgXy5lYWNoKHBvcywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgaWYgKHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLmlzRW1wdHkocGVybWlzc2lvbnMpKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBwbztcbiAgICAgICAgfVxuICAgICAgICBvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMocGVybWlzc2lvbnMsIHBvKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpO1xuICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCBwby51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9iamVjdC5pc192aWV3KSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXTtcbiAgICB9XG4gICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgIGlmIChvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXIpIHtcbiAgICAgIHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyO1xuICAgIH1cbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICBcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKVxuXG5NZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1Jcblx0b3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1Jcblx0aWYgY3JlYXRvcl9kYl91cmxcblx0XHRpZiAhb3Bsb2dfdXJsXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIilcblx0XHRDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7X2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtvcGxvZ1VybDogb3Bsb2dfdXJsfSl9XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSAob2JqZWN0KS0+XG4jXHRpZiBvYmplY3QudGFibGVfbmFtZSAmJiBvYmplY3QudGFibGVfbmFtZS5lbmRzV2l0aChcIl9fY1wiKVxuI1x0XHRyZXR1cm4gb2JqZWN0LnRhYmxlX25hbWVcbiNcdGVsc2VcbiNcdFx0cmV0dXJuIG9iamVjdC5uYW1lXG5cdHJldHVybiBvYmplY3QubmFtZVxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gKG9iamVjdCktPlxuXHRjb2xsZWN0aW9uX2tleSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqZWN0KVxuXHRpZiBkYltjb2xsZWN0aW9uX2tleV1cblx0XHRyZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldXG5cdGVsc2UgaWYgb2JqZWN0LmRiXG5cdFx0cmV0dXJuIG9iamVjdC5kYlxuXG5cdGlmIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXG5cdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXG5cdGVsc2Vcblx0XHRpZiBvYmplY3QuY3VzdG9tXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKVxuXHRcdGVsc2Vcblx0XHRcdGlmIGNvbGxlY3Rpb25fa2V5ID09ICdfc21zX3F1ZXVlJyAmJiBTTVNRdWV1ZT8uY29sbGVjdGlvblxuXHRcdFx0XHRyZXR1cm4gU01TUXVldWUuY29sbGVjdGlvblxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpXG5cblxuIiwidmFyIHN0ZWVkb3NDb3JlO1xuXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdG9yX2RiX3VybCwgb3Bsb2dfdXJsO1xuICBjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SO1xuICBvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUjtcbiAgaWYgKGNyZWF0b3JfZGJfdXJsKSB7XG4gICAgaWYgKCFvcGxvZ191cmwpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtcbiAgICAgIF9kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7XG4gICAgICAgIG9wbG9nVXJsOiBvcGxvZ191cmxcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxufSk7XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBjb2xsZWN0aW9uX2tleTtcbiAgY29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdCk7XG4gIGlmIChkYltjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2UgaWYgKG9iamVjdC5kYikge1xuICAgIHJldHVybiBvYmplY3QuZGI7XG4gIH1cbiAgaWYgKENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3QuY3VzdG9tKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbGxlY3Rpb25fa2V5ID09PSAnX3Ntc19xdWV1ZScgJiYgKHR5cGVvZiBTTVNRdWV1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTTVNRdWV1ZSAhPT0gbnVsbCA/IFNNU1F1ZXVlLmNvbGxlY3Rpb24gOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpO1xuICAgIH1cbiAgfVxufTtcbiIsIkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9XG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHQjIOWumuS5ieWFqOWxgCBhY3Rpb25zIOWHveaVsFx0XG5cdENyZWF0b3IuYWN0aW9ucyA9IChhY3Rpb25zKS0+XG5cdFx0Xy5lYWNoIGFjdGlvbnMsICh0b2RvLCBhY3Rpb25fbmFtZSktPlxuXHRcdFx0Q3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbl9uYW1lXSA9IHRvZG8gXG5cblx0Q3JlYXRvci5leGVjdXRlQWN0aW9uID0gKG9iamVjdF9uYW1lLCBhY3Rpb24sIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50LCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbGJhY2spLT5cblx0XHRpZiBhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT0gJ3dvcmQtcHJpbnQnXG5cdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0ZmlsdGVycyA9IFsnX2lkJywgJz0nLCByZWNvcmRfaWRdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZpbHRlcnMgPSBPYmplY3RHcmlkLmdldEZpbHRlcnMob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZmFsc2UsIG51bGwsIG51bGwpXG5cdFx0XHR1cmwgPSBcIi9hcGkvdjQvd29yZF90ZW1wbGF0ZXMvXCIgKyBhY3Rpb24ud29yZF90ZW1wbGF0ZSArIFwiL3ByaW50XCIgKyBcIj9maWx0ZXJzPVwiICsgU3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvT0RhdGFRdWVyeShmaWx0ZXJzKTtcblx0XHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcblx0XHRcdHJldHVybiB3aW5kb3cub3Blbih1cmwpO1xuXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgYWN0aW9uPy50b2RvXG5cdFx0XHRpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJzdHJpbmdcIlxuXHRcdFx0XHR0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXVxuXHRcdFx0ZWxzZSBpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdHRvZG8gPSBhY3Rpb24udG9kb1x0XG5cdFx0XHRpZiAhcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxuXHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0aWYgdG9kb1xuXHRcdFx0XHQjIGl0ZW1fZWxlbWVudOS4uuepuuaXtuW6lOivpeiuvue9rum7mOiupOWAvO+8iOWvueixoeeahG5hbWXlrZfmrrXvvInvvIzlkKbliJltb3JlQXJnc+aLv+WIsOeahOWQjue7reWPguaVsOS9jee9ruWwseS4jeWvuVxuXHRcdFx0XHRpdGVtX2VsZW1lbnQgPSBpZiBpdGVtX2VsZW1lbnQgdGhlbiBpdGVtX2VsZW1lbnQgZWxzZSBcIlwiXG5cdFx0XHRcdG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxuXHRcdFx0XHR0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpXG5cdFx0XHRcdHRvZG8uYXBwbHkge1xuXHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdHJlY29yZF9pZDogcmVjb3JkX2lkXG5cdFx0XHRcdFx0b2JqZWN0OiBvYmpcblx0XHRcdFx0XHRhY3Rpb246IGFjdGlvblxuXHRcdFx0XHRcdGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50XG5cdFx0XHRcdFx0cmVjb3JkOiByZWNvcmRcblx0XHRcdFx0fSwgdG9kb0FyZ3Ncblx0XHRcdGVsc2Vcblx0XHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXG5cdFx0ZWxzZVxuXHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXG5cblxuXHRfZGVsZXRlUmVjb3JkID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaywgY2FsbF9iYWNrX2Vycm9yKS0+XG5cdFx0IyBjb25zb2xlLmxvZyhcIj09PV9kZWxldGVSZWNvcmQ9PT1cIiwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpO1xuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdHByZXZpb3VzRG9jID0gRm9ybU1hbmFnZXIuZ2V0UHJldmlvdXNEb2Mob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgJ2RlbGV0ZScpXG5cdFx0Q3JlYXRvci5vZGF0YS5kZWxldGUgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgKCktPlxuXHRcdFx0aWYgcmVjb3JkX3RpdGxlXG5cdFx0XHRcdCMgaW5mbyA9IG9iamVjdC5sYWJlbCArIFwiXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIiArIFwi5bey5Yig6ZmkXCJcblx0XHRcdFx0aW5mbyA9dCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5mbyA9IHQoJ2NyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3N1YycpXG5cdFx0XHR0b2FzdHIuc3VjY2VzcyBpbmZvXG5cdFx0XHRpZiBjYWxsX2JhY2sgYW5kIHR5cGVvZiBjYWxsX2JhY2sgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdGNhbGxfYmFjaygpXG5cblx0XHRcdEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYWZ0ZXInLCB7X2lkOiByZWNvcmRfaWQsIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY30pXG5cdFx0LCAoZXJyb3IpLT5cblx0XHRcdGlmIGNhbGxfYmFja19lcnJvciBhbmQgdHlwZW9mIGNhbGxfYmFja19lcnJvciA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0Y2FsbF9iYWNrX2Vycm9yKClcblx0XHRcdEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7X2lkOiByZWNvcmRfaWQsIGVycm9yOiBlcnJvcn0pXG5cblx0Q3JlYXRvci5yZWxhdGVkT2JqZWN0U3RhbmRhcmROZXcgPSAocmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdHJlbGF0ZU9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0Y29sbGVjdGlvbl9uYW1lID0gcmVsYXRlT2JqZWN0LmxhYmVsXG5cdFx0Y29sbGVjdGlvbiA9IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy4je0NyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpLl9jb2xsZWN0aW9uX25hbWV9XCJcblx0XHRjdXJyZW50X29iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0XHRpZHMgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkc1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdGluaXRpYWxWYWx1ZXMgPSB7fTtcblx0XHRpZiBpZHM/Lmxlbmd0aFxuXHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cblx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XG5cdFx0XHRyZWNvcmRfaWQgPSBpZHNbMF1cblx0XHRcdGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdGluaXRpYWxWYWx1ZXMgPSBkb2Ncblx0XHRcdCMg4oCc5L+d5a2Y5bm25paw5bu64oCd5pON5L2c5Lit6Ieq5Yqo5omT5byA55qE5paw56qX5Y+j5Lit6ZyA6KaB5YaN5qyh5aSN5Yi25pyA5paw55qEZG9j5YaF5a655Yiw5paw56qX5Y+j5LitXG5cdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdGRlZmF1bHREb2MgPSBGb3JtTWFuYWdlci5nZXRSZWxhdGVkSW5pdGlhbFZhbHVlcyhjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSk7XG5cdFx0XHRpZiAhXy5pc0VtcHR5KGRlZmF1bHREb2MpXG5cdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSBkZWZhdWx0RG9jXG5cdFx0aWYgcmVsYXRlT2JqZWN0Py52ZXJzaW9uID49IDJcblx0XHRcdHJldHVybiBTdGVlZG9zVUkuc2hvd01vZGFsKHN0b3Jlcy5Db21wb25lbnRSZWdpc3RyeS5jb21wb25lbnRzLk9iamVjdEZvcm0sIHtcblx0XHRcdFx0bmFtZTogXCIje3JlbGF0ZWRfb2JqZWN0X25hbWV9X3N0YW5kYXJkX25ld19mb3JtXCIsXG5cdFx0XHRcdG9iamVjdEFwaU5hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG5cdFx0XHRcdHRpdGxlOiAn5paw5bu6ICcgKyByZWxhdGVPYmplY3QubGFiZWwsXG5cdFx0XHRcdGluaXRpYWxWYWx1ZXM6IGluaXRpYWxWYWx1ZXMsXG5cdFx0XHRcdGFmdGVySW5zZXJ0OiAocmVzdWx0KS0+XG5cdFx0XHRcdFx0c2V0VGltZW91dCgoKS0+XG5cdFx0XHRcdFx0XHQjIE9iamVjdEZvcm3mnInnvJPlrZjvvIzmlrDlu7rlrZDooajorrDlvZXlj6/og73kvJrmnInmsYfmgLvlrZfmrrXvvIzpnIDopoHliLfmlrDooajljZXmlbDmja5cblx0XHRcdFx0XHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpLnZlcnNpb24gPiAxXG5cdFx0XHRcdFx0XHRcdFN0ZWVkb3NVSS5yZWxvYWRSZWNvcmQoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdCwgMSk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9LCBudWxsLCB7aWNvblBhdGg6ICcvYXNzZXRzL2ljb25zJ30pXG5cblxuXHRcdGlmIGlkcz8ubGVuZ3RoXG5cdFx0XHQjIOWIl+ihqOaciemAieS4remhueaXtu+8jOWPluesrOS4gOS4qumAieS4remhue+8jOWkjeWItuWFtuWGheWuueWIsOaWsOW7uueql+WPo+S4rVxuXHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcblx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblx0XHRcdCMg4oCc5L+d5a2Y5bm25paw5bu64oCd5pON5L2c5Lit6Ieq5Yqo5omT5byA55qE5paw56qX5Y+j5Lit6ZyA6KaB5YaN5qyh5aSN5Yi25pyA5paw55qEZG9j5YaF5a655Yiw5paw56qX5Y+j5LitXG5cdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdGlmICFfLmlzRW1wdHkoaW5pdGlhbFZhbHVlcylcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fZmllbGRzXCIsIHVuZGVmaW5lZClcblx0XHRTZXNzaW9uLnNldChcImFjdGlvbl9jb2xsZWN0aW9uXCIsIGNvbGxlY3Rpb24pXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fY29sbGVjdGlvbl9uYW1lXCIsIGNvbGxlY3Rpb25fbmFtZSlcblx0XHRTZXNzaW9uLnNldChcImFjdGlvbl9zYXZlX2FuZF9pbnNlcnRcIiwgZmFsc2UpXG5cdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdCQoXCIuY3JlYXRvci1hZGQtcmVsYXRlZFwiKS5jbGljaygpXG5cdFx0cmV0dXJuXG5cblx0Q3JlYXRvci5hY3Rpb25zIFxuXHRcdCMg5Zyo5q2k5a6a5LmJ5YWo5bGAIGFjdGlvbnNcblx0XHRcInN0YW5kYXJkX3F1ZXJ5XCI6ICgpLT5cblx0XHRcdE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKVxuXG5cdFx0XCJzdGFuZGFyZF9uZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0IyBjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0XHQjIGlmIGN1cnJlbnRfcmVjb3JkX2lkXG5cdFx0XHQjIFx0IyBhbWlzIOebuOWFs+WtkOihqOWPs+S4iuinkuaWsOW7ulxuXHRcdFx0IyBcdENyZWF0b3IucmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3KG9iamVjdF9uYW1lKVxuXHRcdFx0IyBcdHJldHVybiBcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcblx0XHRcdGdyaWROYW1lID0gdGhpcy5hY3Rpb24uZ3JpZE5hbWU7XG5cdFx0XHRpc1JlbGF0ZWQgPSB0aGlzLmFjdGlvbi5pc1JlbGF0ZWQ7XG5cdFx0XHRpZiBpc1JlbGF0ZWRcblx0XHRcdFx0cmVsYXRlZEZpZWxkTmFtZSA9IHRoaXMuYWN0aW9uLnJlbGF0ZWRGaWVsZE5hbWU7XG5cdFx0XHRcdG1hc3RlclJlY29yZElkID0gdGhpcy5hY3Rpb24ubWFzdGVyUmVjb3JkSWQ7XG5cdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSB0aGlzLmFjdGlvbi5pbml0aWFsVmFsdWVzXG5cdFx0XHRcdGlmICFpbml0aWFsVmFsdWVzXG5cdFx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IHt9O1xuXHRcdFx0XHRcdGluaXRpYWxWYWx1ZXNbcmVsYXRlZEZpZWxkTmFtZV0gPSBtYXN0ZXJSZWNvcmRJZFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbml0aWFsVmFsdWVzPXt9XG5cdFx0XHRcdGlmKGdyaWROYW1lKVxuXHRcdFx0XHRcdHNlbGVjdGVkUm93cyA9IHdpbmRvdy5ncmlkUmVmcz9bZ3JpZE5hbWVdLmN1cnJlbnQ/LmFwaT8uZ2V0U2VsZWN0ZWRSb3dzKClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHNlbGVjdGVkUm93cyA9IHdpbmRvdy5ncmlkUmVmPy5jdXJyZW50Py5hcGk/LmdldFNlbGVjdGVkUm93cygpXHRcblx0XHRcdFx0XG5cdFx0XHRcdGlmIHNlbGVjdGVkUm93cz8ubGVuZ3RoXG5cdFx0XHRcdFx0cmVjb3JkX2lkID0gc2VsZWN0ZWRSb3dzWzBdLl9pZDtcblx0XHRcdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpbml0aWFsVmFsdWVzID0gRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSlcblxuXHRcdFx0aWYgb2JqZWN0Py52ZXJzaW9uID49IDJcblx0XHRcdFx0cmV0dXJuIFN0ZWVkb3MuUGFnZS5Gb3JtLlN0YW5kYXJkTmV3LnJlbmRlcihTZXNzaW9uLmdldChcImFwcF9pZFwiKSwgb2JqZWN0X25hbWUsIHQoJ05ldycpICsgJyAnICsgb2JqZWN0LmxhYmVsLCBpbml0aWFsVmFsdWVzICwge2dyaWROYW1lOiBncmlkTmFtZX0pO1xuXHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXG5cdFx0XHRpZiBzZWxlY3RlZFJvd3M/Lmxlbmd0aFxuXHRcdFx0XHQjIOWIl+ihqOaciemAieS4remhueaXtu+8jOWPluesrOS4gOS4qumAieS4remhue+8jOWkjeWItuWFtuWGheWuueWIsOaWsOW7uueql+WPo+S4rVxuXHRcdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXG5cdFx0XHRcdCMg4oCc5L+d5a2Y5bm25paw5bu64oCd5pON5L2c5Lit6Ieq5Yqo5omT5byA55qE5paw56qX5Y+j5Lit6ZyA6KaB5YaN5qyh5aSN5Yi25pyA5paw55qEZG9j5YaF5a655Yiw5paw56qX5Y+j5LitXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdCQoXCIuY3JlYXRvci1hZGRcIikuY2xpY2soKVxuXHRcdFx0cmV0dXJuIFxuXG5cdFx0XCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0aHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRGbG93Um91dGVyLnJlZGlyZWN0KGhyZWYpXG5cdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdFwic3RhbmRhcmRfZWRpdFwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuXHRcdFx0XHRpZiBvYmplY3Q/LnZlcnNpb24gPj0gMlxuXHRcdFx0XHRcdHJldHVybiBTdGVlZG9zLlBhZ2UuRm9ybS5TdGFuZGFyZEVkaXQucmVuZGVyKFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpLCBvYmplY3RfbmFtZSwgdCgnRWRpdCcpICsgJyAnICsgb2JqZWN0LmxhYmVsLCByZWNvcmRfaWQsIHtcblx0XHRcdFx0XHRcdGdyaWROYW1lOiB0aGlzLmFjdGlvbi5ncmlkTmFtZVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBmYWxzZVxuI1x0XHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCByZWNvcmRcbiNcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ3JlbG9hZF9keGxpc3QnLCBmYWxzZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkXG5cdFx0XHRcdFx0aWYgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0XHRcdCQoXCIuYnRuLWVkaXQtcmVjb3JkXCIpLmNsaWNrKClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkXG5cdFx0XHRcdFx0aWYgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0XHRcdFx0XHQkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKVxuXG5cdFx0XCJzdGFuZGFyZF9kZWxldGVcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjayktPlxuXHRcdFx0Z3JpZE5hbWUgPSB0aGlzLmFjdGlvbi5ncmlkTmFtZTtcblx0XHRcdCMgY29uc29sZS5sb2coXCI9PT1zdGFuZGFyZF9kZWxldGU9PT1cIiwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKTtcblx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7X2lkOiByZWNvcmRfaWR9KVxuXHRcdFx0XHRpZiAhYmVmb3JlSG9va1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdFx0bmFtZUZpZWxkID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZIHx8IFwibmFtZVwiXG5cblx0XHRcdHVubGVzcyBsaXN0X3ZpZXdfaWRcblx0XHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0XHRcdHVubGVzcyBsaXN0X3ZpZXdfaWRcblx0XHRcdFx0bGlzdF92aWV3X2lkID0gXCJhbGxcIlxuXG5cdFx0XHRpZighXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIHJlY29yZF90aXRsZSlcblx0XHRcdFx0cmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlW25hbWVGaWVsZF1cblx0XHRcdFxuXHRcdFx0aWYgcmVjb3JkICYmICFyZWNvcmRfdGl0bGVcblx0XHRcdFx0cmVjb3JkX3RpdGxlID0gcmVjb3JkW25hbWVGaWVsZF1cblx0XHRcdFxuXHRcdFx0aTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZVwiXG5cdFx0XHRpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiXG5cblx0XHRcdHVubGVzcyByZWNvcmRfaWRcblx0XHRcdFx0aTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RpdGxlXCJcblx0XHRcdFx0aTE4blRleHRLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X3N3YWxfdGV4dFwiXG5cblx0XHRcdFx0IyDlpoLmnpzmmK/mibnph4/liKDpmaTvvIzliJnkvKDlhaXnmoRsaXN0X3ZpZXdfaWTkuLrliJfooajop4blm77nmoRuYW1l77yM55So5LqO6I635Y+W5YiX6KGo6YCJ5Lit6aG5XG5cdFx0XHRcdCMg5Li75YiX6KGo6KeE5YiZ5pivXCJsaXN0dmlld18je29iamVjdF9uYW1lfV8je2xpc3Rfdmlld19pZH1cIu+8jOebuOWFs+ihqOinhOWImeaYr1wicmVsYXRlZF9saXN0dmlld18je29iamVjdF9uYW1lfV8je3JlbGF0ZWRfb2JqZWN0X25hbWV9XyN7cmVsYXRlZF9maWVsZF9uYW1lfVwiXG5cdFx0XHRcdHNlbGVjdGVkUmVjb3JkcyA9IFN0ZWVkb3NVSS5nZXRUYWJsZVNlbGVjdGVkUm93cyhncmlkTmFtZSB8fCBsaXN0X3ZpZXdfaWQpXG5cdFx0XHRcdGlmICFzZWxlY3RlZFJlY29yZHMgfHwgIXNlbGVjdGVkUmVjb3Jkcy5sZW5ndGhcblx0XHRcdFx0XHR0b2FzdHIud2FybmluZyh0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfbm9fc2VsZWN0aW9uXCIpKVxuXHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRpZiByZWNvcmRfdGl0bGVcblx0XHRcdFx0dGV4dCA9IHQgaTE4blRleHRLZXksIFwiI3tvYmplY3QubGFiZWx9IFxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGV4dCA9IHQgaTE4blRleHRLZXksIFwiI3tvYmplY3QubGFiZWx9XCJcblx0XHRcdHN3YWxcblx0XHRcdFx0dGl0bGU6IHQgaTE4blRpdGxlS2V5LCBcIiN7b2JqZWN0LmxhYmVsfVwiXG5cdFx0XHRcdHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+I3t0ZXh0fTwvZGl2PlwiXG5cdFx0XHRcdGh0bWw6IHRydWVcblx0XHRcdFx0c2hvd0NhbmNlbEJ1dHRvbjp0cnVlXG5cdFx0XHRcdGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKVxuXHRcdFx0XHRjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuXHRcdFx0XHQob3B0aW9uKSAtPlxuXHRcdFx0XHRcdGlmIG9wdGlvblxuXHRcdFx0XHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdFx0XHRcdCMg5Y2V5p2h6K6w5b2V5Yig6ZmkXG5cdFx0XHRcdFx0XHRcdF9kZWxldGVSZWNvcmQgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgKCktPlxuXHRcdFx0XHRcdFx0XHRcdCMg5paH5Lu254mI5pys5Li6XCJjZnMuZmlsZXMuZmlsZXJlY29yZFwi77yM6ZyA6KaB5pu/5o2i5Li6XCJjZnMtZmlsZXMtZmlsZXJlY29yZFwiXG5cdFx0XHRcdFx0XHRcdFx0Z3JpZE9iamVjdE5hbWVDbGFzcyA9IG9iamVjdF9uYW1lLnJlcGxhY2UoL1xcLi9nLFwiLVwiKVxuXHRcdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxuXHRcdFx0XHRcdFx0XHRcdHVubGVzcyBncmlkQ29udGFpbmVyPy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRcdGlmIHdpbmRvdy5vcGVuZXJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNPcGVuZXJSZW1vdmUgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxuXHRcdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdFx0IyBPYmplY3RGb3Jt5pyJ57yT5a2Y77yM5Yig6Zmk5a2Q6KGo6K6w5b2V5Y+v6IO95Lya5pyJ5rGH5oC75a2X5q6177yM6ZyA6KaB5Yi35paw6KGo5Y2V5pWw5o2uXG5cdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50X29iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgY3VycmVudF9vYmplY3RfbmFtZSAmJiBDcmVhdG9yLmdldE9iamVjdChjdXJyZW50X29iamVjdF9uYW1lKT8udmVyc2lvbiA+IDFcblx0XHRcdFx0XHRcdFx0XHRcdFx0U3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZClcblx0XHRcdFx0XHRcdFx0XHRcdGlmIEZsb3dSb3V0ZXIuY3VycmVudCgpLnJvdXRlLnBhdGguZW5kc1dpdGgoXCIvOnJlY29yZF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RfbmFtZSAhPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LnJlZnJlc2hHcmlkKGdyaWROYW1lKTtcblx0XHRcdFx0XHRcdFx0XHRjYXRjaCBfZVxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihfZSk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgZ3JpZENvbnRhaW5lcj8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3RyZWVcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpXG5cdFx0XHRcdFx0XHRcdFx0aWYgZHhEYXRhR3JpZEluc3RhbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3RyZWVcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RfbmFtZSAhPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSlcblx0XHRcdFx0XHRcdFx0XHRyZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0XHRcdHRlbXBOYXZSZW1vdmVkID0gQ3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKSAj5peg6K665piv5Zyo6K6w5b2V6K+m57uG55WM6Z2i6L+Y5piv5YiX6KGo55WM6Z2i5omn6KGM5Yig6Zmk5pON5L2c77yM6YO95Lya5oqK5Li05pe25a+86Iiq5Yig6Zmk5o6JXG5cdFx0XHRcdFx0XHRcdFx0aWYgaXNPcGVuZXJSZW1vdmUgb3IgIWR4RGF0YUdyaWRJbnN0YW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNPcGVuZXJSZW1vdmVcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LmNsb3NlKClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpIGFuZCBsaXN0X3ZpZXdfaWQgIT0gJ2NhbGVuZGFyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVubGVzcyB0ZW1wTmF2UmVtb3ZlZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c56Gu5a6e5Yig6Zmk5LqG5Li05pe25a+86Iiq77yM5bCx5Y+v6IO95bey57uP6YeN5a6a5ZCR5Yiw5LiK5LiA5Liq6aG16Z2i5LqG77yM5rKh5b+F6KaB5YaN6YeN5a6a5ZCR5LiA5qyhXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5nbyBcIi9hcHAvI3thcHBpZH0vI3tvYmplY3RfbmFtZX0vZ3JpZC8je2xpc3Rfdmlld19pZH1cIlxuXHRcdFx0XHRcdFx0XHRcdGlmIGNhbGxfYmFjayBhbmQgdHlwZW9mIGNhbGxfYmFjayA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0XHRcdFx0XHRcdGNhbGxfYmFjaygpXHRcdFx0XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdCMg5om56YeP5Yig6ZmkXG5cdFx0XHRcdFx0XHRcdGlmIHNlbGVjdGVkUmVjb3JkcyAmJiBzZWxlY3RlZFJlY29yZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJsb2FkaW5nXCIpXG5cdFx0XHRcdFx0XHRcdFx0ZGVsZXRlQ291bnRlciA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0YWZ0ZXJCYXRjaGVzRGVsZXRlID0gKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlQ291bnRlcisrXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBkZWxldGVDb3VudGVyID49IHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyBjb25zb2xlLmxvZyhcImRlbGV0ZUNvdW50ZXIsIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGg9PT1cIiwgZGVsZXRlQ291bnRlciwgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwibG9hZGluZ1wiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuXHRcdFx0XHRcdFx0XHRcdHNlbGVjdGVkUmVjb3Jkcy5mb3JFYWNoIChyZWNvcmQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZF9pZCA9IHJlY29yZC5faWRcblx0XHRcdFx0XHRcdFx0XHRcdGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtfaWQ6IHJlY29yZF9pZH0pXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAhYmVmb3JlSG9va1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRUaXRsZSA9IHJlY29yZFtuYW1lRmllbGRdIHx8IHJlY29yZF9pZFxuXHRcdFx0XHRcdFx0XHRcdFx0X2RlbGV0ZVJlY29yZCBvYmplY3RfbmFtZSwgcmVjb3JkLl9pZCwgcmVjb3JkVGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCAoKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpICPml6DorrrmmK/lnKjorrDlvZXor6bnu4bnlYzpnaLov5jmmK/liJfooajnlYzpnaLmiafooYzliKDpmaTmk43kvZzvvIzpg73kvJrmiorkuLTml7blr7zoiKrliKDpmaTmjolcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWZ0ZXJCYXRjaGVzRGVsZXRlKClcblx0XHRcdFx0XHRcdFx0XHRcdCksICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0YWZ0ZXJCYXRjaGVzRGVsZXRlKCkiLCJ2YXIgX2RlbGV0ZVJlY29yZDtcblxuQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsYmFjaykge1xuICAgIHZhciBmaWx0ZXJzLCBtb3JlQXJncywgb2JqLCB0b2RvLCB0b2RvQXJncywgdXJsO1xuICAgIGlmIChhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT09ICd3b3JkLXByaW50Jykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBmaWx0ZXJzID0gWydfaWQnLCAnPScsIHJlY29yZF9pZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWx0ZXJzID0gT2JqZWN0R3JpZC5nZXRGaWx0ZXJzKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGZhbHNlLCBudWxsLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIHVybCA9IFwiL2FwaS92NC93b3JkX3RlbXBsYXRlcy9cIiArIGFjdGlvbi53b3JkX3RlbXBsYXRlICsgXCIvcHJpbnRcIiArIFwiP2ZpbHRlcnM9XCIgKyBTdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5KGZpbHRlcnMpO1xuICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMCkge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9kbyA9IGFjdGlvbi50b2RvO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgaXRlbV9lbGVtZW50ID0gaXRlbV9lbGVtZW50ID8gaXRlbV9lbGVtZW50IDogXCJcIjtcbiAgICAgICAgbW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuICAgICAgICB0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpO1xuICAgICAgICByZXR1cm4gdG9kby5hcHBseSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdDogb2JqLFxuICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgIGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50LFxuICAgICAgICAgIHJlY29yZDogcmVjb3JkXG4gICAgICAgIH0sIHRvZG9BcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgfVxuICB9O1xuICBfZGVsZXRlUmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpIHtcbiAgICB2YXIgb2JqZWN0LCBwcmV2aW91c0RvYztcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgcHJldmlvdXNEb2MgPSBGb3JtTWFuYWdlci5nZXRQcmV2aW91c0RvYyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAnZGVsZXRlJyk7XG4gICAgcmV0dXJuIENyZWF0b3Iub2RhdGFbXCJkZWxldGVcIl0ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5mbztcbiAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgaW5mbyA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgKFwiXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKTtcbiAgICAgIH1cbiAgICAgIHRvYXN0ci5zdWNjZXNzKGluZm8pO1xuICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbF9iYWNrKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtcbiAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY1xuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGlmIChjYWxsX2JhY2tfZXJyb3IgJiYgdHlwZW9mIGNhbGxfYmFja19lcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxfYmFja19lcnJvcigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7XG4gICAgICAgIF9pZDogcmVjb3JkX2lkLFxuICAgICAgICBlcnJvcjogZXJyb3JcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyA9IGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgY29sbGVjdGlvbl9uYW1lLCBjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCwgZGVmYXVsdERvYywgZG9jLCBpZHMsIGluaXRpYWxWYWx1ZXMsIHJlY29yZF9pZCwgcmVsYXRlT2JqZWN0O1xuICAgIHJlbGF0ZU9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgIGNvbGxlY3Rpb25fbmFtZSA9IHJlbGF0ZU9iamVjdC5sYWJlbDtcbiAgICBjb2xsZWN0aW9uID0gXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpLl9jb2xsZWN0aW9uX25hbWUpO1xuICAgIGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG4gICAgaWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgaW5pdGlhbFZhbHVlcyA9IHt9O1xuICAgIGlmIChpZHMgIT0gbnVsbCA/IGlkcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgIHJlY29yZF9pZCA9IGlkc1swXTtcbiAgICAgIGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBpbml0aWFsVmFsdWVzID0gZG9jO1xuICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0RG9jID0gRm9ybU1hbmFnZXIuZ2V0UmVsYXRlZEluaXRpYWxWYWx1ZXMoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFfLmlzRW1wdHkoZGVmYXVsdERvYykpIHtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IGRlZmF1bHREb2M7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgocmVsYXRlT2JqZWN0ICE9IG51bGwgPyByZWxhdGVPYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgcmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuICAgICAgICBuYW1lOiByZWxhdGVkX29iamVjdF9uYW1lICsgXCJfc3RhbmRhcmRfbmV3X2Zvcm1cIixcbiAgICAgICAgb2JqZWN0QXBpTmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgdGl0bGU6ICfmlrDlu7ogJyArIHJlbGF0ZU9iamVjdC5sYWJlbCxcbiAgICAgICAgaW5pdGlhbFZhbHVlczogaW5pdGlhbFZhbHVlcyxcbiAgICAgICAgYWZ0ZXJJbnNlcnQ6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkudmVyc2lvbiA+IDEpIHtcbiAgICAgICAgICAgICAgU3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gRmxvd1JvdXRlci5yZWxvYWQoKTtcbiAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSwgbnVsbCwge1xuICAgICAgICBpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghXy5pc0VtcHR5KGluaXRpYWxWYWx1ZXMpKSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgfVxuICAgIH1cbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9maWVsZHNcIiwgdm9pZCAwKTtcbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9jb2xsZWN0aW9uXCIsIGNvbGxlY3Rpb24pO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25fbmFtZVwiLCBjb2xsZWN0aW9uX25hbWUpO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX3NhdmVfYW5kX2luc2VydFwiLCBmYWxzZSk7XG4gICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICQoXCIuY3JlYXRvci1hZGQtcmVsYXRlZFwiKS5jbGljaygpO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmFjdGlvbnMoe1xuICAgIFwic3RhbmRhcmRfcXVlcnlcIjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9uZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgZ3JpZE5hbWUsIGluaXRpYWxWYWx1ZXMsIGlzUmVsYXRlZCwgbWFzdGVyUmVjb3JkSWQsIG9iamVjdCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWxhdGVkRmllbGROYW1lLCBzZWxlY3RlZFJvd3M7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuICAgICAgaXNSZWxhdGVkID0gdGhpcy5hY3Rpb24uaXNSZWxhdGVkO1xuICAgICAgaWYgKGlzUmVsYXRlZCkge1xuICAgICAgICByZWxhdGVkRmllbGROYW1lID0gdGhpcy5hY3Rpb24ucmVsYXRlZEZpZWxkTmFtZTtcbiAgICAgICAgbWFzdGVyUmVjb3JkSWQgPSB0aGlzLmFjdGlvbi5tYXN0ZXJSZWNvcmRJZDtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IHRoaXMuYWN0aW9uLmluaXRpYWxWYWx1ZXM7XG4gICAgICAgIGlmICghaW5pdGlhbFZhbHVlcykge1xuICAgICAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgICAgICBpbml0aWFsVmFsdWVzW3JlbGF0ZWRGaWVsZE5hbWVdID0gbWFzdGVyUmVjb3JkSWQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgICAgaWYgKGdyaWROYW1lKSB7XG4gICAgICAgICAgc2VsZWN0ZWRSb3dzID0gKHJlZiA9IHdpbmRvdy5ncmlkUmVmcykgIT0gbnVsbCA/IChyZWYxID0gcmVmW2dyaWROYW1lXS5jdXJyZW50KSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmFwaSkgIT0gbnVsbCA/IHJlZjIuZ2V0U2VsZWN0ZWRSb3dzKCkgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZWN0ZWRSb3dzID0gKHJlZjMgPSB3aW5kb3cuZ3JpZFJlZikgIT0gbnVsbCA/IChyZWY0ID0gcmVmMy5jdXJyZW50KSAhPSBudWxsID8gKHJlZjUgPSByZWY0LmFwaSkgIT0gbnVsbCA/IHJlZjUuZ2V0U2VsZWN0ZWRSb3dzKCkgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGVkUm93cyAhPSBudWxsID8gc2VsZWN0ZWRSb3dzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgIHJlY29yZF9pZCA9IHNlbGVjdGVkUm93c1swXS5faWQ7XG4gICAgICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICAgICAgaW5pdGlhbFZhbHVlcyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbml0aWFsVmFsdWVzID0gRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICgob2JqZWN0ICE9IG51bGwgPyBvYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgICByZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmROZXcucmVuZGVyKFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpLCBvYmplY3RfbmFtZSwgdCgnTmV3JykgKyAnICcgKyBvYmplY3QubGFiZWwsIGluaXRpYWxWYWx1ZXMsIHtcbiAgICAgICAgICBncmlkTmFtZTogZ3JpZE5hbWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKHNlbGVjdGVkUm93cyAhPSBudWxsID8gc2VsZWN0ZWRSb3dzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICB9XG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBGbG93Um91dGVyLnJlZGlyZWN0KGhyZWYpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9lZGl0XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIGlmIChyZWNvcmRfaWQpIHtcbiAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgICBpZiAoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0LnZlcnNpb24gOiB2b2lkIDApID49IDIpIHtcbiAgICAgICAgICByZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmRFZGl0LnJlbmRlcihTZXNzaW9uLmdldChcImFwcF9pZFwiKSwgb2JqZWN0X25hbWUsIHQoJ0VkaXQnKSArICcgJyArIG9iamVjdC5sYWJlbCwgcmVjb3JkX2lkLCB7XG4gICAgICAgICAgICBncmlkTmFtZTogdGhpcy5hY3Rpb24uZ3JpZE5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlKSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9kZWxldGVcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKSB7XG4gICAgICB2YXIgYmVmb3JlSG9vaywgZ3JpZE5hbWUsIGkxOG5UZXh0S2V5LCBpMThuVGl0bGVLZXksIG5hbWVGaWVsZCwgb2JqZWN0LCBzZWxlY3RlZFJlY29yZHMsIHRleHQ7XG4gICAgICBncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghYmVmb3JlSG9vaykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgbmFtZUZpZWxkID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZIHx8IFwibmFtZVwiO1xuICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgICB9XG4gICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICBsaXN0X3ZpZXdfaWQgPSBcImFsbFwiO1xuICAgICAgfVxuICAgICAgaWYgKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZVtuYW1lRmllbGRdO1xuICAgICAgfVxuICAgICAgaWYgKHJlY29yZCAmJiAhcmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZFtuYW1lRmllbGRdO1xuICAgICAgfVxuICAgICAgaTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZVwiO1xuICAgICAgaTE4blRleHRLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIjtcbiAgICAgIGlmICghcmVjb3JkX2lkKSB7XG4gICAgICAgIGkxOG5UaXRsZUtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90aXRsZVwiO1xuICAgICAgICBpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90ZXh0XCI7XG4gICAgICAgIHNlbGVjdGVkUmVjb3JkcyA9IFN0ZWVkb3NVSS5nZXRUYWJsZVNlbGVjdGVkUm93cyhncmlkTmFtZSB8fCBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICBpZiAoIXNlbGVjdGVkUmVjb3JkcyB8fCAhc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgIHRvYXN0ci53YXJuaW5nKHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9ub19zZWxlY3Rpb25cIikpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICB0ZXh0ID0gdChpMThuVGV4dEtleSwgb2JqZWN0LmxhYmVsICsgXCIgXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IHQoaTE4blRleHRLZXksIFwiXCIgKyBvYmplY3QubGFiZWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN3YWwoe1xuICAgICAgICB0aXRsZTogdChpMThuVGl0bGVLZXksIFwiXCIgKyBvYmplY3QubGFiZWwpLFxuICAgICAgICB0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPlwiICsgdGV4dCArIFwiPC9kaXY+XCIsXG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKSxcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcbiAgICAgIH0sIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB2YXIgYWZ0ZXJCYXRjaGVzRGVsZXRlLCBkZWxldGVDb3VudGVyO1xuICAgICAgICBpZiAob3B0aW9uKSB7XG4gICAgICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICAgICAgcmV0dXJuIF9kZWxldGVSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciBfZSwgYXBwaWQsIGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkLCBkeERhdGFHcmlkSW5zdGFuY2UsIGdyaWRDb250YWluZXIsIGdyaWRPYmplY3ROYW1lQ2xhc3MsIGlzT3BlbmVyUmVtb3ZlLCByZWNvcmRVcmwsIHJlZiwgdGVtcE5hdlJlbW92ZWQ7XG4gICAgICAgICAgICAgIGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZywgXCItXCIpO1xuICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgIGlmICghKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XG4gICAgICAgICAgICAgICAgICBpc09wZW5lclJlbW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgICAgICAgICAgICAgY3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudF9vYmplY3RfbmFtZSAmJiAoKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLnZlcnNpb24gOiB2b2lkIDApID4gMSkge1xuICAgICAgICAgICAgICAgICAgU3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChGbG93Um91dGVyLmN1cnJlbnQoKS5yb3V0ZS5wYXRoLmVuZHNXaXRoKFwiLzpyZWNvcmRfaWRcIikpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RfbmFtZSAhPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgICAgX2UgPSBlcnJvcjE7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihfZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RfbmFtZSAhPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgVGVtcGxhdGUuY3JlYXRvcl9ncmlkLnJlZnJlc2goZHhEYXRhR3JpZEluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICAgICAgICAgIHRlbXBOYXZSZW1vdmVkID0gQ3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKTtcbiAgICAgICAgICAgICAgaWYgKGlzT3BlbmVyUmVtb3ZlIHx8ICFkeERhdGFHcmlkSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUpIHtcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSAmJiBsaXN0X3ZpZXdfaWQgIT09ICdjYWxlbmRhcicpIHtcbiAgICAgICAgICAgICAgICAgIGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gICAgICAgICAgICAgICAgICBpZiAoIXRlbXBOYXZSZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwL1wiICsgYXBwaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChjYWxsX2JhY2sgJiYgdHlwZW9mIGNhbGxfYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxfYmFjaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkUmVjb3JkcyAmJiBzZWxlY3RlZFJlY29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwibG9hZGluZ1wiKTtcbiAgICAgICAgICAgICAgZGVsZXRlQ291bnRlciA9IDA7XG4gICAgICAgICAgICAgIGFmdGVyQmF0Y2hlc0RlbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZUNvdW50ZXIrKztcbiAgICAgICAgICAgICAgICBpZiAoZGVsZXRlQ291bnRlciA+PSBzZWxlY3RlZFJlY29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImxvYWRpbmdcIik7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnJlZnJlc2hHcmlkKGdyaWROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHJldHVybiBzZWxlY3RlZFJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVjb3JkVGl0bGU7XG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkID0gcmVjb3JkLl9pZDtcbiAgICAgICAgICAgICAgICBiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICghYmVmb3JlSG9vaykge1xuICAgICAgICAgICAgICAgICAgYWZ0ZXJCYXRjaGVzRGVsZXRlKCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlY29yZFRpdGxlID0gcmVjb3JkW25hbWVGaWVsZF0gfHwgcmVjb3JkX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBfZGVsZXRlUmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmQuX2lkLCByZWNvcmRUaXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHZhciByZWNvcmRVcmw7XG4gICAgICAgICAgICAgICAgICByZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgICAgICAgICAgIENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gYWZ0ZXJCYXRjaGVzRGVsZXRlKCk7XG4gICAgICAgICAgICAgICAgfSksIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyQmF0Y2hlc0RlbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
