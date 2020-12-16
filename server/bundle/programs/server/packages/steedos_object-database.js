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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfbGF5b3V0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvb2JqZWN0X2xheW91dHMuY29mZmVlIl0sIm5hbWVzIjpbIl9nZXRMb2NhbGUiLCJjbG9uZSIsImdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0Iiwib2JqZWN0cWwiLCJzdGVlZG9zQXV0aCIsInN0ZWVkb3NJMThuIiwicmVxdWlyZSIsInVzZXIiLCJsb2NhbGUiLCJyZWYiLCJyZWYxIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJ1c2VySWQiLCJzcGFjZUlkIiwib2JqZWN0TmFtZSIsInNwYWNlVXNlciIsIkNyZWF0b3IiLCJnZXRDb2xsZWN0aW9uIiwiZmluZE9uZSIsInNwYWNlIiwiZmllbGRzIiwicHJvZmlsZSIsInByb2ZpbGVzIiwib2JqZWN0X25hbWUiLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsIl9maWVsZHMiLCJfaWQiLCJfb2JqZWN0IiwiYXV0aFRva2VuIiwiZSIsImlzU3BhY2VBZG1pbiIsImxuZyIsIm9iamVjdCIsIm9iamVjdExheW91dCIsInBlcm1pc3Npb25zIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNBZG1pbl9wb3MiLCJwc2V0c0N1cnJlbnQiLCJwc2V0c0N1cnJlbnROYW1lcyIsInBzZXRzQ3VycmVudF9wb3MiLCJwc2V0c0N1c3RvbWVyIiwicHNldHNDdXN0b21lcl9wb3MiLCJwc2V0c0d1ZXN0IiwicHNldHNHdWVzdF9wb3MiLCJwc2V0c01lbWJlciIsInBzZXRzTWVtYmVyX3BvcyIsInBzZXRzU3VwcGxpZXIiLCJwc2V0c1N1cHBsaWVyX3BvcyIsInBzZXRzVXNlciIsInBzZXRzVXNlcl9wb3MiLCJzZXRfaWRzIiwidHlwZSIsInVzZXJTZXNzaW9uIiwicGFyYW1zIiwiaGVhZGVycyIsInF1ZXJ5IiwiXyIsImlzRW1wdHkiLCJuYW1lIiwiYXNzaWduZWRfYXBwcyIsImZpbmQiLCIkb3IiLCJ1c2VycyIsImZldGNoIiwicGVybWlzc2lvbl9zZXRfaWQiLCJjcmVhdGVkIiwibW9kaWZpZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJsZW5ndGgiLCJwbHVjayIsIiRpbiIsImluX2RldmVsb3BtZW50IiwiaXNfZW5hYmxlIiwiZGF0YXNvdXJjZSIsIlN0ZWVkb3MiLCJnZXRBdXRoVG9rZW4iLCJNZXRlb3IiLCJ3cmFwQXN5bmMiLCJjYiIsImdldFNlc3Npb24iLCJ0aGVuIiwicmVzb2x2ZSIsInJlamVjdCIsInYiLCJnZXRVc2VyT2JqZWN0UGVybWlzc2lvbiIsImNvbnZlcnRPYmplY3QiLCJnZXRPYmplY3QiLCJ0b0NvbmZpZyIsImRhdGFiYXNlX25hbWUiLCJsYWJlbCIsIk9iamVjdHMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImJpbmQiLCJkYiIsImxpc3Rfdmlld3MiLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwidHJhbnNsYXRpb25PYmplY3QiLCJPYmplY3QiLCJhc3NpZ24iLCJlYWNoIiwiX2l0ZW0iLCJmaWVsZCIsImhhcyIsImdyb3VwIiwicmVxdWlyZWQiLCJyZWFkb25seSIsImRpc2FibGVkIiwiYWxsb3dfYWN0aW9ucyIsImFjdGlvbnMiLCJhbGxvd19yZWxhdGVkTGlzdCIsInJlbGF0ZWRMaXN0Iiwic2VuZFJlc3VsdCIsImNvZGUiLCJkYXRhIiwiZXJyb3IiLCJjb25zb2xlIiwic3RhY2siLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJtZXNzYWdlIiwicHVibGlzaCIsImNvbmZpZyIsImdldFN0ZWVkb3NDb25maWciLCJ0ZW5hbnQiLCJzYWFzIiwiaXNfZGVsZXRlZCIsIiRuZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxVQUFBLEVBQUFDLEtBQUEsRUFBQUMsMEJBQUEsRUFBQUMsUUFBQSxFQUFBQyxXQUFBLEVBQUFDLFdBQUE7O0FBQUFKLFFBQVFLLFFBQVEsT0FBUixDQUFSO0FBQ0FGLGNBQWNFLFFBQVEsZUFBUixDQUFkO0FBQ0FELGNBQWNDLFFBQVEsZUFBUixDQUFkO0FBQ0FILFdBQVdHLFFBQVEsbUJBQVIsQ0FBWDs7QUFFQU4sYUFBYSxVQUFDTyxJQUFEO0FBQ1osTUFBQUMsTUFBQSxFQUFBQyxHQUFBLEVBQUFDLElBQUE7O0FBQUEsT0FBQUgsUUFBQSxRQUFBRSxNQUFBRixLQUFBQyxNQUFBLFlBQUFDLElBQWlCRSxpQkFBakIsS0FBRyxNQUFILEdBQUcsTUFBSCxNQUF3QyxPQUF4QztBQUNDSCxhQUFTLE9BQVQ7QUFERCxTQUVLLEtBQUFELFFBQUEsUUFBQUcsT0FBQUgsS0FBQUMsTUFBQSxZQUFBRSxLQUFpQkMsaUJBQWpCLEtBQUcsTUFBSCxHQUFHLE1BQUgsTUFBd0MsT0FBeEM7QUFDSkgsYUFBUyxJQUFUO0FBREk7QUFHSkEsYUFBUyxPQUFUO0FDT0M7O0FETkYsU0FBT0EsTUFBUDtBQVBZLENBQWI7O0FBU0FOLDZCQUE2QixVQUFDVSxNQUFELEVBQVNDLE9BQVQsRUFBa0JDLFVBQWxCO0FBQzVCLE1BQUFMLEdBQUEsRUFBQU0sU0FBQTtBQUFBQSxjQUFZQyxRQUFRQyxhQUFSLENBQXNCLGFB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Q0FBbkI7QUFBc0JoRCxxQkFBYTtBQUFuQztBQUFULEtBQXpHLENDU0U7QUFZRDtBRDNCSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdC1kYXRhYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsb25lID0gcmVxdWlyZShcImNsb25lXCIpO1xuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcbnN0ZWVkb3NJMThuID0gcmVxdWlyZShcIkBzdGVlZG9zL2kxOG5cIik7XG5vYmplY3RxbCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9vYmplY3RxbFwiKTtcblxuX2dldExvY2FsZSA9ICh1c2VyKS0+XG5cdGlmIHVzZXI/LmxvY2FsZT8udG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAnemgtY24nXG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdGVsc2UgaWYgdXNlcj8ubG9jYWxlPy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICdlbi11cydcblx0XHRsb2NhbGUgPSBcImVuXCJcblx0ZWxzZVxuXHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXHRyZXR1cm4gbG9jYWxlXG5cbmdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0ID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0TmFtZSktPlxuXHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSlcblx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9sYXlvdXRzXCIpPy5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgcHJvZmlsZXM6IHNwYWNlVXNlci5wcm9maWxlLCBvYmplY3RfbmFtZTogb2JqZWN0TmFtZX0pO1xuXG5Kc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvY3JlYXRvci86c3BhY2Uvb2JqZWN0cy86X2lkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHRfaWQgPSByZXEucGFyYW1zLl9pZFxuXHRcdHNwYWNlSWQgPSByZXEucGFyYW1zLnNwYWNlXG5cdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cblxuXHRcdHR5cGUgPSByZXEucXVlcnk/LnR5cGVcblxuXHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdHMnKS5maW5kT25lKF9pZCkgfHwge31cblxuXHRcdG9iamVjdCA9IHt9XG5cdFx0aWYgIV8uaXNFbXB0eShfb2JqZWN0KVxuXHRcdFx0aXNTcGFjZUFkbWluID0gZmFsc2Vcblx0XHRcdHNwYWNlVXNlciA9IG51bGxcblx0XHRcdGlmIHVzZXJJZFxuXHRcdFx0XHRpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXG5cdFx0XHRcdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoeyBzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkIH0sIHsgZmllbGRzOiB7IHByb2ZpbGU6IDEgfSB9KVxuXG5cdFx0XHRwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRcdHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdtZW1iZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0XHRwc2V0c0d1ZXN0ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdndWVzdCd9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblxuXHRcdFx0cHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnc3VwcGxpZXInfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KSB8fCBudWxsXG5cdFx0XHRwc2V0c0N1c3RvbWVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdjdXN0b21lcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pIHx8IG51bGxcblx0XHRcdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxuXHRcdFx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgJG9yOiBbe3VzZXJzOiB1c2VySWR9LCB7bmFtZTogc3BhY2VVc2VyLnByb2ZpbGV9XX0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjEsIG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe3VzZXJzOiB1c2VySWQsIHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MSwgbmFtZToxfX0pLmZldGNoKClcblxuXHRcdFx0cHNldHNBZG1pbl9wb3MgPSBudWxsXG5cdFx0XHRwc2V0c1VzZXJfcG9zID0gbnVsbFxuXHRcdFx0cHNldHNNZW1iZXJfcG9zID0gbnVsbFxuXHRcdFx0cHNldHNHdWVzdF9wb3MgPSBudWxsXG5cdFx0XHRwc2V0c0N1cnJlbnRfcG9zID0gbnVsbFxuXHRcdFx0cHNldHNTdXBwbGllcl9wb3MgPSBudWxsXG5cdFx0XHRwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGxcblxuXHRcdFx0aWYgcHNldHNBZG1pbj8uX2lkXG5cdFx0XHRcdHBzZXRzQWRtaW5fcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0FkbWluLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdFx0aWYgcHNldHNVc2VyPy5faWRcblx0XHRcdFx0cHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdFx0aWYgcHNldHNNZW1iZXI/Ll9pZFxuXHRcdFx0XHRwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7cGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdFx0aWYgcHNldHNHdWVzdD8uX2lkXG5cdFx0XHRcdHBzZXRzR3Vlc3RfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0d1ZXN0Ll9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdFx0aWYgcHNldHNTdXBwbGllcj8uX2lkXG5cdFx0XHRcdHBzZXRzU3VwcGxpZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c1N1cHBsaWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXHRcdFx0aWYgcHNldHNDdXN0b21lcj8uX2lkXG5cdFx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe3Blcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZH0sIHtmaWVsZHM6IHtjcmVhdGVkOiAwLCBtb2RpZmllZDogMCwgY3JlYXRlZF9ieTogMCwgbW9kaWZpZWRfYnk6IDB9fSkuZmV0Y2goKVxuXG5cdFx0XHRpZiBwc2V0c0N1cnJlbnQubGVuZ3RoID4gMFxuXHRcdFx0XHRzZXRfaWRzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwiX2lkXCJcblx0XHRcdFx0cHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtwZXJtaXNzaW9uX3NldF9pZDogeyRpbjogc2V0X2lkc319KS5mZXRjaCgpXG5cdFx0XHRcdHBzZXRzQ3VycmVudE5hbWVzID0gXy5wbHVjayBwc2V0c0N1cnJlbnQsIFwibmFtZVwiXG5cblx0XHRcdHBzZXRzID0ge1xuXHRcdFx0XHRwc2V0c0FkbWluLFxuXHRcdFx0XHRwc2V0c1VzZXIsXG5cdFx0XHRcdHBzZXRzQ3VycmVudCxcblx0XHRcdFx0cHNldHNNZW1iZXIsXG5cdFx0XHRcdHBzZXRzR3Vlc3QsXG5cdFx0XHRcdHBzZXRzU3VwcGxpZXIsXG5cdFx0XHRcdHBzZXRzQ3VzdG9tZXIsXG5cdFx0XHRcdGlzU3BhY2VBZG1pbixcblx0XHRcdFx0c3BhY2VVc2VyLFxuXHRcdFx0XHRwc2V0c0FkbWluX3Bvcyxcblx0XHRcdFx0cHNldHNVc2VyX3Bvcyxcblx0XHRcdFx0cHNldHNNZW1iZXJfcG9zLFxuXHRcdFx0XHRwc2V0c0d1ZXN0X3Bvcyxcblx0XHRcdFx0cHNldHNTdXBwbGllcl9wb3MsXG5cdFx0XHRcdHBzZXRzQ3VzdG9tZXJfcG9zLFxuXHRcdFx0XHRwc2V0c0N1cnJlbnRfcG9zXG5cdFx0XHR9XG5cblx0XHRcdGlmIGlzU3BhY2VBZG1pbiB8fCBfb2JqZWN0LmluX2RldmVsb3BtZW50ID09ICcwJyAmJiBfb2JqZWN0LmlzX2VuYWJsZVxuXHRcdFx0XHRpZiBfb2JqZWN0LmRhdGFzb3VyY2UgIT0gJ2RlZmF1bHQnXG5cdFx0XHRcdFx0YXV0aFRva2VuID0gU3RlZWRvcy5nZXRBdXRoVG9rZW4ocmVxLCByZXMpXG5cdFx0XHRcdFx0dXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKS0+XG5cdFx0XHRcdFx0XHRzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KS0+XG5cdFx0XHRcdFx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHRcdFx0XHQpKGF1dGhUb2tlbiwgc3BhY2VJZClcblx0XHRcdFx0XHRwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMgKHYsIHVzZXJTZXNzaW9uLCBjYiktPlxuXHRcdFx0XHRcdFx0di5nZXRVc2VyT2JqZWN0UGVybWlzc2lvbih1c2VyU2Vzc2lvbikudGhlbiAocmVzb2x2ZSwgcmVqZWN0KS0+XG5cdFx0XHRcdFx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUob2JqZWN0cWwuZ2V0T2JqZWN0KF9vYmplY3QubmFtZSkudG9Db25maWcoKSksIHNwYWNlSWQpXG5cdFx0XHRcdFx0b2JqZWN0LmRhdGFiYXNlX25hbWUgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJkYXRhc291cmNlc1wiKS5maW5kT25lKHtfaWQ6IF9vYmplY3QuZGF0YXNvdXJjZX0pPy5sYWJlbFxuXHRcdFx0XHRcdG9iamVjdC5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKG9iamVjdHFsLmdldE9iamVjdChfb2JqZWN0Lm5hbWUpLCB1c2VyU2Vzc2lvbilcblx0XHRcdFx0ZWxzZVxuXG5cdFx0XHRcdFx0b2JqZWN0ID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKENyZWF0b3IuT2JqZWN0c1tfb2JqZWN0Lm5hbWVdKSwgc3BhY2VJZCkgIyBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUoQ3JlYXRvci5PYmplY3RzW19vYmplY3QubmFtZV0pLCBzcGFjZUlkKSAjIENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShuZXcgQ3JlYXRvci5PYmplY3QoX29iamVjdCkpLCBzcGFjZUlkKTtcblx0XHRcdFx0XHRvYmplY3QucGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0Lm5hbWUpXG5cblx0XHRcdFx0ZGVsZXRlIG9iamVjdC5kYlxuXHRcdFx0XHRvYmplY3QubGlzdF92aWV3cyA9IENyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyh1c2VySWQsIHNwYWNlSWQsIG9iamVjdC5uYW1lKVxuXHRcdFx0XHRsbmcgPSBfZ2V0TG9jYWxlKGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7bG9jYWxlOiAxfX0pKVxuXHRcdFx0XHRzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk9iamVjdChsbmcsIG9iamVjdC5uYW1lLCBPYmplY3QuYXNzaWduKG9iamVjdCwge2RhdGFzb3VyY2U6IF9vYmplY3QuZGF0YXNvdXJjZX0pKVxuXHRcdFx0XHRvYmplY3RMYXlvdXQgPSBnZXRVc2VyUHJvZmlsZU9iamVjdExheW91dCh1c2VySWQsIHNwYWNlSWQsIG9iamVjdC5uYW1lKVxuXHRcdFx0XHRpZiBvYmplY3RMYXlvdXRcblx0XHRcdFx0XHRfZmllbGRzID0ge307XG5cdFx0XHRcdFx0Xy5lYWNoIG9iamVjdExheW91dC5maWVsZHMsIChfaXRlbSktPlxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0gPSBvYmplY3QuZmllbGRzW19pdGVtLmZpZWxkXVxuXHRcdFx0XHRcdFx0aWYgXy5oYXMoX2l0ZW0sICdncm91cCcpXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLmdyb3VwID0gX2l0ZW0uZ3JvdXBcblx0XHRcdFx0XHRcdGlmIF9pdGVtLnJlcXVpcmVkXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlYWRvbmx5ID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0uZGlzYWJsZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5yZXF1aXJlZCA9IHRydWVcblx0XHRcdFx0XHRcdGVsc2UgaWYgX2l0ZW0ucmVhZG9ubHlcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVhZG9ubHkgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLmRpc2FibGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5yZXF1aXJlZCA9IGZhbHNlXG5cdFx0XHRcdFx0b2JqZWN0LmZpZWxkcyA9IF9maWVsZHNcblx0XHRcdFx0XHRvYmplY3QuYWxsb3dfYWN0aW9ucyA9IG9iamVjdExheW91dC5hY3Rpb25zIHx8IFtdXG5cdFx0XHRcdFx0b2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0ID0gb2JqZWN0TGF5b3V0LnJlbGF0ZWRMaXN0IHx8IFtdXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiBvYmplY3Rcblx0XHR9XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XG5cdFx0fSIsInZhciBfZ2V0TG9jYWxlLCBjbG9uZSwgZ2V0VXNlclByb2ZpbGVPYmplY3RMYXlvdXQsIG9iamVjdHFsLCBzdGVlZG9zQXV0aCwgc3RlZWRvc0kxOG47XG5cbmNsb25lID0gcmVxdWlyZShcImNsb25lXCIpO1xuXG5zdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpO1xuXG5zdGVlZG9zSTE4biA9IHJlcXVpcmUoXCJAc3RlZWRvcy9pMThuXCIpO1xuXG5vYmplY3RxbCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9vYmplY3RxbFwiKTtcblxuX2dldExvY2FsZSA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgdmFyIGxvY2FsZSwgcmVmLCByZWYxO1xuICBpZiAoKHVzZXIgIT0gbnVsbCA/IChyZWYgPSB1c2VyLmxvY2FsZSkgIT0gbnVsbCA/IHJlZi50b0xvY2FsZUxvd2VyQ2FzZSgpIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gJ3poLWNuJykge1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgfSBlbHNlIGlmICgodXNlciAhPSBudWxsID8gKHJlZjEgPSB1c2VyLmxvY2FsZSkgIT0gbnVsbCA/IHJlZjEudG9Mb2NhbGVMb3dlckNhc2UoKSA6IHZvaWQgMCA6IHZvaWQgMCkgPT09ICdlbi11cycpIHtcbiAgICBsb2NhbGUgPSBcImVuXCI7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICB9XG4gIHJldHVybiBsb2NhbGU7XG59O1xuXG5nZXRVc2VyUHJvZmlsZU9iamVjdExheW91dCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0TmFtZSkge1xuICB2YXIgcmVmLCBzcGFjZVVzZXI7XG4gIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwcm9maWxlOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgIHJldHVybiAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIikpICE9IG51bGwgPyByZWYuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHByb2ZpbGVzOiBzcGFjZVVzZXIucHJvZmlsZSxcbiAgICAgIG9iamVjdF9uYW1lOiBvYmplY3ROYW1lXG4gICAgfSkgOiB2b2lkIDA7XG4gIH1cbn07XG5cbkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9jcmVhdG9yLzpzcGFjZS9vYmplY3RzLzpfaWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgX2ZpZWxkcywgX2lkLCBfb2JqZWN0LCBhdXRoVG9rZW4sIGUsIGlzU3BhY2VBZG1pbiwgbG5nLCBvYmplY3QsIG9iamVjdExheW91dCwgcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0FkbWluX3BvcywgcHNldHNDdXJyZW50LCBwc2V0c0N1cnJlbnROYW1lcywgcHNldHNDdXJyZW50X3BvcywgcHNldHNDdXN0b21lciwgcHNldHNDdXN0b21lcl9wb3MsIHBzZXRzR3Vlc3QsIHBzZXRzR3Vlc3RfcG9zLCBwc2V0c01lbWJlciwgcHNldHNNZW1iZXJfcG9zLCBwc2V0c1N1cHBsaWVyLCBwc2V0c1N1cHBsaWVyX3BvcywgcHNldHNVc2VyLCBwc2V0c1VzZXJfcG9zLCByZWYsIHJlZjEsIHNldF9pZHMsIHNwYWNlSWQsIHNwYWNlVXNlciwgdHlwZSwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdHJ5IHtcbiAgICBfaWQgPSByZXEucGFyYW1zLl9pZDtcbiAgICBzcGFjZUlkID0gcmVxLnBhcmFtcy5zcGFjZTtcbiAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICB0eXBlID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIF9vYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdHMnKS5maW5kT25lKF9pZCkgfHwge307XG4gICAgb2JqZWN0ID0ge307XG4gICAgaWYgKCFfLmlzRW1wdHkoX29iamVjdCkpIHtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IGZhbHNlO1xuICAgICAgc3BhY2VVc2VyID0gbnVsbDtcbiAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICAgICAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgdXNlcjogdXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgbmFtZTogJ2FkbWluJ1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICB9XG4gICAgICB9KSB8fCBudWxsO1xuICAgICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICBuYW1lOiAndXNlcidcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkgfHwgbnVsbDtcbiAgICAgIHBzZXRzTWVtYmVyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICBuYW1lOiAnbWVtYmVyJ1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICB9XG4gICAgICB9KSB8fCBudWxsO1xuICAgICAgcHNldHNHdWVzdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgbmFtZTogJ2d1ZXN0J1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICB9XG4gICAgICB9KSB8fCBudWxsO1xuICAgICAgcHNldHNTdXBwbGllciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgbmFtZTogJ3N1cHBsaWVyJ1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICB9XG4gICAgICB9KSB8fCBudWxsO1xuICAgICAgcHNldHNDdXN0b21lciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe1xuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgbmFtZTogJ2N1c3RvbWVyJ1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICB9XG4gICAgICB9KSB8fCBudWxsO1xuICAgICAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXNlcnM6IHVzZXJJZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBuYW1lOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgYXNzaWduZWRfYXBwczogMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgcHNldHNBZG1pbl9wb3MgPSBudWxsO1xuICAgICAgcHNldHNVc2VyX3BvcyA9IG51bGw7XG4gICAgICBwc2V0c01lbWJlcl9wb3MgPSBudWxsO1xuICAgICAgcHNldHNHdWVzdF9wb3MgPSBudWxsO1xuICAgICAgcHNldHNDdXJyZW50X3BvcyA9IG51bGw7XG4gICAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IG51bGw7XG4gICAgICBwc2V0c0N1c3RvbWVyX3BvcyA9IG51bGw7XG4gICAgICBpZiAocHNldHNBZG1pbiAhPSBudWxsID8gcHNldHNBZG1pbi5faWQgOiB2b2lkIDApIHtcbiAgICAgICAgcHNldHNBZG1pbl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzQWRtaW4uX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGlmIChwc2V0c1VzZXIgIT0gbnVsbCA/IHBzZXRzVXNlci5faWQgOiB2b2lkIDApIHtcbiAgICAgICAgcHNldHNVc2VyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNVc2VyLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBpZiAocHNldHNNZW1iZXIgIT0gbnVsbCA/IHBzZXRzTWVtYmVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgICBwc2V0c01lbWJlcl9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzTWVtYmVyLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBpZiAocHNldHNHdWVzdCAhPSBudWxsID8gcHNldHNHdWVzdC5faWQgOiB2b2lkIDApIHtcbiAgICAgICAgcHNldHNHdWVzdF9wb3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX29iamVjdHNcIikuZmluZCh7XG4gICAgICAgICAgcGVybWlzc2lvbl9zZXRfaWQ6IHBzZXRzR3Vlc3QuX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICAgICAgICBtb2RpZmllZDogMCxcbiAgICAgICAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICAgICAgICBtb2RpZmllZF9ieTogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGlmIChwc2V0c1N1cHBsaWVyICE9IG51bGwgPyBwc2V0c1N1cHBsaWVyLl9pZCA6IHZvaWQgMCkge1xuICAgICAgICBwc2V0c1N1cHBsaWVyX3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDogcHNldHNTdXBwbGllci5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgY3JlYXRlZDogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgICAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgaWYgKHBzZXRzQ3VzdG9tZXIgIT0gbnVsbCA/IHBzZXRzQ3VzdG9tZXIuX2lkIDogdm9pZCAwKSB7XG4gICAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9vYmplY3RzXCIpLmZpbmQoe1xuICAgICAgICAgIHBlcm1pc3Npb25fc2V0X2lkOiBwc2V0c0N1c3RvbWVyLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBjcmVhdGVkOiAwLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICAgICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBpZiAocHNldHNDdXJyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2V0X2lkcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIl9pZFwiKTtcbiAgICAgICAgcHNldHNDdXJyZW50X3BvcyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fb2JqZWN0c1wiKS5maW5kKHtcbiAgICAgICAgICBwZXJtaXNzaW9uX3NldF9pZDoge1xuICAgICAgICAgICAgJGluOiBzZXRfaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICBwc2V0c0N1cnJlbnROYW1lcyA9IF8ucGx1Y2socHNldHNDdXJyZW50LCBcIm5hbWVcIik7XG4gICAgICB9XG4gICAgICBwc2V0cyA9IHtcbiAgICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICAgIHBzZXRzQ3VycmVudDogcHNldHNDdXJyZW50LFxuICAgICAgICBwc2V0c01lbWJlcjogcHNldHNNZW1iZXIsXG4gICAgICAgIHBzZXRzR3Vlc3Q6IHBzZXRzR3Vlc3QsXG4gICAgICAgIHBzZXRzU3VwcGxpZXI6IHBzZXRzU3VwcGxpZXIsXG4gICAgICAgIHBzZXRzQ3VzdG9tZXI6IHBzZXRzQ3VzdG9tZXIsXG4gICAgICAgIGlzU3BhY2VBZG1pbjogaXNTcGFjZUFkbWluLFxuICAgICAgICBzcGFjZVVzZXI6IHNwYWNlVXNlcixcbiAgICAgICAgcHNldHNBZG1pbl9wb3M6IHBzZXRzQWRtaW5fcG9zLFxuICAgICAgICBwc2V0c1VzZXJfcG9zOiBwc2V0c1VzZXJfcG9zLFxuICAgICAgICBwc2V0c01lbWJlcl9wb3M6IHBzZXRzTWVtYmVyX3BvcyxcbiAgICAgICAgcHNldHNHdWVzdF9wb3M6IHBzZXRzR3Vlc3RfcG9zLFxuICAgICAgICBwc2V0c1N1cHBsaWVyX3BvczogcHNldHNTdXBwbGllcl9wb3MsXG4gICAgICAgIHBzZXRzQ3VzdG9tZXJfcG9zOiBwc2V0c0N1c3RvbWVyX3BvcyxcbiAgICAgICAgcHNldHNDdXJyZW50X3BvczogcHNldHNDdXJyZW50X3Bvc1xuICAgICAgfTtcbiAgICAgIGlmIChpc1NwYWNlQWRtaW4gfHwgX29iamVjdC5pbl9kZXZlbG9wbWVudCA9PT0gJzAnICYmIF9vYmplY3QuaXNfZW5hYmxlKSB7XG4gICAgICAgIGlmIChfb2JqZWN0LmRhdGFzb3VyY2UgIT09ICdkZWZhdWx0Jykge1xuICAgICAgICAgIGF1dGhUb2tlbiA9IFN0ZWVkb3MuZ2V0QXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICAgICAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pKGF1dGhUb2tlbiwgc3BhY2VJZCk7XG4gICAgICAgICAgcGVybWlzc2lvbnMgPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKHYsIHVzZXJTZXNzaW9uLCBjYikge1xuICAgICAgICAgICAgcmV0dXJuIHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgb2JqZWN0ID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKG9iamVjdHFsLmdldE9iamVjdChfb2JqZWN0Lm5hbWUpLnRvQ29uZmlnKCkpLCBzcGFjZUlkKTtcbiAgICAgICAgICBvYmplY3QuZGF0YWJhc2VfbmFtZSA9IChyZWYxID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiZGF0YXNvdXJjZXNcIikuZmluZE9uZSh7XG4gICAgICAgICAgICBfaWQ6IF9vYmplY3QuZGF0YXNvdXJjZVxuICAgICAgICAgIH0pKSAhPSBudWxsID8gcmVmMS5sYWJlbCA6IHZvaWQgMDtcbiAgICAgICAgICBvYmplY3QucGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucyhvYmplY3RxbC5nZXRPYmplY3QoX29iamVjdC5uYW1lKSwgdXNlclNlc3Npb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9iamVjdCA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZShDcmVhdG9yLk9iamVjdHNbX29iamVjdC5uYW1lXSksIHNwYWNlSWQpO1xuICAgICAgICAgIG9iamVjdC5wZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3QubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIG9iamVjdC5kYjtcbiAgICAgICAgb2JqZWN0Lmxpc3Rfdmlld3MgPSBDcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3ModXNlcklkLCBzcGFjZUlkLCBvYmplY3QubmFtZSk7XG4gICAgICAgIGxuZyA9IF9nZXRMb2NhbGUoZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGxvY2FsZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICBzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk9iamVjdChsbmcsIG9iamVjdC5uYW1lLCBPYmplY3QuYXNzaWduKG9iamVjdCwge1xuICAgICAgICAgIGRhdGFzb3VyY2U6IF9vYmplY3QuZGF0YXNvdXJjZVxuICAgICAgICB9KSk7XG4gICAgICAgIG9iamVjdExheW91dCA9IGdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0KHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpO1xuICAgICAgICBpZiAob2JqZWN0TGF5b3V0KSB7XG4gICAgICAgICAgX2ZpZWxkcyA9IHt9O1xuICAgICAgICAgIF8uZWFjaChvYmplY3RMYXlvdXQuZmllbGRzLCBmdW5jdGlvbihfaXRlbSkge1xuICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0gPSBvYmplY3QuZmllbGRzW19pdGVtLmZpZWxkXTtcbiAgICAgICAgICAgIGlmIChfLmhhcyhfaXRlbSwgJ2dyb3VwJykpIHtcbiAgICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0uZ3JvdXAgPSBfaXRlbS5ncm91cDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfaXRlbS5yZXF1aXJlZCkge1xuICAgICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXS5yZWFkb25seSA9IGZhbHNlO1xuICAgICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gX2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVxdWlyZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfaXRlbS5yZWFkb25seSkge1xuICAgICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXS5yZWFkb25seSA9IHRydWU7XG4gICAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgb2JqZWN0LmZpZWxkcyA9IF9maWVsZHM7XG4gICAgICAgICAgb2JqZWN0LmFsbG93X2FjdGlvbnMgPSBvYmplY3RMYXlvdXQuYWN0aW9ucyB8fCBbXTtcbiAgICAgICAgICBvYmplY3QuYWxsb3dfcmVsYXRlZExpc3QgPSBvYmplY3RMYXlvdXQucmVsYXRlZExpc3QgfHwgW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IG9iamVjdFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwib2JqZWN0cWwgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvb2JqZWN0cWxcIik7XG5NZXRlb3IucHVibGlzaCBcImNyZWF0b3Jfb2JqZWN0c1wiLCAoc3BhY2UpLT5cblx0I1RPRE8g5qC55o2u5p2D6ZmQ6L+U5ZueT2JqZWN0c+iusOW9lVxuXHRjb25maWcgPSBvYmplY3RxbC5nZXRTdGVlZG9zQ29uZmlnKCk7XG5cdGlmIGNvbmZpZy50ZW5hbnQgJiYgY29uZmlnLnRlbmFudC5zYWFzXG5cdFx0cmV0dXJuXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZCh7c3BhY2U6IHskaW46IFtudWxsLCBzcGFjZV19LCBpc19kZWxldGVkOiB7JG5lOiB0cnVlfX0sIHtmaWVsZHM6IHtfaWQ6IDEsIG1vZGlmaWVkOiAxLCBpc19lbmFibGU6IDEsIGluX2RldmVsb3BtZW50OiAxfX0pIiwidmFyIG9iamVjdHFsO1xuXG5vYmplY3RxbCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9vYmplY3RxbFwiKTtcblxuTWV0ZW9yLnB1Ymxpc2goXCJjcmVhdG9yX29iamVjdHNcIiwgZnVuY3Rpb24oc3BhY2UpIHtcbiAgdmFyIGNvbmZpZztcbiAgY29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xuICBpZiAoY29uZmlnLnRlbmFudCAmJiBjb25maWcudGVuYW50LnNhYXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZCh7XG4gICAgc3BhY2U6IHtcbiAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgIH0sXG4gICAgaXNfZGVsZXRlZDoge1xuICAgICAgJG5lOiB0cnVlXG4gICAgfVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBfaWQ6IDEsXG4gICAgICBtb2RpZmllZDogMSxcbiAgICAgIGlzX2VuYWJsZTogMSxcbiAgICAgIGluX2RldmVsb3BtZW50OiAxXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJwdWJsaXNoX29iamVjdF9sYXlvdXRzXCIsIChzcGFjZSktPlxuXHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRpZiAhdXNlcklkXG5cdFx0cmV0dXJuXG5cdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZSwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSlcblx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIikuZmluZCh7c3BhY2U6IHskaW46IFtudWxsLCBzcGFjZV19LCBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGV9LCB7ZmllbGRzOiB7X2lkOiAxLCBtb2RpZmllZDogMSwgb2JqZWN0X25hbWU6IDF9fSkiLCJNZXRlb3IucHVibGlzaChcInB1Ymxpc2hfb2JqZWN0X2xheW91dHNcIiwgZnVuY3Rpb24oc3BhY2UpIHtcbiAgdmFyIHNwYWNlVXNlciwgdXNlcklkO1xuICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgaWYgKCF1c2VySWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwcm9maWxlOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGF5b3V0c1wiKS5maW5kKHtcbiAgICAgIHNwYWNlOiB7XG4gICAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgICAgfSxcbiAgICAgIHByb2ZpbGVzOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIG1vZGlmaWVkOiAxLFxuICAgICAgICBvYmplY3RfbmFtZTogMVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
