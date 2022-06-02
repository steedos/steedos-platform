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
      built_in_plugins: ["@steedos/unpkg", "@steedos/workflow", "@steedos/accounts", "@steedos/steedos-plugin-schema-builder", "@steedos/plugin-enterprise", "@steedos/metadata-api", "@steedos/plugin-dingtalk", "@steedos/data-import", "@steedos/service-fields-indexs", "@steedos/service-accounts", "@steedos/service-charts", "@steedos/service-pages", "@steedos/service-cloud-init", "@steedos/service-package-registry", "@steedos/standard-process", "@steedos/webapp-accounts", "@steedos/service-plugin-amis"],
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiQVBJU2VydmljZSIsIk1ldGFkYXRhU2VydmljZSIsImNvbmZpZyIsImUiLCJtb2xlY3VsZXIiLCJvYmplY3RxbCIsInBhY2thZ2VMb2FkZXIiLCJwYWNrYWdlU2VydmljZSIsInBhdGgiLCJzZXR0aW5ncyIsInN0ZWVkb3NDb3JlIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJyZXF1aXJlIiwiZ2V0U3RlZWRvc0NvbmZpZyIsImJ1aWx0X2luX3BsdWdpbnMiLCJwbHVnaW5zIiwiTWV0ZW9yIiwic3RhcnR1cCIsImFwaVNlcnZpY2UiLCJicm9rZXIiLCJleCIsIm1ldGFkYXRhU2VydmljZSIsInByb2plY3RTZXJ2aWNlIiwic3RhbmRhcmRPYmplY3RzRGlyIiwic3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UiLCJTZXJ2aWNlQnJva2VyIiwibmFtZXNwYWNlIiwibm9kZUlEIiwibWV0YWRhdGEiLCJ0cmFuc3BvcnRlciIsIlRSQU5TUE9SVEVSIiwiY2FjaGVyIiwiQ0FDSEVSIiwibG9nTGV2ZWwiLCJzZXJpYWxpemVyIiwicmVxdWVzdFRpbWVvdXQiLCJtYXhDYWxsTGV2ZWwiLCJoZWFydGJlYXRJbnRlcnZhbCIsImhlYXJ0YmVhdFRpbWVvdXQiLCJjb250ZXh0UGFyYW1zQ2xvbmluZyIsInRyYWNraW5nIiwiZW5hYmxlZCIsInNodXRkb3duVGltZW91dCIsImRpc2FibGVCYWxhbmNlciIsInJlZ2lzdHJ5Iiwic3RyYXRlZ3kiLCJwcmVmZXJMb2NhbCIsImJ1bGtoZWFkIiwiY29uY3VycmVuY3kiLCJtYXhRdWV1ZVNpemUiLCJ2YWxpZGF0b3IiLCJlcnJvckhhbmRsZXIiLCJ0cmFjaW5nIiwiZXhwb3J0ZXIiLCJ0eXBlIiwib3B0aW9ucyIsImxvZ2dlciIsImNvbG9ycyIsIndpZHRoIiwiZ2F1Z2VXaWR0aCIsInNraXBQcm9jZXNzRXZlbnRSZWdpc3RyYXRpb24iLCJjcmVhdGVTZXJ2aWNlIiwibmFtZSIsIm1peGlucyIsInBvcnQiLCJnZXRTdGVlZG9zU2NoZW1hIiwiU3RhbmRhcmRPYmplY3RzUGF0aCIsInBhY2thZ2VJbmZvIiwid3JhcEFzeW5jIiwiY2IiLCJzdGFydCIsInRoZW4iLCJzdGFydGVkIiwiX3Jlc3RhcnRTZXJ2aWNlIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwiZXhwcmVzcyIsIndhaXRGb3JTZXJ2aWNlcyIsInJlc29sdmUiLCJyZWplY3QiLCJpbml0IiwiZXJyb3IiLCJjb25zb2xlIiwiRmliZXIiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJsaXN0X3ZpZXdzIiwic3BhY2UiLCJnZXRDb2xsZWN0aW9uTmFtZSIsIl8iLCJjbG9uZSIsImNvbnZlcnRPYmplY3QiLCJPYmplY3QiLCJpbml0VHJpZ2dlcnMiLCJpbml0TGlzdFZpZXdzIiwiZ2V0T2JqZWN0TmFtZSIsImdldE9iamVjdCIsInNwYWNlX2lkIiwicmVmIiwicmVmMSIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJvYmplY3RzQnlOYW1lIiwiZ2V0T2JqZWN0QnlJZCIsIm9iamVjdF9pZCIsImZpbmRXaGVyZSIsIl9pZCIsInJlbW92ZU9iamVjdCIsImxvZyIsImdldENvbGxlY3Rpb24iLCJzcGFjZUlkIiwiX2NvbGxlY3Rpb25fbmFtZSIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiZmllbGRzIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsImlzU3RyaW5nIiwiRm9ybXVsYXIiLCJjaGVja0Zvcm11bGEiLCJldmFsdWF0ZUZpbHRlcnMiLCJmaWx0ZXJzIiwic2VsZWN0b3IiLCJlYWNoIiwiZmlsdGVyIiwiYWN0aW9uIiwidmFsdWUiLCJsZW5ndGgiLCJpc0NvbW1vblNwYWNlIiwiZ2V0T3JkZXJseVNldEJ5SWRzIiwiZG9jcyIsImlkcyIsImlkX2tleSIsImhpdF9maXJzdCIsInZhbHVlcyIsImdldFByb3BlcnR5Iiwic29ydEJ5IiwiZG9jIiwiX2luZGV4Iiwic29ydGluZ01ldGhvZCIsInZhbHVlMSIsInZhbHVlMiIsImlzVmFsdWUxRW1wdHkiLCJpc1ZhbHVlMkVtcHR5IiwibG9jYWxlIiwia2V5IiwiRGF0ZSIsImdldFRpbWUiLCJTdGVlZG9zIiwidG9TdHJpbmciLCJsb2NhbGVDb21wYXJlIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfb2JqZWN0IiwicGVybWlzc2lvbnMiLCJyZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0TWFwIiwicmVsYXRlZF9vYmplY3RzIiwiaXNFbXB0eSIsIm9iak5hbWUiLCJpc09iamVjdCIsIm9iamVjdE5hbWUiLCJyZWxhdGVkX29iamVjdCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwicmVmZXJlbmNlX3RvIiwiZm9yZWlnbl9rZXkiLCJ3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCIsImVuYWJsZU9iak5hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJlbmFibGVfZmlsZXMiLCJwdXNoIiwic2ZzRmlsZXNPYmplY3QiLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImVuYWJsZV9hcHByb3ZhbHMiLCJlbmFibGVfcHJvY2VzcyIsImdldFVzZXJDb250ZXh0IiwiaXNVblNhZmVNb2RlIiwiVVNFUl9DT05URVhUIiwic3BhY2VfdXNlcl9vcmciLCJzdSIsInN1RmllbGRzIiwiRXJyb3IiLCJtb2JpbGUiLCJwb3NpdGlvbiIsImVtYWlsIiwiY29tcGFueSIsIm9yZ2FuaXphdGlvbiIsImNvbXBhbnlfaWQiLCJjb21wYW55X2lkcyIsInVzZXIiLCJmdWxsbmFtZSIsImdldFJlbGF0aXZlVXJsIiwidXJsIiwiaXNGdW5jdGlvbiIsImlzQ29yZG92YSIsInN0YXJ0c1dpdGgiLCJ0ZXN0IiwiX19tZXRlb3JfcnVudGltZV9jb25maWdfXyIsIlJPT1RfVVJMX1BBVEhfUFJFRklYIiwiZ2V0VXNlckNvbXBhbnlJZCIsImdldFVzZXJDb21wYW55SWRzIiwicHJvY2Vzc1Blcm1pc3Npb25zIiwicG8iLCJhbGxvd0NyZWF0ZSIsImFsbG93UmVhZCIsImFsbG93RWRpdCIsImFsbG93RGVsZXRlIiwidmlld0FsbFJlY29yZHMiLCJ2aWV3Q29tcGFueVJlY29yZHMiLCJtb2RpZnlDb21wYW55UmVjb3JkcyIsImFsbG93UmVhZEZpbGVzIiwidmlld0FsbEZpbGVzIiwiYWxsb3dDcmVhdGVGaWxlcyIsImFsbG93RWRpdEZpbGVzIiwiYWxsb3dEZWxldGVGaWxlcyIsIm1vZGlmeUFsbEZpbGVzIiwiZ2V0VGVtcGxhdGVTcGFjZUlkIiwidGVtcGxhdGVTcGFjZUlkIiwiZ2V0Q2xvdWRBZG1pblNwYWNlSWQiLCJjbG91ZEFkbWluU3BhY2VJZCIsImlzVGVtcGxhdGVTcGFjZSIsImlzQ2xvdWRBZG1pblNwYWNlIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsIm9wdGlvbnNfbGltaXQiLCJxdWVyeSIsInF1ZXJ5X29wdGlvbnMiLCJyZWNvcmRzIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsInBhcmFtcyIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJmaWx0ZXJRdWVyeSIsImxpbWl0IiwiZmluZCIsImZldGNoIiwicmVjb3JkIiwibGFiZWwiLCJtZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm94IiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJmbG93SWQiLCJoYXNoRGF0YSIsImlucyIsImluc0lkIiwicmVjb3JkX2lkIiwicmVkaXJlY3RfdXJsIiwicmVmMiIsInJlZjMiLCJyZWY0Iiwid29ya2Zsb3dVcmwiLCJ4X2F1dGhfdG9rZW4iLCJ4X3VzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsImJvZHkiLCJjaGVjayIsImluc3RhbmNlSWQiLCJmbG93IiwiaW5ib3hfdXNlcnMiLCJpbmNsdWRlcyIsImNjX3VzZXJzIiwib3V0Ym94X3VzZXJzIiwic3RhdGUiLCJzdWJtaXR0ZXIiLCJhcHBsaWNhbnQiLCJwZXJtaXNzaW9uTWFuYWdlciIsImdldEZsb3dQZXJtaXNzaW9ucyIsInNwYWNlcyIsIndlYnNlcnZpY2VzIiwid29ya2Zsb3ciLCJzZW5kUmVzdWx0IiwiY29kZSIsImRhdGEiLCJ1cGRhdGUiLCIkdW5zZXQiLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJnZXRJbml0V2lkdGhQZXJjZW50IiwiY29sdW1ucyIsIl9zY2hlbWEiLCJjb2x1bW5fbnVtIiwiaW5pdF93aWR0aF9wZXJjZW50IiwiZ2V0U2NoZW1hIiwiZmllbGRfbmFtZSIsImZpZWxkIiwiaXNfd2lkZSIsInBpY2siLCJhdXRvZm9ybSIsImdldEZpZWxkSXNXaWRlIiwiZ2V0VGFidWxhck9yZGVyIiwibGlzdF92aWV3X2lkIiwic2V0dGluZyIsIm1hcCIsImNvbHVtbiIsImhpZGRlbiIsImNvbXBhY3QiLCJvcmRlciIsImluZGV4IiwiZGVmYXVsdF9leHRyYV9jb2x1bW5zIiwiZXh0cmFfY29sdW1ucyIsImdldE9iamVjdERlZmF1bHRDb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyIsInVuaW9uIiwiZ2V0T2JqZWN0RGVmYXVsdFNvcnQiLCJUYWJ1bGFyU2VsZWN0ZWRJZHMiLCJjb252ZXJ0TGlzdFZpZXciLCJkZWZhdWx0X3ZpZXciLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfbmFtZSIsImRlZmF1bHRfY29sdW1ucyIsImRlZmF1bHRfbW9iaWxlX2NvbHVtbnMiLCJvaXRlbSIsIm1vYmlsZV9jb2x1bW5zIiwiaGFzIiwiaW5jbHVkZSIsImZpbHRlcl9zY29wZSIsInBhcnNlIiwiZm9yRWFjaCIsIl92YWx1ZSIsImdldFJlbGF0ZWRMaXN0IiwibGF5b3V0UmVsYXRlZExpc3QiLCJsaXN0IiwibWFwTGlzdCIsIm9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyIsInJlbGF0ZWRMaXN0TmFtZXMiLCJyZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInVucmVsYXRlZF9vYmplY3RzIiwicmVsYXRlZF9saXN0cyIsIml0ZW0iLCJyZUZpZWxkTmFtZSIsInJlT2JqZWN0TmFtZSIsInJlbGF0ZWQiLCJyZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lIiwic3BsaXQiLCJmaWVsZF9uYW1lcyIsImlzX2ZpbGUiLCJjdXN0b21SZWxhdGVkTGlzdE9iamVjdCIsImFjdGlvbnMiLCJidXR0b25zIiwidmlzaWJsZV9vbiIsInBhZ2Vfc2l6ZSIsIm9iak9yTmFtZSIsImdldFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfaXRlbSIsInJlbGF0ZWRPYmplY3QiLCJ0YWJ1bGFyX29yZGVyIiwiZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMiLCJ3aXRob3V0IiwidHJhbnNmb3JtU29ydFRvVGFidWxhciIsInJlcGxhY2UiLCJwbHVjayIsImRpZmZlcmVuY2UiLCJ2IiwiaXNBY3RpdmUiLCJhbGxvd19yZWxhdGVkTGlzdCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJmaXJzdCIsImdldExpc3RWaWV3cyIsImdldExpc3RWaWV3IiwiZXhhYyIsImxpc3RWaWV3cyIsImdldExpc3RWaWV3SXNSZWNlbnQiLCJsaXN0VmlldyIsInBpY2tPYmplY3RNb2JpbGVDb2x1bW5zIiwiY291bnQiLCJnZXRGaWVsZCIsImlzTmFtZUNvbHVtbiIsIml0ZW1Db3VudCIsIm1heENvdW50IiwibWF4Um93cyIsIm5hbWVDb2x1bW4iLCJuYW1lS2V5IiwicmVzdWx0IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJSZWdFeHAiLCJfcmVnRXhNZXNzYWdlcyIsIl9nbG9iYWxNZXNzYWdlcyIsInJlZ0V4IiwiZXhwIiwibXNnIiwibWVzc2FnZXMiLCJldmFsSW5Db250ZXh0IiwianMiLCJldmFsIiwiY2FsbCIsImNvbnZlcnRGaWVsZCIsImdldE9wdGlvbiIsIm9wdGlvbiIsImZvbyIsImNvbG9yIiwiYWxsT3B0aW9ucyIsInBpY2tsaXN0IiwicGlja2xpc3RPcHRpb25zIiwiZ2V0UGlja2xpc3QiLCJnZXRQaWNrTGlzdE9wdGlvbnMiLCJyZXZlcnNlIiwiZW5hYmxlIiwiZGVmYXVsdFZhbHVlIiwidHJpZ2dlcnMiLCJ0cmlnZ2VyIiwiX3RvZG8iLCJfdG9kb19mcm9tX2NvZGUiLCJfdG9kb19mcm9tX2RiIiwib24iLCJ0b2RvIiwic3lzdGVtQmFzZUZpZWxkcyIsIm9taXQiLCJyZXF1aXJlZCIsInJlYWRvbmx5IiwiZ2V0U3lzdGVtQmFzZUZpZWxkcyIsIl92aXNpYmxlIiwiZXJyb3IxIiwiYWN0aW9uc0J5TmFtZSIsInZpc2libGUiLCJfb3B0aW9ucyIsIl90eXBlIiwiYmVmb3JlT3BlbkZ1bmN0aW9uIiwiaXNfY29tcGFueV9saW1pdGVkIiwibWF4IiwibWluIiwiX29wdGlvbiIsImsiLCJfcmVnRXgiLCJfbWluIiwiX21heCIsIk51bWJlciIsIkJvb2xlYW4iLCJfb3B0aW9uc0Z1bmN0aW9uIiwiX3JlZmVyZW5jZV90byIsIl9jcmVhdGVGdW5jdGlvbiIsIl9iZWZvcmVPcGVuRnVuY3Rpb24iLCJfZmlsdGVyc0Z1bmN0aW9uIiwiX2RlZmF1bHRWYWx1ZSIsIl9pc19jb21wYW55X2xpbWl0ZWQiLCJfZmlsdGVycyIsImlzRGF0ZSIsInBvcCIsIl9pc19kYXRlIiwiZm9ybSIsInZhbCIsInJlbGF0ZWRPYmpJbmZvIiwiUFJFRklYIiwiX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhIiwicHJlZml4IiwiZmllbGRWYXJpYWJsZSIsInJlZyIsInJldiIsIm0iLCIkMSIsImZvcm11bGFfc3RyIiwiX0NPTlRFWFQiLCJfVkFMVUVTIiwiaXNCb29sZWFuIiwidG9hc3RyIiwiZm9ybWF0T2JqZWN0TmFtZSIsIl9iYXNlT2JqZWN0IiwiX2RiIiwiZGVmYXVsdExpc3RWaWV3SWQiLCJkaXNhYmxlZF9saXN0X3ZpZXdzIiwic2NoZW1hIiwic2VsZiIsImJhc2VPYmplY3QiLCJwZXJtaXNzaW9uX3NldCIsImljb24iLCJkZXNjcmlwdGlvbiIsImlzX3ZpZXciLCJ2ZXJzaW9uIiwiaXNfZW5hYmxlIiwiYWxsb3dfY3VzdG9tQWN0aW9ucyIsImV4Y2x1ZGVfYWN0aW9ucyIsImVuYWJsZV9zZWFyY2giLCJwYWdpbmciLCJlbmFibGVfYXBpIiwiY3VzdG9tIiwiZW5hYmxlX3NoYXJlIiwiZW5hYmxlX3RyZWUiLCJzaWRlYmFyIiwib3Blbl93aW5kb3ciLCJmaWx0ZXJfY29tcGFueSIsImNhbGVuZGFyIiwiZW5hYmxlX2NoYXR0ZXIiLCJlbmFibGVfdHJhc2giLCJlbmFibGVfc3BhY2VfZ2xvYmFsIiwiZW5hYmxlX2ZvbGxvdyIsImVuYWJsZV93b3JrZmxvdyIsImVuYWJsZV9pbmxpbmVfZWRpdCIsImRldGFpbHMiLCJtYXN0ZXJzIiwibG9va3VwX2RldGFpbHMiLCJpbl9kZXZlbG9wbWVudCIsImlkRmllbGROYW1lIiwiZGF0YWJhc2VfbmFtZSIsImlzX25hbWUiLCJwcmltYXJ5IiwiZmlsdGVyYWJsZSIsIml0ZW1fbmFtZSIsImNvcHlJdGVtIiwiYWRtaW4iLCJhbGwiLCJsaXN0X3ZpZXdfaXRlbSIsIlJlYWN0aXZlVmFyIiwiY3JlYXRlQ29sbGVjdGlvbiIsIl9uYW1lIiwiZ2V0T2JqZWN0U2NoZW1hIiwiY29udGFpbnMiLCJhdHRhY2hTY2hlbWEiLCJfc2ltcGxlU2NoZW1hIiwiZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXgiLCJib290c3RyYXBMb2FkZWQiLCJnZXRTZWxlY3RPcHRpb25zIiwiZmllbGRTY2hlbWEiLCJkYXRhX3R5cGUiLCJvcHRpb25JdGVtIiwiZmllbGRzQXJyIiwiX3JlZl9vYmoiLCJhdXRvZm9ybV90eXBlIiwiY29sbGVjdGlvbk5hbWUiLCJmcyIsImZzVHlwZSIsImlzVW5MaW1pdGVkIiwibXVsdGlwbGUiLCJyb3dzIiwibGFuZ3VhZ2UiLCJpc01vYmlsZSIsImlzUGFkIiwiaXNpT1MiLCJhZkZpZWxkSW5wdXQiLCJ0aW1lem9uZUlkIiwiZHhEYXRlQm94T3B0aW9ucyIsImRpc3BsYXlGb3JtYXQiLCJwaWNrZXJUeXBlIiwiZGF0ZU1vYmlsZU9wdGlvbnMiLCJvdXRGb3JtYXQiLCJoZWlnaHQiLCJkaWFsb2dzSW5Cb2R5IiwidG9vbGJhciIsImZvbnROYW1lcyIsImxhbmciLCJzaG93SWNvbiIsImRlcGVuZE9uIiwiZGVwZW5kX29uIiwiY3JlYXRlIiwibG9va3VwX2ZpZWxkIiwiTW9kYWwiLCJzaG93IiwiZm9ybUlkIiwib3BlcmF0aW9uIiwib25TdWNjZXNzIiwiYWRkSXRlbXMiLCJyZWZlcmVuY2Vfc29ydCIsIm9wdGlvbnNTb3J0IiwicmVmZXJlbmNlX2xpbWl0Iiwib3B0aW9uc0xpbWl0IiwicmVmZXJlbmNlX3RvX2ZpZWxkIiwicmVmZXJlbmNlVG9GaWVsZCIsImJsYWNrYm94Iiwib2JqZWN0U3dpdGNoZSIsIm9wdGlvbnNNZXRob2QiLCJvcHRpb25zTWV0aG9kUGFyYW1zIiwicmVmZXJlbmNlcyIsIl9yZWZlcmVuY2UiLCJsaW5rIiwiZGVmYXVsdEljb24iLCJmaXJzdE9wdGlvbiIsImRlY2ltYWwiLCJwcmVjaXNpb24iLCJzY2FsZSIsImRpc2FibGVkIiwiQXJyYXkiLCJlZGl0YWJsZSIsImFjY2VwdCIsInN5c3RlbSIsIkVtYWlsIiwiYXNzaWduIiwiaXNOdW1iZXIiLCJvcHRpb25hbCIsInVuaXF1ZSIsImdyb3VwIiwic2VhcmNoYWJsZSIsIm5vdyIsImlubGluZUhlbHBUZXh0IiwiaXNQcm9kdWN0aW9uIiwic29ydGFibGUiLCJnZXRGaWVsZERpc3BsYXlWYWx1ZSIsImZpZWxkX3ZhbHVlIiwiaHRtbCIsIm1vbWVudCIsImZvcm1hdCIsImNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSIsImZpZWxkX3R5cGUiLCJwdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMiLCJvcGVyYXRpb25zIiwiYnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVzIiwiYnVpbHRpbkl0ZW0iLCJpc19jaGVja19vbmx5IiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0iLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0iLCJnZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiIsImJldHdlZW5CdWlsdGluVmFsdWVzIiwiZ2V0UXVhcnRlclN0YXJ0TW9udGgiLCJtb250aCIsImdldE1vbnRoIiwiZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSIsInllYXIiLCJnZXRGdWxsWWVhciIsImdldE5leHRRdWFydGVyRmlyc3REYXkiLCJnZXRNb250aERheXMiLCJkYXlzIiwiZW5kRGF0ZSIsIm1pbGxpc2Vjb25kIiwic3RhcnREYXRlIiwiZ2V0TGFzdE1vbnRoRmlyc3REYXkiLCJjdXJyZW50TW9udGgiLCJjdXJyZW50WWVhciIsImVuZFZhbHVlIiwiZmlyc3REYXkiLCJsYXN0RGF5IiwibGFzdE1vbmRheSIsImxhc3RNb250aEZpbmFsRGF5IiwibGFzdE1vbnRoRmlyc3REYXkiLCJsYXN0UXVhcnRlckVuZERheSIsImxhc3RRdWFydGVyU3RhcnREYXkiLCJsYXN0U3VuZGF5IiwibGFzdF8xMjBfZGF5cyIsImxhc3RfMzBfZGF5cyIsImxhc3RfNjBfZGF5cyIsImxhc3RfN19kYXlzIiwibGFzdF85MF9kYXlzIiwibWludXNEYXkiLCJtb25kYXkiLCJuZXh0TW9uZGF5IiwibmV4dE1vbnRoRmluYWxEYXkiLCJuZXh0TW9udGhGaXJzdERheSIsIm5leHRRdWFydGVyRW5kRGF5IiwibmV4dFF1YXJ0ZXJTdGFydERheSIsIm5leHRTdW5kYXkiLCJuZXh0WWVhciIsIm5leHRfMTIwX2RheXMiLCJuZXh0XzMwX2RheXMiLCJuZXh0XzYwX2RheXMiLCJuZXh0XzdfZGF5cyIsIm5leHRfOTBfZGF5cyIsInByZXZpb3VzWWVhciIsInN0YXJ0VmFsdWUiLCJzdHJFbmREYXkiLCJzdHJGaXJzdERheSIsInN0ckxhc3REYXkiLCJzdHJNb25kYXkiLCJzdHJTdGFydERheSIsInN0clN1bmRheSIsInN0clRvZGF5Iiwic3RyVG9tb3Jyb3ciLCJzdHJZZXN0ZGF5Iiwic3VuZGF5IiwidGhpc1F1YXJ0ZXJFbmREYXkiLCJ0aGlzUXVhcnRlclN0YXJ0RGF5IiwidG9tb3Jyb3ciLCJ3ZWVrIiwieWVzdGRheSIsImdldERheSIsInQiLCJmdiIsInNldEhvdXJzIiwiZ2V0SG91cnMiLCJnZXRUaW1lem9uZU9mZnNldCIsImdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiIsImdldEZpZWxkT3BlcmF0aW9uIiwib3B0aW9uYWxzIiwiZXF1YWwiLCJ1bmVxdWFsIiwibGVzc190aGFuIiwiZ3JlYXRlcl90aGFuIiwibGVzc19vcl9lcXVhbCIsImdyZWF0ZXJfb3JfZXF1YWwiLCJub3RfY29udGFpbiIsInN0YXJ0c193aXRoIiwiYmV0d2VlbiIsImdldE9iamVjdEZpZWxkc05hbWUiLCJmaWVsZHNOYW1lIiwic29ydF9ubyIsImNsZWFuVHJpZ2dlciIsImluaXRUcmlnZ2VyIiwiX3RyaWdnZXJfaG9va3MiLCJyZWY1IiwidG9kb1dyYXBwZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIndoZW4iLCJiZWZvcmUiLCJpbnNlcnQiLCJyZW1vdmUiLCJhZnRlciIsIl9ob29rIiwidHJpZ2dlcl9uYW1lIiwiX3RyaWdnZXJfaG9vayIsImJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcyIsImV4dGVuZFBlcm1pc3Npb25Qcm9wcyIsImZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QiLCJmaW5kX3Blcm1pc3Npb25fb2JqZWN0IiwiaW50ZXJzZWN0aW9uUGx1cyIsIm90aGVyUGVybWlzc2lvblByb3BOYW1lcyIsIm92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyIsInBlcm1pc3Npb25Qcm9wTmFtZXMiLCJ1bmlvblBlcm1pc3Npb25PYmplY3RzIiwidW5pb25QbHVzIiwiZ2V0T2JqZWN0UGVybWlzc2lvbnMiLCJnZXRSZWNvcmRQZXJtaXNzaW9ucyIsImlzT3duZXIiLCJtYXN0ZXJPYmplY3ROYW1lIiwibWFzdGVyUmVjb3JkUGVybSIsInJlY29yZF9jb21wYW55X2lkIiwicmVjb3JkX2NvbXBhbnlfaWRzIiwidXNlcl9jb21wYW55X2lkcyIsInJlY29yZF9wZXJtaXNzaW9ucyIsIm93bmVyIiwicGFyZW50IiwibiIsImludGVyc2VjdGlvbiIsImxvY2tlZCIsImdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMiLCJjdXJyZW50T2JqZWN0TmFtZSIsInJlbGF0ZWRMaXN0SXRlbSIsImN1cnJlbnRSZWNvcmQiLCJpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUiLCJtYXN0ZXJBbGxvdyIsInJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyIsInVuZWRpdGFibGVfcmVsYXRlZF9saXN0IiwiZ2V0T2JqZWN0UmVjb3JkIiwiZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0IiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJfaSIsInBzZXRzIiwicHNldHNBZG1pbiIsInBzZXRzQWRtaW5fcG9zIiwicHNldHNDdXJyZW50IiwicHNldHNDdXJyZW50TmFtZXMiLCJwc2V0c0N1cnJlbnRfcG9zIiwicHNldHNDdXN0b21lciIsInBzZXRzQ3VzdG9tZXJfcG9zIiwicHNldHNHdWVzdCIsInBzZXRzR3Vlc3RfcG9zIiwicHNldHNNZW1iZXIiLCJwc2V0c01lbWJlcl9wb3MiLCJwc2V0c1N1cHBsaWVyIiwicHNldHNTdXBwbGllcl9wb3MiLCJwc2V0c1VzZXIiLCJwc2V0c1VzZXJfcG9zIiwic2V0X2lkcyIsInNwYWNlVXNlciIsIm9iamVjdHMiLCJhc3NpZ25lZF9hcHBzIiwicHJvZmlsZSIsInVzZXJzIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJnZXRBc3NpZ25lZEFwcHMiLCJiaW5kIiwiYXNzaWduZWRfbWVudXMiLCJnZXRBc3NpZ25lZE1lbnVzIiwidXNlcl9wZXJtaXNzaW9uX3NldHMiLCJhcnJheSIsIm90aGVyIiwidGFyZ2V0IiwicHJvcHMiLCJmaWxlc1Byb05hbWVzIiwicHJvcE5hbWVzIiwicHJvcE5hbWUiLCJhcHBzIiwicHNldEJhc2UiLCJ1c2VyUHJvZmlsZSIsInBzZXQiLCJ1bmlxIiwiYWJvdXRNZW51IiwiYWRtaW5NZW51cyIsImFsbE1lbnVzIiwiY3VycmVudFBzZXROYW1lcyIsIm1lbnVzIiwib3RoZXJNZW51QXBwcyIsIm90aGVyTWVudXMiLCJhZG1pbl9tZW51cyIsImZsYXR0ZW4iLCJtZW51IiwicHNldHNNZW51IiwicGVybWlzc2lvbl9zZXRzIiwicGVybWlzc2lvbl9vYmplY3RzIiwiaXNOdWxsIiwicGVybWlzc2lvbl9zZXRfaWRzIiwicG9zIiwib3BzIiwib3BzX2tleSIsImN1cnJlbnRQc2V0IiwidGVtcE9wcyIsInJlcGVhdEluZGV4IiwicmVwZWF0UG8iLCJvcHNldEFkbWluIiwib3BzZXRDdXN0b21lciIsIm9wc2V0R3Vlc3QiLCJvcHNldE1lbWJlciIsIm9wc2V0U3VwcGxpZXIiLCJvcHNldFVzZXIiLCJwb3NBZG1pbiIsInBvc0N1c3RvbWVyIiwicG9zR3Vlc3QiLCJwb3NNZW1iZXIiLCJwb3NTdXBwbGllciIsInBvc1VzZXIiLCJwcm9mIiwiZ3Vlc3QiLCJtZW1iZXIiLCJzdXBwbGllciIsImN1c3RvbWVyIiwiZGlzYWJsZWRfYWN0aW9ucyIsInVucmVhZGFibGVfZmllbGRzIiwidW5lZGl0YWJsZV9maWVsZHMiLCJjcmVhdG9yX2RiX3VybCIsIm9wbG9nX3VybCIsIk1PTkdPX1VSTF9DUkVBVE9SIiwiTU9OR09fT1BMT0dfVVJMX0NSRUFUT1IiLCJfQ1JFQVRPUl9EQVRBU09VUkNFIiwiX2RyaXZlciIsIk1vbmdvSW50ZXJuYWxzIiwiUmVtb3RlQ29sbGVjdGlvbkRyaXZlciIsIm9wbG9nVXJsIiwiY29sbGVjdGlvbl9rZXkiLCJuZXdDb2xsZWN0aW9uIiwiU01TUXVldWUiLCJfZGVsZXRlUmVjb3JkIiwic3RlZWRvc0ZpbHRlcnMiLCJhY3Rpb25fbmFtZSIsImV4ZWN1dGVBY3Rpb24iLCJpdGVtX2VsZW1lbnQiLCJjYWxsYmFjayIsIm1vcmVBcmdzIiwidG9kb0FyZ3MiLCJPYmplY3RHcmlkIiwiZ2V0RmlsdGVycyIsIndvcmRfdGVtcGxhdGUiLCJmb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5IiwiYWJzb2x1dGVVcmwiLCJ3aW5kb3ciLCJvcGVuIiwib2RhdGEiLCJwcm90b3R5cGUiLCJzbGljZSIsImNvbmNhdCIsIndhcm5pbmciLCJyZWNvcmRfdGl0bGUiLCJjYWxsX2JhY2siLCJjYWxsX2JhY2tfZXJyb3IiLCJwcmV2aW91c0RvYyIsIkZvcm1NYW5hZ2VyIiwiZ2V0UHJldmlvdXNEb2MiLCJpbmZvIiwic3VjY2VzcyIsInJ1bkhvb2siLCJyZWxhdGVkT2JqZWN0U3RhbmRhcmROZXciLCJjb2xsZWN0aW9uX25hbWUiLCJjdXJyZW50X29iamVjdF9uYW1lIiwiY3VycmVudF9yZWNvcmRfaWQiLCJkZWZhdWx0RG9jIiwiaW5pdGlhbFZhbHVlcyIsInJlbGF0ZU9iamVjdCIsInNldCIsImdldFJlbGF0ZWRJbml0aWFsVmFsdWVzIiwiU3RlZWRvc1VJIiwic2hvd01vZGFsIiwic3RvcmVzIiwiQ29tcG9uZW50UmVnaXN0cnkiLCJjb21wb25lbnRzIiwiT2JqZWN0Rm9ybSIsIm9iamVjdEFwaU5hbWUiLCJ0aXRsZSIsImFmdGVySW5zZXJ0Iiwic2V0VGltZW91dCIsInJlbG9hZFJlY29yZCIsIkZsb3dSb3V0ZXIiLCJyZWxvYWQiLCJpY29uUGF0aCIsImRlZmVyIiwiJCIsImNsaWNrIiwiZ3JpZE5hbWUiLCJpc1JlbGF0ZWQiLCJtYXN0ZXJSZWNvcmRJZCIsInJlbGF0ZWRGaWVsZE5hbWUiLCJzZWxlY3RlZFJvd3MiLCJncmlkUmVmcyIsImN1cnJlbnQiLCJhcGkiLCJnZXRTZWxlY3RlZFJvd3MiLCJncmlkUmVmIiwiZ2V0SW5pdGlhbFZhbHVlcyIsIlBhZ2UiLCJGb3JtIiwiU3RhbmRhcmROZXciLCJyZW5kZXIiLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwicmVkaXJlY3QiLCJTdGFuZGFyZEVkaXQiLCJiZWZvcmVIb29rIiwiaTE4blRleHRLZXkiLCJpMThuVGl0bGVLZXkiLCJuYW1lRmllbGQiLCJzZWxlY3RlZFJlY29yZHMiLCJ0ZXh0IiwiZ2V0VGFibGVTZWxlY3RlZFJvd3MiLCJzd2FsIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsImFmdGVyQmF0Y2hlc0RlbGV0ZSIsImRlbGV0ZUNvdW50ZXIiLCJfZSIsImFwcGlkIiwiZHhEYXRhR3JpZEluc3RhbmNlIiwiZ3JpZENvbnRhaW5lciIsImdyaWRPYmplY3ROYW1lQ2xhc3MiLCJpc09wZW5lclJlbW92ZSIsInJlY29yZFVybCIsInRlbXBOYXZSZW1vdmVkIiwib3BlbmVyIiwicm91dGUiLCJlbmRzV2l0aCIsInJlZnJlc2hHcmlkIiwiZHhUcmVlTGlzdCIsImR4RGF0YUdyaWQiLCJyZWZyZXNoIiwiVGVtcGxhdGUiLCJjcmVhdG9yX2dyaWQiLCJyZW1vdmVUZW1wTmF2SXRlbSIsImNsb3NlIiwiZ28iLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwicmVjb3JkVGl0bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEtBQUNBLEVBQUQsR0FBTSxFQUFOOztBQUNBLElBQUksT0FBQUMsT0FBQSxvQkFBQUEsWUFBQSxJQUFKO0FBQ0MsT0FBQ0EsT0FBRCxHQUFXLEVBQVg7QUNFQTs7QUREREEsUUFBUUMsT0FBUixHQUFrQixFQUFsQjtBQUNBRCxRQUFRRSxXQUFSLEdBQXNCLEVBQXRCO0FBQ0FGLFFBQVFHLEtBQVIsR0FBZ0IsRUFBaEI7QUFDQUgsUUFBUUksSUFBUixHQUFlLEVBQWY7QUFDQUosUUFBUUssVUFBUixHQUFxQixFQUFyQjtBQUNBTCxRQUFRTSxPQUFSLEdBQWtCLEVBQWxCO0FBQ0FOLFFBQVFPLElBQVIsR0FBZSxFQUFmO0FBQ0FQLFFBQVFRLGFBQVIsR0FBd0IsRUFBeEIsQzs7Ozs7Ozs7Ozs7O0FFVkEsSUFBQUMsVUFBQSxFQUFBQyxlQUFBLEVBQUFDLE1BQUEsRUFBQUMsQ0FBQSxFQUFBQyxTQUFBLEVBQUFDLFFBQUEsRUFBQUMsYUFBQSxFQUFBQyxjQUFBLEVBQUFDLElBQUEsRUFBQUMsUUFBQSxFQUFBQyxXQUFBOztBQUFBO0FBQ0MsTUFBR0MsUUFBUUMsR0FBUixDQUFZQyxnQkFBWixLQUFnQyxhQUFuQztBQUNDSCxrQkFBY0ksUUFBUSxlQUFSLENBQWQ7QUFDQVQsZUFBV1MsUUFBUSxtQkFBUixDQUFYO0FBQ0FWLGdCQUFZVSxRQUFRLFdBQVIsQ0FBWjtBQUNBUixvQkFBZ0JRLFFBQVEsd0NBQVIsQ0FBaEI7QUFDQWQsaUJBQWFjLFFBQVEsc0JBQVIsQ0FBYjtBQUNBYixzQkFBa0JhLFFBQVEsa0NBQVIsQ0FBbEI7QUFDQVAscUJBQWlCTyxRQUFRLG1DQUFSLENBQWpCO0FBQ0FOLFdBQU9NLFFBQVEsTUFBUixDQUFQO0FBRUFaLGFBQVNHLFNBQVNVLGdCQUFULEVBQVQ7QUFDQU4sZUFBVztBQUNWTyx3QkFBa0IsQ0FDakIsZ0JBRGlCLEVBRWpCLG1CQUZpQixFQUdqQixtQkFIaUIsRUFJakIsd0NBSmlCLEVBS2pCLDRCQUxpQixFQVFqQix1QkFSaUIsRUFTakIsMEJBVGlCLEVBVWpCLHNCQVZpQixFQVdqQixnQ0FYaUIsRUFZakIsMkJBWmlCLEVBYWpCLHlCQWJpQixFQWNqQix3QkFkaUIsRUFlakIsNkJBZmlCLEVBZ0JqQixtQ0FoQmlCLEVBaUJqQiwyQkFqQmlCLEVBa0JqQiwwQkFsQmlCLEVBbUJqQiw4QkFuQmlCLENBRFI7QUFzQlZDLGVBQVNmLE9BQU9lO0FBdEJOLEtBQVg7QUF3QkFDLFdBQU9DLE9BQVAsQ0FBZTtBQUNkLFVBQUFDLFVBQUEsRUFBQUMsTUFBQSxFQUFBQyxFQUFBLEVBQUFDLGVBQUEsRUFBQUMsY0FBQSxFQUFBQyxrQkFBQSxFQUFBQyxtQ0FBQTs7QUFBQTtBQUNDTCxpQkFBUyxJQUFJakIsVUFBVXVCLGFBQWQsQ0FBNEI7QUFDcENDLHFCQUFXLFNBRHlCO0FBRXBDQyxrQkFBUSxpQkFGNEI7QUFHcENDLG9CQUFVLEVBSDBCO0FBSXBDQyx1QkFBYXBCLFFBQVFDLEdBQVIsQ0FBWW9CLFdBSlc7QUFLcENDLGtCQUFRdEIsUUFBUUMsR0FBUixDQUFZc0IsTUFMZ0I7QUFNcENDLG9CQUFVLE1BTjBCO0FBT3BDQyxzQkFBWSxNQVB3QjtBQVFwQ0MsMEJBQWdCLEtBQUssSUFSZTtBQVNwQ0Msd0JBQWMsR0FUc0I7QUFXcENDLDZCQUFtQixFQVhpQjtBQVlwQ0MsNEJBQWtCLEVBWmtCO0FBY3BDQyxnQ0FBc0IsS0FkYztBQWdCcENDLG9CQUFVO0FBQ1RDLHFCQUFTLEtBREE7QUFFVEMsNkJBQWlCO0FBRlIsV0FoQjBCO0FBcUJwQ0MsMkJBQWlCLEtBckJtQjtBQXVCcENDLG9CQUFVO0FBQ1RDLHNCQUFVLFlBREQ7QUFFVEMseUJBQWE7QUFGSixXQXZCMEI7QUE0QnBDQyxvQkFBVTtBQUNUTixxQkFBUyxLQURBO0FBRVRPLHlCQUFhLEVBRko7QUFHVEMsMEJBQWM7QUFITCxXQTVCMEI7QUFpQ3BDQyxxQkFBVyxJQWpDeUI7QUFrQ3BDQyx3QkFBYyxJQWxDc0I7QUFtQ3BDQyxtQkFBUztBQUNSWCxxQkFBUyxLQUREO0FBRVJZLHNCQUFVO0FBQ1RDLG9CQUFNLFNBREc7QUFFVEMsdUJBQVM7QUFDUkMsd0JBQVEsSUFEQTtBQUVSQyx3QkFBUSxJQUZBO0FBR1JDLHVCQUFPLEdBSEM7QUFJUkMsNEJBQVk7QUFKSjtBQUZBO0FBRkYsV0FuQzJCO0FBK0NwQ0Msd0NBQThCO0FBL0NNLFNBQTVCLENBQVQ7QUFrREF0Qyx5QkFBaUJILE9BQU8wQyxhQUFQLENBQXFCO0FBQ3JDQyxnQkFBTSxnQkFEK0I7QUFFckNwQyxxQkFBVyxTQUYwQjtBQUdyQ3FDLGtCQUFRLENBQUMxRCxjQUFEO0FBSDZCLFNBQXJCLENBQWpCO0FBT0FnQiwwQkFBa0JGLE9BQU8wQyxhQUFQLENBQXFCO0FBQ3RDQyxnQkFBTSxpQkFEZ0M7QUFFdENDLGtCQUFRLENBQUNoRSxlQUFELENBRjhCO0FBR3RDUSxvQkFBVTtBQUg0QixTQUFyQixDQUFsQjtBQU9BVyxxQkFBYUMsT0FBTzBDLGFBQVAsQ0FBcUI7QUFDakNDLGdCQUFNLEtBRDJCO0FBRWpDQyxrQkFBUSxDQUFDakUsVUFBRCxDQUZ5QjtBQUdqQ1Msb0JBQVU7QUFDVHlELGtCQUFNO0FBREc7QUFIdUIsU0FBckIsQ0FBYjtBQVFBN0QsaUJBQVM4RCxnQkFBVCxDQUEwQjlDLE1BQTFCO0FBQ0FJLDZCQUFxQnBCLFNBQVMrRCxtQkFBOUI7QUFDQTFDLDhDQUFzQ0wsT0FBTzBDLGFBQVAsQ0FBcUI7QUFDMURDLGdCQUFNLGtCQURvRDtBQUUxREMsa0JBQVEsQ0FBQzNELGFBQUQsQ0FGa0Q7QUFHMURHLG9CQUFVO0FBQUU0RCx5QkFBYTtBQUN4QjdELG9CQUFNaUI7QUFEa0I7QUFBZjtBQUhnRCxTQUFyQixDQUF0QztBQ3JCSSxlRDZCSlAsT0FBT29ELFNBQVAsQ0FBaUIsVUFBQ0MsRUFBRDtBQzVCWCxpQkQ2QkxsRCxPQUFPbUQsS0FBUCxHQUFlQyxJQUFmLENBQW9CO0FBQ25CLGdCQUFHLENBQUNwRCxPQUFPcUQsT0FBWDtBQUNDckQscUJBQU9zRCxlQUFQLENBQXVCakQsbUNBQXZCO0FDNUJNOztBRDhCUGtELG1CQUFPQyxlQUFQLENBQXVCQyxHQUF2QixDQUEyQixHQUEzQixFQUFnQzFELFdBQVcyRCxPQUFYLEVBQWhDO0FDNUJNLG1CRGdDTjFELE9BQU8yRCxlQUFQLENBQXVCdEQsb0NBQW9Dc0MsSUFBM0QsRUFBaUVTLElBQWpFLENBQXNFLFVBQUNRLE9BQUQsRUFBVUMsTUFBVjtBQy9COUQscUJEZ0NQeEUsWUFBWXlFLElBQVosQ0FBaUIxRSxRQUFqQixFQUEyQmdFLElBQTNCLENBQWdDO0FDL0J2Qix1QkRnQ1JGLEdBQUdXLE1BQUgsRUFBV0QsT0FBWCxDQ2hDUTtBRCtCVCxnQkNoQ087QUQrQlIsY0NoQ007QUR3QlAsWUM3Qks7QUQ0Qk4sWUM3Qkk7QUR0REwsZUFBQUcsS0FBQTtBQWlHTTlELGFBQUE4RCxLQUFBO0FDNUJELGVENkJKQyxRQUFRRCxLQUFSLENBQWMsUUFBZCxFQUF1QjlELEVBQXZCLENDN0JJO0FBQ0Q7QUR2RUw7QUFwQ0Y7QUFBQSxTQUFBOEQsS0FBQTtBQXdJTWpGLE1BQUFpRixLQUFBO0FBQ0xDLFVBQVFELEtBQVIsQ0FBYyxRQUFkLEVBQXVCakYsQ0FBdkI7QUN4QkEsQzs7Ozs7Ozs7Ozs7O0FDakhELElBQUFtRixLQUFBO0FBQUEvRixRQUFRZ0csSUFBUixHQUFlO0FBQ2RDLE9BQUssSUFBSUMsUUFBUUMsVUFBWixFQURTO0FBRWRDLFVBQVEsSUFBSUYsUUFBUUMsVUFBWjtBQUZNLENBQWY7QUFLQW5HLFFBQVFxRyxTQUFSLEdBQW9CO0FBQ25CakcsUUFBTSxFQURhO0FBRW5CSCxXQUFTO0FBRlUsQ0FBcEI7QUFLQTBCLE9BQU9DLE9BQVAsQ0FBZTtBQUNkMEUsZUFBYUMsYUFBYixDQUEyQjtBQUFDQyxxQkFBaUJDLE1BQU1DLFFBQU4sQ0FBZUQsTUFBTUUsS0FBTixDQUFZQyxRQUFaLEVBQXNCQyxNQUF0QixDQUFmO0FBQWxCLEdBQTNCO0FBQ0FQLGVBQWFDLGFBQWIsQ0FBMkI7QUFBQ08scUJBQWlCTCxNQUFNQyxRQUFOLENBQWVELE1BQU1FLEtBQU4sQ0FBWUMsUUFBWixFQUFzQkMsTUFBdEIsQ0FBZjtBQUFsQixHQUEzQjtBQ09DLFNETkRQLGFBQWFDLGFBQWIsQ0FBMkI7QUFBQ1Esb0JBQWdCTixNQUFNQyxRQUFOLENBQWVELE1BQU1FLEtBQU4sQ0FBWUMsUUFBWixFQUFzQkMsTUFBdEIsQ0FBZjtBQUFqQixHQUEzQixDQ01DO0FEVEY7O0FBTUEsSUFBR2xGLE9BQU9xRixRQUFWO0FBQ0NqQixVQUFReEUsUUFBUSxRQUFSLENBQVI7O0FBQ0F2QixVQUFRaUgsZ0JBQVIsR0FBMkIsVUFBQ0MsR0FBRCxFQUFNQyxXQUFOO0FDU3hCLFdEUkZwQixNQUFNO0FDU0YsYURSSC9GLFFBQVFvSCxXQUFSLENBQW9CRixHQUFwQixFQUF5QkMsV0FBekIsQ0NRRztBRFRKLE9BRUVFLEdBRkYsRUNRRTtBRFR3QixHQUEzQjtBQ2FBOztBRFJEckgsUUFBUW9ILFdBQVIsR0FBc0IsVUFBQ0YsR0FBRCxFQUFNQyxXQUFOO0FBQ3JCLE1BQUcsQ0FBQ0EsV0FBSjtBQUNDQSxrQkFBY0QsSUFBSXpDLElBQWxCO0FDV0M7O0FEVEYsTUFBRyxDQUFDeUMsSUFBSUksVUFBUjtBQUNDSixRQUFJSSxVQUFKLEdBQWlCLEVBQWpCO0FDV0M7O0FEVEYsTUFBR0osSUFBSUssS0FBUDtBQUNDSixrQkFBY25ILFFBQVF3SCxpQkFBUixDQUEwQk4sR0FBMUIsQ0FBZDtBQ1dDOztBRFZGLE1BQUdDLGdCQUFlLHNCQUFsQjtBQUNDQSxrQkFBYyxzQkFBZDtBQUNBRCxVQUFNTyxFQUFFQyxLQUFGLENBQVFSLEdBQVIsQ0FBTjtBQUNBQSxRQUFJekMsSUFBSixHQUFXMEMsV0FBWDtBQUNBbkgsWUFBUUMsT0FBUixDQUFnQmtILFdBQWhCLElBQStCRCxHQUEvQjtBQ1lDOztBRFZGbEgsVUFBUTJILGFBQVIsQ0FBc0JULEdBQXRCO0FBQ0EsTUFBSWxILFFBQVE0SCxNQUFaLENBQW1CVixHQUFuQjtBQUVBbEgsVUFBUTZILFlBQVIsQ0FBcUJWLFdBQXJCO0FBQ0FuSCxVQUFROEgsYUFBUixDQUFzQlgsV0FBdEI7QUFDQSxTQUFPRCxHQUFQO0FBcEJxQixDQUF0Qjs7QUFzQkFsSCxRQUFRK0gsYUFBUixHQUF3QixVQUFDM0IsTUFBRDtBQUN2QixNQUFHQSxPQUFPbUIsS0FBVjtBQUNDLFdBQU8sT0FBS25CLE9BQU9tQixLQUFaLEdBQWtCLEdBQWxCLEdBQXFCbkIsT0FBTzNCLElBQW5DO0FDWUM7O0FEWEYsU0FBTzJCLE9BQU8zQixJQUFkO0FBSHVCLENBQXhCOztBQUtBekUsUUFBUWdJLFNBQVIsR0FBb0IsVUFBQ2IsV0FBRCxFQUFjYyxRQUFkO0FBQ25CLE1BQUFDLEdBQUEsRUFBQUMsSUFBQTs7QUFBQSxNQUFHVixFQUFFVyxPQUFGLENBQVVqQixXQUFWLENBQUg7QUFDQztBQ2VDOztBRGRGLE1BQUd4RixPQUFPMEcsUUFBVjtBQ2dCRyxRQUFJLENBQUNILE1BQU1sSSxRQUFRZ0csSUFBZixLQUF3QixJQUE1QixFQUFrQztBQUNoQyxVQUFJLENBQUNtQyxPQUFPRCxJQUFJOUIsTUFBWixLQUF1QixJQUEzQixFQUFpQztBQUMvQitCLGFEakJnQkcsTUNpQmhCO0FBQ0Q7QURuQk47QUNxQkU7O0FEbkJGLE1BQUcsQ0FBQ25CLFdBQUQsSUFBaUJ4RixPQUFPMEcsUUFBM0I7QUFDQ2xCLGtCQUFjb0IsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQ3FCQzs7QURmRixNQUFHckIsV0FBSDtBQVdDLFdBQU9uSCxRQUFReUksYUFBUixDQUFzQnRCLFdBQXRCLENBQVA7QUNPQztBRDlCaUIsQ0FBcEI7O0FBeUJBbkgsUUFBUTBJLGFBQVIsR0FBd0IsVUFBQ0MsU0FBRDtBQUN2QixTQUFPbEIsRUFBRW1CLFNBQUYsQ0FBWTVJLFFBQVF5SSxhQUFwQixFQUFtQztBQUFDSSxTQUFLRjtBQUFOLEdBQW5DLENBQVA7QUFEdUIsQ0FBeEI7O0FBR0EzSSxRQUFROEksWUFBUixHQUF1QixVQUFDM0IsV0FBRDtBQUN0QnJCLFVBQVFpRCxHQUFSLENBQVksY0FBWixFQUE0QjVCLFdBQTVCO0FBQ0EsU0FBT25ILFFBQVFDLE9BQVIsQ0FBZ0JrSCxXQUFoQixDQUFQO0FDWUMsU0RYRCxPQUFPbkgsUUFBUXlJLGFBQVIsQ0FBc0J0QixXQUF0QixDQ1dOO0FEZHFCLENBQXZCOztBQUtBbkgsUUFBUWdKLGFBQVIsR0FBd0IsVUFBQzdCLFdBQUQsRUFBYzhCLE9BQWQ7QUFDdkIsTUFBQWYsR0FBQTs7QUFBQSxNQUFHLENBQUNmLFdBQUo7QUFDQ0Esa0JBQWNvQixRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDY0M7O0FEYkYsTUFBR3JCLFdBQUg7QUFDQyxXQUFPbkgsUUFBUUUsV0FBUixDQUFvQixFQUFBZ0ksTUFBQWxJLFFBQUFnSSxTQUFBLENBQUFiLFdBQUEsRUFBQThCLE9BQUEsYUFBQWYsSUFBeUNnQixnQkFBekMsR0FBeUMsTUFBekMsS0FBNkQvQixXQUFqRixDQUFQO0FDZUM7QURuQnFCLENBQXhCOztBQU1BbkgsUUFBUW1KLGdCQUFSLEdBQTJCLFVBQUNoQyxXQUFEO0FDaUJ6QixTRGhCRCxPQUFPbkgsUUFBUUUsV0FBUixDQUFvQmlILFdBQXBCLENDZ0JOO0FEakJ5QixDQUEzQjs7QUFHQW5ILFFBQVFvSixZQUFSLEdBQXVCLFVBQUNILE9BQUQsRUFBVUksTUFBVjtBQUN0QixNQUFBbkIsR0FBQSxFQUFBQyxJQUFBLEVBQUFaLEtBQUE7O0FBQUEsTUFBRzVGLE9BQU8wRyxRQUFWO0FBQ0MsUUFBRyxDQUFDWSxPQUFKO0FBQ0NBLGdCQUFVVixRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWO0FDbUJFOztBRGxCSCxRQUFHLENBQUNhLE1BQUo7QUFDQ0EsZUFBUzFILE9BQU8wSCxNQUFQLEVBQVQ7QUFKRjtBQ3lCRTs7QURuQkY5QixVQUFBLENBQUFXLE1BQUFsSSxRQUFBZ0ksU0FBQSx1QkFBQUcsT0FBQUQsSUFBQW5JLEVBQUEsWUFBQW9JLEtBQXlDbUIsT0FBekMsQ0FBaURMLE9BQWpELEVBQXlEO0FBQUNNLFlBQU87QUFBQ0MsY0FBTztBQUFSO0FBQVIsR0FBekQsSUFBUSxNQUFSLEdBQVEsTUFBUjs7QUFDQSxNQUFBakMsU0FBQSxPQUFHQSxNQUFPaUMsTUFBVixHQUFVLE1BQVY7QUFDQyxXQUFPakMsTUFBTWlDLE1BQU4sQ0FBYUMsT0FBYixDQUFxQkosTUFBckIsS0FBZ0MsQ0FBdkM7QUN5QkM7QURsQ29CLENBQXZCOztBQVlBckosUUFBUTBKLGVBQVIsR0FBMEIsVUFBQ0MsUUFBRCxFQUFXQyxPQUFYLEVBQW9CMUYsT0FBcEI7QUFFekIsTUFBRyxDQUFDdUQsRUFBRW9DLFFBQUYsQ0FBV0YsUUFBWCxDQUFKO0FBQ0MsV0FBT0EsUUFBUDtBQ3lCQzs7QUR2QkYsTUFBRzNKLFFBQVE4SixRQUFSLENBQWlCQyxZQUFqQixDQUE4QkosUUFBOUIsQ0FBSDtBQUNDLFdBQU8zSixRQUFROEosUUFBUixDQUFpQnpDLEdBQWpCLENBQXFCc0MsUUFBckIsRUFBK0JDLE9BQS9CLEVBQXdDMUYsT0FBeEMsQ0FBUDtBQ3lCQzs7QUR2QkYsU0FBT3lGLFFBQVA7QUFSeUIsQ0FBMUI7O0FBVUEzSixRQUFRZ0ssZUFBUixHQUEwQixVQUFDQyxPQUFELEVBQVVMLE9BQVY7QUFDekIsTUFBQU0sUUFBQTtBQUFBQSxhQUFXLEVBQVg7O0FBQ0F6QyxJQUFFMEMsSUFBRixDQUFPRixPQUFQLEVBQWdCLFVBQUNHLE1BQUQ7QUFDZixRQUFBQyxNQUFBLEVBQUE1RixJQUFBLEVBQUE2RixLQUFBOztBQUFBLFNBQUFGLFVBQUEsT0FBR0EsT0FBUUcsTUFBWCxHQUFXLE1BQVgsTUFBcUIsQ0FBckI7QUFDQzlGLGFBQU8yRixPQUFPLENBQVAsQ0FBUDtBQUNBQyxlQUFTRCxPQUFPLENBQVAsQ0FBVDtBQUNBRSxjQUFRdEssUUFBUTBKLGVBQVIsQ0FBd0JVLE9BQU8sQ0FBUCxDQUF4QixFQUFtQ1IsT0FBbkMsQ0FBUjtBQUNBTSxlQUFTekYsSUFBVCxJQUFpQixFQUFqQjtBQzRCRyxhRDNCSHlGLFNBQVN6RixJQUFULEVBQWU0RixNQUFmLElBQXlCQyxLQzJCdEI7QUFDRDtBRGxDSjs7QUFRQSxTQUFPSixRQUFQO0FBVnlCLENBQTFCOztBQVlBbEssUUFBUXdLLGFBQVIsR0FBd0IsVUFBQ3ZCLE9BQUQ7QUFDdkIsU0FBT0EsWUFBVyxRQUFsQjtBQUR1QixDQUF4QixDLENBR0E7Ozs7Ozs7QUFNQWpKLFFBQVF5SyxrQkFBUixHQUE2QixVQUFDQyxJQUFELEVBQU9DLEdBQVAsRUFBWUMsTUFBWixFQUFvQkMsU0FBcEI7QUFFNUIsTUFBQUMsTUFBQTs7QUFBQSxNQUFHLENBQUNGLE1BQUo7QUFDQ0EsYUFBUyxLQUFUO0FDaUNDOztBRC9CRixNQUFHQyxTQUFIO0FBR0NDLGFBQVNKLEtBQUtLLFdBQUwsQ0FBaUJILE1BQWpCLENBQVQ7QUFFQSxXQUFPbkQsRUFBRXVELE1BQUYsQ0FBU04sSUFBVCxFQUFlLFVBQUNPLEdBQUQ7QUFDbkIsVUFBQUMsTUFBQTs7QUFBQUEsZUFBU1AsSUFBSWxCLE9BQUosQ0FBWXdCLElBQUlMLE1BQUosQ0FBWixDQUFUOztBQUNBLFVBQUdNLFNBQVMsQ0FBQyxDQUFiO0FBQ0MsZUFBT0EsTUFBUDtBQUREO0FBR0MsZUFBT1AsSUFBSUosTUFBSixHQUFhOUMsRUFBRWdDLE9BQUYsQ0FBVXFCLE1BQVYsRUFBa0JHLElBQUlMLE1BQUosQ0FBbEIsQ0FBcEI7QUMrQkM7QURwQ0UsTUFBUDtBQUxEO0FBWUMsV0FBT25ELEVBQUV1RCxNQUFGLENBQVNOLElBQVQsRUFBZSxVQUFDTyxHQUFEO0FBQ3JCLGFBQU9OLElBQUlsQixPQUFKLENBQVl3QixJQUFJTCxNQUFKLENBQVosQ0FBUDtBQURNLE1BQVA7QUNtQ0M7QURwRDBCLENBQTdCLEMsQ0FvQkE7Ozs7O0FBSUE1SyxRQUFRbUwsYUFBUixHQUF3QixVQUFDQyxNQUFELEVBQVNDLE1BQVQ7QUFDdkIsTUFBQUMsYUFBQSxFQUFBQyxhQUFBLEVBQUFDLE1BQUE7O0FBQUEsTUFBRyxLQUFLQyxHQUFSO0FBQ0NMLGFBQVNBLE9BQU8sS0FBS0ssR0FBWixDQUFUO0FBQ0FKLGFBQVNBLE9BQU8sS0FBS0ksR0FBWixDQUFUO0FDdUNDOztBRHRDRixNQUFHTCxrQkFBa0JNLElBQXJCO0FBQ0NOLGFBQVNBLE9BQU9PLE9BQVAsRUFBVDtBQ3dDQzs7QUR2Q0YsTUFBR04sa0JBQWtCSyxJQUFyQjtBQUNDTCxhQUFTQSxPQUFPTSxPQUFQLEVBQVQ7QUN5Q0M7O0FEeENGLE1BQUcsT0FBT1AsTUFBUCxLQUFpQixRQUFqQixJQUE4QixPQUFPQyxNQUFQLEtBQWlCLFFBQWxEO0FBQ0MsV0FBT0QsU0FBU0MsTUFBaEI7QUMwQ0M7O0FEeENGQyxrQkFBZ0JGLFdBQVUsSUFBVixJQUFrQkEsV0FBVSxNQUE1QztBQUNBRyxrQkFBZ0JGLFdBQVUsSUFBVixJQUFrQkEsV0FBVSxNQUE1Qzs7QUFDQSxNQUFHQyxpQkFBa0IsQ0FBQ0MsYUFBdEI7QUFDQyxXQUFPLENBQUMsQ0FBUjtBQzBDQzs7QUR6Q0YsTUFBR0QsaUJBQWtCQyxhQUFyQjtBQUNDLFdBQU8sQ0FBUDtBQzJDQzs7QUQxQ0YsTUFBRyxDQUFDRCxhQUFELElBQW1CQyxhQUF0QjtBQUNDLFdBQU8sQ0FBUDtBQzRDQzs7QUQzQ0ZDLFdBQVNJLFFBQVFKLE1BQVIsRUFBVDtBQUNBLFNBQU9KLE9BQU9TLFFBQVAsR0FBa0JDLGFBQWxCLENBQWdDVCxPQUFPUSxRQUFQLEVBQWhDLEVBQW1ETCxNQUFuRCxDQUFQO0FBcEJ1QixDQUF4Qjs7QUF3QkF4TCxRQUFRK0wsaUJBQVIsR0FBNEIsVUFBQzVFLFdBQUQ7QUFDM0IsTUFBQTZFLE9BQUEsRUFBQUMsV0FBQSxFQUFBQyxXQUFBLEVBQUFDLGNBQUEsRUFBQUMsZUFBQTs7QUFBQSxNQUFHekssT0FBTzBHLFFBQVY7QUFDQyxRQUFHLENBQUNsQixXQUFKO0FBQ0NBLG9CQUFjb0IsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQUZGO0FDZ0RFOztBRDVDRjRELG9CQUFrQixFQUFsQjtBQUdBSixZQUFVaE0sUUFBUUMsT0FBUixDQUFnQmtILFdBQWhCLENBQVY7O0FBQ0EsTUFBRyxDQUFDNkUsT0FBSjtBQUNDLFdBQU9JLGVBQVA7QUM0Q0M7O0FEMUNGRixnQkFBY0YsUUFBUUUsV0FBdEI7O0FBQ0EsTUFBR3ZLLE9BQU8wRyxRQUFQLElBQW1CLENBQUNaLEVBQUU0RSxPQUFGLENBQVVILFdBQVYsQ0FBdkI7QUFDQ0MscUJBQWlCLEVBQWpCOztBQUNBMUUsTUFBRTBDLElBQUYsQ0FBTytCLFdBQVAsRUFBb0IsVUFBQ0ksT0FBRDtBQUNuQixVQUFHN0UsRUFBRThFLFFBQUYsQ0FBV0QsT0FBWCxDQUFIO0FDNENLLGVEM0NKSCxlQUFlRyxRQUFRRSxVQUF2QixJQUFxQyxFQzJDakM7QUQ1Q0w7QUM4Q0ssZUQzQ0pMLGVBQWVHLE9BQWYsSUFBMEIsRUMyQ3RCO0FBQ0Q7QURoREw7O0FBS0E3RSxNQUFFMEMsSUFBRixDQUFPbkssUUFBUUMsT0FBZixFQUF3QixVQUFDd00sY0FBRCxFQUFpQkMsbUJBQWpCO0FDOENwQixhRDdDSGpGLEVBQUUwQyxJQUFGLENBQU9zQyxlQUFlbEQsTUFBdEIsRUFBOEIsVUFBQ29ELGFBQUQsRUFBZ0JDLGtCQUFoQjtBQUM3QixZQUFHLENBQUNELGNBQWMxSSxJQUFkLEtBQXNCLGVBQXRCLElBQXlDMEksY0FBYzFJLElBQWQsS0FBc0IsUUFBaEUsS0FBOEUwSSxjQUFjRSxZQUE1RixJQUE2R0YsY0FBY0UsWUFBZCxLQUE4QjFGLFdBQTNJLElBQTJKZ0YsZUFBZU8sbUJBQWYsQ0FBOUo7QUFFQyxjQUFHakYsRUFBRTRFLE9BQUYsQ0FBVUYsZUFBZU8sbUJBQWYsS0FBdUNDLGNBQWMxSSxJQUFkLEtBQXNCLGVBQXZFLENBQUg7QUM2Q08sbUJENUNOa0ksZUFBZU8sbUJBQWYsSUFBc0M7QUFBRXZGLDJCQUFhdUYsbUJBQWY7QUFBb0NJLDJCQUFhRixrQkFBakQ7QUFBcUVHLDBDQUE0QkosY0FBY0k7QUFBL0csYUM0Q2hDO0FEL0NSO0FDcURLO0FEdEROLFFDNkNHO0FEOUNKOztBQU1BLFFBQUdaLGVBQWUsV0FBZixDQUFIO0FBQ0NBLHFCQUFlLFdBQWYsSUFBOEI7QUFBRWhGLHFCQUFhLFdBQWY7QUFBNEIyRixxQkFBYTtBQUF6QyxPQUE5QjtBQ3dERTs7QUR2REgsUUFBR1gsZUFBZSxXQUFmLENBQUg7QUFDQ0EscUJBQWUsV0FBZixJQUE4QjtBQUFFaEYscUJBQWEsV0FBZjtBQUE0QjJGLHFCQUFhO0FBQXpDLE9BQTlCO0FDNERFOztBRDNESHJGLE1BQUUwQyxJQUFGLENBQU8sQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixRQUFuQixFQUE2QixXQUE3QixDQUFQLEVBQWtELFVBQUM2QyxhQUFEO0FBQ2pELFVBQUdiLGVBQWVhLGFBQWYsQ0FBSDtBQzZESyxlRDVESmIsZUFBZWEsYUFBZixJQUFnQztBQUFFN0YsdUJBQWE2RixhQUFmO0FBQThCRix1QkFBYTtBQUEzQyxTQzRENUI7QUFJRDtBRGxFTDs7QUFHQSxRQUFHWCxlQUFlLGVBQWYsQ0FBSDtBQUVDRixvQkFBY2pNLFFBQVFpTixjQUFSLENBQXVCOUYsV0FBdkIsQ0FBZDs7QUFDQSxVQUFHNkUsUUFBUWtCLFlBQVIsS0FBQWpCLGVBQUEsT0FBd0JBLFlBQWFrQixnQkFBckMsR0FBcUMsTUFBckMsQ0FBSDtBQUNDaEIsdUJBQWUsZUFBZixJQUFrQztBQUFFaEYsdUJBQVksZUFBZDtBQUErQjJGLHVCQUFhO0FBQTVDLFNBQWxDO0FBSkY7QUN5RUc7O0FEcEVIVixzQkFBa0IzRSxFQUFFcUQsTUFBRixDQUFTcUIsY0FBVCxDQUFsQjtBQUNBLFdBQU9DLGVBQVA7QUNzRUM7O0FEcEVGLE1BQUdKLFFBQVFvQixZQUFYO0FBQ0NoQixvQkFBZ0JpQixJQUFoQixDQUFxQjtBQUFDbEcsbUJBQVksV0FBYjtBQUEwQjJGLG1CQUFhO0FBQXZDLEtBQXJCO0FDeUVDOztBRHZFRnJGLElBQUUwQyxJQUFGLENBQU9uSyxRQUFRQyxPQUFmLEVBQXdCLFVBQUN3TSxjQUFELEVBQWlCQyxtQkFBakI7QUFDdkIsUUFBQVksY0FBQTs7QUFBQSxRQUFHWix3QkFBdUIsc0JBQTFCO0FBRUNZLHVCQUFpQnROLFFBQVFnSSxTQUFSLENBQWtCLHNCQUFsQixDQUFqQjtBQUNBc0YseUJBQWtCYixpQkFBaUJhLGNBQW5DO0FDeUVFOztBQUNELFdEekVGN0YsRUFBRTBDLElBQUYsQ0FBT3NDLGVBQWVsRCxNQUF0QixFQUE4QixVQUFDb0QsYUFBRCxFQUFnQkMsa0JBQWhCO0FBQzdCLFVBQUcsQ0FBQ0QsY0FBYzFJLElBQWQsS0FBc0IsZUFBdEIsSUFBMEMwSSxjQUFjMUksSUFBZCxLQUFzQixRQUF0QixJQUFrQzBJLGNBQWNULFdBQTNGLEtBQTZHUyxjQUFjRSxZQUEzSCxJQUE0SUYsY0FBY0UsWUFBZCxLQUE4QjFGLFdBQTdLO0FBQ0MsWUFBR3VGLHdCQUF1QixlQUExQjtBQzBFTSxpQkR4RUxOLGdCQUFnQm1CLE1BQWhCLENBQXVCLENBQXZCLEVBQTBCLENBQTFCLEVBQTZCO0FBQUNwRyx5QkFBWXVGLG1CQUFiO0FBQWtDSSx5QkFBYUY7QUFBL0MsV0FBN0IsQ0N3RUs7QUQxRU47QUMrRU0saUJEM0VMUixnQkFBZ0JpQixJQUFoQixDQUFxQjtBQUFDbEcseUJBQVl1RixtQkFBYjtBQUFrQ0kseUJBQWFGLGtCQUEvQztBQUFtRUcsd0NBQTRCSixjQUFjSTtBQUE3RyxXQUFyQixDQzJFSztBRGhGUDtBQ3NGSTtBRHZGTCxNQ3lFRTtBRDlFSDs7QUFhQSxNQUFHZixRQUFRd0IsWUFBWDtBQUNDcEIsb0JBQWdCaUIsSUFBaEIsQ0FBcUI7QUFBQ2xHLG1CQUFZLE9BQWI7QUFBc0IyRixtQkFBYTtBQUFuQyxLQUFyQjtBQ3NGQzs7QURyRkYsTUFBR2QsUUFBUXlCLFlBQVg7QUFDQ3JCLG9CQUFnQmlCLElBQWhCLENBQXFCO0FBQUNsRyxtQkFBWSxPQUFiO0FBQXNCMkYsbUJBQWE7QUFBbkMsS0FBckI7QUMwRkM7O0FEekZGLE1BQUdkLFFBQVEwQixhQUFYO0FBQ0N0QixvQkFBZ0JpQixJQUFoQixDQUFxQjtBQUFDbEcsbUJBQVksUUFBYjtBQUF1QjJGLG1CQUFhO0FBQXBDLEtBQXJCO0FDOEZDOztBRDdGRixNQUFHZCxRQUFRMkIsZ0JBQVg7QUFDQ3ZCLG9CQUFnQmlCLElBQWhCLENBQXFCO0FBQUNsRyxtQkFBWSxXQUFiO0FBQTBCMkYsbUJBQWE7QUFBdkMsS0FBckI7QUNrR0M7O0FEakdGLE1BQUdkLFFBQVE0QixnQkFBWDtBQUNDeEIsb0JBQWdCaUIsSUFBaEIsQ0FBcUI7QUFBQ2xHLG1CQUFZLFdBQWI7QUFBMEIyRixtQkFBYTtBQUF2QyxLQUFyQjtBQ3NHQzs7QURyR0YsTUFBR2QsUUFBUTZCLGNBQVg7QUFDQ3pCLG9CQUFnQmlCLElBQWhCLENBQXFCO0FBQUNsRyxtQkFBWSwwQkFBYjtBQUF5QzJGLG1CQUFhO0FBQXRELEtBQXJCO0FDMEdDOztBRHhHRixNQUFHbkwsT0FBTzBHLFFBQVY7QUFDQzRELGtCQUFjak0sUUFBUWlOLGNBQVIsQ0FBdUI5RixXQUF2QixDQUFkOztBQUNBLFFBQUc2RSxRQUFRa0IsWUFBUixLQUFBakIsZUFBQSxPQUF3QkEsWUFBYWtCLGdCQUFyQyxHQUFxQyxNQUFyQyxDQUFIO0FBQ0NmLHNCQUFnQmlCLElBQWhCLENBQXFCO0FBQUNsRyxxQkFBWSxlQUFiO0FBQThCMkYscUJBQWE7QUFBM0MsT0FBckI7QUFIRjtBQ2lIRTs7QUQ1R0YsU0FBT1YsZUFBUDtBQTNFMkIsQ0FBNUI7O0FBNkVBcE0sUUFBUThOLGNBQVIsR0FBeUIsVUFBQ3pFLE1BQUQsRUFBU0osT0FBVCxFQUFrQjhFLFlBQWxCO0FBQ3hCLE1BQUFDLFlBQUEsRUFBQTlGLEdBQUEsRUFBQStGLGNBQUEsRUFBQUMsRUFBQSxFQUFBQyxRQUFBOztBQUFBLE1BQUd4TSxPQUFPMEcsUUFBVjtBQUNDLFdBQU9ySSxRQUFRZ08sWUFBZjtBQUREO0FBR0MsUUFBRyxFQUFFM0UsVUFBV0osT0FBYixDQUFIO0FBQ0MsWUFBTSxJQUFJdEgsT0FBT3lNLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsbUZBQXRCLENBQU47QUFDQSxhQUFPLElBQVA7QUNnSEU7O0FEL0dIRCxlQUFXO0FBQUMxSixZQUFNLENBQVA7QUFBVTRKLGNBQVEsQ0FBbEI7QUFBcUJDLGdCQUFVLENBQS9CO0FBQWtDQyxhQUFPLENBQXpDO0FBQTRDQyxlQUFTLENBQXJEO0FBQXdEQyxvQkFBYyxDQUF0RTtBQUF5RWxILGFBQU8sQ0FBaEY7QUFBbUZtSCxrQkFBWSxDQUEvRjtBQUFrR0MsbUJBQWE7QUFBL0csS0FBWDtBQUVBVCxTQUFLbE8sUUFBUUUsV0FBUixDQUFvQixhQUFwQixFQUFtQ29KLE9BQW5DLENBQTJDO0FBQUMvQixhQUFPMEIsT0FBUjtBQUFpQjJGLFlBQU12RjtBQUF2QixLQUEzQyxFQUEyRTtBQUFDRSxjQUFRNEU7QUFBVCxLQUEzRSxDQUFMOztBQUNBLFFBQUcsQ0FBQ0QsRUFBSjtBQUNDakYsZ0JBQVUsSUFBVjtBQytIRTs7QUQ1SEgsUUFBRyxDQUFDQSxPQUFKO0FBQ0MsVUFBRzhFLFlBQUg7QUFDQ0csYUFBS2xPLFFBQVFFLFdBQVIsQ0FBb0IsYUFBcEIsRUFBbUNvSixPQUFuQyxDQUEyQztBQUFDc0YsZ0JBQU12RjtBQUFQLFNBQTNDLEVBQTJEO0FBQUNFLGtCQUFRNEU7QUFBVCxTQUEzRCxDQUFMOztBQUNBLFlBQUcsQ0FBQ0QsRUFBSjtBQUNDLGlCQUFPLElBQVA7QUNrSUk7O0FEaklMakYsa0JBQVVpRixHQUFHM0csS0FBYjtBQUpEO0FBTUMsZUFBTyxJQUFQO0FBUEY7QUMySUc7O0FEbElIeUcsbUJBQWUsRUFBZjtBQUNBQSxpQkFBYTNFLE1BQWIsR0FBc0JBLE1BQXRCO0FBQ0EyRSxpQkFBYS9FLE9BQWIsR0FBdUJBLE9BQXZCO0FBQ0ErRSxpQkFBYVksSUFBYixHQUFvQjtBQUNuQi9GLFdBQUtRLE1BRGM7QUFFbkI1RSxZQUFNeUosR0FBR3pKLElBRlU7QUFHbkI0SixjQUFRSCxHQUFHRyxNQUhRO0FBSW5CQyxnQkFBVUosR0FBR0ksUUFKTTtBQUtuQkMsYUFBT0wsR0FBR0ssS0FMUztBQU1uQkMsZUFBU04sR0FBR00sT0FOTztBQU9uQkUsa0JBQVlSLEdBQUdRLFVBUEk7QUFRbkJDLG1CQUFhVCxHQUFHUztBQVJHLEtBQXBCO0FBVUFWLHFCQUFBLENBQUEvRixNQUFBbEksUUFBQWdKLGFBQUEsNkJBQUFkLElBQXlEb0IsT0FBekQsQ0FBaUU0RSxHQUFHTyxZQUFwRSxJQUFpQixNQUFqQjs7QUFDQSxRQUFHUixjQUFIO0FBQ0NELG1CQUFhWSxJQUFiLENBQWtCSCxZQUFsQixHQUFpQztBQUNoQzVGLGFBQUtvRixlQUFlcEYsR0FEWTtBQUVoQ3BFLGNBQU13SixlQUFleEosSUFGVztBQUdoQ29LLGtCQUFVWixlQUFlWTtBQUhPLE9BQWpDO0FDd0lFOztBRG5JSCxXQUFPYixZQUFQO0FDcUlDO0FEaExzQixDQUF6Qjs7QUE2Q0FoTyxRQUFROE8sY0FBUixHQUF5QixVQUFDQyxHQUFEO0FBRXhCLE1BQUd0SCxFQUFFdUgsVUFBRixDQUFhcEQsUUFBUXFELFNBQXJCLEtBQW1DckQsUUFBUXFELFNBQVIsRUFBbkMsS0FBMEQsQ0FBQUYsT0FBQSxPQUFDQSxJQUFLRyxVQUFMLENBQWdCLFNBQWhCLENBQUQsR0FBQyxNQUFELE1BQUNILE9BQUEsT0FBOEJBLElBQUtHLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBOUIsR0FBOEIsTUFBL0IsTUFBQ0gsT0FBQSxPQUEyREEsSUFBS0csVUFBTCxDQUFnQixXQUFoQixDQUEzRCxHQUEyRCxNQUE1RCxDQUExRCxDQUFIO0FBQ0MsUUFBRyxDQUFDLE1BQU1DLElBQU4sQ0FBV0osR0FBWCxDQUFKO0FBQ0NBLFlBQU0sTUFBTUEsR0FBWjtBQ3NJRTs7QURySUgsV0FBT0EsR0FBUDtBQ3VJQzs7QURySUYsTUFBR0EsR0FBSDtBQUVDLFFBQUcsQ0FBQyxNQUFNSSxJQUFOLENBQVdKLEdBQVgsQ0FBSjtBQUNDQSxZQUFNLE1BQU1BLEdBQVo7QUNzSUU7O0FEcklILFdBQU9LLDBCQUEwQkMsb0JBQTFCLEdBQWlETixHQUF4RDtBQUpEO0FBTUMsV0FBT0ssMEJBQTBCQyxvQkFBakM7QUN1SUM7QURwSnNCLENBQXpCOztBQWVBclAsUUFBUXNQLGdCQUFSLEdBQTJCLFVBQUNqRyxNQUFELEVBQVNKLE9BQVQ7QUFDMUIsTUFBQWlGLEVBQUE7QUFBQTdFLFdBQVNBLFVBQVUxSCxPQUFPMEgsTUFBUCxFQUFuQjs7QUFDQSxNQUFHMUgsT0FBTzBHLFFBQVY7QUFDQ1ksY0FBVUEsV0FBV1YsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBckI7QUFERDtBQUdDLFFBQUcsQ0FBQ1MsT0FBSjtBQUNDLFlBQU0sSUFBSXRILE9BQU95TSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGNBQXRCLENBQU47QUFKRjtBQytJRTs7QUQxSUZGLE9BQUtsTyxRQUFRZ0osYUFBUixDQUFzQixhQUF0QixFQUFxQ00sT0FBckMsQ0FBNkM7QUFBQy9CLFdBQU8wQixPQUFSO0FBQWlCMkYsVUFBTXZGO0FBQXZCLEdBQTdDLEVBQTZFO0FBQUNFLFlBQVE7QUFBQ21GLGtCQUFXO0FBQVo7QUFBVCxHQUE3RSxDQUFMO0FBQ0EsU0FBT1IsR0FBR1EsVUFBVjtBQVIwQixDQUEzQjs7QUFVQTFPLFFBQVF1UCxpQkFBUixHQUE0QixVQUFDbEcsTUFBRCxFQUFTSixPQUFUO0FBQzNCLE1BQUFpRixFQUFBO0FBQUE3RSxXQUFTQSxVQUFVMUgsT0FBTzBILE1BQVAsRUFBbkI7O0FBQ0EsTUFBRzFILE9BQU8wRyxRQUFWO0FBQ0NZLGNBQVVBLFdBQVdWLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQXJCO0FBREQ7QUFHQyxRQUFHLENBQUNTLE9BQUo7QUFDQyxZQUFNLElBQUl0SCxPQUFPeU0sS0FBWCxDQUFpQixHQUFqQixFQUFzQixjQUF0QixDQUFOO0FBSkY7QUMwSkU7O0FEckpGRixPQUFLbE8sUUFBUWdKLGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNNLE9BQXJDLENBQTZDO0FBQUMvQixXQUFPMEIsT0FBUjtBQUFpQjJGLFVBQU12RjtBQUF2QixHQUE3QyxFQUE2RTtBQUFDRSxZQUFRO0FBQUNvRixtQkFBWTtBQUFiO0FBQVQsR0FBN0UsQ0FBTDtBQUNBLFNBQUFULE1BQUEsT0FBT0EsR0FBSVMsV0FBWCxHQUFXLE1BQVg7QUFSMkIsQ0FBNUI7O0FBVUEzTyxRQUFRd1Asa0JBQVIsR0FBNkIsVUFBQ0MsRUFBRDtBQUM1QixNQUFHQSxHQUFHQyxXQUFOO0FBQ0NELE9BQUdFLFNBQUgsR0FBZSxJQUFmO0FDK0pDOztBRDlKRixNQUFHRixHQUFHRyxTQUFOO0FBQ0NILE9BQUdFLFNBQUgsR0FBZSxJQUFmO0FDZ0tDOztBRC9KRixNQUFHRixHQUFHSSxXQUFOO0FBQ0NKLE9BQUdHLFNBQUgsR0FBZSxJQUFmO0FBQ0FILE9BQUdFLFNBQUgsR0FBZSxJQUFmO0FDaUtDOztBRGhLRixNQUFHRixHQUFHSyxjQUFOO0FBQ0NMLE9BQUdFLFNBQUgsR0FBZSxJQUFmO0FDa0tDOztBRGpLRixNQUFHRixHQUFHdEMsZ0JBQU47QUFDQ3NDLE9BQUdFLFNBQUgsR0FBZSxJQUFmO0FBQ0FGLE9BQUdHLFNBQUgsR0FBZSxJQUFmO0FBQ0FILE9BQUdJLFdBQUgsR0FBaUIsSUFBakI7QUFDQUosT0FBR0ssY0FBSCxHQUFvQixJQUFwQjtBQ21LQzs7QURsS0YsTUFBR0wsR0FBR00sa0JBQU47QUFDQ04sT0FBR0UsU0FBSCxHQUFlLElBQWY7QUNvS0M7O0FEbktGLE1BQUdGLEdBQUdPLG9CQUFOO0FBQ0NQLE9BQUdFLFNBQUgsR0FBZSxJQUFmO0FBQ0FGLE9BQUdHLFNBQUgsR0FBZSxJQUFmO0FBQ0FILE9BQUdJLFdBQUgsR0FBaUIsSUFBakI7QUFDQUosT0FBR00sa0JBQUgsR0FBd0IsSUFBeEI7QUNxS0M7O0FEbEtGLE1BQUdOLEdBQUdFLFNBQU47QUFDQyxXQUFPRixHQUFHUSxjQUFWLEtBQTRCLFNBQTVCLEtBQXlDUixHQUFHUSxjQUFILEdBQW9CLElBQTdEO0FBQ0EsV0FBT1IsR0FBR1MsWUFBVixLQUEwQixTQUExQixLQUF1Q1QsR0FBR1MsWUFBSCxHQUFrQixJQUF6RDtBQ29LQzs7QURuS0YsTUFBR1QsR0FBR0csU0FBTjtBQUNDLFdBQU9ILEdBQUdVLGdCQUFWLEtBQThCLFNBQTlCLEtBQTJDVixHQUFHVSxnQkFBSCxHQUFzQixJQUFqRTtBQUNBLFdBQU9WLEdBQUdXLGNBQVYsS0FBNEIsU0FBNUIsS0FBeUNYLEdBQUdXLGNBQUgsR0FBb0IsSUFBN0Q7QUFDQSxXQUFPWCxHQUFHWSxnQkFBVixLQUE4QixTQUE5QixLQUEyQ1osR0FBR1ksZ0JBQUgsR0FBc0IsSUFBakU7QUNxS0M7O0FEcEtGLE1BQUdaLEdBQUd0QyxnQkFBTjtBQUNDLFdBQU9zQyxHQUFHYSxjQUFWLEtBQTRCLFNBQTVCLEtBQXlDYixHQUFHYSxjQUFILEdBQW9CLElBQTdEO0FDc0tDOztBRHBLRixNQUFHYixHQUFHVSxnQkFBTjtBQUNDVixPQUFHUSxjQUFILEdBQW9CLElBQXBCO0FDc0tDOztBRHJLRixNQUFHUixHQUFHVyxjQUFOO0FBQ0NYLE9BQUdRLGNBQUgsR0FBb0IsSUFBcEI7QUN1S0M7O0FEdEtGLE1BQUdSLEdBQUdZLGdCQUFOO0FBQ0NaLE9BQUdXLGNBQUgsR0FBb0IsSUFBcEI7QUFDQVgsT0FBR1EsY0FBSCxHQUFvQixJQUFwQjtBQ3dLQzs7QUR2S0YsTUFBR1IsR0FBR1MsWUFBTjtBQUNDVCxPQUFHUSxjQUFILEdBQW9CLElBQXBCO0FDeUtDOztBRHhLRixNQUFHUixHQUFHYSxjQUFOO0FBQ0NiLE9BQUdRLGNBQUgsR0FBb0IsSUFBcEI7QUFDQVIsT0FBR1csY0FBSCxHQUFvQixJQUFwQjtBQUNBWCxPQUFHWSxnQkFBSCxHQUFzQixJQUF0QjtBQUNBWixPQUFHUyxZQUFILEdBQWtCLElBQWxCO0FDMEtDOztBRHhLRixTQUFPVCxFQUFQO0FBakQ0QixDQUE3Qjs7QUFtREF6UCxRQUFRdVEsa0JBQVIsR0FBNkI7QUFDNUIsTUFBQXJJLEdBQUE7QUFBQSxVQUFBQSxNQUFBdkcsT0FBQVQsUUFBQSxzQkFBQWdILElBQStCc0ksZUFBL0IsR0FBK0IsTUFBL0I7QUFENEIsQ0FBN0I7O0FBR0F4USxRQUFReVEsb0JBQVIsR0FBK0I7QUFDOUIsTUFBQXZJLEdBQUE7QUFBQSxVQUFBQSxNQUFBdkcsT0FBQVQsUUFBQSxzQkFBQWdILElBQStCd0ksaUJBQS9CLEdBQStCLE1BQS9CO0FBRDhCLENBQS9COztBQUdBMVEsUUFBUTJRLGVBQVIsR0FBMEIsVUFBQzFILE9BQUQ7QUFDekIsTUFBQWYsR0FBQTs7QUFBQSxNQUFHZSxXQUFBLEVBQUFmLE1BQUF2RyxPQUFBVCxRQUFBLHNCQUFBZ0gsSUFBbUNzSSxlQUFuQyxHQUFtQyxNQUFuQyxNQUFzRHZILE9BQXpEO0FBQ0MsV0FBTyxJQUFQO0FDZ0xDOztBRC9LRixTQUFPLEtBQVA7QUFIeUIsQ0FBMUI7O0FBS0FqSixRQUFRNFEsaUJBQVIsR0FBNEIsVUFBQzNILE9BQUQ7QUFDM0IsTUFBQWYsR0FBQTs7QUFBQSxNQUFHZSxXQUFBLEVBQUFmLE1BQUF2RyxPQUFBVCxRQUFBLHNCQUFBZ0gsSUFBbUN3SSxpQkFBbkMsR0FBbUMsTUFBbkMsTUFBd0R6SCxPQUEzRDtBQUNDLFdBQU8sSUFBUDtBQ21MQzs7QURsTEYsU0FBTyxLQUFQO0FBSDJCLENBQTVCOztBQUtBLElBQUd0SCxPQUFPcUYsUUFBVjtBQUNDaEgsVUFBUTZRLGlCQUFSLEdBQTRCelAsUUFBUUMsR0FBUixDQUFZeVAsbUJBQXhDO0FDcUxBLEM7Ozs7Ozs7Ozs7OztBQzdrQkRuUCxPQUFPb1AsT0FBUCxDQUVDO0FBQUEsNEJBQTBCLFVBQUM3TSxPQUFEO0FBQ3pCLFFBQUE4TSxVQUFBLEVBQUFwUSxDQUFBLEVBQUFxUSxjQUFBLEVBQUE3SyxNQUFBLEVBQUE4SyxhQUFBLEVBQUFDLEtBQUEsRUFBQUMsYUFBQSxFQUFBQyxPQUFBLEVBQUFuSixHQUFBLEVBQUFDLElBQUEsRUFBQW1KLE9BQUEsRUFBQUMsZUFBQSxFQUFBQyxRQUFBLEVBQUFDLElBQUE7O0FBQUEsUUFBQXZOLFdBQUEsUUFBQWdFLE1BQUFoRSxRQUFBd04sTUFBQSxZQUFBeEosSUFBb0IyRSxZQUFwQixHQUFvQixNQUFwQixHQUFvQixNQUFwQjtBQUVDekcsZUFBU3BHLFFBQVFnSSxTQUFSLENBQWtCOUQsUUFBUXdOLE1BQVIsQ0FBZTdFLFlBQWpDLEVBQStDM0ksUUFBUXdOLE1BQVIsQ0FBZW5LLEtBQTlELENBQVQ7QUFFQTBKLHVCQUFpQjdLLE9BQU91TCxjQUF4QjtBQUVBUixjQUFRLEVBQVI7O0FBQ0EsVUFBR2pOLFFBQVF3TixNQUFSLENBQWVuSyxLQUFsQjtBQUNDNEosY0FBTTVKLEtBQU4sR0FBY3JELFFBQVF3TixNQUFSLENBQWVuSyxLQUE3QjtBQUVBa0ssZUFBQXZOLFdBQUEsT0FBT0EsUUFBU3VOLElBQWhCLEdBQWdCLE1BQWhCO0FBRUFELG1CQUFBLENBQUF0TixXQUFBLE9BQVdBLFFBQVNzTixRQUFwQixHQUFvQixNQUFwQixLQUFnQyxFQUFoQztBQUVBTix3QkFBQSxDQUFBaE4sV0FBQSxPQUFnQkEsUUFBU2dOLGFBQXpCLEdBQXlCLE1BQXpCLEtBQTBDLEVBQTFDOztBQUVBLFlBQUdoTixRQUFRME4sVUFBWDtBQUNDTCw0QkFBa0IsRUFBbEI7QUFDQUEsMEJBQWdCTixjQUFoQixJQUFrQztBQUFDWSxvQkFBUTNOLFFBQVEwTjtBQUFqQixXQUFsQztBQ0pJOztBRE1MLFlBQUExTixXQUFBLFFBQUFpRSxPQUFBakUsUUFBQTRHLE1BQUEsWUFBQTNDLEtBQW9Cb0MsTUFBcEIsR0FBb0IsTUFBcEIsR0FBb0IsTUFBcEI7QUFDQyxjQUFHckcsUUFBUTBOLFVBQVg7QUFDQ1Qsa0JBQU1XLEdBQU4sR0FBWSxDQUFDO0FBQUNqSixtQkFBSztBQUFDa0oscUJBQUs3TixRQUFRNEc7QUFBZDtBQUFOLGFBQUQsRUFBK0J5RyxlQUEvQixDQUFaO0FBREQ7QUFHQ0osa0JBQU1XLEdBQU4sR0FBWSxDQUFDO0FBQUNqSixtQkFBSztBQUFDa0oscUJBQUs3TixRQUFRNEc7QUFBZDtBQUFOLGFBQUQsQ0FBWjtBQUpGO0FBQUE7QUFNQyxjQUFHNUcsUUFBUTBOLFVBQVg7QUFDQ25LLGNBQUV1SyxNQUFGLENBQVNiLEtBQVQsRUFBZ0JJLGVBQWhCO0FDU0s7O0FEUk5KLGdCQUFNdEksR0FBTixHQUFZO0FBQUNvSixrQkFBTVQ7QUFBUCxXQUFaO0FDWUk7O0FEVkxSLHFCQUFhNUssT0FBT3JHLEVBQXBCOztBQUVBLFlBQUdtRSxRQUFRZ08sV0FBWDtBQUNDekssWUFBRXVLLE1BQUYsQ0FBU2IsS0FBVCxFQUFnQmpOLFFBQVFnTyxXQUF4QjtBQ1dJOztBRFRMZCx3QkFBZ0I7QUFBQ2UsaUJBQU9qQjtBQUFSLFNBQWhCOztBQUVBLFlBQUdPLFFBQVFoSyxFQUFFOEUsUUFBRixDQUFXa0YsSUFBWCxDQUFYO0FBQ0NMLHdCQUFjSyxJQUFkLEdBQXFCQSxJQUFyQjtBQ1lJOztBRFZMLFlBQUdULFVBQUg7QUFDQztBQUNDSyxzQkFBVUwsV0FBV29CLElBQVgsQ0FBZ0JqQixLQUFoQixFQUF1QkMsYUFBdkIsRUFBc0NpQixLQUF0QyxFQUFWO0FBQ0FmLHNCQUFVLEVBQVY7O0FBQ0E3SixjQUFFMEMsSUFBRixDQUFPa0gsT0FBUCxFQUFnQixVQUFDaUIsTUFBRDtBQ1lSLHFCRFhQaEIsUUFBUWpFLElBQVIsQ0FDQztBQUFBa0YsdUJBQU9ELE9BQU9yQixjQUFQLENBQVA7QUFDQTNHLHVCQUFPZ0ksT0FBT3pKO0FBRGQsZUFERCxDQ1dPO0FEWlI7O0FBSUEsbUJBQU95SSxPQUFQO0FBUEQsbUJBQUF6TCxLQUFBO0FBUU1qRixnQkFBQWlGLEtBQUE7QUFDTCxrQkFBTSxJQUFJbEUsT0FBT3lNLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0J4TixFQUFFNFIsT0FBRixHQUFZLEtBQVosR0FBb0JDLEtBQUtDLFNBQUwsQ0FBZXhPLE9BQWYsQ0FBMUMsQ0FBTjtBQVZGO0FBakNEO0FBUEQ7QUNvRUc7O0FEakJILFdBQU8sRUFBUDtBQXBERDtBQUFBLENBRkQsRTs7Ozs7Ozs7Ozs7O0FFQUF5TyxXQUFXQyxHQUFYLENBQWUsTUFBZixFQUF1QixnQ0FBdkIsRUFBeUQsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVg7QUFDeEQsTUFBQUMsR0FBQSxFQUFBaEMsVUFBQSxFQUFBaUMsZUFBQSxFQUFBQyxpQkFBQSxFQUFBdFMsQ0FBQSxFQUFBdVMsTUFBQSxFQUFBQyxRQUFBLEVBQUFDLEdBQUEsRUFBQUMsS0FBQSxFQUFBbk0sV0FBQSxFQUFBOEUsV0FBQSxFQUFBc0gsU0FBQSxFQUFBQyxZQUFBLEVBQUF0TCxHQUFBLEVBQUFDLElBQUEsRUFBQXNMLElBQUEsRUFBQUMsSUFBQSxFQUFBQyxJQUFBLEVBQUFwTSxLQUFBLEVBQUEwQixPQUFBLEVBQUFoQixRQUFBLEVBQUEyTCxXQUFBLEVBQUFDLFlBQUEsRUFBQUMsU0FBQTs7QUFBQTtBQUNDWix3QkFBb0JhLGNBQWNDLG1CQUFkLENBQWtDbkIsR0FBbEMsQ0FBcEI7QUFDQUksc0JBQWtCQyxrQkFBa0JySyxHQUFwQztBQUVBdUssZUFBV1AsSUFBSW9CLElBQWY7QUFDQTlNLGtCQUFjaU0sU0FBU2pNLFdBQXZCO0FBQ0FvTSxnQkFBWUgsU0FBU0csU0FBckI7QUFDQXRMLGVBQVdtTCxTQUFTbkwsUUFBcEI7QUFFQWlNLFVBQU0vTSxXQUFOLEVBQW1CTixNQUFuQjtBQUNBcU4sVUFBTVgsU0FBTixFQUFpQjFNLE1BQWpCO0FBQ0FxTixVQUFNak0sUUFBTixFQUFnQnBCLE1BQWhCO0FBRUF5TSxZQUFRVCxJQUFJbkIsTUFBSixDQUFXeUMsVUFBbkI7QUFDQUwsZ0JBQVlqQixJQUFJMUIsS0FBSixDQUFVLFdBQVYsQ0FBWjtBQUNBMEMsbUJBQWVoQixJQUFJMUIsS0FBSixDQUFVLGNBQVYsQ0FBZjtBQUVBcUMsbUJBQWUsR0FBZjtBQUNBSCxVQUFNclQsUUFBUWdKLGFBQVIsQ0FBc0IsV0FBdEIsRUFBbUNNLE9BQW5DLENBQTJDZ0ssS0FBM0MsQ0FBTjs7QUFLQSxRQUFHRCxHQUFIO0FBQ0NMLFlBQU0sRUFBTjtBQUNBL0osZ0JBQVVvSyxJQUFJOUwsS0FBZDtBQUNBNEwsZUFBU0UsSUFBSWUsSUFBYjs7QUFFQSxVQUFHLEVBQUFsTSxNQUFBbUwsSUFBQWdCLFdBQUEsWUFBQW5NLElBQWtCb00sUUFBbEIsQ0FBMkJyQixlQUEzQixJQUFDLE1BQUQsTUFBK0MsQ0FBQTlLLE9BQUFrTCxJQUFBa0IsUUFBQSxZQUFBcE0sS0FBZW1NLFFBQWYsQ0FBd0JyQixlQUF4QixJQUFDLE1BQWhELENBQUg7QUFDQ0QsY0FBTSxPQUFOO0FBREQsYUFFSyxLQUFBUyxPQUFBSixJQUFBbUIsWUFBQSxZQUFBZixLQUFxQmEsUUFBckIsQ0FBOEJyQixlQUE5QixJQUFHLE1BQUg7QUFDSkQsY0FBTSxRQUFOO0FBREksYUFFQSxJQUFHSyxJQUFJb0IsS0FBSixLQUFhLE9BQWIsSUFBeUJwQixJQUFJcUIsU0FBSixLQUFpQnpCLGVBQTdDO0FBQ0pELGNBQU0sT0FBTjtBQURJLGFBRUEsSUFBR0ssSUFBSW9CLEtBQUosS0FBYSxTQUFiLEtBQTRCcEIsSUFBSXFCLFNBQUosS0FBaUJ6QixlQUFqQixJQUFvQ0ksSUFBSXNCLFNBQUosS0FBaUIxQixlQUFqRixDQUFIO0FBQ0pELGNBQU0sU0FBTjtBQURJLGFBRUEsSUFBR0ssSUFBSW9CLEtBQUosS0FBYSxXQUFiLElBQTZCcEIsSUFBSXFCLFNBQUosS0FBaUJ6QixlQUFqRDtBQUNKRCxjQUFNLFdBQU47QUFESTtBQUlKL0csc0JBQWMySSxrQkFBa0JDLGtCQUFsQixDQUFxQzFCLE1BQXJDLEVBQTZDRixlQUE3QyxDQUFkO0FBQ0ExTCxnQkFBUXhILEdBQUcrVSxNQUFILENBQVV4TCxPQUFWLENBQWtCTCxPQUFsQixFQUEyQjtBQUFFTSxrQkFBUTtBQUFFQyxvQkFBUTtBQUFWO0FBQVYsU0FBM0IsQ0FBUjs7QUFDQSxZQUFHeUMsWUFBWXFJLFFBQVosQ0FBcUIsT0FBckIsS0FBaUNySSxZQUFZcUksUUFBWixDQUFxQixTQUFyQixDQUFqQyxJQUFvRS9NLE1BQU1pQyxNQUFOLENBQWE4SyxRQUFiLENBQXNCckIsZUFBdEIsQ0FBdkU7QUFDQ0QsZ0JBQU0sU0FBTjtBQVBHO0FDSUQ7O0FESUpZLG9CQUFBLENBQUFGLE9BQUEvUixPQUFBVCxRQUFBLFdBQUE2VCxXQUFBLGFBQUFwQixPQUFBRCxLQUFBc0IsUUFBQSxZQUFBckIsS0FBNEQ1RSxHQUE1RCxHQUE0RCxNQUE1RCxHQUE0RCxNQUE1RDs7QUFDQSxVQUFHaUUsR0FBSDtBQUNDUSx1QkFBZSxDQUFDSSxlQUFlLEVBQWhCLEtBQXNCLG9CQUFrQjNLLE9BQWxCLEdBQTBCLEdBQTFCLEdBQTZCK0osR0FBN0IsR0FBaUMsR0FBakMsR0FBb0NNLEtBQXBDLEdBQTBDLGFBQTFDLEdBQXVEUSxTQUF2RCxHQUFpRSxnQkFBakUsR0FBaUZELFlBQXZHLENBQWY7QUFERDtBQUdDTCx1QkFBZSxDQUFDSSxlQUFlLEVBQWhCLEtBQXNCLG9CQUFrQjNLLE9BQWxCLEdBQTBCLFNBQTFCLEdBQW1DcUssS0FBbkMsR0FBeUMsNEVBQXpDLEdBQXFIUSxTQUFySCxHQUErSCxnQkFBL0gsR0FBK0lELFlBQXJLLENBQWY7QUNGRzs7QURJSmxCLGlCQUFXc0MsVUFBWCxDQUFzQm5DLEdBQXRCLEVBQTJCO0FBQzFCb0MsY0FBTSxHQURvQjtBQUUxQkMsY0FBTTtBQUFFM0Isd0JBQWNBO0FBQWhCO0FBRm9CLE9BQTNCO0FBM0JEO0FBaUNDeEMsbUJBQWFoUixRQUFRZ0osYUFBUixDQUFzQjdCLFdBQXRCLEVBQW1DYyxRQUFuQyxDQUFiOztBQUNBLFVBQUcrSSxVQUFIO0FBQ0NBLG1CQUFXb0UsTUFBWCxDQUFrQjdCLFNBQWxCLEVBQTZCO0FBQzVCOEIsa0JBQVE7QUFDUCx5QkFBYSxDQUROO0FBRVAsOEJBQWtCLENBRlg7QUFHUCxzQkFBVTtBQUhIO0FBRG9CLFNBQTdCO0FBUUEsY0FBTSxJQUFJMVQsT0FBT3lNLEtBQVgsQ0FBaUIsT0FBakIsRUFBMEIsUUFBMUIsQ0FBTjtBQTNDRjtBQXZCRDtBQUFBLFdBQUF2SSxLQUFBO0FBb0VNakYsUUFBQWlGLEtBQUE7QUNBSCxXRENGOE0sV0FBV3NDLFVBQVgsQ0FBc0JuQyxHQUF0QixFQUEyQjtBQUMxQm9DLFlBQU0sR0FEb0I7QUFFMUJDLFlBQU07QUFBRUcsZ0JBQVEsQ0FBQztBQUFFQyx3QkFBYzNVLEVBQUU0VSxNQUFGLElBQVk1VSxFQUFFNFI7QUFBOUIsU0FBRDtBQUFWO0FBRm9CLEtBQTNCLENDREU7QUFVRDtBRC9FSCxHOzs7Ozs7Ozs7Ozs7QUVBQXhTLFFBQVF5VixtQkFBUixHQUE4QixVQUFDdE8sV0FBRCxFQUFjdU8sT0FBZDtBQUM3QixNQUFBQyxPQUFBLEVBQUFDLFVBQUEsRUFBQUMsa0JBQUEsRUFBQTNOLEdBQUE7O0FBQUF5TixZQUFBLENBQUF6TixNQUFBbEksUUFBQThWLFNBQUEsQ0FBQTNPLFdBQUEsYUFBQWUsSUFBMEN5TixPQUExQyxHQUEwQyxNQUExQztBQUNBQyxlQUFhLENBQWI7O0FBQ0EsTUFBR0QsT0FBSDtBQUNDbE8sTUFBRTBDLElBQUYsQ0FBT3VMLE9BQVAsRUFBZ0IsVUFBQ0ssVUFBRDtBQUNmLFVBQUFDLEtBQUEsRUFBQUMsT0FBQSxFQUFBOU4sSUFBQSxFQUFBc0wsSUFBQTtBQUFBdUMsY0FBUXZPLEVBQUV5TyxJQUFGLENBQU9QLE9BQVAsRUFBZ0JJLFVBQWhCLENBQVI7QUFDQUUsZ0JBQUEsQ0FBQTlOLE9BQUE2TixNQUFBRCxVQUFBLGNBQUF0QyxPQUFBdEwsS0FBQWdPLFFBQUEsWUFBQTFDLEtBQXVDd0MsT0FBdkMsR0FBdUMsTUFBdkMsR0FBdUMsTUFBdkM7O0FBQ0EsVUFBR0EsT0FBSDtBQ0dLLGVERkpMLGNBQWMsQ0NFVjtBREhMO0FDS0ssZURGSkEsY0FBYyxDQ0VWO0FBQ0Q7QURUTDs7QUFRQUMseUJBQXFCLE1BQU1ELFVBQTNCO0FBQ0EsV0FBT0Msa0JBQVA7QUNJQztBRGpCMkIsQ0FBOUI7O0FBZUE3VixRQUFRb1csY0FBUixHQUF5QixVQUFDalAsV0FBRCxFQUFjNE8sVUFBZDtBQUN4QixNQUFBSixPQUFBLEVBQUFLLEtBQUEsRUFBQUMsT0FBQSxFQUFBL04sR0FBQSxFQUFBQyxJQUFBOztBQUFBd04sWUFBVTNWLFFBQVE4VixTQUFSLENBQWtCM08sV0FBbEIsRUFBK0J3TyxPQUF6Qzs7QUFDQSxNQUFHQSxPQUFIO0FBQ0NLLFlBQVF2TyxFQUFFeU8sSUFBRixDQUFPUCxPQUFQLEVBQWdCSSxVQUFoQixDQUFSO0FBQ0FFLGNBQUEsQ0FBQS9OLE1BQUE4TixNQUFBRCxVQUFBLGNBQUE1TixPQUFBRCxJQUFBaU8sUUFBQSxZQUFBaE8sS0FBdUM4TixPQUF2QyxHQUF1QyxNQUF2QyxHQUF1QyxNQUF2QztBQUNBLFdBQU9BLE9BQVA7QUNPQztBRFpzQixDQUF6Qjs7QUFPQWpXLFFBQVFxVyxlQUFSLEdBQTBCLFVBQUNsUCxXQUFELEVBQWNtUCxZQUFkLEVBQTRCWixPQUE1QjtBQUN6QixNQUFBeE8sR0FBQSxFQUFBZ0IsR0FBQSxFQUFBQyxJQUFBLEVBQUFzTCxJQUFBLEVBQUE4QyxPQUFBLEVBQUE5RSxJQUFBO0FBQUE4RSxZQUFBLENBQUFyTyxNQUFBbEksUUFBQUUsV0FBQSxhQUFBaUksT0FBQUQsSUFBQWhILFFBQUEsWUFBQWlILEtBQXlDbUIsT0FBekMsQ0FBaUQ7QUFBQ25DLGlCQUFhQSxXQUFkO0FBQTJCb00sZUFBVztBQUF0QyxHQUFqRCxJQUFVLE1BQVYsR0FBVSxNQUFWO0FBQ0FyTSxRQUFNbEgsUUFBUWdJLFNBQVIsQ0FBa0JiLFdBQWxCLENBQU47QUFDQXVPLFlBQVVqTyxFQUFFK08sR0FBRixDQUFNZCxPQUFOLEVBQWUsVUFBQ2UsTUFBRDtBQUN4QixRQUFBVCxLQUFBO0FBQUFBLFlBQVE5TyxJQUFJcUMsTUFBSixDQUFXa04sTUFBWCxDQUFSOztBQUNBLFNBQUFULFNBQUEsT0FBR0EsTUFBTy9SLElBQVYsR0FBVSxNQUFWLEtBQW1CLENBQUMrUixNQUFNVSxNQUExQjtBQUNDLGFBQU9ELE1BQVA7QUFERDtBQUdDLGFBQU8sTUFBUDtBQ2NFO0FEbkJNLElBQVY7QUFNQWYsWUFBVWpPLEVBQUVrUCxPQUFGLENBQVVqQixPQUFWLENBQVY7O0FBQ0EsTUFBR2EsV0FBWUEsUUFBUXJWLFFBQXZCO0FBQ0N1USxXQUFBLEVBQUFnQyxPQUFBOEMsUUFBQXJWLFFBQUEsQ0FBQW9WLFlBQUEsYUFBQTdDLEtBQXVDaEMsSUFBdkMsR0FBdUMsTUFBdkMsS0FBK0MsRUFBL0M7QUFDQUEsV0FBT2hLLEVBQUUrTyxHQUFGLENBQU0vRSxJQUFOLEVBQVksVUFBQ21GLEtBQUQ7QUFDbEIsVUFBQUMsS0FBQSxFQUFBcEwsR0FBQTtBQUFBQSxZQUFNbUwsTUFBTSxDQUFOLENBQU47QUFDQUMsY0FBUXBQLEVBQUVnQyxPQUFGLENBQVVpTSxPQUFWLEVBQW1CakssR0FBbkIsQ0FBUjtBQUNBbUwsWUFBTSxDQUFOLElBQVdDLFFBQVEsQ0FBbkI7QUFDQSxhQUFPRCxLQUFQO0FBSk0sTUFBUDtBQUtBLFdBQU9uRixJQUFQO0FDa0JDOztBRGpCRixTQUFPLEVBQVA7QUFsQnlCLENBQTFCOztBQXFCQXpSLFFBQVE4SCxhQUFSLEdBQXdCLFVBQUNYLFdBQUQ7QUFDdkIsTUFBQXVPLE9BQUEsRUFBQW9CLHFCQUFBLEVBQUFDLGFBQUEsRUFBQTNRLE1BQUEsRUFBQXdRLEtBQUEsRUFBQTFPLEdBQUE7QUFBQTlCLFdBQVNwRyxRQUFRZ0ksU0FBUixDQUFrQmIsV0FBbEIsQ0FBVDtBQUNBdU8sWUFBVTFWLFFBQVFnWCx1QkFBUixDQUFnQzdQLFdBQWhDLEtBQWdELENBQUMsTUFBRCxDQUExRDtBQUNBNFAsa0JBQWdCLENBQUMsT0FBRCxDQUFoQjtBQUNBRCwwQkFBd0I5VyxRQUFRaVgsNEJBQVIsQ0FBcUM5UCxXQUFyQyxLQUFxRCxDQUFDLE9BQUQsQ0FBN0U7O0FBQ0EsTUFBRzJQLHFCQUFIO0FBQ0NDLG9CQUFnQnRQLEVBQUV5UCxLQUFGLENBQVFILGFBQVIsRUFBdUJELHFCQUF2QixDQUFoQjtBQ29CQzs7QURsQkZGLFVBQVE1VyxRQUFRbVgsb0JBQVIsQ0FBNkJoUSxXQUE3QixLQUE2QyxFQUFyRDs7QUFDQSxNQUFHeEYsT0FBTzBHLFFBQVY7QUNvQkcsV0FBTyxDQUFDSCxNQUFNbEksUUFBUW9YLGtCQUFmLEtBQXNDLElBQXRDLEdBQTZDbFAsSURuQjFCZixXQ21CMEIsSURuQlgsRUNtQmxDLEdEbkJrQyxNQ21CekM7QUFDRDtBRDlCcUIsQ0FBeEI7O0FBWUFuSCxRQUFRcVgsZUFBUixHQUEwQixVQUFDQyxZQUFELEVBQWVDLFNBQWYsRUFBMEJDLGNBQTFCO0FBQ3pCLE1BQUFDLGVBQUEsRUFBQUMsc0JBQUEsRUFBQUMsS0FBQTtBQUFBRixvQkFBQUgsZ0JBQUEsT0FBa0JBLGFBQWM1QixPQUFoQyxHQUFnQyxNQUFoQztBQUNBZ0MsMkJBQUFKLGdCQUFBLE9BQXlCQSxhQUFjTSxjQUF2QyxHQUF1QyxNQUF2Qzs7QUFDQSxPQUFPTCxTQUFQO0FBQ0M7QUN1QkM7O0FEdEJGSSxVQUFRbFEsRUFBRUMsS0FBRixDQUFRNlAsU0FBUixDQUFSOztBQUNBLE1BQUcsQ0FBQzlQLEVBQUVvUSxHQUFGLENBQU1GLEtBQU4sRUFBYSxNQUFiLENBQUo7QUFDQ0EsVUFBTWxULElBQU4sR0FBYStTLGNBQWI7QUN3QkM7O0FEdkJGLE1BQUcsQ0FBQ0csTUFBTWpDLE9BQVY7QUFDQyxRQUFHK0IsZUFBSDtBQUNDRSxZQUFNakMsT0FBTixHQUFnQitCLGVBQWhCO0FBRkY7QUM0QkU7O0FEekJGLE1BQUcsQ0FBQ0UsTUFBTWpDLE9BQVY7QUFDQ2lDLFVBQU1qQyxPQUFOLEdBQWdCLENBQUMsTUFBRCxDQUFoQjtBQzJCQzs7QUQxQkYsTUFBRyxDQUFDaUMsTUFBTUMsY0FBVjtBQUNDLFFBQUdGLHNCQUFIO0FBQ0NDLFlBQU1DLGNBQU4sR0FBdUJGLHNCQUF2QjtBQUZGO0FDK0JFOztBRDNCRixNQUFHL1YsT0FBTzBHLFFBQVY7QUFDQyxRQUFHckksUUFBUTRRLGlCQUFSLENBQTBCckksUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBMUIsS0FBcUQsQ0FBQ2YsRUFBRXFRLE9BQUYsQ0FBVUgsTUFBTWpDLE9BQWhCLEVBQXlCLE9BQXpCLENBQXpEO0FBQ0NpQyxZQUFNakMsT0FBTixDQUFjckksSUFBZCxDQUFtQixPQUFuQjtBQUZGO0FDZ0NFOztBRDNCRixNQUFHLENBQUNzSyxNQUFNSSxZQUFWO0FBRUNKLFVBQU1JLFlBQU4sR0FBcUIsT0FBckI7QUM0QkM7O0FEMUJGLE1BQUcsQ0FBQ3RRLEVBQUVvUSxHQUFGLENBQU1GLEtBQU4sRUFBYSxLQUFiLENBQUo7QUFDQ0EsVUFBTTlPLEdBQU4sR0FBWTJPLGNBQVo7QUFERDtBQUdDRyxVQUFNcEYsS0FBTixHQUFjb0YsTUFBTXBGLEtBQU4sSUFBZWdGLFVBQVU5UyxJQUF2QztBQzRCQzs7QUQxQkYsTUFBR2dELEVBQUVvQyxRQUFGLENBQVc4TixNQUFNelQsT0FBakIsQ0FBSDtBQUNDeVQsVUFBTXpULE9BQU4sR0FBZ0J1TyxLQUFLdUYsS0FBTCxDQUFXTCxNQUFNelQsT0FBakIsQ0FBaEI7QUM0QkM7O0FEMUJGdUQsSUFBRXdRLE9BQUYsQ0FBVU4sTUFBTTFOLE9BQWhCLEVBQXlCLFVBQUNHLE1BQUQsRUFBU2MsTUFBVDtBQUN4QixRQUFHLENBQUN6RCxFQUFFVyxPQUFGLENBQVVnQyxNQUFWLENBQUQsSUFBc0IzQyxFQUFFOEUsUUFBRixDQUFXbkMsTUFBWCxDQUF6QjtBQUNDLFVBQUd6SSxPQUFPcUYsUUFBVjtBQUNDLFlBQUdTLEVBQUV1SCxVQUFGLENBQUE1RSxVQUFBLE9BQWFBLE9BQVFFLEtBQXJCLEdBQXFCLE1BQXJCLENBQUg7QUM0Qk0saUJEM0JMRixPQUFPOE4sTUFBUCxHQUFnQjlOLE9BQU9FLEtBQVAsQ0FBYXVCLFFBQWIsRUMyQlg7QUQ3QlA7QUFBQTtBQUlDLFlBQUdwRSxFQUFFb0MsUUFBRixDQUFBTyxVQUFBLE9BQVdBLE9BQVE4TixNQUFuQixHQUFtQixNQUFuQixDQUFIO0FDNkJNLGlCRDVCTDlOLE9BQU9FLEtBQVAsR0FBZXRLLFFBQU8sTUFBUCxFQUFhLE1BQUlvSyxPQUFPOE4sTUFBWCxHQUFrQixHQUEvQixDQzRCVjtBRGpDUDtBQUREO0FDcUNHO0FEdENKOztBQVFBLFNBQU9QLEtBQVA7QUExQ3lCLENBQTFCOztBQTZDQSxJQUFHaFcsT0FBTzBHLFFBQVY7QUFDQ3JJLFVBQVFtWSxjQUFSLEdBQXlCLFVBQUNoUixXQUFEO0FBQ3hCLFFBQUE2RSxPQUFBLEVBQUFvTSxpQkFBQSxFQUFBQyxJQUFBLEVBQUFDLE9BQUEsRUFBQUMsOEJBQUEsRUFBQXRNLFdBQUEsRUFBQUMsV0FBQSxFQUFBc00sZ0JBQUEsRUFBQUMsa0JBQUEsRUFBQUMsb0JBQUEsRUFBQXRNLGVBQUEsRUFBQW5ELE9BQUEsRUFBQTBQLGlCQUFBLEVBQUF0UCxNQUFBOztBQUFBLFNBQU9sQyxXQUFQO0FBQ0M7QUNrQ0U7O0FEakNIc1IseUJBQXFCLEVBQXJCO0FBQ0FELHVCQUFtQixFQUFuQjtBQUNBRCxxQ0FBaUMsRUFBakM7QUFDQXZNLGNBQVVoTSxRQUFRZ0ksU0FBUixDQUFrQmIsV0FBbEIsQ0FBVjs7QUFDQSxRQUFHNkUsT0FBSDtBQUNDb00sMEJBQW9CcE0sUUFBUTRNLGFBQTVCOztBQUVBLFVBQUduUixFQUFFVyxPQUFGLENBQVVnUSxpQkFBVixDQUFIO0FBQ0MzUSxVQUFFMEMsSUFBRixDQUFPaU8saUJBQVAsRUFBMEIsVUFBQ1MsSUFBRDtBQUN6QixjQUFBQyxXQUFBLEVBQUFDLFlBQUEsRUFBQTdRLEdBQUEsRUFBQUMsSUFBQSxFQUFBNlEsT0FBQSxFQUFBak0sMEJBQUE7QUFBQWdNLHlCQUFlRixLQUFLSSxzQkFBTCxDQUE0QkMsS0FBNUIsQ0FBa0MsR0FBbEMsRUFBdUMsQ0FBdkMsQ0FBZjtBQUNBSix3QkFBY0QsS0FBS0ksc0JBQUwsQ0FBNEJDLEtBQTVCLENBQWtDLEdBQWxDLEVBQXVDLENBQXZDLENBQWQ7QUFDQW5NLHVDQUFBLENBQUE3RSxNQUFBbEksUUFBQWdJLFNBQUEsQ0FBQStRLFlBQUEsY0FBQTVRLE9BQUFELElBQUFxQixNQUFBLENBQUF1UCxXQUFBLGFBQUEzUSxLQUFtRjRFLDBCQUFuRixHQUFtRixNQUFuRixHQUFtRixNQUFuRjtBQUNBaU0sb0JBQ0M7QUFBQTdSLHlCQUFhNFIsWUFBYjtBQUNBckQscUJBQVNtRCxLQUFLTSxXQURkO0FBRUF2Qiw0QkFBZ0JpQixLQUFLTSxXQUZyQjtBQUdBQyxxQkFBU0wsaUJBQWdCLFdBSHpCO0FBSUF2Uyw2QkFBaUJxUyxLQUFLNU8sT0FKdEI7QUFLQXdILGtCQUFNb0gsS0FBS3BILElBTFg7QUFNQTdFLGdDQUFvQmtNLFdBTnBCO0FBT0FPLHFDQUF5QixJQVB6QjtBQVFBdE0sd0NBQTRCQSwwQkFSNUI7QUFTQXdGLG1CQUFPc0csS0FBS3RHLEtBVFo7QUFVQStHLHFCQUFTVCxLQUFLVSxPQVZkO0FBV0FDLHdCQUFZWCxLQUFLVyxVQVhqQjtBQVlBQyx1QkFBV1osS0FBS1k7QUFaaEIsV0FERDtBQ2lESyxpQkRuQ0xsQiwrQkFBK0JsTCxJQUEvQixDQUFvQzJMLE9BQXBDLENDbUNLO0FEckROOztBQW1CQSxlQUFPVCw4QkFBUDtBQ3FDRzs7QURwQ0pyTSxvQkFBY0YsUUFBUUUsV0FBdEI7O0FBQ0EsVUFBRyxDQUFDekUsRUFBRTRFLE9BQUYsQ0FBVUgsV0FBVixDQUFKO0FBQ0N6RSxVQUFFMEMsSUFBRixDQUFPK0IsV0FBUCxFQUFvQixVQUFDd04sU0FBRDtBQUNuQixjQUFBVixPQUFBOztBQUFBLGNBQUd2UixFQUFFOEUsUUFBRixDQUFXbU4sU0FBWCxDQUFIO0FBQ0NWLHNCQUNDO0FBQUE3UiwyQkFBYXVTLFVBQVVsTixVQUF2QjtBQUNBa0osdUJBQVNnRSxVQUFVaEUsT0FEbkI7QUFFQWtDLDhCQUFnQjhCLFVBQVU5QixjQUYxQjtBQUdBd0IsdUJBQVNNLFVBQVVsTixVQUFWLEtBQXdCLFdBSGpDO0FBSUFoRywrQkFBaUJrVCxVQUFVelAsT0FKM0I7QUFLQXdILG9CQUFNaUksVUFBVWpJLElBTGhCO0FBTUE3RSxrQ0FBb0IsRUFOcEI7QUFPQXlNLHVDQUF5QixJQVB6QjtBQVFBOUcscUJBQU9tSCxVQUFVbkgsS0FSakI7QUFTQStHLHVCQUFTSSxVQUFVSixPQVRuQjtBQVVBRyx5QkFBV0MsVUFBVUQ7QUFWckIsYUFERDtBQVlBaEIsK0JBQW1CaUIsVUFBVWxOLFVBQTdCLElBQTJDd00sT0FBM0M7QUN3Q00sbUJEdkNOUixpQkFBaUJuTCxJQUFqQixDQUFzQnFNLFVBQVVsTixVQUFoQyxDQ3VDTTtBRHJEUCxpQkFlSyxJQUFHL0UsRUFBRW9DLFFBQUYsQ0FBVzZQLFNBQVgsQ0FBSDtBQ3dDRSxtQkR2Q05sQixpQkFBaUJuTCxJQUFqQixDQUFzQnFNLFNBQXRCLENDdUNNO0FBQ0Q7QUR6RFA7QUExQkY7QUNzRkc7O0FEekNIcEIsY0FBVSxFQUFWO0FBQ0FsTSxzQkFBa0JwTSxRQUFRMlosaUJBQVIsQ0FBMEJ4UyxXQUExQixDQUFsQjs7QUFDQU0sTUFBRTBDLElBQUYsQ0FBT2lDLGVBQVAsRUFBd0IsVUFBQ3dOLG1CQUFEO0FBQ3ZCLFVBQUFsRSxPQUFBLEVBQUFrQyxjQUFBLEVBQUFoQixLQUFBLEVBQUFvQyxPQUFBLEVBQUFhLGFBQUEsRUFBQWpOLGtCQUFBLEVBQUFILGNBQUEsRUFBQUMsbUJBQUEsRUFBQW9OLGFBQUEsRUFBQS9NLDBCQUFBOztBQUFBLFVBQUcsRUFBQTZNLHVCQUFBLE9BQUNBLG9CQUFxQnpTLFdBQXRCLEdBQXNCLE1BQXRCLENBQUg7QUFDQztBQzRDRzs7QUQzQ0p1Riw0QkFBc0JrTixvQkFBb0J6UyxXQUExQztBQUNBeUYsMkJBQXFCZ04sb0JBQW9COU0sV0FBekM7QUFDQUMsbUNBQTZCNk0sb0JBQW9CN00sMEJBQWpEO0FBQ0FOLHVCQUFpQnpNLFFBQVFnSSxTQUFSLENBQWtCMEUsbUJBQWxCLENBQWpCOztBQUNBLFdBQU9ELGNBQVA7QUFDQztBQzZDRzs7QUQ1Q0ppSixnQkFBVTFWLFFBQVErWiw2QkFBUixDQUFzQ3JOLG1CQUF0QyxLQUE4RCxDQUFDLE1BQUQsQ0FBeEU7QUFDQWdKLGdCQUFVak8sRUFBRXVTLE9BQUYsQ0FBVXRFLE9BQVYsRUFBbUI5SSxrQkFBbkIsQ0FBVjtBQUNBZ0wsdUJBQWlCNVgsUUFBUStaLDZCQUFSLENBQXNDck4sbUJBQXRDLEVBQTJELElBQTNELEtBQW9FLENBQUMsTUFBRCxDQUFyRjtBQUNBa0wsdUJBQWlCblEsRUFBRXVTLE9BQUYsQ0FBVXBDLGNBQVYsRUFBMEJoTCxrQkFBMUIsQ0FBakI7QUFFQWdLLGNBQVE1VyxRQUFRbVgsb0JBQVIsQ0FBNkJ6SyxtQkFBN0IsQ0FBUjtBQUNBb04sc0JBQWdCOVosUUFBUWlhLHNCQUFSLENBQStCckQsS0FBL0IsRUFBc0NsQixPQUF0QyxDQUFoQjs7QUFFQSxVQUFHLGdCQUFnQnZHLElBQWhCLENBQXFCdkMsa0JBQXJCLENBQUg7QUFFQ0EsNkJBQXFCQSxtQkFBbUJzTixPQUFuQixDQUEyQixNQUEzQixFQUFrQyxFQUFsQyxDQUFyQjtBQzJDRzs7QUQxQ0psQixnQkFDQztBQUFBN1IscUJBQWF1RixtQkFBYjtBQUNBZ0osaUJBQVNBLE9BRFQ7QUFFQWtDLHdCQUFnQkEsY0FGaEI7QUFHQWhMLDRCQUFvQkEsa0JBSHBCO0FBSUF3TSxpQkFBUzFNLHdCQUF1QixXQUpoQztBQUtBSyxvQ0FBNEJBO0FBTDVCLE9BREQ7QUFRQThNLHNCQUFnQnBCLG1CQUFtQi9MLG1CQUFuQixDQUFoQjs7QUFDQSxVQUFHbU4sYUFBSDtBQUNDLFlBQUdBLGNBQWNuRSxPQUFqQjtBQUNDc0Qsa0JBQVF0RCxPQUFSLEdBQWtCbUUsY0FBY25FLE9BQWhDO0FDNENJOztBRDNDTCxZQUFHbUUsY0FBY2pDLGNBQWpCO0FBQ0NvQixrQkFBUXBCLGNBQVIsR0FBeUJpQyxjQUFjakMsY0FBdkM7QUM2Q0k7O0FENUNMLFlBQUdpQyxjQUFjcEksSUFBakI7QUFDQ3VILGtCQUFRdkgsSUFBUixHQUFlb0ksY0FBY3BJLElBQTdCO0FDOENJOztBRDdDTCxZQUFHb0ksY0FBY3JULGVBQWpCO0FBQ0N3UyxrQkFBUXhTLGVBQVIsR0FBMEJxVCxjQUFjclQsZUFBeEM7QUMrQ0k7O0FEOUNMLFlBQUdxVCxjQUFjUix1QkFBakI7QUFDQ0wsa0JBQVFLLHVCQUFSLEdBQWtDUSxjQUFjUix1QkFBaEQ7QUNnREk7O0FEL0NMLFlBQUdRLGNBQWN0SCxLQUFqQjtBQUNDeUcsa0JBQVF6RyxLQUFSLEdBQWdCc0gsY0FBY3RILEtBQTlCO0FDaURJOztBRGhETCxZQUFHc0gsY0FBY0osU0FBakI7QUFDQ1Qsa0JBQVFTLFNBQVIsR0FBb0JJLGNBQWNKLFNBQWxDO0FDa0RJOztBRGpETCxlQUFPaEIsbUJBQW1CL0wsbUJBQW5CLENBQVA7QUNtREc7O0FBQ0QsYURsREg0TCxRQUFRVSxRQUFRN1IsV0FBaEIsSUFBK0I2UixPQ2tENUI7QURoR0o7O0FBaURBL1AsY0FBVVYsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBVjtBQUNBYSxhQUFTMUgsT0FBTzBILE1BQVAsRUFBVDtBQUNBcVAsMkJBQXVCalIsRUFBRTBTLEtBQUYsQ0FBUTFTLEVBQUVxRCxNQUFGLENBQVMyTixrQkFBVCxDQUFSLEVBQXNDLGFBQXRDLENBQXZCO0FBQ0F4TSxrQkFBY2pNLFFBQVFpTixjQUFSLENBQXVCOUYsV0FBdkIsRUFBb0M4QixPQUFwQyxFQUE2Q0ksTUFBN0MsQ0FBZDtBQUNBc1Asd0JBQW9CMU0sWUFBWTBNLGlCQUFoQztBQUNBRCwyQkFBdUJqUixFQUFFMlMsVUFBRixDQUFhMUIsb0JBQWIsRUFBbUNDLGlCQUFuQyxDQUF2Qjs7QUFDQWxSLE1BQUUwQyxJQUFGLENBQU9zTyxrQkFBUCxFQUEyQixVQUFDNEIsQ0FBRCxFQUFJM04sbUJBQUo7QUFDMUIsVUFBQWlELFNBQUEsRUFBQTJLLFFBQUEsRUFBQXBTLEdBQUE7QUFBQW9TLGlCQUFXNUIscUJBQXFCalAsT0FBckIsQ0FBNkJpRCxtQkFBN0IsSUFBb0QsQ0FBQyxDQUFoRTtBQUNBaUQsa0JBQUEsQ0FBQXpILE1BQUFsSSxRQUFBaU4sY0FBQSxDQUFBUCxtQkFBQSxFQUFBekQsT0FBQSxFQUFBSSxNQUFBLGFBQUFuQixJQUEwRXlILFNBQTFFLEdBQTBFLE1BQTFFOztBQUNBLFVBQUcySyxZQUFZM0ssU0FBZjtBQ21ESyxlRGxESjJJLFFBQVE1TCxtQkFBUixJQUErQjJOLENDa0QzQjtBQUNEO0FEdkRMOztBQU1BaEMsV0FBTyxFQUFQOztBQUNBLFFBQUc1USxFQUFFNEUsT0FBRixDQUFVbU0sZ0JBQVYsQ0FBSDtBQUNDSCxhQUFRNVEsRUFBRXFELE1BQUYsQ0FBU3dOLE9BQVQsQ0FBUjtBQUREO0FBR0M3USxRQUFFMEMsSUFBRixDQUFPcU8sZ0JBQVAsRUFBeUIsVUFBQ2hNLFVBQUQ7QUFDeEIsWUFBRzhMLFFBQVE5TCxVQUFSLENBQUg7QUNvRE0saUJEbkRMNkwsS0FBS2hMLElBQUwsQ0FBVWlMLFFBQVE5TCxVQUFSLENBQVYsQ0NtREs7QUFDRDtBRHRETjtBQ3dERTs7QURwREgsUUFBRy9FLEVBQUVvUSxHQUFGLENBQU03TCxPQUFOLEVBQWUsbUJBQWYsQ0FBSDtBQUNDcU0sYUFBTzVRLEVBQUUyQyxNQUFGLENBQVNpTyxJQUFULEVBQWUsVUFBQ1EsSUFBRDtBQUNyQixlQUFPcFIsRUFBRXFRLE9BQUYsQ0FBVTlMLFFBQVF1TyxpQkFBbEIsRUFBcUMxQixLQUFLMVIsV0FBMUMsQ0FBUDtBQURNLFFBQVA7QUN3REU7O0FEckRILFdBQU9rUixJQUFQO0FBL0h3QixHQUF6QjtBQ3VMQTs7QUR0RERyWSxRQUFRd2Esc0JBQVIsR0FBaUMsVUFBQ3JULFdBQUQ7QUFDaEMsU0FBT00sRUFBRWdULEtBQUYsQ0FBUXphLFFBQVEwYSxZQUFSLENBQXFCdlQsV0FBckIsQ0FBUixDQUFQO0FBRGdDLENBQWpDLEMsQ0FHQTs7Ozs7QUFJQW5ILFFBQVEyYSxXQUFSLEdBQXNCLFVBQUN4VCxXQUFELEVBQWNtUCxZQUFkLEVBQTRCc0UsSUFBNUI7QUFDckIsTUFBQUMsU0FBQSxFQUFBdEQsU0FBQSxFQUFBblIsTUFBQTs7QUFBQSxNQUFHekUsT0FBTzBHLFFBQVY7QUFDQyxRQUFHLENBQUNsQixXQUFKO0FBQ0NBLG9CQUFjb0IsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQzZERTs7QUQ1REgsUUFBRyxDQUFDOE4sWUFBSjtBQUNDQSxxQkFBZS9OLFFBQVFDLEdBQVIsQ0FBWSxjQUFaLENBQWY7QUFKRjtBQ21FRTs7QUQ5REZwQyxXQUFTcEcsUUFBUWdJLFNBQVIsQ0FBa0JiLFdBQWxCLENBQVQ7O0FBQ0EsTUFBRyxDQUFDZixNQUFKO0FBQ0M7QUNnRUM7O0FEL0RGeVUsY0FBWTdhLFFBQVEwYSxZQUFSLENBQXFCdlQsV0FBckIsQ0FBWjs7QUFDQSxRQUFBMFQsYUFBQSxPQUFPQSxVQUFXdFEsTUFBbEIsR0FBa0IsTUFBbEI7QUFDQztBQ2lFQzs7QURoRUZnTixjQUFZOVAsRUFBRTJLLElBQUYsQ0FBT3lJLFNBQVAsRUFBa0IsVUFBQ2hDLElBQUQ7QUFBUyxXQUFPQSxLQUFLaFEsR0FBTCxLQUFZeU4sWUFBWixJQUE0QnVDLEtBQUtwVSxJQUFMLEtBQWE2UixZQUFoRDtBQUEzQixJQUFaOztBQUNBLE9BQU9pQixTQUFQO0FBRUMsUUFBR3FELElBQUg7QUFDQztBQUREO0FBR0NyRCxrQkFBWXNELFVBQVUsQ0FBVixDQUFaO0FBTEY7QUN5RUU7O0FEbkVGLFNBQU90RCxTQUFQO0FBbkJxQixDQUF0Qjs7QUFzQkF2WCxRQUFROGEsbUJBQVIsR0FBOEIsVUFBQzNULFdBQUQsRUFBY21QLFlBQWQ7QUFDN0IsTUFBQXlFLFFBQUEsRUFBQTNVLE1BQUE7O0FBQUEsTUFBR3pFLE9BQU8wRyxRQUFWO0FBQ0MsUUFBRyxDQUFDbEIsV0FBSjtBQUNDQSxvQkFBY29CLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWQ7QUNzRUU7O0FEckVILFFBQUcsQ0FBQzhOLFlBQUo7QUFDQ0EscUJBQWUvTixRQUFRQyxHQUFSLENBQVksY0FBWixDQUFmO0FBSkY7QUM0RUU7O0FEdkVGLE1BQUcsT0FBTzhOLFlBQVAsS0FBd0IsUUFBM0I7QUFDQ2xRLGFBQVNwRyxRQUFRZ0ksU0FBUixDQUFrQmIsV0FBbEIsQ0FBVDs7QUFDQSxRQUFHLENBQUNmLE1BQUo7QUFDQztBQ3lFRTs7QUR4RUgyVSxlQUFXdFQsRUFBRW1CLFNBQUYsQ0FBWXhDLE9BQU9rQixVQUFuQixFQUE4QjtBQUFDdUIsV0FBS3lOO0FBQU4sS0FBOUIsQ0FBWDtBQUpEO0FBTUN5RSxlQUFXekUsWUFBWDtBQzRFQzs7QUQzRUYsVUFBQXlFLFlBQUEsT0FBT0EsU0FBVXRXLElBQWpCLEdBQWlCLE1BQWpCLE1BQXlCLFFBQXpCO0FBYjZCLENBQTlCLEMsQ0FnQkE7Ozs7Ozs7O0FBT0F6RSxRQUFRZ2IsdUJBQVIsR0FBa0MsVUFBQzdULFdBQUQsRUFBY3VPLE9BQWQ7QUFDakMsTUFBQXVGLEtBQUEsRUFBQWpGLEtBQUEsRUFBQXpNLE1BQUEsRUFBQTJSLFFBQUEsRUFBQUMsWUFBQSxFQUFBQyxTQUFBLEVBQUFDLFFBQUEsRUFBQUMsT0FBQSxFQUFBQyxVQUFBLEVBQUFDLE9BQUEsRUFBQXBWLE1BQUEsRUFBQXFWLE1BQUE7QUFBQUEsV0FBUyxFQUFUO0FBQ0FILFlBQVUsQ0FBVjtBQUNBRCxhQUFXQyxVQUFVLENBQXJCO0FBQ0FMLFVBQVEsQ0FBUjtBQUNBN1UsV0FBU3BHLFFBQVFnSSxTQUFSLENBQWtCYixXQUFsQixDQUFUO0FBQ0FvQyxXQUFTbkQsT0FBT21ELE1BQWhCOztBQUNBLE9BQU9uRCxNQUFQO0FBQ0MsV0FBT3NQLE9BQVA7QUNnRkM7O0FEL0VGOEYsWUFBVXBWLE9BQU91TCxjQUFqQjs7QUFDQXdKLGlCQUFlLFVBQUN0QyxJQUFEO0FBQ2QsUUFBR3BSLEVBQUU4RSxRQUFGLENBQVdzTSxJQUFYLENBQUg7QUFDQyxhQUFPQSxLQUFLN0MsS0FBTCxLQUFjd0YsT0FBckI7QUFERDtBQUdDLGFBQU8zQyxTQUFRMkMsT0FBZjtBQ2lGRTtBRHJGVyxHQUFmOztBQUtBTixhQUFXLFVBQUNyQyxJQUFEO0FBQ1YsUUFBR3BSLEVBQUU4RSxRQUFGLENBQVdzTSxJQUFYLENBQUg7QUFDQyxhQUFPdFAsT0FBT3NQLEtBQUs3QyxLQUFaLENBQVA7QUFERDtBQUdDLGFBQU96TSxPQUFPc1AsSUFBUCxDQUFQO0FDbUZFO0FEdkZPLEdBQVg7O0FBS0EsTUFBRzJDLE9BQUg7QUFDQ0QsaUJBQWE3RixRQUFRdEQsSUFBUixDQUFhLFVBQUN5RyxJQUFEO0FBQ3pCLGFBQU9zQyxhQUFhdEMsSUFBYixDQUFQO0FBRFksTUFBYjtBQ3VGQzs7QURyRkYsTUFBRzBDLFVBQUg7QUFDQ3ZGLFlBQVFrRixTQUFTSyxVQUFULENBQVI7QUFDQUgsZ0JBQWVwRixNQUFNQyxPQUFOLEdBQW1CLENBQW5CLEdBQTBCLENBQXpDO0FBQ0FnRixhQUFTRyxTQUFUO0FBQ0FLLFdBQU9wTyxJQUFQLENBQVlrTyxVQUFaO0FDdUZDOztBRHRGRjdGLFVBQVF1QyxPQUFSLENBQWdCLFVBQUNZLElBQUQ7QUFDZjdDLFlBQVFrRixTQUFTckMsSUFBVCxDQUFSOztBQUNBLFNBQU83QyxLQUFQO0FBQ0M7QUN3RkU7O0FEdkZIb0YsZ0JBQWVwRixNQUFNQyxPQUFOLEdBQW1CLENBQW5CLEdBQTBCLENBQXpDOztBQUNBLFFBQUdnRixRQUFRSSxRQUFSLElBQXFCSSxPQUFPbFIsTUFBUCxHQUFnQjhRLFFBQXJDLElBQWtELENBQUNGLGFBQWF0QyxJQUFiLENBQXREO0FBQ0NvQyxlQUFTRyxTQUFUOztBQUNBLFVBQUdILFNBQVNJLFFBQVo7QUN5RkssZUR4RkpJLE9BQU9wTyxJQUFQLENBQVl3TCxJQUFaLENDd0ZJO0FEM0ZOO0FDNkZHO0FEbEdKO0FBVUEsU0FBTzRDLE1BQVA7QUF0Q2lDLENBQWxDLEMsQ0F3Q0E7Ozs7QUFHQXpiLFFBQVEwYixvQkFBUixHQUErQixVQUFDdlUsV0FBRDtBQUM5QixNQUFBd1UsV0FBQSxFQUFBdlYsTUFBQSxFQUFBOEIsR0FBQTtBQUFBOUIsV0FBU3BHLFFBQVFnSSxTQUFSLENBQWtCYixXQUFsQixDQUFUOztBQUNBLE1BQUcsQ0FBQ2YsTUFBSjtBQUNDQSxhQUFTcEcsUUFBUUMsT0FBUixDQUFnQmtILFdBQWhCLENBQVQ7QUMrRkM7O0FEOUZGLE1BQUFmLFVBQUEsUUFBQThCLE1BQUE5QixPQUFBa0IsVUFBQSxZQUFBWSxJQUFxQixTQUFyQixJQUFxQixNQUFyQixHQUFxQixNQUFyQjtBQUVDeVQsa0JBQWN2VixPQUFPa0IsVUFBUCxDQUFpQixTQUFqQixDQUFkO0FBRkQ7QUFJQ0csTUFBRTBDLElBQUYsQ0FBQS9ELFVBQUEsT0FBT0EsT0FBUWtCLFVBQWYsR0FBZSxNQUFmLEVBQTJCLFVBQUNpUSxTQUFELEVBQVk5TCxHQUFaO0FBQzFCLFVBQUc4TCxVQUFVOVMsSUFBVixLQUFrQixLQUFsQixJQUEyQmdILFFBQU8sS0FBckM7QUMrRkssZUQ5RkprUSxjQUFjcEUsU0M4RlY7QUFDRDtBRGpHTDtBQ21HQzs7QURoR0YsU0FBT29FLFdBQVA7QUFYOEIsQ0FBL0IsQyxDQWFBOzs7O0FBR0EzYixRQUFRZ1gsdUJBQVIsR0FBa0MsVUFBQzdQLFdBQUQsRUFBY3lVLGtCQUFkO0FBQ2pDLE1BQUFsRyxPQUFBLEVBQUFpRyxXQUFBO0FBQUFBLGdCQUFjM2IsUUFBUTBiLG9CQUFSLENBQTZCdlUsV0FBN0IsQ0FBZDtBQUNBdU8sWUFBQWlHLGVBQUEsT0FBVUEsWUFBYWpHLE9BQXZCLEdBQXVCLE1BQXZCOztBQUNBLE1BQUdrRyxrQkFBSDtBQUNDLFFBQUFELGVBQUEsT0FBR0EsWUFBYS9ELGNBQWhCLEdBQWdCLE1BQWhCO0FBQ0NsQyxnQkFBVWlHLFlBQVkvRCxjQUF0QjtBQURELFdBRUssSUFBR2xDLE9BQUg7QUFDSkEsZ0JBQVUxVixRQUFRZ2IsdUJBQVIsQ0FBZ0M3VCxXQUFoQyxFQUE2Q3VPLE9BQTdDLENBQVY7QUFKRjtBQzJHRTs7QUR0R0YsU0FBT0EsT0FBUDtBQVJpQyxDQUFsQyxDLENBVUE7Ozs7QUFHQTFWLFFBQVErWiw2QkFBUixHQUF3QyxVQUFDNVMsV0FBRCxFQUFjeVUsa0JBQWQ7QUFDdkMsTUFBQWxHLE9BQUEsRUFBQWlHLFdBQUE7QUFBQUEsZ0JBQWMzYixRQUFRd2Esc0JBQVIsQ0FBK0JyVCxXQUEvQixDQUFkO0FBQ0F1TyxZQUFBaUcsZUFBQSxPQUFVQSxZQUFhakcsT0FBdkIsR0FBdUIsTUFBdkI7O0FBQ0EsTUFBR2tHLGtCQUFIO0FBQ0MsUUFBQUQsZUFBQSxPQUFHQSxZQUFhL0QsY0FBaEIsR0FBZ0IsTUFBaEI7QUFDQ2xDLGdCQUFVaUcsWUFBWS9ELGNBQXRCO0FBREQsV0FFSyxJQUFHbEMsT0FBSDtBQUNKQSxnQkFBVTFWLFFBQVFnYix1QkFBUixDQUFnQzdULFdBQWhDLEVBQTZDdU8sT0FBN0MsQ0FBVjtBQUpGO0FDaUhFOztBRDVHRixTQUFPQSxPQUFQO0FBUnVDLENBQXhDLEMsQ0FVQTs7OztBQUdBMVYsUUFBUWlYLDRCQUFSLEdBQXVDLFVBQUM5UCxXQUFEO0FBQ3RDLE1BQUF3VSxXQUFBO0FBQUFBLGdCQUFjM2IsUUFBUTBiLG9CQUFSLENBQTZCdlUsV0FBN0IsQ0FBZDtBQUNBLFNBQUF3VSxlQUFBLE9BQU9BLFlBQWE1RSxhQUFwQixHQUFvQixNQUFwQjtBQUZzQyxDQUF2QyxDLENBSUE7Ozs7QUFHQS9XLFFBQVFtWCxvQkFBUixHQUErQixVQUFDaFEsV0FBRDtBQUM5QixNQUFBd1UsV0FBQTtBQUFBQSxnQkFBYzNiLFFBQVEwYixvQkFBUixDQUE2QnZVLFdBQTdCLENBQWQ7O0FBQ0EsTUFBR3dVLFdBQUg7QUFDQyxRQUFHQSxZQUFZbEssSUFBZjtBQUNDLGFBQU9rSyxZQUFZbEssSUFBbkI7QUFERDtBQUdDLGFBQU8sQ0FBQyxDQUFDLFNBQUQsRUFBWSxNQUFaLENBQUQsQ0FBUDtBQUpGO0FDMkhFO0FEN0g0QixDQUEvQixDLENBU0E7Ozs7QUFHQXpSLFFBQVE2YixTQUFSLEdBQW9CLFVBQUN0RSxTQUFEO0FBQ25CLFVBQUFBLGFBQUEsT0FBT0EsVUFBVzlTLElBQWxCLEdBQWtCLE1BQWxCLE1BQTBCLEtBQTFCO0FBRG1CLENBQXBCLEMsQ0FHQTs7OztBQUdBekUsUUFBUThiLFlBQVIsR0FBdUIsVUFBQ3ZFLFNBQUQ7QUFDdEIsVUFBQUEsYUFBQSxPQUFPQSxVQUFXOVMsSUFBbEIsR0FBa0IsTUFBbEIsTUFBMEIsUUFBMUI7QUFEc0IsQ0FBdkIsQyxDQUdBOzs7O0FBR0F6RSxRQUFRaWEsc0JBQVIsR0FBaUMsVUFBQ3hJLElBQUQsRUFBT3NLLGNBQVA7QUFDaEMsTUFBQUMsWUFBQTtBQUFBQSxpQkFBZSxFQUFmOztBQUNBdlUsSUFBRTBDLElBQUYsQ0FBT3NILElBQVAsRUFBYSxVQUFDb0gsSUFBRDtBQUNaLFFBQUFvRCxZQUFBLEVBQUFsRyxVQUFBLEVBQUFhLEtBQUE7O0FBQUEsUUFBR25QLEVBQUVXLE9BQUYsQ0FBVXlRLElBQVYsQ0FBSDtBQUVDLFVBQUdBLEtBQUt0TyxNQUFMLEtBQWUsQ0FBbEI7QUFDQzBSLHVCQUFlRixlQUFldFMsT0FBZixDQUF1Qm9QLEtBQUssQ0FBTCxDQUF2QixDQUFmOztBQUNBLFlBQUdvRCxlQUFlLENBQUMsQ0FBbkI7QUNpSU0saUJEaElMRCxhQUFhM08sSUFBYixDQUFrQixDQUFDNE8sWUFBRCxFQUFlLEtBQWYsQ0FBbEIsQ0NnSUs7QURuSVA7QUFBQSxhQUlLLElBQUdwRCxLQUFLdE8sTUFBTCxLQUFlLENBQWxCO0FBQ0owUix1QkFBZUYsZUFBZXRTLE9BQWYsQ0FBdUJvUCxLQUFLLENBQUwsQ0FBdkIsQ0FBZjs7QUFDQSxZQUFHb0QsZUFBZSxDQUFDLENBQW5CO0FDa0lNLGlCRGpJTEQsYUFBYTNPLElBQWIsQ0FBa0IsQ0FBQzRPLFlBQUQsRUFBZXBELEtBQUssQ0FBTCxDQUFmLENBQWxCLENDaUlLO0FEcElGO0FBTk47QUFBQSxXQVVLLElBQUdwUixFQUFFOEUsUUFBRixDQUFXc00sSUFBWCxDQUFIO0FBRUo5QyxtQkFBYThDLEtBQUs5QyxVQUFsQjtBQUNBYSxjQUFRaUMsS0FBS2pDLEtBQWI7O0FBQ0EsVUFBR2IsY0FBY2EsS0FBakI7QUFDQ3FGLHVCQUFlRixlQUFldFMsT0FBZixDQUF1QnNNLFVBQXZCLENBQWY7O0FBQ0EsWUFBR2tHLGVBQWUsQ0FBQyxDQUFuQjtBQ21JTSxpQkRsSUxELGFBQWEzTyxJQUFiLENBQWtCLENBQUM0TyxZQUFELEVBQWVyRixLQUFmLENBQWxCLENDa0lLO0FEcklQO0FBSkk7QUM0SUY7QUR2Sko7O0FBb0JBLFNBQU9vRixZQUFQO0FBdEJnQyxDQUFqQyxDLENBd0JBOzs7O0FBR0FoYyxRQUFRa2MsaUJBQVIsR0FBNEIsVUFBQ3pLLElBQUQ7QUFDM0IsTUFBQTBLLE9BQUE7QUFBQUEsWUFBVSxFQUFWOztBQUNBMVUsSUFBRTBDLElBQUYsQ0FBT3NILElBQVAsRUFBYSxVQUFDb0gsSUFBRDtBQUNaLFFBQUE5QyxVQUFBLEVBQUFhLEtBQUE7O0FBQUEsUUFBR25QLEVBQUVXLE9BQUYsQ0FBVXlRLElBQVYsQ0FBSDtBQzJJSSxhRHpJSHNELFFBQVE5TyxJQUFSLENBQWF3TCxJQUFiLENDeUlHO0FEM0lKLFdBR0ssSUFBR3BSLEVBQUU4RSxRQUFGLENBQVdzTSxJQUFYLENBQUg7QUFFSjlDLG1CQUFhOEMsS0FBSzlDLFVBQWxCO0FBQ0FhLGNBQVFpQyxLQUFLakMsS0FBYjs7QUFDQSxVQUFHYixjQUFjYSxLQUFqQjtBQ3lJSyxlRHhJSnVGLFFBQVE5TyxJQUFSLENBQWEsQ0FBQzBJLFVBQUQsRUFBYWEsS0FBYixDQUFiLENDd0lJO0FEN0lEO0FDK0lGO0FEbkpKOztBQVdBLFNBQU91RixPQUFQO0FBYjJCLENBQTVCLEM7Ozs7Ozs7Ozs7OztBRXphQTdWLGFBQWE4VixLQUFiLENBQW1CbEgsSUFBbkIsR0FBMEIsSUFBSW1ILE1BQUosQ0FBVywwQkFBWCxDQUExQjs7QUFFQSxJQUFHMWEsT0FBTzBHLFFBQVY7QUFDQzFHLFNBQU9DLE9BQVAsQ0FBZTtBQUNkLFFBQUEwYSxjQUFBOztBQUFBQSxxQkFBaUJoVyxhQUFhaVcsZUFBYixDQUE2QkMsS0FBN0IsSUFBc0MsRUFBdkQ7O0FBQ0FGLG1CQUFlalAsSUFBZixDQUFvQjtBQUFDb1AsV0FBS25XLGFBQWE4VixLQUFiLENBQW1CbEgsSUFBekI7QUFBK0J3SCxXQUFLO0FBQXBDLEtBQXBCOztBQ0tFLFdESkZwVyxhQUFhcVcsUUFBYixDQUFzQjtBQUNyQkgsYUFBT0Y7QUFEYyxLQUF0QixDQ0lFO0FEUEg7QUNXQSxDOzs7Ozs7Ozs7Ozs7QUNkRGhXLGFBQWE4VixLQUFiLENBQW1CcEcsS0FBbkIsR0FBMkIsSUFBSXFHLE1BQUosQ0FBVyw2Q0FBWCxDQUEzQjs7QUFFQSxJQUFHMWEsT0FBTzBHLFFBQVY7QUFDQzFHLFNBQU9DLE9BQVAsQ0FBZTtBQUNkLFFBQUEwYSxjQUFBOztBQUFBQSxxQkFBaUJoVyxhQUFhaVcsZUFBYixDQUE2QkMsS0FBN0IsSUFBc0MsRUFBdkQ7O0FBQ0FGLG1CQUFlalAsSUFBZixDQUFvQjtBQUFDb1AsV0FBS25XLGFBQWE4VixLQUFiLENBQW1CcEcsS0FBekI7QUFBZ0MwRyxXQUFLO0FBQXJDLEtBQXBCOztBQ0tFLFdESkZwVyxhQUFhcVcsUUFBYixDQUFzQjtBQUNyQkgsYUFBT0Y7QUFEYyxLQUF0QixDQ0lFO0FEUEg7QUNXQSxDOzs7Ozs7Ozs7OztBQ2REO0FBQ0F0YyxPQUFPLENBQUM0YyxhQUFSLEdBQXdCLFVBQVNDLEVBQVQsRUFBYWpULE9BQWIsRUFBc0I7QUFDMUM7QUFDQSxTQUFPLFlBQVc7QUFDakIsV0FBT2tULElBQUksQ0FBQ0QsRUFBRCxDQUFYO0FBQ0gsR0FGUyxDQUVSRSxJQUZRLENBRUhuVCxPQUZHLENBQVA7QUFHSCxDQUxEOztBQVFBNUosT0FBTyxDQUFDOGMsSUFBUixHQUFlLFVBQVNELEVBQVQsRUFBWTtBQUMxQixNQUFHO0FBQ0YsV0FBT0MsSUFBSSxDQUFDRCxFQUFELENBQVg7QUFDQSxHQUZELENBRUMsT0FBT2pjLENBQVAsRUFBUztBQUNUa0YsV0FBTyxDQUFDRCxLQUFSLENBQWNqRixDQUFkLEVBQWlCaWMsRUFBakI7QUFDQTtBQUNELENBTkQsQzs7Ozs7Ozs7Ozs7O0FDVEMsSUFBQUcsWUFBQSxFQUFBQyxTQUFBOztBQUFBQSxZQUFZLFVBQUNDLE1BQUQ7QUFDWCxNQUFBQyxHQUFBO0FBQUFBLFFBQU1ELE9BQU9oRSxLQUFQLENBQWEsR0FBYixDQUFOOztBQUNBLE1BQUdpRSxJQUFJNVMsTUFBSixHQUFhLENBQWhCO0FBQ0MsV0FBTztBQUFDZ0ksYUFBTzRLLElBQUksQ0FBSixDQUFSO0FBQWdCN1MsYUFBTzZTLElBQUksQ0FBSixDQUF2QjtBQUErQkMsYUFBT0QsSUFBSSxDQUFKO0FBQXRDLEtBQVA7QUFERCxTQUVLLElBQUdBLElBQUk1UyxNQUFKLEdBQWEsQ0FBaEI7QUFDSixXQUFPO0FBQUNnSSxhQUFPNEssSUFBSSxDQUFKLENBQVI7QUFBZ0I3UyxhQUFPNlMsSUFBSSxDQUFKO0FBQXZCLEtBQVA7QUFESTtBQUdKLFdBQU87QUFBQzVLLGFBQU80SyxJQUFJLENBQUosQ0FBUjtBQUFnQjdTLGFBQU82UyxJQUFJLENBQUo7QUFBdkIsS0FBUDtBQ2NBO0FEckJVLENBQVo7O0FBU0FILGVBQWUsVUFBQzdWLFdBQUQsRUFBYzRPLFVBQWQsRUFBMEJDLEtBQTFCLEVBQWlDL00sT0FBakM7QUFDZCxNQUFBb1UsVUFBQSxFQUFBbkksSUFBQSxFQUFBaFIsT0FBQSxFQUFBb1osUUFBQSxFQUFBQyxlQUFBLEVBQUFyVixHQUFBOztBQUFBLE1BQUd2RyxPQUFPcUYsUUFBUCxJQUFtQmlDLE9BQW5CLElBQThCK00sTUFBTS9SLElBQU4sS0FBYyxRQUEvQztBQUNDaVIsV0FBT2MsTUFBTXNILFFBQU4sSUFBcUJuVyxjQUFZLEdBQVosR0FBZTRPLFVBQTNDOztBQUNBLFFBQUdiLElBQUg7QUFDQ29JLGlCQUFXdGQsUUFBUXdkLFdBQVIsQ0FBb0J0SSxJQUFwQixFQUEwQmpNLE9BQTFCLENBQVg7O0FBQ0EsVUFBR3FVLFFBQUg7QUFDQ3BaLGtCQUFVLEVBQVY7QUFDQW1aLHFCQUFhLEVBQWI7QUFDQUUsMEJBQWtCdmQsUUFBUXlkLGtCQUFSLENBQTJCSCxRQUEzQixDQUFsQjtBQUNBQywwQkFBQSxDQUFBclYsTUFBQVQsRUFBQXVELE1BQUEsQ0FBQXVTLGVBQUEsd0JBQUFyVixJQUF3RHdWLE9BQXhELEtBQWtCLE1BQWxCOztBQUNBalcsVUFBRTBDLElBQUYsQ0FBT29ULGVBQVAsRUFBd0IsVUFBQzFFLElBQUQ7QUFDdkIsY0FBQXRHLEtBQUEsRUFBQWpJLEtBQUE7QUFBQWlJLGtCQUFRc0csS0FBS3BVLElBQWI7QUFDQTZGLGtCQUFRdU8sS0FBS3ZPLEtBQUwsSUFBY3VPLEtBQUtwVSxJQUEzQjtBQUNBNFkscUJBQVdoUSxJQUFYLENBQWdCO0FBQUNrRixtQkFBT0EsS0FBUjtBQUFlakksbUJBQU9BLEtBQXRCO0FBQTZCcVQsb0JBQVE5RSxLQUFLOEUsTUFBMUM7QUFBa0RQLG1CQUFPdkUsS0FBS3VFO0FBQTlELFdBQWhCOztBQUNBLGNBQUd2RSxLQUFLOEUsTUFBUjtBQUNDelosb0JBQVFtSixJQUFSLENBQWE7QUFBQ2tGLHFCQUFPQSxLQUFSO0FBQWVqSSxxQkFBT0EsS0FBdEI7QUFBNkI4UyxxQkFBT3ZFLEtBQUt1RTtBQUF6QyxhQUFiO0FDMkJJOztBRDFCTCxjQUFHdkUsS0FBSSxTQUFKLENBQUg7QUM0Qk0sbUJEM0JMN0MsTUFBTTRILFlBQU4sR0FBcUJ0VCxLQzJCaEI7QUFDRDtBRG5DTjs7QUFRQSxZQUFHcEcsUUFBUXFHLE1BQVIsR0FBaUIsQ0FBcEI7QUFDQ3lMLGdCQUFNOVIsT0FBTixHQUFnQkEsT0FBaEI7QUM4Qkc7O0FEN0JKLFlBQUdtWixXQUFXOVMsTUFBWCxHQUFvQixDQUF2QjtBQUNDeUwsZ0JBQU1xSCxVQUFOLEdBQW1CQSxVQUFuQjtBQWhCRjtBQUZEO0FBRkQ7QUNzREM7O0FEakNELFNBQU9ySCxLQUFQO0FBdEJjLENBQWY7O0FBd0JBaFcsUUFBUTJILGFBQVIsR0FBd0IsVUFBQ3ZCLE1BQUQsRUFBUzZDLE9BQVQ7QUFDdkIsTUFBRyxDQUFDN0MsTUFBSjtBQUNDO0FDb0NBOztBRG5DRHFCLElBQUV3USxPQUFGLENBQVU3UixPQUFPeVgsUUFBakIsRUFBMkIsVUFBQ0MsT0FBRCxFQUFVclMsR0FBVjtBQUUxQixRQUFBc1MsS0FBQSxFQUFBQyxlQUFBLEVBQUFDLGFBQUE7O0FBQUEsUUFBSXRjLE9BQU9xRixRQUFQLElBQW1COFcsUUFBUUksRUFBUixLQUFjLFFBQWxDLElBQWdEdmMsT0FBTzBHLFFBQVAsSUFBbUJ5VixRQUFRSSxFQUFSLEtBQWMsUUFBcEY7QUFDQ0Ysd0JBQUFGLFdBQUEsT0FBa0JBLFFBQVNDLEtBQTNCLEdBQTJCLE1BQTNCO0FBQ0FFLHNCQUFnQkgsUUFBUUssSUFBeEI7O0FBQ0EsVUFBR0gsbUJBQW1CdlcsRUFBRW9DLFFBQUYsQ0FBV21VLGVBQVgsQ0FBdEI7QUFDQ0YsZ0JBQVFLLElBQVIsR0FBZW5lLFFBQU8sTUFBUCxFQUFhLE1BQUlnZSxlQUFKLEdBQW9CLEdBQWpDLENBQWY7QUNxQ0U7O0FEbkNILFVBQUdDLGlCQUFpQnhXLEVBQUVvQyxRQUFGLENBQVdvVSxhQUFYLENBQXBCO0FBR0MsWUFBR0EsY0FBYy9PLFVBQWQsQ0FBeUIsVUFBekIsQ0FBSDtBQUNDNE8sa0JBQVFLLElBQVIsR0FBZW5lLFFBQU8sTUFBUCxFQUFhLE1BQUlpZSxhQUFKLEdBQWtCLEdBQS9CLENBQWY7QUFERDtBQUdDSCxrQkFBUUssSUFBUixHQUFlbmUsUUFBTyxNQUFQLEVBQWEsMkRBQXlEaWUsYUFBekQsR0FBdUUsSUFBcEYsQ0FBZjtBQU5GO0FBTkQ7QUNpREU7O0FEbkNGLFFBQUd0YyxPQUFPcUYsUUFBUCxJQUFtQjhXLFFBQVFJLEVBQVIsS0FBYyxRQUFwQztBQUNDSCxjQUFRRCxRQUFRSyxJQUFoQjs7QUFDQSxVQUFHSixTQUFTdFcsRUFBRXVILFVBQUYsQ0FBYStPLEtBQWIsQ0FBWjtBQ3FDSSxlRHBDSEQsUUFBUUMsS0FBUixHQUFnQkEsTUFBTWxTLFFBQU4sRUNvQ2I7QUR2Q0w7QUN5Q0U7QUR6REg7O0FBcUJBLE1BQUdsSyxPQUFPMEcsUUFBVjtBQUNDWixNQUFFd1EsT0FBRixDQUFVN1IsT0FBT21ELE1BQWpCLEVBQXlCLFVBQUN5TSxLQUFELEVBQVF2SyxHQUFSO0FBRXhCLFVBQUEyUyxnQkFBQTs7QUFBQSxVQUFHcEksTUFBTXFJLElBQVQ7QUFFQ3JJLGNBQU1VLE1BQU4sR0FBZSxJQUFmO0FDc0NFOztBRHBDSCxVQUFHVixNQUFNc0ksUUFBTixJQUFrQnRJLE1BQU11SSxRQUEzQjtBQUVDdkksY0FBTXVJLFFBQU4sR0FBaUIsS0FBakI7QUNxQ0U7O0FEbkNISCx5QkFBbUJwZSxRQUFRd2UsbUJBQVIsRUFBbkI7O0FBQ0EsVUFBR0osaUJBQWlCM1UsT0FBakIsQ0FBeUJnQyxHQUF6QixJQUFnQyxDQUFDLENBQXBDO0FDcUNJLGVEbkNIdUssTUFBTXVJLFFBQU4sR0FBaUIsSUNtQ2Q7QUFDRDtBRGpESjs7QUFlQTlXLE1BQUV3USxPQUFGLENBQVU3UixPQUFPa1QsT0FBakIsRUFBMEIsVUFBQ2pQLE1BQUQsRUFBU29CLEdBQVQ7QUFDekIsVUFBQXVTLGVBQUEsRUFBQUMsYUFBQSxFQUFBUSxRQUFBLEVBQUE1WSxLQUFBOztBQUFBbVksd0JBQUEzVCxVQUFBLE9BQWtCQSxPQUFRMFQsS0FBMUIsR0FBMEIsTUFBMUI7QUFDQUUsc0JBQUE1VCxVQUFBLE9BQWdCQSxPQUFROFQsSUFBeEIsR0FBd0IsTUFBeEI7O0FBQ0EsVUFBR0gsbUJBQW1CdlcsRUFBRW9DLFFBQUYsQ0FBV21VLGVBQVgsQ0FBdEI7QUFFQztBQUNDM1QsaUJBQU84VCxJQUFQLEdBQWNuZSxRQUFPLE1BQVAsRUFBYSxNQUFJZ2UsZUFBSixHQUFvQixHQUFqQyxDQUFkO0FBREQsaUJBQUFVLE1BQUE7QUFFTTdZLGtCQUFBNlksTUFBQTtBQUNMNVksa0JBQVFELEtBQVIsQ0FBYyxnQkFBZCxFQUFnQ21ZLGVBQWhDO0FBTEY7QUM0Q0c7O0FEdENILFVBQUdDLGlCQUFpQnhXLEVBQUVvQyxRQUFGLENBQVdvVSxhQUFYLENBQXBCO0FBRUM7QUFDQyxjQUFHQSxjQUFjL08sVUFBZCxDQUF5QixVQUF6QixDQUFIO0FBQ0M3RSxtQkFBTzhULElBQVAsR0FBY25lLFFBQU8sTUFBUCxFQUFhLE1BQUlpZSxhQUFKLEdBQWtCLEdBQS9CLENBQWQ7QUFERDtBQUdDLGdCQUFHeFcsRUFBRXVILFVBQUYsQ0FBYWhQLFFBQVEyZSxhQUFSLENBQXNCVixhQUF0QixDQUFiLENBQUg7QUFDQzVULHFCQUFPOFQsSUFBUCxHQUFjRixhQUFkO0FBREQ7QUFHQzVULHFCQUFPOFQsSUFBUCxHQUFjbmUsUUFBTyxNQUFQLEVBQWEsaUJBQWVpZSxhQUFmLEdBQTZCLElBQTFDLENBQWQ7QUFORjtBQUREO0FBQUEsaUJBQUFTLE1BQUE7QUFRTTdZLGtCQUFBNlksTUFBQTtBQUNMNVksa0JBQVFELEtBQVIsQ0FBYyxjQUFkLEVBQThCb1ksYUFBOUIsRUFBNkNwWSxLQUE3QztBQVhGO0FDc0RHOztBRHpDSDRZLGlCQUFBcFUsVUFBQSxPQUFXQSxPQUFRb1UsUUFBbkIsR0FBbUIsTUFBbkI7O0FBQ0EsVUFBR0EsUUFBSDtBQUNDO0FDMkNLLGlCRDFDSnBVLE9BQU91VSxPQUFQLEdBQWlCNWUsUUFBTyxNQUFQLEVBQWEsTUFBSXllLFFBQUosR0FBYSxHQUExQixDQzBDYjtBRDNDTCxpQkFBQUMsTUFBQTtBQUVNN1ksa0JBQUE2WSxNQUFBO0FDNENELGlCRDNDSjVZLFFBQVFELEtBQVIsQ0FBYyxvQ0FBZCxFQUFvREEsS0FBcEQsRUFBMkQ0WSxRQUEzRCxDQzJDSTtBRC9DTjtBQ2lERztBRHhFSjtBQWhCRDtBQTZDQ2hYLE1BQUV3USxPQUFGLENBQVU3UixPQUFPa1QsT0FBakIsRUFBMEIsVUFBQ2pQLE1BQUQsRUFBU29CLEdBQVQ7QUFDekIsVUFBQXNTLEtBQUEsRUFBQVUsUUFBQTs7QUFBQVYsY0FBQTFULFVBQUEsT0FBUUEsT0FBUThULElBQWhCLEdBQWdCLE1BQWhCOztBQUNBLFVBQUdKLFNBQVN0VyxFQUFFdUgsVUFBRixDQUFhK08sS0FBYixDQUFaO0FBRUMxVCxlQUFPMFQsS0FBUCxHQUFlQSxNQUFNbFMsUUFBTixFQUFmO0FDK0NFOztBRDdDSDRTLGlCQUFBcFUsVUFBQSxPQUFXQSxPQUFRdVUsT0FBbkIsR0FBbUIsTUFBbkI7O0FBRUEsVUFBR0gsWUFBWWhYLEVBQUV1SCxVQUFGLENBQWF5UCxRQUFiLENBQWY7QUM4Q0ksZUQ3Q0hwVSxPQUFPb1UsUUFBUCxHQUFrQkEsU0FBUzVTLFFBQVQsRUM2Q2Y7QUFDRDtBRHZESjtBQ3lEQTs7QUQ5Q0RwRSxJQUFFd1EsT0FBRixDQUFVN1IsT0FBT21ELE1BQWpCLEVBQXlCLFVBQUN5TSxLQUFELEVBQVF2SyxHQUFSO0FBRXhCLFFBQUFvVCxRQUFBLEVBQUFDLEtBQUEsRUFBQUMsa0JBQUEsRUFBQWhZLGNBQUEsRUFBQTZXLFlBQUEsRUFBQS9YLEtBQUEsRUFBQVcsZUFBQSxFQUFBd1ksa0JBQUEsRUFBQUMsR0FBQSxFQUFBQyxHQUFBLEVBQUFoYixPQUFBLEVBQUE0QyxlQUFBLEVBQUErRixZQUFBLEVBQUEyUCxLQUFBOztBQUFBeEcsWUFBUWdILGFBQWE1VyxPQUFPM0IsSUFBcEIsRUFBMEJnSCxHQUExQixFQUErQnVLLEtBQS9CLEVBQXNDL00sT0FBdEMsQ0FBUjs7QUFFQSxRQUFHK00sTUFBTTlSLE9BQU4sSUFBaUJ1RCxFQUFFb0MsUUFBRixDQUFXbU0sTUFBTTlSLE9BQWpCLENBQXBCO0FBQ0M7QUFDQzJhLG1CQUFXLEVBQVg7O0FBRUFwWCxVQUFFd1EsT0FBRixDQUFVakMsTUFBTTlSLE9BQU4sQ0FBY2dWLEtBQWQsQ0FBb0IsSUFBcEIsQ0FBVixFQUFxQyxVQUFDZ0UsTUFBRDtBQUNwQyxjQUFBaFosT0FBQTs7QUFBQSxjQUFHZ1osT0FBT3pULE9BQVAsQ0FBZSxHQUFmLENBQUg7QUFDQ3ZGLHNCQUFVZ1osT0FBT2hFLEtBQVAsQ0FBYSxHQUFiLENBQVY7QUMrQ0ssbUJEOUNMelIsRUFBRXdRLE9BQUYsQ0FBVS9ULE9BQVYsRUFBbUIsVUFBQ2liLE9BQUQ7QUMrQ1oscUJEOUNOTixTQUFTeFIsSUFBVCxDQUFjNFAsVUFBVWtDLE9BQVYsQ0FBZCxDQzhDTTtBRC9DUCxjQzhDSztBRGhETjtBQ29ETSxtQkQvQ0xOLFNBQVN4UixJQUFULENBQWM0UCxVQUFVQyxNQUFWLENBQWQsQ0MrQ0s7QUFDRDtBRHRETjs7QUFPQWxILGNBQU05UixPQUFOLEdBQWdCMmEsUUFBaEI7QUFWRCxlQUFBSCxNQUFBO0FBV003WSxnQkFBQTZZLE1BQUE7QUFDTDVZLGdCQUFRRCxLQUFSLENBQWMsOEJBQWQsRUFBOENtUSxNQUFNOVIsT0FBcEQsRUFBNkQyQixLQUE3RDtBQWJGO0FBQUEsV0FlSyxJQUFHbVEsTUFBTTlSLE9BQU4sSUFBaUJ1RCxFQUFFVyxPQUFGLENBQVU0TixNQUFNOVIsT0FBaEIsQ0FBcEI7QUFDSjtBQUNDMmEsbUJBQVcsRUFBWDs7QUFFQXBYLFVBQUV3USxPQUFGLENBQVVqQyxNQUFNOVIsT0FBaEIsRUFBeUIsVUFBQ2daLE1BQUQ7QUFDeEIsY0FBR3pWLEVBQUVvQyxRQUFGLENBQVdxVCxNQUFYLENBQUg7QUNrRE0sbUJEakRMMkIsU0FBU3hSLElBQVQsQ0FBYzRQLFVBQVVDLE1BQVYsQ0FBZCxDQ2lESztBRGxETjtBQ29ETSxtQkRqREwyQixTQUFTeFIsSUFBVCxDQUFjNlAsTUFBZCxDQ2lESztBQUNEO0FEdEROOztBQUtBbEgsY0FBTTlSLE9BQU4sR0FBZ0IyYSxRQUFoQjtBQVJELGVBQUFILE1BQUE7QUFTTTdZLGdCQUFBNlksTUFBQTtBQUNMNVksZ0JBQVFELEtBQVIsQ0FBYyw4QkFBZCxFQUE4Q21RLE1BQU05UixPQUFwRCxFQUE2RDJCLEtBQTdEO0FBWEc7QUFBQSxXQWFBLElBQUdtUSxNQUFNOVIsT0FBTixJQUFpQixDQUFDdUQsRUFBRXVILFVBQUYsQ0FBYWdILE1BQU05UixPQUFuQixDQUFsQixJQUFpRCxDQUFDdUQsRUFBRVcsT0FBRixDQUFVNE4sTUFBTTlSLE9BQWhCLENBQWxELElBQThFdUQsRUFBRThFLFFBQUYsQ0FBV3lKLE1BQU05UixPQUFqQixDQUFqRjtBQUNKMmEsaUJBQVcsRUFBWDs7QUFDQXBYLFFBQUUwQyxJQUFGLENBQU82TCxNQUFNOVIsT0FBYixFQUFzQixVQUFDbVcsQ0FBRCxFQUFJK0UsQ0FBSjtBQ3FEbEIsZURwREhQLFNBQVN4UixJQUFULENBQWM7QUFBQ2tGLGlCQUFPOEgsQ0FBUjtBQUFXL1AsaUJBQU84VTtBQUFsQixTQUFkLENDb0RHO0FEckRKOztBQUVBcEosWUFBTTlSLE9BQU4sR0FBZ0IyYSxRQUFoQjtBQ3lEQzs7QUR2REYsUUFBR2xkLE9BQU9xRixRQUFWO0FBQ0M5QyxnQkFBVThSLE1BQU05UixPQUFoQjs7QUFDQSxVQUFHQSxXQUFXdUQsRUFBRXVILFVBQUYsQ0FBYTlLLE9BQWIsQ0FBZDtBQUNDOFIsY0FBTTZJLFFBQU4sR0FBaUI3SSxNQUFNOVIsT0FBTixDQUFjMkgsUUFBZCxFQUFqQjtBQUhGO0FBQUE7QUFLQzNILGdCQUFVOFIsTUFBTTZJLFFBQWhCOztBQUNBLFVBQUczYSxXQUFXdUQsRUFBRW9DLFFBQUYsQ0FBVzNGLE9BQVgsQ0FBZDtBQUNDO0FBQ0M4UixnQkFBTTlSLE9BQU4sR0FBZ0JsRSxRQUFPLE1BQVAsRUFBYSxNQUFJa0UsT0FBSixHQUFZLEdBQXpCLENBQWhCO0FBREQsaUJBQUF3YSxNQUFBO0FBRU03WSxrQkFBQTZZLE1BQUE7QUFDTDVZLGtCQUFRRCxLQUFSLENBQWMsbUJBQWlCTyxPQUFPM0IsSUFBeEIsR0FBNkIsTUFBN0IsR0FBbUN1UixNQUFNdlIsSUFBdkQsRUFBK0RvQixLQUEvRDtBQUpGO0FBTkQ7QUN1RUU7O0FEM0RGLFFBQUdsRSxPQUFPcUYsUUFBVjtBQUNDd1YsY0FBUXhHLE1BQU13RyxLQUFkOztBQUNBLFVBQUdBLEtBQUg7QUFDQ3hHLGNBQU1xSixNQUFOLEdBQWVySixNQUFNd0csS0FBTixDQUFZM1EsUUFBWixFQUFmO0FBSEY7QUFBQTtBQUtDMlEsY0FBUXhHLE1BQU1xSixNQUFkOztBQUNBLFVBQUc3QyxLQUFIO0FBQ0M7QUFDQ3hHLGdCQUFNd0csS0FBTixHQUFjeGMsUUFBTyxNQUFQLEVBQWEsTUFBSXdjLEtBQUosR0FBVSxHQUF2QixDQUFkO0FBREQsaUJBQUFrQyxNQUFBO0FBRU03WSxrQkFBQTZZLE1BQUE7QUFDTDVZLGtCQUFRRCxLQUFSLENBQWMsbUJBQWlCTyxPQUFPM0IsSUFBeEIsR0FBNkIsTUFBN0IsR0FBbUN1UixNQUFNdlIsSUFBdkQsRUFBK0RvQixLQUEvRDtBQUpGO0FBTkQ7QUMyRUU7O0FEL0RGLFFBQUdsRSxPQUFPcUYsUUFBVjtBQUNDa1ksWUFBTWxKLE1BQU1rSixHQUFaOztBQUNBLFVBQUd6WCxFQUFFdUgsVUFBRixDQUFha1EsR0FBYixDQUFIO0FBQ0NsSixjQUFNc0osSUFBTixHQUFhSixJQUFJclQsUUFBSixFQUFiO0FBSEY7QUFBQTtBQUtDcVQsWUFBTWxKLE1BQU1zSixJQUFaOztBQUNBLFVBQUc3WCxFQUFFb0MsUUFBRixDQUFXcVYsR0FBWCxDQUFIO0FBQ0M7QUFDQ2xKLGdCQUFNa0osR0FBTixHQUFZbGYsUUFBTyxNQUFQLEVBQWEsTUFBSWtmLEdBQUosR0FBUSxHQUFyQixDQUFaO0FBREQsaUJBQUFSLE1BQUE7QUFFTTdZLGtCQUFBNlksTUFBQTtBQUNMNVksa0JBQVFELEtBQVIsQ0FBYyxtQkFBaUJPLE9BQU8zQixJQUF4QixHQUE2QixNQUE3QixHQUFtQ3VSLE1BQU12UixJQUF2RCxFQUErRG9CLEtBQS9EO0FBSkY7QUFORDtBQytFRTs7QURuRUYsUUFBR2xFLE9BQU9xRixRQUFWO0FBQ0NpWSxZQUFNakosTUFBTWlKLEdBQVo7O0FBQ0EsVUFBR3hYLEVBQUV1SCxVQUFGLENBQWFpUSxHQUFiLENBQUg7QUFDQ2pKLGNBQU11SixJQUFOLEdBQWFOLElBQUlwVCxRQUFKLEVBQWI7QUFIRjtBQUFBO0FBS0NvVCxZQUFNakosTUFBTXVKLElBQVo7O0FBQ0EsVUFBRzlYLEVBQUVvQyxRQUFGLENBQVdvVixHQUFYLENBQUg7QUFDQztBQUNDakosZ0JBQU1pSixHQUFOLEdBQVlqZixRQUFPLE1BQVAsRUFBYSxNQUFJaWYsR0FBSixHQUFRLEdBQXJCLENBQVo7QUFERCxpQkFBQVAsTUFBQTtBQUVNN1ksa0JBQUE2WSxNQUFBO0FBQ0w1WSxrQkFBUUQsS0FBUixDQUFjLG1CQUFpQk8sT0FBTzNCLElBQXhCLEdBQTZCLE1BQTdCLEdBQW1DdVIsTUFBTXZSLElBQXZELEVBQStEb0IsS0FBL0Q7QUFKRjtBQU5EO0FDbUZFOztBRHZFRixRQUFHbEUsT0FBT3FGLFFBQVY7QUFDQyxVQUFHZ1AsTUFBTUcsUUFBVDtBQUNDMkksZ0JBQVE5SSxNQUFNRyxRQUFOLENBQWVsUyxJQUF2Qjs7QUFDQSxZQUFHNmEsU0FBU3JYLEVBQUV1SCxVQUFGLENBQWE4UCxLQUFiLENBQVQsSUFBZ0NBLFVBQVNsWCxNQUF6QyxJQUFtRGtYLFVBQVNqWSxNQUE1RCxJQUFzRWlZLFVBQVNVLE1BQS9FLElBQXlGVixVQUFTVyxPQUFsRyxJQUE2RyxDQUFDaFksRUFBRVcsT0FBRixDQUFVMFcsS0FBVixDQUFqSDtBQUNDOUksZ0JBQU1HLFFBQU4sQ0FBZTJJLEtBQWYsR0FBdUJBLE1BQU1qVCxRQUFOLEVBQXZCO0FBSEY7QUFERDtBQUFBO0FBTUMsVUFBR21LLE1BQU1HLFFBQVQ7QUFDQzJJLGdCQUFROUksTUFBTUcsUUFBTixDQUFlMkksS0FBdkI7O0FBQ0EsWUFBR0EsU0FBU3JYLEVBQUVvQyxRQUFGLENBQVdpVixLQUFYLENBQVo7QUFDQztBQUNDOUksa0JBQU1HLFFBQU4sQ0FBZWxTLElBQWYsR0FBc0JqRSxRQUFPLE1BQVAsRUFBYSxNQUFJOGUsS0FBSixHQUFVLEdBQXZCLENBQXRCO0FBREQsbUJBQUFKLE1BQUE7QUFFTTdZLG9CQUFBNlksTUFBQTtBQUNMNVksb0JBQVFELEtBQVIsQ0FBYyw2QkFBZCxFQUE2Q21RLEtBQTdDLEVBQW9EblEsS0FBcEQ7QUFKRjtBQUZEO0FBTkQ7QUMyRkU7O0FEN0VGLFFBQUdsRSxPQUFPcUYsUUFBVjtBQUVDRix3QkFBa0JrUCxNQUFNbFAsZUFBeEI7QUFDQStGLHFCQUFlbUosTUFBTW5KLFlBQXJCO0FBQ0E5Rix1QkFBaUJpUCxNQUFNalAsY0FBdkI7QUFDQWdZLDJCQUFxQi9JLE1BQU0rSSxrQkFBM0I7QUFDQXZZLHdCQUFrQndQLE1BQU14UCxlQUF4Qjs7QUFFQSxVQUFHTSxtQkFBbUJXLEVBQUV1SCxVQUFGLENBQWFsSSxlQUFiLENBQXRCO0FBQ0NrUCxjQUFNMEosZ0JBQU4sR0FBeUI1WSxnQkFBZ0IrRSxRQUFoQixFQUF6QjtBQzZFRTs7QUQzRUgsVUFBR2dCLGdCQUFnQnBGLEVBQUV1SCxVQUFGLENBQWFuQyxZQUFiLENBQW5CO0FBQ0NtSixjQUFNMkosYUFBTixHQUFzQjlTLGFBQWFoQixRQUFiLEVBQXRCO0FDNkVFOztBRDNFSCxVQUFHOUUsa0JBQWtCVSxFQUFFdUgsVUFBRixDQUFhakksY0FBYixDQUFyQjtBQUNDaVAsY0FBTTRKLGVBQU4sR0FBd0I3WSxlQUFlOEUsUUFBZixFQUF4QjtBQzZFRTs7QUQ1RUgsVUFBR2tULHNCQUFzQnRYLEVBQUV1SCxVQUFGLENBQWErUCxrQkFBYixDQUF6QjtBQUNDL0ksY0FBTTZKLG1CQUFOLEdBQTRCZCxtQkFBbUJsVCxRQUFuQixFQUE1QjtBQzhFRTs7QUQ1RUgsVUFBR3JGLG1CQUFtQmlCLEVBQUV1SCxVQUFGLENBQWF4SSxlQUFiLENBQXRCO0FBQ0N3UCxjQUFNOEosZ0JBQU4sR0FBeUJ0WixnQkFBZ0JxRixRQUFoQixFQUF6QjtBQXBCRjtBQUFBO0FBdUJDL0Usd0JBQWtCa1AsTUFBTTBKLGdCQUFOLElBQTBCMUosTUFBTWxQLGVBQWxEO0FBQ0ErRixxQkFBZW1KLE1BQU0ySixhQUFyQjtBQUNBNVksdUJBQWlCaVAsTUFBTTRKLGVBQXZCO0FBQ0FiLDJCQUFxQi9JLE1BQU02SixtQkFBM0I7QUFDQXJaLHdCQUFrQndQLE1BQU04SixnQkFBTixJQUEwQjlKLE1BQU14UCxlQUFsRDs7QUFFQSxVQUFHTSxtQkFBbUJXLEVBQUVvQyxRQUFGLENBQVcvQyxlQUFYLENBQXRCO0FBQ0NrUCxjQUFNbFAsZUFBTixHQUF3QjlHLFFBQU8sTUFBUCxFQUFhLE1BQUk4RyxlQUFKLEdBQW9CLEdBQWpDLENBQXhCO0FDNkVFOztBRDNFSCxVQUFHK0YsZ0JBQWdCcEYsRUFBRW9DLFFBQUYsQ0FBV2dELFlBQVgsQ0FBbkI7QUFDQ21KLGNBQU1uSixZQUFOLEdBQXFCN00sUUFBTyxNQUFQLEVBQWEsTUFBSTZNLFlBQUosR0FBaUIsR0FBOUIsQ0FBckI7QUM2RUU7O0FEM0VILFVBQUc5RixrQkFBa0JVLEVBQUVvQyxRQUFGLENBQVc5QyxjQUFYLENBQXJCO0FBQ0NpUCxjQUFNalAsY0FBTixHQUF1Qi9HLFFBQU8sTUFBUCxFQUFhLE1BQUkrRyxjQUFKLEdBQW1CLEdBQWhDLENBQXZCO0FDNkVFOztBRDNFSCxVQUFHZ1ksc0JBQXNCdFgsRUFBRW9DLFFBQUYsQ0FBV2tWLGtCQUFYLENBQXpCO0FBQ0MvSSxjQUFNK0ksa0JBQU4sR0FBMkIvZSxRQUFPLE1BQVAsRUFBYSxNQUFJK2Usa0JBQUosR0FBdUIsR0FBcEMsQ0FBM0I7QUM2RUU7O0FEM0VILFVBQUd2WSxtQkFBbUJpQixFQUFFb0MsUUFBRixDQUFXckQsZUFBWCxDQUF0QjtBQUNDd1AsY0FBTXhQLGVBQU4sR0FBd0J4RyxRQUFPLE1BQVAsRUFBYSxNQUFJd0csZUFBSixHQUFvQixHQUFqQyxDQUF4QjtBQTFDRjtBQ3dIRTs7QUQ1RUYsUUFBRzdFLE9BQU9xRixRQUFWO0FBQ0M0VyxxQkFBZTVILE1BQU00SCxZQUFyQjs7QUFDQSxVQUFHQSxnQkFBZ0JuVyxFQUFFdUgsVUFBRixDQUFhNE8sWUFBYixDQUFuQjtBQUNDNUgsY0FBTStKLGFBQU4sR0FBc0IvSixNQUFNNEgsWUFBTixDQUFtQi9SLFFBQW5CLEVBQXRCO0FBSEY7QUFBQTtBQUtDK1IscUJBQWU1SCxNQUFNK0osYUFBckI7O0FBRUEsVUFBRyxDQUFDbkMsWUFBRCxJQUFpQm5XLEVBQUVvQyxRQUFGLENBQVdtTSxNQUFNNEgsWUFBakIsQ0FBakIsSUFBbUQ1SCxNQUFNNEgsWUFBTixDQUFtQjFPLFVBQW5CLENBQThCLFVBQTlCLENBQXREO0FBQ0MwTyx1QkFBZTVILE1BQU00SCxZQUFyQjtBQzhFRTs7QUQ1RUgsVUFBR0EsZ0JBQWdCblcsRUFBRW9DLFFBQUYsQ0FBVytULFlBQVgsQ0FBbkI7QUFDQztBQUNDNUgsZ0JBQU00SCxZQUFOLEdBQXFCNWQsUUFBTyxNQUFQLEVBQWEsTUFBSTRkLFlBQUosR0FBaUIsR0FBOUIsQ0FBckI7QUFERCxpQkFBQWMsTUFBQTtBQUVNN1ksa0JBQUE2WSxNQUFBO0FBQ0w1WSxrQkFBUUQsS0FBUixDQUFjLG1CQUFpQk8sT0FBTzNCLElBQXhCLEdBQTZCLE1BQTdCLEdBQW1DdVIsTUFBTXZSLElBQXZELEVBQStEb0IsS0FBL0Q7QUFKRjtBQVZEO0FDK0ZFOztBRC9FRixRQUFHbEUsT0FBT3FGLFFBQVY7QUFDQ2dZLDJCQUFxQmhKLE1BQU1nSixrQkFBM0I7O0FBQ0EsVUFBR0Esc0JBQXNCdlgsRUFBRXVILFVBQUYsQ0FBYWdRLGtCQUFiLENBQXpCO0FDaUZJLGVEaEZIaEosTUFBTWdLLG1CQUFOLEdBQTRCaEssTUFBTWdKLGtCQUFOLENBQXlCblQsUUFBekIsRUNnRnpCO0FEbkZMO0FBQUE7QUFLQ21ULDJCQUFxQmhKLE1BQU1nSyxtQkFBM0I7O0FBQ0EsVUFBR2hCLHNCQUFzQnZYLEVBQUVvQyxRQUFGLENBQVdtVixrQkFBWCxDQUF6QjtBQUNDO0FDa0ZLLGlCRGpGSmhKLE1BQU1nSixrQkFBTixHQUEyQmhmLFFBQU8sTUFBUCxFQUFhLE1BQUlnZixrQkFBSixHQUF1QixHQUFwQyxDQ2lGdkI7QURsRkwsaUJBQUFOLE1BQUE7QUFFTTdZLGtCQUFBNlksTUFBQTtBQ21GRCxpQkRsRko1WSxRQUFRRCxLQUFSLENBQWMsbUJBQWlCTyxPQUFPM0IsSUFBeEIsR0FBNkIsTUFBN0IsR0FBbUN1UixNQUFNdlIsSUFBdkQsRUFBK0RvQixLQUEvRCxDQ2tGSTtBRHRGTjtBQU5EO0FDK0ZFO0FEL1BIOztBQTRLQTRCLElBQUV3USxPQUFGLENBQVU3UixPQUFPa0IsVUFBakIsRUFBNkIsVUFBQ2lRLFNBQUQsRUFBWTlMLEdBQVo7QUFDNUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FvQkEsSUFBR2hFLEVBQUV1SCxVQUFGLENBQWF1SSxVQUFVdE4sT0FBdkIsQ0FBSDtBQUNDLFVBQUd0SSxPQUFPcUYsUUFBVjtBQ3VGSSxlRHRGSHVRLFVBQVUwSSxRQUFWLEdBQXFCMUksVUFBVXROLE9BQVYsQ0FBa0I0QixRQUFsQixFQ3NGbEI7QUR4Rkw7QUFBQSxXQUdLLElBQUdwRSxFQUFFb0MsUUFBRixDQUFXME4sVUFBVTBJLFFBQXJCLENBQUg7QUFDSixVQUFHdGUsT0FBTzBHLFFBQVY7QUN3RkksZUR2RkhrUCxVQUFVdE4sT0FBVixHQUFvQmpLLFFBQU8sTUFBUCxFQUFhLE1BQUl1WCxVQUFVMEksUUFBZCxHQUF1QixHQUFwQyxDQ3VGakI7QUR6RkE7QUFBQTtBQzRGRixhRHhGRnhZLEVBQUV3USxPQUFGLENBQVVWLFVBQVV0TixPQUFwQixFQUE2QixVQUFDRyxNQUFELEVBQVNjLE1BQVQ7QUFDNUIsWUFBR3pELEVBQUVXLE9BQUYsQ0FBVWdDLE1BQVYsQ0FBSDtBQUNDLGNBQUd6SSxPQUFPcUYsUUFBVjtBQUNDLGdCQUFHb0QsT0FBT0csTUFBUCxLQUFpQixDQUFqQixJQUF1QjlDLEVBQUV1SCxVQUFGLENBQWE1RSxPQUFPLENBQVAsQ0FBYixDQUExQjtBQUNDQSxxQkFBTyxDQUFQLElBQVlBLE9BQU8sQ0FBUCxFQUFVeUIsUUFBVixFQUFaO0FDeUZNLHFCRHhGTnpCLE9BQU8sQ0FBUCxJQUFZLFVDd0ZOO0FEMUZQLG1CQUdLLElBQUdBLE9BQU9HLE1BQVAsS0FBaUIsQ0FBakIsSUFBdUI5QyxFQUFFeVksTUFBRixDQUFTOVYsT0FBTyxDQUFQLENBQVQsQ0FBMUI7QUN5RkUscUJEdEZOQSxPQUFPLENBQVAsSUFBWSxNQ3NGTjtBRDdGUjtBQUFBO0FBU0MsZ0JBQUdBLE9BQU9HLE1BQVAsS0FBaUIsQ0FBakIsSUFBdUI5QyxFQUFFb0MsUUFBRixDQUFXTyxPQUFPLENBQVAsQ0FBWCxDQUF2QixJQUFpREEsT0FBTyxDQUFQLE1BQWEsVUFBakU7QUFDQ0EscUJBQU8sQ0FBUCxJQUFZcEssUUFBTyxNQUFQLEVBQWEsTUFBSW9LLE9BQU8sQ0FBUCxDQUFKLEdBQWMsR0FBM0IsQ0FBWjtBQUNBQSxxQkFBTytWLEdBQVA7QUN3Rks7O0FEdkZOLGdCQUFHL1YsT0FBT0csTUFBUCxLQUFpQixDQUFqQixJQUF1QjlDLEVBQUVvQyxRQUFGLENBQVdPLE9BQU8sQ0FBUCxDQUFYLENBQXZCLElBQWlEQSxPQUFPLENBQVAsTUFBYSxNQUFqRTtBQUNDQSxxQkFBTyxDQUFQLElBQVksSUFBSXNCLElBQUosQ0FBU3RCLE9BQU8sQ0FBUCxDQUFULENBQVo7QUN5Rk0scUJEeEZOQSxPQUFPK1YsR0FBUCxFQ3dGTTtBRHRHUjtBQUREO0FBQUEsZUFnQkssSUFBRzFZLEVBQUU4RSxRQUFGLENBQVduQyxNQUFYLENBQUg7QUFDSixjQUFHekksT0FBT3FGLFFBQVY7QUFDQyxnQkFBR1MsRUFBRXVILFVBQUYsQ0FBQTVFLFVBQUEsT0FBYUEsT0FBUUUsS0FBckIsR0FBcUIsTUFBckIsQ0FBSDtBQzJGTyxxQkQxRk5GLE9BQU84TixNQUFQLEdBQWdCOU4sT0FBT0UsS0FBUCxDQUFhdUIsUUFBYixFQzBGVjtBRDNGUCxtQkFFSyxJQUFHcEUsRUFBRXlZLE1BQUYsQ0FBQTlWLFVBQUEsT0FBU0EsT0FBUUUsS0FBakIsR0FBaUIsTUFBakIsQ0FBSDtBQzJGRSxxQkQxRk5GLE9BQU9nVyxRQUFQLEdBQWtCLElDMEZaO0FEOUZSO0FBQUE7QUFNQyxnQkFBRzNZLEVBQUVvQyxRQUFGLENBQUFPLFVBQUEsT0FBV0EsT0FBUThOLE1BQW5CLEdBQW1CLE1BQW5CLENBQUg7QUM0Rk8scUJEM0ZOOU4sT0FBT0UsS0FBUCxHQUFldEssUUFBTyxNQUFQLEVBQWEsTUFBSW9LLE9BQU84TixNQUFYLEdBQWtCLEdBQS9CLENDMkZUO0FENUZQLG1CQUVLLElBQUc5TixPQUFPZ1csUUFBUCxLQUFtQixJQUF0QjtBQzRGRSxxQkQzRk5oVyxPQUFPRSxLQUFQLEdBQWUsSUFBSW9CLElBQUosQ0FBU3RCLE9BQU9FLEtBQWhCLENDMkZUO0FEcEdSO0FBREk7QUN3R0Q7QUR6SEwsUUN3RkU7QUFtQ0Q7QUR2Skg7O0FBeURBLE1BQUczSSxPQUFPcUYsUUFBVjtBQUNDLFFBQUdaLE9BQU9pYSxJQUFQLElBQWUsQ0FBQzVZLEVBQUVvQyxRQUFGLENBQVd6RCxPQUFPaWEsSUFBbEIsQ0FBbkI7QUFDQ2phLGFBQU9pYSxJQUFQLEdBQWM1TixLQUFLQyxTQUFMLENBQWV0TSxPQUFPaWEsSUFBdEIsRUFBNEIsVUFBQzVVLEdBQUQsRUFBTTZVLEdBQU47QUFDekMsWUFBRzdZLEVBQUV1SCxVQUFGLENBQWFzUixHQUFiLENBQUg7QUFDQyxpQkFBT0EsTUFBTSxFQUFiO0FBREQ7QUFHQyxpQkFBT0EsR0FBUDtBQ2lHRztBRHJHUyxRQUFkO0FBRkY7QUFBQSxTQU9LLElBQUczZSxPQUFPMEcsUUFBVjtBQUNKLFFBQUdqQyxPQUFPaWEsSUFBVjtBQUNDamEsYUFBT2lhLElBQVAsR0FBYzVOLEtBQUt1RixLQUFMLENBQVc1UixPQUFPaWEsSUFBbEIsRUFBd0IsVUFBQzVVLEdBQUQsRUFBTTZVLEdBQU47QUFDckMsWUFBRzdZLEVBQUVvQyxRQUFGLENBQVd5VyxHQUFYLEtBQW1CQSxJQUFJcFIsVUFBSixDQUFlLFVBQWYsQ0FBdEI7QUFDQyxpQkFBT2xQLFFBQU8sTUFBUCxFQUFhLE1BQUlzZ0IsR0FBSixHQUFRLEdBQXJCLENBQVA7QUFERDtBQUdDLGlCQUFPQSxHQUFQO0FDb0dHO0FEeEdTLFFBQWQ7QUFGRztBQzZHSjs7QURyR0QsTUFBRzNlLE9BQU8wRyxRQUFWO0FBQ0NaLE1BQUV3USxPQUFGLENBQVU3UixPQUFPd1MsYUFBakIsRUFBZ0MsVUFBQzJILGNBQUQ7QUFDL0IsVUFBRzlZLEVBQUU4RSxRQUFGLENBQVdnVSxjQUFYLENBQUg7QUN1R0ksZUR0R0g5WSxFQUFFd1EsT0FBRixDQUFVc0ksY0FBVixFQUEwQixVQUFDRCxHQUFELEVBQU03VSxHQUFOO0FBQ3pCLGNBQUE1RixLQUFBOztBQUFBLGNBQUc0RixRQUFPLFNBQVAsSUFBb0JoRSxFQUFFb0MsUUFBRixDQUFXeVcsR0FBWCxDQUF2QjtBQUNDO0FDd0dPLHFCRHZHTkMsZUFBZTlVLEdBQWYsSUFBc0J6TCxRQUFPLE1BQVAsRUFBYSxNQUFJc2dCLEdBQUosR0FBUSxHQUFyQixDQ3VHaEI7QUR4R1AscUJBQUE1QixNQUFBO0FBRU03WSxzQkFBQTZZLE1BQUE7QUN5R0MscUJEeEdONVksUUFBUUQsS0FBUixDQUFjLGNBQWQsRUFBOEJ5YSxHQUE5QixDQ3dHTTtBRDVHUjtBQzhHSztBRC9HTixVQ3NHRztBQVdEO0FEbkhKO0FBREQ7QUFVQzdZLE1BQUV3USxPQUFGLENBQVU3UixPQUFPd1MsYUFBakIsRUFBZ0MsVUFBQzJILGNBQUQ7QUFDL0IsVUFBRzlZLEVBQUU4RSxRQUFGLENBQVdnVSxjQUFYLENBQUg7QUM4R0ksZUQ3R0g5WSxFQUFFd1EsT0FBRixDQUFVc0ksY0FBVixFQUEwQixVQUFDRCxHQUFELEVBQU03VSxHQUFOO0FBQ3pCLGNBQUdBLFFBQU8sU0FBUCxJQUFvQmhFLEVBQUV1SCxVQUFGLENBQWFzUixHQUFiLENBQXZCO0FDOEdNLG1CRDdHTEMsZUFBZTlVLEdBQWYsSUFBc0I2VSxJQUFJelUsUUFBSixFQzZHakI7QUFDRDtBRGhITixVQzZHRztBQUtEO0FEcEhKO0FDc0hBOztBRGhIRCxNQUFHbEssT0FBTzBHLFFBQVY7QUFDQ1osTUFBRXdRLE9BQUYsQ0FBVTdSLE9BQU84RixXQUFqQixFQUE4QixVQUFDcVUsY0FBRDtBQUM3QixVQUFHOVksRUFBRThFLFFBQUYsQ0FBV2dVLGNBQVgsQ0FBSDtBQ2tISSxlRGpISDlZLEVBQUV3USxPQUFGLENBQVVzSSxjQUFWLEVBQTBCLFVBQUNELEdBQUQsRUFBTTdVLEdBQU47QUFDekIsY0FBQTVGLEtBQUE7O0FBQUEsY0FBRzRGLFFBQU8sU0FBUCxJQUFvQmhFLEVBQUVvQyxRQUFGLENBQVd5VyxHQUFYLENBQXZCO0FBQ0M7QUNtSE8scUJEbEhOQyxlQUFlOVUsR0FBZixJQUFzQnpMLFFBQU8sTUFBUCxFQUFhLE1BQUlzZ0IsR0FBSixHQUFRLEdBQXJCLENDa0hoQjtBRG5IUCxxQkFBQTVCLE1BQUE7QUFFTTdZLHNCQUFBNlksTUFBQTtBQ29IQyxxQkRuSE41WSxRQUFRRCxLQUFSLENBQWMsY0FBZCxFQUE4QnlhLEdBQTlCLENDbUhNO0FEdkhSO0FDeUhLO0FEMUhOLFVDaUhHO0FBV0Q7QUQ5SEo7QUFERDtBQVVDN1ksTUFBRXdRLE9BQUYsQ0FBVTdSLE9BQU84RixXQUFqQixFQUE4QixVQUFDcVUsY0FBRDtBQUM3QixVQUFHOVksRUFBRThFLFFBQUYsQ0FBV2dVLGNBQVgsQ0FBSDtBQ3lISSxlRHhISDlZLEVBQUV3USxPQUFGLENBQVVzSSxjQUFWLEVBQTBCLFVBQUNELEdBQUQsRUFBTTdVLEdBQU47QUFDekIsY0FBR0EsUUFBTyxTQUFQLElBQW9CaEUsRUFBRXVILFVBQUYsQ0FBYXNSLEdBQWIsQ0FBdkI7QUN5SE0sbUJEeEhMQyxlQUFlOVUsR0FBZixJQUFzQjZVLElBQUl6VSxRQUFKLEVDd0hqQjtBQUNEO0FEM0hOLFVDd0hHO0FBS0Q7QUQvSEo7QUNpSUE7O0FEM0hELFNBQU96RixNQUFQO0FBcFd1QixDQUF4QixDOzs7Ozs7Ozs7Ozs7QUVqQ0RwRyxRQUFROEosUUFBUixHQUFtQixFQUFuQjtBQUVBOUosUUFBUThKLFFBQVIsQ0FBaUIwVyxNQUFqQixHQUEwQixTQUExQjs7QUFFQXhnQixRQUFROEosUUFBUixDQUFpQjJXLHdCQUFqQixHQUE0QyxVQUFDQyxNQUFELEVBQVFDLGFBQVI7QUFDM0MsTUFBQUMsR0FBQSxFQUFBQyxHQUFBO0FBQUFELFFBQU0sZUFBTjtBQUVBQyxRQUFNRixjQUFjekcsT0FBZCxDQUFzQjBHLEdBQXRCLEVBQTJCLFVBQUNFLENBQUQsRUFBSUMsRUFBSjtBQUNoQyxXQUFPTCxTQUFTSyxHQUFHN0csT0FBSCxDQUFXLE9BQVgsRUFBbUIsS0FBbkIsRUFBMEJBLE9BQTFCLENBQWtDLE9BQWxDLEVBQTBDLEtBQTFDLEVBQWlEQSxPQUFqRCxDQUF5RCxXQUF6RCxFQUFxRSxRQUFyRSxDQUFoQjtBQURLLElBQU47QUFHQSxTQUFPMkcsR0FBUDtBQU4yQyxDQUE1Qzs7QUFRQTdnQixRQUFROEosUUFBUixDQUFpQkMsWUFBakIsR0FBZ0MsVUFBQ2lYLFdBQUQ7QUFDL0IsTUFBR3ZaLEVBQUVvQyxRQUFGLENBQVdtWCxXQUFYLEtBQTJCQSxZQUFZdlgsT0FBWixDQUFvQixHQUFwQixJQUEyQixDQUFDLENBQXZELElBQTREdVgsWUFBWXZYLE9BQVosQ0FBb0IsR0FBcEIsSUFBMkIsQ0FBQyxDQUEzRjtBQUNDLFdBQU8sSUFBUDtBQ0VDOztBRERGLFNBQU8sS0FBUDtBQUgrQixDQUFoQzs7QUFLQXpKLFFBQVE4SixRQUFSLENBQWlCekMsR0FBakIsR0FBdUIsVUFBQzJaLFdBQUQsRUFBY0MsUUFBZCxFQUF3Qi9jLE9BQXhCO0FBQ3RCLE1BQUFnZCxPQUFBLEVBQUEvTCxJQUFBLEVBQUF2VSxDQUFBLEVBQUFvUixNQUFBOztBQUFBLE1BQUdnUCxlQUFldlosRUFBRW9DLFFBQUYsQ0FBV21YLFdBQVgsQ0FBbEI7QUFFQyxRQUFHLENBQUN2WixFQUFFMFosU0FBRixDQUFBamQsV0FBQSxPQUFZQSxRQUFTOE4sTUFBckIsR0FBcUIsTUFBckIsQ0FBSjtBQUNDQSxlQUFTLElBQVQ7QUNJRTs7QURGSGtQLGNBQVUsRUFBVjtBQUNBQSxjQUFVelosRUFBRXVLLE1BQUYsQ0FBU2tQLE9BQVQsRUFBa0JELFFBQWxCLENBQVY7O0FBQ0EsUUFBR2pQLE1BQUg7QUFDQ2tQLGdCQUFVelosRUFBRXVLLE1BQUYsQ0FBU2tQLE9BQVQsRUFBa0JsaEIsUUFBUThOLGNBQVIsQ0FBQTVKLFdBQUEsT0FBdUJBLFFBQVNtRixNQUFoQyxHQUFnQyxNQUFoQyxFQUFBbkYsV0FBQSxPQUF3Q0EsUUFBUytFLE9BQWpELEdBQWlELE1BQWpELENBQWxCLENBQVY7QUNJRTs7QURISCtYLGtCQUFjaGhCLFFBQVE4SixRQUFSLENBQWlCMlcsd0JBQWpCLENBQTBDLE1BQTFDLEVBQWtETyxXQUFsRCxDQUFkOztBQUVBO0FBQ0M3TCxhQUFPblYsUUFBUTRjLGFBQVIsQ0FBc0JvRSxXQUF0QixFQUFtQ0UsT0FBbkMsQ0FBUDtBQUNBLGFBQU8vTCxJQUFQO0FBRkQsYUFBQXRQLEtBQUE7QUFHTWpGLFVBQUFpRixLQUFBO0FBQ0xDLGNBQVFELEtBQVIsQ0FBYywyQkFBeUJtYixXQUF2QyxFQUFzRHBnQixDQUF0RDs7QUFDQSxVQUFHZSxPQUFPMEcsUUFBVjtBQ0tLLFlBQUksT0FBTytZLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLFdBQVcsSUFBaEQsRUFBc0Q7QURKMURBLGlCQUFRdmIsS0FBUixDQUFjLHNCQUFkO0FBREQ7QUNRSTs7QUROSixZQUFNLElBQUlsRSxPQUFPeU0sS0FBWCxDQUFpQixHQUFqQixFQUFzQiwyQkFBeUI0UyxXQUF6QixHQUF1Q3BnQixDQUE3RCxDQUFOO0FBbEJGO0FDMkJFOztBRFBGLFNBQU9vZ0IsV0FBUDtBQXJCc0IsQ0FBdkIsQzs7Ozs7Ozs7Ozs7O0FFakJBLElBQUF0WixLQUFBO0FBQUFBLFFBQVFuRyxRQUFRLE9BQVIsQ0FBUjtBQUNBdkIsUUFBUXlJLGFBQVIsR0FBd0IsRUFBeEI7O0FBRUF6SSxRQUFRcWhCLGdCQUFSLEdBQTJCLFVBQUNsYSxXQUFEO0FBQzFCLE1BQUdBLFlBQVkrSCxVQUFaLENBQXVCLFlBQXZCLENBQUg7QUFDQy9ILGtCQUFjQSxZQUFZK1MsT0FBWixDQUFvQixJQUFJbUMsTUFBSixDQUFXLEtBQVgsRUFBa0IsR0FBbEIsQ0FBcEIsRUFBNEMsR0FBNUMsQ0FBZDtBQ0lDOztBREhGLFNBQU9sVixXQUFQO0FBSDBCLENBQTNCOztBQUtBbkgsUUFBUTRILE1BQVIsR0FBaUIsVUFBQzFELE9BQUQ7QUFDaEIsTUFBQW9kLFdBQUEsRUFBQUMsR0FBQSxFQUFBQyxpQkFBQSxFQUFBN0YsV0FBQSxFQUFBOEYsbUJBQUEsRUFBQXhWLFdBQUEsRUFBQS9ELEdBQUEsRUFBQUMsSUFBQSxFQUFBc0wsSUFBQSxFQUFBQyxJQUFBLEVBQUFnTyxNQUFBLEVBQUFDLElBQUE7O0FBQUFMLGdCQUFjdGhCLFFBQVE0aEIsVUFBdEI7O0FBQ0EsTUFBR2pnQixPQUFPMEcsUUFBVjtBQUNDaVosa0JBQWM7QUFBQ2hJLGVBQVN0WixRQUFRNGhCLFVBQVIsQ0FBbUJ0SSxPQUE3QjtBQUF1Qy9QLGNBQVEsRUFBL0M7QUFBbURzVSxnQkFBVSxFQUE3RDtBQUFpRWdFLHNCQUFnQjtBQUFqRixLQUFkO0FDWUM7O0FEWEZGLFNBQU8sSUFBUDs7QUFDQSxNQUFJLENBQUN6ZCxRQUFRTyxJQUFiO0FBQ0NxQixZQUFRRCxLQUFSLENBQWMzQixPQUFkO0FBQ0EsVUFBTSxJQUFJa0ssS0FBSixDQUFVLDBDQUFWLENBQU47QUNhQzs7QURYRnVULE9BQUs5WSxHQUFMLEdBQVczRSxRQUFRMkUsR0FBUixJQUFlM0UsUUFBUU8sSUFBbEM7QUFDQWtkLE9BQUtwYSxLQUFMLEdBQWFyRCxRQUFRcUQsS0FBckI7QUFDQW9hLE9BQUtsZCxJQUFMLEdBQVlQLFFBQVFPLElBQXBCO0FBQ0FrZCxPQUFLcFAsS0FBTCxHQUFhck8sUUFBUXFPLEtBQXJCO0FBQ0FvUCxPQUFLRyxJQUFMLEdBQVk1ZCxRQUFRNGQsSUFBcEI7QUFDQUgsT0FBS0ksV0FBTCxHQUFtQjdkLFFBQVE2ZCxXQUEzQjtBQUNBSixPQUFLSyxPQUFMLEdBQWU5ZCxRQUFROGQsT0FBdkI7QUFDQUwsT0FBS3RCLElBQUwsR0FBWW5jLFFBQVFtYyxJQUFwQjtBQUNBc0IsT0FBS3pWLFdBQUwsR0FBbUJoSSxRQUFRZ0ksV0FBM0I7QUFDQXlWLE9BQUsvSSxhQUFMLEdBQXFCMVUsUUFBUTBVLGFBQTdCO0FBQ0ErSSxPQUFLTSxPQUFMLEdBQWUvZCxRQUFRK2QsT0FBUixJQUFtQixHQUFsQzs7QUFDQSxNQUFHLENBQUN4YSxFQUFFMFosU0FBRixDQUFZamQsUUFBUWdlLFNBQXBCLENBQUQsSUFBb0NoZSxRQUFRZ2UsU0FBUixLQUFxQixJQUE1RDtBQUNDUCxTQUFLTyxTQUFMLEdBQWlCLElBQWpCO0FBREQ7QUFHQ1AsU0FBS08sU0FBTCxHQUFpQixLQUFqQjtBQ2FDOztBRFpGLE1BQUd2Z0IsT0FBTzBHLFFBQVY7QUFDQyxRQUFHWixFQUFFb1EsR0FBRixDQUFNM1QsT0FBTixFQUFlLHFCQUFmLENBQUg7QUFDQ3lkLFdBQUtRLG1CQUFMLEdBQTJCamUsUUFBUWllLG1CQUFuQztBQ2NFOztBRGJILFFBQUcxYSxFQUFFb1EsR0FBRixDQUFNM1QsT0FBTixFQUFlLGlCQUFmLENBQUg7QUFDQ3lkLFdBQUtTLGVBQUwsR0FBdUJsZSxRQUFRa2UsZUFBL0I7QUNlRTs7QURkSCxRQUFHM2EsRUFBRW9RLEdBQUYsQ0FBTTNULE9BQU4sRUFBZSxtQkFBZixDQUFIO0FBQ0N5ZCxXQUFLcEgsaUJBQUwsR0FBeUJyVyxRQUFRcVcsaUJBQWpDO0FBTkY7QUN1QkU7O0FEaEJGb0gsT0FBS1UsYUFBTCxHQUFxQm5lLFFBQVFtZSxhQUE3QjtBQUNBVixPQUFLdlUsWUFBTCxHQUFvQmxKLFFBQVFrSixZQUE1QjtBQUNBdVUsT0FBS25VLFlBQUwsR0FBb0J0SixRQUFRc0osWUFBNUI7QUFDQW1VLE9BQUtsVSxZQUFMLEdBQW9CdkosUUFBUXVKLFlBQTVCO0FBQ0FrVSxPQUFLelUsWUFBTCxHQUFvQmhKLFFBQVFnSixZQUE1QjtBQUNBeVUsT0FBS2pVLGFBQUwsR0FBcUJ4SixRQUFRd0osYUFBN0I7O0FBQ0EsTUFBR3hKLFFBQVFvZSxNQUFYO0FBQ0NYLFNBQUtXLE1BQUwsR0FBY3BlLFFBQVFvZSxNQUF0QjtBQ2tCQzs7QURqQkZYLE9BQUtqTCxNQUFMLEdBQWN4UyxRQUFRd1MsTUFBdEI7QUFDQWlMLE9BQUtZLFVBQUwsR0FBbUJyZSxRQUFRcWUsVUFBUixLQUFzQixNQUF2QixJQUFxQ3JlLFFBQVFxZSxVQUEvRDtBQUNBWixPQUFLYSxNQUFMLEdBQWN0ZSxRQUFRc2UsTUFBdEI7QUFDQWIsT0FBS2MsWUFBTCxHQUFvQnZlLFFBQVF1ZSxZQUE1QjtBQUNBZCxPQUFLaFUsZ0JBQUwsR0FBd0J6SixRQUFReUosZ0JBQWhDO0FBQ0FnVSxPQUFLOVQsY0FBTCxHQUFzQjNKLFFBQVEySixjQUE5Qjs7QUFDQSxNQUFHbE0sT0FBTzBHLFFBQVY7QUFDQyxRQUFHckksUUFBUTRRLGlCQUFSLENBQTBCckksUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBMUIsQ0FBSDtBQUNDbVosV0FBS2UsV0FBTCxHQUFtQixLQUFuQjtBQUREO0FBR0NmLFdBQUtlLFdBQUwsR0FBbUJ4ZSxRQUFRd2UsV0FBM0I7QUFDQWYsV0FBS2dCLE9BQUwsR0FBZWxiLEVBQUVDLEtBQUYsQ0FBUXhELFFBQVF5ZSxPQUFoQixDQUFmO0FBTEY7QUFBQTtBQU9DaEIsU0FBS2dCLE9BQUwsR0FBZWxiLEVBQUVDLEtBQUYsQ0FBUXhELFFBQVF5ZSxPQUFoQixDQUFmO0FBQ0FoQixTQUFLZSxXQUFMLEdBQW1CeGUsUUFBUXdlLFdBQTNCO0FDb0JDOztBRG5CRmYsT0FBS2lCLFdBQUwsR0FBbUIxZSxRQUFRMGUsV0FBM0I7QUFDQWpCLE9BQUtrQixjQUFMLEdBQXNCM2UsUUFBUTJlLGNBQTlCO0FBQ0FsQixPQUFLbUIsUUFBTCxHQUFnQnJiLEVBQUVDLEtBQUYsQ0FBUXhELFFBQVE0ZSxRQUFoQixDQUFoQjtBQUNBbkIsT0FBS29CLGNBQUwsR0FBc0I3ZSxRQUFRNmUsY0FBOUI7QUFDQXBCLE9BQUtxQixZQUFMLEdBQW9COWUsUUFBUThlLFlBQTVCO0FBQ0FyQixPQUFLc0IsbUJBQUwsR0FBMkIvZSxRQUFRK2UsbUJBQW5DO0FBQ0F0QixPQUFLL1QsZ0JBQUwsR0FBd0IxSixRQUFRMEosZ0JBQWhDO0FBQ0ErVCxPQUFLdUIsYUFBTCxHQUFxQmhmLFFBQVFnZixhQUE3QjtBQUNBdkIsT0FBS3dCLGVBQUwsR0FBdUJqZixRQUFRaWYsZUFBL0I7QUFDQXhCLE9BQUt5QixrQkFBTCxHQUEwQmxmLFFBQVFrZixrQkFBbEM7QUFDQXpCLE9BQUswQixPQUFMLEdBQWVuZixRQUFRbWYsT0FBdkI7QUFDQTFCLE9BQUsyQixPQUFMLEdBQWVwZixRQUFRb2YsT0FBdkI7QUFDQTNCLE9BQUs0QixjQUFMLEdBQXNCcmYsUUFBUXFmLGNBQTlCOztBQUNBLE1BQUc5YixFQUFFb1EsR0FBRixDQUFNM1QsT0FBTixFQUFlLGdCQUFmLENBQUg7QUFDQ3lkLFNBQUs2QixjQUFMLEdBQXNCdGYsUUFBUXNmLGNBQTlCO0FDcUJDOztBRHBCRjdCLE9BQUs4QixXQUFMLEdBQW1CLEtBQW5COztBQUNBLE1BQUd2ZixRQUFRd2YsYUFBWDtBQUNDL0IsU0FBSytCLGFBQUwsR0FBcUJ4ZixRQUFRd2YsYUFBN0I7QUNzQkM7O0FEckJGLE1BQUksQ0FBQ3hmLFFBQVFxRixNQUFiO0FBQ0N6RCxZQUFRRCxLQUFSLENBQWMzQixPQUFkO0FBQ0EsVUFBTSxJQUFJa0ssS0FBSixDQUFVLDRDQUFWLENBQU47QUN1QkM7O0FEckJGdVQsT0FBS3BZLE1BQUwsR0FBYzdCLE1BQU14RCxRQUFRcUYsTUFBZCxDQUFkOztBQUVBOUIsSUFBRTBDLElBQUYsQ0FBT3dYLEtBQUtwWSxNQUFaLEVBQW9CLFVBQUN5TSxLQUFELEVBQVFELFVBQVI7QUFDbkIsUUFBR0MsTUFBTTJOLE9BQVQ7QUFDQ2hDLFdBQUtoUSxjQUFMLEdBQXNCb0UsVUFBdEI7QUFERCxXQUVLLElBQUdBLGVBQWMsTUFBZCxJQUF3QixDQUFDNEwsS0FBS2hRLGNBQWpDO0FBQ0pnUSxXQUFLaFEsY0FBTCxHQUFzQm9FLFVBQXRCO0FDc0JFOztBRHJCSCxRQUFHQyxNQUFNNE4sT0FBVDtBQUNDakMsV0FBSzhCLFdBQUwsR0FBbUIxTixVQUFuQjtBQ3VCRTs7QUR0QkgsUUFBR3BVLE9BQU8wRyxRQUFWO0FBQ0MsVUFBR3JJLFFBQVE0USxpQkFBUixDQUEwQnJJLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQTFCLENBQUg7QUFDQyxZQUFHdU4sZUFBYyxPQUFqQjtBQUNDQyxnQkFBTTZOLFVBQU4sR0FBbUIsSUFBbkI7QUN3QkssaUJEdkJMN04sTUFBTVUsTUFBTixHQUFlLEtDdUJWO0FEMUJQO0FBREQ7QUM4Qkc7QURyQ0o7O0FBYUEsTUFBRyxDQUFDeFMsUUFBUXdmLGFBQVQsSUFBMEJ4ZixRQUFRd2YsYUFBUixLQUF5QixjQUF0RDtBQUNDamMsTUFBRTBDLElBQUYsQ0FBT21YLFlBQVkvWCxNQUFuQixFQUEyQixVQUFDeU0sS0FBRCxFQUFRRCxVQUFSO0FBQzFCLFVBQUcsQ0FBQzRMLEtBQUtwWSxNQUFMLENBQVl3TSxVQUFaLENBQUo7QUFDQzRMLGFBQUtwWSxNQUFMLENBQVl3TSxVQUFaLElBQTBCLEVBQTFCO0FDMkJHOztBQUNELGFEM0JINEwsS0FBS3BZLE1BQUwsQ0FBWXdNLFVBQVosSUFBMEJ0TyxFQUFFdUssTUFBRixDQUFTdkssRUFBRUMsS0FBRixDQUFRc08sS0FBUixDQUFULEVBQXlCMkwsS0FBS3BZLE1BQUwsQ0FBWXdNLFVBQVosQ0FBekIsQ0MyQnZCO0FEOUJKO0FDZ0NDOztBRDNCRnRPLElBQUUwQyxJQUFGLENBQU93WCxLQUFLcFksTUFBWixFQUFvQixVQUFDeU0sS0FBRCxFQUFRRCxVQUFSO0FBQ25CLFFBQUdDLE1BQU0vUixJQUFOLEtBQWMsWUFBakI7QUM2QkksYUQ1QkgrUixNQUFNdUksUUFBTixHQUFpQixJQzRCZDtBRDdCSixXQUVLLElBQUd2SSxNQUFNL1IsSUFBTixLQUFjLFNBQWpCO0FDNkJELGFENUJIK1IsTUFBTXVJLFFBQU4sR0FBaUIsSUM0QmQ7QUQ3QkMsV0FFQSxJQUFHdkksTUFBTS9SLElBQU4sS0FBYyxTQUFqQjtBQzZCRCxhRDVCSCtSLE1BQU11SSxRQUFOLEdBQWlCLElDNEJkO0FBQ0Q7QURuQ0o7O0FBUUFvRCxPQUFLcmEsVUFBTCxHQUFrQixFQUFsQjtBQUNBcVUsZ0JBQWMzYixRQUFRMGIsb0JBQVIsQ0FBNkJpRyxLQUFLbGQsSUFBbEMsQ0FBZDs7QUFDQWdELElBQUUwQyxJQUFGLENBQU9qRyxRQUFRb0QsVUFBZixFQUEyQixVQUFDdVIsSUFBRCxFQUFPaUwsU0FBUDtBQUMxQixRQUFBbk0sS0FBQTtBQUFBQSxZQUFRM1gsUUFBUXFYLGVBQVIsQ0FBd0JzRSxXQUF4QixFQUFxQzlDLElBQXJDLEVBQTJDaUwsU0FBM0MsQ0FBUjtBQytCRSxXRDlCRm5DLEtBQUtyYSxVQUFMLENBQWdCd2MsU0FBaEIsSUFBNkJuTSxLQzhCM0I7QURoQ0g7O0FBSUFnSyxPQUFLOUQsUUFBTCxHQUFnQnBXLEVBQUVDLEtBQUYsQ0FBUTRaLFlBQVl6RCxRQUFwQixDQUFoQjs7QUFDQXBXLElBQUUwQyxJQUFGLENBQU9qRyxRQUFRMlosUUFBZixFQUF5QixVQUFDaEYsSUFBRCxFQUFPaUwsU0FBUDtBQUN4QixRQUFHLENBQUNuQyxLQUFLOUQsUUFBTCxDQUFjaUcsU0FBZCxDQUFKO0FBQ0NuQyxXQUFLOUQsUUFBTCxDQUFjaUcsU0FBZCxJQUEyQixFQUEzQjtBQytCRTs7QUQ5QkhuQyxTQUFLOUQsUUFBTCxDQUFjaUcsU0FBZCxFQUF5QnJmLElBQXpCLEdBQWdDcWYsU0FBaEM7QUNnQ0UsV0QvQkZuQyxLQUFLOUQsUUFBTCxDQUFjaUcsU0FBZCxJQUEyQnJjLEVBQUV1SyxNQUFGLENBQVN2SyxFQUFFQyxLQUFGLENBQVFpYSxLQUFLOUQsUUFBTCxDQUFjaUcsU0FBZCxDQUFSLENBQVQsRUFBNENqTCxJQUE1QyxDQytCekI7QURuQ0g7O0FBTUE4SSxPQUFLckksT0FBTCxHQUFlN1IsRUFBRUMsS0FBRixDQUFRNFosWUFBWWhJLE9BQXBCLENBQWY7O0FBQ0E3UixJQUFFMEMsSUFBRixDQUFPakcsUUFBUW9WLE9BQWYsRUFBd0IsVUFBQ1QsSUFBRCxFQUFPaUwsU0FBUDtBQUN2QixRQUFBQyxRQUFBOztBQUFBLFFBQUcsQ0FBQ3BDLEtBQUtySSxPQUFMLENBQWF3SyxTQUFiLENBQUo7QUFDQ25DLFdBQUtySSxPQUFMLENBQWF3SyxTQUFiLElBQTBCLEVBQTFCO0FDaUNFOztBRGhDSEMsZUFBV3RjLEVBQUVDLEtBQUYsQ0FBUWlhLEtBQUtySSxPQUFMLENBQWF3SyxTQUFiLENBQVIsQ0FBWDtBQUNBLFdBQU9uQyxLQUFLckksT0FBTCxDQUFhd0ssU0FBYixDQUFQO0FDa0NFLFdEakNGbkMsS0FBS3JJLE9BQUwsQ0FBYXdLLFNBQWIsSUFBMEJyYyxFQUFFdUssTUFBRixDQUFTK1IsUUFBVCxFQUFtQmxMLElBQW5CLENDaUN4QjtBRHRDSDs7QUFPQXBSLElBQUUwQyxJQUFGLENBQU93WCxLQUFLckksT0FBWixFQUFxQixVQUFDVCxJQUFELEVBQU9pTCxTQUFQO0FDa0NsQixXRGpDRmpMLEtBQUtwVSxJQUFMLEdBQVlxZixTQ2lDVjtBRGxDSDs7QUFHQW5DLE9BQUt2VixlQUFMLEdBQXVCcE0sUUFBUStMLGlCQUFSLENBQTBCNFYsS0FBS2xkLElBQS9CLENBQXZCO0FBR0FrZCxPQUFLRSxjQUFMLEdBQXNCcGEsRUFBRUMsS0FBRixDQUFRNFosWUFBWU8sY0FBcEIsQ0FBdEI7O0FBd0JBLE9BQU8zZCxRQUFRMmQsY0FBZjtBQUNDM2QsWUFBUTJkLGNBQVIsR0FBeUIsRUFBekI7QUNTQzs7QURSRixNQUFHLEVBQUMsQ0FBQTNaLE1BQUFoRSxRQUFBMmQsY0FBQSxZQUFBM1osSUFBeUI4YixLQUF6QixHQUF5QixNQUExQixDQUFIO0FBQ0M5ZixZQUFRMmQsY0FBUixDQUF1Qm1DLEtBQXZCLEdBQStCdmMsRUFBRUMsS0FBRixDQUFRaWEsS0FBS0UsY0FBTCxDQUFvQixPQUFwQixDQUFSLENBQS9CO0FDVUM7O0FEVEYsTUFBRyxFQUFDLENBQUExWixPQUFBakUsUUFBQTJkLGNBQUEsWUFBQTFaLEtBQXlCeUcsSUFBekIsR0FBeUIsTUFBMUIsQ0FBSDtBQUNDMUssWUFBUTJkLGNBQVIsQ0FBdUJqVCxJQUF2QixHQUE4Qm5ILEVBQUVDLEtBQUYsQ0FBUWlhLEtBQUtFLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBUixDQUE5QjtBQ1dDOztBRFZGcGEsSUFBRTBDLElBQUYsQ0FBT2pHLFFBQVEyZCxjQUFmLEVBQStCLFVBQUNoSixJQUFELEVBQU9pTCxTQUFQO0FBQzlCLFFBQUcsQ0FBQ25DLEtBQUtFLGNBQUwsQ0FBb0JpQyxTQUFwQixDQUFKO0FBQ0NuQyxXQUFLRSxjQUFMLENBQW9CaUMsU0FBcEIsSUFBaUMsRUFBakM7QUNZRTs7QUFDRCxXRFpGbkMsS0FBS0UsY0FBTCxDQUFvQmlDLFNBQXBCLElBQWlDcmMsRUFBRXVLLE1BQUYsQ0FBU3ZLLEVBQUVDLEtBQUYsQ0FBUWlhLEtBQUtFLGNBQUwsQ0FBb0JpQyxTQUFwQixDQUFSLENBQVQsRUFBa0RqTCxJQUFsRCxDQ1kvQjtBRGZIOztBQU1BLE1BQUdsWCxPQUFPMEcsUUFBVjtBQUNDNEQsa0JBQWMvSCxRQUFRK0gsV0FBdEI7QUFDQXdWLDBCQUFBeFYsZUFBQSxPQUFzQkEsWUFBYXdWLG1CQUFuQyxHQUFtQyxNQUFuQzs7QUFDQSxRQUFBQSx1QkFBQSxPQUFHQSxvQkFBcUJsWCxNQUF4QixHQUF3QixNQUF4QjtBQUNDaVgsMEJBQUEsQ0FBQS9OLE9BQUF2UCxRQUFBb0QsVUFBQSxhQUFBb00sT0FBQUQsS0FBQXdRLEdBQUEsWUFBQXZRLEtBQTZDN0ssR0FBN0MsR0FBNkMsTUFBN0MsR0FBNkMsTUFBN0M7O0FBQ0EsVUFBRzJZLGlCQUFIO0FBRUN2VixvQkFBWXdWLG1CQUFaLEdBQWtDaGEsRUFBRStPLEdBQUYsQ0FBTWlMLG1CQUFOLEVBQTJCLFVBQUN5QyxjQUFEO0FBQ3JELGNBQUcxQyxzQkFBcUIwQyxjQUF4QjtBQ1dBLG1CRFg0QyxLQ1c1QztBRFhBO0FDYUEsbUJEYnVEQSxjQ2F2RDtBQUNEO0FEZjJCLFVBQWxDO0FBSkY7QUNzQkc7O0FEaEJIdkMsU0FBSzFWLFdBQUwsR0FBbUIsSUFBSWtZLFdBQUosQ0FBZ0JsWSxXQUFoQixDQUFuQjtBQVREO0FBdUJDMFYsU0FBSzFWLFdBQUwsR0FBbUIsSUFBbkI7QUNNQzs7QURKRnNWLFFBQU12aEIsUUFBUW9rQixnQkFBUixDQUF5QmxnQixPQUF6QixDQUFOO0FBRUFsRSxVQUFRRSxXQUFSLENBQW9CcWhCLElBQUk4QyxLQUF4QixJQUFpQzlDLEdBQWpDO0FBRUFJLE9BQUs1aEIsRUFBTCxHQUFVd2hCLEdBQVY7QUFFQUksT0FBS3pZLGdCQUFMLEdBQXdCcVksSUFBSThDLEtBQTVCO0FBRUEzQyxXQUFTMWhCLFFBQVFza0IsZUFBUixDQUF3QjNDLElBQXhCLENBQVQ7QUFDQUEsT0FBS0QsTUFBTCxHQUFjLElBQUlwYixZQUFKLENBQWlCb2IsTUFBakIsQ0FBZDs7QUFDQSxNQUFHQyxLQUFLbGQsSUFBTCxLQUFhLE9BQWIsSUFBeUJrZCxLQUFLbGQsSUFBTCxLQUFhLHNCQUF0QyxJQUFnRSxDQUFDa2QsS0FBS0ssT0FBdEUsSUFBaUYsQ0FBQ3ZhLEVBQUU4YyxRQUFGLENBQVcsQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixXQUFuQixFQUFnQyxlQUFoQyxFQUFpRCxzQkFBakQsRUFBeUUsa0JBQXpFLENBQVgsRUFBeUc1QyxLQUFLbGQsSUFBOUcsQ0FBckY7QUFDQyxRQUFHOUMsT0FBTzBHLFFBQVY7QUFDQ2taLFVBQUlpRCxZQUFKLENBQWlCN0MsS0FBS0QsTUFBdEIsRUFBOEI7QUFBQ3hILGlCQUFTO0FBQVYsT0FBOUI7QUFERDtBQUdDcUgsVUFBSWlELFlBQUosQ0FBaUI3QyxLQUFLRCxNQUF0QixFQUE4QjtBQUFDeEgsaUJBQVM7QUFBVixPQUE5QjtBQUpGO0FDV0U7O0FETkYsTUFBR3lILEtBQUtsZCxJQUFMLEtBQWEsT0FBaEI7QUFDQzhjLFFBQUlrRCxhQUFKLEdBQW9COUMsS0FBS0QsTUFBekI7QUNRQzs7QURORixNQUFHamEsRUFBRThjLFFBQUYsQ0FBVyxDQUFDLE9BQUQsRUFBVSxPQUFWLEVBQW1CLFdBQW5CLEVBQWdDLGVBQWhDLENBQVgsRUFBNkQ1QyxLQUFLbGQsSUFBbEUsQ0FBSDtBQUNDLFFBQUc5QyxPQUFPMEcsUUFBVjtBQUNDa1osVUFBSWlELFlBQUosQ0FBaUI3QyxLQUFLRCxNQUF0QixFQUE4QjtBQUFDeEgsaUJBQVM7QUFBVixPQUE5QjtBQUZGO0FDYUU7O0FEVEZsYSxVQUFReUksYUFBUixDQUFzQmtaLEtBQUt6WSxnQkFBM0IsSUFBK0N5WSxJQUEvQztBQUVBLFNBQU9BLElBQVA7QUF6TmdCLENBQWpCOztBQTJQQTNoQixRQUFRMGtCLDBCQUFSLEdBQXFDLFVBQUN0ZSxNQUFEO0FBQ3BDLFNBQU8sZUFBUDtBQURvQyxDQUFyQzs7QUFnQkF6RSxPQUFPQyxPQUFQLENBQWU7QUFDZCxNQUFHLENBQUM1QixRQUFRMmtCLGVBQVQsSUFBNEIza0IsUUFBUUMsT0FBdkM7QUNqQ0csV0RrQ0Z3SCxFQUFFMEMsSUFBRixDQUFPbkssUUFBUUMsT0FBZixFQUF3QixVQUFDbUcsTUFBRDtBQ2pDcEIsYURrQ0gsSUFBSXBHLFFBQVE0SCxNQUFaLENBQW1CeEIsTUFBbkIsQ0NsQ0c7QURpQ0osTUNsQ0U7QUFHRDtBRDZCSCxHOzs7Ozs7Ozs7Ozs7QUVuUkFwRyxRQUFRNGtCLGdCQUFSLEdBQTJCLFVBQUNDLFdBQUQ7QUFDMUIsTUFBQUMsU0FBQSxFQUFBNWdCLE9BQUE7QUFBQUEsWUFBVTJnQixZQUFZM2dCLE9BQXRCOztBQUNBLE9BQU9BLE9BQVA7QUFDQztBQ0VDOztBRERGNGdCLGNBQVlELFlBQVlDLFNBQXhCOztBQUNBLE1BQUcsQ0FBQ3JkLEVBQUV1SCxVQUFGLENBQWE5SyxPQUFiLENBQUQsSUFBMkI0Z0IsU0FBM0IsSUFBeUNBLGNBQWEsTUFBekQ7QUFFQzVnQixZQUFRK1QsT0FBUixDQUFnQixVQUFDOE0sVUFBRDtBQUNmLFVBQUcsT0FBT0EsV0FBV3phLEtBQWxCLEtBQTJCLFFBQTlCO0FBQ0M7QUNFRzs7QURESixVQUFHLENBQ0YsUUFERSxFQUVGLFVBRkUsRUFHRixTQUhFLEVBSURiLE9BSkMsQ0FJT3FiLFNBSlAsSUFJb0IsQ0FBQyxDQUp4QjtBQ0dLLGVERUpDLFdBQVd6YSxLQUFYLEdBQW1Ca1YsT0FBT3VGLFdBQVd6YSxLQUFsQixDQ0ZmO0FESEwsYUFNSyxJQUFHd2EsY0FBYSxTQUFoQjtBQ0RBLGVER0pDLFdBQVd6YSxLQUFYLEdBQW1CeWEsV0FBV3phLEtBQVgsS0FBb0IsTUNIbkM7QUFDRDtBRFRMO0FDV0M7O0FEQ0YsU0FBT3BHLE9BQVA7QUFuQjBCLENBQTNCOztBQXFCQWxFLFFBQVFza0IsZUFBUixHQUEwQixVQUFDcGQsR0FBRDtBQUN6QixNQUFBOGQsU0FBQSxFQUFBdEQsTUFBQTs7QUFBQSxPQUFPeGEsR0FBUDtBQUNDO0FDR0M7O0FERkZ3YSxXQUFTLEVBQVQ7QUFFQXNELGNBQVksRUFBWjs7QUFFQXZkLElBQUUwQyxJQUFGLENBQU9qRCxJQUFJcUMsTUFBWCxFQUFvQixVQUFDeU0sS0FBRCxFQUFRRCxVQUFSO0FBQ25CLFFBQUcsQ0FBQ3RPLEVBQUVvUSxHQUFGLENBQU03QixLQUFOLEVBQWEsTUFBYixDQUFKO0FBQ0NBLFlBQU12UixJQUFOLEdBQWFzUixVQUFiO0FDRUU7O0FBQ0QsV0RGRmlQLFVBQVUzWCxJQUFWLENBQWUySSxLQUFmLENDRUU7QURMSDs7QUFLQXZPLElBQUUwQyxJQUFGLENBQU8xQyxFQUFFdUQsTUFBRixDQUFTZ2EsU0FBVCxFQUFvQixTQUFwQixDQUFQLEVBQXVDLFVBQUNoUCxLQUFEO0FBRXRDLFFBQUFoSyxPQUFBLEVBQUFpWixRQUFBLEVBQUF0RixhQUFBLEVBQUF1RixhQUFBLEVBQUFDLGNBQUEsRUFBQXBQLFVBQUEsRUFBQXFQLEVBQUEsRUFBQUMsTUFBQSxFQUFBQyxXQUFBLEVBQUE5WixNQUFBLEVBQUFTLFdBQUEsRUFBQS9ELEdBQUEsRUFBQUMsSUFBQSxFQUFBc0wsSUFBQSxFQUFBQyxJQUFBOztBQUFBcUMsaUJBQWFDLE1BQU12UixJQUFuQjtBQUVBMmdCLFNBQUssRUFBTDs7QUFDQSxRQUFHcFAsTUFBTXdHLEtBQVQ7QUFDQzRJLFNBQUc1SSxLQUFILEdBQVd4RyxNQUFNd0csS0FBakI7QUNFRTs7QURESDRJLE9BQUdqUCxRQUFILEdBQWMsRUFBZDtBQUNBaVAsT0FBR2pQLFFBQUgsQ0FBWW9QLFFBQVosR0FBdUJ2UCxNQUFNdVAsUUFBN0I7QUFDQUgsT0FBR2pQLFFBQUgsQ0FBWXRKLFlBQVosR0FBMkJtSixNQUFNbkosWUFBakM7QUFFQXFZLG9CQUFBLENBQUFoZCxNQUFBOE4sTUFBQUcsUUFBQSxZQUFBak8sSUFBZ0NqRSxJQUFoQyxHQUFnQyxNQUFoQzs7QUFFQSxRQUFHK1IsTUFBTS9SLElBQU4sS0FBYyxNQUFkLElBQXdCK1IsTUFBTS9SLElBQU4sS0FBYyxPQUF6QztBQUNDbWhCLFNBQUduaEIsSUFBSCxHQUFVNEMsTUFBVjs7QUFDQSxVQUFHbVAsTUFBTXVQLFFBQVQ7QUFDQ0gsV0FBR25oQixJQUFILEdBQVUsQ0FBQzRDLE1BQUQsQ0FBVjtBQUNBdWUsV0FBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsTUFBbkI7QUFKRjtBQUFBLFdBS0ssSUFBRytSLE1BQU0vUixJQUFOLEtBQWMsUUFBZCxJQUEwQitSLE1BQU0vUixJQUFOLEtBQWMsU0FBM0M7QUFDSm1oQixTQUFHbmhCLElBQUgsR0FBVSxDQUFDNEMsTUFBRCxDQUFWO0FBQ0F1ZSxTQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQixNQUFuQjtBQUZJLFdBR0EsSUFBRytSLE1BQU0vUixJQUFOLEtBQWMsTUFBakI7QUFDSm1oQixTQUFHbmhCLElBQUgsR0FBVTRDLE1BQVY7QUFDQXVlLFNBQUdqUCxRQUFILENBQVlsUyxJQUFaLEdBQW1CLFVBQW5CO0FBQ0FtaEIsU0FBR2pQLFFBQUgsQ0FBWXFQLElBQVosR0FBbUJ4UCxNQUFNd1AsSUFBTixJQUFjLEVBQWpDOztBQUNBLFVBQUd4UCxNQUFNeVAsUUFBVDtBQUNDTCxXQUFHalAsUUFBSCxDQUFZc1AsUUFBWixHQUF1QnpQLE1BQU15UCxRQUE3QjtBQUxHO0FBQUEsV0FNQSxJQUFHelAsTUFBTS9SLElBQU4sS0FBYyxVQUFqQjtBQUNKbWhCLFNBQUduaEIsSUFBSCxHQUFVNEMsTUFBVjtBQUNBdWUsU0FBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsVUFBbkI7QUFDQW1oQixTQUFHalAsUUFBSCxDQUFZcVAsSUFBWixHQUFtQnhQLE1BQU13UCxJQUFOLElBQWMsQ0FBakM7QUFISSxXQUlBLElBQUd4UCxNQUFNL1IsSUFBTixLQUFjLFVBQWpCO0FBQ0ptaEIsU0FBR25oQixJQUFILEdBQVU0QyxNQUFWO0FBQ0F1ZSxTQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQixVQUFuQjtBQUZJLFdBR0EsSUFBRytSLE1BQU0vUixJQUFOLEtBQWMsTUFBakI7QUFDSm1oQixTQUFHbmhCLElBQUgsR0FBVXlILElBQVY7O0FBQ0EsVUFBRy9KLE9BQU8wRyxRQUFWO0FBQ0MsWUFBR3VELFFBQVE4WixRQUFSLE1BQXNCOVosUUFBUStaLEtBQVIsRUFBekI7QUFDQyxjQUFHL1osUUFBUWdhLEtBQVIsRUFBSDtBQUVDUixlQUFHalAsUUFBSCxDQUFZMFAsWUFBWixHQUNDO0FBQUE1aEIsb0JBQU0sYUFBTjtBQUNBNmhCLDBCQUFZLEtBRFo7QUFFQUMsZ0NBQ0M7QUFBQTloQixzQkFBTSxNQUFOO0FBQ0EraEIsK0JBQWUsWUFEZjtBQUVBQyw0QkFBWTtBQUZaO0FBSEQsYUFERDtBQUZEO0FBV0NiLGVBQUdqUCxRQUFILENBQVkwUCxZQUFaLEdBQ0M7QUFBQTVoQixvQkFBTSxxQkFBTjtBQUNBaWlCLGlDQUNDO0FBQUFqaUIsc0JBQU07QUFBTjtBQUZELGFBREQ7QUFaRjtBQUFBO0FBaUJDbWhCLGFBQUdqUCxRQUFILENBQVlnUSxTQUFaLEdBQXdCLFlBQXhCO0FBRUFmLGFBQUdqUCxRQUFILENBQVkwUCxZQUFaLEdBQ0M7QUFBQTVoQixrQkFBTSxhQUFOO0FBQ0E2aEIsd0JBQVksS0FEWjtBQUVBQyw4QkFDQztBQUFBOWhCLG9CQUFNLE1BQU47QUFDQStoQiw2QkFBZTtBQURmO0FBSEQsV0FERDtBQXBCRjtBQUZJO0FBQUEsV0E0QkEsSUFBR2hRLE1BQU0vUixJQUFOLEtBQWMsTUFBakI7QUFDSm1oQixTQUFHbmhCLElBQUgsR0FBVXlILElBQVY7O0FBQ0EsVUFBRy9KLE9BQU8wRyxRQUFWO0FBRUMrYyxXQUFHalAsUUFBSCxDQUFZMFAsWUFBWixHQUNDO0FBQUE1aEIsZ0JBQU0sYUFBTjtBQUNBNmhCLHNCQUFZLEtBRFo7QUFFQUMsNEJBQ0M7QUFBQTloQixrQkFBTSxNQUFOO0FBQ0EraEIsMkJBQWU7QUFEZjtBQUhELFNBREQ7QUFKRztBQUFBLFdBVUEsSUFBR2hRLE1BQU0vUixJQUFOLEtBQWMsVUFBakI7QUFDSm1oQixTQUFHbmhCLElBQUgsR0FBVXlILElBQVY7O0FBQ0EsVUFBRy9KLE9BQU8wRyxRQUFWO0FBQ0MsWUFBR3VELFFBQVE4WixRQUFSLE1BQXNCOVosUUFBUStaLEtBQVIsRUFBekI7QUFDQyxjQUFHL1osUUFBUWdhLEtBQVIsRUFBSDtBQUVDUixlQUFHalAsUUFBSCxDQUFZMFAsWUFBWixHQUNDO0FBQUE1aEIsb0JBQU0sYUFBTjtBQUNBOGhCLGdDQUNDO0FBQUE5aEIsc0JBQU0sVUFBTjtBQUNBK2hCLCtCQUFlLGtCQURmO0FBRUFDLDRCQUFZO0FBRlo7QUFGRCxhQUREO0FBRkQ7QUFVQ2IsZUFBR2pQLFFBQUgsQ0FBWTBQLFlBQVosR0FDQztBQUFBNWhCLG9CQUFNLHFCQUFOO0FBQ0FpaUIsaUNBQ0M7QUFBQWppQixzQkFBTTtBQUFOO0FBRkQsYUFERDtBQVhGO0FBQUE7QUFpQkNtaEIsYUFBR2pQLFFBQUgsQ0FBWTBQLFlBQVosR0FDQztBQUFBNWhCLGtCQUFNLGFBQU47QUFDQThoQiw4QkFDQztBQUFBOWhCLG9CQUFNLFVBQU47QUFDQStoQiw2QkFBZTtBQURmO0FBRkQsV0FERDtBQWxCRjtBQUZJO0FBQUEsV0F5QkEsSUFBR2hRLE1BQU0vUixJQUFOLEtBQWMsVUFBakI7QUFDSm1oQixTQUFHbmhCLElBQUgsR0FBVSxDQUFDMkQsTUFBRCxDQUFWO0FBREksV0FFQSxJQUFHb08sTUFBTS9SLElBQU4sS0FBYyxNQUFqQjtBQUNKbWhCLFNBQUduaEIsSUFBSCxHQUFVNEMsTUFBVjs7QUFDQSxVQUFHbEYsT0FBTzBHLFFBQVY7QUFDQ21ELGlCQUFTSSxRQUFRSixNQUFSLEVBQVQ7O0FBQ0EsWUFBR0EsV0FBVSxPQUFWLElBQXFCQSxXQUFVLE9BQWxDO0FBQ0NBLG1CQUFTLE9BQVQ7QUFERDtBQUdDQSxtQkFBUyxPQUFUO0FDaUJJOztBRGhCTDRaLFdBQUdqUCxRQUFILENBQVkwUCxZQUFaLEdBQ0M7QUFBQTVoQixnQkFBTSxZQUFOO0FBQ0EsbUJBQU8sbUJBRFA7QUFFQS9DLG9CQUNDO0FBQUFrbEIsb0JBQVEsR0FBUjtBQUNBQywyQkFBZSxJQURmO0FBRUFDLHFCQUFVLENBQ1QsQ0FBQyxPQUFELEVBQVUsQ0FBQyxPQUFELENBQVYsQ0FEUyxFQUVULENBQUMsT0FBRCxFQUFVLENBQUMsTUFBRCxFQUFTLFdBQVQsRUFBc0IsUUFBdEIsRUFBZ0MsT0FBaEMsQ0FBVixDQUZTLEVBR1QsQ0FBQyxPQUFELEVBQVUsQ0FBQyxVQUFELENBQVYsQ0FIUyxFQUlULENBQUMsT0FBRCxFQUFVLENBQUMsT0FBRCxDQUFWLENBSlMsRUFLVCxDQUFDLE1BQUQsRUFBUyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsV0FBYixDQUFULENBTFMsRUFNVCxDQUFDLE9BQUQsRUFBVSxDQUFDLE9BQUQsQ0FBVixDQU5TLEVBT1QsQ0FBQyxRQUFELEVBQVcsQ0FBQyxNQUFELEVBQVMsU0FBVCxDQUFYLENBUFMsRUFRVCxDQUFDLE1BQUQsRUFBUyxDQUFDLFVBQUQsQ0FBVCxDQVJTLENBRlY7QUFZQUMsdUJBQVcsQ0FBQyxPQUFELEVBQVUsZUFBVixFQUEyQixhQUEzQixFQUEwQyxXQUExQyxFQUF1RCxRQUF2RCxFQUFpRSxJQUFqRSxFQUFzRSxJQUF0RSxFQUEyRSxNQUEzRSxFQUFrRixJQUFsRixFQUF1RixJQUF2RixFQUE0RixJQUE1RixFQUFpRyxJQUFqRyxDQVpYO0FBYUFDLGtCQUFNaGI7QUFiTjtBQUhELFNBREQ7QUFSRztBQUFBLFdBMkJBLElBQUl3SyxNQUFNL1IsSUFBTixLQUFjLFFBQWQsSUFBMEIrUixNQUFNL1IsSUFBTixLQUFjLGVBQTVDO0FBQ0ptaEIsU0FBR25oQixJQUFILEdBQVU0QyxNQUFWO0FBQ0F1ZSxTQUFHalAsUUFBSCxDQUFZc1EsUUFBWixHQUF1QnpRLE1BQU15USxRQUE3Qjs7QUFDQSxVQUFHelEsTUFBTXVQLFFBQVQ7QUFDQ0gsV0FBR25oQixJQUFILEdBQVUsQ0FBQzRDLE1BQUQsQ0FBVjtBQ1dHOztBRFRKLFVBQUcsQ0FBQ21QLE1BQU1VLE1BQVY7QUFFQzBPLFdBQUdqUCxRQUFILENBQVlsTSxPQUFaLEdBQXNCK0wsTUFBTS9MLE9BQTVCO0FBRUFtYixXQUFHalAsUUFBSCxDQUFZdVEsUUFBWixHQUF1QjFRLE1BQU0yUSxTQUE3Qjs7QUFFQSxZQUFHM1EsTUFBTStJLGtCQUFUO0FBQ0NxRyxhQUFHckcsa0JBQUgsR0FBd0IvSSxNQUFNK0ksa0JBQTlCO0FDUUk7O0FETkxxRyxXQUFHNWUsZUFBSCxHQUF3QndQLE1BQU14UCxlQUFOLEdBQTJCd1AsTUFBTXhQLGVBQWpDLEdBQXNEeEcsUUFBUWdLLGVBQXRGOztBQUVBLFlBQUdnTSxNQUFNbFAsZUFBVDtBQUNDc2UsYUFBR3RlLGVBQUgsR0FBcUJrUCxNQUFNbFAsZUFBM0I7QUNPSTs7QURMTCxZQUFHa1AsTUFBTW5KLFlBQVQ7QUFFQyxjQUFHbEwsT0FBTzBHLFFBQVY7QUFDQyxnQkFBRzJOLE1BQU1qUCxjQUFOLElBQXdCVSxFQUFFdUgsVUFBRixDQUFhZ0gsTUFBTWpQLGNBQW5CLENBQTNCO0FBQ0NxZSxpQkFBR3JlLGNBQUgsR0FBb0JpUCxNQUFNalAsY0FBMUI7QUFERDtBQUdDLGtCQUFHVSxFQUFFb0MsUUFBRixDQUFXbU0sTUFBTW5KLFlBQWpCLENBQUg7QUFDQ29ZLDJCQUFXamxCLFFBQVFDLE9BQVIsQ0FBZ0IrVixNQUFNbkosWUFBdEIsQ0FBWDs7QUFDQSxvQkFBQW9ZLFlBQUEsUUFBQTljLE9BQUE4YyxTQUFBaFosV0FBQSxZQUFBOUQsS0FBMEJ1SCxXQUExQixHQUEwQixNQUExQixHQUEwQixNQUExQjtBQUNDMFYscUJBQUdqUCxRQUFILENBQVl5USxNQUFaLEdBQXFCLElBQXJCOztBQUNBeEIscUJBQUdyZSxjQUFILEdBQW9CLFVBQUM4ZixZQUFEO0FDTVQsMkJETFZDLE1BQU1DLElBQU4sQ0FBVyxvQkFBWCxFQUFpQztBQUNoQy9WLGtDQUFZLHlCQUF1QmhSLFFBQVFnSixhQUFSLENBQXNCZ04sTUFBTW5KLFlBQTVCLEVBQTBDd1gsS0FEN0M7QUFFaEMyQyw4QkFBUSxRQUFNaFIsTUFBTW5KLFlBQU4sQ0FBbUJxTixPQUFuQixDQUEyQixHQUEzQixFQUErQixHQUEvQixDQUZrQjtBQUdoQy9TLG1DQUFhLEtBQUc2TyxNQUFNbkosWUFIVTtBQUloQ29hLGlDQUFXLFFBSnFCO0FBS2hDQyxpQ0FBVyxVQUFDRCxTQUFELEVBQVl4TCxNQUFaO0FBQ1YsNEJBQUFyVixNQUFBO0FBQUFBLGlDQUFTcEcsUUFBUWdJLFNBQVIsQ0FBa0J5VCxPQUFPdFUsV0FBekIsQ0FBVDs7QUFDQSw0QkFBR3NVLE9BQU90VSxXQUFQLEtBQXNCLFNBQXpCO0FDT2MsaUNETmIwZixhQUFhTSxRQUFiLENBQXNCLENBQUM7QUFBQzVVLG1DQUFPa0osT0FBT25SLEtBQVAsQ0FBYWlJLEtBQXJCO0FBQTRCakksbUNBQU9tUixPQUFPblIsS0FBUCxDQUFhN0YsSUFBaEQ7QUFBc0RxZCxrQ0FBTXJHLE9BQU9uUixLQUFQLENBQWF3WDtBQUF6RSwyQkFBRCxDQUF0QixFQUF3R3JHLE9BQU9uUixLQUFQLENBQWE3RixJQUFySCxDQ01hO0FEUGQ7QUNlYyxpQ0RaYm9pQixhQUFhTSxRQUFiLENBQXNCLENBQUM7QUFBQzVVLG1DQUFPa0osT0FBT25SLEtBQVAsQ0FBYWxFLE9BQU91TCxjQUFwQixLQUF1QzhKLE9BQU9uUixLQUFQLENBQWFpSSxLQUFwRCxJQUE2RGtKLE9BQU9uUixLQUFQLENBQWE3RixJQUFsRjtBQUF3RjZGLG1DQUFPbVIsT0FBTzVTO0FBQXRHLDJCQUFELENBQXRCLEVBQW9JNFMsT0FBTzVTLEdBQTNJLENDWWE7QUFNRDtBRDVCa0I7QUFBQSxxQkFBakMsQ0NLVTtBRE5TLG1CQUFwQjtBQUZEO0FBZ0JDdWMscUJBQUdqUCxRQUFILENBQVl5USxNQUFaLEdBQXFCLEtBQXJCO0FBbEJGO0FBSEQ7QUFERDtBQzhDTTs7QUR0Qk4sY0FBR25mLEVBQUUwWixTQUFGLENBQVluTCxNQUFNNFEsTUFBbEIsQ0FBSDtBQUNDeEIsZUFBR2pQLFFBQUgsQ0FBWXlRLE1BQVosR0FBcUI1USxNQUFNNFEsTUFBM0I7QUN3Qks7O0FEdEJOLGNBQUc1USxNQUFNb1IsY0FBVDtBQUNDaEMsZUFBR2pQLFFBQUgsQ0FBWWtSLFdBQVosR0FBMEJyUixNQUFNb1IsY0FBaEM7QUN3Qks7O0FEdEJOLGNBQUdwUixNQUFNc1IsZUFBVDtBQUNDbEMsZUFBR2pQLFFBQUgsQ0FBWW9SLFlBQVosR0FBMkJ2UixNQUFNc1IsZUFBakM7QUN3Qks7O0FEdkJOLGNBQUd0UixNQUFNd1Isa0JBQVQ7QUFDQ3BDLGVBQUdqUCxRQUFILENBQVlzUixnQkFBWixHQUErQnpSLE1BQU13UixrQkFBckM7QUN5Qks7O0FEdkJOLGNBQUd4UixNQUFNbkosWUFBTixLQUFzQixPQUF6QjtBQUNDdVksZUFBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsWUFBbkI7O0FBQ0EsZ0JBQUcsQ0FBQytSLE1BQU1VLE1BQVAsSUFBaUIsQ0FBQ1YsTUFBTXFJLElBQTNCO0FBR0Msa0JBQUdySSxNQUFNZ0osa0JBQU4sS0FBNEIsTUFBL0I7QUFJQyxvQkFBR3JkLE9BQU8wRyxRQUFWO0FBQ0M0RCxnQ0FBQSxDQUFBd0gsT0FBQXZNLElBQUErRSxXQUFBLFlBQUF3SCxLQUErQmpMLEdBQS9CLEtBQWMsTUFBZDtBQUNBOGMsZ0NBQUFyWixlQUFBLE9BQWNBLFlBQWE2RCxjQUEzQixHQUEyQixNQUEzQjs7QUFDQSxzQkFBR3JJLEVBQUVxUSxPQUFGLENBQVUsQ0FBQyxlQUFELEVBQWtCLE9BQWxCLEVBQTJCLGFBQTNCLENBQVYsRUFBcUQ1USxJQUFJekMsSUFBekQsQ0FBSDtBQUVDNmdCLGtDQUFBclosZUFBQSxPQUFjQSxZQUFha0IsZ0JBQTNCLEdBQTJCLE1BQTNCO0FDbUJTOztBRGxCVixzQkFBR21ZLFdBQUg7QUFDQ0YsdUJBQUdqUCxRQUFILENBQVk2SSxrQkFBWixHQUFpQyxLQUFqQztBQUREO0FBR0NvRyx1QkFBR2pQLFFBQUgsQ0FBWTZJLGtCQUFaLEdBQWlDLElBQWpDO0FBVEY7QUFKRDtBQUFBLHFCQWNLLElBQUd2WCxFQUFFdUgsVUFBRixDQUFhZ0gsTUFBTWdKLGtCQUFuQixDQUFIO0FBQ0osb0JBQUdyZCxPQUFPMEcsUUFBVjtBQUVDK2MscUJBQUdqUCxRQUFILENBQVk2SSxrQkFBWixHQUFpQ2hKLE1BQU1nSixrQkFBTixDQUF5QjlYLElBQUkrRSxXQUE3QixDQUFqQztBQUZEO0FBS0NtWixxQkFBR2pQLFFBQUgsQ0FBWTZJLGtCQUFaLEdBQWlDLElBQWpDO0FBTkc7QUFBQTtBQVFKb0csbUJBQUdqUCxRQUFILENBQVk2SSxrQkFBWixHQUFpQ2hKLE1BQU1nSixrQkFBdkM7QUF6QkY7QUFBQTtBQTJCQ29HLGlCQUFHalAsUUFBSCxDQUFZNkksa0JBQVosR0FBaUNoSixNQUFNZ0osa0JBQXZDO0FBN0JGO0FBQUEsaUJBOEJLLElBQUdoSixNQUFNbkosWUFBTixLQUFzQixlQUF6QjtBQUNKdVksZUFBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsV0FBbkI7O0FBQ0EsZ0JBQUcsQ0FBQytSLE1BQU1VLE1BQVAsSUFBaUIsQ0FBQ1YsTUFBTXFJLElBQTNCO0FBR0Msa0JBQUdySSxNQUFNZ0osa0JBQU4sS0FBNEIsTUFBL0I7QUFJQyxvQkFBR3JkLE9BQU8wRyxRQUFWO0FBQ0M0RCxnQ0FBQSxDQUFBeUgsT0FBQXhNLElBQUErRSxXQUFBLFlBQUF5SCxLQUErQmxMLEdBQS9CLEtBQWMsTUFBZDtBQUNBOGMsZ0NBQUFyWixlQUFBLE9BQWNBLFlBQWE2RCxjQUEzQixHQUEyQixNQUEzQjs7QUFDQSxzQkFBR3JJLEVBQUVxUSxPQUFGLENBQVUsQ0FBQyxlQUFELEVBQWtCLE9BQWxCLEVBQTJCLGFBQTNCLENBQVYsRUFBcUQ1USxJQUFJekMsSUFBekQsQ0FBSDtBQUVDNmdCLGtDQUFBclosZUFBQSxPQUFjQSxZQUFha0IsZ0JBQTNCLEdBQTJCLE1BQTNCO0FDaUJTOztBRGhCVixzQkFBR21ZLFdBQUg7QUFDQ0YsdUJBQUdqUCxRQUFILENBQVk2SSxrQkFBWixHQUFpQyxLQUFqQztBQUREO0FBR0NvRyx1QkFBR2pQLFFBQUgsQ0FBWTZJLGtCQUFaLEdBQWlDLElBQWpDO0FBVEY7QUFKRDtBQUFBLHFCQWNLLElBQUd2WCxFQUFFdUgsVUFBRixDQUFhZ0gsTUFBTWdKLGtCQUFuQixDQUFIO0FBQ0osb0JBQUdyZCxPQUFPMEcsUUFBVjtBQUVDK2MscUJBQUdqUCxRQUFILENBQVk2SSxrQkFBWixHQUFpQ2hKLE1BQU1nSixrQkFBTixDQUF5QjlYLElBQUkrRSxXQUE3QixDQUFqQztBQUZEO0FBS0NtWixxQkFBR2pQLFFBQUgsQ0FBWTZJLGtCQUFaLEdBQWlDLElBQWpDO0FBTkc7QUFBQTtBQVFKb0csbUJBQUdqUCxRQUFILENBQVk2SSxrQkFBWixHQUFpQ2hKLE1BQU1nSixrQkFBdkM7QUF6QkY7QUFBQTtBQTJCQ29HLGlCQUFHalAsUUFBSCxDQUFZNkksa0JBQVosR0FBaUNoSixNQUFNZ0osa0JBQXZDO0FBN0JHO0FBQUE7QUErQkosZ0JBQUcsT0FBT2hKLE1BQU1uSixZQUFiLEtBQThCLFVBQWpDO0FBQ0M4Uyw4QkFBZ0IzSixNQUFNbkosWUFBTixFQUFoQjtBQUREO0FBR0M4Uyw4QkFBZ0IzSixNQUFNbkosWUFBdEI7QUNxQk07O0FEbkJQLGdCQUFHcEYsRUFBRVcsT0FBRixDQUFVdVgsYUFBVixDQUFIO0FBQ0N5RixpQkFBR25oQixJQUFILEdBQVUyRCxNQUFWO0FBQ0F3ZCxpQkFBR3NDLFFBQUgsR0FBYyxJQUFkO0FBQ0F0QyxpQkFBR2pQLFFBQUgsQ0FBWXdSLGFBQVosR0FBNEIsSUFBNUI7QUFFQWpHLHFCQUFPM0wsYUFBYSxJQUFwQixJQUE0QjtBQUMzQjlSLHNCQUFNNEMsTUFEcUI7QUFFM0JzUCwwQkFBVTtBQUFDa0ksd0JBQU07QUFBUDtBQUZpQixlQUE1QjtBQUtBcUQscUJBQU8zTCxhQUFhLE1BQXBCLElBQThCO0FBQzdCOVIsc0JBQU0sQ0FBQzRDLE1BQUQsQ0FEdUI7QUFFN0JzUCwwQkFBVTtBQUFDa0ksd0JBQU07QUFBUDtBQUZtQixlQUE5QjtBQVZEO0FBZ0JDc0IsOEJBQWdCLENBQUNBLGFBQUQsQ0FBaEI7QUNzQk07O0FEcEJQM1Qsc0JBQVVoTSxRQUFRQyxPQUFSLENBQWdCMGYsY0FBYyxDQUFkLENBQWhCLENBQVY7O0FBQ0EsZ0JBQUczVCxXQUFZQSxRQUFRMFcsV0FBdkI7QUFDQzBDLGlCQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQixZQUFuQjtBQUREO0FBR0NtaEIsaUJBQUdqUCxRQUFILENBQVlsUyxJQUFaLEdBQW1CLGdCQUFuQjtBQUNBbWhCLGlCQUFHalAsUUFBSCxDQUFZeVIsYUFBWixHQUE0QjVSLE1BQU00UixhQUFOLElBQXVCLHdCQUFuRDs7QUFFQSxrQkFBR2ptQixPQUFPMEcsUUFBVjtBQUNDK2MsbUJBQUdqUCxRQUFILENBQVkwUixtQkFBWixHQUFrQztBQUNqQyx5QkFBTztBQUFDdGdCLDJCQUFPZ0IsUUFBUUMsR0FBUixDQUFZLFNBQVo7QUFBUixtQkFBUDtBQURpQyxpQkFBbEM7O0FBRUE0YyxtQkFBR2pQLFFBQUgsQ0FBWTJSLFVBQVosR0FBeUIsRUFBekI7O0FBQ0FuSSw4QkFBYzFILE9BQWQsQ0FBc0IsVUFBQzhQLFVBQUQ7QUFDckIvYiw0QkFBVWhNLFFBQVFDLE9BQVIsQ0FBZ0I4bkIsVUFBaEIsQ0FBVjs7QUFDQSxzQkFBRy9iLE9BQUg7QUN3QlcsMkJEdkJWb1osR0FBR2pQLFFBQUgsQ0FBWTJSLFVBQVosQ0FBdUJ6YSxJQUF2QixDQUE0QjtBQUMzQmpILDhCQUFRMmhCLFVBRG1CO0FBRTNCeFYsNkJBQUF2RyxXQUFBLE9BQU9BLFFBQVN1RyxLQUFoQixHQUFnQixNQUZXO0FBRzNCdVAsNEJBQUE5VixXQUFBLE9BQU1BLFFBQVM4VixJQUFmLEdBQWUsTUFIWTtBQUkzQmtHLDRCQUFNO0FBQ0wsK0JBQU8sVUFBUXpmLFFBQVFDLEdBQVIsQ0FBWSxRQUFaLENBQVIsR0FBOEIsR0FBOUIsR0FBaUN1ZixVQUFqQyxHQUE0QyxRQUFuRDtBQUwwQjtBQUFBLHFCQUE1QixDQ3VCVTtBRHhCWDtBQ2lDVywyQkR4QlYzQyxHQUFHalAsUUFBSCxDQUFZMlIsVUFBWixDQUF1QnphLElBQXZCLENBQTRCO0FBQzNCakgsOEJBQVEyaEIsVUFEbUI7QUFFM0JDLDRCQUFNO0FBQ0wsK0JBQU8sVUFBUXpmLFFBQVFDLEdBQVIsQ0FBWSxRQUFaLENBQVIsR0FBOEIsR0FBOUIsR0FBaUN1ZixVQUFqQyxHQUE0QyxRQUFuRDtBQUgwQjtBQUFBLHFCQUE1QixDQ3dCVTtBQU1EO0FEekNYO0FBVkY7QUF2REk7QUFuRU47QUFBQTtBQXNKQzNDLGFBQUdqUCxRQUFILENBQVlsUyxJQUFaLEdBQW1CLGdCQUFuQjtBQUNBbWhCLGFBQUdqUCxRQUFILENBQVk4UixXQUFaLEdBQTBCalMsTUFBTWlTLFdBQWhDO0FBcktGO0FBTkk7QUFBQSxXQTZLQSxJQUFHalMsTUFBTS9SLElBQU4sS0FBYyxRQUFqQjtBQUNKbWhCLFNBQUduaEIsSUFBSCxHQUFVNEMsTUFBVjs7QUFDQSxVQUFHbVAsTUFBTXVQLFFBQVQ7QUFDQ0gsV0FBR25oQixJQUFILEdBQVUsQ0FBQzRDLE1BQUQsQ0FBVjtBQUNBdWUsV0FBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsZ0JBQW5CO0FBQ0FtaEIsV0FBR2pQLFFBQUgsQ0FBWXNRLFFBQVosR0FBdUIsS0FBdkI7QUFDQXJCLFdBQUdqUCxRQUFILENBQVlqUyxPQUFaLEdBQXNCOFIsTUFBTTlSLE9BQTVCO0FBSkQ7QUFNQ2toQixXQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQixRQUFuQjtBQUNBbWhCLFdBQUdqUCxRQUFILENBQVlqUyxPQUFaLEdBQXNCOFIsTUFBTTlSLE9BQTVCOztBQUNBLFlBQUd1RCxFQUFFb1EsR0FBRixDQUFNN0IsS0FBTixFQUFhLGFBQWIsQ0FBSDtBQUNDb1AsYUFBR2pQLFFBQUgsQ0FBWStSLFdBQVosR0FBMEJsUyxNQUFNa1MsV0FBaEM7QUFERDtBQUdDOUMsYUFBR2pQLFFBQUgsQ0FBWStSLFdBQVosR0FBMEIsRUFBMUI7QUFYRjtBQzJDSTs7QUQ3QkosVUFBR2xTLE1BQU04TyxTQUFOLElBQW9COU8sTUFBTThPLFNBQU4sS0FBbUIsTUFBMUM7QUFDQyxZQUFHLENBQUMsUUFBRCxFQUFXLFVBQVgsRUFBdUIsU0FBdkIsRUFBa0NyYixPQUFsQyxDQUEwQ3VNLE1BQU04TyxTQUFoRCxJQUE2RCxDQUFDLENBQWpFO0FBQ0NPLG1CQUFTN0YsTUFBVDtBQUNBNEYsYUFBRytDLE9BQUgsR0FBYSxJQUFiO0FBRkQsZUFHSyxJQUFHblMsTUFBTThPLFNBQU4sS0FBbUIsU0FBdEI7QUFDSk8sbUJBQVM1RixPQUFUO0FBREk7QUFHSjRGLG1CQUFTeGUsTUFBVDtBQytCSTs7QUQ5Qkx1ZSxXQUFHbmhCLElBQUgsR0FBVW9oQixNQUFWOztBQUNBLFlBQUdyUCxNQUFNdVAsUUFBVDtBQUNDSCxhQUFHbmhCLElBQUgsR0FBVSxDQUFDb2hCLE1BQUQsQ0FBVjtBQ2dDSTs7QUQ5QkxELFdBQUdqUCxRQUFILENBQVlqUyxPQUFaLEdBQXNCbEUsUUFBUTRrQixnQkFBUixDQUF5QjVPLEtBQXpCLENBQXRCO0FBNUJHO0FBQUEsV0E2QkEsSUFBR0EsTUFBTS9SLElBQU4sS0FBYyxVQUFqQjtBQUNKbWhCLFNBQUduaEIsSUFBSCxHQUFVdWIsTUFBVjtBQUNBNEYsU0FBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsZUFBbkI7QUFDQW1oQixTQUFHalAsUUFBSCxDQUFZaVMsU0FBWixHQUF3QnBTLE1BQU1vUyxTQUFOLElBQW1CLEVBQTNDOztBQUNBLFVBQUFwUyxTQUFBLE9BQUdBLE1BQU9xUyxLQUFWLEdBQVUsTUFBVjtBQUNDakQsV0FBR2pQLFFBQUgsQ0FBWWtTLEtBQVosR0FBb0JyUyxNQUFNcVMsS0FBMUI7QUFDQWpELFdBQUcrQyxPQUFILEdBQWEsSUFBYjtBQUZELGFBR0ssS0FBQW5TLFNBQUEsT0FBR0EsTUFBT3FTLEtBQVYsR0FBVSxNQUFWLE1BQW1CLENBQW5CO0FBQ0pqRCxXQUFHalAsUUFBSCxDQUFZa1MsS0FBWixHQUFvQixDQUFwQjtBQUNBakQsV0FBRytDLE9BQUgsR0FBYSxJQUFiO0FBVEc7QUFBQSxXQVVBLElBQUduUyxNQUFNL1IsSUFBTixLQUFjLFFBQWpCO0FBQ0ptaEIsU0FBR25oQixJQUFILEdBQVV1YixNQUFWO0FBQ0E0RixTQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQixlQUFuQjtBQUNBbWhCLFNBQUdqUCxRQUFILENBQVlpUyxTQUFaLEdBQXdCcFMsTUFBTW9TLFNBQU4sSUFBbUIsRUFBM0M7O0FBQ0EsVUFBQXBTLFNBQUEsT0FBR0EsTUFBT3FTLEtBQVYsR0FBVSxNQUFWO0FBQ0NqRCxXQUFHalAsUUFBSCxDQUFZa1MsS0FBWixHQUFvQnJTLE1BQU1xUyxLQUExQjtBQUNBakQsV0FBRytDLE9BQUgsR0FBYSxJQUFiO0FBTkc7QUFBQSxXQU9BLElBQUduUyxNQUFNL1IsSUFBTixLQUFjLFNBQWpCO0FBQ0ptaEIsU0FBR25oQixJQUFILEdBQVV3YixPQUFWOztBQUNBLFVBQUd6SixNQUFNdUksUUFBVDtBQUNDNkcsV0FBR2pQLFFBQUgsQ0FBWW1TLFFBQVosR0FBdUIsSUFBdkI7QUNtQ0c7O0FEbENKbEQsU0FBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsMEJBQW5CO0FBSkksV0FLQSxJQUFHK1IsTUFBTS9SLElBQU4sS0FBYyxRQUFqQjtBQUNKbWhCLFNBQUduaEIsSUFBSCxHQUFVd2IsT0FBVjs7QUFDQSxVQUFHekosTUFBTXVJLFFBQVQ7QUFDQzZHLFdBQUdqUCxRQUFILENBQVltUyxRQUFaLEdBQXVCLElBQXZCO0FDb0NHOztBRG5DSmxELFNBQUdqUCxRQUFILENBQVlsUyxJQUFaLEdBQW1CLHdCQUFuQjtBQUpJLFdBS0EsSUFBRytSLE1BQU0vUixJQUFOLEtBQWMsV0FBakI7QUFDSm1oQixTQUFHbmhCLElBQUgsR0FBVTRDLE1BQVY7QUFESSxXQUVBLElBQUdtUCxNQUFNL1IsSUFBTixLQUFjLFVBQWpCO0FBQ0ptaEIsU0FBR25oQixJQUFILEdBQVUsQ0FBQzRDLE1BQUQsQ0FBVjtBQUNBdWUsU0FBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsaUJBQW5CO0FBQ0FtaEIsU0FBR2pQLFFBQUgsQ0FBWWpTLE9BQVosR0FBc0I4UixNQUFNOVIsT0FBNUI7QUFISSxXQUlBLElBQUc4UixNQUFNL1IsSUFBTixLQUFjLE1BQWpCO0FBQ0praEIsdUJBQWlCblAsTUFBTWhGLFVBQU4sSUFBb0IsT0FBckM7O0FBQ0EsVUFBR2dGLE1BQU11UCxRQUFUO0FBQ0NILFdBQUduaEIsSUFBSCxHQUFVLENBQUM0QyxNQUFELENBQVY7QUFDQTZhLGVBQU8zTCxhQUFhLElBQXBCLElBQ0M7QUFBQUksb0JBQ0M7QUFBQWxTLGtCQUFNLFlBQU47QUFDQStNLHdCQUFZbVU7QUFEWjtBQURELFNBREQ7QUFGRDtBQU9DQyxXQUFHbmhCLElBQUgsR0FBVTRDLE1BQVY7QUFDQXVlLFdBQUdqUCxRQUFILENBQVlsUyxJQUFaLEdBQW1CLFlBQW5CO0FBQ0FtaEIsV0FBR2pQLFFBQUgsQ0FBWW5GLFVBQVosR0FBeUJtVSxjQUF6QjtBQVhHO0FBQUEsV0FZQSxJQUFHblAsTUFBTS9SLElBQU4sS0FBYyxVQUFqQjtBQUNKbWhCLFNBQUduaEIsSUFBSCxHQUFVdWIsTUFBVjtBQUNBNEYsU0FBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsVUFBbkI7QUFGSSxXQUdBLElBQUcrUixNQUFNL1IsSUFBTixLQUFjLFFBQWQsSUFBMEIrUixNQUFNL1IsSUFBTixLQUFjLFFBQTNDO0FBQ0ptaEIsU0FBR25oQixJQUFILEdBQVUyRCxNQUFWO0FBREksV0FFQSxJQUFHb08sTUFBTS9SLElBQU4sS0FBYyxNQUFqQjtBQUNKbWhCLFNBQUduaEIsSUFBSCxHQUFVc2tCLEtBQVY7QUFDQW5ELFNBQUdqUCxRQUFILENBQVlxUyxRQUFaLEdBQXVCLElBQXZCO0FBQ0FwRCxTQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQixhQUFuQjtBQUVBeWQsYUFBTzNMLGFBQWEsSUFBcEIsSUFDQztBQUFBOVIsY0FBTTJEO0FBQU4sT0FERDtBQUxJLFdBT0EsSUFBR29PLE1BQU0vUixJQUFOLEtBQWMsT0FBakI7QUFDSixVQUFHK1IsTUFBTXVQLFFBQVQ7QUFDQ0gsV0FBR25oQixJQUFILEdBQVUsQ0FBQzRDLE1BQUQsQ0FBVjtBQUNBNmEsZUFBTzNMLGFBQWEsSUFBcEIsSUFDQztBQUFBSSxvQkFDQztBQUFBbFMsa0JBQU0sWUFBTjtBQUNBK00sd0JBQVksUUFEWjtBQUVBeVgsb0JBQVE7QUFGUjtBQURELFNBREQ7QUFGRDtBQVFDckQsV0FBR25oQixJQUFILEdBQVU0QyxNQUFWO0FBQ0F1ZSxXQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQixZQUFuQjtBQUNBbWhCLFdBQUdqUCxRQUFILENBQVluRixVQUFaLEdBQXlCLFFBQXpCO0FBQ0FvVSxXQUFHalAsUUFBSCxDQUFZc1MsTUFBWixHQUFxQixTQUFyQjtBQVpHO0FBQUEsV0FhQSxJQUFHelMsTUFBTS9SLElBQU4sS0FBYyxRQUFqQjtBQUNKLFVBQUcrUixNQUFNdVAsUUFBVDtBQUNDSCxXQUFHbmhCLElBQUgsR0FBVSxDQUFDNEMsTUFBRCxDQUFWO0FBQ0E2YSxlQUFPM0wsYUFBYSxJQUFwQixJQUNDO0FBQUFJLG9CQUNDO0FBQUFsUyxrQkFBTSxZQUFOO0FBQ0ErTSx3QkFBWSxTQURaO0FBRUF5WCxvQkFBUTtBQUZSO0FBREQsU0FERDtBQUZEO0FBUUNyRCxXQUFHbmhCLElBQUgsR0FBVTRDLE1BQVY7QUFDQXVlLFdBQUdqUCxRQUFILENBQVlsUyxJQUFaLEdBQW1CLFlBQW5CO0FBQ0FtaEIsV0FBR2pQLFFBQUgsQ0FBWW5GLFVBQVosR0FBeUIsU0FBekI7QUFDQW9VLFdBQUdqUCxRQUFILENBQVlzUyxNQUFaLEdBQXFCLFNBQXJCO0FBWkc7QUFBQSxXQWFBLElBQUd6UyxNQUFNL1IsSUFBTixLQUFjLE9BQWpCO0FBQ0osVUFBRytSLE1BQU11UCxRQUFUO0FBQ0NILFdBQUduaEIsSUFBSCxHQUFVLENBQUM0QyxNQUFELENBQVY7QUFDQTZhLGVBQU8zTCxhQUFhLElBQXBCLElBQ0M7QUFBQUksb0JBQ0M7QUFBQWxTLGtCQUFNLFlBQU47QUFDQStNLHdCQUFZLFFBRFo7QUFFQXlYLG9CQUFRO0FBRlI7QUFERCxTQUREO0FBRkQ7QUFRQ3JELFdBQUduaEIsSUFBSCxHQUFVNEMsTUFBVjtBQUNBdWUsV0FBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsWUFBbkI7QUFDQW1oQixXQUFHalAsUUFBSCxDQUFZbkYsVUFBWixHQUF5QixRQUF6QjtBQUNBb1UsV0FBR2pQLFFBQUgsQ0FBWXNTLE1BQVosR0FBcUIsU0FBckI7QUFaRztBQUFBLFdBYUEsSUFBR3pTLE1BQU0vUixJQUFOLEtBQWMsT0FBakI7QUFDSixVQUFHK1IsTUFBTXVQLFFBQVQ7QUFDQ0gsV0FBR25oQixJQUFILEdBQVUsQ0FBQzRDLE1BQUQsQ0FBVjtBQUNBNmEsZUFBTzNMLGFBQWEsSUFBcEIsSUFDQztBQUFBSSxvQkFDQztBQUFBbFMsa0JBQU0sWUFBTjtBQUNBK00sd0JBQVksUUFEWjtBQUVBeVgsb0JBQVE7QUFGUjtBQURELFNBREQ7QUFGRDtBQVFDckQsV0FBR25oQixJQUFILEdBQVU0QyxNQUFWO0FBQ0F1ZSxXQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQixZQUFuQjtBQUNBbWhCLFdBQUdqUCxRQUFILENBQVluRixVQUFaLEdBQXlCLFFBQXpCO0FBQ0FvVSxXQUFHalAsUUFBSCxDQUFZc1MsTUFBWixHQUFxQixTQUFyQjtBQVpHO0FBQUEsV0FhQSxJQUFHelMsTUFBTS9SLElBQU4sS0FBYyxVQUFqQjtBQUNKbWhCLFNBQUduaEIsSUFBSCxHQUFVMkQsTUFBVjtBQUNBd2QsU0FBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsVUFBbkI7QUFDQW1oQixTQUFHalAsUUFBSCxDQUFZdVMsTUFBWixHQUFxQjFTLE1BQU0wUyxNQUFOLElBQWdCLE9BQXJDO0FBQ0F0RCxTQUFHc0MsUUFBSCxHQUFjLElBQWQ7QUFKSSxXQUtBLElBQUcxUixNQUFNL1IsSUFBTixLQUFjLFVBQWpCO0FBQ0ptaEIsU0FBR25oQixJQUFILEdBQVU0QyxNQUFWO0FBQ0F1ZSxTQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQixrQkFBbkI7QUFGSSxXQUdBLElBQUcrUixNQUFNL1IsSUFBTixLQUFjLEtBQWpCO0FBQ0ptaEIsU0FBR25oQixJQUFILEdBQVU0QyxNQUFWO0FBRUF1ZSxTQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQixZQUFuQjtBQUhJLFdBSUEsSUFBRytSLE1BQU0vUixJQUFOLEtBQWMsT0FBakI7QUFDSm1oQixTQUFHbmhCLElBQUgsR0FBVTRDLE1BQVY7QUFDQXVlLFNBQUc1SSxLQUFILEdBQVdsVyxhQUFhOFYsS0FBYixDQUFtQnVNLEtBQTlCO0FBQ0F2RCxTQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQixjQUFuQjtBQUhJLFdBSUEsSUFBRytSLE1BQU0vUixJQUFOLEtBQWMsWUFBakI7QUFDSm1oQixTQUFHbmhCLElBQUgsR0FBVTRDLE1BQVY7QUFESSxXQUVBLElBQUdtUCxNQUFNL1IsSUFBTixLQUFjLFNBQWpCO0FBQ0ptaEIsV0FBS3BsQixRQUFRc2tCLGVBQVIsQ0FBd0I7QUFBQy9hLGdCQUFRO0FBQUN5TSxpQkFBT3BPLE9BQU9naEIsTUFBUCxDQUFjLEVBQWQsRUFBa0I1UyxLQUFsQixFQUF5QjtBQUFDL1Isa0JBQU0rUixNQUFNOE87QUFBYixXQUF6QjtBQUFSO0FBQVQsT0FBeEIsRUFBOEY5TyxNQUFNdlIsSUFBcEcsQ0FBTDtBQURJLFdBRUEsSUFBR3VSLE1BQU0vUixJQUFOLEtBQWMsU0FBakI7QUFDSm1oQixXQUFLcGxCLFFBQVFza0IsZUFBUixDQUF3QjtBQUFDL2EsZ0JBQVE7QUFBQ3lNLGlCQUFPcE8sT0FBT2doQixNQUFQLENBQWMsRUFBZCxFQUFrQjVTLEtBQWxCLEVBQXlCO0FBQUMvUixrQkFBTStSLE1BQU04TztBQUFiLFdBQXpCO0FBQVI7QUFBVCxPQUF4QixFQUE4RjlPLE1BQU12UixJQUFwRyxDQUFMO0FBREksV0FJQSxJQUFHdVIsTUFBTS9SLElBQU4sS0FBYyxTQUFqQjtBQUNKbWhCLFNBQUduaEIsSUFBSCxHQUFVdWIsTUFBVjtBQUNBNEYsU0FBR2pQLFFBQUgsQ0FBWWxTLElBQVosR0FBbUIsZUFBbkI7QUFDQW1oQixTQUFHalAsUUFBSCxDQUFZaVMsU0FBWixHQUF3QnBTLE1BQU1vUyxTQUFOLElBQW1CLEVBQTNDOztBQUNBLFdBQU8zZ0IsRUFBRW9oQixRQUFGLENBQVc3UyxNQUFNcVMsS0FBakIsQ0FBUDtBQUVDclMsY0FBTXFTLEtBQU4sR0FBYyxDQUFkO0FDNERHOztBRDFESmpELFNBQUdqUCxRQUFILENBQVlrUyxLQUFaLEdBQW9CclMsTUFBTXFTLEtBQU4sR0FBYyxDQUFsQztBQUNBakQsU0FBRytDLE9BQUgsR0FBYSxJQUFiO0FBVEk7QUFXSi9DLFNBQUduaEIsSUFBSCxHQUFVK1IsTUFBTS9SLElBQWhCO0FDNERFOztBRDFESCxRQUFHK1IsTUFBTXpELEtBQVQ7QUFDQzZTLFNBQUc3UyxLQUFILEdBQVd5RCxNQUFNekQsS0FBakI7QUM0REU7O0FEdkRILFFBQUcsQ0FBQ3lELE1BQU1zSSxRQUFWO0FBQ0M4RyxTQUFHMEQsUUFBSCxHQUFjLElBQWQ7QUN5REU7O0FEckRILFFBQUcsQ0FBQ25uQixPQUFPMEcsUUFBWDtBQUNDK2MsU0FBRzBELFFBQUgsR0FBYyxJQUFkO0FDdURFOztBRHJESCxRQUFHOVMsTUFBTStTLE1BQVQ7QUFDQzNELFNBQUcyRCxNQUFILEdBQVksSUFBWjtBQ3VERTs7QURyREgsUUFBRy9TLE1BQU1xSSxJQUFUO0FBQ0MrRyxTQUFHalAsUUFBSCxDQUFZa0ksSUFBWixHQUFtQixJQUFuQjtBQ3VERTs7QURyREgsUUFBR3JJLE1BQU1nVCxLQUFUO0FBQ0M1RCxTQUFHalAsUUFBSCxDQUFZNlMsS0FBWixHQUFvQmhULE1BQU1nVCxLQUExQjtBQ3VERTs7QURyREgsUUFBR2hULE1BQU1DLE9BQVQ7QUFDQ21QLFNBQUdqUCxRQUFILENBQVlGLE9BQVosR0FBc0IsSUFBdEI7QUN1REU7O0FEckRILFFBQUdELE1BQU1VLE1BQVQ7QUFDQzBPLFNBQUdqUCxRQUFILENBQVlsUyxJQUFaLEdBQW1CLFFBQW5CO0FDdURFOztBRHJESCxRQUFJK1IsTUFBTS9SLElBQU4sS0FBYyxRQUFmLElBQTZCK1IsTUFBTS9SLElBQU4sS0FBYyxRQUEzQyxJQUF5RCtSLE1BQU0vUixJQUFOLEtBQWMsZUFBMUU7QUFDQyxVQUFHLE9BQU8rUixNQUFNNk4sVUFBYixLQUE0QixXQUEvQjtBQUNDN04sY0FBTTZOLFVBQU4sR0FBbUIsSUFBbkI7QUFGRjtBQzBERzs7QUR2REgsUUFBRzdOLE1BQU12UixJQUFOLEtBQWMsTUFBZCxJQUF3QnVSLE1BQU0yTixPQUFqQztBQUNDLFVBQUcsT0FBTzNOLE1BQU1pVCxVQUFiLEtBQTRCLFdBQS9CO0FBQ0NqVCxjQUFNaVQsVUFBTixHQUFtQixJQUFuQjtBQUZGO0FDNERHOztBRHhESCxRQUFHL0QsYUFBSDtBQUNDRSxTQUFHalAsUUFBSCxDQUFZbFMsSUFBWixHQUFtQmloQixhQUFuQjtBQzBERTs7QUR4REgsUUFBR2xQLE1BQU00SCxZQUFUO0FBQ0MsVUFBR2pjLE9BQU8wRyxRQUFQLElBQW9CckksUUFBUThKLFFBQVIsQ0FBaUJDLFlBQWpCLENBQThCaU0sTUFBTTRILFlBQXBDLENBQXZCO0FBQ0N3SCxXQUFHalAsUUFBSCxDQUFZeUgsWUFBWixHQUEyQjtBQUMxQixpQkFBTzVkLFFBQVE4SixRQUFSLENBQWlCekMsR0FBakIsQ0FBcUIyTyxNQUFNNEgsWUFBM0IsRUFBeUM7QUFBQ3ZVLG9CQUFRMUgsT0FBTzBILE1BQVAsRUFBVDtBQUEwQkoscUJBQVNWLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQW5DO0FBQTJEMGdCLGlCQUFLLElBQUl4ZCxJQUFKO0FBQWhFLFdBQXpDLENBQVA7QUFEMEIsU0FBM0I7QUFERDtBQUlDMFosV0FBR2pQLFFBQUgsQ0FBWXlILFlBQVosR0FBMkI1SCxNQUFNNEgsWUFBakM7QUFMRjtBQ3FFRzs7QUQ1REgsUUFBRzVILE1BQU11SSxRQUFUO0FBQ0M2RyxTQUFHalAsUUFBSCxDQUFZb0ksUUFBWixHQUF1QixJQUF2QjtBQzhERTs7QUQ1REgsUUFBR3ZJLE1BQU1zUyxRQUFUO0FBQ0NsRCxTQUFHalAsUUFBSCxDQUFZbVMsUUFBWixHQUF1QixJQUF2QjtBQzhERTs7QUQ1REgsUUFBR3RTLE1BQU1tVCxjQUFUO0FBQ0MvRCxTQUFHalAsUUFBSCxDQUFZZ1QsY0FBWixHQUE2Qm5ULE1BQU1tVCxjQUFuQztBQzhERTs7QUQ1REgsUUFBR25ULE1BQU0wUixRQUFUO0FBQ0N0QyxTQUFHc0MsUUFBSCxHQUFjLElBQWQ7QUM4REU7O0FENURILFFBQUdqZ0IsRUFBRW9RLEdBQUYsQ0FBTTdCLEtBQU4sRUFBYSxLQUFiLENBQUg7QUFDQ29QLFNBQUdsRyxHQUFILEdBQVNsSixNQUFNa0osR0FBZjtBQzhERTs7QUQ3REgsUUFBR3pYLEVBQUVvUSxHQUFGLENBQU03QixLQUFOLEVBQWEsS0FBYixDQUFIO0FBQ0NvUCxTQUFHbkcsR0FBSCxHQUFTakosTUFBTWlKLEdBQWY7QUMrREU7O0FENURILFFBQUd0ZCxPQUFPeW5CLFlBQVY7QUFDQyxVQUFHcFQsTUFBTWEsS0FBVDtBQUNDdU8sV0FBR3ZPLEtBQUgsR0FBV2IsTUFBTWEsS0FBakI7QUFERCxhQUVLLElBQUdiLE1BQU1xVCxRQUFUO0FBQ0pqRSxXQUFHdk8sS0FBSCxHQUFXLElBQVg7QUFKRjtBQ21FRzs7QUFDRCxXRDlERjZLLE9BQU8zTCxVQUFQLElBQXFCcVAsRUM4RG5CO0FEaG1CSDs7QUFvaUJBLFNBQU8xRCxNQUFQO0FBaGpCeUIsQ0FBMUI7O0FBbWpCQTFoQixRQUFRc3BCLG9CQUFSLEdBQStCLFVBQUNuaUIsV0FBRCxFQUFjNE8sVUFBZCxFQUEwQndULFdBQTFCO0FBQzlCLE1BQUF2VCxLQUFBLEVBQUF3VCxJQUFBLEVBQUFwakIsTUFBQTtBQUFBb2pCLFNBQU9ELFdBQVA7QUFDQW5qQixXQUFTcEcsUUFBUWdJLFNBQVIsQ0FBa0JiLFdBQWxCLENBQVQ7O0FBQ0EsTUFBRyxDQUFDZixNQUFKO0FBQ0MsV0FBTyxFQUFQO0FDZ0VDOztBRC9ERjRQLFVBQVE1UCxPQUFPbUQsTUFBUCxDQUFjd00sVUFBZCxDQUFSOztBQUNBLE1BQUcsQ0FBQ0MsS0FBSjtBQUNDLFdBQU8sRUFBUDtBQ2lFQzs7QUQvREYsTUFBR0EsTUFBTS9SLElBQU4sS0FBYyxVQUFqQjtBQUNDdWxCLFdBQU9DLE9BQU8sS0FBS25KLEdBQVosRUFBaUJvSixNQUFqQixDQUF3QixpQkFBeEIsQ0FBUDtBQURELFNBRUssSUFBRzFULE1BQU0vUixJQUFOLEtBQWMsTUFBakI7QUFDSnVsQixXQUFPQyxPQUFPLEtBQUtuSixHQUFaLEVBQWlCb0osTUFBakIsQ0FBd0IsWUFBeEIsQ0FBUDtBQ2lFQzs7QUQvREYsU0FBT0YsSUFBUDtBQWQ4QixDQUEvQjs7QUFnQkF4cEIsUUFBUTJwQixpQ0FBUixHQUE0QyxVQUFDQyxVQUFEO0FBQzNDLFNBQU8sQ0FBQyxNQUFELEVBQVMsVUFBVCxFQUFxQixNQUFyQixFQUE2QixVQUE3QixFQUF5QyxRQUF6QyxFQUFtRHRWLFFBQW5ELENBQTREc1YsVUFBNUQsQ0FBUDtBQUQyQyxDQUE1Qzs7QUFHQTVwQixRQUFRNnBCLDJCQUFSLEdBQXNDLFVBQUNELFVBQUQsRUFBYUUsVUFBYjtBQUNyQyxNQUFBQyxhQUFBO0FBQUFBLGtCQUFnQi9wQixRQUFRZ3FCLHVCQUFSLENBQWdDSixVQUFoQyxDQUFoQjs7QUFDQSxNQUFHRyxhQUFIO0FDb0VHLFdEbkVGdGlCLEVBQUV3USxPQUFGLENBQVU4UixhQUFWLEVBQXlCLFVBQUNFLFdBQUQsRUFBY3hlLEdBQWQ7QUNvRXJCLGFEbkVIcWUsV0FBV3pjLElBQVgsQ0FBZ0I7QUFBQ2tGLGVBQU8wWCxZQUFZMVgsS0FBcEI7QUFBMkJqSSxlQUFPbUI7QUFBbEMsT0FBaEIsQ0NtRUc7QURwRUosTUNtRUU7QUFNRDtBRDVFbUMsQ0FBdEM7O0FBTUF6TCxRQUFRZ3FCLHVCQUFSLEdBQWtDLFVBQUNKLFVBQUQsRUFBYU0sYUFBYjtBQUVqQyxNQUFHLENBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUI1VixRQUFyQixDQUE4QnNWLFVBQTlCLENBQUg7QUFDQyxXQUFPNXBCLFFBQVFtcUIsMkJBQVIsQ0FBb0NELGFBQXBDLEVBQW1ETixVQUFuRCxDQUFQO0FDeUVDO0FENUUrQixDQUFsQzs7QUFLQTVwQixRQUFRb3FCLDBCQUFSLEdBQXFDLFVBQUNSLFVBQUQsRUFBYW5lLEdBQWI7QUFFcEMsTUFBRyxDQUFDLE1BQUQsRUFBUyxVQUFULEVBQXFCNkksUUFBckIsQ0FBOEJzVixVQUE5QixDQUFIO0FBQ0MsV0FBTzVwQixRQUFRcXFCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRG5lLEdBQW5ELENBQVA7QUMwRUM7QUQ3RWtDLENBQXJDOztBQUtBekwsUUFBUXNxQiwwQkFBUixHQUFxQyxVQUFDVixVQUFELEVBQWF0ZixLQUFiO0FBR3BDLE1BQUFpZ0Isb0JBQUEsRUFBQTlPLE1BQUE7O0FBQUEsT0FBT2hVLEVBQUVvQyxRQUFGLENBQVdTLEtBQVgsQ0FBUDtBQUNDO0FDMkVDOztBRDFFRmlnQix5QkFBdUJ2cUIsUUFBUWdxQix1QkFBUixDQUFnQ0osVUFBaEMsQ0FBdkI7O0FBQ0EsT0FBT1csb0JBQVA7QUFDQztBQzRFQzs7QUQzRUY5TyxXQUFTLElBQVQ7O0FBQ0FoVSxJQUFFMEMsSUFBRixDQUFPb2dCLG9CQUFQLEVBQTZCLFVBQUMxUixJQUFELEVBQU9vTyxTQUFQO0FBQzVCLFFBQUdwTyxLQUFLcE4sR0FBTCxLQUFZbkIsS0FBZjtBQzZFSSxhRDVFSG1SLFNBQVN3TCxTQzRFTjtBQUNEO0FEL0VKOztBQUdBLFNBQU94TCxNQUFQO0FBWm9DLENBQXJDOztBQWVBemIsUUFBUW1xQiwyQkFBUixHQUFzQyxVQUFDRCxhQUFELEVBQWdCTixVQUFoQjtBQUVyQyxTQUFPO0FBQ04sOEJBQTZCTSxnQkFBbUIsSUFBbkIsR0FBNkJscUIsUUFBUXFxQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsV0FBbkQsQ0FEcEQ7QUFFTiw4QkFBNkJNLGdCQUFtQixJQUFuQixHQUE2QmxxQixRQUFRcXFCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxXQUFuRCxDQUZwRDtBQUdOLDhCQUE2Qk0sZ0JBQW1CLElBQW5CLEdBQTZCbHFCLFFBQVFxcUIsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELFdBQW5ELENBSHBEO0FBSU4saUNBQWdDTSxnQkFBbUIsSUFBbkIsR0FBNkJscUIsUUFBUXFxQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsY0FBbkQsQ0FKdkQ7QUFLTixpQ0FBZ0NNLGdCQUFtQixJQUFuQixHQUE2QmxxQixRQUFRcXFCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxjQUFuRCxDQUx2RDtBQU1OLGlDQUFnQ00sZ0JBQW1CLElBQW5CLEdBQTZCbHFCLFFBQVFxcUIsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELGNBQW5ELENBTnZEO0FBT04sK0JBQThCTSxnQkFBbUIsSUFBbkIsR0FBNkJscUIsUUFBUXFxQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsWUFBbkQsQ0FQckQ7QUFRTiwrQkFBOEJNLGdCQUFtQixJQUFuQixHQUE2QmxxQixRQUFRcXFCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxZQUFuRCxDQVJyRDtBQVNOLCtCQUE4Qk0sZ0JBQW1CLElBQW5CLEdBQTZCbHFCLFFBQVFxcUIsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELFlBQW5ELENBVHJEO0FBVU4sOEJBQTZCTSxnQkFBbUIsSUFBbkIsR0FBNkJscUIsUUFBUXFxQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsV0FBbkQsQ0FWcEQ7QUFXTiw4QkFBNkJNLGdCQUFtQixJQUFuQixHQUE2QmxxQixRQUFRcXFCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxXQUFuRCxDQVhwRDtBQVlOLDhCQUE2Qk0sZ0JBQW1CLElBQW5CLEdBQTZCbHFCLFFBQVFxcUIsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELFdBQW5ELENBWnBEO0FBYU4sNEJBQTJCTSxnQkFBbUIsSUFBbkIsR0FBNkJscUIsUUFBUXFxQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsU0FBbkQsQ0FibEQ7QUFjTiwwQkFBeUJNLGdCQUFtQixJQUFuQixHQUE2QmxxQixRQUFRcXFCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxPQUFuRCxDQWRoRDtBQWVOLDZCQUE0Qk0sZ0JBQW1CLElBQW5CLEdBQTZCbHFCLFFBQVFxcUIsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELFVBQW5ELENBZm5EO0FBZ0JOLGdDQUErQk0sZ0JBQW1CLElBQW5CLEdBQTZCbHFCLFFBQVFxcUIsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELGFBQW5ELENBaEJ0RDtBQWlCTixpQ0FBZ0NNLGdCQUFtQixJQUFuQixHQUE2QmxxQixRQUFRcXFCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxjQUFuRCxDQWpCdkQ7QUFrQk4saUNBQWdDTSxnQkFBbUIsSUFBbkIsR0FBNkJscUIsUUFBUXFxQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsY0FBbkQsQ0FsQnZEO0FBbUJOLGlDQUFnQ00sZ0JBQW1CLElBQW5CLEdBQTZCbHFCLFFBQVFxcUIsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELGNBQW5ELENBbkJ2RDtBQW9CTixrQ0FBaUNNLGdCQUFtQixJQUFuQixHQUE2QmxxQixRQUFRcXFCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxlQUFuRCxDQXBCeEQ7QUFxQk4sZ0NBQStCTSxnQkFBbUIsSUFBbkIsR0FBNkJscUIsUUFBUXFxQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsYUFBbkQsQ0FyQnREO0FBc0JOLGlDQUFnQ00sZ0JBQW1CLElBQW5CLEdBQTZCbHFCLFFBQVFxcUIsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELGNBQW5ELENBdEJ2RDtBQXVCTixpQ0FBZ0NNLGdCQUFtQixJQUFuQixHQUE2QmxxQixRQUFRcXFCLDhCQUFSLENBQXVDVCxVQUF2QyxFQUFtRCxjQUFuRCxDQXZCdkQ7QUF3Qk4saUNBQWdDTSxnQkFBbUIsSUFBbkIsR0FBNkJscUIsUUFBUXFxQiw4QkFBUixDQUF1Q1QsVUFBdkMsRUFBbUQsY0FBbkQsQ0F4QnZEO0FBeUJOLGtDQUFpQ00sZ0JBQW1CLElBQW5CLEdBQTZCbHFCLFFBQVFxcUIsOEJBQVIsQ0FBdUNULFVBQXZDLEVBQW1ELGVBQW5EO0FBekJ4RCxHQUFQO0FBRnFDLENBQXRDOztBQThCQTVwQixRQUFRd3FCLG9CQUFSLEdBQStCLFVBQUNDLEtBQUQ7QUFDOUIsTUFBRyxDQUFDQSxLQUFKO0FBQ0NBLFlBQVEsSUFBSS9lLElBQUosR0FBV2dmLFFBQVgsRUFBUjtBQytFQzs7QUQ3RUYsTUFBR0QsUUFBUSxDQUFYO0FBQ0MsV0FBTyxDQUFQO0FBREQsU0FFSyxJQUFHQSxRQUFRLENBQVg7QUFDSixXQUFPLENBQVA7QUFESSxTQUVBLElBQUdBLFFBQVEsQ0FBWDtBQUNKLFdBQU8sQ0FBUDtBQytFQzs7QUQ3RUYsU0FBTyxDQUFQO0FBWDhCLENBQS9COztBQWNBenFCLFFBQVEycUIsc0JBQVIsR0FBaUMsVUFBQ0MsSUFBRCxFQUFNSCxLQUFOO0FBQ2hDLE1BQUcsQ0FBQ0csSUFBSjtBQUNDQSxXQUFPLElBQUlsZixJQUFKLEdBQVdtZixXQUFYLEVBQVA7QUMrRUM7O0FEOUVGLE1BQUcsQ0FBQ0osS0FBSjtBQUNDQSxZQUFRLElBQUkvZSxJQUFKLEdBQVdnZixRQUFYLEVBQVI7QUNnRkM7O0FEOUVGLE1BQUdELFFBQVEsQ0FBWDtBQUNDRztBQUNBSCxZQUFRLENBQVI7QUFGRCxTQUdLLElBQUdBLFFBQVEsQ0FBWDtBQUNKQSxZQUFRLENBQVI7QUFESSxTQUVBLElBQUdBLFFBQVEsQ0FBWDtBQUNKQSxZQUFRLENBQVI7QUFESTtBQUdKQSxZQUFRLENBQVI7QUNnRkM7O0FEOUVGLFNBQU8sSUFBSS9lLElBQUosQ0FBU2tmLElBQVQsRUFBZUgsS0FBZixFQUFzQixDQUF0QixDQUFQO0FBaEJnQyxDQUFqQzs7QUFtQkF6cUIsUUFBUThxQixzQkFBUixHQUFpQyxVQUFDRixJQUFELEVBQU1ILEtBQU47QUFDaEMsTUFBRyxDQUFDRyxJQUFKO0FBQ0NBLFdBQU8sSUFBSWxmLElBQUosR0FBV21mLFdBQVgsRUFBUDtBQ2dGQzs7QUQvRUYsTUFBRyxDQUFDSixLQUFKO0FBQ0NBLFlBQVEsSUFBSS9lLElBQUosR0FBV2dmLFFBQVgsRUFBUjtBQ2lGQzs7QUQvRUYsTUFBR0QsUUFBUSxDQUFYO0FBQ0NBLFlBQVEsQ0FBUjtBQURELFNBRUssSUFBR0EsUUFBUSxDQUFYO0FBQ0pBLFlBQVEsQ0FBUjtBQURJLFNBRUEsSUFBR0EsUUFBUSxDQUFYO0FBQ0pBLFlBQVEsQ0FBUjtBQURJO0FBR0pHO0FBQ0FILFlBQVEsQ0FBUjtBQ2lGQzs7QUQvRUYsU0FBTyxJQUFJL2UsSUFBSixDQUFTa2YsSUFBVCxFQUFlSCxLQUFmLEVBQXNCLENBQXRCLENBQVA7QUFoQmdDLENBQWpDOztBQWtCQXpxQixRQUFRK3FCLFlBQVIsR0FBdUIsVUFBQ0gsSUFBRCxFQUFNSCxLQUFOO0FBQ3RCLE1BQUFPLElBQUEsRUFBQUMsT0FBQSxFQUFBQyxXQUFBLEVBQUFDLFNBQUE7O0FBQUEsTUFBR1YsVUFBUyxFQUFaO0FBQ0MsV0FBTyxFQUFQO0FDbUZDOztBRGpGRlMsZ0JBQWMsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUEvQjtBQUNBQyxjQUFZLElBQUl6ZixJQUFKLENBQVNrZixJQUFULEVBQWVILEtBQWYsRUFBc0IsQ0FBdEIsQ0FBWjtBQUNBUSxZQUFVLElBQUl2ZixJQUFKLENBQVNrZixJQUFULEVBQWVILFFBQU0sQ0FBckIsRUFBd0IsQ0FBeEIsQ0FBVjtBQUNBTyxTQUFPLENBQUNDLFVBQVFFLFNBQVQsSUFBb0JELFdBQTNCO0FBQ0EsU0FBT0YsSUFBUDtBQVJzQixDQUF2Qjs7QUFVQWhyQixRQUFRb3JCLG9CQUFSLEdBQStCLFVBQUNSLElBQUQsRUFBT0gsS0FBUDtBQUM5QixNQUFHLENBQUNHLElBQUo7QUFDQ0EsV0FBTyxJQUFJbGYsSUFBSixHQUFXbWYsV0FBWCxFQUFQO0FDb0ZDOztBRG5GRixNQUFHLENBQUNKLEtBQUo7QUFDQ0EsWUFBUSxJQUFJL2UsSUFBSixHQUFXZ2YsUUFBWCxFQUFSO0FDcUZDOztBRGxGRixNQUFHRCxVQUFTLENBQVo7QUFDQ0EsWUFBUSxFQUFSO0FBQ0FHO0FBQ0EsV0FBTyxJQUFJbGYsSUFBSixDQUFTa2YsSUFBVCxFQUFlSCxLQUFmLEVBQXNCLENBQXRCLENBQVA7QUNvRkM7O0FEakZGQTtBQUNBLFNBQU8sSUFBSS9lLElBQUosQ0FBU2tmLElBQVQsRUFBZUgsS0FBZixFQUFzQixDQUF0QixDQUFQO0FBZDhCLENBQS9COztBQWdCQXpxQixRQUFRcXFCLDhCQUFSLEdBQXlDLFVBQUNULFVBQUQsRUFBYW5lLEdBQWI7QUFFeEMsTUFBQTRmLFlBQUEsRUFBQUMsV0FBQSxFQUFBQyxRQUFBLEVBQUFDLFFBQUEsRUFBQWpaLEtBQUEsRUFBQWtaLE9BQUEsRUFBQUMsVUFBQSxFQUFBQyxpQkFBQSxFQUFBQyxpQkFBQSxFQUFBQyxpQkFBQSxFQUFBQyxtQkFBQSxFQUFBQyxVQUFBLEVBQUFDLGFBQUEsRUFBQUMsWUFBQSxFQUFBQyxZQUFBLEVBQUFDLFdBQUEsRUFBQUMsWUFBQSxFQUFBbEIsV0FBQSxFQUFBbUIsUUFBQSxFQUFBQyxNQUFBLEVBQUE3QixLQUFBLEVBQUE4QixVQUFBLEVBQUFDLGlCQUFBLEVBQUFDLGlCQUFBLEVBQUFDLGlCQUFBLEVBQUFDLG1CQUFBLEVBQUFDLFVBQUEsRUFBQUMsUUFBQSxFQUFBQyxhQUFBLEVBQUFDLFlBQUEsRUFBQUMsWUFBQSxFQUFBQyxXQUFBLEVBQUFDLFlBQUEsRUFBQWhFLEdBQUEsRUFBQWlFLFlBQUEsRUFBQUMsVUFBQSxFQUFBQyxTQUFBLEVBQUFDLFdBQUEsRUFBQUMsVUFBQSxFQUFBQyxTQUFBLEVBQUFDLFdBQUEsRUFBQUMsU0FBQSxFQUFBQyxRQUFBLEVBQUFDLFdBQUEsRUFBQUMsVUFBQSxFQUFBQyxNQUFBLEVBQUFDLGlCQUFBLEVBQUFDLG1CQUFBLEVBQUFDLFFBQUEsRUFBQW5qQixNQUFBLEVBQUFvakIsSUFBQSxFQUFBdEQsSUFBQSxFQUFBdUQsT0FBQTtBQUFBakYsUUFBTSxJQUFJeGQsSUFBSixFQUFOO0FBRUF3ZixnQkFBYyxPQUFPLEVBQVAsR0FBWSxFQUFaLEdBQWlCLEVBQS9CO0FBQ0FpRCxZQUFVLElBQUl6aUIsSUFBSixDQUFTd2QsSUFBSXZkLE9BQUosS0FBZ0J1ZixXQUF6QixDQUFWO0FBQ0ErQyxhQUFXLElBQUl2aUIsSUFBSixDQUFTd2QsSUFBSXZkLE9BQUosS0FBZ0J1ZixXQUF6QixDQUFYO0FBRUFnRCxTQUFPaEYsSUFBSWtGLE1BQUosRUFBUDtBQUVBL0IsYUFBYzZCLFNBQVEsQ0FBUixHQUFlQSxPQUFPLENBQXRCLEdBQTZCLENBQTNDO0FBQ0E1QixXQUFTLElBQUk1Z0IsSUFBSixDQUFTd2QsSUFBSXZkLE9BQUosS0FBaUIwZ0IsV0FBV25CLFdBQXJDLENBQVQ7QUFDQTRDLFdBQVMsSUFBSXBpQixJQUFKLENBQVM0Z0IsT0FBTzNnQixPQUFQLEtBQW9CLElBQUl1ZixXQUFqQyxDQUFUO0FBRUFhLGVBQWEsSUFBSXJnQixJQUFKLENBQVM0Z0IsT0FBTzNnQixPQUFQLEtBQW1CdWYsV0FBNUIsQ0FBYjtBQUVBUSxlQUFhLElBQUloZ0IsSUFBSixDQUFTcWdCLFdBQVdwZ0IsT0FBWCxLQUF3QnVmLGNBQWMsQ0FBL0MsQ0FBYjtBQUVBcUIsZUFBYSxJQUFJN2dCLElBQUosQ0FBU29pQixPQUFPbmlCLE9BQVAsS0FBbUJ1ZixXQUE1QixDQUFiO0FBRUEwQixlQUFhLElBQUlsaEIsSUFBSixDQUFTNmdCLFdBQVc1Z0IsT0FBWCxLQUF3QnVmLGNBQWMsQ0FBL0MsQ0FBYjtBQUNBSSxnQkFBY3BDLElBQUkyQixXQUFKLEVBQWQ7QUFDQXNDLGlCQUFlN0IsY0FBYyxDQUE3QjtBQUNBdUIsYUFBV3ZCLGNBQWMsQ0FBekI7QUFFQUQsaUJBQWVuQyxJQUFJd0IsUUFBSixFQUFmO0FBRUFFLFNBQU8xQixJQUFJMkIsV0FBSixFQUFQO0FBQ0FKLFVBQVF2QixJQUFJd0IsUUFBSixFQUFSO0FBRUFjLGFBQVcsSUFBSTlmLElBQUosQ0FBUzRmLFdBQVQsRUFBcUJELFlBQXJCLEVBQWtDLENBQWxDLENBQVg7O0FBSUEsTUFBR0EsaUJBQWdCLEVBQW5CO0FBQ0NUO0FBQ0FIO0FBRkQ7QUFJQ0E7QUN1RUM7O0FEcEVGZ0Msc0JBQW9CLElBQUkvZ0IsSUFBSixDQUFTa2YsSUFBVCxFQUFlSCxLQUFmLEVBQXNCLENBQXRCLENBQXBCO0FBRUErQixzQkFBb0IsSUFBSTlnQixJQUFKLENBQVNrZixJQUFULEVBQWNILEtBQWQsRUFBb0J6cUIsUUFBUStxQixZQUFSLENBQXFCSCxJQUFyQixFQUEwQkgsS0FBMUIsQ0FBcEIsQ0FBcEI7QUFFQWdCLFlBQVUsSUFBSS9mLElBQUosQ0FBUytnQixrQkFBa0I5Z0IsT0FBbEIsS0FBOEJ1ZixXQUF2QyxDQUFWO0FBRUFVLHNCQUFvQjVyQixRQUFRb3JCLG9CQUFSLENBQTZCRSxXQUE3QixFQUF5Q0QsWUFBekMsQ0FBcEI7QUFFQU0sc0JBQW9CLElBQUlqZ0IsSUFBSixDQUFTOGYsU0FBUzdmLE9BQVQsS0FBcUJ1ZixXQUE5QixDQUFwQjtBQUVBOEMsd0JBQXNCLElBQUl0aUIsSUFBSixDQUFTNGYsV0FBVCxFQUFxQnRyQixRQUFRd3FCLG9CQUFSLENBQTZCYSxZQUE3QixDQUFyQixFQUFnRSxDQUFoRSxDQUF0QjtBQUVBMEMsc0JBQW9CLElBQUlyaUIsSUFBSixDQUFTNGYsV0FBVCxFQUFxQnRyQixRQUFRd3FCLG9CQUFSLENBQTZCYSxZQUE3QixJQUEyQyxDQUFoRSxFQUFrRXJyQixRQUFRK3FCLFlBQVIsQ0FBcUJPLFdBQXJCLEVBQWlDdHJCLFFBQVF3cUIsb0JBQVIsQ0FBNkJhLFlBQTdCLElBQTJDLENBQTVFLENBQWxFLENBQXBCO0FBRUFTLHdCQUFzQjlyQixRQUFRMnFCLHNCQUFSLENBQStCVyxXQUEvQixFQUEyQ0QsWUFBM0MsQ0FBdEI7QUFFQVEsc0JBQW9CLElBQUluZ0IsSUFBSixDQUFTb2dCLG9CQUFvQmpCLFdBQXBCLEVBQVQsRUFBMkNpQixvQkFBb0JwQixRQUFwQixLQUErQixDQUExRSxFQUE0RTFxQixRQUFRK3FCLFlBQVIsQ0FBcUJlLG9CQUFvQmpCLFdBQXBCLEVBQXJCLEVBQXVEaUIsb0JBQW9CcEIsUUFBcEIsS0FBK0IsQ0FBdEYsQ0FBNUUsQ0FBcEI7QUFFQWlDLHdCQUFzQjNzQixRQUFROHFCLHNCQUFSLENBQStCUSxXQUEvQixFQUEyQ0QsWUFBM0MsQ0FBdEI7QUFFQXFCLHNCQUFvQixJQUFJaGhCLElBQUosQ0FBU2loQixvQkFBb0I5QixXQUFwQixFQUFULEVBQTJDOEIsb0JBQW9CakMsUUFBcEIsS0FBK0IsQ0FBMUUsRUFBNEUxcUIsUUFBUStxQixZQUFSLENBQXFCNEIsb0JBQW9COUIsV0FBcEIsRUFBckIsRUFBdUQ4QixvQkFBb0JqQyxRQUFwQixLQUErQixDQUF0RixDQUE1RSxDQUFwQjtBQUVBeUIsZ0JBQWMsSUFBSXpnQixJQUFKLENBQVN3ZCxJQUFJdmQsT0FBSixLQUFpQixJQUFJdWYsV0FBOUIsQ0FBZDtBQUVBZSxpQkFBZSxJQUFJdmdCLElBQUosQ0FBU3dkLElBQUl2ZCxPQUFKLEtBQWlCLEtBQUt1ZixXQUEvQixDQUFmO0FBRUFnQixpQkFBZSxJQUFJeGdCLElBQUosQ0FBU3dkLElBQUl2ZCxPQUFKLEtBQWlCLEtBQUt1ZixXQUEvQixDQUFmO0FBRUFrQixpQkFBZSxJQUFJMWdCLElBQUosQ0FBU3dkLElBQUl2ZCxPQUFKLEtBQWlCLEtBQUt1ZixXQUEvQixDQUFmO0FBRUFjLGtCQUFnQixJQUFJdGdCLElBQUosQ0FBU3dkLElBQUl2ZCxPQUFKLEtBQWlCLE1BQU11ZixXQUFoQyxDQUFoQjtBQUVBK0IsZ0JBQWMsSUFBSXZoQixJQUFKLENBQVN3ZCxJQUFJdmQsT0FBSixLQUFpQixJQUFJdWYsV0FBOUIsQ0FBZDtBQUVBNkIsaUJBQWUsSUFBSXJoQixJQUFKLENBQVN3ZCxJQUFJdmQsT0FBSixLQUFpQixLQUFLdWYsV0FBL0IsQ0FBZjtBQUVBOEIsaUJBQWUsSUFBSXRoQixJQUFKLENBQVN3ZCxJQUFJdmQsT0FBSixLQUFpQixLQUFLdWYsV0FBL0IsQ0FBZjtBQUVBZ0MsaUJBQWUsSUFBSXhoQixJQUFKLENBQVN3ZCxJQUFJdmQsT0FBSixLQUFpQixLQUFLdWYsV0FBL0IsQ0FBZjtBQUVBNEIsa0JBQWdCLElBQUlwaEIsSUFBSixDQUFTd2QsSUFBSXZkLE9BQUosS0FBaUIsTUFBTXVmLFdBQWhDLENBQWhCOztBQUVBLFVBQU96ZixHQUFQO0FBQUEsU0FDTSxXQUROO0FBR0U4RyxjQUFROGIsRUFBRSw0Q0FBRixDQUFSO0FBQ0FqQixtQkFBYSxJQUFJMWhCLElBQUosQ0FBWXloQixlQUFhLGtCQUF6QixDQUFiO0FBQ0E1QixpQkFBVyxJQUFJN2YsSUFBSixDQUFZeWhCLGVBQWEsa0JBQXpCLENBQVg7QUFKSTs7QUFETixTQU1NLFdBTk47QUFRRTVhLGNBQVE4YixFQUFFLDRDQUFGLENBQVI7QUFDQWpCLG1CQUFhLElBQUkxaEIsSUFBSixDQUFZNGYsY0FBWSxrQkFBeEIsQ0FBYjtBQUNBQyxpQkFBVyxJQUFJN2YsSUFBSixDQUFZNGYsY0FBWSxrQkFBeEIsQ0FBWDtBQUpJOztBQU5OLFNBV00sV0FYTjtBQWFFL1ksY0FBUThiLEVBQUUsNENBQUYsQ0FBUjtBQUNBakIsbUJBQWEsSUFBSTFoQixJQUFKLENBQVltaEIsV0FBUyxrQkFBckIsQ0FBYjtBQUNBdEIsaUJBQVcsSUFBSTdmLElBQUosQ0FBWW1oQixXQUFTLGtCQUFyQixDQUFYO0FBSkk7O0FBWE4sU0FnQk0sY0FoQk47QUFrQkVTLG9CQUFjN0QsT0FBT3FDLG1CQUFQLEVBQTRCcEMsTUFBNUIsQ0FBbUMsWUFBbkMsQ0FBZDtBQUNBNkQsbUJBQWE5RCxPQUFPb0MsaUJBQVAsRUFBMEJuQyxNQUExQixDQUFpQyxZQUFqQyxDQUFiO0FBQ0FuWCxjQUFROGIsRUFBRSwrQ0FBRixDQUFSO0FBQ0FqQixtQkFBYSxJQUFJMWhCLElBQUosQ0FBWTRoQixjQUFZLFlBQXhCLENBQWI7QUFDQS9CLGlCQUFXLElBQUk3ZixJQUFKLENBQVk2aEIsYUFBVyxZQUF2QixDQUFYO0FBTkk7O0FBaEJOLFNBdUJNLGNBdkJOO0FBeUJFRCxvQkFBYzdELE9BQU91RSxtQkFBUCxFQUE0QnRFLE1BQTVCLENBQW1DLFlBQW5DLENBQWQ7QUFDQTZELG1CQUFhOUQsT0FBT3NFLGlCQUFQLEVBQTBCckUsTUFBMUIsQ0FBaUMsWUFBakMsQ0FBYjtBQUNBblgsY0FBUThiLEVBQUUsK0NBQUYsQ0FBUjtBQUNBakIsbUJBQWEsSUFBSTFoQixJQUFKLENBQVk0aEIsY0FBWSxZQUF4QixDQUFiO0FBQ0EvQixpQkFBVyxJQUFJN2YsSUFBSixDQUFZNmhCLGFBQVcsWUFBdkIsQ0FBWDtBQU5JOztBQXZCTixTQThCTSxjQTlCTjtBQWdDRUQsb0JBQWM3RCxPQUFPa0QsbUJBQVAsRUFBNEJqRCxNQUE1QixDQUFtQyxZQUFuQyxDQUFkO0FBQ0E2RCxtQkFBYTlELE9BQU9pRCxpQkFBUCxFQUEwQmhELE1BQTFCLENBQWlDLFlBQWpDLENBQWI7QUFDQW5YLGNBQVE4YixFQUFFLCtDQUFGLENBQVI7QUFDQWpCLG1CQUFhLElBQUkxaEIsSUFBSixDQUFZNGhCLGNBQVksWUFBeEIsQ0FBYjtBQUNBL0IsaUJBQVcsSUFBSTdmLElBQUosQ0FBWTZoQixhQUFXLFlBQXZCLENBQVg7QUFOSTs7QUE5Qk4sU0FxQ00sWUFyQ047QUF1Q0VELG9CQUFjN0QsT0FBT21DLGlCQUFQLEVBQTBCbEMsTUFBMUIsQ0FBaUMsWUFBakMsQ0FBZDtBQUNBNkQsbUJBQWE5RCxPQUFPa0MsaUJBQVAsRUFBMEJqQyxNQUExQixDQUFpQyxZQUFqQyxDQUFiO0FBQ0FuWCxjQUFROGIsRUFBRSw2Q0FBRixDQUFSO0FBQ0FqQixtQkFBYSxJQUFJMWhCLElBQUosQ0FBWTRoQixjQUFZLFlBQXhCLENBQWI7QUFDQS9CLGlCQUFXLElBQUk3ZixJQUFKLENBQVk2aEIsYUFBVyxZQUF2QixDQUFYO0FBTkk7O0FBckNOLFNBNENNLFlBNUNOO0FBOENFRCxvQkFBYzdELE9BQU8rQixRQUFQLEVBQWlCOUIsTUFBakIsQ0FBd0IsWUFBeEIsQ0FBZDtBQUNBNkQsbUJBQWE5RCxPQUFPZ0MsT0FBUCxFQUFnQi9CLE1BQWhCLENBQXVCLFlBQXZCLENBQWI7QUFDQW5YLGNBQVE4YixFQUFFLDZDQUFGLENBQVI7QUFDQWpCLG1CQUFhLElBQUkxaEIsSUFBSixDQUFZNGhCLGNBQVksWUFBeEIsQ0FBYjtBQUNBL0IsaUJBQVcsSUFBSTdmLElBQUosQ0FBWTZoQixhQUFXLFlBQXZCLENBQVg7QUFOSTs7QUE1Q04sU0FtRE0sWUFuRE47QUFxREVELG9CQUFjN0QsT0FBT2dELGlCQUFQLEVBQTBCL0MsTUFBMUIsQ0FBaUMsWUFBakMsQ0FBZDtBQUNBNkQsbUJBQWE5RCxPQUFPK0MsaUJBQVAsRUFBMEI5QyxNQUExQixDQUFpQyxZQUFqQyxDQUFiO0FBQ0FuWCxjQUFROGIsRUFBRSw2Q0FBRixDQUFSO0FBQ0FqQixtQkFBYSxJQUFJMWhCLElBQUosQ0FBWTRoQixjQUFZLFlBQXhCLENBQWI7QUFDQS9CLGlCQUFXLElBQUk3ZixJQUFKLENBQVk2aEIsYUFBVyxZQUF2QixDQUFYO0FBTkk7O0FBbkROLFNBMERNLFdBMUROO0FBNERFQyxrQkFBWS9ELE9BQU9pQyxVQUFQLEVBQW1CaEMsTUFBbkIsQ0FBMEIsWUFBMUIsQ0FBWjtBQUNBZ0Usa0JBQVlqRSxPQUFPc0MsVUFBUCxFQUFtQnJDLE1BQW5CLENBQTBCLFlBQTFCLENBQVo7QUFDQW5YLGNBQVE4YixFQUFFLDRDQUFGLENBQVI7QUFDQWpCLG1CQUFhLElBQUkxaEIsSUFBSixDQUFZOGhCLFlBQVUsWUFBdEIsQ0FBYjtBQUNBakMsaUJBQVcsSUFBSTdmLElBQUosQ0FBWWdpQixZQUFVLFlBQXRCLENBQVg7QUFOSTs7QUExRE4sU0FpRU0sV0FqRU47QUFtRUVGLGtCQUFZL0QsT0FBTzZDLE1BQVAsRUFBZTVDLE1BQWYsQ0FBc0IsWUFBdEIsQ0FBWjtBQUNBZ0Usa0JBQVlqRSxPQUFPcUUsTUFBUCxFQUFlcEUsTUFBZixDQUFzQixZQUF0QixDQUFaO0FBQ0FuWCxjQUFROGIsRUFBRSw0Q0FBRixDQUFSO0FBQ0FqQixtQkFBYSxJQUFJMWhCLElBQUosQ0FBWThoQixZQUFVLFlBQXRCLENBQWI7QUFDQWpDLGlCQUFXLElBQUk3ZixJQUFKLENBQVlnaUIsWUFBVSxZQUF0QixDQUFYO0FBTkk7O0FBakVOLFNBd0VNLFdBeEVOO0FBMEVFRixrQkFBWS9ELE9BQU84QyxVQUFQLEVBQW1CN0MsTUFBbkIsQ0FBMEIsWUFBMUIsQ0FBWjtBQUNBZ0Usa0JBQVlqRSxPQUFPbUQsVUFBUCxFQUFtQmxELE1BQW5CLENBQTBCLFlBQTFCLENBQVo7QUFDQW5YLGNBQVE4YixFQUFFLDRDQUFGLENBQVI7QUFDQWpCLG1CQUFhLElBQUkxaEIsSUFBSixDQUFZOGhCLFlBQVUsWUFBdEIsQ0FBYjtBQUNBakMsaUJBQVcsSUFBSTdmLElBQUosQ0FBWWdpQixZQUFVLFlBQXRCLENBQVg7QUFOSTs7QUF4RU4sU0ErRU0sU0EvRU47QUFpRkVHLG1CQUFhcEUsT0FBTzBFLE9BQVAsRUFBZ0J6RSxNQUFoQixDQUF1QixZQUF2QixDQUFiO0FBQ0FuWCxjQUFROGIsRUFBRSwwQ0FBRixDQUFSO0FBQ0FqQixtQkFBYSxJQUFJMWhCLElBQUosQ0FBWW1pQixhQUFXLFlBQXZCLENBQWI7QUFDQXRDLGlCQUFXLElBQUk3ZixJQUFKLENBQVltaUIsYUFBVyxZQUF2QixDQUFYO0FBTEk7O0FBL0VOLFNBcUZNLE9BckZOO0FBdUZFRixpQkFBV2xFLE9BQU9QLEdBQVAsRUFBWVEsTUFBWixDQUFtQixZQUFuQixDQUFYO0FBQ0FuWCxjQUFROGIsRUFBRSx3Q0FBRixDQUFSO0FBQ0FqQixtQkFBYSxJQUFJMWhCLElBQUosQ0FBWWlpQixXQUFTLFlBQXJCLENBQWI7QUFDQXBDLGlCQUFXLElBQUk3ZixJQUFKLENBQVlpaUIsV0FBUyxZQUFyQixDQUFYO0FBTEk7O0FBckZOLFNBMkZNLFVBM0ZOO0FBNkZFQyxvQkFBY25FLE9BQU93RSxRQUFQLEVBQWlCdkUsTUFBakIsQ0FBd0IsWUFBeEIsQ0FBZDtBQUNBblgsY0FBUThiLEVBQUUsMkNBQUYsQ0FBUjtBQUNBakIsbUJBQWEsSUFBSTFoQixJQUFKLENBQVlraUIsY0FBWSxZQUF4QixDQUFiO0FBQ0FyQyxpQkFBVyxJQUFJN2YsSUFBSixDQUFZa2lCLGNBQVksWUFBeEIsQ0FBWDtBQUxJOztBQTNGTixTQWlHTSxhQWpHTjtBQW1HRUgsb0JBQWNoRSxPQUFPMEMsV0FBUCxFQUFvQnpDLE1BQXBCLENBQTJCLFlBQTNCLENBQWQ7QUFDQTJELGtCQUFZNUQsT0FBT1AsR0FBUCxFQUFZUSxNQUFaLENBQW1CLFlBQW5CLENBQVo7QUFDQW5YLGNBQVE4YixFQUFFLDhDQUFGLENBQVI7QUFDQWpCLG1CQUFhLElBQUkxaEIsSUFBSixDQUFZK2hCLGNBQVksWUFBeEIsQ0FBYjtBQUNBbEMsaUJBQVcsSUFBSTdmLElBQUosQ0FBWTJoQixZQUFVLFlBQXRCLENBQVg7QUFOSTs7QUFqR04sU0F3R00sY0F4R047QUEwR0VJLG9CQUFjaEUsT0FBT3dDLFlBQVAsRUFBcUJ2QyxNQUFyQixDQUE0QixZQUE1QixDQUFkO0FBQ0EyRCxrQkFBWTVELE9BQU9QLEdBQVAsRUFBWVEsTUFBWixDQUFtQixZQUFuQixDQUFaO0FBQ0FuWCxjQUFROGIsRUFBRSwrQ0FBRixDQUFSO0FBQ0FqQixtQkFBYSxJQUFJMWhCLElBQUosQ0FBWStoQixjQUFZLFlBQXhCLENBQWI7QUFDQWxDLGlCQUFXLElBQUk3ZixJQUFKLENBQVkyaEIsWUFBVSxZQUF0QixDQUFYO0FBTkk7O0FBeEdOLFNBK0dNLGNBL0dOO0FBaUhFSSxvQkFBY2hFLE9BQU95QyxZQUFQLEVBQXFCeEMsTUFBckIsQ0FBNEIsWUFBNUIsQ0FBZDtBQUNBMkQsa0JBQVk1RCxPQUFPUCxHQUFQLEVBQVlRLE1BQVosQ0FBbUIsWUFBbkIsQ0FBWjtBQUNBblgsY0FBUThiLEVBQUUsK0NBQUYsQ0FBUjtBQUNBakIsbUJBQWEsSUFBSTFoQixJQUFKLENBQVkraEIsY0FBWSxZQUF4QixDQUFiO0FBQ0FsQyxpQkFBVyxJQUFJN2YsSUFBSixDQUFZMmhCLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQS9HTixTQXNITSxjQXRITjtBQXdIRUksb0JBQWNoRSxPQUFPMkMsWUFBUCxFQUFxQjFDLE1BQXJCLENBQTRCLFlBQTVCLENBQWQ7QUFDQTJELGtCQUFZNUQsT0FBT1AsR0FBUCxFQUFZUSxNQUFaLENBQW1CLFlBQW5CLENBQVo7QUFDQW5YLGNBQVE4YixFQUFFLCtDQUFGLENBQVI7QUFDQWpCLG1CQUFhLElBQUkxaEIsSUFBSixDQUFZK2hCLGNBQVksWUFBeEIsQ0FBYjtBQUNBbEMsaUJBQVcsSUFBSTdmLElBQUosQ0FBWTJoQixZQUFVLFlBQXRCLENBQVg7QUFOSTs7QUF0SE4sU0E2SE0sZUE3SE47QUErSEVJLG9CQUFjaEUsT0FBT3VDLGFBQVAsRUFBc0J0QyxNQUF0QixDQUE2QixZQUE3QixDQUFkO0FBQ0EyRCxrQkFBWTVELE9BQU9QLEdBQVAsRUFBWVEsTUFBWixDQUFtQixZQUFuQixDQUFaO0FBQ0FuWCxjQUFROGIsRUFBRSxnREFBRixDQUFSO0FBQ0FqQixtQkFBYSxJQUFJMWhCLElBQUosQ0FBWStoQixjQUFZLFlBQXhCLENBQWI7QUFDQWxDLGlCQUFXLElBQUk3ZixJQUFKLENBQVkyaEIsWUFBVSxZQUF0QixDQUFYO0FBTkk7O0FBN0hOLFNBb0lNLGFBcElOO0FBc0lFSSxvQkFBY2hFLE9BQU9QLEdBQVAsRUFBWVEsTUFBWixDQUFtQixZQUFuQixDQUFkO0FBQ0EyRCxrQkFBWTVELE9BQU93RCxXQUFQLEVBQW9CdkQsTUFBcEIsQ0FBMkIsWUFBM0IsQ0FBWjtBQUNBblgsY0FBUThiLEVBQUUsOENBQUYsQ0FBUjtBQUNBakIsbUJBQWEsSUFBSTFoQixJQUFKLENBQVkraEIsY0FBWSxZQUF4QixDQUFiO0FBQ0FsQyxpQkFBVyxJQUFJN2YsSUFBSixDQUFZMmhCLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQXBJTixTQTJJTSxjQTNJTjtBQTZJRUksb0JBQWNoRSxPQUFPUCxHQUFQLEVBQVlRLE1BQVosQ0FBbUIsWUFBbkIsQ0FBZDtBQUNBMkQsa0JBQVk1RCxPQUFPc0QsWUFBUCxFQUFxQnJELE1BQXJCLENBQTRCLFlBQTVCLENBQVo7QUFDQW5YLGNBQVE4YixFQUFFLCtDQUFGLENBQVI7QUFDQWpCLG1CQUFhLElBQUkxaEIsSUFBSixDQUFZK2hCLGNBQVksWUFBeEIsQ0FBYjtBQUNBbEMsaUJBQVcsSUFBSTdmLElBQUosQ0FBWTJoQixZQUFVLFlBQXRCLENBQVg7QUFOSTs7QUEzSU4sU0FrSk0sY0FsSk47QUFvSkVJLG9CQUFjaEUsT0FBT1AsR0FBUCxFQUFZUSxNQUFaLENBQW1CLFlBQW5CLENBQWQ7QUFDQTJELGtCQUFZNUQsT0FBT3VELFlBQVAsRUFBcUJ0RCxNQUFyQixDQUE0QixZQUE1QixDQUFaO0FBQ0FuWCxjQUFROGIsRUFBRSwrQ0FBRixDQUFSO0FBQ0FqQixtQkFBYSxJQUFJMWhCLElBQUosQ0FBWStoQixjQUFZLFlBQXhCLENBQWI7QUFDQWxDLGlCQUFXLElBQUk3ZixJQUFKLENBQVkyaEIsWUFBVSxZQUF0QixDQUFYO0FBTkk7O0FBbEpOLFNBeUpNLGNBekpOO0FBMkpFSSxvQkFBY2hFLE9BQU9QLEdBQVAsRUFBWVEsTUFBWixDQUFtQixZQUFuQixDQUFkO0FBQ0EyRCxrQkFBWTVELE9BQU95RCxZQUFQLEVBQXFCeEQsTUFBckIsQ0FBNEIsWUFBNUIsQ0FBWjtBQUNBblgsY0FBUThiLEVBQUUsK0NBQUYsQ0FBUjtBQUNBakIsbUJBQWEsSUFBSTFoQixJQUFKLENBQVkraEIsY0FBWSxZQUF4QixDQUFiO0FBQ0FsQyxpQkFBVyxJQUFJN2YsSUFBSixDQUFZMmhCLFlBQVUsWUFBdEIsQ0FBWDtBQU5JOztBQXpKTixTQWdLTSxlQWhLTjtBQWtLRUksb0JBQWNoRSxPQUFPUCxHQUFQLEVBQVlRLE1BQVosQ0FBbUIsWUFBbkIsQ0FBZDtBQUNBMkQsa0JBQVk1RCxPQUFPcUQsYUFBUCxFQUFzQnBELE1BQXRCLENBQTZCLFlBQTdCLENBQVo7QUFDQW5YLGNBQVE4YixFQUFFLGdEQUFGLENBQVI7QUFDQWpCLG1CQUFhLElBQUkxaEIsSUFBSixDQUFZK2hCLGNBQVksWUFBeEIsQ0FBYjtBQUNBbEMsaUJBQVcsSUFBSTdmLElBQUosQ0FBWTJoQixZQUFVLFlBQXRCLENBQVg7QUF0S0Y7O0FBd0tBdmlCLFdBQVMsQ0FBQ3NpQixVQUFELEVBQWE3QixRQUFiLENBQVQ7O0FBQ0EsTUFBRzNCLGVBQWMsVUFBakI7QUFJQ25pQixNQUFFd1EsT0FBRixDQUFVbk4sTUFBVixFQUFrQixVQUFDd2pCLEVBQUQ7QUFDakIsVUFBR0EsRUFBSDtBQzZDSyxlRDVDSkEsR0FBR0MsUUFBSCxDQUFZRCxHQUFHRSxRQUFILEtBQWdCRixHQUFHRyxpQkFBSCxLQUF5QixFQUFyRCxDQzRDSTtBQUNEO0FEL0NMO0FDaURDOztBRDdDRixTQUFPO0FBQ05sYyxXQUFPQSxLQUREO0FBRU45RyxTQUFLQSxHQUZDO0FBR05YLFlBQVFBO0FBSEYsR0FBUDtBQXBRd0MsQ0FBekM7O0FBMFFBOUssUUFBUTB1Qix3QkFBUixHQUFtQyxVQUFDOUUsVUFBRDtBQUNsQyxNQUFHQSxjQUFjNXBCLFFBQVEycEIsaUNBQVIsQ0FBMENDLFVBQTFDLENBQWpCO0FBQ0MsV0FBTyxTQUFQO0FBREQsU0FFSyxJQUFHLENBQUMsVUFBRCxFQUFhLE1BQWIsRUFBcUIsTUFBckIsRUFBNkJ0VixRQUE3QixDQUFzQ3NWLFVBQXRDLENBQUg7QUFDSixXQUFPLFVBQVA7QUFESTtBQUdKLFdBQU8sR0FBUDtBQ2dEQztBRHREZ0MsQ0FBbkM7O0FBUUE1cEIsUUFBUTJ1QixpQkFBUixHQUE0QixVQUFDL0UsVUFBRDtBQVEzQixNQUFBRSxVQUFBLEVBQUE4RSxTQUFBO0FBQUFBLGNBQVk7QUFDWEMsV0FBTztBQUFDdGMsYUFBTzhiLEVBQUUsZ0NBQUYsQ0FBUjtBQUE2Qy9qQixhQUFPO0FBQXBELEtBREk7QUFFWHdrQixhQUFTO0FBQUN2YyxhQUFPOGIsRUFBRSxrQ0FBRixDQUFSO0FBQStDL2pCLGFBQU87QUFBdEQsS0FGRTtBQUdYeWtCLGVBQVc7QUFBQ3hjLGFBQU84YixFQUFFLG9DQUFGLENBQVI7QUFBaUQvakIsYUFBTztBQUF4RCxLQUhBO0FBSVgwa0Isa0JBQWM7QUFBQ3pjLGFBQU84YixFQUFFLHVDQUFGLENBQVI7QUFBb0QvakIsYUFBTztBQUEzRCxLQUpIO0FBS1gya0IsbUJBQWU7QUFBQzFjLGFBQU84YixFQUFFLHdDQUFGLENBQVI7QUFBcUQvakIsYUFBTztBQUE1RCxLQUxKO0FBTVg0a0Isc0JBQWtCO0FBQUMzYyxhQUFPOGIsRUFBRSwyQ0FBRixDQUFSO0FBQXdEL2pCLGFBQU87QUFBL0QsS0FOUDtBQU9YaWEsY0FBVTtBQUFDaFMsYUFBTzhiLEVBQUUsbUNBQUYsQ0FBUjtBQUFnRC9qQixhQUFPO0FBQXZELEtBUEM7QUFRWDZrQixpQkFBYTtBQUFDNWMsYUFBTzhiLEVBQUUsMkNBQUYsQ0FBUjtBQUF3RC9qQixhQUFPO0FBQS9ELEtBUkY7QUFTWDhrQixpQkFBYTtBQUFDN2MsYUFBTzhiLEVBQUUsc0NBQUYsQ0FBUjtBQUFtRC9qQixhQUFPO0FBQTFELEtBVEY7QUFVWCtrQixhQUFTO0FBQUM5YyxhQUFPOGIsRUFBRSxrQ0FBRixDQUFSO0FBQStDL2pCLGFBQU87QUFBdEQ7QUFWRSxHQUFaOztBQWFBLE1BQUdzZixlQUFjLE1BQWpCO0FBQ0MsV0FBT25pQixFQUFFcUQsTUFBRixDQUFTOGpCLFNBQVQsQ0FBUDtBQ3lFQzs7QUR2RUY5RSxlQUFhLEVBQWI7O0FBRUEsTUFBRzlwQixRQUFRMnBCLGlDQUFSLENBQTBDQyxVQUExQyxDQUFIO0FBQ0NFLGVBQVd6YyxJQUFYLENBQWdCdWhCLFVBQVVTLE9BQTFCO0FBQ0FydkIsWUFBUTZwQiwyQkFBUixDQUFvQ0QsVUFBcEMsRUFBZ0RFLFVBQWhEO0FBRkQsU0FHSyxJQUFHRixlQUFjLE1BQWQsSUFBd0JBLGVBQWMsVUFBdEMsSUFBb0RBLGVBQWMsTUFBbEUsSUFBNEVBLGVBQWMsTUFBN0Y7QUFFSkUsZUFBV3pjLElBQVgsQ0FBZ0J1aEIsVUFBVXJLLFFBQTFCO0FBRkksU0FHQSxJQUFHcUYsZUFBYyxRQUFkLElBQTBCQSxlQUFjLGVBQXhDLElBQTJEQSxlQUFjLFFBQTVFO0FBQ0pFLGVBQVd6YyxJQUFYLENBQWdCdWhCLFVBQVVDLEtBQTFCLEVBQWlDRCxVQUFVRSxPQUEzQztBQURJLFNBRUEsSUFBR2xGLGVBQWMsVUFBZCxJQUE0QkEsZUFBYyxRQUE3QztBQUNKRSxlQUFXemMsSUFBWCxDQUFnQnVoQixVQUFVQyxLQUExQixFQUFpQ0QsVUFBVUUsT0FBM0MsRUFBb0RGLFVBQVVHLFNBQTlELEVBQXlFSCxVQUFVSSxZQUFuRixFQUFpR0osVUFBVUssYUFBM0csRUFBMEhMLFVBQVVNLGdCQUFwSTtBQURJLFNBRUEsSUFBR3RGLGVBQWMsU0FBakI7QUFDSkUsZUFBV3pjLElBQVgsQ0FBZ0J1aEIsVUFBVUMsS0FBMUIsRUFBaUNELFVBQVVFLE9BQTNDO0FBREksU0FFQSxJQUFHbEYsZUFBYyxVQUFqQjtBQUNKRSxlQUFXemMsSUFBWCxDQUFnQnVoQixVQUFVQyxLQUExQixFQUFpQ0QsVUFBVUUsT0FBM0M7QUFESSxTQUVBLElBQUdsRixlQUFjLFFBQWpCO0FBQ0pFLGVBQVd6YyxJQUFYLENBQWdCdWhCLFVBQVVDLEtBQTFCLEVBQWlDRCxVQUFVRSxPQUEzQztBQURJO0FBR0poRixlQUFXemMsSUFBWCxDQUFnQnVoQixVQUFVQyxLQUExQixFQUFpQ0QsVUFBVUUsT0FBM0M7QUN1RUM7O0FEckVGLFNBQU9oRixVQUFQO0FBN0MyQixDQUE1QixDLENBK0NBOzs7OztBQUlBOXBCLFFBQVFzdkIsbUJBQVIsR0FBOEIsVUFBQ25vQixXQUFEO0FBQzdCLE1BQUFvQyxNQUFBLEVBQUF5YixTQUFBLEVBQUF1SyxVQUFBLEVBQUFybkIsR0FBQTtBQUFBcUIsV0FBQSxDQUFBckIsTUFBQWxJLFFBQUFnSSxTQUFBLENBQUFiLFdBQUEsYUFBQWUsSUFBeUNxQixNQUF6QyxHQUF5QyxNQUF6QztBQUNBeWIsY0FBWSxFQUFaOztBQUVBdmQsSUFBRTBDLElBQUYsQ0FBT1osTUFBUCxFQUFlLFVBQUN5TSxLQUFEO0FDMEVaLFdEekVGZ1AsVUFBVTNYLElBQVYsQ0FBZTtBQUFDNUksWUFBTXVSLE1BQU12UixJQUFiO0FBQW1CK3FCLGVBQVN4WixNQUFNd1o7QUFBbEMsS0FBZixDQ3lFRTtBRDFFSDs7QUFHQUQsZUFBYSxFQUFiOztBQUNBOW5CLElBQUUwQyxJQUFGLENBQU8xQyxFQUFFdUQsTUFBRixDQUFTZ2EsU0FBVCxFQUFvQixTQUFwQixDQUFQLEVBQXVDLFVBQUNoUCxLQUFEO0FDNkVwQyxXRDVFRnVaLFdBQVdsaUIsSUFBWCxDQUFnQjJJLE1BQU12UixJQUF0QixDQzRFRTtBRDdFSDs7QUFFQSxTQUFPOHFCLFVBQVA7QUFWNkIsQ0FBOUIsQzs7Ozs7Ozs7Ozs7O0FFMWlDQSxJQUFBRSxZQUFBLEVBQUFDLFdBQUE7QUFBQTF2QixRQUFRMnZCLGNBQVIsR0FBeUIsRUFBekI7O0FBRUFELGNBQWMsVUFBQ3ZvQixXQUFELEVBQWMyVyxPQUFkO0FBQ2IsTUFBQTlNLFVBQUEsRUFBQW5MLEtBQUEsRUFBQXFDLEdBQUEsRUFBQUMsSUFBQSxFQUFBc0wsSUFBQSxFQUFBQyxJQUFBLEVBQUFDLElBQUEsRUFBQWljLElBQUEsRUFBQUMsV0FBQTs7QUFBQTtBQUNDN2UsaUJBQWFoUixRQUFRZ0osYUFBUixDQUFzQjdCLFdBQXRCLENBQWI7O0FBQ0EsUUFBRyxDQUFDMlcsUUFBUUssSUFBWjtBQUNDO0FDSUU7O0FESEgwUixrQkFBYztBQUNYLFdBQUsxb0IsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQSxhQUFPMlcsUUFBUUssSUFBUixDQUFhMlIsS0FBYixDQUFtQixJQUFuQixFQUF5QkMsU0FBekIsQ0FBUDtBQUZXLEtBQWQ7O0FBR0EsUUFBR2pTLFFBQVFrUyxJQUFSLEtBQWdCLGVBQW5CO0FBQ0csYUFBQWhmLGNBQUEsUUFBQTlJLE1BQUE4SSxXQUFBaWYsTUFBQSxZQUFBL25CLElBQTJCZ29CLE1BQTNCLENBQWtDTCxXQUFsQyxJQUFPLE1BQVAsR0FBTyxNQUFQO0FBREgsV0FFTyxJQUFHL1IsUUFBUWtTLElBQVIsS0FBZ0IsZUFBbkI7QUFDSixhQUFBaGYsY0FBQSxRQUFBN0ksT0FBQTZJLFdBQUFpZixNQUFBLFlBQUE5bkIsS0FBMkJpTixNQUEzQixDQUFrQ3lhLFdBQWxDLElBQU8sTUFBUCxHQUFPLE1BQVA7QUFESSxXQUVBLElBQUcvUixRQUFRa1MsSUFBUixLQUFnQixlQUFuQjtBQUNKLGFBQUFoZixjQUFBLFFBQUF5QyxPQUFBekMsV0FBQWlmLE1BQUEsWUFBQXhjLEtBQTJCMGMsTUFBM0IsQ0FBa0NOLFdBQWxDLElBQU8sTUFBUCxHQUFPLE1BQVA7QUFESSxXQUVBLElBQUcvUixRQUFRa1MsSUFBUixLQUFnQixjQUFuQjtBQUNKLGFBQUFoZixjQUFBLFFBQUEwQyxPQUFBMUMsV0FBQW9mLEtBQUEsWUFBQTFjLEtBQTBCd2MsTUFBMUIsQ0FBaUNMLFdBQWpDLElBQU8sTUFBUCxHQUFPLE1BQVA7QUFESSxXQUVBLElBQUcvUixRQUFRa1MsSUFBUixLQUFnQixjQUFuQjtBQUNKLGFBQUFoZixjQUFBLFFBQUEyQyxPQUFBM0MsV0FBQW9mLEtBQUEsWUFBQXpjLEtBQTBCeUIsTUFBMUIsQ0FBaUN5YSxXQUFqQyxJQUFPLE1BQVAsR0FBTyxNQUFQO0FBREksV0FFQSxJQUFHL1IsUUFBUWtTLElBQVIsS0FBZ0IsY0FBbkI7QUFDSixhQUFBaGYsY0FBQSxRQUFBNGUsT0FBQTVlLFdBQUFvZixLQUFBLFlBQUFSLEtBQTBCTyxNQUExQixDQUFpQ04sV0FBakMsSUFBTyxNQUFQLEdBQU8sTUFBUDtBQWxCSjtBQUFBLFdBQUFuUixNQUFBO0FBbUJNN1ksWUFBQTZZLE1BQUE7QUNRSCxXRFBGNVksUUFBUUQsS0FBUixDQUFjLG1CQUFkLEVBQW1DQSxLQUFuQyxDQ09FO0FBQ0Q7QUQ3QlcsQ0FBZDs7QUF1QkE0cEIsZUFBZSxVQUFDdG9CLFdBQUQ7QUFDZDs7O0tBQUEsSUFBQWUsR0FBQTtBQ2VDLFNBQU8sQ0FBQ0EsTUFBTWxJLFFBQVEydkIsY0FBUixDQUF1QnhvQixXQUF2QixDQUFQLEtBQStDLElBQS9DLEdBQXNEZSxJRFZ6QndWLE9DVXlCLEdEVmZ6RixPQ1VlLENEVlAsVUFBQ29ZLEtBQUQ7QUNXcEQsV0RWRkEsTUFBTUYsTUFBTixFQ1VFO0FEWEgsR0NVOEQsQ0FBdEQsR0RWUixNQ1VDO0FEaEJhLENBQWY7O0FBU0Fud0IsUUFBUTZILFlBQVIsR0FBdUIsVUFBQ1YsV0FBRDtBQUV0QixNQUFBRCxHQUFBO0FBQUFBLFFBQU1sSCxRQUFRZ0ksU0FBUixDQUFrQmIsV0FBbEIsQ0FBTjtBQUVBc29CLGVBQWF0b0IsV0FBYjtBQUVBbkgsVUFBUTJ2QixjQUFSLENBQXVCeG9CLFdBQXZCLElBQXNDLEVBQXRDO0FDV0MsU0RURE0sRUFBRTBDLElBQUYsQ0FBT2pELElBQUkyVyxRQUFYLEVBQXFCLFVBQUNDLE9BQUQsRUFBVXdTLFlBQVY7QUFDcEIsUUFBQUMsYUFBQTs7QUFBQSxRQUFHNXVCLE9BQU9xRixRQUFQLElBQW9COFcsUUFBUUksRUFBUixLQUFjLFFBQWxDLElBQStDSixRQUFRSyxJQUF2RCxJQUFnRUwsUUFBUWtTLElBQTNFO0FBQ0NPLHNCQUFnQmIsWUFBWXZvQixXQUFaLEVBQXlCMlcsT0FBekIsQ0FBaEI7O0FBQ0EsVUFBR3lTLGFBQUg7QUFDQ3Z3QixnQkFBUTJ2QixjQUFSLENBQXVCeG9CLFdBQXZCLEVBQW9Da0csSUFBcEMsQ0FBeUNrakIsYUFBekM7QUFIRjtBQ2VHOztBRFhILFFBQUc1dUIsT0FBTzBHLFFBQVAsSUFBb0J5VixRQUFRSSxFQUFSLEtBQWMsUUFBbEMsSUFBK0NKLFFBQVFLLElBQXZELElBQWdFTCxRQUFRa1MsSUFBM0U7QUFDQ08sc0JBQWdCYixZQUFZdm9CLFdBQVosRUFBeUIyVyxPQUF6QixDQUFoQjtBQ2FHLGFEWkg5ZCxRQUFRMnZCLGNBQVIsQ0FBdUJ4b0IsV0FBdkIsRUFBb0NrRyxJQUFwQyxDQUF5Q2tqQixhQUF6QyxDQ1lHO0FBQ0Q7QURwQkosSUNTQztBRGpCcUIsQ0FBdkIsQzs7Ozs7Ozs7Ozs7O0FFbENBLElBQUFDLDhCQUFBLEVBQUE5b0IsS0FBQSxFQUFBK29CLHFCQUFBLEVBQUFDLHlCQUFBLEVBQUFDLHNCQUFBLEVBQUFDLGdCQUFBLEVBQUFDLHdCQUFBLEVBQUFDLGlDQUFBLEVBQUFDLG1CQUFBLEVBQUFDLHNCQUFBLEVBQUFDLFNBQUE7QUFBQXZwQixRQUFRbkcsUUFBUSxPQUFSLENBQVI7QUFFQWl2QixpQ0FBaUMsQ0FBQyxhQUFELEVBQWdCLGFBQWhCLEVBQStCLFdBQS9CLEVBQTRDLFdBQTVDLEVBQXlELGtCQUF6RCxFQUE2RSxnQkFBN0UsRUFBK0Ysc0JBQS9GLEVBQXVILG9CQUF2SCxFQUNoQyxnQkFEZ0MsRUFDZCxnQkFEYyxFQUNJLGtCQURKLEVBQ3dCLGtCQUR4QixFQUM0QyxjQUQ1QyxFQUM0RCxnQkFENUQsQ0FBakM7QUFFQUssMkJBQTJCLENBQUMscUJBQUQsRUFBd0Isa0JBQXhCLEVBQTRDLG1CQUE1QyxFQUFpRSxtQkFBakUsRUFBc0YsbUJBQXRGLEVBQTJHLHlCQUEzRyxDQUEzQjtBQUNBRSxzQkFBc0J0cEIsRUFBRXlQLEtBQUYsQ0FBUXNaLDhCQUFSLEVBQXdDSyx3QkFBeEMsQ0FBdEI7O0FBRUE3d0IsUUFBUWlOLGNBQVIsR0FBeUIsVUFBQzlGLFdBQUQsRUFBYzhCLE9BQWQsRUFBdUJJLE1BQXZCO0FBQ3hCLE1BQUFuQyxHQUFBOztBQUFBLE1BQUd2RixPQUFPMEcsUUFBVjtBQUNDLFFBQUcsQ0FBQ2xCLFdBQUo7QUFDQ0Esb0JBQWNvQixRQUFRQyxHQUFSLENBQVksYUFBWixDQUFkO0FDS0U7O0FESkh0QixVQUFNbEgsUUFBUWdJLFNBQVIsQ0FBa0JiLFdBQWxCLENBQU47O0FBQ0EsUUFBRyxDQUFDRCxHQUFKO0FBQ0M7QUNNRTs7QURMSCxXQUFPQSxJQUFJK0UsV0FBSixDQUFnQnpELEdBQWhCLEVBQVA7QUFORCxTQU9LLElBQUc3RyxPQUFPcUYsUUFBVjtBQ09GLFdETkZoSCxRQUFRa3hCLG9CQUFSLENBQTZCam9CLE9BQTdCLEVBQXNDSSxNQUF0QyxFQUE4Q2xDLFdBQTlDLENDTUU7QUFDRDtBRGhCc0IsQ0FBekI7O0FBV0FuSCxRQUFRbXhCLG9CQUFSLEdBQStCLFVBQUNocUIsV0FBRCxFQUFjbUwsTUFBZCxFQUFzQmpKLE1BQXRCLEVBQThCSixPQUE5QjtBQUM5QixNQUFBbW9CLE9BQUEsRUFBQUMsZ0JBQUEsRUFBQUMsZ0JBQUEsRUFBQXJsQixXQUFBLEVBQUFzbEIsaUJBQUEsRUFBQUMsa0JBQUEsRUFBQXRwQixHQUFBLEVBQUF1cEIsZ0JBQUE7O0FBQUEsTUFBRyxDQUFDdHFCLFdBQUQsSUFBaUJ4RixPQUFPMEcsUUFBM0I7QUFDQ2xCLGtCQUFjb0IsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBZDtBQ1VDOztBRFJGLE1BQUcsQ0FBQ1MsT0FBRCxJQUFhdEgsT0FBTzBHLFFBQXZCO0FBQ0NZLGNBQVVWLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQVY7QUNVQzs7QURVRnlELGdCQUFjeEUsRUFBRUMsS0FBRixDQUFRMUgsUUFBUWlOLGNBQVIsQ0FBdUI5RixXQUF2QixFQUFvQzhCLE9BQXBDLEVBQTZDSSxNQUE3QyxDQUFSLENBQWQ7O0FBRUEsTUFBR2lKLE1BQUg7QUFDQyxRQUFHQSxPQUFPb2Ysa0JBQVY7QUFDQyxhQUFPcGYsT0FBT29mLGtCQUFkO0FDVEU7O0FEV0hOLGNBQVU5ZSxPQUFPcWYsS0FBUCxLQUFnQnRvQixNQUFoQixNQUFBbkIsTUFBQW9LLE9BQUFxZixLQUFBLFlBQUF6cEIsSUFBd0NXLEdBQXhDLEdBQXdDLE1BQXhDLE1BQStDUSxNQUF6RDs7QUFFQSxRQUFHbEMsZ0JBQWUsV0FBbEI7QUFHQ2txQix5QkFBbUIvZSxPQUFPc2YsTUFBUCxDQUFjLGlCQUFkLENBQW5CO0FBQ0FOLHlCQUFtQnR4QixRQUFRaU4sY0FBUixDQUF1Qm9rQixnQkFBdkIsRUFBeUNwb0IsT0FBekMsRUFBa0RJLE1BQWxELENBQW5CO0FBQ0E0QyxrQkFBWXlELFdBQVosR0FBMEJ6RCxZQUFZeUQsV0FBWixJQUEyQjRoQixpQkFBaUJuaEIsZ0JBQXRFO0FBQ0FsRSxrQkFBWTJELFNBQVosR0FBd0IzRCxZQUFZMkQsU0FBWixJQUF5QjBoQixpQkFBaUJsaEIsY0FBbEU7QUFDQW5FLGtCQUFZNEQsV0FBWixHQUEwQjVELFlBQVk0RCxXQUFaLElBQTJCeWhCLGlCQUFpQmpoQixnQkFBdEU7O0FBQ0EsVUFBRyxDQUFDaWhCLGlCQUFpQmhoQixjQUFsQixJQUFxQyxDQUFDOGdCLE9BQXpDO0FBQ0NubEIsb0JBQVkyRCxTQUFaLEdBQXdCLEtBQXhCO0FBQ0EzRCxvQkFBWTRELFdBQVosR0FBMEIsS0FBMUI7QUNaRzs7QURhSjVELGtCQUFZMEQsU0FBWixHQUF3QjFELFlBQVkwRCxTQUFaLElBQXlCMmhCLGlCQUFpQnJoQixjQUFsRTs7QUFDQSxVQUFHLENBQUNxaEIsaUJBQWlCcGhCLFlBQWxCLElBQW1DLENBQUNraEIsT0FBdkM7QUFDQ25sQixvQkFBWTBELFNBQVosR0FBd0IsS0FBeEI7QUFiRjtBQUFBO0FBZUMsVUFBR2hPLE9BQU8wRyxRQUFWO0FBQ0NvcEIsMkJBQW1CN2xCLFFBQVEyRCxpQkFBUixFQUFuQjtBQUREO0FBR0NraUIsMkJBQW1CenhCLFFBQVF1UCxpQkFBUixDQUEwQmxHLE1BQTFCLEVBQWtDSixPQUFsQyxDQUFuQjtBQ1ZHOztBRFdKc29CLDBCQUFBamYsVUFBQSxPQUFvQkEsT0FBUTVELFVBQTVCLEdBQTRCLE1BQTVCOztBQUNBLFVBQUc2aUIscUJBQXNCOXBCLEVBQUU4RSxRQUFGLENBQVdnbEIsaUJBQVgsQ0FBdEIsSUFBd0RBLGtCQUFrQjFvQixHQUE3RTtBQUVDMG9CLDRCQUFvQkEsa0JBQWtCMW9CLEdBQXRDO0FDVkc7O0FEV0oyb0IsMkJBQUFsZixVQUFBLE9BQXFCQSxPQUFRM0QsV0FBN0IsR0FBNkIsTUFBN0I7O0FBQ0EsVUFBRzZpQixzQkFBdUJBLG1CQUFtQmpuQixNQUExQyxJQUFxRDlDLEVBQUU4RSxRQUFGLENBQVdpbEIsbUJBQW1CLENBQW5CLENBQVgsQ0FBeEQ7QUFFQ0EsNkJBQXFCQSxtQkFBbUJoYixHQUFuQixDQUF1QixVQUFDcWIsQ0FBRDtBQ1Z0QyxpQkRVNENBLEVBQUVocEIsR0NWOUM7QURVZSxVQUFyQjtBQ1JHOztBRFNKMm9CLDJCQUFxQi9wQixFQUFFeVAsS0FBRixDQUFRc2Esa0JBQVIsRUFBNEIsQ0FBQ0QsaUJBQUQsQ0FBNUIsQ0FBckI7O0FBQ0EsVUFBRyxDQUFDdGxCLFlBQVlrQixnQkFBYixJQUFrQyxDQUFDaWtCLE9BQW5DLElBQStDLENBQUNubEIsWUFBWStELG9CQUEvRDtBQUNDL0Qsb0JBQVkyRCxTQUFaLEdBQXdCLEtBQXhCO0FBQ0EzRCxvQkFBWTRELFdBQVosR0FBMEIsS0FBMUI7QUFGRCxhQUdLLElBQUcsQ0FBQzVELFlBQVlrQixnQkFBYixJQUFrQ2xCLFlBQVkrRCxvQkFBakQ7QUFDSixZQUFHd2hCLHNCQUF1QkEsbUJBQW1Cam5CLE1BQTdDO0FBQ0MsY0FBR2tuQixvQkFBcUJBLGlCQUFpQmxuQixNQUF6QztBQUNDLGdCQUFHLENBQUM5QyxFQUFFcXFCLFlBQUYsQ0FBZUwsZ0JBQWYsRUFBaUNELGtCQUFqQyxFQUFxRGpuQixNQUF6RDtBQUVDMEIsMEJBQVkyRCxTQUFaLEdBQXdCLEtBQXhCO0FBQ0EzRCwwQkFBWTRELFdBQVosR0FBMEIsS0FBMUI7QUFKRjtBQUFBO0FBT0M1RCx3QkFBWTJELFNBQVosR0FBd0IsS0FBeEI7QUFDQTNELHdCQUFZNEQsV0FBWixHQUEwQixLQUExQjtBQVRGO0FBREk7QUNJRDs7QURRSixVQUFHeUMsT0FBT3lmLE1BQVAsSUFBa0IsQ0FBQzlsQixZQUFZa0IsZ0JBQWxDO0FBQ0NsQixvQkFBWTJELFNBQVosR0FBd0IsS0FBeEI7QUFDQTNELG9CQUFZNEQsV0FBWixHQUEwQixLQUExQjtBQ05HOztBRFFKLFVBQUcsQ0FBQzVELFlBQVk2RCxjQUFiLElBQWdDLENBQUNzaEIsT0FBakMsSUFBNkMsQ0FBQ25sQixZQUFZOEQsa0JBQTdEO0FBQ0M5RCxvQkFBWTBELFNBQVosR0FBd0IsS0FBeEI7QUFERCxhQUVLLElBQUcsQ0FBQzFELFlBQVk2RCxjQUFiLElBQWdDN0QsWUFBWThELGtCQUEvQztBQUNKLFlBQUd5aEIsc0JBQXVCQSxtQkFBbUJqbkIsTUFBN0M7QUFDQyxjQUFHa25CLG9CQUFxQkEsaUJBQWlCbG5CLE1BQXpDO0FBQ0MsZ0JBQUcsQ0FBQzlDLEVBQUVxcUIsWUFBRixDQUFlTCxnQkFBZixFQUFpQ0Qsa0JBQWpDLEVBQXFEam5CLE1BQXpEO0FBRUMwQiwwQkFBWTBELFNBQVosR0FBd0IsS0FBeEI7QUFIRjtBQUFBO0FBTUMxRCx3QkFBWTBELFNBQVosR0FBd0IsS0FBeEI7QUFQRjtBQURJO0FBakROO0FBTkQ7QUM0REU7O0FES0YsU0FBTzFELFdBQVA7QUE1RjhCLENBQS9COztBQWtHQSxJQUFHdEssT0FBTzBHLFFBQVY7QUFDQ3JJLFVBQVFneUIsK0JBQVIsR0FBMEMsVUFBQ0MsaUJBQUQsRUFBb0JDLGVBQXBCLEVBQXFDQyxhQUFyQyxFQUFvRDlvQixNQUFwRCxFQUE0REosT0FBNUQ7QUFDekMsUUFBQW1wQix3QkFBQSxFQUFBQyxXQUFBLEVBQUFmLGdCQUFBLEVBQUFnQix3QkFBQSxFQUFBN1csTUFBQSxFQUFBOFcsdUJBQUEsRUFBQXhsQiwwQkFBQTs7QUFBQSxRQUFHLENBQUNrbEIsaUJBQUQsSUFBdUJ0d0IsT0FBTzBHLFFBQWpDO0FBQ0M0cEIsMEJBQW9CMXBCLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQXBCO0FDTEU7O0FET0gsUUFBRyxDQUFDMHBCLGVBQUo7QUFDQ3BzQixjQUFRRCxLQUFSLENBQWMsNEZBQWQ7QUFDQSxhQUFPLEVBQVA7QUNMRTs7QURPSCxRQUFHLENBQUNzc0IsYUFBRCxJQUFtQnh3QixPQUFPMEcsUUFBN0I7QUFDQzhwQixzQkFBZ0JueUIsUUFBUXd5QixlQUFSLEVBQWhCO0FDTEU7O0FET0gsUUFBRyxDQUFDbnBCLE1BQUQsSUFBWTFILE9BQU8wRyxRQUF0QjtBQUNDZ0IsZUFBUzFILE9BQU8wSCxNQUFQLEVBQVQ7QUNMRTs7QURPSCxRQUFHLENBQUNKLE9BQUQsSUFBYXRILE9BQU8wRyxRQUF2QjtBQUNDWSxnQkFBVVYsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBVjtBQ0xFOztBRE9IOG9CLHVCQUFtQnR4QixRQUFRbXhCLG9CQUFSLENBQTZCYyxpQkFBN0IsRUFBZ0RFLGFBQWhELEVBQStEOW9CLE1BQS9ELEVBQXVFSixPQUF2RSxDQUFuQjtBQUNBcXBCLCtCQUEyQnR5QixRQUFRaU4sY0FBUixDQUF1QmlsQixnQkFBZ0IvcUIsV0FBdkMsQ0FBM0I7QUFDQXNVLGFBQVNoVSxFQUFFQyxLQUFGLENBQVE0cUIsd0JBQVIsQ0FBVDs7QUFFQSxRQUFHSixnQkFBZ0I5WSxPQUFuQjtBQUNDcUMsYUFBTy9MLFdBQVAsR0FBcUI0aUIseUJBQXlCNWlCLFdBQXpCLElBQXdDNGhCLGlCQUFpQm5oQixnQkFBOUU7QUFDQXNMLGFBQU83TCxTQUFQLEdBQW1CMGlCLHlCQUF5QjFpQixTQUF6QixJQUFzQzBoQixpQkFBaUJsaEIsY0FBMUU7QUFGRDtBQUlDckQsbUNBQTZCbWxCLGdCQUFnQm5sQiwwQkFBaEIsSUFBOEMsS0FBM0U7QUFDQXNsQixvQkFBYyxLQUFkOztBQUNBLFVBQUd0bEIsK0JBQThCLElBQWpDO0FBQ0NzbEIsc0JBQWNmLGlCQUFpQjNoQixTQUEvQjtBQURELGFBRUssSUFBRzVDLCtCQUE4QixLQUFqQztBQUNKc2xCLHNCQUFjZixpQkFBaUIxaEIsU0FBL0I7QUNORzs7QURRSjJpQixnQ0FBMEJ2eUIsUUFBUXl5Qix3QkFBUixDQUFpQ04sYUFBakMsRUFBZ0RGLGlCQUFoRCxDQUExQjtBQUNBRyxpQ0FBMkJHLHdCQUF3QjlvQixPQUF4QixDQUFnQ3lvQixnQkFBZ0IvcUIsV0FBaEQsSUFBK0QsQ0FBQyxDQUEzRjtBQUVBc1UsYUFBTy9MLFdBQVAsR0FBcUIyaUIsZUFBZUMseUJBQXlCNWlCLFdBQXhDLElBQXVELENBQUMwaUIsd0JBQTdFO0FBQ0EzVyxhQUFPN0wsU0FBUCxHQUFtQnlpQixlQUFlQyx5QkFBeUIxaUIsU0FBeEMsSUFBcUQsQ0FBQ3dpQix3QkFBekU7QUNQRTs7QURRSCxXQUFPM1csTUFBUDtBQXJDeUMsR0FBMUM7QUNnQ0E7O0FET0QsSUFBRzlaLE9BQU9xRixRQUFWO0FBRUNoSCxVQUFRMHlCLGlCQUFSLEdBQTRCLFVBQUN6cEIsT0FBRCxFQUFVSSxNQUFWO0FBQzNCLFFBQUFzcEIsRUFBQSxFQUFBdnBCLFlBQUEsRUFBQTZDLFdBQUEsRUFBQTJtQixLQUFBLEVBQUFDLFVBQUEsRUFBQUMsY0FBQSxFQUFBQyxZQUFBLEVBQUFDLGlCQUFBLEVBQUFDLGdCQUFBLEVBQUFDLGFBQUEsRUFBQUMsaUJBQUEsRUFBQUMsVUFBQSxFQUFBQyxjQUFBLEVBQUFDLFdBQUEsRUFBQUMsZUFBQSxFQUFBQyxhQUFBLEVBQUFDLGlCQUFBLEVBQUFDLFNBQUEsRUFBQUMsYUFBQSxFQUFBQyxPQUFBLEVBQUFDLFNBQUE7O0FBQUE1bkIsa0JBQ0M7QUFBQTZuQixlQUFTLEVBQVQ7QUFDQUMscUJBQWU7QUFEZixLQURELENBRDJCLENBSTNCOzs7Ozs7O0FBUUEzcUIsbUJBQWUsS0FBZjtBQUNBeXFCLGdCQUFZLElBQVo7O0FBQ0EsUUFBR3hxQixNQUFIO0FBQ0NELHFCQUFlcEosUUFBUW9KLFlBQVIsQ0FBcUJILE9BQXJCLEVBQThCSSxNQUE5QixDQUFmO0FBQ0F3cUIsa0JBQVk3ekIsUUFBUWdKLGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNNLE9BQXJDLENBQTZDO0FBQUUvQixlQUFPMEIsT0FBVDtBQUFrQjJGLGNBQU12RjtBQUF4QixPQUE3QyxFQUErRTtBQUFFRSxnQkFBUTtBQUFFeXFCLG1CQUFTO0FBQVg7QUFBVixPQUEvRSxDQUFaO0FDSUU7O0FERkhuQixpQkFBYTd5QixRQUFRZ0osYUFBUixDQUFzQixnQkFBdEIsRUFBd0NNLE9BQXhDLENBQWdEO0FBQUMvQixhQUFPMEIsT0FBUjtBQUFpQnhFLFlBQU07QUFBdkIsS0FBaEQsRUFBaUY7QUFBQzhFLGNBQU87QUFBQ1YsYUFBSSxDQUFMO0FBQVFrckIsdUJBQWM7QUFBdEI7QUFBUixLQUFqRixLQUF1SCxJQUFwSTtBQUNBTCxnQkFBWTF6QixRQUFRZ0osYUFBUixDQUFzQixnQkFBdEIsRUFBd0NNLE9BQXhDLENBQWdEO0FBQUMvQixhQUFPMEIsT0FBUjtBQUFpQnhFLFlBQU07QUFBdkIsS0FBaEQsRUFBZ0Y7QUFBQzhFLGNBQU87QUFBQ1YsYUFBSSxDQUFMO0FBQVFrckIsdUJBQWM7QUFBdEI7QUFBUixLQUFoRixLQUFzSCxJQUFsSTtBQUNBVCxrQkFBY3R6QixRQUFRZ0osYUFBUixDQUFzQixnQkFBdEIsRUFBd0NNLE9BQXhDLENBQWdEO0FBQUMvQixhQUFPMEIsT0FBUjtBQUFpQnhFLFlBQU07QUFBdkIsS0FBaEQsRUFBa0Y7QUFBQzhFLGNBQU87QUFBQ1YsYUFBSSxDQUFMO0FBQVFrckIsdUJBQWM7QUFBdEI7QUFBUixLQUFsRixLQUF3SCxJQUF0STtBQUNBWCxpQkFBYXB6QixRQUFRZ0osYUFBUixDQUFzQixnQkFBdEIsRUFBd0NNLE9BQXhDLENBQWdEO0FBQUMvQixhQUFPMEIsT0FBUjtBQUFpQnhFLFlBQU07QUFBdkIsS0FBaEQsRUFBaUY7QUFBQzhFLGNBQU87QUFBQ1YsYUFBSSxDQUFMO0FBQVFrckIsdUJBQWM7QUFBdEI7QUFBUixLQUFqRixLQUF1SCxJQUFwSTtBQUVBUCxvQkFBZ0J4ekIsUUFBUWdKLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDTSxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzBCLE9BQVI7QUFBaUJ4RSxZQUFNO0FBQXZCLEtBQWhELEVBQW9GO0FBQUM4RSxjQUFPO0FBQUNWLGFBQUksQ0FBTDtBQUFRa3JCLHVCQUFjO0FBQXRCO0FBQVIsS0FBcEYsS0FBMEgsSUFBMUk7QUFDQWIsb0JBQWdCbHpCLFFBQVFnSixhQUFSLENBQXNCLGdCQUF0QixFQUF3Q00sT0FBeEMsQ0FBZ0Q7QUFBQy9CLGFBQU8wQixPQUFSO0FBQWlCeEUsWUFBTTtBQUF2QixLQUFoRCxFQUFvRjtBQUFDOEUsY0FBTztBQUFDVixhQUFJLENBQUw7QUFBUWtyQix1QkFBYztBQUF0QjtBQUFSLEtBQXBGLEtBQTBILElBQTFJOztBQUNBLFFBQUdGLGFBQWFBLFVBQVVHLE9BQTFCO0FBQ0NqQixxQkFBZS95QixRQUFRZ0osYUFBUixDQUFzQixnQkFBdEIsRUFBd0NvSixJQUF4QyxDQUE2QztBQUFDN0ssZUFBTzBCLE9BQVI7QUFBaUI2SSxhQUFLLENBQUM7QUFBQ21pQixpQkFBTzVxQjtBQUFSLFNBQUQsRUFBa0I7QUFBQzVFLGdCQUFNb3ZCLFVBQVVHO0FBQWpCLFNBQWxCO0FBQXRCLE9BQTdDLEVBQWtIO0FBQUN6cUIsZ0JBQU87QUFBQ1YsZUFBSSxDQUFMO0FBQVFrckIseUJBQWMsQ0FBdEI7QUFBeUJ0dkIsZ0JBQUs7QUFBOUI7QUFBUixPQUFsSCxFQUE2SjROLEtBQTdKLEVBQWY7QUFERDtBQUdDMGdCLHFCQUFlL3lCLFFBQVFnSixhQUFSLENBQXNCLGdCQUF0QixFQUF3Q29KLElBQXhDLENBQTZDO0FBQUM2aEIsZUFBTzVxQixNQUFSO0FBQWdCOUIsZUFBTzBCO0FBQXZCLE9BQTdDLEVBQThFO0FBQUNNLGdCQUFPO0FBQUNWLGVBQUksQ0FBTDtBQUFRa3JCLHlCQUFjLENBQXRCO0FBQXlCdHZCLGdCQUFLO0FBQTlCO0FBQVIsT0FBOUUsRUFBeUg0TixLQUF6SCxFQUFmO0FDMkVFOztBRHpFSHlnQixxQkFBaUIsSUFBakI7QUFDQWEsb0JBQWdCLElBQWhCO0FBQ0FKLHNCQUFrQixJQUFsQjtBQUNBRixxQkFBaUIsSUFBakI7QUFDQUosdUJBQW1CLElBQW5CO0FBQ0FRLHdCQUFvQixJQUFwQjtBQUNBTix3QkFBb0IsSUFBcEI7O0FBRUEsUUFBQU4sY0FBQSxPQUFHQSxXQUFZaHFCLEdBQWYsR0FBZSxNQUFmO0FBQ0NpcUIsdUJBQWlCOXlCLFFBQVFnSixhQUFSLENBQXNCLG9CQUF0QixFQUE0Q29KLElBQTVDLENBQWlEO0FBQUM4aEIsMkJBQW1CckIsV0FBV2hxQjtBQUEvQixPQUFqRCxFQUFzRjtBQUFDVSxnQkFBUTtBQUFDNHFCLG1CQUFTLENBQVY7QUFBYUMsb0JBQVUsQ0FBdkI7QUFBMEJDLHNCQUFZLENBQXRDO0FBQXlDQyx1QkFBYTtBQUF0RDtBQUFULE9BQXRGLEVBQTBKamlCLEtBQTFKLEVBQWpCO0FDbUZFOztBRGxGSCxRQUFBcWhCLGFBQUEsT0FBR0EsVUFBVzdxQixHQUFkLEdBQWMsTUFBZDtBQUNDOHFCLHNCQUFnQjN6QixRQUFRZ0osYUFBUixDQUFzQixvQkFBdEIsRUFBNENvSixJQUE1QyxDQUFpRDtBQUFDOGhCLDJCQUFtQlIsVUFBVTdxQjtBQUE5QixPQUFqRCxFQUFxRjtBQUFDVSxnQkFBUTtBQUFDNHFCLG1CQUFTLENBQVY7QUFBYUMsb0JBQVUsQ0FBdkI7QUFBMEJDLHNCQUFZLENBQXRDO0FBQXlDQyx1QkFBYTtBQUF0RDtBQUFULE9BQXJGLEVBQXlKamlCLEtBQXpKLEVBQWhCO0FDNkZFOztBRDVGSCxRQUFBaWhCLGVBQUEsT0FBR0EsWUFBYXpxQixHQUFoQixHQUFnQixNQUFoQjtBQUNDMHFCLHdCQUFrQnZ6QixRQUFRZ0osYUFBUixDQUFzQixvQkFBdEIsRUFBNENvSixJQUE1QyxDQUFpRDtBQUFDOGhCLDJCQUFtQlosWUFBWXpxQjtBQUFoQyxPQUFqRCxFQUF1RjtBQUFDVSxnQkFBUTtBQUFDNHFCLG1CQUFTLENBQVY7QUFBYUMsb0JBQVUsQ0FBdkI7QUFBMEJDLHNCQUFZLENBQXRDO0FBQXlDQyx1QkFBYTtBQUF0RDtBQUFULE9BQXZGLEVBQTJKamlCLEtBQTNKLEVBQWxCO0FDdUdFOztBRHRHSCxRQUFBK2dCLGNBQUEsT0FBR0EsV0FBWXZxQixHQUFmLEdBQWUsTUFBZjtBQUNDd3FCLHVCQUFpQnJ6QixRQUFRZ0osYUFBUixDQUFzQixvQkFBdEIsRUFBNENvSixJQUE1QyxDQUFpRDtBQUFDOGhCLDJCQUFtQmQsV0FBV3ZxQjtBQUEvQixPQUFqRCxFQUFzRjtBQUFDVSxnQkFBUTtBQUFDNHFCLG1CQUFTLENBQVY7QUFBYUMsb0JBQVUsQ0FBdkI7QUFBMEJDLHNCQUFZLENBQXRDO0FBQXlDQyx1QkFBYTtBQUF0RDtBQUFULE9BQXRGLEVBQTBKamlCLEtBQTFKLEVBQWpCO0FDaUhFOztBRGhISCxRQUFBbWhCLGlCQUFBLE9BQUdBLGNBQWUzcUIsR0FBbEIsR0FBa0IsTUFBbEI7QUFDQzRxQiwwQkFBb0J6ekIsUUFBUWdKLGFBQVIsQ0FBc0Isb0JBQXRCLEVBQTRDb0osSUFBNUMsQ0FBaUQ7QUFBQzhoQiwyQkFBbUJWLGNBQWMzcUI7QUFBbEMsT0FBakQsRUFBeUY7QUFBQ1UsZ0JBQVE7QUFBQzRxQixtQkFBUyxDQUFWO0FBQWFDLG9CQUFVLENBQXZCO0FBQTBCQyxzQkFBWSxDQUF0QztBQUF5Q0MsdUJBQWE7QUFBdEQ7QUFBVCxPQUF6RixFQUE2SmppQixLQUE3SixFQUFwQjtBQzJIRTs7QUQxSEgsUUFBQTZnQixpQkFBQSxPQUFHQSxjQUFlcnFCLEdBQWxCLEdBQWtCLE1BQWxCO0FBQ0NzcUIsMEJBQW9CbnpCLFFBQVFnSixhQUFSLENBQXNCLG9CQUF0QixFQUE0Q29KLElBQTVDLENBQWlEO0FBQUM4aEIsMkJBQW1CaEIsY0FBY3JxQjtBQUFsQyxPQUFqRCxFQUF5RjtBQUFDVSxnQkFBUTtBQUFDNHFCLG1CQUFTLENBQVY7QUFBYUMsb0JBQVUsQ0FBdkI7QUFBMEJDLHNCQUFZLENBQXRDO0FBQXlDQyx1QkFBYTtBQUF0RDtBQUFULE9BQXpGLEVBQTZKamlCLEtBQTdKLEVBQXBCO0FDcUlFOztBRG5JSCxRQUFHMGdCLGFBQWF4b0IsTUFBYixHQUFzQixDQUF6QjtBQUNDcXBCLGdCQUFVbnNCLEVBQUUwUyxLQUFGLENBQVE0WSxZQUFSLEVBQXNCLEtBQXRCLENBQVY7QUFDQUUseUJBQW1CanpCLFFBQVFnSixhQUFSLENBQXNCLG9CQUF0QixFQUE0Q29KLElBQTVDLENBQWlEO0FBQUM4aEIsMkJBQW1CO0FBQUNuaUIsZUFBSzZoQjtBQUFOO0FBQXBCLE9BQWpELEVBQXNGdmhCLEtBQXRGLEVBQW5CO0FBQ0EyZ0IsMEJBQW9CdnJCLEVBQUUwUyxLQUFGLENBQVE0WSxZQUFSLEVBQXNCLE1BQXRCLENBQXBCO0FDeUlFOztBRHhJSEgsWUFBUTtBQUNQQyw0QkFETztBQUVQYSwwQkFGTztBQUdQWCxnQ0FITztBQUlQTyw4QkFKTztBQUtQRiw0QkFMTztBQU1QSSxrQ0FOTztBQU9QTixrQ0FQTztBQVFQOXBCLGdDQVJPO0FBU1B5cUIsMEJBVE87QUFVUGYsb0NBVk87QUFXUGEsa0NBWE87QUFZUEosc0NBWk87QUFhUEYsb0NBYk87QUFjUEksMENBZE87QUFlUE4sMENBZk87QUFnQlBGO0FBaEJPLEtBQVI7QUFrQkFobkIsZ0JBQVk4bkIsYUFBWixHQUE0Qi96QixRQUFRdTBCLGVBQVIsQ0FBd0JDLElBQXhCLENBQTZCNUIsS0FBN0IsRUFBb0MzcEIsT0FBcEMsRUFBNkNJLE1BQTdDLENBQTVCO0FBQ0E0QyxnQkFBWXdvQixjQUFaLEdBQTZCejBCLFFBQVEwMEIsZ0JBQVIsQ0FBeUJGLElBQXpCLENBQThCNUIsS0FBOUIsRUFBcUMzcEIsT0FBckMsRUFBOENJLE1BQTlDLENBQTdCO0FBQ0E0QyxnQkFBWTBvQixvQkFBWixHQUFtQzNCLGlCQUFuQztBQUNBTCxTQUFLLENBQUw7O0FBQ0FsckIsTUFBRTBDLElBQUYsQ0FBT25LLFFBQVF5SSxhQUFmLEVBQThCLFVBQUNyQyxNQUFELEVBQVNlLFdBQVQ7QUFDN0J3ckI7O0FBQ0EsVUFBRyxDQUFDbHJCLEVBQUVvUSxHQUFGLENBQU16UixNQUFOLEVBQWMsT0FBZCxDQUFELElBQTJCLENBQUNBLE9BQU9tQixLQUFuQyxJQUE0Q25CLE9BQU9tQixLQUFQLEtBQWdCMEIsT0FBL0Q7QUFDQyxZQUFHLENBQUN4QixFQUFFb1EsR0FBRixDQUFNelIsTUFBTixFQUFjLGdCQUFkLENBQUQsSUFBb0NBLE9BQU9vZCxjQUFQLEtBQXlCLEdBQTdELElBQXFFcGQsT0FBT29kLGNBQVAsS0FBeUIsR0FBekIsSUFBZ0NwYSxZQUF4RztBQUNDNkMsc0JBQVk2bkIsT0FBWixDQUFvQjNzQixXQUFwQixJQUFtQ25ILFFBQVEySCxhQUFSLENBQXNCRCxNQUFNMUgsUUFBUUMsT0FBUixDQUFnQmtILFdBQWhCLENBQU4sQ0FBdEIsRUFBMkQ4QixPQUEzRCxDQUFuQztBQzBJSyxpQkR6SUxnRCxZQUFZNm5CLE9BQVosQ0FBb0Izc0IsV0FBcEIsRUFBaUMsYUFBakMsSUFBa0RuSCxRQUFRa3hCLG9CQUFSLENBQTZCc0QsSUFBN0IsQ0FBa0M1QixLQUFsQyxFQUF5QzNwQixPQUF6QyxFQUFrREksTUFBbEQsRUFBMERsQyxXQUExRCxDQ3lJN0M7QUQ1SVA7QUM4SUk7QURoSkw7O0FBTUEsV0FBTzhFLFdBQVA7QUFuRjJCLEdBQTVCOztBQXFGQWdsQixjQUFZLFVBQUMyRCxLQUFELEVBQVFDLEtBQVI7QUFDWCxRQUFHLENBQUNELEtBQUQsSUFBVyxDQUFDQyxLQUFmO0FBQ0MsYUFBTyxNQUFQO0FDNklFOztBRDVJSCxRQUFHLENBQUNELEtBQUo7QUFDQ0EsY0FBUSxFQUFSO0FDOElFOztBRDdJSCxRQUFHLENBQUNDLEtBQUo7QUFDQ0EsY0FBUSxFQUFSO0FDK0lFOztBRDlJSCxXQUFPcHRCLEVBQUV5UCxLQUFGLENBQVEwZCxLQUFSLEVBQWVDLEtBQWYsQ0FBUDtBQVBXLEdBQVo7O0FBU0FqRSxxQkFBbUIsVUFBQ2dFLEtBQUQsRUFBUUMsS0FBUjtBQUNsQixRQUFHLENBQUNELEtBQUQsSUFBVyxDQUFDQyxLQUFmO0FBQ0MsYUFBTyxNQUFQO0FDZ0pFOztBRC9JSCxRQUFHLENBQUNELEtBQUo7QUFDQ0EsY0FBUSxFQUFSO0FDaUpFOztBRGhKSCxRQUFHLENBQUNDLEtBQUo7QUFDQ0EsY0FBUSxFQUFSO0FDa0pFOztBRGpKSCxXQUFPcHRCLEVBQUVxcUIsWUFBRixDQUFlOEMsS0FBZixFQUFzQkMsS0FBdEIsQ0FBUDtBQVBrQixHQUFuQjs7QUFTQXBFLDBCQUF3QixVQUFDcUUsTUFBRCxFQUFTQyxLQUFUO0FBQ3ZCLFFBQUFDLGFBQUEsRUFBQUMsU0FBQTtBQUFBQSxnQkFBWWxFLG1CQUFaO0FDb0pFLFdEbkpGaUUsZ0JBQ0dELFFBQ0Z0dEIsRUFBRTBDLElBQUYsQ0FBTzhxQixTQUFQLEVBQWtCLFVBQUNDLFFBQUQ7QUNrSmYsYURqSkZKLE9BQU9JLFFBQVAsSUFBbUJILE1BQU1HLFFBQU4sQ0NpSmpCO0FEbEpILE1BREUsR0FBSCxNQ2tKRTtBRHJKcUIsR0FBeEI7O0FBc0JBcEUsc0NBQW9DLFVBQUNnRSxNQUFELEVBQVNDLEtBQVQ7QUFDbkMsUUFBQUUsU0FBQTtBQUFBQSxnQkFBWXpFLDhCQUFaO0FDcUlFLFdEcElGL29CLEVBQUUwQyxJQUFGLENBQU84cUIsU0FBUCxFQUFrQixVQUFDQyxRQUFEO0FBQ2pCLFVBQUdILE1BQU1HLFFBQU4sQ0FBSDtBQ3FJSyxlRHBJSkosT0FBT0ksUUFBUCxJQUFtQixJQ29JZjtBQUNEO0FEdklMLE1Db0lFO0FEdElpQyxHQUFwQzs7QUF3QkFsMUIsVUFBUXUwQixlQUFSLEdBQTBCLFVBQUN0ckIsT0FBRCxFQUFVSSxNQUFWO0FBQ3pCLFFBQUE4ckIsSUFBQSxFQUFBL3JCLFlBQUEsRUFBQWdzQixRQUFBLEVBQUF4QyxLQUFBLEVBQUFDLFVBQUEsRUFBQUssYUFBQSxFQUFBTSxhQUFBLEVBQUFFLFNBQUEsRUFBQXhyQixHQUFBLEVBQUFDLElBQUEsRUFBQTByQixTQUFBLEVBQUF3QixXQUFBO0FBQUF4QyxpQkFBYSxLQUFLQSxVQUFMLElBQW1CN3lCLFFBQVFnSixhQUFSLENBQXNCLGdCQUF0QixFQUF3Q00sT0FBeEMsQ0FBZ0Q7QUFBQy9CLGFBQU8wQixPQUFSO0FBQWlCeEUsWUFBTTtBQUF2QixLQUFoRCxFQUFpRjtBQUFDOEUsY0FBTztBQUFDVixhQUFJLENBQUw7QUFBUWtyQix1QkFBYztBQUF0QjtBQUFSLEtBQWpGLENBQWhDO0FBQ0FMLGdCQUFZLEtBQUtBLFNBQUwsSUFBa0IxekIsUUFBUWdKLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDTSxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzBCLE9BQVI7QUFBaUJ4RSxZQUFNO0FBQXZCLEtBQWhELEVBQWdGO0FBQUM4RSxjQUFPO0FBQUNWLGFBQUksQ0FBTDtBQUFRa3JCLHVCQUFjO0FBQXRCO0FBQVIsS0FBaEYsQ0FBOUI7QUFDQVAsb0JBQWdCLEtBQUtGLFdBQUwsSUFBb0J0ekIsUUFBUWdKLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDTSxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzBCLE9BQVI7QUFBaUJ4RSxZQUFNO0FBQXZCLEtBQWhELEVBQW9GO0FBQUM4RSxjQUFPO0FBQUNWLGFBQUksQ0FBTDtBQUFRa3JCLHVCQUFjO0FBQXRCO0FBQVIsS0FBcEYsQ0FBcEM7QUFDQWIsb0JBQWdCLEtBQUtFLFVBQUwsSUFBbUJwekIsUUFBUWdKLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDTSxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzBCLE9BQVI7QUFBaUJ4RSxZQUFNO0FBQXZCLEtBQWhELEVBQW9GO0FBQUM4RSxjQUFPO0FBQUNWLGFBQUksQ0FBTDtBQUFRa3JCLHVCQUFjO0FBQXRCO0FBQVIsS0FBcEYsQ0FBbkM7QUFHQUYsZ0JBQVksSUFBWjs7QUFDQSxRQUFHeHFCLE1BQUg7QUFDQ3dxQixrQkFBWTd6QixRQUFRZ0osYUFBUixDQUFzQixhQUF0QixFQUFxQ00sT0FBckMsQ0FBNkM7QUFBRS9CLGVBQU8wQixPQUFUO0FBQWtCMkYsY0FBTXZGO0FBQXhCLE9BQTdDLEVBQStFO0FBQUVFLGdCQUFRO0FBQUV5cUIsbUJBQVM7QUFBWDtBQUFWLE9BQS9FLENBQVo7QUMySkU7O0FEMUpILFFBQUdILGFBQWFBLFVBQVVHLE9BQTFCO0FBQ0NwQixjQUFRNXlCLFFBQVFnSixhQUFSLENBQXNCLGdCQUF0QixFQUF3Q29KLElBQXhDLENBQTZDO0FBQUM3SyxlQUFPMEIsT0FBUjtBQUFpQjZJLGFBQUssQ0FBQztBQUFDbWlCLGlCQUFPNXFCO0FBQVIsU0FBRCxFQUFrQjtBQUFDNUUsZ0JBQU1vdkIsVUFBVUc7QUFBakIsU0FBbEI7QUFBdEIsT0FBN0MsRUFBa0g7QUFBQ3pxQixnQkFBTztBQUFDVixlQUFJLENBQUw7QUFBUWtyQix5QkFBYyxDQUF0QjtBQUF5QnR2QixnQkFBSztBQUE5QjtBQUFSLE9BQWxILEVBQTZKNE4sS0FBN0osRUFBUjtBQUREO0FBR0N1Z0IsY0FBUTV5QixRQUFRZ0osYUFBUixDQUFzQixnQkFBdEIsRUFBd0NvSixJQUF4QyxDQUE2QztBQUFDNmhCLGVBQU81cUIsTUFBUjtBQUFnQjlCLGVBQU8wQjtBQUF2QixPQUE3QyxFQUE4RTtBQUFDTSxnQkFBTztBQUFDVixlQUFJLENBQUw7QUFBUWtyQix5QkFBYyxDQUF0QjtBQUF5QnR2QixnQkFBSztBQUE5QjtBQUFSLE9BQTlFLEVBQXlINE4sS0FBekgsRUFBUjtBQ29MRTs7QURuTEhqSixtQkFBa0IzQixFQUFFMFosU0FBRixDQUFZLEtBQUsvWCxZQUFqQixJQUFvQyxLQUFLQSxZQUF6QyxHQUEyRHBKLFFBQVFvSixZQUFSLENBQXFCSCxPQUFyQixFQUE4QkksTUFBOUIsQ0FBN0U7QUFDQThyQixXQUFPLEVBQVA7O0FBQ0EsUUFBRy9yQixZQUFIO0FBQ0MsYUFBTyxFQUFQO0FBREQ7QUFHQ2lzQixvQkFBQSxDQUFBbnRCLE1BQUFsSSxRQUFBZ0osYUFBQSxnQkFBQU0sT0FBQTtBQ3FMSy9CLGVBQU8wQixPRHJMWjtBQ3NMSzJGLGNBQU12RjtBRHRMWCxTQ3VMTTtBQUNERSxnQkFBUTtBQUNOeXFCLG1CQUFTO0FBREg7QUFEUCxPRHZMTixNQzJMVSxJRDNMVixHQzJMaUI5ckIsSUQzTG1HOHJCLE9BQXBILEdBQW9ILE1BQXBIO0FBQ0FvQixpQkFBVzFCLFNBQVg7O0FBQ0EsVUFBRzJCLFdBQUg7QUFDQyxZQUFHQSxnQkFBZSxVQUFsQjtBQUNDRCxxQkFBVzVCLGFBQVg7QUFERCxlQUVLLElBQUc2QixnQkFBZSxVQUFsQjtBQUNKRCxxQkFBV2xDLGFBQVg7QUFKRjtBQ2lNSTs7QUQ1TEosVUFBQWtDLFlBQUEsUUFBQWp0QixPQUFBaXRCLFNBQUFyQixhQUFBLFlBQUE1ckIsS0FBNEJvQyxNQUE1QixHQUE0QixNQUE1QixHQUE0QixNQUE1QjtBQUNDNHFCLGVBQU8xdEIsRUFBRXlQLEtBQUYsQ0FBUWllLElBQVIsRUFBY0MsU0FBU3JCLGFBQXZCLENBQVA7QUFERDtBQUlDLGVBQU8sRUFBUDtBQzZMRzs7QUQ1TEp0c0IsUUFBRTBDLElBQUYsQ0FBT3lvQixLQUFQLEVBQWMsVUFBQzBDLElBQUQ7QUFDYixZQUFHLENBQUNBLEtBQUt2QixhQUFUO0FBQ0M7QUM4TEk7O0FEN0xMLFlBQUd1QixLQUFLN3dCLElBQUwsS0FBYSxPQUFiLElBQXlCNndCLEtBQUs3d0IsSUFBTCxLQUFhLE1BQXRDLElBQWdENndCLEtBQUs3d0IsSUFBTCxLQUFhLFVBQTdELElBQTJFNndCLEtBQUs3d0IsSUFBTCxLQUFhLFVBQTNGO0FBRUM7QUM4TEk7O0FBQ0QsZUQ5TEowd0IsT0FBTzF0QixFQUFFeVAsS0FBRixDQUFRaWUsSUFBUixFQUFjRyxLQUFLdkIsYUFBbkIsQ0M4TEg7QURwTUw7O0FBT0EsYUFBT3RzQixFQUFFdVMsT0FBRixDQUFVdlMsRUFBRTh0QixJQUFGLENBQU9KLElBQVAsQ0FBVixFQUF1QixNQUF2QixFQUFpQyxJQUFqQyxDQUFQO0FDZ01FO0FEdE9zQixHQUExQjs7QUF3Q0FuMUIsVUFBUTAwQixnQkFBUixHQUEyQixVQUFDenJCLE9BQUQsRUFBVUksTUFBVjtBQUMxQixRQUFBbXNCLFNBQUEsRUFBQUMsVUFBQSxFQUFBQyxRQUFBLEVBQUFDLGdCQUFBLEVBQUF2c0IsWUFBQSxFQUFBd3NCLEtBQUEsRUFBQUMsYUFBQSxFQUFBQyxVQUFBLEVBQUFsRCxLQUFBLEVBQUExcUIsR0FBQSxFQUFBQyxJQUFBLEVBQUFzVCxNQUFBLEVBQUE0WixXQUFBO0FBQUF6QyxZQUFTLEtBQUtHLFlBQUwsSUFBcUIveUIsUUFBUWdKLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDb0osSUFBeEMsQ0FBNkM7QUFBQzZoQixhQUFPNXFCLE1BQVI7QUFBZ0I5QixhQUFPMEI7QUFBdkIsS0FBN0MsRUFBOEU7QUFBQ00sY0FBTztBQUFDVixhQUFJLENBQUw7QUFBUWtyQix1QkFBYyxDQUF0QjtBQUF5QnR2QixjQUFLO0FBQTlCO0FBQVIsS0FBOUUsRUFBeUg0TixLQUF6SCxFQUE5QjtBQUNBakosbUJBQWtCM0IsRUFBRTBaLFNBQUYsQ0FBWSxLQUFLL1gsWUFBakIsSUFBb0MsS0FBS0EsWUFBekMsR0FBMkRwSixRQUFRb0osWUFBUixDQUFxQkgsT0FBckIsRUFBOEJJLE1BQTlCLENBQTdFO0FBQ0Fvc0IsaUJBQUEsQ0FBQXZ0QixNQUFBbEksUUFBQUksSUFBQSxDQUFBNGpCLEtBQUEsWUFBQTliLElBQWlDNnRCLFdBQWpDLEdBQWlDLE1BQWpDOztBQUVBLFNBQU9OLFVBQVA7QUFDQyxhQUFPLEVBQVA7QUMwTUU7O0FEek1IRCxnQkFBWUMsV0FBV3JqQixJQUFYLENBQWdCLFVBQUN5ZixDQUFEO0FDMk14QixhRDFNSEEsRUFBRWhwQixHQUFGLEtBQVMsT0MwTU47QUQzTVEsTUFBWjtBQUVBNHNCLGlCQUFhQSxXQUFXcnJCLE1BQVgsQ0FBa0IsVUFBQ3luQixDQUFEO0FDNE0zQixhRDNNSEEsRUFBRWhwQixHQUFGLEtBQVMsT0MyTU47QUQ1TVMsTUFBYjtBQUVBZ3RCLG9CQUFnQnB1QixFQUFFdUQsTUFBRixDQUFTdkQsRUFBRTJDLE1BQUYsQ0FBUzNDLEVBQUVxRCxNQUFGLENBQVM5SyxRQUFRSSxJQUFqQixDQUFULEVBQWlDLFVBQUN5eEIsQ0FBRDtBQUN6RCxhQUFPQSxFQUFFa0UsV0FBRixJQUFrQmxFLEVBQUVocEIsR0FBRixLQUFTLE9BQWxDO0FBRHdCLE1BQVQsRUFFYixNQUZhLENBQWhCO0FBR0FpdEIsaUJBQWFydUIsRUFBRXV1QixPQUFGLENBQVV2dUIsRUFBRTBTLEtBQUYsQ0FBUTBiLGFBQVIsRUFBdUIsYUFBdkIsQ0FBVixDQUFiO0FBRUFILGVBQVdqdUIsRUFBRXlQLEtBQUYsQ0FBUXVlLFVBQVIsRUFBb0JLLFVBQXBCLEVBQWdDLENBQUNOLFNBQUQsQ0FBaEMsQ0FBWDs7QUFDQSxRQUFHcHNCLFlBQUg7QUFFQ3FTLGVBQVNpYSxRQUFUO0FBRkQ7QUFJQ0wsb0JBQUEsRUFBQWx0QixPQUFBbkksUUFBQWdKLGFBQUEsZ0JBQUFNLE9BQUE7QUMyTUsvQixlQUFPMEIsT0QzTVo7QUM0TUsyRixjQUFNdkY7QUQ1TVgsU0M2TU07QUFDREUsZ0JBQVE7QUFDTnlxQixtQkFBUztBQURIO0FBRFAsT0Q3TU4sTUNpTlUsSURqTlYsR0NpTmlCN3JCLEtEak5tRzZyQixPQUFwSCxHQUFvSCxNQUFwSCxLQUErSCxNQUEvSDtBQUNBMkIseUJBQW1CL0MsTUFBTXBjLEdBQU4sQ0FBVSxVQUFDcWIsQ0FBRDtBQUM1QixlQUFPQSxFQUFFcHRCLElBQVQ7QUFEa0IsUUFBbkI7QUFFQW14QixjQUFRRixTQUFTdHJCLE1BQVQsQ0FBZ0IsVUFBQzZyQixJQUFEO0FBQ3ZCLFlBQUFDLFNBQUE7QUFBQUEsb0JBQVlELEtBQUtFLGVBQWpCOztBQUVBLFlBQUdELGFBQWFBLFVBQVV6c0IsT0FBVixDQUFrQjRyQixXQUFsQixJQUFpQyxDQUFDLENBQWxEO0FBQ0MsaUJBQU8sSUFBUDtBQ21OSTs7QURqTkwsZUFBTzV0QixFQUFFcXFCLFlBQUYsQ0FBZTZELGdCQUFmLEVBQWlDTyxTQUFqQyxFQUE0QzNyQixNQUFuRDtBQU5PLFFBQVI7QUFPQWtSLGVBQVNtYSxLQUFUO0FDb05FOztBRGxOSCxXQUFPbnVCLEVBQUV1RCxNQUFGLENBQVN5USxNQUFULEVBQWdCLE1BQWhCLENBQVA7QUFqQzBCLEdBQTNCOztBQW1DQWlWLDhCQUE0QixVQUFDMEYsa0JBQUQsRUFBcUJqdkIsV0FBckIsRUFBa0Mrc0IsaUJBQWxDO0FBRTNCLFFBQUd6c0IsRUFBRTR1QixNQUFGLENBQVNELGtCQUFULENBQUg7QUFDQyxhQUFPLElBQVA7QUNtTkU7O0FEbE5ILFFBQUczdUIsRUFBRVcsT0FBRixDQUFVZ3VCLGtCQUFWLENBQUg7QUFDQyxhQUFPM3VCLEVBQUUySyxJQUFGLENBQU9na0Isa0JBQVAsRUFBMkIsVUFBQzNtQixFQUFEO0FBQ2hDLGVBQU9BLEdBQUd0SSxXQUFILEtBQWtCQSxXQUF6QjtBQURLLFFBQVA7QUNzTkU7O0FEcE5ILFdBQU9uSCxRQUFRZ0osYUFBUixDQUFzQixvQkFBdEIsRUFBNENNLE9BQTVDLENBQW9EO0FBQUNuQyxtQkFBYUEsV0FBZDtBQUEyQitzQix5QkFBbUJBO0FBQTlDLEtBQXBELENBQVA7QUFQMkIsR0FBNUI7O0FBU0F2RCwyQkFBeUIsVUFBQ3lGLGtCQUFELEVBQXFCanZCLFdBQXJCLEVBQWtDbXZCLGtCQUFsQztBQUN4QixRQUFHN3VCLEVBQUU0dUIsTUFBRixDQUFTRCxrQkFBVCxDQUFIO0FBQ0MsYUFBTyxJQUFQO0FDeU5FOztBRHhOSCxRQUFHM3VCLEVBQUVXLE9BQUYsQ0FBVWd1QixrQkFBVixDQUFIO0FBQ0MsYUFBTzN1QixFQUFFMkMsTUFBRixDQUFTZ3NCLGtCQUFULEVBQTZCLFVBQUMzbUIsRUFBRDtBQUNuQyxlQUFPQSxHQUFHdEksV0FBSCxLQUFrQkEsV0FBekI7QUFETSxRQUFQO0FDNE5FOztBQUNELFdEM05GbkgsUUFBUWdKLGFBQVIsQ0FBc0Isb0JBQXRCLEVBQTRDb0osSUFBNUMsQ0FBaUQ7QUFBQ2pMLG1CQUFhQSxXQUFkO0FBQTJCK3NCLHlCQUFtQjtBQUFDbmlCLGFBQUt1a0I7QUFBTjtBQUE5QyxLQUFqRCxFQUEySGprQixLQUEzSCxFQzJORTtBRGpPc0IsR0FBekI7O0FBUUEyZSwyQkFBeUIsVUFBQ3VGLEdBQUQsRUFBTW53QixNQUFOLEVBQWN3c0IsS0FBZDtBQUV4QixRQUFBblgsTUFBQTtBQUFBQSxhQUFTLEVBQVQ7O0FBQ0FoVSxNQUFFMEMsSUFBRixDQUFPL0QsT0FBT3liLGNBQWQsRUFBOEIsVUFBQzJVLEdBQUQsRUFBTUMsT0FBTjtBQUc3QixVQUFBQyxXQUFBLEVBQUFDLE9BQUE7O0FBQUEsVUFBRyxDQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE9BQTVCLEVBQXFDbHRCLE9BQXJDLENBQTZDZ3RCLE9BQTdDLElBQXdELENBQTNEO0FBQ0NDLHNCQUFjOUQsTUFBTXhnQixJQUFOLENBQVcsVUFBQ2tqQixJQUFEO0FBQVMsaUJBQU9BLEtBQUs3d0IsSUFBTCxLQUFhZ3lCLE9BQXBCO0FBQXBCLFVBQWQ7O0FBQ0EsWUFBR0MsV0FBSDtBQUNDQyxvQkFBVWx2QixFQUFFQyxLQUFGLENBQVE4dUIsR0FBUixLQUFnQixFQUExQjtBQUNBRyxrQkFBUXpDLGlCQUFSLEdBQTRCd0MsWUFBWTd0QixHQUF4QztBQUNBOHRCLGtCQUFReHZCLFdBQVIsR0FBc0JmLE9BQU9lLFdBQTdCO0FDa09LLGlCRGpPTHNVLE9BQU9wTyxJQUFQLENBQVlzcEIsT0FBWixDQ2lPSztBRHZPUDtBQ3lPSTtBRDVPTDs7QUFVQSxRQUFHbGIsT0FBT2xSLE1BQVY7QUFDQ2dzQixVQUFJdGUsT0FBSixDQUFZLFVBQUN4SSxFQUFEO0FBQ1gsWUFBQW1uQixXQUFBLEVBQUFDLFFBQUE7QUFBQUQsc0JBQWMsQ0FBZDtBQUNBQyxtQkFBV3BiLE9BQU9ySixJQUFQLENBQVksVUFBQ3lHLElBQUQsRUFBT2hDLEtBQVA7QUFBZ0IrZix3QkFBYy9mLEtBQWQ7QUFBb0IsaUJBQU9nQyxLQUFLcWIsaUJBQUwsS0FBMEJ6a0IsR0FBR3lrQixpQkFBcEM7QUFBaEQsVUFBWDs7QUFFQSxZQUFHMkMsUUFBSDtBQ3dPTSxpQkR2T0xwYixPQUFPbWIsV0FBUCxJQUFzQm5uQixFQ3VPakI7QUR4T047QUMwT00saUJEdk9MZ00sT0FBT3BPLElBQVAsQ0FBWW9DLEVBQVosQ0N1T0s7QUFDRDtBRC9PTjtBQVFBLGFBQU9nTSxNQUFQO0FBVEQ7QUFXQyxhQUFPOGEsR0FBUDtBQzBPRTtBRGxRcUIsR0FBekI7O0FBMEJBdjJCLFVBQVFreEIsb0JBQVIsR0FBK0IsVUFBQ2pvQixPQUFELEVBQVVJLE1BQVYsRUFBa0JsQyxXQUFsQjtBQUM5QixRQUFBaUMsWUFBQSxFQUFBaEQsTUFBQSxFQUFBMHdCLFVBQUEsRUFBQUMsYUFBQSxFQUFBQyxVQUFBLEVBQUFDLFdBQUEsRUFBQUMsYUFBQSxFQUFBQyxTQUFBLEVBQUFsckIsV0FBQSxFQUFBc3FCLEdBQUEsRUFBQWEsUUFBQSxFQUFBQyxXQUFBLEVBQUFDLFFBQUEsRUFBQUMsU0FBQSxFQUFBQyxXQUFBLEVBQUFDLE9BQUEsRUFBQUMsSUFBQSxFQUFBOUUsS0FBQSxFQUFBQyxVQUFBLEVBQUFDLGNBQUEsRUFBQUcsZ0JBQUEsRUFBQUMsYUFBQSxFQUFBQyxpQkFBQSxFQUFBQyxVQUFBLEVBQUFDLGNBQUEsRUFBQUMsV0FBQSxFQUFBQyxlQUFBLEVBQUFDLGFBQUEsRUFBQUMsaUJBQUEsRUFBQUMsU0FBQSxFQUFBQyxhQUFBLEVBQUFDLE9BQUEsRUFBQUMsU0FBQTtBQUFBNW5CLGtCQUFjLEVBQWQ7QUFDQTdGLGFBQVNwRyxRQUFRZ0ksU0FBUixDQUFrQmIsV0FBbEIsRUFBK0I4QixPQUEvQixDQUFUOztBQUVBLFFBQUdBLFlBQVcsT0FBWCxJQUFzQjlCLGdCQUFlLE9BQXhDO0FBQ0M4RSxvQkFBY3hFLEVBQUVDLEtBQUYsQ0FBUXRCLE9BQU95YixjQUFQLENBQXNCOFYsS0FBOUIsS0FBd0MsRUFBdEQ7QUFDQTMzQixjQUFRd1Asa0JBQVIsQ0FBMkJ2RCxXQUEzQjtBQUNBLGFBQU9BLFdBQVA7QUMyT0U7O0FEMU9ING1CLGlCQUFnQnByQixFQUFFNHVCLE1BQUYsQ0FBUyxLQUFLeEQsVUFBZCxLQUE2QixLQUFLQSxVQUFsQyxHQUFrRCxLQUFLQSxVQUF2RCxHQUF1RTd5QixRQUFRZ0osYUFBUixDQUFzQixnQkFBdEIsRUFBd0NNLE9BQXhDLENBQWdEO0FBQUMvQixhQUFPMEIsT0FBUjtBQUFpQnhFLFlBQU07QUFBdkIsS0FBaEQsRUFBaUY7QUFBQzhFLGNBQU87QUFBQ1YsYUFBSTtBQUFMO0FBQVIsS0FBakYsQ0FBdkY7QUFDQTZxQixnQkFBZWpzQixFQUFFNHVCLE1BQUYsQ0FBUyxLQUFLM0MsU0FBZCxLQUE0QixLQUFLQSxTQUFqQyxHQUFnRCxLQUFLQSxTQUFyRCxHQUFvRTF6QixRQUFRZ0osYUFBUixDQUFzQixnQkFBdEIsRUFBd0NNLE9BQXhDLENBQWdEO0FBQUMvQixhQUFPMEIsT0FBUjtBQUFpQnhFLFlBQU07QUFBdkIsS0FBaEQsRUFBZ0Y7QUFBQzhFLGNBQU87QUFBQ1YsYUFBSTtBQUFMO0FBQVIsS0FBaEYsQ0FBbkY7QUFDQXlxQixrQkFBaUI3ckIsRUFBRTR1QixNQUFGLENBQVMsS0FBSy9DLFdBQWQsS0FBOEIsS0FBS0EsV0FBbkMsR0FBb0QsS0FBS0EsV0FBekQsR0FBMEV0ekIsUUFBUWdKLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDTSxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzBCLE9BQVI7QUFBaUJ4RSxZQUFNO0FBQXZCLEtBQWhELEVBQWtGO0FBQUM4RSxjQUFPO0FBQUNWLGFBQUk7QUFBTDtBQUFSLEtBQWxGLENBQTNGO0FBQ0F1cUIsaUJBQWdCM3JCLEVBQUU0dUIsTUFBRixDQUFTLEtBQUtqRCxVQUFkLEtBQTZCLEtBQUtBLFVBQWxDLEdBQWtELEtBQUtBLFVBQXZELEdBQXVFcHpCLFFBQVFnSixhQUFSLENBQXNCLGdCQUF0QixFQUF3Q00sT0FBeEMsQ0FBZ0Q7QUFBQy9CLGFBQU8wQixPQUFSO0FBQWlCeEUsWUFBTTtBQUF2QixLQUFoRCxFQUFpRjtBQUFDOEUsY0FBTztBQUFDVixhQUFJO0FBQUw7QUFBUixLQUFqRixDQUF2RjtBQUVBMnFCLG9CQUFtQi9yQixFQUFFNHVCLE1BQUYsQ0FBUyxLQUFLN0MsYUFBZCxLQUFnQyxLQUFLQSxhQUFyQyxHQUF3RCxLQUFLQSxhQUE3RCxHQUFnRnh6QixRQUFRZ0osYUFBUixDQUFzQixnQkFBdEIsRUFBd0NNLE9BQXhDLENBQWdEO0FBQUMvQixhQUFPMEIsT0FBUjtBQUFpQnhFLFlBQU07QUFBdkIsS0FBaEQsRUFBb0Y7QUFBQzhFLGNBQU87QUFBQ1YsYUFBSTtBQUFMO0FBQVIsS0FBcEYsQ0FBbkc7QUFDQXFxQixvQkFBbUJ6ckIsRUFBRTR1QixNQUFGLENBQVMsS0FBS25ELGFBQWQsS0FBZ0MsS0FBS0EsYUFBckMsR0FBd0QsS0FBS0EsYUFBN0QsR0FBZ0ZsekIsUUFBUWdKLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDTSxPQUF4QyxDQUFnRDtBQUFDL0IsYUFBTzBCLE9BQVI7QUFBaUJ4RSxZQUFNO0FBQXZCLEtBQWhELEVBQW9GO0FBQUM4RSxjQUFPO0FBQUNWLGFBQUk7QUFBTDtBQUFSLEtBQXBGLENBQW5HO0FBQ0ErcEIsWUFBUSxLQUFLRyxZQUFiOztBQUNBLFFBQUcsQ0FBQ0gsS0FBSjtBQUNDaUIsa0JBQVksSUFBWjs7QUFDQSxVQUFHeHFCLE1BQUg7QUFDQ3dxQixvQkFBWTd6QixRQUFRZ0osYUFBUixDQUFzQixhQUF0QixFQUFxQ00sT0FBckMsQ0FBNkM7QUFBRS9CLGlCQUFPMEIsT0FBVDtBQUFrQjJGLGdCQUFNdkY7QUFBeEIsU0FBN0MsRUFBK0U7QUFBRUUsa0JBQVE7QUFBRXlxQixxQkFBUztBQUFYO0FBQVYsU0FBL0UsQ0FBWjtBQzRSRzs7QUQzUkosVUFBR0gsYUFBYUEsVUFBVUcsT0FBMUI7QUFDQ3BCLGdCQUFRNXlCLFFBQVFnSixhQUFSLENBQXNCLGdCQUF0QixFQUF3Q29KLElBQXhDLENBQTZDO0FBQUM3SyxpQkFBTzBCLE9BQVI7QUFBaUI2SSxlQUFLLENBQUM7QUFBQ21pQixtQkFBTzVxQjtBQUFSLFdBQUQsRUFBa0I7QUFBQzVFLGtCQUFNb3ZCLFVBQVVHO0FBQWpCLFdBQWxCO0FBQXRCLFNBQTdDLEVBQWtIO0FBQUN6cUIsa0JBQU87QUFBQ1YsaUJBQUksQ0FBTDtBQUFRa3JCLDJCQUFjLENBQXRCO0FBQXlCdHZCLGtCQUFLO0FBQTlCO0FBQVIsU0FBbEgsRUFBNko0TixLQUE3SixFQUFSO0FBREQ7QUFHQ3VnQixnQkFBUTV5QixRQUFRZ0osYUFBUixDQUFzQixnQkFBdEIsRUFBd0NvSixJQUF4QyxDQUE2QztBQUFDNmhCLGlCQUFPNXFCLE1BQVI7QUFBZ0I5QixpQkFBTzBCO0FBQXZCLFNBQTdDLEVBQThFO0FBQUNNLGtCQUFPO0FBQUNWLGlCQUFJLENBQUw7QUFBUWtyQiwyQkFBYyxDQUF0QjtBQUF5QnR2QixrQkFBSztBQUE5QjtBQUFSLFNBQTlFLEVBQXlINE4sS0FBekgsRUFBUjtBQVBGO0FDNlRHOztBRHJUSGpKLG1CQUFrQjNCLEVBQUUwWixTQUFGLENBQVksS0FBSy9YLFlBQWpCLElBQW9DLEtBQUtBLFlBQXpDLEdBQTJEcEosUUFBUW9KLFlBQVIsQ0FBcUJILE9BQXJCLEVBQThCSSxNQUE5QixDQUE3RTtBQUVBeXBCLHFCQUFpQixLQUFLQSxjQUF0QjtBQUNBYSxvQkFBZ0IsS0FBS0EsYUFBckI7QUFDQUosc0JBQWtCLEtBQUtBLGVBQXZCO0FBQ0FGLHFCQUFpQixLQUFLQSxjQUF0QjtBQUVBSSx3QkFBb0IsS0FBS0EsaUJBQXpCO0FBQ0FOLHdCQUFvQixLQUFLQSxpQkFBekI7QUFFQUYsdUJBQW1CLEtBQUtBLGdCQUF4QjtBQUVBNkQsaUJBQWFydkIsRUFBRUMsS0FBRixDQUFRdEIsT0FBT3liLGNBQVAsQ0FBc0JtQyxLQUE5QixLQUF3QyxFQUFyRDtBQUNBbVQsZ0JBQVkxdkIsRUFBRUMsS0FBRixDQUFRdEIsT0FBT3liLGNBQVAsQ0FBc0JqVCxJQUE5QixLQUF1QyxFQUFuRDtBQUNBcW9CLGtCQUFjeHZCLEVBQUVDLEtBQUYsQ0FBUXRCLE9BQU95YixjQUFQLENBQXNCK1YsTUFBOUIsS0FBeUMsRUFBdkQ7QUFDQVosaUJBQWF2dkIsRUFBRUMsS0FBRixDQUFRdEIsT0FBT3liLGNBQVAsQ0FBc0I4VixLQUE5QixLQUF3QyxFQUFyRDtBQUVBVCxvQkFBZ0J6dkIsRUFBRUMsS0FBRixDQUFRdEIsT0FBT3liLGNBQVAsQ0FBc0JnVyxRQUE5QixLQUEyQyxFQUEzRDtBQUNBZCxvQkFBZ0J0dkIsRUFBRUMsS0FBRixDQUFRdEIsT0FBT3liLGNBQVAsQ0FBc0JpVyxRQUE5QixLQUEyQyxFQUEzRDs7QUFZQSxRQUFHakYsVUFBSDtBQUNDdUUsaUJBQVcxRywwQkFBMEJvQyxjQUExQixFQUEwQzNyQixXQUExQyxFQUF1RDByQixXQUFXaHFCLEdBQWxFLENBQVg7QUFDQTRuQiw0QkFBc0JxRyxVQUF0QixFQUFrQ00sUUFBbEM7QUN1U0U7O0FEdFNILFFBQUcxRCxTQUFIO0FBQ0MrRCxnQkFBVS9HLDBCQUEwQmlELGFBQTFCLEVBQXlDeHNCLFdBQXpDLEVBQXNEdXNCLFVBQVU3cUIsR0FBaEUsQ0FBVjtBQUNBNG5CLDRCQUFzQjBHLFNBQXRCLEVBQWlDTSxPQUFqQztBQ3dTRTs7QUR2U0gsUUFBR25FLFdBQUg7QUFDQ2lFLGtCQUFZN0csMEJBQTBCNkMsZUFBMUIsRUFBMkNwc0IsV0FBM0MsRUFBd0Rtc0IsWUFBWXpxQixHQUFwRSxDQUFaO0FBQ0E0bkIsNEJBQXNCd0csV0FBdEIsRUFBbUNNLFNBQW5DO0FDeVNFOztBRHhTSCxRQUFHbkUsVUFBSDtBQUNDa0UsaUJBQVc1RywwQkFBMEIyQyxjQUExQixFQUEwQ2xzQixXQUExQyxFQUF1RGlzQixXQUFXdnFCLEdBQWxFLENBQVg7QUFDQTRuQiw0QkFBc0J1RyxVQUF0QixFQUFrQ00sUUFBbEM7QUMwU0U7O0FEelNILFFBQUc5RCxhQUFIO0FBQ0NnRSxvQkFBYzlHLDBCQUEwQitDLGlCQUExQixFQUE2Q3RzQixXQUE3QyxFQUEwRHFzQixjQUFjM3FCLEdBQXhFLENBQWQ7QUFDQTRuQiw0QkFBc0J5RyxhQUF0QixFQUFxQ00sV0FBckM7QUMyU0U7O0FEMVNILFFBQUd0RSxhQUFIO0FBQ0NtRSxvQkFBYzNHLDBCQUEwQnlDLGlCQUExQixFQUE2Q2hzQixXQUE3QyxFQUEwRCtyQixjQUFjcnFCLEdBQXhFLENBQWQ7QUFDQTRuQiw0QkFBc0JzRyxhQUF0QixFQUFxQ00sV0FBckM7QUM0U0U7O0FEMVNILFFBQUcsQ0FBQ2h1QixNQUFKO0FBQ0M0QyxvQkFBYzZxQixVQUFkO0FBREQ7QUFHQyxVQUFHMXRCLFlBQUg7QUFDQzZDLHNCQUFjNnFCLFVBQWQ7QUFERDtBQUdDLFlBQUc3dEIsWUFBVyxRQUFkO0FBQ0NnRCx3QkFBY2tyQixTQUFkO0FBREQ7QUFHQ3RELHNCQUFlcHNCLEVBQUU0dUIsTUFBRixDQUFTLEtBQUt4QyxTQUFkLEtBQTRCLEtBQUtBLFNBQWpDLEdBQWdELEtBQUtBLFNBQXJELEdBQW9FN3pCLFFBQVFnSixhQUFSLENBQXNCLGFBQXRCLEVBQXFDTSxPQUFyQyxDQUE2QztBQUFFL0IsbUJBQU8wQixPQUFUO0FBQWtCMkYsa0JBQU12RjtBQUF4QixXQUE3QyxFQUErRTtBQUFFRSxvQkFBUTtBQUFFeXFCLHVCQUFTO0FBQVg7QUFBVixXQUEvRSxDQUFuRjs7QUFDQSxjQUFHSCxTQUFIO0FBQ0M2RCxtQkFBTzdELFVBQVVHLE9BQWpCOztBQUNBLGdCQUFHMEQsSUFBSDtBQUNDLGtCQUFHQSxTQUFRLE1BQVg7QUFDQ3pyQiw4QkFBY2tyQixTQUFkO0FBREQscUJBRUssSUFBR08sU0FBUSxRQUFYO0FBQ0p6ckIsOEJBQWNnckIsV0FBZDtBQURJLHFCQUVBLElBQUdTLFNBQVEsT0FBWDtBQUNKenJCLDhCQUFjK3FCLFVBQWQ7QUFESSxxQkFFQSxJQUFHVSxTQUFRLFVBQVg7QUFDSnpyQiw4QkFBY2lyQixhQUFkO0FBREkscUJBRUEsSUFBR1EsU0FBUSxVQUFYO0FBQ0p6ckIsOEJBQWM4cUIsYUFBZDtBQVZGO0FBQUE7QUFZQzlxQiw0QkFBY2tyQixTQUFkO0FBZEY7QUFBQTtBQWdCQ2xyQiwwQkFBYytxQixVQUFkO0FBcEJGO0FBSEQ7QUFIRDtBQ2tWRzs7QUR2VEgsUUFBR3BFLE1BQU1yb0IsTUFBTixHQUFlLENBQWxCO0FBQ0NxcEIsZ0JBQVVuc0IsRUFBRTBTLEtBQUYsQ0FBUXlZLEtBQVIsRUFBZSxLQUFmLENBQVY7QUFDQTJELFlBQU01Rix1QkFBdUJzQyxnQkFBdkIsRUFBeUM5ckIsV0FBekMsRUFBc0R5c0IsT0FBdEQsQ0FBTjtBQUNBMkMsWUFBTXZGLHVCQUF1QnVGLEdBQXZCLEVBQTRCbndCLE1BQTVCLEVBQW9Dd3NCLEtBQXBDLENBQU47O0FBQ0FuckIsUUFBRTBDLElBQUYsQ0FBT29zQixHQUFQLEVBQVksVUFBQzltQixFQUFEO0FBQ1gsWUFBR0EsR0FBR3lrQixpQkFBSCxNQUFBckIsY0FBQSxPQUF3QkEsV0FBWWhxQixHQUFwQyxHQUFvQyxNQUFwQyxLQUNINEcsR0FBR3lrQixpQkFBSCxNQUFBUixhQUFBLE9BQXdCQSxVQUFXN3FCLEdBQW5DLEdBQW1DLE1BQW5DLENBREcsSUFFSDRHLEdBQUd5a0IsaUJBQUgsTUFBQVosZUFBQSxPQUF3QkEsWUFBYXpxQixHQUFyQyxHQUFxQyxNQUFyQyxDQUZHLElBR0g0RyxHQUFHeWtCLGlCQUFILE1BQUFkLGNBQUEsT0FBd0JBLFdBQVl2cUIsR0FBcEMsR0FBb0MsTUFBcEMsQ0FIRyxJQUlINEcsR0FBR3lrQixpQkFBSCxNQUFBVixpQkFBQSxPQUF3QkEsY0FBZTNxQixHQUF2QyxHQUF1QyxNQUF2QyxDQUpHLElBS0g0RyxHQUFHeWtCLGlCQUFILE1BQUFoQixpQkFBQSxPQUF3QkEsY0FBZXJxQixHQUF2QyxHQUF1QyxNQUF2QyxDQUxBO0FBT0M7QUNtVEk7O0FEbFRMLFlBQUdwQixFQUFFNEUsT0FBRixDQUFVSixXQUFWLENBQUg7QUFDQ0Esd0JBQWN3RCxFQUFkO0FDb1RJOztBRG5UTHFoQiwwQ0FBa0M3a0IsV0FBbEMsRUFBK0N3RCxFQUEvQztBQUVBeEQsb0JBQVl3VixtQkFBWixHQUFrQ21QLGlCQUFpQjNrQixZQUFZd1YsbUJBQTdCLEVBQWtEaFMsR0FBR2dTLG1CQUFyRCxDQUFsQztBQUNBeFYsb0JBQVk4ckIsZ0JBQVosR0FBK0JuSCxpQkFBaUIza0IsWUFBWThyQixnQkFBN0IsRUFBK0N0b0IsR0FBR3NvQixnQkFBbEQsQ0FBL0I7QUFDQTlyQixvQkFBWStyQixpQkFBWixHQUFnQ3BILGlCQUFpQjNrQixZQUFZK3JCLGlCQUE3QixFQUFnRHZvQixHQUFHdW9CLGlCQUFuRCxDQUFoQztBQUNBL3JCLG9CQUFZZ3NCLGlCQUFaLEdBQWdDckgsaUJBQWlCM2tCLFlBQVlnc0IsaUJBQTdCLEVBQWdEeG9CLEdBQUd3b0IsaUJBQW5ELENBQWhDO0FBQ0Foc0Isb0JBQVkwTSxpQkFBWixHQUFnQ2lZLGlCQUFpQjNrQixZQUFZME0saUJBQTdCLEVBQWdEbEosR0FBR2tKLGlCQUFuRCxDQUFoQztBQ29USSxlRG5USjFNLFlBQVlzbUIsdUJBQVosR0FBc0MzQixpQkFBaUIza0IsWUFBWXNtQix1QkFBN0IsRUFBc0Q5aUIsR0FBRzhpQix1QkFBekQsQ0NtVGxDO0FEclVMO0FDdVVFOztBRG5USCxRQUFHbnNCLE9BQU80YixPQUFWO0FBQ0MvVixrQkFBWXlELFdBQVosR0FBMEIsS0FBMUI7QUFDQXpELGtCQUFZMkQsU0FBWixHQUF3QixLQUF4QjtBQUNBM0Qsa0JBQVk0RCxXQUFaLEdBQTBCLEtBQTFCO0FBQ0E1RCxrQkFBWWtCLGdCQUFaLEdBQStCLEtBQS9CO0FBQ0FsQixrQkFBWStELG9CQUFaLEdBQW1DLEtBQW5DO0FBQ0EvRCxrQkFBWThyQixnQkFBWixHQUErQixFQUEvQjtBQ3FURTs7QURwVEgvM0IsWUFBUXdQLGtCQUFSLENBQTJCdkQsV0FBM0I7O0FBRUEsUUFBRzdGLE9BQU95YixjQUFQLENBQXNCOFAsS0FBekI7QUFDQzFsQixrQkFBWTBsQixLQUFaLEdBQW9CdnJCLE9BQU95YixjQUFQLENBQXNCOFAsS0FBMUM7QUNxVEU7O0FEcFRILFdBQU8xbEIsV0FBUDtBQXZJOEIsR0FBL0I7O0FBMktBdEssU0FBT29QLE9BQVAsQ0FFQztBQUFBLGtDQUE4QixVQUFDOUgsT0FBRDtBQUM3QixhQUFPakosUUFBUTB5QixpQkFBUixDQUEwQnpwQixPQUExQixFQUFtQyxLQUFLSSxNQUF4QyxDQUFQO0FBREQ7QUFBQSxHQUZEO0FDd1JBLEM7Ozs7Ozs7Ozs7OztBQzMyQkQsSUFBQWxJLFdBQUE7QUFBQUEsY0FBY0ksUUFBUSxlQUFSLENBQWQ7QUFFQUksT0FBT0MsT0FBUCxDQUFlO0FBQ2QsTUFBQXMyQixjQUFBLEVBQUFDLFNBQUE7QUFBQUQsbUJBQWlCOTJCLFFBQVFDLEdBQVIsQ0FBWSsyQixpQkFBN0I7QUFDQUQsY0FBWS8yQixRQUFRQyxHQUFSLENBQVlnM0IsdUJBQXhCOztBQUNBLE1BQUdILGNBQUg7QUFDQyxRQUFHLENBQUNDLFNBQUo7QUFDQyxZQUFNLElBQUl4MkIsT0FBT3lNLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsaUVBQXRCLENBQU47QUNHRTs7QUFDRCxXREhGcE8sUUFBUXM0QixtQkFBUixHQUE4QjtBQUFDQyxlQUFTLElBQUlDLGVBQWVDLHNCQUFuQixDQUEwQ1AsY0FBMUMsRUFBMEQ7QUFBQ1Esa0JBQVVQO0FBQVgsT0FBMUQ7QUFBVixLQ0c1QjtBQUtEO0FEZEg7O0FBUUFuNEIsUUFBUXdILGlCQUFSLEdBQTRCLFVBQUNwQixNQUFEO0FBSzNCLFNBQU9BLE9BQU8zQixJQUFkO0FBTDJCLENBQTVCOztBQU1BekUsUUFBUW9rQixnQkFBUixHQUEyQixVQUFDaGUsTUFBRDtBQUMxQixNQUFBdXlCLGNBQUE7QUFBQUEsbUJBQWlCMzRCLFFBQVF3SCxpQkFBUixDQUEwQnBCLE1BQTFCLENBQWpCOztBQUNBLE1BQUdyRyxHQUFHNDRCLGNBQUgsQ0FBSDtBQUNDLFdBQU81NEIsR0FBRzQ0QixjQUFILENBQVA7QUFERCxTQUVLLElBQUd2eUIsT0FBT3JHLEVBQVY7QUFDSixXQUFPcUcsT0FBT3JHLEVBQWQ7QUNTQzs7QURQRixNQUFHQyxRQUFRRSxXQUFSLENBQW9CeTRCLGNBQXBCLENBQUg7QUFDQyxXQUFPMzRCLFFBQVFFLFdBQVIsQ0FBb0J5NEIsY0FBcEIsQ0FBUDtBQUREO0FBR0MsUUFBR3Z5QixPQUFPb2MsTUFBVjtBQUNDLGFBQU9yaEIsWUFBWXkzQixhQUFaLENBQTBCRCxjQUExQixFQUEwQzM0QixRQUFRczRCLG1CQUFsRCxDQUFQO0FBREQ7QUFHQyxVQUFHSyxtQkFBa0IsWUFBbEIsWUFBQUUsUUFBQSxvQkFBQUEsYUFBQSxPQUFrQ0EsU0FBVTduQixVQUE1QyxHQUE0QyxNQUE1QyxDQUFIO0FBQ0MsZUFBTzZuQixTQUFTN25CLFVBQWhCO0FDU0c7O0FEUkosYUFBTzdQLFlBQVl5M0IsYUFBWixDQUEwQkQsY0FBMUIsQ0FBUDtBQVJGO0FDbUJFO0FEMUJ3QixDQUEzQixDOzs7Ozs7Ozs7Ozs7QUVqQkEsSUFBQUcsYUFBQSxFQUFBQyxjQUFBOztBQUFBLzRCLFFBQVEyZSxhQUFSLEdBQXdCLEVBQXhCOztBQUVBLElBQUdoZCxPQUFPMEcsUUFBVjtBQUNDMHdCLG1CQUFpQngzQixRQUFRLGtCQUFSLENBQWpCOztBQUVBdkIsVUFBUXNaLE9BQVIsR0FBa0IsVUFBQ0EsT0FBRDtBQ0VmLFdEREY3UixFQUFFMEMsSUFBRixDQUFPbVAsT0FBUCxFQUFnQixVQUFDNkUsSUFBRCxFQUFPNmEsV0FBUDtBQ0VaLGFEREhoNUIsUUFBUTJlLGFBQVIsQ0FBc0JxYSxXQUF0QixJQUFxQzdhLElDQ2xDO0FERkosTUNDRTtBREZlLEdBQWxCOztBQUlBbmUsVUFBUWk1QixhQUFSLEdBQXdCLFVBQUM5eEIsV0FBRCxFQUFja0QsTUFBZCxFQUFzQmtKLFNBQXRCLEVBQWlDMmxCLFlBQWpDLEVBQStDNWlCLFlBQS9DLEVBQTZEaEUsTUFBN0QsRUFBcUU2bUIsUUFBckU7QUFDdkIsUUFBQWx2QixPQUFBLEVBQUFtdkIsUUFBQSxFQUFBbHlCLEdBQUEsRUFBQWlYLElBQUEsRUFBQWtiLFFBQUEsRUFBQXRxQixHQUFBOztBQUFBLFFBQUcxRSxVQUFVQSxPQUFPcEcsSUFBUCxLQUFlLFlBQTVCO0FBQ0MsVUFBR3NQLFNBQUg7QUFDQ3RKLGtCQUFVLENBQUMsS0FBRCxFQUFRLEdBQVIsRUFBYXNKLFNBQWIsQ0FBVjtBQUREO0FBR0N0SixrQkFBVXF2QixXQUFXQyxVQUFYLENBQXNCcHlCLFdBQXRCLEVBQW1DbVAsWUFBbkMsRUFBaUQsS0FBakQsRUFBd0QsSUFBeEQsRUFBOEQsSUFBOUQsQ0FBVjtBQ0lHOztBREhKdkgsWUFBTSw0QkFBNEIxRSxPQUFPbXZCLGFBQW5DLEdBQW1ELFFBQW5ELEdBQThELFdBQTlELEdBQTRFVCxlQUFlVSx5QkFBZixDQUF5Q3h2QixPQUF6QyxDQUFsRjtBQUNBOEUsWUFBTW5ELFFBQVE4dEIsV0FBUixDQUFvQjNxQixHQUFwQixDQUFOO0FBQ0EsYUFBTzRxQixPQUFPQyxJQUFQLENBQVk3cUIsR0FBWixDQUFQO0FDS0U7O0FESEg3SCxVQUFNbEgsUUFBUWdJLFNBQVIsQ0FBa0JiLFdBQWxCLENBQU47O0FBQ0EsUUFBQWtELFVBQUEsT0FBR0EsT0FBUThULElBQVgsR0FBVyxNQUFYO0FBQ0MsVUFBRyxPQUFPOVQsT0FBTzhULElBQWQsS0FBc0IsUUFBekI7QUFDQ0EsZUFBT25lLFFBQVEyZSxhQUFSLENBQXNCdFUsT0FBTzhULElBQTdCLENBQVA7QUFERCxhQUVLLElBQUcsT0FBTzlULE9BQU84VCxJQUFkLEtBQXNCLFVBQXpCO0FBQ0pBLGVBQU85VCxPQUFPOFQsSUFBZDtBQ0tHOztBREpKLFVBQUcsQ0FBQzdMLE1BQUQsSUFBV25MLFdBQVgsSUFBMEJvTSxTQUE3QjtBQUNDakIsaUJBQVN0UyxRQUFRNjVCLEtBQVIsQ0FBY3J4QixHQUFkLENBQWtCckIsV0FBbEIsRUFBK0JvTSxTQUEvQixDQUFUO0FDTUc7O0FETEosVUFBRzRLLElBQUg7QUFFQythLHVCQUFrQkEsZUFBa0JBLFlBQWxCLEdBQW9DLEVBQXREO0FBQ0FFLG1CQUFXN1EsTUFBTXVSLFNBQU4sQ0FBZ0JDLEtBQWhCLENBQXNCaGQsSUFBdEIsQ0FBMkJnVCxTQUEzQixFQUFzQyxDQUF0QyxDQUFYO0FBQ0FzSixtQkFBVyxDQUFDbHlCLFdBQUQsRUFBY29NLFNBQWQsRUFBeUJ5bUIsTUFBekIsQ0FBZ0NaLFFBQWhDLENBQVg7QUNNSSxlRExKamIsS0FBSzJSLEtBQUwsQ0FBVztBQUNWM29CLHVCQUFhQSxXQURIO0FBRVZvTSxxQkFBV0EsU0FGRDtBQUdWbk4sa0JBQVFjLEdBSEU7QUFJVm1ELGtCQUFRQSxNQUpFO0FBS1Y2dUIsd0JBQWNBLFlBTEo7QUFNVjVtQixrQkFBUUE7QUFORSxTQUFYLEVBT0crbUIsUUFQSCxDQ0tJO0FEVkw7QUNtQkssZURMSmpZLE9BQU82WSxPQUFQLENBQWU1TCxFQUFFLDJCQUFGLENBQWYsQ0NLSTtBRDFCTjtBQUFBO0FDNkJJLGFETkhqTixPQUFPNlksT0FBUCxDQUFlNUwsRUFBRSwyQkFBRixDQUFmLENDTUc7QUFDRDtBRHpDb0IsR0FBeEI7O0FBcUNBeUssa0JBQWdCLFVBQUMzeEIsV0FBRCxFQUFjb00sU0FBZCxFQUF5QjJtQixZQUF6QixFQUF1QzVqQixZQUF2QyxFQUFxRGhFLE1BQXJELEVBQTZENm5CLFNBQTdELEVBQXdFQyxlQUF4RTtBQUVmLFFBQUFoMEIsTUFBQSxFQUFBaTBCLFdBQUE7QUFBQWowQixhQUFTcEcsUUFBUWdJLFNBQVIsQ0FBa0JiLFdBQWxCLENBQVQ7QUFDQWt6QixrQkFBY0MsWUFBWUMsY0FBWixDQUEyQnB6QixXQUEzQixFQUF3Q29NLFNBQXhDLEVBQW1ELFFBQW5ELENBQWQ7QUNPRSxXRE5GdlQsUUFBUTY1QixLQUFSLENBQWEsUUFBYixFQUFxQjF5QixXQUFyQixFQUFrQ29NLFNBQWxDLEVBQTZDO0FBQzVDLFVBQUFpbkIsSUFBQTs7QUFBQSxVQUFHTixZQUFIO0FBRUNNLGVBQU1uTSxFQUFFLHNDQUFGLEVBQTBDam9CLE9BQU9tTSxLQUFQLElBQWUsT0FBSzJuQixZQUFMLEdBQWtCLElBQWpDLENBQTFDLENBQU47QUFGRDtBQUlDTSxlQUFPbk0sRUFBRSxnQ0FBRixDQUFQO0FDT0c7O0FETkpqTixhQUFPcVosT0FBUCxDQUFlRCxJQUFmOztBQUNBLFVBQUdMLGFBQWMsT0FBT0EsU0FBUCxLQUFvQixVQUFyQztBQUNDQTtBQ1FHOztBQUNELGFEUEhHLFlBQVlJLE9BQVosQ0FBb0J2ekIsV0FBcEIsRUFBaUMsUUFBakMsRUFBMkMsT0FBM0MsRUFBb0Q7QUFBQzBCLGFBQUswSyxTQUFOO0FBQWlCOG1CLHFCQUFhQTtBQUE5QixPQUFwRCxDQ09HO0FEakJKLE9BV0UsVUFBQ3gwQixLQUFEO0FBQ0QsVUFBR3UwQixtQkFBb0IsT0FBT0EsZUFBUCxLQUEwQixVQUFqRDtBQUNDQTtBQ1dHOztBQUNELGFEWEhFLFlBQVlJLE9BQVosQ0FBb0J2ekIsV0FBcEIsRUFBaUMsUUFBakMsRUFBMkMsT0FBM0MsRUFBb0Q7QUFBQzBCLGFBQUswSyxTQUFOO0FBQWlCMU4sZUFBT0E7QUFBeEIsT0FBcEQsQ0NXRztBRHpCSixNQ01FO0FEVmEsR0FBaEI7O0FBb0JBN0YsVUFBUTI2Qix3QkFBUixHQUFtQyxVQUFDanVCLG1CQUFEO0FBQ2xDLFFBQUFzRSxVQUFBLEVBQUE0cEIsZUFBQSxFQUFBQyxtQkFBQSxFQUFBQyxpQkFBQSxFQUFBQyxVQUFBLEVBQUE5dkIsR0FBQSxFQUFBTixHQUFBLEVBQUFxd0IsYUFBQSxFQUFBem5CLFNBQUEsRUFBQTBuQixZQUFBO0FBQUFBLG1CQUFlajdCLFFBQVFnSSxTQUFSLENBQWtCMEUsbUJBQWxCLENBQWY7QUFDQWt1QixzQkFBa0JLLGFBQWExb0IsS0FBL0I7QUFDQXZCLGlCQUFhLHlCQUF1QmhSLFFBQVFnSSxTQUFSLENBQWtCMEUsbUJBQWxCLEVBQXVDeEQsZ0JBQTNFO0FBQ0EyeEIsMEJBQXNCdHlCLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQXRCO0FBQ0FzeUIsd0JBQW9CdnlCLFFBQVFDLEdBQVIsQ0FBWSxXQUFaLENBQXBCO0FBQ0FtQyxVQUFNM0ssUUFBUW9YLGtCQUFSLENBQTJCMUssbUJBQTNCLENBQU47QUFDQXN1QixvQkFBZ0IsRUFBaEI7O0FBQ0EsUUFBQXJ3QixPQUFBLE9BQUdBLElBQUtKLE1BQVIsR0FBUSxNQUFSO0FBR0NnSixrQkFBWTVJLElBQUksQ0FBSixDQUFaO0FBQ0FNLFlBQU1qTCxRQUFRNjVCLEtBQVIsQ0FBY3J4QixHQUFkLENBQWtCa0UsbUJBQWxCLEVBQXVDNkcsU0FBdkMsQ0FBTjtBQUNBeW5CLHNCQUFnQi92QixHQUFoQjtBQUVBMUMsY0FBUTJ5QixHQUFSLENBQVksdUJBQVosRUFBcUMsSUFBckM7QUFQRDtBQVNDSCxtQkFBYVQsWUFBWWEsdUJBQVosQ0FBb0NOLG1CQUFwQyxFQUF5REMsaUJBQXpELEVBQTRFcHVCLG1CQUE1RSxDQUFiOztBQUNBLFVBQUcsQ0FBQ2pGLEVBQUU0RSxPQUFGLENBQVUwdUIsVUFBVixDQUFKO0FBQ0NDLHdCQUFnQkQsVUFBaEI7QUFYRjtBQzBCRzs7QURkSCxTQUFBRSxnQkFBQSxPQUFHQSxhQUFjaFosT0FBakIsR0FBaUIsTUFBakIsS0FBNEIsQ0FBNUI7QUFDQyxhQUFPbVosVUFBVUMsU0FBVixDQUFvQkMsT0FBT0MsaUJBQVAsQ0FBeUJDLFVBQXpCLENBQW9DQyxVQUF4RCxFQUFvRTtBQUMxRWgzQixjQUFTaUksc0JBQW9CLG9CQUQ2QztBQUUxRWd2Qix1QkFBZWh2QixtQkFGMkQ7QUFHMUVpdkIsZUFBTyxRQUFRVixhQUFhMW9CLEtBSDhDO0FBSTFFeW9CLHVCQUFlQSxhQUoyRDtBQUsxRVkscUJBQWEsVUFBQ25nQixNQUFEO0FBQ1pvZ0IscUJBQVc7QUFFVixnQkFBRzc3QixRQUFRZ0ksU0FBUixDQUFrQjZ5QixtQkFBbEIsRUFBdUM1WSxPQUF2QyxHQUFpRCxDQUFwRDtBQUNDbVosd0JBQVVVLFlBQVYsQ0FBdUJqQixtQkFBdkIsRUFBNENDLGlCQUE1QztBQ2VNOztBQUNELG1CRGZOaUIsV0FBV0MsTUFBWCxFQ2VNO0FEbkJQLGFBS0UsQ0FMRjtBQU1BLGlCQUFPLElBQVA7QUFaeUU7QUFBQSxPQUFwRSxFQWFKLElBYkksRUFhRTtBQUFDQyxrQkFBVTtBQUFYLE9BYkYsQ0FBUDtBQ2dDRTs7QURoQkgsUUFBQXR4QixPQUFBLE9BQUdBLElBQUtKLE1BQVIsR0FBUSxNQUFSO0FBR0NoQyxjQUFRMnlCLEdBQVIsQ0FBWSxPQUFaLEVBQXFCRixhQUFyQjtBQUVBenlCLGNBQVEyeUIsR0FBUixDQUFZLHVCQUFaLEVBQXFDLElBQXJDO0FBTEQ7QUFPQyxVQUFHLENBQUN6ekIsRUFBRTRFLE9BQUYsQ0FBVTJ1QixhQUFWLENBQUo7QUFDQ3p5QixnQkFBUTJ5QixHQUFSLENBQVksT0FBWixFQUFxQkYsYUFBckI7QUFSRjtBQ3dCRzs7QURkSHp5QixZQUFRMnlCLEdBQVIsQ0FBWSxlQUFaLEVBQTZCLE1BQTdCO0FBQ0EzeUIsWUFBUTJ5QixHQUFSLENBQVksbUJBQVosRUFBaUNscUIsVUFBakM7QUFDQXpJLFlBQVEyeUIsR0FBUixDQUFZLHdCQUFaLEVBQXNDTixlQUF0QztBQUNBcnlCLFlBQVEyeUIsR0FBUixDQUFZLHdCQUFaLEVBQXNDLEtBQXRDO0FBQ0F2NUIsV0FBT3U2QixLQUFQLENBQWE7QUNnQlQsYURmSEMsRUFBRSxzQkFBRixFQUEwQkMsS0FBMUIsRUNlRztBRGhCSjtBQW5Ea0MsR0FBbkM7O0FBdURBcDhCLFVBQVFzWixPQUFSLENBRUM7QUFBQSxzQkFBa0I7QUNlZCxhRGRId04sTUFBTUMsSUFBTixDQUFXLHNCQUFYLENDY0c7QURmSjtBQUdBLG9CQUFnQixVQUFDNWYsV0FBRCxFQUFjb00sU0FBZCxFQUF5QmhLLE1BQXpCO0FBTWYsVUFBQTh5QixRQUFBLEVBQUFyQixhQUFBLEVBQUFzQixTQUFBLEVBQUFDLGNBQUEsRUFBQW4yQixNQUFBLEVBQUE4QixHQUFBLEVBQUFDLElBQUEsRUFBQXNMLElBQUEsRUFBQUMsSUFBQSxFQUFBQyxJQUFBLEVBQUFpYyxJQUFBLEVBQUE0TSxnQkFBQSxFQUFBQyxZQUFBO0FBQUFyMkIsZUFBU3BHLFFBQVFnSSxTQUFSLENBQWtCYixXQUFsQixDQUFUO0FBQ0FrMUIsaUJBQVcsS0FBS2h5QixNQUFMLENBQVlneUIsUUFBdkI7QUFDQUMsa0JBQVksS0FBS2p5QixNQUFMLENBQVlpeUIsU0FBeEI7O0FBQ0EsVUFBR0EsU0FBSDtBQUNDRSwyQkFBbUIsS0FBS255QixNQUFMLENBQVlteUIsZ0JBQS9CO0FBQ0FELHlCQUFpQixLQUFLbHlCLE1BQUwsQ0FBWWt5QixjQUE3QjtBQUNBdkIsd0JBQWdCLEtBQUszd0IsTUFBTCxDQUFZMndCLGFBQTVCOztBQUNBLFlBQUcsQ0FBQ0EsYUFBSjtBQUNDQSwwQkFBZ0IsRUFBaEI7QUFDQUEsd0JBQWN3QixnQkFBZCxJQUFrQ0QsY0FBbEM7QUFORjtBQUFBO0FBUUN2Qix3QkFBYyxFQUFkOztBQUNBLFlBQUdxQixRQUFIO0FBQ0NJLHlCQUFBLENBQUF2MEIsTUFBQXl4QixPQUFBK0MsUUFBQSxhQUFBdjBCLE9BQUFELElBQUFtMEIsUUFBQSxFQUFBTSxPQUFBLGFBQUFscEIsT0FBQXRMLEtBQUF5MEIsR0FBQSxZQUFBbnBCLEtBQXdEb3BCLGVBQXhELEtBQWUsTUFBZixHQUFlLE1BQWYsR0FBZSxNQUFmO0FBREQ7QUFHQ0oseUJBQUEsQ0FBQS9vQixPQUFBaW1CLE9BQUFtRCxPQUFBLGFBQUFucEIsT0FBQUQsS0FBQWlwQixPQUFBLGFBQUEvTSxPQUFBamMsS0FBQWlwQixHQUFBLFlBQUFoTixLQUE2Q2lOLGVBQTdDLEtBQWUsTUFBZixHQUFlLE1BQWYsR0FBZSxNQUFmO0FDWUk7O0FEVkwsWUFBQUosZ0JBQUEsT0FBR0EsYUFBY2x5QixNQUFqQixHQUFpQixNQUFqQjtBQUNDZ0osc0JBQVlrcEIsYUFBYSxDQUFiLEVBQWdCNXpCLEdBQTVCOztBQUNBLGNBQUcwSyxTQUFIO0FBQ0N5bkIsNEJBQWdCaDdCLFFBQVE2NUIsS0FBUixDQUFjcnhCLEdBQWQsQ0FBa0JyQixXQUFsQixFQUErQm9NLFNBQS9CLENBQWhCO0FBSEY7QUFBQTtBQU1DeW5CLDBCQUFnQlYsWUFBWXlDLGdCQUFaLENBQTZCNTFCLFdBQTdCLENBQWhCO0FBcEJGO0FDaUNJOztBRFhKLFdBQUFmLFVBQUEsT0FBR0EsT0FBUTZiLE9BQVgsR0FBVyxNQUFYLEtBQXNCLENBQXRCO0FBQ0MsZUFBT3JXLFFBQVFveEIsSUFBUixDQUFhQyxJQUFiLENBQWtCQyxXQUFsQixDQUE4QkMsTUFBOUIsQ0FBcUM1MEIsUUFBUUMsR0FBUixDQUFZLFFBQVosQ0FBckMsRUFBNERyQixXQUE1RCxFQUF5RSxRQUFRZixPQUFPbU0sS0FBeEYsRUFBK0Z5b0IsYUFBL0YsRUFBK0c7QUFBQ3FCLG9CQUFVQTtBQUFYLFNBQS9HLENBQVA7QUNlRzs7QURkSjl6QixjQUFRMnlCLEdBQVIsQ0FBWSxvQkFBWixFQUFrQy96QixXQUFsQzs7QUFDQSxVQUFBczFCLGdCQUFBLE9BQUdBLGFBQWNseUIsTUFBakIsR0FBaUIsTUFBakI7QUFHQ2hDLGdCQUFRMnlCLEdBQVIsQ0FBWSxPQUFaLEVBQXFCRixhQUFyQjtBQUVBenlCLGdCQUFRMnlCLEdBQVIsQ0FBWSx1QkFBWixFQUFxQyxJQUFyQztBQUxEO0FBT0MzeUIsZ0JBQVEyeUIsR0FBUixDQUFZLE9BQVosRUFBcUJGLGFBQXJCO0FDYUc7O0FEWkpyNUIsYUFBT3U2QixLQUFQLENBQWE7QUNjUixlRGJKQyxFQUFFLGNBQUYsRUFBa0JDLEtBQWxCLEVDYUk7QURkTDtBQTdDRDtBQWlEQSwwQkFBc0IsVUFBQ2oxQixXQUFELEVBQWNvTSxTQUFkLEVBQXlCaEssTUFBekI7QUFDckIsVUFBQTZ6QixJQUFBO0FBQUFBLGFBQU9wOUIsUUFBUXE5QixZQUFSLENBQXFCbDJCLFdBQXJCLEVBQWtDb00sU0FBbEMsQ0FBUDtBQUNBd29CLGlCQUFXdUIsUUFBWCxDQUFvQkYsSUFBcEI7QUFDQSxhQUFPLEtBQVA7QUFwREQ7QUFzREEscUJBQWlCLFVBQUNqMkIsV0FBRCxFQUFjb00sU0FBZCxFQUF5QmhLLE1BQXpCO0FBQ2hCLFVBQUFuRCxNQUFBOztBQUFBLFVBQUdtTixTQUFIO0FBQ0NuTixpQkFBU3BHLFFBQVFnSSxTQUFSLENBQWtCYixXQUFsQixDQUFUOztBQUNBLGFBQUFmLFVBQUEsT0FBR0EsT0FBUTZiLE9BQVgsR0FBVyxNQUFYLEtBQXNCLENBQXRCO0FBQ0MsaUJBQU9yVyxRQUFRb3hCLElBQVIsQ0FBYUMsSUFBYixDQUFrQk0sWUFBbEIsQ0FBK0JKLE1BQS9CLENBQXNDNTBCLFFBQVFDLEdBQVIsQ0FBWSxRQUFaLENBQXRDLEVBQTZEckIsV0FBN0QsRUFBMEUsUUFBUWYsT0FBT21NLEtBQXpGLEVBQWdHZ0IsU0FBaEcsRUFBMkc7QUFDakg4b0Isc0JBQVUsS0FBS2h5QixNQUFMLENBQVlneUI7QUFEMkYsV0FBM0csQ0FBUDtBQ2tCSTs7QURmTCxZQUFHendCLFFBQVE4WixRQUFSLE1BQXNCLEtBQXpCO0FBSUNuZCxrQkFBUTJ5QixHQUFSLENBQVksb0JBQVosRUFBa0MvekIsV0FBbEM7QUFDQW9CLGtCQUFRMnlCLEdBQVIsQ0FBWSxrQkFBWixFQUFnQzNuQixTQUFoQzs7QUFDQSxjQUFHLEtBQUtqQixNQUFSO0FBQ0MvSixvQkFBUTJ5QixHQUFSLENBQVksT0FBWixFQUFxQixLQUFLNW9CLE1BQTFCO0FDY0s7O0FBQ0QsaUJEZEwzUSxPQUFPdTZCLEtBQVAsQ0FBYTtBQ2VOLG1CRGROQyxFQUFFLGtCQUFGLEVBQXNCQyxLQUF0QixFQ2NNO0FEZlAsWUNjSztBRHRCTjtBQVdDN3pCLGtCQUFRMnlCLEdBQVIsQ0FBWSxvQkFBWixFQUFrQy96QixXQUFsQztBQUNBb0Isa0JBQVEyeUIsR0FBUixDQUFZLGtCQUFaLEVBQWdDM25CLFNBQWhDOztBQUNBLGNBQUcsS0FBS2pCLE1BQVI7QUFDQy9KLG9CQUFRMnlCLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLEtBQUs1b0IsTUFBMUI7QUNnQk0sbUJEZk4zUSxPQUFPdTZCLEtBQVAsQ0FBYTtBQ2dCTCxxQkRmUEMsRUFBRSxtQkFBRixFQUF1QkMsS0FBdkIsRUNlTztBRGhCUixjQ2VNO0FEOUJSO0FBTkQ7QUN5Q0k7QURoR0w7QUErRUEsdUJBQW1CLFVBQUNqMUIsV0FBRCxFQUFjb00sU0FBZCxFQUF5QjJtQixZQUF6QixFQUF1QzVqQixZQUF2QyxFQUFxRGhFLE1BQXJELEVBQTZENm5CLFNBQTdEO0FBQ2xCLFVBQUFxRCxVQUFBLEVBQUFuQixRQUFBLEVBQUFvQixXQUFBLEVBQUFDLFlBQUEsRUFBQUMsU0FBQSxFQUFBdjNCLE1BQUEsRUFBQXczQixlQUFBLEVBQUFDLElBQUE7QUFBQXhCLGlCQUFXLEtBQUtoeUIsTUFBTCxDQUFZZ3lCLFFBQXZCOztBQUVBLFVBQUc5b0IsU0FBSDtBQUNDaXFCLHFCQUFhbEQsWUFBWUksT0FBWixDQUFvQnZ6QixXQUFwQixFQUFpQyxRQUFqQyxFQUEyQyxRQUEzQyxFQUFxRDtBQUFDMEIsZUFBSzBLO0FBQU4sU0FBckQsQ0FBYjs7QUFDQSxZQUFHLENBQUNpcUIsVUFBSjtBQUNDLGlCQUFPLEtBQVA7QUFIRjtBQzBCSTs7QUR0QkpwM0IsZUFBU3BHLFFBQVFnSSxTQUFSLENBQWtCYixXQUFsQixDQUFUO0FBQ0F3MkIsa0JBQVl2M0IsT0FBT3VMLGNBQVAsSUFBeUIsTUFBckM7O0FBRUEsV0FBTzJFLFlBQVA7QUFDQ0EsdUJBQWUvTixRQUFRQyxHQUFSLENBQVksY0FBWixDQUFmO0FDdUJHOztBRHRCSixXQUFPOE4sWUFBUDtBQUNDQSx1QkFBZSxLQUFmO0FDd0JHOztBRHRCSixVQUFHLENBQUM3TyxFQUFFb0MsUUFBRixDQUFXcXdCLFlBQVgsQ0FBRCxJQUE2QkEsWUFBaEM7QUFDQ0EsdUJBQWVBLGFBQWF5RCxTQUFiLENBQWY7QUN3Qkc7O0FEdEJKLFVBQUdyckIsVUFBVSxDQUFDNG5CLFlBQWQ7QUFDQ0EsdUJBQWU1bkIsT0FBT3FyQixTQUFQLENBQWY7QUN3Qkc7O0FEdEJKRCxxQkFBZSxrQ0FBZjtBQUNBRCxvQkFBYyxpQ0FBZDs7QUFFQSxXQUFPbHFCLFNBQVA7QUFDQ21xQix1QkFBZSx1Q0FBZjtBQUNBRCxzQkFBYyxzQ0FBZDtBQUlBRywwQkFBa0J4QyxVQUFVMEMsb0JBQVYsQ0FBK0J6QixZQUFZL2xCLFlBQTNDLENBQWxCOztBQUNBLFlBQUcsQ0FBQ3NuQixlQUFELElBQW9CLENBQUNBLGdCQUFnQnJ6QixNQUF4QztBQUNDNlcsaUJBQU82WSxPQUFQLENBQWU1TCxFQUFFLHlDQUFGLENBQWY7QUFDQTtBQVRGO0FDOEJJOztBRG5CSixVQUFHNkwsWUFBSDtBQUNDMkQsZUFBT3hQLEVBQUVvUCxXQUFGLEVBQWtCcjNCLE9BQU9tTSxLQUFQLEdBQWEsS0FBYixHQUFrQjJuQixZQUFsQixHQUErQixJQUFqRCxDQUFQO0FBREQ7QUFHQzJELGVBQU94UCxFQUFFb1AsV0FBRixFQUFlLEtBQUdyM0IsT0FBT21NLEtBQXpCLENBQVA7QUNxQkc7O0FBQ0QsYURyQkh3ckIsS0FDQztBQUFBcEMsZUFBT3ROLEVBQUVxUCxZQUFGLEVBQWdCLEtBQUd0M0IsT0FBT21NLEtBQTFCLENBQVA7QUFDQXNyQixjQUFNLHlDQUF1Q0EsSUFBdkMsR0FBNEMsUUFEbEQ7QUFFQXJVLGNBQU0sSUFGTjtBQUdBd1UsMEJBQWlCLElBSGpCO0FBSUFDLDJCQUFtQjVQLEVBQUUsUUFBRixDQUpuQjtBQUtBNlAsMEJBQWtCN1AsRUFBRSxRQUFGO0FBTGxCLE9BREQsRUFPQyxVQUFDblIsTUFBRDtBQUNDLFlBQUFpaEIsa0JBQUEsRUFBQUMsYUFBQTs7QUFBQSxZQUFHbGhCLE1BQUg7QUFDQyxjQUFHM0osU0FBSDtBQ3VCTSxtQkRyQkx1bEIsY0FBYzN4QixXQUFkLEVBQTJCb00sU0FBM0IsRUFBc0MybUIsWUFBdEMsRUFBb0Q1akIsWUFBcEQsRUFBa0VoRSxNQUFsRSxFQUEwRTtBQUV6RSxrQkFBQStyQixFQUFBLEVBQUFDLEtBQUEsRUFBQXpELG1CQUFBLEVBQUFDLGlCQUFBLEVBQUF5RCxrQkFBQSxFQUFBQyxhQUFBLEVBQUFDLG1CQUFBLEVBQUFDLGNBQUEsRUFBQUMsU0FBQSxFQUFBejJCLEdBQUEsRUFBQTAyQixjQUFBOztBQUFBSCxvQ0FBc0J0M0IsWUFBWStTLE9BQVosQ0FBb0IsS0FBcEIsRUFBMEIsR0FBMUIsQ0FBdEI7QUFDQXNrQiw4QkFBZ0JyQyxFQUFFLG9CQUFrQnNDLG1CQUFwQixDQUFoQjs7QUFDQSxvQkFBQUQsaUJBQUEsT0FBT0EsY0FBZWowQixNQUF0QixHQUFzQixNQUF0QjtBQUNDLG9CQUFHb3ZCLE9BQU9rRixNQUFWO0FBQ0NILG1DQUFpQixLQUFqQjtBQUNBRixrQ0FBZ0I3RSxPQUFPa0YsTUFBUCxDQUFjMUMsQ0FBZCxDQUFnQixvQkFBa0JzQyxtQkFBbEMsQ0FBaEI7QUFIRjtBQzBCTzs7QUR0QlA7QUFFQzVELHNDQUFzQnR5QixRQUFRQyxHQUFSLENBQVksYUFBWixDQUF0QjtBQUNBc3lCLG9DQUFvQnZ5QixRQUFRQyxHQUFSLENBQVksV0FBWixDQUFwQjs7QUFDQSxvQkFBR3F5Qix1QkFBQSxFQUFBM3lCLE1BQUFsSSxRQUFBZ0ksU0FBQSxDQUFBNnlCLG1CQUFBLGFBQUEzeUIsSUFBK0QrWixPQUEvRCxHQUErRCxNQUEvRCxJQUF5RSxDQUE1RTtBQUNDbVosNEJBQVVVLFlBQVYsQ0FBdUJqQixtQkFBdkIsRUFBNENDLGlCQUE1QztBQ3VCTzs7QUR0QlIsb0JBQUdpQixXQUFXWSxPQUFYLEdBQXFCbUMsS0FBckIsQ0FBMkI3OUIsSUFBM0IsQ0FBZ0M4OUIsUUFBaEMsQ0FBeUMsYUFBekMsQ0FBSDtBQUNDLHNCQUFHNTNCLGdCQUFlb0IsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBbEI7QUFDQ3V6QiwrQkFBV0MsTUFBWDtBQUZGO0FBQUE7QUFJQ3JDLHlCQUFPcUYsV0FBUCxDQUFtQjNDLFFBQW5CO0FBVkY7QUFBQSx1QkFBQTNkLE1BQUE7QUFXTTJmLHFCQUFBM2YsTUFBQTtBQUNMNVksd0JBQVFELEtBQVIsQ0FBY3c0QixFQUFkO0FDMkJNOztBRDFCUCxrQkFBQUcsaUJBQUEsT0FBR0EsY0FBZWowQixNQUFsQixHQUFrQixNQUFsQjtBQUNDLG9CQUFHbkUsT0FBT3NjLFdBQVY7QUFDQzZiLHVDQUFxQkMsY0FBY1MsVUFBZCxHQUEyQkEsVUFBM0IsQ0FBc0MsVUFBdEMsQ0FBckI7QUFERDtBQUdDVix1Q0FBcUJDLGNBQWNVLFVBQWQsR0FBMkJBLFVBQTNCLENBQXNDLFVBQXRDLENBQXJCO0FBSkY7QUNpQ087O0FENUJQLGtCQUFHWCxrQkFBSDtBQUNDLG9CQUFHbjRCLE9BQU9zYyxXQUFWO0FBQ0M2YixxQ0FBbUJZLE9BQW5CO0FBREQ7QUFHQyxzQkFBR2g0QixnQkFBZW9CLFFBQVFDLEdBQVIsQ0FBWSxhQUFaLENBQWxCO0FBQ0N1ekIsK0JBQVdDLE1BQVg7QUFERDtBQUdDb0QsNkJBQVNDLFlBQVQsQ0FBc0JGLE9BQXRCLENBQThCWixrQkFBOUI7QUFORjtBQUREO0FDdUNPOztBRC9CUEksMEJBQVkzK0IsUUFBUXE5QixZQUFSLENBQXFCbDJCLFdBQXJCLEVBQWtDb00sU0FBbEMsQ0FBWjtBQUNBcXJCLCtCQUFpQjUrQixRQUFRcy9CLGlCQUFSLENBQTBCbjRCLFdBQTFCLEVBQXVDdzNCLFNBQXZDLENBQWpCOztBQUNBLGtCQUFHRCxrQkFBa0IsQ0FBQ0gsa0JBQXRCO0FBQ0Msb0JBQUdHLGNBQUg7QUFDQy9FLHlCQUFPNEYsS0FBUDtBQURELHVCQUVLLElBQUdoc0IsY0FBYWhMLFFBQVFDLEdBQVIsQ0FBWSxXQUFaLENBQWIsSUFBMEM4TixpQkFBZ0IsVUFBN0Q7QUFDSmdvQiwwQkFBUS8xQixRQUFRQyxHQUFSLENBQVksUUFBWixDQUFSOztBQUNBLHVCQUFPbzJCLGNBQVA7QUFFQzdDLCtCQUFXeUQsRUFBWCxDQUFjLFVBQVFsQixLQUFSLEdBQWMsR0FBZCxHQUFpQm4zQixXQUFqQixHQUE2QixRQUE3QixHQUFxQ21QLFlBQW5EO0FBSkc7QUFITjtBQ3lDTzs7QURqQ1Asa0JBQUc2akIsYUFBYyxPQUFPQSxTQUFQLEtBQW9CLFVBQXJDO0FDbUNRLHVCRGxDUEEsV0NrQ087QUFDRDtBRGhGUixjQ3FCSztBRHZCTjtBQWtEQyxnQkFBR3lELG1CQUFtQkEsZ0JBQWdCcnpCLE1BQXRDO0FBQ0M0eEIsZ0JBQUUsTUFBRixFQUFVc0QsUUFBVixDQUFtQixTQUFuQjtBQUNBckIsOEJBQWdCLENBQWhCOztBQUNBRCxtQ0FBcUI7QUFDcEJDOztBQUNBLG9CQUFHQSxpQkFBaUJSLGdCQUFnQnJ6QixNQUFwQztBQUVDNHhCLG9CQUFFLE1BQUYsRUFBVXVELFdBQVYsQ0FBc0IsU0FBdEI7QUNtQ1EseUJEbENSL0YsT0FBT3FGLFdBQVAsQ0FBbUIzQyxRQUFuQixDQ2tDUTtBQUNEO0FEeENZLGVBQXJCOztBQzBDTSxxQkRwQ051QixnQkFBZ0IzbEIsT0FBaEIsQ0FBd0IsVUFBQzNGLE1BQUQ7QUFDdkIsb0JBQUFxdEIsV0FBQTtBQUFBcHNCLDRCQUFZakIsT0FBT3pKLEdBQW5CO0FBQ0EyMEIsNkJBQWFsRCxZQUFZSSxPQUFaLENBQW9CdnpCLFdBQXBCLEVBQWlDLFFBQWpDLEVBQTJDLFFBQTNDLEVBQXFEO0FBQUMwQix1QkFBSzBLO0FBQU4saUJBQXJELENBQWI7O0FBQ0Esb0JBQUcsQ0FBQ2lxQixVQUFKO0FBQ0NXO0FBQ0E7QUN3Q087O0FEdkNSd0IsOEJBQWNydEIsT0FBT3FyQixTQUFQLEtBQXFCcHFCLFNBQW5DO0FDeUNPLHVCRHhDUHVsQixjQUFjM3hCLFdBQWQsRUFBMkJtTCxPQUFPekosR0FBbEMsRUFBdUM4MkIsV0FBdkMsRUFBb0RycEIsWUFBcEQsRUFBa0VoRSxNQUFsRSxFQUEyRTtBQUMxRSxzQkFBQXFzQixTQUFBO0FBQUFBLDhCQUFZMytCLFFBQVFxOUIsWUFBUixDQUFxQmwyQixXQUFyQixFQUFrQ29NLFNBQWxDLENBQVo7QUFDQXZULDBCQUFRcy9CLGlCQUFSLENBQTBCbjRCLFdBQTFCLEVBQXVDdzNCLFNBQXZDO0FDMENRLHlCRHpDUlIsb0JDeUNRO0FENUNpRSxpQkFBMUUsRUFJRztBQzBDTSx5QkR6Q1JBLG9CQ3lDUTtBRDlDVCxrQkN3Q087QUQvQ1IsZ0JDb0NNO0FEL0ZSO0FBREQ7QUNzSEk7QUQ5SE4sUUNxQkc7QUQzSUo7QUFBQSxHQUZEO0FDMFBBLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIkBkYiA9IHt9XG5pZiAhQ3JlYXRvcj9cblx0QENyZWF0b3IgPSB7fVxuQ3JlYXRvci5PYmplY3RzID0ge31cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fVxuQ3JlYXRvci5NZW51cyA9IFtdXG5DcmVhdG9yLkFwcHMgPSB7fVxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge31cbkNyZWF0b3IuUmVwb3J0cyA9IHt9XG5DcmVhdG9yLnN1YnMgPSB7fVxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge30iLCJ0aGlzLmRiID0ge307XG5cbmlmICh0eXBlb2YgQ3JlYXRvciA9PT0gXCJ1bmRlZmluZWRcIiB8fCBDcmVhdG9yID09PSBudWxsKSB7XG4gIHRoaXMuQ3JlYXRvciA9IHt9O1xufVxuXG5DcmVhdG9yLk9iamVjdHMgPSB7fTtcblxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9O1xuXG5DcmVhdG9yLk1lbnVzID0gW107XG5cbkNyZWF0b3IuQXBwcyA9IHt9O1xuXG5DcmVhdG9yLkRhc2hib2FyZHMgPSB7fTtcblxuQ3JlYXRvci5SZXBvcnRzID0ge307XG5cbkNyZWF0b3Iuc3VicyA9IHt9O1xuXG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fTtcbiIsInRyeVxuXHRpZiBwcm9jZXNzLmVudi5DUkVBVE9SX05PREVfRU5WID09ICdkZXZlbG9wbWVudCdcblx0XHRzdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKVxuXHRcdG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKVxuXHRcdG1vbGVjdWxlciA9IHJlcXVpcmUoXCJtb2xlY3VsZXJcIik7XG5cdFx0cGFja2FnZUxvYWRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0ZW9yLXBhY2thZ2UtbG9hZGVyJyk7XG5cdFx0QVBJU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtYXBpJyk7XG5cdFx0TWV0YWRhdGFTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRhZGF0YS1zZXJ2ZXInKTtcblx0XHRwYWNrYWdlU2VydmljZSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9zZXJ2aWNlLXBhY2thZ2UtcmVnaXN0cnlcIik7XG5cdFx0cGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5cdFx0Y29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xuXHRcdHNldHRpbmdzID0ge1xuXHRcdFx0YnVpbHRfaW5fcGx1Z2luczogW1xuXHRcdFx0XHRcIkBzdGVlZG9zL3VucGtnXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvd29ya2Zsb3dcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9hY2NvdW50c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0ZWVkb3MtcGx1Z2luLXNjaGVtYS1idWlsZGVyXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvcGx1Z2luLWVudGVycHJpc2VcIixcblx0XHRcdFx0IyBcIkBzdGVlZG9zL3BsdWdpbi1qc3JlcG9ydFwiLFxuXHRcdFx0XHQjIFwiQHN0ZWVkb3Mvd29yZC10ZW1wbGF0ZVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL21ldGFkYXRhLWFwaVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3BsdWdpbi1kaW5ndGFsa1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL2RhdGEtaW1wb3J0XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1maWVsZHMtaW5kZXhzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1hY2NvdW50c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2hhcnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wYWdlc1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtY2xvdWQtaW5pdFwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS1yZWdpc3RyeVwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3NcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93ZWJhcHAtYWNjb3VudHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLXBsdWdpbi1hbWlzXCIsXG5cdFx0XHRdLFxuXHRcdFx0cGx1Z2luczogY29uZmlnLnBsdWdpbnNcblx0XHR9XG5cdFx0TWV0ZW9yLnN0YXJ0dXAgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuXHRcdFx0XHRcdG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG5cdFx0XHRcdFx0bm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuXHRcdFx0XHRcdG1ldGFkYXRhOiB7fSxcblx0XHRcdFx0XHR0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG5cdFx0XHRcdFx0Y2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG5cdFx0XHRcdFx0bG9nTGV2ZWw6IFwid2FyblwiLFxuXHRcdFx0XHRcdHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuXHRcdFx0XHRcdHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG5cdFx0XHRcdFx0bWF4Q2FsbExldmVsOiAxMDAsXG5cblx0XHRcdFx0XHRoZWFydGJlYXRJbnRlcnZhbDogMTAsXG5cdFx0XHRcdFx0aGVhcnRiZWF0VGltZW91dDogMzAsXG5cblx0XHRcdFx0XHRjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG5cblx0XHRcdFx0XHR0cmFja2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaHV0ZG93blRpbWVvdXQ6IDUwMDAsXG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG5cblx0XHRcdFx0XHRyZWdpc3RyeToge1xuXHRcdFx0XHRcdFx0c3RyYXRlZ3k6IFwiUm91bmRSb2JpblwiLFxuXHRcdFx0XHRcdFx0cHJlZmVyTG9jYWw6IHRydWVcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0YnVsa2hlYWQ6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0Y29uY3VycmVuY3k6IDEwLFxuXHRcdFx0XHRcdFx0bWF4UXVldWVTaXplOiAxMDAsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR2YWxpZGF0b3I6IHRydWUsXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBudWxsLFxuXHRcdFx0XHRcdHRyYWNpbmc6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZXhwb3J0ZXI6IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJDb25zb2xlXCIsXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0XHRsb2dnZXI6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3JzOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0XHRcdFx0Z2F1Z2VXaWR0aDogNDBcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2tpcFByb2Nlc3NFdmVudFJlZ2lzdHJhdGlvbjogdHJ1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHRcdHByb2plY3RTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuXHRcdFx0XHRcdG5hbWU6IFwicHJvamVjdC1zZXJ2ZXJcIixcblx0XHRcdFx0XHRuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuXHRcdFx0XHRcdG1peGluczogW3BhY2thZ2VTZXJ2aWNlXSxcblx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHRtZXRhZGF0YVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogJ21ldGFkYXRhLXNlcnZlcicsXG5cdFx0XHRcdFx0bWl4aW5zOiBbTWV0YWRhdGFTZXJ2aWNlXSxcblx0XHRcdFx0XHRzZXR0aW5nczoge1xuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGFwaVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogXCJhcGlcIixcblx0XHRcdFx0XHRtaXhpbnM6IFtBUElTZXJ2aWNlXSxcblx0XHRcdFx0XHRzZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0cG9ydDogbnVsbFxuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdG9iamVjdHFsLmdldFN0ZWVkb3NTY2hlbWEoYnJva2VyKTtcblx0XHRcdFx0c3RhbmRhcmRPYmplY3RzRGlyID0gb2JqZWN0cWwuU3RhbmRhcmRPYmplY3RzUGF0aDtcblx0XHRcdFx0c3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogJ3N0YW5kYXJkLW9iamVjdHMnLFxuXHRcdFx0XHRcdG1peGluczogW3BhY2thZ2VMb2FkZXJdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7IHBhY2thZ2VJbmZvOiB7XG5cdFx0XHRcdFx0XHRwYXRoOiBzdGFuZGFyZE9iamVjdHNEaXIsXG5cdFx0XHRcdFx0fSB9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdE1ldGVvci53cmFwQXN5bmMoKGNiKS0+XG5cdFx0XHRcdFx0YnJva2VyLnN0YXJ0KCkudGhlbigoKS0+XG5cdFx0XHRcdFx0XHRpZiAhYnJva2VyLnN0YXJ0ZWQgXG5cdFx0XHRcdFx0XHRcdGJyb2tlci5fcmVzdGFydFNlcnZpY2Uoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UpO1xuXG5cdFx0XHRcdFx0XHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShcIi9cIiwgYXBpU2VydmljZS5leHByZXNzKCkpO1xuXHRcdFx0XHRcdFx0IyBzdGVlZG9zQ29yZS5pbml0KHNldHRpbmdzKS50aGVuICgpLT5cblx0XHRcdFx0XHRcdCMgXHRjYigpO1xuXG5cdFx0XHRcdFx0XHRicm9rZXIud2FpdEZvclNlcnZpY2VzKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlLm5hbWUpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cblx0XHRcdFx0XHRcdFx0c3RlZWRvc0NvcmUuaW5pdChzZXR0aW5ncykudGhlbiAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KSgpXG5cdFx0XHRjYXRjaCBleFxuXHRcdFx0XHRjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsZXgpXG5jYXRjaCBlXG5cdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixlKSIsInZhciBBUElTZXJ2aWNlLCBNZXRhZGF0YVNlcnZpY2UsIGNvbmZpZywgZSwgbW9sZWN1bGVyLCBvYmplY3RxbCwgcGFja2FnZUxvYWRlciwgcGFja2FnZVNlcnZpY2UsIHBhdGgsIHNldHRpbmdzLCBzdGVlZG9zQ29yZTtcblxudHJ5IHtcbiAgaWYgKHByb2Nlc3MuZW52LkNSRUFUT1JfTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBzdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcbiAgICBvYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XG4gICAgbW9sZWN1bGVyID0gcmVxdWlyZShcIm1vbGVjdWxlclwiKTtcbiAgICBwYWNrYWdlTG9hZGVyID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRlb3ItcGFja2FnZS1sb2FkZXInKTtcbiAgICBBUElTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1hcGknKTtcbiAgICBNZXRhZGF0YVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGFkYXRhLXNlcnZlcicpO1xuICAgIHBhY2thZ2VTZXJ2aWNlID0gcmVxdWlyZShcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS1yZWdpc3RyeVwiKTtcbiAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgIGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcbiAgICBzZXR0aW5ncyA9IHtcbiAgICAgIGJ1aWx0X2luX3BsdWdpbnM6IFtcIkBzdGVlZG9zL3VucGtnXCIsIFwiQHN0ZWVkb3Mvd29ya2Zsb3dcIiwgXCJAc3RlZWRvcy9hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3N0ZWVkb3MtcGx1Z2luLXNjaGVtYS1idWlsZGVyXCIsIFwiQHN0ZWVkb3MvcGx1Z2luLWVudGVycHJpc2VcIiwgXCJAc3RlZWRvcy9tZXRhZGF0YS1hcGlcIiwgXCJAc3RlZWRvcy9wbHVnaW4tZGluZ3RhbGtcIiwgXCJAc3RlZWRvcy9kYXRhLWltcG9ydFwiLCBcIkBzdGVlZG9zL3NlcnZpY2UtZmllbGRzLWluZGV4c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtYWNjb3VudHNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWNoYXJ0c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtcGFnZXNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLWNsb3VkLWluaXRcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBhY2thZ2UtcmVnaXN0cnlcIiwgXCJAc3RlZWRvcy9zdGFuZGFyZC1wcm9jZXNzXCIsIFwiQHN0ZWVkb3Mvd2ViYXBwLWFjY291bnRzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1wbHVnaW4tYW1pc1wiXSxcbiAgICAgIHBsdWdpbnM6IGNvbmZpZy5wbHVnaW5zXG4gICAgfTtcbiAgICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcGlTZXJ2aWNlLCBicm9rZXIsIGV4LCBtZXRhZGF0YVNlcnZpY2UsIHByb2plY3RTZXJ2aWNlLCBzdGFuZGFyZE9iamVjdHNEaXIsIHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYnJva2VyID0gbmV3IG1vbGVjdWxlci5TZXJ2aWNlQnJva2VyKHtcbiAgICAgICAgICBuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuICAgICAgICAgIG5vZGVJRDogXCJzdGVlZG9zLWNyZWF0b3JcIixcbiAgICAgICAgICBtZXRhZGF0YToge30sXG4gICAgICAgICAgdHJhbnNwb3J0ZXI6IHByb2Nlc3MuZW52LlRSQU5TUE9SVEVSLFxuICAgICAgICAgIGNhY2hlcjogcHJvY2Vzcy5lbnYuQ0FDSEVSLFxuICAgICAgICAgIGxvZ0xldmVsOiBcIndhcm5cIixcbiAgICAgICAgICBzZXJpYWxpemVyOiBcIkpTT05cIixcbiAgICAgICAgICByZXF1ZXN0VGltZW91dDogNjAgKiAxMDAwLFxuICAgICAgICAgIG1heENhbGxMZXZlbDogMTAwLFxuICAgICAgICAgIGhlYXJ0YmVhdEludGVydmFsOiAxMCxcbiAgICAgICAgICBoZWFydGJlYXRUaW1lb3V0OiAzMCxcbiAgICAgICAgICBjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG4gICAgICAgICAgdHJhY2tpbmc6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgc2h1dGRvd25UaW1lb3V0OiA1MDAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkaXNhYmxlQmFsYW5jZXI6IGZhbHNlLFxuICAgICAgICAgIHJlZ2lzdHJ5OiB7XG4gICAgICAgICAgICBzdHJhdGVneTogXCJSb3VuZFJvYmluXCIsXG4gICAgICAgICAgICBwcmVmZXJMb2NhbDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYnVsa2hlYWQ6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgY29uY3VycmVuY3k6IDEwLFxuICAgICAgICAgICAgbWF4UXVldWVTaXplOiAxMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHZhbGlkYXRvcjogdHJ1ZSxcbiAgICAgICAgICBlcnJvckhhbmRsZXI6IG51bGwsXG4gICAgICAgICAgdHJhY2luZzoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBleHBvcnRlcjoge1xuICAgICAgICAgICAgICB0eXBlOiBcIkNvbnNvbGVcIixcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGxvZ2dlcjogbnVsbCxcbiAgICAgICAgICAgICAgICBjb2xvcnM6IHRydWUsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICAgICAgICBnYXVnZVdpZHRoOiA0MFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBza2lwUHJvY2Vzc0V2ZW50UmVnaXN0cmF0aW9uOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBwcm9qZWN0U2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiBcInByb2plY3Qtc2VydmVyXCIsXG4gICAgICAgICAgbmFtZXNwYWNlOiBcInN0ZWVkb3NcIixcbiAgICAgICAgICBtaXhpbnM6IFtwYWNrYWdlU2VydmljZV1cbiAgICAgICAgfSk7XG4gICAgICAgIG1ldGFkYXRhU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiAnbWV0YWRhdGEtc2VydmVyJyxcbiAgICAgICAgICBtaXhpbnM6IFtNZXRhZGF0YVNlcnZpY2VdLFxuICAgICAgICAgIHNldHRpbmdzOiB7fVxuICAgICAgICB9KTtcbiAgICAgICAgYXBpU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiBcImFwaVwiLFxuICAgICAgICAgIG1peGluczogW0FQSVNlcnZpY2VdLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBwb3J0OiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgb2JqZWN0cWwuZ2V0U3RlZWRvc1NjaGVtYShicm9rZXIpO1xuICAgICAgICBzdGFuZGFyZE9iamVjdHNEaXIgPSBvYmplY3RxbC5TdGFuZGFyZE9iamVjdHNQYXRoO1xuICAgICAgICBzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcbiAgICAgICAgICBuYW1lOiAnc3RhbmRhcmQtb2JqZWN0cycsXG4gICAgICAgICAgbWl4aW5zOiBbcGFja2FnZUxvYWRlcl0sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHBhY2thZ2VJbmZvOiB7XG4gICAgICAgICAgICAgIHBhdGg6IHN0YW5kYXJkT2JqZWN0c0RpclxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgICAgcmV0dXJuIGJyb2tlci5zdGFydCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIWJyb2tlci5zdGFydGVkKSB7XG4gICAgICAgICAgICAgIGJyb2tlci5fcmVzdGFydFNlcnZpY2Uoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoXCIvXCIsIGFwaVNlcnZpY2UuZXhwcmVzcygpKTtcbiAgICAgICAgICAgIHJldHVybiBicm9rZXIud2FpdEZvclNlcnZpY2VzKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlLm5hbWUpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5pbml0KHNldHRpbmdzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KSgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXggPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIiwgZXgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59IGNhdGNoIChlcnJvcikge1xuICBlID0gZXJyb3I7XG4gIGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIiwgZSk7XG59XG4iLCJDcmVhdG9yLmRlcHMgPSB7XG5cdGFwcDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxuXHRvYmplY3Q6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcbn07XG5cbkNyZWF0b3IuX1RFTVBMQVRFID0ge1xuXHRBcHBzOiB7fSxcblx0T2JqZWN0czoge31cbn1cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2ZpbHRlcnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe29wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2NyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXG4jIENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyDkvptzdGVlZG9zLWNsaemhueebruS9v+eUqFxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJylcblx0Q3JlYXRvci5maWJlckxvYWRPYmplY3RzID0gKG9iaiwgb2JqZWN0X25hbWUpLT5cblx0XHRGaWJlcigoKS0+XG5cdFx0XHRDcmVhdG9yLmxvYWRPYmplY3RzKG9iaiwgb2JqZWN0X25hbWUpXG5cdFx0KS5ydW4oKVxuXG5DcmVhdG9yLmxvYWRPYmplY3RzID0gKG9iaiwgb2JqZWN0X25hbWUpLT5cblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBvYmoubmFtZVxuXG5cdGlmICFvYmoubGlzdF92aWV3c1xuXHRcdG9iai5saXN0X3ZpZXdzID0ge31cblxuXHRpZiBvYmouc3BhY2Vcblx0XHRvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKVxuXHRpZiBvYmplY3RfbmFtZSA9PSAnY2ZzX2ZpbGVzX2ZpbGVyZWNvcmQnXG5cdFx0b2JqZWN0X25hbWUgPSAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXG5cdFx0b2JqID0gXy5jbG9uZShvYmopXG5cdFx0b2JqLm5hbWUgPSBvYmplY3RfbmFtZVxuXHRcdENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0gPSBvYmpcblxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKVxuXHRuZXcgQ3JlYXRvci5PYmplY3Qob2JqKTtcblxuXHRDcmVhdG9yLmluaXRUcmlnZ2VycyhvYmplY3RfbmFtZSlcblx0Q3JlYXRvci5pbml0TGlzdFZpZXdzKG9iamVjdF9uYW1lKVxuXHRyZXR1cm4gb2JqXG5cbkNyZWF0b3IuZ2V0T2JqZWN0TmFtZSA9IChvYmplY3QpIC0+XG5cdGlmIG9iamVjdC5zcGFjZVxuXHRcdHJldHVybiBcImNfI3tvYmplY3Quc3BhY2V9XyN7b2JqZWN0Lm5hbWV9XCJcblx0cmV0dXJuIG9iamVjdC5uYW1lXG5cbkNyZWF0b3IuZ2V0T2JqZWN0ID0gKG9iamVjdF9uYW1lLCBzcGFjZV9pZCktPlxuXHRpZiBfLmlzQXJyYXkob2JqZWN0X25hbWUpXG5cdFx0cmV0dXJuIDtcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0Q3JlYXRvci5kZXBzPy5vYmplY3Q/LmRlcGVuZCgpXG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cbiNcdGlmICFzcGFjZV9pZCAmJiBvYmplY3RfbmFtZVxuI1x0XHRpZiBNZXRlb3IuaXNDbGllbnQgJiYgIW9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2NfJylcbiNcdFx0XHRzcGFjZV9pZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXG5cdGlmIG9iamVjdF9uYW1lXG4jXHRcdGlmIHNwYWNlX2lkXG4jXHRcdFx0b2JqID0gQ3JlYXRvci5vYmplY3RzQnlOYW1lW1wiY18je3NwYWNlX2lkfV8je29iamVjdF9uYW1lfVwiXVxuI1x0XHRcdGlmIG9ialxuI1x0XHRcdFx0cmV0dXJuIG9ialxuI1xuI1x0XHRvYmogPSBfLmZpbmQgQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAobyktPlxuI1x0XHRcdFx0cmV0dXJuIG8uX2NvbGxlY3Rpb25fbmFtZSA9PSBvYmplY3RfbmFtZVxuI1x0XHRpZiBvYmpcbiNcdFx0XHRyZXR1cm4gb2JqXG5cblx0XHRyZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSAob2JqZWN0X2lkKS0+XG5cdHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtfaWQ6IG9iamVjdF9pZH0pXG5cbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gKG9iamVjdF9uYW1lKS0+XG5cdGNvbnNvbGUubG9nKFwicmVtb3ZlT2JqZWN0XCIsIG9iamVjdF9uYW1lKVxuXHRkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRkZWxldGUgQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXVxuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSAob2JqZWN0X25hbWUsIHNwYWNlSWQpLT5cblx0aWYgIW9iamVjdF9uYW1lXG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdGlmIG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpPy5fY29sbGVjdGlvbl9uYW1lIHx8IG9iamVjdF9uYW1lXVxuXG5DcmVhdG9yLnJlbW92ZUNvbGxlY3Rpb24gPSAob2JqZWN0X25hbWUpLT5cblx0ZGVsZXRlIENyZWF0b3IuQ29sbGVjdGlvbnNbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuaXNTcGFjZUFkbWluID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdGlmICF1c2VySWRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdHNwYWNlID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIik/LmRiPy5maW5kT25lKHNwYWNlSWQse2ZpZWxkczp7YWRtaW5zOjF9fSlcblx0aWYgc3BhY2U/LmFkbWluc1xuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDBcblxuXG5DcmVhdG9yLmV2YWx1YXRlRm9ybXVsYSA9IChmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucyktPlxuXG5cdGlmICFfLmlzU3RyaW5nKGZvcm11bGFyKVxuXHRcdHJldHVybiBmb3JtdWxhclxuXG5cdGlmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZvcm11bGFyKVxuXHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucylcblxuXHRyZXR1cm4gZm9ybXVsYXJcblxuQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnMgPSAoZmlsdGVycywgY29udGV4dCktPlxuXHRzZWxlY3RvciA9IHt9XG5cdF8uZWFjaCBmaWx0ZXJzLCAoZmlsdGVyKS0+XG5cdFx0aWYgZmlsdGVyPy5sZW5ndGggPT0gM1xuXHRcdFx0bmFtZSA9IGZpbHRlclswXVxuXHRcdFx0YWN0aW9uID0gZmlsdGVyWzFdXG5cdFx0XHR2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgY29udGV4dClcblx0XHRcdHNlbGVjdG9yW25hbWVdID0ge31cblx0XHRcdHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZVxuXHQjIGNvbnNvbGUubG9nKFwiZXZhbHVhdGVGaWx0ZXJzLS0+c2VsZWN0b3JcIiwgc2VsZWN0b3IpXG5cdHJldHVybiBzZWxlY3RvclxuXG5DcmVhdG9yLmlzQ29tbW9uU3BhY2UgPSAoc3BhY2VJZCkgLT5cblx0cmV0dXJuIHNwYWNlSWQgPT0gJ2NvbW1vbidcblxuIyMjXG5cdGRvY3PvvJrlvoXmjpLluo/nmoTmlofmoaPmlbDnu4Rcblx0aWRz77yaX2lk6ZuG5ZCIXG5cdGlkX2tleTog6buY6K6k5Li6X2lkXG5cdHJldHVybiDmjInnhadpZHPnmoTpobrluo/ov5Tlm57mlrDnmoTmlofmoaPpm4blkIhcbiMjI1xuQ3JlYXRvci5nZXRPcmRlcmx5U2V0QnlJZHMgPSAoZG9jcywgaWRzLCBpZF9rZXksIGhpdF9maXJzdCktPlxuXG5cdGlmICFpZF9rZXlcblx0XHRpZF9rZXkgPSBcIl9pZFwiXG5cblx0aWYgaGl0X2ZpcnN0XG5cblx0XHQj55Sx5LqO5LiN6IO95L2/55SoXy5maW5kSW5kZXjlh73mlbDvvIzlm6DmraTmraTlpITlhYjlsIblr7nosaHmlbDnu4TovazkuLrmma7pgJrmlbDnu4TnsbvlnovvvIzlnKjojrflj5blhbZpbmRleFxuXHRcdHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KVxuXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XG5cdFx0XHRcdFx0X2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXG5cdFx0XHRcdFx0aWYgX2luZGV4ID4gLTFcblx0XHRcdFx0XHRcdHJldHVybiBfaW5kZXhcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gaWRzLmxlbmd0aCArIF8uaW5kZXhPZih2YWx1ZXMsIGRvY1tpZF9rZXldKVxuXHRlbHNlXG5cdFx0cmV0dXJuXHRfLnNvcnRCeSBkb2NzLCAoZG9jKS0+XG5cdFx0XHRyZXR1cm4gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pXG5cbiMjI1xuXHTmjInnlKjmiLfmiYDlsZ7mnKzlnLDljJbor63oqIDov5vooYzmjpLluo/vvIzmlK/mjIHkuK3mlofjgIHmlbDlgLzjgIHml6XmnJ/nrYnlrZfmrrXmjpLluo9cblx05a+55LqOT2JqZWN057G75Z6L77yM5aaC5p6c5o+Q5L6b5L2c55So5Z+f5Lita2V55bGe5oCn77yM5YiZ5Y+W5YC85Li6dmFsdWVba2V5Xei/m+ihjOaOkuW6j+avlOi+g++8jOWPjeS5i+aVtOS4qk9iamVjdC50b1N0cmluZygp5ZCO5o6S5bqP5q+U6L6DXG4jIyNcbkNyZWF0b3Iuc29ydGluZ01ldGhvZCA9ICh2YWx1ZTEsIHZhbHVlMikgLT5cblx0aWYgdGhpcy5rZXlcblx0XHR2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldXG5cdFx0dmFsdWUyID0gdmFsdWUyW3RoaXMua2V5XVxuXHRpZiB2YWx1ZTEgaW5zdGFuY2VvZiBEYXRlXG5cdFx0dmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKVxuXHRpZiB2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlXG5cdFx0dmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKVxuXHRpZiB0eXBlb2YgdmFsdWUxIGlzIFwibnVtYmVyXCIgYW5kIHR5cGVvZiB2YWx1ZTIgaXMgXCJudW1iZXJcIlxuXHRcdHJldHVybiB2YWx1ZTEgLSB2YWx1ZTJcblx0IyBIYW5kbGluZyBudWxsIHZhbHVlc1xuXHRpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09IG51bGwgb3IgdmFsdWUxID09IHVuZGVmaW5lZFxuXHRpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09IG51bGwgb3IgdmFsdWUyID09IHVuZGVmaW5lZFxuXHRpZiBpc1ZhbHVlMUVtcHR5IGFuZCAhaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAtMVxuXHRpZiBpc1ZhbHVlMUVtcHR5IGFuZCBpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIDBcblx0aWYgIWlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gMVxuXHRsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG5cdHJldHVybiB2YWx1ZTEudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlIHZhbHVlMi50b1N0cmluZygpLCBsb2NhbGVcblxuXG4jIOivpeWHveaVsOWPquWcqOWIneWni+WMlk9iamVjdOaXtu+8jOaKiuebuOWFs+WvueixoeeahOiuoeeul+e7k+aenOS/neWtmOWIsE9iamVjdOeahHJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4re+8jOWQjue7reWPr+S7peebtOaOpeS7jnJlbGF0ZWRfb2JqZWN0c+WxnuaAp+S4reWPluW+l+iuoeeul+e7k+aenOiAjOS4jeeUqOWGjeasoeiwg+eUqOivpeWHveaVsOadpeiuoeeul1xuQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyA9IChvYmplY3RfbmFtZSktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdHJlbGF0ZWRfb2JqZWN0cyA9IFtdXG5cdCMgX29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHQjIOWboENyZWF0b3IuZ2V0T2JqZWN05Ye95pWw5YaF6YOo6KaB6LCD55So6K+l5Ye95pWw77yM5omA5Lul6L+Z6YeM5LiN5Y+v5Lul6LCD55SoQ3JlYXRvci5nZXRPYmplY3Tlj5blr7nosaHvvIzlj6rog73osIPnlKhDcmVhdG9yLk9iamVjdHPmnaXlj5blr7nosaFcblx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0aWYgIV9vYmplY3Rcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cdFxuXHRyZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Rcblx0aWYgTWV0ZW9yLmlzQ2xpZW50ICYmICFfLmlzRW1wdHkgcmVsYXRlZExpc3Rcblx0XHRyZWxhdGVkTGlzdE1hcCA9IHt9XG5cdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0LCAob2JqTmFtZSktPlxuXHRcdFx0aWYgXy5pc09iamVjdCBvYmpOYW1lXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWUub2JqZWN0TmFtZV0gPSB7fVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtvYmpOYW1lXSA9IHt9XG5cdFx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XG5cdFx0XHRcdGlmIChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgcmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWUgYW5kIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cdFx0XHRcdFx0IyDlvZNyZWxhdGVkX29iamVjdC5maWVsZHPkuK3mnInkuKTkuKrmiJbku6XkuIrnmoTlrZfmrrXmjIflkJFvYmplY3RfbmFtZeihqOekuueahOWvueixoeaXtu+8jOS8mOWFiOWPluesrOS4gOS4quS9nOS4uuWklumUruWFs+ezu+Wtl+aute+8jOS9huaYr3JlbGF0ZWRfZmllbGTkuLrkuLvlrZDooajml7blvLrooYzopobnm5bkuYvliY3nmoRyZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXeWAvFxuXHRcdFx0XHRcdGlmIF8uaXNFbXB0eSByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCJcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0geyBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddID0geyBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCIgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0geyBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiIH1cblx0XHRfLmVhY2ggWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIChlbmFibGVPYmpOYW1lKS0+XG5cdFx0XHRpZiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHsgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXVxuXHRcdFx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxuXHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHsgb2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0cmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMgcmVsYXRlZExpc3RNYXBcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cblx0aWYgX29iamVjdC5lbmFibGVfZmlsZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJ9XG5cblx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcblx0XHRcdCMgY2ZzLmZpbGVzLmZpbGVyZWNvcmTlr7nosaHlnKjnrKzkuozmrKHngrnlh7vnmoTml7blgJlyZWxhdGVkX29iamVjdOi/lOWbnueahOaYr2FwcC1idWlsZGVy5Lit55qEXCJtZXRhZGF0YS5wYXJlbnRcIuWtl+auteiiq+WIoOmZpOS6hu+8jOiusOWIsG1ldGFkYXRh5a2X5q6155qEc3ViX2ZpZWxkc+S4reS6hu+8jOaJgOS7peimgeWNleeLrOWkhOeQhuOAglxuXHRcdFx0c2ZzRmlsZXNPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpXG5cdFx0XHRzZnNGaWxlc09iamVjdCAmJiByZWxhdGVkX29iamVjdCA9IHNmc0ZpbGVzT2JqZWN0XG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcblx0XHRcdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcIm9iamVjdF9maWVsZHNcIlxuXHRcdFx0XHRcdCNUT0RPIOW+heebuOWFs+WIl+ihqOaUr+aMgeaOkuW6j+WQju+8jOWIoOmZpOatpOWIpOaWrVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWV9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkfVxuXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwidGFza3NcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ub3Rlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfZXZlbnRzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiZXZlbnRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIn1cblx0aWYgX29iamVjdC5lbmFibGVfYXBwcm92YWxzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfcHJvY2Vzc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcInByb2Nlc3NfaW5zdGFuY2VfaGlzdG9yeVwiLCBmb3JlaWduX2tleTogXCJ0YXJnZXRfb2JqZWN0XCJ9XG5cdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4Fcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblxuXHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSAodXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUXG5cdGVsc2Vcblx0XHRpZiAhKHVzZXJJZCBhbmQgc3BhY2VJZClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdHN1RmllbGRzID0ge25hbWU6IDEsIG1vYmlsZTogMSwgcG9zaXRpb246IDEsIGVtYWlsOiAxLCBjb21wYW55OiAxLCBvcmdhbml6YXRpb246IDEsIHNwYWNlOiAxLCBjb21wYW55X2lkOiAxLCBjb21wYW55X2lkczogMX1cblx0XHQjIGNoZWNrIGlmIHVzZXIgaW4gdGhlIHNwYWNlXG5cdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcblx0XHRpZiAhc3Vcblx0XHRcdHNwYWNlSWQgPSBudWxsXG5cblx0XHQjIGlmIHNwYWNlSWQgbm90IGV4aXN0cywgZ2V0IHRoZSBmaXJzdCBvbmUuXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdGlmIGlzVW5TYWZlTW9kZVxuXHRcdFx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXG5cdFx0XHRcdGlmICFzdVxuXHRcdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHRcdHNwYWNlSWQgPSBzdS5zcGFjZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0VVNFUl9DT05URVhUID0ge31cblx0XHRVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkXG5cdFx0VVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkXG5cdFx0VVNFUl9DT05URVhULnVzZXIgPSB7XG5cdFx0XHRfaWQ6IHVzZXJJZFxuXHRcdFx0bmFtZTogc3UubmFtZSxcblx0XHRcdG1vYmlsZTogc3UubW9iaWxlLFxuXHRcdFx0cG9zaXRpb246IHN1LnBvc2l0aW9uLFxuXHRcdFx0ZW1haWw6IHN1LmVtYWlsXG5cdFx0XHRjb21wYW55OiBzdS5jb21wYW55XG5cdFx0XHRjb21wYW55X2lkOiBzdS5jb21wYW55X2lkXG5cdFx0XHRjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcblx0XHR9XG5cdFx0c3BhY2VfdXNlcl9vcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpPy5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbilcblx0XHRpZiBzcGFjZV91c2VyX29yZ1xuXHRcdFx0VVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuXHRcdFx0XHRfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcblx0XHRcdFx0bmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcblx0XHRcdFx0ZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG5cdFx0XHR9XG5cdFx0cmV0dXJuIFVTRVJfQ09OVEVYVFxuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gKHVybCktPlxuXG5cdGlmIF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAodXJsPy5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpKVxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxuXHRcdHJldHVybiB1cmxcblxuXHRpZiB1cmxcblx0XHQjIHVybOW8gOWktOayoeaciVwiL1wi77yM6ZyA6KaB5re75YqgXCIvXCJcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybFxuXHRlbHNlXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVhcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gKHVzZXJJZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcblx0ZWxzZVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZDoxfX0pXG5cdHJldHVybiBzdS5jb21wYW55X2lkXG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSAodXNlcklkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxuXHRlbHNlXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkczoxfX0pXG5cdHJldHVybiBzdT8uY29tcGFueV9pZHNcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSAocG8pLT5cblx0aWYgcG8uYWxsb3dDcmVhdGVcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLmFsbG93RWRpdFxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8uYWxsb3dEZWxldGVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby52aWV3QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0cG8udmlld0FsbFJlY29yZHMgPSB0cnVlXG5cdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHRcblx0IyDlpoLmnpzpmYTku7bnm7jlhbPmnYPpmZDphY3nva7kuLrnqbrvvIzliJnlhbzlrrnkuYvliY3msqHmnInpmYTku7bmnYPpmZDphY3nva7ml7bnmoTop4TliJlcblx0aWYgcG8uYWxsb3dSZWFkXG5cdFx0dHlwZW9mIHBvLmFsbG93UmVhZEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby52aWV3QWxsRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8udmlld0FsbEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0VkaXRcblx0XHR0eXBlb2YgcG8uYWxsb3dDcmVhdGVGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0NyZWF0ZUZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby5hbGxvd0VkaXRGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHR0eXBlb2YgcG8uYWxsb3dEZWxldGVGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0dHlwZW9mIHBvLm1vZGlmeUFsbEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLm1vZGlmeUFsbEZpbGVzID0gdHJ1ZVxuXG5cdGlmIHBvLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0RmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dEZWxldGVGaWxlc1xuXHRcdHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZVxuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby52aWV3QWxsRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZVxuXHRcdHBvLnZpZXdBbGxGaWxlcyA9IHRydWVcblxuXHRyZXR1cm4gcG9cblxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSAoKS0+XG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWRcblxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9ICgpLT5cblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkXG5cbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gKHNwYWNlSWQpLT5cblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWQgPT0gc3BhY2VJZFxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gKHNwYWNlSWQpLT5cblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5jbG91ZEFkbWluU3BhY2VJZCA9PSBzcGFjZUlkXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUlxuXHQiLCJ2YXIgRmliZXI7XG5cbkNyZWF0b3IuZGVwcyA9IHtcbiAgYXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5LFxuICBvYmplY3Q6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcbn07XG5cbkNyZWF0b3IuX1RFTVBMQVRFID0ge1xuICBBcHBzOiB7fSxcbiAgT2JqZWN0czoge31cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgcmV0dXJuIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xufSk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcbiAgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmxvYWRPYmplY3RzKG9iaiwgb2JqZWN0X25hbWUpO1xuICAgIH0pLnJ1bigpO1xuICB9O1xufVxuXG5DcmVhdG9yLmxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmoubmFtZTtcbiAgfVxuICBpZiAoIW9iai5saXN0X3ZpZXdzKSB7XG4gICAgb2JqLmxpc3Rfdmlld3MgPSB7fTtcbiAgfVxuICBpZiAob2JqLnNwYWNlKSB7XG4gICAgb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iaik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lID09PSAnY2ZzX2ZpbGVzX2ZpbGVyZWNvcmQnKSB7XG4gICAgb2JqZWN0X25hbWUgPSAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnO1xuICAgIG9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICBvYmoubmFtZSA9IG9iamVjdF9uYW1lO1xuICAgIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0gPSBvYmo7XG4gIH1cbiAgQ3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iaik7XG4gIG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuICBDcmVhdG9yLmluaXRUcmlnZ2VycyhvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdC5zcGFjZSkge1xuICAgIHJldHVybiBcImNfXCIgKyBvYmplY3Quc3BhY2UgKyBcIl9cIiArIG9iamVjdC5uYW1lO1xuICB9XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKSB7XG4gIHZhciByZWYsIHJlZjE7XG4gIGlmIChfLmlzQXJyYXkob2JqZWN0X25hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoKHJlZiA9IENyZWF0b3IuZGVwcykgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWYxID0gcmVmLm9iamVjdCkgIT0gbnVsbCkge1xuICAgICAgICByZWYxLmRlcGVuZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gZnVuY3Rpb24ob2JqZWN0X2lkKSB7XG4gIHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtcbiAgICBfaWQ6IG9iamVjdF9pZFxuICB9KTtcbn07XG5cbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgY29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpO1xuICBkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1soKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5fY29sbGVjdGlvbl9uYW1lIDogdm9pZCAwKSB8fCBvYmplY3RfbmFtZV07XG4gIH1cbn07XG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgcmVmLCByZWYxLCBzcGFjZTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIikpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYikgIT0gbnVsbCA/IHJlZjEuZmluZE9uZShzcGFjZUlkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhZG1pbnM6IDFcbiAgICB9XG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBpZiAoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmFkbWlucyA6IHZvaWQgMCkge1xuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgaWYgKCFfLmlzU3RyaW5nKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBmb3JtdWxhcjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gZm9ybXVsYXI7XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGNvbnRleHQpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBzZWxlY3RvciA9IHt9O1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGFjdGlvbiwgbmFtZSwgdmFsdWU7XG4gICAgaWYgKChmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5sZW5ndGggOiB2b2lkIDApID09PSAzKSB7XG4gICAgICBuYW1lID0gZmlsdGVyWzBdO1xuICAgICAgYWN0aW9uID0gZmlsdGVyWzFdO1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpO1xuICAgICAgc2VsZWN0b3JbbmFtZV0gPSB7fTtcbiAgICAgIHJldHVybiBzZWxlY3RvcltuYW1lXVthY3Rpb25dID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICByZXR1cm4gc3BhY2VJZCA9PT0gJ2NvbW1vbic7XG59O1xuXG5cbi8qXG5cdGRvY3PvvJrlvoXmjpLluo/nmoTmlofmoaPmlbDnu4Rcblx0aWRz77yaX2lk6ZuG5ZCIXG5cdGlkX2tleTog6buY6K6k5Li6X2lkXG5cdHJldHVybiDmjInnhadpZHPnmoTpobrluo/ov5Tlm57mlrDnmoTmlofmoaPpm4blkIhcbiAqL1xuXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IGZ1bmN0aW9uKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpIHtcbiAgdmFyIHZhbHVlcztcbiAgaWYgKCFpZF9rZXkpIHtcbiAgICBpZF9rZXkgPSBcIl9pZFwiO1xuICB9XG4gIGlmIChoaXRfZmlyc3QpIHtcbiAgICB2YWx1ZXMgPSBkb2NzLmdldFByb3BlcnR5KGlkX2tleSk7XG4gICAgcmV0dXJuIF8uc29ydEJ5KGRvY3MsIGZ1bmN0aW9uKGRvYykge1xuICAgICAgdmFyIF9pbmRleDtcbiAgICAgIF9pbmRleCA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKTtcbiAgICAgIGlmIChfaW5kZXggPiAtMSkge1xuICAgICAgICByZXR1cm4gX2luZGV4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF8uc29ydEJ5KGRvY3MsIGZ1bmN0aW9uKGRvYykge1xuICAgICAgcmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKTtcbiAgICB9KTtcbiAgfVxufTtcblxuXG4vKlxuXHTmjInnlKjmiLfmiYDlsZ7mnKzlnLDljJbor63oqIDov5vooYzmjpLluo/vvIzmlK/mjIHkuK3mlofjgIHmlbDlgLzjgIHml6XmnJ/nrYnlrZfmrrXmjpLluo9cblx05a+55LqOT2JqZWN057G75Z6L77yM5aaC5p6c5o+Q5L6b5L2c55So5Z+f5Lita2V55bGe5oCn77yM5YiZ5Y+W5YC85Li6dmFsdWVba2V5Xei/m+ihjOaOkuW6j+avlOi+g++8jOWPjeS5i+aVtOS4qk9iamVjdC50b1N0cmluZygp5ZCO5o6S5bqP5q+U6L6DXG4gKi9cblxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gZnVuY3Rpb24odmFsdWUxLCB2YWx1ZTIpIHtcbiAgdmFyIGlzVmFsdWUxRW1wdHksIGlzVmFsdWUyRW1wdHksIGxvY2FsZTtcbiAgaWYgKHRoaXMua2V5KSB7XG4gICAgdmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XTtcbiAgICB2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldO1xuICB9XG4gIGlmICh2YWx1ZTEgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodmFsdWUyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZTEgPT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHZhbHVlMiA9PT0gXCJudW1iZXJcIikge1xuICAgIHJldHVybiB2YWx1ZTEgLSB2YWx1ZTI7XG4gIH1cbiAgaXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PT0gbnVsbCB8fCB2YWx1ZTEgPT09IHZvaWQgMDtcbiAgaXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PT0gbnVsbCB8fCB2YWx1ZTIgPT09IHZvaWQgMDtcbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgIWlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGlmICghaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgcmV0dXJuIHZhbHVlMS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUodmFsdWUyLnRvU3RyaW5nKCksIGxvY2FsZSk7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIHBlcm1pc3Npb25zLCByZWxhdGVkTGlzdCwgcmVsYXRlZExpc3RNYXAsIHJlbGF0ZWRfb2JqZWN0cztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICBpZiAoIV9vYmplY3QpIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xuICB9XG4gIHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5KHJlbGF0ZWRMaXN0KSkge1xuICAgIHJlbGF0ZWRMaXN0TWFwID0ge307XG4gICAgXy5lYWNoKHJlbGF0ZWRMaXN0LCBmdW5jdGlvbihvYmpOYW1lKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChvYmpOYW1lKSkge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbb2JqTmFtZS5vYmplY3ROYW1lXSA9IHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWVdID0ge307XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lICYmIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdKSB7XG4gICAgICAgICAgaWYgKF8uaXNFbXB0eShyZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXSB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0ge1xuICAgICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSxcbiAgICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSkge1xuICAgICAgcmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgICB9O1xuICAgIH1cbiAgICBfLmVhY2goWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIGZ1bmN0aW9uKGVuYWJsZU9iak5hbWUpIHtcbiAgICAgIGlmIChyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSkge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsXG4gICAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10pIHtcbiAgICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgICByZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddID0ge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMocmVsYXRlZExpc3RNYXApO1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2ZpbGVzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgIH0pO1xuICB9XG4gIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgdmFyIHNmc0ZpbGVzT2JqZWN0O1xuICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpIHtcbiAgICAgIHNmc0ZpbGVzT2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QoXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiKTtcbiAgICAgIHNmc0ZpbGVzT2JqZWN0ICYmIChyZWxhdGVkX29iamVjdCA9IHNmc0ZpbGVzT2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgaWYgKChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RfZmllbGRzXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnNwbGljZSgwLCAwLCB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Rhc2tzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwidGFza3NcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ub3Rlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcIm5vdGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZXZlbnRzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiZXZlbnRzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfaW5zdGFuY2VzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfYXBwcm92YWxzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiYXBwcm92YWxzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfcHJvY2Vzcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInByb2Nlc3NfaW5zdGFuY2VfaGlzdG9yeVwiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwidGFyZ2V0X29iamVjdFwiXG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgaWYgKF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIChwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMCkpIHtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKSB7XG4gIHZhciBVU0VSX0NPTlRFWFQsIHJlZiwgc3BhY2VfdXNlcl9vcmcsIHN1LCBzdUZpZWxkcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiBDcmVhdG9yLlVTRVJfQ09OVEVYVDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoISh1c2VySWQgJiYgc3BhY2VJZCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzdUZpZWxkcyA9IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBtb2JpbGU6IDEsXG4gICAgICBwb3NpdGlvbjogMSxcbiAgICAgIGVtYWlsOiAxLFxuICAgICAgY29tcGFueTogMSxcbiAgICAgIG9yZ2FuaXphdGlvbjogMSxcbiAgICAgIHNwYWNlOiAxLFxuICAgICAgY29tcGFueV9pZDogMSxcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfTtcbiAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgIH0pO1xuICAgIGlmICghc3UpIHtcbiAgICAgIHNwYWNlSWQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIGlmIChpc1VuU2FmZU1vZGUpIHtcbiAgICAgICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXN1KSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3BhY2VJZCA9IHN1LnNwYWNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIFVTRVJfQ09OVEVYVCA9IHt9O1xuICAgIFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWQ7XG4gICAgVVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkO1xuICAgIFVTRVJfQ09OVEVYVC51c2VyID0ge1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBuYW1lOiBzdS5uYW1lLFxuICAgICAgbW9iaWxlOiBzdS5tb2JpbGUsXG4gICAgICBwb3NpdGlvbjogc3UucG9zaXRpb24sXG4gICAgICBlbWFpbDogc3UuZW1haWwsXG4gICAgICBjb21wYW55OiBzdS5jb21wYW55LFxuICAgICAgY29tcGFueV9pZDogc3UuY29tcGFueV9pZCxcbiAgICAgIGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuICAgIH07XG4gICAgc3BhY2VfdXNlcl9vcmcgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKSkgIT0gbnVsbCA/IHJlZi5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbikgOiB2b2lkIDA7XG4gICAgaWYgKHNwYWNlX3VzZXJfb3JnKSB7XG4gICAgICBVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG4gICAgICAgIF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuICAgICAgICBmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBVU0VSX0NPTlRFWFQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgaWYgKF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAoKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCIvYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcImFzc2V0c1wiKSA6IHZvaWQgMCkgfHwgKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCIvcGFja2FnZXNcIikgOiB2b2lkIDApKSkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgaWYgKHVybCkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1LmNvbXBhbnlfaWQ7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UgIT0gbnVsbCA/IHN1LmNvbXBhbnlfaWRzIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSBmdW5jdGlvbihwbykge1xuICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0RlbGV0ZSkge1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0FsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd1JlYWQpIHtcbiAgICB0eXBlb2YgcG8uYWxsb3dSZWFkRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd1JlYWRGaWxlcyA9IHRydWUpO1xuICAgIHR5cGVvZiBwby52aWV3QWxsRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby52aWV3QWxsRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgdHlwZW9mIHBvLmFsbG93Q3JlYXRlRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd0NyZWF0ZUZpbGVzID0gdHJ1ZSk7XG4gICAgdHlwZW9mIHBvLmFsbG93RWRpdEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlKTtcbiAgICB0eXBlb2YgcG8uYWxsb3dEZWxldGVGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgIHR5cGVvZiBwby5tb2RpZnlBbGxGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLm1vZGlmeUFsbEZpbGVzID0gdHJ1ZSk7XG4gIH1cbiAgaWYgKHBvLmFsbG93Q3JlYXRlRmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0RlbGV0ZUZpbGVzKSB7XG4gICAgcG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlO1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0FsbEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWU7XG4gICAgcG8udmlld0FsbEZpbGVzID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcG87XG59O1xuXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSO1xufVxuIiwiTWV0ZW9yLm1ldGhvZHNcblx0IyDnlKjmiLfojrflj5Zsb29rdXAg44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteeahOmAiemhueWAvFxuXHRcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogKG9wdGlvbnMpLT5cblx0XHRpZiBvcHRpb25zPy5wYXJhbXM/LnJlZmVyZW5jZV90b1xuXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKVxuXG5cdFx0XHRuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXG5cdFx0XHRxdWVyeSA9IHt9XG5cdFx0XHRpZiBvcHRpb25zLnBhcmFtcy5zcGFjZVxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cblx0XHRcdFx0c29ydCA9IG9wdGlvbnM/LnNvcnRcblxuXHRcdFx0XHRzZWxlY3RlZCA9IG9wdGlvbnM/LnNlbGVjdGVkIHx8IFtdXG5cblx0XHRcdFx0b3B0aW9uc19saW1pdCA9IG9wdGlvbnM/Lm9wdGlvbnNfbGltaXQgfHwgMTBcblxuXHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7JHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHR9XG5cblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319LCBzZWFyY2hUZXh0UXVlcnldXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX1dXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpXG5cdFx0XHRcdFx0cXVlcnkuX2lkID0geyRuaW46IHNlbGVjdGVkfVxuXG5cdFx0XHRcdGNvbGxlY3Rpb24gPSBvYmplY3QuZGJcblxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XG5cdFx0XHRcdFx0Xy5leHRlbmQgcXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnlcblxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiBvcHRpb25zX2xpbWl0fVxuXG5cdFx0XHRcdGlmIHNvcnQgJiYgXy5pc09iamVjdChzb3J0KVxuXHRcdFx0XHRcdHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnRcblxuXHRcdFx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRyZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpXG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gW11cblx0XHRcdFx0XHRcdF8uZWFjaCByZWNvcmRzLCAocmVjb3JkKS0+XG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaFxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlY29yZC5faWRcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzXG5cdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxuXHRcdHJldHVybiBbXSAiLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGUsIG5hbWVfZmllbGRfa2V5LCBvYmplY3QsIG9wdGlvbnNfbGltaXQsIHF1ZXJ5LCBxdWVyeV9vcHRpb25zLCByZWNvcmRzLCByZWYsIHJlZjEsIHJlc3VsdHMsIHNlYXJjaFRleHRRdWVyeSwgc2VsZWN0ZWQsIHNvcnQ7XG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYgPSBvcHRpb25zLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpO1xuICAgICAgbmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLnNwYWNlKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2U7XG4gICAgICAgIHNvcnQgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNvcnQgOiB2b2lkIDA7XG4gICAgICAgIHNlbGVjdGVkID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc2VsZWN0ZWQgOiB2b2lkIDApIHx8IFtdO1xuICAgICAgICBvcHRpb25zX2xpbWl0ID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMub3B0aW9uc19saW1pdCA6IHZvaWQgMCkgfHwgMTA7XG4gICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0ge1xuICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmMSA9IG9wdGlvbnMudmFsdWVzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIHNlYXJjaFRleHRRdWVyeVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgJG5pbjogc2VsZWN0ZWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbGxlY3Rpb24gPSBvYmplY3QuZGI7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlclF1ZXJ5KSB7XG4gICAgICAgICAgXy5leHRlbmQocXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXJ5X29wdGlvbnMgPSB7XG4gICAgICAgICAgbGltaXQ6IG9wdGlvbnNfbGltaXRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNvcnQgJiYgXy5pc09iamVjdChzb3J0KSkge1xuICAgICAgICAgIHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKTtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChyZWNvcmRzLCBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5faWRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvd29ya2Zsb3cvdmlldy86aW5zdGFuY2VJZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxuXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxuXHRcdG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWVcblx0XHRyZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWRcblx0XHRzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkXG5cblx0XHRjaGVjayBvYmplY3RfbmFtZSwgU3RyaW5nXG5cdFx0Y2hlY2sgcmVjb3JkX2lkLCBTdHJpbmdcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXG5cblx0XHRpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZFxuXHRcdHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ11cblx0XHR4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddXG5cblx0XHRyZWRpcmVjdF91cmwgPSBcIi9cIlxuXHRcdGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZClcblx0XHQjIC0g5oiR55qE6I2J56i/5bCx6Lez6L2s6Iez6I2J56i/566xXG5cdFx0IyAtIOaIkeeahOW+heWuoeaguOWwsei3s+i9rOiHs+W+heWuoeaguFxuXHRcdCMgLSDkuI3mmK/miJHnmoTnlLPor7fljZXliJnot7Povazoh7PmiZPljbDpobXpnaJcblx0XHQjIC0g5aaC55Sz6K+35Y2V5LiN5a2Y5Zyo5YiZ5o+Q56S655So5oi355Sz6K+35Y2V5bey5Yig6Zmk77yM5bm25LiU5pu05pawcmVjb3Jk55qE54q25oCB77yM5L2/55So5oi35Y+v5Lul6YeN5paw5Y+R6LW35a6h5om5XG5cdFx0aWYgaW5zXG5cdFx0XHRib3ggPSAnJ1xuXHRcdFx0c3BhY2VJZCA9IGlucy5zcGFjZVxuXHRcdFx0Zmxvd0lkID0gaW5zLmZsb3dcblxuXHRcdFx0aWYgKGlucy5pbmJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKSBvciAoaW5zLmNjX3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdGJveCA9ICdpbmJveCdcblx0XHRcdGVsc2UgaWYgaW5zLm91dGJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkXG5cdFx0XHRcdGJveCA9ICdvdXRib3gnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnZHJhZnQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxuXHRcdFx0XHRib3ggPSAnZHJhZnQnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAncGVuZGluZycgYW5kIChpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZCBvciBpbnMuYXBwbGljYW50IGlzIGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0Ym94ID0gJ3BlbmRpbmcnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnY29tcGxldGVkJyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcblx0XHRcdFx0Ym94ID0gJ2NvbXBsZXRlZCdcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDpqozor4Fsb2dpbiB1c2VyX2lk5a+56K+l5rWB56iL5pyJ566h55CG44CB6KeC5a+f55Sz6K+35Y2V55qE5p2D6ZmQXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHsgZmllbGRzOiB7IGFkbWluczogMSB9IH0pXG5cdFx0XHRcdGlmIHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgb3IgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJtb25pdG9yXCIpIG9yIHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdFx0Ym94ID0gJ21vbml0b3InXG5cdFx0XHR3b3JrZmxvd1VybCA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXM/LndvcmtmbG93Py51cmxcblx0XHRcdGlmIGJveFxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgXCJ3b3JrZmxvdy9zcGFjZS8je3NwYWNlSWR9LyN7Ym94fS8je2luc0lkfT9YLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgXCJ3b3JrZmxvdy9zcGFjZS8je3NwYWNlSWR9L3ByaW50LyN7aW5zSWR9P2JveD1tb25pdG9yJnByaW50X2lzX3Nob3dfdHJhY2VzPTEmcHJpbnRfaXNfc2hvd19hdHRhY2htZW50cz0xJlgtVXNlci1JZD0je3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSN7eF9hdXRoX3Rva2VufVwiXG5cblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogMjAwXG5cdFx0XHRcdGRhdGE6IHsgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmwgfVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXG5cdFx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRcdGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xuXHRcdFx0XHRcdCR1bnNldDoge1xuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZXNcIjogMSxcblx0XHRcdFx0XHRcdFwiaW5zdGFuY2Vfc3RhdGVcIjogMSxcblx0XHRcdFx0XHRcdFwibG9ja2VkXCI6IDFcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3InLCAn55Sz6K+35Y2V5bey5Yig6ZmkJylcblxuXHRjYXRjaCBlXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxuXHRcdH1cblxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJveCwgY29sbGVjdGlvbiwgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgZmxvd0lkLCBoYXNoRGF0YSwgaW5zLCBpbnNJZCwgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25zLCByZWNvcmRfaWQsIHJlZGlyZWN0X3VybCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCBzcGFjZSwgc3BhY2VJZCwgc3BhY2VfaWQsIHdvcmtmbG93VXJsLCB4X2F1dGhfdG9rZW4sIHhfdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWU7XG4gICAgcmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkO1xuICAgIHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWQ7XG4gICAgY2hlY2sob2JqZWN0X25hbWUsIFN0cmluZyk7XG4gICAgY2hlY2socmVjb3JkX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkO1xuICAgIHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgeF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXTtcbiAgICByZWRpcmVjdF91cmwgPSBcIi9cIjtcbiAgICBpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpO1xuICAgIGlmIChpbnMpIHtcbiAgICAgIGJveCA9ICcnO1xuICAgICAgc3BhY2VJZCA9IGlucy5zcGFjZTtcbiAgICAgIGZsb3dJZCA9IGlucy5mbG93O1xuICAgICAgaWYgKCgocmVmID0gaW5zLmluYm94X3VzZXJzKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHx8ICgocmVmMSA9IGlucy5jY191c2VycykgIT0gbnVsbCA/IHJlZjEuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgYm94ID0gJ2luYm94JztcbiAgICAgIH0gZWxzZSBpZiAoKHJlZjIgPSBpbnMub3V0Ym94X3VzZXJzKSAhPSBudWxsID8gcmVmMi5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSB7XG4gICAgICAgIGJveCA9ICdvdXRib3gnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdkcmFmdCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdkcmFmdCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ3BlbmRpbmcnICYmIChpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQgfHwgaW5zLmFwcGxpY2FudCA9PT0gY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICBib3ggPSAncGVuZGluZyc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2NvbXBsZXRlZCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdjb21wbGV0ZWQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpO1xuICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGFkbWluczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIHx8IHBlcm1pc3Npb25zLmluY2x1ZGVzKFwibW9uaXRvclwiKSB8fCBzcGFjZS5hZG1pbnMuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICAgIGJveCA9ICdtb25pdG9yJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgd29ya2Zsb3dVcmwgPSAocmVmMyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcykgIT0gbnVsbCA/IChyZWY0ID0gcmVmMy53b3JrZmxvdykgIT0gbnVsbCA/IHJlZjQudXJsIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGJveCkge1xuICAgICAgICByZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgKFwid29ya2Zsb3cvc3BhY2UvXCIgKyBzcGFjZUlkICsgXCIvXCIgKyBib3ggKyBcIi9cIiArIGluc0lkICsgXCI/WC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9wcmludC9cIiArIGluc0lkICsgXCI/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH1cbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKTtcbiAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xuICAgICAgICAgICR1bnNldDoge1xuICAgICAgICAgICAgXCJpbnN0YW5jZXNcIjogMSxcbiAgICAgICAgICAgIFwiaW5zdGFuY2Vfc3RhdGVcIjogMSxcbiAgICAgICAgICAgIFwibG9ja2VkXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKSAtPlxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpPy5fc2NoZW1hXG5cdGNvbHVtbl9udW0gPSAwXG5cdGlmIF9zY2hlbWFcblx0XHRfLmVhY2ggY29sdW1ucywgKGZpZWxkX25hbWUpIC0+XG5cdFx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxuXHRcdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxuXHRcdFx0aWYgaXNfd2lkZVxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDJcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y29sdW1uX251bSArPSAxXG5cblx0XHRpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtXG5cdFx0cmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudFxuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSAtPlxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWFcblx0aWYgX3NjaGVtYVxuXHRcdGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpXG5cdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxuXHRcdHJldHVybiBpc193aWRlXG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIC0+XG5cdHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zPy5zZXR0aW5ncz8uZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wifSlcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBfLm1hcCBjb2x1bW5zLCAoY29sdW1uKS0+XG5cdFx0ZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl1cblx0XHRpZiBmaWVsZD8udHlwZSBhbmQgIWZpZWxkLmhpZGRlblxuXHRcdFx0cmV0dXJuIGNvbHVtblxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0Y29sdW1ucyA9IF8uY29tcGFjdCBjb2x1bW5zXG5cdGlmIHNldHRpbmcgYW5kIHNldHRpbmcuc2V0dGluZ3Ncblx0XHRzb3J0ID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdPy5zb3J0IHx8IFtdXG5cdFx0c29ydCA9IF8ubWFwIHNvcnQsIChvcmRlciktPlxuXHRcdFx0a2V5ID0gb3JkZXJbMF1cblx0XHRcdGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSlcblx0XHRcdG9yZGVyWzBdID0gaW5kZXggKyAxXG5cdFx0XHRyZXR1cm4gb3JkZXJcblx0XHRyZXR1cm4gc29ydFxuXHRyZXR1cm4gW11cblxuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXG5cdGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXVxuXHRkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdXG5cdGlmIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xuXHRcdGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uIGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xuXG5cdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW11cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0Q3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHM/W29iamVjdF9uYW1lXSA9IFtdXG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gKGRlZmF1bHRfdmlldywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSktPlxuXHRkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/LmNvbHVtbnNcblx0ZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldz8ubW9iaWxlX2NvbHVtbnNcblx0dW5sZXNzIGxpc3Rfdmlld1xuXHRcdHJldHVyblxuXHRvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KVxuXHRpZiAhXy5oYXMob2l0ZW0sIFwibmFtZVwiKVxuXHRcdG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZVxuXHRpZiAhb2l0ZW0uY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRfY29sdW1uc1xuXHRcdFx0b2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1uc1xuXHRpZiAhb2l0ZW0uY29sdW1uc1xuXHRcdG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdXG5cdGlmICFvaXRlbS5tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcblx0XHRcdG9pdGVtLm1vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF9tb2JpbGVfY29sdW1uc1xuXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpXG5cdFx0XHRvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJylcblxuXG5cdGlmICFvaXRlbS5maWx0ZXJfc2NvcGVcblx0XHQjIGxpc3R2aWV36KeG5Zu+55qEZmlsdGVyX3Njb3Bl6buY6K6k5YC85pS55Li6c3BhY2UgIzEzMVxuXHRcdG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIlxuXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJfaWRcIilcblx0XHRvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZVxuXHRlbHNlXG5cdFx0b2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZVxuXG5cdGlmIF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucylcblx0XHRvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKVxuXG5cdF8uZm9yRWFjaCBvaXRlbS5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cblx0XHRpZiAhXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXG5cdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXG5cdHJldHVybiBvaXRlbVxuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gKG9iamVjdF9uYW1lKS0+XG5cdFx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0XHRyZXR1cm5cblx0XHRyZWxhdGVkTGlzdE9iamVjdHMgPSB7fVxuXHRcdHJlbGF0ZWRMaXN0TmFtZXMgPSBbXVxuXHRcdG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyA9IFtdO1xuXHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiBfb2JqZWN0XG5cdFx0XHRsYXlvdXRSZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZF9saXN0cztcblx0XHRcdCMgbGF5b3V0UmVsYXRlZExpc3Qg5piv5pWw57uE5bCx6KGo56S66YWN572u6L+H6aG16Z2i5biD5bGA77yM5bCx5ZCv55So6aG16Z2i5biD5bGA55qE55u45YWz5a2Q6KGo44CCXG5cdFx0XHRpZiBfLmlzQXJyYXkgbGF5b3V0UmVsYXRlZExpc3Rcblx0XHRcdFx0Xy5lYWNoIGxheW91dFJlbGF0ZWRMaXN0LCAoaXRlbSktPlxuXHRcdFx0XHRcdHJlT2JqZWN0TmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdFx0cmVGaWVsZE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gQ3JlYXRvci5nZXRPYmplY3QocmVPYmplY3ROYW1lKT8uZmllbGRzW3JlRmllbGROYW1lXT8ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiByZU9iamVjdE5hbWVcblx0XHRcdFx0XHRcdGNvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXNcblx0XHRcdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzXG5cdFx0XHRcdFx0XHRpc19maWxlOiByZU9iamVjdE5hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uOiBpdGVtLmZpbHRlcnNcblx0XHRcdFx0XHRcdHNvcnQ6IGl0ZW0uc29ydFxuXHRcdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiByZUZpZWxkTmFtZVxuXHRcdFx0XHRcdFx0Y3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWVcblx0XHRcdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXHRcdFx0XHRcdFx0bGFiZWw6IGl0ZW0ubGFiZWxcblx0XHRcdFx0XHRcdGFjdGlvbnM6IGl0ZW0uYnV0dG9uc1xuXHRcdFx0XHRcdFx0dmlzaWJsZV9vbjogaXRlbS52aXNpYmxlX29uXG5cdFx0XHRcdFx0XHRwYWdlX3NpemU6IGl0ZW0ucGFnZV9zaXplXG5cdFx0XHRcdFx0b2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLnB1c2gocmVsYXRlZClcblx0XHRcdFx0cmV0dXJuIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cztcblx0XHRcdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxuXHRcdFx0aWYgIV8uaXNFbXB0eSByZWxhdGVkTGlzdFxuXHRcdFx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpPck5hbWUpLT5cblx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0IG9iak9yTmFtZVxuXHRcdFx0XHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmpPck5hbWUub2JqZWN0TmFtZVxuXHRcdFx0XHRcdFx0XHRjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1uc1xuXHRcdFx0XHRcdFx0XHRtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdFx0XHRcdGlzX2ZpbGU6IG9iak9yTmFtZS5vYmplY3ROYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdFx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uOiBvYmpPck5hbWUuZmlsdGVyc1xuXHRcdFx0XHRcdFx0XHRzb3J0OiBvYmpPck5hbWUuc29ydFxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6ICcnXG5cdFx0XHRcdFx0XHRcdGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlXG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBvYmpPck5hbWUubGFiZWxcblx0XHRcdFx0XHRcdFx0YWN0aW9uczogb2JqT3JOYW1lLmFjdGlvbnNcblx0XHRcdFx0XHRcdFx0cGFnZV9zaXplOiBvYmpPck5hbWUucGFnZV9zaXplXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE9iamVjdHNbb2JqT3JOYW1lLm9iamVjdE5hbWVdID0gcmVsYXRlZFxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3ROYW1lcy5wdXNoIG9iak9yTmFtZS5vYmplY3ROYW1lXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzU3RyaW5nIG9iak9yTmFtZVxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3ROYW1lcy5wdXNoIG9iak9yTmFtZVxuXG5cdFx0bWFwTGlzdCA9IHt9XG5cdFx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3RfaXRlbSkgLT5cblx0XHRcdGlmICFyZWxhdGVkX29iamVjdF9pdGVtPy5vYmplY3RfbmFtZVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5XG5cdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSlcblx0XHRcdHVubGVzcyByZWxhdGVkX29iamVjdFxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cblx0XHRcdGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxuXHRcdFx0bW9iaWxlX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRydWUpIHx8IFtcIm5hbWVcIl1cblx0XHRcdG1vYmlsZV9jb2x1bW5zID0gXy53aXRob3V0KG1vYmlsZV9jb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpXG5cblx0XHRcdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKVxuXHRcdFx0dGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucylcblxuXHRcdFx0aWYgL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpXG5cdFx0XHRcdCMgb2JqZWN057G75Z6L5bim5a2Q5bGe5oCn55qEcmVsYXRlZF9maWVsZF9uYW1l6KaB5Y675o6J5Lit6Ze055qE576O5YWD56ym5Y+377yM5ZCm5YiZ5pi+56S65LiN5Ye65a2X5q615YC8XG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLFwiXCIpXG5cdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0b2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWVcblx0XHRcdFx0Y29sdW1uczogY29sdW1uc1xuXHRcdFx0XHRtb2JpbGVfY29sdW1uczogbW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiByZWxhdGVkX2ZpZWxkX25hbWVcblx0XHRcdFx0aXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXG5cdFx0XHRyZWxhdGVkT2JqZWN0ID0gcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuY29sdW1uc1xuXHRcdFx0XHRcdHJlbGF0ZWQuY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QuY29sdW1uc1xuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdFx0cmVsYXRlZC5tb2JpbGVfY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5zb3J0XG5cdFx0XHRcdFx0cmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uXG5cdFx0XHRcdFx0cmVsYXRlZC5maWx0ZXJzRnVuY3Rpb24gPSByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvblxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XG5cdFx0XHRcdFx0cmVsYXRlZC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCA9IHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Rcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5sYWJlbFxuXHRcdFx0XHRcdHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QucGFnZV9zaXplXG5cdFx0XHRcdFx0cmVsYXRlZC5wYWdlX3NpemUgPSByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZVxuXHRcdFx0XHRkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cblx0XHRcdG1hcExpc3RbcmVsYXRlZC5vYmplY3RfbmFtZV0gPSByZWxhdGVkXG5cblxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKVxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHNcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcblx0XHRfLmVhY2ggcmVsYXRlZExpc3RPYmplY3RzLCAodiwgcmVsYXRlZF9vYmplY3RfbmFtZSkgLT5cblx0XHRcdGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xXG5cdFx0XHRhbGxvd1JlYWQgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmFsbG93UmVhZFxuXHRcdFx0aWYgaXNBY3RpdmUgJiYgYWxsb3dSZWFkXG5cdFx0XHRcdG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2XG5cblx0XHRsaXN0ID0gW11cblx0XHRpZiBfLmlzRW1wdHkgcmVsYXRlZExpc3ROYW1lc1xuXHRcdFx0bGlzdCA9ICBfLnZhbHVlcyBtYXBMaXN0XG5cdFx0ZWxzZVxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0TmFtZXMsIChvYmplY3ROYW1lKSAtPlxuXHRcdFx0XHRpZiBtYXBMaXN0W29iamVjdE5hbWVdXG5cdFx0XHRcdFx0bGlzdC5wdXNoIG1hcExpc3Rbb2JqZWN0TmFtZV1cblxuXHRcdGlmIF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpXG5cdFx0XHRsaXN0ID0gXy5maWx0ZXIgbGlzdCwgKGl0ZW0pLT5cblx0XHRcdFx0cmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKVxuXG5cdFx0cmV0dXJuIGxpc3RcblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gKG9iamVjdF9uYW1lKS0+XG5cdHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSlcblxuIyMjIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiMjI1xuQ3JlYXRvci5nZXRMaXN0VmlldyA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRyZXR1cm5cblx0bGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXG5cdHVubGVzcyBsaXN0Vmlld3M/Lmxlbmd0aFxuXHRcdHJldHVyblxuXHRsaXN0X3ZpZXcgPSBfLmZpbmQobGlzdFZpZXdzLCAoaXRlbSktPiByZXR1cm4gaXRlbS5faWQgPT0gbGlzdF92aWV3X2lkIHx8IGl0ZW0ubmFtZSA9PSBsaXN0X3ZpZXdfaWQpXG5cdHVubGVzcyBsaXN0X3ZpZXdcblx0XHQjIOWmguaenOS4jemcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOWImem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvu+8jOWPjeS5i+i/lOWbnuepulxuXHRcdGlmIGV4YWNcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXVxuXHRyZXR1cm4gbGlzdF92aWV3XG5cbiPojrflj5ZsaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77mmK/lkKbmmK/mnIDov5Hmn6XnnIvop4blm75cbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0aWYgdHlwZW9mKGxpc3Rfdmlld19pZCkgPT0gXCJzdHJpbmdcIlxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmICFvYmplY3Rcblx0XHRcdHJldHVyblxuXHRcdGxpc3RWaWV3ID0gXy5maW5kV2hlcmUob2JqZWN0Lmxpc3Rfdmlld3Mse19pZDogbGlzdF92aWV3X2lkfSlcblx0ZWxzZVxuXHRcdGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkXG5cdHJldHVybiBsaXN0Vmlldz8ubmFtZSA9PSBcInJlY2VudFwiXG5cblxuIyMjXG4gICAg5LuOY29sdW1uc+WPguaVsOS4rei/h+a7pOWHuueUqOS6juaJi+acuuerr+aYvuekuueahGNvbHVtbnNcblx06KeE5YiZ77yaXG5cdDEu5LyY5YWI5oqKY29sdW1uc+S4reeahG5hbWXlrZfmrrXmjpLlnKjnrKzkuIDkuKpcblx0Mi7mnIDlpJrlj6rov5Tlm5405Liq5a2X5q61XG5cdDMu6ICD6JmR5a695a2X5q615Y2g55So5pW06KGM6KeE5YiZ5p2h5Lu25LiL77yM5pyA5aSa5Y+q6L+U5Zue5Lik6KGMXG4jIyNcbkNyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpLT5cblx0cmVzdWx0ID0gW11cblx0bWF4Um93cyA9IDIgXG5cdG1heENvdW50ID0gbWF4Um93cyAqIDJcblx0Y291bnQgPSAwXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRmaWVsZHMgPSBvYmplY3QuZmllbGRzXG5cdHVubGVzcyBvYmplY3Rcblx0XHRyZXR1cm4gY29sdW1uc1xuXHRuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cdGlzTmFtZUNvbHVtbiA9IChpdGVtKS0+XG5cdFx0aWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0cmV0dXJuIGl0ZW0uZmllbGQgPT0gbmFtZUtleVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBpdGVtID09IG5hbWVLZXlcblx0Z2V0RmllbGQgPSAoaXRlbSktPlxuXHRcdGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdHJldHVybiBmaWVsZHNbaXRlbS5maWVsZF1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gZmllbGRzW2l0ZW1dXG5cdGlmIG5hbWVLZXlcblx0XHRuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kIChpdGVtKS0+XG5cdFx0XHRyZXR1cm4gaXNOYW1lQ29sdW1uKGl0ZW0pXG5cdGlmIG5hbWVDb2x1bW5cblx0XHRmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pXG5cdFx0aXRlbUNvdW50ID0gaWYgZmllbGQuaXNfd2lkZSB0aGVuIDIgZWxzZSAxXG5cdFx0Y291bnQgKz0gaXRlbUNvdW50XG5cdFx0cmVzdWx0LnB1c2ggbmFtZUNvbHVtblxuXHRjb2x1bW5zLmZvckVhY2ggKGl0ZW0pLT5cblx0XHRmaWVsZCA9IGdldEZpZWxkKGl0ZW0pXG5cdFx0dW5sZXNzIGZpZWxkXG5cdFx0XHRyZXR1cm5cblx0XHRpdGVtQ291bnQgPSBpZiBmaWVsZC5pc193aWRlIHRoZW4gMiBlbHNlIDFcblx0XHRpZiBjb3VudCA8IG1heENvdW50IGFuZCByZXN1bHQubGVuZ3RoIDwgbWF4Q291bnQgYW5kICFpc05hbWVDb2x1bW4oaXRlbSlcblx0XHRcdGNvdW50ICs9IGl0ZW1Db3VudFxuXHRcdFx0aWYgY291bnQgPD0gbWF4Q291bnRcblx0XHRcdFx0cmVzdWx0LnB1c2ggaXRlbVxuXHRcblx0cmV0dXJuIHJlc3VsdFxuXG4jIyNcbiAgICDojrflj5bpu5jorqTop4blm75cbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IChvYmplY3RfbmFtZSktPlxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0aWYgb2JqZWN0Py5saXN0X3ZpZXdzPy5kZWZhdWx0XG5cdFx0I1RPRE8g5q2k5Luj56CB5Y+q5piv5pqC5pe25YW85a655Lul5YmNY29kZeS4reWumuS5ieeahGRlZmF1bHTop4blm77vvIzlvoVjb2Rl5Lit55qEZGVmYXVsdOa4heeQhuWujOaIkOWQju+8jOmcgOimgeWIoOmZpOatpOS7o+eggVxuXHRcdGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3MuZGVmYXVsdFxuXHRlbHNlXG5cdFx0Xy5lYWNoIG9iamVjdD8ubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KS0+XG5cdFx0XHRpZiBsaXN0X3ZpZXcubmFtZSA9PSBcImFsbFwiIHx8IGtleSA9PSBcImFsbFwiXG5cdFx0XHRcdGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3XG5cdHJldHVybiBkZWZhdWx0VmlldztcblxuIyMjXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k5pi+56S65a2X5q61XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMgPSAob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucyktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBkZWZhdWx0Vmlldz8uY29sdW1uc1xuXHRpZiB1c2VfbW9iaWxlX2NvbHVtbnNcblx0XHRpZiBkZWZhdWx0Vmlldz8ubW9iaWxlX2NvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1uc1xuXHRcdGVsc2UgaWYgY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpXG5cdHJldHVybiBjb2x1bW5zXG5cbiMjI1xuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOesrOS4gOS4quinhuWbvuaYvuekuueahOWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zID0gKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBkZWZhdWx0Vmlldz8uY29sdW1uc1xuXHRpZiB1c2VfbW9iaWxlX2NvbHVtbnNcblx0XHRpZiBkZWZhdWx0Vmlldz8ubW9iaWxlX2NvbHVtbnNcblx0XHRcdGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1uc1xuXHRcdGVsc2UgaWYgY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpXG5cdHJldHVybiBjb2x1bW5zXG5cbiMjI1xuXHTojrflj5blr7nosaHnmoTliJfooajpu5jorqTpop3lpJbliqDovb3nmoTlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0cmV0dXJuIGRlZmF1bHRWaWV3Py5leHRyYV9jb2x1bW5zXG5cbiMjI1xuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydCA9IChvYmplY3RfbmFtZSktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpXG5cdGlmIGRlZmF1bHRWaWV3XG5cdFx0aWYgZGVmYXVsdFZpZXcuc29ydFxuXHRcdFx0cmV0dXJuIGRlZmF1bHRWaWV3LnNvcnRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gW1tcImNyZWF0ZWRcIiwgXCJkZXNjXCJdXVxuXG5cbiMjI1xuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XG4jIyNcbkNyZWF0b3IuaXNBbGxWaWV3ID0gKGxpc3RfdmlldyktPlxuXHRyZXR1cm4gbGlzdF92aWV3Py5uYW1lID09IFwiYWxsXCJcblxuIyMjXG4gICAg5Yik5pat5piv5ZCm5pyA6L+R5p+l55yLIHZpZXdcbiMjI1xuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSAobGlzdF92aWV3KS0+XG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJyZWNlbnRcIlxuXG4jIyNcbiAgICDlsIZzb3J06L2s5o2i5Li6VGFidWxhcuaOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuIyMjXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSAoc29ydCwgdGFidWxhckNvbHVtbnMpLT5cblx0dGFidWxhcl9zb3J0ID0gW11cblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXG5cdFx0XHQjIOWFvOWuueaXp+eahOaVsOaNruagvOW8j1tbXCJmaWVsZF9uYW1lXCIsIFwib3JkZXJcIl1dXG5cdFx0XHRpZiBpdGVtLmxlbmd0aCA9PSAxXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBcImFzY1wiXVxuXHRcdFx0ZWxzZSBpZiBpdGVtLmxlbmd0aCA9PSAyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBpdGVtWzFdXVxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxuXHRcdFx0XHRjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpXG5cdFx0XHRcdGlmIGNvbHVtbl9pbmRleCA+IC0xXG5cdFx0XHRcdFx0dGFidWxhcl9zb3J0LnB1c2ggW2NvbHVtbl9pbmRleCwgb3JkZXJdXG5cblx0cmV0dXJuIHRhYnVsYXJfc29ydFxuXG4jIyNcbiAgICDlsIZzb3J06L2s5o2i5Li6RGV2RXhwcmVzc+aOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuIyMjXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gKHNvcnQpLT5cblx0ZHhfc29ydCA9IFtdXG5cdF8uZWFjaCBzb3J0LCAoaXRlbSktPlxuXHRcdGlmIF8uaXNBcnJheShpdGVtKVxuXHRcdFx0I+WFvOWuueaXp+agvOW8j++8mltbXCJmaWVsZF9uYW1lXCIsIFwib3JkZXJcIl1dXG5cdFx0XHRkeF9zb3J0LnB1c2goaXRlbSlcblx0XHRlbHNlIGlmIF8uaXNPYmplY3QoaXRlbSlcblx0XHRcdCPmlrDmlbDmja7moLzlvI/vvJpbe2ZpZWxkX25hbWU6ICwgb3JkZXI6IH1dXG5cdFx0XHRmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lXG5cdFx0XHRvcmRlciA9IGl0ZW0ub3JkZXJcblx0XHRcdGlmIGZpZWxkX25hbWUgJiYgb3JkZXJcblx0XHRcdFx0ZHhfc29ydC5wdXNoIFtmaWVsZF9uYW1lLCBvcmRlcl1cblxuXHRyZXR1cm4gZHhfc29ydFxuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIF9zY2hlbWEsIGNvbHVtbl9udW0sIGluaXRfd2lkdGhfcGVyY2VudCwgcmVmO1xuICBfc2NoZW1hID0gKHJlZiA9IENyZWF0b3IuZ2V0U2NoZW1hKG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5fc2NoZW1hIDogdm9pZCAwO1xuICBjb2x1bW5fbnVtID0gMDtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBfLmVhY2goY29sdW1ucywgZnVuY3Rpb24oZmllbGRfbmFtZSkge1xuICAgICAgdmFyIGZpZWxkLCBpc193aWRlLCByZWYxLCByZWYyO1xuICAgICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgICBpc193aWRlID0gKHJlZjEgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZjIuaXNfd2lkZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc193aWRlKSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29sdW1uX251bSArPSAxO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW07XG4gICAgcmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRGaWVsZElzV2lkZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSB7XG4gIHZhciBfc2NoZW1hLCBmaWVsZCwgaXNfd2lkZSwgcmVmLCByZWYxO1xuICBfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWE7XG4gIGlmIChfc2NoZW1hKSB7XG4gICAgZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSk7XG4gICAgaXNfd2lkZSA9IChyZWYgPSBmaWVsZFtmaWVsZF9uYW1lXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMS5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIHJldHVybiBpc193aWRlO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFRhYnVsYXJPcmRlciA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIHtcbiAgdmFyIG9iaiwgcmVmLCByZWYxLCByZWYyLCBzZXR0aW5nLCBzb3J0O1xuICBzZXR0aW5nID0gKHJlZiA9IENyZWF0b3IuQ29sbGVjdGlvbnMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5zZXR0aW5ncykgIT0gbnVsbCA/IHJlZjEuZmluZE9uZSh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJcbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IF8ubWFwKGNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgIHZhciBmaWVsZDtcbiAgICBmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXTtcbiAgICBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC50eXBlIDogdm9pZCAwKSAmJiAhZmllbGQuaGlkZGVuKSB7XG4gICAgICByZXR1cm4gY29sdW1uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgfSk7XG4gIGNvbHVtbnMgPSBfLmNvbXBhY3QoY29sdW1ucyk7XG4gIGlmIChzZXR0aW5nICYmIHNldHRpbmcuc2V0dGluZ3MpIHtcbiAgICBzb3J0ID0gKChyZWYyID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdKSAhPSBudWxsID8gcmVmMi5zb3J0IDogdm9pZCAwKSB8fCBbXTtcbiAgICBzb3J0ID0gXy5tYXAoc29ydCwgZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgIHZhciBpbmRleCwga2V5O1xuICAgICAga2V5ID0gb3JkZXJbMF07XG4gICAgICBpbmRleCA9IF8uaW5kZXhPZihjb2x1bW5zLCBrZXkpO1xuICAgICAgb3JkZXJbMF0gPSBpbmRleCArIDE7XG4gICAgICByZXR1cm4gb3JkZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuQ3JlYXRvci5pbml0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucywgZXh0cmFfY29sdW1ucywgb2JqZWN0LCBvcmRlciwgcmVmO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdO1xuICBleHRyYV9jb2x1bW5zID0gW1wib3duZXJcIl07XG4gIGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl07XG4gIGlmIChkZWZhdWx0X2V4dHJhX2NvbHVtbnMpIHtcbiAgICBleHRyYV9jb2x1bW5zID0gXy51bmlvbihleHRyYV9jb2x1bW5zLCBkZWZhdWx0X2V4dHJhX2NvbHVtbnMpO1xuICB9XG4gIG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW107XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICByZXR1cm4gKHJlZiA9IENyZWF0b3IuVGFidWxhclNlbGVjdGVkSWRzKSAhPSBudWxsID8gcmVmW29iamVjdF9uYW1lXSA9IFtdIDogdm9pZCAwO1xuICB9XG59O1xuXG5DcmVhdG9yLmNvbnZlcnRMaXN0VmlldyA9IGZ1bmN0aW9uKGRlZmF1bHRfdmlldywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSkge1xuICB2YXIgZGVmYXVsdF9jb2x1bW5zLCBkZWZhdWx0X21vYmlsZV9jb2x1bW5zLCBvaXRlbTtcbiAgZGVmYXVsdF9jb2x1bW5zID0gZGVmYXVsdF92aWV3ICE9IG51bGwgPyBkZWZhdWx0X3ZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldyAhPSBudWxsID8gZGVmYXVsdF92aWV3Lm1vYmlsZV9jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIHJldHVybjtcbiAgfVxuICBvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KTtcbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpKSB7XG4gICAgb2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lO1xuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X2NvbHVtbnMpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMgPSBkZWZhdWx0X2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uY29sdW1ucykge1xuICAgIG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdO1xuICB9XG4gIGlmICghb2l0ZW0ubW9iaWxlX2NvbHVtbnMpIHtcbiAgICBpZiAoZGVmYXVsdF9tb2JpbGVfY29sdW1ucykge1xuICAgICAgb2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpKSB7XG4gICAgICBvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJyk7XG4gICAgfVxuICB9XG4gIGlmICghb2l0ZW0uZmlsdGVyX3Njb3BlKSB7XG4gICAgb2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiO1xuICB9XG4gIGlmICghXy5oYXMob2l0ZW0sIFwiX2lkXCIpKSB7XG4gICAgb2l0ZW0uX2lkID0gbGlzdF92aWV3X25hbWU7XG4gIH0gZWxzZSB7XG4gICAgb2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZTtcbiAgfVxuICBpZiAoXy5pc1N0cmluZyhvaXRlbS5vcHRpb25zKSkge1xuICAgIG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpO1xuICB9XG4gIF8uZm9yRWFjaChvaXRlbS5maWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIsIF9pbmRleCkge1xuICAgIGlmICghXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2l0ZW07XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVsYXRlZExpc3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciBfb2JqZWN0LCBsYXlvdXRSZWxhdGVkTGlzdCwgbGlzdCwgbWFwTGlzdCwgb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLCBwZXJtaXNzaW9ucywgcmVsYXRlZExpc3QsIHJlbGF0ZWRMaXN0TmFtZXMsIHJlbGF0ZWRMaXN0T2JqZWN0cywgcmVsYXRlZF9vYmplY3RfbmFtZXMsIHJlbGF0ZWRfb2JqZWN0cywgc3BhY2VJZCwgdW5yZWxhdGVkX29iamVjdHMsIHVzZXJJZDtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlbGF0ZWRMaXN0T2JqZWN0cyA9IHt9O1xuICAgIHJlbGF0ZWRMaXN0TmFtZXMgPSBbXTtcbiAgICBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMgPSBbXTtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICBsYXlvdXRSZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZF9saXN0cztcbiAgICAgIGlmIChfLmlzQXJyYXkobGF5b3V0UmVsYXRlZExpc3QpKSB7XG4gICAgICAgIF8uZWFjaChsYXlvdXRSZWxhdGVkTGlzdCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHZhciByZUZpZWxkTmFtZSwgcmVPYmplY3ROYW1lLCByZWYsIHJlZjEsIHJlbGF0ZWQsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgICAgICAgIHJlT2JqZWN0TmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIHJlRmllbGROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QocmVPYmplY3ROYW1lKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmZpZWxkc1tyZUZpZWxkTmFtZV0pICE9IG51bGwgPyByZWYxLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVPYmplY3ROYW1lLFxuICAgICAgICAgICAgY29sdW1uczogaXRlbS5maWVsZF9uYW1lcyxcbiAgICAgICAgICAgIG1vYmlsZV9jb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzLFxuICAgICAgICAgICAgaXNfZmlsZTogcmVPYmplY3ROYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICAgICAgZmlsdGVyc0Z1bmN0aW9uOiBpdGVtLmZpbHRlcnMsXG4gICAgICAgICAgICBzb3J0OiBpdGVtLnNvcnQsXG4gICAgICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlRmllbGROYW1lLFxuICAgICAgICAgICAgY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWUsXG4gICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQsXG4gICAgICAgICAgICBsYWJlbDogaXRlbS5sYWJlbCxcbiAgICAgICAgICAgIGFjdGlvbnM6IGl0ZW0uYnV0dG9ucyxcbiAgICAgICAgICAgIHZpc2libGVfb246IGl0ZW0udmlzaWJsZV9vbixcbiAgICAgICAgICAgIHBhZ2Vfc2l6ZTogaXRlbS5wYWdlX3NpemVcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMucHVzaChyZWxhdGVkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHM7XG4gICAgICB9XG4gICAgICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gICAgICBpZiAoIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICAgICAgXy5lYWNoKHJlbGF0ZWRMaXN0LCBmdW5jdGlvbihvYmpPck5hbWUpIHtcbiAgICAgICAgICB2YXIgcmVsYXRlZDtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChvYmpPck5hbWUpKSB7XG4gICAgICAgICAgICByZWxhdGVkID0ge1xuICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWUsXG4gICAgICAgICAgICAgIGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zLFxuICAgICAgICAgICAgICBtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zLFxuICAgICAgICAgICAgICBpc19maWxlOiBvYmpPck5hbWUub2JqZWN0TmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgICAgICAgZmlsdGVyc0Z1bmN0aW9uOiBvYmpPck5hbWUuZmlsdGVycyxcbiAgICAgICAgICAgICAgc29ydDogb2JqT3JOYW1lLnNvcnQsXG4gICAgICAgICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogJycsXG4gICAgICAgICAgICAgIGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlLFxuICAgICAgICAgICAgICBsYWJlbDogb2JqT3JOYW1lLmxhYmVsLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBvYmpPck5hbWUuYWN0aW9ucyxcbiAgICAgICAgICAgICAgcGFnZV9zaXplOiBvYmpPck5hbWUucGFnZV9zaXplXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWQ7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3ROYW1lcy5wdXNoKG9iak9yTmFtZS5vYmplY3ROYW1lKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIG1hcExpc3QgPSB7fTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdF9pdGVtKSB7XG4gICAgICB2YXIgY29sdW1ucywgbW9iaWxlX2NvbHVtbnMsIG9yZGVyLCByZWxhdGVkLCByZWxhdGVkT2JqZWN0LCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lLCB0YWJ1bGFyX29yZGVyLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgIGlmICghKHJlbGF0ZWRfb2JqZWN0X2l0ZW0gIT0gbnVsbCA/IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWUgOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lO1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleTtcbiAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZF9vYmplY3RfaXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIXJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXTtcbiAgICAgIG1vYmlsZV9jb2x1bW5zID0gXy53aXRob3V0KG1vYmlsZV9jb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgdGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucyk7XG4gICAgICBpZiAoL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpKSB7XG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLCBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgICBtb2JpbGVfY29sdW1uczogbW9iaWxlX2NvbHVtbnMsXG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICBpc19maWxlOiByZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgIH07XG4gICAgICByZWxhdGVkT2JqZWN0ID0gcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKHJlbGF0ZWRPYmplY3QpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY29sdW1ucykge1xuICAgICAgICAgIHJlbGF0ZWQuY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QuY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucykge1xuICAgICAgICAgIHJlbGF0ZWQubW9iaWxlX2NvbHVtbnMgPSByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LnNvcnQpIHtcbiAgICAgICAgICByZWxhdGVkLnNvcnQgPSByZWxhdGVkT2JqZWN0LnNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgcmVsYXRlZC5maWx0ZXJzRnVuY3Rpb24gPSByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCkge1xuICAgICAgICAgIHJlbGF0ZWQuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QgPSByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmxhYmVsKSB7XG4gICAgICAgICAgcmVsYXRlZC5sYWJlbCA9IHJlbGF0ZWRPYmplY3QubGFiZWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QucGFnZV9zaXplKSB7XG4gICAgICAgICAgcmVsYXRlZC5wYWdlX3NpemUgPSByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hcExpc3RbcmVsYXRlZC5vYmplY3RfbmFtZV0gPSByZWxhdGVkO1xuICAgIH0pO1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfLnZhbHVlcyhyZWxhdGVkTGlzdE9iamVjdHMpLCBcIm9iamVjdF9uYW1lXCIpO1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICB1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgXy5lYWNoKHJlbGF0ZWRMaXN0T2JqZWN0cywgZnVuY3Rpb24odiwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZjtcbiAgICAgIGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xO1xuICAgICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNBY3RpdmUgJiYgYWxsb3dSZWFkKSB7XG4gICAgICAgIHJldHVybiBtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsaXN0ID0gW107XG4gICAgaWYgKF8uaXNFbXB0eShyZWxhdGVkTGlzdE5hbWVzKSkge1xuICAgICAgbGlzdCA9IF8udmFsdWVzKG1hcExpc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gocmVsYXRlZExpc3ROYW1lcywgZnVuY3Rpb24ob2JqZWN0TmFtZSkge1xuICAgICAgICBpZiAobWFwTGlzdFtvYmplY3ROYW1lXSkge1xuICAgICAgICAgIHJldHVybiBsaXN0LnB1c2gobWFwTGlzdFtvYmplY3ROYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoX29iamVjdCwgJ2FsbG93X3JlbGF0ZWRMaXN0JykpIHtcbiAgICAgIGxpc3QgPSBfLmZpbHRlcihsaXN0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBfLmluY2x1ZGUoX29iamVjdC5hbGxvd19yZWxhdGVkTGlzdCwgaXRlbS5vYmplY3RfbmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH07XG59XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSk7XG59O1xuXG5cbi8qIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiAqL1xuXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYykge1xuICB2YXIgbGlzdFZpZXdzLCBsaXN0X3ZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgaWYgKCEobGlzdFZpZXdzICE9IG51bGwgPyBsaXN0Vmlld3MubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0X3ZpZXcgPSBfLmZpbmQobGlzdFZpZXdzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0uX2lkID09PSBsaXN0X3ZpZXdfaWQgfHwgaXRlbS5uYW1lID09PSBsaXN0X3ZpZXdfaWQ7XG4gIH0pO1xuICBpZiAoIWxpc3Rfdmlldykge1xuICAgIGlmIChleGFjKSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3RfdmlldyA9IGxpc3RWaWV3c1swXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxpc3Rfdmlldztcbn07XG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXdJc1JlY2VudCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpIHtcbiAgdmFyIGxpc3RWaWV3LCBvYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiBsaXN0X3ZpZXdfaWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmplY3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cywge1xuICAgICAgX2lkOiBsaXN0X3ZpZXdfaWRcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0VmlldyA9IGxpc3Rfdmlld19pZDtcbiAgfVxuICByZXR1cm4gKGxpc3RWaWV3ICE9IG51bGwgPyBsaXN0Vmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDku45jb2x1bW5z5Y+C5pWw5Lit6L+H5ruk5Ye655So5LqO5omL5py656uv5pi+56S655qEY29sdW1uc1xuXHTop4TliJnvvJpcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxuXHQyLuacgOWkmuWPqui/lOWbnjTkuKrlrZfmrrVcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcbiAqL1xuXG5DcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGNvbHVtbnMpIHtcbiAgdmFyIGNvdW50LCBmaWVsZCwgZmllbGRzLCBnZXRGaWVsZCwgaXNOYW1lQ29sdW1uLCBpdGVtQ291bnQsIG1heENvdW50LCBtYXhSb3dzLCBuYW1lQ29sdW1uLCBuYW1lS2V5LCBvYmplY3QsIHJlc3VsdDtcbiAgcmVzdWx0ID0gW107XG4gIG1heFJvd3MgPSAyO1xuICBtYXhDb3VudCA9IG1heFJvd3MgKiAyO1xuICBjb3VudCA9IDA7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgZmllbGRzID0gb2JqZWN0LmZpZWxkcztcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuICBuYW1lS2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZO1xuICBpc05hbWVDb2x1bW4gPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHJldHVybiBpdGVtLmZpZWxkID09PSBuYW1lS2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXRlbSA9PT0gbmFtZUtleTtcbiAgICB9XG4gIH07XG4gIGdldEZpZWxkID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW0uZmllbGRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmllbGRzW2l0ZW1dO1xuICAgIH1cbiAgfTtcbiAgaWYgKG5hbWVLZXkpIHtcbiAgICBuYW1lQ29sdW1uID0gY29sdW1ucy5maW5kKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKG5hbWVDb2x1bW4pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKG5hbWVDb2x1bW4pO1xuICAgIGl0ZW1Db3VudCA9IGZpZWxkLmlzX3dpZGUgPyAyIDogMTtcbiAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgcmVzdWx0LnB1c2gobmFtZUNvbHVtbik7XG4gIH1cbiAgY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBmaWVsZCA9IGdldEZpZWxkKGl0ZW0pO1xuICAgIGlmICghZmllbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbUNvdW50ID0gZmllbGQuaXNfd2lkZSA/IDIgOiAxO1xuICAgIGlmIChjb3VudCA8IG1heENvdW50ICYmIHJlc3VsdC5sZW5ndGggPCBtYXhDb3VudCAmJiAhaXNOYW1lQ29sdW1uKGl0ZW0pKSB7XG4gICAgICBjb3VudCArPSBpdGVtQ291bnQ7XG4gICAgICBpZiAoY291bnQgPD0gbWF4Q291bnQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W6buY6K6k6KeG5Zu+XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0Vmlldywgb2JqZWN0LCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICBvYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICB9XG4gIGlmIChvYmplY3QgIT0gbnVsbCA/IChyZWYgPSBvYmplY3QubGlzdF92aWV3cykgIT0gbnVsbCA/IHJlZltcImRlZmF1bHRcIl0gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICBkZWZhdWx0VmlldyA9IG9iamVjdC5saXN0X3ZpZXdzW1wiZGVmYXVsdFwiXTtcbiAgfSBlbHNlIHtcbiAgICBfLmVhY2gob2JqZWN0ICE9IG51bGwgPyBvYmplY3QubGlzdF92aWV3cyA6IHZvaWQgMCwgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcbiAgICAgIGlmIChsaXN0X3ZpZXcubmFtZSA9PT0gXCJhbGxcIiB8fCBrZXkgPT09IFwiYWxsXCIpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3ID0gbGlzdF92aWV3O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBkZWZhdWx0Vmlldztcbn07XG5cblxuLypcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucykge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKHVzZV9tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDApIHtcbiAgICAgIGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucztcbiAgICB9IGVsc2UgaWYgKGNvbHVtbnMpIHtcbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbHVtbnM7XG59O1xuXG5cbi8qXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo56ys5LiA5Liq6KeG5Zu+5pi+56S655qE5a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCB1c2VfbW9iaWxlX2NvbHVtbnMpIHtcbiAgdmFyIGNvbHVtbnMsIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyhvYmplY3RfbmFtZSk7XG4gIGNvbHVtbnMgPSBkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcuY29sdW1ucyA6IHZvaWQgMDtcbiAgaWYgKHVzZV9tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0VmlldyAhPSBudWxsID8gZGVmYXVsdFZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDApIHtcbiAgICAgIGNvbHVtbnMgPSBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucztcbiAgICB9IGVsc2UgaWYgKGNvbHVtbnMpIHtcbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLnBpY2tPYmplY3RNb2JpbGVDb2x1bW5zKG9iamVjdF9uYW1lLCBjb2x1bW5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbHVtbnM7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5leHRyYV9jb2x1bW5zIDogdm9pZCAwO1xufTtcblxuXG4vKlxuXHTojrflj5blr7nosaHnmoTpu5jorqTmjpLluo9cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICBpZiAoZGVmYXVsdFZpZXcpIHtcbiAgICBpZiAoZGVmYXVsdFZpZXcuc29ydCkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWaWV3LnNvcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpkFsbCB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc0FsbFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJhbGxcIjtcbn07XG5cblxuLypcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuICovXG5cbkNyZWF0b3IuaXNSZWNlbnRWaWV3ID0gZnVuY3Rpb24obGlzdF92aWV3KSB7XG4gIHJldHVybiAobGlzdF92aWV3ICE9IG51bGwgPyBsaXN0X3ZpZXcubmFtZSA6IHZvaWQgMCkgPT09IFwicmVjZW50XCI7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ulRhYnVsYXLmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb1RhYnVsYXIgPSBmdW5jdGlvbihzb3J0LCB0YWJ1bGFyQ29sdW1ucykge1xuICB2YXIgdGFidWxhcl9zb3J0O1xuICB0YWJ1bGFyX3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgY29sdW1uX2luZGV4LCBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBpZiAoaXRlbS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpdGVtLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgaXRlbVsxXV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBmaWVsZF9uYW1lID0gaXRlbS5maWVsZF9uYW1lO1xuICAgICAgb3JkZXIgPSBpdGVtLm9yZGVyO1xuICAgICAgaWYgKGZpZWxkX25hbWUgJiYgb3JkZXIpIHtcbiAgICAgICAgY29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihmaWVsZF9uYW1lKTtcbiAgICAgICAgaWYgKGNvbHVtbl9pbmRleCA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRhYnVsYXJfc29ydC5wdXNoKFtjb2x1bW5faW5kZXgsIG9yZGVyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGFidWxhcl9zb3J0O1xufTtcblxuXG4vKlxuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4gKi9cblxuQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9EWCA9IGZ1bmN0aW9uKHNvcnQpIHtcbiAgdmFyIGR4X3NvcnQ7XG4gIGR4X3NvcnQgPSBbXTtcbiAgXy5lYWNoKHNvcnQsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgZmllbGRfbmFtZSwgb3JkZXI7XG4gICAgaWYgKF8uaXNBcnJheShpdGVtKSkge1xuICAgICAgcmV0dXJuIGR4X3NvcnQucHVzaChpdGVtKTtcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICByZXR1cm4gZHhfc29ydC5wdXNoKFtmaWVsZF9uYW1lLCBvcmRlcl0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkeF9zb3J0O1xufTtcbiIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJylcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5zdGFydHVwICgpLT5cblx0XHRfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW11cblx0XHRfcmVnRXhNZXNzYWdlcy5wdXNoIHtleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wifVxuXHRcdFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG5cdFx0XHRyZWdFeDogX3JlZ0V4TWVzc2FnZXMsXG5cdFx0fSkiLCJTaW1wbGVTY2hlbWEuUmVnRXguY29kZSA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11bYS16QS1aMC05X10qJCcpO1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVnRXhNZXNzYWdlcztcbiAgICBfcmVnRXhNZXNzYWdlcyA9IFNpbXBsZVNjaGVtYS5fZ2xvYmFsTWVzc2FnZXMucmVnRXggfHwgW107XG4gICAgX3JlZ0V4TWVzc2FnZXMucHVzaCh7XG4gICAgICBleHA6IFNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jOS4lOWPquiDveWMheWQq+Wtl+avjeOAgeaVsOWtl+OAgV9cIlxuICAgIH0pO1xuICAgIHJldHVybiBTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuICAgICAgcmVnRXg6IF9yZWdFeE1lc3NhZ2VzXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLCBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJ9XG5cdFx0U2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5maWVsZCA9IG5ldyBSZWdFeHAoJ15bYS16QS1aX11cXFxcdyooXFxcXC5cXFxcJFxcXFwuXFxcXHcrKT9bYS16QS1aMC05XSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkLFxuICAgICAgbXNnOiBcIltsYWJlbF0g5Y+q6IO95Lul5a2X5q+N44CBX+W8gOWktO+8jC4kLuWJjeWQjuW/hemhu+WMheWQq+Wtl+esplwiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCIvLyDlm6DkuLptZXRlb3LnvJbor5Fjb2ZmZWVzY3JpcHTkvJrlr7zoh7RldmFs5Ye95pWw5oql6ZSZ77yM5omA5Lul5Y2V54us5YaZ5Zyo5LiA5LiqanPmlofku7bkuK3jgIJcbkNyZWF0b3IuZXZhbEluQ29udGV4dCA9IGZ1bmN0aW9uKGpzLCBjb250ZXh0KSB7XG4gICAgLy8jIFJldHVybiB0aGUgcmVzdWx0cyBvZiB0aGUgaW4tbGluZSBhbm9ueW1vdXMgZnVuY3Rpb24gd2UgLmNhbGwgd2l0aCB0aGUgcGFzc2VkIGNvbnRleHRcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7IFxuICAgIFx0cmV0dXJuIGV2YWwoanMpOyBcblx0fS5jYWxsKGNvbnRleHQpO1xufVxuXG5cbkNyZWF0b3IuZXZhbCA9IGZ1bmN0aW9uKGpzKXtcblx0dHJ5e1xuXHRcdHJldHVybiBldmFsKGpzKVxuXHR9Y2F0Y2ggKGUpe1xuXHRcdGNvbnNvbGUuZXJyb3IoZSwganMpO1xuXHR9XG59OyIsIlx0Z2V0T3B0aW9uID0gKG9wdGlvbiktPlxuXHRcdGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIilcblx0XHRpZiBmb28ubGVuZ3RoID4gMlxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdLCBjb2xvcjogZm9vWzJdfVxuXHRcdGVsc2UgaWYgZm9vLmxlbmd0aCA+IDFcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1sxXX1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMF19XG5cblx0Y29udmVydEZpZWxkID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCktPlxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiBzcGFjZUlkICYmIGZpZWxkLnR5cGUgPT0gJ3NlbGVjdCdcblx0XHRcdGNvZGUgPSBmaWVsZC5waWNrbGlzdCB8fCBcIiN7b2JqZWN0X25hbWV9LiN7ZmllbGRfbmFtZX1cIjtcblx0XHRcdGlmIGNvZGVcblx0XHRcdFx0cGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuXHRcdFx0XHRpZiBwaWNrbGlzdFxuXHRcdFx0XHRcdG9wdGlvbnMgPSBbXTtcblx0XHRcdFx0XHRhbGxPcHRpb25zID0gW107XG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gQ3JlYXRvci5nZXRQaWNrTGlzdE9wdGlvbnMocGlja2xpc3QpXG5cdFx0XHRcdFx0cGlja2xpc3RPcHRpb25zID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpPy5yZXZlcnNlKCk7XG5cdFx0XHRcdFx0Xy5lYWNoIHBpY2tsaXN0T3B0aW9ucywgKGl0ZW0pLT5cblx0XHRcdFx0XHRcdGxhYmVsID0gaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHRhbGxPcHRpb25zLnB1c2goe2xhYmVsOiBsYWJlbCwgdmFsdWU6IHZhbHVlLCBlbmFibGU6IGl0ZW0uZW5hYmxlLCBjb2xvcjogaXRlbS5jb2xvcn0pXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVuYWJsZVxuXHRcdFx0XHRcdFx0XHRvcHRpb25zLnB1c2goe2xhYmVsOiBsYWJlbCwgdmFsdWU6IHZhbHVlLCBjb2xvcjogaXRlbS5jb2xvcn0pXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmRlZmF1bHRcblx0XHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWVcblx0XHRcdFx0XHRpZiBvcHRpb25zLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBvcHRpb25zXG5cdFx0XHRcdFx0aWYgYWxsT3B0aW9ucy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRmaWVsZC5hbGxPcHRpb25zID0gYWxsT3B0aW9uc1xuXHRcdHJldHVybiBmaWVsZDtcblxuXHRDcmVhdG9yLmNvbnZlcnRPYmplY3QgPSAob2JqZWN0LCBzcGFjZUlkKS0+XG5cdFx0aWYgIW9iamVjdFxuXHRcdFx0cmV0dXJuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC50cmlnZ2VycywgKHRyaWdnZXIsIGtleSktPlxuXG5cdFx0XHRpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT0gXCJzZXJ2ZXJcIikgfHwgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCIpXG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXI/Ll90b2RvXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSB0cmlnZ2VyLnRvZG9cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxuXHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXG5cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXG5cdFx0XHRcdFx0I+WPquaciXVwZGF0ZeaXtu+8jCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyDmiY3mnInlgLxcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph4/vvIzlsKTlhbbmmK9Db2xsZWN0aW9uXG5cdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHRyaWdnZXIudG9kbyA9IENyZWF0b3IuZXZhbChcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpeyN7X3RvZG9fZnJvbV9kYn19KVwiKVxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiXG5cdFx0XHRcdF90b2RvID0gdHJpZ2dlci50b2RvXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcblx0XHRcdFx0XHR0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKVxuXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBrZXkpLT5cblxuXHRcdFx0XHRpZiBmaWVsZC5vbWl0XG5cdFx0XHRcdFx0IyBvbWl05a2X5q615a6M5YWo6ZqQ6JeP5LiN5pi+56S6XG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gdHJ1ZVxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlcXVpcmVkICYmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRcdFx0IyDpgJrnlKjlv4XloavlrZfmrrUgIzI5NTLvvIzlv4XloavlrZfmrrXorr7nva7kuLrpnZ7lj6ror7tcblx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IGZhbHNlXG5cblx0XHRcdFx0c3lzdGVtQmFzZUZpZWxkcyA9IENyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcygpXG5cdFx0XHRcdGlmIHN5c3RlbUJhc2VGaWVsZHMuaW5kZXhPZihrZXkpID4gLTFcblx0XHRcdFx0XHQjIOW8uuWItuWIm+W7uuS6uuWIm+W7uuaXtumXtOetieWtl+auteS4uuWPquivu1xuXHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxuXHRcdFx0XHRfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24/Ll90b2RvXG5cdFx0XHRcdF90b2RvX2Zyb21fZGIgPSBhY3Rpb24/LnRvZG9cblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9jb2RlICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9jb2RlKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2NvZGV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlXG5cdFx0XHRcdGlmIF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKVxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj1xuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tfdG9kb19mcm9tX2RifSlcIilcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSlcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGJcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gQ3JlYXRvci5ldmFsKFwiKGZ1bmN0aW9uKCl7I3tfdG9kb19mcm9tX2RifX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3JcblxuXHRcdFx0XHRfdmlzaWJsZSA9IGFjdGlvbj8uX3Zpc2libGVcblx0XHRcdFx0aWYgX3Zpc2libGVcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvci5ldmFsKFwiKCN7X3Zpc2libGV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGVcblx0XHRlbHNlXG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LmFjdGlvbnMsIChhY3Rpb24sIGtleSktPlxuXHRcdFx0XHRfdG9kbyA9IGFjdGlvbj8udG9kb1xuXHRcdFx0XHRpZiBfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0YWN0aW9uLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKVxuXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy52aXNpYmxlXG5cblx0XHRcdFx0aWYgX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKVxuXHRcdFx0XHRcdGFjdGlvbi5fdmlzaWJsZSA9IF92aXNpYmxlLnRvU3RyaW5nKClcblxuXHRcdF8uZm9yRWFjaCBvYmplY3QuZmllbGRzLCAoZmllbGQsIGtleSktPlxuXG5cdFx0XHRmaWVsZCA9IGNvbnZlcnRGaWVsZChvYmplY3QubmFtZSwga2V5LCBmaWVsZCwgc3BhY2VJZCk7XG5cblx0XHRcdGlmIGZpZWxkLm9wdGlvbnMgJiYgXy5pc1N0cmluZyhmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdFx0I+aUr+aMgVxcbuaIluiAheiLseaWh+mAl+WPt+WIhuWJsixcblx0XHRcdFx0XHRfLmZvckVhY2ggZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgKG9wdGlvbiktPlxuXHRcdFx0XHRcdFx0aWYgb3B0aW9uLmluZGV4T2YoXCIsXCIpXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMgPSBvcHRpb24uc3BsaXQoXCIsXCIpXG5cdFx0XHRcdFx0XHRcdF8uZm9yRWFjaCBvcHRpb25zLCAoX29wdGlvbiktPlxuXHRcdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xuXHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yXG5cblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiBfLmlzQXJyYXkoZmllbGQub3B0aW9ucylcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0X29wdGlvbnMgPSBbXVxuXHRcdFx0XHRcdCPmlK/mjIHmlbDnu4TkuK3nm7TmjqXlrprkuYnmr4/kuKrpgInpobnnmoTnroDniYjmoLzlvI/lrZfnrKbkuLJcblx0XHRcdFx0XHRfLmZvckVhY2ggZmllbGQub3B0aW9ucywgKG9wdGlvbiktPlxuXHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhvcHRpb24pXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2gob3B0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9uc1xuXHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yXG5cblx0XHRcdGVsc2UgaWYgZmllbGQub3B0aW9ucyAmJiAhXy5pc0Z1bmN0aW9uKGZpZWxkLm9wdGlvbnMpICYmICFfLmlzQXJyYXkoZmllbGQub3B0aW9ucykgJiYgXy5pc09iamVjdChmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdF8uZWFjaCBmaWVsZC5vcHRpb25zLCAodiwgayktPlxuXHRcdFx0XHRcdF9vcHRpb25zLnB1c2gge2xhYmVsOiB2LCB2YWx1ZToga31cblx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRvcHRpb25zID0gZmllbGQub3B0aW9uc1xuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNGdW5jdGlvbihvcHRpb25zKVxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zID0gZmllbGQub3B0aW9ucy50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9uc1xuXHRcdFx0XHRpZiBvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucylcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLm9wdGlvbnMgPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0cmVnRXggPSBmaWVsZC5yZWdFeFxuXHRcdFx0XHRpZiByZWdFeFxuXHRcdFx0XHRcdGZpZWxkLl9yZWdFeCA9IGZpZWxkLnJlZ0V4LnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVnRXggPSBmaWVsZC5fcmVnRXhcblx0XHRcdFx0aWYgcmVnRXhcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLnJlZ0V4ID0gQ3JlYXRvci5ldmFsKFwiKCN7cmVnRXh9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRtaW4gPSBmaWVsZC5taW5cblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKG1pbilcblx0XHRcdFx0XHRmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0bWluID0gZmllbGQuX21pblxuXHRcdFx0XHRpZiBfLmlzU3RyaW5nKG1pbilcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLm1pbiA9IENyZWF0b3IuZXZhbChcIigje21pbn0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG1heCA9IGZpZWxkLm1heFxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWF4KVxuXHRcdFx0XHRcdGZpZWxkLl9tYXggPSBtYXgudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtYXggPSBmaWVsZC5fbWF4XG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWF4KVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQubWF4ID0gQ3JlYXRvci5ldmFsKFwiKCN7bWF4fSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aWYgZmllbGQuYXV0b2Zvcm1cblx0XHRcdFx0XHRfdHlwZSA9IGZpZWxkLmF1dG9mb3JtLnR5cGVcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzRnVuY3Rpb24oX3R5cGUpICYmIF90eXBlICE9IE9iamVjdCAmJiBfdHlwZSAhPSBTdHJpbmcgJiYgX3R5cGUgIT0gTnVtYmVyICYmIF90eXBlICE9IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSlcblx0XHRcdFx0XHRcdGZpZWxkLmF1dG9mb3JtLl90eXBlID0gX3R5cGUudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxuXHRcdFx0XHRcdF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGVcblx0XHRcdFx0XHRpZiBfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKVxuXHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdGZpZWxkLmF1dG9mb3JtLnR5cGUgPSBDcmVhdG9yLmV2YWwoXCIoI3tfdHlwZX0pXCIpXG5cdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBmaWVsZCAtPiB0eXBlIGVycm9yXCIsIGZpZWxkLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRcdFx0XHRvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cdFx0XHRcdGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0YmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gPSBvcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKVxuXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90byAmJiBfLmlzRnVuY3Rpb24ocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKVxuXG5cdFx0XHRcdGlmIGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihjcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5fY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbi50b1N0cmluZygpXG5cdFx0XHRcdGlmIGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oYmVmb3JlT3BlbkZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKVxuXG5cdFx0XHRcdGlmIGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gPSBmaWx0ZXJzRnVuY3Rpb24udG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gfHwgZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cdFx0XHRcdHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG9cblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5fY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0YmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvblxuXHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5vcHRpb25zRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tvcHRpb25zRnVuY3Rpb259KVwiKVxuXG5cdFx0XHRcdGlmIHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWZlcmVuY2VfdG99KVwiKVxuXG5cdFx0XHRcdGlmIGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yLmV2YWwoXCIoI3tjcmVhdGVGdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2JlZm9yZU9wZW5GdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlcnNGdW5jdGlvbn0pXCIpXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpXG5cdFx0XHRcdFx0ZmllbGQuX2RlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWVcblxuXHRcdFx0XHRpZiAhZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cblx0XHRcdFx0aWYgZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZGVmYXVsdFZhbHVlfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXHRcdFx0XG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKVxuXHRcdFx0XHRcdGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdGlmIGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZClcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9IENyZWF0b3IuZXZhbChcIigje2lzX2NvbXBhbnlfbGltaXRlZH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdF8uZm9yRWFjaCBvYmplY3QubGlzdF92aWV3cywgKGxpc3Rfdmlldywga2V5KSAtPlxuXHRcdFx0IyMjXG5cdFx0XHTop4blm77ov4fomZHlmajpnIDopoHmlK/mjIFmdW5jdGlvbu+8jOWQjuWPsOi9rOaIkOWtl+espuS4su+8jOWJjeWPsGV2YWzmiJDlh73mlbBcblx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG5cdFx0XHQxLiDmlbTkuKpmaWx0ZXJz5Li6ZnVuY3Rpb246XG5cdFx0XHTlpoLvvJpcblx0XHRcdGZpbHRlcnM6ICgpLT5cblx0XHRcdFx0cmV0dXJuIFtbW1wib2JqZWN0X25hbWVcIixcIj1cIixcInByb2plY3RfaXNzdWVzXCJdLCdvcicsW1wib2JqZWN0X25hbWVcIixcIj1cIixcInRhc2tzXCJdXV1cblx0XHRcdDIuIGZpbHRlcnPlhoXnmoRmaWx0ZXIudmFsdWXkuLpmdW5jdGlvblxuXHRcdFx05aaC77yaXG5cdFx0XHRmaWx0ZXJzOiBbW1wib2JqZWN0X25hbWVcIiwgXCI9XCIsICgpLT5cblx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuXHRcdFx0XV1cblx0XHRcdOaIllxuXHRcdFx0ZmlsdGVyczogW3tcblx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcblx0XHRcdFx0XCJvcGVyYXRpb25cIjogXCI9XCJcblx0XHRcdFx0XCJ2YWx1ZVwiOiAoKS0+XG5cdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuXHRcdFx0fV1cblx0XHRcdCMjI1xuXHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKVxuXHRcdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0XHRsaXN0X3ZpZXcuX2ZpbHRlcnMgPSBsaXN0X3ZpZXcuZmlsdGVycy50b1N0cmluZygpXG5cdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKVxuXHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRsaXN0X3ZpZXcuZmlsdGVycyA9IENyZWF0b3IuZXZhbChcIigje2xpc3Rfdmlldy5fZmlsdGVyc30pXCIpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdF8uZm9yRWFjaCBsaXN0X3ZpZXcuZmlsdGVycywgKGZpbHRlciwgX2luZGV4KS0+XG5cdFx0XHRcdFx0aWYgXy5pc0FycmF5KGZpbHRlcilcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDMgYW5kIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIubGVuZ3RoID09IDMgYW5kIF8uaXNEYXRlKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOaYr0RhdGXnsbvlnovvvIzliJlmaWx0ZXJbMl3lgLzliLDliY3nq6/kvJroh6rliqjovazmiJDlrZfnrKbkuLLvvIzmoLzlvI/vvJpcIjIwMTgtMDMtMjlUMDM6NDM6MjEuNzg3WlwiXG5cdFx0XHRcdFx0XHRcdFx0IyDljIXmi6xncmlk5YiX6KGo6K+35rGC55qE5o6l5Y+j5Zyo5YaF55qE5omA5pyJT0RhdGHmjqXlj6PvvIxEYXRl57G75Z6L5a2X5q616YO95Lya5Lul5LiK6L+w5qC85byP6L+U5ZueXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzNdID0gXCJEQVRFXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgZmlsdGVyLmxlbmd0aCA9PSA0IGFuZCBfLmlzU3RyaW5nKGZpbHRlclsyXSkgYW5kIGZpbHRlclszXSA9PSBcIkZVTkNUSU9OXCJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXJbMl19KVwiKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiREFURVwiXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyWzJdID0gbmV3IERhdGUoZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5wb3AoKVxuXHRcdFx0XHRcdGVsc2UgaWYgXy5pc09iamVjdChmaWx0ZXIpXG5cdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0RhdGUoZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgZmlsdGVyLl9pc19kYXRlID09IHRydWVcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBuZXcgRGF0ZShmaWx0ZXIudmFsdWUpXG5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdGlmIG9iamVjdC5mb3JtICYmICFfLmlzU3RyaW5nKG9iamVjdC5mb3JtKVxuXHRcdFx0XHRvYmplY3QuZm9ybSA9IEpTT04uc3RyaW5naWZ5IG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cblx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24odmFsKVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbCArICcnO1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0ZWxzZSBpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGlmIG9iamVjdC5mb3JtXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZSBvYmplY3QuZm9ybSwgKGtleSwgdmFsKS0+XG5cdFx0XHRcdFx0aWYgXy5pc1N0cmluZyh2YWwpICYmIHZhbC5zdGFydHNXaXRoKCdmdW5jdGlvbicpXG5cdFx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfLmZvckVhY2ggb2JqZWN0LnJlbGF0ZWRfbGlzdHMsIChyZWxhdGVkT2JqSW5mbyktPlxuXHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKVxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKVxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZmlsdGVyc19jb2RlXCIsIHZhbFxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZF9saXN0cywgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxuXHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKVxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKVxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvci5ldmFsKFwiKCN7dmFsfSlcIilcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZmlsdGVyc19jb2RlXCIsIHZhbFxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZExpc3QsIChyZWxhdGVkT2JqSW5mbyktPlxuXHRcdFx0XHRpZiBfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKVxuXHRcdFx0XHRcdF8uZm9yRWFjaCByZWxhdGVkT2JqSW5mbywgKHZhbCwga2V5KS0+XG5cdFx0XHRcdFx0XHRpZiBrZXkgPT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpXG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKVxuXG5cdFx0cmV0dXJuIG9iamVjdFxuXG5cbiIsInZhciBjb252ZXJ0RmllbGQsIGdldE9wdGlvbjtcblxuZ2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIHZhciBmb287XG4gIGZvbyA9IG9wdGlvbi5zcGxpdChcIjpcIik7XG4gIGlmIChmb28ubGVuZ3RoID4gMikge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1sxXSxcbiAgICAgIGNvbG9yOiBmb29bMl1cbiAgICB9O1xuICB9IGVsc2UgaWYgKGZvby5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMF1cbiAgICB9O1xuICB9XG59O1xuXG5jb252ZXJ0RmllbGQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGQsIHNwYWNlSWQpIHtcbiAgdmFyIGFsbE9wdGlvbnMsIGNvZGUsIG9wdGlvbnMsIHBpY2tsaXN0LCBwaWNrbGlzdE9wdGlvbnMsIHJlZjtcbiAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiBzcGFjZUlkICYmIGZpZWxkLnR5cGUgPT09ICdzZWxlY3QnKSB7XG4gICAgY29kZSA9IGZpZWxkLnBpY2tsaXN0IHx8IChvYmplY3RfbmFtZSArIFwiLlwiICsgZmllbGRfbmFtZSk7XG4gICAgaWYgKGNvZGUpIHtcbiAgICAgIHBpY2tsaXN0ID0gQ3JlYXRvci5nZXRQaWNrbGlzdChjb2RlLCBzcGFjZUlkKTtcbiAgICAgIGlmIChwaWNrbGlzdCkge1xuICAgICAgICBvcHRpb25zID0gW107XG4gICAgICAgIGFsbE9wdGlvbnMgPSBbXTtcbiAgICAgICAgcGlja2xpc3RPcHRpb25zID0gQ3JlYXRvci5nZXRQaWNrTGlzdE9wdGlvbnMocGlja2xpc3QpO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSAocmVmID0gXy5zb3J0QnkocGlja2xpc3RPcHRpb25zLCAnc29ydF9ubycpKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKSA6IHZvaWQgMDtcbiAgICAgICAgXy5lYWNoKHBpY2tsaXN0T3B0aW9ucywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHZhciBsYWJlbCwgdmFsdWU7XG4gICAgICAgICAgbGFiZWwgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgdmFsdWUgPSBpdGVtLnZhbHVlIHx8IGl0ZW0ubmFtZTtcbiAgICAgICAgICBhbGxPcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZW5hYmxlOiBpdGVtLmVuYWJsZSxcbiAgICAgICAgICAgIGNvbG9yOiBpdGVtLmNvbG9yXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGl0ZW0uZW5hYmxlKSB7XG4gICAgICAgICAgICBvcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbVtcImRlZmF1bHRcIl0pIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsbE9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZpZWxkLmFsbE9wdGlvbnMgPSBhbGxPcHRpb25zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmaWVsZDtcbn07XG5cbkNyZWF0b3IuY29udmVydE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCwgc3BhY2VJZCkge1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybjtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LnRyaWdnZXJzLCBmdW5jdGlvbih0cmlnZ2VyLCBrZXkpIHtcbiAgICB2YXIgX3RvZG8sIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYjtcbiAgICBpZiAoKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIpKSB7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSB0cmlnZ2VyICE9IG51bGwgPyB0cmlnZ2VyLl90b2RvIDogdm9pZCAwO1xuICAgICAgX3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKXtcIiArIF90b2RvX2Zyb21fZGIgKyBcIn0pXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikge1xuICAgICAgX3RvZG8gPSB0cmlnZ2VyLnRvZG87XG4gICAgICBpZiAoX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKSkge1xuICAgICAgICByZXR1cm4gdHJpZ2dlci5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgICB2YXIgc3lzdGVtQmFzZUZpZWxkcztcbiAgICAgIGlmIChmaWVsZC5vbWl0KSB7XG4gICAgICAgIGZpZWxkLmhpZGRlbiA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoZmllbGQucmVxdWlyZWQgJiYgZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZmllbGQucmVhZG9ubHkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHN5c3RlbUJhc2VGaWVsZHMgPSBDcmVhdG9yLmdldFN5c3RlbUJhc2VGaWVsZHMoKTtcbiAgICAgIGlmIChzeXN0ZW1CYXNlRmllbGRzLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYiwgX3Zpc2libGUsIGVycm9yO1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSkpIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbigpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3Zpc2libGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvLCBfdmlzaWJsZTtcbiAgICAgIF90b2RvID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnZpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKSkge1xuICAgICAgICByZXR1cm4gYWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGtleSkge1xuICAgIHZhciBfb3B0aW9ucywgX3R5cGUsIGJlZm9yZU9wZW5GdW5jdGlvbiwgY3JlYXRlRnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSwgZXJyb3IsIGZpbHRlcnNGdW5jdGlvbiwgaXNfY29tcGFueV9saW1pdGVkLCBtYXgsIG1pbiwgb3B0aW9ucywgb3B0aW9uc0Z1bmN0aW9uLCByZWZlcmVuY2VfdG8sIHJlZ0V4O1xuICAgIGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcbiAgICBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgaWYgKG9wdGlvbi5pbmRleE9mKFwiLFwiKSkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKF9vcHRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIGlmIChfLmlzU3RyaW5nKG9wdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1pbiA9IGZpZWxkLm1pbjtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWluKSkge1xuICAgICAgICBmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pbiA9IGZpZWxkLl9taW47XG4gICAgICBpZiAoXy5pc1N0cmluZyhtaW4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWluID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtaW4gKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtYXggPSBmaWVsZC5tYXg7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1heCkpIHtcbiAgICAgICAgZmllbGQuX21heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXggPSBmaWVsZC5fbWF4O1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWF4KSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1heCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWF4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT09IE9iamVjdCAmJiBfdHlwZSAhPT0gU3RyaW5nICYmIF90eXBlICE9PSBOdW1iZXIgJiYgX3R5cGUgIT09IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSkpIHtcbiAgICAgICAgICBmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdHlwZSArIFwiKVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9uc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWZlcmVuY2VfdG8gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGNyZWF0ZUZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBiZWZvcmVPcGVuRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlcnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZGVmYXVsdFZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICByZXR1cm4gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBpc19jb21wYW55X2xpbWl0ZWQgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBfLmZvckVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG5cbiAgICAvKlxuICAgIFx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuICAgIFx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG4gICAgXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6ICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG4gICAgXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0XV1cbiAgICBcdFx0XHTmiJZcbiAgICBcdFx0XHRmaWx0ZXJzOiBbe1xuICAgIFx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcbiAgICBcdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG4gICAgXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cbiAgICBcdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdH1dXG4gICAgICovXG4gICAgaWYgKF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBsaXN0X3ZpZXcuX2ZpbHRlcnMgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfLmZvckVhY2gobGlzdF92aWV3LmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNEYXRlKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiREFURVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkZVTkNUSU9OXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJbMl0gKyBcIilcIik7XG4gICAgICAgICAgICAgIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiREFURVwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNEYXRlKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl9pc19kYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuX2lzX2RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKG9iamVjdC5mb3JtICYmICFfLmlzU3RyaW5nKG9iamVjdC5mb3JtKSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbCArICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0pIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZF9saXN0cywgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImZpbHRlcnNfY29kZVwiLCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkX2xpc3RzLCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJmaWx0ZXJzX2NvZGVcIiwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fVxuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiXG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gKHByZWZpeCxmaWVsZFZhcmlhYmxlKS0+XG5cdHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuXG5cdHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZSByZWcsIChtLCAkMSktPlxuXHRcdHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLyxcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZyxcIlxcXCJdW1xcXCJcIik7XG5cblx0cmV0dXJuIHJldlxuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IChmb3JtdWxhX3N0ciktPlxuXHRpZiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTFcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSAoZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKS0+XG5cdGlmIGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpXG5cblx0XHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucz8uZXh0ZW5kKVxuXHRcdFx0ZXh0ZW5kID0gdHJ1ZVxuXG5cdFx0X1ZBTFVFUyA9IHt9XG5cdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKVxuXHRcdGlmIGV4dGVuZFxuXHRcdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucz8udXNlcklkLCBvcHRpb25zPy5zcGFjZUlkKSlcblx0XHRmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cilcblxuXHRcdHRyeVxuXHRcdFx0ZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUykgICAjIOatpOWkhOS4jeiDveeUqHdpbmRvdy5ldmFsIO+8jOS8muWvvOiHtOWPmOmHj+S9nOeUqOWfn+W8guW4uFxuXHRcdFx0cmV0dXJuIGRhdGFcblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9XCIsIGUpXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dG9hc3RyPy5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9I3tlfVwiXG5cblx0cmV0dXJuIGZvcm11bGFfc3RyXG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge307XG5cbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCI7XG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gZnVuY3Rpb24ocHJlZml4LCBmaWVsZFZhcmlhYmxlKSB7XG4gIHZhciByZWcsIHJldjtcbiAgcmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XG4gIHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG0sICQxKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLCBcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLCBcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csIFwiXFxcIl1bXFxcIlwiKTtcbiAgfSk7XG4gIHJldHVybiByZXY7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyKSB7XG4gIGlmIChfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucykge1xuICB2YXIgX1ZBTFVFUywgZGF0YSwgZSwgZXh0ZW5kO1xuICBpZiAoZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuZXh0ZW5kIDogdm9pZCAwKSkge1xuICAgICAgZXh0ZW5kID0gdHJ1ZTtcbiAgICB9XG4gICAgX1ZBTFVFUyA9IHt9O1xuICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVCk7XG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy51c2VySWQgOiB2b2lkIDAsIG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgIH1cbiAgICBmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cik7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciwgZSk7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG9hc3RyICE9PSBcInVuZGVmaW5lZFwiICYmIHRvYXN0ciAhPT0gbnVsbCkge1xuICAgICAgICAgIHRvYXN0ci5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIgKyBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFfc3RyO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9ICAgIyDmraTlr7nosaHlj6rog73lnKjnoa7kv53miYDmnIlPYmplY3TliJ3lp4vljJblrozmiJDlkI7osIPnlKjvvIwg5ZCm5YiZ6I635Y+W5Yiw55qEb2JqZWN05LiN5YWoXG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IChvYmplY3RfbmFtZSktPlxuXHRpZiBvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJylcblx0XHRvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpXG5cdHJldHVybiBvYmplY3RfbmFtZVxuXG5DcmVhdG9yLk9iamVjdCA9IChvcHRpb25zKS0+XG5cdF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdF9iYXNlT2JqZWN0ID0ge2FjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zICwgZmllbGRzOiB7fSwgdHJpZ2dlcnM6IHt9LCBwZXJtaXNzaW9uX3NldDoge319XG5cdHNlbGYgPSB0aGlzXG5cdGlmICghb3B0aW9ucy5uYW1lKVxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcblxuXHRzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZVxuXHRzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXHRzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWVcblx0c2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWxcblx0c2VsZi5pY29uID0gb3B0aW9ucy5pY29uXG5cdHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uXG5cdHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlld1xuXHRzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm1cblx0c2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Rcblx0c2VsZi5yZWxhdGVkX2xpc3RzID0gb3B0aW9ucy5yZWxhdGVkX2xpc3RzXG5cdHNlbGYudmVyc2lvbiA9IG9wdGlvbnMudmVyc2lvbiB8fCAxLjBcblx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSAgfHwgb3B0aW9ucy5pc19lbmFibGUgPT0gdHJ1ZVxuXHRcdHNlbGYuaXNfZW5hYmxlID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5pc19lbmFibGUgPSBmYWxzZVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpXG5cdFx0XHRzZWxmLmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvcHRpb25zLmFsbG93X2N1c3RvbUFjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnZXhjbHVkZV9hY3Rpb25zJylcblx0XHRcdHNlbGYuZXhjbHVkZV9hY3Rpb25zID0gb3B0aW9ucy5leGNsdWRlX2FjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKVxuXHRcdFx0c2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3Rcblx0c2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoXG5cdHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXNcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xuXHRzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzXG5cdHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXRcblx0c2VsZi5lbmFibGVfZXZlbnRzID0gb3B0aW9ucy5lbmFibGVfZXZlbnRzXG5cdGlmIG9wdGlvbnMucGFnaW5nXG5cdFx0c2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZ1xuXHRzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuXG5cdHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT0gdW5kZWZpbmVkKSBvciBvcHRpb25zLmVuYWJsZV9hcGlcblx0c2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbVxuXHRzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlXG5cdHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlc1xuXHRzZWxmLmVuYWJsZV9wcm9jZXNzID0gb3B0aW9ucy5lbmFibGVfcHJvY2Vzc1xuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXG5cdFx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcblx0ZWxzZVxuXHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxuXHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXG5cdHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93XG5cdHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55XG5cdHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpXG5cdHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyXG5cdHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2hcblx0c2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsXG5cdHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFsc1xuXHRzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3dcblx0c2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvd1xuXHRzZWxmLmVuYWJsZV9pbmxpbmVfZWRpdCA9IG9wdGlvbnMuZW5hYmxlX2lubGluZV9lZGl0XG5cdHNlbGYuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlsc1xuXHRzZWxmLm1hc3RlcnMgPSBvcHRpb25zLm1hc3RlcnNcblx0c2VsZi5sb29rdXBfZGV0YWlscyA9IG9wdGlvbnMubG9va3VwX2RldGFpbHNcblx0aWYgXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50Jylcblx0XHRzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudFxuXHRzZWxmLmlkRmllbGROYW1lID0gJ19pZCdcblx0aWYgb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdFx0c2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdGlmICghb3B0aW9ucy5maWVsZHMpXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XG5cblx0c2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcylcblxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmIGZpZWxkLmlzX25hbWVcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXG5cdFx0ZWxzZSBpZiBmaWVsZF9uYW1lID09ICduYW1lJyAmJiAhc2VsZi5OQU1FX0ZJRUxEX0tFWVxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcblx0XHRpZiBmaWVsZC5wcmltYXJ5XG5cdFx0XHRzZWxmLmlkRmllbGROYW1lID0gZmllbGRfbmFtZVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXG5cdFx0XHRcdGlmIGZpZWxkX25hbWUgPT0gJ3NwYWNlJ1xuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gZmFsc2VcblxuXHRpZiAhb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xuXHRcdF8uZWFjaCBfYmFzZU9iamVjdC5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgIXNlbGYuZmllbGRzW2ZpZWxkX25hbWVdXG5cdFx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge31cblx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKVxuXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc3VtbWFyeSdcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdHNlbGYubGlzdF92aWV3cyA9IHt9XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpXG5cdF8uZWFjaCBvcHRpb25zLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRWaWV3LCBpdGVtLCBpdGVtX25hbWUpXG5cdFx0c2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbVxuXG5cdHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKVxuXHRfLmVhY2ggb3B0aW9ucy50cmlnZ2VycywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWVcblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pXG5cblx0c2VsZi5hY3Rpb25zID0gXy5jbG9uZShfYmFzZU9iamVjdC5hY3Rpb25zKVxuXHRfLmVhY2ggb3B0aW9ucy5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdXG5cdFx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0Y29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKVxuXHRcdGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSAj5YWI5Yig6Zmk55u45YWz5bGe5oCn5YaN6YeN5bu65omN6IO95L+d6K+B5ZCO57ut6YeN5aSN5a6a5LmJ55qE5bGe5oCn6aG65bqP55Sf5pWIXG5cdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSlcblxuXHRfLmVhY2ggc2VsZi5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aXRlbS5uYW1lID0gaXRlbV9uYW1lXG5cblx0c2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSlcblxuXHQjIOiuqeaJgOaciW9iamVjdOm7mOiupOacieaJgOaciWxpc3Rfdmlld3MvYWN0aW9ucy9yZWxhdGVkX29iamVjdHMvcmVhZGFibGVfZmllbGRzL2VkaXRhYmxlX2ZpZWxkc+WujOaVtOadg+mZkO+8jOivpeadg+mZkOWPr+iDveiiq+aVsOaNruW6k+S4reiuvue9rueahGFkbWluL3VzZXLmnYPpmZDopobnm5Zcblx0c2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoX2Jhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpXG5cdCMgZGVmYXVsdExpc3RWaWV3cyA9IF8ua2V5cyhzZWxmLmxpc3Rfdmlld3MpXG5cdCMgZGVmYXVsdEFjdGlvbnMgPSBfLmtleXMoc2VsZi5hY3Rpb25zKVxuXHQjIGRlZmF1bHRSZWxhdGVkT2JqZWN0cyA9IF8ucGx1Y2soc2VsZi5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXHQjIGRlZmF1bHRSZWFkYWJsZUZpZWxkcyA9IFtdXG5cdCMgZGVmYXVsdEVkaXRhYmxlRmllbGRzID0gW11cblx0IyBfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHQjIFx0aWYgIShmaWVsZC5oaWRkZW4pICAgICMyMzEgb21pdOWtl+auteaUr+aMgeWcqOmdnue8lui+kemhtemdouafpeeciywg5Zug5q2k5Yig6Zmk5LqG5q2k5aSE5a+5b21pdOeahOWIpOaWrVxuXHQjIFx0XHRkZWZhdWx0UmVhZGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXG5cdCMgXHRcdGlmICFmaWVsZC5yZWFkb25seVxuXHQjIFx0XHRcdGRlZmF1bHRFZGl0YWJsZUZpZWxkcy5wdXNoIGZpZWxkX25hbWVcblxuXHQjIF8uZWFjaCBzZWxmLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdCMgXHRpZiBpdGVtX25hbWUgPT0gXCJub25lXCJcblx0IyBcdFx0cmV0dXJuXG5cdCMgXHRpZiBzZWxmLmxpc3Rfdmlld3Ncblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmxpc3Rfdmlld3MgPSBkZWZhdWx0TGlzdFZpZXdzXG5cdCMgXHRpZiBzZWxmLmFjdGlvbnNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmFjdGlvbnMgPSBkZWZhdWx0QWN0aW9uc1xuXHQjIFx0aWYgc2VsZi5yZWxhdGVkX29iamVjdHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLnJlbGF0ZWRfb2JqZWN0cyA9IGRlZmF1bHRSZWxhdGVkT2JqZWN0c1xuXHQjIFx0aWYgc2VsZi5maWVsZHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLnJlYWRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRSZWFkYWJsZUZpZWxkc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uZWRpdGFibGVfZmllbGRzID0gZGVmYXVsdEVkaXRhYmxlRmllbGRzXG5cdHVubGVzcyBvcHRpb25zLnBlcm1pc3Npb25fc2V0XG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldCA9IHt9XG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8uYWRtaW4pXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKVxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LnVzZXIpXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC51c2VyID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1widXNlclwiXSlcblx0Xy5lYWNoIG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiAhc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdXG5cdFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSB7fVxuXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSlcblxuXHQjIOWJjeerr+agueaNrnBlcm1pc3Npb25z5pS55YaZZmllbGTnm7jlhbPlsZ7mgKfvvIzlkI7nq6/lj6ropoHotbDpu5jorqTlsZ7mgKflsLHooYzvvIzkuI3pnIDopoHmlLnlhplcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cGVybWlzc2lvbnMgPSBvcHRpb25zLnBlcm1pc3Npb25zXG5cdFx0ZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zPy5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0aWYgZGlzYWJsZWRfbGlzdF92aWV3cz8ubGVuZ3RoXG5cdFx0XHRkZWZhdWx0TGlzdFZpZXdJZCA9IG9wdGlvbnMubGlzdF92aWV3cz8uYWxsPy5faWRcblx0XHRcdGlmIGRlZmF1bHRMaXN0Vmlld0lkXG5cdFx0XHRcdCMg5oqK6KeG5Zu+5p2D6ZmQ6YWN572u5Lit6buY6K6k55qEYWxs6KeG5Zu+aWTovazmjaLmiJBhbGzlhbPplK7lrZdcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IF8ubWFwIGRpc2FibGVkX2xpc3Rfdmlld3MsIChsaXN0X3ZpZXdfaXRlbSkgLT5cblx0XHRcdFx0XHRyZXR1cm4gaWYgZGVmYXVsdExpc3RWaWV3SWQgPT0gbGlzdF92aWV3X2l0ZW0gdGhlbiBcImFsbFwiIGVsc2UgbGlzdF92aWV3X2l0ZW1cblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKVxuI1x0XHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuI1x0XHRcdGlmIGZpZWxkXG4jXHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVucmVhZGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA8IDBcbiNcdFx0XHRcdFx0aWYgZmllbGQuaGlkZGVuXG4jXHRcdFx0XHRcdFx0cmV0dXJuXG4jXHRcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5lZGl0YWJsZV9maWVsZHMsIGZpZWxkX25hbWUpID4gLTFcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcbiNcdFx0XHRcdFx0XHRmaWVsZC5kaXNhYmxlZCA9IHRydWVcbiNcdFx0XHRcdFx0XHQjIOW9k+WPquivu+aXtu+8jOWmguaenOS4jeWOu+aOieW/heWhq+Wtl+aute+8jGF1dG9mb3Jt5piv5Lya5oql6ZSZ55qEXG4jXHRcdFx0XHRcdFx0ZmllbGQucmVxdWlyZWQgPSBmYWxzZVxuI1x0XHRcdFx0ZWxzZVxuI1x0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSB0cnVlXG5cdGVsc2Vcblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbnVsbFxuXG5cdF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKVxuXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYlxuXG5cdHNlbGYuZGIgPSBfZGJcblxuXHRzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWVcblxuXHRzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKVxuXHRzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKVxuXHRpZiBzZWxmLm5hbWUgIT0gXCJ1c2Vyc1wiIGFuZCBzZWxmLm5hbWUgIT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIiwgXCJhY3Rpb25fZmllbGRfdXBkYXRlc1wiLCBcIm9iamVjdF9saXN0dmlld3NcIl0sIHNlbGYubmFtZSlcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblx0XHRlbHNlXG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdGlmIHNlbGYubmFtZSA9PSBcInVzZXJzXCJcblx0XHRfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hXG5cblx0aWYgXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXG5cdENyZWF0b3Iub2JqZWN0c0J5TmFtZVtzZWxmLl9jb2xsZWN0aW9uX25hbWVdID0gc2VsZlxuXG5cdHJldHVybiBzZWxmXG5cbiMgQ3JlYXRvci5PYmplY3QucHJvdG90eXBlLmkxOG4gPSAoKS0+XG4jIFx0IyBzZXQgb2JqZWN0IGxhYmVsXG4jIFx0c2VsZiA9IHRoaXNcblxuIyBcdGtleSA9IHNlbGYubmFtZVxuIyBcdGlmIHQoa2V5KSA9PSBrZXlcbiMgXHRcdGlmICFzZWxmLmxhYmVsXG4jIFx0XHRcdHNlbGYubGFiZWwgPSBzZWxmLm5hbWVcbiMgXHRlbHNlXG4jIFx0XHRzZWxmLmxhYmVsID0gdChrZXkpXG5cbiMgXHQjIHNldCBmaWVsZCBsYWJlbHNcbiMgXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuIyBcdFx0ZmtleSA9IHNlbGYubmFtZSArIFwiX1wiICsgZmllbGRfbmFtZVxuIyBcdFx0aWYgdChma2V5KSA9PSBma2V5XG4jIFx0XHRcdGlmICFmaWVsZC5sYWJlbFxuIyBcdFx0XHRcdGZpZWxkLmxhYmVsID0gZmllbGRfbmFtZVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHRmaWVsZC5sYWJlbCA9IHQoZmtleSlcbiMgXHRcdHNlbGYuc2NoZW1hPy5fc2NoZW1hP1tmaWVsZF9uYW1lXT8ubGFiZWwgPSBmaWVsZC5sYWJlbFxuXG5cbiMgXHQjIHNldCBsaXN0dmlldyBsYWJlbHNcbiMgXHRfLmVhY2ggc2VsZi5saXN0X3ZpZXdzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG4jIFx0XHRpMThuX2tleSA9IHNlbGYubmFtZSArIFwiX2xpc3R2aWV3X1wiICsgaXRlbV9uYW1lXG4jIFx0XHRpZiB0KGkxOG5fa2V5KSA9PSBpMThuX2tleVxuIyBcdFx0XHRpZiAhaXRlbS5sYWJlbFxuIyBcdFx0XHRcdGl0ZW0ubGFiZWwgPSBpdGVtX25hbWVcbiMgXHRcdGVsc2VcbiMgXHRcdFx0aXRlbS5sYWJlbCA9IHQoaTE4bl9rZXkpXG5cblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IChvYmplY3QpLT5cblx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXG5cdCMgaWYgb2JqZWN0XG5cdCMgXHRpZiAhb2JqZWN0LmRhdGFiYXNlX25hbWUgfHwgb2JqZWN0LmRhdGFiYXNlX25hbWUgPT0gJ21ldGVvci1tb25nbydcblx0IyBcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiXG5cdCMgXHRlbHNlXG5cdCMgXHRcdHJldHVybiBcIi9hcGkvb2RhdGEvI3tvYmplY3QuZGF0YWJhc2VfbmFtZX1cIlxuXG4jIGlmIE1ldGVvci5pc0NsaWVudFxuXG4jIFx0TWV0ZW9yLnN0YXJ0dXAgLT5cbiMgXHRcdFRyYWNrZXIuYXV0b3J1biAtPlxuIyBcdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICYmIENyZWF0b3IuYm9vdHN0cmFwTG9hZGVkPy5nZXQoKVxuIyBcdFx0XHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG4jIFx0XHRcdFx0XHRvYmplY3QuaTE4bigpXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdGlmICFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHNcblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAob2JqZWN0KS0+XG5cdFx0XHRuZXcgQ3JlYXRvci5PYmplY3Qob2JqZWN0KVxuXG4iLCJ2YXIgY2xvbmU7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge307XG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIGlmIChvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJykpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpO1xuICB9XG4gIHJldHVybiBvYmplY3RfbmFtZTtcbn07XG5cbkNyZWF0b3IuT2JqZWN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgX2Jhc2VPYmplY3QsIF9kYiwgZGVmYXVsdExpc3RWaWV3SWQsIGRlZmF1bHRWaWV3LCBkaXNhYmxlZF9saXN0X3ZpZXdzLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzY2hlbWEsIHNlbGY7XG4gIF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgX2Jhc2VPYmplY3QgPSB7XG4gICAgICBhY3Rpb25zOiBDcmVhdG9yLmJhc2VPYmplY3QuYWN0aW9ucyxcbiAgICAgIGZpZWxkczoge30sXG4gICAgICB0cmlnZ2Vyczoge30sXG4gICAgICBwZXJtaXNzaW9uX3NldDoge31cbiAgICB9O1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICBpZiAoIW9wdGlvbnMubmFtZSkge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gIH1cbiAgc2VsZi5faWQgPSBvcHRpb25zLl9pZCB8fCBvcHRpb25zLm5hbWU7XG4gIHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuICBzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gIHNlbGYubGFiZWwgPSBvcHRpb25zLmxhYmVsO1xuICBzZWxmLmljb24gPSBvcHRpb25zLmljb247XG4gIHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uO1xuICBzZWxmLmlzX3ZpZXcgPSBvcHRpb25zLmlzX3ZpZXc7XG4gIHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybTtcbiAgc2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Q7XG4gIHNlbGYucmVsYXRlZF9saXN0cyA9IG9wdGlvbnMucmVsYXRlZF9saXN0cztcbiAgc2VsZi52ZXJzaW9uID0gb3B0aW9ucy52ZXJzaW9uIHx8IDEuMDtcbiAgaWYgKCFfLmlzQm9vbGVhbihvcHRpb25zLmlzX2VuYWJsZSkgfHwgb3B0aW9ucy5pc19lbmFibGUgPT09IHRydWUpIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5pc19lbmFibGUgPSBmYWxzZTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhbGxvd19jdXN0b21BY3Rpb25zJykpIHtcbiAgICAgIHNlbGYuYWxsb3dfY3VzdG9tQWN0aW9ucyA9IG9wdGlvbnMuYWxsb3dfY3VzdG9tQWN0aW9ucztcbiAgICB9XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdleGNsdWRlX2FjdGlvbnMnKSkge1xuICAgICAgc2VsZi5leGNsdWRlX2FjdGlvbnMgPSBvcHRpb25zLmV4Y2x1ZGVfYWN0aW9ucztcbiAgICB9XG4gICAgaWYgKF8uaGFzKG9wdGlvbnMsICdhbGxvd19yZWxhdGVkTGlzdCcpKSB7XG4gICAgICBzZWxmLmFsbG93X3JlbGF0ZWRMaXN0ID0gb3B0aW9ucy5hbGxvd19yZWxhdGVkTGlzdDtcbiAgICB9XG4gIH1cbiAgc2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoO1xuICBzZWxmLmVuYWJsZV9maWxlcyA9IG9wdGlvbnMuZW5hYmxlX2ZpbGVzO1xuICBzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzO1xuICBzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzO1xuICBzZWxmLmVuYWJsZV9hdWRpdCA9IG9wdGlvbnMuZW5hYmxlX2F1ZGl0O1xuICBzZWxmLmVuYWJsZV9ldmVudHMgPSBvcHRpb25zLmVuYWJsZV9ldmVudHM7XG4gIGlmIChvcHRpb25zLnBhZ2luZykge1xuICAgIHNlbGYucGFnaW5nID0gb3B0aW9ucy5wYWdpbmc7XG4gIH1cbiAgc2VsZi5oaWRkZW4gPSBvcHRpb25zLmhpZGRlbjtcbiAgc2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PT0gdm9pZCAwKSB8fCBvcHRpb25zLmVuYWJsZV9hcGk7XG4gIHNlbGYuY3VzdG9tID0gb3B0aW9ucy5jdXN0b207XG4gIHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmU7XG4gIHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlcztcbiAgc2VsZi5lbmFibGVfcHJvY2VzcyA9IG9wdGlvbnMuZW5hYmxlX3Byb2Nlc3M7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpKSB7XG4gICAgICBzZWxmLmVuYWJsZV90cmVlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlO1xuICAgICAgc2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gIH1cbiAgc2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3c7XG4gIHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55O1xuICBzZWxmLmNhbGVuZGFyID0gXy5jbG9uZShvcHRpb25zLmNhbGVuZGFyKTtcbiAgc2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXI7XG4gIHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2g7XG4gIHNlbGYuZW5hYmxlX3NwYWNlX2dsb2JhbCA9IG9wdGlvbnMuZW5hYmxlX3NwYWNlX2dsb2JhbDtcbiAgc2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzO1xuICBzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3c7XG4gIHNlbGYuZW5hYmxlX3dvcmtmbG93ID0gb3B0aW9ucy5lbmFibGVfd29ya2Zsb3c7XG4gIHNlbGYuZW5hYmxlX2lubGluZV9lZGl0ID0gb3B0aW9ucy5lbmFibGVfaW5saW5lX2VkaXQ7XG4gIHNlbGYuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlscztcbiAgc2VsZi5tYXN0ZXJzID0gb3B0aW9ucy5tYXN0ZXJzO1xuICBzZWxmLmxvb2t1cF9kZXRhaWxzID0gb3B0aW9ucy5sb29rdXBfZGV0YWlscztcbiAgaWYgKF8uaGFzKG9wdGlvbnMsICdpbl9kZXZlbG9wbWVudCcpKSB7XG4gICAgc2VsZi5pbl9kZXZlbG9wbWVudCA9IG9wdGlvbnMuaW5fZGV2ZWxvcG1lbnQ7XG4gIH1cbiAgc2VsZi5pZEZpZWxkTmFtZSA9ICdfaWQnO1xuICBpZiAob3B0aW9ucy5kYXRhYmFzZV9uYW1lKSB7XG4gICAgc2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lO1xuICB9XG4gIGlmICghb3B0aW9ucy5maWVsZHMpIHtcbiAgICBjb25zb2xlLmVycm9yKG9wdGlvbnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XG4gIH1cbiAgc2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcyk7XG4gIF8uZWFjaChzZWxmLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoZmllbGQuaXNfbmFtZSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZF9uYW1lID09PSAnbmFtZScgJiYgIXNlbGYuTkFNRV9GSUVMRF9LRVkpIHtcbiAgICAgIHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICBpZiAoZmllbGQucHJpbWFyeSkge1xuICAgICAgc2VsZi5pZEZpZWxkTmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgICAgaWYgKGZpZWxkX25hbWUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgICBmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoIW9wdGlvbnMuZGF0YWJhc2VfbmFtZSB8fCBvcHRpb25zLmRhdGFiYXNlX25hbWUgPT09ICdtZXRlb3ItbW9uZ28nKSB7XG4gICAgXy5lYWNoKF9iYXNlT2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICAgIGlmICghc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pIHtcbiAgICAgICAgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoZmllbGQpLCBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSk7XG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC50eXBlID09PSAnYXV0b251bWJlcicpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnZm9ybXVsYScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnc3VtbWFyeScpIHtcbiAgICAgIHJldHVybiBmaWVsZC5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgc2VsZi5saXN0X3ZpZXdzID0ge307XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpO1xuICBfLmVhY2gob3B0aW9ucy5saXN0X3ZpZXdzLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgb2l0ZW07XG4gICAgb2l0ZW0gPSBDcmVhdG9yLmNvbnZlcnRMaXN0VmlldyhkZWZhdWx0VmlldywgaXRlbSwgaXRlbV9uYW1lKTtcbiAgICByZXR1cm4gc2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbTtcbiAgfSk7XG4gIHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKTtcbiAgXy5lYWNoKG9wdGlvbnMudHJpZ2dlcnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIGlmICghc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWU7XG4gICAgcmV0dXJuIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSk7XG4gIH0pO1xuICBzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpO1xuICBfLmVhY2gob3B0aW9ucy5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICB2YXIgY29weUl0ZW07XG4gICAgaWYgKCFzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSB7fTtcbiAgICB9XG4gICAgY29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKTtcbiAgICBkZWxldGUgc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV07XG4gICAgcmV0dXJuIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0gXy5leHRlbmQoY29weUl0ZW0sIGl0ZW0pO1xuICB9KTtcbiAgXy5lYWNoKHNlbGYuYWN0aW9ucywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgfSk7XG4gIHNlbGYucmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRPYmplY3RSZWxhdGVkcyhzZWxmLm5hbWUpO1xuICBzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldCk7XG4gIGlmICghb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQgPSB7fTtcbiAgfVxuICBpZiAoISgocmVmID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZi5hZG1pbiA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pO1xuICB9XG4gIGlmICghKChyZWYxID0gb3B0aW9ucy5wZXJtaXNzaW9uX3NldCkgIT0gbnVsbCA/IHJlZjEudXNlciA6IHZvaWQgMCkpIHtcbiAgICBvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKTtcbiAgfVxuICBfLmVhY2gob3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnM7XG4gICAgZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzIDogdm9pZCAwO1xuICAgIGlmIChkaXNhYmxlZF9saXN0X3ZpZXdzICE9IG51bGwgPyBkaXNhYmxlZF9saXN0X3ZpZXdzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZGVmYXVsdExpc3RWaWV3SWQgPSAocmVmMiA9IG9wdGlvbnMubGlzdF92aWV3cykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hbGwpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCkge1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAoZGlzYWJsZWRfbGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdExpc3RWaWV3SWQgPT09IGxpc3Rfdmlld19pdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbGxcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Rfdmlld19pdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpO1xuICB9IGVsc2Uge1xuICAgIHNlbGYucGVybWlzc2lvbnMgPSBudWxsO1xuICB9XG4gIF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiO1xuICBzZWxmLmRiID0gX2RiO1xuICBzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWU7XG4gIHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpO1xuICBzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKTtcbiAgaWYgKHNlbGYubmFtZSAhPT0gXCJ1c2Vyc1wiICYmIHNlbGYubmFtZSAhPT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIiwgXCJhY3Rpb25fZmllbGRfdXBkYXRlc1wiLCBcIm9iamVjdF9saXN0dmlld3NcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoc2VsZi5uYW1lID09PSBcInVzZXJzXCIpIHtcbiAgICBfZGIuX3NpbXBsZVNjaGVtYSA9IHNlbGYuc2NoZW1hO1xuICB9XG4gIGlmIChfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgQ3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmO1xuICByZXR1cm4gc2VsZjtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXggPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIFwiL2FwaS9vZGF0YS92NFwiO1xufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIGlmICghQ3JlYXRvci5ib290c3RyYXBMb2FkZWQgJiYgQ3JlYXRvci5PYmplY3RzKSB7XG4gICAgcmV0dXJuIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyA9IChmaWVsZFNjaGVtYSkgLT5cblx0b3B0aW9ucyA9IGZpZWxkU2NoZW1hLm9wdGlvbnNcblx0dW5sZXNzIG9wdGlvbnNcblx0XHRyZXR1cm5cblx0ZGF0YV90eXBlID0gZmllbGRTY2hlbWEuZGF0YV90eXBlXG5cdGlmICFfLmlzRnVuY3Rpb24ob3B0aW9ucykgYW5kIGRhdGFfdHlwZSBhbmQgZGF0YV90eXBlICE9ICd0ZXh0J1xuXHRcdCMg6Zu25Luj56CB55WM6Z2i6YWN572ub3B0aW9uc+mAiemhueWAvOWPquaUr+aMgeWtl+espuS4su+8jOaJgOS7peW9k2RhdGFfdHlwZeS4uuaVsOWAvOaIlmJvb2xlYW7ml7bvvIzlj6rog73lvLrooYzmiorpgInpobnlgLzlhYjovazmjaLkuLrlr7nlupTnmoTnsbvlnotcblx0XHRvcHRpb25zLmZvckVhY2ggKG9wdGlvbkl0ZW0pIC0+XG5cdFx0XHRpZiB0eXBlb2Ygb3B0aW9uSXRlbS52YWx1ZSAhPSAnc3RyaW5nJ1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIFtcblx0XHRcdFx0J251bWJlcidcblx0XHRcdFx0J2N1cnJlbmN5J1xuXHRcdFx0XHQncGVyY2VudCdcblx0XHRcdF0uaW5kZXhPZihkYXRhX3R5cGUpID4gLTFcblx0XHRcdFx0b3B0aW9uSXRlbS52YWx1ZSA9IE51bWJlcihvcHRpb25JdGVtLnZhbHVlKVxuXHRcdFx0ZWxzZSBpZiBkYXRhX3R5cGUgPT0gJ2Jvb2xlYW4nXG5cdFx0XHRcdCMg5Y+q5pyJ5Li6dHJ1ZeaJjeS4uuecn1xuXHRcdFx0XHRvcHRpb25JdGVtLnZhbHVlID0gb3B0aW9uSXRlbS52YWx1ZSA9PSAndHJ1ZSdcblx0cmV0dXJuIG9wdGlvbnNcblxuQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSAob2JqKSAtPlxuXHR1bmxlc3Mgb2JqXG5cdFx0cmV0dXJuXG5cdHNjaGVtYSA9IHt9XG5cblx0ZmllbGRzQXJyID0gW11cblxuXHRfLmVhY2ggb2JqLmZpZWxkcyAsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmICFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpXG5cdFx0XHRmaWVsZC5uYW1lID0gZmllbGRfbmFtZVxuXHRcdGZpZWxkc0Fyci5wdXNoIGZpZWxkXG5cblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cblxuXHRcdGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lXG5cblx0XHRmcyA9IHt9XG5cdFx0aWYgZmllbGQucmVnRXhcblx0XHRcdGZzLnJlZ0V4ID0gZmllbGQucmVnRXhcblx0XHRmcy5hdXRvZm9ybSA9IHt9XG5cdFx0ZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZVxuXHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0YXV0b2Zvcm1fdHlwZSA9IGZpZWxkLmF1dG9mb3JtPy50eXBlXG5cblx0XHRpZiBmaWVsZC50eXBlID09IFwidGV4dFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJwaG9uZVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW3RleHRdXCIgb3IgZmllbGQudHlwZSA9PSBcIltwaG9uZV1cIlxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2NvZGUnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiXG5cdFx0XHRmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAxMlxuXHRcdFx0aWYgZmllbGQubGFuZ3VhZ2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRleHRhcmVhXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJwYXNzd29yZFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJwYXNzd29yZFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZVwiXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmlzaU9TKClcblx0XHRcdFx0XHRcdCMgRml4IGlvcyAxNCwg5omL5py65a6i5oi356uv5b6F5a6h5qC45paH5Lu25pel5pyf5o6n5Lu25pi+56S65pWF6ZqcICM5OTHvvIxpb3Pnu5/kuIDnlKhQQ+err+S4gOagt+eahGpz5o6n5Lu2XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcblx0XHRcdFx0XHRcdFx0XHRwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxuXHRcdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0dGltZXpvbmVJZDogXCJ1dGNcIlxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ0aW1lXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXG5cdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdHR5cGU6IFwidGltZVwiXG5cdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcIkhIOm1tXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0XHRmcy50eXBlID0gRGF0ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKClcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmlzaU9TKClcblx0XHRcdFx0XHRcdCMgRml4IGlvcyAxNCwg5omL5py65a6i5oi356uv5b6F5a6h5qC45paH5Lu25pel5pyf5o6n5Lu25pi+56S65pWF6ZqcICM5OTHvvIxpb3Pnu5/kuIDnlKhQQ+err+S4gOagt+eahGpz5o6n5Lu2XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxuXHRcdFx0XHRcdFx0XHRcdHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXG5cdFx0XHRcdFx0XHRcdGRhdGVNb2JpbGVPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcblx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbT2JqZWN0XVwiXG5cdFx0XHRmcy50eXBlID0gW09iamVjdF1cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJodG1sXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCIgfHwgbG9jYWxlID09IFwiemgtQ05cIlxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJlbi1VU1wiXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0dHlwZTogXCJzdW1tZXJub3RlXCJcblx0XHRcdFx0XHRjbGFzczogJ3N1bW1lcm5vdGUtZWRpdG9yJ1xuXHRcdFx0XHRcdHNldHRpbmdzOlxuXHRcdFx0XHRcdFx0aGVpZ2h0OiAyMDBcblx0XHRcdFx0XHRcdGRpYWxvZ3NJbkJvZHk6IHRydWVcblx0XHRcdFx0XHRcdHRvb2xiYXI6ICBbXG5cdFx0XHRcdFx0XHRcdFsnZm9udDEnLCBbJ3N0eWxlJ11dLFxuXHRcdFx0XHRcdFx0XHRbJ2ZvbnQyJywgWydib2xkJywgJ3VuZGVybGluZScsICdpdGFsaWMnLCAnY2xlYXInXV0sXG5cdFx0XHRcdFx0XHRcdFsnZm9udDMnLCBbJ2ZvbnRuYW1lJ11dLFxuXHRcdFx0XHRcdFx0XHRbJ2NvbG9yJywgWydjb2xvciddXSxcblx0XHRcdFx0XHRcdFx0WydwYXJhJywgWyd1bCcsICdvbCcsICdwYXJhZ3JhcGgnXV0sXG5cdFx0XHRcdFx0XHRcdFsndGFibGUnLCBbJ3RhYmxlJ11dLFxuXHRcdFx0XHRcdFx0XHRbJ2luc2VydCcsIFsnbGluaycsICdwaWN0dXJlJ11dLFxuXHRcdFx0XHRcdFx0XHRbJ3ZpZXcnLCBbJ2NvZGV2aWV3J11dXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0XHRmb250TmFtZXM6IFsnQXJpYWwnLCAnQ29taWMgU2FucyBNUycsICdDb3VyaWVyIE5ldycsICdIZWx2ZXRpY2EnLCAnSW1wYWN0JywgJ+Wui+S9kycsJ+m7keS9kycsJ+W+rui9r+mbhem7kScsJ+S7v+WuiycsJ+alt+S9kycsJ+matuS5picsJ+W5vOWchiddXG5cdFx0XHRcdFx0XHRsYW5nOiBsb2NhbGVcblxuXHRcdGVsc2UgaWYgKGZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIiBvciBmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmaWVsZC5zaG93SWNvblxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cblx0XHRcdGlmICFmaWVsZC5oaWRkZW5cblxuXHRcdFx0XHRmcy5hdXRvZm9ybS5maWx0ZXJzID0gZmllbGQuZmlsdGVyc1xuXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlcGVuZE9uID0gZmllbGQuZGVwZW5kX29uXG5cblx0XHRcdFx0aWYgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXG5cdFx0XHRcdFx0ZnMuYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uXG5cblx0XHRcdFx0ZnMuZmlsdGVyc0Z1bmN0aW9uID0gaWYgZmllbGQuZmlsdGVyc0Z1bmN0aW9uIHRoZW4gZmllbGQuZmlsdGVyc0Z1bmN0aW9uIGVsc2UgQ3JlYXRvci5ldmFsdWF0ZUZpbHRlcnNcblxuXHRcdFx0XHRpZiBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblx0XHRcdFx0XHRmcy5vcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblxuXHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0aWYgZmllbGQuY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmllbGQucmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRcdF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b11cblx0XHRcdFx0XHRcdFx0XHRpZiBfcmVmX29iaj8ucGVybWlzc2lvbnM/LmFsbG93Q3JlYXRlXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5jcmVhdGVGdW5jdGlvbiA9IChsb29rdXBfZmllbGQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0TW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLiN7Q3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bykuX25hbWV9XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9ybUlkOiBcIm5ldyN7ZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCdfJyl9XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IFwiI3tmaWVsZC5yZWZlcmVuY2VfdG99XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3BlcmF0aW9uOiBcImluc2VydFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uU3VjY2VzczogKG9wZXJhdGlvbiwgcmVzdWx0KS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZXN1bHQub2JqZWN0X25hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiByZXN1bHQub2JqZWN0X25hbWUgPT0gXCJvYmplY3RzXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFt7bGFiZWw6IHJlc3VsdC52YWx1ZS5sYWJlbCwgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLCBpY29uOiByZXN1bHQudmFsdWUuaWNvbn1dLCByZXN1bHQudmFsdWUubmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFt7bGFiZWw6IHJlc3VsdC52YWx1ZVtvYmplY3QuTkFNRV9GSUVMRF9LRVldIHx8IHJlc3VsdC52YWx1ZS5sYWJlbCB8fCByZXN1bHQudmFsdWUubmFtZSwgdmFsdWU6IHJlc3VsdC5faWR9XSwgcmVzdWx0Ll9pZClcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmYWxzZVxuXG5cdFx0XHRcdFx0aWYgXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKVxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlXG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2Vfc29ydFxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc1NvcnQgPSBmaWVsZC5yZWZlcmVuY2Vfc29ydFxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX2xpbWl0XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTGltaXQgPSBmaWVsZC5yZWZlcmVuY2VfbGltaXRcblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZVRvRmllbGQgPSBmaWVsZC5yZWZlcmVuY2VfdG9fZmllbGRcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90byA9PSBcInVzZXJzXCJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdHVzZXJcIlxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOihqOekuui/h+a7pOaVsOaNruaXtuaYr+WQpuWPquaYvuekuuacrOWIhumDqOS4i+eahOaVsOaNrlxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOWPr+S7peiiq+aUueWGmeimhuebluaIkHRydWUvZmFsc2XmiJblhbbku5ZmdW5jdGlvblxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdFx0IyDmnKrlrprkuYlpc19jb21wYW55X2xpbWl0ZWTlsZ7mgKfml7bpu5jorqTlpITnkIbpgLvovpHvvJpcblx0XHRcdFx0XHRcdFx0XHQjIOWvueW9k+WJjeWvueixoeaciXZpZXdBbGxSZWNvcmRz5p2D6ZmQ5YiZ5LiN6ZmQ5Yi25omA5bGe5YiG6YOo5YiX6KGo5p+l55yL5p2D6ZmQ77yM5ZCm5YiZ5Y+q5pi+56S65b2T5YmN5omA5bGe5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnM/LmdldCgpXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzlrZfmrrXmiYDlsZ7lr7nosaHmmK/nlKjmiLfmiJbnu4Tnu4fvvIzliJnmmK/lkKbpmZDliLbmmL7npLrmiYDlsZ7liIbpg6jpg6jpl6jkuI5tb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5YWz6IGUXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzVW5MaW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRnVuY3Rpb24gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHQjIOS8oOWFpeW9k+WJjeWvueixoeeahOadg+mZkO+8jOWcqOWHveaVsOS4reagueaNruadg+mZkOiuoeeul+aYr+WQpuimgemZkOWItuWPquafpeeci+acrOWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucylcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOacjeWKoeerr+eUqOS4jeWIsGlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdGVsc2UgaWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwib3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RvcmdcIlxuXHRcdFx0XHRcdFx0aWYgIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdFxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOihqOekuui/h+a7pOaVsOaNruaXtuaYr+WQpuWPquaYvuekuuacrOWIhumDqOS4i+eahOaVsOaNrlxuXHRcdFx0XHRcdFx0XHQjIGlzX2NvbXBhbnlfbGltaXRlZOWPr+S7peiiq+aUueWGmeimhuebluaIkHRydWUvZmFsc2XmiJblhbbku5ZmdW5jdGlvblxuXHRcdFx0XHRcdFx0XHRpZiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdFx0IyDmnKrlrprkuYlpc19jb21wYW55X2xpbWl0ZWTlsZ7mgKfml7bpu5jorqTlpITnkIbpgLvovpHvvJpcblx0XHRcdFx0XHRcdFx0XHQjIOWvueW9k+WJjeWvueixoeaciXZpZXdBbGxSZWNvcmRz5p2D6ZmQ5YiZ5LiN6ZmQ5Yi25omA5bGe5YiG6YOo5YiX6KGo5p+l55yL5p2D6ZmQ77yM5ZCm5YiZ5Y+q5pi+56S65b2T5YmN5omA5bGe5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0IyDms6jmhI/kuI3mmK9yZWZlcmVuY2VfdG/lr7nosaHnmoR2aWV3QWxsUmVjb3Jkc+adg+mZkO+8jOiAjOaYr+W9k+WJjeWvueixoeeahFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvYmoucGVybWlzc2lvbnM/LmdldCgpXG5cdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpzlrZfmrrXmiYDlsZ7lr7nosaHmmK/nlKjmiLfmiJbnu4Tnu4fvvIzliJnmmK/lkKbpmZDliLbmmL7npLrmiYDlsZ7liIbpg6jpg6jpl6jkuI5tb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5YWz6IGUXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGlzVW5MaW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRnVuY3Rpb24gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHQjIOS8oOWFpeW9k+WJjeWvueixoeeahOadg+mZkO+8jOWcqOWHveaVsOS4reagueaNruadg+mZkOiuoeeul+aYr+WQpuimgemZkOWItuWPquafpeeci+acrOWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucylcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHQjIOacjeWKoeerr+eUqOS4jeWIsGlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGlmIHR5cGVvZihmaWVsZC5yZWZlcmVuY2VfdG8pID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKClcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoX3JlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdFx0XHRcdFx0XHRmcy5ibGFja2JveCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub2JqZWN0U3dpdGNoZSA9IHRydWVcblxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogU3RyaW5nXG5cdFx0XHRcdFx0XHRcdFx0YXV0b2Zvcm06IHtvbWl0OiB0cnVlfVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogW1N0cmluZ11cblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dXG5cblx0XHRcdFx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV90b1swXV1cblx0XHRcdFx0XHRcdGlmIF9vYmplY3QgYW5kIF9vYmplY3QuZW5hYmxlX3RyZWVcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCJcblxuXHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfVxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMgPSBbXVxuXHRcdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8uZm9yRWFjaCAoX3JlZmVyZW5jZSktPlxuXHRcdFx0XHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlXVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgX29iamVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBfb2JqZWN0Py5sYWJlbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGljb246IF9vYmplY3Q/Lmljb25cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW5rOiAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2gge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdDogX3JlZmVyZW5jZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0SWNvbiA9IGZpZWxkLmRlZmF1bHRJY29uXG5cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2hvd0ljb24gPSBmYWxzZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RcIlxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9uc1xuXHRcdFx0XHRpZiBfLmhhcyhmaWVsZCwgJ2ZpcnN0T3B0aW9uJylcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IGZpZWxkLmZpcnN0T3B0aW9uXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCJcblx0XHRcdCMg5Zug5Li65YiX6KGo6KeG5Zu+5Y+z5L6n6L+H5ruk5Zmo6L+Y5piv55So55qE6ICB6KGo5Y2V55qEbG9va3Vw5ZKMc2VsZWN05o6n5Lu277yM5omA5Lul5LiK6Z2i55qE5Luj56CB5aeL57uI5L+d5oyB5Y6f5qC36ZyA6KaB5omn6KGMXG5cdFx0XHQjIOS4i+mdouaYr+mFjee9ruS6hmRhdGFfdHlwZeaXtu+8jOmineWkluWkhOeQhueahOmAu+i+kVxuXHRcdFx0aWYgZmllbGQuZGF0YV90eXBlIGFuZCBmaWVsZC5kYXRhX3R5cGUgIT0gXCJ0ZXh0XCJcblx0XHRcdFx0aWYgW1wibnVtYmVyXCIsIFwiY3VycmVuY3lcIiwgXCJwZXJjZW50XCJdLmluZGV4T2YoZmllbGQuZGF0YV90eXBlKSA+IC0xXG5cdFx0XHRcdFx0ZnNUeXBlID0gTnVtYmVyXG5cdFx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5kYXRhX3R5cGUgPT0gXCJib29sZWFuXCJcblx0XHRcdFx0XHRmc1R5cGUgPSBCb29sZWFuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmc1R5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMudHlwZSA9IGZzVHlwZVxuXHRcdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRcdGZzLnR5cGUgPSBbZnNUeXBlXVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zID0gQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zKGZpZWxkKVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImN1cnJlbmN5XCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHRpZiBmaWVsZD8uc2NhbGVcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZVxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdFx0ZWxzZSBpZiBmaWVsZD8uc2NhbGUgIT0gMFxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IDJcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJudW1iZXJcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYm9vbGVhblwiXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tY2hlY2tib3hcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRvZ2dsZVwiXG5cdFx0XHRmcy50eXBlID0gQm9vbGVhblxuXHRcdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJyZWZlcmVuY2VcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCJcblx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZmlsZVwiXG5cdFx0XHRjb2xsZWN0aW9uTmFtZSA9IGZpZWxkLmNvbGxlY3Rpb24gfHwgXCJmaWxlc1wiICMgY29sbGVjdGlvbiDpu5jorqTmmK8gJ2ZpbGVzJ1xuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gY29sbGVjdGlvbk5hbWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlc2l6ZVwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVzaXplJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT0gXCJvYmplY3RcIlxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImdyaWRcIlxuXHRcdFx0ZnMudHlwZSA9IEFycmF5XG5cdFx0XHRmcy5hdXRvZm9ybS5lZGl0YWJsZSA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCJcblxuXHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0dHlwZTogT2JqZWN0XG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaW1hZ2VcIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICdpbWFnZXMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF2YXRhclwiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F2YXRhcnMnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICdpbWFnZS8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJhdWRpb1wiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2F1ZGlvcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2F1ZGlvLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidmlkZW9cIlxuXHRcdFx0aWYgZmllbGQubXVsdGlwbGVcblx0XHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9XG5cdFx0XHRcdFx0YXV0b2Zvcm06XG5cdFx0XHRcdFx0XHR0eXBlOiAnZmlsZVVwbG9hZCdcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb246ICd2aWRlb3MnXG5cdFx0XHRcdFx0XHRhY2NlcHQ6ICd2aWRlby8qJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLnR5cGUgPSBPYmplY3Rcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCJcblx0XHRcdGZzLmF1dG9mb3JtLnN5c3RlbSA9IGZpZWxkLnN5c3RlbSB8fCBcIndnczg0XCJcblx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm1hcmtkb3duXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtbWFya2Rvd25cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAndXJsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0IyBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5Vcmxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc1VybCdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2VtYWlsJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMucmVnRXggPSBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ2Zvcm11bGEnXG5cdFx0XHRmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtmaWVsZHM6IHtmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHt0eXBlOiBmaWVsZC5kYXRhX3R5cGV9KX19KVtmaWVsZC5uYW1lXVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc3VtbWFyeSdcblx0XHRcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0IyBlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3NlbGVjdCdcblx0XHQjIFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3BlcmNlbnQnXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxuXHRcdFx0dW5sZXNzIF8uaXNOdW1iZXIoZmllbGQuc2NhbGUpXG5cdFx0XHRcdCMg5rKh6YWN572u5bCP5pWw5L2N5pWw5YiZ5oyJ5bCP5pWw5L2N5pWwMOadpeWkhOeQhu+8jOWNs+m7mOiupOaYvuekuuS4uuaVtOaVsOeahOeZvuWIhuavlO+8jOavlOWmgjIwJe+8jOatpOaXtuaOp+S7tuWPr+S7pei+k+WFpTLkvY3lsI/mlbDvvIzovazmiJDnmb7liIbmr5TlsLHmmK/mlbTmlbBcblx0XHRcdFx0ZmllbGQuc2NhbGUgPSAwXG5cdFx0XHQjIGF1dG9mb3Jt5o6n5Lu25Lit5bCP5pWw5L2N5pWw5aeL57uI5q+U6YWN572u55qE5L2N5pWw5aSaMuS9jVxuXHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZSArIDJcblx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0ZnMudHlwZSA9IGZpZWxkLnR5cGVcblxuXHRcdGlmIGZpZWxkLmxhYmVsXG5cdFx0XHRmcy5sYWJlbCA9IGZpZWxkLmxhYmVsXG5cbiNcdFx0aWYgZmllbGQuYWxsb3dlZFZhbHVlc1xuI1x0XHRcdGZzLmFsbG93ZWRWYWx1ZXMgPSBmaWVsZC5hbGxvd2VkVmFsdWVzXG5cblx0XHRpZiAhZmllbGQucmVxdWlyZWRcblx0XHRcdGZzLm9wdGlvbmFsID0gdHJ1ZVxuXG5cdFx0IyBb562+57qm5a+56LGh5ZCM5pe26YWN572u5LqGY29tcGFueV9pZHPlv4Xloavlj4p1bmVkaXRhYmxlX2ZpZWxkc+mAoOaIkOmDqOWIhueUqOaIt+aWsOW7uuetvue6puWvueixoeaXtuaKpemUmSAjMTkyXShodHRwczovL2dpdGh1Yi5jb20vc3RlZWRvcy9zdGVlZG9zLXByb2plY3QtZHp1Zy9pc3N1ZXMvMTkyKVxuXHRcdCMg5ZCO5Y+w5aeL57uI6K6+572ucmVxdWlyZWTkuLpmYWxzZVxuXHRcdGlmICFNZXRlb3IuaXNDbGllbnRcblx0XHRcdGZzLm9wdGlvbmFsID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQudW5pcXVlXG5cdFx0XHRmcy51bmlxdWUgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5vbWl0XG5cdFx0XHRmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuZ3JvdXBcblx0XHRcdGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXBcblxuXHRcdGlmIGZpZWxkLmlzX3dpZGVcblx0XHRcdGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5oaWRkZW5cblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiXG5cblx0XHRpZiAoZmllbGQudHlwZSA9PSBcInNlbGVjdFwiKSBvciAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBvciAoZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5maWx0ZXJhYmxlKSA9PSAndW5kZWZpbmVkJ1xuXHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxuXHRcdGlmIGZpZWxkLm5hbWUgPT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWVcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5zZWFyY2hhYmxlKSA9PSAndW5kZWZpbmVkJ1xuXHRcdFx0XHRmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZVxuXG5cdFx0aWYgYXV0b2Zvcm1fdHlwZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGVcblxuXHRcdGlmIGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9ICgpLT5cblx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7dXNlcklkOiBNZXRlb3IudXNlcklkKCksIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgbm93OiBuZXcgRGF0ZSgpfSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cdFx0XHQjIFx0aWYgIV8uaXNGdW5jdGlvbihmaWVsZC5kZWZhdWx0VmFsdWUpXG5cdFx0XHQjIFx0XHRmcy5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblxuXHRcdGlmIGZpZWxkLnJlYWRvbmx5XG5cdFx0XHRmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmRpc2FibGVkXG5cdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmlubGluZUhlbHBUZXh0XG5cdFx0XHRmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0XG5cblx0XHRpZiBmaWVsZC5ibGFja2JveFxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21pbicpXG5cdFx0XHRmcy5taW4gPSBmaWVsZC5taW5cblx0XHRpZiBfLmhhcyhmaWVsZCwgJ21heCcpXG5cdFx0XHRmcy5tYXggPSBmaWVsZC5tYXhcblxuXHRcdCMg5Y+q5pyJ55Sf5Lqn546v5aKD5omN6YeN5bu657Si5byVXG5cdFx0aWYgTWV0ZW9yLmlzUHJvZHVjdGlvblxuXHRcdFx0aWYgZmllbGQuaW5kZXhcblx0XHRcdFx0ZnMuaW5kZXggPSBmaWVsZC5pbmRleFxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5zb3J0YWJsZVxuXHRcdFx0XHRmcy5pbmRleCA9IHRydWVcblxuXHRcdHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzXG5cblx0cmV0dXJuIHNjaGVtYVxuXG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKS0+XG5cdGh0bWwgPSBmaWVsZF92YWx1ZVxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdHJldHVybiBcIlwiXG5cdGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKVxuXHRpZiAhZmllbGRcblx0XHRyZXR1cm4gXCJcIlxuXG5cdGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0aHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKVxuXHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRlXCJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxuXG5cdHJldHVybiBodG1sXG5cbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gKGZpZWxkX3R5cGUpLT5cblx0cmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcInRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXG5DcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyA9IChmaWVsZF90eXBlLCBvcGVyYXRpb25zKS0+XG5cdGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXG5cdGlmIGJ1aWx0aW5WYWx1ZXNcblx0XHRfLmZvckVhY2ggYnVpbHRpblZhbHVlcywgKGJ1aWx0aW5JdGVtLCBrZXkpLT5cblx0XHRcdG9wZXJhdGlvbnMucHVzaCh7bGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLCB2YWx1ZToga2V5fSlcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IChmaWVsZF90eXBlLCBpc19jaGVja19vbmx5KS0+XG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxuXHQjIOi/h+a7pOWZqOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwga2V5KVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUsIHZhbHVlKS0+XG5cdCMg5qC55o2u6L+H5ruk5Zmo55qE6L+H5ruk5YC877yM6I635Y+W5a+55bqU55qE5YaF572u6L+Q566X56ymXG5cdCMg5q+U5aaCdmFsdWXkuLpsYXN0X3llYXLvvIzov5Tlm55iZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXG5cdHVubGVzcyBfLmlzU3RyaW5nKHZhbHVlKVxuXHRcdHJldHVyblxuXHRiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSlcblx0dW5sZXNzIGJldHdlZW5CdWlsdGluVmFsdWVzXG5cdFx0cmV0dXJuXG5cdHJlc3VsdCA9IG51bGxcblx0Xy5lYWNoIGJldHdlZW5CdWlsdGluVmFsdWVzLCAoaXRlbSwgb3BlcmF0aW9uKS0+XG5cdFx0aWYgaXRlbS5rZXkgPT0gdmFsdWVcblx0XHRcdHJlc3VsdCA9IG9wZXJhdGlvblxuXHRyZXR1cm4gcmVzdWx0XG5cbiMg5aaC5p6c5Y+q5piv5Li65Yik5patb3BlcmF0aW9u5piv5ZCm5a2Y5Zyo77yM5YiZ5rKh5b+F6KaB6K6h566XdmFsdWVz77yM5Lyg5YWlaXNfY2hlY2tfb25seeS4unRydWXljbPlj69cbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzID0gKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpLT5cblx0IyDov4fmu6Tlmajml7bpl7TlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0cmV0dXJuIHtcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcblx0XHRcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcblx0XHRcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcblx0fVxuXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gKG1vbnRoKS0+XG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHRyZXR1cm4gMFxuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdHJldHVybiAzXG5cdGVsc2UgaWYgbW9udGggPCA5XG5cdFx0cmV0dXJuIDZcblx0XG5cdHJldHVybiA5XG5cblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gKHllYXIsbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHR5ZWFyLS1cblx0XHRtb250aCA9IDlcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRtb250aCA9IDBcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRtb250aCA9IDNcblx0ZWxzZSBcblx0XHRtb250aCA9IDZcblx0XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0aWYgbW9udGggPCAzXG5cdFx0bW9udGggPSAzXG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0bW9udGggPSA2XG5cdGVsc2UgaWYgbW9udGggPCA5XG5cdFx0bW9udGggPSA5XG5cdGVsc2Vcblx0XHR5ZWFyKytcblx0XHRtb250aCA9IDBcblx0XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblxuQ3JlYXRvci5nZXRNb250aERheXMgPSAoeWVhcixtb250aCktPlxuXHRpZiBtb250aCA9PSAxMVxuXHRcdHJldHVybiAzMVxuXHRcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cdHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgrMSwgMSlcblx0ZGF5cyA9IChlbmREYXRlLXN0YXJ0RGF0ZSkvbWlsbGlzZWNvbmRcblx0cmV0dXJuIGRheXNcblxuQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheSA9ICh5ZWFyLCBtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdCMg5pyI5Lu95Li6MOS7o+ihqOacrOW5tOeahOesrOS4gOaciFxuXHRpZiBtb250aCA9PSAwXG5cdFx0bW9udGggPSAxMVxuXHRcdHllYXItLVxuXHRcdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5cdCMg5ZCm5YiZLOWPquWHj+WOu+aciOS7vVxuXHRtb250aC0tO1xuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdFxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XG5cdCMg6L+H5ruk5ZmoYmV0d2Vlbui/kOeul+espu+8jOeOsOeul+aXpeacny/ml6XmnJ/ml7bpl7TnsbvlnovlrZfmrrXnmoR2YWx1ZXPlgLxcblx0bm93ID0gbmV3IERhdGUoKVxuXHQjIOS4gOWkqeeahOavq+enkuaVsFxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcblx0eWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0dG9tb3Jyb3cgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXG5cdCMg5LiA5ZGo5Lit55qE5p+Q5LiA5aSpXG5cdHdlZWsgPSBub3cuZ2V0RGF5KClcblx0IyDlh4/ljrvnmoTlpKnmlbBcblx0bWludXNEYXkgPSBpZiB3ZWVrICE9IDAgdGhlbiB3ZWVrIC0gMSBlbHNlIDZcblx0bW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSlcblx0c3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKVxuXHQjIOS4iuWRqOaXpVxuXHRsYXN0U3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOS4iuWRqOS4gFxuXHRsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSlcblx0IyDkuIvlkajkuIBcblx0bmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcblx0IyDkuIvlkajml6Vcblx0bmV4dFN1bmRheSA9IG5ldyBEYXRlKG5leHRNb25kYXkuZ2V0VGltZSgpICsgKG1pbGxpc2Vjb25kICogNikpXG5cdGN1cnJlbnRZZWFyID0gbm93LmdldEZ1bGxZZWFyKClcblx0cHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxXG5cdG5leHRZZWFyID0gY3VycmVudFllYXIgKyAxXG5cdCMg5b2T5YmN5pyI5Lu9XG5cdGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpXG5cdCMg6K6h5pWw5bm044CB5pyIXG5cdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRtb250aCA9IG5vdy5nZXRNb250aCgpXG5cdCMg5pys5pyI56ys5LiA5aSpXG5cdGZpcnN0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsY3VycmVudE1vbnRoLDEpXG5cblx0IyDlvZPkuLoxMuaciOeahOaXtuWAmeW5tOS7vemcgOimgeWKoDFcblx0IyDmnIjku73pnIDopoHmm7TmlrDkuLowIOS5n+WwseaYr+S4i+S4gOW5tOeahOesrOS4gOS4quaciFxuXHRpZiBjdXJyZW50TW9udGggPT0gMTFcblx0XHR5ZWFyKytcblx0XHRtb250aCsrXG5cdGVsc2Vcblx0XHRtb250aCsrXG5cdFxuXHQjIOS4i+aciOesrOS4gOWkqVxuXHRuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHQjIOS4i+aciOacgOWQjuS4gOWkqVxuXHRuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsbW9udGgsQ3JlYXRvci5nZXRNb250aERheXMoeWVhcixtb250aCkpXG5cdCMg5pys5pyI5pyA5ZCO5LiA5aSpXG5cdGxhc3REYXkgPSBuZXcgRGF0ZShuZXh0TW9udGhGaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0IyDkuIrmnIjnrKzkuIDlpKlcblx0bGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIrmnIjmnIDlkI7kuIDlpKlcblx0bGFzdE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZShmaXJzdERheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0IyDmnKzlraPluqblvIDlp4vml6Vcblx0dGhpc1F1YXJ0ZXJTdGFydERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwxKVxuXHQjIOacrOWto+W6pue7k+adn+aXpVxuXHR0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSsyKSlcblx0IyDkuIrlraPluqblvIDlp4vml6Vcblx0bGFzdFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiK5a2j5bqm57uT5p2f5pelXG5cdGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMikpXG5cdCMg5LiL5a2j5bqm5byA5aeL5pelXG5cdG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4i+Wto+W6pue7k+adn+aXpVxuXHRuZXh0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxuXHQjIOi/h+WOuzflpKkgXG5cdGxhc3RfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg2ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzMw5aSpXG5cdGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67NjDlpKlcblx0bGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrs5MOWkqVxuXHRsYXN0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDg5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzEyMOWkqVxuXHRsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lN+WkqSBcblx0bmV4dF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lMzDlpKlcblx0bmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU2MOWkqVxuXHRuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTkw5aSpXG5cdG5leHRfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoODkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lMTIw5aSpXG5cdG5leHRfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDExOSAqIG1pbGxpc2Vjb25kKSlcblxuXHRzd2l0Y2gga2V5XG5cdFx0d2hlbiBcImxhc3RfeWVhclwiXG5cdFx0XHQj5Y675bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7cHJldmlvdXNZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfeWVhclwiXG5cdFx0XHQj5LuK5bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7Y3VycmVudFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7Y3VycmVudFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3llYXJcIlxuXHRcdFx0I+aYjuW5tFxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje25leHRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF9xdWFydGVyXCJcblx0XHRcdCPkuIrlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc19xdWFydGVyXCJcblx0XHRcdCPmnKzlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF9xdWFydGVyXCJcblx0XHRcdCPkuIvlraPluqZcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF9tb250aFwiXG5cdFx0XHQj5LiK5pyIXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc19tb250aFwiXG5cdFx0XHQj5pys5pyIXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChmaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X21vbnRoXCJcblx0XHRcdCPkuIvmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X3dlZWtcIlxuXHRcdFx0I+S4iuWRqFxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChsYXN0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfd2Vla1wiXG5cdFx0XHQj5pys5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3dlZWtcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfd2Vla1wiXG5cdFx0XHQj5LiL5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobmV4dE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwieWVzdGRheVwiXG5cdFx0XHQj5pio5aSpXG5cdFx0XHRzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3llc3RkYXlcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidG9kYXlcIlxuXHRcdFx0I+S7iuWkqVxuXHRcdFx0c3RyVG9kYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b2RheVwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb2RheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRvbW9ycm93XCJcblx0XHRcdCPmmI7lpKlcblx0XHRcdHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJUb21vcnJvd31UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfN19kYXlzXCJcblx0XHRcdCPov4fljrs35aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSBcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfMzBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67MzDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfNjBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67NjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfOTBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67OTDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfMTIwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzEyMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzdfZGF5c1wiXG5cdFx0XHQj5pyq5p2lN+WkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfMzBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lMzDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfNjBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lNjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfOTBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lOTDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfMTIwX2RheXNcIlxuXHRcdFx0I+acquadpTEyMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcblx0dmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXVxuXHRpZiBmaWVsZF90eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdCMg5pe26Ze057G75Z6L5a2X5q6177yM5YaF572u5pe26Ze06IyD5Zu05bqU6K+l6ICD6JmR5YGP56e75pe25Yy65YC877yM5ZCm5YiZ6L+H5ruk5pWw5o2u5a2Y5Zyo5YGP5beuXG5cdFx0IyDpnZ7lhoXnva7ml7bpl7TojIPlm7Tml7bvvIznlKjmiLfpgJrov4fml7bpl7Tmjqfku7bpgInmi6nnmoTojIPlm7TvvIzkvJroh6rliqjlpITnkIbml7bljLrlgY/lt67mg4XlhrVcblx0XHQjIOaXpeacn+exu+Wei+Wtl+aute+8jOaVsOaNruW6k+acrOadpeWwseWtmOeahOaYr1VUQ+eahDDngrnvvIzkuI3lrZjlnKjlgY/lt65cblx0XHRfLmZvckVhY2ggdmFsdWVzLCAoZnYpLT5cblx0XHRcdGlmIGZ2XG5cdFx0XHRcdGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjAgKVxuXHRcblx0cmV0dXJuIHtcblx0XHRsYWJlbDogbGFiZWxcblx0XHRrZXk6IGtleVxuXHRcdHZhbHVlczogdmFsdWVzXG5cdH1cblxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSktPlxuXHRpZiBmaWVsZF90eXBlICYmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuICdiZXR3ZWVuJ1xuXHRlbHNlIGlmIFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gJ2NvbnRhaW5zJ1xuXHRlbHNlXG5cdFx0cmV0dXJuIFwiPVwiXG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSAoZmllbGRfdHlwZSkgLT5cblx0IyDml6XmnJ/nsbvlnos6IGRhdGUsIGRhdGV0aW1lICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcblx0IyDmlofmnKznsbvlnos6IHRleHQsIHRleHRhcmVhLCBodG1sICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiY29udGFpbnNcIiwgXCJub3Rjb250YWluc1wiLCBcInN0YXJ0c3dpdGhcIlxuXHQjIOmAieaLqeexu+WeizogbG9va3VwLCBtYXN0ZXJfZGV0YWlsLCBzZWxlY3Qg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cdCMg5pWw5YC857G75Z6LOiBjdXJyZW5jeSwgbnVtYmVyICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCIsIFwiPFwiLCBcIj5cIiwgXCI8PVwiLCBcIj49XCJcblx0IyDluIPlsJTnsbvlnos6IGJvb2xlYW4gIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxuXHQjIOaVsOe7hOexu+WeizogY2hlY2tib3gsIFt0ZXh0XSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cblx0b3B0aW9uYWxzID0ge1xuXHRcdGVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksIHZhbHVlOiBcIj1cIn0sXG5cdFx0dW5lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksIHZhbHVlOiBcIjw+XCJ9LFxuXHRcdGxlc3NfdGhhbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSwgdmFsdWU6IFwiPFwifSxcblx0XHRncmVhdGVyX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksIHZhbHVlOiBcIj5cIn0sXG5cdFx0bGVzc19vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksIHZhbHVlOiBcIjw9XCJ9LFxuXHRcdGdyZWF0ZXJfb3JfZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLCB2YWx1ZTogXCI+PVwifSxcblx0XHRjb250YWluczoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLCB2YWx1ZTogXCJjb250YWluc1wifSxcblx0XHRub3RfY29udGFpbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksIHZhbHVlOiBcIm5vdGNvbnRhaW5zXCJ9LFxuXHRcdHN0YXJ0c193aXRoOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksIHZhbHVlOiBcInN0YXJ0c3dpdGhcIn0sXG5cdFx0YmV0d2Vlbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksIHZhbHVlOiBcImJldHdlZW5cIn0sXG5cdH1cblxuXHRpZiBmaWVsZF90eXBlID09IHVuZGVmaW5lZFxuXHRcdHJldHVybiBfLnZhbHVlcyhvcHRpb25hbHMpXG5cblx0b3BlcmF0aW9ucyA9IFtdXG5cblx0aWYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pXG5cdFx0Q3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucylcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwidGV4dFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0YXJlYVwiIG9yIGZpZWxkX3R5cGUgPT0gXCJodG1sXCIgb3IgZmllbGRfdHlwZSA9PSBcImNvZGVcIlxuI1x0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmNvbnRhaW5zLCBvcHRpb25hbHMubm90X2NvbnRhaW4sIG9wdGlvbmFscy5zdGFydHNfd2l0aClcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmNvbnRhaW5zKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJsb29rdXBcIiBvciBmaWVsZF90eXBlID09IFwibWFzdGVyX2RldGFpbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJzZWxlY3RcIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJjdXJyZW5jeVwiIG9yIGZpZWxkX3R5cGUgPT0gXCJudW1iZXJcIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMubGVzc190aGFuLCBvcHRpb25hbHMuZ3JlYXRlcl90aGFuLCBvcHRpb25hbHMubGVzc19vcl9lcXVhbCwgb3B0aW9uYWxzLmdyZWF0ZXJfb3JfZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImJvb2xlYW5cIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJjaGVja2JveFwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcIlt0ZXh0XVwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2Vcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblxuXHRyZXR1cm4gb3BlcmF0aW9uc1xuXG4jIyNcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3RGaWVsZHNOYW1lID0gKG9iamVjdF9uYW1lKS0+XG5cdGZpZWxkcyA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKT8uZmllbGRzXG5cdGZpZWxkc0FyciA9IFtdXG5cblx0Xy5lYWNoIGZpZWxkcywgKGZpZWxkKS0+XG5cdFx0ZmllbGRzQXJyLnB1c2gge25hbWU6IGZpZWxkLm5hbWUsIHNvcnRfbm86IGZpZWxkLnNvcnRfbm99XG5cblx0ZmllbGRzTmFtZSA9IFtdXG5cdF8uZWFjaCBfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgKGZpZWxkKS0+XG5cdFx0ZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpXG5cdHJldHVybiBmaWVsZHNOYW1lXG4iLCJDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMgPSBmdW5jdGlvbihmaWVsZFNjaGVtYSkge1xuICB2YXIgZGF0YV90eXBlLCBvcHRpb25zO1xuICBvcHRpb25zID0gZmllbGRTY2hlbWEub3B0aW9ucztcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRhdGFfdHlwZSA9IGZpZWxkU2NoZW1hLmRhdGFfdHlwZTtcbiAgaWYgKCFfLmlzRnVuY3Rpb24ob3B0aW9ucykgJiYgZGF0YV90eXBlICYmIGRhdGFfdHlwZSAhPT0gJ3RleHQnKSB7XG4gICAgb3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG9wdGlvbkl0ZW0pIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uSXRlbS52YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFsnbnVtYmVyJywgJ2N1cnJlbmN5JywgJ3BlcmNlbnQnXS5pbmRleE9mKGRhdGFfdHlwZSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gb3B0aW9uSXRlbS52YWx1ZSA9IE51bWJlcihvcHRpb25JdGVtLnZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YV90eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbkl0ZW0udmFsdWUgPSBvcHRpb25JdGVtLnZhbHVlID09PSAndHJ1ZSc7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFNjaGVtYSA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgZmllbGRzQXJyLCBzY2hlbWE7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNjaGVtYSA9IHt9O1xuICBmaWVsZHNBcnIgPSBbXTtcbiAgXy5lYWNoKG9iai5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKCFfLmhhcyhmaWVsZCwgXCJuYW1lXCIpKSB7XG4gICAgICBmaWVsZC5uYW1lID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKGZpZWxkKTtcbiAgfSk7XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICB2YXIgX29iamVjdCwgX3JlZl9vYmosIF9yZWZlcmVuY2VfdG8sIGF1dG9mb3JtX3R5cGUsIGNvbGxlY3Rpb25OYW1lLCBmaWVsZF9uYW1lLCBmcywgZnNUeXBlLCBpc1VuTGltaXRlZCwgbG9jYWxlLCBwZXJtaXNzaW9ucywgcmVmLCByZWYxLCByZWYyLCByZWYzO1xuICAgIGZpZWxkX25hbWUgPSBmaWVsZC5uYW1lO1xuICAgIGZzID0ge307XG4gICAgaWYgKGZpZWxkLnJlZ0V4KSB7XG4gICAgICBmcy5yZWdFeCA9IGZpZWxkLnJlZ0V4O1xuICAgIH1cbiAgICBmcy5hdXRvZm9ybSA9IHt9O1xuICAgIGZzLmF1dG9mb3JtLm11bHRpcGxlID0gZmllbGQubXVsdGlwbGU7XG4gICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgIGF1dG9mb3JtX3R5cGUgPSAocmVmID0gZmllbGQuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMDtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGQudHlwZSA9PT0gXCJwaG9uZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbdGV4dF1cIiB8fCBmaWVsZC50eXBlID09PSBcIltwaG9uZV1cIikge1xuICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwidGFnc1wiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2NvZGUnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyO1xuICAgICAgaWYgKGZpZWxkLmxhbmd1YWdlKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmxhbmd1YWdlID0gZmllbGQubGFuZ3VhZ2U7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicGFzc3dvcmRcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIixcbiAgICAgICAgICAgICAgICBwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgICBkYXRlTW9iaWxlT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLm91dEZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiBcInRpbWVcIixcbiAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwiSEg6bW1cIlxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCIsXG4gICAgICAgICAgICAgICAgcGlja2VyVHlwZTogXCJyb2xsZXJzXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PT0gXCJ6aC1DTlwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAgICAgfVxuICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgdHlwZTogXCJzdW1tZXJub3RlXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiAnc3VtbWVybm90ZS1lZGl0b3InLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICAgIGRpYWxvZ3NJbkJvZHk6IHRydWUsXG4gICAgICAgICAgICB0b29sYmFyOiBbWydmb250MScsIFsnc3R5bGUnXV0sIFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSwgWydmb250MycsIFsnZm9udG5hbWUnXV0sIFsnY29sb3InLCBbJ2NvbG9yJ11dLCBbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSwgWyd0YWJsZScsIFsndGFibGUnXV0sIFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sIFsndmlldycsIFsnY29kZXZpZXcnXV1dLFxuICAgICAgICAgICAgZm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCAn6buR5L2TJywgJ+W+rui9r+mbhem7kScsICfku7/lrosnLCAn5qW35L2TJywgJ+matuS5picsICflubzlnIYnXSxcbiAgICAgICAgICAgIGxhbmc6IGxvY2FsZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIH1cbiAgICAgIGlmICghZmllbGQuaGlkZGVuKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzO1xuICAgICAgICBmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vbjtcbiAgICAgICAgaWYgKGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbikge1xuICAgICAgICAgIGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBmcy5maWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPyBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gOiBDcmVhdG9yLmV2YWx1YXRlRmlsdGVycztcbiAgICAgICAgaWYgKGZpZWxkLm9wdGlvbnNGdW5jdGlvbikge1xuICAgICAgICAgIGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgICAgIGlmIChfcmVmX29iaiAhPSBudWxsID8gKHJlZjEgPSBfcmVmX29iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjEuYWxsb3dDcmVhdGUgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKGxvb2t1cF9maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICBmb3JtSWQ6IFwibmV3XCIgKyAoZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCAnXycpKSxcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogXCJcIiArIGZpZWxkLnJlZmVyZW5jZV90byxcbiAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbihvcGVyYXRpb24sIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lm9iamVjdF9uYW1lID09PSBcIm9iamVjdHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogcmVzdWx0LnZhbHVlLmljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC52YWx1ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0Ll9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3NvcnQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfbGltaXQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90b19maWVsZCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlVG9GaWVsZCA9IGZpZWxkLnJlZmVyZW5jZV90b19maWVsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYyID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMi5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJvcmdhbml6YXRpb25zXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMyA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjMuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmllbGQucmVmZXJlbmNlX3RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoX3JlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgICAgICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogW1N0cmluZ10sXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXTtcbiAgICAgICAgICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI7XG4gICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdO1xuICAgICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8uZm9yRWFjaChmdW5jdGlvbihfcmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdO1xuICAgICAgICAgICAgICAgICAgaWYgKF9vYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmxhYmVsIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGljb246IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgICAgaWYgKF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZmllbGQuZGF0YV90eXBlICYmIGZpZWxkLmRhdGFfdHlwZSAhPT0gXCJ0ZXh0XCIpIHtcbiAgICAgICAgaWYgKFtcIm51bWJlclwiLCBcImN1cnJlbmN5XCIsIFwicGVyY2VudFwiXS5pbmRleE9mKGZpZWxkLmRhdGFfdHlwZSkgPiAtMSkge1xuICAgICAgICAgIGZzVHlwZSA9IE51bWJlcjtcbiAgICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChmaWVsZC5kYXRhX3R5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgZnNUeXBlID0gQm9vbGVhbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmc1R5cGUgPSBTdHJpbmc7XG4gICAgICAgIH1cbiAgICAgICAgZnMudHlwZSA9IGZzVHlwZTtcbiAgICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgICAgZnMudHlwZSA9IFtmc1R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMoZmllbGQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjdXJyZW5jeVwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoKGZpZWxkICE9IG51bGwgPyBmaWVsZC5zY2FsZSA6IHZvaWQgMCkgIT09IDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSAyO1xuICAgICAgICBmcy5kZWNpbWFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBCb29sZWFuO1xuICAgICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ0b2dnbGVcIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLXRvZ2dsZVwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJyZWZlcmVuY2VcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0LWNoZWNrYm94XCI7XG4gICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZmlsZVwiKSB7XG4gICAgICBjb2xsZWN0aW9uTmFtZSA9IGZpZWxkLmNvbGxlY3Rpb24gfHwgXCJmaWxlc1wiO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uTmFtZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTmFtZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZmlsZXNpemVcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJPYmplY3RcIiB8fCBmaWVsZC50eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJncmlkXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBBcnJheTtcbiAgICAgIGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZTtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NHcmlkXCI7XG4gICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiaW1hZ2VcIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAnaW1hZ2VzJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2ltYWdlLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdpbWFnZXMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF2YXRhclwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdhdmF0YXJzJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ2ltYWdlLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICdhdmF0YXJzJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJhdWRpb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdhdWRpb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAnYXVkaW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F1ZGlvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdhdWRpby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidmlkZW9cIikge1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID0ge1xuICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICB0eXBlOiAnZmlsZVVwbG9hZCcsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiAndmlkZW9zJyxcbiAgICAgICAgICAgIGFjY2VwdDogJ3ZpZGVvLyonXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9ICd2aWRlb3MnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAndmlkZW8vKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImxvY2F0aW9uXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJsb2NhdGlvblwiO1xuICAgICAgZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIjtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibWFya2Rvd25cIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtbWFya2Rvd25cIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICd1cmwnKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zVXJsJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdlbWFpbCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnc3RlZWRvc0VtYWlsJztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdhdXRvbnVtYmVyJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdmb3JtdWxhJykge1xuICAgICAgZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge1xuICAgICAgICAgICAgdHlwZTogZmllbGQuZGF0YV90eXBlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlbZmllbGQubmFtZV07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnc3VtbWFyeScpIHtcbiAgICAgIGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHtcbiAgICAgICAgICAgIHR5cGU6IGZpZWxkLmRhdGFfdHlwZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pW2ZpZWxkLm5hbWVdO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3BlcmNlbnQnKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4O1xuICAgICAgaWYgKCFfLmlzTnVtYmVyKGZpZWxkLnNjYWxlKSkge1xuICAgICAgICBmaWVsZC5zY2FsZSA9IDA7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlICsgMjtcbiAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcy50eXBlID0gZmllbGQudHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmxhYmVsKSB7XG4gICAgICBmcy5sYWJlbCA9IGZpZWxkLmxhYmVsO1xuICAgIH1cbiAgICBpZiAoIWZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmcy5vcHRpb25hbCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC51bmlxdWUpIHtcbiAgICAgIGZzLnVuaXF1ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5vbWl0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmdyb3VwKSB7XG4gICAgICBmcy5hdXRvZm9ybS5ncm91cCA9IGZpZWxkLmdyb3VwO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaXNfd2lkZSkge1xuICAgICAgZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5oaWRkZW4pIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiO1xuICAgIH1cbiAgICBpZiAoKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHx8IChmaWVsZC50eXBlID09PSBcImxvb2t1cFwiKSB8fCAoZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICBpZiAodHlwZW9mIGZpZWxkLmZpbHRlcmFibGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQubmFtZSA9PT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuc2VhcmNoYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuc2VhcmNoYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvZm9ybV90eXBlKSB7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRlZmF1bHRWYWx1ZSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHtcbiAgICAgICAgICAgIHVzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgICAgbm93OiBuZXcgRGF0ZSgpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgZnMuYXV0b2Zvcm0ucmVhZG9ubHkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGlzYWJsZWQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmlubGluZUhlbHBUZXh0KSB7XG4gICAgICBmcy5hdXRvZm9ybS5pbmxpbmVIZWxwVGV4dCA9IGZpZWxkLmlubGluZUhlbHBUZXh0O1xuICAgIH1cbiAgICBpZiAoZmllbGQuYmxhY2tib3gpIHtcbiAgICAgIGZzLmJsYWNrYm94ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWluJykpIHtcbiAgICAgIGZzLm1pbiA9IGZpZWxkLm1pbjtcbiAgICB9XG4gICAgaWYgKF8uaGFzKGZpZWxkLCAnbWF4JykpIHtcbiAgICAgIGZzLm1heCA9IGZpZWxkLm1heDtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1Byb2R1Y3Rpb24pIHtcbiAgICAgIGlmIChmaWVsZC5pbmRleCkge1xuICAgICAgICBmcy5pbmRleCA9IGZpZWxkLmluZGV4O1xuICAgICAgfSBlbHNlIGlmIChmaWVsZC5zb3J0YWJsZSkge1xuICAgICAgICBmcy5pbmRleCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzY2hlbWFbZmllbGRfbmFtZV0gPSBmcztcbiAgfSk7XG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGlzcGxheVZhbHVlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkX3ZhbHVlKSB7XG4gIHZhciBmaWVsZCwgaHRtbCwgb2JqZWN0O1xuICBodG1sID0gZmllbGRfdmFsdWU7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBmaWVsZCA9IG9iamVjdC5maWVsZHMoZmllbGRfbmFtZSk7XG4gIGlmICghZmllbGQpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREIEg6bW0nKTtcbiAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImRhdGVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICB9XG4gIHJldHVybiBodG1sO1xufTtcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHJldHVybiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIiwgXCJ0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSk7XG59O1xuXG5DcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpIHtcbiAgdmFyIGJ1aWx0aW5WYWx1ZXM7XG4gIGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoYnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybiBfLmZvckVhY2goYnVpbHRpblZhbHVlcywgZnVuY3Rpb24oYnVpbHRpbkl0ZW0sIGtleSkge1xuICAgICAgcmV0dXJuIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBidWlsdGluSXRlbS5sYWJlbCxcbiAgICAgICAgdmFsdWU6IGtleVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBpc19jaGVja19vbmx5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgdmFsdWUpIHtcbiAgdmFyIGJldHdlZW5CdWlsdGluVmFsdWVzLCByZXN1bHQ7XG4gIGlmICghXy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoIWJldHdlZW5CdWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlc3VsdCA9IG51bGw7XG4gIF8uZWFjaChiZXR3ZWVuQnVpbHRpblZhbHVlcywgZnVuY3Rpb24oaXRlbSwgb3BlcmF0aW9uKSB7XG4gICAgaWYgKGl0ZW0ua2V5ID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdCA9IG9wZXJhdGlvbjtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKSB7XG4gIHJldHVybiB7XG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc195ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc193ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b2RheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9kYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzEyMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gZnVuY3Rpb24obW9udGgpIHtcbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICByZXR1cm4gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICByZXR1cm4gNjtcbiAgfVxuICByZXR1cm4gOTtcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICB5ZWFyLS07XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSB7XG4gICAgbW9udGggPSA2O1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gNjtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoID0gMDtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRNb250aERheXMgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICB2YXIgZGF5cywgZW5kRGF0ZSwgbWlsbGlzZWNvbmQsIHN0YXJ0RGF0ZTtcbiAgaWYgKG1vbnRoID09PSAxMSkge1xuICAgIHJldHVybiAzMTtcbiAgfVxuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMSk7XG4gIGRheXMgPSAoZW5kRGF0ZSAtIHN0YXJ0RGF0ZSkgLyBtaWxsaXNlY29uZDtcbiAgcmV0dXJuIGRheXM7XG59O1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoID09PSAwKSB7XG4gICAgbW9udGggPSAxMTtcbiAgICB5ZWFyLS07XG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgfVxuICBtb250aC0tO1xuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgdmFyIGN1cnJlbnRNb250aCwgY3VycmVudFllYXIsIGVuZFZhbHVlLCBmaXJzdERheSwgbGFiZWwsIGxhc3REYXksIGxhc3RNb25kYXksIGxhc3RNb250aEZpbmFsRGF5LCBsYXN0TW9udGhGaXJzdERheSwgbGFzdFF1YXJ0ZXJFbmREYXksIGxhc3RRdWFydGVyU3RhcnREYXksIGxhc3RTdW5kYXksIGxhc3RfMTIwX2RheXMsIGxhc3RfMzBfZGF5cywgbGFzdF82MF9kYXlzLCBsYXN0XzdfZGF5cywgbGFzdF85MF9kYXlzLCBtaWxsaXNlY29uZCwgbWludXNEYXksIG1vbmRheSwgbW9udGgsIG5leHRNb25kYXksIG5leHRNb250aEZpbmFsRGF5LCBuZXh0TW9udGhGaXJzdERheSwgbmV4dFF1YXJ0ZXJFbmREYXksIG5leHRRdWFydGVyU3RhcnREYXksIG5leHRTdW5kYXksIG5leHRZZWFyLCBuZXh0XzEyMF9kYXlzLCBuZXh0XzMwX2RheXMsIG5leHRfNjBfZGF5cywgbmV4dF83X2RheXMsIG5leHRfOTBfZGF5cywgbm93LCBwcmV2aW91c1llYXIsIHN0YXJ0VmFsdWUsIHN0ckVuZERheSwgc3RyRmlyc3REYXksIHN0ckxhc3REYXksIHN0ck1vbmRheSwgc3RyU3RhcnREYXksIHN0clN1bmRheSwgc3RyVG9kYXksIHN0clRvbW9ycm93LCBzdHJZZXN0ZGF5LCBzdW5kYXksIHRoaXNRdWFydGVyRW5kRGF5LCB0aGlzUXVhcnRlclN0YXJ0RGF5LCB0b21vcnJvdywgdmFsdWVzLCB3ZWVrLCB5ZWFyLCB5ZXN0ZGF5O1xuICBub3cgPSBuZXcgRGF0ZSgpO1xuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHllc3RkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIHdlZWsgPSBub3cuZ2V0RGF5KCk7XG4gIG1pbnVzRGF5ID0gd2VlayAhPT0gMCA/IHdlZWsgLSAxIDogNjtcbiAgbW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICBuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIGN1cnJlbnRZZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMTtcbiAgbmV4dFllYXIgPSBjdXJyZW50WWVhciArIDE7XG4gIGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpO1xuICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIG1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIGZpcnN0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgMSk7XG4gIGlmIChjdXJyZW50TW9udGggPT09IDExKSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoKys7XG4gIH0gZWxzZSB7XG4gICAgbW9udGgrKztcbiAgfVxuICBuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgbmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgQ3JlYXRvci5nZXRNb250aERheXMoeWVhciwgbW9udGgpKTtcbiAgbGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdGhpc1F1YXJ0ZXJTdGFydERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksIDEpO1xuICB0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMikpO1xuICBsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN3aXRjaCAoa2V5KSB7XG4gICAgY2FzZSBcImxhc3RfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChmaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChsYXN0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc193ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwieWVzdGRheVwiOlxuICAgICAgc3RyWWVzdGRheSA9IG1vbWVudCh5ZXN0ZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvZGF5XCI6XG4gICAgICBzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b2RheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9tb3Jyb3dcIjpcbiAgICAgIHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICB9XG4gIHZhbHVlcyA9IFtzdGFydFZhbHVlLCBlbmRWYWx1ZV07XG4gIGlmIChmaWVsZF90eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBfLmZvckVhY2godmFsdWVzLCBmdW5jdGlvbihmdikge1xuICAgICAgaWYgKGZ2KSB7XG4gICAgICAgIHJldHVybiBmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGxhYmVsOiBsYWJlbCxcbiAgICBrZXk6IGtleSxcbiAgICB2YWx1ZXM6IHZhbHVlc1xuICB9O1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIGlmIChmaWVsZF90eXBlICYmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdiZXR3ZWVuJztcbiAgfSBlbHNlIGlmIChbXCJ0ZXh0YXJlYVwiLCBcInRleHRcIiwgXCJjb2RlXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdjb250YWlucyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiPVwiO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICB2YXIgb3BlcmF0aW9ucywgb3B0aW9uYWxzO1xuICBvcHRpb25hbHMgPSB7XG4gICAgZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPVwiXG4gICAgfSxcbiAgICB1bmVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl91bmVxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD5cIlxuICAgIH0sXG4gICAgbGVzc190aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI8XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPlwiXG4gICAgfSxcbiAgICBsZXNzX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD1cIlxuICAgIH0sXG4gICAgZ3JlYXRlcl9vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj49XCJcbiAgICB9LFxuICAgIGNvbnRhaW5zOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSxcbiAgICAgIHZhbHVlOiBcImNvbnRhaW5zXCJcbiAgICB9LFxuICAgIG5vdF9jb250YWluOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9kb2VzX25vdF9jb250YWluXCIpLFxuICAgICAgdmFsdWU6IFwibm90Y29udGFpbnNcIlxuICAgIH0sXG4gICAgc3RhcnRzX3dpdGg6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLFxuICAgICAgdmFsdWU6IFwic3RhcnRzd2l0aFwiXG4gICAgfSxcbiAgICBiZXR3ZWVuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLFxuICAgICAgdmFsdWU6IFwiYmV0d2VlblwiXG4gICAgfVxuICB9O1xuICBpZiAoZmllbGRfdHlwZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscyk7XG4gIH1cbiAgb3BlcmF0aW9ucyA9IFtdO1xuICBpZiAoQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pO1xuICAgIENyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwidGV4dFwiIHx8IGZpZWxkX3R5cGUgPT09IFwidGV4dGFyZWFcIiB8fCBmaWVsZF90eXBlID09PSBcImh0bWxcIiB8fCBmaWVsZF90eXBlID09PSBcImNvZGVcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImN1cnJlbmN5XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMubGVzc190aGFuLCBvcHRpb25hbHMuZ3JlYXRlcl90aGFuLCBvcHRpb25hbHMubGVzc19vcl9lcXVhbCwgb3B0aW9uYWxzLmdyZWF0ZXJfb3JfZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcIlt0ZXh0XVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2Uge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfVxuICByZXR1cm4gb3BlcmF0aW9ucztcbn07XG5cblxuLypcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZmllbGRzLCBmaWVsZHNBcnIsIGZpZWxkc05hbWUsIHJlZjtcbiAgZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDA7XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaCh7XG4gICAgICBuYW1lOiBmaWVsZC5uYW1lLFxuICAgICAgc29ydF9ubzogZmllbGQuc29ydF9ub1xuICAgIH0pO1xuICB9KTtcbiAgZmllbGRzTmFtZSA9IFtdO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBmaWVsZHNOYW1lO1xufTtcbiIsIkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fVxuXG5pbml0VHJpZ2dlciA9IChvYmplY3RfbmFtZSwgdHJpZ2dlciktPlxuXHR0cnlcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRcdGlmICF0cmlnZ2VyLnRvZG9cblx0XHRcdHJldHVyblxuXHRcdHRvZG9XcmFwcGVyID0gKCktPlxuXHRcdFx0ICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWVcblx0XHRcdCAgcmV0dXJuIHRyaWdnZXIudG9kby5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG5cdFx0aWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLmluc2VydFwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/Lmluc2VydCh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLnVwZGF0ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnVwZGF0ZSh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLnJlbW92ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnJlbW92ZSh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIuaW5zZXJ0XCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy5pbnNlcnQodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnVwZGF0ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8udXBkYXRlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5yZW1vdmVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/LnJlbW92ZSh0b2RvV3JhcHBlcilcblx0Y2F0Y2ggZXJyb3Jcblx0XHRjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKVxuXG5jbGVhblRyaWdnZXIgPSAob2JqZWN0X25hbWUpLT5cblx0IyMjXG4gICAgXHTnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWw5piv5L2/55So5LiL5qCH5Yig6Zmk5a+56LGh55qE77yM5omA5Lul5q2k5aSE5Y+N6L2saG9va3Ppm4blkIjlkI7vvIzlho3liKDpmaRcbiAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuXHQjIyNcbiAgICAjVE9ETyDnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWwYnVnXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdPy5yZXZlcnNlKCkuZm9yRWFjaCAoX2hvb2spLT5cblx0XHRfaG9vay5yZW1vdmUoKVxuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IChvYmplY3RfbmFtZSktPlxuI1x0Y29uc29sZS5sb2coJ0NyZWF0b3IuaW5pdFRyaWdnZXJzIG9iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSlcblxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdXG5cblx0Xy5lYWNoIG9iai50cmlnZ2VycywgKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSktPlxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciBhbmQgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXG5cdFx0XHRpZiBfdHJpZ2dlcl9ob29rXG5cdFx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaylcblx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIiBhbmQgdHJpZ2dlci50b2RvIGFuZCB0cmlnZ2VyLndoZW5cblx0XHRcdF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlciBvYmplY3RfbmFtZSwgdHJpZ2dlclxuXHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKSIsInZhciBjbGVhblRyaWdnZXIsIGluaXRUcmlnZ2VyO1xuXG5DcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge307XG5cbmluaXRUcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHRyaWdnZXIpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGVycm9yLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHRvZG9XcmFwcGVyO1xuICB0cnkge1xuICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIGlmICghdHJpZ2dlci50b2RvKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRvZG9XcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZi5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYxID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYxLnVwZGF0ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjIgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjIucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYzID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjMuaW5zZXJ0KHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY0ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjQudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY1ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjUucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgIGVycm9yID0gZXJyb3IxO1xuICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKTtcbiAgfVxufTtcblxuY2xlYW5UcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcblxuICAvKlxuICAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuICAgKi9cbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSkgIT0gbnVsbCA/IHJlZi5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbihfaG9vaykge1xuICAgIHJldHVybiBfaG9vay5yZW1vdmUoKTtcbiAgfSkgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBvYmo7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0gPSBbXTtcbiAgcmV0dXJuIF8uZWFjaChvYmoudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSkge1xuICAgIHZhciBfdHJpZ2dlcl9ob29rO1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgaWYgKF90cmlnZ2VyX2hvb2spIHtcbiAgICAgICAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICByZXR1cm4gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKVxuXG5iYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJhbGxvd0NyZWF0ZVwiLCBcImFsbG93RGVsZXRlXCIsIFwiYWxsb3dFZGl0XCIsIFwiYWxsb3dSZWFkXCIsIFwibW9kaWZ5QWxsUmVjb3Jkc1wiLCBcInZpZXdBbGxSZWNvcmRzXCIsIFwibW9kaWZ5Q29tcGFueVJlY29yZHNcIiwgXCJ2aWV3Q29tcGFueVJlY29yZHNcIiwgXG5cdFwiYWxsb3dSZWFkRmlsZXNcIiwgXCJhbGxvd0VkaXRGaWxlc1wiLCBcImFsbG93Q3JlYXRlRmlsZXNcIiwgXCJhbGxvd0RlbGV0ZUZpbGVzXCIsIFwidmlld0FsbEZpbGVzXCIsIFwibW9kaWZ5QWxsRmlsZXNcIl0gXG5vdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJkaXNhYmxlZF9saXN0X3ZpZXdzXCIsIFwiZGlzYWJsZWRfYWN0aW9uc1wiLCBcInVucmVhZGFibGVfZmllbGRzXCIsIFwidW5lZGl0YWJsZV9maWVsZHNcIiwgXCJ1bnJlbGF0ZWRfb2JqZWN0c1wiLCBcInVuZWRpdGFibGVfcmVsYXRlZF9saXN0XCJdXG5wZXJtaXNzaW9uUHJvcE5hbWVzID0gXy51bmlvbiBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMsIG90aGVyUGVybWlzc2lvblByb3BOYW1lc1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiAhb2JqXG5cdFx0XHRyZXR1cm5cblx0XHRyZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpXG5cdGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGlmICFzcGFjZUlkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFxuXHQjIOmZhOS7tuadg+mZkOS4jeWGjeS4juWFtueItuiusOW9lee8lui+kemFjee9ruWFs+iBlFxuXHQjIGlmIHJlY29yZCBhbmQgb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIiBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdCMgXHQjIOWmguaenOaYr2Ntc19maWxlc+mZhOS7tu+8jOWImeadg+mZkOWPluWFtueItuiusOW9leadg+mZkFxuXHQjIFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJylcblx0IyBcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bor6bnu4bnlYzpnaJcblx0IyBcdFx0b2JqZWN0X25hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcblx0IyBcdFx0cmVjb3JkX2lkID0gcmVjb3JkLnBhcmVudC5faWQ7XG5cdCMgXHRlbHNlIFxuXHQjIFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tueahOeItuiusOW9leeVjOmdolxuXHQjIFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpO1xuXHQjIFx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcblx0IyBcdG9iamVjdF9maWVsZHNfa2V5cyA9IF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/LmZpZWxkcyBvciB7fSkgfHwgW107XG5cdCMgXHRzZWxlY3QgPSBfLmludGVyc2VjdGlvbihvYmplY3RfZmllbGRzX2tleXMsIFsnb3duZXInLCAnY29tcGFueV9pZCcsICdjb21wYW55X2lkcycsICdsb2NrZWQnXSkgfHwgW107XG5cdCMgXHRpZiBzZWxlY3QubGVuZ3RoID4gMFxuXHQjIFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3Quam9pbignLCcpKTtcblx0IyBcdGVsc2Vcblx0IyBcdFx0cmVjb3JkID0gbnVsbDtcblxuXHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSlcblxuXHRpZiByZWNvcmRcblx0XHRpZiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXG5cdFx0XHRyZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9uc1xuXG5cdFx0aXNPd25lciA9IHJlY29yZC5vd25lciA9PSB1c2VySWQgfHwgcmVjb3JkLm93bmVyPy5faWQgPT0gdXNlcklkXG5cblx0XHRpZiBvYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHQjIOmZhOS7tueahOafpeeci+aJgOacieS/ruaUueaJgOacieadg+mZkOS4jumZhOS7tuWvueixoeeahHZpZXdBbGxSZWNvcmRz44CBbW9kaWZ5QWxsUmVjb3Jkc+aXoOWFs++8jOWPquS4juWFtuS4u+ihqOiusOW9leeahHZpZXdBbGxGaWxlc+WSjG1vZGlmeUFsbEZpbGVz5pyJ5YWzXG5cdFx0XHQjIOWmguaenOaYr2Ntc19maWxlc+mZhOS7tu+8jOWImeadg+mZkOmcgOimgemineWkluiAg+iZkeWFtueItuWvueixoeS4iuWFs+S6jumZhOS7tueahOadg+mZkOmFjee9rlxuXHRcdFx0bWFzdGVyT2JqZWN0TmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuXHRcdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMobWFzdGVyT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHBlcm1pc3Npb25zLmFsbG93RGVsZXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dEZWxldGVGaWxlc1xuXHRcdFx0aWYgIW1hc3RlclJlY29yZFBlcm0ubW9kaWZ5QWxsRmlsZXMgYW5kICFpc093bmVyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHBlcm1pc3Npb25zLmFsbG93UmVhZCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZEZpbGVzXG5cdFx0XHRpZiAhbWFzdGVyUmVjb3JkUGVybS52aWV3QWxsRmlsZXMgYW5kICFpc093bmVyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKVxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQ/LmNvbXBhbnlfaWRcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSBhbmQgcmVjb3JkX2NvbXBhbnlfaWQuX2lkXG5cdFx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWTmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahG9iamVjdO+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxuXHRcdFx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZFxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkPy5jb21wYW55X2lkc1xuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSlcblx0XHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZHPmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahFtvYmplY3Rd77yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XG5cdFx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoKG4pLT4gbi5faWQpXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSlcblx0XHRcdGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcblx0XHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdFxuXHRcdFx0aWYgcmVjb3JkLmxvY2tlZCBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXG5cdFx0XHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcblx0XHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+afpeeci1xuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6K6w5b2V5pyJY29tcGFueV9pZOWxnuaAp++8jOS9huaYr+W9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPkuLrnqbrml7bvvIzorqTkuLrml6DmnYPmn6XnnItcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFxuXHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXG4jIGN1cnJlbnRPYmplY3ROYW1l77ya5b2T5YmN5Li75a+56LGhXG4jIHJlbGF0ZWRMaXN0SXRlbe+8mkNyZWF0b3IuZ2V0UmVsYXRlZExpc3QoU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSwgU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikp5Lit5Y+WcmVsYXRlZF9vYmplY3RfbmFtZeWvueW6lOeahOWAvFxuIyBjdXJyZW50UmVjb3Jk5b2T5YmN5Li75a+56LGh55qE6K+m57uG6K6w5b2VXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Q3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxuXHRcdGlmICFjdXJyZW50T2JqZWN0TmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRcdGlmICFyZWxhdGVkTGlzdEl0ZW1cblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG5cdFx0XHRyZXR1cm4ge31cblxuXHRcdGlmICFjdXJyZW50UmVjb3JkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXG5cblx0XHRpZiAhdXNlcklkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdFx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXG5cdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZClcblx0XHRyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSlcblx0XHRyZXN1bHQgPSBfLmNsb25lIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9uc1xuXG5cdFx0aWYgcmVsYXRlZExpc3RJdGVtLmlzX2ZpbGVcblx0XHRcdHJlc3VsdC5hbGxvd0NyZWF0ZSA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRcdHJlc3VsdC5hbGxvd0VkaXQgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXNcblx0XHRlbHNlXG5cdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRMaXN0SXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB8fCBmYWxzZVxuXHRcdFx0bWFzdGVyQWxsb3cgPSBmYWxzZVxuXHRcdFx0aWYgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT0gdHJ1ZVxuXHRcdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkXG5cdFx0XHRlbHNlIGlmIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09IGZhbHNlXG5cdFx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRcblxuXHRcdFx0dW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSlcblx0XHRcdGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xXG5cblx0XHRcdHJlc3VsdC5hbGxvd0NyZWF0ZSA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlXG5cdFx0XHRyZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlXG5cdFx0cmV0dXJuIHJlc3VsdFxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCkgLT5cblx0XHRwZXJtaXNzaW9ucyA9XG5cdFx0XHRvYmplY3RzOiB7fVxuXHRcdFx0YXNzaWduZWRfYXBwczogW11cblx0XHQjIyNcblx0XHTmnYPpmZDpm4bor7TmmI46XG5cdFx05YaF572u5p2D6ZmQ6ZuGLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxuXHRcdOiHquWumuS5ieadg+mZkOmbhi3mlbDmja7lupPkuK3mlrDlu7rnmoTpmaTlhoXnva7mnYPpmZDpm4bku6XlpJbnmoTlhbbku5bmnYPpmZDpm4Zcblx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxuXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOmbhlxuXHRcdCMjI1xuXG5cdFx0aXNTcGFjZUFkbWluID0gZmFsc2Vcblx0XHRzcGFjZVVzZXIgPSBudWxsXG5cdFx0aWYgdXNlcklkXG5cdFx0XHRpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXG5cdFx0cHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0ZWxzZVxuXHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXG5cdFx0cHNldHNBZG1pbl9wb3MgPSBudWxsXG5cdFx0cHNldHNVc2VyX3BvcyA9IG51bGxcblx0XHRwc2V0c01lbWJlcl9wb3MgPSBudWxsXG5cdFx0cHNldHNHdWVzdF9wb3MgPSBudWxsXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IG51bGxcblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGxcblx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGxcblxuXHRcdGlmIHBzZXRzQWRtaW4/Ll9pZFxuXHRcdFx0cHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNVc2VyPy5faWRcblx0XHRcdHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c01lbWJlcj8uX2lkXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzR3Vlc3Q/Ll9pZFxuXHRcdFx0cHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNTdXBwbGllcj8uX2lkXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c0N1c3RvbWVyPy5faWRcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXG5cdFx0aWYgcHNldHNDdXJyZW50Lmxlbmd0aCA+IDBcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJfaWRcIlxuXHRcdFx0cHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogc2V0X2lkc319KS5mZXRjaCgpXG5cdFx0XHRwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIm5hbWVcIlxuXHRcdHBzZXRzID0ge1xuXHRcdFx0cHNldHNBZG1pbiwgXG5cdFx0XHRwc2V0c1VzZXIsIFxuXHRcdFx0cHNldHNDdXJyZW50LCBcblx0XHRcdHBzZXRzTWVtYmVyLCBcblx0XHRcdHBzZXRzR3Vlc3QsXG5cdFx0XHRwc2V0c1N1cHBsaWVyLFxuXHRcdFx0cHNldHNDdXN0b21lcixcblx0XHRcdGlzU3BhY2VBZG1pbixcblx0XHRcdHNwYWNlVXNlciwgXG5cdFx0XHRwc2V0c0FkbWluX3BvcywgXG5cdFx0XHRwc2V0c1VzZXJfcG9zLCBcblx0XHRcdHBzZXRzTWVtYmVyX3BvcywgXG5cdFx0XHRwc2V0c0d1ZXN0X3Bvcyxcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zLFxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MsXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zXG5cdFx0fVxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX2FwcHMgPSBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpXG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxuXHRcdHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXNcblx0XHRfaSA9IDBcblx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxuXHRcdFx0X2krK1xuXHRcdFx0aWYgIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT0gc3BhY2VJZFxuXHRcdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT0gJzAnICYmIGlzU3BhY2VBZG1pbilcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZClcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cdHVuaW9uUGx1cyA9IChhcnJheSwgb3RoZXIpIC0+XG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0XHRpZiAhYXJyYXlcblx0XHRcdGFycmF5ID0gW11cblx0XHRpZiAhb3RoZXJcblx0XHRcdG90aGVyID0gW11cblx0XHRyZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpXG5cblx0aW50ZXJzZWN0aW9uUGx1cyA9IChhcnJheSwgb3RoZXIpIC0+XG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0XHRpZiAhYXJyYXlcblx0XHRcdGFycmF5ID0gW11cblx0XHRpZiAhb3RoZXJcblx0XHRcdG90aGVyID0gW11cblx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKVxuXG5cdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyA9ICh0YXJnZXQsIHByb3BzKSAtPlxuXHRcdHByb3BOYW1lcyA9IHBlcm1pc3Npb25Qcm9wTmFtZXNcblx0XHRmaWxlc1Byb05hbWVzID0gXG5cdFx0aWYgcHJvcHNcblx0XHRcdF8uZWFjaCBwcm9wTmFtZXMsIChwcm9wTmFtZSkgLT5cblx0XHRcdFx0dGFyZ2V0W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXVxuXG5cdFx0XHQjIHRhcmdldC5hbGxvd0NyZWF0ZSA9IHByb3BzLmFsbG93Q3JlYXRlXG5cdFx0XHQjIHRhcmdldC5hbGxvd0RlbGV0ZSA9IHByb3BzLmFsbG93RGVsZXRlXG5cdFx0XHQjIHRhcmdldC5hbGxvd0VkaXQgPSBwcm9wcy5hbGxvd0VkaXRcblx0XHRcdCMgdGFyZ2V0LmFsbG93UmVhZCA9IHByb3BzLmFsbG93UmVhZFxuXHRcdFx0IyB0YXJnZXQubW9kaWZ5QWxsUmVjb3JkcyA9IHByb3BzLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdCMgdGFyZ2V0LnZpZXdBbGxSZWNvcmRzID0gcHJvcHMudmlld0FsbFJlY29yZHNcblx0XHRcdCMgdGFyZ2V0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcHJvcHMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdCMgdGFyZ2V0LnZpZXdDb21wYW55UmVjb3JkcyA9IHByb3BzLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHByb3BzLmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRcdCMgdGFyZ2V0LmRpc2FibGVkX2FjdGlvbnMgPSBwcm9wcy5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHQjIHRhcmdldC51bnJlYWRhYmxlX2ZpZWxkcyA9IHByb3BzLnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHQjIHRhcmdldC51bmVkaXRhYmxlX2ZpZWxkcyA9IHByb3BzLnVuZWRpdGFibGVfZmllbGRzXG5cdFx0XHQjIHRhcmdldC51bnJlbGF0ZWRfb2JqZWN0cyA9IHByb3BzLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0XHQjIHRhcmdldC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHByb3BzLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XG5cblx0b3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzID0gKHRhcmdldCwgcHJvcHMpIC0+XG5cdFx0cHJvcE5hbWVzID0gYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzXG5cdFx0Xy5lYWNoIHByb3BOYW1lcywgKHByb3BOYW1lKSAtPlxuXHRcdFx0aWYgcHJvcHNbcHJvcE5hbWVdXG5cdFx0XHRcdHRhcmdldFtwcm9wTmFtZV0gPSB0cnVlXG5cdFx0XG5cdFx0IyBpZiBwby5hbGxvd1JlYWRcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdCMgaWYgcG8uYWxsb3dDcmVhdGVcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0VkaXRcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdCMgaWYgcG8uYWxsb3dEZWxldGVcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0IyBpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlXG5cdFx0IyBpZiBwby52aWV3QWxsUmVjb3Jkc1xuXHRcdCMgXHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0XHQjIGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXHRcdCMgaWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblxuXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c1N1cHBsaWVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c0N1c3RvbWVyID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdCMgcHNldHNNZW1iZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHQjIHBzZXRzR3Vlc3QgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0c3BhY2VVc2VyID0gbnVsbDtcblx0XHRpZiB1c2VySWRcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0ZWxzZVxuXHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0YXBwcyA9IFtdXG5cdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHRyZXR1cm4gW11cblx0XHRlbHNlXG5cdFx0XHR1c2VyUHJvZmlsZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KT8ucHJvZmlsZVxuXHRcdFx0cHNldEJhc2UgPSBwc2V0c1VzZXJcblx0XHRcdGlmIHVzZXJQcm9maWxlXG5cdFx0XHRcdGlmIHVzZXJQcm9maWxlID09ICdzdXBwbGllcidcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXJcblx0XHRcdFx0ZWxzZSBpZiB1c2VyUHJvZmlsZSA9PSAnY3VzdG9tZXInXG5cdFx0XHRcdFx0cHNldEJhc2UgPSBwc2V0c0N1c3RvbWVyXG5cdFx0XHRpZiBwc2V0QmFzZT8uYXNzaWduZWRfYXBwcz8ubGVuZ3RoXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHNcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyB1c2Vy5p2D6ZmQ6ZuG5Lit55qEYXNzaWduZWRfYXBwc+ihqOekuuaJgOacieeUqOaIt+WFt+acieeahGFwcHPmnYPpmZDvvIzkuLrnqbrliJnooajnpLrmnInmiYDmnIlhcHBz5p2D6ZmQ77yM5LiN6ZyA6KaB5L2c5p2D6ZmQ5Yik5pat5LqGXG5cdFx0XHRcdHJldHVybiBbXVxuXHRcdFx0Xy5lYWNoIHBzZXRzLCAocHNldCktPlxuXHRcdFx0XHRpZiAhcHNldC5hc3NpZ25lZF9hcHBzXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGlmIHBzZXQubmFtZSA9PSBcImFkbWluXCIgfHwgIHBzZXQubmFtZSA9PSBcInVzZXJcIiB8fCBwc2V0Lm5hbWUgPT0gJ3N1cHBsaWVyJyB8fCBwc2V0Lm5hbWUgPT0gJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdCMg6L+Z6YeM5LmL5omA5Lul6KaB5o6S6ZmkYWRtaW4vdXNlcu+8jOaYr+WboOS4uui/meS4pOS4quadg+mZkOmbhuaYr+aJgOacieadg+mZkOmbhuS4rXVzZXJz5bGe5oCn5peg5pWI55qE5p2D6ZmQ6ZuG77yM54m55oyH5bel5L2c5Yy6566h55CG5ZGY5ZKM5omA5pyJ55So5oi3XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwc1xuXHRcdFx0cmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksdW5kZWZpbmVkLG51bGwpXG5cblx0Q3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRhZG1pbk1lbnVzID0gQ3JlYXRvci5BcHBzLmFkbWluPy5hZG1pbl9tZW51c1xuXHRcdCMg5aaC5p6c5rKh5pyJYWRtaW7oj5zljZXor7TmmI7kuI3pnIDopoHnm7jlhbPlip/og73vvIznm7TmjqXov5Tlm57nqbpcblx0XHR1bmxlc3MgYWRtaW5NZW51c1xuXHRcdFx0cmV0dXJuIFtdXG5cdFx0YWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kIChuKSAtPlxuXHRcdFx0bi5faWQgPT0gJ2Fib3V0J1xuXHRcdGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlciAobikgLT5cblx0XHRcdG4uX2lkICE9ICdhYm91dCdcblx0XHRvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkgXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgKG4pIC0+XG5cdFx0XHRyZXR1cm4gbi5hZG1pbl9tZW51cyBhbmQgbi5faWQgIT0gJ2FkbWluJ1xuXHRcdCksICdzb3J0J1xuXHRcdG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKVxuXHRcdCMg6I+c5Y2V5pyJ5LiJ6YOo5YiG57uE5oiQ77yM6K6+572uQVBQ6I+c5Y2V44CB5YW25LuWQVBQ6I+c5Y2V5Lul5Y+KYWJvdXToj5zljZVcblx0XHRhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pXG5cdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHQjIOW3peS9nOWMuueuoeeQhuWRmOacieWFqOmDqOiPnOWNleWKn+iDvVxuXHRcdFx0cmVzdWx0ID0gYWxsTWVudXNcblx0XHRlbHNlXG5cdFx0XHR1c2VyUHJvZmlsZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KT8ucHJvZmlsZSB8fCAndXNlcidcblx0XHRcdGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAgKG4pIC0+XG5cdFx0XHRcdHJldHVybiBuLm5hbWVcblx0XHRcdG1lbnVzID0gYWxsTWVudXMuZmlsdGVyIChtZW51KS0+XG5cdFx0XHRcdHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzXG5cdFx0XHRcdCMg5aaC5p6c5pmu6YCa55So5oi35pyJ5p2D6ZmQ77yM5YiZ55u05o6l6L+U5ZuedHJ1ZVxuXHRcdFx0XHRpZiBwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YodXNlclByb2ZpbGUpID4gLTFcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0XHQjIOWQpuWImeWPluW9k+WJjeeUqOaIt+eahOadg+mZkOmbhuS4jm1lbnXoj5zljZXopoHmsYLnmoTmnYPpmZDpm4blr7nmr5TvvIzlpoLmnpzkuqTpm4blpKfkuo4x5Liq5YiZ6L+U5ZuedHJ1ZVxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGhcblx0XHRcdHJlc3VsdCA9IG1lbnVzXG5cdFx0XG5cdFx0cmV0dXJuIF8uc29ydEJ5KHJlc3VsdCxcInNvcnRcIilcblxuXHRmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKS0+XG5cblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gXy5maW5kIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XG5cdFx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZH0pXG5cblx0ZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpLT5cblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gXy5maWx0ZXIgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cblx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHBlcm1pc3Npb25fc2V0X2lkc319KS5mZXRjaCgpXG5cblx0dW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IChwb3MsIG9iamVjdCwgcHNldHMpLT5cblx0XHQjIOaKimRi5Y+KeW1s5Lit55qEcGVybWlzc2lvbl9vYmplY3Rz5ZCI5bm277yM5LyY5YWI5Y+WZGLkuK3nmoRcblx0XHRyZXN1bHQgPSBbXVxuXHRcdF8uZWFjaCBvYmplY3QucGVybWlzc2lvbl9zZXQsIChvcHMsIG9wc19rZXkpLT5cblx0XHRcdCMg5oqKeW1s5Lit6Zmk5LqG54m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ6ZuGXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwi5aSW55qE5YW25LuW5a+56LGh5p2D6ZmQ5YWI5a2Y5YWlcmVzdWx0XG5cdFx0XHQjIGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCIsIFwid29ya2Zsb3dfYWRtaW5cIiwgXCJvcmdhbml6YXRpb25fYWRtaW5cIl0uaW5kZXhPZihvcHNfa2V5KSA8IDBcblx0XHRcdGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXG5cdFx0XHRcdGN1cnJlbnRQc2V0ID0gcHNldHMuZmluZCAocHNldCktPiByZXR1cm4gcHNldC5uYW1lID09IG9wc19rZXlcblx0XHRcdFx0aWYgY3VycmVudFBzZXRcblx0XHRcdFx0XHR0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9XG5cdFx0XHRcdFx0dGVtcE9wcy5wZXJtaXNzaW9uX3NldF9pZCA9IGN1cnJlbnRQc2V0Ll9pZFxuXHRcdFx0XHRcdHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZXN1bHQucHVzaCB0ZW1wT3BzXG5cdFx0aWYgcmVzdWx0Lmxlbmd0aFxuXHRcdFx0cG9zLmZvckVhY2ggKHBvKS0+XG5cdFx0XHRcdHJlcGVhdEluZGV4ID0gMFxuXHRcdFx0XHRyZXBlYXRQbyA9IHJlc3VsdC5maW5kKChpdGVtLCBpbmRleCktPiByZXBlYXRJbmRleCA9IGluZGV4O3JldHVybiBpdGVtLnBlcm1pc3Npb25fc2V0X2lkID09IHBvLnBlcm1pc3Npb25fc2V0X2lkKVxuXHRcdFx0XHQjIOWmguaenHltbOS4reW3sue7j+WtmOWcqHBv77yM5YiZ5pu/5o2i5Li65pWw5o2u5bqT5Lit55qEcG/vvIzlj43kuYvliJnmiormlbDmja7lupPkuK3nmoRwb+ebtOaOpee0r+WKoOi/m+WOu1xuXHRcdFx0XHRpZiByZXBlYXRQb1xuXHRcdFx0XHRcdHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwb1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggcG9cblx0XHRcdHJldHVybiByZXN1bHRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gcG9zXG5cblx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKS0+XG5cdFx0cGVybWlzc2lvbnMgPSB7fVxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKVxuXG5cdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09IFwidXNlcnNcIlxuXHRcdFx0cGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cblx0XHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cdFx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblx0XHRwc2V0c0FkbWluID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSBvciB0aGlzLnBzZXRzQWRtaW4gdGhlbiB0aGlzLnBzZXRzQWRtaW4gZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNVc2VyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIG9yIHRoaXMucHNldHNVc2VyIHRoZW4gdGhpcy5wc2V0c1VzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c01lbWJlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIG9yIHRoaXMucHNldHNNZW1iZXIgdGhlbiB0aGlzLnBzZXRzTWVtYmVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c0d1ZXN0ID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSBvciB0aGlzLnBzZXRzR3Vlc3QgdGhlbiB0aGlzLnBzZXRzR3Vlc3QgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxfX0pXG5cblx0XHRwc2V0c1N1cHBsaWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSBvciB0aGlzLnBzZXRzU3VwcGxpZXIgdGhlbiB0aGlzLnBzZXRzU3VwcGxpZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNDdXN0b21lciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgb3IgdGhpcy5wc2V0c0N1c3RvbWVyIHRoZW4gdGhpcy5wc2V0c0N1c3RvbWVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQ7XG5cdFx0aWYgIXBzZXRzXG5cdFx0XHRzcGFjZVVzZXIgPSBudWxsO1xuXHRcdFx0aWYgdXNlcklkXG5cdFx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblxuXHRcdHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3Bvc1xuXHRcdHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3Ncblx0XHRwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3Bvc1xuXHRcdHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3Bvc1xuXG5cdFx0cHNldHNTdXBwbGllcl9wb3MgPSB0aGlzLnBzZXRzU3VwcGxpZXJfcG9zXG5cdFx0cHNldHNDdXN0b21lcl9wb3MgPSB0aGlzLnBzZXRzQ3VzdG9tZXJfcG9zXG5cblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zXG5cblx0XHRvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9XG5cdFx0b3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge31cblx0XHRvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge31cblx0XHRvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XG5cblx0XHRvcHNldFN1cHBsaWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuc3VwcGxpZXIpIHx8IHt9XG5cdFx0b3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fVxuXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF9saXN0dmlld3MnKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzaGFyZWQ6IHRydWV9LCB7ZmllbGRzOntfaWQ6MX19KS5mZXRjaCgpXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBfLnBsdWNrKHNoYXJlZExpc3RWaWV3cyxcIl9pZFwiKVxuXHRcdCMgaWYgc2hhcmVkTGlzdFZpZXdzLmxlbmd0aFxuXHRcdCMgXHR1bmxlc3Mgb3BzZXRBZG1pbi5saXN0X3ZpZXdzXG5cdFx0IyBcdFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gW11cblx0XHQjIFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldEFkbWluLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xuXHRcdCMgXHR1bmxlc3Mgb3BzZXRVc2VyLmxpc3Rfdmlld3Ncblx0XHQjIFx0XHRvcHNldFVzZXIubGlzdF92aWV3cyA9IFtdXG5cdFx0IyBcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldFVzZXIubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXG5cdFx0IyDmlbDmja7lupPkuK3lpoLmnpzphY3nva7kuobpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ6ZuG6K6+572u77yM5bqU6K+l6KaG55uW5Luj56CB5LitYWRtaW4vdXNlcueahOadg+mZkOmbhuiuvue9rlxuXHRcdGlmIHBzZXRzQWRtaW5cblx0XHRcdHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0QWRtaW4sIHBvc0FkbWluXG5cdFx0aWYgcHNldHNVc2VyXG5cdFx0XHRwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldFVzZXIsIHBvc1VzZXJcblx0XHRpZiBwc2V0c01lbWJlclxuXHRcdFx0cG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRNZW1iZXIsIHBvc01lbWJlclxuXHRcdGlmIHBzZXRzR3Vlc3Rcblx0XHRcdHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0R3Vlc3QsIHBvc0d1ZXN0XG5cdFx0aWYgcHNldHNTdXBwbGllclxuXHRcdFx0cG9zU3VwcGxpZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzU3VwcGxpZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNTdXBwbGllci5faWQpO1xuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0U3VwcGxpZXIsIHBvc1N1cHBsaWVyXG5cdFx0aWYgcHNldHNDdXN0b21lclxuXHRcdFx0cG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0Q3VzdG9tZXIsIHBvc0N1c3RvbWVyXG5cblx0XHRpZiAhdXNlcklkXG5cdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cblx0XHRlbHNlXG5cdFx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2NvbW1vbidcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c3BhY2VVc2VyID0gaWYgXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIG9yIHRoaXMuc3BhY2VVc2VyIHRoZW4gdGhpcy5zcGFjZVVzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRcdFx0XHRpZiBzcGFjZVVzZXJcblx0XHRcdFx0XHRcdHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0XHRcdFx0aWYgcHJvZlxuXHRcdFx0XHRcdFx0XHRpZiBwcm9mIGlzICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnbWVtYmVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdndWVzdCdcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Rcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdzdXBwbGllcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdjdXN0b21lcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0Q3VzdG9tZXJcblx0XHRcdFx0XHRcdGVsc2UgIyDmsqHmnIlwcm9maWxl5YiZ6K6k5Li65pivdXNlcuadg+mZkFxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxuXHRcdGlmIHBzZXRzLmxlbmd0aCA+IDBcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzLCBcIl9pZFwiXG5cdFx0XHRwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKVxuXHRcdFx0cG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpXG5cdFx0XHRfLmVhY2ggcG9zLCAocG8pLT5cblx0XHRcdFx0aWYgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNBZG1pbj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1VzZXI/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNNZW1iZXI/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNHdWVzdD8uX2lkIG9yXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzU3VwcGxpZXI/Ll9pZCBvclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0N1c3RvbWVyPy5faWRcblx0XHRcdFx0XHQjIOm7mOiupOeahGFkbWluL3VzZXLmnYPpmZDlgLzlj6rlrp7ooYzkuIrpnaLnmoTpu5jorqTlgLzopobnm5bvvIzkuI3lgZrnrpfms5XliKTmlq1cblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgXy5pc0VtcHR5KHBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gcG9cblx0XHRcdFx0b3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzIHBlcm1pc3Npb25zLCBwb1xuXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpXG5cdFx0XG5cdFx0aWYgb2JqZWN0LmlzX3ZpZXdcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXVxuXHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cblx0XHRpZiBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcblx0XHRcdHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblxuXHQjIENyZWF0b3IuaW5pdFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lKSAtPlxuXG5cdFx0IyAjIOW6lOivpeaKiuiuoeeul+WHuuadpeeahFxuXHRcdCMgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV0uYWxsb3dcblx0XHQjIFx0aW5zZXJ0OiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdCAgICBcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cdFx0IyBcdHVwZGF0ZTogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RWRpdFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblx0XHQjIFx0cmVtb3ZlOiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cblx0TWV0ZW9yLm1ldGhvZHNcblx0XHQjIENhbGN1bGF0ZSBQZXJtaXNzaW9ucyBvbiBTZXJ2ZXJcblx0XHRcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IChzcGFjZUlkKS0+XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZClcbiIsInZhciBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMsIGNsb25lLCBleHRlbmRQZXJtaXNzaW9uUHJvcHMsIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QsIGZpbmRfcGVybWlzc2lvbl9vYmplY3QsIGludGVyc2VjdGlvblBsdXMsIG90aGVyUGVybWlzc2lvblByb3BOYW1lcywgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzLCBwZXJtaXNzaW9uUHJvcE5hbWVzLCB1bmlvblBlcm1pc3Npb25PYmplY3RzLCB1bmlvblBsdXM7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiYWxsb3dDcmVhdGVcIiwgXCJhbGxvd0RlbGV0ZVwiLCBcImFsbG93RWRpdFwiLCBcImFsbG93UmVhZFwiLCBcIm1vZGlmeUFsbFJlY29yZHNcIiwgXCJ2aWV3QWxsUmVjb3Jkc1wiLCBcIm1vZGlmeUNvbXBhbnlSZWNvcmRzXCIsIFwidmlld0NvbXBhbnlSZWNvcmRzXCIsIFwiYWxsb3dSZWFkRmlsZXNcIiwgXCJhbGxvd0VkaXRGaWxlc1wiLCBcImFsbG93Q3JlYXRlRmlsZXNcIiwgXCJhbGxvd0RlbGV0ZUZpbGVzXCIsIFwidmlld0FsbEZpbGVzXCIsIFwibW9kaWZ5QWxsRmlsZXNcIl07XG5cbm90aGVyUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImRpc2FibGVkX2xpc3Rfdmlld3NcIiwgXCJkaXNhYmxlZF9hY3Rpb25zXCIsIFwidW5yZWFkYWJsZV9maWVsZHNcIiwgXCJ1bmVkaXRhYmxlX2ZpZWxkc1wiLCBcInVucmVsYXRlZF9vYmplY3RzXCIsIFwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcIl07XG5cbnBlcm1pc3Npb25Qcm9wTmFtZXMgPSBfLnVuaW9uKGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzKTtcblxuQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIG9iajtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KCk7XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIGlzT3duZXIsIG1hc3Rlck9iamVjdE5hbWUsIG1hc3RlclJlY29yZFBlcm0sIHBlcm1pc3Npb25zLCByZWNvcmRfY29tcGFueV9pZCwgcmVjb3JkX2NvbXBhbnlfaWRzLCByZWYsIHVzZXJfY29tcGFueV9pZHM7XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICB9XG4gIHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKTtcbiAgaWYgKHJlY29yZCkge1xuICAgIGlmIChyZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zKSB7XG4gICAgICByZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucztcbiAgICB9XG4gICAgaXNPd25lciA9IHJlY29yZC5vd25lciA9PT0gdXNlcklkIHx8ICgocmVmID0gcmVjb3JkLm93bmVyKSAhPSBudWxsID8gcmVmLl9pZCA6IHZvaWQgMCkgPT09IHVzZXJJZDtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIG1hc3Rlck9iamVjdE5hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcbiAgICAgIG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG1hc3Rlck9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlcztcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RGVsZXRlRmlsZXM7XG4gICAgICBpZiAoIW1hc3RlclJlY29yZFBlcm0ubW9kaWZ5QWxsRmlsZXMgJiYgIWlzT3duZXIpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRGaWxlcztcbiAgICAgIGlmICghbWFzdGVyUmVjb3JkUGVybS52aWV3QWxsRmlsZXMgJiYgIWlzT3duZXIpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgdXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmNvbXBhbnlfaWQgOiB2b2lkIDA7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWQgJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgJiYgcmVjb3JkX2NvbXBhbnlfaWQuX2lkKSB7XG4gICAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkO1xuICAgICAgfVxuICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZHMgOiB2b2lkIDA7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZHNbMF0pKSB7XG4gICAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSk7XG4gICAgICBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlY29yZC5sb2NrZWQgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHVzZXJfY29tcGFueV9pZHMgJiYgdXNlcl9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcGVybWlzc2lvbnM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICAgIHZhciBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUsIG1hc3RlckFsbG93LCBtYXN0ZXJSZWNvcmRQZXJtLCByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMsIHJlc3VsdCwgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgIGlmICghY3VycmVudE9iamVjdE5hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghcmVsYXRlZExpc3RJdGVtKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwicmVsYXRlZExpc3RJdGVtIG11c3Qgbm90IGJlIGVtcHR5IGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zXCIpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAoIWN1cnJlbnRSZWNvcmQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50UmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zKGN1cnJlbnRPYmplY3ROYW1lLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpO1xuICAgIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKTtcbiAgICByZXN1bHQgPSBfLmNsb25lKHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0SXRlbS5pc19maWxlKSB7XG4gICAgICByZXN1bHQuYWxsb3dDcmVhdGUgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzO1xuICAgICAgcmVzdWx0LmFsbG93RWRpdCA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlcztcbiAgICB9IGVsc2Uge1xuICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkTGlzdEl0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfHwgZmFsc2U7XG4gICAgICBtYXN0ZXJBbGxvdyA9IGZhbHNlO1xuICAgICAgaWYgKHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09PSB0cnVlKSB7XG4gICAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWQ7XG4gICAgICB9IGVsc2UgaWYgKHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09PSBmYWxzZSkge1xuICAgICAgICBtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0O1xuICAgICAgfVxuICAgICAgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSk7XG4gICAgICBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMTtcbiAgICAgIHJlc3VsdC5hbGxvd0NyZWF0ZSA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgICAgcmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIF9pLCBpc1NwYWNlQWRtaW4sIHBlcm1pc3Npb25zLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudCwgcHNldHNDdXJyZW50TmFtZXMsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzQ3VzdG9tZXIsIHBzZXRzQ3VzdG9tZXJfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNTdXBwbGllciwgcHNldHNTdXBwbGllcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3Bvcywgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge1xuICAgICAgb2JqZWN0czoge30sXG4gICAgICBhc3NpZ25lZF9hcHBzOiBbXVxuICAgIH07XG5cbiAgICAvKlxuICAgIFx0XHTmnYPpmZDpm4bor7TmmI46XG4gICAgXHRcdOWGhee9ruadg+mZkOmbhi1hZG1pbix1c2VyLG1lbWJlcixndWVzdCx3b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW5cbiAgICBcdFx06Ieq5a6a5LmJ5p2D6ZmQ6ZuGLeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOmbhuS7peWklueahOWFtuS7luadg+mZkOmbhlxuICAgIFx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxuICAgIFx0XHTlj6/phY3nva7nlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+WPr+mFjee9ru+8iS13b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW7ku6Xlj4roh6rlrprkuYnmnYPpmZDpm4ZcbiAgICAgKi9cbiAgICBpc1NwYWNlQWRtaW4gPSBmYWxzZTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW5fcG9zID0gbnVsbDtcbiAgICBwc2V0c1VzZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c01lbWJlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gbnVsbDtcbiAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNDdXN0b21lcl9wb3MgPSBudWxsO1xuICAgIGlmIChwc2V0c0FkbWluICE9IG51bGwgPyBwc2V0c0FkbWluLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c01lbWJlci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0d1ZXN0ICE9IG51bGwgPyBwc2V0c0d1ZXN0Ll9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzU3VwcGxpZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNDdXN0b21lci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1cnJlbnQubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIl9pZFwiKTtcbiAgICAgIHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICAgJGluOiBzZXRfaWRzXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIm5hbWVcIik7XG4gICAgfVxuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnQsXG4gICAgICBwc2V0c01lbWJlcjogcHNldHNNZW1iZXIsXG4gICAgICBwc2V0c0d1ZXN0OiBwc2V0c0d1ZXN0LFxuICAgICAgcHNldHNTdXBwbGllcjogcHNldHNTdXBwbGllcixcbiAgICAgIHBzZXRzQ3VzdG9tZXI6IHBzZXRzQ3VzdG9tZXIsXG4gICAgICBpc1NwYWNlQWRtaW46IGlzU3BhY2VBZG1pbixcbiAgICAgIHNwYWNlVXNlcjogc3BhY2VVc2VyLFxuICAgICAgcHNldHNBZG1pbl9wb3M6IHBzZXRzQWRtaW5fcG9zLFxuICAgICAgcHNldHNVc2VyX3BvczogcHNldHNVc2VyX3BvcyxcbiAgICAgIHBzZXRzTWVtYmVyX3BvczogcHNldHNNZW1iZXJfcG9zLFxuICAgICAgcHNldHNHdWVzdF9wb3M6IHBzZXRzR3Vlc3RfcG9zLFxuICAgICAgcHNldHNTdXBwbGllcl9wb3M6IHBzZXRzU3VwcGxpZXJfcG9zLFxuICAgICAgcHNldHNDdXN0b21lcl9wb3M6IHBzZXRzQ3VzdG9tZXJfcG9zLFxuICAgICAgcHNldHNDdXJyZW50X3BvczogcHNldHNDdXJyZW50X3Bvc1xuICAgIH07XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzO1xuICAgIF9pID0gMDtcbiAgICBfLmVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvYmplY3QsIG9iamVjdF9uYW1lKSB7XG4gICAgICBfaSsrO1xuICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09PSBzcGFjZUlkKSB7XG4gICAgICAgIGlmICghXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT09ICcwJyB8fCAob2JqZWN0LmluX2RldmVsb3BtZW50ICE9PSAnMCcgJiYgaXNTcGFjZUFkbWluKSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKTtcbiAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIHVuaW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBpbnRlcnNlY3Rpb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLmludGVyc2VjdGlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBleHRlbmRQZXJtaXNzaW9uUHJvcHMgPSBmdW5jdGlvbih0YXJnZXQsIHByb3BzKSB7XG4gICAgdmFyIGZpbGVzUHJvTmFtZXMsIHByb3BOYW1lcztcbiAgICBwcm9wTmFtZXMgPSBwZXJtaXNzaW9uUHJvcE5hbWVzO1xuICAgIHJldHVybiBmaWxlc1Byb05hbWVzID0gcHJvcHMgPyBfLmVhY2gocHJvcE5hbWVzLCBmdW5jdGlvbihwcm9wTmFtZSkge1xuICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgfSkgOiB2b2lkIDA7XG4gIH07XG4gIG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcHMpIHtcbiAgICB2YXIgcHJvcE5hbWVzO1xuICAgIHByb3BOYW1lcyA9IGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcztcbiAgICByZXR1cm4gXy5lYWNoKHByb3BOYW1lcywgZnVuY3Rpb24ocHJvcE5hbWUpIHtcbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhcHBzLCBpc1NwYWNlQWRtaW4sIHBzZXRCYXNlLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNDdXN0b21lciwgcHNldHNTdXBwbGllciwgcHNldHNVc2VyLCByZWYsIHJlZjEsIHNwYWNlVXNlciwgdXNlclByb2ZpbGU7XG4gICAgcHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzU3VwcGxpZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICBpZiAodXNlcklkKSB7XG4gICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYXBwcyA9IFtdO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlclByb2ZpbGUgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZi5wcm9maWxlIDogdm9pZCAwO1xuICAgICAgcHNldEJhc2UgPSBwc2V0c1VzZXI7XG4gICAgICBpZiAodXNlclByb2ZpbGUpIHtcbiAgICAgICAgaWYgKHVzZXJQcm9maWxlID09PSAnc3VwcGxpZXInKSB7XG4gICAgICAgICAgcHNldEJhc2UgPSBwc2V0c1N1cHBsaWVyO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXJQcm9maWxlID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgcHNldEJhc2UgPSBwc2V0c0N1c3RvbWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHNldEJhc2UgIT0gbnVsbCA/IChyZWYxID0gcHNldEJhc2UuYXNzaWduZWRfYXBwcykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgXy5lYWNoKHBzZXRzLCBmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgIGlmICghcHNldC5hc3NpZ25lZF9hcHBzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwc2V0Lm5hbWUgPT09IFwiYWRtaW5cIiB8fCBwc2V0Lm5hbWUgPT09IFwidXNlclwiIHx8IHBzZXQubmFtZSA9PT0gJ3N1cHBsaWVyJyB8fCBwc2V0Lm5hbWUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLCB2b2lkIDAsIG51bGwpO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFib3V0TWVudSwgYWRtaW5NZW51cywgYWxsTWVudXMsIGN1cnJlbnRQc2V0TmFtZXMsIGlzU3BhY2VBZG1pbiwgbWVudXMsIG90aGVyTWVudUFwcHMsIG90aGVyTWVudXMsIHBzZXRzLCByZWYsIHJlZjEsIHJlc3VsdCwgdXNlclByb2ZpbGU7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIG5hbWU6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhZG1pbk1lbnVzID0gKHJlZiA9IENyZWF0b3IuQXBwcy5hZG1pbikgIT0gbnVsbCA/IHJlZi5hZG1pbl9tZW51cyA6IHZvaWQgMDtcbiAgICBpZiAoIWFkbWluTWVudXMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgYWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCA9PT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkICE9PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeShfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCBmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5hZG1pbl9tZW51cyAmJiBuLl9pZCAhPT0gJ2FkbWluJztcbiAgICB9KSwgJ3NvcnQnKTtcbiAgICBvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSk7XG4gICAgYWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXN1bHQgPSBhbGxNZW51cztcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlclByb2ZpbGUgPSAoKHJlZjEgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5wcm9maWxlIDogdm9pZCAwKSB8fCAndXNlcic7XG4gICAgICBjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4ubmFtZTtcbiAgICAgIH0pO1xuICAgICAgbWVudXMgPSBhbGxNZW51cy5maWx0ZXIoZnVuY3Rpb24obWVudSkge1xuICAgICAgICB2YXIgcHNldHNNZW51O1xuICAgICAgICBwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0cztcbiAgICAgICAgaWYgKHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZih1c2VyUHJvZmlsZSkgPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aDtcbiAgICAgIH0pO1xuICAgICAgcmVzdWx0ID0gbWVudXM7XG4gICAgfVxuICAgIHJldHVybiBfLnNvcnRCeShyZXN1bHQsIFwic29ydFwiKTtcbiAgfTtcbiAgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbmQocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWRcbiAgICB9KTtcbiAgfTtcbiAgZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcykge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAkaW46IHBlcm1pc3Npb25fc2V0X2lkc1xuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gIH07XG4gIHVuaW9uUGVybWlzc2lvbk9iamVjdHMgPSBmdW5jdGlvbihwb3MsIG9iamVjdCwgcHNldHMpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIHJlc3VsdCA9IFtdO1xuICAgIF8uZWFjaChvYmplY3QucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKG9wcywgb3BzX2tleSkge1xuICAgICAgdmFyIGN1cnJlbnRQc2V0LCB0ZW1wT3BzO1xuICAgICAgaWYgKFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwKSB7XG4gICAgICAgIGN1cnJlbnRQc2V0ID0gcHNldHMuZmluZChmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgICAgcmV0dXJuIHBzZXQubmFtZSA9PT0gb3BzX2tleTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjdXJyZW50UHNldCkge1xuICAgICAgICAgIHRlbXBPcHMgPSBfLmNsb25lKG9wcykgfHwge307XG4gICAgICAgICAgdGVtcE9wcy5wZXJtaXNzaW9uX3NldF9pZCA9IGN1cnJlbnRQc2V0Ll9pZDtcbiAgICAgICAgICB0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgICAgICAgIHJldHVybiByZXN1bHQucHVzaCh0ZW1wT3BzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XG4gICAgICBwb3MuZm9yRWFjaChmdW5jdGlvbihwbykge1xuICAgICAgICB2YXIgcmVwZWF0SW5kZXgsIHJlcGVhdFBvO1xuICAgICAgICByZXBlYXRJbmRleCA9IDA7XG4gICAgICAgIHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICByZXBlYXRJbmRleCA9IGluZGV4O1xuICAgICAgICAgIHJldHVybiBpdGVtLnBlcm1pc3Npb25fc2V0X2lkID09PSBwby5wZXJtaXNzaW9uX3NldF9pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZXBlYXRQbykge1xuICAgICAgICAgIHJldHVybiByZXN1bHRbcmVwZWF0SW5kZXhdID0gcG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHBvKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcG9zO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgaXNTcGFjZUFkbWluLCBvYmplY3QsIG9wc2V0QWRtaW4sIG9wc2V0Q3VzdG9tZXIsIG9wc2V0R3Vlc3QsIG9wc2V0TWVtYmVyLCBvcHNldFN1cHBsaWVyLCBvcHNldFVzZXIsIHBlcm1pc3Npb25zLCBwb3MsIHBvc0FkbWluLCBwb3NDdXN0b21lciwgcG9zR3Vlc3QsIHBvc01lbWJlciwgcG9zU3VwcGxpZXIsIHBvc1VzZXIsIHByb2YsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7fTtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk7XG4gICAgaWYgKHNwYWNlSWQgPT09ICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT09IFwidXNlcnNcIikge1xuICAgICAgcGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge307XG4gICAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIHx8IHRoaXMucHNldHNBZG1pbiA/IHRoaXMucHNldHNBZG1pbiA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSB8fCB0aGlzLnBzZXRzVXNlciA/IHRoaXMucHNldHNVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c01lbWJlciA9IF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIHx8IHRoaXMucHNldHNNZW1iZXIgPyB0aGlzLnBzZXRzTWVtYmVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzR3Vlc3QgPSBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIHx8IHRoaXMucHNldHNHdWVzdCA/IHRoaXMucHNldHNHdWVzdCA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzU3VwcGxpZXIpIHx8IHRoaXMucHNldHNTdXBwbGllciA/IHRoaXMucHNldHNTdXBwbGllciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzQ3VzdG9tZXIpIHx8IHRoaXMucHNldHNDdXN0b21lciA/IHRoaXMucHNldHNDdXN0b21lciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQ7XG4gICAgaWYgKCFwc2V0cykge1xuICAgICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICRvcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3BvcztcbiAgICBwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3BvcztcbiAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3M7XG4gICAgcHNldHNDdXN0b21lcl9wb3MgPSB0aGlzLnBzZXRzQ3VzdG9tZXJfcG9zO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3M7XG4gICAgb3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fTtcbiAgICBvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fTtcbiAgICBvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge307XG4gICAgb3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICBvcHNldFN1cHBsaWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuc3VwcGxpZXIpIHx8IHt9O1xuICAgIG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge307XG4gICAgaWYgKHBzZXRzQWRtaW4pIHtcbiAgICAgIHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldEFkbWluLCBwb3NBZG1pbik7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIpIHtcbiAgICAgIHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldFVzZXIsIHBvc1VzZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIpIHtcbiAgICAgIHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldE1lbWJlciwgcG9zTWVtYmVyKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QpIHtcbiAgICAgIHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldEd1ZXN0LCBwb3NHdWVzdCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1N1cHBsaWVyKSB7XG4gICAgICBwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRTdXBwbGllciwgcG9zU3VwcGxpZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lcikge1xuICAgICAgcG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0Q3VzdG9tZXIsIHBvc0N1c3RvbWVyKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3BhY2VJZCA9PT0gJ2NvbW1vbicpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFjZVVzZXIgPSBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgfHwgdGhpcy5zcGFjZVVzZXIgPyB0aGlzLnNwYWNlVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChzcGFjZVVzZXIpIHtcbiAgICAgICAgICAgIHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZTtcbiAgICAgICAgICAgIGlmIChwcm9mKSB7XG4gICAgICAgICAgICAgIGlmIChwcm9mID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnbWVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2d1ZXN0Jykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnc3VwcGxpZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0Q3VzdG9tZXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0cywgXCJfaWRcIik7XG4gICAgICBwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKTtcbiAgICAgIHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKTtcbiAgICAgIF8uZWFjaChwb3MsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIGlmIChwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pc0VtcHR5KHBlcm1pc3Npb25zKSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gcG87XG4gICAgICAgIH1cbiAgICAgICAgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzKHBlcm1pc3Npb25zLCBwbyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpO1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKTtcbiAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChvYmplY3QuaXNfdmlldykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW107XG4gICAgfVxuICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICBpZiAob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyKSB7XG4gICAgICBwZXJtaXNzaW9ucy5vd25lciA9IG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcjtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgXCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZCk7XG4gICAgfVxuICB9KTtcbn1cbiIsIlxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcblxuTWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SXG5cdG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXG5cdGlmIGNyZWF0b3JfZGJfdXJsXG5cdFx0aWYgIW9wbG9nX3VybFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpXG5cdFx0Q3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge19kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7b3Bsb2dVcmw6IG9wbG9nX3VybH0pfVxuXG5DcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lID0gKG9iamVjdCktPlxuI1x0aWYgb2JqZWN0LnRhYmxlX25hbWUgJiYgb2JqZWN0LnRhYmxlX25hbWUuZW5kc1dpdGgoXCJfX2NcIilcbiNcdFx0cmV0dXJuIG9iamVjdC50YWJsZV9uYW1lXG4jXHRlbHNlXG4jXHRcdHJldHVybiBvYmplY3QubmFtZVxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IChvYmplY3QpLT5cblx0Y29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdClcblx0aWYgZGJbY29sbGVjdGlvbl9rZXldXG5cdFx0cmV0dXJuIGRiW2NvbGxlY3Rpb25fa2V5XVxuXHRlbHNlIGlmIG9iamVjdC5kYlxuXHRcdHJldHVybiBvYmplY3QuZGJcblxuXHRpZiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxuXHRlbHNlXG5cdFx0aWYgb2JqZWN0LmN1c3RvbVxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSlcblx0XHRlbHNlXG5cdFx0XHRpZiBjb2xsZWN0aW9uX2tleSA9PSAnX3Ntc19xdWV1ZScgJiYgU01TUXVldWU/LmNvbGxlY3Rpb25cblx0XHRcdFx0cmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb25cblx0XHRcdHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5KVxuXG5cbiIsInZhciBzdGVlZG9zQ29yZTtcblxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJyk7XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRvcl9kYl91cmwsIG9wbG9nX3VybDtcbiAgY3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUjtcbiAgb3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1I7XG4gIGlmIChjcmVhdG9yX2RiX3VybCkge1xuICAgIGlmICghb3Bsb2dfdXJsKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIik7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7XG4gICAgICBfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge1xuICAgICAgICBvcGxvZ1VybDogb3Bsb2dfdXJsXG4gICAgICB9KVxuICAgIH07XG4gIH1cbn0pO1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgY29sbGVjdGlvbl9rZXk7XG4gIGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpO1xuICBpZiAoZGJbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIGRiW2NvbGxlY3Rpb25fa2V5XTtcbiAgfSBlbHNlIGlmIChvYmplY3QuZGIpIHtcbiAgICByZXR1cm4gb2JqZWN0LmRiO1xuICB9XG4gIGlmIChDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0LmN1c3RvbSkge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb2xsZWN0aW9uX2tleSA9PT0gJ19zbXNfcXVldWUnICYmICh0eXBlb2YgU01TUXVldWUgIT09IFwidW5kZWZpbmVkXCIgJiYgU01TUXVldWUgIT09IG51bGwgPyBTTVNRdWV1ZS5jb2xsZWN0aW9uIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm4gU01TUXVldWUuY29sbGVjdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5KTtcbiAgICB9XG4gIH1cbn07XG4iLCJDcmVhdG9yLmFjdGlvbnNCeU5hbWUgPSB7fVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0c3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcblx0IyDlrprkuYnlhajlsYAgYWN0aW9ucyDlh73mlbBcdFxuXHRDcmVhdG9yLmFjdGlvbnMgPSAoYWN0aW9ucyktPlxuXHRcdF8uZWFjaCBhY3Rpb25zLCAodG9kbywgYWN0aW9uX25hbWUpLT5cblx0XHRcdENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvIFxuXG5cdENyZWF0b3IuZXhlY3V0ZUFjdGlvbiA9IChvYmplY3RfbmFtZSwgYWN0aW9uLCByZWNvcmRfaWQsIGl0ZW1fZWxlbWVudCwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxiYWNrKS0+XG5cdFx0aWYgYWN0aW9uICYmIGFjdGlvbi50eXBlID09ICd3b3JkLXByaW50J1xuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdGZpbHRlcnMgPSBbJ19pZCcsICc9JywgcmVjb3JkX2lkXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmaWx0ZXJzID0gT2JqZWN0R3JpZC5nZXRGaWx0ZXJzKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGZhbHNlLCBudWxsLCBudWxsKVxuXHRcdFx0dXJsID0gXCIvYXBpL3Y0L3dvcmRfdGVtcGxhdGVzL1wiICsgYWN0aW9uLndvcmRfdGVtcGxhdGUgKyBcIi9wcmludFwiICsgXCI/ZmlsdGVycz1cIiArIHN0ZWVkb3NGaWx0ZXJzLmZvcm1hdEZpbHRlcnNUb09EYXRhUXVlcnkoZmlsdGVycyk7XG5cdFx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG5cdFx0XHRyZXR1cm4gd2luZG93Lm9wZW4odXJsKTtcblxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmIGFjdGlvbj8udG9kb1xuXHRcdFx0aWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwic3RyaW5nXCJcblx0XHRcdFx0dG9kbyA9IENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb24udG9kb11cblx0XHRcdGVsc2UgaWYgdHlwZW9mIGFjdGlvbi50b2RvID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHR0b2RvID0gYWN0aW9uLnRvZG9cdFxuXHRcdFx0aWYgIXJlY29yZCAmJiBvYmplY3RfbmFtZSAmJiByZWNvcmRfaWRcblx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdGlmIHRvZG9cblx0XHRcdFx0IyBpdGVtX2VsZW1lbnTkuLrnqbrml7blupTor6Xorr7nva7pu5jorqTlgLzvvIjlr7nosaHnmoRuYW1l5a2X5q6177yJ77yM5ZCm5YiZbW9yZUFyZ3Pmi7/liLDnmoTlkI7nu63lj4LmlbDkvY3nva7lsLHkuI3lr7lcblx0XHRcdFx0aXRlbV9lbGVtZW50ID0gaWYgaXRlbV9lbGVtZW50IHRoZW4gaXRlbV9lbGVtZW50IGVsc2UgXCJcIlxuXHRcdFx0XHRtb3JlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMylcblx0XHRcdFx0dG9kb0FyZ3MgPSBbb2JqZWN0X25hbWUsIHJlY29yZF9pZF0uY29uY2F0KG1vcmVBcmdzKVxuXHRcdFx0XHR0b2RvLmFwcGx5IHtcblx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZWNvcmRfaWQ6IHJlY29yZF9pZFxuXHRcdFx0XHRcdG9iamVjdDogb2JqXG5cdFx0XHRcdFx0YWN0aW9uOiBhY3Rpb25cblx0XHRcdFx0XHRpdGVtX2VsZW1lbnQ6IGl0ZW1fZWxlbWVudFxuXHRcdFx0XHRcdHJlY29yZDogcmVjb3JkXG5cdFx0XHRcdH0sIHRvZG9BcmdzXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKVxuXHRcdGVsc2Vcblx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJfb2JqZWN0X2FjdGlvbnNfbm9uZV90b2RvXCIpKVxuXG5cblx0X2RlbGV0ZVJlY29yZCA9IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2ssIGNhbGxfYmFja19lcnJvciktPlxuXHRcdCMgY29uc29sZS5sb2coXCI9PT1fZGVsZXRlUmVjb3JkPT09XCIsIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaywgY2FsbF9iYWNrX2Vycm9yKTtcblx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRwcmV2aW91c0RvYyA9IEZvcm1NYW5hZ2VyLmdldFByZXZpb3VzRG9jKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICdkZWxldGUnKVxuXHRcdENyZWF0b3Iub2RhdGEuZGVsZXRlIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICgpLT5cblx0XHRcdGlmIHJlY29yZF90aXRsZVxuXHRcdFx0XHQjIGluZm8gPSBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCIgKyBcIuW3suWIoOmZpFwiXG5cdFx0XHRcdGluZm8gPXQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKVxuXHRcdFx0dG9hc3RyLnN1Y2Nlc3MgaW5mb1xuXHRcdFx0aWYgY2FsbF9iYWNrIGFuZCB0eXBlb2YgY2FsbF9iYWNrID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRjYWxsX2JhY2soKVxuXG5cdFx0XHRGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2FmdGVyJywge19pZDogcmVjb3JkX2lkLCBwcmV2aW91c0RvYzogcHJldmlvdXNEb2N9KVxuXHRcdCwgKGVycm9yKS0+XG5cdFx0XHRpZiBjYWxsX2JhY2tfZXJyb3IgYW5kIHR5cGVvZiBjYWxsX2JhY2tfZXJyb3IgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdGNhbGxfYmFja19lcnJvcigpXG5cdFx0XHRGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2Vycm9yJywge19pZDogcmVjb3JkX2lkLCBlcnJvcjogZXJyb3J9KVxuXG5cdENyZWF0b3IucmVsYXRlZE9iamVjdFN0YW5kYXJkTmV3ID0gKHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRyZWxhdGVPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKVxuXHRcdGNvbGxlY3Rpb25fbmFtZSA9IHJlbGF0ZU9iamVjdC5sYWJlbFxuXHRcdGNvbGxlY3Rpb24gPSBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKS5fY29sbGVjdGlvbl9uYW1lfVwiXG5cdFx0Y3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0aWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbcmVsYXRlZF9vYmplY3RfbmFtZV1cblx0XHRpbml0aWFsVmFsdWVzID0ge307XG5cdFx0aWYgaWRzPy5sZW5ndGhcblx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXG5cdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxuXHRcdFx0cmVjb3JkX2lkID0gaWRzWzBdXG5cdFx0XHRkb2MgPSBDcmVhdG9yLm9kYXRhLmdldChyZWxhdGVkX29iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRpbml0aWFsVmFsdWVzID0gZG9jXG5cdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcblx0XHRlbHNlXG5cdFx0XHRkZWZhdWx0RG9jID0gRm9ybU1hbmFnZXIuZ2V0UmVsYXRlZEluaXRpYWxWYWx1ZXMoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuXHRcdFx0aWYgIV8uaXNFbXB0eShkZWZhdWx0RG9jKVxuXHRcdFx0XHRpbml0aWFsVmFsdWVzID0gZGVmYXVsdERvY1xuXHRcdGlmIHJlbGF0ZU9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRyZXR1cm4gU3RlZWRvc1VJLnNob3dNb2RhbChzdG9yZXMuQ29tcG9uZW50UmVnaXN0cnkuY29tcG9uZW50cy5PYmplY3RGb3JtLCB7XG5cdFx0XHRcdG5hbWU6IFwiI3tyZWxhdGVkX29iamVjdF9uYW1lfV9zdGFuZGFyZF9uZXdfZm9ybVwiLFxuXHRcdFx0XHRvYmplY3RBcGlOYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuXHRcdFx0XHR0aXRsZTogJ+aWsOW7uiAnICsgcmVsYXRlT2JqZWN0LmxhYmVsLFxuXHRcdFx0XHRpbml0aWFsVmFsdWVzOiBpbml0aWFsVmFsdWVzLFxuXHRcdFx0XHRhZnRlckluc2VydDogKHJlc3VsdCktPlxuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCktPlxuXHRcdFx0XHRcdFx0IyBPYmplY3RGb3Jt5pyJ57yT5a2Y77yM5paw5bu65a2Q6KGo6K6w5b2V5Y+v6IO95Lya5pyJ5rGH5oC75a2X5q6177yM6ZyA6KaB5Yi35paw6KGo5Y2V5pWw5o2uXG5cdFx0XHRcdFx0XHRpZiBDcmVhdG9yLmdldE9iamVjdChjdXJyZW50X29iamVjdF9uYW1lKS52ZXJzaW9uID4gMVxuXHRcdFx0XHRcdFx0XHRTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKTtcblx0XHRcdFx0XHQsIDEpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSwgbnVsbCwge2ljb25QYXRoOiAnL2Fzc2V0cy9pY29ucyd9KVxuXG5cblx0XHRpZiBpZHM/Lmxlbmd0aFxuXHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cblx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XG5cdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXG5cdFx0XHQjIOKAnOS/neWtmOW5tuaWsOW7uuKAneaTjeS9nOS4reiHquWKqOaJk+W8gOeahOaWsOeql+WPo+S4remcgOimgeWGjeasoeWkjeWItuacgOaWsOeahGRvY+WGheWuueWIsOaWsOeql+WPo+S4rVxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcblx0XHRlbHNlXG5cdFx0XHRpZiAhXy5pc0VtcHR5KGluaXRpYWxWYWx1ZXMpXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblxuXHRcdFNlc3Npb24uc2V0KFwiYWN0aW9uX2ZpZWxkc1wiLCB1bmRlZmluZWQpXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fY29sbGVjdGlvblwiLCBjb2xsZWN0aW9uKVxuXHRcdFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25fbmFtZVwiLCBjb2xsZWN0aW9uX25hbWUpXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fc2F2ZV9hbmRfaW5zZXJ0XCIsIGZhbHNlKVxuXHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHQkKFwiLmNyZWF0b3ItYWRkLXJlbGF0ZWRcIikuY2xpY2soKVxuXHRcdHJldHVyblxuXG5cdENyZWF0b3IuYWN0aW9ucyBcblx0XHQjIOWcqOatpOWumuS5ieWFqOWxgCBhY3Rpb25zXG5cdFx0XCJzdGFuZGFyZF9xdWVyeVwiOiAoKS0+XG5cdFx0XHRNb2RhbC5zaG93KFwic3RhbmRhcmRfcXVlcnlfbW9kYWxcIilcblxuXHRcdFwic3RhbmRhcmRfbmV3XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdCMgY3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRcdFx0IyBpZiBjdXJyZW50X3JlY29yZF9pZFxuXHRcdFx0IyBcdCMgYW1pcyDnm7jlhbPlrZDooajlj7PkuIrop5LmlrDlu7pcblx0XHRcdCMgXHRDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyhvYmplY3RfbmFtZSlcblx0XHRcdCMgXHRyZXR1cm4gXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG5cdFx0XHRncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuXHRcdFx0aXNSZWxhdGVkID0gdGhpcy5hY3Rpb24uaXNSZWxhdGVkO1xuXHRcdFx0aWYgaXNSZWxhdGVkXG5cdFx0XHRcdHJlbGF0ZWRGaWVsZE5hbWUgPSB0aGlzLmFjdGlvbi5yZWxhdGVkRmllbGROYW1lO1xuXHRcdFx0XHRtYXN0ZXJSZWNvcmRJZCA9IHRoaXMuYWN0aW9uLm1hc3RlclJlY29yZElkO1xuXHRcdFx0XHRpbml0aWFsVmFsdWVzID0gdGhpcy5hY3Rpb24uaW5pdGlhbFZhbHVlc1xuXHRcdFx0XHRpZiAhaW5pdGlhbFZhbHVlc1xuXHRcdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSB7fTtcblx0XHRcdFx0XHRpbml0aWFsVmFsdWVzW3JlbGF0ZWRGaWVsZE5hbWVdID0gbWFzdGVyUmVjb3JkSWRcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5pdGlhbFZhbHVlcz17fVxuXHRcdFx0XHRpZihncmlkTmFtZSlcblx0XHRcdFx0XHRzZWxlY3RlZFJvd3MgPSB3aW5kb3cuZ3JpZFJlZnM/W2dyaWROYW1lXS5jdXJyZW50Py5hcGk/LmdldFNlbGVjdGVkUm93cygpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzZWxlY3RlZFJvd3MgPSB3aW5kb3cuZ3JpZFJlZj8uY3VycmVudD8uYXBpPy5nZXRTZWxlY3RlZFJvd3MoKVx0XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBzZWxlY3RlZFJvd3M/Lmxlbmd0aFxuXHRcdFx0XHRcdHJlY29yZF9pZCA9IHNlbGVjdGVkUm93c1swXS5faWQ7XG5cdFx0XHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdFx0XHRpbml0aWFsVmFsdWVzID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IEZvcm1NYW5hZ2VyLmdldEluaXRpYWxWYWx1ZXMob2JqZWN0X25hbWUpXG5cblx0XHRcdGlmIG9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRcdHJldHVybiBTdGVlZG9zLlBhZ2UuRm9ybS5TdGFuZGFyZE5ldy5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCAn5paw5bu6ICcgKyBvYmplY3QubGFiZWwsIGluaXRpYWxWYWx1ZXMgLCB7Z3JpZE5hbWU6IGdyaWROYW1lfSk7XG5cdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdGlmIHNlbGVjdGVkUm93cz8ubGVuZ3RoXG5cdFx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXG5cdFx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblx0XHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0JChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpXG5cdFx0XHRyZXR1cm4gXG5cblx0XHRcInN0YW5kYXJkX29wZW5fdmlld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZilcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XCJzdGFuZGFyZF9lZGl0XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG5cdFx0XHRcdGlmIG9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRcdFx0cmV0dXJuIFN0ZWVkb3MuUGFnZS5Gb3JtLlN0YW5kYXJkRWRpdC5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCAn57yW6L6RICcgKyBvYmplY3QubGFiZWwsIHJlY29yZF9pZCwge1xuXHRcdFx0XHRcdFx0Z3JpZE5hbWU6IHRoaXMuYWN0aW9uLmdyaWROYW1lXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlXG4jXHRcdFx0XHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHJlY29yZFxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAncmVsb2FkX2R4bGlzdCcsIGZhbHNlXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0XHRcdFx0JChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdFx0XHRcdCQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpXG5cblx0XHRcInN0YW5kYXJkX2RlbGV0ZVwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKS0+XG5cdFx0XHRncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuXHRcdFx0IyBjb25zb2xlLmxvZyhcIj09PXN0YW5kYXJkX2RlbGV0ZT09PVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spO1xuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtfaWQ6IHJlY29yZF9pZH0pXG5cdFx0XHRcdGlmICFiZWZvcmVIb29rXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0XHRuYW1lRmllbGQgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVkgfHwgXCJuYW1lXCJcblxuXHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBcImFsbFwiXG5cblx0XHRcdGlmKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlKVxuXHRcdFx0XHRyZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGVbbmFtZUZpZWxkXVxuXHRcdFx0XG5cdFx0XHRpZiByZWNvcmQgJiYgIXJlY29yZF90aXRsZVxuXHRcdFx0XHRyZWNvcmRfdGl0bGUgPSByZWNvcmRbbmFtZUZpZWxkXVxuXHRcdFx0XG5cdFx0XHRpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCJcblx0XHRcdGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCJcblxuXHRcdFx0dW5sZXNzIHJlY29yZF9pZFxuXHRcdFx0XHRpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X3N3YWxfdGl0bGVcIlxuXHRcdFx0XHRpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90ZXh0XCJcblxuXHRcdFx0XHQjIOWmguaenOaYr+aJuemHj+WIoOmZpO+8jOWImeS8oOWFpeeahGxpc3Rfdmlld19pZOS4uuWIl+ihqOinhuWbvueahG5hbWXvvIznlKjkuo7ojrflj5bliJfooajpgInkuK3poblcblx0XHRcdFx0IyDkuLvliJfooajop4TliJnmmK9cImxpc3R2aWV3XyN7b2JqZWN0X25hbWV9XyN7bGlzdF92aWV3X2lkfVwi77yM55u45YWz6KGo6KeE5YiZ5pivXCJyZWxhdGVkX2xpc3R2aWV3XyN7b2JqZWN0X25hbWV9XyN7cmVsYXRlZF9vYmplY3RfbmFtZX1fI3tyZWxhdGVkX2ZpZWxkX25hbWV9XCJcblx0XHRcdFx0c2VsZWN0ZWRSZWNvcmRzID0gU3RlZWRvc1VJLmdldFRhYmxlU2VsZWN0ZWRSb3dzKGdyaWROYW1lIHx8IGxpc3Rfdmlld19pZClcblx0XHRcdFx0aWYgIXNlbGVjdGVkUmVjb3JkcyB8fCAhc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aFxuXHRcdFx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9ub19zZWxlY3Rpb25cIikpXG5cdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdGlmIHJlY29yZF90aXRsZVxuXHRcdFx0XHR0ZXh0ID0gdCBpMThuVGV4dEtleSwgXCIje29iamVjdC5sYWJlbH0gXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0ZXh0ID0gdCBpMThuVGV4dEtleSwgXCIje29iamVjdC5sYWJlbH1cIlxuXHRcdFx0c3dhbFxuXHRcdFx0XHR0aXRsZTogdCBpMThuVGl0bGVLZXksIFwiI3tvYmplY3QubGFiZWx9XCJcblx0XHRcdFx0dGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz4je3RleHR9PC9kaXY+XCJcblx0XHRcdFx0aHRtbDogdHJ1ZVxuXHRcdFx0XHRzaG93Q2FuY2VsQnV0dG9uOnRydWVcblx0XHRcdFx0Y29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpXG5cdFx0XHRcdGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXG5cdFx0XHRcdChvcHRpb24pIC0+XG5cdFx0XHRcdFx0aWYgb3B0aW9uXG5cdFx0XHRcdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0XHRcdFx0IyDljZXmnaHorrDlvZXliKDpmaRcblx0XHRcdFx0XHRcdFx0X2RlbGV0ZVJlY29yZCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0IyDmlofku7bniYjmnKzkuLpcImNmcy5maWxlcy5maWxlcmVjb3JkXCLvvIzpnIDopoHmm7/mjaLkuLpcImNmcy1maWxlcy1maWxlcmVjb3JkXCJcblx0XHRcdFx0XHRcdFx0XHRncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csXCItXCIpXG5cdFx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGdyaWRDb250YWluZXI/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgd2luZG93Lm9wZW5lclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc09wZW5lclJlbW92ZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0XHQjIE9iamVjdEZvcm3mnInnvJPlrZjvvIzliKDpmaTlrZDooajorrDlvZXlj6/og73kvJrmnInmsYfmgLvlrZfmrrXvvIzpnIDopoHliLfmlrDooajljZXmlbDmja5cblx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBjdXJyZW50X29iamVjdF9uYW1lICYmIENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpPy52ZXJzaW9uID4gMVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdF9uYW1lICE9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuXHRcdFx0XHRcdFx0XHRcdGNhdGNoIF9lXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKF9lKTtcblx0XHRcdFx0XHRcdFx0XHRpZiBncmlkQ29udGFpbmVyPy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJylcblx0XHRcdFx0XHRcdFx0XHRpZiBkeERhdGFHcmlkSW5zdGFuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdF9uYW1lICE9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0VGVtcGxhdGUuY3JlYXRvcl9ncmlkLnJlZnJlc2goZHhEYXRhR3JpZEluc3RhbmNlKVxuXHRcdFx0XHRcdFx0XHRcdHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0dGVtcE5hdlJlbW92ZWQgPSBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpICPml6DorrrmmK/lnKjorrDlvZXor6bnu4bnlYzpnaLov5jmmK/liJfooajnlYzpnaLmiafooYzliKDpmaTmk43kvZzvvIzpg73kvJrmiorkuLTml7blr7zoiKrliKDpmaTmjolcblx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZSBvciAhZHhEYXRhR3JpZEluc3RhbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuY2xvc2UoKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgYW5kIGxpc3Rfdmlld19pZCAhPSAnY2FsZW5kYXInXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIHRlbXBOYXZSZW1vdmVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpznoa7lrp7liKDpmaTkuobkuLTml7blr7zoiKrvvIzlsLHlj6/og73lt7Lnu4/ph43lrprlkJHliLDkuIrkuIDkuKrpobXpnaLkuobvvIzmsqHlv4XopoHlho3ph43lrprlkJHkuIDmrKFcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLmdvIFwiL2FwcC8je2FwcGlkfS8je29iamVjdF9uYW1lfS9ncmlkLyN7bGlzdF92aWV3X2lkfVwiXG5cdFx0XHRcdFx0XHRcdFx0aWYgY2FsbF9iYWNrIGFuZCB0eXBlb2YgY2FsbF9iYWNrID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FsbF9iYWNrKClcdFx0XHRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0IyDmibnph4/liKDpmaRcblx0XHRcdFx0XHRcdFx0aWYgc2VsZWN0ZWRSZWNvcmRzICYmIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImxvYWRpbmdcIilcblx0XHRcdFx0XHRcdFx0XHRkZWxldGVDb3VudGVyID0gMDtcblx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUgPSAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxldGVDb3VudGVyKytcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGRlbGV0ZUNvdW50ZXIgPj0gc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIGNvbnNvbGUubG9nKFwiZGVsZXRlQ291bnRlciwgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aD09PVwiLCBkZWxldGVDb3VudGVyLCBzZWxlY3RlZFJlY29yZHMubGVuZ3RoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJsb2FkaW5nXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZWN0ZWRSZWNvcmRzLmZvckVhY2ggKHJlY29yZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2lkID0gcmVjb3JkLl9pZFxuXHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge19pZDogcmVjb3JkX2lkfSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmICFiZWZvcmVIb29rXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFmdGVyQmF0Y2hlc0RlbGV0ZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZFRpdGxlID0gcmVjb3JkW25hbWVGaWVsZF0gfHwgcmVjb3JkX2lkXG5cdFx0XHRcdFx0XHRcdFx0XHRfZGVsZXRlUmVjb3JkIG9iamVjdF9uYW1lLCByZWNvcmQuX2lkLCByZWNvcmRUaXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsICgoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCkgI+aXoOiuuuaYr+WcqOiusOW9leivpue7hueVjOmdoui/mOaYr+WIl+ihqOeVjOmdouaJp+ihjOWIoOmZpOaTjeS9nO+8jOmDveS8muaKiuS4tOaXtuWvvOiIquWIoOmZpOaOiVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKVxuXHRcdFx0XHRcdFx0XHRcdFx0KSwgKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKSIsInZhciBfZGVsZXRlUmVjb3JkLCBzdGVlZG9zRmlsdGVycztcblxuQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgc3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsYmFjaykge1xuICAgIHZhciBmaWx0ZXJzLCBtb3JlQXJncywgb2JqLCB0b2RvLCB0b2RvQXJncywgdXJsO1xuICAgIGlmIChhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT09ICd3b3JkLXByaW50Jykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBmaWx0ZXJzID0gWydfaWQnLCAnPScsIHJlY29yZF9pZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWx0ZXJzID0gT2JqZWN0R3JpZC5nZXRGaWx0ZXJzKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGZhbHNlLCBudWxsLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIHVybCA9IFwiL2FwaS92NC93b3JkX3RlbXBsYXRlcy9cIiArIGFjdGlvbi53b3JkX3RlbXBsYXRlICsgXCIvcHJpbnRcIiArIFwiP2ZpbHRlcnM9XCIgKyBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5KGZpbHRlcnMpO1xuICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMCkge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9kbyA9IGFjdGlvbi50b2RvO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgaXRlbV9lbGVtZW50ID0gaXRlbV9lbGVtZW50ID8gaXRlbV9lbGVtZW50IDogXCJcIjtcbiAgICAgICAgbW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuICAgICAgICB0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpO1xuICAgICAgICByZXR1cm4gdG9kby5hcHBseSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdDogb2JqLFxuICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgIGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50LFxuICAgICAgICAgIHJlY29yZDogcmVjb3JkXG4gICAgICAgIH0sIHRvZG9BcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgfVxuICB9O1xuICBfZGVsZXRlUmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpIHtcbiAgICB2YXIgb2JqZWN0LCBwcmV2aW91c0RvYztcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgcHJldmlvdXNEb2MgPSBGb3JtTWFuYWdlci5nZXRQcmV2aW91c0RvYyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAnZGVsZXRlJyk7XG4gICAgcmV0dXJuIENyZWF0b3Iub2RhdGFbXCJkZWxldGVcIl0ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5mbztcbiAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgaW5mbyA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgKFwiXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKTtcbiAgICAgIH1cbiAgICAgIHRvYXN0ci5zdWNjZXNzKGluZm8pO1xuICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbF9iYWNrKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtcbiAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY1xuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGlmIChjYWxsX2JhY2tfZXJyb3IgJiYgdHlwZW9mIGNhbGxfYmFja19lcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxfYmFja19lcnJvcigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7XG4gICAgICAgIF9pZDogcmVjb3JkX2lkLFxuICAgICAgICBlcnJvcjogZXJyb3JcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyA9IGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgY29sbGVjdGlvbl9uYW1lLCBjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCwgZGVmYXVsdERvYywgZG9jLCBpZHMsIGluaXRpYWxWYWx1ZXMsIHJlY29yZF9pZCwgcmVsYXRlT2JqZWN0O1xuICAgIHJlbGF0ZU9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgIGNvbGxlY3Rpb25fbmFtZSA9IHJlbGF0ZU9iamVjdC5sYWJlbDtcbiAgICBjb2xsZWN0aW9uID0gXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpLl9jb2xsZWN0aW9uX25hbWUpO1xuICAgIGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG4gICAgaWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgaW5pdGlhbFZhbHVlcyA9IHt9O1xuICAgIGlmIChpZHMgIT0gbnVsbCA/IGlkcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgIHJlY29yZF9pZCA9IGlkc1swXTtcbiAgICAgIGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBpbml0aWFsVmFsdWVzID0gZG9jO1xuICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0RG9jID0gRm9ybU1hbmFnZXIuZ2V0UmVsYXRlZEluaXRpYWxWYWx1ZXMoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFfLmlzRW1wdHkoZGVmYXVsdERvYykpIHtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IGRlZmF1bHREb2M7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgocmVsYXRlT2JqZWN0ICE9IG51bGwgPyByZWxhdGVPYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgcmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuICAgICAgICBuYW1lOiByZWxhdGVkX29iamVjdF9uYW1lICsgXCJfc3RhbmRhcmRfbmV3X2Zvcm1cIixcbiAgICAgICAgb2JqZWN0QXBpTmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgdGl0bGU6ICfmlrDlu7ogJyArIHJlbGF0ZU9iamVjdC5sYWJlbCxcbiAgICAgICAgaW5pdGlhbFZhbHVlczogaW5pdGlhbFZhbHVlcyxcbiAgICAgICAgYWZ0ZXJJbnNlcnQ6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkudmVyc2lvbiA+IDEpIHtcbiAgICAgICAgICAgICAgU3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gRmxvd1JvdXRlci5yZWxvYWQoKTtcbiAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSwgbnVsbCwge1xuICAgICAgICBpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghXy5pc0VtcHR5KGluaXRpYWxWYWx1ZXMpKSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgfVxuICAgIH1cbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9maWVsZHNcIiwgdm9pZCAwKTtcbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9jb2xsZWN0aW9uXCIsIGNvbGxlY3Rpb24pO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25fbmFtZVwiLCBjb2xsZWN0aW9uX25hbWUpO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX3NhdmVfYW5kX2luc2VydFwiLCBmYWxzZSk7XG4gICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICQoXCIuY3JlYXRvci1hZGQtcmVsYXRlZFwiKS5jbGljaygpO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmFjdGlvbnMoe1xuICAgIFwic3RhbmRhcmRfcXVlcnlcIjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9uZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgZ3JpZE5hbWUsIGluaXRpYWxWYWx1ZXMsIGlzUmVsYXRlZCwgbWFzdGVyUmVjb3JkSWQsIG9iamVjdCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWxhdGVkRmllbGROYW1lLCBzZWxlY3RlZFJvd3M7XG4gICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICBncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuICAgICAgaXNSZWxhdGVkID0gdGhpcy5hY3Rpb24uaXNSZWxhdGVkO1xuICAgICAgaWYgKGlzUmVsYXRlZCkge1xuICAgICAgICByZWxhdGVkRmllbGROYW1lID0gdGhpcy5hY3Rpb24ucmVsYXRlZEZpZWxkTmFtZTtcbiAgICAgICAgbWFzdGVyUmVjb3JkSWQgPSB0aGlzLmFjdGlvbi5tYXN0ZXJSZWNvcmRJZDtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IHRoaXMuYWN0aW9uLmluaXRpYWxWYWx1ZXM7XG4gICAgICAgIGlmICghaW5pdGlhbFZhbHVlcykge1xuICAgICAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgICAgICBpbml0aWFsVmFsdWVzW3JlbGF0ZWRGaWVsZE5hbWVdID0gbWFzdGVyUmVjb3JkSWQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgICAgaWYgKGdyaWROYW1lKSB7XG4gICAgICAgICAgc2VsZWN0ZWRSb3dzID0gKHJlZiA9IHdpbmRvdy5ncmlkUmVmcykgIT0gbnVsbCA/IChyZWYxID0gcmVmW2dyaWROYW1lXS5jdXJyZW50KSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmFwaSkgIT0gbnVsbCA/IHJlZjIuZ2V0U2VsZWN0ZWRSb3dzKCkgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZWN0ZWRSb3dzID0gKHJlZjMgPSB3aW5kb3cuZ3JpZFJlZikgIT0gbnVsbCA/IChyZWY0ID0gcmVmMy5jdXJyZW50KSAhPSBudWxsID8gKHJlZjUgPSByZWY0LmFwaSkgIT0gbnVsbCA/IHJlZjUuZ2V0U2VsZWN0ZWRSb3dzKCkgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGVkUm93cyAhPSBudWxsID8gc2VsZWN0ZWRSb3dzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgIHJlY29yZF9pZCA9IHNlbGVjdGVkUm93c1swXS5faWQ7XG4gICAgICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICAgICAgaW5pdGlhbFZhbHVlcyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbml0aWFsVmFsdWVzID0gRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICgob2JqZWN0ICE9IG51bGwgPyBvYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgICByZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmROZXcucmVuZGVyKFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpLCBvYmplY3RfbmFtZSwgJ+aWsOW7uiAnICsgb2JqZWN0LmxhYmVsLCBpbml0aWFsVmFsdWVzLCB7XG4gICAgICAgICAgZ3JpZE5hbWU6IGdyaWROYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChzZWxlY3RlZFJvd3MgIT0gbnVsbCA/IHNlbGVjdGVkUm93cy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgfVxuICAgICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX29wZW5fdmlld1wiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBocmVmO1xuICAgICAgaHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgRmxvd1JvdXRlci5yZWRpcmVjdChocmVmKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfZWRpdFwiOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpIHtcbiAgICAgIHZhciBvYmplY3Q7XG4gICAgICBpZiAocmVjb3JkX2lkKSB7XG4gICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgICAgaWYgKChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC52ZXJzaW9uIDogdm9pZCAwKSA+PSAyKSB7XG4gICAgICAgICAgcmV0dXJuIFN0ZWVkb3MuUGFnZS5Gb3JtLlN0YW5kYXJkRWRpdC5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCAn57yW6L6RICcgKyBvYmplY3QubGFiZWwsIHJlY29yZF9pZCwge1xuICAgICAgICAgICAgZ3JpZE5hbWU6IHRoaXMuYWN0aW9uLmdyaWROYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBmYWxzZSkge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLWVkaXQtcmVjb3JkXCIpLmNsaWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgICByZXR1cm4gTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gJChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwic3RhbmRhcmRfZGVsZXRlXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaykge1xuICAgICAgdmFyIGJlZm9yZUhvb2ssIGdyaWROYW1lLCBpMThuVGV4dEtleSwgaTE4blRpdGxlS2V5LCBuYW1lRmllbGQsIG9iamVjdCwgc2VsZWN0ZWRSZWNvcmRzLCB0ZXh0O1xuICAgICAgZ3JpZE5hbWUgPSB0aGlzLmFjdGlvbi5ncmlkTmFtZTtcbiAgICAgIGlmIChyZWNvcmRfaWQpIHtcbiAgICAgICAgYmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge1xuICAgICAgICAgIF9pZDogcmVjb3JkX2lkXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWJlZm9yZUhvb2spIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIG5hbWVGaWVsZCA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWSB8fCBcIm5hbWVcIjtcbiAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgICAgfVxuICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgbGlzdF92aWV3X2lkID0gXCJhbGxcIjtcbiAgICAgIH1cbiAgICAgIGlmICghXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIHJlY29yZF90aXRsZSkge1xuICAgICAgICByZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGVbbmFtZUZpZWxkXTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWNvcmQgJiYgIXJlY29yZF90aXRsZSkge1xuICAgICAgICByZWNvcmRfdGl0bGUgPSByZWNvcmRbbmFtZUZpZWxkXTtcbiAgICAgIH1cbiAgICAgIGkxOG5UaXRsZUtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVcIjtcbiAgICAgIGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCI7XG4gICAgICBpZiAoIXJlY29yZF9pZCkge1xuICAgICAgICBpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X3N3YWxfdGl0bGVcIjtcbiAgICAgICAgaTE4blRleHRLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X3N3YWxfdGV4dFwiO1xuICAgICAgICBzZWxlY3RlZFJlY29yZHMgPSBTdGVlZG9zVUkuZ2V0VGFibGVTZWxlY3RlZFJvd3MoZ3JpZE5hbWUgfHwgbGlzdF92aWV3X2lkKTtcbiAgICAgICAgaWYgKCFzZWxlY3RlZFJlY29yZHMgfHwgIXNlbGVjdGVkUmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICB0b2FzdHIud2FybmluZyh0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfbm9fc2VsZWN0aW9uXCIpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgdGV4dCA9IHQoaTE4blRleHRLZXksIG9iamVjdC5sYWJlbCArIFwiIFxcXCJcIiArIHJlY29yZF90aXRsZSArIFwiXFxcIlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHQgPSB0KGkxOG5UZXh0S2V5LCBcIlwiICsgb2JqZWN0LmxhYmVsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzd2FsKHtcbiAgICAgICAgdGl0bGU6IHQoaTE4blRpdGxlS2V5LCBcIlwiICsgb2JqZWN0LmxhYmVsKSxcbiAgICAgICAgdGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz5cIiArIHRleHQgKyBcIjwvZGl2PlwiLFxuICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogdCgnRGVsZXRlJyksXG4gICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXG4gICAgICB9LCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgdmFyIGFmdGVyQmF0Y2hlc0RlbGV0ZSwgZGVsZXRlQ291bnRlcjtcbiAgICAgICAgaWYgKG9wdGlvbikge1xuICAgICAgICAgIGlmIChyZWNvcmRfaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBfZGVsZXRlUmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2YXIgX2UsIGFwcGlkLCBjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCwgZHhEYXRhR3JpZEluc3RhbmNlLCBncmlkQ29udGFpbmVyLCBncmlkT2JqZWN0TmFtZUNsYXNzLCBpc09wZW5lclJlbW92ZSwgcmVjb3JkVXJsLCByZWYsIHRlbXBOYXZSZW1vdmVkO1xuICAgICAgICAgICAgICBncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csIFwiLVwiKTtcbiAgICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgICBpZiAoIShncmlkQ29udGFpbmVyICE9IG51bGwgPyBncmlkQ29udGFpbmVyLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93Lm9wZW5lcikge1xuICAgICAgICAgICAgICAgICAgaXNPcGVuZXJSZW1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRfb2JqZWN0X25hbWUgJiYgKChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChjdXJyZW50X29iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi52ZXJzaW9uIDogdm9pZCAwKSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgIFN0ZWVkb3NVSS5yZWxvYWRSZWNvcmQoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpKSB7XG4gICAgICAgICAgICAgICAgICBpZiAob2JqZWN0X25hbWUgIT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgRmxvd1JvdXRlci5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgd2luZG93LnJlZnJlc2hHcmlkKGdyaWROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICAgIF9lID0gZXJyb3IxO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoX2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChncmlkQ29udGFpbmVyICE9IG51bGwgPyBncmlkQ29udGFpbmVyLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhUcmVlTGlzdCgpLmR4VHJlZUxpc3QoJ2luc3RhbmNlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChkeERhdGFHcmlkSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZiAob2JqZWN0X25hbWUgIT09IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgRmxvd1JvdXRlci5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICAgICAgICB0ZW1wTmF2UmVtb3ZlZCA9IENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCk7XG4gICAgICAgICAgICAgIGlmIChpc09wZW5lclJlbW92ZSB8fCAhZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzT3BlbmVyUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlY29yZF9pZCA9PT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgJiYgbGlzdF92aWV3X2lkICE9PSAnY2FsZW5kYXInKSB7XG4gICAgICAgICAgICAgICAgICBhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICAgICAgICAgICAgICAgICAgaWYgKCF0ZW1wTmF2UmVtb3ZlZCkge1xuICAgICAgICAgICAgICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcC9cIiArIGFwcGlkICsgXCIvXCIgKyBvYmplY3RfbmFtZSArIFwiL2dyaWQvXCIgKyBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoY2FsbF9iYWNrICYmIHR5cGVvZiBjYWxsX2JhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsX2JhY2soKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZFJlY29yZHMgJiYgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcImxvYWRpbmdcIik7XG4gICAgICAgICAgICAgIGRlbGV0ZUNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICBhZnRlckJhdGNoZXNEZWxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBkZWxldGVDb3VudGVyKys7XG4gICAgICAgICAgICAgICAgaWYgKGRlbGV0ZUNvdW50ZXIgPj0gc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJsb2FkaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWRSZWNvcmRzLmZvckVhY2goZnVuY3Rpb24ocmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlY29yZFRpdGxlO1xuICAgICAgICAgICAgICAgIHJlY29yZF9pZCA9IHJlY29yZC5faWQ7XG4gICAgICAgICAgICAgICAgYmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge1xuICAgICAgICAgICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIWJlZm9yZUhvb2spIHtcbiAgICAgICAgICAgICAgICAgIGFmdGVyQmF0Y2hlc0RlbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWNvcmRUaXRsZSA9IHJlY29yZFtuYW1lRmllbGRdIHx8IHJlY29yZF9pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2RlbGV0ZVJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkLl9pZCwgcmVjb3JkVGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcmVjb3JkVXJsO1xuICAgICAgICAgICAgICAgICAgcmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICAgICAgICAgICAgICBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyQmF0Y2hlc0RlbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH0pLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBhZnRlckJhdGNoZXNEZWxldGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIl19
