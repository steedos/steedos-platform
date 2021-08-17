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
      built_in_plugins: ["@steedos/workflow", "@steedos/accounts", "@steedos/steedos-plugin-schema-builder", "@steedos/plugin-enterprise", "@steedos/word-template", "@steedos/metadata-api", "@steedos/plugin-dingtalk", "@steedos/data-import", "@steedos/service-fields-indexs", "@steedos/service-accounts", "@steedos/service-charts", "@steedos/service-pages"],
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
    var _object, _ref_obj, _reference_to, autoform_type, collectionName, field_name, fs, isUnLimited, locale, permissions, ref, ref1, ref2, ref3;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xvYWRTdGFuZGFyZE9iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9sb2FkU3RhbmRhcmRPYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2NvcmVTdXBwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZVN1cHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvc2VydmVyL21ldGhvZHMvb2JqZWN0X29wdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfb3B0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9zZXJ2ZXIvcm91dGVzL2FwaV93b3JrZmxvd192aWV3X2luc3RhbmNlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfd29ya2Zsb3dfdmlld19pbnN0YW5jZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvbGlzdHZpZXdzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2xpc3R2aWV3cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWRkX3NpbXBsZV9zY2hlbWFfdmFsaWRhdGlvbl9lcnJvci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9maWVsZF9zaW1wbGVfc2NoZW1hX3ZhbGlkYXRpb25fZXJyb3IuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZmllbGRfc2ltcGxlX3NjaGVtYV92YWxpZGF0aW9uX2Vycm9yLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvYmplY3RzL2xpYi9ldmFsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2NvbnZlcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29udmVydC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvZm9ybXVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL29iamVjdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9vYmplY3QuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL2ZpZWxkcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9maWVsZHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3RyaWdnZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9wZXJtaXNzaW9uX3NldHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcGVybWlzc2lvbl9zZXRzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9jb2xsZWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy9saWIvYWN0aW9ucy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY3Rpb25zLmNvZmZlZSJdLCJuYW1lcyI6WyJkYiIsIkNyZWF0b3IiLCJPYmplY3RzIiwiQ29sbGVjdGlvbnMiLCJNZW51cyIsIkFwcHMiLCJEYXNoYm9hcmRzIiwiUmVwb3J0cyIsInN1YnMiLCJzdGVlZG9zU2NoZW1hIiwiQVBJU2VydmljZSIsIk1ldGFkYXRhU2VydmljZSIsImNvbmZpZyIsImUiLCJtb2xlY3VsZXIiLCJvYmplY3RxbCIsInBhY2thZ2VMb2FkZXIiLCJwYXRoIiwic2V0dGluZ3MiLCJzdGVlZG9zQ29yZSIsInByb2Nlc3MiLCJlbnYiLCJDUkVBVE9SX05PREVfRU5WIiwicmVxdWlyZSIsImdldFN0ZWVkb3NDb25maWciLCJidWlsdF9pbl9wbHVnaW5zIiwicGx1Z2lucyIsIk1ldGVvciIsInN0YXJ0dXAiLCJhcGlTZXJ2aWNlIiwiYnJva2VyIiwiZXgiLCJtZXRhZGF0YVNlcnZpY2UiLCJzdGFuZGFyZE9iamVjdHNEaXIiLCJzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSIsIlNlcnZpY2VCcm9rZXIiLCJuYW1lc3BhY2UiLCJub2RlSUQiLCJtZXRhZGF0YSIsInRyYW5zcG9ydGVyIiwiVFJBTlNQT1JURVIiLCJjYWNoZXIiLCJDQUNIRVIiLCJsb2dMZXZlbCIsInNlcmlhbGl6ZXIiLCJyZXF1ZXN0VGltZW91dCIsIm1heENhbGxMZXZlbCIsImhlYXJ0YmVhdEludGVydmFsIiwiaGVhcnRiZWF0VGltZW91dCIsImNvbnRleHRQYXJhbXNDbG9uaW5nIiwidHJhY2tpbmciLCJlbmFibGVkIiwic2h1dGRvd25UaW1lb3V0IiwiZGlzYWJsZUJhbGFuY2VyIiwicmVnaXN0cnkiLCJzdHJhdGVneSIsInByZWZlckxvY2FsIiwiYnVsa2hlYWQiLCJjb25jdXJyZW5jeSIsIm1heFF1ZXVlU2l6ZSIsInZhbGlkYXRvciIsImVycm9ySGFuZGxlciIsInRyYWNpbmciLCJleHBvcnRlciIsInR5cGUiLCJvcHRpb25zIiwibG9nZ2VyIiwiY29sb3JzIiwid2lkdGgiLCJnYXVnZVdpZHRoIiwiY3JlYXRlU2VydmljZSIsIm5hbWUiLCJtaXhpbnMiLCJwb3J0IiwiZ2V0U3RlZWRvc1NjaGVtYSIsIlN0YW5kYXJkT2JqZWN0c1BhdGgiLCJwYWNrYWdlSW5mbyIsIndyYXBBc3luYyIsImNiIiwic3RhcnQiLCJ0aGVuIiwic3RhcnRlZCIsIl9yZXN0YXJ0U2VydmljZSIsIldlYkFwcCIsImNvbm5lY3RIYW5kbGVycyIsInVzZSIsImV4cHJlc3MiLCJ3YWl0Rm9yU2VydmljZXMiLCJyZXNvbHZlIiwicmVqZWN0IiwiaW5pdCIsImVycm9yIiwiY29uc29sZSIsIkZpYmVyIiwiZGVwcyIsImFwcCIsIlRyYWNrZXIiLCJEZXBlbmRlbmN5Iiwib2JqZWN0IiwiX1RFTVBMQVRFIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsImZpbHRlcnNGdW5jdGlvbiIsIk1hdGNoIiwiT3B0aW9uYWwiLCJPbmVPZiIsIkZ1bmN0aW9uIiwiU3RyaW5nIiwib3B0aW9uc0Z1bmN0aW9uIiwiY3JlYXRlRnVuY3Rpb24iLCJpc1NlcnZlciIsImZpYmVyTG9hZE9iamVjdHMiLCJvYmoiLCJvYmplY3RfbmFtZSIsImxvYWRPYmplY3RzIiwicnVuIiwibGlzdF92aWV3cyIsInNwYWNlIiwiZ2V0Q29sbGVjdGlvbk5hbWUiLCJfIiwiY2xvbmUiLCJjb252ZXJ0T2JqZWN0IiwiT2JqZWN0IiwiaW5pdFRyaWdnZXJzIiwiaW5pdExpc3RWaWV3cyIsImdldE9iamVjdE5hbWUiLCJnZXRPYmplY3QiLCJzcGFjZV9pZCIsInJlZiIsInJlZjEiLCJpc0FycmF5IiwiaXNDbGllbnQiLCJkZXBlbmQiLCJTZXNzaW9uIiwiZ2V0Iiwib2JqZWN0c0J5TmFtZSIsImdldE9iamVjdEJ5SWQiLCJvYmplY3RfaWQiLCJmaW5kV2hlcmUiLCJfaWQiLCJyZW1vdmVPYmplY3QiLCJsb2ciLCJnZXRDb2xsZWN0aW9uIiwic3BhY2VJZCIsIl9jb2xsZWN0aW9uX25hbWUiLCJyZW1vdmVDb2xsZWN0aW9uIiwiaXNTcGFjZUFkbWluIiwidXNlcklkIiwiZmluZE9uZSIsImZpZWxkcyIsImFkbWlucyIsImluZGV4T2YiLCJldmFsdWF0ZUZvcm11bGEiLCJmb3JtdWxhciIsImNvbnRleHQiLCJpc1N0cmluZyIsIkZvcm11bGFyIiwiY2hlY2tGb3JtdWxhIiwiZXZhbHVhdGVGaWx0ZXJzIiwiZmlsdGVycyIsInNlbGVjdG9yIiwiZWFjaCIsImZpbHRlciIsImFjdGlvbiIsInZhbHVlIiwibGVuZ3RoIiwiaXNDb21tb25TcGFjZSIsImdldE9yZGVybHlTZXRCeUlkcyIsImRvY3MiLCJpZHMiLCJpZF9rZXkiLCJoaXRfZmlyc3QiLCJ2YWx1ZXMiLCJnZXRQcm9wZXJ0eSIsInNvcnRCeSIsImRvYyIsIl9pbmRleCIsInNvcnRpbmdNZXRob2QiLCJ2YWx1ZTEiLCJ2YWx1ZTIiLCJpc1ZhbHVlMUVtcHR5IiwiaXNWYWx1ZTJFbXB0eSIsImxvY2FsZSIsImtleSIsIkRhdGUiLCJnZXRUaW1lIiwiU3RlZWRvcyIsInRvU3RyaW5nIiwibG9jYWxlQ29tcGFyZSIsImdldE9iamVjdFJlbGF0ZWRzIiwiX29iamVjdCIsInBlcm1pc3Npb25zIiwicmVsYXRlZExpc3QiLCJyZWxhdGVkTGlzdE1hcCIsInJlbGF0ZWRfb2JqZWN0cyIsImlzRW1wdHkiLCJvYmpOYW1lIiwiaXNPYmplY3QiLCJvYmplY3ROYW1lIiwicmVsYXRlZF9vYmplY3QiLCJyZWxhdGVkX29iamVjdF9uYW1lIiwicmVsYXRlZF9maWVsZCIsInJlbGF0ZWRfZmllbGRfbmFtZSIsInJlZmVyZW5jZV90byIsImZvcmVpZ25fa2V5Iiwid3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQiLCJlbmFibGVPYmpOYW1lIiwiZ2V0UGVybWlzc2lvbnMiLCJlbmFibGVfYXVkaXQiLCJtb2RpZnlBbGxSZWNvcmRzIiwiZW5hYmxlX2ZpbGVzIiwicHVzaCIsInNwbGljZSIsImVuYWJsZV90YXNrcyIsImVuYWJsZV9ub3RlcyIsImVuYWJsZV9ldmVudHMiLCJlbmFibGVfaW5zdGFuY2VzIiwiZW5hYmxlX2FwcHJvdmFscyIsImVuYWJsZV9wcm9jZXNzIiwiZ2V0VXNlckNvbnRleHQiLCJpc1VuU2FmZU1vZGUiLCJVU0VSX0NPTlRFWFQiLCJzcGFjZV91c2VyX29yZyIsInN1Iiwic3VGaWVsZHMiLCJFcnJvciIsIm1vYmlsZSIsInBvc2l0aW9uIiwiZW1haWwiLCJjb21wYW55Iiwib3JnYW5pemF0aW9uIiwiY29tcGFueV9pZCIsImNvbXBhbnlfaWRzIiwidXNlciIsImZ1bGxuYW1lIiwiZ2V0UmVsYXRpdmVVcmwiLCJ1cmwiLCJpc0Z1bmN0aW9uIiwiaXNDb3Jkb3ZhIiwic3RhcnRzV2l0aCIsInRlc3QiLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwiUk9PVF9VUkxfUEFUSF9QUkVGSVgiLCJnZXRVc2VyQ29tcGFueUlkIiwiZ2V0VXNlckNvbXBhbnlJZHMiLCJwcm9jZXNzUGVybWlzc2lvbnMiLCJwbyIsImFsbG93Q3JlYXRlIiwiYWxsb3dSZWFkIiwiYWxsb3dFZGl0IiwiYWxsb3dEZWxldGUiLCJ2aWV3QWxsUmVjb3JkcyIsInZpZXdDb21wYW55UmVjb3JkcyIsIm1vZGlmeUNvbXBhbnlSZWNvcmRzIiwiYWxsb3dSZWFkRmlsZXMiLCJ2aWV3QWxsRmlsZXMiLCJhbGxvd0NyZWF0ZUZpbGVzIiwiYWxsb3dFZGl0RmlsZXMiLCJhbGxvd0RlbGV0ZUZpbGVzIiwibW9kaWZ5QWxsRmlsZXMiLCJnZXRUZW1wbGF0ZVNwYWNlSWQiLCJ0ZW1wbGF0ZVNwYWNlSWQiLCJnZXRDbG91ZEFkbWluU3BhY2VJZCIsImNsb3VkQWRtaW5TcGFjZUlkIiwiaXNUZW1wbGF0ZVNwYWNlIiwiaXNDbG91ZEFkbWluU3BhY2UiLCJzdGVlZG9zU3RvcmFnZURpciIsIlNURUVET1NfU1RPUkFHRV9ESVIiLCJtZXRob2RzIiwiY29sbGVjdGlvbiIsIm5hbWVfZmllbGRfa2V5Iiwib3B0aW9uc19saW1pdCIsInF1ZXJ5IiwicXVlcnlfb3B0aW9ucyIsInJlY29yZHMiLCJyZXN1bHRzIiwic2VhcmNoVGV4dFF1ZXJ5Iiwic2VsZWN0ZWQiLCJzb3J0IiwicGFyYW1zIiwiTkFNRV9GSUVMRF9LRVkiLCJzZWFyY2hUZXh0IiwiJHJlZ2V4IiwiJG9yIiwiJGluIiwiZXh0ZW5kIiwiJG5pbiIsImZpbHRlclF1ZXJ5IiwibGltaXQiLCJmaW5kIiwiZmV0Y2giLCJyZWNvcmQiLCJsYWJlbCIsIm1lc3NhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiSnNvblJvdXRlcyIsImFkZCIsInJlcSIsInJlcyIsIm5leHQiLCJib3giLCJjdXJyZW50X3VzZXJfaWQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImZsb3dJZCIsImhhc2hEYXRhIiwiaW5zIiwiaW5zSWQiLCJyZWNvcmRfaWQiLCJyZWRpcmVjdF91cmwiLCJyZWYyIiwicmVmMyIsInJlZjQiLCJ3b3JrZmxvd1VybCIsInhfYXV0aF90b2tlbiIsInhfdXNlcl9pZCIsInV1Zmxvd01hbmFnZXIiLCJjaGVja19hdXRob3JpemF0aW9uIiwiYm9keSIsImNoZWNrIiwiaW5zdGFuY2VJZCIsImZsb3ciLCJpbmJveF91c2VycyIsImluY2x1ZGVzIiwiY2NfdXNlcnMiLCJvdXRib3hfdXNlcnMiLCJzdGF0ZSIsInN1Ym1pdHRlciIsImFwcGxpY2FudCIsInBlcm1pc3Npb25NYW5hZ2VyIiwiZ2V0Rmxvd1Blcm1pc3Npb25zIiwic3BhY2VzIiwid2Vic2VydmljZXMiLCJ3b3JrZmxvdyIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsInVwZGF0ZSIsIiR1bnNldCIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsInJlYXNvbiIsImdldEluaXRXaWR0aFBlcmNlbnQiLCJjb2x1bW5zIiwiX3NjaGVtYSIsImNvbHVtbl9udW0iLCJpbml0X3dpZHRoX3BlcmNlbnQiLCJnZXRTY2hlbWEiLCJmaWVsZF9uYW1lIiwiZmllbGQiLCJpc193aWRlIiwicGljayIsImF1dG9mb3JtIiwiZ2V0RmllbGRJc1dpZGUiLCJnZXRUYWJ1bGFyT3JkZXIiLCJsaXN0X3ZpZXdfaWQiLCJzZXR0aW5nIiwibWFwIiwiY29sdW1uIiwiaGlkZGVuIiwiY29tcGFjdCIsIm9yZGVyIiwiaW5kZXgiLCJkZWZhdWx0X2V4dHJhX2NvbHVtbnMiLCJleHRyYV9jb2x1bW5zIiwiZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMiLCJnZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zIiwidW5pb24iLCJnZXRPYmplY3REZWZhdWx0U29ydCIsIlRhYnVsYXJTZWxlY3RlZElkcyIsImNvbnZlcnRMaXN0VmlldyIsImRlZmF1bHRfdmlldyIsImxpc3RfdmlldyIsImxpc3Rfdmlld19uYW1lIiwiZGVmYXVsdF9jb2x1bW5zIiwiZGVmYXVsdF9tb2JpbGVfY29sdW1ucyIsIm9pdGVtIiwibW9iaWxlX2NvbHVtbnMiLCJoYXMiLCJpbmNsdWRlIiwiZmlsdGVyX3Njb3BlIiwicGFyc2UiLCJmb3JFYWNoIiwiX3ZhbHVlIiwiZ2V0UmVsYXRlZExpc3QiLCJsYXlvdXRSZWxhdGVkTGlzdCIsImxpc3QiLCJtYXBMaXN0Iiwib2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzIiwicmVsYXRlZExpc3ROYW1lcyIsInJlbGF0ZWRMaXN0T2JqZWN0cyIsInJlbGF0ZWRfb2JqZWN0X25hbWVzIiwidW5yZWxhdGVkX29iamVjdHMiLCJyZWxhdGVkX2xpc3RzIiwiaXRlbSIsInJlRmllbGROYW1lIiwicmVPYmplY3ROYW1lIiwicmVsYXRlZCIsInJlbGF0ZWRfZmllbGRfZnVsbG5hbWUiLCJzcGxpdCIsImZpZWxkX25hbWVzIiwiaXNfZmlsZSIsImN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0IiwiYWN0aW9ucyIsImJ1dHRvbnMiLCJ2aXNpYmxlX29uIiwicGFnZV9zaXplIiwib2JqT3JOYW1lIiwiZ2V0UmVsYXRlZE9iamVjdHMiLCJyZWxhdGVkX29iamVjdF9pdGVtIiwicmVsYXRlZE9iamVjdCIsInRhYnVsYXJfb3JkZXIiLCJ3aXRob3V0IiwidHJhbnNmb3JtU29ydFRvVGFidWxhciIsInJlcGxhY2UiLCJwbHVjayIsImRpZmZlcmVuY2UiLCJ2IiwiaXNBY3RpdmUiLCJhbGxvd19yZWxhdGVkTGlzdCIsImdldE9iamVjdEZpcnN0TGlzdFZpZXciLCJmaXJzdCIsImdldExpc3RWaWV3cyIsImdldExpc3RWaWV3IiwiZXhhYyIsImxpc3RWaWV3cyIsImdldExpc3RWaWV3SXNSZWNlbnQiLCJsaXN0VmlldyIsInBpY2tPYmplY3RNb2JpbGVDb2x1bW5zIiwiY291bnQiLCJnZXRGaWVsZCIsImlzTmFtZUNvbHVtbiIsIml0ZW1Db3VudCIsIm1heENvdW50IiwibWF4Um93cyIsIm5hbWVDb2x1bW4iLCJuYW1lS2V5IiwicmVzdWx0IiwiZ2V0T2JqZWN0RGVmYXVsdFZpZXciLCJkZWZhdWx0VmlldyIsInVzZV9tb2JpbGVfY29sdW1ucyIsImlzQWxsVmlldyIsImlzUmVjZW50VmlldyIsInRhYnVsYXJDb2x1bW5zIiwidGFidWxhcl9zb3J0IiwiY29sdW1uX2luZGV4IiwidHJhbnNmb3JtU29ydFRvRFgiLCJkeF9zb3J0IiwiUmVnRXgiLCJSZWdFeHAiLCJfcmVnRXhNZXNzYWdlcyIsIl9nbG9iYWxNZXNzYWdlcyIsInJlZ0V4IiwiZXhwIiwibXNnIiwibWVzc2FnZXMiLCJldmFsSW5Db250ZXh0IiwianMiLCJldmFsIiwiY2FsbCIsImNvbnZlcnRGaWVsZCIsImdldE9wdGlvbiIsIm9wdGlvbiIsImZvbyIsImNvbG9yIiwiYWxsT3B0aW9ucyIsInBpY2tsaXN0IiwicGlja2xpc3RPcHRpb25zIiwiZ2V0UGlja2xpc3QiLCJnZXRQaWNrTGlzdE9wdGlvbnMiLCJyZXZlcnNlIiwiZW5hYmxlIiwiZGVmYXVsdFZhbHVlIiwidHJpZ2dlcnMiLCJ0cmlnZ2VyIiwiX3RvZG8iLCJfdG9kb19mcm9tX2NvZGUiLCJfdG9kb19mcm9tX2RiIiwib24iLCJ0b2RvIiwiX3Zpc2libGUiLCJlcnJvcjEiLCJhY3Rpb25zQnlOYW1lIiwidmlzaWJsZSIsIl9vcHRpb25zIiwiX3R5cGUiLCJiZWZvcmVPcGVuRnVuY3Rpb24iLCJpc19jb21wYW55X2xpbWl0ZWQiLCJtYXgiLCJtaW4iLCJfb3B0aW9uIiwiayIsIl9yZWdFeCIsIl9taW4iLCJfbWF4IiwiTnVtYmVyIiwiQm9vbGVhbiIsIl9vcHRpb25zRnVuY3Rpb24iLCJfcmVmZXJlbmNlX3RvIiwiX2NyZWF0ZUZ1bmN0aW9uIiwiX2JlZm9yZU9wZW5GdW5jdGlvbiIsIl9maWx0ZXJzRnVuY3Rpb24iLCJfZGVmYXVsdFZhbHVlIiwiX2lzX2NvbXBhbnlfbGltaXRlZCIsIl9maWx0ZXJzIiwiaXNEYXRlIiwicG9wIiwiX2lzX2RhdGUiLCJmb3JtIiwidmFsIiwicmVsYXRlZE9iakluZm8iLCJQUkVGSVgiLCJfcHJlcGVuZFByZWZpeEZvckZvcm11bGEiLCJwcmVmaXgiLCJmaWVsZFZhcmlhYmxlIiwicmVnIiwicmV2IiwibSIsIiQxIiwiZm9ybXVsYV9zdHIiLCJfQ09OVEVYVCIsIl9WQUxVRVMiLCJpc0Jvb2xlYW4iLCJ0b2FzdHIiLCJmb3JtYXRPYmplY3ROYW1lIiwiX2Jhc2VPYmplY3QiLCJfZGIiLCJkZWZhdWx0TGlzdFZpZXdJZCIsImRpc2FibGVkX2xpc3Rfdmlld3MiLCJzY2hlbWEiLCJzZWxmIiwiYmFzZU9iamVjdCIsInBlcm1pc3Npb25fc2V0IiwiaWNvbiIsImRlc2NyaXB0aW9uIiwiaXNfdmlldyIsInZlcnNpb24iLCJpc19lbmFibGUiLCJhbGxvd19jdXN0b21BY3Rpb25zIiwiZXhjbHVkZV9hY3Rpb25zIiwiZW5hYmxlX3NlYXJjaCIsInBhZ2luZyIsImVuYWJsZV9hcGkiLCJjdXN0b20iLCJlbmFibGVfc2hhcmUiLCJlbmFibGVfdHJlZSIsInNpZGViYXIiLCJvcGVuX3dpbmRvdyIsImZpbHRlcl9jb21wYW55IiwiY2FsZW5kYXIiLCJlbmFibGVfY2hhdHRlciIsImVuYWJsZV90cmFzaCIsImVuYWJsZV9zcGFjZV9nbG9iYWwiLCJlbmFibGVfZm9sbG93IiwiZW5hYmxlX3dvcmtmbG93IiwiZW5hYmxlX2lubGluZV9lZGl0IiwiZGV0YWlscyIsIm1hc3RlcnMiLCJsb29rdXBfZGV0YWlscyIsImluX2RldmVsb3BtZW50IiwiaWRGaWVsZE5hbWUiLCJkYXRhYmFzZV9uYW1lIiwiaXNfbmFtZSIsInByaW1hcnkiLCJmaWx0ZXJhYmxlIiwicmVhZG9ubHkiLCJpdGVtX25hbWUiLCJjb3B5SXRlbSIsImFkbWluIiwiYWxsIiwibGlzdF92aWV3X2l0ZW0iLCJSZWFjdGl2ZVZhciIsImNyZWF0ZUNvbGxlY3Rpb24iLCJfbmFtZSIsImdldE9iamVjdFNjaGVtYSIsImNvbnRhaW5zIiwiYXR0YWNoU2NoZW1hIiwiX3NpbXBsZVNjaGVtYSIsImdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4IiwiYm9vdHN0cmFwTG9hZGVkIiwiZmllbGRzQXJyIiwiX3JlZl9vYmoiLCJhdXRvZm9ybV90eXBlIiwiY29sbGVjdGlvbk5hbWUiLCJmcyIsImlzVW5MaW1pdGVkIiwibXVsdGlwbGUiLCJyb3dzIiwibGFuZ3VhZ2UiLCJpc01vYmlsZSIsImlzUGFkIiwiaXNpT1MiLCJhZkZpZWxkSW5wdXQiLCJ0aW1lem9uZUlkIiwiZHhEYXRlQm94T3B0aW9ucyIsImRpc3BsYXlGb3JtYXQiLCJwaWNrZXJUeXBlIiwiZGF0ZU1vYmlsZU9wdGlvbnMiLCJvdXRGb3JtYXQiLCJoZWlnaHQiLCJkaWFsb2dzSW5Cb2R5IiwidG9vbGJhciIsImZvbnROYW1lcyIsImxhbmciLCJzaG93SWNvbiIsImRlcGVuZE9uIiwiZGVwZW5kX29uIiwiY3JlYXRlIiwibG9va3VwX2ZpZWxkIiwiTW9kYWwiLCJzaG93IiwiZm9ybUlkIiwib3BlcmF0aW9uIiwib25TdWNjZXNzIiwiYWRkSXRlbXMiLCJyZWZlcmVuY2Vfc29ydCIsIm9wdGlvbnNTb3J0IiwicmVmZXJlbmNlX2xpbWl0Iiwib3B0aW9uc0xpbWl0IiwicmVmZXJlbmNlX3RvX2ZpZWxkIiwicmVmZXJlbmNlVG9GaWVsZCIsIm9taXQiLCJibGFja2JveCIsIm9iamVjdFN3aXRjaGUiLCJvcHRpb25zTWV0aG9kIiwib3B0aW9uc01ldGhvZFBhcmFtcyIsInJlZmVyZW5jZXMiLCJfcmVmZXJlbmNlIiwibGluayIsImRlZmF1bHRJY29uIiwiZmlyc3RPcHRpb24iLCJwcmVjaXNpb24iLCJzY2FsZSIsImRlY2ltYWwiLCJkaXNhYmxlZCIsIkFycmF5IiwiZWRpdGFibGUiLCJhY2NlcHQiLCJzeXN0ZW0iLCJFbWFpbCIsImFzc2lnbiIsImRhdGFfdHlwZSIsImlzTnVtYmVyIiwicmVxdWlyZWQiLCJvcHRpb25hbCIsInVuaXF1ZSIsImdyb3VwIiwic2VhcmNoYWJsZSIsIm5vdyIsImlubGluZUhlbHBUZXh0IiwiaXNQcm9kdWN0aW9uIiwic29ydGFibGUiLCJnZXRGaWVsZERpc3BsYXlWYWx1ZSIsImZpZWxkX3ZhbHVlIiwiaHRtbCIsIm1vbWVudCIsImZvcm1hdCIsImNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeSIsImZpZWxkX3R5cGUiLCJwdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMiLCJvcGVyYXRpb25zIiwiYnVpbHRpblZhbHVlcyIsImdldEJldHdlZW5CdWlsdGluVmFsdWVzIiwiYnVpbHRpbkl0ZW0iLCJpc19jaGVja19vbmx5IiwiZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVzIiwiZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0iLCJnZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0iLCJnZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiIsImJldHdlZW5CdWlsdGluVmFsdWVzIiwiZ2V0UXVhcnRlclN0YXJ0TW9udGgiLCJtb250aCIsImdldE1vbnRoIiwiZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSIsInllYXIiLCJnZXRGdWxsWWVhciIsImdldE5leHRRdWFydGVyRmlyc3REYXkiLCJnZXRNb250aERheXMiLCJkYXlzIiwiZW5kRGF0ZSIsIm1pbGxpc2Vjb25kIiwic3RhcnREYXRlIiwiZ2V0TGFzdE1vbnRoRmlyc3REYXkiLCJjdXJyZW50TW9udGgiLCJjdXJyZW50WWVhciIsImVuZFZhbHVlIiwiZmlyc3REYXkiLCJsYXN0RGF5IiwibGFzdE1vbmRheSIsImxhc3RNb250aEZpbmFsRGF5IiwibGFzdE1vbnRoRmlyc3REYXkiLCJsYXN0UXVhcnRlckVuZERheSIsImxhc3RRdWFydGVyU3RhcnREYXkiLCJsYXN0U3VuZGF5IiwibGFzdF8xMjBfZGF5cyIsImxhc3RfMzBfZGF5cyIsImxhc3RfNjBfZGF5cyIsImxhc3RfN19kYXlzIiwibGFzdF85MF9kYXlzIiwibWludXNEYXkiLCJtb25kYXkiLCJuZXh0TW9uZGF5IiwibmV4dE1vbnRoRmluYWxEYXkiLCJuZXh0TW9udGhGaXJzdERheSIsIm5leHRRdWFydGVyRW5kRGF5IiwibmV4dFF1YXJ0ZXJTdGFydERheSIsIm5leHRTdW5kYXkiLCJuZXh0WWVhciIsIm5leHRfMTIwX2RheXMiLCJuZXh0XzMwX2RheXMiLCJuZXh0XzYwX2RheXMiLCJuZXh0XzdfZGF5cyIsIm5leHRfOTBfZGF5cyIsInByZXZpb3VzWWVhciIsInN0YXJ0VmFsdWUiLCJzdHJFbmREYXkiLCJzdHJGaXJzdERheSIsInN0ckxhc3REYXkiLCJzdHJNb25kYXkiLCJzdHJTdGFydERheSIsInN0clN1bmRheSIsInN0clRvZGF5Iiwic3RyVG9tb3Jyb3ciLCJzdHJZZXN0ZGF5Iiwic3VuZGF5IiwidGhpc1F1YXJ0ZXJFbmREYXkiLCJ0aGlzUXVhcnRlclN0YXJ0RGF5IiwidG9tb3Jyb3ciLCJ3ZWVrIiwieWVzdGRheSIsImdldERheSIsInQiLCJmdiIsInNldEhvdXJzIiwiZ2V0SG91cnMiLCJnZXRUaW1lem9uZU9mZnNldCIsImdldEZpZWxkRGVmYXVsdE9wZXJhdGlvbiIsImdldEZpZWxkT3BlcmF0aW9uIiwib3B0aW9uYWxzIiwiZXF1YWwiLCJ1bmVxdWFsIiwibGVzc190aGFuIiwiZ3JlYXRlcl90aGFuIiwibGVzc19vcl9lcXVhbCIsImdyZWF0ZXJfb3JfZXF1YWwiLCJub3RfY29udGFpbiIsInN0YXJ0c193aXRoIiwiYmV0d2VlbiIsImdldE9iamVjdEZpZWxkc05hbWUiLCJmaWVsZHNOYW1lIiwic29ydF9ubyIsImNsZWFuVHJpZ2dlciIsImluaXRUcmlnZ2VyIiwiX3RyaWdnZXJfaG9va3MiLCJyZWY1IiwidG9kb1dyYXBwZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsIndoZW4iLCJiZWZvcmUiLCJpbnNlcnQiLCJyZW1vdmUiLCJhZnRlciIsIl9ob29rIiwidHJpZ2dlcl9uYW1lIiwiX3RyaWdnZXJfaG9vayIsImJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcyIsImV4dGVuZFBlcm1pc3Npb25Qcm9wcyIsImZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QiLCJmaW5kX3Blcm1pc3Npb25fb2JqZWN0IiwiaW50ZXJzZWN0aW9uUGx1cyIsIm90aGVyUGVybWlzc2lvblByb3BOYW1lcyIsIm92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyIsInBlcm1pc3Npb25Qcm9wTmFtZXMiLCJ1bmlvblBlcm1pc3Npb25PYmplY3RzIiwidW5pb25QbHVzIiwiZ2V0T2JqZWN0UGVybWlzc2lvbnMiLCJnZXRSZWNvcmRQZXJtaXNzaW9ucyIsImlzT3duZXIiLCJtYXN0ZXJPYmplY3ROYW1lIiwibWFzdGVyUmVjb3JkUGVybSIsInJlY29yZF9jb21wYW55X2lkIiwicmVjb3JkX2NvbXBhbnlfaWRzIiwidXNlcl9jb21wYW55X2lkcyIsInJlY29yZF9wZXJtaXNzaW9ucyIsIm93bmVyIiwicGFyZW50IiwibiIsImludGVyc2VjdGlvbiIsImxvY2tlZCIsImdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnMiLCJjdXJyZW50T2JqZWN0TmFtZSIsInJlbGF0ZWRMaXN0SXRlbSIsImN1cnJlbnRSZWNvcmQiLCJpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUiLCJtYXN0ZXJBbGxvdyIsInJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyIsInVuZWRpdGFibGVfcmVsYXRlZF9saXN0IiwiZ2V0T2JqZWN0UmVjb3JkIiwiZ2V0UmVjb3JkU2FmZVJlbGF0ZWRMaXN0IiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJfaSIsInBzZXRzIiwicHNldHNBZG1pbiIsInBzZXRzQWRtaW5fcG9zIiwicHNldHNDdXJyZW50IiwicHNldHNDdXJyZW50TmFtZXMiLCJwc2V0c0N1cnJlbnRfcG9zIiwicHNldHNDdXN0b21lciIsInBzZXRzQ3VzdG9tZXJfcG9zIiwicHNldHNHdWVzdCIsInBzZXRzR3Vlc3RfcG9zIiwicHNldHNNZW1iZXIiLCJwc2V0c01lbWJlcl9wb3MiLCJwc2V0c1N1cHBsaWVyIiwicHNldHNTdXBwbGllcl9wb3MiLCJwc2V0c1VzZXIiLCJwc2V0c1VzZXJfcG9zIiwic2V0X2lkcyIsInNwYWNlVXNlciIsIm9iamVjdHMiLCJhc3NpZ25lZF9hcHBzIiwicHJvZmlsZSIsInVzZXJzIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJnZXRBc3NpZ25lZEFwcHMiLCJiaW5kIiwiYXNzaWduZWRfbWVudXMiLCJnZXRBc3NpZ25lZE1lbnVzIiwidXNlcl9wZXJtaXNzaW9uX3NldHMiLCJhcnJheSIsIm90aGVyIiwidGFyZ2V0IiwicHJvcHMiLCJmaWxlc1Byb05hbWVzIiwicHJvcE5hbWVzIiwicHJvcE5hbWUiLCJhcHBzIiwicHNldEJhc2UiLCJ1c2VyUHJvZmlsZSIsInBzZXQiLCJ1bmlxIiwiYWJvdXRNZW51IiwiYWRtaW5NZW51cyIsImFsbE1lbnVzIiwiY3VycmVudFBzZXROYW1lcyIsIm1lbnVzIiwib3RoZXJNZW51QXBwcyIsIm90aGVyTWVudXMiLCJhZG1pbl9tZW51cyIsImZsYXR0ZW4iLCJtZW51IiwicHNldHNNZW51IiwicGVybWlzc2lvbl9zZXRzIiwicGVybWlzc2lvbl9vYmplY3RzIiwiaXNOdWxsIiwicGVybWlzc2lvbl9zZXRfaWRzIiwicG9zIiwib3BzIiwib3BzX2tleSIsImN1cnJlbnRQc2V0IiwidGVtcE9wcyIsInJlcGVhdEluZGV4IiwicmVwZWF0UG8iLCJvcHNldEFkbWluIiwib3BzZXRDdXN0b21lciIsIm9wc2V0R3Vlc3QiLCJvcHNldE1lbWJlciIsIm9wc2V0U3VwcGxpZXIiLCJvcHNldFVzZXIiLCJwb3NBZG1pbiIsInBvc0N1c3RvbWVyIiwicG9zR3Vlc3QiLCJwb3NNZW1iZXIiLCJwb3NTdXBwbGllciIsInBvc1VzZXIiLCJwcm9mIiwiZ3Vlc3QiLCJtZW1iZXIiLCJzdXBwbGllciIsImN1c3RvbWVyIiwiZGlzYWJsZWRfYWN0aW9ucyIsInVucmVhZGFibGVfZmllbGRzIiwidW5lZGl0YWJsZV9maWVsZHMiLCJjcmVhdG9yX2RiX3VybCIsIm9wbG9nX3VybCIsIk1PTkdPX1VSTF9DUkVBVE9SIiwiTU9OR09fT1BMT0dfVVJMX0NSRUFUT1IiLCJfQ1JFQVRPUl9EQVRBU09VUkNFIiwiX2RyaXZlciIsIk1vbmdvSW50ZXJuYWxzIiwiUmVtb3RlQ29sbGVjdGlvbkRyaXZlciIsIm9wbG9nVXJsIiwiY29sbGVjdGlvbl9rZXkiLCJuZXdDb2xsZWN0aW9uIiwiU01TUXVldWUiLCJzdGVlZG9zRmlsdGVycyIsImFjdGlvbl9uYW1lIiwiZXhlY3V0ZUFjdGlvbiIsIml0ZW1fZWxlbWVudCIsIm1vcmVBcmdzIiwidG9kb0FyZ3MiLCJPYmplY3RHcmlkIiwiZ2V0RmlsdGVycyIsIndvcmRfdGVtcGxhdGUiLCJmb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5IiwiYWJzb2x1dGVVcmwiLCJ3aW5kb3ciLCJvcGVuIiwib2RhdGEiLCJwcm90b3R5cGUiLCJzbGljZSIsImNvbmNhdCIsIndhcm5pbmciLCJpbml0aWFsVmFsdWVzIiwic2VsZWN0ZWRSb3dzIiwiZ3JpZFJlZiIsImN1cnJlbnQiLCJhcGkiLCJnZXRTZWxlY3RlZFJvd3MiLCJGb3JtTWFuYWdlciIsImdldEluaXRpYWxWYWx1ZXMiLCJTdGVlZG9zVUkiLCJzaG93TW9kYWwiLCJzdG9yZXMiLCJDb21wb25lbnRSZWdpc3RyeSIsImNvbXBvbmVudHMiLCJPYmplY3RGb3JtIiwib2JqZWN0QXBpTmFtZSIsInRpdGxlIiwiYWZ0ZXJJbnNlcnQiLCJzZXRUaW1lb3V0IiwiYXBwX2lkIiwiRmxvd1JvdXRlciIsImdvIiwiaWNvblBhdGgiLCJzZXQiLCJkZWZlciIsIiQiLCJjbGljayIsImhyZWYiLCJnZXRPYmplY3RVcmwiLCJyZWRpcmVjdCIsInJlY29yZElkIiwiYWZ0ZXJVcGRhdGUiLCJyb3V0ZSIsImVuZHNXaXRoIiwicmVsb2FkIiwicmVmcmVzaEdyaWQiLCJyZWNvcmRfdGl0bGUiLCJjYWxsX2JhY2siLCJiZWZvcmVIb29rIiwidGV4dCIsInJ1bkhvb2siLCJzd2FsIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uVGV4dCIsInByZXZpb3VzRG9jIiwiZ2V0UHJldmlvdXNEb2MiLCJfZSIsImFwcGlkIiwiZHhEYXRhR3JpZEluc3RhbmNlIiwiZ3JpZENvbnRhaW5lciIsImdyaWRPYmplY3ROYW1lQ2xhc3MiLCJpbmZvIiwiaXNPcGVuZXJSZW1vdmUiLCJyZWNvcmRVcmwiLCJ0ZW1wTmF2UmVtb3ZlZCIsInN1Y2Nlc3MiLCJvcGVuZXIiLCJkeFRyZWVMaXN0IiwiZHhEYXRhR3JpZCIsInJlZnJlc2giLCJUZW1wbGF0ZSIsImNyZWF0b3JfZ3JpZCIsInJlbW92ZVRlbXBOYXZJdGVtIiwiY2xvc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEtBQUNBLEVBQUQsR0FBTSxFQUFOOztBQUNBLElBQUksT0FBQUMsT0FBQSxvQkFBQUEsWUFBQSxJQUFKO0FBQ0MsT0FBQ0EsT0FBRCxHQUFXLEVBQVg7QUNFQTs7QUREREEsUUFBUUMsT0FBUixHQUFrQixFQUFsQjtBQUNBRCxRQUFRRSxXQUFSLEdBQXNCLEVBQXRCO0FBQ0FGLFFBQVFHLEtBQVIsR0FBZ0IsRUFBaEI7QUFDQUgsUUFBUUksSUFBUixHQUFlLEVBQWY7QUFD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QW9CNTBCLFdBQXBCLEVBQWlDLFFBQWpDLEVBQTJDLE9BQTNDLEVBQW9EO0FBQUMwQixtQkFBS3lLLFNBQU47QUFBaUJ6TixxQkFBT0E7QUFBeEIsYUFBcEQsQ0N5Q0s7QUQvRk4sWUN1Qkk7QUE2RUQ7QUQ5R04sUUNzQkc7QUQxSEo7QUFBQSxHQUZEO0FDd05BLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIkBkYiA9IHt9XG5pZiAhQ3JlYXRvcj9cblx0QENyZWF0b3IgPSB7fVxuQ3JlYXRvci5PYmplY3RzID0ge31cbkNyZWF0b3IuQ29sbGVjdGlvbnMgPSB7fVxuQ3JlYXRvci5NZW51cyA9IFtdXG5DcmVhdG9yLkFwcHMgPSB7fVxuQ3JlYXRvci5EYXNoYm9hcmRzID0ge31cbkNyZWF0b3IuUmVwb3J0cyA9IHt9XG5DcmVhdG9yLnN1YnMgPSB7fVxuQ3JlYXRvci5zdGVlZG9zU2NoZW1hID0ge30iLCJ0aGlzLmRiID0ge307XG5cbmlmICh0eXBlb2YgQ3JlYXRvciA9PT0gXCJ1bmRlZmluZWRcIiB8fCBDcmVhdG9yID09PSBudWxsKSB7XG4gIHRoaXMuQ3JlYXRvciA9IHt9O1xufVxuXG5DcmVhdG9yLk9iamVjdHMgPSB7fTtcblxuQ3JlYXRvci5Db2xsZWN0aW9ucyA9IHt9O1xuXG5DcmVhdG9yLk1lbnVzID0gW107XG5cbkNyZWF0b3IuQXBwcyA9IHt9O1xuXG5DcmVhdG9yLkRhc2hib2FyZHMgPSB7fTtcblxuQ3JlYXRvci5SZXBvcnRzID0ge307XG5cbkNyZWF0b3Iuc3VicyA9IHt9O1xuXG5DcmVhdG9yLnN0ZWVkb3NTY2hlbWEgPSB7fTtcbiIsInRyeVxuXHRpZiBwcm9jZXNzLmVudi5DUkVBVE9SX05PREVfRU5WID09ICdkZXZlbG9wbWVudCdcblx0XHRzdGVlZG9zQ29yZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2NvcmUnKVxuXHRcdG9iamVjdHFsID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKVxuXHRcdG1vbGVjdWxlciA9IHJlcXVpcmUoXCJtb2xlY3VsZXJcIik7XG5cdFx0cGFja2FnZUxvYWRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0ZW9yLXBhY2thZ2UtbG9hZGVyJyk7XG5cdFx0QVBJU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtYXBpJyk7XG5cdFx0TWV0YWRhdGFTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRhZGF0YS1zZXJ2ZXInKTtcblx0XHRwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cblx0XHRjb25maWcgPSBvYmplY3RxbC5nZXRTdGVlZG9zQ29uZmlnKCk7XG5cdFx0c2V0dGluZ3MgPSB7XG5cdFx0XHRidWlsdF9pbl9wbHVnaW5zOiBbXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvd29ya2Zsb3dcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9hY2NvdW50c1wiLFxuXHRcdFx0XHRcIkBzdGVlZG9zL3N0ZWVkb3MtcGx1Z2luLXNjaGVtYS1idWlsZGVyXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvcGx1Z2luLWVudGVycHJpc2VcIixcblx0XHRcdFx0XCJAc3RlZWRvcy93b3JkLXRlbXBsYXRlXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvbWV0YWRhdGEtYXBpXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvcGx1Z2luLWRpbmd0YWxrXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3MvZGF0YS1pbXBvcnRcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWZpZWxkcy1pbmRleHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLWFjY291bnRzXCIsXG5cdFx0XHRcdFwiQHN0ZWVkb3Mvc2VydmljZS1jaGFydHNcIixcblx0XHRcdFx0XCJAc3RlZWRvcy9zZXJ2aWNlLXBhZ2VzXCJdLFxuXHRcdFx0cGx1Z2luczogY29uZmlnLnBsdWdpbnNcblx0XHR9XG5cdFx0TWV0ZW9yLnN0YXJ0dXAgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuXHRcdFx0XHRcdG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG5cdFx0XHRcdFx0bm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuXHRcdFx0XHRcdG1ldGFkYXRhOiB7fSxcblx0XHRcdFx0XHR0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG5cdFx0XHRcdFx0Y2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG5cdFx0XHRcdFx0bG9nTGV2ZWw6IFwid2FyblwiLFxuXHRcdFx0XHRcdHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuXHRcdFx0XHRcdHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG5cdFx0XHRcdFx0bWF4Q2FsbExldmVsOiAxMDAsXG5cblx0XHRcdFx0XHRoZWFydGJlYXRJbnRlcnZhbDogMTAsXG5cdFx0XHRcdFx0aGVhcnRiZWF0VGltZW91dDogMzAsXG5cblx0XHRcdFx0XHRjb250ZXh0UGFyYW1zQ2xvbmluZzogZmFsc2UsXG5cblx0XHRcdFx0XHR0cmFja2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRzaHV0ZG93blRpbWVvdXQ6IDUwMDAsXG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG5cblx0XHRcdFx0XHRyZWdpc3RyeToge1xuXHRcdFx0XHRcdFx0c3RyYXRlZ3k6IFwiUm91bmRSb2JpblwiLFxuXHRcdFx0XHRcdFx0cHJlZmVyTG9jYWw6IHRydWVcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0YnVsa2hlYWQ6IHtcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0Y29uY3VycmVuY3k6IDEwLFxuXHRcdFx0XHRcdFx0bWF4UXVldWVTaXplOiAxMDAsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR2YWxpZGF0b3I6IHRydWUsXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBudWxsLFxuXG5cdFx0XHRcdFx0dHJhY2luZzoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRleHBvcnRlcjoge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIkNvbnNvbGVcIixcblx0XHRcdFx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdFx0XHRcdGxvZ2dlcjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRjb2xvcnM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHRcdFx0XHRnYXVnZVdpZHRoOiA0MFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdG1ldGFkYXRhU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiAnbWV0YWRhdGEtc2VydmVyJyxcblx0XHRcdFx0XHRtaXhpbnM6IFtNZXRhZGF0YVNlcnZpY2VdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0YXBpU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiBcImFwaVwiLFxuXHRcdFx0XHRcdG1peGluczogW0FQSVNlcnZpY2VdLFxuXHRcdFx0XHRcdHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRwb3J0OiBudWxsXG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0b2JqZWN0cWwuZ2V0U3RlZWRvc1NjaGVtYShicm9rZXIpO1xuXHRcdFx0XHRzdGFuZGFyZE9iamVjdHNEaXIgPSBvYmplY3RxbC5TdGFuZGFyZE9iamVjdHNQYXRoO1xuXHRcdFx0XHRzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSA9IGJyb2tlci5jcmVhdGVTZXJ2aWNlKHtcblx0XHRcdFx0XHRuYW1lOiAnc3RhbmRhcmQtb2JqZWN0cycsXG5cdFx0XHRcdFx0bWl4aW5zOiBbcGFja2FnZUxvYWRlcl0sXG5cdFx0XHRcdFx0c2V0dGluZ3M6IHsgcGFja2FnZUluZm86IHtcblx0XHRcdFx0XHRcdHBhdGg6IHN0YW5kYXJkT2JqZWN0c0Rpcixcblx0XHRcdFx0XHR9IH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0TWV0ZW9yLndyYXBBc3luYygoY2IpLT5cblx0XHRcdFx0XHRicm9rZXIuc3RhcnQoKS50aGVuKCgpLT5cblx0XHRcdFx0XHRcdGlmICFicm9rZXIuc3RhcnRlZCBcblx0XHRcdFx0XHRcdFx0YnJva2VyLl9yZXN0YXJ0U2VydmljZShzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZSk7XG5cblx0XHRcdFx0XHRcdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKFwiL1wiLCBhcGlTZXJ2aWNlLmV4cHJlc3MoKSk7XG5cdFx0XHRcdFx0XHQjIHN0ZWVkb3NDb3JlLmluaXQoc2V0dGluZ3MpLnRoZW4gKCktPlxuXHRcdFx0XHRcdFx0IyBcdGNiKCk7XG5cblx0XHRcdFx0XHRcdGJyb2tlci53YWl0Rm9yU2VydmljZXMoc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UubmFtZSkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuXHRcdFx0XHRcdFx0XHRzdGVlZG9zQ29yZS5pbml0KHNldHRpbmdzKS50aGVuICgpLT5cblx0XHRcdFx0XHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpKClcblx0XHRcdGNhdGNoIGV4XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIixleClcbmNhdGNoIGVcblx0Y29uc29sZS5lcnJvcihcImVycm9yOlwiLGUpIiwidmFyIEFQSVNlcnZpY2UsIE1ldGFkYXRhU2VydmljZSwgY29uZmlnLCBlLCBtb2xlY3VsZXIsIG9iamVjdHFsLCBwYWNrYWdlTG9hZGVyLCBwYXRoLCBzZXR0aW5ncywgc3RlZWRvc0NvcmU7XG5cbnRyeSB7XG4gIGlmIChwcm9jZXNzLmVudi5DUkVBVE9SX05PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJyk7XG4gICAgb2JqZWN0cWwgPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpO1xuICAgIG1vbGVjdWxlciA9IHJlcXVpcmUoXCJtb2xlY3VsZXJcIik7XG4gICAgcGFja2FnZUxvYWRlciA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtbWV0ZW9yLXBhY2thZ2UtbG9hZGVyJyk7XG4gICAgQVBJU2VydmljZSA9IHJlcXVpcmUoJ0BzdGVlZG9zL3NlcnZpY2UtYXBpJyk7XG4gICAgTWV0YWRhdGFTZXJ2aWNlID0gcmVxdWlyZSgnQHN0ZWVkb3Mvc2VydmljZS1tZXRhZGF0YS1zZXJ2ZXInKTtcbiAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgIGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcbiAgICBzZXR0aW5ncyA9IHtcbiAgICAgIGJ1aWx0X2luX3BsdWdpbnM6IFtcIkBzdGVlZG9zL3dvcmtmbG93XCIsIFwiQHN0ZWVkb3MvYWNjb3VudHNcIiwgXCJAc3RlZWRvcy9zdGVlZG9zLXBsdWdpbi1zY2hlbWEtYnVpbGRlclwiLCBcIkBzdGVlZG9zL3BsdWdpbi1lbnRlcnByaXNlXCIsIFwiQHN0ZWVkb3Mvd29yZC10ZW1wbGF0ZVwiLCBcIkBzdGVlZG9zL21ldGFkYXRhLWFwaVwiLCBcIkBzdGVlZG9zL3BsdWdpbi1kaW5ndGFsa1wiLCBcIkBzdGVlZG9zL2RhdGEtaW1wb3J0XCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1maWVsZHMtaW5kZXhzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1hY2NvdW50c1wiLCBcIkBzdGVlZG9zL3NlcnZpY2UtY2hhcnRzXCIsIFwiQHN0ZWVkb3Mvc2VydmljZS1wYWdlc1wiXSxcbiAgICAgIHBsdWdpbnM6IGNvbmZpZy5wbHVnaW5zXG4gICAgfTtcbiAgICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcGlTZXJ2aWNlLCBicm9rZXIsIGV4LCBtZXRhZGF0YVNlcnZpY2UsIHN0YW5kYXJkT2JqZWN0c0Rpciwgc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2U7XG4gICAgICB0cnkge1xuICAgICAgICBicm9rZXIgPSBuZXcgbW9sZWN1bGVyLlNlcnZpY2VCcm9rZXIoe1xuICAgICAgICAgIG5hbWVzcGFjZTogXCJzdGVlZG9zXCIsXG4gICAgICAgICAgbm9kZUlEOiBcInN0ZWVkb3MtY3JlYXRvclwiLFxuICAgICAgICAgIG1ldGFkYXRhOiB7fSxcbiAgICAgICAgICB0cmFuc3BvcnRlcjogcHJvY2Vzcy5lbnYuVFJBTlNQT1JURVIsXG4gICAgICAgICAgY2FjaGVyOiBwcm9jZXNzLmVudi5DQUNIRVIsXG4gICAgICAgICAgbG9nTGV2ZWw6IFwid2FyblwiLFxuICAgICAgICAgIHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuICAgICAgICAgIHJlcXVlc3RUaW1lb3V0OiA2MCAqIDEwMDAsXG4gICAgICAgICAgbWF4Q2FsbExldmVsOiAxMDAsXG4gICAgICAgICAgaGVhcnRiZWF0SW50ZXJ2YWw6IDEwLFxuICAgICAgICAgIGhlYXJ0YmVhdFRpbWVvdXQ6IDMwLFxuICAgICAgICAgIGNvbnRleHRQYXJhbXNDbG9uaW5nOiBmYWxzZSxcbiAgICAgICAgICB0cmFja2luZzoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBzaHV0ZG93blRpbWVvdXQ6IDUwMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRpc2FibGVCYWxhbmNlcjogZmFsc2UsXG4gICAgICAgICAgcmVnaXN0cnk6IHtcbiAgICAgICAgICAgIHN0cmF0ZWd5OiBcIlJvdW5kUm9iaW5cIixcbiAgICAgICAgICAgIHByZWZlckxvY2FsOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWxraGVhZDoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICBjb25jdXJyZW5jeTogMTAsXG4gICAgICAgICAgICBtYXhRdWV1ZVNpemU6IDEwMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdmFsaWRhdG9yOiB0cnVlLFxuICAgICAgICAgIGVycm9ySGFuZGxlcjogbnVsbCxcbiAgICAgICAgICB0cmFjaW5nOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGV4cG9ydGVyOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiQ29uc29sZVwiLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvbG9yczogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgICAgICAgIGdhdWdlV2lkdGg6IDQwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtZXRhZGF0YVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogJ21ldGFkYXRhLXNlcnZlcicsXG4gICAgICAgICAgbWl4aW5zOiBbTWV0YWRhdGFTZXJ2aWNlXSxcbiAgICAgICAgICBzZXR0aW5nczoge31cbiAgICAgICAgfSk7XG4gICAgICAgIGFwaVNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogXCJhcGlcIixcbiAgICAgICAgICBtaXhpbnM6IFtBUElTZXJ2aWNlXSxcbiAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgcG9ydDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9iamVjdHFsLmdldFN0ZWVkb3NTY2hlbWEoYnJva2VyKTtcbiAgICAgICAgc3RhbmRhcmRPYmplY3RzRGlyID0gb2JqZWN0cWwuU3RhbmRhcmRPYmplY3RzUGF0aDtcbiAgICAgICAgc3RhbmRhcmRPYmplY3RzUGFja2FnZUxvYWRlclNlcnZpY2UgPSBicm9rZXIuY3JlYXRlU2VydmljZSh7XG4gICAgICAgICAgbmFtZTogJ3N0YW5kYXJkLW9iamVjdHMnLFxuICAgICAgICAgIG1peGluczogW3BhY2thZ2VMb2FkZXJdLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBwYWNrYWdlSW5mbzoge1xuICAgICAgICAgICAgICBwYXRoOiBzdGFuZGFyZE9iamVjdHNEaXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihjYikge1xuICAgICAgICAgIHJldHVybiBicm9rZXIuc3RhcnQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFicm9rZXIuc3RhcnRlZCkge1xuICAgICAgICAgICAgICBicm9rZXIuX3Jlc3RhcnRTZXJ2aWNlKHN0YW5kYXJkT2JqZWN0c1BhY2thZ2VMb2FkZXJTZXJ2aWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKFwiL1wiLCBhcGlTZXJ2aWNlLmV4cHJlc3MoKSk7XG4gICAgICAgICAgICByZXR1cm4gYnJva2VyLndhaXRGb3JTZXJ2aWNlcyhzdGFuZGFyZE9iamVjdHNQYWNrYWdlTG9hZGVyU2VydmljZS5uYW1lKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gc3RlZWRvc0NvcmUuaW5pdChzZXR0aW5ncykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4ID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGV4KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgZSA9IGVycm9yO1xuICBjb25zb2xlLmVycm9yKFwiZXJyb3I6XCIsIGUpO1xufVxuIiwiQ3JlYXRvci5kZXBzID0ge1xuXHRhcHA6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcblx0b2JqZWN0OiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5XG59O1xuXG5DcmVhdG9yLl9URU1QTEFURSA9IHtcblx0QXBwczoge30sXG5cdE9iamVjdHM6IHt9XG59XG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtmaWx0ZXJzRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKX0pXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpfSlcblxuIyBDcmVhdG9yLmZpYmVyTG9hZE9iamVjdHMg5L6bc3RlZWRvcy1jbGnpobnnm67kvb/nlKhcbmlmIE1ldGVvci5pc1NlcnZlclxuXHRGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpXG5cdENyZWF0b3IuZmliZXJMb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XG5cdFx0RmliZXIoKCktPlxuXHRcdFx0Q3JlYXRvci5sb2FkT2JqZWN0cyhvYmosIG9iamVjdF9uYW1lKVxuXHRcdCkucnVuKClcblxuQ3JlYXRvci5sb2FkT2JqZWN0cyA9IChvYmosIG9iamVjdF9uYW1lKS0+XG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gb2JqLm5hbWVcblxuXHRpZiAhb2JqLmxpc3Rfdmlld3Ncblx0XHRvYmoubGlzdF92aWV3cyA9IHt9XG5cblx0aWYgb2JqLnNwYWNlXG5cdFx0b2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iailcblx0aWYgb2JqZWN0X25hbWUgPT0gJ2Nmc19maWxlc19maWxlcmVjb3JkJ1xuXHRcdG9iamVjdF9uYW1lID0gJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ1xuXHRcdG9iaiA9IF8uY2xvbmUob2JqKVxuXHRcdG9iai5uYW1lID0gb2JqZWN0X25hbWVcblx0XHRDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdID0gb2JqXG5cblx0Q3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iailcblx0bmV3IENyZWF0b3IuT2JqZWN0KG9iaik7XG5cblx0Q3JlYXRvci5pbml0VHJpZ2dlcnMob2JqZWN0X25hbWUpXG5cdENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSlcblx0cmV0dXJuIG9ialxuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSAob2JqZWN0KSAtPlxuXHRpZiBvYmplY3Quc3BhY2Vcblx0XHRyZXR1cm4gXCJjXyN7b2JqZWN0LnNwYWNlfV8je29iamVjdC5uYW1lfVwiXG5cdHJldHVybiBvYmplY3QubmFtZVxuXG5DcmVhdG9yLmdldE9iamVjdCA9IChvYmplY3RfbmFtZSwgc3BhY2VfaWQpLT5cblx0aWYgXy5pc0FycmF5KG9iamVjdF9uYW1lKVxuXHRcdHJldHVybiA7XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdENyZWF0b3IuZGVwcz8ub2JqZWN0Py5kZXBlbmQoKVxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG4jXHRpZiAhc3BhY2VfaWQgJiYgb2JqZWN0X25hbWVcbiNcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50ICYmICFvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjXycpXG4jXHRcdFx0c3BhY2VfaWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblxuXHRpZiBvYmplY3RfbmFtZVxuI1x0XHRpZiBzcGFjZV9pZFxuI1x0XHRcdG9iaiA9IENyZWF0b3Iub2JqZWN0c0J5TmFtZVtcImNfI3tzcGFjZV9pZH1fI3tvYmplY3RfbmFtZX1cIl1cbiNcdFx0XHRpZiBvYmpcbiNcdFx0XHRcdHJldHVybiBvYmpcbiNcbiNcdFx0b2JqID0gXy5maW5kIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG8pLT5cbiNcdFx0XHRcdHJldHVybiBvLl9jb2xsZWN0aW9uX25hbWUgPT0gb2JqZWN0X25hbWVcbiNcdFx0aWYgb2JqXG4jXHRcdFx0cmV0dXJuIG9ialxuXG5cdFx0cmV0dXJuIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gKG9iamVjdF9pZCktPlxuXHRyZXR1cm4gXy5maW5kV2hlcmUoQ3JlYXRvci5vYmplY3RzQnlOYW1lLCB7X2lkOiBvYmplY3RfaWR9KVxuXG5DcmVhdG9yLnJlbW92ZU9iamVjdCA9IChvYmplY3RfbmFtZSktPlxuXHRjb25zb2xlLmxvZyhcInJlbW92ZU9iamVjdFwiLCBvYmplY3RfbmFtZSlcblx0ZGVsZXRlIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV1cblx0ZGVsZXRlIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkKS0+XG5cdGlmICFvYmplY3RfbmFtZVxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXHRpZiBvYmplY3RfbmFtZVxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW0NyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKT8uX2NvbGxlY3Rpb25fbmFtZSB8fCBvYmplY3RfbmFtZV1cblxuQ3JlYXRvci5yZW1vdmVDb2xsZWN0aW9uID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlbGV0ZSBDcmVhdG9yLkNvbGxlY3Rpb25zW29iamVjdF9uYW1lXVxuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRpZiAhdXNlcklkXG5cdFx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblxuXHRzcGFjZSA9IENyZWF0b3IuZ2V0T2JqZWN0KFwic3BhY2VzXCIpPy5kYj8uZmluZE9uZShzcGFjZUlkLHtmaWVsZHM6e2FkbWluczoxfX0pXG5cdGlmIHNwYWNlPy5hZG1pbnNcblx0XHRyZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwXG5cblxuQ3JlYXRvci5ldmFsdWF0ZUZvcm11bGEgPSAoZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpLT5cblxuXHRpZiAhXy5pc1N0cmluZyhmb3JtdWxhcilcblx0XHRyZXR1cm4gZm9ybXVsYXJcblxuXHRpZiBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmb3JtdWxhcilcblx0XHRyZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpXG5cblx0cmV0dXJuIGZvcm11bGFyXG5cbkNyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzID0gKGZpbHRlcnMsIGNvbnRleHQpLT5cblx0c2VsZWN0b3IgPSB7fVxuXHRfLmVhY2ggZmlsdGVycywgKGZpbHRlciktPlxuXHRcdGlmIGZpbHRlcj8ubGVuZ3RoID09IDNcblx0XHRcdG5hbWUgPSBmaWx0ZXJbMF1cblx0XHRcdGFjdGlvbiA9IGZpbHRlclsxXVxuXHRcdFx0dmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpXG5cdFx0XHRzZWxlY3RvcltuYW1lXSA9IHt9XG5cdFx0XHRzZWxlY3RvcltuYW1lXVthY3Rpb25dID0gdmFsdWVcblx0IyBjb25zb2xlLmxvZyhcImV2YWx1YXRlRmlsdGVycy0tPnNlbGVjdG9yXCIsIHNlbGVjdG9yKVxuXHRyZXR1cm4gc2VsZWN0b3JcblxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gKHNwYWNlSWQpIC0+XG5cdHJldHVybiBzcGFjZUlkID09ICdjb21tb24nXG5cbiMjI1xuXHRkb2Nz77ya5b6F5o6S5bqP55qE5paH5qGj5pWw57uEXG5cdGlkc++8ml9pZOmbhuWQiFxuXHRpZF9rZXk6IOm7mOiupOS4ul9pZFxuXHRyZXR1cm4g5oyJ54WnaWRz55qE6aG65bqP6L+U5Zue5paw55qE5paH5qGj6ZuG5ZCIXG4jIyNcbkNyZWF0b3IuZ2V0T3JkZXJseVNldEJ5SWRzID0gKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpLT5cblxuXHRpZiAhaWRfa2V5XG5cdFx0aWRfa2V5ID0gXCJfaWRcIlxuXG5cdGlmIGhpdF9maXJzdFxuXG5cdFx0I+eUseS6juS4jeiDveS9v+eUqF8uZmluZEluZGV45Ye95pWw77yM5Zug5q2k5q2k5aSE5YWI5bCG5a+56LGh5pWw57uE6L2s5Li65pmu6YCa5pWw57uE57G75Z6L77yM5Zyo6I635Y+W5YW2aW5kZXhcblx0XHR2YWx1ZXMgPSBkb2NzLmdldFByb3BlcnR5KGlkX2tleSlcblxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0XHRcdF9pbmRleCA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXHRcdFx0XHRcdGlmIF9pbmRleCA+IC0xXG5cdFx0XHRcdFx0XHRyZXR1cm4gX2luZGV4XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSlcblx0ZWxzZVxuXHRcdHJldHVyblx0Xy5zb3J0QnkgZG9jcywgKGRvYyktPlxuXHRcdFx0cmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKVxuXG4jIyNcblx05oyJ55So5oi35omA5bGe5pys5Zyw5YyW6K+t6KiA6L+b6KGM5o6S5bqP77yM5pSv5oyB5Lit5paH44CB5pWw5YC844CB5pel5pyf562J5a2X5q615o6S5bqPXG5cdOWvueS6jk9iamVjdOexu+Wei++8jOWmguaenOaPkOS+m+S9nOeUqOWfn+S4rWtleeWxnuaAp++8jOWImeWPluWAvOS4unZhbHVlW2tleV3ov5vooYzmjpLluo/mr5TovoPvvIzlj43kuYvmlbTkuKpPYmplY3QudG9TdHJpbmcoKeWQjuaOkuW6j+avlOi+g1xuIyMjXG5DcmVhdG9yLnNvcnRpbmdNZXRob2QgPSAodmFsdWUxLCB2YWx1ZTIpIC0+XG5cdGlmIHRoaXMua2V5XG5cdFx0dmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XVxuXHRcdHZhbHVlMiA9IHZhbHVlMlt0aGlzLmtleV1cblx0aWYgdmFsdWUxIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMSA9IHZhbHVlMS5nZXRUaW1lKClcblx0aWYgdmFsdWUyIGluc3RhbmNlb2YgRGF0ZVxuXHRcdHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKClcblx0aWYgdHlwZW9mIHZhbHVlMSBpcyBcIm51bWJlclwiIGFuZCB0eXBlb2YgdmFsdWUyIGlzIFwibnVtYmVyXCJcblx0XHRyZXR1cm4gdmFsdWUxIC0gdmFsdWUyXG5cdCMgSGFuZGxpbmcgbnVsbCB2YWx1ZXNcblx0aXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PSBudWxsIG9yIHZhbHVlMSA9PSB1bmRlZmluZWRcblx0aXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PSBudWxsIG9yIHZhbHVlMiA9PSB1bmRlZmluZWRcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgIWlzVmFsdWUyRW1wdHlcblx0XHRyZXR1cm4gLTFcblx0aWYgaXNWYWx1ZTFFbXB0eSBhbmQgaXNWYWx1ZTJFbXB0eVxuXHRcdHJldHVybiAwXG5cdGlmICFpc1ZhbHVlMUVtcHR5IGFuZCBpc1ZhbHVlMkVtcHR5XG5cdFx0cmV0dXJuIDFcblx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxuXHRyZXR1cm4gdmFsdWUxLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSB2YWx1ZTIudG9TdHJpbmcoKSwgbG9jYWxlXG5cblxuIyDor6Xlh73mlbDlj6rlnKjliJ3lp4vljJZPYmplY3Tml7bvvIzmiornm7jlhbPlr7nosaHnmoTorqHnrpfnu5Pmnpzkv53lrZjliLBPYmplY3TnmoRyZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3vvIzlkI7nu63lj6/ku6Xnm7TmjqXku45yZWxhdGVkX29iamVjdHPlsZ7mgKfkuK3lj5blvpforqHnrpfnu5PmnpzogIzkuI3nlKjlho3mrKHosIPnlKjor6Xlh73mlbDmnaXorqHnrpdcbkNyZWF0b3IuZ2V0T2JqZWN0UmVsYXRlZHMgPSAob2JqZWN0X25hbWUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRyZWxhdGVkX29iamVjdHMgPSBbXVxuXHQjIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0IyDlm6BDcmVhdG9yLmdldE9iamVjdOWHveaVsOWGhemDqOimgeiwg+eUqOivpeWHveaVsO+8jOaJgOS7pei/memHjOS4jeWPr+S7peiwg+eUqENyZWF0b3IuZ2V0T2JqZWN05Y+W5a+56LGh77yM5Y+q6IO96LCD55SoQ3JlYXRvci5PYmplY3Rz5p2l5Y+W5a+56LGhXG5cdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdXG5cdGlmICFfb2JqZWN0XG5cdFx0cmV0dXJuIHJlbGF0ZWRfb2JqZWN0c1xuXHRcblx0cmVsYXRlZExpc3QgPSBfb2JqZWN0LnJlbGF0ZWRMaXN0XG5cdGlmIE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5IHJlbGF0ZWRMaXN0XG5cdFx0cmVsYXRlZExpc3RNYXAgPSB7fVxuXHRcdF8uZWFjaCByZWxhdGVkTGlzdCwgKG9iak5hbWUpLT5cblx0XHRcdGlmIF8uaXNPYmplY3Qgb2JqTmFtZVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtvYmpOYW1lLm9iamVjdE5hbWVdID0ge31cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbb2JqTmFtZV0gPSB7fVxuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChyZWxhdGVkX29iamVjdCwgcmVsYXRlZF9vYmplY3RfbmFtZSktPlxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxuXHRcdFx0XHRpZiAocmVsYXRlZF9maWVsZC50eXBlID09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gYW5kIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09IG9iamVjdF9uYW1lIGFuZCByZWxhdGVkTGlzdE1hcFtyZWxhdGVkX29iamVjdF9uYW1lXVxuXHRcdFx0XHRcdHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0geyBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSwgZm9yZWlnbl9rZXk6IHJlbGF0ZWRfZmllbGRfbmFtZSwgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydjbXNfZmlsZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddID0geyBvYmplY3RfbmFtZTogXCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCIgfVxuXHRcdGlmIHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXVxuXHRcdFx0cmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0geyBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIiwgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiIH1cblx0XHRfLmVhY2ggWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIChlbmFibGVPYmpOYW1lKS0+XG5cdFx0XHRpZiByZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXVxuXHRcdFx0XHRyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSA9IHsgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0aWYgcmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXVxuXHRcdFx0I3JlY29yZCDor6bnu4bkuIvnmoRhdWRpdF9yZWNvcmRz5LuFbW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWPr+ingVxuXHRcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdFx0aWYgX29iamVjdC5lbmFibGVfYXVkaXQgJiYgcGVybWlzc2lvbnM/Lm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0cmVsYXRlZExpc3RNYXBbJ2F1ZGl0X3JlY29yZHMnXSA9IHsgb2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIiB9XG5cdFx0cmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMgcmVsYXRlZExpc3RNYXBcblx0XHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cblx0aWYgX29iamVjdC5lbmFibGVfZmlsZXNcblx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJjbXNfZmlsZXNcIiwgZm9yZWlnbl9rZXk6IFwicGFyZW50XCJ9XG5cblx0Xy5lYWNoIENyZWF0b3IuT2JqZWN0cywgKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKS0+XG5cdFx0Xy5lYWNoIHJlbGF0ZWRfb2JqZWN0LmZpZWxkcywgKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgKHJlbGF0ZWRfZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiB8fCAocmVsYXRlZF9maWVsZC50eXBlID09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpIGFuZCByZWxhdGVkX2ZpZWxkLnJlZmVyZW5jZV90byBhbmQgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT0gb2JqZWN0X25hbWVcblx0XHRcdFx0aWYgcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcIm9iamVjdF9maWVsZHNcIlxuXHRcdFx0XHRcdCNUT0RPIOW+heebuOWFs+WIl+ihqOaUr+aMgeaOkuW6j+WQju+8jOWIoOmZpOatpOWIpOaWrVxuXHRcdFx0XHRcdHJlbGF0ZWRfb2JqZWN0cy5zcGxpY2UoMCwgMCwge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWV9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOnJlbGF0ZWRfb2JqZWN0X25hbWUsIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWUsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiByZWxhdGVkX2ZpZWxkLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkfVxuXG5cdGlmIF9vYmplY3QuZW5hYmxlX3Rhc2tzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwidGFza3NcIiwgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wifVxuXHRpZiBfb2JqZWN0LmVuYWJsZV9ub3Rlc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcIm5vdGVzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfZXZlbnRzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiZXZlbnRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfaW5zdGFuY2VzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiaW5zdGFuY2VzXCIsIGZvcmVpZ25fa2V5OiBcInJlY29yZF9pZHNcIn1cblx0aWYgX29iamVjdC5lbmFibGVfYXBwcm92YWxzXG5cdFx0cmVsYXRlZF9vYmplY3RzLnB1c2gge29iamVjdF9uYW1lOlwiYXBwcm92YWxzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblx0aWYgX29iamVjdC5lbmFibGVfcHJvY2Vzc1xuXHRcdHJlbGF0ZWRfb2JqZWN0cy5wdXNoIHtvYmplY3RfbmFtZTpcInByb2Nlc3NfaW5zdGFuY2VfaGlzdG9yeVwiLCBmb3JlaWduX2tleTogXCJ0YXJnZXRfb2JqZWN0XCJ9XG5cdCNyZWNvcmQg6K+m57uG5LiL55qEYXVkaXRfcmVjb3Jkc+S7hW1vZGlmeUFsbFJlY29yZHPmnYPpmZDlj6/op4Fcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lKVxuXHRcdGlmIF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRyZWxhdGVkX29iamVjdHMucHVzaCB7b2JqZWN0X25hbWU6XCJhdWRpdF9yZWNvcmRzXCIsIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIn1cblxuXHRyZXR1cm4gcmVsYXRlZF9vYmplY3RzXG5cbkNyZWF0b3IuZ2V0VXNlckNvbnRleHQgPSAodXNlcklkLCBzcGFjZUlkLCBpc1VuU2FmZU1vZGUpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cmV0dXJuIENyZWF0b3IuVVNFUl9DT05URVhUXG5cdGVsc2Vcblx0XHRpZiAhKHVzZXJJZCBhbmQgc3BhY2VJZClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdHN1RmllbGRzID0ge25hbWU6IDEsIG1vYmlsZTogMSwgcG9zaXRpb246IDEsIGVtYWlsOiAxLCBjb21wYW55OiAxLCBvcmdhbml6YXRpb246IDEsIHNwYWNlOiAxLCBjb21wYW55X2lkOiAxLCBjb21wYW55X2lkczogMX1cblx0XHQjIGNoZWNrIGlmIHVzZXIgaW4gdGhlIHNwYWNlXG5cdFx0c3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHN1RmllbGRzfSlcblx0XHRpZiAhc3Vcblx0XHRcdHNwYWNlSWQgPSBudWxsXG5cblx0XHQjIGlmIHNwYWNlSWQgbm90IGV4aXN0cywgZ2V0IHRoZSBmaXJzdCBvbmUuXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdGlmIGlzVW5TYWZlTW9kZVxuXHRcdFx0XHRzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiBzdUZpZWxkc30pXG5cdFx0XHRcdGlmICFzdVxuXHRcdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHRcdHNwYWNlSWQgPSBzdS5zcGFjZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0VVNFUl9DT05URVhUID0ge31cblx0XHRVU0VSX0NPTlRFWFQudXNlcklkID0gdXNlcklkXG5cdFx0VVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkXG5cdFx0VVNFUl9DT05URVhULnVzZXIgPSB7XG5cdFx0XHRfaWQ6IHVzZXJJZFxuXHRcdFx0bmFtZTogc3UubmFtZSxcblx0XHRcdG1vYmlsZTogc3UubW9iaWxlLFxuXHRcdFx0cG9zaXRpb246IHN1LnBvc2l0aW9uLFxuXHRcdFx0ZW1haWw6IHN1LmVtYWlsXG5cdFx0XHRjb21wYW55OiBzdS5jb21wYW55XG5cdFx0XHRjb21wYW55X2lkOiBzdS5jb21wYW55X2lkXG5cdFx0XHRjb21wYW55X2lkczogc3UuY29tcGFueV9pZHNcblx0XHR9XG5cdFx0c3BhY2VfdXNlcl9vcmcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcmdhbml6YXRpb25zXCIpPy5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbilcblx0XHRpZiBzcGFjZV91c2VyX29yZ1xuXHRcdFx0VVNFUl9DT05URVhULnVzZXIub3JnYW5pemF0aW9uID0ge1xuXHRcdFx0XHRfaWQ6IHNwYWNlX3VzZXJfb3JnLl9pZCxcblx0XHRcdFx0bmFtZTogc3BhY2VfdXNlcl9vcmcubmFtZSxcblx0XHRcdFx0ZnVsbG5hbWU6IHNwYWNlX3VzZXJfb3JnLmZ1bGxuYW1lXG5cdFx0XHR9XG5cdFx0cmV0dXJuIFVTRVJfQ09OVEVYVFxuXG5DcmVhdG9yLmdldFJlbGF0aXZlVXJsID0gKHVybCktPlxuXG5cdGlmIF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAodXJsPy5zdGFydHNXaXRoKFwiL2Fzc2V0c1wiKSB8fCB1cmw/LnN0YXJ0c1dpdGgoXCJhc3NldHNcIikgfHwgdXJsPy5zdGFydHNXaXRoKFwiL3BhY2thZ2VzXCIpKVxuXHRcdGlmICEvXlxcLy8udGVzdCh1cmwpXG5cdFx0XHR1cmwgPSBcIi9cIiArIHVybFxuXHRcdHJldHVybiB1cmxcblxuXHRpZiB1cmxcblx0XHQjIHVybOW8gOWktOayoeaciVwiL1wi77yM6ZyA6KaB5re75YqgXCIvXCJcblx0XHRpZiAhL15cXC8vLnRlc3QodXJsKVxuXHRcdFx0dXJsID0gXCIvXCIgKyB1cmxcblx0XHRyZXR1cm4gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArIHVybFxuXHRlbHNlXG5cdFx0cmV0dXJuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVhcblxuQ3JlYXRvci5nZXRVc2VyQ29tcGFueUlkID0gKHVzZXJJZCwgc3BhY2VJZCktPlxuXHR1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJylcblx0ZWxzZVxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpXG5cdHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7Y29tcGFueV9pZDoxfX0pXG5cdHJldHVybiBzdS5jb21wYW55X2lkXG5cbkNyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHMgPSAodXNlcklkLCBzcGFjZUlkKS0+XG5cdHVzZXJJZCA9IHVzZXJJZCB8fCBNZXRlb3IudXNlcklkKClcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0c3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKVxuXHRlbHNlXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJylcblx0c3UgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ3NwYWNlX3VzZXJzJykuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtjb21wYW55X2lkczoxfX0pXG5cdHJldHVybiBzdT8uY29tcGFueV9pZHNcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSAocG8pLT5cblx0aWYgcG8uYWxsb3dDcmVhdGVcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdGlmIHBvLmFsbG93RWRpdFxuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8uYWxsb3dEZWxldGVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dSZWFkID0gdHJ1ZVxuXHRpZiBwby52aWV3QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsUmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0XHRwby5hbGxvd0VkaXQgPSB0cnVlXG5cdFx0cG8uYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0cG8udmlld0FsbFJlY29yZHMgPSB0cnVlXG5cdGlmIHBvLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdHBvLmFsbG93UmVhZCA9IHRydWVcblx0aWYgcG8ubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRwby5hbGxvd1JlYWQgPSB0cnVlXG5cdFx0cG8uYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdHBvLmFsbG93RGVsZXRlID0gdHJ1ZVxuXHRcdHBvLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblx0XHRcblx0IyDlpoLmnpzpmYTku7bnm7jlhbPmnYPpmZDphY3nva7kuLrnqbrvvIzliJnlhbzlrrnkuYvliY3msqHmnInpmYTku7bmnYPpmZDphY3nva7ml7bnmoTop4TliJlcblx0aWYgcG8uYWxsb3dSZWFkXG5cdFx0dHlwZW9mIHBvLmFsbG93UmVhZEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby52aWV3QWxsRmlsZXMgIT0gXCJib29sZWFuXCIgJiYgcG8udmlld0FsbEZpbGVzID0gdHJ1ZVxuXHRpZiBwby5hbGxvd0VkaXRcblx0XHR0eXBlb2YgcG8uYWxsb3dDcmVhdGVGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0NyZWF0ZUZpbGVzID0gdHJ1ZVxuXHRcdHR5cGVvZiBwby5hbGxvd0VkaXRGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHR0eXBlb2YgcG8uYWxsb3dEZWxldGVGaWxlcyAhPSBcImJvb2xlYW5cIiAmJiBwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZVxuXHRpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0dHlwZW9mIHBvLm1vZGlmeUFsbEZpbGVzICE9IFwiYm9vbGVhblwiICYmIHBvLm1vZGlmeUFsbEZpbGVzID0gdHJ1ZVxuXG5cdGlmIHBvLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dFZGl0RmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8uYWxsb3dEZWxldGVGaWxlc1xuXHRcdHBvLmFsbG93RWRpdEZpbGVzID0gdHJ1ZVxuXHRcdHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZVxuXHRpZiBwby52aWV3QWxsRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0aWYgcG8ubW9kaWZ5QWxsRmlsZXNcblx0XHRwby5hbGxvd1JlYWRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd0VkaXRGaWxlcyA9IHRydWVcblx0XHRwby5hbGxvd0RlbGV0ZUZpbGVzID0gdHJ1ZVxuXHRcdHBvLnZpZXdBbGxGaWxlcyA9IHRydWVcblxuXHRyZXR1cm4gcG9cblxuQ3JlYXRvci5nZXRUZW1wbGF0ZVNwYWNlSWQgPSAoKS0+XG5cdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWRcblxuQ3JlYXRvci5nZXRDbG91ZEFkbWluU3BhY2VJZCA9ICgpLT5cblx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LmNsb3VkQWRtaW5TcGFjZUlkXG5cbkNyZWF0b3IuaXNUZW1wbGF0ZVNwYWNlID0gKHNwYWNlSWQpLT5cblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy50ZW1wbGF0ZVNwYWNlSWQgPT0gc3BhY2VJZFxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gKHNwYWNlSWQpLT5cblx0aWYgc3BhY2VJZCAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5jbG91ZEFkbWluU3BhY2VJZCA9PSBzcGFjZUlkXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyID0gcHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUlxuXHQiLCJ2YXIgRmliZXI7XG5cbkNyZWF0b3IuZGVwcyA9IHtcbiAgYXBwOiBuZXcgVHJhY2tlci5EZXBlbmRlbmN5LFxuICBvYmplY3Q6IG5ldyBUcmFja2VyLkRlcGVuZGVuY3lcbn07XG5cbkNyZWF0b3IuX1RFTVBMQVRFID0ge1xuICBBcHBzOiB7fSxcbiAgT2JqZWN0czoge31cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7XG4gICAgZmlsdGVyc0Z1bmN0aW9uOiBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihGdW5jdGlvbiwgU3RyaW5nKSlcbiAgfSk7XG4gIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBvcHRpb25zRnVuY3Rpb246IE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBTdHJpbmcpKVxuICB9KTtcbiAgcmV0dXJuIFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtcbiAgICBjcmVhdGVGdW5jdGlvbjogTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoRnVuY3Rpb24sIFN0cmluZykpXG4gIH0pO1xufSk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcbiAgQ3JlYXRvci5maWJlckxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICAgIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmxvYWRPYmplY3RzKG9iaiwgb2JqZWN0X25hbWUpO1xuICAgIH0pLnJ1bigpO1xuICB9O1xufVxuXG5DcmVhdG9yLmxvYWRPYmplY3RzID0gZnVuY3Rpb24ob2JqLCBvYmplY3RfbmFtZSkge1xuICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgb2JqZWN0X25hbWUgPSBvYmoubmFtZTtcbiAgfVxuICBpZiAoIW9iai5saXN0X3ZpZXdzKSB7XG4gICAgb2JqLmxpc3Rfdmlld3MgPSB7fTtcbiAgfVxuICBpZiAob2JqLnNwYWNlKSB7XG4gICAgb2JqZWN0X25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iaik7XG4gIH1cbiAgaWYgKG9iamVjdF9uYW1lID09PSAnY2ZzX2ZpbGVzX2ZpbGVyZWNvcmQnKSB7XG4gICAgb2JqZWN0X25hbWUgPSAnY2ZzLmZpbGVzLmZpbGVyZWNvcmQnO1xuICAgIG9iaiA9IF8uY2xvbmUob2JqKTtcbiAgICBvYmoubmFtZSA9IG9iamVjdF9uYW1lO1xuICAgIENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0gPSBvYmo7XG4gIH1cbiAgQ3JlYXRvci5jb252ZXJ0T2JqZWN0KG9iaik7XG4gIG5ldyBDcmVhdG9yLk9iamVjdChvYmopO1xuICBDcmVhdG9yLmluaXRUcmlnZ2VycyhvYmplY3RfbmFtZSk7XG4gIENyZWF0b3IuaW5pdExpc3RWaWV3cyhvYmplY3RfbmFtZSk7XG4gIHJldHVybiBvYmo7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE5hbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdC5zcGFjZSkge1xuICAgIHJldHVybiBcImNfXCIgKyBvYmplY3Quc3BhY2UgKyBcIl9cIiArIG9iamVjdC5uYW1lO1xuICB9XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuZ2V0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKSB7XG4gIHZhciByZWYsIHJlZjE7XG4gIGlmIChfLmlzQXJyYXkob2JqZWN0X25hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoKHJlZiA9IENyZWF0b3IuZGVwcykgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWYxID0gcmVmLm9iamVjdCkgIT0gbnVsbCkge1xuICAgICAgICByZWYxLmRlcGVuZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIW9iamVjdF9uYW1lICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5vYmplY3RzQnlOYW1lW29iamVjdF9uYW1lXTtcbiAgfVxufTtcblxuQ3JlYXRvci5nZXRPYmplY3RCeUlkID0gZnVuY3Rpb24ob2JqZWN0X2lkKSB7XG4gIHJldHVybiBfLmZpbmRXaGVyZShDcmVhdG9yLm9iamVjdHNCeU5hbWUsIHtcbiAgICBfaWQ6IG9iamVjdF9pZFxuICB9KTtcbn07XG5cbkNyZWF0b3IucmVtb3ZlT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgY29uc29sZS5sb2coXCJyZW1vdmVPYmplY3RcIiwgb2JqZWN0X25hbWUpO1xuICBkZWxldGUgQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXTtcbiAgcmV0dXJuIGRlbGV0ZSBDcmVhdG9yLm9iamVjdHNCeU5hbWVbb2JqZWN0X25hbWVdO1xufTtcblxuQ3JlYXRvci5nZXRDb2xsZWN0aW9uID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlSWQpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKCFvYmplY3RfbmFtZSkge1xuICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgfVxuICBpZiAob2JqZWN0X25hbWUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1soKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5fY29sbGVjdGlvbl9uYW1lIDogdm9pZCAwKSB8fCBvYmplY3RfbmFtZV07XG4gIH1cbn07XG5cbkNyZWF0b3IucmVtb3ZlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBkZWxldGUgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV07XG59O1xuXG5DcmVhdG9yLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICB2YXIgcmVmLCByZWYxLCBzcGFjZTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICB9XG4gIH1cbiAgc3BhY2UgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QoXCJzcGFjZXNcIikpICE9IG51bGwgPyAocmVmMSA9IHJlZi5kYikgIT0gbnVsbCA/IHJlZjEuZmluZE9uZShzcGFjZUlkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhZG1pbnM6IDFcbiAgICB9XG4gIH0pIDogdm9pZCAwIDogdm9pZCAwO1xuICBpZiAoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmFkbWlucyA6IHZvaWQgMCkge1xuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuZXZhbHVhdGVGb3JtdWxhID0gZnVuY3Rpb24oZm9ybXVsYXIsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgaWYgKCFfLmlzU3RyaW5nKGZvcm11bGFyKSkge1xuICAgIHJldHVybiBmb3JtdWxhcjtcbiAgfVxuICBpZiAoQ3JlYXRvci5Gb3JtdWxhci5jaGVja0Zvcm11bGEoZm9ybXVsYXIpKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZvcm11bGFyLCBjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gZm9ybXVsYXI7XG59O1xuXG5DcmVhdG9yLmV2YWx1YXRlRmlsdGVycyA9IGZ1bmN0aW9uKGZpbHRlcnMsIGNvbnRleHQpIHtcbiAgdmFyIHNlbGVjdG9yO1xuICBzZWxlY3RvciA9IHt9O1xuICBfLmVhY2goZmlsdGVycywgZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGFjdGlvbiwgbmFtZSwgdmFsdWU7XG4gICAgaWYgKChmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5sZW5ndGggOiB2b2lkIDApID09PSAzKSB7XG4gICAgICBuYW1lID0gZmlsdGVyWzBdO1xuICAgICAgYWN0aW9uID0gZmlsdGVyWzFdO1xuICAgICAgdmFsdWUgPSBDcmVhdG9yLmV2YWx1YXRlRm9ybXVsYShmaWx0ZXJbMl0sIGNvbnRleHQpO1xuICAgICAgc2VsZWN0b3JbbmFtZV0gPSB7fTtcbiAgICAgIHJldHVybiBzZWxlY3RvcltuYW1lXVthY3Rpb25dID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufTtcblxuQ3JlYXRvci5pc0NvbW1vblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICByZXR1cm4gc3BhY2VJZCA9PT0gJ2NvbW1vbic7XG59O1xuXG5cbi8qXG5cdGRvY3PvvJrlvoXmjpLluo/nmoTmlofmoaPmlbDnu4Rcblx0aWRz77yaX2lk6ZuG5ZCIXG5cdGlkX2tleTog6buY6K6k5Li6X2lkXG5cdHJldHVybiDmjInnhadpZHPnmoTpobrluo/ov5Tlm57mlrDnmoTmlofmoaPpm4blkIhcbiAqL1xuXG5DcmVhdG9yLmdldE9yZGVybHlTZXRCeUlkcyA9IGZ1bmN0aW9uKGRvY3MsIGlkcywgaWRfa2V5LCBoaXRfZmlyc3QpIHtcbiAgdmFyIHZhbHVlcztcbiAgaWYgKCFpZF9rZXkpIHtcbiAgICBpZF9rZXkgPSBcIl9pZFwiO1xuICB9XG4gIGlmIChoaXRfZmlyc3QpIHtcbiAgICB2YWx1ZXMgPSBkb2NzLmdldFByb3BlcnR5KGlkX2tleSk7XG4gICAgcmV0dXJuIF8uc29ydEJ5KGRvY3MsIGZ1bmN0aW9uKGRvYykge1xuICAgICAgdmFyIF9pbmRleDtcbiAgICAgIF9pbmRleCA9IGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKTtcbiAgICAgIGlmIChfaW5kZXggPiAtMSkge1xuICAgICAgICByZXR1cm4gX2luZGV4O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGlkcy5sZW5ndGggKyBfLmluZGV4T2YodmFsdWVzLCBkb2NbaWRfa2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF8uc29ydEJ5KGRvY3MsIGZ1bmN0aW9uKGRvYykge1xuICAgICAgcmV0dXJuIGlkcy5pbmRleE9mKGRvY1tpZF9rZXldKTtcbiAgICB9KTtcbiAgfVxufTtcblxuXG4vKlxuXHTmjInnlKjmiLfmiYDlsZ7mnKzlnLDljJbor63oqIDov5vooYzmjpLluo/vvIzmlK/mjIHkuK3mlofjgIHmlbDlgLzjgIHml6XmnJ/nrYnlrZfmrrXmjpLluo9cblx05a+55LqOT2JqZWN057G75Z6L77yM5aaC5p6c5o+Q5L6b5L2c55So5Z+f5Lita2V55bGe5oCn77yM5YiZ5Y+W5YC85Li6dmFsdWVba2V5Xei/m+ihjOaOkuW6j+avlOi+g++8jOWPjeS5i+aVtOS4qk9iamVjdC50b1N0cmluZygp5ZCO5o6S5bqP5q+U6L6DXG4gKi9cblxuQ3JlYXRvci5zb3J0aW5nTWV0aG9kID0gZnVuY3Rpb24odmFsdWUxLCB2YWx1ZTIpIHtcbiAgdmFyIGlzVmFsdWUxRW1wdHksIGlzVmFsdWUyRW1wdHksIGxvY2FsZTtcbiAgaWYgKHRoaXMua2V5KSB7XG4gICAgdmFsdWUxID0gdmFsdWUxW3RoaXMua2V5XTtcbiAgICB2YWx1ZTIgPSB2YWx1ZTJbdGhpcy5rZXldO1xuICB9XG4gIGlmICh2YWx1ZTEgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgdmFsdWUxID0gdmFsdWUxLmdldFRpbWUoKTtcbiAgfVxuICBpZiAodmFsdWUyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhbHVlMiA9IHZhbHVlMi5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZTEgPT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHZhbHVlMiA9PT0gXCJudW1iZXJcIikge1xuICAgIHJldHVybiB2YWx1ZTEgLSB2YWx1ZTI7XG4gIH1cbiAgaXNWYWx1ZTFFbXB0eSA9IHZhbHVlMSA9PT0gbnVsbCB8fCB2YWx1ZTEgPT09IHZvaWQgMDtcbiAgaXNWYWx1ZTJFbXB0eSA9IHZhbHVlMiA9PT0gbnVsbCB8fCB2YWx1ZTIgPT09IHZvaWQgMDtcbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgIWlzVmFsdWUyRW1wdHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKGlzVmFsdWUxRW1wdHkgJiYgaXNWYWx1ZTJFbXB0eSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGlmICghaXNWYWx1ZTFFbXB0eSAmJiBpc1ZhbHVlMkVtcHR5KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgcmV0dXJuIHZhbHVlMS50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUodmFsdWUyLnRvU3RyaW5nKCksIGxvY2FsZSk7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIF9vYmplY3QsIHBlcm1pc3Npb25zLCByZWxhdGVkTGlzdCwgcmVsYXRlZExpc3RNYXAsIHJlbGF0ZWRfb2JqZWN0cztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gIH1cbiAgcmVsYXRlZF9vYmplY3RzID0gW107XG4gIF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdO1xuICBpZiAoIV9vYmplY3QpIHtcbiAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xuICB9XG4gIHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhXy5pc0VtcHR5KHJlbGF0ZWRMaXN0KSkge1xuICAgIHJlbGF0ZWRMaXN0TWFwID0ge307XG4gICAgXy5lYWNoKHJlbGF0ZWRMaXN0LCBmdW5jdGlvbihvYmpOYW1lKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChvYmpOYW1lKSkge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbb2JqTmFtZS5vYmplY3ROYW1lXSA9IHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW29iak5hbWVdID0ge307XG4gICAgICB9XG4gICAgfSk7XG4gICAgXy5lYWNoKENyZWF0b3IuT2JqZWN0cywgZnVuY3Rpb24ocmVsYXRlZF9vYmplY3QsIHJlbGF0ZWRfb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybiBfLmVhY2gocmVsYXRlZF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihyZWxhdGVkX2ZpZWxkLCByZWxhdGVkX2ZpZWxkX25hbWUpIHtcbiAgICAgICAgaWYgKChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IHJlbGF0ZWRfZmllbGQudHlwZSA9PT0gXCJsb29rdXBcIikgJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gJiYgcmVsYXRlZF9maWVsZC5yZWZlcmVuY2VfdG8gPT09IG9iamVjdF9uYW1lICYmIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TWFwW3JlbGF0ZWRfb2JqZWN0X25hbWVdID0ge1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVsYXRlZExpc3RNYXBbJ2Ntc19maWxlcyddKSB7XG4gICAgICByZWxhdGVkTGlzdE1hcFsnY21zX2ZpbGVzJ10gPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiBcImNtc19maWxlc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydpbnN0YW5jZXMnXSkge1xuICAgICAgcmVsYXRlZExpc3RNYXBbJ2luc3RhbmNlcyddID0ge1xuICAgICAgICBvYmplY3RfbmFtZTogXCJpbnN0YW5jZXNcIixcbiAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVjb3JkX2lkc1wiXG4gICAgICB9O1xuICAgIH1cbiAgICBfLmVhY2goWyd0YXNrcycsICdub3RlcycsICdldmVudHMnLCAnYXBwcm92YWxzJ10sIGZ1bmN0aW9uKGVuYWJsZU9iak5hbWUpIHtcbiAgICAgIGlmIChyZWxhdGVkTGlzdE1hcFtlbmFibGVPYmpOYW1lXSkge1xuICAgICAgICByZXR1cm4gcmVsYXRlZExpc3RNYXBbZW5hYmxlT2JqTmFtZV0gPSB7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IGVuYWJsZU9iak5hbWUsXG4gICAgICAgICAgZm9yZWlnbl9rZXk6IFwicmVsYXRlZF90b1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0TWFwWydhdWRpdF9yZWNvcmRzJ10pIHtcbiAgICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoX29iamVjdC5lbmFibGVfYXVkaXQgJiYgKHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwKSkge1xuICAgICAgICByZWxhdGVkTGlzdE1hcFsnYXVkaXRfcmVjb3JkcyddID0ge1xuICAgICAgICAgIG9iamVjdF9uYW1lOiBcImF1ZGl0X3JlY29yZHNcIixcbiAgICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVsYXRlZF9vYmplY3RzID0gXy52YWx1ZXMocmVsYXRlZExpc3RNYXApO1xuICAgIHJldHVybiByZWxhdGVkX29iamVjdHM7XG4gIH1cbiAgaWYgKF9vYmplY3QuZW5hYmxlX2ZpbGVzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiY21zX2ZpbGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJwYXJlbnRcIlxuICAgIH0pO1xuICB9XG4gIF8uZWFjaChDcmVhdG9yLk9iamVjdHMsIGZ1bmN0aW9uKHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIF8uZWFjaChyZWxhdGVkX29iamVjdC5maWVsZHMsIGZ1bmN0aW9uKHJlbGF0ZWRfZmllbGQsIHJlbGF0ZWRfZmllbGRfbmFtZSkge1xuICAgICAgaWYgKChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibWFzdGVyX2RldGFpbFwiIHx8IChyZWxhdGVkX2ZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgJiYgcmVsYXRlZF9maWVsZC5yZWxhdGVkTGlzdCkpICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvICYmIHJlbGF0ZWRfZmllbGQucmVmZXJlbmNlX3RvID09PSBvYmplY3RfbmFtZSkge1xuICAgICAgICBpZiAocmVsYXRlZF9vYmplY3RfbmFtZSA9PT0gXCJvYmplY3RfZmllbGRzXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnNwbGljZSgwLCAwLCB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVsYXRlZF9vYmplY3RfbmFtZSxcbiAgICAgICAgICAgIGZvcmVpZ25fa2V5OiByZWxhdGVkX2ZpZWxkX25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgICAgICAgb2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWUsXG4gICAgICAgICAgICBmb3JlaWduX2tleTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQ6IHJlbGF0ZWRfZmllbGQud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgaWYgKF9vYmplY3QuZW5hYmxlX3Rhc2tzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwidGFza3NcIixcbiAgICAgIGZvcmVpZ25fa2V5OiBcInJlbGF0ZWRfdG9cIlxuICAgIH0pO1xuICB9XG4gIGlmIChfb2JqZWN0LmVuYWJsZV9ub3Rlcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcIm5vdGVzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfZXZlbnRzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiZXZlbnRzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfaW5zdGFuY2VzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiaW5zdGFuY2VzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWNvcmRfaWRzXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfYXBwcm92YWxzKSB7XG4gICAgcmVsYXRlZF9vYmplY3RzLnB1c2goe1xuICAgICAgb2JqZWN0X25hbWU6IFwiYXBwcm92YWxzXCIsXG4gICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICB9KTtcbiAgfVxuICBpZiAoX29iamVjdC5lbmFibGVfcHJvY2Vzcykge1xuICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgIG9iamVjdF9uYW1lOiBcInByb2Nlc3NfaW5zdGFuY2VfaGlzdG9yeVwiLFxuICAgICAgZm9yZWlnbl9rZXk6IFwidGFyZ2V0X29iamVjdFwiXG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSk7XG4gICAgaWYgKF9vYmplY3QuZW5hYmxlX2F1ZGl0ICYmIChwZXJtaXNzaW9ucyAhPSBudWxsID8gcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyA6IHZvaWQgMCkpIHtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0cy5wdXNoKHtcbiAgICAgICAgb2JqZWN0X25hbWU6IFwiYXVkaXRfcmVjb3Jkc1wiLFxuICAgICAgICBmb3JlaWduX2tleTogXCJyZWxhdGVkX3RvXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVsYXRlZF9vYmplY3RzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyQ29udGV4dCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgaXNVblNhZmVNb2RlKSB7XG4gIHZhciBVU0VSX0NPTlRFWFQsIHJlZiwgc3BhY2VfdXNlcl9vcmcsIHN1LCBzdUZpZWxkcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiBDcmVhdG9yLlVTRVJfQ09OVEVYVDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoISh1c2VySWQgJiYgc3BhY2VJZCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcInRoZSBwYXJhbXMgdXNlcklkIGFuZCBzcGFjZUlkIGlzIHJlcXVpcmVkIGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRVc2VyQ29udGV4dFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBzdUZpZWxkcyA9IHtcbiAgICAgIG5hbWU6IDEsXG4gICAgICBtb2JpbGU6IDEsXG4gICAgICBwb3NpdGlvbjogMSxcbiAgICAgIGVtYWlsOiAxLFxuICAgICAgY29tcGFueTogMSxcbiAgICAgIG9yZ2FuaXphdGlvbjogMSxcbiAgICAgIHNwYWNlOiAxLFxuICAgICAgY29tcGFueV9pZDogMSxcbiAgICAgIGNvbXBhbnlfaWRzOiAxXG4gICAgfTtcbiAgICBzdSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiBzdUZpZWxkc1xuICAgIH0pO1xuICAgIGlmICghc3UpIHtcbiAgICAgIHNwYWNlSWQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIGlmIChpc1VuU2FmZU1vZGUpIHtcbiAgICAgICAgc3UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHN1RmllbGRzXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXN1KSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3BhY2VJZCA9IHN1LnNwYWNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIFVTRVJfQ09OVEVYVCA9IHt9O1xuICAgIFVTRVJfQ09OVEVYVC51c2VySWQgPSB1c2VySWQ7XG4gICAgVVNFUl9DT05URVhULnNwYWNlSWQgPSBzcGFjZUlkO1xuICAgIFVTRVJfQ09OVEVYVC51c2VyID0ge1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBuYW1lOiBzdS5uYW1lLFxuICAgICAgbW9iaWxlOiBzdS5tb2JpbGUsXG4gICAgICBwb3NpdGlvbjogc3UucG9zaXRpb24sXG4gICAgICBlbWFpbDogc3UuZW1haWwsXG4gICAgICBjb21wYW55OiBzdS5jb21wYW55LFxuICAgICAgY29tcGFueV9pZDogc3UuY29tcGFueV9pZCxcbiAgICAgIGNvbXBhbnlfaWRzOiBzdS5jb21wYW55X2lkc1xuICAgIH07XG4gICAgc3BhY2VfdXNlcl9vcmcgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3JnYW5pemF0aW9uc1wiKSkgIT0gbnVsbCA/IHJlZi5maW5kT25lKHN1Lm9yZ2FuaXphdGlvbikgOiB2b2lkIDA7XG4gICAgaWYgKHNwYWNlX3VzZXJfb3JnKSB7XG4gICAgICBVU0VSX0NPTlRFWFQudXNlci5vcmdhbml6YXRpb24gPSB7XG4gICAgICAgIF9pZDogc3BhY2VfdXNlcl9vcmcuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZV91c2VyX29yZy5uYW1lLFxuICAgICAgICBmdWxsbmFtZTogc3BhY2VfdXNlcl9vcmcuZnVsbG5hbWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBVU0VSX0NPTlRFWFQ7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVsYXRpdmVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgaWYgKF8uaXNGdW5jdGlvbihTdGVlZG9zLmlzQ29yZG92YSkgJiYgU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAoKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCIvYXNzZXRzXCIpIDogdm9pZCAwKSB8fCAodXJsICE9IG51bGwgPyB1cmwuc3RhcnRzV2l0aChcImFzc2V0c1wiKSA6IHZvaWQgMCkgfHwgKHVybCAhPSBudWxsID8gdXJsLnN0YXJ0c1dpdGgoXCIvcGFja2FnZXNcIikgOiB2b2lkIDApKSkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgaWYgKHVybCkge1xuICAgIGlmICghL15cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XG4gICAgfVxuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICsgdXJsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHN1O1xuICB1c2VySWQgPSB1c2VySWQgfHwgTWV0ZW9yLnVzZXJJZCgpO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgc3BhY2VJZCA9IHNwYWNlSWQgfHwgU2Vzc2lvbi5nZXQoJ3NwYWNlSWQnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnbWlzcyBzcGFjZUlkJyk7XG4gICAgfVxuICB9XG4gIHN1ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdzcGFjZV91c2VycycpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjb21wYW55X2lkOiAxXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN1LmNvbXBhbnlfaWQ7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJDb21wYW55SWRzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciBzdTtcbiAgdXNlcklkID0gdXNlcklkIHx8IE1ldGVvci51c2VySWQoKTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHNwYWNlSWQgPSBzcGFjZUlkIHx8IFNlc3Npb24uZ2V0KCdzcGFjZUlkJyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ21pc3Mgc3BhY2VJZCcpO1xuICAgIH1cbiAgfVxuICBzdSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignc3BhY2VfdXNlcnMnKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY29tcGFueV9pZHM6IDFcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3UgIT0gbnVsbCA/IHN1LmNvbXBhbnlfaWRzIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5wcm9jZXNzUGVybWlzc2lvbnMgPSBmdW5jdGlvbihwbykge1xuICBpZiAocG8uYWxsb3dDcmVhdGUpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0VkaXQpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0RlbGV0ZSkge1xuICAgIHBvLmFsbG93RWRpdCA9IHRydWU7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0FsbFJlY29yZHMpIHtcbiAgICBwby5hbGxvd1JlYWQgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3QWxsUmVjb3JkcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLnZpZXdDb21wYW55UmVjb3Jkcykge1xuICAgIHBvLmFsbG93UmVhZCA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgcG8uYWxsb3dSZWFkID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXQgPSB0cnVlO1xuICAgIHBvLmFsbG93RGVsZXRlID0gdHJ1ZTtcbiAgICBwby52aWV3Q29tcGFueVJlY29yZHMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd1JlYWQpIHtcbiAgICB0eXBlb2YgcG8uYWxsb3dSZWFkRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd1JlYWRGaWxlcyA9IHRydWUpO1xuICAgIHR5cGVvZiBwby52aWV3QWxsRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby52aWV3QWxsRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8uYWxsb3dFZGl0KSB7XG4gICAgdHlwZW9mIHBvLmFsbG93Q3JlYXRlRmlsZXMgIT09IFwiYm9vbGVhblwiICYmIChwby5hbGxvd0NyZWF0ZUZpbGVzID0gdHJ1ZSk7XG4gICAgdHlwZW9mIHBvLmFsbG93RWRpdEZpbGVzICE9PSBcImJvb2xlYW5cIiAmJiAocG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlKTtcbiAgICB0eXBlb2YgcG8uYWxsb3dEZWxldGVGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLmFsbG93RGVsZXRlRmlsZXMgPSB0cnVlKTtcbiAgfVxuICBpZiAocG8ubW9kaWZ5QWxsUmVjb3Jkcykge1xuICAgIHR5cGVvZiBwby5tb2RpZnlBbGxGaWxlcyAhPT0gXCJib29sZWFuXCIgJiYgKHBvLm1vZGlmeUFsbEZpbGVzID0gdHJ1ZSk7XG4gIH1cbiAgaWYgKHBvLmFsbG93Q3JlYXRlRmlsZXMpIHtcbiAgICBwby5hbGxvd1JlYWRGaWxlcyA9IHRydWU7XG4gIH1cbiAgaWYgKHBvLmFsbG93RWRpdEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5hbGxvd0RlbGV0ZUZpbGVzKSB7XG4gICAgcG8uYWxsb3dFZGl0RmlsZXMgPSB0cnVlO1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgfVxuICBpZiAocG8udmlld0FsbEZpbGVzKSB7XG4gICAgcG8uYWxsb3dSZWFkRmlsZXMgPSB0cnVlO1xuICB9XG4gIGlmIChwby5tb2RpZnlBbGxGaWxlcykge1xuICAgIHBvLmFsbG93UmVhZEZpbGVzID0gdHJ1ZTtcbiAgICBwby5hbGxvd0VkaXRGaWxlcyA9IHRydWU7XG4gICAgcG8uYWxsb3dEZWxldGVGaWxlcyA9IHRydWU7XG4gICAgcG8udmlld0FsbEZpbGVzID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcG87XG59O1xuXG5DcmVhdG9yLmdldFRlbXBsYXRlU3BhY2VJZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICByZXR1cm4gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi50ZW1wbGF0ZVNwYWNlSWQgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmdldENsb3VkQWRtaW5TcGFjZUlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIHJldHVybiAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLmNsb3VkQWRtaW5TcGFjZUlkIDogdm9pZCAwO1xufTtcblxuQ3JlYXRvci5pc1RlbXBsYXRlU3BhY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHZhciByZWY7XG4gIGlmIChzcGFjZUlkICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmLnRlbXBsYXRlU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICB2YXIgcmVmO1xuICBpZiAoc3BhY2VJZCAmJiAoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZi5jbG91ZEFkbWluU3BhY2VJZCA6IHZvaWQgMCkgPT09IHNwYWNlSWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIgPSBwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSO1xufVxuIiwiTWV0ZW9yLm1ldGhvZHNcblx0IyDnlKjmiLfojrflj5Zsb29rdXAg44CBbWFzdGVyX2RldGFpbOexu+Wei+Wtl+auteeahOmAiemhueWAvFxuXHRcImNyZWF0b3Iub2JqZWN0X29wdGlvbnNcIjogKG9wdGlvbnMpLT5cblx0XHRpZiBvcHRpb25zPy5wYXJhbXM/LnJlZmVyZW5jZV90b1xuXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvcHRpb25zLnBhcmFtcy5yZWZlcmVuY2VfdG8sIG9wdGlvbnMucGFyYW1zLnNwYWNlKVxuXG5cdFx0XHRuYW1lX2ZpZWxkX2tleSA9IG9iamVjdC5OQU1FX0ZJRUxEX0tFWVxuXG5cdFx0XHRxdWVyeSA9IHt9XG5cdFx0XHRpZiBvcHRpb25zLnBhcmFtcy5zcGFjZVxuXHRcdFx0XHRxdWVyeS5zcGFjZSA9IG9wdGlvbnMucGFyYW1zLnNwYWNlXG5cblx0XHRcdFx0c29ydCA9IG9wdGlvbnM/LnNvcnRcblxuXHRcdFx0XHRzZWxlY3RlZCA9IG9wdGlvbnM/LnNlbGVjdGVkIHx8IFtdXG5cblx0XHRcdFx0b3B0aW9uc19saW1pdCA9IG9wdGlvbnM/Lm9wdGlvbnNfbGltaXQgfHwgMTBcblxuXHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRzZWFyY2hUZXh0UXVlcnkgPSB7fVxuXHRcdFx0XHRcdHNlYXJjaFRleHRRdWVyeVtuYW1lX2ZpZWxkX2tleV0gPSB7JHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHR9XG5cblx0XHRcdFx0aWYgb3B0aW9ucz8udmFsdWVzPy5sZW5ndGhcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdHF1ZXJ5LiRvciA9IFt7X2lkOiB7JGluOiBvcHRpb25zLnZhbHVlc319LCBzZWFyY2hUZXh0UXVlcnldXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cXVlcnkuJG9yID0gW3tfaWQ6IHskaW46IG9wdGlvbnMudmFsdWVzfX1dXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpZiBvcHRpb25zLnNlYXJjaFRleHRcblx0XHRcdFx0XHRcdF8uZXh0ZW5kKHF1ZXJ5LCBzZWFyY2hUZXh0UXVlcnkpXG5cdFx0XHRcdFx0cXVlcnkuX2lkID0geyRuaW46IHNlbGVjdGVkfVxuXG5cdFx0XHRcdGNvbGxlY3Rpb24gPSBvYmplY3QuZGJcblxuXHRcdFx0XHRpZiBvcHRpb25zLmZpbHRlclF1ZXJ5XG5cdFx0XHRcdFx0Xy5leHRlbmQgcXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnlcblxuXHRcdFx0XHRxdWVyeV9vcHRpb25zID0ge2xpbWl0OiBvcHRpb25zX2xpbWl0fVxuXG5cdFx0XHRcdGlmIHNvcnQgJiYgXy5pc09iamVjdChzb3J0KVxuXHRcdFx0XHRcdHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnRcblxuXHRcdFx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRyZWNvcmRzID0gY29sbGVjdGlvbi5maW5kKHF1ZXJ5LCBxdWVyeV9vcHRpb25zKS5mZXRjaCgpXG5cdFx0XHRcdFx0XHRyZXN1bHRzID0gW11cblx0XHRcdFx0XHRcdF8uZWFjaCByZWNvcmRzLCAocmVjb3JkKS0+XG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaFxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsOiByZWNvcmRbbmFtZV9maWVsZF9rZXldXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHJlY29yZC5faWRcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzXG5cdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIGUubWVzc2FnZSArIFwiLS0+XCIgKyBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxuXHRcdHJldHVybiBbXSAiLCJNZXRlb3IubWV0aG9kcyh7XG4gIFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGUsIG5hbWVfZmllbGRfa2V5LCBvYmplY3QsIG9wdGlvbnNfbGltaXQsIHF1ZXJ5LCBxdWVyeV9vcHRpb25zLCByZWNvcmRzLCByZWYsIHJlZjEsIHJlc3VsdHMsIHNlYXJjaFRleHRRdWVyeSwgc2VsZWN0ZWQsIHNvcnQ7XG4gICAgaWYgKG9wdGlvbnMgIT0gbnVsbCA/IChyZWYgPSBvcHRpb25zLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5yZWZlcmVuY2VfdG8gOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9wdGlvbnMucGFyYW1zLnJlZmVyZW5jZV90bywgb3B0aW9ucy5wYXJhbXMuc3BhY2UpO1xuICAgICAgbmFtZV9maWVsZF9rZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gICAgICBxdWVyeSA9IHt9O1xuICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLnNwYWNlKSB7XG4gICAgICAgIHF1ZXJ5LnNwYWNlID0gb3B0aW9ucy5wYXJhbXMuc3BhY2U7XG4gICAgICAgIHNvcnQgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zLnNvcnQgOiB2b2lkIDA7XG4gICAgICAgIHNlbGVjdGVkID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc2VsZWN0ZWQgOiB2b2lkIDApIHx8IFtdO1xuICAgICAgICBvcHRpb25zX2xpbWl0ID0gKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMub3B0aW9uc19saW1pdCA6IHZvaWQgMCkgfHwgMTA7XG4gICAgICAgIGlmIChvcHRpb25zLnNlYXJjaFRleHQpIHtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hUZXh0UXVlcnlbbmFtZV9maWVsZF9rZXldID0ge1xuICAgICAgICAgICAgJHJlZ2V4OiBvcHRpb25zLnNlYXJjaFRleHRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICE9IG51bGwgPyAocmVmMSA9IG9wdGlvbnMudmFsdWVzKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBxdWVyeS4kb3IgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICRpbjogb3B0aW9ucy52YWx1ZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIHNlYXJjaFRleHRRdWVyeVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnkuJG9yID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAkaW46IG9wdGlvbnMudmFsdWVzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChxdWVyeSwgc2VhcmNoVGV4dFF1ZXJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcXVlcnkuX2lkID0ge1xuICAgICAgICAgICAgJG5pbjogc2VsZWN0ZWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbGxlY3Rpb24gPSBvYmplY3QuZGI7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlclF1ZXJ5KSB7XG4gICAgICAgICAgXy5leHRlbmQocXVlcnksIG9wdGlvbnMuZmlsdGVyUXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXJ5X29wdGlvbnMgPSB7XG4gICAgICAgICAgbGltaXQ6IG9wdGlvbnNfbGltaXRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHNvcnQgJiYgXy5pc09iamVjdChzb3J0KSkge1xuICAgICAgICAgIHF1ZXJ5X29wdGlvbnMuc29ydCA9IHNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVjb3JkcyA9IGNvbGxlY3Rpb24uZmluZChxdWVyeSwgcXVlcnlfb3B0aW9ucykuZmV0Y2goKTtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChyZWNvcmRzLCBmdW5jdGlvbihyZWNvcmQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGFiZWw6IHJlY29yZFtuYW1lX2ZpZWxkX2tleV0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5faWRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgZS5tZXNzYWdlICsgXCItLT5cIiArIEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvd29ya2Zsb3cvdmlldy86aW5zdGFuY2VJZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXHRcdGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZFxuXG5cdFx0aGFzaERhdGEgPSByZXEuYm9keVxuXHRcdG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWVcblx0XHRyZWNvcmRfaWQgPSBoYXNoRGF0YS5yZWNvcmRfaWRcblx0XHRzcGFjZV9pZCA9IGhhc2hEYXRhLnNwYWNlX2lkXG5cblx0XHRjaGVjayBvYmplY3RfbmFtZSwgU3RyaW5nXG5cdFx0Y2hlY2sgcmVjb3JkX2lkLCBTdHJpbmdcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXG5cblx0XHRpbnNJZCA9IHJlcS5wYXJhbXMuaW5zdGFuY2VJZFxuXHRcdHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ11cblx0XHR4X2F1dGhfdG9rZW4gPSByZXEucXVlcnlbJ1gtQXV0aC1Ub2tlbiddXG5cblx0XHRyZWRpcmVjdF91cmwgPSBcIi9cIlxuXHRcdGlucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignaW5zdGFuY2VzJykuZmluZE9uZShpbnNJZClcblx0XHQjIC0g5oiR55qE6I2J56i/5bCx6Lez6L2s6Iez6I2J56i/566xXG5cdFx0IyAtIOaIkeeahOW+heWuoeaguOWwsei3s+i9rOiHs+W+heWuoeaguFxuXHRcdCMgLSDkuI3mmK/miJHnmoTnlLPor7fljZXliJnot7Povazoh7PmiZPljbDpobXpnaJcblx0XHQjIC0g5aaC55Sz6K+35Y2V5LiN5a2Y5Zyo5YiZ5o+Q56S655So5oi355Sz6K+35Y2V5bey5Yig6Zmk77yM5bm25LiU5pu05pawcmVjb3Jk55qE54q25oCB77yM5L2/55So5oi35Y+v5Lul6YeN5paw5Y+R6LW35a6h5om5XG5cdFx0aWYgaW5zXG5cdFx0XHRib3ggPSAnJ1xuXHRcdFx0c3BhY2VJZCA9IGlucy5zcGFjZVxuXHRcdFx0Zmxvd0lkID0gaW5zLmZsb3dcblxuXHRcdFx0aWYgKGlucy5pbmJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkKSBvciAoaW5zLmNjX3VzZXJzPy5pbmNsdWRlcyBjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdGJveCA9ICdpbmJveCdcblx0XHRcdGVsc2UgaWYgaW5zLm91dGJveF91c2Vycz8uaW5jbHVkZXMgY3VycmVudF91c2VyX2lkXG5cdFx0XHRcdGJveCA9ICdvdXRib3gnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnZHJhZnQnIGFuZCBpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZFxuXHRcdFx0XHRib3ggPSAnZHJhZnQnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAncGVuZGluZycgYW5kIChpbnMuc3VibWl0dGVyIGlzIGN1cnJlbnRfdXNlcl9pZCBvciBpbnMuYXBwbGljYW50IGlzIGN1cnJlbnRfdXNlcl9pZClcblx0XHRcdFx0Ym94ID0gJ3BlbmRpbmcnXG5cdFx0XHRlbHNlIGlmIGlucy5zdGF0ZSBpcyAnY29tcGxldGVkJyBhbmQgaW5zLnN1Ym1pdHRlciBpcyBjdXJyZW50X3VzZXJfaWRcblx0XHRcdFx0Ym94ID0gJ2NvbXBsZXRlZCdcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDpqozor4Fsb2dpbiB1c2VyX2lk5a+56K+l5rWB56iL5pyJ566h55CG44CB6KeC5a+f55Sz6K+35Y2V55qE5p2D6ZmQXG5cdFx0XHRcdHBlcm1pc3Npb25zID0gcGVybWlzc2lvbk1hbmFnZXIuZ2V0Rmxvd1Blcm1pc3Npb25zKGZsb3dJZCwgY3VycmVudF91c2VyX2lkKVxuXHRcdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHsgZmllbGRzOiB7IGFkbWluczogMSB9IH0pXG5cdFx0XHRcdGlmIHBlcm1pc3Npb25zLmluY2x1ZGVzKFwiYWRtaW5cIikgb3IgcGVybWlzc2lvbnMuaW5jbHVkZXMoXCJtb25pdG9yXCIpIG9yIHNwYWNlLmFkbWlucy5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpXG5cdFx0XHRcdFx0Ym94ID0gJ21vbml0b3InXG5cdFx0XHR3b3JrZmxvd1VybCA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXM/LndvcmtmbG93Py51cmxcblx0XHRcdGlmIGJveFxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgXCJ3b3JrZmxvdy9zcGFjZS8je3NwYWNlSWR9LyN7Ym94fS8je2luc0lkfT9YLVVzZXItSWQ9I3t4X3VzZXJfaWR9JlgtQXV0aC1Ub2tlbj0je3hfYXV0aF90b2tlbn1cIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgXCJ3b3JrZmxvdy9zcGFjZS8je3NwYWNlSWR9L3ByaW50LyN7aW5zSWR9P2JveD1tb25pdG9yJnByaW50X2lzX3Nob3dfdHJhY2VzPTEmcHJpbnRfaXNfc2hvd19hdHRhY2htZW50cz0xJlgtVXNlci1JZD0je3hfdXNlcl9pZH0mWC1BdXRoLVRva2VuPSN7eF9hdXRoX3Rva2VufVwiXG5cblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogMjAwXG5cdFx0XHRcdGRhdGE6IHsgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmwgfVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihvYmplY3RfbmFtZSwgc3BhY2VfaWQpXG5cdFx0XHRpZiBjb2xsZWN0aW9uXG5cdFx0XHRcdGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xuXHRcdFx0XHRcdCR1bnNldDoge1xuXHRcdFx0XHRcdFx0XCJpbnN0YW5jZXNcIjogMSxcblx0XHRcdFx0XHRcdFwiaW5zdGFuY2Vfc3RhdGVcIjogMSxcblx0XHRcdFx0XHRcdFwibG9ja2VkXCI6IDFcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3InLCAn55Sz6K+35Y2V5bey5Yig6ZmkJylcblxuXHRjYXRjaCBlXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxuXHRcdH1cblxuIiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS93b3JrZmxvdy92aWV3LzppbnN0YW5jZUlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJveCwgY29sbGVjdGlvbiwgY3VycmVudF91c2VyX2lkLCBjdXJyZW50X3VzZXJfaW5mbywgZSwgZmxvd0lkLCBoYXNoRGF0YSwgaW5zLCBpbnNJZCwgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25zLCByZWNvcmRfaWQsIHJlZGlyZWN0X3VybCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCBzcGFjZSwgc3BhY2VJZCwgc3BhY2VfaWQsIHdvcmtmbG93VXJsLCB4X2F1dGhfdG9rZW4sIHhfdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgIGN1cnJlbnRfdXNlcl9pZCA9IGN1cnJlbnRfdXNlcl9pbmZvLl9pZDtcbiAgICBoYXNoRGF0YSA9IHJlcS5ib2R5O1xuICAgIG9iamVjdF9uYW1lID0gaGFzaERhdGEub2JqZWN0X25hbWU7XG4gICAgcmVjb3JkX2lkID0gaGFzaERhdGEucmVjb3JkX2lkO1xuICAgIHNwYWNlX2lkID0gaGFzaERhdGEuc3BhY2VfaWQ7XG4gICAgY2hlY2sob2JqZWN0X25hbWUsIFN0cmluZyk7XG4gICAgY2hlY2socmVjb3JkX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGluc0lkID0gcmVxLnBhcmFtcy5pbnN0YW5jZUlkO1xuICAgIHhfdXNlcl9pZCA9IHJlcS5xdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgeF9hdXRoX3Rva2VuID0gcmVxLnF1ZXJ5WydYLUF1dGgtVG9rZW4nXTtcbiAgICByZWRpcmVjdF91cmwgPSBcIi9cIjtcbiAgICBpbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2luc3RhbmNlcycpLmZpbmRPbmUoaW5zSWQpO1xuICAgIGlmIChpbnMpIHtcbiAgICAgIGJveCA9ICcnO1xuICAgICAgc3BhY2VJZCA9IGlucy5zcGFjZTtcbiAgICAgIGZsb3dJZCA9IGlucy5mbG93O1xuICAgICAgaWYgKCgocmVmID0gaW5zLmluYm94X3VzZXJzKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKGN1cnJlbnRfdXNlcl9pZCkgOiB2b2lkIDApIHx8ICgocmVmMSA9IGlucy5jY191c2VycykgIT0gbnVsbCA/IHJlZjEuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgYm94ID0gJ2luYm94JztcbiAgICAgIH0gZWxzZSBpZiAoKHJlZjIgPSBpbnMub3V0Ym94X3VzZXJzKSAhPSBudWxsID8gcmVmMi5pbmNsdWRlcyhjdXJyZW50X3VzZXJfaWQpIDogdm9pZCAwKSB7XG4gICAgICAgIGJveCA9ICdvdXRib3gnO1xuICAgICAgfSBlbHNlIGlmIChpbnMuc3RhdGUgPT09ICdkcmFmdCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdkcmFmdCc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ3BlbmRpbmcnICYmIChpbnMuc3VibWl0dGVyID09PSBjdXJyZW50X3VzZXJfaWQgfHwgaW5zLmFwcGxpY2FudCA9PT0gY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICBib3ggPSAncGVuZGluZyc7XG4gICAgICB9IGVsc2UgaWYgKGlucy5zdGF0ZSA9PT0gJ2NvbXBsZXRlZCcgJiYgaW5zLnN1Ym1pdHRlciA9PT0gY3VycmVudF91c2VyX2lkKSB7XG4gICAgICAgIGJveCA9ICdjb21wbGV0ZWQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBwZXJtaXNzaW9uTWFuYWdlci5nZXRGbG93UGVybWlzc2lvbnMoZmxvd0lkLCBjdXJyZW50X3VzZXJfaWQpO1xuICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGFkbWluczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwZXJtaXNzaW9ucy5pbmNsdWRlcyhcImFkbWluXCIpIHx8IHBlcm1pc3Npb25zLmluY2x1ZGVzKFwibW9uaXRvclwiKSB8fCBzcGFjZS5hZG1pbnMuaW5jbHVkZXMoY3VycmVudF91c2VyX2lkKSkge1xuICAgICAgICAgIGJveCA9ICdtb25pdG9yJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgd29ya2Zsb3dVcmwgPSAocmVmMyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcykgIT0gbnVsbCA/IChyZWY0ID0gcmVmMy53b3JrZmxvdykgIT0gbnVsbCA/IHJlZjQudXJsIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGJveCkge1xuICAgICAgICByZWRpcmVjdF91cmwgPSAod29ya2Zsb3dVcmwgfHwgJycpICsgKFwid29ya2Zsb3cvc3BhY2UvXCIgKyBzcGFjZUlkICsgXCIvXCIgKyBib3ggKyBcIi9cIiArIGluc0lkICsgXCI/WC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZGlyZWN0X3VybCA9ICh3b3JrZmxvd1VybCB8fCAnJykgKyAoXCJ3b3JrZmxvdy9zcGFjZS9cIiArIHNwYWNlSWQgKyBcIi9wcmludC9cIiArIGluc0lkICsgXCI/Ym94PW1vbml0b3ImcHJpbnRfaXNfc2hvd190cmFjZXM9MSZwcmludF9pc19zaG93X2F0dGFjaG1lbnRzPTEmWC1Vc2VyLUlkPVwiICsgeF91c2VyX2lkICsgXCImWC1BdXRoLVRva2VuPVwiICsgeF9hdXRoX3Rva2VuKTtcbiAgICAgIH1cbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVkaXJlY3RfdXJsOiByZWRpcmVjdF91cmxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUsIHNwYWNlX2lkKTtcbiAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNvbGxlY3Rpb24udXBkYXRlKHJlY29yZF9pZCwge1xuICAgICAgICAgICR1bnNldDoge1xuICAgICAgICAgICAgXCJpbnN0YW5jZXNcIjogMSxcbiAgICAgICAgICAgIFwiaW5zdGFuY2Vfc3RhdGVcIjogMSxcbiAgICAgICAgICAgIFwibG9ja2VkXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvcicsICfnlLPor7fljZXlt7LliKDpmaQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRJbml0V2lkdGhQZXJjZW50ID0gKG9iamVjdF9uYW1lLCBjb2x1bW5zKSAtPlxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpPy5fc2NoZW1hXG5cdGNvbHVtbl9udW0gPSAwXG5cdGlmIF9zY2hlbWFcblx0XHRfLmVhY2ggY29sdW1ucywgKGZpZWxkX25hbWUpIC0+XG5cdFx0XHRmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKVxuXHRcdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxuXHRcdFx0aWYgaXNfd2lkZVxuXHRcdFx0XHRjb2x1bW5fbnVtICs9IDJcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y29sdW1uX251bSArPSAxXG5cblx0XHRpbml0X3dpZHRoX3BlcmNlbnQgPSAxMDAgLyBjb2x1bW5fbnVtXG5cdFx0cmV0dXJuIGluaXRfd2lkdGhfcGVyY2VudFxuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lKSAtPlxuXHRfc2NoZW1hID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpLl9zY2hlbWFcblx0aWYgX3NjaGVtYVxuXHRcdGZpZWxkID0gXy5waWNrKF9zY2hlbWEsIGZpZWxkX25hbWUpXG5cdFx0aXNfd2lkZSA9IGZpZWxkW2ZpZWxkX25hbWVdPy5hdXRvZm9ybT8uaXNfd2lkZVxuXHRcdHJldHVybiBpc193aWRlXG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGNvbHVtbnMpIC0+XG5cdHNldHRpbmcgPSBDcmVhdG9yLkNvbGxlY3Rpb25zPy5zZXR0aW5ncz8uZmluZE9uZSh7b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCByZWNvcmRfaWQ6IFwib2JqZWN0X2xpc3R2aWV3c1wifSlcblx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBfLm1hcCBjb2x1bW5zLCAoY29sdW1uKS0+XG5cdFx0ZmllbGQgPSBvYmouZmllbGRzW2NvbHVtbl1cblx0XHRpZiBmaWVsZD8udHlwZSBhbmQgIWZpZWxkLmhpZGRlblxuXHRcdFx0cmV0dXJuIGNvbHVtblxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0Y29sdW1ucyA9IF8uY29tcGFjdCBjb2x1bW5zXG5cdGlmIHNldHRpbmcgYW5kIHNldHRpbmcuc2V0dGluZ3Ncblx0XHRzb3J0ID0gc2V0dGluZy5zZXR0aW5nc1tsaXN0X3ZpZXdfaWRdPy5zb3J0IHx8IFtdXG5cdFx0c29ydCA9IF8ubWFwIHNvcnQsIChvcmRlciktPlxuXHRcdFx0a2V5ID0gb3JkZXJbMF1cblx0XHRcdGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSlcblx0XHRcdG9yZGVyWzBdID0gaW5kZXggKyAxXG5cdFx0XHRyZXR1cm4gb3JkZXJcblx0XHRyZXR1cm4gc29ydFxuXHRyZXR1cm4gW11cblxuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJuYW1lXCJdXG5cdGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXVxuXHRkZWZhdWx0X2V4dHJhX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm93bmVyXCJdXG5cdGlmIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xuXHRcdGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uIGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1uc1xuXG5cdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChvYmplY3RfbmFtZSkgfHwgW11cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0Q3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHM/W29iamVjdF9uYW1lXSA9IFtdXG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gKGRlZmF1bHRfdmlldywgbGlzdF92aWV3LCBsaXN0X3ZpZXdfbmFtZSktPlxuXHRkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXc/LmNvbHVtbnNcblx0ZGVmYXVsdF9tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfdmlldz8ubW9iaWxlX2NvbHVtbnNcblx0dW5sZXNzIGxpc3Rfdmlld1xuXHRcdHJldHVyblxuXHRvaXRlbSA9IF8uY2xvbmUobGlzdF92aWV3KVxuXHRpZiAhXy5oYXMob2l0ZW0sIFwibmFtZVwiKVxuXHRcdG9pdGVtLm5hbWUgPSBsaXN0X3ZpZXdfbmFtZVxuXHRpZiAhb2l0ZW0uY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRfY29sdW1uc1xuXHRcdFx0b2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1uc1xuXHRpZiAhb2l0ZW0uY29sdW1uc1xuXHRcdG9pdGVtLmNvbHVtbnMgPSBbXCJuYW1lXCJdXG5cdGlmICFvaXRlbS5tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnNcblx0XHRcdG9pdGVtLm1vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF9tb2JpbGVfY29sdW1uc1xuXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmIENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSAmJiAhXy5pbmNsdWRlKG9pdGVtLmNvbHVtbnMsICdzcGFjZScpXG5cdFx0XHRvaXRlbS5jb2x1bW5zLnB1c2goJ3NwYWNlJylcblxuXG5cdGlmICFvaXRlbS5maWx0ZXJfc2NvcGVcblx0XHQjIGxpc3R2aWV36KeG5Zu+55qEZmlsdGVyX3Njb3Bl6buY6K6k5YC85pS55Li6c3BhY2UgIzEzMVxuXHRcdG9pdGVtLmZpbHRlcl9zY29wZSA9IFwic3BhY2VcIlxuXG5cdGlmICFfLmhhcyhvaXRlbSwgXCJfaWRcIilcblx0XHRvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZVxuXHRlbHNlXG5cdFx0b2l0ZW0ubGFiZWwgPSBvaXRlbS5sYWJlbCB8fCBsaXN0X3ZpZXcubmFtZVxuXG5cdGlmIF8uaXNTdHJpbmcob2l0ZW0ub3B0aW9ucylcblx0XHRvaXRlbS5vcHRpb25zID0gSlNPTi5wYXJzZShvaXRlbS5vcHRpb25zKVxuXG5cdF8uZm9yRWFjaCBvaXRlbS5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cblx0XHRpZiAhXy5pc0FycmF5KGZpbHRlcikgJiYgXy5pc09iamVjdChmaWx0ZXIpXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0aWYgXy5pc0Z1bmN0aW9uKGZpbHRlcj8udmFsdWUpXG5cdFx0XHRcdFx0ZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcoZmlsdGVyPy5fdmFsdWUpXG5cdFx0XHRcdFx0ZmlsdGVyLnZhbHVlID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyLl92YWx1ZX0pXCIpXG5cdHJldHVybiBvaXRlbVxuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRDcmVhdG9yLmdldFJlbGF0ZWRMaXN0ID0gKG9iamVjdF9uYW1lKS0+XG5cdFx0dW5sZXNzIG9iamVjdF9uYW1lXG5cdFx0XHRyZXR1cm5cblx0XHRyZWxhdGVkTGlzdE9iamVjdHMgPSB7fVxuXHRcdHJlbGF0ZWRMaXN0TmFtZXMgPSBbXVxuXHRcdG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyA9IFtdO1xuXHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiBfb2JqZWN0XG5cdFx0XHRsYXlvdXRSZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZF9saXN0cztcblx0XHRcdGlmICFfLmlzRW1wdHkgbGF5b3V0UmVsYXRlZExpc3Rcblx0XHRcdFx0Xy5lYWNoIGxheW91dFJlbGF0ZWRMaXN0LCAoaXRlbSktPlxuXHRcdFx0XHRcdHJlT2JqZWN0TmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzBdXG5cdFx0XHRcdFx0cmVGaWVsZE5hbWUgPSBpdGVtLnJlbGF0ZWRfZmllbGRfZnVsbG5hbWUuc3BsaXQoJy4nKVsxXVxuXHRcdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gQ3JlYXRvci5nZXRPYmplY3QocmVPYmplY3ROYW1lKT8uZmllbGRzW3JlRmllbGROYW1lXT8ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiByZU9iamVjdE5hbWVcblx0XHRcdFx0XHRcdGNvbHVtbnM6IGl0ZW0uZmllbGRfbmFtZXNcblx0XHRcdFx0XHRcdG1vYmlsZV9jb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzXG5cdFx0XHRcdFx0XHRpc19maWxlOiByZU9iamVjdE5hbWUgPT0gXCJjbXNfZmlsZXNcIlxuXHRcdFx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uOiBpdGVtLmZpbHRlcnNcblx0XHRcdFx0XHRcdHNvcnQ6IGl0ZW0uc29ydFxuXHRcdFx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiByZUZpZWxkTmFtZVxuXHRcdFx0XHRcdFx0Y3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWVcblx0XHRcdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXHRcdFx0XHRcdFx0bGFiZWw6IGl0ZW0ubGFiZWxcblx0XHRcdFx0XHRcdGFjdGlvbnM6IGl0ZW0uYnV0dG9uc1xuXHRcdFx0XHRcdFx0dmlzaWJsZV9vbjogaXRlbS52aXNpYmxlX29uXG5cdFx0XHRcdFx0XHRwYWdlX3NpemU6IGl0ZW0ucGFnZV9zaXplXG5cdFx0XHRcdFx0b2JqZWN0TGF5b3V0UmVsYXRlZExpc3RPYmplY3RzLnB1c2gocmVsYXRlZClcblx0XHRcdFx0cmV0dXJuIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cztcblx0XHRcdHJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkTGlzdFxuXHRcdFx0aWYgIV8uaXNFbXB0eSByZWxhdGVkTGlzdFxuXHRcdFx0XHRfLmVhY2ggcmVsYXRlZExpc3QsIChvYmpPck5hbWUpLT5cblx0XHRcdFx0XHRpZiBfLmlzT2JqZWN0IG9iak9yTmFtZVxuXHRcdFx0XHRcdFx0cmVsYXRlZCA9XG5cdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmpPck5hbWUub2JqZWN0TmFtZVxuXHRcdFx0XHRcdFx0XHRjb2x1bW5zOiBvYmpPck5hbWUuY29sdW1uc1xuXHRcdFx0XHRcdFx0XHRtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdFx0XHRcdGlzX2ZpbGU6IG9iak9yTmFtZS5vYmplY3ROYW1lID09IFwiY21zX2ZpbGVzXCJcblx0XHRcdFx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uOiBvYmpPck5hbWUuZmlsdGVyc1xuXHRcdFx0XHRcdFx0XHRzb3J0OiBvYmpPck5hbWUuc29ydFxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWU6ICcnXG5cdFx0XHRcdFx0XHRcdGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlXG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBvYmpPck5hbWUubGFiZWxcblx0XHRcdFx0XHRcdFx0YWN0aW9uczogb2JqT3JOYW1lLmFjdGlvbnNcblx0XHRcdFx0XHRcdFx0cGFnZV9zaXplOiBvYmpPck5hbWUucGFnZV9zaXplXG5cdFx0XHRcdFx0XHRyZWxhdGVkTGlzdE9iamVjdHNbb2JqT3JOYW1lLm9iamVjdE5hbWVdID0gcmVsYXRlZFxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3ROYW1lcy5wdXNoIG9iak9yTmFtZS5vYmplY3ROYW1lXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzU3RyaW5nIG9iak9yTmFtZVxuXHRcdFx0XHRcdFx0cmVsYXRlZExpc3ROYW1lcy5wdXNoIG9iak9yTmFtZVxuXG5cdFx0bWFwTGlzdCA9IHt9XG5cdFx0cmVsYXRlZF9vYmplY3RzID0gQ3JlYXRvci5nZXRSZWxhdGVkT2JqZWN0cyhvYmplY3RfbmFtZSlcblx0XHRfLmVhY2ggcmVsYXRlZF9vYmplY3RzLCAocmVsYXRlZF9vYmplY3RfaXRlbSkgLT5cblx0XHRcdGlmICFyZWxhdGVkX29iamVjdF9pdGVtPy5vYmplY3RfbmFtZVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lXG5cdFx0XHRyZWxhdGVkX2ZpZWxkX25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLmZvcmVpZ25fa2V5XG5cdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcblx0XHRcdHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSlcblx0XHRcdHVubGVzcyByZWxhdGVkX29iamVjdFxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl1cblx0XHRcdGNvbHVtbnMgPSBfLndpdGhvdXQoY29sdW1ucywgcmVsYXRlZF9maWVsZF9uYW1lKVxuXHRcdFx0bW9iaWxlX2NvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHRydWUpIHx8IFtcIm5hbWVcIl1cblx0XHRcdG1vYmlsZV9jb2x1bW5zID0gXy53aXRob3V0KG1vYmlsZV9jb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpXG5cblx0XHRcdG9yZGVyID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0U29ydChyZWxhdGVkX29iamVjdF9uYW1lKVxuXHRcdFx0dGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucylcblxuXHRcdFx0aWYgL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpXG5cdFx0XHRcdCMgb2JqZWN057G75Z6L5bim5a2Q5bGe5oCn55qEcmVsYXRlZF9maWVsZF9uYW1l6KaB5Y675o6J5Lit6Ze055qE576O5YWD56ym5Y+377yM5ZCm5YiZ5pi+56S65LiN5Ye65a2X5q615YC8XG5cdFx0XHRcdHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLFwiXCIpXG5cdFx0XHRyZWxhdGVkID1cblx0XHRcdFx0b2JqZWN0X25hbWU6IHJlbGF0ZWRfb2JqZWN0X25hbWVcblx0XHRcdFx0Y29sdW1uczogY29sdW1uc1xuXHRcdFx0XHRtb2JpbGVfY29sdW1uczogbW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0cmVsYXRlZF9maWVsZF9uYW1lOiByZWxhdGVkX2ZpZWxkX25hbWVcblx0XHRcdFx0aXNfZmlsZTogcmVsYXRlZF9vYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHRcdHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkOiB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZFxuXG5cdFx0XHRyZWxhdGVkT2JqZWN0ID0gcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cdFx0XHRpZiByZWxhdGVkT2JqZWN0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuY29sdW1uc1xuXHRcdFx0XHRcdHJlbGF0ZWQuY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QuY29sdW1uc1xuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zXG5cdFx0XHRcdFx0cmVsYXRlZC5tb2JpbGVfY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QubW9iaWxlX2NvbHVtbnNcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5zb3J0XG5cdFx0XHRcdFx0cmVsYXRlZC5zb3J0ID0gcmVsYXRlZE9iamVjdC5zb3J0XG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uXG5cdFx0XHRcdFx0cmVsYXRlZC5maWx0ZXJzRnVuY3Rpb24gPSByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvblxuXHRcdFx0XHRpZiByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0XG5cdFx0XHRcdFx0cmVsYXRlZC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCA9IHJlbGF0ZWRPYmplY3QuY3VzdG9tUmVsYXRlZExpc3RPYmplY3Rcblx0XHRcdFx0aWYgcmVsYXRlZE9iamVjdC5sYWJlbFxuXHRcdFx0XHRcdHJlbGF0ZWQubGFiZWwgPSByZWxhdGVkT2JqZWN0LmxhYmVsXG5cdFx0XHRcdGlmIHJlbGF0ZWRPYmplY3QucGFnZV9zaXplXG5cdFx0XHRcdFx0cmVsYXRlZC5wYWdlX3NpemUgPSByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZVxuXHRcdFx0XHRkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdXG5cblx0XHRcdG1hcExpc3RbcmVsYXRlZC5vYmplY3RfbmFtZV0gPSByZWxhdGVkXG5cblxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8ucGx1Y2soXy52YWx1ZXMocmVsYXRlZExpc3RPYmplY3RzKSwgXCJvYmplY3RfbmFtZVwiKVxuXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdHVucmVsYXRlZF9vYmplY3RzID0gcGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHNcblx0XHRyZWxhdGVkX29iamVjdF9uYW1lcyA9IF8uZGlmZmVyZW5jZSByZWxhdGVkX29iamVjdF9uYW1lcywgdW5yZWxhdGVkX29iamVjdHNcblx0XHRfLmVhY2ggcmVsYXRlZExpc3RPYmplY3RzLCAodiwgcmVsYXRlZF9vYmplY3RfbmFtZSkgLT5cblx0XHRcdGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xXG5cdFx0XHRhbGxvd1JlYWQgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRfb2JqZWN0X25hbWUsIHNwYWNlSWQsIHVzZXJJZCk/LmFsbG93UmVhZFxuXHRcdFx0aWYgaXNBY3RpdmUgJiYgYWxsb3dSZWFkXG5cdFx0XHRcdG1hcExpc3RbcmVsYXRlZF9vYmplY3RfbmFtZV0gPSB2XG5cblx0XHRsaXN0ID0gW11cblx0XHRpZiBfLmlzRW1wdHkgcmVsYXRlZExpc3ROYW1lc1xuXHRcdFx0bGlzdCA9ICBfLnZhbHVlcyBtYXBMaXN0XG5cdFx0ZWxzZVxuXHRcdFx0Xy5lYWNoIHJlbGF0ZWRMaXN0TmFtZXMsIChvYmplY3ROYW1lKSAtPlxuXHRcdFx0XHRpZiBtYXBMaXN0W29iamVjdE5hbWVdXG5cdFx0XHRcdFx0bGlzdC5wdXNoIG1hcExpc3Rbb2JqZWN0TmFtZV1cblxuXHRcdGlmIF8uaGFzKF9vYmplY3QsICdhbGxvd19yZWxhdGVkTGlzdCcpXG5cdFx0XHRsaXN0ID0gXy5maWx0ZXIgbGlzdCwgKGl0ZW0pLT5cblx0XHRcdFx0cmV0dXJuIF8uaW5jbHVkZShfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0LCBpdGVtLm9iamVjdF9uYW1lKVxuXG5cdFx0cmV0dXJuIGxpc3RcblxuQ3JlYXRvci5nZXRPYmplY3RGaXJzdExpc3RWaWV3ID0gKG9iamVjdF9uYW1lKS0+XG5cdHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSlcblxuIyMjIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiMjI1xuQ3JlYXRvci5nZXRMaXN0VmlldyA9IChvYmplY3RfbmFtZSwgbGlzdF92aWV3X2lkLCBleGFjKS0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdGlmICFvYmplY3RfbmFtZVxuXHRcdFx0b2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0aWYgIWxpc3Rfdmlld19pZFxuXHRcdFx0bGlzdF92aWV3X2lkID0gU2Vzc2lvbi5nZXQoXCJsaXN0X3ZpZXdfaWRcIilcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGlmICFvYmplY3Rcblx0XHRyZXR1cm5cblx0bGlzdFZpZXdzID0gQ3JlYXRvci5nZXRMaXN0Vmlld3Mob2JqZWN0X25hbWUpXG5cdHVubGVzcyBsaXN0Vmlld3M/Lmxlbmd0aFxuXHRcdHJldHVyblxuXHRsaXN0X3ZpZXcgPSBfLmZpbmRXaGVyZShsaXN0Vmlld3Mse1wiX2lkXCI6bGlzdF92aWV3X2lkfSlcblx0dW5sZXNzIGxpc3Rfdmlld1xuXHRcdCMg5aaC5p6c5LiN6ZyA6KaB5by65Yi25oyJbGlzdF92aWV3X2lk57K+56Gu5p+l5om+77yM5YiZ6buY6K6k6L+U5Zue56ys5LiA5Liq6KeG5Zu+77yM5Y+N5LmL6L+U5Zue56m6XG5cdFx0aWYgZXhhY1xuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0bGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdXG5cdHJldHVybiBsaXN0X3ZpZXdcblxuI+iOt+WPlmxpc3Rfdmlld19pZOWvueW6lOeahOinhuWbvuaYr+WQpuaYr+acgOi/keafpeeci+inhuWbvlxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRpZiAhbGlzdF92aWV3X2lkXG5cdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRpZiB0eXBlb2YobGlzdF92aWV3X2lkKSA9PSBcInN0cmluZ1wiXG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgIW9iamVjdFxuXHRcdFx0cmV0dXJuXG5cdFx0bGlzdFZpZXcgPSBfLmZpbmRXaGVyZShvYmplY3QubGlzdF92aWV3cyx7X2lkOiBsaXN0X3ZpZXdfaWR9KVxuXHRlbHNlXG5cdFx0bGlzdFZpZXcgPSBsaXN0X3ZpZXdfaWRcblx0cmV0dXJuIGxpc3RWaWV3Py5uYW1lID09IFwicmVjZW50XCJcblxuXG4jIyNcbiAgICDku45jb2x1bW5z5Y+C5pWw5Lit6L+H5ruk5Ye655So5LqO5omL5py656uv5pi+56S655qEY29sdW1uc1xuXHTop4TliJnvvJpcblx0MS7kvJjlhYjmiopjb2x1bW5z5Lit55qEbmFtZeWtl+auteaOkuWcqOesrOS4gOS4qlxuXHQyLuacgOWkmuWPqui/lOWbnjTkuKrlrZfmrrVcblx0My7ogIPomZHlrr3lrZfmrrXljaDnlKjmlbTooYzop4TliJnmnaHku7bkuIvvvIzmnIDlpJrlj6rov5Tlm57kuKTooYxcbiMjI1xuQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyA9IChvYmplY3RfbmFtZSwgY29sdW1ucyktPlxuXHRyZXN1bHQgPSBbXVxuXHRtYXhSb3dzID0gMiBcblx0bWF4Q291bnQgPSBtYXhSb3dzICogMlxuXHRjb3VudCA9IDBcblx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdGZpZWxkcyA9IG9iamVjdC5maWVsZHNcblx0dW5sZXNzIG9iamVjdFxuXHRcdHJldHVybiBjb2x1bW5zXG5cdG5hbWVLZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVlcblx0aXNOYW1lQ29sdW1uID0gKGl0ZW0pLT5cblx0XHRpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHRyZXR1cm4gaXRlbS5maWVsZCA9PSBuYW1lS2V5XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGl0ZW0gPT0gbmFtZUtleVxuXHRnZXRGaWVsZCA9IChpdGVtKS0+XG5cdFx0aWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0cmV0dXJuIGZpZWxkc1tpdGVtLmZpZWxkXVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmaWVsZHNbaXRlbV1cblx0aWYgbmFtZUtleVxuXHRcdG5hbWVDb2x1bW4gPSBjb2x1bW5zLmZpbmQgKGl0ZW0pLT5cblx0XHRcdHJldHVybiBpc05hbWVDb2x1bW4oaXRlbSlcblx0aWYgbmFtZUNvbHVtblxuXHRcdGZpZWxkID0gZ2V0RmllbGQobmFtZUNvbHVtbilcblx0XHRpdGVtQ291bnQgPSBpZiBmaWVsZC5pc193aWRlIHRoZW4gMiBlbHNlIDFcblx0XHRjb3VudCArPSBpdGVtQ291bnRcblx0XHRyZXN1bHQucHVzaCBuYW1lQ29sdW1uXG5cdGNvbHVtbnMuZm9yRWFjaCAoaXRlbSktPlxuXHRcdGZpZWxkID0gZ2V0RmllbGQoaXRlbSlcblx0XHR1bmxlc3MgZmllbGRcblx0XHRcdHJldHVyblxuXHRcdGl0ZW1Db3VudCA9IGlmIGZpZWxkLmlzX3dpZGUgdGhlbiAyIGVsc2UgMVxuXHRcdGlmIGNvdW50IDwgbWF4Q291bnQgYW5kIHJlc3VsdC5sZW5ndGggPCBtYXhDb3VudCBhbmQgIWlzTmFtZUNvbHVtbihpdGVtKVxuXHRcdFx0Y291bnQgKz0gaXRlbUNvdW50XG5cdFx0XHRpZiBjb3VudCA8PSBtYXhDb3VudFxuXHRcdFx0XHRyZXN1bHQucHVzaCBpdGVtXG5cdFxuXHRyZXR1cm4gcmVzdWx0XG5cbiMjI1xuICAgIOiOt+WPlum7mOiupOinhuWbvlxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gKG9iamVjdF9uYW1lKS0+XG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0b2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW29iamVjdF9uYW1lXVxuXHRpZiBvYmplY3Q/Lmxpc3Rfdmlld3M/LmRlZmF1bHRcblx0XHQjVE9ETyDmraTku6PnoIHlj6rmmK/mmoLml7blhbzlrrnku6XliY1jb2Rl5Lit5a6a5LmJ55qEZGVmYXVsdOinhuWbvu+8jOW+hWNvZGXkuK3nmoRkZWZhdWx05riF55CG5a6M5oiQ5ZCO77yM6ZyA6KaB5Yig6Zmk5q2k5Luj56CBXG5cdFx0ZGVmYXVsdFZpZXcgPSBvYmplY3QubGlzdF92aWV3cy5kZWZhdWx0XG5cdGVsc2Vcblx0XHRfLmVhY2ggb2JqZWN0Py5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpLT5cblx0XHRcdGlmIGxpc3Rfdmlldy5uYW1lID09IFwiYWxsXCIgfHwga2V5ID09IFwiYWxsXCJcblx0XHRcdFx0ZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXdcblx0cmV0dXJuIGRlZmF1bHRWaWV3O1xuXG4jIyNcbiAgICDojrflj5blr7nosaHnmoTliJfooajpu5jorqTmmL7npLrlrZfmrrVcbiMjI1xuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0Q29sdW1ucyA9IChvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Py5jb2x1bW5zXG5cdGlmIHVzZV9tb2JpbGVfY29sdW1uc1xuXHRcdGlmIGRlZmF1bHRWaWV3Py5tb2JpbGVfY29sdW1uc1xuXHRcdFx0Y29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zXG5cdFx0ZWxzZSBpZiBjb2x1bW5zXG5cdFx0XHRjb2x1bW5zID0gQ3JlYXRvci5waWNrT2JqZWN0TW9iaWxlQ29sdW1ucyhvYmplY3RfbmFtZSwgY29sdW1ucylcblx0cmV0dXJuIGNvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOmineWkluWKoOi9veeahOWtl+autVxuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRFeHRyYUNvbHVtbnMgPSAob2JqZWN0X25hbWUpLT5cblx0ZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKVxuXHRyZXR1cm4gZGVmYXVsdFZpZXc/LmV4dHJhX2NvbHVtbnNcblxuIyMjXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xuIyMjXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0ID0gKG9iamVjdF9uYW1lKS0+XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSlcblx0aWYgZGVmYXVsdFZpZXdcblx0XHRpZiBkZWZhdWx0Vmlldy5zb3J0XG5cdFx0XHRyZXR1cm4gZGVmYXVsdFZpZXcuc29ydFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBbW1wiY3JlYXRlZFwiLCBcImRlc2NcIl1dXG5cblxuIyMjXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcbiMjI1xuQ3JlYXRvci5pc0FsbFZpZXcgPSAobGlzdF92aWV3KS0+XG5cdHJldHVybiBsaXN0X3ZpZXc/Lm5hbWUgPT0gXCJhbGxcIlxuXG4jIyNcbiAgICDliKTmlq3mmK/lkKbmnIDov5Hmn6XnnIsgdmlld1xuIyMjXG5DcmVhdG9yLmlzUmVjZW50VmlldyA9IChsaXN0X3ZpZXcpLT5cblx0cmV0dXJuIGxpc3Rfdmlldz8ubmFtZSA9PSBcInJlY2VudFwiXG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpUYWJ1bGFy5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IChzb3J0LCB0YWJ1bGFyQ29sdW1ucyktPlxuXHR0YWJ1bGFyX3NvcnQgPSBbXVxuXHRfLmVhY2ggc29ydCwgKGl0ZW0pLT5cblx0XHRpZiBfLmlzQXJyYXkoaXRlbSlcblx0XHRcdCMg5YW85a655pen55qE5pWw5o2u5qC85byPW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGlmIGl0ZW0ubGVuZ3RoID09IDFcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIFwiYXNjXCJdXG5cdFx0XHRlbHNlIGlmIGl0ZW0ubGVuZ3RoID09IDJcblx0XHRcdFx0Y29sdW1uX2luZGV4ID0gdGFidWxhckNvbHVtbnMuaW5kZXhPZihpdGVtWzBdKVxuXHRcdFx0XHRpZiBjb2x1bW5faW5kZXggPiAtMVxuXHRcdFx0XHRcdHRhYnVsYXJfc29ydC5wdXNoIFtjb2x1bW5faW5kZXgsIGl0ZW1bMV1dXG5cdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGl0ZW0pXG5cdFx0XHQj5paw5pWw5o2u5qC85byP77yaW3tmaWVsZF9uYW1lOiAsIG9yZGVyOiB9XVxuXHRcdFx0ZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZVxuXHRcdFx0b3JkZXIgPSBpdGVtLm9yZGVyXG5cdFx0XHRpZiBmaWVsZF9uYW1lICYmIG9yZGVyXG5cdFx0XHRcdGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoZmllbGRfbmFtZSlcblx0XHRcdFx0aWYgY29sdW1uX2luZGV4ID4gLTFcblx0XHRcdFx0XHR0YWJ1bGFyX3NvcnQucHVzaCBbY29sdW1uX2luZGV4LCBvcmRlcl1cblxuXHRyZXR1cm4gdGFidWxhcl9zb3J0XG5cbiMjI1xuICAgIOWwhnNvcnTovazmjaLkuLpEZXZFeHByZXNz5o6n5Lu25omA6ZyA6KaB55qE5qC85byPXG4jIyNcbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvRFggPSAoc29ydCktPlxuXHRkeF9zb3J0ID0gW11cblx0Xy5lYWNoIHNvcnQsIChpdGVtKS0+XG5cdFx0aWYgXy5pc0FycmF5KGl0ZW0pXG5cdFx0XHQj5YW85a655pen5qC85byP77yaW1tcImZpZWxkX25hbWVcIiwgXCJvcmRlclwiXV1cblx0XHRcdGR4X3NvcnQucHVzaChpdGVtKVxuXHRcdGVsc2UgaWYgXy5pc09iamVjdChpdGVtKVxuXHRcdFx0I+aWsOaVsOaNruagvOW8j++8mlt7ZmllbGRfbmFtZTogLCBvcmRlcjogfV1cblx0XHRcdGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWVcblx0XHRcdG9yZGVyID0gaXRlbS5vcmRlclxuXHRcdFx0aWYgZmllbGRfbmFtZSAmJiBvcmRlclxuXHRcdFx0XHRkeF9zb3J0LnB1c2ggW2ZpZWxkX25hbWUsIG9yZGVyXVxuXG5cdHJldHVybiBkeF9zb3J0XG4iLCJDcmVhdG9yLmdldEluaXRXaWR0aFBlcmNlbnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgY29sdW1ucykge1xuICB2YXIgX3NjaGVtYSwgY29sdW1uX251bSwgaW5pdF93aWR0aF9wZXJjZW50LCByZWY7XG4gIF9zY2hlbWEgPSAocmVmID0gQ3JlYXRvci5nZXRTY2hlbWEob2JqZWN0X25hbWUpKSAhPSBudWxsID8gcmVmLl9zY2hlbWEgOiB2b2lkIDA7XG4gIGNvbHVtbl9udW0gPSAwO1xuICBpZiAoX3NjaGVtYSkge1xuICAgIF8uZWFjaChjb2x1bW5zLCBmdW5jdGlvbihmaWVsZF9uYW1lKSB7XG4gICAgICB2YXIgZmllbGQsIGlzX3dpZGUsIHJlZjEsIHJlZjI7XG4gICAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICAgIGlzX3dpZGUgPSAocmVmMSA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmF1dG9mb3JtKSAhPSBudWxsID8gcmVmMi5pc193aWRlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGlzX3dpZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbl9udW0gKz0gMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb2x1bW5fbnVtICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaW5pdF93aWR0aF9wZXJjZW50ID0gMTAwIC8gY29sdW1uX251bTtcbiAgICByZXR1cm4gaW5pdF93aWR0aF9wZXJjZW50O1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkSXNXaWRlID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGZpZWxkX25hbWUpIHtcbiAgdmFyIF9zY2hlbWEsIGZpZWxkLCBpc193aWRlLCByZWYsIHJlZjE7XG4gIF9zY2hlbWEgPSBDcmVhdG9yLmdldFNjaGVtYShvYmplY3RfbmFtZSkuX3NjaGVtYTtcbiAgaWYgKF9zY2hlbWEpIHtcbiAgICBmaWVsZCA9IF8ucGljayhfc2NoZW1hLCBmaWVsZF9uYW1lKTtcbiAgICBpc193aWRlID0gKHJlZiA9IGZpZWxkW2ZpZWxkX25hbWVdKSAhPSBudWxsID8gKHJlZjEgPSByZWYuYXV0b2Zvcm0pICE9IG51bGwgPyByZWYxLmlzX3dpZGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgcmV0dXJuIGlzX3dpZGU7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0VGFidWxhck9yZGVyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgY29sdW1ucykge1xuICB2YXIgb2JqLCByZWYsIHJlZjEsIHJlZjIsIHNldHRpbmcsIHNvcnQ7XG4gIHNldHRpbmcgPSAocmVmID0gQ3JlYXRvci5Db2xsZWN0aW9ucykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnNldHRpbmdzKSAhPSBudWxsID8gcmVmMS5maW5kT25lKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgcmVjb3JkX2lkOiBcIm9iamVjdF9saXN0dmlld3NcIlxuICB9KSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBjb2x1bW5zID0gXy5tYXAoY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgdmFyIGZpZWxkO1xuICAgIGZpZWxkID0gb2JqLmZpZWxkc1tjb2x1bW5dO1xuICAgIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnR5cGUgOiB2b2lkIDApICYmICFmaWVsZC5oaWRkZW4pIHtcbiAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICB9KTtcbiAgY29sdW1ucyA9IF8uY29tcGFjdChjb2x1bW5zKTtcbiAgaWYgKHNldHRpbmcgJiYgc2V0dGluZy5zZXR0aW5ncykge1xuICAgIHNvcnQgPSAoKHJlZjIgPSBzZXR0aW5nLnNldHRpbmdzW2xpc3Rfdmlld19pZF0pICE9IG51bGwgPyByZWYyLnNvcnQgOiB2b2lkIDApIHx8IFtdO1xuICAgIHNvcnQgPSBfLm1hcChzb3J0LCBmdW5jdGlvbihvcmRlcikge1xuICAgICAgdmFyIGluZGV4LCBrZXk7XG4gICAgICBrZXkgPSBvcmRlclswXTtcbiAgICAgIGluZGV4ID0gXy5pbmRleE9mKGNvbHVtbnMsIGtleSk7XG4gICAgICBvcmRlclswXSA9IGluZGV4ICsgMTtcbiAgICAgIHJldHVybiBvcmRlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gc29ydDtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5DcmVhdG9yLmluaXRMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgY29sdW1ucywgZGVmYXVsdF9leHRyYV9jb2x1bW5zLCBleHRyYV9jb2x1bW5zLCBvYmplY3QsIG9yZGVyLCByZWY7XG4gIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMob2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gIGV4dHJhX2NvbHVtbnMgPSBbXCJvd25lclwiXTtcbiAgZGVmYXVsdF9leHRyYV9jb2x1bW5zID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zKG9iamVjdF9uYW1lKSB8fCBbXCJvd25lclwiXTtcbiAgaWYgKGRlZmF1bHRfZXh0cmFfY29sdW1ucykge1xuICAgIGV4dHJhX2NvbHVtbnMgPSBfLnVuaW9uKGV4dHJhX2NvbHVtbnMsIGRlZmF1bHRfZXh0cmFfY29sdW1ucyk7XG4gIH1cbiAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KG9iamVjdF9uYW1lKSB8fCBbXTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHJldHVybiAocmVmID0gQ3JlYXRvci5UYWJ1bGFyU2VsZWN0ZWRJZHMpICE9IG51bGwgPyByZWZbb2JqZWN0X25hbWVdID0gW10gOiB2b2lkIDA7XG4gIH1cbn07XG5cbkNyZWF0b3IuY29udmVydExpc3RWaWV3ID0gZnVuY3Rpb24oZGVmYXVsdF92aWV3LCBsaXN0X3ZpZXcsIGxpc3Rfdmlld19uYW1lKSB7XG4gIHZhciBkZWZhdWx0X2NvbHVtbnMsIGRlZmF1bHRfbW9iaWxlX2NvbHVtbnMsIG9pdGVtO1xuICBkZWZhdWx0X2NvbHVtbnMgPSBkZWZhdWx0X3ZpZXcgIT0gbnVsbCA/IGRlZmF1bHRfdmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBkZWZhdWx0X21vYmlsZV9jb2x1bW5zID0gZGVmYXVsdF92aWV3ICE9IG51bGwgPyBkZWZhdWx0X3ZpZXcubW9iaWxlX2NvbHVtbnMgOiB2b2lkIDA7XG4gIGlmICghbGlzdF92aWV3KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9pdGVtID0gXy5jbG9uZShsaXN0X3ZpZXcpO1xuICBpZiAoIV8uaGFzKG9pdGVtLCBcIm5hbWVcIikpIHtcbiAgICBvaXRlbS5uYW1lID0gbGlzdF92aWV3X25hbWU7XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRfY29sdW1ucykge1xuICAgICAgb2l0ZW0uY29sdW1ucyA9IGRlZmF1bHRfY29sdW1ucztcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5jb2x1bW5zKSB7XG4gICAgb2l0ZW0uY29sdW1ucyA9IFtcIm5hbWVcIl07XG4gIH1cbiAgaWYgKCFvaXRlbS5tb2JpbGVfY29sdW1ucykge1xuICAgIGlmIChkZWZhdWx0X21vYmlsZV9jb2x1bW5zKSB7XG4gICAgICBvaXRlbS5tb2JpbGVfY29sdW1ucyA9IGRlZmF1bHRfbW9iaWxlX2NvbHVtbnM7XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpICYmICFfLmluY2x1ZGUob2l0ZW0uY29sdW1ucywgJ3NwYWNlJykpIHtcbiAgICAgIG9pdGVtLmNvbHVtbnMucHVzaCgnc3BhY2UnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFvaXRlbS5maWx0ZXJfc2NvcGUpIHtcbiAgICBvaXRlbS5maWx0ZXJfc2NvcGUgPSBcInNwYWNlXCI7XG4gIH1cbiAgaWYgKCFfLmhhcyhvaXRlbSwgXCJfaWRcIikpIHtcbiAgICBvaXRlbS5faWQgPSBsaXN0X3ZpZXdfbmFtZTtcbiAgfSBlbHNlIHtcbiAgICBvaXRlbS5sYWJlbCA9IG9pdGVtLmxhYmVsIHx8IGxpc3Rfdmlldy5uYW1lO1xuICB9XG4gIGlmIChfLmlzU3RyaW5nKG9pdGVtLm9wdGlvbnMpKSB7XG4gICAgb2l0ZW0ub3B0aW9ucyA9IEpTT04ucGFyc2Uob2l0ZW0ub3B0aW9ucyk7XG4gIH1cbiAgXy5mb3JFYWNoKG9pdGVtLmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgaWYgKCFfLmlzQXJyYXkoZmlsdGVyKSAmJiBfLmlzT2JqZWN0KGZpbHRlcikpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci52YWx1ZSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyLl92YWx1ZSA9IGZpbHRlci52YWx1ZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyhmaWx0ZXIgIT0gbnVsbCA/IGZpbHRlci5fdmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZmlsdGVyLl92YWx1ZSArIFwiKVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvaXRlbTtcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQ3JlYXRvci5nZXRSZWxhdGVkTGlzdCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF9vYmplY3QsIGxheW91dFJlbGF0ZWRMaXN0LCBsaXN0LCBtYXBMaXN0LCBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMsIHBlcm1pc3Npb25zLCByZWxhdGVkTGlzdCwgcmVsYXRlZExpc3ROYW1lcywgcmVsYXRlZExpc3RPYmplY3RzLCByZWxhdGVkX29iamVjdF9uYW1lcywgcmVsYXRlZF9vYmplY3RzLCBzcGFjZUlkLCB1bnJlbGF0ZWRfb2JqZWN0cywgdXNlcklkO1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVsYXRlZExpc3RPYmplY3RzID0ge307XG4gICAgcmVsYXRlZExpc3ROYW1lcyA9IFtdO1xuICAgIG9iamVjdExheW91dFJlbGF0ZWRMaXN0T2JqZWN0cyA9IFtdO1xuICAgIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgaWYgKF9vYmplY3QpIHtcbiAgICAgIGxheW91dFJlbGF0ZWRMaXN0ID0gX29iamVjdC5yZWxhdGVkX2xpc3RzO1xuICAgICAgaWYgKCFfLmlzRW1wdHkobGF5b3V0UmVsYXRlZExpc3QpKSB7XG4gICAgICAgIF8uZWFjaChsYXlvdXRSZWxhdGVkTGlzdCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHZhciByZUZpZWxkTmFtZSwgcmVPYmplY3ROYW1lLCByZWYsIHJlZjEsIHJlbGF0ZWQsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgICAgICAgIHJlT2JqZWN0TmFtZSA9IGl0ZW0ucmVsYXRlZF9maWVsZF9mdWxsbmFtZS5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgIHJlRmllbGROYW1lID0gaXRlbS5yZWxhdGVkX2ZpZWxkX2Z1bGxuYW1lLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSAocmVmID0gQ3JlYXRvci5nZXRPYmplY3QocmVPYmplY3ROYW1lKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmZpZWxkc1tyZUZpZWxkTmFtZV0pICE9IG51bGwgPyByZWYxLndyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgICAgICBvYmplY3RfbmFtZTogcmVPYmplY3ROYW1lLFxuICAgICAgICAgICAgY29sdW1uczogaXRlbS5maWVsZF9uYW1lcyxcbiAgICAgICAgICAgIG1vYmlsZV9jb2x1bW5zOiBpdGVtLmZpZWxkX25hbWVzLFxuICAgICAgICAgICAgaXNfZmlsZTogcmVPYmplY3ROYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICAgICAgZmlsdGVyc0Z1bmN0aW9uOiBpdGVtLmZpbHRlcnMsXG4gICAgICAgICAgICBzb3J0OiBpdGVtLnNvcnQsXG4gICAgICAgICAgICByZWxhdGVkX2ZpZWxkX25hbWU6IHJlRmllbGROYW1lLFxuICAgICAgICAgICAgY3VzdG9tUmVsYXRlZExpc3RPYmplY3Q6IHRydWUsXG4gICAgICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQsXG4gICAgICAgICAgICBsYWJlbDogaXRlbS5sYWJlbCxcbiAgICAgICAgICAgIGFjdGlvbnM6IGl0ZW0uYnV0dG9ucyxcbiAgICAgICAgICAgIHZpc2libGVfb246IGl0ZW0udmlzaWJsZV9vbixcbiAgICAgICAgICAgIHBhZ2Vfc2l6ZTogaXRlbS5wYWdlX3NpemVcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHMucHVzaChyZWxhdGVkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3RMYXlvdXRSZWxhdGVkTGlzdE9iamVjdHM7XG4gICAgICB9XG4gICAgICByZWxhdGVkTGlzdCA9IF9vYmplY3QucmVsYXRlZExpc3Q7XG4gICAgICBpZiAoIV8uaXNFbXB0eShyZWxhdGVkTGlzdCkpIHtcbiAgICAgICAgXy5lYWNoKHJlbGF0ZWRMaXN0LCBmdW5jdGlvbihvYmpPck5hbWUpIHtcbiAgICAgICAgICB2YXIgcmVsYXRlZDtcbiAgICAgICAgICBpZiAoXy5pc09iamVjdChvYmpPck5hbWUpKSB7XG4gICAgICAgICAgICByZWxhdGVkID0ge1xuICAgICAgICAgICAgICBvYmplY3RfbmFtZTogb2JqT3JOYW1lLm9iamVjdE5hbWUsXG4gICAgICAgICAgICAgIGNvbHVtbnM6IG9iak9yTmFtZS5jb2x1bW5zLFxuICAgICAgICAgICAgICBtb2JpbGVfY29sdW1uczogb2JqT3JOYW1lLm1vYmlsZV9jb2x1bW5zLFxuICAgICAgICAgICAgICBpc19maWxlOiBvYmpPck5hbWUub2JqZWN0TmFtZSA9PT0gXCJjbXNfZmlsZXNcIixcbiAgICAgICAgICAgICAgZmlsdGVyc0Z1bmN0aW9uOiBvYmpPck5hbWUuZmlsdGVycyxcbiAgICAgICAgICAgICAgc29ydDogb2JqT3JOYW1lLnNvcnQsXG4gICAgICAgICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogJycsXG4gICAgICAgICAgICAgIGN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0OiB0cnVlLFxuICAgICAgICAgICAgICBsYWJlbDogb2JqT3JOYW1lLmxhYmVsLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBvYmpPck5hbWUuYWN0aW9ucyxcbiAgICAgICAgICAgICAgcGFnZV9zaXplOiBvYmpPck5hbWUucGFnZV9zaXplXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVsYXRlZExpc3RPYmplY3RzW29iak9yTmFtZS5vYmplY3ROYW1lXSA9IHJlbGF0ZWQ7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZExpc3ROYW1lcy5wdXNoKG9iak9yTmFtZS5vYmplY3ROYW1lKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcob2JqT3JOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRMaXN0TmFtZXMucHVzaChvYmpPck5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIG1hcExpc3QgPSB7fTtcbiAgICByZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldFJlbGF0ZWRPYmplY3RzKG9iamVjdF9uYW1lKTtcbiAgICBfLmVhY2gocmVsYXRlZF9vYmplY3RzLCBmdW5jdGlvbihyZWxhdGVkX29iamVjdF9pdGVtKSB7XG4gICAgICB2YXIgY29sdW1ucywgbW9iaWxlX2NvbHVtbnMsIG9yZGVyLCByZWxhdGVkLCByZWxhdGVkT2JqZWN0LCByZWxhdGVkX2ZpZWxkX25hbWUsIHJlbGF0ZWRfb2JqZWN0LCByZWxhdGVkX29iamVjdF9uYW1lLCB0YWJ1bGFyX29yZGVyLCB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgIGlmICghKHJlbGF0ZWRfb2JqZWN0X2l0ZW0gIT0gbnVsbCA/IHJlbGF0ZWRfb2JqZWN0X2l0ZW0ub2JqZWN0X25hbWUgOiB2b2lkIDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWRfb2JqZWN0X25hbWUgPSByZWxhdGVkX29iamVjdF9pdGVtLm9iamVjdF9uYW1lO1xuICAgICAgcmVsYXRlZF9maWVsZF9uYW1lID0gcmVsYXRlZF9vYmplY3RfaXRlbS5mb3JlaWduX2tleTtcbiAgICAgIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID0gcmVsYXRlZF9vYmplY3RfaXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDtcbiAgICAgIHJlbGF0ZWRfb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVsYXRlZF9vYmplY3RfbmFtZSk7XG4gICAgICBpZiAoIXJlbGF0ZWRfb2JqZWN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbHVtbnMgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRDb2x1bW5zKHJlbGF0ZWRfb2JqZWN0X25hbWUpIHx8IFtcIm5hbWVcIl07XG4gICAgICBjb2x1bW5zID0gXy53aXRob3V0KGNvbHVtbnMsIHJlbGF0ZWRfZmllbGRfbmFtZSk7XG4gICAgICBtb2JpbGVfY29sdW1ucyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgdHJ1ZSkgfHwgW1wibmFtZVwiXTtcbiAgICAgIG1vYmlsZV9jb2x1bW5zID0gXy53aXRob3V0KG1vYmlsZV9jb2x1bW5zLCByZWxhdGVkX2ZpZWxkX25hbWUpO1xuICAgICAgb3JkZXIgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRTb3J0KHJlbGF0ZWRfb2JqZWN0X25hbWUpO1xuICAgICAgdGFidWxhcl9vcmRlciA9IENyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhcihvcmRlciwgY29sdW1ucyk7XG4gICAgICBpZiAoL1xcdytcXC5cXCRcXC5cXHcrL2cudGVzdChyZWxhdGVkX2ZpZWxkX25hbWUpKSB7XG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZSA9IHJlbGF0ZWRfZmllbGRfbmFtZS5yZXBsYWNlKC9cXCRcXC4vLCBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJlbGF0ZWQgPSB7XG4gICAgICAgIG9iamVjdF9uYW1lOiByZWxhdGVkX29iamVjdF9uYW1lLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgICBtb2JpbGVfY29sdW1uczogbW9iaWxlX2NvbHVtbnMsXG4gICAgICAgIHJlbGF0ZWRfZmllbGRfbmFtZTogcmVsYXRlZF9maWVsZF9uYW1lLFxuICAgICAgICBpc19maWxlOiByZWxhdGVkX29iamVjdF9uYW1lID09PSBcImNtc19maWxlc1wiLFxuICAgICAgICB3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZDogd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWRcbiAgICAgIH07XG4gICAgICByZWxhdGVkT2JqZWN0ID0gcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgICAgaWYgKHJlbGF0ZWRPYmplY3QpIHtcbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuY29sdW1ucykge1xuICAgICAgICAgIHJlbGF0ZWQuY29sdW1ucyA9IHJlbGF0ZWRPYmplY3QuY29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5tb2JpbGVfY29sdW1ucykge1xuICAgICAgICAgIHJlbGF0ZWQubW9iaWxlX2NvbHVtbnMgPSByZWxhdGVkT2JqZWN0Lm1vYmlsZV9jb2x1bW5zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LnNvcnQpIHtcbiAgICAgICAgICByZWxhdGVkLnNvcnQgPSByZWxhdGVkT2JqZWN0LnNvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QuZmlsdGVyc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgcmVsYXRlZC5maWx0ZXJzRnVuY3Rpb24gPSByZWxhdGVkT2JqZWN0LmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsYXRlZE9iamVjdC5jdXN0b21SZWxhdGVkTGlzdE9iamVjdCkge1xuICAgICAgICAgIHJlbGF0ZWQuY3VzdG9tUmVsYXRlZExpc3RPYmplY3QgPSByZWxhdGVkT2JqZWN0LmN1c3RvbVJlbGF0ZWRMaXN0T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxhdGVkT2JqZWN0LmxhYmVsKSB7XG4gICAgICAgICAgcmVsYXRlZC5sYWJlbCA9IHJlbGF0ZWRPYmplY3QubGFiZWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbGF0ZWRPYmplY3QucGFnZV9zaXplKSB7XG4gICAgICAgICAgcmVsYXRlZC5wYWdlX3NpemUgPSByZWxhdGVkT2JqZWN0LnBhZ2Vfc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgcmVsYXRlZExpc3RPYmplY3RzW3JlbGF0ZWRfb2JqZWN0X25hbWVdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hcExpc3RbcmVsYXRlZC5vYmplY3RfbmFtZV0gPSByZWxhdGVkO1xuICAgIH0pO1xuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5wbHVjayhfLnZhbHVlcyhyZWxhdGVkTGlzdE9iamVjdHMpLCBcIm9iamVjdF9uYW1lXCIpO1xuICAgIHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKTtcbiAgICB1bnJlbGF0ZWRfb2JqZWN0cyA9IHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzO1xuICAgIHJlbGF0ZWRfb2JqZWN0X25hbWVzID0gXy5kaWZmZXJlbmNlKHJlbGF0ZWRfb2JqZWN0X25hbWVzLCB1bnJlbGF0ZWRfb2JqZWN0cyk7XG4gICAgXy5lYWNoKHJlbGF0ZWRMaXN0T2JqZWN0cywgZnVuY3Rpb24odiwgcmVsYXRlZF9vYmplY3RfbmFtZSkge1xuICAgICAgdmFyIGFsbG93UmVhZCwgaXNBY3RpdmUsIHJlZjtcbiAgICAgIGlzQWN0aXZlID0gcmVsYXRlZF9vYmplY3RfbmFtZXMuaW5kZXhPZihyZWxhdGVkX29iamVjdF9uYW1lKSA+IC0xO1xuICAgICAgYWxsb3dSZWFkID0gKHJlZiA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZF9vYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSkgIT0gbnVsbCA/IHJlZi5hbGxvd1JlYWQgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNBY3RpdmUgJiYgYWxsb3dSZWFkKSB7XG4gICAgICAgIHJldHVybiBtYXBMaXN0W3JlbGF0ZWRfb2JqZWN0X25hbWVdID0gdjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsaXN0ID0gW107XG4gICAgaWYgKF8uaXNFbXB0eShyZWxhdGVkTGlzdE5hbWVzKSkge1xuICAgICAgbGlzdCA9IF8udmFsdWVzKG1hcExpc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gocmVsYXRlZExpc3ROYW1lcywgZnVuY3Rpb24ob2JqZWN0TmFtZSkge1xuICAgICAgICBpZiAobWFwTGlzdFtvYmplY3ROYW1lXSkge1xuICAgICAgICAgIHJldHVybiBsaXN0LnB1c2gobWFwTGlzdFtvYmplY3ROYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoXy5oYXMoX29iamVjdCwgJ2FsbG93X3JlbGF0ZWRMaXN0JykpIHtcbiAgICAgIGxpc3QgPSBfLmZpbHRlcihsaXN0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBfLmluY2x1ZGUoX29iamVjdC5hbGxvd19yZWxhdGVkTGlzdCwgaXRlbS5vYmplY3RfbmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH07XG59XG5cbkNyZWF0b3IuZ2V0T2JqZWN0Rmlyc3RMaXN0VmlldyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHJldHVybiBfLmZpcnN0KENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKSk7XG59O1xuXG5cbi8qIFxuXHTlj5blh7psaXN0X3ZpZXdfaWTlr7nlupTnmoTop4blm77vvIzlpoLmnpzkuI3lrZjlnKjmiJbogIXmsqHmnInmnYPpmZDvvIzlsLHov5Tlm57nrKzkuIDkuKrop4blm75cblx0ZXhhY+S4unRydWXml7bvvIzpnIDopoHlvLrliLbmjIlsaXN0X3ZpZXdfaWTnsr7noa7mn6Xmib7vvIzkuI3pu5jorqTov5Tlm57nrKzkuIDkuKrop4blm75cbiAqL1xuXG5DcmVhdG9yLmdldExpc3RWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZXhhYykge1xuICB2YXIgbGlzdFZpZXdzLCBsaXN0X3ZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RWaWV3cyA9IENyZWF0b3IuZ2V0TGlzdFZpZXdzKG9iamVjdF9uYW1lKTtcbiAgaWYgKCEobGlzdFZpZXdzICE9IG51bGwgPyBsaXN0Vmlld3MubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0X3ZpZXcgPSBfLmZpbmRXaGVyZShsaXN0Vmlld3MsIHtcbiAgICBcIl9pZFwiOiBsaXN0X3ZpZXdfaWRcbiAgfSk7XG4gIGlmICghbGlzdF92aWV3KSB7XG4gICAgaWYgKGV4YWMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdF92aWV3ID0gbGlzdFZpZXdzWzBdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbGlzdF92aWV3O1xufTtcblxuQ3JlYXRvci5nZXRMaXN0Vmlld0lzUmVjZW50ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCkge1xuICB2YXIgbGlzdFZpZXcsIG9iamVjdDtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgIGxpc3Rfdmlld19pZCA9IFNlc3Npb24uZ2V0KFwibGlzdF92aWV3X2lkXCIpO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIGxpc3Rfdmlld19pZCA9PT0gXCJzdHJpbmdcIikge1xuICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsaXN0VmlldyA9IF8uZmluZFdoZXJlKG9iamVjdC5saXN0X3ZpZXdzLCB7XG4gICAgICBfaWQ6IGxpc3Rfdmlld19pZFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxpc3RWaWV3ID0gbGlzdF92aWV3X2lkO1xuICB9XG4gIHJldHVybiAobGlzdFZpZXcgIT0gbnVsbCA/IGxpc3RWaWV3Lm5hbWUgOiB2b2lkIDApID09PSBcInJlY2VudFwiO1xufTtcblxuXG4vKlxuICAgIOS7jmNvbHVtbnPlj4LmlbDkuK3ov4fmu6Tlh7rnlKjkuo7miYvmnLrnq6/mmL7npLrnmoRjb2x1bW5zXG5cdOinhOWIme+8mlxuXHQxLuS8mOWFiOaKimNvbHVtbnPkuK3nmoRuYW1l5a2X5q615o6S5Zyo56ys5LiA5LiqXG5cdDIu5pyA5aSa5Y+q6L+U5ZueNOS4quWtl+autVxuXHQzLuiAg+iZkeWuveWtl+auteWNoOeUqOaVtOihjOinhOWImeadoeS7tuS4i++8jOacgOWkmuWPqui/lOWbnuS4pOihjFxuICovXG5cbkNyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgY29sdW1ucykge1xuICB2YXIgY291bnQsIGZpZWxkLCBmaWVsZHMsIGdldEZpZWxkLCBpc05hbWVDb2x1bW4sIGl0ZW1Db3VudCwgbWF4Q291bnQsIG1heFJvd3MsIG5hbWVDb2x1bW4sIG5hbWVLZXksIG9iamVjdCwgcmVzdWx0O1xuICByZXN1bHQgPSBbXTtcbiAgbWF4Um93cyA9IDI7XG4gIG1heENvdW50ID0gbWF4Um93cyAqIDI7XG4gIGNvdW50ID0gMDtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBmaWVsZHMgPSBvYmplY3QuZmllbGRzO1xuICBpZiAoIW9iamVjdCkge1xuICAgIHJldHVybiBjb2x1bW5zO1xuICB9XG4gIG5hbWVLZXkgPSBvYmplY3QuTkFNRV9GSUVMRF9LRVk7XG4gIGlzTmFtZUNvbHVtbiA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgcmV0dXJuIGl0ZW0uZmllbGQgPT09IG5hbWVLZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpdGVtID09PSBuYW1lS2V5O1xuICAgIH1cbiAgfTtcbiAgZ2V0RmllbGQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHJldHVybiBmaWVsZHNbaXRlbS5maWVsZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZHNbaXRlbV07XG4gICAgfVxuICB9O1xuICBpZiAobmFtZUtleSkge1xuICAgIG5hbWVDb2x1bW4gPSBjb2x1bW5zLmZpbmQoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIGlzTmFtZUNvbHVtbihpdGVtKTtcbiAgICB9KTtcbiAgfVxuICBpZiAobmFtZUNvbHVtbikge1xuICAgIGZpZWxkID0gZ2V0RmllbGQobmFtZUNvbHVtbik7XG4gICAgaXRlbUNvdW50ID0gZmllbGQuaXNfd2lkZSA/IDIgOiAxO1xuICAgIGNvdW50ICs9IGl0ZW1Db3VudDtcbiAgICByZXN1bHQucHVzaChuYW1lQ29sdW1uKTtcbiAgfVxuICBjb2x1bW5zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgIGZpZWxkID0gZ2V0RmllbGQoaXRlbSk7XG4gICAgaWYgKCFmaWVsZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpdGVtQ291bnQgPSBmaWVsZC5pc193aWRlID8gMiA6IDE7XG4gICAgaWYgKGNvdW50IDwgbWF4Q291bnQgJiYgcmVzdWx0Lmxlbmd0aCA8IG1heENvdW50ICYmICFpc05hbWVDb2x1bW4oaXRlbSkpIHtcbiAgICAgIGNvdW50ICs9IGl0ZW1Db3VudDtcbiAgICAgIGlmIChjb3VudCA8PSBtYXhDb3VudCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuLypcbiAgICDojrflj5bpu5jorqTop4blm75cbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3ID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3LCBvYmplY3QsIHJlZjtcbiAgb2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICBpZiAoIW9iamVjdCkge1xuICAgIG9iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV07XG4gIH1cbiAgaWYgKG9iamVjdCAhPSBudWxsID8gKHJlZiA9IG9iamVjdC5saXN0X3ZpZXdzKSAhPSBudWxsID8gcmVmW1wiZGVmYXVsdFwiXSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgIGRlZmF1bHRWaWV3ID0gb2JqZWN0Lmxpc3Rfdmlld3NbXCJkZWZhdWx0XCJdO1xuICB9IGVsc2Uge1xuICAgIF8uZWFjaChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC5saXN0X3ZpZXdzIDogdm9pZCAwLCBmdW5jdGlvbihsaXN0X3ZpZXcsIGtleSkge1xuICAgICAgaWYgKGxpc3Rfdmlldy5uYW1lID09PSBcImFsbFwiIHx8IGtleSA9PT0gXCJhbGxcIikge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZpZXcgPSBsaXN0X3ZpZXc7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWaWV3O1xufTtcblxuXG4vKlxuICAgIOiOt+WPluWvueixoeeahOWIl+ihqOm7mOiupOaYvuekuuWtl+autVxuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdENvbHVtbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgdXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gIHZhciBjb2x1bW5zLCBkZWZhdWx0VmlldztcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KG9iamVjdF9uYW1lKTtcbiAgY29sdW1ucyA9IGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5jb2x1bW5zIDogdm9pZCAwO1xuICBpZiAodXNlX21vYmlsZV9jb2x1bW5zKSB7XG4gICAgaWYgKGRlZmF1bHRWaWV3ICE9IG51bGwgPyBkZWZhdWx0Vmlldy5tb2JpbGVfY29sdW1ucyA6IHZvaWQgMCkge1xuICAgICAgY29sdW1ucyA9IGRlZmF1bHRWaWV3Lm1vYmlsZV9jb2x1bW5zO1xuICAgIH0gZWxzZSBpZiAoY29sdW1ucykge1xuICAgICAgY29sdW1ucyA9IENyZWF0b3IucGlja09iamVjdE1vYmlsZUNvbHVtbnMob2JqZWN0X25hbWUsIGNvbHVtbnMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29sdW1ucztcbn07XG5cblxuLypcblx06I635Y+W5a+56LGh55qE5YiX6KGo6buY6K6k6aKd5aSW5Yqg6L2955qE5a2X5q61XG4gKi9cblxuQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0RXh0cmFDb2x1bW5zID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgdmFyIGRlZmF1bHRWaWV3O1xuICBkZWZhdWx0VmlldyA9IENyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFZpZXcob2JqZWN0X25hbWUpO1xuICByZXR1cm4gZGVmYXVsdFZpZXcgIT0gbnVsbCA/IGRlZmF1bHRWaWV3LmV4dHJhX2NvbHVtbnMgOiB2b2lkIDA7XG59O1xuXG5cbi8qXG5cdOiOt+WPluWvueixoeeahOm7mOiupOaOkuW6j1xuICovXG5cbkNyZWF0b3IuZ2V0T2JqZWN0RGVmYXVsdFNvcnQgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZGVmYXVsdFZpZXc7XG4gIGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhvYmplY3RfbmFtZSk7XG4gIGlmIChkZWZhdWx0Vmlldykge1xuICAgIGlmIChkZWZhdWx0Vmlldy5zb3J0KSB7XG4gICAgICByZXR1cm4gZGVmYXVsdFZpZXcuc29ydDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtbXCJjcmVhdGVkXCIsIFwiZGVzY1wiXV07XG4gICAgfVxuICB9XG59O1xuXG5cbi8qXG4gICAg5Yik5pat5piv5ZCmQWxsIHZpZXdcbiAqL1xuXG5DcmVhdG9yLmlzQWxsVmlldyA9IGZ1bmN0aW9uKGxpc3Rfdmlldykge1xuICByZXR1cm4gKGxpc3RfdmlldyAhPSBudWxsID8gbGlzdF92aWV3Lm5hbWUgOiB2b2lkIDApID09PSBcImFsbFwiO1xufTtcblxuXG4vKlxuICAgIOWIpOaWreaYr+WQpuacgOi/keafpeeciyB2aWV3XG4gKi9cblxuQ3JlYXRvci5pc1JlY2VudFZpZXcgPSBmdW5jdGlvbihsaXN0X3ZpZXcpIHtcbiAgcmV0dXJuIChsaXN0X3ZpZXcgIT0gbnVsbCA/IGxpc3Rfdmlldy5uYW1lIDogdm9pZCAwKSA9PT0gXCJyZWNlbnRcIjtcbn07XG5cblxuLypcbiAgICDlsIZzb3J06L2s5o2i5Li6VGFidWxhcuaOp+S7tuaJgOmcgOimgeeahOagvOW8j1xuICovXG5cbkNyZWF0b3IudHJhbnNmb3JtU29ydFRvVGFidWxhciA9IGZ1bmN0aW9uKHNvcnQsIHRhYnVsYXJDb2x1bW5zKSB7XG4gIHZhciB0YWJ1bGFyX3NvcnQ7XG4gIHRhYnVsYXJfc29ydCA9IFtdO1xuICBfLmVhY2goc29ydCwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBjb2x1bW5faW5kZXgsIGZpZWxkX25hbWUsIG9yZGVyO1xuICAgIGlmIChfLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGlmIChpdGVtLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGl0ZW1bMF0pO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgXCJhc2NcIl0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0ubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGNvbHVtbl9pbmRleCA9IHRhYnVsYXJDb2x1bW5zLmluZGV4T2YoaXRlbVswXSk7XG4gICAgICAgIGlmIChjb2x1bW5faW5kZXggPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0YWJ1bGFyX3NvcnQucHVzaChbY29sdW1uX2luZGV4LCBpdGVtWzFdXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIGZpZWxkX25hbWUgPSBpdGVtLmZpZWxkX25hbWU7XG4gICAgICBvcmRlciA9IGl0ZW0ub3JkZXI7XG4gICAgICBpZiAoZmllbGRfbmFtZSAmJiBvcmRlcikge1xuICAgICAgICBjb2x1bW5faW5kZXggPSB0YWJ1bGFyQ29sdW1ucy5pbmRleE9mKGZpZWxkX25hbWUpO1xuICAgICAgICBpZiAoY29sdW1uX2luZGV4ID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGFidWxhcl9zb3J0LnB1c2goW2NvbHVtbl9pbmRleCwgb3JkZXJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0YWJ1bGFyX3NvcnQ7XG59O1xuXG5cbi8qXG4gICAg5bCGc29ydOi9rOaNouS4ukRldkV4cHJlc3Pmjqfku7bmiYDpnIDopoHnmoTmoLzlvI9cbiAqL1xuXG5DcmVhdG9yLnRyYW5zZm9ybVNvcnRUb0RYID0gZnVuY3Rpb24oc29ydCkge1xuICB2YXIgZHhfc29ydDtcbiAgZHhfc29ydCA9IFtdO1xuICBfLmVhY2goc29ydCwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBmaWVsZF9uYW1lLCBvcmRlcjtcbiAgICBpZiAoXy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZHhfc29ydC5wdXNoKGl0ZW0pO1xuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChpdGVtKSkge1xuICAgICAgZmllbGRfbmFtZSA9IGl0ZW0uZmllbGRfbmFtZTtcbiAgICAgIG9yZGVyID0gaXRlbS5vcmRlcjtcbiAgICAgIGlmIChmaWVsZF9uYW1lICYmIG9yZGVyKSB7XG4gICAgICAgIHJldHVybiBkeF9zb3J0LnB1c2goW2ZpZWxkX25hbWUsIG9yZGVyXSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGR4X3NvcnQ7XG59O1xuIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dW2EtekEtWjAtOV9dKiQnKVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRcdF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXVxuXHRcdF9yZWdFeE1lc3NhZ2VzLnB1c2gge2V4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIzkuJTlj6rog73ljIXlkKvlrZfmr43jgIHmlbDlrZfjgIFfXCJ9XG5cdFx0U2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcblx0XHRcdHJlZ0V4OiBfcmVnRXhNZXNzYWdlcyxcblx0XHR9KSIsIlNpbXBsZVNjaGVtYS5SZWdFeC5jb2RlID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVthLXpBLVowLTlfXSokJyk7XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWdFeE1lc3NhZ2VzO1xuICAgIF9yZWdFeE1lc3NhZ2VzID0gU2ltcGxlU2NoZW1hLl9nbG9iYWxNZXNzYWdlcy5yZWdFeCB8fCBbXTtcbiAgICBfcmVnRXhNZXNzYWdlcy5wdXNoKHtcbiAgICAgIGV4cDogU2ltcGxlU2NoZW1hLlJlZ0V4LmNvZGUsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yM5LiU5Y+q6IO95YyF5ZCr5a2X5q+N44CB5pWw5a2X44CBX1wiXG4gICAgfSk7XG4gICAgcmV0dXJuIFNpbXBsZVNjaGVtYS5tZXNzYWdlcyh7XG4gICAgICByZWdFeDogX3JlZ0V4TWVzc2FnZXNcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl9dXFxcXHcqKFxcXFwuXFxcXCRcXFxcLlxcXFx3Kyk/W2EtekEtWjAtOV0qJCcpXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFx0X3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdXG5cdFx0X3JlZ0V4TWVzc2FnZXMucHVzaCB7ZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsIG1zZzogXCJbbGFiZWxdIOWPquiDveS7peWtl+avjeOAgV/lvIDlpLTvvIwuJC7liY3lkI7lv4XpobvljIXlkKvlrZfnrKZcIn1cblx0XHRTaW1wbGVTY2hlbWEubWVzc2FnZXMoe1xuXHRcdFx0cmVnRXg6IF9yZWdFeE1lc3NhZ2VzLFxuXHRcdH0pIiwiU2ltcGxlU2NoZW1hLlJlZ0V4LmZpZWxkID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpfXVxcXFx3KihcXFxcLlxcXFwkXFxcXC5cXFxcdyspP1thLXpBLVowLTldKiQnKTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZ0V4TWVzc2FnZXM7XG4gICAgX3JlZ0V4TWVzc2FnZXMgPSBTaW1wbGVTY2hlbWEuX2dsb2JhbE1lc3NhZ2VzLnJlZ0V4IHx8IFtdO1xuICAgIF9yZWdFeE1lc3NhZ2VzLnB1c2goe1xuICAgICAgZXhwOiBTaW1wbGVTY2hlbWEuUmVnRXguZmllbGQsXG4gICAgICBtc2c6IFwiW2xhYmVsXSDlj6rog73ku6XlrZfmr43jgIFf5byA5aS077yMLiQu5YmN5ZCO5b+F6aG75YyF5ZCr5a2X56ymXCJcbiAgICB9KTtcbiAgICByZXR1cm4gU2ltcGxlU2NoZW1hLm1lc3NhZ2VzKHtcbiAgICAgIHJlZ0V4OiBfcmVnRXhNZXNzYWdlc1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIi8vIOWboOS4um1ldGVvcue8luivkWNvZmZlZXNjcmlwdOS8muWvvOiHtGV2YWzlh73mlbDmiqXplJnvvIzmiYDku6XljZXni6zlhpnlnKjkuIDkuKpqc+aWh+S7tuS4reOAglxuQ3JlYXRvci5ldmFsSW5Db250ZXh0ID0gZnVuY3Rpb24oanMsIGNvbnRleHQpIHtcbiAgICAvLyMgUmV0dXJuIHRoZSByZXN1bHRzIG9mIHRoZSBpbi1saW5lIGFub255bW91cyBmdW5jdGlvbiB3ZSAuY2FsbCB3aXRoIHRoZSBwYXNzZWQgY29udGV4dFxuICAgIHJldHVybiBmdW5jdGlvbigpIHsgXG4gICAgXHRyZXR1cm4gZXZhbChqcyk7IFxuXHR9LmNhbGwoY29udGV4dCk7XG59XG5cblxuQ3JlYXRvci5ldmFsID0gZnVuY3Rpb24oanMpe1xuXHR0cnl7XG5cdFx0cmV0dXJuIGV2YWwoanMpXG5cdH1jYXRjaCAoZSl7XG5cdFx0Y29uc29sZS5lcnJvcihlLCBqcyk7XG5cdH1cbn07IiwiXHRnZXRPcHRpb24gPSAob3B0aW9uKS0+XG5cdFx0Zm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKVxuXHRcdGlmIGZvby5sZW5ndGggPiAyXG5cdFx0XHRyZXR1cm4ge2xhYmVsOiBmb29bMF0sIHZhbHVlOiBmb29bMV0sIGNvbG9yOiBmb29bMl19XG5cdFx0ZWxzZSBpZiBmb28ubGVuZ3RoID4gMVxuXHRcdFx0cmV0dXJuIHtsYWJlbDogZm9vWzBdLCB2YWx1ZTogZm9vWzFdfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7bGFiZWw6IGZvb1swXSwgdmFsdWU6IGZvb1swXX1cblxuXHRjb252ZXJ0RmllbGQgPSAob2JqZWN0X25hbWUsIGZpZWxkX25hbWUsIGZpZWxkLCBzcGFjZUlkKS0+XG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PSAnc2VsZWN0J1xuXHRcdFx0Y29kZSA9IGZpZWxkLnBpY2tsaXN0IHx8IFwiI3tvYmplY3RfbmFtZX0uI3tmaWVsZF9uYW1lfVwiO1xuXHRcdFx0aWYgY29kZVxuXHRcdFx0XHRwaWNrbGlzdCA9IENyZWF0b3IuZ2V0UGlja2xpc3QoY29kZSwgc3BhY2VJZCk7XG5cdFx0XHRcdGlmIHBpY2tsaXN0XG5cdFx0XHRcdFx0b3B0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdGFsbE9wdGlvbnMgPSBbXTtcblx0XHRcdFx0XHRwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdClcblx0XHRcdFx0XHRwaWNrbGlzdE9wdGlvbnMgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJyk/LnJldmVyc2UoKTtcblx0XHRcdFx0XHRfLmVhY2ggcGlja2xpc3RPcHRpb25zLCAoaXRlbSktPlxuXHRcdFx0XHRcdFx0bGFiZWwgPSBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdHZhbHVlID0gaXRlbS52YWx1ZSB8fCBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdGFsbE9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGVuYWJsZTogaXRlbS5lbmFibGUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW5hYmxlXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnMucHVzaCh7bGFiZWw6IGxhYmVsLCB2YWx1ZTogdmFsdWUsIGNvbG9yOiBpdGVtLmNvbG9yfSlcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZGVmYXVsdFxuXHRcdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZVxuXHRcdFx0XHRcdGlmIG9wdGlvbnMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IG9wdGlvbnNcblx0XHRcdFx0XHRpZiBhbGxPcHRpb25zLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGZpZWxkLmFsbE9wdGlvbnMgPSBhbGxPcHRpb25zXG5cdFx0cmV0dXJuIGZpZWxkO1xuXG5cdENyZWF0b3IuY29udmVydE9iamVjdCA9IChvYmplY3QsIHNwYWNlSWQpLT5cblx0XHRpZiAhb2JqZWN0XG5cdFx0XHRyZXR1cm5cblx0XHRfLmZvckVhY2ggb2JqZWN0LnRyaWdnZXJzLCAodHJpZ2dlciwga2V5KS0+XG5cblx0XHRcdGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiKSB8fCAoTWV0ZW9yLmlzQ2xpZW50ICYmIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIilcblx0XHRcdFx0X3RvZG9fZnJvbV9jb2RlID0gdHJpZ2dlcj8uX3RvZG9cblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IHRyaWdnZXIudG9kb1xuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXG5cdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9jb2RlfSlcIilcblxuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYilcblx0XHRcdFx0XHQj5Y+q5pyJdXBkYXRl5pe277yMIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zIOaJjeacieWAvFxuXHRcdFx0XHRcdCNUT0RPIOaOp+WItuWPr+S9v+eUqOeahOWPmOmHj++8jOWwpOWFtuaYr0NvbGxlY3Rpb25cblx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKCN7X3RvZG9fZnJvbV9kYn0pXCIpXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0dHJpZ2dlci50b2RvID0gQ3JlYXRvci5ldmFsKFwiKGZ1bmN0aW9uKHVzZXJJZCwgZG9jLCBmaWVsZE5hbWVzLCBtb2RpZmllciwgb3B0aW9ucyl7I3tfdG9kb19mcm9tX2RifX0pXCIpXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09IFwiY2xpZW50XCJcblx0XHRcdFx0X3RvZG8gPSB0cmlnZ2VyLnRvZG9cblx0XHRcdFx0aWYgX3RvZG8gJiYgXy5pc0Z1bmN0aW9uKF90b2RvKVxuXHRcdFx0XHRcdHRyaWdnZXIuX3RvZG8gPSBfdG9kby50b1N0cmluZygpXG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XG5cdFx0XHRcdF90b2RvX2Zyb21fY29kZSA9IGFjdGlvbj8uX3RvZG9cblx0XHRcdFx0X3RvZG9fZnJvbV9kYiA9IGFjdGlvbj8udG9kb1xuXHRcdFx0XHRpZiBfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fY29kZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0b2RvX2Zyb21fY29kZVwiLCBfdG9kb19mcm9tX2NvZGVcblx0XHRcdFx0aWYgX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpXG5cdFx0XHRcdFx0I1RPRE8g5o6n5Yi25Y+v5L2/55So55qE5Y+Y6YePXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRpZiBfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRcdFx0XHRhY3Rpb24udG9kbyA9IENyZWF0b3IuZXZhbChcIigje190b2RvX2Zyb21fZGJ9KVwiKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oQ3JlYXRvci5hY3Rpb25zQnlOYW1lW190b2RvX2Zyb21fZGJdKVxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbi50b2RvID0gX3RvZG9fZnJvbV9kYlxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0YWN0aW9uLnRvZG8gPSBDcmVhdG9yLmV2YWwoXCIoZnVuY3Rpb24oKXsje190b2RvX2Zyb21fZGJ9fSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcInRvZG9fZnJvbV9kYlwiLCBfdG9kb19mcm9tX2RiLCBlcnJvclxuXG5cdFx0XHRcdF92aXNpYmxlID0gYWN0aW9uPy5fdmlzaWJsZVxuXHRcdFx0XHRpZiBfdmlzaWJsZVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0YWN0aW9uLnZpc2libGUgPSBDcmVhdG9yLmV2YWwoXCIoI3tfdmlzaWJsZX0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhY3Rpb24udmlzaWJsZSB0byBmdW5jdGlvbiBlcnJvcjogXCIsIGVycm9yLCBfdmlzaWJsZVxuXHRcdGVsc2Vcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QuYWN0aW9ucywgKGFjdGlvbiwga2V5KS0+XG5cdFx0XHRcdF90b2RvID0gYWN0aW9uPy50b2RvXG5cdFx0XHRcdGlmIF90b2RvICYmIF8uaXNGdW5jdGlvbihfdG9kbylcblx0XHRcdFx0XHQjVE9ETyDmjqfliLblj6/kvb/nlKjnmoTlj5jph49cblx0XHRcdFx0XHRhY3Rpb24uX3RvZG8gPSBfdG9kby50b1N0cmluZygpXG5cblx0XHRcdFx0X3Zpc2libGUgPSBhY3Rpb24/LnZpc2libGVcblxuXHRcdFx0XHRpZiBfdmlzaWJsZSAmJiBfLmlzRnVuY3Rpb24oX3Zpc2libGUpXG5cdFx0XHRcdFx0YWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKVxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5maWVsZHMsIChmaWVsZCwga2V5KS0+XG5cblx0XHRcdGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcblxuXHRcdFx0aWYgZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0XHQj5pSv5oyBXFxu5oiW6ICF6Iux5paH6YCX5Y+35YiG5YmyLFxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLnNwbGl0KFwiXFxuXCIpLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBvcHRpb24uaW5kZXhPZihcIixcIilcblx0XHRcdFx0XHRcdFx0b3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIilcblx0XHRcdFx0XHRcdFx0Xy5mb3JFYWNoIG9wdGlvbnMsIChfb3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24oX29wdGlvbikpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKG9wdGlvbikpXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRfb3B0aW9ucyA9IFtdXG5cdFx0XHRcdFx0I+aUr+aMgeaVsOe7hOS4reebtOaOpeWumuS5ieavj+S4qumAiemhueeahOeugOeJiOagvOW8j+Wtl+espuS4slxuXHRcdFx0XHRcdF8uZm9yRWFjaCBmaWVsZC5vcHRpb25zLCAob3B0aW9uKS0+XG5cdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKG9wdGlvbilcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSlcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X29wdGlvbnMucHVzaChvcHRpb24pXG5cdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IF9vcHRpb25zXG5cdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIkNyZWF0b3IuY29udmVydEZpZWxkc09wdGlvbnNcIiwgZmllbGQub3B0aW9ucywgZXJyb3JcblxuXHRcdFx0ZWxzZSBpZiBmaWVsZC5vcHRpb25zICYmICFfLmlzRnVuY3Rpb24oZmllbGQub3B0aW9ucykgJiYgIV8uaXNBcnJheShmaWVsZC5vcHRpb25zKSAmJiBfLmlzT2JqZWN0KGZpZWxkLm9wdGlvbnMpXG5cdFx0XHRcdF9vcHRpb25zID0gW11cblx0XHRcdFx0Xy5lYWNoIGZpZWxkLm9wdGlvbnMsICh2LCBrKS0+XG5cdFx0XHRcdFx0X29wdGlvbnMucHVzaCB7bGFiZWw6IHYsIHZhbHVlOiBrfVxuXHRcdFx0XHRmaWVsZC5vcHRpb25zID0gX29wdGlvbnNcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG9wdGlvbnMgPSBmaWVsZC5vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0b3B0aW9ucyA9IGZpZWxkLl9vcHRpb25zXG5cdFx0XHRcdGlmIG9wdGlvbnMgJiYgXy5pc1N0cmluZyhvcHRpb25zKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQub3B0aW9ucyA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnN9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLnJlZ0V4XG5cdFx0XHRcdGlmIHJlZ0V4XG5cdFx0XHRcdFx0ZmllbGQuX3JlZ0V4ID0gZmllbGQucmVnRXgudG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZWdFeCA9IGZpZWxkLl9yZWdFeFxuXHRcdFx0XHRpZiByZWdFeFxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQucmVnRXggPSBDcmVhdG9yLmV2YWwoXCIoI3tyZWdFeH0pXCIpXG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGVycm9yICN7b2JqZWN0Lm5hbWV9IC0+ICN7ZmllbGQubmFtZX1cIiwgZXJyb3JcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdG1pbiA9IGZpZWxkLm1pblxuXHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24obWluKVxuXHRcdFx0XHRcdGZpZWxkLl9taW4gPSBtaW4udG9TdHJpbmcoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtaW4gPSBmaWVsZC5fbWluXG5cdFx0XHRcdGlmIF8uaXNTdHJpbmcobWluKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQubWluID0gQ3JlYXRvci5ldmFsKFwiKCN7bWlufSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdFx0bWF4ID0gZmllbGQubWF4XG5cdFx0XHRcdGlmIF8uaXNGdW5jdGlvbihtYXgpXG5cdFx0XHRcdFx0ZmllbGQuX21heCA9IG1heC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG1heCA9IGZpZWxkLl9tYXhcblx0XHRcdFx0aWYgXy5pc1N0cmluZyhtYXgpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5tYXggPSBDcmVhdG9yLmV2YWwoXCIoI3ttYXh9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpZiBmaWVsZC5hdXRvZm9ybVxuXHRcdFx0XHRcdF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT0gT2JqZWN0ICYmIF90eXBlICE9IFN0cmluZyAmJiBfdHlwZSAhPSBOdW1iZXIgJiYgX3R5cGUgIT0gQm9vbGVhbiAmJiAhXy5pc0FycmF5KF90eXBlKVxuXHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0uX3R5cGUgPSBfdHlwZS50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIGZpZWxkLmF1dG9mb3JtXG5cdFx0XHRcdFx0X3R5cGUgPSBmaWVsZC5hdXRvZm9ybS5fdHlwZVxuXHRcdFx0XHRcdGlmIF90eXBlICYmIF8uaXNTdHJpbmcoX3R5cGUpXG5cdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0ZmllbGQuYXV0b2Zvcm0udHlwZSA9IENyZWF0b3IuZXZhbChcIigje190eXBlfSlcIilcblx0XHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjb252ZXJ0IGZpZWxkIC0+IHR5cGUgZXJyb3JcIiwgZmllbGQsIGVycm9yXG5cblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXG5cdFx0XHRcdG9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvblxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblx0XHRcdFx0Y3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5iZWZvcmVPcGVuRnVuY3Rpb25cblx0XHRcdFx0ZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihvcHRpb25zRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX29wdGlvbnNGdW5jdGlvbiA9IG9wdGlvbnNGdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0ZmllbGQuX3JlZmVyZW5jZV90byA9IHJlZmVyZW5jZV90by50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGNyZWF0ZUZ1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKClcblx0XHRcdFx0aWYgYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2JlZm9yZU9wZW5GdW5jdGlvbiA9IGJlZm9yZU9wZW5GdW5jdGlvbi50b1N0cmluZygpXG5cblx0XHRcdFx0aWYgZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cblx0XHRcdFx0b3B0aW9uc0Z1bmN0aW9uID0gZmllbGQuX29wdGlvbnNGdW5jdGlvbiB8fCBmaWVsZC5vcHRpb25zRnVuY3Rpb25cblx0XHRcdFx0cmVmZXJlbmNlX3RvID0gZmllbGQuX3JlZmVyZW5jZV90b1xuXHRcdFx0XHRjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRiZWZvcmVPcGVuRnVuY3Rpb24gPSBmaWVsZC5fYmVmb3JlT3BlbkZ1bmN0aW9uXG5cdFx0XHRcdGZpbHRlcnNGdW5jdGlvbiA9IGZpZWxkLl9maWx0ZXJzRnVuY3Rpb24gfHwgZmllbGQuZmlsdGVyc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgb3B0aW9uc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcob3B0aW9uc0Z1bmN0aW9uKVxuXHRcdFx0XHRcdGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje29wdGlvbnNGdW5jdGlvbn0pXCIpXG5cblx0XHRcdFx0aWYgcmVmZXJlbmNlX3RvICYmIF8uaXNTdHJpbmcocmVmZXJlbmNlX3RvKVxuXHRcdFx0XHRcdGZpZWxkLnJlZmVyZW5jZV90byA9IENyZWF0b3IuZXZhbChcIigje3JlZmVyZW5jZV90b30pXCIpXG5cblx0XHRcdFx0aWYgY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRmaWVsZC5jcmVhdGVGdW5jdGlvbiA9IENyZWF0b3IuZXZhbChcIigje2NyZWF0ZUZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBiZWZvcmVPcGVuRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhiZWZvcmVPcGVuRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7YmVmb3JlT3BlbkZ1bmN0aW9ufSlcIilcblxuXHRcdFx0XHRpZiBmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhmaWx0ZXJzRnVuY3Rpb24pXG5cdFx0XHRcdFx0ZmllbGQuZmlsdGVyc0Z1bmN0aW9uID0gQ3JlYXRvci5ldmFsKFwiKCN7ZmlsdGVyc0Z1bmN0aW9ufSlcIilcblxuXHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSlcblx0XHRcdFx0XHRmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZGVmYXVsdFZhbHVlID0gZmllbGQuX2RlZmF1bHRWYWx1ZVxuXG5cdFx0XHRcdGlmICFkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhmaWVsZC5kZWZhdWx0VmFsdWUpICYmIGZpZWxkLmRlZmF1bHRWYWx1ZS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIilcblx0XHRcdFx0XHRkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWVcblxuXHRcdFx0XHRpZiBkZWZhdWx0VmFsdWUgJiYgXy5pc1N0cmluZyhkZWZhdWx0VmFsdWUpXG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRmaWVsZC5kZWZhdWx0VmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tkZWZhdWx0VmFsdWV9KVwiKVxuXHRcdFx0XHRcdGNhdGNoIGVycm9yXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY29udmVydCBlcnJvciAje29iamVjdC5uYW1lfSAtPiAje2ZpZWxkLm5hbWV9XCIsIGVycm9yXG5cdFx0XHRcblx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNGdW5jdGlvbihpc19jb21wYW55X2xpbWl0ZWQpXG5cdFx0XHRcdFx0ZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLl9pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0aWYgaXNfY29tcGFueV9saW1pdGVkICYmIF8uaXNTdHJpbmcoaXNfY29tcGFueV9saW1pdGVkKVxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0ZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvci5ldmFsKFwiKCN7aXNfY29tcGFueV9saW1pdGVkfSlcIilcblx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNvbnZlcnQgZXJyb3IgI3tvYmplY3QubmFtZX0gLT4gI3tmaWVsZC5uYW1lfVwiLCBlcnJvclxuXG5cdFx0Xy5mb3JFYWNoIG9iamVjdC5saXN0X3ZpZXdzLCAobGlzdF92aWV3LCBrZXkpIC0+XG5cdFx0XHQjIyNcblx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuXHRcdFx06K6p6L+H6JmR5Zmo5pSv5oyB5Lik56eNZnVuY3Rpb27mlrnlvI/vvJpcblx0XHRcdDEuIOaVtOS4qmZpbHRlcnPkuLpmdW5jdGlvbjpcblx0XHRcdOWmgu+8mlxuXHRcdFx0ZmlsdGVyczogKCktPlxuXHRcdFx0XHRyZXR1cm4gW1tbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwicHJvamVjdF9pc3N1ZXNcIl0sJ29yJyxbXCJvYmplY3RfbmFtZVwiLFwiPVwiLFwidGFza3NcIl1dXVxuXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG5cdFx0XHTlpoLvvJpcblx0XHRcdGZpbHRlcnM6IFtbXCJvYmplY3RfbmFtZVwiLCBcIj1cIiwgKCktPlxuXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHRdXVxuXHRcdFx05oiWXG5cdFx0XHRmaWx0ZXJzOiBbe1xuXHRcdFx0XHRcImZpZWxkXCI6IFwib2JqZWN0X25hbWVcIlxuXHRcdFx0XHRcIm9wZXJhdGlvblwiOiBcIj1cIlxuXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cblx0XHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG5cdFx0XHR9XVxuXHRcdFx0IyMjXG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24obGlzdF92aWV3LmZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKClcblx0XHRcdGVsc2UgaWYgXy5pc1N0cmluZyhsaXN0X3ZpZXcuX2ZpbHRlcnMpXG5cdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvci5ldmFsKFwiKCN7bGlzdF92aWV3Ll9maWx0ZXJzfSlcIilcblx0XHRcdGVsc2Vcblx0XHRcdFx0Xy5mb3JFYWNoIGxpc3Rfdmlldy5maWx0ZXJzLCAoZmlsdGVyLCBfaW5kZXgpLT5cblx0XHRcdFx0XHRpZiBfLmlzQXJyYXkoZmlsdGVyKVxuXHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0Z1bmN0aW9uKGZpbHRlclsyXSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBmaWx0ZXJbMl0udG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclszXSA9IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmIGZpbHRlci5sZW5ndGggPT0gMyBhbmQgXy5pc0RhdGUoZmlsdGVyWzJdKVxuXHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5pivRGF0Zeexu+Wei++8jOWImWZpbHRlclsyXeWAvOWIsOWJjeerr+S8muiHquWKqOi9rOaIkOWtl+espuS4su+8jOagvOW8j++8mlwiMjAxOC0wMy0yOVQwMzo0MzoyMS43ODdaXCJcblx0XHRcdFx0XHRcdFx0XHQjIOWMheaLrGdyaWTliJfooajor7fmsYLnmoTmjqXlj6PlnKjlhoXnmoTmiYDmnIlPRGF0YeaOpeWPo++8jERhdGXnsbvlnovlrZfmrrXpg73kvJrku6XkuIrov7DmoLzlvI/ov5Tlm55cblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbM10gPSBcIkRBVEVcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBmaWx0ZXIubGVuZ3RoID09IDQgYW5kIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSBhbmQgZmlsdGVyWzNdID09IFwiRlVOQ1RJT05cIlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlclsyXSA9IENyZWF0b3IuZXZhbChcIigje2ZpbHRlclsyXX0pXCIpXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0XHRcdGlmIGZpbHRlci5sZW5ndGggPT0gNCBhbmQgXy5pc1N0cmluZyhmaWx0ZXJbMl0pIGFuZCBmaWx0ZXJbM10gPT0gXCJEQVRFXCJcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJbMl0gPSBuZXcgRGF0ZShmaWx0ZXJbMl0pXG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyLnBvcCgpXG5cdFx0XHRcdFx0ZWxzZSBpZiBfLmlzT2JqZWN0KGZpbHRlcilcblx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzRnVuY3Rpb24oZmlsdGVyPy52YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKClcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBfLmlzRGF0ZShmaWx0ZXI/LnZhbHVlKVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci5faXNfZGF0ZSA9IHRydWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgXy5pc1N0cmluZyhmaWx0ZXI/Ll92YWx1ZSlcblx0XHRcdFx0XHRcdFx0XHRmaWx0ZXIudmFsdWUgPSBDcmVhdG9yLmV2YWwoXCIoI3tmaWx0ZXIuX3ZhbHVlfSlcIilcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBmaWx0ZXIuX2lzX2RhdGUgPT0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSlcblxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0aWYgb2JqZWN0LmZvcm0gJiYgIV8uaXNTdHJpbmcob2JqZWN0LmZvcm0pXG5cdFx0XHRcdG9iamVjdC5mb3JtID0gSlNPTi5zdHJpbmdpZnkgb2JqZWN0LmZvcm0sIChrZXksIHZhbCktPlxuXHRcdFx0XHRcdGlmIF8uaXNGdW5jdGlvbih2YWwpXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsICsgJyc7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRlbHNlIGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgb2JqZWN0LmZvcm1cblx0XHRcdFx0b2JqZWN0LmZvcm0gPSBKU09OLnBhcnNlIG9iamVjdC5mb3JtLCAoa2V5LCB2YWwpLT5cblx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKHZhbCkgJiYgdmFsLnN0YXJ0c1dpdGgoJ2Z1bmN0aW9uJylcblx0XHRcdFx0XHRcdHJldHVybiBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiB2YWw7XG5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdF8uZm9yRWFjaCBvYmplY3QucmVsYXRlZF9saXN0cywgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkX2xpc3RzLCAocmVsYXRlZE9iakluZm8pLT5cblx0XHRcdFx0aWYgXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbylcblx0XHRcdFx0XHRfLmZvckVhY2ggcmVsYXRlZE9iakluZm8sICh2YWwsIGtleSktPlxuXHRcdFx0XHRcdFx0aWYga2V5ID09ICdmaWx0ZXJzJyAmJiBfLmlzRnVuY3Rpb24odmFsKVxuXHRcdFx0XHRcdFx0XHRyZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKClcblxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpXG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yLmV2YWwoXCIoI3t2YWx9KVwiKVxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJvclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaWx0ZXJzX2NvZGVcIiwgdmFsXG5cdFx0ZWxzZVxuXHRcdFx0Xy5mb3JFYWNoIG9iamVjdC5yZWxhdGVkTGlzdCwgKHJlbGF0ZWRPYmpJbmZvKS0+XG5cdFx0XHRcdGlmIF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pXG5cdFx0XHRcdFx0Xy5mb3JFYWNoIHJlbGF0ZWRPYmpJbmZvLCAodmFsLCBrZXkpLT5cblx0XHRcdFx0XHRcdGlmIGtleSA9PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbClcblx0XHRcdFx0XHRcdFx0cmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpXG5cblx0XHRyZXR1cm4gb2JqZWN0XG5cblxuIiwidmFyIGNvbnZlcnRGaWVsZCwgZ2V0T3B0aW9uO1xuXG5nZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgdmFyIGZvbztcbiAgZm9vID0gb3B0aW9uLnNwbGl0KFwiOlwiKTtcbiAgaWYgKGZvby5sZW5ndGggPiAyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiBmb29bMF0sXG4gICAgICB2YWx1ZTogZm9vWzFdLFxuICAgICAgY29sb3I6IGZvb1syXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZm9vLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IGZvb1swXSxcbiAgICAgIHZhbHVlOiBmb29bMV1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogZm9vWzBdLFxuICAgICAgdmFsdWU6IGZvb1swXVxuICAgIH07XG4gIH1cbn07XG5cbmNvbnZlcnRGaWVsZCA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZCwgc3BhY2VJZCkge1xuICB2YXIgYWxsT3B0aW9ucywgY29kZSwgb3B0aW9ucywgcGlja2xpc3QsIHBpY2tsaXN0T3B0aW9ucywgcmVmO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIHNwYWNlSWQgJiYgZmllbGQudHlwZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICBjb2RlID0gZmllbGQucGlja2xpc3QgfHwgKG9iamVjdF9uYW1lICsgXCIuXCIgKyBmaWVsZF9uYW1lKTtcbiAgICBpZiAoY29kZSkge1xuICAgICAgcGlja2xpc3QgPSBDcmVhdG9yLmdldFBpY2tsaXN0KGNvZGUsIHNwYWNlSWQpO1xuICAgICAgaWYgKHBpY2tsaXN0KSB7XG4gICAgICAgIG9wdGlvbnMgPSBbXTtcbiAgICAgICAgYWxsT3B0aW9ucyA9IFtdO1xuICAgICAgICBwaWNrbGlzdE9wdGlvbnMgPSBDcmVhdG9yLmdldFBpY2tMaXN0T3B0aW9ucyhwaWNrbGlzdCk7XG4gICAgICAgIHBpY2tsaXN0T3B0aW9ucyA9IChyZWYgPSBfLnNvcnRCeShwaWNrbGlzdE9wdGlvbnMsICdzb3J0X25vJykpICE9IG51bGwgPyByZWYucmV2ZXJzZSgpIDogdm9pZCAwO1xuICAgICAgICBfLmVhY2gocGlja2xpc3RPcHRpb25zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgdmFyIGxhYmVsLCB2YWx1ZTtcbiAgICAgICAgICBsYWJlbCA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWUgfHwgaXRlbS5uYW1lO1xuICAgICAgICAgIGFsbE9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbmFibGU6IGl0ZW0uZW5hYmxlLFxuICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaXRlbS5lbmFibGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtW1wiZGVmYXVsdFwiXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGQuYWxsT3B0aW9ucyA9IGFsbE9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufTtcblxuQ3JlYXRvci5jb252ZXJ0T2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0LCBzcGFjZUlkKSB7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIF8uZm9yRWFjaChvYmplY3QudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIGtleSkge1xuICAgIHZhciBfdG9kbywgX3RvZG9fZnJvbV9jb2RlLCBfdG9kb19mcm9tX2RiO1xuICAgIGlmICgoTWV0ZW9yLmlzU2VydmVyICYmIHRyaWdnZXIub24gPT09IFwic2VydmVyXCIpIHx8IChNZXRlb3IuaXNDbGllbnQgJiYgdHJpZ2dlci5vbiA9PT0gXCJjbGllbnRcIikpIHtcbiAgICAgIF90b2RvX2Zyb21fY29kZSA9IHRyaWdnZXIgIT0gbnVsbCA/IHRyaWdnZXIuX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gdHJpZ2dlci50b2RvO1xuICAgICAgaWYgKF90b2RvX2Zyb21fY29kZSAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fY29kZSkpIHtcbiAgICAgICAgdHJpZ2dlci50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2NvZGUgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoX3RvZG9fZnJvbV9kYiAmJiBfLmlzU3RyaW5nKF90b2RvX2Zyb21fZGIpKSB7XG4gICAgICAgIGlmIChfdG9kb19mcm9tX2RiLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgIHRyaWdnZXIudG9kbyA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3RvZG9fZnJvbV9kYiArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmlnZ2VyLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiKSB7XG4gICAgICBfdG9kbyA9IHRyaWdnZXIudG9kbztcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyLl90b2RvID0gX3RvZG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvX2Zyb21fY29kZSwgX3RvZG9fZnJvbV9kYiwgX3Zpc2libGUsIGVycm9yO1xuICAgICAgX3RvZG9fZnJvbV9jb2RlID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24uX3RvZG8gOiB2b2lkIDA7XG4gICAgICBfdG9kb19mcm9tX2RiID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kb19mcm9tX2NvZGUgJiYgXy5pc1N0cmluZyhfdG9kb19mcm9tX2NvZGUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIF90b2RvX2Zyb21fY29kZSArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInRvZG9fZnJvbV9jb2RlXCIsIF90b2RvX2Zyb21fY29kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChfdG9kb19mcm9tX2RiICYmIF8uaXNTdHJpbmcoX3RvZG9fZnJvbV9kYikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX3RvZG9fZnJvbV9kYi5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICAgIGFjdGlvbi50b2RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdG9kb19mcm9tX2RiICsgXCIpXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKENyZWF0b3IuYWN0aW9uc0J5TmFtZVtfdG9kb19mcm9tX2RiXSkpIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBfdG9kb19mcm9tX2RiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWN0aW9uLnRvZG8gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihmdW5jdGlvbigpe1wiICsgX3RvZG9fZnJvbV9kYiArIFwifSlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwidG9kb19mcm9tX2RiXCIsIF90b2RvX2Zyb21fZGIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3Zpc2libGUgPSBhY3Rpb24gIT0gbnVsbCA/IGFjdGlvbi5fdmlzaWJsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChfdmlzaWJsZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgX3Zpc2libGUgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiYWN0aW9uLnZpc2libGUgdG8gZnVuY3Rpb24gZXJyb3I6IFwiLCBlcnJvciwgX3Zpc2libGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5hY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIGtleSkge1xuICAgICAgdmFyIF90b2RvLCBfdmlzaWJsZTtcbiAgICAgIF90b2RvID0gYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMDtcbiAgICAgIGlmIChfdG9kbyAmJiBfLmlzRnVuY3Rpb24oX3RvZG8pKSB7XG4gICAgICAgIGFjdGlvbi5fdG9kbyA9IF90b2RvLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBfdmlzaWJsZSA9IGFjdGlvbiAhPSBudWxsID8gYWN0aW9uLnZpc2libGUgOiB2b2lkIDA7XG4gICAgICBpZiAoX3Zpc2libGUgJiYgXy5pc0Z1bmN0aW9uKF92aXNpYmxlKSkge1xuICAgICAgICByZXR1cm4gYWN0aW9uLl92aXNpYmxlID0gX3Zpc2libGUudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBfLmZvckVhY2gob2JqZWN0LmZpZWxkcywgZnVuY3Rpb24oZmllbGQsIGtleSkge1xuICAgIHZhciBfb3B0aW9ucywgX3R5cGUsIGJlZm9yZU9wZW5GdW5jdGlvbiwgY3JlYXRlRnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSwgZXJyb3IsIGZpbHRlcnNGdW5jdGlvbiwgaXNfY29tcGFueV9saW1pdGVkLCBtYXgsIG1pbiwgb3B0aW9ucywgb3B0aW9uc0Z1bmN0aW9uLCByZWZlcmVuY2VfdG8sIHJlZ0V4O1xuICAgIGZpZWxkID0gY29udmVydEZpZWxkKG9iamVjdC5uYW1lLCBrZXksIGZpZWxkLCBzcGFjZUlkKTtcbiAgICBpZiAoZmllbGQub3B0aW9ucyAmJiBfLmlzU3RyaW5nKGZpZWxkLm9wdGlvbnMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfb3B0aW9ucyA9IFtdO1xuICAgICAgICBfLmZvckVhY2goZmllbGQub3B0aW9ucy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgaWYgKG9wdGlvbi5pbmRleE9mKFwiLFwiKSkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgICAgICByZXR1cm4gXy5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKF9vcHRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2goZ2V0T3B0aW9uKF9vcHRpb24pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaChnZXRPcHRpb24ob3B0aW9uKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZmllbGQub3B0aW9ucyA9IF9vcHRpb25zO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5jb252ZXJ0RmllbGRzT3B0aW9uc1wiLCBmaWVsZC5vcHRpb25zLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC5vcHRpb25zICYmIF8uaXNBcnJheShmaWVsZC5vcHRpb25zKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX29wdGlvbnMgPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpZWxkLm9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgIGlmIChfLmlzU3RyaW5nKG9wdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiBfb3B0aW9ucy5wdXNoKGdldE9wdGlvbihvcHRpb24pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaWVsZC5vcHRpb25zID0gX29wdGlvbnM7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLmNvbnZlcnRGaWVsZHNPcHRpb25zXCIsIGZpZWxkLm9wdGlvbnMsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLm9wdGlvbnMgJiYgIV8uaXNGdW5jdGlvbihmaWVsZC5vcHRpb25zKSAmJiAhXy5pc0FycmF5KGZpZWxkLm9wdGlvbnMpICYmIF8uaXNPYmplY3QoZmllbGQub3B0aW9ucykpIHtcbiAgICAgIF9vcHRpb25zID0gW107XG4gICAgICBfLmVhY2goZmllbGQub3B0aW9ucywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICByZXR1cm4gX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbGFiZWw6IHYsXG4gICAgICAgICAgdmFsdWU6IGtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZpZWxkLm9wdGlvbnMgPSBfb3B0aW9ucztcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgb3B0aW9ucyA9IGZpZWxkLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucyAmJiBfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAgICAgZmllbGQuX29wdGlvbnMgPSBmaWVsZC5vcHRpb25zLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMgPSBmaWVsZC5fb3B0aW9ucztcbiAgICAgIGlmIChvcHRpb25zICYmIF8uaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWVsZC5vcHRpb25zID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBvcHRpb25zICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmVnRXggPSBmaWVsZC5yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICBmaWVsZC5fcmVnRXggPSBmaWVsZC5yZWdFeC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdFeCA9IGZpZWxkLl9yZWdFeDtcbiAgICAgIGlmIChyZWdFeCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLnJlZ0V4ID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWdFeCArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZXJyb3IgXCIgKyBvYmplY3QubmFtZSArIFwiIC0+IFwiICsgZmllbGQubmFtZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIG1pbiA9IGZpZWxkLm1pbjtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24obWluKSkge1xuICAgICAgICBmaWVsZC5fbWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pbiA9IGZpZWxkLl9taW47XG4gICAgICBpZiAoXy5pc1N0cmluZyhtaW4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmllbGQubWluID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBtaW4gKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjb252ZXJ0IGVycm9yIFwiICsgb2JqZWN0Lm5hbWUgKyBcIiAtPiBcIiArIGZpZWxkLm5hbWUsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBtYXggPSBmaWVsZC5tYXg7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG1heCkpIHtcbiAgICAgICAgZmllbGQuX21heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXggPSBmaWVsZC5fbWF4O1xuICAgICAgaWYgKF8uaXNTdHJpbmcobWF4KSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLm1heCA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgbWF4ICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0udHlwZTtcbiAgICAgICAgaWYgKF90eXBlICYmIF8uaXNGdW5jdGlvbihfdHlwZSkgJiYgX3R5cGUgIT09IE9iamVjdCAmJiBfdHlwZSAhPT0gU3RyaW5nICYmIF90eXBlICE9PSBOdW1iZXIgJiYgX3R5cGUgIT09IEJvb2xlYW4gJiYgIV8uaXNBcnJheShfdHlwZSkpIHtcbiAgICAgICAgICBmaWVsZC5hdXRvZm9ybS5fdHlwZSA9IF90eXBlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZpZWxkLmF1dG9mb3JtKSB7XG4gICAgICAgIF90eXBlID0gZmllbGQuYXV0b2Zvcm0uX3R5cGU7XG4gICAgICAgIGlmIChfdHlwZSAmJiBfLmlzU3RyaW5nKF90eXBlKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWVsZC5hdXRvZm9ybS50eXBlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBfdHlwZSArIFwiKVwiKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNvbnZlcnQgZmllbGQgLT4gdHlwZSBlcnJvclwiLCBmaWVsZCwgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5vcHRpb25zRnVuY3Rpb247XG4gICAgICByZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLmNyZWF0ZUZ1bmN0aW9uO1xuICAgICAgYmVmb3JlT3BlbkZ1bmN0aW9uID0gZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uO1xuICAgICAgZmlsdGVyc0Z1bmN0aW9uID0gZmllbGQuZmlsdGVyc0Z1bmN0aW9uO1xuICAgICAgaWYgKG9wdGlvbnNGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24ob3B0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uID0gb3B0aW9uc0Z1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAocmVmZXJlbmNlX3RvICYmIF8uaXNGdW5jdGlvbihyZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgIGZpZWxkLl9yZWZlcmVuY2VfdG8gPSByZWZlcmVuY2VfdG8udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChjcmVhdGVGdW5jdGlvbiAmJiBfLmlzRnVuY3Rpb24oY3JlYXRlRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAoYmVmb3JlT3BlbkZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihiZWZvcmVPcGVuRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb24gPSBiZWZvcmVPcGVuRnVuY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXJzRnVuY3Rpb24gJiYgXy5pc0Z1bmN0aW9uKGZpbHRlcnNGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuX2ZpbHRlcnNGdW5jdGlvbiA9IGZpbHRlcnNGdW5jdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zRnVuY3Rpb24gPSBmaWVsZC5fb3B0aW9uc0Z1bmN0aW9uIHx8IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgIHJlZmVyZW5jZV90byA9IGZpZWxkLl9yZWZlcmVuY2VfdG87XG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZpZWxkLl9jcmVhdGVGdW5jdGlvbjtcbiAgICAgIGJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLl9iZWZvcmVPcGVuRnVuY3Rpb247XG4gICAgICBmaWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5fZmlsdGVyc0Z1bmN0aW9uIHx8IGZpZWxkLmZpbHRlcnNGdW5jdGlvbjtcbiAgICAgIGlmIChvcHRpb25zRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhvcHRpb25zRnVuY3Rpb24pKSB7XG4gICAgICAgIGZpZWxkLm9wdGlvbnNGdW5jdGlvbiA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgb3B0aW9uc0Z1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlZmVyZW5jZV90byAmJiBfLmlzU3RyaW5nKHJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgZmllbGQucmVmZXJlbmNlX3RvID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyByZWZlcmVuY2VfdG8gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlRnVuY3Rpb24gJiYgXy5pc1N0cmluZyhjcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuY3JlYXRlRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGNyZWF0ZUZ1bmN0aW9uICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGJlZm9yZU9wZW5GdW5jdGlvbiAmJiBfLmlzU3RyaW5nKGJlZm9yZU9wZW5GdW5jdGlvbikpIHtcbiAgICAgICAgZmllbGQuYmVmb3JlT3BlbkZ1bmN0aW9uID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBiZWZvcmVPcGVuRnVuY3Rpb24gKyBcIilcIik7XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyc0Z1bmN0aW9uICYmIF8uaXNTdHJpbmcoZmlsdGVyc0Z1bmN0aW9uKSkge1xuICAgICAgICBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIGZpbHRlcnNGdW5jdGlvbiArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKGRlZmF1bHRWYWx1ZSAmJiBfLmlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBmaWVsZC5fZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGZpZWxkLl9kZWZhdWx0VmFsdWU7XG4gICAgICBpZiAoIWRlZmF1bHRWYWx1ZSAmJiBfLmlzU3RyaW5nKGZpZWxkLmRlZmF1bHRWYWx1ZSkgJiYgZmllbGQuZGVmYXVsdFZhbHVlLnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSkge1xuICAgICAgICBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIF8uaXNTdHJpbmcoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgZGVmYXVsdFZhbHVlICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzRnVuY3Rpb24oaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICByZXR1cm4gZmllbGQuX2lzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZC50b1N0cmluZygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5faXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgaWYgKGlzX2NvbXBhbnlfbGltaXRlZCAmJiBfLmlzU3RyaW5nKGlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gZmllbGQuaXNfY29tcGFueV9saW1pdGVkID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBpc19jb21wYW55X2xpbWl0ZWQgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiY29udmVydCBlcnJvciBcIiArIG9iamVjdC5uYW1lICsgXCIgLT4gXCIgKyBmaWVsZC5uYW1lLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBfLmZvckVhY2gob2JqZWN0Lmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGxpc3Rfdmlldywga2V5KSB7XG5cbiAgICAvKlxuICAgIFx0XHRcdOinhuWbvui/h+iZkeWZqOmcgOimgeaUr+aMgWZ1bmN0aW9u77yM5ZCO5Y+w6L2s5oiQ5a2X56ym5Liy77yM5YmN5Y+wZXZhbOaIkOWHveaVsFxuICAgIFx0XHRcdOiuqei/h+iZkeWZqOaUr+aMgeS4pOenjWZ1bmN0aW9u5pa55byP77yaXG4gICAgXHRcdFx0MS4g5pW05LiqZmlsdGVyc+S4umZ1bmN0aW9uOlxuICAgIFx0XHRcdOWmgu+8mlxuICAgIFx0XHRcdGZpbHRlcnM6ICgpLT5cbiAgICBcdFx0XHRcdHJldHVybiBbW1tcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJwcm9qZWN0X2lzc3Vlc1wiXSwnb3InLFtcIm9iamVjdF9uYW1lXCIsXCI9XCIsXCJ0YXNrc1wiXV1dXG4gICAgXHRcdFx0Mi4gZmlsdGVyc+WGheeahGZpbHRlci52YWx1ZeS4umZ1bmN0aW9uXG4gICAgXHRcdFx05aaC77yaXG4gICAgXHRcdFx0ZmlsdGVyczogW1tcIm9iamVjdF9uYW1lXCIsIFwiPVwiLCAoKS0+XG4gICAgXHRcdFx0XHRyZXR1cm4gXCJwcm9qZWN0X2lzc3Vlc1wiXG4gICAgXHRcdFx0XV1cbiAgICBcdFx0XHTmiJZcbiAgICBcdFx0XHRmaWx0ZXJzOiBbe1xuICAgIFx0XHRcdFx0XCJmaWVsZFwiOiBcIm9iamVjdF9uYW1lXCJcbiAgICBcdFx0XHRcdFwib3BlcmF0aW9uXCI6IFwiPVwiXG4gICAgXHRcdFx0XHRcInZhbHVlXCI6ICgpLT5cbiAgICBcdFx0XHRcdFx0cmV0dXJuIFwicHJvamVjdF9pc3N1ZXNcIlxuICAgIFx0XHRcdH1dXG4gICAgICovXG4gICAgaWYgKF8uaXNGdW5jdGlvbihsaXN0X3ZpZXcuZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5fZmlsdGVycyA9IGxpc3Rfdmlldy5maWx0ZXJzLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGxpc3Rfdmlldy5fZmlsdGVycykpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Rfdmlldy5maWx0ZXJzID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBsaXN0X3ZpZXcuX2ZpbHRlcnMgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBfLmZvckVhY2gobGlzdF92aWV3LmZpbHRlcnMsIGZ1bmN0aW9uKGZpbHRlciwgX2luZGV4KSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNGdW5jdGlvbihmaWx0ZXJbMl0pKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IGZpbHRlclsyXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyWzNdID0gXCJGVU5DVElPTlwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubGVuZ3RoID09PSAzICYmIF8uaXNEYXRlKGZpbHRlclsyXSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclszXSA9IFwiREFURVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyLmxlbmd0aCA9PT0gNCAmJiBfLmlzU3RyaW5nKGZpbHRlclsyXSkgJiYgZmlsdGVyWzNdID09PSBcIkZVTkNUSU9OXCIpIHtcbiAgICAgICAgICAgICAgZmlsdGVyWzJdID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXJbMl0gKyBcIilcIik7XG4gICAgICAgICAgICAgIGZpbHRlci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSA0ICYmIF8uaXNTdHJpbmcoZmlsdGVyWzJdKSAmJiBmaWx0ZXJbM10gPT09IFwiREFURVwiKSB7XG4gICAgICAgICAgICAgIGZpbHRlclsyXSA9IG5ldyBEYXRlKGZpbHRlclsyXSk7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QoZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIudmFsdWUgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuX3ZhbHVlID0gZmlsdGVyLnZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNEYXRlKGZpbHRlciAhPSBudWxsID8gZmlsdGVyLnZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLl9pc19kYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcoZmlsdGVyICE9IG51bGwgPyBmaWx0ZXIuX3ZhbHVlIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID0gQ3JlYXRvcltcImV2YWxcIl0oXCIoXCIgKyBmaWx0ZXIuX3ZhbHVlICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXIuX2lzX2RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlci52YWx1ZSA9IG5ldyBEYXRlKGZpbHRlci52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKG9iamVjdC5mb3JtICYmICFfLmlzU3RyaW5nKG9iamVjdC5mb3JtKSkge1xuICAgICAgb2JqZWN0LmZvcm0gPSBKU09OLnN0cmluZ2lmeShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbCArICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAob2JqZWN0LmZvcm0pIHtcbiAgICAgIG9iamVjdC5mb3JtID0gSlNPTi5wYXJzZShvYmplY3QuZm9ybSwgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcodmFsKSAmJiB2YWwuc3RhcnRzV2l0aCgnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHJldHVybiBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZF9saXN0cywgZnVuY3Rpb24ocmVsYXRlZE9iakluZm8pIHtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlbGF0ZWRPYmpJbmZvKSkge1xuICAgICAgICByZXR1cm4gXy5mb3JFYWNoKHJlbGF0ZWRPYmpJbmZvLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IENyZWF0b3JbXCJldmFsXCJdKFwiKFwiICsgdmFsICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcImZpbHRlcnNfY29kZVwiLCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgXy5mb3JFYWNoKG9iamVjdC5yZWxhdGVkX2xpc3RzLCBmdW5jdGlvbihyZWxhdGVkT2JqSW5mbykge1xuICAgICAgaWYgKF8uaXNPYmplY3QocmVsYXRlZE9iakluZm8pKSB7XG4gICAgICAgIHJldHVybiBfLmZvckVhY2gocmVsYXRlZE9iakluZm8sIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRlZE9iakluZm9ba2V5XSA9IHZhbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbHRlcnMnICYmIF8uaXNTdHJpbmcodmFsKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbGF0ZWRPYmpJbmZvW2tleV0gPSBDcmVhdG9yW1wiZXZhbFwiXShcIihcIiArIHZhbCArIFwiKVwiKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJmaWx0ZXJzX2NvZGVcIiwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIF8uZm9yRWFjaChvYmplY3QucmVsYXRlZExpc3QsIGZ1bmN0aW9uKHJlbGF0ZWRPYmpJbmZvKSB7XG4gICAgICBpZiAoXy5pc09iamVjdChyZWxhdGVkT2JqSW5mbykpIHtcbiAgICAgICAgcmV0dXJuIF8uZm9yRWFjaChyZWxhdGVkT2JqSW5mbywgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsdGVycycgJiYgXy5pc0Z1bmN0aW9uKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZWxhdGVkT2JqSW5mb1trZXldID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsIkNyZWF0b3IuRm9ybXVsYXIgPSB7fVxuXG5DcmVhdG9yLkZvcm11bGFyLlBSRUZJWCA9IFwiX1ZBTFVFU1wiXG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gKHByZWZpeCxmaWVsZFZhcmlhYmxlKS0+XG5cdHJlZyA9IC8oXFx7W157fV0qXFx9KS9nO1xuXG5cdHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZSByZWcsIChtLCAkMSktPlxuXHRcdHJldHVybiBwcmVmaXggKyAkMS5yZXBsYWNlKC9cXHtcXHMqLyxcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLFwiXFxcIl1cIikucmVwbGFjZSgvXFxzKlxcLlxccyovZyxcIlxcXCJdW1xcXCJcIik7XG5cblx0cmV0dXJuIHJldlxuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IChmb3JtdWxhX3N0ciktPlxuXHRpZiBfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTFcblx0XHRyZXR1cm4gdHJ1ZVxuXHRyZXR1cm4gZmFsc2VcblxuQ3JlYXRvci5Gb3JtdWxhci5ydW4gPSAoZm9ybXVsYV9zdHIsIF9DT05URVhULCBvcHRpb25zKS0+XG5cdGlmIGZvcm11bGFfc3RyICYmIF8uaXNTdHJpbmcoZm9ybXVsYV9zdHIpXG5cblx0XHRpZiAhXy5pc0Jvb2xlYW4ob3B0aW9ucz8uZXh0ZW5kKVxuXHRcdFx0ZXh0ZW5kID0gdHJ1ZVxuXG5cdFx0X1ZBTFVFUyA9IHt9XG5cdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIF9DT05URVhUKVxuXHRcdGlmIGV4dGVuZFxuXHRcdFx0X1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucz8udXNlcklkLCBvcHRpb25zPy5zcGFjZUlkKSlcblx0XHRmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cilcblxuXHRcdHRyeVxuXHRcdFx0ZGF0YSA9IENyZWF0b3IuZXZhbEluQ29udGV4dChmb3JtdWxhX3N0ciwgX1ZBTFVFUykgICAjIOatpOWkhOS4jeiDveeUqHdpbmRvdy5ldmFsIO+8jOS8muWvvOiHtOWPmOmHj+S9nOeUqOWfn+W8guW4uFxuXHRcdFx0cmV0dXJuIGRhdGFcblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9XCIsIGUpXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dG9hc3RyPy5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46ICN7Zm9ybXVsYV9zdHJ9I3tlfVwiXG5cblx0cmV0dXJuIGZvcm11bGFfc3RyXG4iLCJDcmVhdG9yLkZvcm11bGFyID0ge307XG5cbkNyZWF0b3IuRm9ybXVsYXIuUFJFRklYID0gXCJfVkFMVUVTXCI7XG5cbkNyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhID0gZnVuY3Rpb24ocHJlZml4LCBmaWVsZFZhcmlhYmxlKSB7XG4gIHZhciByZWcsIHJldjtcbiAgcmVnID0gLyhcXHtbXnt9XSpcXH0pL2c7XG4gIHJldiA9IGZpZWxkVmFyaWFibGUucmVwbGFjZShyZWcsIGZ1bmN0aW9uKG0sICQxKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICQxLnJlcGxhY2UoL1xce1xccyovLCBcIltcXFwiXCIpLnJlcGxhY2UoL1xccypcXH0vLCBcIlxcXCJdXCIpLnJlcGxhY2UoL1xccypcXC5cXHMqL2csIFwiXFxcIl1bXFxcIlwiKTtcbiAgfSk7XG4gIHJldHVybiByZXY7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYSA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyKSB7XG4gIGlmIChfLmlzU3RyaW5nKGZvcm11bGFfc3RyKSAmJiBmb3JtdWxhX3N0ci5pbmRleE9mKFwie1wiKSA+IC0xICYmIGZvcm11bGFfc3RyLmluZGV4T2YoXCJ9XCIpID4gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5DcmVhdG9yLkZvcm11bGFyLnJ1biA9IGZ1bmN0aW9uKGZvcm11bGFfc3RyLCBfQ09OVEVYVCwgb3B0aW9ucykge1xuICB2YXIgX1ZBTFVFUywgZGF0YSwgZSwgZXh0ZW5kO1xuICBpZiAoZm9ybXVsYV9zdHIgJiYgXy5pc1N0cmluZyhmb3JtdWxhX3N0cikpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuZXh0ZW5kIDogdm9pZCAwKSkge1xuICAgICAgZXh0ZW5kID0gdHJ1ZTtcbiAgICB9XG4gICAgX1ZBTFVFUyA9IHt9O1xuICAgIF9WQUxVRVMgPSBfLmV4dGVuZChfVkFMVUVTLCBfQ09OVEVYVCk7XG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgX1ZBTFVFUyA9IF8uZXh0ZW5kKF9WQUxVRVMsIENyZWF0b3IuZ2V0VXNlckNvbnRleHQob3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucy51c2VySWQgOiB2b2lkIDAsIG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMuc3BhY2VJZCA6IHZvaWQgMCkpO1xuICAgIH1cbiAgICBmb3JtdWxhX3N0ciA9IENyZWF0b3IuRm9ybXVsYXIuX3ByZXBlbmRQcmVmaXhGb3JGb3JtdWxhKFwidGhpc1wiLCBmb3JtdWxhX3N0cik7XG4gICAgdHJ5IHtcbiAgICAgIGRhdGEgPSBDcmVhdG9yLmV2YWxJbkNvbnRleHQoZm9ybXVsYV9zdHIsIF9WQUxVRVMpO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdG9yLkZvcm11bGFyLnJ1bjogXCIgKyBmb3JtdWxhX3N0ciwgZSk7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG9hc3RyICE9PSBcInVuZGVmaW5lZFwiICYmIHRvYXN0ciAhPT0gbnVsbCkge1xuICAgICAgICAgIHRvYXN0ci5lcnJvcihcIuWFrOW8j+aJp+ihjOWHuumUmeS6hu+8jOivt+ajgOafpeWFrOW8j+mFjee9ruaYr+WQpuato+ehru+8gVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiQ3JlYXRvci5Gb3JtdWxhci5ydW46IFwiICsgZm9ybXVsYV9zdHIgKyBlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZvcm11bGFfc3RyO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcbkNyZWF0b3Iub2JqZWN0c0J5TmFtZSA9IHt9ICAgIyDmraTlr7nosaHlj6rog73lnKjnoa7kv53miYDmnIlPYmplY3TliJ3lp4vljJblrozmiJDlkI7osIPnlKjvvIwg5ZCm5YiZ6I635Y+W5Yiw55qEb2JqZWN05LiN5YWoXG5cbkNyZWF0b3IuZm9ybWF0T2JqZWN0TmFtZSA9IChvYmplY3RfbmFtZSktPlxuXHRpZiBvYmplY3RfbmFtZS5zdGFydHNXaXRoKCdjZnMuZmlsZXMuJylcblx0XHRvYmplY3RfbmFtZSA9IG9iamVjdF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpLCAnXycpXG5cdHJldHVybiBvYmplY3RfbmFtZVxuXG5DcmVhdG9yLk9iamVjdCA9IChvcHRpb25zKS0+XG5cdF9iYXNlT2JqZWN0ID0gQ3JlYXRvci5iYXNlT2JqZWN0XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdF9iYXNlT2JqZWN0ID0ge2FjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zICwgZmllbGRzOiB7fSwgdHJpZ2dlcnM6IHt9LCBwZXJtaXNzaW9uX3NldDoge319XG5cdHNlbGYgPSB0aGlzXG5cdGlmICghb3B0aW9ucy5uYW1lKVxuXHRcdGNvbnNvbGUuZXJyb3Iob3B0aW9ucylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcblxuXHRzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZVxuXHRzZWxmLnNwYWNlID0gb3B0aW9ucy5zcGFjZVxuXHRzZWxmLm5hbWUgPSBvcHRpb25zLm5hbWVcblx0c2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWxcblx0c2VsZi5pY29uID0gb3B0aW9ucy5pY29uXG5cdHNlbGYuZGVzY3JpcHRpb24gPSBvcHRpb25zLmRlc2NyaXB0aW9uXG5cdHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlld1xuXHRzZWxmLmZvcm0gPSBvcHRpb25zLmZvcm1cblx0c2VsZi5yZWxhdGVkTGlzdCA9IG9wdGlvbnMucmVsYXRlZExpc3Rcblx0c2VsZi5yZWxhdGVkX2xpc3RzID0gb3B0aW9ucy5yZWxhdGVkX2xpc3RzXG5cdHNlbGYudmVyc2lvbiA9IG9wdGlvbnMudmVyc2lvbiB8fCAxLjBcblx0aWYgIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSAgfHwgb3B0aW9ucy5pc19lbmFibGUgPT0gdHJ1ZVxuXHRcdHNlbGYuaXNfZW5hYmxlID0gdHJ1ZVxuXHRlbHNlXG5cdFx0c2VsZi5pc19lbmFibGUgPSBmYWxzZVxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfY3VzdG9tQWN0aW9ucycpXG5cdFx0XHRzZWxmLmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvcHRpb25zLmFsbG93X2N1c3RvbUFjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnZXhjbHVkZV9hY3Rpb25zJylcblx0XHRcdHNlbGYuZXhjbHVkZV9hY3Rpb25zID0gb3B0aW9ucy5leGNsdWRlX2FjdGlvbnNcblx0XHRpZiBfLmhhcyhvcHRpb25zLCAnYWxsb3dfcmVsYXRlZExpc3QnKVxuXHRcdFx0c2VsZi5hbGxvd19yZWxhdGVkTGlzdCA9IG9wdGlvbnMuYWxsb3dfcmVsYXRlZExpc3Rcblx0c2VsZi5lbmFibGVfc2VhcmNoID0gb3B0aW9ucy5lbmFibGVfc2VhcmNoXG5cdHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXNcblx0c2VsZi5lbmFibGVfdGFza3MgPSBvcHRpb25zLmVuYWJsZV90YXNrc1xuXHRzZWxmLmVuYWJsZV9ub3RlcyA9IG9wdGlvbnMuZW5hYmxlX25vdGVzXG5cdHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXRcblx0c2VsZi5lbmFibGVfZXZlbnRzID0gb3B0aW9ucy5lbmFibGVfZXZlbnRzXG5cdGlmIG9wdGlvbnMucGFnaW5nXG5cdFx0c2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZ1xuXHRzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuXG5cdHNlbGYuZW5hYmxlX2FwaSA9IChvcHRpb25zLmVuYWJsZV9hcGkgPT0gdW5kZWZpbmVkKSBvciBvcHRpb25zLmVuYWJsZV9hcGlcblx0c2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbVxuXHRzZWxmLmVuYWJsZV9zaGFyZSA9IG9wdGlvbnMuZW5hYmxlX3NoYXJlXG5cdHNlbGYuZW5hYmxlX2luc3RhbmNlcyA9IG9wdGlvbnMuZW5hYmxlX2luc3RhbmNlc1xuXHRzZWxmLmVuYWJsZV9wcm9jZXNzID0gb3B0aW9ucy5lbmFibGVfcHJvY2Vzc1xuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRpZiBDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSlcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXG5cdFx0XHRzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcilcblx0ZWxzZVxuXHRcdHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKVxuXHRcdHNlbGYuZW5hYmxlX3RyZWUgPSBvcHRpb25zLmVuYWJsZV90cmVlXG5cdHNlbGYub3Blbl93aW5kb3cgPSBvcHRpb25zLm9wZW5fd2luZG93XG5cdHNlbGYuZmlsdGVyX2NvbXBhbnkgPSBvcHRpb25zLmZpbHRlcl9jb21wYW55XG5cdHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpXG5cdHNlbGYuZW5hYmxlX2NoYXR0ZXIgPSBvcHRpb25zLmVuYWJsZV9jaGF0dGVyXG5cdHNlbGYuZW5hYmxlX3RyYXNoID0gb3B0aW9ucy5lbmFibGVfdHJhc2hcblx0c2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsXG5cdHNlbGYuZW5hYmxlX2FwcHJvdmFscyA9IG9wdGlvbnMuZW5hYmxlX2FwcHJvdmFsc1xuXHRzZWxmLmVuYWJsZV9mb2xsb3cgPSBvcHRpb25zLmVuYWJsZV9mb2xsb3dcblx0c2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvd1xuXHRzZWxmLmVuYWJsZV9pbmxpbmVfZWRpdCA9IG9wdGlvbnMuZW5hYmxlX2lubGluZV9lZGl0XG5cdHNlbGYuZGV0YWlscyA9IG9wdGlvbnMuZGV0YWlsc1xuXHRzZWxmLm1hc3RlcnMgPSBvcHRpb25zLm1hc3RlcnNcblx0c2VsZi5sb29rdXBfZGV0YWlscyA9IG9wdGlvbnMubG9va3VwX2RldGFpbHNcblx0aWYgXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50Jylcblx0XHRzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudFxuXHRzZWxmLmlkRmllbGROYW1lID0gJ19pZCdcblx0aWYgb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdFx0c2VsZi5kYXRhYmFzZV9uYW1lID0gb3B0aW9ucy5kYXRhYmFzZV9uYW1lXG5cdGlmICghb3B0aW9ucy5maWVsZHMpXG5cdFx0Y29uc29sZS5lcnJvcihvcHRpb25zKVxuXHRcdHRocm93IG5ldyBFcnJvcignQ3JlYXRvci5PYmplY3Qgb3B0aW9ucyBtdXN0IHNwZWNpZnkgZmllbGRzJyk7XG5cblx0c2VsZi5maWVsZHMgPSBjbG9uZShvcHRpb25zLmZpZWxkcylcblxuXHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdGlmIGZpZWxkLmlzX25hbWVcblx0XHRcdHNlbGYuTkFNRV9GSUVMRF9LRVkgPSBmaWVsZF9uYW1lXG5cdFx0ZWxzZSBpZiBmaWVsZF9uYW1lID09ICduYW1lJyAmJiAhc2VsZi5OQU1FX0ZJRUxEX0tFWVxuXHRcdFx0c2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWVcblx0XHRpZiBmaWVsZC5wcmltYXJ5XG5cdFx0XHRzZWxmLmlkRmllbGROYW1lID0gZmllbGRfbmFtZVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgQ3JlYXRvci5pc0Nsb3VkQWRtaW5TcGFjZShTZXNzaW9uLmdldChcInNwYWNlSWRcIikpXG5cdFx0XHRcdGlmIGZpZWxkX25hbWUgPT0gJ3NwYWNlJ1xuXHRcdFx0XHRcdGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlXG5cdFx0XHRcdFx0ZmllbGQuaGlkZGVuID0gZmFsc2VcblxuXHRpZiAhb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xuXHRcdF8uZWFjaCBfYmFzZU9iamVjdC5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHRcdFx0aWYgIXNlbGYuZmllbGRzW2ZpZWxkX25hbWVdXG5cdFx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0ge31cblx0XHRcdHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKVxuXG5cdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgZmllbGQudHlwZSA9PSAnYXV0b251bWJlcidcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnc3VtbWFyeSdcblx0XHRcdGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdHNlbGYubGlzdF92aWV3cyA9IHt9XG5cdGRlZmF1bHRWaWV3ID0gQ3JlYXRvci5nZXRPYmplY3REZWZhdWx0VmlldyhzZWxmLm5hbWUpXG5cdF8uZWFjaCBvcHRpb25zLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRWaWV3LCBpdGVtLCBpdGVtX25hbWUpXG5cdFx0c2VsZi5saXN0X3ZpZXdzW2l0ZW1fbmFtZV0gPSBvaXRlbVxuXG5cdHNlbGYudHJpZ2dlcnMgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnRyaWdnZXJzKVxuXHRfLmVhY2ggb3B0aW9ucy50cmlnZ2VycywgKGl0ZW0sIGl0ZW1fbmFtZSktPlxuXHRcdGlmICFzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV1cblx0XHRcdHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0c2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdLm5hbWUgPSBpdGVtX25hbWVcblx0XHRzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSksIGl0ZW0pXG5cblx0c2VsZi5hY3Rpb25zID0gXy5jbG9uZShfYmFzZU9iamVjdC5hY3Rpb25zKVxuXHRfLmVhY2ggb3B0aW9ucy5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aWYgIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdXG5cdFx0XHRzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9XG5cdFx0Y29weUl0ZW0gPSBfLmNsb25lKHNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKVxuXHRcdGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSAj5YWI5Yig6Zmk55u45YWz5bGe5oCn5YaN6YeN5bu65omN6IO95L+d6K+B5ZCO57ut6YeN5aSN5a6a5LmJ55qE5bGe5oCn6aG65bqP55Sf5pWIXG5cdFx0c2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSlcblxuXHRfLmVhY2ggc2VsZi5hY3Rpb25zLCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdFx0aXRlbS5uYW1lID0gaXRlbV9uYW1lXG5cblx0c2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSlcblxuXHQjIOiuqeaJgOaciW9iamVjdOm7mOiupOacieaJgOaciWxpc3Rfdmlld3MvYWN0aW9ucy9yZWxhdGVkX29iamVjdHMvcmVhZGFibGVfZmllbGRzL2VkaXRhYmxlX2ZpZWxkc+WujOaVtOadg+mZkO+8jOivpeadg+mZkOWPr+iDveiiq+aVsOaNruW6k+S4reiuvue9rueahGFkbWluL3VzZXLmnYPpmZDopobnm5Zcblx0c2VsZi5wZXJtaXNzaW9uX3NldCA9IF8uY2xvbmUoX2Jhc2VPYmplY3QucGVybWlzc2lvbl9zZXQpXG5cdCMgZGVmYXVsdExpc3RWaWV3cyA9IF8ua2V5cyhzZWxmLmxpc3Rfdmlld3MpXG5cdCMgZGVmYXVsdEFjdGlvbnMgPSBfLmtleXMoc2VsZi5hY3Rpb25zKVxuXHQjIGRlZmF1bHRSZWxhdGVkT2JqZWN0cyA9IF8ucGx1Y2soc2VsZi5yZWxhdGVkX29iamVjdHMsXCJvYmplY3RfbmFtZVwiKVxuXHQjIGRlZmF1bHRSZWFkYWJsZUZpZWxkcyA9IFtdXG5cdCMgZGVmYXVsdEVkaXRhYmxlRmllbGRzID0gW11cblx0IyBfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuXHQjIFx0aWYgIShmaWVsZC5oaWRkZW4pICAgICMyMzEgb21pdOWtl+auteaUr+aMgeWcqOmdnue8lui+kemhtemdouafpeeciywg5Zug5q2k5Yig6Zmk5LqG5q2k5aSE5a+5b21pdOeahOWIpOaWrVxuXHQjIFx0XHRkZWZhdWx0UmVhZGFibGVGaWVsZHMucHVzaCBmaWVsZF9uYW1lXG5cdCMgXHRcdGlmICFmaWVsZC5yZWFkb25seVxuXHQjIFx0XHRcdGRlZmF1bHRFZGl0YWJsZUZpZWxkcy5wdXNoIGZpZWxkX25hbWVcblxuXHQjIF8uZWFjaCBzZWxmLnBlcm1pc3Npb25fc2V0LCAoaXRlbSwgaXRlbV9uYW1lKS0+XG5cdCMgXHRpZiBpdGVtX25hbWUgPT0gXCJub25lXCJcblx0IyBcdFx0cmV0dXJuXG5cdCMgXHRpZiBzZWxmLmxpc3Rfdmlld3Ncblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmxpc3Rfdmlld3MgPSBkZWZhdWx0TGlzdFZpZXdzXG5cdCMgXHRpZiBzZWxmLmFjdGlvbnNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLmFjdGlvbnMgPSBkZWZhdWx0QWN0aW9uc1xuXHQjIFx0aWYgc2VsZi5yZWxhdGVkX29iamVjdHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLnJlbGF0ZWRfb2JqZWN0cyA9IGRlZmF1bHRSZWxhdGVkT2JqZWN0c1xuXHQjIFx0aWYgc2VsZi5maWVsZHNcblx0IyBcdFx0c2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdLnJlYWRhYmxlX2ZpZWxkcyA9IGRlZmF1bHRSZWFkYWJsZUZpZWxkc1xuXHQjIFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0uZWRpdGFibGVfZmllbGRzID0gZGVmYXVsdEVkaXRhYmxlRmllbGRzXG5cdHVubGVzcyBvcHRpb25zLnBlcm1pc3Npb25fc2V0XG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldCA9IHt9XG5cdGlmICEob3B0aW9ucy5wZXJtaXNzaW9uX3NldD8uYWRtaW4pXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC5hZG1pbiA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcImFkbWluXCJdKVxuXHRpZiAhKG9wdGlvbnMucGVybWlzc2lvbl9zZXQ/LnVzZXIpXG5cdFx0b3B0aW9ucy5wZXJtaXNzaW9uX3NldC51c2VyID0gXy5jbG9uZShzZWxmLnBlcm1pc3Npb25fc2V0W1widXNlclwiXSlcblx0Xy5lYWNoIG9wdGlvbnMucGVybWlzc2lvbl9zZXQsIChpdGVtLCBpdGVtX25hbWUpLT5cblx0XHRpZiAhc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdXG5cdFx0XHRzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSB7fVxuXHRcdHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSA9IF8uZXh0ZW5kKF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdKSwgaXRlbSlcblxuXHQjIOWJjeerr+agueaNrnBlcm1pc3Npb25z5pS55YaZZmllbGTnm7jlhbPlsZ7mgKfvvIzlkI7nq6/lj6ropoHotbDpu5jorqTlsZ7mgKflsLHooYzvvIzkuI3pnIDopoHmlLnlhplcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0cGVybWlzc2lvbnMgPSBvcHRpb25zLnBlcm1pc3Npb25zXG5cdFx0ZGlzYWJsZWRfbGlzdF92aWV3cyA9IHBlcm1pc3Npb25zPy5kaXNhYmxlZF9saXN0X3ZpZXdzXG5cdFx0aWYgZGlzYWJsZWRfbGlzdF92aWV3cz8ubGVuZ3RoXG5cdFx0XHRkZWZhdWx0TGlzdFZpZXdJZCA9IG9wdGlvbnMubGlzdF92aWV3cz8uYWxsPy5faWRcblx0XHRcdGlmIGRlZmF1bHRMaXN0Vmlld0lkXG5cdFx0XHRcdCMg5oqK6KeG5Zu+5p2D6ZmQ6YWN572u5Lit6buY6K6k55qEYWxs6KeG5Zu+aWTovazmjaLmiJBhbGzlhbPplK7lrZdcblx0XHRcdFx0cGVybWlzc2lvbnMuZGlzYWJsZWRfbGlzdF92aWV3cyA9IF8ubWFwIGRpc2FibGVkX2xpc3Rfdmlld3MsIChsaXN0X3ZpZXdfaXRlbSkgLT5cblx0XHRcdFx0XHRyZXR1cm4gaWYgZGVmYXVsdExpc3RWaWV3SWQgPT0gbGlzdF92aWV3X2l0ZW0gdGhlbiBcImFsbFwiIGVsc2UgbGlzdF92aWV3X2l0ZW1cblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbmV3IFJlYWN0aXZlVmFyKHBlcm1pc3Npb25zKVxuI1x0XHRfLmVhY2ggc2VsZi5maWVsZHMsIChmaWVsZCwgZmllbGRfbmFtZSktPlxuI1x0XHRcdGlmIGZpZWxkXG4jXHRcdFx0XHRpZiBfLmluZGV4T2YocGVybWlzc2lvbnM/LnVucmVhZGFibGVfZmllbGRzLCBmaWVsZF9uYW1lKSA8IDBcbiNcdFx0XHRcdFx0aWYgZmllbGQuaGlkZGVuXG4jXHRcdFx0XHRcdFx0cmV0dXJuXG4jXHRcdFx0XHRcdGlmIF8uaW5kZXhPZihwZXJtaXNzaW9ucz8udW5lZGl0YWJsZV9maWVsZHMsIGZpZWxkX25hbWUpID4gLTFcbiNcdFx0XHRcdFx0XHRmaWVsZC5yZWFkb25seSA9IHRydWVcbiNcdFx0XHRcdFx0XHRmaWVsZC5kaXNhYmxlZCA9IHRydWVcbiNcdFx0XHRcdFx0XHQjIOW9k+WPquivu+aXtu+8jOWmguaenOS4jeWOu+aOieW/heWhq+Wtl+aute+8jGF1dG9mb3Jt5piv5Lya5oql6ZSZ55qEXG4jXHRcdFx0XHRcdFx0ZmllbGQucmVxdWlyZWQgPSBmYWxzZVxuI1x0XHRcdFx0ZWxzZVxuI1x0XHRcdFx0XHRmaWVsZC5oaWRkZW4gPSB0cnVlXG5cdGVsc2Vcblx0XHRzZWxmLnBlcm1pc3Npb25zID0gbnVsbFxuXG5cdF9kYiA9IENyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbihvcHRpb25zKVxuXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbX2RiLl9uYW1lXSA9IF9kYlxuXG5cdHNlbGYuZGIgPSBfZGJcblxuXHRzZWxmLl9jb2xsZWN0aW9uX25hbWUgPSBfZGIuX25hbWVcblxuXHRzY2hlbWEgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYShzZWxmKVxuXHRzZWxmLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKVxuXHRpZiBzZWxmLm5hbWUgIT0gXCJ1c2Vyc1wiIGFuZCBzZWxmLm5hbWUgIT0gXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiICYmICFzZWxmLmlzX3ZpZXcgJiYgIV8uY29udGFpbnMoW1wiZmxvd3NcIiwgXCJmb3Jtc1wiLCBcImluc3RhbmNlc1wiLCBcIm9yZ2FuaXphdGlvbnNcIiwgXCJhY3Rpb25fZmllbGRfdXBkYXRlc1wiXSwgc2VsZi5uYW1lKVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0X2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge3JlcGxhY2U6IHRydWV9KVxuXHRcdGVsc2Vcblx0XHRcdF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtyZXBsYWNlOiB0cnVlfSlcblx0aWYgc2VsZi5uYW1lID09IFwidXNlcnNcIlxuXHRcdF9kYi5fc2ltcGxlU2NoZW1hID0gc2VsZi5zY2hlbWFcblxuXHRpZiBfLmNvbnRhaW5zKFtcImZsb3dzXCIsIFwiZm9ybXNcIiwgXCJpbnN0YW5jZXNcIiwgXCJvcmdhbml6YXRpb25zXCJdLCBzZWxmLm5hbWUpXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRfZGIuYXR0YWNoU2NoZW1hKHNlbGYuc2NoZW1hLCB7cmVwbGFjZTogdHJ1ZX0pXG5cblx0Q3JlYXRvci5vYmplY3RzQnlOYW1lW3NlbGYuX2NvbGxlY3Rpb25fbmFtZV0gPSBzZWxmXG5cblx0cmV0dXJuIHNlbGZcblxuIyBDcmVhdG9yLk9iamVjdC5wcm90b3R5cGUuaTE4biA9ICgpLT5cbiMgXHQjIHNldCBvYmplY3QgbGFiZWxcbiMgXHRzZWxmID0gdGhpc1xuXG4jIFx0a2V5ID0gc2VsZi5uYW1lXG4jIFx0aWYgdChrZXkpID09IGtleVxuIyBcdFx0aWYgIXNlbGYubGFiZWxcbiMgXHRcdFx0c2VsZi5sYWJlbCA9IHNlbGYubmFtZVxuIyBcdGVsc2VcbiMgXHRcdHNlbGYubGFiZWwgPSB0KGtleSlcblxuIyBcdCMgc2V0IGZpZWxkIGxhYmVsc1xuIyBcdF8uZWFjaCBzZWxmLmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG4jIFx0XHRma2V5ID0gc2VsZi5uYW1lICsgXCJfXCIgKyBmaWVsZF9uYW1lXG4jIFx0XHRpZiB0KGZrZXkpID09IGZrZXlcbiMgXHRcdFx0aWYgIWZpZWxkLmxhYmVsXG4jIFx0XHRcdFx0ZmllbGQubGFiZWwgPSBmaWVsZF9uYW1lXG4jIFx0XHRlbHNlXG4jIFx0XHRcdGZpZWxkLmxhYmVsID0gdChma2V5KVxuIyBcdFx0c2VsZi5zY2hlbWE/Ll9zY2hlbWE/W2ZpZWxkX25hbWVdPy5sYWJlbCA9IGZpZWxkLmxhYmVsXG5cblxuIyBcdCMgc2V0IGxpc3R2aWV3IGxhYmVsc1xuIyBcdF8uZWFjaCBzZWxmLmxpc3Rfdmlld3MsIChpdGVtLCBpdGVtX25hbWUpLT5cbiMgXHRcdGkxOG5fa2V5ID0gc2VsZi5uYW1lICsgXCJfbGlzdHZpZXdfXCIgKyBpdGVtX25hbWVcbiMgXHRcdGlmIHQoaTE4bl9rZXkpID09IGkxOG5fa2V5XG4jIFx0XHRcdGlmICFpdGVtLmxhYmVsXG4jIFx0XHRcdFx0aXRlbS5sYWJlbCA9IGl0ZW1fbmFtZVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHRpdGVtLmxhYmVsID0gdChpMThuX2tleSlcblxuXG5DcmVhdG9yLmdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4ID0gKG9iamVjdCktPlxuXHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcblx0IyBpZiBvYmplY3Rcblx0IyBcdGlmICFvYmplY3QuZGF0YWJhc2VfbmFtZSB8fCBvYmplY3QuZGF0YWJhc2VfbmFtZSA9PSAnbWV0ZW9yLW1vbmdvJ1xuXHQjIFx0XHRyZXR1cm4gXCIvYXBpL29kYXRhL3Y0XCJcblx0IyBcdGVsc2Vcblx0IyBcdFx0cmV0dXJuIFwiL2FwaS9vZGF0YS8je29iamVjdC5kYXRhYmFzZV9uYW1lfVwiXG5cbiMgaWYgTWV0ZW9yLmlzQ2xpZW50XG5cbiMgXHRNZXRlb3Iuc3RhcnR1cCAtPlxuIyBcdFx0VHJhY2tlci5hdXRvcnVuIC0+XG4jIFx0XHRcdGlmIFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgJiYgQ3JlYXRvci5ib290c3RyYXBMb2FkZWQ/LmdldCgpXG4jIFx0XHRcdFx0Xy5lYWNoIENyZWF0b3Iub2JqZWN0c0J5TmFtZSwgKG9iamVjdCwgb2JqZWN0X25hbWUpLT5cbiMgXHRcdFx0XHRcdG9iamVjdC5pMThuKClcblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0aWYgIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkICYmIENyZWF0b3IuT2JqZWN0c1xuXHRcdF8uZWFjaCBDcmVhdG9yLk9iamVjdHMsIChvYmplY3QpLT5cblx0XHRcdG5ldyBDcmVhdG9yLk9iamVjdChvYmplY3QpXG5cbiIsInZhciBjbG9uZTtcblxuY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5DcmVhdG9yLm9iamVjdHNCeU5hbWUgPSB7fTtcblxuQ3JlYXRvci5mb3JtYXRPYmplY3ROYW1lID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgaWYgKG9iamVjdF9uYW1lLnN0YXJ0c1dpdGgoJ2Nmcy5maWxlcy4nKSkge1xuICAgIG9iamVjdF9uYW1lID0gb2JqZWN0X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcLicsICdnJyksICdfJyk7XG4gIH1cbiAgcmV0dXJuIG9iamVjdF9uYW1lO1xufTtcblxuQ3JlYXRvci5PYmplY3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHZhciBfYmFzZU9iamVjdCwgX2RiLCBkZWZhdWx0TGlzdFZpZXdJZCwgZGVmYXVsdFZpZXcsIGRpc2FibGVkX2xpc3Rfdmlld3MsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNjaGVtYSwgc2VsZjtcbiAgX2Jhc2VPYmplY3QgPSBDcmVhdG9yLmJhc2VPYmplY3Q7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBfYmFzZU9iamVjdCA9IHtcbiAgICAgIGFjdGlvbnM6IENyZWF0b3IuYmFzZU9iamVjdC5hY3Rpb25zLFxuICAgICAgZmllbGRzOiB7fSxcbiAgICAgIHRyaWdnZXJzOiB7fSxcbiAgICAgIHBlcm1pc3Npb25fc2V0OiB7fVxuICAgIH07XG4gIH1cbiAgc2VsZiA9IHRoaXM7XG4gIGlmICghb3B0aW9ucy5uYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcihvcHRpb25zKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWF0b3IuT2JqZWN0IG9wdGlvbnMgbXVzdCBzcGVjaWZ5IG5hbWUnKTtcbiAgfVxuICBzZWxmLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5zcGFjZSA9IG9wdGlvbnMuc3BhY2U7XG4gIHNlbGYubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgc2VsZi5sYWJlbCA9IG9wdGlvbnMubGFiZWw7XG4gIHNlbGYuaWNvbiA9IG9wdGlvbnMuaWNvbjtcbiAgc2VsZi5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb247XG4gIHNlbGYuaXNfdmlldyA9IG9wdGlvbnMuaXNfdmlldztcbiAgc2VsZi5mb3JtID0gb3B0aW9ucy5mb3JtO1xuICBzZWxmLnJlbGF0ZWRMaXN0ID0gb3B0aW9ucy5yZWxhdGVkTGlzdDtcbiAgc2VsZi5yZWxhdGVkX2xpc3RzID0gb3B0aW9ucy5yZWxhdGVkX2xpc3RzO1xuICBzZWxmLnZlcnNpb24gPSBvcHRpb25zLnZlcnNpb24gfHwgMS4wO1xuICBpZiAoIV8uaXNCb29sZWFuKG9wdGlvbnMuaXNfZW5hYmxlKSB8fCBvcHRpb25zLmlzX2VuYWJsZSA9PT0gdHJ1ZSkge1xuICAgIHNlbGYuaXNfZW5hYmxlID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLmlzX2VuYWJsZSA9IGZhbHNlO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2FsbG93X2N1c3RvbUFjdGlvbnMnKSkge1xuICAgICAgc2VsZi5hbGxvd19jdXN0b21BY3Rpb25zID0gb3B0aW9ucy5hbGxvd19jdXN0b21BY3Rpb25zO1xuICAgIH1cbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2V4Y2x1ZGVfYWN0aW9ucycpKSB7XG4gICAgICBzZWxmLmV4Y2x1ZGVfYWN0aW9ucyA9IG9wdGlvbnMuZXhjbHVkZV9hY3Rpb25zO1xuICAgIH1cbiAgICBpZiAoXy5oYXMob3B0aW9ucywgJ2FsbG93X3JlbGF0ZWRMaXN0JykpIHtcbiAgICAgIHNlbGYuYWxsb3dfcmVsYXRlZExpc3QgPSBvcHRpb25zLmFsbG93X3JlbGF0ZWRMaXN0O1xuICAgIH1cbiAgfVxuICBzZWxmLmVuYWJsZV9zZWFyY2ggPSBvcHRpb25zLmVuYWJsZV9zZWFyY2g7XG4gIHNlbGYuZW5hYmxlX2ZpbGVzID0gb3B0aW9ucy5lbmFibGVfZmlsZXM7XG4gIHNlbGYuZW5hYmxlX3Rhc2tzID0gb3B0aW9ucy5lbmFibGVfdGFza3M7XG4gIHNlbGYuZW5hYmxlX25vdGVzID0gb3B0aW9ucy5lbmFibGVfbm90ZXM7XG4gIHNlbGYuZW5hYmxlX2F1ZGl0ID0gb3B0aW9ucy5lbmFibGVfYXVkaXQ7XG4gIHNlbGYuZW5hYmxlX2V2ZW50cyA9IG9wdGlvbnMuZW5hYmxlX2V2ZW50cztcbiAgaWYgKG9wdGlvbnMucGFnaW5nKSB7XG4gICAgc2VsZi5wYWdpbmcgPSBvcHRpb25zLnBhZ2luZztcbiAgfVxuICBzZWxmLmhpZGRlbiA9IG9wdGlvbnMuaGlkZGVuO1xuICBzZWxmLmVuYWJsZV9hcGkgPSAob3B0aW9ucy5lbmFibGVfYXBpID09PSB2b2lkIDApIHx8IG9wdGlvbnMuZW5hYmxlX2FwaTtcbiAgc2VsZi5jdXN0b20gPSBvcHRpb25zLmN1c3RvbTtcbiAgc2VsZi5lbmFibGVfc2hhcmUgPSBvcHRpb25zLmVuYWJsZV9zaGFyZTtcbiAgc2VsZi5lbmFibGVfaW5zdGFuY2VzID0gb3B0aW9ucy5lbmFibGVfaW5zdGFuY2VzO1xuICBzZWxmLmVuYWJsZV9wcm9jZXNzID0gb3B0aW9ucy5lbmFibGVfcHJvY2VzcztcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmIChDcmVhdG9yLmlzQ2xvdWRBZG1pblNwYWNlKFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSkpIHtcbiAgICAgIHNlbGYuZW5hYmxlX3RyZWUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5lbmFibGVfdHJlZSA9IG9wdGlvbnMuZW5hYmxlX3RyZWU7XG4gICAgICBzZWxmLnNpZGViYXIgPSBfLmNsb25lKG9wdGlvbnMuc2lkZWJhcik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNlbGYuc2lkZWJhciA9IF8uY2xvbmUob3B0aW9ucy5zaWRlYmFyKTtcbiAgICBzZWxmLmVuYWJsZV90cmVlID0gb3B0aW9ucy5lbmFibGVfdHJlZTtcbiAgfVxuICBzZWxmLm9wZW5fd2luZG93ID0gb3B0aW9ucy5vcGVuX3dpbmRvdztcbiAgc2VsZi5maWx0ZXJfY29tcGFueSA9IG9wdGlvbnMuZmlsdGVyX2NvbXBhbnk7XG4gIHNlbGYuY2FsZW5kYXIgPSBfLmNsb25lKG9wdGlvbnMuY2FsZW5kYXIpO1xuICBzZWxmLmVuYWJsZV9jaGF0dGVyID0gb3B0aW9ucy5lbmFibGVfY2hhdHRlcjtcbiAgc2VsZi5lbmFibGVfdHJhc2ggPSBvcHRpb25zLmVuYWJsZV90cmFzaDtcbiAgc2VsZi5lbmFibGVfc3BhY2VfZ2xvYmFsID0gb3B0aW9ucy5lbmFibGVfc3BhY2VfZ2xvYmFsO1xuICBzZWxmLmVuYWJsZV9hcHByb3ZhbHMgPSBvcHRpb25zLmVuYWJsZV9hcHByb3ZhbHM7XG4gIHNlbGYuZW5hYmxlX2ZvbGxvdyA9IG9wdGlvbnMuZW5hYmxlX2ZvbGxvdztcbiAgc2VsZi5lbmFibGVfd29ya2Zsb3cgPSBvcHRpb25zLmVuYWJsZV93b3JrZmxvdztcbiAgc2VsZi5lbmFibGVfaW5saW5lX2VkaXQgPSBvcHRpb25zLmVuYWJsZV9pbmxpbmVfZWRpdDtcbiAgc2VsZi5kZXRhaWxzID0gb3B0aW9ucy5kZXRhaWxzO1xuICBzZWxmLm1hc3RlcnMgPSBvcHRpb25zLm1hc3RlcnM7XG4gIHNlbGYubG9va3VwX2RldGFpbHMgPSBvcHRpb25zLmxvb2t1cF9kZXRhaWxzO1xuICBpZiAoXy5oYXMob3B0aW9ucywgJ2luX2RldmVsb3BtZW50JykpIHtcbiAgICBzZWxmLmluX2RldmVsb3BtZW50ID0gb3B0aW9ucy5pbl9kZXZlbG9wbWVudDtcbiAgfVxuICBzZWxmLmlkRmllbGROYW1lID0gJ19pZCc7XG4gIGlmIChvcHRpb25zLmRhdGFiYXNlX25hbWUpIHtcbiAgICBzZWxmLmRhdGFiYXNlX25hbWUgPSBvcHRpb25zLmRhdGFiYXNlX25hbWU7XG4gIH1cbiAgaWYgKCFvcHRpb25zLmZpZWxkcykge1xuICAgIGNvbnNvbGUuZXJyb3Iob3B0aW9ucyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDcmVhdG9yLk9iamVjdCBvcHRpb25zIG11c3Qgc3BlY2lmeSBmaWVsZHMnKTtcbiAgfVxuICBzZWxmLmZpZWxkcyA9IGNsb25lKG9wdGlvbnMuZmllbGRzKTtcbiAgXy5lYWNoKHNlbGYuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmIChmaWVsZC5pc19uYW1lKSB7XG4gICAgICBzZWxmLk5BTUVfRklFTERfS0VZID0gZmllbGRfbmFtZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkX25hbWUgPT09ICduYW1lJyAmJiAhc2VsZi5OQU1FX0ZJRUxEX0tFWSkge1xuICAgICAgc2VsZi5OQU1FX0ZJRUxEX0tFWSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5wcmltYXJ5KSB7XG4gICAgICBzZWxmLmlkRmllbGROYW1lID0gZmllbGRfbmFtZTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKENyZWF0b3IuaXNDbG91ZEFkbWluU3BhY2UoU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpKSkge1xuICAgICAgICBpZiAoZmllbGRfbmFtZSA9PT0gJ3NwYWNlJykge1xuICAgICAgICAgIGZpZWxkLmZpbHRlcmFibGUgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBmaWVsZC5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmICghb3B0aW9ucy5kYXRhYmFzZV9uYW1lIHx8IG9wdGlvbnMuZGF0YWJhc2VfbmFtZSA9PT0gJ21ldGVvci1tb25nbycpIHtcbiAgICBfLmVhY2goX2Jhc2VPYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgaWYgKCFzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSkge1xuICAgICAgICBzZWxmLmZpZWxkc1tmaWVsZF9uYW1lXSA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShmaWVsZCksIHNlbGYuZmllbGRzW2ZpZWxkX25hbWVdKTtcbiAgICB9KTtcbiAgfVxuICBfLmVhY2goc2VsZi5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkLCBmaWVsZF9uYW1lKSB7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09ICdhdXRvbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdmb3JtdWxhJykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdzdW1tYXJ5Jykge1xuICAgICAgcmV0dXJuIGZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBzZWxmLmxpc3Rfdmlld3MgPSB7fTtcbiAgZGVmYXVsdFZpZXcgPSBDcmVhdG9yLmdldE9iamVjdERlZmF1bHRWaWV3KHNlbGYubmFtZSk7XG4gIF8uZWFjaChvcHRpb25zLmxpc3Rfdmlld3MsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBvaXRlbTtcbiAgICBvaXRlbSA9IENyZWF0b3IuY29udmVydExpc3RWaWV3KGRlZmF1bHRWaWV3LCBpdGVtLCBpdGVtX25hbWUpO1xuICAgIHJldHVybiBzZWxmLmxpc3Rfdmlld3NbaXRlbV9uYW1lXSA9IG9pdGVtO1xuICB9KTtcbiAgc2VsZi50cmlnZ2VycyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QudHJpZ2dlcnMpO1xuICBfLmVhY2gob3B0aW9ucy50cmlnZ2VycywgZnVuY3Rpb24oaXRlbSwgaXRlbV9uYW1lKSB7XG4gICAgaWYgKCFzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pIHtcbiAgICAgIHNlbGYudHJpZ2dlcnNbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICBzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0ubmFtZSA9IGl0ZW1fbmFtZTtcbiAgICByZXR1cm4gc2VsZi50cmlnZ2Vyc1tpdGVtX25hbWVdID0gXy5leHRlbmQoXy5jbG9uZShzZWxmLnRyaWdnZXJzW2l0ZW1fbmFtZV0pLCBpdGVtKTtcbiAgfSk7XG4gIHNlbGYuYWN0aW9ucyA9IF8uY2xvbmUoX2Jhc2VPYmplY3QuYWN0aW9ucyk7XG4gIF8uZWFjaChvcHRpb25zLmFjdGlvbnMsIGZ1bmN0aW9uKGl0ZW0sIGl0ZW1fbmFtZSkge1xuICAgIHZhciBjb3B5SXRlbTtcbiAgICBpZiAoIXNlbGYuYWN0aW9uc1tpdGVtX25hbWVdKSB7XG4gICAgICBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXSA9IHt9O1xuICAgIH1cbiAgICBjb3B5SXRlbSA9IF8uY2xvbmUoc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0pO1xuICAgIGRlbGV0ZSBzZWxmLmFjdGlvbnNbaXRlbV9uYW1lXTtcbiAgICByZXR1cm4gc2VsZi5hY3Rpb25zW2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChjb3B5SXRlbSwgaXRlbSk7XG4gIH0pO1xuICBfLmVhY2goc2VsZi5hY3Rpb25zLCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lID0gaXRlbV9uYW1lO1xuICB9KTtcbiAgc2VsZi5yZWxhdGVkX29iamVjdHMgPSBDcmVhdG9yLmdldE9iamVjdFJlbGF0ZWRzKHNlbGYubmFtZSk7XG4gIHNlbGYucGVybWlzc2lvbl9zZXQgPSBfLmNsb25lKF9iYXNlT2JqZWN0LnBlcm1pc3Npb25fc2V0KTtcbiAgaWYgKCFvcHRpb25zLnBlcm1pc3Npb25fc2V0KSB7XG4gICAgb3B0aW9ucy5wZXJtaXNzaW9uX3NldCA9IHt9O1xuICB9XG4gIGlmICghKChyZWYgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmLmFkbWluIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQuYWRtaW4gPSBfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbXCJhZG1pblwiXSk7XG4gIH1cbiAgaWYgKCEoKHJlZjEgPSBvcHRpb25zLnBlcm1pc3Npb25fc2V0KSAhPSBudWxsID8gcmVmMS51c2VyIDogdm9pZCAwKSkge1xuICAgIG9wdGlvbnMucGVybWlzc2lvbl9zZXQudXNlciA9IF8uY2xvbmUoc2VsZi5wZXJtaXNzaW9uX3NldFtcInVzZXJcIl0pO1xuICB9XG4gIF8uZWFjaChvcHRpb25zLnBlcm1pc3Npb25fc2V0LCBmdW5jdGlvbihpdGVtLCBpdGVtX25hbWUpIHtcbiAgICBpZiAoIXNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSkge1xuICAgICAgc2VsZi5wZXJtaXNzaW9uX3NldFtpdGVtX25hbWVdID0ge307XG4gICAgfVxuICAgIHJldHVybiBzZWxmLnBlcm1pc3Npb25fc2V0W2l0ZW1fbmFtZV0gPSBfLmV4dGVuZChfLmNsb25lKHNlbGYucGVybWlzc2lvbl9zZXRbaXRlbV9uYW1lXSksIGl0ZW0pO1xuICB9KTtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHBlcm1pc3Npb25zID0gb3B0aW9ucy5wZXJtaXNzaW9ucztcbiAgICBkaXNhYmxlZF9saXN0X3ZpZXdzID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgOiB2b2lkIDA7XG4gICAgaWYgKGRpc2FibGVkX2xpc3Rfdmlld3MgIT0gbnVsbCA/IGRpc2FibGVkX2xpc3Rfdmlld3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICBkZWZhdWx0TGlzdFZpZXdJZCA9IChyZWYyID0gb3B0aW9ucy5saXN0X3ZpZXdzKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLmFsbCkgIT0gbnVsbCA/IHJlZjMuX2lkIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGRlZmF1bHRMaXN0Vmlld0lkKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBfLm1hcChkaXNhYmxlZF9saXN0X3ZpZXdzLCBmdW5jdGlvbihsaXN0X3ZpZXdfaXRlbSkge1xuICAgICAgICAgIGlmIChkZWZhdWx0TGlzdFZpZXdJZCA9PT0gbGlzdF92aWV3X2l0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBcImFsbFwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdF92aWV3X2l0ZW07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG5ldyBSZWFjdGl2ZVZhcihwZXJtaXNzaW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5wZXJtaXNzaW9ucyA9IG51bGw7XG4gIH1cbiAgX2RiID0gQ3JlYXRvci5jcmVhdGVDb2xsZWN0aW9uKG9wdGlvbnMpO1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW19kYi5fbmFtZV0gPSBfZGI7XG4gIHNlbGYuZGIgPSBfZGI7XG4gIHNlbGYuX2NvbGxlY3Rpb25fbmFtZSA9IF9kYi5fbmFtZTtcbiAgc2NoZW1hID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoc2VsZik7XG4gIHNlbGYuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShzY2hlbWEpO1xuICBpZiAoc2VsZi5uYW1lICE9PSBcInVzZXJzXCIgJiYgc2VsZi5uYW1lICE9PSBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIgJiYgIXNlbGYuaXNfdmlldyAmJiAhXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiLCBcImFjdGlvbl9maWVsZF91cGRhdGVzXCJdLCBzZWxmLm5hbWUpKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2RiLmF0dGFjaFNjaGVtYShzZWxmLnNjaGVtYSwge1xuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHNlbGYubmFtZSA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgX2RiLl9zaW1wbGVTY2hlbWEgPSBzZWxmLnNjaGVtYTtcbiAgfVxuICBpZiAoXy5jb250YWlucyhbXCJmbG93c1wiLCBcImZvcm1zXCIsIFwiaW5zdGFuY2VzXCIsIFwib3JnYW5pemF0aW9uc1wiXSwgc2VsZi5uYW1lKSkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIF9kYi5hdHRhY2hTY2hlbWEoc2VsZi5zY2hlbWEsIHtcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIENyZWF0b3Iub2JqZWN0c0J5TmFtZVtzZWxmLl9jb2xsZWN0aW9uX25hbWVdID0gc2VsZjtcbiAgcmV0dXJuIHNlbGY7XG59O1xuXG5DcmVhdG9yLmdldE9iamVjdE9EYXRhUm91dGVyUHJlZml4ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBcIi9hcGkvb2RhdGEvdjRcIjtcbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBpZiAoIUNyZWF0b3IuYm9vdHN0cmFwTG9hZGVkICYmIENyZWF0b3IuT2JqZWN0cykge1xuICAgIHJldHVybiBfLmVhY2goQ3JlYXRvci5PYmplY3RzLCBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBuZXcgQ3JlYXRvci5PYmplY3Qob2JqZWN0KTtcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldE9iamVjdFNjaGVtYSA9IChvYmopIC0+XG5cdHVubGVzcyBvYmpcblx0XHRyZXR1cm5cblx0c2NoZW1hID0ge31cblxuXHRmaWVsZHNBcnIgPSBbXVxuXG5cdF8uZWFjaCBvYmouZmllbGRzICwgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cdFx0aWYgIV8uaGFzKGZpZWxkLCBcIm5hbWVcIilcblx0XHRcdGZpZWxkLm5hbWUgPSBmaWVsZF9uYW1lXG5cdFx0ZmllbGRzQXJyLnB1c2ggZmllbGRcblxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxuXG5cdFx0ZmllbGRfbmFtZSA9IGZpZWxkLm5hbWVcblxuXHRcdGZzID0ge31cblx0XHRpZiBmaWVsZC5yZWdFeFxuXHRcdFx0ZnMucmVnRXggPSBmaWVsZC5yZWdFeFxuXHRcdGZzLmF1dG9mb3JtID0ge31cblx0XHRmcy5hdXRvZm9ybS5tdWx0aXBsZSA9IGZpZWxkLm11bHRpcGxlXG5cdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRhdXRvZm9ybV90eXBlID0gZmllbGQuYXV0b2Zvcm0/LnR5cGVcblxuXHRcdGlmIGZpZWxkLnR5cGUgPT0gXCJ0ZXh0XCIgb3IgZmllbGQudHlwZSA9PSBcInBob25lXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJbdGV4dF1cIiBvciBmaWVsZC50eXBlID09IFwiW3Bob25lXVwiXG5cdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInRhZ3NcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnY29kZSdcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCJcblx0XHRcdGZzLmF1dG9mb3JtLnJvd3MgPSBmaWVsZC5yb3dzIHx8IDEyXG5cdFx0XHRpZiBmaWVsZC5sYW5ndWFnZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5sYW5ndWFnZSA9IGZpZWxkLmxhbmd1YWdlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidGV4dGFyZWFcIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwid2lkZWFyZWFcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInBhc3N3b3JkXCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInBhc3N3b3JkXCJcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJkYXRlXCJcblx0XHRcdGZzLnR5cGUgPSBEYXRlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNQYWQoKVxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNpT1MoKVxuXHRcdFx0XHRcdFx0IyBGaXggaW9zIDE0LCDmiYvmnLrlrqLmiLfnq6/lvoXlrqHmoLjmlofku7bml6XmnJ/mjqfku7bmmL7npLrmlYXpmpwgIzk5Me+8jGlvc+e7n+S4gOeUqFBD56uv5LiA5qC355qEanPmjqfku7Zcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXG5cdFx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRlXCJcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuXHRcdFx0XHRcdFx0XHRcdHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwic3RlZWRvcy1kYXRlLW1vYmlsZVwiXG5cdFx0XHRcdFx0XHRcdGRhdGVNb2JpbGVPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGF0ZVwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5vdXRGb3JtYXQgPSAneXl5eS1NTS1kZCc7XG5cdFx0XHRcdFx0IyDov5nph4znlKhhZkZpZWxkSW5wdXTogIzkuI3nm7TmjqXnlKhhdXRvZm9ybeeahOWOn+WboOaYr+W9k+Wtl+auteiiq2hpZGRlbueahOaXtuWAmeWOu+aJp+ihjGR4RGF0ZUJveE9wdGlvbnPlj4LmlbDkvJrmiqXplJlcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHR0aW1lem9uZUlkOiBcInV0Y1wiXG5cdFx0XHRcdFx0XHRkeERhdGVCb3hPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGVcIlxuXHRcdFx0XHRcdFx0XHRkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZGF0ZXRpbWVcIlxuXHRcdFx0ZnMudHlwZSA9IERhdGVcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5pc2lPUygpXG5cdFx0XHRcdFx0XHQjIEZpeCBpb3MgMTQsIOaJi+acuuWuouaIt+err+W+heWuoeaguOaWh+S7tuaXpeacn+aOp+S7tuaYvuekuuaVhemanCAjOTkx77yMaW9z57uf5LiA55SoUEPnq6/kuIDmoLfnmoRqc+aOp+S7tlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkeC1kYXRlLWJveFwiXG5cdFx0XHRcdFx0XHRcdGR4RGF0ZUJveE9wdGlvbnM6XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCJcblx0XHRcdFx0XHRcdFx0XHRwaWNrZXJUeXBlOiBcInJvbGxlcnNcIlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIlxuXHRcdFx0XHRcdFx0XHRkYXRlTW9iaWxlT3B0aW9uczpcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg6L+Z6YeM55SoYWZGaWVsZElucHV06ICM5LiN55u05o6l55SoYXV0b2Zvcm3nmoTljp/lm6DmmK/lvZPlrZfmrrXooqtoaWRkZW7nmoTml7blgJnljrvmiafooYxkeERhdGVCb3hPcHRpb25z5Y+C5pWw5Lya5oql6ZSZXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID1cblx0XHRcdFx0XHRcdHR5cGU6IFwiZHgtZGF0ZS1ib3hcIlxuXHRcdFx0XHRcdFx0ZHhEYXRlQm94T3B0aW9uczpcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJkYXRldGltZVwiXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiW09iamVjdF1cIlxuXHRcdFx0ZnMudHlwZSA9IFtPYmplY3RdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiaHRtbFwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PSBcInpoLUNOXCJcblx0XHRcdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiZW4tVVNcIlxuXHRcdFx0XHRmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPVxuXHRcdFx0XHRcdHR5cGU6IFwic3VtbWVybm90ZVwiXG5cdFx0XHRcdFx0Y2xhc3M6ICdzdW1tZXJub3RlLWVkaXRvcidcblx0XHRcdFx0XHRzZXR0aW5nczpcblx0XHRcdFx0XHRcdGhlaWdodDogMjAwXG5cdFx0XHRcdFx0XHRkaWFsb2dzSW5Cb2R5OiB0cnVlXG5cdFx0XHRcdFx0XHR0b29sYmFyOiAgW1xuXHRcdFx0XHRcdFx0XHRbJ2ZvbnQxJywgWydzdHlsZSddXSxcblx0XHRcdFx0XHRcdFx0Wydmb250MicsIFsnYm9sZCcsICd1bmRlcmxpbmUnLCAnaXRhbGljJywgJ2NsZWFyJ11dLFxuXHRcdFx0XHRcdFx0XHRbJ2ZvbnQzJywgWydmb250bmFtZSddXSxcblx0XHRcdFx0XHRcdFx0Wydjb2xvcicsIFsnY29sb3InXV0sXG5cdFx0XHRcdFx0XHRcdFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLFxuXHRcdFx0XHRcdFx0XHRbJ3RhYmxlJywgWyd0YWJsZSddXSxcblx0XHRcdFx0XHRcdFx0WydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZSddXSxcblx0XHRcdFx0XHRcdFx0Wyd2aWV3JywgWydjb2RldmlldyddXVxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0Zm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCfpu5HkvZMnLCflvq7ova/pm4Xpu5EnLCfku7/lrosnLCfmpbfkvZMnLCfpmrbkuaYnLCflubzlnIYnXVxuXHRcdFx0XHRcdFx0bGFuZzogbG9jYWxlXG5cblx0XHRlbHNlIGlmIChmaWVsZC50eXBlID09IFwibG9va3VwXCIgb3IgZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmllbGQuc2hvd0ljb25cblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXG5cdFx0XHRpZiAhZmllbGQuaGlkZGVuXG5cblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlsdGVycyA9IGZpZWxkLmZpbHRlcnNcblxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vblxuXG5cdFx0XHRcdGlmIGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXHRcdFx0XHRcdGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvblxuXG5cdFx0XHRcdGZzLmZpbHRlcnNGdW5jdGlvbiA9IGlmIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiB0aGVuIGZpZWxkLmZpbHRlcnNGdW5jdGlvbiBlbHNlIENyZWF0b3IuZXZhbHVhdGVGaWx0ZXJzXG5cblx0XHRcdFx0aWYgZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cdFx0XHRcdFx0ZnMub3B0aW9uc0Z1bmN0aW9uID0gZmllbGQub3B0aW9uc0Z1bmN0aW9uXG5cblx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvXG5cblx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdGlmIGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbilcblx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvblxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdFx0XHRfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dXG5cdFx0XHRcdFx0XHRcdFx0aWYgX3JlZl9vYmo/LnBlcm1pc3Npb25zPy5hbGxvd0NyZWF0ZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuY3JlYXRlRnVuY3Rpb24gPSAobG9va3VwX2ZpZWxkKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdE1vZGFsLnNob3coXCJDcmVhdG9yT2JqZWN0TW9kYWxcIiwge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IFwiQ3JlYXRvci5Db2xsZWN0aW9ucy4je0NyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvcm1JZDogXCJuZXcje2ZpZWxkLnJlZmVyZW5jZV90by5yZXBsYWNlKCcuJywnXycpfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBcIiN7ZmllbGQucmVmZXJlbmNlX3RvfVwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wZXJhdGlvbjogXCJpbnNlcnRcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvblN1Y2Nlc3M6IChvcGVyYXRpb24sIHJlc3VsdCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3QocmVzdWx0Lm9iamVjdF9uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgcmVzdWx0Lm9iamVjdF9uYW1lID09IFwib2JqZWN0c1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWUubGFiZWwsIHZhbHVlOiByZXN1bHQudmFsdWUubmFtZSwgaWNvbjogcmVzdWx0LnZhbHVlLmljb259XSwgcmVzdWx0LnZhbHVlLm5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvb2t1cF9maWVsZC5hZGRJdGVtcyhbe2xhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsIHZhbHVlOiByZXN1bHQuX2lkfV0sIHJlc3VsdC5faWQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmFsc2VcblxuXHRcdFx0XHRcdGlmIF8uaXNCb29sZWFuKGZpZWxkLmNyZWF0ZSlcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZpZWxkLmNyZWF0ZVxuXG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3NvcnRcblx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnRcblxuXHRcdFx0XHRcdGlmIGZpZWxkLnJlZmVyZW5jZV9saW1pdFxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc0xpbWl0ID0gZmllbGQucmVmZXJlbmNlX2xpbWl0XG5cdFx0XHRcdFx0aWYgZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VUb0ZpZWxkID0gZmllbGQucmVmZXJlbmNlX3RvX2ZpZWxkXG5cblx0XHRcdFx0XHRpZiBmaWVsZC5yZWZlcmVuY2VfdG8gPT0gXCJ1c2Vyc1wiXG5cdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzliIbpg6jkuIvnmoTmlbDmja5cblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWIhumDqOWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxuXHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5YiG6YOo6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc1VuTGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0IyDkvKDlhaXlvZPliY3lr7nosaHnmoTmnYPpmZDvvIzlnKjlh73mlbDkuK3moLnmja7mnYPpmZDorqHnrpfmmK/lkKbopoHpmZDliLblj6rmn6XnnIvmnKzliIbpg6hcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0IyDmnI3liqHnq6/nlKjkuI3liLBpc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRlbHNlIGlmIGZpZWxkLnJlZmVyZW5jZV90byA9PSBcIm9yZ2FuaXphdGlvbnNcIlxuXHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0b3JnXCJcblx0XHRcdFx0XHRcdGlmICFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXRcblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTooajnpLrov4fmu6TmlbDmja7ml7bmmK/lkKblj6rmmL7npLrmnKzliIbpg6jkuIvnmoTmlbDmja5cblx0XHRcdFx0XHRcdFx0IyBpc19jb21wYW55X2xpbWl0ZWTlj6/ku6XooqvmlLnlhpnopobnm5bmiJB0cnVlL2ZhbHNl5oiW5YW25LuWZnVuY3Rpb25cblx0XHRcdFx0XHRcdFx0aWYgZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRcdCMg5pyq5a6a5LmJaXNfY29tcGFueV9saW1pdGVk5bGe5oCn5pe26buY6K6k5aSE55CG6YC76L6R77yaXG5cdFx0XHRcdFx0XHRcdFx0IyDlr7nlvZPliY3lr7nosaHmnIl2aWV3QWxsUmVjb3Jkc+adg+mZkOWImeS4jemZkOWItuaJgOWxnuWIhumDqOWIl+ihqOafpeeci+adg+mZkO+8jOWQpuWImeWPquaYvuekuuW9k+WJjeaJgOWxnuWIhumDqFxuXHRcdFx0XHRcdFx0XHRcdCMg5rOo5oSP5LiN5pivcmVmZXJlbmNlX3Rv5a+56LGh55qEdmlld0FsbFJlY29yZHPmnYPpmZDvvIzogIzmmK/lvZPliY3lr7nosaHnmoRcblx0XHRcdFx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb2JqLnBlcm1pc3Npb25zPy5nZXQoKVxuXHRcdFx0XHRcdFx0XHRcdFx0aXNVbkxpbWl0ZWQgPSBwZXJtaXNzaW9ucz8udmlld0FsbFJlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdGlmIF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5aaC5p6c5a2X5q615omA5bGe5a+56LGh5piv55So5oi35oiW57uE57uH77yM5YiZ5piv5ZCm6ZmQ5Yi25pi+56S65omA5bGe5YiG6YOo6YOo6Zeo5LiObW9kaWZ5QWxsUmVjb3Jkc+adg+mZkOWFs+iBlFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zPy5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBpc1VuTGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgXy5pc0Z1bmN0aW9uIGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0IyDkvKDlhaXlvZPliY3lr7nosaHnmoTmnYPpmZDvvIzlnKjlh73mlbDkuK3moLnmja7mnYPpmZDorqHnrpfmmK/lkKbopoHpmZDliLblj6rmn6XnnIvmnKzliIbpg6hcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0IyDmnI3liqHnq6/nlKjkuI3liLBpc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZFxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpZiB0eXBlb2YoZmllbGQucmVmZXJlbmNlX3RvKSA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdF9yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdFx0XHRcdFx0aWYgXy5pc0FycmF5KF9yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdGZzLnR5cGUgPSBPYmplY3Rcblx0XHRcdFx0XHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9iamVjdFN3aXRjaGUgPSB0cnVlXG5cblx0XHRcdFx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFN0cmluZ1xuXHRcdFx0XHRcdFx0XHRcdGF1dG9mb3JtOiB7b21pdDogdHJ1ZX1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuaWRzXCJdID0ge1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFtTdHJpbmddXG5cdFx0XHRcdFx0XHRcdFx0YXV0b2Zvcm06IHtvbWl0OiB0cnVlfVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0X3JlZmVyZW5jZV90byA9IFtfcmVmZXJlbmNlX3RvXVxuXG5cdFx0XHRcdFx0XHRfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VfdG9bMF1dXG5cdFx0XHRcdFx0XHRpZiBfb2JqZWN0IGFuZCBfb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFRyZWVcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXG5cdFx0XHRcdFx0XHRcdGZzLmF1dG9mb3JtLm9wdGlvbnNNZXRob2QgPSBmaWVsZC5vcHRpb25zTWV0aG9kIHx8IFwiY3JlYXRvci5vYmplY3Rfb3B0aW9uc1wiXG5cblx0XHRcdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZFBhcmFtcyA9ICgpLT5cblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX1cblx0XHRcdFx0XHRcdFx0XHRmcy5hdXRvZm9ybS5yZWZlcmVuY2VzID0gW11cblx0XHRcdFx0XHRcdFx0XHRfcmVmZXJlbmNlX3RvLmZvckVhY2ggKF9yZWZlcmVuY2UpLT5cblx0XHRcdFx0XHRcdFx0XHRcdF9vYmplY3QgPSBDcmVhdG9yLk9iamVjdHNbX3JlZmVyZW5jZV1cblx0XHRcdFx0XHRcdFx0XHRcdGlmIF9vYmplY3Rcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3Q6IF9yZWZlcmVuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogX29iamVjdD8ubGFiZWxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uOiBfb2JqZWN0Py5pY29uXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGluazogKCktPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiL2FwcC8je1Nlc3Npb24uZ2V0KCdhcHBfaWQnKX0vI3tfcmVmZXJlbmNlfS92aWV3L1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcy5wdXNoIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYmplY3Q6IF9yZWZlcmVuY2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW5rOiAoKS0+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCIvYXBwLyN7U2Vzc2lvbi5nZXQoJ2FwcF9pZCcpfS8je19yZWZlcmVuY2V9L3ZpZXcvXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdEljb24gPSBmaWVsZC5kZWZhdWx0SWNvblxuXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwic2VsZWN0XCJcblx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNob3dJY29uID0gZmFsc2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0XCJcblx0XHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRcdFx0aWYgXy5oYXMoZmllbGQsICdmaXJzdE9wdGlvbicpXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBmaWVsZC5maXJzdE9wdGlvblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY3VycmVuY3lcIlxuXHRcdFx0ZnMudHlwZSA9IE51bWJlclxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc051bWJlclwiXG5cdFx0XHRmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMThcblx0XHRcdGlmIGZpZWxkPy5zY2FsZVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5zY2FsZSA9IGZpZWxkLnNjYWxlXG5cdFx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0XHRlbHNlIGlmIGZpZWxkPy5zY2FsZSAhPSAwXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gMlxuXHRcdFx0XHRmcy5kZWNpbWFsID0gdHJ1ZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcIm51bWJlclwiXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxuXHRcdFx0aWYgZmllbGQ/LnNjYWxlXG5cdFx0XHRcdGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGVcblx0XHRcdFx0ZnMuZGVjaW1hbCA9IHRydWVcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJib29sZWFuXCJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi1jaGVja2JveFwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwidG9nZ2xlXCJcblx0XHRcdGZzLnR5cGUgPSBCb29sZWFuXG5cdFx0XHRpZiBmaWVsZC5yZWFkb25seVxuXHRcdFx0XHRmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWVcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3MtYm9vbGVhbi10b2dnbGVcIlxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcInJlZmVyZW5jZVwiXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiY2hlY2tib3hcIlxuXHRcdFx0ZnMudHlwZSA9IFtTdHJpbmddXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIlxuXHRcdFx0ZnMuYXV0b2Zvcm0ub3B0aW9ucyA9IGZpZWxkLm9wdGlvbnNcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJmaWxlXCJcblx0XHRcdGNvbGxlY3Rpb25OYW1lID0gZmllbGQuY29sbGVjdGlvbiB8fCBcImZpbGVzXCIgIyBjb2xsZWN0aW9uIOm7mOiupOaYryAnZmlsZXMnXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogY29sbGVjdGlvbk5hbWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTmFtZVxuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImZpbGVzaXplXCJcblx0XHRcdGZzLnR5cGUgPSBOdW1iZXJcblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZXNpemUnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiT2JqZWN0XCIgfHwgZmllbGQudHlwZSA9PSBcIm9iamVjdFwiXG5cdFx0XHRmcy50eXBlID0gT2JqZWN0XG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiZ3JpZFwiXG5cdFx0XHRmcy50eXBlID0gQXJyYXlcblx0XHRcdGZzLmF1dG9mb3JtLmVkaXRhYmxlID0gdHJ1ZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIlxuXG5cdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHR0eXBlOiBPYmplY3Rcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJpbWFnZVwiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ2ltYWdlcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2ltYWdlLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwiYXZhdGFyXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXZhdGFycydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ2ltYWdlLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImF1ZGlvXCJcblx0XHRcdGlmIGZpZWxkLm11bHRpcGxlXG5cdFx0XHRcdGZzLnR5cGUgPSBbU3RyaW5nXVxuXHRcdFx0XHRzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPVxuXHRcdFx0XHRcdGF1dG9mb3JtOlxuXHRcdFx0XHRcdFx0dHlwZTogJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiAnYXVkaW9zJ1xuXHRcdFx0XHRcdFx0YWNjZXB0OiAnYXVkaW8vKidcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5hY2NlcHQgPSAnYXVkaW8vKidcblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gXCJ2aWRlb1wiXG5cdFx0XHRpZiBmaWVsZC5tdWx0aXBsZVxuXHRcdFx0XHRmcy50eXBlID0gW1N0cmluZ11cblx0XHRcdFx0c2NoZW1hW2ZpZWxkX25hbWUgKyBcIi4kXCJdID1cblx0XHRcdFx0XHRhdXRvZm9ybTpcblx0XHRcdFx0XHRcdHR5cGU6ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogJ3ZpZGVvcydcblx0XHRcdFx0XHRcdGFjY2VwdDogJ3ZpZGVvLyonXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZzLnR5cGUgPSBTdHJpbmdcblx0XHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJ1xuXHRcdFx0XHRmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcydcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ3ZpZGVvLyonXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibG9jYXRpb25cIlxuXHRcdFx0ZnMudHlwZSA9IE9iamVjdFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwibG9jYXRpb25cIlxuXHRcdFx0ZnMuYXV0b2Zvcm0uc3lzdGVtID0gZmllbGQuc3lzdGVtIHx8IFwid2dzODRcIlxuXHRcdFx0ZnMuYmxhY2tib3ggPSB0cnVlXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09IFwibWFya2Rvd25cIlxuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1tYXJrZG93blwiXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICd1cmwnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHQjIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LlVybFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zVXJsJ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZW1haWwnXG5cdFx0XHRmcy50eXBlID0gU3RyaW5nXG5cdFx0XHRmcy5yZWdFeCA9IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdhdXRvbnVtYmVyJ1xuXHRcdFx0ZnMudHlwZSA9IFN0cmluZ1xuXHRcdGVsc2UgaWYgZmllbGQudHlwZSA9PSAnZm9ybXVsYSdcblx0XHRcdGZzID0gQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEoe2ZpZWxkczoge2ZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge3R5cGU6IGZpZWxkLmRhdGFfdHlwZX0pfX0pW2ZpZWxkLm5hbWVdXG5cdFx0ZWxzZSBpZiBmaWVsZC50eXBlID09ICdzdW1tYXJ5J1xuXHRcdFx0ZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7ZmllbGRzOiB7ZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7dHlwZTogZmllbGQuZGF0YV90eXBlfSl9fSlbZmllbGQubmFtZV1cblx0XHRlbHNlIGlmIGZpZWxkLnR5cGUgPT0gJ3BlcmNlbnQnXG5cdFx0XHRmcy50eXBlID0gTnVtYmVyXG5cdFx0XHRmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCJcblx0XHRcdGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxOFxuXHRcdFx0dW5sZXNzIF8uaXNOdW1iZXIoZmllbGQuc2NhbGUpXG5cdFx0XHRcdCMg5rKh6YWN572u5bCP5pWw5L2N5pWw5YiZ5oyJ5bCP5pWw5L2N5pWwMOadpeWkhOeQhu+8jOWNs+m7mOiupOaYvuekuuS4uuaVtOaVsOeahOeZvuWIhuavlO+8jOavlOWmgjIwJe+8jOatpOaXtuaOp+S7tuWPr+S7pei+k+WFpTLkvY3lsI/mlbDvvIzovazmiJDnmb7liIbmr5TlsLHmmK/mlbTmlbBcblx0XHRcdFx0ZmllbGQuc2NhbGUgPSAwXG5cdFx0XHQjIGF1dG9mb3Jt5o6n5Lu25Lit5bCP5pWw5L2N5pWw5aeL57uI5q+U6YWN572u55qE5L2N5pWw5aSaMuS9jVxuXHRcdFx0ZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZSArIDJcblx0XHRcdGZzLmRlY2ltYWwgPSB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0ZnMudHlwZSA9IGZpZWxkLnR5cGVcblxuXHRcdGlmIGZpZWxkLmxhYmVsXG5cdFx0XHRmcy5sYWJlbCA9IGZpZWxkLmxhYmVsXG5cbiNcdFx0aWYgZmllbGQuYWxsb3dlZFZhbHVlc1xuI1x0XHRcdGZzLmFsbG93ZWRWYWx1ZXMgPSBmaWVsZC5hbGxvd2VkVmFsdWVzXG5cblx0XHRpZiAhZmllbGQucmVxdWlyZWRcblx0XHRcdGZzLm9wdGlvbmFsID0gdHJ1ZVxuXG5cdFx0IyBb562+57qm5a+56LGh5ZCM5pe26YWN572u5LqGY29tcGFueV9pZHPlv4Xloavlj4p1bmVkaXRhYmxlX2ZpZWxkc+mAoOaIkOmDqOWIhueUqOaIt+aWsOW7uuetvue6puWvueixoeaXtuaKpemUmSAjMTkyXShodHRwczovL2dpdGh1Yi5jb20vc3RlZWRvcy9zdGVlZG9zLXByb2plY3QtZHp1Zy9pc3N1ZXMvMTkyKVxuXHRcdCMg5ZCO5Y+w5aeL57uI6K6+572ucmVxdWlyZWTkuLpmYWxzZVxuXHRcdGlmICFNZXRlb3IuaXNDbGllbnRcblx0XHRcdGZzLm9wdGlvbmFsID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQudW5pcXVlXG5cdFx0XHRmcy51bmlxdWUgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5vbWl0XG5cdFx0XHRmcy5hdXRvZm9ybS5vbWl0ID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuZ3JvdXBcblx0XHRcdGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXBcblxuXHRcdGlmIGZpZWxkLmlzX3dpZGVcblx0XHRcdGZzLmF1dG9mb3JtLmlzX3dpZGUgPSB0cnVlXG5cblx0XHRpZiBmaWVsZC5oaWRkZW5cblx0XHRcdGZzLmF1dG9mb3JtLnR5cGUgPSBcImhpZGRlblwiXG5cblx0XHRpZiAoZmllbGQudHlwZSA9PSBcInNlbGVjdFwiKSBvciAoZmllbGQudHlwZSA9PSBcImxvb2t1cFwiKSBvciAoZmllbGQudHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIilcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5maWx0ZXJhYmxlKSA9PSAndW5kZWZpbmVkJ1xuXHRcdFx0XHRmaWVsZC5maWx0ZXJhYmxlID0gdHJ1ZVxuXHRcdGlmIGZpZWxkLm5hbWUgPT0gJ25hbWUnIHx8IGZpZWxkLmlzX25hbWVcblx0XHRcdGlmIHR5cGVvZihmaWVsZC5zZWFyY2hhYmxlKSA9PSAndW5kZWZpbmVkJ1xuXHRcdFx0XHRmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZVxuXG5cdFx0aWYgYXV0b2Zvcm1fdHlwZVxuXHRcdFx0ZnMuYXV0b2Zvcm0udHlwZSA9IGF1dG9mb3JtX3R5cGVcblxuXHRcdGlmIGZpZWxkLmRlZmF1bHRWYWx1ZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCBDcmVhdG9yLkZvcm11bGFyLmNoZWNrRm9ybXVsYShmaWVsZC5kZWZhdWx0VmFsdWUpXG5cdFx0XHRcdGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9ICgpLT5cblx0XHRcdFx0XHRyZXR1cm4gQ3JlYXRvci5Gb3JtdWxhci5ydW4oZmllbGQuZGVmYXVsdFZhbHVlLCB7dXNlcklkOiBNZXRlb3IudXNlcklkKCksIHNwYWNlSWQ6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgbm93OiBuZXcgRGF0ZSgpfSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdFZhbHVlXG5cdFx0XHRcdGlmICFfLmlzRnVuY3Rpb24oZmllbGQuZGVmYXVsdFZhbHVlKVxuXHRcdFx0XHRcdGZzLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZVxuXG5cdFx0aWYgZmllbGQucmVhZG9ubHlcblx0XHRcdGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuZGlzYWJsZWRcblx0XHRcdGZzLmF1dG9mb3JtLmRpc2FibGVkID0gdHJ1ZVxuXG5cdFx0aWYgZmllbGQuaW5saW5lSGVscFRleHRcblx0XHRcdGZzLmF1dG9mb3JtLmlubGluZUhlbHBUZXh0ID0gZmllbGQuaW5saW5lSGVscFRleHRcblxuXHRcdGlmIGZpZWxkLmJsYWNrYm94XG5cdFx0XHRmcy5ibGFja2JveCA9IHRydWVcblxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWluJylcblx0XHRcdGZzLm1pbiA9IGZpZWxkLm1pblxuXHRcdGlmIF8uaGFzKGZpZWxkLCAnbWF4Jylcblx0XHRcdGZzLm1heCA9IGZpZWxkLm1heFxuXG5cdFx0IyDlj6rmnInnlJ/kuqfnjq/looPmiY3ph43lu7rntKLlvJVcblx0XHRpZiBNZXRlb3IuaXNQcm9kdWN0aW9uXG5cdFx0XHRpZiBmaWVsZC5pbmRleFxuXHRcdFx0XHRmcy5pbmRleCA9IGZpZWxkLmluZGV4XG5cdFx0XHRlbHNlIGlmIGZpZWxkLnNvcnRhYmxlXG5cdFx0XHRcdGZzLmluZGV4ID0gdHJ1ZVxuXG5cdFx0c2NoZW1hW2ZpZWxkX25hbWVdID0gZnNcblxuXHRyZXR1cm4gc2NoZW1hXG5cblxuQ3JlYXRvci5nZXRGaWVsZERpc3BsYXlWYWx1ZSA9IChvYmplY3RfbmFtZSwgZmllbGRfbmFtZSwgZmllbGRfdmFsdWUpLT5cblx0aHRtbCA9IGZpZWxkX3ZhbHVlXG5cdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXHRpZiAhb2JqZWN0XG5cdFx0cmV0dXJuIFwiXCJcblx0ZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpXG5cdGlmICFmaWVsZFxuXHRcdHJldHVybiBcIlwiXG5cblx0aWYgZmllbGQudHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHRodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQgSDptbScpXG5cdGVsc2UgaWYgZmllbGQudHlwZSA9PSBcImRhdGVcIlxuXHRcdGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG5cblx0cmV0dXJuIGh0bWxcblxuQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkgPSAoZmllbGRfdHlwZSktPlxuXHRyZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblxuQ3JlYXRvci5wdXNoQmV0d2VlbkJ1aWx0aW5PcHRpb25hbHMgPSAoZmllbGRfdHlwZSwgb3BlcmF0aW9ucyktPlxuXHRidWlsdGluVmFsdWVzID0gQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlcyhmaWVsZF90eXBlKVxuXHRpZiBidWlsdGluVmFsdWVzXG5cdFx0Xy5mb3JFYWNoIGJ1aWx0aW5WYWx1ZXMsIChidWlsdGluSXRlbSwga2V5KS0+XG5cdFx0XHRvcGVyYXRpb25zLnB1c2goe2xhYmVsOiBidWlsdGluSXRlbS5sYWJlbCwgdmFsdWU6IGtleX0pXG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSAoZmllbGRfdHlwZSwgaXNfY2hlY2tfb25seSktPlxuXHQjIOi/h+a7pOWZqOWtl+auteexu+Wei+WvueW6lOeahOWGhee9rumAiemhuVxuXHRpZiBbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSlcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSlcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpblZhbHVlSXRlbSA9IChmaWVsZF90eXBlLCBrZXkpLT5cblx0IyDov4fmu6TlmajlrZfmrrXnsbvlnovlr7nlupTnmoTlhoXnva7pgInpoblcblx0aWYgW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIGtleSlcblxuQ3JlYXRvci5nZXRCZXR3ZWVuQnVpbHRpbk9wZXJhdGlvbiA9IChmaWVsZF90eXBlLCB2YWx1ZSktPlxuXHQjIOagueaNrui/h+a7pOWZqOeahOi/h+a7pOWAvO+8jOiOt+WPluWvueW6lOeahOWGhee9rui/kOeul+esplxuXHQjIOavlOWmgnZhbHVl5Li6bGFzdF95ZWFy77yM6L+U5ZueYmV0d2Vlbl90aW1lX2xhc3RfeWVhclxuXHR1bmxlc3MgXy5pc1N0cmluZyh2YWx1ZSlcblx0XHRyZXR1cm5cblx0YmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpXG5cdHVubGVzcyBiZXR3ZWVuQnVpbHRpblZhbHVlc1xuXHRcdHJldHVyblxuXHRyZXN1bHQgPSBudWxsXG5cdF8uZWFjaCBiZXR3ZWVuQnVpbHRpblZhbHVlcywgKGl0ZW0sIG9wZXJhdGlvbiktPlxuXHRcdGlmIGl0ZW0ua2V5ID09IHZhbHVlXG5cdFx0XHRyZXN1bHQgPSBvcGVyYXRpb25cblx0cmV0dXJuIHJlc3VsdFxuXG4jIOWmguaenOWPquaYr+S4uuWIpOaWrW9wZXJhdGlvbuaYr+WQpuWtmOWcqO+8jOWImeayoeW/heimgeiuoeeul3ZhbHVlc++8jOS8oOWFpWlzX2NoZWNrX29ubHnkuLp0cnVl5Y2z5Y+vXG5DcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlcyA9IChpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKS0+XG5cdCMg6L+H5ruk5Zmo5pe26Ze05a2X5q6157G75Z6L5a+55bqU55qE5YaF572u6YCJ6aG5XG5cdHJldHVybiB7XG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc195ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3llYXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc19xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3F1YXJ0ZXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcblx0XHRcImJldHdlZW5fdGltZV90aGlzX21vbnRoXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX21vbnRoXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdGhpc193ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3dlZWtcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcblx0XHRcImJldHdlZW5fdGltZV90b2RheVwiOiBpZiBpc19jaGVja19vbmx5IHRoZW4gdHJ1ZSBlbHNlIENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9kYXlcIiksXG5cdFx0XCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzMwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMzBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9sYXN0XzEyMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzEyMF9kYXlzXCIpLFxuXHRcdFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzYwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfNjBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaWYgaXNfY2hlY2tfb25seSB0aGVuIHRydWUgZWxzZSBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcblx0XHRcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlmIGlzX2NoZWNrX29ubHkgdGhlbiB0cnVlIGVsc2UgQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXG5cdH1cblxuQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aCA9IChtb250aCktPlxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0aWYgbW9udGggPCAzXG5cdFx0cmV0dXJuIDBcblx0ZWxzZSBpZiBtb250aCA8IDZcblx0XHRyZXR1cm4gM1xuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdHJldHVybiA2XG5cdFxuXHRyZXR1cm4gOVxuXG5cbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9ICh5ZWFyLG1vbnRoKS0+XG5cdGlmICF5ZWFyXG5cdFx0eWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKVxuXHRpZiAhbW9udGhcblx0XHRtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKVxuXHRcblx0aWYgbW9udGggPCAzXG5cdFx0eWVhci0tXG5cdFx0bW9udGggPSA5XG5cdGVsc2UgaWYgbW9udGggPCA2XG5cdFx0bW9udGggPSAwXG5cdGVsc2UgaWYgbW9udGggPCA5XG5cdFx0bW9udGggPSAzXG5cdGVsc2UgXG5cdFx0bW9udGggPSA2XG5cdFxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdFxuXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSAoeWVhcixtb250aCktPlxuXHRpZiAheWVhclxuXHRcdHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKClcblx0aWYgIW1vbnRoXG5cdFx0bW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKClcblx0XG5cdGlmIG1vbnRoIDwgM1xuXHRcdG1vbnRoID0gM1xuXHRlbHNlIGlmIG1vbnRoIDwgNlxuXHRcdG1vbnRoID0gNlxuXHRlbHNlIGlmIG1vbnRoIDwgOVxuXHRcdG1vbnRoID0gOVxuXHRlbHNlXG5cdFx0eWVhcisrXG5cdFx0bW9udGggPSAwXG5cdFxuXHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cbkNyZWF0b3IuZ2V0TW9udGhEYXlzID0gKHllYXIsbW9udGgpLT5cblx0aWYgbW9udGggPT0gMTFcblx0XHRyZXR1cm4gMzFcblx0XG5cdG1pbGxpc2Vjb25kID0gMTAwMCAqIDYwICogNjAgKiAyNFxuXHRzdGFydERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0ZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoKzEsIDEpXG5cdGRheXMgPSAoZW5kRGF0ZS1zdGFydERhdGUpL21pbGxpc2Vjb25kXG5cdHJldHVybiBkYXlzXG5cbkNyZWF0b3IuZ2V0TGFzdE1vbnRoRmlyc3REYXkgPSAoeWVhciwgbW9udGgpLT5cblx0aWYgIXllYXJcblx0XHR5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG5cdGlmICFtb250aFxuXHRcdG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpXG5cdFxuXHQjIOaciOS7veS4ujDku6PooajmnKzlubTnmoTnrKzkuIDmnIhcblx0aWYgbW9udGggPT0gMFxuXHRcdG1vbnRoID0gMTFcblx0XHR5ZWFyLS1cblx0XHRyZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpXG5cdFxuXHQjIOWQpuWImSzlj6rlh4/ljrvmnIjku71cblx0bW9udGgtLTtcblx0cmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKVxuXHRcbkNyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtID0gKGZpZWxkX3R5cGUsIGtleSktPlxuXHQjIOi/h+a7pOWZqGJldHdlZW7ov5DnrpfnrKbvvIznjrDnrpfml6XmnJ8v5pel5pyf5pe26Ze057G75Z6L5a2X5q6155qEdmFsdWVz5YC8XG5cdG5vdyA9IG5ldyBEYXRlKClcblx0IyDkuIDlpKnnmoTmr6vnp5LmlbBcblx0bWlsbGlzZWNvbmQgPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cdHllc3RkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdHRvbW9ycm93ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIG1pbGxpc2Vjb25kKVxuXHQjIOS4gOWRqOS4reeahOafkOS4gOWkqVxuXHR3ZWVrID0gbm93LmdldERheSgpXG5cdCMg5YeP5Y6755qE5aSp5pWwXG5cdG1pbnVzRGF5ID0gaWYgd2VlayAhPSAwIHRoZW4gd2VlayAtIDEgZWxzZSA2XG5cdG1vbmRheSA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAobWludXNEYXkgKiBtaWxsaXNlY29uZCkpXG5cdHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDkuIrlkajml6Vcblx0bGFzdFN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgLSBtaWxsaXNlY29uZClcblx0IyDkuIrlkajkuIBcblx0bGFzdE1vbmRheSA9IG5ldyBEYXRlKGxhc3RTdW5kYXkuZ2V0VGltZSgpIC0gKG1pbGxpc2Vjb25kICogNikpXG5cdCMg5LiL5ZGo5LiAXG5cdG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpXG5cdCMg5LiL5ZGo5pelXG5cdG5leHRTdW5kYXkgPSBuZXcgRGF0ZShuZXh0TW9uZGF5LmdldFRpbWUoKSArIChtaWxsaXNlY29uZCAqIDYpKVxuXHRjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG5cdHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMVxuXHRuZXh0WWVhciA9IGN1cnJlbnRZZWFyICsgMVxuXHQjIOW9k+WJjeaciOS7vVxuXHRjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKVxuXHQjIOiuoeaVsOW5tOOAgeaciFxuXHR5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcblx0bW9udGggPSBub3cuZ2V0TW9udGgoKVxuXHQjIOacrOaciOesrOS4gOWkqVxuXHRmaXJzdERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aCwxKVxuXG5cdCMg5b2T5Li6MTLmnIjnmoTml7blgJnlubTku73pnIDopoHliqAxXG5cdCMg5pyI5Lu96ZyA6KaB5pu05paw5Li6MCDkuZ/lsLHmmK/kuIvkuIDlubTnmoTnrKzkuIDkuKrmnIhcblx0aWYgY3VycmVudE1vbnRoID09IDExXG5cdFx0eWVhcisrXG5cdFx0bW9udGgrK1xuXHRlbHNlXG5cdFx0bW9udGgrK1xuXHRcblx0IyDkuIvmnIjnrKzkuIDlpKlcblx0bmV4dE1vbnRoRmlyc3REYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSlcblx0IyDkuIvmnIjmnIDlkI7kuIDlpKlcblx0bmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLG1vbnRoLENyZWF0b3IuZ2V0TW9udGhEYXlzKHllYXIsbW9udGgpKVxuXHQjIOacrOaciOacgOWQjuS4gOWkqVxuXHRsYXN0RGF5ID0gbmV3IERhdGUobmV4dE1vbnRoRmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5LiK5pyI56ys5LiA5aSpXG5cdGxhc3RNb250aEZpcnN0RGF5ID0gQ3JlYXRvci5nZXRMYXN0TW9udGhGaXJzdERheShjdXJyZW50WWVhcixjdXJyZW50TW9udGgpXG5cdCMg5LiK5pyI5pyA5ZCO5LiA5aSpXG5cdGxhc3RNb250aEZpbmFsRGF5ID0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpXG5cdCMg5pys5a2j5bqm5byA5aeL5pelXG5cdHRoaXNRdWFydGVyU3RhcnREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksMSlcblx0IyDmnKzlraPluqbnu5PmnZ/ml6Vcblx0dGhpc1F1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhjdXJyZW50WWVhcixDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkrMikpXG5cdCMg5LiK5a2j5bqm5byA5aeL5pelXG5cdGxhc3RRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldExhc3RRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsY3VycmVudE1vbnRoKVxuXHQjIOS4iuWto+W6pue7k+adn+aXpVxuXHRsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSxsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkrMixDcmVhdG9yLmdldE1vbnRoRGF5cyhsYXN0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIpKVxuXHQjIOS4i+Wto+W6puW8gOWni+aXpVxuXHRuZXh0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXROZXh0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLGN1cnJlbnRNb250aClcblx0IyDkuIvlraPluqbnu5PmnZ/ml6Vcblx0bmV4dFF1YXJ0ZXJFbmREYXkgPSBuZXcgRGF0ZShuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksbmV4dFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpKzIsQ3JlYXRvci5nZXRNb250aERheXMobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSsyKSlcblx0IyDov4fljrs35aSpIFxuXHRsYXN0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNiAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrszMOWkqVxuXHRsYXN0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDI5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOi/h+WOuzYw5aSpXG5cdGxhc3RfNjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoNTkgKiBtaWxsaXNlY29uZCkpXG5cdCMg6L+H5Y67OTDlpKlcblx0bGFzdF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg4OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDov4fljrsxMjDlpKlcblx0bGFzdF8xMjBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoMTE5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTflpKkgXG5cdG5leHRfN19kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg2ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTMw5aSpXG5cdG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpXG5cdCMg5pyq5p2lNjDlpKlcblx0bmV4dF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg1OSAqIG1pbGxpc2Vjb25kKSlcblx0IyDmnKrmnaU5MOWkqVxuXHRuZXh0XzkwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDg5ICogbWlsbGlzZWNvbmQpKVxuXHQjIOacquadpTEyMOWkqVxuXHRuZXh0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMTkgKiBtaWxsaXNlY29uZCkpXG5cblx0c3dpdGNoIGtleVxuXHRcdHdoZW4gXCJsYXN0X3llYXJcIlxuXHRcdFx0I+WOu+W5tFxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF95ZWFyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3ByZXZpb3VzWWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3twcmV2aW91c1llYXJ9LTEyLTMxVDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3llYXJcIlxuXHRcdFx0I+S7iuW5tFxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje2N1cnJlbnRZZWFyfS0wMS0wMVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje2N1cnJlbnRZZWFyfS0xMi0zMVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF95ZWFyXCJcblx0XHRcdCPmmI7lubRcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tuZXh0WWVhcn0tMDEtMDFUMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tuZXh0WWVhcn0tMTItMzFUMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfcXVhcnRlclwiXG5cdFx0XHQj5LiK5a2j5bqmXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChsYXN0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3F1YXJ0ZXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfcXVhcnRlclwiXG5cdFx0XHQj5pys5a2j5bqmXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudCh0aGlzUXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90aGlzX3F1YXJ0ZXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcIm5leHRfcXVhcnRlclwiXG5cdFx0XHQj5LiL5a2j5bqmXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcImxhc3RfbW9udGhcIlxuXHRcdFx0I+S4iuaciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmluYWxEYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfbW9udGhcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRmlyc3REYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTGFzdERheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRoaXNfbW9udGhcIlxuXHRcdFx0I+acrOaciFxuXHRcdFx0c3RyRmlyc3REYXkgPSBtb21lbnQoZmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19tb250aFwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF9tb250aFwiXG5cdFx0XHQj5LiL5pyIXG5cdFx0XHRzdHJGaXJzdERheSA9IG1vbWVudChuZXh0TW9udGhGaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyTGFzdERheSA9IG1vbWVudChuZXh0TW9udGhGaW5hbERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJGaXJzdERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJMYXN0RGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibGFzdF93ZWVrXCJcblx0XHRcdCPkuIrlkahcblx0XHRcdHN0ck1vbmRheSA9IG1vbWVudChsYXN0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRzdHJTdW5kYXkgPSBtb21lbnQobGFzdFN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF93ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0aGlzX3dlZWtcIlxuXHRcdFx0I+acrOWRqFxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG1vbmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc193ZWVrXCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0ck1vbmRheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdW5kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0X3dlZWtcIlxuXHRcdFx0I+S4i+WRqFxuXHRcdFx0c3RyTW9uZGF5ID0gbW9tZW50KG5leHRNb25kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0clN1bmRheSA9IG1vbWVudChuZXh0U3VuZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyTW9uZGF5fVQwMDowMDowMFpcIilcblx0XHRcdGVuZFZhbHVlID0gbmV3IERhdGUoXCIje3N0clN1bmRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInllc3RkYXlcIlxuXHRcdFx0I+aYqOWkqVxuXHRcdFx0c3RyWWVzdGRheSA9IG1vbWVudCh5ZXN0ZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl95ZXN0ZGF5XCIpXG5cdFx0XHRzdGFydFZhbHVlID0gbmV3IERhdGUoXCIje3N0clllc3RkYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyWWVzdGRheX1UMjM6NTk6NTlaXCIpXG5cdFx0d2hlbiBcInRvZGF5XCJcblx0XHRcdCPku4rlpKlcblx0XHRcdHN0clRvZGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9kYXlcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9kYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9kYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJ0b21vcnJvd1wiXG5cdFx0XHQj5piO5aSpXG5cdFx0XHRzdHJUb21vcnJvdyA9IG1vbWVudCh0b21vcnJvdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0bGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9tb3Jyb3d9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyVG9tb3Jyb3d9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzdfZGF5c1wiXG5cdFx0XHQj6L+H5Y67N+WkqVxuXHRcdFx0c3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIikgXG5cdFx0XHRzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzMwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzMw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMzBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzYwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzYw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzkwX2RheXNcIlxuXHRcdFx0I+i/h+WOuzkw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJsYXN0XzEyMF9kYXlzXCJcblx0XHRcdCPov4fljrsxMjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMTIwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XHR3aGVuIFwibmV4dF83X2RheXNcIlxuXHRcdFx0I+acquadpTflpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfN19kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG5cdFx0XHRsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzMwX2RheXNcIlxuXHRcdFx0I+acquadpTMw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzMwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzYwX2RheXNcIlxuXHRcdFx0I+acquadpTYw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzYwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfNjBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzkwX2RheXNcIlxuXHRcdFx0I+acquadpTkw5aSpXG5cdFx0XHRzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdHN0ckVuZERheSA9IG1vbWVudChuZXh0XzkwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKVxuXHRcdFx0c3RhcnRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJTdGFydERheX1UMDA6MDA6MDBaXCIpXG5cdFx0XHRlbmRWYWx1ZSA9IG5ldyBEYXRlKFwiI3tzdHJFbmREYXl9VDIzOjU5OjU5WlwiKVxuXHRcdHdoZW4gXCJuZXh0XzEyMF9kYXlzXCJcblx0XHRcdCPmnKrmnaUxMjDlpKlcblx0XHRcdHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuXHRcdFx0c3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIilcblx0XHRcdGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMTIwX2RheXNcIilcblx0XHRcdHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyU3RhcnREYXl9VDAwOjAwOjAwWlwiKVxuXHRcdFx0ZW5kVmFsdWUgPSBuZXcgRGF0ZShcIiN7c3RyRW5kRGF5fVQyMzo1OTo1OVpcIilcblx0XG5cdHZhbHVlcyA9IFtzdGFydFZhbHVlLCBlbmRWYWx1ZV1cblx0aWYgZmllbGRfdHlwZSA9PSBcImRhdGV0aW1lXCJcblx0XHQjIOaXtumXtOexu+Wei+Wtl+aute+8jOWGhee9ruaXtumXtOiMg+WbtOW6lOivpeiAg+iZkeWBj+enu+aXtuWMuuWAvO+8jOWQpuWImei/h+a7pOaVsOaNruWtmOWcqOWBj+W3rlxuXHRcdCMg6Z2e5YaF572u5pe26Ze06IyD5Zu05pe277yM55So5oi36YCa6L+H5pe26Ze05o6n5Lu26YCJ5oup55qE6IyD5Zu077yM5Lya6Ieq5Yqo5aSE55CG5pe25Yy65YGP5beu5oOF5Ya1XG5cdFx0IyDml6XmnJ/nsbvlnovlrZfmrrXvvIzmlbDmja7lupPmnKzmnaXlsLHlrZjnmoTmmK9VVEPnmoQw54K577yM5LiN5a2Y5Zyo5YGP5beuXG5cdFx0Xy5mb3JFYWNoIHZhbHVlcywgKGZ2KS0+XG5cdFx0XHRpZiBmdlxuXHRcdFx0XHRmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwIClcblx0XG5cdHJldHVybiB7XG5cdFx0bGFiZWw6IGxhYmVsXG5cdFx0a2V5OiBrZXlcblx0XHR2YWx1ZXM6IHZhbHVlc1xuXHR9XG5cbkNyZWF0b3IuZ2V0RmllbGREZWZhdWx0T3BlcmF0aW9uID0gKGZpZWxkX3R5cGUpLT5cblx0aWYgZmllbGRfdHlwZSAmJiBDcmVhdG9yLmNoZWNrRmllbGRUeXBlU3VwcG9ydEJldHdlZW5RdWVyeShmaWVsZF90eXBlKVxuXHRcdHJldHVybiAnYmV0d2Vlbidcblx0ZWxzZSBpZiBbXCJ0ZXh0YXJlYVwiLCBcInRleHRcIiwgXCJjb2RlXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpXG5cdFx0cmV0dXJuICdjb250YWlucydcblx0ZWxzZVxuXHRcdHJldHVybiBcIj1cIlxuXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gKGZpZWxkX3R5cGUpIC0+XG5cdCMg5pel5pyf57G75Z6LOiBkYXRlLCBkYXRldGltZSAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcIjxcIiwgXCI+XCIsIFwiPD1cIiwgXCI+PVwiXG5cdCMg5paH5pys57G75Z6LOiB0ZXh0LCB0ZXh0YXJlYSwgaHRtbCAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIiwgXCJzdGFydHN3aXRoXCJcblx0IyDpgInmi6nnsbvlnos6IGxvb2t1cCwgbWFzdGVyX2RldGFpbCwgc2VsZWN0IOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxuXHQjIOaVsOWAvOexu+WeizogY3VycmVuY3ksIG51bWJlciAg5pSv5oyB5pON5L2c56ymOiBcIj1cIiwgXCI8PlwiLCBcIjxcIiwgXCI+XCIsIFwiPD1cIiwgXCI+PVwiXG5cdCMg5biD5bCU57G75Z6LOiBib29sZWFuICDmlK/mjIHmk43kvZznrKY6IFwiPVwiLCBcIjw+XCJcblx0IyDmlbDnu4Tnsbvlnos6IGNoZWNrYm94LCBbdGV4dF0gIOaUr+aMgeaTjeS9nOespjogXCI9XCIsIFwiPD5cIlxuXG5cdG9wdGlvbmFscyA9IHtcblx0XHRlcXVhbDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLCB2YWx1ZTogXCI9XCJ9LFxuXHRcdHVuZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl91bmVxdWFsXCIpLCB2YWx1ZTogXCI8PlwifSxcblx0XHRsZXNzX3RoYW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksIHZhbHVlOiBcIjxcIn0sXG5cdFx0Z3JlYXRlcl90aGFuOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLCB2YWx1ZTogXCI+XCJ9LFxuXHRcdGxlc3Nfb3JfZXF1YWw6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX29yX2VxdWFsXCIpLCB2YWx1ZTogXCI8PVwifSxcblx0XHRncmVhdGVyX29yX2VxdWFsOiB7bGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSwgdmFsdWU6IFwiPj1cIn0sXG5cdFx0Y29udGFpbnM6IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSwgdmFsdWU6IFwiY29udGFpbnNcIn0sXG5cdFx0bm90X2NvbnRhaW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9kb2VzX25vdF9jb250YWluXCIpLCB2YWx1ZTogXCJub3Rjb250YWluc1wifSxcblx0XHRzdGFydHNfd2l0aDoge2xhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLCB2YWx1ZTogXCJzdGFydHN3aXRoXCJ9LFxuXHRcdGJldHdlZW46IHtsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLCB2YWx1ZTogXCJiZXR3ZWVuXCJ9LFxuXHR9XG5cblx0aWYgZmllbGRfdHlwZSA9PSB1bmRlZmluZWRcblx0XHRyZXR1cm4gXy52YWx1ZXMob3B0aW9uYWxzKVxuXG5cdG9wZXJhdGlvbnMgPSBbXVxuXG5cdGlmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5iZXR3ZWVuKVxuXHRcdENyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpXG5cdGVsc2UgaWYgZmllbGRfdHlwZSA9PSBcInRleHRcIiBvciBmaWVsZF90eXBlID09IFwidGV4dGFyZWFcIiBvciBmaWVsZF90eXBlID09IFwiaHRtbFwiIG9yIGZpZWxkX3R5cGUgPT0gXCJjb2RlXCJcbiNcdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwsIG9wdGlvbmFscy5jb250YWlucywgb3B0aW9uYWxzLm5vdF9jb250YWluLCBvcHRpb25hbHMuc3RhcnRzX3dpdGgpXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5jb250YWlucylcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwibG9va3VwXCIgb3IgZmllbGRfdHlwZSA9PSBcIm1hc3Rlcl9kZXRhaWxcIiBvciBmaWVsZF90eXBlID09IFwic2VsZWN0XCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiY3VycmVuY3lcIiBvciBmaWVsZF90eXBlID09IFwibnVtYmVyXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbCwgb3B0aW9uYWxzLmxlc3NfdGhhbiwgb3B0aW9uYWxzLmdyZWF0ZXJfdGhhbiwgb3B0aW9uYWxzLmxlc3Nfb3JfZXF1YWwsIG9wdGlvbmFscy5ncmVhdGVyX29yX2VxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJib29sZWFuXCJcblx0XHRvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmVxdWFsLCBvcHRpb25hbHMudW5lcXVhbClcblx0ZWxzZSBpZiBmaWVsZF90eXBlID09IFwiY2hlY2tib3hcIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlIGlmIGZpZWxkX3R5cGUgPT0gXCJbdGV4dF1cIlxuXHRcdG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKVxuXHRlbHNlXG5cdFx0b3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpXG5cblx0cmV0dXJuIG9wZXJhdGlvbnNcblxuIyMjXG4gICAg5YWI5oyJ54Wn5pyJ5o6S5bqP5Y+355qE5bCP55qE5Zyo5YmN77yM5aSn55qE5Zyo5ZCOXG4gICAg5YaN5bCG5rKh5pyJ5o6S5bqP5Y+355qE5pi+56S65ZyoXG4jIyNcbkNyZWF0b3IuZ2V0T2JqZWN0RmllbGRzTmFtZSA9IChvYmplY3RfbmFtZSktPlxuXHRmaWVsZHMgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk/LmZpZWxkc1xuXHRmaWVsZHNBcnIgPSBbXVxuXG5cdF8uZWFjaCBmaWVsZHMsIChmaWVsZCktPlxuXHRcdGZpZWxkc0Fyci5wdXNoIHtuYW1lOiBmaWVsZC5uYW1lLCBzb3J0X25vOiBmaWVsZC5zb3J0X25vfVxuXG5cdGZpZWxkc05hbWUgPSBbXVxuXHRfLmVhY2ggXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIChmaWVsZCktPlxuXHRcdGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKVxuXHRyZXR1cm4gZmllbGRzTmFtZVxuIiwiQ3JlYXRvci5nZXRPYmplY3RTY2hlbWEgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGZpZWxkc0Fyciwgc2NoZW1hO1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICBzY2hlbWEgPSB7fTtcbiAgZmllbGRzQXJyID0gW107XG4gIF8uZWFjaChvYmouZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgIGlmICghXy5oYXMoZmllbGQsIFwibmFtZVwiKSkge1xuICAgICAgZmllbGQubmFtZSA9IGZpZWxkX25hbWU7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaChmaWVsZCk7XG4gIH0pO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgdmFyIF9vYmplY3QsIF9yZWZfb2JqLCBfcmVmZXJlbmNlX3RvLCBhdXRvZm9ybV90eXBlLCBjb2xsZWN0aW9uTmFtZSwgZmllbGRfbmFtZSwgZnMsIGlzVW5MaW1pdGVkLCBsb2NhbGUsIHBlcm1pc3Npb25zLCByZWYsIHJlZjEsIHJlZjIsIHJlZjM7XG4gICAgZmllbGRfbmFtZSA9IGZpZWxkLm5hbWU7XG4gICAgZnMgPSB7fTtcbiAgICBpZiAoZmllbGQucmVnRXgpIHtcbiAgICAgIGZzLnJlZ0V4ID0gZmllbGQucmVnRXg7XG4gICAgfVxuICAgIGZzLmF1dG9mb3JtID0ge307XG4gICAgZnMuYXV0b2Zvcm0ubXVsdGlwbGUgPSBmaWVsZC5tdWx0aXBsZTtcbiAgICBmcy5hdXRvZm9ybS5yZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG87XG4gICAgYXV0b2Zvcm1fdHlwZSA9IChyZWYgPSBmaWVsZC5hdXRvZm9ybSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIGlmIChmaWVsZC50eXBlID09PSBcInRleHRcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIlt0ZXh0XVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiW3Bob25lXVwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ0YWdzXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAnY29kZScpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJ3aWRlYXJlYVwiO1xuICAgICAgZnMuYXV0b2Zvcm0ucm93cyA9IGZpZWxkLnJvd3MgfHwgMTI7XG4gICAgICBpZiAoZmllbGQubGFuZ3VhZ2UpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0ubGFuZ3VhZ2UgPSBmaWVsZC5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcIndpZGVhcmVhXCI7XG4gICAgICBmcy5hdXRvZm9ybS5yb3dzID0gZmllbGQucm93cyB8fCAyO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwicGFzc3dvcmRcIjtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICBmcy50eXBlID0gRGF0ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzUGFkKCkpIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5pc2lPUygpKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgICAgdGltZXpvbmVJZDogXCJ1dGNcIixcbiAgICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZFwiLFxuICAgICAgICAgICAgICAgIHBpY2tlclR5cGU6IFwicm9sbGVyc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgICAgdHlwZTogXCJzdGVlZG9zLWRhdGUtbW9iaWxlXCIsXG4gICAgICAgICAgICAgIGRhdGVNb2JpbGVPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0ub3V0Rm9ybWF0ID0gJ3l5eXktTU0tZGQnO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmFmRmllbGRJbnB1dCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiZHgtZGF0ZS1ib3hcIixcbiAgICAgICAgICAgIHRpbWV6b25lSWQ6IFwidXRjXCIsXG4gICAgICAgICAgICBkeERhdGVCb3hPcHRpb25zOiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICBkaXNwbGF5Rm9ybWF0OiBcInl5eXktTU0tZGRcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgICAgZnMudHlwZSA9IERhdGU7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc1BhZCgpKSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuaXNpT1MoKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcImR4LWRhdGUtYm94XCIsXG4gICAgICAgICAgICAgIGR4RGF0ZUJveE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgZGlzcGxheUZvcm1hdDogXCJ5eXl5LU1NLWRkIEhIOm1tXCIsXG4gICAgICAgICAgICAgICAgcGlja2VyVHlwZTogXCJyb2xsZXJzXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgICB0eXBlOiBcInN0ZWVkb3MtZGF0ZS1tb2JpbGVcIixcbiAgICAgICAgICAgICAgZGF0ZU1vYmlsZU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uYWZGaWVsZElucHV0ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkeC1kYXRlLWJveFwiLFxuICAgICAgICAgICAgZHhEYXRlQm94T3B0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwieXl5eS1NTS1kZCBISDptbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJbT2JqZWN0XVwiKSB7XG4gICAgICBmcy50eXBlID0gW09iamVjdF07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImh0bWxcIikge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PT0gXCJ6aC1DTlwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAgICAgfVxuICAgICAgICBmcy5hdXRvZm9ybS5hZkZpZWxkSW5wdXQgPSB7XG4gICAgICAgICAgdHlwZTogXCJzdW1tZXJub3RlXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiAnc3VtbWVybm90ZS1lZGl0b3InLFxuICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICAgIGRpYWxvZ3NJbkJvZHk6IHRydWUsXG4gICAgICAgICAgICB0b29sYmFyOiBbWydmb250MScsIFsnc3R5bGUnXV0sIFsnZm9udDInLCBbJ2JvbGQnLCAndW5kZXJsaW5lJywgJ2l0YWxpYycsICdjbGVhciddXSwgWydmb250MycsIFsnZm9udG5hbWUnXV0sIFsnY29sb3InLCBbJ2NvbG9yJ11dLCBbJ3BhcmEnLCBbJ3VsJywgJ29sJywgJ3BhcmFncmFwaCddXSwgWyd0YWJsZScsIFsndGFibGUnXV0sIFsnaW5zZXJ0JywgWydsaW5rJywgJ3BpY3R1cmUnXV0sIFsndmlldycsIFsnY29kZXZpZXcnXV1dLFxuICAgICAgICAgICAgZm9udE5hbWVzOiBbJ0FyaWFsJywgJ0NvbWljIFNhbnMgTVMnLCAnQ291cmllciBOZXcnLCAnSGVsdmV0aWNhJywgJ0ltcGFjdCcsICflrovkvZMnLCAn6buR5L2TJywgJ+W+rui9r+mbhem7kScsICfku7/lrosnLCAn5qW35L2TJywgJ+matuS5picsICflubzlnIYnXSxcbiAgICAgICAgICAgIGxhbmc6IGxvY2FsZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGQudHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZpZWxkLnNob3dJY29uO1xuICAgICAgaWYgKGZpZWxkLm11bHRpcGxlKSB7XG4gICAgICAgIGZzLnR5cGUgPSBbU3RyaW5nXTtcbiAgICAgIH1cbiAgICAgIGlmICghZmllbGQuaGlkZGVuKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmZpbHRlcnMgPSBmaWVsZC5maWx0ZXJzO1xuICAgICAgICBmcy5hdXRvZm9ybS5kZXBlbmRPbiA9IGZpZWxkLmRlcGVuZF9vbjtcbiAgICAgICAgaWYgKGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbikge1xuICAgICAgICAgIGZzLmJlZm9yZU9wZW5GdW5jdGlvbiA9IGZpZWxkLmJlZm9yZU9wZW5GdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBmcy5maWx0ZXJzRnVuY3Rpb24gPSBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gPyBmaWVsZC5maWx0ZXJzRnVuY3Rpb24gOiBDcmVhdG9yLmV2YWx1YXRlRmlsdGVycztcbiAgICAgICAgaWYgKGZpZWxkLm9wdGlvbnNGdW5jdGlvbikge1xuICAgICAgICAgIGZzLm9wdGlvbnNGdW5jdGlvbiA9IGZpZWxkLm9wdGlvbnNGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3RvKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmNyZWF0ZUZ1bmN0aW9uICYmIF8uaXNGdW5jdGlvbihmaWVsZC5jcmVhdGVGdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgZnMuY3JlYXRlRnVuY3Rpb24gPSBmaWVsZC5jcmVhdGVGdW5jdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKGZpZWxkLnJlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgICBfcmVmX29iaiA9IENyZWF0b3IuT2JqZWN0c1tmaWVsZC5yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgICAgIGlmIChfcmVmX29iaiAhPSBudWxsID8gKHJlZjEgPSBfcmVmX29iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjEuYWxsb3dDcmVhdGUgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBmcy5jcmVhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKGxvb2t1cF9maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTW9kYWwuc2hvdyhcIkNyZWF0b3JPYmplY3RNb2RhbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogXCJDcmVhdG9yLkNvbGxlY3Rpb25zLlwiICsgKENyZWF0b3IuZ2V0Q29sbGVjdGlvbihmaWVsZC5yZWZlcmVuY2VfdG8pLl9uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICBmb3JtSWQ6IFwibmV3XCIgKyAoZmllbGQucmVmZXJlbmNlX3RvLnJlcGxhY2UoJy4nLCAnXycpKSxcbiAgICAgICAgICAgICAgICAgICAgICBvYmplY3RfbmFtZTogXCJcIiArIGZpZWxkLnJlZmVyZW5jZV90byxcbiAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiaW5zZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbihvcGVyYXRpb24sIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KHJlc3VsdC5vYmplY3RfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lm9iamVjdF9uYW1lID09PSBcIm9iamVjdHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9va3VwX2ZpZWxkLmFkZEl0ZW1zKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogcmVzdWx0LnZhbHVlLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC52YWx1ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogcmVzdWx0LnZhbHVlLmljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHJlc3VsdC52YWx1ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb29rdXBfZmllbGQuYWRkSXRlbXMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiByZXN1bHQudmFsdWVbb2JqZWN0Lk5BTUVfRklFTERfS0VZXSB8fCByZXN1bHQudmFsdWUubGFiZWwgfHwgcmVzdWx0LnZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0Ll9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgcmVzdWx0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmNyZWF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXy5pc0Jvb2xlYW4oZmllbGQuY3JlYXRlKSkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0uY3JlYXRlID0gZmllbGQuY3JlYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGQucmVmZXJlbmNlX3NvcnQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNTb3J0ID0gZmllbGQucmVmZXJlbmNlX3NvcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZC5yZWZlcmVuY2VfbGltaXQpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnNMaW1pdCA9IGZpZWxkLnJlZmVyZW5jZV9saW1pdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90b19maWVsZCkge1xuICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlVG9GaWVsZCA9IGZpZWxkLnJlZmVyZW5jZV90b19maWVsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJ1c2Vyc1wiKSB7XG4gICAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3R1c2VyXCI7XG4gICAgICAgICAgICBpZiAoIWZpZWxkLmhpZGRlbiAmJiAhZmllbGQub21pdCkge1xuICAgICAgICAgICAgICBpZiAoZmllbGQuaXNfY29tcGFueV9saW1pdGVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IChyZWYyID0gb2JqLnBlcm1pc3Npb25zKSAhPSBudWxsID8gcmVmMi5nZXQoKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZShbXCJvcmdhbml6YXRpb25zXCIsIFwidXNlcnNcIiwgXCJzcGFjZV91c2Vyc1wiXSwgb2JqLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVW5MaW1pdGVkID0gcGVybWlzc2lvbnMgIT0gbnVsbCA/IHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoaXNVbkxpbWl0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24oZmllbGQuaXNfY29tcGFueV9saW1pdGVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZChvYmoucGVybWlzc2lvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnJlZmVyZW5jZV90byA9PT0gXCJvcmdhbml6YXRpb25zXCIpIHtcbiAgICAgICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdG9yZ1wiO1xuICAgICAgICAgICAgaWYgKCFmaWVsZC5oaWRkZW4gJiYgIWZpZWxkLm9taXQpIHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSAocmVmMyA9IG9iai5wZXJtaXNzaW9ucykgIT0gbnVsbCA/IHJlZjMuZ2V0KCkgOiB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGUoW1wib3JnYW5pemF0aW9uc1wiLCBcInVzZXJzXCIsIFwic3BhY2VfdXNlcnNcIl0sIG9iai5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBpc1VuTGltaXRlZCA9IHBlcm1pc3Npb25zICE9IG51bGwgPyBwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIDogdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKGlzVW5MaW1pdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzLmF1dG9mb3JtLmlzX2NvbXBhbnlfbGltaXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKGZpZWxkLmlzX2NvbXBhbnlfbGltaXRlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQob2JqLnBlcm1pc3Npb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0uaXNfY29tcGFueV9saW1pdGVkID0gZmllbGQuaXNfY29tcGFueV9saW1pdGVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5pc19jb21wYW55X2xpbWl0ZWQgPSBmaWVsZC5pc19jb21wYW55X2xpbWl0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmllbGQucmVmZXJlbmNlX3RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3JlZmVyZW5jZV90byA9IGZpZWxkLnJlZmVyZW5jZV90bztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoX3JlZmVyZW5jZV90bykpIHtcbiAgICAgICAgICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgICAgICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vYmplY3RTd2l0Y2hlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5vXCJdID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgICAgICAgb21pdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2NoZW1hW2ZpZWxkX25hbWUgKyBcIi5pZHNcIl0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogW1N0cmluZ10sXG4gICAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgICAgICAgIG9taXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVmZXJlbmNlX3RvID0gW19yZWZlcmVuY2VfdG9dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX29iamVjdCA9IENyZWF0b3IuT2JqZWN0c1tfcmVmZXJlbmNlX3RvWzBdXTtcbiAgICAgICAgICAgIGlmIChfb2JqZWN0ICYmIF9vYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic2VsZWN0VHJlZVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0xvb2t1cHNcIjtcbiAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ub3B0aW9uc01ldGhvZCA9IGZpZWxkLm9wdGlvbnNNZXRob2QgfHwgXCJjcmVhdG9yLm9iamVjdF9vcHRpb25zXCI7XG4gICAgICAgICAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zTWV0aG9kUGFyYW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZnMuYXV0b2Zvcm0ucmVmZXJlbmNlcyA9IFtdO1xuICAgICAgICAgICAgICAgIF9yZWZlcmVuY2VfdG8uZm9yRWFjaChmdW5jdGlvbihfcmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICBfb2JqZWN0ID0gQ3JlYXRvci5PYmplY3RzW19yZWZlcmVuY2VdO1xuICAgICAgICAgICAgICAgICAgaWYgKF9vYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZzLmF1dG9mb3JtLnJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBfcmVmZXJlbmNlLFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBfb2JqZWN0ICE9IG51bGwgPyBfb2JqZWN0LmxhYmVsIDogdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgIGljb246IF9vYmplY3QgIT0gbnVsbCA/IF9vYmplY3QuaWNvbiA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcy5hdXRvZm9ybS5yZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogX3JlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi9hcHAvXCIgKyAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSArIFwiL1wiICsgX3JlZmVyZW5jZSArIFwiL3ZpZXcvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRJY29uID0gZmllbGQuZGVmYXVsdEljb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTG9va3Vwc1wiO1xuICAgICAgICBmcy5hdXRvZm9ybS5zaG93SWNvbiA9IGZhbHNlO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInNlbGVjdFwiO1xuICAgICAgICBmcy5hdXRvZm9ybS5vcHRpb25zID0gZmllbGQub3B0aW9ucztcbiAgICAgICAgaWYgKF8uaGFzKGZpZWxkLCAnZmlyc3RPcHRpb24nKSkge1xuICAgICAgICAgIGZzLmF1dG9mb3JtLmZpcnN0T3B0aW9uID0gZmllbGQuZmlyc3RPcHRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnMuYXV0b2Zvcm0uZmlyc3RPcHRpb24gPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImN1cnJlbmN5XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGU7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgoZmllbGQgIT0gbnVsbCA/IGZpZWxkLnNjYWxlIDogdm9pZCAwKSAhPT0gMCkge1xuICAgICAgICBmcy5hdXRvZm9ybS5zY2FsZSA9IDI7XG4gICAgICAgIGZzLmRlY2ltYWwgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZnMudHlwZSA9IE51bWJlcjtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcInN0ZWVkb3NOdW1iZXJcIjtcbiAgICAgIGZzLmF1dG9mb3JtLnByZWNpc2lvbiA9IGZpZWxkLnByZWNpc2lvbiB8fCAxODtcbiAgICAgIGlmIChmaWVsZCAhPSBudWxsID8gZmllbGQuc2NhbGUgOiB2b2lkIDApIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uc2NhbGUgPSBmaWVsZC5zY2FsZTtcbiAgICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImJvb2xlYW5cIikge1xuICAgICAgZnMudHlwZSA9IEJvb2xlYW47XG4gICAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1ib29sZWFuLWNoZWNrYm94XCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInRvZ2dsZVwiKSB7XG4gICAgICBmcy50eXBlID0gQm9vbGVhbjtcbiAgICAgIGlmIChmaWVsZC5yZWFkb25seSkge1xuICAgICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zLWJvb2xlYW4tdG9nZ2xlXCI7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcInJlZmVyZW5jZVwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzZWxlY3QtY2hlY2tib3hcIjtcbiAgICAgIGZzLmF1dG9mb3JtLm9wdGlvbnMgPSBmaWVsZC5vcHRpb25zO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlXCIpIHtcbiAgICAgIGNvbGxlY3Rpb25OYW1lID0gZmllbGQuY29sbGVjdGlvbiB8fCBcImZpbGVzXCI7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IGNvbGxlY3Rpb25OYW1lXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlVXBsb2FkJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25OYW1lO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJmaWxlc2l6ZVwiKSB7XG4gICAgICBmcy50eXBlID0gTnVtYmVyO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdmaWxlc2l6ZSc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcIk9iamVjdFwiIHx8IGZpZWxkLnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGZzLnR5cGUgPSBPYmplY3Q7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImdyaWRcIikge1xuICAgICAgZnMudHlwZSA9IEFycmF5O1xuICAgICAgZnMuYXV0b2Zvcm0uZWRpdGFibGUgPSB0cnVlO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvc0dyaWRcIjtcbiAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJpbWFnZVwiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICdpbWFnZXMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2ltYWdlcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICdpbWFnZS8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwiYXZhdGFyXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F2YXRhcnMnLFxuICAgICAgICAgICAgYWNjZXB0OiAnaW1hZ2UvKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ2F2YXRhcnMnO1xuICAgICAgICBmcy5hdXRvZm9ybS5hY2NlcHQgPSAnaW1hZ2UvKic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBcImF1ZGlvXCIpIHtcbiAgICAgIGlmIChmaWVsZC5tdWx0aXBsZSkge1xuICAgICAgICBmcy50eXBlID0gW1N0cmluZ107XG4gICAgICAgIHNjaGVtYVtmaWVsZF9uYW1lICsgXCIuJFwiXSA9IHtcbiAgICAgICAgICBhdXRvZm9ybToge1xuICAgICAgICAgICAgdHlwZTogJ2ZpbGVVcGxvYWQnLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogJ2F1ZGlvcycsXG4gICAgICAgICAgICBhY2NlcHQ6ICdhdWRpby8qJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSAnZmlsZVVwbG9hZCc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmNvbGxlY3Rpb24gPSAnYXVkaW9zJztcbiAgICAgICAgZnMuYXV0b2Zvcm0uYWNjZXB0ID0gJ2F1ZGlvLyonO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJ2aWRlb1wiKSB7XG4gICAgICBpZiAoZmllbGQubXVsdGlwbGUpIHtcbiAgICAgICAgZnMudHlwZSA9IFtTdHJpbmddO1xuICAgICAgICBzY2hlbWFbZmllbGRfbmFtZSArIFwiLiRcIl0gPSB7XG4gICAgICAgICAgYXV0b2Zvcm06IHtcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlVXBsb2FkJyxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246ICd2aWRlb3MnLFxuICAgICAgICAgICAgYWNjZXB0OiAndmlkZW8vKidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ2ZpbGVVcGxvYWQnO1xuICAgICAgICBmcy5hdXRvZm9ybS5jb2xsZWN0aW9uID0gJ3ZpZGVvcyc7XG4gICAgICAgIGZzLmF1dG9mb3JtLmFjY2VwdCA9ICd2aWRlby8qJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwibG9jYXRpb25cIikge1xuICAgICAgZnMudHlwZSA9IE9iamVjdDtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBcImxvY2F0aW9uXCI7XG4gICAgICBmcy5hdXRvZm9ybS5zeXN0ZW0gPSBmaWVsZC5zeXN0ZW0gfHwgXCJ3Z3M4NFwiO1xuICAgICAgZnMuYmxhY2tib3ggPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJtYXJrZG93blwiKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwic3RlZWRvcy1tYXJrZG93blwiO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ3VybCcpIHtcbiAgICAgIGZzLnR5cGUgPSBTdHJpbmc7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gJ3N0ZWVkb3NVcmwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2VtYWlsJykge1xuICAgICAgZnMudHlwZSA9IFN0cmluZztcbiAgICAgIGZzLnJlZ0V4ID0gU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsO1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9ICdzdGVlZG9zRW1haWwnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2F1dG9udW1iZXInKSB7XG4gICAgICBmcy50eXBlID0gU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gJ2Zvcm11bGEnKSB7XG4gICAgICBmcyA9IENyZWF0b3IuZ2V0T2JqZWN0U2NoZW1hKHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZmllbGQ6IE9iamVjdC5hc3NpZ24oe30sIGZpZWxkLCB7XG4gICAgICAgICAgICB0eXBlOiBmaWVsZC5kYXRhX3R5cGVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVtmaWVsZC5uYW1lXTtcbiAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09ICdzdW1tYXJ5Jykge1xuICAgICAgZnMgPSBDcmVhdG9yLmdldE9iamVjdFNjaGVtYSh7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZpZWxkOiBPYmplY3QuYXNzaWduKHt9LCBmaWVsZCwge1xuICAgICAgICAgICAgdHlwZTogZmllbGQuZGF0YV90eXBlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlbZmllbGQubmFtZV07XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSAncGVyY2VudCcpIHtcbiAgICAgIGZzLnR5cGUgPSBOdW1iZXI7XG4gICAgICBmcy5hdXRvZm9ybS50eXBlID0gXCJzdGVlZG9zTnVtYmVyXCI7XG4gICAgICBmcy5hdXRvZm9ybS5wcmVjaXNpb24gPSBmaWVsZC5wcmVjaXNpb24gfHwgMTg7XG4gICAgICBpZiAoIV8uaXNOdW1iZXIoZmllbGQuc2NhbGUpKSB7XG4gICAgICAgIGZpZWxkLnNjYWxlID0gMDtcbiAgICAgIH1cbiAgICAgIGZzLmF1dG9mb3JtLnNjYWxlID0gZmllbGQuc2NhbGUgKyAyO1xuICAgICAgZnMuZGVjaW1hbCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZzLnR5cGUgPSBmaWVsZC50eXBlO1xuICAgIH1cbiAgICBpZiAoZmllbGQubGFiZWwpIHtcbiAgICAgIGZzLmxhYmVsID0gZmllbGQubGFiZWw7XG4gICAgfVxuICAgIGlmICghZmllbGQucmVxdWlyZWQpIHtcbiAgICAgIGZzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZzLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLnVuaXF1ZSkge1xuICAgICAgZnMudW5pcXVlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLm9taXQpIHtcbiAgICAgIGZzLmF1dG9mb3JtLm9taXQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZ3JvdXApIHtcbiAgICAgIGZzLmF1dG9mb3JtLmdyb3VwID0gZmllbGQuZ3JvdXA7XG4gICAgfVxuICAgIGlmIChmaWVsZC5pc193aWRlKSB7XG4gICAgICBmcy5hdXRvZm9ybS5pc193aWRlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmhpZGRlbikge1xuICAgICAgZnMuYXV0b2Zvcm0udHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgfVxuICAgIGlmICgoZmllbGQudHlwZSA9PT0gXCJzZWxlY3RcIikgfHwgKGZpZWxkLnR5cGUgPT09IFwibG9va3VwXCIpIHx8IChmaWVsZC50eXBlID09PSBcIm1hc3Rlcl9kZXRhaWxcIikpIHtcbiAgICAgIGlmICh0eXBlb2YgZmllbGQuZmlsdGVyYWJsZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmllbGQuZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaWVsZC5uYW1lID09PSAnbmFtZScgfHwgZmllbGQuaXNfbmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5zZWFyY2hhYmxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmaWVsZC5zZWFyY2hhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF1dG9mb3JtX3R5cGUpIHtcbiAgICAgIGZzLmF1dG9mb3JtLnR5cGUgPSBhdXRvZm9ybV90eXBlO1xuICAgIH1cbiAgICBpZiAoZmllbGQuZGVmYXVsdFZhbHVlKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmIENyZWF0b3IuRm9ybXVsYXIuY2hlY2tGb3JtdWxhKGZpZWxkLmRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgZnMuYXV0b2Zvcm0uZGVmYXVsdFZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIENyZWF0b3IuRm9ybXVsYXIucnVuKGZpZWxkLmRlZmF1bHRWYWx1ZSwge1xuICAgICAgICAgICAgdXNlcklkOiBNZXRlb3IudXNlcklkKCksXG4gICAgICAgICAgICBzcGFjZUlkOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksXG4gICAgICAgICAgICBub3c6IG5ldyBEYXRlKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLmF1dG9mb3JtLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24oZmllbGQuZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICAgIGZzLmRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZmllbGQucmVhZG9ubHkpIHtcbiAgICAgIGZzLmF1dG9mb3JtLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmRpc2FibGVkKSB7XG4gICAgICBmcy5hdXRvZm9ybS5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChmaWVsZC5pbmxpbmVIZWxwVGV4dCkge1xuICAgICAgZnMuYXV0b2Zvcm0uaW5saW5lSGVscFRleHQgPSBmaWVsZC5pbmxpbmVIZWxwVGV4dDtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmJsYWNrYm94KSB7XG4gICAgICBmcy5ibGFja2JveCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChfLmhhcyhmaWVsZCwgJ21pbicpKSB7XG4gICAgICBmcy5taW4gPSBmaWVsZC5taW47XG4gICAgfVxuICAgIGlmIChfLmhhcyhmaWVsZCwgJ21heCcpKSB7XG4gICAgICBmcy5tYXggPSBmaWVsZC5tYXg7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNQcm9kdWN0aW9uKSB7XG4gICAgICBpZiAoZmllbGQuaW5kZXgpIHtcbiAgICAgICAgZnMuaW5kZXggPSBmaWVsZC5pbmRleDtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGQuc29ydGFibGUpIHtcbiAgICAgICAgZnMuaW5kZXggPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2NoZW1hW2ZpZWxkX25hbWVdID0gZnM7XG4gIH0pO1xuICByZXR1cm4gc2NoZW1hO1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERpc3BsYXlWYWx1ZSA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBmaWVsZF9uYW1lLCBmaWVsZF92YWx1ZSkge1xuICB2YXIgZmllbGQsIGh0bWwsIG9iamVjdDtcbiAgaHRtbCA9IGZpZWxkX3ZhbHVlO1xuICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gIGlmICghb2JqZWN0KSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgZmllbGQgPSBvYmplY3QuZmllbGRzKGZpZWxkX25hbWUpO1xuICBpZiAoIWZpZWxkKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgaWYgKGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgIGh0bWwgPSBtb21lbnQodGhpcy52YWwpLmZvcm1hdCgnWVlZWS1NTS1ERCBIOm1tJyk7XG4gIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICBodG1sID0gbW9tZW50KHRoaXMudmFsKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgfVxuICByZXR1cm4gaHRtbDtcbn07XG5cbkNyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5ID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICByZXR1cm4gW1wiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwiY3VycmVuY3lcIiwgXCJudW1iZXJcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSk7XG59O1xuXG5DcmVhdG9yLnB1c2hCZXR3ZWVuQnVpbHRpbk9wdGlvbmFscyA9IGZ1bmN0aW9uKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpIHtcbiAgdmFyIGJ1aWx0aW5WYWx1ZXM7XG4gIGJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoYnVpbHRpblZhbHVlcykge1xuICAgIHJldHVybiBfLmZvckVhY2goYnVpbHRpblZhbHVlcywgZnVuY3Rpb24oYnVpbHRpbkl0ZW0sIGtleSkge1xuICAgICAgcmV0dXJuIG9wZXJhdGlvbnMucHVzaCh7XG4gICAgICAgIGxhYmVsOiBidWlsdGluSXRlbS5sYWJlbCxcbiAgICAgICAgdmFsdWU6IGtleVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihmaWVsZF90eXBlLCBpc19jaGVja19vbmx5KSB7XG4gIGlmIChbXCJkYXRlXCIsIFwiZGF0ZXRpbWVcIl0uaW5jbHVkZXMoZmllbGRfdHlwZSkpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMoaXNfY2hlY2tfb25seSwgZmllbGRfdHlwZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0QmV0d2VlbkJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgaWYgKFtcImRhdGVcIiwgXCJkYXRldGltZVwiXS5pbmNsdWRlcyhmaWVsZF90eXBlKSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBrZXkpO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEJldHdlZW5CdWlsdGluT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSwgdmFsdWUpIHtcbiAgdmFyIGJldHdlZW5CdWlsdGluVmFsdWVzLCByZXN1bHQ7XG4gIGlmICghXy5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgYmV0d2VlbkJ1aWx0aW5WYWx1ZXMgPSBDcmVhdG9yLmdldEJldHdlZW5CdWlsdGluVmFsdWVzKGZpZWxkX3R5cGUpO1xuICBpZiAoIWJldHdlZW5CdWlsdGluVmFsdWVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlc3VsdCA9IG51bGw7XG4gIF8uZWFjaChiZXR3ZWVuQnVpbHRpblZhbHVlcywgZnVuY3Rpb24oaXRlbSwgb3BlcmF0aW9uKSB7XG4gICAgaWYgKGl0ZW0ua2V5ID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdCA9IG9wZXJhdGlvbjtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZXMgPSBmdW5jdGlvbihpc19jaGVja19vbmx5LCBmaWVsZF90eXBlKSB7XG4gIHJldHVybiB7XG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc195ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF95ZWFyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3llYXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc19xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF9xdWFydGVyXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3F1YXJ0ZXJcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF9tb250aFwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwibGFzdF9tb250aFwiKSxcbiAgICBcImJldHdlZW5fdGltZV90aGlzX21vbnRoXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX21vbnRoXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfbW9udGhcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfbW9udGhcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbGFzdF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdGhpc193ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJ0aGlzX3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfbmV4dF93ZWVrXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0X3dlZWtcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfeWVzdGRheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwieWVzdGRheVwiKSxcbiAgICBcImJldHdlZW5fdGltZV90b2RheVwiOiBpc19jaGVja19vbmx5ID8gdHJ1ZSA6IENyZWF0b3IuZ2V0QmV0d2VlblRpbWVCdWlsdGluVmFsdWVJdGVtKGZpZWxkX3R5cGUsIFwidG9kYXlcIiksXG4gICAgXCJiZXR3ZWVuX3RpbWVfdG9tb3Jyb3dcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcInRvbW9ycm93XCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX2xhc3RfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcImxhc3RfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9sYXN0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJsYXN0XzEyMF9kYXlzXCIpLFxuICAgIFwiYmV0d2Vlbl90aW1lX25leHRfN19kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzdfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzMwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfMzBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzYwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfNjBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzkwX2RheXNcIjogaXNfY2hlY2tfb25seSA/IHRydWUgOiBDcmVhdG9yLmdldEJldHdlZW5UaW1lQnVpbHRpblZhbHVlSXRlbShmaWVsZF90eXBlLCBcIm5leHRfOTBfZGF5c1wiKSxcbiAgICBcImJldHdlZW5fdGltZV9uZXh0XzEyMF9kYXlzXCI6IGlzX2NoZWNrX29ubHkgPyB0cnVlIDogQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0oZmllbGRfdHlwZSwgXCJuZXh0XzEyMF9kYXlzXCIpXG4gIH07XG59O1xuXG5DcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoID0gZnVuY3Rpb24obW9udGgpIHtcbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDYpIHtcbiAgICByZXR1cm4gMztcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICByZXR1cm4gNjtcbiAgfVxuICByZXR1cm4gOTtcbn07XG5cbkNyZWF0b3IuZ2V0TGFzdFF1YXJ0ZXJGaXJzdERheSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoKSB7XG4gIGlmICgheWVhcikge1xuICAgIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gIH1cbiAgaWYgKCFtb250aCkge1xuICAgIG1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICB9XG4gIGlmIChtb250aCA8IDMpIHtcbiAgICB5ZWFyLS07XG4gICAgbW9udGggPSA5O1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gMDtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDM7XG4gIH0gZWxzZSB7XG4gICAgbW9udGggPSA2O1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSk7XG59O1xuXG5DcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICBpZiAoIXllYXIpIHtcbiAgICB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG4gIGlmICghbW9udGgpIHtcbiAgICBtb250aCA9IG5ldyBEYXRlKCkuZ2V0TW9udGgoKTtcbiAgfVxuICBpZiAobW9udGggPCAzKSB7XG4gICAgbW9udGggPSAzO1xuICB9IGVsc2UgaWYgKG1vbnRoIDwgNikge1xuICAgIG1vbnRoID0gNjtcbiAgfSBlbHNlIGlmIChtb250aCA8IDkpIHtcbiAgICBtb250aCA9IDk7XG4gIH0gZWxzZSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoID0gMDtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRNb250aERheXMgPSBmdW5jdGlvbih5ZWFyLCBtb250aCkge1xuICB2YXIgZGF5cywgZW5kRGF0ZSwgbWlsbGlzZWNvbmQsIHN0YXJ0RGF0ZTtcbiAgaWYgKG1vbnRoID09PSAxMSkge1xuICAgIHJldHVybiAzMTtcbiAgfVxuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgZW5kRGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMSk7XG4gIGRheXMgPSAoZW5kRGF0ZSAtIHN0YXJ0RGF0ZSkgLyBtaWxsaXNlY29uZDtcbiAgcmV0dXJuIGRheXM7XG59O1xuXG5DcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgpIHtcbiAgaWYgKCF5ZWFyKSB7XG4gICAgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuICBpZiAoIW1vbnRoKSB7XG4gICAgbW9udGggPSBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cbiAgaWYgKG1vbnRoID09PSAwKSB7XG4gICAgbW9udGggPSAxMTtcbiAgICB5ZWFyLS07XG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgfVxuICBtb250aC0tO1xuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDEpO1xufTtcblxuQ3JlYXRvci5nZXRCZXR3ZWVuVGltZUJ1aWx0aW5WYWx1ZUl0ZW0gPSBmdW5jdGlvbihmaWVsZF90eXBlLCBrZXkpIHtcbiAgdmFyIGN1cnJlbnRNb250aCwgY3VycmVudFllYXIsIGVuZFZhbHVlLCBmaXJzdERheSwgbGFiZWwsIGxhc3REYXksIGxhc3RNb25kYXksIGxhc3RNb250aEZpbmFsRGF5LCBsYXN0TW9udGhGaXJzdERheSwgbGFzdFF1YXJ0ZXJFbmREYXksIGxhc3RRdWFydGVyU3RhcnREYXksIGxhc3RTdW5kYXksIGxhc3RfMTIwX2RheXMsIGxhc3RfMzBfZGF5cywgbGFzdF82MF9kYXlzLCBsYXN0XzdfZGF5cywgbGFzdF85MF9kYXlzLCBtaWxsaXNlY29uZCwgbWludXNEYXksIG1vbmRheSwgbW9udGgsIG5leHRNb25kYXksIG5leHRNb250aEZpbmFsRGF5LCBuZXh0TW9udGhGaXJzdERheSwgbmV4dFF1YXJ0ZXJFbmREYXksIG5leHRRdWFydGVyU3RhcnREYXksIG5leHRTdW5kYXksIG5leHRZZWFyLCBuZXh0XzEyMF9kYXlzLCBuZXh0XzMwX2RheXMsIG5leHRfNjBfZGF5cywgbmV4dF83X2RheXMsIG5leHRfOTBfZGF5cywgbm93LCBwcmV2aW91c1llYXIsIHN0YXJ0VmFsdWUsIHN0ckVuZERheSwgc3RyRmlyc3REYXksIHN0ckxhc3REYXksIHN0ck1vbmRheSwgc3RyU3RhcnREYXksIHN0clN1bmRheSwgc3RyVG9kYXksIHN0clRvbW9ycm93LCBzdHJZZXN0ZGF5LCBzdW5kYXksIHRoaXNRdWFydGVyRW5kRGF5LCB0aGlzUXVhcnRlclN0YXJ0RGF5LCB0b21vcnJvdywgdmFsdWVzLCB3ZWVrLCB5ZWFyLCB5ZXN0ZGF5O1xuICBub3cgPSBuZXcgRGF0ZSgpO1xuICBtaWxsaXNlY29uZCA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gIHllc3RkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICB0b21vcnJvdyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBtaWxsaXNlY29uZCk7XG4gIHdlZWsgPSBub3cuZ2V0RGF5KCk7XG4gIG1pbnVzRGF5ID0gd2VlayAhPT0gMCA/IHdlZWsgLSAxIDogNjtcbiAgbW9uZGF5ID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtIChtaW51c0RheSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN1bmRheSA9IG5ldyBEYXRlKG1vbmRheS5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RTdW5kYXkgPSBuZXcgRGF0ZShtb25kYXkuZ2V0VGltZSgpIC0gbWlsbGlzZWNvbmQpO1xuICBsYXN0TW9uZGF5ID0gbmV3IERhdGUobGFzdFN1bmRheS5nZXRUaW1lKCkgLSAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIG5leHRNb25kYXkgPSBuZXcgRGF0ZShzdW5kYXkuZ2V0VGltZSgpICsgbWlsbGlzZWNvbmQpO1xuICBuZXh0U3VuZGF5ID0gbmV3IERhdGUobmV4dE1vbmRheS5nZXRUaW1lKCkgKyAobWlsbGlzZWNvbmQgKiA2KSk7XG4gIGN1cnJlbnRZZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIHByZXZpb3VzWWVhciA9IGN1cnJlbnRZZWFyIC0gMTtcbiAgbmV4dFllYXIgPSBjdXJyZW50WWVhciArIDE7XG4gIGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpO1xuICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gIG1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gIGZpcnN0RGF5ID0gbmV3IERhdGUoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgMSk7XG4gIGlmIChjdXJyZW50TW9udGggPT09IDExKSB7XG4gICAgeWVhcisrO1xuICAgIG1vbnRoKys7XG4gIH0gZWxzZSB7XG4gICAgbW9udGgrKztcbiAgfVxuICBuZXh0TW9udGhGaXJzdERheSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcbiAgbmV4dE1vbnRoRmluYWxEYXkgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgQ3JlYXRvci5nZXRNb250aERheXMoeWVhciwgbW9udGgpKTtcbiAgbGFzdERheSA9IG5ldyBEYXRlKG5leHRNb250aEZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgbGFzdE1vbnRoRmlyc3REYXkgPSBDcmVhdG9yLmdldExhc3RNb250aEZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0TW9udGhGaW5hbERheSA9IG5ldyBEYXRlKGZpcnN0RGF5LmdldFRpbWUoKSAtIG1pbGxpc2Vjb25kKTtcbiAgdGhpc1F1YXJ0ZXJTdGFydERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCksIDEpO1xuICB0aGlzUXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyLCBDcmVhdG9yLmdldFF1YXJ0ZXJTdGFydE1vbnRoKGN1cnJlbnRNb250aCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhjdXJyZW50WWVhciwgQ3JlYXRvci5nZXRRdWFydGVyU3RhcnRNb250aChjdXJyZW50TW9udGgpICsgMikpO1xuICBsYXN0UXVhcnRlclN0YXJ0RGF5ID0gQ3JlYXRvci5nZXRMYXN0UXVhcnRlckZpcnN0RGF5KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICBsYXN0UXVhcnRlckVuZERheSA9IG5ldyBEYXRlKGxhc3RRdWFydGVyU3RhcnREYXkuZ2V0RnVsbFllYXIoKSwgbGFzdFF1YXJ0ZXJTdGFydERheS5nZXRNb250aCgpICsgMiwgQ3JlYXRvci5nZXRNb250aERheXMobGFzdFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBsYXN0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyKSk7XG4gIG5leHRRdWFydGVyU3RhcnREYXkgPSBDcmVhdG9yLmdldE5leHRRdWFydGVyRmlyc3REYXkoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG4gIG5leHRRdWFydGVyRW5kRGF5ID0gbmV3IERhdGUobmV4dFF1YXJ0ZXJTdGFydERheS5nZXRGdWxsWWVhcigpLCBuZXh0UXVhcnRlclN0YXJ0RGF5LmdldE1vbnRoKCkgKyAyLCBDcmVhdG9yLmdldE1vbnRoRGF5cyhuZXh0UXVhcnRlclN0YXJ0RGF5LmdldEZ1bGxZZWFyKCksIG5leHRRdWFydGVyU3RhcnREYXkuZ2V0TW9udGgoKSArIDIpKTtcbiAgbGFzdF83X2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDYgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzMwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gKDI5ICogbWlsbGlzZWNvbmQpKTtcbiAgbGFzdF82MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICg1OSAqIG1pbGxpc2Vjb25kKSk7XG4gIGxhc3RfOTBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgLSAoODkgKiBtaWxsaXNlY29uZCkpO1xuICBsYXN0XzEyMF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSAtICgxMTkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzdfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoNiAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMzBfZGF5cyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMjkgKiBtaWxsaXNlY29uZCkpO1xuICBuZXh0XzYwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDU5ICogbWlsbGlzZWNvbmQpKTtcbiAgbmV4dF85MF9kYXlzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArICg4OSAqIG1pbGxpc2Vjb25kKSk7XG4gIG5leHRfMTIwX2RheXMgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDExOSAqIG1pbGxpc2Vjb25kKSk7XG4gIHN3aXRjaCAoa2V5KSB7XG4gICAgY2FzZSBcImxhc3RfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF95ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHByZXZpb3VzWWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUocHJldmlvdXNZZWFyICsgXCItMTItMzFUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRoaXNfeWVhclwiOlxuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc195ZWFyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKGN1cnJlbnRZZWFyICsgXCItMDEtMDFUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShjdXJyZW50WWVhciArIFwiLTEyLTMxVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3llYXJcIjpcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfeWVhclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShuZXh0WWVhciArIFwiLTAxLTAxVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUobmV4dFllYXIgKyBcIi0xMi0zMVQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9xdWFydGVyXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChsYXN0UXVhcnRlclN0YXJ0RGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyTGFzdERheSA9IG1vbWVudChsYXN0UXVhcnRlckVuZERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfcXVhcnRlclwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX3F1YXJ0ZXJcIjpcbiAgICAgIHN0ckZpcnN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyU3RhcnREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KHRoaXNRdWFydGVyRW5kRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdGhpc19xdWFydGVyXCIpO1xuICAgICAgc3RhcnRWYWx1ZSA9IG5ldyBEYXRlKHN0ckZpcnN0RGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJMYXN0RGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfcXVhcnRlclwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJTdGFydERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobmV4dFF1YXJ0ZXJFbmREYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3F1YXJ0ZXJcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobGFzdE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KGxhc3RNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aGlzX21vbnRoXCI6XG4gICAgICBzdHJGaXJzdERheSA9IG1vbWVudChmaXJzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckxhc3REYXkgPSBtb21lbnQobGFzdERheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfbW9udGhcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyRmlyc3REYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0ckxhc3REYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmV4dF9tb250aFwiOlxuICAgICAgc3RyRmlyc3REYXkgPSBtb21lbnQobmV4dE1vbnRoRmlyc3REYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJMYXN0RGF5ID0gbW9tZW50KG5leHRNb250aEZpbmFsRGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF9tb250aFwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJGaXJzdERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyTGFzdERheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChsYXN0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KGxhc3RTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGhpc193ZWVrXCI6XG4gICAgICBzdHJNb25kYXkgPSBtb21lbnQobW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KHN1bmRheSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX3RoaXNfd2Vla1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJNb25kYXkgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clN1bmRheSArIFwiVDIzOjU5OjU5WlwiKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuZXh0X3dlZWtcIjpcbiAgICAgIHN0ck1vbmRheSA9IG1vbWVudChuZXh0TW9uZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyU3VuZGF5ID0gbW9tZW50KG5leHRTdW5kYXkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0X3dlZWtcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyTW9uZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJTdW5kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwieWVzdGRheVwiOlxuICAgICAgc3RyWWVzdGRheSA9IG1vbWVudCh5ZXN0ZGF5KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5feWVzdGRheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMDA6MDA6MDBaXCIpO1xuICAgICAgZW5kVmFsdWUgPSBuZXcgRGF0ZShzdHJZZXN0ZGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvZGF5XCI6XG4gICAgICBzdHJUb2RheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl90b2RheVwiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJUb2RheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyVG9kYXkgKyBcIlQyMzo1OTo1OVpcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG9tb3Jyb3dcIjpcbiAgICAgIHN0clRvbW9ycm93ID0gbW9tZW50KHRvbW9ycm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fdG9tb3Jyb3dcIik7XG4gICAgICBzdGFydFZhbHVlID0gbmV3IERhdGUoc3RyVG9tb3Jyb3cgKyBcIlQwMDowMDowMFpcIik7XG4gICAgICBlbmRWYWx1ZSA9IG5ldyBEYXRlKHN0clRvbW9ycm93ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChsYXN0XzdfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9sYXN0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF8zMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF82MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobGFzdF85MF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX2xhc3RfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KGxhc3RfMTIwX2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbGFzdF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfN19kYXlzXCI6XG4gICAgICBzdHJTdGFydERheSA9IG1vbWVudChub3cpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBzdHJFbmREYXkgPSBtb21lbnQobmV4dF83X2RheXMpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICBsYWJlbCA9IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fYmV0d2Vlbl9uZXh0XzdfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMzBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfMzBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfMzBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfNjBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfNjBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfNjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfOTBfZGF5c1wiOlxuICAgICAgc3RyU3RhcnREYXkgPSBtb21lbnQobm93KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgc3RyRW5kRGF5ID0gbW9tZW50KG5leHRfOTBfZGF5cykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIGxhYmVsID0gdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuX25leHRfOTBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5leHRfMTIwX2RheXNcIjpcbiAgICAgIHN0clN0YXJ0RGF5ID0gbW9tZW50KG5vdykuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgIHN0ckVuZERheSA9IG1vbWVudChuZXh0XzEyMF9kYXlzKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgbGFiZWwgPSB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2JldHdlZW5fbmV4dF8xMjBfZGF5c1wiKTtcbiAgICAgIHN0YXJ0VmFsdWUgPSBuZXcgRGF0ZShzdHJTdGFydERheSArIFwiVDAwOjAwOjAwWlwiKTtcbiAgICAgIGVuZFZhbHVlID0gbmV3IERhdGUoc3RyRW5kRGF5ICsgXCJUMjM6NTk6NTlaXCIpO1xuICB9XG4gIHZhbHVlcyA9IFtzdGFydFZhbHVlLCBlbmRWYWx1ZV07XG4gIGlmIChmaWVsZF90eXBlID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICBfLmZvckVhY2godmFsdWVzLCBmdW5jdGlvbihmdikge1xuICAgICAgaWYgKGZ2KSB7XG4gICAgICAgIHJldHVybiBmdi5zZXRIb3Vycyhmdi5nZXRIb3VycygpICsgZnYuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGxhYmVsOiBsYWJlbCxcbiAgICBrZXk6IGtleSxcbiAgICB2YWx1ZXM6IHZhbHVlc1xuICB9O1xufTtcblxuQ3JlYXRvci5nZXRGaWVsZERlZmF1bHRPcGVyYXRpb24gPSBmdW5jdGlvbihmaWVsZF90eXBlKSB7XG4gIGlmIChmaWVsZF90eXBlICYmIENyZWF0b3IuY2hlY2tGaWVsZFR5cGVTdXBwb3J0QmV0d2VlblF1ZXJ5KGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdiZXR3ZWVuJztcbiAgfSBlbHNlIGlmIChbXCJ0ZXh0YXJlYVwiLCBcInRleHRcIiwgXCJjb2RlXCJdLmluY2x1ZGVzKGZpZWxkX3R5cGUpKSB7XG4gICAgcmV0dXJuICdjb250YWlucyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiPVwiO1xuICB9XG59O1xuXG5DcmVhdG9yLmdldEZpZWxkT3BlcmF0aW9uID0gZnVuY3Rpb24oZmllbGRfdHlwZSkge1xuICB2YXIgb3BlcmF0aW9ucywgb3B0aW9uYWxzO1xuICBvcHRpb25hbHMgPSB7XG4gICAgZXF1YWw6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPVwiXG4gICAgfSxcbiAgICB1bmVxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl91bmVxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD5cIlxuICAgIH0sXG4gICAgbGVzc190aGFuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX3RoYW5cIiksXG4gICAgICB2YWx1ZTogXCI8XCJcbiAgICB9LFxuICAgIGdyZWF0ZXJfdGhhbjoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl90aGFuXCIpLFxuICAgICAgdmFsdWU6IFwiPlwiXG4gICAgfSxcbiAgICBsZXNzX29yX2VxdWFsOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9sZXNzX29yX2VxdWFsXCIpLFxuICAgICAgdmFsdWU6IFwiPD1cIlxuICAgIH0sXG4gICAgZ3JlYXRlcl9vcl9lcXVhbDoge1xuICAgICAgbGFiZWw6IHQoXCJjcmVhdG9yX2ZpbHRlcl9vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbFwiKSxcbiAgICAgIHZhbHVlOiBcIj49XCJcbiAgICB9LFxuICAgIGNvbnRhaW5zOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9jb250YWluc1wiKSxcbiAgICAgIHZhbHVlOiBcImNvbnRhaW5zXCJcbiAgICB9LFxuICAgIG5vdF9jb250YWluOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9kb2VzX25vdF9jb250YWluXCIpLFxuICAgICAgdmFsdWU6IFwibm90Y29udGFpbnNcIlxuICAgIH0sXG4gICAgc3RhcnRzX3dpdGg6IHtcbiAgICAgIGxhYmVsOiB0KFwiY3JlYXRvcl9maWx0ZXJfb3BlcmF0aW9uX3N0YXJ0c193aXRoXCIpLFxuICAgICAgdmFsdWU6IFwic3RhcnRzd2l0aFwiXG4gICAgfSxcbiAgICBiZXR3ZWVuOiB7XG4gICAgICBsYWJlbDogdChcImNyZWF0b3JfZmlsdGVyX29wZXJhdGlvbl9iZXR3ZWVuXCIpLFxuICAgICAgdmFsdWU6IFwiYmV0d2VlblwiXG4gICAgfVxuICB9O1xuICBpZiAoZmllbGRfdHlwZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9wdGlvbmFscyk7XG4gIH1cbiAgb3BlcmF0aW9ucyA9IFtdO1xuICBpZiAoQ3JlYXRvci5jaGVja0ZpZWxkVHlwZVN1cHBvcnRCZXR3ZWVuUXVlcnkoZmllbGRfdHlwZSkpIHtcbiAgICBvcGVyYXRpb25zLnB1c2gob3B0aW9uYWxzLmJldHdlZW4pO1xuICAgIENyZWF0b3IucHVzaEJldHdlZW5CdWlsdGluT3B0aW9uYWxzKGZpZWxkX3R5cGUsIG9wZXJhdGlvbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwidGV4dFwiIHx8IGZpZWxkX3R5cGUgPT09IFwidGV4dGFyZWFcIiB8fCBmaWVsZF90eXBlID09PSBcImh0bWxcIiB8fCBmaWVsZF90eXBlID09PSBcImNvZGVcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuY29udGFpbnMpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwibG9va3VwXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJtYXN0ZXJfZGV0YWlsXCIgfHwgZmllbGRfdHlwZSA9PT0gXCJzZWxlY3RcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcImN1cnJlbmN5XCIgfHwgZmllbGRfdHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsLCBvcHRpb25hbHMubGVzc190aGFuLCBvcHRpb25hbHMuZ3JlYXRlcl90aGFuLCBvcHRpb25hbHMubGVzc19vcl9lcXVhbCwgb3B0aW9uYWxzLmdyZWF0ZXJfb3JfZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2UgaWYgKGZpZWxkX3R5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfSBlbHNlIGlmIChmaWVsZF90eXBlID09PSBcIlt0ZXh0XVwiKSB7XG4gICAgb3BlcmF0aW9ucy5wdXNoKG9wdGlvbmFscy5lcXVhbCwgb3B0aW9uYWxzLnVuZXF1YWwpO1xuICB9IGVsc2Uge1xuICAgIG9wZXJhdGlvbnMucHVzaChvcHRpb25hbHMuZXF1YWwsIG9wdGlvbmFscy51bmVxdWFsKTtcbiAgfVxuICByZXR1cm4gb3BlcmF0aW9ucztcbn07XG5cblxuLypcbiAgICDlhYjmjInnhafmnInmjpLluo/lj7fnmoTlsI/nmoTlnKjliY3vvIzlpKfnmoTlnKjlkI5cbiAgICDlho3lsIbmsqHmnInmjpLluo/lj7fnmoTmmL7npLrlnKhcbiAqL1xuXG5DcmVhdG9yLmdldE9iamVjdEZpZWxkc05hbWUgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICB2YXIgZmllbGRzLCBmaWVsZHNBcnIsIGZpZWxkc05hbWUsIHJlZjtcbiAgZmllbGRzID0gKHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKSkgIT0gbnVsbCA/IHJlZi5maWVsZHMgOiB2b2lkIDA7XG4gIGZpZWxkc0FyciA9IFtdO1xuICBfLmVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZHNBcnIucHVzaCh7XG4gICAgICBuYW1lOiBmaWVsZC5uYW1lLFxuICAgICAgc29ydF9ubzogZmllbGQuc29ydF9ub1xuICAgIH0pO1xuICB9KTtcbiAgZmllbGRzTmFtZSA9IFtdO1xuICBfLmVhY2goXy5zb3J0QnkoZmllbGRzQXJyLCBcInNvcnRfbm9cIiksIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgcmV0dXJuIGZpZWxkc05hbWUucHVzaChmaWVsZC5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBmaWVsZHNOYW1lO1xufTtcbiIsIkNyZWF0b3IuX3RyaWdnZXJfaG9va3MgPSB7fVxuXG5pbml0VHJpZ2dlciA9IChvYmplY3RfbmFtZSwgdHJpZ2dlciktPlxuXHR0cnlcblx0XHRjb2xsZWN0aW9uID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKG9iamVjdF9uYW1lKVxuXHRcdGlmICF0cmlnZ2VyLnRvZG9cblx0XHRcdHJldHVyblxuXHRcdHRvZG9XcmFwcGVyID0gKCktPlxuXHRcdFx0ICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWVcblx0XHRcdCAgcmV0dXJuIHRyaWdnZXIudG9kby5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG5cdFx0aWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLmluc2VydFwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/Lmluc2VydCh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLnVwZGF0ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnVwZGF0ZSh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYmVmb3JlLnJlbW92ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5iZWZvcmU/LnJlbW92ZSh0b2RvV3JhcHBlcilcblx0XHQgIGVsc2UgaWYgdHJpZ2dlci53aGVuID09IFwiYWZ0ZXIuaW5zZXJ0XCJcblx0XHRcdCAgcmV0dXJuIGNvbGxlY3Rpb24/LmFmdGVyPy5pbnNlcnQodG9kb1dyYXBwZXIpXG5cdFx0ICBlbHNlIGlmIHRyaWdnZXIud2hlbiA9PSBcImFmdGVyLnVwZGF0ZVwiXG5cdFx0XHQgIHJldHVybiBjb2xsZWN0aW9uPy5hZnRlcj8udXBkYXRlKHRvZG9XcmFwcGVyKVxuXHRcdCAgZWxzZSBpZiB0cmlnZ2VyLndoZW4gPT0gXCJhZnRlci5yZW1vdmVcIlxuXHRcdFx0ICByZXR1cm4gY29sbGVjdGlvbj8uYWZ0ZXI/LnJlbW92ZSh0b2RvV3JhcHBlcilcblx0Y2F0Y2ggZXJyb3Jcblx0XHRjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKVxuXG5jbGVhblRyaWdnZXIgPSAob2JqZWN0X25hbWUpLT5cblx0IyMjXG4gICAgXHTnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWw5piv5L2/55So5LiL5qCH5Yig6Zmk5a+56LGh55qE77yM5omA5Lul5q2k5aSE5Y+N6L2saG9va3Ppm4blkIjlkI7vvIzlho3liKDpmaRcbiAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuXHQjIyNcbiAgICAjVE9ETyDnlLHkuo5jb2xsZWN0aW9uLWhvb2tzIHBhY2thZ2Ug55qEcmVtb3Zl5Ye95pWwYnVnXG5cdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdPy5yZXZlcnNlKCkuZm9yRWFjaCAoX2hvb2spLT5cblx0XHRfaG9vay5yZW1vdmUoKVxuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IChvYmplY3RfbmFtZSktPlxuI1x0Y29uc29sZS5sb2coJ0NyZWF0b3IuaW5pdFRyaWdnZXJzIG9iamVjdF9uYW1lJywgb2JqZWN0X25hbWUpXG5cdG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKVxuXG5cdGNsZWFuVHJpZ2dlcihvYmplY3RfbmFtZSlcblxuXHRDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSA9IFtdXG5cblx0Xy5lYWNoIG9iai50cmlnZ2VycywgKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSktPlxuXHRcdGlmIE1ldGVvci5pc1NlcnZlciBhbmQgdHJpZ2dlci5vbiA9PSBcInNlcnZlclwiIGFuZCB0cmlnZ2VyLnRvZG8gYW5kIHRyaWdnZXIud2hlblxuXHRcdFx0X3RyaWdnZXJfaG9vayA9IGluaXRUcmlnZ2VyIG9iamVjdF9uYW1lLCB0cmlnZ2VyXG5cdFx0XHRpZiBfdHJpZ2dlcl9ob29rXG5cdFx0XHRcdENyZWF0b3IuX3RyaWdnZXJfaG9va3Nbb2JqZWN0X25hbWVdLnB1c2goX3RyaWdnZXJfaG9vaylcblx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kIHRyaWdnZXIub24gPT0gXCJjbGllbnRcIiBhbmQgdHJpZ2dlci50b2RvIGFuZCB0cmlnZ2VyLndoZW5cblx0XHRcdF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlciBvYmplY3RfbmFtZSwgdHJpZ2dlclxuXHRcdFx0Q3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKSIsInZhciBjbGVhblRyaWdnZXIsIGluaXRUcmlnZ2VyO1xuXG5DcmVhdG9yLl90cmlnZ2VyX2hvb2tzID0ge307XG5cbmluaXRUcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUsIHRyaWdnZXIpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGVycm9yLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHRvZG9XcmFwcGVyO1xuICB0cnkge1xuICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24ob2JqZWN0X25hbWUpO1xuICAgIGlmICghdHJpZ2dlci50b2RvKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRvZG9XcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm9iamVjdF9uYW1lID0gb2JqZWN0X25hbWU7XG4gICAgICByZXR1cm4gdHJpZ2dlci50b2RvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZi5pbnNlcnQodG9kb1dyYXBwZXIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlci53aGVuID09PSBcImJlZm9yZS51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYxID0gY29sbGVjdGlvbi5iZWZvcmUpICE9IG51bGwgPyByZWYxLnVwZGF0ZSh0b2RvV3JhcHBlcikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyLndoZW4gPT09IFwiYmVmb3JlLnJlbW92ZVwiKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbiAhPSBudWxsID8gKHJlZjIgPSBjb2xsZWN0aW9uLmJlZm9yZSkgIT0gbnVsbCA/IHJlZjIucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5pbnNlcnRcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWYzID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjMuaW5zZXJ0KHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci51cGRhdGVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY0ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjQudXBkYXRlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXIud2hlbiA9PT0gXCJhZnRlci5yZW1vdmVcIikge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gIT0gbnVsbCA/IChyZWY1ID0gY29sbGVjdGlvbi5hZnRlcikgIT0gbnVsbCA/IHJlZjUucmVtb3ZlKHRvZG9XcmFwcGVyKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgIGVycm9yID0gZXJyb3IxO1xuICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdpbml0VHJpZ2dlciBlcnJvcicsIGVycm9yKTtcbiAgfVxufTtcblxuY2xlYW5UcmlnZ2VyID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcblxuICAvKlxuICAgICBcdOeUseS6jmNvbGxlY3Rpb24taG9va3MgcGFja2FnZSDnmoRyZW1vdmXlh73mlbDmmK/kvb/nlKjkuIvmoIfliKDpmaTlr7nosaHnmoTvvIzmiYDku6XmraTlpITlj43ovaxob29rc+mbhuWQiOWQju+8jOWGjeWIoOmZpFxuICAgICBcdOWboOS4uuS4gOS4quaVsOe7hOWFg+e0oOWIoOmZpOWQju+8jOWFtuS7luWFg+e0oOeahOS4i+agh+S8muWPkeeUn+WPmOWMllxuICAgKi9cbiAgdmFyIHJlZjtcbiAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLl90cmlnZ2VyX2hvb2tzW29iamVjdF9uYW1lXSkgIT0gbnVsbCA/IHJlZi5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbihfaG9vaykge1xuICAgIHJldHVybiBfaG9vay5yZW1vdmUoKTtcbiAgfSkgOiB2b2lkIDA7XG59O1xuXG5DcmVhdG9yLmluaXRUcmlnZ2VycyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gIHZhciBvYmo7XG4gIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgY2xlYW5UcmlnZ2VyKG9iamVjdF9uYW1lKTtcbiAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0gPSBbXTtcbiAgcmV0dXJuIF8uZWFjaChvYmoudHJpZ2dlcnMsIGZ1bmN0aW9uKHRyaWdnZXIsIHRyaWdnZXJfbmFtZSkge1xuICAgIHZhciBfdHJpZ2dlcl9ob29rO1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgdHJpZ2dlci5vbiA9PT0gXCJzZXJ2ZXJcIiAmJiB0cmlnZ2VyLnRvZG8gJiYgdHJpZ2dlci53aGVuKSB7XG4gICAgICBfdHJpZ2dlcl9ob29rID0gaW5pdFRyaWdnZXIob2JqZWN0X25hbWUsIHRyaWdnZXIpO1xuICAgICAgaWYgKF90cmlnZ2VyX2hvb2spIHtcbiAgICAgICAgQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiB0cmlnZ2VyLm9uID09PSBcImNsaWVudFwiICYmIHRyaWdnZXIudG9kbyAmJiB0cmlnZ2VyLndoZW4pIHtcbiAgICAgIF90cmlnZ2VyX2hvb2sgPSBpbml0VHJpZ2dlcihvYmplY3RfbmFtZSwgdHJpZ2dlcik7XG4gICAgICByZXR1cm4gQ3JlYXRvci5fdHJpZ2dlcl9ob29rc1tvYmplY3RfbmFtZV0ucHVzaChfdHJpZ2dlcl9ob29rKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsImNsb25lID0gcmVxdWlyZSgnY2xvbmUnKVxuXG5iYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJhbGxvd0NyZWF0ZVwiLCBcImFsbG93RGVsZXRlXCIsIFwiYWxsb3dFZGl0XCIsIFwiYWxsb3dSZWFkXCIsIFwibW9kaWZ5QWxsUmVjb3Jkc1wiLCBcInZpZXdBbGxSZWNvcmRzXCIsIFwibW9kaWZ5Q29tcGFueVJlY29yZHNcIiwgXCJ2aWV3Q29tcGFueVJlY29yZHNcIiwgXG5cdFwiYWxsb3dSZWFkRmlsZXNcIiwgXCJhbGxvd0VkaXRGaWxlc1wiLCBcImFsbG93Q3JlYXRlRmlsZXNcIiwgXCJhbGxvd0RlbGV0ZUZpbGVzXCIsIFwidmlld0FsbEZpbGVzXCIsIFwibW9kaWZ5QWxsRmlsZXNcIl0gXG5vdGhlclBlcm1pc3Npb25Qcm9wTmFtZXMgPSBbXCJkaXNhYmxlZF9saXN0X3ZpZXdzXCIsIFwiZGlzYWJsZWRfYWN0aW9uc1wiLCBcInVucmVhZGFibGVfZmllbGRzXCIsIFwidW5lZGl0YWJsZV9maWVsZHNcIiwgXCJ1bnJlbGF0ZWRfb2JqZWN0c1wiLCBcInVuZWRpdGFibGVfcmVsYXRlZF9saXN0XCJdXG5wZXJtaXNzaW9uUHJvcE5hbWVzID0gXy51bmlvbiBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMsIG90aGVyUGVybWlzc2lvblByb3BOYW1lc1xuXG5DcmVhdG9yLmdldFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRvYmogPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblx0XHRpZiAhb2JqXG5cdFx0XHRyZXR1cm5cblx0XHRyZXR1cm4gb2JqLnBlcm1pc3Npb25zLmdldCgpXG5cdGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXG5DcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lLCByZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxuXHRpZiAhb2JqZWN0X25hbWUgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKVxuXG5cdGlmICFzcGFjZUlkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFxuXHQjIOmZhOS7tuadg+mZkOS4jeWGjeS4juWFtueItuiusOW9lee8lui+kemFjee9ruWFs+iBlFxuXHQjIGlmIHJlY29yZCBhbmQgb2JqZWN0X25hbWUgPT0gXCJjbXNfZmlsZXNcIiBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdCMgXHQjIOWmguaenOaYr2Ntc19maWxlc+mZhOS7tu+8jOWImeadg+mZkOWPluWFtueItuiusOW9leadg+mZkFxuXHQjIFx0aWYgb2JqZWN0X25hbWUgPT0gU2Vzc2lvbi5nZXQoJ29iamVjdF9uYW1lJylcblx0IyBcdFx0IyDlvZPliY3lpITkuo5jbXNfZmlsZXPpmYTku7bor6bnu4bnlYzpnaJcblx0IyBcdFx0b2JqZWN0X25hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcblx0IyBcdFx0cmVjb3JkX2lkID0gcmVjb3JkLnBhcmVudC5faWQ7XG5cdCMgXHRlbHNlIFxuXHQjIFx0XHQjIOW9k+WJjeWkhOS6jmNtc19maWxlc+mZhOS7tueahOeItuiusOW9leeVjOmdolxuXHQjIFx0XHRvYmplY3RfbmFtZSA9IFNlc3Npb24uZ2V0KCdvYmplY3RfbmFtZScpO1xuXHQjIFx0XHRyZWNvcmRfaWQgPSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKTtcblx0IyBcdG9iamVjdF9maWVsZHNfa2V5cyA9IF8ua2V5cyhDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk/LmZpZWxkcyBvciB7fSkgfHwgW107XG5cdCMgXHRzZWxlY3QgPSBfLmludGVyc2VjdGlvbihvYmplY3RfZmllbGRzX2tleXMsIFsnb3duZXInLCAnY29tcGFueV9pZCcsICdjb21wYW55X2lkcycsICdsb2NrZWQnXSkgfHwgW107XG5cdCMgXHRpZiBzZWxlY3QubGVuZ3RoID4gMFxuXHQjIFx0XHRyZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBzZWxlY3Quam9pbignLCcpKTtcblx0IyBcdGVsc2Vcblx0IyBcdFx0cmVjb3JkID0gbnVsbDtcblxuXHRwZXJtaXNzaW9ucyA9IF8uY2xvbmUoQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyhvYmplY3RfbmFtZSwgc3BhY2VJZCwgdXNlcklkKSlcblxuXHRpZiByZWNvcmRcblx0XHRpZiByZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zXG5cdFx0XHRyZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9uc1xuXG5cdFx0aXNPd25lciA9IHJlY29yZC5vd25lciA9PSB1c2VySWQgfHwgcmVjb3JkLm93bmVyPy5faWQgPT0gdXNlcklkXG5cblx0XHRpZiBvYmplY3RfbmFtZSA9PSBcImNtc19maWxlc1wiXG5cdFx0XHQjIOmZhOS7tueahOafpeeci+aJgOacieS/ruaUueaJgOacieadg+mZkOS4jumZhOS7tuWvueixoeeahHZpZXdBbGxSZWNvcmRz44CBbW9kaWZ5QWxsUmVjb3Jkc+aXoOWFs++8jOWPquS4juWFtuS4u+ihqOiusOW9leeahHZpZXdBbGxGaWxlc+WSjG1vZGlmeUFsbEZpbGVz5pyJ5YWzXG5cdFx0XHQjIOWmguaenOaYr2Ntc19maWxlc+mZhOS7tu+8jOWImeadg+mZkOmcgOimgemineWkluiAg+iZkeWFtueItuWvueixoeS4iuWFs+S6jumZhOS7tueahOadg+mZkOmFjee9rlxuXHRcdFx0bWFzdGVyT2JqZWN0TmFtZSA9IHJlY29yZC5wYXJlbnRbJ3JlZmVyZW5jZV90by5fbyddO1xuXHRcdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMobWFzdGVyT2JqZWN0TmFtZSwgc3BhY2VJZCwgdXNlcklkKVxuXHRcdFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IHBlcm1pc3Npb25zLmFsbG93RGVsZXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dEZWxldGVGaWxlc1xuXHRcdFx0aWYgIW1hc3RlclJlY29yZFBlcm0ubW9kaWZ5QWxsRmlsZXMgYW5kICFpc093bmVyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IHBlcm1pc3Npb25zLmFsbG93UmVhZCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93UmVhZEZpbGVzXG5cdFx0XHRpZiAhbWFzdGVyUmVjb3JkUGVybS52aWV3QWxsRmlsZXMgYW5kICFpc093bmVyXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdHVzZXJfY29tcGFueV9pZHMgPSBTdGVlZG9zLmdldFVzZXJDb21wYW55SWRzKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0dXNlcl9jb21wYW55X2lkcyA9IENyZWF0b3IuZ2V0VXNlckNvbXBhbnlJZHModXNlcklkLCBzcGFjZUlkKVxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWQgPSByZWNvcmQ/LmNvbXBhbnlfaWRcblx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkKSBhbmQgcmVjb3JkX2NvbXBhbnlfaWQuX2lkXG5cdFx0XHRcdCMg5ZugcmVjb3JkX2NvbXBhbnlfaWTmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahG9iamVjdO+8jOaJgOS7pei/memHjOWPluWHuuWFtl9pZOWAvFxuXHRcdFx0XHRyZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZF9jb21wYW55X2lkLl9pZFxuXHRcdFx0cmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkPy5jb21wYW55X2lkc1xuXHRcdFx0aWYgcmVjb3JkX2NvbXBhbnlfaWRzIGFuZCByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoIGFuZCBfLmlzT2JqZWN0KHJlY29yZF9jb21wYW55X2lkc1swXSlcblx0XHRcdFx0IyDlm6ByZWNvcmRfY29tcGFueV9pZHPmmK9sb29rdXDnsbvlnovvvIzmnInlj6/og71keOaOp+S7tuS8muaKiuWug+aYoOWwhOi9rOS4uuWvueW6lOeahFtvYmplY3Rd77yM5omA5Lul6L+Z6YeM5Y+W5Ye65YW2X2lk5YC8XG5cdFx0XHRcdHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoKG4pLT4gbi5faWQpXG5cdFx0XHRyZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSlcblx0XHRcdGlmICFwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzIGFuZCAhaXNPd25lciBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdGVsc2UgaWYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgYW5kIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcblx0XHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0IyDorrDlvZXmnIljb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn77yM5L2G5piv5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+S4uuepuuaXtu+8jOiupOS4uuaXoOadg+S/ruaUuVxuXHRcdFx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2Vcblx0XHRcdFxuXHRcdFx0aWYgcmVjb3JkLmxvY2tlZCBhbmQgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2Vcblx0XHRcdFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZVxuXG5cdFx0XHRpZiAhcGVybWlzc2lvbnMudmlld0FsbFJlY29yZHMgYW5kICFpc093bmVyIGFuZCAhcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFx0XHRlbHNlIGlmICFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyBhbmQgcGVybWlzc2lvbnMudmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0XHRcdGlmIHJlY29yZF9jb21wYW55X2lkcyBhbmQgcmVjb3JkX2NvbXBhbnlfaWRzLmxlbmd0aFxuXHRcdFx0XHRcdGlmIHVzZXJfY29tcGFueV9pZHMgYW5kIHVzZXJfY29tcGFueV9pZHMubGVuZ3RoXG5cdFx0XHRcdFx0XHRpZiAhXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGhcblx0XHRcdFx0XHRcdFx0IyDorrDlvZXnmoRjb21wYW55X2lkL2NvbXBhbnlfaWRz5bGe5oCn5LiN5Zyo5b2T5YmN55So5oi3dXNlcl9jb21wYW55X2lkc+iMg+WbtOWGheaXtu+8jOiupOS4uuaXoOadg+afpeeci1xuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBmYWxzZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCMg6K6w5b2V5pyJY29tcGFueV9pZOWxnuaAp++8jOS9huaYr+W9k+WJjeeUqOaIt3VzZXJfY29tcGFueV9pZHPkuLrnqbrml7bvvIzorqTkuLrml6DmnYPmn6XnnItcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlXG5cdFxuXHRyZXR1cm4gcGVybWlzc2lvbnNcblxuXG4jIGN1cnJlbnRPYmplY3ROYW1l77ya5b2T5YmN5Li75a+56LGhXG4jIHJlbGF0ZWRMaXN0SXRlbe+8mkNyZWF0b3IuZ2V0UmVsYXRlZExpc3QoU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSwgU2Vzc2lvbi5nZXQoXCJyZWNvcmRfaWRcIikp5Lit5Y+WcmVsYXRlZF9vYmplY3RfbmFtZeWvueW6lOeahOWAvFxuIyBjdXJyZW50UmVjb3Jk5b2T5YmN5Li75a+56LGh55qE6K+m57uG6K6w5b2VXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Q3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zID0gKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCktPlxuXHRcdGlmICFjdXJyZW50T2JqZWN0TmFtZSBhbmQgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblxuXHRcdGlmICFyZWxhdGVkTGlzdEl0ZW1cblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJyZWxhdGVkTGlzdEl0ZW0gbXVzdCBub3QgYmUgZW1wdHkgZm9yIHRoZSBmdW5jdGlvbiBDcmVhdG9yLmdldFJlY29yZFJlbGF0ZWRMaXN0UGVybWlzc2lvbnNcIik7XG5cdFx0XHRyZXR1cm4ge31cblxuXHRcdGlmICFjdXJyZW50UmVjb3JkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGN1cnJlbnRSZWNvcmQgPSBDcmVhdG9yLmdldE9iamVjdFJlY29yZCgpXG5cblx0XHRpZiAhdXNlcklkIGFuZCBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXG5cdFx0aWYgIXNwYWNlSWQgYW5kIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuXG5cdFx0bWFzdGVyUmVjb3JkUGVybSA9IENyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMoY3VycmVudE9iamVjdE5hbWUsIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZClcblx0XHRyZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSlcblx0XHRyZXN1bHQgPSBfLmNsb25lIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9uc1xuXG5cdFx0aWYgcmVsYXRlZExpc3RJdGVtLmlzX2ZpbGVcblx0XHRcdHJlc3VsdC5hbGxvd0NyZWF0ZSA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93Q3JlYXRlRmlsZXNcblx0XHRcdHJlc3VsdC5hbGxvd0VkaXQgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dFZGl0ICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0RmlsZXNcblx0XHRlbHNlXG5cdFx0XHR3cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCA9IHJlbGF0ZWRMaXN0SXRlbS53cml0ZV9yZXF1aXJlc19tYXN0ZXJfcmVhZCB8fCBmYWxzZVxuXHRcdFx0bWFzdGVyQWxsb3cgPSBmYWxzZVxuXHRcdFx0aWYgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPT0gdHJ1ZVxuXHRcdFx0XHRtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dSZWFkXG5cdFx0XHRlbHNlIGlmIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09IGZhbHNlXG5cdFx0XHRcdG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRcblxuXHRcdFx0dW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSlcblx0XHRcdGlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZSA9IHVuZWRpdGFibGVfcmVsYXRlZF9saXN0LmluZGV4T2YocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKSA+IC0xXG5cblx0XHRcdHJlc3VsdC5hbGxvd0NyZWF0ZSA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlXG5cdFx0XHRyZXN1bHQuYWxsb3dFZGl0ID0gbWFzdGVyQWxsb3cgJiYgcmVsYXRlZE9iamVjdFBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlXG5cdFx0cmV0dXJuIHJlc3VsdFxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblxuXHRDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gKHNwYWNlSWQsIHVzZXJJZCkgLT5cblx0XHRwZXJtaXNzaW9ucyA9XG5cdFx0XHRvYmplY3RzOiB7fVxuXHRcdFx0YXNzaWduZWRfYXBwczogW11cblx0XHQjIyNcblx0XHTmnYPpmZDpm4bor7TmmI46XG5cdFx05YaF572u5p2D6ZmQ6ZuGLWFkbWluLHVzZXIsbWVtYmVyLGd1ZXN0LHdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pblxuXHRcdOiHquWumuS5ieadg+mZkOmbhi3mlbDmja7lupPkuK3mlrDlu7rnmoTpmaTlhoXnva7mnYPpmZDpm4bku6XlpJbnmoTlhbbku5bmnYPpmZDpm4Zcblx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxuXHRcdOWPr+mFjee9rueUqOaIt+mbhuWQiOadg+mZkOmbhu+8iOWNs3VzZXJz5bGe5oCn5Y+v6YWN572u77yJLXdvcmtmbG93X2FkbWluLG9yZ2FuaXphdGlvbl9hZG1pbuS7peWPiuiHquWumuS5ieadg+mZkOmbhlxuXHRcdCMjI1xuXG5cdFx0aXNTcGFjZUFkbWluID0gZmFsc2Vcblx0XHRzcGFjZVVzZXIgPSBudWxsXG5cdFx0aWYgdXNlcklkXG5cdFx0XHRpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0XHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblxuXHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXG5cdFx0cHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0cHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0ZWxzZVxuXHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXG5cdFx0cHNldHNBZG1pbl9wb3MgPSBudWxsXG5cdFx0cHNldHNVc2VyX3BvcyA9IG51bGxcblx0XHRwc2V0c01lbWJlcl9wb3MgPSBudWxsXG5cdFx0cHNldHNHdWVzdF9wb3MgPSBudWxsXG5cdFx0cHNldHNDdXJyZW50X3BvcyA9IG51bGxcblx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGxcblx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGxcblxuXHRcdGlmIHBzZXRzQWRtaW4/Ll9pZFxuXHRcdFx0cHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNVc2VyPy5faWRcblx0XHRcdHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c01lbWJlcj8uX2lkXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdGlmIHBzZXRzR3Vlc3Q/Ll9pZFxuXHRcdFx0cHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0aWYgcHNldHNTdXBwbGllcj8uX2lkXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcblx0XHRpZiBwc2V0c0N1c3RvbWVyPy5faWRcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXG5cdFx0aWYgcHNldHNDdXJyZW50Lmxlbmd0aCA+IDBcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJfaWRcIlxuXHRcdFx0cHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogc2V0X2lkc319KS5mZXRjaCgpXG5cdFx0XHRwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2sgcHNldHNDdXJyZW50LCBcIm5hbWVcIlxuXHRcdHBzZXRzID0ge1xuXHRcdFx0cHNldHNBZG1pbiwgXG5cdFx0XHRwc2V0c1VzZXIsIFxuXHRcdFx0cHNldHNDdXJyZW50LCBcblx0XHRcdHBzZXRzTWVtYmVyLCBcblx0XHRcdHBzZXRzR3Vlc3QsXG5cdFx0XHRwc2V0c1N1cHBsaWVyLFxuXHRcdFx0cHNldHNDdXN0b21lcixcblx0XHRcdGlzU3BhY2VBZG1pbixcblx0XHRcdHNwYWNlVXNlciwgXG5cdFx0XHRwc2V0c0FkbWluX3BvcywgXG5cdFx0XHRwc2V0c1VzZXJfcG9zLCBcblx0XHRcdHBzZXRzTWVtYmVyX3BvcywgXG5cdFx0XHRwc2V0c0d1ZXN0X3Bvcyxcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zLFxuXHRcdFx0cHNldHNDdXN0b21lcl9wb3MsXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zXG5cdFx0fVxuXHRcdHBlcm1pc3Npb25zLmFzc2lnbmVkX2FwcHMgPSBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQpXG5cdFx0cGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKVxuXHRcdHBlcm1pc3Npb25zLnVzZXJfcGVybWlzc2lvbl9zZXRzID0gcHNldHNDdXJyZW50TmFtZXNcblx0XHRfaSA9IDBcblx0XHRfLmVhY2ggQ3JlYXRvci5vYmplY3RzQnlOYW1lLCAob2JqZWN0LCBvYmplY3RfbmFtZSktPlxuXHRcdFx0X2krK1xuXHRcdFx0aWYgIV8uaGFzKG9iamVjdCwgJ3NwYWNlJykgfHwgIW9iamVjdC5zcGFjZSB8fCBvYmplY3Quc3BhY2UgPT0gc3BhY2VJZFxuXHRcdFx0XHRpZiAhXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT0gJzAnIHx8IChvYmplY3QuaW5fZGV2ZWxvcG1lbnQgIT0gJzAnICYmIGlzU3BhY2VBZG1pbilcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXSA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbb2JqZWN0X25hbWVdKSwgc3BhY2VJZClcblx0XHRcdFx0XHRwZXJtaXNzaW9ucy5vYmplY3RzW29iamVjdF9uYW1lXVtcInBlcm1pc3Npb25zXCJdID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdHJldHVybiBwZXJtaXNzaW9uc1xuXG5cdHVuaW9uUGx1cyA9IChhcnJheSwgb3RoZXIpIC0+XG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0XHRpZiAhYXJyYXlcblx0XHRcdGFycmF5ID0gW11cblx0XHRpZiAhb3RoZXJcblx0XHRcdG90aGVyID0gW11cblx0XHRyZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpXG5cblx0aW50ZXJzZWN0aW9uUGx1cyA9IChhcnJheSwgb3RoZXIpIC0+XG5cdFx0aWYgIWFycmF5IGFuZCAhb3RoZXJcblx0XHRcdHJldHVybiB1bmRlZmluZWRcblx0XHRpZiAhYXJyYXlcblx0XHRcdGFycmF5ID0gW11cblx0XHRpZiAhb3RoZXJcblx0XHRcdG90aGVyID0gW11cblx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oYXJyYXksIG90aGVyKVxuXG5cdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyA9ICh0YXJnZXQsIHByb3BzKSAtPlxuXHRcdHByb3BOYW1lcyA9IHBlcm1pc3Npb25Qcm9wTmFtZXNcblx0XHRmaWxlc1Byb05hbWVzID0gXG5cdFx0aWYgcHJvcHNcblx0XHRcdF8uZWFjaCBwcm9wTmFtZXMsIChwcm9wTmFtZSkgLT5cblx0XHRcdFx0dGFyZ2V0W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXVxuXG5cdFx0XHQjIHRhcmdldC5hbGxvd0NyZWF0ZSA9IHByb3BzLmFsbG93Q3JlYXRlXG5cdFx0XHQjIHRhcmdldC5hbGxvd0RlbGV0ZSA9IHByb3BzLmFsbG93RGVsZXRlXG5cdFx0XHQjIHRhcmdldC5hbGxvd0VkaXQgPSBwcm9wcy5hbGxvd0VkaXRcblx0XHRcdCMgdGFyZ2V0LmFsbG93UmVhZCA9IHByb3BzLmFsbG93UmVhZFxuXHRcdFx0IyB0YXJnZXQubW9kaWZ5QWxsUmVjb3JkcyA9IHByb3BzLm1vZGlmeUFsbFJlY29yZHNcblx0XHRcdCMgdGFyZ2V0LnZpZXdBbGxSZWNvcmRzID0gcHJvcHMudmlld0FsbFJlY29yZHNcblx0XHRcdCMgdGFyZ2V0Lm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gcHJvcHMubW9kaWZ5Q29tcGFueVJlY29yZHNcblx0XHRcdCMgdGFyZ2V0LnZpZXdDb21wYW55UmVjb3JkcyA9IHByb3BzLnZpZXdDb21wYW55UmVjb3Jkc1xuXHRcdFx0IyB0YXJnZXQuZGlzYWJsZWRfbGlzdF92aWV3cyA9IHByb3BzLmRpc2FibGVkX2xpc3Rfdmlld3Ncblx0XHRcdCMgdGFyZ2V0LmRpc2FibGVkX2FjdGlvbnMgPSBwcm9wcy5kaXNhYmxlZF9hY3Rpb25zXG5cdFx0XHQjIHRhcmdldC51bnJlYWRhYmxlX2ZpZWxkcyA9IHByb3BzLnVucmVhZGFibGVfZmllbGRzXG5cdFx0XHQjIHRhcmdldC51bmVkaXRhYmxlX2ZpZWxkcyA9IHByb3BzLnVuZWRpdGFibGVfZmllbGRzXG5cdFx0XHQjIHRhcmdldC51bnJlbGF0ZWRfb2JqZWN0cyA9IHByb3BzLnVucmVsYXRlZF9vYmplY3RzXG5cdFx0XHQjIHRhcmdldC51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCA9IHByb3BzLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0XG5cblx0b3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzID0gKHRhcmdldCwgcHJvcHMpIC0+XG5cdFx0cHJvcE5hbWVzID0gYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzXG5cdFx0Xy5lYWNoIHByb3BOYW1lcywgKHByb3BOYW1lKSAtPlxuXHRcdFx0aWYgcHJvcHNbcHJvcE5hbWVdXG5cdFx0XHRcdHRhcmdldFtwcm9wTmFtZV0gPSB0cnVlXG5cdFx0XG5cdFx0IyBpZiBwby5hbGxvd1JlYWRcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdCMgaWYgcG8uYWxsb3dDcmVhdGVcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSB0cnVlXG5cdFx0IyBpZiBwby5hbGxvd0VkaXRcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gdHJ1ZVxuXHRcdCMgaWYgcG8uYWxsb3dEZWxldGVcblx0XHQjIFx0cGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSB0cnVlXG5cdFx0IyBpZiBwby5tb2RpZnlBbGxSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSB0cnVlXG5cdFx0IyBpZiBwby52aWV3QWxsUmVjb3Jkc1xuXHRcdCMgXHRwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyA9IHRydWVcblx0XHQjIGlmIHBvLm1vZGlmeUNvbXBhbnlSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gdHJ1ZVxuXHRcdCMgaWYgcG8udmlld0NvbXBhbnlSZWNvcmRzXG5cdFx0IyBcdHBlcm1pc3Npb25zLnZpZXdDb21wYW55UmVjb3JkcyA9IHRydWVcblxuXG5cdENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdHBzZXRzQWRtaW4gPSB0aGlzLnBzZXRzQWRtaW4gfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNVc2VyID0gdGhpcy5wc2V0c1VzZXIgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c1N1cHBsaWVyID0gdGhpcy5wc2V0c01lbWJlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c0N1c3RvbWVyID0gdGhpcy5wc2V0c0d1ZXN0IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnY3VzdG9tZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxuXHRcdCMgcHNldHNNZW1iZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHQjIHBzZXRzR3Vlc3QgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0c3BhY2VVc2VyID0gbnVsbDtcblx0XHRpZiB1c2VySWRcblx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0ZWxzZVxuXHRcdFx0cHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0aXNTcGFjZUFkbWluID0gaWYgXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pIHRoZW4gdGhpcy5pc1NwYWNlQWRtaW4gZWxzZSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0YXBwcyA9IFtdXG5cdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHRyZXR1cm4gW11cblx0XHRlbHNlXG5cdFx0XHR1c2VyUHJvZmlsZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KT8ucHJvZmlsZVxuXHRcdFx0cHNldEJhc2UgPSBwc2V0c1VzZXJcblx0XHRcdGlmIHVzZXJQcm9maWxlXG5cdFx0XHRcdGlmIHVzZXJQcm9maWxlID09ICdzdXBwbGllcidcblx0XHRcdFx0XHRwc2V0QmFzZSA9IHBzZXRzU3VwcGxpZXJcblx0XHRcdFx0ZWxzZSBpZiB1c2VyUHJvZmlsZSA9PSAnY3VzdG9tZXInXG5cdFx0XHRcdFx0cHNldEJhc2UgPSBwc2V0c0N1c3RvbWVyXG5cdFx0XHRpZiBwc2V0QmFzZT8uYXNzaWduZWRfYXBwcz8ubGVuZ3RoXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHNcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyB1c2Vy5p2D6ZmQ6ZuG5Lit55qEYXNzaWduZWRfYXBwc+ihqOekuuaJgOacieeUqOaIt+WFt+acieeahGFwcHPmnYPpmZDvvIzkuLrnqbrliJnooajnpLrmnInmiYDmnIlhcHBz5p2D6ZmQ77yM5LiN6ZyA6KaB5L2c5p2D6ZmQ5Yik5pat5LqGXG5cdFx0XHRcdHJldHVybiBbXVxuXHRcdFx0Xy5lYWNoIHBzZXRzLCAocHNldCktPlxuXHRcdFx0XHRpZiAhcHNldC5hc3NpZ25lZF9hcHBzXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGlmIHBzZXQubmFtZSA9PSBcImFkbWluXCIgfHwgIHBzZXQubmFtZSA9PSBcInVzZXJcIiB8fCBwc2V0Lm5hbWUgPT0gJ3N1cHBsaWVyJyB8fCBwc2V0Lm5hbWUgPT0gJ2N1c3RvbWVyJ1xuXHRcdFx0XHRcdCMg6L+Z6YeM5LmL5omA5Lul6KaB5o6S6ZmkYWRtaW4vdXNlcu+8jOaYr+WboOS4uui/meS4pOS4quadg+mZkOmbhuaYr+aJgOacieadg+mZkOmbhuS4rXVzZXJz5bGe5oCn5peg5pWI55qE5p2D6ZmQ6ZuG77yM54m55oyH5bel5L2c5Yy6566h55CG5ZGY5ZKM5omA5pyJ55So5oi3XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdGFwcHMgPSBfLnVuaW9uIGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwc1xuXHRcdFx0cmV0dXJuIF8ud2l0aG91dChfLnVuaXEoYXBwcyksdW5kZWZpbmVkLG51bGwpXG5cblx0Q3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdHBzZXRzID0gIHRoaXMucHNldHNDdXJyZW50IHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRhZG1pbk1lbnVzID0gQ3JlYXRvci5BcHBzLmFkbWluPy5hZG1pbl9tZW51c1xuXHRcdCMg5aaC5p6c5rKh5pyJYWRtaW7oj5zljZXor7TmmI7kuI3pnIDopoHnm7jlhbPlip/og73vvIznm7TmjqXov5Tlm57nqbpcblx0XHR1bmxlc3MgYWRtaW5NZW51c1xuXHRcdFx0cmV0dXJuIFtdXG5cdFx0YWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kIChuKSAtPlxuXHRcdFx0bi5faWQgPT0gJ2Fib3V0J1xuXHRcdGFkbWluTWVudXMgPSBhZG1pbk1lbnVzLmZpbHRlciAobikgLT5cblx0XHRcdG4uX2lkICE9ICdhYm91dCdcblx0XHRvdGhlck1lbnVBcHBzID0gXy5zb3J0QnkgXy5maWx0ZXIoXy52YWx1ZXMoQ3JlYXRvci5BcHBzKSwgKG4pIC0+XG5cdFx0XHRyZXR1cm4gbi5hZG1pbl9tZW51cyBhbmQgbi5faWQgIT0gJ2FkbWluJ1xuXHRcdCksICdzb3J0J1xuXHRcdG90aGVyTWVudXMgPSBfLmZsYXR0ZW4oXy5wbHVjayhvdGhlck1lbnVBcHBzLCBcImFkbWluX21lbnVzXCIpKVxuXHRcdCMg6I+c5Y2V5pyJ5LiJ6YOo5YiG57uE5oiQ77yM6K6+572uQVBQ6I+c5Y2V44CB5YW25LuWQVBQ6I+c5Y2V5Lul5Y+KYWJvdXToj5zljZVcblx0XHRhbGxNZW51cyA9IF8udW5pb24oYWRtaW5NZW51cywgb3RoZXJNZW51cywgW2Fib3V0TWVudV0pXG5cdFx0aWYgaXNTcGFjZUFkbWluXG5cdFx0XHQjIOW3peS9nOWMuueuoeeQhuWRmOacieWFqOmDqOiPnOWNleWKn+iDvVxuXHRcdFx0cmVzdWx0ID0gYWxsTWVudXNcblx0XHRlbHNlXG5cdFx0XHR1c2VyUHJvZmlsZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KT8ucHJvZmlsZSB8fCAndXNlcidcblx0XHRcdGN1cnJlbnRQc2V0TmFtZXMgPSBwc2V0cy5tYXAgKG4pIC0+XG5cdFx0XHRcdHJldHVybiBuLm5hbWVcblx0XHRcdG1lbnVzID0gYWxsTWVudXMuZmlsdGVyIChtZW51KS0+XG5cdFx0XHRcdHBzZXRzTWVudSA9IG1lbnUucGVybWlzc2lvbl9zZXRzXG5cdFx0XHRcdCMg5aaC5p6c5pmu6YCa55So5oi35pyJ5p2D6ZmQ77yM5YiZ55u05o6l6L+U5ZuedHJ1ZVxuXHRcdFx0XHRpZiBwc2V0c01lbnUgJiYgcHNldHNNZW51LmluZGV4T2YodXNlclByb2ZpbGUpID4gLTFcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0XHQjIOWQpuWImeWPluW9k+WJjeeUqOaIt+eahOadg+mZkOmbhuS4jm1lbnXoj5zljZXopoHmsYLnmoTmnYPpmZDpm4blr7nmr5TvvIzlpoLmnpzkuqTpm4blpKfkuo4x5Liq5YiZ6L+U5ZuedHJ1ZVxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24oY3VycmVudFBzZXROYW1lcywgcHNldHNNZW51KS5sZW5ndGhcblx0XHRcdHJlc3VsdCA9IG1lbnVzXG5cdFx0XG5cdFx0cmV0dXJuIF8uc29ydEJ5KHJlc3VsdCxcInNvcnRcIilcblxuXHRmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0ID0gKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKS0+XG5cblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gXy5maW5kIHBlcm1pc3Npb25fb2JqZWN0cywgKHBvKS0+XG5cdFx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kT25lKHtvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkOiBwZXJtaXNzaW9uX3NldF9pZH0pXG5cblx0ZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IChwZXJtaXNzaW9uX29iamVjdHMsIG9iamVjdF9uYW1lLCBwZXJtaXNzaW9uX3NldF9pZHMpLT5cblx0XHRpZiBfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGlmIF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpXG5cdFx0XHRyZXR1cm4gXy5maWx0ZXIgcGVybWlzc2lvbl9vYmplY3RzLCAocG8pLT5cblx0XHRcdFx0cmV0dXJuIHBvLm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe29iamVjdF9uYW1lOiBvYmplY3RfbmFtZSwgcGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHBlcm1pc3Npb25fc2V0X2lkc319KS5mZXRjaCgpXG5cblx0dW5pb25QZXJtaXNzaW9uT2JqZWN0cyA9IChwb3MsIG9iamVjdCwgcHNldHMpLT5cblx0XHQjIOaKimRi5Y+KeW1s5Lit55qEcGVybWlzc2lvbl9vYmplY3Rz5ZCI5bm277yM5LyY5YWI5Y+WZGLkuK3nmoRcblx0XHRyZXN1bHQgPSBbXVxuXHRcdF8uZWFjaCBvYmplY3QucGVybWlzc2lvbl9zZXQsIChvcHMsIG9wc19rZXkpLT5cblx0XHRcdCMg5oqKeW1s5Lit6Zmk5LqG54m55a6a55So5oi36ZuG5ZCI5p2D6ZmQ6ZuGXCJhZG1pblwiLCBcInVzZXJcIiwgXCJtZW1iZXJcIiwgXCJndWVzdFwi5aSW55qE5YW25LuW5a+56LGh5p2D6ZmQ5YWI5a2Y5YWlcmVzdWx0XG5cdFx0XHQjIGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCIsIFwid29ya2Zsb3dfYWRtaW5cIiwgXCJvcmdhbml6YXRpb25fYWRtaW5cIl0uaW5kZXhPZihvcHNfa2V5KSA8IDBcblx0XHRcdGlmIFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwXG5cdFx0XHRcdGN1cnJlbnRQc2V0ID0gcHNldHMuZmluZCAocHNldCktPiByZXR1cm4gcHNldC5uYW1lID09IG9wc19rZXlcblx0XHRcdFx0aWYgY3VycmVudFBzZXRcblx0XHRcdFx0XHR0ZW1wT3BzID0gXy5jbG9uZShvcHMpIHx8IHt9XG5cdFx0XHRcdFx0dGVtcE9wcy5wZXJtaXNzaW9uX3NldF9pZCA9IGN1cnJlbnRQc2V0Ll9pZFxuXHRcdFx0XHRcdHRlbXBPcHMub2JqZWN0X25hbWUgPSBvYmplY3Qub2JqZWN0X25hbWVcblx0XHRcdFx0XHRyZXN1bHQucHVzaCB0ZW1wT3BzXG5cdFx0aWYgcmVzdWx0Lmxlbmd0aFxuXHRcdFx0cG9zLmZvckVhY2ggKHBvKS0+XG5cdFx0XHRcdHJlcGVhdEluZGV4ID0gMFxuXHRcdFx0XHRyZXBlYXRQbyA9IHJlc3VsdC5maW5kKChpdGVtLCBpbmRleCktPiByZXBlYXRJbmRleCA9IGluZGV4O3JldHVybiBpdGVtLnBlcm1pc3Npb25fc2V0X2lkID09IHBvLnBlcm1pc3Npb25fc2V0X2lkKVxuXHRcdFx0XHQjIOWmguaenHltbOS4reW3sue7j+WtmOWcqHBv77yM5YiZ5pu/5o2i5Li65pWw5o2u5bqT5Lit55qEcG/vvIzlj43kuYvliJnmiormlbDmja7lupPkuK3nmoRwb+ebtOaOpee0r+WKoOi/m+WOu1xuXHRcdFx0XHRpZiByZXBlYXRQb1xuXHRcdFx0XHRcdHJlc3VsdFtyZXBlYXRJbmRleF0gPSBwb1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2ggcG9cblx0XHRcdHJldHVybiByZXN1bHRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gcG9zXG5cblx0Q3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKS0+XG5cdFx0cGVybWlzc2lvbnMgPSB7fVxuXHRcdG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKVxuXG5cdFx0aWYgc3BhY2VJZCBpcyAnZ3Vlc3QnIHx8IG9iamVjdF9uYW1lID09IFwidXNlcnNcIlxuXHRcdFx0cGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge31cblx0XHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cdFx0XHRyZXR1cm4gcGVybWlzc2lvbnNcblx0XHRwc2V0c0FkbWluID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0FkbWluKSBvciB0aGlzLnBzZXRzQWRtaW4gdGhlbiB0aGlzLnBzZXRzQWRtaW4gZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNVc2VyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1VzZXIpIG9yIHRoaXMucHNldHNVc2VyIHRoZW4gdGhpcy5wc2V0c1VzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3VzZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c01lbWJlciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIG9yIHRoaXMucHNldHNNZW1iZXIgdGhlbiB0aGlzLnBzZXRzTWVtYmVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjF9fSlcblx0XHRwc2V0c0d1ZXN0ID0gaWYgXy5pc051bGwodGhpcy5wc2V0c0d1ZXN0KSBvciB0aGlzLnBzZXRzR3Vlc3QgdGhlbiB0aGlzLnBzZXRzR3Vlc3QgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxfX0pXG5cblx0XHRwc2V0c1N1cHBsaWVyID0gaWYgXy5pc051bGwodGhpcy5wc2V0c1N1cHBsaWVyKSBvciB0aGlzLnBzZXRzU3VwcGxpZXIgdGhlbiB0aGlzLnBzZXRzU3VwcGxpZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxfX0pXG5cdFx0cHNldHNDdXN0b21lciA9IGlmIF8uaXNOdWxsKHRoaXMucHNldHNDdXN0b21lcikgb3IgdGhpcy5wc2V0c0N1c3RvbWVyIHRoZW4gdGhpcy5wc2V0c0N1c3RvbWVyIGVsc2UgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MX19KVxuXHRcdHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQ7XG5cdFx0aWYgIXBzZXRzXG5cdFx0XHRzcGFjZVVzZXIgPSBudWxsO1xuXHRcdFx0aWYgdXNlcklkXG5cdFx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXHRcdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRcdHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRpc1NwYWNlQWRtaW4gPSBpZiBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgdGhlbiB0aGlzLmlzU3BhY2VBZG1pbiBlbHNlIENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblxuXHRcdHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3Bvc1xuXHRcdHBzZXRzVXNlcl9wb3MgPSB0aGlzLnBzZXRzVXNlcl9wb3Ncblx0XHRwc2V0c01lbWJlcl9wb3MgPSB0aGlzLnBzZXRzTWVtYmVyX3Bvc1xuXHRcdHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3Bvc1xuXG5cdFx0cHNldHNTdXBwbGllcl9wb3MgPSB0aGlzLnBzZXRzU3VwcGxpZXJfcG9zXG5cdFx0cHNldHNDdXN0b21lcl9wb3MgPSB0aGlzLnBzZXRzQ3VzdG9tZXJfcG9zXG5cblx0XHRwc2V0c0N1cnJlbnRfcG9zID0gdGhpcy5wc2V0c0N1cnJlbnRfcG9zXG5cblx0XHRvcHNldEFkbWluID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuYWRtaW4pIHx8IHt9XG5cdFx0b3BzZXRVc2VyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQudXNlcikgfHwge31cblx0XHRvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge31cblx0XHRvcHNldEd1ZXN0ID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuZ3Vlc3QpIHx8IHt9XG5cblx0XHRvcHNldFN1cHBsaWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuc3VwcGxpZXIpIHx8IHt9XG5cdFx0b3BzZXRDdXN0b21lciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmN1c3RvbWVyKSB8fCB7fVxuXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF9saXN0dmlld3MnKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLCBzaGFyZWQ6IHRydWV9LCB7ZmllbGRzOntfaWQ6MX19KS5mZXRjaCgpXG5cdFx0IyBzaGFyZWRMaXN0Vmlld3MgPSBfLnBsdWNrKHNoYXJlZExpc3RWaWV3cyxcIl9pZFwiKVxuXHRcdCMgaWYgc2hhcmVkTGlzdFZpZXdzLmxlbmd0aFxuXHRcdCMgXHR1bmxlc3Mgb3BzZXRBZG1pbi5saXN0X3ZpZXdzXG5cdFx0IyBcdFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gW11cblx0XHQjIFx0b3BzZXRBZG1pbi5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldEFkbWluLmxpc3Rfdmlld3MsIHNoYXJlZExpc3RWaWV3c1xuXHRcdCMgXHR1bmxlc3Mgb3BzZXRVc2VyLmxpc3Rfdmlld3Ncblx0XHQjIFx0XHRvcHNldFVzZXIubGlzdF92aWV3cyA9IFtdXG5cdFx0IyBcdG9wc2V0VXNlci5saXN0X3ZpZXdzID0gXy51bmlvbiBvcHNldFVzZXIubGlzdF92aWV3cywgc2hhcmVkTGlzdFZpZXdzXG5cdFx0IyDmlbDmja7lupPkuK3lpoLmnpzphY3nva7kuobpu5jorqTnmoRhZG1pbi91c2Vy5p2D6ZmQ6ZuG6K6+572u77yM5bqU6K+l6KaG55uW5Luj56CB5LitYWRtaW4vdXNlcueahOadg+mZkOmbhuiuvue9rlxuXHRcdGlmIHBzZXRzQWRtaW5cblx0XHRcdHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0QWRtaW4sIHBvc0FkbWluXG5cdFx0aWYgcHNldHNVc2VyXG5cdFx0XHRwb3NVc2VyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c1VzZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNVc2VyLl9pZClcblx0XHRcdGV4dGVuZFBlcm1pc3Npb25Qcm9wcyBvcHNldFVzZXIsIHBvc1VzZXJcblx0XHRpZiBwc2V0c01lbWJlclxuXHRcdFx0cG9zTWVtYmVyID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c01lbWJlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c01lbWJlci5faWQpXG5cdFx0XHRleHRlbmRQZXJtaXNzaW9uUHJvcHMgb3BzZXRNZW1iZXIsIHBvc01lbWJlclxuXHRcdGlmIHBzZXRzR3Vlc3Rcblx0XHRcdHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKVxuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0R3Vlc3QsIHBvc0d1ZXN0XG5cdFx0aWYgcHNldHNTdXBwbGllclxuXHRcdFx0cG9zU3VwcGxpZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzU3VwcGxpZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNTdXBwbGllci5faWQpO1xuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0U3VwcGxpZXIsIHBvc1N1cHBsaWVyXG5cdFx0aWYgcHNldHNDdXN0b21lclxuXHRcdFx0cG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuXHRcdFx0ZXh0ZW5kUGVybWlzc2lvblByb3BzIG9wc2V0Q3VzdG9tZXIsIHBvc0N1c3RvbWVyXG5cblx0XHRpZiAhdXNlcklkXG5cdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW5cblx0XHRlbHNlXG5cdFx0XHRpZiBpc1NwYWNlQWRtaW5cblx0XHRcdFx0cGVybWlzc2lvbnMgPSBvcHNldEFkbWluXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIHNwYWNlSWQgaXMgJ2NvbW1vbidcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c3BhY2VVc2VyID0gaWYgXy5pc051bGwodGhpcy5zcGFjZVVzZXIpIG9yIHRoaXMuc3BhY2VVc2VyIHRoZW4gdGhpcy5zcGFjZVVzZXIgZWxzZSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHsgc3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZCB9LCB7IGZpZWxkczogeyBwcm9maWxlOiAxIH0gfSlcblx0XHRcdFx0XHRpZiBzcGFjZVVzZXJcblx0XHRcdFx0XHRcdHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0XHRcdFx0aWYgcHJvZlxuXHRcdFx0XHRcdFx0XHRpZiBwcm9mIGlzICd1c2VyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRVc2VyXG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgcHJvZiBpcyAnbWVtYmVyJ1xuXHRcdFx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdndWVzdCdcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Rcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdzdXBwbGllcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0U3VwcGxpZXJcblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiBwcm9mIGlzICdjdXN0b21lcidcblx0XHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0Q3VzdG9tZXJcblx0XHRcdFx0XHRcdGVsc2UgIyDmsqHmnIlwcm9maWxl5YiZ6K6k5Li65pivdXNlcuadg+mZkFxuXHRcdFx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IG9wc2V0VXNlclxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdFxuXHRcdGlmIHBzZXRzLmxlbmd0aCA+IDBcblx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzLCBcIl9pZFwiXG5cdFx0XHRwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKVxuXHRcdFx0cG9zID0gdW5pb25QZXJtaXNzaW9uT2JqZWN0cyhwb3MsIG9iamVjdCwgcHNldHMpXG5cdFx0XHRfLmVhY2ggcG9zLCAocG8pLT5cblx0XHRcdFx0aWYgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNBZG1pbj8uX2lkIG9yIFxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c1VzZXI/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNNZW1iZXI/Ll9pZCBvciBcblx0XHRcdFx0cG8ucGVybWlzc2lvbl9zZXRfaWQgPT0gcHNldHNHdWVzdD8uX2lkIG9yXG5cdFx0XHRcdHBvLnBlcm1pc3Npb25fc2V0X2lkID09IHBzZXRzU3VwcGxpZXI/Ll9pZCBvclxuXHRcdFx0XHRwby5wZXJtaXNzaW9uX3NldF9pZCA9PSBwc2V0c0N1c3RvbWVyPy5faWRcblx0XHRcdFx0XHQjIOm7mOiupOeahGFkbWluL3VzZXLmnYPpmZDlgLzlj6rlrp7ooYzkuIrpnaLnmoTpu5jorqTlgLzopobnm5bvvIzkuI3lgZrnrpfms5XliKTmlq1cblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0aWYgXy5pc0VtcHR5KHBlcm1pc3Npb25zKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gcG9cblx0XHRcdFx0b3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzIHBlcm1pc3Npb25zLCBwb1xuXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpXG5cdFx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMsIHBvLmRpc2FibGVkX2FjdGlvbnMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgcG8udW5yZWFkYWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVucmVsYXRlZF9vYmplY3RzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cywgcG8udW5yZWxhdGVkX29iamVjdHMpXG5cdFx0XHRcdHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpXG5cdFx0XG5cdFx0aWYgb2JqZWN0LmlzX3ZpZXdcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlXG5cdFx0XHRwZXJtaXNzaW9ucy5tb2RpZnlBbGxSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2Vcblx0XHRcdHBlcm1pc3Npb25zLmRpc2FibGVkX2FjdGlvbnMgPSBbXVxuXHRcdENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zIHBlcm1pc3Npb25zXG5cblx0XHRpZiBvYmplY3QucGVybWlzc2lvbl9zZXQub3duZXJcblx0XHRcdHBlcm1pc3Npb25zLm93bmVyID0gb2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyXG5cdFx0cmV0dXJuIHBlcm1pc3Npb25zXG5cblxuXHQjIENyZWF0b3IuaW5pdFBlcm1pc3Npb25zID0gKG9iamVjdF9uYW1lKSAtPlxuXG5cdFx0IyAjIOW6lOivpeaKiuiuoeeul+WHuuadpeeahFxuXHRcdCMgQ3JlYXRvci5Db2xsZWN0aW9uc1tvYmplY3RfbmFtZV0uYWxsb3dcblx0XHQjIFx0aW5zZXJ0OiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdCAgICBcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93Q3JlYXRlXG5cdFx0IyBcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cdFx0IyBcdHVwZGF0ZTogKHVzZXJJZCwgZG9jKSAtPlxuXHRcdCMgXHRcdGlmICF1c2VySWRcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdGlmICFkb2Muc3BhY2Vcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyhkb2Muc3BhY2UsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cdFx0IyBcdFx0aWYgIXBlcm1pc3Npb25zLmFsbG93RWRpdFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cmV0dXJuIHRydWVcblx0XHQjIFx0cmVtb3ZlOiAodXNlcklkLCBkb2MpIC0+XG5cdFx0IyBcdFx0aWYgIXVzZXJJZFxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0aWYgIWRvYy5zcGFjZVxuXHRcdCMgXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0IyBcdFx0cGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zKGRvYy5zcGFjZSwgdXNlcklkLCBvYmplY3RfbmFtZSlcblx0XHQjIFx0XHRpZiAhcGVybWlzc2lvbnMuYWxsb3dEZWxldGVcblx0XHQjIFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdCMgXHRcdHJldHVybiB0cnVlXG5cblx0TWV0ZW9yLm1ldGhvZHNcblx0XHQjIENhbGN1bGF0ZSBQZXJtaXNzaW9ucyBvbiBTZXJ2ZXJcblx0XHRcImNyZWF0b3Iub2JqZWN0X3Blcm1pc3Npb25zXCI6IChzcGFjZUlkKS0+XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZClcbiIsInZhciBiYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wTmFtZXMsIGNsb25lLCBleHRlbmRQZXJtaXNzaW9uUHJvcHMsIGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QsIGZpbmRfcGVybWlzc2lvbl9vYmplY3QsIGludGVyc2VjdGlvblBsdXMsIG90aGVyUGVybWlzc2lvblByb3BOYW1lcywgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzLCBwZXJtaXNzaW9uUHJvcE5hbWVzLCB1bmlvblBlcm1pc3Npb25PYmplY3RzLCB1bmlvblBsdXM7XG5cbmNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxuYmFzZUJvb2xlYW5QZXJtaXNzaW9uUHJvcE5hbWVzID0gW1wiYWxsb3dDcmVhdGVcIiwgXCJhbGxvd0RlbGV0ZVwiLCBcImFsbG93RWRpdFwiLCBcImFsbG93UmVhZFwiLCBcIm1vZGlmeUFsbFJlY29yZHNcIiwgXCJ2aWV3QWxsUmVjb3Jkc1wiLCBcIm1vZGlmeUNvbXBhbnlSZWNvcmRzXCIsIFwidmlld0NvbXBhbnlSZWNvcmRzXCIsIFwiYWxsb3dSZWFkRmlsZXNcIiwgXCJhbGxvd0VkaXRGaWxlc1wiLCBcImFsbG93Q3JlYXRlRmlsZXNcIiwgXCJhbGxvd0RlbGV0ZUZpbGVzXCIsIFwidmlld0FsbEZpbGVzXCIsIFwibW9kaWZ5QWxsRmlsZXNcIl07XG5cbm90aGVyUGVybWlzc2lvblByb3BOYW1lcyA9IFtcImRpc2FibGVkX2xpc3Rfdmlld3NcIiwgXCJkaXNhYmxlZF9hY3Rpb25zXCIsIFwidW5yZWFkYWJsZV9maWVsZHNcIiwgXCJ1bmVkaXRhYmxlX2ZpZWxkc1wiLCBcInVucmVsYXRlZF9vYmplY3RzXCIsIFwidW5lZGl0YWJsZV9yZWxhdGVkX2xpc3RcIl07XG5cbnBlcm1pc3Npb25Qcm9wTmFtZXMgPSBfLnVuaW9uKGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcywgb3RoZXJQZXJtaXNzaW9uUHJvcE5hbWVzKTtcblxuQ3JlYXRvci5nZXRQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpIHtcbiAgdmFyIG9iajtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICghb2JqZWN0X25hbWUpIHtcbiAgICAgIG9iamVjdF9uYW1lID0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKTtcbiAgICB9XG4gICAgb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuICAgIGlmICghb2JqKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBvYmoucGVybWlzc2lvbnMuZ2V0KCk7XG4gIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gIH1cbn07XG5cbkNyZWF0b3IuZ2V0UmVjb3JkUGVybWlzc2lvbnMgPSBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIGlzT3duZXIsIG1hc3Rlck9iamVjdE5hbWUsIG1hc3RlclJlY29yZFBlcm0sIHBlcm1pc3Npb25zLCByZWNvcmRfY29tcGFueV9pZCwgcmVjb3JkX2NvbXBhbnlfaWRzLCByZWYsIHVzZXJfY29tcGFueV9pZHM7XG4gIGlmICghb2JqZWN0X25hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgb2JqZWN0X25hbWUgPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpO1xuICB9XG4gIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICB9XG4gIHBlcm1pc3Npb25zID0gXy5jbG9uZShDcmVhdG9yLmdldFBlcm1pc3Npb25zKG9iamVjdF9uYW1lLCBzcGFjZUlkLCB1c2VySWQpKTtcbiAgaWYgKHJlY29yZCkge1xuICAgIGlmIChyZWNvcmQucmVjb3JkX3Blcm1pc3Npb25zKSB7XG4gICAgICByZXR1cm4gcmVjb3JkLnJlY29yZF9wZXJtaXNzaW9ucztcbiAgICB9XG4gICAgaXNPd25lciA9IHJlY29yZC5vd25lciA9PT0gdXNlcklkIHx8ICgocmVmID0gcmVjb3JkLm93bmVyKSAhPSBudWxsID8gcmVmLl9pZCA6IHZvaWQgMCkgPT09IHVzZXJJZDtcbiAgICBpZiAob2JqZWN0X25hbWUgPT09IFwiY21zX2ZpbGVzXCIpIHtcbiAgICAgIG1hc3Rlck9iamVjdE5hbWUgPSByZWNvcmQucGFyZW50WydyZWZlcmVuY2VfdG8uX28nXTtcbiAgICAgIG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFBlcm1pc3Npb25zKG1hc3Rlck9iamVjdE5hbWUsIHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSA9IHBlcm1pc3Npb25zLmFsbG93Q3JlYXRlICYmIG1hc3RlclJlY29yZFBlcm0uYWxsb3dDcmVhdGVGaWxlcztcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IHBlcm1pc3Npb25zLmFsbG93RWRpdCAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RWRpdEZpbGVzO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSAmJiBtYXN0ZXJSZWNvcmRQZXJtLmFsbG93RGVsZXRlRmlsZXM7XG4gICAgICBpZiAoIW1hc3RlclJlY29yZFBlcm0ubW9kaWZ5QWxsRmlsZXMgJiYgIWlzT3duZXIpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgPSBwZXJtaXNzaW9ucy5hbGxvd1JlYWQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWRGaWxlcztcbiAgICAgIGlmICghbWFzdGVyUmVjb3JkUGVybS52aWV3QWxsRmlsZXMgJiYgIWlzT3duZXIpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgdXNlcl9jb21wYW55X2lkcyA9IFN0ZWVkb3MuZ2V0VXNlckNvbXBhbnlJZHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVzZXJfY29tcGFueV9pZHMgPSBDcmVhdG9yLmdldFVzZXJDb21wYW55SWRzKHVzZXJJZCwgc3BhY2VJZCk7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZCA9IHJlY29yZCAhPSBudWxsID8gcmVjb3JkLmNvbXBhbnlfaWQgOiB2b2lkIDA7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWQgJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZCkgJiYgcmVjb3JkX2NvbXBhbnlfaWQuX2lkKSB7XG4gICAgICAgIHJlY29yZF9jb21wYW55X2lkID0gcmVjb3JkX2NvbXBhbnlfaWQuX2lkO1xuICAgICAgfVxuICAgICAgcmVjb3JkX2NvbXBhbnlfaWRzID0gcmVjb3JkICE9IG51bGwgPyByZWNvcmQuY29tcGFueV9pZHMgOiB2b2lkIDA7XG4gICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGggJiYgXy5pc09iamVjdChyZWNvcmRfY29tcGFueV9pZHNbMF0pKSB7XG4gICAgICAgIHJlY29yZF9jb21wYW55X2lkcyA9IHJlY29yZF9jb21wYW55X2lkcy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZWNvcmRfY29tcGFueV9pZHMgPSBfLnVuaW9uKHJlY29yZF9jb21wYW55X2lkcywgW3JlY29yZF9jb21wYW55X2lkXSk7XG4gICAgICBpZiAoIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgJiYgIWlzT3duZXIgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICghcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy5tb2RpZnlDb21wYW55UmVjb3Jkcykge1xuICAgICAgICBpZiAocmVjb3JkX2NvbXBhbnlfaWRzICYmIHJlY29yZF9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAodXNlcl9jb21wYW55X2lkcyAmJiB1c2VyX2NvbXBhbnlfaWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCFfLmludGVyc2VjdGlvbih1c2VyX2NvbXBhbnlfaWRzLCByZWNvcmRfY29tcGFueV9pZHMpLmxlbmd0aCkge1xuICAgICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0VkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlY29yZC5sb2NrZWQgJiYgIXBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dFZGl0ID0gZmFsc2U7XG4gICAgICAgIHBlcm1pc3Npb25zLmFsbG93RGVsZXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIXBlcm1pc3Npb25zLnZpZXdBbGxSZWNvcmRzICYmICFpc093bmVyICYmICFwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCFwZXJtaXNzaW9ucy52aWV3QWxsUmVjb3JkcyAmJiBwZXJtaXNzaW9ucy52aWV3Q29tcGFueVJlY29yZHMpIHtcbiAgICAgICAgaWYgKHJlY29yZF9jb21wYW55X2lkcyAmJiByZWNvcmRfY29tcGFueV9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHVzZXJfY29tcGFueV9pZHMgJiYgdXNlcl9jb21wYW55X2lkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghXy5pbnRlcnNlY3Rpb24odXNlcl9jb21wYW55X2lkcywgcmVjb3JkX2NvbXBhbnlfaWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcGVybWlzc2lvbnMuYWxsb3dSZWFkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb25zLmFsbG93UmVhZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcGVybWlzc2lvbnM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIENyZWF0b3IuZ2V0UmVjb3JkUmVsYXRlZExpc3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGN1cnJlbnRPYmplY3ROYW1lLCByZWxhdGVkTGlzdEl0ZW0sIGN1cnJlbnRSZWNvcmQsIHVzZXJJZCwgc3BhY2VJZCkge1xuICAgIHZhciBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUsIG1hc3RlckFsbG93LCBtYXN0ZXJSZWNvcmRQZXJtLCByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMsIHJlc3VsdCwgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QsIHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkO1xuICAgIGlmICghY3VycmVudE9iamVjdE5hbWUgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50T2JqZWN0TmFtZSA9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIik7XG4gICAgfVxuICAgIGlmICghcmVsYXRlZExpc3RJdGVtKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwicmVsYXRlZExpc3RJdGVtIG11c3Qgbm90IGJlIGVtcHR5IGZvciB0aGUgZnVuY3Rpb24gQ3JlYXRvci5nZXRSZWNvcmRSZWxhdGVkTGlzdFBlcm1pc3Npb25zXCIpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAoIWN1cnJlbnRSZWNvcmQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBjdXJyZW50UmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQoKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgfVxuICAgIG1hc3RlclJlY29yZFBlcm0gPSBDcmVhdG9yLmdldFJlY29yZFBlcm1pc3Npb25zKGN1cnJlbnRPYmplY3ROYW1lLCBjdXJyZW50UmVjb3JkLCB1c2VySWQsIHNwYWNlSWQpO1xuICAgIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0UGVybWlzc2lvbnMocmVsYXRlZExpc3RJdGVtLm9iamVjdF9uYW1lKTtcbiAgICByZXN1bHQgPSBfLmNsb25lKHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucyk7XG4gICAgaWYgKHJlbGF0ZWRMaXN0SXRlbS5pc19maWxlKSB7XG4gICAgICByZXN1bHQuYWxsb3dDcmVhdGUgPSByZWxhdGVkT2JqZWN0UGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0NyZWF0ZUZpbGVzO1xuICAgICAgcmVzdWx0LmFsbG93RWRpdCA9IHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgbWFzdGVyUmVjb3JkUGVybS5hbGxvd0VkaXRGaWxlcztcbiAgICB9IGVsc2Uge1xuICAgICAgd3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgPSByZWxhdGVkTGlzdEl0ZW0ud3JpdGVfcmVxdWlyZXNfbWFzdGVyX3JlYWQgfHwgZmFsc2U7XG4gICAgICBtYXN0ZXJBbGxvdyA9IGZhbHNlO1xuICAgICAgaWYgKHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09PSB0cnVlKSB7XG4gICAgICAgIG1hc3RlckFsbG93ID0gbWFzdGVyUmVjb3JkUGVybS5hbGxvd1JlYWQ7XG4gICAgICB9IGVsc2UgaWYgKHdyaXRlX3JlcXVpcmVzX21hc3Rlcl9yZWFkID09PSBmYWxzZSkge1xuICAgICAgICBtYXN0ZXJBbGxvdyA9IG1hc3RlclJlY29yZFBlcm0uYWxsb3dFZGl0O1xuICAgICAgfVxuICAgICAgdW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QgPSBDcmVhdG9yLmdldFJlY29yZFNhZmVSZWxhdGVkTGlzdChjdXJyZW50UmVjb3JkLCBjdXJyZW50T2JqZWN0TmFtZSk7XG4gICAgICBpc1JlbGF0ZU9iamVjdFVuZWRpdGFibGUgPSB1bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdC5pbmRleE9mKHJlbGF0ZWRMaXN0SXRlbS5vYmplY3RfbmFtZSkgPiAtMTtcbiAgICAgIHJlc3VsdC5hbGxvd0NyZWF0ZSA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0NyZWF0ZSAmJiAhaXNSZWxhdGVPYmplY3RVbmVkaXRhYmxlO1xuICAgICAgcmVzdWx0LmFsbG93RWRpdCA9IG1hc3RlckFsbG93ICYmIHJlbGF0ZWRPYmplY3RQZXJtaXNzaW9ucy5hbGxvd0VkaXQgJiYgIWlzUmVsYXRlT2JqZWN0VW5lZGl0YWJsZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIF9pLCBpc1NwYWNlQWRtaW4sIHBlcm1pc3Npb25zLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudCwgcHNldHNDdXJyZW50TmFtZXMsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzQ3VzdG9tZXIsIHBzZXRzQ3VzdG9tZXJfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNTdXBwbGllciwgcHNldHNTdXBwbGllcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3Bvcywgc2V0X2lkcywgc3BhY2VVc2VyO1xuICAgIHBlcm1pc3Npb25zID0ge1xuICAgICAgb2JqZWN0czoge30sXG4gICAgICBhc3NpZ25lZF9hcHBzOiBbXVxuICAgIH07XG5cbiAgICAvKlxuICAgIFx0XHTmnYPpmZDpm4bor7TmmI46XG4gICAgXHRcdOWGhee9ruadg+mZkOmbhi1hZG1pbix1c2VyLG1lbWJlcixndWVzdCx3b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW5cbiAgICBcdFx06Ieq5a6a5LmJ5p2D6ZmQ6ZuGLeaVsOaNruW6k+S4reaWsOW7uueahOmZpOWGhee9ruadg+mZkOmbhuS7peWklueahOWFtuS7luadg+mZkOmbhlxuICAgIFx0XHTnibnlrprnlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+S4jeWPr+mFjee9ru+8iS1hZG1pbix1c2VyLG1lbWJlcixndWVzdFxuICAgIFx0XHTlj6/phY3nva7nlKjmiLfpm4blkIjmnYPpmZDpm4bvvIjljbN1c2Vyc+WxnuaAp+WPr+mFjee9ru+8iS13b3JrZmxvd19hZG1pbixvcmdhbml6YXRpb25fYWRtaW7ku6Xlj4roh6rlrprkuYnmnYPpmZDpm4ZcbiAgICAgKi9cbiAgICBpc1NwYWNlQWRtaW4gPSBmYWxzZTtcbiAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pIHx8IG51bGw7XG4gICAgcHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ21lbWJlcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdndWVzdCdcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSkgfHwgbnVsbDtcbiAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICBuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIHBzZXRzQWRtaW5fcG9zID0gbnVsbDtcbiAgICBwc2V0c1VzZXJfcG9zID0gbnVsbDtcbiAgICBwc2V0c01lbWJlcl9wb3MgPSBudWxsO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gbnVsbDtcbiAgICBwc2V0c0N1cnJlbnRfcG9zID0gbnVsbDtcbiAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGw7XG4gICAgcHNldHNDdXN0b21lcl9wb3MgPSBudWxsO1xuICAgIGlmIChwc2V0c0FkbWluICE9IG51bGwgPyBwc2V0c0FkbWluLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c01lbWJlci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0d1ZXN0ICE9IG51bGwgPyBwc2V0c0d1ZXN0Ll9pZCA6IHZvaWQgMCkge1xuICAgICAgcHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzU3VwcGxpZXIuX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApIHtcbiAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNDdXN0b21lci5faWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgfVxuICAgIGlmIChwc2V0c0N1cnJlbnQubGVuZ3RoID4gMCkge1xuICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIl9pZFwiKTtcbiAgICAgIHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICAgJGluOiBzZXRfaWRzXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIm5hbWVcIik7XG4gICAgfVxuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnQsXG4gICAgICBwc2V0c01lbWJlcjogcHNldHNNZW1iZXIsXG4gICAgICBwc2V0c0d1ZXN0OiBwc2V0c0d1ZXN0LFxuICAgICAgcHNldHNTdXBwbGllcjogcHNldHNTdXBwbGllcixcbiAgICAgIHBzZXRzQ3VzdG9tZXI6IHBzZXRzQ3VzdG9tZXIsXG4gICAgICBpc1NwYWNlQWRtaW46IGlzU3BhY2VBZG1pbixcbiAgICAgIHNwYWNlVXNlcjogc3BhY2VVc2VyLFxuICAgICAgcHNldHNBZG1pbl9wb3M6IHBzZXRzQWRtaW5fcG9zLFxuICAgICAgcHNldHNVc2VyX3BvczogcHNldHNVc2VyX3BvcyxcbiAgICAgIHBzZXRzTWVtYmVyX3BvczogcHNldHNNZW1iZXJfcG9zLFxuICAgICAgcHNldHNHdWVzdF9wb3M6IHBzZXRzR3Vlc3RfcG9zLFxuICAgICAgcHNldHNTdXBwbGllcl9wb3M6IHBzZXRzU3VwcGxpZXJfcG9zLFxuICAgICAgcHNldHNDdXN0b21lcl9wb3M6IHBzZXRzQ3VzdG9tZXJfcG9zLFxuICAgICAgcHNldHNDdXJyZW50X3BvczogcHNldHNDdXJyZW50X3Bvc1xuICAgIH07XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfYXBwcyA9IENyZWF0b3IuZ2V0QXNzaWduZWRBcHBzLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgcGVybWlzc2lvbnMuYXNzaWduZWRfbWVudXMgPSBDcmVhdG9yLmdldEFzc2lnbmVkTWVudXMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkKTtcbiAgICBwZXJtaXNzaW9ucy51c2VyX3Blcm1pc3Npb25fc2V0cyA9IHBzZXRzQ3VycmVudE5hbWVzO1xuICAgIF9pID0gMDtcbiAgICBfLmVhY2goQ3JlYXRvci5vYmplY3RzQnlOYW1lLCBmdW5jdGlvbihvYmplY3QsIG9iamVjdF9uYW1lKSB7XG4gICAgICBfaSsrO1xuICAgICAgaWYgKCFfLmhhcyhvYmplY3QsICdzcGFjZScpIHx8ICFvYmplY3Quc3BhY2UgfHwgb2JqZWN0LnNwYWNlID09PSBzcGFjZUlkKSB7XG4gICAgICAgIGlmICghXy5oYXMob2JqZWN0LCAnaW5fZGV2ZWxvcG1lbnQnKSB8fCBvYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT09ICcwJyB8fCAob2JqZWN0LmluX2RldmVsb3BtZW50ICE9PSAnMCcgJiYgaXNTcGFjZUFkbWluKSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zLm9iamVjdHNbb2JqZWN0X25hbWVdID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tvYmplY3RfbmFtZV0pLCBzcGFjZUlkKTtcbiAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMub2JqZWN0c1tvYmplY3RfbmFtZV1bXCJwZXJtaXNzaW9uc1wiXSA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH07XG4gIHVuaW9uUGx1cyA9IGZ1bmN0aW9uKGFycmF5LCBvdGhlcikge1xuICAgIGlmICghYXJyYXkgJiYgIW90aGVyKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWFycmF5KSB7XG4gICAgICBhcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICBvdGhlciA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gXy51bmlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBpbnRlcnNlY3Rpb25QbHVzID0gZnVuY3Rpb24oYXJyYXksIG90aGVyKSB7XG4gICAgaWYgKCFhcnJheSAmJiAhb3RoZXIpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghYXJyYXkpIHtcbiAgICAgIGFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIG90aGVyID0gW107XG4gICAgfVxuICAgIHJldHVybiBfLmludGVyc2VjdGlvbihhcnJheSwgb3RoZXIpO1xuICB9O1xuICBleHRlbmRQZXJtaXNzaW9uUHJvcHMgPSBmdW5jdGlvbih0YXJnZXQsIHByb3BzKSB7XG4gICAgdmFyIGZpbGVzUHJvTmFtZXMsIHByb3BOYW1lcztcbiAgICBwcm9wTmFtZXMgPSBwZXJtaXNzaW9uUHJvcE5hbWVzO1xuICAgIHJldHVybiBmaWxlc1Byb05hbWVzID0gcHJvcHMgPyBfLmVhY2gocHJvcE5hbWVzLCBmdW5jdGlvbihwcm9wTmFtZSkge1xuICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgfSkgOiB2b2lkIDA7XG4gIH07XG4gIG92ZXJsYXlCYXNlQm9vbGVhblBlcm1pc3Npb25Qcm9wcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcHMpIHtcbiAgICB2YXIgcHJvcE5hbWVzO1xuICAgIHByb3BOYW1lcyA9IGJhc2VCb29sZWFuUGVybWlzc2lvblByb3BOYW1lcztcbiAgICByZXR1cm4gXy5lYWNoKHByb3BOYW1lcywgZnVuY3Rpb24ocHJvcE5hbWUpIHtcbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wTmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBDcmVhdG9yLmdldEFzc2lnbmVkQXBwcyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBhcHBzLCBpc1NwYWNlQWRtaW4sIHBzZXRCYXNlLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNDdXN0b21lciwgcHNldHNTdXBwbGllciwgcHNldHNVc2VyLCByZWYsIHJlZjEsIHNwYWNlVXNlciwgdXNlclByb2ZpbGU7XG4gICAgcHNldHNBZG1pbiA9IHRoaXMucHNldHNBZG1pbiB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ2FkbWluJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c1VzZXIgPSB0aGlzLnBzZXRzVXNlciB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgbmFtZTogJ3VzZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzU3VwcGxpZXIgPSB0aGlzLnBzZXRzTWVtYmVyIHx8IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSB0aGlzLnBzZXRzR3Vlc3QgfHwgQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICBpZiAodXNlcklkKSB7XG4gICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHNldHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgIH1cbiAgICBpc1NwYWNlQWRtaW4gPSBfLmlzQm9vbGVhbih0aGlzLmlzU3BhY2VBZG1pbikgPyB0aGlzLmlzU3BhY2VBZG1pbiA6IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgYXBwcyA9IFtdO1xuICAgIGlmIChpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlclByb2ZpbGUgPSAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICB9XG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZi5wcm9maWxlIDogdm9pZCAwO1xuICAgICAgcHNldEJhc2UgPSBwc2V0c1VzZXI7XG4gICAgICBpZiAodXNlclByb2ZpbGUpIHtcbiAgICAgICAgaWYgKHVzZXJQcm9maWxlID09PSAnc3VwcGxpZXInKSB7XG4gICAgICAgICAgcHNldEJhc2UgPSBwc2V0c1N1cHBsaWVyO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXJQcm9maWxlID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAgICAgcHNldEJhc2UgPSBwc2V0c0N1c3RvbWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHNldEJhc2UgIT0gbnVsbCA/IChyZWYxID0gcHNldEJhc2UuYXNzaWduZWRfYXBwcykgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXRCYXNlLmFzc2lnbmVkX2FwcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgXy5lYWNoKHBzZXRzLCBmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgIGlmICghcHNldC5hc3NpZ25lZF9hcHBzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwc2V0Lm5hbWUgPT09IFwiYWRtaW5cIiB8fCBwc2V0Lm5hbWUgPT09IFwidXNlclwiIHx8IHBzZXQubmFtZSA9PT0gJ3N1cHBsaWVyJyB8fCBwc2V0Lm5hbWUgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFwcHMgPSBfLnVuaW9uKGFwcHMsIHBzZXQuYXNzaWduZWRfYXBwcyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLndpdGhvdXQoXy51bmlxKGFwcHMpLCB2b2lkIDAsIG51bGwpO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRBc3NpZ25lZE1lbnVzID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGFib3V0TWVudSwgYWRtaW5NZW51cywgYWxsTWVudXMsIGN1cnJlbnRQc2V0TmFtZXMsIGlzU3BhY2VBZG1pbiwgbWVudXMsIG90aGVyTWVudUFwcHMsIG90aGVyTWVudXMsIHBzZXRzLCByZWYsIHJlZjEsIHJlc3VsdCwgdXNlclByb2ZpbGU7XG4gICAgcHNldHMgPSB0aGlzLnBzZXRzQ3VycmVudCB8fCBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgIG5hbWU6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGlzU3BhY2VBZG1pbiA9IF8uaXNCb29sZWFuKHRoaXMuaXNTcGFjZUFkbWluKSA/IHRoaXMuaXNTcGFjZUFkbWluIDogQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBhZG1pbk1lbnVzID0gKHJlZiA9IENyZWF0b3IuQXBwcy5hZG1pbikgIT0gbnVsbCA/IHJlZi5hZG1pbl9tZW51cyA6IHZvaWQgMDtcbiAgICBpZiAoIWFkbWluTWVudXMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgYWJvdXRNZW51ID0gYWRtaW5NZW51cy5maW5kKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLl9pZCA9PT0gJ2Fib3V0JztcbiAgICB9KTtcbiAgICBhZG1pbk1lbnVzID0gYWRtaW5NZW51cy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uX2lkICE9PSAnYWJvdXQnO1xuICAgIH0pO1xuICAgIG90aGVyTWVudUFwcHMgPSBfLnNvcnRCeShfLmZpbHRlcihfLnZhbHVlcyhDcmVhdG9yLkFwcHMpLCBmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5hZG1pbl9tZW51cyAmJiBuLl9pZCAhPT0gJ2FkbWluJztcbiAgICB9KSwgJ3NvcnQnKTtcbiAgICBvdGhlck1lbnVzID0gXy5mbGF0dGVuKF8ucGx1Y2sob3RoZXJNZW51QXBwcywgXCJhZG1pbl9tZW51c1wiKSk7XG4gICAgYWxsTWVudXMgPSBfLnVuaW9uKGFkbWluTWVudXMsIG90aGVyTWVudXMsIFthYm91dE1lbnVdKTtcbiAgICBpZiAoaXNTcGFjZUFkbWluKSB7XG4gICAgICByZXN1bHQgPSBhbGxNZW51cztcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlclByb2ZpbGUgPSAoKHJlZjEgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5wcm9maWxlIDogdm9pZCAwKSB8fCAndXNlcic7XG4gICAgICBjdXJyZW50UHNldE5hbWVzID0gcHNldHMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4ubmFtZTtcbiAgICAgIH0pO1xuICAgICAgbWVudXMgPSBhbGxNZW51cy5maWx0ZXIoZnVuY3Rpb24obWVudSkge1xuICAgICAgICB2YXIgcHNldHNNZW51O1xuICAgICAgICBwc2V0c01lbnUgPSBtZW51LnBlcm1pc3Npb25fc2V0cztcbiAgICAgICAgaWYgKHBzZXRzTWVudSAmJiBwc2V0c01lbnUuaW5kZXhPZih1c2VyUHJvZmlsZSkgPiAtMSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihjdXJyZW50UHNldE5hbWVzLCBwc2V0c01lbnUpLmxlbmd0aDtcbiAgICAgIH0pO1xuICAgICAgcmVzdWx0ID0gbWVudXM7XG4gICAgfVxuICAgIHJldHVybiBfLnNvcnRCeShyZXN1bHQsIFwic29ydFwiKTtcbiAgfTtcbiAgZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkKSB7XG4gICAgaWYgKF8uaXNOdWxsKHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KHBlcm1pc3Npb25fb2JqZWN0cykpIHtcbiAgICAgIHJldHVybiBfLmZpbmQocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZE9uZSh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDogcGVybWlzc2lvbl9zZXRfaWRcbiAgICB9KTtcbiAgfTtcbiAgZmluZF9wZXJtaXNzaW9uX29iamVjdCA9IGZ1bmN0aW9uKHBlcm1pc3Npb25fb2JqZWN0cywgb2JqZWN0X25hbWUsIHBlcm1pc3Npb25fc2V0X2lkcykge1xuICAgIGlmIChfLmlzTnVsbChwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShwZXJtaXNzaW9uX29iamVjdHMpKSB7XG4gICAgICByZXR1cm4gXy5maWx0ZXIocGVybWlzc2lvbl9vYmplY3RzLCBmdW5jdGlvbihwbykge1xuICAgICAgICByZXR1cm4gcG8ub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAkaW46IHBlcm1pc3Npb25fc2V0X2lkc1xuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gIH07XG4gIHVuaW9uUGVybWlzc2lvbk9iamVjdHMgPSBmdW5jdGlvbihwb3MsIG9iamVjdCwgcHNldHMpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIHJlc3VsdCA9IFtdO1xuICAgIF8uZWFjaChvYmplY3QucGVybWlzc2lvbl9zZXQsIGZ1bmN0aW9uKG9wcywgb3BzX2tleSkge1xuICAgICAgdmFyIGN1cnJlbnRQc2V0LCB0ZW1wT3BzO1xuICAgICAgaWYgKFtcImFkbWluXCIsIFwidXNlclwiLCBcIm1lbWJlclwiLCBcImd1ZXN0XCJdLmluZGV4T2Yob3BzX2tleSkgPCAwKSB7XG4gICAgICAgIGN1cnJlbnRQc2V0ID0gcHNldHMuZmluZChmdW5jdGlvbihwc2V0KSB7XG4gICAgICAgICAgcmV0dXJuIHBzZXQubmFtZSA9PT0gb3BzX2tleTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjdXJyZW50UHNldCkge1xuICAgICAgICAgIHRlbXBPcHMgPSBfLmNsb25lKG9wcykgfHwge307XG4gICAgICAgICAgdGVtcE9wcy5wZXJtaXNzaW9uX3NldF9pZCA9IGN1cnJlbnRQc2V0Ll9pZDtcbiAgICAgICAgICB0ZW1wT3BzLm9iamVjdF9uYW1lID0gb2JqZWN0Lm9iamVjdF9uYW1lO1xuICAgICAgICAgIHJldHVybiByZXN1bHQucHVzaCh0ZW1wT3BzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XG4gICAgICBwb3MuZm9yRWFjaChmdW5jdGlvbihwbykge1xuICAgICAgICB2YXIgcmVwZWF0SW5kZXgsIHJlcGVhdFBvO1xuICAgICAgICByZXBlYXRJbmRleCA9IDA7XG4gICAgICAgIHJlcGVhdFBvID0gcmVzdWx0LmZpbmQoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICByZXBlYXRJbmRleCA9IGluZGV4O1xuICAgICAgICAgIHJldHVybiBpdGVtLnBlcm1pc3Npb25fc2V0X2lkID09PSBwby5wZXJtaXNzaW9uX3NldF9pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZXBlYXRQbykge1xuICAgICAgICAgIHJldHVybiByZXN1bHRbcmVwZWF0SW5kZXhdID0gcG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKHBvKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcG9zO1xuICAgIH1cbiAgfTtcbiAgQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgaXNTcGFjZUFkbWluLCBvYmplY3QsIG9wc2V0QWRtaW4sIG9wc2V0Q3VzdG9tZXIsIG9wc2V0R3Vlc3QsIG9wc2V0TWVtYmVyLCBvcHNldFN1cHBsaWVyLCBvcHNldFVzZXIsIHBlcm1pc3Npb25zLCBwb3MsIHBvc0FkbWluLCBwb3NDdXN0b21lciwgcG9zR3Vlc3QsIHBvc01lbWJlciwgcG9zU3VwcGxpZXIsIHBvc1VzZXIsIHByb2YsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCBzZXRfaWRzLCBzcGFjZVVzZXI7XG4gICAgcGVybWlzc2lvbnMgPSB7fTtcbiAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSwgc3BhY2VJZCk7XG4gICAgaWYgKHNwYWNlSWQgPT09ICdndWVzdCcgfHwgb2JqZWN0X25hbWUgPT09IFwidXNlcnNcIikge1xuICAgICAgcGVybWlzc2lvbnMgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5ndWVzdCkgfHwge307XG4gICAgICBDcmVhdG9yLnByb2Nlc3NQZXJtaXNzaW9ucyhwZXJtaXNzaW9ucyk7XG4gICAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gICAgfVxuICAgIHBzZXRzQWRtaW4gPSBfLmlzTnVsbCh0aGlzLnBzZXRzQWRtaW4pIHx8IHRoaXMucHNldHNBZG1pbiA/IHRoaXMucHNldHNBZG1pbiA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnYWRtaW4nXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzVXNlciA9IF8uaXNOdWxsKHRoaXMucHNldHNVc2VyKSB8fCB0aGlzLnBzZXRzVXNlciA/IHRoaXMucHNldHNVc2VyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c01lbWJlciA9IF8uaXNOdWxsKHRoaXMucHNldHNNZW1iZXIpIHx8IHRoaXMucHNldHNNZW1iZXIgPyB0aGlzLnBzZXRzTWVtYmVyIDogQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzR3Vlc3QgPSBfLmlzTnVsbCh0aGlzLnBzZXRzR3Vlc3QpIHx8IHRoaXMucHNldHNHdWVzdCA/IHRoaXMucHNldHNHdWVzdCA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzU3VwcGxpZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzU3VwcGxpZXIpIHx8IHRoaXMucHNldHNTdXBwbGllciA/IHRoaXMucHNldHNTdXBwbGllciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzQ3VzdG9tZXIgPSBfLmlzTnVsbCh0aGlzLnBzZXRzQ3VzdG9tZXIpIHx8IHRoaXMucHNldHNDdXN0b21lciA/IHRoaXMucHNldHNDdXN0b21lciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIHBzZXRzID0gdGhpcy5wc2V0c0N1cnJlbnQ7XG4gICAgaWYgKCFwc2V0cykge1xuICAgICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgICBwc2V0cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICRvcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBzZXRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaXNTcGFjZUFkbWluID0gXy5pc0Jvb2xlYW4odGhpcy5pc1NwYWNlQWRtaW4pID8gdGhpcy5pc1NwYWNlQWRtaW4gOiBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIHBzZXRzQWRtaW5fcG9zID0gdGhpcy5wc2V0c0FkbWluX3BvcztcbiAgICBwc2V0c1VzZXJfcG9zID0gdGhpcy5wc2V0c1VzZXJfcG9zO1xuICAgIHBzZXRzTWVtYmVyX3BvcyA9IHRoaXMucHNldHNNZW1iZXJfcG9zO1xuICAgIHBzZXRzR3Vlc3RfcG9zID0gdGhpcy5wc2V0c0d1ZXN0X3BvcztcbiAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IHRoaXMucHNldHNTdXBwbGllcl9wb3M7XG4gICAgcHNldHNDdXN0b21lcl9wb3MgPSB0aGlzLnBzZXRzQ3VzdG9tZXJfcG9zO1xuICAgIHBzZXRzQ3VycmVudF9wb3MgPSB0aGlzLnBzZXRzQ3VycmVudF9wb3M7XG4gICAgb3BzZXRBZG1pbiA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0LmFkbWluKSB8fCB7fTtcbiAgICBvcHNldFVzZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC51c2VyKSB8fCB7fTtcbiAgICBvcHNldE1lbWJlciA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm1lbWJlcikgfHwge307XG4gICAgb3BzZXRHdWVzdCA9IF8uY2xvbmUob2JqZWN0LnBlcm1pc3Npb25fc2V0Lmd1ZXN0KSB8fCB7fTtcbiAgICBvcHNldFN1cHBsaWVyID0gXy5jbG9uZShvYmplY3QucGVybWlzc2lvbl9zZXQuc3VwcGxpZXIpIHx8IHt9O1xuICAgIG9wc2V0Q3VzdG9tZXIgPSBfLmNsb25lKG9iamVjdC5wZXJtaXNzaW9uX3NldC5jdXN0b21lcikgfHwge307XG4gICAgaWYgKHBzZXRzQWRtaW4pIHtcbiAgICAgIHBvc0FkbWluID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0FkbWluX3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzQWRtaW4uX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldEFkbWluLCBwb3NBZG1pbik7XG4gICAgfVxuICAgIGlmIChwc2V0c1VzZXIpIHtcbiAgICAgIHBvc1VzZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzVXNlcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1VzZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldFVzZXIsIHBvc1VzZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNNZW1iZXIpIHtcbiAgICAgIHBvc01lbWJlciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNNZW1iZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNNZW1iZXIuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldE1lbWJlciwgcG9zTWVtYmVyKTtcbiAgICB9XG4gICAgaWYgKHBzZXRzR3Vlc3QpIHtcbiAgICAgIHBvc0d1ZXN0ID0gZmluZE9uZV9wZXJtaXNzaW9uX29iamVjdChwc2V0c0d1ZXN0X3Bvcywgb2JqZWN0X25hbWUsIHBzZXRzR3Vlc3QuX2lkKTtcbiAgICAgIGV4dGVuZFBlcm1pc3Npb25Qcm9wcyhvcHNldEd1ZXN0LCBwb3NHdWVzdCk7XG4gICAgfVxuICAgIGlmIChwc2V0c1N1cHBsaWVyKSB7XG4gICAgICBwb3NTdXBwbGllciA9IGZpbmRPbmVfcGVybWlzc2lvbl9vYmplY3QocHNldHNTdXBwbGllcl9wb3MsIG9iamVjdF9uYW1lLCBwc2V0c1N1cHBsaWVyLl9pZCk7XG4gICAgICBleHRlbmRQZXJtaXNzaW9uUHJvcHMob3BzZXRTdXBwbGllciwgcG9zU3VwcGxpZXIpO1xuICAgIH1cbiAgICBpZiAocHNldHNDdXN0b21lcikge1xuICAgICAgcG9zQ3VzdG9tZXIgPSBmaW5kT25lX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VzdG9tZXJfcG9zLCBvYmplY3RfbmFtZSwgcHNldHNDdXN0b21lci5faWQpO1xuICAgICAgZXh0ZW5kUGVybWlzc2lvblByb3BzKG9wc2V0Q3VzdG9tZXIsIHBvc0N1c3RvbWVyKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRBZG1pbjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzU3BhY2VBZG1pbikge1xuICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0QWRtaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3BhY2VJZCA9PT0gJ2NvbW1vbicpIHtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGFjZVVzZXIgPSBfLmlzTnVsbCh0aGlzLnNwYWNlVXNlcikgfHwgdGhpcy5zcGFjZVVzZXIgPyB0aGlzLnNwYWNlVXNlciA6IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChzcGFjZVVzZXIpIHtcbiAgICAgICAgICAgIHByb2YgPSBzcGFjZVVzZXIucHJvZmlsZTtcbiAgICAgICAgICAgIGlmIChwcm9mKSB7XG4gICAgICAgICAgICAgIGlmIChwcm9mID09PSAndXNlcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0VXNlcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnbWVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRNZW1iZXI7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZiA9PT0gJ2d1ZXN0Jykge1xuICAgICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRHdWVzdDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9mID09PSAnc3VwcGxpZXInKSB7XG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBvcHNldFN1cHBsaWVyO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2YgPT09ICdjdXN0b21lcicpIHtcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0Q3VzdG9tZXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gb3BzZXRVc2VyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG9wc2V0R3Vlc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0cywgXCJfaWRcIik7XG4gICAgICBwb3MgPSBmaW5kX3Blcm1pc3Npb25fb2JqZWN0KHBzZXRzQ3VycmVudF9wb3MsIG9iamVjdF9uYW1lLCBzZXRfaWRzKTtcbiAgICAgIHBvcyA9IHVuaW9uUGVybWlzc2lvbk9iamVjdHMocG9zLCBvYmplY3QsIHBzZXRzKTtcbiAgICAgIF8uZWFjaChwb3MsIGZ1bmN0aW9uKHBvKSB7XG4gICAgICAgIGlmIChwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkgfHwgcG8ucGVybWlzc2lvbl9zZXRfaWQgPT09IChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB8fCBwby5wZXJtaXNzaW9uX3NldF9pZCA9PT0gKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pc0VtcHR5KHBlcm1pc3Npb25zKSkge1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gcG87XG4gICAgICAgIH1cbiAgICAgICAgb3ZlcmxheUJhc2VCb29sZWFuUGVybWlzc2lvblByb3BzKHBlcm1pc3Npb25zLCBwbyk7XG4gICAgICAgIHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLmRpc2FibGVkX2xpc3Rfdmlld3MsIHBvLmRpc2FibGVkX2xpc3Rfdmlld3MpO1xuICAgICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zLCBwby5kaXNhYmxlZF9hY3Rpb25zKTtcbiAgICAgICAgcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMgPSBpbnRlcnNlY3Rpb25QbHVzKHBlcm1pc3Npb25zLnVucmVhZGFibGVfZmllbGRzLCBwby51bnJlYWRhYmxlX2ZpZWxkcyk7XG4gICAgICAgIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfZmllbGRzID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgcG8udW5lZGl0YWJsZV9maWVsZHMpO1xuICAgICAgICBwZXJtaXNzaW9ucy51bnJlbGF0ZWRfb2JqZWN0cyA9IGludGVyc2VjdGlvblBsdXMocGVybWlzc2lvbnMudW5yZWxhdGVkX29iamVjdHMsIHBvLnVucmVsYXRlZF9vYmplY3RzKTtcbiAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLnVuZWRpdGFibGVfcmVsYXRlZF9saXN0ID0gaW50ZXJzZWN0aW9uUGx1cyhwZXJtaXNzaW9ucy51bmVkaXRhYmxlX3JlbGF0ZWRfbGlzdCwgcG8udW5lZGl0YWJsZV9yZWxhdGVkX2xpc3QpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChvYmplY3QuaXNfdmlldykge1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dDcmVhdGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLmFsbG93RWRpdCA9IGZhbHNlO1xuICAgICAgcGVybWlzc2lvbnMuYWxsb3dEZWxldGUgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUFsbFJlY29yZHMgPSBmYWxzZTtcbiAgICAgIHBlcm1pc3Npb25zLm1vZGlmeUNvbXBhbnlSZWNvcmRzID0gZmFsc2U7XG4gICAgICBwZXJtaXNzaW9ucy5kaXNhYmxlZF9hY3Rpb25zID0gW107XG4gICAgfVxuICAgIENyZWF0b3IucHJvY2Vzc1Blcm1pc3Npb25zKHBlcm1pc3Npb25zKTtcbiAgICBpZiAob2JqZWN0LnBlcm1pc3Npb25fc2V0Lm93bmVyKSB7XG4gICAgICBwZXJtaXNzaW9ucy5vd25lciA9IG9iamVjdC5wZXJtaXNzaW9uX3NldC5vd25lcjtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9O1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgXCJjcmVhdG9yLm9iamVjdF9wZXJtaXNzaW9uc1wiOiBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB0aGlzLnVzZXJJZCk7XG4gICAgfVxuICB9KTtcbn1cbiIsIlxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJylcblxuTWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRjcmVhdG9yX2RiX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX1VSTF9DUkVBVE9SXG5cdG9wbG9nX3VybCA9IHByb2Nlc3MuZW52Lk1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXG5cdGlmIGNyZWF0b3JfZGJfdXJsXG5cdFx0aWYgIW9wbG9nX3VybFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwiUGxlYXNlIGNvbmZpZ3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXM6IE1PTkdPX09QTE9HX1VSTF9DUkVBVE9SXCIpXG5cdFx0Q3JlYXRvci5fQ1JFQVRPUl9EQVRBU09VUkNFID0ge19kcml2ZXI6IG5ldyBNb25nb0ludGVybmFscy5SZW1vdGVDb2xsZWN0aW9uRHJpdmVyKGNyZWF0b3JfZGJfdXJsLCB7b3Bsb2dVcmw6IG9wbG9nX3VybH0pfVxuXG5DcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lID0gKG9iamVjdCktPlxuI1x0aWYgb2JqZWN0LnRhYmxlX25hbWUgJiYgb2JqZWN0LnRhYmxlX25hbWUuZW5kc1dpdGgoXCJfX2NcIilcbiNcdFx0cmV0dXJuIG9iamVjdC50YWJsZV9uYW1lXG4jXHRlbHNlXG4jXHRcdHJldHVybiBvYmplY3QubmFtZVxuXHRyZXR1cm4gb2JqZWN0Lm5hbWVcbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IChvYmplY3QpLT5cblx0Y29sbGVjdGlvbl9rZXkgPSBDcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lKG9iamVjdClcblx0aWYgZGJbY29sbGVjdGlvbl9rZXldXG5cdFx0cmV0dXJuIGRiW2NvbGxlY3Rpb25fa2V5XVxuXHRlbHNlIGlmIG9iamVjdC5kYlxuXHRcdHJldHVybiBvYmplY3QuZGJcblxuXHRpZiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxuXHRcdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XVxuXHRlbHNlXG5cdFx0aWYgb2JqZWN0LmN1c3RvbVxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSlcblx0XHRlbHNlXG5cdFx0XHRpZiBjb2xsZWN0aW9uX2tleSA9PSAnX3Ntc19xdWV1ZScgJiYgU01TUXVldWU/LmNvbGxlY3Rpb25cblx0XHRcdFx0cmV0dXJuIFNNU1F1ZXVlLmNvbGxlY3Rpb25cblx0XHRcdHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5KVxuXG5cbiIsInZhciBzdGVlZG9zQ29yZTtcblxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKCdAc3RlZWRvcy9jb3JlJyk7XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRvcl9kYl91cmwsIG9wbG9nX3VybDtcbiAgY3JlYXRvcl9kYl91cmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkxfQ1JFQVRPUjtcbiAgb3Bsb2dfdXJsID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BMT0dfVVJMX0NSRUFUT1I7XG4gIGlmIChjcmVhdG9yX2RiX3VybCkge1xuICAgIGlmICghb3Bsb2dfdXJsKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJQbGVhc2UgY29uZmlndXJlIGVudmlyb25tZW50IHZhcmlhYmxlczogTU9OR09fT1BMT0dfVVJMX0NSRUFUT1JcIik7XG4gICAgfVxuICAgIHJldHVybiBDcmVhdG9yLl9DUkVBVE9SX0RBVEFTT1VSQ0UgPSB7XG4gICAgICBfZHJpdmVyOiBuZXcgTW9uZ29JbnRlcm5hbHMuUmVtb3RlQ29sbGVjdGlvbkRyaXZlcihjcmVhdG9yX2RiX3VybCwge1xuICAgICAgICBvcGxvZ1VybDogb3Bsb2dfdXJsXG4gICAgICB9KVxuICAgIH07XG4gIH1cbn0pO1xuXG5DcmVhdG9yLmdldENvbGxlY3Rpb25OYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBvYmplY3QubmFtZTtcbn07XG5cbkNyZWF0b3IuY3JlYXRlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgY29sbGVjdGlvbl9rZXk7XG4gIGNvbGxlY3Rpb25fa2V5ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uTmFtZShvYmplY3QpO1xuICBpZiAoZGJbY29sbGVjdGlvbl9rZXldKSB7XG4gICAgcmV0dXJuIGRiW2NvbGxlY3Rpb25fa2V5XTtcbiAgfSBlbHNlIGlmIChvYmplY3QuZGIpIHtcbiAgICByZXR1cm4gb2JqZWN0LmRiO1xuICB9XG4gIGlmIChDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XSkge1xuICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW2NvbGxlY3Rpb25fa2V5XTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqZWN0LmN1c3RvbSkge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NDb3JlLm5ld0NvbGxlY3Rpb24oY29sbGVjdGlvbl9rZXksIENyZWF0b3IuX0NSRUFUT1JfREFUQVNPVVJDRSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb2xsZWN0aW9uX2tleSA9PT0gJ19zbXNfcXVldWUnICYmICh0eXBlb2YgU01TUXVldWUgIT09IFwidW5kZWZpbmVkXCIgJiYgU01TUXVldWUgIT09IG51bGwgPyBTTVNRdWV1ZS5jb2xsZWN0aW9uIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm4gU01TUXVldWUuY29sbGVjdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGVlZG9zQ29yZS5uZXdDb2xsZWN0aW9uKGNvbGxlY3Rpb25fa2V5KTtcbiAgICB9XG4gIH1cbn07XG4iLCJDcmVhdG9yLmFjdGlvbnNCeU5hbWUgPSB7fVxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0c3RlZWRvc0ZpbHRlcnMgPSByZXF1aXJlKFwiQHN0ZWVkb3MvZmlsdGVyc1wiKTtcblx0IyDlrprkuYnlhajlsYAgYWN0aW9ucyDlh73mlbBcdFxuXHRDcmVhdG9yLmFjdGlvbnMgPSAoYWN0aW9ucyktPlxuXHRcdF8uZWFjaCBhY3Rpb25zLCAodG9kbywgYWN0aW9uX25hbWUpLT5cblx0XHRcdENyZWF0b3IuYWN0aW9uc0J5TmFtZVthY3Rpb25fbmFtZV0gPSB0b2RvIFxuXG5cdENyZWF0b3IuZXhlY3V0ZUFjdGlvbiA9IChvYmplY3RfbmFtZSwgYWN0aW9uLCByZWNvcmRfaWQsIGl0ZW1fZWxlbWVudCwgbGlzdF92aWV3X2lkLCByZWNvcmQpLT5cblx0XHRpZiBhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT0gJ3dvcmQtcHJpbnQnXG5cdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0ZmlsdGVycyA9IFsnX2lkJywgJz0nLCByZWNvcmRfaWRdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGZpbHRlcnMgPSBPYmplY3RHcmlkLmdldEZpbHRlcnMob2JqZWN0X25hbWUsIGxpc3Rfdmlld19pZCwgZmFsc2UsIG51bGwsIG51bGwpXG5cdFx0XHR1cmwgPSBcIi9hcGkvdjQvd29yZF90ZW1wbGF0ZXMvXCIgKyBhY3Rpb24ud29yZF90ZW1wbGF0ZSArIFwiL3ByaW50XCIgKyBcIj9maWx0ZXJzPVwiICsgc3RlZWRvc0ZpbHRlcnMuZm9ybWF0RmlsdGVyc1RvT0RhdGFRdWVyeShmaWx0ZXJzKTtcblx0XHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcblx0XHRcdHJldHVybiB3aW5kb3cub3Blbih1cmwpO1xuXG5cdFx0b2JqID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpXG5cdFx0aWYgYWN0aW9uPy50b2RvXG5cdFx0XHRpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJzdHJpbmdcIlxuXHRcdFx0XHR0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXVxuXHRcdFx0ZWxzZSBpZiB0eXBlb2YgYWN0aW9uLnRvZG8gPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdHRvZG8gPSBhY3Rpb24udG9kb1x0XG5cdFx0XHRpZiAhcmVjb3JkICYmIG9iamVjdF9uYW1lICYmIHJlY29yZF9pZFxuXHRcdFx0XHRyZWNvcmQgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKVxuXHRcdFx0aWYgdG9kb1xuXHRcdFx0XHQjIGl0ZW1fZWxlbWVudOS4uuepuuaXtuW6lOivpeiuvue9rum7mOiupOWAvO+8iOWvueixoeeahG5hbWXlrZfmrrXvvInvvIzlkKbliJltb3JlQXJnc+aLv+WIsOeahOWQjue7reWPguaVsOS9jee9ruWwseS4jeWvuVxuXHRcdFx0XHRpdGVtX2VsZW1lbnQgPSBpZiBpdGVtX2VsZW1lbnQgdGhlbiBpdGVtX2VsZW1lbnQgZWxzZSBcIlwiXG5cdFx0XHRcdG1vcmVBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxuXHRcdFx0XHR0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpXG5cdFx0XHRcdHRvZG8uYXBwbHkge1xuXHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZVxuXHRcdFx0XHRcdHJlY29yZF9pZDogcmVjb3JkX2lkXG5cdFx0XHRcdFx0b2JqZWN0OiBvYmpcblx0XHRcdFx0XHRhY3Rpb246IGFjdGlvblxuXHRcdFx0XHRcdGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50XG5cdFx0XHRcdFx0cmVjb3JkOiByZWNvcmRcblx0XHRcdFx0fSwgdG9kb0FyZ3Ncblx0XHRcdGVsc2Vcblx0XHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXG5cdFx0ZWxzZVxuXHRcdFx0dG9hc3RyLndhcm5pbmcodChcIl9vYmplY3RfYWN0aW9uc19ub25lX3RvZG9cIikpXG5cblx0XHRcdFx0XG5cblx0Q3JlYXRvci5hY3Rpb25zIFxuXHRcdCMg5Zyo5q2k5a6a5LmJ5YWo5bGAIGFjdGlvbnNcblx0XHRcInN0YW5kYXJkX3F1ZXJ5XCI6ICgpLT5cblx0XHRcdE1vZGFsLnNob3coXCJzdGFuZGFyZF9xdWVyeV9tb2RhbFwiKVxuXG5cdFx0XCJzdGFuZGFyZF9uZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0I1RPRE8g5L2/55So5a+56LGh54mI5pys5Yik5patXG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG5cdFx0XHRpbml0aWFsVmFsdWVzPXt9XG5cdFx0XHRzZWxlY3RlZFJvd3MgPSB3aW5kb3cuZ3JpZFJlZj8uY3VycmVudD8uYXBpPy5nZXRTZWxlY3RlZFJvd3MoKVx0XG5cdFx0XHRpZiBzZWxlY3RlZFJvd3M/Lmxlbmd0aFxuXHRcdFx0XHRyZWNvcmRfaWQgPSBzZWxlY3RlZFJvd3NbMF0uX2lkO1xuXHRcdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0XHRpbml0aWFsVmFsdWVzID0gQ3JlYXRvci5vZGF0YS5nZXQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbml0aWFsVmFsdWVzID0gRm9ybU1hbmFnZXIuZ2V0SW5pdGlhbFZhbHVlcyhvYmplY3RfbmFtZSlcblxuXHRcdFx0aWYgb2JqZWN0Py52ZXJzaW9uID49IDJcblx0XHRcdFx0cmV0dXJuIFN0ZWVkb3NVSS5zaG93TW9kYWwoc3RvcmVzLkNvbXBvbmVudFJlZ2lzdHJ5LmNvbXBvbmVudHMuT2JqZWN0Rm9ybSwge1xuXHRcdFx0XHRcdG5hbWU6IFwiI3tvYmplY3RfbmFtZX1fc3RhbmRhcmRfbmV3X2Zvcm1cIixcblx0XHRcdFx0XHRvYmplY3RBcGlOYW1lOiBvYmplY3RfbmFtZSxcblx0XHRcdFx0XHR0aXRsZTogJ+aWsOW7uicsXG5cdFx0XHRcdFx0aW5pdGlhbFZhbHVlczogaW5pdGlhbFZhbHVlcyxcblx0XHRcdFx0XHRhZnRlckluc2VydDogKHJlc3VsdCktPlxuXHRcdFx0XHRcdFx0aWYocmVzdWx0Lmxlbmd0aCA+IDApXG5cdFx0XHRcdFx0XHRcdHJlY29yZCA9IHJlc3VsdFswXTtcblx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKS0+XG5cdFx0XHRcdFx0XHRcdFx0YXBwX2lkID0gU2Vzc2lvbi5nZXQoXCJhcHBfaWRcIilcblx0XHRcdFx0XHRcdFx0XHR1cmwgPSBcIi9hcHAvI3thcHBfaWR9LyN7b2JqZWN0X25hbWV9L3ZpZXcvI3tyZWNvcmQuX2lkfVwiXG5cdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5nbyB1cmxcblx0XHRcdFx0XHRcdFx0LCAxKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHRcdFx0fSwgbnVsbCwge2ljb25QYXRoOiAnL2Fzc2V0cy9pY29ucyd9KVxuXHRcdFx0U2Vzc2lvbi5zZXQgJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lXG5cdFx0XHRpZiBzZWxlY3RlZFJvd3M/Lmxlbmd0aFxuXHRcdFx0XHQjIOWIl+ihqOaciemAieS4remhueaXtu+8jOWPluesrOS4gOS4qumAieS4remhue+8jOWkjeWItuWFtuWGheWuueWIsOaWsOW7uueql+WPo+S4rVxuXHRcdFx0XHQjIOi/meeahOesrOS4gOS4quaMh+eahOaYr+esrOS4gOasoeWLvumAieeahOmAieS4remhue+8jOiAjOS4jeaYr+WIl+ihqOS4reW3suWLvumAieeahOesrOS4gOmhuVxuXHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCBpbml0aWFsVmFsdWVzXG5cdFx0XHRcdCMg4oCc5L+d5a2Y5bm25paw5bu64oCd5pON5L2c5Lit6Ieq5Yqo5omT5byA55qE5paw56qX5Y+j5Lit6ZyA6KaB5YaN5qyh5aSN5Yi25pyA5paw55qEZG9j5YaF5a655Yiw5paw56qX5Y+j5LitXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbVNob3dBZ2FpbkR1cGxpY2F0ZWQnLCB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdFNlc3Npb24uc2V0ICdjbURvYycsIGluaXRpYWxWYWx1ZXNcblx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdCQoXCIuY3JlYXRvci1hZGRcIikuY2xpY2soKVxuXHRcdFx0cmV0dXJuIFxuXG5cdFx0XCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIGZpZWxkcyktPlxuXHRcdFx0aHJlZiA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpXG5cdFx0XHRGbG93Um91dGVyLnJlZGlyZWN0KGhyZWYpXG5cdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdFwic3RhbmRhcmRfZWRpdFwiOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKS0+XG5cdFx0XHRpZiByZWNvcmRfaWRcblx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUpO1xuXHRcdFx0XHRpZiBvYmplY3Q/LnZlcnNpb24gPj0gMlxuXHRcdFx0XHRcdHJldHVybiBTdGVlZG9zVUkuc2hvd01vZGFsKHN0b3Jlcy5Db21wb25lbnRSZWdpc3RyeS5jb21wb25lbnRzLk9iamVjdEZvcm0sIHtcblx0XHRcdFx0XHRcdG5hbWU6IFwiI3tvYmplY3RfbmFtZX1fc3RhbmRhcmRfZWRpdF9mb3JtXCIsXG5cdFx0XHRcdFx0XHRvYmplY3RBcGlOYW1lOiBvYmplY3RfbmFtZSxcblx0XHRcdFx0XHRcdHJlY29yZElkOiByZWNvcmRfaWQsXG5cdFx0XHRcdFx0XHR0aXRsZTogJ+e8lui+kScsXG5cdFx0XHRcdFx0XHRhZnRlclVwZGF0ZTogKCktPlxuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpLT5cblx0XHRcdFx0XHRcdFx0XHRpZiBGbG93Um91dGVyLmN1cnJlbnQoKS5yb3V0ZS5wYXRoLmVuZHNXaXRoKFwiLzpyZWNvcmRfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKClcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVmcmVzaEdyaWQoKTtcblx0XHRcdFx0XHRcdFx0LCAxKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSwgbnVsbCwge2ljb25QYXRoOiAnL2Fzc2V0cy9pY29ucyd9KVxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKCkgJiYgZmFsc2VcbiNcdFx0XHRcdFx0cmVjb3JkID0gQ3JlYXRvci5nZXRPYmplY3RSZWNvcmQob2JqZWN0X25hbWUsIHJlY29yZF9pZClcbiNcdFx0XHRcdFx0U2Vzc2lvbi5zZXQgJ2NtRG9jJywgcmVjb3JkXG4jXHRcdFx0XHRcdFNlc3Npb24uc2V0ICdyZWxvYWRfZHhsaXN0JywgZmFsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdE1ldGVvci5kZWZlciAoKS0+XG5cdFx0XHRcdFx0XHQkKFwiLmJ0bi1lZGl0LXJlY29yZFwiKS5jbGljaygpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX29iamVjdF9uYW1lJywgb2JqZWN0X25hbWVcblx0XHRcdFx0XHRTZXNzaW9uLnNldCAnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZFxuXHRcdFx0XHRcdGlmIHRoaXMucmVjb3JkXG5cdFx0XHRcdFx0XHRTZXNzaW9uLnNldCAnY21Eb2MnLCB0aGlzLnJlY29yZFxuXHRcdFx0XHRcdFx0TWV0ZW9yLmRlZmVyICgpLT5cblx0XHRcdFx0XHRcdFx0JChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKClcblxuXHRcdFwic3RhbmRhcmRfZGVsZXRlXCI6IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfdGl0bGUsIGxpc3Rfdmlld19pZCwgcmVjb3JkLCBjYWxsX2JhY2spLT5cblx0XHRcdGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtfaWQ6IHJlY29yZF9pZH0pXG5cdFx0XHRpZiAhYmVmb3JlSG9va1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSlcblxuXHRcdFx0aWYoIV8uaXNTdHJpbmcocmVjb3JkX3RpdGxlKSAmJiByZWNvcmRfdGl0bGU/Lm5hbWUpXG5cdFx0XHRcdHJlY29yZF90aXRsZSA9IHJlY29yZF90aXRsZT8ubmFtZVxuXG5cdFx0XHRpZiByZWNvcmRfdGl0bGVcblx0XHRcdFx0dGV4dCA9IHQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCIsIFwiI3tvYmplY3QubGFiZWx9IFxcXCIje3JlY29yZF90aXRsZX1cXFwiXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGV4dCA9IHQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCIsIFwiI3tvYmplY3QubGFiZWx9XCJcblx0XHRcdHN3YWxcblx0XHRcdFx0dGl0bGU6IHQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZVwiLCBcIiN7b2JqZWN0LmxhYmVsfVwiXG5cdFx0XHRcdHRleHQ6IFwiPGRpdiBjbGFzcz0nZGVsZXRlLWNyZWF0b3Itd2FybmluZyc+I3t0ZXh0fTwvZGl2PlwiXG5cdFx0XHRcdGh0bWw6IHRydWVcblx0XHRcdFx0c2hvd0NhbmNlbEJ1dHRvbjp0cnVlXG5cdFx0XHRcdGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKVxuXHRcdFx0XHRjYW5jZWxCdXR0b25UZXh0OiB0KCdDYW5jZWwnKVxuXHRcdFx0XHQob3B0aW9uKSAtPlxuXHRcdFx0XHRcdGlmIG9wdGlvblxuXHRcdFx0XHRcdFx0cHJldmlvdXNEb2MgPSBGb3JtTWFuYWdlci5nZXRQcmV2aW91c0RvYyhvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCAnZGVsZXRlJylcblx0XHRcdFx0XHRcdENyZWF0b3Iub2RhdGEuZGVsZXRlIG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICgpLT5cblx0XHRcdFx0XHRcdFx0aWYgcmVjb3JkX3RpdGxlXG5cdFx0XHRcdFx0XHRcdFx0IyBpbmZvID0gb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiICsgXCLlt7LliKDpmaRcIlxuXHRcdFx0XHRcdFx0XHRcdGluZm8gPXQgXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90aXRsZV9zdWNcIiwgb2JqZWN0LmxhYmVsICsgXCJcXFwiI3tyZWNvcmRfdGl0bGV9XFxcIlwiXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRpbmZvID0gdCgnY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfc3VjJylcblx0XHRcdFx0XHRcdFx0dG9hc3RyLnN1Y2Nlc3MgaW5mb1xuXHRcdFx0XHRcdFx0XHQjIOaWh+S7tueJiOacrOS4ulwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIu+8jOmcgOimgeabv+aNouS4ulwiY2ZzLWZpbGVzLWZpbGVyZWNvcmRcIlxuXHRcdFx0XHRcdFx0XHRncmlkT2JqZWN0TmFtZUNsYXNzID0gb2JqZWN0X25hbWUucmVwbGFjZSgvXFwuL2csXCItXCIpXG5cdFx0XHRcdFx0XHRcdGdyaWRDb250YWluZXIgPSAkKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxuXHRcdFx0XHRcdFx0XHR1bmxlc3MgZ3JpZENvbnRhaW5lcj8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0aWYgd2luZG93Lm9wZW5lclxuXHRcdFx0XHRcdFx0XHRcdFx0aXNPcGVuZXJSZW1vdmUgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0XHRncmlkQ29udGFpbmVyID0gd2luZG93Lm9wZW5lci4kKFwiLmdyaWRDb250YWluZXIuI3tncmlkT2JqZWN0TmFtZUNsYXNzfVwiKVxuXHRcdFx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdFx0XHRpZiBGbG93Um91dGVyLmN1cnJlbnQoKS5yb3V0ZS5wYXRoLmVuZHNXaXRoKFwiLzpyZWNvcmRfaWRcIilcblx0XHRcdFx0XHRcdFx0XHRcdGlmIG9iamVjdF9uYW1lICE9IFNlc3Npb24uZ2V0KFwib2JqZWN0X25hbWVcIilcblx0XHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5yZWxvYWQoKTtcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cucmVmcmVzaEdyaWQoKTtcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggX2Vcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKF9lKTtcblx0XHRcdFx0XHRcdFx0aWYgZ3JpZENvbnRhaW5lcj8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0LmVuYWJsZV90cmVlXG5cdFx0XHRcdFx0XHRcdFx0XHRkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4VHJlZUxpc3QoKS5keFRyZWVMaXN0KCdpbnN0YW5jZScpXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0ZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keERhdGFHcmlkKCkuZHhEYXRhR3JpZCgnaW5zdGFuY2UnKVxuXHRcdFx0XHRcdFx0XHRpZiBkeERhdGFHcmlkSW5zdGFuY2Vcblx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3QuZW5hYmxlX3RyZWVcblx0XHRcdFx0XHRcdFx0XHRcdGR4RGF0YUdyaWRJbnN0YW5jZS5yZWZyZXNoKClcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvYmplY3RfbmFtZSAhPSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFRlbXBsYXRlLmNyZWF0b3JfZ3JpZC5yZWZyZXNoKGR4RGF0YUdyaWRJbnN0YW5jZSlcblx0XHRcdFx0XHRcdFx0cmVjb3JkVXJsID0gQ3JlYXRvci5nZXRPYmplY3RVcmwob2JqZWN0X25hbWUsIHJlY29yZF9pZClcblx0XHRcdFx0XHRcdFx0dGVtcE5hdlJlbW92ZWQgPSBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpICPml6DorrrmmK/lnKjorrDlvZXor6bnu4bnlYzpnaLov5jmmK/liJfooajnlYzpnaLmiafooYzliKDpmaTmk43kvZzvvIzpg73kvJrmiorkuLTml7blr7zoiKrliKDpmaTmjolcblx0XHRcdFx0XHRcdFx0aWYgaXNPcGVuZXJSZW1vdmUgb3IgIWR4RGF0YUdyaWRJbnN0YW5jZVxuXHRcdFx0XHRcdFx0XHRcdGlmIGlzT3BlbmVyUmVtb3ZlXG5cdFx0XHRcdFx0XHRcdFx0XHR3aW5kb3cuY2xvc2UoKVxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgcmVjb3JkX2lkID09IFNlc3Npb24uZ2V0KFwicmVjb3JkX2lkXCIpIGFuZCBsaXN0X3ZpZXdfaWQgIT0gJ2NhbGVuZGFyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0YXBwaWQgPSBTZXNzaW9uLmdldChcImFwcF9pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKVxuXHRcdFx0XHRcdFx0XHRcdFx0dW5sZXNzIGxpc3Rfdmlld19pZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsaXN0X3ZpZXdfaWQgPSBcImFsbFwiXG5cdFx0XHRcdFx0XHRcdFx0XHR1bmxlc3MgdGVtcE5hdlJlbW92ZWRcblx0XHRcdFx0XHRcdFx0XHRcdFx0IyDlpoLmnpznoa7lrp7liKDpmaTkuobkuLTml7blr7zoiKrvvIzlsLHlj6/og73lt7Lnu4/ph43lrprlkJHliLDkuIrkuIDkuKrpobXpnaLkuobvvIzmsqHlv4XopoHlho3ph43lrprlkJHkuIDmrKFcblx0XHRcdFx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5nbyBcIi9hcHAvI3thcHBpZH0vI3tvYmplY3RfbmFtZX0vZ3JpZC8je2xpc3Rfdmlld19pZH1cIlxuXHRcdFx0XHRcdFx0XHRpZiBjYWxsX2JhY2sgYW5kIHR5cGVvZiBjYWxsX2JhY2sgPT0gXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0XHRcdFx0Y2FsbF9iYWNrKClcblxuXHRcdFx0XHRcdFx0XHRGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2FmdGVyJywge19pZDogcmVjb3JkX2lkLCBwcmV2aW91c0RvYzogcHJldmlvdXNEb2N9KVxuXHRcdFx0XHRcdFx0LCAoZXJyb3IpLT5cblx0XHRcdFx0XHRcdFx0Rm9ybU1hbmFnZXIucnVuSG9vayhvYmplY3RfbmFtZSwgJ2RlbGV0ZScsICdlcnJvcicsIHtfaWQ6IHJlY29yZF9pZCwgZXJyb3I6IGVycm9yfSkiLCJ2YXIgc3RlZWRvc0ZpbHRlcnM7XG5cbkNyZWF0b3IuYWN0aW9uc0J5TmFtZSA9IHt9O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIHN0ZWVkb3NGaWx0ZXJzID0gcmVxdWlyZShcIkBzdGVlZG9zL2ZpbHRlcnNcIik7XG4gIENyZWF0b3IuYWN0aW9ucyA9IGZ1bmN0aW9uKGFjdGlvbnMpIHtcbiAgICByZXR1cm4gXy5lYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKHRvZG8sIGFjdGlvbl9uYW1lKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbl9uYW1lXSA9IHRvZG87XG4gICAgfSk7XG4gIH07XG4gIENyZWF0b3IuZXhlY3V0ZUFjdGlvbiA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCBhY3Rpb24sIHJlY29yZF9pZCwgaXRlbV9lbGVtZW50LCBsaXN0X3ZpZXdfaWQsIHJlY29yZCkge1xuICAgIHZhciBmaWx0ZXJzLCBtb3JlQXJncywgb2JqLCB0b2RvLCB0b2RvQXJncywgdXJsO1xuICAgIGlmIChhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT09ICd3b3JkLXByaW50Jykge1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBmaWx0ZXJzID0gWydfaWQnLCAnPScsIHJlY29yZF9pZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWx0ZXJzID0gT2JqZWN0R3JpZC5nZXRGaWx0ZXJzKG9iamVjdF9uYW1lLCBsaXN0X3ZpZXdfaWQsIGZhbHNlLCBudWxsLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIHVybCA9IFwiL2FwaS92NC93b3JkX3RlbXBsYXRlcy9cIiArIGFjdGlvbi53b3JkX3RlbXBsYXRlICsgXCIvcHJpbnRcIiArIFwiP2ZpbHRlcnM9XCIgKyBzdGVlZG9zRmlsdGVycy5mb3JtYXRGaWx0ZXJzVG9PRGF0YVF1ZXJ5KGZpbHRlcnMpO1xuICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgfVxuICAgIG9iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICBpZiAoYWN0aW9uICE9IG51bGwgPyBhY3Rpb24udG9kbyA6IHZvaWQgMCkge1xuICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udG9kbyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0b2RvID0gQ3JlYXRvci5hY3Rpb25zQnlOYW1lW2FjdGlvbi50b2RvXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdGlvbi50b2RvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9kbyA9IGFjdGlvbi50b2RvO1xuICAgICAgfVxuICAgICAgaWYgKCFyZWNvcmQgJiYgb2JqZWN0X25hbWUgJiYgcmVjb3JkX2lkKSB7XG4gICAgICAgIHJlY29yZCA9IENyZWF0b3Iub2RhdGEuZ2V0KG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgaXRlbV9lbGVtZW50ID0gaXRlbV9lbGVtZW50ID8gaXRlbV9lbGVtZW50IDogXCJcIjtcbiAgICAgICAgbW9yZUFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuICAgICAgICB0b2RvQXJncyA9IFtvYmplY3RfbmFtZSwgcmVjb3JkX2lkXS5jb25jYXQobW9yZUFyZ3MpO1xuICAgICAgICByZXR1cm4gdG9kby5hcHBseSh7XG4gICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdDogb2JqLFxuICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgIGl0ZW1fZWxlbWVudDogaXRlbV9lbGVtZW50LFxuICAgICAgICAgIHJlY29yZDogcmVjb3JkXG4gICAgICAgIH0sIHRvZG9BcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0b2FzdHIud2FybmluZyh0KFwiX29iamVjdF9hY3Rpb25zX25vbmVfdG9kb1wiKSk7XG4gICAgfVxuICB9O1xuICBDcmVhdG9yLmFjdGlvbnMoe1xuICAgIFwic3RhbmRhcmRfcXVlcnlcIjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTW9kYWwuc2hvdyhcInN0YW5kYXJkX3F1ZXJ5X21vZGFsXCIpO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9uZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgaW5pdGlhbFZhbHVlcywgb2JqZWN0LCByZWYsIHJlZjEsIHJlZjIsIHNlbGVjdGVkUm93cztcbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGluaXRpYWxWYWx1ZXMgPSB7fTtcbiAgICAgIHNlbGVjdGVkUm93cyA9IChyZWYgPSB3aW5kb3cuZ3JpZFJlZikgIT0gbnVsbCA/IChyZWYxID0gcmVmLmN1cnJlbnQpICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYXBpKSAhPSBudWxsID8gcmVmMi5nZXRTZWxlY3RlZFJvd3MoKSA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChzZWxlY3RlZFJvd3MgIT0gbnVsbCA/IHNlbGVjdGVkUm93cy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgcmVjb3JkX2lkID0gc2VsZWN0ZWRSb3dzWzBdLl9pZDtcbiAgICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICAgIGluaXRpYWxWYWx1ZXMgPSBDcmVhdG9yLm9kYXRhLmdldChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbFZhbHVlcyA9IEZvcm1NYW5hZ2VyLmdldEluaXRpYWxWYWx1ZXMob2JqZWN0X25hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKChvYmplY3QgIT0gbnVsbCA/IG9iamVjdC52ZXJzaW9uIDogdm9pZCAwKSA+PSAyKSB7XG4gICAgICAgIHJldHVybiBTdGVlZG9zVUkuc2hvd01vZGFsKHN0b3Jlcy5Db21wb25lbnRSZWdpc3RyeS5jb21wb25lbnRzLk9iamVjdEZvcm0sIHtcbiAgICAgICAgICBuYW1lOiBvYmplY3RfbmFtZSArIFwiX3N0YW5kYXJkX25ld19mb3JtXCIsXG4gICAgICAgICAgb2JqZWN0QXBpTmFtZTogb2JqZWN0X25hbWUsXG4gICAgICAgICAgdGl0bGU6ICfmlrDlu7onLFxuICAgICAgICAgIGluaXRpYWxWYWx1ZXM6IGluaXRpYWxWYWx1ZXMsXG4gICAgICAgICAgYWZ0ZXJJbnNlcnQ6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgdmFyIHJlY29yZDtcbiAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICByZWNvcmQgPSByZXN1bHRbMF07XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFwcF9pZCwgdXJsO1xuICAgICAgICAgICAgICAgIGFwcF9pZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICAgICAgICAgICAgICAgIHVybCA9IFwiL2FwcC9cIiArIGFwcF9pZCArIFwiL1wiICsgb2JqZWN0X25hbWUgKyBcIi92aWV3L1wiICsgcmVjb3JkLl9pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gRmxvd1JvdXRlci5nbyh1cmwpO1xuICAgICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCBudWxsLCB7XG4gICAgICAgICAgaWNvblBhdGg6ICcvYXNzZXRzL2ljb25zJ1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICBpZiAoc2VsZWN0ZWRSb3dzICE9IG51bGwgPyBzZWxlY3RlZFJvd3MubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgIFNlc3Npb24uc2V0KCdjbURvYycsIGluaXRpYWxWYWx1ZXMpO1xuICAgICAgICBTZXNzaW9uLnNldCgnY21TaG93QWdhaW5EdXBsaWNhdGVkJywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCBpbml0aWFsVmFsdWVzKTtcbiAgICAgIH1cbiAgICAgIE1ldGVvci5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQoXCIuY3JlYXRvci1hZGRcIikuY2xpY2soKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgXCJzdGFuZGFyZF9vcGVuX3ZpZXdcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgaHJlZjtcbiAgICAgIGhyZWYgPSBDcmVhdG9yLmdldE9iamVjdFVybChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKTtcbiAgICAgIEZsb3dSb3V0ZXIucmVkaXJlY3QoaHJlZik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBcInN0YW5kYXJkX2VkaXRcIjogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgZmllbGRzKSB7XG4gICAgICB2YXIgb2JqZWN0O1xuICAgICAgaWYgKHJlY29yZF9pZCkge1xuICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChvYmplY3RfbmFtZSk7XG4gICAgICAgIGlmICgob2JqZWN0ICE9IG51bGwgPyBvYmplY3QudmVyc2lvbiA6IHZvaWQgMCkgPj0gMikge1xuICAgICAgICAgIHJldHVybiBTdGVlZG9zVUkuc2hvd01vZGFsKHN0b3Jlcy5Db21wb25lbnRSZWdpc3RyeS5jb21wb25lbnRzLk9iamVjdEZvcm0sIHtcbiAgICAgICAgICAgIG5hbWU6IG9iamVjdF9uYW1lICsgXCJfc3RhbmRhcmRfZWRpdF9mb3JtXCIsXG4gICAgICAgICAgICBvYmplY3RBcGlOYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICAgIHJlY29yZElkOiByZWNvcmRfaWQsXG4gICAgICAgICAgICB0aXRsZTogJ+e8lui+kScsXG4gICAgICAgICAgICBhZnRlclVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKEZsb3dSb3V0ZXIuY3VycmVudCgpLnJvdXRlLnBhdGguZW5kc1dpdGgoXCIvOnJlY29yZF9pZFwiKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIEZsb3dSb3V0ZXIucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cucmVmcmVzaEdyaWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBudWxsLCB7XG4gICAgICAgICAgICBpY29uUGF0aDogJy9hc3NldHMvaWNvbnMnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSAmJiBmYWxzZSkge1xuICAgICAgICAgIFNlc3Npb24uc2V0KCdhY3Rpb25fb2JqZWN0X25hbWUnLCBvYmplY3RfbmFtZSk7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9yZWNvcmRfaWQnLCByZWNvcmRfaWQpO1xuICAgICAgICAgIGlmICh0aGlzLnJlY29yZCkge1xuICAgICAgICAgICAgU2Vzc2lvbi5zZXQoJ2NtRG9jJywgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIuYnRuLWVkaXQtcmVjb3JkXCIpLmNsaWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgU2Vzc2lvbi5zZXQoJ2FjdGlvbl9vYmplY3RfbmFtZScsIG9iamVjdF9uYW1lKTtcbiAgICAgICAgICBTZXNzaW9uLnNldCgnYWN0aW9uX3JlY29yZF9pZCcsIHJlY29yZF9pZCk7XG4gICAgICAgICAgaWYgKHRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICBTZXNzaW9uLnNldCgnY21Eb2MnLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgICByZXR1cm4gTWV0ZW9yLmRlZmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gJChcIi5idG4uY3JlYXRvci1lZGl0XCIpLmNsaWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwic3RhbmRhcmRfZGVsZXRlXCI6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF90aXRsZSwgbGlzdF92aWV3X2lkLCByZWNvcmQsIGNhbGxfYmFjaykge1xuICAgICAgdmFyIGJlZm9yZUhvb2ssIG9iamVjdCwgdGV4dDtcbiAgICAgIGJlZm9yZUhvb2sgPSBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2JlZm9yZScsIHtcbiAgICAgICAgX2lkOiByZWNvcmRfaWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCFiZWZvcmVIb29rKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lKTtcbiAgICAgIGlmICghXy5pc1N0cmluZyhyZWNvcmRfdGl0bGUpICYmIChyZWNvcmRfdGl0bGUgIT0gbnVsbCA/IHJlY29yZF90aXRsZS5uYW1lIDogdm9pZCAwKSkge1xuICAgICAgICByZWNvcmRfdGl0bGUgPSByZWNvcmRfdGl0bGUgIT0gbnVsbCA/IHJlY29yZF90aXRsZS5uYW1lIDogdm9pZCAwO1xuICAgICAgfVxuICAgICAgaWYgKHJlY29yZF90aXRsZSkge1xuICAgICAgICB0ZXh0ID0gdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RleHRcIiwgb2JqZWN0LmxhYmVsICsgXCIgXFxcIlwiICsgcmVjb3JkX3RpdGxlICsgXCJcXFwiXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IHQoXCJjcmVhdG9yX3JlY29yZF9yZW1vdmVfc3dhbF90ZXh0XCIsIFwiXCIgKyBvYmplY3QubGFiZWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN3YWwoe1xuICAgICAgICB0aXRsZTogdChcImNyZWF0b3JfcmVjb3JkX3JlbW92ZV9zd2FsX3RpdGxlXCIsIFwiXCIgKyBvYmplY3QubGFiZWwpLFxuICAgICAgICB0ZXh0OiBcIjxkaXYgY2xhc3M9J2RlbGV0ZS1jcmVhdG9yLXdhcm5pbmcnPlwiICsgdGV4dCArIFwiPC9kaXY+XCIsXG4gICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiB0KCdEZWxldGUnKSxcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogdCgnQ2FuY2VsJylcbiAgICAgIH0sIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB2YXIgcHJldmlvdXNEb2M7XG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICBwcmV2aW91c0RvYyA9IEZvcm1NYW5hZ2VyLmdldFByZXZpb3VzRG9jKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsICdkZWxldGUnKTtcbiAgICAgICAgICByZXR1cm4gQ3JlYXRvci5vZGF0YVtcImRlbGV0ZVwiXShvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBfZSwgYXBwaWQsIGR4RGF0YUdyaWRJbnN0YW5jZSwgZ3JpZENvbnRhaW5lciwgZ3JpZE9iamVjdE5hbWVDbGFzcywgaW5mbywgaXNPcGVuZXJSZW1vdmUsIHJlY29yZFVybCwgdGVtcE5hdlJlbW92ZWQ7XG4gICAgICAgICAgICBpZiAocmVjb3JkX3RpdGxlKSB7XG4gICAgICAgICAgICAgIGluZm8gPSB0KFwiY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfdGl0bGVfc3VjXCIsIG9iamVjdC5sYWJlbCArIChcIlxcXCJcIiArIHJlY29yZF90aXRsZSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpbmZvID0gdCgnY3JlYXRvcl9yZWNvcmRfcmVtb3ZlX3N3YWxfc3VjJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhpbmZvKTtcbiAgICAgICAgICAgIGdyaWRPYmplY3ROYW1lQ2xhc3MgPSBvYmplY3RfbmFtZS5yZXBsYWNlKC9cXC4vZywgXCItXCIpO1xuICAgICAgICAgICAgZ3JpZENvbnRhaW5lciA9ICQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgaWYgKCEoZ3JpZENvbnRhaW5lciAhPSBudWxsID8gZ3JpZENvbnRhaW5lci5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XG4gICAgICAgICAgICAgICAgaXNPcGVuZXJSZW1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGdyaWRDb250YWluZXIgPSB3aW5kb3cub3BlbmVyLiQoXCIuZ3JpZENvbnRhaW5lci5cIiArIGdyaWRPYmplY3ROYW1lQ2xhc3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoRmxvd1JvdXRlci5jdXJyZW50KCkucm91dGUucGF0aC5lbmRzV2l0aChcIi86cmVjb3JkX2lkXCIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iamVjdF9uYW1lICE9PSBTZXNzaW9uLmdldChcIm9iamVjdF9uYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICBGbG93Um91dGVyLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVmcmVzaEdyaWQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICAgIF9lID0gZXJyb3IxO1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKF9lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChncmlkQ29udGFpbmVyICE9IG51bGwgPyBncmlkQ29udGFpbmVyLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICBpZiAob2JqZWN0LmVuYWJsZV90cmVlKSB7XG4gICAgICAgICAgICAgICAgZHhEYXRhR3JpZEluc3RhbmNlID0gZ3JpZENvbnRhaW5lci5keFRyZWVMaXN0KCkuZHhUcmVlTGlzdCgnaW5zdGFuY2UnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UgPSBncmlkQ29udGFpbmVyLmR4RGF0YUdyaWQoKS5keERhdGFHcmlkKCdpbnN0YW5jZScpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZHhEYXRhR3JpZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgIGlmIChvYmplY3QuZW5hYmxlX3RyZWUpIHtcbiAgICAgICAgICAgICAgICBkeERhdGFHcmlkSW5zdGFuY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3RfbmFtZSAhPT0gU2Vzc2lvbi5nZXQoXCJvYmplY3RfbmFtZVwiKSkge1xuICAgICAgICAgICAgICAgICAgRmxvd1JvdXRlci5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgVGVtcGxhdGUuY3JlYXRvcl9ncmlkLnJlZnJlc2goZHhEYXRhR3JpZEluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlY29yZFVybCA9IENyZWF0b3IuZ2V0T2JqZWN0VXJsKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpO1xuICAgICAgICAgICAgdGVtcE5hdlJlbW92ZWQgPSBDcmVhdG9yLnJlbW92ZVRlbXBOYXZJdGVtKG9iamVjdF9uYW1lLCByZWNvcmRVcmwpO1xuICAgICAgICAgICAgaWYgKGlzT3BlbmVyUmVtb3ZlIHx8ICFkeERhdGFHcmlkSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgaWYgKGlzT3BlbmVyUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVjb3JkX2lkID09PSBTZXNzaW9uLmdldChcInJlY29yZF9pZFwiKSAmJiBsaXN0X3ZpZXdfaWQgIT09ICdjYWxlbmRhcicpIHtcbiAgICAgICAgICAgICAgICBhcHBpZCA9IFNlc3Npb24uZ2V0KFwiYXBwX2lkXCIpO1xuICAgICAgICAgICAgICAgIGlmICghbGlzdF92aWV3X2lkKSB7XG4gICAgICAgICAgICAgICAgICBsaXN0X3ZpZXdfaWQgPSBTZXNzaW9uLmdldChcImxpc3Rfdmlld19pZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0X3ZpZXdfaWQpIHtcbiAgICAgICAgICAgICAgICAgIGxpc3Rfdmlld19pZCA9IFwiYWxsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdGVtcE5hdlJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwL1wiICsgYXBwaWQgKyBcIi9cIiArIG9iamVjdF9uYW1lICsgXCIvZ3JpZC9cIiArIGxpc3Rfdmlld19pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FsbF9iYWNrICYmIHR5cGVvZiBjYWxsX2JhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBjYWxsX2JhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBGb3JtTWFuYWdlci5ydW5Ib29rKG9iamVjdF9uYW1lLCAnZGVsZXRlJywgJ2FmdGVyJywge1xuICAgICAgICAgICAgICBfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICAgICAgcHJldmlvdXNEb2M6IHByZXZpb3VzRG9jXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIEZvcm1NYW5hZ2VyLnJ1bkhvb2sob2JqZWN0X25hbWUsICdkZWxldGUnLCAnZXJyb3InLCB7XG4gICAgICAgICAgICAgIF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgICAgICBlcnJvcjogZXJyb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIl19
