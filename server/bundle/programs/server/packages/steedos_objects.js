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
      built_in_plugins: ["@steedos/webapp-public", "@steedos/service-ui", "@steedos/service-cachers-manager", "@steedos/unpkg", "@steedos/workflow", "@steedos/accounts", "@steedos/plugin-company", "@steedos/metadata-api", "@steedos/data-import", "@steedos/service-accounts", "@steedos/service-charts", "@steedos/service-pages", "@steedos/service-cloud-init", "@steedos/service-package-registry", "@steedos/webapp-accounts", "@steedos/service-workflow", "@steedos/service-plugin-amis", "@steedos/ee_unpkg-local"],
      plugins: config.plugins
    };
    Meteor.startup(function () {
      var apiService, broker, ex, metadataService, projectService, standardObjectsDir, standardObjectsPackageLoaderService;

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
        return Steedos.Page.Form.StandardNew.render(Session.get("app_id"), object_name, '新建 ' + object.label, initialValues, {
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
          return Steedos.Page.Form.StandardEdit.render(Session.get("app_id"), object_name, '编辑 ' + object.label, record_id, {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiQVBJU2VydmljZSIsIk1ldGFkYXRhU2VydmljZSIsImNvbmZpZyIsImUiLCJtb2xlY3VsZXIiLCJvYmplY3RxbCIsInBhY2thZ2VMb2FkZXIiLCJwYWNrYWdlU2VydmljZSIsInBhdGgiLCJzZXR0aW5ncyIsInN0ZWVkb3NDb3JlIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJyZXF1aXJlIiwiZ2V0U3RlZWRvc0NvbmZpZyIsImJ1aWx0X2luX3BsdWdpbnMiLCJwbHVnaW5zIiwiTWV0ZW9yIiwic3RhcnR1cCIsImFwaVNlcnZpY2UiLCJicm9rZXIiLCJleCIsIm1ldGFkYXRhU2VydmljZSIsInByb2plY3RTZXJ2aWNlIiwic3RhbmRhcmRPYmplY3RzRGlyIiwic3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UiLCJTZXJ2aWNlQnJva2VyIiwibmFtZXNwYWNlIiwibm9kZUlEIiwibWV0YWRhdGEiLCJ0cmFuc3BvcnRlciIsIlRSQU5TUE9SVEVSIiwiY2FjaGVyIiwiQ0FDSEVSIiwibG9nTGV2ZWwiLCJzZXJpYWxpemVyIiwicmVxdWVzdFRpbWVvdXQiLCJtYXhDYWxsTGV2ZWwiLCJoZWFydGJlYXRJbnRlcnZhbCIsImhlYXJ0YmVhdFRpbWVvdXQiLCJjb250ZXh0UGFyYW1zQ2xvbmluZyIsInRyYWNraW5nIiwiZW5hYmxlZCIsInNodXRkb3duVGltZW91dCIsImRpc2FibGVCYWxhbmNlciIsInJlZ2lzdHJ5Iiwic3RyYXRlZ3kiLCJwcmVmZXJMb2NhbCIsImJ1bGtoZWFkIiwiY29uY3VycmVuY3kiLCJtYXhRdWV1ZVNpemUiLCJ2YWxpZGF0b3IiLCJlcnJvckhhbmRsZXIiLCJ0cmFjaW5nIiwiZXhwb3J0ZXIiLCJ0eXBlIiwib3B0aW9ucyIsImxvZ2dlciIsImNvbG9ycyIsIndpZHRoIiwiZ2F1Z2VXaWR0aCIsInNraXBQcm9jZXNzRXZlbnRSZWdpc3RyYXRpb24iLCJjcmVhdGVTZXJ2aWNlIiwibmFtZSIsIm1peGlucyIsInBvcnQiLCJnZXRTdGVlZG9zU2NoZW1hIiwiU3RhbmRhcmRPYmplY3RzUGF0aCIsInBhY2thZ2VJbmZvIiwid3JhcEFzeW5jIiwiY2IiLCJzdGFydCIsInRoZW4iLCJzdGFydGVkIiwiX3Jlc3RhcnRTZXJ2aWNlIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwiZXhwcmVzcyIsIndhaXRGb3JTZXJ2aWNlcyIsInJlc29sdmUiLCJyZWplY3QiLCJpbml0IiwiZXJyb3IiLCJjb25zb2xlIiwiRmliZXIiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJsaXN0X3ZpZXdzIiwic3BhY2UiLCJnZXRDb2xsZWN0aW9uTmFtZSIsIl8iLCJjbG9uZSIsImNvbnZlcnRPYmplY3QiLCJPYmplY3QiLCJpbml0VHJpZ2dlcnMiLCJpbml0TGlzdFZpZXdzIiwiZ2V0T2JqZWN0TmFtZSIsImdldE9iamVjdCIsInNwYWNlX2lkIiwicmVmIiwicmVmMSIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJvYmplY3RzQnlOYW1lIiwiZ2V0T2JqZWN0QnlJZCIsIm9iamVjdF9pZCIsImZpbmRXaGVyZSIsIl9pZCIsInJlbW92ZU9iamVjdCIsImxvZyIsImdldENvbGxlY3Rpb24iLCJzcGFjZUlkIiwiX2NvbGxlY3Rpb25fbmFtZSIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiZmllbGRzIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsImlzU3RyaW5nIiwiRm9ybXVsYXIiLCJjaGVja0Zvcm11bGEiLCJldmFsdWF0ZUZpbHRlcnMiLCJmaWx0ZXJzIiwic2VsZWN0b3IiLCJlYWNoIiwiZmlsdGVyIiwiYWN0aW9uIiwidmFsdWUiLCJsZW5ndGgiLCJpc0NvbW1vblNwYWNlIiwiZ2V0T3JkZXJseVNldEJ5SWRzIiwiZG9jcyIsImlkcyIsImlkX2tleSIsImhpdF9maXJzdCIsInZhbHVlcyIsImdldFByb3BlcnR5Iiwic29ydEJ5IiwiZG9jIiwiX2luZGV4Iiwic29ydGluZ01ldGhvZCIsInZhbHVlMSIsInZhbHVlMiIsImlzVmFsdWUxRW1wdHkiLCJpc1ZhbHVlMkVtcHR5IiwibG9jYWxlIiwia2V5IiwiRGF0ZSIsImdldFRpbWUiLCJTdGVlZG9zIiwidG9TdHJpbmciLCJsb2NhbGVDb21wYXJlIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfb2JqZWN0IiwicGVybWlzc2lvbnMiLCJyZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0TWFwIiwicmVsYXRlZF9vYmplY3RzIiwiaXNFbXB0eSIsIm9iak5hbWUiLCJpc09iamVjdCIsIm9iamVjdE5hbWUiLCJyZWxhdGVkX29iamVjdCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwicmVmZXJlbmNlX3RvIiwiZm9yZWlnbl9rZXkiLCJ3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCIsImVuYWJsZU9iak5hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJlbmFibGVfZmlsZXMiLCJwdXNoIiwic2ZzRmlsZXNPYmplY3QiLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImVuYWJsZV9hcHByb3ZhbHMiLCJlbmFibGVfcHJvY2VzcyIsImdldFVzZXJDb250ZXh0IiwiaXNVblNhZmVNb2RlIiwiVVNFUl9DT05URVhUIiwic3BhY2VfdXNlcl9vcmciLCJzdSIsInN1RmllbGRzIiwiRXJyb3IiLCJtb2JpbGUiLCJwb3NpdGlvbiIsImVtYWlsIiwiY29tcGFueSIsIm9yZ2FuaXphdGlvbiIsImNvbXBhbnlfaWQiLCJjb21wYW55X2lkcyIsInVzZXIiLCJmdWxsbmFtZSIsImdldFJlbGF0aXZlVXJsIiwidXJsIiwiaXNGdW5jdGlvbiIsImlzQ29yZG92YSIsInN0YXJ0c1dpdGgiLCJ0ZXN0IiwiX19tZXRlb3JfcnVudGltZV9jb25maWdfXyIsIlJPT1RfVVJMX1BBVEhfUFJFRklYIiwiZ2V0VXNlckNvbXBhbnlJZCIsImdldFVzZXJDb21wYW55SWRzIiwicHJvY2Vzc1Blcm1pc3Npb25zIiwicG8iLCJhbGxvd0NyZWF0ZSIsImFsbG93UmVhZCIsImFsbG93RWRpdCIsImFsbG93RGVsZXRlIiwidmlld0FsbFJlY29yZHMiLCJ2aWV3Q29tcGFueVJlY29yZHMiLCJtb2RpZnlDb21wYW55UmVjb3JkcyIsImFsbG93UmVhZEZpbGVzIiwidmlld0FsbEZpbGVzIiwiYWxsb3dDcmVhdGVGaWxlcyIsImFsbG93RWRpdEZpbGVzIiwiYWxsb3dEZWxldGVGaWxlcyIsIm1vZGlmeUFsbEZpbGVzIiwiZ2V0VGVtcGxhdGVTcGFjZUlkIiwidGVtcGxhdGVTcGFjZUlkIiwiZ2V0Q2xvdWRBZG1pblNwYWNlSWQiLCJjbG91ZEFkbWluU3BhY2VJZCIsImlzVGVtcGxhdGVTcGFjZSIsImlzQ2xvdWRBZG1pblNwYWNlIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsIm9wdGlvbnNfbGltaXQiLCJxdWVyeSIsInF1ZXJ5X29wdGlvbnMiLCJyZWNvcmRzIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsInBhcmFtcyIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJmaWx0ZXJRdWVyeSIsImxpbWl0IiwiZmluZCIsImZldGNoIiwicmVjb3JkIiwibGFiZWwiLCJtZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm94IiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJmbG93SWQiLCJoYXNoRGF0YSIsImlucyIsImluc0lkIiwicmVjb3JkX2lkIiwicmVkaXJlY3RfdXJsIiwicmVmMiIsInJlZjMiLCJyZWY0Iiwid29ya2Zsb3dVcmwiLCJ4X2F1dGhfdG9rZW4iLCJ4X3VzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsImJvZHkiLCJjaGVjayIsImluc3RhbmNlSWQiLCJmbG93IiwiaW5ib3hfdXNlcnMiLCJpbmNsdWRlcyIsImNjX3VzZXJzIiwib3V0Ym94X3VzZXJzIiwic3RhdGUiLCJzdWJtaXR0ZXIiLCJhcHBsaWNhbnQiLCJwZXJtaXNzaW9uTWFuYWdlciIsImdldEZsb3dQZXJtaXNzaW9ucyIsInNwYWNlcyIsIndlYnNlcnZpY2VzIiwid29ya2Zsb3ciLCJzZW5kUmVzdWx0IiwiY29kZSIsImRhdGEiLCJ1cGRhdGUiLCIkdW5zZXQiLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJnZXRJbml0V2lkdGhQZXJjZW50IiwiY29sdW1ucyIsIl9zY2hlbWEiLCJjb2x1bW5fbnVtIiwiaW5pdF93aWR0aF9wZXJjZW50IiwiZ2V0U2NoZW1hIiwiZmllbGRfbmFtZSIsImZpZWxkIiwiaXNfd2lkZSIsInBpY2siLCJhdXRvZm9ybSIsImdldEZpZWxkSXNXaWRlIiwiZ2V0VGFidWxhck9yZGVyIiwibGlzdF92aWV3X2lkIiwic2V0dGluZyIsIm1hcCIsImNvbHVtbiIsImhpZGRlbiIsImNvbXBhY3QiLCJvcmRlciIsImluZGV4IiwiZGVmYXVsdF9leHRyYV9jb2x1bW5zIiwiZXh0cmFfY29sdW1ucyIsImdldE9iamVjdERlZmF1bHRDb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyIsInVuaW9uIiwiZ2V0T2JqZWN0RGVmYXVsdFNvcnQiLCJUYWJ1bGFyU2VsZWN0ZWRJZHMiLCJjb252ZXJ0TGlzdFZpZXciLCJkZWZhdWx0X3ZpZXciLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfbmFtZSIsImRlZmF1bHRfY29sdW1ucyIsImRlZmF1bHRfbW9iaWxlX2NvbHVtbnMiLCJvaXRlbSIsIm1vYmlsZV9jb2x1bW5zIiwiaGFzIiwiaW5jbHVkZSIsImZpbHRlcl9zY29wZSIsInBhcnNlIiwiZm9yRWFjaCIsIl92YWx1ZSIsImdldFJlbGF0ZWRMaXN0IiwibGF5b3V0UmVsYXRlZExpc3QiLCJsaXN0IiwibWFwTGlzdCIsIm9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyIsInJlbGF0ZWRMaXN0TmFtZXMiLCJyZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInVucmVsYXRlZF9vYmplY3RzIiwicmVsYXRlZF9saXN0cyIsIml0ZW0iLCJyZUZpZWxkTmFtZSIsInJlT2JqZWN0TmFtZSIsInJlbGF0ZWQiLCJyZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lIiwic3BsaXQiLCJmaWVsZF9uYW1lcyIsImlzX2ZpbGUiLCJjdXN0b21SZWxhdGVkTGlzdE9iamVjdCIsImFjdGlvbnMiLCJidXR0b25zIiwidmlzaWJsZV9vbiIsInBhZ2Vfc2l6ZSIsIm9iak9yTmFtZSIsImdldFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfaXRlbSIsInJlbGF0ZWRPYmplY3QiLCJ0YWJ1bGFyX29yZGVyIiwiZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMiLCJ3aXRob3V0IiwidHJhbnNmb3JtU29ydFRvVGFidWxhciIsInJlcGxhY2UiLCJwbHVjayIsImRpZmZlcmVuY2UiLCJ2IiwiaXNBY3RpdmUiLCJhbGxvd19yZWxhdGVkTGlzdCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJmaXJzdCIsImdldExpc3RWaWV3cyIsImdldExpc3RWaWV3IiwiZXhhYyIsImxpc3RWaWV3cyIsImdldExpc3RWaWV3SXNSZWNlbnQiLCJsaXN0VmlldyIsInBpY2tPYmplY3RNb2JpbGVDb2x1bW5zIiwiY291bnQiLCJnZXRGaWVsZCIsImlzTmFtZUNvbHVtbiIsIml0ZW1Db3VudCIsIm1heENvdW50IiwibWF4Um93cyIsIm5hbWVDb2x1bW4iLCJuYW1lS2V5IiwicmVzdWx0IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJSZWdFeHAiLCJfcmVnRXhNZXNzYWdlcyIsIl9nbG9iYWxNZXNzYWdlcyIsInJlZ0V4IiwiZXhwIiwibXNnIiwibWVzc2FnZXMiLCJldmFsSW5Db250ZXh0IiwianMiLCJldmFsIiwiY2FsbCIsImNvbnZlcnRGaWVsZCIsImdldE9wdGlvbiIsIm9wdGlvbiIsImZvbyIsImNvbG9yIiwiYWxsT3B0aW9ucyIsInBpY2tsaXN0IiwicGlja2xpc3RPcHRpb25zIiwiZ2V0UGlja2xpc3QiLCJnZXRQaWNrTGlzdE9wdGlvbnMiLCJyZXZlcnNlIiwiZW5hYmxlIiwiZGVmYXVsdFZhbHVlIiwidHJpZ2dlcnMiLCJ0cmlnZ2VyIiwiX3RvZG8iLCJfdG9kb19mcm9tX2NvZGUiLCJfdG9kb19mcm9tX2RiIiwib24iLCJ0b2RvIiwic3lzdGVtQmFzZUZpZWxkcyIsIm9taXQiLCJyZXF1aXJlZCIsInJlYWRvbmx5IiwiZ2V0U3lzdGVtQmFzZUZpZWxkcyIsIl92aXNpYmxlIiwiZXJyb3IxIiwiYWN0aW9uc0J5TmFtZSIsInRyaW0iLCJpc0V4cHJlc3Npb24iLCJ2aXNpYmxlIiwicmVjb3JkX3Blcm1pc3Npb25zIiwiZ2xvYmFsRGF0YSIsImFzc2lnbiIsIm5vdyIsInBhcnNlU2luZ2xlRXhwcmVzc2lvbiIsIl9vcHRpb25zIiwiX3R5cGUiLCJiZWZvcmVPcGVuRnVuY3Rpb24iLCJpc19jb21wYW55X2xpbWl0ZWQiLCJtYXgiLCJtaW4iLCJfb3B0aW9uIiwiayIsIl9yZWdFeCIsIl9taW4iLCJfbWF4IiwiTnVtYmVyIiwiQm9vbGVhbiIsIl9vcHRpb25zRnVuY3Rpb24iLCJfcmVmZXJlbmNlX3RvIiwiX2NyZWF0ZUZ1bmN0aW9uIiwiX2JlZm9yZU9wZW5GdW5jdGlvbiIsIl9maWx0ZXJzRnVuY3Rpb24iLCJfZGVmYXVsdFZhbHVlIiwiX2lzX2NvbXBhbnlfbGltaXRlZCIsIl9maWx0ZXJzIiwiaXNEYXRlIiwicG9wIiwiX2lzX2RhdGUiLCJmb3JtIiwidmFsIiwicmVsYXRlZE9iakluZm8iLCJQUkVGSVgiLCJfcHJlcGVuZFByZWZpeEZvckZvcm11bGEiLCJwcmVmaXgiLCJmaWVsZFZhcmlhYmxlIiwicmVnIiwicmV2IiwibSIsIiQxIiwiZm9ybXVsYV9zdHIiLCJfQ09OVEVYVCIsIl9WQUxVRVMiLCJpc0Jvb2xlYW4iLCJ0b2FzdHIiLCJmb3JtYXRPYmplY3ROYW1lIiwiX2Jhc2VPYmplY3QiLCJfZGIiLCJkZWZhdWx0TGlzdFZpZXdJZCIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJzY2hlbWEiLCJzZWxmIiwiYmFzZU9iamVjdCIsInBlcm1pc3Npb25fc2V0IiwiaWNvbiIsImRlc2NyaXB0aW9uIiwiaXNfdmlldyIsInZlcnNpb24iLCJpc19lbmFibGUiLCJhbGxvd19jdXN0b21BY3Rpb25zIiwiZXhjbHVkZV9hY3Rpb25zIiwiZW5hYmxlX3NlYXJjaCIsInBhZ2luZyIsImVuYWJsZV9hcGkiLCJjdXN0b20iLCJlbmFibGVfc2hhcmUiLCJlbmFibGVfdHJlZSIsInNpZGViYXIiLCJvcGVuX3dpbmRvdyIsImZpbHRlcl9jb21wYW55IiwiY2FsZW5kYXIiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJlbmFibGVfZm9sbG93IiwiZW5hYmxlX3dvcmtmbG93IiwiZW5hYmxlX2lubGluZV9lZGl0IiwiZGV0YWlscyIsIm1hc3RlcnMiLCJsb29rdXBfZGV0YWlscyIsImluX2RldmVsb3BtZW50IiwiaWRGaWVsZE5hbWUiLCJkYXRhYmFzZV9uYW1lIiwiaXNfbmFtZSIsInByaW1hcnkiLCJmaWx0ZXJhYmxlIiwiaXRlbV9uYW1lIiwiY29weUl0ZW0iLCJhZG1pbiIsImFsbCIsImxpc3Rfdmlld19pdGVtIiwiUmVhY3RpdmVWYXIiLCJjcmVhdGVDb2xsZWN0aW9uIiwiX25hbWUiLCJnZXRPYmplY3RTY2hlbWEiLCJjb250YWlucyIsImF0dGFjaFNjaGVtYSIsIl9zaW1wbGVTY2hlbWEiLCJnZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCIsImJvb3RzdHJhcExvYWRlZCIsImdldFNlbGVjdE9wdGlvbnMiLCJmaWVsZFNjaGVtYSIsImRhdGFfdHlwZSIsIm9wdGlvbkl0ZW0iLCJmaWVsZHNBcnIiLCJfcmVmX29iaiIsImF1dG9mb3JtX3R5cGUiLCJjb2xsZWN0aW9uTmFtZSIsImZzIiwiZnNUeXBlIiwiaXNVbkxpbWl0ZWQiLCJtdWx0aXBsZSIsInJvd3MiLCJsYW5ndWFnZSIsImlzTW9iaWxlIiwiaXNQYWQiLCJpc2lPUyIsImFmRmllbGRJbnB1dCIsInRpbWV6b25lSWQiLCJkeERhdGVCb3hPcHRpb25zIiwiZGlzcGxheUZvcm1hdCIsInBpY2tlclR5cGUiLCJkYXRlTW9iaWxlT3B0aW9ucyIsIm91dEZvcm1hdCIsInNob3dJY29uIiwiZGVwZW5kT24iLCJkZXBlbmRfb24iLCJjcmVhdGUiLCJsb29rdXBfZmllbGQiLCJNb2RhbCIsInNob3ciLCJmb3JtSWQiLCJvcGVyYXRpb24iLCJvblN1Y2Nlc3MiLCJhZGRJdGVtcyIsInJlZmVyZW5jZV9zb3J0Iiwib3B0aW9uc1NvcnQiLCJyZWZlcmVuY2VfbGltaXQiLCJvcHRpb25zTGltaXQiLCJyZWZlcmVuY2VfdG9fZmllbGQiLCJyZWZlcmVuY2VUb0ZpZWxkIiwiYmxhY2tib3giLCJvYmplY3RTd2l0Y2hlIiwib3B0aW9uc01ldGhvZCIsIm9wdGlvbnNNZXRob2RQYXJhbXMiLCJyZWZlcmVuY2VzIiwiX3JlZmVyZW5jZSIsImxpbmsiLCJkZWZhdWx0SWNvbiIsImZpcnN0T3B0aW9uIiwiZGVjaW1hbCIsInByZWNpc2lvbiIsInNjYWxlIiwiZGlzYWJsZWQiLCJBcnJheSIsImVkaXRhYmxlIiwiYWNjZXB0Iiwic3lzdGVtIiwiRW1haWwiLCJpc051bWJlciIsIm9wdGlvbmFsIiwidW5pcXVlIiwiZ3JvdXAiLCJzZWFyY2hhYmxlIiwiaW5saW5lSGVscFRleHQiLCJpc1Byb2R1Y3Rpb24iLCJzb3J0YWJsZSIsImdldEZpZWxkRGlzcGxheVZhbHVlIiwiZmllbGRfdmFsdWUiLCJodG1sIiwibW9tZW50IiwiZm9ybWF0IiwiY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5IiwiZmllbGRfdHlwZSIsInB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyIsIm9wZXJhdGlvbnMiLCJidWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJidWlsdGluSXRlbSIsImlzX2NoZWNrX29ubHkiLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMiLCJnZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSIsImdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uIiwiYmV0d2VlbkJ1aWx0aW5WYWx1ZXMiLCJnZXRRdWFydGVyU3RhcnRNb250aCIsIm1vbnRoIiwiZ2V0TW9udGgiLCJnZXRMYXN0UXVhcnRlckZpcnN0RGF5IiwieWVhciIsImdldEZ1bGxZZWFyIiwiZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSIsImdldE1vbnRoRGF5cyIsImRheXMiLCJlbmREYXRlIiwibWlsbGlzZWNvbmQiLCJzdGFydERhdGUiLCJnZXRMYXN0TW9udGhGaXJzdERheSIsImN1cnJlbnRNb250aCIsImN1cnJlbnRZZWFyIiwiZW5kVmFsdWUiLCJmaXJzdERheSIsImxhc3REYXkiLCJsYXN0TW9uZGF5IiwibGFzdE1vbnRoRmluYWxEYXkiLCJsYXN0TW9udGhGaXJzdERheSIsImxhc3RRdWFydGVyRW5kRGF5IiwibGFzdFF1YXJ0ZXJTdGFydERheSIsImxhc3RTdW5kYXkiLCJsYXN0XzEyMF9kYXlzIiwibGFzdF8zMF9kYXlzIiwibGFzdF82MF9kYXlzIiwibGFzdF83X2RheXMiLCJsYXN0XzkwX2RheXMiLCJtaW51c0RheSIsIm1vbmRheSIsIm5leHRNb25kYXkiLCJuZXh0TW9udGhGaW5hbERheSIsIm5leHRNb250aEZpcnN0RGF5IiwibmV4dFF1YXJ0ZXJFbmREYXkiLCJuZXh0UXVhcnRlclN0YXJ0RGF5IiwibmV4dFN1bmRheSIsIm5leHRZZWFyIiwibmV4dF8xMjBfZGF5cyIsIm5leHRfMzBfZGF5cyIsIm5leHRfNjBfZGF5cyIsIm5leHRfN19kYXlzIiwibmV4dF85MF9kYXlzIiwicHJldmlvdXNZZWFyIiwic3RhcnRWYWx1ZSIsInN0ckVuZERheSIsInN0ckZpcnN0RGF5Iiwic3RyTGFzdERheSIsInN0ck1vbmRheSIsInN0clN0YXJ0RGF5Iiwic3RyU3VuZGF5Iiwic3RyVG9kYXkiLCJzdHJUb21vcnJvdyIsInN0clllc3RkYXkiLCJzdW5kYXkiLCJ0aGlzUXVhcnRlckVuZERheSIsInRoaXNRdWFydGVyU3RhcnREYXkiLCJ0b21vcnJvdyIsIndlZWsiLCJ5ZXN0ZGF5IiwiZ2V0RGF5IiwidCIsImZ2Iiwic2V0SG91cnMiLCJnZXRIb3VycyIsImdldFRpbWV6b25lT2Zmc2V0IiwiZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uIiwiZ2V0RmllbGRPcGVyYXRpb24iLCJvcHRpb25hbHMiLCJlcXVhbCIsInVuZXF1YWwiLCJsZXNzX3RoYW4iLCJncmVhdGVyX3RoYW4iLCJsZXNzX29yX2VxdWFsIiwiZ3JlYXRlcl9vcl9lcXVhbCIsIm5vdF9jb250YWluIiwic3RhcnRzX3dpdGgiLCJiZXR3ZWVuIiwiZ2V0T2JqZWN0RmllbGRzTmFtZSIsImZpZWxkc05hbWUiLCJzb3J0X25vIiwiY2xlYW5UcmlnZ2VyIiwiaW5pdFRyaWdnZXIiLCJfdHJpZ2dlcl9ob29rcyIsInJlZjUiLCJ0b2RvV3JhcHBlciIsImFwcGx5IiwiYXJndW1lbnRzIiwid2hlbiIsImJlZm9yZSIsImluc2VydCIsInJlbW92ZSIsImFmdGVyIiwiX2hvb2siLCJ0cmlnZ2VyX25hbWUiLCJfdHJpZ2dlcl9ob29rIiwiYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzIiwiZXh0ZW5kUGVybWlzc2lvblByb3BzIiwiZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCIsImZpbmRfcGVybWlzc2lvbl9vYmplY3QiLCJpbnRlcnNlY3Rpb25QbHVzIiwib3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzIiwib3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzIiwicGVybWlzc2lvblByb3BOYW1lcyIsInVuaW9uUGVybWlzc2lvbk9iamVjdHMiLCJ1bmlvblBsdXMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImdldFJlY29yZFBlcm1pc3Npb25zIiwiaXNPd25lciIsIm1hc3Rlck9iamVjdE5hbWUiLCJtYXN0ZXJSZWNvcmRQZXJtIiwicmVjb3JkX2NvbXBhbnlfaWQiLCJyZWNvcmRfY29tcGFueV9pZHMiLCJ1c2VyX2NvbXBhbnlfaWRzIiwib3duZXIiLCJwYXJlbnQiLCJuIiwiaW50ZXJzZWN0aW9uIiwibG9ja2VkIiwiZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyIsImN1cnJlbnRPYmplY3ROYW1lIiwicmVsYXRlZExpc3RJdGVtIiwiY3VycmVudFJlY29yZCIsImlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSIsIm1hc3RlckFsbG93IiwicmVsYXRlZE9iamVjdFBlcm1pc3Npb25zIiwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QiLCJnZXRPYmplY3RSZWNvcmQiLCJnZXRSZWNvcmRTYWZlUmVsYXRlZExpc3QiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIl9pIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwic3BhY2VVc2VyIiwib2JqZWN0cyIsImFzc2lnbmVkX2FwcHMiLCJwcm9maWxlIiwidXNlcnMiLCJwZXJtaXNzaW9uX3NldF9pZCIsImNyZWF0ZWQiLCJtb2RpZmllZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZF9ieSIsImdldEFzc2lnbmVkQXBwcyIsImJpbmQiLCJhc3NpZ25lZF9tZW51cyIsImdldEFzc2lnbmVkTWVudXMiLCJ1c2VyX3Blcm1pc3Npb25fc2V0cyIsImFycmF5Iiwib3RoZXIiLCJ0YXJnZXQiLCJwcm9wcyIsImZpbGVzUHJvTmFtZXMiLCJwcm9wTmFtZXMiLCJwcm9wTmFtZSIsImFwcHMiLCJwc2V0QmFzZSIsInVzZXJQcm9maWxlIiwicHNldCIsInVuaXEiLCJhYm91dE1lbnUiLCJhZG1pbk1lbnVzIiwiYWxsTWVudXMiLCJjdXJyZW50UHNldE5hbWVzIiwibWVudXMiLCJvdGhlck1lbnVBcHBzIiwib3RoZXJNZW51cyIsImFkbWluX21lbnVzIiwiZmxhdHRlbiIsIm1lbnUiLCJwc2V0c01lbnUiLCJwZXJtaXNzaW9uX3NldHMiLCJwZXJtaXNzaW9uX29iamVjdHMiLCJpc051bGwiLCJwZXJtaXNzaW9uX3NldF9pZHMiLCJwb3MiLCJvcHMiLCJvcHNfa2V5IiwiY3VycmVudFBzZXQiLCJ0ZW1wT3BzIiwicmVwZWF0SW5kZXgiLCJyZXBlYXRQbyIsIm9wc2V0QWRtaW4iLCJvcHNldEN1c3RvbWVyIiwib3BzZXRHdWVzdCIsIm9wc2V0TWVtYmVyIiwib3BzZXRTdXBwbGllciIsIm9wc2V0VXNlciIsInBvc0FkbWluIiwicG9zQ3VzdG9tZXIiLCJwb3NHdWVzdCIsInBvc01lbWJlciIsInBvc1N1cHBsaWVyIiwicG9zVXNlciIsInByb2YiLCJndWVzdCIsIm1lbWJlciIsInN1cHBsaWVyIiwiY3VzdG9tZXIiLCJkaXNhYmxlZF9hY3Rpb25zIiwidW5yZWFkYWJsZV9maWVsZHMiLCJ1bmVkaXRhYmxlX2ZpZWxkcyIsImNyZWF0b3JfZGJfdXJsIiwib3Bsb2dfdXJsIiwiTU9OR09fVVJMX0NSRUFUT1IiLCJNT05HT19PUExPR19VUkxfQ1JFQVRPUiIsIl9DUkVBVE9SX0RBVEFTT1VSQ0UiLCJfZHJpdmVyIiwiTW9uZ29JbnRlcm5hbHMiLCJSZW1vdGVDb2xsZWN0aW9uRHJpdmVyIiwib3Bsb2dVcmwiLCJjb2xsZWN0aW9uX2tleSIsIm5ld0NvbGxlY3Rpb24iLCJTTVNRdWV1ZSIsIl9kZWxldGVSZWNvcmQiLCJhY3Rpb25fbmFtZSIsImV4ZWN1dGVBY3Rpb24iLCJpdGVtX2VsZW1lbnQiLCJjYWxsYmFjayIsIm1vcmVBcmdzIiwidG9kb0FyZ3MiLCJPYmplY3RHcmlkIiwiZ2V0RmlsdGVycyIsIndvcmRfdGVtcGxhdGUiLCJTdGVlZG9zRmlsdGVycyIsImZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkiLCJhYnNvbHV0ZVVybCIsIndpbmRvdyIsIm9wZW4iLCJvZGF0YSIsInByb3RvdHlwZSIsInNsaWNlIiwiY29uY2F0Iiwid2FybmluZyIsInJlY29yZF90aXRsZSIsImNhbGxfYmFjayIsImNhbGxfYmFja19lcnJvciIsInByZXZpb3VzRG9jIiwiRm9ybU1hbmFnZXIiLCJnZXRQcmV2aW91c0RvYyIsImluZm8iLCJzdWNjZXNzIiwicnVuSG9vayIsInJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyIsImNvbGxlY3Rpb25fbmFtZSIsImN1cnJlbnRfb2JqZWN0X25hbWUiLCJjdXJyZW50X3JlY29yZF9pZCIsImRlZmF1bHREb2MiLCJpbml0aWFsVmFsdWVzIiwicmVsYXRlT2JqZWN0Iiwic2V0IiwiZ2V0UmVsYXRlZEluaXRpYWxWYWx1ZXMiLCJTdGVlZG9zVUkiLCJzaG93TW9kYWwiLCJzdG9yZXMiLCJDb21wb25lbnRSZWdpc3RyeSIsImNvbXBvbmVudHMiLCJPYmplY3RGb3JtIiwib2JqZWN0QXBpTmFtZSIsInRpdGxlIiwiYWZ0ZXJJbnNlcnQiLCJzZXRUaW1lb3V0IiwicmVsb2FkUmVjb3JkIiwiRmxvd1JvdXRlciIsInJlbG9hZCIsImljb25QYXRoIiwiZGVmZXIiLCIkIiwiY2xpY2siLCJncmlkTmFtZSIsImlzUmVsYXRlZCIsIm1hc3RlclJlY29yZElkIiwicmVsYXRlZEZpZWxkTmFtZSIsInNlbGVjdGVkUm93cyIsImdyaWRSZWZzIiwiY3VycmVudCIsImFwaSIsImdldFNlbGVjdGVkUm93cyIsImdyaWRSZWYiLCJnZXRJbml0aWFsVmFsdWVzIiwiUGFnZSIsIkZvcm0iLCJTdGFuZGFyZE5ldyIsInJlbmRlciIsImhyZWYiLCJnZXRPYmplY3RVcmwiLCJyZWRpcmVjdCIsIlN0YW5kYXJkRWRpdCIsImJlZm9yZUhvb2siLCJpMThuVGV4dEtleSIsImkxOG5UaXRsZUtleSIsIm5hbWVGaWVsZCIsInNlbGVjdGVkUmVjb3JkcyIsInRleHQiLCJnZXRUYWJsZVNlbGVjdGVkUm93cyIsInN3YWwiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY29uZmlybUJ1dHRvblRleHQiLCJjYW5jZWxCdXR0b25UZXh0IiwiYWZ0ZXJCYXRjaGVzRGVsZXRlIiwiZGVsZXRlQ291bnRlciIsIl9lIiwiYXBwaWQiLCJkeERhdGFHcmlkSW5zdGFuY2UiLCJncmlkQ29udGFpbmVyIiwiZ3JpZE9iamVjdE5hbWVDbGFzcyIsImlzT3BlbmVyUmVtb3ZlIiwicmVjb3JkVXJsIiwidGVtcE5hdlJlbW92ZWQiLCJvcGVuZXIiLCJyb3V0ZSIsImVuZHNXaXRoIiwicmVmcmVzaEdyaWQiLCJkeFRyZWVMaXN0IiwiZHhEYXRhR3JpZCIsInJlZnJlc2giLCJUZW1wbGF0ZSIsImNyZWF0b3JfZ3JpZCIsInJlbW92ZVRlbXBOYXZJdGVtIiwiY2xvc2UiLCJnbyIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJyZWNvcmRUaXRsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsS0FBQ0EsRUFBRCxHQUFNLEVBQU47O0FBQ0EsSUFBSSxPQUFBQyxPQUFBLG9CQUFBQSxZQUFBLElBQUo7QUFDQyxPQUFDQSxPQUFELEdBQVcsRUFBWDtBQ0VBOztBREREQSxRQUFRQyxPQUFSLEdBQWtCLEVBQWxCO0FBQ0FELFFBQVFFLFdBQVIsR0FBc0IsRUFBdEI7QUFDQUYsUUFBUUcsS0FBUixHQUFnQixFQUFoQjtBQUNBSCxRQUFRSSxJQUFSLEdBQWUsRUFBZjtBQUNBSixRQUFRSyxVQUFSLEdBQXFCLEVBQXJCO0FBQ0FMLFFBQVFNLE9BQVIsR0FBa0IsRUFBbEI7QUFDQU4sUUFBUU8sSUFBUixHQUFlLEVBQWY7QUFDQVAsUUFBUVEsYUFBUixHQUF3QixFQUF4QixDOzs7Ozs7Ozs7Ozs7QUVWQSxJQUFBQyxVQUFBLEVBQUFDLGVBQUEsRUFBQUMsTUFBQSxFQUFBQyxDQUFBLEVBQUFDLFNBQUEsRUFBQUMsUUFBQSxFQUFBQyxhQUFBLEVBQUFDLGNBQUEsRUFBQUMsSUFBQSxFQUFBQyxRQUFB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LFdBQUE7QUFBQW5zQiw0QkFBWWpCLE9BQU96SixHQUFuQjtBQUNBMDBCLDZCQUFhbEQsWUFBWUksT0FBWixDQUFvQnR6QixXQUFwQixFQUFpQyxRQUFqQyxFQUEyQyxRQUEzQyxFQUFxRDtBQUFDMEIsdUJBQUswSztBQUFOLGlCQUFyRCxDQUFiOztBQUNBLG9CQUFHLENBQUNncUIsVUFBSjtBQUNDVztBQUNBO0FDd0NPOztBRHZDUndCLDhCQUFjcHRCLE9BQU9vckIsU0FBUCxLQUFxQm5xQixTQUFuQztBQ3lDTyx1QkR4Q1BzbEIsY0FBYzF4QixXQUFkLEVBQTJCbUwsT0FBT3pKLEdBQWxDLEVBQXVDNjJCLFdBQXZDLEVBQW9EcHBCLFlBQXBELEVBQWtFaEUsTUFBbEUsRUFBMkU7QUFDMUUsc0JBQUFvc0IsU0FBQTtBQUFBQSw4QkFBWTErQixRQUFRbzlCLFlBQVIsQ0FBcUJqMkIsV0FBckIsRUFBa0NvTSxTQUFsQyxDQUFaO0FBQ0F2VCwwQkFBUXEvQixpQkFBUixDQUEwQmw0QixXQUExQixFQUF1Q3UzQixTQUF2QztBQzBDUSx5QkR6Q1JSLG9CQ3lDUTtBRDVDaUUsaUJBQTFFLEVBSUc7QUMwQ00seUJEekNSQSxvQkN5Q1E7QUQ5Q1Qsa0JDd0NPO0FEL0NSLGdCQ29DTTtBRC9GUjtBQUREO0FDc0hJO0FEOUhOLFFDcUJHO0FEM0lKO0FBQUEsR0FGRDtBQzBQQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJAZGIgPSB7fVxuaWYgIUNyZWF0b3I/XG5cdEBDcmVhdG9yID0ge31cbkNyZWF0b3IuT2JqZWN0cyA9IHt9XG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge31cbkNyZWF0b3IuTWVudXMgPSBbXVxuQ3JlYXRvci5BcHBzID0ge31cbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9XG5DcmVhdG9yLlJlcG9ydHMgPSB7fVxuQ3JlYXRvci5zdWJzID0ge31cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9IiwidGhpcy5kYiA9IHt9O1xuXG5pZiAodHlwZW9mIENyZWF0b3IgPT09IFwidW5kZWZpbmVkXCIgfHwgQ3JlYXRvciA9PT0gbnVsbCkge1xuICB0aGlzLkNyZWF0b3IgPSB7fTtcbn1cblxuQ3JlYXRvci5PYmplY3RzID0ge307XG5cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fTtcblxuQ3JlYXRvci5NZW51cyA9IFtdO1xuXG5DcmVhdG9yLkFwcHMgPSB7fTtcblxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge307XG5cbkNyZWF0b3IuUmVwb3J0cyA9IHt9O1xuXG5DcmVhdG9yLnN1YnMgPSB7fTtcblxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge307XG4iLCJ0cnlcblx0aWYgcHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnXG5cdFx0c3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcblx0XHRvYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJylcblx0XHRtb2xlY3VsZXIgPSByZXF1aXJlKFwibW9sZWN1bGVyXCIpO1xuXHRcdHBhY2thZ2VMb2FkZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGVvci1wYWNrYWdlLWxvYWRlcicpO1xuXHRcdEFQSVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLWFwaScpO1xuXHRcdE1ldGFkYXRhU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0YWRhdGEtc2VydmVyJyk7XG5cdFx0cGFja2FnZVNlcnZpY2UgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIpO1xuXHRcdHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXHRcdGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcblx0XHRzZXR0aW5ncyA9IHtcblx0XHRcdGJ1aWx0X2luX3BsdWdpbnM6IFtcblx0XHRcdFx0XCJAc3RlZWRvcy93ZWJhcHAtcHVibGljXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS11aVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2FjaGVycy1tYW5hZ2VyXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvdW5wa2dcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93b3JrZmxvd1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL2FjY291bnRzXCIsXG5cdFx0XHRcdCMgXCJAc3RlZWRvcy9zdGVlZG9zLXBsdWdpbi1zY2hlbWEtYnVpbGRlclwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3BsdWdpbi1jb21wYW55XCIsXG5cdFx0XHRcdCMgXCJAc3RlZWRvcy9wbHVnaW4tanNyZXBvcnRcIixcblx0XHRcdFx0IyBcIkBzdGVlZG9zL3dvcmQtdGVtcGxhdGVcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9tZXRhZGF0YS1hcGlcIixcblx0XHRcdFx0IyBcIkBzdGVlZG9zL3BsdWdpbi1kaW5ndGFsa1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL2RhdGEtaW1wb3J0XCIsXG5cdFx0XHRcdCMgXCJAc3RlZWRvcy9zZXJ2aWNlLWZpZWxkcy1pbmRleHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWFjY291bnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1jaGFydHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1jbG91ZC1pbml0XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIsXG5cdFx0XHRcdCMgXCJAc3RlZWRvcy9zdGFuZGFyZC1wcm9jZXNzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvd2ViYXBwLWFjY291bnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS13b3JrZmxvd1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtcGx1Z2luLWFtaXNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9lZV91bnBrZy1sb2NhbFwiXG5cdFx0XHRdLFxuXHRcdFx0cGx1Z2luczogY29uZmlnLnBsdWdpbnNcblx0XHR9XG5cdFx0TWV0ZW9yLnN0YXJ0dXAgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuXHRcdFx0XHRcdG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG5cdFx0XHRcdFx0bm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuXHRcdFx0XHRcdG1ldGFkYXRhOiB7fSxcblx0XHRcdFx0XHR0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG5cdFx0XHRcdFx0Y2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG5cdFx0XHRcdFx0bG9nTGV2ZWw6IFwid2FyblwiLFxuXHRcdFx0XHRcdHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuXHRcdFx0XHRcdHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG5cdFx0XHRcdFx0bWF4Q2FsbExldmVsOiAxMDAsXG5cblx0XHRcdFx0XHRoZWFydGJlYXRJbnRlcnZhbDogMTAsXG5cdFx0XHRcdFx0aGVhcnRiZWF0VGltZW91dDogMzAsXG5cblx0XHRcdFx0XHRjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG5cblx0XHRcdFx0XHR0cmFja2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaHV0ZG93blRpbWVvdXQ6IDUwMDAsXG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG5cblx0XHRcdFx0XHRyZWdpc3RyeToge1xuXHRcdFx0XHRcdFx0c3RyYXRlZ3k6IFwiUm91bmRSb2JpblwiLFxuXHRcdFx0XHRcdFx0cHJlZmVyTG9jYWw6IHRydWVcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0YnVsa2hlYWQ6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0Y29uY3VycmVuY3k6IDEwLFxuXHRcdFx0XHRcdFx0bWF4UXVldWVTaXplOiAxMDAsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR2YWxpZGF0b3I6IHRydWUsXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBudWxsLFxuXHRcdFx0XHRcdHRyYWNpbmc6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZXhwb3J0ZXI6IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJDb25zb2xlXCIsXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0XHRsb2dnZXI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3JzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0XHRcdFx0Z2F1Z2VXaWR0aDogNDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2tpcFByb2Nlc3NFdmVudFJlZ2lzdHJhdGlvbjogdHJ1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHRcdHByb2plY3RTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6IFwicHJvamVjdC1zZXJ2ZXJcIixcblx0XHRcdFx0XHRuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuXHRcdFx0XHRcdG1peGluczogW3BhY2thZ2VTZXJ2aWNlXSxcblx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHRtZXRhZGF0YVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogJ21ldGFkYXRhLXNlcnZlcicsXG5cdFx0XHRcdFx0bWl4aW5zOiBbTWV0YWRhdGFTZXJ2aWNlXSxcblx0XHRcdFx0XHRzZXR0aW5nczoge1xuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGFwaVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogXCJhcGlcIixcblx0XHRcdFx0XHRtaXhpbnM6IFtBUElTZXJ2aWNlXSxcblx0XHRcdFx0XHRzZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0cG9ydDogbnVsbFxuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdG9iamVjdHFsLmdldFN0ZWVkb3NTY2hlbWEoYnJva2VyKTtcblx0XHRcdFx0c3RhbmRhcmRPYmplY3RzRGlyID0gb2JqZWN0cWwuU3RhbmRhcmRPYmplY3RzUGF0aDtcblx0XHRcdFx0c3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogJ3N0YW5kYXJkLW9iamVjdHMnLFxuXHRcdFx0XHRcdG1peGluczogW3BhY2thZ2VMb2FkZXJdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7IHBhY2thZ2VJbmZvOiB7XG5cdFx0XHRcdFx0XHRwYXRoOiBzdGFuZGFyZE9iamVjdHNEaXIsXG5cdFx0XHRcdFx0fSB9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdE1ldGVvci53cmFwQXN5bmMoKGNiKS0+XG5cdFx0XHRcdFx0YnJva2VyLnN0YXJ0KCkudGhlbigoKS0+XG5cdFx0XHRcdFx0XHRpZiAhYnJva2VyLnN0YXJ0ZWQgXG5cdFx0XHRcdFx0XHRcdGJyb2tlci5fcmVzdGFydFNlcnZpY2Uoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UpO1xuXG5cdFx0XHRcdFx0XHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShcIi9cIiwgYXBpU2VydmljZS5leHByZXNzKCkpO1xuXHRcdFx0XHRcdFx0IyBzdGVlZG9zQ29yZS5pbml0KHNldHRpbmdzKS50aGVuICgpLT5cblx0XHRcdFx0XHRcdCMgXHRjYigpO1xuXG5cdFx0XHRcdFx0XHRicm9rZXIud2FpdEZvclNlcnZpY2VzKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlLm5hbWUpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cblx0XHRcdFx0XHRcdFx0c3RlZWRvc0NvcmUuaW5pdChzZXR0aW5ncykudGhlbiAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSgpXG5cdFx0XHRjYXRjaCBleFxuXHRcdFx0XHRjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsZXgpXG5jYXRjaCBlXG5cdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixlKSIsInZhciBBUElTZXJ2aWNlLCBNZXRhZGF0YVNlcnZpY2UsIGNvbmZpZywgZSwgbW9sZWN1bGVyLCBvYmplY3RxbCwgcGFja2FnZUxvYWRlciwgcGFja2FnZVNlcnZpY2UsIHBhdGgsIHNldHRpbmdzLCBzdGVlZG9zQ29yZTtcblxudHJ5IHtcbiAgaWYgKHByb2Nlc3MuZW52LkNSRUFUT1JfTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBzdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcbiAgICBvYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XG4gICAgbW9sZWN1bGVyID0gcmVxdWlyZShcIm1vbGVjdWxlclwiKTtcbiAgICBwYWNrYWdlTG9hZGVyID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRlb3ItcGFja2FnZS1sb2FkZXInKTtcbiAgICBBUElTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1hcGknKTtcbiAgICBNZXRhZGF0YVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGFkYXRhLXNlcnZlcicpO1xuICAgIHBhY2thZ2VTZXJ2aWNlID0gcmVxdWlyZShcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS1yZWdpc3RyeVwiKTtcbiAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgIGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcbiAgICBzZXR0aW5ncyA9IHtcbiAgICAgIGJ1aWx0X2luX3BsdWdpbnM6IFtcIkBzdGVlZG9zL3dlYmFwcC1wdWJsaWNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXVpXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1jYWNoZXJzLW1hbmFnZXJcIiwgXCJAc3RlZWRvcy91bnBrZ1wiLCBcIkBzdGVlZG9zL3dvcmtmbG93XCIsIFwiQHN0ZWVkb3MvYWNjb3VudHNcIiwgXCJAc3RlZWRvcy9wbHVnaW4tY29tcGFueVwiLCBcIkBzdGVlZG9zL21ldGFkYXRhLWFwaVwiLCBcIkBzdGVlZG9zL2RhdGEtaW1wb3J0XCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtY2hhcnRzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1wYWdlc1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtY2xvdWQtaW5pdFwiLCBcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS1yZWdpc3RyeVwiLCBcIkBzdGVlZG9zL3dlYmFwcC1hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2Utd29ya2Zsb3dcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBsdWdpbi1hbWlzXCIsIFwiQHN0ZWVkb3MvZWVfdW5wa2ctbG9jYWxcIl0sXG4gICAgICBwbHVnaW5zOiBjb25maWcucGx1Z2luc1xuICAgIH07XG4gICAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXBpU2VydmljZSwgYnJva2VyLCBleCwgbWV0YWRhdGFTZXJ2aWNlLCBwcm9qZWN0U2VydmljZSwgc3RhbmRhcmRPYmplY3RzRGlyLCBzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGJyb2tlciA9IG5ldyBtb2xlY3VsZXIuU2VydmljZUJyb2tlcih7XG4gICAgICAgICAgbmFtZXNwYWNlOiBcInN0ZWVkb3NcIixcbiAgICAgICAgICBub2RlSUQ6IFwic3RlZWRvcy1jcmVhdG9yXCIsXG4gICAgICAgICAgbWV0YWRhdGE6IHt9LFxuICAgICAgICAgIHRyYW5zcG9ydGVyOiBwcm9jZXNzLmVudi5UUkFOU1BPUlRFUixcbiAgICAgICAgICBjYWNoZXI6IHByb2Nlc3MuZW52LkNBQ0hFUixcbiAgICAgICAgICBsb2dMZXZlbDogXCJ3YXJuXCIsXG4gICAgICAgICAgc2VyaWFsaXplcjogXCJKU09OXCIsXG4gICAgICAgICAgcmVxdWVzdFRpbWVvdXQ6IDYwICogMTAwMCxcbiAgICAgICAgICBtYXhDYWxsTGV2ZWw6IDEwMCxcbiAgICAgICAgICBoZWFydGJlYXRJbnRlcnZhbDogMTAsXG4gICAgICAgICAgaGVhcnRiZWF0VGltZW91dDogMzAsXG4gICAgICAgICAgY29udGV4dFBhcmFtc0Nsb25pbmc6IGZhbHNlLFxuICAgICAgICAgIHRyYWNraW5nOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIHNodXRkb3duVGltZW91dDogNTAwMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGlzYWJsZUJhbGFuY2VyOiBmYWxzZSxcbiAgICAgICAgICByZWdpc3RyeToge1xuICAgICAgICAgICAgc3RyYXRlZ3k6IFwiUm91bmRSb2JpblwiLFxuICAgICAgICAgICAgcHJlZmVyTG9jYWw6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJ1bGtoZWFkOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmN1cnJlbmN5OiAxMCxcbiAgICAgICAgICAgIG1heFF1ZXVlU2l6ZTogMTAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB2YWxpZGF0b3I6IHRydWUsXG4gICAgICAgICAgZXJyb3JIYW5kbGVyOiBudWxsLFxuICAgICAgICAgIHRyYWNpbmc6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgZXhwb3J0ZXI6IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJDb25zb2xlXCIsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBsb2dnZXI6IG51bGwsXG4gICAgICAgICAgICAgICAgY29sb3JzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgICAgICAgZ2F1Z2VXaWR0aDogNDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2tpcFByb2Nlc3NFdmVudFJlZ2lzdHJhdGlvbjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgcHJvamVjdFNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogXCJwcm9qZWN0LXNlcnZlclwiLFxuICAgICAgICAgIG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG4gICAgICAgICAgbWl4aW5zOiBbcGFja2FnZVNlcnZpY2VdXG4gICAgICAgIH0pO1xuICAgICAgICBtZXRhZGF0YVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogJ21ldGFkYXRhLXNlcnZlcicsXG4gICAgICAgICAgbWl4aW5zOiBbTWV0YWRhdGFTZXJ2aWNlXSxcbiAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgfSk7XG4gICAgICAgIGFwaVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogXCJhcGlcIixcbiAgICAgICAgICBtaXhpbnM6IFtBUElTZXJ2aWNlXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcG9ydDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9iamVjdHFsLmdldFN0ZWVkb3NTY2hlbWEoYnJva2VyKTtcbiAgICAgICAgc3RhbmRhcmRPYmplY3RzRGlyID0gb2JqZWN0cWwuU3RhbmRhcmRPYmplY3RzUGF0aDtcbiAgICAgICAgc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogJ3N0YW5kYXJkLW9iamVjdHMnLFxuICAgICAgICAgIG1peGluczogW3BhY2thZ2VMb2FkZXJdLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbzoge1xuICAgICAgICAgICAgICBwYXRoOiBzdGFuZGFyZE9iamVjdHNEaXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihjYikge1xuICAgICAgICAgIHJldHVybiBicm9rZXIuc3RhcnQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFicm9rZXIuc3RhcnRlZCkge1xuICAgICAgICAgICAgICBicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKFwiL1wiLCBhcGlTZXJ2aWNlLmV4cHJlc3MoKSk7XG4gICAgICAgICAgICByZXR1cm4gYnJva2VyLndhaXRGb3JTZXJ2aWNlcyhzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZS5uYW1lKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gc3RlZWRvc0NvcmUuaW5pdChzZXR0aW5ncykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4ID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgZSA9IGVycm9yO1xuICBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGUpO1xufVxuIiwiQ3JlYXRvci5kZXBzID0ge1xuXHRhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcblx0b2JqZWN0OiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG59O1xuXG5DcmVhdG9yLl9URU1QTEFURSA9IHtcblx0QXBwczoge30sXG5cdE9iamVjdHM6IHt9XG59XG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcblxuIyBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMg5L6bc3RlZWRvcy1jbGnpobnnm67kvb/nlKhcbmlmIE1ldGVvci5pc1NlcnZlclxuXHRGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpXG5cdENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XG5cdFx0RmliZXIoKCktPlxuXHRcdFx0Q3JlYXRvci5sb2FkT2JqZWN0cyhvYmosIG9iamVjdF9uYW1lKVxuXHRcdCkucnVuKClcblxuQ3JlYXRvci5sb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gb2JqLm5hbWVcblxuXHRpZiAhb2JqLmxpc3Rfdmlld3Ncblx0XHRvYmoubGlzdF92aWV3cyA9IHt9XG5cblx0aWYgb2JqLnNwYWNlXG5cdFx0b2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iailcblx0aWYgb2JqZWN0X25hbWUgPT0gJ2Nmc19maWxlc19maWxlcmVjb3JkJ1xuXHRcdG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xuXHRcdG9iaiA9IF8uY2xvbmUob2JqKVxuXHRcdG9iai5uYW1lID0gb2JqZWN0X25hbWVcblx0XHRDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqXG5cblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iailcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG5cblx0Q3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcblx0cmV0dXJuIG9ialxuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxuXHRpZiBvYmplY3Quc3BhY2Vcblx0XHRyZXR1cm4gXCJjXyN7b2JqZWN0LnNwYWNlfV8je29iamVjdC5uYW1lfVwiXG5cdHJldHVybiBvYmplY3QubmFtZVxuXG5DcmVhdG9yLmdldE9iamVjdCA9IChvYmplY3RfbmFtZSwgc3BhY2VfaWQpLT5cblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxuXHRcdHJldHVybiA7XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG4jXHRpZiAhc3BhY2VfaWQgJiYgb2JqZWN0X25hbWVcbiNcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50ICYmICFvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjXycpXG4jXHRcdFx0c3BhY2VfaWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblxuXHRpZiBvYmplY3RfbmFtZVxuI1x0XHRpZiBzcGFjZV9pZFxuI1x0XHRcdG9iaiA9IENyZWF0b3Iub2JqZWN0c0J5TmFtZVtcImNfI3tzcGFjZV9pZH1fI3tvYmplY3RfbmFtZX1cIl1cbiNcdFx0XHRpZiBvYmpcbiNcdFx0XHRcdHJldHVybiBvYmpcbiNcbiNcdFx0b2JqID0gXy5maW5kIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG8pLT5cbiNcdFx0XHRcdHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT0gb2JqZWN0X25hbWVcbiNcdFx0aWYgb2JqXG4jXHRcdFx0cmV0dXJuIG9ialxuXG5cdFx0cmV0dXJuIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gKG9iamVjdF9pZCktPlxuXHRyZXR1cm4gXy5maW5kV2hlcmUoQ3JlYXRvci5vYmplY3RzQnlOYW1lLCB7X2lkOiBvYmplY3RfaWR9KVxuXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IChvYmplY3RfbmFtZSktPlxuXHRjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSlcblx0ZGVsZXRlIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0ZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkKS0+XG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRpZiBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW0NyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uX2NvbGxlY3Rpb25fbmFtZSB8fCBvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5yZW1vdmVDb2xsZWN0aW9uID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXVxuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRzcGFjZSA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpPy5kYj8uZmluZE9uZShzcGFjZUlkLHtmaWVsZHM6e2FkbWluczoxfX0pXG5cdGlmIHNwYWNlPy5hZG1pbnNcblx0XHRyZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwXG5cblxuQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEgPSAoZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpLT5cblxuXHRpZiAhXy5pc1N0cmluZyhmb3JtdWxhcilcblx0XHRyZXR1cm4gZm9ybXVsYXJcblxuXHRpZiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmb3JtdWxhcilcblx0XHRyZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpXG5cblx0cmV0dXJuIGZvcm11bGFyXG5cbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGNvbnRleHQpLT5cblx0c2VsZWN0b3IgPSB7fVxuXHRfLmVhY2ggZmlsdGVycywgKGZpbHRlciktPlxuXHRcdGlmIGZpbHRlcj8ubGVuZ3RoID09IDNcblx0XHRcdG5hbWUgPSBmaWx0ZXJbMF1cblx0XHRcdGFjdGlvbiA9IGZpbHRlclsxXVxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpXG5cdFx0XHRzZWxlY3RvcltuYW1lXSA9IHt9XG5cdFx0XHRzZWxlY3RvcltuYW1lXVthY3Rpb25dID0gdmFsdWVcblx0IyBjb25zb2xlLmxvZyhcImV2YWx1YXRlRmlsdGVycy0tPnNlbGVjdG9yXCIsIHNlbGVjdG9yKVxuXHRyZXR1cm4gc2VsZWN0b3JcblxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gKHNwYWNlSWQpIC0+XG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXG5cbiMjI1xuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4jIyNcbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpLT5cblxuXHRpZiAhaWRfa2V5XG5cdFx0aWRfa2V5ID0gXCJfaWRcIlxuXG5cdGlmIGhpdF9maXJzdFxuXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcblx0XHR2YWx1ZXMgPSBkb2NzLmdldFByb3BlcnR5KGlkX2tleSlcblxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0XHRcdF9pbmRleCA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXHRcdFx0XHRcdGlmIF9pbmRleCA+IC0xXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSlcblx0ZWxzZVxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0cmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXG4jIyNcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuIyMjXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSAodmFsdWUxLCB2YWx1ZTIpIC0+XG5cdGlmIHRoaXMua2V5XG5cdFx0dmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XVxuXHRcdHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV1cblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKClcblx0aWYgdmFsdWUyIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcblx0aWYgdHlwZW9mIHZhbHVlMSBpcyBcIm51bWJlclwiIGFuZCB0eXBlb2YgdmFsdWUyIGlzIFwibnVtYmVyXCJcblx0XHRyZXR1cm4gdmFsdWUxIC0gdmFsdWUyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcblx0aXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PSBudWxsIG9yIHZhbHVlMSA9PSB1bmRlZmluZWRcblx0aXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PSBudWxsIG9yIHZhbHVlMiA9PSB1bmRlZmluZWRcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gLTFcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAwXG5cdGlmICFpc1ZhbHVlMUVtcHR5IGFuZCBpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIDFcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxuXHRyZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSB2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlXG5cblxuIyDor6Xlh73mlbDlj6rlnKjliJ3lp4vljJZPYmplY3Tml7bvvIzmiornm7jlhbPlr7nosaHnmoTorqHnrpfnu5Pmnpzkv53lrZjliLBPYmplY3TnmoRyZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3vvIzlkI7nu63lj6/ku6Xnm7TmjqXku45yZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3lj5blvpforqHnrpfnu5PmnpzogIzkuI3nlKjlho3mrKHosIPnlKjor6Xlh73mlbDmnaXorqHnrpdcbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRyZWxhdGVkX29iamVjdHMgPSBbXVxuXHQjIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXG5cdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGlmICFfb2JqZWN0XG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXHRcblx0cmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0XG5cdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XG5cdFx0cmVsYXRlZExpc3RNYXAgPSB7fVxuXHRcdF8uZWFjaCByZWxhdGVkTGlzdCwgKG9iak5hbWUpLT5cblx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqTmFtZVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtvYmpOYW1lLm9iamVjdE5hbWVdID0ge31cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fVxuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxuXHRcdFx0XHRpZiAocmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lIGFuZCByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdFx0XHRcdCMg5b2TcmVsYXRlZF9vYmplY3QuZmllbGRz5Lit5pyJ5Lik5Liq5oiW5Lul5LiK55qE5a2X5q615oyH5ZCRb2JqZWN0X25hbWXooajnpLrnmoTlr7nosaHml7bvvIzkvJjlhYjlj5bnrKzkuIDkuKrkvZzkuLrlpJbplK7lhbPns7vlrZfmrrXvvIzkvYbmmK9yZWxhdGVkX2ZpZWxk5Li65Li75a2Q6KGo5pe25by66KGM6KaG55uW5LmL5YmN55qEcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV3lgLxcblx0XHRcdFx0XHRpZiBfLmlzRW1wdHkgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gfHwgcmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHsgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIH1cblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ11cblx0XHRcdHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHsgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiIH1cblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ11cblx0XHRcdHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSA9IHsgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIiB9XG5cdFx0Xy5lYWNoIFsndGFza3MnLCAnbm90ZXMnLCAnZXZlbnRzJywgJ2FwcHJvdmFscyddLCAoZW5hYmxlT2JqTmFtZSktPlxuXHRcdFx0aWYgcmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV1cblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0gPSB7IG9iamVjdF9uYW1lOiBlbmFibGVPYmpOYW1lLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCIgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ11cblx0XHRcdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4Fcblx0XHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSlcblx0XHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7IG9iamVjdF9uYW1lOlwiYXVkaXRfcmVjb3Jkc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCIgfVxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IF8udmFsdWVzIHJlbGF0ZWRMaXN0TWFwXG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG5cdGlmIF9vYmplY3QuZW5hYmxlX2ZpbGVzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiY21zX2ZpbGVzXCIsIGZvcmVpZ25fa2V5OiBcInBhcmVudFwifVxuXG5cdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXG5cdFx0XHQjIGNmcy5maWxlcy5maWxlcmVjb3Jk5a+56LGh5Zyo56ys5LqM5qyh54K55Ye755qE5pe25YCZcmVsYXRlZF9vYmplY3Tov5Tlm57nmoTmmK9hcHAtYnVpbGRlcuS4reeahFwibWV0YWRhdGEucGFyZW50XCLlrZfmrrXooqvliKDpmaTkuobvvIzorrDliLBtZXRhZGF0YeWtl+auteeahHN1Yl9maWVsZHPkuK3kuobvvIzmiYDku6XopoHljZXni6zlpITnkIbjgIJcblx0XHRcdHNmc0ZpbGVzT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKVxuXHRcdFx0c2ZzRmlsZXNPYmplY3QgJiYgcmVsYXRlZF9vYmplY3QgPSBzZnNGaWxlc09iamVjdFxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiICYmIHJlbGF0ZWRfZmllbGQucmVsYXRlZExpc3QpKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lXG5cdFx0XHRcdGlmIHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJvYmplY3RfZmllbGRzXCJcblx0XHRcdFx0XHQjVE9ETyDlvoXnm7jlhbPliJfooajmlK/mjIHmjpLluo/lkI7vvIzliKDpmaTmraTliKTmlq1cblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lfSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpyZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZH1cblxuXHRpZiBfb2JqZWN0LmVuYWJsZV90YXNrc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcInRhc2tzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfbm90ZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJub3Rlc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX2V2ZW50c1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImV2ZW50c1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX2luc3RhbmNlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImluc3RhbmNlc1wiLCBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX2FwcHJvdmFsc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImFwcHJvdmFsc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX3Byb2Nlc3Ncblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJwcm9jZXNzX2luc3RhbmNlX2hpc3RvcnlcIiwgZm9yZWlnbl9rZXk6IFwidGFyZ2V0X29iamVjdFwifVxuXHQjcmVjb3JkIOivpue7huS4i+eahGF1ZGl0X3JlY29yZHPku4Vtb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5Y+v6KeBXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSlcblx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXVkaXRfcmVjb3Jkc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cblx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHJldHVybiBDcmVhdG9yLlVTRVJfQ09OVEVYVFxuXHRlbHNlXG5cdFx0aWYgISh1c2VySWQgYW5kIHNwYWNlSWQpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJ0aGUgcGFyYW1zIHVzZXJJZCBhbmQgc3BhY2VJZCBpcyByZXF1aXJlZCBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0VXNlckNvbnRleHRcIlxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRzdUZpZWxkcyA9IHtuYW1lOiAxLCBtb2JpbGU6IDEsIHBvc2l0aW9uOiAxLCBlbWFpbDogMSwgY29tcGFueTogMSwgb3JnYW5pemF0aW9uOiAxLCBzcGFjZTogMSwgY29tcGFueV9pZDogMSwgY29tcGFueV9pZHM6IDF9XG5cdFx0IyBjaGVjayBpZiB1c2VyIGluIHRoZSBzcGFjZVxuXHRcdHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXG5cdFx0aWYgIXN1XG5cdFx0XHRzcGFjZUlkID0gbnVsbFxuXG5cdFx0IyBpZiBzcGFjZUlkIG5vdCBleGlzdHMsIGdldCB0aGUgZmlyc3Qgb25lLlxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRpZiBpc1VuU2FmZU1vZGVcblx0XHRcdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7dXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxuXHRcdFx0XHRpZiAhc3Vcblx0XHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0XHRzcGFjZUlkID0gc3Uuc3BhY2Vcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdFVTRVJfQ09OVEVYVCA9IHt9XG5cdFx0VVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZFxuXHRcdFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZFxuXHRcdFVTRVJfQ09OVEVYVC51c2VyID0ge1xuXHRcdFx0X2lkOiB1c2VySWRcblx0XHRcdG5hbWU6IHN1Lm5hbWUsXG5cdFx0XHRtb2JpbGU6IHN1Lm1vYmlsZSxcblx0XHRcdHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcblx0XHRcdGVtYWlsOiBzdS5lbWFpbFxuXHRcdFx0Y29tcGFueTogc3UuY29tcGFueVxuXHRcdFx0Y29tcGFueV9pZDogc3UuY29tcGFueV9pZFxuXHRcdFx0Y29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXG5cdFx0fVxuXHRcdHNwYWNlX3VzZXJfb3JnID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKT8uZmluZE9uZShzdS5vcmdhbml6YXRpb24pXG5cdFx0aWYgc3BhY2VfdXNlcl9vcmdcblx0XHRcdFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcblx0XHRcdFx0X2lkOiBzcGFjZV91c2VyX29yZy5faWQsXG5cdFx0XHRcdG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXG5cdFx0XHRcdGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxuXHRcdFx0fVxuXHRcdHJldHVybiBVU0VSX0NPTlRFWFRcblxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9ICh1cmwpLT5cblxuXHRpZiBfLmlzRnVuY3Rpb24oU3RlZWRvcy5pc0NvcmRvdmEpICYmIFN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgKHVybD8uc3RhcnRzV2l0aChcIi9hc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIHx8IHVybD8uc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSlcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcblx0XHRyZXR1cm4gdXJsXG5cblx0aWYgdXJsXG5cdFx0IyB1cmzlvIDlpLTmsqHmnIlcIi9cIu+8jOmcgOimgea3u+WKoFwiL1wiXG5cdFx0aWYgIS9eXFwvLy50ZXN0KHVybClcblx0XHRcdHVybCA9IFwiL1wiICsgdXJsXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmxcblx0ZWxzZVxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYXG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9ICh1c2VySWQsIHNwYWNlSWQpLT5cblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpXG5cdGVsc2Vcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKVxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWQ6MX19KVxuXHRyZXR1cm4gc3UuY29tcGFueV9pZFxuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gKHVzZXJJZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcblx0ZWxzZVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZHM6MX19KVxuXHRyZXR1cm4gc3U/LmNvbXBhbnlfaWRzXG5cbkNyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zID0gKHBvKS0+XG5cdGlmIHBvLmFsbG93Q3JlYXRlXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0VkaXRcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLmFsbG93RGVsZXRlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8udmlld0FsbFJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxuXHRpZiBwby52aWV3Q29tcGFueVJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHRwby52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cdFx0XG5cdCMg5aaC5p6c6ZmE5Lu255u45YWz5p2D6ZmQ6YWN572u5Li656m677yM5YiZ5YW85a655LmL5YmN5rKh5pyJ6ZmE5Lu25p2D6ZmQ6YWN572u5pe255qE6KeE5YiZXG5cdGlmIHBvLmFsbG93UmVhZFxuXHRcdHR5cGVvZiBwby5hbGxvd1JlYWRGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0XHR0eXBlb2YgcG8udmlld0FsbEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLnZpZXdBbGxGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0XG5cdFx0dHlwZW9mIHBvLmFsbG93Q3JlYXRlRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8uYWxsb3dDcmVhdGVGaWxlcyA9IHRydWVcblx0XHR0eXBlb2YgcG8uYWxsb3dFZGl0RmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlXG5cdFx0dHlwZW9mIHBvLmFsbG93RGVsZXRlRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdHR5cGVvZiBwby5tb2RpZnlBbGxGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5tb2RpZnlBbGxGaWxlcyA9IHRydWVcblxuXHRpZiBwby5hbGxvd0NyZWF0ZUZpbGVzXG5cdFx0cG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdGlmIHBvLmFsbG93RWRpdEZpbGVzXG5cdFx0cG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdGlmIHBvLmFsbG93RGVsZXRlRmlsZXNcblx0XHRwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8udmlld0FsbEZpbGVzXG5cdFx0cG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdGlmIHBvLm1vZGlmeUFsbEZpbGVzXG5cdFx0cG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdFx0cG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWVcblx0XHRwby52aWV3QWxsRmlsZXMgPSB0cnVlXG5cblx0cmV0dXJuIHBvXG5cbkNyZWF0b3IuZ2V0VGVtcGxhdGVTcGFjZUlkID0gKCktPlxuXHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8udGVtcGxhdGVTcGFjZUlkXG5cbkNyZWF0b3IuZ2V0Q2xvdWRBZG1pblNwYWNlSWQgPSAoKS0+XG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5jbG91ZEFkbWluU3BhY2VJZFxuXG5DcmVhdG9yLmlzVGVtcGxhdGVTcGFjZSA9IChzcGFjZUlkKS0+XG5cdGlmIHNwYWNlSWQgJiYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8udGVtcGxhdGVTcGFjZUlkID09IHNwYWNlSWRcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZSA9IChzcGFjZUlkKS0+XG5cdGlmIHNwYWNlSWQgJiYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWQgPT0gc3BhY2VJZFxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVJcblx0IiwidmFyIEZpYmVyO1xuXG5DcmVhdG9yLmRlcHMgPSB7XG4gIGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeSxcbiAgb2JqZWN0OiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG59O1xuXG5DcmVhdG9yLl9URU1QTEFURSA9IHtcbiAgQXBwczoge30sXG4gIE9iamVjdHM6IHt9XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGZpbHRlcnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgb3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIHJldHVybiBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgY3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbn0pO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG4gIENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5sb2FkT2JqZWN0cyhvYmosIG9iamVjdF9uYW1lKTtcbiAgICB9KS5ydW4oKTtcbiAgfTtcbn1cblxuQ3JlYXRvci5sb2FkT2JqZWN0cyA9IGZ1bmN0aW9uKG9iaiwgb2JqZWN0X25hbWUpIHtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqLm5hbWU7XG4gIH1cbiAgaWYgKCFvYmoubGlzdF92aWV3cykge1xuICAgIG9iai5saXN0X3ZpZXdzID0ge307XG4gIH1cbiAgaWYgKG9iai5zcGFjZSkge1xuICAgIG9iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmopO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSA9PT0gJ2Nmc19maWxlc19maWxlcmVjb3JkJykge1xuICAgIG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJztcbiAgICBvYmogPSBfLmNsb25lKG9iaik7XG4gICAgb2JqLm5hbWUgPSBvYmplY3RfbmFtZTtcbiAgICBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqO1xuICB9XG4gIENyZWF0b3IuY29udmVydE9iamVjdChvYmopO1xuICBuZXcgQ3JlYXRvci5PYmplY3Qob2JqKTtcbiAgQ3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICByZXR1cm4gb2JqO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3Quc3BhY2UpIHtcbiAgICByZXR1cm4gXCJjX1wiICsgb2JqZWN0LnNwYWNlICsgXCJfXCIgKyBvYmplY3QubmFtZTtcbiAgfVxuICByZXR1cm4gb2JqZWN0Lm5hbWU7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmLCByZWYxO1xuICBpZiAoXy5pc0FycmF5KG9iamVjdF9uYW1lKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKChyZWYgPSBDcmVhdG9yLmRlcHMpICE9IG51bGwpIHtcbiAgICAgIGlmICgocmVmMSA9IHJlZi5vYmplY3QpICE9IG51bGwpIHtcbiAgICAgICAgcmVmMS5kZXBlbmQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IGZ1bmN0aW9uKG9iamVjdF9pZCkge1xuICByZXR1cm4gXy5maW5kV2hlcmUoQ3JlYXRvci5vYmplY3RzQnlOYW1lLCB7XG4gICAgX2lkOiBvYmplY3RfaWRcbiAgfSk7XG59O1xuXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKTtcbiAgZGVsZXRlIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbn07XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbKChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCkpICE9IG51bGwgPyByZWYuX2NvbGxlY3Rpb25fbmFtZSA6IHZvaWQgMCkgfHwgb2JqZWN0X25hbWVdO1xuICB9XG59O1xuXG5DcmVhdG9yLnJlbW92ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIHJlZiwgcmVmMSwgc3BhY2U7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICB9XG4gIHNwYWNlID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZGIpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgIGZpZWxkczoge1xuICAgICAgYWRtaW5zOiAxXG4gICAgfVxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgaWYgKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghXy5pc1N0cmluZyhmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gZm9ybXVsYXI7XG4gIH1cbiAgaWYgKENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFyO1xufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSBmdW5jdGlvbihmaWx0ZXJzLCBjb250ZXh0KSB7XG4gIHZhciBzZWxlY3RvcjtcbiAgc2VsZWN0b3IgPSB7fTtcbiAgXy5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBhY3Rpb24sIG5hbWUsIHZhbHVlO1xuICAgIGlmICgoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIubGVuZ3RoIDogdm9pZCAwKSA9PT0gMykge1xuICAgICAgbmFtZSA9IGZpbHRlclswXTtcbiAgICAgIGFjdGlvbiA9IGZpbHRlclsxXTtcbiAgICAgIHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KTtcbiAgICAgIHNlbGVjdG9yW25hbWVdID0ge307XG4gICAgICByZXR1cm4gc2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzZWxlY3Rvcjtcbn07XG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgcmV0dXJuIHNwYWNlSWQgPT09ICdjb21tb24nO1xufTtcblxuXG4vKlxuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4gKi9cblxuQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMgPSBmdW5jdGlvbihkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KSB7XG4gIHZhciB2YWx1ZXM7XG4gIGlmICghaWRfa2V5KSB7XG4gICAgaWRfa2V5ID0gXCJfaWRcIjtcbiAgfVxuICBpZiAoaGl0X2ZpcnN0KSB7XG4gICAgdmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpO1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHZhciBfaW5kZXg7XG4gICAgICBfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgICBpZiAoX2luZGV4ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIF9pbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfLnNvcnRCeShkb2NzLCBmdW5jdGlvbihkb2MpIHtcbiAgICAgIHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSk7XG4gICAgfSk7XG4gIH1cbn07XG5cblxuLypcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuICovXG5cbkNyZWF0b3Iuc29ydGluZ01ldGhvZCA9IGZ1bmN0aW9uKHZhbHVlMSwgdmFsdWUyKSB7XG4gIHZhciBpc1ZhbHVlMUVtcHR5LCBpc1ZhbHVlMkVtcHR5LCBsb2NhbGU7XG4gIGlmICh0aGlzLmtleSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV07XG4gICAgdmFsdWUyID0gdmFsdWUyW3RoaXMua2V5XTtcbiAgfVxuICBpZiAodmFsdWUxIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHZhbHVlMiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTIgPSB2YWx1ZTIuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUxID09PSBcIm51bWJlclwiICYmIHR5cGVvZiB2YWx1ZTIgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gdmFsdWUxIC0gdmFsdWUyO1xuICB9XG4gIGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT09IG51bGwgfHwgdmFsdWUxID09PSB2b2lkIDA7XG4gIGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT09IG51bGwgfHwgdmFsdWUyID09PSB2b2lkIDA7XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmICFpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmIChpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBpZiAoIWlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKCk7XG4gIHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlKHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGUpO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBfb2JqZWN0LCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TWFwLCByZWxhdGVkX29iamVjdHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICB9XG4gIHJlbGF0ZWRfb2JqZWN0cyA9IFtdO1xuICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgaWYgKCFfb2JqZWN0KSB7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICByZWxhdGVkTGlzdE1hcCA9IHt9O1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqTmFtZSkge1xuICAgICAgaWYgKF8uaXNPYmplY3Qob2JqTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSAmJiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSkge1xuICAgICAgICAgIGlmIChfLmlzRW1wdHkocmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gfHwgcmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHtcbiAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSkge1xuICAgICAgcmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIlxuICAgICAgfTtcbiAgICB9XG4gICAgXy5lYWNoKFsndGFza3MnLCAnbm90ZXMnLCAnZXZlbnRzJywgJ2FwcHJvdmFscyddLCBmdW5jdGlvbihlbmFibGVPYmpOYW1lKSB7XG4gICAgICBpZiAocmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdID0ge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBlbmFibGVPYmpOYW1lLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpO1xuICAgICAgaWYgKF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIChwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJlbGF0ZWRfb2JqZWN0cyA9IF8udmFsdWVzKHJlbGF0ZWRMaXN0TWFwKTtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9maWxlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgIHZhciBzZnNGaWxlc09iamVjdDtcbiAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKSB7XG4gICAgICBzZnNGaWxlc09iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIik7XG4gICAgICBzZnNGaWxlc09iamVjdCAmJiAocmVsYXRlZF9vYmplY3QgPSBzZnNGaWxlc09iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgIGlmICgocmVsYXRlZF9maWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09PSBcImxvb2t1cFwiICYmIHJlbGF0ZWRfZmllbGQucmVsYXRlZExpc3QpKSAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwib2JqZWN0X2ZpZWxkc1wiKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGlmIChfb2JqZWN0LmVuYWJsZV90YXNrcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInRhc2tzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfbm90ZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJub3Rlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2V2ZW50cykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImV2ZW50c1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2luc3RhbmNlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2FwcHJvdmFscykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcImFwcHJvdmFsc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Byb2Nlc3MpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJwcm9jZXNzX2luc3RhbmNlX2hpc3RvcnlcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInRhcmdldF9vYmplY3RcIlxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpO1xuICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSkge1xuICB2YXIgVVNFUl9DT05URVhULCByZWYsIHNwYWNlX3VzZXJfb3JnLCBzdSwgc3VGaWVsZHM7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCEodXNlcklkICYmIHNwYWNlSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJ0aGUgcGFyYW1zIHVzZXJJZCBhbmQgc3BhY2VJZCBpcyByZXF1aXJlZCBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0VXNlckNvbnRleHRcIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgc3VGaWVsZHMgPSB7XG4gICAgICBuYW1lOiAxLFxuICAgICAgbW9iaWxlOiAxLFxuICAgICAgcG9zaXRpb246IDEsXG4gICAgICBlbWFpbDogMSxcbiAgICAgIGNvbXBhbnk6IDEsXG4gICAgICBvcmdhbml6YXRpb246IDEsXG4gICAgICBzcGFjZTogMSxcbiAgICAgIGNvbXBhbnlfaWQ6IDEsXG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH07XG4gICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICB9KTtcbiAgICBpZiAoIXN1KSB7XG4gICAgICBzcGFjZUlkID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBpZiAoaXNVblNhZmVNb2RlKSB7XG4gICAgICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFzdSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHNwYWNlSWQgPSBzdS5zcGFjZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBVU0VSX0NPTlRFWFQgPSB7fTtcbiAgICBVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkO1xuICAgIFVTRVJfQ09OVEVYVC5zcGFjZUlkID0gc3BhY2VJZDtcbiAgICBVU0VSX0NPTlRFWFQudXNlciA9IHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgbmFtZTogc3UubmFtZSxcbiAgICAgIG1vYmlsZTogc3UubW9iaWxlLFxuICAgICAgcG9zaXRpb246IHN1LnBvc2l0aW9uLFxuICAgICAgZW1haWw6IHN1LmVtYWlsLFxuICAgICAgY29tcGFueTogc3UuY29tcGFueSxcbiAgICAgIGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWQsXG4gICAgICBjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcbiAgICB9O1xuICAgIHNwYWNlX3VzZXJfb3JnID0gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIikpICE9IG51bGwgPyByZWYuZmluZE9uZShzdS5vcmdhbml6YXRpb24pIDogdm9pZCAwO1xuICAgIGlmIChzcGFjZV91c2VyX29yZykge1xuICAgICAgVVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuICAgICAgICBfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcbiAgICAgICAgbmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcbiAgICAgICAgZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gVVNFUl9DT05URVhUO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gIGlmIChfLmlzRnVuY3Rpb24oU3RlZWRvcy5pc0NvcmRvdmEpICYmIFN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgKCh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSA6IHZvaWQgMCkgfHwgKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpIDogdm9pZCAwKSkpIHtcbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIGlmICh1cmwpIHtcbiAgICBpZiAoIS9eXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiL1wiICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZDogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdS5jb21wYW55X2lkO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1ICE9IG51bGwgPyBzdS5jb21wYW55X2lkcyA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zID0gZnVuY3Rpb24ocG8pIHtcbiAgaWYgKHBvLmFsbG93Q3JlYXRlKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dEZWxldGUpIHtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0FsbFJlY29yZHMgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZSA9IHRydWU7XG4gICAgcG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dSZWFkKSB7XG4gICAgdHlwZW9mIHBvLmFsbG93UmVhZEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlKTtcbiAgICB0eXBlb2YgcG8udmlld0FsbEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8udmlld0FsbEZpbGVzID0gdHJ1ZSk7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgIHR5cGVvZiBwby5hbGxvd0NyZWF0ZUZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dDcmVhdGVGaWxlcyA9IHRydWUpO1xuICAgIHR5cGVvZiBwby5hbGxvd0VkaXRGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZSk7XG4gICAgdHlwZW9mIHBvLmFsbG93RGVsZXRlRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZSk7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICB0eXBlb2YgcG8ubW9kaWZ5QWxsRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5tb2RpZnlBbGxGaWxlcyA9IHRydWUpO1xuICB9XG4gIGlmIChwby5hbGxvd0NyZWF0ZUZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXRGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dEZWxldGVGaWxlcykge1xuICAgIHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZTtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdBbGxGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsRmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gICAgcG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlO1xuICAgIHBvLnZpZXdBbGxGaWxlcyA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHBvO1xufTtcblxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYudGVtcGxhdGVTcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKHNwYWNlSWQgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYuY2xvdWRBZG1pblNwYWNlSWQgOiB2b2lkIDApID09PSBzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUjtcbn1cbiIsIk1ldGVvci5tZXRob2RzXG5cdCMg55So5oi36I635Y+WbG9va3VwIOOAgW1hc3Rlcl9kZXRhaWznsbvlnovlrZfmrrXnmoTpgInpobnlgLxcblx0XCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IChvcHRpb25zKS0+XG5cdFx0aWYgb3B0aW9ucz8ucGFyYW1zPy5yZWZlcmVuY2VfdG9cblxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSlcblxuXHRcdFx0bmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcblxuXHRcdFx0cXVlcnkgPSB7fVxuXHRcdFx0aWYgb3B0aW9ucy5wYXJhbXMuc3BhY2Vcblx0XHRcdFx0cXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZVxuXG5cdFx0XHRcdHNvcnQgPSBvcHRpb25zPy5zb3J0XG5cblx0XHRcdFx0c2VsZWN0ZWQgPSBvcHRpb25zPy5zZWxlY3RlZCB8fCBbXVxuXG5cdFx0XHRcdG9wdGlvbnNfbGltaXQgPSBvcHRpb25zPy5vcHRpb25zX2xpbWl0IHx8IDEwXG5cblx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5ID0ge31cblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0geyRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0fVxuXG5cdFx0XHRcdGlmIG9wdGlvbnM/LnZhbHVlcz8ubGVuZ3RoXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fSwgc2VhcmNoVGV4dFF1ZXJ5XVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319XVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5zZWFyY2hUZXh0XG5cdFx0XHRcdFx0XHRfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KVxuXHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHskbmluOiBzZWxlY3RlZH1cblxuXHRcdFx0XHRjb2xsZWN0aW9uID0gb2JqZWN0LmRiXG5cblx0XHRcdFx0aWYgb3B0aW9ucy5maWx0ZXJRdWVyeVxuXHRcdFx0XHRcdF8uZXh0ZW5kIHF1ZXJ5LCBvcHRpb25zLmZpbHRlclF1ZXJ5XG5cblx0XHRcdFx0cXVlcnlfb3B0aW9ucyA9IHtsaW1pdDogb3B0aW9uc19saW1pdH1cblxuXHRcdFx0XHRpZiBzb3J0ICYmIF8uaXNPYmplY3Qoc29ydClcblx0XHRcdFx0XHRxdWVyeV9vcHRpb25zLnNvcnQgPSBzb3J0XG5cblx0XHRcdFx0aWYgY29sbGVjdGlvblxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0cmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKVxuXHRcdFx0XHRcdFx0cmVzdWx0cyA9IFtdXG5cdFx0XHRcdFx0XHRfLmVhY2ggcmVjb3JkcywgKHJlY29yZCktPlxuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2hcblx0XHRcdFx0XHRcdFx0XHRsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XVxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlOiByZWNvcmQuX2lkXG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0c1xuXHRcdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucylcblx0XHRyZXR1cm4gW10gIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uLCBlLCBuYW1lX2ZpZWxkX2tleSwgb2JqZWN0LCBvcHRpb25zX2xpbWl0LCBxdWVyeSwgcXVlcnlfb3B0aW9ucywgcmVjb3JkcywgcmVmLCByZWYxLCByZXN1bHRzLCBzZWFyY2hUZXh0UXVlcnksIHNlbGVjdGVkLCBzb3J0O1xuICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmID0gb3B0aW9ucy5wYXJhbXMpICE9IG51bGwgPyByZWYucmVmZXJlbmNlX3RvIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKTtcbiAgICAgIG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICAgICAgcXVlcnkgPSB7fTtcbiAgICAgIGlmIChvcHRpb25zLnBhcmFtcy5zcGFjZSkge1xuICAgICAgICBxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlO1xuICAgICAgICBzb3J0ID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zb3J0IDogdm9pZCAwO1xuICAgICAgICBzZWxlY3RlZCA9IChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNlbGVjdGVkIDogdm9pZCAwKSB8fCBbXTtcbiAgICAgICAgb3B0aW9uc19saW1pdCA9IChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLm9wdGlvbnNfbGltaXQgOiB2b2lkIDApIHx8IDEwO1xuICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgc2VhcmNoVGV4dFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHtcbiAgICAgICAgICAgICRyZWdleDogb3B0aW9ucy5zZWFyY2hUZXh0XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZjEgPSBvcHRpb25zLnZhbHVlcykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LCBzZWFyY2hUZXh0UXVlcnlcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgXy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICRuaW46IHNlbGVjdGVkXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb2xsZWN0aW9uID0gb2JqZWN0LmRiO1xuICAgICAgICBpZiAob3B0aW9ucy5maWx0ZXJRdWVyeSkge1xuICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBvcHRpb25zLmZpbHRlclF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICBxdWVyeV9vcHRpb25zID0ge1xuICAgICAgICAgIGxpbWl0OiBvcHRpb25zX2xpbWl0XG4gICAgICAgIH07XG4gICAgICAgIGlmIChzb3J0ICYmIF8uaXNPYmplY3Qoc29ydCkpIHtcbiAgICAgICAgICBxdWVyeV9vcHRpb25zLnNvcnQgPSBzb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKCk7XG4gICAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgICBfLmVhY2gocmVjb3JkcywgZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuX2lkXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufSk7XG4iLCJKc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL3dvcmtmbG93L3ZpZXcvOmluc3RhbmNlSWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSlcblx0XHRjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWRcblxuXHRcdGhhc2hEYXRhID0gcmVxLmJvZHlcblx0XHRvYmplY3RfbmFtZSA9IGhhc2hEYXRhLm9iamVjdF9uYW1lXG5cdFx0cmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkXG5cdFx0c3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZFxuXG5cdFx0Y2hlY2sgb2JqZWN0X25hbWUsIFN0cmluZ1xuXHRcdGNoZWNrIHJlY29yZF9pZCwgU3RyaW5nXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZ1xuXG5cdFx0aW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWRcblx0XHR4X3VzZXJfaWQgPSByZXEucXVlcnlbJ1gtVXNlci1JZCddXG5cdFx0eF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXVxuXG5cdFx0cmVkaXJlY3RfdXJsID0gXCIvXCJcblx0XHRpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpXG5cdFx0IyAtIOaIkeeahOiNieeov+Wwsei3s+i9rOiHs+iNieeov+eusVxuXHRcdCMgLSDmiJHnmoTlvoXlrqHmoLjlsLHot7Povazoh7PlvoXlrqHmoLhcblx0XHQjIC0g5LiN5piv5oiR55qE55Sz6K+35Y2V5YiZ6Lez6L2s6Iez5omT5Y2w6aG16Z2iXG5cdFx0IyAtIOWmgueUs+ivt+WNleS4jeWtmOWcqOWImeaPkOekuueUqOaIt+eUs+ivt+WNleW3suWIoOmZpO+8jOW5tuS4lOabtOaWsHJlY29yZOeahOeKtuaAge+8jOS9v+eUqOaIt+WPr+S7pemHjeaWsOWPkei1t+WuoeaJuVxuXHRcdGlmIGluc1xuXHRcdFx0Ym94ID0gJydcblx0XHRcdHNwYWNlSWQgPSBpbnMuc3BhY2Vcblx0XHRcdGZsb3dJZCA9IGlucy5mbG93XG5cblx0XHRcdGlmIChpbnMuaW5ib3hfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZCkgb3IgKGlucy5jY191c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRib3ggPSAnaW5ib3gnXG5cdFx0XHRlbHNlIGlmIGlucy5vdXRib3hfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZFxuXHRcdFx0XHRib3ggPSAnb3V0Ym94J1xuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ2RyYWZ0JyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcblx0XHRcdFx0Ym94ID0gJ2RyYWZ0J1xuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ3BlbmRpbmcnIGFuZCAoaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWQgb3IgaW5zLmFwcGxpY2FudCBpcyBjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdGJveCA9ICdwZW5kaW5nJ1xuXHRcdFx0ZWxzZSBpZiBpbnMuc3RhdGUgaXMgJ2NvbXBsZXRlZCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXG5cdFx0XHRcdGJveCA9ICdjb21wbGV0ZWQnXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg6aqM6K+BbG9naW4gdXNlcl9pZOWvueivpea1geeoi+acieeuoeeQhuOAgeinguWvn+eUs+ivt+WNleeahOadg+mZkFxuXHRcdFx0XHRwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkLCB7IGZpZWxkczogeyBhZG1pbnM6IDEgfSB9KVxuXHRcdFx0XHRpZiBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIG9yIHBlcm1pc3Npb25zLmluY2x1ZGVzKFwibW9uaXRvclwiKSBvciBzcGFjZS5hZG1pbnMuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRcdGJveCA9ICdtb25pdG9yJ1xuXHRcdFx0d29ya2Zsb3dVcmwgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzPy53b3JrZmxvdz8udXJsXG5cdFx0XHRpZiBib3hcblx0XHRcdFx0cmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS8je2JveH0vI3tpbnNJZH0/WC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIFwid29ya2Zsb3cvc3BhY2UvI3tzcGFjZUlkfS9wcmludC8je2luc0lkfT9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxuXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0XHRkYXRhOiB7IHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsIH1cblx0XHRcdH1cblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKVxuXHRcdFx0aWYgY29sbGVjdGlvblxuXHRcdFx0XHRjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcblx0XHRcdFx0XHQkdW5zZXQ6IHtcblx0XHRcdFx0XHRcdFwiaW5zdGFuY2VzXCI6IDEsXG5cdFx0XHRcdFx0XHRcImluc3RhbmNlX3N0YXRlXCI6IDEsXG5cdFx0XHRcdFx0XHRcImxvY2tlZFwiOiAxXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+eUs+ivt+WNleW3suWIoOmZpCcpXG5cblx0Y2F0Y2ggZVxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7IGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlIH1dIH1cblx0XHR9XG5cbiIsIkpzb25Sb3V0ZXMuYWRkKCdwb3N0JywgJy9hcGkvd29ya2Zsb3cvdmlldy86aW5zdGFuY2VJZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBib3gsIGNvbGxlY3Rpb24sIGN1cnJlbnRfdXNlcl9pZCwgY3VycmVudF91c2VyX2luZm8sIGUsIGZsb3dJZCwgaGFzaERhdGEsIGlucywgaW5zSWQsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9ucywgcmVjb3JkX2lkLCByZWRpcmVjdF91cmwsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgc3BhY2UsIHNwYWNlSWQsIHNwYWNlX2lkLCB3b3JrZmxvd1VybCwgeF9hdXRoX3Rva2VuLCB4X3VzZXJfaWQ7XG4gIHRyeSB7XG4gICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICBjdXJyZW50X3VzZXJfaWQgPSBjdXJyZW50X3VzZXJfaW5mby5faWQ7XG4gICAgaGFzaERhdGEgPSByZXEuYm9keTtcbiAgICBvYmplY3RfbmFtZSA9IGhhc2hEYXRhLm9iamVjdF9uYW1lO1xuICAgIHJlY29yZF9pZCA9IGhhc2hEYXRhLnJlY29yZF9pZDtcbiAgICBzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkO1xuICAgIGNoZWNrKG9iamVjdF9uYW1lLCBTdHJpbmcpO1xuICAgIGNoZWNrKHJlY29yZF9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZDtcbiAgICB4X3VzZXJfaWQgPSByZXEucXVlcnlbJ1gtVXNlci1JZCddO1xuICAgIHhfYXV0aF90b2tlbiA9IHJlcS5xdWVyeVsnWC1BdXRoLVRva2VuJ107XG4gICAgcmVkaXJlY3RfdXJsID0gXCIvXCI7XG4gICAgaW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkKTtcbiAgICBpZiAoaW5zKSB7XG4gICAgICBib3ggPSAnJztcbiAgICAgIHNwYWNlSWQgPSBpbnMuc3BhY2U7XG4gICAgICBmbG93SWQgPSBpbnMuZmxvdztcbiAgICAgIGlmICgoKHJlZiA9IGlucy5pbmJveF91c2VycykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSB8fCAoKHJlZjEgPSBpbnMuY2NfdXNlcnMpICE9IG51bGwgPyByZWYxLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApKSB7XG4gICAgICAgIGJveCA9ICdpbmJveCc7XG4gICAgICB9IGVsc2UgaWYgKChyZWYyID0gaW5zLm91dGJveF91c2VycykgIT0gbnVsbCA/IHJlZjIuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkge1xuICAgICAgICBib3ggPSAnb3V0Ym94JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnZHJhZnQnICYmIGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCkge1xuICAgICAgICBib3ggPSAnZHJhZnQnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdwZW5kaW5nJyAmJiAoaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkIHx8IGlucy5hcHBsaWNhbnQgPT09IGN1cnJlbnRfdXNlcl9pZCkpIHtcbiAgICAgICAgYm94ID0gJ3BlbmRpbmcnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdjb21wbGV0ZWQnICYmIGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCkge1xuICAgICAgICBib3ggPSAnY29tcGxldGVkJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKTtcbiAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkLCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBhZG1pbnM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZG1pblwiKSB8fCBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcIm1vbml0b3JcIikgfHwgc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkpIHtcbiAgICAgICAgICBib3ggPSAnbW9uaXRvcic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHdvcmtmbG93VXJsID0gKHJlZjMgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMpICE9IG51bGwgPyAocmVmNCA9IHJlZjMud29ya2Zsb3cpICE9IG51bGwgPyByZWY0LnVybCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChib3gpIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIChcIndvcmtmbG93L3NwYWNlL1wiICsgc3BhY2VJZCArIFwiL1wiICsgYm94ICsgXCIvXCIgKyBpbnNJZCArIFwiP1gtVXNlci1JZD1cIiArIHhfdXNlcl9pZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIHhfYXV0aF90b2tlbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgKFwid29ya2Zsb3cvc3BhY2UvXCIgKyBzcGFjZUlkICsgXCIvcHJpbnQvXCIgKyBpbnNJZCArIFwiP2JveD1tb25pdG9yJnByaW50X2lzX3Nob3dfdHJhY2VzPTEmcHJpbnRfaXNfc2hvd19hdHRhY2htZW50cz0xJlgtVXNlci1JZD1cIiArIHhfdXNlcl9pZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIHhfYXV0aF90b2tlbik7XG4gICAgICB9XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlZGlyZWN0X3VybDogcmVkaXJlY3RfdXJsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZCk7XG4gICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICBjb2xsZWN0aW9uLnVwZGF0ZShyZWNvcmRfaWQsIHtcbiAgICAgICAgICAkdW5zZXQ6IHtcbiAgICAgICAgICAgIFwiaW5zdGFuY2VzXCI6IDEsXG4gICAgICAgICAgICBcImluc3RhbmNlX3N0YXRlXCI6IDEsXG4gICAgICAgICAgICBcImxvY2tlZFwiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3InLCAn55Sz6K+35Y2V5bey5Yig6ZmkJyk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IChvYmplY3RfbmFtZSwgY29sdW1ucykgLT5cblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKT8uX3NjaGVtYVxuXHRjb2x1bW5fbnVtID0gMFxuXHRpZiBfc2NoZW1hXG5cdFx0Xy5lYWNoIGNvbHVtbnMsIChmaWVsZF9uYW1lKSAtPlxuXHRcdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcblx0XHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcblx0XHRcdGlmIGlzX3dpZGVcblx0XHRcdFx0Y29sdW1uX251bSArPSAyXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMVxuXG5cdFx0aW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bVxuXHRcdHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnRcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkgLT5cblx0X3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hXG5cdGlmIF9zY2hlbWFcblx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxuXHRcdGlzX3dpZGUgPSBmaWVsZFtmaWVsZF9uYW1lXT8uYXV0b2Zvcm0/LmlzX3dpZGVcblx0XHRyZXR1cm4gaXNfd2lkZVxuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSAtPlxuXHRzZXR0aW5nID0gQ3JlYXRvci5Db2xsZWN0aW9ucz8uc2V0dGluZ3M/LmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIn0pXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gXy5tYXAgY29sdW1ucywgKGNvbHVtbiktPlxuXHRcdGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dXG5cdFx0aWYgZmllbGQ/LnR5cGUgYW5kICFmaWVsZC5oaWRkZW5cblx0XHRcdHJldHVybiBjb2x1bW5cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkXG5cdGNvbHVtbnMgPSBfLmNvbXBhY3QgY29sdW1uc1xuXHRpZiBzZXR0aW5nIGFuZCBzZXR0aW5nLnNldHRpbmdzXG5cdFx0c29ydCA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXT8uc29ydCB8fCBbXVxuXHRcdHNvcnQgPSBfLm1hcCBzb3J0LCAob3JkZXIpLT5cblx0XHRcdGtleSA9IG9yZGVyWzBdXG5cdFx0XHRpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpXG5cdFx0XHRvcmRlclswXSA9IGluZGV4ICsgMVxuXHRcdFx0cmV0dXJuIG9yZGVyXG5cdFx0cmV0dXJuIHNvcnRcblx0cmV0dXJuIFtdXG5cblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXVxuXHRleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl1cblx0ZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXVxuXHRpZiBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcblx0XHRleHRyYV9jb2x1bW5zID0gXy51bmlvbiBleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnNcblxuXHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzP1tvYmplY3RfbmFtZV0gPSBbXVxuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IChkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpLT5cblx0ZGVmYXVsdF9jb2x1bW5zID0gZGVmYXVsdF92aWV3Py5jb2x1bW5zXG5cdGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/Lm1vYmlsZV9jb2x1bW5zXG5cdHVubGVzcyBsaXN0X3ZpZXdcblx0XHRyZXR1cm5cblx0b2l0ZW0gPSBfLmNsb25lKGxpc3Rfdmlldylcblx0aWYgIV8uaGFzKG9pdGVtLCBcIm5hbWVcIilcblx0XHRvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWVcblx0aWYgIW9pdGVtLmNvbHVtbnNcblx0XHRpZiBkZWZhdWx0X2NvbHVtbnNcblx0XHRcdG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnNcblx0aWYgIW9pdGVtLmNvbHVtbnNcblx0XHRvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXVxuXHRpZiAhb2l0ZW0ubW9iaWxlX2NvbHVtbnNcblx0XHRpZiBkZWZhdWx0X21vYmlsZV9jb2x1bW5zXG5cdFx0XHRvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcblxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKVxuXHRcdFx0b2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpXG5cblxuXHRpZiAhb2l0ZW0uZmlsdGVyX3Njb3BlXG5cdFx0IyBsaXN0dmlld+inhuWbvueahGZpbHRlcl9zY29wZem7mOiupOWAvOaUueS4unNwYWNlICMxMzFcblx0XHRvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCJcblxuXHRpZiAhXy5oYXMob2l0ZW0sIFwiX2lkXCIpXG5cdFx0b2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWVcblx0ZWxzZVxuXHRcdG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWVcblxuXHRpZiBfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpXG5cdFx0b2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucylcblxuXHRfLmZvckVhY2ggb2l0ZW0uZmlsdGVycywgKGZpbHRlciwgX2luZGV4KS0+XG5cdFx0aWYgIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKVxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpbHRlcj8uX3ZhbHVlKVxuXHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlci5fdmFsdWV9KVwiKVxuXHRyZXR1cm4gb2l0ZW1cblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Q3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IChvYmplY3RfbmFtZSktPlxuXHRcdHVubGVzcyBvYmplY3RfbmFtZVxuXHRcdFx0cmV0dXJuXG5cdFx0cmVsYXRlZExpc3RPYmplY3RzID0ge31cblx0XHRyZWxhdGVkTGlzdE5hbWVzID0gW11cblx0XHRvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMgPSBbXTtcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgX29iamVjdFxuXHRcdFx0bGF5b3V0UmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRfbGlzdHM7XG5cdFx0XHQjIGxheW91dFJlbGF0ZWRMaXN0IOaYr+aVsOe7hOWwseihqOekuumFjee9rui/h+mhtemdouW4g+WxgO+8jOWwseWQr+eUqOmhtemdouW4g+WxgOeahOebuOWFs+WtkOihqOOAglxuXHRcdFx0aWYgXy5pc0FycmF5IGxheW91dFJlbGF0ZWRMaXN0XG5cdFx0XHRcdF8uZWFjaCBsYXlvdXRSZWxhdGVkTGlzdCwgKGl0ZW0pLT5cblx0XHRcdFx0XHRyZU9iamVjdE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVswXVxuXHRcdFx0XHRcdHJlRmllbGROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMV1cblx0XHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlT2JqZWN0TmFtZSk/LmZpZWxkc1tyZUZpZWxkTmFtZV0/LndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogcmVPYmplY3ROYW1lXG5cdFx0XHRcdFx0XHRjb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzXG5cdFx0XHRcdFx0XHRtb2JpbGVfY29sdW1uczogaXRlbS5maWVsZF9uYW1lc1xuXHRcdFx0XHRcdFx0aXNfZmlsZTogcmVPYmplY3ROYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdFx0XHRcdGZpbHRlcnNGdW5jdGlvbjogaXRlbS5maWx0ZXJzXG5cdFx0XHRcdFx0XHRzb3J0OiBpdGVtLnNvcnRcblx0XHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVGaWVsZE5hbWVcblx0XHRcdFx0XHRcdGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlXG5cdFx0XHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdFx0XHRcdGxhYmVsOiBpdGVtLmxhYmVsXG5cdFx0XHRcdFx0XHRhY3Rpb25zOiBpdGVtLmJ1dHRvbnNcblx0XHRcdFx0XHRcdHZpc2libGVfb246IGl0ZW0udmlzaWJsZV9vblxuXHRcdFx0XHRcdFx0cGFnZV9zaXplOiBpdGVtLnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cy5wdXNoKHJlbGF0ZWQpXG5cdFx0XHRcdHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHM7XG5cdFx0XHRyZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Rcblx0XHRcdGlmICFfLmlzRW1wdHkgcmVsYXRlZExpc3Rcblx0XHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0LCAob2JqT3JOYW1lKS0+XG5cdFx0XHRcdFx0aWYgXy5pc09iamVjdCBvYmpPck5hbWVcblx0XHRcdFx0XHRcdHJlbGF0ZWQgPVxuXHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWVcblx0XHRcdFx0XHRcdFx0Y29sdW1uczogb2JqT3JOYW1lLmNvbHVtbnNcblx0XHRcdFx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IG9iak9yTmFtZS5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRcdFx0XHRpc19maWxlOiBvYmpPck5hbWUub2JqZWN0TmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRcdFx0XHRcdGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnNcblx0XHRcdFx0XHRcdFx0c29ydDogb2JqT3JOYW1lLnNvcnRcblx0XHRcdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiAnJ1xuXHRcdFx0XHRcdFx0XHRjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZVxuXHRcdFx0XHRcdFx0XHRsYWJlbDogb2JqT3JOYW1lLmxhYmVsXG5cdFx0XHRcdFx0XHRcdGFjdGlvbnM6IG9iak9yTmFtZS5hY3Rpb25zXG5cdFx0XHRcdFx0XHRcdHBhZ2Vfc2l6ZTogb2JqT3JOYW1lLnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWRcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWUub2JqZWN0TmFtZVxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyBvYmpPck5hbWVcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TmFtZXMucHVzaCBvYmpPck5hbWVcblxuXHRcdG1hcExpc3QgPSB7fVxuXHRcdHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpXG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIC0+XG5cdFx0XHRpZiAhcmVsYXRlZF9vYmplY3RfaXRlbT8ub2JqZWN0X25hbWVcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRyZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZVxuXHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleVxuXHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkX29iamVjdF9pdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRyZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0XHR1bmxlc3MgcmVsYXRlZF9vYmplY3Rcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXG5cdFx0XHRjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSlcblx0XHRcdG1vYmlsZV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lLCB0cnVlKSB8fCBbXCJuYW1lXCJdXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxuXG5cdFx0XHRvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSlcblx0XHRcdHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpXG5cblx0XHRcdGlmIC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKVxuXHRcdFx0XHQjIG9iamVjdOexu+Wei+W4puWtkOWxnuaAp+eahHJlbGF0ZWRfZmllbGRfbmFtZeimgeWOu+aOieS4remXtOeahOe+juWFg+espuWPt++8jOWQpuWImeaYvuekuuS4jeWHuuWtl+auteWAvFxuXHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLyxcIlwiKVxuXHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lXG5cdFx0XHRcdGNvbHVtbnM6IGNvbHVtbnNcblx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lXG5cdFx0XHRcdGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblxuXHRcdFx0cmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdFx0aWYgcmVsYXRlZE9iamVjdFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmNvbHVtbnNcblx0XHRcdFx0XHRyZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnNcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRcdHJlbGF0ZWQubW9iaWxlX2NvbHVtbnMgPSByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3Quc29ydFxuXHRcdFx0XHRcdHJlbGF0ZWQuc29ydCA9IHJlbGF0ZWRPYmplY3Quc29ydFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvblxuXHRcdFx0XHRcdHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxuXHRcdFx0XHRcdHJlbGF0ZWQuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QgPSByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubGFiZWxcblx0XHRcdFx0XHRyZWxhdGVkLmxhYmVsID0gcmVsYXRlZE9iamVjdC5sYWJlbFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZVxuXHRcdFx0XHRcdHJlbGF0ZWQucGFnZV9zaXplID0gcmVsYXRlZE9iamVjdC5wYWdlX3NpemVcblx0XHRcdFx0ZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXG5cdFx0XHRtYXBMaXN0W3JlbGF0ZWQub2JqZWN0X25hbWVdID0gcmVsYXRlZFxuXG5cblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF8udmFsdWVzKHJlbGF0ZWRMaXN0T2JqZWN0cyksIFwib2JqZWN0X25hbWVcIilcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZClcblx0XHR1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0cmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzXG5cdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0T2JqZWN0cywgKHYsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIC0+XG5cdFx0XHRpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMVxuXHRcdFx0YWxsb3dSZWFkID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpPy5hbGxvd1JlYWRcblx0XHRcdGlmIGlzQWN0aXZlICYmIGFsbG93UmVhZFxuXHRcdFx0XHRtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdlxuXG5cdFx0bGlzdCA9IFtdXG5cdFx0aWYgXy5pc0VtcHR5IHJlbGF0ZWRMaXN0TmFtZXNcblx0XHRcdGxpc3QgPSAgXy52YWx1ZXMgbWFwTGlzdFxuXHRcdGVsc2Vcblx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdE5hbWVzLCAob2JqZWN0TmFtZSkgLT5cblx0XHRcdFx0aWYgbWFwTGlzdFtvYmplY3ROYW1lXVxuXHRcdFx0XHRcdGxpc3QucHVzaCBtYXBMaXN0W29iamVjdE5hbWVdXG5cblx0XHRpZiBfLmhhcyhfb2JqZWN0LCAnYWxsb3dfcmVsYXRlZExpc3QnKVxuXHRcdFx0bGlzdCA9IF8uZmlsdGVyIGxpc3QsIChpdGVtKS0+XG5cdFx0XHRcdHJldHVybiBfLmluY2x1ZGUoX29iamVjdC5hbGxvd19yZWxhdGVkTGlzdCwgaXRlbS5vYmplY3RfbmFtZSlcblxuXHRcdHJldHVybiBsaXN0XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyA9IChvYmplY3RfbmFtZSktPlxuXHRyZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpXG5cbiMjIyBcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG4jIyNcbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYyktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuXG5cdGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKVxuXHR1bmxlc3MgbGlzdFZpZXdzPy5sZW5ndGhcblx0XHRyZXR1cm5cblx0bGlzdF92aWV3ID0gXy5maW5kKGxpc3RWaWV3cywgKGl0ZW0pLT4gcmV0dXJuIGl0ZW0uX2lkID09IGxpc3Rfdmlld19pZCB8fCBpdGVtLm5hbWUgPT0gbGlzdF92aWV3X2lkKVxuXHR1bmxlc3MgbGlzdF92aWV3XG5cdFx0IyDlpoLmnpzkuI3pnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzliJnpu5jorqTov5Tlm57nrKzkuIDkuKrop4blm77vvIzlj43kuYvov5Tlm57nqbpcblx0XHRpZiBleGFjXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF1cblx0cmV0dXJuIGxpc3Rfdmlld1xuXG4j6I635Y+WbGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+5piv5ZCm5piv5pyA6L+R5p+l55yL6KeG5Zu+XG5DcmVhdG9yLmdldExpc3RWaWV3SXNSZWNlbnQgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGlmICFsaXN0X3ZpZXdfaWRcblx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXG5cdGlmIHR5cGVvZihsaXN0X3ZpZXdfaWQpID09IFwic3RyaW5nXCJcblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiAhb2JqZWN0XG5cdFx0XHRyZXR1cm5cblx0XHRsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLHtfaWQ6IGxpc3Rfdmlld19pZH0pXG5cdGVsc2Vcblx0XHRsaXN0VmlldyA9IGxpc3Rfdmlld19pZFxuXHRyZXR1cm4gbGlzdFZpZXc/Lm5hbWUgPT0gXCJyZWNlbnRcIlxuXG5cbiMjI1xuICAgIOS7jmNvbHVtbnPlj4LmlbDkuK3ov4fmu6Tlh7rnlKjkuo7miYvmnLrnq6/mmL7npLrnmoRjb2x1bW5zXG5cdOinhOWIme+8mlxuXHQxLuS8mOWFiOaKimNvbHVtbnPkuK3nmoRuYW1l5a2X5q615o6S5Zyo56ys5LiA5LiqXG5cdDIu5pyA5aSa5Y+q6L+U5ZueNOS4quWtl+autVxuXHQzLuiAg+iZkeWuveWtl+auteWNoOeUqOaVtOihjOinhOWImeadoeS7tuS4i++8jOacgOWkmuWPqui/lOWbnuS4pOihjFxuIyMjXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKS0+XG5cdHJlc3VsdCA9IFtdXG5cdG1heFJvd3MgPSAyIFxuXHRtYXhDb3VudCA9IG1heFJvd3MgKiAyXG5cdGNvdW50ID0gMFxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0ZmllbGRzID0gb2JqZWN0LmZpZWxkc1xuXHR1bmxlc3Mgb2JqZWN0XG5cdFx0cmV0dXJuIGNvbHVtbnNcblx0bmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXHRpc05hbWVDb2x1bW4gPSAoaXRlbSktPlxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdHJldHVybiBpdGVtLmZpZWxkID09IG5hbWVLZXlcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gaXRlbSA9PSBuYW1lS2V5XG5cdGdldEZpZWxkID0gKGl0ZW0pLT5cblx0XHRpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW0uZmllbGRdXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZpZWxkc1tpdGVtXVxuXHRpZiBuYW1lS2V5XG5cdFx0bmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZCAoaXRlbSktPlxuXHRcdFx0cmV0dXJuIGlzTmFtZUNvbHVtbihpdGVtKVxuXHRpZiBuYW1lQ29sdW1uXG5cdFx0ZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKVxuXHRcdGl0ZW1Db3VudCA9IGlmIGZpZWxkLmlzX3dpZGUgdGhlbiAyIGVsc2UgMVxuXHRcdGNvdW50ICs9IGl0ZW1Db3VudFxuXHRcdHJlc3VsdC5wdXNoIG5hbWVDb2x1bW5cblx0Y29sdW1ucy5mb3JFYWNoIChpdGVtKS0+XG5cdFx0ZmllbGQgPSBnZXRGaWVsZChpdGVtKVxuXHRcdHVubGVzcyBmaWVsZFxuXHRcdFx0cmV0dXJuXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXG5cdFx0aWYgY291bnQgPCBtYXhDb3VudCBhbmQgcmVzdWx0Lmxlbmd0aCA8IG1heENvdW50IGFuZCAhaXNOYW1lQ29sdW1uKGl0ZW0pXG5cdFx0XHRjb3VudCArPSBpdGVtQ291bnRcblx0XHRcdGlmIGNvdW50IDw9IG1heENvdW50XG5cdFx0XHRcdHJlc3VsdC5wdXNoIGl0ZW1cblx0XG5cdHJldHVybiByZXN1bHRcblxuIyMjXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSAob2JqZWN0X25hbWUpLT5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGlmIG9iamVjdD8ubGlzdF92aWV3cz8uZGVmYXVsdFxuXHRcdCNUT0RPIOatpOS7o+eggeWPquaYr+aaguaXtuWFvOWuueS7peWJjWNvZGXkuK3lrprkuYnnmoRkZWZhdWx06KeG5Zu+77yM5b6FY29kZeS4reeahGRlZmF1bHTmuIXnkIblrozmiJDlkI7vvIzpnIDopoHliKDpmaTmraTku6PnoIFcblx0XHRkZWZhdWx0VmlldyA9IG9iamVjdC5saXN0X3ZpZXdzLmRlZmF1bHRcblx0ZWxzZVxuXHRcdF8uZWFjaCBvYmplY3Q/Lmxpc3Rfdmlld3MsIChsaXN0X3ZpZXcsIGtleSktPlxuXHRcdFx0aWYgbGlzdF92aWV3Lm5hbWUgPT0gXCJhbGxcIiB8fCBrZXkgPT0gXCJhbGxcIlxuXHRcdFx0XHRkZWZhdWx0VmlldyA9IGxpc3Rfdmlld1xuXHRyZXR1cm4gZGVmYXVsdFZpZXc7XG5cbiMjI1xuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gZGVmYXVsdFZpZXc/LmNvbHVtbnNcblx0aWYgdXNlX21vYmlsZV9jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdFZpZXc/Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnNcblx0XHRlbHNlIGlmIGNvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKVxuXHRyZXR1cm4gY29sdW1uc1xuXG4jIyNcbiAgICDojrflj5blr7nosaHnmoTliJfooajnrKzkuIDkuKrop4blm77mmL7npLrnmoTlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyA9IChvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3KG9iamVjdF9uYW1lKVxuXHRjb2x1bW5zID0gZGVmYXVsdFZpZXc/LmNvbHVtbnNcblx0aWYgdXNlX21vYmlsZV9jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdFZpZXc/Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnNcblx0XHRlbHNlIGlmIGNvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKVxuXHRyZXR1cm4gY29sdW1uc1xuXG4jIyNcblx06I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k6aKd5aSW5Yqg6L2955qE5a2X5q61XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IChvYmplY3RfbmFtZSktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXG5cdHJldHVybiBkZWZhdWx0Vmlldz8uZXh0cmFfY29sdW1uc1xuXG4jIyNcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQgPSAob2JqZWN0X25hbWUpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRpZiBkZWZhdWx0Vmlld1xuXHRcdGlmIGRlZmF1bHRWaWV3LnNvcnRcblx0XHRcdHJldHVybiBkZWZhdWx0Vmlldy5zb3J0XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIFtbXCJjcmVhdGVkXCIsIFwiZGVzY1wiXV1cblxuXG4jIyNcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuIyMjXG5DcmVhdG9yLmlzQWxsVmlldyA9IChsaXN0X3ZpZXcpLT5cblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcImFsbFwiXG5cbiMjI1xuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XG4jIyNcbkNyZWF0b3IuaXNSZWNlbnRWaWV3ID0gKGxpc3RfdmlldyktPlxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwicmVjZW50XCJcblxuIyMjXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiMjI1xuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gKHNvcnQsIHRhYnVsYXJDb2x1bW5zKS0+XG5cdHRhYnVsYXJfc29ydCA9IFtdXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxuXHRcdGlmIF8uaXNBcnJheShpdGVtKVxuXHRcdFx0IyDlhbzlrrnml6fnmoTmlbDmja7moLzlvI9bW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxuXHRcdFx0aWYgaXRlbS5sZW5ndGggPT0gMVxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgXCJhc2NcIl1cblx0XHRcdGVsc2UgaWYgaXRlbS5sZW5ndGggPT0gMlxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgaXRlbVsxXV1cblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdCPmlrDmlbDmja7moLzlvI/vvJpbe2ZpZWxkX25hbWU6ICwgb3JkZXI6IH1dXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcblx0XHRcdGlmIGZpZWxkX25hbWUgJiYgb3JkZXJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihmaWVsZF9uYW1lKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIG9yZGVyXVxuXG5cdHJldHVybiB0YWJ1bGFyX3NvcnRcblxuIyMjXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiMjI1xuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9EWCA9IChzb3J0KS0+XG5cdGR4X3NvcnQgPSBbXVxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcblx0XHRcdCPlhbzlrrnml6fmoLzlvI/vvJpbW1wiZmllbGRfbmFtZVwiLCBcIm9yZGVyXCJdXVxuXHRcdFx0ZHhfc29ydC5wdXNoKGl0ZW0pXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXG5cdFx0XHRcdGR4X3NvcnQucHVzaCBbZmllbGRfbmFtZSwgb3JkZXJdXG5cblx0cmV0dXJuIGR4X3NvcnRcbiIsIkNyZWF0b3IuZ2V0SW5pdFdpZHRoUGVyY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBfc2NoZW1hLCBjb2x1bW5fbnVtLCBpbml0X3dpZHRoX3BlcmNlbnQsIHJlZjtcbiAgX3NjaGVtYSA9IChyZWYgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYuX3NjaGVtYSA6IHZvaWQgMDtcbiAgY29sdW1uX251bSA9IDA7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgXy5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uKGZpZWxkX25hbWUpIHtcbiAgICAgIHZhciBmaWVsZCwgaXNfd2lkZSwgcmVmMSwgcmVmMjtcbiAgICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgICAgaXNfd2lkZSA9IChyZWYxID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYyLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNfd2lkZSkge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtO1xuICAgIHJldHVybiBpbml0X3dpZHRoX3BlcmNlbnQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSkge1xuICB2YXIgX3NjaGVtYSwgZmllbGQsIGlzX3dpZGUsIHJlZiwgcmVmMTtcbiAgX3NjaGVtYSA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKS5fc2NoZW1hO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpO1xuICAgIGlzX3dpZGUgPSAocmVmID0gZmllbGRbZmllbGRfbmFtZV0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjEuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICByZXR1cm4gaXNfd2lkZTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRUYWJ1bGFyT3JkZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBjb2x1bW5zKSB7XG4gIHZhciBvYmosIHJlZiwgcmVmMSwgcmVmMiwgc2V0dGluZywgc29ydDtcbiAgc2V0dGluZyA9IChyZWYgPSBDcmVhdG9yLkNvbGxlY3Rpb25zKSAhPSBudWxsID8gKHJlZjEgPSByZWYuc2V0dGluZ3MpICE9IG51bGwgPyByZWYxLmZpbmRPbmUoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wiXG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBfLm1hcChjb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICB2YXIgZmllbGQ7XG4gICAgZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl07XG4gICAgaWYgKChmaWVsZCAhPSBudWxsID8gZmllbGQudHlwZSA6IHZvaWQgMCkgJiYgIWZpZWxkLmhpZGRlbikge1xuICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gIH0pO1xuICBjb2x1bW5zID0gXy5jb21wYWN0KGNvbHVtbnMpO1xuICBpZiAoc2V0dGluZyAmJiBzZXR0aW5nLnNldHRpbmdzKSB7XG4gICAgc29ydCA9ICgocmVmMiA9IHNldHRpbmcuc2V0dGluZ3NbbGlzdF92aWV3X2lkXSkgIT0gbnVsbCA/IHJlZjIuc29ydCA6IHZvaWQgMCkgfHwgW107XG4gICAgc29ydCA9IF8ubWFwKHNvcnQsIGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICB2YXIgaW5kZXgsIGtleTtcbiAgICAgIGtleSA9IG9yZGVyWzBdO1xuICAgICAgaW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KTtcbiAgICAgIG9yZGVyWzBdID0gaW5kZXggKyAxO1xuICAgICAgcmV0dXJuIG9yZGVyO1xuICAgIH0pO1xuICAgIHJldHVybiBzb3J0O1xuICB9XG4gIHJldHVybiBbXTtcbn07XG5cbkNyZWF0b3IuaW5pdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMsIGV4dHJhX2NvbHVtbnMsIG9iamVjdCwgb3JkZXIsIHJlZjtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXTtcbiAgZXh0cmFfY29sdW1ucyA9IFtcIm93bmVyXCJdO1xuICBkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdO1xuICBpZiAoZGVmYXVsdF9leHRyYV9jb2x1bW5zKSB7XG4gICAgZXh0cmFfY29sdW1ucyA9IF8udW5pb24oZXh0cmFfY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zKTtcbiAgfVxuICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQob2JqZWN0X25hbWUpIHx8IFtdO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkcykgIT0gbnVsbCA/IHJlZltvYmplY3RfbmFtZV0gPSBbXSA6IHZvaWQgMDtcbiAgfVxufTtcblxuQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcgPSBmdW5jdGlvbihkZWZhdWx0X3ZpZXcsIGxpc3RfdmlldywgbGlzdF92aWV3X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRfY29sdW1ucywgZGVmYXVsdF9tb2JpbGVfY29sdW1ucywgb2l0ZW07XG4gIGRlZmF1bHRfY29sdW1ucyA9IGRlZmF1bHRfdmlldyAhPSBudWxsID8gZGVmYXVsdF92aWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcgIT0gbnVsbCA/IGRlZmF1bHRfdmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb2l0ZW0gPSBfLmNsb25lKGxpc3Rfdmlldyk7XG4gIGlmICghXy5oYXMob2l0ZW0sIFwibmFtZVwiKSkge1xuICAgIG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZTtcbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9jb2x1bW5zKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zID0gZGVmYXVsdF9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmNvbHVtbnMpIHtcbiAgICBvaXRlbS5jb2x1bW5zID0gW1wibmFtZVwiXTtcbiAgfVxuICBpZiAoIW9pdGVtLm1vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLm1vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF9tb2JpbGVfY29sdW1ucztcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkgJiYgIV8uaW5jbHVkZShvaXRlbS5jb2x1bW5zLCAnc3BhY2UnKSkge1xuICAgICAgb2l0ZW0uY29sdW1ucy5wdXNoKCdzcGFjZScpO1xuICAgIH1cbiAgfVxuICBpZiAoIW9pdGVtLmZpbHRlcl9zY29wZSkge1xuICAgIG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIjtcbiAgfVxuICBpZiAoIV8uaGFzKG9pdGVtLCBcIl9pZFwiKSkge1xuICAgIG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lO1xuICB9IGVsc2Uge1xuICAgIG9pdGVtLmxhYmVsID0gb2l0ZW0ubGFiZWwgfHwgbGlzdF92aWV3Lm5hbWU7XG4gIH1cbiAgaWYgKF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucykpIHtcbiAgICBvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKTtcbiAgfVxuICBfLmZvckVhY2gob2l0ZW0uZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICBpZiAoIV8uaXNBcnJheShmaWx0ZXIpICYmIF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9pdGVtO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX29iamVjdCwgbGF5b3V0UmVsYXRlZExpc3QsIGxpc3QsIG1hcExpc3QsIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cywgcGVybWlzc2lvbnMsIHJlbGF0ZWRMaXN0LCByZWxhdGVkTGlzdE5hbWVzLCByZWxhdGVkTGlzdE9iamVjdHMsIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCByZWxhdGVkX29iamVjdHMsIHNwYWNlSWQsIHVucmVsYXRlZF9vYmplY3RzLCB1c2VySWQ7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZWxhdGVkTGlzdE9iamVjdHMgPSB7fTtcbiAgICByZWxhdGVkTGlzdE5hbWVzID0gW107XG4gICAgb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzID0gW107XG4gICAgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoX29iamVjdCkge1xuICAgICAgbGF5b3V0UmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRfbGlzdHM7XG4gICAgICBpZiAoXy5pc0FycmF5KGxheW91dFJlbGF0ZWRMaXN0KSkge1xuICAgICAgICBfLmVhY2gobGF5b3V0UmVsYXRlZExpc3QsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICB2YXIgcmVGaWVsZE5hbWUsIHJlT2JqZWN0TmFtZSwgcmVmLCByZWYxLCByZWxhdGVkLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgICAgICByZU9iamVjdE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICByZUZpZWxkTmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlT2JqZWN0TmFtZSkpICE9IG51bGwgPyAocmVmMSA9IHJlZi5maWVsZHNbcmVGaWVsZE5hbWVdKSAhPSBudWxsID8gcmVmMS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICByZWxhdGVkID0ge1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlT2JqZWN0TmFtZSxcbiAgICAgICAgICAgIGNvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXMsXG4gICAgICAgICAgICBtb2JpbGVfY29sdW1uczogaXRlbS5maWVsZF9uYW1lcyxcbiAgICAgICAgICAgIGlzX2ZpbGU6IHJlT2JqZWN0TmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgICAgIGZpbHRlcnNGdW5jdGlvbjogaXRlbS5maWx0ZXJzLFxuICAgICAgICAgICAgc29ydDogaXRlbS5zb3J0LFxuICAgICAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiByZUZpZWxkTmFtZSxcbiAgICAgICAgICAgIGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlLFxuICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkLFxuICAgICAgICAgICAgbGFiZWw6IGl0ZW0ubGFiZWwsXG4gICAgICAgICAgICBhY3Rpb25zOiBpdGVtLmJ1dHRvbnMsXG4gICAgICAgICAgICB2aXNpYmxlX29uOiBpdGVtLnZpc2libGVfb24sXG4gICAgICAgICAgICBwYWdlX3NpemU6IGl0ZW0ucGFnZV9zaXplXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLnB1c2gocmVsYXRlZCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzO1xuICAgICAgfVxuICAgICAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICAgICAgaWYgKCFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgICAgIF8uZWFjaChyZWxhdGVkTGlzdCwgZnVuY3Rpb24ob2JqT3JOYW1lKSB7XG4gICAgICAgICAgdmFyIHJlbGF0ZWQ7XG4gICAgICAgICAgaWYgKF8uaXNPYmplY3Qob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lLFxuICAgICAgICAgICAgICBjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1ucyxcbiAgICAgICAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG9iak9yTmFtZS5tb2JpbGVfY29sdW1ucyxcbiAgICAgICAgICAgICAgaXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgICAgICAgIGZpbHRlcnNGdW5jdGlvbjogb2JqT3JOYW1lLmZpbHRlcnMsXG4gICAgICAgICAgICAgIHNvcnQ6IG9iak9yTmFtZS5zb3J0LFxuICAgICAgICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6ICcnLFxuICAgICAgICAgICAgICBjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgbGFiZWw6IG9iak9yTmFtZS5sYWJlbCxcbiAgICAgICAgICAgICAgYWN0aW9uczogb2JqT3JOYW1lLmFjdGlvbnMsXG4gICAgICAgICAgICAgIHBhZ2Vfc2l6ZTogb2JqT3JOYW1lLnBhZ2Vfc2l6ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUub2JqZWN0TmFtZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE5hbWVzLnB1c2gob2JqT3JOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBtYXBMaXN0ID0ge307XG4gICAgcmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSk7XG4gICAgXy5lYWNoKHJlbGF0ZWRfb2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3RfaXRlbSkge1xuICAgICAgdmFyIGNvbHVtbnMsIG1vYmlsZV9jb2x1bW5zLCBvcmRlciwgcmVsYXRlZCwgcmVsYXRlZE9iamVjdCwgcmVsYXRlZF9maWVsZF9uYW1lLCByZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSwgdGFidWxhcl9vcmRlciwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICBpZiAoIShyZWxhdGVkX29iamVjdF9pdGVtICE9IG51bGwgPyByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWxhdGVkX29iamVjdF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZTtcbiAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXk7XG4gICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICByZWxhdGVkX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFyZWxhdGVkX29iamVjdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgY29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgbW9iaWxlX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRydWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IF8ud2l0aG91dChtb2JpbGVfY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIHRhYnVsYXJfb3JkZXIgPSBDcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIob3JkZXIsIGNvbHVtbnMpO1xuICAgICAgaWYgKC9cXHcrXFwuXFwkXFwuXFx3Ky9nLnRlc3QocmVsYXRlZF9maWVsZF9uYW1lKSkge1xuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX2ZpZWxkX25hbWUucmVwbGFjZSgvXFwkXFwuLywgXCJcIik7XG4gICAgICB9XG4gICAgICByZWxhdGVkID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgbW9iaWxlX2NvbHVtbnM6IG1vYmlsZV9jb2x1bW5zLFxuICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgaXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG4gICAgICB9O1xuICAgICAgcmVsYXRlZE9iamVjdCA9IHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIGlmIChyZWxhdGVkT2JqZWN0KSB7XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmNvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLmNvbHVtbnMgPSByZWxhdGVkT2JqZWN0LmNvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnMpIHtcbiAgICAgICAgICByZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5zb3J0KSB7XG4gICAgICAgICAgcmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbikge1xuICAgICAgICAgIHJlbGF0ZWQuZmlsdGVyc0Z1bmN0aW9uID0gcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QpIHtcbiAgICAgICAgICByZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5sYWJlbCkge1xuICAgICAgICAgIHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZSkge1xuICAgICAgICAgIHJlbGF0ZWQucGFnZV9zaXplID0gcmVsYXRlZE9iamVjdC5wYWdlX3NpemU7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHJlbGF0ZWRMaXN0T2JqZWN0c1tyZWxhdGVkX29iamVjdF9uYW1lXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXBMaXN0W3JlbGF0ZWQub2JqZWN0X25hbWVdID0gcmVsYXRlZDtcbiAgICB9KTtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKTtcbiAgICBwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgdW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cztcbiAgICByZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZShyZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHMpO1xuICAgIF8uZWFjaChyZWxhdGVkTGlzdE9iamVjdHMsIGZ1bmN0aW9uKHYsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBhbGxvd1JlYWQsIGlzQWN0aXZlLCByZWY7XG4gICAgICBpc0FjdGl2ZSA9IHJlbGF0ZWRfb2JqZWN0X25hbWVzLmluZGV4T2YocmVsYXRlZF9vYmplY3RfbmFtZSkgPiAtMTtcbiAgICAgIGFsbG93UmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpICE9IG51bGwgPyByZWYuYWxsb3dSZWFkIDogdm9pZCAwO1xuICAgICAgaWYgKGlzQWN0aXZlICYmIGFsbG93UmVhZCkge1xuICAgICAgICByZXR1cm4gbWFwTGlzdFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHY7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbGlzdCA9IFtdO1xuICAgIGlmIChfLmlzRW1wdHkocmVsYXRlZExpc3ROYW1lcykpIHtcbiAgICAgIGxpc3QgPSBfLnZhbHVlcyhtYXBMaXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKHJlbGF0ZWRMaXN0TmFtZXMsIGZ1bmN0aW9uKG9iamVjdE5hbWUpIHtcbiAgICAgICAgaWYgKG1hcExpc3Rbb2JqZWN0TmFtZV0pIHtcbiAgICAgICAgICByZXR1cm4gbGlzdC5wdXNoKG1hcExpc3Rbb2JqZWN0TmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpKSB7XG4gICAgICBsaXN0ID0gXy5maWx0ZXIobGlzdCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gXy5pbmNsdWRlKF9vYmplY3QuYWxsb3dfcmVsYXRlZExpc3QsIGl0ZW0ub2JqZWN0X25hbWUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsaXN0O1xuICB9O1xufVxuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICByZXR1cm4gXy5maXJzdChDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSkpO1xufTtcblxuXG4vKiBcblx05Y+W5Ye6bGlzdF92aWV3X2lk5a+55bqU55qE6KeG5Zu+77yM5aaC5p6c5LiN5a2Y5Zyo5oiW6ICF5rKh5pyJ5p2D6ZmQ77yM5bCx6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG5cdGV4YWPkuLp0cnVl5pe277yM6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5LiN6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpIHtcbiAgdmFyIGxpc3RWaWV3cywgbGlzdF92aWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIGlmICghKGxpc3RWaWV3cyAhPSBudWxsID8gbGlzdFZpZXdzLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdF92aWV3ID0gXy5maW5kKGxpc3RWaWV3cywgZnVuY3Rpb24oaXRlbSkge1xuICAgIHJldHVybiBpdGVtLl9pZCA9PT0gbGlzdF92aWV3X2lkIHx8IGl0ZW0ubmFtZSA9PT0gbGlzdF92aWV3X2lkO1xuICB9KTtcbiAgaWYgKCFsaXN0X3ZpZXcpIHtcbiAgICBpZiAoZXhhYykge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0X3ZpZXcgPSBsaXN0Vmlld3NbMF07XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0X3ZpZXc7XG59O1xuXG5DcmVhdG9yLmdldExpc3RWaWV3SXNSZWNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKSB7XG4gIHZhciBsaXN0Vmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgbGlzdF92aWV3X2lkID09PSBcInN0cmluZ1wiKSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3MsIHtcbiAgICAgIF9pZDogbGlzdF92aWV3X2lkXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWQ7XG4gIH1cbiAgcmV0dXJuIChsaXN0VmlldyAhPSBudWxsID8gbGlzdFZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcblx06KeE5YiZ77yaXG5cdDEu5LyY5YWI5oqKY29sdW1uc+S4reeahG5hbWXlrZfmrrXmjpLlnKjnrKzkuIDkuKpcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXG4gKi9cblxuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBjb2x1bW5zKSB7XG4gIHZhciBjb3VudCwgZmllbGQsIGZpZWxkcywgZ2V0RmllbGQsIGlzTmFtZUNvbHVtbiwgaXRlbUNvdW50LCBtYXhDb3VudCwgbWF4Um93cywgbmFtZUNvbHVtbiwgbmFtZUtleSwgb2JqZWN0LCByZXN1bHQ7XG4gIHJlc3VsdCA9IFtdO1xuICBtYXhSb3dzID0gMjtcbiAgbWF4Q291bnQgPSBtYXhSb3dzICogMjtcbiAgY291bnQgPSAwO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGZpZWxkcyA9IG9iamVjdC5maWVsZHM7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cbiAgbmFtZUtleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgaXNOYW1lQ29sdW1uID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gaXRlbS5maWVsZCA9PT0gbmFtZUtleTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZW0gPT09IG5hbWVLZXk7XG4gICAgfVxuICB9O1xuICBnZXRGaWVsZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZpZWxkc1tpdGVtXTtcbiAgICB9XG4gIH07XG4gIGlmIChuYW1lS2V5KSB7XG4gICAgbmFtZUNvbHVtbiA9IGNvbHVtbnMuZmluZChmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pO1xuICAgIH0pO1xuICB9XG4gIGlmIChuYW1lQ29sdW1uKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChuYW1lQ29sdW1uKTtcbiAgICBpdGVtQ291bnQgPSBmaWVsZC5pc193aWRlID8gMiA6IDE7XG4gICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgIHJlc3VsdC5wdXNoKG5hbWVDb2x1bW4pO1xuICB9XG4gIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgZmllbGQgPSBnZXRGaWVsZChpdGVtKTtcbiAgICBpZiAoIWZpZWxkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBpZiAoY291bnQgPCBtYXhDb3VudCAmJiByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgJiYgIWlzTmFtZUNvbHVtbihpdGVtKSkge1xuICAgICAgY291bnQgKz0gaXRlbUNvdW50O1xuICAgICAgaWYgKGNvdW50IDw9IG1heENvdW50KSB7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKlxuICAgIOiOt+WPlum7mOiupOinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXcsIG9iamVjdCwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgfVxuICBpZiAob2JqZWN0ICE9IG51bGwgPyAocmVmID0gb2JqZWN0Lmxpc3Rfdmlld3MpICE9IG51bGwgPyByZWZbXCJkZWZhdWx0XCJdIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3c1tcImRlZmF1bHRcIl07XG4gIH0gZWxzZSB7XG4gICAgXy5lYWNoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0Lmxpc3Rfdmlld3MgOiB2b2lkIDAsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG4gICAgICBpZiAobGlzdF92aWV3Lm5hbWUgPT09IFwiYWxsXCIgfHwga2V5ID09PSBcImFsbFwiKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmlldyA9IGxpc3RfdmlldztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZpZXc7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICh1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwKSB7XG4gICAgICBjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChjb2x1bW5zKSB7XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2x1bW5zO1xufTtcblxuXG4vKlxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOesrOS4gOS4quinhuWbvuaYvuekuueahOWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmNvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICh1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwKSB7XG4gICAgICBjb2x1bW5zID0gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnM7XG4gICAgfSBlbHNlIGlmIChjb2x1bW5zKSB7XG4gICAgICBjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2x1bW5zO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuZXh0cmFfY29sdW1ucyA6IHZvaWQgMDtcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE6buY6K6k5o6S5bqPXG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgaWYgKGRlZmF1bHRWaWV3KSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3LnNvcnQpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0Vmlldy5zb3J0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXTtcbiAgICB9XG4gIH1cbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKZBbGwgdmlld1xuICovXG5cbkNyZWF0b3IuaXNBbGxWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwiYWxsXCI7XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyID0gZnVuY3Rpb24oc29ydCwgdGFidWxhckNvbHVtbnMpIHtcbiAgdmFyIHRhYnVsYXJfc29ydDtcbiAgdGFidWxhcl9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGNvbHVtbl9pbmRleCwgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgaWYgKGl0ZW0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBcImFzY1wiXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBvcmRlcl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRhYnVsYXJfc29ydDtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBkeF9zb3J0O1xuICBkeF9zb3J0ID0gW107XG4gIF8uZWFjaChzb3J0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChbZmllbGRfbmFtZSwgb3JkZXJdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZHhfc29ydDtcbn07XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFx0X3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIn1cblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuXHRcdFx0cmVnRXg6IF9yZWdFeE1lc3NhZ2VzLFxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguY29kZSxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJylcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5zdGFydHVwICgpLT5cblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cblx0XHRfcmVnRXhNZXNzYWdlcy5wdXNoIHtleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCwgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwifVxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXG5cdFx0fSkiLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpO1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVnRXhNZXNzYWdlcztcbiAgICBfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW107XG4gICAgX3JlZ0V4TWVzc2FnZXMucHVzaCh7XG4gICAgICBleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCxcbiAgICAgIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIlxuICAgIH0pO1xuICAgIHJldHVybiBTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuICAgICAgcmVnRXg6IF9yZWdFeE1lc3NhZ2VzXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiLy8g5Zug5Li6bWV0ZW9y57yW6K+RY29mZmVlc2NyaXB05Lya5a+86Ie0ZXZhbOWHveaVsOaKpemUme+8jOaJgOS7peWNleeLrOWGmeWcqOS4gOS4qmpz5paH5Lu25Lit44CCXG5DcmVhdG9yLmV2YWxJbkNvbnRleHQgPSBmdW5jdGlvbihqcywgY29udGV4dCkge1xuICAgIC8vIyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgdGhlIGluLWxpbmUgYW5vbnltb3VzIGZ1bmN0aW9uIHdlIC5jYWxsIHdpdGggdGhlIHBhc3NlZCBjb250ZXh0XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyBcbiAgICBcdHJldHVybiBldmFsKGpzKTsgXG5cdH0uY2FsbChjb250ZXh0KTtcbn1cblxuXG5DcmVhdG9yLmV2YWwgPSBmdW5jdGlvbihqcyl7XG5cdHRyeXtcblx0XHRyZXR1cm4gZXZhbChqcylcblx0fWNhdGNoIChlKXtcblx0XHRjb25zb2xlLmVycm9yKGUsIGpzKTtcblx0fVxufTsiLCJcdGdldE9wdGlvbiA9IChvcHRpb24pLT5cblx0XHRmb28gPSBvcHRpb24uc3BsaXQoXCI6XCIpXG5cdFx0aWYgZm9vLmxlbmd0aCA+IDJcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1sxXSwgY29sb3I6IGZvb1syXX1cblx0XHRlbHNlIGlmIGZvby5sZW5ndGggPiAxXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV19XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzBdfVxuXG5cdGNvbnZlcnRGaWVsZCA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGQsIHNwYWNlSWQpLT5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgJiYgc3BhY2VJZCAmJiBmaWVsZC50eXBlID09ICdzZWxlY3QnXG5cdFx0XHRjb2RlID0gZmllbGQucGlja2xpc3QgfHwgXCIje29iamVjdF9uYW1lfS4je2ZpZWxkX25hbWV9XCI7XG5cdFx0XHRpZiBjb2RlXG5cdFx0XHRcdHBpY2tsaXN0ID0gQ3JlYXRvci5nZXRQaWNrbGlzdChjb2RlLCBzcGFjZUlkKTtcblx0XHRcdFx0aWYgcGlja2xpc3Rcblx0XHRcdFx0XHRvcHRpb25zID0gW107XG5cdFx0XHRcdFx0YWxsT3B0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IENyZWF0b3IuZ2V0UGlja0xpc3RPcHRpb25zKHBpY2tsaXN0KVxuXHRcdFx0XHRcdHBpY2tsaXN0T3B0aW9ucyA9IF8uc29ydEJ5KHBpY2tsaXN0T3B0aW9ucywgJ3NvcnRfbm8nKT8ucmV2ZXJzZSgpO1xuXHRcdFx0XHRcdF8uZWFjaCBwaWNrbGlzdE9wdGlvbnMsIChpdGVtKS0+XG5cdFx0XHRcdFx0XHRsYWJlbCA9IGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0dmFsdWUgPSBpdGVtLnZhbHVlIHx8IGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0YWxsT3B0aW9ucy5wdXNoKHtsYWJlbDogbGFiZWwsIHZhbHVlOiB2YWx1ZSwgZW5hYmxlOiBpdGVtLmVuYWJsZSwgY29sb3I6IGl0ZW0uY29sb3J9KVxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbmFibGVcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5wdXNoKHtsYWJlbDogbGFiZWwsIHZhbHVlOiB2YWx1ZSwgY29sb3I6IGl0ZW0uY29sb3J9KVxuXHRcdFx0XHRcdFx0aWYgaXRlbS5kZWZhdWx0XG5cdFx0XHRcdFx0XHRcdGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlXG5cdFx0XHRcdFx0aWYgb3B0aW9ucy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRmaWVsZC5vcHRpb25zID0gb3B0aW9uc1xuXHRcdFx0XHRcdGlmIGFsbE9wdGlvbnMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0ZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnNcblx0XHRyZXR1cm4gZmllbGQ7XG5cblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gKG9iamVjdCwgc3BhY2VJZCktPlxuXHRcdGlmICFvYmplY3Rcblx0XHRcdHJldHVyblxuXHRcdF8uZm9yRWFjaCBvYmplY3QudHJpZ2dlcnMsICh0cmlnZ2VyLCBrZXkpLT5cblxuXHRcdFx0aWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiKVxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyPy5fdG9kb1xuXHRcdFx0XHRfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcblx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2NvZGV9KVwiKVxuXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxuXHRcdFx0XHRcdCPlj6rmnIl1cGRhdGXml7bvvIwgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMg5omN5pyJ5YC8XG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YeP77yM5bCk5YW25pivQ29sbGVjdGlvblxuXHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXsje190b2RvX2Zyb21fZGJ9fSlcIilcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIlxuXHRcdFx0XHRfdG9kbyA9IHRyaWdnZXIudG9kb1xuXHRcdFx0XHRpZiBfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pXG5cdFx0XHRcdFx0dHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKClcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cblx0XHRcdFx0aWYgZmllbGQub21pdFxuXHRcdFx0XHRcdCMgb21pdOWtl+auteWujOWFqOmakOiXj+S4jeaYvuekulxuXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IHRydWVcblxuXHRcdFx0XHRpZiBmaWVsZC5yZXF1aXJlZCAmJiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRcdCMg6YCa55So5b+F5aGr5a2X5q61ICMyOTUy77yM5b+F5aGr5a2X5q616K6+572u5Li66Z2e5Y+q6K+7XG5cdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSBmYWxzZVxuXG5cdFx0XHRcdHN5c3RlbUJhc2VGaWVsZHMgPSBDcmVhdG9yLmdldFN5c3RlbUJhc2VGaWVsZHMoKVxuXHRcdFx0XHRpZiBzeXN0ZW1CYXNlRmllbGRzLmluZGV4T2Yoa2V5KSA+IC0xXG5cdFx0XHRcdFx0IyDlvLrliLbliJvlu7rkurrliJvlu7rml7bpl7TnrYnlrZfmrrXkuLrlj6ror7tcblx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5hY3Rpb25zLCAoYWN0aW9uLCBrZXkpLT5cblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uPy5fdG9kb1xuXHRcdFx0XHRfdG9kb19mcm9tX2RiID0gYWN0aW9uPy50b2RvXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSlcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZVxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYilcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihDcmVhdG9yLmFjdGlvbnNCeU5hbWVbX3RvZG9fZnJvbV9kYl0pXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbigpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yXG5cblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/Ll92aXNpYmxlXG5cdFx0XHRcdGlmIF92aXNpYmxlXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKF92aXNpYmxlKVxuXHRcdFx0XHRcdFx0XHRfdmlzaWJsZSA9IF92aXNpYmxlLnRyaW0oKVxuXHRcdFx0XHRcdFx0aWYgU3RlZWRvcy5pc0V4cHJlc3Npb24oX3Zpc2libGUpXG5cdFx0XHRcdFx0XHRcdCMg5pSv5oyB6aG16Z2i5biD5bGA5Lit5YaZdmlzaWJsZV9vbuWHveaVsOihqOi+vuW8j++8jOmhtemdouW4g+WxgOaMiemSrueahOaYvuekuuadoeS7tuS4jeeUn+aViCAjMzM0MFxuXHRcdFx0XHRcdFx0XHRhY3Rpb24udmlzaWJsZSA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfcGVybWlzc2lvbnMsIHJlY29yZCkgLT5cblx0XHRcdFx0XHRcdFx0XHRnbG9iYWxEYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgQ3JlYXRvci5VU0VSX0NPTlRFWFQsIHtub3c6IG5ldyBEYXRlKCl9KVxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBTdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbihfdmlzaWJsZSwgcmVjb3JkLCBcIiNcIiwgZ2xvYmFsRGF0YSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0YWN0aW9uLnZpc2libGUgPSBDcmVhdG9yLmV2YWwoXCIoI3tfdmlzaWJsZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZVxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XG5cdFx0XHRcdF90b2RvID0gYWN0aW9uPy50b2RvXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHRhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpXG5cblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/LnZpc2libGVcblxuXHRcdFx0XHRpZiBfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpXG5cdFx0XHRcdFx0YWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKVxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cblx0XHRcdGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcblxuXHRcdFx0aWYgZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0XHQj5pSv5oyBXFxu5oiW6ICF6Iux5paH6YCX5Y+35YiG5YmyLFxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBvcHRpb24uaW5kZXhPZihcIixcIilcblx0XHRcdFx0XHRcdFx0b3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIilcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdFx0I+aUr+aMgeaVsOe7hOS4reebtOaOpeWumuS5ieavj+S4qumAiemhueeahOeugOeJiOagvOW8j+Wtl+espuS4slxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKG9wdGlvbilcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChvcHRpb24pXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0Xy5lYWNoIGZpZWxkLm9wdGlvbnMsICh2LCBrKS0+XG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IHYsIHZhbHVlOiBrfVxuXHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLl9vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnN9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLnJlZ0V4XG5cdFx0XHRcdGlmIHJlZ0V4XG5cdFx0XHRcdFx0ZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLl9yZWdFeFxuXHRcdFx0XHRpZiByZWdFeFxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQucmVnRXggPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWdFeH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG1pbiA9IGZpZWxkLm1pblxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWluKVxuXHRcdFx0XHRcdGZpZWxkLl9taW4gPSBtaW4udG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtaW4gPSBmaWVsZC5fbWluXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWluKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQubWluID0gQ3JlYXRvci5ldmFsKFwiKCN7bWlufSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0bWF4ID0gZmllbGQubWF4XG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtYXgpXG5cdFx0XHRcdFx0ZmllbGQuX21heCA9IG1heC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG1heCA9IGZpZWxkLl9tYXhcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtYXgpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5tYXggPSBDcmVhdG9yLmV2YWwoXCIoI3ttYXh9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxuXHRcdFx0XHRcdF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT0gT2JqZWN0ICYmIF90eXBlICE9IFN0cmluZyAmJiBfdHlwZSAhPSBOdW1iZXIgJiYgX3R5cGUgIT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKVxuXHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNTdHJpbmcoX3R5cGUpXG5cdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3IuZXZhbChcIigje190eXBlfSlcIilcblx0XHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0ZmllbGQuX3JlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90by50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKClcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQuX3JlZmVyZW5jZV90b1xuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gfHwgZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnNGdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3IuZXZhbChcIigje3JlZmVyZW5jZV90b30pXCIpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2NyZWF0ZUZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7YmVmb3JlT3BlbkZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyc0Z1bmN0aW9ufSlcIilcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHRmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZVxuXG5cdFx0XHRcdGlmICFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tkZWZhdWx0VmFsdWV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cdFx0XHRcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNGdW5jdGlvbihpc19jb21wYW55X2xpbWl0ZWQpXG5cdFx0XHRcdFx0ZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvci5ldmFsKFwiKCN7aXNfY29tcGFueV9saW1pdGVkfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpIC0+XG5cdFx0XHQjIyNcblx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcblx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcblx0XHRcdOWmgu+8mlxuXHRcdFx0ZmlsdGVyczogKCktPlxuXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG5cdFx0XHTlpoLvvJpcblx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHRdXVxuXHRcdFx05oiWXG5cdFx0XHRmaWx0ZXJzOiBbe1xuXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxuXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cblx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHR9XVxuXHRcdFx0IyMjXG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKClcblx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvci5ldmFsKFwiKCN7bGlzdF92aWV3Ll9maWx0ZXJzfSlcIilcblx0XHRcdGVsc2Vcblx0XHRcdFx0Xy5mb3JFYWNoIGxpc3Rfdmlldy5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cblx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoZmlsdGVyKVxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0RhdGUoZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5pivRGF0Zeexu+Wei++8jOWImWZpbHRlclsyXeWAvOWIsOWJjeerr+S8muiHquWKqOi9rOaIkOWtl+espuS4su+8jOagvOW8j++8mlwiMjAxOC0wMy0yOVQwMzo0MzoyMS43ODdaXCJcblx0XHRcdFx0XHRcdFx0XHQjIOWMheaLrGdyaWTliJfooajor7fmsYLnmoTmjqXlj6PlnKjlhoXnmoTmiYDmnIlPRGF0YeaOpeWPo++8jERhdGXnsbvlnovlrZfmrrXpg73kvJrku6XkuIrov7DmoLzlvI/ov5Tlm55cblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkRBVEVcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlclsyXX0pXCIpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJEQVRFXCJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGZpbHRlcilcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRGF0ZShmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5faXNfZGF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIuX2lzX2RhdGUgPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSlcblxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0aWYgb2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkgb2JqZWN0LmZvcm0sIChrZXksIHZhbCktPlxuXHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbih2YWwpXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsICsgJyc7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRlbHNlIGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgb2JqZWN0LmZvcm1cblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlIG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cblx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJylcblx0XHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZF9saXN0cywgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkX2xpc3RzLCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKVxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKClcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXG5cblx0XHRyZXR1cm4gb2JqZWN0XG5cblxuIiwidmFyIGNvbnZlcnRGaWVsZCwgZ2V0T3B0aW9uO1xuXG5nZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdmFyIGZvbztcbiAgZm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKTtcbiAgaWYgKGZvby5sZW5ndGggPiAyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdLFxuICAgICAgY29sb3I6IGZvb1syXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZm9vLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1swXVxuICAgIH07XG4gIH1cbn07XG5cbmNvbnZlcnRGaWVsZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCkge1xuICB2YXIgYWxsT3B0aW9ucywgY29kZSwgb3B0aW9ucywgcGlja2xpc3QsIHBpY2tsaXN0T3B0aW9ucywgcmVmO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICBjb2RlID0gZmllbGQucGlja2xpc3QgfHwgKG9iamVjdF9uYW1lICsgXCIuXCIgKyBmaWVsZF9uYW1lKTtcbiAgICBpZiAoY29kZSkge1xuICAgICAgcGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuICAgICAgaWYgKHBpY2tsaXN0KSB7XG4gICAgICAgIG9wdGlvbnMgPSBbXTtcbiAgICAgICAgYWxsT3B0aW9ucyA9IFtdO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdCk7XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IChyZWYgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJykpICE9IG51bGwgPyByZWYucmV2ZXJzZSgpIDogdm9pZCAwO1xuICAgICAgICBfLmVhY2gocGlja2xpc3RPcHRpb25zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIGxhYmVsLCB2YWx1ZTtcbiAgICAgICAgICBsYWJlbCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lO1xuICAgICAgICAgIGFsbE9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbmFibGU6IGl0ZW0uZW5hYmxlLFxuICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXRlbS5lbmFibGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtW1wiZGVmYXVsdFwiXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0LCBzcGFjZUlkKSB7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIGtleSkge1xuICAgIHZhciBfdG9kbywgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiO1xuICAgIGlmICgoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikpIHtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXIgIT0gbnVsbCA/IHRyaWdnZXIuX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSB7XG4gICAgICBfdG9kbyA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICAgIHZhciBzeXN0ZW1CYXNlRmllbGRzO1xuICAgICAgaWYgKGZpZWxkLm9taXQpIHtcbiAgICAgICAgZmllbGQuaGlkZGVuID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWVsZC5yZXF1aXJlZCAmJiBmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmaWVsZC5yZWFkb25seSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgc3lzdGVtQmFzZUZpZWxkcyA9IENyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcygpO1xuICAgICAgaWYgKHN5c3RlbUJhc2VGaWVsZHMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiLCBfdmlzaWJsZSwgZXJyb3I7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKSkge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKCl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl92aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF8uaXNTdHJpbmcoX3Zpc2libGUpKSB7XG4gICAgICAgICAgICBfdmlzaWJsZSA9IF92aXNpYmxlLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNFeHByZXNzaW9uKF92aXNpYmxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zLCByZWNvcmQpIHtcbiAgICAgICAgICAgICAgdmFyIGdsb2JhbERhdGE7XG4gICAgICAgICAgICAgIGdsb2JhbERhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBDcmVhdG9yLlVTRVJfQ09OVEVYVCwge1xuICAgICAgICAgICAgICAgIG5vdzogbmV3IERhdGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIFN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uKF92aXNpYmxlLCByZWNvcmQsIFwiI1wiLCBnbG9iYWxEYXRhKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3Zpc2libGUgKyBcIilcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImFjdGlvbi52aXNpYmxlIHRvIGZ1bmN0aW9uIGVycm9yOiBcIiwgZXJyb3IsIF92aXNpYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QuYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBrZXkpIHtcbiAgICAgIHZhciBfdG9kbywgX3Zpc2libGU7XG4gICAgICBfdG9kbyA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDA7XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICBhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi52aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlICYmIF8uaXNGdW5jdGlvbihfdmlzaWJsZSkpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICB2YXIgX29wdGlvbnMsIF90eXBlLCBiZWZvcmVPcGVuRnVuY3Rpb24sIGNyZWF0ZUZ1bmN0aW9uLCBkZWZhdWx0VmFsdWUsIGVycm9yLCBmaWx0ZXJzRnVuY3Rpb24sIGlzX2NvbXBhbnlfbGltaXRlZCwgbWF4LCBtaW4sIG9wdGlvbnMsIG9wdGlvbnNGdW5jdGlvbiwgcmVmZXJlbmNlX3RvLCByZWdFeDtcbiAgICBmaWVsZCA9IGNvbnZlcnRGaWVsZChvYmplY3QubmFtZSwga2V5LCBmaWVsZCwgc3BhY2VJZCk7XG4gICAgaWYgKGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMuc3BsaXQoXCJcXG5cIiksIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIHZhciBvcHRpb25zO1xuICAgICAgICAgIGlmIChvcHRpb24uaW5kZXhPZihcIixcIikpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihfb3B0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihfb3B0aW9uKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICBpZiAoXy5pc1N0cmluZyhvcHRpb24pKSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgXy5lYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goe1xuICAgICAgICAgIGxhYmVsOiB2LFxuICAgICAgICAgIHZhbHVlOiBrXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgaWYgKG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0gZmllbGQuX29wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9ucyArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVnRXggPSBmaWVsZC5fcmVnRXg7XG4gICAgICBpZiAocmVnRXgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5yZWdFeCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVnRXggKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtaW4gPSBmaWVsZC5taW47XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1pbikpIHtcbiAgICAgICAgZmllbGQuX21pbiA9IG1pbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtaW4gPSBmaWVsZC5fbWluO1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWluKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1pbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWluICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgbWF4ID0gZmllbGQubWF4O1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihtYXgpKSB7XG4gICAgICAgIGZpZWxkLl9tYXggPSBtYXgudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWF4ID0gZmllbGQuX21heDtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG1heCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5tYXggPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG1heCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9PSBPYmplY3QgJiYgX3R5cGUgIT09IFN0cmluZyAmJiBfdHlwZSAhPT0gTnVtYmVyICYmIF90eXBlICE9PSBCb29sZWFuICYmICFfLmlzQXJyYXkoX3R5cGUpKSB7XG4gICAgICAgICAgZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmaWVsZC5hdXRvZm9ybSkge1xuICAgICAgICBfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLl90eXBlO1xuICAgICAgICBpZiAoX3R5cGUgJiYgXy5pc1N0cmluZyhfdHlwZSkpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3R5cGUgKyBcIilcIik7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgIGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5fcmVmZXJlbmNlX3RvID0gcmVmZXJlbmNlX3RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uID0gYmVmb3JlT3BlbkZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5fcmVmZXJlbmNlX3RvO1xuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb247XG4gICAgICBiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiB8fCBmaWVsZC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICBpZiAob3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG9wdGlvbnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWZlcmVuY2VfdG8gJiYgXy5pc1N0cmluZyhyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgcmVmZXJlbmNlX3RvICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBjcmVhdGVGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgYmVmb3JlT3BlbkZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJzRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5fZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKCFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGRlZmF1bHRWYWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc0Z1bmN0aW9uKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgIGlmIChpc19jb21wYW55X2xpbWl0ZWQgJiYgXy5pc1N0cmluZyhpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgaXNfY29tcGFueV9saW1pdGVkICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgXy5mb3JFYWNoKG9iamVjdC5saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuXG4gICAgLypcbiAgICBcdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcbiAgICBcdFx0XHTorqnov4fomZHlmajmlK/mjIHkuKTnp41mdW5jdGlvbuaWueW8j++8mlxuICAgIFx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuICAgIFx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdF1dXG4gICAgXHRcdFx05oiWXG4gICAgXHRcdFx0ZmlsdGVyczogW3tcbiAgICBcdFx0XHRcdFwiZmllbGRcIjogXCJvYmplY3RfbmFtZVwiXG4gICAgXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuICAgIFx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XG4gICAgXHRcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHR9XVxuICAgICAqL1xuICAgIGlmIChfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHJldHVybiBsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbGlzdF92aWV3Ll9maWx0ZXJzICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXy5mb3JFYWNoKGxpc3Rfdmlldy5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gMyAmJiBfLmlzRGF0ZShmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkRBVEVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJGVU5DVElPTlwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyWzJdICsgXCIpXCIpO1xuICAgICAgICAgICAgICBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkRBVEVcIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRGF0ZShmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5faXNfZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLl92YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLl9pc19kYXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXIudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmIChvYmplY3QuZm9ybSAmJiAhXy5pc1N0cmluZyhvYmplY3QuZm9ybSkpIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgIHJldHVybiB2YWwgKyAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKG9iamVjdC5mb3JtKSB7XG4gICAgICBvYmplY3QuZm9ybSA9IEpTT04ucGFyc2Uob2JqZWN0LmZvcm0sIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAgIGlmIChfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRfbGlzdHMsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJmaWx0ZXJzX2NvZGVcIiwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZF9saXN0cywgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZmlsdGVyc19jb2RlXCIsIHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRMaXN0LCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge31cblxuQ3JlYXRvci5Gb3JtdWxhci5QUkVGSVggPSBcIl9WQUxVRVNcIlxuXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IChwcmVmaXgsZmllbGRWYXJpYWJsZSktPlxuXHRyZWcgPSAvKFxce1tee31dKlxcfSkvZztcblxuXHRyZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UgcmVnLCAobSwgJDEpLT5cblx0XHRyZXR1cm4gcHJlZml4ICsgJDEucmVwbGFjZSgvXFx7XFxzKi8sXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LyxcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csXCJcXFwiXVtcXFwiXCIpO1xuXG5cdHJldHVybiByZXZcblxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSAoZm9ybXVsYV9zdHIpLT5cblx0aWYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbkNyZWF0b3IuRm9ybXVsYXIucnVuID0gKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucyktPlxuXHRpZiBmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKVxuXG5cdFx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnM/LmV4dGVuZClcblx0XHRcdGV4dGVuZCA9IHRydWVcblxuXHRcdF9WQUxVRVMgPSB7fVxuXHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVClcblx0XHRpZiBleHRlbmRcblx0XHRcdF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnM/LnVzZXJJZCwgb3B0aW9ucz8uc3BhY2VJZCkpXG5cdFx0Zm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpXG5cblx0XHR0cnlcblx0XHRcdGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpICAgIyDmraTlpITkuI3og73nlKh3aW5kb3cuZXZhbCDvvIzkvJrlr7zoh7Tlj5jph4/kvZznlKjln5/lvILluLhcblx0XHRcdHJldHVybiBkYXRhXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfVwiLCBlKVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdHRvYXN0cj8uZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIilcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiAje2Zvcm11bGFfc3RyfSN7ZX1cIlxuXG5cdHJldHVybiBmb3JtdWxhX3N0clxuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9O1xuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiO1xuXG5DcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYSA9IGZ1bmN0aW9uKHByZWZpeCwgZmllbGRWYXJpYWJsZSkge1xuICB2YXIgcmVnLCByZXY7XG4gIHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuICByZXYgPSBmaWVsZFZhcmlhYmxlLnJlcGxhY2UocmVnLCBmdW5jdGlvbihtLCAkMSkge1xuICAgIHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLywgXCJbXFxcIlwiKS5yZXBsYWNlKC9cXHMqXFx9LywgXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLCBcIlxcXCJdW1xcXCJcIik7XG4gIH0pO1xuICByZXR1cm4gcmV2O1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhX3N0cikge1xuICBpZiAoXy5pc1N0cmluZyhmb3JtdWxhX3N0cikgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIntcIikgPiAtMSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwifVwiKSA+IC0xKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSBmdW5jdGlvbihmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpIHtcbiAgdmFyIF9WQUxVRVMsIGRhdGEsIGUsIGV4dGVuZDtcbiAgaWYgKGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpKSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLmV4dGVuZCA6IHZvaWQgMCkpIHtcbiAgICAgIGV4dGVuZCA9IHRydWU7XG4gICAgfVxuICAgIF9WQUxVRVMgPSB7fTtcbiAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpO1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBDcmVhdG9yLmdldFVzZXJDb250ZXh0KG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMudXNlcklkIDogdm9pZCAwLCBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNwYWNlSWQgOiB2b2lkIDApKTtcbiAgICB9XG4gICAgZm9ybXVsYV9zdHIgPSBDcmVhdG9yLkZvcm11bGFyLl9wcmVwZW5kUHJlZml4Rm9yRm9ybXVsYShcInRoaXNcIiwgZm9ybXVsYV9zdHIpO1xuICAgIHRyeSB7XG4gICAgICBkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIsIGUpO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBpZiAodHlwZW9mIHRvYXN0ciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0b2FzdHIgIT09IG51bGwpIHtcbiAgICAgICAgICB0b2FzdHIuZXJyb3IoXCLlhazlvI/miafooYzlh7rplJnkuobvvIzor7fmo4Dmn6XlhazlvI/phY3nva7mmK/lkKbmraPnoa7vvIFcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyICsgZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmb3JtdWxhX3N0cjtcbn07XG4iLCJjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fSAgICMg5q2k5a+56LGh5Y+q6IO95Zyo56Gu5L+d5omA5pyJT2JqZWN05Yid5aeL5YyW5a6M5oiQ5ZCO6LCD55So77yMIOWQpuWImeiOt+WPluWIsOeahG9iamVjdOS4jeWFqFxuXG5DcmVhdG9yLmZvcm1hdE9iamVjdE5hbWUgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpXG5cdFx0b2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwuJywgJ2cnKSwgJ18nKVxuXHRyZXR1cm4gb2JqZWN0X25hbWVcblxuQ3JlYXRvci5PYmplY3QgPSAob3B0aW9ucyktPlxuXHRfYmFzZU9iamVjdCA9IENyZWF0b3IuYmFzZU9iamVjdFxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRfYmFzZU9iamVjdCA9IHthY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyAsIGZpZWxkczoge30sIHRyaWdnZXJzOiB7fSwgcGVybWlzc2lvbl9zZXQ6IHt9fVxuXHRzZWxmID0gdGhpc1xuXHRpZiAoIW9wdGlvbnMubmFtZSlcblx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG5cblx0c2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWVcblx0c2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2Vcblx0c2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lXG5cdHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsXG5cdHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvblxuXHRzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvblxuXHRzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXdcblx0c2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtXG5cdHNlbGYucmVsYXRlZExpc3QgPSBvcHRpb25zLnJlbGF0ZWRMaXN0XG5cdHNlbGYucmVsYXRlZF9saXN0cyA9IG9wdGlvbnMucmVsYXRlZF9saXN0c1xuXHRzZWxmLnZlcnNpb24gPSBvcHRpb25zLnZlcnNpb24gfHwgMS4wXG5cdGlmICFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09IHRydWVcblx0XHRzZWxmLmlzX2VuYWJsZSA9IHRydWVcblx0ZWxzZVxuXHRcdHNlbGYuaXNfZW5hYmxlID0gZmFsc2Vcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKVxuXHRcdFx0c2VsZi5hbGxvd19jdXN0b21BY3Rpb25zID0gb3B0aW9ucy5hbGxvd19jdXN0b21BY3Rpb25zXG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2V4Y2x1ZGVfYWN0aW9ucycpXG5cdFx0XHRzZWxmLmV4Y2x1ZGVfYWN0aW9ucyA9IG9wdGlvbnMuZXhjbHVkZV9hY3Rpb25zXG5cdFx0aWYgXy5oYXMob3B0aW9ucywgJ2FsbG93X3JlbGF0ZWRMaXN0Jylcblx0XHRcdHNlbGYuYWxsb3dfcmVsYXRlZExpc3QgPSBvcHRpb25zLmFsbG93X3JlbGF0ZWRMaXN0XG5cdHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaFxuXHRzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzXG5cdHNlbGYuZW5hYmxlX3Rhc2tzID0gb3B0aW9ucy5lbmFibGVfdGFza3Ncblx0c2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3Rlc1xuXHRzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0XG5cdHNlbGYuZW5hYmxlX2V2ZW50cyA9IG9wdGlvbnMuZW5hYmxlX2V2ZW50c1xuXHRpZiBvcHRpb25zLnBhZ2luZ1xuXHRcdHNlbGYucGFnaW5nID0gb3B0aW9ucy5wYWdpbmdcblx0c2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlblxuXHRzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09IHVuZGVmaW5lZCkgb3Igb3B0aW9ucy5lbmFibGVfYXBpXG5cdHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b21cblx0c2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZVxuXHRzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXNcblx0c2VsZi5lbmFibGVfcHJvY2VzcyA9IG9wdGlvbnMuZW5hYmxlX3Byb2Nlc3Ncblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXG5cdFx0XHRzZWxmLmVuYWJsZV90cmVlID0gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZVxuXHRcdFx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXG5cdGVsc2Vcblx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcblx0XHRzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZVxuXHRzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvd1xuXHRzZWxmLmZpbHRlcl9jb21wYW55ID0gb3B0aW9ucy5maWx0ZXJfY29tcGFueVxuXHRzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKVxuXHRzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlclxuXHRzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoXG5cdHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbFxuXHRzZWxmLmVuYWJsZV9hcHByb3ZhbHMgPSBvcHRpb25zLmVuYWJsZV9hcHByb3ZhbHNcblx0c2VsZi5lbmFibGVfZm9sbG93ID0gb3B0aW9ucy5lbmFibGVfZm9sbG93XG5cdHNlbGYuZW5hYmxlX3dvcmtmbG93ID0gb3B0aW9ucy5lbmFibGVfd29ya2Zsb3dcblx0c2VsZi5lbmFibGVfaW5saW5lX2VkaXQgPSBvcHRpb25zLmVuYWJsZV9pbmxpbmVfZWRpdFxuXHRzZWxmLmRldGFpbHMgPSBvcHRpb25zLmRldGFpbHNcblx0c2VsZi5tYXN0ZXJzID0gb3B0aW9ucy5tYXN0ZXJzXG5cdHNlbGYubG9va3VwX2RldGFpbHMgPSBvcHRpb25zLmxvb2t1cF9kZXRhaWxzXG5cdGlmIF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpXG5cdFx0c2VsZi5pbl9kZXZlbG9wbWVudCA9IG9wdGlvbnMuaW5fZGV2ZWxvcG1lbnRcblx0c2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnXG5cdGlmIG9wdGlvbnMuZGF0YWJhc2VfbmFtZVxuXHRcdHNlbGYuZGF0YWJhc2VfbmFtZSA9IG9wdGlvbnMuZGF0YWJhc2VfbmFtZVxuXHRpZiAoIW9wdGlvbnMuZmllbGRzKVxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IGZpZWxkcycpO1xuXG5cdHNlbGYuZmllbGRzID0gY2xvbmUob3B0aW9ucy5maWVsZHMpXG5cblx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRpZiBmaWVsZC5pc19uYW1lXG5cdFx0XHRzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZVxuXHRcdGVsc2UgaWYgZmllbGRfbmFtZSA9PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVlcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXG5cdFx0aWYgZmllbGQucHJpbWFyeVxuXHRcdFx0c2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWVcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKVxuXHRcdFx0XHRpZiBmaWVsZF9uYW1lID09ICdzcGFjZSdcblx0XHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxuXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IGZhbHNlXG5cblx0aWYgIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcblx0XHRfLmVhY2ggX2Jhc2VPYmplY3QuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRcdGlmICFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXVxuXHRcdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9XG5cdFx0XHRzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSlcblxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmIGZpZWxkLnR5cGUgPT0gJ2F1dG9udW1iZXInXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2Zvcm11bGEnXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3N1bW1hcnknXG5cdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcblxuXHRzZWxmLmxpc3Rfdmlld3MgPSB7fVxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcoc2VsZi5uYW1lKVxuXHRfLmVhY2ggb3B0aW9ucy5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0b2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKVxuXHRcdHNlbGYubGlzdF92aWV3c1tpdGVtX25hbWVdID0gb2l0ZW1cblxuXHRzZWxmLnRyaWdnZXJzID0gXy5jbG9uZShfYmFzZU9iamVjdC50cmlnZ2Vycylcblx0Xy5lYWNoIG9wdGlvbnMudHJpZ2dlcnMsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiAhc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdXG5cdFx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fVxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXS5uYW1lID0gaXRlbV9uYW1lXG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pLCBpdGVtKVxuXG5cdHNlbGYuYWN0aW9ucyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QuYWN0aW9ucylcblx0Xy5lYWNoIG9wdGlvbnMuYWN0aW9ucywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fVxuXHRcdGNvcHlJdGVtID0gXy5jbG9uZShzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSlcblx0XHRkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gI+WFiOWIoOmZpOebuOWFs+WxnuaAp+WGjemHjeW7uuaJjeiDveS/neivgeWQjue7remHjeWkjeWumuS5ieeahOWxnuaAp+mhuuW6j+eUn+aViFxuXHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pXG5cblx0Xy5lYWNoIHNlbGYuYWN0aW9ucywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZVxuXG5cdHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpXG5cblx0IyDorqnmiYDmnIlvYmplY3Tpu5jorqTmnInmiYDmnIlsaXN0X3ZpZXdzL2FjdGlvbnMvcmVsYXRlZF9vYmplY3RzL3JlYWRhYmxlX2ZpZWxkcy9lZGl0YWJsZV9maWVsZHPlrozmlbTmnYPpmZDvvIzor6XmnYPpmZDlj6/og73ooqvmlbDmja7lupPkuK3orr7nva7nmoRhZG1pbi91c2Vy5p2D6ZmQ6KaG55uWXG5cdHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KVxuXHQjIGRlZmF1bHRMaXN0Vmlld3MgPSBfLmtleXMoc2VsZi5saXN0X3ZpZXdzKVxuXHQjIGRlZmF1bHRBY3Rpb25zID0gXy5rZXlzKHNlbGYuYWN0aW9ucylcblx0IyBkZWZhdWx0UmVsYXRlZE9iamVjdHMgPSBfLnBsdWNrKHNlbGYucmVsYXRlZF9vYmplY3RzLFwib2JqZWN0X25hbWVcIilcblx0IyBkZWZhdWx0UmVhZGFibGVGaWVsZHMgPSBbXVxuXHQjIGRlZmF1bHRFZGl0YWJsZUZpZWxkcyA9IFtdXG5cdCMgXy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0IyBcdGlmICEoZmllbGQuaGlkZGVuKSAgICAjMjMxIG9taXTlrZfmrrXmlK/mjIHlnKjpnZ7nvJbovpHpobXpnaLmn6XnnIssIOWboOatpOWIoOmZpOS6huatpOWkhOWvuW9taXTnmoTliKTmlq1cblx0IyBcdFx0ZGVmYXVsdFJlYWRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxuXHQjIFx0XHRpZiAhZmllbGQucmVhZG9ubHlcblx0IyBcdFx0XHRkZWZhdWx0RWRpdGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXG5cblx0IyBfLmVhY2ggc2VsZi5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHQjIFx0aWYgaXRlbV9uYW1lID09IFwibm9uZVwiXG5cdCMgXHRcdHJldHVyblxuXHQjIFx0aWYgc2VsZi5saXN0X3ZpZXdzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5saXN0X3ZpZXdzID0gZGVmYXVsdExpc3RWaWV3c1xuXHQjIFx0aWYgc2VsZi5hY3Rpb25zXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5hY3Rpb25zID0gZGVmYXVsdEFjdGlvbnNcblx0IyBcdGlmIHNlbGYucmVsYXRlZF9vYmplY3RzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWxhdGVkX29iamVjdHMgPSBkZWZhdWx0UmVsYXRlZE9iamVjdHNcblx0IyBcdGlmIHNlbGYuZmllbGRzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5yZWFkYWJsZV9maWVsZHMgPSBkZWZhdWx0UmVhZGFibGVGaWVsZHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmVkaXRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRFZGl0YWJsZUZpZWxkc1xuXHR1bmxlc3Mgb3B0aW9ucy5wZXJtaXNzaW9uX3NldFxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fVxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LmFkbWluKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSlcblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py51c2VyKVxuXHRcdG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pXG5cdF8uZWFjaCBvcHRpb25zLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pXG5cblx0IyDliY3nq6/moLnmja5wZXJtaXNzaW9uc+aUueWGmWZpZWxk55u45YWz5bGe5oCn77yM5ZCO56uv5Y+q6KaB6LWw6buY6K6k5bGe5oCn5bCx6KGM77yM5LiN6ZyA6KaB5pS55YaZXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9uc1xuXHRcdGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucz8uZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdGlmIGRpc2FibGVkX2xpc3Rfdmlld3M/Lmxlbmd0aFxuXHRcdFx0ZGVmYXVsdExpc3RWaWV3SWQgPSBvcHRpb25zLmxpc3Rfdmlld3M/LmFsbD8uX2lkXG5cdFx0XHRpZiBkZWZhdWx0TGlzdFZpZXdJZFxuXHRcdFx0XHQjIOaKiuinhuWbvuadg+mZkOmFjee9ruS4rem7mOiupOeahGFsbOinhuWbvmlk6L2s5o2i5oiQYWxs5YWz6ZSu5a2XXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcCBkaXNhYmxlZF9saXN0X3ZpZXdzLCAobGlzdF92aWV3X2l0ZW0pIC0+XG5cdFx0XHRcdFx0cmV0dXJuIGlmIGRlZmF1bHRMaXN0Vmlld0lkID09IGxpc3Rfdmlld19pdGVtIHRoZW4gXCJhbGxcIiBlbHNlIGxpc3Rfdmlld19pdGVtXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucylcbiNcdFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cbiNcdFx0XHRpZiBmaWVsZFxuI1x0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bnJlYWRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPCAwXG4jXHRcdFx0XHRcdGlmIGZpZWxkLmhpZGRlblxuI1x0XHRcdFx0XHRcdHJldHVyblxuI1x0XHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVuZWRpdGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA+IC0xXG4jXHRcdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG4jXHRcdFx0XHRcdFx0ZmllbGQuZGlzYWJsZWQgPSB0cnVlXG4jXHRcdFx0XHRcdFx0IyDlvZPlj6ror7vml7bvvIzlpoLmnpzkuI3ljrvmjonlv4XloavlrZfmrrXvvIxhdXRvZm9ybeaYr+S8muaKpemUmeeahFxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlcXVpcmVkID0gZmFsc2VcbiNcdFx0XHRcdGVsc2VcbiNcdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5wZXJtaXNzaW9ucyA9IG51bGxcblxuXHRfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucylcblxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGJcblxuXHRzZWxmLmRiID0gX2RiXG5cblx0c2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lXG5cblx0c2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZilcblx0c2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSlcblx0aWYgc2VsZi5uYW1lICE9IFwidXNlcnNcIiBhbmQgc2VsZi5uYW1lICE9IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCIsIFwiYWN0aW9uX2ZpZWxkX3VwZGF0ZXNcIiwgXCJvYmplY3RfbGlzdHZpZXdzXCJdLCBzZWxmLm5hbWUpXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdFx0ZWxzZVxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXHRpZiBzZWxmLm5hbWUgPT0gXCJ1c2Vyc1wiXG5cdFx0X2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYVxuXG5cdGlmIF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSlcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblxuXHRDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGZcblxuXHRyZXR1cm4gc2VsZlxuXG4jIENyZWF0b3IuT2JqZWN0LnByb3RvdHlwZS5pMThuID0gKCktPlxuIyBcdCMgc2V0IG9iamVjdCBsYWJlbFxuIyBcdHNlbGYgPSB0aGlzXG5cbiMgXHRrZXkgPSBzZWxmLm5hbWVcbiMgXHRpZiB0KGtleSkgPT0ga2V5XG4jIFx0XHRpZiAhc2VsZi5sYWJlbFxuIyBcdFx0XHRzZWxmLmxhYmVsID0gc2VsZi5uYW1lXG4jIFx0ZWxzZVxuIyBcdFx0c2VsZi5sYWJlbCA9IHQoa2V5KVxuXG4jIFx0IyBzZXQgZmllbGQgbGFiZWxzXG4jIFx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cbiMgXHRcdGZrZXkgPSBzZWxmLm5hbWUgKyBcIl9cIiArIGZpZWxkX25hbWVcbiMgXHRcdGlmIHQoZmtleSkgPT0gZmtleVxuIyBcdFx0XHRpZiAhZmllbGQubGFiZWxcbiMgXHRcdFx0XHRmaWVsZC5sYWJlbCA9IGZpZWxkX25hbWVcbiMgXHRcdGVsc2VcbiMgXHRcdFx0ZmllbGQubGFiZWwgPSB0KGZrZXkpXG4jIFx0XHRzZWxmLnNjaGVtYT8uX3NjaGVtYT9bZmllbGRfbmFtZV0/LmxhYmVsID0gZmllbGQubGFiZWxcblxuXG4jIFx0IyBzZXQgbGlzdHZpZXcgbGFiZWxzXG4jIFx0Xy5lYWNoIHNlbGYubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuIyBcdFx0aTE4bl9rZXkgPSBzZWxmLm5hbWUgKyBcIl9saXN0dmlld19cIiArIGl0ZW1fbmFtZVxuIyBcdFx0aWYgdChpMThuX2tleSkgPT0gaTE4bl9rZXlcbiMgXHRcdFx0aWYgIWl0ZW0ubGFiZWxcbiMgXHRcdFx0XHRpdGVtLmxhYmVsID0gaXRlbV9uYW1lXG4jIFx0XHRlbHNlXG4jIFx0XHRcdGl0ZW0ubGFiZWwgPSB0KGkxOG5fa2V5KVxuXG5cbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSAob2JqZWN0KS0+XG5cdHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIlxuXHQjIGlmIG9iamVjdFxuXHQjIFx0aWYgIW9iamVjdC5kYXRhYmFzZV9uYW1lIHx8IG9iamVjdC5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXG5cdCMgXHRcdHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIlxuXHQjIFx0ZWxzZVxuXHQjIFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhLyN7b2JqZWN0LmRhdGFiYXNlX25hbWV9XCJcblxuIyBpZiBNZXRlb3IuaXNDbGllbnRcblxuIyBcdE1ldGVvci5zdGFydHVwIC0+XG4jIFx0XHRUcmFja2VyLmF1dG9ydW4gLT5cbiMgXHRcdFx0aWYgU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAmJiBDcmVhdG9yLmJvb3RzdHJhcExvYWRlZD8uZ2V0KClcbiMgXHRcdFx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxuIyBcdFx0XHRcdFx0b2JqZWN0LmkxOG4oKVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRpZiAhQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzXG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKG9iamVjdCktPlxuXHRcdFx0bmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdClcblxuIiwidmFyIGNsb25lO1xuXG5jbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5cbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9O1xuXG5DcmVhdG9yLmZvcm1hdE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBpZiAob2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY2ZzLmZpbGVzLicpKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwuJywgJ2cnKSwgJ18nKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0X25hbWU7XG59O1xuXG5DcmVhdG9yLk9iamVjdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIF9iYXNlT2JqZWN0LCBfZGIsIGRlZmF1bHRMaXN0Vmlld0lkLCBkZWZhdWx0VmlldywgZGlzYWJsZWRfbGlzdF92aWV3cywgcGVybWlzc2lvbnMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2NoZW1hLCBzZWxmO1xuICBfYmFzZU9iamVjdCA9IENyZWF0b3IuYmFzZU9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF9iYXNlT2JqZWN0ID0ge1xuICAgICAgYWN0aW9uczogQ3JlYXRvci5iYXNlT2JqZWN0LmFjdGlvbnMsXG4gICAgICBmaWVsZHM6IHt9LFxuICAgICAgdHJpZ2dlcnM6IHt9LFxuICAgICAgcGVybWlzc2lvbl9zZXQ6IHt9XG4gICAgfTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgaWYgKCFvcHRpb25zLm5hbWUpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuICB9XG4gIHNlbGYuX2lkID0gb3B0aW9ucy5faWQgfHwgb3B0aW9ucy5uYW1lO1xuICBzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZTtcbiAgc2VsZi5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICBzZWxmLmxhYmVsID0gb3B0aW9ucy5sYWJlbDtcbiAgc2VsZi5pY29uID0gb3B0aW9ucy5pY29uO1xuICBzZWxmLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvbjtcbiAgc2VsZi5pc192aWV3ID0gb3B0aW9ucy5pc192aWV3O1xuICBzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm07XG4gIHNlbGYucmVsYXRlZExpc3QgPSBvcHRpb25zLnJlbGF0ZWRMaXN0O1xuICBzZWxmLnJlbGF0ZWRfbGlzdHMgPSBvcHRpb25zLnJlbGF0ZWRfbGlzdHM7XG4gIHNlbGYudmVyc2lvbiA9IG9wdGlvbnMudmVyc2lvbiB8fCAxLjA7XG4gIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpIHx8IG9wdGlvbnMuaXNfZW5hYmxlID09PSB0cnVlKSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gZmFsc2U7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpKSB7XG4gICAgICBzZWxmLmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvcHRpb25zLmFsbG93X2N1c3RvbUFjdGlvbnM7XG4gICAgfVxuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnZXhjbHVkZV9hY3Rpb25zJykpIHtcbiAgICAgIHNlbGYuZXhjbHVkZV9hY3Rpb25zID0gb3B0aW9ucy5leGNsdWRlX2FjdGlvbnM7XG4gICAgfVxuICAgIGlmIChfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKSkge1xuICAgICAgc2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3Q7XG4gICAgfVxuICB9XG4gIHNlbGYuZW5hYmxlX3NlYXJjaCA9IG9wdGlvbnMuZW5hYmxlX3NlYXJjaDtcbiAgc2VsZi5lbmFibGVfZmlsZXMgPSBvcHRpb25zLmVuYWJsZV9maWxlcztcbiAgc2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrcztcbiAgc2VsZi5lbmFibGVfbm90ZXMgPSBvcHRpb25zLmVuYWJsZV9ub3RlcztcbiAgc2VsZi5lbmFibGVfYXVkaXQgPSBvcHRpb25zLmVuYWJsZV9hdWRpdDtcbiAgc2VsZi5lbmFibGVfZXZlbnRzID0gb3B0aW9ucy5lbmFibGVfZXZlbnRzO1xuICBpZiAob3B0aW9ucy5wYWdpbmcpIHtcbiAgICBzZWxmLnBhZ2luZyA9IG9wdGlvbnMucGFnaW5nO1xuICB9XG4gIHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW47XG4gIHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT09IHZvaWQgMCkgfHwgb3B0aW9ucy5lbmFibGVfYXBpO1xuICBzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tO1xuICBzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlO1xuICBzZWxmLmVuYWJsZV9pbnN0YW5jZXMgPSBvcHRpb25zLmVuYWJsZV9pbnN0YW5jZXM7XG4gIHNlbGYuZW5hYmxlX3Byb2Nlc3MgPSBvcHRpb25zLmVuYWJsZV9wcm9jZXNzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSkge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICB9XG4gIHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93O1xuICBzZWxmLmZpbHRlcl9jb21wYW55ID0gb3B0aW9ucy5maWx0ZXJfY29tcGFueTtcbiAgc2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcik7XG4gIHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyO1xuICBzZWxmLmVuYWJsZV90cmFzaCA9IG9wdGlvbnMuZW5hYmxlX3RyYXNoO1xuICBzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWw7XG4gIHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFscztcbiAgc2VsZi5lbmFibGVfZm9sbG93ID0gb3B0aW9ucy5lbmFibGVfZm9sbG93O1xuICBzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93O1xuICBzZWxmLmVuYWJsZV9pbmxpbmVfZWRpdCA9IG9wdGlvbnMuZW5hYmxlX2lubGluZV9lZGl0O1xuICBzZWxmLmRldGFpbHMgPSBvcHRpb25zLmRldGFpbHM7XG4gIHNlbGYubWFzdGVycyA9IG9wdGlvbnMubWFzdGVycztcbiAgc2VsZi5sb29rdXBfZGV0YWlscyA9IG9wdGlvbnMubG9va3VwX2RldGFpbHM7XG4gIGlmIChfLmhhcyhvcHRpb25zLCAnaW5fZGV2ZWxvcG1lbnQnKSkge1xuICAgIHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50O1xuICB9XG4gIHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJztcbiAgaWYgKG9wdGlvbnMuZGF0YWJhc2VfbmFtZSkge1xuICAgIHNlbGYuZGF0YWJhc2VfbmFtZSA9IG9wdGlvbnMuZGF0YWJhc2VfbmFtZTtcbiAgfVxuICBpZiAoIW9wdGlvbnMuZmllbGRzKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IGZpZWxkcycpO1xuICB9XG4gIHNlbGYuZmllbGRzID0gY2xvbmUob3B0aW9ucy5maWVsZHMpO1xuICBfLmVhY2goc2VsZi5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH0gZWxzZSBpZiAoZmllbGRfbmFtZSA9PT0gJ25hbWUnICYmICFzZWxmLk5BTUVfRklFTERfS0VZKSB7XG4gICAgICBzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLnByaW1hcnkpIHtcbiAgICAgIHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpKSB7XG4gICAgICAgIGlmIChmaWVsZF9uYW1lID09PSAnc3BhY2UnKSB7XG4gICAgICAgICAgZmllbGQuZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKCFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09PSAnbWV0ZW9yLW1vbmdvJykge1xuICAgIF8uZWFjaChfYmFzZU9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgICBpZiAoIXNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKSB7XG4gICAgICAgIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pO1xuICAgIH0pO1xuICB9XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2Zvcm11bGEnKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3N1bW1hcnknKSB7XG4gICAgICByZXR1cm4gZmllbGQucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHNlbGYubGlzdF92aWV3cyA9IHt9O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcoc2VsZi5uYW1lKTtcbiAgXy5lYWNoKG9wdGlvbnMubGlzdF92aWV3cywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgdmFyIG9pdGVtO1xuICAgIG9pdGVtID0gQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcoZGVmYXVsdFZpZXcsIGl0ZW0sIGl0ZW1fbmFtZSk7XG4gICAgcmV0dXJuIHNlbGYubGlzdF92aWV3c1tpdGVtX25hbWVdID0gb2l0ZW07XG4gIH0pO1xuICBzZWxmLnRyaWdnZXJzID0gXy5jbG9uZShfYmFzZU9iamVjdC50cmlnZ2Vycyk7XG4gIF8uZWFjaChvcHRpb25zLnRyaWdnZXJzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXS5uYW1lID0gaXRlbV9uYW1lO1xuICAgIHJldHVybiBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgc2VsZi5hY3Rpb25zID0gXy5jbG9uZShfYmFzZU9iamVjdC5hY3Rpb25zKTtcbiAgXy5lYWNoKG9wdGlvbnMuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgdmFyIGNvcHlJdGVtO1xuICAgIGlmICghc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIGNvcHlJdGVtID0gXy5jbG9uZShzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSk7XG4gICAgZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdO1xuICAgIHJldHVybiBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKTtcbiAgfSk7XG4gIF8uZWFjaChzZWxmLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHJldHVybiBpdGVtLm5hbWUgPSBpdGVtX25hbWU7XG4gIH0pO1xuICBzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKTtcbiAgc2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoX2Jhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpO1xuICBpZiAoIW9wdGlvbnMucGVybWlzc2lvbl9zZXQpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge307XG4gIH1cbiAgaWYgKCEoKHJlZiA9IG9wdGlvbnMucGVybWlzc2lvbl9zZXQpICE9IG51bGwgPyByZWYuYWRtaW4gOiB2b2lkIDApKSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKTtcbiAgfVxuICBpZiAoISgocmVmMSA9IG9wdGlvbnMucGVybWlzc2lvbl9zZXQpICE9IG51bGwgPyByZWYxLnVzZXIgOiB2b2lkIDApKSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldC51c2VyID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1widXNlclwiXSk7XG4gIH1cbiAgXy5lYWNoKG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBvcHRpb25zLnBlcm1pc3Npb25zO1xuICAgIGRpc2FibGVkX2xpc3Rfdmlld3MgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA6IHZvaWQgMDtcbiAgICBpZiAoZGlzYWJsZWRfbGlzdF92aWV3cyAhPSBudWxsID8gZGlzYWJsZWRfbGlzdF92aWV3cy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgIGRlZmF1bHRMaXN0Vmlld0lkID0gKHJlZjIgPSBvcHRpb25zLmxpc3Rfdmlld3MpICE9IG51bGwgPyAocmVmMyA9IHJlZjIuYWxsKSAhPSBudWxsID8gcmVmMy5faWQgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IF8ubWFwKGRpc2FibGVkX2xpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgaWYgKGRlZmF1bHRMaXN0Vmlld0lkID09PSBsaXN0X3ZpZXdfaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiYWxsXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0X3ZpZXdfaXRlbTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLnBlcm1pc3Npb25zID0gbnVsbDtcbiAgfVxuICBfZGIgPSBDcmVhdG9yLmNyZWF0ZUNvbGxlY3Rpb24ob3B0aW9ucyk7XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYjtcbiAgc2VsZi5kYiA9IF9kYjtcbiAgc2VsZi5fY29sbGVjdGlvbl9uYW1lID0gX2RiLl9uYW1lO1xuICBzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKTtcbiAgc2VsZi5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYSk7XG4gIGlmIChzZWxmLm5hbWUgIT09IFwidXNlcnNcIiAmJiBzZWxmLm5hbWUgIT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIiAmJiAhc2VsZi5pc192aWV3ICYmICFfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCIsIFwiYWN0aW9uX2ZpZWxkX3VwZGF0ZXNcIiwgXCJvYmplY3RfbGlzdHZpZXdzXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHNlbGYubmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgX2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYTtcbiAgfVxuICBpZiAoXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtzZWxmLl9jb2xsZWN0aW9uX25hbWVdID0gc2VsZjtcbiAgcmV0dXJuIHNlbGY7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIjtcbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBpZiAoIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkICYmIENyZWF0b3IuT2JqZWN0cykge1xuICAgIHJldHVybiBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBuZXcgQ3JlYXRvci5PYmplY3Qob2JqZWN0KTtcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMgPSAoZmllbGRTY2hlbWEpIC0+XG5cdG9wdGlvbnMgPSBmaWVsZFNjaGVtYS5vcHRpb25zXG5cdHVubGVzcyBvcHRpb25zXG5cdFx0cmV0dXJuXG5cdGRhdGFfdHlwZSA9IGZpZWxkU2NoZW1hLmRhdGFfdHlwZVxuXHRpZiAhXy5pc0Z1bmN0aW9uKG9wdGlvbnMpIGFuZCBkYXRhX3R5cGUgYW5kIGRhdGFfdHlwZSAhPSAndGV4dCdcblx0XHQjIOmbtuS7o+eggeeVjOmdoumFjee9rm9wdGlvbnPpgInpobnlgLzlj6rmlK/mjIHlrZfnrKbkuLLvvIzmiYDku6XlvZNkYXRhX3R5cGXkuLrmlbDlgLzmiJZib29sZWFu5pe277yM5Y+q6IO95by66KGM5oqK6YCJ6aG55YC85YWI6L2s5o2i5Li65a+55bqU55qE57G75Z6LXG5cdFx0b3B0aW9ucy5mb3JFYWNoIChvcHRpb25JdGVtKSAtPlxuXHRcdFx0aWYgdHlwZW9mIG9wdGlvbkl0ZW0udmFsdWUgIT0gJ3N0cmluZydcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBbXG5cdFx0XHRcdCdudW1iZXInXG5cdFx0XHRcdCdjdXJyZW5jeSdcblx0XHRcdFx0J3BlcmNlbnQnXG5cdFx0XHRdLmluZGV4T2YoZGF0YV90eXBlKSA+IC0xXG5cdFx0XHRcdG9wdGlvbkl0ZW0udmFsdWUgPSBOdW1iZXIob3B0aW9uSXRlbS52YWx1ZSlcblx0XHRcdGVsc2UgaWYgZGF0YV90eXBlID09ICdib29sZWFuJ1xuXHRcdFx0XHQjIOWPquacieS4unRydWXmiY3kuLrnnJ9cblx0XHRcdFx0b3B0aW9uSXRlbS52YWx1ZSA9IG9wdGlvbkl0ZW0udmFsdWUgPT0gJ3RydWUnXG5cdHJldHVybiBvcHRpb25zXG5cbkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gKG9iaikgLT5cblx0dW5sZXNzIG9ialxuXHRcdHJldHVyblxuXHRzY2hlbWEgPSB7fVxuXG5cdGZpZWxkc0FyciA9IFtdXG5cblx0Xy5lYWNoIG9iai5maWVsZHMgLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRpZiAhXy5oYXMoZmllbGQsIFwibmFtZVwiKVxuXHRcdFx0ZmllbGQubmFtZSA9IGZpZWxkX25hbWVcblx0XHRmaWVsZHNBcnIucHVzaCBmaWVsZFxuXG5cdF8uZWFjaCBfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgKGZpZWxkKS0+XG5cblx0XHRmaWVsZF9uYW1lID0gZmllbGQubmFtZVxuXG5cdFx0ZnMgPSB7fVxuXHRcdGlmIGZpZWxkLnJlZ0V4XG5cdFx0XHRmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4XG5cdFx0ZnMuYXV0b2Zvcm0gPSB7fVxuXHRcdGZzLmF1dG9mb3JtLm11bHRpcGxlID0gZmllbGQubXVsdGlwbGVcblx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdGF1dG9mb3JtX3R5cGUgPSBmaWVsZC5hdXRvZm9ybT8udHlwZVxuXG5cdFx0aWYgZmllbGQudHlwZSA9PSBcInRleHRcIiBvciBmaWVsZC50eXBlID09IFwicGhvbmVcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIlt0ZXh0XVwiIG9yIGZpZWxkLnR5cGUgPT0gXCJbcGhvbmVdXCJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdjb2RlJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTJcblx0XHRcdGlmIGZpZWxkLmxhbmd1YWdlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmxhbmd1YWdlID0gZmllbGQubGFuZ3VhZ2Vcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0YXJlYVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwicGFzc3dvcmRcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxuXHRcdFx0ZnMudHlwZSA9IERhdGVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5pc2lPUygpXG5cdFx0XHRcdFx0XHQjIEZpeCBpb3MgMTQsIOaJi+acuuWuouaIt+err+W+heWuoeaguOaWh+S7tuaXpeacn+aOp+S7tuaYvuekuuaVhemanCAjOTkx77yMaW9z57uf5LiA55SoUEPnq6/kuIDmoLfnmoRqc+aOp+S7tlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcblx0XHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG5cdFx0XHRcdFx0XHRcdFx0cGlja2VyVHlwZTogXCJyb2xsZXJzXCJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcblx0XHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidGltZVwiXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHR0eXBlOiBcInRpbWVcIlxuXHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJISDptbVwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdFx0ZnMudHlwZSA9IERhdGVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5pc2lPUygpXG5cdFx0XHRcdFx0XHQjIEZpeCBpb3MgMTQsIOaJi+acuuWuouaIt+err+W+heWuoeaguOaWh+S7tuaXpeacn+aOp+S7tuaYvuekuuaVhemanCAjOTkx77yMaW9z57uf5LiA55SoUEPnq6/kuIDmoLfnmoRqc+aOp+S7tlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcblx0XHRcdFx0XHRcdFx0XHRwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxuXHRcdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW09iamVjdF1cIlxuXHRcdFx0ZnMudHlwZSA9IFtPYmplY3RdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaHRtbFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHQjIGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0IyBcdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0XHRcdCMgXHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PSBcInpoLUNOXCJcblx0XHRcdCMgXHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXHRcdFx0IyBcdGVsc2Vcblx0XHRcdCMgXHRcdGxvY2FsZSA9IFwiZW4tVVNcIlxuXHRcdFx0IyBcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHQjIFx0XHR0eXBlOiBcInN1bW1lcm5vdGVcIlxuXHRcdFx0IyBcdFx0Y2xhc3M6ICdzdW1tZXJub3RlLWVkaXRvcidcblx0XHRcdCMgXHRcdHNldHRpbmdzOlxuXHRcdFx0IyBcdFx0XHRoZWlnaHQ6IDIwMFxuXHRcdFx0IyBcdFx0XHRkaWFsb2dzSW5Cb2R5OiB0cnVlXG5cdFx0XHQjIFx0XHRcdHRvb2xiYXI6ICBbXG5cdFx0XHQjIFx0XHRcdFx0Wydmb250MScsIFsnc3R5bGUnXV0sXG5cdFx0XHQjIFx0XHRcdFx0Wydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsnZm9udDMnLCBbJ2ZvbnRuYW1lJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsnY29sb3InLCBbJ2NvbG9yJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsndGFibGUnLCBbJ3RhYmxlJ11dLFxuXHRcdFx0IyBcdFx0XHRcdFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sXG5cdFx0XHQjIFx0XHRcdFx0Wyd2aWV3JywgWydjb2RldmlldyddXVxuXHRcdFx0IyBcdFx0XHRdXG5cdFx0XHQjIFx0XHRcdGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywn6buR5L2TJywn5b6u6L2v6ZuF6buRJywn5Lu/5a6LJywn5qW35L2TJywn6Zq25LmmJywn5bm85ZyGJ11cblx0XHRcdCMgXHRcdFx0bGFuZzogbG9jYWxlXG5cblx0XHRlbHNlIGlmIChmaWVsZC50eXBlID09IFwibG9va3VwXCIgb3IgZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb25cblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXG5cdFx0XHRpZiAhZmllbGQuaGlkZGVuXG5cblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnNcblxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vblxuXG5cdFx0XHRcdGlmIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXHRcdFx0XHRcdGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXG5cdFx0XHRcdGZzLmZpbHRlcnNGdW5jdGlvbiA9IGlmIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiB0aGVuIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiBlbHNlIENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzXG5cblx0XHRcdFx0aWYgZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cdFx0XHRcdFx0ZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdGlmIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dXG5cdFx0XHRcdFx0XHRcdFx0aWYgX3JlZl9vYmo/LnBlcm1pc3Npb25zPy5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSAobG9va3VwX2ZpZWxkKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy4je0NyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcm1JZDogXCJuZXcje2ZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywnXycpfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBcIiN7ZmllbGQucmVmZXJlbmNlX3RvfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wZXJhdGlvbjogXCJpbnNlcnRcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvblN1Y2Nlc3M6IChvcGVyYXRpb24sIHJlc3VsdCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVzdWx0Lm9iamVjdF9uYW1lID09IFwib2JqZWN0c1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSwgaWNvbjogcmVzdWx0LnZhbHVlLmljb259XSwgcmVzdWx0LnZhbHVlLm5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsIHZhbHVlOiByZXN1bHQuX2lkfV0sIHJlc3VsdC5faWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2VcblxuXHRcdFx0XHRcdGlmIF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSlcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZVxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3NvcnRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnRcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9saW1pdFxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0XG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VUb0ZpZWxkID0gZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkXG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJ1c2Vyc1wiXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzliIbpg6jkuIvnmoTmlbDmja5cblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWIhumDqOWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxuXHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5YiG6YOo6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc1VuTGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0IyDkvKDlhaXlvZPliY3lr7nosaHnmoTmnYPpmZDvvIzlnKjlh73mlbDkuK3moLnmja7mnYPpmZDorqHnrpfmmK/lkKbopoHpmZDliLblj6rmn6XnnIvmnKzliIbpg6hcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0IyDmnI3liqHnq6/nlKjkuI3liLBpc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRlbHNlIGlmIGZpZWxkLnJlZmVyZW5jZV90byA9PSBcIm9yZ2FuaXphdGlvbnNcIlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzliIbpg6jkuIvnmoTmlbDmja5cblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWIhumDqOWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxuXHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5YiG6YOo6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc1VuTGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0IyDkvKDlhaXlvZPliY3lr7nosaHnmoTmnYPpmZDvvIzlnKjlh73mlbDkuK3moLnmja7mnYPpmZDorqHnrpfmmK/lkKbopoHpmZDliLblj6rmn6XnnIvmnKzliIbpg6hcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0IyDmnI3liqHnq6/nlKjkuI3liLBpc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpZiB0eXBlb2YoZmllbGQucmVmZXJlbmNlX3RvKSA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KF9yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdGZzLnR5cGUgPSBPYmplY3Rcblx0XHRcdFx0XHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlXG5cblx0XHRcdFx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFN0cmluZ1xuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFtTdHJpbmddXG5cdFx0XHRcdFx0XHRcdFx0YXV0b2Zvcm06IHtvbWl0OiB0cnVlfVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXVxuXG5cdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dXG5cdFx0XHRcdFx0XHRpZiBfb2JqZWN0IGFuZCBfb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFRyZWVcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2QgPSBmaWVsZC5vcHRpb25zTWV0aG9kIHx8IFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiXG5cblx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZFBhcmFtcyA9ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX1cblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW11cblx0XHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvLmZvckVhY2ggKF9yZWZlcmVuY2UpLT5cblx0XHRcdFx0XHRcdFx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV1cblx0XHRcdFx0XHRcdFx0XHRcdGlmIF9vYmplY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3Q6IF9yZWZlcmVuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogX29iamVjdD8ubGFiZWxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBfb2JqZWN0Py5pY29uXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3Q6IF9yZWZlcmVuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW5rOiAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvblxuXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwic2VsZWN0XCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRcdFx0aWYgXy5oYXMoZmllbGQsICdmaXJzdE9wdGlvbicpXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBmaWVsZC5maXJzdE9wdGlvblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiXG5cdFx0XHQjIOWboOS4uuWIl+ihqOinhuWbvuWPs+S+p+i/h+a7pOWZqOi/mOaYr+eUqOeahOiAgeihqOWNleeahGxvb2t1cOWSjHNlbGVjdOaOp+S7tu+8jOaJgOS7peS4iumdoueahOS7o+eggeWni+e7iOS/neaMgeWOn+agt+mcgOimgeaJp+ihjFxuXHRcdFx0IyDkuIvpnaLmmK/phY3nva7kuoZkYXRhX3R5cGXml7bvvIzpop3lpJblpITnkIbnmoTpgLvovpFcblx0XHRcdGlmIGZpZWxkLmRhdGFfdHlwZSBhbmQgZmllbGQuZGF0YV90eXBlICE9IFwidGV4dFwiXG5cdFx0XHRcdGlmIFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCIsIFwicGVyY2VudFwiXS5pbmRleE9mKGZpZWxkLmRhdGFfdHlwZSkgPiAtMVxuXHRcdFx0XHRcdGZzVHlwZSA9IE51bWJlclxuXHRcdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0XHRcdGVsc2UgaWYgZmllbGQuZGF0YV90eXBlID09IFwiYm9vbGVhblwiXG5cdFx0XHRcdFx0ZnNUeXBlID0gQm9vbGVhblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnNUeXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLnR5cGUgPSBmc1R5cGVcblx0XHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0XHRmcy50eXBlID0gW2ZzVHlwZV1cblx0XHRcdFx0XHRcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IENyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyhmaWVsZClcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJjdXJyZW5jeVwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRcdGVsc2UgaWYgZmllbGQ/LnNjYWxlICE9IDBcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSAyXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibnVtYmVyXCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImJvb2xlYW5cIlxuXHRcdFx0ZnMudHlwZSA9IEJvb2xlYW5cblx0XHRcdGlmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0b2dnbGVcIlxuXHRcdFx0ZnMudHlwZSA9IEJvb2xlYW5cblx0XHRcdGlmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLXRvZ2dsZVwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwicmVmZXJlbmNlXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJjaGVja2JveFwiXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdC1jaGVja2JveFwiXG5cdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImZpbGVcIlxuXHRcdFx0Y29sbGVjdGlvbk5hbWUgPSBmaWVsZC5jb2xsZWN0aW9uIHx8IFwiZmlsZXNcIiAjIGNvbGxlY3Rpb24g6buY6K6k5pivICdmaWxlcydcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBjb2xsZWN0aW9uTmFtZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25OYW1lXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZXNpemVcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJPYmplY3RcIiB8fCBmaWVsZC50eXBlID09IFwib2JqZWN0XCJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3Rcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJncmlkXCJcblx0XHRcdGZzLnR5cGUgPSBBcnJheVxuXHRcdFx0ZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zR3JpZFwiXG5cblx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdHR5cGU6IE9iamVjdFxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImltYWdlXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnaW1hZ2VzJ1xuXHRcdFx0XHRcdFx0YWNjZXB0OiAnaW1hZ2UvKidcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnaW1hZ2VzJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdmF0YXJcIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdhdmF0YXJzJ1xuXHRcdFx0XHRcdFx0YWNjZXB0OiAnaW1hZ2UvKidcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXZhdGFycydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXVkaW9cIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdhdWRpb3MnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdhdWRpby8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdWRpb3MnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdhdWRpby8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInZpZGVvXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAndmlkZW9zJ1xuXHRcdFx0XHRcdFx0YWNjZXB0OiAndmlkZW8vKidcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAndmlkZW9zJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAndmlkZW8vKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJsb2NhdGlvblwiXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJsb2NhdGlvblwiXG5cdFx0XHRmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiXG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJtYXJrZG93blwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0ZXh0XCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3VybCdcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdCMgZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguVXJsXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdlbWFpbCdcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NFbWFpbCdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2F1dG9udW1iZXInXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdmb3JtdWxhJ1xuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3N1bW1hcnknXG5cdFx0XHRmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtmaWVsZHM6IHtmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHt0eXBlOiBmaWVsZC5kYXRhX3R5cGV9KX19KVtmaWVsZC5uYW1lXVxuXHRcdCMgZWxzZSBpZiBmaWVsZC50eXBlID09ICdzZWxlY3QnXG5cdFx0IyBcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdwZXJjZW50J1xuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdHVubGVzcyBfLmlzTnVtYmVyKGZpZWxkLnNjYWxlKVxuXHRcdFx0XHQjIOayoemFjee9ruWwj+aVsOS9jeaVsOWImeaMieWwj+aVsOS9jeaVsDDmnaXlpITnkIbvvIzljbPpu5jorqTmmL7npLrkuLrmlbTmlbDnmoTnmb7liIbmr5TvvIzmr5TlpoIyMCXvvIzmraTml7bmjqfku7blj6/ku6XovpPlhaUy5L2N5bCP5pWw77yM6L2s5oiQ55m+5YiG5q+U5bCx5piv5pW05pWwXG5cdFx0XHRcdGZpZWxkLnNjYWxlID0gMFxuXHRcdFx0IyBhdXRvZm9ybeaOp+S7tuS4reWwj+aVsOS9jeaVsOWni+e7iOavlOmFjee9rueahOS9jeaVsOWkmjLkvY1cblx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGUgKyAyXG5cdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdGZzLnR5cGUgPSBmaWVsZC50eXBlXG5cblx0XHRpZiBmaWVsZC5sYWJlbFxuXHRcdFx0ZnMubGFiZWwgPSBmaWVsZC5sYWJlbFxuXG4jXHRcdGlmIGZpZWxkLmFsbG93ZWRWYWx1ZXNcbiNcdFx0XHRmcy5hbGxvd2VkVmFsdWVzID0gZmllbGQuYWxsb3dlZFZhbHVlc1xuXG5cdFx0aWYgIWZpZWxkLnJlcXVpcmVkXG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcblxuXHRcdCMgW+etvue6puWvueixoeWQjOaXtumFjee9ruS6hmNvbXBhbnlfaWRz5b+F5aGr5Y+KdW5lZGl0YWJsZV9maWVsZHPpgKDmiJDpg6jliIbnlKjmiLfmlrDlu7rnrb7nuqblr7nosaHml7bmiqXplJkgIzE5Ml0oaHR0cHM6Ly9naXRodWIuY29tL3N0ZWVkb3Mvc3RlZWRvcy1wcm9qZWN0LWR6dWcvaXNzdWVzLzE5Milcblx0XHQjIOWQjuWPsOWni+e7iOiuvue9rnJlcXVpcmVk5Li6ZmFsc2Vcblx0XHRpZiAhTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRmcy5vcHRpb25hbCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLnVuaXF1ZVxuXHRcdFx0ZnMudW5pcXVlID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQub21pdFxuXHRcdFx0ZnMuYXV0b2Zvcm0ub21pdCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmdyb3VwXG5cdFx0XHRmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwXG5cblx0XHRpZiBmaWVsZC5pc193aWRlXG5cdFx0XHRmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuaGlkZGVuXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJoaWRkZW5cIlxuXG5cdFx0aWYgKGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIikgb3IgKGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuZmlsdGVyYWJsZSkgPT0gJ3VuZGVmaW5lZCdcblx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcblx0XHRpZiBmaWVsZC5uYW1lID09ICduYW1lJyB8fCBmaWVsZC5pc19uYW1lXG5cdFx0XHRpZiB0eXBlb2YoZmllbGQuc2VhcmNoYWJsZSkgPT0gJ3VuZGVmaW5lZCdcblx0XHRcdFx0ZmllbGQuc2VhcmNoYWJsZSA9IHRydWVcblxuXHRcdGlmIGF1dG9mb3JtX3R5cGVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlXG5cblx0XHRpZiBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZmllbGQuZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSAoKS0+XG5cdFx0XHRcdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge3VzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLCBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIG5vdzogbmV3IERhdGUoKX0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0IyBcdGlmICFfLmlzRnVuY3Rpb24oZmllbGQuZGVmYXVsdFZhbHVlKVxuXHRcdFx0IyBcdFx0ZnMuZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cblx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0ZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5kaXNhYmxlZFxuXHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5pbmxpbmVIZWxwVGV4dFxuXHRcdFx0ZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dFxuXG5cdFx0aWYgZmllbGQuYmxhY2tib3hcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXG5cdFx0aWYgXy5oYXMoZmllbGQsICdtaW4nKVxuXHRcdFx0ZnMubWluID0gZmllbGQubWluXG5cdFx0aWYgXy5oYXMoZmllbGQsICdtYXgnKVxuXHRcdFx0ZnMubWF4ID0gZmllbGQubWF4XG5cblx0XHQjIOWPquacieeUn+S6p+eOr+Wig+aJjemHjeW7uue0ouW8lVxuXHRcdGlmIE1ldGVvci5pc1Byb2R1Y3Rpb25cblx0XHRcdGlmIGZpZWxkLmluZGV4XG5cdFx0XHRcdGZzLmluZGV4ID0gZmllbGQuaW5kZXhcblx0XHRcdGVsc2UgaWYgZmllbGQuc29ydGFibGVcblx0XHRcdFx0ZnMuaW5kZXggPSB0cnVlXG5cblx0XHRzY2hlbWFbZmllbGRfbmFtZV0gPSBmc1xuXG5cdHJldHVybiBzY2hlbWFcblxuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSktPlxuXHRodG1sID0gZmllbGRfdmFsdWVcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRyZXR1cm4gXCJcIlxuXHRmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSlcblx0aWYgIWZpZWxkXG5cdFx0cmV0dXJuIFwiXCJcblxuXHRpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCBIOm1tJylcblx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJylcblxuXHRyZXR1cm4gaHRtbFxuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IChmaWVsZF90eXBlKS0+XG5cdHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJ0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSAoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyktPlxuXHRidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxuXHRpZiBidWlsdGluVmFsdWVzXG5cdFx0Xy5mb3JFYWNoIGJ1aWx0aW5WYWx1ZXMsIChidWlsdGluSXRlbSwga2V5KS0+XG5cdFx0XHRvcGVyYXRpb25zLnB1c2goe2xhYmVsOiBidWlsdGluSXRlbS5sYWJlbCwgdmFsdWU6IGtleX0pXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSAoZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSktPlxuXHQjIOi/h+a7pOWZqOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSlcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIGtleSlcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IChmaWVsZF90eXBlLCB2YWx1ZSktPlxuXHQjIOagueaNrui/h+a7pOWZqOeahOi/h+a7pOWAvO+8jOiOt+WPluWvueW6lOeahOWGhee9rui/kOeul+esplxuXHQjIOavlOWmgnZhbHVl5Li6bGFzdF95ZWFy77yM6L+U5ZueYmV0d2Vlbl90aW1lX2xhc3RfeWVhclxuXHR1bmxlc3MgXy5pc1N0cmluZyh2YWx1ZSlcblx0XHRyZXR1cm5cblx0YmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXG5cdHVubGVzcyBiZXR3ZWVuQnVpbHRpblZhbHVlc1xuXHRcdHJldHVyblxuXHRyZXN1bHQgPSBudWxsXG5cdF8uZWFjaCBiZXR3ZWVuQnVpbHRpblZhbHVlcywgKGl0ZW0sIG9wZXJhdGlvbiktPlxuXHRcdGlmIGl0ZW0ua2V5ID09IHZhbHVlXG5cdFx0XHRyZXN1bHQgPSBvcGVyYXRpb25cblx0cmV0dXJuIHJlc3VsdFxuXG4jIOWmguaenOWPquaYr+S4uuWIpOaWrW9wZXJhdGlvbuaYr+WQpuWtmOWcqO+8jOWImeayoeW/heimgeiuoeeul3ZhbHVlc++8jOS8oOWFpWlzX2NoZWNrX29ubHnkuLp0cnVl5Y2z5Y+vXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IChpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKS0+XG5cdCMg6L+H5ruk5Zmo5pe26Ze05a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdHJldHVybiB7XG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc195ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3llYXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3F1YXJ0ZXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc193ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3dlZWtcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcblx0XHRcImJldHdlZW5fdGltZV90b2RheVwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9kYXlcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzMwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMzBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzEyMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzEyMF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzYwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfNjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXG5cdH1cblxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IChtb250aCktPlxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0aWYgbW9udGggPCAzXG5cdFx0cmV0dXJuIDBcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRyZXR1cm4gM1xuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdHJldHVybiA2XG5cdFxuXHRyZXR1cm4gOVxuXG5cbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0aWYgbW9udGggPCAzXG5cdFx0eWVhci0tXG5cdFx0bW9udGggPSA5XG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0bW9udGggPSAwXG5cdGVsc2UgaWYgbW9udGggPCA5XG5cdFx0bW9udGggPSAzXG5cdGVsc2UgXG5cdFx0bW9udGggPSA2XG5cdFxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdFxuXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdG1vbnRoID0gM1xuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdG1vbnRoID0gNlxuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdG1vbnRoID0gOVxuXHRlbHNlXG5cdFx0eWVhcisrXG5cdFx0bW9udGggPSAwXG5cdFxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gKHllYXIsbW9udGgpLT5cblx0aWYgbW9udGggPT0gMTFcblx0XHRyZXR1cm4gMzFcblx0XG5cdG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNFxuXHRzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0ZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoKzEsIDEpXG5cdGRheXMgPSAoZW5kRGF0ZS1zdGFydERhdGUpL21pbGxpc2Vjb25kXG5cdHJldHVybiBkYXlzXG5cbkNyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkgPSAoeWVhciwgbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHQjIOaciOS7veS4ujDku6PooajmnKzlubTnmoTnrKzkuIDmnIhcblx0aWYgbW9udGggPT0gMFxuXHRcdG1vbnRoID0gMTFcblx0XHR5ZWFyLS1cblx0XHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdFxuXHQjIOWQpuWImSzlj6rlh4/ljrvmnIjku71cblx0bW9udGgtLTtcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxuXHQjIOi/h+a7pOWZqGJldHdlZW7ov5DnrpfnrKbvvIznjrDnrpfml6XmnJ8v5pel5pyf5pe26Ze057G75Z6L5a2X5q6155qEdmFsdWVz5YC8XG5cdG5vdyA9IG5ldyBEYXRlKClcblx0IyDkuIDlpKnnmoTmr6vnp5LmlbBcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cdHllc3RkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxuXHQjIOS4gOWRqOS4reeahOafkOS4gOWkqVxuXHR3ZWVrID0gbm93LmdldERheSgpXG5cdCMg5YeP5Y6755qE5aSp5pWwXG5cdG1pbnVzRGF5ID0gaWYgd2VlayAhPSAwIHRoZW4gd2VlayAtIDEgZWxzZSA2XG5cdG1vbmRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAobWludXNEYXkgKiBtaWxsaXNlY29uZCkpXG5cdHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDkuIrlkajml6Vcblx0bGFzdFN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0IyDkuIrlkajkuIBcblx0bGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpXG5cdCMg5LiL5ZGo5LiAXG5cdG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXG5cdCMg5LiL5ZGo5pelXG5cdG5leHRTdW5kYXkgPSBuZXcgRGF0ZShuZXh0TW9uZGF5LmdldFRpbWUoKSArIChtaWxsaXNlY29uZCAqIDYpKVxuXHRjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG5cdHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMVxuXHRuZXh0WWVhciA9IGN1cnJlbnRZZWFyICsgMVxuXHQjIOW9k+WJjeaciOS7vVxuXHRjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKVxuXHQjIOiuoeaVsOW5tOOAgeaciFxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcblx0bW9udGggPSBub3cuZ2V0TW9udGgoKVxuXHQjIOacrOaciOesrOS4gOWkqVxuXHRmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aCwxKVxuXG5cdCMg5b2T5Li6MTLmnIjnmoTml7blgJnlubTku73pnIDopoHliqAxXG5cdCMg5pyI5Lu96ZyA6KaB5pu05paw5Li6MCDkuZ/lsLHmmK/kuIvkuIDlubTnmoTnrKzkuIDkuKrmnIhcblx0aWYgY3VycmVudE1vbnRoID09IDExXG5cdFx0eWVhcisrXG5cdFx0bW9udGgrK1xuXHRlbHNlXG5cdFx0bW9udGgrK1xuXHRcblx0IyDkuIvmnIjnrKzkuIDlpKlcblx0bmV4dE1vbnRoRmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0IyDkuIvmnIjmnIDlkI7kuIDlpKlcblx0bmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLG1vbnRoLENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsbW9udGgpKVxuXHQjIOacrOaciOacgOWQjuS4gOWkqVxuXHRsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5LiK5pyI56ys5LiA5aSpXG5cdGxhc3RNb250aEZpcnN0RGF5ID0gQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiK5pyI5pyA5ZCO5LiA5aSpXG5cdGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5pys5a2j5bqm5byA5aeL5pelXG5cdHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksMSlcblx0IyDmnKzlraPluqbnu5PmnZ/ml6Vcblx0dGhpc1F1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkrMikpXG5cdCMg5LiK5a2j5bqm5byA5aeL5pelXG5cdGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4iuWto+W6pue7k+adn+aXpVxuXHRsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxuXHQjIOS4i+Wto+W6puW8gOWni+aXpVxuXHRuZXh0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIvlraPluqbnu5PmnZ/ml6Vcblx0bmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcblx0IyDov4fljrs35aSpIFxuXHRsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrszMOWkqVxuXHRsYXN0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDI5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzYw5aSpXG5cdGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67OTDlpKlcblx0bGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrsxMjDlpKlcblx0bGFzdF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMTE5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTflpKkgXG5cdG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTMw5aSpXG5cdG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lNjDlpKlcblx0bmV4dF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg1OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU5MOWkqVxuXHRuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTEyMOWkqVxuXHRuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpXG5cblx0c3dpdGNoIGtleVxuXHRcdHdoZW4gXCJsYXN0X3llYXJcIlxuXHRcdFx0I+WOu+W5tFxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF95ZWFyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3llYXJcIlxuXHRcdFx0I+S7iuW5tFxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje2N1cnJlbnRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje2N1cnJlbnRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF95ZWFyXCJcblx0XHRcdCPmmI7lubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tuZXh0WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tuZXh0WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfcXVhcnRlclwiXG5cdFx0XHQj5LiK5a2j5bqmXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChsYXN0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfcXVhcnRlclwiXG5cdFx0XHQj5pys5a2j5bqmXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3F1YXJ0ZXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfcXVhcnRlclwiXG5cdFx0XHQj5LiL5a2j5bqmXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfbW9udGhcIlxuXHRcdFx0I+S4iuaciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfbW9udGhcIlxuXHRcdFx0I+acrOaciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19tb250aFwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF9tb250aFwiXG5cdFx0XHQj5LiL5pyIXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF93ZWVrXCJcblx0XHRcdCPkuIrlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChsYXN0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3dlZWtcIlxuXHRcdFx0I+acrOWRqFxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc193ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3dlZWtcIlxuXHRcdFx0I+S4i+WRqFxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChuZXh0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInllc3RkYXlcIlxuXHRcdFx0I+aYqOWkqVxuXHRcdFx0c3RyWWVzdGRheSA9IG1vbWVudCh5ZXN0ZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRvZGF5XCJcblx0XHRcdCPku4rlpKlcblx0XHRcdHN0clRvZGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0b21vcnJvd1wiXG5cdFx0XHQj5piO5aSpXG5cdFx0XHRzdHJUb21vcnJvdyA9IG1vbWVudCh0b21vcnJvdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9tb3Jyb3d9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9tb3Jyb3d9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzdfZGF5c1wiXG5cdFx0XHQj6L+H5Y67N+WkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIikgXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzMwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzMw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMzBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzYwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzYw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzkwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzkw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzEyMF9kYXlzXCJcblx0XHRcdCPov4fljrsxMjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMTIwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF83X2RheXNcIlxuXHRcdFx0I+acquadpTflpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzMwX2RheXNcIlxuXHRcdFx0I+acquadpTMw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzYwX2RheXNcIlxuXHRcdFx0I+acquadpTYw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfNjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzkwX2RheXNcIlxuXHRcdFx0I+acquadpTkw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzEyMF9kYXlzXCJcblx0XHRcdCPmnKrmnaUxMjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XG5cdHZhbHVlcyA9IFtzdGFydFZhbHVlLCBlbmRWYWx1ZV1cblx0aWYgZmllbGRfdHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHQjIOaXtumXtOexu+Wei+Wtl+aute+8jOWGhee9ruaXtumXtOiMg+WbtOW6lOivpeiAg+iZkeWBj+enu+aXtuWMuuWAvO+8jOWQpuWImei/h+a7pOaVsOaNruWtmOWcqOWBj+W3rlxuXHRcdCMg6Z2e5YaF572u5pe26Ze06IyD5Zu05pe277yM55So5oi36YCa6L+H5pe26Ze05o6n5Lu26YCJ5oup55qE6IyD5Zu077yM5Lya6Ieq5Yqo5aSE55CG5pe25Yy65YGP5beu5oOF5Ya1XG5cdFx0IyDml6XmnJ/nsbvlnovlrZfmrrXvvIzmlbDmja7lupPmnKzmnaXlsLHlrZjnmoTmmK9VVEPnmoQw54K577yM5LiN5a2Y5Zyo5YGP5beuXG5cdFx0Xy5mb3JFYWNoIHZhbHVlcywgKGZ2KS0+XG5cdFx0XHRpZiBmdlxuXHRcdFx0XHRmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwIClcblx0XG5cdHJldHVybiB7XG5cdFx0bGFiZWw6IGxhYmVsXG5cdFx0a2V5OiBrZXlcblx0XHR2YWx1ZXM6IHZhbHVlc1xuXHR9XG5cbkNyZWF0b3IuZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uID0gKGZpZWxkX3R5cGUpLT5cblx0aWYgZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxuXHRcdHJldHVybiAnYmV0d2Vlbidcblx0ZWxzZSBpZiBbXCJ0ZXh0YXJlYVwiLCBcInRleHRcIiwgXCJjb2RlXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuICdjb250YWlucydcblx0ZWxzZVxuXHRcdHJldHVybiBcIj1cIlxuXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUpIC0+XG5cdCMg5pel5pyf57G75Z6LOiBkYXRlLCBkYXRldGltZSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcIjxcIiwgXCI+XCIsIFwiPD1cIiwgXCI+PVwiXG5cdCMg5paH5pys57G75Z6LOiB0ZXh0LCB0ZXh0YXJlYSwgaHRtbCAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIiwgXCJzdGFydHN3aXRoXCJcblx0IyDpgInmi6nnsbvlnos6IGxvb2t1cCwgbWFzdGVyX2RldGFpbCwgc2VsZWN0IOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxuXHQjIOaVsOWAvOexu+WeizogY3VycmVuY3ksIG51bWJlciAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcIjxcIiwgXCI+XCIsIFwiPD1cIiwgXCI+PVwiXG5cdCMg5biD5bCU57G75Z6LOiBib29sZWFuICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblx0IyDmlbDnu4Tnsbvlnos6IGNoZWNrYm94LCBbdGV4dF0gIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxuXG5cdG9wdGlvbmFscyA9IHtcblx0XHRlcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLCB2YWx1ZTogXCI9XCJ9LFxuXHRcdHVuZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl91bmVxdWFsXCIpLCB2YWx1ZTogXCI8PlwifSxcblx0XHRsZXNzX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksIHZhbHVlOiBcIjxcIn0sXG5cdFx0Z3JlYXRlcl90aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLCB2YWx1ZTogXCI+XCJ9LFxuXHRcdGxlc3Nfb3JfZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX29yX2VxdWFsXCIpLCB2YWx1ZTogXCI8PVwifSxcblx0XHRncmVhdGVyX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPj1cIn0sXG5cdFx0Y29udGFpbnM6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSwgdmFsdWU6IFwiY29udGFpbnNcIn0sXG5cdFx0bm90X2NvbnRhaW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9kb2VzX25vdF9jb250YWluXCIpLCB2YWx1ZTogXCJub3Rjb250YWluc1wifSxcblx0XHRzdGFydHNfd2l0aDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLCB2YWx1ZTogXCJzdGFydHN3aXRoXCJ9LFxuXHRcdGJldHdlZW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLCB2YWx1ZTogXCJiZXR3ZWVuXCJ9LFxuXHR9XG5cblx0aWYgZmllbGRfdHlwZSA9PSB1bmRlZmluZWRcblx0XHRyZXR1cm4gXy52YWx1ZXMob3B0aW9uYWxzKVxuXG5cdG9wZXJhdGlvbnMgPSBbXVxuXG5cdGlmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKVxuXHRcdENyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcInRleHRcIiBvciBmaWVsZF90eXBlID09IFwidGV4dGFyZWFcIiBvciBmaWVsZF90eXBlID09IFwiaHRtbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJjb2RlXCJcbiNcdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5jb250YWlucywgb3B0aW9uYWxzLm5vdF9jb250YWluLCBvcHRpb25hbHMuc3RhcnRzX3dpdGgpXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5jb250YWlucylcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwibG9va3VwXCIgb3IgZmllbGRfdHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBvciBmaWVsZF90eXBlID09IFwic2VsZWN0XCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiY3VycmVuY3lcIiBvciBmaWVsZF90eXBlID09IFwibnVtYmVyXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJib29sZWFuXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiY2hlY2tib3hcIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJbdGV4dF1cIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cblx0cmV0dXJuIG9wZXJhdGlvbnNcblxuIyMjXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXG4gICAg5YaN5bCG5rKh5pyJ5o6S5bqP5Y+355qE5pi+56S65ZyoXG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IChvYmplY3RfbmFtZSktPlxuXHRmaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LmZpZWxkc1xuXHRmaWVsZHNBcnIgPSBbXVxuXG5cdF8uZWFjaCBmaWVsZHMsIChmaWVsZCktPlxuXHRcdGZpZWxkc0Fyci5wdXNoIHtuYW1lOiBmaWVsZC5uYW1lLCBzb3J0X25vOiBmaWVsZC5zb3J0X25vfVxuXG5cdGZpZWxkc05hbWUgPSBbXVxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxuXHRcdGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKVxuXHRyZXR1cm4gZmllbGRzTmFtZVxuIiwiQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zID0gZnVuY3Rpb24oZmllbGRTY2hlbWEpIHtcbiAgdmFyIGRhdGFfdHlwZSwgb3B0aW9ucztcbiAgb3B0aW9ucyA9IGZpZWxkU2NoZW1hLm9wdGlvbnM7XG4gIGlmICghb3B0aW9ucykge1xuICAgIHJldHVybjtcbiAgfVxuICBkYXRhX3R5cGUgPSBmaWVsZFNjaGVtYS5kYXRhX3R5cGU7XG4gIGlmICghXy5pc0Z1bmN0aW9uKG9wdGlvbnMpICYmIGRhdGFfdHlwZSAmJiBkYXRhX3R5cGUgIT09ICd0ZXh0Jykge1xuICAgIG9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvcHRpb25JdGVtKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbkl0ZW0udmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChbJ251bWJlcicsICdjdXJyZW5jeScsICdwZXJjZW50J10uaW5kZXhPZihkYXRhX3R5cGUpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbkl0ZW0udmFsdWUgPSBOdW1iZXIob3B0aW9uSXRlbS52YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGRhdGFfdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25JdGVtLnZhbHVlID0gb3B0aW9uSXRlbS52YWx1ZSA9PT0gJ3RydWUnO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvcHRpb25zO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGZpZWxkc0Fyciwgc2NoZW1hO1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICBzY2hlbWEgPSB7fTtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChvYmouZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmICghXy5oYXMoZmllbGQsIFwibmFtZVwiKSkge1xuICAgICAgZmllbGQubmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaChmaWVsZCk7XG4gIH0pO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgdmFyIF9vYmplY3QsIF9yZWZfb2JqLCBfcmVmZXJlbmNlX3RvLCBhdXRvZm9ybV90eXBlLCBjb2xsZWN0aW9uTmFtZSwgZmllbGRfbmFtZSwgZnMsIGZzVHlwZSwgaXNVbkxpbWl0ZWQsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc2lPUygpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiLFxuICAgICAgICAgICAgICAgIHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCIsXG4gICAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGltZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgIHR5cGU6IFwidGltZVwiLFxuICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJISDptbVwiXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc2lPUygpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIixcbiAgICAgICAgICAgICAgICBwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgICBkYXRlTW9iaWxlT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIltPYmplY3RdXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbT2JqZWN0XTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiaHRtbFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb247XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgfVxuICAgICAgaWYgKCFmaWVsZC5oaWRkZW4pIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnM7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlcGVuZE9uID0gZmllbGQuZGVwZW5kX29uO1xuICAgICAgICBpZiAoZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uKSB7XG4gICAgICAgICAgZnMuYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGZzLmZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA/IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA6IENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzO1xuICAgICAgICBpZiAoZmllbGQub3B0aW9uc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8pIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICBpZiAoZmllbGQuY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b107XG4gICAgICAgICAgICAgICAgaWYgKF9yZWZfb2JqICE9IG51bGwgPyAocmVmMSA9IF9yZWZfb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMS5hbGxvd0NyZWF0ZSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24obG9va3VwX2ZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuXCIgKyAoQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bykuX25hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgIGZvcm1JZDogXCJuZXdcIiArIChmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsICdfJykpLFxuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBcIlwiICsgZmllbGQucmVmZXJlbmNlX3RvLFxuICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJpbnNlcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKG9wZXJhdGlvbiwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQub2JqZWN0X25hbWUgPT09IFwib2JqZWN0c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiByZXN1bHQudmFsdWUuaWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0LnZhbHVlLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZVtvYmplY3QuTkFNRV9GSUVMRF9LRVldIHx8IHJlc3VsdC52YWx1ZS5sYWJlbCB8fCByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2Vfc29ydCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc1NvcnQgPSBmaWVsZC5yZWZlcmVuY2Vfc29ydDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9saW1pdCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VUb0ZpZWxkID0gZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcInVzZXJzXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdHVzZXJcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gKHJlZjIgPSBvYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYyLmdldCgpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcIm9yZ2FuaXphdGlvbnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYzID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMy5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgICAgICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlO1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dO1xuICAgICAgICAgICAgaWYgKF9vYmplY3QgJiYgX29iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjtcbiAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW107XG4gICAgICAgICAgICAgICAgX3JlZmVyZW5jZV90by5mb3JFYWNoKGZ1bmN0aW9uKF9yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV07XG4gICAgICAgICAgICAgICAgICBpZiAoX29iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QubGFiZWwgOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgaWNvbjogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2U7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgICBpZiAoXy5oYXMoZmllbGQsICdmaXJzdE9wdGlvbicpKSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBmaWVsZC5maXJzdE9wdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmaWVsZC5kYXRhX3R5cGUgJiYgZmllbGQuZGF0YV90eXBlICE9PSBcInRleHRcIikge1xuICAgICAgICBpZiAoW1wibnVtYmVyXCIsIFwiY3VycmVuY3lcIiwgXCJwZXJjZW50XCJdLmluZGV4T2YoZmllbGQuZGF0YV90eXBlKSA+IC0xKSB7XG4gICAgICAgICAgZnNUeXBlID0gTnVtYmVyO1xuICAgICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLmRhdGFfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICBmc1R5cGUgPSBCb29sZWFuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzVHlwZSA9IFN0cmluZztcbiAgICAgICAgfVxuICAgICAgICBmcy50eXBlID0gZnNUeXBlO1xuICAgICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgICBmcy50eXBlID0gW2ZzVHlwZV07XG4gICAgICAgIH1cbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IENyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyhmaWVsZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRvZ2dsZVwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInJlZmVyZW5jZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIjtcbiAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlXCIpIHtcbiAgICAgIGNvbGxlY3Rpb25OYW1lID0gZmllbGQuY29sbGVjdGlvbiB8fCBcImZpbGVzXCI7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25OYW1lO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlc2l6ZVwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImdyaWRcIikge1xuICAgICAgZnMudHlwZSA9IEFycmF5O1xuICAgICAgZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIjtcbiAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJpbWFnZVwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdpbWFnZXMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXZhdGFyXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F2YXRhcnMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF1ZGlvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F1ZGlvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdhdWRpby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ2aWRlb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICd2aWRlb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAndmlkZW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9jYXRpb25cIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCI7XG4gICAgICBmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiO1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJtYXJrZG93blwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGV4dFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3VybCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2VtYWlsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2Zvcm11bGEnKSB7XG4gICAgICBmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7XG4gICAgICAgICAgICB0eXBlOiBmaWVsZC5kYXRhX3R5cGVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVtmaWVsZC5uYW1lXTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdzdW1tYXJ5Jykge1xuICAgICAgZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge1xuICAgICAgICAgICAgdHlwZTogZmllbGQuZGF0YV90eXBlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlbZmllbGQubmFtZV07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAncGVyY2VudCcpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoIV8uaXNOdW1iZXIoZmllbGQuc2NhbGUpKSB7XG4gICAgICAgIGZpZWxkLnNjYWxlID0gMDtcbiAgICAgIH1cbiAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGUgKyAyO1xuICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZzLnR5cGUgPSBmaWVsZC50eXBlO1xuICAgIH1cbiAgICBpZiAoZmllbGQubGFiZWwpIHtcbiAgICAgIGZzLmxhYmVsID0gZmllbGQubGFiZWw7XG4gICAgfVxuICAgIGlmICghZmllbGQucmVxdWlyZWQpIHtcbiAgICAgIGZzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLnVuaXF1ZSkge1xuICAgICAgZnMudW5pcXVlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLm9taXQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZ3JvdXApIHtcbiAgICAgIGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXA7XG4gICAgfVxuICAgIGlmIChmaWVsZC5pc193aWRlKSB7XG4gICAgICBmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmhpZGRlbikge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgfVxuICAgIGlmICgoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpIHx8IChmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuZmlsdGVyYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5uYW1lID09PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5zZWFyY2hhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF1dG9mb3JtX3R5cGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGVmYXVsdFZhbHVlKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge1xuICAgICAgICAgICAgdXNlcklkOiBNZXRlb3IudXNlcklkKCksXG4gICAgICAgICAgICBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksXG4gICAgICAgICAgICBub3c6IG5ldyBEYXRlKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICBmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kaXNhYmxlZCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaW5saW5lSGVscFRleHQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHQ7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ibGFja2JveCkge1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtaW4nKSkge1xuICAgICAgZnMubWluID0gZmllbGQubWluO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtYXgnKSkge1xuICAgICAgZnMubWF4ID0gZmllbGQubWF4O1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzUHJvZHVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLmluZGV4KSB7XG4gICAgICAgIGZzLmluZGV4ID0gZmllbGQuaW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLnNvcnRhYmxlKSB7XG4gICAgICAgIGZzLmluZGV4ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzO1xuICB9KTtcbiAgcmV0dXJuIHNjaGVtYTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpIHtcbiAgdmFyIGZpZWxkLCBodG1sLCBvYmplY3Q7XG4gIGh0bWwgPSBmaWVsZF92YWx1ZTtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKTtcbiAgaWYgKCFmaWVsZCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpO1xuICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gIH1cbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcInRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKTtcbn07XG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgb3BlcmF0aW9ucykge1xuICB2YXIgYnVpbHRpblZhbHVlcztcbiAgYnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmIChidWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuIF8uZm9yRWFjaChidWlsdGluVmFsdWVzLCBmdW5jdGlvbihidWlsdGluSXRlbSwga2V5KSB7XG4gICAgICByZXR1cm4gb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLFxuICAgICAgICB2YWx1ZToga2V5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIGtleSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlLCB2YWx1ZSkge1xuICB2YXIgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIHJlc3VsdDtcbiAgaWYgKCFfLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmICghYmV0d2VlbkJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVzdWx0ID0gbnVsbDtcbiAgXy5lYWNoKGJldHdlZW5CdWlsdGluVmFsdWVzLCBmdW5jdGlvbihpdGVtLCBvcGVyYXRpb24pIHtcbiAgICBpZiAoaXRlbS5rZXkgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzdWx0ID0gb3BlcmF0aW9uO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIHtcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSBmdW5jdGlvbihtb250aCkge1xuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHJldHVybiAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIHJldHVybiAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIHJldHVybiA2O1xuICB9XG4gIHJldHVybiA5O1xufTtcblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHllYXItLTtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIHtcbiAgICBtb250aCA9IDY7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSA2O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGggPSAwO1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIHZhciBkYXlzLCBlbmREYXRlLCBtaWxsaXNlY29uZCwgc3RhcnREYXRlO1xuICBpZiAobW9udGggPT09IDExKSB7XG4gICAgcmV0dXJuIDMxO1xuICB9XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgc3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAxKTtcbiAgZGF5cyA9IChlbmREYXRlIC0gc3RhcnREYXRlKSAvIG1pbGxpc2Vjb25kO1xuICByZXR1cm4gZGF5cztcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPT09IDApIHtcbiAgICBtb250aCA9IDExO1xuICAgIHllYXItLTtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICB9XG4gIG1vbnRoLS07XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICB2YXIgY3VycmVudE1vbnRoLCBjdXJyZW50WWVhciwgZW5kVmFsdWUsIGZpcnN0RGF5LCBsYWJlbCwgbGFzdERheSwgbGFzdE1vbmRheSwgbGFzdE1vbnRoRmluYWxEYXksIGxhc3RNb250aEZpcnN0RGF5LCBsYXN0UXVhcnRlckVuZERheSwgbGFzdFF1YXJ0ZXJTdGFydERheSwgbGFzdFN1bmRheSwgbGFzdF8xMjBfZGF5cywgbGFzdF8zMF9kYXlzLCBsYXN0XzYwX2RheXMsIGxhc3RfN19kYXlzLCBsYXN0XzkwX2RheXMsIG1pbGxpc2Vjb25kLCBtaW51c0RheSwgbW9uZGF5LCBtb250aCwgbmV4dE1vbmRheSwgbmV4dE1vbnRoRmluYWxEYXksIG5leHRNb250aEZpcnN0RGF5LCBuZXh0UXVhcnRlckVuZERheSwgbmV4dFF1YXJ0ZXJTdGFydERheSwgbmV4dFN1bmRheSwgbmV4dFllYXIsIG5leHRfMTIwX2RheXMsIG5leHRfMzBfZGF5cywgbmV4dF82MF9kYXlzLCBuZXh0XzdfZGF5cywgbmV4dF85MF9kYXlzLCBub3csIHByZXZpb3VzWWVhciwgc3RhcnRWYWx1ZSwgc3RyRW5kRGF5LCBzdHJGaXJzdERheSwgc3RyTGFzdERheSwgc3RyTW9uZGF5LCBzdHJTdGFydERheSwgc3RyU3VuZGF5LCBzdHJUb2RheSwgc3RyVG9tb3Jyb3csIHN0clllc3RkYXksIHN1bmRheSwgdGhpc1F1YXJ0ZXJFbmREYXksIHRoaXNRdWFydGVyU3RhcnREYXksIHRvbW9ycm93LCB2YWx1ZXMsIHdlZWssIHllYXIsIHllc3RkYXk7XG4gIG5vdyA9IG5ldyBEYXRlKCk7XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgeWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgd2VlayA9IG5vdy5nZXREYXkoKTtcbiAgbWludXNEYXkgPSB3ZWVrICE9PSAwID8gd2VlayAtIDEgOiA2O1xuICBtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdFN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgbmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIG5leHRTdW5kYXkgPSBuZXcgRGF0ZShuZXh0TW9uZGF5LmdldFRpbWUoKSArIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgY3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgcHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxO1xuICBuZXh0WWVhciA9IGN1cnJlbnRZZWFyICsgMTtcbiAgY3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgZmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCAxKTtcbiAgaWYgKGN1cnJlbnRNb250aCA9PT0gMTEpIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGgrKztcbiAgfSBlbHNlIHtcbiAgICBtb250aCsrO1xuICB9XG4gIG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLCBtb250aCkpO1xuICBsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwgMSk7XG4gIHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyKSk7XG4gIGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlIFwibGFzdF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc195ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3Rfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc193ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ5ZXN0ZGF5XCI6XG4gICAgICBzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9kYXlcIjpcbiAgICAgIHN0clRvZGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b21vcnJvd1wiOlxuICAgICAgc3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gIH1cbiAgdmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIF8uZm9yRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGZ2KSB7XG4gICAgICBpZiAoZnYpIHtcbiAgICAgICAgcmV0dXJuIGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGtleToga2V5LFxuICAgIHZhbHVlczogdmFsdWVzXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgaWYgKGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2JldHdlZW4nO1xuICB9IGVsc2UgaWYgKFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2NvbnRhaW5zJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCI9XCI7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHZhciBvcGVyYXRpb25zLCBvcHRpb25hbHM7XG4gIG9wdGlvbmFscyA9IHtcbiAgICBlcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI9XCJcbiAgICB9LFxuICAgIHVuZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PlwiXG4gICAgfSxcbiAgICBsZXNzX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIjxcIlxuICAgIH0sXG4gICAgZ3JlYXRlcl90aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI+XCJcbiAgICB9LFxuICAgIGxlc3Nfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PVwiXG4gICAgfSxcbiAgICBncmVhdGVyX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPj1cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLFxuICAgICAgdmFsdWU6IFwiY29udGFpbnNcIlxuICAgIH0sXG4gICAgbm90X2NvbnRhaW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksXG4gICAgICB2YWx1ZTogXCJub3Rjb250YWluc1wiXG4gICAgfSxcbiAgICBzdGFydHNfd2l0aDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksXG4gICAgICB2YWx1ZTogXCJzdGFydHN3aXRoXCJcbiAgICB9LFxuICAgIGJldHdlZW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksXG4gICAgICB2YWx1ZTogXCJiZXR3ZWVuXCJcbiAgICB9XG4gIH07XG4gIGlmIChmaWVsZF90eXBlID09PSB2b2lkIDApIHtcbiAgICByZXR1cm4gXy52YWx1ZXMob3B0aW9uYWxzKTtcbiAgfVxuICBvcGVyYXRpb25zID0gW107XG4gIGlmIChDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbik7XG4gICAgQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJ0ZXh0YXJlYVwiIHx8IGZpZWxkX3R5cGUgPT09IFwiaHRtbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwiY29kZVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5jb250YWlucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZF90eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCBmaWVsZF90eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY3VycmVuY3lcIiB8fCBmaWVsZF90eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiW3RleHRdXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9XG4gIHJldHVybiBvcGVyYXRpb25zO1xufTtcblxuXG4vKlxuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBmaWVsZHMsIGZpZWxkc0FyciwgZmllbGRzTmFtZSwgcmVmO1xuICBmaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKHtcbiAgICAgIG5hbWU6IGZpZWxkLm5hbWUsXG4gICAgICBzb3J0X25vOiBmaWVsZC5zb3J0X25vXG4gICAgfSk7XG4gIH0pO1xuICBmaWVsZHNOYW1lID0gW107XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIGZpZWxkc05hbWU7XG59O1xuIiwiQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9XG5cbmluaXRUcmlnZ2VyID0gKG9iamVjdF9uYW1lLCB0cmlnZ2VyKS0+XG5cdHRyeVxuXHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXG5cdFx0aWYgIXRyaWdnZXIudG9kb1xuXHRcdFx0cmV0dXJuXG5cdFx0dG9kb1dyYXBwZXIgPSAoKS0+XG5cdFx0XHQgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZVxuXHRcdFx0ICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcblx0XHRpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUuaW5zZXJ0XCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8udXBkYXRlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUucmVtb3ZlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5pbnNlcnRcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/Lmluc2VydCh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy51cGRhdGUodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnJlbW92ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRjYXRjaCBlcnJvclxuXHRcdGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpXG5cbmNsZWFuVHJpZ2dlciA9IChvYmplY3RfbmFtZSktPlxuXHQjIyNcbiAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG5cdCMjI1xuICAgICNUT0RPIOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbBidWdcblx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0/LnJldmVyc2UoKS5mb3JFYWNoIChfaG9vayktPlxuXHRcdF9ob29rLnJlbW92ZSgpXG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gKG9iamVjdF9uYW1lKS0+XG4jXHRjb25zb2xlLmxvZygnQ3JlYXRvci5pbml0VHJpZ2dlcnMgb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSlcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0Y2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKVxuXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW11cblxuXHRfLmVhY2ggb2JqLnRyaWdnZXJzLCAodHJpZ2dlciwgdHJpZ2dlcl9uYW1lKS0+XG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyIGFuZCB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcblx0XHRcdGlmIF90cmlnZ2VyX2hvb2tcblx0XHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXG5cdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spIiwidmFyIGNsZWFuVHJpZ2dlciwgaW5pdFRyaWdnZXI7XG5cbkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fTtcblxuaW5pdFRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdHJpZ2dlcikge1xuICB2YXIgY29sbGVjdGlvbiwgZXJyb3IsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgdG9kb1dyYXBwZXI7XG4gIHRyeSB7XG4gICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgaWYgKCF0cmlnZ2VyLnRvZG8pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdG9kb1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZTtcbiAgICAgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmLmluc2VydCh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjEgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjEudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmMi5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjMgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmMy5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjQgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNC51cGRhdGUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjUgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNS5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpO1xuICB9XG59O1xuXG5jbGVhblRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuXG4gIC8qXG4gICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXG4gICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG4gICAqL1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uKF9ob29rKSB7XG4gICAgcmV0dXJuIF9ob29rLnJlbW92ZSgpO1xuICB9KSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIG9iajtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdO1xuICByZXR1cm4gXy5lYWNoKG9iai50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwgdHJpZ2dlcl9uYW1lKSB7XG4gICAgdmFyIF90cmlnZ2VyX2hvb2s7XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICBpZiAoX3RyaWdnZXJfaG9vaykge1xuICAgICAgICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIHJldHVybiBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpXG5cbmJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImFsbG93Q3JlYXRlXCIsIFwiYWxsb3dEZWxldGVcIiwgXCJhbGxvd0VkaXRcIiwgXCJhbGxvd1JlYWRcIiwgXCJtb2RpZnlBbGxSZWNvcmRzXCIsIFwidmlld0FsbFJlY29yZHNcIiwgXCJtb2RpZnlDb21wYW55UmVjb3Jkc1wiLCBcInZpZXdDb21wYW55UmVjb3Jkc1wiLCBcblx0XCJhbGxvd1JlYWRGaWxlc1wiLCBcImFsbG93RWRpdEZpbGVzXCIsIFwiYWxsb3dDcmVhdGVGaWxlc1wiLCBcImFsbG93RGVsZXRlRmlsZXNcIiwgXCJ2aWV3QWxsRmlsZXNcIiwgXCJtb2RpZnlBbGxGaWxlc1wiXSBcbm90aGVyUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImRpc2FibGVkX2xpc3Rfdmlld3NcIiwgXCJkaXNhYmxlZF9hY3Rpb25zXCIsIFwidW5yZWFkYWJsZV9maWVsZHNcIiwgXCJ1bmVkaXRhYmxlX2ZpZWxkc1wiLCBcInVucmVsYXRlZF9vYmplY3RzXCIsIFwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcIl1cbnBlcm1pc3Npb25Qcm9wTmFtZXMgPSBfLnVuaW9uIGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzXG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmICFvYmpcblx0XHRcdHJldHVyblxuXHRcdHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KClcblx0ZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XG5cdCMg6ZmE5Lu25p2D6ZmQ5LiN5YaN5LiO5YW254i26K6w5b2V57yW6L6R6YWN572u5YWz6IGUXG5cdCMgaWYgcmVjb3JkIGFuZCBvYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0IyBcdCMg5aaC5p6c5pivY21zX2ZpbGVz6ZmE5Lu277yM5YiZ5p2D6ZmQ5Y+W5YW254i26K6w5b2V5p2D6ZmQXG5cdCMgXHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKVxuXHQjIFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tuivpue7hueVjOmdolxuXHQjIFx0XHRvYmplY3RfbmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuXHQjIFx0XHRyZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcblx0IyBcdGVsc2UgXG5cdCMgXHRcdCMg5b2T5YmN5aSE5LqOY21zX2ZpbGVz6ZmE5Lu255qE54i26K6w5b2V55WM6Z2iXG5cdCMgXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XG5cdCMgXHRcdHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuXHQjIFx0b2JqZWN0X2ZpZWxkc19rZXlzID0gXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uZmllbGRzIG9yIHt9KSB8fCBbXTtcblx0IyBcdHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcblx0IyBcdGlmIHNlbGVjdC5sZW5ndGggPiAwXG5cdCMgXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdC5qb2luKCcsJykpO1xuXHQjIFx0ZWxzZVxuXHQjIFx0XHRyZWNvcmQgPSBudWxsO1xuXG5cdHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKVxuXG5cdGlmIHJlY29yZFxuXHRcdGlmICFfLmlzRW1wdHkocmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucylcblx0XHRcdHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXG5cblx0XHRpc093bmVyID0gcmVjb3JkLm93bmVyID09IHVzZXJJZCB8fCByZWNvcmQub3duZXI/Ll9pZCA9PSB1c2VySWRcblxuXHRcdGlmIG9iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdCMg6ZmE5Lu255qE5p+l55yL5omA5pyJ5L+u5pS55omA5pyJ5p2D6ZmQ5LiO6ZmE5Lu25a+56LGh55qEdmlld0FsbFJlY29yZHPjgIFtb2RpZnlBbGxSZWNvcmRz5peg5YWz77yM5Y+q5LiO5YW25Li76KGo6K6w5b2V55qEdmlld0FsbEZpbGVz5ZKMbW9kaWZ5QWxsRmlsZXPmnInlhbNcblx0XHRcdCMg5aaC5p6c5pivY21zX2ZpbGVz6ZmE5Lu277yM5YiZ5p2D6ZmQ6ZyA6KaB6aKd5aSW6ICD6JmR5YW254i25a+56LGh5LiK5YWz5LqO6ZmE5Lu255qE5p2D6ZmQ6YWN572uXG5cdFx0XHRtYXN0ZXJPYmplY3ROYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG5cdFx0XHRtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhtYXN0ZXJPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gcGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXNcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0RlbGV0ZUZpbGVzXG5cdFx0XHRpZiAhbWFzdGVyUmVjb3JkUGVybS5tb2RpZnlBbGxGaWxlcyBhbmQgIWlzT3duZXJcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gcGVybWlzc2lvbnMuYWxsb3dSZWFkICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkRmlsZXNcblx0XHRcdGlmICFtYXN0ZXJSZWNvcmRQZXJtLnZpZXdBbGxGaWxlcyBhbmQgIWlzT3duZXJcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZD8uY29tcGFueV9pZFxuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpIGFuZCByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZOaYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEb2JqZWN077yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XG5cdFx0XHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQ/LmNvbXBhbnlfaWRzXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWRzWzBdKVxuXHRcdFx0XHQjIOWboHJlY29yZF9jb21wYW55X2lkc+aYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEW29iamVjdF3vvIzmiYDku6Xov5nph4zlj5blh7rlhbZfaWTlgLxcblx0XHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcCgobiktPiBuLl9pZClcblx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKVxuXHRcdFx0aWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0ZWxzZSBpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5L+u5pS5XG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5L+u5pS5XG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRpZiByZWNvcmQubG9ja2VkIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cblx0XHRcdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5p+l55yLXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lk5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+afpeeci1xuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XG5cdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cbiMgY3VycmVudE9iamVjdE5hbWXvvJrlvZPliY3kuLvlr7nosaFcbiMgcmVsYXRlZExpc3RJdGVt77yaQ3JlYXRvci5nZXRSZWxhdGVkTGlzdChTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpLCBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSnkuK3lj5ZyZWxhdGVkX29iamVjdF9uYW1l5a+55bqU55qE5YC8XG4jIGN1cnJlbnRSZWNvcmTlvZPliY3kuLvlr7nosaHnmoTor6bnu4borrDlvZVcbmlmIE1ldGVvci5pc0NsaWVudFxuXHRDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMgPSAoY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XG5cdFx0aWYgIWN1cnJlbnRPYmplY3ROYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdFx0aWYgIXJlbGF0ZWRMaXN0SXRlbVxuXHRcdFx0Y29uc29sZS5lcnJvcihcInJlbGF0ZWRMaXN0SXRlbSBtdXN0IG5vdCBiZSBlbXB0eSBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9uc1wiKTtcblx0XHRcdHJldHVybiB7fVxuXG5cdFx0aWYgIWN1cnJlbnRSZWNvcmQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Y3VycmVudFJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcblxuXHRcdGlmICF1c2VySWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0XHRpZiAhc3BhY2VJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cblx0XHRtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKVxuXHRcdHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKVxuXHRcdHJlc3VsdCA9IF8uY2xvbmUgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zXG5cblx0XHRpZiByZWxhdGVkTGlzdEl0ZW0uaXNfZmlsZVxuXHRcdFx0cmVzdWx0LmFsbG93Q3JlYXRlID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlc1xuXHRcdFx0cmVzdWx0LmFsbG93RWRpdCA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlc1xuXHRcdGVsc2Vcblx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZExpc3RJdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIHx8IGZhbHNlXG5cdFx0XHRtYXN0ZXJBbGxvdyA9IGZhbHNlXG5cdFx0XHRpZiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PSB0cnVlXG5cdFx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRcblx0XHRcdGVsc2UgaWYgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT0gZmFsc2Vcblx0XHRcdFx0bWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdFxuXG5cdFx0XHR1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKVxuXHRcdFx0aXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlID0gdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QuaW5kZXhPZihyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpID4gLTFcblxuXHRcdFx0cmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcblx0XHRcdHJlc3VsdC5hbGxvd0VkaXQgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcblx0XHRyZXR1cm4gcmVzdWx0XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkKSAtPlxuXHRcdHBlcm1pc3Npb25zID1cblx0XHRcdG9iamVjdHM6IHt9XG5cdFx0XHRhc3NpZ25lZF9hcHBzOiBbXVxuXHRcdCMjI1xuXHRcdOadg+mZkOmbhuivtOaYjjpcblx0XHTlhoXnva7mnYPpmZDpm4YtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXG5cdFx06Ieq5a6a5LmJ5p2D6ZmQ6ZuGLeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOmbhuS7peWklueahOWFtuS7luadg+mZkOmbhlxuXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG5cdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ6ZuGXG5cdFx0IyMjXG5cblx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxuXHRcdHNwYWNlVXNlciA9IG51bGxcblx0XHRpZiB1c2VySWRcblx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXG5cdFx0cHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cblx0XHRwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRlbHNlXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cblx0XHRwc2V0c0FkbWluX3BvcyA9IG51bGxcblx0XHRwc2V0c1VzZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IG51bGxcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IG51bGxcblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gbnVsbFxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbFxuXG5cdFx0aWYgcHNldHNBZG1pbj8uX2lkXG5cdFx0XHRwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxuXHRcdFx0cHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzTWVtYmVyPy5faWRcblx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNHdWVzdD8uX2lkXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1N1cHBsaWVyPy5faWRcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzQ3VzdG9tZXI/Ll9pZFxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cblx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIl9pZFwiXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiB7JGluOiBzZXRfaWRzfX0pLmZldGNoKClcblx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXG5cdFx0cHNldHMgPSB7XG5cdFx0XHRwc2V0c0FkbWluLCBcblx0XHRcdHBzZXRzVXNlciwgXG5cdFx0XHRwc2V0c0N1cnJlbnQsIFxuXHRcdFx0cHNldHNNZW1iZXIsIFxuXHRcdFx0cHNldHNHdWVzdCxcblx0XHRcdHBzZXRzU3VwcGxpZXIsXG5cdFx0XHRwc2V0c0N1c3RvbWVyLFxuXHRcdFx0aXNTcGFjZUFkbWluLFxuXHRcdFx0c3BhY2VVc2VyLCBcblx0XHRcdHBzZXRzQWRtaW5fcG9zLCBcblx0XHRcdHBzZXRzVXNlcl9wb3MsIFxuXHRcdFx0cHNldHNNZW1iZXJfcG9zLCBcblx0XHRcdHBzZXRzR3Vlc3RfcG9zLFxuXHRcdFx0cHNldHNTdXBwbGllcl9wb3MsXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3Bvcyxcblx0XHRcdHBzZXRzQ3VycmVudF9wb3Ncblx0XHR9XG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpXG5cdFx0cGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lc1xuXHRcdF9pID0gMFxuXHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG5cdFx0XHRfaSsrXG5cdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PSBzcGFjZUlkXG5cdFx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PSAnMCcgfHwgKG9iamVjdC5pbl9kZXZlbG9wbWVudCAhPSAnMCcgJiYgaXNTcGFjZUFkbWluKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblx0dW5pb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cblx0XHRpZiAhYXJyYXkgYW5kICFvdGhlclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRcdGlmICFhcnJheVxuXHRcdFx0YXJyYXkgPSBbXVxuXHRcdGlmICFvdGhlclxuXHRcdFx0b3RoZXIgPSBbXVxuXHRcdHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcilcblxuXHRpbnRlcnNlY3Rpb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cblx0XHRpZiAhYXJyYXkgYW5kICFvdGhlclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRcdGlmICFhcnJheVxuXHRcdFx0YXJyYXkgPSBbXVxuXHRcdGlmICFvdGhlclxuXHRcdFx0b3RoZXIgPSBbXVxuXHRcdHJldHVybiBfLmludGVyc2VjdGlvbihhcnJheSwgb3RoZXIpXG5cblx0ZXh0ZW5kUGVybWlzc2lvblByb3BzID0gKHRhcmdldCwgcHJvcHMpIC0+XG5cdFx0cHJvcE5hbWVzID0gcGVybWlzc2lvblByb3BOYW1lc1xuXHRcdGZpbGVzUHJvTmFtZXMgPSBcblx0XHRpZiBwcm9wc1xuXHRcdFx0Xy5lYWNoIHByb3BOYW1lcywgKHByb3BOYW1lKSAtPlxuXHRcdFx0XHR0YXJnZXRbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdXG5cblx0XHRcdCMgdGFyZ2V0LmFsbG93Q3JlYXRlID0gcHJvcHMuYWxsb3dDcmVhdGVcblx0XHRcdCMgdGFyZ2V0LmFsbG93RGVsZXRlID0gcHJvcHMuYWxsb3dEZWxldGVcblx0XHRcdCMgdGFyZ2V0LmFsbG93RWRpdCA9IHByb3BzLmFsbG93RWRpdFxuXHRcdFx0IyB0YXJnZXQuYWxsb3dSZWFkID0gcHJvcHMuYWxsb3dSZWFkXG5cdFx0XHQjIHRhcmdldC5tb2RpZnlBbGxSZWNvcmRzID0gcHJvcHMubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQudmlld0FsbFJlY29yZHMgPSBwcm9wcy52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwcm9wcy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQudmlld0NvbXBhbnlSZWNvcmRzID0gcHJvcHMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHQjIHRhcmdldC5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcHJvcHMuZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0IyB0YXJnZXQuZGlzYWJsZWRfYWN0aW9ucyA9IHByb3BzLmRpc2FibGVkX2FjdGlvbnNcblx0XHRcdCMgdGFyZ2V0LnVucmVhZGFibGVfZmllbGRzID0gcHJvcHMudW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdCMgdGFyZ2V0LnVuZWRpdGFibGVfZmllbGRzID0gcHJvcHMudW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdCMgdGFyZ2V0LnVucmVsYXRlZF9vYmplY3RzID0gcHJvcHMudW5yZWxhdGVkX29iamVjdHNcblx0XHRcdCMgdGFyZ2V0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcHJvcHMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcblxuXHRvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMgPSAodGFyZ2V0LCBwcm9wcykgLT5cblx0XHRwcm9wTmFtZXMgPSBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXNcblx0XHRfLmVhY2ggcHJvcE5hbWVzLCAocHJvcE5hbWUpIC0+XG5cdFx0XHRpZiBwcm9wc1twcm9wTmFtZV1cblx0XHRcdFx0dGFyZ2V0W3Byb3BOYW1lXSA9IHRydWVcblx0XHRcblx0XHQjIGlmIHBvLmFsbG93UmVhZFxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0NyZWF0ZVxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWVcblx0XHQjIGlmIHBvLmFsbG93RWRpdFxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHQjIGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWVcblx0XHQjIGlmIHBvLnZpZXdBbGxSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxuXHRcdCMgaWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cdFx0IyBpZiBwby52aWV3Q29tcGFueVJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXG5cblx0Q3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0cHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzU3VwcGxpZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzQ3VzdG9tZXIgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0IyBwc2V0c01lbWJlciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdCMgcHNldHNHdWVzdCA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRzcGFjZVVzZXIgPSBudWxsO1xuXHRcdGlmIHVzZXJJZFxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRlbHNlXG5cdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRhcHBzID0gW11cblx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdHJldHVybiBbXVxuXHRcdGVsc2Vcblx0XHRcdHVzZXJQcm9maWxlID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pPy5wcm9maWxlXG5cdFx0XHRwc2V0QmFzZSA9IHBzZXRzVXNlclxuXHRcdFx0aWYgdXNlclByb2ZpbGVcblx0XHRcdFx0aWYgdXNlclByb2ZpbGUgPT0gJ3N1cHBsaWVyJ1xuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNTdXBwbGllclxuXHRcdFx0XHRlbHNlIGlmIHVzZXJQcm9maWxlID09ICdjdXN0b21lcidcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXJcblx0XHRcdGlmIHBzZXRCYXNlPy5hc3NpZ25lZF9hcHBzPy5sZW5ndGhcblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIHVzZXLmnYPpmZDpm4bkuK3nmoRhc3NpZ25lZF9hcHBz6KGo56S65omA5pyJ55So5oi35YW35pyJ55qEYXBwc+adg+mZkO+8jOS4uuepuuWImeihqOekuuacieaJgOaciWFwcHPmnYPpmZDvvIzkuI3pnIDopoHkvZzmnYPpmZDliKTmlq3kuoZcblx0XHRcdFx0cmV0dXJuIFtdXG5cdFx0XHRfLmVhY2ggcHNldHMsIChwc2V0KS0+XG5cdFx0XHRcdGlmICFwc2V0LmFzc2lnbmVkX2FwcHNcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgcHNldC5uYW1lID09IFwiYWRtaW5cIiB8fCAgcHNldC5uYW1lID09IFwidXNlclwiIHx8IHBzZXQubmFtZSA9PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PSAnY3VzdG9tZXInXG5cdFx0XHRcdFx0IyDov5nph4zkuYvmiYDku6XopoHmjpLpmaRhZG1pbi91c2Vy77yM5piv5Zug5Li66L+Z5Lik5Liq5p2D6ZmQ6ZuG5piv5omA5pyJ5p2D6ZmQ6ZuG5LitdXNlcnPlsZ7mgKfml6DmlYjnmoTmnYPpmZDpm4bvvIznibnmjIflt6XkvZzljLrnrqHnkIblkZjlkozmiYDmnInnlKjmiLdcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzXG5cdFx0XHRyZXR1cm4gXy53aXRob3V0KF8udW5pcShhcHBzKSx1bmRlZmluZWQsbnVsbClcblxuXHRDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0cHNldHMgPSAgdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdGFkbWluTWVudXMgPSBDcmVhdG9yLkFwcHMuYWRtaW4/LmFkbWluX21lbnVzXG5cdFx0IyDlpoLmnpzmsqHmnIlhZG1pbuiPnOWNleivtOaYjuS4jemcgOimgeebuOWFs+WKn+iDve+8jOebtOaOpei/lOWbnuepulxuXHRcdHVubGVzcyBhZG1pbk1lbnVzXG5cdFx0XHRyZXR1cm4gW11cblx0XHRhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQgKG4pIC0+XG5cdFx0XHRuLl9pZCA9PSAnYWJvdXQnXG5cdFx0YWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyIChuKSAtPlxuXHRcdFx0bi5faWQgIT0gJ2Fib3V0J1xuXHRcdG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeSBfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCAobikgLT5cblx0XHRcdHJldHVybiBuLmFkbWluX21lbnVzIGFuZCBuLl9pZCAhPSAnYWRtaW4nXG5cdFx0KSwgJ3NvcnQnXG5cdFx0b3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpXG5cdFx0IyDoj5zljZXmnInkuInpg6jliIbnu4TmiJDvvIzorr7nva5BUFDoj5zljZXjgIHlhbbku5ZBUFDoj5zljZXku6Xlj4phYm91dOiPnOWNlVxuXHRcdGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSlcblx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdCMg5bel5L2c5Yy6566h55CG5ZGY5pyJ5YWo6YOo6I+c5Y2V5Yqf6IO9XG5cdFx0XHRyZXN1bHQgPSBhbGxNZW51c1xuXHRcdGVsc2Vcblx0XHRcdHVzZXJQcm9maWxlID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pPy5wcm9maWxlIHx8ICd1c2VyJ1xuXHRcdFx0Y3VycmVudFBzZXROYW1lcyA9IHBzZXRzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4ubmFtZVxuXHRcdFx0bWVudXMgPSBhbGxNZW51cy5maWx0ZXIgKG1lbnUpLT5cblx0XHRcdFx0cHNldHNNZW51ID0gbWVudS5wZXJtaXNzaW9uX3NldHNcblx0XHRcdFx0IyDlpoLmnpzmma7pgJrnlKjmiLfmnInmnYPpmZDvvIzliJnnm7TmjqXov5Tlm550cnVlXG5cdFx0XHRcdGlmIHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZih1c2VyUHJvZmlsZSkgPiAtMVxuXHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRcdCMg5ZCm5YiZ5Y+W5b2T5YmN55So5oi355qE5p2D6ZmQ6ZuG5LiObWVudeiPnOWNleimgeaxgueahOadg+mZkOmbhuWvueavlO+8jOWmguaenOS6pOmbhuWkp+S6jjHkuKrliJnov5Tlm550cnVlXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aFxuXHRcdFx0cmVzdWx0ID0gbWVudXNcblx0XHRcblx0XHRyZXR1cm4gXy5zb3J0QnkocmVzdWx0LFwic29ydFwiKVxuXG5cdGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpLT5cblxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBudWxsXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBfLmZpbmQgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cblx0XHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkfSlcblxuXHRmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcyktPlxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBudWxsXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBfLmZpbHRlciBwZXJtaXNzaW9uX29iamVjdHMsIChwbyktPlxuXHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogcGVybWlzc2lvbl9zZXRfaWRzfX0pLmZldGNoKClcblxuXHR1bmlvblBlcm1pc3Npb25PYmplY3RzID0gKHBvcywgb2JqZWN0LCBwc2V0cyktPlxuXHRcdCMg5oqKZGLlj4p5bWzkuK3nmoRwZXJtaXNzaW9uX29iamVjdHPlkIjlubbvvIzkvJjlhYjlj5ZkYuS4reeahFxuXHRcdHJlc3VsdCA9IFtdXG5cdFx0Xy5lYWNoIG9iamVjdC5wZXJtaXNzaW9uX3NldCwgKG9wcywgb3BzX2tleSktPlxuXHRcdFx0IyDmiop5bWzkuK3pmaTkuobnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4ZcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCLlpJbnmoTlhbbku5blr7nosaHmnYPpmZDlhYjlrZjlhaVyZXN1bHRcblx0XHRcdCMgaWYgW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIiwgXCJ3b3JrZmxvd19hZG1pblwiLCBcIm9yZ2FuaXphdGlvbl9hZG1pblwiXS5pbmRleE9mKG9wc19rZXkpIDwgMFxuXHRcdFx0aWYgW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDBcblx0XHRcdFx0Y3VycmVudFBzZXQgPSBwc2V0cy5maW5kIChwc2V0KS0+IHJldHVybiBwc2V0Lm5hbWUgPT0gb3BzX2tleVxuXHRcdFx0XHRpZiBjdXJyZW50UHNldFxuXHRcdFx0XHRcdHRlbXBPcHMgPSBfLmNsb25lKG9wcykgfHwge31cblx0XHRcdFx0XHR0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkXG5cdFx0XHRcdFx0dGVtcE9wcy5vYmplY3RfbmFtZSA9IG9iamVjdC5vYmplY3RfbmFtZVxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoIHRlbXBPcHNcblx0XHRpZiByZXN1bHQubGVuZ3RoXG5cdFx0XHRwb3MuZm9yRWFjaCAocG8pLT5cblx0XHRcdFx0cmVwZWF0SW5kZXggPSAwXG5cdFx0XHRcdHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoKGl0ZW0sIGluZGV4KS0+IHJlcGVhdEluZGV4ID0gaW5kZXg7cmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT0gcG8ucGVybWlzc2lvbl9zZXRfaWQpXG5cdFx0XHRcdCMg5aaC5p6ceW1s5Lit5bey57uP5a2Y5ZyocG/vvIzliJnmm7/mjaLkuLrmlbDmja7lupPkuK3nmoRwb++8jOWPjeS5i+WImeaKiuaVsOaNruW6k+S4reeahHBv55u05o6l57Sv5Yqg6L+b5Y67XG5cdFx0XHRcdGlmIHJlcGVhdFBvXG5cdFx0XHRcdFx0cmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXN1bHQucHVzaCBwb1xuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBwb3NcblxuXHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpLT5cblx0XHRwZXJtaXNzaW9ucyA9IHt9XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpXG5cblx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT0gXCJ1c2Vyc1wiXG5cdFx0XHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxuXHRcdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcblx0XHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXHRcdHBzZXRzQWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIG9yIHRoaXMucHNldHNBZG1pbiB0aGVuIHRoaXMucHNldHNBZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c1VzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgb3IgdGhpcy5wc2V0c1VzZXIgdGhlbiB0aGlzLnBzZXRzVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzTWVtYmVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgb3IgdGhpcy5wc2V0c01lbWJlciB0aGVuIHRoaXMucHNldHNNZW1iZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzR3Vlc3QgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIG9yIHRoaXMucHNldHNHdWVzdCB0aGVuIHRoaXMucHNldHNHdWVzdCBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjF9fSlcblxuXHRcdHBzZXRzU3VwcGxpZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzU3VwcGxpZXIpIG9yIHRoaXMucHNldHNTdXBwbGllciB0aGVuIHRoaXMucHNldHNTdXBwbGllciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c0N1c3RvbWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSBvciB0aGlzLnBzZXRzQ3VzdG9tZXIgdGhlbiB0aGlzLnBzZXRzQ3VzdG9tZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudDtcblx0XHRpZiAhcHNldHNcblx0XHRcdHNwYWNlVXNlciA9IG51bGw7XG5cdFx0XHRpZiB1c2VySWRcblx0XHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXG5cdFx0cHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zXG5cdFx0cHNldHNVc2VyX3BvcyA9IHRoaXMucHNldHNVc2VyX3Bvc1xuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zXG5cdFx0cHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zXG5cblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3Ncblx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3NcblxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3NcblxuXHRcdG9wc2V0QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5hZG1pbikgfHwge31cblx0XHRvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fVxuXHRcdG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fVxuXHRcdG9wc2V0R3Vlc3QgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cblxuXHRcdG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge31cblx0XHRvcHNldEN1c3RvbWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuY3VzdG9tZXIpIHx8IHt9XG5cblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X2xpc3R2aWV3cycpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNoYXJlZDogdHJ1ZX0sIHtmaWVsZHM6e19pZDoxfX0pLmZldGNoKClcblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IF8ucGx1Y2soc2hhcmVkTGlzdFZpZXdzLFwiX2lkXCIpXG5cdFx0IyBpZiBzaGFyZWRMaXN0Vmlld3MubGVuZ3RoXG5cdFx0IyBcdHVubGVzcyBvcHNldEFkbWluLmxpc3Rfdmlld3Ncblx0XHQjIFx0XHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBbXVxuXHRcdCMgXHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0QWRtaW4ubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXG5cdFx0IyBcdHVubGVzcyBvcHNldFVzZXIubGlzdF92aWV3c1xuXHRcdCMgXHRcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gW11cblx0XHQjIFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0VXNlci5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3Ncblx0XHQjIOaVsOaNruW6k+S4reWmguaenOmFjee9ruS6hum7mOiupOeahGFkbWluL3VzZXLmnYPpmZDpm4borr7nva7vvIzlupTor6Xopobnm5bku6PnoIHkuK1hZG1pbi91c2Vy55qE5p2D6ZmQ6ZuG6K6+572uXG5cdFx0aWYgcHNldHNBZG1pblxuXHRcdFx0cG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRBZG1pbiwgcG9zQWRtaW5cblx0XHRpZiBwc2V0c1VzZXJcblx0XHRcdHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0VXNlciwgcG9zVXNlclxuXHRcdGlmIHBzZXRzTWVtYmVyXG5cdFx0XHRwb3NNZW1iZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzTWVtYmVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzTWVtYmVyLl9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldE1lbWJlciwgcG9zTWVtYmVyXG5cdFx0aWYgcHNldHNHdWVzdFxuXHRcdFx0cG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRHdWVzdCwgcG9zR3Vlc3Rcblx0XHRpZiBwc2V0c1N1cHBsaWVyXG5cdFx0XHRwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRTdXBwbGllciwgcG9zU3VwcGxpZXJcblx0XHRpZiBwc2V0c0N1c3RvbWVyXG5cdFx0XHRwb3NDdXN0b21lciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXN0b21lcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0N1c3RvbWVyLl9pZCk7XG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRDdXN0b21lciwgcG9zQ3VzdG9tZXJcblxuXHRcdGlmICF1c2VySWRcblx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxuXHRcdGVsc2Vcblx0XHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnY29tbW9uJ1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzcGFjZVVzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgb3IgdGhpcy5zcGFjZVVzZXIgdGhlbiB0aGlzLnNwYWNlVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdFx0XHRcdGlmIHNwYWNlVXNlclxuXHRcdFx0XHRcdFx0cHJvZiA9IHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRcdFx0XHRpZiBwcm9mXG5cdFx0XHRcdFx0XHRcdGlmIHByb2YgaXMgJ3VzZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdtZW1iZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldE1lbWJlclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2d1ZXN0J1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ3N1cHBsaWVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRTdXBwbGllclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lclxuXHRcdFx0XHRcdFx0ZWxzZSAjIOayoeaciXByb2ZpbGXliJnorqTkuLrmmK91c2Vy5p2D6ZmQXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XG5cdFx0aWYgcHNldHMubGVuZ3RoID4gMFxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHMsIFwiX2lkXCJcblx0XHRcdHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpXG5cdFx0XHRwb3MgPSB1bmlvblBlcm1pc3Npb25PYmplY3RzKHBvcywgb2JqZWN0LCBwc2V0cylcblx0XHRcdF8uZWFjaCBwb3MsIChwbyktPlxuXHRcdFx0XHRpZiBwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0FkbWluPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzVXNlcj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c01lbWJlcj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0d1ZXN0Py5faWQgb3Jcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNTdXBwbGllcj8uX2lkIG9yXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQ3VzdG9tZXI/Ll9pZFxuXHRcdFx0XHRcdCMg6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOWAvOWPquWunuihjOS4iumdoueahOm7mOiupOWAvOimhueblu+8jOS4jeWBmueul+azleWIpOaWrVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBfLmlzRW1wdHkocGVybWlzc2lvbnMpXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBwb1xuXHRcdFx0XHRvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMgcGVybWlzc2lvbnMsIHBvXG5cblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cylcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCBwby51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdClcblx0XHRcblx0XHRpZiBvYmplY3QuaXNfdmlld1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdXG5cdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcblxuXHRcdGlmIG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lclxuXHRcdFx0cGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXG5cdCMgQ3JlYXRvci5pbml0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUpIC0+XG5cblx0XHQjICMg5bqU6K+l5oqK6K6h566X5Ye65p2l55qEXG5cdFx0IyBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXS5hbGxvd1xuXHRcdCMgXHRpbnNlcnQ6ICh1c2VySWQsIGRvYykgLT5cblx0XHQjIFx0XHRpZiAhdXNlcklkXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0ICAgIFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblx0XHQjIFx0dXBkYXRlOiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dFZGl0XG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdCMgXHRyZW1vdmU6ICh1c2VySWQsIGRvYykgLT5cblx0XHQjIFx0XHRpZiAhdXNlcklkXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblxuXHRNZXRlb3IubWV0aG9kc1xuXHRcdCMgQ2FsY3VsYXRlIFBlcm1pc3Npb25zIG9uIFNlcnZlclxuXHRcdFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogKHNwYWNlSWQpLT5cblx0XHRcdHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKVxuIiwidmFyIGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgY2xvbmUsIGV4dGVuZFBlcm1pc3Npb25Qcm9wcywgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCwgZmluZF9wZXJtaXNzaW9uX29iamVjdCwgaW50ZXJzZWN0aW9uUGx1cywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzLCBvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMsIHBlcm1pc3Npb25Qcm9wTmFtZXMsIHVuaW9uUGVybWlzc2lvbk9iamVjdHMsIHVuaW9uUGx1cztcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5iYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJhbGxvd0NyZWF0ZVwiLCBcImFsbG93RGVsZXRlXCIsIFwiYWxsb3dFZGl0XCIsIFwiYWxsb3dSZWFkXCIsIFwibW9kaWZ5QWxsUmVjb3Jkc1wiLCBcInZpZXdBbGxSZWNvcmRzXCIsIFwibW9kaWZ5Q29tcGFueVJlY29yZHNcIiwgXCJ2aWV3Q29tcGFueVJlY29yZHNcIiwgXCJhbGxvd1JlYWRGaWxlc1wiLCBcImFsbG93RWRpdEZpbGVzXCIsIFwiYWxsb3dDcmVhdGVGaWxlc1wiLCBcImFsbG93RGVsZXRlRmlsZXNcIiwgXCJ2aWV3QWxsRmlsZXNcIiwgXCJtb2RpZnlBbGxGaWxlc1wiXTtcblxub3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiZGlzYWJsZWRfbGlzdF92aWV3c1wiLCBcImRpc2FibGVkX2FjdGlvbnNcIiwgXCJ1bnJlYWRhYmxlX2ZpZWxkc1wiLCBcInVuZWRpdGFibGVfZmllbGRzXCIsIFwidW5yZWxhdGVkX29iamVjdHNcIiwgXCJ1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFwiXTtcblxucGVybWlzc2lvblByb3BOYW1lcyA9IF8udW5pb24oYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzLCBvdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMpO1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgb2JqO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKTtcbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgaXNPd25lciwgbWFzdGVyT2JqZWN0TmFtZSwgbWFzdGVyUmVjb3JkUGVybSwgcGVybWlzc2lvbnMsIHJlY29yZF9jb21wYW55X2lkLCByZWNvcmRfY29tcGFueV9pZHMsIHJlZiwgdXNlcl9jb21wYW55X2lkcztcbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpO1xuICBpZiAocmVjb3JkKSB7XG4gICAgaWYgKCFfLmlzRW1wdHkocmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucykpIHtcbiAgICAgIHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zO1xuICAgIH1cbiAgICBpc093bmVyID0gcmVjb3JkLm93bmVyID09PSB1c2VySWQgfHwgKChyZWYgPSByZWNvcmQub3duZXIpICE9IG51bGwgPyByZWYuX2lkIDogdm9pZCAwKSA9PT0gdXNlcklkO1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgbWFzdGVyT2JqZWN0TmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuICAgICAgbWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMobWFzdGVyT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gcGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXM7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHBlcm1pc3Npb25zLmFsbG93RGVsZXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dEZWxldGVGaWxlcztcbiAgICAgIGlmICghbWFzdGVyUmVjb3JkUGVybS5tb2RpZnlBbGxGaWxlcyAmJiAhaXNPd25lcikge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHBlcm1pc3Npb25zLmFsbG93UmVhZCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZEZpbGVzO1xuICAgICAgaWYgKCFtYXN0ZXJSZWNvcmRQZXJtLnZpZXdBbGxGaWxlcyAmJiAhaXNPd25lcikge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICB1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKTtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZCA6IHZvaWQgMDtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSAmJiByZWNvcmRfY29tcGFueV9pZC5faWQpIHtcbiAgICAgICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWQ7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkcyA6IHZvaWQgMDtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSkpIHtcbiAgICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKTtcbiAgICAgIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkLmxvY2tlZCAmJiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwZXJtaXNzaW9ucztcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSwgbWFzdGVyQWxsb3csIG1hc3RlclJlY29yZFBlcm0sIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucywgcmVzdWx0LCB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgaWYgKCFjdXJyZW50T2JqZWN0TmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFyZWxhdGVkTGlzdEl0ZW0pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmICghY3VycmVudFJlY29yZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgbWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpO1xuICAgIHJlc3VsdCA9IF8uY2xvbmUocmVsYXRlZE9iamVjdFBlcm1pc3Npb25zKTtcbiAgICBpZiAocmVsYXRlZExpc3RJdGVtLmlzX2ZpbGUpIHtcbiAgICAgIHJlc3VsdC5hbGxvd0NyZWF0ZSA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXM7XG4gICAgICByZXN1bHQuYWxsb3dFZGl0ID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRMaXN0SXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB8fCBmYWxzZTtcbiAgICAgIG1hc3RlckFsbG93ID0gZmFsc2U7XG4gICAgICBpZiAod3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT09IHRydWUpIHtcbiAgICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZDtcbiAgICAgIH0gZWxzZSBpZiAod3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT09IGZhbHNlKSB7XG4gICAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXQ7XG4gICAgICB9XG4gICAgICB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKTtcbiAgICAgIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xO1xuICAgICAgcmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGU7XG4gICAgICByZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgX2ksIGlzU3BhY2VBZG1pbiwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7XG4gICAgICBvYmplY3RzOiB7fSxcbiAgICAgIGFzc2lnbmVkX2FwcHM6IFtdXG4gICAgfTtcblxuICAgIC8qXG4gICAgXHRcdOadg+mZkOmbhuivtOaYjjpcbiAgICBcdFx05YaF572u5p2D6ZmQ6ZuGLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxuICAgIFx0XHToh6rlrprkuYnmnYPpmZDpm4Yt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ6ZuG5Lul5aSW55qE5YW25LuW5p2D6ZmQ6ZuGXG4gICAgXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG4gICAgXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOmbhlxuICAgICAqL1xuICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgcHNldHNBZG1pbl9wb3MgPSBudWxsO1xuICAgIHBzZXRzVXNlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNHdWVzdF9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGw7XG4gICAgaWYgKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VycmVudC5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwiX2lkXCIpO1xuICAgICAgcHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgICAkaW46IHNldF9pZHNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwibmFtZVwiKTtcbiAgICB9XG4gICAgcHNldHMgPSB7XG4gICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudCxcbiAgICAgIHBzZXRzTWVtYmVyOiBwc2V0c01lbWJlcixcbiAgICAgIHBzZXRzR3Vlc3Q6IHBzZXRzR3Vlc3QsXG4gICAgICBwc2V0c1N1cHBsaWVyOiBwc2V0c1N1cHBsaWVyLFxuICAgICAgcHNldHNDdXN0b21lcjogcHNldHNDdXN0b21lcixcbiAgICAgIGlzU3BhY2VBZG1pbjogaXNTcGFjZUFkbWluLFxuICAgICAgc3BhY2VVc2VyOiBzcGFjZVVzZXIsXG4gICAgICBwc2V0c0FkbWluX3BvczogcHNldHNBZG1pbl9wb3MsXG4gICAgICBwc2V0c1VzZXJfcG9zOiBwc2V0c1VzZXJfcG9zLFxuICAgICAgcHNldHNNZW1iZXJfcG9zOiBwc2V0c01lbWJlcl9wb3MsXG4gICAgICBwc2V0c0d1ZXN0X3BvczogcHNldHNHdWVzdF9wb3MsXG4gICAgICBwc2V0c1N1cHBsaWVyX3BvczogcHNldHNTdXBwbGllcl9wb3MsXG4gICAgICBwc2V0c0N1c3RvbWVyX3BvczogcHNldHNDdXN0b21lcl9wb3MsXG4gICAgICBwc2V0c0N1cnJlbnRfcG9zOiBwc2V0c0N1cnJlbnRfcG9zXG4gICAgfTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXM7XG4gICAgX2kgPSAwO1xuICAgIF8uZWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgIF9pKys7XG4gICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT09IHNwYWNlSWQpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT09ICcwJyAmJiBpc1NwYWNlQWRtaW4pKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpO1xuICAgICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgdW5pb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIGludGVyc2VjdGlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcHMpIHtcbiAgICB2YXIgZmlsZXNQcm9OYW1lcywgcHJvcE5hbWVzO1xuICAgIHByb3BOYW1lcyA9IHBlcm1pc3Npb25Qcm9wTmFtZXM7XG4gICAgcmV0dXJuIGZpbGVzUHJvTmFtZXMgPSBwcm9wcyA/IF8uZWFjaChwcm9wTmFtZXMsIGZ1bmN0aW9uKHByb3BOYW1lKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICB9KSA6IHZvaWQgMDtcbiAgfTtcbiAgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wcykge1xuICAgIHZhciBwcm9wTmFtZXM7XG4gICAgcHJvcE5hbWVzID0gYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzO1xuICAgIHJldHVybiBfLmVhY2gocHJvcE5hbWVzLCBmdW5jdGlvbihwcm9wTmFtZSkge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFwcHMsIGlzU3BhY2VBZG1pbiwgcHNldEJhc2UsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0N1c3RvbWVyLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1VzZXIsIHJlZiwgcmVmMSwgc3BhY2VVc2VyLCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhcHBzID0gW107XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmLnByb2ZpbGUgOiB2b2lkIDA7XG4gICAgICBwc2V0QmFzZSA9IHBzZXRzVXNlcjtcbiAgICAgIGlmICh1c2VyUHJvZmlsZSkge1xuICAgICAgICBpZiAodXNlclByb2ZpbGUgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXI7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlclByb2ZpbGUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwc2V0QmFzZSAhPSBudWxsID8gKHJlZjEgPSBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgYXBwcyA9IF8udW5pb24oYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBfLmVhY2gocHNldHMsIGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgaWYgKCFwc2V0LmFzc2lnbmVkX2FwcHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBzZXQubmFtZSA9PT0gXCJhZG1pblwiIHx8IHBzZXQubmFtZSA9PT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXBwcyA9IF8udW5pb24oYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksIHZvaWQgMCwgbnVsbCk7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYWJvdXRNZW51LCBhZG1pbk1lbnVzLCBhbGxNZW51cywgY3VycmVudFBzZXROYW1lcywgaXNTcGFjZUFkbWluLCBtZW51cywgb3RoZXJNZW51QXBwcywgb3RoZXJNZW51cywgcHNldHMsIHJlZiwgcmVmMSwgcmVzdWx0LCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFkbWluTWVudXMgPSAocmVmID0gQ3JlYXRvci5BcHBzLmFkbWluKSAhPSBudWxsID8gcmVmLmFkbWluX21lbnVzIDogdm9pZCAwO1xuICAgIGlmICghYWRtaW5NZW51cykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkID09PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgIT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgb3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5KF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmFkbWluX21lbnVzICYmIG4uX2lkICE9PSAnYWRtaW4nO1xuICAgIH0pLCAnc29ydCcpO1xuICAgIG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKTtcbiAgICBhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJlc3VsdCA9IGFsbE1lbnVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9ICgocmVmMSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYxLnByb2ZpbGUgOiB2b2lkIDApIHx8ICd1c2VyJztcbiAgICAgIGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5uYW1lO1xuICAgICAgfSk7XG4gICAgICBtZW51cyA9IGFsbE1lbnVzLmZpbHRlcihmdW5jdGlvbihtZW51KSB7XG4gICAgICAgIHZhciBwc2V0c01lbnU7XG4gICAgICAgIHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzO1xuICAgICAgICBpZiAocHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoO1xuICAgICAgfSk7XG4gICAgICByZXN1bHQgPSBtZW51cztcbiAgICB9XG4gICAgcmV0dXJuIF8uc29ydEJ5KHJlc3VsdCwgXCJzb3J0XCIpO1xuICB9O1xuICBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmluZChwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZFxuICAgIH0pO1xuICB9O1xuICBmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcihwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICRpbjogcGVybWlzc2lvbl9zZXRfaWRzXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgfTtcbiAgdW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IGZ1bmN0aW9uKHBvcywgb2JqZWN0LCBwc2V0cykge1xuICAgIHZhciByZXN1bHQ7XG4gICAgcmVzdWx0ID0gW107XG4gICAgXy5lYWNoKG9iamVjdC5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24ob3BzLCBvcHNfa2V5KSB7XG4gICAgICB2YXIgY3VycmVudFBzZXQsIHRlbXBPcHM7XG4gICAgICBpZiAoW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDApIHtcbiAgICAgICAgY3VycmVudFBzZXQgPSBwc2V0cy5maW5kKGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgICByZXR1cm4gcHNldC5uYW1lID09PSBvcHNfa2V5O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGN1cnJlbnRQc2V0KSB7XG4gICAgICAgICAgdGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fTtcbiAgICAgICAgICB0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkO1xuICAgICAgICAgIHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWU7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHRlbXBPcHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcbiAgICAgIHBvcy5mb3JFYWNoKGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHZhciByZXBlYXRJbmRleCwgcmVwZWF0UG87XG4gICAgICAgIHJlcGVhdEluZGV4ID0gMDtcbiAgICAgICAgcmVwZWF0UG8gPSByZXN1bHQuZmluZChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgIHJlcGVhdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT09IHBvLnBlcm1pc3Npb25fc2V0X2lkO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlcGVhdFBvKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2gocG8pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwb3M7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBpc1NwYWNlQWRtaW4sIG9iamVjdCwgb3BzZXRBZG1pbiwgb3BzZXRDdXN0b21lciwgb3BzZXRHdWVzdCwgb3BzZXRNZW1iZXIsIG9wc2V0U3VwcGxpZXIsIG9wc2V0VXNlciwgcGVybWlzc2lvbnMsIHBvcywgcG9zQWRtaW4sIHBvc0N1c3RvbWVyLCBwb3NHdWVzdCwgcG9zTWVtYmVyLCBwb3NTdXBwbGllciwgcG9zVXNlciwgcHJvZiwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHt9O1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgICBpZiAoc3BhY2VJZCA9PT0gJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgfHwgdGhpcy5wc2V0c0FkbWluID8gdGhpcy5wc2V0c0FkbWluIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIHx8IHRoaXMucHNldHNVc2VyID8gdGhpcy5wc2V0c1VzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzTWVtYmVyID0gXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgfHwgdGhpcy5wc2V0c01lbWJlciA/IHRoaXMucHNldHNNZW1iZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNHdWVzdCA9IF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgfHwgdGhpcy5wc2V0c0d1ZXN0ID8gdGhpcy5wc2V0c0d1ZXN0IDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgfHwgdGhpcy5wc2V0c1N1cHBsaWVyID8gdGhpcy5wc2V0c1N1cHBsaWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgfHwgdGhpcy5wc2V0c0N1c3RvbWVyID8gdGhpcy5wc2V0c0N1c3RvbWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudDtcbiAgICBpZiAoIXBzZXRzKSB7XG4gICAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zO1xuICAgIHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3M7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3M7XG4gICAgcHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3BvcztcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3M7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3BvcztcbiAgICBvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9O1xuICAgIG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9O1xuICAgIG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fTtcbiAgICBvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgIG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge307XG4gICAgb3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fTtcbiAgICBpZiAocHNldHNBZG1pbikge1xuICAgICAgcG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0QWRtaW4sIHBvc0FkbWluKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlcikge1xuICAgICAgcG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0VXNlciwgcG9zVXNlcik7XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlcikge1xuICAgICAgcG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0TWVtYmVyLCBwb3NNZW1iZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCkge1xuICAgICAgcG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0R3Vlc3QsIHBvc0d1ZXN0KTtcbiAgICB9XG4gICAgaWYgKHBzZXRzU3VwcGxpZXIpIHtcbiAgICAgIHBvc1N1cHBsaWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1N1cHBsaWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzU3VwcGxpZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldFN1cHBsaWVyLCBwb3NTdXBwbGllcik7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyKSB7XG4gICAgICBwb3NDdXN0b21lciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXN0b21lcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0N1c3RvbWVyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRDdXN0b21lciwgcG9zQ3VzdG9tZXIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzcGFjZUlkID09PSAnY29tbW9uJykge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYWNlVXNlciA9IF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSB8fCB0aGlzLnNwYWNlVXNlciA/IHRoaXMuc3BhY2VVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHNwYWNlVXNlcikge1xuICAgICAgICAgICAgcHJvZiA9IHNwYWNlVXNlci5wcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2YpIHtcbiAgICAgICAgICAgICAgaWYgKHByb2YgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdtZW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldE1lbWJlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnZ3Vlc3QnKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzLCBcIl9pZFwiKTtcbiAgICAgIHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpO1xuICAgICAgcG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpO1xuICAgICAgXy5lYWNoKHBvcywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgaWYgKHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLmlzRW1wdHkocGVybWlzc2lvbnMpKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBwbztcbiAgICAgICAgfVxuICAgICAgICBvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMocGVybWlzc2lvbnMsIHBvKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpO1xuICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCBwby51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9iamVjdC5pc192aWV3KSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXTtcbiAgICB9XG4gICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgIGlmIChvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXIpIHtcbiAgICAgIHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyO1xuICAgIH1cbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICBcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKVxuXG5NZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1Jcblx0b3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1Jcblx0aWYgY3JlYXRvcl9kYl91cmxcblx0XHRpZiAhb3Bsb2dfdXJsXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIilcblx0XHRDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7X2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtvcGxvZ1VybDogb3Bsb2dfdXJsfSl9XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSAob2JqZWN0KS0+XG4jXHRpZiBvYmplY3QudGFibGVfbmFtZSAmJiBvYmplY3QudGFibGVfbmFtZS5lbmRzV2l0aChcIl9fY1wiKVxuI1x0XHRyZXR1cm4gb2JqZWN0LnRhYmxlX25hbWVcbiNcdGVsc2VcbiNcdFx0cmV0dXJuIG9iamVjdC5uYW1lXG5cdHJldHVybiBvYmplY3QubmFtZVxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gKG9iamVjdCktPlxuXHRjb2xsZWN0aW9uX2tleSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqZWN0KVxuXHRpZiBkYltjb2xsZWN0aW9uX2tleV1cblx0XHRyZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldXG5cdGVsc2UgaWYgb2JqZWN0LmRiXG5cdFx0cmV0dXJuIG9iamVjdC5kYlxuXG5cdGlmIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXG5cdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXG5cdGVsc2Vcblx0XHRpZiBvYmplY3QuY3VzdG9tXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKVxuXHRcdGVsc2Vcblx0XHRcdGlmIGNvbGxlY3Rpb25fa2V5ID09ICdfc21zX3F1ZXVlJyAmJiBTTVNRdWV1ZT8uY29sbGVjdGlvblxuXHRcdFx0XHRyZXR1cm4gU01TUXVldWUuY29sbGVjdGlvblxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpXG5cblxuIiwidmFyIHN0ZWVkb3NDb3JlO1xuXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdG9yX2RiX3VybCwgb3Bsb2dfdXJsO1xuICBjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SO1xuICBvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUjtcbiAgaWYgKGNyZWF0b3JfZGJfdXJsKSB7XG4gICAgaWYgKCFvcGxvZ191cmwpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtcbiAgICAgIF9kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7XG4gICAgICAgIG9wbG9nVXJsOiBvcGxvZ191cmxcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxufSk7XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBjb2xsZWN0aW9uX2tleTtcbiAgY29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdCk7XG4gIGlmIChkYltjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2UgaWYgKG9iamVjdC5kYikge1xuICAgIHJldHVybiBvYmplY3QuZGI7XG4gIH1cbiAgaWYgKENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3QuY3VzdG9tKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbGxlY3Rpb25fa2V5ID09PSAnX3Ntc19xdWV1ZScgJiYgKHR5cGVvZiBTTVNRdWV1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTTVNRdWV1ZSAhPT0gbnVsbCA/IFNNU1F1ZXVlLmNvbGxlY3Rpb24gOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpO1xuICAgIH1cbiAgfVxufTtcbiIsIkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9XG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHQjIOWumuS5ieWFqOWxgCBhY3Rpb25zIOWHveaVsFx0XG5cdENyZWF0b3IuYWN0aW9ucyA9IChhY3Rpb25zKS0+XG5cdFx0Xy5lYWNoIGFjdGlvbnMsICh0b2RvLCBhY3Rpb25fbmFtZSktPlxuXHRcdFx0Q3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbl9uYW1lXSA9IHRvZG8gXG5cblx0Q3JlYXRvci5leGVjdXRlQWN0aW9uID0gKG9iamVjdF9uYW1lLCBhY3Rpb24sIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50LCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbGJhY2spLT5cblx0XHRpZiBhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT0gJ3dvcmQtcHJpbnQnXG5cdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0ZmlsdGVycyA9IFsnX2lkJywgJz0nLCByZWNvcmRfaWRdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZpbHRlcnMgPSBPYmplY3RHcmlkLmdldEZpbHRlcnMob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZmFsc2UsIG51bGwsIG51bGwpXG5cdFx0XHR1cmwgPSBcIi9hcGkvdjQvd29yZF90ZW1wbGF0ZXMvXCIgKyBhY3Rpb24ud29yZF90ZW1wbGF0ZSArIFwiL3ByaW50XCIgKyBcIj9maWx0ZXJzPVwiICsgU3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvT0RhdGFRdWVyeShmaWx0ZXJzKTtcblx0XHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcblx0XHRcdHJldHVybiB3aW5kb3cub3Blbih1cmwpO1xuXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgYWN0aW9uPy50b2RvXG5cdFx0XHRpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJzdHJpbmdcIlxuXHRcdFx0XHR0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXVxuXHRcdFx0ZWxzZSBpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdHRvZG8gPSBhY3Rpb24udG9kb1x0XG5cdFx0XHRpZiAhcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxuXHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0aWYgdG9kb1xuXHRcdFx0XHQjIGl0ZW1fZWxlbWVudOS4uuepuuaXtuW6lOivpeiuvue9rum7mOiupOWAvO+8iOWvueixoeeahG5hbWXlrZfmrrXvvInvvIzlkKbliJltb3JlQXJnc+aLv+WIsOeahOWQjue7reWPguaVsOS9jee9ruWwseS4jeWvuVxuXHRcdFx0XHRpdGVtX2VsZW1lbnQgPSBpZiBpdGVtX2VsZW1lbnQgdGhlbiBpdGVtX2VsZW1lbnQgZWxzZSBcIlwiXG5cdFx0XHRcdG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxuXHRcdFx0XHR0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpXG5cdFx0XHRcdHRvZG8uYXBwbHkge1xuXHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdHJlY29yZF9pZDogcmVjb3JkX2lkXG5cdFx0XHRcdFx0b2JqZWN0OiBvYmpcblx0XHRcdFx0XHRhY3Rpb246IGFjdGlvblxuXHRcdFx0XHRcdGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50XG5cdFx0XHRcdFx0cmVjb3JkOiByZWNvcmRcblx0XHRcdFx0fSwgdG9kb0FyZ3Ncblx0XHRcdGVsc2Vcblx0XHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXG5cdFx0ZWxzZVxuXHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXG5cblxuXHRfZGVsZXRlUmVjb3JkID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaywgY2FsbF9iYWNrX2Vycm9yKS0+XG5cdFx0IyBjb25zb2xlLmxvZyhcIj09PV9kZWxldGVSZWNvcmQ9PT1cIiwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpO1xuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdHByZXZpb3VzRG9jID0gRm9ybU1hbmFnZXIuZ2V0UHJldmlvdXNEb2Mob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgJ2RlbGV0ZScpXG5cdFx0Q3JlYXRvci5vZGF0YS5kZWxldGUgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgKCktPlxuXHRcdFx0aWYgcmVjb3JkX3RpdGxlXG5cdFx0XHRcdCMgaW5mbyA9IG9iamVjdC5sYWJlbCArIFwiXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIiArIFwi5bey5Yig6ZmkXCJcblx0XHRcdFx0aW5mbyA9dCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5mbyA9IHQoJ2NyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3N1YycpXG5cdFx0XHR0b2FzdHIuc3VjY2VzcyBpbmZvXG5cdFx0XHRpZiBjYWxsX2JhY2sgYW5kIHR5cGVvZiBjYWxsX2JhY2sgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdGNhbGxfYmFjaygpXG5cblx0XHRcdEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYWZ0ZXInLCB7X2lkOiByZWNvcmRfaWQsIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY30pXG5cdFx0LCAoZXJyb3IpLT5cblx0XHRcdGlmIGNhbGxfYmFja19lcnJvciBhbmQgdHlwZW9mIGNhbGxfYmFja19lcnJvciA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0Y2FsbF9iYWNrX2Vycm9yKClcblx0XHRcdEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7X2lkOiByZWNvcmRfaWQsIGVycm9yOiBlcnJvcn0pXG5cblx0Q3JlYXRvci5yZWxhdGVkT2JqZWN0U3RhbmRhcmROZXcgPSAocmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdHJlbGF0ZU9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0Y29sbGVjdGlvbl9uYW1lID0gcmVsYXRlT2JqZWN0LmxhYmVsXG5cdFx0Y29sbGVjdGlvbiA9IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy4je0NyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpLl9jb2xsZWN0aW9uX25hbWV9XCJcblx0XHRjdXJyZW50X29iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0XHRpZHMgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkc1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdGluaXRpYWxWYWx1ZXMgPSB7fTtcblx0XHRpZiBpZHM/Lmxlbmd0aFxuXHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cblx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XG5cdFx0XHRyZWNvcmRfaWQgPSBpZHNbMF1cblx0XHRcdGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdGluaXRpYWxWYWx1ZXMgPSBkb2Ncblx0XHRcdCMg4oCc5L+d5a2Y5bm25paw5bu64oCd5pON5L2c5Lit6Ieq5Yqo5omT5byA55qE5paw56qX5Y+j5Lit6ZyA6KaB5YaN5qyh5aSN5Yi25pyA5paw55qEZG9j5YaF5a655Yiw5paw56qX5Y+j5LitXG5cdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdGRlZmF1bHREb2MgPSBGb3JtTWFuYWdlci5nZXRSZWxhdGVkSW5pdGlhbFZhbHVlcyhjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSk7XG5cdFx0XHRpZiAhXy5pc0VtcHR5KGRlZmF1bHREb2MpXG5cdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSBkZWZhdWx0RG9jXG5cdFx0aWYgcmVsYXRlT2JqZWN0Py52ZXJzaW9uID49IDJcblx0XHRcdHJldHVybiBTdGVlZG9zVUkuc2hvd01vZGFsKHN0b3Jlcy5Db21wb25lbnRSZWdpc3RyeS5jb21wb25lbnRzLk9iamVjdEZvcm0sIHtcblx0XHRcdFx0bmFtZTogXCIje3JlbGF0ZWRfb2JqZWN0X25hbWV9X3N0YW5kYXJkX25ld19mb3JtXCIsXG5cdFx0XHRcdG9iamVjdEFwaU5hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG5cdFx0XHRcdHRpdGxlOiAn5paw5bu6ICcgKyByZWxhdGVPYmplY3QubGFiZWwsXG5cdFx0XHRcdGluaXRpYWxWYWx1ZXM6IGluaXRpYWxWYWx1ZXMsXG5cdFx0XHRcdGFmdGVySW5zZXJ0OiAocmVzdWx0KS0+XG5cdFx0XHRcdFx0c2V0VGltZW91dCgoKS0+XG5cdFx0XHRcdFx0XHQjIE9iamVjdEZvcm3mnInnvJPlrZjvvIzmlrDlu7rlrZDooajorrDlvZXlj6/og73kvJrmnInmsYfmgLvlrZfmrrXvvIzpnIDopoHliLfmlrDooajljZXmlbDmja5cblx0XHRcdFx0XHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpLnZlcnNpb24gPiAxXG5cdFx0XHRcdFx0XHRcdFN0ZWVkb3NVSS5yZWxvYWRSZWNvcmQoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdCwgMSk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9LCBudWxsLCB7aWNvblBhdGg6ICcvYXNzZXRzL2ljb25zJ30pXG5cblxuXHRcdGlmIGlkcz8ubGVuZ3RoXG5cdFx0XHQjIOWIl+ihqOaciemAieS4remhueaXtu+8jOWPluesrOS4gOS4qumAieS4remhue+8jOWkjeWItuWFtuWGheWuueWIsOaWsOW7uueql+WPo+S4rVxuXHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcblx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblx0XHRcdCMg4oCc5L+d5a2Y5bm25paw5bu64oCd5pON5L2c5Lit6Ieq5Yqo5omT5byA55qE5paw56qX5Y+j5Lit6ZyA6KaB5YaN5qyh5aSN5Yi25pyA5paw55qEZG9j5YaF5a655Yiw5paw56qX5Y+j5LitXG5cdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdGlmICFfLmlzRW1wdHkoaW5pdGlhbFZhbHVlcylcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fZmllbGRzXCIsIHVuZGVmaW5lZClcblx0XHRTZXNzaW9uLnNldChcImFjdGlvbl9jb2xsZWN0aW9uXCIsIGNvbGxlY3Rpb24pXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fY29sbGVjdGlvbl9uYW1lXCIsIGNvbGxlY3Rpb25fbmFtZSlcblx0XHRTZXNzaW9uLnNldChcImFjdGlvbl9zYXZlX2FuZF9pbnNlcnRcIiwgZmFsc2UpXG5cdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdCQoXCIuY3JlYXRvci1hZGQtcmVsYXRlZFwiKS5jbGljaygpXG5cdFx0cmV0dXJuXG5cblx0Q3JlYXRvci5hY3Rpb25zIFxuXHRcdCMg5Zyo5q2k5a6a5LmJ5YWo5bGAIGFjdGlvbnNcblx0XHRcInN0YW5kYXJkX3F1ZXJ5XCI6ICgpLT5cblx0XHRcdE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKVxuXG5cdFx0XCJzdGFuZGFyZF9uZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0IyBjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0XHQjIGlmIGN1cnJlbnRfcmVjb3JkX2lkXG5cdFx0XHQjIFx0IyBhbWlzIOebuOWFs+WtkOihqOWPs+S4iuinkuaWsOW7ulxuXHRcdFx0IyBcdENyZWF0b3IucmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3KG9iamVjdF9uYW1lKVxuXHRcdFx0IyBcdHJldHVybiBcblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcblx0XHRcdGdyaWROYW1lID0gdGhpcy5hY3Rpb24uZ3JpZE5hbWU7XG5cdFx0XHRpc1JlbGF0ZWQgPSB0aGlzLmFjdGlvbi5pc1JlbGF0ZWQ7XG5cdFx0XHRpZiBpc1JlbGF0ZWRcblx0XHRcdFx0cmVsYXRlZEZpZWxkTmFtZSA9IHRoaXMuYWN0aW9uLnJlbGF0ZWRGaWVsZE5hbWU7XG5cdFx0XHRcdG1hc3RlclJlY29yZElkID0gdGhpcy5hY3Rpb24ubWFzdGVyUmVjb3JkSWQ7XG5cdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSB0aGlzLmFjdGlvbi5pbml0aWFsVmFsdWVzXG5cdFx0XHRcdGlmICFpbml0aWFsVmFsdWVzXG5cdFx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IHt9O1xuXHRcdFx0XHRcdGluaXRpYWxWYWx1ZXNbcmVsYXRlZEZpZWxkTmFtZV0gPSBtYXN0ZXJSZWNvcmRJZFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbml0aWFsVmFsdWVzPXt9XG5cdFx0XHRcdGlmKGdyaWROYW1lKVxuXHRcdFx0XHRcdHNlbGVjdGVkUm93cyA9IHdpbmRvdy5ncmlkUmVmcz9bZ3JpZE5hbWVdLmN1cnJlbnQ/LmFwaT8uZ2V0U2VsZWN0ZWRSb3dzKClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHNlbGVjdGVkUm93cyA9IHdpbmRvdy5ncmlkUmVmPy5jdXJyZW50Py5hcGk/LmdldFNlbGVjdGVkUm93cygpXHRcblx0XHRcdFx0XG5cdFx0XHRcdGlmIHNlbGVjdGVkUm93cz8ubGVuZ3RoXG5cdFx0XHRcdFx0cmVjb3JkX2lkID0gc2VsZWN0ZWRSb3dzWzBdLl9pZDtcblx0XHRcdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpbml0aWFsVmFsdWVzID0gRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSlcblxuXHRcdFx0aWYgb2JqZWN0Py52ZXJzaW9uID49IDJcblx0XHRcdFx0cmV0dXJuIFN0ZWVkb3MuUGFnZS5Gb3JtLlN0YW5kYXJkTmV3LnJlbmRlcihTZXNzaW9uLmdldChcImFwcF9pZFwiKSwgb2JqZWN0X25hbWUsICfmlrDlu7ogJyArIG9iamVjdC5sYWJlbCwgaW5pdGlhbFZhbHVlcyAsIHtncmlkTmFtZTogZ3JpZE5hbWV9KTtcblx0XHRcdFNlc3Npb24uc2V0ICdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZVxuXHRcdFx0aWYgc2VsZWN0ZWRSb3dzPy5sZW5ndGhcblx0XHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cblx0XHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXHRcdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXG5cdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0XHQkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKClcblx0XHRcdHJldHVybiBcblxuXHRcdFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0Rmxvd1JvdXRlci5yZWRpcmVjdChocmVmKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcInN0YW5kYXJkX2VkaXRcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcblx0XHRcdFx0aWYgb2JqZWN0Py52ZXJzaW9uID49IDJcblx0XHRcdFx0XHRyZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmRFZGl0LnJlbmRlcihTZXNzaW9uLmdldChcImFwcF9pZFwiKSwgb2JqZWN0X25hbWUsICfnvJbovpEgJyArIG9iamVjdC5sYWJlbCwgcmVjb3JkX2lkLCB7XG5cdFx0XHRcdFx0XHRncmlkTmFtZTogdGhpcy5hY3Rpb24uZ3JpZE5hbWVcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2VcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcbiNcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgcmVjb3JkXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdyZWxvYWRfZHhsaXN0JywgZmFsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdFx0XHQkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcblxuXHRcdFwic3RhbmRhcmRfZGVsZXRlXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spLT5cblx0XHRcdGdyaWROYW1lID0gdGhpcy5hY3Rpb24uZ3JpZE5hbWU7XG5cdFx0XHQjIGNvbnNvbGUubG9nKFwiPT09c3RhbmRhcmRfZGVsZXRlPT09XCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjayk7XG5cdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0YmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge19pZDogcmVjb3JkX2lkfSlcblx0XHRcdFx0aWYgIWJlZm9yZUhvb2tcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRcdG5hbWVGaWVsZCA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWSB8fCBcIm5hbWVcIlxuXG5cdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXG5cdFx0XHRcdGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpXG5cdFx0XHR1bmxlc3MgbGlzdF92aWV3X2lkXG5cdFx0XHRcdGxpc3Rfdmlld19pZCA9IFwiYWxsXCJcblxuXHRcdFx0aWYoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiByZWNvcmRfdGl0bGUpXG5cdFx0XHRcdHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZVtuYW1lRmllbGRdXG5cdFx0XHRcblx0XHRcdGlmIHJlY29yZCAmJiAhcmVjb3JkX3RpdGxlXG5cdFx0XHRcdHJlY29yZF90aXRsZSA9IHJlY29yZFtuYW1lRmllbGRdXG5cdFx0XHRcblx0XHRcdGkxOG5UaXRsZUtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVcIlxuXHRcdFx0aTE4blRleHRLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIlxuXG5cdFx0XHR1bmxlc3MgcmVjb3JkX2lkXG5cdFx0XHRcdGkxOG5UaXRsZUtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90aXRsZVwiXG5cdFx0XHRcdGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RleHRcIlxuXG5cdFx0XHRcdCMg5aaC5p6c5piv5om56YeP5Yig6Zmk77yM5YiZ5Lyg5YWl55qEbGlzdF92aWV3X2lk5Li65YiX6KGo6KeG5Zu+55qEbmFtZe+8jOeUqOS6juiOt+WPluWIl+ihqOmAieS4remhuVxuXHRcdFx0XHQjIOS4u+WIl+ihqOinhOWImeaYr1wibGlzdHZpZXdfI3tvYmplY3RfbmFtZX1fI3tsaXN0X3ZpZXdfaWR9XCLvvIznm7jlhbPooajop4TliJnmmK9cInJlbGF0ZWRfbGlzdHZpZXdfI3tvYmplY3RfbmFtZX1fI3tyZWxhdGVkX29iamVjdF9uYW1lfV8je3JlbGF0ZWRfZmllbGRfbmFtZX1cIlxuXHRcdFx0XHRzZWxlY3RlZFJlY29yZHMgPSBTdGVlZG9zVUkuZ2V0VGFibGVTZWxlY3RlZFJvd3MoZ3JpZE5hbWUgfHwgbGlzdF92aWV3X2lkKVxuXHRcdFx0XHRpZiAhc2VsZWN0ZWRSZWNvcmRzIHx8ICFzZWxlY3RlZFJlY29yZHMubGVuZ3RoXG5cdFx0XHRcdFx0dG9hc3RyLndhcm5pbmcodChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X25vX3NlbGVjdGlvblwiKSlcblx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0aWYgcmVjb3JkX3RpdGxlXG5cdFx0XHRcdHRleHQgPSB0IGkxOG5UZXh0S2V5LCBcIiN7b2JqZWN0LmxhYmVsfSBcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRleHQgPSB0IGkxOG5UZXh0S2V5LCBcIiN7b2JqZWN0LmxhYmVsfVwiXG5cdFx0XHRzd2FsXG5cdFx0XHRcdHRpdGxlOiB0IGkxOG5UaXRsZUtleSwgXCIje29iamVjdC5sYWJlbH1cIlxuXHRcdFx0XHR0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPiN7dGV4dH08L2Rpdj5cIlxuXHRcdFx0XHRodG1sOiB0cnVlXG5cdFx0XHRcdHNob3dDYW5jZWxCdXR0b246dHJ1ZVxuXHRcdFx0XHRjb25maXJtQnV0dG9uVGV4dDogdCgnRGVsZXRlJylcblx0XHRcdFx0Y2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcblx0XHRcdFx0KG9wdGlvbikgLT5cblx0XHRcdFx0XHRpZiBvcHRpb25cblx0XHRcdFx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRcdFx0XHQjIOWNleadoeiusOW9leWIoOmZpFxuXHRcdFx0XHRcdFx0XHRfZGVsZXRlUmVjb3JkIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsICgpLT5cblx0XHRcdFx0XHRcdFx0XHQjIOaWh+S7tueJiOacrOS4ulwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIu+8jOmcgOimgeabv+aNouS4ulwiY2ZzLWZpbGVzLWZpbGVyZWNvcmRcIlxuXHRcdFx0XHRcdFx0XHRcdGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZyxcIi1cIilcblx0XHRcdFx0XHRcdFx0XHRncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcblx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgZ3JpZENvbnRhaW5lcj8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiB3aW5kb3cub3BlbmVyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzT3BlbmVyUmVtb3ZlID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLiN7Z3JpZE9iamVjdE5hbWVDbGFzc31cIilcblx0XHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRcdCMgT2JqZWN0Rm9ybeaciee8k+WtmO+8jOWIoOmZpOWtkOihqOiusOW9leWPr+iDveS8muacieaxh+aAu+Wtl+aute+8jOmcgOimgeWIt+aWsOihqOWNleaVsOaNrlxuXHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGN1cnJlbnRfb2JqZWN0X25hbWUgJiYgQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSk/LnZlcnNpb24gPiAxXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFN0ZWVkb3NVSS5yZWxvYWRSZWNvcmQoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBGbG93Um91dGVyLmN1cnJlbnQoKS5yb3V0ZS5wYXRoLmVuZHNXaXRoKFwiLzpyZWNvcmRfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0X25hbWUgIT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG5cdFx0XHRcdFx0XHRcdFx0Y2F0Y2ggX2Vcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoX2UpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIGdyaWRDb250YWluZXI/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJylcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKVxuXHRcdFx0XHRcdFx0XHRcdGlmIGR4RGF0YUdyaWRJbnN0YW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKClcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0X25hbWUgIT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRUZW1wbGF0ZS5jcmVhdG9yX2dyaWQucmVmcmVzaChkeERhdGFHcmlkSW5zdGFuY2UpXG5cdFx0XHRcdFx0XHRcdFx0cmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdFx0XHRcdFx0XHR0ZW1wTmF2UmVtb3ZlZCA9IENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCkgI+aXoOiuuuaYr+WcqOiusOW9leivpue7hueVjOmdoui/mOaYr+WIl+ihqOeVjOmdouaJp+ihjOWIoOmZpOaTjeS9nO+8jOmDveS8muaKiuS4tOaXtuWvvOiIquWIoOmZpOaOiVxuXHRcdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlIG9yICFkeERhdGFHcmlkSW5zdGFuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5jbG9zZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIHJlY29yZF9pZCA9PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSBhbmQgbGlzdF92aWV3X2lkICE9ICdjYWxlbmRhcidcblx0XHRcdFx0XHRcdFx0XHRcdFx0YXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgdGVtcE5hdlJlbW92ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOehruWunuWIoOmZpOS6huS4tOaXtuWvvOiIqu+8jOWwseWPr+iDveW3sue7j+mHjeWumuWQkeWIsOS4iuS4gOS4qumhtemdouS6hu+8jOayoeW/heimgeWGjemHjeWumuWQkeS4gOasoVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIuZ28gXCIvYXBwLyN7YXBwaWR9LyN7b2JqZWN0X25hbWV9L2dyaWQvI3tsaXN0X3ZpZXdfaWR9XCJcblx0XHRcdFx0XHRcdFx0XHRpZiBjYWxsX2JhY2sgYW5kIHR5cGVvZiBjYWxsX2JhY2sgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0XHRcdFx0XHRjYWxsX2JhY2soKVx0XHRcdFxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHQjIOaJuemHj+WIoOmZpFxuXHRcdFx0XHRcdFx0XHRpZiBzZWxlY3RlZFJlY29yZHMgJiYgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwibG9hZGluZ1wiKVxuXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZUNvdW50ZXIgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdGFmdGVyQmF0Y2hlc0RlbGV0ZSA9ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdGRlbGV0ZUNvdW50ZXIrK1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgZGVsZXRlQ291bnRlciA+PSBzZWxlY3RlZFJlY29yZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMgY29uc29sZS5sb2coXCJkZWxldGVDb3VudGVyLCBzZWxlY3RlZFJlY29yZHMubGVuZ3RoPT09XCIsIGRlbGV0ZUNvdW50ZXIsIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImxvYWRpbmdcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0d2luZG93LnJlZnJlc2hHcmlkKGdyaWROYW1lKTtcblx0XHRcdFx0XHRcdFx0XHRzZWxlY3RlZFJlY29yZHMuZm9yRWFjaCAocmVjb3JkKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfaWQgPSByZWNvcmQuX2lkXG5cdFx0XHRcdFx0XHRcdFx0XHRiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7X2lkOiByZWNvcmRfaWR9KVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgIWJlZm9yZUhvb2tcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWZ0ZXJCYXRjaGVzRGVsZXRlKClcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkVGl0bGUgPSByZWNvcmRbbmFtZUZpZWxkXSB8fCByZWNvcmRfaWRcblx0XHRcdFx0XHRcdFx0XHRcdF9kZWxldGVSZWNvcmQgb2JqZWN0X25hbWUsIHJlY29yZC5faWQsIHJlY29yZFRpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgKCgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdFx0XHRcdFx0XHRcdFx0Q3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKSAj5peg6K665piv5Zyo6K6w5b2V6K+m57uG55WM6Z2i6L+Y5piv5YiX6KGo55WM6Z2i5omn6KGM5Yig6Zmk5pON5L2c77yM6YO95Lya5oqK5Li05pe25a+86Iiq5Yig6Zmk5o6JXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFmdGVyQmF0Y2hlc0RlbGV0ZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHQpLCAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFmdGVyQmF0Y2hlc0RlbGV0ZSgpIiwidmFyIF9kZWxldGVSZWNvcmQ7XG5cbkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuYWN0aW9ucyA9IGZ1bmN0aW9uKGFjdGlvbnMpIHtcbiAgICByZXR1cm4gXy5lYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKHRvZG8sIGFjdGlvbl9uYW1lKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbl9uYW1lXSA9IHRvZG87XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IuZXhlY3V0ZUFjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhY3Rpb24sIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50LCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbGJhY2spIHtcbiAgICB2YXIgZmlsdGVycywgbW9yZUFyZ3MsIG9iaiwgdG9kbywgdG9kb0FyZ3MsIHVybDtcbiAgICBpZiAoYWN0aW9uICYmIGFjdGlvbi50eXBlID09PSAnd29yZC1wcmludCcpIHtcbiAgICAgIGlmIChyZWNvcmRfaWQpIHtcbiAgICAgICAgZmlsdGVycyA9IFsnX2lkJywgJz0nLCByZWNvcmRfaWRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlsdGVycyA9IE9iamVjdEdyaWQuZ2V0RmlsdGVycyhvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBmYWxzZSwgbnVsbCwgbnVsbCk7XG4gICAgICB9XG4gICAgICB1cmwgPSBcIi9hcGkvdjQvd29yZF90ZW1wbGF0ZXMvXCIgKyBhY3Rpb24ud29yZF90ZW1wbGF0ZSArIFwiL3ByaW50XCIgKyBcIj9maWx0ZXJzPVwiICsgU3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvT0RhdGFRdWVyeShmaWx0ZXJzKTtcbiAgICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgIHJldHVybiB3aW5kb3cub3Blbih1cmwpO1xuICAgIH1cbiAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnRvZG8gOiB2b2lkIDApIHtcbiAgICAgIGlmICh0eXBlb2YgYWN0aW9uLnRvZG8gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdG9kbyA9IENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb24udG9kb107XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRvZG8gPSBhY3Rpb24udG9kbztcbiAgICAgIH1cbiAgICAgIGlmICghcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZCkge1xuICAgICAgICByZWNvcmQgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIH1cbiAgICAgIGlmICh0b2RvKSB7XG4gICAgICAgIGl0ZW1fZWxlbWVudCA9IGl0ZW1fZWxlbWVudCA/IGl0ZW1fZWxlbWVudCA6IFwiXCI7XG4gICAgICAgIG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcbiAgICAgICAgdG9kb0FyZ3MgPSBbb2JqZWN0X25hbWUsIHJlY29yZF9pZF0uY29uY2F0KG1vcmVBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRvZG8uYXBwbHkoe1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICByZWNvcmRfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICBvYmplY3Q6IG9iaixcbiAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICBpdGVtX2VsZW1lbnQ6IGl0ZW1fZWxlbWVudCxcbiAgICAgICAgICByZWNvcmQ6IHJlY29yZFxuICAgICAgICB9LCB0b2RvQXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpO1xuICAgIH1cbiAgfTtcbiAgX2RlbGV0ZVJlY29yZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaywgY2FsbF9iYWNrX2Vycm9yKSB7XG4gICAgdmFyIG9iamVjdCwgcHJldmlvdXNEb2M7XG4gICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIHByZXZpb3VzRG9jID0gRm9ybU1hbmFnZXIuZ2V0UHJldmlvdXNEb2Mob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgJ2RlbGV0ZScpO1xuICAgIHJldHVybiBDcmVhdG9yLm9kYXRhW1wiZGVsZXRlXCJdKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGluZm87XG4gICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIGluZm8gPSB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVfc3VjXCIsIG9iamVjdC5sYWJlbCArIChcIlxcXCJcIiArIHJlY29yZF90aXRsZSArIFwiXFxcIlwiKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmZvID0gdCgnY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfc3VjJyk7XG4gICAgICB9XG4gICAgICB0b2FzdHIuc3VjY2VzcyhpbmZvKTtcbiAgICAgIGlmIChjYWxsX2JhY2sgJiYgdHlwZW9mIGNhbGxfYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxfYmFjaygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYWZ0ZXInLCB7XG4gICAgICAgIF9pZDogcmVjb3JkX2lkLFxuICAgICAgICBwcmV2aW91c0RvYzogcHJldmlvdXNEb2NcbiAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBpZiAoY2FsbF9iYWNrX2Vycm9yICYmIHR5cGVvZiBjYWxsX2JhY2tfZXJyb3IgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsX2JhY2tfZXJyb3IoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2Vycm9yJywge1xuICAgICAgICBfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgZXJyb3I6IGVycm9yXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5yZWxhdGVkT2JqZWN0U3RhbmRhcmROZXcgPSBmdW5jdGlvbihyZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGNvbGxlY3Rpb25fbmFtZSwgY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIGRlZmF1bHREb2MsIGRvYywgaWRzLCBpbml0aWFsVmFsdWVzLCByZWNvcmRfaWQsIHJlbGF0ZU9iamVjdDtcbiAgICByZWxhdGVPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICBjb2xsZWN0aW9uX25hbWUgPSByZWxhdGVPYmplY3QubGFiZWw7XG4gICAgY29sbGVjdGlvbiA9IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy5cIiArIChDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKS5fY29sbGVjdGlvbl9uYW1lKTtcbiAgICBjdXJyZW50X29iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICBjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICAgIGlkcyA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICBpZiAoaWRzICE9IG51bGwgPyBpZHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICByZWNvcmRfaWQgPSBpZHNbMF07XG4gICAgICBkb2MgPSBDcmVhdG9yLm9kYXRhLmdldChyZWxhdGVkX29iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgaW5pdGlhbFZhbHVlcyA9IGRvYztcbiAgICAgIFNlc3Npb24uc2V0KCdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdERvYyA9IEZvcm1NYW5hZ2VyLmdldFJlbGF0ZWRJbml0aWFsVmFsdWVzKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkLCByZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIGlmICghXy5pc0VtcHR5KGRlZmF1bHREb2MpKSB7XG4gICAgICAgIGluaXRpYWxWYWx1ZXMgPSBkZWZhdWx0RG9jO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKHJlbGF0ZU9iamVjdCAhPSBudWxsID8gcmVsYXRlT2JqZWN0LnZlcnNpb24gOiB2b2lkIDApID49IDIpIHtcbiAgICAgIHJldHVybiBTdGVlZG9zVUkuc2hvd01vZGFsKHN0b3Jlcy5Db21wb25lbnRSZWdpc3RyeS5jb21wb25lbnRzLk9iamVjdEZvcm0sIHtcbiAgICAgICAgbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSArIFwiX3N0YW5kYXJkX25ld19mb3JtXCIsXG4gICAgICAgIG9iamVjdEFwaU5hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgIHRpdGxlOiAn5paw5bu6ICcgKyByZWxhdGVPYmplY3QubGFiZWwsXG4gICAgICAgIGluaXRpYWxWYWx1ZXM6IGluaXRpYWxWYWx1ZXMsXG4gICAgICAgIGFmdGVySW5zZXJ0OiBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpLnZlcnNpb24gPiAxKSB7XG4gICAgICAgICAgICAgIFN0ZWVkb3NVSS5yZWxvYWRSZWNvcmQoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0sIG51bGwsIHtcbiAgICAgICAgaWNvblBhdGg6ICcvYXNzZXRzL2ljb25zJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChpZHMgIT0gbnVsbCA/IGlkcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIV8uaXNFbXB0eShpbml0aWFsVmFsdWVzKSkge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgU2Vzc2lvbi5zZXQoXCJhY3Rpb25fZmllbGRzXCIsIHZvaWQgMCk7XG4gICAgU2Vzc2lvbi5zZXQoXCJhY3Rpb25fY29sbGVjdGlvblwiLCBjb2xsZWN0aW9uKTtcbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9jb2xsZWN0aW9uX25hbWVcIiwgY29sbGVjdGlvbl9uYW1lKTtcbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9zYXZlX2FuZF9pbnNlcnRcIiwgZmFsc2UpO1xuICAgIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkLXJlbGF0ZWRcIikuY2xpY2soKTtcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5hY3Rpb25zKHtcbiAgICBcInN0YW5kYXJkX3F1ZXJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfbmV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGdyaWROYW1lLCBpbml0aWFsVmFsdWVzLCBpc1JlbGF0ZWQsIG1hc3RlclJlY29yZElkLCBvYmplY3QsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgcmVsYXRlZEZpZWxkTmFtZSwgc2VsZWN0ZWRSb3dzO1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgZ3JpZE5hbWUgPSB0aGlzLmFjdGlvbi5ncmlkTmFtZTtcbiAgICAgIGlzUmVsYXRlZCA9IHRoaXMuYWN0aW9uLmlzUmVsYXRlZDtcbiAgICAgIGlmIChpc1JlbGF0ZWQpIHtcbiAgICAgICAgcmVsYXRlZEZpZWxkTmFtZSA9IHRoaXMuYWN0aW9uLnJlbGF0ZWRGaWVsZE5hbWU7XG4gICAgICAgIG1hc3RlclJlY29yZElkID0gdGhpcy5hY3Rpb24ubWFzdGVyUmVjb3JkSWQ7XG4gICAgICAgIGluaXRpYWxWYWx1ZXMgPSB0aGlzLmFjdGlvbi5pbml0aWFsVmFsdWVzO1xuICAgICAgICBpZiAoIWluaXRpYWxWYWx1ZXMpIHtcbiAgICAgICAgICBpbml0aWFsVmFsdWVzID0ge307XG4gICAgICAgICAgaW5pdGlhbFZhbHVlc1tyZWxhdGVkRmllbGROYW1lXSA9IG1hc3RlclJlY29yZElkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFsVmFsdWVzID0ge307XG4gICAgICAgIGlmIChncmlkTmFtZSkge1xuICAgICAgICAgIHNlbGVjdGVkUm93cyA9IChyZWYgPSB3aW5kb3cuZ3JpZFJlZnMpICE9IG51bGwgPyAocmVmMSA9IHJlZltncmlkTmFtZV0uY3VycmVudCkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hcGkpICE9IG51bGwgPyByZWYyLmdldFNlbGVjdGVkUm93cygpIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGVjdGVkUm93cyA9IChyZWYzID0gd2luZG93LmdyaWRSZWYpICE9IG51bGwgPyAocmVmNCA9IHJlZjMuY3VycmVudCkgIT0gbnVsbCA/IChyZWY1ID0gcmVmNC5hcGkpICE9IG51bGwgPyByZWY1LmdldFNlbGVjdGVkUm93cygpIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxlY3RlZFJvd3MgIT0gbnVsbCA/IHNlbGVjdGVkUm93cy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICByZWNvcmRfaWQgPSBzZWxlY3RlZFJvd3NbMF0uX2lkO1xuICAgICAgICAgIGlmIChyZWNvcmRfaWQpIHtcbiAgICAgICAgICAgIGluaXRpYWxWYWx1ZXMgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5pdGlhbFZhbHVlcyA9IEZvcm1NYW5hZ2VyLmdldEluaXRpYWxWYWx1ZXMob2JqZWN0X25hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0LnZlcnNpb24gOiB2b2lkIDApID49IDIpIHtcbiAgICAgICAgcmV0dXJuIFN0ZWVkb3MuUGFnZS5Gb3JtLlN0YW5kYXJkTmV3LnJlbmRlcihTZXNzaW9uLmdldChcImFwcF9pZFwiKSwgb2JqZWN0X25hbWUsICfmlrDlu7ogJyArIG9iamVjdC5sYWJlbCwgaW5pdGlhbFZhbHVlcywge1xuICAgICAgICAgIGdyaWROYW1lOiBncmlkTmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoc2VsZWN0ZWRSb3dzICE9IG51bGwgPyBzZWxlY3RlZFJvd3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgIH1cbiAgICAgIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQoXCIuY3JlYXRvci1hZGRcIikuY2xpY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgaHJlZjtcbiAgICAgIGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2VkaXRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgb2JqZWN0O1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICAgIGlmICgob2JqZWN0ICE9IG51bGwgPyBvYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgICAgIHJldHVybiBTdGVlZG9zLlBhZ2UuRm9ybS5TdGFuZGFyZEVkaXQucmVuZGVyKFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpLCBvYmplY3RfbmFtZSwgJ+e8lui+kSAnICsgb2JqZWN0LmxhYmVsLCByZWNvcmRfaWQsIHtcbiAgICAgICAgICAgIGdyaWROYW1lOiB0aGlzLmFjdGlvbi5ncmlkTmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2UpIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2RlbGV0ZVwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spIHtcbiAgICAgIHZhciBiZWZvcmVIb29rLCBncmlkTmFtZSwgaTE4blRleHRLZXksIGkxOG5UaXRsZUtleSwgbmFtZUZpZWxkLCBvYmplY3QsIHNlbGVjdGVkUmVjb3JkcywgdGV4dDtcbiAgICAgIGdyaWROYW1lID0gdGhpcy5hY3Rpb24uZ3JpZE5hbWU7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtcbiAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFiZWZvcmVIb29rKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBuYW1lRmllbGQgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVkgfHwgXCJuYW1lXCI7XG4gICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICAgIH1cbiAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgIGxpc3Rfdmlld19pZCA9IFwiYWxsXCI7XG4gICAgICB9XG4gICAgICBpZiAoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiByZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgcmVjb3JkX3RpdGxlID0gcmVjb3JkX3RpdGxlW25hbWVGaWVsZF07XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkICYmICFyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgcmVjb3JkX3RpdGxlID0gcmVjb3JkW25hbWVGaWVsZF07XG4gICAgICB9XG4gICAgICBpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCI7XG4gICAgICBpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGV4dFwiO1xuICAgICAgaWYgKCFyZWNvcmRfaWQpIHtcbiAgICAgICAgaTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RpdGxlXCI7XG4gICAgICAgIGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9zd2FsX3RleHRcIjtcbiAgICAgICAgc2VsZWN0ZWRSZWNvcmRzID0gU3RlZWRvc1VJLmdldFRhYmxlU2VsZWN0ZWRSb3dzKGdyaWROYW1lIHx8IGxpc3Rfdmlld19pZCk7XG4gICAgICAgIGlmICghc2VsZWN0ZWRSZWNvcmRzIHx8ICFzZWxlY3RlZFJlY29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgdG9hc3RyLndhcm5pbmcodChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X25vX3NlbGVjdGlvblwiKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHRleHQgPSB0KGkxOG5UZXh0S2V5LCBvYmplY3QubGFiZWwgKyBcIiBcXFwiXCIgKyByZWNvcmRfdGl0bGUgKyBcIlxcXCJcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gdChpMThuVGV4dEtleSwgXCJcIiArIG9iamVjdC5sYWJlbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3dhbCh7XG4gICAgICAgIHRpdGxlOiB0KGkxOG5UaXRsZUtleSwgXCJcIiArIG9iamVjdC5sYWJlbCksXG4gICAgICAgIHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+XCIgKyB0ZXh0ICsgXCI8L2Rpdj5cIixcbiAgICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpLFxuICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuICAgICAgfSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHZhciBhZnRlckJhdGNoZXNEZWxldGUsIGRlbGV0ZUNvdW50ZXI7XG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgICAgICByZXR1cm4gX2RlbGV0ZVJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIF9lLCBhcHBpZCwgY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIGR4RGF0YUdyaWRJbnN0YW5jZSwgZ3JpZENvbnRhaW5lciwgZ3JpZE9iamVjdE5hbWVDbGFzcywgaXNPcGVuZXJSZW1vdmUsIHJlY29yZFVybCwgcmVmLCB0ZW1wTmF2UmVtb3ZlZDtcbiAgICAgICAgICAgICAgZ3JpZE9iamVjdE5hbWVDbGFzcyA9IG9iamVjdF9uYW1lLnJlcGxhY2UoL1xcLi9nLCBcIi1cIik7XG4gICAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgICAgaWYgKCEoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgIGlzT3BlbmVyUmVtb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuXCIgKyBncmlkT2JqZWN0TmFtZUNsYXNzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjdXJyZW50X29iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50X29iamVjdF9uYW1lICYmICgocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkpICE9IG51bGwgPyByZWYudmVyc2lvbiA6IHZvaWQgMCkgPiAxKSB7XG4gICAgICAgICAgICAgICAgICBTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKEZsb3dSb3V0ZXIuY3VycmVudCgpLnJvdXRlLnBhdGguZW5kc1dpdGgoXCIvOnJlY29yZF9pZFwiKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgICBfZSA9IGVycm9yMTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKF9lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBUZW1wbGF0ZS5jcmVhdG9yX2dyaWQucmVmcmVzaChkeERhdGFHcmlkSW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgICAgICAgdGVtcE5hdlJlbW92ZWQgPSBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpO1xuICAgICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUgfHwgIWR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSkge1xuICAgICAgICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZWNvcmRfaWQgPT09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpICYmIGxpc3Rfdmlld19pZCAhPT0gJ2NhbGVuZGFyJykge1xuICAgICAgICAgICAgICAgICAgYXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKTtcbiAgICAgICAgICAgICAgICAgIGlmICghdGVtcE5hdlJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHAvXCIgKyBhcHBpZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi9ncmlkL1wiICsgbGlzdF92aWV3X2lkKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbF9iYWNrKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRSZWNvcmRzICYmIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJsb2FkaW5nXCIpO1xuICAgICAgICAgICAgICBkZWxldGVDb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgYWZ0ZXJCYXRjaGVzRGVsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlQ291bnRlcisrO1xuICAgICAgICAgICAgICAgIGlmIChkZWxldGVDb3VudGVyID49IHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwibG9hZGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkUmVjb3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICAgIHZhciByZWNvcmRUaXRsZTtcbiAgICAgICAgICAgICAgICByZWNvcmRfaWQgPSByZWNvcmQuX2lkO1xuICAgICAgICAgICAgICAgIGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtcbiAgICAgICAgICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFiZWZvcmVIb29rKSB7XG4gICAgICAgICAgICAgICAgICBhZnRlckJhdGNoZXNEZWxldGUoKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVjb3JkVGl0bGUgPSByZWNvcmRbbmFtZUZpZWxkXSB8fCByZWNvcmRfaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9kZWxldGVSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZC5faWQsIHJlY29yZFRpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIHJlY29yZFVybDtcbiAgICAgICAgICAgICAgICAgIHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICAgICAgICAgICAgQ3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBhZnRlckJhdGNoZXNEZWxldGUoKTtcbiAgICAgICAgICAgICAgICB9KSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gYWZ0ZXJCYXRjaGVzRGVsZXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
