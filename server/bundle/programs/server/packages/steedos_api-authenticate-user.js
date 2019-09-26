(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Accounts = Package['accounts-base'].Accounts;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:api-authenticate-user":{"checkNpm.js":function(require,exports,module){

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

},"auth_user.coffee":function(require){

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

},"routes_middleware_config.coffee":function(){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGktYXV0aGVudGljYXRlLXVzZXIvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLWF1dGhlbnRpY2F0ZS11c2VyL2F1dGhfdXNlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2F1dGhfdXNlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLWF1dGhlbnRpY2F0ZS11c2VyL3JvdXRlc19taWRkbGV3YXJlX2NvbmZpZy5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiRmliZXIiLCJyZXF1aXJlIiwiSnNvblJvdXRlcyIsIk1pZGRsZXdhcmUiLCJhdXRoZW50aWNhdGVNZXRlb3JVc2VyIiwicmVxIiwicmVzIiwibmV4dCIsInJlZiIsInVzZXJJZCIsIlN0ZWVkb3MiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJxdWVyeSIsImFjY2Vzc190b2tlbiIsImdldFVzZXJJZEZyb21BdXRoVG9rZW4iLCJydW4iLCJ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBQ3JCSCxnQkFBZ0IsQ0FBQyxFQUFELEVBQ2IsK0JBRGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7O0FDREEsSUFBQUksS0FBQTtBQUFBQSxRQUFRQyxRQUFRLFFBQVIsQ0FBUjs7QUFFQUMsV0FBV0MsVUFBWCxDQUFzQkMsc0JBQXRCLEdBQStDLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYO0FDRzdDLFNERERQLE1BQU07QUFDTCxRQUFBUSxHQUFBLEVBQUFDLE1BQUE7O0FBQUEsUUFBRyxDQUFDSixJQUFJSSxNQUFSO0FBQ0NBLGVBQVNDLFFBQVFDLHdCQUFSLEVBQUFILE1BQUFILElBQUFPLEtBQUEsWUFBQUosSUFBNENLLFlBQTVDLEdBQTRDLE1BQTVDLENBQVQ7O0FBRUEsVUFBRyxDQUFJSixNQUFQO0FBQ0NBLGlCQUFTQyxRQUFRSSxzQkFBUixDQUErQlQsR0FBL0IsRUFBb0NDLEdBQXBDLENBQVQ7QUNFRzs7QURBSixVQUFHRyxNQUFIO0FBQ0NKLFlBQUlJLE1BQUosR0FBYUEsTUFBYjtBQVBGO0FDVUc7O0FBQ0QsV0RGRkYsTUNFRTtBRFpILEtBV0VRLEdBWEYsRUNDQztBREg2QyxDQUEvQyxDOzs7Ozs7Ozs7Ozs7QUVGQWIsV0FBV0MsVUFBWCxDQUFzQmEsR0FBdEIsQ0FBMEIsTUFBMUIsRUFBa0NkLFdBQVdDLFVBQVgsQ0FBc0JDLHNCQUF4RDtBQUVBRixXQUFXQyxVQUFYLENBQXNCYSxHQUF0QixDQUEwQiwwQkFBMUIsRUFBc0RkLFdBQVdDLFVBQVgsQ0FBc0JDLHNCQUE1RTtBQUVBRixXQUFXQyxVQUFYLENBQXNCYSxHQUF0QixDQUEwQixjQUExQixFQUEwQ2QsV0FBV0MsVUFBWCxDQUFzQkMsc0JBQWhFO0FBQ0FGLFdBQVdDLFVBQVgsQ0FBc0JhLEdBQXRCLENBQTBCLGlCQUExQixFQUE2Q2QsV0FBV0MsVUFBWCxDQUFzQkMsc0JBQW5FLEUiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLWF1dGhlbnRpY2F0ZS11c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG59LCAnc3RlZWRvczphcGktYXV0aGVudGljYXRlLXVzZXInKTsiLCJGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5Kc29uUm91dGVzLk1pZGRsZXdhcmUuYXV0aGVudGljYXRlTWV0ZW9yVXNlciA9IChyZXEsIHJlcywgbmV4dCktPlxuXG5cdEZpYmVyKCgpLT5cblx0XHRpZiAhcmVxLnVzZXJJZFxuXHRcdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4ocmVxLnF1ZXJ5Py5hY2Nlc3NfdG9rZW4pO1xuXG5cdFx0XHRpZiBub3QgdXNlcklkXG5cdFx0XHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbihyZXEsIHJlcyk7XG5cblx0XHRcdGlmIHVzZXJJZFxuXHRcdFx0XHRyZXEudXNlcklkID0gdXNlcklkO1xuXG5cdFx0bmV4dCgpO1xuXHQpLnJ1bigpIiwidmFyIEZpYmVyO1xuXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5Kc29uUm91dGVzLk1pZGRsZXdhcmUuYXV0aGVudGljYXRlTWV0ZW9yVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmLCB1c2VySWQ7XG4gICAgaWYgKCFyZXEudXNlcklkKSB7XG4gICAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbigocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLmFjY2Vzc190b2tlbiA6IHZvaWQgMCk7XG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICByZXEudXNlcklkID0gdXNlcklkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV4dCgpO1xuICB9KS5ydW4oKTtcbn07XG4iLCJKc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKCcvYXBpJywgSnNvblJvdXRlcy5NaWRkbGV3YXJlLmF1dGhlbnRpY2F0ZU1ldGVvclVzZXIpO1xuXG5Kc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKCcvc3RlZWRvcy9hcGkvc3BhY2VfdXNlcnMnLCBKc29uUm91dGVzLk1pZGRsZXdhcmUuYXV0aGVudGljYXRlTWV0ZW9yVXNlcik7XG5cbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoJy90YWJsZWF1L2FwaScsIEpzb25Sb3V0ZXMuTWlkZGxld2FyZS5hdXRoZW50aWNhdGVNZXRlb3JVc2VyKTtcbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoJy90YWJsZWF1L3NlYXJjaCcsIEpzb25Sb3V0ZXMuTWlkZGxld2FyZS5hdXRoZW50aWNhdGVNZXRlb3JVc2VyKTtcblxuIl19
