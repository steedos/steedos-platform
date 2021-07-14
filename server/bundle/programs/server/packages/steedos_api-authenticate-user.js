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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGktYXV0aGVudGljYXRlLXVzZXIvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLWF1dGhlbnRpY2F0ZS11c2VyL2F1dGhfdXNlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2F1dGhfdXNlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLWF1dGhlbnRpY2F0ZS11c2VyL3JvdXRlc19taWRkbGV3YXJlX2NvbmZpZy5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiRmliZXIiLCJyZXF1aXJlIiwiSnNvblJvdXRlcyIsIk1pZGRsZXdhcmUiLCJhdXRoZW50aWNhdGVNZXRlb3JVc2VyIiwicmVxIiwicmVzIiwibmV4dCIsInJlZiIsInVzZXJJZCIsIlN0ZWVkb3MiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJxdWVyeSIsImFjY2Vzc190b2tlbiIsImdldFVzZXJJZEZyb21BdXRoVG9rZW4iLCJydW4iLCJ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDLEVBQUQsRUFDYiwrQkFEYSxDQUFoQixDOzs7Ozs7Ozs7Ozs7QUNEQSxJQUFBSSxLQUFBO0FBQUFBLFFBQVFDLFFBQVEsUUFBUixDQUFSOztBQUVBQyxXQUFXQyxVQUFYLENBQXNCQyxzQkFBdEIsR0FBK0MsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVg7QUNHN0MsU0RERFAsTUFBTTtBQUNMLFFBQUFRLEdBQUEsRUFBQUMsTUFBQTs7QUFBQSxRQUFHLENBQUNKLElBQUlJLE1BQVI7QUFDQ0EsZUFBU0MsUUFBUUMsd0JBQVIsRUFBQUgsTUFBQUgsSUFBQU8sS0FBQSxZQUFBSixJQUE0Q0ssWUFBNUMsR0FBNEMsTUFBNUMsQ0FBVDs7QUFFQSxVQUFHLENBQUlKLE1BQVA7QUFDQ0EsaUJBQVNDLFFBQVFJLHNCQUFSLENBQStCVCxHQUEvQixFQUFvQ0MsR0FBcEMsQ0FBVDtBQ0VHOztBREFKLFVBQUdHLE1BQUg7QUFDQ0osWUFBSUksTUFBSixHQUFhQSxNQUFiO0FBUEY7QUNVRzs7QUFDRCxXREZGRixNQ0VFO0FEWkgsS0FXRVEsR0FYRixFQ0NDO0FESDZDLENBQS9DLEM7Ozs7Ozs7Ozs7OztBRUZBYixXQUFXQyxVQUFYLENBQXNCYSxHQUF0QixDQUEwQixNQUExQixFQUFrQ2QsV0FBV0MsVUFBWCxDQUFzQkMsc0JBQXhEO0FBRUFGLFdBQVdDLFVBQVgsQ0FBc0JhLEdBQXRCLENBQTBCLDBCQUExQixFQUFzRGQsV0FBV0MsVUFBWCxDQUFzQkMsc0JBQTVFO0FBRUFGLFdBQVdDLFVBQVgsQ0FBc0JhLEdBQXRCLENBQTBCLGNBQTFCLEVBQTBDZCxXQUFXQyxVQUFYLENBQXNCQyxzQkFBaEU7QUFDQUYsV0FBV0MsVUFBWCxDQUFzQmEsR0FBdEIsQ0FBMEIsaUJBQTFCLEVBQTZDZCxXQUFXQyxVQUFYLENBQXNCQyxzQkFBbkUsRSIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19hcGktYXV0aGVudGljYXRlLXVzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG59LCAnc3RlZWRvczphcGktYXV0aGVudGljYXRlLXVzZXInKTsiLCJGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xyXG5cclxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLmF1dGhlbnRpY2F0ZU1ldGVvclVzZXIgPSAocmVxLCByZXMsIG5leHQpLT5cclxuXHJcblx0RmliZXIoKCktPlxyXG5cdFx0aWYgIXJlcS51c2VySWRcclxuXHRcdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4ocmVxLnF1ZXJ5Py5hY2Nlc3NfdG9rZW4pO1xyXG5cclxuXHRcdFx0aWYgbm90IHVzZXJJZFxyXG5cdFx0XHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XHJcblxyXG5cdFx0XHRpZiB1c2VySWRcclxuXHRcdFx0XHRyZXEudXNlcklkID0gdXNlcklkO1xyXG5cclxuXHRcdG5leHQoKTtcclxuXHQpLnJ1bigpIiwidmFyIEZpYmVyO1xuXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5Kc29uUm91dGVzLk1pZGRsZXdhcmUuYXV0aGVudGljYXRlTWV0ZW9yVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmLCB1c2VySWQ7XG4gICAgaWYgKCFyZXEudXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbigocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLmFjY2Vzc190b2tlbiA6IHZvaWQgMCk7XG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICByZXEudXNlcklkID0gdXNlcklkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV4dCgpO1xuICB9KS5ydW4oKTtcbn07XG4iLCJKc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKCcvYXBpJywgSnNvblJvdXRlcy5NaWRkbGV3YXJlLmF1dGhlbnRpY2F0ZU1ldGVvclVzZXIpO1xyXG5cclxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSgnL3N0ZWVkb3MvYXBpL3NwYWNlX3VzZXJzJywgSnNvblJvdXRlcy5NaWRkbGV3YXJlLmF1dGhlbnRpY2F0ZU1ldGVvclVzZXIpO1xyXG5cclxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSgnL3RhYmxlYXUvYXBpJywgSnNvblJvdXRlcy5NaWRkbGV3YXJlLmF1dGhlbnRpY2F0ZU1ldGVvclVzZXIpO1xyXG5Kc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKCcvdGFibGVhdS9zZWFyY2gnLCBKc29uUm91dGVzLk1pZGRsZXdhcmUuYXV0aGVudGljYXRlTWV0ZW9yVXNlcik7XHJcblxyXG4iXX0=
