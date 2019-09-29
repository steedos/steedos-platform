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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jb3JzL2NvcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JzLmNvZmZlZSJdLCJuYW1lcyI6WyJjb3JzIiwicmVxdWlyZSIsIldlYkFwcCIsInJhd0Nvbm5lY3RIYW5kbGVycyIsInVzZSIsInJlcSIsInJlcyIsIm5leHQiLCJidWYiLCJyZWYiLCJfYm9keSIsImhlYWRlcnMiLCJpc05hTiIsInNldEVuY29kaW5nIiwib24iLCJjaHVuayIsImVyciIsIlN0ZWVkb3MiLCJkZWJ1Z0xldmVsIiwiY29uc29sZSIsImxvZyIsImdyZWVuIiwibWV0aG9kIiwidXJsIiwiYm9keSIsIkpTT04iLCJwYXJzZSIsImVycm9yIiwib3JpZ2luIiwiY3JlZGVudGlhbHMiLCJzZXRIZWFkZXIiLCJ0b1VwcGVyQ2FzZSIsImtleSIsInZhbCIsInRvTG93ZXJDYXNlIiwiYXBwbHkiLCJhcmd1bWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBQUEsSUFBQTtBQUFBQSxPQUFPQyxRQUFRLE1BQVIsQ0FBUDtBQUdBQyxPQUFPQyxrQkFBUCxDQUEwQkMsR0FBMUIsQ0FBOEIsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVg7QUFDN0IsTUFBQUMsR0FBQSxFQUFBQyxHQUFBOztBQUFBLE1BQUdKLElBQUlLLEtBQVA7QUFDQyxXQUFPSCxNQUFQO0FDRUM7O0FEQUYsTUFBR0YsSUFBSU0sT0FBSixDQUFZLG1CQUFaLE1BQW9DLE1BQXBDLElBQWtEQyxNQUFNUCxJQUFJTSxPQUFKLENBQVksZ0JBQVosQ0FBTixDQUFyRDtBQUNDLFdBQU9KLE1BQVA7QUNFQzs7QURBRixPQUFBRSxNQUFHSixJQUFJTSxPQUFKLENBQVksY0FBWixDQUFILE1BQXVDLEVBQXZDLElBQUdGLFFBQXdDLE1BQTNDO0FBQ0MsV0FBT0YsTUFBUDtBQ0VDOztBREFGQyxRQUFNLEVBQU47QUFDQUgsTUFBSVEsV0FBSixDQUFnQixNQUFoQjtBQUNBUixNQUFJUyxFQUFKLENBQU8sTUFBUCxFQUFlLFVBQUNDLEtBQUQ7QUNFWixXREZ1QlAsT0FBT08sS0NFOUI7QURGSDtBQ0lDLFNESERWLElBQUlTLEVBQUosQ0FBTyxLQUFQLEVBQWM7QUFDYixRQUFBRSxHQUFBOztBQUFBLFFBQUcsUUFBQUMsT0FBQSxvQkFBQUEsWUFBQSxPQUFBQSxRQUFBQyxVQUFBLHNCQUF5QkQsUUFBUUMsVUFBUixLQUFzQixPQUFsRDtBQUNDQyxjQUFRQyxHQUFSLENBQVksWUFBWUMsS0FBeEIsRUFBK0JoQixJQUFJaUIsTUFBbkMsRUFBMkNqQixJQUFJa0IsR0FBL0MsRUFBb0QsY0FBcEQsRUFBb0VsQixJQUFJTSxPQUF4RSxFQUFpRixXQUFqRixFQUE4RkgsR0FBOUY7QUNLRTs7QURISDtBQUNDSCxVQUFJbUIsSUFBSixHQUFXQyxLQUFLQyxLQUFMLENBQVdsQixHQUFYLENBQVg7QUFERCxhQUFBbUIsS0FBQTtBQUVNWCxZQUFBVyxLQUFBO0FBQ0x0QixVQUFJbUIsSUFBSixHQUFXaEIsR0FBWDtBQ01FOztBREpISCxRQUFJSyxLQUFKLEdBQVksSUFBWjtBQ01FLFdETEZILE1DS0U7QURmSCxJQ0dDO0FEaEJGO0FBeUJBTCxPQUFPQyxrQkFBUCxDQUEwQkMsR0FBMUIsQ0FBOEJKLEtBQUs7QUFBQzRCLFVBQVEsSUFBVDtBQUFlQyxlQUFhO0FBQTVCLENBQUwsQ0FBOUI7QUFFQTNCLE9BQU9DLGtCQUFQLENBQTBCQyxHQUExQixDQUE4QixVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWDtBQUU3QixNQUFBZSxNQUFBLEVBQUFRLFNBQUE7QUFBQVIsV0FBU2pCLElBQUlpQixNQUFKLElBQWNqQixJQUFJaUIsTUFBSixDQUFXUyxXQUF6QixJQUF3QzFCLElBQUlpQixNQUFKLENBQVdTLFdBQVgsRUFBakQ7QUFHQUQsY0FBWXhCLElBQUl3QixTQUFoQjs7QUFDQXhCLE1BQUl3QixTQUFKLEdBQWdCLFVBQUNFLEdBQUQsRUFBTUMsR0FBTjtBQUNmLFFBQUdELElBQUlFLFdBQUosT0FBcUIsNkJBQXJCLElBQXVERCxRQUFPLHFCQUFqRTtBQUNDO0FDU0U7O0FEUkgsV0FBT0gsVUFBVUssS0FBVixDQUFnQixJQUFoQixFQUFtQkMsU0FBbkIsQ0FBUDtBQUhlLEdBQWhCOztBQUtBLFNBQU83QixNQUFQO0FBWEQsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jb3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIyBBZGRpbmcgQ09SUyBoZWFkZXJzIHNvIHdlIGNhbiB1c2UgQ0ROcyBmb3Igc3RhdGljIGNvbnRlbnRcclxuY29ycyA9IHJlcXVpcmUoXCJjb3JzXCIpO1xyXG5cclxuIyBUcnkgdG8gcGFyc2UgYWxsIHJlcXVlc3QgYm9kaWVzIGFzIEpTT05cclxuV2ViQXBwLnJhd0Nvbm5lY3RIYW5kbGVycy51c2UgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdGlmIHJlcS5fYm9keVxyXG5cdFx0cmV0dXJuIG5leHQoKVxyXG5cclxuXHRpZiByZXEuaGVhZGVyc1sndHJhbnNmZXItZW5jb2RpbmcnXSBpcyB1bmRlZmluZWQgYW5kIGlzTmFOKHJlcS5oZWFkZXJzWydjb250ZW50LWxlbmd0aCddKVxyXG5cdFx0cmV0dXJuIG5leHQoKVxyXG5cclxuXHRpZiByZXEuaGVhZGVyc1snY29udGVudC10eXBlJ10gbm90IGluIFsnJywgdW5kZWZpbmVkXVxyXG5cdFx0cmV0dXJuIG5leHQoKVxyXG5cclxuXHRidWYgPSAnJ1xyXG5cdHJlcS5zZXRFbmNvZGluZygndXRmOCcpXHJcblx0cmVxLm9uICdkYXRhJywgKGNodW5rKSAtPiBidWYgKz0gY2h1bmtcclxuXHRyZXEub24gJ2VuZCcsIC0+XHJcblx0XHRpZiBTdGVlZG9zPy5kZWJ1Z0xldmVsPyBhbmQgU3RlZWRvcy5kZWJ1Z0xldmVsIGlzICdkZWJ1ZydcclxuXHRcdFx0Y29uc29sZS5sb2cgJ1tyZXF1ZXN0XScuZ3JlZW4sIHJlcS5tZXRob2QsIHJlcS51cmwsICdcXG5oZWFkZXJzIC0+JywgcmVxLmhlYWRlcnMsICdcXG5ib2R5IC0+JywgYnVmXHJcblxyXG5cdFx0dHJ5XHJcblx0XHRcdHJlcS5ib2R5ID0gSlNPTi5wYXJzZShidWYpXHJcblx0XHRjYXRjaCBlcnJcclxuXHRcdFx0cmVxLmJvZHkgPSBidWZcclxuXHJcblx0XHRyZXEuX2JvZHkgPSB0cnVlXHJcblx0XHRuZXh0KClcclxuXHJcbldlYkFwcC5yYXdDb25uZWN0SGFuZGxlcnMudXNlKGNvcnMoe29yaWdpbjogdHJ1ZSwgY3JlZGVudGlhbHM6IHRydWV9KSk7XHJcblxyXG5XZWJBcHAucmF3Q29ubmVjdEhhbmRsZXJzLnVzZSAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0I2lmIC9eXFwvKGFwaXxfdGltZXN5bmN8c29ja2pzfHRhcC1pMThuKShcXC98JCkvLnRlc3QgcmVxLnVybFxyXG5cdG1ldGhvZCA9IHJlcS5tZXRob2QgJiYgcmVxLm1ldGhvZC50b1VwcGVyQ2FzZSAmJiByZXEubWV0aG9kLnRvVXBwZXJDYXNlKCk7XHJcblxyXG5cdCMgQmxvY2sgbmV4dCBoYW5kbGVycyB0byBvdmVycmlkZSBDT1JTIHdpdGggdmFsdWUgaHR0cDovL21ldGVvci5sb2NhbFxyXG5cdHNldEhlYWRlciA9IHJlcy5zZXRIZWFkZXJcclxuXHRyZXMuc2V0SGVhZGVyID0gKGtleSwgdmFsKSAtPlxyXG5cdFx0aWYga2V5LnRvTG93ZXJDYXNlKCkgaXMgJ2FjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbicgYW5kIHZhbCBpcyAnaHR0cDovL21ldGVvci5sb2NhbCdcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRyZXR1cm4gc2V0SGVhZGVyLmFwcGx5IEAsIGFyZ3VtZW50c1xyXG5cclxuXHRyZXR1cm4gbmV4dCgpXHJcblxyXG4jIF9zdGF0aWNGaWxlc01pZGRsZXdhcmUgPSBXZWJBcHBJbnRlcm5hbHMuc3RhdGljRmlsZXNNaWRkbGV3YXJlXHJcbiMgV2ViQXBwSW50ZXJuYWxzLl9zdGF0aWNGaWxlc01pZGRsZXdhcmUgPSAoc3RhdGljRmlsZXMsIHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4jIFx0cmVzLnNldEhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiLCBcIipcIilcclxuIyBcdF9zdGF0aWNGaWxlc01pZGRsZXdhcmUoc3RhdGljRmlsZXMsIHJlcSwgcmVzLCBuZXh0KVxyXG5cclxuXHJcbiIsInZhciBjb3JzO1xuXG5jb3JzID0gcmVxdWlyZShcImNvcnNcIik7XG5cbldlYkFwcC5yYXdDb25uZWN0SGFuZGxlcnMudXNlKGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBidWYsIHJlZjtcbiAgaWYgKHJlcS5fYm9keSkge1xuICAgIHJldHVybiBuZXh0KCk7XG4gIH1cbiAgaWYgKHJlcS5oZWFkZXJzWyd0cmFuc2Zlci1lbmNvZGluZyddID09PSB2b2lkIDAgJiYgaXNOYU4ocmVxLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10pKSB7XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfVxuICBpZiAoKHJlZiA9IHJlcS5oZWFkZXJzWydjb250ZW50LXR5cGUnXSkgIT09ICcnICYmIHJlZiAhPT0gKHZvaWQgMCkpIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG4gIGJ1ZiA9ICcnO1xuICByZXEuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgcmVxLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICByZXR1cm4gYnVmICs9IGNodW5rO1xuICB9KTtcbiAgcmV0dXJuIHJlcS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVycjtcbiAgICBpZiAoKCh0eXBlb2YgU3RlZWRvcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTdGVlZG9zICE9PSBudWxsID8gU3RlZWRvcy5kZWJ1Z0xldmVsIDogdm9pZCAwKSAhPSBudWxsKSAmJiBTdGVlZG9zLmRlYnVnTGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdbcmVxdWVzdF0nLmdyZWVuLCByZXEubWV0aG9kLCByZXEudXJsLCAnXFxuaGVhZGVycyAtPicsIHJlcS5oZWFkZXJzLCAnXFxuYm9keSAtPicsIGJ1Zik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICByZXEuYm9keSA9IEpTT04ucGFyc2UoYnVmKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZXJyID0gZXJyb3I7XG4gICAgICByZXEuYm9keSA9IGJ1ZjtcbiAgICB9XG4gICAgcmVxLl9ib2R5ID0gdHJ1ZTtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9KTtcbn0pO1xuXG5XZWJBcHAucmF3Q29ubmVjdEhhbmRsZXJzLnVzZShjb3JzKHtcbiAgb3JpZ2luOiB0cnVlLFxuICBjcmVkZW50aWFsczogdHJ1ZVxufSkpO1xuXG5XZWJBcHAucmF3Q29ubmVjdEhhbmRsZXJzLnVzZShmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgbWV0aG9kLCBzZXRIZWFkZXI7XG4gIG1ldGhvZCA9IHJlcS5tZXRob2QgJiYgcmVxLm1ldGhvZC50b1VwcGVyQ2FzZSAmJiByZXEubWV0aG9kLnRvVXBwZXJDYXNlKCk7XG4gIHNldEhlYWRlciA9IHJlcy5zZXRIZWFkZXI7XG4gIHJlcy5zZXRIZWFkZXIgPSBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgIGlmIChrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2FjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbicgJiYgdmFsID09PSAnaHR0cDovL21ldGVvci5sb2NhbCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIHNldEhlYWRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuICByZXR1cm4gbmV4dCgpO1xufSk7XG4iXX0=
