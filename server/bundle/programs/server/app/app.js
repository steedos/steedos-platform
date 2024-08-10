var require = meteorInstall({"app":{"cors":{"server":{"cors.coffee":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// app/cors/server/cors.coffee                                                                            //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var cors, error, origin, originEnv, parseOrigin;
cors = require("cors");

parseOrigin = function (originEnv) {
  var originsArray;

  if (originEnv === 'true') {
    return true;
  } else if (originEnv === 'false') {
    return false;
  } else if (/^\/.*\/$/.test(originEnv)) {
    return new RegExp(originEnv.slice(1, -1));
  } else if (originEnv.startsWith('[') && originEnv.endsWith(']')) {
    originsArray = JSON.parse(originEnv);
    return originsArray.map(function (item) {
      if (typeof item === 'string') {
        return item;
      } else if (/^\/.*\/$/.test(item)) {
        return new RegExp(item.slice(1, -1));
      } else {
        throw new Error('Invalid origin value in array');
      }
    });
  } else if (typeof originEnv === 'string') {
    return originEnv;
  } else {
    throw new Error('Invalid origin value');
  }
};

originEnv = process.env.STEEDOS_CORS_ORIGIN;
origin = true;

try {
  origin = parseOrigin(originEnv);
  console.log('Parsed origin:', origin);
} catch (error1) {
  error = error1;
  console.error('Error parsing origin:', error.message);
}

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
    } catch (error1) {
      err = error1;
      req.body = buf;
    }

    req._body = true;
    return next();
  });
});
WebApp.rawConnectHandlers.use(cors({
  origin: origin,
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

}}}},"tailwind.config.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// tailwind.config.js                                                                                     //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
!function (module1) {
  /** @type {import('tailwindcss').Config} */
  module.exports = {
    corePlugins: {
      preflight: false
    },
    content: ['./app/**/*.{html,js}', './packages/**/*.{html,js}', './client/**/*.{html,js}', './imports/**/*.{html,js}'],
    theme: {
      extend: {}
    },
    plugins: []
  };
}.call(this, module);
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},{
  "extensions": [
    ".js",
    ".json",
    ".mjs",
    ".jsx",
    ".coffee"
  ]
});

require("/app/cors/server/cors.coffee");
require("/tailwind.config.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvYXBwL2NvcnMvc2VydmVyL2NvcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC90YWlsd2luZC5jb25maWcuanMiXSwibmFtZXMiOlsiY29ycyIsImVycm9yIiwib3JpZ2luIiwib3JpZ2luRW52IiwicGFyc2VPcmlnaW4iLCJyZXF1aXJlIiwib3JpZ2luc0FycmF5IiwidGVzdCIsIlJlZ0V4cCIsInNsaWNlIiwic3RhcnRzV2l0aCIsImVuZHNXaXRoIiwiSlNPTiIsInBhcnNlIiwibWFwIiwiaXRlbSIsIkVycm9yIiwicHJvY2VzcyIsImVudiIsIlNURUVET1NfQ09SU19PUklHSU4iLCJjb25zb2xlIiwibG9nIiwiZXJyb3IxIiwibWVzc2FnZSIsIldlYkFwcCIsInJhd0Nvbm5lY3RIYW5kbGVycyIsInVzZSIsInJlcSIsInJlcyIsIm5leHQiLCJidWYiLCJyZWYiLCJfYm9keSIsImhlYWRlcnMiLCJpc05hTiIsInNldEVuY29kaW5nIiwib24iLCJjaHVuayIsImVyciIsIlN0ZWVkb3MiLCJkZWJ1Z0xldmVsIiwiZ3JlZW4iLCJtZXRob2QiLCJ1cmwiLCJib2R5IiwiY3JlZGVudGlhbHMiLCJzZXRIZWFkZXIiLCJ0b1VwcGVyQ2FzZSIsImtleSIsInZhbCIsInRvTG93ZXJDYXNlIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJtb2R1bGUiLCJleHBvcnRzIiwiY29yZVBsdWdpbnMiLCJwcmVmbGlnaHQiLCJjb250ZW50IiwidGhlbWUiLCJleHRlbmQiLCJwbHVnaW5zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSxJQUFBQSxJQUFBLEVBQUFDLEtBQUEsRUFBQUMsTUFBQSxFQUFBQyxTQUFBLEVBQUFDLFdBQUE7QUFBQUosT0FBT0ssUUFBUSxNQUFSLENBQVA7O0FBQ0FELGNBQWMsVUFBQ0QsU0FBRDtBQUNWLE1BQUFHLFlBQUE7O0FBQUEsTUFBR0gsY0FBYSxNQUFoQjtBQUlBLFdBSEksSUFHSjtBQUpBLFNBRUssSUFBR0Es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a0JBQVAsQ0FBMEJDLEdBQTFCLENBQThCMUIsS0FBSztBQUFDRSxVQUFRQSxNQUFUO0FBQWlCMkMsZUFBYTtBQUE5QixDQUFMLENBQTlCO0FBRUFyQixPQUFPQyxrQkFBUCxDQUEwQkMsR0FBMUIsQ0FBOEIsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVg7QUFFN0IsTUFBQWEsTUFBQSxFQUFBSSxTQUFBO0FBQUFKLFdBQVNmLElBQUllLE1BQUosSUFBY2YsSUFBSWUsTUFBSixDQUFXSyxXQUF6QixJQUF3Q3BCLElBQUllLE1BQUosQ0FBV0ssV0FBWCxFQUFqRDtBQUdBRCxjQUFZbEIsSUFBSWtCLFNBQWhCOztBQUNBbEIsTUFBSWtCLFNBQUosR0FBZ0IsVUFBQ0UsR0FBRCxFQUFNQyxHQUFOO0FBQ2YsUUFBR0QsSUFBSUUsV0FBSixPQUFxQiw2QkFBckIsSUFBdURELFFBQU8scUJBQWpFO0FBQ0M7QUFrQkU7O0FBakJILFdBQU9ILFVBQVVLLEtBQVYsQ0FBZ0IsSUFBaEIsRUFBbUJDLFNBQW5CLENBQVA7QUFIZSxHQUFoQjs7QUFLQSxTQUFPdkIsTUFBUDtBQVhELEc7Ozs7Ozs7Ozs7OztBQzVEQTtBQUNBd0IsUUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2ZDLGVBQVcsRUFBRTtBQUNYQyxlQUFTLEVBQUU7QUFEQSxLQURFO0FBSWZDLFdBQU8sRUFBRSxDQUNQLHNCQURPLEVBRVAsMkJBRk8sRUFHUCx5QkFITyxFQUlQLDBCQUpPLENBSk07QUFVZkMsU0FBSyxFQUFFO0FBQ0xDLFlBQU0sRUFBRTtBQURILEtBVlE7QUFhZkMsV0FBTyxFQUFFO0FBYk0sR0FBakIiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiMgQWRkaW5nIENPUlMgaGVhZGVycyBzbyB3ZSBjYW4gdXNlIENETnMgZm9yIHN0YXRpYyBjb250ZW50XG5jb3JzID0gcmVxdWlyZShcImNvcnNcIik7XG5wYXJzZU9yaWdpbiA9IChvcmlnaW5FbnYpIC0+XG4gICAgaWYgb3JpZ2luRW52IGlzICd0cnVlJ1xuICAgICAgICB0cnVlXG4gICAgZWxzZSBpZiBvcmlnaW5FbnYgaXMgJ2ZhbHNlJ1xuICAgICAgICBmYWxzZVxuICAgIGVsc2UgaWYgL15cXC8uKlxcLyQvLnRlc3Qob3JpZ2luRW52KVxuICAgICAgICBuZXcgUmVnRXhwKG9yaWdpbkVudi5zbGljZSgxLCAtMSkpICMg5Y675o6J5Lik6L6555qE5pac5p2gXG4gICAgZWxzZSBpZiBvcmlnaW5FbnYuc3RhcnRzV2l0aCgnWycpICYmIG9yaWdpbkVudi5lbmRzV2l0aCgnXScpXG4gICAgICAgIG9yaWdpbnNBcnJheSA9IEpTT04ucGFyc2Uob3JpZ2luRW52KVxuICAgICAgICBvcmlnaW5zQXJyYXkubWFwIChpdGVtKSAtPlxuICAgICAgICAgICAgaWYgdHlwZW9mIGl0ZW0gaXMgJ3N0cmluZydcbiAgICAgICAgICAgICAgICBpdGVtXG4gICAgICAgICAgICBlbHNlIGlmIC9eXFwvLipcXC8kLy50ZXN0KGl0ZW0pXG4gICAgICAgICAgICAgICAgbmV3IFJlZ0V4cChpdGVtLnNsaWNlKDEsIC0xKSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgJ0ludmFsaWQgb3JpZ2luIHZhbHVlIGluIGFycmF5J1xuICAgIGVsc2UgaWYgdHlwZW9mIG9yaWdpbkVudiBpcyAnc3RyaW5nJ1xuICAgICAgICBvcmlnaW5FbnZcbiAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciAnSW52YWxpZCBvcmlnaW4gdmFsdWUnXG5cbm9yaWdpbkVudiA9IHByb2Nlc3MuZW52LlNURUVET1NfQ09SU19PUklHSU5cbm9yaWdpbiA9IHRydWVcbnRyeVxuICAgIG9yaWdpbiA9IHBhcnNlT3JpZ2luKG9yaWdpbkVudilcbiAgICBjb25zb2xlLmxvZyAnUGFyc2VkIG9yaWdpbjonLCBvcmlnaW5cbmNhdGNoIGVycm9yXG4gICAgY29uc29sZS5lcnJvciAnRXJyb3IgcGFyc2luZyBvcmlnaW46JywgZXJyb3IubWVzc2FnZVxuXG5cbiMgVHJ5IHRvIHBhcnNlIGFsbCByZXF1ZXN0IGJvZGllcyBhcyBKU09OXG5XZWJBcHAucmF3Q29ubmVjdEhhbmRsZXJzLnVzZSAocmVxLCByZXMsIG5leHQpIC0+XG5cdGlmIHJlcS5fYm9keVxuXHRcdHJldHVybiBuZXh0KClcblxuXHRpZiByZXEuaGVhZGVyc1sndHJhbnNmZXItZW5jb2RpbmcnXSBpcyB1bmRlZmluZWQgYW5kIGlzTmFOKHJlcS5oZWFkZXJzWydjb250ZW50LWxlbmd0aCddKVxuXHRcdHJldHVybiBuZXh0KClcblxuXHRpZiByZXEuaGVhZGVyc1snY29udGVudC10eXBlJ10gbm90IGluIFsnJywgdW5kZWZpbmVkXVxuXHRcdHJldHVybiBuZXh0KClcblxuXHRidWYgPSAnJ1xuXHRyZXEuc2V0RW5jb2RpbmcoJ3V0ZjgnKVxuXHRyZXEub24gJ2RhdGEnLCAoY2h1bmspIC0+IGJ1ZiArPSBjaHVua1xuXHRyZXEub24gJ2VuZCcsIC0+XG5cdFx0aWYgU3RlZWRvcz8uZGVidWdMZXZlbD8gYW5kIFN0ZWVkb3MuZGVidWdMZXZlbCBpcyAnZGVidWcnXG5cdFx0XHRjb25zb2xlLmxvZyAnW3JlcXVlc3RdJy5ncmVlbiwgcmVxLm1ldGhvZCwgcmVxLnVybCwgJ1xcbmhlYWRlcnMgLT4nLCByZXEuaGVhZGVycywgJ1xcbmJvZHkgLT4nLCBidWZcblxuXHRcdHRyeVxuXHRcdFx0cmVxLmJvZHkgPSBKU09OLnBhcnNlKGJ1Zilcblx0XHRjYXRjaCBlcnJcblx0XHRcdHJlcS5ib2R5ID0gYnVmXG5cblx0XHRyZXEuX2JvZHkgPSB0cnVlXG5cdFx0bmV4dCgpXG5cbldlYkFwcC5yYXdDb25uZWN0SGFuZGxlcnMudXNlKGNvcnMoe29yaWdpbjogb3JpZ2luLCBjcmVkZW50aWFsczogdHJ1ZX0pKTtcblxuV2ViQXBwLnJhd0Nvbm5lY3RIYW5kbGVycy51c2UgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHQjaWYgL15cXC8oYXBpfF90aW1lc3luY3xzb2NranN8dGFwLWkxOG4pKFxcL3wkKS8udGVzdCByZXEudXJsXG5cdG1ldGhvZCA9IHJlcS5tZXRob2QgJiYgcmVxLm1ldGhvZC50b1VwcGVyQ2FzZSAmJiByZXEubWV0aG9kLnRvVXBwZXJDYXNlKCk7XG5cblx0IyBCbG9jayBuZXh0IGhhbmRsZXJzIHRvIG92ZXJyaWRlIENPUlMgd2l0aCB2YWx1ZSBodHRwOi8vbWV0ZW9yLmxvY2FsXG5cdHNldEhlYWRlciA9IHJlcy5zZXRIZWFkZXJcblx0cmVzLnNldEhlYWRlciA9IChrZXksIHZhbCkgLT5cblx0XHRpZiBrZXkudG9Mb3dlckNhc2UoKSBpcyAnYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJyBhbmQgdmFsIGlzICdodHRwOi8vbWV0ZW9yLmxvY2FsJ1xuXHRcdFx0cmV0dXJuXG5cdFx0cmV0dXJuIHNldEhlYWRlci5hcHBseSBALCBhcmd1bWVudHNcblxuXHRyZXR1cm4gbmV4dCgpXG5cbiMgX3N0YXRpY0ZpbGVzTWlkZGxld2FyZSA9IFdlYkFwcEludGVybmFscy5zdGF0aWNGaWxlc01pZGRsZXdhcmVcbiMgV2ViQXBwSW50ZXJuYWxzLl9zdGF0aWNGaWxlc01pZGRsZXdhcmUgPSAoc3RhdGljRmlsZXMsIHJlcSwgcmVzLCBuZXh0KSAtPlxuIyBcdHJlcy5zZXRIZWFkZXIoXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiwgXCIqXCIpXG4jIFx0X3N0YXRpY0ZpbGVzTWlkZGxld2FyZShzdGF0aWNGaWxlcywgcmVxLCByZXMsIG5leHQpXG5cblxuIiwiLyoqIEB0eXBlIHtpbXBvcnQoJ3RhaWx3aW5kY3NzJykuQ29uZmlnfSAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvcmVQbHVnaW5zOiB7XG4gICAgcHJlZmxpZ2h0OiBmYWxzZSxcbiAgfSxcbiAgY29udGVudDogW1xuICAgICcuL2FwcC8qKi8qLntodG1sLGpzfScsXG4gICAgJy4vcGFja2FnZXMvKiovKi57aHRtbCxqc30nLFxuICAgICcuL2NsaWVudC8qKi8qLntodG1sLGpzfScsXG4gICAgJy4vaW1wb3J0cy8qKi8qLntodG1sLGpzfScsXG4gIF0sXG4gIHRoZW1lOiB7XG4gICAgZXh0ZW5kOiB7fSxcbiAgfSxcbiAgcGx1Z2luczogW10sXG59XG4iXX0=
