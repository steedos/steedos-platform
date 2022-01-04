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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc2ltcGxlOmpzb24tcm91dGVzL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zaW1wbGU6anNvbi1yb3V0ZXMvanNvbi1yb3V0ZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3NpbXBsZTpqc29uLXJvdXRlcy9taWRkbGV3YXJlLmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIkZpYmVyIiwicmVxdWlyZSIsImNvbm5lY3QiLCJjb25uZWN0Um91dGUiLCJxcyIsInVybCIsImJvZHlQYXJzZXIiLCJKc29uUm91dGVzIiwicXNNaWRkbGV3YXJlIiwib3B0aW9ucyIsInJlcXVlc3QiLCJyZXNwb25zZSIsIm5leHQiLCJxdWVyeSIsInBhcnNlIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwidXJsZW5jb2RlZCIsImxpbWl0IiwiZXh0ZW5kZWQiLCJqc29uIiwiTWlkZGxld2FyZSIsIm1pZGRsZVdhcmUiLCJyb3V0ZXMiLCJjb25uZWN0Um91dGVyIiwiTWV0ZW9yIiwiYmluZEVudmlyb25tZW50Iiwicm91dGVyIiwiZXJyb3JNaWRkbGV3YXJlcyIsIkVycm9yTWlkZGxld2FyZSIsInB1c2giLCJhcmd1bWVudHMiLCJzdGFydHVwIiwiXyIsImVhY2giLCJlcnJvck1pZGRsZXdhcmUiLCJtYXAiLCJtYXliZUZuIiwiaXNGdW5jdGlvbiIsImEiLCJiIiwiYyIsImQiLCJhcHBseSIsImFkZCIsIm1ldGhvZCIsInBhdGgiLCJoYW5kbGVyIiwidG9Mb3dlckNhc2UiLCJyZXEiLCJyZXMiLCJzZXRIZWFkZXJzIiwicmVzcG9uc2VIZWFkZXJzIiwiZXJyb3IiLCJydW4iLCJQcmFnbWEiLCJzZXRSZXNwb25zZUhlYWRlcnMiLCJoZWFkZXJzIiwic2VuZFJlc3VsdCIsInN0YXR1c0NvZGUiLCJjb2RlIiwid3JpdGVKc29uVG9Cb2R5IiwiZGF0YSIsImVuZCIsInZhbHVlIiwia2V5Iiwic2V0SGVhZGVyIiwidW5kZWZpbmVkIiwic2hvdWxkUHJldHR5UHJpbnQiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJzcGFjZXIiLCJ3cml0ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJSZXN0TWlkZGxld2FyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLGFBQVcsUUFESztBQUVoQixtQkFBaUIsUUFGRDtBQUdoQixRQUFNLFFBSFU7QUFJaEIsaUJBQWU7QUFKQyxDQUFELEVBS2Isb0JBTGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNEQTtBQUVBLElBQUlJLEtBQUssR0FBR0MsT0FBTyxDQUFDLFFBQUQsQ0FBbkI7O0FBQ0EsSUFBSUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUFyQjs7QUFDQSxJQUFJRSxZQUFZLEdBQUdGLE9BQU8sQ0FBQyxlQUFELENBQTFCOztBQUVBLElBQUlHLEVBQUUsR0FBR0gsT0FBTyxDQUFDLElBQUQsQ0FBaEI7O0FBQ0EsSUFBSUksR0FBRyxHQUFHSixPQUFPLENBQUMsS0FBRCxDQUFqQjs7QUFDQSxJQUFJSyxVQUFVLEdBQUdMLE9BQU8sQ0FBQyxhQUFELENBQXhCOztBQUVBTSxVQUFVLEdBQUcsRUFBYjs7QUFFQSxTQUFTQyxZQUFULENBQXNCQyxPQUF0QixFQUErQjtBQUM3QixTQUFPLFVBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCQyxJQUE3QixFQUFtQztBQUN4QyxRQUFJLENBQUNGLE9BQU8sQ0FBQ0csS0FBYixFQUNFSCxPQUFPLENBQUNHLEtBQVIsR0FBZ0JULEVB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Q0MsSUFBRixDQUFPdUIsT0FBUCxFQUFnQixVQUFVTyxLQUFWLEVBQWlCQyxHQUFqQixFQUFzQjtBQUNwQ2YsT0FBRyxDQUFDZ0IsU0FBSixDQUFjRCxHQUFkLEVBQW1CRCxLQUFuQjtBQUNELEdBRkQ7QUFHRDs7QUFFRCxTQUFTSCxlQUFULENBQXlCWCxHQUF6QixFQUE4QjlCLElBQTlCLEVBQW9DO0FBQ2xDLE1BQUlBLElBQUksS0FBSytDLFNBQWIsRUFBd0I7QUFDdEIsUUFBSUMsaUJBQWlCLEdBQUlDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUFaLEtBQXlCLGFBQWxEO0FBQ0EsUUFBSUMsTUFBTSxHQUFHSixpQkFBaUIsR0FBRyxDQUFILEdBQU8sSUFBckM7QUFDQWxCLE9BQUcsQ0FBQ2dCLFNBQUosQ0FBYyxjQUFkLEVBQThCLGtCQUE5QjtBQUNBaEIsT0FBRyxDQUFDdUIsS0FBSixDQUFVQyxJQUFJLENBQUNDLFNBQUwsQ0FBZXZELElBQWYsRUFBcUIsSUFBckIsRUFBMkJvRCxNQUEzQixDQUFWO0FBQ0Q7QUFDRixDOzs7Ozs7Ozs7OztBQ2xKRDtBQUVBSSxjQUFjLEdBQUcsRUFBakIsQyIsImZpbGUiOiIvcGFja2FnZXMvc2ltcGxlX2pzb24tcm91dGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdFwiY29ubmVjdFwiOiBcIl4zLjYuNlwiLFxuXHRcImNvbm5lY3Qtcm91dGVcIjogXCJeMC4xLjVcIixcblx0XCJxc1wiOiBcIl42LjYuMFwiLFxuXHRcImJvZHktcGFyc2VyXCI6IFwiXjEuMTguM1wiXG59LCAnc2ltcGxlOmpzb24tcm91dGVzJyk7XG4iLCIvKiBnbG9iYWwgSnNvblJvdXRlczp0cnVlICovXG5cbnZhciBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xudmFyIGNvbm5lY3QgPSByZXF1aXJlKCdjb25uZWN0Jyk7XG52YXIgY29ubmVjdFJvdXRlID0gcmVxdWlyZSgnY29ubmVjdC1yb3V0ZScpO1xuXG52YXIgcXMgPSByZXF1aXJlKFwicXNcIik7XG52YXIgdXJsID0gcmVxdWlyZShcInVybFwiKTtcbnZhciBib2R5UGFyc2VyID0gcmVxdWlyZSgnYm9keS1wYXJzZXInKTtcblxuSnNvblJvdXRlcyA9IHt9O1xuXG5mdW5jdGlvbiBxc01pZGRsZXdhcmUob3B0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24gKHJlcXVlc3QsIHJlc3BvbnNlLCBuZXh0KSB7XG4gICAgaWYgKCFyZXF1ZXN0LnF1ZXJ5KVxuICAgICAgcmVxdWVzdC5xdWVyeSA9IHFzLnBhcnNlKHVybC5wYXJzZShyZXF1ZXN0LnVybCkucXVlcnksIG9wdGlvbnMpO1xuICAgIG5leHQoKTtcbiAgfTtcbn1cblxuV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UocXNNaWRkbGV3YXJlKCkpO1xuV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgbGltaXQ6ICc1MG1iJywgZXh0ZW5kZWQ6IHRydWUgfSkpOyAvL092ZXJyaWRlIGRlZmF1bHQgcmVxdWVzdCBzaXplXG5XZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShib2R5UGFyc2VyLmpzb24oeyBsaW1pdDogJzUwbWInIH0pKTsgLy9PdmVycmlkZSBkZWZhdWx0IHJlcXVlc3Qgc2l6ZVxuXG4vLyBIYW5kbGVyIGZvciBhZGRpbmcgbWlkZGxld2FyZSBiZWZvcmUgYW4gZW5kcG9pbnQgKEpzb25Sb3V0ZXMubWlkZGxlV2FyZVxuLy8gaXMganVzdCBmb3IgbGVnYWN5IHJlYXNvbnMpLiBBbHNvIHNlcnZlcyBhcyBhIG5hbWVzcGFjZSBmb3IgbWlkZGxld2FyZVxuLy8gcGFja2FnZXMgdG8gZGVjbGFyZSB0aGVpciBtaWRkbGV3YXJlIGZ1bmN0aW9ucy5cbkpzb25Sb3V0ZXMuTWlkZGxld2FyZSA9IEpzb25Sb3V0ZXMubWlkZGxlV2FyZSA9IGNvbm5lY3QoKTtcbldlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKEpzb25Sb3V0ZXMuTWlkZGxld2FyZSk7XG5cbi8vIExpc3Qgb2YgYWxsIGRlZmluZWQgSlNPTiBBUEkgZW5kcG9pbnRzXG5Kc29uUm91dGVzLnJvdXRlcyA9IFtdO1xuXG4vLyBTYXZlIHJlZmVyZW5jZSB0byByb3V0ZXIgZm9yIGxhdGVyXG52YXIgY29ubmVjdFJvdXRlcjtcblxuLy8gUmVnaXN0ZXIgYXMgYSBtaWRkbGV3YXJlXG5XZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShNZXRlb3IuYmluZEVudmlyb25tZW50KGNvbm5lY3RSb3V0ZShmdW5jdGlvbiAocm91dGVyKSB7XG4gIGNvbm5lY3RSb3V0ZXIgPSByb3V0ZXI7XG59KSkpO1xuXG4vLyBFcnJvciBtaWRkbGV3YXJlIG11c3QgYmUgYWRkZWQgbGFzdCwgdG8gY2F0Y2ggZXJyb3JzIGZyb20gcHJpb3IgbWlkZGxld2FyZS5cbi8vIFRoYXQncyB3aHkgd2UgY2FjaGUgdGhlbSBhbmQgdGhlbiBhZGQgYWZ0ZXIgc3RhcnR1cC5cbnZhciBlcnJvck1pZGRsZXdhcmVzID0gW107XG5Kc29uUm91dGVzLkVycm9yTWlkZGxld2FyZSA9IHtcbiAgdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgZXJyb3JNaWRkbGV3YXJlcy5wdXNoKGFyZ3VtZW50cyk7XG4gIH0sXG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG4gIF8uZWFjaChlcnJvck1pZGRsZXdhcmVzLCBmdW5jdGlvbiAoZXJyb3JNaWRkbGV3YXJlKSB7XG4gICAgZXJyb3JNaWRkbGV3YXJlID0gXy5tYXAoZXJyb3JNaWRkbGV3YXJlLCBmdW5jdGlvbiAobWF5YmVGbikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihtYXliZUZuKSkge1xuICAgICAgICAvLyBBIGNvbm5lY3QgZXJyb3IgbWlkZGxld2FyZSBuZWVkcyBleGFjdGx5IDQgYXJndW1lbnRzIGJlY2F1c2UgdGhleSB1c2UgZm4ubGVuZ3RoID09PSA0IHRvXG4gICAgICAgIC8vIGRlY2lkZSBpZiBzb21ldGhpbmcgaXMgYW4gZXJyb3IgbWlkZGxld2FyZS5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7XG4gICAgICAgICAgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChtYXliZUZuKShhLCBiLCBjLCBkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWF5YmVGbjtcbiAgICB9KTtcblxuICAgIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlLmFwcGx5KFdlYkFwcC5jb25uZWN0SGFuZGxlcnMsIGVycm9yTWlkZGxld2FyZSk7XG4gIH0pO1xuXG4gIGVycm9yTWlkZGxld2FyZXMgPSBbXTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZCA9IGZ1bmN0aW9uIChtZXRob2QsIHBhdGgsIGhhbmRsZXIpIHtcbiAgLy8gTWFrZSBzdXJlIHBhdGggc3RhcnRzIHdpdGggYSBzbGFzaFxuICBpZiAocGF0aFswXSAhPT0gJy8nKSB7XG4gICAgcGF0aCA9ICcvJyArIHBhdGg7XG4gIH1cblxuICAvLyBBZGQgdG8gbGlzdCBvZiBrbm93biBlbmRwb2ludHNcbiAgSnNvblJvdXRlcy5yb3V0ZXMucHVzaCh7XG4gICAgbWV0aG9kOiBtZXRob2QsXG4gICAgcGF0aDogcGF0aCxcbiAgfSk7XG5cbiAgY29ubmVjdFJvdXRlclttZXRob2QudG9Mb3dlckNhc2UoKV0ocGF0aCwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgLy8gU2V0IGhlYWRlcnMgb24gcmVzcG9uc2VcbiAgICBzZXRIZWFkZXJzKHJlcywgcmVzcG9uc2VIZWFkZXJzKTtcbiAgICBGaWJlcihmdW5jdGlvbiAoKSB7XG4gICAgICB0cnkge1xuICAgICAgICBoYW5kbGVyKHJlcSwgcmVzLCBuZXh0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgfVxuICAgIH0pLnJ1bigpO1xuICB9KTtcbn07XG5cbnZhciByZXNwb25zZUhlYWRlcnMgPSB7XG4gICdDYWNoZS1Db250cm9sJzogJ25vLXN0b3JlJyxcbiAgUHJhZ21hOiAnbm8tY2FjaGUnLFxufTtcblxuSnNvblJvdXRlcy5zZXRSZXNwb25zZUhlYWRlcnMgPSBmdW5jdGlvbiAoaGVhZGVycykge1xuICByZXNwb25zZUhlYWRlcnMgPSBoZWFkZXJzO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSByZXNwb25zZSBoZWFkZXJzLCBzdGF0dXMgY29kZSwgYW5kIGJvZHksIGFuZCBlbmRzIGl0LlxuICogVGhlIEpTT04gcmVzcG9uc2Ugd2lsbCBiZSBwcmV0dHkgcHJpbnRlZCBpZiBOT0RFX0VOViBpcyBgZGV2ZWxvcG1lbnRgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSByZXMgUmVzcG9uc2Ugb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY29kZV0gSFRUUCBzdGF0dXMgY29kZS4gRGVmYXVsdCBpcyAyMDAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuaGVhZGVyc10gRGljdGlvbmFyeSBvZiBoZWFkZXJzLlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl8bnVsbHx1bmRlZmluZWR9IFtvcHRpb25zLmRhdGFdIFRoZSBvYmplY3QgdG9cbiAqICAgc3RyaW5naWZ5IGFzIHRoZSByZXNwb25zZS4gSWYgYG51bGxgLCB0aGUgcmVzcG9uc2Ugd2lsbCBiZSBcIm51bGxcIi5cbiAqICAgSWYgYHVuZGVmaW5lZGAsIHRoZXJlIHdpbGwgYmUgbm8gcmVzcG9uc2UgYm9keS5cbiAqL1xuSnNvblJvdXRlcy5zZW5kUmVzdWx0ID0gZnVuY3Rpb24gKHJlcywgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyBXZSd2ZSBhbHJlYWR5IHNldCBnbG9iYWwgaGVhZGVycyBvbiByZXNwb25zZSwgYnV0IGlmIHRoZXlcbiAgLy8gcGFzcyBpbiBtb3JlIGhlcmUsIHdlIHNldCB0aG9zZS5cbiAgaWYgKG9wdGlvbnMuaGVhZGVycykgc2V0SGVhZGVycyhyZXMsIG9wdGlvbnMuaGVhZGVycyk7XG5cbiAgLy8gU2V0IHN0YXR1cyBjb2RlIG9uIHJlc3BvbnNlXG4gIHJlcy5zdGF0dXNDb2RlID0gb3B0aW9ucy5jb2RlIHx8IDIwMDtcblxuICAvLyBTZXQgcmVzcG9uc2UgYm9keVxuICB3cml0ZUpzb25Ub0JvZHkocmVzLCBvcHRpb25zLmRhdGEpO1xuXG4gIC8vIFNlbmQgdGhlIHJlc3BvbnNlXG4gIHJlcy5lbmQoKTtcbn07XG5cbmZ1bmN0aW9uIHNldEhlYWRlcnMocmVzLCBoZWFkZXJzKSB7XG4gIF8uZWFjaChoZWFkZXJzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgIHJlcy5zZXRIZWFkZXIoa2V5LCB2YWx1ZSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB3cml0ZUpzb25Ub0JvZHkocmVzLCBqc29uKSB7XG4gIGlmIChqc29uICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgc2hvdWxkUHJldHR5UHJpbnQgPSAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpO1xuICAgIHZhciBzcGFjZXIgPSBzaG91bGRQcmV0dHlQcmludCA/IDIgOiBudWxsO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmVzLndyaXRlKEpTT04uc3RyaW5naWZ5KGpzb24sIG51bGwsIHNwYWNlcikpO1xuICB9XG59XG4iLCIvKiBnbG9iYWwgUmVzdE1pZGRsZXdhcmU6dHJ1ZSAqL1xuXG5SZXN0TWlkZGxld2FyZSA9IHt9O1xuIl19
