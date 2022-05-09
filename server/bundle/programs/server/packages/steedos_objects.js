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
      var current_record_id, gridName, initialValues, object, ref, ref1, ref2, ref3, ref4, ref5, selectedRows;
      current_record_id = Session.get("record_id");

      if (current_record_id) {
        Creator.relatedObjectStandardNew(object_name);
        return;
      }

      object = Creator.getObject(object_name);
      gridName = this.action.gridName;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiQVBJU2VydmljZSIsIk1ldGFkYXRhU2VydmljZSIsImNvbmZpZyIsImUiLCJtb2xlY3VsZXIiLCJvYmplY3RxbCIsInBhY2thZ2VMb2FkZXIiLCJwYWNrYWdlU2VydmljZSIsInBhdGgiLCJzZXR0aW5ncyIsInN0ZWVkb3NDb3JlIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJyZXF1aXJlIiwiZ2V0U3RlZWRvc0NvbmZpZyIsImJ1aWx0X2luX3BsdWdpbnMiLCJwbHVnaW5zIiwiTWV0ZW9yIiwic3RhcnR1cCIsImFwaVNlcnZpY2UiLCJicm9rZXIiLCJleCIsIm1ldGFkYXRhU2VydmljZSIsInByb2plY3RTZXJ2aWNlIiwic3RhbmRhcmRPYmplY3RzRGlyIiwic3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UiLCJTZXJ2aWNlQnJva2VyIiwibmFtZXNwYWNlIiwibm9kZUlEIiwibWV0YWRhdGEiLCJ0cmFuc3BvcnRlciIsIlRSQU5TUE9SVEVSIiwiY2FjaGVyIiwiQ0FDSEVSIiwibG9nTGV2ZWwiLCJzZXJpYWxpemVyIiwicmVxdWVzdFRpbWVvdXQiLCJtYXhDYWxsTGV2ZWwiLCJoZWFydGJlYXRJbnRlcnZhbCIsImhlYXJ0YmVhdFRpbWVvdXQiLCJjb250ZXh0UGFyYW1zQ2xvbmluZyIsInRyYWNraW5nIiwiZW5hYmxlZCIsInNodXRkb3duVGltZW91dCIsImRpc2FibGVCYWxhbmNlciIsInJlZ2lzdHJ5Iiwic3RyYXRlZ3kiLCJwcmVmZXJMb2NhbCIsImJ1bGtoZWFkIiwiY29uY3VycmVuY3kiLCJtYXhRdWV1ZVNpemUiLCJ2YWxpZGF0b3IiLCJlcnJvckhhbmRsZXIiLCJ0cmFjaW5nIiwiZXhwb3J0ZXIiLCJ0eXBlIiwib3B0aW9ucyIsImxvZ2dlciIsImNvbG9ycyIsIndpZHRoIiwiZ2F1Z2VXaWR0aCIsInNraXBQcm9jZXNzRXZlbnRSZWdpc3RyYXRpb24iLCJjcmVhdGVTZXJ2aWNlIiwibmFtZSIsIm1peGlucyIsInBvcnQiLCJnZXRTdGVlZG9zU2NoZW1hIiwiU3RhbmRhcmRPYmplY3RzUGF0aCIsInBhY2thZ2VJbmZvIiwid3JhcEFzeW5jIiwiY2IiLCJzdGFydCIsInRoZW4iLCJzdGFydGVkIiwiX3Jlc3RhcnRTZXJ2aWNlIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwiZXhwcmVzcyIsIndhaXRGb3JTZXJ2aWNlcyIsInJlc29sdmUiLCJyZWplY3QiLCJpbml0IiwiZXJyb3IiLCJjb25zb2xlIiwiRmliZXIiLCJkZXBzIiwiYXBwIiwiVHJhY2tlciIsIkRlcGVuZGVuY3kiLCJvYmplY3QiLCJfVEVNUExBVEUiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZmlsdGVyc0Z1bmN0aW9uIiwiTWF0Y2giLCJPcHRpb25hbCIsIk9uZU9mIiwiRnVuY3Rpb24iLCJTdHJpbmciLCJvcHRpb25zRnVuY3Rpb24iLCJjcmVhdGVGdW5jdGlvbiIsImlzU2VydmVyIiwiZmliZXJMb2FkT2JqZWN0cyIsIm9iaiIsIm9iamVjdF9uYW1lIiwibG9hZE9iamVjdHMiLCJydW4iLCJsaXN0X3ZpZXdzIiwic3BhY2UiLCJnZXRDb2xsZWN0aW9uTmFtZSIsIl8iLCJjbG9uZSIsImNvbnZlcnRPYmplY3QiLCJPYmplY3QiLCJpbml0VHJpZ2dlcnMiLCJpbml0TGlzdFZpZXdzIiwiZ2V0T2JqZWN0TmFtZSIsImdldE9iamVjdCIsInNwYWNlX2lkIiwicmVmIiwicmVmMSIsImlzQXJyYXkiLCJpc0NsaWVudCIsImRlcGVuZCIsIlNlc3Npb24iLCJnZXQiLCJvYmplY3RzQnlOYW1lIiwiZ2V0T2JqZWN0QnlJZCIsIm9iamVjdF9pZCIsImZpbmRXaGVyZSIsIl9pZCIsInJlbW92ZU9iamVjdCIsImxvZyIsImdldENvbGxlY3Rpb24iLCJzcGFjZUlkIiwiX2NvbGxlY3Rpb25fbmFtZSIsInJlbW92ZUNvbGxlY3Rpb24iLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJmaW5kT25lIiwiZmllbGRzIiwiYWRtaW5zIiwiaW5kZXhPZiIsImV2YWx1YXRlRm9ybXVsYSIsImZvcm11bGFyIiwiY29udGV4dCIsImlzU3RyaW5nIiwiRm9ybXVsYXIiLCJjaGVja0Zvcm11bGEiLCJldmFsdWF0ZUZpbHRlcnMiLCJmaWx0ZXJzIiwic2VsZWN0b3IiLCJlYWNoIiwiZmlsdGVyIiwiYWN0aW9uIiwidmFsdWUiLCJsZW5ndGgiLCJpc0NvbW1vblNwYWNlIiwiZ2V0T3JkZXJseVNldEJ5SWRzIiwiZG9jcyIsImlkcyIsImlkX2tleSIsImhpdF9maXJzdCIsInZhbHVlcyIsImdldFByb3BlcnR5Iiwic29ydEJ5IiwiZG9jIiwiX2luZGV4Iiwic29ydGluZ01ldGhvZCIsInZhbHVlMSIsInZhbHVlMiIsImlzVmFsdWUxRW1wdHkiLCJpc1ZhbHVlMkVtcHR5IiwibG9jYWxlIiwia2V5IiwiRGF0ZSIsImdldFRpbWUiLCJTdGVlZG9zIiwidG9TdHJpbmciLCJsb2NhbGVDb21wYXJlIiwiZ2V0T2JqZWN0UmVsYXRlZHMiLCJfb2JqZWN0IiwicGVybWlzc2lvbnMiLCJyZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0TWFwIiwicmVsYXRlZF9vYmplY3RzIiwiaXNFbXB0eSIsIm9iak5hbWUiLCJpc09iamVjdCIsIm9iamVjdE5hbWUiLCJyZWxhdGVkX29iamVjdCIsInJlbGF0ZWRfb2JqZWN0X25hbWUiLCJyZWxhdGVkX2ZpZWxkIiwicmVsYXRlZF9maWVsZF9uYW1lIiwicmVmZXJlbmNlX3RvIiwiZm9yZWlnbl9rZXkiLCJ3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCIsImVuYWJsZU9iak5hbWUiLCJnZXRQZXJtaXNzaW9ucyIsImVuYWJsZV9hdWRpdCIsIm1vZGlmeUFsbFJlY29yZHMiLCJlbmFibGVfZmlsZXMiLCJwdXNoIiwic2ZzRmlsZXNPYmplY3QiLCJzcGxpY2UiLCJlbmFibGVfdGFza3MiLCJlbmFibGVfbm90ZXMiLCJlbmFibGVfZXZlbnRzIiwiZW5hYmxlX2luc3RhbmNlcyIsImVuYWJsZV9hcHByb3ZhbHMiLCJlbmFibGVfcHJvY2VzcyIsImdldFVzZXJDb250ZXh0IiwiaXNVblNhZmVNb2RlIiwiVVNFUl9DT05URVhUIiwic3BhY2VfdXNlcl9vcmciLCJzdSIsInN1RmllbGRzIiwiRXJyb3IiLCJtb2JpbGUiLCJwb3NpdGlvbiIsImVtYWlsIiwiY29tcGFueSIsIm9yZ2FuaXphdGlvbiIsImNvbXBhbnlfaWQiLCJjb21wYW55X2lkcyIsInVzZXIiLCJmdWxsbmFtZSIsImdldFJlbGF0aXZlVXJsIiwidXJsIiwiaXNGdW5jdGlvbiIsImlzQ29yZG92YSIsInN0YXJ0c1dpdGgiLCJ0ZXN0IiwiX19tZXRlb3JfcnVudGltZV9jb25maWdfXyIsIlJPT1RfVVJMX1BBVEhfUFJFRklYIiwiZ2V0VXNlckNvbXBhbnlJZCIsImdldFVzZXJDb21wYW55SWRzIiwicHJvY2Vzc1Blcm1pc3Npb25zIiwicG8iLCJhbGxvd0NyZWF0ZSIsImFsbG93UmVhZCIsImFsbG93RWRpdCIsImFsbG93RGVsZXRlIiwidmlld0FsbFJlY29yZHMiLCJ2aWV3Q29tcGFueVJlY29yZHMiLCJtb2RpZnlDb21wYW55UmVjb3JkcyIsImFsbG93UmVhZEZpbGVzIiwidmlld0FsbEZpbGVzIiwiYWxsb3dDcmVhdGVGaWxlcyIsImFsbG93RWRpdEZpbGVzIiwiYWxsb3dEZWxldGVGaWxlcyIsIm1vZGlmeUFsbEZpbGVzIiwiZ2V0VGVtcGxhdGVTcGFjZUlkIiwidGVtcGxhdGVTcGFjZUlkIiwiZ2V0Q2xvdWRBZG1pblNwYWNlSWQiLCJjbG91ZEFkbWluU3BhY2VJZCIsImlzVGVtcGxhdGVTcGFjZSIsImlzQ2xvdWRBZG1pblNwYWNlIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwibWV0aG9kcyIsImNvbGxlY3Rpb24iLCJuYW1lX2ZpZWxkX2tleSIsIm9wdGlvbnNfbGltaXQiLCJxdWVyeSIsInF1ZXJ5X29wdGlvbnMiLCJyZWNvcmRzIiwicmVzdWx0cyIsInNlYXJjaFRleHRRdWVyeSIsInNlbGVjdGVkIiwic29ydCIsInBhcmFtcyIsIk5BTUVfRklFTERfS0VZIiwic2VhcmNoVGV4dCIsIiRyZWdleCIsIiRvciIsIiRpbiIsImV4dGVuZCIsIiRuaW4iLCJmaWx0ZXJRdWVyeSIsImxpbWl0IiwiZmluZCIsImZldGNoIiwicmVjb3JkIiwibGFiZWwiLCJtZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYm94IiwiY3VycmVudF91c2VyX2lkIiwiY3VycmVudF91c2VyX2luZm8iLCJmbG93SWQiLCJoYXNoRGF0YSIsImlucyIsImluc0lkIiwicmVjb3JkX2lkIiwicmVkaXJlY3RfdXJsIiwicmVmMiIsInJlZjMiLCJyZWY0Iiwid29ya2Zsb3dVcmwiLCJ4X2F1dGhfdG9rZW4iLCJ4X3VzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsImJvZHkiLCJjaGVjayIsImluc3RhbmNlSWQiLCJmbG93IiwiaW5ib3hfdXNlcnMiLCJpbmNsdWRlcyIsImNjX3VzZXJzIiwib3V0Ym94X3VzZXJzIiwic3RhdGUiLCJzdWJtaXR0ZXIiLCJhcHBsaWNhbnQiLCJwZXJtaXNzaW9uTWFuYWdlciIsImdldEZsb3dQZXJtaXNzaW9ucyIsInNwYWNlcyIsIndlYnNlcnZpY2VzIiwid29ya2Zsb3ciLCJzZW5kUmVzdWx0IiwiY29kZSIsImRhdGEiLCJ1cGRhdGUiLCIkdW5zZXQiLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJnZXRJbml0V2lkdGhQZXJjZW50IiwiY29sdW1ucyIsIl9zY2hlbWEiLCJjb2x1bW5fbnVtIiwiaW5pdF93aWR0aF9wZXJjZW50IiwiZ2V0U2NoZW1hIiwiZmllbGRfbmFtZSIsImZpZWxkIiwiaXNfd2lkZSIsInBpY2siLCJhdXRvZm9ybSIsImdldEZpZWxkSXNXaWRlIiwiZ2V0VGFidWxhck9yZGVyIiwibGlzdF92aWV3X2lkIiwic2V0dGluZyIsIm1hcCIsImNvbHVtbiIsImhpZGRlbiIsImNvbXBhY3QiLCJvcmRlciIsImluZGV4IiwiZGVmYXVsdF9leHRyYV9jb2x1bW5zIiwiZXh0cmFfY29sdW1ucyIsImdldE9iamVjdERlZmF1bHRDb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyIsInVuaW9uIiwiZ2V0T2JqZWN0RGVmYXVsdFNvcnQiLCJUYWJ1bGFyU2VsZWN0ZWRJZHMiLCJjb252ZXJ0TGlzdFZpZXciLCJkZWZhdWx0X3ZpZXciLCJsaXN0X3ZpZXciLCJsaXN0X3ZpZXdfbmFtZSIsImRlZmF1bHRfY29sdW1ucyIsImRlZmF1bHRfbW9iaWxlX2NvbHVtbnMiLCJvaXRlbSIsIm1vYmlsZV9jb2x1bW5zIiwiaGFzIiwiaW5jbHVkZSIsImZpbHRlcl9zY29wZSIsInBhcnNlIiwiZm9yRWFjaCIsIl92YWx1ZSIsImdldFJlbGF0ZWRMaXN0IiwibGF5b3V0UmVsYXRlZExpc3QiLCJsaXN0IiwibWFwTGlzdCIsIm9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyIsInJlbGF0ZWRMaXN0TmFtZXMiLCJyZWxhdGVkTGlzdE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9uYW1lcyIsInVucmVsYXRlZF9vYmplY3RzIiwicmVsYXRlZF9saXN0cyIsIml0ZW0iLCJyZUZpZWxkTmFtZSIsInJlT2JqZWN0TmFtZSIsInJlbGF0ZWQiLCJyZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lIiwic3BsaXQiLCJmaWVsZF9uYW1lcyIsImlzX2ZpbGUiLCJjdXN0b21SZWxhdGVkTGlzdE9iamVjdCIsImFjdGlvbnMiLCJidXR0b25zIiwidmlzaWJsZV9vbiIsInBhZ2Vfc2l6ZSIsIm9iak9yTmFtZSIsImdldFJlbGF0ZWRPYmplY3RzIiwicmVsYXRlZF9vYmplY3RfaXRlbSIsInJlbGF0ZWRPYmplY3QiLCJ0YWJ1bGFyX29yZGVyIiwiZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMiLCJ3aXRob3V0IiwidHJhbnNmb3JtU29ydFRvVGFidWxhciIsInJlcGxhY2UiLCJwbHVjayIsImRpZmZlcmVuY2UiLCJ2IiwiaXNBY3RpdmUiLCJhbGxvd19yZWxhdGVkTGlzdCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJmaXJzdCIsImdldExpc3RWaWV3cyIsImdldExpc3RWaWV3IiwiZXhhYyIsImxpc3RWaWV3cyIsImdldExpc3RWaWV3SXNSZWNlbnQiLCJsaXN0VmlldyIsInBpY2tPYmplY3RNb2JpbGVDb2x1bW5zIiwiY291bnQiLCJnZXRGaWVsZCIsImlzTmFtZUNvbHVtbiIsIml0ZW1Db3VudCIsIm1heENvdW50IiwibWF4Um93cyIsIm5hbWVDb2x1bW4iLCJuYW1lS2V5IiwicmVzdWx0IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJSZWdFeHAiLCJfcmVnRXhNZXNzYWdlcyIsIl9nbG9iYWxNZXNzYWdlcyIsInJlZ0V4IiwiZXhwIiwibXNnIiwibWVzc2FnZXMiLCJldmFsSW5Db250ZXh0IiwianMiLCJldmFsIiwiY2FsbCIsImNvbnZlcnRGaWVsZCIsImdldE9wdGlvbiIsIm9wdGlvbiIsImZvbyIsImNvbG9yIiwiYWxsT3B0aW9ucyIsInBpY2tsaXN0IiwicGlja2xpc3RPcHRpb25zIiwiZ2V0UGlja2xpc3QiLCJnZXRQaWNrTGlzdE9wdGlvbnMiLCJyZXZlcnNlIiwiZW5hYmxlIiwiZGVmYXVsdFZhbHVlIiwidHJpZ2dlcnMiLCJ0cmlnZ2VyIiwiX3RvZG8iLCJfdG9kb19mcm9tX2NvZGUiLCJfdG9kb19mcm9tX2RiIiwib24iLCJ0b2RvIiwic3lzdGVtQmFzZUZpZWxkcyIsIm9taXQiLCJyZXF1aXJlZCIsInJlYWRvbmx5IiwiZ2V0U3lzdGVtQmFzZUZpZWxkcyIsIl92aXNpYmxlIiwiZXJyb3IxIiwiYWN0aW9uc0J5TmFtZSIsInZpc2libGUiLCJfb3B0aW9ucyIsIl90eXBlIiwiYmVmb3JlT3BlbkZ1bmN0aW9uIiwiaXNfY29tcGFueV9saW1pdGVkIiwibWF4IiwibWluIiwiX29wdGlvbiIsImsiLCJfcmVnRXgiLCJfbWluIiwiX21heCIsIk51bWJlciIsIkJvb2xlYW4iLCJfb3B0aW9uc0Z1bmN0aW9uIiwiX3JlZmVyZW5jZV90byIsIl9jcmVhdGVGdW5jdGlvbiIsIl9iZWZvcmVPcGVuRnVuY3Rpb24iLCJfZmlsdGVyc0Z1bmN0aW9uIiwiX2RlZmF1bHRWYWx1ZSIsIl9pc19jb21wYW55X2xpbWl0ZWQiLCJfZmlsdGVycyIsImlzRGF0ZSIsInBvcCIsIl9pc19kYXRlIiwiZm9ybSIsInZhbCIsInJlbGF0ZWRPYmpJbmZvIiwiUFJFRklYIiwiX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhIiwicHJlZml4IiwiZmllbGRWYXJpYWJsZSIsInJlZyIsInJldiIsIm0iLCIkMSIsImZvcm11bGFfc3RyIiwiX0NPTlRFWFQiLCJfVkFMVUVTIiwiaXNCb29sZWFuIiwidG9hc3RyIiwiZm9ybWF0T2JqZWN0TmFtZSIsIl9iYXNlT2JqZWN0IiwiX2RiIiwiZGVmYXVsdExpc3RWaWV3SWQiLCJkaXNhYmxlZF9saXN0X3ZpZXdzIiwic2NoZW1hIiwic2VsZiIsImJhc2VPYmplY3QiLCJwZXJtaXNzaW9uX3NldCIsImljb24iLCJkZXNjcmlwdGlvbiIsImlzX3ZpZXciLCJ2ZXJzaW9uIiwiaXNfZW5hYmxlIiwiYWxsb3dfY3VzdG9tQWN0aW9ucyIsImV4Y2x1ZGVfYWN0aW9ucyIsImVuYWJsZV9zZWFyY2giLCJwYWdpbmciLCJlbmFibGVfYXBpIiwiY3VzdG9tIiwiZW5hYmxlX3NoYXJlIiwiZW5hYmxlX3RyZWUiLCJzaWRlYmFyIiwib3Blbl93aW5kb3ciLCJmaWx0ZXJfY29tcGFueSIsImNhbGVuZGFyIiwiZW5hYmxlX2NoYXR0ZXIiLCJlbmFibGVfdHJhc2giLCJlbmFibGVfc3BhY2VfZ2xvYmFsIiwiZW5hYmxlX2ZvbGxvdyIsImVuYWJsZV93b3JrZmxvdyIsImVuYWJsZV9pbmxpbmVfZWRpdCIsImRldGFpbHMiLCJtYXN0ZXJzIiwibG9va3VwX2RldGFpbHMiLCJpbl9kZXZlbG9wbWVudCIsImlkRmllbGROYW1lIiwiZGF0YWJhc2VfbmFtZSIsImlzX25hbWUiLCJwcmltYXJ5IiwiZmlsdGVyYWJsZSIsIml0ZW1fbmFtZSIsImNvcHlJdGVtIiwiYWRtaW4iLCJhbGwiLCJsaXN0X3ZpZXdfaXRlbSIsIlJlYWN0aXZlVmFyIiwiY3JlYXRlQ29sbGVjdGlvbiIsIl9uYW1lIiwiZ2V0T2JqZWN0U2NoZW1hIiwiY29udGFpbnMiLCJhdHRhY2hTY2hlbWEiLCJfc2ltcGxlU2NoZW1hIiwiZ2V0T2JqZWN0T0RhdGFSb3V0ZXJQcmVmaXgiLCJib290c3RyYXBMb2FkZWQiLCJnZXRTZWxlY3RPcHRpb25zIiwiZmllbGRTY2hlbWEiLCJkYXRhX3R5cGUiLCJvcHRpb25JdGVtIiwiZmllbGRzQXJyIiwiX3JlZl9vYmoiLCJhdXRvZm9ybV90eXBlIiwiY29sbGVjdGlvbk5hbWUiLCJmcyIsImZzVHlwZSIsImlzVW5MaW1pdGVkIiwibXVsdGlwbGUiLCJyb3dzIiwibGFuZ3VhZ2UiLCJpc01vYmlsZSIsImlzUGFkIiwiaXNpT1MiLCJhZkZpZWxkSW5wdXQiLCJ0aW1lem9uZUlkIiwiZHhEYXRlQm94T3B0aW9ucyIsImRpc3BsYXlGb3JtYXQiLCJwaWNrZXJUeXBlIiwiZGF0ZU1vYmlsZU9wdGlvbnMiLCJvdXRGb3JtYXQiLCJoZWlnaHQiLCJkaWFsb2dzSW5Cb2R5IiwidG9vbGJhciIsImZvbnROYW1lcyIsImxhbmciLCJzaG93SWNvbiIsImRlcGVuZE9uIiwiZGVwZW5kX29uIiwiY3JlYXRlIiwibG9va3VwX2ZpZWxkIiwiTW9kYWwiLCJzaG93IiwiZm9ybUlkIiwib3BlcmF0aW9uIiwib25TdWNjZXNzIiwiYWRkSXRlbXMiLCJyZWZlcmVuY2Vfc29ydCIsIm9wdGlvbnNTb3J0IiwicmVmZXJlbmNlX2xpbWl0Iiwib3B0aW9uc0xpbWl0IiwicmVmZXJlbmNlX3RvX2ZpZWxkIiwicmVmZXJlbmNlVG9GaWVsZCIsImJsYWNrYm94Iiwib2JqZWN0U3dpdGNoZSIsIm9wdGlvbnNNZXRob2QiLCJvcHRpb25zTWV0aG9kUGFyYW1zIiwicmVmZXJlbmNlcyIsIl9yZWZlcmVuY2UiLCJsaW5rIiwiZGVmYXVsdEljb24iLCJmaXJzdE9wdGlvbiIsImRlY2ltYWwiLCJwcmVjaXNpb24iLCJzY2FsZSIsImRpc2FibGVkIiwiQXJyYXkiLCJlZGl0YWJsZSIsImFjY2VwdCIsInN5c3RlbSIsIkVtYWlsIiwiYXNzaWduIiwiaXNOdW1iZXIiLCJvcHRpb25hbCIsInVuaXF1ZSIsImdyb3VwIiwic2VhcmNoYWJsZSIsIm5vdyIsImlubGluZUhlbHBUZXh0IiwiaXNQcm9kdWN0aW9uIiwic29ydGFibGUiLCJnZXRGaWVsZERpc3BsYXlWYWx1ZSIsImZpZWxkX3ZhbHVlIiwiaHRtbCIsIm1vbWVudCIsImZvcm1hdCIsImNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSIsImZpZWxkX3R5cGUiLCJwdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMiLCJvcGVyYXRpb25zIiwiYnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVzIiwiYnVpbHRpbkl0ZW0iLCJpc19jaGVja19vbmx5IiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0iLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0iLCJnZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiIsImJldHdlZW5CdWlsdGluVmFsdWVzIiwiZ2V0UXVhcnRlclN0YXJ0TW9udGgiLCJtb250aCIsImdldE1vbnRoIiwiZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSIsInllYXIiLCJnZXRGdWxsWWVhciIsImdldE5leHRRdWFydGVyRmlyc3REYXkiLCJnZXRNb250aERheXMiLCJkYXlzIiwiZW5kRGF0ZSIsIm1pbGxpc2Vjb25kIiwic3RhcnREYXRlIiwiZ2V0TGFzdE1vbnRoRmlyc3REYXkiLCJjdXJyZW50TW9udGgiLCJjdXJyZW50WWVhciIsImVuZFZhbHVlIiwiZmlyc3REYXkiLCJsYXN0RGF5IiwibGFzdE1vbmRheSIsImxhc3RNb250aEZpbmFsRGF5IiwibGFzdE1vbnRoRmlyc3REYXkiLCJsYXN0UXVhcnRlckVuZERheSIsImxhc3RRdWFydGVyU3RhcnREYXkiLCJsYXN0U3VuZGF5IiwibGFzdF8xMjBfZGF5cyIsImxhc3RfMzBfZGF5cyIsImxhc3RfNjBfZGF5cyIsImxhc3RfN19kYXlzIiwibGFzdF85MF9kYXlzIiwibWludXNEYXkiLCJtb25kYXkiLCJuZXh0TW9uZGF5IiwibmV4dE1vbnRoRmluYWxEYXkiLCJuZXh0TW9udGhGaXJzdERheSIsIm5leHRRdWFydGVyRW5kRGF5IiwibmV4dFF1YXJ0ZXJTdGFydERheSIsIm5leHRTdW5kYXkiLCJuZXh0WWVhciIsIm5leHRfMTIwX2RheXMiLCJuZXh0XzMwX2RheXMiLCJuZXh0XzYwX2RheXMiLCJuZXh0XzdfZGF5cyIsIm5leHRfOTBfZGF5cyIsInByZXZpb3VzWWVhciIsInN0YXJ0VmFsdWUiLCJzdHJFbmREYXkiLCJzdHJGaXJzdERheSIsInN0ckxhc3REYXkiLCJzdHJNb25kYXkiLCJzdHJTdGFydERheSIsInN0clN1bmRheSIsInN0clRvZGF5Iiwic3RyVG9tb3Jyb3ciLCJzdHJZZXN0ZGF5Iiwic3VuZGF5IiwidGhpc1F1YXJ0ZXJFbmREYXkiLCJ0aGlzUXVhcnRlclN0YXJ0RGF5IiwidG9tb3Jyb3ciLCJ3ZWVrIiwieWVzdGRheSIsImdldERheSIsInQiLCJmdiIsInNldEhvdXJzIiwiZ2V0SG91cnMiLCJnZXRUaW1lem9uZU9mZnNldCIsImdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiIsImdldEZpZWxkT3BlcmF0aW9uIiwib3B0aW9uYWxzIiwiZXF1YWwiLCJ1bmVxdWFsIiwibGVzc190aGFuIiwiZ3JlYXRlcl90aGFuIiwibGVzc19vcl9lcXVhbCIsImdyZWF0ZXJfb3JfZXF1YWwiLCJub3RfY29udGFpbiIsInN0YXJ0c193aXRoIiwiYmV0d2VlbiIsImdldE9iamVjdEZpZWxkc05hbWUiLCJmaWVsZHNOYW1lIiwic29ydF9ubyIsImNsZWFuVHJpZ2dlciIsImluaXRUcmlnZ2VyIiwiX3RyaWdnZXJfaG9va3MiLCJyZWY1IiwidG9kb1dyYXBwZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIndoZW4iLCJiZWZvcmUiLCJpbnNlcnQiLCJyZW1vdmUiLCJhZnRlciIsIl9ob29rIiwidHJpZ2dlcl9uYW1lIiwiX3RyaWdnZXJfaG9vayIsImJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcyIsImV4dGVuZFBlcm1pc3Npb25Qcm9wcyIsImZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QiLCJmaW5kX3Blcm1pc3Npb25fb2JqZWN0IiwiaW50ZXJzZWN0aW9uUGx1cyIsIm90aGVyUGVybWlzc2lvblByb3BOYW1lcyIsIm92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyIsInBlcm1pc3Npb25Qcm9wTmFtZXMiLCJ1bmlvblBlcm1pc3Npb25PYmplY3RzIiwidW5pb25QbHVzIiwiZ2V0T2JqZWN0UGVybWlzc2lvbnMiLCJnZXRSZWNvcmRQZXJtaXNzaW9ucyIsImlzT3duZXIiLCJtYXN0ZXJPYmplY3ROYW1lIiwibWFzdGVyUmVjb3JkUGVybSIsInJlY29yZF9jb21wYW55X2lkIiwicmVjb3JkX2NvbXBhbnlfaWRzIiwidXNlcl9jb21wYW55X2lkcyIsInJlY29yZF9wZXJtaXNzaW9ucyIsIm93bmVyIiwicGFyZW50IiwibiIsImludGVyc2VjdGlvbiIsImxvY2tlZCIsImdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMiLCJjdXJyZW50T2JqZWN0TmFtZSIsInJlbGF0ZWRMaXN0SXRlbSIsImN1cnJlbnRSZWNvcmQiLCJpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUiLCJtYXN0ZXJBbGxvdyIsInJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyIsInVuZWRpdGFibGVfcmVsYXRlZF9saXN0IiwiZ2V0T2JqZWN0UmVjb3JkIiwiZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0IiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJfaSIsInBzZXRzIiwicHNldHNBZG1pbiIsInBzZXRzQWRtaW5fcG9zIiwicHNldHNDdXJyZW50IiwicHNldHNDdXJyZW50TmFtZXMiLCJwc2V0c0N1cnJlbnRfcG9zIiwicHNldHNDdXN0b21lciIsInBzZXRzQ3VzdG9tZXJfcG9zIiwicHNldHNHdWVzdCIsInBzZXRzR3Vlc3RfcG9zIiwicHNldHNNZW1iZXIiLCJwc2V0c01lbWJlcl9wb3MiLCJwc2V0c1N1cHBsaWVyIiwicHNldHNTdXBwbGllcl9wb3MiLCJwc2V0c1VzZXIiLCJwc2V0c1VzZXJfcG9zIiwic2V0X2lkcyIsInNwYWNlVXNlciIsIm9iamVjdHMiLCJhc3NpZ25lZF9hcHBzIiwicHJvZmlsZSIsInVzZXJzIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJnZXRBc3NpZ25lZEFwcHMiLCJiaW5kIiwiYXNzaWduZWRfbWVudXMiLCJnZXRBc3NpZ25lZE1lbnVzIiwidXNlcl9wZXJtaXNzaW9uX3NldHMiLCJhcnJheSIsIm90aGVyIiwidGFyZ2V0IiwicHJvcHMiLCJmaWxlc1Byb05hbWVzIiwicHJvcE5hbWVzIiwicHJvcE5hbWUiLCJhcHBzIiwicHNldEJhc2UiLCJ1c2VyUHJvZmlsZSIsInBzZXQiLCJ1bmlxIiwiYWJvdXRNZW51IiwiYWRtaW5NZW51cyIsImFsbE1lbnVzIiwiY3VycmVudFBzZXROYW1lcyIsIm1lbnVzIiwib3RoZXJNZW51QXBwcyIsIm90aGVyTWVudXMiLCJhZG1pbl9tZW51cyIsImZsYXR0ZW4iLCJtZW51IiwicHNldHNNZW51IiwicGVybWlzc2lvbl9zZXRzIiwicGVybWlzc2lvbl9vYmplY3RzIiwiaXNOdWxsIiwicGVybWlzc2lvbl9zZXRfaWRzIiwicG9zIiwib3BzIiwib3BzX2tleSIsImN1cnJlbnRQc2V0IiwidGVtcE9wcyIsInJlcGVhdEluZGV4IiwicmVwZWF0UG8iLCJvcHNldEFkbWluIiwib3BzZXRDdXN0b21lciIsIm9wc2V0R3Vlc3QiLCJvcHNldE1lbWJlciIsIm9wc2V0U3VwcGxpZXIiLCJvcHNldFVzZXIiLCJwb3NBZG1pbiIsInBvc0N1c3RvbWVyIiwicG9zR3Vlc3QiLCJwb3NNZW1iZXIiLCJwb3NTdXBwbGllciIsInBvc1VzZXIiLCJwcm9mIiwiZ3Vlc3QiLCJtZW1iZXIiLCJzdXBwbGllciIsImN1c3RvbWVyIiwiZGlzYWJsZWRfYWN0aW9ucyIsInVucmVhZGFibGVfZmllbGRzIiwidW5lZGl0YWJsZV9maWVsZHMiLCJjcmVhdG9yX2RiX3VybCIsIm9wbG9nX3VybCIsIk1PTkdPX1VSTF9DUkVBVE9SIiwiTU9OR09fT1BMT0dfVVJMX0NSRUFUT1IiLCJfQ1JFQVRPUl9EQVRBU09VUkNFIiwiX2RyaXZlciIsIk1vbmdvSW50ZXJuYWxzIiwiUmVtb3RlQ29sbGVjdGlvbkRyaXZlciIsIm9wbG9nVXJsIiwiY29sbGVjdGlvbl9rZXkiLCJuZXdDb2xsZWN0aW9uIiwiU01TUXVldWUiLCJfZGVsZXRlUmVjb3JkIiwic3RlZWRvc0ZpbHRlcnMiLCJhY3Rpb25fbmFtZSIsImV4ZWN1dGVBY3Rpb24iLCJpdGVtX2VsZW1lbnQiLCJjYWxsYmFjayIsIm1vcmVBcmdzIiwidG9kb0FyZ3MiLCJPYmplY3RHcmlkIiwiZ2V0RmlsdGVycyIsIndvcmRfdGVtcGxhdGUiLCJmb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5IiwiYWJzb2x1dGVVcmwiLCJ3aW5kb3ciLCJvcGVuIiwib2RhdGEiLCJwcm90b3R5cGUiLCJzbGljZSIsImNvbmNhdCIsIndhcm5pbmciLCJyZWNvcmRfdGl0bGUiLCJjYWxsX2JhY2siLCJjYWxsX2JhY2tfZXJyb3IiLCJwcmV2aW91c0RvYyIsIkZvcm1NYW5hZ2VyIiwiZ2V0UHJldmlvdXNEb2MiLCJpbmZvIiwic3VjY2VzcyIsInJ1bkhvb2siLCJyZWxhdGVkT2JqZWN0U3RhbmRhcmROZXciLCJjb2xsZWN0aW9uX25hbWUiLCJjdXJyZW50X29iamVjdF9uYW1lIiwiY3VycmVudF9yZWNvcmRfaWQiLCJkZWZhdWx0RG9jIiwiaW5pdGlhbFZhbHVlcyIsInJlbGF0ZU9iamVjdCIsInNldCIsImdldFJlbGF0ZWRJbml0aWFsVmFsdWVzIiwiU3RlZWRvc1VJIiwic2hvd01vZGFsIiwic3RvcmVzIiwiQ29tcG9uZW50UmVnaXN0cnkiLCJjb21wb25lbnRzIiwiT2JqZWN0Rm9ybSIsIm9iamVjdEFwaU5hbWUiLCJ0aXRsZSIsImFmdGVySW5zZXJ0Iiwic2V0VGltZW91dCIsInJlbG9hZFJlY29yZCIsIkZsb3dSb3V0ZXIiLCJyZWxvYWQiLCJpY29uUGF0aCIsImRlZmVyIiwiJCIsImNsaWNrIiwiZ3JpZE5hbWUiLCJzZWxlY3RlZFJvd3MiLCJncmlkUmVmcyIsImN1cnJlbnQiLCJhcGkiLCJnZXRTZWxlY3RlZFJvd3MiLCJncmlkUmVmIiwiZ2V0SW5pdGlhbFZhbHVlcyIsIlBhZ2UiLCJGb3JtIiwiU3RhbmRhcmROZXciLCJyZW5kZXIiLCJocmVmIiwiZ2V0T2JqZWN0VXJsIiwicmVkaXJlY3QiLCJTdGFuZGFyZEVkaXQiLCJiZWZvcmVIb29rIiwiaTE4blRleHRLZXkiLCJpMThuVGl0bGVLZXkiLCJuYW1lRmllbGQiLCJzZWxlY3RlZFJlY29yZHMiLCJ0ZXh0IiwiZ2V0VGFibGVTZWxlY3RlZFJvd3MiLCJzd2FsIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsImFmdGVyQmF0Y2hlc0RlbGV0ZSIsImRlbGV0ZUNvdW50ZXIiLCJfZSIsImFwcGlkIiwiZHhEYXRhR3JpZEluc3RhbmNlIiwiZ3JpZENvbnRhaW5lciIsImdyaWRPYmplY3ROYW1lQ2xhc3MiLCJpc09wZW5lclJlbW92ZSIsInJlY29yZFVybCIsInRlbXBOYXZSZW1vdmVkIiwib3BlbmVyIiwicm91dGUiLCJlbmRzV2l0aCIsInJlZnJlc2hHcmlkIiwiZHhUcmVlTGlzdCIsImR4RGF0YUdyaWQiLCJyZWZyZXNoIiwiVGVtcGxhdGUiLCJjcmVhdG9yX2dyaWQiLCJyZW1vdmVUZW1wTmF2SXRlbSIsImNsb3NlIiwiZ28iLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwicmVjb3JkVGl0bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEtBQUNBLEVBQUQsR0FBTSxFQUFOOztBQUNBLElBQUksT0FBQUMsT0FBQSxvQkFBQUEsWUFBQSxJQUFKO0FBQ0MsT0FBQ0EsT0FBRCxHQUFXLEVBQVg7QUNFQTs7QUREREEsUUFBUUMsT0FBUixHQUFrQixFQUFsQjtBQUNBRCxRQUFRRSxXQUFSLEdBQXNCLEVBQXRCO0FBQ0FGLFFBQVFHLEtBQVIsR0FBZ0IsRUFBaEI7QUFDQUgsUUFBUUksSUFBUixHQUFlLEVBQWY7QUFDQUosUUFBUUssVUFBUixHQUFxQixFQUFyQjtBQUNBTCxRQUFRTSxPQUFSLEdBQWtCLEVBQWxCO0FBQ0FOLFFBQVFPLElBQVIsR0FBZSxFQUFmO0FBQ0FQLFFBQVFRLGFBQVIsR0FBd0IsRUFBeEIsQzs7Ozs7Ozs7Ozs7O0FFVkEsSUFBQUMsVUFBQSxFQUFBQyxlQUFBLEVBQUFDLE1BQUEsRUFBQUMsQ0FBQSxFQUFBQyxTQUFBLEVBQUFDLFFBQUEsRUFBQUMsYUFBQSxFQUFBQyxjQUFBLEVBQUFDLElBQUEsRUFBQUMsUUFBQSxFQUFBQyxXQUFBOztBQUFBO0FBQ0MsTUFBR0MsUUFBUUMsR0FBUixDQUFZQyxnQkFBWixL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b3I/XG5cdEBDcmVhdG9yID0ge31cbkNyZWF0b3IuT2JqZWN0cyA9IHt9XG5DcmVhdG9yLkNvbGxlY3Rpb25zID0ge31cbkNyZWF0b3IuTWVudXMgPSBbXVxuQ3JlYXRvci5BcHBzID0ge31cbkNyZWF0b3IuRGFzaGJvYXJkcyA9IHt9XG5DcmVhdG9yLlJlcG9ydHMgPSB7fVxuQ3JlYXRvci5zdWJzID0ge31cbkNyZWF0b3Iuc3RlZWRvc1NjaGVtYSA9IHt9IiwidGhpcy5kYiA9IHt9O1xuXG5pZiAodHlwZW9mIENyZWF0b3IgPT09IFwidW5kZWZpbmVkXCIgfHwgQ3JlYXRvciA9PT0gbnVsbCkge1xuICB0aGlzLkNyZWF0b3IgPSB7fTtcbn1cblxuQ3JlYXRvci5PYmplY3RzID0ge307XG5cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fTtcblxuQ3JlYXRvci5NZW51cyA9IFtdO1xuXG5DcmVhdG9yLkFwcHMgPSB7fTtcblxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge307XG5cbkNyZWF0b3IuUmVwb3J0cyA9IHt9O1xuXG5DcmVhdG9yLnN1YnMgPSB7fTtcblxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge307XG4iLCJ0cnlcblx0aWYgcHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnXG5cdFx0c3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcblx0XHRvYmplY3RxbCA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJylcblx0XHRtb2xlY3VsZXIgPSByZXF1aXJlKFwibW9sZWN1bGVyXCIpO1xuXHRcdHBhY2thZ2VMb2FkZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGVvci1wYWNrYWdlLWxvYWRlcicpO1xuXHRcdEFQSVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLWFwaScpO1xuXHRcdE1ldGFkYXRhU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0YWRhdGEtc2VydmVyJyk7XG5cdFx0cGFja2FnZVNlcnZpY2UgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIpO1xuXHRcdHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXHRcdGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcblx0XHRzZXR0aW5ncyA9IHtcblx0XHRcdGJ1aWx0X2luX3BsdWdpbnM6IFtcblx0XHRcdFx0XCJAc3RlZWRvcy91bnBrZ1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3dvcmtmbG93XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvYWNjb3VudHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zdGVlZG9zLXBsdWdpbi1zY2hlbWEtYnVpbGRlclwiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3BsdWdpbi1lbnRlcnByaXNlXCIsXG5cdFx0XHRcdCMgXCJAc3RlZWRvcy93b3JkLXRlbXBsYXRlXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvbWV0YWRhdGEtYXBpXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvcGx1Z2luLWRpbmd0YWxrXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvZGF0YS1pbXBvcnRcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWZpZWxkcy1pbmRleHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWFjY291bnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1jaGFydHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1jbG91ZC1pbml0XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc3RhbmRhcmQtcHJvY2Vzc1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3dlYmFwcC1hY2NvdW50c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3NlcnZpY2UtcGx1Z2luLWFtaXNcIixcblx0XHRcdF0sXG5cdFx0XHRwbHVnaW5zOiBjb25maWcucGx1Z2luc1xuXHRcdH1cblx0XHRNZXRlb3Iuc3RhcnR1cCAtPlxuXHRcdFx0dHJ5XG5cdFx0XHRcdGJyb2tlciA9IG5ldyBtb2xlY3VsZXIuU2VydmljZUJyb2tlcih7XG5cdFx0XHRcdFx0bmFtZXNwYWNlOiBcInN0ZWVkb3NcIixcblx0XHRcdFx0XHRub2RlSUQ6IFwic3RlZWRvcy1jcmVhdG9yXCIsXG5cdFx0XHRcdFx0bWV0YWRhdGE6IHt9LFxuXHRcdFx0XHRcdHRyYW5zcG9ydGVyOiBwcm9jZXNzLmVudi5UUkFOU1BPUlRFUixcblx0XHRcdFx0XHRjYWNoZXI6IHByb2Nlc3MuZW52LkNBQ0hFUixcblx0XHRcdFx0XHRsb2dMZXZlbDogXCJ3YXJuXCIsXG5cdFx0XHRcdFx0c2VyaWFsaXplcjogXCJKU09OXCIsXG5cdFx0XHRcdFx0cmVxdWVzdFRpbWVvdXQ6IDYwICogMTAwMCxcblx0XHRcdFx0XHRtYXhDYWxsTGV2ZWw6IDEwMCxcblxuXHRcdFx0XHRcdGhlYXJ0YmVhdEludGVydmFsOiAxMCxcblx0XHRcdFx0XHRoZWFydGJlYXRUaW1lb3V0OiAzMCxcblxuXHRcdFx0XHRcdGNvbnRleHRQYXJhbXNDbG9uaW5nOiBmYWxzZSxcblxuXHRcdFx0XHRcdHRyYWNraW5nOiB7XG5cdFx0XHRcdFx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHRcdFx0XHRcdHNodXRkb3duVGltZW91dDogNTAwMCxcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0ZGlzYWJsZUJhbGFuY2VyOiBmYWxzZSxcblxuXHRcdFx0XHRcdHJlZ2lzdHJ5OiB7XG5cdFx0XHRcdFx0XHRzdHJhdGVneTogXCJSb3VuZFJvYmluXCIsXG5cdFx0XHRcdFx0XHRwcmVmZXJMb2NhbDogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHRidWxraGVhZDoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRjb25jdXJyZW5jeTogMTAsXG5cdFx0XHRcdFx0XHRtYXhRdWV1ZVNpemU6IDEwMCxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHZhbGlkYXRvcjogdHJ1ZSxcblx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IG51bGwsXG5cdFx0XHRcdFx0dHJhY2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRleHBvcnRlcjoge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIkNvbnNvbGVcIixcblx0XHRcdFx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdFx0XHRcdGxvZ2dlcjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcnM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHRcdFx0XHRnYXVnZVdpZHRoOiA0MFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRza2lwUHJvY2Vzc0V2ZW50UmVnaXN0cmF0aW9uOiB0cnVlXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdFx0cHJvamVjdFNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG5cdFx0XHRcdFx0bmFtZTogXCJwcm9qZWN0LXNlcnZlclwiLFxuXHRcdFx0XHRcdG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG5cdFx0XHRcdFx0bWl4aW5zOiBbcGFja2FnZVNlcnZpY2VdLFxuXHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdG1ldGFkYXRhU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiAnbWV0YWRhdGEtc2VydmVyJyxcblx0XHRcdFx0XHRtaXhpbnM6IFtNZXRhZGF0YVNlcnZpY2VdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0YXBpU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiBcImFwaVwiLFxuXHRcdFx0XHRcdG1peGluczogW0FQSVNlcnZpY2VdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRwb3J0OiBudWxsXG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0b2JqZWN0cWwuZ2V0U3RlZWRvc1NjaGVtYShicm9rZXIpO1xuXHRcdFx0XHRzdGFuZGFyZE9iamVjdHNEaXIgPSBvYmplY3RxbC5TdGFuZGFyZE9iamVjdHNQYXRoO1xuXHRcdFx0XHRzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiAnc3RhbmRhcmQtb2JqZWN0cycsXG5cdFx0XHRcdFx0bWl4aW5zOiBbcGFja2FnZUxvYWRlcl0sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHsgcGFja2FnZUluZm86IHtcblx0XHRcdFx0XHRcdHBhdGg6IHN0YW5kYXJkT2JqZWN0c0Rpcixcblx0XHRcdFx0XHR9IH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0TWV0ZW9yLndyYXBBc3luYygoY2IpLT5cblx0XHRcdFx0XHRicm9rZXIuc3RhcnQoKS50aGVuKCgpLT5cblx0XHRcdFx0XHRcdGlmICFicm9rZXIuc3RhcnRlZCBcblx0XHRcdFx0XHRcdFx0YnJva2VyLl9yZXN0YXJ0U2VydmljZShzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSk7XG5cblx0XHRcdFx0XHRcdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKFwiL1wiLCBhcGlTZXJ2aWNlLmV4cHJlc3MoKSk7XG5cdFx0XHRcdFx0XHQjIHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4gKCktPlxuXHRcdFx0XHRcdFx0IyBcdGNiKCk7XG5cblx0XHRcdFx0XHRcdGJyb2tlci53YWl0Rm9yU2VydmljZXMoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UubmFtZSkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0XHRcdFx0XHRzdGVlZG9zQ29yZS5pbml0KHNldHRpbmdzKS50aGVuICgpLT5cblx0XHRcdFx0XHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpKClcblx0XHRcdGNhdGNoIGV4XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixleClcbmNhdGNoIGVcblx0Y29uc29sZS5lcnJvcihcImVycm9yOlwiLGUpIiwidmFyIEFQSVNlcnZpY2UsIE1ldGFkYXRhU2VydmljZSwgY29uZmlnLCBlLCBtb2xlY3VsZXIsIG9iamVjdHFsLCBwYWNrYWdlTG9hZGVyLCBwYWNrYWdlU2VydmljZSwgcGF0aCwgc2V0dGluZ3MsIHN0ZWVkb3NDb3JlO1xuXG50cnkge1xuICBpZiAocHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIHN0ZWVkb3NDb3JlID0gcmVxdWlyZSgnQHN0ZWVkb3MvY29yZScpO1xuICAgIG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcbiAgICBtb2xlY3VsZXIgPSByZXF1aXJlKFwibW9sZWN1bGVyXCIpO1xuICAgIHBhY2thZ2VMb2FkZXIgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLW1ldGVvci1wYWNrYWdlLWxvYWRlcicpO1xuICAgIEFQSVNlcnZpY2UgPSByZXF1aXJlKCdAc3RlZWRvcy9zZXJ2aWNlLWFwaScpO1xuICAgIE1ldGFkYXRhU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0YWRhdGEtc2VydmVyJyk7XG4gICAgcGFja2FnZVNlcnZpY2UgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvc2VydmljZS1wYWNrYWdlLXJlZ2lzdHJ5XCIpO1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgY29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xuICAgIHNldHRpbmdzID0ge1xuICAgICAgYnVpbHRfaW5fcGx1Z2luczogW1wiQHN0ZWVkb3MvdW5wa2dcIiwgXCJAc3RlZWRvcy93b3JrZmxvd1wiLCBcIkBzdGVlZG9zL2FjY291bnRzXCIsIFwiQHN0ZWVkb3Mvc3RlZWRvcy1wbHVnaW4tc2NoZW1hLWJ1aWxkZXJcIiwgXCJAc3RlZWRvcy9wbHVnaW4tZW50ZXJwcmlzZVwiLCBcIkBzdGVlZG9zL21ldGFkYXRhLWFwaVwiLCBcIkBzdGVlZG9zL3BsdWdpbi1kaW5ndGFsa1wiLCBcIkBzdGVlZG9zL2RhdGEtaW1wb3J0XCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1maWVsZHMtaW5kZXhzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtY2hhcnRzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1wYWdlc1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtY2xvdWQtaW5pdFwiLCBcIkBzdGVlZG9zL3NlcnZpY2UtcGFja2FnZS1yZWdpc3RyeVwiLCBcIkBzdGVlZG9zL3N0YW5kYXJkLXByb2Nlc3NcIiwgXCJAc3RlZWRvcy93ZWJhcHAtYWNjb3VudHNcIiwgXCJAc3RlZWRvcy9zZXJ2aWNlLXBsdWdpbi1hbWlzXCJdLFxuICAgICAgcGx1Z2luczogY29uZmlnLnBsdWdpbnNcbiAgICB9O1xuICAgIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFwaVNlcnZpY2UsIGJyb2tlciwgZXgsIG1ldGFkYXRhU2VydmljZSwgcHJvamVjdFNlcnZpY2UsIHN0YW5kYXJkT2JqZWN0c0Rpciwgc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2U7XG4gICAgICB0cnkge1xuICAgICAgICBicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuICAgICAgICAgIG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG4gICAgICAgICAgbm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuICAgICAgICAgIG1ldGFkYXRhOiB7fSxcbiAgICAgICAgICB0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG4gICAgICAgICAgY2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG4gICAgICAgICAgbG9nTGV2ZWw6IFwid2FyblwiLFxuICAgICAgICAgIHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuICAgICAgICAgIHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG4gICAgICAgICAgbWF4Q2FsbExldmVsOiAxMDAsXG4gICAgICAgICAgaGVhcnRiZWF0SW50ZXJ2YWw6IDEwLFxuICAgICAgICAgIGhlYXJ0YmVhdFRpbWVvdXQ6IDMwLFxuICAgICAgICAgIGNvbnRleHRQYXJhbXNDbG9uaW5nOiBmYWxzZSxcbiAgICAgICAgICB0cmFja2luZzoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBzaHV0ZG93blRpbWVvdXQ6IDUwMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG4gICAgICAgICAgcmVnaXN0cnk6IHtcbiAgICAgICAgICAgIHN0cmF0ZWd5OiBcIlJvdW5kUm9iaW5cIixcbiAgICAgICAgICAgIHByZWZlckxvY2FsOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWxraGVhZDoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBjb25jdXJyZW5jeTogMTAsXG4gICAgICAgICAgICBtYXhRdWV1ZVNpemU6IDEwMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdmFsaWRhdG9yOiB0cnVlLFxuICAgICAgICAgIGVycm9ySGFuZGxlcjogbnVsbCxcbiAgICAgICAgICB0cmFjaW5nOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGV4cG9ydGVyOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiQ29uc29sZVwiLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvbG9yczogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgICAgICAgIGdhdWdlV2lkdGg6IDQwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNraXBQcm9jZXNzRXZlbnRSZWdpc3RyYXRpb246IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHByb2plY3RTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6IFwicHJvamVjdC1zZXJ2ZXJcIixcbiAgICAgICAgICBuYW1lc3BhY2U6IFwic3RlZWRvc1wiLFxuICAgICAgICAgIG1peGluczogW3BhY2thZ2VTZXJ2aWNlXVxuICAgICAgICB9KTtcbiAgICAgICAgbWV0YWRhdGFTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6ICdtZXRhZGF0YS1zZXJ2ZXInLFxuICAgICAgICAgIG1peGluczogW01ldGFkYXRhU2VydmljZV0sXG4gICAgICAgICAgc2V0dGluZ3M6IHt9XG4gICAgICAgIH0pO1xuICAgICAgICBhcGlTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6IFwiYXBpXCIsXG4gICAgICAgICAgbWl4aW5zOiBbQVBJU2VydmljZV0sXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHBvcnQ6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBvYmplY3RxbC5nZXRTdGVlZG9zU2NoZW1hKGJyb2tlcik7XG4gICAgICAgIHN0YW5kYXJkT2JqZWN0c0RpciA9IG9iamVjdHFsLlN0YW5kYXJkT2JqZWN0c1BhdGg7XG4gICAgICAgIHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlID0gYnJva2VyLmNyZWF0ZVNlcnZpY2Uoe1xuICAgICAgICAgIG5hbWU6ICdzdGFuZGFyZC1vYmplY3RzJyxcbiAgICAgICAgICBtaXhpbnM6IFtwYWNrYWdlTG9hZGVyXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcGFja2FnZUluZm86IHtcbiAgICAgICAgICAgICAgcGF0aDogc3RhbmRhcmRPYmplY3RzRGlyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oY2IpIHtcbiAgICAgICAgICByZXR1cm4gYnJva2VyLnN0YXJ0KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghYnJva2VyLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgYnJva2VyLl9yZXN0YXJ0U2VydmljZShzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShcIi9cIiwgYXBpU2VydmljZS5leHByZXNzKCkpO1xuICAgICAgICAgICAgcmV0dXJuIGJyb2tlci53YWl0Rm9yU2VydmljZXMoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UubmFtZSkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBleCA9IGVycm9yO1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGUgPSBlcnJvcjtcbiAgY29uc29sZS5lcnJvcihcImVycm9yOlwiLCBlKTtcbn1cbiIsIkNyZWF0b3IuZGVwcyA9IHtcblx0YXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG5cdG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG5cdEFwcHM6IHt9LFxuXHRPYmplY3RzOiB7fVxufVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7ZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7b3B0aW9uc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSl9KVxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Y3JlYXRlRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cbiMgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzIOS+m3N0ZWVkb3MtY2xp6aG555uu5L2/55SoXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxuXHRDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRcdEZpYmVyKCgpLT5cblx0XHRcdENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSlcblx0XHQpLnJ1bigpXG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSAob2JqLCBvYmplY3RfbmFtZSktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IG9iai5uYW1lXG5cblx0aWYgIW9iai5saXN0X3ZpZXdzXG5cdFx0b2JqLmxpc3Rfdmlld3MgPSB7fVxuXG5cdGlmIG9iai5zcGFjZVxuXHRcdG9iamVjdF9uYW1lID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmopXG5cdGlmIG9iamVjdF9uYW1lID09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCdcblx0XHRvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCdcblx0XHRvYmogPSBfLmNsb25lKG9iailcblx0XHRvYmoubmFtZSA9IG9iamVjdF9uYW1lXG5cdFx0Q3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9ialxuXG5cdENyZWF0b3IuY29udmVydE9iamVjdChvYmopXG5cdG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuXG5cdENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKVxuXHRDcmVhdG9yLmluaXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXG5cdHJldHVybiBvYmpcblxuQ3JlYXRvci5nZXRPYmplY3ROYW1lID0gKG9iamVjdCkgLT5cblx0aWYgb2JqZWN0LnNwYWNlXG5cdFx0cmV0dXJuIFwiY18je29iamVjdC5zcGFjZX1fI3tvYmplY3QubmFtZX1cIlxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcblxuQ3JlYXRvci5nZXRPYmplY3QgPSAob2JqZWN0X25hbWUsIHNwYWNlX2lkKS0+XG5cdGlmIF8uaXNBcnJheShvYmplY3RfbmFtZSlcblx0XHRyZXR1cm4gO1xuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRDcmVhdG9yLmRlcHM/Lm9iamVjdD8uZGVwZW5kKClcblx0aWYgIW9iamVjdF9uYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuI1x0aWYgIXNwYWNlX2lkICYmIG9iamVjdF9uYW1lXG4jXHRcdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhb2JqZWN0X25hbWUuc3RhcnRzV2l0aCgnY18nKVxuI1x0XHRcdHNwYWNlX2lkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cblx0aWYgb2JqZWN0X25hbWVcbiNcdFx0aWYgc3BhY2VfaWRcbiNcdFx0XHRvYmogPSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbXCJjXyN7c3BhY2VfaWR9XyN7b2JqZWN0X25hbWV9XCJdXG4jXHRcdFx0aWYgb2JqXG4jXHRcdFx0XHRyZXR1cm4gb2JqXG4jXG4jXHRcdG9iaiA9IF8uZmluZCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvKS0+XG4jXHRcdFx0XHRyZXR1cm4gby5fY29sbGVjdGlvbl9uYW1lID09IG9iamVjdF9uYW1lXG4jXHRcdGlmIG9ialxuI1x0XHRcdHJldHVybiBvYmpcblxuXHRcdHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0T2JqZWN0QnlJZCA9IChvYmplY3RfaWQpLT5cblx0cmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge19pZDogb2JqZWN0X2lkfSlcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSAob2JqZWN0X25hbWUpLT5cblx0Y29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpXG5cdGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWVcblx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0aWYgb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/Ll9jb2xsZWN0aW9uX25hbWUgfHwgb2JqZWN0X25hbWVdXG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IChvYmplY3RfbmFtZSktPlxuXHRkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0aWYgIXVzZXJJZFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0c3BhY2UgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKT8uZGI/LmZpbmRPbmUoc3BhY2VJZCx7ZmllbGRzOnthZG1pbnM6MX19KVxuXHRpZiBzcGFjZT8uYWRtaW5zXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMFxuXG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKS0+XG5cblx0aWYgIV8uaXNTdHJpbmcoZm9ybXVsYXIpXG5cdFx0cmV0dXJuIGZvcm11bGFyXG5cblx0aWYgQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpXG5cdFx0cmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKVxuXG5cdHJldHVybiBmb3JtdWxhclxuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IChmaWx0ZXJzLCBjb250ZXh0KS0+XG5cdHNlbGVjdG9yID0ge31cblx0Xy5lYWNoIGZpbHRlcnMsIChmaWx0ZXIpLT5cblx0XHRpZiBmaWx0ZXI/Lmxlbmd0aCA9PSAzXG5cdFx0XHRuYW1lID0gZmlsdGVyWzBdXG5cdFx0XHRhY3Rpb24gPSBmaWx0ZXJbMV1cblx0XHRcdHZhbHVlID0gQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEoZmlsdGVyWzJdLCBjb250ZXh0KVxuXHRcdFx0c2VsZWN0b3JbbmFtZV0gPSB7fVxuXHRcdFx0c2VsZWN0b3JbbmFtZV1bYWN0aW9uXSA9IHZhbHVlXG5cdCMgY29uc29sZS5sb2coXCJldmFsdWF0ZUZpbHRlcnMtLT5zZWxlY3RvclwiLCBzZWxlY3Rvcilcblx0cmV0dXJuIHNlbGVjdG9yXG5cbkNyZWF0b3IuaXNDb21tb25TcGFjZSA9IChzcGFjZUlkKSAtPlxuXHRyZXR1cm4gc3BhY2VJZCA9PSAnY29tbW9uJ1xuXG4jIyNcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuIyMjXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IChkb2NzLCBpZHMsIGlkX2tleSwgaGl0X2ZpcnN0KS0+XG5cblx0aWYgIWlkX2tleVxuXHRcdGlkX2tleSA9IFwiX2lkXCJcblxuXHRpZiBoaXRfZmlyc3RcblxuXHRcdCPnlLHkuo7kuI3og73kvb/nlKhfLmZpbmRJbmRleOWHveaVsO+8jOWboOatpOatpOWkhOWFiOWwhuWvueixoeaVsOe7hOi9rOS4uuaZrumAmuaVsOe7hOexu+Wei++8jOWcqOiOt+WPluWFtmluZGV4XG5cdFx0dmFsdWVzID0gZG9jcy5nZXRQcm9wZXJ0eShpZF9rZXkpXG5cblx0XHRyZXR1cm5cdF8uc29ydEJ5IGRvY3MsIChkb2MpLT5cblx0XHRcdFx0XHRfaW5kZXggPSBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcblx0XHRcdFx0XHRpZiBfaW5kZXggPiAtMVxuXHRcdFx0XHRcdFx0cmV0dXJuIF9pbmRleFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiBpZHMubGVuZ3RoICsgXy5pbmRleE9mKHZhbHVlcywgZG9jW2lkX2tleV0pXG5cdGVsc2Vcblx0XHRyZXR1cm5cdF8uc29ydEJ5IGRvY3MsIChkb2MpLT5cblx0XHRcdHJldHVybiBpZHMuaW5kZXhPZihkb2NbaWRfa2V5XSlcblxuIyMjXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiMjI1xuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gKHZhbHVlMSwgdmFsdWUyKSAtPlxuXHRpZiB0aGlzLmtleVxuXHRcdHZhbHVlMSA9IHZhbHVlMVt0aGlzLmtleV1cblx0XHR2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldXG5cdGlmIHZhbHVlMSBpbnN0YW5jZW9mIERhdGVcblx0XHR2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpXG5cdGlmIHZhbHVlMiBpbnN0YW5jZW9mIERhdGVcblx0XHR2YWx1ZTIgPSB2YWx1ZTIuZ2V0VGltZSgpXG5cdGlmIHR5cGVvZiB2YWx1ZTEgaXMgXCJudW1iZXJcIiBhbmQgdHlwZW9mIHZhbHVlMiBpcyBcIm51bWJlclwiXG5cdFx0cmV0dXJuIHZhbHVlMSAtIHZhbHVlMlxuXHQjIEhhbmRsaW5nIG51bGwgdmFsdWVzXG5cdGlzVmFsdWUxRW1wdHkgPSB2YWx1ZTEgPT0gbnVsbCBvciB2YWx1ZTEgPT0gdW5kZWZpbmVkXG5cdGlzVmFsdWUyRW1wdHkgPSB2YWx1ZTIgPT0gbnVsbCBvciB2YWx1ZTIgPT0gdW5kZWZpbmVkXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kICFpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIC0xXG5cdGlmIGlzVmFsdWUxRW1wdHkgYW5kIGlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gMFxuXHRpZiAhaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAxXG5cdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0cmV0dXJuIHZhbHVlMS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUgdmFsdWUyLnRvU3RyaW5nKCksIGxvY2FsZVxuXG5cbiMg6K+l5Ye95pWw5Y+q5Zyo5Yid5aeL5YyWT2JqZWN05pe277yM5oqK55u45YWz5a+56LGh55qE6K6h566X57uT5p6c5L+d5a2Y5YiwT2JqZWN055qEcmVsYXRlZF9vYmplY3Rz5bGe5oCn5Lit77yM5ZCO57ut5Y+v5Lul55u05o6l5LuOcmVsYXRlZF9vYmplY3Rz5bGe5oCn5Lit5Y+W5b6X6K6h566X57uT5p6c6ICM5LiN55So5YaN5qyh6LCD55So6K+l5Ye95pWw5p2l6K6h566XXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gKG9iamVjdF9uYW1lKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0cmVsYXRlZF9vYmplY3RzID0gW11cblx0IyBfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdCMg5ZugQ3JlYXRvci5nZXRPYmplY3Tlh73mlbDlhoXpg6jopoHosIPnlKjor6Xlh73mlbDvvIzmiYDku6Xov5nph4zkuI3lj6/ku6XosIPnlKhDcmVhdG9yLmdldE9iamVjdOWPluWvueixoe+8jOWPquiDveiwg+eUqENyZWF0b3IuT2JqZWN0c+adpeWPluWvueixoVxuXHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRpZiAhX29iamVjdFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdHNcblx0XG5cdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxuXHRpZiBNZXRlb3IuaXNDbGllbnQgJiYgIV8uaXNFbXB0eSByZWxhdGVkTGlzdFxuXHRcdHJlbGF0ZWRMaXN0TWFwID0ge31cblx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpOYW1lKS0+XG5cdFx0XHRpZiBfLmlzT2JqZWN0IG9iak5hbWVcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZS5vYmplY3ROYW1lXSA9IHt9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW29iak5hbWVdID0ge31cblx0XHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRcdF8uZWFjaCByZWxhdGVkX29iamVjdC5maWVsZHMsIChyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpLT5cblx0XHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCByZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIikgYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PSBvYmplY3RfbmFtZSBhbmQgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV1cblx0XHRcdFx0XHQjIOW9k3JlbGF0ZWRfb2JqZWN0LmZpZWxkc+S4reacieS4pOS4quaIluS7peS4iueahOWtl+auteaMh+WQkW9iamVjdF9uYW1l6KGo56S655qE5a+56LGh5pe277yM5LyY5YWI5Y+W56ys5LiA5Liq5L2c5Li65aSW6ZSu5YWz57O75a2X5q6177yM5L2G5pivcmVsYXRlZF9maWVsZOS4uuS4u+WtkOihqOaXtuW8uuihjOimhuebluS5i+WJjeeahHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVd5YC8XG5cdFx0XHRcdFx0aWYgXy5pc0VtcHR5IHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIlxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7IG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLCBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10gPSB7IG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLCBmb3JlaWduX2tleTogXCJwYXJlbnRcIiB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddXG5cdFx0XHRyZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7IG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLCBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCIgfVxuXHRcdF8uZWFjaCBbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgKGVuYWJsZU9iak5hbWUpLT5cblx0XHRcdGlmIHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdXG5cdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdID0geyBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiIH1cblx0XHRpZiByZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddXG5cdFx0XHQjcmVjb3JkIOivpue7huS4i+eahGF1ZGl0X3JlY29yZHPku4Vtb2RpZnlBbGxSZWNvcmRz5p2D6ZmQ5Y+v6KeBXG5cdFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXG5cdFx0XHRpZiBfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddID0geyBvYmplY3RfbmFtZTpcImF1ZGl0X3JlY29yZHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiIH1cblx0XHRyZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyByZWxhdGVkTGlzdE1hcFxuXHRcdHJldHVybiByZWxhdGVkX29iamVjdHNcblxuXHRpZiBfb2JqZWN0LmVuYWJsZV9maWxlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImNtc19maWxlc1wiLCBmb3JlaWduX2tleTogXCJwYXJlbnRcIn1cblxuXHRfLmVhY2ggQ3JlYXRvci5PYmplY3RzLCAocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpLT5cblx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxuXHRcdFx0IyBjZnMuZmlsZXMuZmlsZXJlY29yZOWvueixoeWcqOesrOS6jOasoeeCueWHu+eahOaXtuWAmXJlbGF0ZWRfb2JqZWN06L+U5Zue55qE5pivYXBwLWJ1aWxkZXLkuK3nmoRcIm1ldGFkYXRhLnBhcmVudFwi5a2X5q616KKr5Yig6Zmk5LqG77yM6K6w5YiwbWV0YWRhdGHlrZfmrrXnmoRzdWJfZmllbGRz5Lit5LqG77yM5omA5Lul6KaB5Y2V54us5aSE55CG44CCXG5cdFx0XHRzZnNGaWxlc09iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIilcblx0XHRcdHNmc0ZpbGVzT2JqZWN0ICYmIHJlbGF0ZWRfb2JqZWN0ID0gc2ZzRmlsZXNPYmplY3Rcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3QuZmllbGRzLCAocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKS0+XG5cdFx0XHRpZiAocmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIHx8IChyZWxhdGVkX2ZpZWxkLnR5cGUgPT0gXCJsb29rdXBcIiAmJiByZWxhdGVkX2ZpZWxkLnJlbGF0ZWRMaXN0KSkgYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PSBvYmplY3RfbmFtZVxuXHRcdFx0XHRpZiByZWxhdGVkX29iamVjdF9uYW1lID09IFwib2JqZWN0X2ZpZWxkc1wiXG5cdFx0XHRcdFx0I1RPRE8g5b6F55u45YWz5YiX6KGo5pSv5oyB5o6S5bqP5ZCO77yM5Yig6Zmk5q2k5Yik5patXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RzLnNwbGljZSgwLCAwLCB7b2JqZWN0X25hbWU6cmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZX0pXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6cmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWR9XG5cblx0aWYgX29iamVjdC5lbmFibGVfdGFza3Ncblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJ0YXNrc1wiLCBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJ9XG5cdGlmIF9vYmplY3QuZW5hYmxlX25vdGVzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwibm90ZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ldmVudHNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJldmVudHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9pbnN0YW5jZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9hcHByb3ZhbHNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhcHByb3ZhbHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9wcm9jZXNzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwicHJvY2Vzc19pbnN0YW5jZV9oaXN0b3J5XCIsIGZvcmVpZ25fa2V5OiBcInRhcmdldF9vYmplY3RcIn1cblx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUpXG5cdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcImF1ZGl0X3JlY29yZHNcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXG5cdHJldHVybiByZWxhdGVkX29iamVjdHNcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9ICh1c2VySWQsIHNwYWNlSWQsIGlzVW5TYWZlTW9kZSktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRyZXR1cm4gQ3JlYXRvci5VU0VSX0NPTlRFWFRcblx0ZWxzZVxuXHRcdGlmICEodXNlcklkIGFuZCBzcGFjZUlkKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCJcblx0XHRcdHJldHVybiBudWxsXG5cdFx0c3VGaWVsZHMgPSB7bmFtZTogMSwgbW9iaWxlOiAxLCBwb3NpdGlvbjogMSwgZW1haWw6IDEsIGNvbXBhbnk6IDEsIG9yZ2FuaXphdGlvbjogMSwgc3BhY2U6IDEsIGNvbXBhbnlfaWQ6IDEsIGNvbXBhbnlfaWRzOiAxfVxuXHRcdCMgY2hlY2sgaWYgdXNlciBpbiB0aGUgc3BhY2Vcblx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczogc3VGaWVsZHN9KVxuXHRcdGlmICFzdVxuXHRcdFx0c3BhY2VJZCA9IG51bGxcblxuXHRcdCMgaWYgc3BhY2VJZCBub3QgZXhpc3RzLCBnZXQgdGhlIGZpcnN0IG9uZS5cblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0aWYgaXNVblNhZmVNb2RlXG5cdFx0XHRcdHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3VzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcblx0XHRcdFx0aWYgIXN1XG5cdFx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdFx0c3BhY2VJZCA9IHN1LnNwYWNlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBudWxsXG5cblx0XHRVU0VSX0NPTlRFWFQgPSB7fVxuXHRcdFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWRcblx0XHRVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWRcblx0XHRVU0VSX0NPTlRFWFQudXNlciA9IHtcblx0XHRcdF9pZDogdXNlcklkXG5cdFx0XHRuYW1lOiBzdS5uYW1lLFxuXHRcdFx0bW9iaWxlOiBzdS5tb2JpbGUsXG5cdFx0XHRwb3NpdGlvbjogc3UucG9zaXRpb24sXG5cdFx0XHRlbWFpbDogc3UuZW1haWxcblx0XHRcdGNvbXBhbnk6IHN1LmNvbXBhbnlcblx0XHRcdGNvbXBhbnlfaWQ6IHN1LmNvbXBhbnlfaWRcblx0XHRcdGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuXHRcdH1cblx0XHRzcGFjZV91c2VyX29yZyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9yZ2FuaXphdGlvbnNcIik/LmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKVxuXHRcdGlmIHNwYWNlX3VzZXJfb3JnXG5cdFx0XHRVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG5cdFx0XHRcdF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuXHRcdFx0XHRuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuXHRcdFx0XHRmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcblx0XHRcdH1cblx0XHRyZXR1cm4gVVNFUl9DT05URVhUXG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSAodXJsKS0+XG5cblx0aWYgXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICh1cmw/LnN0YXJ0c1dpdGgoXCIvYXNzZXRzXCIpIHx8IHVybD8uc3RhcnRzV2l0aChcImFzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCIvcGFja2FnZXNcIikpXG5cdFx0aWYgIS9eXFwvLy50ZXN0KHVybClcblx0XHRcdHVybCA9IFwiL1wiICsgdXJsXG5cdFx0cmV0dXJuIHVybFxuXG5cdGlmIHVybFxuXHRcdCMgdXJs5byA5aS05rKh5pyJXCIvXCLvvIzpnIDopoHmt7vliqBcIi9cIlxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxuXHRcdHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsXG5cdGVsc2Vcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWFxuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSAodXNlcklkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxuXHRlbHNlXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkOjF9fSlcblx0cmV0dXJuIHN1LmNvbXBhbnlfaWRcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyA9ICh1c2VySWQsIHNwYWNlSWQpLT5cblx0dXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpXG5cdGVsc2Vcblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKVxuXHRzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge2NvbXBhbnlfaWRzOjF9fSlcblx0cmV0dXJuIHN1Py5jb21wYW55X2lkc1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IChwbyktPlxuXHRpZiBwby5hbGxvd0NyZWF0ZVxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0XG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLnZpZXdBbGxSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdHBvLmFsbG93RWRpdCA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHRwby52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0aWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0cG8udmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXHRcdFxuXHQjIOWmguaenOmZhOS7tuebuOWFs+adg+mZkOmFjee9ruS4uuepuu+8jOWImeWFvOWuueS5i+WJjeayoeaciemZhOS7tuadg+mZkOmFjee9ruaXtueahOinhOWImVxuXHRpZiBwby5hbGxvd1JlYWRcblx0XHR0eXBlb2YgcG8uYWxsb3dSZWFkRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdFx0dHlwZW9mIHBvLnZpZXdBbGxGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby52aWV3QWxsRmlsZXMgPSB0cnVlXG5cdGlmIHBvLmFsbG93RWRpdFxuXHRcdHR5cGVvZiBwby5hbGxvd0NyZWF0ZUZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93Q3JlYXRlRmlsZXMgPSB0cnVlXG5cdFx0dHlwZW9mIHBvLmFsbG93RWRpdEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby5hbGxvd0RlbGV0ZUZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlXG5cdGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcblx0XHR0eXBlb2YgcG8ubW9kaWZ5QWxsRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8ubW9kaWZ5QWxsRmlsZXMgPSB0cnVlXG5cblx0aWYgcG8uYWxsb3dDcmVhdGVGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0VkaXRGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0RlbGV0ZUZpbGVzXG5cdFx0cG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlXG5cdFx0cG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlXG5cdGlmIHBvLnZpZXdBbGxGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxGaWxlc1xuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRcdHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlXG5cdFx0cG8udmlld0FsbEZpbGVzID0gdHJ1ZVxuXG5cdHJldHVybiBwb1xuXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9ICgpLT5cblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZFxuXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gKCktPlxuXHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8uY2xvdWRBZG1pblNwYWNlSWRcblxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSAoc3BhY2VJZCktPlxuXHRpZiBzcGFjZUlkICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnRlbXBsYXRlU3BhY2VJZCA9PSBzcGFjZUlkXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSAoc3BhY2VJZCktPlxuXHRpZiBzcGFjZUlkICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkID09IHNwYWNlSWRcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSXG5cdCIsInZhciBGaWJlcjtcblxuQ3JlYXRvci5kZXBzID0ge1xuICBhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3ksXG4gIG9iamVjdDogbmV3IFRyYWNrZXIuRGVwZW5kZW5jeVxufTtcblxuQ3JlYXRvci5fVEVNUExBVEUgPSB7XG4gIEFwcHM6IHt9LFxuICBPYmplY3RzOiB7fVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIG9wdGlvbnNGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xuICByZXR1cm4gU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe1xuICAgIGNyZWF0ZUZ1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG59KTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIENyZWF0b3IubG9hZE9iamVjdHMob2JqLCBvYmplY3RfbmFtZSk7XG4gICAgfSkucnVuKCk7XG4gIH07XG59XG5cbkNyZWF0b3IubG9hZE9iamVjdHMgPSBmdW5jdGlvbihvYmosIG9iamVjdF9uYW1lKSB7XG4gIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICBvYmplY3RfbmFtZSA9IG9iai5uYW1lO1xuICB9XG4gIGlmICghb2JqLmxpc3Rfdmlld3MpIHtcbiAgICBvYmoubGlzdF92aWV3cyA9IHt9O1xuICB9XG4gIGlmIChvYmouc3BhY2UpIHtcbiAgICBvYmplY3RfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUgPT09ICdjZnNfZmlsZXNfZmlsZXJlY29yZCcpIHtcbiAgICBvYmplY3RfbmFtZSA9ICdjZnMuZmlsZXMuZmlsZXJlY29yZCc7XG4gICAgb2JqID0gXy5jbG9uZShvYmopO1xuICAgIG9iai5uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSA9IG9iajtcbiAgfVxuICBDcmVhdG9yLmNvbnZlcnRPYmplY3Qob2JqKTtcbiAgbmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG4gIENyZWF0b3IuaW5pdFRyaWdnZXJzKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5pbml0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgcmV0dXJuIG9iajtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0TmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0LnNwYWNlKSB7XG4gICAgcmV0dXJuIFwiY19cIiArIG9iamVjdC5zcGFjZSArIFwiX1wiICsgb2JqZWN0Lm5hbWU7XG4gIH1cbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgaWYgKF8uaXNBcnJheShvYmplY3RfbmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICgocmVmID0gQ3JlYXRvci5kZXBzKSAhPSBudWxsKSB7XG4gICAgICBpZiAoKHJlZjEgPSByZWYub2JqZWN0KSAhPSBudWxsKSB7XG4gICAgICAgIHJlZjEuZGVwZW5kKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdEJ5SWQgPSBmdW5jdGlvbihvYmplY3RfaWQpIHtcbiAgcmV0dXJuIF8uZmluZFdoZXJlKENyZWF0b3Iub2JqZWN0c0J5TmFtZSwge1xuICAgIF9pZDogb2JqZWN0X2lkXG4gIH0pO1xufTtcblxuQ3JlYXRvci5yZW1vdmVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICBjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSk7XG4gIGRlbGV0ZSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICByZXR1cm4gZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb24gPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmIChvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zWygocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLl9jb2xsZWN0aW9uX25hbWUgOiB2b2lkIDApIHx8IG9iamVjdF9uYW1lXTtcbiAgfVxufTtcblxuQ3JlYXRvci5yZW1vdmVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXTtcbn07XG5cbkNyZWF0b3IuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gIHZhciByZWYsIHJlZjEsIHNwYWNlO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cbiAgfVxuICBzcGFjZSA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChcInNwYWNlc1wiKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmRiKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHNwYWNlSWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGFkbWluczogMVxuICAgIH1cbiAgfSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIGlmIChzcGFjZSAhPSBudWxsID8gc3BhY2UuYWRtaW5zIDogdm9pZCAwKSB7XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfVxufTtcblxuQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEgPSBmdW5jdGlvbihmb3JtdWxhciwgY29udGV4dCwgb3B0aW9ucykge1xuICBpZiAoIV8uaXNTdHJpbmcoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIGZvcm11bGFyO1xuICB9XG4gIGlmIChDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmb3JtdWxhcikpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG4gIHJldHVybiBmb3JtdWxhcjtcbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gZnVuY3Rpb24oZmlsdGVycywgY29udGV4dCkge1xuICB2YXIgc2VsZWN0b3I7XG4gIHNlbGVjdG9yID0ge307XG4gIF8uZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgYWN0aW9uLCBuYW1lLCB2YWx1ZTtcbiAgICBpZiAoKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLmxlbmd0aCA6IHZvaWQgMCkgPT09IDMpIHtcbiAgICAgIG5hbWUgPSBmaWx0ZXJbMF07XG4gICAgICBhY3Rpb24gPSBmaWx0ZXJbMV07XG4gICAgICB2YWx1ZSA9IENyZWF0b3IuZXZhbHVhdGVGb3JtdWxhKGZpbHRlclsyXSwgY29udGV4dCk7XG4gICAgICBzZWxlY3RvcltuYW1lXSA9IHt9O1xuICAgICAgcmV0dXJuIHNlbGVjdG9yW25hbWVdW2FjdGlvbl0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc2VsZWN0b3I7XG59O1xuXG5DcmVhdG9yLmlzQ29tbW9uU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHJldHVybiBzcGFjZUlkID09PSAnY29tbW9uJztcbn07XG5cblxuLypcblx0ZG9jc++8muW+heaOkuW6j+eahOaWh+aho+aVsOe7hFxuXHRpZHPvvJpfaWTpm4blkIhcblx0aWRfa2V5OiDpu5jorqTkuLpfaWRcblx0cmV0dXJuIOaMieeFp2lkc+eahOmhuuW6j+i/lOWbnuaWsOeahOaWh+aho+mbhuWQiFxuICovXG5cbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gZnVuY3Rpb24oZG9jcywgaWRzLCBpZF9rZXksIGhpdF9maXJzdCkge1xuICB2YXIgdmFsdWVzO1xuICBpZiAoIWlkX2tleSkge1xuICAgIGlkX2tleSA9IFwiX2lkXCI7XG4gIH1cbiAgaWYgKGhpdF9maXJzdCkge1xuICAgIHZhbHVlcyA9IGRvY3MuZ2V0UHJvcGVydHkoaWRfa2V5KTtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICB2YXIgX2luZGV4O1xuICAgICAgX2luZGV4ID0gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgICAgaWYgKF9pbmRleCA+IC0xKSB7XG4gICAgICAgIHJldHVybiBfaW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaWRzLmxlbmd0aCArIF8uaW5kZXhPZih2YWx1ZXMsIGRvY1tpZF9rZXldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXy5zb3J0QnkoZG9jcywgZnVuY3Rpb24oZG9jKSB7XG4gICAgICByZXR1cm4gaWRzLmluZGV4T2YoZG9jW2lkX2tleV0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5cbi8qXG5cdOaMieeUqOaIt+aJgOWxnuacrOWcsOWMluivreiogOi/m+ihjOaOkuW6j++8jOaUr+aMgeS4reaWh+OAgeaVsOWAvOOAgeaXpeacn+etieWtl+auteaOkuW6j1xuXHTlr7nkuo5PYmplY3TnsbvlnovvvIzlpoLmnpzmj5DkvpvkvZznlKjln5/kuK1rZXnlsZ7mgKfvvIzliJnlj5blgLzkuLp2YWx1ZVtrZXld6L+b6KGM5o6S5bqP5q+U6L6D77yM5Y+N5LmL5pW05LiqT2JqZWN0LnRvU3RyaW5nKCnlkI7mjpLluo/mr5TovoNcbiAqL1xuXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSBmdW5jdGlvbih2YWx1ZTEsIHZhbHVlMikge1xuICB2YXIgaXNWYWx1ZTFFbXB0eSwgaXNWYWx1ZTJFbXB0eSwgbG9jYWxlO1xuICBpZiAodGhpcy5rZXkpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTFbdGhpcy5rZXldO1xuICAgIHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV07XG4gIH1cbiAgaWYgKHZhbHVlMSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YWx1ZTEgPSB2YWx1ZTEuZ2V0VGltZSgpO1xuICB9XG4gIGlmICh2YWx1ZTIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUyID0gdmFsdWUyLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlMSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgdmFsdWUyID09PSBcIm51bWJlclwiKSB7XG4gICAgcmV0dXJuIHZhbHVlMSAtIHZhbHVlMjtcbiAgfVxuICBpc1ZhbHVlMUVtcHR5ID0gdmFsdWUxID09PSBudWxsIHx8IHZhbHVlMSA9PT0gdm9pZCAwO1xuICBpc1ZhbHVlMkVtcHR5ID0gdmFsdWUyID09PSBudWxsIHx8IHZhbHVlMiA9PT0gdm9pZCAwO1xuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiAhaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgaWYgKCFpc1ZhbHVlMUVtcHR5ICYmIGlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICByZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSh2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlKTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgX29iamVjdCwgcGVybWlzc2lvbnMsIHJlbGF0ZWRMaXN0LCByZWxhdGVkTGlzdE1hcCwgcmVsYXRlZF9vYmplY3RzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgfVxuICByZWxhdGVkX29iamVjdHMgPSBbXTtcbiAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIGlmICghX29iamVjdCkge1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgcmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmICFfLmlzRW1wdHkocmVsYXRlZExpc3QpKSB7XG4gICAgcmVsYXRlZExpc3RNYXAgPSB7fTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3QsIGZ1bmN0aW9uKG9iak5hbWUpIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KG9iak5hbWUpKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtvYmpOYW1lLm9iamVjdE5hbWVdID0ge307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgcmVsYXRlZF9maWVsZC50eXBlID09PSBcImxvb2t1cFwiKSAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byAmJiByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byA9PT0gb2JqZWN0X25hbWUgJiYgcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0pIHtcbiAgICAgICAgICBpZiAoXy5pc0VtcHR5KHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB7XG4gICAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChyZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10pIHtcbiAgICAgIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXSA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnaW5zdGFuY2VzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImluc3RhbmNlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICAgIH07XG4gICAgfVxuICAgIF8uZWFjaChbJ3Rhc2tzJywgJ25vdGVzJywgJ2V2ZW50cycsICdhcHByb3ZhbHMnXSwgZnVuY3Rpb24oZW5hYmxlT2JqTmFtZSkge1xuICAgICAgaWYgKHJlbGF0ZWRMaXN0TWFwW2VuYWJsZU9iak5hbWVdKSB7XG4gICAgICAgIHJldHVybiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHtcbiAgICAgICAgICBvYmplY3RfbmFtZTogZW5hYmxlT2JqTmFtZSxcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSkge1xuICAgICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICAgIGlmIChfb2JqZWN0LmVuYWJsZV9hdWRpdCAmJiAocGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZWxhdGVkX29iamVjdHMgPSBfLnZhbHVlcyhyZWxhdGVkTGlzdE1hcCk7XG4gICAgcmV0dXJuIHJlbGF0ZWRfb2JqZWN0cztcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZmlsZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInBhcmVudFwiXG4gICAgfSk7XG4gIH1cbiAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgc2ZzRmlsZXNPYmplY3Q7XG4gICAgaWYgKHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIikge1xuICAgICAgc2ZzRmlsZXNPYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChcImNmcy5maWxlcy5maWxlcmVjb3JkXCIpO1xuICAgICAgc2ZzRmlsZXNPYmplY3QgJiYgKHJlbGF0ZWRfb2JqZWN0ID0gc2ZzRmlsZXNPYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gXy5lYWNoKHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgZnVuY3Rpb24ocmVsYXRlZF9maWVsZCwgcmVsYXRlZF9maWVsZF9uYW1lKSB7XG4gICAgICBpZiAoKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgKHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiAmJiByZWxhdGVkX2ZpZWxkLnJlbGF0ZWRMaXN0KSkgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lKSB7XG4gICAgICAgIGlmIChyZWxhdGVkX29iamVjdF9uYW1lID09PSBcIm9iamVjdF9maWVsZHNcIikge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMuc3BsaWNlKDAsIDAsIHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICAgICAgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogcmVsYXRlZF9maWVsZC53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBpZiAoX29iamVjdC5lbmFibGVfdGFza3MpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJ0YXNrc1wiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgfSk7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX25vdGVzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwibm90ZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ldmVudHMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJldmVudHNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9pbnN0YW5jZXMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9hcHByb3ZhbHMpIHtcbiAgICByZWxhdGVkX29iamVjdHMucHVzaCh7XG4gICAgICBvYmplY3RfbmFtZTogXCJhcHByb3ZhbHNcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9wcm9jZXNzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwicHJvY2Vzc19pbnN0YW5jZV9oaXN0b3J5XCIsXG4gICAgICBmb3JlaWduX2tleTogXCJ0YXJnZXRfb2JqZWN0XCJcbiAgICB9KTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKTtcbiAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICBvYmplY3RfbmFtZTogXCJhdWRpdF9yZWNvcmRzXCIsXG4gICAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZWxhdGVkX29iamVjdHM7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb250ZXh0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpIHtcbiAgdmFyIFVTRVJfQ09OVEVYVCwgcmVmLCBzcGFjZV91c2VyX29yZywgc3UsIHN1RmllbGRzO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgcmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUO1xuICB9IGVsc2Uge1xuICAgIGlmICghKHVzZXJJZCAmJiBzcGFjZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwidGhlIHBhcmFtcyB1c2VySWQgYW5kIHNwYWNlSWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFVzZXJDb250ZXh0XCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN1RmllbGRzID0ge1xuICAgICAgbmFtZTogMSxcbiAgICAgIG1vYmlsZTogMSxcbiAgICAgIHBvc2l0aW9uOiAxLFxuICAgICAgZW1haWw6IDEsXG4gICAgICBjb21wYW55OiAxLFxuICAgICAgb3JnYW5pemF0aW9uOiAxLFxuICAgICAgc3BhY2U6IDEsXG4gICAgICBjb21wYW55X2lkOiAxLFxuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9O1xuICAgIHN1ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgfSk7XG4gICAgaWYgKCFzdSkge1xuICAgICAgc3BhY2VJZCA9IG51bGw7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgaWYgKGlzVW5TYWZlTW9kZSkge1xuICAgICAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczogc3VGaWVsZHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghc3UpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzcGFjZUlkID0gc3Uuc3BhY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgVVNFUl9DT05URVhUID0ge307XG4gICAgVVNFUl9DT05URVhULnVzZXJJZCA9IHVzZXJJZDtcbiAgICBVU0VSX0NPTlRFWFQuc3BhY2VJZCA9IHNwYWNlSWQ7XG4gICAgVVNFUl9DT05URVhULnVzZXIgPSB7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIG5hbWU6IHN1Lm5hbWUsXG4gICAgICBtb2JpbGU6IHN1Lm1vYmlsZSxcbiAgICAgIHBvc2l0aW9uOiBzdS5wb3NpdGlvbixcbiAgICAgIGVtYWlsOiBzdS5lbWFpbCxcbiAgICAgIGNvbXBhbnk6IHN1LmNvbXBhbnksXG4gICAgICBjb21wYW55X2lkOiBzdS5jb21wYW55X2lkLFxuICAgICAgY29tcGFueV9pZHM6IHN1LmNvbXBhbnlfaWRzXG4gICAgfTtcbiAgICBzcGFjZV91c2VyX29yZyA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpKSAhPSBudWxsID8gcmVmLmZpbmRPbmUoc3Uub3JnYW5pemF0aW9uKSA6IHZvaWQgMDtcbiAgICBpZiAoc3BhY2VfdXNlcl9vcmcpIHtcbiAgICAgIFVTRVJfQ09OVEVYVC51c2VyLm9yZ2FuaXphdGlvbiA9IHtcbiAgICAgICAgX2lkOiBzcGFjZV91c2VyX29yZy5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlX3VzZXJfb3JnLm5hbWUsXG4gICAgICAgIGZ1bGxuYW1lOiBzcGFjZV91c2VyX29yZy5mdWxsbmFtZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFVTRVJfQ09OVEVYVDtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWxhdGl2ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICBpZiAoXy5pc0Z1bmN0aW9uKFN0ZWVkb3MuaXNDb3Jkb3ZhKSAmJiBTdGVlZG9zLmlzQ29yZG92YSgpICYmICgodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9hc3NldHNcIikgOiB2b2lkIDApIHx8ICh1cmwgIT0gbnVsbCA/IHVybC5zdGFydHNXaXRoKFwiYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcIi9wYWNrYWdlc1wiKSA6IHZvaWQgMCkpKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICBpZiAodXJsKSB7XG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcIi9cIiArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggKyB1cmw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVg7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgc3U7XG4gIHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKCk7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gc3BhY2VJZCB8fCBTZXNzaW9uLmdldCgnc3BhY2VJZCcpO1xuICB9IGVsc2Uge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdtaXNzIHNwYWNlSWQnKTtcbiAgICB9XG4gIH1cbiAgc3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNvbXBhbnlfaWQ6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UuY29tcGFueV9pZDtcbn07XG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkczogMVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdSAhPSBudWxsID8gc3UuY29tcGFueV9pZHMgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHBvKSB7XG4gIGlmIChwby5hbGxvd0NyZWF0ZSkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdCkge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlKSB7XG4gICAgcG8uYWxsb3dFZGl0ID0gdHJ1ZTtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsUmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0NvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGUgPSB0cnVlO1xuICAgIHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93UmVhZCkge1xuICAgIHR5cGVvZiBwby5hbGxvd1JlYWRGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZSk7XG4gICAgdHlwZW9mIHBvLnZpZXdBbGxGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLnZpZXdBbGxGaWxlcyA9IHRydWUpO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICB0eXBlb2YgcG8uYWxsb3dDcmVhdGVGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93Q3JlYXRlRmlsZXMgPSB0cnVlKTtcbiAgICB0eXBlb2YgcG8uYWxsb3dFZGl0RmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd0VkaXRGaWxlcyA9IHRydWUpO1xuICAgIHR5cGVvZiBwby5hbGxvd0RlbGV0ZUZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWUpO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgdHlwZW9mIHBvLm1vZGlmeUFsbEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8ubW9kaWZ5QWxsRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8uYWxsb3dDcmVhdGVGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0RmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RGVsZXRlRmlsZXMpIHtcbiAgICBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWU7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby52aWV3QWxsRmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUFsbEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICAgIHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZTtcbiAgICBwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZTtcbiAgICBwby52aWV3QWxsRmlsZXMgPSB0cnVlO1xuICB9XG4gIHJldHVybiBwbztcbn07XG5cbkNyZWF0b3IuZ2V0VGVtcGxhdGVTcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuZ2V0Q2xvdWRBZG1pblNwYWNlSWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYuY2xvdWRBZG1pblNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmlzVGVtcGxhdGVTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKHNwYWNlSWQgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYudGVtcGxhdGVTcGFjZUlkIDogdm9pZCAwKSA9PT0gc3BhY2VJZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwKSA9PT0gc3BhY2VJZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciA9IHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVI7XG59XG4iLCJNZXRlb3IubWV0aG9kc1xuXHQjIOeUqOaIt+iOt+WPlmxvb2t1cCDjgIFtYXN0ZXJfZGV0YWls57G75Z6L5a2X5q6155qE6YCJ6aG55YC8XG5cdFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiAob3B0aW9ucyktPlxuXHRcdGlmIG9wdGlvbnM/LnBhcmFtcz8ucmVmZXJlbmNlX3RvXG5cblx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpXG5cblx0XHRcdG5hbWVfZmllbGRfa2V5ID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZXG5cblx0XHRcdHF1ZXJ5ID0ge31cblx0XHRcdGlmIG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cdFx0XHRcdHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2VcblxuXHRcdFx0XHRzb3J0ID0gb3B0aW9ucz8uc29ydFxuXG5cdFx0XHRcdHNlbGVjdGVkID0gb3B0aW9ucz8uc2VsZWN0ZWQgfHwgW11cblxuXHRcdFx0XHRvcHRpb25zX2xpbWl0ID0gb3B0aW9ucz8ub3B0aW9uc19saW1pdCB8fCAxMFxuXG5cdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeSA9IHt9XG5cdFx0XHRcdFx0c2VhcmNoVGV4dFF1ZXJ5W25hbWVfZmllbGRfa2V5XSA9IHskcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dH1cblxuXHRcdFx0XHRpZiBvcHRpb25zPy52YWx1ZXM/Lmxlbmd0aFxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX0sIHNlYXJjaFRleHRRdWVyeV1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRxdWVyeS4kb3IgPSBbe19pZDogeyRpbjogb3B0aW9ucy52YWx1ZXN9fV1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIG9wdGlvbnMuc2VhcmNoVGV4dFxuXHRcdFx0XHRcdFx0Xy5leHRlbmQocXVlcnksIHNlYXJjaFRleHRRdWVyeSlcblx0XHRcdFx0XHRxdWVyeS5faWQgPSB7JG5pbjogc2VsZWN0ZWR9XG5cblx0XHRcdFx0Y29sbGVjdGlvbiA9IG9iamVjdC5kYlxuXG5cdFx0XHRcdGlmIG9wdGlvbnMuZmlsdGVyUXVlcnlcblx0XHRcdFx0XHRfLmV4dGVuZCBxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeVxuXG5cdFx0XHRcdHF1ZXJ5X29wdGlvbnMgPSB7bGltaXQ6IG9wdGlvbnNfbGltaXR9XG5cblx0XHRcdFx0aWYgc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpXG5cdFx0XHRcdFx0cXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydFxuXG5cdFx0XHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHJlY29yZHMgPSBjb2xsZWN0aW9uLmZpbmQocXVlcnksIHF1ZXJ5X29wdGlvbnMpLmZldGNoKClcblx0XHRcdFx0XHRcdHJlc3VsdHMgPSBbXVxuXHRcdFx0XHRcdFx0Xy5lYWNoIHJlY29yZHMsIChyZWNvcmQpLT5cblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcmVjb3JkLl9pZFxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHNcblx0XHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpXG5cdFx0cmV0dXJuIFtdICIsIk1ldGVvci5tZXRob2RzKHtcbiAgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgZSwgbmFtZV9maWVsZF9rZXksIG9iamVjdCwgb3B0aW9uc19saW1pdCwgcXVlcnksIHF1ZXJ5X29wdGlvbnMsIHJlY29yZHMsIHJlZiwgcmVmMSwgcmVzdWx0cywgc2VhcmNoVGV4dFF1ZXJ5LCBzZWxlY3RlZCwgc29ydDtcbiAgICBpZiAob3B0aW9ucyAhPSBudWxsID8gKHJlZiA9IG9wdGlvbnMucGFyYW1zKSAhPSBudWxsID8gcmVmLnJlZmVyZW5jZV90byA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob3B0aW9ucy5wYXJhbXMucmVmZXJlbmNlX3RvLCBvcHRpb25zLnBhcmFtcy5zcGFjZSk7XG4gICAgICBuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWTtcbiAgICAgIHF1ZXJ5ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5wYXJhbXMuc3BhY2UpIHtcbiAgICAgICAgcXVlcnkuc3BhY2UgPSBvcHRpb25zLnBhcmFtcy5zcGFjZTtcbiAgICAgICAgc29ydCA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc29ydCA6IHZvaWQgMDtcbiAgICAgICAgc2VsZWN0ZWQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zZWxlY3RlZCA6IHZvaWQgMCkgfHwgW107XG4gICAgICAgIG9wdGlvbnNfbGltaXQgPSAob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5vcHRpb25zX2xpbWl0IDogdm9pZCAwKSB8fCAxMDtcbiAgICAgICAgaWYgKG9wdGlvbnMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7XG4gICAgICAgICAgICAkcmVnZXg6IG9wdGlvbnMuc2VhcmNoVGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYxID0gb3B0aW9ucy52YWx1ZXMpICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LiRvciA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgJGluOiBvcHRpb25zLnZhbHVlc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSwgc2VhcmNoVGV4dFF1ZXJ5XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyeS5faWQgPSB7XG4gICAgICAgICAgICAkbmluOiBzZWxlY3RlZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY29sbGVjdGlvbiA9IG9iamVjdC5kYjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyUXVlcnkpIHtcbiAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgb3B0aW9ucy5maWx0ZXJRdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgcXVlcnlfb3B0aW9ucyA9IHtcbiAgICAgICAgICBsaW1pdDogb3B0aW9uc19saW1pdFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc29ydCAmJiBfLmlzT2JqZWN0KHNvcnQpKSB7XG4gICAgICAgICAgcXVlcnlfb3B0aW9ucy5zb3J0ID0gc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpO1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHJlY29yZHMsIGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogcmVjb3JkW25hbWVfZmllbGRfa2V5XSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLl9pZFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBlLm1lc3NhZ2UgKyBcIi0tPlwiICsgSlNPTi5zdHJpbmdpZnkob3B0aW9ucykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXG5cdFx0Y3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkXG5cblx0XHRoYXNoRGF0YSA9IHJlcS5ib2R5XG5cdFx0b2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZVxuXHRcdHJlY29yZF9pZCA9IGhhc2hEYXRhLnJlY29yZF9pZFxuXHRcdHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWRcblxuXHRcdGNoZWNrIG9iamVjdF9uYW1lLCBTdHJpbmdcblx0XHRjaGVjayByZWNvcmRfaWQsIFN0cmluZ1xuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcblxuXHRcdGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkXG5cdFx0eF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXVxuXHRcdHhfYXV0aF90b2tlbiA9IHJlcS5xdWVyeVsnWC1BdXRoLVRva2VuJ11cblxuXHRcdHJlZGlyZWN0X3VybCA9IFwiL1wiXG5cdFx0aW5zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdpbnN0YW5jZXMnKS5maW5kT25lKGluc0lkKVxuXHRcdCMgLSDmiJHnmoTojYnnqL/lsLHot7Povazoh7PojYnnqL/nrrFcblx0XHQjIC0g5oiR55qE5b6F5a6h5qC45bCx6Lez6L2s6Iez5b6F5a6h5qC4XG5cdFx0IyAtIOS4jeaYr+aIkeeahOeUs+ivt+WNleWImei3s+i9rOiHs+aJk+WNsOmhtemdolxuXHRcdCMgLSDlpoLnlLPor7fljZXkuI3lrZjlnKjliJnmj5DnpLrnlKjmiLfnlLPor7fljZXlt7LliKDpmaTvvIzlubbkuJTmm7TmlrByZWNvcmTnmoTnirbmgIHvvIzkvb/nlKjmiLflj6/ku6Xph43mlrDlj5HotbflrqHmiblcblx0XHRpZiBpbnNcblx0XHRcdGJveCA9ICcnXG5cdFx0XHRzcGFjZUlkID0gaW5zLnNwYWNlXG5cdFx0XHRmbG93SWQgPSBpbnMuZmxvd1xuXG5cdFx0XHRpZiAoaW5zLmluYm94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpIG9yIChpbnMuY2NfdXNlcnM/LmluY2x1ZGVzIGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0Ym94ID0gJ2luYm94J1xuXHRcdFx0ZWxzZSBpZiBpbnMub3V0Ym94X3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWRcblx0XHRcdFx0Ym94ID0gJ291dGJveCdcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdkcmFmdCcgYW5kIGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkXG5cdFx0XHRcdGJveCA9ICdkcmFmdCdcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdwZW5kaW5nJyBhbmQgKGlucy5zdWJtaXR0ZXIgaXMgY3VycmVudF91c2VyX2lkIG9yIGlucy5hcHBsaWNhbnQgaXMgY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRib3ggPSAncGVuZGluZydcblx0XHRcdGVsc2UgaWYgaW5zLnN0YXRlIGlzICdjb21wbGV0ZWQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxuXHRcdFx0XHRib3ggPSAnY29tcGxldGVkJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOmqjOivgWxvZ2luIHVzZXJfaWTlr7nor6XmtYHnqIvmnInnrqHnkIbjgIHop4Llr5/nlLPor7fljZXnmoTmnYPpmZBcblx0XHRcdFx0cGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwgeyBmaWVsZHM6IHsgYWRtaW5zOiAxIH0gfSlcblx0XHRcdFx0aWYgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJhZG1pblwiKSBvciBwZXJtaXNzaW9ucy5pbmNsdWRlcyhcIm1vbml0b3JcIikgb3Igc3BhY2UuYWRtaW5zLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0XHRib3ggPSAnbW9uaXRvcidcblx0XHRcdHdvcmtmbG93VXJsID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcz8ud29ya2Zsb3c/LnVybFxuXHRcdFx0aWYgYm94XG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vI3tib3h9LyN7aW5zSWR9P1gtVXNlci1JZD0je3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSN7eF9hdXRoX3Rva2VufVwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyBcIndvcmtmbG93L3NwYWNlLyN7c3BhY2VJZH0vcHJpbnQvI3tpbnNJZH0/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPSN7eF91c2VyX2lkfSZYLUF1dGgtVG9rZW49I3t4X2F1dGhfdG9rZW59XCJcblxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0XHRjb2RlOiAyMDBcblx0XHRcdFx0ZGF0YTogeyByZWRpcmVjdF91cmw6IHJlZGlyZWN0X3VybCB9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZV9pZClcblx0XHRcdGlmIGNvbGxlY3Rpb25cblx0XHRcdFx0Y29sbGVjdGlvbi51cGRhdGUocmVjb3JkX2lkLCB7XG5cdFx0XHRcdFx0JHVuc2V0OiB7XG5cdFx0XHRcdFx0XHRcImluc3RhbmNlc1wiOiAxLFxuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZV9zdGF0ZVwiOiAxLFxuXHRcdFx0XHRcdFx0XCJsb2NrZWRcIjogMVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKVxuXG5cdGNhdGNoIGVcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XG5cdFx0fVxuXG4iLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL3dvcmtmbG93L3ZpZXcvOmluc3RhbmNlSWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYm94LCBjb2xsZWN0aW9uLCBjdXJyZW50X3VzZXJfaWQsIGN1cnJlbnRfdXNlcl9pbmZvLCBlLCBmbG93SWQsIGhhc2hEYXRhLCBpbnMsIGluc0lkLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbnMsIHJlY29yZF9pZCwgcmVkaXJlY3RfdXJsLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHNwYWNlLCBzcGFjZUlkLCBzcGFjZV9pZCwgd29ya2Zsb3dVcmwsIHhfYXV0aF90b2tlbiwgeF91c2VyX2lkO1xuICB0cnkge1xuICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgY3VycmVudF91c2VyX2lkID0gY3VycmVudF91c2VyX2luZm8uX2lkO1xuICAgIGhhc2hEYXRhID0gcmVxLmJvZHk7XG4gICAgb2JqZWN0X25hbWUgPSBoYXNoRGF0YS5vYmplY3RfbmFtZTtcbiAgICByZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWQ7XG4gICAgc3BhY2VfaWQgPSBoYXNoRGF0YS5zcGFjZV9pZDtcbiAgICBjaGVjayhvYmplY3RfbmFtZSwgU3RyaW5nKTtcbiAgICBjaGVjayhyZWNvcmRfaWQsIFN0cmluZyk7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgaW5zSWQgPSByZXEucGFyYW1zLmluc3RhbmNlSWQ7XG4gICAgeF91c2VyX2lkID0gcmVxLnF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICB4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddO1xuICAgIHJlZGlyZWN0X3VybCA9IFwiL1wiO1xuICAgIGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZCk7XG4gICAgaWYgKGlucykge1xuICAgICAgYm94ID0gJyc7XG4gICAgICBzcGFjZUlkID0gaW5zLnNwYWNlO1xuICAgICAgZmxvd0lkID0gaW5zLmZsb3c7XG4gICAgICBpZiAoKChyZWYgPSBpbnMuaW5ib3hfdXNlcnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkgfHwgKChyZWYxID0gaW5zLmNjX3VzZXJzKSAhPSBudWxsID8gcmVmMS5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSkge1xuICAgICAgICBib3ggPSAnaW5ib3gnO1xuICAgICAgfSBlbHNlIGlmICgocmVmMiA9IGlucy5vdXRib3hfdXNlcnMpICE9IG51bGwgPyByZWYyLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHtcbiAgICAgICAgYm94ID0gJ291dGJveCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2RyYWZ0JyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2RyYWZ0JztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAncGVuZGluZycgJiYgKGlucy5zdWJtaXR0ZXIgPT09IGN1cnJlbnRfdXNlcl9pZCB8fCBpbnMuYXBwbGljYW50ID09PSBjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgIGJveCA9ICdwZW5kaW5nJztcbiAgICAgIH0gZWxzZSBpZiAoaW5zLnN0YXRlID09PSAnY29tcGxldGVkJyAmJiBpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQpIHtcbiAgICAgICAgYm94ID0gJ2NvbXBsZXRlZCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25NYW5hZ2VyLmdldEZsb3dQZXJtaXNzaW9ucyhmbG93SWQsIGN1cnJlbnRfdXNlcl9pZCk7XG4gICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgYWRtaW5zOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgfHwgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJtb25pdG9yXCIpIHx8IHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpKSB7XG4gICAgICAgICAgYm94ID0gJ21vbml0b3InO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3b3JrZmxvd1VybCA9IChyZWYzID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjQgPSByZWYzLndvcmtmbG93KSAhPSBudWxsID8gcmVmNC51cmwgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoYm94KSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9cIiArIGJveCArIFwiL1wiICsgaW5zSWQgKyBcIj9YLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVkaXJlY3RfdXJsID0gKHdvcmtmbG93VXJsIHx8ICcnKSArIChcIndvcmtmbG93L3NwYWNlL1wiICsgc3BhY2VJZCArIFwiL3ByaW50L1wiICsgaW5zSWQgKyBcIj9ib3g9bW9uaXRvciZwcmludF9pc19zaG93X3RyYWNlcz0xJnByaW50X2lzX3Nob3dfYXR0YWNobWVudHM9MSZYLVVzZXItSWQ9XCIgKyB4X3VzZXJfaWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyB4X2F1dGhfdG9rZW4pO1xuICAgICAgfVxuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZWRpcmVjdF91cmw6IHJlZGlyZWN0X3VybFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpO1xuICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgY29sbGVjdGlvbi51cGRhdGUocmVjb3JkX2lkLCB7XG4gICAgICAgICAgJHVuc2V0OiB7XG4gICAgICAgICAgICBcImluc3RhbmNlc1wiOiAxLFxuICAgICAgICAgICAgXCJpbnN0YW5jZV9zdGF0ZVwiOiAxLFxuICAgICAgICAgICAgXCJsb2NrZWRcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yJywgJ+eUs+ivt+WNleW3suWIoOmZpCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSAob2JqZWN0X25hbWUsIGNvbHVtbnMpIC0+XG5cdF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSk/Ll9zY2hlbWFcblx0Y29sdW1uX251bSA9IDBcblx0aWYgX3NjaGVtYVxuXHRcdF8uZWFjaCBjb2x1bW5zLCAoZmllbGRfbmFtZSkgLT5cblx0XHRcdGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpXG5cdFx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXG5cdFx0XHRpZiBpc193aWRlXG5cdFx0XHRcdGNvbHVtbl9udW0gKz0gMlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDFcblxuXHRcdGluaXRfd2lkdGhfcGVyY2VudCA9IDEwMCAvIGNvbHVtbl9udW1cblx0XHRyZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50XG5cbkNyZWF0b3IuZ2V0RmllbGRJc1dpZGUgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIC0+XG5cdF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYVxuXHRpZiBfc2NoZW1hXG5cdFx0ZmllbGQgPSBfLnBpY2soX3NjaGVtYSwgZmllbGRfbmFtZSlcblx0XHRpc193aWRlID0gZmllbGRbZmllbGRfbmFtZV0/LmF1dG9mb3JtPy5pc193aWRlXG5cdFx0cmV0dXJuIGlzX3dpZGVcblxuQ3JlYXRvci5nZXRUYWJ1bGFyT3JkZXIgPSAob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykgLT5cblx0c2V0dGluZyA9IENyZWF0b3IuQ29sbGVjdGlvbnM/LnNldHRpbmdzPy5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHJlY29yZF9pZDogXCJvYmplY3RfbGlzdHZpZXdzXCJ9KVxuXHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IF8ubWFwIGNvbHVtbnMsIChjb2x1bW4pLT5cblx0XHRmaWVsZCA9IG9iai5maWVsZHNbY29sdW1uXVxuXHRcdGlmIGZpZWxkPy50eXBlIGFuZCAhZmllbGQuaGlkZGVuXG5cdFx0XHRyZXR1cm4gY29sdW1uXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRjb2x1bW5zID0gXy5jb21wYWN0IGNvbHVtbnNcblx0aWYgc2V0dGluZyBhbmQgc2V0dGluZy5zZXR0aW5nc1xuXHRcdHNvcnQgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0/LnNvcnQgfHwgW11cblx0XHRzb3J0ID0gXy5tYXAgc29ydCwgKG9yZGVyKS0+XG5cdFx0XHRrZXkgPSBvcmRlclswXVxuXHRcdFx0aW5kZXggPSBfLmluZGV4T2YoY29sdW1ucywga2V5KVxuXHRcdFx0b3JkZXJbMF0gPSBpbmRleCArIDFcblx0XHRcdHJldHVybiBvcmRlclxuXHRcdHJldHVybiBzb3J0XG5cdHJldHVybiBbXVxuXG5cbkNyZWF0b3IuaW5pdExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSktPlxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cblx0ZXh0cmFfY29sdW1ucyA9IFtcIm93bmVyXCJdXG5cdGRlZmF1bHRfZXh0cmFfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdEV4dHJhQ29sdW1ucyhvYmplY3RfbmFtZSkgfHwgW1wib3duZXJcIl1cblx0aWYgZGVmYXVsdF9leHRyYV9jb2x1bW5zXG5cdFx0ZXh0cmFfY29sdW1ucyA9IF8udW5pb24gZXh0cmFfY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zXG5cblx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkcz9bb2JqZWN0X25hbWVdID0gW11cblxuQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcgPSAoZGVmYXVsdF92aWV3LCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19uYW1lKS0+XG5cdGRlZmF1bHRfY29sdW1ucyA9IGRlZmF1bHRfdmlldz8uY29sdW1uc1xuXHRkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3Py5tb2JpbGVfY29sdW1uc1xuXHR1bmxlc3MgbGlzdF92aWV3XG5cdFx0cmV0dXJuXG5cdG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJuYW1lXCIpXG5cdFx0b2l0ZW0ubmFtZSA9IGxpc3Rfdmlld19uYW1lXG5cdGlmICFvaXRlbS5jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdF9jb2x1bW5zXG5cdFx0XHRvaXRlbS5jb2x1bW5zID0gZGVmYXVsdF9jb2x1bW5zXG5cdGlmICFvaXRlbS5jb2x1bW5zXG5cdFx0b2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl1cblx0aWYgIW9pdGVtLm1vYmlsZV9jb2x1bW5zXG5cdFx0aWYgZGVmYXVsdF9tb2JpbGVfY29sdW1uc1xuXHRcdFx0b2l0ZW0ubW9iaWxlX2NvbHVtbnMgPSBkZWZhdWx0X21vYmlsZV9jb2x1bW5zXG5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpICYmICFfLmluY2x1ZGUob2l0ZW0uY29sdW1ucywgJ3NwYWNlJylcblx0XHRcdG9pdGVtLmNvbHVtbnMucHVzaCgnc3BhY2UnKVxuXG5cblx0aWYgIW9pdGVtLmZpbHRlcl9zY29wZVxuXHRcdCMgbGlzdHZpZXfop4blm77nmoRmaWx0ZXJfc2NvcGXpu5jorqTlgLzmlLnkuLpzcGFjZSAjMTMxXG5cdFx0b2l0ZW0uZmlsdGVyX3Njb3BlID0gXCJzcGFjZVwiXG5cblx0aWYgIV8uaGFzKG9pdGVtLCBcIl9pZFwiKVxuXHRcdG9pdGVtLl9pZCA9IGxpc3Rfdmlld19uYW1lXG5cdGVsc2Vcblx0XHRvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lXG5cblx0aWYgXy5pc1N0cmluZyhvaXRlbS5vcHRpb25zKVxuXHRcdG9pdGVtLm9wdGlvbnMgPSBKU09OLnBhcnNlKG9pdGVtLm9wdGlvbnMpXG5cblx0Xy5mb3JFYWNoIG9pdGVtLmZpbHRlcnMsIChmaWx0ZXIsIF9pbmRleCktPlxuXHRcdGlmICFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcilcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcblx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcblx0cmV0dXJuIG9pdGVtXG5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdENyZWF0b3IuZ2V0UmVsYXRlZExpc3QgPSAob2JqZWN0X25hbWUpLT5cblx0XHR1bmxlc3Mgb2JqZWN0X25hbWVcblx0XHRcdHJldHVyblxuXHRcdHJlbGF0ZWRMaXN0T2JqZWN0cyA9IHt9XG5cdFx0cmVsYXRlZExpc3ROYW1lcyA9IFtdXG5cdFx0b2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzID0gW107XG5cdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmIF9vYmplY3Rcblx0XHRcdGxheW91dFJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkX2xpc3RzO1xuXHRcdFx0IyBsYXlvdXRSZWxhdGVkTGlzdCDmmK/mlbDnu4TlsLHooajnpLrphY3nva7ov4fpobXpnaLluIPlsYDvvIzlsLHlkK/nlKjpobXpnaLluIPlsYDnmoTnm7jlhbPlrZDooajjgIJcblx0XHRcdGlmIF8uaXNBcnJheSBsYXlvdXRSZWxhdGVkTGlzdFxuXHRcdFx0XHRfLmVhY2ggbGF5b3V0UmVsYXRlZExpc3QsIChpdGVtKS0+XG5cdFx0XHRcdFx0cmVPYmplY3ROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMF1cblx0XHRcdFx0XHRyZUZpZWxkTmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzFdXG5cdFx0XHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSBDcmVhdG9yLmdldE9iamVjdChyZU9iamVjdE5hbWUpPy5maWVsZHNbcmVGaWVsZE5hbWVdPy53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXHRcdFx0XHRcdHJlbGF0ZWQgPVxuXHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IHJlT2JqZWN0TmFtZVxuXHRcdFx0XHRcdFx0Y29sdW1uczogaXRlbS5maWVsZF9uYW1lc1xuXHRcdFx0XHRcdFx0bW9iaWxlX2NvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXNcblx0XHRcdFx0XHRcdGlzX2ZpbGU6IHJlT2JqZWN0TmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb246IGl0ZW0uZmlsdGVyc1xuXHRcdFx0XHRcdFx0c29ydDogaXRlbS5zb3J0XG5cdFx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6IHJlRmllbGROYW1lXG5cdFx0XHRcdFx0XHRjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZVxuXHRcdFx0XHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cdFx0XHRcdFx0XHRsYWJlbDogaXRlbS5sYWJlbFxuXHRcdFx0XHRcdFx0YWN0aW9uczogaXRlbS5idXR0b25zXG5cdFx0XHRcdFx0XHR2aXNpYmxlX29uOiBpdGVtLnZpc2libGVfb25cblx0XHRcdFx0XHRcdHBhZ2Vfc2l6ZTogaXRlbS5wYWdlX3NpemVcblx0XHRcdFx0XHRvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMucHVzaChyZWxhdGVkKVxuXHRcdFx0XHRyZXR1cm4gb2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzO1xuXHRcdFx0cmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0XG5cdFx0XHRpZiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XG5cdFx0XHRcdF8uZWFjaCByZWxhdGVkTGlzdCwgKG9iak9yTmFtZSktPlxuXHRcdFx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqT3JOYW1lXG5cdFx0XHRcdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0XHRcdFx0b2JqZWN0X25hbWU6IG9iak9yTmFtZS5vYmplY3ROYW1lXG5cdFx0XHRcdFx0XHRcdGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zXG5cdFx0XHRcdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBvYmpPck5hbWUubW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0XHRcdFx0aXNfZmlsZTogb2JqT3JOYW1lLm9iamVjdE5hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHRcdFx0XHRmaWx0ZXJzRnVuY3Rpb246IG9iak9yTmFtZS5maWx0ZXJzXG5cdFx0XHRcdFx0XHRcdHNvcnQ6IG9iak9yTmFtZS5zb3J0XG5cdFx0XHRcdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZTogJydcblx0XHRcdFx0XHRcdFx0Y3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWVcblx0XHRcdFx0XHRcdFx0bGFiZWw6IG9iak9yTmFtZS5sYWJlbFxuXHRcdFx0XHRcdFx0XHRhY3Rpb25zOiBvYmpPck5hbWUuYWN0aW9uc1xuXHRcdFx0XHRcdFx0XHRwYWdlX3NpemU6IG9iak9yTmFtZS5wYWdlX3NpemVcblx0XHRcdFx0XHRcdHJlbGF0ZWRMaXN0T2JqZWN0c1tvYmpPck5hbWUub2JqZWN0TmFtZV0gPSByZWxhdGVkXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE5hbWVzLnB1c2ggb2JqT3JOYW1lLm9iamVjdE5hbWVcblx0XHRcdFx0XHRlbHNlIGlmIF8uaXNTdHJpbmcgb2JqT3JOYW1lXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE5hbWVzLnB1c2ggb2JqT3JOYW1lXG5cblx0XHRtYXBMaXN0ID0ge31cblx0XHRyZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKVxuXHRcdF8uZWFjaCByZWxhdGVkX29iamVjdHMsIChyZWxhdGVkX29iamVjdF9pdGVtKSAtPlxuXHRcdFx0aWYgIXJlbGF0ZWRfb2JqZWN0X2l0ZW0/Lm9iamVjdF9uYW1lXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0cmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWVcblx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0uZm9yZWlnbl9rZXlcblx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZF9vYmplY3RfaXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXHRcdFx0cmVsYXRlZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKVxuXHRcdFx0dW5sZXNzIHJlbGF0ZWRfb2JqZWN0XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0Y29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXVxuXHRcdFx0Y29sdW1ucyA9IF8ud2l0aG91dChjb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpXG5cdFx0XHRtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXVxuXHRcdFx0bW9iaWxlX2NvbHVtbnMgPSBfLndpdGhvdXQobW9iaWxlX2NvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSlcblxuXHRcdFx0b3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0XHR0YWJ1bGFyX29yZGVyID0gQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyKG9yZGVyLCBjb2x1bW5zKVxuXG5cdFx0XHRpZiAvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSlcblx0XHRcdFx0IyBvYmplY3TnsbvlnovluKblrZDlsZ7mgKfnmoRyZWxhdGVkX2ZpZWxkX25hbWXopoHljrvmjonkuK3pl7TnmoTnvo7lhYPnrKblj7fvvIzlkKbliJnmmL7npLrkuI3lh7rlrZfmrrXlgLxcblx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9maWVsZF9uYW1lLnJlcGxhY2UoL1xcJFxcLi8sXCJcIilcblx0XHRcdHJlbGF0ZWQgPVxuXHRcdFx0XHRvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZVxuXHRcdFx0XHRjb2x1bW5zOiBjb2x1bW5zXG5cdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBtb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6IHJlbGF0ZWRfZmllbGRfbmFtZVxuXHRcdFx0XHRpc19maWxlOiByZWxhdGVkX29iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdFx0d3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkXG5cblx0XHRcdHJlbGF0ZWRPYmplY3QgPSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV1cblx0XHRcdGlmIHJlbGF0ZWRPYmplY3Rcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5jb2x1bW5zXG5cdFx0XHRcdFx0cmVsYXRlZC5jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5jb2x1bW5zXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0XHRyZWxhdGVkLm1vYmlsZV9jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1uc1xuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LnNvcnRcblx0XHRcdFx0XHRyZWxhdGVkLnNvcnQgPSByZWxhdGVkT2JqZWN0LnNvcnRcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb25cblx0XHRcdFx0XHRyZWxhdGVkLmZpbHRlcnNGdW5jdGlvbiA9IHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Rcblx0XHRcdFx0XHRyZWxhdGVkLmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0ID0gcmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdFxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmxhYmVsXG5cdFx0XHRcdFx0cmVsYXRlZC5sYWJlbCA9IHJlbGF0ZWRPYmplY3QubGFiZWxcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5wYWdlX3NpemVcblx0XHRcdFx0XHRyZWxhdGVkLnBhZ2Vfc2l6ZSA9IHJlbGF0ZWRPYmplY3QucGFnZV9zaXplXG5cdFx0XHRcdGRlbGV0ZSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV1cblxuXHRcdFx0bWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWRcblxuXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfLnZhbHVlcyhyZWxhdGVkTGlzdE9iamVjdHMpLCBcIm9iamVjdF9uYW1lXCIpXG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdFx0dW5yZWxhdGVkX29iamVjdHMgPSBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlIHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0c1xuXHRcdF8uZWFjaCByZWxhdGVkTGlzdE9iamVjdHMsICh2LCByZWxhdGVkX29iamVjdF9uYW1lKSAtPlxuXHRcdFx0aXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTFcblx0XHRcdGFsbG93UmVhZCA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKT8uYWxsb3dSZWFkXG5cdFx0XHRpZiBpc0FjdGl2ZSAmJiBhbGxvd1JlYWRcblx0XHRcdFx0bWFwTGlzdFtyZWxhdGVkX29iamVjdF9uYW1lXSA9IHZcblxuXHRcdGxpc3QgPSBbXVxuXHRcdGlmIF8uaXNFbXB0eSByZWxhdGVkTGlzdE5hbWVzXG5cdFx0XHRsaXN0ID0gIF8udmFsdWVzIG1hcExpc3Rcblx0XHRlbHNlXG5cdFx0XHRfLmVhY2ggcmVsYXRlZExpc3ROYW1lcywgKG9iamVjdE5hbWUpIC0+XG5cdFx0XHRcdGlmIG1hcExpc3Rbb2JqZWN0TmFtZV1cblx0XHRcdFx0XHRsaXN0LnB1c2ggbWFwTGlzdFtvYmplY3ROYW1lXVxuXG5cdFx0aWYgXy5oYXMoX29iamVjdCwgJ2FsbG93X3JlbGF0ZWRMaXN0Jylcblx0XHRcdGxpc3QgPSBfLmZpbHRlciBsaXN0LCAoaXRlbSktPlxuXHRcdFx0XHRyZXR1cm4gXy5pbmNsdWRlKF9vYmplY3QuYWxsb3dfcmVsYXRlZExpc3QsIGl0ZW0ub2JqZWN0X25hbWUpXG5cblx0XHRyZXR1cm4gbGlzdFxuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXcgPSAob2JqZWN0X25hbWUpLT5cblx0cmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKVxuXG4jIyMgXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxuXHRleGFj5Li6dHJ1ZeaXtu+8jOmcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOS4jem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvlxuIyMjXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGV4YWMpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhbGlzdF92aWV3X2lkXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0aWYgIW9iamVjdFxuXHRcdHJldHVyblxuXHRsaXN0Vmlld3MgPSBDcmVhdG9yLmdldExpc3RWaWV3cyhvYmplY3RfbmFtZSlcblx0dW5sZXNzIGxpc3RWaWV3cz8ubGVuZ3RoXG5cdFx0cmV0dXJuXG5cdGxpc3RfdmlldyA9IF8uZmluZChsaXN0Vmlld3MsIChpdGVtKS0+IHJldHVybiBpdGVtLl9pZCA9PSBsaXN0X3ZpZXdfaWQgfHwgaXRlbS5uYW1lID09IGxpc3Rfdmlld19pZClcblx0dW5sZXNzIGxpc3Rfdmlld1xuXHRcdCMg5aaC5p6c5LiN6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5YiZ6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+77yM5Y+N5LmL6L+U5Zue56m6XG5cdFx0aWYgZXhhY1xuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0bGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdXG5cdHJldHVybiBsaXN0X3ZpZXdcblxuI+iOt+WPlmxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvuaYr+WQpuaYr+acgOi/keafpeeci+inhuWbvlxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhbGlzdF92aWV3X2lkXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRpZiB0eXBlb2YobGlzdF92aWV3X2lkKSA9PSBcInN0cmluZ1wiXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgIW9iamVjdFxuXHRcdFx0cmV0dXJuXG5cdFx0bGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cyx7X2lkOiBsaXN0X3ZpZXdfaWR9KVxuXHRlbHNlXG5cdFx0bGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWRcblx0cmV0dXJuIGxpc3RWaWV3Py5uYW1lID09IFwicmVjZW50XCJcblxuXG4jIyNcbiAgICDku45jb2x1bW5z5Y+C5pWw5Lit6L+H5ruk5Ye655So5LqO5omL5py656uv5pi+56S655qEY29sdW1uc1xuXHTop4TliJnvvJpcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxuXHQyLuacgOWkmuWPqui/lOWbnjTkuKrlrZfmrrVcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcbiMjI1xuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IChvYmplY3RfbmFtZSwgY29sdW1ucyktPlxuXHRyZXN1bHQgPSBbXVxuXHRtYXhSb3dzID0gMiBcblx0bWF4Q291bnQgPSBtYXhSb3dzICogMlxuXHRjb3VudCA9IDBcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IG9iamVjdC5maWVsZHNcblx0dW5sZXNzIG9iamVjdFxuXHRcdHJldHVybiBjb2x1bW5zXG5cdG5hbWVLZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcblx0aXNOYW1lQ29sdW1uID0gKGl0ZW0pLT5cblx0XHRpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHRyZXR1cm4gaXRlbS5maWVsZCA9PSBuYW1lS2V5XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGl0ZW0gPT0gbmFtZUtleVxuXHRnZXRGaWVsZCA9IChpdGVtKS0+XG5cdFx0aWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0cmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmaWVsZHNbaXRlbV1cblx0aWYgbmFtZUtleVxuXHRcdG5hbWVDb2x1bW4gPSBjb2x1bW5zLmZpbmQgKGl0ZW0pLT5cblx0XHRcdHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSlcblx0aWYgbmFtZUNvbHVtblxuXHRcdGZpZWxkID0gZ2V0RmllbGQobmFtZUNvbHVtbilcblx0XHRpdGVtQ291bnQgPSBpZiBmaWVsZC5pc193aWRlIHRoZW4gMiBlbHNlIDFcblx0XHRjb3VudCArPSBpdGVtQ291bnRcblx0XHRyZXN1bHQucHVzaCBuYW1lQ29sdW1uXG5cdGNvbHVtbnMuZm9yRWFjaCAoaXRlbSktPlxuXHRcdGZpZWxkID0gZ2V0RmllbGQoaXRlbSlcblx0XHR1bmxlc3MgZmllbGRcblx0XHRcdHJldHVyblxuXHRcdGl0ZW1Db3VudCA9IGlmIGZpZWxkLmlzX3dpZGUgdGhlbiAyIGVsc2UgMVxuXHRcdGlmIGNvdW50IDwgbWF4Q291bnQgYW5kIHJlc3VsdC5sZW5ndGggPCBtYXhDb3VudCBhbmQgIWlzTmFtZUNvbHVtbihpdGVtKVxuXHRcdFx0Y291bnQgKz0gaXRlbUNvdW50XG5cdFx0XHRpZiBjb3VudCA8PSBtYXhDb3VudFxuXHRcdFx0XHRyZXN1bHQucHVzaCBpdGVtXG5cdFxuXHRyZXR1cm4gcmVzdWx0XG5cbiMjI1xuICAgIOiOt+WPlum7mOiupOinhuWbvlxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gKG9iamVjdF9uYW1lKS0+XG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRpZiBvYmplY3Q/Lmxpc3Rfdmlld3M/LmRlZmF1bHRcblx0XHQjVE9ETyDmraTku6PnoIHlj6rmmK/mmoLml7blhbzlrrnku6XliY1jb2Rl5Lit5a6a5LmJ55qEZGVmYXVsdOinhuWbvu+8jOW+hWNvZGXkuK3nmoRkZWZhdWx05riF55CG5a6M5oiQ5ZCO77yM6ZyA6KaB5Yig6Zmk5q2k5Luj56CBXG5cdFx0ZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3cy5kZWZhdWx0XG5cdGVsc2Vcblx0XHRfLmVhY2ggb2JqZWN0Py5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpLT5cblx0XHRcdGlmIGxpc3Rfdmlldy5uYW1lID09IFwiYWxsXCIgfHwga2V5ID09IFwiYWxsXCJcblx0XHRcdFx0ZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXdcblx0cmV0dXJuIGRlZmF1bHRWaWV3O1xuXG4jIyNcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IChvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Py5jb2x1bW5zXG5cdGlmIHVzZV9tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRWaWV3Py5tb2JpbGVfY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zXG5cdFx0ZWxzZSBpZiBjb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucylcblx0cmV0dXJuIGNvbHVtbnNcblxuIyMjXG4gICAg6I635Y+W5a+56LGh55qE5YiX6KGo56ys5LiA5Liq6KeG5Zu+5pi+56S655qE5a2X5q61XG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMgPSAob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucyktPlxuXHRkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyhvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Py5jb2x1bW5zXG5cdGlmIHVzZV9tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRWaWV3Py5tb2JpbGVfY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zXG5cdFx0ZWxzZSBpZiBjb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucylcblx0cmV0dXJuIGNvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSAob2JqZWN0X25hbWUpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmV4dHJhX2NvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0aWYgZGVmYXVsdFZpZXdcblx0XHRpZiBkZWZhdWx0Vmlldy5zb3J0XG5cdFx0XHRyZXR1cm4gZGVmYXVsdFZpZXcuc29ydFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dXG5cblxuIyMjXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcbiMjI1xuQ3JlYXRvci5pc0FsbFZpZXcgPSAobGlzdF92aWV3KS0+XG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJhbGxcIlxuXG4jIyNcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuIyMjXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IChsaXN0X3ZpZXcpLT5cblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcInJlY2VudFwiXG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IChzb3J0LCB0YWJ1bGFyQ29sdW1ucyktPlxuXHR0YWJ1bGFyX3NvcnQgPSBbXVxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcblx0XHRcdCMg5YW85a655pen55qE5pWw5o2u5qC85byPW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGlmIGl0ZW0ubGVuZ3RoID09IDFcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdXG5cdFx0XHRlbHNlIGlmIGl0ZW0ubGVuZ3RoID09IDJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBvcmRlcl1cblxuXHRyZXR1cm4gdGFidWxhcl9zb3J0XG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSAoc29ydCktPlxuXHRkeF9zb3J0ID0gW11cblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXG5cdFx0XHQj5YW85a655pen5qC85byP77yaW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGR4X3NvcnQucHVzaChpdGVtKVxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxuXHRcdFx0XHRkeF9zb3J0LnB1c2ggW2ZpZWxkX25hbWUsIG9yZGVyXVxuXG5cdHJldHVybiBkeF9zb3J0XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgY29sdW1ucykge1xuICB2YXIgX3NjaGVtYSwgY29sdW1uX251bSwgaW5pdF93aWR0aF9wZXJjZW50LCByZWY7XG4gIF9zY2hlbWEgPSAocmVmID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLl9zY2hlbWEgOiB2b2lkIDA7XG4gIGNvbHVtbl9udW0gPSAwO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgICB2YXIgZmllbGQsIGlzX3dpZGUsIHJlZjEsIHJlZjI7XG4gICAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICAgIGlzX3dpZGUgPSAocmVmMSA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMi5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGlzX3dpZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bTtcbiAgICByZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50O1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIHtcbiAgdmFyIF9zY2hlbWEsIGZpZWxkLCBpc193aWRlLCByZWYsIHJlZjE7XG4gIF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYTtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICBpc193aWRlID0gKHJlZiA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgcmV0dXJuIGlzX3dpZGU7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykge1xuICB2YXIgb2JqLCByZWYsIHJlZjEsIHJlZjIsIHNldHRpbmcsIHNvcnQ7XG4gIHNldHRpbmcgPSAocmVmID0gQ3JlYXRvci5Db2xsZWN0aW9ucykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnNldHRpbmdzKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gXy5tYXAoY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgdmFyIGZpZWxkO1xuICAgIGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dO1xuICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnR5cGUgOiB2b2lkIDApICYmICFmaWVsZC5oaWRkZW4pIHtcbiAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICB9KTtcbiAgY29sdW1ucyA9IF8uY29tcGFjdChjb2x1bW5zKTtcbiAgaWYgKHNldHRpbmcgJiYgc2V0dGluZy5zZXR0aW5ncykge1xuICAgIHNvcnQgPSAoKHJlZjIgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0pICE9IG51bGwgPyByZWYyLnNvcnQgOiB2b2lkIDApIHx8IFtdO1xuICAgIHNvcnQgPSBfLm1hcChzb3J0LCBmdW5jdGlvbihvcmRlcikge1xuICAgICAgdmFyIGluZGV4LCBrZXk7XG4gICAgICBrZXkgPSBvcmRlclswXTtcbiAgICAgIGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSk7XG4gICAgICBvcmRlclswXSA9IGluZGV4ICsgMTtcbiAgICAgIHJldHVybiBvcmRlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gc29ydDtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zLCBleHRyYV9jb2x1bW5zLCBvYmplY3QsIG9yZGVyLCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gIGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXTtcbiAgZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXTtcbiAgaWYgKGRlZmF1bHRfZXh0cmFfY29sdW1ucykge1xuICAgIGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uKGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucyk7XG4gIH1cbiAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiAocmVmID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHMpICE9IG51bGwgPyByZWZbb2JqZWN0X25hbWVdID0gW10gOiB2b2lkIDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gZnVuY3Rpb24oZGVmYXVsdF92aWV3LCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19uYW1lKSB7XG4gIHZhciBkZWZhdWx0X2NvbHVtbnMsIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMsIG9pdGVtO1xuICBkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcgIT0gbnVsbCA/IGRlZmF1bHRfdmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3ICE9IG51bGwgPyBkZWZhdWx0X3ZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICghbGlzdF92aWV3KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpO1xuICBpZiAoIV8uaGFzKG9pdGVtLCBcIm5hbWVcIikpIHtcbiAgICBvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWU7XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfY29sdW1ucykge1xuICAgICAgb2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1ucztcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgb2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl07XG4gIH1cbiAgaWYgKCFvaXRlbS5tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X21vYmlsZV9jb2x1bW5zKSB7XG4gICAgICBvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpICYmICFfLmluY2x1ZGUob2l0ZW0uY29sdW1ucywgJ3NwYWNlJykpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMucHVzaCgnc3BhY2UnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5maWx0ZXJfc2NvcGUpIHtcbiAgICBvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCI7XG4gIH1cbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJfaWRcIikpIHtcbiAgICBvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZTtcbiAgfSBlbHNlIHtcbiAgICBvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lO1xuICB9XG4gIGlmIChfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpKSB7XG4gICAgb2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucyk7XG4gIH1cbiAgXy5mb3JFYWNoKG9pdGVtLmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgaWYgKCFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5fdmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvaXRlbTtcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF9vYmplY3QsIGxheW91dFJlbGF0ZWRMaXN0LCBsaXN0LCBtYXBMaXN0LCBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMsIHBlcm1pc3Npb25zLCByZWxhdGVkTGlzdCwgcmVsYXRlZExpc3ROYW1lcywgcmVsYXRlZExpc3RPYmplY3RzLCByZWxhdGVkX29iamVjdF9uYW1lcywgcmVsYXRlZF9vYmplY3RzLCBzcGFjZUlkLCB1bnJlbGF0ZWRfb2JqZWN0cywgdXNlcklkO1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVsYXRlZExpc3RPYmplY3RzID0ge307XG4gICAgcmVsYXRlZExpc3ROYW1lcyA9IFtdO1xuICAgIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyA9IFtdO1xuICAgIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKF9vYmplY3QpIHtcbiAgICAgIGxheW91dFJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkX2xpc3RzO1xuICAgICAgaWYgKF8uaXNBcnJheShsYXlvdXRSZWxhdGVkTGlzdCkpIHtcbiAgICAgICAgXy5lYWNoKGxheW91dFJlbGF0ZWRMaXN0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIHJlRmllbGROYW1lLCByZU9iamVjdE5hbWUsIHJlZiwgcmVmMSwgcmVsYXRlZCwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgICAgICAgcmVPYmplY3ROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgcmVGaWVsZE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IChyZWYgPSBDcmVhdG9yLmdldE9iamVjdChyZU9iamVjdE5hbWUpKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZmllbGRzW3JlRmllbGROYW1lXSkgIT0gbnVsbCA/IHJlZjEud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgICAgIG9iamVjdF9uYW1lOiByZU9iamVjdE5hbWUsXG4gICAgICAgICAgICBjb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzLFxuICAgICAgICAgICAgbW9iaWxlX2NvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXMsXG4gICAgICAgICAgICBpc19maWxlOiByZU9iamVjdE5hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgICAgICBmaWx0ZXJzRnVuY3Rpb246IGl0ZW0uZmlsdGVycyxcbiAgICAgICAgICAgIHNvcnQ6IGl0ZW0uc29ydCxcbiAgICAgICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogcmVGaWVsZE5hbWUsXG4gICAgICAgICAgICBjdXN0b21SZWxhdGVkTGlzdE9iamVjdDogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCxcbiAgICAgICAgICAgIGxhYmVsOiBpdGVtLmxhYmVsLFxuICAgICAgICAgICAgYWN0aW9uczogaXRlbS5idXR0b25zLFxuICAgICAgICAgICAgdmlzaWJsZV9vbjogaXRlbS52aXNpYmxlX29uLFxuICAgICAgICAgICAgcGFnZV9zaXplOiBpdGVtLnBhZ2Vfc2l6ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cy5wdXNoKHJlbGF0ZWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cztcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdDtcbiAgICAgIGlmICghXy5pc0VtcHR5KHJlbGF0ZWRMaXN0KSkge1xuICAgICAgICBfLmVhY2gocmVsYXRlZExpc3QsIGZ1bmN0aW9uKG9iak9yTmFtZSkge1xuICAgICAgICAgIHZhciByZWxhdGVkO1xuICAgICAgICAgIGlmIChfLmlzT2JqZWN0KG9iak9yTmFtZSkpIHtcbiAgICAgICAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmpPck5hbWUub2JqZWN0TmFtZSxcbiAgICAgICAgICAgICAgY29sdW1uczogb2JqT3JOYW1lLmNvbHVtbnMsXG4gICAgICAgICAgICAgIG1vYmlsZV9jb2x1bW5zOiBvYmpPck5hbWUubW9iaWxlX2NvbHVtbnMsXG4gICAgICAgICAgICAgIGlzX2ZpbGU6IG9iak9yTmFtZS5vYmplY3ROYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICAgICAgICBmaWx0ZXJzRnVuY3Rpb246IG9iak9yTmFtZS5maWx0ZXJzLFxuICAgICAgICAgICAgICBzb3J0OiBvYmpPck5hbWUuc29ydCxcbiAgICAgICAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiAnJyxcbiAgICAgICAgICAgICAgY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWUsXG4gICAgICAgICAgICAgIGxhYmVsOiBvYmpPck5hbWUubGFiZWwsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IG9iak9yTmFtZS5hY3Rpb25zLFxuICAgICAgICAgICAgICBwYWdlX3NpemU6IG9iak9yTmFtZS5wYWdlX3NpemVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZWxhdGVkTGlzdE9iamVjdHNbb2JqT3JOYW1lLm9iamVjdE5hbWVdID0gcmVsYXRlZDtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkTGlzdE5hbWVzLnB1c2gob2JqT3JOYW1lLm9iamVjdE5hbWUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhvYmpPck5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3ROYW1lcy5wdXNoKG9iak9yTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgbWFwTGlzdCA9IHt9O1xuICAgIHJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0UmVsYXRlZE9iamVjdHMob2JqZWN0X25hbWUpO1xuICAgIF8uZWFjaChyZWxhdGVkX29iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0X2l0ZW0pIHtcbiAgICAgIHZhciBjb2x1bW5zLCBtb2JpbGVfY29sdW1ucywgb3JkZXIsIHJlbGF0ZWQsIHJlbGF0ZWRPYmplY3QsIHJlbGF0ZWRfZmllbGRfbmFtZSwgcmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRhYnVsYXJfb3JkZXIsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgICAgaWYgKCEocmVsYXRlZF9vYmplY3RfaXRlbSAhPSBudWxsID8gcmVsYXRlZF9vYmplY3RfaXRlbS5vYmplY3RfbmFtZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVsYXRlZF9vYmplY3RfbmFtZSA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWU7XG4gICAgICByZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5O1xuICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkX29iamVjdF9pdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgICAgcmVsYXRlZF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChyZWxhdGVkX29iamVjdF9uYW1lKTtcbiAgICAgIGlmICghcmVsYXRlZF9vYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0Vmlld0NvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSkgfHwgW1wibmFtZVwiXTtcbiAgICAgIGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKTtcbiAgICAgIG1vYmlsZV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3Q29sdW1ucyhyZWxhdGVkX29iamVjdF9uYW1lLCB0cnVlKSB8fCBbXCJuYW1lXCJdO1xuICAgICAgbW9iaWxlX2NvbHVtbnMgPSBfLndpdGhvdXQobW9iaWxlX2NvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gICAgICBvcmRlciA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICB0YWJ1bGFyX29yZGVyID0gQ3JlYXRvci50cmFuc2Zvcm1Tb3J0VG9UYWJ1bGFyKG9yZGVyLCBjb2x1bW5zKTtcbiAgICAgIGlmICgvXFx3K1xcLlxcJFxcLlxcdysvZy50ZXN0KHJlbGF0ZWRfZmllbGRfbmFtZSkpIHtcbiAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9maWVsZF9uYW1lLnJlcGxhY2UoL1xcJFxcLi8sIFwiXCIpO1xuICAgICAgfVxuICAgICAgcmVsYXRlZCA9IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgIG1vYmlsZV9jb2x1bW5zOiBtb2JpbGVfY29sdW1ucyxcbiAgICAgICAgcmVsYXRlZF9maWVsZF9uYW1lOiByZWxhdGVkX2ZpZWxkX25hbWUsXG4gICAgICAgIGlzX2ZpbGU6IHJlbGF0ZWRfb2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIsXG4gICAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuICAgICAgfTtcbiAgICAgIHJlbGF0ZWRPYmplY3QgPSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgICBpZiAocmVsYXRlZE9iamVjdCkge1xuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5jb2x1bW5zKSB7XG4gICAgICAgICAgcmVsYXRlZC5jb2x1bW5zID0gcmVsYXRlZE9iamVjdC5jb2x1bW5zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zKSB7XG4gICAgICAgICAgcmVsYXRlZC5tb2JpbGVfY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3Quc29ydCkge1xuICAgICAgICAgIHJlbGF0ZWQuc29ydCA9IHJlbGF0ZWRPYmplY3Quc29ydDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5maWx0ZXJzRnVuY3Rpb24pIHtcbiAgICAgICAgICByZWxhdGVkLmZpbHRlcnNGdW5jdGlvbiA9IHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0KSB7XG4gICAgICAgICAgcmVsYXRlZC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCA9IHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QubGFiZWwpIHtcbiAgICAgICAgICByZWxhdGVkLmxhYmVsID0gcmVsYXRlZE9iamVjdC5sYWJlbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5wYWdlX3NpemUpIHtcbiAgICAgICAgICByZWxhdGVkLnBhZ2Vfc2l6ZSA9IHJlbGF0ZWRPYmplY3QucGFnZV9zaXplO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSByZWxhdGVkTGlzdE9iamVjdHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwTGlzdFtyZWxhdGVkLm9iamVjdF9uYW1lXSA9IHJlbGF0ZWQ7XG4gICAgfSk7XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLnBsdWNrKF8udmFsdWVzKHJlbGF0ZWRMaXN0T2JqZWN0cyksIFwib2JqZWN0X25hbWVcIik7XG4gICAgcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpO1xuICAgIHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHM7XG4gICAgcmVsYXRlZF9vYmplY3RfbmFtZXMgPSBfLmRpZmZlcmVuY2UocmVsYXRlZF9vYmplY3RfbmFtZXMsIHVucmVsYXRlZF9vYmplY3RzKTtcbiAgICBfLmVhY2gocmVsYXRlZExpc3RPYmplY3RzLCBmdW5jdGlvbih2LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgICB2YXIgYWxsb3dSZWFkLCBpc0FjdGl2ZSwgcmVmO1xuICAgICAgaXNBY3RpdmUgPSByZWxhdGVkX29iamVjdF9uYW1lcy5pbmRleE9mKHJlbGF0ZWRfb2JqZWN0X25hbWUpID4gLTE7XG4gICAgICBhbGxvd1JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkX29iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKSAhPSBudWxsID8gcmVmLmFsbG93UmVhZCA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0FjdGl2ZSAmJiBhbGxvd1JlYWQpIHtcbiAgICAgICAgcmV0dXJuIG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxpc3QgPSBbXTtcbiAgICBpZiAoXy5pc0VtcHR5KHJlbGF0ZWRMaXN0TmFtZXMpKSB7XG4gICAgICBsaXN0ID0gXy52YWx1ZXMobWFwTGlzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChyZWxhdGVkTGlzdE5hbWVzLCBmdW5jdGlvbihvYmplY3ROYW1lKSB7XG4gICAgICAgIGlmIChtYXBMaXN0W29iamVjdE5hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3QucHVzaChtYXBMaXN0W29iamVjdE5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChfLmhhcyhfb2JqZWN0LCAnYWxsb3dfcmVsYXRlZExpc3QnKSkge1xuICAgICAgbGlzdCA9IF8uZmlsdGVyKGxpc3QsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdDtcbiAgfTtcbn1cblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIF8uZmlyc3QoQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpKTtcbn07XG5cblxuLyogXG5cdOWPluWHumxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvu+8jOWmguaenOS4jeWtmOWcqOaIluiAheayoeacieadg+mZkO+8jOWwsei/lOWbnuesrOS4gOS4quinhuWbvlxuXHRleGFj5Li6dHJ1ZeaXtu+8jOmcgOimgeW8uuWItuaMiWxpc3Rfdmlld19pZOeyvuehruafpeaJvu+8jOS4jem7mOiupOi/lOWbnuesrOS4gOS4quinhuWbvlxuICovXG5cbkNyZWF0b3IuZ2V0TGlzdFZpZXcgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKSB7XG4gIHZhciBsaXN0Vmlld3MsIGxpc3Rfdmlldywgb2JqZWN0O1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgfVxuICB9XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpO1xuICBpZiAoIShsaXN0Vmlld3MgIT0gbnVsbCA/IGxpc3RWaWV3cy5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RfdmlldyA9IF8uZmluZChsaXN0Vmlld3MsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5faWQgPT09IGxpc3Rfdmlld19pZCB8fCBpdGVtLm5hbWUgPT09IGxpc3Rfdmlld19pZDtcbiAgfSk7XG4gIGlmICghbGlzdF92aWV3KSB7XG4gICAgaWYgKGV4YWMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbGlzdF92aWV3O1xufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCkge1xuICB2YXIgbGlzdFZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIGxpc3Rfdmlld19pZCA9PT0gXCJzdHJpbmdcIikge1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLCB7XG4gICAgICBfaWQ6IGxpc3Rfdmlld19pZFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkO1xuICB9XG4gIHJldHVybiAobGlzdFZpZXcgIT0gbnVsbCA/IGxpc3RWaWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOS7jmNvbHVtbnPlj4LmlbDkuK3ov4fmu6Tlh7rnlKjkuo7miYvmnLrnq6/mmL7npLrnmoRjb2x1bW5zXG5cdOinhOWIme+8mlxuXHQxLuS8mOWFiOaKimNvbHVtbnPkuK3nmoRuYW1l5a2X5q615o6S5Zyo56ys5LiA5LiqXG5cdDIu5pyA5aSa5Y+q6L+U5ZueNOS4quWtl+autVxuXHQzLuiAg+iZkeWuveWtl+auteWNoOeUqOaVtOihjOinhOWImeadoeS7tuS4i++8jOacgOWkmuWPqui/lOWbnuS4pOihjFxuICovXG5cbkNyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgY29sdW1ucykge1xuICB2YXIgY291bnQsIGZpZWxkLCBmaWVsZHMsIGdldEZpZWxkLCBpc05hbWVDb2x1bW4sIGl0ZW1Db3VudCwgbWF4Q291bnQsIG1heFJvd3MsIG5hbWVDb2x1bW4sIG5hbWVLZXksIG9iamVjdCwgcmVzdWx0O1xuICByZXN1bHQgPSBbXTtcbiAgbWF4Um93cyA9IDI7XG4gIG1heENvdW50ID0gbWF4Um93cyAqIDI7XG4gIGNvdW50ID0gMDtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBvYmplY3QuZmllbGRzO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBjb2x1bW5zO1xuICB9XG4gIG5hbWVLZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gIGlzTmFtZUNvbHVtbiA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgcmV0dXJuIGl0ZW0uZmllbGQgPT09IG5hbWVLZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpdGVtID09PSBuYW1lS2V5O1xuICAgIH1cbiAgfTtcbiAgZ2V0RmllbGQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHJldHVybiBmaWVsZHNbaXRlbS5maWVsZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZHNbaXRlbV07XG4gICAgfVxuICB9O1xuICBpZiAobmFtZUtleSkge1xuICAgIG5hbWVDb2x1bW4gPSBjb2x1bW5zLmZpbmQoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIGlzTmFtZUNvbHVtbihpdGVtKTtcbiAgICB9KTtcbiAgfVxuICBpZiAobmFtZUNvbHVtbikge1xuICAgIGZpZWxkID0gZ2V0RmllbGQobmFtZUNvbHVtbik7XG4gICAgaXRlbUNvdW50ID0gZmllbGQuaXNfd2lkZSA/IDIgOiAxO1xuICAgIGNvdW50ICs9IGl0ZW1Db3VudDtcbiAgICByZXN1bHQucHVzaChuYW1lQ29sdW1uKTtcbiAgfVxuICBjb2x1bW5zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgIGZpZWxkID0gZ2V0RmllbGQoaXRlbSk7XG4gICAgaWYgKCFmaWVsZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpdGVtQ291bnQgPSBmaWVsZC5pc193aWRlID8gMiA6IDE7XG4gICAgaWYgKGNvdW50IDwgbWF4Q291bnQgJiYgcmVzdWx0Lmxlbmd0aCA8IG1heENvdW50ICYmICFpc05hbWVDb2x1bW4oaXRlbSkpIHtcbiAgICAgIGNvdW50ICs9IGl0ZW1Db3VudDtcbiAgICAgIGlmIChjb3VudCA8PSBtYXhDb3VudCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuLypcbiAgICDojrflj5bpu5jorqTop4blm75cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3LCBvYmplY3QsIHJlZjtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIH1cbiAgaWYgKG9iamVjdCAhPSBudWxsID8gKHJlZiA9IG9iamVjdC5saXN0X3ZpZXdzKSAhPSBudWxsID8gcmVmW1wiZGVmYXVsdFwiXSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgIGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3NbXCJkZWZhdWx0XCJdO1xuICB9IGVsc2Uge1xuICAgIF8uZWFjaChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC5saXN0X3ZpZXdzIDogdm9pZCAwLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuICAgICAgaWYgKGxpc3Rfdmlldy5uYW1lID09PSBcImFsbFwiIHx8IGtleSA9PT0gXCJhbGxcIikge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXc7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWaWV3O1xufTtcblxuXG4vKlxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAodXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMCkge1xuICAgICAgY29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zO1xuICAgIH0gZWxzZSBpZiAoY29sdW1ucykge1xuICAgICAgY29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29sdW1ucztcbn07XG5cblxuLypcbiAgICDojrflj5blr7nosaHnmoTliJfooajnrKzkuIDkuKrop4blm77mmL7npLrnmoTlrZfmrrVcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdEZpcnN0TGlzdFZpZXdDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHVzZV9tb2JpbGVfY29sdW1ucykge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAodXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMCkge1xuICAgICAgY29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zO1xuICAgIH0gZWxzZSBpZiAoY29sdW1ucykge1xuICAgICAgY29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29sdW1ucztcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k6aKd5aSW5Yqg6L2955qE5a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICByZXR1cm4gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmV4dHJhX2NvbHVtbnMgOiB2b2lkIDA7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIGlmIChkZWZhdWx0Vmlldykge1xuICAgIGlmIChkZWZhdWx0Vmlldy5zb3J0KSB7XG4gICAgICByZXR1cm4gZGVmYXVsdFZpZXcuc29ydDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtbXCJjcmVhdGVkXCIsIFwiZGVzY1wiXV07XG4gICAgfVxuICB9XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzQWxsVmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcImFsbFwiO1xufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6VGFidWxhcuaOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IGZ1bmN0aW9uKHNvcnQsIHRhYnVsYXJDb2x1bW5zKSB7XG4gIHZhciB0YWJ1bGFyX3NvcnQ7XG4gIHRhYnVsYXJfc29ydCA9IFtdO1xuICBfLmVhY2goc29ydCwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBjb2x1bW5faW5kZXgsIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGlmIChpdGVtLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgXCJhc2NcIl0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0ubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBpdGVtWzFdXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgb3JkZXJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YWJ1bGFyX3NvcnQ7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gZnVuY3Rpb24oc29ydCkge1xuICB2YXIgZHhfc29ydDtcbiAgZHhfc29ydCA9IFtdO1xuICBfLmVhY2goc29ydCwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZHhfc29ydC5wdXNoKGl0ZW0pO1xuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goW2ZpZWxkX25hbWUsIG9yZGVyXSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGR4X3NvcnQ7XG59O1xuIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJ9XG5cdFx0U2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFx0X3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIn1cblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuXHRcdFx0cmVnRXg6IF9yZWdFeE1lc3NhZ2VzLFxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIi8vIOWboOS4um1ldGVvcue8luivkWNvZmZlZXNjcmlwdOS8muWvvOiHtGV2YWzlh73mlbDmiqXplJnvvIzmiYDku6XljZXni6zlhpnlnKjkuIDkuKpqc+aWh+S7tuS4reOAglxuQ3JlYXRvci5ldmFsSW5Db250ZXh0ID0gZnVuY3Rpb24oanMsIGNvbnRleHQpIHtcbiAgICAvLyMgUmV0dXJuIHRoZSByZXN1bHRzIG9mIHRoZSBpbi1saW5lIGFub255bW91cyBmdW5jdGlvbiB3ZSAuY2FsbCB3aXRoIHRoZSBwYXNzZWQgY29udGV4dFxuICAgIHJldHVybiBmdW5jdGlvbigpIHsgXG4gICAgXHRyZXR1cm4gZXZhbChqcyk7IFxuXHR9LmNhbGwoY29udGV4dCk7XG59XG5cblxuQ3JlYXRvci5ldmFsID0gZnVuY3Rpb24oanMpe1xuXHR0cnl7XG5cdFx0cmV0dXJuIGV2YWwoanMpXG5cdH1jYXRjaCAoZSl7XG5cdFx0Y29uc29sZS5lcnJvcihlLCBqcyk7XG5cdH1cbn07IiwiXHRnZXRPcHRpb24gPSAob3B0aW9uKS0+XG5cdFx0Zm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKVxuXHRcdGlmIGZvby5sZW5ndGggPiAyXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV0sIGNvbG9yOiBmb29bMl19XG5cdFx0ZWxzZSBpZiBmb28ubGVuZ3RoID4gMVxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1swXX1cblxuXHRjb252ZXJ0RmllbGQgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkLCBzcGFjZUlkKS0+XG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xuXHRcdFx0Y29kZSA9IGZpZWxkLnBpY2tsaXN0IHx8IFwiI3tvYmplY3RfbmFtZX0uI3tmaWVsZF9uYW1lfVwiO1xuXHRcdFx0aWYgY29kZVxuXHRcdFx0XHRwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XG5cdFx0XHRcdGlmIHBpY2tsaXN0XG5cdFx0XHRcdFx0b3B0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdGFsbE9wdGlvbnMgPSBbXTtcblx0XHRcdFx0XHRwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdClcblx0XHRcdFx0XHRwaWNrbGlzdE9wdGlvbnMgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJyk/LnJldmVyc2UoKTtcblx0XHRcdFx0XHRfLmVhY2ggcGlja2xpc3RPcHRpb25zLCAoaXRlbSktPlxuXHRcdFx0XHRcdFx0bGFiZWwgPSBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdHZhbHVlID0gaXRlbS52YWx1ZSB8fCBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdGFsbE9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGVuYWJsZTogaXRlbS5lbmFibGUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW5hYmxlXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZGVmYXVsdFxuXHRcdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZVxuXHRcdFx0XHRcdGlmIG9wdGlvbnMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IG9wdGlvbnNcblx0XHRcdFx0XHRpZiBhbGxPcHRpb25zLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGZpZWxkLmFsbE9wdGlvbnMgPSBhbGxPcHRpb25zXG5cdFx0cmV0dXJuIGZpZWxkO1xuXG5cdENyZWF0b3IuY29udmVydE9iamVjdCA9IChvYmplY3QsIHNwYWNlSWQpLT5cblx0XHRpZiAhb2JqZWN0XG5cdFx0XHRyZXR1cm5cblx0XHRfLmZvckVhY2ggb2JqZWN0LnRyaWdnZXJzLCAodHJpZ2dlciwga2V5KS0+XG5cblx0XHRcdGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIilcblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gdHJpZ2dlcj8uX3RvZG9cblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kb1xuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXG5cdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcblxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYilcblx0XHRcdFx0XHQj5Y+q5pyJdXBkYXRl5pe277yMIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zIOaJjeacieWAvFxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj++8jOWwpOWFtuaYr0NvbGxlY3Rpb25cblx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyl7I3tfdG9kb19mcm9tX2RifX0pXCIpXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCJcblx0XHRcdFx0X3RvZG8gPSB0cmlnZ2VyLnRvZG9cblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxuXHRcdFx0XHRcdHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpXG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuZmllbGRzLCAoZmllbGQsIGtleSktPlxuXG5cdFx0XHRcdGlmIGZpZWxkLm9taXRcblx0XHRcdFx0XHQjIG9taXTlrZfmrrXlrozlhajpmpDol4/kuI3mmL7npLpcblx0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSB0cnVlXG5cblx0XHRcdFx0aWYgZmllbGQucmVxdWlyZWQgJiYgZmllbGQucmVhZG9ubHlcblx0XHRcdFx0XHQjIOmAmueUqOW/heWhq+Wtl+autSAjMjk1Mu+8jOW/heWhq+Wtl+auteiuvue9ruS4uumdnuWPquivu1xuXHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gZmFsc2VcblxuXHRcdFx0XHRzeXN0ZW1CYXNlRmllbGRzID0gQ3JlYXRvci5nZXRTeXN0ZW1CYXNlRmllbGRzKClcblx0XHRcdFx0aWYgc3lzdGVtQmFzZUZpZWxkcy5pbmRleE9mKGtleSkgPiAtMVxuXHRcdFx0XHRcdCMg5by65Yi25Yib5bu65Lq65Yib5bu65pe26Ze0562J5a2X5q615Li65Y+q6K+7XG5cdFx0XHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbj8uX3RvZG9cblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IGFjdGlvbj8udG9kb1xuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGVcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKVxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYlxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24oKXsje190b2RvX2Zyb21fZGJ9fSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvclxuXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy5fdmlzaWJsZVxuXHRcdFx0XHRpZiBfdmlzaWJsZVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0YWN0aW9uLnZpc2libGUgPSBDcmVhdG9yLmV2YWwoXCIoI3tfdmlzaWJsZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZVxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XG5cdFx0XHRcdF90b2RvID0gYWN0aW9uPy50b2RvXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHRhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpXG5cblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/LnZpc2libGVcblxuXHRcdFx0XHRpZiBfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpXG5cdFx0XHRcdFx0YWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKVxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cblx0XHRcdGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcblxuXHRcdFx0aWYgZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0XHQj5pSv5oyBXFxu5oiW6ICF6Iux5paH6YCX5Y+35YiG5YmyLFxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBvcHRpb24uaW5kZXhPZihcIixcIilcblx0XHRcdFx0XHRcdFx0b3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIilcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdFx0I+aUr+aMgeaVsOe7hOS4reebtOaOpeWumuS5ieavj+S4qumAiemhueeahOeugOeJiOagvOW8j+Wtl+espuS4slxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKG9wdGlvbilcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChvcHRpb24pXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0Xy5lYWNoIGZpZWxkLm9wdGlvbnMsICh2LCBrKS0+XG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IHYsIHZhbHVlOiBrfVxuXHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLl9vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnN9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLnJlZ0V4XG5cdFx0XHRcdGlmIHJlZ0V4XG5cdFx0XHRcdFx0ZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLl9yZWdFeFxuXHRcdFx0XHRpZiByZWdFeFxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQucmVnRXggPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWdFeH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG1pbiA9IGZpZWxkLm1pblxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWluKVxuXHRcdFx0XHRcdGZpZWxkLl9taW4gPSBtaW4udG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtaW4gPSBmaWVsZC5fbWluXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWluKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQubWluID0gQ3JlYXRvci5ldmFsKFwiKCN7bWlufSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0bWF4ID0gZmllbGQubWF4XG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtYXgpXG5cdFx0XHRcdFx0ZmllbGQuX21heCA9IG1heC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG1heCA9IGZpZWxkLl9tYXhcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtYXgpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5tYXggPSBDcmVhdG9yLmV2YWwoXCIoI3ttYXh9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxuXHRcdFx0XHRcdF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT0gT2JqZWN0ICYmIF90eXBlICE9IFN0cmluZyAmJiBfdHlwZSAhPSBOdW1iZXIgJiYgX3R5cGUgIT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKVxuXHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNTdHJpbmcoX3R5cGUpXG5cdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3IuZXZhbChcIigje190eXBlfSlcIilcblx0XHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0ZmllbGQuX3JlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90by50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKClcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQuX3JlZmVyZW5jZV90b1xuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gfHwgZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnNGdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3IuZXZhbChcIigje3JlZmVyZW5jZV90b30pXCIpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2NyZWF0ZUZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7YmVmb3JlT3BlbkZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyc0Z1bmN0aW9ufSlcIilcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHRmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZVxuXG5cdFx0XHRcdGlmICFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tkZWZhdWx0VmFsdWV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cdFx0XHRcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNGdW5jdGlvbihpc19jb21wYW55X2xpbWl0ZWQpXG5cdFx0XHRcdFx0ZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvci5ldmFsKFwiKCN7aXNfY29tcGFueV9saW1pdGVkfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpIC0+XG5cdFx0XHQjIyNcblx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcblx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcblx0XHRcdOWmgu+8mlxuXHRcdFx0ZmlsdGVyczogKCktPlxuXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG5cdFx0XHTlpoLvvJpcblx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHRdXVxuXHRcdFx05oiWXG5cdFx0XHRmaWx0ZXJzOiBbe1xuXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxuXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cblx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHR9XVxuXHRcdFx0IyMjXG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKClcblx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvci5ldmFsKFwiKCN7bGlzdF92aWV3Ll9maWx0ZXJzfSlcIilcblx0XHRcdGVsc2Vcblx0XHRcdFx0Xy5mb3JFYWNoIGxpc3Rfdmlldy5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cblx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoZmlsdGVyKVxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0RhdGUoZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5pivRGF0Zeexu+Wei++8jOWImWZpbHRlclsyXeWAvOWIsOWJjeerr+S8muiHquWKqOi9rOaIkOWtl+espuS4su+8jOagvOW8j++8mlwiMjAxOC0wMy0yOVQwMzo0MzoyMS43ODdaXCJcblx0XHRcdFx0XHRcdFx0XHQjIOWMheaLrGdyaWTliJfooajor7fmsYLnmoTmjqXlj6PlnKjlhoXnmoTmiYDmnIlPRGF0YeaOpeWPo++8jERhdGXnsbvlnovlrZfmrrXpg73kvJrku6XkuIrov7DmoLzlvI/ov5Tlm55cblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkRBVEVcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlclsyXX0pXCIpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJEQVRFXCJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGZpbHRlcilcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRGF0ZShmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5faXNfZGF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIuX2lzX2RhdGUgPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSlcblxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0aWYgb2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkgb2JqZWN0LmZvcm0sIChrZXksIHZhbCktPlxuXHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbih2YWwpXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsICsgJyc7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRlbHNlIGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgb2JqZWN0LmZvcm1cblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlIG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cblx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJylcblx0XHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZF9saXN0cywgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkX2xpc3RzLCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKVxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKClcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXG5cblx0XHRyZXR1cm4gb2JqZWN0XG5cblxuIiwidmFyIGNvbnZlcnRGaWVsZCwgZ2V0T3B0aW9uO1xuXG5nZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdmFyIGZvbztcbiAgZm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKTtcbiAgaWYgKGZvby5sZW5ndGggPiAyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdLFxuICAgICAgY29sb3I6IGZvb1syXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZm9vLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1swXVxuICAgIH07XG4gIH1cbn07XG5cbmNvbnZlcnRGaWVsZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCkge1xuICB2YXIgYWxsT3B0aW9ucywgY29kZSwgb3B0aW9ucywgcGlja2xpc3QsIHBpY2tsaXN0T3B0aW9ucywgcmVmO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICBjb2RlID0gZmllbGQucGlja2xpc3QgfHwgKG9iamVjdF9uYW1lICsgXCIuXCIgKyBmaWVsZF9uYW1lKTtcbiAgICBpZiAoY29kZSkge1xuICAgICAgcGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuICAgICAgaWYgKHBpY2tsaXN0KSB7XG4gICAgICAgIG9wdGlvbnMgPSBbXTtcbiAgICAgICAgYWxsT3B0aW9ucyA9IFtdO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdCk7XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IChyZWYgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJykpICE9IG51bGwgPyByZWYucmV2ZXJzZSgpIDogdm9pZCAwO1xuICAgICAgICBfLmVhY2gocGlja2xpc3RPcHRpb25zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIGxhYmVsLCB2YWx1ZTtcbiAgICAgICAgICBsYWJlbCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lO1xuICAgICAgICAgIGFsbE9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbmFibGU6IGl0ZW0uZW5hYmxlLFxuICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXRlbS5lbmFibGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtW1wiZGVmYXVsdFwiXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0LCBzcGFjZUlkKSB7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIGtleSkge1xuICAgIHZhciBfdG9kbywgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiO1xuICAgIGlmICgoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikpIHtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXIgIT0gbnVsbCA/IHRyaWdnZXIuX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSB7XG4gICAgICBfdG9kbyA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBrZXkpIHtcbiAgICAgIHZhciBzeXN0ZW1CYXNlRmllbGRzO1xuICAgICAgaWYgKGZpZWxkLm9taXQpIHtcbiAgICAgICAgZmllbGQuaGlkZGVuID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWVsZC5yZXF1aXJlZCAmJiBmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmaWVsZC5yZWFkb25seSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgc3lzdGVtQmFzZUZpZWxkcyA9IENyZWF0b3IuZ2V0U3lzdGVtQmFzZUZpZWxkcygpO1xuICAgICAgaWYgKHN5c3RlbUJhc2VGaWVsZHMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiLCBfdmlzaWJsZSwgZXJyb3I7XG4gICAgICBfdG9kb19mcm9tX2NvZGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdG9kbyA6IHZvaWQgMDtcbiAgICAgIF90b2RvX2Zyb21fZGIgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9jb2RlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2NvZGVcIiwgX3RvZG9fZnJvbV9jb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKF90b2RvX2Zyb21fZGIgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2RiKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fZGIgKyBcIilcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKSkge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IF90b2RvX2Zyb21fZGI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhY3Rpb24udG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKGZ1bmN0aW9uKCl7XCIgKyBfdG9kb19mcm9tX2RiICsgXCJ9KVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0b2RvX2Zyb21fZGJcIiwgX3RvZG9fZnJvbV9kYiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLl92aXNpYmxlIDogdm9pZCAwO1xuICAgICAgaWYgKF92aXNpYmxlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGFjdGlvbi52aXNpYmxlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdmlzaWJsZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LmFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwga2V5KSB7XG4gICAgICB2YXIgX3RvZG8sIF92aXNpYmxlO1xuICAgICAgX3RvZG8gPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi50b2RvIDogdm9pZCAwO1xuICAgICAgaWYgKF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbykpIHtcbiAgICAgICAgYWN0aW9uLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIF92aXNpYmxlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpKSB7XG4gICAgICAgIHJldHVybiBhY3Rpb24uX3Zpc2libGUgPSBfdmlzaWJsZS50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgdmFyIF9vcHRpb25zLCBfdHlwZSwgYmVmb3JlT3BlbkZ1bmN0aW9uLCBjcmVhdGVGdW5jdGlvbiwgZGVmYXVsdFZhbHVlLCBlcnJvciwgZmlsdGVyc0Z1bmN0aW9uLCBpc19jb21wYW55X2xpbWl0ZWQsIG1heCwgbWluLCBvcHRpb25zLCBvcHRpb25zRnVuY3Rpb24sIHJlZmVyZW5jZV90bywgcmVnRXg7XG4gICAgZmllbGQgPSBjb252ZXJ0RmllbGQob2JqZWN0Lm5hbWUsIGtleSwgZmllbGQsIHNwYWNlSWQpO1xuICAgIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNTdHJpbmcoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF9vcHRpb25zID0gW107XG4gICAgICAgIF8uZm9yRWFjaChmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgICBpZiAob3B0aW9uLmluZGV4T2YoXCIsXCIpKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIHJldHVybiBfLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24oX29wdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgaWYgKF8uaXNTdHJpbmcob3B0aW9uKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChvcHRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQub3B0aW9ucyAmJiAhXy5pc0Z1bmN0aW9uKGZpZWxkLm9wdGlvbnMpICYmICFfLmlzQXJyYXkoZmllbGQub3B0aW9ucykgJiYgXy5pc09iamVjdChmaWVsZC5vcHRpb25zKSkge1xuICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgIF8uZWFjaChmaWVsZC5vcHRpb25zLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICBsYWJlbDogdixcbiAgICAgICAgICB2YWx1ZToga1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNGdW5jdGlvbihvcHRpb25zKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnMudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLl9vcHRpb25zO1xuICAgICAgaWYgKG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm9wdGlvbnMgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG9wdGlvbnMgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZWdFeCA9IGZpZWxkLnJlZ0V4O1xuICAgICAgaWYgKHJlZ0V4KSB7XG4gICAgICAgIGZpZWxkLl9yZWdFeCA9IGZpZWxkLnJlZ0V4LnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZ0V4ID0gZmllbGQuX3JlZ0V4O1xuICAgICAgaWYgKHJlZ0V4KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQucmVnRXggPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHJlZ0V4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgbWluID0gZmllbGQubWluO1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihtaW4pKSB7XG4gICAgICAgIGZpZWxkLl9taW4gPSBtaW4udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWluID0gZmllbGQuX21pbjtcbiAgICAgIGlmIChfLmlzU3RyaW5nKG1pbikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5taW4gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIG1pbiArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1heCA9IGZpZWxkLm1heDtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWF4KSkge1xuICAgICAgICBmaWVsZC5fbWF4ID0gbWF4LnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1heCA9IGZpZWxkLl9tYXg7XG4gICAgICBpZiAoXy5pc1N0cmluZyhtYXgpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWF4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtYXggKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBpZiAoZmllbGQuYXV0b2Zvcm0pIHtcbiAgICAgICAgX3R5cGUgPSBmaWVsZC5hdXRvZm9ybS50eXBlO1xuICAgICAgICBpZiAoX3R5cGUgJiYgXy5pc0Z1bmN0aW9uKF90eXBlKSAmJiBfdHlwZSAhPT0gT2JqZWN0ICYmIF90eXBlICE9PSBTdHJpbmcgJiYgX3R5cGUgIT09IE51bWJlciAmJiBfdHlwZSAhPT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKSkge1xuICAgICAgICAgIGZpZWxkLmF1dG9mb3JtLl90eXBlID0gX3R5cGUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZmllbGQuYXV0b2Zvcm0pIHtcbiAgICAgICAgX3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNTdHJpbmcoX3R5cGUpKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZpZWxkLmF1dG9mb3JtLnR5cGUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90eXBlICsgXCIpXCIpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBmaWVsZCAtPiB0eXBlIGVycm9yXCIsIGZpZWxkLCBlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgIGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb247XG4gICAgICBiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb247XG4gICAgICBpZiAob3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gPSBvcHRpb25zRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWZlcmVuY2VfdG8gJiYgXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQuX3JlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90by50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2NyZWF0ZUZ1bmN0aW9uID0gY3JlYXRlRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgaWYgKGZpbHRlcnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uID0gZmlsdGVyc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLl9vcHRpb25zRnVuY3Rpb24gfHwgZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQuX3JlZmVyZW5jZV90bztcbiAgICAgIGNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuX2NyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgIGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gfHwgZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKG9wdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQub3B0aW9uc0Z1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICBmaWVsZC5yZWZlcmVuY2VfdG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHJlZmVyZW5jZV90byArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgY3JlYXRlRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNTdHJpbmcoYmVmb3JlT3BlbkZ1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGJlZm9yZU9wZW5GdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhmaWx0ZXJzRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIGZpZWxkLl9kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZTtcbiAgICAgIGlmICghZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZmllbGQuZGVmYXVsdFZhbHVlKSAmJiBmaWVsZC5kZWZhdWx0VmFsdWUuc3RhcnRzV2l0aChcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBkZWZhdWx0VmFsdWUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICBpZiAoaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNGdW5jdGlvbihpc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgIHJldHVybiBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICBpZiAoaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGlzX2NvbXBhbnlfbGltaXRlZCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIF8uZm9yRWFjaChvYmplY3QubGlzdF92aWV3cywgZnVuY3Rpb24obGlzdF92aWV3LCBrZXkpIHtcblxuICAgIC8qXG4gICAgXHRcdFx06KeG5Zu+6L+H6JmR5Zmo6ZyA6KaB5pSv5oyBZnVuY3Rpb27vvIzlkI7lj7DovazmiJDlrZfnrKbkuLLvvIzliY3lj7BldmFs5oiQ5Ye95pWwXG4gICAgXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcbiAgICBcdFx0XHQxLiDmlbTkuKpmaWx0ZXJz5Li6ZnVuY3Rpb246XG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogKCktPlxuICAgIFx0XHRcdFx0cmV0dXJuIFtbW1wib2JqZWN0X25hbWVcIixcIj1cIixcInByb2plY3RfaXNzdWVzXCJdLCdvcicsW1wib2JqZWN0X25hbWVcIixcIj1cIixcInRhc2tzXCJdXV1cbiAgICBcdFx0XHQyLiBmaWx0ZXJz5YaF55qEZmlsdGVyLnZhbHVl5Li6ZnVuY3Rpb25cbiAgICBcdFx0XHTlpoLvvJpcbiAgICBcdFx0XHRmaWx0ZXJzOiBbW1wib2JqZWN0X25hbWVcIiwgXCI9XCIsICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBcInByb2plY3RfaXNzdWVzXCJcbiAgICBcdFx0XHRdXVxuICAgIFx0XHRcdOaIllxuICAgIFx0XHRcdGZpbHRlcnM6IFt7XG4gICAgXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxuICAgIFx0XHRcdFx0XCJvcGVyYXRpb25cIjogXCI9XCJcbiAgICBcdFx0XHRcdFwidmFsdWVcIjogKCktPlxuICAgIFx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0fV1cbiAgICAgKi9cbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGxpc3Rfdmlldy5maWx0ZXJzKSkge1xuICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3Ll9maWx0ZXJzID0gbGlzdF92aWV3LmZpbHRlcnMudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcobGlzdF92aWV3Ll9maWx0ZXJzKSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICByZXR1cm4gbGlzdF92aWV3LmZpbHRlcnMgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGxpc3Rfdmlldy5fZmlsdGVycyArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF8uZm9yRWFjaChsaXN0X3ZpZXcuZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyLCBfaW5kZXgpIHtcbiAgICAgICAgaWYgKF8uaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDMgJiYgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gZmlsdGVyWzJdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbM10gPSBcIkZVTkNUSU9OXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbHRlci5sZW5ndGggPT09IDMgJiYgXy5pc0RhdGUoZmlsdGVyWzJdKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJEQVRFXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiRlVOQ1RJT05cIikge1xuICAgICAgICAgICAgICBmaWx0ZXJbMl0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlclsyXSArIFwiKVwiKTtcbiAgICAgICAgICAgICAgZmlsdGVyLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPT09IDQgJiYgXy5pc1N0cmluZyhmaWx0ZXJbMl0pICYmIGZpbHRlclszXSA9PT0gXCJEQVRFXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gbmV3IERhdGUoZmlsdGVyWzJdKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChmaWx0ZXIpKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci5fdmFsdWUgPSBmaWx0ZXIudmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0RhdGUoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX2lzX2RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5fdmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIudmFsdWUgPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlci5fdmFsdWUgKyBcIilcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbHRlci5faXNfZGF0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gbmV3IERhdGUoZmlsdGVyLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pKSB7XG4gICAgICBvYmplY3QuZm9ybSA9IEpTT04uc3RyaW5naWZ5KG9iamVjdC5mb3JtLCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsICsgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChvYmplY3QuZm9ybSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlKG9iamVjdC5mb3JtLCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyh2YWwpICYmIHZhbC5zdGFydHNXaXRoKCdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkX2xpc3RzLCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyB2YWwgKyBcIilcIik7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZmlsdGVyc19jb2RlXCIsIHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBfLmZvckVhY2gob2JqZWN0LnJlbGF0ZWRfbGlzdHMsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkTGlzdCwgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImZpbHRlcnNfY29kZVwiLCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkTGlzdCwgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIGlmIChrZXkgPT09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSB2YWwudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwiQ3JlYXRvci5Gb3JtdWxhciA9IHt9XG5cbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCJcblxuQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEgPSAocHJlZml4LGZpZWxkVmFyaWFibGUpLT5cblx0cmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XG5cblx0cmV2ID0gZmllbGRWYXJpYWJsZS5yZXBsYWNlIHJlZywgKG0sICQxKS0+XG5cdFx0cmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLFwiW1xcXCJcIikucmVwbGFjZSgvXFxzKlxcfS8sXCJcXFwiXVwiKS5yZXBsYWNlKC9cXHMqXFwuXFxzKi9nLFwiXFxcIl1bXFxcIlwiKTtcblxuXHRyZXR1cm4gcmV2XG5cbkNyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhID0gKGZvcm11bGFfc3RyKS0+XG5cdGlmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ7XCIpID4gLTEgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIn1cIikgPiAtMVxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IChmb3JtdWxhX3N0ciwgX0NPTlRFWFQsIG9wdGlvbnMpLT5cblx0aWYgZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cilcblxuXHRcdGlmICFfLmlzQm9vbGVhbihvcHRpb25zPy5leHRlbmQpXG5cdFx0XHRleHRlbmQgPSB0cnVlXG5cblx0XHRfVkFMVUVTID0ge31cblx0XHRfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgX0NPTlRFWFQpXG5cdFx0aWYgZXh0ZW5kXG5cdFx0XHRfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgQ3JlYXRvci5nZXRVc2VyQ29udGV4dChvcHRpb25zPy51c2VySWQsIG9wdGlvbnM/LnNwYWNlSWQpKVxuXHRcdGZvcm11bGFfc3RyID0gQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEoXCJ0aGlzXCIsIGZvcm11bGFfc3RyKVxuXG5cdFx0dHJ5XG5cdFx0XHRkYXRhID0gQ3JlYXRvci5ldmFsSW5Db250ZXh0KGZvcm11bGFfc3RyLCBfVkFMVUVTKSAgICMg5q2k5aSE5LiN6IO955Sod2luZG93LmV2YWwg77yM5Lya5a+86Ie05Y+Y6YeP5L2c55So5Z+f5byC5bi4XG5cdFx0XHRyZXR1cm4gZGF0YVxuXHRcdGNhdGNoIGVcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogI3tmb3JtdWxhX3N0cn1cIiwgZSlcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHR0b2FzdHI/LmVycm9yKFwi5YWs5byP5omn6KGM5Ye66ZSZ5LqG77yM6K+35qOA5p+l5YWs5byP6YWN572u5piv5ZCm5q2j56Gu77yBXCIpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogI3tmb3JtdWxhX3N0cn0je2V9XCJcblxuXHRyZXR1cm4gZm9ybXVsYV9zdHJcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fTtcblxuQ3JlYXRvci5Gb3JtdWxhci5QUkVGSVggPSBcIl9WQUxVRVNcIjtcblxuQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEgPSBmdW5jdGlvbihwcmVmaXgsIGZpZWxkVmFyaWFibGUpIHtcbiAgdmFyIHJlZywgcmV2O1xuICByZWcgPSAvKFxce1tee31dKlxcfSkvZztcbiAgcmV2ID0gZmllbGRWYXJpYWJsZS5yZXBsYWNlKHJlZywgZnVuY3Rpb24obSwgJDEpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJDEucmVwbGFjZSgvXFx7XFxzKi8sIFwiW1xcXCJcIikucmVwbGFjZSgvXFxzKlxcfS8sIFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZywgXCJcXFwiXVtcXFwiXCIpO1xuICB9KTtcbiAgcmV0dXJuIHJldjtcbn07XG5cbkNyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYV9zdHIpIHtcbiAgaWYgKF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ7XCIpID4gLTEgJiYgZm9ybXVsYV9zdHIuaW5kZXhPZihcIn1cIikgPiAtMSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkNyZWF0b3IuRm9ybXVsYXIucnVuID0gZnVuY3Rpb24oZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKSB7XG4gIHZhciBfVkFMVUVTLCBkYXRhLCBlLCBleHRlbmQ7XG4gIGlmIChmb3JtdWxhX3N0ciAmJiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSkge1xuICAgIGlmICghXy5pc0Jvb2xlYW4ob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5leHRlbmQgOiB2b2lkIDApKSB7XG4gICAgICBleHRlbmQgPSB0cnVlO1xuICAgIH1cbiAgICBfVkFMVUVTID0ge307XG4gICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKTtcbiAgICBpZiAoZXh0ZW5kKSB7XG4gICAgICBfVkFMVUVTID0gXy5leHRlbmQoX1ZBTFVFUywgQ3JlYXRvci5nZXRVc2VyQ29udGV4dChvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnVzZXJJZCA6IHZvaWQgMCwgb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy5zcGFjZUlkIDogdm9pZCAwKSk7XG4gICAgfVxuICAgIGZvcm11bGFfc3RyID0gQ3JlYXRvci5Gb3JtdWxhci5fcHJlcGVuZFByZWZpeEZvckZvcm11bGEoXCJ0aGlzXCIsIGZvcm11bGFfc3RyKTtcbiAgICB0cnkge1xuICAgICAgZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUyk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihcIkNyZWF0b3IuRm9ybXVsYXIucnVuOiBcIiArIGZvcm11bGFfc3RyLCBlKTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0b2FzdHIgIT09IFwidW5kZWZpbmVkXCIgJiYgdG9hc3RyICE9PSBudWxsKSB7XG4gICAgICAgICAgdG9hc3RyLmVycm9yKFwi5YWs5byP5omn6KGM5Ye66ZSZ5LqG77yM6K+35qOA5p+l5YWs5byP6YWN572u5piv5ZCm5q2j56Gu77yBXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciArIGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZm9ybXVsYV9zdHI7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuQ3JlYXRvci5vYmplY3RzQnlOYW1lID0ge30gICAjIOatpOWvueixoeWPquiDveWcqOehruS/neaJgOaciU9iamVjdOWIneWni+WMluWujOaIkOWQjuiwg+eUqO+8jCDlkKbliJnojrflj5bliLDnmoRvYmplY3TkuI3lhahcblxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gKG9iamVjdF9uYW1lKS0+XG5cdGlmIG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKVxuXHRcdG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJylcblx0cmV0dXJuIG9iamVjdF9uYW1lXG5cbkNyZWF0b3IuT2JqZWN0ID0gKG9wdGlvbnMpLT5cblx0X2Jhc2VPYmplY3QgPSBDcmVhdG9yLmJhc2VPYmplY3Rcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0X2Jhc2VPYmplY3QgPSB7YWN0aW9uczogQ3JlYXRvci5iYXNlT2JqZWN0LmFjdGlvbnMgLCBmaWVsZHM6IHt9LCB0cmlnZ2Vyczoge30sIHBlcm1pc3Npb25fc2V0OiB7fX1cblx0c2VsZiA9IHRoaXNcblx0aWYgKCFvcHRpb25zLm5hbWUpXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgbmFtZScpO1xuXG5cdHNlbGYuX2lkID0gb3B0aW9ucy5faWQgfHwgb3B0aW9ucy5uYW1lXG5cdHNlbGYuc3BhY2UgPSBvcHRpb25zLnNwYWNlXG5cdHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZVxuXHRzZWxmLmxhYmVsID0gb3B0aW9ucy5sYWJlbFxuXHRzZWxmLmljb24gPSBvcHRpb25zLmljb25cblx0c2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb25cblx0c2VsZi5pc192aWV3ID0gb3B0aW9ucy5pc192aWV3XG5cdHNlbGYuZm9ybSA9IG9wdGlvbnMuZm9ybVxuXHRzZWxmLnJlbGF0ZWRMaXN0ID0gb3B0aW9ucy5yZWxhdGVkTGlzdFxuXHRzZWxmLnJlbGF0ZWRfbGlzdHMgPSBvcHRpb25zLnJlbGF0ZWRfbGlzdHNcblx0c2VsZi52ZXJzaW9uID0gb3B0aW9ucy52ZXJzaW9uIHx8IDEuMFxuXHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucy5pc19lbmFibGUpICB8fCBvcHRpb25zLmlzX2VuYWJsZSA9PSB0cnVlXG5cdFx0c2VsZi5pc19lbmFibGUgPSB0cnVlXG5cdGVsc2Vcblx0XHRzZWxmLmlzX2VuYWJsZSA9IGZhbHNlXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIF8uaGFzKG9wdGlvbnMsICdhbGxvd19jdXN0b21BY3Rpb25zJylcblx0XHRcdHNlbGYuYWxsb3dfY3VzdG9tQWN0aW9ucyA9IG9wdGlvbnMuYWxsb3dfY3VzdG9tQWN0aW9uc1xuXHRcdGlmIF8uaGFzKG9wdGlvbnMsICdleGNsdWRlX2FjdGlvbnMnKVxuXHRcdFx0c2VsZi5leGNsdWRlX2FjdGlvbnMgPSBvcHRpb25zLmV4Y2x1ZGVfYWN0aW9uc1xuXHRcdGlmIF8uaGFzKG9wdGlvbnMsICdhbGxvd19yZWxhdGVkTGlzdCcpXG5cdFx0XHRzZWxmLmFsbG93X3JlbGF0ZWRMaXN0ID0gb3B0aW9ucy5hbGxvd19yZWxhdGVkTGlzdFxuXHRzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2hcblx0c2VsZi5lbmFibGVfZmlsZXMgPSBvcHRpb25zLmVuYWJsZV9maWxlc1xuXHRzZWxmLmVuYWJsZV90YXNrcyA9IG9wdGlvbnMuZW5hYmxlX3Rhc2tzXG5cdHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXNcblx0c2VsZi5lbmFibGVfYXVkaXQgPSBvcHRpb25zLmVuYWJsZV9hdWRpdFxuXHRzZWxmLmVuYWJsZV9ldmVudHMgPSBvcHRpb25zLmVuYWJsZV9ldmVudHNcblx0aWYgb3B0aW9ucy5wYWdpbmdcblx0XHRzZWxmLnBhZ2luZyA9IG9wdGlvbnMucGFnaW5nXG5cdHNlbGYuaGlkZGVuID0gb3B0aW9ucy5oaWRkZW5cblx0c2VsZi5lbmFibGVfYXBpID0gKG9wdGlvbnMuZW5hYmxlX2FwaSA9PSB1bmRlZmluZWQpIG9yIG9wdGlvbnMuZW5hYmxlX2FwaVxuXHRzZWxmLmN1c3RvbSA9IG9wdGlvbnMuY3VzdG9tXG5cdHNlbGYuZW5hYmxlX3NoYXJlID0gb3B0aW9ucy5lbmFibGVfc2hhcmVcblx0c2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzXG5cdHNlbGYuZW5hYmxlX3Byb2Nlc3MgPSBvcHRpb25zLmVuYWJsZV9wcm9jZXNzXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKVxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcblx0XHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxuXHRlbHNlXG5cdFx0c2VsZi5zaWRlYmFyID0gXy5jbG9uZShvcHRpb25zLnNpZGViYXIpXG5cdFx0c2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWVcblx0c2VsZi5vcGVuX3dpbmRvdyA9IG9wdGlvbnMub3Blbl93aW5kb3dcblx0c2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnlcblx0c2VsZi5jYWxlbmRhciA9IF8uY2xvbmUob3B0aW9ucy5jYWxlbmRhcilcblx0c2VsZi5lbmFibGVfY2hhdHRlciA9IG9wdGlvbnMuZW5hYmxlX2NoYXR0ZXJcblx0c2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaFxuXHRzZWxmLmVuYWJsZV9zcGFjZV9nbG9iYWwgPSBvcHRpb25zLmVuYWJsZV9zcGFjZV9nbG9iYWxcblx0c2VsZi5lbmFibGVfYXBwcm92YWxzID0gb3B0aW9ucy5lbmFibGVfYXBwcm92YWxzXG5cdHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvd1xuXHRzZWxmLmVuYWJsZV93b3JrZmxvdyA9IG9wdGlvbnMuZW5hYmxlX3dvcmtmbG93XG5cdHNlbGYuZW5hYmxlX2lubGluZV9lZGl0ID0gb3B0aW9ucy5lbmFibGVfaW5saW5lX2VkaXRcblx0c2VsZi5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzXG5cdHNlbGYubWFzdGVycyA9IG9wdGlvbnMubWFzdGVyc1xuXHRzZWxmLmxvb2t1cF9kZXRhaWxzID0gb3B0aW9ucy5sb29rdXBfZGV0YWlsc1xuXHRpZiBfLmhhcyhvcHRpb25zLCAnaW5fZGV2ZWxvcG1lbnQnKVxuXHRcdHNlbGYuaW5fZGV2ZWxvcG1lbnQgPSBvcHRpb25zLmluX2RldmVsb3BtZW50XG5cdHNlbGYuaWRGaWVsZE5hbWUgPSAnX2lkJ1xuXHRpZiBvcHRpb25zLmRhdGFiYXNlX25hbWVcblx0XHRzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWVcblx0aWYgKCFvcHRpb25zLmZpZWxkcylcblx0XHRjb25zb2xlLmVycm9yKG9wdGlvbnMpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBmaWVsZHMnKTtcblxuXHRzZWxmLmZpZWxkcyA9IGNsb25lKG9wdGlvbnMuZmllbGRzKVxuXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgZmllbGQuaXNfbmFtZVxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcblx0XHRlbHNlIGlmIGZpZWxkX25hbWUgPT0gJ25hbWUnICYmICFzZWxmLk5BTUVfRklFTERfS0VZXG5cdFx0XHRzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZVxuXHRcdGlmIGZpZWxkLnByaW1hcnlcblx0XHRcdHNlbGYuaWRGaWVsZE5hbWUgPSBmaWVsZF9uYW1lXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcblx0XHRcdFx0aWYgZmllbGRfbmFtZSA9PSAnc3BhY2UnXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyYWJsZSA9IHRydWVcblx0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSBmYWxzZVxuXG5cdGlmICFvcHRpb25zLmRhdGFiYXNlX25hbWUgfHwgb3B0aW9ucy5kYXRhYmFzZV9uYW1lID09ICdtZXRlb3ItbW9uZ28nXG5cdFx0Xy5lYWNoIF9iYXNlT2JqZWN0LmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0XHRpZiAhc2VsZi5maWVsZHNbZmllbGRfbmFtZV1cblx0XHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSB7fVxuXHRcdFx0c2VsZi5maWVsZHNbZmllbGRfbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKGZpZWxkKSwgc2VsZi5maWVsZHNbZmllbGRfbmFtZV0pXG5cblx0Xy5lYWNoIHNlbGYuZmllbGRzLCAoZmllbGQsIGZpZWxkX25hbWUpLT5cblx0XHRpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdmb3JtdWxhJ1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdzdW1tYXJ5J1xuXHRcdFx0ZmllbGQucmVhZG9ubHkgPSB0cnVlXG5cblx0c2VsZi5saXN0X3ZpZXdzID0ge31cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KHNlbGYubmFtZSlcblx0Xy5lYWNoIG9wdGlvbnMubGlzdF92aWV3cywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdG9pdGVtID0gQ3JlYXRvci5jb252ZXJ0TGlzdFZpZXcoZGVmYXVsdFZpZXcsIGl0ZW0sIGl0ZW1fbmFtZSlcblx0XHRzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtXG5cblx0c2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QudHJpZ2dlcnMpXG5cdF8uZWFjaCBvcHRpb25zLnRyaWdnZXJzLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXVxuXHRcdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0ge31cblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZVxuXHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdKSwgaXRlbSlcblxuXHRzZWxmLmFjdGlvbnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LmFjdGlvbnMpXG5cdF8uZWFjaCBvcHRpb25zLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiAhc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdID0ge31cblx0XHRjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pXG5cdFx0ZGVsZXRlIHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdICPlhYjliKDpmaTnm7jlhbPlsZ7mgKflho3ph43lu7rmiY3og73kv53or4HlkI7nu63ph43lpI3lrprkuYnnmoTlsZ7mgKfpobrluo/nlJ/mlYhcblx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKGNvcHlJdGVtLCBpdGVtKVxuXG5cdF8uZWFjaCBzZWxmLmFjdGlvbnMsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpdGVtLm5hbWUgPSBpdGVtX25hbWVcblxuXHRzZWxmLnJlbGF0ZWRfb2JqZWN0cyA9IENyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMoc2VsZi5uYW1lKVxuXG5cdCMg6K6p5omA5pyJb2JqZWN06buY6K6k5pyJ5omA5pyJbGlzdF92aWV3cy9hY3Rpb25zL3JlbGF0ZWRfb2JqZWN0cy9yZWFkYWJsZV9maWVsZHMvZWRpdGFibGVfZmllbGRz5a6M5pW05p2D6ZmQ77yM6K+l5p2D6ZmQ5Y+v6IO96KKr5pWw5o2u5bqT5Lit6K6+572u55qEYWRtaW4vdXNlcuadg+mZkOimhuebllxuXHRzZWxmLnBlcm1pc3Npb25fc2V0ID0gXy5jbG9uZShfYmFzZU9iamVjdC5wZXJtaXNzaW9uX3NldClcblx0IyBkZWZhdWx0TGlzdFZpZXdzID0gXy5rZXlzKHNlbGYubGlzdF92aWV3cylcblx0IyBkZWZhdWx0QWN0aW9ucyA9IF8ua2V5cyhzZWxmLmFjdGlvbnMpXG5cdCMgZGVmYXVsdFJlbGF0ZWRPYmplY3RzID0gXy5wbHVjayhzZWxmLnJlbGF0ZWRfb2JqZWN0cyxcIm9iamVjdF9uYW1lXCIpXG5cdCMgZGVmYXVsdFJlYWRhYmxlRmllbGRzID0gW11cblx0IyBkZWZhdWx0RWRpdGFibGVGaWVsZHMgPSBbXVxuXHQjIF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdCMgXHRpZiAhKGZpZWxkLmhpZGRlbikgICAgIzIzMSBvbWl05a2X5q615pSv5oyB5Zyo6Z2e57yW6L6R6aG16Z2i5p+l55yLLCDlm6DmraTliKDpmaTkuobmraTlpITlr7lvbWl055qE5Yik5patXG5cdCMgXHRcdGRlZmF1bHRSZWFkYWJsZUZpZWxkcy5wdXNoIGZpZWxkX25hbWVcblx0IyBcdFx0aWYgIWZpZWxkLnJlYWRvbmx5XG5cdCMgXHRcdFx0ZGVmYXVsdEVkaXRhYmxlRmllbGRzLnB1c2ggZmllbGRfbmFtZVxuXG5cdCMgXy5lYWNoIHNlbGYucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0IyBcdGlmIGl0ZW1fbmFtZSA9PSBcIm5vbmVcIlxuXHQjIFx0XHRyZXR1cm5cblx0IyBcdGlmIHNlbGYubGlzdF92aWV3c1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ubGlzdF92aWV3cyA9IGRlZmF1bHRMaXN0Vmlld3Ncblx0IyBcdGlmIHNlbGYuYWN0aW9uc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uYWN0aW9ucyA9IGRlZmF1bHRBY3Rpb25zXG5cdCMgXHRpZiBzZWxmLnJlbGF0ZWRfb2JqZWN0c1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVsYXRlZF9vYmplY3RzID0gZGVmYXVsdFJlbGF0ZWRPYmplY3RzXG5cdCMgXHRpZiBzZWxmLmZpZWxkc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0ucmVhZGFibGVfZmllbGRzID0gZGVmYXVsdFJlYWRhYmxlRmllbGRzXG5cdCMgXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXS5lZGl0YWJsZV9maWVsZHMgPSBkZWZhdWx0RWRpdGFibGVGaWVsZHNcblx0dW5sZXNzIG9wdGlvbnMucGVybWlzc2lvbl9zZXRcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0ID0ge31cblx0aWYgIShvcHRpb25zLnBlcm1pc3Npb25fc2V0Py5hZG1pbilcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0LmFkbWluID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1wiYWRtaW5cIl0pXG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8udXNlcilcblx0XHRvcHRpb25zLnBlcm1pc3Npb25fc2V0LnVzZXIgPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJ1c2VyXCJdKVxuXHRfLmVhY2ggb3B0aW9ucy5wZXJtaXNzaW9uX3NldCwgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IHt9XG5cdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0pLCBpdGVtKVxuXG5cdCMg5YmN56uv5qC55o2ucGVybWlzc2lvbnPmlLnlhplmaWVsZOebuOWFs+WxnuaAp++8jOWQjuerr+WPquimgei1sOm7mOiupOWxnuaAp+WwseihjO+8jOS4jemcgOimgeaUueWGmVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRwZXJtaXNzaW9ucyA9IG9wdGlvbnMucGVybWlzc2lvbnNcblx0XHRkaXNhYmxlZF9saXN0X3ZpZXdzID0gcGVybWlzc2lvbnM/LmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRpZiBkaXNhYmxlZF9saXN0X3ZpZXdzPy5sZW5ndGhcblx0XHRcdGRlZmF1bHRMaXN0Vmlld0lkID0gb3B0aW9ucy5saXN0X3ZpZXdzPy5hbGw/Ll9pZFxuXHRcdFx0aWYgZGVmYXVsdExpc3RWaWV3SWRcblx0XHRcdFx0IyDmiorop4blm77mnYPpmZDphY3nva7kuK3pu5jorqTnmoRhbGzop4blm75pZOi9rOaNouaIkGFsbOWFs+mUruWtl1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5kaXNhYmxlZF9saXN0X3ZpZXdzID0gXy5tYXAgZGlzYWJsZWRfbGlzdF92aWV3cywgKGxpc3Rfdmlld19pdGVtKSAtPlxuXHRcdFx0XHRcdHJldHVybiBpZiBkZWZhdWx0TGlzdFZpZXdJZCA9PSBsaXN0X3ZpZXdfaXRlbSB0aGVuIFwiYWxsXCIgZWxzZSBsaXN0X3ZpZXdfaXRlbVxuXHRcdHNlbGYucGVybWlzc2lvbnMgPSBuZXcgUmVhY3RpdmVWYXIocGVybWlzc2lvbnMpXG4jXHRcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG4jXHRcdFx0aWYgZmllbGRcbiNcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5yZWFkYWJsZV9maWVsZHMsIGZpZWxkX25hbWUpIDwgMFxuI1x0XHRcdFx0XHRpZiBmaWVsZC5oaWRkZW5cbiNcdFx0XHRcdFx0XHRyZXR1cm5cbiNcdFx0XHRcdFx0aWYgXy5pbmRleE9mKHBlcm1pc3Npb25zPy51bmVkaXRhYmxlX2ZpZWxkcywgZmllbGRfbmFtZSkgPiAtMVxuI1x0XHRcdFx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuI1x0XHRcdFx0XHRcdGZpZWxkLmRpc2FibGVkID0gdHJ1ZVxuI1x0XHRcdFx0XHRcdCMg5b2T5Y+q6K+75pe277yM5aaC5p6c5LiN5Y675o6J5b+F5aGr5a2X5q6177yMYXV0b2Zvcm3mmK/kvJrmiqXplJnnmoRcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZXF1aXJlZCA9IGZhbHNlXG4jXHRcdFx0XHRlbHNlXG4jXHRcdFx0XHRcdGZpZWxkLmhpZGRlbiA9IHRydWVcblx0ZWxzZVxuXHRcdHNlbGYucGVybWlzc2lvbnMgPSBudWxsXG5cblx0X2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpXG5cblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tfZGIuX25hbWVdID0gX2RiXG5cblx0c2VsZi5kYiA9IF9kYlxuXG5cdHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZVxuXG5cdHNjaGVtYSA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHNlbGYpXG5cdHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpXG5cdGlmIHNlbGYubmFtZSAhPSBcInVzZXJzXCIgYW5kIHNlbGYubmFtZSAhPSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiLCBcImFjdGlvbl9maWVsZF91cGRhdGVzXCIsIFwib2JqZWN0X2xpc3R2aWV3c1wiXSwgc2VsZi5uYW1lKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXHRcdGVsc2Vcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblx0aWYgc2VsZi5uYW1lID09IFwidXNlcnNcIlxuXHRcdF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWFcblxuXHRpZiBfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cblx0Q3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmXG5cblx0cmV0dXJuIHNlbGZcblxuIyBDcmVhdG9yLk9iamVjdC5wcm90b3R5cGUuaTE4biA9ICgpLT5cbiMgXHQjIHNldCBvYmplY3QgbGFiZWxcbiMgXHRzZWxmID0gdGhpc1xuXG4jIFx0a2V5ID0gc2VsZi5uYW1lXG4jIFx0aWYgdChrZXkpID09IGtleVxuIyBcdFx0aWYgIXNlbGYubGFiZWxcbiMgXHRcdFx0c2VsZi5sYWJlbCA9IHNlbGYubmFtZVxuIyBcdGVsc2VcbiMgXHRcdHNlbGYubGFiZWwgPSB0KGtleSlcblxuIyBcdCMgc2V0IGZpZWxkIGxhYmVsc1xuIyBcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG4jIFx0XHRma2V5ID0gc2VsZi5uYW1lICsgXCJfXCIgKyBmaWVsZF9uYW1lXG4jIFx0XHRpZiB0KGZrZXkpID09IGZrZXlcbiMgXHRcdFx0aWYgIWZpZWxkLmxhYmVsXG4jIFx0XHRcdFx0ZmllbGQubGFiZWwgPSBmaWVsZF9uYW1lXG4jIFx0XHRlbHNlXG4jIFx0XHRcdGZpZWxkLmxhYmVsID0gdChma2V5KVxuIyBcdFx0c2VsZi5zY2hlbWE/Ll9zY2hlbWE/W2ZpZWxkX25hbWVdPy5sYWJlbCA9IGZpZWxkLmxhYmVsXG5cblxuIyBcdCMgc2V0IGxpc3R2aWV3IGxhYmVsc1xuIyBcdF8uZWFjaCBzZWxmLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cbiMgXHRcdGkxOG5fa2V5ID0gc2VsZi5uYW1lICsgXCJfbGlzdHZpZXdfXCIgKyBpdGVtX25hbWVcbiMgXHRcdGlmIHQoaTE4bl9rZXkpID09IGkxOG5fa2V5XG4jIFx0XHRcdGlmICFpdGVtLmxhYmVsXG4jIFx0XHRcdFx0aXRlbS5sYWJlbCA9IGl0ZW1fbmFtZVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHRpdGVtLmxhYmVsID0gdChpMThuX2tleSlcblxuXG5DcmVhdG9yLmdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4ID0gKG9iamVjdCktPlxuXHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcblx0IyBpZiBvYmplY3Rcblx0IyBcdGlmICFvYmplY3QuZGF0YWJhc2VfbmFtZSB8fCBvYmplY3QuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xuXHQjIFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcblx0IyBcdGVsc2Vcblx0IyBcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS8je29iamVjdC5kYXRhYmFzZV9uYW1lfVwiXG5cbiMgaWYgTWV0ZW9yLmlzQ2xpZW50XG5cbiMgXHRNZXRlb3Iuc3RhcnR1cCAtPlxuIyBcdFx0VHJhY2tlci5hdXRvcnVuIC0+XG4jIFx0XHRcdGlmIFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgJiYgQ3JlYXRvci5ib290c3RyYXBMb2FkZWQ/LmdldCgpXG4jIFx0XHRcdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cbiMgXHRcdFx0XHRcdG9iamVjdC5pMThuKClcblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0aWYgIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkICYmIENyZWF0b3IuT2JqZWN0c1xuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChvYmplY3QpLT5cblx0XHRcdG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpXG5cbiIsInZhciBjbG9uZTtcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fTtcblxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgaWYgKG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJyk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdF9uYW1lO1xufTtcblxuQ3JlYXRvci5PYmplY3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHZhciBfYmFzZU9iamVjdCwgX2RiLCBkZWZhdWx0TGlzdFZpZXdJZCwgZGVmYXVsdFZpZXcsIGRpc2FibGVkX2xpc3Rfdmlld3MsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNjaGVtYSwgc2VsZjtcbiAgX2Jhc2VPYmplY3QgPSBDcmVhdG9yLmJhc2VPYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfYmFzZU9iamVjdCA9IHtcbiAgICAgIGFjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zLFxuICAgICAgZmllbGRzOiB7fSxcbiAgICAgIHRyaWdnZXJzOiB7fSxcbiAgICAgIHBlcm1pc3Npb25fc2V0OiB7fVxuICAgIH07XG4gIH1cbiAgc2VsZiA9IHRoaXM7XG4gIGlmICghb3B0aW9ucy5uYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcbiAgfVxuICBzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gIHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWw7XG4gIHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvbjtcbiAgc2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb247XG4gIHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlldztcbiAgc2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtO1xuICBzZWxmLnJlbGF0ZWRMaXN0ID0gb3B0aW9ucy5yZWxhdGVkTGlzdDtcbiAgc2VsZi5yZWxhdGVkX2xpc3RzID0gb3B0aW9ucy5yZWxhdGVkX2xpc3RzO1xuICBzZWxmLnZlcnNpb24gPSBvcHRpb25zLnZlcnNpb24gfHwgMS4wO1xuICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSB8fCBvcHRpb25zLmlzX2VuYWJsZSA9PT0gdHJ1ZSkge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IGZhbHNlO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKSkge1xuICAgICAgc2VsZi5hbGxvd19jdXN0b21BY3Rpb25zID0gb3B0aW9ucy5hbGxvd19jdXN0b21BY3Rpb25zO1xuICAgIH1cbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2V4Y2x1ZGVfYWN0aW9ucycpKSB7XG4gICAgICBzZWxmLmV4Y2x1ZGVfYWN0aW9ucyA9IG9wdGlvbnMuZXhjbHVkZV9hY3Rpb25zO1xuICAgIH1cbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2FsbG93X3JlbGF0ZWRMaXN0JykpIHtcbiAgICAgIHNlbGYuYWxsb3dfcmVsYXRlZExpc3QgPSBvcHRpb25zLmFsbG93X3JlbGF0ZWRMaXN0O1xuICAgIH1cbiAgfVxuICBzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2g7XG4gIHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXM7XG4gIHNlbGYuZW5hYmxlX3Rhc2tzID0gb3B0aW9ucy5lbmFibGVfdGFza3M7XG4gIHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXM7XG4gIHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXQ7XG4gIHNlbGYuZW5hYmxlX2V2ZW50cyA9IG9wdGlvbnMuZW5hYmxlX2V2ZW50cztcbiAgaWYgKG9wdGlvbnMucGFnaW5nKSB7XG4gICAgc2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZztcbiAgfVxuICBzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuO1xuICBzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09PSB2b2lkIDApIHx8IG9wdGlvbnMuZW5hYmxlX2FwaTtcbiAgc2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbTtcbiAgc2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZTtcbiAgc2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzO1xuICBzZWxmLmVuYWJsZV9wcm9jZXNzID0gb3B0aW9ucy5lbmFibGVfcHJvY2VzcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gICAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgfVxuICBzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvdztcbiAgc2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnk7XG4gIHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpO1xuICBzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlcjtcbiAgc2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaDtcbiAgc2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsO1xuICBzZWxmLmVuYWJsZV9hcHByb3ZhbHMgPSBvcHRpb25zLmVuYWJsZV9hcHByb3ZhbHM7XG4gIHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvdztcbiAgc2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvdztcbiAgc2VsZi5lbmFibGVfaW5saW5lX2VkaXQgPSBvcHRpb25zLmVuYWJsZV9pbmxpbmVfZWRpdDtcbiAgc2VsZi5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzO1xuICBzZWxmLm1hc3RlcnMgPSBvcHRpb25zLm1hc3RlcnM7XG4gIHNlbGYubG9va3VwX2RldGFpbHMgPSBvcHRpb25zLmxvb2t1cF9kZXRhaWxzO1xuICBpZiAoXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50JykpIHtcbiAgICBzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudDtcbiAgfVxuICBzZWxmLmlkRmllbGROYW1lID0gJ19pZCc7XG4gIGlmIChvcHRpb25zLmRhdGFiYXNlX25hbWUpIHtcbiAgICBzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWU7XG4gIH1cbiAgaWYgKCFvcHRpb25zLmZpZWxkcykge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBmaWVsZHMnKTtcbiAgfVxuICBzZWxmLmZpZWxkcyA9IGNsb25lKG9wdGlvbnMuZmllbGRzKTtcbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC5pc19uYW1lKSB7XG4gICAgICBzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkX25hbWUgPT09ICduYW1lJyAmJiAhc2VsZi5OQU1FX0ZJRUxEX0tFWSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5wcmltYXJ5KSB7XG4gICAgICBzZWxmLmlkRmllbGROYW1lID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSkge1xuICAgICAgICBpZiAoZmllbGRfbmFtZSA9PT0gJ3NwYWNlJykge1xuICAgICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBmaWVsZC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmICghb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PT0gJ21ldGVvci1tb25nbycpIHtcbiAgICBfLmVhY2goX2Jhc2VPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgaWYgKCFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSkge1xuICAgICAgICBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKTtcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goc2VsZi5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09ICdhdXRvbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdmb3JtdWxhJykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdzdW1tYXJ5Jykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBzZWxmLmxpc3Rfdmlld3MgPSB7fTtcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KHNlbGYubmFtZSk7XG4gIF8uZWFjaChvcHRpb25zLmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBvaXRlbTtcbiAgICBvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRWaWV3LCBpdGVtLCBpdGVtX25hbWUpO1xuICAgIHJldHVybiBzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtO1xuICB9KTtcbiAgc2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QudHJpZ2dlcnMpO1xuICBfLmVhY2gob3B0aW9ucy50cmlnZ2VycywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgICByZXR1cm4gc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIHNlbGYuYWN0aW9ucyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QuYWN0aW9ucyk7XG4gIF8uZWFjaChvcHRpb25zLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBjb3B5SXRlbTtcbiAgICBpZiAoIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICBjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pO1xuICAgIGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXTtcbiAgICByZXR1cm4gc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSk7XG4gIH0pO1xuICBfLmVhY2goc2VsZi5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lID0gaXRlbV9uYW1lO1xuICB9KTtcbiAgc2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSk7XG4gIHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KTtcbiAgaWYgKCFvcHRpb25zLnBlcm1pc3Npb25fc2V0KSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldCA9IHt9O1xuICB9XG4gIGlmICghKChyZWYgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmLmFkbWluIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSk7XG4gIH1cbiAgaWYgKCEoKHJlZjEgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmMS51c2VyIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pO1xuICB9XG4gIF8uZWFjaChvcHRpb25zLnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHJldHVybiBzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9ucztcbiAgICBkaXNhYmxlZF9saXN0X3ZpZXdzID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgOiB2b2lkIDA7XG4gICAgaWYgKGRpc2FibGVkX2xpc3Rfdmlld3MgIT0gbnVsbCA/IGRpc2FibGVkX2xpc3Rfdmlld3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICBkZWZhdWx0TGlzdFZpZXdJZCA9IChyZWYyID0gb3B0aW9ucy5saXN0X3ZpZXdzKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLmFsbCkgIT0gbnVsbCA/IHJlZjMuX2lkIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGRlZmF1bHRMaXN0Vmlld0lkKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcChkaXNhYmxlZF9saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXdfaXRlbSkge1xuICAgICAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCA9PT0gbGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBcImFsbFwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdF92aWV3X2l0ZW07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG51bGw7XG4gIH1cbiAgX2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpO1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGI7XG4gIHNlbGYuZGIgPSBfZGI7XG4gIHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZTtcbiAgc2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZik7XG4gIHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpO1xuICBpZiAoc2VsZi5uYW1lICE9PSBcInVzZXJzXCIgJiYgc2VsZi5uYW1lICE9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiLCBcImFjdGlvbl9maWVsZF91cGRhdGVzXCIsIFwib2JqZWN0X2xpc3R2aWV3c1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzZWxmLm5hbWUgPT09IFwidXNlcnNcIikge1xuICAgIF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWE7XG4gIH1cbiAgaWYgKF8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIl0sIHNlbGYubmFtZSkpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7XG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBDcmVhdG9yLm9iamVjdHNCeU5hbWVbc2VsZi5fY29sbGVjdGlvbl9uYW1lXSA9IHNlbGY7XG4gIHJldHVybiBzZWxmO1xufTtcblxuQ3JlYXRvci5nZXRPYmplY3RPRGF0YVJvdXRlclByZWZpeCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCI7XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgaWYgKCFDcmVhdG9yLmJvb3RzdHJhcExvYWRlZCAmJiBDcmVhdG9yLk9iamVjdHMpIHtcbiAgICByZXR1cm4gXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICByZXR1cm4gbmV3IENyZWF0b3IuT2JqZWN0KG9iamVjdCk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRTZWxlY3RPcHRpb25zID0gKGZpZWxkU2NoZW1hKSAtPlxuXHRvcHRpb25zID0gZmllbGRTY2hlbWEub3B0aW9uc1xuXHR1bmxlc3Mgb3B0aW9uc1xuXHRcdHJldHVyblxuXHRkYXRhX3R5cGUgPSBmaWVsZFNjaGVtYS5kYXRhX3R5cGVcblx0aWYgIV8uaXNGdW5jdGlvbihvcHRpb25zKSBhbmQgZGF0YV90eXBlIGFuZCBkYXRhX3R5cGUgIT0gJ3RleHQnXG5cdFx0IyDpm7bku6PnoIHnlYzpnaLphY3nva5vcHRpb25z6YCJ6aG55YC85Y+q5pSv5oyB5a2X56ym5Liy77yM5omA5Lul5b2TZGF0YV90eXBl5Li65pWw5YC85oiWYm9vbGVhbuaXtu+8jOWPquiDveW8uuihjOaKiumAiemhueWAvOWFiOi9rOaNouS4uuWvueW6lOeahOexu+Wei1xuXHRcdG9wdGlvbnMuZm9yRWFjaCAob3B0aW9uSXRlbSkgLT5cblx0XHRcdGlmIHR5cGVvZiBvcHRpb25JdGVtLnZhbHVlICE9ICdzdHJpbmcnXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgW1xuXHRcdFx0XHQnbnVtYmVyJ1xuXHRcdFx0XHQnY3VycmVuY3knXG5cdFx0XHRcdCdwZXJjZW50J1xuXHRcdFx0XS5pbmRleE9mKGRhdGFfdHlwZSkgPiAtMVxuXHRcdFx0XHRvcHRpb25JdGVtLnZhbHVlID0gTnVtYmVyKG9wdGlvbkl0ZW0udmFsdWUpXG5cdFx0XHRlbHNlIGlmIGRhdGFfdHlwZSA9PSAnYm9vbGVhbidcblx0XHRcdFx0IyDlj6rmnInkuLp0cnVl5omN5Li655yfXG5cdFx0XHRcdG9wdGlvbkl0ZW0udmFsdWUgPSBvcHRpb25JdGVtLnZhbHVlID09ICd0cnVlJ1xuXHRyZXR1cm4gb3B0aW9uc1xuXG5DcmVhdG9yLmdldE9iamVjdFNjaGVtYSA9IChvYmopIC0+XG5cdHVubGVzcyBvYmpcblx0XHRyZXR1cm5cblx0c2NoZW1hID0ge31cblxuXHRmaWVsZHNBcnIgPSBbXVxuXG5cdF8uZWFjaCBvYmouZmllbGRzICwgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgIV8uaGFzKGZpZWxkLCBcIm5hbWVcIilcblx0XHRcdGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lXG5cdFx0ZmllbGRzQXJyLnB1c2ggZmllbGRcblxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxuXG5cdFx0ZmllbGRfbmFtZSA9IGZpZWxkLm5hbWVcblxuXHRcdGZzID0ge31cblx0XHRpZiBmaWVsZC5yZWdFeFxuXHRcdFx0ZnMucmVnRXggPSBmaWVsZC5yZWdFeFxuXHRcdGZzLmF1dG9mb3JtID0ge31cblx0XHRmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlXG5cdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRhdXRvZm9ybV90eXBlID0gZmllbGQuYXV0b2Zvcm0/LnR5cGVcblxuXHRcdGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGQudHlwZSA9PSBcInBob25lXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbdGV4dF1cIiBvciBmaWVsZC50eXBlID09IFwiW3Bob25lXVwiXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnY29kZSdcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyXG5cdFx0XHRpZiBmaWVsZC5sYW5ndWFnZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidGV4dGFyZWFcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInBhc3N3b3JkXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRlXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxuXHRcdFx0XHRcdFx0IyBGaXggaW9zIDE0LCDmiYvmnLrlrqLmiLfnq6/lvoXlrqHmoLjmlofku7bml6XmnJ/mjqfku7bmmL7npLrmlYXpmpwgIzk5Me+8jGlvc+e7n+S4gOeUqFBD56uv5LiA5qC355qEanPmjqfku7Zcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXG5cdFx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuXHRcdFx0XHRcdFx0XHRcdHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXG5cdFx0XHRcdFx0XHRcdGRhdGVNb2JpbGVPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInRpbWVcIlxuXHRcdFx0ZnMudHlwZSA9IERhdGVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdHRpbWV6b25lSWQ6IFwidXRjXCJcblx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0dHlwZTogXCJ0aW1lXCJcblx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwiSEg6bW1cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxuXHRcdFx0XHRcdFx0IyBGaXggaW9zIDE0LCDmiYvmnLrlrqLmiLfnq6/lvoXlrqHmoLjmlofku7bml6XmnJ/mjqfku7bmmL7npLrmlYXpmpwgIzk5Me+8jGlvc+e7n+S4gOeUqFBD56uv5LiA5qC355qEanPmjqfku7Zcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG5cdFx0XHRcdFx0XHRcdFx0cGlja2VyVHlwZTogXCJyb2xsZXJzXCJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCJcblx0XHRcdFx0XHRcdFx0ZGF0ZU1vYmlsZU9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOi/memHjOeUqGFmRmllbGRJbnB1dOiAjOS4jeebtOaOpeeUqGF1dG9mb3Jt55qE5Y6f5Zug5piv5b2T5a2X5q616KKraGlkZGVu55qE5pe25YCZ5Y675omn6KGMZHhEYXRlQm94T3B0aW9uc+WPguaVsOS8muaKpemUmVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHR0eXBlOiBcImR4LWRhdGUtYm94XCJcblx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIltPYmplY3RdXCJcblx0XHRcdGZzLnR5cGUgPSBbT2JqZWN0XVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImh0bWxcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIiB8fCBsb2NhbGUgPT0gXCJ6aC1DTlwiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuLVVTXCJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHR0eXBlOiBcInN1bW1lcm5vdGVcIlxuXHRcdFx0XHRcdGNsYXNzOiAnc3VtbWVybm90ZS1lZGl0b3InXG5cdFx0XHRcdFx0c2V0dGluZ3M6XG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDIwMFxuXHRcdFx0XHRcdFx0ZGlhbG9nc0luQm9keTogdHJ1ZVxuXHRcdFx0XHRcdFx0dG9vbGJhcjogIFtcblx0XHRcdFx0XHRcdFx0Wydmb250MScsIFsnc3R5bGUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSxcblx0XHRcdFx0XHRcdFx0Wydmb250MycsIFsnZm9udG5hbWUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnY29sb3InLCBbJ2NvbG9yJ11dLFxuXHRcdFx0XHRcdFx0XHRbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSxcblx0XHRcdFx0XHRcdFx0Wyd0YWJsZScsIFsndGFibGUnXV0sXG5cdFx0XHRcdFx0XHRcdFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sXG5cdFx0XHRcdFx0XHRcdFsndmlldycsIFsnY29kZXZpZXcnXV1cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdGZvbnROYW1lczogWydBcmlhbCcsICdDb21pYyBTYW5zIE1TJywgJ0NvdXJpZXIgTmV3JywgJ0hlbHZldGljYScsICdJbXBhY3QnLCAn5a6L5L2TJywn6buR5L2TJywn5b6u6L2v6ZuF6buRJywn5Lu/5a6LJywn5qW35L2TJywn6Zq25LmmJywn5bm85ZyGJ11cblx0XHRcdFx0XHRcdGxhbmc6IGxvY2FsZVxuXG5cdFx0ZWxzZSBpZiAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkLnR5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIpXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblxuXHRcdFx0aWYgIWZpZWxkLmhpZGRlblxuXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzXG5cblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVwZW5kT24gPSBmaWVsZC5kZXBlbmRfb25cblxuXHRcdFx0XHRpZiBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0XHRmcy5iZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblxuXHRcdFx0XHRmcy5maWx0ZXJzRnVuY3Rpb24gPSBpZiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gdGhlbiBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gZWxzZSBDcmVhdG9yLmV2YWx1YXRlRmlsdGVyc1xuXG5cdFx0XHRcdGlmIGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRcdGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXG5cdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b1xuXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRpZiBmaWVsZC5jcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oZmllbGQuY3JlYXRlRnVuY3Rpb24pXG5cdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gZmllbGQuY3JlYXRlRnVuY3Rpb25cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0X3JlZl9vYmogPSBDcmVhdG9yLk9iamVjdHNbZmllbGQucmVmZXJlbmNlX3RvXVxuXHRcdFx0XHRcdFx0XHRcdGlmIF9yZWZfb2JqPy5wZXJtaXNzaW9ucz8uYWxsb3dDcmVhdGVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmNyZWF0ZUZ1bmN0aW9uID0gKGxvb2t1cF9maWVsZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuI3tDcmVhdG9yLmdldENvbGxlY3Rpb24oZmllbGQucmVmZXJlbmNlX3RvKS5fbmFtZX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3JtSWQ6IFwibmV3I3tmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsJ18nKX1cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogXCIje2ZpZWxkLnJlZmVyZW5jZV90b31cIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25TdWNjZXNzOiAob3BlcmF0aW9uLCByZXN1bHQpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIHJlc3VsdC5vYmplY3RfbmFtZSA9PSBcIm9iamVjdHNcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLCB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsIGljb246IHJlc3VsdC52YWx1ZS5pY29ufV0sIHJlc3VsdC52YWx1ZS5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb29rdXBfZmllbGQuYWRkSXRlbXMoW3tsYWJlbDogcmVzdWx0LnZhbHVlW29iamVjdC5OQU1FX0ZJRUxEX0tFWV0gfHwgcmVzdWx0LnZhbHVlLmxhYmVsIHx8IHJlc3VsdC52YWx1ZS5uYW1lLCB2YWx1ZTogcmVzdWx0Ll9pZH1dLCByZXN1bHQuX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlXG5cblx0XHRcdFx0XHRpZiBfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGVcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zU29ydCA9IGZpZWxkLnJlZmVyZW5jZV9zb3J0XG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfbGltaXRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdFxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV90b19maWVsZFxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlVG9GaWVsZCA9IGZpZWxkLnJlZmVyZW5jZV90b19maWVsZFxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvID09IFwidXNlcnNcIlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0dXNlclwiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7liIbpg6jliJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7liIbpg6hcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWIhumDqOmDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZSBpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJvcmdhbml6YXRpb25zXCJcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiXG5cdFx0XHRcdFx0XHRpZiAhZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0XG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk6KGo56S66L+H5ruk5pWw5o2u5pe25piv5ZCm5Y+q5pi+56S65pys5YiG6YOo5LiL55qE5pWw5o2uXG5cdFx0XHRcdFx0XHRcdCMgaXNfY29tcGFueV9saW1pdGVk5Y+v5Lul6KKr5pS55YaZ6KaG55uW5oiQdHJ1ZS9mYWxzZeaIluWFtuS7lmZ1bmN0aW9uXG5cdFx0XHRcdFx0XHRcdGlmIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0XHQjIOacquWumuS5iWlzX2NvbXBhbnlfbGltaXRlZOWxnuaAp+aXtum7mOiupOWkhOeQhumAu+i+ke+8mlxuXHRcdFx0XHRcdFx0XHRcdCMg5a+55b2T5YmN5a+56LGh5pyJdmlld0FsbFJlY29yZHPmnYPpmZDliJnkuI3pmZDliLbmiYDlsZ7liIbpg6jliJfooajmn6XnnIvmnYPpmZDvvIzlkKbliJnlj6rmmL7npLrlvZPliY3miYDlsZ7liIbpg6hcblx0XHRcdFx0XHRcdFx0XHQjIOazqOaEj+S4jeaYr3JlZmVyZW5jZV90b+WvueixoeeahHZpZXdBbGxSZWNvcmRz5p2D6ZmQ77yM6ICM5piv5b2T5YmN5a+56LGh55qEXG5cdFx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9iai5wZXJtaXNzaW9ucz8uZ2V0KClcblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnM/LnZpZXdBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOWmguaenOWtl+auteaJgOWxnuWvueixoeaYr+eUqOaIt+aIlue7hOe7h++8jOWImeaYr+WQpumZkOWItuaYvuekuuaJgOWxnuWIhumDqOmDqOmXqOS4jm1vZGlmeUFsbFJlY29yZHPmnYPpmZDlhbPogZRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgaXNVbkxpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIF8uaXNGdW5jdGlvbiBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdCMg5Lyg5YWl5b2T5YmN5a+56LGh55qE5p2D6ZmQ77yM5Zyo5Ye95pWw5Lit5qC55o2u5p2D6ZmQ6K6h566X5piv5ZCm6KaB6ZmQ5Yi25Y+q5p+l55yL5pys5YiG6YOoXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdCMg5pyN5Yqh56uv55So5LiN5YiwaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgdHlwZW9mKGZpZWxkLnJlZmVyZW5jZV90bykgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG8oKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0XHRcdFx0XHRcdGZzLmJsYWNrYm94ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZVxuXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIub1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBTdHJpbmdcblx0XHRcdFx0XHRcdFx0XHRhdXRvZm9ybToge29taXQ6IHRydWV9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBbU3RyaW5nXVxuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b11cblxuXHRcdFx0XHRcdFx0X29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXVxuXHRcdFx0XHRcdFx0aWYgX29iamVjdCBhbmQgX29iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIlxuXG5cdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdXG5cdFx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90by5mb3JFYWNoIChfcmVmZXJlbmNlKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBfb2JqZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IF9vYmplY3Q/LmxhYmVsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogX29iamVjdD8uaWNvblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbms6ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBcIi9hcHAvI3tTZXNzaW9uLmdldCgnYXBwX2lkJyl9LyN7X3JlZmVyZW5jZX0vdmlldy9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0OiBfcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb25cblxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIlxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiXG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb25cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gXCJcIlxuXHRcdFx0IyDlm6DkuLrliJfooajop4blm77lj7Pkvqfov4fmu6Tlmajov5jmmK/nlKjnmoTogIHooajljZXnmoRsb29rdXDlkoxzZWxlY3Tmjqfku7bvvIzmiYDku6XkuIrpnaLnmoTku6PnoIHlp4vnu4jkv53mjIHljp/moLfpnIDopoHmiafooYxcblx0XHRcdCMg5LiL6Z2i5piv6YWN572u5LqGZGF0YV90eXBl5pe277yM6aKd5aSW5aSE55CG55qE6YC76L6RXG5cdFx0XHRpZiBmaWVsZC5kYXRhX3R5cGUgYW5kIGZpZWxkLmRhdGFfdHlwZSAhPSBcInRleHRcIlxuXHRcdFx0XHRpZiBbXCJudW1iZXJcIiwgXCJjdXJyZW5jeVwiLCBcInBlcmNlbnRcIl0uaW5kZXhPZihmaWVsZC5kYXRhX3R5cGUpID4gLTFcblx0XHRcdFx0XHRmc1R5cGUgPSBOdW1iZXJcblx0XHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdFx0XHRlbHNlIGlmIGZpZWxkLmRhdGFfdHlwZSA9PSBcImJvb2xlYW5cIlxuXHRcdFx0XHRcdGZzVHlwZSA9IEJvb2xlYW5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGZzVHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy50eXBlID0gZnNUeXBlXG5cdFx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdFx0ZnMudHlwZSA9IFtmc1R5cGVdXG5cdFx0XHRcdFx0XG5cdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBDcmVhdG9yLmdldFNlbGVjdE9wdGlvbnMoZmllbGQpXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY3VycmVuY3lcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0XHRlbHNlIGlmIGZpZWxkPy5zY2FsZSAhPSAwXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gMlxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm51bWJlclwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJib29sZWFuXCJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidG9nZ2xlXCJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi10b2dnbGVcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInJlZmVyZW5jZVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY2hlY2tib3hcIlxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlXCJcblx0XHRcdGNvbGxlY3Rpb25OYW1lID0gZmllbGQuY29sbGVjdGlvbiB8fCBcImZpbGVzXCIgIyBjb2xsZWN0aW9uIOm7mOiupOaYryAnZmlsZXMnXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTmFtZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImZpbGVzaXplXCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PSBcIm9iamVjdFwiXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZ3JpZFwiXG5cdFx0XHRmcy50eXBlID0gQXJyYXlcblx0XHRcdGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIlxuXG5cdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHR0eXBlOiBPYmplY3Rcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJpbWFnZVwiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2ltYWdlcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXZhdGFyXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXZhdGFycydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF1ZGlvXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXVkaW9zJ1xuXHRcdFx0XHRcdFx0YWNjZXB0OiAnYXVkaW8vKidcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ2aWRlb1wiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ3ZpZGVvcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ3ZpZGVvLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibG9jYXRpb25cIlxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIlxuXHRcdFx0ZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIlxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibWFya2Rvd25cIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1tYXJrZG93blwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICd1cmwnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHQjIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LlVybFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zVXJsJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZW1haWwnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcblx0XHRcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdzdW1tYXJ5J1xuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cblx0XHQjIGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xuXHRcdCMgXHRmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtmaWVsZHM6IHtmaWVsZDogT2JqZWN0LmFzc2lnbih7fSwgZmllbGQsIHt0eXBlOiBmaWVsZC5kYXRhX3R5cGV9KX19KVtmaWVsZC5uYW1lXVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAncGVyY2VudCdcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucHJlY2lzaW9uID0gZmllbGQucHJlY2lzaW9uIHx8IDE4XG5cdFx0XHR1bmxlc3MgXy5pc051bWJlcihmaWVsZC5zY2FsZSlcblx0XHRcdFx0IyDmsqHphY3nva7lsI/mlbDkvY3mlbDliJnmjInlsI/mlbDkvY3mlbAw5p2l5aSE55CG77yM5Y2z6buY6K6k5pi+56S65Li65pW05pWw55qE55m+5YiG5q+U77yM5q+U5aaCMjAl77yM5q2k5pe25o6n5Lu25Y+v5Lul6L6T5YWlMuS9jeWwj+aVsO+8jOi9rOaIkOeZvuWIhuavlOWwseaYr+aVtOaVsFxuXHRcdFx0XHRmaWVsZC5zY2FsZSA9IDBcblx0XHRcdCMgYXV0b2Zvcm3mjqfku7bkuK3lsI/mlbDkvY3mlbDlp4vnu4jmr5TphY3nva7nmoTkvY3mlbDlpJoy5L2NXG5cdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlICsgMlxuXHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlXG5cdFx0XHRmcy50eXBlID0gZmllbGQudHlwZVxuXG5cdFx0aWYgZmllbGQubGFiZWxcblx0XHRcdGZzLmxhYmVsID0gZmllbGQubGFiZWxcblxuI1x0XHRpZiBmaWVsZC5hbGxvd2VkVmFsdWVzXG4jXHRcdFx0ZnMuYWxsb3dlZFZhbHVlcyA9IGZpZWxkLmFsbG93ZWRWYWx1ZXNcblxuXHRcdGlmICFmaWVsZC5yZXF1aXJlZFxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXG5cblx0XHQjIFvnrb7nuqblr7nosaHlkIzml7bphY3nva7kuoZjb21wYW55X2lkc+W/heWhq+WPinVuZWRpdGFibGVfZmllbGRz6YCg5oiQ6YOo5YiG55So5oi35paw5bu6562+57qm5a+56LGh5pe25oql6ZSZICMxOTJdKGh0dHBzOi8vZ2l0aHViLmNvbS9zdGVlZG9zL3N0ZWVkb3MtcHJvamVjdC1kenVnL2lzc3Vlcy8xOTIpXG5cdFx0IyDlkI7lj7Dlp4vnu4jorr7nva5yZXF1aXJlZOS4umZhbHNlXG5cdFx0aWYgIU1ldGVvci5pc0NsaWVudFxuXHRcdFx0ZnMub3B0aW9uYWwgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC51bmlxdWVcblx0XHRcdGZzLnVuaXF1ZSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLm9taXRcblx0XHRcdGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5ncm91cFxuXHRcdFx0ZnMuYXV0b2Zvcm0uZ3JvdXAgPSBmaWVsZC5ncm91cFxuXG5cdFx0aWYgZmllbGQuaXNfd2lkZVxuXHRcdFx0ZnMuYXV0b2Zvcm0uaXNfd2lkZSA9IHRydWVcblxuXHRcdGlmIGZpZWxkLmhpZGRlblxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCJcblxuXHRcdGlmIChmaWVsZC50eXBlID09IFwic2VsZWN0XCIpIG9yIChmaWVsZC50eXBlID09IFwibG9va3VwXCIpIG9yIChmaWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiKVxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLmZpbHRlcmFibGUpID09ICd1bmRlZmluZWQnXG5cdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXG5cdFx0aWYgZmllbGQubmFtZSA9PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZVxuXHRcdFx0aWYgdHlwZW9mKGZpZWxkLnNlYXJjaGFibGUpID09ICd1bmRlZmluZWQnXG5cdFx0XHRcdGZpZWxkLnNlYXJjaGFibGUgPSB0cnVlXG5cblx0XHRpZiBhdXRvZm9ybV90eXBlXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gYXV0b2Zvcm1fdHlwZVxuXG5cdFx0aWYgZmllbGQuZGVmYXVsdFZhbHVlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gKCktPlxuXHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLkZvcm11bGFyLnJ1bihmaWVsZC5kZWZhdWx0VmFsdWUsIHt1c2VySWQ6IE1ldGVvci51c2VySWQoKSwgc3BhY2VJZDogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCBub3c6IG5ldyBEYXRlKCl9KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblx0XHRcdCMgXHRpZiAhXy5pc0Z1bmN0aW9uKGZpZWxkLmRlZmF1bHRWYWx1ZSlcblx0XHRcdCMgXHRcdGZzLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXG5cdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuZGlzYWJsZWRcblx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuaW5saW5lSGVscFRleHRcblx0XHRcdGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHRcblxuXHRcdGlmIGZpZWxkLmJsYWNrYm94XG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcblxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWluJylcblx0XHRcdGZzLm1pbiA9IGZpZWxkLm1pblxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWF4Jylcblx0XHRcdGZzLm1heCA9IGZpZWxkLm1heFxuXG5cdFx0IyDlj6rmnInnlJ/kuqfnjq/looPmiY3ph43lu7rntKLlvJVcblx0XHRpZiBNZXRlb3IuaXNQcm9kdWN0aW9uXG5cdFx0XHRpZiBmaWVsZC5pbmRleFxuXHRcdFx0XHRmcy5pbmRleCA9IGZpZWxkLmluZGV4XG5cdFx0XHRlbHNlIGlmIGZpZWxkLnNvcnRhYmxlXG5cdFx0XHRcdGZzLmluZGV4ID0gdHJ1ZVxuXG5cdFx0c2NoZW1hW2ZpZWxkX25hbWVdID0gZnNcblxuXHRyZXR1cm4gc2NoZW1hXG5cblxuQ3JlYXRvci5nZXRGaWVsZERpc3BsYXlWYWx1ZSA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpLT5cblx0aHRtbCA9IGZpZWxkX3ZhbHVlXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuIFwiXCJcblx0ZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpXG5cdGlmICFmaWVsZFxuXHRcdHJldHVybiBcIlwiXG5cblx0aWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpXG5cdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxuXHRcdGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG5cblx0cmV0dXJuIGh0bWxcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSAoZmllbGRfdHlwZSktPlxuXHRyZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwidGltZVwiLCBcImN1cnJlbmN5XCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpLT5cblx0YnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSlcblx0aWYgYnVpbHRpblZhbHVlc1xuXHRcdF8uZm9yRWFjaCBidWlsdGluVmFsdWVzLCAoYnVpbHRpbkl0ZW0sIGtleSktPlxuXHRcdFx0b3BlcmF0aW9ucy5wdXNoKHtsYWJlbDogYnVpbHRpbkl0ZW0ubGFiZWwsIHZhbHVlOiBrZXl9KVxuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzID0gKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpLT5cblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSAoZmllbGRfdHlwZSwga2V5KS0+XG5cdCMg6L+H5ruk5Zmo5a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdGlmIFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSAoZmllbGRfdHlwZSwgdmFsdWUpLT5cblx0IyDmoLnmja7ov4fmu6TlmajnmoTov4fmu6TlgLzvvIzojrflj5blr7nlupTnmoTlhoXnva7ov5DnrpfnrKZcblx0IyDmr5TlpoJ2YWx1ZeS4umxhc3RfeWVhcu+8jOi/lOWbnmJldHdlZW5fdGltZV9sYXN0X3llYXJcblx0dW5sZXNzIF8uaXNTdHJpbmcodmFsdWUpXG5cdFx0cmV0dXJuXG5cdGJldHdlZW5CdWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxuXHR1bmxlc3MgYmV0d2VlbkJ1aWx0aW5WYWx1ZXNcblx0XHRyZXR1cm5cblx0cmVzdWx0ID0gbnVsbFxuXHRfLmVhY2ggYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIChpdGVtLCBvcGVyYXRpb24pLT5cblx0XHRpZiBpdGVtLmtleSA9PSB2YWx1ZVxuXHRcdFx0cmVzdWx0ID0gb3BlcmF0aW9uXG5cdHJldHVybiByZXN1bHRcblxuIyDlpoLmnpzlj6rmmK/kuLrliKTmlq1vcGVyYXRpb27mmK/lkKblrZjlnKjvvIzliJnmsqHlv4XopoHorqHnrpd2YWx1ZXPvvIzkvKDlhaVpc19jaGVja19vbmx55Li6dHJ1ZeWNs+WPr1xuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSAoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSktPlxuXHQjIOi/h+a7pOWZqOaXtumXtOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRyZXR1cm4ge1xuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc195ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfeWVhclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF95ZWFyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfcXVhcnRlclwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9xdWFydGVyXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc19tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0X21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3Rfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RoaXNfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidGhpc193ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfd2Vla1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF93ZWVrXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3llc3RkYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInllc3RkYXlcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9kYXlcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvZGF5XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX3RvbW9ycm93XCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b21vcnJvd1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8xMjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzdfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF83X2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8zMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzMwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF82MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzYwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF85MF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzkwX2RheXNcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF8xMjBfZGF5c1wiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8xMjBfZGF5c1wiKVxuXHR9XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSAobW9udGgpLT5cblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHJldHVybiAwXG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0cmV0dXJuIDNcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRyZXR1cm4gNlxuXHRcblx0cmV0dXJuIDlcblxuXG5DcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdHllYXItLVxuXHRcdG1vbnRoID0gOVxuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdG1vbnRoID0gMFxuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdG1vbnRoID0gM1xuXHRlbHNlIFxuXHRcdG1vbnRoID0gNlxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblxuQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5ID0gKHllYXIsbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHRpZiBtb250aCA8IDNcblx0XHRtb250aCA9IDNcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRtb250aCA9IDZcblx0ZWxzZSBpZiBtb250aCA8IDlcblx0XHRtb250aCA9IDlcblx0ZWxzZVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoID0gMFxuXHRcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmIG1vbnRoID09IDExXG5cdFx0cmV0dXJuIDMxXG5cdFxuXHRtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjRcblx0c3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCsxLCAxKVxuXHRkYXlzID0gKGVuZERhdGUtc3RhcnREYXRlKS9taWxsaXNlY29uZFxuXHRyZXR1cm4gZGF5c1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gKHllYXIsIG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0IyDmnIjku73kuLow5Luj6KGo5pys5bm055qE56ys5LiA5pyIXG5cdGlmIG1vbnRoID09IDBcblx0XHRtb250aCA9IDExXG5cdFx0eWVhci0tXG5cdFx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcblx0IyDlkKbliJks5Y+q5YeP5Y675pyI5Lu9XG5cdG1vbnRoLS07XG5cdHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0XG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cblx0IyDov4fmu6TlmahiZXR3ZWVu6L+Q566X56ym77yM546w566X5pel5pyfL+aXpeacn+aXtumXtOexu+Wei+Wtl+auteeahHZhbHVlc+WAvFxuXHRub3cgPSBuZXcgRGF0ZSgpXG5cdCMg5LiA5aSp55qE5q+r56eS5pWwXG5cdG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNFxuXHR5ZXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHR0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZClcblx0IyDkuIDlkajkuK3nmoTmn5DkuIDlpKlcblx0d2VlayA9IG5vdy5nZXREYXkoKVxuXHQjIOWHj+WOu+eahOWkqeaVsFxuXHRtaW51c0RheSA9IGlmIHdlZWsgIT0gMCB0aGVuIHdlZWsgLSAxIGVsc2UgNlxuXHRtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKVxuXHRzdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpICsgKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg5LiK5ZGo5pelXG5cdGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5LiK5ZGo5LiAXG5cdGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKVxuXHQjIOS4i+WRqOS4gFxuXHRuZXh0TW9uZGF5ID0gbmV3IERhdGUoc3VuZGF5LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxuXHQjIOS4i+WRqOaXpVxuXHRuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSlcblx0Y3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRwcmV2aW91c1llYXIgPSBjdXJyZW50WWVhciAtIDFcblx0bmV4dFllYXIgPSBjdXJyZW50WWVhciArIDFcblx0IyDlvZPliY3mnIjku71cblx0Y3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDorqHmlbDlubTjgIHmnIhcblx0eWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG5cdG1vbnRoID0gbm93LmdldE1vbnRoKClcblx0IyDmnKzmnIjnrKzkuIDlpKlcblx0Zmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixjdXJyZW50TW9udGgsMSlcblxuXHQjIOW9k+S4ujEy5pyI55qE5pe25YCZ5bm05Lu96ZyA6KaB5YqgMVxuXHQjIOaciOS7vemcgOimgeabtOaWsOS4ujAg5Lmf5bCx5piv5LiL5LiA5bm055qE56ys5LiA5Liq5pyIXG5cdGlmIGN1cnJlbnRNb250aCA9PSAxMVxuXHRcdHllYXIrK1xuXHRcdG1vbnRoKytcblx0ZWxzZVxuXHRcdG1vbnRoKytcblx0XG5cdCMg5LiL5pyI56ys5LiA5aSpXG5cdG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdCMg5LiL5pyI5pyA5ZCO5LiA5aSpXG5cdG5leHRNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoeWVhcixtb250aCxDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLG1vbnRoKSlcblx0IyDmnKzmnIjmnIDlkI7kuIDlpKlcblx0bGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOS4iuaciOesrOS4gOWkqVxuXHRsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4iuaciOacgOWQjuS4gOWkqVxuXHRsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKVxuXHQjIOacrOWto+W6puW8gOWni+aXpVxuXHR0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpLDEpXG5cdCMg5pys5a2j5bqm57uT5p2f5pelXG5cdHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIsQ3JlYXRvci5nZXRNb250aERheXMoY3VycmVudFllYXIsQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpKzIpKVxuXHQjIOS4iuWto+W6puW8gOWni+aXpVxuXHRsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIrlraPluqbnu5PmnZ/ml6Vcblx0bGFzdFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcblx0IyDkuIvlraPluqblvIDlp4vml6Vcblx0bmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiL5a2j5bqm57uT5p2f5pelXG5cdG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyLENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMikpXG5cdCMg6L+H5Y67N+WkqSBcblx0bGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MzDlpKlcblx0bGFzdF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgyOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrs2MOWkqVxuXHRsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzkw5aSpXG5cdGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67MTIw5aSpXG5cdGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU35aSpIFxuXHRuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUzMOWkqVxuXHRuZXh0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDI5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTYw5aSpXG5cdG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lOTDlpKlcblx0bmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaUxMjDlpKlcblx0bmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKVxuXG5cdHN3aXRjaCBrZXlcblx0XHR3aGVuIFwibGFzdF95ZWFyXCJcblx0XHRcdCPljrvlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7cHJldmlvdXNZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc195ZWFyXCJcblx0XHRcdCPku4rlubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tjdXJyZW50WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfeWVhclwiXG5cdFx0XHQj5piO5bm0XG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3llYXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTAxLTAxVDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7bmV4dFllYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4iuWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3F1YXJ0ZXJcIlxuXHRcdFx0I+acrOWto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3F1YXJ0ZXJcIlxuXHRcdFx0I+S4i+Wto+W6plxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9xdWFydGVyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0X21vbnRoXCJcblx0XHRcdCPkuIrmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckZpcnN0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckxhc3REYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX21vbnRoXCJcblx0XHRcdCPmnKzmnIhcblx0XHRcdHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfbW9udGhcIlxuXHRcdFx0I+S4i+aciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3Rfd2Vla1wiXG5cdFx0XHQj5LiK5ZGoXG5cdFx0XHRzdHJNb25kYXkgPSBtb21lbnQobGFzdE1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidGhpc193ZWVrXCJcblx0XHRcdCPmnKzlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChzdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJNb25kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3VuZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF93ZWVrXCJcblx0XHRcdCPkuIvlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF93ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ5ZXN0ZGF5XCJcblx0XHRcdCPmmKjlpKlcblx0XHRcdHN0clllc3RkYXkgPSBtb21lbnQoeWVzdGRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJZZXN0ZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0b2RheVwiXG5cdFx0XHQj5LuK5aSpXG5cdFx0XHRzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvZGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwidG9tb3Jyb3dcIlxuXHRcdFx0I+aYjuWkqVxuXHRcdFx0c3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvbW9ycm93XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clRvbW9ycm93fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF83X2RheXNcIlxuXHRcdFx0I+i/h+WOuzflpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIFxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8zMF9kYXlzXCJcblx0XHRcdCPov4fljrszMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF82MF9kYXlzXCJcblx0XHRcdCPov4fljrs2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF85MF9kYXlzXCJcblx0XHRcdCPov4fljrs5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF8xMjBfZGF5c1wiXG5cdFx0XHQj6L+H5Y67MTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfN19kYXlzXCJcblx0XHRcdCPmnKrmnaU35aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF83X2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8zMF9kYXlzXCJcblx0XHRcdCPmnKrmnaUzMOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzMwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF82MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU2MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzYwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF85MF9kYXlzXCJcblx0XHRcdCPmnKrmnaU5MOWkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzkwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF8xMjBfZGF5c1wiXG5cdFx0XHQj5pyq5p2lMTIw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN0YXJ0RGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0ckVuZERheX1UMjM6NTk6NTlaXCIpXG5cdFxuXHR2YWx1ZXMgPSBbc3RhcnRWYWx1ZSwgZW5kVmFsdWVdXG5cdGlmIGZpZWxkX3R5cGUgPT0gXCJkYXRldGltZVwiXG5cdFx0IyDml7bpl7TnsbvlnovlrZfmrrXvvIzlhoXnva7ml7bpl7TojIPlm7TlupTor6XogIPomZHlgY/np7vml7bljLrlgLzvvIzlkKbliJnov4fmu6TmlbDmja7lrZjlnKjlgY/lt65cblx0XHQjIOmdnuWGhee9ruaXtumXtOiMg+WbtOaXtu+8jOeUqOaIt+mAmui/h+aXtumXtOaOp+S7tumAieaLqeeahOiMg+WbtO+8jOS8muiHquWKqOWkhOeQhuaXtuWMuuWBj+W3ruaDheWGtVxuXHRcdCMg5pel5pyf57G75Z6L5a2X5q6177yM5pWw5o2u5bqT5pys5p2l5bCx5a2Y55qE5pivVVRD55qEMOeCue+8jOS4jeWtmOWcqOWBj+W3rlxuXHRcdF8uZm9yRWFjaCB2YWx1ZXMsIChmdiktPlxuXHRcdFx0aWYgZnZcblx0XHRcdFx0ZnYuc2V0SG91cnMoZnYuZ2V0SG91cnMoKSArIGZ2LmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCApXG5cdFxuXHRyZXR1cm4ge1xuXHRcdGxhYmVsOiBsYWJlbFxuXHRcdGtleToga2V5XG5cdFx0dmFsdWVzOiB2YWx1ZXNcblx0fVxuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKS0+XG5cdGlmIGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gJ2JldHdlZW4nXG5cdGVsc2UgaWYgW1widGV4dGFyZWFcIiwgXCJ0ZXh0XCIsIFwiY29kZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKVxuXHRcdHJldHVybiAnY29udGFpbnMnXG5cdGVsc2Vcblx0XHRyZXR1cm4gXCI9XCJcblxuQ3JlYXRvci5nZXRGaWVsZE9wZXJhdGlvbiA9IChmaWVsZF90eXBlKSAtPlxuXHQjIOaXpeacn+exu+WeizogZGF0ZSwgZGF0ZXRpbWUgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOaWh+acrOexu+WeizogdGV4dCwgdGV4dGFyZWEsIGh0bWwgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIsIFwic3RhcnRzd2l0aFwiXG5cdCMg6YCJ5oup57G75Z6LOiBsb29rdXAsIG1hc3Rlcl9kZXRhaWwsIHNlbGVjdCDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblx0IyDmlbDlgLznsbvlnos6IGN1cnJlbmN5LCBudW1iZXIgIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIiwgXCI8XCIsIFwiPlwiLCBcIjw9XCIsIFwiPj1cIlxuXHQjIOW4g+WwlOexu+WeizogYm9vbGVhbiAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiXG5cdCMg5pWw57uE57G75Z6LOiBjaGVja2JveCwgW3RleHRdICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblxuXHRvcHRpb25hbHMgPSB7XG5cdFx0ZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9lcXVhbFwiKSwgdmFsdWU6IFwiPVwifSxcblx0XHR1bmVxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fdW5lcXVhbFwiKSwgdmFsdWU6IFwiPD5cIn0sXG5cdFx0bGVzc190aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc190aGFuXCIpLCB2YWx1ZTogXCI8XCJ9LFxuXHRcdGdyZWF0ZXJfdGhhbjoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfdGhhblwiKSwgdmFsdWU6IFwiPlwifSxcblx0XHRsZXNzX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fbGVzc19vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPD1cIn0sXG5cdFx0Z3JlYXRlcl9vcl9lcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxcIiksIHZhbHVlOiBcIj49XCJ9LFxuXHRcdGNvbnRhaW5zOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fY29udGFpbnNcIiksIHZhbHVlOiBcImNvbnRhaW5zXCJ9LFxuXHRcdG5vdF9jb250YWluOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZG9lc19ub3RfY29udGFpblwiKSwgdmFsdWU6IFwibm90Y29udGFpbnNcIn0sXG5cdFx0c3RhcnRzX3dpdGg6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9zdGFydHNfd2l0aFwiKSwgdmFsdWU6IFwic3RhcnRzd2l0aFwifSxcblx0XHRiZXR3ZWVuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2VlblwiKSwgdmFsdWU6IFwiYmV0d2VlblwifSxcblx0fVxuXG5cdGlmIGZpZWxkX3R5cGUgPT0gdW5kZWZpbmVkXG5cdFx0cmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscylcblxuXHRvcGVyYXRpb25zID0gW11cblxuXHRpZiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbilcblx0XHRDcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyhmaWVsZF90eXBlLCBvcGVyYXRpb25zKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGRfdHlwZSA9PSBcInRleHRhcmVhXCIgb3IgZmllbGRfdHlwZSA9PSBcImh0bWxcIiBvciBmaWVsZF90eXBlID09IFwiY29kZVwiXG4jXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMuY29udGFpbnMsIG9wdGlvbmFscy5ub3RfY29udGFpbiwgb3B0aW9uYWxzLnN0YXJ0c193aXRoKVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImxvb2t1cFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJtYXN0ZXJfZGV0YWlsXCIgb3IgZmllbGRfdHlwZSA9PSBcInNlbGVjdFwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImN1cnJlbmN5XCIgb3IgZmllbGRfdHlwZSA9PSBcIm51bWJlclwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiYm9vbGVhblwiXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcImNoZWNrYm94XCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiW3RleHRdXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZVxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXG5cdHJldHVybiBvcGVyYXRpb25zXG5cbiMjI1xuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuIyMjXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSAob2JqZWN0X25hbWUpLT5cblx0ZmllbGRzID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpPy5maWVsZHNcblx0ZmllbGRzQXJyID0gW11cblxuXHRfLmVhY2ggZmllbGRzLCAoZmllbGQpLT5cblx0XHRmaWVsZHNBcnIucHVzaCB7bmFtZTogZmllbGQubmFtZSwgc29ydF9ubzogZmllbGQuc29ydF9ub31cblxuXHRmaWVsZHNOYW1lID0gW11cblx0Xy5lYWNoIF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCAoZmllbGQpLT5cblx0XHRmaWVsZHNOYW1lLnB1c2goZmllbGQubmFtZSlcblx0cmV0dXJuIGZpZWxkc05hbWVcbiIsIkNyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyA9IGZ1bmN0aW9uKGZpZWxkU2NoZW1hKSB7XG4gIHZhciBkYXRhX3R5cGUsIG9wdGlvbnM7XG4gIG9wdGlvbnMgPSBmaWVsZFNjaGVtYS5vcHRpb25zO1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGF0YV90eXBlID0gZmllbGRTY2hlbWEuZGF0YV90eXBlO1xuICBpZiAoIV8uaXNGdW5jdGlvbihvcHRpb25zKSAmJiBkYXRhX3R5cGUgJiYgZGF0YV90eXBlICE9PSAndGV4dCcpIHtcbiAgICBvcHRpb25zLmZvckVhY2goZnVuY3Rpb24ob3B0aW9uSXRlbSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25JdGVtLnZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoWydudW1iZXInLCAnY3VycmVuY3knLCAncGVyY2VudCddLmluZGV4T2YoZGF0YV90eXBlKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25JdGVtLnZhbHVlID0gTnVtYmVyKG9wdGlvbkl0ZW0udmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhX3R5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gb3B0aW9uSXRlbS52YWx1ZSA9IG9wdGlvbkl0ZW0udmFsdWUgPT09ICd0cnVlJztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBmaWVsZHNBcnIsIHNjaGVtYTtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc2NoZW1hID0ge307XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2gob2JqLmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGZpZWxkX25hbWUpIHtcbiAgICBpZiAoIV8uaGFzKGZpZWxkLCBcIm5hbWVcIikpIHtcbiAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzQXJyLnB1c2goZmllbGQpO1xuICB9KTtcbiAgXy5lYWNoKF8uc29ydEJ5KGZpZWxkc0FyciwgXCJzb3J0X25vXCIpLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHZhciBfb2JqZWN0LCBfcmVmX29iaiwgX3JlZmVyZW5jZV90bywgYXV0b2Zvcm1fdHlwZSwgY29sbGVjdGlvbk5hbWUsIGZpZWxkX25hbWUsIGZzLCBmc1R5cGUsIGlzVW5MaW1pdGVkLCBsb2NhbGUsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc2lPUygpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiLFxuICAgICAgICAgICAgICAgIHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCIsXG4gICAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGltZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICB0aW1lem9uZUlkOiBcInV0Y1wiLFxuICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgIHR5cGU6IFwidGltZVwiLFxuICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJISDptbVwiXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc2lPUygpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGQgSEg6bW1cIixcbiAgICAgICAgICAgICAgICBwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiLFxuICAgICAgICAgICAgICBkYXRlTW9iaWxlT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIltPYmplY3RdXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBbT2JqZWN0XTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiaHRtbFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICAgICAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIgfHwgbG9jYWxlID09PSBcInpoLUNOXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJlbi1VU1wiO1xuICAgICAgICB9XG4gICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICB0eXBlOiBcInN1bW1lcm5vdGVcIixcbiAgICAgICAgICBcImNsYXNzXCI6ICdzdW1tZXJub3RlLWVkaXRvcicsXG4gICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIGhlaWdodDogMjAwLFxuICAgICAgICAgICAgZGlhbG9nc0luQm9keTogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2xiYXI6IFtbJ2ZvbnQxJywgWydzdHlsZSddXSwgWydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLCBbJ2ZvbnQzJywgWydmb250bmFtZSddXSwgWydjb2xvcicsIFsnY29sb3InXV0sIFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLCBbJ3RhYmxlJywgWyd0YWJsZSddXSwgWydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZSddXSwgWyd2aWV3JywgWydjb2RldmlldyddXV0sXG4gICAgICAgICAgICBmb250TmFtZXM6IFsnQXJpYWwnLCAnQ29taWMgU2FucyBNUycsICdDb3VyaWVyIE5ldycsICdIZWx2ZXRpY2EnLCAnSW1wYWN0JywgJ+Wui+S9kycsICfpu5HkvZMnLCAn5b6u6L2v6ZuF6buRJywgJ+S7v+WuiycsICfmpbfkvZMnLCAn6Zq25LmmJywgJ+W5vOWchiddLFxuICAgICAgICAgICAgbGFuZzogbG9jYWxlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb247XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgfVxuICAgICAgaWYgKCFmaWVsZC5oaWRkZW4pIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnM7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlcGVuZE9uID0gZmllbGQuZGVwZW5kX29uO1xuICAgICAgICBpZiAoZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uKSB7XG4gICAgICAgICAgZnMuYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGZzLmZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA/IGZpZWxkLmZpbHRlcnNGdW5jdGlvbiA6IENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzO1xuICAgICAgICBpZiAoZmllbGQub3B0aW9uc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfdG8pIHtcbiAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICBpZiAoZmllbGQuY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uKSkge1xuICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmllbGQucmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICAgIF9yZWZfb2JqID0gQ3JlYXRvci5PYmplY3RzW2ZpZWxkLnJlZmVyZW5jZV90b107XG4gICAgICAgICAgICAgICAgaWYgKF9yZWZfb2JqICE9IG51bGwgPyAocmVmMSA9IF9yZWZfb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMS5hbGxvd0NyZWF0ZSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGZzLmNyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24obG9va3VwX2ZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNb2RhbC5zaG93KFwiQ3JlYXRvck9iamVjdE1vZGFsXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiBcIkNyZWF0b3IuQ29sbGVjdGlvbnMuXCIgKyAoQ3JlYXRvci5nZXRDb2xsZWN0aW9uKGZpZWxkLnJlZmVyZW5jZV90bykuX25hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgIGZvcm1JZDogXCJuZXdcIiArIChmaWVsZC5yZWZlcmVuY2VfdG8ucmVwbGFjZSgnLicsICdfJykpLFxuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdF9uYW1lOiBcIlwiICsgZmllbGQucmVmZXJlbmNlX3RvLFxuICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJpbnNlcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uKG9wZXJhdGlvbiwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQub2JqZWN0X25hbWUgPT09IFwib2JqZWN0c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiByZXN1bHQudmFsdWUuaWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0LnZhbHVlLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHJlc3VsdC52YWx1ZVtvYmplY3QuTkFNRV9GSUVMRF9LRVldIHx8IHJlc3VsdC52YWx1ZS5sYWJlbCB8fCByZXN1bHQudmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLCByZXN1bHQuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfLmlzQm9vbGVhbihmaWVsZC5jcmVhdGUpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5jcmVhdGUgPSBmaWVsZC5jcmVhdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2Vfc29ydCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc1NvcnQgPSBmaWVsZC5yZWZlcmVuY2Vfc29ydDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV9saW1pdCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VUb0ZpZWxkID0gZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcInVzZXJzXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdHVzZXJcIjtcbiAgICAgICAgICAgIGlmICghZmllbGQuaGlkZGVuICYmICFmaWVsZC5vbWl0KSB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gKHJlZjIgPSBvYmoucGVybWlzc2lvbnMpICE9IG51bGwgPyByZWYyLmdldCgpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlKFtcIm9yZ2FuaXphdGlvbnNcIiwgXCJ1c2Vyc1wiLCBcInNwYWNlX3VzZXJzXCJdLCBvYmoubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpc1VuTGltaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkKG9iai5wZXJtaXNzaW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQucmVmZXJlbmNlX3RvID09PSBcIm9yZ2FuaXphdGlvbnNcIikge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYzID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMy5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8uaXNBcnJheShfcmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgICBmcy50eXBlID0gT2JqZWN0O1xuICAgICAgICAgICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlO1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLm9cIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgIGF1dG9mb3JtOiB7XG4gICAgICAgICAgICAgICAgICBvbWl0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLmlkc1wiXSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8gPSBbX3JlZmVyZW5jZV90b107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dO1xuICAgICAgICAgICAgaWYgKF9vYmplY3QgJiYgX29iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3RUcmVlXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kID0gZmllbGQub3B0aW9uc01ldGhvZCB8fCBcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjtcbiAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2RQYXJhbXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW107XG4gICAgICAgICAgICAgICAgX3JlZmVyZW5jZV90by5mb3JFYWNoKGZ1bmN0aW9uKF9yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV07XG4gICAgICAgICAgICAgICAgICBpZiAoX29iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IF9yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QubGFiZWwgOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgICAgaWNvbjogX29iamVjdCAhPSBudWxsID8gX29iamVjdC5pY29uIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiL2FwcC9cIiArIChTZXNzaW9uLmdldCgnYXBwX2lkJykpICsgXCIvXCIgKyBfcmVmZXJlbmNlICsgXCIvdmlldy9cIjtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NMb29rdXBzXCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2U7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCI7XG4gICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgICAgICBpZiAoXy5oYXMoZmllbGQsICdmaXJzdE9wdGlvbicpKSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBmaWVsZC5maXJzdE9wdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS5maXJzdE9wdGlvbiA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmaWVsZC5kYXRhX3R5cGUgJiYgZmllbGQuZGF0YV90eXBlICE9PSBcInRleHRcIikge1xuICAgICAgICBpZiAoW1wibnVtYmVyXCIsIFwiY3VycmVuY3lcIiwgXCJwZXJjZW50XCJdLmluZGV4T2YoZmllbGQuZGF0YV90eXBlKSA+IC0xKSB7XG4gICAgICAgICAgZnNUeXBlID0gTnVtYmVyO1xuICAgICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLmRhdGFfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICBmc1R5cGUgPSBCb29sZWFuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzVHlwZSA9IFN0cmluZztcbiAgICAgICAgfVxuICAgICAgICBmcy50eXBlID0gZnNUeXBlO1xuICAgICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgICBmcy50eXBlID0gW2ZzVHlwZV07XG4gICAgICAgIH1cbiAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IENyZWF0b3IuZ2V0U2VsZWN0T3B0aW9ucyhmaWVsZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRvZ2dsZVwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInJlZmVyZW5jZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIjtcbiAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlXCIpIHtcbiAgICAgIGNvbGxlY3Rpb25OYW1lID0gZmllbGQuY29sbGVjdGlvbiB8fCBcImZpbGVzXCI7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25OYW1lO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlc2l6ZVwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImdyaWRcIikge1xuICAgICAgZnMudHlwZSA9IEFycmF5O1xuICAgICAgZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIjtcbiAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJpbWFnZVwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdpbWFnZXMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXZhdGFyXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F2YXRhcnMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF1ZGlvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F1ZGlvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdhdWRpby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ2aWRlb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICd2aWRlb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAndmlkZW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9jYXRpb25cIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCI7XG4gICAgICBmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiO1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJtYXJrZG93blwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1tYXJrZG93blwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3VybCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2VtYWlsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2Zvcm11bGEnKSB7XG4gICAgICBmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7XG4gICAgICAgICAgICB0eXBlOiBmaWVsZC5kYXRhX3R5cGVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVtmaWVsZC5uYW1lXTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdzdW1tYXJ5Jykge1xuICAgICAgZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge1xuICAgICAgICAgICAgdHlwZTogZmllbGQuZGF0YV90eXBlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlbZmllbGQubmFtZV07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAncGVyY2VudCcpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoIV8uaXNOdW1iZXIoZmllbGQuc2NhbGUpKSB7XG4gICAgICAgIGZpZWxkLnNjYWxlID0gMDtcbiAgICAgIH1cbiAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGUgKyAyO1xuICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZzLnR5cGUgPSBmaWVsZC50eXBlO1xuICAgIH1cbiAgICBpZiAoZmllbGQubGFiZWwpIHtcbiAgICAgIGZzLmxhYmVsID0gZmllbGQubGFiZWw7XG4gICAgfVxuICAgIGlmICghZmllbGQucmVxdWlyZWQpIHtcbiAgICAgIGZzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLnVuaXF1ZSkge1xuICAgICAgZnMudW5pcXVlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLm9taXQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZ3JvdXApIHtcbiAgICAgIGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXA7XG4gICAgfVxuICAgIGlmIChmaWVsZC5pc193aWRlKSB7XG4gICAgICBmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmhpZGRlbikge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgfVxuICAgIGlmICgoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpIHx8IChmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuZmlsdGVyYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5uYW1lID09PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5zZWFyY2hhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF1dG9mb3JtX3R5cGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGVmYXVsdFZhbHVlKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge1xuICAgICAgICAgICAgdXNlcklkOiBNZXRlb3IudXNlcklkKCksXG4gICAgICAgICAgICBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksXG4gICAgICAgICAgICBub3c6IG5ldyBEYXRlKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkLnJlYWRvbmx5KSB7XG4gICAgICBmcy5hdXRvZm9ybS5yZWFkb25seSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5kaXNhYmxlZCkge1xuICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuaW5saW5lSGVscFRleHQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHQ7XG4gICAgfVxuICAgIGlmIChmaWVsZC5ibGFja2JveCkge1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtaW4nKSkge1xuICAgICAgZnMubWluID0gZmllbGQubWluO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoZmllbGQsICdtYXgnKSkge1xuICAgICAgZnMubWF4ID0gZmllbGQubWF4O1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzUHJvZHVjdGlvbikge1xuICAgICAgaWYgKGZpZWxkLmluZGV4KSB7XG4gICAgICAgIGZzLmluZGV4ID0gZmllbGQuaW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLnNvcnRhYmxlKSB7XG4gICAgICAgIGZzLmluZGV4ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNjaGVtYVtmaWVsZF9uYW1lXSA9IGZzO1xuICB9KTtcbiAgcmV0dXJuIHNjaGVtYTtcbn07XG5cbkNyZWF0b3IuZ2V0RmllbGREaXNwbGF5VmFsdWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpIHtcbiAgdmFyIGZpZWxkLCBodG1sLCBvYmplY3Q7XG4gIGh0bWwgPSBmaWVsZF92YWx1ZTtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGZpZWxkID0gb2JqZWN0LmZpZWxkcyhmaWVsZF9uYW1lKTtcbiAgaWYgKCFmaWVsZCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIGlmIChmaWVsZC50eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpO1xuICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgaHRtbCA9IG1vbWVudCh0aGlzLnZhbCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gIH1cbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5DcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIFtcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcInRpbWVcIiwgXCJjdXJyZW5jeVwiLCBcIm51bWJlclwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKTtcbn07XG5cbkNyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgb3BlcmF0aW9ucykge1xuICB2YXIgYnVpbHRpblZhbHVlcztcbiAgYnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmIChidWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuIF8uZm9yRWFjaChidWlsdGluVmFsdWVzLCBmdW5jdGlvbihidWlsdGluSXRlbSwga2V5KSB7XG4gICAgICByZXR1cm4gb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICAgbGFiZWw6IGJ1aWx0aW5JdGVtLmxhYmVsLFxuICAgICAgICB2YWx1ZToga2V5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGlzX2NoZWNrX29ubHkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyhpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICBpZiAoW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIGtleSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5PcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlLCB2YWx1ZSkge1xuICB2YXIgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMsIHJlc3VsdDtcbiAgaWYgKCFfLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBiZXR3ZWVuQnVpbHRpblZhbHVlcyA9IENyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMoZmllbGRfdHlwZSk7XG4gIGlmICghYmV0d2VlbkJ1aWx0aW5WYWx1ZXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVzdWx0ID0gbnVsbDtcbiAgXy5lYWNoKGJldHdlZW5CdWlsdGluVmFsdWVzLCBmdW5jdGlvbihpdGVtLCBvcGVyYXRpb24pIHtcbiAgICBpZiAoaXRlbS5rZXkgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzdWx0ID0gb3BlcmF0aW9uO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IGZ1bmN0aW9uKGlzX2NoZWNrX29ubHksIGZpZWxkX3R5cGUpIHtcbiAgcmV0dXJuIHtcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3llYXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfeWVhclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3F1YXJ0ZXJcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfcXVhcnRlclwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RoaXNfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3Rfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRoaXNfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0X3dlZWtcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfd2Vla1wiKSxcbiAgICBcImJldHdlZW5fdGltZV95ZXN0ZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ5ZXN0ZGF5XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX3RvZGF5XCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0b2RheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b21vcnJvd1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9tb3Jyb3dcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMTIwX2RheXNcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF83X2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfN19kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMzBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF8zMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfNjBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF82MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfOTBfZGF5c1wiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibmV4dF85MF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfMTIwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMTIwX2RheXNcIilcbiAgfTtcbn07XG5cbkNyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGggPSBmdW5jdGlvbihtb250aCkge1xuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHJldHVybiAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIHJldHVybiAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIHJldHVybiA2O1xuICB9XG4gIHJldHVybiA5O1xufTtcblxuQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoIDwgMykge1xuICAgIHllYXItLTtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSAwO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gMztcbiAgfSBlbHNlIHtcbiAgICBtb250aCA9IDY7XG4gIH1cbiAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbn07XG5cbkNyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSBpZiAobW9udGggPCA2KSB7XG4gICAgbW9udGggPSA2O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgOSkge1xuICAgIG1vbnRoID0gOTtcbiAgfSBlbHNlIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGggPSAwO1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE1vbnRoRGF5cyA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIHZhciBkYXlzLCBlbmREYXRlLCBtaWxsaXNlY29uZCwgc3RhcnREYXRlO1xuICBpZiAobW9udGggPT09IDExKSB7XG4gICAgcmV0dXJuIDMxO1xuICB9XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgc3RhcnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBlbmREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAxKTtcbiAgZGF5cyA9IChlbmREYXRlIC0gc3RhcnREYXRlKSAvIG1pbGxpc2Vjb25kO1xuICByZXR1cm4gZGF5cztcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPT09IDApIHtcbiAgICBtb250aCA9IDExO1xuICAgIHllYXItLTtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICB9XG4gIG1vbnRoLS07XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbSA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIGtleSkge1xuICB2YXIgY3VycmVudE1vbnRoLCBjdXJyZW50WWVhciwgZW5kVmFsdWUsIGZpcnN0RGF5LCBsYWJlbCwgbGFzdERheSwgbGFzdE1vbmRheSwgbGFzdE1vbnRoRmluYWxEYXksIGxhc3RNb250aEZpcnN0RGF5LCBsYXN0UXVhcnRlckVuZERheSwgbGFzdFF1YXJ0ZXJTdGFydERheSwgbGFzdFN1bmRheSwgbGFzdF8xMjBfZGF5cywgbGFzdF8zMF9kYXlzLCBsYXN0XzYwX2RheXMsIGxhc3RfN19kYXlzLCBsYXN0XzkwX2RheXMsIG1pbGxpc2Vjb25kLCBtaW51c0RheSwgbW9uZGF5LCBtb250aCwgbmV4dE1vbmRheSwgbmV4dE1vbnRoRmluYWxEYXksIG5leHRNb250aEZpcnN0RGF5LCBuZXh0UXVhcnRlckVuZERheSwgbmV4dFF1YXJ0ZXJTdGFydERheSwgbmV4dFN1bmRheSwgbmV4dFllYXIsIG5leHRfMTIwX2RheXMsIG5leHRfMzBfZGF5cywgbmV4dF82MF9kYXlzLCBuZXh0XzdfZGF5cywgbmV4dF85MF9kYXlzLCBub3csIHByZXZpb3VzWWVhciwgc3RhcnRWYWx1ZSwgc3RyRW5kRGF5LCBzdHJGaXJzdERheSwgc3RyTGFzdERheSwgc3RyTW9uZGF5LCBzdHJTdGFydERheSwgc3RyU3VuZGF5LCBzdHJUb2RheSwgc3RyVG9tb3Jyb3csIHN0clllc3RkYXksIHN1bmRheSwgdGhpc1F1YXJ0ZXJFbmREYXksIHRoaXNRdWFydGVyU3RhcnREYXksIHRvbW9ycm93LCB2YWx1ZXMsIHdlZWssIHllYXIsIHllc3RkYXk7XG4gIG5vdyA9IG5ldyBEYXRlKCk7XG4gIG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgeWVzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKTtcbiAgd2VlayA9IG5vdy5nZXREYXkoKTtcbiAgbWludXNEYXkgPSB3ZWVrICE9PSAwID8gd2VlayAtIDEgOiA2O1xuICBtb25kYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKG1pbnVzRGF5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3VuZGF5ID0gbmV3IERhdGUobW9uZGF5LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdFN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZCk7XG4gIGxhc3RNb25kYXkgPSBuZXcgRGF0ZShsYXN0U3VuZGF5LmdldFRpbWUoKSAtIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgbmV4dE1vbmRheSA9IG5ldyBEYXRlKHN1bmRheS5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIG5leHRTdW5kYXkgPSBuZXcgRGF0ZShuZXh0TW9uZGF5LmdldFRpbWUoKSArIChtaWxsaXNlY29uZCAqIDYpKTtcbiAgY3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgcHJldmlvdXNZZWFyID0gY3VycmVudFllYXIgLSAxO1xuICBuZXh0WWVhciA9IGN1cnJlbnRZZWFyICsgMTtcbiAgY3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgbW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgZmlyc3REYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCAxKTtcbiAgaWYgKGN1cnJlbnRNb250aCA9PT0gMTEpIHtcbiAgICB5ZWFyKys7XG4gICAgbW9udGgrKztcbiAgfSBlbHNlIHtcbiAgICBtb250aCsrO1xuICB9XG4gIG5leHRNb250aEZpcnN0RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xuICBuZXh0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBDcmVhdG9yLmdldE1vbnRoRGF5cyh5ZWFyLCBtb250aCkpO1xuICBsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9udGhGaXJzdERheSA9IENyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0aGlzUXVhcnRlclN0YXJ0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSwgMSk7XG4gIHRoaXNRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIENyZWF0b3IuZ2V0UXVhcnRlclN0YXJ0TW9udGgoY3VycmVudE1vbnRoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyKSk7XG4gIGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIGxhc3RRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbmV4dFF1YXJ0ZXJTdGFydERheSA9IENyZWF0b3IuZ2V0TmV4dFF1YXJ0ZXJGaXJzdERheShjdXJyZW50WWVhciwgY3VycmVudE1vbnRoKTtcbiAgbmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIsIENyZWF0b3IuZ2V0TW9udGhEYXlzKG5leHRRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMikpO1xuICBsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8zMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgyOSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTE5ICogbWlsbGlzZWNvbmQpKTtcbiAgc3dpdGNoIChrZXkpIHtcbiAgICBjYXNlIFwibGFzdF95ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShwcmV2aW91c1llYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc195ZWFyXCI6XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3llYXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoY3VycmVudFllYXIgKyBcIi0wMS0wMVQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKG5leHRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQodGhpc1F1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChuZXh0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfbW9udGhcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KGZpcnN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X21vbnRoXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3Rfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KGxhc3RNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3Rfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChtb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQoc3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc193ZWVrXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ck1vbmRheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyU3VuZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfd2Vla1wiOlxuICAgICAgc3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJTdW5kYXkgPSBtb21lbnQobmV4dFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ5ZXN0ZGF5XCI6XG4gICAgICBzdHJZZXN0ZGF5ID0gbW9tZW50KHllc3RkYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clllc3RkYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9kYXlcIjpcbiAgICAgIHN0clRvZGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RvZGF5XCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b21vcnJvd1wiOlxuICAgICAgc3RyVG9tb3Jyb3cgPSBtb21lbnQodG9tb3Jyb3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b21vcnJvd1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb21vcnJvdyArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8xMjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF83X2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfN19kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8zMF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8zMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF82MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF82MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF85MF9kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF85MF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF8xMjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzEyMF9kYXlzXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0clN0YXJ0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJFbmREYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gIH1cbiAgdmFsdWVzID0gW3N0YXJ0VmFsdWUsIGVuZFZhbHVlXTtcbiAgaWYgKGZpZWxkX3R5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIF8uZm9yRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGZ2KSB7XG4gICAgICBpZiAoZnYpIHtcbiAgICAgICAgcmV0dXJuIGZ2LnNldEhvdXJzKGZ2LmdldEhvdXJzKCkgKyBmdi5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGtleToga2V5LFxuICAgIHZhbHVlczogdmFsdWVzXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUpIHtcbiAgaWYgKGZpZWxkX3R5cGUgJiYgQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2JldHdlZW4nO1xuICB9IGVsc2UgaWYgKFtcInRleHRhcmVhXCIsIFwidGV4dFwiLCBcImNvZGVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gJ2NvbnRhaW5zJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCI9XCI7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0RmllbGRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIHZhciBvcGVyYXRpb25zLCBvcHRpb25hbHM7XG4gIG9wdGlvbmFscyA9IHtcbiAgICBlcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI9XCJcbiAgICB9LFxuICAgIHVuZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3VuZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PlwiXG4gICAgfSxcbiAgICBsZXNzX3RoYW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3NfdGhhblwiKSxcbiAgICAgIHZhbHVlOiBcIjxcIlxuICAgIH0sXG4gICAgZ3JlYXRlcl90aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI+XCJcbiAgICB9LFxuICAgIGxlc3Nfb3JfZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxcIiksXG4gICAgICB2YWx1ZTogXCI8PVwiXG4gICAgfSxcbiAgICBncmVhdGVyX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPj1cIlxuICAgIH0sXG4gICAgY29udGFpbnM6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2NvbnRhaW5zXCIpLFxuICAgICAgdmFsdWU6IFwiY29udGFpbnNcIlxuICAgIH0sXG4gICAgbm90X2NvbnRhaW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2RvZXNfbm90X2NvbnRhaW5cIiksXG4gICAgICB2YWx1ZTogXCJub3Rjb250YWluc1wiXG4gICAgfSxcbiAgICBzdGFydHNfd2l0aDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fc3RhcnRzX3dpdGhcIiksXG4gICAgICB2YWx1ZTogXCJzdGFydHN3aXRoXCJcbiAgICB9LFxuICAgIGJldHdlZW46IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5cIiksXG4gICAgICB2YWx1ZTogXCJiZXR3ZWVuXCJcbiAgICB9XG4gIH07XG4gIGlmIChmaWVsZF90eXBlID09PSB2b2lkIDApIHtcbiAgICByZXR1cm4gXy52YWx1ZXMob3B0aW9uYWxzKTtcbiAgfVxuICBvcGVyYXRpb25zID0gW107XG4gIGlmIChDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKSkge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuYmV0d2Vlbik7XG4gICAgQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJ0ZXh0XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJ0ZXh0YXJlYVwiIHx8IGZpZWxkX3R5cGUgPT09IFwiaHRtbFwiIHx8IGZpZWxkX3R5cGUgPT09IFwiY29kZVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5jb250YWlucyk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJsb29rdXBcIiB8fCBmaWVsZF90eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCBmaWVsZF90eXBlID09PSBcInNlbGVjdFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY3VycmVuY3lcIiB8fCBmaWVsZF90eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5sZXNzX3RoYW4sIG9wdGlvbmFscy5ncmVhdGVyX3RoYW4sIG9wdGlvbmFscy5sZXNzX29yX2VxdWFsLCBvcHRpb25hbHMuZ3JlYXRlcl9vcl9lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSBpZiAoZmllbGRfdHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiW3RleHRdXCIpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCk7XG4gIH0gZWxzZSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9XG4gIHJldHVybiBvcGVyYXRpb25zO1xufTtcblxuXG4vKlxuICAgIOWFiOaMieeFp+acieaOkuW6j+WPt+eahOWwj+eahOWcqOWJje+8jOWkp+eahOWcqOWQjlxuICAgIOWGjeWwhuayoeacieaOkuW6j+WPt+eahOaYvuekuuWcqFxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBmaWVsZHMsIGZpZWxkc0FyciwgZmllbGRzTmFtZSwgcmVmO1xuICBmaWVsZHMgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLmZpZWxkcyA6IHZvaWQgMDtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc0Fyci5wdXNoKHtcbiAgICAgIG5hbWU6IGZpZWxkLm5hbWUsXG4gICAgICBzb3J0X25vOiBmaWVsZC5zb3J0X25vXG4gICAgfSk7XG4gIH0pO1xuICBmaWVsZHNOYW1lID0gW107XG4gIF8uZWFjaChfLnNvcnRCeShmaWVsZHNBcnIsIFwic29ydF9ub1wiKSwgZnVuY3Rpb24oZmllbGQpIHtcbiAgICByZXR1cm4gZmllbGRzTmFtZS5wdXNoKGZpZWxkLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIGZpZWxkc05hbWU7XG59O1xuIiwiQ3JlYXRvci5fdHJpZ2dlcl9ob29rcyA9IHt9XG5cbmluaXRUcmlnZ2VyID0gKG9iamVjdF9uYW1lLCB0cmlnZ2VyKS0+XG5cdHRyeVxuXHRcdGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpXG5cdFx0aWYgIXRyaWdnZXIudG9kb1xuXHRcdFx0cmV0dXJuXG5cdFx0dG9kb1dyYXBwZXIgPSAoKS0+XG5cdFx0XHQgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZVxuXHRcdFx0ICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcblx0XHRpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUuaW5zZXJ0XCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8uaW5zZXJ0KHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8udXBkYXRlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJiZWZvcmUucmVtb3ZlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmJlZm9yZT8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5pbnNlcnRcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/Lmluc2VydCh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIudXBkYXRlXCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy51cGRhdGUodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnJlbW92ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8ucmVtb3ZlKHRvZG9XcmFwcGVyKVxuXHRjYXRjaCBlcnJvclxuXHRcdGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpXG5cbmNsZWFuVHJpZ2dlciA9IChvYmplY3RfbmFtZSktPlxuXHQjIyNcbiAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG5cdCMjI1xuICAgICNUT0RPIOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbBidWdcblx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0/LnJldmVyc2UoKS5mb3JFYWNoIChfaG9vayktPlxuXHRcdF9ob29rLnJlbW92ZSgpXG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gKG9iamVjdF9uYW1lKS0+XG4jXHRjb25zb2xlLmxvZygnQ3JlYXRvci5pbml0VHJpZ2dlcnMgb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSlcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cblx0Y2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKVxuXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdID0gW11cblxuXHRfLmVhY2ggb2JqLnRyaWdnZXJzLCAodHJpZ2dlciwgdHJpZ2dlcl9uYW1lKS0+XG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyIGFuZCB0cmlnZ2VyLm9uID09IFwic2VydmVyXCIgYW5kIHRyaWdnZXIudG9kbyBhbmQgdHJpZ2dlci53aGVuXG5cdFx0XHRfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIgb2JqZWN0X25hbWUsIHRyaWdnZXJcblx0XHRcdGlmIF90cmlnZ2VyX2hvb2tcblx0XHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudCBhbmQgdHJpZ2dlci5vbiA9PSBcImNsaWVudFwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXG5cdFx0XHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spIiwidmFyIGNsZWFuVHJpZ2dlciwgaW5pdFRyaWdnZXI7XG5cbkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fTtcblxuaW5pdFRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdHJpZ2dlcikge1xuICB2YXIgY29sbGVjdGlvbiwgZXJyb3IsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgdG9kb1dyYXBwZXI7XG4gIHRyeSB7XG4gICAgY29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSk7XG4gICAgaWYgKCF0cmlnZ2VyLnRvZG8pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdG9kb1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3RfbmFtZTtcbiAgICAgIHJldHVybiB0cmlnZ2VyLnRvZG8uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmLmluc2VydCh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjEgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjEudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJiZWZvcmUucmVtb3ZlXCIpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uICE9IG51bGwgPyAocmVmMiA9IGNvbGxlY3Rpb24uYmVmb3JlKSAhPSBudWxsID8gcmVmMi5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLmluc2VydFwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjMgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmMy5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnVwZGF0ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjQgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNC51cGRhdGUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImFmdGVyLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjUgPSBjb2xsZWN0aW9uLmFmdGVyKSAhPSBudWxsID8gcmVmNS5yZW1vdmUodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ2luaXRUcmlnZ2VyIGVycm9yJywgZXJyb3IpO1xuICB9XG59O1xuXG5jbGVhblRyaWdnZXIgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuXG4gIC8qXG4gICAgIFx055Sx5LqOY29sbGVjdGlvbi1ob29rcyBwYWNrYWdlIOeahHJlbW92ZeWHveaVsOaYr+S9v+eUqOS4i+agh+WIoOmZpOWvueixoeeahO+8jOaJgOS7peatpOWkhOWPjei9rGhvb2tz6ZuG5ZCI5ZCO77yM5YaN5Yig6ZmkXG4gICAgIFx05Zug5Li65LiA5Liq5pWw57uE5YWD57Sg5Yig6Zmk5ZCO77yM5YW25LuW5YWD57Sg55qE5LiL5qCH5Lya5Y+R55Sf5Y+Y5YyWXG4gICAqL1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdKSAhPSBudWxsID8gcmVmLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uKF9ob29rKSB7XG4gICAgcmV0dXJuIF9ob29rLnJlbW92ZSgpO1xuICB9KSA6IHZvaWQgMDtcbn07XG5cbkNyZWF0b3IuaW5pdFRyaWdnZXJzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIG9iajtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjbGVhblRyaWdnZXIob2JqZWN0X25hbWUpO1xuICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdO1xuICByZXR1cm4gXy5lYWNoKG9iai50cmlnZ2VycywgZnVuY3Rpb24odHJpZ2dlciwgdHJpZ2dlcl9uYW1lKSB7XG4gICAgdmFyIF90cmlnZ2VyX2hvb2s7XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcInNlcnZlclwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICBpZiAoX3RyaWdnZXJfaG9vaykge1xuICAgICAgICBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT09IFwiY2xpZW50XCIgJiYgdHJpZ2dlci50b2RvICYmIHRyaWdnZXIud2hlbikge1xuICAgICAgX3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyKG9iamVjdF9uYW1lLCB0cmlnZ2VyKTtcbiAgICAgIHJldHVybiBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXS5wdXNoKF90cmlnZ2VyX2hvb2spO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpXG5cbmJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImFsbG93Q3JlYXRlXCIsIFwiYWxsb3dEZWxldGVcIiwgXCJhbGxvd0VkaXRcIiwgXCJhbGxvd1JlYWRcIiwgXCJtb2RpZnlBbGxSZWNvcmRzXCIsIFwidmlld0FsbFJlY29yZHNcIiwgXCJtb2RpZnlDb21wYW55UmVjb3Jkc1wiLCBcInZpZXdDb21wYW55UmVjb3Jkc1wiLCBcblx0XCJhbGxvd1JlYWRGaWxlc1wiLCBcImFsbG93RWRpdEZpbGVzXCIsIFwiYWxsb3dDcmVhdGVGaWxlc1wiLCBcImFsbG93RGVsZXRlRmlsZXNcIiwgXCJ2aWV3QWxsRmlsZXNcIiwgXCJtb2RpZnlBbGxGaWxlc1wiXSBcbm90aGVyUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImRpc2FibGVkX2xpc3Rfdmlld3NcIiwgXCJkaXNhYmxlZF9hY3Rpb25zXCIsIFwidW5yZWFkYWJsZV9maWVsZHNcIiwgXCJ1bmVkaXRhYmxlX2ZpZWxkc1wiLCBcInVucmVsYXRlZF9vYmplY3RzXCIsIFwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcIl1cbnBlcm1pc3Npb25Qcm9wTmFtZXMgPSBfLnVuaW9uIGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzXG5cbkNyZWF0b3IuZ2V0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCktPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiAhb2JqZWN0X25hbWVcblx0XHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdGlmICFvYmpcblx0XHRcdHJldHVyblxuXHRcdHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KClcblx0ZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUsIHJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XG5cdGlmICFvYmplY3RfbmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cblx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XG5cdCMg6ZmE5Lu25p2D6ZmQ5LiN5YaN5LiO5YW254i26K6w5b2V57yW6L6R6YWN572u5YWz6IGUXG5cdCMgaWYgcmVjb3JkIGFuZCBvYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0IyBcdCMg5aaC5p6c5pivY21zX2ZpbGVz6ZmE5Lu277yM5YiZ5p2D6ZmQ5Y+W5YW254i26K6w5b2V5p2D6ZmQXG5cdCMgXHRpZiBvYmplY3RfbmFtZSA9PSBTZXNzaW9uLmdldCgnb2JqZWN0X25hbWUnKVxuXHQjIFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tuivpue7hueVjOmdolxuXHQjIFx0XHRvYmplY3RfbmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuXHQjIFx0XHRyZWNvcmRfaWQgPSByZWNvcmQucGFyZW50Ll9pZDtcblx0IyBcdGVsc2UgXG5cdCMgXHRcdCMg5b2T5YmN5aSE5LqOY21zX2ZpbGVz6ZmE5Lu255qE54i26K6w5b2V55WM6Z2iXG5cdCMgXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJyk7XG5cdCMgXHRcdHJlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpO1xuXHQjIFx0b2JqZWN0X2ZpZWxkc19rZXlzID0gXy5rZXlzKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uZmllbGRzIG9yIHt9KSB8fCBbXTtcblx0IyBcdHNlbGVjdCA9IF8uaW50ZXJzZWN0aW9uKG9iamVjdF9maWVsZHNfa2V5cywgWydvd25lcicsICdjb21wYW55X2lkJywgJ2NvbXBhbnlfaWRzJywgJ2xvY2tlZCddKSB8fCBbXTtcblx0IyBcdGlmIHNlbGVjdC5sZW5ndGggPiAwXG5cdCMgXHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHNlbGVjdC5qb2luKCcsJykpO1xuXHQjIFx0ZWxzZVxuXHQjIFx0XHRyZWNvcmQgPSBudWxsO1xuXG5cdHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKVxuXG5cdGlmIHJlY29yZFxuXHRcdGlmIHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnNcblx0XHRcdHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXG5cblx0XHRpc093bmVyID0gcmVjb3JkLm93bmVyID09IHVzZXJJZCB8fCByZWNvcmQub3duZXI/Ll9pZCA9PSB1c2VySWRcblxuXHRcdGlmIG9iamVjdF9uYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdCMg6ZmE5Lu255qE5p+l55yL5omA5pyJ5L+u5pS55omA5pyJ5p2D6ZmQ5LiO6ZmE5Lu25a+56LGh55qEdmlld0FsbFJlY29yZHPjgIFtb2RpZnlBbGxSZWNvcmRz5peg5YWz77yM5Y+q5LiO5YW25Li76KGo6K6w5b2V55qEdmlld0FsbEZpbGVz5ZKMbW9kaWZ5QWxsRmlsZXPmnInlhbNcblx0XHRcdCMg5aaC5p6c5pivY21zX2ZpbGVz6ZmE5Lu277yM5YiZ5p2D6ZmQ6ZyA6KaB6aKd5aSW6ICD6JmR5YW254i25a+56LGh5LiK5YWz5LqO6ZmE5Lu255qE5p2D6ZmQ6YWN572uXG5cdFx0XHRtYXN0ZXJPYmplY3ROYW1lID0gcmVjb3JkLnBhcmVudFsncmVmZXJlbmNlX3RvLl9vJ107XG5cdFx0XHRtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhtYXN0ZXJPYmplY3ROYW1lLCBzcGFjZUlkLCB1c2VySWQpXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlc1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gcGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXNcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0RlbGV0ZUZpbGVzXG5cdFx0XHRpZiAhbWFzdGVyUmVjb3JkUGVybS5tb2RpZnlBbGxGaWxlcyBhbmQgIWlzT3duZXJcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gcGVybWlzc2lvbnMuYWxsb3dSZWFkICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkRmlsZXNcblx0XHRcdGlmICFtYXN0ZXJSZWNvcmRQZXJtLnZpZXdBbGxGaWxlcyBhbmQgIWlzT3duZXJcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR1c2VyX2NvbXBhbnlfaWRzID0gQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkcyh1c2VySWQsIHNwYWNlSWQpXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZD8uY29tcGFueV9pZFxuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWQgYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWQpIGFuZCByZWNvcmRfY29tcGFueV9pZC5faWRcblx0XHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZOaYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEb2JqZWN077yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XG5cdFx0XHRcdHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQ/LmNvbXBhbnlfaWRzXG5cdFx0XHRpZiByZWNvcmRfY29tcGFueV9pZHMgYW5kIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggYW5kIF8uaXNPYmplY3QocmVjb3JkX2NvbXBhbnlfaWRzWzBdKVxuXHRcdFx0XHQjIOWboHJlY29yZF9jb21wYW55X2lkc+aYr2xvb2t1cOexu+Wei++8jOacieWPr+iDvWR45o6n5Lu25Lya5oqK5a6D5pig5bCE6L2s5Li65a+55bqU55qEW29iamVjdF3vvIzmiYDku6Xov5nph4zlj5blh7rlhbZfaWTlgLxcblx0XHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcCgobiktPiBuLl9pZClcblx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKVxuXHRcdFx0aWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0ZWxzZSBpZiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5L+u5pS5XG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQjIOiusOW9leaciWNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfvvIzkvYbmmK/lvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz5Li656m65pe277yM6K6k5Li65peg5p2D5L+u5pS5XG5cdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRpZiByZWNvcmQubG9ja2VkIGFuZCAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cblx0XHRcdGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgIWlzT3duZXIgYW5kICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIGFuZCBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHNcblx0XHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0aWYgdXNlcl9jb21wYW55X2lkcyBhbmQgdXNlcl9jb21wYW55X2lkcy5sZW5ndGhcblx0XHRcdFx0XHRcdGlmICFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHQjIOiusOW9leeahGNvbXBhbnlfaWQvY29tcGFueV9pZHPlsZ7mgKfkuI3lnKjlvZPliY3nlKjmiLd1c2VyX2NvbXBhbnlfaWRz6IyD5Zu05YaF5pe277yM6K6k5Li65peg5p2D5p+l55yLXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lk5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+afpeeci1xuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2Vcblx0XG5cdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cbiMgY3VycmVudE9iamVjdE5hbWXvvJrlvZPliY3kuLvlr7nosaFcbiMgcmVsYXRlZExpc3RJdGVt77yaQ3JlYXRvci5nZXRSZWxhdGVkTGlzdChTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpLCBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSnkuK3lj5ZyZWxhdGVkX29iamVjdF9uYW1l5a+55bqU55qE5YC8XG4jIGN1cnJlbnRSZWNvcmTlvZPliY3kuLvlr7nosaHnmoTor6bnu4borrDlvZVcbmlmIE1ldGVvci5pc0NsaWVudFxuXHRDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMgPSAoY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKS0+XG5cdFx0aWYgIWN1cnJlbnRPYmplY3ROYW1lIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdFx0aWYgIXJlbGF0ZWRMaXN0SXRlbVxuXHRcdFx0Y29uc29sZS5lcnJvcihcInJlbGF0ZWRMaXN0SXRlbSBtdXN0IG5vdCBiZSBlbXB0eSBmb3IgdGhlIGZ1bmN0aW9uIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9uc1wiKTtcblx0XHRcdHJldHVybiB7fVxuXG5cdFx0aWYgIWN1cnJlbnRSZWNvcmQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Y3VycmVudFJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKClcblxuXHRcdGlmICF1c2VySWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cblx0XHRpZiAhc3BhY2VJZCBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cblx0XHRtYXN0ZXJSZWNvcmRQZXJtID0gQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyhjdXJyZW50T2JqZWN0TmFtZSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKVxuXHRcdHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKVxuXHRcdHJlc3VsdCA9IF8uY2xvbmUgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zXG5cblx0XHRpZiByZWxhdGVkTGlzdEl0ZW0uaXNfZmlsZVxuXHRcdFx0cmVzdWx0LmFsbG93Q3JlYXRlID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlc1xuXHRcdFx0cmVzdWx0LmFsbG93RWRpdCA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlc1xuXHRcdGVsc2Vcblx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZExpc3RJdGVtLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIHx8IGZhbHNlXG5cdFx0XHRtYXN0ZXJBbGxvdyA9IGZhbHNlXG5cdFx0XHRpZiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9PSB0cnVlXG5cdFx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRcblx0XHRcdGVsc2UgaWYgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT0gZmFsc2Vcblx0XHRcdFx0bWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdFxuXG5cdFx0XHR1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKVxuXHRcdFx0aXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlID0gdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QuaW5kZXhPZihyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpID4gLTFcblxuXHRcdFx0cmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcblx0XHRcdHJlc3VsdC5hbGxvd0VkaXQgPSBtYXN0ZXJBbGxvdyAmJiByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGVcblx0XHRyZXR1cm4gcmVzdWx0XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXG5cdENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSAoc3BhY2VJZCwgdXNlcklkKSAtPlxuXHRcdHBlcm1pc3Npb25zID1cblx0XHRcdG9iamVjdHM6IHt9XG5cdFx0XHRhc3NpZ25lZF9hcHBzOiBbXVxuXHRcdCMjI1xuXHRcdOadg+mZkOmbhuivtOaYjjpcblx0XHTlhoXnva7mnYPpmZDpm4YtYWRtaW4sdXNlcixtZW1iZXIsZ3Vlc3Qsd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWluXG5cdFx06Ieq5a6a5LmJ5p2D6ZmQ6ZuGLeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOmbhuS7peWklueahOWFtuS7luadg+mZkOmbhlxuXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG5cdFx05Y+v6YWN572u55So5oi36ZuG5ZCI5p2D6ZmQ6ZuG77yI5Y2zdXNlcnPlsZ7mgKflj6/phY3nva7vvIktd29ya2Zsb3dfYWRtaW4sb3JnYW5pemF0aW9uX2FkbWlu5Lul5Y+K6Ieq5a6a5LmJ5p2D6ZmQ6ZuGXG5cdFx0IyMjXG5cblx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxuXHRcdHNwYWNlVXNlciA9IG51bGxcblx0XHRpZiB1c2VySWRcblx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXG5cdFx0cHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cblx0XHRwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRlbHNlXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cblx0XHRwc2V0c0FkbWluX3BvcyA9IG51bGxcblx0XHRwc2V0c1VzZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IG51bGxcblx0XHRwc2V0c0d1ZXN0X3BvcyA9IG51bGxcblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gbnVsbFxuXHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbFxuXHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbFxuXG5cdFx0aWYgcHNldHNBZG1pbj8uX2lkXG5cdFx0XHRwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxuXHRcdFx0cHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzTWVtYmVyPy5faWRcblx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNHdWVzdD8uX2lkXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c1N1cHBsaWVyPy5faWRcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzQ3VzdG9tZXI/Ll9pZFxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cblx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIl9pZFwiXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiB7JGluOiBzZXRfaWRzfX0pLmZldGNoKClcblx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXG5cdFx0cHNldHMgPSB7XG5cdFx0XHRwc2V0c0FkbWluLCBcblx0XHRcdHBzZXRzVXNlciwgXG5cdFx0XHRwc2V0c0N1cnJlbnQsIFxuXHRcdFx0cHNldHNNZW1iZXIsIFxuXHRcdFx0cHNldHNHdWVzdCxcblx0XHRcdHBzZXRzU3VwcGxpZXIsXG5cdFx0XHRwc2V0c0N1c3RvbWVyLFxuXHRcdFx0aXNTcGFjZUFkbWluLFxuXHRcdFx0c3BhY2VVc2VyLCBcblx0XHRcdHBzZXRzQWRtaW5fcG9zLCBcblx0XHRcdHBzZXRzVXNlcl9wb3MsIFxuXHRcdFx0cHNldHNNZW1iZXJfcG9zLCBcblx0XHRcdHBzZXRzR3Vlc3RfcG9zLFxuXHRcdFx0cHNldHNTdXBwbGllcl9wb3MsXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3Bvcyxcblx0XHRcdHBzZXRzQ3VycmVudF9wb3Ncblx0XHR9XG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZClcblx0XHRwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpXG5cdFx0cGVybWlzc2lvbnMudXNlcl9wZXJtaXNzaW9uX3NldHMgPSBwc2V0c0N1cnJlbnROYW1lc1xuXHRcdF9pID0gMFxuXHRcdF8uZWFjaCBDcmVhdG9yLm9iamVjdHNCeU5hbWUsIChvYmplY3QsIG9iamVjdF9uYW1lKS0+XG5cdFx0XHRfaSsrXG5cdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnc3BhY2UnKSB8fCAhb2JqZWN0LnNwYWNlIHx8IG9iamVjdC5zcGFjZSA9PSBzcGFjZUlkXG5cdFx0XHRcdGlmICFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PSAnMCcgfHwgKG9iamVjdC5pbl9kZXZlbG9wbWVudCAhPSAnMCcgJiYgaXNTcGFjZUFkbWluKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdW1wicGVybWlzc2lvbnNcIl0gPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblx0dW5pb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cblx0XHRpZiAhYXJyYXkgYW5kICFvdGhlclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRcdGlmICFhcnJheVxuXHRcdFx0YXJyYXkgPSBbXVxuXHRcdGlmICFvdGhlclxuXHRcdFx0b3RoZXIgPSBbXVxuXHRcdHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcilcblxuXHRpbnRlcnNlY3Rpb25QbHVzID0gKGFycmF5LCBvdGhlcikgLT5cblx0XHRpZiAhYXJyYXkgYW5kICFvdGhlclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZFxuXHRcdGlmICFhcnJheVxuXHRcdFx0YXJyYXkgPSBbXVxuXHRcdGlmICFvdGhlclxuXHRcdFx0b3RoZXIgPSBbXVxuXHRcdHJldHVybiBfLmludGVyc2VjdGlvbihhcnJheSwgb3RoZXIpXG5cblx0ZXh0ZW5kUGVybWlzc2lvblByb3BzID0gKHRhcmdldCwgcHJvcHMpIC0+XG5cdFx0cHJvcE5hbWVzID0gcGVybWlzc2lvblByb3BOYW1lc1xuXHRcdGZpbGVzUHJvTmFtZXMgPSBcblx0XHRpZiBwcm9wc1xuXHRcdFx0Xy5lYWNoIHByb3BOYW1lcywgKHByb3BOYW1lKSAtPlxuXHRcdFx0XHR0YXJnZXRbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdXG5cblx0XHRcdCMgdGFyZ2V0LmFsbG93Q3JlYXRlID0gcHJvcHMuYWxsb3dDcmVhdGVcblx0XHRcdCMgdGFyZ2V0LmFsbG93RGVsZXRlID0gcHJvcHMuYWxsb3dEZWxldGVcblx0XHRcdCMgdGFyZ2V0LmFsbG93RWRpdCA9IHByb3BzLmFsbG93RWRpdFxuXHRcdFx0IyB0YXJnZXQuYWxsb3dSZWFkID0gcHJvcHMuYWxsb3dSZWFkXG5cdFx0XHQjIHRhcmdldC5tb2RpZnlBbGxSZWNvcmRzID0gcHJvcHMubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQudmlld0FsbFJlY29yZHMgPSBwcm9wcy52aWV3QWxsUmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBwcm9wcy5tb2RpZnlDb21wYW55UmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQudmlld0NvbXBhbnlSZWNvcmRzID0gcHJvcHMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHQjIHRhcmdldC5kaXNhYmxlZF9saXN0X3ZpZXdzID0gcHJvcHMuZGlzYWJsZWRfbGlzdF92aWV3c1xuXHRcdFx0IyB0YXJnZXQuZGlzYWJsZWRfYWN0aW9ucyA9IHByb3BzLmRpc2FibGVkX2FjdGlvbnNcblx0XHRcdCMgdGFyZ2V0LnVucmVhZGFibGVfZmllbGRzID0gcHJvcHMudW5yZWFkYWJsZV9maWVsZHNcblx0XHRcdCMgdGFyZ2V0LnVuZWRpdGFibGVfZmllbGRzID0gcHJvcHMudW5lZGl0YWJsZV9maWVsZHNcblx0XHRcdCMgdGFyZ2V0LnVucmVsYXRlZF9vYmplY3RzID0gcHJvcHMudW5yZWxhdGVkX29iamVjdHNcblx0XHRcdCMgdGFyZ2V0LnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gcHJvcHMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcblxuXHRvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMgPSAodGFyZ2V0LCBwcm9wcykgLT5cblx0XHRwcm9wTmFtZXMgPSBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXNcblx0XHRfLmVhY2ggcHJvcE5hbWVzLCAocHJvcE5hbWUpIC0+XG5cdFx0XHRpZiBwcm9wc1twcm9wTmFtZV1cblx0XHRcdFx0dGFyZ2V0W3Byb3BOYW1lXSA9IHRydWVcblx0XHRcblx0XHQjIGlmIHBvLmFsbG93UmVhZFxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0NyZWF0ZVxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHRydWVcblx0XHQjIGlmIHBvLmFsbG93RWRpdFxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0RlbGV0ZVxuXHRcdCMgXHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHRydWVcblx0XHQjIGlmIHBvLm1vZGlmeUFsbFJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IHRydWVcblx0XHQjIGlmIHBvLnZpZXdBbGxSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzID0gdHJ1ZVxuXHRcdCMgaWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSB0cnVlXG5cdFx0IyBpZiBwby52aWV3Q29tcGFueVJlY29yZHNcblx0XHQjIFx0cGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXG5cblx0Q3JlYXRvci5nZXRBc3NpZ25lZEFwcHMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0cHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzU3VwcGxpZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdHBzZXRzQ3VzdG9tZXIgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0IyBwc2V0c01lbWJlciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdCMgcHNldHNHdWVzdCA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRzcGFjZVVzZXIgPSBudWxsO1xuXHRcdGlmIHVzZXJJZFxuXHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRlbHNlXG5cdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRhcHBzID0gW11cblx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdHJldHVybiBbXVxuXHRcdGVsc2Vcblx0XHRcdHVzZXJQcm9maWxlID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pPy5wcm9maWxlXG5cdFx0XHRwc2V0QmFzZSA9IHBzZXRzVXNlclxuXHRcdFx0aWYgdXNlclByb2ZpbGVcblx0XHRcdFx0aWYgdXNlclByb2ZpbGUgPT0gJ3N1cHBsaWVyJ1xuXHRcdFx0XHRcdHBzZXRCYXNlID0gcHNldHNTdXBwbGllclxuXHRcdFx0XHRlbHNlIGlmIHVzZXJQcm9maWxlID09ICdjdXN0b21lcidcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXJcblx0XHRcdGlmIHBzZXRCYXNlPy5hc3NpZ25lZF9hcHBzPy5sZW5ndGhcblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwc1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIHVzZXLmnYPpmZDpm4bkuK3nmoRhc3NpZ25lZF9hcHBz6KGo56S65omA5pyJ55So5oi35YW35pyJ55qEYXBwc+adg+mZkO+8jOS4uuepuuWImeihqOekuuacieaJgOaciWFwcHPmnYPpmZDvvIzkuI3pnIDopoHkvZzmnYPpmZDliKTmlq3kuoZcblx0XHRcdFx0cmV0dXJuIFtdXG5cdFx0XHRfLmVhY2ggcHNldHMsIChwc2V0KS0+XG5cdFx0XHRcdGlmICFwc2V0LmFzc2lnbmVkX2FwcHNcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgcHNldC5uYW1lID09IFwiYWRtaW5cIiB8fCAgcHNldC5uYW1lID09IFwidXNlclwiIHx8IHBzZXQubmFtZSA9PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PSAnY3VzdG9tZXInXG5cdFx0XHRcdFx0IyDov5nph4zkuYvmiYDku6XopoHmjpLpmaRhZG1pbi91c2Vy77yM5piv5Zug5Li66L+Z5Lik5Liq5p2D6ZmQ6ZuG5piv5omA5pyJ5p2D6ZmQ6ZuG5LitdXNlcnPlsZ7mgKfml6DmlYjnmoTmnYPpmZDpm4bvvIznibnmjIflt6XkvZzljLrnrqHnkIblkZjlkozmiYDmnInnlKjmiLdcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0YXBwcyA9IF8udW5pb24gYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzXG5cdFx0XHRyZXR1cm4gXy53aXRob3V0KF8udW5pcShhcHBzKSx1bmRlZmluZWQsbnVsbClcblxuXHRDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0cHNldHMgPSAgdGhpcy5wc2V0c0N1cnJlbnQgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXHRcdGFkbWluTWVudXMgPSBDcmVhdG9yLkFwcHMuYWRtaW4/LmFkbWluX21lbnVzXG5cdFx0IyDlpoLmnpzmsqHmnIlhZG1pbuiPnOWNleivtOaYjuS4jemcgOimgeebuOWFs+WKn+iDve+8jOebtOaOpei/lOWbnuepulxuXHRcdHVubGVzcyBhZG1pbk1lbnVzXG5cdFx0XHRyZXR1cm4gW11cblx0XHRhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQgKG4pIC0+XG5cdFx0XHRuLl9pZCA9PSAnYWJvdXQnXG5cdFx0YWRtaW5NZW51cyA9IGFkbWluTWVudXMuZmlsdGVyIChuKSAtPlxuXHRcdFx0bi5faWQgIT0gJ2Fib3V0J1xuXHRcdG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeSBfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCAobikgLT5cblx0XHRcdHJldHVybiBuLmFkbWluX21lbnVzIGFuZCBuLl9pZCAhPSAnYWRtaW4nXG5cdFx0KSwgJ3NvcnQnXG5cdFx0b3RoZXJNZW51cyA9IF8uZmxhdHRlbihfLnBsdWNrKG90aGVyTWVudUFwcHMsIFwiYWRtaW5fbWVudXNcIikpXG5cdFx0IyDoj5zljZXmnInkuInpg6jliIbnu4TmiJDvvIzorr7nva5BUFDoj5zljZXjgIHlhbbku5ZBUFDoj5zljZXku6Xlj4phYm91dOiPnOWNlVxuXHRcdGFsbE1lbnVzID0gXy51bmlvbihhZG1pbk1lbnVzLCBvdGhlck1lbnVzLCBbYWJvdXRNZW51XSlcblx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdCMg5bel5L2c5Yy6566h55CG5ZGY5pyJ5YWo6YOo6I+c5Y2V5Yqf6IO9XG5cdFx0XHRyZXN1bHQgPSBhbGxNZW51c1xuXHRcdGVsc2Vcblx0XHRcdHVzZXJQcm9maWxlID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pPy5wcm9maWxlIHx8ICd1c2VyJ1xuXHRcdFx0Y3VycmVudFBzZXROYW1lcyA9IHBzZXRzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4ubmFtZVxuXHRcdFx0bWVudXMgPSBhbGxNZW51cy5maWx0ZXIgKG1lbnUpLT5cblx0XHRcdFx0cHNldHNNZW51ID0gbWVudS5wZXJtaXNzaW9uX3NldHNcblx0XHRcdFx0IyDlpoLmnpzmma7pgJrnlKjmiLfmnInmnYPpmZDvvIzliJnnm7TmjqXov5Tlm550cnVlXG5cdFx0XHRcdGlmIHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZih1c2VyUHJvZmlsZSkgPiAtMVxuXHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRcdCMg5ZCm5YiZ5Y+W5b2T5YmN55So5oi355qE5p2D6ZmQ6ZuG5LiObWVudeiPnOWNleimgeaxgueahOadg+mZkOmbhuWvueavlO+8jOWmguaenOS6pOmbhuWkp+S6jjHkuKrliJnov5Tlm550cnVlXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aFxuXHRcdFx0cmVzdWx0ID0gbWVudXNcblx0XHRcblx0XHRyZXR1cm4gXy5zb3J0QnkocmVzdWx0LFwic29ydFwiKVxuXG5cdGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QgPSAocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpLT5cblxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBudWxsXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBfLmZpbmQgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cblx0XHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmRPbmUoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHBlcm1pc3Npb25fc2V0X2lkfSlcblxuXHRmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcyktPlxuXHRcdGlmIF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBudWxsXG5cdFx0aWYgXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cylcblx0XHRcdHJldHVybiBfLmZpbHRlciBwZXJtaXNzaW9uX29iamVjdHMsIChwbyktPlxuXHRcdFx0XHRyZXR1cm4gcG8ub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogcGVybWlzc2lvbl9zZXRfaWRzfX0pLmZldGNoKClcblxuXHR1bmlvblBlcm1pc3Npb25PYmplY3RzID0gKHBvcywgb2JqZWN0LCBwc2V0cyktPlxuXHRcdCMg5oqKZGLlj4p5bWzkuK3nmoRwZXJtaXNzaW9uX29iamVjdHPlkIjlubbvvIzkvJjlhYjlj5ZkYuS4reeahFxuXHRcdHJlc3VsdCA9IFtdXG5cdFx0Xy5lYWNoIG9iamVjdC5wZXJtaXNzaW9uX3NldCwgKG9wcywgb3BzX2tleSktPlxuXHRcdFx0IyDmiop5bWzkuK3pmaTkuobnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4ZcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCLlpJbnmoTlhbbku5blr7nosaHmnYPpmZDlhYjlrZjlhaVyZXN1bHRcblx0XHRcdCMgaWYgW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIiwgXCJ3b3JrZmxvd19hZG1pblwiLCBcIm9yZ2FuaXphdGlvbl9hZG1pblwiXS5pbmRleE9mKG9wc19rZXkpIDwgMFxuXHRcdFx0aWYgW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDBcblx0XHRcdFx0Y3VycmVudFBzZXQgPSBwc2V0cy5maW5kIChwc2V0KS0+IHJldHVybiBwc2V0Lm5hbWUgPT0gb3BzX2tleVxuXHRcdFx0XHRpZiBjdXJyZW50UHNldFxuXHRcdFx0XHRcdHRlbXBPcHMgPSBfLmNsb25lKG9wcykgfHwge31cblx0XHRcdFx0XHR0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkXG5cdFx0XHRcdFx0dGVtcE9wcy5vYmplY3RfbmFtZSA9IG9iamVjdC5vYmplY3RfbmFtZVxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoIHRlbXBPcHNcblx0XHRpZiByZXN1bHQubGVuZ3RoXG5cdFx0XHRwb3MuZm9yRWFjaCAocG8pLT5cblx0XHRcdFx0cmVwZWF0SW5kZXggPSAwXG5cdFx0XHRcdHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoKGl0ZW0sIGluZGV4KS0+IHJlcGVhdEluZGV4ID0gaW5kZXg7cmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT0gcG8ucGVybWlzc2lvbl9zZXRfaWQpXG5cdFx0XHRcdCMg5aaC5p6ceW1s5Lit5bey57uP5a2Y5ZyocG/vvIzliJnmm7/mjaLkuLrmlbDmja7lupPkuK3nmoRwb++8jOWPjeS5i+WImeaKiuaVsOaNruW6k+S4reeahHBv55u05o6l57Sv5Yqg6L+b5Y67XG5cdFx0XHRcdGlmIHJlcGVhdFBvXG5cdFx0XHRcdFx0cmVzdWx0W3JlcGVhdEluZGV4XSA9IHBvXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXN1bHQucHVzaCBwb1xuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBwb3NcblxuXHRDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpLT5cblx0XHRwZXJtaXNzaW9ucyA9IHt9XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpXG5cblx0XHRpZiBzcGFjZUlkIGlzICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT0gXCJ1c2Vyc1wiXG5cdFx0XHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fVxuXHRcdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcblx0XHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXHRcdHBzZXRzQWRtaW4gPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIG9yIHRoaXMucHNldHNBZG1pbiB0aGVuIHRoaXMucHNldHNBZG1pbiBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c1VzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzVXNlcikgb3IgdGhpcy5wc2V0c1VzZXIgdGhlbiB0aGlzLnBzZXRzVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzTWVtYmVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgb3IgdGhpcy5wc2V0c01lbWJlciB0aGVuIHRoaXMucHNldHNNZW1iZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzR3Vlc3QgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIG9yIHRoaXMucHNldHNHdWVzdCB0aGVuIHRoaXMucHNldHNHdWVzdCBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnZ3Vlc3QnfSwge2ZpZWxkczp7X2lkOjF9fSlcblxuXHRcdHBzZXRzU3VwcGxpZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnBzZXRzU3VwcGxpZXIpIG9yIHRoaXMucHNldHNTdXBwbGllciB0aGVuIHRoaXMucHNldHNTdXBwbGllciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c0N1c3RvbWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0N1c3RvbWVyKSBvciB0aGlzLnBzZXRzQ3VzdG9tZXIgdGhlbiB0aGlzLnBzZXRzQ3VzdG9tZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudDtcblx0XHRpZiAhcHNldHNcblx0XHRcdHNwYWNlVXNlciA9IG51bGw7XG5cdFx0XHRpZiB1c2VySWRcblx0XHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cdFx0XHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdGlzU3BhY2VBZG1pbiA9IGlmIF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSB0aGVuIHRoaXMuaXNTcGFjZUFkbWluIGVsc2UgQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxuXG5cdFx0cHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zXG5cdFx0cHNldHNVc2VyX3BvcyA9IHRoaXMucHNldHNVc2VyX3Bvc1xuXHRcdHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zXG5cdFx0cHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zXG5cblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3Ncblx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3NcblxuXHRcdHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3NcblxuXHRcdG9wc2V0QWRtaW4gPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5hZG1pbikgfHwge31cblx0XHRvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fVxuXHRcdG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fVxuXHRcdG9wc2V0R3Vlc3QgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cblxuXHRcdG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge31cblx0XHRvcHNldEN1c3RvbWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuY3VzdG9tZXIpIHx8IHt9XG5cblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X2xpc3R2aWV3cycpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHNoYXJlZDogdHJ1ZX0sIHtmaWVsZHM6e19pZDoxfX0pLmZldGNoKClcblx0XHQjIHNoYXJlZExpc3RWaWV3cyA9IF8ucGx1Y2soc2hhcmVkTGlzdFZpZXdzLFwiX2lkXCIpXG5cdFx0IyBpZiBzaGFyZWRMaXN0Vmlld3MubGVuZ3RoXG5cdFx0IyBcdHVubGVzcyBvcHNldEFkbWluLmxpc3Rfdmlld3Ncblx0XHQjIFx0XHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBbXVxuXHRcdCMgXHRvcHNldEFkbWluLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0QWRtaW4ubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXG5cdFx0IyBcdHVubGVzcyBvcHNldFVzZXIubGlzdF92aWV3c1xuXHRcdCMgXHRcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gW11cblx0XHQjIFx0b3BzZXRVc2VyLmxpc3Rfdmlld3MgPSBfLnVuaW9uIG9wc2V0VXNlci5saXN0X3ZpZXdzLCBzaGFyZWRMaXN0Vmlld3Ncblx0XHQjIOaVsOaNruW6k+S4reWmguaenOmFjee9ruS6hum7mOiupOeahGFkbWluL3VzZXLmnYPpmZDpm4borr7nva7vvIzlupTor6Xopobnm5bku6PnoIHkuK1hZG1pbi91c2Vy55qE5p2D6ZmQ6ZuG6K6+572uXG5cdFx0aWYgcHNldHNBZG1pblxuXHRcdFx0cG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRBZG1pbiwgcG9zQWRtaW5cblx0XHRpZiBwc2V0c1VzZXJcblx0XHRcdHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0VXNlciwgcG9zVXNlclxuXHRcdGlmIHBzZXRzTWVtYmVyXG5cdFx0XHRwb3NNZW1iZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzTWVtYmVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzTWVtYmVyLl9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldE1lbWJlciwgcG9zTWVtYmVyXG5cdFx0aWYgcHNldHNHdWVzdFxuXHRcdFx0cG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRHdWVzdCwgcG9zR3Vlc3Rcblx0XHRpZiBwc2V0c1N1cHBsaWVyXG5cdFx0XHRwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRTdXBwbGllciwgcG9zU3VwcGxpZXJcblx0XHRpZiBwc2V0c0N1c3RvbWVyXG5cdFx0XHRwb3NDdXN0b21lciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXN0b21lcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0N1c3RvbWVyLl9pZCk7XG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRDdXN0b21lciwgcG9zQ3VzdG9tZXJcblxuXHRcdGlmICF1c2VySWRcblx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRBZG1pblxuXHRcdGVsc2Vcblx0XHRcdGlmIGlzU3BhY2VBZG1pblxuXHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgc3BhY2VJZCBpcyAnY29tbW9uJ1xuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzcGFjZVVzZXIgPSBpZiBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgb3IgdGhpcy5zcGFjZVVzZXIgdGhlbiB0aGlzLnNwYWNlVXNlciBlbHNlIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdFx0XHRcdGlmIHNwYWNlVXNlclxuXHRcdFx0XHRcdFx0cHJvZiA9IHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRcdFx0XHRpZiBwcm9mXG5cdFx0XHRcdFx0XHRcdGlmIHByb2YgaXMgJ3VzZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldFVzZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdtZW1iZXInXG5cdFx0XHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldE1lbWJlclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2d1ZXN0J1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ3N1cHBsaWVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRTdXBwbGllclxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIHByb2YgaXMgJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lclxuXHRcdFx0XHRcdFx0ZWxzZSAjIOayoeaciXByb2ZpbGXliJnorqTkuLrmmK91c2Vy5p2D6ZmQXG5cdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0XG5cdFx0aWYgcHNldHMubGVuZ3RoID4gMFxuXHRcdFx0c2V0X2lkcyA9IF8ucGx1Y2sgcHNldHMsIFwiX2lkXCJcblx0XHRcdHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpXG5cdFx0XHRwb3MgPSB1bmlvblBlcm1pc3Npb25PYmplY3RzKHBvcywgb2JqZWN0LCBwc2V0cylcblx0XHRcdF8uZWFjaCBwb3MsIChwbyktPlxuXHRcdFx0XHRpZiBwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0FkbWluPy5faWQgb3IgXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzVXNlcj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c01lbWJlcj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0d1ZXN0Py5faWQgb3Jcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNTdXBwbGllcj8uX2lkIG9yXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzQ3VzdG9tZXI/Ll9pZFxuXHRcdFx0XHRcdCMg6buY6K6k55qEYWRtaW4vdXNlcuadg+mZkOWAvOWPquWunuihjOS4iumdoueahOm7mOiupOWAvOimhueblu+8jOS4jeWBmueul+azleWIpOaWrVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRpZiBfLmlzRW1wdHkocGVybWlzc2lvbnMpXG5cdFx0XHRcdFx0cGVybWlzc2lvbnMgPSBwb1xuXHRcdFx0XHRvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMgcGVybWlzc2lvbnMsIHBvXG5cblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cylcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucywgcG8uZGlzYWJsZWRfYWN0aW9ucylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzLCBwby51bnJlbGF0ZWRfb2JqZWN0cylcblx0XHRcdFx0cGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCBwby51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdClcblx0XHRcblx0XHRpZiBvYmplY3QuaXNfdmlld1xuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZVxuXHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfYWN0aW9ucyA9IFtdXG5cdFx0Q3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgcGVybWlzc2lvbnNcblxuXHRcdGlmIG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lclxuXHRcdFx0cGVybWlzc2lvbnMub3duZXIgPSBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcblx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXG5cdCMgQ3JlYXRvci5pbml0UGVybWlzc2lvbnMgPSAob2JqZWN0X25hbWUpIC0+XG5cblx0XHQjICMg5bqU6K+l5oqK6K6h566X5Ye65p2l55qEXG5cdFx0IyBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXS5hbGxvd1xuXHRcdCMgXHRpbnNlcnQ6ICh1c2VySWQsIGRvYykgLT5cblx0XHQjIFx0XHRpZiAhdXNlcklkXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0ICAgIFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dDcmVhdGVcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblx0XHQjIFx0dXBkYXRlOiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dFZGl0XG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdCMgXHRyZW1vdmU6ICh1c2VySWQsIGRvYykgLT5cblx0XHQjIFx0XHRpZiAhdXNlcklkXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRpZiAhZG9jLnNwYWNlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQjIFx0XHRwZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoZG9jLnNwYWNlLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdCMgXHRcdGlmICFwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblxuXHRNZXRlb3IubWV0aG9kc1xuXHRcdCMgQ2FsY3VsYXRlIFBlcm1pc3Npb25zIG9uIFNlcnZlclxuXHRcdFwiY3JlYXRvci5vYmplY3RfcGVybWlzc2lvbnNcIjogKHNwYWNlSWQpLT5cblx0XHRcdHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKVxuIiwidmFyIGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgY2xvbmUsIGV4dGVuZFBlcm1pc3Npb25Qcm9wcywgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCwgZmluZF9wZXJtaXNzaW9uX29iamVjdCwgaW50ZXJzZWN0aW9uUGx1cywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzLCBvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMsIHBlcm1pc3Npb25Qcm9wTmFtZXMsIHVuaW9uUGVybWlzc2lvbk9iamVjdHMsIHVuaW9uUGx1cztcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5iYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJhbGxvd0NyZWF0ZVwiLCBcImFsbG93RGVsZXRlXCIsIFwiYWxsb3dFZGl0XCIsIFwiYWxsb3dSZWFkXCIsIFwibW9kaWZ5QWxsUmVjb3Jkc1wiLCBcInZpZXdBbGxSZWNvcmRzXCIsIFwibW9kaWZ5Q29tcGFueVJlY29yZHNcIiwgXCJ2aWV3Q29tcGFueVJlY29yZHNcIiwgXCJhbGxvd1JlYWRGaWxlc1wiLCBcImFsbG93RWRpdEZpbGVzXCIsIFwiYWxsb3dDcmVhdGVGaWxlc1wiLCBcImFsbG93RGVsZXRlRmlsZXNcIiwgXCJ2aWV3QWxsRmlsZXNcIiwgXCJtb2RpZnlBbGxGaWxlc1wiXTtcblxub3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiZGlzYWJsZWRfbGlzdF92aWV3c1wiLCBcImRpc2FibGVkX2FjdGlvbnNcIiwgXCJ1bnJlYWRhYmxlX2ZpZWxkc1wiLCBcInVuZWRpdGFibGVfZmllbGRzXCIsIFwidW5yZWxhdGVkX29iamVjdHNcIiwgXCJ1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdFwiXTtcblxucGVybWlzc2lvblByb3BOYW1lcyA9IF8udW5pb24oYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzLCBvdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMpO1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgb2JqO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIH1cbiAgICBvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIG9iai5wZXJtaXNzaW9ucy5nZXQoKTtcbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRSZWNvcmRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgaXNPd25lciwgbWFzdGVyT2JqZWN0TmFtZSwgbWFzdGVyUmVjb3JkUGVybSwgcGVybWlzc2lvbnMsIHJlY29yZF9jb21wYW55X2lkLCByZWNvcmRfY29tcGFueV9pZHMsIHJlZiwgdXNlcl9jb21wYW55X2lkcztcbiAgaWYgKCFvYmplY3RfbmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gIH1cbiAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gIH1cbiAgcGVybWlzc2lvbnMgPSBfLmNsb25lKENyZWF0b3IuZ2V0UGVybWlzc2lvbnMob2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCkpO1xuICBpZiAocmVjb3JkKSB7XG4gICAgaWYgKHJlY29yZC5yZWNvcmRfcGVybWlzc2lvbnMpIHtcbiAgICAgIHJldHVybiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zO1xuICAgIH1cbiAgICBpc093bmVyID0gcmVjb3JkLm93bmVyID09PSB1c2VySWQgfHwgKChyZWYgPSByZWNvcmQub3duZXIpICE9IG51bGwgPyByZWYuX2lkIDogdm9pZCAwKSA9PT0gdXNlcklkO1xuICAgIGlmIChvYmplY3RfbmFtZSA9PT0gXCJjbXNfZmlsZXNcIikge1xuICAgICAgbWFzdGVyT2JqZWN0TmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuICAgICAgbWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMobWFzdGVyT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gcGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXM7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHBlcm1pc3Npb25zLmFsbG93RGVsZXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dEZWxldGVGaWxlcztcbiAgICAgIGlmICghbWFzdGVyUmVjb3JkUGVybS5tb2RpZnlBbGxGaWxlcyAmJiAhaXNPd25lcikge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHBlcm1pc3Npb25zLmFsbG93UmVhZCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZEZpbGVzO1xuICAgICAgaWYgKCFtYXN0ZXJSZWNvcmRQZXJtLnZpZXdBbGxGaWxlcyAmJiAhaXNPd25lcikge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICB1c2VyX2NvbXBhbnlfaWRzID0gU3RlZWRvcy5nZXRVc2VyQ29tcGFueUlkcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKTtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZCA6IHZvaWQgMDtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSAmJiByZWNvcmRfY29tcGFueV9pZC5faWQpIHtcbiAgICAgICAgcmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmRfY29tcGFueV9pZC5faWQ7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZHMgPSByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5jb21wYW55X2lkcyA6IHZvaWQgMDtcbiAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCAmJiBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSkpIHtcbiAgICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkX2NvbXBhbnlfaWRzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IF8udW5pb24ocmVjb3JkX2NvbXBhbnlfaWRzLCBbcmVjb3JkX2NvbXBhbnlfaWRdKTtcbiAgICAgIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiAhaXNPd25lciAmJiAhcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIGlmIChyZWNvcmRfY29tcGFueV9pZHMgJiYgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgIGlmICh1c2VyX2NvbXBhbnlfaWRzICYmIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoIV8uaW50ZXJzZWN0aW9uKHVzZXJfY29tcGFueV9pZHMsIHJlY29yZF9jb21wYW55X2lkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVjb3JkLmxvY2tlZCAmJiAhcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmIHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwZXJtaXNzaW9ucztcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oY3VycmVudE9iamVjdE5hbWUsIHJlbGF0ZWRMaXN0SXRlbSwgY3VycmVudFJlY29yZCwgdXNlcklkLCBzcGFjZUlkKSB7XG4gICAgdmFyIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSwgbWFzdGVyQWxsb3csIG1hc3RlclJlY29yZFBlcm0sIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucywgcmVzdWx0LCB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ7XG4gICAgaWYgKCFjdXJyZW50T2JqZWN0TmFtZSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRPYmplY3ROYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFyZWxhdGVkTGlzdEl0ZW0pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmICghY3VycmVudFJlY29yZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZUlkICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgbWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhyZWxhdGVkTGlzdEl0ZW0ub2JqZWN0X25hbWUpO1xuICAgIHJlc3VsdCA9IF8uY2xvbmUocmVsYXRlZE9iamVjdFBlcm1pc3Npb25zKTtcbiAgICBpZiAocmVsYXRlZExpc3RJdGVtLmlzX2ZpbGUpIHtcbiAgICAgIHJlc3VsdC5hbGxvd0NyZWF0ZSA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXM7XG4gICAgICByZXN1bHQuYWxsb3dFZGl0ID0gcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRMaXN0SXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB8fCBmYWxzZTtcbiAgICAgIG1hc3RlckFsbG93ID0gZmFsc2U7XG4gICAgICBpZiAod3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT09IHRydWUpIHtcbiAgICAgICAgbWFzdGVyQWxsb3cgPSBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZDtcbiAgICAgIH0gZWxzZSBpZiAod3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT09IGZhbHNlKSB7XG4gICAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXQ7XG4gICAgICB9XG4gICAgICB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IENyZWF0b3IuZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0KGN1cnJlbnRSZWNvcmQsIGN1cnJlbnRPYmplY3ROYW1lKTtcbiAgICAgIGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xO1xuICAgICAgcmVzdWx0LmFsbG93Q3JlYXRlID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmICFpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGU7XG4gICAgICByZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgX2ksIGlzU3BhY2VBZG1pbiwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7XG4gICAgICBvYmplY3RzOiB7fSxcbiAgICAgIGFzc2lnbmVkX2FwcHM6IFtdXG4gICAgfTtcblxuICAgIC8qXG4gICAgXHRcdOadg+mZkOmbhuivtOaYjjpcbiAgICBcdFx05YaF572u5p2D6ZmQ6ZuGLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxuICAgIFx0XHToh6rlrprkuYnmnYPpmZDpm4Yt5pWw5o2u5bqT5Lit5paw5bu655qE6Zmk5YaF572u5p2D6ZmQ6ZuG5Lul5aSW55qE5YW25LuW5p2D6ZmQ6ZuGXG4gICAgXHRcdOeJueWumueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5LiN5Y+v6YWN572u77yJLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0XG4gICAgXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOmbhlxuICAgICAqL1xuICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgaWYgKHVzZXJJZCkge1xuICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KSB8fCBudWxsO1xuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgcHNldHNBZG1pbl9wb3MgPSBudWxsO1xuICAgIHBzZXRzVXNlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNHdWVzdF9wb3MgPSBudWxsO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSBudWxsO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGw7XG4gICAgaWYgKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzQ3VycmVudC5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwiX2lkXCIpO1xuICAgICAgcHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgICAkaW46IHNldF9pZHNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwibmFtZVwiKTtcbiAgICB9XG4gICAgcHNldHMgPSB7XG4gICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudCxcbiAgICAgIHBzZXRzTWVtYmVyOiBwc2V0c01lbWJlcixcbiAgICAgIHBzZXRzR3Vlc3Q6IHBzZXRzR3Vlc3QsXG4gICAgICBwc2V0c1N1cHBsaWVyOiBwc2V0c1N1cHBsaWVyLFxuICAgICAgcHNldHNDdXN0b21lcjogcHNldHNDdXN0b21lcixcbiAgICAgIGlzU3BhY2VBZG1pbjogaXNTcGFjZUFkbWluLFxuICAgICAgc3BhY2VVc2VyOiBzcGFjZVVzZXIsXG4gICAgICBwc2V0c0FkbWluX3BvczogcHNldHNBZG1pbl9wb3MsXG4gICAgICBwc2V0c1VzZXJfcG9zOiBwc2V0c1VzZXJfcG9zLFxuICAgICAgcHNldHNNZW1iZXJfcG9zOiBwc2V0c01lbWJlcl9wb3MsXG4gICAgICBwc2V0c0d1ZXN0X3BvczogcHNldHNHdWVzdF9wb3MsXG4gICAgICBwc2V0c1N1cHBsaWVyX3BvczogcHNldHNTdXBwbGllcl9wb3MsXG4gICAgICBwc2V0c0N1c3RvbWVyX3BvczogcHNldHNDdXN0b21lcl9wb3MsXG4gICAgICBwc2V0c0N1cnJlbnRfcG9zOiBwc2V0c0N1cnJlbnRfcG9zXG4gICAgfTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9hcHBzID0gQ3JlYXRvci5nZXRBc3NpZ25lZEFwcHMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy5hc3NpZ25lZF9tZW51cyA9IENyZWF0b3IuZ2V0QXNzaWduZWRNZW51cy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXM7XG4gICAgX2kgPSAwO1xuICAgIF8uZWFjaChDcmVhdG9yLm9iamVjdHNCeU5hbWUsIGZ1bmN0aW9uKG9iamVjdCwgb2JqZWN0X25hbWUpIHtcbiAgICAgIF9pKys7XG4gICAgICBpZiAoIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT09IHNwYWNlSWQpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdpbl9kZXZlbG9wbWVudCcpIHx8IG9iamVjdC5pbl9kZXZlbG9wbWVudCA9PT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT09ICcwJyAmJiBpc1NwYWNlQWRtaW4pKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV0gPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXSksIHNwYWNlSWQpO1xuICAgICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfTtcbiAgdW5pb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLnVuaW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIGludGVyc2VjdGlvblBsdXMgPSBmdW5jdGlvbihhcnJheSwgb3RoZXIpIHtcbiAgICBpZiAoIWFycmF5ICYmICFvdGhlcikge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFhcnJheSkge1xuICAgICAgYXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgb3RoZXIgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGFycmF5LCBvdGhlcik7XG4gIH07XG4gIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcHMpIHtcbiAgICB2YXIgZmlsZXNQcm9OYW1lcywgcHJvcE5hbWVzO1xuICAgIHByb3BOYW1lcyA9IHBlcm1pc3Npb25Qcm9wTmFtZXM7XG4gICAgcmV0dXJuIGZpbGVzUHJvTmFtZXMgPSBwcm9wcyA/IF8uZWFjaChwcm9wTmFtZXMsIGZ1bmN0aW9uKHByb3BOYW1lKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICB9KSA6IHZvaWQgMDtcbiAgfTtcbiAgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wcykge1xuICAgIHZhciBwcm9wTmFtZXM7XG4gICAgcHJvcE5hbWVzID0gYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzO1xuICAgIHJldHVybiBfLmVhY2gocHJvcE5hbWVzLCBmdW5jdGlvbihwcm9wTmFtZSkge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BOYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFwcHMsIGlzU3BhY2VBZG1pbiwgcHNldEJhc2UsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0N1c3RvbWVyLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1VzZXIsIHJlZiwgcmVmMSwgc3BhY2VVc2VyLCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0c0FkbWluID0gdGhpcy5wc2V0c0FkbWluIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IHRoaXMucHNldHNVc2VyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAndXNlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IHRoaXMucHNldHNNZW1iZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IHRoaXMucHNldHNHdWVzdCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhcHBzID0gW107XG4gICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9IChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmLnByb2ZpbGUgOiB2b2lkIDA7XG4gICAgICBwc2V0QmFzZSA9IHBzZXRzVXNlcjtcbiAgICAgIGlmICh1c2VyUHJvZmlsZSkge1xuICAgICAgICBpZiAodXNlclByb2ZpbGUgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXI7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlclByb2ZpbGUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICBwc2V0QmFzZSA9IHBzZXRzQ3VzdG9tZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwc2V0QmFzZSAhPSBudWxsID8gKHJlZjEgPSBwc2V0QmFzZS5hc3NpZ25lZF9hcHBzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgYXBwcyA9IF8udW5pb24oYXBwcywgcHNldEJhc2UuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBfLmVhY2gocHNldHMsIGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgaWYgKCFwc2V0LmFzc2lnbmVkX2FwcHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBzZXQubmFtZSA9PT0gXCJhZG1pblwiIHx8IHBzZXQubmFtZSA9PT0gXCJ1c2VyXCIgfHwgcHNldC5uYW1lID09PSAnc3VwcGxpZXInIHx8IHBzZXQubmFtZSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXBwcyA9IF8udW5pb24oYXBwcywgcHNldC5hc3NpZ25lZF9hcHBzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksIHZvaWQgMCwgbnVsbCk7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgYWJvdXRNZW51LCBhZG1pbk1lbnVzLCBhbGxNZW51cywgY3VycmVudFBzZXROYW1lcywgaXNTcGFjZUFkbWluLCBtZW51cywgb3RoZXJNZW51QXBwcywgb3RoZXJNZW51cywgcHNldHMsIHJlZiwgcmVmMSwgcmVzdWx0LCB1c2VyUHJvZmlsZTtcbiAgICBwc2V0cyA9IHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgbmFtZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGFkbWluTWVudXMgPSAocmVmID0gQ3JlYXRvci5BcHBzLmFkbWluKSAhPSBudWxsID8gcmVmLmFkbWluX21lbnVzIDogdm9pZCAwO1xuICAgIGlmICghYWRtaW5NZW51cykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBhYm91dE1lbnUgPSBhZG1pbk1lbnVzLmZpbmQoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkID09PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5faWQgIT09ICdhYm91dCc7XG4gICAgfSk7XG4gICAgb3RoZXJNZW51QXBwcyA9IF8uc29ydEJ5KF8uZmlsdGVyKF8udmFsdWVzKENyZWF0b3IuQXBwcyksIGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmFkbWluX21lbnVzICYmIG4uX2lkICE9PSAnYWRtaW4nO1xuICAgIH0pLCAnc29ydCcpO1xuICAgIG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKTtcbiAgICBhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJlc3VsdCA9IGFsbE1lbnVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyUHJvZmlsZSA9ICgocmVmMSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSkpICE9IG51bGwgPyByZWYxLnByb2ZpbGUgOiB2b2lkIDApIHx8ICd1c2VyJztcbiAgICAgIGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5uYW1lO1xuICAgICAgfSk7XG4gICAgICBtZW51cyA9IGFsbE1lbnVzLmZpbHRlcihmdW5jdGlvbihtZW51KSB7XG4gICAgICAgIHZhciBwc2V0c01lbnU7XG4gICAgICAgIHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzO1xuICAgICAgICBpZiAocHNldHNNZW51ICYmIHBzZXRzTWVudS5pbmRleE9mKHVzZXJQcm9maWxlKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKGN1cnJlbnRQc2V0TmFtZXMsIHBzZXRzTWVudSkubGVuZ3RoO1xuICAgICAgfSk7XG4gICAgICByZXN1bHQgPSBtZW51cztcbiAgICB9XG4gICAgcmV0dXJuIF8uc29ydEJ5KHJlc3VsdCwgXCJzb3J0XCIpO1xuICB9O1xuICBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQpIHtcbiAgICBpZiAoXy5pc051bGwocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkocGVybWlzc2lvbl9vYmplY3RzKSkge1xuICAgICAgcmV0dXJuIF8uZmluZChwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZFxuICAgIH0pO1xuICB9O1xuICBmaW5kX3Blcm1pc3Npb25fb2JqZWN0ID0gZnVuY3Rpb24ocGVybWlzc2lvbl9vYmplY3RzLCBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWRzKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcihwZXJtaXNzaW9uX29iamVjdHMsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHJldHVybiBwby5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICRpbjogcGVybWlzc2lvbl9zZXRfaWRzXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgfTtcbiAgdW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IGZ1bmN0aW9uKHBvcywgb2JqZWN0LCBwc2V0cykge1xuICAgIHZhciByZXN1bHQ7XG4gICAgcmVzdWx0ID0gW107XG4gICAgXy5lYWNoKG9iamVjdC5wZXJtaXNzaW9uX3NldCwgZnVuY3Rpb24ob3BzLCBvcHNfa2V5KSB7XG4gICAgICB2YXIgY3VycmVudFBzZXQsIHRlbXBPcHM7XG4gICAgICBpZiAoW1wiYWRtaW5cIiwgXCJ1c2VyXCIsIFwibWVtYmVyXCIsIFwiZ3Vlc3RcIl0uaW5kZXhPZihvcHNfa2V5KSA8IDApIHtcbiAgICAgICAgY3VycmVudFBzZXQgPSBwc2V0cy5maW5kKGZ1bmN0aW9uKHBzZXQpIHtcbiAgICAgICAgICByZXR1cm4gcHNldC5uYW1lID09PSBvcHNfa2V5O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGN1cnJlbnRQc2V0KSB7XG4gICAgICAgICAgdGVtcE9wcyA9IF8uY2xvbmUob3BzKSB8fCB7fTtcbiAgICAgICAgICB0ZW1wT3BzLnBlcm1pc3Npb25fc2V0X2lkID0gY3VycmVudFBzZXQuX2lkO1xuICAgICAgICAgIHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWU7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHRlbXBPcHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcbiAgICAgIHBvcy5mb3JFYWNoKGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIHZhciByZXBlYXRJbmRleCwgcmVwZWF0UG87XG4gICAgICAgIHJlcGVhdEluZGV4ID0gMDtcbiAgICAgICAgcmVwZWF0UG8gPSByZXN1bHQuZmluZChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgIHJlcGVhdEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0ucGVybWlzc2lvbl9zZXRfaWQgPT09IHBvLnBlcm1pc3Npb25fc2V0X2lkO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlcGVhdFBvKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2gocG8pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwb3M7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSkge1xuICAgIHZhciBpc1NwYWNlQWRtaW4sIG9iamVjdCwgb3BzZXRBZG1pbiwgb3BzZXRDdXN0b21lciwgb3BzZXRHdWVzdCwgb3BzZXRNZW1iZXIsIG9wc2V0U3VwcGxpZXIsIG9wc2V0VXNlciwgcGVybWlzc2lvbnMsIHBvcywgcG9zQWRtaW4sIHBvc0N1c3RvbWVyLCBwb3NHdWVzdCwgcG9zTWVtYmVyLCBwb3NTdXBwbGllciwgcG9zVXNlciwgcHJvZiwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHNldF9pZHMsIHNwYWNlVXNlcjtcbiAgICBwZXJtaXNzaW9ucyA9IHt9O1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKTtcbiAgICBpZiAoc3BhY2VJZCA9PT0gJ2d1ZXN0JyB8fCBvYmplY3RfbmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcHNldHNBZG1pbiA9IF8uaXNOdWxsKHRoaXMucHNldHNBZG1pbikgfHwgdGhpcy5wc2V0c0FkbWluID8gdGhpcy5wc2V0c0FkbWluIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIHx8IHRoaXMucHNldHNVc2VyID8gdGhpcy5wc2V0c1VzZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzTWVtYmVyID0gXy5pc051bGwodGhpcy5wc2V0c01lbWJlcikgfHwgdGhpcy5wc2V0c01lbWJlciA/IHRoaXMucHNldHNNZW1iZXIgOiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNHdWVzdCA9IF8uaXNOdWxsKHRoaXMucHNldHNHdWVzdCkgfHwgdGhpcy5wc2V0c0d1ZXN0ID8gdGhpcy5wc2V0c0d1ZXN0IDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNTdXBwbGllciA9IF8uaXNOdWxsKHRoaXMucHNldHNTdXBwbGllcikgfHwgdGhpcy5wc2V0c1N1cHBsaWVyID8gdGhpcy5wc2V0c1N1cHBsaWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNDdXN0b21lciA9IF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgfHwgdGhpcy5wc2V0c0N1c3RvbWVyID8gdGhpcy5wc2V0c0N1c3RvbWVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudDtcbiAgICBpZiAoIXBzZXRzKSB7XG4gICAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcHNldHNBZG1pbl9wb3MgPSB0aGlzLnBzZXRzQWRtaW5fcG9zO1xuICAgIHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3M7XG4gICAgcHNldHNNZW1iZXJfcG9zID0gdGhpcy5wc2V0c01lbWJlcl9wb3M7XG4gICAgcHNldHNHdWVzdF9wb3MgPSB0aGlzLnBzZXRzR3Vlc3RfcG9zO1xuICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gdGhpcy5wc2V0c1N1cHBsaWVyX3BvcztcbiAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IHRoaXMucHNldHNDdXN0b21lcl9wb3M7XG4gICAgcHNldHNDdXJyZW50X3BvcyA9IHRoaXMucHNldHNDdXJyZW50X3BvcztcbiAgICBvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9O1xuICAgIG9wc2V0VXNlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LnVzZXIpIHx8IHt9O1xuICAgIG9wc2V0TWVtYmVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQubWVtYmVyKSB8fCB7fTtcbiAgICBvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9O1xuICAgIG9wc2V0U3VwcGxpZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5zdXBwbGllcikgfHwge307XG4gICAgb3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fTtcbiAgICBpZiAocHNldHNBZG1pbikge1xuICAgICAgcG9zQWRtaW4gPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQWRtaW5fcG9zLCBvYmplY3RfbmFtZSwgcHNldHNBZG1pbi5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0QWRtaW4sIHBvc0FkbWluKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlcikge1xuICAgICAgcG9zVXNlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNVc2VyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzVXNlci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0VXNlciwgcG9zVXNlcik7XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlcikge1xuICAgICAgcG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0TWVtYmVyLCBwb3NNZW1iZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNHdWVzdCkge1xuICAgICAgcG9zR3Vlc3QgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzR3Vlc3RfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNHdWVzdC5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0R3Vlc3QsIHBvc0d1ZXN0KTtcbiAgICB9XG4gICAgaWYgKHBzZXRzU3VwcGxpZXIpIHtcbiAgICAgIHBvc1N1cHBsaWVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1N1cHBsaWVyX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzU3VwcGxpZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldFN1cHBsaWVyLCBwb3NTdXBwbGllcik7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1c3RvbWVyKSB7XG4gICAgICBwb3NDdXN0b21lciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXN0b21lcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c0N1c3RvbWVyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRDdXN0b21lciwgcG9zQ3VzdG9tZXIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEFkbWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzcGFjZUlkID09PSAnY29tbW9uJykge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNwYWNlVXNlciA9IF8uaXNOdWxsKHRoaXMuc3BhY2VVc2VyKSB8fCB0aGlzLnNwYWNlVXNlciA/IHRoaXMuc3BhY2VVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHNwYWNlVXNlcikge1xuICAgICAgICAgICAgcHJvZiA9IHNwYWNlVXNlci5wcm9maWxlO1xuICAgICAgICAgICAgaWYgKHByb2YpIHtcbiAgICAgICAgICAgICAgaWYgKHByb2YgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdtZW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldE1lbWJlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnZ3Vlc3QnKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldEd1ZXN0O1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdzdXBwbGllcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRDdXN0b21lcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFVzZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzLCBcIl9pZFwiKTtcbiAgICAgIHBvcyA9IGZpbmRfcGVybWlzc2lvbl9vYmplY3QocHNldHNDdXJyZW50X3Bvcywgb2JqZWN0X25hbWUsIHNldF9pZHMpO1xuICAgICAgcG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpO1xuICAgICAgXy5lYWNoKHBvcywgZnVuY3Rpb24ocG8pIHtcbiAgICAgICAgaWYgKHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHx8IHBvLnBlcm1pc3Npb25fc2V0X2lkID09PSAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLmlzRW1wdHkocGVybWlzc2lvbnMpKSB7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBwbztcbiAgICAgICAgfVxuICAgICAgICBvdmVybGF5QmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcHMocGVybWlzc2lvbnMsIHBvKTtcbiAgICAgICAgcGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cywgcG8uZGlzYWJsZWRfbGlzdF92aWV3cyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIHBvLnVucmVhZGFibGVfZmllbGRzKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzLCBwby51bmVkaXRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpO1xuICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMudW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0LCBwby51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9iamVjdC5pc192aWV3KSB7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMubW9kaWZ5Q29tcGFueVJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXTtcbiAgICB9XG4gICAgQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMocGVybWlzc2lvbnMpO1xuICAgIGlmIChvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXIpIHtcbiAgICAgIHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyO1xuICAgIH1cbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICBcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHRoaXMudXNlcklkKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKVxuXG5NZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdGNyZWF0b3JfZGJfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fVVJMX0NSRUFUT1Jcblx0b3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1Jcblx0aWYgY3JlYXRvcl9kYl91cmxcblx0XHRpZiAhb3Bsb2dfdXJsXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIilcblx0XHRDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7X2RyaXZlcjogbmV3IE1vbmdvSW50ZXJuYWxzLlJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoY3JlYXRvcl9kYl91cmwsIHtvcGxvZ1VybDogb3Bsb2dfdXJsfSl9XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSAob2JqZWN0KS0+XG4jXHRpZiBvYmplY3QudGFibGVfbmFtZSAmJiBvYmplY3QudGFibGVfbmFtZS5lbmRzV2l0aChcIl9fY1wiKVxuI1x0XHRyZXR1cm4gb2JqZWN0LnRhYmxlX25hbWVcbiNcdGVsc2VcbiNcdFx0cmV0dXJuIG9iamVjdC5uYW1lXG5cdHJldHVybiBvYmplY3QubmFtZVxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gKG9iamVjdCktPlxuXHRjb2xsZWN0aW9uX2tleSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUob2JqZWN0KVxuXHRpZiBkYltjb2xsZWN0aW9uX2tleV1cblx0XHRyZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldXG5cdGVsc2UgaWYgb2JqZWN0LmRiXG5cdFx0cmV0dXJuIG9iamVjdC5kYlxuXG5cdGlmIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXG5cdFx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldXG5cdGVsc2Vcblx0XHRpZiBvYmplY3QuY3VzdG9tXG5cdFx0XHRyZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKVxuXHRcdGVsc2Vcblx0XHRcdGlmIGNvbGxlY3Rpb25fa2V5ID09ICdfc21zX3F1ZXVlJyAmJiBTTVNRdWV1ZT8uY29sbGVjdGlvblxuXHRcdFx0XHRyZXR1cm4gU01TUXVldWUuY29sbGVjdGlvblxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpXG5cblxuIiwidmFyIHN0ZWVkb3NDb3JlO1xuXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdG9yX2RiX3VybCwgb3Bsb2dfdXJsO1xuICBjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SO1xuICBvcGxvZ191cmwgPSBwcm9jZXNzLmVudi5NT05HT19PUExPR19VUkxfQ1JFQVRPUjtcbiAgaWYgKGNyZWF0b3JfZGJfdXJsKSB7XG4gICAgaWYgKCFvcGxvZ191cmwpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIlBsZWFzZSBjb25maWd1cmUgZW52aXJvbm1lbnQgdmFyaWFibGVzOiBNT05HT19PUExPR19VUkxfQ1JFQVRPUlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSA9IHtcbiAgICAgIF9kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7XG4gICAgICAgIG9wbG9nVXJsOiBvcGxvZ191cmxcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxufSk7XG5cbkNyZWF0b3IuZ2V0Q29sbGVjdGlvbk5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdC5uYW1lO1xufTtcblxuQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBjb2xsZWN0aW9uX2tleTtcbiAgY29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdCk7XG4gIGlmIChkYltjb2xsZWN0aW9uX2tleV0pIHtcbiAgICByZXR1cm4gZGJbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2UgaWYgKG9iamVjdC5kYikge1xuICAgIHJldHVybiBvYmplY3QuZGI7XG4gIH1cbiAgaWYgKENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbY29sbGVjdGlvbl9rZXldO1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3QuY3VzdG9tKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0NvcmUubmV3Q29sbGVjdGlvbihjb2xsZWN0aW9uX2tleSwgQ3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbGxlY3Rpb25fa2V5ID09PSAnX3Ntc19xdWV1ZScgJiYgKHR5cGVvZiBTTVNRdWV1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTTVNRdWV1ZSAhPT0gbnVsbCA/IFNNU1F1ZXVlLmNvbGxlY3Rpb24gOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXkpO1xuICAgIH1cbiAgfVxufTtcbiIsIkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9XG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRzdGVlZG9zRmlsdGVycyA9IHJlcXVpcmUoXCJAc3RlZWRvcy9maWx0ZXJzXCIpO1xuXHQjIOWumuS5ieWFqOWxgCBhY3Rpb25zIOWHveaVsFx0XG5cdENyZWF0b3IuYWN0aW9ucyA9IChhY3Rpb25zKS0+XG5cdFx0Xy5lYWNoIGFjdGlvbnMsICh0b2RvLCBhY3Rpb25fbmFtZSktPlxuXHRcdFx0Q3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbl9uYW1lXSA9IHRvZG8gXG5cblx0Q3JlYXRvci5leGVjdXRlQWN0aW9uID0gKG9iamVjdF9uYW1lLCBhY3Rpb24sIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50LCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbGJhY2spLT5cblx0XHRpZiBhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT0gJ3dvcmQtcHJpbnQnXG5cdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0ZmlsdGVycyA9IFsnX2lkJywgJz0nLCByZWNvcmRfaWRdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZpbHRlcnMgPSBPYmplY3RHcmlkLmdldEZpbHRlcnMob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZmFsc2UsIG51bGwsIG51bGwpXG5cdFx0XHR1cmwgPSBcIi9hcGkvdjQvd29yZF90ZW1wbGF0ZXMvXCIgKyBhY3Rpb24ud29yZF90ZW1wbGF0ZSArIFwiL3ByaW50XCIgKyBcIj9maWx0ZXJzPVwiICsgc3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvT0RhdGFRdWVyeShmaWx0ZXJzKTtcblx0XHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcblx0XHRcdHJldHVybiB3aW5kb3cub3Blbih1cmwpO1xuXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgYWN0aW9uPy50b2RvXG5cdFx0XHRpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJzdHJpbmdcIlxuXHRcdFx0XHR0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXVxuXHRcdFx0ZWxzZSBpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdHRvZG8gPSBhY3Rpb24udG9kb1x0XG5cdFx0XHRpZiAhcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxuXHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0aWYgdG9kb1xuXHRcdFx0XHQjIGl0ZW1fZWxlbWVudOS4uuepuuaXtuW6lOivpeiuvue9rum7mOiupOWAvO+8iOWvueixoeeahG5hbWXlrZfmrrXvvInvvIzlkKbliJltb3JlQXJnc+aLv+WIsOeahOWQjue7reWPguaVsOS9jee9ruWwseS4jeWvuVxuXHRcdFx0XHRpdGVtX2VsZW1lbnQgPSBpZiBpdGVtX2VsZW1lbnQgdGhlbiBpdGVtX2VsZW1lbnQgZWxzZSBcIlwiXG5cdFx0XHRcdG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxuXHRcdFx0XHR0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpXG5cdFx0XHRcdHRvZG8uYXBwbHkge1xuXHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdHJlY29yZF9pZDogcmVjb3JkX2lkXG5cdFx0XHRcdFx0b2JqZWN0OiBvYmpcblx0XHRcdFx0XHRhY3Rpb246IGFjdGlvblxuXHRcdFx0XHRcdGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50XG5cdFx0XHRcdFx0cmVjb3JkOiByZWNvcmRcblx0XHRcdFx0fSwgdG9kb0FyZ3Ncblx0XHRcdGVsc2Vcblx0XHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXG5cdFx0ZWxzZVxuXHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXG5cblxuXHRfZGVsZXRlUmVjb3JkID0gKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaywgY2FsbF9iYWNrX2Vycm9yKS0+XG5cdFx0IyBjb25zb2xlLmxvZyhcIj09PV9kZWxldGVSZWNvcmQ9PT1cIiwgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpO1xuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRcdHByZXZpb3VzRG9jID0gRm9ybU1hbmFnZXIuZ2V0UHJldmlvdXNEb2Mob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgJ2RlbGV0ZScpXG5cdFx0Q3JlYXRvci5vZGF0YS5kZWxldGUgb2JqZWN0X25hbWUsIHJlY29yZF9pZCwgKCktPlxuXHRcdFx0aWYgcmVjb3JkX3RpdGxlXG5cdFx0XHRcdCMgaW5mbyA9IG9iamVjdC5sYWJlbCArIFwiXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIiArIFwi5bey5Yig6ZmkXCJcblx0XHRcdFx0aW5mbyA9dCBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlX3N1Y1wiLCBvYmplY3QubGFiZWwgKyBcIlxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5mbyA9IHQoJ2NyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3N1YycpXG5cdFx0XHR0b2FzdHIuc3VjY2VzcyBpbmZvXG5cdFx0XHRpZiBjYWxsX2JhY2sgYW5kIHR5cGVvZiBjYWxsX2JhY2sgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdGNhbGxfYmFjaygpXG5cblx0XHRcdEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYWZ0ZXInLCB7X2lkOiByZWNvcmRfaWQsIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY30pXG5cdFx0LCAoZXJyb3IpLT5cblx0XHRcdGlmIGNhbGxfYmFja19lcnJvciBhbmQgdHlwZW9mIGNhbGxfYmFja19lcnJvciA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0Y2FsbF9iYWNrX2Vycm9yKClcblx0XHRcdEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7X2lkOiByZWNvcmRfaWQsIGVycm9yOiBlcnJvcn0pXG5cblx0Q3JlYXRvci5yZWxhdGVkT2JqZWN0U3RhbmRhcmROZXcgPSAocmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdHJlbGF0ZU9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpXG5cdFx0Y29sbGVjdGlvbl9uYW1lID0gcmVsYXRlT2JqZWN0LmxhYmVsXG5cdFx0Y29sbGVjdGlvbiA9IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy4je0NyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpLl9jb2xsZWN0aW9uX25hbWV9XCJcblx0XHRjdXJyZW50X29iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRcdGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIilcblx0XHRpZHMgPSBDcmVhdG9yLlRhYnVsYXJTZWxlY3RlZElkc1tyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdGluaXRpYWxWYWx1ZXMgPSB7fTtcblx0XHRpZiBpZHM/Lmxlbmd0aFxuXHRcdFx0IyDliJfooajmnInpgInkuK3pobnml7bvvIzlj5bnrKzkuIDkuKrpgInkuK3pobnvvIzlpI3liLblhbblhoXlrrnliLDmlrDlu7rnqpflj6PkuK1cblx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XG5cdFx0XHRyZWNvcmRfaWQgPSBpZHNbMF1cblx0XHRcdGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdGluaXRpYWxWYWx1ZXMgPSBkb2Ncblx0XHRcdCMg4oCc5L+d5a2Y5bm25paw5bu64oCd5pON5L2c5Lit6Ieq5Yqo5omT5byA55qE5paw56qX5Y+j5Lit6ZyA6KaB5YaN5qyh5aSN5Yi25pyA5paw55qEZG9j5YaF5a655Yiw5paw56qX5Y+j5LitXG5cdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdGRlZmF1bHREb2MgPSBGb3JtTWFuYWdlci5nZXRSZWxhdGVkSW5pdGlhbFZhbHVlcyhjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCwgcmVsYXRlZF9vYmplY3RfbmFtZSk7XG5cdFx0XHRpZiAhXy5pc0VtcHR5KGRlZmF1bHREb2MpXG5cdFx0XHRcdGluaXRpYWxWYWx1ZXMgPSBkZWZhdWx0RG9jXG5cdFx0aWYgcmVsYXRlT2JqZWN0Py52ZXJzaW9uID49IDJcblx0XHRcdHJldHVybiBTdGVlZG9zVUkuc2hvd01vZGFsKHN0b3Jlcy5Db21wb25lbnRSZWdpc3RyeS5jb21wb25lbnRzLk9iamVjdEZvcm0sIHtcblx0XHRcdFx0bmFtZTogXCIje3JlbGF0ZWRfb2JqZWN0X25hbWV9X3N0YW5kYXJkX25ld19mb3JtXCIsXG5cdFx0XHRcdG9iamVjdEFwaU5hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG5cdFx0XHRcdHRpdGxlOiAn5paw5bu6ICcgKyByZWxhdGVPYmplY3QubGFiZWwsXG5cdFx0XHRcdGluaXRpYWxWYWx1ZXM6IGluaXRpYWxWYWx1ZXMsXG5cdFx0XHRcdGFmdGVySW5zZXJ0OiAocmVzdWx0KS0+XG5cdFx0XHRcdFx0c2V0VGltZW91dCgoKS0+XG5cdFx0XHRcdFx0XHQjIE9iamVjdEZvcm3mnInnvJPlrZjvvIzmlrDlu7rlrZDooajorrDlvZXlj6/og73kvJrmnInmsYfmgLvlrZfmrrXvvIzpnIDopoHliLfmlrDooajljZXmlbDmja5cblx0XHRcdFx0XHRcdGlmIENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpLnZlcnNpb24gPiAxXG5cdFx0XHRcdFx0XHRcdFN0ZWVkb3NVSS5yZWxvYWRSZWNvcmQoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdCwgMSk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9LCBudWxsLCB7aWNvblBhdGg6ICcvYXNzZXRzL2ljb25zJ30pXG5cblxuXHRcdGlmIGlkcz8ubGVuZ3RoXG5cdFx0XHQjIOWIl+ihqOaciemAieS4remhueaXtu+8jOWPluesrOS4gOS4qumAieS4remhue+8jOWkjeWItuWFtuWGheWuueWIsOaWsOW7uueql+WPo+S4rVxuXHRcdFx0IyDov5nnmoTnrKzkuIDkuKrmjIfnmoTmmK/nrKzkuIDmrKHli77pgInnmoTpgInkuK3pobnvvIzogIzkuI3mmK/liJfooajkuK3lt7Lli77pgInnmoTnrKzkuIDpoblcblx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblx0XHRcdCMg4oCc5L+d5a2Y5bm25paw5bu64oCd5pON5L2c5Lit6Ieq5Yqo5omT5byA55qE5paw56qX5Y+j5Lit6ZyA6KaB5YaN5qyh5aSN5Yi25pyA5paw55qEZG9j5YaF5a655Yiw5paw56qX5Y+j5LitXG5cdFx0XHRTZXNzaW9uLnNldCAnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdGlmICFfLmlzRW1wdHkoaW5pdGlhbFZhbHVlcylcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fZmllbGRzXCIsIHVuZGVmaW5lZClcblx0XHRTZXNzaW9uLnNldChcImFjdGlvbl9jb2xsZWN0aW9uXCIsIGNvbGxlY3Rpb24pXG5cdFx0U2Vzc2lvbi5zZXQoXCJhY3Rpb25fY29sbGVjdGlvbl9uYW1lXCIsIGNvbGxlY3Rpb25fbmFtZSlcblx0XHRTZXNzaW9uLnNldChcImFjdGlvbl9zYXZlX2FuZF9pbnNlcnRcIiwgZmFsc2UpXG5cdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdCQoXCIuY3JlYXRvci1hZGQtcmVsYXRlZFwiKS5jbGljaygpXG5cdFx0cmV0dXJuXG5cblx0Q3JlYXRvci5hY3Rpb25zIFxuXHRcdCMg5Zyo5q2k5a6a5LmJ5YWo5bGAIGFjdGlvbnNcblx0XHRcInN0YW5kYXJkX3F1ZXJ5XCI6ICgpLT5cblx0XHRcdE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKVxuXG5cdFx0XCJzdGFuZGFyZF9uZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0Y3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKVxuXHRcdFx0aWYgY3VycmVudF9yZWNvcmRfaWRcblx0XHRcdFx0IyBhbWlzIOebuOWFs+WtkOihqOWPs+S4iuinkuaWsOW7ulxuXHRcdFx0XHRDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyhvYmplY3RfbmFtZSlcblx0XHRcdFx0cmV0dXJuIFxuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuXHRcdFx0Z3JpZE5hbWUgPSB0aGlzLmFjdGlvbi5ncmlkTmFtZTtcblx0XHRcdGluaXRpYWxWYWx1ZXM9e31cblx0XHRcdGlmKGdyaWROYW1lKVxuXHRcdFx0XHRzZWxlY3RlZFJvd3MgPSB3aW5kb3cuZ3JpZFJlZnM/W2dyaWROYW1lXS5jdXJyZW50Py5hcGk/LmdldFNlbGVjdGVkUm93cygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHNlbGVjdGVkUm93cyA9IHdpbmRvdy5ncmlkUmVmPy5jdXJyZW50Py5hcGk/LmdldFNlbGVjdGVkUm93cygpXHRcblx0XHRcdFxuXHRcdFx0aWYgc2VsZWN0ZWRSb3dzPy5sZW5ndGhcblx0XHRcdFx0cmVjb3JkX2lkID0gc2VsZWN0ZWRSb3dzWzBdLl9pZDtcblx0XHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5pdGlhbFZhbHVlcyA9IEZvcm1NYW5hZ2VyLmdldEluaXRpYWxWYWx1ZXMob2JqZWN0X25hbWUpXG5cblx0XHRcdGlmIG9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRcdHJldHVybiBTdGVlZG9zLlBhZ2UuRm9ybS5TdGFuZGFyZE5ldy5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCAn5paw5bu6ICcgKyBvYmplY3QubGFiZWwsIGluaXRpYWxWYWx1ZXMgLCB7Z3JpZE5hbWU6IGdyaWROYW1lfSk7XG5cdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdGlmIHNlbGVjdGVkUm93cz8ubGVuZ3RoXG5cdFx0XHRcdCMg5YiX6KGo5pyJ6YCJ5Lit6aG55pe277yM5Y+W56ys5LiA5Liq6YCJ5Lit6aG577yM5aSN5Yi25YW25YaF5a655Yiw5paw5bu656qX5Y+j5LitXG5cdFx0XHRcdCMg6L+Z55qE56ys5LiA5Liq5oyH55qE5piv56ys5LiA5qyh5Yu+6YCJ55qE6YCJ5Lit6aG577yM6ICM5LiN5piv5YiX6KGo5Lit5bey5Yu+6YCJ55qE56ys5LiA6aG5XG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblx0XHRcdFx0IyDigJzkv53lrZjlubbmlrDlu7rigJ3mk43kvZzkuK3oh6rliqjmiZPlvIDnmoTmlrDnqpflj6PkuK3pnIDopoHlho3mrKHlpI3liLbmnIDmlrDnmoRkb2PlhoXlrrnliLDmlrDnqpflj6PkuK1cblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgaW5pdGlhbFZhbHVlc1xuXHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0JChcIi5jcmVhdG9yLWFkZFwiKS5jbGljaygpXG5cdFx0XHRyZXR1cm4gXG5cblx0XHRcInN0YW5kYXJkX29wZW5fdmlld1wiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZilcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XCJzdGFuZGFyZF9lZGl0XCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmaWVsZHMpLT5cblx0XHRcdGlmIHJlY29yZF9pZFxuXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG5cdFx0XHRcdGlmIG9iamVjdD8udmVyc2lvbiA+PSAyXG5cdFx0XHRcdFx0cmV0dXJuIFN0ZWVkb3MuUGFnZS5Gb3JtLlN0YW5kYXJkRWRpdC5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCAn57yW6L6RICcgKyBvYmplY3QubGFiZWwsIHJlY29yZF9pZCwge1xuXHRcdFx0XHRcdFx0Z3JpZE5hbWU6IHRoaXMuYWN0aW9uLmdyaWROYW1lXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlXG4jXHRcdFx0XHRcdHJlY29yZCA9IENyZWF0b3IuZ2V0T2JqZWN0UmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIHJlY29yZFxuI1x0XHRcdFx0XHRTZXNzaW9uLnNldCAncmVsb2FkX2R4bGlzdCcsIGZhbHNlXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRNZXRlb3IuZGVmZXIgKCktPlxuXHRcdFx0XHRcdFx0JChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWRcblx0XHRcdFx0XHRpZiB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgdGhpcy5yZWNvcmRcblx0XHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdFx0XHRcdCQoXCIuYnRuLmNyZWF0b3ItZWRpdFwiKS5jbGljaygpXG5cblx0XHRcInN0YW5kYXJkX2RlbGV0ZVwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKS0+XG5cdFx0XHRncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuXHRcdFx0IyBjb25zb2xlLmxvZyhcIj09PXN0YW5kYXJkX2RlbGV0ZT09PVwiLCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spO1xuXHRcdFx0aWYgcmVjb3JkX2lkXG5cdFx0XHRcdGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtfaWQ6IHJlY29yZF9pZH0pXG5cdFx0XHRcdGlmICFiZWZvcmVIb29rXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0XHRuYW1lRmllbGQgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVkgfHwgXCJuYW1lXCJcblxuXHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBcImFsbFwiXG5cblx0XHRcdGlmKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlKVxuXHRcdFx0XHRyZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGVbbmFtZUZpZWxkXVxuXHRcdFx0XG5cdFx0XHRpZiByZWNvcmQgJiYgIXJlY29yZF90aXRsZVxuXHRcdFx0XHRyZWNvcmRfdGl0bGUgPSByZWNvcmRbbmFtZUZpZWxkXVxuXHRcdFx0XG5cdFx0XHRpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCJcblx0XHRcdGkxOG5UZXh0S2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCJcblxuXHRcdFx0dW5sZXNzIHJlY29yZF9pZFxuXHRcdFx0XHRpMThuVGl0bGVLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9tYW55X3N3YWxfdGl0bGVcIlxuXHRcdFx0XHRpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90ZXh0XCJcblxuXHRcdFx0XHQjIOWmguaenOaYr+aJuemHj+WIoOmZpO+8jOWImeS8oOWFpeeahGxpc3Rfdmlld19pZOS4uuWIl+ihqOinhuWbvueahG5hbWXvvIznlKjkuo7ojrflj5bliJfooajpgInkuK3poblcblx0XHRcdFx0IyDkuLvliJfooajop4TliJnmmK9cImxpc3R2aWV3XyN7b2JqZWN0X25hbWV9XyN7bGlzdF92aWV3X2lkfVwi77yM55u45YWz6KGo6KeE5YiZ5pivXCJyZWxhdGVkX2xpc3R2aWV3XyN7b2JqZWN0X25hbWV9XyN7cmVsYXRlZF9vYmplY3RfbmFtZX1fI3tyZWxhdGVkX2ZpZWxkX25hbWV9XCJcblx0XHRcdFx0c2VsZWN0ZWRSZWNvcmRzID0gU3RlZWRvc1VJLmdldFRhYmxlU2VsZWN0ZWRSb3dzKGdyaWROYW1lIHx8IGxpc3Rfdmlld19pZClcblx0XHRcdFx0aWYgIXNlbGVjdGVkUmVjb3JkcyB8fCAhc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aFxuXHRcdFx0XHRcdHRvYXN0ci53YXJuaW5nKHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9ub19zZWxlY3Rpb25cIikpXG5cdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdGlmIHJlY29yZF90aXRsZVxuXHRcdFx0XHR0ZXh0ID0gdCBpMThuVGV4dEtleSwgXCIje29iamVjdC5sYWJlbH0gXFxcIiN7cmVjb3JkX3RpdGxlfVxcXCJcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0ZXh0ID0gdCBpMThuVGV4dEtleSwgXCIje29iamVjdC5sYWJlbH1cIlxuXHRcdFx0c3dhbFxuXHRcdFx0XHR0aXRsZTogdCBpMThuVGl0bGVLZXksIFwiI3tvYmplY3QubGFiZWx9XCJcblx0XHRcdFx0dGV4dDogXCI8ZGl2IGNsYXNzPSdkZWxldGUtY3JlYXRvci13YXJuaW5nJz4je3RleHR9PC9kaXY+XCJcblx0XHRcdFx0aHRtbDogdHJ1ZVxuXHRcdFx0XHRzaG93Q2FuY2VsQnV0dG9uOnRydWVcblx0XHRcdFx0Y29uZmlybUJ1dHRvblRleHQ6IHQoJ0RlbGV0ZScpXG5cdFx0XHRcdGNhbmNlbEJ1dHRvblRleHQ6IHQoJ0NhbmNlbCcpXG5cdFx0XHRcdChvcHRpb24pIC0+XG5cdFx0XHRcdFx0aWYgb3B0aW9uXG5cdFx0XHRcdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0XHRcdFx0IyDljZXmnaHorrDlvZXliKDpmaRcblx0XHRcdFx0XHRcdFx0X2RlbGV0ZVJlY29yZCBvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0IyDmlofku7bniYjmnKzkuLpcImNmcy5maWxlcy5maWxlcmVjb3JkXCLvvIzpnIDopoHmm7/mjaLkuLpcImNmcy1maWxlcy1maWxlcmVjb3JkXCJcblx0XHRcdFx0XHRcdFx0XHRncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csXCItXCIpXG5cdFx0XHRcdFx0XHRcdFx0Z3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGdyaWRDb250YWluZXI/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgd2luZG93Lm9wZW5lclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc09wZW5lclJlbW92ZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci4je2dyaWRPYmplY3ROYW1lQ2xhc3N9XCIpXG5cdFx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0XHQjIE9iamVjdEZvcm3mnInnvJPlrZjvvIzliKDpmaTlrZDooajorrDlvZXlj6/og73kvJrmnInmsYfmgLvlrZfmrrXvvIzpnIDopoHliLfmlrDooajljZXmlbDmja5cblx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50X3JlY29yZF9pZCA9IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBjdXJyZW50X29iamVjdF9uYW1lICYmIENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpPy52ZXJzaW9uID4gMVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRTdGVlZG9zVUkucmVsb2FkUmVjb3JkKGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdF9uYW1lICE9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuXHRcdFx0XHRcdFx0XHRcdGNhdGNoIF9lXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKF9lKTtcblx0XHRcdFx0XHRcdFx0XHRpZiBncmlkQ29udGFpbmVyPy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZSA9IGdyaWRDb250YWluZXIuZHhEYXRhR3JpZCgpLmR4RGF0YUdyaWQoJ2luc3RhbmNlJylcblx0XHRcdFx0XHRcdFx0XHRpZiBkeERhdGFHcmlkSW5zdGFuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdC5lbmFibGVfdHJlZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdF9uYW1lICE9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0VGVtcGxhdGUuY3JlYXRvcl9ncmlkLnJlZnJlc2goZHhEYXRhR3JpZEluc3RhbmNlKVxuXHRcdFx0XHRcdFx0XHRcdHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0dGVtcE5hdlJlbW92ZWQgPSBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpICPml6DorrrmmK/lnKjorrDlvZXor6bnu4bnlYzpnaLov5jmmK/liJfooajnlYzpnaLmiafooYzliKDpmaTmk43kvZzvvIzpg73kvJrmiorkuLTml7blr7zoiKrliKDpmaTmjolcblx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZSBvciAhZHhEYXRhR3JpZEluc3RhbmNlXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc09wZW5lclJlbW92ZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuY2xvc2UoKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiByZWNvcmRfaWQgPT0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikgYW5kIGxpc3Rfdmlld19pZCAhPSAnY2FsZW5kYXInXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIHRlbXBOYXZSZW1vdmVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpznoa7lrp7liKDpmaTkuobkuLTml7blr7zoiKrvvIzlsLHlj6/og73lt7Lnu4/ph43lrprlkJHliLDkuIrkuIDkuKrpobXpnaLkuobvvIzmsqHlv4XopoHlho3ph43lrprlkJHkuIDmrKFcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLmdvIFwiL2FwcC8je2FwcGlkfS8je29iamVjdF9uYW1lfS9ncmlkLyN7bGlzdF92aWV3X2lkfVwiXG5cdFx0XHRcdFx0XHRcdFx0aWYgY2FsbF9iYWNrIGFuZCB0eXBlb2YgY2FsbF9iYWNrID09IFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FsbF9iYWNrKClcdFx0XHRcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0IyDmibnph4/liKDpmaRcblx0XHRcdFx0XHRcdFx0aWYgc2VsZWN0ZWRSZWNvcmRzICYmIHNlbGVjdGVkUmVjb3Jkcy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImxvYWRpbmdcIilcblx0XHRcdFx0XHRcdFx0XHRkZWxldGVDb3VudGVyID0gMDtcblx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUgPSAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxldGVDb3VudGVyKytcblx0XHRcdFx0XHRcdFx0XHRcdGlmIGRlbGV0ZUNvdW50ZXIgPj0gc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIGNvbnNvbGUubG9nKFwiZGVsZXRlQ291bnRlciwgc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aD09PVwiLCBkZWxldGVDb3VudGVyLCBzZWxlY3RlZFJlY29yZHMubGVuZ3RoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJsb2FkaW5nXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5yZWZyZXNoR3JpZChncmlkTmFtZSk7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZWN0ZWRSZWNvcmRzLmZvckVhY2ggKHJlY29yZCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2lkID0gcmVjb3JkLl9pZFxuXHRcdFx0XHRcdFx0XHRcdFx0YmVmb3JlSG9vayA9IEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnYmVmb3JlJywge19pZDogcmVjb3JkX2lkfSlcblx0XHRcdFx0XHRcdFx0XHRcdGlmICFiZWZvcmVIb29rXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFmdGVyQmF0Y2hlc0RlbGV0ZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZFRpdGxlID0gcmVjb3JkW25hbWVGaWVsZF0gfHwgcmVjb3JkX2lkXG5cdFx0XHRcdFx0XHRcdFx0XHRfZGVsZXRlUmVjb3JkIG9iamVjdF9uYW1lLCByZWNvcmQuX2lkLCByZWNvcmRUaXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsICgoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCkgI+aXoOiuuuaYr+WcqOiusOW9leivpue7hueVjOmdoui/mOaYr+WIl+ihqOeVjOmdouaJp+ihjOWIoOmZpOaTjeS9nO+8jOmDveS8muaKiuS4tOaXtuWvvOiIquWIoOmZpOaOiVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKVxuXHRcdFx0XHRcdFx0XHRcdFx0KSwgKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhZnRlckJhdGNoZXNEZWxldGUoKSIsInZhciBfZGVsZXRlUmVjb3JkLCBzdGVlZG9zRmlsdGVycztcblxuQ3JlYXRvci5hY3Rpb25zQnlOYW1lID0ge307XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgc3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcbiAgQ3JlYXRvci5hY3Rpb25zID0gZnVuY3Rpb24oYWN0aW9ucykge1xuICAgIHJldHVybiBfLmVhY2goYWN0aW9ucywgZnVuY3Rpb24odG9kbywgYWN0aW9uX25hbWUpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmFjdGlvbnNCeU5hbWVbYWN0aW9uX25hbWVdID0gdG9kbztcbiAgICB9KTtcbiAgfTtcbiAgQ3JlYXRvci5leGVjdXRlQWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGFjdGlvbiwgcmVjb3JkX2lkLCBpdGVtX2VsZW1lbnQsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsYmFjaykge1xuICAgIHZhciBmaWx0ZXJzLCBtb3JlQXJncywgb2JqLCB0b2RvLCB0b2RvQXJncywgdXJsO1xuICAgIGlmIChhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT09ICd3b3JkLXByaW50Jykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBmaWx0ZXJzID0gWydfaWQnLCAnPScsIHJlY29yZF9pZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWx0ZXJzID0gT2JqZWN0R3JpZC5nZXRGaWx0ZXJzKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGZhbHNlLCBudWxsLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIHVybCA9IFwiL2FwaS92NC93b3JkX3RlbXBsYXRlcy9cIiArIGFjdGlvbi53b3JkX3RlbXBsYXRlICsgXCIvcHJpbnRcIiArIFwiP2ZpbHRlcnM9XCIgKyBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5KGZpbHRlcnMpO1xuICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMCkge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9kbyA9IGFjdGlvbi50b2RvO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgaXRlbV9lbGVtZW50ID0gaXRlbV9lbGVtZW50ID8gaXRlbV9lbGVtZW50IDogXCJcIjtcbiAgICAgICAgbW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuICAgICAgICB0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpO1xuICAgICAgICByZXR1cm4gdG9kby5hcHBseSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdDogb2JqLFxuICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgIGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50LFxuICAgICAgICAgIHJlY29yZDogcmVjb3JkXG4gICAgICAgIH0sIHRvZG9BcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgfVxuICB9O1xuICBfZGVsZXRlUmVjb3JkID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrLCBjYWxsX2JhY2tfZXJyb3IpIHtcbiAgICB2YXIgb2JqZWN0LCBwcmV2aW91c0RvYztcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgcHJldmlvdXNEb2MgPSBGb3JtTWFuYWdlci5nZXRQcmV2aW91c0RvYyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAnZGVsZXRlJyk7XG4gICAgcmV0dXJuIENyZWF0b3Iub2RhdGFbXCJkZWxldGVcIl0ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5mbztcbiAgICAgIGlmIChyZWNvcmRfdGl0bGUpIHtcbiAgICAgICAgaW5mbyA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgKFwiXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZm8gPSB0KCdjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF9zdWMnKTtcbiAgICAgIH1cbiAgICAgIHRvYXN0ci5zdWNjZXNzKGluZm8pO1xuICAgICAgaWYgKGNhbGxfYmFjayAmJiB0eXBlb2YgY2FsbF9iYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbF9iYWNrKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdhZnRlcicsIHtcbiAgICAgICAgX2lkOiByZWNvcmRfaWQsXG4gICAgICAgIHByZXZpb3VzRG9jOiBwcmV2aW91c0RvY1xuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGlmIChjYWxsX2JhY2tfZXJyb3IgJiYgdHlwZW9mIGNhbGxfYmFja19lcnJvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxfYmFja19lcnJvcigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7XG4gICAgICAgIF9pZDogcmVjb3JkX2lkLFxuICAgICAgICBlcnJvcjogZXJyb3JcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyA9IGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgY29sbGVjdGlvbl9uYW1lLCBjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCwgZGVmYXVsdERvYywgZG9jLCBpZHMsIGluaXRpYWxWYWx1ZXMsIHJlY29yZF9pZCwgcmVsYXRlT2JqZWN0O1xuICAgIHJlbGF0ZU9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgIGNvbGxlY3Rpb25fbmFtZSA9IHJlbGF0ZU9iamVjdC5sYWJlbDtcbiAgICBjb2xsZWN0aW9uID0gXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0T2JqZWN0KHJlbGF0ZWRfb2JqZWN0X25hbWUpLl9jb2xsZWN0aW9uX25hbWUpO1xuICAgIGN1cnJlbnRfb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICAgIGN1cnJlbnRfcmVjb3JkX2lkID0gU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIik7XG4gICAgaWRzID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHNbcmVsYXRlZF9vYmplY3RfbmFtZV07XG4gICAgaW5pdGlhbFZhbHVlcyA9IHt9O1xuICAgIGlmIChpZHMgIT0gbnVsbCA/IGlkcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgIHJlY29yZF9pZCA9IGlkc1swXTtcbiAgICAgIGRvYyA9IENyZWF0b3Iub2RhdGEuZ2V0KHJlbGF0ZWRfb2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBpbml0aWFsVmFsdWVzID0gZG9jO1xuICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0RG9jID0gRm9ybU1hbmFnZXIuZ2V0UmVsYXRlZEluaXRpYWxWYWx1ZXMoY3VycmVudF9vYmplY3RfbmFtZSwgY3VycmVudF9yZWNvcmRfaWQsIHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKCFfLmlzRW1wdHkoZGVmYXVsdERvYykpIHtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IGRlZmF1bHREb2M7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgocmVsYXRlT2JqZWN0ICE9IG51bGwgPyByZWxhdGVPYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgcmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuICAgICAgICBuYW1lOiByZWxhdGVkX29iamVjdF9uYW1lICsgXCJfc3RhbmRhcmRfbmV3X2Zvcm1cIixcbiAgICAgICAgb2JqZWN0QXBpTmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgdGl0bGU6ICfmlrDlu7ogJyArIHJlbGF0ZU9iamVjdC5sYWJlbCxcbiAgICAgICAgaW5pdGlhbFZhbHVlczogaW5pdGlhbFZhbHVlcyxcbiAgICAgICAgYWZ0ZXJJbnNlcnQ6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoQ3JlYXRvci5nZXRPYmplY3QoY3VycmVudF9vYmplY3RfbmFtZSkudmVyc2lvbiA+IDEpIHtcbiAgICAgICAgICAgICAgU3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gRmxvd1JvdXRlci5yZWxvYWQoKTtcbiAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSwgbnVsbCwge1xuICAgICAgICBpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlkcyAhPSBudWxsID8gaWRzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghXy5pc0VtcHR5KGluaXRpYWxWYWx1ZXMpKSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgfVxuICAgIH1cbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9maWVsZHNcIiwgdm9pZCAwKTtcbiAgICBTZXNzaW9uLnNldChcImFjdGlvbl9jb2xsZWN0aW9uXCIsIGNvbGxlY3Rpb24pO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX2NvbGxlY3Rpb25fbmFtZVwiLCBjb2xsZWN0aW9uX25hbWUpO1xuICAgIFNlc3Npb24uc2V0KFwiYWN0aW9uX3NhdmVfYW5kX2luc2VydFwiLCBmYWxzZSk7XG4gICAgTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICQoXCIuY3JlYXRvci1hZGQtcmVsYXRlZFwiKS5jbGljaygpO1xuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmFjdGlvbnMoe1xuICAgIFwic3RhbmRhcmRfcXVlcnlcIjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9uZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgY3VycmVudF9yZWNvcmRfaWQsIGdyaWROYW1lLCBpbml0aWFsVmFsdWVzLCBvYmplY3QsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgc2VsZWN0ZWRSb3dzO1xuICAgICAgY3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgICAgIGlmIChjdXJyZW50X3JlY29yZF9pZCkge1xuICAgICAgICBDcmVhdG9yLnJlbGF0ZWRPYmplY3RTdGFuZGFyZE5ldyhvYmplY3RfbmFtZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGdyaWROYW1lID0gdGhpcy5hY3Rpb24uZ3JpZE5hbWU7XG4gICAgICBpbml0aWFsVmFsdWVzID0ge307XG4gICAgICBpZiAoZ3JpZE5hbWUpIHtcbiAgICAgICAgc2VsZWN0ZWRSb3dzID0gKHJlZiA9IHdpbmRvdy5ncmlkUmVmcykgIT0gbnVsbCA/IChyZWYxID0gcmVmW2dyaWROYW1lXS5jdXJyZW50KSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmFwaSkgIT0gbnVsbCA/IHJlZjIuZ2V0U2VsZWN0ZWRSb3dzKCkgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxlY3RlZFJvd3MgPSAocmVmMyA9IHdpbmRvdy5ncmlkUmVmKSAhPSBudWxsID8gKHJlZjQgPSByZWYzLmN1cnJlbnQpICE9IG51bGwgPyAocmVmNSA9IHJlZjQuYXBpKSAhPSBudWxsID8gcmVmNS5nZXRTZWxlY3RlZFJvd3MoKSA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGlmIChzZWxlY3RlZFJvd3MgIT0gbnVsbCA/IHNlbGVjdGVkUm93cy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgcmVjb3JkX2lkID0gc2VsZWN0ZWRSb3dzWzBdLl9pZDtcbiAgICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICAgIGluaXRpYWxWYWx1ZXMgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IEZvcm1NYW5hZ2VyLmdldEluaXRpYWxWYWx1ZXMob2JqZWN0X25hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC52ZXJzaW9uIDogdm9pZCAwKSA+PSAyKSB7XG4gICAgICAgIHJldHVybiBTdGVlZG9zLlBhZ2UuRm9ybS5TdGFuZGFyZE5ldy5yZW5kZXIoU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIiksIG9iamVjdF9uYW1lLCAn5paw5bu6ICcgKyBvYmplY3QubGFiZWwsIGluaXRpYWxWYWx1ZXMsIHtcbiAgICAgICAgICBncmlkTmFtZTogZ3JpZE5hbWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgaWYgKHNlbGVjdGVkUm93cyAhPSBudWxsID8gc2VsZWN0ZWRSb3dzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtU2hvd0FnYWluRHVwbGljYXRlZCcsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgaW5pdGlhbFZhbHVlcyk7XG4gICAgICB9XG4gICAgICBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKFwiLmNyZWF0b3ItYWRkXCIpLmNsaWNrKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFwic3RhbmRhcmRfb3Blbl92aWV3XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIGhyZWY7XG4gICAgICBocmVmID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICBGbG93Um91dGVyLnJlZGlyZWN0KGhyZWYpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9lZGl0XCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcykge1xuICAgICAgdmFyIG9iamVjdDtcbiAgICAgIGlmIChyZWNvcmRfaWQpIHtcbiAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgICBpZiAoKG9iamVjdCAhPSBudWxsID8gb2JqZWN0LnZlcnNpb24gOiB2b2lkIDApID49IDIpIHtcbiAgICAgICAgICByZXR1cm4gU3RlZWRvcy5QYWdlLkZvcm0uU3RhbmRhcmRFZGl0LnJlbmRlcihTZXNzaW9uLmdldChcImFwcF9pZFwiKSwgb2JqZWN0X25hbWUsICfnvJbovpEgJyArIG9iamVjdC5sYWJlbCwgcmVjb3JkX2lkLCB7XG4gICAgICAgICAgICBncmlkTmFtZTogdGhpcy5hY3Rpb24uZ3JpZE5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpICYmIGZhbHNlKSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIi5idG4tZWRpdC1yZWNvcmRcIikuY2xpY2soKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpO1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fcmVjb3JkX2lkJywgcmVjb3JkX2lkKTtcbiAgICAgICAgICBpZiAodGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICAgIHJldHVybiBNZXRlb3IuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiAkKFwiLmJ0bi5jcmVhdG9yLWVkaXRcIikuY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9kZWxldGVcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgY2FsbF9iYWNrKSB7XG4gICAgICB2YXIgYmVmb3JlSG9vaywgZ3JpZE5hbWUsIGkxOG5UZXh0S2V5LCBpMThuVGl0bGVLZXksIG5hbWVGaWVsZCwgb2JqZWN0LCBzZWxlY3RlZFJlY29yZHMsIHRleHQ7XG4gICAgICBncmlkTmFtZSA9IHRoaXMuYWN0aW9uLmdyaWROYW1lO1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7XG4gICAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghYmVmb3JlSG9vaykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgICAgbmFtZUZpZWxkID0gb2JqZWN0Lk5BTUVfRklFTERfS0VZIHx8IFwibmFtZVwiO1xuICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgbGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIik7XG4gICAgICB9XG4gICAgICBpZiAoIWxpc3Rfdmlld19pZCkge1xuICAgICAgICBsaXN0X3ZpZXdfaWQgPSBcImFsbFwiO1xuICAgICAgfVxuICAgICAgaWYgKCFfLmlzU3RyaW5nKHJlY29yZF90aXRsZSkgJiYgcmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZVtuYW1lRmllbGRdO1xuICAgICAgfVxuICAgICAgaWYgKHJlY29yZCAmJiAhcmVjb3JkX3RpdGxlKSB7XG4gICAgICAgIHJlY29yZF90aXRsZSA9IHJlY29yZFtuYW1lRmllbGRdO1xuICAgICAgfVxuICAgICAgaTE4blRpdGxlS2V5ID0gXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZVwiO1xuICAgICAgaTE4blRleHRLZXkgPSBcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIjtcbiAgICAgIGlmICghcmVjb3JkX2lkKSB7XG4gICAgICAgIGkxOG5UaXRsZUtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90aXRsZVwiO1xuICAgICAgICBpMThuVGV4dEtleSA9IFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX21hbnlfc3dhbF90ZXh0XCI7XG4gICAgICAgIHNlbGVjdGVkUmVjb3JkcyA9IFN0ZWVkb3NVSS5nZXRUYWJsZVNlbGVjdGVkUm93cyhncmlkTmFtZSB8fCBsaXN0X3ZpZXdfaWQpO1xuICAgICAgICBpZiAoIXNlbGVjdGVkUmVjb3JkcyB8fCAhc2VsZWN0ZWRSZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgIHRvYXN0ci53YXJuaW5nKHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfbWFueV9ub19zZWxlY3Rpb25cIikpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICB0ZXh0ID0gdChpMThuVGV4dEtleSwgb2JqZWN0LmxhYmVsICsgXCIgXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IHQoaTE4blRleHRLZXksIFwiXCIgKyBvYmplY3QubGFiZWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN3YWwoe1xuICAgICAgICB0aXRsZTogdChpMThuVGl0bGVLZXksIFwiXCIgKyBvYmplY3QubGFiZWwpLFxuICAgICAgICB0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPlwiICsgdGV4dCArIFwiPC9kaXY+XCIsXG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKSxcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcbiAgICAgIH0sIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB2YXIgYWZ0ZXJCYXRjaGVzRGVsZXRlLCBkZWxldGVDb3VudGVyO1xuICAgICAgICBpZiAob3B0aW9uKSB7XG4gICAgICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICAgICAgcmV0dXJuIF9kZWxldGVSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3RpdGxlLCBsaXN0X3ZpZXdfaWQsIHJlY29yZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciBfZSwgYXBwaWQsIGN1cnJlbnRfb2JqZWN0X25hbWUsIGN1cnJlbnRfcmVjb3JkX2lkLCBkeERhdGFHcmlkSW5zdGFuY2UsIGdyaWRDb250YWluZXIsIGdyaWRPYmplY3ROYW1lQ2xhc3MsIGlzT3BlbmVyUmVtb3ZlLCByZWNvcmRVcmwsIHJlZiwgdGVtcE5hdlJlbW92ZWQ7XG4gICAgICAgICAgICAgIGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZywgXCItXCIpO1xuICAgICAgICAgICAgICBncmlkQ29udGFpbmVyID0gJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgIGlmICghKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XG4gICAgICAgICAgICAgICAgICBpc09wZW5lclJlbW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9IHdpbmRvdy5vcGVuZXIuJChcIi5ncmlkQ29udGFpbmVyLlwiICsgZ3JpZE9iamVjdE5hbWVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY3VycmVudF9vYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgICAgICAgICAgICAgY3VycmVudF9yZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudF9vYmplY3RfbmFtZSAmJiAoKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KGN1cnJlbnRfb2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLnZlcnNpb24gOiB2b2lkIDApID4gMSkge1xuICAgICAgICAgICAgICAgICAgU3RlZWRvc1VJLnJlbG9hZFJlY29yZChjdXJyZW50X29iamVjdF9uYW1lLCBjdXJyZW50X3JlY29yZF9pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChGbG93Um91dGVyLmN1cnJlbnQoKS5yb3V0ZS5wYXRoLmVuZHNXaXRoKFwiLzpyZWNvcmRfaWRcIikpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RfbmFtZSAhPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cucmVmcmVzaEdyaWQoZ3JpZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgICAgX2UgPSBlcnJvcjE7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihfZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGdyaWRDb250YWluZXIgIT0gbnVsbCA/IGdyaWRDb250YWluZXIubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdC5lbmFibGVfdHJlZSkge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGR4RGF0YUdyaWRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICAgIGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RfbmFtZSAhPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgVGVtcGxhdGUuY3JlYXRvcl9ncmlkLnJlZnJlc2goZHhEYXRhR3JpZEluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZCk7XG4gICAgICAgICAgICAgIHRlbXBOYXZSZW1vdmVkID0gQ3JlYXRvci5yZW1vdmVUZW1wTmF2SXRlbShvYmplY3RfbmFtZSwgcmVjb3JkVXJsKTtcbiAgICAgICAgICAgICAgaWYgKGlzT3BlbmVyUmVtb3ZlIHx8ICFkeERhdGFHcmlkSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNPcGVuZXJSZW1vdmUpIHtcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSAmJiBsaXN0X3ZpZXdfaWQgIT09ICdjYWxlbmRhcicpIHtcbiAgICAgICAgICAgICAgICAgIGFwcGlkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIik7XG4gICAgICAgICAgICAgICAgICBpZiAoIXRlbXBOYXZSZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwL1wiICsgYXBwaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChjYWxsX2JhY2sgJiYgdHlwZW9mIGNhbGxfYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxfYmFjaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkUmVjb3JkcyAmJiBzZWxlY3RlZFJlY29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwibG9hZGluZ1wiKTtcbiAgICAgICAgICAgICAgZGVsZXRlQ291bnRlciA9IDA7XG4gICAgICAgICAgICAgIGFmdGVyQmF0Y2hlc0RlbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZUNvdW50ZXIrKztcbiAgICAgICAgICAgICAgICBpZiAoZGVsZXRlQ291bnRlciA+PSBzZWxlY3RlZFJlY29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImxvYWRpbmdcIik7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnJlZnJlc2hHcmlkKGdyaWROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHJldHVybiBzZWxlY3RlZFJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVjb3JkVGl0bGU7XG4gICAgICAgICAgICAgICAgcmVjb3JkX2lkID0gcmVjb3JkLl9pZDtcbiAgICAgICAgICAgICAgICBiZWZvcmVIb29rID0gRm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdiZWZvcmUnLCB7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHJlY29yZF9pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICghYmVmb3JlSG9vaykge1xuICAgICAgICAgICAgICAgICAgYWZ0ZXJCYXRjaGVzRGVsZXRlKCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlY29yZFRpdGxlID0gcmVjb3JkW25hbWVGaWVsZF0gfHwgcmVjb3JkX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBfZGVsZXRlUmVjb3JkKG9iamVjdF9uYW1lLCByZWNvcmQuX2lkLCByZWNvcmRUaXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHZhciByZWNvcmRVcmw7XG4gICAgICAgICAgICAgICAgICByZWNvcmRVcmwgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgICAgICAgICAgIENyZWF0b3IucmVtb3ZlVGVtcE5hdkl0ZW0ob2JqZWN0X25hbWUsIHJlY29yZFVybCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gYWZ0ZXJCYXRjaGVzRGVsZXRlKCk7XG4gICAgICAgICAgICAgICAgfSksIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyQmF0Y2hlc0RlbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
