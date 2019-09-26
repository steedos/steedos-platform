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
  origin: true
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jb3JzL2NvcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JzLmNvZmZlZSJdLCJuYW1lcyI6WyJjb3JzIiwicmVxdWlyZSIsIldlYkFwcCIsInJhd0Nvbm5lY3RIYW5kbGVycyIsInVzZSIsInJlcSIsInJlcyIsIm5leHQiLCJidWYiLCJyZWYiLCJfYm9keSIsImhlYWRlcnMiLCJpc05hTiIsInNldEVuY29kaW5nIiwib24iLCJjaHVuayIsImVyciIsIlN0ZWVkb3MiLCJkZWJ1Z0xldmVsIiwiY29uc29sZSIsImxvZyIsImdyZWVuIiwibWV0aG9kIiwidXJsIiwiYm9keSIsIkpTT04iLCJwYXJzZSIsImVycm9yIiwib3JpZ2luIiwic2V0SGVhZGVyIiwidG9VcHBlckNhc2UiLCJrZXkiLCJ2YWwiLCJ0b0xvd2VyQ2FzZSIsImFwcGx5IiwiYXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQUFBLElBQUE7QUFBQUEsT0FBT0MsUUFBUSxNQUFSLENBQVA7QUFHQUMsT0FBT0Msa0JBQVAsQ0FBMEJDLEdBQTFCLENBQThCLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYO0FBQzdCLE1BQUFDLEdBQUEsRUFBQUMsR0FBQTs7QUFBQSxNQUFHSixJQUFJSyxLQUFQO0FBQ0MsV0FBT0gsTUFBUDtBQ0VDOztBREFGLE1BQUdGLElBQUlNLE9BQUosQ0FBWSxtQkFBWixNQUFvQyxNQUFwQyxJQUFrREMsTUFBTVAsSUFBSU0sT0FBSixDQUFZLGdCQUFaLENBQU4sQ0FBckQ7QUFDQyxXQUFPSixNQUFQO0FDRUM7O0FEQUYsT0FBQUUsTUFBR0osSUFBSU0sT0FBSixDQUFZLGNBQVosQ0FBSCxNQUF1QyxFQUF2QyxJQUFHRixRQUF3QyxNQUEzQztBQUNDLFdBQU9GLE1BQVA7QUNFQzs7QURBRkMsUUFBTSxFQUFOO0FBQ0FILE1BQUlRLFdBQUosQ0FBZ0IsTUFBaEI7QUFDQVIsTUFBSVMsRUFBSixDQUFPLE1BQVAsRUFBZSxVQUFDQyxLQUFEO0FDRVosV0RGdUJQLE9BQU9PLEtDRTlCO0FERkg7QUNJQyxTREhEVixJQUFJUyxFQUFKLENBQU8sS0FBUCxFQUFjO0FBQ2IsUUFBQUUsR0FBQTs7QUFBQSxRQUFHLFFBQUFDLE9BQUEsb0JBQUFBLFlBQUEsT0FBQUEsUUFBQUMsVUFBQSxzQkFBeUJELFFBQVFDLFVBQVIsS0FBc0IsT0FBbEQ7QUFDQ0MsY0FBUUMsR0FBUixDQUFZLFlBQVlDLEtBQXhCLEVBQStCaEIsSUFBSWlCLE1BQW5DLEVBQTJDakIsSUFBSWtCLEdBQS9DLEVBQW9ELGNBQXBELEVBQW9FbEIsSUFBSU0sT0FBeEUsRUFBaUYsV0FBakYsRUFBOEZILEdBQTlGO0FDS0U7O0FESEg7QUFDQ0gsVUFBSW1CLElBQUosR0FBV0MsS0FBS0MsS0FBTCxDQUFXbEIsR0FBWCxDQUFYO0FBREQsYUFBQW1CLEtBQUE7QUFFTVgsWUFBQVcsS0FBQTtBQUNMdEIsVUFBSW1CLElBQUosR0FBV2hCLEdBQVg7QUNNRTs7QURKSEgsUUFBSUssS0FBSixHQUFZLElBQVo7QUNNRSxXRExGSCxNQ0tFO0FEZkgsSUNHQztBRGhCRjtBQXlCQUwsT0FBT0Msa0JBQVAsQ0FBMEJDLEdBQTFCLENBQThCSixLQUFLO0FBQUM0QixVQUFRO0FBQVQsQ0FBTCxDQUE5QjtBQUVBMUIsT0FBT0Msa0JBQVAsQ0FBMEJDLEdBQTFCLENBQThCLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYO0FBRTdCLE1BQUFlLE1BQUEsRUFBQU8sU0FBQTtBQUFBUCxXQUFTakIsSUFBSWlCLE1BQUosSUFBY2pCLElBQUlpQixNQUFKLENBQVdRLFdBQXpCLElBQXdDekIsSUFBSWlCLE1BQUosQ0FBV1EsV0FBWCxFQUFqRDtBQUdBRCxjQUFZdkIsSUFBSXVCLFNBQWhCOztBQUNBdkIsTUFBSXVCLFNBQUosR0FBZ0IsVUFBQ0UsR0FBRCxFQUFNQyxHQUFOO0FBQ2YsUUFBR0QsSUFBSUUsV0FBSixPQUFxQiw2QkFBckIsSUFBdURELFFBQU8scUJBQWpFO0FBQ0M7QUNRRTs7QURQSCxXQUFPSCxVQUFVSyxLQUFWLENBQWdCLElBQWhCLEVBQW1CQyxTQUFuQixDQUFQO0FBSGUsR0FBaEI7O0FBS0EsU0FBTzVCLE1BQVA7QUFYRCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2NvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIjIEFkZGluZyBDT1JTIGhlYWRlcnMgc28gd2UgY2FuIHVzZSBDRE5zIGZvciBzdGF0aWMgY29udGVudFxuY29ycyA9IHJlcXVpcmUoXCJjb3JzXCIpO1xuXG4jIFRyeSB0byBwYXJzZSBhbGwgcmVxdWVzdCBib2RpZXMgYXMgSlNPTlxuV2ViQXBwLnJhd0Nvbm5lY3RIYW5kbGVycy51c2UgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHRpZiByZXEuX2JvZHlcblx0XHRyZXR1cm4gbmV4dCgpXG5cblx0aWYgcmVxLmhlYWRlcnNbJ3RyYW5zZmVyLWVuY29kaW5nJ10gaXMgdW5kZWZpbmVkIGFuZCBpc05hTihyZXEuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXSlcblx0XHRyZXR1cm4gbmV4dCgpXG5cblx0aWYgcmVxLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddIG5vdCBpbiBbJycsIHVuZGVmaW5lZF1cblx0XHRyZXR1cm4gbmV4dCgpXG5cblx0YnVmID0gJydcblx0cmVxLnNldEVuY29kaW5nKCd1dGY4Jylcblx0cmVxLm9uICdkYXRhJywgKGNodW5rKSAtPiBidWYgKz0gY2h1bmtcblx0cmVxLm9uICdlbmQnLCAtPlxuXHRcdGlmIFN0ZWVkb3M/LmRlYnVnTGV2ZWw/IGFuZCBTdGVlZG9zLmRlYnVnTGV2ZWwgaXMgJ2RlYnVnJ1xuXHRcdFx0Y29uc29sZS5sb2cgJ1tyZXF1ZXN0XScuZ3JlZW4sIHJlcS5tZXRob2QsIHJlcS51cmwsICdcXG5oZWFkZXJzIC0+JywgcmVxLmhlYWRlcnMsICdcXG5ib2R5IC0+JywgYnVmXG5cblx0XHR0cnlcblx0XHRcdHJlcS5ib2R5ID0gSlNPTi5wYXJzZShidWYpXG5cdFx0Y2F0Y2ggZXJyXG5cdFx0XHRyZXEuYm9keSA9IGJ1ZlxuXG5cdFx0cmVxLl9ib2R5ID0gdHJ1ZVxuXHRcdG5leHQoKVxuXG5XZWJBcHAucmF3Q29ubmVjdEhhbmRsZXJzLnVzZShjb3JzKHtvcmlnaW46IHRydWV9KSk7XG5cbldlYkFwcC5yYXdDb25uZWN0SGFuZGxlcnMudXNlIChyZXEsIHJlcywgbmV4dCkgLT5cblx0I2lmIC9eXFwvKGFwaXxfdGltZXN5bmN8c29ja2pzfHRhcC1pMThuKShcXC98JCkvLnRlc3QgcmVxLnVybFxuXHRtZXRob2QgPSByZXEubWV0aG9kICYmIHJlcS5tZXRob2QudG9VcHBlckNhc2UgJiYgcmVxLm1ldGhvZC50b1VwcGVyQ2FzZSgpO1xuXG5cdCMgQmxvY2sgbmV4dCBoYW5kbGVycyB0byBvdmVycmlkZSBDT1JTIHdpdGggdmFsdWUgaHR0cDovL21ldGVvci5sb2NhbFxuXHRzZXRIZWFkZXIgPSByZXMuc2V0SGVhZGVyXG5cdHJlcy5zZXRIZWFkZXIgPSAoa2V5LCB2YWwpIC0+XG5cdFx0aWYga2V5LnRvTG93ZXJDYXNlKCkgaXMgJ2FjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbicgYW5kIHZhbCBpcyAnaHR0cDovL21ldGVvci5sb2NhbCdcblx0XHRcdHJldHVyblxuXHRcdHJldHVybiBzZXRIZWFkZXIuYXBwbHkgQCwgYXJndW1lbnRzXG5cblx0cmV0dXJuIG5leHQoKVxuXG4jIF9zdGF0aWNGaWxlc01pZGRsZXdhcmUgPSBXZWJBcHBJbnRlcm5hbHMuc3RhdGljRmlsZXNNaWRkbGV3YXJlXG4jIFdlYkFwcEludGVybmFscy5fc3RhdGljRmlsZXNNaWRkbGV3YXJlID0gKHN0YXRpY0ZpbGVzLCByZXEsIHJlcywgbmV4dCkgLT5cbiMgXHRyZXMuc2V0SGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIsIFwiKlwiKVxuIyBcdF9zdGF0aWNGaWxlc01pZGRsZXdhcmUoc3RhdGljRmlsZXMsIHJlcSwgcmVzLCBuZXh0KVxuXG5cbiIsInZhciBjb3JzO1xuXG5jb3JzID0gcmVxdWlyZShcImNvcnNcIik7XG5cbldlYkFwcC5yYXdDb25uZWN0SGFuZGxlcnMudXNlKGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBidWYsIHJlZjtcbiAgaWYgKHJlcS5fYm9keSkge1xuICAgIHJldHVybiBuZXh0KCk7XG4gIH1cbiAgaWYgKHJlcS5oZWFkZXJzWyd0cmFuc2Zlci1lbmNvZGluZyddID09PSB2b2lkIDAgJiYgaXNOYU4ocmVxLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10pKSB7XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfVxuICBpZiAoKHJlZiA9IHJlcS5oZWFkZXJzWydjb250ZW50LXR5cGUnXSkgIT09ICcnICYmIHJlZiAhPT0gKHZvaWQgMCkpIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG4gIGJ1ZiA9ICcnO1xuICByZXEuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgcmVxLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICByZXR1cm4gYnVmICs9IGNodW5rO1xuICB9KTtcbiAgcmV0dXJuIHJlcS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVycjtcbiAgICBpZiAoKCh0eXBlb2YgU3RlZWRvcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTdGVlZG9zICE9PSBudWxsID8gU3RlZWRvcy5kZWJ1Z0xldmVsIDogdm9pZCAwKSAhPSBudWxsKSAmJiBTdGVlZG9zLmRlYnVnTGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdbcmVxdWVzdF0nLmdyZWVuLCByZXEubWV0aG9kLCByZXEudXJsLCAnXFxuaGVhZGVycyAtPicsIHJlcS5oZWFkZXJzLCAnXFxuYm9keSAtPicsIGJ1Zik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICByZXEuYm9keSA9IEpTT04ucGFyc2UoYnVmKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZXJyID0gZXJyb3I7XG4gICAgICByZXEuYm9keSA9IGJ1ZjtcbiAgICB9XG4gICAgcmVxLl9ib2R5ID0gdHJ1ZTtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9KTtcbn0pO1xuXG5XZWJBcHAucmF3Q29ubmVjdEhhbmRsZXJzLnVzZShjb3JzKHtcbiAgb3JpZ2luOiB0cnVlXG59KSk7XG5cbldlYkFwcC5yYXdDb25uZWN0SGFuZGxlcnMudXNlKGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBtZXRob2QsIHNldEhlYWRlcjtcbiAgbWV0aG9kID0gcmVxLm1ldGhvZCAmJiByZXEubWV0aG9kLnRvVXBwZXJDYXNlICYmIHJlcS5tZXRob2QudG9VcHBlckNhc2UoKTtcbiAgc2V0SGVhZGVyID0gcmVzLnNldEhlYWRlcjtcbiAgcmVzLnNldEhlYWRlciA9IGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgaWYgKGtleS50b0xvd2VyQ2FzZSgpID09PSAnYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJyAmJiB2YWwgPT09ICdodHRwOi8vbWV0ZW9yLmxvY2FsJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gc2V0SGVhZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG4gIHJldHVybiBuZXh0KCk7XG59KTtcbiJdfQ==
