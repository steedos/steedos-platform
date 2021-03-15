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
  var _fields, _id, _object, authToken, e, isSpaceAdmin, lng, object, objectLayout, permissions, psets, psetsAdmin, psetsAdmin_pos, psetsCurrent, psetsCurrentNames, psetsCurrent_pos, psetsCustomer, psetsCustomer_pos, psetsGuest, psetsGuest_pos, psetsMember, psetsMember_pos, psetsSupplier, psetsSupplier_pos, psetsUser, psetsUser_pos, ref, ref1, set_ids, spaceId, spaceUser, type, userId, userSession;

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
          object.database_name = (ref1 = Creator.getCollection("datasources").findOne({
            _id: _object.datasource
          })) != null ? ref1.label : void 0;
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
          object.allow_customActions = objectLayout.actions || [];
          object.exclude_actions = objectLayout.exclude_actions || [];
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
    },
    is_deleted: {
      $ne: true
    }
  }, {
    fields: {
      _id: 1,
      modified: 1,
      is_enable: 1,
      in_development: 1,
      name: 1
    }
  });
});
Meteor.publish("creator_reload_object_logs", function (space) {
  var config;
  config = objectql.getSteedosConfig();

  if (config.tenant && config.tenant.saas) {
    return;
  }

  return Creator.getCollection("_object_reload_logs").find({
    space: {
      $in: [null, space]
    },
    change_time: {
      $gte: new Date()
    }
  }, {
    fields: {
      _id: 1,
      object_name: 1,
      space: 1
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfbGF5b3V0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvb2JqZWN0X2xheW91dHMuY29mZmVlIl0sIm5hbWVzIjpbIl9nZXRMb2NhbGUiLCJjbG9uZSIsImdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0Iiwib2JqZWN0cWwiLCJzdGVlZG9zQXV0aCIsInN0ZWVkb3NJMThuIiwicmVxdWlyZSIsInVzZXIiLCJsb2NhbGUiLCJyZWYiLCJyZWYxIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJ1c2VySWQiLCJzcGFjZUlkIiwib2JqZWN0TmFtZSIsInNwYWNlVXNlciIsIkNyZWF0b3IiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsInNwYWNlIiwiZmllbGRzIiwicHJvZmlsZSIsInByb2ZpbGVzIiwib2JqZWN0X25hbWUiLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsIl9maWVsZHMiLCJfaWQiLCJfb2JqZWN0IiwiYXV0aFRva2VuIiwiZSIsImlzU3BhY2VBZG1pbiIsImxuZyIsIm9iamVjdCIsIm9iamVjdExheW91dCIsInBlcm1pc3Npb25zIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwidHlwZSIsInVzZXJTZXNzaW9uIiwicGFyYW1zIiwiaGVhZGVycyIsInF1ZXJ5IiwiXyIsImlzRW1wdHkiLCJuYW1lIiwiYXNzaWduZWRfYXBwcyIsImZpbmQiLCIkb3IiLCJ1c2VycyIsImZldGNoIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJsZW5ndGgiLCJwbHVjayIsIiRpbiIsImluX2RldmVsb3BtZW50IiwiaXNfZW5hYmxlIiwiZGF0YXNvdXJjZSIsIlN0ZWVkb3MiLCJnZXRBdXRoVG9rZW4iLCJNZXRlb3IiLCJ3cmFwQXN5bmMiLCJjYiIsImdldFNlc3Npb24iLCJ0aGVuIiwicmVzb2x2ZSIsInJlamVjdCIsInYiLCJnZXRVc2VyT2JqZWN0UGVybWlzc2lvbiIsImNvbnZlcnRPYmplY3QiLCJnZXRPYmplY3QiLCJ0b0NvbmZpZyIsImRhdGFiYXNlX25hbWUiLCJsYWJlbCIsIk9iamVjdHMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImJpbmQiLCJkYiIsImxpc3Rfdmlld3MiLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwidHJhbnNsYXRpb25PYmplY3QiLCJPYmplY3QiLCJhc3NpZ24iLCJlYWNoIiwiX2l0ZW0iLCJmaWVsZCIsImhhcyIsImdyb3VwIiwicmVxdWlyZWQiLCJyZWFkb25seSIsImRpc2FibGVkIiwiYWxsb3dfY3VzdG9tQWN0aW9ucyIsImFjdGlvbnMiLCJleGNsdWRlX2FjdGlvbnMiLCJhbGxvd19yZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0Iiwic2VuZFJlc3VsdCIsImNvZGUiLCJkYXRhIiwiZXJyb3IiLCJjb25zb2xlIiwic3RhY2siLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJtZXNzYWdlIiwicHVibGlzaCIsImNvbmZpZyIsImdldFN0ZWVkb3NDb25maWciLCJ0ZW5hbnQiLCJzYWFzIiwiaXNfZGVsZXRlZCIsIiRuZSIsImNoYW5nZV90aW1lIiwiJGd0ZSIsIkRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsVUFBQSxFQUFBQyxLQUFBLEVBQUFDLDBCQUFBLEVBQUFDLFFBQUEsRUFBQUMsV0FBQSxFQUFBQyxXQUFBOztBQUFBSixRQUFRSyxRQUFRLE9BQVIsQ0FBUjtBQUNBRixjQUFjRSxRQUFRLGVBQVIsQ0FBZDtBQUNBRCxjQUFjQyxRQUFRLGVBQVIsQ0FBZDtBQUNBSCxXQUFXRyxRQUFRLG1CQUFSLENBQVg7O0FBRUFOLGFBQWEsVUFBQ08sSUFBRDtBQUNaLE1BQUFDLE1BQUEsRUFBQUMsR0FBQSxFQUFBQyxJQUFBOztBQUFBLE9BQUFILFFBQUEsUUFBQUUsTUFBQUYsS0FBQUMsTUFBQSxZQUFBQyxJQUFpQkUsaUJBQWpCLEtBQUcsTUFBSCxHQUFHLE1BQUgsTUFBd0MsT0FBeEM7QUFDQ0gsYUFBUyxPQUFUO0FBREQsU0FFSyxLQUFBRCxRQUFBLFFBQUFHLE9BQUFILEtBQUFDLE1BQUEsWUFBQUUsS0FBaUJDLGlCQUFqQixLQUFHLE1BQUgsR0FBRyxNQUFILE1BQXdDLE9BQXhDO0FBQ0pILGFBQVMsSUFBVDtBQURJO0FBR0pBLGFBQVMsT0FBVDtBQ09DOztBRE5GLFNBQU9BLE1BQVA7QUFQWSxDQUFiOztBQVNBTiw2QkFBNkIsVUFBQ1UsTUFBRCxFQUFTQyxPQUFULEVBQWtCQyxVQUFsQjtBQUM1QixN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eUJKLGFBQU87QUFBaEM7QUFBVCxHQUFqSCxDQ3VCQztBRDNCRixHOzs7Ozs7Ozs7Ozs7QUVQQStELE9BQU84QyxPQUFQLENBQWUsd0JBQWYsRUFBeUMsVUFBQzdHLEtBQUQ7QUFDeEMsTUFBQUosU0FBQSxFQUFBSCxNQUFBO0FBQUFBLFdBQVMsS0FBS0EsTUFBZDs7QUFDQSxNQUFHLENBQUNBLE1BQUo7QUFDQztBQ0VDOztBRERGRyxjQUFZQyxRQUFRQyxhQUFSLENBQXNCLGFBQXRCLEVBQXFDQyxPQUFyQyxDQUE2QztBQUFDQyxXQUFPQSxLQUFSO0FBQWVaLFVBQU1LO0FBQXJCLEdBQTdDLEVBQTJFO0FBQUNRLFlBQVE7QUFBQ0MsZUFBUztBQUFWO0FBQVQsR0FBM0UsQ0FBWjs7QUFDQSxNQUFHTixhQUFhQSxVQUFVTSxPQUExQjtBQ1VHLFdEVEZMLFFBQVFDLGFBQVIsQ0FBc0IsZ0JBQXRCLEVBQXdDZ0QsSUFBeEMsQ0FBNkM7QUFBQzlDLGFBQU87QUFBQ3lELGFBQUssQ0FBQyxJQUFELEVBQU96RCxLQUFQO0FBQU4sT0FBUjtBQUE4QkcsZ0JBQVVQLFVBQVVNO0FBQWxELEtBQTdDLEVBQXlHO0FBQUNELGNBQVE7QUFBQ1UsYUFBSyxDQUFOO0FBQVN5QyxrQkFBVSxDQUFuQjtBQUFzQmhELHFCQUFhO0FBQW5DO0FBQVQsS0FBekcsQ0NTRTtBQVlEO0FEM0JILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0LWRhdGFiYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xvbmUgPSByZXF1aXJlKFwiY2xvbmVcIik7XG5zdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpO1xuc3RlZWRvc0kxOG4gPSByZXF1aXJlKFwiQHN0ZWVkb3MvaTE4blwiKTtcbm9iamVjdHFsID0gcmVxdWlyZShcIkBzdGVlZG9zL29iamVjdHFsXCIpO1xuXG5fZ2V0TG9jYWxlID0gKHVzZXIpLT5cblx0aWYgdXNlcj8ubG9jYWxlPy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICd6aC1jbidcblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblx0ZWxzZSBpZiB1c2VyPy5sb2NhbGU/LnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ2VuLXVzJ1xuXHRcdGxvY2FsZSA9IFwiZW5cIlxuXHRlbHNlXG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdHJldHVybiBsb2NhbGVcblxuZ2V0VXNlclByb2ZpbGVPYmplY3RMYXlvdXQgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3ROYW1lKS0+XG5cdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KVxuXHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIik/LmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGUsIG9iamVjdF9uYW1lOiBvYmplY3ROYW1lfSk7XG5cbkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9jcmVhdG9yLzpzcGFjZS9vYmplY3RzLzpfaWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdF9pZCA9IHJlcS5wYXJhbXMuX2lkXG5cdFx0c3BhY2VJZCA9IHJlcS5wYXJhbXMuc3BhY2Vcblx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxuXG5cdFx0dHlwZSA9IHJlcS5xdWVyeT8udHlwZVxuXG5cdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0cycpLmZpbmRPbmUoX2lkKSB8fCB7fVxuXG5cdFx0b2JqZWN0ID0ge31cblx0XHRpZiAhXy5pc0VtcHR5KF9vYmplY3QpXG5cdFx0XHRpc1NwYWNlQWRtaW4gPSBmYWxzZVxuXHRcdFx0c3BhY2VVc2VyID0gbnVsbFxuXHRcdFx0aWYgdXNlcklkXG5cdFx0XHRcdGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZClcblx0XHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXG5cblx0XHRcdHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2FkbWluJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdFx0cHNldHNNZW1iZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ21lbWJlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRcdHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2d1ZXN0J30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXG5cdFx0XHRwc2V0c1N1cHBsaWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdzdXBwbGllcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRcdHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ2N1c3RvbWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxuXHRcdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3NwYWNlOiBzcGFjZUlkLCAkb3I6IFt7dXNlcnM6IHVzZXJJZH0sIHtuYW1lOiBzcGFjZVVzZXIucHJvZmlsZX1dfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxuXG5cdFx0XHRwc2V0c0FkbWluX3BvcyA9IG51bGxcblx0XHRcdHBzZXRzVXNlcl9wb3MgPSBudWxsXG5cdFx0XHRwc2V0c01lbWJlcl9wb3MgPSBudWxsXG5cdFx0XHRwc2V0c0d1ZXN0X3BvcyA9IG51bGxcblx0XHRcdHBzZXRzQ3VycmVudF9wb3MgPSBudWxsXG5cdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGxcblx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gbnVsbFxuXG5cdFx0XHRpZiBwc2V0c0FkbWluPy5faWRcblx0XHRcdFx0cHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxuXHRcdFx0XHRwc2V0c1VzZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1VzZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0XHRpZiBwc2V0c01lbWJlcj8uX2lkXG5cdFx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0XHRpZiBwc2V0c0d1ZXN0Py5faWRcblx0XHRcdFx0cHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0XHRpZiBwc2V0c1N1cHBsaWVyPy5faWRcblx0XHRcdFx0cHNldHNTdXBwbGllcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzU3VwcGxpZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cdFx0XHRpZiBwc2V0c0N1c3RvbWVyPy5faWRcblx0XHRcdFx0cHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXG5cblx0XHRcdGlmIHBzZXRzQ3VycmVudC5sZW5ndGggPiAwXG5cdFx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJfaWRcIlxuXHRcdFx0XHRwc2V0c0N1cnJlbnRfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiB7JGluOiBzZXRfaWRzfX0pLmZldGNoKClcblx0XHRcdFx0cHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJuYW1lXCJcblxuXHRcdFx0cHNldHMgPSB7XG5cdFx0XHRcdHBzZXRzQWRtaW4sXG5cdFx0XHRcdHBzZXRzVXNlcixcblx0XHRcdFx0cHNldHNDdXJyZW50LFxuXHRcdFx0XHRwc2V0c01lbWJlcixcblx0XHRcdFx0cHNldHNHdWVzdCxcblx0XHRcdFx0cHNldHNTdXBwbGllcixcblx0XHRcdFx0cHNldHNDdXN0b21lcixcblx0XHRcdFx0aXNTcGFjZUFkbWluLFxuXHRcdFx0XHRzcGFjZVVzZXIsXG5cdFx0XHRcdHBzZXRzQWRtaW5fcG9zLFxuXHRcdFx0XHRwc2V0c1VzZXJfcG9zLFxuXHRcdFx0XHRwc2V0c01lbWJlcl9wb3MsXG5cdFx0XHRcdHBzZXRzR3Vlc3RfcG9zLFxuXHRcdFx0XHRwc2V0c1N1cHBsaWVyX3Bvcyxcblx0XHRcdFx0cHNldHNDdXN0b21lcl9wb3MsXG5cdFx0XHRcdHBzZXRzQ3VycmVudF9wb3Ncblx0XHRcdH1cblxuXHRcdFx0aWYgaXNTcGFjZUFkbWluIHx8IF9vYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT0gJzAnICYmIF9vYmplY3QuaXNfZW5hYmxlXG5cdFx0XHRcdGlmIF9vYmplY3QuZGF0YXNvdXJjZSAhPSAnZGVmYXVsdCdcblx0XHRcdFx0XHRhdXRoVG9rZW4gPSBTdGVlZG9zLmdldEF1dGhUb2tlbihyZXEsIHJlcylcblx0XHRcdFx0XHR1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpLT5cblx0XHRcdFx0XHRcdHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpLT5cblx0XHRcdFx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdFx0XHRcdCkoYXV0aFRva2VuLCBzcGFjZUlkKVxuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gTWV0ZW9yLndyYXBBc3luYyAodiwgdXNlclNlc3Npb24sIGNiKS0+XG5cdFx0XHRcdFx0XHR2LmdldFVzZXJPYmplY3RQZXJtaXNzaW9uKHVzZXJTZXNzaW9uKS50aGVuIChyZXNvbHZlLCByZWplY3QpLT5cblx0XHRcdFx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShvYmplY3RxbC5nZXRPYmplY3QoX29iamVjdC5uYW1lKS50b0NvbmZpZygpKSwgc3BhY2VJZClcblx0XHRcdFx0XHRvYmplY3QuZGF0YWJhc2VfbmFtZSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImRhdGFzb3VyY2VzXCIpLmZpbmRPbmUoe19pZDogX29iamVjdC5kYXRhc291cmNlfSk/LmxhYmVsXG5cdFx0XHRcdFx0b2JqZWN0LnBlcm1pc3Npb25zID0gcGVybWlzc2lvbnMob2JqZWN0cWwuZ2V0T2JqZWN0KF9vYmplY3QubmFtZSksIHVzZXJTZXNzaW9uKVxuXHRcdFx0XHRlbHNlXG5cblx0XHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW19vYmplY3QubmFtZV0pLCBzcGFjZUlkKSAjIENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbX29iamVjdC5uYW1lXSksIHNwYWNlSWQpICMgQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKG5ldyBDcmVhdG9yLk9iamVjdChfb2JqZWN0KSksIHNwYWNlSWQpO1xuXHRcdFx0XHRcdG9iamVjdC5wZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3QubmFtZSlcblxuXHRcdFx0XHRkZWxldGUgb2JqZWN0LmRiXG5cdFx0XHRcdG9iamVjdC5saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpXG5cdFx0XHRcdGxuZyA9IF9nZXRMb2NhbGUoZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtsb2NhbGU6IDF9fSkpXG5cdFx0XHRcdHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uT2JqZWN0KGxuZywgb2JqZWN0Lm5hbWUsIE9iamVjdC5hc3NpZ24ob2JqZWN0LCB7ZGF0YXNvdXJjZTogX29iamVjdC5kYXRhc291cmNlfSkpXG5cdFx0XHRcdG9iamVjdExheW91dCA9IGdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0KHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpXG5cdFx0XHRcdGlmIG9iamVjdExheW91dFxuXHRcdFx0XHRcdF9maWVsZHMgPSB7fTtcblx0XHRcdFx0XHRfLmVhY2ggb2JqZWN0TGF5b3V0LmZpZWxkcywgKF9pdGVtKS0+XG5cdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXSA9IG9iamVjdC5maWVsZHNbX2l0ZW0uZmllbGRdXG5cdFx0XHRcdFx0XHRpZiBfLmhhcyhfaXRlbSwgJ2dyb3VwJylcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0uZ3JvdXAgPSBfaXRlbS5ncm91cFxuXHRcdFx0XHRcdFx0aWYgX2l0ZW0ucmVxdWlyZWRcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVhZG9ubHkgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5kaXNhYmxlZCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlcXVpcmVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBfaXRlbS5yZWFkb25seVxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5yZWFkb25seSA9IHRydWVcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0uZGlzYWJsZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlcXVpcmVkID0gZmFsc2Vcblx0XHRcdFx0XHRvYmplY3QuZmllbGRzID0gX2ZpZWxkc1xuXHRcdFx0XHRcdG9iamVjdC5hbGxvd19jdXN0b21BY3Rpb25zID0gb2JqZWN0TGF5b3V0LmFjdGlvbnMgfHwgW11cblx0XHRcdFx0XHRvYmplY3QuZXhjbHVkZV9hY3Rpb25zID0gb2JqZWN0TGF5b3V0LmV4Y2x1ZGVfYWN0aW9ucyB8fCBbXVxuXHRcdFx0XHRcdG9iamVjdC5hbGxvd19yZWxhdGVkTGlzdCA9IG9iamVjdExheW91dC5yZWxhdGVkTGlzdCB8fCBbXVxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YTogb2JqZWN0XG5cdFx0fVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxuXHRcdH0iLCJ2YXIgX2dldExvY2FsZSwgY2xvbmUsIGdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0LCBvYmplY3RxbCwgc3RlZWRvc0F1dGgsIHN0ZWVkb3NJMThuO1xuXG5jbG9uZSA9IHJlcXVpcmUoXCJjbG9uZVwiKTtcblxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcblxuc3RlZWRvc0kxOG4gPSByZXF1aXJlKFwiQHN0ZWVkb3MvaTE4blwiKTtcblxub2JqZWN0cWwgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvb2JqZWN0cWxcIik7XG5cbl9nZXRMb2NhbGUgPSBmdW5jdGlvbih1c2VyKSB7XG4gIHZhciBsb2NhbGUsIHJlZiwgcmVmMTtcbiAgaWYgKCh1c2VyICE9IG51bGwgPyAocmVmID0gdXNlci5sb2NhbGUpICE9IG51bGwgPyByZWYudG9Mb2NhbGVMb3dlckNhc2UoKSA6IHZvaWQgMCA6IHZvaWQgMCkgPT09ICd6aC1jbicpIHtcbiAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gIH0gZWxzZSBpZiAoKHVzZXIgIT0gbnVsbCA/IChyZWYxID0gdXNlci5sb2NhbGUpICE9IG51bGwgPyByZWYxLnRvTG9jYWxlTG93ZXJDYXNlKCkgOiB2b2lkIDAgOiB2b2lkIDApID09PSAnZW4tdXMnKSB7XG4gICAgbG9jYWxlID0gXCJlblwiO1xuICB9IGVsc2Uge1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgfVxuICByZXR1cm4gbG9jYWxlO1xufTtcblxuZ2V0VXNlclByb2ZpbGVPYmplY3RMYXlvdXQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdE5hbWUpIHtcbiAgdmFyIHJlZiwgc3BhY2VVc2VyO1xuICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgcHJvZmlsZTogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICByZXR1cm4gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9sYXlvdXRzXCIpKSAhPSBudWxsID8gcmVmLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGUsXG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0TmFtZVxuICAgIH0pIDogdm9pZCAwO1xuICB9XG59O1xuXG5Kc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvY3JlYXRvci86c3BhY2Uvb2JqZWN0cy86X2lkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIF9maWVsZHMsIF9pZCwgX29iamVjdCwgYXV0aFRva2VuLCBlLCBpc1NwYWNlQWRtaW4sIGxuZywgb2JqZWN0LCBvYmplY3RMYXlvdXQsIHBlcm1pc3Npb25zLCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNBZG1pbl9wb3MsIHBzZXRzQ3VycmVudCwgcHNldHNDdXJyZW50TmFtZXMsIHBzZXRzQ3VycmVudF9wb3MsIHBzZXRzQ3VzdG9tZXIsIHBzZXRzQ3VzdG9tZXJfcG9zLCBwc2V0c0d1ZXN0LCBwc2V0c0d1ZXN0X3BvcywgcHNldHNNZW1iZXIsIHBzZXRzTWVtYmVyX3BvcywgcHNldHNTdXBwbGllciwgcHNldHNTdXBwbGllcl9wb3MsIHBzZXRzVXNlciwgcHNldHNVc2VyX3BvcywgcmVmLCByZWYxLCBzZXRfaWRzLCBzcGFjZUlkLCBzcGFjZVVzZXIsIHR5cGUsIHVzZXJJZCwgdXNlclNlc3Npb247XG4gIHRyeSB7XG4gICAgX2lkID0gcmVxLnBhcmFtcy5faWQ7XG4gICAgc3BhY2VJZCA9IHJlcS5wYXJhbXMuc3BhY2U7XG4gICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgdHlwZSA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMDtcbiAgICBfb2JqZWN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3RzJykuZmluZE9uZShfaWQpIHx8IHt9O1xuICAgIG9iamVjdCA9IHt9O1xuICAgIGlmICghXy5pc0VtcHR5KF9vYmplY3QpKSB7XG4gICAgICBpc1NwYWNlQWRtaW4gPSBmYWxzZTtcbiAgICAgIHNwYWNlVXNlciA9IG51bGw7XG4gICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgIGlzU3BhY2VBZG1pbiA9IENyZWF0b3IuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHVzZXJJZCk7XG4gICAgICAgIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgIHVzZXI6IHVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIG5hbWU6ICdhZG1pbidcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkgfHwgbnVsbDtcbiAgICAgIHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgbmFtZTogJ3VzZXInXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pIHx8IG51bGw7XG4gICAgICBwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgbmFtZTogJ21lbWJlcidcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkgfHwgbnVsbDtcbiAgICAgIHBzZXRzR3Vlc3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIG5hbWU6ICdndWVzdCdcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkgfHwgbnVsbDtcbiAgICAgIHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIG5hbWU6ICdzdXBwbGllcidcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkgfHwgbnVsbDtcbiAgICAgIHBzZXRzQ3VzdG9tZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgIG5hbWU6ICdjdXN0b21lcidcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkgfHwgbnVsbDtcbiAgICAgIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVzZXJzOiB1c2VySWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgbmFtZTogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7XG4gICAgICAgICAgdXNlcnM6IHVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIHBzZXRzQWRtaW5fcG9zID0gbnVsbDtcbiAgICAgIHBzZXRzVXNlcl9wb3MgPSBudWxsO1xuICAgICAgcHNldHNNZW1iZXJfcG9zID0gbnVsbDtcbiAgICAgIHBzZXRzR3Vlc3RfcG9zID0gbnVsbDtcbiAgICAgIHBzZXRzQ3VycmVudF9wb3MgPSBudWxsO1xuICAgICAgcHNldHNTdXBwbGllcl9wb3MgPSBudWxsO1xuICAgICAgcHNldHNDdXN0b21lcl9wb3MgPSBudWxsO1xuICAgICAgaWYgKHBzZXRzQWRtaW4gIT0gbnVsbCA/IHBzZXRzQWRtaW4uX2lkIDogdm9pZCAwKSB7XG4gICAgICAgIHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBpZiAocHNldHNVc2VyICE9IG51bGwgPyBwc2V0c1VzZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICAgIHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgaWYgKHBzZXRzTWVtYmVyICE9IG51bGwgPyBwc2V0c01lbWJlci5faWQgOiB2b2lkIDApIHtcbiAgICAgICAgcHNldHNNZW1iZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c01lbWJlci5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgaWYgKHBzZXRzR3Vlc3QgIT0gbnVsbCA/IHBzZXRzR3Vlc3QuX2lkIDogdm9pZCAwKSB7XG4gICAgICAgIHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBpZiAocHNldHNTdXBwbGllciAhPSBudWxsID8gcHNldHNTdXBwbGllci5faWQgOiB2b2lkIDApIHtcbiAgICAgICAgcHNldHNTdXBwbGllcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzU3VwcGxpZXIuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGlmIChwc2V0c0N1c3RvbWVyICE9IG51bGwgPyBwc2V0c0N1c3RvbWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNDdXN0b21lci5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgaWYgKHBzZXRzQ3VycmVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNldF9pZHMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJfaWRcIik7XG4gICAgICAgIHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHtcbiAgICAgICAgICAgICRpbjogc2V0X2lkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgcHNldHNDdXJyZW50TmFtZXMgPSBfLnBsdWNrKHBzZXRzQ3VycmVudCwgXCJuYW1lXCIpO1xuICAgICAgfVxuICAgICAgcHNldHMgPSB7XG4gICAgICAgIHBzZXRzQWRtaW46IHBzZXRzQWRtaW4sXG4gICAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudCxcbiAgICAgICAgcHNldHNNZW1iZXI6IHBzZXRzTWVtYmVyLFxuICAgICAgICBwc2V0c0d1ZXN0OiBwc2V0c0d1ZXN0LFxuICAgICAgICBwc2V0c1N1cHBsaWVyOiBwc2V0c1N1cHBsaWVyLFxuICAgICAgICBwc2V0c0N1c3RvbWVyOiBwc2V0c0N1c3RvbWVyLFxuICAgICAgICBpc1NwYWNlQWRtaW46IGlzU3BhY2VBZG1pbixcbiAgICAgICAgc3BhY2VVc2VyOiBzcGFjZVVzZXIsXG4gICAgICAgIHBzZXRzQWRtaW5fcG9zOiBwc2V0c0FkbWluX3BvcyxcbiAgICAgICAgcHNldHNVc2VyX3BvczogcHNldHNVc2VyX3BvcyxcbiAgICAgICAgcHNldHNNZW1iZXJfcG9zOiBwc2V0c01lbWJlcl9wb3MsXG4gICAgICAgIHBzZXRzR3Vlc3RfcG9zOiBwc2V0c0d1ZXN0X3BvcyxcbiAgICAgICAgcHNldHNTdXBwbGllcl9wb3M6IHBzZXRzU3VwcGxpZXJfcG9zLFxuICAgICAgICBwc2V0c0N1c3RvbWVyX3BvczogcHNldHNDdXN0b21lcl9wb3MsXG4gICAgICAgIHBzZXRzQ3VycmVudF9wb3M6IHBzZXRzQ3VycmVudF9wb3NcbiAgICAgIH07XG4gICAgICBpZiAoaXNTcGFjZUFkbWluIHx8IF9vYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT09ICcwJyAmJiBfb2JqZWN0LmlzX2VuYWJsZSkge1xuICAgICAgICBpZiAoX29iamVjdC5kYXRhc291cmNlICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgICBhdXRoVG9rZW4gPSBTdGVlZG9zLmdldEF1dGhUb2tlbihyZXEsIHJlcyk7XG4gICAgICAgICAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KShhdXRoVG9rZW4sIHNwYWNlSWQpO1xuICAgICAgICAgIHBlcm1pc3Npb25zID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbih2LCB1c2VyU2Vzc2lvbiwgY2IpIHtcbiAgICAgICAgICAgIHJldHVybiB2LmdldFVzZXJPYmplY3RQZXJtaXNzaW9uKHVzZXJTZXNzaW9uKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9iamVjdCA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShvYmplY3RxbC5nZXRPYmplY3QoX29iamVjdC5uYW1lKS50b0NvbmZpZygpKSwgc3BhY2VJZCk7XG4gICAgICAgICAgb2JqZWN0LmRhdGFiYXNlX25hbWUgPSAocmVmMSA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImRhdGFzb3VyY2VzXCIpLmZpbmRPbmUoe1xuICAgICAgICAgICAgX2lkOiBfb2JqZWN0LmRhdGFzb3VyY2VcbiAgICAgICAgICB9KSkgIT0gbnVsbCA/IHJlZjEubGFiZWwgOiB2b2lkIDA7XG4gICAgICAgICAgb2JqZWN0LnBlcm1pc3Npb25zID0gcGVybWlzc2lvbnMob2JqZWN0cWwuZ2V0T2JqZWN0KF9vYmplY3QubmFtZSksIHVzZXJTZXNzaW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW19vYmplY3QubmFtZV0pLCBzcGFjZUlkKTtcbiAgICAgICAgICBvYmplY3QucGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0Lm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBvYmplY3QuZGI7XG4gICAgICAgIG9iamVjdC5saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpO1xuICAgICAgICBsbmcgPSBfZ2V0TG9jYWxlKGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBsb2NhbGU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgICAgc3RlZWRvc0kxOG4udHJhbnNsYXRpb25PYmplY3QobG5nLCBvYmplY3QubmFtZSwgT2JqZWN0LmFzc2lnbihvYmplY3QsIHtcbiAgICAgICAgICBkYXRhc291cmNlOiBfb2JqZWN0LmRhdGFzb3VyY2VcbiAgICAgICAgfSkpO1xuICAgICAgICBvYmplY3RMYXlvdXQgPSBnZXRVc2VyUHJvZmlsZU9iamVjdExheW91dCh1c2VySWQsIHNwYWNlSWQsIG9iamVjdC5uYW1lKTtcbiAgICAgICAgaWYgKG9iamVjdExheW91dCkge1xuICAgICAgICAgIF9maWVsZHMgPSB7fTtcbiAgICAgICAgICBfLmVhY2gob2JqZWN0TGF5b3V0LmZpZWxkcywgZnVuY3Rpb24oX2l0ZW0pIHtcbiAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdID0gb2JqZWN0LmZpZWxkc1tfaXRlbS5maWVsZF07XG4gICAgICAgICAgICBpZiAoXy5oYXMoX2l0ZW0sICdncm91cCcpKSB7XG4gICAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdLmdyb3VwID0gX2l0ZW0uZ3JvdXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX2l0ZW0ucmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVhZG9ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX2l0ZW0ucmVhZG9ubHkpIHtcbiAgICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJldHVybiBfZmllbGRzW19pdGVtLmZpZWxkXS5yZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9iamVjdC5maWVsZHMgPSBfZmllbGRzO1xuICAgICAgICAgIG9iamVjdC5hbGxvd19jdXN0b21BY3Rpb25zID0gb2JqZWN0TGF5b3V0LmFjdGlvbnMgfHwgW107XG4gICAgICAgICAgb2JqZWN0LmV4Y2x1ZGVfYWN0aW9ucyA9IG9iamVjdExheW91dC5leGNsdWRlX2FjdGlvbnMgfHwgW107XG4gICAgICAgICAgb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0ID0gb2JqZWN0TGF5b3V0LnJlbGF0ZWRMaXN0IHx8IFtdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBvYmplY3RcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIm9iamVjdHFsID0gcmVxdWlyZShcIkBzdGVlZG9zL29iamVjdHFsXCIpO1xuTWV0ZW9yLnB1Ymxpc2ggXCJjcmVhdG9yX29iamVjdHNcIiwgKHNwYWNlKS0+XG5cdCNUT0RPIOagueaNruadg+mZkOi/lOWbnk9iamVjdHPorrDlvZVcblx0Y29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xuXHRpZiBjb25maWcudGVuYW50ICYmIGNvbmZpZy50ZW5hbnQuc2Fhc1xuXHRcdHJldHVyblxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmQoe3NwYWNlOiB7JGluOiBbbnVsbCwgc3BhY2VdfSwgaXNfZGVsZXRlZDogeyRuZTogdHJ1ZX19LCB7ZmllbGRzOiB7X2lkOiAxLCBtb2RpZmllZDogMSwgaXNfZW5hYmxlOiAxLCBpbl9kZXZlbG9wbWVudDogMSwgbmFtZTogMX19KVxuTWV0ZW9yLnB1Ymxpc2ggXCJjcmVhdG9yX3JlbG9hZF9vYmplY3RfbG9nc1wiLCAoc3BhY2UpLT5cblx0Y29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xuXHRpZiBjb25maWcudGVuYW50ICYmIGNvbmZpZy50ZW5hbnQuc2Fhc1xuXHRcdHJldHVyblxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJfb2JqZWN0X3JlbG9hZF9sb2dzXCIpLmZpbmQoe3NwYWNlOiB7JGluOiBbbnVsbCwgc3BhY2VdfSwgY2hhbmdlX3RpbWU6IHskZ3RlOm5ldyBEYXRlKCl9fSwge2ZpZWxkczoge19pZDogMSwgb2JqZWN0X25hbWU6IDEsIHNwYWNlOiAxfX0pXG4iLCJ2YXIgb2JqZWN0cWw7XG5cbm9iamVjdHFsID0gcmVxdWlyZShcIkBzdGVlZG9zL29iamVjdHFsXCIpO1xuXG5NZXRlb3IucHVibGlzaChcImNyZWF0b3Jfb2JqZWN0c1wiLCBmdW5jdGlvbihzcGFjZSkge1xuICB2YXIgY29uZmlnO1xuICBjb25maWcgPSBvYmplY3RxbC5nZXRTdGVlZG9zQ29uZmlnKCk7XG4gIGlmIChjb25maWcudGVuYW50ICYmIGNvbmZpZy50ZW5hbnQuc2Fhcykge1xuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kKHtcbiAgICBzcGFjZToge1xuICAgICAgJGluOiBbbnVsbCwgc3BhY2VdXG4gICAgfSxcbiAgICBpc19kZWxldGVkOiB7XG4gICAgICAkbmU6IHRydWVcbiAgICB9XG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIF9pZDogMSxcbiAgICAgIG1vZGlmaWVkOiAxLFxuICAgICAgaXNfZW5hYmxlOiAxLFxuICAgICAgaW5fZGV2ZWxvcG1lbnQ6IDEsXG4gICAgICBuYW1lOiAxXG4gICAgfVxuICB9KTtcbn0pO1xuXG5NZXRlb3IucHVibGlzaChcImNyZWF0b3JfcmVsb2FkX29iamVjdF9sb2dzXCIsIGZ1bmN0aW9uKHNwYWNlKSB7XG4gIHZhciBjb25maWc7XG4gIGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcbiAgaWYgKGNvbmZpZy50ZW5hbnQgJiYgY29uZmlnLnRlbmFudC5zYWFzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJfb2JqZWN0X3JlbG9hZF9sb2dzXCIpLmZpbmQoe1xuICAgIHNwYWNlOiB7XG4gICAgICAkaW46IFtudWxsLCBzcGFjZV1cbiAgICB9LFxuICAgIGNoYW5nZV90aW1lOiB7XG4gICAgICAkZ3RlOiBuZXcgRGF0ZSgpXG4gICAgfVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBfaWQ6IDEsXG4gICAgICBvYmplY3RfbmFtZTogMSxcbiAgICAgIHNwYWNlOiAxXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJwdWJsaXNoX29iamVjdF9sYXlvdXRzXCIsIChzcGFjZSktPlxuXHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRpZiAhdXNlcklkXG5cdFx0cmV0dXJuXG5cdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZSwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSlcblx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIikuZmluZCh7c3BhY2U6IHskaW46IFtudWxsLCBzcGFjZV19LCBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGV9LCB7ZmllbGRzOiB7X2lkOiAxLCBtb2RpZmllZDogMSwgb2JqZWN0X25hbWU6IDF9fSkiLCJNZXRlb3IucHVibGlzaChcInB1Ymxpc2hfb2JqZWN0X2xheW91dHNcIiwgZnVuY3Rpb24oc3BhY2UpIHtcbiAgdmFyIHNwYWNlVXNlciwgdXNlcklkO1xuICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgaWYgKCF1c2VySWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwcm9maWxlOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGF5b3V0c1wiKS5maW5kKHtcbiAgICAgIHNwYWNlOiB7XG4gICAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgICAgfSxcbiAgICAgIHByb2ZpbGVzOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIG1vZGlmaWVkOiAxLFxuICAgICAgICBvYmplY3RfbmFtZTogMVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
