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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGktYXV0aGVudGljYXRlLXVzZXIvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLWF1dGhlbnRpY2F0ZS11c2VyL2F1dGhfdXNlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2F1dGhfdXNlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLWF1dGhlbnRpY2F0ZS11c2VyL3JvdXRlc19taWRkbGV3YXJlX2NvbmZpZy5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiRmliZXIiLCJyZXF1aXJlIiwiSnNvblJvdXRlcyIsIk1pZGRsZXdhcmUiLCJhdXRoZW50aWNhdGVNZXRlb3JVc2VyIiwicmVxIiwicmVzIiwibmV4dCIsInJlZiIsInVzZXJJZCIsIlN0ZWVkb3MiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJxdWVyeSIsImFjY2Vzc190b2tlbiIsImdldFVzZXJJZEZyb21BdXRoVG9rZW4iLCJydW4iLCJ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBQ3JCSCxnQkFBZ0IsQ0FBQyxFQUFELEVBQ2IsK0JBRGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7O0FDREEsSUFBQUksS0FBQTtBQUFBQSxRQUFRQyxRQUFRLFFBQVIsQ0FBUjs7QUFFQUMsV0FBV0MsVUFBWCxDQUFzQkMsc0JBQXRCLEdBQStDLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYO0FDRzdDLFNERERQLE1BQU07QUFDTCxRQUFBUSxHQUFBLEVBQUFDLE1BQUE7O0FBQUEsUUFBRyxDQUFDSixJQUFJSSxNQUFSO0FBQ0NBLGVBQVNDLFFBQVFDLHdCQUFSLEVBQUFILE1BQUFILElBQUFPLEtBQUEsWUFBQUosSUFBNENLLFlBQTVDLEdBQTRDLE1BQTVDLENBQVQ7O0FBRUEsVUFBRyxDQUFJSixNQUFQO0FBQ0NBLGlCQUFTQyxRQUFRSSxzQkFBUixDQUErQlQsR0FBL0IsRUFBb0NDLEdBQXBDLENBQVQ7QUNFRzs7QURBSixVQUFHRyxNQUFIO0FBQ0NKLFlBQUlJLE1BQUosR0FBYUEsTUFBYjtBQVBGO0FDVUc7O0FBQ0QsV0RGRkYsTUNFRTtBRFpILEtBV0VRLEdBWEYsRUNDQztBREg2QyxDQUEvQyxDOzs7Ozs7Ozs7Ozs7QUVGQWIsV0FBV0MsVUFBWCxDQUFzQmEsR0FBdEIsQ0FBMEIsTUFBMUIsRUFBa0NkLFdBQVdDLFVBQVgsQ0FBc0JDLHNCQUF4RDtBQUVBRixXQUFXQyxVQUFYLENBQXNCYSxHQUF0QixDQUEwQiwwQkFBMUIsRUFBc0RkLFdBQVdDLFVBQVgsQ0FBc0JDLHNCQUE1RTtBQUVBRixXQUFXQyxVQUFYLENBQXNCYSxHQUF0QixDQUEwQixjQUExQixFQUEwQ2QsV0FBV0MsVUFBWCxDQUFzQkMsc0JBQWhFO0FBQ0FGLFdBQVdDLFVBQVgsQ0FBc0JhLEdBQXRCLENBQTBCLGlCQUExQixFQUE2Q2QsV0FBV0MsVUFBWCxDQUFzQkMsc0JBQW5FLEUiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLWF1dGhlbnRpY2F0ZS11c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxufSwgJ3N0ZWVkb3M6YXBpLWF1dGhlbnRpY2F0ZS11c2VyJyk7IiwiRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcclxuXHJcbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS5hdXRoZW50aWNhdGVNZXRlb3JVc2VyID0gKHJlcSwgcmVzLCBuZXh0KS0+XHJcblxyXG5cdEZpYmVyKCgpLT5cclxuXHRcdGlmICFyZXEudXNlcklkXHJcblx0XHRcdHVzZXJJZCA9IFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKHJlcS5xdWVyeT8uYWNjZXNzX3Rva2VuKTtcclxuXHJcblx0XHRcdGlmIG5vdCB1c2VySWRcclxuXHRcdFx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xyXG5cclxuXHRcdFx0aWYgdXNlcklkXHJcblx0XHRcdFx0cmVxLnVzZXJJZCA9IHVzZXJJZDtcclxuXHJcblx0XHRuZXh0KCk7XHJcblx0KS5ydW4oKSIsInZhciBGaWJlcjtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLmF1dGhlbnRpY2F0ZU1ldGVvclVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZiwgdXNlcklkO1xuICAgIGlmICghcmVxLnVzZXJJZCkge1xuICAgICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDApO1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgcmVxLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfSkucnVuKCk7XG59O1xuIiwiSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSgnL2FwaScsIEpzb25Sb3V0ZXMuTWlkZGxld2FyZS5hdXRoZW50aWNhdGVNZXRlb3JVc2VyKTtcclxuXHJcbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoJy9zdGVlZG9zL2FwaS9zcGFjZV91c2VycycsIEpzb25Sb3V0ZXMuTWlkZGxld2FyZS5hdXRoZW50aWNhdGVNZXRlb3JVc2VyKTtcclxuXHJcbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoJy90YWJsZWF1L2FwaScsIEpzb25Sb3V0ZXMuTWlkZGxld2FyZS5hdXRoZW50aWNhdGVNZXRlb3JVc2VyKTtcclxuSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZSgnL3RhYmxlYXUvc2VhcmNoJywgSnNvblJvdXRlcy5NaWRkbGV3YXJlLmF1dGhlbnRpY2F0ZU1ldGVvclVzZXIpO1xyXG5cclxuIl19
