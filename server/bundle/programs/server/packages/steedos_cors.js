(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/steedos_cors/cors.coffee                                                                      //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _staticFilesMiddleware;

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
WebApp.rawConnectHandlers.use(function (req, res, next) {
  var method, setHeader;
  method = req.method && req.method.toUpperCase && req.method.toUpperCase();

  if (req.headers.origin) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  if (method === 'OPTIONS') {
    res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,X-Auth-Token,X-User-Id,X-Space-Id");
    res.statusCode = 204;
    res.setHeader('Content-Length', '0');
    res.end();
    return;
  }

  setHeader = res.setHeader;

  res.setHeader = function (key, val) {
    if (key.toLowerCase() === 'access-control-allow-origin' && val === 'http://meteor.local') {
      return;
    }

    return setHeader.apply(this, arguments);
  };

  return next();
});
_staticFilesMiddleware = WebAppInternals.staticFilesMiddleware;

WebAppInternals._staticFilesMiddleware = function (staticFiles, req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return _staticFilesMiddleware(staticFiles, req, res, next);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:cors");

})();

//# sourceURL=meteor://💻app/packages/steedos_cors.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jb3JzL2NvcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JzLmNvZmZlZSJdLCJuYW1lcyI6WyJfc3RhdGljRmlsZXNNaWRkbGV3YXJlIiwiV2ViQXBwIiwicmF3Q29ubmVjdEhhbmRsZXJzIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsImJ1ZiIsInJlZiIsIl9ib2R5IiwiaGVhZGVycyIsImlzTmFOIiwic2V0RW5jb2RpbmciLCJvbiIsImNodW5rIiwiZXJyIiwiU3RlZWRvcyIsImRlYnVnTGV2ZWwiLCJjb25zb2xlIiwibG9nIiwiZ3JlZW4iLCJtZXRob2QiLCJ1cmwiLCJib2R5IiwiSlNPTiIsInBhcnNlIiwiZXJyb3IiLCJzZXRIZWFkZXIiLCJ0b1VwcGVyQ2FzZSIsIm9yaWdpbiIsInN0YXR1c0NvZGUiLCJlbmQiLCJrZXkiLCJ2YWwiLCJ0b0xvd2VyQ2FzZSIsImFwcGx5IiwiYXJndW1lbnRzIiwiV2ViQXBwSW50ZXJuYWxzIiwic3RhdGljRmlsZXNNaWRkbGV3YXJlIiwic3RhdGljRmlsZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQUFBLHNCQUFBOztBQUFBQyxPQUFPQyxrQkFBUCxDQUEwQkMsR0FBMUIsQ0FBOEIsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVg7QUFDN0IsTUFBQUMsR0FBQSxFQUFBQyxHQUFBOztBQUFBLE1BQUdKLElBQUlLLEtBQVA7QUFDQyxXQUFPSCxNQUFQO0FDQ0M7O0FEQ0YsTUFBR0YsSUFBSU0sT0FBSixDQUFZLG1CQUFaLE1BQW9DLE1BQXBDLElBQWtEQyxNQUFNUCxJQUFJTSxPQUFKLENBQVksZ0JBQVosQ0FBTixDQUFyRDtBQUNDLFdBQU9KLE1BQVA7QUNDQzs7QURDRixPQUFBRSxNQUFHSixJQUFJTSxPQUFKLENBQVksY0FBWixDQUFILE1BQXVDLEVBQXZDLElBQUdGLFFBQXdDLE1BQTNDO0FBQ0MsV0FBT0YsTUFBUDtBQ0NDOztBRENGQyxRQUFNLEVBQU47QUFDQUgsTUFBSVEsV0FBSixDQUFnQixNQUFoQjtBQUNBUixNQUFJUyxFQUFKLENBQU8sTUFBUCxFQUFlLFVBQUNDLEtBQUQ7QUNDWixXRER1QlAsT0FBT08sS0NDOUI7QURESDtBQ0dDLFNERkRWLElBQUlTLEVBQUosQ0FBTyxLQUFQLEVBQWM7QUFDYixRQUFBRSxHQUFBOztBQUFBLFFBQUcsUUFBQUMsT0FBQSxvQkFBQUEsWUFBQSxPQUFBQSxRQUFBQyxVQUFBLHNCQUF5QkQsUUFBUUMsVUFBUixLQUFzQixPQUFsRDtBQUNDQyxjQUFRQyxHQUFSLENBQVksWUFBWUMsS0FBeEIsRUFBK0JoQixJQUFJaUIsTUFBbkMsRUFBMkNqQixJQUFJa0IsR0FBL0MsRUFBb0QsY0FBcEQsRUFBb0VsQixJQUFJTSxPQUF4RSxFQUFpRixXQUFqRixFQUE4RkgsR0FBOUY7QUNJRTs7QURGSDtBQUNDSCxVQUFJbUIsSUFBSixHQUFXQyxLQUFLQyxLQUFMLENBQVdsQixHQUFYLENBQVg7QUFERCxhQUFBbUIsS0FBQTtBQUVNWCxZQUFBVyxLQUFBO0FBQ0x0QixVQUFJbUIsSUFBSixHQUFXaEIsR0FBWDtBQ0tFOztBREhISCxRQUFJSyxLQUFKLEdBQVksSUFBWjtBQ0tFLFdESkZILE1DSUU7QURkSCxJQ0VDO0FEZkY7QUEwQkFMLE9BQU9DLGtCQUFQLENBQTBCQyxHQUExQixDQUE4QixVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWDtBQUU3QixNQUFBZSxNQUFBLEVBQUFNLFNBQUE7QUFBQU4sV0FBU2pCLElBQUlpQixNQUFKLElBQWNqQixJQUFJaUIsTUFBSixDQUFXTyxXQUF6QixJQUF3Q3hCLElBQUlpQixNQUFKLENBQVdPLFdBQVgsRUFBakQ7O0FBRUEsTUFBR3hCLElBQUlNLE9BQUosQ0FBWW1CLE1BQWY7QUFDQ3hCLFFBQUlzQixTQUFKLENBQWMsa0NBQWQsRUFBa0QsTUFBbEQ7QUFDQXRCLFFBQUlzQixTQUFKLENBQWMsOEJBQWQsRUFBOEMsaUNBQTlDO0FBQ0F0QixRQUFJc0IsU0FBSixDQUFjLDZCQUFkLEVBQTZDdkIsSUFBSU0sT0FBSixDQUFZbUIsTUFBekQ7QUFIRDtBQUtDeEIsUUFBSXNCLFNBQUosQ0FBYyw2QkFBZCxFQUE2QyxHQUE3QztBQ0tDOztBREhGLE1BQUdOLFdBQVUsU0FBYjtBQUNDaEIsUUFBSXNCLFNBQUosQ0FBYyw4QkFBZCxFQUE4QywrRUFBOUM7QUFDQXRCLFFBQUl5QixVQUFKLEdBQWlCLEdBQWpCO0FBQ0F6QixRQUFJc0IsU0FBSixDQUFjLGdCQUFkLEVBQWdDLEdBQWhDO0FBQ0F0QixRQUFJMEIsR0FBSjtBQUNBO0FDS0M7O0FERkZKLGNBQVl0QixJQUFJc0IsU0FBaEI7O0FBQ0F0QixNQUFJc0IsU0FBSixHQUFnQixVQUFDSyxHQUFELEVBQU1DLEdBQU47QUFDZixRQUFHRCxJQUFJRSxXQUFKLE9BQXFCLDZCQUFyQixJQUF1REQsUUFBTyxxQkFBakU7QUFDQztBQ0lFOztBREhILFdBQU9OLFVBQVVRLEtBQVYsQ0FBZ0IsSUFBaEIsRUFBbUJDLFNBQW5CLENBQVA7QUFIZSxHQUFoQjs7QUFLQSxTQUFPOUIsTUFBUDtBQXpCRDtBQTJCQU4seUJBQXlCcUMsZ0JBQWdCQyxxQkFBekM7O0FBQ0FELGdCQUFnQnJDLHNCQUFoQixHQUF5QyxVQUFDdUMsV0FBRCxFQUFjbkMsR0FBZCxFQUFtQkMsR0FBbkIsRUFBd0JDLElBQXhCO0FBQ3hDRCxNQUFJc0IsU0FBSixDQUFjLDZCQUFkLEVBQTZDLEdBQTdDO0FDT0MsU0RORDNCLHVCQUF1QnVDLFdBQXZCLEVBQW9DbkMsR0FBcEMsRUFBeUNDLEdBQXpDLEVBQThDQyxJQUE5QyxDQ01DO0FEUnVDLENBQXpDLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfY29ycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiMgQWRkaW5nIENPUlMgaGVhZGVycyBzbyB3ZSBjYW4gdXNlIENETnMgZm9yIHN0YXRpYyBjb250ZW50XHJcblxyXG4jIFRyeSB0byBwYXJzZSBhbGwgcmVxdWVzdCBib2RpZXMgYXMgSlNPTlxyXG5XZWJBcHAucmF3Q29ubmVjdEhhbmRsZXJzLnVzZSAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0aWYgcmVxLl9ib2R5XHJcblx0XHRyZXR1cm4gbmV4dCgpXHJcblxyXG5cdGlmIHJlcS5oZWFkZXJzWyd0cmFuc2Zlci1lbmNvZGluZyddIGlzIHVuZGVmaW5lZCBhbmQgaXNOYU4ocmVxLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10pXHJcblx0XHRyZXR1cm4gbmV4dCgpXHJcblxyXG5cdGlmIHJlcS5oZWFkZXJzWydjb250ZW50LXR5cGUnXSBub3QgaW4gWycnLCB1bmRlZmluZWRdXHJcblx0XHRyZXR1cm4gbmV4dCgpXHJcblxyXG5cdGJ1ZiA9ICcnXHJcblx0cmVxLnNldEVuY29kaW5nKCd1dGY4JylcclxuXHRyZXEub24gJ2RhdGEnLCAoY2h1bmspIC0+IGJ1ZiArPSBjaHVua1xyXG5cdHJlcS5vbiAnZW5kJywgLT5cclxuXHRcdGlmIFN0ZWVkb3M/LmRlYnVnTGV2ZWw/IGFuZCBTdGVlZG9zLmRlYnVnTGV2ZWwgaXMgJ2RlYnVnJ1xyXG5cdFx0XHRjb25zb2xlLmxvZyAnW3JlcXVlc3RdJy5ncmVlbiwgcmVxLm1ldGhvZCwgcmVxLnVybCwgJ1xcbmhlYWRlcnMgLT4nLCByZXEuaGVhZGVycywgJ1xcbmJvZHkgLT4nLCBidWZcclxuXHJcblx0XHR0cnlcclxuXHRcdFx0cmVxLmJvZHkgPSBKU09OLnBhcnNlKGJ1ZilcclxuXHRcdGNhdGNoIGVyclxyXG5cdFx0XHRyZXEuYm9keSA9IGJ1ZlxyXG5cclxuXHRcdHJlcS5fYm9keSA9IHRydWVcclxuXHRcdG5leHQoKVxyXG5cclxuXHJcbldlYkFwcC5yYXdDb25uZWN0SGFuZGxlcnMudXNlIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHQjaWYgL15cXC8oYXBpfF90aW1lc3luY3xzb2NranN8dGFwLWkxOG4pKFxcL3wkKS8udGVzdCByZXEudXJsXHJcblx0bWV0aG9kID0gcmVxLm1ldGhvZCAmJiByZXEubWV0aG9kLnRvVXBwZXJDYXNlICYmIHJlcS5tZXRob2QudG9VcHBlckNhc2UoKTtcclxuXHJcblx0aWYgcmVxLmhlYWRlcnMub3JpZ2luXHJcblx0XHRyZXMuc2V0SGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIiwgXCJ0cnVlXCIpO1xyXG5cdFx0cmVzLnNldEhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIiwgXCJHRVQsIFBPU1QsIE9QVElPTlMsIFBVVCwgREVMRVRFXCIpO1xyXG5cdFx0cmVzLnNldEhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiLCByZXEuaGVhZGVycy5vcmlnaW4pXHJcblx0ZWxzZVxyXG5cdFx0cmVzLnNldEhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiLCBcIipcIilcclxuXHJcblx0aWYgbWV0aG9kID09ICdPUFRJT05TJ1xyXG5cdFx0cmVzLnNldEhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIiwgXCJPcmlnaW4sWC1SZXF1ZXN0ZWQtV2l0aCxDb250ZW50LVR5cGUsQWNjZXB0LFgtQXV0aC1Ub2tlbixYLVVzZXItSWQsWC1TcGFjZS1JZFwiKTtcclxuXHRcdHJlcy5zdGF0dXNDb2RlID0gMjA0O1xyXG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCAnMCcpO1xyXG5cdFx0cmVzLmVuZCgpO1xyXG5cdFx0cmV0dXJuIDtcclxuXHJcblx0IyBCbG9jayBuZXh0IGhhbmRsZXJzIHRvIG92ZXJyaWRlIENPUlMgd2l0aCB2YWx1ZSBodHRwOi8vbWV0ZW9yLmxvY2FsXHJcblx0c2V0SGVhZGVyID0gcmVzLnNldEhlYWRlclxyXG5cdHJlcy5zZXRIZWFkZXIgPSAoa2V5LCB2YWwpIC0+XHJcblx0XHRpZiBrZXkudG9Mb3dlckNhc2UoKSBpcyAnYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJyBhbmQgdmFsIGlzICdodHRwOi8vbWV0ZW9yLmxvY2FsJ1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdHJldHVybiBzZXRIZWFkZXIuYXBwbHkgQCwgYXJndW1lbnRzXHJcblxyXG5cdHJldHVybiBuZXh0KClcclxuXHJcbl9zdGF0aWNGaWxlc01pZGRsZXdhcmUgPSBXZWJBcHBJbnRlcm5hbHMuc3RhdGljRmlsZXNNaWRkbGV3YXJlXHJcbldlYkFwcEludGVybmFscy5fc3RhdGljRmlsZXNNaWRkbGV3YXJlID0gKHN0YXRpY0ZpbGVzLCByZXEsIHJlcywgbmV4dCkgLT5cclxuXHRyZXMuc2V0SGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIsIFwiKlwiKVxyXG5cdF9zdGF0aWNGaWxlc01pZGRsZXdhcmUoc3RhdGljRmlsZXMsIHJlcSwgcmVzLCBuZXh0KVxyXG5cclxuXHJcbiIsInZhciBfc3RhdGljRmlsZXNNaWRkbGV3YXJlO1xuXG5XZWJBcHAucmF3Q29ubmVjdEhhbmRsZXJzLnVzZShmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYnVmLCByZWY7XG4gIGlmIChyZXEuX2JvZHkpIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG4gIGlmIChyZXEuaGVhZGVyc1sndHJhbnNmZXItZW5jb2RpbmcnXSA9PT0gdm9pZCAwICYmIGlzTmFOKHJlcS5oZWFkZXJzWydjb250ZW50LWxlbmd0aCddKSkge1xuICAgIHJldHVybiBuZXh0KCk7XG4gIH1cbiAgaWYgKChyZWYgPSByZXEuaGVhZGVyc1snY29udGVudC10eXBlJ10pICE9PSAnJyAmJiByZWYgIT09ICh2b2lkIDApKSB7XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfVxuICBidWYgPSAnJztcbiAgcmVxLnNldEVuY29kaW5nKCd1dGY4Jyk7XG4gIHJlcS5vbignZGF0YScsIGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgcmV0dXJuIGJ1ZiArPSBjaHVuaztcbiAgfSk7XG4gIHJldHVybiByZXEub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBlcnI7XG4gICAgaWYgKCgodHlwZW9mIFN0ZWVkb3MgIT09IFwidW5kZWZpbmVkXCIgJiYgU3RlZWRvcyAhPT0gbnVsbCA/IFN0ZWVkb3MuZGVidWdMZXZlbCA6IHZvaWQgMCkgIT0gbnVsbCkgJiYgU3RlZWRvcy5kZWJ1Z0xldmVsID09PSAnZGVidWcnKSB7XG4gICAgICBjb25zb2xlLmxvZygnW3JlcXVlc3RdJy5ncmVlbiwgcmVxLm1ldGhvZCwgcmVxLnVybCwgJ1xcbmhlYWRlcnMgLT4nLCByZXEuaGVhZGVycywgJ1xcbmJvZHkgLT4nLCBidWYpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgcmVxLmJvZHkgPSBKU09OLnBhcnNlKGJ1Zik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGVyciA9IGVycm9yO1xuICAgICAgcmVxLmJvZHkgPSBidWY7XG4gICAgfVxuICAgIHJlcS5fYm9keSA9IHRydWU7XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfSk7XG59KTtcblxuV2ViQXBwLnJhd0Nvbm5lY3RIYW5kbGVycy51c2UoZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIG1ldGhvZCwgc2V0SGVhZGVyO1xuICBtZXRob2QgPSByZXEubWV0aG9kICYmIHJlcS5tZXRob2QudG9VcHBlckNhc2UgJiYgcmVxLm1ldGhvZC50b1VwcGVyQ2FzZSgpO1xuICBpZiAocmVxLmhlYWRlcnMub3JpZ2luKSB7XG4gICAgcmVzLnNldEhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCIsIFwidHJ1ZVwiKTtcbiAgICByZXMuc2V0SGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kc1wiLCBcIkdFVCwgUE9TVCwgT1BUSU9OUywgUFVULCBERUxFVEVcIik7XG4gICAgcmVzLnNldEhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiLCByZXEuaGVhZGVycy5vcmlnaW4pO1xuICB9IGVsc2Uge1xuICAgIHJlcy5zZXRIZWFkZXIoXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiwgXCIqXCIpO1xuICB9XG4gIGlmIChtZXRob2QgPT09ICdPUFRJT05TJykge1xuICAgIHJlcy5zZXRIZWFkZXIoXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCIsIFwiT3JpZ2luLFgtUmVxdWVzdGVkLVdpdGgsQ29udGVudC1UeXBlLEFjY2VwdCxYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkLFgtU3BhY2UtSWRcIik7XG4gICAgcmVzLnN0YXR1c0NvZGUgPSAyMDQ7XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCAnMCcpO1xuICAgIHJlcy5lbmQoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgc2V0SGVhZGVyID0gcmVzLnNldEhlYWRlcjtcbiAgcmVzLnNldEhlYWRlciA9IGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgaWYgKGtleS50b0xvd2VyQ2FzZSgpID09PSAnYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJyAmJiB2YWwgPT09ICdodHRwOi8vbWV0ZW9yLmxvY2FsJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gc2V0SGVhZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG4gIHJldHVybiBuZXh0KCk7XG59KTtcblxuX3N0YXRpY0ZpbGVzTWlkZGxld2FyZSA9IFdlYkFwcEludGVybmFscy5zdGF0aWNGaWxlc01pZGRsZXdhcmU7XG5cbldlYkFwcEludGVybmFscy5fc3RhdGljRmlsZXNNaWRkbGV3YXJlID0gZnVuY3Rpb24oc3RhdGljRmlsZXMsIHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJlcy5zZXRIZWFkZXIoXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiwgXCIqXCIpO1xuICByZXR1cm4gX3N0YXRpY0ZpbGVzTWlkZGxld2FyZShzdGF0aWNGaWxlcywgcmVxLCByZXMsIG5leHQpO1xufTtcbiJdfQ==
