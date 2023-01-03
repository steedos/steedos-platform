(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Log = Package.logging.Log;
var _ = Package.underscore._;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var Boilerplate = Package['boilerplate-generator'].Boilerplate;
var WebAppHashing = Package['webapp-hashing'].WebAppHashing;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var WebApp, WebAppInternals, main;

var require = meteorInstall({"node_modules":{"meteor":{"webapp":{"webapp_server.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/webapp/webapp_server.js                                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
!function (module1) {
  let _objectSpread;

  module1.link("@babel/runtime/helpers/objectSpread2", {
    default(v) {
      _objectSpread = v;
    }

  }, 0);
  module1.export({
    WebApp: () => WebApp,
    WebAppInternals: () => WebAppInternals
  });
  let assert;
  module1.link("assert", {
    default(v) {
      assert = v;
    }

  }, 0);
  let readFileSync;
  module1.link("fs", {
    readFileSync(v) {
      readFileSync = v;
    }

  }, 1);
  let createServer;
  module1.link("http", {
    createServer(v) {
      createServer = v;
    }

  }, 2);
  let pathJoin, pathDirname;
  module1.link("path", {
    join(v) {
      pathJoin = v;
    },

    dirname(v) {
      pathDirname = v;
    }

  }, 3);
  let parseUrl;
  module1.link("url", {
    parse(v) {
      parseUrl = v;
    }

  }, 4);
  let createHash;
  module1.link("crypto", {
    createHash(v) {
      createHash = v;
    }

  }, 5);
  let connect;
  module1.link("./connect.js", {
    connect(v) {
      connect = v;
    }

  }, 6);
  let compress;
  module1.link("compression", {
    default(v) {
      compress = v;
    }

  }, 7);
  let cookieParser;
  module1.link("cookie-parser", {
    default(v) {
      cookieParser = v;
    }

  }, 8);
  let qs;
  module1.link("qs", {
    default(v) {
      qs = v;
    }

  }, 9);
  let parseRequest;
  module1.link("parseurl", {
    default(v) {
      parseRequest = v;
    }

  }, 10);
  let basicAuth;
  module1.link("basic-auth-connect", {
    default(v) {
      basicAuth = v;
    }

  }, 11);
  let lookupUserAgent;
  module1.link("useragent", {
    lookup(v) {
      lookupUserAgent = v;
    }

  }, 12);
  let isModern;
  module1.link("meteor/modern-browsers", {
    isModern(v) {
      isModern = v;
    }

  }, 13);
  let send;
  module1.link("send", {
    default(v) {
      send = v;
    }

  }, 14);
  let removeExistingSocketFile, registerSocketFileCleanup;
  module1.link("./socket_file.js", {
    removeExistingSocketFile(v) {
      removeExistingSocketFile = v;
    },

    registerSocketFileCleanup(v) {
      registerSocketFileCleanup = v;
    }

  }, 15);
  let onMessage;
  module1.link("meteor/inter-process-messaging", {
    onMessage(v) {
      onMessage = v;
    }

  }, 16);
  var SHORT_SOCKET_TIMEOUT = 5 * 1000;
  var LONG_SOCKET_TIMEOUT = 120 * 1000;
  const WebApp = {};
  const WebAppInternals = {};
  const hasOwn = Object.prototype.hasOwnProperty; // backwards compat to 2.0 of connect

  connect.basicAuth = basicAuth;
  WebAppInternals.NpmModules = {
    connect: {
      version: Npm.require('connect/package.json').version,
      module: connect
    }
  }; // Though we might prefer to use web.browser (modern) as the default
  // architecture, safety requires a more compatible defaultArch.

  WebApp.defaultArch = 'web.browser.legacy'; // XXX maps archs to manifests

  WebApp.clientPrograms = {}; // XXX maps archs to program path on filesystem

  var archPath = {};

  var bundledJsCssUrlRewriteHook = function (url) {
    var bundledPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '';
    return bundledPrefix + url;
  };

  var sha1 = function (contents) {
    var hash = createHash('sha1');
    hash.update(contents);
    return hash.digest('hex');
  };

  function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false;
    } // fallback to standard filter function


    return compress.filter(req, res);
  }

  ; // #BrowserIdentification
  //
  // We have multiple places that want to identify the browser: the
  // unsupported browser page, the appcache package, and, eventually
  // delivering browser polyfills only as needed.
  //
  // To avoid detecting the browser in multiple places ad-hoc, we create a
  // Meteor "browser" object. It uses but does not expose the npm
  // useragent module (we could choose a different mechanism to identify
  // the browser in the future if we wanted to).  The browser object
  // contains
  //
  // * `name`: the name of the browser in camel case
  // * `major`, `minor`, `patch`: integers describing the browser version
  //
  // Also here is an early version of a Meteor `request` object, intended
  // to be a high-level description of the request without exposing
  // details of connect's low-level `req`.  Currently it contains:
  //
  // * `browser`: browser identification object described above
  // * `url`: parsed url, including parsed query params
  //
  // As a temporary hack there is a `categorizeRequest` function on WebApp which
  // converts a connect `req` to a Meteor `request`. This can go away once smart
  // packages such as appcache are being passed a `request` object directly when
  // they serve content.
  //
  // This allows `request` to be used uniformly: it is passed to the html
  // attributes hook, and the appcache package can use it when deciding
  // whether to generate a 404 for the manifest.
  //
  // Real routing / server side rendering will probably refactor this
  // heavily.
  // e.g. "Mobile Safari" => "mobileSafari"

  var camelCase = function (name) {
    var parts = name.split(' ');
    parts[0] = parts[0].toLowerCase();

    for (var i = 1; i < parts.length; ++i) {
      parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substr(1);
    }

    return parts.join('');
  };

  var identifyBrowser = function (userAgentString) {
    var userAgent = lookupUserAgent(userAgentString);
    return {
      name: camelCase(userAgent.family),
      major: +userAgent.major,
      minor: +userAgent.minor,
      patch: +userAgent.patch
    };
  }; // XXX Refactor as part of implementing real routing.


  WebAppInternals.identifyBrowser = identifyBrowser;

  WebApp.categorizeRequest = function (req) {
    return _.extend({
      browser: identifyBrowser(req.headers['user-agent']),
      url: parseUrl(req.url, true)
    }, _.pick(req, 'dynamicHead', 'dynamicBody', 'headers', 'cookies'));
  }; // HTML attribute hooks: functions to be called to determine any attributes to
  // be added to the '<html>' tag. Each function is passed a 'request' object (see
  // #BrowserIdentification) and should return null or object.


  var htmlAttributeHooks = [];

  var getHtmlAttributes = function (request) {
    var combinedAttributes = {};

    _.each(htmlAttributeHooks || [], function (hook) {
      var attributes = hook(request);
      if (attributes === null) return;
      if (typeof attributes !== 'object') throw Error("HTML attribute hook must return null or object");

      _.extend(combinedAttributes, attributes);
    });

    return combinedAttributes;
  };

  WebApp.addHtmlAttributeHook = function (hook) {
    htmlAttributeHooks.push(hook);
  }; // Serve app HTML for this URL?


  var appUrl = function (url) {
    if (url === '/favicon.ico' || url === '/robots.txt') return false; // NOTE: app.manifest is not a web standard like favicon.ico and
    // robots.txt. It is a file name we have chosen to use for HTML5
    // appcache URLs. It is included here to prevent using an appcache
    // then removing it from poisoning an app permanently. Eventually,
    // once we have server side routing, this won't be needed as
    // unknown URLs with return a 404 automatically.

    if (url === '/app.manifest') return false; // Avoid serving app HTML for declared routes such as /sockjs/.

    if (RoutePolicy.classify(url)) return false; // we currently return app HTML on all URLs by default

    return true;
  }; // We need to calculate the client hash after all packages have loaded
  // to give them a chance to populate __meteor_runtime_config__.
  //
  // Calculating the hash during startup means that packages can only
  // populate __meteor_runtime_config__ during load, not during startup.
  //
  // Calculating instead it at the beginning of main after all startup
  // hooks had run would allow packages to also populate
  // __meteor_runtime_config__ during startup, but that's too late for
  // autoupdate because it needs to have the client hash at startup to
  // insert the auto update version itself into
  // __meteor_runtime_config__ to get it to the client.
  //
  // An alternative would be to give autoupdate a "post-start,
  // pre-listen" hook to allow it to insert the auto update version at
  // the right moment.


  Meteor.startup(function () {
    function getter(key) {
      return function (arch) {
        arch = arch || WebApp.defaultArch;
        const program = WebApp.clientPrograms[arch];
        const value = program && program[key]; // If this is the first time we have calculated this hash,
        // program[key] will be a thunk (lazy function with no parameters)
        // that we should call to do the actual computation.

        return typeof value === "function" ? program[key] = value() : value;
      };
    }

    WebApp.calculateClientHash = WebApp.clientHash = getter("version");
    WebApp.calculateClientHashRefreshable = getter("versionRefreshable");
    WebApp.calculateClientHashNonRefreshable = getter("versionNonRefreshable");
    WebApp.getRefreshableAssets = getter("refreshableAssets");
  }); // When we have a request pending, we want the socket timeout to be long, to
  // give ourselves a while to serve it, and to allow sockjs long polls to
  // complete.  On the other hand, we want to close idle sockets relatively
  // quickly, so that we can shut down relatively promptly but cleanly, without
  // cutting off anyone's response.

  WebApp._timeoutAdjustmentRequestCallback = function (req, res) {
    // this is really just req.socket.setTimeout(LONG_SOCKET_TIMEOUT);
    req.setTimeout(LONG_SOCKET_TIMEOUT); // Insert our new finish listener to run BEFORE the existing one which removes
    // the response from the socket.

    var finishListeners = res.listeners('finish'); // XXX Apparently in Node 0.12 this event was called 'prefinish'.
    // https://github.com/joyent/node/commit/7c9b6070
    // But it has switched back to 'finish' in Node v4:
    // https://github.com/nodejs/node/pull/1411

    res.removeAllListeners('finish');
    res.on('finish', function () {
      res.setTimeout(SHORT_SOCKET_TIMEOUT);
    });

    _.each(finishListeners, function (l) {
      res.on('finish', l);
    });
  }; // Will be updated by main before we listen.
  // Map from client arch to boilerplate object.
  // Boilerplate object has:
  //   - func: XXX
  //   - baseData: XXX


  var boilerplateByArch = {}; // Register a callback function that can selectively modify boilerplate
  // data given arguments (request, data, arch). The key should be a unique
  // identifier, to prevent accumulating duplicate callbacks from the same
  // call site over time. Callbacks will be called in the order they were
  // registered. A callback should return false if it did not make any
  // changes affecting the boilerplate. Passing null deletes the callback.
  // Any previous callback registered for this key will be returned.

  const boilerplateDataCallbacks = Object.create(null);

  WebAppInternals.registerBoilerplateDataCallback = function (key, callback) {
    const previousCallback = boilerplateDataCallbacks[key];

    if (typeof callback === "function") {
      boilerplateDataCallbacks[key] = callback;
    } else {
      assert.strictEqual(callback, null);
      delete boilerplateDataCallbacks[key];
    } // Return the previous callback in case the new callback needs to call
    // it; for example, when the new callback is a wrapper for the old.


    return previousCallback || null;
  }; // Given a request (as returned from `categorizeRequest`), return the
  // boilerplate HTML to serve for that request.
  //
  // If a previous connect middleware has rendered content for the head or body,
  // returns the boilerplate with that content patched in otherwise
  // memoizes on HTML attributes (used by, eg, appcache) and whether inline
  // scripts are currently allowed.
  // XXX so far this function is always called with arch === 'web.browser'


  function getBoilerplate(request, arch) {
    return getBoilerplateAsync(request, arch).await();
  }

  function getBoilerplateAsync(request, arch) {
    const boilerplate = boilerplateByArch[arch];
    const data = Object.assign({}, boilerplate.baseData, {
      htmlAttributes: getHtmlAttributes(request)
    }, _.pick(request, "dynamicHead", "dynamicBody"));
    let madeChanges = false;
    let promise = Promise.resolve();
    Object.keys(boilerplateDataCallbacks).forEach(key => {
      promise = promise.then(() => {
        const callback = boilerplateDataCallbacks[key];
        return callback(request, data, arch);
      }).then(result => {
        // Callbacks should return false if they did not make any changes.
        if (result !== false) {
          madeChanges = true;
        }
      });
    });
    return promise.then(() => ({
      stream: boilerplate.toHTMLStream(data),
      statusCode: data.statusCode,
      headers: data.headers
    }));
  }

  WebAppInternals.generateBoilerplateInstance = function (arch, manifest, additionalOptions) {
    additionalOptions = additionalOptions || {};

    var runtimeConfig = _.extend(_.clone(__meteor_runtime_config__), additionalOptions.runtimeConfigOverrides || {});

    return new Boilerplate(arch, manifest, _.extend({
      pathMapper(itemPath) {
        return pathJoin(archPath[arch], itemPath);
      },

      baseDataExtension: {
        additionalStaticJs: _.map(additionalStaticJs || [], function (contents, pathname) {
          return {
            pathname: pathname,
            contents: contents
          };
        }),
        // Convert to a JSON string, then get rid of most weird characters, then
        // wrap in double quotes. (The outermost JSON.stringify really ought to
        // just be "wrap in double quotes" but we use it to be safe.) This might
        // end up inside a <script> tag so we need to be careful to not include
        // "</script>", but normal {{spacebars}} escaping escapes too much! See
        // https://github.com/meteor/meteor/issues/3730
        meteorRuntimeConfig: JSON.stringify(encodeURIComponent(JSON.stringify(runtimeConfig))),
        rootUrlPathPrefix: __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '',
        bundledJsCssUrlRewriteHook: bundledJsCssUrlRewriteHook,
        sriMode: sriMode,
        inlineScriptsAllowed: WebAppInternals.inlineScriptsAllowed(),
        inline: additionalOptions.inline
      }
    }, additionalOptions));
  }; // A mapping from url path to architecture (e.g. "web.browser") to static
  // file information with the following fields:
  // - type: the type of file to be served
  // - cacheable: optionally, whether the file should be cached or not
  // - sourceMapUrl: optionally, the url of the source map
  //
  // Info also contains one of the following:
  // - content: the stringified content that should be served at this path
  // - absolutePath: the absolute path on disk to the file
  // Serve static files from the manifest or added with
  // `addStaticJs`. Exported for tests.


  WebAppInternals.staticFilesMiddleware = function (staticFilesByArch, req, res, next) {
    return Promise.asyncApply(() => {
      if ('GET' != req.method && 'HEAD' != req.method && 'OPTIONS' != req.method) {
        next();
        return;
      }

      var pathname = parseRequest(req).pathname;

      try {
        pathname = decodeURIComponent(pathname);
      } catch (e) {
        next();
        return;
      }

      var serveStaticJs = function (s) {
        res.writeHead(200, {
          'Content-type': 'application/javascript; charset=UTF-8'
        });
        res.write(s);
        res.end();
      };

      if (_.has(additionalStaticJs, pathname) && !WebAppInternals.inlineScriptsAllowed()) {
        serveStaticJs(additionalStaticJs[pathname]);
        return;
      }

      const {
        arch,
        path
      } = getArchAndPath(pathname, identifyBrowser(req.headers["user-agent"])); // If pauseClient(arch) has been called, program.paused will be a
      // Promise that will be resolved when the program is unpaused.

      const program = WebApp.clientPrograms[arch];
      Promise.await(program.paused);

      if (path === "/meteor_runtime_config.js" && !WebAppInternals.inlineScriptsAllowed()) {
        serveStaticJs("__meteor_runtime_config__ = ".concat(program.meteorRuntimeConfig, ";"));
        return;
      }

      const info = getStaticFileInfo(staticFilesByArch, pathname, path, arch);

      if (!info) {
        next();
        return;
      } // We don't need to call pause because, unlike 'static', once we call into
      // 'send' and yield to the event loop, we never call another handler with
      // 'next'.
      // Cacheable files are files that should never change. Typically
      // named by their hash (eg meteor bundled js and css files).
      // We cache them ~forever (1yr).


      const maxAge = info.cacheable ? 1000 * 60 * 60 * 24 * 365 : 0;

      if (info.cacheable) {
        // Since we use req.headers["user-agent"] to determine whether the
        // client should receive modern or legacy resources, tell the client
        // to invalidate cached resources when/if its user agent string
        // changes in the future.
        res.setHeader("Vary", "User-Agent");
      } // Set the X-SourceMap header, which current Chrome, FireFox, and Safari
      // understand.  (The SourceMap header is slightly more spec-correct but FF
      // doesn't understand it.)
      //
      // You may also need to enable source maps in Chrome: open dev tools, click
      // the gear in the bottom right corner, and select "enable source maps".


      if (info.sourceMapUrl) {
        res.setHeader('X-SourceMap', __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + info.sourceMapUrl);
      }

      if (info.type === "js" || info.type === "dynamic js") {
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
      } else if (info.type === "css") {
        res.setHeader("Content-Type", "text/css; charset=UTF-8");
      } else if (info.type === "json") {
        res.setHeader("Content-Type", "application/json; charset=UTF-8");
      }

      if (info.hash) {
        res.setHeader('ETag', '"' + info.hash + '"');
      }

      if (info.content) {
        res.write(info.content);
        res.end();
      } else {
        send(req, info.absolutePath, {
          maxage: maxAge,
          dotfiles: 'allow',
          // if we specified a dotfile in the manifest, serve it
          lastModified: false // don't set last-modified based on the file date

        }).on('error', function (err) {
          Log.error("Error serving static file " + err);
          res.writeHead(500);
          res.end();
        }).on('directory', function () {
          Log.error("Unexpected directory " + info.absolutePath);
          res.writeHead(500);
          res.end();
        }).pipe(res);
      }
    });
  };

  function getStaticFileInfo(staticFilesByArch, originalPath, path, arch) {
    if (!hasOwn.call(WebApp.clientPrograms, arch)) {
      return null;
    } // Get a list of all available static file architectures, with arch
    // first in the list if it exists.


    const staticArchList = Object.keys(staticFilesByArch);
    const archIndex = staticArchList.indexOf(arch);

    if (archIndex > 0) {
      staticArchList.unshift(staticArchList.splice(archIndex, 1)[0]);
    }

    let info = null;
    staticArchList.some(arch => {
      const staticFiles = staticFilesByArch[arch];

      function finalize(path) {
        info = staticFiles[path]; // Sometimes we register a lazy function instead of actual data in
        // the staticFiles manifest.

        if (typeof info === "function") {
          info = staticFiles[path] = info();
        }

        return info;
      } // If staticFiles contains originalPath with the arch inferred above,
      // use that information.


      if (hasOwn.call(staticFiles, originalPath)) {
        return finalize(originalPath);
      } // If getArchAndPath returned an alternate path, try that instead.


      if (path !== originalPath && hasOwn.call(staticFiles, path)) {
        return finalize(path);
      }
    });
    return info;
  }

  function getArchAndPath(path, browser) {
    const pathParts = path.split("/");
    const archKey = pathParts[1];

    if (archKey.startsWith("__")) {
      const archCleaned = "web." + archKey.slice(2);

      if (hasOwn.call(WebApp.clientPrograms, archCleaned)) {
        pathParts.splice(1, 1); // Remove the archKey part.

        return {
          arch: archCleaned,
          path: pathParts.join("/")
        };
      }
    } // TODO Perhaps one day we could infer Cordova clients here, so that we
    // wouldn't have to use prefixed "/__cordova/..." URLs.


    const arch = isModern(browser) ? "web.browser" : "web.browser.legacy";

    if (hasOwn.call(WebApp.clientPrograms, arch)) {
      return {
        arch,
        path
      };
    }

    return {
      arch: WebApp.defaultArch,
      path
    };
  } // Parse the passed in port value. Return the port as-is if it's a String
  // (e.g. a Windows Server style named pipe), otherwise return the port as an
  // integer.
  //
  // DEPRECATED: Direct use of this function is not recommended; it is no
  // longer used internally, and will be removed in a future release.


  WebAppInternals.parsePort = port => {
    let parsedPort = parseInt(port);

    if (Number.isNaN(parsedPort)) {
      parsedPort = port;
    }

    return parsedPort;
  };

  onMessage("webapp-pause-client", (_ref) => Promise.asyncApply(() => {
    let {
      arch
    } = _ref;
    WebAppInternals.pauseClient(arch);
  }));
  onMessage("webapp-reload-client", (_ref2) => Promise.asyncApply(() => {
    let {
      arch
    } = _ref2;
    WebAppInternals.generateClientProgram(arch);
  }));

  function runWebAppServer() {
    var shuttingDown = false;
    var syncQueue = new Meteor._SynchronousQueue();

    var getItemPathname = function (itemUrl) {
      return decodeURIComponent(parseUrl(itemUrl).pathname);
    };

    WebAppInternals.reloadClientPrograms = function () {
      syncQueue.runTask(function () {
        const staticFilesByArch = Object.create(null);
        const {
          configJson
        } = __meteor_bootstrap__;
        const clientArchs = configJson.clientArchs || Object.keys(configJson.clientPaths);

        try {
          clientArchs.forEach(arch => {
            generateClientProgram(arch, staticFilesByArch);
          });
          WebAppInternals.staticFilesByArch = staticFilesByArch;
        } catch (e) {
          Log.error("Error reloading the client program: " + e.stack);
          process.exit(1);
        }
      });
    }; // Pause any incoming requests and make them wait for the program to be
    // unpaused the next time generateClientProgram(arch) is called.


    WebAppInternals.pauseClient = function (arch) {
      syncQueue.runTask(() => {
        const program = WebApp.clientPrograms[arch];
        const {
          unpause
        } = program;
        program.paused = new Promise(resolve => {
          if (typeof unpause === "function") {
            // If there happens to be an existing program.unpause function,
            // compose it with the resolve function.
            program.unpause = function () {
              unpause();
              resolve();
            };
          } else {
            program.unpause = resolve;
          }
        });
      });
    };

    WebAppInternals.generateClientProgram = function (arch) {
      syncQueue.runTask(() => generateClientProgram(arch));
    };

    function generateClientProgram(arch) {
      let staticFilesByArch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : WebAppInternals.staticFilesByArch;
      const clientDir = pathJoin(pathDirname(__meteor_bootstrap__.serverDir), arch); // read the control for the client we'll be serving up

      const programJsonPath = pathJoin(clientDir, "program.json");
      let programJson;

      try {
        programJson = JSON.parse(readFileSync(programJsonPath));
      } catch (e) {
        if (e.code === "ENOENT") return;
        throw e;
      }

      if (programJson.format !== "web-program-pre1") {
        throw new Error("Unsupported format for client assets: " + JSON.stringify(programJson.format));
      }

      if (!programJsonPath || !clientDir || !programJson) {
        throw new Error("Client config file not parsed.");
      }

      archPath[arch] = clientDir;
      const staticFiles = staticFilesByArch[arch] = Object.create(null);
      const {
        manifest
      } = programJson;
      manifest.forEach(item => {
        if (item.url && item.where === "client") {
          staticFiles[getItemPathname(item.url)] = {
            absolutePath: pathJoin(clientDir, item.path),
            cacheable: item.cacheable,
            hash: item.hash,
            // Link from source to its map
            sourceMapUrl: item.sourceMapUrl,
            type: item.type
          };

          if (item.sourceMap) {
            // Serve the source map too, under the specified URL. We assume
            // all source maps are cacheable.
            staticFiles[getItemPathname(item.sourceMapUrl)] = {
              absolutePath: pathJoin(clientDir, item.sourceMap),
              cacheable: true
            };
          }
        }
      });
      const {
        PUBLIC_SETTINGS
      } = __meteor_runtime_config__;
      const configOverrides = {
        PUBLIC_SETTINGS
      };
      const oldProgram = WebApp.clientPrograms[arch];
      const newProgram = WebApp.clientPrograms[arch] = {
        format: "web-program-pre1",
        manifest: manifest,
        // Use arrow functions so that these versions can be lazily
        // calculated later, and so that they will not be included in the
        // staticFiles[manifestUrl].content string below.
        //
        // Note: these version calculations must be kept in agreement with
        // CordovaBuilder#appendVersion in tools/cordova/builder.js, or hot
        // code push will reload Cordova apps unnecessarily.
        version: () => WebAppHashing.calculateClientHash(manifest, null, configOverrides),
        versionRefreshable: () => WebAppHashing.calculateClientHash(manifest, type => type === "css", configOverrides),
        versionNonRefreshable: () => WebAppHashing.calculateClientHash(manifest, type => type !== "css", configOverrides),
        cordovaCompatibilityVersions: programJson.cordovaCompatibilityVersions,
        PUBLIC_SETTINGS
      }; // Expose program details as a string reachable via the following URL.

      const manifestUrlPrefix = "/__" + arch.replace(/^web\./, "");
      const manifestUrl = manifestUrlPrefix + getItemPathname("/manifest.json");

      staticFiles[manifestUrl] = () => {
        if (Package.autoupdate) {
          const {
            AUTOUPDATE_VERSION = Package.autoupdate.Autoupdate.autoupdateVersion
          } = process.env;

          if (AUTOUPDATE_VERSION) {
            newProgram.version = AUTOUPDATE_VERSION;
          }
        }

        if (typeof newProgram.version === "function") {
          newProgram.version = newProgram.version();
        }

        return {
          content: JSON.stringify(newProgram),
          cacheable: false,
          hash: newProgram.version,
          type: "json"
        };
      };

      generateBoilerplateForArch(arch); // If there are any requests waiting on oldProgram.paused, let them
      // continue now (using the new program).

      if (oldProgram && oldProgram.paused) {
        oldProgram.unpause();
      }
    }

    ;
    const defaultOptionsForArch = {
      'web.cordova': {
        runtimeConfigOverrides: {
          // XXX We use absoluteUrl() here so that we serve https://
          // URLs to cordova clients if force-ssl is in use. If we were
          // to use __meteor_runtime_config__.ROOT_URL instead of
          // absoluteUrl(), then Cordova clients would immediately get a
          // HCP setting their DDP_DEFAULT_CONNECTION_URL to
          // http://example.meteor.com. This breaks the app, because
          // force-ssl doesn't serve CORS headers on 302
          // redirects. (Plus it's undesirable to have clients
          // connecting to http://example.meteor.com when force-ssl is
          // in use.)
          DDP_DEFAULT_CONNECTION_URL: process.env.MOBILE_DDP_URL || Meteor.absoluteUrl(),
          ROOT_URL: process.env.MOBILE_ROOT_URL || Meteor.absoluteUrl()
        }
      },
      "web.browser": {
        runtimeConfigOverrides: {
          isModern: true
        }
      },
      "web.browser.legacy": {
        runtimeConfigOverrides: {
          isModern: false
        }
      }
    };

    WebAppInternals.generateBoilerplate = function () {
      // This boilerplate will be served to the mobile devices when used with
      // Meteor/Cordova for the Hot-Code Push and since the file will be served by
      // the device's server, it is important to set the DDP url to the actual
      // Meteor server accepting DDP connections and not the device's file server.
      syncQueue.runTask(function () {
        Object.keys(WebApp.clientPrograms).forEach(generateBoilerplateForArch);
      });
    };

    function generateBoilerplateForArch(arch) {
      const program = WebApp.clientPrograms[arch];
      const additionalOptions = defaultOptionsForArch[arch] || {};
      const {
        baseData
      } = boilerplateByArch[arch] = WebAppInternals.generateBoilerplateInstance(arch, program.manifest, additionalOptions); // We need the runtime config with overrides for meteor_runtime_config.js:

      program.meteorRuntimeConfig = JSON.stringify(_objectSpread({}, __meteor_runtime_config__, {}, additionalOptions.runtimeConfigOverrides || null));
      program.refreshableAssets = baseData.css.map(file => ({
        url: bundledJsCssUrlRewriteHook(file.url)
      }));
    }

    WebAppInternals.reloadClientPrograms(); // webserver

    var app = connect(); // Packages and apps can add handlers that run before any other Meteor
    // handlers via WebApp.rawConnectHandlers.

    var rawConnectHandlers = connect();
    app.use(rawConnectHandlers); // Auto-compress any json, javascript, or text.

    app.use(compress({
      filter: shouldCompress
    })); // parse cookies into an object

    app.use(cookieParser()); // We're not a proxy; reject (without crashing) attempts to treat us like
    // one. (See #1212.)

    app.use(function (req, res, next) {
      if (RoutePolicy.isValidUrl(req.url)) {
        next();
        return;
      }

      res.writeHead(400);
      res.write("Not a proxy");
      res.end();
    }); // Parse the query string into res.query. Used by oauth_server, but it's
    // generally pretty handy..
    //
    // Do this before the next middleware destroys req.url if a path prefix
    // is set to close #10111.

    app.use(function (request, response, next) {
      request.query = qs.parse(parseUrl(request.url).query);
      next();
    });

    function getPathParts(path) {
      const parts = path.split("/");

      while (parts[0] === "") parts.shift();

      return parts;
    }

    function isPrefixOf(prefix, array) {
      return prefix.length <= array.length && prefix.every((part, i) => part === array[i]);
    } // Strip off the path prefix, if it exists.


    app.use(function (request, response, next) {
      const pathPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
      const {
        pathname
      } = parseUrl(request.url); // check if the path in the url starts with the path prefix

      if (pathPrefix) {
        const prefixParts = getPathParts(pathPrefix);
        const pathParts = getPathParts(pathname);

        if (isPrefixOf(prefixParts, pathParts)) {
          request.url = "/" + pathParts.slice(prefixParts.length).join("/");
          return next();
        }
      }

      if (pathname === "/favicon.ico" || pathname === "/robots.txt") {
        return next();
      }

      if (pathPrefix) {
        response.writeHead(404);
        response.write("Unknown path");
        response.end();
        return;
      }

      next();
    }); // Serve static files from the manifest.
    // This is inspired by the 'static' middleware.

    app.use(function (req, res, next) {
      WebAppInternals.staticFilesMiddleware(WebAppInternals.staticFilesByArch, req, res, next);
    }); // Core Meteor packages like dynamic-import can add handlers before
    // other handlers added by package and application code.

    app.use(WebAppInternals.meteorInternalHandlers = connect()); // Packages and apps can add handlers to this via WebApp.connectHandlers.
    // They are inserted before our default handler.

    var packageAndAppHandlers = connect();
    app.use(packageAndAppHandlers);
    var suppressConnectErrors = false; // connect knows it is an error handler because it has 4 arguments instead of
    // 3. go figure.  (It is not smart enough to find such a thing if it's hidden
    // inside packageAndAppHandlers.)

    app.use(function (err, req, res, next) {
      if (!err || !suppressConnectErrors || !req.headers['x-suppress-error']) {
        next(err);
        return;
      }

      res.writeHead(err.status, {
        'Content-Type': 'text/plain'
      });
      res.end("An error message");
    });
    app.use(function (req, res, next) {
      return Promise.asyncApply(() => {
        if (!appUrl(req.url)) {
          return next();
        } else {
          var headers = {
            'Content-Type': 'text/html; charset=utf-8'
          };

          if (shuttingDown) {
            headers['Connection'] = 'Close';
          }

          var request = WebApp.categorizeRequest(req);

          if (request.url.query && request.url.query['meteor_css_resource']) {
            // In this case, we're requesting a CSS resource in the meteor-specific
            // way, but we don't have it.  Serve a static css file that indicates that
            // we didn't have it, so we can detect that and refresh.  Make sure
            // that any proxies or CDNs don't cache this error!  (Normally proxies
            // or CDNs are smart enough not to cache error pages, but in order to
            // make this hack work, we need to return the CSS file as a 200, which
            // would otherwise be cached.)
            headers['Content-Type'] = 'text/css; charset=utf-8';
            headers['Cache-Control'] = 'no-cache';
            res.writeHead(200, headers);
            res.write(".meteor-css-not-found-error { width: 0px;}");
            res.end();
            return;
          }

          if (request.url.query && request.url.query['meteor_js_resource']) {
            // Similarly, we're requesting a JS resource that we don't have.
            // Serve an uncached 404. (We can't use the same hack we use for CSS,
            // because actually acting on that hack requires us to have the JS
            // already!)
            headers['Cache-Control'] = 'no-cache';
            res.writeHead(404, headers);
            res.end("404 Not Found");
            return;
          }

          if (request.url.query && request.url.query['meteor_dont_serve_index']) {
            // When downloading files during a Cordova hot code push, we need
            // to detect if a file is not available instead of inadvertently
            // downloading the default index page.
            // So similar to the situation above, we serve an uncached 404.
            headers['Cache-Control'] = 'no-cache';
            res.writeHead(404, headers);
            res.end("404 Not Found");
            return;
          }

          const {
            arch
          } = getArchAndPath(parseRequest(req).pathname, request.browser); // If pauseClient(arch) has been called, program.paused will be a
          // Promise that will be resolved when the program is unpaused.

          Promise.await(WebApp.clientPrograms[arch].paused);
          return getBoilerplateAsync(request, arch).then((_ref3) => {
            let {
              stream,
              statusCode,
              headers: newHeaders
            } = _ref3;

            if (!statusCode) {
              statusCode = res.statusCode ? res.statusCode : 200;
            }

            if (newHeaders) {
              Object.assign(headers, newHeaders);
            }

            res.writeHead(statusCode, headers);
            stream.pipe(res, {
              // End the response when the stream ends.
              end: true
            });
          }).catch(error => {
            Log.error("Error running template: " + error.stack);
            res.writeHead(500, headers);
            res.end();
          });
        }
      });
    }); // Return 404 by default, if no other handlers serve this URL.

    app.use(function (req, res) {
      res.writeHead(404);
      res.end();
    });
    var httpServer = createServer(app);
    var onListeningCallbacks = []; // After 5 seconds w/o data on a socket, kill it.  On the other hand, if
    // there's an outstanding request, give it a higher timeout instead (to avoid
    // killing long-polling requests)

    httpServer.setTimeout(SHORT_SOCKET_TIMEOUT); // Do this here, and then also in livedata/stream_server.js, because
    // stream_server.js kills all the current request handlers when installing its
    // own.

    httpServer.on('request', WebApp._timeoutAdjustmentRequestCallback); // If the client gave us a bad request, tell it instead of just closing the
    // socket. This lets load balancers in front of us differentiate between "a
    // server is randomly closing sockets for no reason" and "client sent a bad
    // request".
    //
    // This will only work on Node 6; Node 4 destroys the socket before calling
    // this event. See https://github.com/nodejs/node/pull/4557/ for details.

    httpServer.on('clientError', (err, socket) => {
      // Pre-Node-6, do nothing.
      if (socket.destroyed) {
        return;
      }

      if (err.message === 'Parse Error') {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      } else {
        // For other errors, use the default behavior as if we had no clientError
        // handler.
        socket.destroy(err);
      }
    }); // start up app

    _.extend(WebApp, {
      connectHandlers: packageAndAppHandlers,
      rawConnectHandlers: rawConnectHandlers,
      httpServer: httpServer,
      connectApp: app,
      // For testing.
      suppressConnectErrors: function () {
        suppressConnectErrors = true;
      },
      onListening: function (f) {
        if (onListeningCallbacks) onListeningCallbacks.push(f);else f();
      },
      // This can be overridden by users who want to modify how listening works
      // (eg, to run a proxy like Apollo Engine Proxy in front of the server).
      startListening: function (httpServer, listenOptions, cb) {
        httpServer.listen(listenOptions, cb);
      }
    }); // Let the rest of the packages (and Meteor.startup hooks) insert connect
    // middlewares and update __meteor_runtime_config__, then keep going to set up
    // actually serving HTML.


    exports.main = argv => {
      WebAppInternals.generateBoilerplate();

      const startHttpServer = listenOptions => {
        WebApp.startListening(httpServer, listenOptions, Meteor.bindEnvironment(() => {
          if (process.env.METEOR_PRINT_ON_LISTEN) {
            console.log("LISTENING");
          }

          const callbacks = onListeningCallbacks;
          onListeningCallbacks = null;
          callbacks.forEach(callback => {
            callback();
          });
        }, e => {
          console.error("Error listening:", e);
          console.error(e && e.stack);
        }));
      };

      let localPort = process.env.PORT || 0;
      const unixSocketPath = process.env.UNIX_SOCKET_PATH;

      if (unixSocketPath) {
        // Start the HTTP server using a socket file.
        removeExistingSocketFile(unixSocketPath);
        startHttpServer({
          path: unixSocketPath
        });
        registerSocketFileCleanup(unixSocketPath);
      } else {
        localPort = isNaN(Number(localPort)) ? localPort : Number(localPort);

        if (/\\\\?.+\\pipe\\?.+/.test(localPort)) {
          // Start the HTTP server using Windows Server style named pipe.
          startHttpServer({
            path: localPort
          });
        } else if (typeof localPort === "number") {
          // Start the HTTP server using TCP.
          startHttpServer({
            port: localPort,
            host: process.env.BIND_IP || "0.0.0.0"
          });
        } else {
          throw new Error("Invalid PORT specified");
        }
      }

      return "DAEMON";
    };
  }

  var inlineScriptsAllowed = true;

  WebAppInternals.inlineScriptsAllowed = function () {
    return inlineScriptsAllowed;
  };

  WebAppInternals.setInlineScriptsAllowed = function (value) {
    inlineScriptsAllowed = value;
    WebAppInternals.generateBoilerplate();
  };

  var sriMode;

  WebAppInternals.enableSubresourceIntegrity = function () {
    let use_credentials = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    sriMode = use_credentials ? 'use-credentials' : 'anonymous';
    WebAppInternals.generateBoilerplate();
  };

  WebAppInternals.setBundledJsCssUrlRewriteHook = function (hookFn) {
    bundledJsCssUrlRewriteHook = hookFn;
    WebAppInternals.generateBoilerplate();
  };

  WebAppInternals.setBundledJsCssPrefix = function (prefix) {
    var self = this;
    self.setBundledJsCssUrlRewriteHook(function (url) {
      return prefix + url;
    });
  }; // Packages can call `WebAppInternals.addStaticJs` to specify static
  // JavaScript to be included in the app. This static JS will be inlined,
  // unless inline scripts have been disabled, in which case it will be
  // served under `/<sha1 of contents>`.


  var additionalStaticJs = {};

  WebAppInternals.addStaticJs = function (contents) {
    additionalStaticJs["/" + sha1(contents) + ".js"] = contents;
  }; // Exported for tests


  WebAppInternals.getBoilerplate = getBoilerplate;
  WebAppInternals.additionalStaticJs = additionalStaticJs; // Start the server!

  runWebAppServer();
}.call(this, module);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"connect.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/webapp/connect.js                                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  connect: () => connect
});
let npmConnect;
module.link("connect", {
  default(v) {
    npmConnect = v;
  }

}, 0);

function connect() {
  for (var _len = arguments.length, connectArgs = new Array(_len), _key = 0; _key < _len; _key++) {
    connectArgs[_key] = arguments[_key];
  }

  const handlers = npmConnect.apply(this, connectArgs);
  const originalUse = handlers.use; // Wrap the handlers.use method so that any provided handler functions
  // alway run in a Fiber.

  handlers.use = function use() {
    for (var _len2 = arguments.length, useArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      useArgs[_key2] = arguments[_key2];
    }

    const {
      stack
    } = this;
    const originalLength = stack.length;
    const result = originalUse.apply(this, useArgs); // If we just added anything to the stack, wrap each new entry.handle
    // with a function that calls Promise.asyncApply to ensure the
    // original handler runs in a Fiber.

    for (let i = originalLength; i < stack.length; ++i) {
      const entry = stack[i];
      const originalHandle = entry.handle;

      if (originalHandle.length >= 4) {
        // If the original handle had four (or more) parameters, the
        // wrapper must also have four parameters, since connect uses
        // handle.length to dermine whether to pass the error as the first
        // argument to the handle function.
        entry.handle = function handle(err, req, res, next) {
          return Promise.asyncApply(originalHandle, this, arguments);
        };
      } else {
        entry.handle = function handle(req, res, next) {
          return Promise.asyncApply(originalHandle, this, arguments);
        };
      }
    }

    return result;
  };

  return handlers;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"socket_file.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/webapp/socket_file.js                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  removeExistingSocketFile: () => removeExistingSocketFile,
  registerSocketFileCleanup: () => registerSocketFileCleanup
});
let statSync, unlinkSync, existsSync;
module.link("fs", {
  statSync(v) {
    statSync = v;
  },

  unlinkSync(v) {
    unlinkSync = v;
  },

  existsSync(v) {
    existsSync = v;
  }

}, 0);

const removeExistingSocketFile = socketPath => {
  try {
    if (statSync(socketPath).isSocket()) {
      // Since a new socket file will be created, remove the existing
      // file.
      unlinkSync(socketPath);
    } else {
      throw new Error("An existing file was found at \"".concat(socketPath, "\" and it is not ") + 'a socket file. Please confirm PORT is pointing to valid and ' + 'un-used socket file path.');
    }
  } catch (error) {
    // If there is no existing socket file to cleanup, great, we'll
    // continue normally. If the caught exception represents any other
    // issue, re-throw.
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

const registerSocketFileCleanup = function (socketPath) {
  let eventEmitter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process;
  ['exit', 'SIGINT', 'SIGHUP', 'SIGTERM'].forEach(signal => {
    eventEmitter.on(signal, Meteor.bindEnvironment(() => {
      if (existsSync(socketPath)) {
        unlinkSync(socketPath);
      }
    }));
  });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"connect":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/connect/package.json                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "connect",
  "version": "3.6.5"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/connect/index.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"compression":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/compression/package.json                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "compression",
  "version": "1.7.1"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/compression/index.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"cookie-parser":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/cookie-parser/package.json                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "cookie-parser",
  "version": "1.4.3"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/cookie-parser/index.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"qs":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/qs/package.json                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "qs",
  "version": "6.4.0",
  "main": "lib/index.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/qs/lib/index.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"parseurl":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/parseurl/package.json                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "parseurl",
  "version": "1.3.2"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/parseurl/index.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"basic-auth-connect":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/basic-auth-connect/package.json                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "basic-auth-connect",
  "version": "1.0.0"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/basic-auth-connect/index.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"useragent":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/useragent/package.json                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "useragent",
  "version": "2.3.0",
  "main": "./index.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/useragent/index.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"send":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/send/package.json                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "send",
  "version": "0.16.1"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/send/index.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/webapp/webapp_server.js");

/* Exports */
Package._define("webapp", exports, {
  WebApp: WebApp,
  WebAppInternals: WebAppInternals,
  main: main
});

})();

//# sourceURL=meteor://💻app/packages/webapp.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvd2ViYXBwL3dlYmFwcF9zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3dlYmFwcC9jb25uZWN0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy93ZWJhcHAvc29ja2V0X2ZpbGUuanMiXSwibmFtZXMiOlsiX29iamVjdFNwcmVhZCIsIm1vZHVsZTEiLCJsaW5rIiwiZGVmYXVsdCIsInYiLCJleHBvcnQiLCJXZWJBcHAiLCJXZWJBcHBJbnRlcm5hbHMiLCJhc3NlcnQiLCJyZWFkRmlsZVN5bmMiLCJjcmVhdGVTZXJ2ZXIiLCJwYXRoSm9pbiIsInBhdGhEaXJuYW1lIiwiam9pbiIsImRpcm5hbWUiLCJwYXJzZVVybCIsInBhcnNlIiwiY3JlYXRlSGFzaCIsImNvbm5lY3QiLCJjb21wcmVzcyIsImNvb2tpZVBhcnNlciIsInFzIiwicGFyc2VSZXF1ZXN0IiwiYmFzaWNBdXRoIiwibG9va3VwVXNlckFnZW50IiwibG9va3VwIiwiaXNNb2Rlcm4iLCJzZW5kIiwicmVtb3ZlRXhpc3RpbmdTb2NrZXRGaWxlIiwicmVnaXN0ZXJTb2NrZXRGaWxlQ2xlYW51cCIsIm9uTWVzc2FnZSIsIlNIT1JUX1NPQ0tFVF9USU1FT1VUIiwiTE9OR19TT0NLRVRfVElNRU9VVCIsImhhc093biIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiTnBtTW9kdWxlcyIsInZlcnNpb24iLCJOcG0iLCJyZXF1aXJlIiwibW9kdWxlIiwiZGVmYXVsdEFyY2giLCJjbGllbnRQcm9ncmFtcyIsImFyY2hQYXRoIiwiYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2siLCJ1cmwiLCJidW5kbGVkUHJlZml4IiwiX19tZXRlb3JfcnVudGltZV9jb25maWdfXyIsIlJPT1RfVVJMX1BBVEhfUFJFRklYIiwic2hhMSIsImNvbnRlbnRzIiwiaGFzaCIsInVwZGF0ZSIsImRpZ2VzdCIsInNob3VsZENvbXByZXNzIiwicmVxIiwicmVzIiwiaGVhZGVycyIsImZpbHRlciIsImNhbWVsQ2FzZSIsIm5hbWUiLCJwYXJ0cyIsInNwbGl0IiwidG9Mb3dlckNhc2UiLCJpIiwibGVuZ3RoIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJpZGVudGlmeUJyb3dzZXIiLCJ1c2VyQWdlbnRTdHJpbmciLCJ1c2VyQWdlbnQiLCJmYW1pbHkiLCJtYWpvciIsIm1pbm9yIiwicGF0Y2giLCJjYXRlZ29yaXplUmVxdWVzdCIsIl8iLCJleHRlbmQiLCJicm93c2VyIiwicGljayIsImh0bWxBdHRyaWJ1dGVIb29rcyIsImdldEh0bWxBdHRyaWJ1dGVzIiwicmVxdWVzdCIsImNvbWJpbmVkQXR0cmlidXRlcyIsImVhY2giLCJob29rIiwiYXR0cmlidXRlcyIsIkVycm9yIiwiYWRkSHRtbEF0dHJpYnV0ZUhvb2siLCJwdXNoIiwiYXBwVXJsIiwiUm91dGVQb2xpY3kiLCJjbGFzc2lmeSIsIk1ldGVvciIsInN0YXJ0dXAiLCJnZXR0ZXIiLCJrZXkiLCJhcmNoIiwicHJvZ3JhbSIsInZhbHVlIiwiY2FsY3VsYXRlQ2xpZW50SGFzaCIsImNsaWVudEhhc2giLCJjYWxjdWxhdGVDbGllbnRIYXNoUmVmcmVzaGFibGUiLCJjYWxjdWxhdGVDbGllbnRIYXNoTm9uUmVmcmVzaGFibGUiLCJnZXRSZWZyZXNoYWJsZUFzc2V0cyIsIl90aW1lb3V0QWRqdXN0bWVudFJlcXVlc3RDYWxsYmFjayIsInNldFRpbWVvdXQiLCJmaW5pc2hMaXN0ZW5lcnMiLCJsaXN0ZW5lcnMiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJvbiIsImwiLCJib2lsZXJwbGF0ZUJ5QXJjaCIsImJvaWxlcnBsYXRlRGF0YUNhbGxiYWNrcyIsImNyZWF0ZSIsInJlZ2lzdGVyQm9pbGVycGxhdGVEYXRhQ2FsbGJhY2siLCJjYWxsYmFjayIsInByZXZpb3VzQ2FsbGJhY2siLCJzdHJpY3RFcXVhbCIsImdldEJvaWxlcnBsYXRlIiwiZ2V0Qm9pbGVycGxhdGVBc3luYyIsImF3YWl0IiwiYm9pbGVycGxhdGUiLCJkYXRhIiwiYXNzaWduIiwiYmFzZURhdGEiLCJodG1sQXR0cmlidXRlcyIsIm1hZGVDaGFuZ2VzIiwicHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwia2V5cyIsImZvckVhY2giLCJ0aGVuIiwicmVzdWx0Iiwic3RyZWFtIiwidG9IVE1MU3RyZWFtIiwic3RhdHVzQ29kZSIsImdlbmVyYXRlQm9pbGVycGxhdGVJbnN0YW5jZSIsIm1hbmlmZXN0IiwiYWRkaXRpb25hbE9wdGlvbnMiLCJydW50aW1lQ29uZmlnIiwiY2xvbmUiLCJydW50aW1lQ29uZmlnT3ZlcnJpZGVzIiwiQm9pbGVycGxhdGUiLCJwYXRoTWFwcGVyIiwiaXRlbVBhdGgiLCJiYXNlRGF0YUV4dGVuc2lvbiIsImFkZGl0aW9uYWxTdGF0aWNKcyIsIm1hcCIsInBhdGhuYW1lIiwibWV0ZW9yUnVudGltZUNvbmZpZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbmNvZGVVUklDb21wb25lbnQiLCJyb290VXJsUGF0aFByZWZpeCIsInNyaU1vZGUiLCJpbmxpbmVTY3JpcHRzQWxsb3dlZCIsImlubGluZSIsInN0YXRpY0ZpbGVzTWlkZGxld2FyZSIsInN0YXRpY0ZpbGVzQnlBcmNoIiwibmV4dCIsIm1ldGhvZCIsImRlY29kZVVSSUNvbXBvbmVudCIsImUiLCJzZXJ2ZVN0YXRpY0pzIiwicyIsIndyaXRlSGVhZCIsIndyaXRlIiwiZW5kIiwiaGFzIiwicGF0aCIsImdldEFyY2hBbmRQYXRoIiwicGF1c2VkIiwiaW5mbyIsImdldFN0YXRpY0ZpbGVJbmZvIiwibWF4QWdlIiwiY2FjaGVhYmxlIiwic2V0SGVhZGVyIiwic291cmNlTWFwVXJsIiwidHlwZSIsImNvbnRlbnQiLCJhYnNvbHV0ZVBhdGgiLCJtYXhhZ2UiLCJkb3RmaWxlcyIsImxhc3RNb2RpZmllZCIsImVyciIsIkxvZyIsImVycm9yIiwicGlwZSIsIm9yaWdpbmFsUGF0aCIsImNhbGwiLCJzdGF0aWNBcmNoTGlzdCIsImFyY2hJbmRleCIsImluZGV4T2YiLCJ1bnNoaWZ0Iiwic3BsaWNlIiwic29tZSIsInN0YXRpY0ZpbGVzIiwiZmluYWxpemUiLCJwYXRoUGFydHMiLCJhcmNoS2V5Iiwic3RhcnRzV2l0aCIsImFyY2hDbGVhbmVkIiwic2xpY2UiLCJwYXJzZVBvcnQiLCJwb3J0IiwicGFyc2VkUG9ydCIsInBhcnNlSW50IiwiTnVtYmVyIiwiaXNOYU4iLCJwYXVzZUNsaWVudCIsImdlbmVyYXRlQ2xpZW50UHJvZ3JhbSIsInJ1bldlYkFwcFNlcnZlciIsInNodXR0aW5nRG93biIsInN5bmNRdWV1ZSIsIl9TeW5jaHJvbm91c1F1ZXVlIiwiZ2V0SXRlbVBhdGhuYW1lIiwiaXRlbVVybCIsInJlbG9hZENsaWVudFByb2dyYW1zIiwicnVuVGFzayIsImNvbmZpZ0pzb24iLCJfX21ldGVvcl9ib290c3RyYXBfXyIsImNsaWVudEFyY2hzIiwiY2xpZW50UGF0aHMiLCJzdGFjayIsInByb2Nlc3MiLCJleGl0IiwidW5wYXVzZSIsImNsaWVudERpciIsInNlcnZlckRpciIsInByb2dyYW1Kc29uUGF0aCIsInByb2dyYW1Kc29uIiwiY29kZSIsImZvcm1hdCIsIml0ZW0iLCJ3aGVyZSIsInNvdXJjZU1hcCIsIlBVQkxJQ19TRVRUSU5HUyIsImNvbmZpZ092ZXJyaWRlcyIsIm9sZFByb2dyYW0iLCJuZXdQcm9ncmFtIiwiV2ViQXBwSGFzaGluZyIsInZlcnNpb25SZWZyZXNoYWJsZSIsInZlcnNpb25Ob25SZWZyZXNoYWJsZSIsImNvcmRvdmFDb21wYXRpYmlsaXR5VmVyc2lvbnMiLCJtYW5pZmVzdFVybFByZWZpeCIsInJlcGxhY2UiLCJtYW5pZmVzdFVybCIsIlBhY2thZ2UiLCJhdXRvdXBkYXRlIiwiQVVUT1VQREFURV9WRVJTSU9OIiwiQXV0b3VwZGF0ZSIsImF1dG91cGRhdGVWZXJzaW9uIiwiZW52IiwiZ2VuZXJhdGVCb2lsZXJwbGF0ZUZvckFyY2giLCJkZWZhdWx0T3B0aW9uc0ZvckFyY2giLCJERFBfREVGQVVMVF9DT05ORUNUSU9OX1VSTCIsIk1PQklMRV9ERFBfVVJMIiwiYWJzb2x1dGVVcmwiLCJST09UX1VSTCIsIk1PQklMRV9ST09UX1VSTCIsImdlbmVyYXRlQm9pbGVycGxhdGUiLCJyZWZyZXNoYWJsZUFzc2V0cyIsImNzcyIsImZpbGUiLCJhcHAiLCJyYXdDb25uZWN0SGFuZGxlcnMiLCJ1c2UiLCJpc1ZhbGlkVXJsIiwicmVzcG9uc2UiLCJxdWVyeSIsImdldFBhdGhQYXJ0cyIsInNoaWZ0IiwiaXNQcmVmaXhPZiIsInByZWZpeCIsImFycmF5IiwiZXZlcnkiLCJwYXJ0IiwicGF0aFByZWZpeCIsInByZWZpeFBhcnRzIiwibWV0ZW9ySW50ZXJuYWxIYW5kbGVycyIsInBhY2thZ2VBbmRBcHBIYW5kbGVycyIsInN1cHByZXNzQ29ubmVjdEVycm9ycyIsInN0YXR1cyIsIm5ld0hlYWRlcnMiLCJjYXRjaCIsImh0dHBTZXJ2ZXIiLCJvbkxpc3RlbmluZ0NhbGxiYWNrcyIsInNvY2tldCIsImRlc3Ryb3llZCIsIm1lc3NhZ2UiLCJkZXN0cm95IiwiY29ubmVjdEhhbmRsZXJzIiwiY29ubmVjdEFwcCIsIm9uTGlzdGVuaW5nIiwiZiIsInN0YXJ0TGlzdGVuaW5nIiwibGlzdGVuT3B0aW9ucyIsImNiIiwibGlzdGVuIiwiZXhwb3J0cyIsIm1haW4iLCJhcmd2Iiwic3RhcnRIdHRwU2VydmVyIiwiYmluZEVudmlyb25tZW50IiwiTUVURU9SX1BSSU5UX09OX0xJU1RFTiIsImNvbnNvbGUiLCJsb2ciLCJjYWxsYmFja3MiLCJsb2NhbFBvcnQiLCJQT1JUIiwidW5peFNvY2tldFBhdGgiLCJVTklYX1NPQ0tFVF9QQVRIIiwidGVzdCIsImhvc3QiLCJCSU5EX0lQIiwic2V0SW5saW5lU2NyaXB0c0FsbG93ZWQiLCJlbmFibGVTdWJyZXNvdXJjZUludGVncml0eSIsInVzZV9jcmVkZW50aWFscyIsInNldEJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rIiwiaG9va0ZuIiwic2V0QnVuZGxlZEpzQ3NzUHJlZml4Iiwic2VsZiIsImFkZFN0YXRpY0pzIiwibnBtQ29ubmVjdCIsImNvbm5lY3RBcmdzIiwiaGFuZGxlcnMiLCJhcHBseSIsIm9yaWdpbmFsVXNlIiwidXNlQXJncyIsIm9yaWdpbmFsTGVuZ3RoIiwiZW50cnkiLCJvcmlnaW5hbEhhbmRsZSIsImhhbmRsZSIsImFzeW5jQXBwbHkiLCJhcmd1bWVudHMiLCJzdGF0U3luYyIsInVubGlua1N5bmMiLCJleGlzdHNTeW5jIiwic29ja2V0UGF0aCIsImlzU29ja2V0IiwiZXZlbnRFbWl0dGVyIiwic2lnbmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFJQSxhQUFKOztBQUFrQkMsU0FBTyxDQUFDQyxJQUFSLENBQWEsc0NBQWIsRUFBb0Q7QUFBQ0MsV0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0osbUJBQWEsR0FBQ0ksQ0FBZDtBQUFnQjs7QUFBNUIsR0FBcEQsRUFBa0YsQ0FBbEY7QUFBbEJILFNBQU8sQ0FBQ0ksTUFBUixDQUFlO0FBQUNDLFVBQU0sRUFBQyxNQUFJQSxNQUFaO0FBQW1CQyxtQkFBZSxFQUFDLE1BQUlBO0FBQXZDLEdBQWY7QUFBd0UsTUFBSUMsTUFBSjtBQUFXUCxTQUFPLENBQUNDLElBQVIsQ0FBYSxRQUFiLEVBQXNCO0FBQUNDLFdBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNJLFlBQU0sR0FBQ0osQ0FBUDtBQUFTOztBQUFyQixHQUF0QixFQUE2QyxDQUE3QztBQUFnRCxNQUFJSyxZQUFKO0FBQWlCUixTQUFPLENBQUNDLElBQVIsQ0FBYSxJQUFiLEVBQWtCO0FBQUNPLGdCQUFZLENBQUNMLENBQUQsRUFBRztBQUFDSyxrQkFBWSxHQUFDTCxDQUFiO0FBQWU7O0FBQWhDLEdBQWxCLEVBQW9ELENBQXBEO0FBQXVELE1BQUlNLFlBQUo7QUFBaUJULFNBQU8sQ0FBQ0MsSUFBUixDQUFhLE1BQWIsRUFBb0I7QUFBQ1EsZ0JBQVksQ0FBQ04sQ0FBRCxFQUFHO0FBQUNNLGtCQUFZLEdBQUNOLENBQWI7QUFBZTs7QUFBaEMsR0FBcEIsRUFB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eUIzSixNQUFNd0Isd0JBQXdCLEdBQUkwVCxVQUFELElBQWdCO0FBQ3RELE1BQUk7QUFDRixRQUFJSCxRQUFRLENBQUNHLFVBQUQsQ0FBUixDQUFxQkMsUUFBckIsRUFBSixFQUFxQztBQUNuQztBQUNBO0FBQ0FILGdCQUFVLENBQUNFLFVBQUQsQ0FBVjtBQUNELEtBSkQsTUFJTztBQUNMLFlBQU0sSUFBSTdQLEtBQUosQ0FDSiwwQ0FBa0M2UCxVQUFsQyx5QkFDQSw4REFEQSxHQUVBLDJCQUhJLENBQU47QUFLRDtBQUNGLEdBWkQsQ0FZRSxPQUFPeEosS0FBUCxFQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EsUUFBSUEsS0FBSyxDQUFDNkMsSUFBTixLQUFlLFFBQW5CLEVBQTZCO0FBQzNCLFlBQU03QyxLQUFOO0FBQ0Q7QUFDRjtBQUNGLENBckJNOztBQTBCQSxNQUFNaksseUJBQXlCLEdBQ3BDLFVBQUN5VCxVQUFELEVBQXdDO0FBQUEsTUFBM0JFLFlBQTJCLHVFQUFacEgsT0FBWTtBQUN0QyxHQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLFFBQW5CLEVBQTZCLFNBQTdCLEVBQXdDOUYsT0FBeEMsQ0FBZ0RtTixNQUFNLElBQUk7QUFDeERELGdCQUFZLENBQUN4TyxFQUFiLENBQWdCeU8sTUFBaEIsRUFBd0IxUCxNQUFNLENBQUNvTixlQUFQLENBQXVCLE1BQU07QUFDbkQsVUFBSWtDLFVBQVUsQ0FBQ0MsVUFBRCxDQUFkLEVBQTRCO0FBQzFCRixrQkFBVSxDQUFDRSxVQUFELENBQVY7QUFDRDtBQUNGLEtBSnVCLENBQXhCO0FBS0QsR0FORDtBQU9ELENBVEksQyIsImZpbGUiOiIvcGFja2FnZXMvd2ViYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFzc2VydCBmcm9tIFwiYXNzZXJ0XCI7XG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IGNyZWF0ZVNlcnZlciB9IGZyb20gXCJodHRwXCI7XG5pbXBvcnQge1xuICBqb2luIGFzIHBhdGhKb2luLFxuICBkaXJuYW1lIGFzIHBhdGhEaXJuYW1lLFxufSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcGFyc2UgYXMgcGFyc2VVcmwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBjcmVhdGVIYXNoIH0gZnJvbSBcImNyeXB0b1wiO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gXCIuL2Nvbm5lY3QuanNcIjtcbmltcG9ydCBjb21wcmVzcyBmcm9tIFwiY29tcHJlc3Npb25cIjtcbmltcG9ydCBjb29raWVQYXJzZXIgZnJvbSBcImNvb2tpZS1wYXJzZXJcIjtcbmltcG9ydCBxcyBmcm9tIFwicXNcIjtcbmltcG9ydCBwYXJzZVJlcXVlc3QgZnJvbSBcInBhcnNldXJsXCI7XG5pbXBvcnQgYmFzaWNBdXRoIGZyb20gXCJiYXNpYy1hdXRoLWNvbm5lY3RcIjtcbmltcG9ydCB7IGxvb2t1cCBhcyBsb29rdXBVc2VyQWdlbnQgfSBmcm9tIFwidXNlcmFnZW50XCI7XG5pbXBvcnQgeyBpc01vZGVybiB9IGZyb20gXCJtZXRlb3IvbW9kZXJuLWJyb3dzZXJzXCI7XG5pbXBvcnQgc2VuZCBmcm9tIFwic2VuZFwiO1xuaW1wb3J0IHtcbiAgcmVtb3ZlRXhpc3RpbmdTb2NrZXRGaWxlLFxuICByZWdpc3RlclNvY2tldEZpbGVDbGVhbnVwLFxufSBmcm9tICcuL3NvY2tldF9maWxlLmpzJztcblxudmFyIFNIT1JUX1NPQ0tFVF9USU1FT1VUID0gNSoxMDAwO1xudmFyIExPTkdfU09DS0VUX1RJTUVPVVQgPSAxMjAqMTAwMDtcblxuZXhwb3J0IGNvbnN0IFdlYkFwcCA9IHt9O1xuZXhwb3J0IGNvbnN0IFdlYkFwcEludGVybmFscyA9IHt9O1xuXG5jb25zdCBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vLyBiYWNrd2FyZHMgY29tcGF0IHRvIDIuMCBvZiBjb25uZWN0XG5jb25uZWN0LmJhc2ljQXV0aCA9IGJhc2ljQXV0aDtcblxuV2ViQXBwSW50ZXJuYWxzLk5wbU1vZHVsZXMgPSB7XG4gIGNvbm5lY3Q6IHtcbiAgICB2ZXJzaW9uOiBOcG0ucmVxdWlyZSgnY29ubmVjdC9wYWNrYWdlLmpzb24nKS52ZXJzaW9uLFxuICAgIG1vZHVsZTogY29ubmVjdCxcbiAgfVxufTtcblxuLy8gVGhvdWdoIHdlIG1pZ2h0IHByZWZlciB0byB1c2Ugd2ViLmJyb3dzZXIgKG1vZGVybikgYXMgdGhlIGRlZmF1bHRcbi8vIGFyY2hpdGVjdHVyZSwgc2FmZXR5IHJlcXVpcmVzIGEgbW9yZSBjb21wYXRpYmxlIGRlZmF1bHRBcmNoLlxuV2ViQXBwLmRlZmF1bHRBcmNoID0gJ3dlYi5icm93c2VyLmxlZ2FjeSc7XG5cbi8vIFhYWCBtYXBzIGFyY2hzIHRvIG1hbmlmZXN0c1xuV2ViQXBwLmNsaWVudFByb2dyYW1zID0ge307XG5cbi8vIFhYWCBtYXBzIGFyY2hzIHRvIHByb2dyYW0gcGF0aCBvbiBmaWxlc3lzdGVtXG52YXIgYXJjaFBhdGggPSB7fTtcblxudmFyIGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rID0gZnVuY3Rpb24gKHVybCkge1xuICB2YXIgYnVuZGxlZFByZWZpeCA9XG4gICAgIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggfHwgJyc7XG4gIHJldHVybiBidW5kbGVkUHJlZml4ICsgdXJsO1xufTtcblxudmFyIHNoYTEgPSBmdW5jdGlvbiAoY29udGVudHMpIHtcbiAgdmFyIGhhc2ggPSBjcmVhdGVIYXNoKCdzaGExJyk7XG4gIGhhc2gudXBkYXRlKGNvbnRlbnRzKTtcbiAgcmV0dXJuIGhhc2guZGlnZXN0KCdoZXgnKTtcbn07XG5cbiBmdW5jdGlvbiBzaG91bGRDb21wcmVzcyhyZXEsIHJlcykge1xuICBpZiAocmVxLmhlYWRlcnNbJ3gtbm8tY29tcHJlc3Npb24nXSkge1xuICAgIC8vIGRvbid0IGNvbXByZXNzIHJlc3BvbnNlcyB3aXRoIHRoaXMgcmVxdWVzdCBoZWFkZXJcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBmYWxsYmFjayB0byBzdGFuZGFyZCBmaWx0ZXIgZnVuY3Rpb25cbiAgcmV0dXJuIGNvbXByZXNzLmZpbHRlcihyZXEsIHJlcyk7XG59O1xuXG4vLyAjQnJvd3NlcklkZW50aWZpY2F0aW9uXG4vL1xuLy8gV2UgaGF2ZSBtdWx0aXBsZSBwbGFjZXMgdGhhdCB3YW50IHRvIGlkZW50aWZ5IHRoZSBicm93c2VyOiB0aGVcbi8vIHVuc3VwcG9ydGVkIGJyb3dzZXIgcGFnZSwgdGhlIGFwcGNhY2hlIHBhY2thZ2UsIGFuZCwgZXZlbnR1YWxseVxuLy8gZGVsaXZlcmluZyBicm93c2VyIHBvbHlmaWxscyBvbmx5IGFzIG5lZWRlZC5cbi8vXG4vLyBUbyBhdm9pZCBkZXRlY3RpbmcgdGhlIGJyb3dzZXIgaW4gbXVsdGlwbGUgcGxhY2VzIGFkLWhvYywgd2UgY3JlYXRlIGFcbi8vIE1ldGVvciBcImJyb3dzZXJcIiBvYmplY3QuIEl0IHVzZXMgYnV0IGRvZXMgbm90IGV4cG9zZSB0aGUgbnBtXG4vLyB1c2VyYWdlbnQgbW9kdWxlICh3ZSBjb3VsZCBjaG9vc2UgYSBkaWZmZXJlbnQgbWVjaGFuaXNtIHRvIGlkZW50aWZ5XG4vLyB0aGUgYnJvd3NlciBpbiB0aGUgZnV0dXJlIGlmIHdlIHdhbnRlZCB0bykuICBUaGUgYnJvd3NlciBvYmplY3Rcbi8vIGNvbnRhaW5zXG4vL1xuLy8gKiBgbmFtZWA6IHRoZSBuYW1lIG9mIHRoZSBicm93c2VyIGluIGNhbWVsIGNhc2Vcbi8vICogYG1ham9yYCwgYG1pbm9yYCwgYHBhdGNoYDogaW50ZWdlcnMgZGVzY3JpYmluZyB0aGUgYnJvd3NlciB2ZXJzaW9uXG4vL1xuLy8gQWxzbyBoZXJlIGlzIGFuIGVhcmx5IHZlcnNpb24gb2YgYSBNZXRlb3IgYHJlcXVlc3RgIG9iamVjdCwgaW50ZW5kZWRcbi8vIHRvIGJlIGEgaGlnaC1sZXZlbCBkZXNjcmlwdGlvbiBvZiB0aGUgcmVxdWVzdCB3aXRob3V0IGV4cG9zaW5nXG4vLyBkZXRhaWxzIG9mIGNvbm5lY3QncyBsb3ctbGV2ZWwgYHJlcWAuICBDdXJyZW50bHkgaXQgY29udGFpbnM6XG4vL1xuLy8gKiBgYnJvd3NlcmA6IGJyb3dzZXIgaWRlbnRpZmljYXRpb24gb2JqZWN0IGRlc2NyaWJlZCBhYm92ZVxuLy8gKiBgdXJsYDogcGFyc2VkIHVybCwgaW5jbHVkaW5nIHBhcnNlZCBxdWVyeSBwYXJhbXNcbi8vXG4vLyBBcyBhIHRlbXBvcmFyeSBoYWNrIHRoZXJlIGlzIGEgYGNhdGVnb3JpemVSZXF1ZXN0YCBmdW5jdGlvbiBvbiBXZWJBcHAgd2hpY2hcbi8vIGNvbnZlcnRzIGEgY29ubmVjdCBgcmVxYCB0byBhIE1ldGVvciBgcmVxdWVzdGAuIFRoaXMgY2FuIGdvIGF3YXkgb25jZSBzbWFydFxuLy8gcGFja2FnZXMgc3VjaCBhcyBhcHBjYWNoZSBhcmUgYmVpbmcgcGFzc2VkIGEgYHJlcXVlc3RgIG9iamVjdCBkaXJlY3RseSB3aGVuXG4vLyB0aGV5IHNlcnZlIGNvbnRlbnQuXG4vL1xuLy8gVGhpcyBhbGxvd3MgYHJlcXVlc3RgIHRvIGJlIHVzZWQgdW5pZm9ybWx5OiBpdCBpcyBwYXNzZWQgdG8gdGhlIGh0bWxcbi8vIGF0dHJpYnV0ZXMgaG9vaywgYW5kIHRoZSBhcHBjYWNoZSBwYWNrYWdlIGNhbiB1c2UgaXQgd2hlbiBkZWNpZGluZ1xuLy8gd2hldGhlciB0byBnZW5lcmF0ZSBhIDQwNCBmb3IgdGhlIG1hbmlmZXN0LlxuLy9cbi8vIFJlYWwgcm91dGluZyAvIHNlcnZlciBzaWRlIHJlbmRlcmluZyB3aWxsIHByb2JhYmx5IHJlZmFjdG9yIHRoaXNcbi8vIGhlYXZpbHkuXG5cblxuLy8gZS5nLiBcIk1vYmlsZSBTYWZhcmlcIiA9PiBcIm1vYmlsZVNhZmFyaVwiXG52YXIgY2FtZWxDYXNlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIHBhcnRzID0gbmFtZS5zcGxpdCgnICcpO1xuICBwYXJ0c1swXSA9IHBhcnRzWzBdLnRvTG93ZXJDYXNlKCk7XG4gIGZvciAodmFyIGkgPSAxOyAgaSA8IHBhcnRzLmxlbmd0aDsgICsraSkge1xuICAgIHBhcnRzW2ldID0gcGFydHNbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwYXJ0c1tpXS5zdWJzdHIoMSk7XG4gIH1cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpO1xufTtcblxudmFyIGlkZW50aWZ5QnJvd3NlciA9IGZ1bmN0aW9uICh1c2VyQWdlbnRTdHJpbmcpIHtcbiAgdmFyIHVzZXJBZ2VudCA9IGxvb2t1cFVzZXJBZ2VudCh1c2VyQWdlbnRTdHJpbmcpO1xuICByZXR1cm4ge1xuICAgIG5hbWU6IGNhbWVsQ2FzZSh1c2VyQWdlbnQuZmFtaWx5KSxcbiAgICBtYWpvcjogK3VzZXJBZ2VudC5tYWpvcixcbiAgICBtaW5vcjogK3VzZXJBZ2VudC5taW5vcixcbiAgICBwYXRjaDogK3VzZXJBZ2VudC5wYXRjaFxuICB9O1xufTtcblxuLy8gWFhYIFJlZmFjdG9yIGFzIHBhcnQgb2YgaW1wbGVtZW50aW5nIHJlYWwgcm91dGluZy5cbldlYkFwcEludGVybmFscy5pZGVudGlmeUJyb3dzZXIgPSBpZGVudGlmeUJyb3dzZXI7XG5cbldlYkFwcC5jYXRlZ29yaXplUmVxdWVzdCA9IGZ1bmN0aW9uIChyZXEpIHtcbiAgcmV0dXJuIF8uZXh0ZW5kKHtcbiAgICBicm93c2VyOiBpZGVudGlmeUJyb3dzZXIocmVxLmhlYWRlcnNbJ3VzZXItYWdlbnQnXSksXG4gICAgdXJsOiBwYXJzZVVybChyZXEudXJsLCB0cnVlKVxuICB9LCBfLnBpY2socmVxLCAnZHluYW1pY0hlYWQnLCAnZHluYW1pY0JvZHknLCAnaGVhZGVycycsICdjb29raWVzJykpO1xufTtcblxuLy8gSFRNTCBhdHRyaWJ1dGUgaG9va3M6IGZ1bmN0aW9ucyB0byBiZSBjYWxsZWQgdG8gZGV0ZXJtaW5lIGFueSBhdHRyaWJ1dGVzIHRvXG4vLyBiZSBhZGRlZCB0byB0aGUgJzxodG1sPicgdGFnLiBFYWNoIGZ1bmN0aW9uIGlzIHBhc3NlZCBhICdyZXF1ZXN0JyBvYmplY3QgKHNlZVxuLy8gI0Jyb3dzZXJJZGVudGlmaWNhdGlvbikgYW5kIHNob3VsZCByZXR1cm4gbnVsbCBvciBvYmplY3QuXG52YXIgaHRtbEF0dHJpYnV0ZUhvb2tzID0gW107XG52YXIgZ2V0SHRtbEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAocmVxdWVzdCkge1xuICB2YXIgY29tYmluZWRBdHRyaWJ1dGVzICA9IHt9O1xuICBfLmVhY2goaHRtbEF0dHJpYnV0ZUhvb2tzIHx8IFtdLCBmdW5jdGlvbiAoaG9vaykge1xuICAgIHZhciBhdHRyaWJ1dGVzID0gaG9vayhyZXF1ZXN0KTtcbiAgICBpZiAoYXR0cmlidXRlcyA9PT0gbnVsbClcbiAgICAgIHJldHVybjtcbiAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMgIT09ICdvYmplY3QnKVxuICAgICAgdGhyb3cgRXJyb3IoXCJIVE1MIGF0dHJpYnV0ZSBob29rIG11c3QgcmV0dXJuIG51bGwgb3Igb2JqZWN0XCIpO1xuICAgIF8uZXh0ZW5kKGNvbWJpbmVkQXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG4gIH0pO1xuICByZXR1cm4gY29tYmluZWRBdHRyaWJ1dGVzO1xufTtcbldlYkFwcC5hZGRIdG1sQXR0cmlidXRlSG9vayA9IGZ1bmN0aW9uIChob29rKSB7XG4gIGh0bWxBdHRyaWJ1dGVIb29rcy5wdXNoKGhvb2spO1xufTtcblxuLy8gU2VydmUgYXBwIEhUTUwgZm9yIHRoaXMgVVJMP1xudmFyIGFwcFVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgaWYgKHVybCA9PT0gJy9mYXZpY29uLmljbycgfHwgdXJsID09PSAnL3JvYm90cy50eHQnKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBOT1RFOiBhcHAubWFuaWZlc3QgaXMgbm90IGEgd2ViIHN0YW5kYXJkIGxpa2UgZmF2aWNvbi5pY28gYW5kXG4gIC8vIHJvYm90cy50eHQuIEl0IGlzIGEgZmlsZSBuYW1lIHdlIGhhdmUgY2hvc2VuIHRvIHVzZSBmb3IgSFRNTDVcbiAgLy8gYXBwY2FjaGUgVVJMcy4gSXQgaXMgaW5jbHVkZWQgaGVyZSB0byBwcmV2ZW50IHVzaW5nIGFuIGFwcGNhY2hlXG4gIC8vIHRoZW4gcmVtb3ZpbmcgaXQgZnJvbSBwb2lzb25pbmcgYW4gYXBwIHBlcm1hbmVudGx5LiBFdmVudHVhbGx5LFxuICAvLyBvbmNlIHdlIGhhdmUgc2VydmVyIHNpZGUgcm91dGluZywgdGhpcyB3b24ndCBiZSBuZWVkZWQgYXNcbiAgLy8gdW5rbm93biBVUkxzIHdpdGggcmV0dXJuIGEgNDA0IGF1dG9tYXRpY2FsbHkuXG4gIGlmICh1cmwgPT09ICcvYXBwLm1hbmlmZXN0JylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gQXZvaWQgc2VydmluZyBhcHAgSFRNTCBmb3IgZGVjbGFyZWQgcm91dGVzIHN1Y2ggYXMgL3NvY2tqcy8uXG4gIGlmIChSb3V0ZVBvbGljeS5jbGFzc2lmeSh1cmwpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyB3ZSBjdXJyZW50bHkgcmV0dXJuIGFwcCBIVE1MIG9uIGFsbCBVUkxzIGJ5IGRlZmF1bHRcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5cbi8vIFdlIG5lZWQgdG8gY2FsY3VsYXRlIHRoZSBjbGllbnQgaGFzaCBhZnRlciBhbGwgcGFja2FnZXMgaGF2ZSBsb2FkZWRcbi8vIHRvIGdpdmUgdGhlbSBhIGNoYW5jZSB0byBwb3B1bGF0ZSBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlxuLy9cbi8vIENhbGN1bGF0aW5nIHRoZSBoYXNoIGR1cmluZyBzdGFydHVwIG1lYW5zIHRoYXQgcGFja2FnZXMgY2FuIG9ubHlcbi8vIHBvcHVsYXRlIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18gZHVyaW5nIGxvYWQsIG5vdCBkdXJpbmcgc3RhcnR1cC5cbi8vXG4vLyBDYWxjdWxhdGluZyBpbnN0ZWFkIGl0IGF0IHRoZSBiZWdpbm5pbmcgb2YgbWFpbiBhZnRlciBhbGwgc3RhcnR1cFxuLy8gaG9va3MgaGFkIHJ1biB3b3VsZCBhbGxvdyBwYWNrYWdlcyB0byBhbHNvIHBvcHVsYXRlXG4vLyBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIGR1cmluZyBzdGFydHVwLCBidXQgdGhhdCdzIHRvbyBsYXRlIGZvclxuLy8gYXV0b3VwZGF0ZSBiZWNhdXNlIGl0IG5lZWRzIHRvIGhhdmUgdGhlIGNsaWVudCBoYXNoIGF0IHN0YXJ0dXAgdG9cbi8vIGluc2VydCB0aGUgYXV0byB1cGRhdGUgdmVyc2lvbiBpdHNlbGYgaW50b1xuLy8gX19tZXRlb3JfcnVudGltZV9jb25maWdfXyB0byBnZXQgaXQgdG8gdGhlIGNsaWVudC5cbi8vXG4vLyBBbiBhbHRlcm5hdGl2ZSB3b3VsZCBiZSB0byBnaXZlIGF1dG91cGRhdGUgYSBcInBvc3Qtc3RhcnQsXG4vLyBwcmUtbGlzdGVuXCIgaG9vayB0byBhbGxvdyBpdCB0byBpbnNlcnQgdGhlIGF1dG8gdXBkYXRlIHZlcnNpb24gYXRcbi8vIHRoZSByaWdodCBtb21lbnQuXG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZ2V0dGVyKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYXJjaCkge1xuICAgICAgYXJjaCA9IGFyY2ggfHwgV2ViQXBwLmRlZmF1bHRBcmNoO1xuICAgICAgY29uc3QgcHJvZ3JhbSA9IFdlYkFwcC5jbGllbnRQcm9ncmFtc1thcmNoXTtcbiAgICAgIGNvbnN0IHZhbHVlID0gcHJvZ3JhbSAmJiBwcm9ncmFtW2tleV07XG4gICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIHdlIGhhdmUgY2FsY3VsYXRlZCB0aGlzIGhhc2gsXG4gICAgICAvLyBwcm9ncmFtW2tleV0gd2lsbCBiZSBhIHRodW5rIChsYXp5IGZ1bmN0aW9uIHdpdGggbm8gcGFyYW1ldGVycylcbiAgICAgIC8vIHRoYXQgd2Ugc2hvdWxkIGNhbGwgdG8gZG8gdGhlIGFjdHVhbCBjb21wdXRhdGlvbi5cbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICA/IHByb2dyYW1ba2V5XSA9IHZhbHVlKClcbiAgICAgICAgOiB2YWx1ZTtcbiAgICB9O1xuICB9XG5cbiAgV2ViQXBwLmNhbGN1bGF0ZUNsaWVudEhhc2ggPSBXZWJBcHAuY2xpZW50SGFzaCA9IGdldHRlcihcInZlcnNpb25cIik7XG4gIFdlYkFwcC5jYWxjdWxhdGVDbGllbnRIYXNoUmVmcmVzaGFibGUgPSBnZXR0ZXIoXCJ2ZXJzaW9uUmVmcmVzaGFibGVcIik7XG4gIFdlYkFwcC5jYWxjdWxhdGVDbGllbnRIYXNoTm9uUmVmcmVzaGFibGUgPSBnZXR0ZXIoXCJ2ZXJzaW9uTm9uUmVmcmVzaGFibGVcIik7XG4gIFdlYkFwcC5nZXRSZWZyZXNoYWJsZUFzc2V0cyA9IGdldHRlcihcInJlZnJlc2hhYmxlQXNzZXRzXCIpO1xufSk7XG5cblxuXG4vLyBXaGVuIHdlIGhhdmUgYSByZXF1ZXN0IHBlbmRpbmcsIHdlIHdhbnQgdGhlIHNvY2tldCB0aW1lb3V0IHRvIGJlIGxvbmcsIHRvXG4vLyBnaXZlIG91cnNlbHZlcyBhIHdoaWxlIHRvIHNlcnZlIGl0LCBhbmQgdG8gYWxsb3cgc29ja2pzIGxvbmcgcG9sbHMgdG9cbi8vIGNvbXBsZXRlLiAgT24gdGhlIG90aGVyIGhhbmQsIHdlIHdhbnQgdG8gY2xvc2UgaWRsZSBzb2NrZXRzIHJlbGF0aXZlbHlcbi8vIHF1aWNrbHksIHNvIHRoYXQgd2UgY2FuIHNodXQgZG93biByZWxhdGl2ZWx5IHByb21wdGx5IGJ1dCBjbGVhbmx5LCB3aXRob3V0XG4vLyBjdXR0aW5nIG9mZiBhbnlvbmUncyByZXNwb25zZS5cbldlYkFwcC5fdGltZW91dEFkanVzdG1lbnRSZXF1ZXN0Q2FsbGJhY2sgPSBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgLy8gdGhpcyBpcyByZWFsbHkganVzdCByZXEuc29ja2V0LnNldFRpbWVvdXQoTE9OR19TT0NLRVRfVElNRU9VVCk7XG4gIHJlcS5zZXRUaW1lb3V0KExPTkdfU09DS0VUX1RJTUVPVVQpO1xuICAvLyBJbnNlcnQgb3VyIG5ldyBmaW5pc2ggbGlzdGVuZXIgdG8gcnVuIEJFRk9SRSB0aGUgZXhpc3Rpbmcgb25lIHdoaWNoIHJlbW92ZXNcbiAgLy8gdGhlIHJlc3BvbnNlIGZyb20gdGhlIHNvY2tldC5cbiAgdmFyIGZpbmlzaExpc3RlbmVycyA9IHJlcy5saXN0ZW5lcnMoJ2ZpbmlzaCcpO1xuICAvLyBYWFggQXBwYXJlbnRseSBpbiBOb2RlIDAuMTIgdGhpcyBldmVudCB3YXMgY2FsbGVkICdwcmVmaW5pc2gnLlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvY29tbWl0LzdjOWI2MDcwXG4gIC8vIEJ1dCBpdCBoYXMgc3dpdGNoZWQgYmFjayB0byAnZmluaXNoJyBpbiBOb2RlIHY0OlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvcHVsbC8xNDExXG4gIHJlcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2ZpbmlzaCcpO1xuICByZXMub24oJ2ZpbmlzaCcsIGZ1bmN0aW9uICgpIHtcbiAgICByZXMuc2V0VGltZW91dChTSE9SVF9TT0NLRVRfVElNRU9VVCk7XG4gIH0pO1xuICBfLmVhY2goZmluaXNoTGlzdGVuZXJzLCBmdW5jdGlvbiAobCkgeyByZXMub24oJ2ZpbmlzaCcsIGwpOyB9KTtcbn07XG5cblxuLy8gV2lsbCBiZSB1cGRhdGVkIGJ5IG1haW4gYmVmb3JlIHdlIGxpc3Rlbi5cbi8vIE1hcCBmcm9tIGNsaWVudCBhcmNoIHRvIGJvaWxlcnBsYXRlIG9iamVjdC5cbi8vIEJvaWxlcnBsYXRlIG9iamVjdCBoYXM6XG4vLyAgIC0gZnVuYzogWFhYXG4vLyAgIC0gYmFzZURhdGE6IFhYWFxudmFyIGJvaWxlcnBsYXRlQnlBcmNoID0ge307XG5cbi8vIFJlZ2lzdGVyIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBjYW4gc2VsZWN0aXZlbHkgbW9kaWZ5IGJvaWxlcnBsYXRlXG4vLyBkYXRhIGdpdmVuIGFyZ3VtZW50cyAocmVxdWVzdCwgZGF0YSwgYXJjaCkuIFRoZSBrZXkgc2hvdWxkIGJlIGEgdW5pcXVlXG4vLyBpZGVudGlmaWVyLCB0byBwcmV2ZW50IGFjY3VtdWxhdGluZyBkdXBsaWNhdGUgY2FsbGJhY2tzIGZyb20gdGhlIHNhbWVcbi8vIGNhbGwgc2l0ZSBvdmVyIHRpbWUuIENhbGxiYWNrcyB3aWxsIGJlIGNhbGxlZCBpbiB0aGUgb3JkZXIgdGhleSB3ZXJlXG4vLyByZWdpc3RlcmVkLiBBIGNhbGxiYWNrIHNob3VsZCByZXR1cm4gZmFsc2UgaWYgaXQgZGlkIG5vdCBtYWtlIGFueVxuLy8gY2hhbmdlcyBhZmZlY3RpbmcgdGhlIGJvaWxlcnBsYXRlLiBQYXNzaW5nIG51bGwgZGVsZXRlcyB0aGUgY2FsbGJhY2suXG4vLyBBbnkgcHJldmlvdXMgY2FsbGJhY2sgcmVnaXN0ZXJlZCBmb3IgdGhpcyBrZXkgd2lsbCBiZSByZXR1cm5lZC5cbmNvbnN0IGJvaWxlcnBsYXRlRGF0YUNhbGxiYWNrcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5XZWJBcHBJbnRlcm5hbHMucmVnaXN0ZXJCb2lsZXJwbGF0ZURhdGFDYWxsYmFjayA9IGZ1bmN0aW9uIChrZXksIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHByZXZpb3VzQ2FsbGJhY2sgPSBib2lsZXJwbGF0ZURhdGFDYWxsYmFja3Nba2V5XTtcblxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBib2lsZXJwbGF0ZURhdGFDYWxsYmFja3Nba2V5XSA9IGNhbGxiYWNrO1xuICB9IGVsc2Uge1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbChjYWxsYmFjaywgbnVsbCk7XG4gICAgZGVsZXRlIGJvaWxlcnBsYXRlRGF0YUNhbGxiYWNrc1trZXldO1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBwcmV2aW91cyBjYWxsYmFjayBpbiBjYXNlIHRoZSBuZXcgY2FsbGJhY2sgbmVlZHMgdG8gY2FsbFxuICAvLyBpdDsgZm9yIGV4YW1wbGUsIHdoZW4gdGhlIG5ldyBjYWxsYmFjayBpcyBhIHdyYXBwZXIgZm9yIHRoZSBvbGQuXG4gIHJldHVybiBwcmV2aW91c0NhbGxiYWNrIHx8IG51bGw7XG59O1xuXG4vLyBHaXZlbiBhIHJlcXVlc3QgKGFzIHJldHVybmVkIGZyb20gYGNhdGVnb3JpemVSZXF1ZXN0YCksIHJldHVybiB0aGVcbi8vIGJvaWxlcnBsYXRlIEhUTUwgdG8gc2VydmUgZm9yIHRoYXQgcmVxdWVzdC5cbi8vXG4vLyBJZiBhIHByZXZpb3VzIGNvbm5lY3QgbWlkZGxld2FyZSBoYXMgcmVuZGVyZWQgY29udGVudCBmb3IgdGhlIGhlYWQgb3IgYm9keSxcbi8vIHJldHVybnMgdGhlIGJvaWxlcnBsYXRlIHdpdGggdGhhdCBjb250ZW50IHBhdGNoZWQgaW4gb3RoZXJ3aXNlXG4vLyBtZW1vaXplcyBvbiBIVE1MIGF0dHJpYnV0ZXMgKHVzZWQgYnksIGVnLCBhcHBjYWNoZSkgYW5kIHdoZXRoZXIgaW5saW5lXG4vLyBzY3JpcHRzIGFyZSBjdXJyZW50bHkgYWxsb3dlZC5cbi8vIFhYWCBzbyBmYXIgdGhpcyBmdW5jdGlvbiBpcyBhbHdheXMgY2FsbGVkIHdpdGggYXJjaCA9PT0gJ3dlYi5icm93c2VyJ1xuZnVuY3Rpb24gZ2V0Qm9pbGVycGxhdGUocmVxdWVzdCwgYXJjaCkge1xuICByZXR1cm4gZ2V0Qm9pbGVycGxhdGVBc3luYyhyZXF1ZXN0LCBhcmNoKS5hd2FpdCgpO1xufVxuXG5mdW5jdGlvbiBnZXRCb2lsZXJwbGF0ZUFzeW5jKHJlcXVlc3QsIGFyY2gpIHtcbiAgY29uc3QgYm9pbGVycGxhdGUgPSBib2lsZXJwbGF0ZUJ5QXJjaFthcmNoXTtcbiAgY29uc3QgZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIGJvaWxlcnBsYXRlLmJhc2VEYXRhLCB7XG4gICAgaHRtbEF0dHJpYnV0ZXM6IGdldEh0bWxBdHRyaWJ1dGVzKHJlcXVlc3QpLFxuICB9LCBfLnBpY2socmVxdWVzdCwgXCJkeW5hbWljSGVhZFwiLCBcImR5bmFtaWNCb2R5XCIpKTtcblxuICBsZXQgbWFkZUNoYW5nZXMgPSBmYWxzZTtcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcblxuICBPYmplY3Qua2V5cyhib2lsZXJwbGF0ZURhdGFDYWxsYmFja3MpLmZvckVhY2goa2V5ID0+IHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gYm9pbGVycGxhdGVEYXRhQ2FsbGJhY2tzW2tleV07XG4gICAgICByZXR1cm4gY2FsbGJhY2socmVxdWVzdCwgZGF0YSwgYXJjaCk7XG4gICAgfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgLy8gQ2FsbGJhY2tzIHNob3VsZCByZXR1cm4gZmFsc2UgaWYgdGhleSBkaWQgbm90IG1ha2UgYW55IGNoYW5nZXMuXG4gICAgICBpZiAocmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICBtYWRlQ2hhbmdlcyA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4gKHtcbiAgICBzdHJlYW06IGJvaWxlcnBsYXRlLnRvSFRNTFN0cmVhbShkYXRhKSxcbiAgICBzdGF0dXNDb2RlOiBkYXRhLnN0YXR1c0NvZGUsXG4gICAgaGVhZGVyczogZGF0YS5oZWFkZXJzLFxuICB9KSk7XG59XG5cbldlYkFwcEludGVybmFscy5nZW5lcmF0ZUJvaWxlcnBsYXRlSW5zdGFuY2UgPSBmdW5jdGlvbiAoYXJjaCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFuaWZlc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxPcHRpb25zKSB7XG4gIGFkZGl0aW9uYWxPcHRpb25zID0gYWRkaXRpb25hbE9wdGlvbnMgfHwge307XG5cbiAgdmFyIHJ1bnRpbWVDb25maWcgPSBfLmV4dGVuZChcbiAgICBfLmNsb25lKF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18pLFxuICAgIGFkZGl0aW9uYWxPcHRpb25zLnJ1bnRpbWVDb25maWdPdmVycmlkZXMgfHwge31cbiAgKTtcblxuICByZXR1cm4gbmV3IEJvaWxlcnBsYXRlKGFyY2gsIG1hbmlmZXN0LCBfLmV4dGVuZCh7XG4gICAgcGF0aE1hcHBlcihpdGVtUGF0aCkge1xuICAgICAgcmV0dXJuIHBhdGhKb2luKGFyY2hQYXRoW2FyY2hdLCBpdGVtUGF0aCk7XG4gICAgfSxcbiAgICBiYXNlRGF0YUV4dGVuc2lvbjoge1xuICAgICAgYWRkaXRpb25hbFN0YXRpY0pzOiBfLm1hcChcbiAgICAgICAgYWRkaXRpb25hbFN0YXRpY0pzIHx8IFtdLFxuICAgICAgICBmdW5jdGlvbiAoY29udGVudHMsIHBhdGhuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhdGhuYW1lOiBwYXRobmFtZSxcbiAgICAgICAgICAgIGNvbnRlbnRzOiBjb250ZW50c1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICksXG4gICAgICAvLyBDb252ZXJ0IHRvIGEgSlNPTiBzdHJpbmcsIHRoZW4gZ2V0IHJpZCBvZiBtb3N0IHdlaXJkIGNoYXJhY3RlcnMsIHRoZW5cbiAgICAgIC8vIHdyYXAgaW4gZG91YmxlIHF1b3Rlcy4gKFRoZSBvdXRlcm1vc3QgSlNPTi5zdHJpbmdpZnkgcmVhbGx5IG91Z2h0IHRvXG4gICAgICAvLyBqdXN0IGJlIFwid3JhcCBpbiBkb3VibGUgcXVvdGVzXCIgYnV0IHdlIHVzZSBpdCB0byBiZSBzYWZlLikgVGhpcyBtaWdodFxuICAgICAgLy8gZW5kIHVwIGluc2lkZSBhIDxzY3JpcHQ+IHRhZyBzbyB3ZSBuZWVkIHRvIGJlIGNhcmVmdWwgdG8gbm90IGluY2x1ZGVcbiAgICAgIC8vIFwiPC9zY3JpcHQ+XCIsIGJ1dCBub3JtYWwge3tzcGFjZWJhcnN9fSBlc2NhcGluZyBlc2NhcGVzIHRvbyBtdWNoISBTZWVcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tZXRlb3IvbWV0ZW9yL2lzc3Vlcy8zNzMwXG4gICAgICBtZXRlb3JSdW50aW1lQ29uZmlnOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHJ1bnRpbWVDb25maWcpKSksXG4gICAgICByb290VXJsUGF0aFByZWZpeDogX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCB8fCAnJyxcbiAgICAgIGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rOiBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayxcbiAgICAgIHNyaU1vZGU6IHNyaU1vZGUsXG4gICAgICBpbmxpbmVTY3JpcHRzQWxsb3dlZDogV2ViQXBwSW50ZXJuYWxzLmlubGluZVNjcmlwdHNBbGxvd2VkKCksXG4gICAgICBpbmxpbmU6IGFkZGl0aW9uYWxPcHRpb25zLmlubGluZVxuICAgIH1cbiAgfSwgYWRkaXRpb25hbE9wdGlvbnMpKTtcbn07XG5cbi8vIEEgbWFwcGluZyBmcm9tIHVybCBwYXRoIHRvIGFyY2hpdGVjdHVyZSAoZS5nLiBcIndlYi5icm93c2VyXCIpIHRvIHN0YXRpY1xuLy8gZmlsZSBpbmZvcm1hdGlvbiB3aXRoIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuLy8gLSB0eXBlOiB0aGUgdHlwZSBvZiBmaWxlIHRvIGJlIHNlcnZlZFxuLy8gLSBjYWNoZWFibGU6IG9wdGlvbmFsbHksIHdoZXRoZXIgdGhlIGZpbGUgc2hvdWxkIGJlIGNhY2hlZCBvciBub3Rcbi8vIC0gc291cmNlTWFwVXJsOiBvcHRpb25hbGx5LCB0aGUgdXJsIG9mIHRoZSBzb3VyY2UgbWFwXG4vL1xuLy8gSW5mbyBhbHNvIGNvbnRhaW5zIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuLy8gLSBjb250ZW50OiB0aGUgc3RyaW5naWZpZWQgY29udGVudCB0aGF0IHNob3VsZCBiZSBzZXJ2ZWQgYXQgdGhpcyBwYXRoXG4vLyAtIGFic29sdXRlUGF0aDogdGhlIGFic29sdXRlIHBhdGggb24gZGlzayB0byB0aGUgZmlsZVxuXG4vLyBTZXJ2ZSBzdGF0aWMgZmlsZXMgZnJvbSB0aGUgbWFuaWZlc3Qgb3IgYWRkZWQgd2l0aFxuLy8gYGFkZFN0YXRpY0pzYC4gRXhwb3J0ZWQgZm9yIHRlc3RzLlxuV2ViQXBwSW50ZXJuYWxzLnN0YXRpY0ZpbGVzTWlkZGxld2FyZSA9IGFzeW5jIGZ1bmN0aW9uIChcbiAgc3RhdGljRmlsZXNCeUFyY2gsXG4gIHJlcSxcbiAgcmVzLFxuICBuZXh0LFxuKSB7XG4gIGlmICgnR0VUJyAhPSByZXEubWV0aG9kICYmICdIRUFEJyAhPSByZXEubWV0aG9kICYmICdPUFRJT05TJyAhPSByZXEubWV0aG9kKSB7XG4gICAgbmV4dCgpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgcGF0aG5hbWUgPSBwYXJzZVJlcXVlc3QocmVxKS5wYXRobmFtZTtcbiAgdHJ5IHtcbiAgICBwYXRobmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXRobmFtZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHNlcnZlU3RhdGljSnMgPSBmdW5jdGlvbiAocykge1xuICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQ7IGNoYXJzZXQ9VVRGLTgnXG4gICAgfSk7XG4gICAgcmVzLndyaXRlKHMpO1xuICAgIHJlcy5lbmQoKTtcbiAgfTtcblxuICBpZiAoXy5oYXMoYWRkaXRpb25hbFN0YXRpY0pzLCBwYXRobmFtZSkgJiZcbiAgICAgICAgICAgICAgISBXZWJBcHBJbnRlcm5hbHMuaW5saW5lU2NyaXB0c0FsbG93ZWQoKSkge1xuICAgIHNlcnZlU3RhdGljSnMoYWRkaXRpb25hbFN0YXRpY0pzW3BhdGhuYW1lXSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyBhcmNoLCBwYXRoIH0gPSBnZXRBcmNoQW5kUGF0aChcbiAgICBwYXRobmFtZSxcbiAgICBpZGVudGlmeUJyb3dzZXIocmVxLmhlYWRlcnNbXCJ1c2VyLWFnZW50XCJdKSxcbiAgKTtcblxuICAvLyBJZiBwYXVzZUNsaWVudChhcmNoKSBoYXMgYmVlbiBjYWxsZWQsIHByb2dyYW0ucGF1c2VkIHdpbGwgYmUgYVxuICAvLyBQcm9taXNlIHRoYXQgd2lsbCBiZSByZXNvbHZlZCB3aGVuIHRoZSBwcm9ncmFtIGlzIHVucGF1c2VkLlxuICBjb25zdCBwcm9ncmFtID0gV2ViQXBwLmNsaWVudFByb2dyYW1zW2FyY2hdO1xuICBhd2FpdCBwcm9ncmFtLnBhdXNlZDtcblxuICBpZiAocGF0aCA9PT0gXCIvbWV0ZW9yX3J1bnRpbWVfY29uZmlnLmpzXCIgJiZcbiAgICAgICEgV2ViQXBwSW50ZXJuYWxzLmlubGluZVNjcmlwdHNBbGxvd2VkKCkpIHtcbiAgICBzZXJ2ZVN0YXRpY0pzKGBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fID0gJHtwcm9ncmFtLm1ldGVvclJ1bnRpbWVDb25maWd9O2ApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGluZm8gPSBnZXRTdGF0aWNGaWxlSW5mbyhzdGF0aWNGaWxlc0J5QXJjaCwgcGF0aG5hbWUsIHBhdGgsIGFyY2gpO1xuICBpZiAoISBpbmZvKSB7XG4gICAgbmV4dCgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFdlIGRvbid0IG5lZWQgdG8gY2FsbCBwYXVzZSBiZWNhdXNlLCB1bmxpa2UgJ3N0YXRpYycsIG9uY2Ugd2UgY2FsbCBpbnRvXG4gIC8vICdzZW5kJyBhbmQgeWllbGQgdG8gdGhlIGV2ZW50IGxvb3AsIHdlIG5ldmVyIGNhbGwgYW5vdGhlciBoYW5kbGVyIHdpdGhcbiAgLy8gJ25leHQnLlxuXG4gIC8vIENhY2hlYWJsZSBmaWxlcyBhcmUgZmlsZXMgdGhhdCBzaG91bGQgbmV2ZXIgY2hhbmdlLiBUeXBpY2FsbHlcbiAgLy8gbmFtZWQgYnkgdGhlaXIgaGFzaCAoZWcgbWV0ZW9yIGJ1bmRsZWQganMgYW5kIGNzcyBmaWxlcykuXG4gIC8vIFdlIGNhY2hlIHRoZW0gfmZvcmV2ZXIgKDF5cikuXG4gIGNvbnN0IG1heEFnZSA9IGluZm8uY2FjaGVhYmxlXG4gICAgPyAxMDAwICogNjAgKiA2MCAqIDI0ICogMzY1XG4gICAgOiAwO1xuXG4gIGlmIChpbmZvLmNhY2hlYWJsZSkge1xuICAgIC8vIFNpbmNlIHdlIHVzZSByZXEuaGVhZGVyc1tcInVzZXItYWdlbnRcIl0gdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlXG4gICAgLy8gY2xpZW50IHNob3VsZCByZWNlaXZlIG1vZGVybiBvciBsZWdhY3kgcmVzb3VyY2VzLCB0ZWxsIHRoZSBjbGllbnRcbiAgICAvLyB0byBpbnZhbGlkYXRlIGNhY2hlZCByZXNvdXJjZXMgd2hlbi9pZiBpdHMgdXNlciBhZ2VudCBzdHJpbmdcbiAgICAvLyBjaGFuZ2VzIGluIHRoZSBmdXR1cmUuXG4gICAgcmVzLnNldEhlYWRlcihcIlZhcnlcIiwgXCJVc2VyLUFnZW50XCIpO1xuICB9XG5cbiAgLy8gU2V0IHRoZSBYLVNvdXJjZU1hcCBoZWFkZXIsIHdoaWNoIGN1cnJlbnQgQ2hyb21lLCBGaXJlRm94LCBhbmQgU2FmYXJpXG4gIC8vIHVuZGVyc3RhbmQuICAoVGhlIFNvdXJjZU1hcCBoZWFkZXIgaXMgc2xpZ2h0bHkgbW9yZSBzcGVjLWNvcnJlY3QgYnV0IEZGXG4gIC8vIGRvZXNuJ3QgdW5kZXJzdGFuZCBpdC4pXG4gIC8vXG4gIC8vIFlvdSBtYXkgYWxzbyBuZWVkIHRvIGVuYWJsZSBzb3VyY2UgbWFwcyBpbiBDaHJvbWU6IG9wZW4gZGV2IHRvb2xzLCBjbGlja1xuICAvLyB0aGUgZ2VhciBpbiB0aGUgYm90dG9tIHJpZ2h0IGNvcm5lciwgYW5kIHNlbGVjdCBcImVuYWJsZSBzb3VyY2UgbWFwc1wiLlxuICBpZiAoaW5mby5zb3VyY2VNYXBVcmwpIHtcbiAgICByZXMuc2V0SGVhZGVyKCdYLVNvdXJjZU1hcCcsXG4gICAgICAgICAgICAgICAgICBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYICtcbiAgICAgICAgICAgICAgICAgIGluZm8uc291cmNlTWFwVXJsKTtcbiAgfVxuXG4gIGlmIChpbmZvLnR5cGUgPT09IFwianNcIiB8fFxuICAgICAgaW5mby50eXBlID09PSBcImR5bmFtaWMganNcIikge1xuICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qYXZhc2NyaXB0OyBjaGFyc2V0PVVURi04XCIpO1xuICB9IGVsc2UgaWYgKGluZm8udHlwZSA9PT0gXCJjc3NcIikge1xuICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L2NzczsgY2hhcnNldD1VVEYtOFwiKTtcbiAgfSBlbHNlIGlmIChpbmZvLnR5cGUgPT09IFwianNvblwiKSB7XG4gICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIik7XG4gIH1cblxuICBpZiAoaW5mby5oYXNoKSB7XG4gICAgcmVzLnNldEhlYWRlcignRVRhZycsICdcIicgKyBpbmZvLmhhc2ggKyAnXCInKTtcbiAgfVxuXG4gIGlmIChpbmZvLmNvbnRlbnQpIHtcbiAgICByZXMud3JpdGUoaW5mby5jb250ZW50KTtcbiAgICByZXMuZW5kKCk7XG4gIH0gZWxzZSB7XG4gICAgc2VuZChyZXEsIGluZm8uYWJzb2x1dGVQYXRoLCB7XG4gICAgICBtYXhhZ2U6IG1heEFnZSxcbiAgICAgIGRvdGZpbGVzOiAnYWxsb3cnLCAvLyBpZiB3ZSBzcGVjaWZpZWQgYSBkb3RmaWxlIGluIHRoZSBtYW5pZmVzdCwgc2VydmUgaXRcbiAgICAgIGxhc3RNb2RpZmllZDogZmFsc2UgLy8gZG9uJ3Qgc2V0IGxhc3QtbW9kaWZpZWQgYmFzZWQgb24gdGhlIGZpbGUgZGF0ZVxuICAgIH0pLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIExvZy5lcnJvcihcIkVycm9yIHNlcnZpbmcgc3RhdGljIGZpbGUgXCIgKyBlcnIpO1xuICAgICAgcmVzLndyaXRlSGVhZCg1MDApO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH0pLm9uKCdkaXJlY3RvcnknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBMb2cuZXJyb3IoXCJVbmV4cGVjdGVkIGRpcmVjdG9yeSBcIiArIGluZm8uYWJzb2x1dGVQYXRoKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoNTAwKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9KS5waXBlKHJlcyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdldFN0YXRpY0ZpbGVJbmZvKHN0YXRpY0ZpbGVzQnlBcmNoLCBvcmlnaW5hbFBhdGgsIHBhdGgsIGFyY2gpIHtcbiAgaWYgKCEgaGFzT3duLmNhbGwoV2ViQXBwLmNsaWVudFByb2dyYW1zLCBhcmNoKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gR2V0IGEgbGlzdCBvZiBhbGwgYXZhaWxhYmxlIHN0YXRpYyBmaWxlIGFyY2hpdGVjdHVyZXMsIHdpdGggYXJjaFxuICAvLyBmaXJzdCBpbiB0aGUgbGlzdCBpZiBpdCBleGlzdHMuXG4gIGNvbnN0IHN0YXRpY0FyY2hMaXN0ID0gT2JqZWN0LmtleXMoc3RhdGljRmlsZXNCeUFyY2gpO1xuICBjb25zdCBhcmNoSW5kZXggPSBzdGF0aWNBcmNoTGlzdC5pbmRleE9mKGFyY2gpO1xuICBpZiAoYXJjaEluZGV4ID4gMCkge1xuICAgIHN0YXRpY0FyY2hMaXN0LnVuc2hpZnQoc3RhdGljQXJjaExpc3Quc3BsaWNlKGFyY2hJbmRleCwgMSlbMF0pO1xuICB9XG5cbiAgbGV0IGluZm8gPSBudWxsO1xuXG4gIHN0YXRpY0FyY2hMaXN0LnNvbWUoYXJjaCA9PiB7XG4gICAgY29uc3Qgc3RhdGljRmlsZXMgPSBzdGF0aWNGaWxlc0J5QXJjaFthcmNoXTtcblxuICAgIGZ1bmN0aW9uIGZpbmFsaXplKHBhdGgpIHtcbiAgICAgIGluZm8gPSBzdGF0aWNGaWxlc1twYXRoXTtcbiAgICAgIC8vIFNvbWV0aW1lcyB3ZSByZWdpc3RlciBhIGxhenkgZnVuY3Rpb24gaW5zdGVhZCBvZiBhY3R1YWwgZGF0YSBpblxuICAgICAgLy8gdGhlIHN0YXRpY0ZpbGVzIG1hbmlmZXN0LlxuICAgICAgaWYgKHR5cGVvZiBpbmZvID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgaW5mbyA9IHN0YXRpY0ZpbGVzW3BhdGhdID0gaW5mbygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gSWYgc3RhdGljRmlsZXMgY29udGFpbnMgb3JpZ2luYWxQYXRoIHdpdGggdGhlIGFyY2ggaW5mZXJyZWQgYWJvdmUsXG4gICAgLy8gdXNlIHRoYXQgaW5mb3JtYXRpb24uXG4gICAgaWYgKGhhc093bi5jYWxsKHN0YXRpY0ZpbGVzLCBvcmlnaW5hbFBhdGgpKSB7XG4gICAgICByZXR1cm4gZmluYWxpemUob3JpZ2luYWxQYXRoKTtcbiAgICB9XG5cbiAgICAvLyBJZiBnZXRBcmNoQW5kUGF0aCByZXR1cm5lZCBhbiBhbHRlcm5hdGUgcGF0aCwgdHJ5IHRoYXQgaW5zdGVhZC5cbiAgICBpZiAocGF0aCAhPT0gb3JpZ2luYWxQYXRoICYmXG4gICAgICAgIGhhc093bi5jYWxsKHN0YXRpY0ZpbGVzLCBwYXRoKSkge1xuICAgICAgcmV0dXJuIGZpbmFsaXplKHBhdGgpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGluZm87XG59XG5cbmZ1bmN0aW9uIGdldEFyY2hBbmRQYXRoKHBhdGgsIGJyb3dzZXIpIHtcbiAgY29uc3QgcGF0aFBhcnRzID0gcGF0aC5zcGxpdChcIi9cIik7XG4gIGNvbnN0IGFyY2hLZXkgPSBwYXRoUGFydHNbMV07XG5cbiAgaWYgKGFyY2hLZXkuc3RhcnRzV2l0aChcIl9fXCIpKSB7XG4gICAgY29uc3QgYXJjaENsZWFuZWQgPSBcIndlYi5cIiArIGFyY2hLZXkuc2xpY2UoMik7XG4gICAgaWYgKGhhc093bi5jYWxsKFdlYkFwcC5jbGllbnRQcm9ncmFtcywgYXJjaENsZWFuZWQpKSB7XG4gICAgICBwYXRoUGFydHMuc3BsaWNlKDEsIDEpOyAvLyBSZW1vdmUgdGhlIGFyY2hLZXkgcGFydC5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGFyY2g6IGFyY2hDbGVhbmVkLFxuICAgICAgICBwYXRoOiBwYXRoUGFydHMuam9pbihcIi9cIiksXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE8gUGVyaGFwcyBvbmUgZGF5IHdlIGNvdWxkIGluZmVyIENvcmRvdmEgY2xpZW50cyBoZXJlLCBzbyB0aGF0IHdlXG4gIC8vIHdvdWxkbid0IGhhdmUgdG8gdXNlIHByZWZpeGVkIFwiL19fY29yZG92YS8uLi5cIiBVUkxzLlxuICBjb25zdCBhcmNoID0gaXNNb2Rlcm4oYnJvd3NlcilcbiAgICA/IFwid2ViLmJyb3dzZXJcIlxuICAgIDogXCJ3ZWIuYnJvd3Nlci5sZWdhY3lcIjtcblxuICBpZiAoaGFzT3duLmNhbGwoV2ViQXBwLmNsaWVudFByb2dyYW1zLCBhcmNoKSkge1xuICAgIHJldHVybiB7IGFyY2gsIHBhdGggfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYXJjaDogV2ViQXBwLmRlZmF1bHRBcmNoLFxuICAgIHBhdGgsXG4gIH07XG59XG5cbi8vIFBhcnNlIHRoZSBwYXNzZWQgaW4gcG9ydCB2YWx1ZS4gUmV0dXJuIHRoZSBwb3J0IGFzLWlzIGlmIGl0J3MgYSBTdHJpbmdcbi8vIChlLmcuIGEgV2luZG93cyBTZXJ2ZXIgc3R5bGUgbmFtZWQgcGlwZSksIG90aGVyd2lzZSByZXR1cm4gdGhlIHBvcnQgYXMgYW5cbi8vIGludGVnZXIuXG4vL1xuLy8gREVQUkVDQVRFRDogRGlyZWN0IHVzZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIG5vdCByZWNvbW1lbmRlZDsgaXQgaXMgbm9cbi8vIGxvbmdlciB1c2VkIGludGVybmFsbHksIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gYSBmdXR1cmUgcmVsZWFzZS5cbldlYkFwcEludGVybmFscy5wYXJzZVBvcnQgPSBwb3J0ID0+IHtcbiAgbGV0IHBhcnNlZFBvcnQgPSBwYXJzZUludChwb3J0KTtcbiAgaWYgKE51bWJlci5pc05hTihwYXJzZWRQb3J0KSkge1xuICAgIHBhcnNlZFBvcnQgPSBwb3J0O1xuICB9XG4gIHJldHVybiBwYXJzZWRQb3J0O1xufVxuXG5pbXBvcnQgeyBvbk1lc3NhZ2UgfSBmcm9tIFwibWV0ZW9yL2ludGVyLXByb2Nlc3MtbWVzc2FnaW5nXCI7XG5cbm9uTWVzc2FnZShcIndlYmFwcC1wYXVzZS1jbGllbnRcIiwgYXN5bmMgKHsgYXJjaCB9KSA9PiB7XG4gIFdlYkFwcEludGVybmFscy5wYXVzZUNsaWVudChhcmNoKTtcbn0pO1xuXG5vbk1lc3NhZ2UoXCJ3ZWJhcHAtcmVsb2FkLWNsaWVudFwiLCBhc3luYyAoeyBhcmNoIH0pID0+IHtcbiAgV2ViQXBwSW50ZXJuYWxzLmdlbmVyYXRlQ2xpZW50UHJvZ3JhbShhcmNoKTtcbn0pO1xuXG5mdW5jdGlvbiBydW5XZWJBcHBTZXJ2ZXIoKSB7XG4gIHZhciBzaHV0dGluZ0Rvd24gPSBmYWxzZTtcbiAgdmFyIHN5bmNRdWV1ZSA9IG5ldyBNZXRlb3IuX1N5bmNocm9ub3VzUXVldWUoKTtcblxuICB2YXIgZ2V0SXRlbVBhdGhuYW1lID0gZnVuY3Rpb24gKGl0ZW1VcmwpIHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnNlVXJsKGl0ZW1VcmwpLnBhdGhuYW1lKTtcbiAgfTtcblxuICBXZWJBcHBJbnRlcm5hbHMucmVsb2FkQ2xpZW50UHJvZ3JhbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgc3luY1F1ZXVlLnJ1blRhc2soZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBzdGF0aWNGaWxlc0J5QXJjaCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAgIGNvbnN0IHsgY29uZmlnSnNvbiB9ID0gX19tZXRlb3JfYm9vdHN0cmFwX187XG4gICAgICBjb25zdCBjbGllbnRBcmNocyA9IGNvbmZpZ0pzb24uY2xpZW50QXJjaHMgfHxcbiAgICAgICAgT2JqZWN0LmtleXMoY29uZmlnSnNvbi5jbGllbnRQYXRocyk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNsaWVudEFyY2hzLmZvckVhY2goYXJjaCA9PiB7XG4gICAgICAgICAgZ2VuZXJhdGVDbGllbnRQcm9ncmFtKGFyY2gsIHN0YXRpY0ZpbGVzQnlBcmNoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFdlYkFwcEludGVybmFscy5zdGF0aWNGaWxlc0J5QXJjaCA9IHN0YXRpY0ZpbGVzQnlBcmNoO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBMb2cuZXJyb3IoXCJFcnJvciByZWxvYWRpbmcgdGhlIGNsaWVudCBwcm9ncmFtOiBcIiArIGUuc3RhY2spO1xuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gUGF1c2UgYW55IGluY29taW5nIHJlcXVlc3RzIGFuZCBtYWtlIHRoZW0gd2FpdCBmb3IgdGhlIHByb2dyYW0gdG8gYmVcbiAgLy8gdW5wYXVzZWQgdGhlIG5leHQgdGltZSBnZW5lcmF0ZUNsaWVudFByb2dyYW0oYXJjaCkgaXMgY2FsbGVkLlxuICBXZWJBcHBJbnRlcm5hbHMucGF1c2VDbGllbnQgPSBmdW5jdGlvbiAoYXJjaCkge1xuICAgIHN5bmNRdWV1ZS5ydW5UYXNrKCgpID0+IHtcbiAgICAgIGNvbnN0IHByb2dyYW0gPSBXZWJBcHAuY2xpZW50UHJvZ3JhbXNbYXJjaF07XG4gICAgICBjb25zdCB7IHVucGF1c2UgfSA9IHByb2dyYW07XG4gICAgICBwcm9ncmFtLnBhdXNlZCA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHVucGF1c2UgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIC8vIElmIHRoZXJlIGhhcHBlbnMgdG8gYmUgYW4gZXhpc3RpbmcgcHJvZ3JhbS51bnBhdXNlIGZ1bmN0aW9uLFxuICAgICAgICAgIC8vIGNvbXBvc2UgaXQgd2l0aCB0aGUgcmVzb2x2ZSBmdW5jdGlvbi5cbiAgICAgICAgICBwcm9ncmFtLnVucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1bnBhdXNlKCk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9ncmFtLnVucGF1c2UgPSByZXNvbHZlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBXZWJBcHBJbnRlcm5hbHMuZ2VuZXJhdGVDbGllbnRQcm9ncmFtID0gZnVuY3Rpb24gKGFyY2gpIHtcbiAgICBzeW5jUXVldWUucnVuVGFzaygoKSA9PiBnZW5lcmF0ZUNsaWVudFByb2dyYW0oYXJjaCkpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlQ2xpZW50UHJvZ3JhbShcbiAgICBhcmNoLFxuICAgIHN0YXRpY0ZpbGVzQnlBcmNoID0gV2ViQXBwSW50ZXJuYWxzLnN0YXRpY0ZpbGVzQnlBcmNoLFxuICApIHtcbiAgICBjb25zdCBjbGllbnREaXIgPSBwYXRoSm9pbihcbiAgICAgIHBhdGhEaXJuYW1lKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciksXG4gICAgICBhcmNoLFxuICAgICk7XG5cbiAgICAvLyByZWFkIHRoZSBjb250cm9sIGZvciB0aGUgY2xpZW50IHdlJ2xsIGJlIHNlcnZpbmcgdXBcbiAgICBjb25zdCBwcm9ncmFtSnNvblBhdGggPSBwYXRoSm9pbihjbGllbnREaXIsIFwicHJvZ3JhbS5qc29uXCIpO1xuXG4gICAgbGV0IHByb2dyYW1Kc29uO1xuICAgIHRyeSB7XG4gICAgICBwcm9ncmFtSnNvbiA9IEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKHByb2dyYW1Kc29uUGF0aCkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLmNvZGUgPT09IFwiRU5PRU5UXCIpIHJldHVybjtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgaWYgKHByb2dyYW1Kc29uLmZvcm1hdCAhPT0gXCJ3ZWItcHJvZ3JhbS1wcmUxXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGZvcm1hdCBmb3IgY2xpZW50IGFzc2V0czogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHByb2dyYW1Kc29uLmZvcm1hdCkpO1xuICAgIH1cblxuICAgIGlmICghIHByb2dyYW1Kc29uUGF0aCB8fCAhIGNsaWVudERpciB8fCAhIHByb2dyYW1Kc29uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDbGllbnQgY29uZmlnIGZpbGUgbm90IHBhcnNlZC5cIik7XG4gICAgfVxuXG4gICAgYXJjaFBhdGhbYXJjaF0gPSBjbGllbnREaXI7XG4gICAgY29uc3Qgc3RhdGljRmlsZXMgPSBzdGF0aWNGaWxlc0J5QXJjaFthcmNoXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICBjb25zdCB7IG1hbmlmZXN0IH0gPSBwcm9ncmFtSnNvbjtcbiAgICBtYW5pZmVzdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0udXJsICYmIGl0ZW0ud2hlcmUgPT09IFwiY2xpZW50XCIpIHtcbiAgICAgICAgc3RhdGljRmlsZXNbZ2V0SXRlbVBhdGhuYW1lKGl0ZW0udXJsKV0gPSB7XG4gICAgICAgICAgYWJzb2x1dGVQYXRoOiBwYXRoSm9pbihjbGllbnREaXIsIGl0ZW0ucGF0aCksXG4gICAgICAgICAgY2FjaGVhYmxlOiBpdGVtLmNhY2hlYWJsZSxcbiAgICAgICAgICBoYXNoOiBpdGVtLmhhc2gsXG4gICAgICAgICAgLy8gTGluayBmcm9tIHNvdXJjZSB0byBpdHMgbWFwXG4gICAgICAgICAgc291cmNlTWFwVXJsOiBpdGVtLnNvdXJjZU1hcFVybCxcbiAgICAgICAgICB0eXBlOiBpdGVtLnR5cGVcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoaXRlbS5zb3VyY2VNYXApIHtcbiAgICAgICAgICAvLyBTZXJ2ZSB0aGUgc291cmNlIG1hcCB0b28sIHVuZGVyIHRoZSBzcGVjaWZpZWQgVVJMLiBXZSBhc3N1bWVcbiAgICAgICAgICAvLyBhbGwgc291cmNlIG1hcHMgYXJlIGNhY2hlYWJsZS5cbiAgICAgICAgICBzdGF0aWNGaWxlc1tnZXRJdGVtUGF0aG5hbWUoaXRlbS5zb3VyY2VNYXBVcmwpXSA9IHtcbiAgICAgICAgICAgIGFic29sdXRlUGF0aDogcGF0aEpvaW4oY2xpZW50RGlyLCBpdGVtLnNvdXJjZU1hcCksXG4gICAgICAgICAgICBjYWNoZWFibGU6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB7IFBVQkxJQ19TRVRUSU5HUyB9ID0gX19tZXRlb3JfcnVudGltZV9jb25maWdfXztcbiAgICBjb25zdCBjb25maWdPdmVycmlkZXMgPSB7XG4gICAgICBQVUJMSUNfU0VUVElOR1MsXG4gICAgfTtcblxuICAgIGNvbnN0IG9sZFByb2dyYW0gPSBXZWJBcHAuY2xpZW50UHJvZ3JhbXNbYXJjaF07XG4gICAgY29uc3QgbmV3UHJvZ3JhbSA9IFdlYkFwcC5jbGllbnRQcm9ncmFtc1thcmNoXSA9IHtcbiAgICAgIGZvcm1hdDogXCJ3ZWItcHJvZ3JhbS1wcmUxXCIsXG4gICAgICBtYW5pZmVzdDogbWFuaWZlc3QsXG4gICAgICAvLyBVc2UgYXJyb3cgZnVuY3Rpb25zIHNvIHRoYXQgdGhlc2UgdmVyc2lvbnMgY2FuIGJlIGxhemlseVxuICAgICAgLy8gY2FsY3VsYXRlZCBsYXRlciwgYW5kIHNvIHRoYXQgdGhleSB3aWxsIG5vdCBiZSBpbmNsdWRlZCBpbiB0aGVcbiAgICAgIC8vIHN0YXRpY0ZpbGVzW21hbmlmZXN0VXJsXS5jb250ZW50IHN0cmluZyBiZWxvdy5cbiAgICAgIC8vXG4gICAgICAvLyBOb3RlOiB0aGVzZSB2ZXJzaW9uIGNhbGN1bGF0aW9ucyBtdXN0IGJlIGtlcHQgaW4gYWdyZWVtZW50IHdpdGhcbiAgICAgIC8vIENvcmRvdmFCdWlsZGVyI2FwcGVuZFZlcnNpb24gaW4gdG9vbHMvY29yZG92YS9idWlsZGVyLmpzLCBvciBob3RcbiAgICAgIC8vIGNvZGUgcHVzaCB3aWxsIHJlbG9hZCBDb3Jkb3ZhIGFwcHMgdW5uZWNlc3NhcmlseS5cbiAgICAgIHZlcnNpb246ICgpID0+IFdlYkFwcEhhc2hpbmcuY2FsY3VsYXRlQ2xpZW50SGFzaChcbiAgICAgICAgbWFuaWZlc3QsIG51bGwsIGNvbmZpZ092ZXJyaWRlcyksXG4gICAgICB2ZXJzaW9uUmVmcmVzaGFibGU6ICgpID0+IFdlYkFwcEhhc2hpbmcuY2FsY3VsYXRlQ2xpZW50SGFzaChcbiAgICAgICAgbWFuaWZlc3QsIHR5cGUgPT4gdHlwZSA9PT0gXCJjc3NcIiwgY29uZmlnT3ZlcnJpZGVzKSxcbiAgICAgIHZlcnNpb25Ob25SZWZyZXNoYWJsZTogKCkgPT4gV2ViQXBwSGFzaGluZy5jYWxjdWxhdGVDbGllbnRIYXNoKFxuICAgICAgICBtYW5pZmVzdCwgdHlwZSA9PiB0eXBlICE9PSBcImNzc1wiLCBjb25maWdPdmVycmlkZXMpLFxuICAgICAgY29yZG92YUNvbXBhdGliaWxpdHlWZXJzaW9uczogcHJvZ3JhbUpzb24uY29yZG92YUNvbXBhdGliaWxpdHlWZXJzaW9ucyxcbiAgICAgIFBVQkxJQ19TRVRUSU5HUyxcbiAgICB9O1xuXG4gICAgLy8gRXhwb3NlIHByb2dyYW0gZGV0YWlscyBhcyBhIHN0cmluZyByZWFjaGFibGUgdmlhIHRoZSBmb2xsb3dpbmcgVVJMLlxuICAgIGNvbnN0IG1hbmlmZXN0VXJsUHJlZml4ID0gXCIvX19cIiArIGFyY2gucmVwbGFjZSgvXndlYlxcLi8sIFwiXCIpO1xuICAgIGNvbnN0IG1hbmlmZXN0VXJsID0gbWFuaWZlc3RVcmxQcmVmaXggKyBnZXRJdGVtUGF0aG5hbWUoXCIvbWFuaWZlc3QuanNvblwiKTtcblxuICAgIHN0YXRpY0ZpbGVzW21hbmlmZXN0VXJsXSA9ICgpID0+IHtcbiAgICAgIGlmIChQYWNrYWdlLmF1dG91cGRhdGUpIHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIEFVVE9VUERBVEVfVkVSU0lPTiA9XG4gICAgICAgICAgICBQYWNrYWdlLmF1dG91cGRhdGUuQXV0b3VwZGF0ZS5hdXRvdXBkYXRlVmVyc2lvblxuICAgICAgICB9ID0gcHJvY2Vzcy5lbnY7XG5cbiAgICAgICAgaWYgKEFVVE9VUERBVEVfVkVSU0lPTikge1xuICAgICAgICAgIG5ld1Byb2dyYW0udmVyc2lvbiA9IEFVVE9VUERBVEVfVkVSU0lPTjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG5ld1Byb2dyYW0udmVyc2lvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG5ld1Byb2dyYW0udmVyc2lvbiA9IG5ld1Byb2dyYW0udmVyc2lvbigpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb250ZW50OiBKU09OLnN0cmluZ2lmeShuZXdQcm9ncmFtKSxcbiAgICAgICAgY2FjaGVhYmxlOiBmYWxzZSxcbiAgICAgICAgaGFzaDogbmV3UHJvZ3JhbS52ZXJzaW9uLFxuICAgICAgICB0eXBlOiBcImpzb25cIlxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZ2VuZXJhdGVCb2lsZXJwbGF0ZUZvckFyY2goYXJjaCk7XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgYW55IHJlcXVlc3RzIHdhaXRpbmcgb24gb2xkUHJvZ3JhbS5wYXVzZWQsIGxldCB0aGVtXG4gICAgLy8gY29udGludWUgbm93ICh1c2luZyB0aGUgbmV3IHByb2dyYW0pLlxuICAgIGlmIChvbGRQcm9ncmFtICYmXG4gICAgICAgIG9sZFByb2dyYW0ucGF1c2VkKSB7XG4gICAgICBvbGRQcm9ncmFtLnVucGF1c2UoKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZGVmYXVsdE9wdGlvbnNGb3JBcmNoID0ge1xuICAgICd3ZWIuY29yZG92YSc6IHtcbiAgICAgIHJ1bnRpbWVDb25maWdPdmVycmlkZXM6IHtcbiAgICAgICAgLy8gWFhYIFdlIHVzZSBhYnNvbHV0ZVVybCgpIGhlcmUgc28gdGhhdCB3ZSBzZXJ2ZSBodHRwczovL1xuICAgICAgICAvLyBVUkxzIHRvIGNvcmRvdmEgY2xpZW50cyBpZiBmb3JjZS1zc2wgaXMgaW4gdXNlLiBJZiB3ZSB3ZXJlXG4gICAgICAgIC8vIHRvIHVzZSBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMIGluc3RlYWQgb2ZcbiAgICAgICAgLy8gYWJzb2x1dGVVcmwoKSwgdGhlbiBDb3Jkb3ZhIGNsaWVudHMgd291bGQgaW1tZWRpYXRlbHkgZ2V0IGFcbiAgICAgICAgLy8gSENQIHNldHRpbmcgdGhlaXIgRERQX0RFRkFVTFRfQ09OTkVDVElPTl9VUkwgdG9cbiAgICAgICAgLy8gaHR0cDovL2V4YW1wbGUubWV0ZW9yLmNvbS4gVGhpcyBicmVha3MgdGhlIGFwcCwgYmVjYXVzZVxuICAgICAgICAvLyBmb3JjZS1zc2wgZG9lc24ndCBzZXJ2ZSBDT1JTIGhlYWRlcnMgb24gMzAyXG4gICAgICAgIC8vIHJlZGlyZWN0cy4gKFBsdXMgaXQncyB1bmRlc2lyYWJsZSB0byBoYXZlIGNsaWVudHNcbiAgICAgICAgLy8gY29ubmVjdGluZyB0byBodHRwOi8vZXhhbXBsZS5tZXRlb3IuY29tIHdoZW4gZm9yY2Utc3NsIGlzXG4gICAgICAgIC8vIGluIHVzZS4pXG4gICAgICAgIEREUF9ERUZBVUxUX0NPTk5FQ1RJT05fVVJMOiBwcm9jZXNzLmVudi5NT0JJTEVfRERQX1VSTCB8fFxuICAgICAgICAgIE1ldGVvci5hYnNvbHV0ZVVybCgpLFxuICAgICAgICBST09UX1VSTDogcHJvY2Vzcy5lbnYuTU9CSUxFX1JPT1RfVVJMIHx8XG4gICAgICAgICAgTWV0ZW9yLmFic29sdXRlVXJsKClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJ3ZWIuYnJvd3NlclwiOiB7XG4gICAgICBydW50aW1lQ29uZmlnT3ZlcnJpZGVzOiB7XG4gICAgICAgIGlzTW9kZXJuOiB0cnVlLFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcIndlYi5icm93c2VyLmxlZ2FjeVwiOiB7XG4gICAgICBydW50aW1lQ29uZmlnT3ZlcnJpZGVzOiB7XG4gICAgICAgIGlzTW9kZXJuOiBmYWxzZSxcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuXG4gIFdlYkFwcEludGVybmFscy5nZW5lcmF0ZUJvaWxlcnBsYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRoaXMgYm9pbGVycGxhdGUgd2lsbCBiZSBzZXJ2ZWQgdG8gdGhlIG1vYmlsZSBkZXZpY2VzIHdoZW4gdXNlZCB3aXRoXG4gICAgLy8gTWV0ZW9yL0NvcmRvdmEgZm9yIHRoZSBIb3QtQ29kZSBQdXNoIGFuZCBzaW5jZSB0aGUgZmlsZSB3aWxsIGJlIHNlcnZlZCBieVxuICAgIC8vIHRoZSBkZXZpY2UncyBzZXJ2ZXIsIGl0IGlzIGltcG9ydGFudCB0byBzZXQgdGhlIEREUCB1cmwgdG8gdGhlIGFjdHVhbFxuICAgIC8vIE1ldGVvciBzZXJ2ZXIgYWNjZXB0aW5nIEREUCBjb25uZWN0aW9ucyBhbmQgbm90IHRoZSBkZXZpY2UncyBmaWxlIHNlcnZlci5cbiAgICBzeW5jUXVldWUucnVuVGFzayhmdW5jdGlvbigpIHtcbiAgICAgIE9iamVjdC5rZXlzKFdlYkFwcC5jbGllbnRQcm9ncmFtcylcbiAgICAgICAgLmZvckVhY2goZ2VuZXJhdGVCb2lsZXJwbGF0ZUZvckFyY2gpO1xuICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlQm9pbGVycGxhdGVGb3JBcmNoKGFyY2gpIHtcbiAgICBjb25zdCBwcm9ncmFtID0gV2ViQXBwLmNsaWVudFByb2dyYW1zW2FyY2hdO1xuICAgIGNvbnN0IGFkZGl0aW9uYWxPcHRpb25zID0gZGVmYXVsdE9wdGlvbnNGb3JBcmNoW2FyY2hdIHx8IHt9O1xuICAgIGNvbnN0IHsgYmFzZURhdGEgfSA9IGJvaWxlcnBsYXRlQnlBcmNoW2FyY2hdID1cbiAgICAgIFdlYkFwcEludGVybmFscy5nZW5lcmF0ZUJvaWxlcnBsYXRlSW5zdGFuY2UoXG4gICAgICAgIGFyY2gsXG4gICAgICAgIHByb2dyYW0ubWFuaWZlc3QsXG4gICAgICAgIGFkZGl0aW9uYWxPcHRpb25zLFxuICAgICAgKTtcbiAgICAvLyBXZSBuZWVkIHRoZSBydW50aW1lIGNvbmZpZyB3aXRoIG92ZXJyaWRlcyBmb3IgbWV0ZW9yX3J1bnRpbWVfY29uZmlnLmpzOlxuICAgIHByb2dyYW0ubWV0ZW9yUnVudGltZUNvbmZpZyA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIC4uLl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18sXG4gICAgICAuLi4oYWRkaXRpb25hbE9wdGlvbnMucnVudGltZUNvbmZpZ092ZXJyaWRlcyB8fCBudWxsKSxcbiAgICB9KTtcbiAgICBwcm9ncmFtLnJlZnJlc2hhYmxlQXNzZXRzID0gYmFzZURhdGEuY3NzLm1hcChmaWxlID0+ICh7XG4gICAgICB1cmw6IGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rKGZpbGUudXJsKSxcbiAgICB9KSk7XG4gIH1cblxuICBXZWJBcHBJbnRlcm5hbHMucmVsb2FkQ2xpZW50UHJvZ3JhbXMoKTtcblxuICAvLyB3ZWJzZXJ2ZXJcbiAgdmFyIGFwcCA9IGNvbm5lY3QoKTtcblxuICAvLyBQYWNrYWdlcyBhbmQgYXBwcyBjYW4gYWRkIGhhbmRsZXJzIHRoYXQgcnVuIGJlZm9yZSBhbnkgb3RoZXIgTWV0ZW9yXG4gIC8vIGhhbmRsZXJzIHZpYSBXZWJBcHAucmF3Q29ubmVjdEhhbmRsZXJzLlxuICB2YXIgcmF3Q29ubmVjdEhhbmRsZXJzID0gY29ubmVjdCgpO1xuICBhcHAudXNlKHJhd0Nvbm5lY3RIYW5kbGVycyk7XG5cbiAgLy8gQXV0by1jb21wcmVzcyBhbnkganNvbiwgamF2YXNjcmlwdCwgb3IgdGV4dC5cbiAgYXBwLnVzZShjb21wcmVzcyh7ZmlsdGVyOiBzaG91bGRDb21wcmVzc30pKTtcblxuICAvLyBwYXJzZSBjb29raWVzIGludG8gYW4gb2JqZWN0XG4gIGFwcC51c2UoY29va2llUGFyc2VyKCkpO1xuXG4gIC8vIFdlJ3JlIG5vdCBhIHByb3h5OyByZWplY3QgKHdpdGhvdXQgY3Jhc2hpbmcpIGF0dGVtcHRzIHRvIHRyZWF0IHVzIGxpa2VcbiAgLy8gb25lLiAoU2VlICMxMjEyLilcbiAgYXBwLnVzZShmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIGlmIChSb3V0ZVBvbGljeS5pc1ZhbGlkVXJsKHJlcS51cmwpKSB7XG4gICAgICBuZXh0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlcy53cml0ZUhlYWQoNDAwKTtcbiAgICByZXMud3JpdGUoXCJOb3QgYSBwcm94eVwiKTtcbiAgICByZXMuZW5kKCk7XG4gIH0pO1xuXG4gIC8vIFBhcnNlIHRoZSBxdWVyeSBzdHJpbmcgaW50byByZXMucXVlcnkuIFVzZWQgYnkgb2F1dGhfc2VydmVyLCBidXQgaXQnc1xuICAvLyBnZW5lcmFsbHkgcHJldHR5IGhhbmR5Li5cbiAgLy9cbiAgLy8gRG8gdGhpcyBiZWZvcmUgdGhlIG5leHQgbWlkZGxld2FyZSBkZXN0cm95cyByZXEudXJsIGlmIGEgcGF0aCBwcmVmaXhcbiAgLy8gaXMgc2V0IHRvIGNsb3NlICMxMDExMS5cbiAgYXBwLnVzZShmdW5jdGlvbiAocmVxdWVzdCwgcmVzcG9uc2UsIG5leHQpIHtcbiAgICByZXF1ZXN0LnF1ZXJ5ID0gcXMucGFyc2UocGFyc2VVcmwocmVxdWVzdC51cmwpLnF1ZXJ5KTtcbiAgICBuZXh0KCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGdldFBhdGhQYXJ0cyhwYXRoKSB7XG4gICAgY29uc3QgcGFydHMgPSBwYXRoLnNwbGl0KFwiL1wiKTtcbiAgICB3aGlsZSAocGFydHNbMF0gPT09IFwiXCIpIHBhcnRzLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHBhcnRzO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNQcmVmaXhPZihwcmVmaXgsIGFycmF5KSB7XG4gICAgcmV0dXJuIHByZWZpeC5sZW5ndGggPD0gYXJyYXkubGVuZ3RoICYmXG4gICAgICBwcmVmaXguZXZlcnkoKHBhcnQsIGkpID0+IHBhcnQgPT09IGFycmF5W2ldKTtcbiAgfVxuXG4gIC8vIFN0cmlwIG9mZiB0aGUgcGF0aCBwcmVmaXgsIGlmIGl0IGV4aXN0cy5cbiAgYXBwLnVzZShmdW5jdGlvbiAocmVxdWVzdCwgcmVzcG9uc2UsIG5leHQpIHtcbiAgICBjb25zdCBwYXRoUHJlZml4ID0gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWDtcbiAgICBjb25zdCB7IHBhdGhuYW1lIH0gPSBwYXJzZVVybChyZXF1ZXN0LnVybCk7XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgcGF0aCBpbiB0aGUgdXJsIHN0YXJ0cyB3aXRoIHRoZSBwYXRoIHByZWZpeFxuICAgIGlmIChwYXRoUHJlZml4KSB7XG4gICAgICBjb25zdCBwcmVmaXhQYXJ0cyA9IGdldFBhdGhQYXJ0cyhwYXRoUHJlZml4KTtcbiAgICAgIGNvbnN0IHBhdGhQYXJ0cyA9IGdldFBhdGhQYXJ0cyhwYXRobmFtZSk7XG4gICAgICBpZiAoaXNQcmVmaXhPZihwcmVmaXhQYXJ0cywgcGF0aFBhcnRzKSkge1xuICAgICAgICByZXF1ZXN0LnVybCA9IFwiL1wiICsgcGF0aFBhcnRzLnNsaWNlKHByZWZpeFBhcnRzLmxlbmd0aCkuam9pbihcIi9cIik7XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhdGhuYW1lID09PSBcIi9mYXZpY29uLmljb1wiIHx8XG4gICAgICAgIHBhdGhuYW1lID09PSBcIi9yb2JvdHMudHh0XCIpIHtcbiAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgfVxuXG4gICAgaWYgKHBhdGhQcmVmaXgpIHtcbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCg0MDQpO1xuICAgICAgcmVzcG9uc2Uud3JpdGUoXCJVbmtub3duIHBhdGhcIik7XG4gICAgICByZXNwb25zZS5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBuZXh0KCk7XG4gIH0pO1xuXG4gIC8vIFNlcnZlIHN0YXRpYyBmaWxlcyBmcm9tIHRoZSBtYW5pZmVzdC5cbiAgLy8gVGhpcyBpcyBpbnNwaXJlZCBieSB0aGUgJ3N0YXRpYycgbWlkZGxld2FyZS5cbiAgYXBwLnVzZShmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICBXZWJBcHBJbnRlcm5hbHMuc3RhdGljRmlsZXNNaWRkbGV3YXJlKFxuICAgICAgV2ViQXBwSW50ZXJuYWxzLnN0YXRpY0ZpbGVzQnlBcmNoLFxuICAgICAgcmVxLCByZXMsIG5leHRcbiAgICApO1xuICB9KTtcblxuICAvLyBDb3JlIE1ldGVvciBwYWNrYWdlcyBsaWtlIGR5bmFtaWMtaW1wb3J0IGNhbiBhZGQgaGFuZGxlcnMgYmVmb3JlXG4gIC8vIG90aGVyIGhhbmRsZXJzIGFkZGVkIGJ5IHBhY2thZ2UgYW5kIGFwcGxpY2F0aW9uIGNvZGUuXG4gIGFwcC51c2UoV2ViQXBwSW50ZXJuYWxzLm1ldGVvckludGVybmFsSGFuZGxlcnMgPSBjb25uZWN0KCkpO1xuXG4gIC8vIFBhY2thZ2VzIGFuZCBhcHBzIGNhbiBhZGQgaGFuZGxlcnMgdG8gdGhpcyB2aWEgV2ViQXBwLmNvbm5lY3RIYW5kbGVycy5cbiAgLy8gVGhleSBhcmUgaW5zZXJ0ZWQgYmVmb3JlIG91ciBkZWZhdWx0IGhhbmRsZXIuXG4gIHZhciBwYWNrYWdlQW5kQXBwSGFuZGxlcnMgPSBjb25uZWN0KCk7XG4gIGFwcC51c2UocGFja2FnZUFuZEFwcEhhbmRsZXJzKTtcblxuICB2YXIgc3VwcHJlc3NDb25uZWN0RXJyb3JzID0gZmFsc2U7XG4gIC8vIGNvbm5lY3Qga25vd3MgaXQgaXMgYW4gZXJyb3IgaGFuZGxlciBiZWNhdXNlIGl0IGhhcyA0IGFyZ3VtZW50cyBpbnN0ZWFkIG9mXG4gIC8vIDMuIGdvIGZpZ3VyZS4gIChJdCBpcyBub3Qgc21hcnQgZW5vdWdoIHRvIGZpbmQgc3VjaCBhIHRoaW5nIGlmIGl0J3MgaGlkZGVuXG4gIC8vIGluc2lkZSBwYWNrYWdlQW5kQXBwSGFuZGxlcnMuKVxuICBhcHAudXNlKGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgaWYgKCFlcnIgfHwgIXN1cHByZXNzQ29ubmVjdEVycm9ycyB8fCAhcmVxLmhlYWRlcnNbJ3gtc3VwcHJlc3MtZXJyb3InXSkge1xuICAgICAgbmV4dChlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXMud3JpdGVIZWFkKGVyci5zdGF0dXMsIHsgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJyB9KTtcbiAgICByZXMuZW5kKFwiQW4gZXJyb3IgbWVzc2FnZVwiKTtcbiAgfSk7XG5cbiAgYXBwLnVzZShhc3luYyBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICBpZiAoISBhcHBVcmwocmVxLnVybCkpIHtcbiAgICAgIHJldHVybiBuZXh0KCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGhlYWRlcnMgPSB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgfTtcblxuICAgICAgaWYgKHNodXR0aW5nRG93bikge1xuICAgICAgICBoZWFkZXJzWydDb25uZWN0aW9uJ10gPSAnQ2xvc2UnO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVxdWVzdCA9IFdlYkFwcC5jYXRlZ29yaXplUmVxdWVzdChyZXEpO1xuXG4gICAgICBpZiAocmVxdWVzdC51cmwucXVlcnkgJiYgcmVxdWVzdC51cmwucXVlcnlbJ21ldGVvcl9jc3NfcmVzb3VyY2UnXSkge1xuICAgICAgICAvLyBJbiB0aGlzIGNhc2UsIHdlJ3JlIHJlcXVlc3RpbmcgYSBDU1MgcmVzb3VyY2UgaW4gdGhlIG1ldGVvci1zcGVjaWZpY1xuICAgICAgICAvLyB3YXksIGJ1dCB3ZSBkb24ndCBoYXZlIGl0LiAgU2VydmUgYSBzdGF0aWMgY3NzIGZpbGUgdGhhdCBpbmRpY2F0ZXMgdGhhdFxuICAgICAgICAvLyB3ZSBkaWRuJ3QgaGF2ZSBpdCwgc28gd2UgY2FuIGRldGVjdCB0aGF0IGFuZCByZWZyZXNoLiAgTWFrZSBzdXJlXG4gICAgICAgIC8vIHRoYXQgYW55IHByb3hpZXMgb3IgQ0ROcyBkb24ndCBjYWNoZSB0aGlzIGVycm9yISAgKE5vcm1hbGx5IHByb3hpZXNcbiAgICAgICAgLy8gb3IgQ0ROcyBhcmUgc21hcnQgZW5vdWdoIG5vdCB0byBjYWNoZSBlcnJvciBwYWdlcywgYnV0IGluIG9yZGVyIHRvXG4gICAgICAgIC8vIG1ha2UgdGhpcyBoYWNrIHdvcmssIHdlIG5lZWQgdG8gcmV0dXJuIHRoZSBDU1MgZmlsZSBhcyBhIDIwMCwgd2hpY2hcbiAgICAgICAgLy8gd291bGQgb3RoZXJ3aXNlIGJlIGNhY2hlZC4pXG4gICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ3RleHQvY3NzOyBjaGFyc2V0PXV0Zi04JztcbiAgICAgICAgaGVhZGVyc1snQ2FjaGUtQ29udHJvbCddID0gJ25vLWNhY2hlJztcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIGhlYWRlcnMpO1xuICAgICAgICByZXMud3JpdGUoXCIubWV0ZW9yLWNzcy1ub3QtZm91bmQtZXJyb3IgeyB3aWR0aDogMHB4O31cIik7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVxdWVzdC51cmwucXVlcnkgJiYgcmVxdWVzdC51cmwucXVlcnlbJ21ldGVvcl9qc19yZXNvdXJjZSddKSB7XG4gICAgICAgIC8vIFNpbWlsYXJseSwgd2UncmUgcmVxdWVzdGluZyBhIEpTIHJlc291cmNlIHRoYXQgd2UgZG9uJ3QgaGF2ZS5cbiAgICAgICAgLy8gU2VydmUgYW4gdW5jYWNoZWQgNDA0LiAoV2UgY2FuJ3QgdXNlIHRoZSBzYW1lIGhhY2sgd2UgdXNlIGZvciBDU1MsXG4gICAgICAgIC8vIGJlY2F1c2UgYWN0dWFsbHkgYWN0aW5nIG9uIHRoYXQgaGFjayByZXF1aXJlcyB1cyB0byBoYXZlIHRoZSBKU1xuICAgICAgICAvLyBhbHJlYWR5ISlcbiAgICAgICAgaGVhZGVyc1snQ2FjaGUtQ29udHJvbCddID0gJ25vLWNhY2hlJztcbiAgICAgICAgcmVzLndyaXRlSGVhZCg0MDQsIGhlYWRlcnMpO1xuICAgICAgICByZXMuZW5kKFwiNDA0IE5vdCBGb3VuZFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVxdWVzdC51cmwucXVlcnkgJiYgcmVxdWVzdC51cmwucXVlcnlbJ21ldGVvcl9kb250X3NlcnZlX2luZGV4J10pIHtcbiAgICAgICAgLy8gV2hlbiBkb3dubG9hZGluZyBmaWxlcyBkdXJpbmcgYSBDb3Jkb3ZhIGhvdCBjb2RlIHB1c2gsIHdlIG5lZWRcbiAgICAgICAgLy8gdG8gZGV0ZWN0IGlmIGEgZmlsZSBpcyBub3QgYXZhaWxhYmxlIGluc3RlYWQgb2YgaW5hZHZlcnRlbnRseVxuICAgICAgICAvLyBkb3dubG9hZGluZyB0aGUgZGVmYXVsdCBpbmRleCBwYWdlLlxuICAgICAgICAvLyBTbyBzaW1pbGFyIHRvIHRoZSBzaXR1YXRpb24gYWJvdmUsIHdlIHNlcnZlIGFuIHVuY2FjaGVkIDQwNC5cbiAgICAgICAgaGVhZGVyc1snQ2FjaGUtQ29udHJvbCddID0gJ25vLWNhY2hlJztcbiAgICAgICAgcmVzLndyaXRlSGVhZCg0MDQsIGhlYWRlcnMpO1xuICAgICAgICByZXMuZW5kKFwiNDA0IE5vdCBGb3VuZFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGFyY2ggfSA9IGdldEFyY2hBbmRQYXRoKFxuICAgICAgICBwYXJzZVJlcXVlc3QocmVxKS5wYXRobmFtZSxcbiAgICAgICAgcmVxdWVzdC5icm93c2VyLFxuICAgICAgKTtcblxuICAgICAgLy8gSWYgcGF1c2VDbGllbnQoYXJjaCkgaGFzIGJlZW4gY2FsbGVkLCBwcm9ncmFtLnBhdXNlZCB3aWxsIGJlIGFcbiAgICAgIC8vIFByb21pc2UgdGhhdCB3aWxsIGJlIHJlc29sdmVkIHdoZW4gdGhlIHByb2dyYW0gaXMgdW5wYXVzZWQuXG4gICAgICBhd2FpdCBXZWJBcHAuY2xpZW50UHJvZ3JhbXNbYXJjaF0ucGF1c2VkO1xuXG4gICAgICByZXR1cm4gZ2V0Qm9pbGVycGxhdGVBc3luYyhyZXF1ZXN0LCBhcmNoKS50aGVuKCh7XG4gICAgICAgIHN0cmVhbSxcbiAgICAgICAgc3RhdHVzQ29kZSxcbiAgICAgICAgaGVhZGVyczogbmV3SGVhZGVycyxcbiAgICAgIH0pID0+IHtcbiAgICAgICAgaWYgKCFzdGF0dXNDb2RlKSB7XG4gICAgICAgICAgc3RhdHVzQ29kZSA9IHJlcy5zdGF0dXNDb2RlID8gcmVzLnN0YXR1c0NvZGUgOiAyMDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3SGVhZGVycykge1xuICAgICAgICAgIE9iamVjdC5hc3NpZ24oaGVhZGVycywgbmV3SGVhZGVycyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXMud3JpdGVIZWFkKHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuXG4gICAgICAgIHN0cmVhbS5waXBlKHJlcywge1xuICAgICAgICAgIC8vIEVuZCB0aGUgcmVzcG9uc2Ugd2hlbiB0aGUgc3RyZWFtIGVuZHMuXG4gICAgICAgICAgZW5kOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBMb2cuZXJyb3IoXCJFcnJvciBydW5uaW5nIHRlbXBsYXRlOiBcIiArIGVycm9yLnN0YWNrKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCg1MDAsIGhlYWRlcnMpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFJldHVybiA0MDQgYnkgZGVmYXVsdCwgaWYgbm8gb3RoZXIgaGFuZGxlcnMgc2VydmUgdGhpcyBVUkwuXG4gIGFwcC51c2UoZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gICAgcmVzLndyaXRlSGVhZCg0MDQpO1xuICAgIHJlcy5lbmQoKTtcbiAgfSk7XG5cblxuICB2YXIgaHR0cFNlcnZlciA9IGNyZWF0ZVNlcnZlcihhcHApO1xuICB2YXIgb25MaXN0ZW5pbmdDYWxsYmFja3MgPSBbXTtcblxuICAvLyBBZnRlciA1IHNlY29uZHMgdy9vIGRhdGEgb24gYSBzb2NrZXQsIGtpbGwgaXQuICBPbiB0aGUgb3RoZXIgaGFuZCwgaWZcbiAgLy8gdGhlcmUncyBhbiBvdXRzdGFuZGluZyByZXF1ZXN0LCBnaXZlIGl0IGEgaGlnaGVyIHRpbWVvdXQgaW5zdGVhZCAodG8gYXZvaWRcbiAgLy8ga2lsbGluZyBsb25nLXBvbGxpbmcgcmVxdWVzdHMpXG4gIGh0dHBTZXJ2ZXIuc2V0VGltZW91dChTSE9SVF9TT0NLRVRfVElNRU9VVCk7XG5cbiAgLy8gRG8gdGhpcyBoZXJlLCBhbmQgdGhlbiBhbHNvIGluIGxpdmVkYXRhL3N0cmVhbV9zZXJ2ZXIuanMsIGJlY2F1c2VcbiAgLy8gc3RyZWFtX3NlcnZlci5qcyBraWxscyBhbGwgdGhlIGN1cnJlbnQgcmVxdWVzdCBoYW5kbGVycyB3aGVuIGluc3RhbGxpbmcgaXRzXG4gIC8vIG93bi5cbiAgaHR0cFNlcnZlci5vbigncmVxdWVzdCcsIFdlYkFwcC5fdGltZW91dEFkanVzdG1lbnRSZXF1ZXN0Q2FsbGJhY2spO1xuXG4gIC8vIElmIHRoZSBjbGllbnQgZ2F2ZSB1cyBhIGJhZCByZXF1ZXN0LCB0ZWxsIGl0IGluc3RlYWQgb2YganVzdCBjbG9zaW5nIHRoZVxuICAvLyBzb2NrZXQuIFRoaXMgbGV0cyBsb2FkIGJhbGFuY2VycyBpbiBmcm9udCBvZiB1cyBkaWZmZXJlbnRpYXRlIGJldHdlZW4gXCJhXG4gIC8vIHNlcnZlciBpcyByYW5kb21seSBjbG9zaW5nIHNvY2tldHMgZm9yIG5vIHJlYXNvblwiIGFuZCBcImNsaWVudCBzZW50IGEgYmFkXG4gIC8vIHJlcXVlc3RcIi5cbiAgLy9cbiAgLy8gVGhpcyB3aWxsIG9ubHkgd29yayBvbiBOb2RlIDY7IE5vZGUgNCBkZXN0cm95cyB0aGUgc29ja2V0IGJlZm9yZSBjYWxsaW5nXG4gIC8vIHRoaXMgZXZlbnQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvcHVsbC80NTU3LyBmb3IgZGV0YWlscy5cbiAgaHR0cFNlcnZlci5vbignY2xpZW50RXJyb3InLCAoZXJyLCBzb2NrZXQpID0+IHtcbiAgICAvLyBQcmUtTm9kZS02LCBkbyBub3RoaW5nLlxuICAgIGlmIChzb2NrZXQuZGVzdHJveWVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVyci5tZXNzYWdlID09PSAnUGFyc2UgRXJyb3InKSB7XG4gICAgICBzb2NrZXQuZW5kKCdIVFRQLzEuMSA0MDAgQmFkIFJlcXVlc3RcXHJcXG5cXHJcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIG90aGVyIGVycm9ycywgdXNlIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGFzIGlmIHdlIGhhZCBubyBjbGllbnRFcnJvclxuICAgICAgLy8gaGFuZGxlci5cbiAgICAgIHNvY2tldC5kZXN0cm95KGVycik7XG4gICAgfVxuICB9KTtcblxuICAvLyBzdGFydCB1cCBhcHBcbiAgXy5leHRlbmQoV2ViQXBwLCB7XG4gICAgY29ubmVjdEhhbmRsZXJzOiBwYWNrYWdlQW5kQXBwSGFuZGxlcnMsXG4gICAgcmF3Q29ubmVjdEhhbmRsZXJzOiByYXdDb25uZWN0SGFuZGxlcnMsXG4gICAgaHR0cFNlcnZlcjogaHR0cFNlcnZlcixcbiAgICBjb25uZWN0QXBwOiBhcHAsXG4gICAgLy8gRm9yIHRlc3RpbmcuXG4gICAgc3VwcHJlc3NDb25uZWN0RXJyb3JzOiBmdW5jdGlvbiAoKSB7XG4gICAgICBzdXBwcmVzc0Nvbm5lY3RFcnJvcnMgPSB0cnVlO1xuICAgIH0sXG4gICAgb25MaXN0ZW5pbmc6IGZ1bmN0aW9uIChmKSB7XG4gICAgICBpZiAob25MaXN0ZW5pbmdDYWxsYmFja3MpXG4gICAgICAgIG9uTGlzdGVuaW5nQ2FsbGJhY2tzLnB1c2goZik7XG4gICAgICBlbHNlXG4gICAgICAgIGYoKTtcbiAgICB9LFxuICAgIC8vIFRoaXMgY2FuIGJlIG92ZXJyaWRkZW4gYnkgdXNlcnMgd2hvIHdhbnQgdG8gbW9kaWZ5IGhvdyBsaXN0ZW5pbmcgd29ya3NcbiAgICAvLyAoZWcsIHRvIHJ1biBhIHByb3h5IGxpa2UgQXBvbGxvIEVuZ2luZSBQcm94eSBpbiBmcm9udCBvZiB0aGUgc2VydmVyKS5cbiAgICBzdGFydExpc3RlbmluZzogZnVuY3Rpb24gKGh0dHBTZXJ2ZXIsIGxpc3Rlbk9wdGlvbnMsIGNiKSB7XG4gICAgICBodHRwU2VydmVyLmxpc3RlbihsaXN0ZW5PcHRpb25zLCBjYik7XG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gTGV0IHRoZSByZXN0IG9mIHRoZSBwYWNrYWdlcyAoYW5kIE1ldGVvci5zdGFydHVwIGhvb2tzKSBpbnNlcnQgY29ubmVjdFxuICAvLyBtaWRkbGV3YXJlcyBhbmQgdXBkYXRlIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18sIHRoZW4ga2VlcCBnb2luZyB0byBzZXQgdXBcbiAgLy8gYWN0dWFsbHkgc2VydmluZyBIVE1MLlxuICBleHBvcnRzLm1haW4gPSBhcmd2ID0+IHtcbiAgICBXZWJBcHBJbnRlcm5hbHMuZ2VuZXJhdGVCb2lsZXJwbGF0ZSgpO1xuXG4gICAgY29uc3Qgc3RhcnRIdHRwU2VydmVyID0gbGlzdGVuT3B0aW9ucyA9PiB7XG4gICAgICBXZWJBcHAuc3RhcnRMaXN0ZW5pbmcoaHR0cFNlcnZlciwgbGlzdGVuT3B0aW9ucywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKSA9PiB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5NRVRFT1JfUFJJTlRfT05fTElTVEVOKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJMSVNURU5JTkdcIik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gb25MaXN0ZW5pbmdDYWxsYmFja3M7XG4gICAgICAgIG9uTGlzdGVuaW5nQ2FsbGJhY2tzID0gbnVsbDtcbiAgICAgICAgY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4geyBjYWxsYmFjaygpOyB9KTtcbiAgICAgIH0sIGUgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbGlzdGVuaW5nOlwiLCBlKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlICYmIGUuc3RhY2spO1xuICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBsZXQgbG9jYWxQb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAwO1xuICAgIGNvbnN0IHVuaXhTb2NrZXRQYXRoID0gcHJvY2Vzcy5lbnYuVU5JWF9TT0NLRVRfUEFUSDtcblxuICAgIGlmICh1bml4U29ja2V0UGF0aCkge1xuICAgICAgLy8gU3RhcnQgdGhlIEhUVFAgc2VydmVyIHVzaW5nIGEgc29ja2V0IGZpbGUuXG4gICAgICByZW1vdmVFeGlzdGluZ1NvY2tldEZpbGUodW5peFNvY2tldFBhdGgpO1xuICAgICAgc3RhcnRIdHRwU2VydmVyKHsgcGF0aDogdW5peFNvY2tldFBhdGggfSk7XG4gICAgICByZWdpc3RlclNvY2tldEZpbGVDbGVhbnVwKHVuaXhTb2NrZXRQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9jYWxQb3J0ID0gaXNOYU4oTnVtYmVyKGxvY2FsUG9ydCkpID8gbG9jYWxQb3J0IDogTnVtYmVyKGxvY2FsUG9ydCk7XG4gICAgICBpZiAoL1xcXFxcXFxcPy4rXFxcXHBpcGVcXFxcPy4rLy50ZXN0KGxvY2FsUG9ydCkpIHtcbiAgICAgICAgLy8gU3RhcnQgdGhlIEhUVFAgc2VydmVyIHVzaW5nIFdpbmRvd3MgU2VydmVyIHN0eWxlIG5hbWVkIHBpcGUuXG4gICAgICAgIHN0YXJ0SHR0cFNlcnZlcih7IHBhdGg6IGxvY2FsUG9ydCB9KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxvY2FsUG9ydCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAvLyBTdGFydCB0aGUgSFRUUCBzZXJ2ZXIgdXNpbmcgVENQLlxuICAgICAgICBzdGFydEh0dHBTZXJ2ZXIoe1xuICAgICAgICAgIHBvcnQ6IGxvY2FsUG9ydCxcbiAgICAgICAgICBob3N0OiBwcm9jZXNzLmVudi5CSU5EX0lQIHx8IFwiMC4wLjAuMFwiXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBQT1JUIHNwZWNpZmllZFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXCJEQUVNT05cIjtcbiAgfTtcbn1cblxudmFyIGlubGluZVNjcmlwdHNBbGxvd2VkID0gdHJ1ZTtcblxuV2ViQXBwSW50ZXJuYWxzLmlubGluZVNjcmlwdHNBbGxvd2VkID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gaW5saW5lU2NyaXB0c0FsbG93ZWQ7XG59O1xuXG5XZWJBcHBJbnRlcm5hbHMuc2V0SW5saW5lU2NyaXB0c0FsbG93ZWQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaW5saW5lU2NyaXB0c0FsbG93ZWQgPSB2YWx1ZTtcbiAgV2ViQXBwSW50ZXJuYWxzLmdlbmVyYXRlQm9pbGVycGxhdGUoKTtcbn07XG5cbnZhciBzcmlNb2RlO1xuXG5XZWJBcHBJbnRlcm5hbHMuZW5hYmxlU3VicmVzb3VyY2VJbnRlZ3JpdHkgPSBmdW5jdGlvbih1c2VfY3JlZGVudGlhbHMgPSBmYWxzZSkge1xuICBzcmlNb2RlID0gdXNlX2NyZWRlbnRpYWxzID8gJ3VzZS1jcmVkZW50aWFscycgOiAnYW5vbnltb3VzJztcbiAgV2ViQXBwSW50ZXJuYWxzLmdlbmVyYXRlQm9pbGVycGxhdGUoKTtcbn07XG5cbldlYkFwcEludGVybmFscy5zZXRCdW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayA9IGZ1bmN0aW9uIChob29rRm4pIHtcbiAgYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2sgPSBob29rRm47XG4gIFdlYkFwcEludGVybmFscy5nZW5lcmF0ZUJvaWxlcnBsYXRlKCk7XG59O1xuXG5XZWJBcHBJbnRlcm5hbHMuc2V0QnVuZGxlZEpzQ3NzUHJlZml4ID0gZnVuY3Rpb24gKHByZWZpeCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuc2V0QnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2soXG4gICAgZnVuY3Rpb24gKHVybCkge1xuICAgICAgcmV0dXJuIHByZWZpeCArIHVybDtcbiAgfSk7XG59O1xuXG4vLyBQYWNrYWdlcyBjYW4gY2FsbCBgV2ViQXBwSW50ZXJuYWxzLmFkZFN0YXRpY0pzYCB0byBzcGVjaWZ5IHN0YXRpY1xuLy8gSmF2YVNjcmlwdCB0byBiZSBpbmNsdWRlZCBpbiB0aGUgYXBwLiBUaGlzIHN0YXRpYyBKUyB3aWxsIGJlIGlubGluZWQsXG4vLyB1bmxlc3MgaW5saW5lIHNjcmlwdHMgaGF2ZSBiZWVuIGRpc2FibGVkLCBpbiB3aGljaCBjYXNlIGl0IHdpbGwgYmVcbi8vIHNlcnZlZCB1bmRlciBgLzxzaGExIG9mIGNvbnRlbnRzPmAuXG52YXIgYWRkaXRpb25hbFN0YXRpY0pzID0ge307XG5XZWJBcHBJbnRlcm5hbHMuYWRkU3RhdGljSnMgPSBmdW5jdGlvbiAoY29udGVudHMpIHtcbiAgYWRkaXRpb25hbFN0YXRpY0pzW1wiL1wiICsgc2hhMShjb250ZW50cykgKyBcIi5qc1wiXSA9IGNvbnRlbnRzO1xufTtcblxuLy8gRXhwb3J0ZWQgZm9yIHRlc3RzXG5XZWJBcHBJbnRlcm5hbHMuZ2V0Qm9pbGVycGxhdGUgPSBnZXRCb2lsZXJwbGF0ZTtcbldlYkFwcEludGVybmFscy5hZGRpdGlvbmFsU3RhdGljSnMgPSBhZGRpdGlvbmFsU3RhdGljSnM7XG5cbi8vIFN0YXJ0IHRoZSBzZXJ2ZXIhXG5ydW5XZWJBcHBTZXJ2ZXIoKTtcbiIsImltcG9ydCBucG1Db25uZWN0IGZyb20gXCJjb25uZWN0XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0KC4uLmNvbm5lY3RBcmdzKSB7XG4gIGNvbnN0IGhhbmRsZXJzID0gbnBtQ29ubmVjdC5hcHBseSh0aGlzLCBjb25uZWN0QXJncyk7XG4gIGNvbnN0IG9yaWdpbmFsVXNlID0gaGFuZGxlcnMudXNlO1xuXG4gIC8vIFdyYXAgdGhlIGhhbmRsZXJzLnVzZSBtZXRob2Qgc28gdGhhdCBhbnkgcHJvdmlkZWQgaGFuZGxlciBmdW5jdGlvbnNcbiAgLy8gYWx3YXkgcnVuIGluIGEgRmliZXIuXG4gIGhhbmRsZXJzLnVzZSA9IGZ1bmN0aW9uIHVzZSguLi51c2VBcmdzKSB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGhpcztcbiAgICBjb25zdCBvcmlnaW5hbExlbmd0aCA9IHN0YWNrLmxlbmd0aDtcbiAgICBjb25zdCByZXN1bHQgPSBvcmlnaW5hbFVzZS5hcHBseSh0aGlzLCB1c2VBcmdzKTtcblxuICAgIC8vIElmIHdlIGp1c3QgYWRkZWQgYW55dGhpbmcgdG8gdGhlIHN0YWNrLCB3cmFwIGVhY2ggbmV3IGVudHJ5LmhhbmRsZVxuICAgIC8vIHdpdGggYSBmdW5jdGlvbiB0aGF0IGNhbGxzIFByb21pc2UuYXN5bmNBcHBseSB0byBlbnN1cmUgdGhlXG4gICAgLy8gb3JpZ2luYWwgaGFuZGxlciBydW5zIGluIGEgRmliZXIuXG4gICAgZm9yIChsZXQgaSA9IG9yaWdpbmFsTGVuZ3RoOyBpIDwgc3RhY2subGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gc3RhY2tbaV07XG4gICAgICBjb25zdCBvcmlnaW5hbEhhbmRsZSA9IGVudHJ5LmhhbmRsZTtcblxuICAgICAgaWYgKG9yaWdpbmFsSGFuZGxlLmxlbmd0aCA+PSA0KSB7XG4gICAgICAgIC8vIElmIHRoZSBvcmlnaW5hbCBoYW5kbGUgaGFkIGZvdXIgKG9yIG1vcmUpIHBhcmFtZXRlcnMsIHRoZVxuICAgICAgICAvLyB3cmFwcGVyIG11c3QgYWxzbyBoYXZlIGZvdXIgcGFyYW1ldGVycywgc2luY2UgY29ubmVjdCB1c2VzXG4gICAgICAgIC8vIGhhbmRsZS5sZW5ndGggdG8gZGVybWluZSB3aGV0aGVyIHRvIHBhc3MgdGhlIGVycm9yIGFzIHRoZSBmaXJzdFxuICAgICAgICAvLyBhcmd1bWVudCB0byB0aGUgaGFuZGxlIGZ1bmN0aW9uLlxuICAgICAgICBlbnRyeS5oYW5kbGUgPSBmdW5jdGlvbiBoYW5kbGUoZXJyLCByZXEsIHJlcywgbmV4dCkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLmFzeW5jQXBwbHkob3JpZ2luYWxIYW5kbGUsIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnRyeS5oYW5kbGUgPSBmdW5jdGlvbiBoYW5kbGUocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hc3luY0FwcGx5KG9yaWdpbmFsSGFuZGxlLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgcmV0dXJuIGhhbmRsZXJzO1xufVxuIiwiaW1wb3J0IHsgc3RhdFN5bmMsIHVubGlua1N5bmMsIGV4aXN0c1N5bmMgfSBmcm9tICdmcyc7XG5cbi8vIFNpbmNlIGEgbmV3IHNvY2tldCBmaWxlIHdpbGwgYmUgY3JlYXRlZCB3aGVuIHRoZSBIVFRQIHNlcnZlclxuLy8gc3RhcnRzIHVwLCBpZiBmb3VuZCByZW1vdmUgdGhlIGV4aXN0aW5nIGZpbGUuXG4vL1xuLy8gV0FSTklORzpcbi8vIFRoaXMgd2lsbCByZW1vdmUgdGhlIGNvbmZpZ3VyZWQgc29ja2V0IGZpbGUgd2l0aG91dCB3YXJuaW5nLiBJZlxuLy8gdGhlIGNvbmZpZ3VyZWQgc29ja2V0IGZpbGUgaXMgYWxyZWFkeSBpbiB1c2UgYnkgYW5vdGhlciBhcHBsaWNhdGlvbixcbi8vIGl0IHdpbGwgc3RpbGwgYmUgcmVtb3ZlZC4gTm9kZSBkb2VzIG5vdCBwcm92aWRlIGEgcmVsaWFibGUgd2F5IHRvXG4vLyBkaWZmZXJlbnRpYXRlIGJldHdlZW4gYSBzb2NrZXQgZmlsZSB0aGF0IGlzIGFscmVhZHkgaW4gdXNlIGJ5XG4vLyBhbm90aGVyIGFwcGxpY2F0aW9uIG9yIGEgc3RhbGUgc29ja2V0IGZpbGUgdGhhdCBoYXMgYmVlblxuLy8gbGVmdCBvdmVyIGFmdGVyIGEgU0lHS0lMTC4gU2luY2Ugd2UgaGF2ZSBubyByZWxpYWJsZSB3YXkgdG9cbi8vIGRpZmZlcmVudGlhdGUgYmV0d2VlbiB0aGVzZSB0d28gc2NlbmFyaW9zLCB0aGUgYmVzdCBjb3Vyc2Ugb2Zcbi8vIGFjdGlvbiBkdXJpbmcgc3RhcnR1cCBpcyB0byByZW1vdmUgYW55IGV4aXN0aW5nIHNvY2tldCBmaWxlLiBUaGlzXG4vLyBpcyBub3QgdGhlIHNhZmVzdCBjb3Vyc2Ugb2YgYWN0aW9uIGFzIHJlbW92aW5nIHRoZSBleGlzdGluZyBzb2NrZXRcbi8vIGZpbGUgY291bGQgaW1wYWN0IGFuIGFwcGxpY2F0aW9uIHVzaW5nIGl0LCBidXQgdGhpcyBhcHByb2FjaCBoZWxwc1xuLy8gZW5zdXJlIHRoZSBIVFRQIHNlcnZlciBjYW4gc3RhcnR1cCB3aXRob3V0IG1hbnVhbFxuLy8gaW50ZXJ2ZW50aW9uIChlLmcuIGFza2luZyBmb3IgdGhlIHZlcmlmaWNhdGlvbiBhbmQgY2xlYW51cCBvZiBzb2NrZXRcbi8vIGZpbGVzIGJlZm9yZSBhbGxvd2luZyB0aGUgSFRUUCBzZXJ2ZXIgdG8gYmUgc3RhcnRlZCkuXG4vL1xuLy8gVGhlIGFib3ZlIGJlaW5nIHNhaWQsIGFzIGxvbmcgYXMgdGhlIHNvY2tldCBmaWxlIHBhdGggaXNcbi8vIGNvbmZpZ3VyZWQgY2FyZWZ1bGx5IHdoZW4gdGhlIGFwcGxpY2F0aW9uIGlzIGRlcGxveWVkIChhbmQgZXh0cmFcbi8vIGNhcmUgaXMgdGFrZW4gdG8gbWFrZSBzdXJlIHRoZSBjb25maWd1cmVkIHBhdGggaXMgdW5pcXVlIGFuZCBkb2Vzbid0XG4vLyBjb25mbGljdCB3aXRoIGFub3RoZXIgc29ja2V0IGZpbGUgcGF0aCksIHRoZW4gdGhlcmUgc2hvdWxkIG5vdCBiZVxuLy8gYW55IGlzc3VlcyB3aXRoIHRoaXMgYXBwcm9hY2guXG5leHBvcnQgY29uc3QgcmVtb3ZlRXhpc3RpbmdTb2NrZXRGaWxlID0gKHNvY2tldFBhdGgpID0+IHtcbiAgdHJ5IHtcbiAgICBpZiAoc3RhdFN5bmMoc29ja2V0UGF0aCkuaXNTb2NrZXQoKSkge1xuICAgICAgLy8gU2luY2UgYSBuZXcgc29ja2V0IGZpbGUgd2lsbCBiZSBjcmVhdGVkLCByZW1vdmUgdGhlIGV4aXN0aW5nXG4gICAgICAvLyBmaWxlLlxuICAgICAgdW5saW5rU3luYyhzb2NrZXRQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgQW4gZXhpc3RpbmcgZmlsZSB3YXMgZm91bmQgYXQgXCIke3NvY2tldFBhdGh9XCIgYW5kIGl0IGlzIG5vdCBgICtcbiAgICAgICAgJ2Egc29ja2V0IGZpbGUuIFBsZWFzZSBjb25maXJtIFBPUlQgaXMgcG9pbnRpbmcgdG8gdmFsaWQgYW5kICcgK1xuICAgICAgICAndW4tdXNlZCBzb2NrZXQgZmlsZSBwYXRoLidcbiAgICAgICk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIElmIHRoZXJlIGlzIG5vIGV4aXN0aW5nIHNvY2tldCBmaWxlIHRvIGNsZWFudXAsIGdyZWF0LCB3ZSdsbFxuICAgIC8vIGNvbnRpbnVlIG5vcm1hbGx5LiBJZiB0aGUgY2F1Z2h0IGV4Y2VwdGlvbiByZXByZXNlbnRzIGFueSBvdGhlclxuICAgIC8vIGlzc3VlLCByZS10aHJvdy5cbiAgICBpZiAoZXJyb3IuY29kZSAhPT0gJ0VOT0VOVCcpIHtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufTtcblxuLy8gUmVtb3ZlIHRoZSBzb2NrZXQgZmlsZSB3aGVuIGRvbmUgdG8gYXZvaWQgbGVhdmluZyBiZWhpbmQgYSBzdGFsZSBvbmUuXG4vLyBOb3RlIC0gYSBzdGFsZSBzb2NrZXQgZmlsZSBpcyBzdGlsbCBsZWZ0IGJlaGluZCBpZiB0aGUgcnVubmluZyBub2RlXG4vLyBwcm9jZXNzIGlzIGtpbGxlZCB2aWEgc2lnbmFsIDkgLSBTSUdLSUxMLlxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyU29ja2V0RmlsZUNsZWFudXAgPVxuICAoc29ja2V0UGF0aCwgZXZlbnRFbWl0dGVyID0gcHJvY2VzcykgPT4ge1xuICAgIFsnZXhpdCcsICdTSUdJTlQnLCAnU0lHSFVQJywgJ1NJR1RFUk0nXS5mb3JFYWNoKHNpZ25hbCA9PiB7XG4gICAgICBldmVudEVtaXR0ZXIub24oc2lnbmFsLCBNZXRlb3IuYmluZEVudmlyb25tZW50KCgpID0+IHtcbiAgICAgICAgaWYgKGV4aXN0c1N5bmMoc29ja2V0UGF0aCkpIHtcbiAgICAgICAgICB1bmxpbmtTeW5jKHNvY2tldFBhdGgpO1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfSk7XG4gIH07XG4iXX0=
