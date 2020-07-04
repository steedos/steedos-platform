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
        object = clone(new Creator.Object(_object));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfY3JlYXRvcl9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3QtZGF0YWJhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9vYmplY3RfbGF5b3V0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvb2JqZWN0X2xheW91dHMuY29mZmVlIl0sIm5hbWVzIjpbIl9nZXRMb2NhbGUiLCJjbG9uZSIsImdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0Iiwic3RlZWRvc0kxOG4iLCJyZXF1aXJlIiwidXNlciIsImxvY2FsZSIsInJlZiIsInJlZjEiLCJ0b0xvY2FsZUxvd2VyQ2FzZSIsInVzZXJJZCIsInNwYWNlSWQiLCJvYmplY3ROYW1lIiwic3BhY2VVc2VyIiwiQ3JlYXRvciIsImdldENvbGxlY3Rpb24iLCJmaW5kT25lIiwic3BhY2UiLCJmaWVsZHMiLCJwcm9maWxlIiwicHJvZmlsZXMiLCJvYmplY3RfbmFtZSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiX2ZpZWxkcyIsIl9pZCIsIl9vYmplY3QiLCJlIiwiaXNTcGFjZUFkbWluIiwibG5nIiwib2JqZWN0Iiwib2JqZWN0TGF5b3V0IiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNDdXJyZW50IiwicHNldHNVc2VyIiwidHlwZSIsInBhcmFtcyIsImhlYWRlcnMiLCJxdWVyeSIsIl8iLCJpc0VtcHR5IiwiaW5fZGV2ZWxvcG1lbnQiLCJpc19lbmFibGUiLCJPYmplY3QiLCJkYiIsImxpc3Rfdmlld3MiLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwibmFtZSIsImFzc2lnbmVkX2FwcHMiLCJmaW5kIiwidXNlcnMiLCJmZXRjaCIsInBlcm1pc3Npb25zIiwiZ2V0T2JqZWN0UGVybWlzc2lvbnMiLCJiaW5kIiwidHJhbnNsYXRpb25PYmplY3QiLCJhc3NpZ24iLCJkYXRhc291cmNlIiwiZWFjaCIsIl9pdGVtIiwiZmllbGQiLCJoYXMiLCJncm91cCIsInJlcXVpcmVkIiwicmVhZG9ubHkiLCJkaXNhYmxlZCIsImFsbG93X2FjdGlvbnMiLCJhY3Rpb25zIiwic2VuZFJlc3VsdCIsImNvZGUiLCJkYXRhIiwiZXJyb3IiLCJjb25zb2xlIiwic3RhY2siLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJyZWFzb24iLCJtZXNzYWdlIiwib2JqZWN0cWwiLCJNZXRlb3IiLCJwdWJsaXNoIiwiY29uZmlnIiwiZ2V0U3RlZWRvc0NvbmZpZyIsInRlbmFudCIsInNhYXMiLCIkaW4iLCJtb2RpZmllZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxVQUFBLEVBQUFDLEtBQUEsRUFBQUMsMEJBQUEsRUFBQUMsV0FBQTs7QUFBQUYsUUFBUUcsUUFBUSxPQUFSLENBQVI7QUFDQUQsY0FBY0MsUUFBUSxlQUFSLENBQWQ7O0FBRUFKLGFBQWEsVUFBQ0ssSUFBRDtBQUNaLE1BQUFDLE1BQUEsRUFBQUMsR0FBQSxFQUFBQyxJQUFBOztBQUFBLE9BQUFILFFBQUEsUUFBQUUsTUFBQUYsS0FBQUMsTUFBQSxZQUFBQyxJQUFpQkUsaUJBQWpCLEtBQUcsTUFBSCxHQUFHLE1BQUgsTUFBd0MsT0FBeEM7QUFDQ0gsYUFBUyxPQUFUO0FBREQsU0FFSyxLQUFBRCxRQUFBLFFB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QUssQ0FBTjtBQUFTOEQsa0JBQVUsQ0FBbkI7QUFBc0JyRSxxQkFBYTtBQUFuQztBQUFULEtBQXpHLENDU0U7QUFZRDtBRDNCSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdC1kYXRhYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsb25lID0gcmVxdWlyZShcImNsb25lXCIpO1xyXG5zdGVlZG9zSTE4biA9IHJlcXVpcmUoXCJAc3RlZWRvcy9pMThuXCIpO1xyXG5cclxuX2dldExvY2FsZSA9ICh1c2VyKS0+XHJcblx0aWYgdXNlcj8ubG9jYWxlPy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICd6aC1jbidcclxuXHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cdGVsc2UgaWYgdXNlcj8ubG9jYWxlPy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICdlbi11cydcclxuXHRcdGxvY2FsZSA9IFwiZW5cIlxyXG5cdGVsc2VcclxuXHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cdHJldHVybiBsb2NhbGVcclxuXHJcbmdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0ID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0TmFtZSktPlxyXG5cdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KVxyXG5cdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9sYXlvdXRzXCIpPy5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgcHJvZmlsZXM6IHNwYWNlVXNlci5wcm9maWxlLCBvYmplY3RfbmFtZTogb2JqZWN0TmFtZX0pO1xyXG5cclxuSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2NyZWF0b3IvOnNwYWNlL29iamVjdHMvOl9pZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdF9pZCA9IHJlcS5wYXJhbXMuX2lkXHJcblx0XHRzcGFjZUlkID0gcmVxLnBhcmFtcy5zcGFjZVxyXG5cdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cclxuXHJcblx0XHR0eXBlID0gcmVxLnF1ZXJ5Py50eXBlXHJcblxyXG5cdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0cycpLmZpbmRPbmUoX2lkKSB8fCB7fVxyXG5cclxuXHRcdG9iamVjdCA9IHt9XHJcblx0XHRpc1NwYWNlQWRtaW4gPSBDcmVhdG9yLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VySWQpXHJcblx0XHRpZiAhXy5pc0VtcHR5KF9vYmplY3QpXHJcblx0XHRcdGlmIGlzU3BhY2VBZG1pbiB8fCBfb2JqZWN0LmluX2RldmVsb3BtZW50ID09ICcwJyAmJiBfb2JqZWN0LmlzX2VuYWJsZVxyXG5cdFx0XHRcdG9iamVjdCA9IGNsb25lKG5ldyBDcmVhdG9yLk9iamVjdChfb2JqZWN0KSk7XHJcblx0XHRcdFx0ZGVsZXRlIG9iamVjdC5kYlxyXG5cdFx0XHRcdG9iamVjdC5saXN0X3ZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0Lm5hbWUpXHJcblx0I1x0XHRcdGlmIHR5cGUgPT0gXCJhZGRlZFwiXHJcblx0XHRcdFx0cHNldHNBZG1pbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAnYWRtaW4nfSwge2ZpZWxkczp7X2lkOjEsIGFzc2lnbmVkX2FwcHM6MX19KVxyXG5cdFx0XHRcdHBzZXRzVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCBuYW1lOiAndXNlcid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXHJcblx0XHRcdFx0cHNldHNDdXJyZW50ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZCh7dXNlcnM6IHVzZXJJZCwgc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pLmZldGNoKClcclxuXHRcdFx0XHRwc2V0cyA9IHsgcHNldHNBZG1pbiwgcHNldHNVc2VyLCBwc2V0c0N1cnJlbnQgfVxyXG5cclxuXHRcdFx0XHRvYmplY3QucGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0Lm5hbWUpXHJcblxyXG5cdFx0XHRcdGxuZyA9IF9nZXRMb2NhbGUoZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtsb2NhbGU6IDF9fSkpXHJcblx0XHRcdFx0c3RlZWRvc0kxOG4udHJhbnNsYXRpb25PYmplY3QobG5nLCBvYmplY3QubmFtZSwgT2JqZWN0LmFzc2lnbihvYmplY3QsIHtkYXRhc291cmNlOiBfb2JqZWN0LmRhdGFzb3VyY2V9KSlcclxuXHJcblx0XHRcdFx0b2JqZWN0TGF5b3V0ID0gZ2V0VXNlclByb2ZpbGVPYmplY3RMYXlvdXQodXNlcklkLCBzcGFjZUlkLCBvYmplY3QubmFtZSlcclxuXHRcdFx0XHRpZiBvYmplY3RMYXlvdXRcclxuXHRcdFx0XHRcdF9maWVsZHMgPSB7fTtcclxuXHRcdFx0XHRcdF8uZWFjaCBvYmplY3RMYXlvdXQuZmllbGRzLCAoX2l0ZW0pLT5cclxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0gPSBvYmplY3QuZmllbGRzW19pdGVtLmZpZWxkXVxyXG5cdFx0XHRcdFx0XHRpZiBfLmhhcyhfaXRlbSwgJ2dyb3VwJylcclxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5ncm91cCA9IF9pdGVtLmdyb3VwXHJcblx0XHRcdFx0XHRcdGlmIF9pdGVtLnJlcXVpcmVkXHJcblx0XHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVhZG9ubHkgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLmRpc2FibGVkID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXS5yZXF1aXJlZCA9IHRydWVcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBfaXRlbS5yZWFkb25seVxyXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlYWRvbmx5ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLmRpc2FibGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlcXVpcmVkID0gZmFsc2VcclxuXHRcdFx0XHRcdG9iamVjdC5maWVsZHMgPSBfZmllbGRzXHJcblx0XHRcdFx0XHRvYmplY3QuYWxsb3dfYWN0aW9ucyA9IG9iamVjdExheW91dC5hY3Rpb25zIHx8IFtdXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiBvYmplY3RcclxuXHRcdH1cclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbeyBlcnJvck1lc3NhZ2U6IGUucmVhc29uIHx8IGUubWVzc2FnZSB9XSB9XHJcblx0XHR9IiwidmFyIF9nZXRMb2NhbGUsIGNsb25lLCBnZXRVc2VyUHJvZmlsZU9iamVjdExheW91dCwgc3RlZWRvc0kxOG47XG5cbmNsb25lID0gcmVxdWlyZShcImNsb25lXCIpO1xuXG5zdGVlZG9zSTE4biA9IHJlcXVpcmUoXCJAc3RlZWRvcy9pMThuXCIpO1xuXG5fZ2V0TG9jYWxlID0gZnVuY3Rpb24odXNlcikge1xuICB2YXIgbG9jYWxlLCByZWYsIHJlZjE7XG4gIGlmICgodXNlciAhPSBudWxsID8gKHJlZiA9IHVzZXIubG9jYWxlKSAhPSBudWxsID8gcmVmLnRvTG9jYWxlTG93ZXJDYXNlKCkgOiB2b2lkIDAgOiB2b2lkIDApID09PSAnemgtY24nKSB7XG4gICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICB9IGVsc2UgaWYgKCh1c2VyICE9IG51bGwgPyAocmVmMSA9IHVzZXIubG9jYWxlKSAhPSBudWxsID8gcmVmMS50b0xvY2FsZUxvd2VyQ2FzZSgpIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gJ2VuLXVzJykge1xuICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgfSBlbHNlIHtcbiAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gIH1cbiAgcmV0dXJuIGxvY2FsZTtcbn07XG5cbmdldFVzZXJQcm9maWxlT2JqZWN0TGF5b3V0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3ROYW1lKSB7XG4gIHZhciByZWYsIHNwYWNlVXNlcjtcbiAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHByb2ZpbGU6IDFcbiAgICB9XG4gIH0pO1xuICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGF5b3V0c1wiKSkgIT0gbnVsbCA/IHJlZi5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgcHJvZmlsZXM6IHNwYWNlVXNlci5wcm9maWxlLFxuICAgICAgb2JqZWN0X25hbWU6IG9iamVjdE5hbWVcbiAgICB9KSA6IHZvaWQgMDtcbiAgfVxufTtcblxuSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2NyZWF0b3IvOnNwYWNlL29iamVjdHMvOl9pZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBfZmllbGRzLCBfaWQsIF9vYmplY3QsIGUsIGlzU3BhY2VBZG1pbiwgbG5nLCBvYmplY3QsIG9iamVjdExheW91dCwgcHNldHMsIHBzZXRzQWRtaW4sIHBzZXRzQ3VycmVudCwgcHNldHNVc2VyLCByZWYsIHNwYWNlSWQsIHR5cGUsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICBfaWQgPSByZXEucGFyYW1zLl9pZDtcbiAgICBzcGFjZUlkID0gcmVxLnBhcmFtcy5zcGFjZTtcbiAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICB0eXBlID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwO1xuICAgIF9vYmplY3QgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdHMnKS5maW5kT25lKF9pZCkgfHwge307XG4gICAgb2JqZWN0ID0ge307XG4gICAgaXNTcGFjZUFkbWluID0gQ3JlYXRvci5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlcklkKTtcbiAgICBpZiAoIV8uaXNFbXB0eShfb2JqZWN0KSkge1xuICAgICAgaWYgKGlzU3BhY2VBZG1pbiB8fCBfb2JqZWN0LmluX2RldmVsb3BtZW50ID09PSAnMCcgJiYgX29iamVjdC5pc19lbmFibGUpIHtcbiAgICAgICAgb2JqZWN0ID0gY2xvbmUobmV3IENyZWF0b3IuT2JqZWN0KF9vYmplY3QpKTtcbiAgICAgICAgZGVsZXRlIG9iamVjdC5kYjtcbiAgICAgICAgb2JqZWN0Lmxpc3Rfdmlld3MgPSBDcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3ModXNlcklkLCBzcGFjZUlkLCBvYmplY3QubmFtZSk7XG4gICAgICAgIHBzZXRzQWRtaW4gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICBuYW1lOiAnYWRtaW4nXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwc2V0c1VzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgICBuYW1lOiAndXNlcidcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBzZXRzQ3VycmVudCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInBlcm1pc3Npb25fc2V0XCIpLmZpbmQoe1xuICAgICAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgYXNzaWduZWRfYXBwczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgcHNldHMgPSB7XG4gICAgICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgICAgICBwc2V0c1VzZXI6IHBzZXRzVXNlcixcbiAgICAgICAgICBwc2V0c0N1cnJlbnQ6IHBzZXRzQ3VycmVudFxuICAgICAgICB9O1xuICAgICAgICBvYmplY3QucGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0Lm5hbWUpO1xuICAgICAgICBsbmcgPSBfZ2V0TG9jYWxlKGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBsb2NhbGU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgICAgc3RlZWRvc0kxOG4udHJhbnNsYXRpb25PYmplY3QobG5nLCBvYmplY3QubmFtZSwgT2JqZWN0LmFzc2lnbihvYmplY3QsIHtcbiAgICAgICAgICBkYXRhc291cmNlOiBfb2JqZWN0LmRhdGFzb3VyY2VcbiAgICAgICAgfSkpO1xuICAgICAgICBvYmplY3RMYXlvdXQgPSBnZXRVc2VyUHJvZmlsZU9iamVjdExheW91dCh1c2VySWQsIHNwYWNlSWQsIG9iamVjdC5uYW1lKTtcbiAgICAgICAgaWYgKG9iamVjdExheW91dCkge1xuICAgICAgICAgIF9maWVsZHMgPSB7fTtcbiAgICAgICAgICBfLmVhY2gob2JqZWN0TGF5b3V0LmZpZWxkcywgZnVuY3Rpb24oX2l0ZW0pIHtcbiAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdID0gb2JqZWN0LmZpZWxkc1tfaXRlbS5maWVsZF07XG4gICAgICAgICAgICBpZiAoXy5oYXMoX2l0ZW0sICdncm91cCcpKSB7XG4gICAgICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdLmdyb3VwID0gX2l0ZW0uZ3JvdXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX2l0ZW0ucmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVhZG9ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9maWVsZHNbX2l0ZW0uZmllbGRdLnJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX2l0ZW0ucmVhZG9ubHkpIHtcbiAgICAgICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0ucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJldHVybiBfZmllbGRzW19pdGVtLmZpZWxkXS5yZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9iamVjdC5maWVsZHMgPSBfZmllbGRzO1xuICAgICAgICAgIG9iamVjdC5hbGxvd19hY3Rpb25zID0gb2JqZWN0TGF5b3V0LmFjdGlvbnMgfHwgW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IG9iamVjdFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwib2JqZWN0cWwgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvb2JqZWN0cWxcIik7XHJcbk1ldGVvci5wdWJsaXNoIFwiY3JlYXRvcl9vYmplY3RzXCIsIChzcGFjZSktPlxyXG5cdCNUT0RPIOagueaNruadg+mZkOi/lOWbnk9iamVjdHPorrDlvZVcclxuXHRjb25maWcgPSBvYmplY3RxbC5nZXRTdGVlZG9zQ29uZmlnKCk7XHJcblx0aWYgY29uZmlnLnRlbmFudCAmJiBjb25maWcudGVuYW50LnNhYXNcclxuXHRcdHJldHVyblxyXG5cdENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZCh7c3BhY2U6IHskaW46IFtudWxsLCBzcGFjZV19fSwge2ZpZWxkczoge19pZDogMSwgbW9kaWZpZWQ6IDEsIGlzX2VuYWJsZTogMSwgaW5fZGV2ZWxvcG1lbnQ6IDF9fSkiLCJ2YXIgb2JqZWN0cWw7XG5cbm9iamVjdHFsID0gcmVxdWlyZShcIkBzdGVlZG9zL29iamVjdHFsXCIpO1xuXG5NZXRlb3IucHVibGlzaChcImNyZWF0b3Jfb2JqZWN0c1wiLCBmdW5jdGlvbihzcGFjZSkge1xuICB2YXIgY29uZmlnO1xuICBjb25maWcgPSBvYmplY3RxbC5nZXRTdGVlZG9zQ29uZmlnKCk7XG4gIGlmIChjb25maWcudGVuYW50ICYmIGNvbmZpZy50ZW5hbnQuc2Fhcykge1xuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kKHtcbiAgICBzcGFjZToge1xuICAgICAgJGluOiBbbnVsbCwgc3BhY2VdXG4gICAgfVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBfaWQ6IDEsXG4gICAgICBtb2RpZmllZDogMSxcbiAgICAgIGlzX2VuYWJsZTogMSxcbiAgICAgIGluX2RldmVsb3BtZW50OiAxXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggXCJwdWJsaXNoX29iamVjdF9sYXlvdXRzXCIsIChzcGFjZSktPlxyXG5cdHVzZXJJZCA9IHRoaXMudXNlcklkXHJcblx0aWYgIXVzZXJJZFxyXG5cdFx0cmV0dXJuXHJcblx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KVxyXG5cdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxyXG5cdFx0Q3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIikuZmluZCh7c3BhY2U6IHskaW46IFtudWxsLCBzcGFjZV19LCBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGV9LCB7ZmllbGRzOiB7X2lkOiAxLCBtb2RpZmllZDogMSwgb2JqZWN0X25hbWU6IDF9fSkiLCJNZXRlb3IucHVibGlzaChcInB1Ymxpc2hfb2JqZWN0X2xheW91dHNcIiwgZnVuY3Rpb24oc3BhY2UpIHtcbiAgdmFyIHNwYWNlVXNlciwgdXNlcklkO1xuICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgaWYgKCF1c2VySWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwcm9maWxlOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGF5b3V0c1wiKS5maW5kKHtcbiAgICAgIHNwYWNlOiB7XG4gICAgICAgICRpbjogW251bGwsIHNwYWNlXVxuICAgICAgfSxcbiAgICAgIHByb2ZpbGVzOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIG1vZGlmaWVkOiAxLFxuICAgICAgICBvYmplY3RfbmFtZTogMVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
