(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
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
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Restivus = Package['nimble:restivus'].Restivus;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Tabular = Package['aldeed:tabular'].Tabular;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:object-database":{"server":{"routes":{"api_creator_objects.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_object-database/server/routes/api_creator_objects.coffee                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _getLocale, clone, getUserProfileObjectLayout, objectql, steedosAuth, steedosI18n;

clone = require("clone");
steedosAuth = require("@steedos/auth");
steedosI18n = require("@steedos/i18n");
objectql = require("@steedos/objectql");

_getLocale = function (user) {
  var locale, ref, ref1;

  if ((user != null ? (ref = user.locale) != null ? ref.toLocaleLowerCase() : void 0 : void 0) === 'zh-cn') {
    locale = "zh-CN";
  } else if ((user != null ? (ref1 = user.locale) != null ? ref1.toLocaleLowerCase() : void 0 : void 0) === 'en-us') {
    locale = "en";
  } else {
    locale = "zh-CN";
  }

  return locale;
};

getUserProfileObjectLayout = function (userId, spaceId, objectName) {
  var ref, spaceUser;
  spaceUser = Creator.getCollection("space_users").findOne({
    space: spaceId,
    user: userId
  }, {
    fields: {
      profile: 1
    }
  });

  if (spaceUser && spaceUser.profile) {
    return (ref = Creator.getCollection("object_layouts")) != null ? ref.findOne({
      space: spaceId,
      profiles: spaceUser.profile,
      object_name: objectName
    }) : void 0;
  }
};

JsonRoutes.add('get', '/api/creator/:space/objects/:_id', function (req, res, next) {
  var _fields, _id, _object, authToken, e, isSpaceAdmin, lng, object, objectLayout, permissions, psets, psetsAdmin, psetsAdmin_pos, psetsCurrent, psetsCurrentNames, psetsCurrent_pos, psetsCustomer, psetsCustomer_pos, psetsGuest, psetsGuest_pos, psetsMember, psetsMember_pos, psetsSupplier, psetsSupplier_pos, psetsUser, psetsUser_pos, ref, set_ids, spaceId, spaceUser, type, userId, userSession;

  try {
    _id = req.params._id;
    spaceId = req.params.space;
    userId = req.headers["x-user-id"];
    type = (ref = req.query) != null ? ref.type : void 0;
    _object = Creator.getCollection('objects').findOne(_id) || {};
    object = {};

    if (!_.isEmpty(_object)) {
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

      if (isSpaceAdmin || _object.in_development === '0' && _object.is_enable) {
        if (_object.datasource !== 'default') {
          authToken = Steedos.getAuthToken(req, res);
          userSession = Meteor.wrapAsync(function (authToken, spaceId, cb) {
            return steedosAuth.getSession(authToken, spaceId).then(function (resolve, reject) {
              return cb(reject, resolve);
            });
          })(authToken, spaceId);
          permissions = Meteor.wrapAsync(function (v, userSession, cb) {
            return v.getUserObjectPermission(userSession).then(function (resolve, reject) {
              return cb(reject, resolve);
            });
          });
          object = Creator.convertObject(clone(objectql.getObject(_object.name).toConfig()), spaceId);
          object.permissions = permissions(objectql.getObject(_object.name), userSession);
        } else {
          object = Creator.convertObject(clone(Creator.Objects[_object.name]), spaceId);
          object.permissions = Creator.getObjectPermissions.bind(psets)(spaceId, userId, object.name);
        }

        delete object.db;
        object.list_views = Creator.getUserObjectListViews(userId, spaceId, object.name);
        lng = _getLocale(db.users.findOne(userId, {
          fields: {
            locale: 1
          }
        }));
        steedosI18n.translationObject(lng, object.name, Object.assign(object, {
          datasource: _object.datasource
        }));
        objectLayout = getUserProfileObjectLayout(userId, spaceId, object.name);

        if (objectLayout) {
          _fields = {};

          _.each(objectLayout.fields, function (_item) {
            _fields[_item.field] = object.fields[_item.field];

            if (_.has(_item, 'group')) {
              _fields[_item.field].group = _item.group;
            }

            if (_item.required) {
              _fields[_item.field].readonly = false;
              _fields[_item.field].disabled = false;
              return _fields[_item.field].required = true;
            } else if (_item.readonly) {
              _fields[_item.field].readonly = true;
              _fields[_item.field].disabled = true;
              return _fields[_item.field].required = false;
            }
          });

          object.fields = _fields;
          object.allow_actions = objectLayout.actions || [];
          object.allow_relatedList = objectLayout.relatedList || [];
        }
      }
    }

    return JsonRoutes.sendResult(res, {
      code: 200,
      data: object
    });
  } catch (error) {
    e = error;
    console.error(e.stack);
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

}},"publications":{"objects.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_object-database/server/publications/objects.coffee                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var objectql;
objectql = require("@steedos/objectql");
Meteor.publish("creator_objects", function (space) {
  var config;
  config = objectql.getSteedosConfig();

  if (config.tenant && config.tenant.saas) {
    return;
  }

  return Creator.getCollection("objects").find({
    space: {
      $in: [null, space]
    }
  }, {
    fields: {
      _id: 1,
      modified: 1,
      is_enable: 1,
      in_development: 1
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object_layouts.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_object-database/server/publications/object_layouts.coffee                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish("publish_object_layouts", function (space) {
  var spaceUser, userId;
  userId = this.userId;

  if (!userId) {
    return;
  }

  spaceUser = Creator.getCollection("space_users").findOne({
    space: space,
    user: userId
  }, {
    fields: {
      profile: 1
    }
  });

  if (spaceUser && spaceUser.profile) {
    return Creator.getCollection("object_layouts").find({
      space: {
        $in: [null, space]
      },
      profiles: spaceUser.profile
    }, {
      fields: {
        _id: 1,
        modified: 1,
        object_name: 1
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:object-database/server/routes/api_creator_objects.coffee");
require("/node_modules/meteor/steedos:object-database/server/publications/objects.coffee");
require("/node_modules/meteor/steedos:object-database/server/publications/object_layouts.coffee");

/* Exports */
Package._define("steedos:object-database");

})();

//# sourceURL=meteor://💻app/packages/steedos_object-database.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfbGF5b3V0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvb2JqZWN0X2xheW91dHMuY29mZmVlIl0sIm5hbWVzIjpbIl9nZXRMb2NhbGUiLCJjbG9uZSIsImdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0Iiwib2JqZWN0cWwiLCJzdGVlZG9zQXV0aCIsInN0ZWVkb3NJMThuIiwicmVxdWlyZSIsInVzZXIiLCJsb2NhbGUiLCJyZWYiLCJyZWYxIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJ1c2VySWQiLCJzcGFjZUlkIiwib2JqZWN0TmFtZSIsInNwYWNlVXNlciIsIkNyZWF0b3IiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsInNwYWNlIiwiZmllbGRzIiwicHJvZmlsZSIsInByb2ZpbGVzIiwib2JqZWN0X25hbWUiLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsIl9maWVsZHMiLCJfaWQiLCJfb2JqZWN0IiwiYXV0aFRva2VuIiwiZSIsImlzU3BhY2VBZG1pbiIsImxuZyIsIm9iamVjdCIsIm9iamVjdExheW91dCIsInBlcm1pc3Npb25zIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwidHlwZSIsInVzZXJTZXNzaW9uIiwicGFyYW1zIiwiaGVhZGVycyIsInF1ZXJ5IiwiXyIsImlzRW1wdHkiLCJuYW1lIiwiYXNzaWduZWRfYXBwcyIsImZpbmQiLCIkb3IiLCJ1c2VycyIsImZldGNoIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJsZW5ndGgiLCJwbHVjayIsIiRpbiIsImluX2RldmVsb3BtZW50IiwiaXNfZW5hYmxlIiwiZGF0YXNvdXJjZSIsIlN0ZWVkb3MiLCJnZXRBdXRoVG9rZW4iLCJNZXRlb3IiLCJ3cmFwQXN5bmMiLCJjYiIsImdldFNlc3Npb24iLCJ0aGVuIiwicmVzb2x2ZSIsInJlamVjdCIsInYiLCJnZXRVc2VyT2JqZWN0UGVybWlzc2lvbiIsImNvbnZlcnRPYmplY3QiLCJnZXRPYmplY3QiLCJ0b0NvbmZpZyIsIk9iamVjdHMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImJpbmQiLCJkYiIsImxpc3Rfdmlld3MiLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwidHJhbnNsYXRpb25PYmplY3QiLCJPYmplY3QiLCJhc3NpZ24iLCJlYWNoIiwiX2l0ZW0iLCJmaWVsZCIsImhhcyIsImdyb3VwIiwicmVxdWlyZWQiLCJyZWFkb25seSIsImRpc2FibGVkIiwiYWxsb3dfYWN0aW9ucyIsImFjdGlvbnMiLCJhbGxvd19yZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0Iiwic2VuZFJlc3VsdCIsImNvZGUiLCJkYXRhIiwiZXJyb3IiLCJjb25zb2xlIiwic3RhY2siLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJtZXNzYWdlIiwicHVibGlzaCIsImNvbmZpZyIsImdldFN0ZWVkb3NDb25maWciLCJ0ZW5hbnQiLCJzYWFzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLFVBQUEsRUFBQUMsS0FBQSxFQUFBQywwQkFBQSxFQUFBQyxRQUFBLEVBQUFDLFdBQUEsRUFBQUMsV0FBQTs7QUFBQUosUUFBUUssUUFBUSxPQUFSLENBQVI7QUFDQUYsY0FBY0UsUUFBUSxlQUFSLENBQWQ7QUFDQUQsY0FBY0MsUUFBUSxlQUFSLENBQWQ7QUFDQUgsV0FBV0csUUFBUSxtQkFBUixDQUFYOztBQUVBTixhQUFhLFVBQUNPLElBQUQ7QUFDWixNQUFBQyxNQUFBLEVBQUFDLEdBQUEsRUFBQUMsSUFBQTs7QUFBQSxPQUFBSCxRQUFBLFFBQUFFLE1BQUFGLEtBQUFDLE1BQUEsWUFBQUMsSUFBaUJFLGlCQUFqQixLQUFHLE1BQUgsR0FBRyxNQUFILE1BQXdDLE9BQXhDO0FBQ0NILGFBQVMsT0FBVDtBQURELFNBRUssS0FBQUQsUUFBQSxRQUFBRyxPQUFBSCxLQUFBQyxNQUFBLFlBQUFFLEtBQWlCQyxpQkFBakIsS0FBRyxNQUFILEdBQUcsTUFBSCxNQUF3QyxPQUF4QztBQUNKSCxhQUFTLElBQVQ7QUFESTtBQUdKQSxhQUFTLE9BQVQ7QUNPQzs7QURORixTQUFPQSxNQUFQO0FBUFksQ0FBYjs7QUFTQU4sNkJBQTZCLFVBQUNVLE1BQUQsRUFBU0MsT0FBVCxFQUFrQkMsVUFBbEI7QUFDNUIsTUFBQUwsR0FBQSxFQUFBTSxTQUFBO0FBQUFBLGNBQVlDLFFBQVFDLGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNDLE9BQXJDLENBQTZDO0FBQUNDLFdBQU9OLE9BQVI7QUFB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OUMsV0FBTztBQUFDeUQsV0FBSyxDQUFDLElBQUQsRUFBT3pELEtBQVA7QUFBTjtBQUFSLEdBQXRDLEVBQXFFO0FBQUNDLFlBQVE7QUFBQ1UsV0FBSyxDQUFOO0FBQVN5QyxnQkFBVSxDQUFuQjtBQUFzQk8saUJBQVcsQ0FBakM7QUFBb0NELHNCQUFnQjtBQUFwRDtBQUFULEdBQXJFLENDSUM7QURURixHOzs7Ozs7Ozs7Ozs7QUVEQUssT0FBTzJDLE9BQVAsQ0FBZSx3QkFBZixFQUF5QyxVQUFDMUcsS0FBRDtBQUN4QyxNQUFBSixTQUFBLEVBQUFILE1BQUE7QUFBQUEsV0FBUyxLQUFLQSxNQUFkOztBQUNBLE1BQUcsQ0FBQ0EsTUFBSjtBQUNDO0FDRUM7O0FEREZHLGNBQVlDLFFBQVFDLGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNDLE9BQXJDLENBQTZDO0FBQUNDLFdBQU9BLEtBQVI7QUFBZVosVUFBTUs7QUFBckIsR0FBN0MsRUFBMkU7QUFBQ1EsWUFBUTtBQUFDQyxlQUFTO0FBQVY7QUFBVCxHQUEzRSxDQUFaOztBQUNBLE1BQUdOLGFBQWFBLFVBQVVNLE9BQTFCO0FDVUcsV0RURkwsUUFBUUMsYUFBUixDQUFzQixnQkFBdEIsRUFBd0NnRCxJQUF4QyxDQUE2QztBQUFDOUMsYUFBTztBQUFDeUQsYUFBSyxDQUFDLElBQUQsRUFBT3pELEtBQVA7QUFBTixPQUFSO0FBQThCRyxnQkFBVVAsVUFBVU07QUFBbEQsS0FBN0MsRUFBeUc7QUFBQ0QsY0FBUTtBQUFDVSxhQUFLLENBQU47QUFBU3lDLGtCQUFVLENBQW5CO0FBQXNCaEQscUJBQWE7QUFBbkM7QUFBVCxLQUF6RyxDQ1NFO0FBWUQ7QUQzQkgsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbG9uZSA9IHJlcXVpcmUoXCJjbG9uZVwiKTtcclxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcclxuc3RlZWRvc0kxOG4gPSByZXF1aXJlKFwiQHN0ZWVkb3MvaTE4blwiKTtcclxub2JqZWN0cWwgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvb2JqZWN0cWxcIik7XHJcblxyXG5fZ2V0TG9jYWxlID0gKHVzZXIpLT5cclxuXHRpZiB1c2VyPy5sb2NhbGU/LnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3poLWNuJ1xyXG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXHJcblx0ZWxzZSBpZiB1c2VyPy5sb2NhbGU/LnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ2VuLXVzJ1xyXG5cdFx0bG9jYWxlID0gXCJlblwiXHJcblx0ZWxzZVxyXG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXHJcblx0cmV0dXJuIGxvY2FsZVxyXG5cclxuZ2V0VXNlclByb2ZpbGVPYmplY3RMYXlvdXQgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3ROYW1lKS0+XHJcblx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pXHJcblx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIik/LmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGUsIG9iamVjdF9uYW1lOiBvYmplY3ROYW1lfSk7XHJcblxyXG5Kc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvY3JlYXRvci86c3BhY2Uvb2JqZWN0cy86X2lkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0X2lkID0gcmVxLnBhcmFtcy5faWRcclxuXHRcdHNwYWNlSWQgPSByZXEucGFyYW1zLnNwYWNlXHJcblx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxyXG5cclxuXHRcdHR5cGUgPSByZXEucXVlcnk/LnR5cGVcclxuXHJcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3RzJykuZmluZE9uZShfaWQpIHx8IHt9XHJcblxyXG5cdFx0b2JqZWN0ID0ge31cclxuXHRcdGlmICFfLmlzRW1wdHkoX29iamVjdClcclxuXHRcdFx0aXNTcGFjZUFkbWluID0gZmFsc2VcclxuXHRcdFx0c3BhY2VVc2VyID0gbnVsbFxyXG5cdFx0XHRpZiB1c2VySWRcclxuXHRcdFx0XHRpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXHJcblxyXG5cdFx0XHRwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0XHRwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0XHRwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHJcblx0XHRcdHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0XHRwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXHJcblx0XHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cclxuXHRcdFx0cHNldHNBZG1pbl9wb3MgPSBudWxsXHJcblx0XHRcdHBzZXRzVXNlcl9wb3MgPSBudWxsXHJcblx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IG51bGxcclxuXHRcdFx0cHNldHNHdWVzdF9wb3MgPSBudWxsXHJcblx0XHRcdHBzZXRzQ3VycmVudF9wb3MgPSBudWxsXHJcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbFxyXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGxcclxuXHJcblx0XHRcdGlmIHBzZXRzQWRtaW4/Ll9pZFxyXG5cdFx0XHRcdHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxyXG5cdFx0XHRcdHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdFx0aWYgcHNldHNNZW1iZXI/Ll9pZFxyXG5cdFx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblx0XHRcdGlmIHBzZXRzR3Vlc3Q/Ll9pZFxyXG5cdFx0XHRcdHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0XHRpZiBwc2V0c1N1cHBsaWVyPy5faWRcclxuXHRcdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdFx0aWYgcHNldHNDdXN0b21lcj8uX2lkXHJcblx0XHRcdFx0cHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblxyXG5cdFx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxyXG5cdFx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJfaWRcIlxyXG5cdFx0XHRcdHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHNldF9pZHN9fSkuZmV0Y2goKVxyXG5cdFx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXHJcblxyXG5cdFx0XHRwc2V0cyA9IHtcclxuXHRcdFx0XHRwc2V0c0FkbWluLFxyXG5cdFx0XHRcdHBzZXRzVXNlcixcclxuXHRcdFx0XHRwc2V0c0N1cnJlbnQsXHJcblx0XHRcdFx0cHNldHNNZW1iZXIsXHJcblx0XHRcdFx0cHNldHNHdWVzdCxcclxuXHRcdFx0XHRwc2V0c1N1cHBsaWVyLFxyXG5cdFx0XHRcdHBzZXRzQ3VzdG9tZXIsXHJcblx0XHRcdFx0aXNTcGFjZUFkbWluLFxyXG5cdFx0XHRcdHNwYWNlVXNlcixcclxuXHRcdFx0XHRwc2V0c0FkbWluX3BvcyxcclxuXHRcdFx0XHRwc2V0c1VzZXJfcG9zLFxyXG5cdFx0XHRcdHBzZXRzTWVtYmVyX3BvcyxcclxuXHRcdFx0XHRwc2V0c0d1ZXN0X3BvcyxcclxuXHRcdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyxcclxuXHRcdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyxcclxuXHRcdFx0XHRwc2V0c0N1cnJlbnRfcG9zXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIGlzU3BhY2VBZG1pbiB8fCBfb2JqZWN0LmluX2RldmVsb3BtZW50ID09ICcwJyAmJiBfb2JqZWN0LmlzX2VuYWJsZVxyXG5cdFx0XHRcdGlmIF9vYmplY3QuZGF0YXNvdXJjZSAhPSAnZGVmYXVsdCdcclxuXHRcdFx0XHRcdGF1dGhUb2tlbiA9IFN0ZWVkb3MuZ2V0QXV0aFRva2VuKHJlcSwgcmVzKVxyXG5cdFx0XHRcdFx0dXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKS0+XHJcblx0XHRcdFx0XHRcdHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpLT5cclxuXHRcdFx0XHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXHJcblx0XHRcdFx0XHQpKGF1dGhUb2tlbiwgc3BhY2VJZClcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gTWV0ZW9yLndyYXBBc3luYyAodiwgdXNlclNlc3Npb24sIGNiKS0+XHJcblx0XHRcdFx0XHRcdHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4gKHJlc29sdmUsIHJlamVjdCktPlxyXG5cdFx0XHRcdFx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcclxuXHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShvYmplY3RxbC5nZXRPYmplY3QoX29iamVjdC5uYW1lKS50b0NvbmZpZygpKSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdG9iamVjdC5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKG9iamVjdHFsLmdldE9iamVjdChfb2JqZWN0Lm5hbWUpLCB1c2VyU2Vzc2lvbilcclxuXHRcdFx0XHRlbHNlXHJcblxyXG5cdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tfb2JqZWN0Lm5hbWVdKSwgc3BhY2VJZCkgIyBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW19vYmplY3QubmFtZV0pLCBzcGFjZUlkKSAjIENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShuZXcgQ3JlYXRvci5PYmplY3QoX29iamVjdCkpLCBzcGFjZUlkKTtcclxuXHRcdFx0XHRcdG9iamVjdC5wZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3QubmFtZSlcclxuXHJcblx0XHRcdFx0ZGVsZXRlIG9iamVjdC5kYlxyXG5cdFx0XHRcdG9iamVjdC5saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpXHJcblx0XHRcdFx0bG5nID0gX2dldExvY2FsZShkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge2xvY2FsZTogMX19KSlcclxuXHRcdFx0XHRzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk9iamVjdChsbmcsIG9iamVjdC5uYW1lLCBPYmplY3QuYXNzaWduKG9iamVjdCwge2RhdGFzb3VyY2U6IF9vYmplY3QuZGF0YXNvdXJjZX0pKVxyXG5cdFx0XHRcdG9iamVjdExheW91dCA9IGdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0KHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpXHJcblx0XHRcdFx0aWYgb2JqZWN0TGF5b3V0XHJcblx0XHRcdFx0XHRfZmllbGRzID0ge307XHJcblx0XHRcdFx0XHRfLmVhY2ggb2JqZWN0TGF5b3V0LmZpZWxkcywgKF9pdGVtKS0+XHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdID0gb2JqZWN0LmZpZWxkc1tfaXRlbS5maWVsZF1cclxuXHRcdFx0XHRcdFx0aWYgXy5oYXMoX2l0ZW0sICdncm91cCcpXHJcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0uZ3JvdXAgPSBfaXRlbS5ncm91cFxyXG5cdFx0XHRcdFx0XHRpZiBfaXRlbS5yZXF1aXJlZFxyXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlYWRvbmx5ID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5kaXNhYmxlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVxdWlyZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgX2l0ZW0ucmVhZG9ubHlcclxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5yZWFkb25seSA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5kaXNhYmxlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5yZXF1aXJlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRvYmplY3QuZmllbGRzID0gX2ZpZWxkc1xyXG5cdFx0XHRcdFx0b2JqZWN0LmFsbG93X2FjdGlvbnMgPSBvYmplY3RMYXlvdXQuYWN0aW9ucyB8fCBbXVxyXG5cdFx0XHRcdFx0b2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0ID0gb2JqZWN0TGF5b3V0LnJlbGF0ZWRMaXN0IHx8IFtdXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiBvYmplY3RcclxuXHRcdH1cclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XHJcblx0XHR9IiwidmFyIF9nZXRMb2NhbGUsIGNsb25lLCBnZXRVc2VyUHJvZmlsZU9iamVjdExheW91dCwgb2JqZWN0cWwsIHN0ZWVkb3NBdXRoLCBzdGVlZG9zSTE4bjtcblxuY2xvbmUgPSByZXF1aXJlKFwiY2xvbmVcIik7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbnN0ZWVkb3NJMThuID0gcmVxdWlyZShcIkBzdGVlZG9zL2kxOG5cIik7XG5cbm9iamVjdHFsID0gcmVxdWlyZShcIkBzdGVlZG9zL29iamVjdHFsXCIpO1xuXG5fZ2V0TG9jYWxlID0gZnVuY3Rpb24odXNlcikge1xuICB2YXIgbG9jYWxlLCByZWYsIHJlZjE7XG4gIGlmICgodXNlciAhPSBudWxsID8gKHJlZiA9IHVzZXIubG9jYWxlKSAhPSBudWxsID8gcmVmLnRvTG9jYWxlTG93ZXJDYXNlKCkgOiB2b2lkIDAgOiB2b2lkIDApID09PSAnemgtY24nKSB7XG4gICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICB9IGVsc2UgaWYgKCh1c2VyICE9IG51bGwgPyAocmVmMSA9IHVzZXIubG9jYWxlKSAhPSBudWxsID8gcmVmMS50b0xvY2FsZUxvd2VyQ2FzZSgpIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gJ2VuLXVzJykge1xuICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgfSBlbHNlIHtcbiAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gIH1cbiAgcmV0dXJuIGxvY2FsZTtcbn07XG5cbmdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3ROYW1lKSB7XG4gIHZhciByZWYsIHNwYWNlVXNlcjtcbiAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHByb2ZpbGU6IDFcbiAgICB9XG4gIH0pO1xuICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGF5b3V0c1wiKSkgIT0gbnVsbCA/IHJlZi5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgcHJvZmlsZXM6IHNwYWNlVXNlci5wcm9maWxlLFxuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdE5hbWVcbiAgICB9KSA6IHZvaWQgMDtcbiAgfVxufTtcblxuSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2NyZWF0b3IvOnNwYWNlL29iamVjdHMvOl9pZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBfZmllbGRzLCBfaWQsIF9vYmplY3QsIGF1dGhUb2tlbiwgZSwgaXNTcGFjZUFkbWluLCBsbmcsIG9iamVjdCwgb2JqZWN0TGF5b3V0LCBwZXJtaXNzaW9ucywgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQWRtaW5fcG9zLCBwc2V0c0N1cnJlbnQsIHBzZXRzQ3VycmVudE5hbWVzLCBwc2V0c0N1cnJlbnRfcG9zLCBwc2V0c0N1c3RvbWVyLCBwc2V0c0N1c3RvbWVyX3BvcywgcHNldHNHdWVzdCwgcHNldHNHdWVzdF9wb3MsIHBzZXRzTWVtYmVyLCBwc2V0c01lbWJlcl9wb3MsIHBzZXRzU3VwcGxpZXIsIHBzZXRzU3VwcGxpZXJfcG9zLCBwc2V0c1VzZXIsIHBzZXRzVXNlcl9wb3MsIHJlZiwgc2V0X2lkcywgc3BhY2VJZCwgc3BhY2VVc2VyLCB0eXBlLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB0cnkge1xuICAgIF9pZCA9IHJlcS5wYXJhbXMuX2lkO1xuICAgIHNwYWNlSWQgPSByZXEucGFyYW1zLnNwYWNlO1xuICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgIHR5cGUgPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgX29iamVjdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0cycpLmZpbmRPbmUoX2lkKSB8fCB7fTtcbiAgICBvYmplY3QgPSB7fTtcbiAgICBpZiAoIV8uaXNFbXB0eShfb2JqZWN0KSkge1xuICAgICAgaXNTcGFjZUFkbWluID0gZmFsc2U7XG4gICAgICBzcGFjZVVzZXIgPSBudWxsO1xuICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICBpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgICAgICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICB1c2VyOiB1c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICBuYW1lOiAnYWRtaW4nXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pIHx8IG51bGw7XG4gICAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIG5hbWU6ICd1c2VyJ1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICB9XG4gICAgICB9KSB8fCBudWxsO1xuICAgICAgcHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIG5hbWU6ICdtZW1iZXInXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pIHx8IG51bGw7XG4gICAgICBwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICBuYW1lOiAnZ3Vlc3QnXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pIHx8IG51bGw7XG4gICAgICBwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICBuYW1lOiAnc3VwcGxpZXInXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pIHx8IG51bGw7XG4gICAgICBwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICBuYW1lOiAnY3VzdG9tZXInXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pIHx8IG51bGw7XG4gICAgICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICRvcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1c2VyczogdXNlcklkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIG5hbWU6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBwc2V0c0FkbWluX3BvcyA9IG51bGw7XG4gICAgICBwc2V0c1VzZXJfcG9zID0gbnVsbDtcbiAgICAgIHBzZXRzTWVtYmVyX3BvcyA9IG51bGw7XG4gICAgICBwc2V0c0d1ZXN0X3BvcyA9IG51bGw7XG4gICAgICBwc2V0c0N1cnJlbnRfcG9zID0gbnVsbDtcbiAgICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbDtcbiAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbDtcbiAgICAgIGlmIChwc2V0c0FkbWluICE9IG51bGwgPyBwc2V0c0FkbWluLl9pZCA6IHZvaWQgMCkge1xuICAgICAgICBwc2V0c0FkbWluX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNBZG1pbi5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgaWYgKHBzZXRzVXNlciAhPSBudWxsID8gcHNldHNVc2VyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgICBwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGlmIChwc2V0c01lbWJlciAhPSBudWxsID8gcHNldHNNZW1iZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICAgIHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGlmIChwc2V0c0d1ZXN0ICE9IG51bGwgPyBwc2V0c0d1ZXN0Ll9pZCA6IHZvaWQgMCkge1xuICAgICAgICBwc2V0c0d1ZXN0X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNHdWVzdC5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgaWYgKHBzZXRzU3VwcGxpZXIgIT0gbnVsbCA/IHBzZXRzU3VwcGxpZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICAgIHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBpZiAocHNldHNDdXN0b21lciAhPSBudWxsID8gcHNldHNDdXN0b21lci5faWQgOiB2b2lkIDApIHtcbiAgICAgICAgcHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGlmIChwc2V0c0N1cnJlbnQubGVuZ3RoID4gMCkge1xuICAgICAgICBzZXRfaWRzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwiX2lkXCIpO1xuICAgICAgICBwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiB7XG4gICAgICAgICAgICAkaW46IHNldF9pZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgIHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayhwc2V0c0N1cnJlbnQsIFwibmFtZVwiKTtcbiAgICAgIH1cbiAgICAgIHBzZXRzID0ge1xuICAgICAgICBwc2V0c0FkbWluOiBwc2V0c0FkbWluLFxuICAgICAgICBwc2V0c1VzZXI6IHBzZXRzVXNlcixcbiAgICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnQsXG4gICAgICAgIHBzZXRzTWVtYmVyOiBwc2V0c01lbWJlcixcbiAgICAgICAgcHNldHNHdWVzdDogcHNldHNHdWVzdCxcbiAgICAgICAgcHNldHNTdXBwbGllcjogcHNldHNTdXBwbGllcixcbiAgICAgICAgcHNldHNDdXN0b21lcjogcHNldHNDdXN0b21lcixcbiAgICAgICAgaXNTcGFjZUFkbWluOiBpc1NwYWNlQWRtaW4sXG4gICAgICAgIHNwYWNlVXNlcjogc3BhY2VVc2VyLFxuICAgICAgICBwc2V0c0FkbWluX3BvczogcHNldHNBZG1pbl9wb3MsXG4gICAgICAgIHBzZXRzVXNlcl9wb3M6IHBzZXRzVXNlcl9wb3MsXG4gICAgICAgIHBzZXRzTWVtYmVyX3BvczogcHNldHNNZW1iZXJfcG9zLFxuICAgICAgICBwc2V0c0d1ZXN0X3BvczogcHNldHNHdWVzdF9wb3MsXG4gICAgICAgIHBzZXRzU3VwcGxpZXJfcG9zOiBwc2V0c1N1cHBsaWVyX3BvcyxcbiAgICAgICAgcHNldHNDdXN0b21lcl9wb3M6IHBzZXRzQ3VzdG9tZXJfcG9zLFxuICAgICAgICBwc2V0c0N1cnJlbnRfcG9zOiBwc2V0c0N1cnJlbnRfcG9zXG4gICAgICB9O1xuICAgICAgaWYgKGlzU3BhY2VBZG1pbiB8fCBfb2JqZWN0LmluX2RldmVsb3BtZW50ID09PSAnMCcgJiYgX29iamVjdC5pc19lbmFibGUpIHtcbiAgICAgICAgaWYgKF9vYmplY3QuZGF0YXNvdXJjZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgYXV0aFRva2VuID0gU3RlZWRvcy5nZXRBdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgICAgICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkoYXV0aFRva2VuLCBzcGFjZUlkKTtcbiAgICAgICAgICBwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24odiwgdXNlclNlc3Npb24sIGNiKSB7XG4gICAgICAgICAgICByZXR1cm4gdi5nZXRVc2VyT2JqZWN0UGVybWlzc2lvbih1c2VyU2Vzc2lvbikudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUob2JqZWN0cWwuZ2V0T2JqZWN0KF9vYmplY3QubmFtZSkudG9Db25maWcoKSksIHNwYWNlSWQpO1xuICAgICAgICAgIG9iamVjdC5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKG9iamVjdHFsLmdldE9iamVjdChfb2JqZWN0Lm5hbWUpLCB1c2VyU2Vzc2lvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tfb2JqZWN0Lm5hbWVdKSwgc3BhY2VJZCk7XG4gICAgICAgICAgb2JqZWN0LnBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdC5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgb2JqZWN0LmRiO1xuICAgICAgICBvYmplY3QubGlzdF92aWV3cyA9IENyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyh1c2VySWQsIHNwYWNlSWQsIG9iamVjdC5uYW1lKTtcbiAgICAgICAgbG5nID0gX2dldExvY2FsZShkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgbG9jYWxlOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uT2JqZWN0KGxuZywgb2JqZWN0Lm5hbWUsIE9iamVjdC5hc3NpZ24ob2JqZWN0LCB7XG4gICAgICAgICAgZGF0YXNvdXJjZTogX29iamVjdC5kYXRhc291cmNlXG4gICAgICAgIH0pKTtcbiAgICAgICAgb2JqZWN0TGF5b3V0ID0gZ2V0VXNlclByb2ZpbGVPYmplY3RMYXlvdXQodXNlcklkLCBzcGFjZUlkLCBvYmplY3QubmFtZSk7XG4gICAgICAgIGlmIChvYmplY3RMYXlvdXQpIHtcbiAgICAgICAgICBfZmllbGRzID0ge307XG4gICAgICAgICAgXy5lYWNoKG9iamVjdExheW91dC5maWVsZHMsIGZ1bmN0aW9uKF9pdGVtKSB7XG4gICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXSA9IG9iamVjdC5maWVsZHNbX2l0ZW0uZmllbGRdO1xuICAgICAgICAgICAgaWYgKF8uaGFzKF9pdGVtLCAnZ3JvdXAnKSkge1xuICAgICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXS5ncm91cCA9IF9pdGVtLmdyb3VwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF9pdGVtLnJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlYWRvbmx5ID0gZmFsc2U7XG4gICAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBfZmllbGRzW19pdGVtLmZpZWxkXS5yZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF9pdGVtLnJlYWRvbmx5KSB7XG4gICAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICByZXR1cm4gX2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvYmplY3QuZmllbGRzID0gX2ZpZWxkcztcbiAgICAgICAgICBvYmplY3QuYWxsb3dfYWN0aW9ucyA9IG9iamVjdExheW91dC5hY3Rpb25zIHx8IFtdO1xuICAgICAgICAgIG9iamVjdC5hbGxvd19yZWxhdGVkTGlzdCA9IG9iamVjdExheW91dC5yZWxhdGVkTGlzdCB8fCBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogb2JqZWN0XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJvYmplY3RxbCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9vYmplY3RxbFwiKTtcclxuTWV0ZW9yLnB1Ymxpc2ggXCJjcmVhdG9yX29iamVjdHNcIiwgKHNwYWNlKS0+XHJcblx0I1RPRE8g5qC55o2u5p2D6ZmQ6L+U5ZueT2JqZWN0c+iusOW9lVxyXG5cdGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcclxuXHRpZiBjb25maWcudGVuYW50ICYmIGNvbmZpZy50ZW5hbnQuc2Fhc1xyXG5cdFx0cmV0dXJuXHJcblx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kKHtzcGFjZTogeyRpbjogW251bGwsIHNwYWNlXX19LCB7ZmllbGRzOiB7X2lkOiAxLCBtb2RpZmllZDogMSwgaXNfZW5hYmxlOiAxLCBpbl9kZXZlbG9wbWVudDogMX19KSIsInZhciBvYmplY3RxbDtcblxub2JqZWN0cWwgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvb2JqZWN0cWxcIik7XG5cbk1ldGVvci5wdWJsaXNoKFwiY3JlYXRvcl9vYmplY3RzXCIsIGZ1bmN0aW9uKHNwYWNlKSB7XG4gIHZhciBjb25maWc7XG4gIGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcbiAgaWYgKGNvbmZpZy50ZW5hbnQgJiYgY29uZmlnLnRlbmFudC5zYWFzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmQoe1xuICAgIHNwYWNlOiB7XG4gICAgICAkaW46IFtudWxsLCBzcGFjZV1cbiAgICB9XG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIF9pZDogMSxcbiAgICAgIG1vZGlmaWVkOiAxLFxuICAgICAgaXNfZW5hYmxlOiAxLFxuICAgICAgaW5fZGV2ZWxvcG1lbnQ6IDFcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcInB1Ymxpc2hfb2JqZWN0X2xheW91dHNcIiwgKHNwYWNlKS0+XHJcblx0dXNlcklkID0gdGhpcy51c2VySWRcclxuXHRpZiAhdXNlcklkXHJcblx0XHRyZXR1cm5cclxuXHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2UsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pXHJcblx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXHJcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGF5b3V0c1wiKS5maW5kKHtzcGFjZTogeyRpbjogW251bGwsIHNwYWNlXX0sIHByb2ZpbGVzOiBzcGFjZVVzZXIucHJvZmlsZX0sIHtmaWVsZHM6IHtfaWQ6IDEsIG1vZGlmaWVkOiAxLCBvYmplY3RfbmFtZTogMX19KSIsIk1ldGVvci5wdWJsaXNoKFwicHVibGlzaF9vYmplY3RfbGF5b3V0c1wiLCBmdW5jdGlvbihzcGFjZSkge1xuICB2YXIgc3BhY2VVc2VyLCB1c2VySWQ7XG4gIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICBpZiAoIXVzZXJJZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2UsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHByb2ZpbGU6IDFcbiAgICB9XG4gIH0pO1xuICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9sYXlvdXRzXCIpLmZpbmQoe1xuICAgICAgc3BhY2U6IHtcbiAgICAgICAgJGluOiBbbnVsbCwgc3BhY2VdXG4gICAgICB9LFxuICAgICAgcHJvZmlsZXM6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgbW9kaWZpZWQ6IDEsXG4gICAgICAgIG9iamVjdF9uYW1lOiAxXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
