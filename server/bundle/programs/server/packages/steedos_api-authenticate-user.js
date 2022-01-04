(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Accounts = Package['accounts-base'].Accounts;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:api-authenticate-user":{"checkNpm.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/steedos_api-authenticate-user/checkNpm.js                                                   //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({}, 'steedos:api-authenticate-user');
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"auth_user.coffee":function module(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/steedos_api-authenticate-user/auth_user.coffee                                              //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Fiber;
Fiber = require('fibers');

JsonRoutes.Middleware.authenticateMeteorUser = function (req, res, next) {
  return Fiber(function () {
    var ref, userId;

    if (!req.userId) {
      userId = Steedos.getUserIdFromAccessToken((ref = req.query) != null ? ref.access_token : void 0);

      if (!userId) {
        userId = Steedos.getUserIdFromAuthToken(req, res);
      }

      if (userId) {
        req.userId = userId;
      }
    }

    return next();
  }).run();
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"routes_middleware_config.coffee":function module(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/steedos_api-authenticate-user/routes_middleware_config.coffee                               //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
JsonRoutes.Middleware.use('/api', JsonRoutes.Middleware.authenticateMeteorUser);
JsonRoutes.Middleware.use('/steedos/api/space_users', JsonRoutes.Middleware.authenticateMeteorUser);
JsonRoutes.Middleware.use('/tableau/api', JsonRoutes.Middleware.authenticateMeteorUser);
JsonRoutes.Middleware.use('/tableau/search', JsonRoutes.Middleware.authenticateMeteorUser);
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:api-authenticate-user/checkNpm.js");
require("/node_modules/meteor/steedos:api-authenticate-user/auth_user.coffee");
require("/node_modules/meteor/steedos:api-authenticate-user/routes_middleware_config.coffee");

/* Exports */
Package._define("steedos:api-authenticate-user");

})();

//# sourceURL=meteor://💻app/packages/steedos_api-authenticate-user.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGktYXV0aGVudGljYXRlLXVzZXIvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLWF1dGhlbnRpY2F0ZS11c2VyL2F1dGhfdXNlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2F1dGhfdXNlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLWF1dGhlbnRpY2F0ZS11c2VyL3JvdXRlc19taWRkbGV3YXJlX2NvbmZpZy5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiRmliZXIiLCJyZXF1aXJlIiwiSnNvblJvdXRlcyIsIk1pZGRsZXdhcmUiLCJhdXRoZW50aWNhdGVNZXRlb3JVc2VyIiwicmVxIiwicmVzIiwibmV4dCIsInJlZiIsInVzZXJJZCIsIlN0ZWVkb3MiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJxdWVyeSIsImFjY2Vzc190b2tlbiIsImdldFVzZXJJZEZyb21BdXRoVG9rZW4iLCJydW4iLCJ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDLEVBQUQsRUFDYiwrQkFEYSxDQUFoQixDOzs7Ozs7Ozs7Ozs7QUNEQSxJQUFBSSxLQUFBO0FBQUFBLFFBQVFDLFFBQVEsUUFBUixDQUFSOztBQUVBQyxXQUFXQyxVQUFYLENBQXNCQyxzQkFBdEIsR0FBK0MsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVg7QUNHN0MsU0RERFAsTUFBTTtBQUNMLFFBQUFRLEdBQUEsRUFBQUMsTUFBQTs7QUFBQSxRQUFHLENBQUNKLElBQUlJLE1BQVI7QUFDQ0EsZUFBU0MsUUFBUUMsd0JBQVIsRUFBQUgsTUFBQUgsSUFBQU8sS0FBQSxZQUFBSixJQUE0Q0ssWUFBNUMsR0FBNEMsTUFBNUMsQ0FBVDs7QUFFQSxVQUFHLENBQUlKLE1BQVA7QUFDQ0EsaUJBQVNDLFFBQVFJLHNCQUFSLENBQStCVCxHQUEvQixFQUFvQ0MsR0FBcEMsQ0FBVDtBQ0VHOztBREFKLFVBQUdHLE1BQUg7QUFDQ0osWUFBSUksTUFBSixHQUFhQSxNQUFiO0FBUEY7QUNVRzs7QUFDRCxXREZGRixNQ0VFO0FEWkgsS0FXRVEsR0FYRixFQ0NDO0FESDZDLENBQS9DLEM7Ozs7Ozs7Ozs7OztBRUZBYixXQUFXQyxVQUFYLENBQXNCYSxHQUF0QixDQUEwQixNQUExQixFQUFrQ2QsV0FBV0MsVUFBWCxDQUFzQkMsc0JBQXhEO0FBRUFGLFdBQVdDLFVBQVgsQ0FBc0JhLEdBQXRCLENBQTBCLDBCQUExQixFQUFzRGQsV0FBV0MsVUFBWCxDQUFzQkMsc0JBQTVFO0FBRUFGLFdBQVdDLFVBQVgsQ0FBc0JhLEdBQXRCLENBQTBCLGNBQTFCLEVBQTBDZCxXQUFXQyxVQUFYLENBQXNCQyxzQkFBaEU7QUFDQUYsV0FBV0MsVUFBWCxDQUFzQmEsR0FBdEIsQ0FBMEIsaUJBQTFCLEVBQTZDZCxXQUFXQyxVQUFYLENBQXNCQyxzQkFBbkUsRSIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19hcGktYXV0aGVudGljYXRlLXVzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcbn0sICdzdGVlZG9zOmFwaS1hdXRoZW50aWNhdGUtdXNlcicpOyIsIkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS5hdXRoZW50aWNhdGVNZXRlb3JVc2VyID0gKHJlcSwgcmVzLCBuZXh0KS0+XG5cblx0RmliZXIoKCktPlxuXHRcdGlmICFyZXEudXNlcklkXG5cdFx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihyZXEucXVlcnk/LmFjY2Vzc190b2tlbik7XG5cblx0XHRcdGlmIG5vdCB1c2VySWRcblx0XHRcdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcblxuXHRcdFx0aWYgdXNlcklkXG5cdFx0XHRcdHJlcS51c2VySWQgPSB1c2VySWQ7XG5cblx0XHRuZXh0KCk7XG5cdCkucnVuKCkiLCJ2YXIgRmliZXI7XG5cbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS5hdXRoZW50aWNhdGVNZXRlb3JVc2VyID0gZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYsIHVzZXJJZDtcbiAgICBpZiAoIXJlcS51c2VySWQpIHtcbiAgICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYuYWNjZXNzX3Rva2VuIDogdm9pZCAwKTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG4gICAgICB9XG4gICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgIHJlcS51c2VySWQgPSB1c2VySWQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXh0KCk7XG4gIH0pLnJ1bigpO1xufTtcbiIsIkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoJy9hcGknLCBKc29uUm91dGVzLk1pZGRsZXdhcmUuYXV0aGVudGljYXRlTWV0ZW9yVXNlcik7XG5cbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoJy9zdGVlZG9zL2FwaS9zcGFjZV91c2VycycsIEpzb25Sb3V0ZXMuTWlkZGxld2FyZS5hdXRoZW50aWNhdGVNZXRlb3JVc2VyKTtcblxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSgnL3RhYmxlYXUvYXBpJywgSnNvblJvdXRlcy5NaWRkbGV3YXJlLmF1dGhlbnRpY2F0ZU1ldGVvclVzZXIpO1xuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSgnL3RhYmxlYXUvc2VhcmNoJywgSnNvblJvdXRlcy5NaWRkbGV3YXJlLmF1dGhlbnRpY2F0ZU1ldGVvclVzZXIpO1xuXG4iXX0=
