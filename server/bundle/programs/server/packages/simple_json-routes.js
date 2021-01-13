(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var JsonRoutes, RestMiddleware;

var require = meteorInstall({"node_modules":{"meteor":{"simple:json-routes":{"checkNpm.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/simple_json-routes/checkNpm.js                                                          //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  "connect": "^3.6.6",
  "connect-route": "^0.1.5",
  "qs": "^6.6.0",
  "body-parser": "^1.18.3"
}, 'simple:json-routes');
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"json-routes.js":function module(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/simple_json-routes/json-routes.js                                                       //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
/* global JsonRoutes:true */
var Fiber = require('fibers');

var connect = require('connect');

var connectRoute = require('connect-route');

var qs = require("qs");

var url = require("url");

var bodyParser = require('body-parser');

JsonRoutes = {};

function qsMiddleware(options) {
  return function (request, response, next) {
    if (!request.query) request.query = qs.parse(url.parse(request.url).query, options);
    next();
  };
}

WebApp.connectHandlers.use(qsMiddleware());
WebApp.connectHandlers.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
})); //Override default request size

WebApp.connectHandlers.use(bodyParser.json({
  limit: '50mb'
})); //Override default request size
// Handler for adding middleware before an endpoint (JsonRoutes.middleWare
// is just for legacy reasons). Also serves as a namespace for middleware
// packages to declare their middleware functions.

JsonRoutes.Middleware = JsonRoutes.middleWare = connect();
WebApp.connectHandlers.use(JsonRoutes.Middleware); // List of all defined JSON API endpoints

JsonRoutes.routes = []; // Save reference to router for later

var connectRouter; // Register as a middleware

WebApp.connectHandlers.use(Meteor.bindEnvironment(connectRoute(function (router) {
  connectRouter = router;
}))); // Error middleware must be added last, to catch errors from prior middleware.
// That's why we cache them and then add after startup.

var errorMiddlewares = [];
JsonRoutes.ErrorMiddleware = {
  use: function () {
    errorMiddlewares.push(arguments);
  }
};
Meteor.startup(function () {
  _.each(errorMiddlewares, function (errorMiddleware) {
    errorMiddleware = _.map(errorMiddleware, function (maybeFn) {
      if (_.isFunction(maybeFn)) {
        // A connect error middleware needs exactly 4 arguments because they use fn.length === 4 to
        // decide if something is an error middleware.
        return function (a, b, c, d) {
          Meteor.bindEnvironment(maybeFn)(a, b, c, d);
        };
      }

      return maybeFn;
    });
    WebApp.connectHandlers.use.apply(WebApp.connectHandlers, errorMiddleware);
  });

  errorMiddlewares = [];
});

JsonRoutes.add = function (method, path, handler) {
  // Make sure path starts with a slash
  if (path[0] !== '/') {
    path = '/' + path;
  } // Add to list of known endpoints


  JsonRoutes.routes.push({
    method: method,
    path: path
  });
  connectRouter[method.toLowerCase()](path, function (req, res, next) {
    // Set headers on response
    setHeaders(res, responseHeaders);
    Fiber(function () {
      try {
        handler(req, res, next);
      } catch (error) {
        next(error);
      }
    }).run();
  });
};

var responseHeaders = {
  'Cache-Control': 'no-store',
  Pragma: 'no-cache'
};

JsonRoutes.setResponseHeaders = function (headers) {
  responseHeaders = headers;
};
/**
 * Sets the response headers, status code, and body, and ends it.
 * The JSON response will be pretty printed if NODE_ENV is `development`.
 *
 * @param {Object} res Response object
 * @param {Object} [options]
 * @param {Number} [options.code] HTTP status code. Default is 200.
 * @param {Object} [options.headers] Dictionary of headers.
 * @param {Object|Array|null|undefined} [options.data] The object to
 *   stringify as the response. If `null`, the response will be "null".
 *   If `undefined`, there will be no response body.
 */


JsonRoutes.sendResult = function (res, options) {
  options = options || {}; // We've already set global headers on response, but if they
  // pass in more here, we set those.

  if (options.headers) setHeaders(res, options.headers); // Set status code on response

  res.statusCode = options.code || 200; // Set response body

  writeJsonToBody(res, options.data); // Send the response

  res.end();
};

function setHeaders(res, headers) {
  _.each(headers, function (value, key) {
    res.setHeader(key, value);
  });
}

function writeJsonToBody(res, json) {
  if (json !== undefined) {
    var shouldPrettyPrint = process.env.NODE_ENV === 'development';
    var spacer = shouldPrettyPrint ? 2 : null;
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(json, null, spacer));
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"middleware.js":function module(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/simple_json-routes/middleware.js                                                        //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
/* global RestMiddleware:true */
RestMiddleware = {};
//////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/simple:json-routes/checkNpm.js");
require("/node_modules/meteor/simple:json-routes/json-routes.js");
require("/node_modules/meteor/simple:json-routes/middleware.js");

/* Exports */
Package._define("simple:json-routes", {
  JsonRoutes: JsonRoutes,
  RestMiddleware: RestMiddleware
});

})();

//# sourceURL=meteor://💻app/packages/simple_json-routes.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc2ltcGxlOmpzb24tcm91dGVzL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zaW1wbGU6anNvbi1yb3V0ZXMvanNvbi1yb3V0ZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3NpbXBsZTpqc29uLXJvdXRlcy9taWRkbGV3YXJlLmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIkZpYmVyIiwicmVxdWlyZSIsImNvbm5lY3QiLCJjb25uZWN0Um91dGUiLCJxcyIsInVybCIsImJvZHlQYXJzZXIiLCJKc29uUm91dGVzIiwicXNNaWRkbGV3YXJlIiwib3B0aW9ucyIsInJlcXVlc3QiLCJyZXNwb25zZSIsIm5leHQiLCJxdWVyeSIsInBhcnNlIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwidXJsZW5jb2RlZCIsImxpbWl0IiwiZXh0ZW5kZWQiLCJqc29uIiwiTWlkZGxld2FyZSIsIm1pZGRsZVdhcmUiLCJyb3V0ZXMiLCJjb25uZWN0Um91dGVyIiwiTWV0ZW9yIiwiYmluZEVudmlyb25tZW50Iiwicm91dGVyIiwiZXJyb3JNaWRkbGV3YXJlcyIsIkVycm9yTWlkZGxld2FyZSIsInB1c2giLCJhcmd1bWVudHMiLCJzdGFydHVwIiwiXyIsImVhY2giLCJlcnJvck1pZGRsZXdhcmUiLCJtYXAiLCJtYXliZUZuIiwiaXNGdW5jdGlvbiIsImEiLCJiIiwiYyIsImQiLCJhcHBseSIsImFkZCIsIm1ldGhvZCIsInBhdGgiLCJoYW5kbGVyIiwidG9Mb3dlckNhc2UiLCJyZXEiLCJyZXMiLCJzZXRIZWFkZXJzIiwicmVzcG9uc2VIZWFkZXJzIiwiZXJyb3IiLCJydW4iLCJQcmFnbWEiLCJzZXRSZXNwb25zZUhlYWRlcnMiLCJoZWFkZXJzIiwic2VuZFJlc3VsdCIsInN0YXR1c0NvZGUiLCJjb2RlIiwid3JpdGVKc29uVG9Cb2R5IiwiZGF0YSIsImVuZCIsInZhbHVlIiwia2V5Iiwic2V0SGVhZGVyIiwidW5kZWZpbmVkIiwic2hvdWxkUHJldHR5UHJpbnQiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJzcGFjZXIiLCJ3cml0ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJSZXN0TWlkZGxld2FyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLGFBQVcsUUFESztBQUVoQixtQkFBaUIsUUFGRDtBQUdoQixRQUFNLFFBSFU7QUFJaEIsaUJBQWU7QUFKQyxDQUFELEVBS2Isb0JBTGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNEQTtBQUVBLElBQUlJLEtBQUssR0FBR0MsT0FBTyxDQUFDLFFBQUQsQ0FBbkI7O0FBQ0EsSUFBSUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUFyQjs7QUFDQSxJQUFJRSxZQUFZLEdBQUdGLE9BQU8sQ0FBQyxlQUFELENBQTFCOztBQUVBLElBQUlHLEVBQUUsR0FBR0gsT0FBTyxDQUFDLElBQUQsQ0FBaEI7O0FBQ0EsSUFBSUksR0FBRyxHQUFHSixPQUFPLENBQUMsS0FBRCxDQUFqQjs7QUFDQSxJQUFJSyxVQUFVLEdBQUdMLE9BQU8sQ0FBQyxhQUFELENBQXhCOztBQUVBTSxVQUFVLEdBQUcsRUFBYjs7QUFFQSxTQUFTQyxZQUFULENBQXNCQyxPQUF0QixFQUErQjtBQUM3QixTQUFPLFVBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCQyxJQUE3QixFQUFtQztBQUN4QyxRQUFJLENBQUNGLE9BQU8sQ0FBQ0csS0FBYixFQUNFSCxPQUFPLENBQUNHLEtBQVIsR0FBZ0JULEVB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Q0MsSUFBRixDQUFPdUIsT0FBUCxFQUFnQixVQUFVTyxLQUFWLEVBQWlCQyxHQUFqQixFQUFzQjtBQUNwQ2YsT0FBRyxDQUFDZ0IsU0FBSixDQUFjRCxHQUFkLEVBQW1CRCxLQUFuQjtBQUNELEdBRkQ7QUFHRDs7QUFFRCxTQUFTSCxlQUFULENBQXlCWCxHQUF6QixFQUE4QjlCLElBQTlCLEVBQW9DO0FBQ2xDLE1BQUlBLElBQUksS0FBSytDLFNBQWIsRUFBd0I7QUFDdEIsUUFBSUMsaUJBQWlCLEdBQUlDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUFaLEtBQXlCLGFBQWxEO0FBQ0EsUUFBSUMsTUFBTSxHQUFHSixpQkFBaUIsR0FBRyxDQUFILEdBQU8sSUFBckM7QUFDQWxCLE9BQUcsQ0FBQ2dCLFNBQUosQ0FBYyxjQUFkLEVBQThCLGtCQUE5QjtBQUNBaEIsT0FBRyxDQUFDdUIsS0FBSixDQUFVQyxJQUFJLENBQUNDLFNBQUwsQ0FBZXZELElBQWYsRUFBcUIsSUFBckIsRUFBMkJvRCxNQUEzQixDQUFWO0FBQ0Q7QUFDRixDOzs7Ozs7Ozs7OztBQ2xKRDtBQUVBSSxjQUFjLEdBQUcsRUFBakIsQyIsImZpbGUiOiIvcGFja2FnZXMvc2ltcGxlX2pzb24tcm91dGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRcImNvbm5lY3RcIjogXCJeMy42LjZcIixcclxuXHRcImNvbm5lY3Qtcm91dGVcIjogXCJeMC4xLjVcIixcclxuXHRcInFzXCI6IFwiXjYuNi4wXCIsXHJcblx0XCJib2R5LXBhcnNlclwiOiBcIl4xLjE4LjNcIlxyXG59LCAnc2ltcGxlOmpzb24tcm91dGVzJyk7XHJcbiIsIi8qIGdsb2JhbCBKc29uUm91dGVzOnRydWUgKi9cclxuXHJcbnZhciBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xyXG52YXIgY29ubmVjdCA9IHJlcXVpcmUoJ2Nvbm5lY3QnKTtcclxudmFyIGNvbm5lY3RSb3V0ZSA9IHJlcXVpcmUoJ2Nvbm5lY3Qtcm91dGUnKTtcclxuXHJcbnZhciBxcyA9IHJlcXVpcmUoXCJxc1wiKTtcclxudmFyIHVybCA9IHJlcXVpcmUoXCJ1cmxcIik7XHJcbnZhciBib2R5UGFyc2VyID0gcmVxdWlyZSgnYm9keS1wYXJzZXInKTtcclxuXHJcbkpzb25Sb3V0ZXMgPSB7fTtcclxuXHJcbmZ1bmN0aW9uIHFzTWlkZGxld2FyZShvcHRpb25zKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChyZXF1ZXN0LCByZXNwb25zZSwgbmV4dCkge1xyXG4gICAgaWYgKCFyZXF1ZXN0LnF1ZXJ5KVxyXG4gICAgICByZXF1ZXN0LnF1ZXJ5ID0gcXMucGFyc2UodXJsLnBhcnNlKHJlcXVlc3QudXJsKS5xdWVyeSwgb3B0aW9ucyk7XHJcbiAgICBuZXh0KCk7XHJcbiAgfTtcclxufVxyXG5cclxuV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UocXNNaWRkbGV3YXJlKCkpO1xyXG5XZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBsaW1pdDogJzUwbWInLCBleHRlbmRlZDogdHJ1ZSB9KSk7IC8vT3ZlcnJpZGUgZGVmYXVsdCByZXF1ZXN0IHNpemVcclxuV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoYm9keVBhcnNlci5qc29uKHsgbGltaXQ6ICc1MG1iJyB9KSk7IC8vT3ZlcnJpZGUgZGVmYXVsdCByZXF1ZXN0IHNpemVcclxuXHJcbi8vIEhhbmRsZXIgZm9yIGFkZGluZyBtaWRkbGV3YXJlIGJlZm9yZSBhbiBlbmRwb2ludCAoSnNvblJvdXRlcy5taWRkbGVXYXJlXHJcbi8vIGlzIGp1c3QgZm9yIGxlZ2FjeSByZWFzb25zKS4gQWxzbyBzZXJ2ZXMgYXMgYSBuYW1lc3BhY2UgZm9yIG1pZGRsZXdhcmVcclxuLy8gcGFja2FnZXMgdG8gZGVjbGFyZSB0aGVpciBtaWRkbGV3YXJlIGZ1bmN0aW9ucy5cclxuSnNvblJvdXRlcy5NaWRkbGV3YXJlID0gSnNvblJvdXRlcy5taWRkbGVXYXJlID0gY29ubmVjdCgpO1xyXG5XZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShKc29uUm91dGVzLk1pZGRsZXdhcmUpO1xyXG5cclxuLy8gTGlzdCBvZiBhbGwgZGVmaW5lZCBKU09OIEFQSSBlbmRwb2ludHNcclxuSnNvblJvdXRlcy5yb3V0ZXMgPSBbXTtcclxuXHJcbi8vIFNhdmUgcmVmZXJlbmNlIHRvIHJvdXRlciBmb3IgbGF0ZXJcclxudmFyIGNvbm5lY3RSb3V0ZXI7XHJcblxyXG4vLyBSZWdpc3RlciBhcyBhIG1pZGRsZXdhcmVcclxuV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChjb25uZWN0Um91dGUoZnVuY3Rpb24gKHJvdXRlcikge1xyXG4gIGNvbm5lY3RSb3V0ZXIgPSByb3V0ZXI7XHJcbn0pKSk7XHJcblxyXG4vLyBFcnJvciBtaWRkbGV3YXJlIG11c3QgYmUgYWRkZWQgbGFzdCwgdG8gY2F0Y2ggZXJyb3JzIGZyb20gcHJpb3IgbWlkZGxld2FyZS5cclxuLy8gVGhhdCdzIHdoeSB3ZSBjYWNoZSB0aGVtIGFuZCB0aGVuIGFkZCBhZnRlciBzdGFydHVwLlxyXG52YXIgZXJyb3JNaWRkbGV3YXJlcyA9IFtdO1xyXG5Kc29uUm91dGVzLkVycm9yTWlkZGxld2FyZSA9IHtcclxuICB1c2U6IGZ1bmN0aW9uICgpIHtcclxuICAgIGVycm9yTWlkZGxld2FyZXMucHVzaChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbn07XHJcblxyXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XHJcbiAgXy5lYWNoKGVycm9yTWlkZGxld2FyZXMsIGZ1bmN0aW9uIChlcnJvck1pZGRsZXdhcmUpIHtcclxuICAgIGVycm9yTWlkZGxld2FyZSA9IF8ubWFwKGVycm9yTWlkZGxld2FyZSwgZnVuY3Rpb24gKG1heWJlRm4pIHtcclxuICAgICAgaWYgKF8uaXNGdW5jdGlvbihtYXliZUZuKSkge1xyXG4gICAgICAgIC8vIEEgY29ubmVjdCBlcnJvciBtaWRkbGV3YXJlIG5lZWRzIGV4YWN0bHkgNCBhcmd1bWVudHMgYmVjYXVzZSB0aGV5IHVzZSBmbi5sZW5ndGggPT09IDQgdG9cclxuICAgICAgICAvLyBkZWNpZGUgaWYgc29tZXRoaW5nIGlzIGFuIGVycm9yIG1pZGRsZXdhcmUuXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7XHJcbiAgICAgICAgICBNZXRlb3IuYmluZEVudmlyb25tZW50KG1heWJlRm4pKGEsIGIsIGMsIGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG1heWJlRm47XHJcbiAgICB9KTtcclxuXHJcbiAgICBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZS5hcHBseShXZWJBcHAuY29ubmVjdEhhbmRsZXJzLCBlcnJvck1pZGRsZXdhcmUpO1xyXG4gIH0pO1xyXG5cclxuICBlcnJvck1pZGRsZXdhcmVzID0gW107XHJcbn0pO1xyXG5cclxuSnNvblJvdXRlcy5hZGQgPSBmdW5jdGlvbiAobWV0aG9kLCBwYXRoLCBoYW5kbGVyKSB7XHJcbiAgLy8gTWFrZSBzdXJlIHBhdGggc3RhcnRzIHdpdGggYSBzbGFzaFxyXG4gIGlmIChwYXRoWzBdICE9PSAnLycpIHtcclxuICAgIHBhdGggPSAnLycgKyBwYXRoO1xyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHRvIGxpc3Qgb2Yga25vd24gZW5kcG9pbnRzXHJcbiAgSnNvblJvdXRlcy5yb3V0ZXMucHVzaCh7XHJcbiAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgIHBhdGg6IHBhdGgsXHJcbiAgfSk7XHJcblxyXG4gIGNvbm5lY3RSb3V0ZXJbbWV0aG9kLnRvTG93ZXJDYXNlKCldKHBhdGgsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xyXG4gICAgLy8gU2V0IGhlYWRlcnMgb24gcmVzcG9uc2VcclxuICAgIHNldEhlYWRlcnMocmVzLCByZXNwb25zZUhlYWRlcnMpO1xyXG4gICAgRmliZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGhhbmRsZXIocmVxLCByZXMsIG5leHQpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KS5ydW4oKTtcclxuICB9KTtcclxufTtcclxuXHJcbnZhciByZXNwb25zZUhlYWRlcnMgPSB7XHJcbiAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tc3RvcmUnLFxyXG4gIFByYWdtYTogJ25vLWNhY2hlJyxcclxufTtcclxuXHJcbkpzb25Sb3V0ZXMuc2V0UmVzcG9uc2VIZWFkZXJzID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcclxuICByZXNwb25zZUhlYWRlcnMgPSBoZWFkZXJzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldHMgdGhlIHJlc3BvbnNlIGhlYWRlcnMsIHN0YXR1cyBjb2RlLCBhbmQgYm9keSwgYW5kIGVuZHMgaXQuXHJcbiAqIFRoZSBKU09OIHJlc3BvbnNlIHdpbGwgYmUgcHJldHR5IHByaW50ZWQgaWYgTk9ERV9FTlYgaXMgYGRldmVsb3BtZW50YC5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IHJlcyBSZXNwb25zZSBvYmplY3RcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY29kZV0gSFRUUCBzdGF0dXMgY29kZS4gRGVmYXVsdCBpcyAyMDAuXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5oZWFkZXJzXSBEaWN0aW9uYXJ5IG9mIGhlYWRlcnMuXHJcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fG51bGx8dW5kZWZpbmVkfSBbb3B0aW9ucy5kYXRhXSBUaGUgb2JqZWN0IHRvXHJcbiAqICAgc3RyaW5naWZ5IGFzIHRoZSByZXNwb25zZS4gSWYgYG51bGxgLCB0aGUgcmVzcG9uc2Ugd2lsbCBiZSBcIm51bGxcIi5cclxuICogICBJZiBgdW5kZWZpbmVkYCwgdGhlcmUgd2lsbCBiZSBubyByZXNwb25zZSBib2R5LlxyXG4gKi9cclxuSnNvblJvdXRlcy5zZW5kUmVzdWx0ID0gZnVuY3Rpb24gKHJlcywgb3B0aW9ucykge1xyXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAvLyBXZSd2ZSBhbHJlYWR5IHNldCBnbG9iYWwgaGVhZGVycyBvbiByZXNwb25zZSwgYnV0IGlmIHRoZXlcclxuICAvLyBwYXNzIGluIG1vcmUgaGVyZSwgd2Ugc2V0IHRob3NlLlxyXG4gIGlmIChvcHRpb25zLmhlYWRlcnMpIHNldEhlYWRlcnMocmVzLCBvcHRpb25zLmhlYWRlcnMpO1xyXG5cclxuICAvLyBTZXQgc3RhdHVzIGNvZGUgb24gcmVzcG9uc2VcclxuICByZXMuc3RhdHVzQ29kZSA9IG9wdGlvbnMuY29kZSB8fCAyMDA7XHJcblxyXG4gIC8vIFNldCByZXNwb25zZSBib2R5XHJcbiAgd3JpdGVKc29uVG9Cb2R5KHJlcywgb3B0aW9ucy5kYXRhKTtcclxuXHJcbiAgLy8gU2VuZCB0aGUgcmVzcG9uc2VcclxuICByZXMuZW5kKCk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBzZXRIZWFkZXJzKHJlcywgaGVhZGVycykge1xyXG4gIF8uZWFjaChoZWFkZXJzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xyXG4gICAgcmVzLnNldEhlYWRlcihrZXksIHZhbHVlKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVKc29uVG9Cb2R5KHJlcywganNvbikge1xyXG4gIGlmIChqc29uICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHZhciBzaG91bGRQcmV0dHlQcmludCA9IChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jyk7XHJcbiAgICB2YXIgc3BhY2VyID0gc2hvdWxkUHJldHR5UHJpbnQgPyAyIDogbnVsbDtcclxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICByZXMud3JpdGUoSlNPTi5zdHJpbmdpZnkoanNvbiwgbnVsbCwgc3BhY2VyKSk7XHJcbiAgfVxyXG59XHJcbiIsIi8qIGdsb2JhbCBSZXN0TWlkZGxld2FyZTp0cnVlICovXHJcblxyXG5SZXN0TWlkZGxld2FyZSA9IHt9O1xyXG4iXX0=
