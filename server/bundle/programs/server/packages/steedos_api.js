(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var ECMAScript = Package.ecmascript.ECMAScript;
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var DDPCommon = Package['ddp-common'].DDPCommon;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Accounts = Package['accounts-base'].Accounts;
var SHA256 = Package.sha.SHA256;
var NpmModuleBcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var Push = Package['raix:push'].Push;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Tabular = Package['aldeed:tabular'].Tabular;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var HuaweiPush = Package['steedos:huaweipush'].HuaweiPush;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var FS = Package['steedos:cfs-base-package'].FS;

/* Package-scope variables */
var __coffeescriptShare, ironRouterSendErrorToResponse, msg;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:api":{"checkNpm.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/checkNpm.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  'aliyun-sdk': '>=1.9.2',
  busboy: ">=0.2.13",
  cookies: ">=0.6.2",
  'csv': ">=5.1.2",
  'url': '>=0.10.0',
  'request': '>=2.81.0',
  'xinge': '>=1.1.3',
  'huawei-push': '>=0.0.6-0',
  'xiaomi-push': '>=0.4.5'
}, 'steedos:api');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_files.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/parse_files.coffee                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Busboy, Fiber;
Busboy = require('busboy');
Fiber = require('fibers');

JsonRoutes.parseFiles = function (req, res, next) {
  var busboy, files;
  files = [];

  if (req.method === "POST") {
    busboy = new Busboy({
      headers: req.headers
    });
    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      var buffers, image;
      image = {};
      image.mimeType = mimetype;
      image.encoding = encoding;
      image.filename = filename;
      buffers = [];
      file.on('data', function (data) {
        return buffers.push(data);
      });
      return file.on('end', function () {
        image.data = Buffer.concat(buffers);
        return files.push(image);
      });
    });
    busboy.on("field", function (fieldname, value) {
      return req.body[fieldname] = value;
    });
    busboy.on("finish", function () {
      req.files = files;
      return Fiber(function () {
        return next();
      }).run();
    });
    return req.pipe(busboy);
  } else {
    return next();
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"restivus":{"auth.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/lib/restivus/auth.coffee                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var getUserQuerySelector, userValidator;
this.Auth || (this.Auth = {}); /*
                                 A valid user will have exactly one of the following identification fields: id, username, or email
                                */
userValidator = Match.Where(function (user) {
  check(user, {
    id: Match.Optional(String),
    username: Match.Optional(String),
    email: Match.Optional(String)
  });

  if (_.keys(user).length === !1) {
    throw new Match.Error('User must have exactly one identifier field');
  }

  return true;
}); /*
      Return a MongoDB query selector for finding the given user
     */

getUserQuerySelector = function (user) {
  if (user.id) {
    return {
      '_id': user.id
    };
  } else if (user.username) {
    return {
      'username': user.username
    };
  } else if (user.email) {
    return {
      'emails.address': user.email
    };
  }

  throw new Error('Cannot create selector from invalid user');
}; /*
     Log a user in with their password
    */

this.Auth.loginWithPassword = function (user, password) {
  var authToken, authenticatingUser, authenticatingUserSelector, hashedToken, passwordVerification, ref, space_users, spaces;

  if (!user || !password) {
    throw new Meteor.Error(401, 'Unauthorized');
  }

  check(user, userValidator);
  check(password, String);
  authenticatingUserSelector = getUserQuerySelector(user);
  authenticatingUser = Meteor.users.findOne(authenticatingUserSelector);

  if (!authenticatingUser) {
    throw new Meteor.Error(401, 'Unauthorized');
  }

  if (!((ref = authenticatingUser.services) != null ? ref.password : void 0)) {
    throw new Meteor.Error(401, 'Unauthorized');
  }

  passwordVerification = Accounts._checkPassword(authenticatingUser, password);

  if (passwordVerification.error) {
    throw new Meteor.Error(401, 'Unauthorized');
  }

  authToken = Accounts._generateStampedLoginToken();
  hashedToken = Accounts._hashStampedToken(authToken);

  Accounts._insertHashedLoginToken(authenticatingUser._id, hashedToken);

  space_users = db.space_users.find({
    user: authenticatingUser._id
  }).fetch();
  spaces = [];

  _.each(space_users, function (su) {
    var space;
    space = db.spaces.findOne(su.space);

    if ((space != null ? space.is_paid : void 0) && _.indexOf(space.admins, su.user) >= 0) {
      return spaces.push({
        _id: space._id,
        name: space.name
      });
    }
  });

  return {
    authToken: authToken.token,
    userId: authenticatingUser._id,
    adminSpaces: spaces
  };
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"iron-router-error-to-response.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/lib/restivus/iron-router-error-to-response.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// We need a function that treats thrown errors exactly like Iron Router would.
// This file is written in JavaScript to enable copy-pasting Iron Router code.
// Taken from: https://github.com/iron-meteor/iron-router/blob/9c369499c98af9fd12ef9e68338dee3b1b1276aa/lib/router_server.js#L3
var env = process.env.NODE_ENV || 'development'; // Taken from: https://github.com/iron-meteor/iron-router/blob/9c369499c98af9fd12ef9e68338dee3b1b1276aa/lib/router_server.js#L47

ironRouterSendErrorToResponse = function (err, req, res) {
  if (res.statusCode < 400) res.statusCode = 500;
  if (err.status) res.statusCode = err.status;
  if (env === 'development') msg = (err.stack || err.toString()) + '\n';else //XXX get this from standard dict of error messages?
    msg = 'Server error.';
  console.error(err.stack || err.toString());
  if (res.headersSent) return req.socket.destroy();
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(msg));
  if (req.method === 'HEAD') return res.end();
  res.end(msg);
  return;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"route.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/lib/restivus/route.coffee                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
share.Route = function () {
  function Route(api, path, options, endpoints1) {
    this.api = api;
    this.path = path;
    this.options = options;
    this.endpoints = endpoints1;

    if (!this.endpoints) {
      this.endpoints = this.options;
      this.options = {};
    }
  }

  Route.prototype.addToApi = function () {
    var availableMethods;
    availableMethods = ['get', 'post', 'put', 'patch', 'delete', 'options'];
    return function () {
      var allowedMethods, fullPath, rejectedMethods, self;
      self = this;

      if (_.contains(this.api._config.paths, this.path)) {
        throw new Error("Cannot add a route at an existing path: " + this.path);
      }

      this.endpoints = _.extend({
        options: this.api._config.defaultOptionsEndpoint
      }, this.endpoints);

      this._resolveEndpoints();

      this._configureEndpoints();

      this.api._config.paths.push(this.path);

      allowedMethods = _.filter(availableMethods, function (method) {
        return _.contains(_.keys(self.endpoints), method);
      });
      rejectedMethods = _.reject(availableMethods, function (method) {
        return _.contains(_.keys(self.endpoints), method);
      });
      fullPath = this.api._config.apiPath + this.path;

      _.each(allowedMethods, function (method) {
        var endpoint;
        endpoint = self.endpoints[method];
        return JsonRoutes.add(method, fullPath, function (req, res) {
          var doneFunc, endpointContext, error, responseData, responseInitiated;
          responseInitiated = false;

          doneFunc = function () {
            return responseInitiated = true;
          };

          endpointContext = {
            urlParams: req.params,
            queryParams: req.query,
            bodyParams: req.body,
            request: req,
            response: res,
            done: doneFunc
          };

          _.extend(endpointContext, endpoint);

          responseData = null;

          try {
            responseData = self._callEndpoint(endpointContext, endpoint);
          } catch (error1) {
            error = error1;
            ironRouterSendErrorToResponse(error, req, res);
            return;
          }

          if (responseInitiated) {
            res.end();
            return;
          } else {
            if (res.headersSent) {
              throw new Error("Must call this.done() after handling endpoint response manually: " + method + " " + fullPath);
            } else if (responseData === null || responseData === void 0) {
              throw new Error("Cannot return null or undefined from an endpoint: " + method + " " + fullPath);
            }
          }

          if (responseData.body && (responseData.statusCode || responseData.headers)) {
            return self._respond(res, responseData.body, responseData.statusCode, responseData.headers);
          } else {
            return self._respond(res, responseData);
          }
        });
      });

      return _.each(rejectedMethods, function (method) {
        return JsonRoutes.add(method, fullPath, function (req, res) {
          var headers, responseData;
          responseData = {
            status: 'error',
            message: 'API endpoint does not exist'
          };
          headers = {
            'Allow': allowedMethods.join(', ').toUpperCase()
          };
          return self._respond(res, responseData, 405, headers);
        });
      });
    };
  }(); /*
         Convert all endpoints on the given route into our expected endpoint object if it is a bare
         function
       
         @param {Route} route The route the endpoints belong to
        */

  Route.prototype._resolveEndpoints = function () {
    _.each(this.endpoints, function (endpoint, method, endpoints) {
      if (_.isFunction(endpoint)) {
        return endpoints[method] = {
          action: endpoint
        };
      }
    });
  }; /*
       Configure the authentication and role requirement on all endpoints (except OPTIONS, which must
       be configured directly on the endpoint)
     
       Authentication can be required on an entire route or individual endpoints. If required on an
       entire route, that serves as the default. If required in any individual endpoints, that will
       override the default.
     
       After the endpoint is configured, all authentication and role requirements of an endpoint can be
       accessed at <code>endpoint.authRequired</code> and <code>endpoint.roleRequired</code>,
       respectively.
     
       @param {Route} route The route the endpoints belong to
       @param {Endpoint} endpoint The endpoint to configure
      */

  Route.prototype._configureEndpoints = function () {
    _.each(this.endpoints, function (endpoint, method) {
      var ref, ref1, ref2;

      if (method !== 'options') {
        if (!((ref = this.options) != null ? ref.roleRequired : void 0)) {
          this.options.roleRequired = [];
        }

        if (!endpoint.roleRequired) {
          endpoint.roleRequired = [];
        }

        endpoint.roleRequired = _.union(endpoint.roleRequired, this.options.roleRequired);

        if (_.isEmpty(endpoint.roleRequired)) {
          endpoint.roleRequired = false;
        }

        if (endpoint.authRequired === void 0) {
          if (((ref1 = this.options) != null ? ref1.authRequired : void 0) || endpoint.roleRequired) {
            endpoint.authRequired = true;
          } else {
            endpoint.authRequired = false;
          }
        }

        if ((ref2 = this.options) != null ? ref2.spaceRequired : void 0) {
          endpoint.spaceRequired = this.options.spaceRequired;
        }
      }
    }, this);
  }; /*
       Authenticate an endpoint if required, and return the result of calling it
     
       @returns The endpoint response or a 401 if authentication fails
      */

  Route.prototype._callEndpoint = function (endpointContext, endpoint) {
    var invocation;

    if (this._authAccepted(endpointContext, endpoint)) {
      if (this._roleAccepted(endpointContext, endpoint)) {
        if (this._spaceAccepted(endpointContext, endpoint)) {
          invocation = new DDPCommon.MethodInvocation({
            isSimulation: true,
            userId: endpointContext.userId,
            connection: null,
            randomSeed: DDPCommon.makeRpcSeed()
          });
          return DDP._CurrentInvocation.withValue(invocation, function () {
            return endpoint.action.call(endpointContext);
          });
        } else {
          return {
            statusCode: 403,
            body: {
              status: 'error',
              message: 'Bad X-Space-Id, Only admins of paid space can call this api.'
            }
          };
        }
      } else {
        return {
          statusCode: 403,
          body: {
            status: 'error',
            message: 'You do not have permission to do this.'
          }
        };
      }
    } else {
      return {
        statusCode: 401,
        body: {
          status: 'error',
          message: 'You must be logged in to do this.'
        }
      };
    }
  }; /*
       Authenticate the given endpoint if required
     
       Once it's globally configured in the API, authentication can be required on an entire route or
       individual endpoints. If required on an entire endpoint, that serves as the default. If required
       in any individual endpoints, that will override the default.
     
       @returns False if authentication fails, and true otherwise
      */

  Route.prototype._authAccepted = function (endpointContext, endpoint) {
    if (endpoint.authRequired) {
      return this._authenticate(endpointContext);
    } else {
      return true;
    }
  }; /*
       Verify the request is being made by an actively logged in user
     
       If verified, attach the authenticated user to the context.
     
       @returns {Boolean} True if the authentication was successful
      */

  Route.prototype._authenticate = function (endpointContext) {
    var auth, userSelector;
    auth = this.api._config.auth.user.call(endpointContext);

    if ((auth != null ? auth.userId : void 0) && (auth != null ? auth.token : void 0) && !(auth != null ? auth.user : void 0)) {
      userSelector = {};
      userSelector._id = auth.userId;
      userSelector[this.api._config.auth.token] = auth.token;
      auth.user = Meteor.users.findOne(userSelector);
    }

    if (auth != null ? auth.user : void 0) {
      endpointContext.user = auth.user;
      endpointContext.userId = auth.user._id;
      return true;
    } else {
      return false;
    }
  }; /*
       Authenticate the user role if required
     
       Must be called after _authAccepted().
     
       @returns True if the authenticated user belongs to <i>any</i> of the acceptable roles on the
                endpoint
      */

  Route.prototype._spaceAccepted = function (endpointContext, endpoint) {
    var auth, space, space_users_count;

    if (endpoint.spaceRequired) {
      auth = this.api._config.auth.user.call(endpointContext);

      if (auth != null ? auth.spaceId : void 0) {
        space_users_count = db.space_users.find({
          user: auth.userId,
          space: auth.spaceId
        }).count();

        if (space_users_count) {
          space = db.spaces.findOne(auth.spaceId);

          if ((space != null ? space.is_paid : void 0) && _.indexOf(space.admins, auth.userId) >= 0) {
            endpointContext.spaceId = auth.spaceId;
            return true;
          }
        }
      }

      endpointContext.spaceId = "bad";
      return false;
    }

    return true;
  }; /*
       Authenticate the user role if required
     
       Must be called after _authAccepted().
     
       @returns True if the authenticated user belongs to <i>any</i> of the acceptable roles on the
                endpoint
      */

  Route.prototype._roleAccepted = function (endpointContext, endpoint) {
    if (endpoint.roleRequired) {
      if (_.isEmpty(_.intersection(endpoint.roleRequired, endpointContext.user.roles))) {
        return false;
      }
    }

    return true;
  }; /*
       Respond to an HTTP request
      */

  Route.prototype._respond = function (response, body, statusCode, headers) {
    var defaultHeaders, delayInMilliseconds, minimumDelayInMilliseconds, randomMultiplierBetweenOneAndTwo, sendResponse;

    if (statusCode == null) {
      statusCode = 200;
    }

    if (headers == null) {
      headers = {};
    }

    defaultHeaders = this._lowerCaseKeys(this.api._config.defaultHeaders);
    headers = this._lowerCaseKeys(headers);
    headers = _.extend(defaultHeaders, headers);

    if (headers['content-type'].match(/json|javascript/) !== null) {
      if (this.api._config.prettyJson) {
        body = JSON.stringify(body, void 0, 2);
      } else {
        body = JSON.stringify(body);
      }
    }

    sendResponse = function () {
      response.writeHead(statusCode, headers);
      response.write(body);
      return response.end();
    };

    if (statusCode === 401 || statusCode === 403) {
      minimumDelayInMilliseconds = 500;
      randomMultiplierBetweenOneAndTwo = 1 + Math.random();
      delayInMilliseconds = minimumDelayInMilliseconds * randomMultiplierBetweenOneAndTwo;
      return Meteor.setTimeout(sendResponse, delayInMilliseconds);
    } else {
      return sendResponse();
    }
  }; /*
       Return the object with all of the keys converted to lowercase
      */

  Route.prototype._lowerCaseKeys = function (object) {
    return _.chain(object).pairs().map(function (attr) {
      return [attr[0].toLowerCase(), attr[1]];
    }).object().value();
  };

  return Route;
}();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"restivus.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/lib/restivus/restivus.coffee                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Restivus,
    indexOf = [].indexOf || function (item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item) return i;
  }

  return -1;
};

this.Restivus = function () {
  function Restivus(options) {
    var corsHeaders;
    this._routes = [];
    this._config = {
      paths: [],
      useDefaultAuth: false,
      apiPath: 'api/',
      version: null,
      prettyJson: false,
      auth: {
        token: 'services.resume.loginTokens.hashedToken',
        user: function () {
          var _user, token;

          if (this.request.headers['x-auth-token']) {
            token = Accounts._hashLoginToken(this.request.headers['x-auth-token']);
          }

          if (this.request.userId) {
            _user = db.users.findOne({
              _id: this.request.userId
            });
            return {
              user: _user,
              userId: this.request.headers['x-user-id'],
              spaceId: this.request.headers['x-space-id'],
              token: token
            };
          } else {
            return {
              userId: this.request.headers['x-user-id'],
              spaceId: this.request.headers['x-space-id'],
              token: token
            };
          }
        }
      },
      defaultHeaders: {
        'Content-Type': 'application/json'
      },
      enableCors: true
    };

    _.extend(this._config, options);

    if (this._config.enableCors) {
      corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      };

      if (this._config.useDefaultAuth) {
        corsHeaders['Access-Control-Allow-Headers'] += ', X-User-Id, X-Auth-Token';
      }

      _.extend(this._config.defaultHeaders, corsHeaders);

      if (!this._config.defaultOptionsEndpoint) {
        this._config.defaultOptionsEndpoint = function () {
          this.response.writeHead(200, corsHeaders);
          return this.done();
        };
      }
    }

    if (this._config.apiPath[0] === '/') {
      this._config.apiPath = this._config.apiPath.slice(1);
    }

    if (_.last(this._config.apiPath) !== '/') {
      this._config.apiPath = this._config.apiPath + '/';
    }

    if (this._config.version) {
      this._config.apiPath += this._config.version + '/';
    }

    if (this._config.useDefaultAuth) {
      this._initAuth();
    } else if (this._config.useAuth) {
      this._initAuth();

      console.warn('Warning: useAuth API config option will be removed in Restivus v1.0 ' + '\n    Use the useDefaultAuth option instead');
    }

    return this;
  } /**
      Add endpoints for the given HTTP methods at the given path
    
      @param path {String} The extended URL path (will be appended to base path of the API)
      @param options {Object} Route configuration options
      @param options.authRequired {Boolean} The default auth requirement for each endpoint on the route
      @param options.roleRequired {String or String[]} The default role required for each endpoint on the route
      @param endpoints {Object} A set of endpoints available on the new route (get, post, put, patch, delete, options)
      @param endpoints.<method> {Function or Object} If a function is provided, all default route
          configuration options will be applied to the endpoint. Otherwise an object with an `action`
          and all other route config options available. An `action` must be provided with the object.
     */

  Restivus.prototype.addRoute = function (path, options, endpoints) {
    var route;
    route = new share.Route(this, path, options, endpoints);

    this._routes.push(route);

    route.addToApi();
    return this;
  }; /**
       Generate routes for the Meteor Collection with the given name
      */

  Restivus.prototype.addCollection = function (collection, options) {
    var collectionEndpoints, collectionRouteEndpoints, endpointsAwaitingConfiguration, entityRouteEndpoints, excludedEndpoints, methods, methodsOnCollection, path, routeOptions;

    if (options == null) {
      options = {};
    }

    methods = ['get', 'post', 'put', 'delete', 'getAll'];
    methodsOnCollection = ['post', 'getAll'];

    if (collection === Meteor.users) {
      collectionEndpoints = this._userCollectionEndpoints;
    } else {
      collectionEndpoints = this._collectionEndpoints;
    }

    endpointsAwaitingConfiguration = options.endpoints || {};
    routeOptions = options.routeOptions || {};
    excludedEndpoints = options.excludedEndpoints || [];
    path = options.path || collection._name;
    collectionRouteEndpoints = {};
    entityRouteEndpoints = {};

    if (_.isEmpty(endpointsAwaitingConfiguration) && _.isEmpty(excludedEndpoints)) {
      _.each(methods, function (method) {
        if (indexOf.call(methodsOnCollection, method) >= 0) {
          _.extend(collectionRouteEndpoints, collectionEndpoints[method].call(this, collection));
        } else {
          _.extend(entityRouteEndpoints, collectionEndpoints[method].call(this, collection));
        }
      }, this);
    } else {
      _.each(methods, function (method) {
        var configuredEndpoint, endpointOptions;

        if (indexOf.call(excludedEndpoints, method) < 0 && endpointsAwaitingConfiguration[method] !== false) {
          endpointOptions = endpointsAwaitingConfiguration[method];
          configuredEndpoint = {};

          _.each(collectionEndpoints[method].call(this, collection), function (action, methodType) {
            return configuredEndpoint[methodType] = _.chain(action).clone().extend(endpointOptions).value();
          });

          if (indexOf.call(methodsOnCollection, method) >= 0) {
            _.extend(collectionRouteEndpoints, configuredEndpoint);
          } else {
            _.extend(entityRouteEndpoints, configuredEndpoint);
          }
        }
      }, this);
    }

    this.addRoute(path, routeOptions, collectionRouteEndpoints);
    this.addRoute(path + "/:id", routeOptions, entityRouteEndpoints);
    return this;
  }; /**
       A set of endpoints that can be applied to a Collection Route
      */

  Restivus.prototype._collectionEndpoints = {
    get: function (collection) {
      return {
        get: {
          action: function () {
            var entity, selector;
            selector = {
              _id: this.urlParams.id
            };

            if (this.spaceId) {
              selector.space = this.spaceId;
            }

            entity = collection.findOne(selector);

            if (entity) {
              return {
                status: 'success',
                data: entity
              };
            } else {
              return {
                statusCode: 404,
                body: {
                  status: 'fail',
                  message: 'Item not found'
                }
              };
            }
          }
        }
      };
    },
    put: function (collection) {
      return {
        put: {
          action: function () {
            var entity, entityIsUpdated, selector;
            selector = {
              _id: this.urlParams.id
            };

            if (this.spaceId) {
              selector.space = this.spaceId;
            }

            entityIsUpdated = collection.update(selector, {
              $set: this.bodyParams
            });

            if (entityIsUpdated) {
              entity = collection.findOne(this.urlParams.id);
              return {
                status: 'success',
                data: entity
              };
            } else {
              return {
                statusCode: 404,
                body: {
                  status: 'fail',
                  message: 'Item not found'
                }
              };
            }
          }
        }
      };
    },
    "delete": function (collection) {
      return {
        "delete": {
          action: function () {
            var selector;
            selector = {
              _id: this.urlParams.id
            };

            if (this.spaceId) {
              selector.space = this.spaceId;
            }

            if (collection.remove(selector)) {
              return {
                status: 'success',
                data: {
                  message: 'Item removed'
                }
              };
            } else {
              return {
                statusCode: 404,
                body: {
                  status: 'fail',
                  message: 'Item not found'
                }
              };
            }
          }
        }
      };
    },
    post: function (collection) {
      return {
        post: {
          action: function () {
            var entity, entityId;

            if (this.spaceId) {
              this.bodyParams.space = this.spaceId;
            }

            entityId = collection.insert(this.bodyParams);
            entity = collection.findOne(entityId);

            if (entity) {
              return {
                statusCode: 201,
                body: {
                  status: 'success',
                  data: entity
                }
              };
            } else {
              return {
                statusCode: 400,
                body: {
                  status: 'fail',
                  message: 'No item added'
                }
              };
            }
          }
        }
      };
    },
    getAll: function (collection) {
      return {
        get: {
          action: function () {
            var entities, selector;
            selector = {};

            if (this.spaceId) {
              selector.space = this.spaceId;
            }

            entities = collection.find(selector).fetch();

            if (entities) {
              return {
                status: 'success',
                data: entities
              };
            } else {
              return {
                statusCode: 404,
                body: {
                  status: 'fail',
                  message: 'Unable to retrieve items from collection'
                }
              };
            }
          }
        }
      };
    }
  }; /**
       A set of endpoints that can be applied to a Meteor.users Collection Route
      */
  Restivus.prototype._userCollectionEndpoints = {
    get: function (collection) {
      return {
        get: {
          action: function () {
            var entity;
            entity = collection.findOne(this.urlParams.id, {
              fields: {
                profile: 1
              }
            });

            if (entity) {
              return {
                status: 'success',
                data: entity
              };
            } else {
              return {
                statusCode: 404,
                body: {
                  status: 'fail',
                  message: 'User not found'
                }
              };
            }
          }
        }
      };
    },
    put: function (collection) {
      return {
        put: {
          action: function () {
            var entity, entityIsUpdated;
            entityIsUpdated = collection.update(this.urlParams.id, {
              $set: {
                profile: this.bodyParams
              }
            });

            if (entityIsUpdated) {
              entity = collection.findOne(this.urlParams.id, {
                fields: {
                  profile: 1
                }
              });
              return {
                status: "success",
                data: entity
              };
            } else {
              return {
                statusCode: 404,
                body: {
                  status: 'fail',
                  message: 'User not found'
                }
              };
            }
          }
        }
      };
    },
    "delete": function (collection) {
      return {
        "delete": {
          action: function () {
            if (collection.remove(this.urlParams.id)) {
              return {
                status: 'success',
                data: {
                  message: 'User removed'
                }
              };
            } else {
              return {
                statusCode: 404,
                body: {
                  status: 'fail',
                  message: 'User not found'
                }
              };
            }
          }
        }
      };
    },
    post: function (collection) {
      return {
        post: {
          action: function () {
            var entity, entityId;
            entityId = Accounts.createUser(this.bodyParams);
            entity = collection.findOne(entityId, {
              fields: {
                profile: 1
              }
            });

            if (entity) {
              return {
                statusCode: 201,
                body: {
                  status: 'success',
                  data: entity
                }
              };
            } else {
              ({
                statusCode: 400
              });
              return {
                status: 'fail',
                message: 'No user added'
              };
            }
          }
        }
      };
    },
    getAll: function (collection) {
      return {
        get: {
          action: function () {
            var entities;
            entities = collection.find({}, {
              fields: {
                profile: 1
              }
            }).fetch();

            if (entities) {
              return {
                status: 'success',
                data: entities
              };
            } else {
              return {
                statusCode: 404,
                body: {
                  status: 'fail',
                  message: 'Unable to retrieve users'
                }
              };
            }
          }
        }
      };
    }
  }; /*
       Add /login and /logout endpoints to the API
      */

  Restivus.prototype._initAuth = function () {
    var logout, self;
    self = this; /*
                   Add a login endpoint to the API
                 
                   After the user is logged in, the onLoggedIn hook is called (see Restfully.configure() for
                   adding hook).
                  */
    this.addRoute('login', {
      authRequired: false
    }, {
      post: function () {
        var auth, e, extraData, ref, ref1, response, searchQuery, user;
        user = {};

        if (this.bodyParams.user) {
          if (this.bodyParams.user.indexOf('@') === -1) {
            user.username = this.bodyParams.user;
          } else {
            user.email = this.bodyParams.user;
          }
        } else if (this.bodyParams.username) {
          user.username = this.bodyParams.username;
        } else if (this.bodyParams.email) {
          user.email = this.bodyParams.email;
        }

        try {
          auth = Auth.loginWithPassword(user, this.bodyParams.password);
        } catch (error) {
          e = error;
          console.error(e);
          return {
            statusCode: e.error,
            body: {
              status: 'error',
              message: e.reason
            }
          };
        }

        if (auth.userId && auth.authToken) {
          searchQuery = {};
          searchQuery[self._config.auth.token] = Accounts._hashLoginToken(auth.authToken);
          this.user = Meteor.users.findOne({
            '_id': auth.userId
          }, searchQuery);
          this.userId = (ref = this.user) != null ? ref._id : void 0;
        }

        response = {
          status: 'success',
          data: auth
        };
        extraData = (ref1 = self._config.onLoggedIn) != null ? ref1.call(this) : void 0;

        if (extraData != null) {
          _.extend(response.data, {
            extra: extraData
          });
        }

        return response;
      }
    });

    logout = function () {
      var authToken, extraData, hashedToken, index, ref, response, tokenFieldName, tokenLocation, tokenPath, tokenRemovalQuery, tokenToRemove;
      authToken = this.request.headers['x-auth-token'];
      hashedToken = Accounts._hashLoginToken(authToken);
      tokenLocation = self._config.auth.token;
      index = tokenLocation.lastIndexOf('.');
      tokenPath = tokenLocation.substring(0, index);
      tokenFieldName = tokenLocation.substring(index + 1);
      tokenToRemove = {};
      tokenToRemove[tokenFieldName] = hashedToken;
      tokenRemovalQuery = {};
      tokenRemovalQuery[tokenPath] = tokenToRemove;
      Meteor.users.update(this.user._id, {
        $pull: tokenRemovalQuery
      });
      response = {
        status: 'success',
        data: {
          message: 'You\'ve been logged out!'
        }
      };
      extraData = (ref = self._config.onLoggedOut) != null ? ref.call(this) : void 0;

      if (extraData != null) {
        _.extend(response.data, {
          extra: extraData
        });
      }

      return response;
    }; /*
         Add a logout endpoint to the API
       
         After the user is logged out, the onLoggedOut hook is called (see Restfully.configure() for
         adding hook).
        */

    return this.addRoute('logout', {
      authRequired: true
    }, {
      get: function () {
        console.warn("Warning: Default logout via GET will be removed in Restivus v1.0. Use POST instead.");
        console.warn("    See https://github.com/kahmali/meteor-restivus/issues/100");
        return logout.call(this);
      },
      post: logout
    });
  };

  return Restivus;
}();

Restivus = this.Restivus;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"core.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/core.coffee                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isServer) {
  this.API = new Restivus({
    apiPath: 'steedos/api/',
    useDefaultAuth: true,
    prettyJson: true,
    enableCors: false,
    defaultHeaders: {
      'Content-Type': 'application/json'
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"steedos":{"space_users.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/steedos/space_users.coffee                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return API.addCollection(db.space_users, {
    excludedEndpoints: [],
    routeOptions: {
      authRequired: true,
      spaceRequired: true
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"organizations.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/steedos/organizations.coffee                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return API.addCollection(db.organizations, {
    excludedEndpoints: [],
    routeOptions: {
      authRequired: true,
      spaceRequired: true
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"routes":{"s3.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/routes/s3.coffee                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
JsonRoutes.add("post", "/api/v4/instances/s3/", function (req, res, next) {
  var collection;
  collection = cfs.instances;
  return JsonRoutes.parseFiles(req, res, function () {
    var newFile;

    if (req.files && req.files[0]) {
      newFile = new FS.File();
      newFile.attachData(req.files[0].data, {
        type: req.files[0].mimeType
      }, function (err) {
        var body, e, fileObj, filename, metadata, parent, r;
        filename = req.files[0].filename;

        if (["image.jpg", "image.gif", "image.jpeg", "image.png"].includes(filename.toLowerCase())) {
          filename = "image-" + moment(new Date()).format('YYYYMMDDHHmmss') + "." + filename.split('.').pop();
        }

        body = req.body;

        try {
          if (body && (body['upload_from'] === "IE" || body['upload_from'] === "node")) {
            filename = decodeURIComponent(filename);
          }
        } catch (error) {
          e = error;
          console.error(filename);
          console.error(e);
          filename = filename.replace(/%/g, "-");
        }

        newFile.name(filename);

        if (body && body['owner'] && body['owner_name'] && body['space'] && body['instance'] && body['approve']) {
          parent = '';
          metadata = {
            owner: body['owner'],
            owner_name: body['owner_name'],
            space: body['space'],
            instance: body['instance'],
            approve: body['approve'],
            current: true
          };

          if (body["is_private"] && body["is_private"].toLocaleLowerCase() === "true") {
            metadata.is_private = true;
          } else {
            metadata.is_private = false;
          }

          if (body['main'] === "true") {
            metadata.main = true;
          }

          if (body['isAddVersion'] && body['parent']) {
            parent = body['parent'];
          }

          if (parent) {
            r = collection.update({
              'metadata.parent': parent,
              'metadata.current': true
            }, {
              $unset: {
                'metadata.current': ''
              }
            });

            if (r) {
              metadata.parent = parent;

              if (body['locked_by'] && body['locked_by_name']) {
                metadata.locked_by = body['locked_by'];
                metadata.locked_by_name = body['locked_by_name'];
              }

              newFile.metadata = metadata;
              fileObj = collection.insert(newFile);

              if (body["overwrite"] && body["overwrite"].toLocaleLowerCase() === "true") {
                collection.remove({
                  'metadata.instance': body['instance'],
                  'metadata.parent': parent,
                  'metadata.owner': body['owner'],
                  'metadata.approve': body['approve'],
                  'metadata.current': {
                    $ne: true
                  }
                });
              }
            }
          } else {
            newFile.metadata = metadata;
            fileObj = collection.insert(newFile);
            fileObj.update({
              $set: {
                'metadata.parent': fileObj._id
              }
            });
          }
        } else {
          fileObj = collection.insert(newFile);
        }
      });
      return newFile.once('stored', function (storeName) {
        var resp, size;
        size = newFile.original.size;

        if (!size) {
          size = 1024;
        }

        resp = {
          version_id: newFile._id,
          size: size
        };
        res.end(JSON.stringify(resp));
      });
    } else {
      res.statusCode = 500;
      res.end();
    }
  });
});
JsonRoutes.add("delete", "/api/v4/instances/s3/", function (req, res, next) {
  var collection, file, id, resp;
  collection = cfs.instances;
  id = req.query.version_id;

  if (id) {
    file = collection.findOne({
      _id: id
    });

    if (file) {
      file.remove();
      resp = {
        status: "OK"
      };
      res.end(JSON.stringify(resp));
      return;
    }
  }

  res.statusCode = 404;
  return res.end();
});
JsonRoutes.add("get", "/api/v4/instances/s3/", function (req, res, next) {
  var id;
  id = req.query.version_id;
  res.statusCode = 302;
  res.setHeader("Location", Steedos.absoluteUrl("api/files/instances/") + id + "?download=1");
  return res.end();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"push.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/routes/push.coffee                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
JsonRoutes.add("post", "/api/push/message", function (req, res, next) {
  var message, ref;

  if (((ref = req.body) != null ? ref.pushTopic : void 0) && req.body.userIds && req.body.data) {
    message = {
      from: "steedos",
      query: {
        appName: req.body.pushTopic,
        userId: {
          "$in": userIds
        }
      }
    };

    if (req.body.data.alertTitle != null) {
      message["title"] = req.body.data.alertTitle;
    }

    if (req.body.data.alert != null) {
      message["text"] = req.body.data.alert;
    }

    if (req.body.data.badge != null) {
      message["badge"] = req.body.data.badge + "";
    }

    if (req.body.data.sound != null) {
      message["sound"] = req.body.data.sound;
    }

    Push.send(message);
    return res.end("success");
  }
});
Meteor.methods({
  pushSend: function (text, title, badge, userId) {
    if (!userId) {
      return;
    }

    return Push.send({
      from: 'steedos',
      title: title,
      text: text,
      badge: badge,
      query: {
        userId: userId,
        appName: "workflow"
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"aliyun_push.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/routes/aliyun_push.coffee                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Aliyun_push;
Aliyun_push = {};

Aliyun_push.sendMessage = function (userTokens, notification, callback) {
  var ALY, ALYPUSH, MiPush, Xinge, XingeApp, aliyunTokens, androidMessage, data, huaweiTokens, miTokens, msg, noti, package_name, ref, ref1, ref2, ref3, tokenDataList, xingeTokens;

  if (notification.title && notification.text) {
    if (Push.debug) {
      console.log(userTokens);
    }

    aliyunTokens = new Array();
    xingeTokens = new Array();
    huaweiTokens = new Array();
    miTokens = new Array();
    userTokens.forEach(function (userToken) {
      var arr;
      arr = userToken.split(':');

      if (arr[0] === "aliyun") {
        return aliyunTokens.push(_.last(arr));
      } else if (arr[0] === "xinge") {
        return xingeTokens.push(_.last(arr));
      } else if (arr[0] === "huawei") {
        return huaweiTokens.push(_.last(arr));
      } else if (arr[0] === "mi") {
        return miTokens.push(_.last(arr));
      }
    });

    if (!_.isEmpty(aliyunTokens) && ((ref = Meteor.settings.push) != null ? ref.aliyun : void 0)) {
      ALY = require('aliyun-sdk');

      if (Push.debug) {
        console.log("aliyunTokens: " + aliyunTokens);
      }

      ALYPUSH = new ALY.PUSH({
        accessKeyId: Meteor.settings.push.aliyun.accessKeyId,
        secretAccessKey: Meteor.settings.push.aliyun.secretAccessKey,
        endpoint: Meteor.settings.push.aliyun.endpoint,
        apiVersion: Meteor.settings.push.aliyun.apiVersion
      });
      data = {
        AppKey: Meteor.settings.push.aliyun.appKey,
        Target: 'device',
        TargetValue: aliyunTokens.toString(),
        Title: notification.title,
        Summary: notification.text
      };
      ALYPUSH.pushNoticeToAndroid(data, callback);
    }

    if (!_.isEmpty(xingeTokens) && ((ref1 = Meteor.settings.push) != null ? ref1.xinge : void 0)) {
      Xinge = require('xinge');

      if (Push.debug) {
        console.log("xingeTokens: " + xingeTokens);
      }

      XingeApp = new Xinge.XingeApp(Meteor.settings.push.xinge.accessId, Meteor.settings.push.xinge.secretKey);
      androidMessage = new Xinge.AndroidMessage();
      androidMessage.type = Xinge.MESSAGE_TYPE_NOTIFICATION;
      androidMessage.title = notification.title;
      androidMessage.content = notification.text;
      androidMessage.style = new Xinge.Style();
      androidMessage.action = new Xinge.ClickAction();

      _.each(xingeTokens, function (t) {
        return XingeApp.pushToSingleDevice(t, androidMessage, callback);
      });
    }

    if (!_.isEmpty(huaweiTokens) && ((ref2 = Meteor.settings.push) != null ? ref2.huawei : void 0)) {
      if (Push.debug) {
        console.log("huaweiTokens: " + huaweiTokens);
      }

      package_name = Meteor.settings.push.huawei.appPkgName;
      tokenDataList = [];

      _.each(huaweiTokens, function (t) {
        return tokenDataList.push({
          'package_name': package_name,
          'token': t
        });
      });

      noti = {
        'android': {
          'title': notification.title,
          'message': notification.text
        },
        'extras': notification.payload
      };
      HuaweiPush.config([{
        'package_name': package_name,
        'client_id': Meteor.settings.push.huawei.appId,
        'client_secret': Meteor.settings.push.huawei.appSecret
      }]);
      HuaweiPush.sendMany(noti, tokenDataList);
    }

    if (!_.isEmpty(miTokens) && ((ref3 = Meteor.settings.push) != null ? ref3.mi : void 0)) {
      MiPush = require('xiaomi-push');

      if (Push.debug) {
        console.log("miTokens: " + miTokens);
      }

      msg = new MiPush.Message();
      msg.title(notification.title).description(notification.text);
      notification = new MiPush.Notification({
        production: Meteor.settings.push.mi.production,
        appSecret: Meteor.settings.push.mi.appSecret
      });
      return _.each(miTokens, function (regid) {
        return notification.send(regid, msg, callback);
      });
    }
  }
};

Meteor.startup(function () {
  var config, ref, ref1, ref2, ref3, ref4, ref5, ref6;

  if (!((ref = Meteor.settings.cron) != null ? ref.push_interval : void 0)) {
    return;
  }

  config = {
    debug: true,
    keepNotifications: false,
    sendInterval: Meteor.settings.cron.push_interval,
    sendBatchSize: 10,
    production: true
  };

  if (!_.isEmpty((ref1 = Meteor.settings.push) != null ? ref1.apn : void 0)) {
    config.apn = {
      keyData: Meteor.settings.push.apn.keyData,
      certData: Meteor.settings.push.apn.certData
    };
  }

  if (!_.isEmpty((ref2 = Meteor.settings.push) != null ? ref2.gcm : void 0)) {
    config.gcm = {
      projectNumber: Meteor.settings.push.gcm.projectNumber,
      apiKey: Meteor.settings.push.gcm.apiKey
    };
  }

  Push.Configure(config);

  if ((((ref3 = Meteor.settings.push) != null ? ref3.aliyun : void 0) || ((ref4 = Meteor.settings.push) != null ? ref4.xinge : void 0) || ((ref5 = Meteor.settings.push) != null ? ref5.huawei : void 0) || ((ref6 = Meteor.settings.push) != null ? ref6.mi : void 0)) && Push && typeof Push.sendGCM === 'function') {
    Push.old_sendGCM = Push.sendGCM;

    Push.sendAliyun = function (userTokens, notification) {
      var Fiber, userToken;

      if (Push.debug) {
        console.log('sendAliyun', userTokens, notification);
      }

      if (Match.test(notification.gcm, Object)) {
        notification = _.extend({}, notification, notification.gcm);
      }

      if (userTokens === '' + userTokens) {
        userTokens = [userTokens];
      }

      if (!userTokens.length) {
        console.log('sendGCM no push tokens found');
        return;
      }

      if (Push.debug) {
        console.log('sendAliyun', userTokens, notification);
      }

      Fiber = require('fibers');
      userToken = userTokens.length === 1 ? userTokens[0] : null;
      return Aliyun_push.sendMessage(userTokens, notification, function (err, result) {
        if (err) {
          return console.log('ANDROID ERROR: result of sender: ' + result);
        } else {
          if (result === null) {
            console.log('ANDROID: Result of sender is null');
          }

          return;

          if (Push.debug) {
            console.log('ANDROID: Result of sender: ' + JSON.stringify(result));
          }

          if (result.canonical_ids === 1 && userToken) {
            Fiber(function (self) {
              try {
                return self.callback(self.oldToken, self.newToken);
              } catch (error) {
                err = error;
              }
            }).run({
              oldToken: {
                gcm: userToken
              },
              newToken: {
                gcm: "aliyun:" + result.results[0].registration_id
              },
              callback: _replaceToken
            });
          }

          if (result.failure !== 0 && userToken) {
            return Fiber(function (self) {
              try {
                return self.callback(self.token);
              } catch (error) {
                err = error;
              }
            }).run({
              token: {
                gcm: userToken
              },
              callback: _removeToken
            });
          }
        }
      });
    };

    Push.sendGCM = function (userTokens, notification) {
      var aliyunTokens, gcmTokens;

      if (Push.debug) {
        console.log('sendGCM from aliyun-> Push.sendGCM');
      }

      if (Match.test(notification.gcm, Object)) {
        notification = _.extend({}, notification, notification.gcm);
      }

      if (userTokens === '' + userTokens) {
        userTokens = [userTokens];
      }

      if (!userTokens.length) {
        console.log('sendGCM no push tokens found');
        return;
      }

      if (Push.debug) {
        console.log('sendGCM', userTokens, notification);
      }

      aliyunTokens = userTokens.filter(function (item) {
        return item.indexOf('aliyun:') > -1 || item.indexOf('xinge:') > -1 || item.indexOf('huawei:') > -1 || item.indexOf('mi:') > -1;
      });

      if (Push.debug) {
        console.log('aliyunTokens is ', aliyunTokens.toString());
      }

      gcmTokens = userTokens.filter(function (item) {
        return item.indexOf("aliyun:") < 0 && item.indexOf("xinge:") < 0 && item.indexOf("huawei:") < 0 && item.indexOf("mi:") < 0;
      });

      if (Push.debug) {
        console.log('gcmTokens is ', gcmTokens.toString());
      }

      Push.sendAliyun(aliyunTokens, notification);
      return Push.old_sendGCM(gcmTokens, notification);
    };

    Push.old_sendAPN = Push.sendAPN;
    return Push.sendAPN = function (userToken, notification) {
      var noti;

      if (notification.title && notification.text) {
        noti = _.clone(notification);
        noti.text = noti.title + " " + noti.text;
        noti.title = "";
        return Push.old_sendAPN(userToken, noti);
      } else {
        return Push.old_sendAPN(userToken, notification);
      }
    };
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:api/checkNpm.js");
require("/node_modules/meteor/steedos:api/parse_files.coffee");
require("/node_modules/meteor/steedos:api/lib/restivus/auth.coffee");
require("/node_modules/meteor/steedos:api/lib/restivus/iron-router-error-to-response.js");
require("/node_modules/meteor/steedos:api/lib/restivus/route.coffee");
require("/node_modules/meteor/steedos:api/lib/restivus/restivus.coffee");
require("/node_modules/meteor/steedos:api/core.coffee");
require("/node_modules/meteor/steedos:api/steedos/space_users.coffee");
require("/node_modules/meteor/steedos:api/steedos/organizations.coffee");
require("/node_modules/meteor/steedos:api/routes/s3.coffee");
require("/node_modules/meteor/steedos:api/routes/push.coffee");
require("/node_modules/meteor/steedos:api/routes/aliyun_push.coffee");

/* Exports */
Package._define("steedos:api");

})();

//# sourceURL=meteor://💻app/packages/steedos_api.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3BhcnNlX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFyc2VfZmlsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvbGliL3Jlc3RpdnVzL2lyb24tcm91dGVyLWVycm9yLXRvLXJlc3BvbnNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3N0ZWVkb3Mvc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zdGVlZG9zL3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYnVzYm95IiwiY29va2llcyIsIkJ1c2JveSIsIkZpYmVyIiwicmVxdWlyZSIsIkpzb25Sb3V0ZXMiLCJwYXJzZUZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImZpbGVzIiwibWV0aG9kIiwiaGVhZGVycyIsIm9uIiwiZmllbGRuYW1lIiwiZmlsZSIsImZpbGVuYW1lIiwiZW5jb2RpbmciLCJtaW1ldHlwZSIsImJ1ZmZlcnMiLCJpbWFnZSIsIm1pbWVUeXBlIiwiZGF0YSIsInB1c2giLCJCdWZmZXIiLCJjb25jYXQiLCJ2YWx1ZSIsImJvZHkiLCJydW4iLCJwaXBlIiwiZ2V0VXNlclF1ZXJ5U2VsZWN0b3IiLCJ1c2VyVmFsaWRhdG9yIiwiQXV0aCIsIk1hdGNoIiwiV2hlcmUiLCJ1c2VyIiwiY2hlY2siLCJpZCIsIk9wdGlvbmFsIiwiU3RyaW5nIiwidXNlcm5hbWUiLCJlbWFpbCIsIl8iLCJrZXlzIiwibGVuZ3RoIiwiRXJyb3IiLCJsb2dpbldpdGhQYXNzd29yZCIsInBhc3N3b3JkIiwiYXV0aFRva2VuIiwiYXV0aGVudGljYXRpbmdVc2VyIiwiYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IiLCJoYXNoZWRUb2tlbiIsInBhc3N3b3JkVmVyaWZpY2F0aW9uIiwicmVmIiwic3BhY2VfdXNlcnMiLCJzcGFjZXMiLCJNZXRlb3IiLCJ1c2VycyIsImZpbmRPbmUiLCJzZXJ2aWNlcyIsIkFjY291bnRzIiwiX2NoZWNrUGFzc3dvcmQiLCJlcnJvciIsIl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuIiwiX2hhc2hTdGFtcGVkVG9rZW4iLCJfaW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiIsIl9pZCIsImRiIiwiZmluZCIsImZldGNoIiwiZWFjaCIsInN1Iiwic3BhY2UiLCJpc19wYWlkIiwiaW5kZXhPZiIsImFkbWlucyIsIm5hbWUiLCJ0b2tlbiIsInVzZXJJZCIsImFkbWluU3BhY2VzIiwiZW52IiwicHJvY2VzcyIsIk5PREVfRU5WIiwiaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UiLCJlcnIiLCJzdGF0dXNDb2RlIiwic3RhdHVzIiwibXNnIiwic3RhY2siLCJ0b1N0cmluZyIsImNvbnNvbGUiLCJoZWFkZXJzU2VudCIsInNvY2tldCIsImRlc3Ryb3kiLCJzZXRIZWFkZXIiLCJieXRlTGVuZ3RoIiwiZW5kIiwic2hhcmUiLCJSb3V0ZSIsImFwaSIsInBhdGgiLCJvcHRpb25zIiwiZW5kcG9pbnRzMSIsImVuZHBvaW50cyIsInByb3RvdHlwZSIsImFkZFRvQXBpIiwiYXZhaWxhYmxlTWV0aG9kcyIsImFsbG93ZWRNZXRob2RzIiwiZnVsbFBhdGgiLCJyZWplY3RlZE1ldGhvZHMiLCJzZWxmIiwiY29udGFpbnMiLCJfY29uZmlnIiwicGF0aHMiLCJleHRlbmQiLCJkZWZhdWx0T3B0aW9uc0VuZHBvaW50IiwiX3Jlc29sdmVFbmRwb2ludHMiLCJfY29uZmlndXJlRW5kcG9pbnRzIiwiZmlsdGVyIiwicmVqZWN0IiwiYXBpUGF0aCIsImVuZHBvaW50IiwiYWRkIiwiZG9uZUZ1bmMiLCJlbmRwb2ludENvbnRleHQiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZUluaXRpYXRlZCIsInVybFBhcmFtcyIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwicXVlcnkiLCJib2R5UGFyYW1zIiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZG9uZSIsIl9jYWxsRW5kcG9pbnQiLCJlcnJvcjEiLCJfcmVzcG9uZCIsIm1lc3NhZ2UiLCJqb2luIiwidG9VcHBlckNhc2UiLCJpc0Z1bmN0aW9uIiwiYWN0aW9uIiwicmVmMSIsInJlZjIiLCJyb2xlUmVxdWlyZWQiLCJ1bmlvbiIsImlzRW1wdHkiLCJhdXRoUmVxdWlyZWQiLCJzcGFjZVJlcXVpcmVkIiwiaW52b2NhdGlvbiIsIl9hdXRoQWNjZXB0ZWQiLCJfcm9sZUFjY2VwdGVkIiwiX3NwYWNlQWNjZXB0ZWQiLCJERFBDb21tb24iLCJNZXRob2RJbnZvY2F0aW9uIiwiaXNTaW11bGF0aW9uIiwiY29ubmVjdGlvbiIsInJhbmRvbVNlZWQiLCJtYWtlUnBjU2VlZCIsIkREUCIsIl9DdXJyZW50SW52b2NhdGlvbiIsIndpdGhWYWx1ZSIsImNhbGwiLCJfYXV0aGVudGljYXRlIiwiYXV0aCIsInVzZXJTZWxlY3RvciIsInNwYWNlX3VzZXJzX2NvdW50Iiwic3BhY2VJZCIsImNvdW50IiwiaW50ZXJzZWN0aW9uIiwicm9sZXMiLCJkZWZhdWx0SGVhZGVycyIsImRlbGF5SW5NaWxsaXNlY29uZHMiLCJtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyIsInJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvIiwic2VuZFJlc3BvbnNlIiwiX2xvd2VyQ2FzZUtleXMiLCJtYXRjaCIsInByZXR0eUpzb24iLCJKU09OIiwic3RyaW5naWZ5Iiwid3JpdGVIZWFkIiwid3JpdGUiLCJNYXRoIiwicmFuZG9tIiwic2V0VGltZW91dCIsIm9iamVjdCIsImNoYWluIiwicGFpcnMiLCJtYXAiLCJhdHRyIiwidG9Mb3dlckNhc2UiLCJSZXN0aXZ1cyIsIml0ZW0iLCJpIiwibCIsImNvcnNIZWFkZXJzIiwiX3JvdXRlcyIsInVzZURlZmF1bHRBdXRoIiwidmVyc2lvbiIsIl91c2VyIiwiX2hhc2hMb2dpblRva2VuIiwiZW5hYmxlQ29ycyIsInNsaWNlIiwibGFzdCIsIl9pbml0QXV0aCIsInVzZUF1dGgiLCJ3YXJuIiwiYWRkUm91dGUiLCJyb3V0ZSIsImFkZENvbGxlY3Rpb24iLCJjb2xsZWN0aW9uIiwiY29sbGVjdGlvbkVuZHBvaW50cyIsImNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyIsImVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiIsImVudGl0eVJvdXRlRW5kcG9pbnRzIiwiZXhjbHVkZWRFbmRwb2ludHMiLCJtZXRob2RzIiwibWV0aG9kc09uQ29sbGVjdGlvbiIsInJvdXRlT3B0aW9ucyIsIl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyIsIl9jb2xsZWN0aW9uRW5kcG9pbnRzIiwiX25hbWUiLCJjb25maWd1cmVkRW5kcG9pbnQiLCJlbmRwb2ludE9wdGlvbnMiLCJtZXRob2RUeXBlIiwiY2xvbmUiLCJnZXQiLCJlbnRpdHkiLCJzZWxlY3RvciIsInB1dCIsImVudGl0eUlzVXBkYXRlZCIsInVwZGF0ZSIsIiRzZXQiLCJyZW1vdmUiLCJwb3N0IiwiZW50aXR5SWQiLCJpbnNlcnQiLCJnZXRBbGwiLCJlbnRpdGllcyIsImZpZWxkcyIsInByb2ZpbGUiLCJjcmVhdGVVc2VyIiwibG9nb3V0IiwiZSIsImV4dHJhRGF0YSIsInNlYXJjaFF1ZXJ5IiwicmVhc29uIiwib25Mb2dnZWRJbiIsImV4dHJhIiwiaW5kZXgiLCJ0b2tlbkZpZWxkTmFtZSIsInRva2VuTG9jYXRpb24iLCJ0b2tlblBhdGgiLCJ0b2tlblJlbW92YWxRdWVyeSIsInRva2VuVG9SZW1vdmUiLCJsYXN0SW5kZXhPZiIsInN1YnN0cmluZyIsIiRwdWxsIiwib25Mb2dnZWRPdXQiLCJpc1NlcnZlciIsIkFQSSIsInN0YXJ0dXAiLCJvcmdhbml6YXRpb25zIiwiY2ZzIiwiaW5zdGFuY2VzIiwibmV3RmlsZSIsIkZTIiwiRmlsZSIsImF0dGFjaERhdGEiLCJ0eXBlIiwiZmlsZU9iaiIsIm1ldGFkYXRhIiwicGFyZW50IiwiciIsImluY2x1ZGVzIiwibW9tZW50IiwiRGF0ZSIsImZvcm1hdCIsInNwbGl0IiwicG9wIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwicmVwbGFjZSIsIm93bmVyIiwib3duZXJfbmFtZSIsImluc3RhbmNlIiwiYXBwcm92ZSIsImN1cnJlbnQiLCJ0b0xvY2FsZUxvd2VyQ2FzZSIsImlzX3ByaXZhdGUiLCJtYWluIiwiJHVuc2V0IiwibG9ja2VkX2J5IiwibG9ja2VkX2J5X25hbWUiLCIkbmUiLCJvbmNlIiwic3RvcmVOYW1lIiwicmVzcCIsInNpemUiLCJvcmlnaW5hbCIsInZlcnNpb25faWQiLCJTdGVlZG9zIiwiYWJzb2x1dGVVcmwiLCJwdXNoVG9waWMiLCJ1c2VySWRzIiwiZnJvbSIsImFwcE5hbWUiLCJhbGVydFRpdGxlIiwiYWxlcnQiLCJiYWRnZSIsInNvdW5kIiwiUHVzaCIsInNlbmQiLCJwdXNoU2VuZCIsInRleHQiLCJ0aXRsZSIsIkFsaXl1bl9wdXNoIiwic2VuZE1lc3NhZ2UiLCJ1c2VyVG9rZW5zIiwibm90aWZpY2F0aW9uIiwiY2FsbGJhY2siLCJBTFkiLCJBTFlQVVNIIiwiTWlQdXNoIiwiWGluZ2UiLCJYaW5nZUFwcCIsImFsaXl1blRva2VucyIsImFuZHJvaWRNZXNzYWdlIiwiaHVhd2VpVG9rZW5zIiwibWlUb2tlbnMiLCJub3RpIiwicGFja2FnZV9uYW1lIiwicmVmMyIsInRva2VuRGF0YUxpc3QiLCJ4aW5nZVRva2VucyIsImRlYnVnIiwibG9nIiwiQXJyYXkiLCJmb3JFYWNoIiwidXNlclRva2VuIiwiYXJyIiwic2V0dGluZ3MiLCJhbGl5dW4iLCJQVVNIIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJhcGlWZXJzaW9uIiwiQXBwS2V5IiwiYXBwS2V5IiwiVGFyZ2V0IiwiVGFyZ2V0VmFsdWUiLCJUaXRsZSIsIlN1bW1hcnkiLCJwdXNoTm90aWNlVG9BbmRyb2lkIiwieGluZ2UiLCJhY2Nlc3NJZCIsInNlY3JldEtleSIsIkFuZHJvaWRNZXNzYWdlIiwiTUVTU0FHRV9UWVBFX05PVElGSUNBVElPTiIsImNvbnRlbnQiLCJzdHlsZSIsIlN0eWxlIiwiQ2xpY2tBY3Rpb24iLCJ0IiwicHVzaFRvU2luZ2xlRGV2aWNlIiwiaHVhd2VpIiwiYXBwUGtnTmFtZSIsInBheWxvYWQiLCJIdWF3ZWlQdXNoIiwiY29uZmlnIiwiYXBwSWQiLCJhcHBTZWNyZXQiLCJzZW5kTWFueSIsIm1pIiwiTWVzc2FnZSIsImRlc2NyaXB0aW9uIiwiTm90aWZpY2F0aW9uIiwicHJvZHVjdGlvbiIsInJlZ2lkIiwicmVmNCIsInJlZjUiLCJyZWY2IiwiY3JvbiIsInB1c2hfaW50ZXJ2YWwiLCJrZWVwTm90aWZpY2F0aW9ucyIsInNlbmRJbnRlcnZhbCIsInNlbmRCYXRjaFNpemUiLCJhcG4iLCJrZXlEYXRhIiwiY2VydERhdGEiLCJnY20iLCJwcm9qZWN0TnVtYmVyIiwiYXBpS2V5IiwiQ29uZmlndXJlIiwic2VuZEdDTSIsIm9sZF9zZW5kR0NNIiwic2VuZEFsaXl1biIsInRlc3QiLCJPYmplY3QiLCJyZXN1bHQiLCJjYW5vbmljYWxfaWRzIiwib2xkVG9rZW4iLCJuZXdUb2tlbiIsInJlc3VsdHMiLCJyZWdpc3RyYXRpb25faWQiLCJfcmVwbGFjZVRva2VuIiwiZmFpbHVyZSIsIl9yZW1vdmVUb2tlbiIsImdjbVRva2VucyIsIm9sZF9zZW5kQVBOIiwic2VuZEFQTiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLGdCQUFjLFNBREU7QUFFaEJJLFFBQU0sRUFBRSxVQUZRO0FBR2hCQyxTQUFPLEVBQUUsU0FITztBQUloQixTQUFPLFNBSlM7QUFLaEIsU0FBTyxVQUxTO0FBTWhCLGFB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LENBQWEsU0FBYixJQUEwQixDQUF6RixJQUErRndILEtBQUt4SCxPQUFMLENBQWEsS0FBYixJQUFzQixDQ3FDckg7QUR0Q08sUUFBWjs7QUFHQSxVQUFHOE8sS0FBS3dCLEtBQVI7QUFDQ3RQLGdCQUFRdVAsR0FBUixDQUFZLGVBQVosRUFBOEJ3RSxVQUFVaFUsUUFBVixFQUE5QjtBQ3NDRzs7QURwQ0orTixXQUFLcUYsVUFBTCxDQUFnQnRFLFlBQWhCLEVBQThCUCxZQUE5QjtBQ3NDRyxhRHBDSFIsS0FBS29GLFdBQUwsQ0FBaUJhLFNBQWpCLEVBQTRCekYsWUFBNUIsQ0NvQ0c7QURqRVcsS0FBZjs7QUErQkFSLFNBQUtrRyxXQUFMLEdBQW1CbEcsS0FBS21HLE9BQXhCO0FDcUNFLFdEcENGbkcsS0FBS21HLE9BQUwsR0FBZSxVQUFDdkUsU0FBRCxFQUFZcEIsWUFBWjtBQUNkLFVBQUFXLElBQUE7O0FBQUEsVUFBR1gsYUFBYUosS0FBYixJQUF1QkksYUFBYUwsSUFBdkM7QUFDQ2dCLGVBQU9qUyxFQUFFeUwsS0FBRixDQUFRNkYsWUFBUixDQUFQO0FBQ0FXLGFBQUtoQixJQUFMLEdBQVlnQixLQUFLZixLQUFMLEdBQWEsR0FBYixHQUFtQmUsS0FBS2hCLElBQXBDO0FBQ0FnQixhQUFLZixLQUFMLEdBQWEsRUFBYjtBQ3NDSSxlRHJDSkosS0FBS2tHLFdBQUwsQ0FBaUJ0RSxTQUFqQixFQUE0QlQsSUFBNUIsQ0NxQ0k7QUR6Q0w7QUMyQ0ssZURyQ0puQixLQUFLa0csV0FBTCxDQUFpQnRFLFNBQWpCLEVBQTRCcEIsWUFBNUIsQ0NxQ0k7QUFDRDtBRDdDVSxLQ29DYjtBQVdEO0FEL0pILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHQnYWxpeXVuLXNkayc6ICc+PTEuOS4yJyxcclxuXHRidXNib3k6IFwiPj0wLjIuMTNcIixcclxuXHRjb29raWVzOiBcIj49MC42LjJcIixcclxuXHQnY3N2JzogXCI+PTUuMS4yXCIsXHJcblx0J3VybCc6ICc+PTAuMTAuMCcsXHJcblx0J3JlcXVlc3QnOiAnPj0yLjgxLjAnLFxyXG5cdCd4aW5nZSc6ICc+PTEuMS4zJyxcclxuXHQnaHVhd2VpLXB1c2gnOiAnPj0wLjAuNi0wJyxcclxuXHQneGlhb21pLXB1c2gnOiAnPj0wLjQuNSdcclxufSwgJ3N0ZWVkb3M6YXBpJyk7IiwiQnVzYm95ID0gcmVxdWlyZSgnYnVzYm95Jyk7XHJcbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XHJcblxyXG5Kc29uUm91dGVzLnBhcnNlRmlsZXMgPSAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0ZmlsZXMgPSBbXTsgIyBTdG9yZSBmaWxlcyBpbiBhbiBhcnJheSBhbmQgdGhlbiBwYXNzIHRoZW0gdG8gcmVxdWVzdC5cclxuXHJcblx0aWYgKHJlcS5tZXRob2QgPT0gXCJQT1NUXCIpXHJcblx0XHRidXNib3kgPSBuZXcgQnVzYm95KHsgaGVhZGVyczogcmVxLmhlYWRlcnMgfSk7XHJcblx0XHRidXNib3kub24gXCJmaWxlXCIsICAoZmllbGRuYW1lLCBmaWxlLCBmaWxlbmFtZSwgZW5jb2RpbmcsIG1pbWV0eXBlKSAtPlxyXG5cdFx0XHRpbWFnZSA9IHt9OyAjIGNyYXRlIGFuIGltYWdlIG9iamVjdFxyXG5cdFx0XHRpbWFnZS5taW1lVHlwZSA9IG1pbWV0eXBlO1xyXG5cdFx0XHRpbWFnZS5lbmNvZGluZyA9IGVuY29kaW5nO1xyXG5cdFx0XHRpbWFnZS5maWxlbmFtZSA9IGZpbGVuYW1lO1xyXG5cclxuXHRcdFx0IyBidWZmZXIgdGhlIHJlYWQgY2h1bmtzXHJcblx0XHRcdGJ1ZmZlcnMgPSBbXTtcclxuXHJcblx0XHRcdGZpbGUub24gJ2RhdGEnLCAoZGF0YSkgLT5cclxuXHRcdFx0XHRidWZmZXJzLnB1c2goZGF0YSk7XHJcblxyXG5cdFx0XHRmaWxlLm9uICdlbmQnLCAoKSAtPlxyXG5cdFx0XHRcdCMgY29uY2F0IHRoZSBjaHVua3NcclxuXHRcdFx0XHRpbWFnZS5kYXRhID0gQnVmZmVyLmNvbmNhdChidWZmZXJzKTtcclxuXHRcdFx0XHQjIHB1c2ggdGhlIGltYWdlIG9iamVjdCB0byB0aGUgZmlsZSBhcnJheVxyXG5cdFx0XHRcdGZpbGVzLnB1c2goaW1hZ2UpO1xyXG5cclxuXHJcblx0XHRidXNib3kub24gXCJmaWVsZFwiLCAoZmllbGRuYW1lLCB2YWx1ZSkgLT5cclxuXHRcdFx0cmVxLmJvZHlbZmllbGRuYW1lXSA9IHZhbHVlO1xyXG5cclxuXHRcdGJ1c2JveS5vbiBcImZpbmlzaFwiLCAgKCkgLT5cclxuXHRcdFx0IyBQYXNzIHRoZSBmaWxlIGFycmF5IHRvZ2V0aGVyIHdpdGggdGhlIHJlcXVlc3RcclxuXHRcdFx0cmVxLmZpbGVzID0gZmlsZXM7XHJcblxyXG5cdFx0XHRGaWJlciAoKS0+XHJcblx0XHRcdFx0bmV4dCgpO1xyXG5cdFx0XHQucnVuKCk7XHJcblxyXG5cdFx0IyBQYXNzIHJlcXVlc3QgdG8gYnVzYm95XHJcblx0XHRyZXEucGlwZShidXNib3kpO1xyXG5cclxuXHRlbHNlXHJcblx0XHRuZXh0KCk7XHJcblxyXG5cclxuI0pzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoSnNvblJvdXRlcy5wYXJzZUZpbGVzKTsiLCJ2YXIgQnVzYm95LCBGaWJlcjtcblxuQnVzYm95ID0gcmVxdWlyZSgnYnVzYm95Jyk7XG5cbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbkpzb25Sb3V0ZXMucGFyc2VGaWxlcyA9IGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBidXNib3ksIGZpbGVzO1xuICBmaWxlcyA9IFtdO1xuICBpZiAocmVxLm1ldGhvZCA9PT0gXCJQT1NUXCIpIHtcbiAgICBidXNib3kgPSBuZXcgQnVzYm95KHtcbiAgICAgIGhlYWRlcnM6IHJlcS5oZWFkZXJzXG4gICAgfSk7XG4gICAgYnVzYm95Lm9uKFwiZmlsZVwiLCBmdW5jdGlvbihmaWVsZG5hbWUsIGZpbGUsIGZpbGVuYW1lLCBlbmNvZGluZywgbWltZXR5cGUpIHtcbiAgICAgIHZhciBidWZmZXJzLCBpbWFnZTtcbiAgICAgIGltYWdlID0ge307XG4gICAgICBpbWFnZS5taW1lVHlwZSA9IG1pbWV0eXBlO1xuICAgICAgaW1hZ2UuZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgICAgIGltYWdlLmZpbGVuYW1lID0gZmlsZW5hbWU7XG4gICAgICBidWZmZXJzID0gW107XG4gICAgICBmaWxlLm9uKCdkYXRhJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICByZXR1cm4gYnVmZmVycy5wdXNoKGRhdGEpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmlsZS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGltYWdlLmRhdGEgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xuICAgICAgICByZXR1cm4gZmlsZXMucHVzaChpbWFnZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWVsZFwiLCBmdW5jdGlvbihmaWVsZG5hbWUsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVxLmJvZHlbZmllbGRuYW1lXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpbmlzaFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuICAgICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfSkucnVuKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcS5waXBlKGJ1c2JveSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfVxufTtcbiIsIkBBdXRoIG9yPSB7fVxyXG5cclxuIyMjXHJcbiAgQSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxyXG4jIyNcclxudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlICh1c2VyKSAtPlxyXG4gIGNoZWNrIHVzZXIsXHJcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXHJcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXHJcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXHJcblxyXG4gIGlmIF8ua2V5cyh1c2VyKS5sZW5ndGggaXMgbm90IDFcclxuICAgIHRocm93IG5ldyBNYXRjaC5FcnJvciAnVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCdcclxuXHJcbiAgcmV0dXJuIHRydWVcclxuXHJcblxyXG4jIyNcclxuICBSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXHJcbiMjI1xyXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9ICh1c2VyKSAtPlxyXG4gIGlmIHVzZXIuaWRcclxuICAgIHJldHVybiB7J19pZCc6IHVzZXIuaWR9XHJcbiAgZWxzZSBpZiB1c2VyLnVzZXJuYW1lXHJcbiAgICByZXR1cm4geyd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWV9XHJcbiAgZWxzZSBpZiB1c2VyLmVtYWlsXHJcbiAgICByZXR1cm4geydlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWx9XHJcblxyXG4gICMgV2Ugc2hvdWxkbid0IGJlIGhlcmUgaWYgdGhlIHVzZXIgb2JqZWN0IHdhcyBwcm9wZXJseSB2YWxpZGF0ZWRcclxuICB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInXHJcblxyXG5cclxuIyMjXHJcbiAgTG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXHJcbiMjI1xyXG5AQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9ICh1c2VyLCBwYXNzd29yZCkgLT5cclxuICBpZiBub3QgdXNlciBvciBub3QgcGFzc3dvcmRcclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuICAjIFZhbGlkYXRlIHRoZSBsb2dpbiBpbnB1dCB0eXBlc1xyXG4gIGNoZWNrIHVzZXIsIHVzZXJWYWxpZGF0b3JcclxuICBjaGVjayBwYXNzd29yZCwgU3RyaW5nXHJcblxyXG4gICMgUmV0cmlldmUgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2VcclxuICBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpXHJcbiAgYXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpXHJcblxyXG4gIGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXJcclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG4gIGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXM/LnBhc3N3b3JkXHJcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuXHJcbiAgIyBBdXRoZW50aWNhdGUgdGhlIHVzZXIncyBwYXNzd29yZFxyXG4gIHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZFxyXG4gIGlmIHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yXHJcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuXHJcbiAgIyBBZGQgYSBuZXcgYXV0aCB0b2tlbiB0byB0aGUgdXNlcidzIGFjY291bnRcclxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpXHJcbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbiBhdXRoVG9rZW5cclxuICBBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlblxyXG5cclxuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWR9KS5mZXRjaCgpXHJcbiAgc3BhY2VzID0gW11cclxuICBfLmVhY2ggc3BhY2VfdXNlcnMsIChzdSktPlxyXG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSlcclxuICAgICMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xyXG4gICAgaWYgc3BhY2U/LmlzX3BhaWQgYW5kIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpPj0wXHJcbiAgICAgIHNwYWNlcy5wdXNoXHJcbiAgICAgICAgX2lkOiBzcGFjZS5faWRcclxuICAgICAgICBuYW1lOiBzcGFjZS5uYW1lXHJcbiAgcmV0dXJuIHthdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbiwgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBhZG1pblNwYWNlczogc3BhY2VzfVxyXG4iLCJ2YXIgZ2V0VXNlclF1ZXJ5U2VsZWN0b3IsIHVzZXJWYWxpZGF0b3I7XG5cbnRoaXMuQXV0aCB8fCAodGhpcy5BdXRoID0ge30pO1xuXG5cbi8qXG4gIEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcbiAqL1xuXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24odXNlcikge1xuICBjaGVjayh1c2VyLCB7XG4gICAgaWQ6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgZW1haWw6IE1hdGNoLk9wdGlvbmFsKFN0cmluZylcbiAgfSk7XG4gIGlmIChfLmtleXModXNlcikubGVuZ3RoID09PSAhMSkge1xuICAgIHRocm93IG5ldyBNYXRjaC5FcnJvcignVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCcpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cblxuLypcbiAgUmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxuICovXG5cbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gZnVuY3Rpb24odXNlcikge1xuICBpZiAodXNlci5pZCkge1xuICAgIHJldHVybiB7XG4gICAgICAnX2lkJzogdXNlci5pZFxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci51c2VybmFtZSkge1xuICAgIHJldHVybiB7XG4gICAgICAndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLmVtYWlsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWxcbiAgICB9O1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcicpO1xufTtcblxuXG4vKlxuICBMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcbiAqL1xuXG50aGlzLkF1dGgubG9naW5XaXRoUGFzc3dvcmQgPSBmdW5jdGlvbih1c2VyLCBwYXNzd29yZCkge1xuICB2YXIgYXV0aFRva2VuLCBhdXRoZW50aWNhdGluZ1VzZXIsIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yLCBoYXNoZWRUb2tlbiwgcGFzc3dvcmRWZXJpZmljYXRpb24sIHJlZiwgc3BhY2VfdXNlcnMsIHNwYWNlcztcbiAgaWYgKCF1c2VyIHx8ICFwYXNzd29yZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgY2hlY2sodXNlciwgdXNlclZhbGlkYXRvcik7XG4gIGNoZWNrKHBhc3N3b3JkLCBTdHJpbmcpO1xuICBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpO1xuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3Rvcik7XG4gIGlmICghYXV0aGVudGljYXRpbmdVc2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBpZiAoISgocmVmID0gYXV0aGVudGljYXRpbmdVc2VyLnNlcnZpY2VzKSAhPSBudWxsID8gcmVmLnBhc3N3b3JkIDogdm9pZCAwKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgcGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZChhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkKTtcbiAgaWYgKHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuKGF1dGhUb2tlbik7XG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuKGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuKTtcbiAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkXG4gIH0pLmZldGNoKCk7XG4gIHNwYWNlcyA9IFtdO1xuICBfLmVhY2goc3BhY2VfdXNlcnMsIGZ1bmN0aW9uKHN1KSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3Uuc3BhY2UpO1xuICAgIGlmICgoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmlzX3BhaWQgOiB2b2lkIDApICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpID49IDApIHtcbiAgICAgIHJldHVybiBzcGFjZXMucHVzaCh7XG4gICAgICAgIF9pZDogc3BhY2UuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZS5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIGF1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLFxuICAgIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCxcbiAgICBhZG1pblNwYWNlczogc3BhY2VzXG4gIH07XG59O1xuIiwiLy8gV2UgbmVlZCBhIGZ1bmN0aW9uIHRoYXQgdHJlYXRzIHRocm93biBlcnJvcnMgZXhhY3RseSBsaWtlIElyb24gUm91dGVyIHdvdWxkLlxyXG4vLyBUaGlzIGZpbGUgaXMgd3JpdHRlbiBpbiBKYXZhU2NyaXB0IHRvIGVuYWJsZSBjb3B5LXBhc3RpbmcgSXJvbiBSb3V0ZXIgY29kZS5cclxuXHJcbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDNcclxudmFyIGVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XHJcblxyXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0w0N1xyXG5pcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSA9IGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzKSB7XHJcbiAgaWYgKHJlcy5zdGF0dXNDb2RlIDwgNDAwKVxyXG4gICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XHJcblxyXG4gIGlmIChlcnIuc3RhdHVzKVxyXG4gICAgcmVzLnN0YXR1c0NvZGUgPSBlcnIuc3RhdHVzO1xyXG5cclxuICBpZiAoZW52ID09PSAnZGV2ZWxvcG1lbnQnKVxyXG4gICAgbXNnID0gKGVyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKSkgKyAnXFxuJztcclxuICBlbHNlXHJcbiAgICAvL1hYWCBnZXQgdGhpcyBmcm9tIHN0YW5kYXJkIGRpY3Qgb2YgZXJyb3IgbWVzc2FnZXM/XHJcbiAgICBtc2cgPSAnU2VydmVyIGVycm9yLic7XHJcblxyXG4gIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKTtcclxuXHJcbiAgaWYgKHJlcy5oZWFkZXJzU2VudClcclxuICAgIHJldHVybiByZXEuc29ja2V0LmRlc3Ryb3koKTtcclxuXHJcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xyXG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgQnVmZmVyLmJ5dGVMZW5ndGgobXNnKSk7XHJcbiAgaWYgKHJlcS5tZXRob2QgPT09ICdIRUFEJylcclxuICAgIHJldHVybiByZXMuZW5kKCk7XHJcbiAgcmVzLmVuZChtc2cpO1xyXG4gIHJldHVybjtcclxufVxyXG4iLCJjbGFzcyBzaGFyZS5Sb3V0ZVxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEBhcGksIEBwYXRoLCBAb3B0aW9ucywgQGVuZHBvaW50cykgLT5cclxuICAgICMgQ2hlY2sgaWYgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkXHJcbiAgICBpZiBub3QgQGVuZHBvaW50c1xyXG4gICAgICBAZW5kcG9pbnRzID0gQG9wdGlvbnNcclxuICAgICAgQG9wdGlvbnMgPSB7fVxyXG5cclxuXHJcbiAgYWRkVG9BcGk6IGRvIC0+XHJcbiAgICBhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXVxyXG5cclxuICAgIHJldHVybiAtPlxyXG4gICAgICBzZWxmID0gdGhpc1xyXG5cclxuICAgICAgIyBUaHJvdyBhbiBlcnJvciBpZiBhIHJvdXRlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgYXQgdGhpcyBwYXRoXHJcbiAgICAgICMgVE9ETzogQ2hlY2sgZm9yIGNvbGxpc2lvbnMgd2l0aCBwYXRocyB0aGF0IGZvbGxvdyBzYW1lIHBhdHRlcm4gd2l0aCBkaWZmZXJlbnQgcGFyYW1ldGVyIG5hbWVzXHJcbiAgICAgIGlmIF8uY29udGFpbnMgQGFwaS5fY29uZmlnLnBhdGhzLCBAcGF0aFxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiAje0BwYXRofVwiXHJcblxyXG4gICAgICAjIE92ZXJyaWRlIHRoZSBkZWZhdWx0IE9QVElPTlMgZW5kcG9pbnQgd2l0aCBvdXIgb3duXHJcbiAgICAgIEBlbmRwb2ludHMgPSBfLmV4dGVuZCBvcHRpb25zOiBAYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCwgQGVuZHBvaW50c1xyXG5cclxuICAgICAgIyBDb25maWd1cmUgZWFjaCBlbmRwb2ludCBvbiB0aGlzIHJvdXRlXHJcbiAgICAgIEBfcmVzb2x2ZUVuZHBvaW50cygpXHJcbiAgICAgIEBfY29uZmlndXJlRW5kcG9pbnRzKClcclxuXHJcbiAgICAgICMgQWRkIHRvIG91ciBsaXN0IG9mIGV4aXN0aW5nIHBhdGhzXHJcbiAgICAgIEBhcGkuX2NvbmZpZy5wYXRocy5wdXNoIEBwYXRoXHJcblxyXG4gICAgICBhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyIGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XHJcbiAgICAgICAgXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXHJcbiAgICAgIHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0IGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XHJcbiAgICAgICAgXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXHJcblxyXG4gICAgICAjIFNldHVwIGVuZHBvaW50cyBvbiByb3V0ZVxyXG4gICAgICBmdWxsUGF0aCA9IEBhcGkuX2NvbmZpZy5hcGlQYXRoICsgQHBhdGhcclxuICAgICAgXy5lYWNoIGFsbG93ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxyXG4gICAgICAgIGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXVxyXG4gICAgICAgIEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cclxuICAgICAgICAgICMgQWRkIGZ1bmN0aW9uIHRvIGVuZHBvaW50IGNvbnRleHQgZm9yIGluZGljYXRpbmcgYSByZXNwb25zZSBoYXMgYmVlbiBpbml0aWF0ZWQgbWFudWFsbHlcclxuICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2VcclxuICAgICAgICAgIGRvbmVGdW5jID0gLT5cclxuICAgICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlXHJcblxyXG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID1cclxuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zXHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiByZXEucXVlcnlcclxuICAgICAgICAgICAgYm9keVBhcmFtczogcmVxLmJvZHlcclxuICAgICAgICAgICAgcmVxdWVzdDogcmVxXHJcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXNcclxuICAgICAgICAgICAgZG9uZTogZG9uZUZ1bmNcclxuICAgICAgICAgICMgQWRkIGVuZHBvaW50IGNvbmZpZyBvcHRpb25zIHRvIGNvbnRleHRcclxuICAgICAgICAgIF8uZXh0ZW5kIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuXHJcbiAgICAgICAgICAjIFJ1biB0aGUgcmVxdWVzdGVkIGVuZHBvaW50XHJcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsXHJcbiAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgcmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50IGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuICAgICAgICAgIGNhdGNoIGVycm9yXHJcbiAgICAgICAgICAgICMgRG8gZXhhY3RseSB3aGF0IElyb24gUm91dGVyIHdvdWxkIGhhdmUgZG9uZSwgdG8gYXZvaWQgY2hhbmdpbmcgdGhlIEFQSVxyXG4gICAgICAgICAgICBpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xyXG4gICAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgICBpZiByZXNwb25zZUluaXRpYXRlZFxyXG4gICAgICAgICAgICAjIEVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgcHJvcGVybHkgY29tcGxldGVkXHJcbiAgICAgICAgICAgIHJlcy5lbmQoKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaWYgcmVzLmhlYWRlcnNTZW50XHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxyXG4gICAgICAgICAgICBlbHNlIGlmIHJlc3BvbnNlRGF0YSBpcyBudWxsIG9yIHJlc3BvbnNlRGF0YSBpcyB1bmRlZmluZWRcclxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXHJcblxyXG4gICAgICAgICAgIyBHZW5lcmF0ZSBhbmQgcmV0dXJuIHRoZSBodHRwIHJlc3BvbnNlLCBoYW5kbGluZyB0aGUgZGlmZmVyZW50IGVuZHBvaW50IHJlc3BvbnNlIHR5cGVzXHJcbiAgICAgICAgICBpZiByZXNwb25zZURhdGEuYm9keSBhbmQgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIG9yIHJlc3BvbnNlRGF0YS5oZWFkZXJzKVxyXG4gICAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVyc1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhXHJcblxyXG4gICAgICBfLmVhY2ggcmVqZWN0ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxyXG4gICAgICAgIEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cclxuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcclxuICAgICAgICAgIGhlYWRlcnMgPSAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcclxuICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVyc1xyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBDb252ZXJ0IGFsbCBlbmRwb2ludHMgb24gdGhlIGdpdmVuIHJvdXRlIGludG8gb3VyIGV4cGVjdGVkIGVuZHBvaW50IG9iamVjdCBpZiBpdCBpcyBhIGJhcmVcclxuICAgIGZ1bmN0aW9uXHJcblxyXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXHJcbiAgIyMjXHJcbiAgX3Jlc29sdmVFbmRwb2ludHM6IC0+XHJcbiAgICBfLmVhY2ggQGVuZHBvaW50cywgKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykgLT5cclxuICAgICAgaWYgXy5pc0Z1bmN0aW9uKGVuZHBvaW50KVxyXG4gICAgICAgIGVuZHBvaW50c1ttZXRob2RdID0ge2FjdGlvbjogZW5kcG9pbnR9XHJcbiAgICByZXR1cm5cclxuXHJcblxyXG4gICMjI1xyXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxyXG4gICAgYmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXHJcblxyXG4gICAgQXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cclxuICAgIGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXHJcbiAgICBvdmVycmlkZSB0aGUgZGVmYXVsdC5cclxuXHJcbiAgICBBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcclxuICAgIGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXHJcbiAgICByZXNwZWN0aXZlbHkuXHJcblxyXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXHJcbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXHJcbiAgIyMjXHJcbiAgX2NvbmZpZ3VyZUVuZHBvaW50czogLT5cclxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCkgLT5cclxuICAgICAgaWYgbWV0aG9kIGlzbnQgJ29wdGlvbnMnXHJcbiAgICAgICAgIyBDb25maWd1cmUgYWNjZXB0YWJsZSByb2xlc1xyXG4gICAgICAgIGlmIG5vdCBAb3B0aW9ucz8ucm9sZVJlcXVpcmVkXHJcbiAgICAgICAgICBAb3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXVxyXG4gICAgICAgIGlmIG5vdCBlbmRwb2ludC5yb2xlUmVxdWlyZWRcclxuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdXHJcbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbiBlbmRwb2ludC5yb2xlUmVxdWlyZWQsIEBvcHRpb25zLnJvbGVSZXF1aXJlZFxyXG4gICAgICAgICMgTWFrZSBpdCBlYXNpZXIgdG8gY2hlY2sgaWYgbm8gcm9sZXMgYXJlIHJlcXVpcmVkXHJcbiAgICAgICAgaWYgXy5pc0VtcHR5IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxyXG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2VcclxuXHJcbiAgICAgICAgIyBDb25maWd1cmUgYXV0aCByZXF1aXJlbWVudFxyXG4gICAgICAgIGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZCBpcyB1bmRlZmluZWRcclxuICAgICAgICAgIGlmIEBvcHRpb25zPy5hdXRoUmVxdWlyZWQgb3IgZW5kcG9pbnQucm9sZVJlcXVpcmVkXHJcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWVcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2VcclxuXHJcbiAgICAgICAgaWYgQG9wdGlvbnM/LnNwYWNlUmVxdWlyZWRcclxuICAgICAgICAgIGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSBAb3B0aW9ucy5zcGFjZVJlcXVpcmVkXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAsIHRoaXNcclxuICAgIHJldHVyblxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XHJcblxyXG4gICAgQHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXHJcbiAgIyMjXHJcbiAgX2NhbGxFbmRwb2ludDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XHJcbiAgICAjIENhbGwgdGhlIGVuZHBvaW50IGlmIGF1dGhlbnRpY2F0aW9uIGRvZXNuJ3QgZmFpbFxyXG4gICAgaWYgQF9hdXRoQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG4gICAgICBpZiBAX3JvbGVBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XHJcbiAgICAgICAgaWYgQF9zcGFjZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuICAgICAgICAgICNlbmRwb2ludC5hY3Rpb24uY2FsbCBlbmRwb2ludENvbnRleHRcclxuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb25cclxuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXHJcbiAgICAgICAgICAgIGNvbm5lY3Rpb246IG51bGwsXHJcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXHJcbiAgICAgICBcclxuICAgICAgICAgIHJldHVybiBERFAuX0N1cnJlbnRJbnZvY2F0aW9uLndpdGhWYWx1ZSBpbnZvY2F0aW9uLCAtPlxyXG4gICAgICAgICAgICByZXR1cm4gZW5kcG9pbnQuYWN0aW9uLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBzdGF0dXNDb2RlOiA0MDNcclxuICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdCYWQgWC1TcGFjZS1JZCwgT25seSBhZG1pbnMgb2YgcGFpZCBzcGFjZSBjYW4gY2FsbCB0aGlzIGFwaS4nfVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgc3RhdHVzQ29kZTogNDAzXHJcbiAgICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRvIHRoaXMuJ31cclxuICAgIGVsc2VcclxuICAgICAgc3RhdHVzQ29kZTogNDAxXHJcbiAgICAgIGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gZG8gdGhpcy4nfVxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXHJcblxyXG4gICAgT25jZSBpdCdzIGdsb2JhbGx5IGNvbmZpZ3VyZWQgaW4gdGhlIEFQSSwgYXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvclxyXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXHJcbiAgICBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cclxuXHJcbiAgICBAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXHJcbiAgIyMjXHJcbiAgX2F1dGhBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XHJcbiAgICBpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWRcclxuICAgICAgQF9hdXRoZW50aWNhdGUgZW5kcG9pbnRDb250ZXh0XHJcbiAgICBlbHNlIHRydWVcclxuXHJcblxyXG4gICMjI1xyXG4gICAgVmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcclxuXHJcbiAgICBJZiB2ZXJpZmllZCwgYXR0YWNoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgdG8gdGhlIGNvbnRleHQuXHJcblxyXG4gICAgQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXHJcbiAgIyMjXHJcbiAgX2F1dGhlbnRpY2F0ZTogKGVuZHBvaW50Q29udGV4dCkgLT5cclxuICAgICMgR2V0IGF1dGggaW5mb1xyXG4gICAgYXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXHJcblxyXG4gICAgIyBHZXQgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2VcclxuICAgIGlmIGF1dGg/LnVzZXJJZCBhbmQgYXV0aD8udG9rZW4gYW5kIG5vdCBhdXRoPy51c2VyXHJcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9XHJcbiAgICAgIHVzZXJTZWxlY3Rvci5faWQgPSBhdXRoLnVzZXJJZFxyXG4gICAgICB1c2VyU2VsZWN0b3JbQGFwaS5fY29uZmlnLmF1dGgudG9rZW5dID0gYXV0aC50b2tlblxyXG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSB1c2VyU2VsZWN0b3JcclxuXHJcbiAgICAjIEF0dGFjaCB0aGUgdXNlciBhbmQgdGhlaXIgSUQgdG8gdGhlIGNvbnRleHQgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXHJcbiAgICBpZiBhdXRoPy51c2VyXHJcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VyID0gYXV0aC51c2VyXHJcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkXHJcbiAgICAgIHRydWVcclxuICAgIGVsc2UgZmFsc2VcclxuXHJcbiAgIyMjXHJcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxyXG5cclxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cclxuXHJcbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxyXG4gICAgICAgICAgICAgZW5kcG9pbnRcclxuICAjIyNcclxuICBfc3BhY2VBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XHJcbiAgICBpZiBlbmRwb2ludC5zcGFjZVJlcXVpcmVkXHJcbiAgICAgIGF1dGggPSBAYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KVxyXG4gICAgICBpZiBhdXRoPy5zcGFjZUlkXHJcbiAgICAgICAgc3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoLnVzZXJJZCwgc3BhY2U6YXV0aC5zcGFjZUlkfSkuY291bnQoKVxyXG4gICAgICAgIGlmIHNwYWNlX3VzZXJzX2NvdW50XHJcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZClcclxuICAgICAgICAgICMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xyXG4gICAgICAgICAgaWYgc3BhY2U/LmlzX3BhaWQgYW5kIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIGF1dGgudXNlcklkKT49MFxyXG4gICAgICAgICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IGF1dGguc3BhY2VJZFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCJcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAjIyNcclxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXHJcblxyXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxyXG5cclxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXHJcbiAgICAgICAgICAgICBlbmRwb2ludFxyXG4gICMjI1xyXG4gIF9yb2xlQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxyXG4gICAgaWYgZW5kcG9pbnQucm9sZVJlcXVpcmVkXHJcbiAgICAgIGlmIF8uaXNFbXB0eSBfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgdHJ1ZVxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBSZXNwb25kIHRvIGFuIEhUVFAgcmVxdWVzdFxyXG4gICMjI1xyXG4gIF9yZXNwb25kOiAocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGU9MjAwLCBoZWFkZXJzPXt9KSAtPlxyXG4gICAgIyBPdmVycmlkZSBhbnkgZGVmYXVsdCBoZWFkZXJzIHRoYXQgaGF2ZSBiZWVuIHByb3ZpZGVkIChrZXlzIGFyZSBub3JtYWxpemVkIHRvIGJlIGNhc2UgaW5zZW5zaXRpdmUpXHJcbiAgICAjIFRPRE86IENvbnNpZGVyIG9ubHkgbG93ZXJjYXNpbmcgdGhlIGhlYWRlciBrZXlzIHdlIG5lZWQgbm9ybWFsaXplZCwgbGlrZSBDb250ZW50LVR5cGVcclxuICAgIGRlZmF1bHRIZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIEBhcGkuX2NvbmZpZy5kZWZhdWx0SGVhZGVyc1xyXG4gICAgaGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBoZWFkZXJzXHJcbiAgICBoZWFkZXJzID0gXy5leHRlbmQgZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnNcclxuXHJcbiAgICAjIFByZXBhcmUgSlNPTiBib2R5IGZvciByZXNwb25zZSB3aGVuIENvbnRlbnQtVHlwZSBpbmRpY2F0ZXMgSlNPTiB0eXBlXHJcbiAgICBpZiBoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgaXNudCBudWxsXHJcbiAgICAgIGlmIEBhcGkuX2NvbmZpZy5wcmV0dHlKc29uXHJcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHksIHVuZGVmaW5lZCwgMlxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHlcclxuXHJcbiAgICAjIFNlbmQgcmVzcG9uc2VcclxuICAgIHNlbmRSZXNwb25zZSA9IC0+XHJcbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCBzdGF0dXNDb2RlLCBoZWFkZXJzXHJcbiAgICAgIHJlc3BvbnNlLndyaXRlIGJvZHlcclxuICAgICAgcmVzcG9uc2UuZW5kKClcclxuICAgIGlmIHN0YXR1c0NvZGUgaW4gWzQwMSwgNDAzXVxyXG4gICAgICAjIEhhY2tlcnMgY2FuIG1lYXN1cmUgdGhlIHJlc3BvbnNlIHRpbWUgdG8gZGV0ZXJtaW5lIHRoaW5ncyBsaWtlIHdoZXRoZXIgdGhlIDQwMSByZXNwb25zZSB3YXMgXHJcbiAgICAgICMgY2F1c2VkIGJ5IGJhZCB1c2VyIGlkIHZzIGJhZCBwYXNzd29yZC5cclxuICAgICAgIyBJbiBkb2luZyBzbywgdGhleSBjYW4gZmlyc3Qgc2NhbiBmb3IgdmFsaWQgdXNlciBpZHMgcmVnYXJkbGVzcyBvZiB2YWxpZCBwYXNzd29yZHMuXHJcbiAgICAgICMgRGVsYXkgYnkgYSByYW5kb20gYW1vdW50IHRvIHJlZHVjZSB0aGUgYWJpbGl0eSBmb3IgYSBoYWNrZXIgdG8gZGV0ZXJtaW5lIHRoZSByZXNwb25zZSB0aW1lLlxyXG4gICAgICAjIFNlZSBodHRwczovL3d3dy5vd2FzcC5vcmcvaW5kZXgucGhwL0Jsb2NraW5nX0JydXRlX0ZvcmNlX0F0dGFja3MjRmluZGluZ19PdGhlcl9Db3VudGVybWVhc3VyZXNcclxuICAgICAgIyBTZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGltaW5nX2F0dGFja1xyXG4gICAgICBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMFxyXG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpXHJcbiAgICAgIGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvXHJcbiAgICAgIE1ldGVvci5zZXRUaW1lb3V0IHNlbmRSZXNwb25zZSwgZGVsYXlJbk1pbGxpc2Vjb25kc1xyXG4gICAgZWxzZVxyXG4gICAgICBzZW5kUmVzcG9uc2UoKVxyXG5cclxuICAjIyNcclxuICAgIFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcclxuICAjIyNcclxuICBfbG93ZXJDYXNlS2V5czogKG9iamVjdCkgLT5cclxuICAgIF8uY2hhaW4gb2JqZWN0XHJcbiAgICAucGFpcnMoKVxyXG4gICAgLm1hcCAoYXR0cikgLT5cclxuICAgICAgW2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV1cclxuICAgIC5vYmplY3QoKVxyXG4gICAgLnZhbHVlKClcclxuIiwic2hhcmUuUm91dGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJvdXRlKGFwaSwgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzMSkge1xuICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmVuZHBvaW50cyA9IGVuZHBvaW50czE7XG4gICAgaWYgKCF0aGlzLmVuZHBvaW50cykge1xuICAgICAgdGhpcy5lbmRwb2ludHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBSb3V0ZS5wcm90b3R5cGUuYWRkVG9BcGkgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF2YWlsYWJsZU1ldGhvZHM7XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ107XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFsbG93ZWRNZXRob2RzLCBmdWxsUGF0aCwgcmVqZWN0ZWRNZXRob2RzLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoXy5jb250YWlucyh0aGlzLmFwaS5fY29uZmlnLnBhdGhzLCB0aGlzLnBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiBcIiArIHRoaXMucGF0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgb3B0aW9uczogdGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XG4gICAgICB9LCB0aGlzLmVuZHBvaW50cyk7XG4gICAgICB0aGlzLl9yZXNvbHZlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuYXBpLl9jb25maWcucGF0aHMucHVzaCh0aGlzLnBhdGgpO1xuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlcihhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIGZ1bGxQYXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hcGlQYXRoICsgdGhpcy5wYXRoO1xuICAgICAgXy5lYWNoKGFsbG93ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50O1xuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF07XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBkb25lRnVuYywgZW5kcG9pbnRDb250ZXh0LCBlcnJvciwgcmVzcG9uc2VEYXRhLCByZXNwb25zZUluaXRpYXRlZDtcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlO1xuICAgICAgICAgIGRvbmVGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID0ge1xuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeSxcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5LFxuICAgICAgICAgICAgcmVxdWVzdDogcmVxLFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlcyxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfLmV4dGVuZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZUluaXRpYXRlZCkge1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLmhlYWRlcnNTZW50KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VEYXRhID09PSBudWxsIHx8IHJlc3BvbnNlRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlRGF0YS5ib2R5ICYmIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSB8fCByZXNwb25zZURhdGEuaGVhZGVycykpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlamVjdGVkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBoZWFkZXJzLCByZXNwb25zZURhdGE7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCk7XG5cblxuICAvKlxuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICAgIGZ1bmN0aW9uXG4gIFxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc29sdmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbmRwb2ludCkpIHtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50c1ttZXRob2RdID0ge1xuICAgICAgICAgIGFjdGlvbjogZW5kcG9pbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICAgIGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuICBcbiAgICBBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICAgIGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG4gICAgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuICAgIGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG4gICAgcmVzcGVjdGl2ZWx5LlxuICBcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY29uZmlndXJlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kKSB7XG4gICAgICB2YXIgcmVmLCByZWYxLCByZWYyO1xuICAgICAgaWYgKG1ldGhvZCAhPT0gJ29wdGlvbnMnKSB7XG4gICAgICAgIGlmICghKChyZWYgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYucm9sZVJlcXVpcmVkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkKTtcbiAgICAgICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludC5yb2xlUmVxdWlyZWQpKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKCgocmVmMSA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjEuYXV0aFJlcXVpcmVkIDogdm9pZCAwKSB8fCBlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHJlZjIgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYyLnNwYWNlUmVxdWlyZWQgOiB2b2lkIDApIHtcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gdGhpcy5vcHRpb25zLnNwYWNlUmVxdWlyZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIGFuIGVuZHBvaW50IGlmIHJlcXVpcmVkLCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdFxuICBcbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jYWxsRW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGludm9jYXRpb247XG4gICAgaWYgKHRoaXMuX2F1dGhBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgaWYgKHRoaXMuX3JvbGVBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICBpZiAodGhpcy5fc3BhY2VBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb24oe1xuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlKGludm9jYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuICBcbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gICAgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2F1dGhlbnRpY2F0ZShlbmRwb2ludENvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG4gIFxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cbiAgXG4gICAgQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aGVudGljYXRlID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0KSB7XG4gICAgdmFyIGF1dGgsIHVzZXJTZWxlY3RvcjtcbiAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgIGlmICgoYXV0aCAhPSBudWxsID8gYXV0aC51c2VySWQgOiB2b2lkIDApICYmIChhdXRoICE9IG51bGwgPyBhdXRoLnRva2VuIDogdm9pZCAwKSAmJiAhKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkpIHtcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9O1xuICAgICAgdXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkO1xuICAgICAgdXNlclNlbGVjdG9yW3RoaXMuYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuO1xuICAgICAgYXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUodXNlclNlbGVjdG9yKTtcbiAgICB9XG4gICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkge1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXI7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9zcGFjZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBhdXRoLCBzcGFjZSwgc3BhY2VfdXNlcnNfY291bnQ7XG4gICAgaWYgKGVuZHBvaW50LnNwYWNlUmVxdWlyZWQpIHtcbiAgICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC5zcGFjZUlkIDogdm9pZCAwKSB7XG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgdXNlcjogYXV0aC51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IGF1dGguc3BhY2VJZFxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcnNfY291bnQpIHtcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpID49IDApIHtcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yb2xlQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgaWYgKF8uaXNFbXB0eShfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qXG4gICAgUmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3RcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNwb25kID0gZnVuY3Rpb24ocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGUsIGhlYWRlcnMpIHtcbiAgICB2YXIgZGVmYXVsdEhlYWRlcnMsIGRlbGF5SW5NaWxsaXNlY29uZHMsIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzLCByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bywgc2VuZFJlc3BvbnNlO1xuICAgIGlmIChzdGF0dXNDb2RlID09IG51bGwpIHtcbiAgICAgIHN0YXR1c0NvZGUgPSAyMDA7XG4gICAgfVxuICAgIGlmIChoZWFkZXJzID09IG51bGwpIHtcbiAgICAgIGhlYWRlcnMgPSB7fTtcbiAgICB9XG4gICAgZGVmYXVsdEhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKGhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSBfLmV4dGVuZChkZWZhdWx0SGVhZGVycywgaGVhZGVycyk7XG4gICAgaWYgKGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYXBpLl9jb25maWcucHJldHR5SnNvbikge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSwgdm9pZCAwLCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNwb25zZS53cml0ZUhlYWQoc3RhdHVzQ29kZSwgaGVhZGVycyk7XG4gICAgICByZXNwb25zZS53cml0ZShib2R5KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5lbmQoKTtcbiAgICB9O1xuICAgIGlmIChzdGF0dXNDb2RlID09PSA0MDEgfHwgc3RhdHVzQ29kZSA9PT0gNDAzKSB7XG4gICAgICBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMDtcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKCk7XG4gICAgICBkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bztcbiAgICAgIHJldHVybiBNZXRlb3Iuc2V0VGltZW91dChzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2VuZFJlc3BvbnNlKCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fbG93ZXJDYXNlS2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBfLmNoYWluKG9iamVjdCkucGFpcnMoKS5tYXAoZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dO1xuICAgIH0pLm9iamVjdCgpLnZhbHVlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJvdXRlO1xuXG59KSgpO1xuIiwiY2xhc3MgQFJlc3RpdnVzXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cclxuICAgIEBfcm91dGVzID0gW11cclxuICAgIEBfY29uZmlnID1cclxuICAgICAgcGF0aHM6IFtdXHJcbiAgICAgIHVzZURlZmF1bHRBdXRoOiBmYWxzZVxyXG4gICAgICBhcGlQYXRoOiAnYXBpLydcclxuICAgICAgdmVyc2lvbjogbnVsbFxyXG4gICAgICBwcmV0dHlKc29uOiBmYWxzZVxyXG4gICAgICBhdXRoOlxyXG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJ1xyXG4gICAgICAgIHVzZXI6IC0+XHJcbiAgICAgICAgICBpZiBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXVxyXG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXVxyXG4gICAgICAgICAgaWYgQHJlcXVlc3QudXNlcklkXHJcbiAgICAgICAgICAgIF91c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBAcmVxdWVzdC51c2VySWR9KVxyXG4gICAgICAgICAgICB1c2VyOiBfdXNlclxyXG4gICAgICAgICAgICB1c2VySWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddXHJcbiAgICAgICAgICAgIHNwYWNlSWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXVxyXG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdXNlcklkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXVxyXG4gICAgICAgICAgICBzcGFjZUlkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ11cclxuICAgICAgICAgICAgdG9rZW46IHRva2VuXHJcbiAgICAgIGRlZmF1bHRIZWFkZXJzOlxyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgZW5hYmxlQ29yczogdHJ1ZVxyXG5cclxuICAgICMgQ29uZmlndXJlIEFQSSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXHJcbiAgICBfLmV4dGVuZCBAX2NvbmZpZywgb3B0aW9uc1xyXG5cclxuICAgIGlmIEBfY29uZmlnLmVuYWJsZUNvcnNcclxuICAgICAgY29yc0hlYWRlcnMgPVxyXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKidcclxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0J1xyXG5cclxuICAgICAgaWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcclxuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuJ1xyXG5cclxuICAgICAgIyBTZXQgZGVmYXVsdCBoZWFkZXIgdG8gZW5hYmxlIENPUlMgaWYgY29uZmlndXJlZFxyXG4gICAgICBfLmV4dGVuZCBAX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnNcclxuXHJcbiAgICAgIGlmIG5vdCBAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XHJcbiAgICAgICAgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IC0+XHJcbiAgICAgICAgICBAcmVzcG9uc2Uud3JpdGVIZWFkIDIwMCwgY29yc0hlYWRlcnNcclxuICAgICAgICAgIEBkb25lKClcclxuXHJcbiAgICAjIE5vcm1hbGl6ZSB0aGUgQVBJIHBhdGhcclxuICAgIGlmIEBfY29uZmlnLmFwaVBhdGhbMF0gaXMgJy8nXHJcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoLnNsaWNlIDFcclxuICAgIGlmIF8ubGFzdChAX2NvbmZpZy5hcGlQYXRoKSBpc250ICcvJ1xyXG4gICAgICBAX2NvbmZpZy5hcGlQYXRoID0gQF9jb25maWcuYXBpUGF0aCArICcvJ1xyXG5cclxuICAgICMgVVJMIHBhdGggdmVyc2lvbmluZyBpcyB0aGUgb25seSB0eXBlIG9mIEFQSSB2ZXJzaW9uaW5nIGN1cnJlbnRseSBhdmFpbGFibGUsIHNvIGlmIGEgdmVyc2lvbiBpc1xyXG4gICAgIyBwcm92aWRlZCwgYXBwZW5kIGl0IHRvIHRoZSBiYXNlIHBhdGggb2YgdGhlIEFQSVxyXG4gICAgaWYgQF9jb25maWcudmVyc2lvblxyXG4gICAgICBAX2NvbmZpZy5hcGlQYXRoICs9IEBfY29uZmlnLnZlcnNpb24gKyAnLydcclxuXHJcbiAgICAjIEFkZCBkZWZhdWx0IGxvZ2luIGFuZCBsb2dvdXQgZW5kcG9pbnRzIGlmIGF1dGggaXMgY29uZmlndXJlZFxyXG4gICAgaWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcclxuICAgICAgQF9pbml0QXV0aCgpXHJcbiAgICBlbHNlIGlmIEBfY29uZmlnLnVzZUF1dGhcclxuICAgICAgQF9pbml0QXV0aCgpXHJcbiAgICAgIGNvbnNvbGUud2FybiAnV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICtcclxuICAgICAgICAgICdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCdcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG5cclxuXHJcbiAgIyMjKlxyXG4gICAgQWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxyXG5cclxuICAgIEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcclxuICAgIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xyXG4gICAgQHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxyXG4gICAgQHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXHJcbiAgICBAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXHJcbiAgICBAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXHJcbiAgICAgICAgY29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxyXG4gICAgICAgIGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cclxuICAjIyNcclxuICBhZGRSb3V0ZTogKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykgLT5cclxuICAgICMgQ3JlYXRlIGEgbmV3IHJvdXRlIGFuZCBhZGQgaXQgdG8gb3VyIGxpc3Qgb2YgZXhpc3Rpbmcgcm91dGVzXHJcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpXHJcbiAgICBAX3JvdXRlcy5wdXNoKHJvdXRlKVxyXG5cclxuICAgIHJvdXRlLmFkZFRvQXBpKClcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG5cclxuXHJcbiAgIyMjKlxyXG4gICAgR2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxyXG4gICMjI1xyXG4gIGFkZENvbGxlY3Rpb246IChjb2xsZWN0aW9uLCBvcHRpb25zPXt9KSAtPlxyXG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXVxyXG4gICAgbWV0aG9kc09uQ29sbGVjdGlvbiA9IFsncG9zdCcsICdnZXRBbGwnXVxyXG5cclxuICAgICMgR3JhYiB0aGUgc2V0IG9mIGVuZHBvaW50c1xyXG4gICAgaWYgY29sbGVjdGlvbiBpcyBNZXRlb3IudXNlcnNcclxuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IEBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHNcclxuICAgIGVsc2VcclxuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IEBfY29sbGVjdGlvbkVuZHBvaW50c1xyXG5cclxuICAgICMgRmxhdHRlbiB0aGUgb3B0aW9ucyBhbmQgc2V0IGRlZmF1bHRzIGlmIG5lY2Vzc2FyeVxyXG4gICAgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgb3Ige31cclxuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIG9yIHt9XHJcbiAgICBleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgb3IgW11cclxuICAgICMgVXNlIGNvbGxlY3Rpb24gbmFtZSBhcyBkZWZhdWx0IHBhdGhcclxuICAgIHBhdGggPSBvcHRpb25zLnBhdGggb3IgY29sbGVjdGlvbi5fbmFtZVxyXG5cclxuICAgICMgU2VwYXJhdGUgdGhlIHJlcXVlc3RlZCBlbmRwb2ludHMgYnkgdGhlIHJvdXRlIHRoZXkgYmVsb25nIHRvIChvbmUgZm9yIG9wZXJhdGluZyBvbiB0aGUgZW50aXJlXHJcbiAgICAjIGNvbGxlY3Rpb24gYW5kIG9uZSBmb3Igb3BlcmF0aW5nIG9uIGEgc2luZ2xlIGVudGl0eSB3aXRoaW4gdGhlIGNvbGxlY3Rpb24pXHJcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fVxyXG4gICAgZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fVxyXG4gICAgaWYgXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgYW5kIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cylcclxuICAgICAgIyBHZW5lcmF0ZSBhbGwgZW5kcG9pbnRzIG9uIHRoaXMgY29sbGVjdGlvblxyXG4gICAgICBfLmVhY2ggbWV0aG9kcywgKG1ldGhvZCkgLT5cclxuICAgICAgICAjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcclxuICAgICAgICBpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxyXG4gICAgICAgICAgXy5leHRlbmQgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKVxyXG4gICAgICAgIGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgICwgdGhpc1xyXG4gICAgZWxzZVxyXG4gICAgICAjIEdlbmVyYXRlIGFueSBlbmRwb2ludHMgdGhhdCBoYXZlbid0IGJlZW4gZXhwbGljaXRseSBleGNsdWRlZFxyXG4gICAgICBfLmVhY2ggbWV0aG9kcywgKG1ldGhvZCkgLT5cclxuICAgICAgICBpZiBtZXRob2Qgbm90IGluIGV4Y2x1ZGVkRW5kcG9pbnRzIGFuZCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSBpc250IGZhbHNlXHJcbiAgICAgICAgICAjIENvbmZpZ3VyZSBlbmRwb2ludCBhbmQgbWFwIHRvIGl0J3MgaHR0cCBtZXRob2RcclxuICAgICAgICAgICMgVE9ETzogQ29uc2lkZXIgcHJlZGVmaW5pbmcgYSBtYXAgb2YgbWV0aG9kcyB0byB0aGVpciBodHRwIG1ldGhvZCB0eXBlIChlLmcuLCBnZXRBbGw6IGdldClcclxuICAgICAgICAgIGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdXHJcbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fVxyXG4gICAgICAgICAgXy5lYWNoIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCAoYWN0aW9uLCBtZXRob2RUeXBlKSAtPlxyXG4gICAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPVxyXG4gICAgICAgICAgICAgIF8uY2hhaW4gYWN0aW9uXHJcbiAgICAgICAgICAgICAgLmNsb25lKClcclxuICAgICAgICAgICAgICAuZXh0ZW5kIGVuZHBvaW50T3B0aW9uc1xyXG4gICAgICAgICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgICAjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcclxuICAgICAgICAgIGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXHJcbiAgICAgICAgICAgIF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XHJcbiAgICAgICAgICBlbHNlIF8uZXh0ZW5kIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnRcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAsIHRoaXNcclxuXHJcbiAgICAjIEFkZCB0aGUgcm91dGVzIHRvIHRoZSBBUElcclxuICAgIEBhZGRSb3V0ZSBwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50c1xyXG4gICAgQGFkZFJvdXRlIFwiI3twYXRofS86aWRcIiwgcm91dGVPcHRpb25zLCBlbnRpdHlSb3V0ZUVuZHBvaW50c1xyXG5cclxuICAgIHJldHVybiB0aGlzXHJcblxyXG5cclxuICAjIyMqXHJcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIENvbGxlY3Rpb24gUm91dGVcclxuICAjIyNcclxuICBfY29sbGVjdGlvbkVuZHBvaW50czpcclxuICAgIGdldDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIGdldDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XHJcbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBzZWxlY3RvclxyXG4gICAgICAgICAgaWYgZW50aXR5XHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG4gICAgcHV0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgcHV0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cclxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgc2VsZWN0b3IsICRzZXQ6IEBib2R5UGFyYW1zXHJcbiAgICAgICAgICBpZiBlbnRpdHlJc1VwZGF0ZWRcclxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWRcclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XHJcbiAgICBkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBkZWxldGU6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxyXG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICBpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnfVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG4gICAgcG9zdDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIHBvc3Q6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICAgIEBib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICBlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXHJcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcclxuICAgICAgICAgIGlmIGVudGl0eVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDFcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ31cclxuICAgIGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIGdldDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBzZWxlY3RvciA9IHt9XHJcbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpXHJcbiAgICAgICAgICBpZiBlbnRpdGllc1xyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0aWVzfVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbid9XHJcblxyXG5cclxuICAjIyMqXHJcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXHJcbiAgIyMjXHJcbiAgX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzOlxyXG4gICAgZ2V0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgZ2V0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuICAgICAgICAgIGlmIGVudGl0eVxyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cclxuICAgIHB1dDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIHB1dDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBAdXJsUGFyYW1zLmlkLCAkc2V0OiBwcm9maWxlOiBAYm9keVBhcmFtc1xyXG4gICAgICAgICAgaWYgZW50aXR5SXNVcGRhdGVkXHJcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuICAgICAgICAgICAge3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGVudGl0eX1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cclxuICAgIGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIGRlbGV0ZTpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBpZiBjb2xsZWN0aW9uLnJlbW92ZSBAdXJsUGFyYW1zLmlkXHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCd9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XHJcbiAgICBwb3N0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgcG9zdDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICAjIENyZWF0ZSBhIG5ldyB1c2VyIGFjY291bnRcclxuICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlciBAYm9keVBhcmFtc1xyXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuICAgICAgICAgIGlmIGVudGl0eVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDFcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxyXG4gICAgICAgICAgICB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ31cclxuICAgIGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIGdldDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwgZmllbGRzOiBwcm9maWxlOiAxKS5mZXRjaCgpXHJcbiAgICAgICAgICBpZiBlbnRpdGllc1xyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0aWVzfVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIHVzZXJzJ31cclxuXHJcblxyXG4gICMjI1xyXG4gICAgQWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxyXG4gICMjI1xyXG4gIF9pbml0QXV0aDogLT5cclxuICAgIHNlbGYgPSB0aGlzXHJcbiAgICAjIyNcclxuICAgICAgQWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxyXG5cclxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcclxuICAgICAgYWRkaW5nIGhvb2spLlxyXG4gICAgIyMjXHJcbiAgICBAYWRkUm91dGUgJ2xvZ2luJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LFxyXG4gICAgICBwb3N0OiAtPlxyXG4gICAgICAgICMgR3JhYiB0aGUgdXNlcm5hbWUgb3IgZW1haWwgdGhhdCB0aGUgdXNlciBpcyBsb2dnaW5nIGluIHdpdGhcclxuICAgICAgICB1c2VyID0ge31cclxuICAgICAgICBpZiBAYm9keVBhcmFtcy51c2VyXHJcbiAgICAgICAgICBpZiBAYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSBpcyAtMVxyXG4gICAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlclxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMudXNlclxyXG4gICAgICAgIGVsc2UgaWYgQGJvZHlQYXJhbXMudXNlcm5hbWVcclxuICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSBAYm9keVBhcmFtcy51c2VybmFtZVxyXG4gICAgICAgIGVsc2UgaWYgQGJvZHlQYXJhbXMuZW1haWxcclxuICAgICAgICAgIHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy5lbWFpbFxyXG5cclxuICAgICAgICAjIFRyeSB0byBsb2cgdGhlIHVzZXIgaW50byB0aGUgdXNlcidzIGFjY291bnQgKGlmIHN1Y2Nlc3NmdWwgd2UnbGwgZ2V0IGFuIGF1dGggdG9rZW4gYmFjaylcclxuICAgICAgICB0cnlcclxuICAgICAgICAgIGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkIHVzZXIsIEBib2R5UGFyYW1zLnBhc3N3b3JkXHJcbiAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcbiAgICAgICAgICByZXR1cm4ge30gPVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yXHJcbiAgICAgICAgICAgIGJvZHk6IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogZS5yZWFzb25cclxuXHJcbiAgICAgICAgIyBHZXQgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxyXG4gICAgICAgICMgVE9ETzogQ29uc2lkZXIgcmV0dXJuaW5nIHRoZSB1c2VyIGluIEF1dGgubG9naW5XaXRoUGFzc3dvcmQoKSwgaW5zdGVhZCBvZiBmZXRjaGluZyBpdCBhZ2FpbiBoZXJlXHJcbiAgICAgICAgaWYgYXV0aC51c2VySWQgYW5kIGF1dGguYXV0aFRva2VuXHJcbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9XHJcbiAgICAgICAgICBzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aC5hdXRoVG9rZW5cclxuICAgICAgICAgIEB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXHJcbiAgICAgICAgICAgIHNlYXJjaFF1ZXJ5XHJcbiAgICAgICAgICBAdXNlcklkID0gQHVzZXI/Ll9pZFxyXG5cclxuICAgICAgICByZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogYXV0aH1cclxuXHJcbiAgICAgICAgIyBDYWxsIHRoZSBsb2dpbiBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxyXG4gICAgICAgIGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluPy5jYWxsKHRoaXMpXHJcbiAgICAgICAgaWYgZXh0cmFEYXRhP1xyXG4gICAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxyXG5cclxuICAgICAgICByZXNwb25zZVxyXG5cclxuICAgIGxvZ291dCA9IC0+XHJcbiAgICAgICMgUmVtb3ZlIHRoZSBnaXZlbiBhdXRoIHRva2VuIGZyb20gdGhlIHVzZXIncyBhY2NvdW50XHJcbiAgICAgIGF1dGhUb2tlbiA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXHJcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGhUb2tlblxyXG4gICAgICB0b2tlbkxvY2F0aW9uID0gc2VsZi5fY29uZmlnLmF1dGgudG9rZW5cclxuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mICcuJ1xyXG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyAwLCBpbmRleFxyXG4gICAgICB0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nIGluZGV4ICsgMVxyXG4gICAgICB0b2tlblRvUmVtb3ZlID0ge31cclxuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlblxyXG4gICAgICB0b2tlblJlbW92YWxRdWVyeSA9IHt9XHJcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlXHJcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUgQHVzZXIuX2lkLCB7JHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5fVxyXG5cclxuICAgICAgcmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHttZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISd9fVxyXG5cclxuICAgICAgIyBDYWxsIHRoZSBsb2dvdXQgaG9vayB3aXRoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYXR0YWNoZWRcclxuICAgICAgZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0Py5jYWxsKHRoaXMpXHJcbiAgICAgIGlmIGV4dHJhRGF0YT9cclxuICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXHJcblxyXG4gICAgICByZXNwb25zZVxyXG5cclxuICAgICMjI1xyXG4gICAgICBBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxyXG5cclxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxyXG4gICAgICBhZGRpbmcgaG9vaykuXHJcbiAgICAjIyNcclxuICAgIEBhZGRSb3V0ZSAnbG9nb3V0Jywge2F1dGhSZXF1aXJlZDogdHJ1ZX0sXHJcbiAgICAgIGdldDogLT5cclxuICAgICAgICBjb25zb2xlLndhcm4gXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiXHJcbiAgICAgICAgY29uc29sZS53YXJuIFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiXHJcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpXHJcbiAgICAgIHBvc3Q6IGxvZ291dFxyXG5cclxuUmVzdGl2dXMgPSBAUmVzdGl2dXNcclxuIiwidmFyIFJlc3RpdnVzLFxuICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbnRoaXMuUmVzdGl2dXMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJlc3RpdnVzKG9wdGlvbnMpIHtcbiAgICB2YXIgY29yc0hlYWRlcnM7XG4gICAgdGhpcy5fcm91dGVzID0gW107XG4gICAgdGhpcy5fY29uZmlnID0ge1xuICAgICAgcGF0aHM6IFtdLFxuICAgICAgdXNlRGVmYXVsdEF1dGg6IGZhbHNlLFxuICAgICAgYXBpUGF0aDogJ2FwaS8nLFxuICAgICAgdmVyc2lvbjogbnVsbCxcbiAgICAgIHByZXR0eUpzb246IGZhbHNlLFxuICAgICAgYXV0aDoge1xuICAgICAgICB0b2tlbjogJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbicsXG4gICAgICAgIHVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfdXNlciwgdG9rZW47XG4gICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSkge1xuICAgICAgICAgICAgdG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC51c2VySWQpIHtcbiAgICAgICAgICAgIF91c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy5yZXF1ZXN0LnVzZXJJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VyOiBfdXNlcixcbiAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ10sXG4gICAgICAgICAgICAgIHNwYWNlSWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10sXG4gICAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ10sXG4gICAgICAgICAgICAgIHNwYWNlSWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10sXG4gICAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgZW5hYmxlQ29yczogdHJ1ZVxuICAgIH07XG4gICAgXy5leHRlbmQodGhpcy5fY29uZmlnLCBvcHRpb25zKTtcbiAgICBpZiAodGhpcy5fY29uZmlnLmVuYWJsZUNvcnMpIHtcbiAgICAgIGNvcnNIZWFkZXJzID0ge1xuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0J1xuICAgICAgfTtcbiAgICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgICAgY29yc0hlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnXSArPSAnLCBYLVVzZXItSWQsIFgtQXV0aC1Ub2tlbic7XG4gICAgICB9XG4gICAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcuZGVmYXVsdEhlYWRlcnMsIGNvcnNIZWFkZXJzKTtcbiAgICAgIGlmICghdGhpcy5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlLndyaXRlSGVhZCgyMDAsIGNvcnNIZWFkZXJzKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcuYXBpUGF0aFswXSA9PT0gJy8nKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCA9IHRoaXMuX2NvbmZpZy5hcGlQYXRoLnNsaWNlKDEpO1xuICAgIH1cbiAgICBpZiAoXy5sYXN0KHRoaXMuX2NvbmZpZy5hcGlQYXRoKSAhPT0gJy8nKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCA9IHRoaXMuX2NvbmZpZy5hcGlQYXRoICsgJy8nO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnZlcnNpb24pIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoICs9IHRoaXMuX2NvbmZpZy52ZXJzaW9uICsgJy8nO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY29uZmlnLnVzZUF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArICdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgLyoqXG4gICAgQWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuICBcbiAgICBAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXG4gICAgQHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAgQHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcbiAgICBAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXG4gICAgICAgIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcbiAgICAgICAgYW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuYWRkUm91dGUgPSBmdW5jdGlvbihwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIHtcbiAgICB2YXIgcm91dGU7XG4gICAgcm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKTtcbiAgICB0aGlzLl9yb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgcm91dGUuYWRkVG9BcGkoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICAgIEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLmFkZENvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25FbmRwb2ludHMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uLCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgZXhjbHVkZWRFbmRwb2ludHMsIG1ldGhvZHMsIG1ldGhvZHNPbkNvbGxlY3Rpb24sIHBhdGgsIHJvdXRlT3B0aW9ucztcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ107XG4gICAgbWV0aG9kc09uQ29sbGVjdGlvbiA9IFsncG9zdCcsICdnZXRBbGwnXTtcbiAgICBpZiAoY29sbGVjdGlvbiA9PT0gTWV0ZW9yLnVzZXJzKSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fdXNlckNvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl9jb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH1cbiAgICBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyB8fCB7fTtcbiAgICByb3V0ZU9wdGlvbnMgPSBvcHRpb25zLnJvdXRlT3B0aW9ucyB8fCB7fTtcbiAgICBleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgfHwgW107XG4gICAgcGF0aCA9IG9wdGlvbnMucGF0aCB8fCBjb2xsZWN0aW9uLl9uYW1lO1xuICAgIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24pICYmIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cykpIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfLmV4dGVuZChlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB2YXIgY29uZmlndXJlZEVuZHBvaW50LCBlbmRwb2ludE9wdGlvbnM7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwoZXhjbHVkZWRFbmRwb2ludHMsIG1ldGhvZCkgPCAwICYmIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdO1xuICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludCA9IHt9O1xuICAgICAgICAgIF8uZWFjaChjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgZnVuY3Rpb24oYWN0aW9uLCBtZXRob2RUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlndXJlZEVuZHBvaW50W21ldGhvZFR5cGVdID0gXy5jaGFpbihhY3Rpb24pLmNsb25lKCkuZXh0ZW5kKGVuZHBvaW50T3B0aW9ucykudmFsdWUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLmV4dGVuZChlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLmFkZFJvdXRlKHBhdGgsIHJvdXRlT3B0aW9ucywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzKTtcbiAgICB0aGlzLmFkZFJvdXRlKHBhdGggKyBcIi86aWRcIiwgcm91dGVPcHRpb25zLCBlbnRpdHlSb3V0ZUVuZHBvaW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl9jb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUoc2VsZWN0b3IsIHtcbiAgICAgICAgICAgICAgJHNldDogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZShzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICB0aGlzLmJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0KHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcywgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5fdXNlckNvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZDtcbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZSh0aGlzLnVybFBhcmFtcy5pZCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgZW50aXR5SWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAoe1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCdcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXM7XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIHVzZXJzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5faW5pdEF1dGggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbG9nb3V0LCBzZWxmO1xuICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgLypcbiAgICAgIEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgdGhpcy5hZGRSb3V0ZSgnbG9naW4nLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlXG4gICAgfSwge1xuICAgICAgcG9zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdXRoLCBlLCBleHRyYURhdGEsIHJlZiwgcmVmMSwgcmVzcG9uc2UsIHNlYXJjaFF1ZXJ5LCB1c2VyO1xuICAgICAgICB1c2VyID0ge307XG4gICAgICAgIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcikge1xuICAgICAgICAgIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlci5pbmRleE9mKCdAJykgPT09IC0xKSB7XG4gICAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lKSB7XG4gICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VybmFtZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMuZW1haWwpIHtcbiAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLmVtYWlsO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQodXNlciwgdGhpcy5ib2R5UGFyYW1zLnBhc3N3b3JkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogZS5lcnJvcixcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBlLnJlYXNvblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF1dGgudXNlcklkICYmIGF1dGguYXV0aFRva2VuKSB7XG4gICAgICAgICAgc2VhcmNoUXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aC5hdXRoVG9rZW4pO1xuICAgICAgICAgIHRoaXMudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICdfaWQnOiBhdXRoLnVzZXJJZFxuICAgICAgICAgIH0sIHNlYXJjaFF1ZXJ5KTtcbiAgICAgICAgICB0aGlzLnVzZXJJZCA9IChyZWYgPSB0aGlzLnVzZXIpICE9IG51bGwgPyByZWYuX2lkIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIGRhdGE6IGF1dGhcbiAgICAgICAgfTtcbiAgICAgICAgZXh0cmFEYXRhID0gKHJlZjEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbikgIT0gbnVsbCA/IHJlZjEuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgICAgaWYgKGV4dHJhRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhdXRoVG9rZW4sIGV4dHJhRGF0YSwgaGFzaGVkVG9rZW4sIGluZGV4LCByZWYsIHJlc3BvbnNlLCB0b2tlbkZpZWxkTmFtZSwgdG9rZW5Mb2NhdGlvbiwgdG9rZW5QYXRoLCB0b2tlblJlbW92YWxRdWVyeSwgdG9rZW5Ub1JlbW92ZTtcbiAgICAgIGF1dGhUb2tlbiA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXTtcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICB0b2tlbkxvY2F0aW9uID0gc2VsZi5fY29uZmlnLmF1dGgudG9rZW47XG4gICAgICBpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgIHRva2VuUGF0aCA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgIHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoaW5kZXggKyAxKTtcbiAgICAgIHRva2VuVG9SZW1vdmUgPSB7fTtcbiAgICAgIHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW47XG4gICAgICB0b2tlblJlbW92YWxRdWVyeSA9IHt9O1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmU7XG4gICAgICBNZXRlb3IudXNlcnMudXBkYXRlKHRoaXMudXNlci5faWQsIHtcbiAgICAgICAgJHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5XG4gICAgICB9KTtcbiAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZXh0cmFEYXRhID0gKHJlZiA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZE91dCkgIT0gbnVsbCA/IHJlZi5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgaWYgKGV4dHJhRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH07XG5cbiAgICAvKlxuICAgICAgQWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBvdXQsIHRoZSBvbkxvZ2dlZE91dCBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICByZXR1cm4gdGhpcy5hZGRSb3V0ZSgnbG9nb3V0Jywge1xuICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlXG4gICAgfSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIik7XG4gICAgICAgIGNvbnNvbGUud2FybihcIiAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzL2lzc3Vlcy8xMDBcIik7XG4gICAgICAgIHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKTtcbiAgICAgIH0sXG4gICAgICBwb3N0OiBsb2dvdXRcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gUmVzdGl2dXM7XG5cbn0pKCk7XG5cblJlc3RpdnVzID0gdGhpcy5SZXN0aXZ1cztcbiIsImlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgQEFQSSA9IG5ldyBSZXN0aXZ1c1xyXG4gICAgICAgIGFwaVBhdGg6ICdzdGVlZG9zL2FwaS8nLFxyXG4gICAgICAgIHVzZURlZmF1bHRBdXRoOiB0cnVlXHJcbiAgICAgICAgcHJldHR5SnNvbjogdHJ1ZVxyXG4gICAgICAgIGVuYWJsZUNvcnM6IGZhbHNlXHJcbiAgICAgICAgZGVmYXVsdEhlYWRlcnM6XHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICB0aGlzLkFQSSA9IG5ldyBSZXN0aXZ1cyh7XG4gICAgYXBpUGF0aDogJ3N0ZWVkb3MvYXBpLycsXG4gICAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gICAgcHJldHR5SnNvbjogdHJ1ZSxcbiAgICBlbmFibGVDb3JzOiBmYWxzZSxcbiAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH1cbiAgfSk7XG59XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdEFQSS5hZGRDb2xsZWN0aW9uIGRiLnNwYWNlX3VzZXJzLCBcclxuXHRcdGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXVxyXG5cdFx0cm91dGVPcHRpb25zOlxyXG5cdFx0XHRhdXRoUmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0c3BhY2VSZXF1aXJlZDogdHJ1ZSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gQVBJLmFkZENvbGxlY3Rpb24oZGIuc3BhY2VfdXNlcnMsIHtcbiAgICBleGNsdWRlZEVuZHBvaW50czogW10sXG4gICAgcm91dGVPcHRpb25zOiB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWUsXG4gICAgICBzcGFjZVJlcXVpcmVkOiB0cnVlXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRBUEkuYWRkQ29sbGVjdGlvbiBkYi5vcmdhbml6YXRpb25zLCBcclxuXHRcdGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXVxyXG5cdFx0cm91dGVPcHRpb25zOlxyXG5cdFx0XHRhdXRoUmVxdWlyZWQ6IHRydWVcclxuXHRcdFx0c3BhY2VSZXF1aXJlZDogdHJ1ZSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gQVBJLmFkZENvbGxlY3Rpb24oZGIub3JnYW5pemF0aW9ucywge1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXSxcbiAgICByb3V0ZU9wdGlvbnM6IHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHNwYWNlUmVxdWlyZWQ6IHRydWVcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cclxuICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlc1xyXG4gIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxyXG4gICAgaWYgcmVxLmZpbGVzIGFuZCByZXEuZmlsZXNbMF1cclxuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XHJcbiAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX0sIChlcnIpIC0+XHJcbiAgICAgICAgZmlsZW5hbWUgPSByZXEuZmlsZXNbMF0uZmlsZW5hbWVcclxuXHJcbiAgICAgICAgaWYgW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgICAgICAgZmlsZW5hbWUgPSBcImltYWdlLVwiICsgbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKSArIFwiLlwiICsgZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKVxyXG5cclxuICAgICAgICBib2R5ID0gcmVxLmJvZHlcclxuICAgICAgICB0cnlcclxuICAgICAgICAgIGlmIGJvZHkgJiYgKGJvZHlbJ3VwbG9hZF9mcm9tJ10gaXMgXCJJRVwiIG9yIGJvZHlbJ3VwbG9hZF9mcm9tJ10gaXMgXCJub2RlXCIpXHJcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKVxyXG4gICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZmlsZW5hbWUpXHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIilcclxuXHJcbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5Wydvd25lcl9uYW1lJ10gJiYgYm9keVsnc3BhY2UnXSAmJiBib2R5WydpbnN0YW5jZSddICAmJiBib2R5WydhcHByb3ZlJ11cclxuICAgICAgICAgIHBhcmVudCA9ICcnXHJcbiAgICAgICAgICBtZXRhZGF0YSA9IHtvd25lcjpib2R5Wydvd25lciddLCBvd25lcl9uYW1lOmJvZHlbJ293bmVyX25hbWUnXSwgc3BhY2U6Ym9keVsnc3BhY2UnXSwgaW5zdGFuY2U6Ym9keVsnaW5zdGFuY2UnXSwgYXBwcm92ZTogYm9keVsnYXBwcm92ZSddLCBjdXJyZW50OiB0cnVlfVxyXG5cclxuICAgICAgICAgIGlmIGJvZHlbXCJpc19wcml2YXRlXCJdICYmIGJvZHlbXCJpc19wcml2YXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gXCJ0cnVlXCJcclxuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IHRydWVcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IGZhbHNlXHJcblxyXG4gICAgICAgICAgaWYgYm9keVsnbWFpbiddID09IFwidHJ1ZVwiXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLm1haW4gPSB0cnVlXHJcblxyXG4gICAgICAgICAgaWYgYm9keVsnaXNBZGRWZXJzaW9uJ10gJiYgYm9keVsncGFyZW50J11cclxuICAgICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J11cclxuICAgICAgICAgICMgZWxzZVxyXG4gICAgICAgICAgIyAgIGNvbGxlY3Rpb24uZmluZCh7J21ldGFkYXRhLmluc3RhbmNlJzogYm9keVsnaW5zdGFuY2UnXSwgJ21ldGFkYXRhLmN1cnJlbnQnIDogdHJ1ZX0pLmZvckVhY2ggKGMpIC0+XHJcbiAgICAgICAgICAjICAgICBpZiBjLm5hbWUoKSA9PSBmaWxlbmFtZVxyXG4gICAgICAgICAgIyAgICAgICBwYXJlbnQgPSBjLm1ldGFkYXRhLnBhcmVudFxyXG5cclxuICAgICAgICAgIGlmIHBhcmVudFxyXG4gICAgICAgICAgICByID0gY29sbGVjdGlvbi51cGRhdGUoeydtZXRhZGF0YS5wYXJlbnQnOiBwYXJlbnQsICdtZXRhZGF0YS5jdXJyZW50JyA6IHRydWV9LCB7JHVuc2V0IDogeydtZXRhZGF0YS5jdXJyZW50JyA6ICcnfX0pXHJcbiAgICAgICAgICAgIGlmIHJcclxuICAgICAgICAgICAgICBtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnRcclxuICAgICAgICAgICAgICBpZiBib2R5Wydsb2NrZWRfYnknXSAmJiBib2R5Wydsb2NrZWRfYnlfbmFtZSddXHJcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnkgPSBib2R5Wydsb2NrZWRfYnknXVxyXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5X25hbWUgPSBib2R5Wydsb2NrZWRfYnlfbmFtZSddXHJcblxyXG4gICAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxyXG4gICAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcblxyXG4gICAgICAgICAgICAgICMg5Yig6Zmk5ZCM5LiA5Liq55Sz6K+35Y2V5ZCM5LiA5Liq5q2l6aqk5ZCM5LiA5Liq5Lq65LiK5Lyg55qE6YeN5aSN55qE5paH5Lu2XHJcbiAgICAgICAgICAgICAgaWYgYm9keVtcIm92ZXJ3cml0ZVwiXSAmJiBib2R5W1wib3ZlcndyaXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gXCJ0cnVlXCJcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHsnbWV0YWRhdGEuaW5zdGFuY2UnOiBib2R5WydpbnN0YW5jZSddLCAnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LCAnbWV0YWRhdGEub3duZXInOiBib2R5Wydvd25lciddLCAnbWV0YWRhdGEuYXBwcm92ZSc6IGJvZHlbJ2FwcHJvdmUnXSwgJ21ldGFkYXRhLmN1cnJlbnQnOiB7JG5lOiB0cnVlfX0pXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxyXG4gICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG4gICAgICAgICAgICBmaWxlT2JqLnVwZGF0ZSh7JHNldDogeydtZXRhZGF0YS5wYXJlbnQnIDogZmlsZU9iai5faWR9fSlcclxuXHJcbiAgICAgICAgIyDlhbzlrrnogIHniYjmnKxcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgbmV3RmlsZS5vbmNlICdzdG9yZWQnLCAoc3RvcmVOYW1lKS0+XHJcbiAgICAgICAgc2l6ZSA9IG5ld0ZpbGUub3JpZ2luYWwuc2l6ZVxyXG4gICAgICAgIGlmICFzaXplXHJcbiAgICAgICAgICBzaXplID0gMTAyNFxyXG4gICAgICAgIHJlc3AgPVxyXG4gICAgICAgICAgdmVyc2lvbl9pZDogbmV3RmlsZS5faWQsXHJcbiAgICAgICAgICBzaXplOiBzaXplXHJcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICBlbHNlXHJcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xyXG4gICAgICByZXMuZW5kKCk7XHJcbiAgICAgIHJldHVyblxyXG5cclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZGVsZXRlXCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblxyXG4gIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzXHJcblxyXG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XHJcbiAgaWYgaWRcclxuICAgIGZpbGUgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IGlkIH0pXHJcbiAgICBpZiBmaWxlXHJcbiAgICAgIGZpbGUucmVtb3ZlKClcclxuICAgICAgcmVzcCA9IHtcclxuICAgICAgICBzdGF0dXM6IFwiT0tcIlxyXG4gICAgICB9XHJcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xyXG4gICAgICByZXR1cm5cclxuXHJcbiAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XHJcbiAgcmVzLmVuZCgpO1xyXG5cclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblxyXG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XHJcblxyXG4gIHJlcy5zdGF0dXNDb2RlID0gMzAyO1xyXG4gIHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2luc3RhbmNlcy9cIikgKyBpZCArIFwiP2Rvd25sb2FkPTFcIlxyXG4gIHJlcy5lbmQoKTtcclxuXHJcblxyXG4jIE1ldGVvci5tZXRob2RzXHJcblxyXG4jICAgczNfdXBncmFkZTogKG1pbiwgbWF4KSAtPlxyXG4jICAgICBjb25zb2xlLmxvZyhcIi9zMy91cGdyYWRlXCIpXHJcblxyXG4jICAgICBmcyA9IHJlcXVpcmUoJ2ZzJylcclxuIyAgICAgbWltZSA9IHJlcXVpcmUoJ21pbWUnKVxyXG5cclxuIyAgICAgcm9vdF9wYXRoID0gXCIvbW50L2Zha2VzMy8xMFwiXHJcbiMgICAgIGNvbnNvbGUubG9nKHJvb3RfcGF0aClcclxuIyAgICAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXNcclxuXHJcbiMgICAgICMg6YGN5Y6GaW5zdGFuY2Ug5ou85Ye66ZmE5Lu26Lev5b6EIOWIsOacrOWcsOaJvuWvueW6lOaWh+S7tiDliIbkuKTnp43mg4XlhrUgMS4vZmlsZW5hbWVfdmVyc2lvbklkIDIuL2ZpbGVuYW1l77ybXHJcbiMgICAgIGRlYWxfd2l0aF92ZXJzaW9uID0gKHJvb3RfcGF0aCwgc3BhY2UsIGluc19pZCwgdmVyc2lvbiwgYXR0YWNoX2ZpbGVuYW1lKSAtPlxyXG4jICAgICAgIF9yZXYgPSB2ZXJzaW9uLl9yZXZcclxuIyAgICAgICBpZiAoY29sbGVjdGlvbi5maW5kKHtcIl9pZFwiOiBfcmV2fSkuY291bnQoKSA+MClcclxuIyAgICAgICAgIHJldHVyblxyXG4jICAgICAgIGNyZWF0ZWRfYnkgPSB2ZXJzaW9uLmNyZWF0ZWRfYnlcclxuIyAgICAgICBhcHByb3ZlID0gdmVyc2lvbi5hcHByb3ZlXHJcbiMgICAgICAgZmlsZW5hbWUgPSB2ZXJzaW9uLmZpbGVuYW1lIHx8IGF0dGFjaF9maWxlbmFtZTtcclxuIyAgICAgICBtaW1lX3R5cGUgPSBtaW1lLmxvb2t1cChmaWxlbmFtZSlcclxuIyAgICAgICBuZXdfcGF0aCA9IHJvb3RfcGF0aCArIFwiL3NwYWNlcy9cIiArIHNwYWNlICsgXCIvd29ya2Zsb3cvXCIgKyBpbnNfaWQgKyBcIi9cIiArIGZpbGVuYW1lICsgXCJfXCIgKyBfcmV2XHJcbiMgICAgICAgb2xkX3BhdGggPSByb290X3BhdGggKyBcIi9zcGFjZXMvXCIgKyBzcGFjZSArIFwiL3dvcmtmbG93L1wiICsgaW5zX2lkICsgXCIvXCIgKyBmaWxlbmFtZVxyXG5cclxuIyAgICAgICByZWFkRmlsZSA9IChmdWxsX3BhdGgpIC0+XHJcbiMgICAgICAgICBkYXRhID0gZnMucmVhZEZpbGVTeW5jIGZ1bGxfcGF0aFxyXG5cclxuIyAgICAgICAgIGlmIGRhdGFcclxuIyAgICAgICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XHJcbiMgICAgICAgICAgIG5ld0ZpbGUuX2lkID0gX3JldjtcclxuIyAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IHtvd25lcjpjcmVhdGVkX2J5LCBzcGFjZTpzcGFjZSwgaW5zdGFuY2U6aW5zX2lkLCBhcHByb3ZlOiBhcHByb3ZlfTtcclxuIyAgICAgICAgICAgbmV3RmlsZS5hdHRhY2hEYXRhIGRhdGEsIHt0eXBlOiBtaW1lX3R5cGV9XHJcbiMgICAgICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSlcclxuIyAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcclxuIyAgICAgICAgICAgY29uc29sZS5sb2coZmlsZU9iai5faWQpXHJcblxyXG4jICAgICAgIHRyeVxyXG4jICAgICAgICAgbiA9IGZzLnN0YXRTeW5jIG5ld19wYXRoXHJcbiMgICAgICAgICBpZiBuICYmIG4uaXNGaWxlKClcclxuIyAgICAgICAgICAgcmVhZEZpbGUgbmV3X3BhdGhcclxuIyAgICAgICBjYXRjaCBlcnJvclxyXG4jICAgICAgICAgdHJ5XHJcbiMgICAgICAgICAgIG9sZCA9IGZzLnN0YXRTeW5jIG9sZF9wYXRoXHJcbiMgICAgICAgICAgIGlmIG9sZCAmJiBvbGQuaXNGaWxlKClcclxuIyAgICAgICAgICAgICByZWFkRmlsZSBvbGRfcGF0aFxyXG4jICAgICAgICAgY2F0Y2ggZXJyb3JcclxuIyAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZpbGUgbm90IGZvdW5kOiBcIiArIG9sZF9wYXRoKVxyXG5cclxuXHJcbiMgICAgIGNvdW50ID0gZGIuaW5zdGFuY2VzLmZpbmQoe1wiYXR0YWNobWVudHMuY3VycmVudFwiOiB7JGV4aXN0czogdHJ1ZX19LCB7c29ydDoge21vZGlmaWVkOiAtMX19KS5jb3VudCgpO1xyXG4jICAgICBjb25zb2xlLmxvZyhcImFsbCBpbnN0YW5jZXM6IFwiICsgY291bnQpXHJcblxyXG4jICAgICBiID0gbmV3IERhdGUoKVxyXG5cclxuIyAgICAgaSA9IG1pblxyXG4jICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgc2tpcDogbWluLCBsaW1pdDogbWF4LW1pbn0pLmZvckVhY2ggKGlucykgLT5cclxuIyAgICAgICBpID0gaSArIDFcclxuIyAgICAgICBjb25zb2xlLmxvZyhpICsgXCI6XCIgKyBpbnMubmFtZSlcclxuIyAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzXHJcbiMgICAgICAgc3BhY2UgPSBpbnMuc3BhY2VcclxuIyAgICAgICBpbnNfaWQgPSBpbnMuX2lkXHJcbiMgICAgICAgYXR0YWNocy5mb3JFYWNoIChhdHQpIC0+XHJcbiMgICAgICAgICBkZWFsX3dpdGhfdmVyc2lvbiByb290X3BhdGgsIHNwYWNlLCBpbnNfaWQsIGF0dC5jdXJyZW50LCBhdHQuZmlsZW5hbWVcclxuIyAgICAgICAgIGlmIGF0dC5oaXN0b3J5c1xyXG4jICAgICAgICAgICBhdHQuaGlzdG9yeXMuZm9yRWFjaCAoaGlzKSAtPlxyXG4jICAgICAgICAgICAgIGRlYWxfd2l0aF92ZXJzaW9uIHJvb3RfcGF0aCwgc3BhY2UsIGluc19pZCwgaGlzLCBhdHQuZmlsZW5hbWVcclxuXHJcbiMgICAgIGNvbnNvbGUubG9nKG5ldyBEYXRlKCkgLSBiKVxyXG5cclxuIyAgICAgcmV0dXJuIFwib2tcIlxyXG4iLCJKc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGNvbGxlY3Rpb247XG4gIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzO1xuICByZXR1cm4gSnNvblJvdXRlcy5wYXJzZUZpbGVzKHJlcSwgcmVzLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmV3RmlsZTtcbiAgICBpZiAocmVxLmZpbGVzICYmIHJlcS5maWxlc1swXSkge1xuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgdHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIGJvZHksIGUsIGZpbGVPYmosIGZpbGVuYW1lLCBtZXRhZGF0YSwgcGFyZW50LCByO1xuICAgICAgICBmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZTtcbiAgICAgICAgaWYgKFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICBmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgPSByZXEuYm9keTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJJRVwiIHx8IGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwibm9kZVwiKSkge1xuICAgICAgICAgICAgZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihmaWxlbmFtZSk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSk7XG4gICAgICAgIGlmIChib2R5ICYmIGJvZHlbJ293bmVyJ10gJiYgYm9keVsnb3duZXJfbmFtZSddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsnaW5zdGFuY2UnXSAmJiBib2R5WydhcHByb3ZlJ10pIHtcbiAgICAgICAgICBwYXJlbnQgPSAnJztcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIG93bmVyOiBib2R5Wydvd25lciddLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogYm9keVsnb3duZXJfbmFtZSddLFxuICAgICAgICAgICAgc3BhY2U6IGJvZHlbJ3NwYWNlJ10sXG4gICAgICAgICAgICBpbnN0YW5jZTogYm9keVsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgIGFwcHJvdmU6IGJvZHlbJ2FwcHJvdmUnXSxcbiAgICAgICAgICAgIGN1cnJlbnQ6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChib2R5W1wiaXNfcHJpdmF0ZVwiXSAmJiBib2R5W1wiaXNfcHJpdmF0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJvZHlbJ21haW4nXSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1haW4gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYm9keVsnaXNBZGRWZXJzaW9uJ10gJiYgYm9keVsncGFyZW50J10pIHtcbiAgICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICByID0gY29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LFxuICAgICAgICAgICAgICAnbWV0YWRhdGEuY3VycmVudCc6IHRydWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJHVuc2V0OiB7XG4gICAgICAgICAgICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiAnJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgICAgaWYgKGJvZHlbJ2xvY2tlZF9ieSddICYmIGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ10pIHtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnkgPSBib2R5Wydsb2NrZWRfYnknXTtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnlfbmFtZSA9IGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ107XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgICAgICAgIGlmIChib2R5W1wib3ZlcndyaXRlXCJdICYmIGJvZHlbXCJvdmVyd3JpdGVcIl0udG9Mb2NhbGVMb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLnJlbW92ZSh7XG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEuaW5zdGFuY2UnOiBib2R5WydpbnN0YW5jZSddLFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5vd25lcic6IGJvZHlbJ293bmVyJ10sXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEuYXBwcm92ZSc6IGJvZHlbJ2FwcHJvdmUnXSxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5jdXJyZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAkbmU6IHRydWVcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgICAgICBmaWxlT2JqLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogZmlsZU9iai5faWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3RmlsZS5vbmNlKCdzdG9yZWQnLCBmdW5jdGlvbihzdG9yZU5hbWUpIHtcbiAgICAgICAgdmFyIHJlc3AsIHNpemU7XG4gICAgICAgIHNpemUgPSBuZXdGaWxlLm9yaWdpbmFsLnNpemU7XG4gICAgICAgIGlmICghc2l6ZSkge1xuICAgICAgICAgIHNpemUgPSAxMDI0O1xuICAgICAgICB9XG4gICAgICAgIHJlc3AgPSB7XG4gICAgICAgICAgdmVyc2lvbl9pZDogbmV3RmlsZS5faWQsXG4gICAgICAgICAgc2l6ZTogc2l6ZVxuICAgICAgICB9O1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZGVsZXRlXCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBjb2xsZWN0aW9uLCBmaWxlLCBpZCwgcmVzcDtcbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXM7XG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XG4gIGlmIChpZCkge1xuICAgIGZpbGUgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1xuICAgICAgX2lkOiBpZFxuICAgIH0pO1xuICAgIGlmIChmaWxlKSB7XG4gICAgICBmaWxlLnJlbW92ZSgpO1xuICAgICAgcmVzcCA9IHtcbiAgICAgICAgc3RhdHVzOiBcIk9LXCJcbiAgICAgIH07XG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gIHJldHVybiByZXMuZW5kKCk7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGlkO1xuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xuICByZXMuc3RhdHVzQ29kZSA9IDMwMjtcbiAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvaW5zdGFuY2VzL1wiKSArIGlkICsgXCI/ZG93bmxvYWQ9MVwiKTtcbiAgcmV0dXJuIHJlcy5lbmQoKTtcbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9wdXNoL21lc3NhZ2VcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgaWYgcmVxLmJvZHk/LnB1c2hUb3BpYyBhbmQgcmVxLmJvZHkudXNlcklkcyBhbmQgcmVxLmJvZHkuZGF0YVxyXG4gICAgICAgIG1lc3NhZ2UgPSBcclxuICAgICAgICAgICAgZnJvbTogXCJzdGVlZG9zXCJcclxuICAgICAgICAgICAgcXVlcnk6XHJcbiAgICAgICAgICAgICAgICBhcHBOYW1lOiByZXEuYm9keS5wdXNoVG9waWNcclxuICAgICAgICAgICAgICAgIHVzZXJJZDogXHJcbiAgICAgICAgICAgICAgICAgICAgXCIkaW5cIjogdXNlcklkc1xyXG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZT9cclxuICAgICAgICAgICAgbWVzc2FnZVtcInRpdGxlXCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlXHJcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5hbGVydD9cclxuICAgICAgICAgICAgbWVzc2FnZVtcInRleHRcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0XHJcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5iYWRnZT9cclxuICAgICAgICAgICAgbWVzc2FnZVtcImJhZGdlXCJdID0gcmVxLmJvZHkuZGF0YS5iYWRnZSArIFwiXCJcclxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLnNvdW5kP1xyXG4gICAgICAgICAgICBtZXNzYWdlW1wic291bmRcIl0gPSByZXEuYm9keS5kYXRhLnNvdW5kXHJcbiAgICAgICAgI2lmIHJlcS5ib2R5LmRhdGEuZGF0YT9cclxuICAgICAgICAjICAgIG1lc3NhZ2VbXCJkYXRhXCJdID0gcmVxLmJvZHkuZGF0YS5kYXRhXHJcbiAgICAgICAgUHVzaC5zZW5kIG1lc3NhZ2VcclxuXHJcbiAgICAgICAgcmVzLmVuZChcInN1Y2Nlc3NcIik7XHJcblxyXG5cclxuXHJcbk1ldGVvci5tZXRob2RzXHJcbiAgICBwdXNoU2VuZDogKHRleHQsdGl0bGUsYmFkZ2UsdXNlcklkKSAtPlxyXG4gICAgICAgIGlmICghdXNlcklkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgUHVzaC5zZW5kXHJcbiAgICAgICAgICAgIGZyb206ICdzdGVlZG9zJyxcclxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICBiYWRnZTogYmFkZ2UsXHJcbiAgICAgICAgICAgIHF1ZXJ5OiBcclxuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXHJcbiAgICAgICAgICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcclxuIiwiSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9wdXNoL21lc3NhZ2VcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIG1lc3NhZ2UsIHJlZjtcbiAgaWYgKCgocmVmID0gcmVxLmJvZHkpICE9IG51bGwgPyByZWYucHVzaFRvcGljIDogdm9pZCAwKSAmJiByZXEuYm9keS51c2VySWRzICYmIHJlcS5ib2R5LmRhdGEpIHtcbiAgICBtZXNzYWdlID0ge1xuICAgICAgZnJvbTogXCJzdGVlZG9zXCIsXG4gICAgICBxdWVyeToge1xuICAgICAgICBhcHBOYW1lOiByZXEuYm9keS5wdXNoVG9waWMsXG4gICAgICAgIHVzZXJJZDoge1xuICAgICAgICAgIFwiJGluXCI6IHVzZXJJZHNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZSAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1widGl0bGVcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGU7XG4gICAgfVxuICAgIGlmIChyZXEuYm9keS5kYXRhLmFsZXJ0ICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJ0ZXh0XCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydDtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYmFkZ2UgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcImJhZGdlXCJdID0gcmVxLmJvZHkuZGF0YS5iYWRnZSArIFwiXCI7XG4gICAgfVxuICAgIGlmIChyZXEuYm9keS5kYXRhLnNvdW5kICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJzb3VuZFwiXSA9IHJlcS5ib2R5LmRhdGEuc291bmQ7XG4gICAgfVxuICAgIFB1c2guc2VuZChtZXNzYWdlKTtcbiAgICByZXR1cm4gcmVzLmVuZChcInN1Y2Nlc3NcIik7XG4gIH1cbn0pO1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gIHB1c2hTZW5kOiBmdW5jdGlvbih0ZXh0LCB0aXRsZSwgYmFkZ2UsIHVzZXJJZCkge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBQdXNoLnNlbmQoe1xuICAgICAgZnJvbTogJ3N0ZWVkb3MnLFxuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgdGV4dDogdGV4dCxcbiAgICAgIGJhZGdlOiBiYWRnZSxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJBbGl5dW5fcHVzaCA9IHt9O1xyXG5cclxuQWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UgPSAodXNlclRva2Vucywgbm90aWZpY2F0aW9uLCBjYWxsYmFjaykgLT5cclxuXHRpZiBub3RpZmljYXRpb24udGl0bGUgYW5kIG5vdGlmaWNhdGlvbi50ZXh0XHJcblx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdGNvbnNvbGUubG9nIHVzZXJUb2tlbnNcclxuXHJcblx0XHRhbGl5dW5Ub2tlbnMgPSBuZXcgQXJyYXlcclxuXHRcdHhpbmdlVG9rZW5zID0gbmV3IEFycmF5XHJcblx0XHRodWF3ZWlUb2tlbnMgPSBuZXcgQXJyYXlcclxuXHRcdG1pVG9rZW5zID0gbmV3IEFycmF5XHJcblxyXG5cdFx0dXNlclRva2Vucy5mb3JFYWNoICh1c2VyVG9rZW4pIC0+XHJcblx0XHRcdGFyciA9IHVzZXJUb2tlbi5zcGxpdCgnOicpXHJcblx0XHRcdGlmIGFyclswXSBpcyBcImFsaXl1blwiXHJcblx0XHRcdFx0YWxpeXVuVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcclxuXHRcdFx0ZWxzZSBpZiBhcnJbMF0gaXMgXCJ4aW5nZVwiXHJcblx0XHRcdFx0eGluZ2VUb2tlbnMucHVzaCBfLmxhc3QoYXJyKVxyXG5cdFx0XHRlbHNlIGlmIGFyclswXSBpcyBcImh1YXdlaVwiXHJcblx0XHRcdFx0aHVhd2VpVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcclxuXHRcdFx0ZWxzZSBpZiBhcnJbMF0gaXMgXCJtaVwiXHJcblx0XHRcdFx0bWlUb2tlbnMucHVzaCBfLmxhc3QoYXJyKVxyXG5cclxuXHRcdGlmICFfLmlzRW1wdHkoYWxpeXVuVG9rZW5zKSBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFsaXl1blxyXG5cdFx0XHRBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyBcImFsaXl1blRva2VuczogI3thbGl5dW5Ub2tlbnN9XCJcclxuXHRcdFx0QUxZUFVTSCA9IG5ldyAoQUxZLlBVU0gpKFxyXG5cdFx0XHRcdGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYWNjZXNzS2V5SWRcclxuXHRcdFx0XHRzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5zZWNyZXRBY2Nlc3NLZXlcclxuXHRcdFx0XHRlbmRwb2ludDogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmVuZHBvaW50XHJcblx0XHRcdFx0YXBpVmVyc2lvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwaVZlcnNpb24pO1xyXG5cclxuXHRcdFx0ZGF0YSA9IFxyXG5cdFx0XHRcdEFwcEtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwcEtleVxyXG5cdFx0XHRcdFRhcmdldDogJ2RldmljZSdcclxuXHRcdFx0XHRUYXJnZXRWYWx1ZTogYWxpeXVuVG9rZW5zLnRvU3RyaW5nKClcclxuXHRcdFx0XHRUaXRsZTogbm90aWZpY2F0aW9uLnRpdGxlXHJcblx0XHRcdFx0U3VtbWFyeTogbm90aWZpY2F0aW9uLnRleHRcclxuXHJcblx0XHRcdEFMWVBVU0gucHVzaE5vdGljZVRvQW5kcm9pZCBkYXRhLCBjYWxsYmFja1xyXG5cclxuXHRcdGlmICFfLmlzRW1wdHkoeGluZ2VUb2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ueGluZ2VcclxuXHRcdFx0WGluZ2UgPSByZXF1aXJlKCd4aW5nZScpO1xyXG5cdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJ4aW5nZVRva2VuczogI3t4aW5nZVRva2Vuc31cIlxyXG5cdFx0XHRYaW5nZUFwcCA9IG5ldyBYaW5nZS5YaW5nZUFwcChNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5hY2Nlc3NJZCwgTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2Uuc2VjcmV0S2V5KVxyXG5cdFx0XHRcclxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UgPSBuZXcgWGluZ2UuQW5kcm9pZE1lc3NhZ2VcclxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UudHlwZSA9IFhpbmdlLk1FU1NBR0VfVFlQRV9OT1RJRklDQVRJT05cclxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UudGl0bGUgPSBub3RpZmljYXRpb24udGl0bGVcclxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UuY29udGVudCA9IG5vdGlmaWNhdGlvbi50ZXh0XHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlLnN0eWxlID0gbmV3IFhpbmdlLlN0eWxlXHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlLmFjdGlvbiA9IG5ldyBYaW5nZS5DbGlja0FjdGlvblxyXG5cclxuXHRcdFx0Xy5lYWNoIHhpbmdlVG9rZW5zLCAodCktPlxyXG5cdFx0XHRcdFhpbmdlQXBwLnB1c2hUb1NpbmdsZURldmljZSB0LCBhbmRyb2lkTWVzc2FnZSwgY2FsbGJhY2tcclxuXHJcblx0XHRpZiAhXy5pc0VtcHR5KGh1YXdlaVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5odWF3ZWlcclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiaHVhd2VpVG9rZW5zOiAje2h1YXdlaVRva2Vuc31cIlxyXG5cclxuXHRcdFx0cGFja2FnZV9uYW1lID0gTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFBrZ05hbWVcclxuXHRcdFx0dG9rZW5EYXRhTGlzdCA9IFtdXHJcblx0XHRcdF8uZWFjaCBodWF3ZWlUb2tlbnMsICh0KS0+XHJcblx0XHRcdFx0dG9rZW5EYXRhTGlzdC5wdXNoKHsncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLCAndG9rZW4nOiB0fSlcclxuXHRcdFx0bm90aSA9IHsnYW5kcm9pZCc6IHsndGl0bGUnOiBub3RpZmljYXRpb24udGl0bGUsICdtZXNzYWdlJzogbm90aWZpY2F0aW9uLnRleHR9LCAnZXh0cmFzJzogbm90aWZpY2F0aW9uLnBheWxvYWR9XHJcblxyXG5cdFx0XHRIdWF3ZWlQdXNoLmNvbmZpZyBbeydwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsICdjbGllbnRfaWQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwSWQsICdjbGllbnRfc2VjcmV0JzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFNlY3JldH1dXHJcblx0XHRcdFxyXG5cdFx0XHRIdWF3ZWlQdXNoLnNlbmRNYW55IG5vdGksIHRva2VuRGF0YUxpc3RcclxuXHJcblxyXG5cdFx0aWYgIV8uaXNFbXB0eShtaVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5taVxyXG5cdFx0XHRNaVB1c2ggPSByZXF1aXJlKCd4aWFvbWktcHVzaCcpO1xyXG5cdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJtaVRva2VuczogI3ttaVRva2Vuc31cIlxyXG5cdFx0XHRtc2cgPSBuZXcgTWlQdXNoLk1lc3NhZ2VcclxuXHRcdFx0bXNnLnRpdGxlKG5vdGlmaWNhdGlvbi50aXRsZSkuZGVzY3JpcHRpb24obm90aWZpY2F0aW9uLnRleHQpXHJcblx0XHRcdG5vdGlmaWNhdGlvbiA9IG5ldyBNaVB1c2guTm90aWZpY2F0aW9uKFxyXG5cdFx0XHRcdHByb2R1Y3Rpb246IE1ldGVvci5zZXR0aW5ncy5wdXNoLm1pLnByb2R1Y3Rpb25cclxuXHRcdFx0XHRhcHBTZWNyZXQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLm1pLmFwcFNlY3JldFxyXG5cdFx0XHQpXHJcblx0XHRcdF8uZWFjaCBtaVRva2VucywgKHJlZ2lkKS0+XHJcblx0XHRcdFx0bm90aWZpY2F0aW9uLnNlbmQgcmVnaWQsIG1zZywgY2FsbGJhY2tcclxuXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdFxyXG5cdGlmIG5vdCBNZXRlb3Iuc2V0dGluZ3MuY3Jvbj8ucHVzaF9pbnRlcnZhbFxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdGNvbmZpZyA9IHtcclxuXHRcdGRlYnVnOiB0cnVlXHJcblx0XHRrZWVwTm90aWZpY2F0aW9uczogZmFsc2VcclxuXHRcdHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLmNyb24ucHVzaF9pbnRlcnZhbFxyXG5cdFx0c2VuZEJhdGNoU2l6ZTogMTBcclxuXHRcdHByb2R1Y3Rpb246IHRydWVcclxuXHR9XHJcblxyXG5cdGlmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFwbilcclxuXHRcdGNvbmZpZy5hcG4gPSB7XHJcblx0XHRcdGtleURhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5rZXlEYXRhXHJcblx0XHRcdGNlcnREYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4uY2VydERhdGFcclxuXHRcdH1cclxuXHRpZiAhXy5pc0VtcHR5KE1ldGVvci5zZXR0aW5ncy5wdXNoPy5nY20pXHJcblx0XHRjb25maWcuZ2NtID0ge1xyXG5cdFx0XHRwcm9qZWN0TnVtYmVyOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20ucHJvamVjdE51bWJlclxyXG5cdFx0XHRhcGlLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5hcGlLZXlcclxuXHRcdH1cclxuXHJcblx0UHVzaC5Db25maWd1cmUgY29uZmlnXHJcblx0XHJcblx0aWYgKE1ldGVvci5zZXR0aW5ncy5wdXNoPy5hbGl5dW4gb3IgTWV0ZW9yLnNldHRpbmdzLnB1c2g/LnhpbmdlIG9yIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5odWF3ZWkgb3IgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lm1pKSBhbmQgUHVzaCBhbmQgdHlwZW9mIFB1c2guc2VuZEdDTSA9PSAnZnVuY3Rpb24nXHJcblx0XHRcclxuXHRcdFB1c2gub2xkX3NlbmRHQ00gPSBQdXNoLnNlbmRHQ007XHJcblxyXG5cdFx0UHVzaC5zZW5kQWxpeXVuID0gKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikgLT5cclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kQWxpeXVuJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uXHJcblxyXG5cdFx0XHRpZiBNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdClcclxuXHRcdFx0XHRub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKVxyXG5cdFx0XHQjIE1ha2Ugc3VyZSB1c2VyVG9rZW5zIGFyZSBhbiBhcnJheSBvZiBzdHJpbmdzXHJcblx0XHRcdGlmIHVzZXJUb2tlbnMgPT0gJycgKyB1c2VyVG9rZW5zXHJcblx0XHRcdFx0dXNlclRva2VucyA9IFsgdXNlclRva2VucyBdXHJcblx0XHRcdCMgQ2hlY2sgaWYgYW55IHRva2VucyBpbiB0aGVyZSB0byBzZW5kXHJcblx0XHRcdGlmICF1c2VyVG9rZW5zLmxlbmd0aFxyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJ1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb25cclxuXHJcblx0XHRcdEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJylcclxuXHQgIFxyXG5cdFx0XHR1c2VyVG9rZW4gPSBpZiB1c2VyVG9rZW5zLmxlbmd0aCA9PSAxIHRoZW4gdXNlclRva2Vuc1swXSBlbHNlIG51bGxcclxuXHRcdFx0QWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UgdXNlclRva2Vucywgbm90aWZpY2F0aW9uLCAoZXJyLCByZXN1bHQpIC0+XHJcblx0XHRcdFx0aWYgZXJyXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyAnQU5EUk9JRCBFUlJPUjogcmVzdWx0IG9mIHNlbmRlcjogJyArIHJlc3VsdFxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGlmIHJlc3VsdCA9PSBudWxsXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nICdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyIGlzIG51bGwnXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRcdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nICdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KVxyXG5cclxuXHRcdFx0XHRcdGlmIHJlc3VsdC5jYW5vbmljYWxfaWRzID09IDEgYW5kIHVzZXJUb2tlblxyXG5cdFx0XHRcdFx0XHRGaWJlcigoc2VsZikgLT5cclxuXHRcdFx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0XHRcdHNlbGYuY2FsbGJhY2sgc2VsZi5vbGRUb2tlbiwgc2VsZi5uZXdUb2tlblxyXG5cdFx0XHRcdFx0XHRcdGNhdGNoIGVyclxyXG5cdFx0XHRcdFx0XHQpLnJ1blxyXG5cdFx0XHRcdFx0XHRcdG9sZFRva2VuOiBnY206IHVzZXJUb2tlblxyXG5cdFx0XHRcdFx0XHRcdG5ld1Rva2VuOiBnY206IFwiYWxpeXVuOlwiICsgcmVzdWx0LnJlc3VsdHNbMF0ucmVnaXN0cmF0aW9uX2lkXHJcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2s6IF9yZXBsYWNlVG9rZW5cclxuXHRcdFx0XHRcdGlmIHJlc3VsdC5mYWlsdXJlICE9IDAgYW5kIHVzZXJUb2tlblxyXG5cdFx0XHRcdFx0XHRGaWJlcigoc2VsZikgLT5cclxuXHRcdFx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0XHRcdHNlbGYuY2FsbGJhY2sgc2VsZi50b2tlblxyXG5cdFx0XHRcdFx0XHRcdGNhdGNoIGVyclxyXG5cdFx0XHRcdFx0XHQpLnJ1blxyXG5cdFx0XHRcdFx0XHRcdHRva2VuOiBnY206IHVzZXJUb2tlblxyXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrOiBfcmVtb3ZlVG9rZW5cclxuXHJcblxyXG5cclxuXHRcdFB1c2guc2VuZEdDTSA9ICh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIC0+XHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTSBmcm9tIGFsaXl1bi0+IFB1c2guc2VuZEdDTSdcclxuXHRcdFx0aWYgTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpXHJcblx0XHRcdFx0bm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSlcclxuXHRcdFx0IyBNYWtlIHN1cmUgdXNlclRva2VucyBhcmUgYW4gYXJyYXkgb2Ygc3RyaW5nc1xyXG5cdFx0XHRpZiB1c2VyVG9rZW5zID09ICcnICsgdXNlclRva2Vuc1xyXG5cdFx0XHRcdHVzZXJUb2tlbnMgPSBbIHVzZXJUb2tlbnMgXVxyXG5cdFx0XHQjIENoZWNrIGlmIGFueSB0b2tlbnMgaW4gdGhlcmUgdG8gc2VuZFxyXG5cdFx0XHRpZiAhdXNlclRva2Vucy5sZW5ndGhcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCdcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uXHJcblxyXG5cdFx0XHRhbGl5dW5Ub2tlbnMgPSB1c2VyVG9rZW5zLmZpbHRlcigoaXRlbSkgLT5cclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uaW5kZXhPZignYWxpeXVuOicpID4gLTEgb3IgaXRlbS5pbmRleE9mKCd4aW5nZTonKSA+IC0xIG9yIGl0ZW0uaW5kZXhPZignaHVhd2VpOicpID4gLTEgb3IgaXRlbS5pbmRleE9mKCdtaTonKSA+IC0xXHJcblx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ2FsaXl1blRva2VucyBpcyAnLCBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKVxyXG5cclxuXHRcdFx0Z2NtVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoKGl0ZW0pIC0+XHJcblx0XHRcdFx0XHRcdFx0XHRpdGVtLmluZGV4T2YoXCJhbGl5dW46XCIpIDwgMCBhbmQgaXRlbS5pbmRleE9mKFwieGluZ2U6XCIpIDwgMCBhbmQgaXRlbS5pbmRleE9mKFwiaHVhd2VpOlwiKSA8IDAgYW5kIGl0ZW0uaW5kZXhPZihcIm1pOlwiKSA8IDBcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnZ2NtVG9rZW5zIGlzICcgLCBnY21Ub2tlbnMudG9TdHJpbmcoKTtcclxuXHJcblx0XHRcdFB1c2guc2VuZEFsaXl1bihhbGl5dW5Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XHJcblxyXG5cdFx0XHRQdXNoLm9sZF9zZW5kR0NNKGdjbVRva2Vucywgbm90aWZpY2F0aW9uKTtcclxuXHJcblx0XHRQdXNoLm9sZF9zZW5kQVBOID0gUHVzaC5zZW5kQVBOXHJcblx0XHRQdXNoLnNlbmRBUE4gPSAodXNlclRva2VuLCBub3RpZmljYXRpb24pIC0+XHJcblx0XHRcdGlmIG5vdGlmaWNhdGlvbi50aXRsZSBhbmQgbm90aWZpY2F0aW9uLnRleHRcclxuXHRcdFx0XHRub3RpID0gXy5jbG9uZShub3RpZmljYXRpb24pXHJcblx0XHRcdFx0bm90aS50ZXh0ID0gbm90aS50aXRsZSArIFwiIFwiICsgbm90aS50ZXh0XHJcblx0XHRcdFx0bm90aS50aXRsZSA9IFwiXCJcclxuXHRcdFx0XHRQdXNoLm9sZF9zZW5kQVBOKHVzZXJUb2tlbiwgbm90aSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpZmljYXRpb24pXHJcbiIsInZhciBBbGl5dW5fcHVzaDtcblxuQWxpeXVuX3B1c2ggPSB7fTtcblxuQWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbih1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIGNhbGxiYWNrKSB7XG4gIHZhciBBTFksIEFMWVBVU0gsIE1pUHVzaCwgWGluZ2UsIFhpbmdlQXBwLCBhbGl5dW5Ub2tlbnMsIGFuZHJvaWRNZXNzYWdlLCBkYXRhLCBodWF3ZWlUb2tlbnMsIG1pVG9rZW5zLCBtc2csIG5vdGksIHBhY2thZ2VfbmFtZSwgcmVmLCByZWYxLCByZWYyLCByZWYzLCB0b2tlbkRhdGFMaXN0LCB4aW5nZVRva2VucztcbiAgaWYgKG5vdGlmaWNhdGlvbi50aXRsZSAmJiBub3RpZmljYXRpb24udGV4dCkge1xuICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZyh1c2VyVG9rZW5zKTtcbiAgICB9XG4gICAgYWxpeXVuVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIHhpbmdlVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIGh1YXdlaVRva2VucyA9IG5ldyBBcnJheTtcbiAgICBtaVRva2VucyA9IG5ldyBBcnJheTtcbiAgICB1c2VyVG9rZW5zLmZvckVhY2goZnVuY3Rpb24odXNlclRva2VuKSB7XG4gICAgICB2YXIgYXJyO1xuICAgICAgYXJyID0gdXNlclRva2VuLnNwbGl0KCc6Jyk7XG4gICAgICBpZiAoYXJyWzBdID09PSBcImFsaXl1blwiKSB7XG4gICAgICAgIHJldHVybiBhbGl5dW5Ub2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9IGVsc2UgaWYgKGFyclswXSA9PT0gXCJ4aW5nZVwiKSB7XG4gICAgICAgIHJldHVybiB4aW5nZVRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyWzBdID09PSBcImh1YXdlaVwiKSB7XG4gICAgICAgIHJldHVybiBodWF3ZWlUb2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9IGVsc2UgaWYgKGFyclswXSA9PT0gXCJtaVwiKSB7XG4gICAgICAgIHJldHVybiBtaVRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIV8uaXNFbXB0eShhbGl5dW5Ub2tlbnMpICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYuYWxpeXVuIDogdm9pZCAwKSkge1xuICAgICAgQUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJhbGl5dW5Ub2tlbnM6IFwiICsgYWxpeXVuVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIEFMWVBVU0ggPSBuZXcgQUxZLlBVU0goe1xuICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFjY2Vzc0tleUlkLFxuICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5zZWNyZXRBY2Nlc3NLZXksXG4gICAgICAgIGVuZHBvaW50OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uZW5kcG9pbnQsXG4gICAgICAgIGFwaVZlcnNpb246IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hcGlWZXJzaW9uXG4gICAgICB9KTtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIEFwcEtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwcEtleSxcbiAgICAgICAgVGFyZ2V0OiAnZGV2aWNlJyxcbiAgICAgICAgVGFyZ2V0VmFsdWU6IGFsaXl1blRva2Vucy50b1N0cmluZygpLFxuICAgICAgICBUaXRsZTogbm90aWZpY2F0aW9uLnRpdGxlLFxuICAgICAgICBTdW1tYXJ5OiBub3RpZmljYXRpb24udGV4dFxuICAgICAgfTtcbiAgICAgIEFMWVBVU0gucHVzaE5vdGljZVRvQW5kcm9pZChkYXRhLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIGlmICghXy5pc0VtcHR5KHhpbmdlVG9rZW5zKSAmJiAoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjEueGluZ2UgOiB2b2lkIDApKSB7XG4gICAgICBYaW5nZSA9IHJlcXVpcmUoJ3hpbmdlJyk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcInhpbmdlVG9rZW5zOiBcIiArIHhpbmdlVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIFhpbmdlQXBwID0gbmV3IFhpbmdlLlhpbmdlQXBwKE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLmFjY2Vzc0lkLCBNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5zZWNyZXRLZXkpO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UgPSBuZXcgWGluZ2UuQW5kcm9pZE1lc3NhZ2U7XG4gICAgICBhbmRyb2lkTWVzc2FnZS50eXBlID0gWGluZ2UuTUVTU0FHRV9UWVBFX05PVElGSUNBVElPTjtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLnRpdGxlID0gbm90aWZpY2F0aW9uLnRpdGxlO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UuY29udGVudCA9IG5vdGlmaWNhdGlvbi50ZXh0O1xuICAgICAgYW5kcm9pZE1lc3NhZ2Uuc3R5bGUgPSBuZXcgWGluZ2UuU3R5bGU7XG4gICAgICBhbmRyb2lkTWVzc2FnZS5hY3Rpb24gPSBuZXcgWGluZ2UuQ2xpY2tBY3Rpb247XG4gICAgICBfLmVhY2goeGluZ2VUb2tlbnMsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIFhpbmdlQXBwLnB1c2hUb1NpbmdsZURldmljZSh0LCBhbmRyb2lkTWVzc2FnZSwgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICghXy5pc0VtcHR5KGh1YXdlaVRva2VucykgJiYgKChyZWYyID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYyLmh1YXdlaSA6IHZvaWQgMCkpIHtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaHVhd2VpVG9rZW5zOiBcIiArIGh1YXdlaVRva2Vucyk7XG4gICAgICB9XG4gICAgICBwYWNrYWdlX25hbWUgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwUGtnTmFtZTtcbiAgICAgIHRva2VuRGF0YUxpc3QgPSBbXTtcbiAgICAgIF8uZWFjaChodWF3ZWlUb2tlbnMsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHRva2VuRGF0YUxpc3QucHVzaCh7XG4gICAgICAgICAgJ3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSxcbiAgICAgICAgICAndG9rZW4nOiB0XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBub3RpID0ge1xuICAgICAgICAnYW5kcm9pZCc6IHtcbiAgICAgICAgICAndGl0bGUnOiBub3RpZmljYXRpb24udGl0bGUsXG4gICAgICAgICAgJ21lc3NhZ2UnOiBub3RpZmljYXRpb24udGV4dFxuICAgICAgICB9LFxuICAgICAgICAnZXh0cmFzJzogbm90aWZpY2F0aW9uLnBheWxvYWRcbiAgICAgIH07XG4gICAgICBIdWF3ZWlQdXNoLmNvbmZpZyhbXG4gICAgICAgIHtcbiAgICAgICAgICAncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLFxuICAgICAgICAgICdjbGllbnRfaWQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwSWQsXG4gICAgICAgICAgJ2NsaWVudF9zZWNyZXQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwU2VjcmV0XG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgICAgSHVhd2VpUHVzaC5zZW5kTWFueShub3RpLCB0b2tlbkRhdGFMaXN0KTtcbiAgICB9XG4gICAgaWYgKCFfLmlzRW1wdHkobWlUb2tlbnMpICYmICgocmVmMyA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMy5taSA6IHZvaWQgMCkpIHtcbiAgICAgIE1pUHVzaCA9IHJlcXVpcmUoJ3hpYW9taS1wdXNoJyk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIm1pVG9rZW5zOiBcIiArIG1pVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIG1zZyA9IG5ldyBNaVB1c2guTWVzc2FnZTtcbiAgICAgIG1zZy50aXRsZShub3RpZmljYXRpb24udGl0bGUpLmRlc2NyaXB0aW9uKG5vdGlmaWNhdGlvbi50ZXh0KTtcbiAgICAgIG5vdGlmaWNhdGlvbiA9IG5ldyBNaVB1c2guTm90aWZpY2F0aW9uKHtcbiAgICAgICAgcHJvZHVjdGlvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkucHJvZHVjdGlvbixcbiAgICAgICAgYXBwU2VjcmV0OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5hcHBTZWNyZXRcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChtaVRva2VucywgZnVuY3Rpb24ocmVnaWQpIHtcbiAgICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5zZW5kKHJlZ2lkLCBtc2csIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjb25maWcsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgcmVmNjtcbiAgaWYgKCEoKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5jcm9uKSAhPSBudWxsID8gcmVmLnB1c2hfaW50ZXJ2YWwgOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbmZpZyA9IHtcbiAgICBkZWJ1ZzogdHJ1ZSxcbiAgICBrZWVwTm90aWZpY2F0aW9uczogZmFsc2UsXG4gICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5wdXNoX2ludGVydmFsLFxuICAgIHNlbmRCYXRjaFNpemU6IDEwLFxuICAgIHByb2R1Y3Rpb246IHRydWVcbiAgfTtcbiAgaWYgKCFfLmlzRW1wdHkoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjEuYXBuIDogdm9pZCAwKSkge1xuICAgIGNvbmZpZy5hcG4gPSB7XG4gICAgICBrZXlEYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4ua2V5RGF0YSxcbiAgICAgIGNlcnREYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4uY2VydERhdGFcbiAgICB9O1xuICB9XG4gIGlmICghXy5pc0VtcHR5KChyZWYyID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYyLmdjbSA6IHZvaWQgMCkpIHtcbiAgICBjb25maWcuZ2NtID0ge1xuICAgICAgcHJvamVjdE51bWJlcjogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLnByb2plY3ROdW1iZXIsXG4gICAgICBhcGlLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5hcGlLZXlcbiAgICB9O1xuICB9XG4gIFB1c2guQ29uZmlndXJlKGNvbmZpZyk7XG4gIGlmICgoKChyZWYzID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYzLmFsaXl1biA6IHZvaWQgMCkgfHwgKChyZWY0ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY0LnhpbmdlIDogdm9pZCAwKSB8fCAoKHJlZjUgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjUuaHVhd2VpIDogdm9pZCAwKSB8fCAoKHJlZjYgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjYubWkgOiB2b2lkIDApKSAmJiBQdXNoICYmIHR5cGVvZiBQdXNoLnNlbmRHQ00gPT09ICdmdW5jdGlvbicpIHtcbiAgICBQdXNoLm9sZF9zZW5kR0NNID0gUHVzaC5zZW5kR0NNO1xuICAgIFB1c2guc2VuZEFsaXl1biA9IGZ1bmN0aW9uKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIEZpYmVyLCB1c2VyVG9rZW47XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgICBpZiAoTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpKSB7XG4gICAgICAgIG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJUb2tlbnMgPT09ICcnICsgdXNlclRva2Vucykge1xuICAgICAgICB1c2VyVG9rZW5zID0gW3VzZXJUb2tlbnNdO1xuICAgICAgfVxuICAgICAgaWYgKCF1c2VyVG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICAgICAgdXNlclRva2VuID0gdXNlclRva2Vucy5sZW5ndGggPT09IDEgPyB1c2VyVG9rZW5zWzBdIDogbnVsbDtcbiAgICAgIHJldHVybiBBbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5sb2coJ0FORFJPSUQgRVJST1I6IHJlc3VsdCBvZiBzZW5kZXI6ICcgKyByZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyIGlzIG51bGwnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlcjogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0LmNhbm9uaWNhbF9pZHMgPT09IDEgJiYgdXNlclRva2VuKSB7XG4gICAgICAgICAgICBGaWJlcihmdW5jdGlvbihzZWxmKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soc2VsZi5vbGRUb2tlbiwgc2VsZi5uZXdUb2tlbik7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnJ1bih7XG4gICAgICAgICAgICAgIG9sZFRva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiB1c2VyVG9rZW5cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmV3VG9rZW46IHtcbiAgICAgICAgICAgICAgICBnY206IFwiYWxpeXVuOlwiICsgcmVzdWx0LnJlc3VsdHNbMF0ucmVnaXN0cmF0aW9uX2lkXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhbGxiYWNrOiBfcmVwbGFjZVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdC5mYWlsdXJlICE9PSAwICYmIHVzZXJUb2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKHNlbGYpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhzZWxmLnRva2VuKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkucnVuKHtcbiAgICAgICAgICAgICAgdG9rZW46IHtcbiAgICAgICAgICAgICAgICBnY206IHVzZXJUb2tlblxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWxsYmFjazogX3JlbW92ZVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gICAgUHVzaC5zZW5kR0NNID0gZnVuY3Rpb24odXNlclRva2Vucywgbm90aWZpY2F0aW9uKSB7XG4gICAgICB2YXIgYWxpeXVuVG9rZW5zLCBnY21Ub2tlbnM7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTSBmcm9tIGFsaXl1bi0+IFB1c2guc2VuZEdDTScpO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KSkge1xuICAgICAgICBub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKTtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyVG9rZW5zID09PSAnJyArIHVzZXJUb2tlbnMpIHtcbiAgICAgICAgdXNlclRva2VucyA9IFt1c2VyVG9rZW5zXTtcbiAgICAgIH1cbiAgICAgIGlmICghdXNlclRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgYWxpeXVuVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5pbmRleE9mKCdhbGl5dW46JykgPiAtMSB8fCBpdGVtLmluZGV4T2YoJ3hpbmdlOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCdodWF3ZWk6JykgPiAtMSB8fCBpdGVtLmluZGV4T2YoJ21pOicpID4gLTE7XG4gICAgICB9KTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhbGl5dW5Ub2tlbnMgaXMgJywgYWxpeXVuVG9rZW5zLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAgZ2NtVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5pbmRleE9mKFwiYWxpeXVuOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwieGluZ2U6XCIpIDwgMCAmJiBpdGVtLmluZGV4T2YoXCJodWF3ZWk6XCIpIDwgMCAmJiBpdGVtLmluZGV4T2YoXCJtaTpcIikgPCAwO1xuICAgICAgfSk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2NtVG9rZW5zIGlzICcsIGdjbVRva2Vucy50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICAgIFB1c2guc2VuZEFsaXl1bihhbGl5dW5Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEdDTShnY21Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgfTtcbiAgICBQdXNoLm9sZF9zZW5kQVBOID0gUHVzaC5zZW5kQVBOO1xuICAgIHJldHVybiBQdXNoLnNlbmRBUE4gPSBmdW5jdGlvbih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIG5vdGk7XG4gICAgICBpZiAobm90aWZpY2F0aW9uLnRpdGxlICYmIG5vdGlmaWNhdGlvbi50ZXh0KSB7XG4gICAgICAgIG5vdGkgPSBfLmNsb25lKG5vdGlmaWNhdGlvbik7XG4gICAgICAgIG5vdGkudGV4dCA9IG5vdGkudGl0bGUgKyBcIiBcIiArIG5vdGkudGV4dDtcbiAgICAgICAgbm90aS50aXRsZSA9IFwiXCI7XG4gICAgICAgIHJldHVybiBQdXNoLm9sZF9zZW5kQVBOKHVzZXJUb2tlbiwgbm90aSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iXX0=
