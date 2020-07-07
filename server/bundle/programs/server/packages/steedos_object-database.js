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
var _getLocale, clone, getUserProfileObjectLayout, steedosI18n;

clone = require("clone");
steedosI18n = require("@steedos/i18n");

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
  var _fields, _id, _object, e, isSpaceAdmin, lng, object, objectLayout, psets, psetsAdmin, psetsCurrent, psetsUser, ref, spaceId, type, userId;

  try {
    _id = req.params._id;
    spaceId = req.params.space;
    userId = req.headers["x-user-id"];
    type = (ref = req.query) != null ? ref.type : void 0;
    _object = Creator.getCollection('objects').findOne(_id) || {};
    object = {};
    isSpaceAdmin = Creator.isSpaceAdmin(spaceId, userId);

    if (!_.isEmpty(_object)) {
      if (isSpaceAdmin || _object.in_development === '0' && _object.is_enable) {
        object = Creator.convertObject(clone(new Creator.Object(_object)), spaceId);
        delete object.db;
        object.list_views = Creator.getUserObjectListViews(userId, spaceId, object.name);
        psetsAdmin = Creator.getCollection("permission_set").findOne({
          space: spaceId,
          name: 'admin'
        }, {
          fields: {
            _id: 1,
            assigned_apps: 1
          }
        });
        psetsUser = Creator.getCollection("permission_set").findOne({
          space: spaceId,
          name: 'user'
        }, {
          fields: {
            _id: 1,
            assigned_apps: 1
          }
        });
        psetsCurrent = Creator.getCollection("permission_set").find({
          users: userId,
          space: spaceId
        }, {
          fields: {
            _id: 1,
            assigned_apps: 1
          }
        }).fetch();
        psets = {
          psetsAdmin: psetsAdmin,
          psetsUser: psetsUser,
          psetsCurrent: psetsCurrent
        };
        object.permissions = Creator.getObjectPermissions.bind(psets)(spaceId, userId, object.name);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfbGF5b3V0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvb2JqZWN0X2xheW91dHMuY29mZmVlIl0sIm5hbWVzIjpbIl9nZXRMb2NhbGUiLCJjbG9uZSIsImdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0Iiwic3RlZWRvc0kxOG4iLCJyZXF1aXJlIiwidXNlciIsImxvY2FsZSIsInJlZiIsInJlZjEiLCJ0b0xvY2FsZUxvd2VyQ2FzZSIsInVzZXJJZCIsInNwYWNlSWQiLCJvYmplY3ROYW1lIiwic3BhY2VVc2VyIiwiQ3JlYXRvciIsImdldENvbGxlY3Rpb24iLCJmaW5kT25lIiwic3BhY2UiLCJmaWVsZHMiLCJwcm9maWxlIiwicHJvZmlsZXMiLCJvYmplY3RfbmFtZSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiX2ZpZWxkcyIsIl9pZCIsIl9vYmplY3QiLCJlIiwiaXNTcGFjZUFkbWluIiwibG5nIiwib2JqZWN0Iiwib2JqZWN0TGF5b3V0IiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNDdXJyZW50IiwicHNldHNVc2VyIiwidHlwZSIsInBhcmFtcyIsImhlYWRlcnMiLCJxdWVyeSIsIl8iLCJpc0VtcHR5IiwiaW5fZGV2ZWxvcG1lbnQiLCJpc19lbmFibGUiLCJjb252ZXJ0T2JqZWN0IiwiT2JqZWN0IiwiZGIiLCJsaXN0X3ZpZXdzIiwiZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsIm5hbWUiLCJhc3NpZ25lZF9hcHBzIiwiZmluZCIsInVzZXJzIiwiZmV0Y2giLCJwZXJtaXNzaW9ucyIsImdldE9iamVjdFBlcm1pc3Npb25zIiwiYmluZCIsInRyYW5zbGF0aW9uT2JqZWN0IiwiYXNzaWduIiwiZGF0YXNvdXJjZSIsImVhY2giLCJfaXRlbSIsImZpZWxkIiwiaGFzIiwiZ3JvdXAiLCJyZXF1aXJlZCIsInJlYWRvbmx5IiwiZGlzYWJsZWQiLCJhbGxvd19hY3Rpb25zIiwiYWN0aW9ucyIsInNlbmRSZXN1bHQiLCJjb2RlIiwiZGF0YSIsImVycm9yIiwiY29uc29sZSIsInN0YWNrIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwicmVhc29uIiwibWVzc2FnZSIsIm9iamVjdHFsIiwiTWV0ZW9yIiwicHVibGlzaCIsImNvbmZpZyIsImdldFN0ZWVkb3NDb25maWciLCJ0ZW5hbnQiLCJzYWFzIiwiJGluIiwibW9kaWZpZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsVUFBQSxFQUFBQyxLQUFBLEVBQUFDLDBCQUFBLEVBQUFDLFdBQUE7O0FBQUFGLFFBQVFHLFFBQVEsT0FBUixDQUFSO0FBQ0FELGNBQWNDLFFBQVEsZUFBUixDQUFkOztBQUVBSixhQUFhLFVBQUNLLElBQUQ7QUFDWixNQUFBQyxNQUFBLEVBQUFDLEdBQUEsRUFBQUMsSUFBQTs7QUFBQSxPQUFBSCxRQUFBLFFBQUFFLE1BQUFGLEtBQUFDLE1BQUEsWUFBQUMsSUFBaUJFLGlCQUFqQixLQUFHLE1BQUgsR0FBRyxNQUFILE1BQXdDLE9BQXhDO0FBQ0NILGFBQVMsT0FBVDtBQURELFNB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QUFSO0FBQThCRyxnQkFBVVAsVUFBVU07QUFBbEQsS0FBN0MsRUFBeUc7QUFBQ0QsY0FBUTtBQUFDVSxhQUFLLENBQU47QUFBUytELGtCQUFVLENBQW5CO0FBQXNCdEUscUJBQWE7QUFBbkM7QUFBVCxLQUF6RyxDQ1NFO0FBWUQ7QUQzQkgsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbG9uZSA9IHJlcXVpcmUoXCJjbG9uZVwiKTtcclxuc3RlZWRvc0kxOG4gPSByZXF1aXJlKFwiQHN0ZWVkb3MvaTE4blwiKTtcclxuXHJcbl9nZXRMb2NhbGUgPSAodXNlciktPlxyXG5cdGlmIHVzZXI/LmxvY2FsZT8udG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAnemgtY24nXHJcblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHRlbHNlIGlmIHVzZXI/LmxvY2FsZT8udG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAnZW4tdXMnXHJcblx0XHRsb2NhbGUgPSBcImVuXCJcclxuXHRlbHNlXHJcblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHRyZXR1cm4gbG9jYWxlXHJcblxyXG5nZXRVc2VyUHJvZmlsZU9iamVjdExheW91dCA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdE5hbWUpLT5cclxuXHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSlcclxuXHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGF5b3V0c1wiKT8uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHByb2ZpbGVzOiBzcGFjZVVzZXIucHJvZmlsZSwgb2JqZWN0X25hbWU6IG9iamVjdE5hbWV9KTtcclxuXHJcbkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9jcmVhdG9yLzpzcGFjZS9vYmplY3RzLzpfaWQnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHRfaWQgPSByZXEucGFyYW1zLl9pZFxyXG5cdFx0c3BhY2VJZCA9IHJlcS5wYXJhbXMuc3BhY2VcclxuXHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXHJcblxyXG5cdFx0dHlwZSA9IHJlcS5xdWVyeT8udHlwZVxyXG5cclxuXHRcdF9vYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdHMnKS5maW5kT25lKF9pZCkgfHwge31cclxuXHJcblx0XHRvYmplY3QgPSB7fVxyXG5cdFx0aXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKVxyXG5cdFx0aWYgIV8uaXNFbXB0eShfb2JqZWN0KVxyXG5cdFx0XHRpZiBpc1NwYWNlQWRtaW4gfHwgX29iamVjdC5pbl9kZXZlbG9wbWVudCA9PSAnMCcgJiYgX29iamVjdC5pc19lbmFibGVcclxuXHRcdFx0XHRvYmplY3QgPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUobmV3IENyZWF0b3IuT2JqZWN0KF9vYmplY3QpKSwgc3BhY2VJZCk7XHJcblx0XHRcdFx0ZGVsZXRlIG9iamVjdC5kYlxyXG5cdFx0XHRcdG9iamVjdC5saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpXHJcblx0I1x0XHRcdGlmIHR5cGUgPT0gXCJhZGRlZFwiXHJcblx0XHRcdFx0cHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0XHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pLmZldGNoKClcclxuXHRcdFx0XHRwc2V0cyA9IHsgcHNldHNBZG1pbiwgcHNldHNVc2VyLCBwc2V0c0N1cnJlbnQgfVxyXG5cclxuXHRcdFx0XHRvYmplY3QucGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0Lm5hbWUpXHJcblxyXG5cdFx0XHRcdGxuZyA9IF9nZXRMb2NhbGUoZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtsb2NhbGU6IDF9fSkpXHJcblx0XHRcdFx0c3RlZWRvc0kxOG4udHJhbnNsYXRpb25PYmplY3QobG5nLCBvYmplY3QubmFtZSwgT2JqZWN0LmFzc2lnbihvYmplY3QsIHtkYXRhc291cmNlOiBfb2JqZWN0LmRhdGFzb3VyY2V9KSlcclxuXHRcdFx0XHRvYmplY3RMYXlvdXQgPSBnZXRVc2VyUHJvZmlsZU9iamVjdExheW91dCh1c2VySWQsIHNwYWNlSWQsIG9iamVjdC5uYW1lKVxyXG5cdFx0XHRcdGlmIG9iamVjdExheW91dFxyXG5cdFx0XHRcdFx0X2ZpZWxkcyA9IHt9O1xyXG5cdFx0XHRcdFx0Xy5lYWNoIG9iamVjdExheW91dC5maWVsZHMsIChfaXRlbSktPlxyXG5cdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXSA9IG9iamVjdC5maWVsZHNbX2l0ZW0uZmllbGRdXHJcblx0XHRcdFx0XHRcdGlmIF8uaGFzKF9pdGVtLCAnZ3JvdXAnKVxyXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLmdyb3VwID0gX2l0ZW0uZ3JvdXBcclxuXHRcdFx0XHRcdFx0aWYgX2l0ZW0ucmVxdWlyZWRcclxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5yZWFkb25seSA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0uZGlzYWJsZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlcXVpcmVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIF9pdGVtLnJlYWRvbmx5XHJcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVhZG9ubHkgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0uZGlzYWJsZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVxdWlyZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0b2JqZWN0LmZpZWxkcyA9IF9maWVsZHNcclxuXHRcdFx0XHRcdG9iamVjdC5hbGxvd19hY3Rpb25zID0gb2JqZWN0TGF5b3V0LmFjdGlvbnMgfHwgW11cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IG9iamVjdFxyXG5cdFx0fVxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywge1xyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7IGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlIH1dIH1cclxuXHRcdH0iLCJ2YXIgX2dldExvY2FsZSwgY2xvbmUsIGdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0LCBzdGVlZG9zSTE4bjtcblxuY2xvbmUgPSByZXF1aXJlKFwiY2xvbmVcIik7XG5cbnN0ZWVkb3NJMThuID0gcmVxdWlyZShcIkBzdGVlZG9zL2kxOG5cIik7XG5cbl9nZXRMb2NhbGUgPSBmdW5jdGlvbih1c2VyKSB7XG4gIHZhciBsb2NhbGUsIHJlZiwgcmVmMTtcbiAgaWYgKCh1c2VyICE9IG51bGwgPyAocmVmID0gdXNlci5sb2NhbGUpICE9IG51bGwgPyByZWYudG9Mb2NhbGVMb3dlckNhc2UoKSA6IHZvaWQgMCA6IHZvaWQgMCkgPT09ICd6aC1jbicpIHtcbiAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gIH0gZWxzZSBpZiAoKHVzZXIgIT0gbnVsbCA/IChyZWYxID0gdXNlci5sb2NhbGUpICE9IG51bGwgPyByZWYxLnRvTG9jYWxlTG93ZXJDYXNlKCkgOiB2b2lkIDAgOiB2b2lkIDApID09PSAnZW4tdXMnKSB7XG4gICAgbG9jYWxlID0gXCJlblwiO1xuICB9IGVsc2Uge1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgfVxuICByZXR1cm4gbG9jYWxlO1xufTtcblxuZ2V0VXNlclByb2ZpbGVPYmplY3RMYXlvdXQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdE5hbWUpIHtcbiAgdmFyIHJlZiwgc3BhY2VVc2VyO1xuICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgcHJvZmlsZTogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICByZXR1cm4gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9sYXlvdXRzXCIpKSAhPSBudWxsID8gcmVmLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGUsXG4gICAgICBvYmplY3RfbmFtZTogb2JqZWN0TmFtZVxuICAgIH0pIDogdm9pZCAwO1xuICB9XG59O1xuXG5Kc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvY3JlYXRvci86c3BhY2Uvb2JqZWN0cy86X2lkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIF9maWVsZHMsIF9pZCwgX29iamVjdCwgZSwgaXNTcGFjZUFkbWluLCBsbmcsIG9iamVjdCwgb2JqZWN0TGF5b3V0LCBwc2V0cywgcHNldHNBZG1pbiwgcHNldHNDdXJyZW50LCBwc2V0c1VzZXIsIHJlZiwgc3BhY2VJZCwgdHlwZSwgdXNlcklkO1xuICB0cnkge1xuICAgIF9pZCA9IHJlcS5wYXJhbXMuX2lkO1xuICAgIHNwYWNlSWQgPSByZXEucGFyYW1zLnNwYWNlO1xuICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgIHR5cGUgPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDA7XG4gICAgX29iamVjdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0cycpLmZpbmRPbmUoX2lkKSB8fCB7fTtcbiAgICBvYmplY3QgPSB7fTtcbiAgICBpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpO1xuICAgIGlmICghXy5pc0VtcHR5KF9vYmplY3QpKSB7XG4gICAgICBpZiAoaXNTcGFjZUFkbWluIHx8IF9vYmplY3QuaW5fZGV2ZWxvcG1lbnQgPT09ICcwJyAmJiBfb2JqZWN0LmlzX2VuYWJsZSkge1xuICAgICAgICBvYmplY3QgPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUobmV3IENyZWF0b3IuT2JqZWN0KF9vYmplY3QpKSwgc3BhY2VJZCk7XG4gICAgICAgIGRlbGV0ZSBvYmplY3QuZGI7XG4gICAgICAgIG9iamVjdC5saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpO1xuICAgICAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgbmFtZTogJ2FkbWluJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAgICAgbmFtZTogJ3VzZXInXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgICAgICB1c2VyczogdXNlcklkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgIHBzZXRzID0ge1xuICAgICAgICAgIHBzZXRzQWRtaW46IHBzZXRzQWRtaW4sXG4gICAgICAgICAgcHNldHNVc2VyOiBwc2V0c1VzZXIsXG4gICAgICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnRcbiAgICAgICAgfTtcbiAgICAgICAgb2JqZWN0LnBlcm1pc3Npb25zID0gQ3JlYXRvci5nZXRPYmplY3RQZXJtaXNzaW9ucy5iaW5kKHBzZXRzKShzcGFjZUlkLCB1c2VySWQsIG9iamVjdC5uYW1lKTtcbiAgICAgICAgbG5nID0gX2dldExvY2FsZShkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgbG9jYWxlOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uT2JqZWN0KGxuZywgb2JqZWN0Lm5hbWUsIE9iamVjdC5hc3NpZ24ob2JqZWN0LCB7XG4gICAgICAgICAgZGF0YXNvdXJjZTogX29iamVjdC5kYXRhc291cmNlXG4gICAgICAgIH0pKTtcbiAgICAgICAgb2JqZWN0TGF5b3V0ID0gZ2V0VXNlclByb2ZpbGVPYmplY3RMYXlvdXQodXNlcklkLCBzcGFjZUlkLCBvYmplY3QubmFtZSk7XG4gICAgICAgIGlmIChvYmplY3RMYXlvdXQpIHtcbiAgICAgICAgICBfZmllbGRzID0ge307XG4gICAgICAgICAgXy5lYWNoKG9iamVjdExheW91dC5maWVsZHMsIGZ1bmN0aW9uKF9pdGVtKSB7XG4gICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXSA9IG9iamVjdC5maWVsZHNbX2l0ZW0uZmllbGRdO1xuICAgICAgICAgICAgaWYgKF8uaGFzKF9pdGVtLCAnZ3JvdXAnKSkge1xuICAgICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXS5ncm91cCA9IF9pdGVtLmdyb3VwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF9pdGVtLnJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlYWRvbmx5ID0gZmFsc2U7XG4gICAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBfZmllbGRzW19pdGVtLmZpZWxkXS5yZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF9pdGVtLnJlYWRvbmx5KSB7XG4gICAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICByZXR1cm4gX2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvYmplY3QuZmllbGRzID0gX2ZpZWxkcztcbiAgICAgICAgICBvYmplY3QuYWxsb3dfYWN0aW9ucyA9IG9iamVjdExheW91dC5hY3Rpb25zIHx8IFtdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBvYmplY3RcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIm9iamVjdHFsID0gcmVxdWlyZShcIkBzdGVlZG9zL29iamVjdHFsXCIpO1xyXG5NZXRlb3IucHVibGlzaCBcImNyZWF0b3Jfb2JqZWN0c1wiLCAoc3BhY2UpLT5cclxuXHQjVE9ETyDmoLnmja7mnYPpmZDov5Tlm55PYmplY3Rz6K6w5b2VXHJcblx0Y29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xyXG5cdGlmIGNvbmZpZy50ZW5hbnQgJiYgY29uZmlnLnRlbmFudC5zYWFzXHJcblx0XHRyZXR1cm5cclxuXHRDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RzXCIpLmZpbmQoe3NwYWNlOiB7JGluOiBbbnVsbCwgc3BhY2VdfX0sIHtmaWVsZHM6IHtfaWQ6IDEsIG1vZGlmaWVkOiAxLCBpc19lbmFibGU6IDEsIGluX2RldmVsb3BtZW50OiAxfX0pIiwidmFyIG9iamVjdHFsO1xuXG5vYmplY3RxbCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9vYmplY3RxbFwiKTtcblxuTWV0ZW9yLnB1Ymxpc2goXCJjcmVhdG9yX29iamVjdHNcIiwgZnVuY3Rpb24oc3BhY2UpIHtcbiAgdmFyIGNvbmZpZztcbiAgY29uZmlnID0gb2JqZWN0cWwuZ2V0U3RlZWRvc0NvbmZpZygpO1xuICBpZiAoY29uZmlnLnRlbmFudCAmJiBjb25maWcudGVuYW50LnNhYXMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZCh7XG4gICAgc3BhY2U6IHtcbiAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgIH1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgX2lkOiAxLFxuICAgICAgbW9kaWZpZWQ6IDEsXG4gICAgICBpc19lbmFibGU6IDEsXG4gICAgICBpbl9kZXZlbG9wbWVudDogMVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoIFwicHVibGlzaF9vYmplY3RfbGF5b3V0c1wiLCAoc3BhY2UpLT5cclxuXHR1c2VySWQgPSB0aGlzLnVzZXJJZFxyXG5cdGlmICF1c2VySWRcclxuXHRcdHJldHVyblxyXG5cdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZSwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSlcclxuXHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcclxuXHRcdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9sYXlvdXRzXCIpLmZpbmQoe3NwYWNlOiB7JGluOiBbbnVsbCwgc3BhY2VdfSwgcHJvZmlsZXM6IHNwYWNlVXNlci5wcm9maWxlfSwge2ZpZWxkczoge19pZDogMSwgbW9kaWZpZWQ6IDEsIG9iamVjdF9uYW1lOiAxfX0pIiwiTWV0ZW9yLnB1Ymxpc2goXCJwdWJsaXNoX29iamVjdF9sYXlvdXRzXCIsIGZ1bmN0aW9uKHNwYWNlKSB7XG4gIHZhciBzcGFjZVVzZXIsIHVzZXJJZDtcbiAgdXNlcklkID0gdGhpcy51c2VySWQ7XG4gIGlmICghdXNlcklkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZSxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgcHJvZmlsZTogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIikuZmluZCh7XG4gICAgICBzcGFjZToge1xuICAgICAgICAkaW46IFtudWxsLCBzcGFjZV1cbiAgICAgIH0sXG4gICAgICBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBtb2RpZmllZDogMSxcbiAgICAgICAgb2JqZWN0X25hbWU6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iXX0=
