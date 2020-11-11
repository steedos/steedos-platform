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
      in_development: 1
    }
  });
});
Meteor.publish("creator_reload_object_logs", function (space) {
  var config;
  config = objectql.getSteedosConfig();

  if (config.tenant && config.tenant.saas) {
    return;
  }

  return Creator.getCollection("reload_object_logs").find({
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfbGF5b3V0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvb2JqZWN0X2xheW91dHMuY29mZmVlIl0sIm5hbWVzIjpbIl9nZXRMb2NhbGUiLCJjbG9uZSIsImdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0Iiwib2JqZWN0cWwiLCJzdGVlZG9zQXV0aCIsInN0ZWVkb3NJMThuIiwicmVxdWlyZSIsInVzZXIiLCJsb2NhbGUiLCJyZWYiLCJyZWYxIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJ1c2VySWQiLCJzcGFjZUlkIiwib2JqZWN0TmFtZSIsInNwYWNlVXNlciIsIkNyZWF0b3IiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsInNwYWNlIiwiZmllbGRzIiwicHJvZmlsZSIsInByb2ZpbGVzIiwib2JqZWN0X25hbWUiLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsIl9maWVsZHMiLCJfaWQiLCJfb2JqZWN0IiwiYXV0aFRva2VuIiwiZSIsImlzU3BhY2VBZG1pbiIsImxuZyIsIm9iamVjdCIsIm9iamVjdExheW91dCIsInBlcm1pc3Npb25zIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwidHlwZSIsInVzZXJTZXNzaW9uIiwicGFyYW1zIiwiaGVhZGVycyIsInF1ZXJ5IiwiXyIsImlzRW1wdHkiLCJuYW1lIiwiYXNzaWduZWRfYXBwcyIsImZpbmQiLCIkb3IiLCJ1c2VycyIsImZldGNoIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJsZW5ndGgiLCJwbHVjayIsIiRpbiIsImluX2RldmVsb3BtZW50IiwiaXNfZW5hYmxlIiwiZGF0YXNvdXJjZSIsIlN0ZWVkb3MiLCJnZXRBdXRoVG9rZW4iLCJNZXRlb3IiLCJ3cmFwQXN5bmMiLCJjYiIsImdldFNlc3Npb24iLCJ0aGVuIiwicmVzb2x2ZSIsInJlamVjdCIsInYiLCJnZXRVc2VyT2JqZWN0UGVybWlzc2lvbiIsImNvbnZlcnRPYmplY3QiLCJnZXRPYmplY3QiLCJ0b0NvbmZpZyIsImRhdGFiYXNlX25hbWUiLCJsYWJlbCIsIk9iamVjdHMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImJpbmQiLCJkYiIsImxpc3Rfdmlld3MiLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwidHJhbnNsYXRpb25PYmplY3QiLCJPYmplY3QiLCJhc3NpZ24iLCJlYWNoIiwiX2l0ZW0iLCJmaWVsZCIsImhhcyIsImdyb3VwIiwicmVxdWlyZWQiLCJyZWFkb25seSIsImRpc2FibGVkIiwiYWxsb3dfY3VzdG9tQWN0aW9ucyIsImFjdGlvbnMiLCJleGNsdWRlX2FjdGlvbnMiLCJhbGxvd19yZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0Iiwic2VuZFJlc3VsdCIsImNvZGUiLCJkYXRhIiwiZXJyb3IiLCJjb25zb2xlIiwic3RhY2siLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJtZXNzYWdlIiwicHVibGlzaCIsImNvbmZpZyIsImdldFN0ZWVkb3NDb25maWciLCJ0ZW5hbnQiLCJzYWFzIiwiaXNfZGVsZXRlZCIsIiRuZSIsImNoYW5nZV90aW1lIiwiJGd0ZSIsIkRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsVUFBQSxFQUFBQyxLQUFBLEVBQUFDLDBCQUFBLEVBQUFDLFFBQUEsRUFBQUMsV0FBQSxFQUFBQyxXQUFBOztBQUFBSixRQUFRSyxRQUFRLE9BQVIsQ0FBUjtBQUNBRixjQUFjRSxRQUFRLGVBQVIsQ0FBZDtBQUNBRCxjQUFjQyxRQUFRLGVBQVIsQ0FBZDtBQUNBSCxXQUFXRyxRQUFRLG1CQUFSLENBQVg7O0FBRUFOLGFBQWEsVUFBQ08sSUFBRDtBQUNaLE1BQUFDLE1BQUEsRUFBQUMsR0FBQSxFQUFBQyxJQUFBOztBQUFBLE9BQUFILFFBQUEsUUFBQUUsTUFBQUYsS0FBQUMsTUFBQSxZQUFBQyxJQUFpQkUsaUJBQWpCLEtBQUcsTUFBSCxHQUFHLE1BQUgsTUFBd0MsT0FBeEM7QUFDQ0gsYUFBUyxPQUFUO0FBREQsU0FFSyxLQUFBRCxRQUFBLFFBQUFHLE9BQUFILEtBQUFDLE1BQUEsWUFBQUUsS0FBaUJDLGlCQUFqQixLQUFHLE1BQUgsR0FBRyxNQUFILE1BQXdDLE9BQXhDO0FBQ0pILGFBQVMsSUFBVDtBQURJO0FBR0pBLGFBQVMsT0FBVDtBQ09DOztBRE5GLFNBQU9BLE1BQVA7QUFQWSxDQUFiOztBQVNBTiw2QkFBNkIsVUFBQ1UsTUFBRCxFQUFTQyxPQUFULEVBQWtCQyxVQUFsQjtBQUM1QixN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LEdBQWhILENDc0JDO0FEMUJGLEc7Ozs7Ozs7Ozs7OztBRVBBK0QsT0FBTzhDLE9BQVAsQ0FBZSx3QkFBZixFQUF5QyxVQUFDN0csS0FBRDtBQUN4QyxNQUFBSixTQUFBLEVBQUFILE1BQUE7QUFBQUEsV0FBUyxLQUFLQSxNQUFkOztBQUNBLE1BQUcsQ0FBQ0EsTUFBSjtBQUNDO0FDRUM7O0FEREZHLGNBQVlDLFFBQVFDLGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNDLE9BQXJDLENBQTZDO0FBQUNDLFdBQU9BLEtBQVI7QUFBZVosVUFBTUs7QUFBckIsR0FBN0MsRUFBMkU7QUFBQ1EsWUFBUTtBQUFDQyxlQUFTO0FBQVY7QUFBVCxHQUEzRSxDQUFaOztBQUNBLE1BQUdOLGFBQWFBLFVBQVVNLE9BQTFCO0FDVUcsV0RURkwsUUFBUUMsYUFBUixDQUFzQixnQkFBdEIsRUFBd0NnRCxJQUF4QyxDQUE2QztBQUFDOUMsYUFBTztBQUFDeUQsYUFBSyxDQUFDLElBQUQsRUFBT3pELEtBQVA7QUFBTixPQUFSO0FBQThCRyxnQkFBVVAsVUFBVU07QUFBbEQsS0FBN0MsRUFBeUc7QUFBQ0QsY0FBUTtBQUFDVSxhQUFLLENBQU47QUFBU3lDLGtCQUFVLENBQW5CO0FBQXNCaEQscUJBQWE7QUFBbkM7QUFBVCxLQUF6RyxDQ1NFO0FBWUQ7QUQzQkgsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbG9uZSA9IHJlcXVpcmUoXCJjbG9uZVwiKTtcclxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcclxuc3RlZWRvc0kxOG4gPSByZXF1aXJlKFwiQHN0ZWVkb3MvaTE4blwiKTtcclxub2JqZWN0cWwgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvb2JqZWN0cWxcIik7XHJcblxyXG5fZ2V0TG9jYWxlID0gKHVzZXIpLT5cclxuXHRpZiB1c2VyPy5sb2NhbGU/LnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3poLWNuJ1xyXG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXHJcblx0ZWxzZSBpZiB1c2VyPy5sb2NhbGU/LnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ2VuLXVzJ1xyXG5cdFx0bG9jYWxlID0gXCJlblwiXHJcblx0ZWxzZVxyXG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXHJcblx0cmV0dXJuIGxvY2FsZVxyXG5cclxuZ2V0VXNlclByb2ZpbGVPYmplY3RMYXlvdXQgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3ROYW1lKS0+XHJcblx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pXHJcblx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIik/LmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGUsIG9iamVjdF9uYW1lOiBvYmplY3ROYW1lfSk7XHJcblxyXG5Kc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvY3JlYXRvci86c3BhY2Uvb2JqZWN0cy86X2lkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0X2lkID0gcmVxLnBhcmFtcy5faWRcclxuXHRcdHNwYWNlSWQgPSByZXEucGFyYW1zLnNwYWNlXHJcblx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxyXG5cclxuXHRcdHR5cGUgPSByZXEucXVlcnk/LnR5cGVcclxuXHJcblx0XHRfb2JqZWN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3RzJykuZmluZE9uZShfaWQpIHx8IHt9XHJcblxyXG5cdFx0b2JqZWN0ID0ge31cclxuXHRcdGlmICFfLmlzRW1wdHkoX29iamVjdClcclxuXHRcdFx0aXNTcGFjZUFkbWluID0gZmFsc2VcclxuXHRcdFx0c3BhY2VVc2VyID0gbnVsbFxyXG5cdFx0XHRpZiB1c2VySWRcclxuXHRcdFx0XHRpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRcdFx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7IHNwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWQgfSwgeyBmaWVsZHM6IHsgcHJvZmlsZTogMSB9IH0pXHJcblxyXG5cdFx0XHRwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0XHRwc2V0c01lbWJlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnbWVtYmVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0XHRwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHJcblx0XHRcdHBzZXRzU3VwcGxpZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgbmFtZTogJ3N1cHBsaWVyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkgfHwgbnVsbFxyXG5cdFx0XHRwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcclxuXHRcdFx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXHJcblx0XHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7c3BhY2U6IHNwYWNlSWQsICRvcjogW3t1c2VyczogdXNlcklkfSwge25hbWU6IHNwYWNlVXNlci5wcm9maWxlfV19LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxLCBuYW1lOjF9fSkuZmV0Y2goKVxyXG5cclxuXHRcdFx0cHNldHNBZG1pbl9wb3MgPSBudWxsXHJcblx0XHRcdHBzZXRzVXNlcl9wb3MgPSBudWxsXHJcblx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IG51bGxcclxuXHRcdFx0cHNldHNHdWVzdF9wb3MgPSBudWxsXHJcblx0XHRcdHBzZXRzQ3VycmVudF9wb3MgPSBudWxsXHJcblx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gbnVsbFxyXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGxcclxuXHJcblx0XHRcdGlmIHBzZXRzQWRtaW4/Ll9pZFxyXG5cdFx0XHRcdHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0XHRpZiBwc2V0c1VzZXI/Ll9pZFxyXG5cdFx0XHRcdHBzZXRzVXNlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzVXNlci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdFx0aWYgcHNldHNNZW1iZXI/Ll9pZFxyXG5cdFx0XHRcdHBzZXRzTWVtYmVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNNZW1iZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblx0XHRcdGlmIHBzZXRzR3Vlc3Q/Ll9pZFxyXG5cdFx0XHRcdHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxyXG5cdFx0XHRpZiBwc2V0c1N1cHBsaWVyPy5faWRcclxuXHRcdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWR9LCB7ZmllbGRzOiB7Y3JlYXRlZDogMCwgbW9kaWZpZWQ6IDAsIGNyZWF0ZWRfYnk6IDAsIG1vZGlmaWVkX2J5OiAwfX0pLmZldGNoKClcclxuXHRcdFx0aWYgcHNldHNDdXN0b21lcj8uX2lkXHJcblx0XHRcdFx0cHNldHNDdXN0b21lcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQ3VzdG9tZXIuX2lkfSwge2ZpZWxkczoge2NyZWF0ZWQ6IDAsIG1vZGlmaWVkOiAwLCBjcmVhdGVkX2J5OiAwLCBtb2RpZmllZF9ieTogMH19KS5mZXRjaCgpXHJcblxyXG5cdFx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxyXG5cdFx0XHRcdHNldF9pZHMgPSBfLnBsdWNrIHBzZXRzQ3VycmVudCwgXCJfaWRcIlxyXG5cdFx0XHRcdHBzZXRzQ3VycmVudF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHskaW46IHNldF9pZHN9fSkuZmV0Y2goKVxyXG5cdFx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXHJcblxyXG5cdFx0XHRwc2V0cyA9IHtcclxuXHRcdFx0XHRwc2V0c0FkbWluLFxyXG5cdFx0XHRcdHBzZXRzVXNlcixcclxuXHRcdFx0XHRwc2V0c0N1cnJlbnQsXHJcblx0XHRcdFx0cHNldHNNZW1iZXIsXHJcblx0XHRcdFx0cHNldHNHdWVzdCxcclxuXHRcdFx0XHRwc2V0c1N1cHBsaWVyLFxyXG5cdFx0XHRcdHBzZXRzQ3VzdG9tZXIsXHJcblx0XHRcdFx0aXNTcGFjZUFkbWluLFxyXG5cdFx0XHRcdHNwYWNlVXNlcixcclxuXHRcdFx0XHRwc2V0c0FkbWluX3BvcyxcclxuXHRcdFx0XHRwc2V0c1VzZXJfcG9zLFxyXG5cdFx0XHRcdHBzZXRzTWVtYmVyX3BvcyxcclxuXHRcdFx0XHRwc2V0c0d1ZXN0X3BvcyxcclxuXHRcdFx0XHRwc2V0c1N1cHBsaWVyX3BvcyxcclxuXHRcdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyxcclxuXHRcdFx0XHRwc2V0c0N1cnJlbnRfcG9zXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIGlzU3BhY2VBZG1pbiB8fCBfb2JqZWN0LmluX2RldmVsb3BtZW50ID09ICcwJyAmJiBfb2JqZWN0LmlzX2VuYWJsZVxyXG5cdFx0XHRcdGlmIF9vYmplY3QuZGF0YXNvdXJjZSAhPSAnZGVmYXVsdCdcclxuXHRcdFx0XHRcdGF1dGhUb2tlbiA9IFN0ZWVkb3MuZ2V0QXV0aFRva2VuKHJlcSwgcmVzKVxyXG5cdFx0XHRcdFx0dXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKS0+XHJcblx0XHRcdFx0XHRcdHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpLT5cclxuXHRcdFx0XHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXHJcblx0XHRcdFx0XHQpKGF1dGhUb2tlbiwgc3BhY2VJZClcclxuXHRcdFx0XHRcdHBlcm1pc3Npb25zID0gTWV0ZW9yLndyYXBBc3luYyAodiwgdXNlclNlc3Npb24sIGNiKS0+XHJcblx0XHRcdFx0XHRcdHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4gKHJlc29sdmUsIHJlamVjdCktPlxyXG5cdFx0XHRcdFx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcclxuXHRcdFx0XHRcdG9iamVjdCA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShvYmplY3RxbC5nZXRPYmplY3QoX29iamVjdC5uYW1lKS50b0NvbmZpZygpKSwgc3BhY2VJZClcclxuXHRcdFx0XHRcdG9iamVjdC5kYXRhYmFzZV9uYW1lID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZGF0YXNvdXJjZXNcIikuZmluZE9uZSh7X2lkOiBfb2JqZWN0LmRhdGFzb3VyY2V9KT8ubGFiZWxcclxuXHRcdFx0XHRcdG9iamVjdC5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKG9iamVjdHFsLmdldE9iamVjdChfb2JqZWN0Lm5hbWUpLCB1c2VyU2Vzc2lvbilcclxuXHRcdFx0XHRlbHNlXHJcblxyXG5cdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tfb2JqZWN0Lm5hbWVdKSwgc3BhY2VJZCkgIyBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW19vYmplY3QubmFtZV0pLCBzcGFjZUlkKSAjIENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShuZXcgQ3JlYXRvci5PYmplY3QoX29iamVjdCkpLCBzcGFjZUlkKTtcclxuXHRcdFx0XHRcdG9iamVjdC5wZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3QubmFtZSlcclxuXHJcblx0XHRcdFx0ZGVsZXRlIG9iamVjdC5kYlxyXG5cdFx0XHRcdG9iamVjdC5saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpXHJcblx0XHRcdFx0bG5nID0gX2dldExvY2FsZShkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge2xvY2FsZTogMX19KSlcclxuXHRcdFx0XHRzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk9iamVjdChsbmcsIG9iamVjdC5uYW1lLCBPYmplY3QuYXNzaWduKG9iamVjdCwge2RhdGFzb3VyY2U6IF9vYmplY3QuZGF0YXNvdXJjZX0pKVxyXG5cdFx0XHRcdG9iamVjdExheW91dCA9IGdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0KHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpXHJcblx0XHRcdFx0aWYgb2JqZWN0TGF5b3V0XHJcblx0XHRcdFx0XHRfZmllbGRzID0ge307XHJcblx0XHRcdFx0XHRfLmVhY2ggb2JqZWN0TGF5b3V0LmZpZWxkcywgKF9pdGVtKS0+XHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdID0gb2JqZWN0LmZpZWxkc1tfaXRlbS5maWVsZF1cclxuXHRcdFx0XHRcdFx0aWYgXy5oYXMoX2l0ZW0sICdncm91cCcpXHJcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0uZ3JvdXAgPSBfaXRlbS5ncm91cFxyXG5cdFx0XHRcdFx0XHRpZiBfaXRlbS5yZXF1aXJlZFxyXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlYWRvbmx5ID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5kaXNhYmxlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVxdWlyZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgX2l0ZW0ucmVhZG9ubHlcclxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5yZWFkb25seSA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5kaXNhYmxlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5yZXF1aXJlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRvYmplY3QuZmllbGRzID0gX2ZpZWxkc1xyXG5cdFx0XHRcdFx0b2JqZWN0LmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvYmplY3RMYXlvdXQuYWN0aW9ucyB8fCBbXVxyXG5cdFx0XHRcdFx0b2JqZWN0LmV4Y2x1ZGVfYWN0aW9ucyA9IG9iamVjdExheW91dC5leGNsdWRlX2FjdGlvbnMgfHwgW11cclxuXHRcdFx0XHRcdG9iamVjdC5hbGxvd19yZWxhdGVkTGlzdCA9IG9iamVjdExheW91dC5yZWxhdGVkTGlzdCB8fCBbXVxyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogb2JqZWN0XHJcblx0XHR9XHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3sgZXJyb3JNZXNzYWdlOiBlLnJlYXNvbiB8fCBlLm1lc3NhZ2UgfV0gfVxyXG5cdFx0fSIsInZhciBfZ2V0TG9jYWxlLCBjbG9uZSwgZ2V0VXNlclByb2ZpbGVPYmplY3RMYXlvdXQsIG9iamVjdHFsLCBzdGVlZG9zQXV0aCwgc3RlZWRvc0kxOG47XG5cbmNsb25lID0gcmVxdWlyZShcImNsb25lXCIpO1xuXG5zdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpO1xuXG5zdGVlZG9zSTE4biA9IHJlcXVpcmUoXCJAc3RlZWRvcy9pMThuXCIpO1xuXG5vYmplY3RxbCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9vYmplY3RxbFwiKTtcblxuX2dldExvY2FsZSA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgdmFyIGxvY2FsZSwgcmVmLCByZWYxO1xuICBpZiAoKHVzZXIgIT0gbnVsbCA/IChyZWYgPSB1c2VyLmxvY2FsZSkgIT0gbnVsbCA/IHJlZi50b0xvY2FsZUxvd2VyQ2FzZSgpIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gJ3poLWNuJykge1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgfSBlbHNlIGlmICgodXNlciAhPSBudWxsID8gKHJlZjEgPSB1c2VyLmxvY2FsZSkgIT0gbnVsbCA/IHJlZjEudG9Mb2NhbGVMb3dlckNhc2UoKSA6IHZvaWQgMCA6IHZvaWQgMCkgPT09ICdlbi11cycpIHtcbiAgICBsb2NhbGUgPSBcImVuXCI7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICB9XG4gIHJldHVybiBsb2NhbGU7XG59O1xuXG5nZXRVc2VyUHJvZmlsZU9iamVjdExheW91dCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0TmFtZSkge1xuICB2YXIgcmVmLCBzcGFjZVVzZXI7XG4gIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwcm9maWxlOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgIHJldHVybiAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIikpICE9IG51bGwgPyByZWYuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHByb2ZpbGVzOiBzcGFjZVVzZXIucHJvZmlsZSxcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3ROYW1lXG4gICAgfSkgOiB2b2lkIDA7XG4gIH1cbn07XG5cbkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9jcmVhdG9yLzpzcGFjZS9vYmplY3RzLzpfaWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgX2ZpZWxkcywgX2lkLCBfb2JqZWN0LCBhdXRoVG9rZW4sIGUsIGlzU3BhY2VBZG1pbiwgbG5nLCBvYmplY3QsIG9iamVjdExheW91dCwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCByZWYsIHJlZjEsIHNldF9pZHMsIHNwYWNlSWQsIHNwYWNlVXNlciwgdHlwZSwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdHJ5IHtcbiAgICBfaWQgPSByZXEucGFyYW1zLl9pZDtcbiAgICBzcGFjZUlkID0gcmVxLnBhcmFtcy5zcGFjZTtcbiAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICB0eXBlID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIF9vYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdHMnKS5maW5kT25lKF9pZCkgfHwge307XG4gICAgb2JqZWN0ID0ge307XG4gICAgaWYgKCFfLmlzRW1wdHkoX29iamVjdCkpIHtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgbmFtZTogJ2FkbWluJ1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICB9XG4gICAgICB9KSB8fCBudWxsO1xuICAgICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICBuYW1lOiAndXNlcidcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkgfHwgbnVsbDtcbiAgICAgIHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICB9XG4gICAgICB9KSB8fCBudWxsO1xuICAgICAgcHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICB9XG4gICAgICB9KSB8fCBudWxsO1xuICAgICAgcHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICB9XG4gICAgICB9KSB8fCBudWxsO1xuICAgICAgcHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICB9XG4gICAgICB9KSB8fCBudWxsO1xuICAgICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgcHNldHNBZG1pbl9wb3MgPSBudWxsO1xuICAgICAgcHNldHNVc2VyX3BvcyA9IG51bGw7XG4gICAgICBwc2V0c01lbWJlcl9wb3MgPSBudWxsO1xuICAgICAgcHNldHNHdWVzdF9wb3MgPSBudWxsO1xuICAgICAgcHNldHNDdXJyZW50X3BvcyA9IG51bGw7XG4gICAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGw7XG4gICAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGw7XG4gICAgICBpZiAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgICAgcHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGlmIChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHtcbiAgICAgICAgcHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBpZiAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgICBwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBpZiAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHtcbiAgICAgICAgcHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGlmIChwc2V0c1N1cHBsaWVyICE9IG51bGwgPyBwc2V0c1N1cHBsaWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgaWYgKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBpZiAocHNldHNDdXJyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIl9pZFwiKTtcbiAgICAgICAgcHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAgICAgJGluOiBzZXRfaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICBwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIm5hbWVcIik7XG4gICAgICB9XG4gICAgICBwc2V0cyA9IHtcbiAgICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICAgIHBzZXRzQ3VycmVudDogcHNldHNDdXJyZW50LFxuICAgICAgICBwc2V0c01lbWJlcjogcHNldHNNZW1iZXIsXG4gICAgICAgIHBzZXRzR3Vlc3Q6IHBzZXRzR3Vlc3QsXG4gICAgICAgIHBzZXRzU3VwcGxpZXI6IHBzZXRzU3VwcGxpZXIsXG4gICAgICAgIHBzZXRzQ3VzdG9tZXI6IHBzZXRzQ3VzdG9tZXIsXG4gICAgICAgIGlzU3BhY2VBZG1pbjogaXNTcGFjZUFkbWluLFxuICAgICAgICBzcGFjZVVzZXI6IHNwYWNlVXNlcixcbiAgICAgICAgcHNldHNBZG1pbl9wb3M6IHBzZXRzQWRtaW5fcG9zLFxuICAgICAgICBwc2V0c1VzZXJfcG9zOiBwc2V0c1VzZXJfcG9zLFxuICAgICAgICBwc2V0c01lbWJlcl9wb3M6IHBzZXRzTWVtYmVyX3BvcyxcbiAgICAgICAgcHNldHNHdWVzdF9wb3M6IHBzZXRzR3Vlc3RfcG9zLFxuICAgICAgICBwc2V0c1N1cHBsaWVyX3BvczogcHNldHNTdXBwbGllcl9wb3MsXG4gICAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zOiBwc2V0c0N1c3RvbWVyX3BvcyxcbiAgICAgICAgcHNldHNDdXJyZW50X3BvczogcHNldHNDdXJyZW50X3Bvc1xuICAgICAgfTtcbiAgICAgIGlmIChpc1NwYWNlQWRtaW4gfHwgX29iamVjdC5pbl9kZXZlbG9wbWVudCA9PT0gJzAnICYmIF9vYmplY3QuaXNfZW5hYmxlKSB7XG4gICAgICAgIGlmIChfb2JqZWN0LmRhdGFzb3VyY2UgIT09ICdkZWZhdWx0Jykge1xuICAgICAgICAgIGF1dGhUb2tlbiA9IFN0ZWVkb3MuZ2V0QXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICAgICAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pKGF1dGhUb2tlbiwgc3BhY2VJZCk7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKHYsIHVzZXJTZXNzaW9uLCBjYikge1xuICAgICAgICAgICAgcmV0dXJuIHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKG9iamVjdHFsLmdldE9iamVjdChfb2JqZWN0Lm5hbWUpLnRvQ29uZmlnKCkpLCBzcGFjZUlkKTtcbiAgICAgICAgICBvYmplY3QuZGF0YWJhc2VfbmFtZSA9IChyZWYxID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZGF0YXNvdXJjZXNcIikuZmluZE9uZSh7XG4gICAgICAgICAgICBfaWQ6IF9vYmplY3QuZGF0YXNvdXJjZVxuICAgICAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5sYWJlbCA6IHZvaWQgMDtcbiAgICAgICAgICBvYmplY3QucGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucyhvYmplY3RxbC5nZXRPYmplY3QoX29iamVjdC5uYW1lKSwgdXNlclNlc3Npb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9iamVjdCA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbX29iamVjdC5uYW1lXSksIHNwYWNlSWQpO1xuICAgICAgICAgIG9iamVjdC5wZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3QubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIG9iamVjdC5kYjtcbiAgICAgICAgb2JqZWN0Lmxpc3Rfdmlld3MgPSBDcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3ModXNlcklkLCBzcGFjZUlkLCBvYmplY3QubmFtZSk7XG4gICAgICAgIGxuZyA9IF9nZXRMb2NhbGUoZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGxvY2FsZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICBzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk9iamVjdChsbmcsIG9iamVjdC5uYW1lLCBPYmplY3QuYXNzaWduKG9iamVjdCwge1xuICAgICAgICAgIGRhdGFzb3VyY2U6IF9vYmplY3QuZGF0YXNvdXJjZVxuICAgICAgICB9KSk7XG4gICAgICAgIG9iamVjdExheW91dCA9IGdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0KHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpO1xuICAgICAgICBpZiAob2JqZWN0TGF5b3V0KSB7XG4gICAgICAgICAgX2ZpZWxkcyA9IHt9O1xuICAgICAgICAgIF8uZWFjaChvYmplY3RMYXlvdXQuZmllbGRzLCBmdW5jdGlvbihfaXRlbSkge1xuICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0gPSBvYmplY3QuZmllbGRzW19pdGVtLmZpZWxkXTtcbiAgICAgICAgICAgIGlmIChfLmhhcyhfaXRlbSwgJ2dyb3VwJykpIHtcbiAgICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0uZ3JvdXAgPSBfaXRlbS5ncm91cDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfaXRlbS5yZXF1aXJlZCkge1xuICAgICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXS5yZWFkb25seSA9IGZhbHNlO1xuICAgICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gX2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVxdWlyZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfaXRlbS5yZWFkb25seSkge1xuICAgICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXS5yZWFkb25seSA9IHRydWU7XG4gICAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgb2JqZWN0LmZpZWxkcyA9IF9maWVsZHM7XG4gICAgICAgICAgb2JqZWN0LmFsbG93X2N1c3RvbUFjdGlvbnMgPSBvYmplY3RMYXlvdXQuYWN0aW9ucyB8fCBbXTtcbiAgICAgICAgICBvYmplY3QuZXhjbHVkZV9hY3Rpb25zID0gb2JqZWN0TGF5b3V0LmV4Y2x1ZGVfYWN0aW9ucyB8fCBbXTtcbiAgICAgICAgICBvYmplY3QuYWxsb3dfcmVsYXRlZExpc3QgPSBvYmplY3RMYXlvdXQucmVsYXRlZExpc3QgfHwgW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IG9iamVjdFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwib2JqZWN0cWwgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvb2JqZWN0cWxcIik7XHJcbk1ldGVvci5wdWJsaXNoIFwiY3JlYXRvcl9vYmplY3RzXCIsIChzcGFjZSktPlxyXG5cdCNUT0RPIOagueaNruadg+mZkOi/lOWbnk9iamVjdHPorrDlvZVcclxuXHRjb25maWcgPSBvYmplY3RxbC5nZXRTdGVlZG9zQ29uZmlnKCk7XHJcblx0aWYgY29uZmlnLnRlbmFudCAmJiBjb25maWcudGVuYW50LnNhYXNcclxuXHRcdHJldHVyblxyXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZCh7c3BhY2U6IHskaW46IFtudWxsLCBzcGFjZV19LCBpc19kZWxldGVkOiB7JG5lOiB0cnVlfX0sIHtmaWVsZHM6IHtfaWQ6IDEsIG1vZGlmaWVkOiAxLCBpc19lbmFibGU6IDEsIGluX2RldmVsb3BtZW50OiAxfX0pXHJcbk1ldGVvci5wdWJsaXNoIFwiY3JlYXRvcl9yZWxvYWRfb2JqZWN0X2xvZ3NcIiwgKHNwYWNlKS0+XHJcblx0Y29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xyXG5cdGlmIGNvbmZpZy50ZW5hbnQgJiYgY29uZmlnLnRlbmFudC5zYWFzXHJcblx0XHRyZXR1cm5cclxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZWxvYWRfb2JqZWN0X2xvZ3NcIikuZmluZCh7c3BhY2U6IHskaW46IFtudWxsLCBzcGFjZV19LCBjaGFuZ2VfdGltZTogeyRndGU6bmV3IERhdGUoKX19LCB7ZmllbGRzOiB7X2lkOiAxLCBvYmplY3RfbmFtZTogMSwgc3BhY2U6IDF9fSlcclxuIiwidmFyIG9iamVjdHFsO1xuXG5vYmplY3RxbCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9vYmplY3RxbFwiKTtcblxuTWV0ZW9yLnB1Ymxpc2goXCJjcmVhdG9yX29iamVjdHNcIiwgZnVuY3Rpb24oc3BhY2UpIHtcbiAgdmFyIGNvbmZpZztcbiAgY29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xuICBpZiAoY29uZmlnLnRlbmFudCAmJiBjb25maWcudGVuYW50LnNhYXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZCh7XG4gICAgc3BhY2U6IHtcbiAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgIH0sXG4gICAgaXNfZGVsZXRlZDoge1xuICAgICAgJG5lOiB0cnVlXG4gICAgfVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBfaWQ6IDEsXG4gICAgICBtb2RpZmllZDogMSxcbiAgICAgIGlzX2VuYWJsZTogMSxcbiAgICAgIGluX2RldmVsb3BtZW50OiAxXG4gICAgfVxuICB9KTtcbn0pO1xuXG5NZXRlb3IucHVibGlzaChcImNyZWF0b3JfcmVsb2FkX29iamVjdF9sb2dzXCIsIGZ1bmN0aW9uKHNwYWNlKSB7XG4gIHZhciBjb25maWc7XG4gIGNvbmZpZyA9IG9iamVjdHFsLmdldFN0ZWVkb3NDb25maWcoKTtcbiAgaWYgKGNvbmZpZy50ZW5hbnQgJiYgY29uZmlnLnRlbmFudC5zYWFzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJyZWxvYWRfb2JqZWN0X2xvZ3NcIikuZmluZCh7XG4gICAgc3BhY2U6IHtcbiAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgIH0sXG4gICAgY2hhbmdlX3RpbWU6IHtcbiAgICAgICRndGU6IG5ldyBEYXRlKClcbiAgICB9XG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIF9pZDogMSxcbiAgICAgIG9iamVjdF9uYW1lOiAxLFxuICAgICAgc3BhY2U6IDFcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCBcInB1Ymxpc2hfb2JqZWN0X2xheW91dHNcIiwgKHNwYWNlKS0+XHJcblx0dXNlcklkID0gdGhpcy51c2VySWRcclxuXHRpZiAhdXNlcklkXHJcblx0XHRyZXR1cm5cclxuXHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2UsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pXHJcblx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXHJcblx0XHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGF5b3V0c1wiKS5maW5kKHtzcGFjZTogeyRpbjogW251bGwsIHNwYWNlXX0sIHByb2ZpbGVzOiBzcGFjZVVzZXIucHJvZmlsZX0sIHtmaWVsZHM6IHtfaWQ6IDEsIG1vZGlmaWVkOiAxLCBvYmplY3RfbmFtZTogMX19KSIsIk1ldGVvci5wdWJsaXNoKFwicHVibGlzaF9vYmplY3RfbGF5b3V0c1wiLCBmdW5jdGlvbihzcGFjZSkge1xuICB2YXIgc3BhY2VVc2VyLCB1c2VySWQ7XG4gIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICBpZiAoIXVzZXJJZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2UsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHByb2ZpbGU6IDFcbiAgICB9XG4gIH0pO1xuICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9sYXlvdXRzXCIpLmZpbmQoe1xuICAgICAgc3BhY2U6IHtcbiAgICAgICAgJGluOiBbbnVsbCwgc3BhY2VdXG4gICAgICB9LFxuICAgICAgcHJvZmlsZXM6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgbW9kaWZpZWQ6IDEsXG4gICAgICAgIG9iamVjdF9uYW1lOiAxXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
