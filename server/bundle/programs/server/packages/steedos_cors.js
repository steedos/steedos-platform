(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cors":{"cors.coffee":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/steedos_cors/cors.coffee                                                                      //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var cors;
cors = require("cors");
WebApp.rawConnectHandlers.use(function (req, res, next) {
  var buf, ref;

  if (req._body) {
    return next();
  }

  if (req.headers['transfer-encoding'] === void 0 && isNaN(req.headers['content-length'])) {
    return next();
  }

  if ((ref = req.headers['content-type']) !== '' && ref !== void 0) {
    return next();
  }

  buf = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    return buf += chunk;
  });
  return req.on('end', function () {
    var err;

    if ((typeof Steedos !== "undefined" && Steedos !== null ? Steedos.debugLevel : void 0) != null && Steedos.debugLevel === 'debug') {
      console.log('[request]'.green, req.method, req.url, '\nheaders ->', req.headers, '\nbody ->', buf);
    }

    try {
      req.body = JSON.parse(buf);
    } catch (error) {
      err = error;
      req.body = buf;
    }

    req._body = true;
    return next();
  });
});
WebApp.rawConnectHandlers.use(cors({
  origin: true,
  credentials: true
}));
WebApp.rawConnectHandlers.use(function (req, res, next) {
  var method, setHeader;
  method = req.method && req.method.toUpperCase && req.method.toUpperCase();
  setHeader = res.setHeader;

  res.setHeader = function (key, val) {
    if (key.toLowerCase() === 'access-control-allow-origin' && val === 'http://meteor.local') {
      return;
    }

    return setHeader.apply(this, arguments);
  };

  return next();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:cors/cors.coffee");

/* Exports */
Package._define("steedos:cors");

})();

//# sourceURL=meteor://💻app/packages/steedos_cors.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jb3JzL2NvcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JzLmNvZmZlZSJdLCJuYW1lcyI6WyJjb3JzIiwicmVxdWlyZSIsIldlYkFwcCIsInJhd0Nvbm5lY3RIYW5kbGVycyIsInVzZSIsInJlcSIsInJlcyIsIm5leHQiLCJidWYiLCJyZWYiLCJfYm9keSIsImhlYWRlcnMiLCJpc05hTiIsInNldEVuY29kaW5nIiwib24iLCJjaHVuayIsImVyciIsIlN0ZWVkb3MiLCJkZWJ1Z0xldmVsIiwiY29uc29sZSIsImxvZyIsImdyZWVuIiwibWV0aG9kIiwidXJsIiwiYm9keSIsIkpTT04iLCJwYXJzZSIsImVycm9yIiwib3JpZ2luIiwiY3JlZGVudGlhbHMiLCJzZXRIZWFkZXIiLCJ0b1VwcGVyQ2FzZSIsImtleSIsInZhbCIsInRvTG93ZXJDYXNlIiwiYXBwbHkiLCJhcmd1bWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBQUEsSUFBQTtBQUFBQSxPQUFPQyxRQUFRLE1BQVIsQ0FBUDtBQUdBQyxPQUFPQyxrQkFBUCxDQUEwQkMsR0FBMUIsQ0FBOEIsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVg7QUFDN0IsTUFBQUMsR0FBQSxFQUFBQyxHQUFBOztBQUFBLE1BQUdKLElBQUlLLEtBQVA7QUFDQyxXQUFPSCxNQUFQO0FDRUM7O0FEQUYsTUFBR0YsSUFBSU0sT0FBSixDQUFZLG1CQUFaLE1BQW9DLE1BQXBDLElBQWtEQyxNQUFNUCxJQUFJTSxPQUFKLENBQVksZ0JBQVosQ0FBTixDQUFyRDtBQUNDLFdBQU9KLE1BQVA7QUNFQzs7QURBRixPQUFBRSxNQUFHSixJQUFJTSxPQUFKLENBQVksY0FBWixDQUFILE1BQXVDLEVBQXZDLElBQUdGLFFBQXdDLE1BQTNDO0FBQ0MsV0FBT0YsTUFBUDtBQ0VDOztBREFGQyxRQUFNLEVBQU47QUFDQUgsTUFBSVEsV0FBSixDQUFnQixNQUFoQjtBQUNBUixNQUFJUyxFQUFKLENBQU8sTUFBUCxFQUFlLFVBQUNDLEtBQUQ7QUNFWixXREZ1QlAsT0FBT08sS0NFOUI7QURGSDtBQ0lDLFNESERWLElBQUlTLEVBQUosQ0FBTyxLQUFQLEVBQWM7QUFDYixRQUFBRSxHQUFBOztBQUFBLFFBQUcsUUFBQUMsT0FBQSxvQkFBQUEsWUFBQSxPQUFBQSxRQUFBQyxVQUFBLHNCQUF5QkQsUUFBUUMsVUFBUixLQUFzQixPQUFsRDtBQUNDQyxjQUFRQyxHQUFSLENBQVksWUFBWUMsS0FBeEIsRUFBK0JoQixJQUFJaUIsTUFBbkMsRUFBMkNqQixJQUFJa0IsR0FBL0MsRUFBb0QsY0FBcEQsRUFBb0VsQixJQUFJTSxPQUF4RSxFQUFpRixXQUFqRixFQUE4RkgsR0FBOUY7QUNLRTs7QURISDtBQUNDSCxVQUFJbUIsSUFBSixHQUFXQyxLQUFLQyxLQUFMLENBQVdsQixHQUFYLENBQVg7QUFERCxhQUFBbUIsS0FBQTtBQUVNWCxZQUFBVyxLQUFBO0FBQ0x0QixVQUFJbUIsSUFBSixHQUFXaEIsR0FBWDtBQ01FOztBREpISCxRQUFJSyxLQUFKLEdBQVksSUFBWjtBQ01FLFdETEZILE1DS0U7QURmSCxJQ0dDO0FEaEJGO0FBeUJBTCxPQUFPQyxrQkFBUCxDQUEwQkMsR0FBMUIsQ0FBOEJKLEtBQUs7QUFBQzRCLFVBQVEsSUFBVDtBQUFlQyxlQUFhO0FBQTVCLENBQUwsQ0FBOUI7QUFFQTNCLE9BQU9DLGtCQUFQLENBQTBCQyxHQUExQixDQUE4QixVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWDtBQUU3QixNQUFBZSxNQUFBLEVBQUFRLFNBQUE7QUFBQVIsV0FBU2pCLElBQUlpQixNQUFKLElBQWNqQixJQUFJaUIsTUFBSixDQUFXUyxXQUF6QixJQUF3QzFCLElBQUlpQixNQUFKLENBQVdTLFdBQVgsRUFBakQ7QUFHQUQsY0FBWXhCLElBQUl3QixTQUFoQjs7QUFDQXhCLE1BQUl3QixTQUFKLEdBQWdCLFVBQUNFLEdBQUQsRUFBTUMsR0FBTjtBQUNmLFFBQUdELElBQUlFLFdBQUosT0FBcUIsNkJBQXJCLElBQXVERCxRQUFPLHFCQUFqRTtBQUNDO0FDU0U7O0FEUkgsV0FBT0gsVUFBVUssS0FBVixDQUFnQixJQUFoQixFQUFtQkMsU0FBbkIsQ0FBUDtBQUhlLEdBQWhCOztBQUtBLFNBQU83QixNQUFQO0FBWEQsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jb3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIyBBZGRpbmcgQ09SUyBoZWFkZXJzIHNvIHdlIGNhbiB1c2UgQ0ROcyBmb3Igc3RhdGljIGNvbnRlbnRcbmNvcnMgPSByZXF1aXJlKFwiY29yc1wiKTtcblxuIyBUcnkgdG8gcGFyc2UgYWxsIHJlcXVlc3QgYm9kaWVzIGFzIEpTT05cbldlYkFwcC5yYXdDb25uZWN0SGFuZGxlcnMudXNlIChyZXEsIHJlcywgbmV4dCkgLT5cblx0aWYgcmVxLl9ib2R5XG5cdFx0cmV0dXJuIG5leHQoKVxuXG5cdGlmIHJlcS5oZWFkZXJzWyd0cmFuc2Zlci1lbmNvZGluZyddIGlzIHVuZGVmaW5lZCBhbmQgaXNOYU4ocmVxLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10pXG5cdFx0cmV0dXJuIG5leHQoKVxuXG5cdGlmIHJlcS5oZWFkZXJzWydjb250ZW50LXR5cGUnXSBub3QgaW4gWycnLCB1bmRlZmluZWRdXG5cdFx0cmV0dXJuIG5leHQoKVxuXG5cdGJ1ZiA9ICcnXG5cdHJlcS5zZXRFbmNvZGluZygndXRmOCcpXG5cdHJlcS5vbiAnZGF0YScsIChjaHVuaykgLT4gYnVmICs9IGNodW5rXG5cdHJlcS5vbiAnZW5kJywgLT5cblx0XHRpZiBTdGVlZG9zPy5kZWJ1Z0xldmVsPyBhbmQgU3RlZWRvcy5kZWJ1Z0xldmVsIGlzICdkZWJ1Zydcblx0XHRcdGNvbnNvbGUubG9nICdbcmVxdWVzdF0nLmdyZWVuLCByZXEubWV0aG9kLCByZXEudXJsLCAnXFxuaGVhZGVycyAtPicsIHJlcS5oZWFkZXJzLCAnXFxuYm9keSAtPicsIGJ1ZlxuXG5cdFx0dHJ5XG5cdFx0XHRyZXEuYm9keSA9IEpTT04ucGFyc2UoYnVmKVxuXHRcdGNhdGNoIGVyclxuXHRcdFx0cmVxLmJvZHkgPSBidWZcblxuXHRcdHJlcS5fYm9keSA9IHRydWVcblx0XHRuZXh0KClcblxuV2ViQXBwLnJhd0Nvbm5lY3RIYW5kbGVycy51c2UoY29ycyh7b3JpZ2luOiB0cnVlLCBjcmVkZW50aWFsczogdHJ1ZX0pKTtcblxuV2ViQXBwLnJhd0Nvbm5lY3RIYW5kbGVycy51c2UgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHQjaWYgL15cXC8oYXBpfF90aW1lc3luY3xzb2NranN8dGFwLWkxOG4pKFxcL3wkKS8udGVzdCByZXEudXJsXG5cdG1ldGhvZCA9IHJlcS5tZXRob2QgJiYgcmVxLm1ldGhvZC50b1VwcGVyQ2FzZSAmJiByZXEubWV0aG9kLnRvVXBwZXJDYXNlKCk7XG5cblx0IyBCbG9jayBuZXh0IGhhbmRsZXJzIHRvIG92ZXJyaWRlIENPUlMgd2l0aCB2YWx1ZSBodHRwOi8vbWV0ZW9yLmxvY2FsXG5cdHNldEhlYWRlciA9IHJlcy5zZXRIZWFkZXJcblx0cmVzLnNldEhlYWRlciA9IChrZXksIHZhbCkgLT5cblx0XHRpZiBrZXkudG9Mb3dlckNhc2UoKSBpcyAnYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJyBhbmQgdmFsIGlzICdodHRwOi8vbWV0ZW9yLmxvY2FsJ1xuXHRcdFx0cmV0dXJuXG5cdFx0cmV0dXJuIHNldEhlYWRlci5hcHBseSBALCBhcmd1bWVudHNcblxuXHRyZXR1cm4gbmV4dCgpXG5cbiMgX3N0YXRpY0ZpbGVzTWlkZGxld2FyZSA9IFdlYkFwcEludGVybmFscy5zdGF0aWNGaWxlc01pZGRsZXdhcmVcbiMgV2ViQXBwSW50ZXJuYWxzLl9zdGF0aWNGaWxlc01pZGRsZXdhcmUgPSAoc3RhdGljRmlsZXMsIHJlcSwgcmVzLCBuZXh0KSAtPlxuIyBcdHJlcy5zZXRIZWFkZXIoXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiwgXCIqXCIpXG4jIFx0X3N0YXRpY0ZpbGVzTWlkZGxld2FyZShzdGF0aWNGaWxlcywgcmVxLCByZXMsIG5leHQpXG5cblxuIiwidmFyIGNvcnM7XG5cbmNvcnMgPSByZXF1aXJlKFwiY29yc1wiKTtcblxuV2ViQXBwLnJhd0Nvbm5lY3RIYW5kbGVycy51c2UoZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJ1ZiwgcmVmO1xuICBpZiAocmVxLl9ib2R5KSB7XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfVxuICBpZiAocmVxLmhlYWRlcnNbJ3RyYW5zZmVyLWVuY29kaW5nJ10gPT09IHZvaWQgMCAmJiBpc05hTihyZXEuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXSkpIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG4gIGlmICgocmVmID0gcmVxLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddKSAhPT0gJycgJiYgcmVmICE9PSAodm9pZCAwKSkge1xuICAgIHJldHVybiBuZXh0KCk7XG4gIH1cbiAgYnVmID0gJyc7XG4gIHJlcS5zZXRFbmNvZGluZygndXRmOCcpO1xuICByZXEub24oJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykge1xuICAgIHJldHVybiBidWYgKz0gY2h1bms7XG4gIH0pO1xuICByZXR1cm4gcmVxLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgZXJyO1xuICAgIGlmICgoKHR5cGVvZiBTdGVlZG9zICE9PSBcInVuZGVmaW5lZFwiICYmIFN0ZWVkb3MgIT09IG51bGwgPyBTdGVlZG9zLmRlYnVnTGV2ZWwgOiB2b2lkIDApICE9IG51bGwpICYmIFN0ZWVkb3MuZGVidWdMZXZlbCA9PT0gJ2RlYnVnJykge1xuICAgICAgY29uc29sZS5sb2coJ1tyZXF1ZXN0XScuZ3JlZW4sIHJlcS5tZXRob2QsIHJlcS51cmwsICdcXG5oZWFkZXJzIC0+JywgcmVxLmhlYWRlcnMsICdcXG5ib2R5IC0+JywgYnVmKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHJlcS5ib2R5ID0gSlNPTi5wYXJzZShidWYpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlcnIgPSBlcnJvcjtcbiAgICAgIHJlcS5ib2R5ID0gYnVmO1xuICAgIH1cbiAgICByZXEuX2JvZHkgPSB0cnVlO1xuICAgIHJldHVybiBuZXh0KCk7XG4gIH0pO1xufSk7XG5cbldlYkFwcC5yYXdDb25uZWN0SGFuZGxlcnMudXNlKGNvcnMoe1xuICBvcmlnaW46IHRydWUsXG4gIGNyZWRlbnRpYWxzOiB0cnVlXG59KSk7XG5cbldlYkFwcC5yYXdDb25uZWN0SGFuZGxlcnMudXNlKGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBtZXRob2QsIHNldEhlYWRlcjtcbiAgbWV0aG9kID0gcmVxLm1ldGhvZCAmJiByZXEubWV0aG9kLnRvVXBwZXJDYXNlICYmIHJlcS5tZXRob2QudG9VcHBlckNhc2UoKTtcbiAgc2V0SGVhZGVyID0gcmVzLnNldEhlYWRlcjtcbiAgcmVzLnNldEhlYWRlciA9IGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgaWYgKGtleS50b0xvd2VyQ2FzZSgpID09PSAnYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJyAmJiB2YWwgPT09ICdodHRwOi8vbWV0ZW9yLmxvY2FsJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gc2V0SGVhZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG4gIHJldHVybiBuZXh0KCk7XG59KTtcbiJdfQ==
