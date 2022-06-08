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
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var FS = Package['steedos:cfs-base-package'].FS;

/* Package-scope variables */
var __coffeescriptShare, ironRouterSendErrorToResponse, msg;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:api":{"checkNpm.js":function module(require,exports,module){

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
  'xiaomi-push': '>=0.4.5'
}, 'steedos:api');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_files.coffee":function module(require){

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

},"lib":{"restivus":{"auth.coffee":function module(){

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

    if (space && _.indexOf(space.admins, su.user) >= 0) {
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

},"iron-router-error-to-response.js":function module(){

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

},"route.coffee":function module(){

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

          if (space && _.indexOf(space.admins, auth.userId) >= 0) {
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

},"restivus.coffee":function module(){

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

}}},"core.coffee":function module(){

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

},"steedos":{"space_users.coffee":function module(){

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

},"organizations.coffee":function module(){

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

}},"routes":{"s3.coffee":function module(){

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

},"push.coffee":function module(){

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

},"aliyun_push.coffee":function module(require){

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
  var config, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;

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

  if (!_.isEmpty((ref1 = Meteor.settings.push) != null ? ref1.apn : void 0) && !_.isEmpty((ref2 = Meteor.settings.push) != null ? ref2.apn.keyData : void 0) && !_.isEmpty((ref3 = Meteor.settings.push) != null ? ref3.apn.certData : void 0)) {
    config.apn = {
      keyData: Meteor.settings.push.apn.keyData,
      certData: Meteor.settings.push.apn.certData
    };
  }

  if (!_.isEmpty((ref4 = Meteor.settings.push) != null ? ref4.gcm : void 0) && !_.isEmpty((ref5 = Meteor.settings.push) != null ? ref5.gcm.projectNumber : void 0) && !_.isEmpty((ref6 = Meteor.settings.push) != null ? ref6.gcm.apiKey : void 0)) {
    config.gcm = {
      projectNumber: Meteor.settings.push.gcm.projectNumber,
      apiKey: Meteor.settings.push.gcm.apiKey
    };
  }

  Push.Configure(config);

  if ((((ref7 = Meteor.settings.push) != null ? ref7.aliyun : void 0) || ((ref8 = Meteor.settings.push) != null ? ref8.xinge : void 0) || ((ref9 = Meteor.settings.push) != null ? ref9.huawei : void 0) || ((ref10 = Meteor.settings.push) != null ? ref10.mi : void 0)) && Push && typeof Push.sendGCM === 'function') {
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
      var e, noti;

      try {
        if (notification.title && notification.text) {
          noti = _.clone(notification);
          noti.text = noti.title + " " + noti.text;
          noti.title = "";
          return Push.old_sendAPN(userToken, noti);
        } else {
          return Push.old_sendAPN(userToken, notification);
        }
      } catch (error) {
        e = error;
        return console.error(e);
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
// require("/node_modules/meteor/steedos:api/routes/s3.coffee");
require("/node_modules/meteor/steedos:api/routes/push.coffee");
require("/node_modules/meteor/steedos:api/routes/aliyun_push.coffee");

/* Exports */
Package._define("steedos:api");

})();

//# sourceURL=meteor://💻app/packages/steedos_api.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3BhcnNlX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFyc2VfZmlsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvbGliL3Jlc3RpdnVzL2lyb24tcm91dGVyLWVycm9yLXRvLXJlc3BvbnNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3N0ZWVkb3Mvc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zdGVlZG9zL3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYnVzYm95IiwiY29va2llcyIsIkJ1c2JveSIsIkZpYmVyIiwicmVxdWlyZSIsIkpzb25Sb3V0ZXMiLCJwYXJzZUZpbGVzIiwicmVxIiwicmVzIiwibmV4dCIsImZpbGVzIiwibWV0aG9kIiwiaGVhZGVycyIsIm9uIiwiZmllbGRuYW1lIiwiZmlsZSIsImZpbGVuYW1lIiwiZW5jb2RpbmciLCJtaW1ldHlwZSIsImJ1ZmZlcnMiLCJpbWFnZSIsIm1pbWVUeXBlIiwiZGF0YSIsInB1c2giLCJCdWZmZXIiLCJjb25jYXQiLCJ2YWx1ZSIsImJvZHkiLCJydW4iLCJwaXBlIiwiZ2V0VXNlclF1ZXJ5U2VsZWN0b3IiLCJ1c2VyVmFsaWRhdG9yIiwiQXV0aCIsIk1hdGNoIiwiV2hlcmUiLCJ1c2VyIiwiY2hlY2siLCJpZCIsIk9wdGlvbmFsIiwiU3RyaW5nIiwidXNlcm5hbWUiLCJlbWFpbCIsIl8iLCJrZXlzIiwibGVuZ3RoIiwiRXJyb3IiLCJsb2dpbldpdGhQYXNzd29yZCIsInBhc3N3b3JkIiwiYXV0aFRva2VuIiwiYXV0aGVudGljYXRpbmdVc2VyIiwiYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IiLCJoYXNoZWRUb2tlbiIsInBhc3N3b3JkVmVyaWZpY2F0aW9uIiwicmVmIiwic3BhY2VfdXNlcnMiLCJzcGFjZXMiLCJNZXRlb3IiLCJ1c2VycyIsImZpbmRPbmUiLCJzZXJ2aWNlcyIsIkFjY291bnRzIiwiX2NoZWNrUGFzc3dvcmQiLCJlcnJvciIsIl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuIiwiX2hhc2hTdGFtcGVkVG9rZW4iLCJfaW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiIsIl9pZCIsImRiIiwiZmluZCIsImZldGNoIiwiZWFjaCIsInN1Iiwic3BhY2UiLCJpbmRleE9mIiwiYWRtaW5zIiwibmFtZSIsInRva2VuIiwidXNlcklkIiwiYWRtaW5TcGFjZXMiLCJlbnYiLCJwcm9jZXNzIiwiTk9ERV9FTlYiLCJpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSIsImVyciIsInN0YXR1c0NvZGUiLCJzdGF0dXMiLCJtc2ciLCJzdGFjayIsInRvU3RyaW5nIiwiY29uc29sZSIsImhlYWRlcnNTZW50Iiwic29ja2V0IiwiZGVzdHJveSIsInNldEhlYWRlciIsImJ5dGVMZW5ndGgiLCJlbmQiLCJzaGFyZSIsIlJvdXRlIiwiYXBpIiwicGF0aCIsIm9wdGlvbnMiLCJlbmRwb2ludHMxIiwiZW5kcG9pbnRzIiwicHJvdG90eXBlIiwiYWRkVG9BcGkiLCJhdmFpbGFibGVNZXRob2RzIiwiYWxsb3dlZE1ldGhvZHMiLCJmdWxsUGF0aCIsInJlamVjdGVkTWV0aG9kcyIsInNlbGYiLCJjb250YWlucyIsIl9jb25maWciLCJwYXRocyIsImV4dGVuZCIsImRlZmF1bHRPcHRpb25zRW5kcG9pbnQiLCJfcmVzb2x2ZUVuZHBvaW50cyIsIl9jb25maWd1cmVFbmRwb2ludHMiLCJmaWx0ZXIiLCJyZWplY3QiLCJhcGlQYXRoIiwiZW5kcG9pbnQiLCJhZGQiLCJkb25lRnVuYyIsImVuZHBvaW50Q29udGV4dCIsInJlc3BvbnNlRGF0YSIsInJlc3BvbnNlSW5pdGlhdGVkIiwidXJsUGFyYW1zIiwicGFyYW1zIiwicXVlcnlQYXJhbXMiLCJxdWVyeSIsImJvZHlQYXJhbXMiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJkb25lIiwiX2NhbGxFbmRwb2ludCIsImVycm9yMSIsIl9yZXNwb25kIiwibWVzc2FnZSIsImpvaW4iLCJ0b1VwcGVyQ2FzZSIsImlzRnVuY3Rpb24iLCJhY3Rpb24iLCJyZWYxIiwicmVmMiIsInJvbGVSZXF1aXJlZCIsInVuaW9uIiwiaXNFbXB0eSIsImF1dGhSZXF1aXJlZCIsInNwYWNlUmVxdWlyZWQiLCJpbnZvY2F0aW9uIiwiX2F1dGhBY2NlcHRlZCIsIl9yb2xlQWNjZXB0ZWQiLCJfc3BhY2VBY2NlcHRlZCIsIkREUENvbW1vbiIsIk1ldGhvZEludm9jYXRpb24iLCJpc1NpbXVsYXRpb24iLCJjb25uZWN0aW9uIiwicmFuZG9tU2VlZCIsIm1ha2VScGNTZWVkIiwiRERQIiwiX0N1cnJlbnRJbnZvY2F0aW9uIiwid2l0aFZhbHVlIiwiY2FsbCIsIl9hdXRoZW50aWNhdGUiLCJhdXRoIiwidXNlclNlbGVjdG9yIiwic3BhY2VfdXNlcnNfY291bnQiLCJzcGFjZUlkIiwiY291bnQiLCJpbnRlcnNlY3Rpb24iLCJyb2xlcyIsImRlZmF1bHRIZWFkZXJzIiwiZGVsYXlJbk1pbGxpc2Vjb25kcyIsIm1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzIiwicmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28iLCJzZW5kUmVzcG9uc2UiLCJfbG93ZXJDYXNlS2V5cyIsIm1hdGNoIiwicHJldHR5SnNvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3cml0ZUhlYWQiLCJ3cml0ZSIsIk1hdGgiLCJyYW5kb20iLCJzZXRUaW1lb3V0Iiwib2JqZWN0IiwiY2hhaW4iLCJwYWlycyIsIm1hcCIsImF0dHIiLCJ0b0xvd2VyQ2FzZSIsIlJlc3RpdnVzIiwiaXRlbSIsImkiLCJsIiwiY29yc0hlYWRlcnMiLCJfcm91dGVzIiwidXNlRGVmYXVsdEF1dGgiLCJ2ZXJzaW9uIiwiX3VzZXIiLCJfaGFzaExvZ2luVG9rZW4iLCJlbmFibGVDb3JzIiwic2xpY2UiLCJsYXN0IiwiX2luaXRBdXRoIiwidXNlQXV0aCIsIndhcm4iLCJhZGRSb3V0ZSIsInJvdXRlIiwiYWRkQ29sbGVjdGlvbiIsImNvbGxlY3Rpb24iLCJjb2xsZWN0aW9uRW5kcG9pbnRzIiwiY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzIiwiZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uIiwiZW50aXR5Um91dGVFbmRwb2ludHMiLCJleGNsdWRlZEVuZHBvaW50cyIsIm1ldGhvZHMiLCJtZXRob2RzT25Db2xsZWN0aW9uIiwicm91dGVPcHRpb25zIiwiX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzIiwiX2NvbGxlY3Rpb25FbmRwb2ludHMiLCJfbmFtZSIsImNvbmZpZ3VyZWRFbmRwb2ludCIsImVuZHBvaW50T3B0aW9ucyIsIm1ldGhvZFR5cGUiLCJjbG9uZSIsImdldCIsImVudGl0eSIsInNlbGVjdG9yIiwicHV0IiwiZW50aXR5SXNVcGRhdGVkIiwidXBkYXRlIiwiJHNldCIsInJlbW92ZSIsInBvc3QiLCJlbnRpdHlJZCIsImluc2VydCIsImdldEFsbCIsImVudGl0aWVzIiwiZmllbGRzIiwicHJvZmlsZSIsImNyZWF0ZVVzZXIiLCJsb2dvdXQiLCJlIiwiZXh0cmFEYXRhIiwic2VhcmNoUXVlcnkiLCJyZWFzb24iLCJvbkxvZ2dlZEluIiwiZXh0cmEiLCJpbmRleCIsInRva2VuRmllbGROYW1lIiwidG9rZW5Mb2NhdGlvbiIsInRva2VuUGF0aCIsInRva2VuUmVtb3ZhbFF1ZXJ5IiwidG9rZW5Ub1JlbW92ZSIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwiJHB1bGwiLCJvbkxvZ2dlZE91dCIsImlzU2VydmVyIiwiQVBJIiwic3RhcnR1cCIsIm9yZ2FuaXphdGlvbnMiLCJjZnMiLCJpbnN0YW5jZXMiLCJuZXdGaWxlIiwiRlMiLCJGaWxlIiwiYXR0YWNoRGF0YSIsInR5cGUiLCJmaWxlT2JqIiwibWV0YWRhdGEiLCJwYXJlbnQiLCJyIiwiaW5jbHVkZXMiLCJtb21lbnQiLCJEYXRlIiwiZm9ybWF0Iiwic3BsaXQiLCJwb3AiLCJkZWNvZGVVUklDb21wb25lbnQiLCJyZXBsYWNlIiwib3duZXIiLCJvd25lcl9uYW1lIiwiaW5zdGFuY2UiLCJhcHByb3ZlIiwiY3VycmVudCIsInRvTG9jYWxlTG93ZXJDYXNlIiwiaXNfcHJpdmF0ZSIsIm1haW4iLCIkdW5zZXQiLCJsb2NrZWRfYnkiLCJsb2NrZWRfYnlfbmFtZSIsIiRuZSIsIm9uY2UiLCJzdG9yZU5hbWUiLCJyZXNwIiwic2l6ZSIsIm9yaWdpbmFsIiwidmVyc2lvbl9pZCIsIlN0ZWVkb3MiLCJhYnNvbHV0ZVVybCIsInB1c2hUb3BpYyIsInVzZXJJZHMiLCJmcm9tIiwiYXBwTmFtZSIsImFsZXJ0VGl0bGUiLCJhbGVydCIsImJhZGdlIiwic291bmQiLCJQdXNoIiwic2VuZCIsInB1c2hTZW5kIiwidGV4dCIsInRpdGxlIiwiQWxpeXVuX3B1c2giLCJzZW5kTWVzc2FnZSIsInVzZXJUb2tlbnMiLCJub3RpZmljYXRpb24iLCJjYWxsYmFjayIsIkFMWSIsIkFMWVBVU0giLCJNaVB1c2giLCJYaW5nZSIsIlhpbmdlQXBwIiwiYWxpeXVuVG9rZW5zIiwiYW5kcm9pZE1lc3NhZ2UiLCJodWF3ZWlUb2tlbnMiLCJtaVRva2VucyIsIm5vdGkiLCJwYWNrYWdlX25hbWUiLCJyZWYzIiwidG9rZW5EYXRhTGlzdCIsInhpbmdlVG9rZW5zIiwiZGVidWciLCJsb2ciLCJBcnJheSIsImZvckVhY2giLCJ1c2VyVG9rZW4iLCJhcnIiLCJzZXR0aW5ncyIsImFsaXl1biIsIlBVU0giLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsImFwaVZlcnNpb24iLCJBcHBLZXkiLCJhcHBLZXkiLCJUYXJnZXQiLCJUYXJnZXRWYWx1ZSIsIlRpdGxlIiwiU3VtbWFyeSIsInB1c2hOb3RpY2VUb0FuZHJvaWQiLCJ4aW5nZSIsImFjY2Vzc0lkIiwic2VjcmV0S2V5IiwiQW5kcm9pZE1lc3NhZ2UiLCJNRVNTQUdFX1RZUEVfTk9USUZJQ0FUSU9OIiwiY29udGVudCIsInN0eWxlIiwiU3R5bGUiLCJDbGlja0FjdGlvbiIsInQiLCJwdXNoVG9TaW5nbGVEZXZpY2UiLCJodWF3ZWkiLCJhcHBQa2dOYW1lIiwicGF5bG9hZCIsIkh1YXdlaVB1c2giLCJjb25maWciLCJhcHBJZCIsImFwcFNlY3JldCIsInNlbmRNYW55IiwibWkiLCJNZXNzYWdlIiwiZGVzY3JpcHRpb24iLCJOb3RpZmljYXRpb24iLCJwcm9kdWN0aW9uIiwicmVnaWQiLCJyZWYxMCIsInJlZjQiLCJyZWY1IiwicmVmNiIsInJlZjciLCJyZWY4IiwicmVmOSIsImNyb24iLCJwdXNoX2ludGVydmFsIiwia2VlcE5vdGlmaWNhdGlvbnMiLCJzZW5kSW50ZXJ2YWwiLCJzZW5kQmF0Y2hTaXplIiwiYXBuIiwia2V5RGF0YSIsImNlcnREYXRhIiwiZ2NtIiwicHJvamVjdE51bWJlciIsImFwaUtleSIsIkNvbmZpZ3VyZSIsInNlbmRHQ00iLCJvbGRfc2VuZEdDTSIsInNlbmRBbGl5dW4iLCJ0ZXN0IiwiT2JqZWN0IiwicmVzdWx0IiwiY2Fub25pY2FsX2lkcyIsIm9sZFRva2VuIiwibmV3VG9rZW4iLCJyZXN1bHRzIiwicmVnaXN0cmF0aW9uX2lkIiwiX3JlcGxhY2VUb2tlbiIsImZhaWx1cmUiLCJfcmVtb3ZlVG9rZW4iLCJnY21Ub2tlbnMiLCJvbGRfc2VuZEFQTiIsInNlbmRBUE4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLGdCQUFjLFNBREU7QUFFaEJJLFFBQU0sRUFBRSxVQUZRO0FBR2hCQyxTQUFPLEVBQUUsU0FITztBQUloQixTQUFPLFNBSlM7QUFLaEIs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QkFBT2hTLEVBQUV3TCxLQUFGLENBQVE2RixZQUFSLENBQVA7QUFDQVcsZUFBS2hCLElBQUwsR0FBWWdCLEtBQUtmLEtBQUwsR0FBYSxHQUFiLEdBQW1CZSxLQUFLaEIsSUFBcEM7QUFDQWdCLGVBQUtmLEtBQUwsR0FBYSxFQUFiO0FDc0NLLGlCRHJDTEosS0FBS3NHLFdBQUwsQ0FBaUIxRSxTQUFqQixFQUE0QlQsSUFBNUIsQ0NxQ0s7QUR6Q047QUMyQ00saUJEckNMbkIsS0FBS3NHLFdBQUwsQ0FBaUIxRSxTQUFqQixFQUE0QnBCLFlBQTVCLENDcUNLO0FENUNQO0FBQUEsZUFBQWpRLEtBQUE7QUFRTXNMLFlBQUF0TCxLQUFBO0FDd0NELGVEdkNKMkIsUUFBUTNCLEtBQVIsQ0FBY3NMLENBQWQsQ0N1Q0k7QUFDRDtBRGxEVSxLQ29DYjtBQWdCRDtBRHBLSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2FwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHQnYWxpeXVuLXNkayc6ICc+PTEuOS4yJyxcblx0YnVzYm95OiBcIj49MC4yLjEzXCIsXG5cdGNvb2tpZXM6IFwiPj0wLjYuMlwiLFxuXHQnY3N2JzogXCI+PTUuMS4yXCIsXG5cdCd1cmwnOiAnPj0wLjEwLjAnLFxuXHQncmVxdWVzdCc6ICc+PTIuODEuMCcsXG5cdCd4aW5nZSc6ICc+PTEuMS4zJyxcblx0J3hpYW9taS1wdXNoJzogJz49MC40LjUnXG59LCAnc3RlZWRvczphcGknKTsiLCJCdXNib3kgPSByZXF1aXJlKCdidXNib3knKTtcbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbkpzb25Sb3V0ZXMucGFyc2VGaWxlcyA9IChyZXEsIHJlcywgbmV4dCkgLT5cblx0ZmlsZXMgPSBbXTsgIyBTdG9yZSBmaWxlcyBpbiBhbiBhcnJheSBhbmQgdGhlbiBwYXNzIHRoZW0gdG8gcmVxdWVzdC5cblxuXHRpZiAocmVxLm1ldGhvZCA9PSBcIlBPU1RcIilcblx0XHRidXNib3kgPSBuZXcgQnVzYm95KHsgaGVhZGVyczogcmVxLmhlYWRlcnMgfSk7XG5cdFx0YnVzYm95Lm9uIFwiZmlsZVwiLCAgKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkgLT5cblx0XHRcdGltYWdlID0ge307ICMgY3JhdGUgYW4gaW1hZ2Ugb2JqZWN0XG5cdFx0XHRpbWFnZS5taW1lVHlwZSA9IG1pbWV0eXBlO1xuXHRcdFx0aW1hZ2UuZW5jb2RpbmcgPSBlbmNvZGluZztcblx0XHRcdGltYWdlLmZpbGVuYW1lID0gZmlsZW5hbWU7XG5cblx0XHRcdCMgYnVmZmVyIHRoZSByZWFkIGNodW5rc1xuXHRcdFx0YnVmZmVycyA9IFtdO1xuXG5cdFx0XHRmaWxlLm9uICdkYXRhJywgKGRhdGEpIC0+XG5cdFx0XHRcdGJ1ZmZlcnMucHVzaChkYXRhKTtcblxuXHRcdFx0ZmlsZS5vbiAnZW5kJywgKCkgLT5cblx0XHRcdFx0IyBjb25jYXQgdGhlIGNodW5rc1xuXHRcdFx0XHRpbWFnZS5kYXRhID0gQnVmZmVyLmNvbmNhdChidWZmZXJzKTtcblx0XHRcdFx0IyBwdXNoIHRoZSBpbWFnZSBvYmplY3QgdG8gdGhlIGZpbGUgYXJyYXlcblx0XHRcdFx0ZmlsZXMucHVzaChpbWFnZSk7XG5cblxuXHRcdGJ1c2JveS5vbiBcImZpZWxkXCIsIChmaWVsZG5hbWUsIHZhbHVlKSAtPlxuXHRcdFx0cmVxLmJvZHlbZmllbGRuYW1lXSA9IHZhbHVlO1xuXG5cdFx0YnVzYm95Lm9uIFwiZmluaXNoXCIsICAoKSAtPlxuXHRcdFx0IyBQYXNzIHRoZSBmaWxlIGFycmF5IHRvZ2V0aGVyIHdpdGggdGhlIHJlcXVlc3Rcblx0XHRcdHJlcS5maWxlcyA9IGZpbGVzO1xuXG5cdFx0XHRGaWJlciAoKS0+XG5cdFx0XHRcdG5leHQoKTtcblx0XHRcdC5ydW4oKTtcblxuXHRcdCMgUGFzcyByZXF1ZXN0IHRvIGJ1c2JveVxuXHRcdHJlcS5waXBlKGJ1c2JveSk7XG5cblx0ZWxzZVxuXHRcdG5leHQoKTtcblxuXG4jSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZShKc29uUm91dGVzLnBhcnNlRmlsZXMpOyIsInZhciBCdXNib3ksIEZpYmVyO1xuXG5CdXNib3kgPSByZXF1aXJlKCdidXNib3knKTtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuSnNvblJvdXRlcy5wYXJzZUZpbGVzID0gZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJ1c2JveSwgZmlsZXM7XG4gIGZpbGVzID0gW107XG4gIGlmIChyZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgIGJ1c2JveSA9IG5ldyBCdXNib3koe1xuICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnNcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWxlXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkge1xuICAgICAgdmFyIGJ1ZmZlcnMsIGltYWdlO1xuICAgICAgaW1hZ2UgPSB7fTtcbiAgICAgIGltYWdlLm1pbWVUeXBlID0gbWltZXR5cGU7XG4gICAgICBpbWFnZS5lbmNvZGluZyA9IGVuY29kaW5nO1xuICAgICAgaW1hZ2UuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbiAgICAgIGJ1ZmZlcnMgPSBbXTtcbiAgICAgIGZpbGUub24oJ2RhdGEnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHJldHVybiBidWZmZXJzLnB1c2goZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmaWxlLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaW1hZ2UuZGF0YSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycyk7XG4gICAgICAgIHJldHVybiBmaWxlcy5wdXNoKGltYWdlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpZWxkXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXEuYm9keVtmaWVsZG5hbWVdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgYnVzYm95Lm9uKFwiZmluaXNoXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgcmVxLmZpbGVzID0gZmlsZXM7XG4gICAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICB9KS5ydW4oKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVxLnBpcGUoYnVzYm95KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG59O1xuIiwiQEF1dGggb3I9IHt9XG5cbiMjI1xuICBBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXG4jIyNcbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZSAodXNlcikgLT5cbiAgY2hlY2sgdXNlcixcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcblxuICBpZiBfLmtleXModXNlcikubGVuZ3RoIGlzIG5vdCAxXG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yICdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJ1xuXG4gIHJldHVybiB0cnVlXG5cblxuIyMjXG4gIFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcbiMjI1xuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSAodXNlcikgLT5cbiAgaWYgdXNlci5pZFxuICAgIHJldHVybiB7J19pZCc6IHVzZXIuaWR9XG4gIGVsc2UgaWYgdXNlci51c2VybmFtZVxuICAgIHJldHVybiB7J3VzZXJuYW1lJzogdXNlci51c2VybmFtZX1cbiAgZWxzZSBpZiB1c2VyLmVtYWlsXG4gICAgcmV0dXJuIHsnZW1haWxzLmFkZHJlc3MnOiB1c2VyLmVtYWlsfVxuXG4gICMgV2Ugc2hvdWxkbid0IGJlIGhlcmUgaWYgdGhlIHVzZXIgb2JqZWN0IHdhcyBwcm9wZXJseSB2YWxpZGF0ZWRcbiAgdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJ1xuXG5cbiMjI1xuICBMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcbiMjI1xuQEF1dGgubG9naW5XaXRoUGFzc3dvcmQgPSAodXNlciwgcGFzc3dvcmQpIC0+XG4gIGlmIG5vdCB1c2VyIG9yIG5vdCBwYXNzd29yZFxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG4gICMgVmFsaWRhdGUgdGhlIGxvZ2luIGlucHV0IHR5cGVzXG4gIGNoZWNrIHVzZXIsIHVzZXJWYWxpZGF0b3JcbiAgY2hlY2sgcGFzc3dvcmQsIFN0cmluZ1xuXG4gICMgUmV0cmlldmUgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2VcbiAgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IgPSBnZXRVc2VyUXVlcnlTZWxlY3Rvcih1c2VyKVxuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvcilcblxuICBpZiBub3QgYXV0aGVudGljYXRpbmdVc2VyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG4gIGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXM/LnBhc3N3b3JkXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cbiAgIyBBdXRoZW50aWNhdGUgdGhlIHVzZXIncyBwYXNzd29yZFxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmRcbiAgaWYgcGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3JcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuICAjIEFkZCBhIG5ldyBhdXRoIHRva2VuIHRvIHRoZSB1c2VyJ3MgYWNjb3VudFxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpXG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4gYXV0aFRva2VuXG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuXG5cbiAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkfSkuZmV0Y2goKVxuICBzcGFjZXMgPSBbXVxuICBfLmVhY2ggc3BhY2VfdXNlcnMsIChzdSktPlxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3Uuc3BhY2UpXG4gICAgIyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXG4gICAgaWYgc3BhY2UgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcik+PTBcbiAgICAgIHNwYWNlcy5wdXNoXG4gICAgICAgIF9pZDogc3BhY2UuX2lkXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcbiAgcmV0dXJuIHthdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbiwgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBhZG1pblNwYWNlczogc3BhY2VzfVxuIiwidmFyIGdldFVzZXJRdWVyeVNlbGVjdG9yLCB1c2VyVmFsaWRhdG9yO1xuXG50aGlzLkF1dGggfHwgKHRoaXMuQXV0aCA9IHt9KTtcblxuXG4vKlxuICBBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXG4gKi9cblxudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlKGZ1bmN0aW9uKHVzZXIpIHtcbiAgY2hlY2sodXNlciwge1xuICAgIGlkOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpXG4gIH0pO1xuICBpZiAoXy5rZXlzKHVzZXIpLmxlbmd0aCA9PT0gITEpIHtcbiAgICB0aHJvdyBuZXcgTWF0Y2guRXJyb3IoJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5cbi8qXG4gIFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcbiAqL1xuXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgaWYgKHVzZXIuaWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ19pZCc6IHVzZXIuaWRcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIudXNlcm5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3VzZXJuYW1lJzogdXNlci51c2VybmFtZVxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci5lbWFpbCkge1xuICAgIHJldHVybiB7XG4gICAgICAnZW1haWxzLmFkZHJlc3MnOiB1c2VyLmVtYWlsXG4gICAgfTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInKTtcbn07XG5cblxuLypcbiAgTG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXG4gKi9cblxudGhpcy5BdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gZnVuY3Rpb24odXNlciwgcGFzc3dvcmQpIHtcbiAgdmFyIGF1dGhUb2tlbiwgYXV0aGVudGljYXRpbmdVc2VyLCBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciwgaGFzaGVkVG9rZW4sIHBhc3N3b3JkVmVyaWZpY2F0aW9uLCByZWYsIHNwYWNlX3VzZXJzLCBzcGFjZXM7XG4gIGlmICghdXNlciB8fCAhcGFzc3dvcmQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGNoZWNrKHVzZXIsIHVzZXJWYWxpZGF0b3IpO1xuICBjaGVjayhwYXNzd29yZCwgU3RyaW5nKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IgPSBnZXRVc2VyUXVlcnlTZWxlY3Rvcih1c2VyKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpO1xuICBpZiAoIWF1dGhlbnRpY2F0aW5nVXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaWYgKCEoKHJlZiA9IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IHJlZi5wYXNzd29yZCA6IHZvaWQgMCkpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQoYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZCk7XG4gIGlmIChwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgYXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKTtcbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbihhdXRoVG9rZW4pO1xuICBBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbihhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlbik7XG4gIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZFxuICB9KS5mZXRjaCgpO1xuICBzcGFjZXMgPSBbXTtcbiAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbihzdSkge1xuICAgIHZhciBzcGFjZTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKTtcbiAgICBpZiAoc3BhY2UgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcikgPj0gMCkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHtcbiAgICAgICAgX2lkOiBzcGFjZS5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7XG4gICAgYXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sXG4gICAgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLFxuICAgIGFkbWluU3BhY2VzOiBzcGFjZXNcbiAgfTtcbn07XG4iLCIvLyBXZSBuZWVkIGEgZnVuY3Rpb24gdGhhdCB0cmVhdHMgdGhyb3duIGVycm9ycyBleGFjdGx5IGxpa2UgSXJvbiBSb3V0ZXIgd291bGQuXG4vLyBUaGlzIGZpbGUgaXMgd3JpdHRlbiBpbiBKYXZhU2NyaXB0IHRvIGVuYWJsZSBjb3B5LXBhc3RpbmcgSXJvbiBSb3V0ZXIgY29kZS5cblxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMM1xudmFyIGVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XG5cbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDQ3XG5pcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSA9IGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzKSB7XG4gIGlmIChyZXMuc3RhdHVzQ29kZSA8IDQwMClcbiAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcblxuICBpZiAoZXJyLnN0YXR1cylcbiAgICByZXMuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXM7XG5cbiAgaWYgKGVudiA9PT0gJ2RldmVsb3BtZW50JylcbiAgICBtc2cgPSAoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKSArICdcXG4nO1xuICBlbHNlXG4gICAgLy9YWFggZ2V0IHRoaXMgZnJvbSBzdGFuZGFyZCBkaWN0IG9mIGVycm9yIG1lc3NhZ2VzP1xuICAgIG1zZyA9ICdTZXJ2ZXIgZXJyb3IuJztcblxuICBjb25zb2xlLmVycm9yKGVyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKSk7XG5cbiAgaWYgKHJlcy5oZWFkZXJzU2VudClcbiAgICByZXR1cm4gcmVxLnNvY2tldC5kZXN0cm95KCk7XG5cbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIEJ1ZmZlci5ieXRlTGVuZ3RoKG1zZykpO1xuICBpZiAocmVxLm1ldGhvZCA9PT0gJ0hFQUQnKVxuICAgIHJldHVybiByZXMuZW5kKCk7XG4gIHJlcy5lbmQobXNnKTtcbiAgcmV0dXJuO1xufVxuIiwiY2xhc3Mgc2hhcmUuUm91dGVcblxuICBjb25zdHJ1Y3RvcjogKEBhcGksIEBwYXRoLCBAb3B0aW9ucywgQGVuZHBvaW50cykgLT5cbiAgICAjIENoZWNrIGlmIG9wdGlvbnMgd2VyZSBwcm92aWRlZFxuICAgIGlmIG5vdCBAZW5kcG9pbnRzXG4gICAgICBAZW5kcG9pbnRzID0gQG9wdGlvbnNcbiAgICAgIEBvcHRpb25zID0ge31cblxuXG4gIGFkZFRvQXBpOiBkbyAtPlxuICAgIGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddXG5cbiAgICByZXR1cm4gLT5cbiAgICAgIHNlbGYgPSB0aGlzXG5cbiAgICAgICMgVGhyb3cgYW4gZXJyb3IgaWYgYSByb3V0ZSBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIGF0IHRoaXMgcGF0aFxuICAgICAgIyBUT0RPOiBDaGVjayBmb3IgY29sbGlzaW9ucyB3aXRoIHBhdGhzIHRoYXQgZm9sbG93IHNhbWUgcGF0dGVybiB3aXRoIGRpZmZlcmVudCBwYXJhbWV0ZXIgbmFtZXNcbiAgICAgIGlmIF8uY29udGFpbnMgQGFwaS5fY29uZmlnLnBhdGhzLCBAcGF0aFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgYWRkIGEgcm91dGUgYXQgYW4gZXhpc3RpbmcgcGF0aDogI3tAcGF0aH1cIlxuXG4gICAgICAjIE92ZXJyaWRlIHRoZSBkZWZhdWx0IE9QVElPTlMgZW5kcG9pbnQgd2l0aCBvdXIgb3duXG4gICAgICBAZW5kcG9pbnRzID0gXy5leHRlbmQgb3B0aW9uczogQGFwaS5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQsIEBlbmRwb2ludHNcblxuICAgICAgIyBDb25maWd1cmUgZWFjaCBlbmRwb2ludCBvbiB0aGlzIHJvdXRlXG4gICAgICBAX3Jlc29sdmVFbmRwb2ludHMoKVxuICAgICAgQF9jb25maWd1cmVFbmRwb2ludHMoKVxuXG4gICAgICAjIEFkZCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyBwYXRoc1xuICAgICAgQGFwaS5fY29uZmlnLnBhdGhzLnB1c2ggQHBhdGhcblxuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlciBhdmFpbGFibGVNZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcbiAgICAgIHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0IGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKVxuXG4gICAgICAjIFNldHVwIGVuZHBvaW50cyBvbiByb3V0ZVxuICAgICAgZnVsbFBhdGggPSBAYXBpLl9jb25maWcuYXBpUGF0aCArIEBwYXRoXG4gICAgICBfLmVhY2ggYWxsb3dlZE1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXVxuICAgICAgICBKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XG4gICAgICAgICAgIyBBZGQgZnVuY3Rpb24gdG8gZW5kcG9pbnQgY29udGV4dCBmb3IgaW5kaWNhdGluZyBhIHJlc3BvbnNlIGhhcyBiZWVuIGluaXRpYXRlZCBtYW51YWxseVxuICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2VcbiAgICAgICAgICBkb25lRnVuYyA9IC0+XG4gICAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IHRydWVcblxuICAgICAgICAgIGVuZHBvaW50Q29udGV4dCA9XG4gICAgICAgICAgICB1cmxQYXJhbXM6IHJlcS5wYXJhbXNcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiByZXEucXVlcnlcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5XG4gICAgICAgICAgICByZXF1ZXN0OiByZXFcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXNcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgIyBBZGQgZW5kcG9pbnQgY29uZmlnIG9wdGlvbnMgdG8gY29udGV4dFxuICAgICAgICAgIF8uZXh0ZW5kIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblxuICAgICAgICAgICMgUnVuIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsXG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICAjIERvIGV4YWN0bHkgd2hhdCBJcm9uIFJvdXRlciB3b3VsZCBoYXZlIGRvbmUsIHRvIGF2b2lkIGNoYW5naW5nIHRoZSBBUElcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgIGlmIHJlc3BvbnNlSW5pdGlhdGVkXG4gICAgICAgICAgICAjIEVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgcHJvcGVybHkgY29tcGxldGVkXG4gICAgICAgICAgICByZXMuZW5kKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIHJlcy5oZWFkZXJzU2VudFxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXG4gICAgICAgICAgICBlbHNlIGlmIHJlc3BvbnNlRGF0YSBpcyBudWxsIG9yIHJlc3BvbnNlRGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IHJldHVybiBudWxsIG9yIHVuZGVmaW5lZCBmcm9tIGFuIGVuZHBvaW50OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxuXG4gICAgICAgICAgIyBHZW5lcmF0ZSBhbmQgcmV0dXJuIHRoZSBodHRwIHJlc3BvbnNlLCBoYW5kbGluZyB0aGUgZGlmZmVyZW50IGVuZHBvaW50IHJlc3BvbnNlIHR5cGVzXG4gICAgICAgICAgaWYgcmVzcG9uc2VEYXRhLmJvZHkgYW5kIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSBvciByZXNwb25zZURhdGEuaGVhZGVycylcbiAgICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YVxuXG4gICAgICBfLmVhY2ggcmVqZWN0ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgIGhlYWRlcnMgPSAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnNcblxuXG4gICMjI1xuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICAgIGZ1bmN0aW9uXG5cbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgIyMjXG4gIF9yZXNvbHZlRW5kcG9pbnRzOiAtPlxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSAtPlxuICAgICAgaWYgXy5pc0Z1bmN0aW9uKGVuZHBvaW50KVxuICAgICAgICBlbmRwb2ludHNbbWV0aG9kXSA9IHthY3Rpb246IGVuZHBvaW50fVxuICAgIHJldHVyblxuXG5cbiAgIyMjXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICAgIGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuXG4gICAgQXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cbiAgICBlbnRpcmUgcm91dGUsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZCBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbFxuICAgIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuXG4gICAgQWZ0ZXIgdGhlIGVuZHBvaW50IGlzIGNvbmZpZ3VyZWQsIGFsbCBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudHMgb2YgYW4gZW5kcG9pbnQgY2FuIGJlXG4gICAgYWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgICByZXNwZWN0aXZlbHkuXG5cbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICMjI1xuICBfY29uZmlndXJlRW5kcG9pbnRzOiAtPlxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCkgLT5cbiAgICAgIGlmIG1ldGhvZCBpc250ICdvcHRpb25zJ1xuICAgICAgICAjIENvbmZpZ3VyZSBhY2NlcHRhYmxlIHJvbGVzXG4gICAgICAgIGlmIG5vdCBAb3B0aW9ucz8ucm9sZVJlcXVpcmVkXG4gICAgICAgICAgQG9wdGlvbnMucm9sZVJlcXVpcmVkID0gW11cbiAgICAgICAgaWYgbm90IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdXG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24gZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBAb3B0aW9ucy5yb2xlUmVxdWlyZWRcbiAgICAgICAgIyBNYWtlIGl0IGVhc2llciB0byBjaGVjayBpZiBubyByb2xlcyBhcmUgcmVxdWlyZWRcbiAgICAgICAgaWYgXy5pc0VtcHR5IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IGZhbHNlXG5cbiAgICAgICAgIyBDb25maWd1cmUgYXV0aCByZXF1aXJlbWVudFxuICAgICAgICBpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgQG9wdGlvbnM/LmF1dGhSZXF1aXJlZCBvciBlbmRwb2ludC5yb2xlUmVxdWlyZWRcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSBmYWxzZVxuXG4gICAgICAgIGlmIEBvcHRpb25zPy5zcGFjZVJlcXVpcmVkXG4gICAgICAgICAgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCA9IEBvcHRpb25zLnNwYWNlUmVxdWlyZWRcbiAgICAgICAgcmV0dXJuXG4gICAgLCB0aGlzXG4gICAgcmV0dXJuXG5cblxuICAjIyNcbiAgICBBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG5cbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgIyMjXG4gIF9jYWxsRW5kcG9pbnQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuICAgICMgQ2FsbCB0aGUgZW5kcG9pbnQgaWYgYXV0aGVudGljYXRpb24gZG9lc24ndCBmYWlsXG4gICAgaWYgQF9hdXRoQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgaWYgQF9yb2xlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICBpZiBAX3NwYWNlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICAgICNlbmRwb2ludC5hY3Rpb24uY2FsbCBlbmRwb2ludENvbnRleHRcbiAgICAgICAgICBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uXG4gICAgICAgICAgICBpc1NpbXVsYXRpb246IHRydWUsXG4gICAgICAgICAgICB1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXG4gICAgICAgICAgICBjb25uZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgcmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcbiAgICAgICBcbiAgICAgICAgICByZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUgaW52b2NhdGlvbiwgLT5cbiAgICAgICAgICAgIHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzXG4gICAgICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLid9XG4gICAgICBlbHNlXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwM1xuICAgICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nfVxuICAgIGVsc2VcbiAgICAgIHN0YXR1c0NvZGU6IDQwMVxuICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLid9XG5cblxuICAjIyNcbiAgICBBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG5cbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gICAgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG5cbiAgICBAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG4gICMjI1xuICBfYXV0aEFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWRcbiAgICAgIEBfYXV0aGVudGljYXRlIGVuZHBvaW50Q29udGV4dFxuICAgIGVsc2UgdHJ1ZVxuXG5cbiAgIyMjXG4gICAgVmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcblxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cblxuICAgIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAjIyNcbiAgX2F1dGhlbnRpY2F0ZTogKGVuZHBvaW50Q29udGV4dCkgLT5cbiAgICAjIEdldCBhdXRoIGluZm9cbiAgICBhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcblxuICAgICMgR2V0IHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgaWYgYXV0aD8udXNlcklkIGFuZCBhdXRoPy50b2tlbiBhbmQgbm90IGF1dGg/LnVzZXJcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9XG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWRcbiAgICAgIHVzZXJTZWxlY3RvcltAYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuXG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSB1c2VyU2VsZWN0b3JcblxuICAgICMgQXR0YWNoIHRoZSB1c2VyIGFuZCB0aGVpciBJRCB0byB0aGUgY29udGV4dCBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICBpZiBhdXRoPy51c2VyXG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlclxuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWRcbiAgICAgIHRydWVcbiAgICBlbHNlIGZhbHNlXG5cbiAgIyMjXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcblxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cblxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgIyMjXG4gIF9zcGFjZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5zcGFjZVJlcXVpcmVkXG4gICAgICBhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcbiAgICAgIGlmIGF1dGg/LnNwYWNlSWRcbiAgICAgICAgc3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoLnVzZXJJZCwgc3BhY2U6YXV0aC5zcGFjZUlkfSkuY291bnQoKVxuICAgICAgICBpZiBzcGFjZV91c2Vyc19jb3VudFxuICAgICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKVxuICAgICAgICAgICMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xuICAgICAgICAgIGlmIHNwYWNlIGFuZCBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCk+PTBcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuXG4gICMjI1xuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG5cbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG5cbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICAgICAgICAgICAgIGVuZHBvaW50XG4gICMjI1xuICBfcm9sZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5yb2xlUmVxdWlyZWRcbiAgICAgIGlmIF8uaXNFbXB0eSBfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB0cnVlXG5cblxuICAjIyNcbiAgICBSZXNwb25kIHRvIGFuIEhUVFAgcmVxdWVzdFxuICAjIyNcbiAgX3Jlc3BvbmQ6IChyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZT0yMDAsIGhlYWRlcnM9e30pIC0+XG4gICAgIyBPdmVycmlkZSBhbnkgZGVmYXVsdCBoZWFkZXJzIHRoYXQgaGF2ZSBiZWVuIHByb3ZpZGVkIChrZXlzIGFyZSBub3JtYWxpemVkIHRvIGJlIGNhc2UgaW5zZW5zaXRpdmUpXG4gICAgIyBUT0RPOiBDb25zaWRlciBvbmx5IGxvd2VyY2FzaW5nIHRoZSBoZWFkZXIga2V5cyB3ZSBuZWVkIG5vcm1hbGl6ZWQsIGxpa2UgQ29udGVudC1UeXBlXG4gICAgZGVmYXVsdEhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgQGFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzXG4gICAgaGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBoZWFkZXJzXG4gICAgaGVhZGVycyA9IF8uZXh0ZW5kIGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzXG5cbiAgICAjIFByZXBhcmUgSlNPTiBib2R5IGZvciByZXNwb25zZSB3aGVuIENvbnRlbnQtVHlwZSBpbmRpY2F0ZXMgSlNPTiB0eXBlXG4gICAgaWYgaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pIGlzbnQgbnVsbFxuICAgICAgaWYgQGFwaS5fY29uZmlnLnByZXR0eUpzb25cbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHksIHVuZGVmaW5lZCwgMlxuICAgICAgZWxzZVxuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keVxuXG4gICAgIyBTZW5kIHJlc3BvbnNlXG4gICAgc2VuZFJlc3BvbnNlID0gLT5cbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCBzdGF0dXNDb2RlLCBoZWFkZXJzXG4gICAgICByZXNwb25zZS53cml0ZSBib2R5XG4gICAgICByZXNwb25zZS5lbmQoKVxuICAgIGlmIHN0YXR1c0NvZGUgaW4gWzQwMSwgNDAzXVxuICAgICAgIyBIYWNrZXJzIGNhbiBtZWFzdXJlIHRoZSByZXNwb25zZSB0aW1lIHRvIGRldGVybWluZSB0aGluZ3MgbGlrZSB3aGV0aGVyIHRoZSA0MDEgcmVzcG9uc2Ugd2FzIFxuICAgICAgIyBjYXVzZWQgYnkgYmFkIHVzZXIgaWQgdnMgYmFkIHBhc3N3b3JkLlxuICAgICAgIyBJbiBkb2luZyBzbywgdGhleSBjYW4gZmlyc3Qgc2NhbiBmb3IgdmFsaWQgdXNlciBpZHMgcmVnYXJkbGVzcyBvZiB2YWxpZCBwYXNzd29yZHMuXG4gICAgICAjIERlbGF5IGJ5IGEgcmFuZG9tIGFtb3VudCB0byByZWR1Y2UgdGhlIGFiaWxpdHkgZm9yIGEgaGFja2VyIHRvIGRldGVybWluZSB0aGUgcmVzcG9uc2UgdGltZS5cbiAgICAgICMgU2VlIGh0dHBzOi8vd3d3Lm93YXNwLm9yZy9pbmRleC5waHAvQmxvY2tpbmdfQnJ1dGVfRm9yY2VfQXR0YWNrcyNGaW5kaW5nX090aGVyX0NvdW50ZXJtZWFzdXJlc1xuICAgICAgIyBTZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGltaW5nX2F0dGFja1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDBcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKClcbiAgICAgIGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvXG4gICAgICBNZXRlb3Iuc2V0VGltZW91dCBzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHNcbiAgICBlbHNlXG4gICAgICBzZW5kUmVzcG9uc2UoKVxuXG4gICMjI1xuICAgIFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcbiAgIyMjXG4gIF9sb3dlckNhc2VLZXlzOiAob2JqZWN0KSAtPlxuICAgIF8uY2hhaW4gb2JqZWN0XG4gICAgLnBhaXJzKClcbiAgICAubWFwIChhdHRyKSAtPlxuICAgICAgW2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV1cbiAgICAub2JqZWN0KClcbiAgICAudmFsdWUoKVxuIiwic2hhcmUuUm91dGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJvdXRlKGFwaSwgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzMSkge1xuICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmVuZHBvaW50cyA9IGVuZHBvaW50czE7XG4gICAgaWYgKCF0aGlzLmVuZHBvaW50cykge1xuICAgICAgdGhpcy5lbmRwb2ludHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBSb3V0ZS5wcm90b3R5cGUuYWRkVG9BcGkgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF2YWlsYWJsZU1ldGhvZHM7XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ107XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFsbG93ZWRNZXRob2RzLCBmdWxsUGF0aCwgcmVqZWN0ZWRNZXRob2RzLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoXy5jb250YWlucyh0aGlzLmFwaS5fY29uZmlnLnBhdGhzLCB0aGlzLnBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiBcIiArIHRoaXMucGF0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgb3B0aW9uczogdGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XG4gICAgICB9LCB0aGlzLmVuZHBvaW50cyk7XG4gICAgICB0aGlzLl9yZXNvbHZlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuYXBpLl9jb25maWcucGF0aHMucHVzaCh0aGlzLnBhdGgpO1xuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlcihhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIGZ1bGxQYXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hcGlQYXRoICsgdGhpcy5wYXRoO1xuICAgICAgXy5lYWNoKGFsbG93ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50O1xuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF07XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBkb25lRnVuYywgZW5kcG9pbnRDb250ZXh0LCBlcnJvciwgcmVzcG9uc2VEYXRhLCByZXNwb25zZUluaXRpYXRlZDtcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlO1xuICAgICAgICAgIGRvbmVGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID0ge1xuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeSxcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5LFxuICAgICAgICAgICAgcmVxdWVzdDogcmVxLFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlcyxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfLmV4dGVuZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZUluaXRpYXRlZCkge1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLmhlYWRlcnNTZW50KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VEYXRhID09PSBudWxsIHx8IHJlc3BvbnNlRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlRGF0YS5ib2R5ICYmIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSB8fCByZXNwb25zZURhdGEuaGVhZGVycykpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlamVjdGVkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBoZWFkZXJzLCByZXNwb25zZURhdGE7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCk7XG5cblxuICAvKlxuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICAgIGZ1bmN0aW9uXG4gIFxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc29sdmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbmRwb2ludCkpIHtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50c1ttZXRob2RdID0ge1xuICAgICAgICAgIGFjdGlvbjogZW5kcG9pbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICAgIGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuICBcbiAgICBBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICAgIGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG4gICAgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuICAgIGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG4gICAgcmVzcGVjdGl2ZWx5LlxuICBcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY29uZmlndXJlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kKSB7XG4gICAgICB2YXIgcmVmLCByZWYxLCByZWYyO1xuICAgICAgaWYgKG1ldGhvZCAhPT0gJ29wdGlvbnMnKSB7XG4gICAgICAgIGlmICghKChyZWYgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYucm9sZVJlcXVpcmVkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkKTtcbiAgICAgICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludC5yb2xlUmVxdWlyZWQpKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKCgocmVmMSA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjEuYXV0aFJlcXVpcmVkIDogdm9pZCAwKSB8fCBlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHJlZjIgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYyLnNwYWNlUmVxdWlyZWQgOiB2b2lkIDApIHtcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gdGhpcy5vcHRpb25zLnNwYWNlUmVxdWlyZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIGFuIGVuZHBvaW50IGlmIHJlcXVpcmVkLCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdFxuICBcbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jYWxsRW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGludm9jYXRpb247XG4gICAgaWYgKHRoaXMuX2F1dGhBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgaWYgKHRoaXMuX3JvbGVBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICBpZiAodGhpcy5fc3BhY2VBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb24oe1xuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlKGludm9jYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuICBcbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gICAgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2F1dGhlbnRpY2F0ZShlbmRwb2ludENvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG4gIFxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cbiAgXG4gICAgQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aGVudGljYXRlID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0KSB7XG4gICAgdmFyIGF1dGgsIHVzZXJTZWxlY3RvcjtcbiAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgIGlmICgoYXV0aCAhPSBudWxsID8gYXV0aC51c2VySWQgOiB2b2lkIDApICYmIChhdXRoICE9IG51bGwgPyBhdXRoLnRva2VuIDogdm9pZCAwKSAmJiAhKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkpIHtcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9O1xuICAgICAgdXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkO1xuICAgICAgdXNlclNlbGVjdG9yW3RoaXMuYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuO1xuICAgICAgYXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUodXNlclNlbGVjdG9yKTtcbiAgICB9XG4gICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkge1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXI7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9zcGFjZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBhdXRoLCBzcGFjZSwgc3BhY2VfdXNlcnNfY291bnQ7XG4gICAgaWYgKGVuZHBvaW50LnNwYWNlUmVxdWlyZWQpIHtcbiAgICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC5zcGFjZUlkIDogdm9pZCAwKSB7XG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgdXNlcjogYXV0aC51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IGF1dGguc3BhY2VJZFxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcnNfY291bnQpIHtcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKHNwYWNlICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIGF1dGgudXNlcklkKSA+PSAwKSB7XG4gICAgICAgICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IGF1dGguc3BhY2VJZDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcbiAgXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICAgICAgICAgICAgIGVuZHBvaW50XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcm9sZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgIGlmIChfLmlzRW1wdHkoXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcykpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKlxuICAgIFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzcG9uZCA9IGZ1bmN0aW9uKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlLCBoZWFkZXJzKSB7XG4gICAgdmFyIGRlZmF1bHRIZWFkZXJzLCBkZWxheUluTWlsbGlzZWNvbmRzLCBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcywgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28sIHNlbmRSZXNwb25zZTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PSBudWxsKSB7XG4gICAgICBzdGF0dXNDb2RlID0gMjAwO1xuICAgIH1cbiAgICBpZiAoaGVhZGVycyA9PSBudWxsKSB7XG4gICAgICBoZWFkZXJzID0ge307XG4gICAgfVxuICAgIGRlZmF1bHRIZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyh0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyhoZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gXy5leHRlbmQoZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnMpO1xuICAgIGlmIChoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFwaS5fY29uZmlnLnByZXR0eUpzb24pIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHksIHZvaWQgMCwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuICAgICAgcmVzcG9uc2Uud3JpdGUoYm9keSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZW5kKCk7XG4gICAgfTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAxIHx8IHN0YXR1c0NvZGUgPT09IDQwMykge1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDA7XG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd287XG4gICAgICByZXR1cm4gTWV0ZW9yLnNldFRpbWVvdXQoc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSgpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgUmV0dXJuIHRoZSBvYmplY3Qgd2l0aCBhbGwgb2YgdGhlIGtleXMgY29udmVydGVkIHRvIGxvd2VyY2FzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2xvd2VyQ2FzZUtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gXy5jaGFpbihvYmplY3QpLnBhaXJzKCkubWFwKGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiBbYXR0clswXS50b0xvd2VyQ2FzZSgpLCBhdHRyWzFdXTtcbiAgICB9KS5vYmplY3QoKS52YWx1ZSgpO1xuICB9O1xuXG4gIHJldHVybiBSb3V0ZTtcblxufSkoKTtcbiIsImNsYXNzIEBSZXN0aXZ1c1xuXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cbiAgICBAX3JvdXRlcyA9IFtdXG4gICAgQF9jb25maWcgPVxuICAgICAgcGF0aHM6IFtdXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2VcbiAgICAgIGFwaVBhdGg6ICdhcGkvJ1xuICAgICAgdmVyc2lvbjogbnVsbFxuICAgICAgcHJldHR5SnNvbjogZmFsc2VcbiAgICAgIGF1dGg6XG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJ1xuICAgICAgICB1c2VyOiAtPlxuICAgICAgICAgIGlmIEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXVxuICAgICAgICAgIGlmIEByZXF1ZXN0LnVzZXJJZFxuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IEByZXF1ZXN0LnVzZXJJZH0pXG4gICAgICAgICAgICB1c2VyOiBfdXNlclxuICAgICAgICAgICAgdXNlcklkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXVxuICAgICAgICAgICAgc3BhY2VJZDogQHJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddXG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1c2VySWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddXG4gICAgICAgICAgICBzcGFjZUlkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ11cbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgZGVmYXVsdEhlYWRlcnM6XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIGVuYWJsZUNvcnM6IHRydWVcblxuICAgICMgQ29uZmlndXJlIEFQSSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXG4gICAgXy5leHRlbmQgQF9jb25maWcsIG9wdGlvbnNcblxuICAgIGlmIEBfY29uZmlnLmVuYWJsZUNvcnNcbiAgICAgIGNvcnNIZWFkZXJzID1cbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0J1xuXG4gICAgICBpZiBAX2NvbmZpZy51c2VEZWZhdWx0QXV0aFxuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuJ1xuXG4gICAgICAjIFNldCBkZWZhdWx0IGhlYWRlciB0byBlbmFibGUgQ09SUyBpZiBjb25maWd1cmVkXG4gICAgICBfLmV4dGVuZCBAX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnNcblxuICAgICAgaWYgbm90IEBfY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcbiAgICAgICAgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IC0+XG4gICAgICAgICAgQHJlc3BvbnNlLndyaXRlSGVhZCAyMDAsIGNvcnNIZWFkZXJzXG4gICAgICAgICAgQGRvbmUoKVxuXG4gICAgIyBOb3JtYWxpemUgdGhlIEFQSSBwYXRoXG4gICAgaWYgQF9jb25maWcuYXBpUGF0aFswXSBpcyAnLydcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoLnNsaWNlIDFcbiAgICBpZiBfLmxhc3QoQF9jb25maWcuYXBpUGF0aCkgaXNudCAnLydcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoICsgJy8nXG5cbiAgICAjIFVSTCBwYXRoIHZlcnNpb25pbmcgaXMgdGhlIG9ubHkgdHlwZSBvZiBBUEkgdmVyc2lvbmluZyBjdXJyZW50bHkgYXZhaWxhYmxlLCBzbyBpZiBhIHZlcnNpb24gaXNcbiAgICAjIHByb3ZpZGVkLCBhcHBlbmQgaXQgdG8gdGhlIGJhc2UgcGF0aCBvZiB0aGUgQVBJXG4gICAgaWYgQF9jb25maWcudmVyc2lvblxuICAgICAgQF9jb25maWcuYXBpUGF0aCArPSBAX2NvbmZpZy52ZXJzaW9uICsgJy8nXG5cbiAgICAjIEFkZCBkZWZhdWx0IGxvZ2luIGFuZCBsb2dvdXQgZW5kcG9pbnRzIGlmIGF1dGggaXMgY29uZmlndXJlZFxuICAgIGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXG4gICAgICBAX2luaXRBdXRoKClcbiAgICBlbHNlIGlmIEBfY29uZmlnLnVzZUF1dGhcbiAgICAgIEBfaW5pdEF1dGgoKVxuICAgICAgY29uc29sZS53YXJuICdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgK1xuICAgICAgICAgICdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCdcblxuICAgIHJldHVybiB0aGlzXG5cblxuICAjIyMqXG4gICAgQWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuXG4gICAgQHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuICAgIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgIEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG4gICAgQHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuICAgICAgICBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG4gICAgICAgIGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cbiAgIyMjXG4gIGFkZFJvdXRlOiAocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSAtPlxuICAgICMgQ3JlYXRlIGEgbmV3IHJvdXRlIGFuZCBhZGQgaXQgdG8gb3VyIGxpc3Qgb2YgZXhpc3Rpbmcgcm91dGVzXG4gICAgcm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKVxuICAgIEBfcm91dGVzLnB1c2gocm91dGUpXG5cbiAgICByb3V0ZS5hZGRUb0FwaSgpXG5cbiAgICByZXR1cm4gdGhpc1xuXG5cbiAgIyMjKlxuICAgIEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgIyMjXG4gIGFkZENvbGxlY3Rpb246IChjb2xsZWN0aW9uLCBvcHRpb25zPXt9KSAtPlxuICAgIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ11cbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddXG5cbiAgICAjIEdyYWIgdGhlIHNldCBvZiBlbmRwb2ludHNcbiAgICBpZiBjb2xsZWN0aW9uIGlzIE1ldGVvci51c2Vyc1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IEBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHNcbiAgICBlbHNlXG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF9jb2xsZWN0aW9uRW5kcG9pbnRzXG5cbiAgICAjIEZsYXR0ZW4gdGhlIG9wdGlvbnMgYW5kIHNldCBkZWZhdWx0cyBpZiBuZWNlc3NhcnlcbiAgICBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyBvciB7fVxuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIG9yIHt9XG4gICAgZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIG9yIFtdXG4gICAgIyBVc2UgY29sbGVjdGlvbiBuYW1lIGFzIGRlZmF1bHQgcGF0aFxuICAgIHBhdGggPSBvcHRpb25zLnBhdGggb3IgY29sbGVjdGlvbi5fbmFtZVxuXG4gICAgIyBTZXBhcmF0ZSB0aGUgcmVxdWVzdGVkIGVuZHBvaW50cyBieSB0aGUgcm91dGUgdGhleSBiZWxvbmcgdG8gKG9uZSBmb3Igb3BlcmF0aW5nIG9uIHRoZSBlbnRpcmVcbiAgICAjIGNvbGxlY3Rpb24gYW5kIG9uZSBmb3Igb3BlcmF0aW5nIG9uIGEgc2luZ2xlIGVudGl0eSB3aXRoaW4gdGhlIGNvbGxlY3Rpb24pXG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge31cbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9XG4gICAgaWYgXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgYW5kIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cylcbiAgICAgICMgR2VuZXJhdGUgYWxsIGVuZHBvaW50cyBvbiB0aGlzIGNvbGxlY3Rpb25cbiAgICAgIF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICAjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcbiAgICAgICAgaWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cbiAgICAgICAgICBfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG4gICAgICAgIGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG4gICAgICAgIHJldHVyblxuICAgICAgLCB0aGlzXG4gICAgZWxzZVxuICAgICAgIyBHZW5lcmF0ZSBhbnkgZW5kcG9pbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIGV4cGxpY2l0bHkgZXhjbHVkZWRcbiAgICAgIF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBpZiBtZXRob2Qgbm90IGluIGV4Y2x1ZGVkRW5kcG9pbnRzIGFuZCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSBpc250IGZhbHNlXG4gICAgICAgICAgIyBDb25maWd1cmUgZW5kcG9pbnQgYW5kIG1hcCB0byBpdCdzIGh0dHAgbWV0aG9kXG4gICAgICAgICAgIyBUT0RPOiBDb25zaWRlciBwcmVkZWZpbmluZyBhIG1hcCBvZiBtZXRob2RzIHRvIHRoZWlyIGh0dHAgbWV0aG9kIHR5cGUgKGUuZy4sIGdldEFsbDogZ2V0KVxuICAgICAgICAgIGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdXG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge31cbiAgICAgICAgICBfLmVhY2ggY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIChhY3Rpb24sIG1ldGhvZFR5cGUpIC0+XG4gICAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPVxuICAgICAgICAgICAgICBfLmNoYWluIGFjdGlvblxuICAgICAgICAgICAgICAuY2xvbmUoKVxuICAgICAgICAgICAgICAuZXh0ZW5kIGVuZHBvaW50T3B0aW9uc1xuICAgICAgICAgICAgICAudmFsdWUoKVxuICAgICAgICAgICMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xuICAgICAgICAgIGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXG4gICAgICAgICAgICBfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuICAgICAgICAgIGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuICAgICAgICAgIHJldHVyblxuICAgICAgLCB0aGlzXG5cbiAgICAjIEFkZCB0aGUgcm91dGVzIHRvIHRoZSBBUElcbiAgICBAYWRkUm91dGUgcGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHNcbiAgICBAYWRkUm91dGUgXCIje3BhdGh9LzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzXG5cbiAgICByZXR1cm4gdGhpc1xuXG5cbiAgIyMjKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuICAjIyNcbiAgX2NvbGxlY3Rpb25FbmRwb2ludHM6XG4gICAgZ2V0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIHNlbGVjdG9yXG4gICAgICAgICAgaWYgZW50aXR5XG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiAgICBwdXQ6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgcHV0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgJHNldDogQGJvZHlQYXJhbXNcbiAgICAgICAgICBpZiBlbnRpdHlJc1VwZGF0ZWRcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiAgICBkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZGVsZXRlOlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiAgICBwb3N0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIHBvc3Q6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcbiAgICAgICAgICAgIEBib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkXG4gICAgICAgICAgZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxuICAgICAgICAgIGlmIGVudGl0eVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnfVxuICAgIGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBnZXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBzZWxlY3RvciA9IHt9XG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpXG4gICAgICAgICAgaWYgZW50aXRpZXNcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ31cblxuXG4gICMjIypcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXG4gICMjI1xuICBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHM6XG4gICAgZ2V0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcbiAgICAgICAgICBpZiBlbnRpdHlcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuICAgIHB1dDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBwdXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBAdXJsUGFyYW1zLmlkLCAkc2V0OiBwcm9maWxlOiBAYm9keVBhcmFtc1xuICAgICAgICAgIGlmIGVudGl0eUlzVXBkYXRlZFxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxuICAgICAgICAgICAge3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cbiAgICBkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZGVsZXRlOlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgaWYgY29sbGVjdGlvbi5yZW1vdmUgQHVybFBhcmFtcy5pZFxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cbiAgICBwb3N0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIHBvc3Q6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICAjIENyZWF0ZSBhIG5ldyB1c2VyIGFjY291bnRcbiAgICAgICAgICBlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIgQGJvZHlQYXJhbXNcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWQsIGZpZWxkczogcHJvZmlsZTogMVxuICAgICAgICAgIGlmIGVudGl0eVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgIHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnfVxuICAgIGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBnZXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwgZmllbGRzOiBwcm9maWxlOiAxKS5mZXRjaCgpXG4gICAgICAgICAgaWYgZW50aXRpZXNcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnfVxuXG5cbiAgIyMjXG4gICAgQWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuICAjIyNcbiAgX2luaXRBdXRoOiAtPlxuICAgIHNlbGYgPSB0aGlzXG4gICAgIyMjXG4gICAgICBBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG5cbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgIyMjXG4gICAgQGFkZFJvdXRlICdsb2dpbicsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSxcbiAgICAgIHBvc3Q6IC0+XG4gICAgICAgICMgR3JhYiB0aGUgdXNlcm5hbWUgb3IgZW1haWwgdGhhdCB0aGUgdXNlciBpcyBsb2dnaW5nIGluIHdpdGhcbiAgICAgICAgdXNlciA9IHt9XG4gICAgICAgIGlmIEBib2R5UGFyYW1zLnVzZXJcbiAgICAgICAgICBpZiBAYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSBpcyAtMVxuICAgICAgICAgICAgdXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMudXNlclxuICAgICAgICBlbHNlIGlmIEBib2R5UGFyYW1zLnVzZXJuYW1lXG4gICAgICAgICAgdXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJuYW1lXG4gICAgICAgIGVsc2UgaWYgQGJvZHlQYXJhbXMuZW1haWxcbiAgICAgICAgICB1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMuZW1haWxcblxuICAgICAgICAjIFRyeSB0byBsb2cgdGhlIHVzZXIgaW50byB0aGUgdXNlcidzIGFjY291bnQgKGlmIHN1Y2Nlc3NmdWwgd2UnbGwgZ2V0IGFuIGF1dGggdG9rZW4gYmFjaylcbiAgICAgICAgdHJ5XG4gICAgICAgICAgYXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQgdXNlciwgQGJvZHlQYXJhbXMucGFzc3dvcmRcbiAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuICAgICAgICAgIHJldHVybiB7fSA9XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yXG4gICAgICAgICAgICBib2R5OiBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6IGUucmVhc29uXG5cbiAgICAgICAgIyBHZXQgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxuICAgICAgICAjIFRPRE86IENvbnNpZGVyIHJldHVybmluZyB0aGUgdXNlciBpbiBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKCksIGluc3RlYWQgb2YgZmV0Y2hpbmcgaXQgYWdhaW4gaGVyZVxuICAgICAgICBpZiBhdXRoLnVzZXJJZCBhbmQgYXV0aC5hdXRoVG9rZW5cbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9XG4gICAgICAgICAgc2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGguYXV0aFRva2VuXG4gICAgICAgICAgQHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXG4gICAgICAgICAgICBzZWFyY2hRdWVyeVxuICAgICAgICAgIEB1c2VySWQgPSBAdXNlcj8uX2lkXG5cbiAgICAgICAgcmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGF1dGh9XG5cbiAgICAgICAgIyBDYWxsIHRoZSBsb2dpbiBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuICAgICAgICBleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbj8uY2FsbCh0aGlzKVxuICAgICAgICBpZiBleHRyYURhdGE/XG4gICAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxuXG4gICAgICAgIHJlc3BvbnNlXG5cbiAgICBsb2dvdXQgPSAtPlxuICAgICAgIyBSZW1vdmUgdGhlIGdpdmVuIGF1dGggdG9rZW4gZnJvbSB0aGUgdXNlcidzIGFjY291bnRcbiAgICAgIGF1dGhUb2tlbiA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoVG9rZW5cbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlblxuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mICcuJ1xuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgMCwgaW5kZXhcbiAgICAgIHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgaW5kZXggKyAxXG4gICAgICB0b2tlblRvUmVtb3ZlID0ge31cbiAgICAgIHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW5cbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge31cbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlXG4gICAgICBNZXRlb3IudXNlcnMudXBkYXRlIEB1c2VyLl9pZCwgeyRwdWxsOiB0b2tlblJlbW92YWxRdWVyeX1cblxuICAgICAgcmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHttZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISd9fVxuXG4gICAgICAjIENhbGwgdGhlIGxvZ291dCBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuICAgICAgZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0Py5jYWxsKHRoaXMpXG4gICAgICBpZiBleHRyYURhdGE/XG4gICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtleHRyYTogZXh0cmFEYXRhfSlcblxuICAgICAgcmVzcG9uc2VcblxuICAgICMjI1xuICAgICAgQWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcblxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICMjI1xuICAgIEBhZGRSb3V0ZSAnbG9nb3V0Jywge2F1dGhSZXF1aXJlZDogdHJ1ZX0sXG4gICAgICBnZXQ6IC0+XG4gICAgICAgIGNvbnNvbGUud2FybiBcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCJcbiAgICAgICAgY29uc29sZS53YXJuIFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiXG4gICAgICAgIHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKVxuICAgICAgcG9zdDogbG9nb3V0XG5cblJlc3RpdnVzID0gQFJlc3RpdnVzXG4iLCJ2YXIgUmVzdGl2dXMsXG4gIGluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxudGhpcy5SZXN0aXZ1cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUmVzdGl2dXMob3B0aW9ucykge1xuICAgIHZhciBjb3JzSGVhZGVycztcbiAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcbiAgICB0aGlzLl9jb25maWcgPSB7XG4gICAgICBwYXRoczogW10sXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2UsXG4gICAgICBhcGlQYXRoOiAnYXBpLycsXG4gICAgICB2ZXJzaW9uOiBudWxsLFxuICAgICAgcHJldHR5SnNvbjogZmFsc2UsXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJyxcbiAgICAgICAgdXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF91c2VyLCB0b2tlbjtcbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddKSB7XG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LnVzZXJJZCkge1xuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnJlcXVlc3QudXNlcklkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXI6IF91c2VyLFxuICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSxcbiAgICAgICAgICAgICAgc3BhY2VJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSxcbiAgICAgICAgICAgICAgc3BhY2VJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBlbmFibGVDb3JzOiB0cnVlXG4gICAgfTtcbiAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcsIG9wdGlvbnMpO1xuICAgIGlmICh0aGlzLl9jb25maWcuZW5hYmxlQ29ycykge1xuICAgICAgY29yc0hlYWRlcnMgPSB7XG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQnXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuJztcbiAgICAgIH1cbiAgICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnMpO1xuICAgICAgaWYgKCF0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCkge1xuICAgICAgICB0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2Uud3JpdGVIZWFkKDIwMCwgY29yc0hlYWRlcnMpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5hcGlQYXRoWzBdID09PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGguc2xpY2UoMSk7XG4gICAgfVxuICAgIGlmIChfLmxhc3QodGhpcy5fY29uZmlnLmFwaVBhdGgpICE9PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGggKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudmVyc2lvbikge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggKz0gdGhpcy5fY29uZmlnLnZlcnNpb24gKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jb25maWcudXNlQXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICAgIGNvbnNvbGUud2FybignV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICsgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgICBBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG4gIFxuICAgIEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcbiAgICBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBSb3V0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICBAcGFyYW0gb3B0aW9ucy5hdXRoUmVxdWlyZWQge0Jvb2xlYW59IFRoZSBkZWZhdWx0IGF1dGggcmVxdWlyZW1lbnQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIGVuZHBvaW50cyB7T2JqZWN0fSBBIHNldCBvZiBlbmRwb2ludHMgYXZhaWxhYmxlIG9uIHRoZSBuZXcgcm91dGUgKGdldCwgcG9zdCwgcHV0LCBwYXRjaCwgZGVsZXRlLCBvcHRpb25zKVxuICAgIEBwYXJhbSBlbmRwb2ludHMuPG1ldGhvZD4ge0Z1bmN0aW9uIG9yIE9iamVjdH0gSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgYWxsIGRlZmF1bHQgcm91dGVcbiAgICAgICAgY29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxuICAgICAgICBhbmQgYWxsIG90aGVyIHJvdXRlIGNvbmZpZyBvcHRpb25zIGF2YWlsYWJsZS4gQW4gYGFjdGlvbmAgbXVzdCBiZSBwcm92aWRlZCB3aXRoIHRoZSBvYmplY3QuXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5hZGRSb3V0ZSA9IGZ1bmN0aW9uKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykge1xuICAgIHZhciByb3V0ZTtcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpO1xuICAgIHRoaXMuX3JvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICByb3V0ZS5hZGRUb0FwaSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAgR2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuYWRkQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbkVuZHBvaW50cywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24sIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kcywgbWV0aG9kc09uQ29sbGVjdGlvbiwgcGF0aCwgcm91dGVPcHRpb25zO1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXTtcbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddO1xuICAgIGlmIChjb2xsZWN0aW9uID09PSBNZXRlb3IudXNlcnMpIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX2NvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfVxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIHx8IHt9O1xuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIHx8IHt9O1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzID0gb3B0aW9ucy5leGNsdWRlZEVuZHBvaW50cyB8fCBbXTtcbiAgICBwYXRoID0gb3B0aW9ucy5wYXRoIHx8IGNvbGxlY3Rpb24uX25hbWU7XG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgJiYgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKSkge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBjb25maWd1cmVkRW5kcG9pbnQsIGVuZHBvaW50T3B0aW9ucztcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kKSA8IDAgJiYgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF07XG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge307XG4gICAgICAgICAgXy5lYWNoKGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCBmdW5jdGlvbihhY3Rpb24sIG1ldGhvZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPSBfLmNoYWluKGFjdGlvbikuY2xvbmUoKS5leHRlbmQoZW5kcG9pbnRPcHRpb25zKS52YWx1ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICAgIHRoaXMuYWRkUm91dGUocGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMpO1xuICAgIHRoaXMuYWRkUm91dGUocGF0aCArIFwiLzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX2NvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZCwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3Rvciwge1xuICAgICAgICAgICAgICAkc2V0OiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQpO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYm9keVBhcmFtcy5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5O1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkO1xuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHRoaXMudXJsUGFyYW1zLmlkKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcztcbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIEFkZCAvbG9naW4gYW5kIC9sb2dvdXQgZW5kcG9pbnRzIHRvIHRoZSBBUElcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl9pbml0QXV0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2dvdXQsIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG5cbiAgICAvKlxuICAgICAgQWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICB0aGlzLmFkZFJvdXRlKCdsb2dpbicsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2VcbiAgICB9LCB7XG4gICAgICBwb3N0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF1dGgsIGUsIGV4dHJhRGF0YSwgcmVmLCByZWYxLCByZXNwb25zZSwgc2VhcmNoUXVlcnksIHVzZXI7XG4gICAgICAgIHVzZXIgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWUpIHtcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy5lbWFpbCkge1xuICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMuZW1haWw7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCh1c2VyLCB0aGlzLmJvZHlQYXJhbXMucGFzc3dvcmQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGUucmVhc29uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXV0aC51c2VySWQgJiYgYXV0aC5hdXRoVG9rZW4pIHtcbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5W3NlbGYuX2NvbmZpZy5hdXRoLnRva2VuXSA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoLmF1dGhUb2tlbik7XG4gICAgICAgICAgdGhpcy51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXG4gICAgICAgICAgfSwgc2VhcmNoUXVlcnkpO1xuICAgICAgICAgIHRoaXMudXNlcklkID0gKHJlZiA9IHRoaXMudXNlcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgZGF0YTogYXV0aFxuICAgICAgICB9O1xuICAgICAgICBleHRyYURhdGEgPSAocmVmMSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluKSAhPSBudWxsID8gcmVmMS5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF1dGhUb2tlbiwgZXh0cmFEYXRhLCBoYXNoZWRUb2tlbiwgaW5kZXgsIHJlZiwgcmVzcG9uc2UsIHRva2VuRmllbGROYW1lLCB0b2tlbkxvY2F0aW9uLCB0b2tlblBhdGgsIHRva2VuUmVtb3ZhbFF1ZXJ5LCB0b2tlblRvUmVtb3ZlO1xuICAgICAgYXV0aFRva2VuID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddO1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlbjtcbiAgICAgIGluZGV4ID0gdG9rZW5Mb2NhdGlvbi5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgICAgdG9rZW5Ub1JlbW92ZSA9IHt9O1xuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlbjtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge307XG4gICAgICB0b2tlblJlbW92YWxRdWVyeVt0b2tlblBhdGhdID0gdG9rZW5Ub1JlbW92ZTtcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUodGhpcy51c2VyLl9pZCwge1xuICAgICAgICAkcHVsbDogdG9rZW5SZW1vdmFsUXVlcnlcbiAgICAgIH0pO1xuICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbWVzc2FnZTogJ1lvdVxcJ3ZlIGJlZW4gbG9nZ2VkIG91dCEnXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBleHRyYURhdGEgPSAocmVmID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0KSAhPSBudWxsID8gcmVmLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICBBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLmFkZFJvdXRlKCdsb2dvdXQnLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWVcbiAgICB9LCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiKTtcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHBvc3Q6IGxvZ291dFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBSZXN0aXZ1cztcblxufSkoKTtcblxuUmVzdGl2dXMgPSB0aGlzLlJlc3RpdnVzO1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgQEFQSSA9IG5ldyBSZXN0aXZ1c1xuICAgICAgICBhcGlQYXRoOiAnc3RlZWRvcy9hcGkvJyxcbiAgICAgICAgdXNlRGVmYXVsdEF1dGg6IHRydWVcbiAgICAgICAgcHJldHR5SnNvbjogdHJ1ZVxuICAgICAgICBlbmFibGVDb3JzOiBmYWxzZVxuICAgICAgICBkZWZhdWx0SGVhZGVyczpcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICB0aGlzLkFQSSA9IG5ldyBSZXN0aXZ1cyh7XG4gICAgYXBpUGF0aDogJ3N0ZWVkb3MvYXBpLycsXG4gICAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gICAgcHJldHR5SnNvbjogdHJ1ZSxcbiAgICBlbmFibGVDb3JzOiBmYWxzZSxcbiAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH1cbiAgfSk7XG59XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRBUEkuYWRkQ29sbGVjdGlvbiBkYi5zcGFjZV91c2VycywgXG5cdFx0ZXhjbHVkZWRFbmRwb2ludHM6IFtdXG5cdFx0cm91dGVPcHRpb25zOlxuXHRcdFx0YXV0aFJlcXVpcmVkOiB0cnVlXG5cdFx0XHRzcGFjZVJlcXVpcmVkOiB0cnVlIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBBUEkuYWRkQ29sbGVjdGlvbihkYi5zcGFjZV91c2Vycywge1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXSxcbiAgICByb3V0ZU9wdGlvbnM6IHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHNwYWNlUmVxdWlyZWQ6IHRydWVcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRBUEkuYWRkQ29sbGVjdGlvbiBkYi5vcmdhbml6YXRpb25zLCBcblx0XHRleGNsdWRlZEVuZHBvaW50czogW11cblx0XHRyb3V0ZU9wdGlvbnM6XG5cdFx0XHRhdXRoUmVxdWlyZWQ6IHRydWVcblx0XHRcdHNwYWNlUmVxdWlyZWQ6IHRydWUiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFQSS5hZGRDb2xsZWN0aW9uKGRiLm9yZ2FuaXphdGlvbnMsIHtcbiAgICBleGNsdWRlZEVuZHBvaW50czogW10sXG4gICAgcm91dGVPcHRpb25zOiB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWUsXG4gICAgICBzcGFjZVJlcXVpcmVkOiB0cnVlXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XG4gIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzXG4gIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxuICAgIGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX0sIChlcnIpIC0+XG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG5cbiAgICAgICAgaWYgW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKClcblxuICAgICAgICBib2R5ID0gcmVxLmJvZHlcbiAgICAgICAgdHJ5XG4gICAgICAgICAgaWYgYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIklFXCIgb3IgYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIm5vZGVcIilcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKVxuICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgY29uc29sZS5lcnJvcihmaWxlbmFtZSlcbiAgICAgICAgICBjb25zb2xlLmVycm9yIGVcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpXG5cbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxuICAgICAgICBcbiAgICAgICAgaWYgYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ293bmVyX25hbWUnXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ2luc3RhbmNlJ10gICYmIGJvZHlbJ2FwcHJvdmUnXVxuICAgICAgICAgIHBhcmVudCA9ICcnXG4gICAgICAgICAgbWV0YWRhdGEgPSB7b3duZXI6Ym9keVsnb3duZXInXSwgb3duZXJfbmFtZTpib2R5Wydvd25lcl9uYW1lJ10sIHNwYWNlOmJvZHlbJ3NwYWNlJ10sIGluc3RhbmNlOmJvZHlbJ2luc3RhbmNlJ10sIGFwcHJvdmU6IGJvZHlbJ2FwcHJvdmUnXSwgY3VycmVudDogdHJ1ZX1cblxuICAgICAgICAgIGlmIGJvZHlbXCJpc19wcml2YXRlXCJdICYmIGJvZHlbXCJpc19wcml2YXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gXCJ0cnVlXCJcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSB0cnVlXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IGZhbHNlXG5cbiAgICAgICAgICBpZiBib2R5WydtYWluJ10gPT0gXCJ0cnVlXCJcbiAgICAgICAgICAgIG1ldGFkYXRhLm1haW4gPSB0cnVlXG5cbiAgICAgICAgICBpZiBib2R5Wydpc0FkZFZlcnNpb24nXSAmJiBib2R5WydwYXJlbnQnXVxuICAgICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J11cbiAgICAgICAgICAjIGVsc2VcbiAgICAgICAgICAjICAgY29sbGVjdGlvbi5maW5kKHsnbWV0YWRhdGEuaW5zdGFuY2UnOiBib2R5WydpbnN0YW5jZSddLCAnbWV0YWRhdGEuY3VycmVudCcgOiB0cnVlfSkuZm9yRWFjaCAoYykgLT5cbiAgICAgICAgICAjICAgICBpZiBjLm5hbWUoKSA9PSBmaWxlbmFtZVxuICAgICAgICAgICMgICAgICAgcGFyZW50ID0gYy5tZXRhZGF0YS5wYXJlbnRcblxuICAgICAgICAgIGlmIHBhcmVudFxuICAgICAgICAgICAgciA9IGNvbGxlY3Rpb24udXBkYXRlKHsnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LCAnbWV0YWRhdGEuY3VycmVudCcgOiB0cnVlfSwgeyR1bnNldCA6IHsnbWV0YWRhdGEuY3VycmVudCcgOiAnJ319KVxuICAgICAgICAgICAgaWYgclxuICAgICAgICAgICAgICBtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgICAgICAgaWYgYm9keVsnbG9ja2VkX2J5J10gJiYgYm9keVsnbG9ja2VkX2J5X25hbWUnXVxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieSA9IGJvZHlbJ2xvY2tlZF9ieSddXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5X25hbWUgPSBib2R5Wydsb2NrZWRfYnlfbmFtZSddXG5cbiAgICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXG4gICAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG5cbiAgICAgICAgICAgICAgIyDliKDpmaTlkIzkuIDkuKrnlLPor7fljZXlkIzkuIDkuKrmraXpqqTlkIzkuIDkuKrkurrkuIrkvKDnmoTph43lpI3nmoTmlofku7ZcbiAgICAgICAgICAgICAgaWYgYm9keVtcIm92ZXJ3cml0ZVwiXSAmJiBib2R5W1wib3ZlcndyaXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLnJlbW92ZSh7J21ldGFkYXRhLmluc3RhbmNlJzogYm9keVsnaW5zdGFuY2UnXSwgJ21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCwgJ21ldGFkYXRhLm93bmVyJzogYm9keVsnb3duZXInXSwgJ21ldGFkYXRhLmFwcHJvdmUnOiBib2R5WydhcHByb3ZlJ10sICdtZXRhZGF0YS5jdXJyZW50JzogeyRuZTogdHJ1ZX19KVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxuICAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcbiAgICAgICAgICAgIGZpbGVPYmoudXBkYXRlKHskc2V0OiB7J21ldGFkYXRhLnBhcmVudCcgOiBmaWxlT2JqLl9pZH19KVxuXG4gICAgICAgICMg5YW85a656ICB54mI5pysXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuICAgICAgICByZXR1cm5cblxuICAgICAgbmV3RmlsZS5vbmNlICdzdG9yZWQnLCAoc3RvcmVOYW1lKS0+XG4gICAgICAgIHNpemUgPSBuZXdGaWxlLm9yaWdpbmFsLnNpemVcbiAgICAgICAgaWYgIXNpemVcbiAgICAgICAgICBzaXplID0gMTAyNFxuICAgICAgICByZXNwID1cbiAgICAgICAgICB2ZXJzaW9uX2lkOiBuZXdGaWxlLl9pZCxcbiAgICAgICAgICBzaXplOiBzaXplXG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgICByZXR1cm5cbiAgICBlbHNlXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVyblxuXG5cbkpzb25Sb3V0ZXMuYWRkIFwiZGVsZXRlXCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XG5cbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXNcblxuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xuICBpZiBpZFxuICAgIGZpbGUgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IGlkIH0pXG4gICAgaWYgZmlsZVxuICAgICAgZmlsZS5yZW1vdmUoKVxuICAgICAgcmVzcCA9IHtcbiAgICAgICAgc3RhdHVzOiBcIk9LXCJcbiAgICAgIH1cbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgcmV0dXJuXG5cbiAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gIHJlcy5lbmQoKTtcblxuXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XG5cbiAgcmVzLnN0YXR1c0NvZGUgPSAzMDI7XG4gIHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2luc3RhbmNlcy9cIikgKyBpZCArIFwiP2Rvd25sb2FkPTFcIlxuICByZXMuZW5kKCk7XG5cblxuIyBNZXRlb3IubWV0aG9kc1xuXG4jICAgczNfdXBncmFkZTogKG1pbiwgbWF4KSAtPlxuIyAgICAgY29uc29sZS5sb2coXCIvczMvdXBncmFkZVwiKVxuXG4jICAgICBmcyA9IHJlcXVpcmUoJ2ZzJylcbiMgICAgIG1pbWUgPSByZXF1aXJlKCdtaW1lJylcblxuIyAgICAgcm9vdF9wYXRoID0gXCIvbW50L2Zha2VzMy8xMFwiXG4jICAgICBjb25zb2xlLmxvZyhyb290X3BhdGgpXG4jICAgICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlc1xuXG4jICAgICAjIOmBjeWOhmluc3RhbmNlIOaLvOWHuumZhOS7tui3r+W+hCDliLDmnKzlnLDmib7lr7nlupTmlofku7Yg5YiG5Lik56eN5oOF5Ya1IDEuL2ZpbGVuYW1lX3ZlcnNpb25JZCAyLi9maWxlbmFtZe+8m1xuIyAgICAgZGVhbF93aXRoX3ZlcnNpb24gPSAocm9vdF9wYXRoLCBzcGFjZSwgaW5zX2lkLCB2ZXJzaW9uLCBhdHRhY2hfZmlsZW5hbWUpIC0+XG4jICAgICAgIF9yZXYgPSB2ZXJzaW9uLl9yZXZcbiMgICAgICAgaWYgKGNvbGxlY3Rpb24uZmluZCh7XCJfaWRcIjogX3Jldn0pLmNvdW50KCkgPjApXG4jICAgICAgICAgcmV0dXJuXG4jICAgICAgIGNyZWF0ZWRfYnkgPSB2ZXJzaW9uLmNyZWF0ZWRfYnlcbiMgICAgICAgYXBwcm92ZSA9IHZlcnNpb24uYXBwcm92ZVxuIyAgICAgICBmaWxlbmFtZSA9IHZlcnNpb24uZmlsZW5hbWUgfHwgYXR0YWNoX2ZpbGVuYW1lO1xuIyAgICAgICBtaW1lX3R5cGUgPSBtaW1lLmxvb2t1cChmaWxlbmFtZSlcbiMgICAgICAgbmV3X3BhdGggPSByb290X3BhdGggKyBcIi9zcGFjZXMvXCIgKyBzcGFjZSArIFwiL3dvcmtmbG93L1wiICsgaW5zX2lkICsgXCIvXCIgKyBmaWxlbmFtZSArIFwiX1wiICsgX3JldlxuIyAgICAgICBvbGRfcGF0aCA9IHJvb3RfcGF0aCArIFwiL3NwYWNlcy9cIiArIHNwYWNlICsgXCIvd29ya2Zsb3cvXCIgKyBpbnNfaWQgKyBcIi9cIiArIGZpbGVuYW1lXG5cbiMgICAgICAgcmVhZEZpbGUgPSAoZnVsbF9wYXRoKSAtPlxuIyAgICAgICAgIGRhdGEgPSBmcy5yZWFkRmlsZVN5bmMgZnVsbF9wYXRoXG5cbiMgICAgICAgICBpZiBkYXRhXG4jICAgICAgICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiMgICAgICAgICAgIG5ld0ZpbGUuX2lkID0gX3JldjtcbiMgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSB7b3duZXI6Y3JlYXRlZF9ieSwgc3BhY2U6c3BhY2UsIGluc3RhbmNlOmluc19pZCwgYXBwcm92ZTogYXBwcm92ZX07XG4jICAgICAgICAgICBuZXdGaWxlLmF0dGFjaERhdGEgZGF0YSwge3R5cGU6IG1pbWVfdHlwZX1cbiMgICAgICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSlcbiMgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG4jICAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlT2JqLl9pZClcblxuIyAgICAgICB0cnlcbiMgICAgICAgICBuID0gZnMuc3RhdFN5bmMgbmV3X3BhdGhcbiMgICAgICAgICBpZiBuICYmIG4uaXNGaWxlKClcbiMgICAgICAgICAgIHJlYWRGaWxlIG5ld19wYXRoXG4jICAgICAgIGNhdGNoIGVycm9yXG4jICAgICAgICAgdHJ5XG4jICAgICAgICAgICBvbGQgPSBmcy5zdGF0U3luYyBvbGRfcGF0aFxuIyAgICAgICAgICAgaWYgb2xkICYmIG9sZC5pc0ZpbGUoKVxuIyAgICAgICAgICAgICByZWFkRmlsZSBvbGRfcGF0aFxuIyAgICAgICAgIGNhdGNoIGVycm9yXG4jICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZmlsZSBub3QgZm91bmQ6IFwiICsgb2xkX3BhdGgpXG5cblxuIyAgICAgY291bnQgPSBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pLmNvdW50KCk7XG4jICAgICBjb25zb2xlLmxvZyhcImFsbCBpbnN0YW5jZXM6IFwiICsgY291bnQpXG5cbiMgICAgIGIgPSBuZXcgRGF0ZSgpXG5cbiMgICAgIGkgPSBtaW5cbiMgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBza2lwOiBtaW4sIGxpbWl0OiBtYXgtbWlufSkuZm9yRWFjaCAoaW5zKSAtPlxuIyAgICAgICBpID0gaSArIDFcbiMgICAgICAgY29uc29sZS5sb2coaSArIFwiOlwiICsgaW5zLm5hbWUpXG4jICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHNcbiMgICAgICAgc3BhY2UgPSBpbnMuc3BhY2VcbiMgICAgICAgaW5zX2lkID0gaW5zLl9pZFxuIyAgICAgICBhdHRhY2hzLmZvckVhY2ggKGF0dCkgLT5cbiMgICAgICAgICBkZWFsX3dpdGhfdmVyc2lvbiByb290X3BhdGgsIHNwYWNlLCBpbnNfaWQsIGF0dC5jdXJyZW50LCBhdHQuZmlsZW5hbWVcbiMgICAgICAgICBpZiBhdHQuaGlzdG9yeXNcbiMgICAgICAgICAgIGF0dC5oaXN0b3J5cy5mb3JFYWNoIChoaXMpIC0+XG4jICAgICAgICAgICAgIGRlYWxfd2l0aF92ZXJzaW9uIHJvb3RfcGF0aCwgc3BhY2UsIGluc19pZCwgaGlzLCBhdHQuZmlsZW5hbWVcblxuIyAgICAgY29uc29sZS5sb2cobmV3IERhdGUoKSAtIGIpXG5cbiMgICAgIHJldHVybiBcIm9rXCJcbiIsIkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXM7XG4gIHJldHVybiBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBuZXdGaWxlO1xuICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB2YXIgYm9keSwgZSwgZmlsZU9iaiwgZmlsZW5hbWUsIG1ldGFkYXRhLCBwYXJlbnQsIHI7XG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lO1xuICAgICAgICBpZiAoW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSA9IHJlcS5ib2R5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIklFXCIgfHwgYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJub2RlXCIpKSB7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZpbGVuYW1lKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKTtcbiAgICAgICAgaWYgKGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5Wydvd25lcl9uYW1lJ10gJiYgYm9keVsnc3BhY2UnXSAmJiBib2R5WydpbnN0YW5jZSddICYmIGJvZHlbJ2FwcHJvdmUnXSkge1xuICAgICAgICAgIHBhcmVudCA9ICcnO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgb3duZXI6IGJvZHlbJ293bmVyJ10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBib2R5Wydvd25lcl9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogYm9keVsnc3BhY2UnXSxcbiAgICAgICAgICAgIGluc3RhbmNlOiBib2R5WydpbnN0YW5jZSddLFxuICAgICAgICAgICAgYXBwcm92ZTogYm9keVsnYXBwcm92ZSddLFxuICAgICAgICAgICAgY3VycmVudDogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKGJvZHlbXCJpc19wcml2YXRlXCJdICYmIGJvZHlbXCJpc19wcml2YXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5pc19wcml2YXRlID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYm9keVsnbWFpbiddID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgbWV0YWRhdGEubWFpbiA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChib2R5Wydpc0FkZFZlcnNpb24nXSAmJiBib2R5WydwYXJlbnQnXSkge1xuICAgICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIHIgPSBjb2xsZWN0aW9uLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBwYXJlbnQsXG4gICAgICAgICAgICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAkdW5zZXQ6IHtcbiAgICAgICAgICAgICAgICAnbWV0YWRhdGEuY3VycmVudCc6ICcnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgbWV0YWRhdGEucGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgICAgICBpZiAoYm9keVsnbG9ja2VkX2J5J10gJiYgYm9keVsnbG9ja2VkX2J5X25hbWUnXSkge1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieSA9IGJvZHlbJ2xvY2tlZF9ieSddO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieV9uYW1lID0gYm9keVsnbG9ja2VkX2J5X25hbWUnXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgICAgICAgaWYgKGJvZHlbXCJvdmVyd3JpdGVcIl0gJiYgYm9keVtcIm92ZXJ3cml0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHtcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGJvZHlbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLm93bmVyJzogYm9keVsnb3duZXInXSxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5hcHByb3ZlJzogYm9keVsnYXBwcm92ZSddLFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICRuZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgICAgIGZpbGVPYmoudXBkYXRlKHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBmaWxlT2JqLl9pZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXdGaWxlLm9uY2UoJ3N0b3JlZCcsIGZ1bmN0aW9uKHN0b3JlTmFtZSkge1xuICAgICAgICB2YXIgcmVzcCwgc2l6ZTtcbiAgICAgICAgc2l6ZSA9IG5ld0ZpbGUub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgaWYgKCFzaXplKSB7XG4gICAgICAgICAgc2l6ZSA9IDEwMjQ7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcCA9IHtcbiAgICAgICAgICB2ZXJzaW9uX2lkOiBuZXdGaWxlLl9pZCxcbiAgICAgICAgICBzaXplOiBzaXplXG4gICAgICAgIH07XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH1cbiAgfSk7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJkZWxldGVcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGZpbGUsIGlkLCByZXNwO1xuICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlcztcbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcbiAgaWYgKGlkKSB7XG4gICAgZmlsZSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICBfaWQ6IGlkXG4gICAgfSk7XG4gICAgaWYgKGZpbGUpIHtcbiAgICAgIGZpbGUucmVtb3ZlKCk7XG4gICAgICByZXNwID0ge1xuICAgICAgICBzdGF0dXM6IFwiT0tcIlxuICAgICAgfTtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgcmV0dXJuIHJlcy5lbmQoKTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgaWQ7XG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XG4gIHJlcy5zdGF0dXNDb2RlID0gMzAyO1xuICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9pbnN0YW5jZXMvXCIpICsgaWQgKyBcIj9kb3dubG9hZD0xXCIpO1xuICByZXR1cm4gcmVzLmVuZCgpO1xufSk7XG4iLCJKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL3B1c2gvbWVzc2FnZVwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgaWYgcmVxLmJvZHk/LnB1c2hUb3BpYyBhbmQgcmVxLmJvZHkudXNlcklkcyBhbmQgcmVxLmJvZHkuZGF0YVxuICAgICAgICBtZXNzYWdlID0gXG4gICAgICAgICAgICBmcm9tOiBcInN0ZWVkb3NcIlxuICAgICAgICAgICAgcXVlcnk6XG4gICAgICAgICAgICAgICAgYXBwTmFtZTogcmVxLmJvZHkucHVzaFRvcGljXG4gICAgICAgICAgICAgICAgdXNlcklkOiBcbiAgICAgICAgICAgICAgICAgICAgXCIkaW5cIjogdXNlcklkc1xuICAgICAgICBpZiByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGU/XG4gICAgICAgICAgICBtZXNzYWdlW1widGl0bGVcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGVcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5hbGVydD9cbiAgICAgICAgICAgIG1lc3NhZ2VbXCJ0ZXh0XCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydFxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLmJhZGdlP1xuICAgICAgICAgICAgbWVzc2FnZVtcImJhZGdlXCJdID0gcmVxLmJvZHkuZGF0YS5iYWRnZSArIFwiXCJcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5zb3VuZD9cbiAgICAgICAgICAgIG1lc3NhZ2VbXCJzb3VuZFwiXSA9IHJlcS5ib2R5LmRhdGEuc291bmRcbiAgICAgICAgI2lmIHJlcS5ib2R5LmRhdGEuZGF0YT9cbiAgICAgICAgIyAgICBtZXNzYWdlW1wiZGF0YVwiXSA9IHJlcS5ib2R5LmRhdGEuZGF0YVxuICAgICAgICBQdXNoLnNlbmQgbWVzc2FnZVxuXG4gICAgICAgIHJlcy5lbmQoXCJzdWNjZXNzXCIpO1xuXG5cblxuTWV0ZW9yLm1ldGhvZHNcbiAgICBwdXNoU2VuZDogKHRleHQsdGl0bGUsYmFkZ2UsdXNlcklkKSAtPlxuICAgICAgICBpZiAoIXVzZXJJZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgUHVzaC5zZW5kXG4gICAgICAgICAgICBmcm9tOiAnc3RlZWRvcycsXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICAgICAgYmFkZ2U6IGJhZGdlLFxuICAgICAgICAgICAgcXVlcnk6IFxuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXG4gICAgICAgICAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4iLCJKc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL3B1c2gvbWVzc2FnZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgbWVzc2FnZSwgcmVmO1xuICBpZiAoKChyZWYgPSByZXEuYm9keSkgIT0gbnVsbCA/IHJlZi5wdXNoVG9waWMgOiB2b2lkIDApICYmIHJlcS5ib2R5LnVzZXJJZHMgJiYgcmVxLmJvZHkuZGF0YSkge1xuICAgIG1lc3NhZ2UgPSB7XG4gICAgICBmcm9tOiBcInN0ZWVkb3NcIixcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGFwcE5hbWU6IHJlcS5ib2R5LnB1c2hUb3BpYyxcbiAgICAgICAgdXNlcklkOiB7XG4gICAgICAgICAgXCIkaW5cIjogdXNlcklkc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAocmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJ0aXRsZVwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZTtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYWxlcnQgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcInRleHRcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0O1xuICAgIH1cbiAgICBpZiAocmVxLmJvZHkuZGF0YS5iYWRnZSAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1wiYmFkZ2VcIl0gPSByZXEuYm9keS5kYXRhLmJhZGdlICsgXCJcIjtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuc291bmQgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcInNvdW5kXCJdID0gcmVxLmJvZHkuZGF0YS5zb3VuZDtcbiAgICB9XG4gICAgUHVzaC5zZW5kKG1lc3NhZ2UpO1xuICAgIHJldHVybiByZXMuZW5kKFwic3VjY2Vzc1wiKTtcbiAgfVxufSk7XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgcHVzaFNlbmQ6IGZ1bmN0aW9uKHRleHQsIHRpdGxlLCBiYWRnZSwgdXNlcklkKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIFB1c2guc2VuZCh7XG4gICAgICBmcm9tOiAnc3RlZWRvcycsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgYmFkZ2U6IGJhZGdlLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkFsaXl1bl9wdXNoID0ge307XG5cbkFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlID0gKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbiwgY2FsbGJhY2spIC0+XG5cdGlmIG5vdGlmaWNhdGlvbi50aXRsZSBhbmQgbm90aWZpY2F0aW9uLnRleHRcblx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRjb25zb2xlLmxvZyB1c2VyVG9rZW5zXG5cblx0XHRhbGl5dW5Ub2tlbnMgPSBuZXcgQXJyYXlcblx0XHR4aW5nZVRva2VucyA9IG5ldyBBcnJheVxuXHRcdGh1YXdlaVRva2VucyA9IG5ldyBBcnJheVxuXHRcdG1pVG9rZW5zID0gbmV3IEFycmF5XG5cblx0XHR1c2VyVG9rZW5zLmZvckVhY2ggKHVzZXJUb2tlbikgLT5cblx0XHRcdGFyciA9IHVzZXJUb2tlbi5zcGxpdCgnOicpXG5cdFx0XHRpZiBhcnJbMF0gaXMgXCJhbGl5dW5cIlxuXHRcdFx0XHRhbGl5dW5Ub2tlbnMucHVzaCBfLmxhc3QoYXJyKVxuXHRcdFx0ZWxzZSBpZiBhcnJbMF0gaXMgXCJ4aW5nZVwiXG5cdFx0XHRcdHhpbmdlVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcblx0XHRcdGVsc2UgaWYgYXJyWzBdIGlzIFwiaHVhd2VpXCJcblx0XHRcdFx0aHVhd2VpVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcblx0XHRcdGVsc2UgaWYgYXJyWzBdIGlzIFwibWlcIlxuXHRcdFx0XHRtaVRva2Vucy5wdXNoIF8ubGFzdChhcnIpXG5cblx0XHRpZiAhXy5pc0VtcHR5KGFsaXl1blRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5hbGl5dW5cblx0XHRcdEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJhbGl5dW5Ub2tlbnM6ICN7YWxpeXVuVG9rZW5zfVwiXG5cdFx0XHRBTFlQVVNIID0gbmV3IChBTFkuUFVTSCkoXG5cdFx0XHRcdGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYWNjZXNzS2V5SWRcblx0XHRcdFx0c2VjcmV0QWNjZXNzS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uc2VjcmV0QWNjZXNzS2V5XG5cdFx0XHRcdGVuZHBvaW50OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uZW5kcG9pbnRcblx0XHRcdFx0YXBpVmVyc2lvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwaVZlcnNpb24pO1xuXG5cdFx0XHRkYXRhID0gXG5cdFx0XHRcdEFwcEtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwcEtleVxuXHRcdFx0XHRUYXJnZXQ6ICdkZXZpY2UnXG5cdFx0XHRcdFRhcmdldFZhbHVlOiBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKVxuXHRcdFx0XHRUaXRsZTogbm90aWZpY2F0aW9uLnRpdGxlXG5cdFx0XHRcdFN1bW1hcnk6IG5vdGlmaWNhdGlvbi50ZXh0XG5cblx0XHRcdEFMWVBVU0gucHVzaE5vdGljZVRvQW5kcm9pZCBkYXRhLCBjYWxsYmFja1xuXG5cdFx0aWYgIV8uaXNFbXB0eSh4aW5nZVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy54aW5nZVxuXHRcdFx0WGluZ2UgPSByZXF1aXJlKCd4aW5nZScpO1xuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcInhpbmdlVG9rZW5zOiAje3hpbmdlVG9rZW5zfVwiXG5cdFx0XHRYaW5nZUFwcCA9IG5ldyBYaW5nZS5YaW5nZUFwcChNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5hY2Nlc3NJZCwgTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2Uuc2VjcmV0S2V5KVxuXHRcdFx0XG5cdFx0XHRhbmRyb2lkTWVzc2FnZSA9IG5ldyBYaW5nZS5BbmRyb2lkTWVzc2FnZVxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UudHlwZSA9IFhpbmdlLk1FU1NBR0VfVFlQRV9OT1RJRklDQVRJT05cblx0XHRcdGFuZHJvaWRNZXNzYWdlLnRpdGxlID0gbm90aWZpY2F0aW9uLnRpdGxlXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS5jb250ZW50ID0gbm90aWZpY2F0aW9uLnRleHRcblx0XHRcdGFuZHJvaWRNZXNzYWdlLnN0eWxlID0gbmV3IFhpbmdlLlN0eWxlXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS5hY3Rpb24gPSBuZXcgWGluZ2UuQ2xpY2tBY3Rpb25cblxuXHRcdFx0Xy5lYWNoIHhpbmdlVG9rZW5zLCAodCktPlxuXHRcdFx0XHRYaW5nZUFwcC5wdXNoVG9TaW5nbGVEZXZpY2UgdCwgYW5kcm9pZE1lc3NhZ2UsIGNhbGxiYWNrXG5cblx0XHRpZiAhXy5pc0VtcHR5KGh1YXdlaVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5odWF3ZWlcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJodWF3ZWlUb2tlbnM6ICN7aHVhd2VpVG9rZW5zfVwiXG5cblx0XHRcdHBhY2thZ2VfbmFtZSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBQa2dOYW1lXG5cdFx0XHR0b2tlbkRhdGFMaXN0ID0gW11cblx0XHRcdF8uZWFjaCBodWF3ZWlUb2tlbnMsICh0KS0+XG5cdFx0XHRcdHRva2VuRGF0YUxpc3QucHVzaCh7J3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSwgJ3Rva2VuJzogdH0pXG5cdFx0XHRub3RpID0geydhbmRyb2lkJzogeyd0aXRsZSc6IG5vdGlmaWNhdGlvbi50aXRsZSwgJ21lc3NhZ2UnOiBub3RpZmljYXRpb24udGV4dH0sICdleHRyYXMnOiBub3RpZmljYXRpb24ucGF5bG9hZH1cblxuXHRcdFx0SHVhd2VpUHVzaC5jb25maWcgW3sncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLCAnY2xpZW50X2lkJzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcElkLCAnY2xpZW50X3NlY3JldCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBTZWNyZXR9XVxuXHRcdFx0XG5cdFx0XHRIdWF3ZWlQdXNoLnNlbmRNYW55IG5vdGksIHRva2VuRGF0YUxpc3RcblxuXG5cdFx0aWYgIV8uaXNFbXB0eShtaVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5taVxuXHRcdFx0TWlQdXNoID0gcmVxdWlyZSgneGlhb21pLXB1c2gnKTtcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJtaVRva2VuczogI3ttaVRva2Vuc31cIlxuXHRcdFx0bXNnID0gbmV3IE1pUHVzaC5NZXNzYWdlXG5cdFx0XHRtc2cudGl0bGUobm90aWZpY2F0aW9uLnRpdGxlKS5kZXNjcmlwdGlvbihub3RpZmljYXRpb24udGV4dClcblx0XHRcdG5vdGlmaWNhdGlvbiA9IG5ldyBNaVB1c2guTm90aWZpY2F0aW9uKFxuXHRcdFx0XHRwcm9kdWN0aW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5wcm9kdWN0aW9uXG5cdFx0XHRcdGFwcFNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkuYXBwU2VjcmV0XG5cdFx0XHQpXG5cdFx0XHRfLmVhY2ggbWlUb2tlbnMsIChyZWdpZCktPlxuXHRcdFx0XHRub3RpZmljYXRpb24uc2VuZCByZWdpZCwgbXNnLCBjYWxsYmFja1xuXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdFxuXHRpZiBub3QgTWV0ZW9yLnNldHRpbmdzLmNyb24/LnB1c2hfaW50ZXJ2YWxcblx0XHRyZXR1cm5cblxuXHRjb25maWcgPSB7XG5cdFx0ZGVidWc6IHRydWVcblx0XHRrZWVwTm90aWZpY2F0aW9uczogZmFsc2Vcblx0XHRzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLnB1c2hfaW50ZXJ2YWxcblx0XHRzZW5kQmF0Y2hTaXplOiAxMFxuXHRcdHByb2R1Y3Rpb246IHRydWVcblx0fVxuXG5cdGlmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFwbikgJiYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYXBuLmtleURhdGEpICYmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFwbi5jZXJ0RGF0YSlcblx0XHRjb25maWcuYXBuID0ge1xuXHRcdFx0a2V5RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmtleURhdGFcblx0XHRcdGNlcnREYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4uY2VydERhdGFcblx0XHR9XG5cdGlmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmdjbSkgJiYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uZ2NtLnByb2plY3ROdW1iZXIpICYmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmdjbS5hcGlLZXkpXG5cdFx0Y29uZmlnLmdjbSA9IHtcblx0XHRcdHByb2plY3ROdW1iZXI6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5wcm9qZWN0TnVtYmVyXG5cdFx0XHRhcGlLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5hcGlLZXlcblx0XHR9XG5cblx0UHVzaC5Db25maWd1cmUgY29uZmlnXG5cdFxuXHRpZiAoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFsaXl1biBvciBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ueGluZ2Ugb3IgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lmh1YXdlaSBvciBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ubWkpIGFuZCBQdXNoIGFuZCB0eXBlb2YgUHVzaC5zZW5kR0NNID09ICdmdW5jdGlvbidcblx0XHRcblx0XHRQdXNoLm9sZF9zZW5kR0NNID0gUHVzaC5zZW5kR0NNO1xuXG5cdFx0UHVzaC5zZW5kQWxpeXVuID0gKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikgLT5cblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb25cblxuXHRcdFx0aWYgTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpXG5cdFx0XHRcdG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pXG5cdFx0XHQjIE1ha2Ugc3VyZSB1c2VyVG9rZW5zIGFyZSBhbiBhcnJheSBvZiBzdHJpbmdzXG5cdFx0XHRpZiB1c2VyVG9rZW5zID09ICcnICsgdXNlclRva2Vuc1xuXHRcdFx0XHR1c2VyVG9rZW5zID0gWyB1c2VyVG9rZW5zIF1cblx0XHRcdCMgQ2hlY2sgaWYgYW55IHRva2VucyBpbiB0aGVyZSB0byBzZW5kXG5cdFx0XHRpZiAhdXNlclRva2Vucy5sZW5ndGhcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvblxuXG5cdFx0XHRGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpXG5cdCAgXG5cdFx0XHR1c2VyVG9rZW4gPSBpZiB1c2VyVG9rZW5zLmxlbmd0aCA9PSAxIHRoZW4gdXNlclRva2Vuc1swXSBlbHNlIG51bGxcblx0XHRcdEFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbiwgKGVyciwgcmVzdWx0KSAtPlxuXHRcdFx0XHRpZiBlcnJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyAnQU5EUk9JRCBFUlJPUjogcmVzdWx0IG9mIHNlbmRlcjogJyArIHJlc3VsdFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aWYgcmVzdWx0ID09IG51bGxcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nICdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyIGlzIG51bGwnXG5cdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyAnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlcjogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdClcblxuXHRcdFx0XHRcdGlmIHJlc3VsdC5jYW5vbmljYWxfaWRzID09IDEgYW5kIHVzZXJUb2tlblxuXHRcdFx0XHRcdFx0RmliZXIoKHNlbGYpIC0+XG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHNlbGYuY2FsbGJhY2sgc2VsZi5vbGRUb2tlbiwgc2VsZi5uZXdUb2tlblxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJcblx0XHRcdFx0XHRcdCkucnVuXG5cdFx0XHRcdFx0XHRcdG9sZFRva2VuOiBnY206IHVzZXJUb2tlblxuXHRcdFx0XHRcdFx0XHRuZXdUb2tlbjogZ2NtOiBcImFsaXl1bjpcIiArIHJlc3VsdC5yZXN1bHRzWzBdLnJlZ2lzdHJhdGlvbl9pZFxuXHRcdFx0XHRcdFx0XHRjYWxsYmFjazogX3JlcGxhY2VUb2tlblxuXHRcdFx0XHRcdGlmIHJlc3VsdC5mYWlsdXJlICE9IDAgYW5kIHVzZXJUb2tlblxuXHRcdFx0XHRcdFx0RmliZXIoKHNlbGYpIC0+XG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHNlbGYuY2FsbGJhY2sgc2VsZi50b2tlblxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJcblx0XHRcdFx0XHRcdCkucnVuXG5cdFx0XHRcdFx0XHRcdHRva2VuOiBnY206IHVzZXJUb2tlblxuXHRcdFx0XHRcdFx0XHRjYWxsYmFjazogX3JlbW92ZVRva2VuXG5cblxuXG5cdFx0UHVzaC5zZW5kR0NNID0gKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikgLT5cblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00gZnJvbSBhbGl5dW4tPiBQdXNoLnNlbmRHQ00nXG5cdFx0XHRpZiBNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdClcblx0XHRcdFx0bm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSlcblx0XHRcdCMgTWFrZSBzdXJlIHVzZXJUb2tlbnMgYXJlIGFuIGFycmF5IG9mIHN0cmluZ3Ncblx0XHRcdGlmIHVzZXJUb2tlbnMgPT0gJycgKyB1c2VyVG9rZW5zXG5cdFx0XHRcdHVzZXJUb2tlbnMgPSBbIHVzZXJUb2tlbnMgXVxuXHRcdFx0IyBDaGVjayBpZiBhbnkgdG9rZW5zIGluIHRoZXJlIHRvIHNlbmRcblx0XHRcdGlmICF1c2VyVG9rZW5zLmxlbmd0aFxuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCdcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uXG5cblx0XHRcdGFsaXl1blRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKChpdGVtKSAtPlxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uaW5kZXhPZignYWxpeXVuOicpID4gLTEgb3IgaXRlbS5pbmRleE9mKCd4aW5nZTonKSA+IC0xIG9yIGl0ZW0uaW5kZXhPZignaHVhd2VpOicpID4gLTEgb3IgaXRlbS5pbmRleE9mKCdtaTonKSA+IC0xXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ2FsaXl1blRva2VucyBpcyAnLCBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKVxuXG5cdFx0XHRnY21Ub2tlbnMgPSB1c2VyVG9rZW5zLmZpbHRlcigoaXRlbSkgLT5cblx0XHRcdFx0XHRcdFx0XHRpdGVtLmluZGV4T2YoXCJhbGl5dW46XCIpIDwgMCBhbmQgaXRlbS5pbmRleE9mKFwieGluZ2U6XCIpIDwgMCBhbmQgaXRlbS5pbmRleE9mKFwiaHVhd2VpOlwiKSA8IDAgYW5kIGl0ZW0uaW5kZXhPZihcIm1pOlwiKSA8IDBcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnZ2NtVG9rZW5zIGlzICcgLCBnY21Ub2tlbnMudG9TdHJpbmcoKTtcblxuXHRcdFx0UHVzaC5zZW5kQWxpeXVuKGFsaXl1blRva2Vucywgbm90aWZpY2F0aW9uKTtcblxuXHRcdFx0UHVzaC5vbGRfc2VuZEdDTShnY21Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG5cblx0XHRQdXNoLm9sZF9zZW5kQVBOID0gUHVzaC5zZW5kQVBOXG5cdFx0UHVzaC5zZW5kQVBOID0gKHVzZXJUb2tlbiwgbm90aWZpY2F0aW9uKSAtPlxuXHRcdFx0dHJ5XG5cdFx0XHRcdGlmIG5vdGlmaWNhdGlvbi50aXRsZSBhbmQgbm90aWZpY2F0aW9uLnRleHRcblx0XHRcdFx0XHRub3RpID0gXy5jbG9uZShub3RpZmljYXRpb24pXG5cdFx0XHRcdFx0bm90aS50ZXh0ID0gbm90aS50aXRsZSArIFwiIFwiICsgbm90aS50ZXh0XG5cdFx0XHRcdFx0bm90aS50aXRsZSA9IFwiXCJcblx0XHRcdFx0XHRQdXNoLm9sZF9zZW5kQVBOKHVzZXJUb2tlbiwgbm90aSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpZmljYXRpb24pXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSlcbiIsInZhciBBbGl5dW5fcHVzaDtcblxuQWxpeXVuX3B1c2ggPSB7fTtcblxuQWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbih1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIGNhbGxiYWNrKSB7XG4gIHZhciBBTFksIEFMWVBVU0gsIE1pUHVzaCwgWGluZ2UsIFhpbmdlQXBwLCBhbGl5dW5Ub2tlbnMsIGFuZHJvaWRNZXNzYWdlLCBkYXRhLCBodWF3ZWlUb2tlbnMsIG1pVG9rZW5zLCBtc2csIG5vdGksIHBhY2thZ2VfbmFtZSwgcmVmLCByZWYxLCByZWYyLCByZWYzLCB0b2tlbkRhdGFMaXN0LCB4aW5nZVRva2VucztcbiAgaWYgKG5vdGlmaWNhdGlvbi50aXRsZSAmJiBub3RpZmljYXRpb24udGV4dCkge1xuICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZyh1c2VyVG9rZW5zKTtcbiAgICB9XG4gICAgYWxpeXVuVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIHhpbmdlVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIGh1YXdlaVRva2VucyA9IG5ldyBBcnJheTtcbiAgICBtaVRva2VucyA9IG5ldyBBcnJheTtcbiAgICB1c2VyVG9rZW5zLmZvckVhY2goZnVuY3Rpb24odXNlclRva2VuKSB7XG4gICAgICB2YXIgYXJyO1xuICAgICAgYXJyID0gdXNlclRva2VuLnNwbGl0KCc6Jyk7XG4gICAgICBpZiAoYXJyWzBdID09PSBcImFsaXl1blwiKSB7XG4gICAgICAgIHJldHVybiBhbGl5dW5Ub2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9IGVsc2UgaWYgKGFyclswXSA9PT0gXCJ4aW5nZVwiKSB7XG4gICAgICAgIHJldHVybiB4aW5nZVRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyWzBdID09PSBcImh1YXdlaVwiKSB7XG4gICAgICAgIHJldHVybiBodWF3ZWlUb2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9IGVsc2UgaWYgKGFyclswXSA9PT0gXCJtaVwiKSB7XG4gICAgICAgIHJldHVybiBtaVRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIV8uaXNFbXB0eShhbGl5dW5Ub2tlbnMpICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYuYWxpeXVuIDogdm9pZCAwKSkge1xuICAgICAgQUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJhbGl5dW5Ub2tlbnM6IFwiICsgYWxpeXVuVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIEFMWVBVU0ggPSBuZXcgQUxZLlBVU0goe1xuICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFjY2Vzc0tleUlkLFxuICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5zZWNyZXRBY2Nlc3NLZXksXG4gICAgICAgIGVuZHBvaW50OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uZW5kcG9pbnQsXG4gICAgICAgIGFwaVZlcnNpb246IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hcGlWZXJzaW9uXG4gICAgICB9KTtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIEFwcEtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwcEtleSxcbiAgICAgICAgVGFyZ2V0OiAnZGV2aWNlJyxcbiAgICAgICAgVGFyZ2V0VmFsdWU6IGFsaXl1blRva2Vucy50b1N0cmluZygpLFxuICAgICAgICBUaXRsZTogbm90aWZpY2F0aW9uLnRpdGxlLFxuICAgICAgICBTdW1tYXJ5OiBub3RpZmljYXRpb24udGV4dFxuICAgICAgfTtcbiAgICAgIEFMWVBVU0gucHVzaE5vdGljZVRvQW5kcm9pZChkYXRhLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIGlmICghXy5pc0VtcHR5KHhpbmdlVG9rZW5zKSAmJiAoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjEueGluZ2UgOiB2b2lkIDApKSB7XG4gICAgICBYaW5nZSA9IHJlcXVpcmUoJ3hpbmdlJyk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcInhpbmdlVG9rZW5zOiBcIiArIHhpbmdlVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIFhpbmdlQXBwID0gbmV3IFhpbmdlLlhpbmdlQXBwKE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLmFjY2Vzc0lkLCBNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5zZWNyZXRLZXkpO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UgPSBuZXcgWGluZ2UuQW5kcm9pZE1lc3NhZ2U7XG4gICAgICBhbmRyb2lkTWVzc2FnZS50eXBlID0gWGluZ2UuTUVTU0FHRV9UWVBFX05PVElGSUNBVElPTjtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLnRpdGxlID0gbm90aWZpY2F0aW9uLnRpdGxlO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UuY29udGVudCA9IG5vdGlmaWNhdGlvbi50ZXh0O1xuICAgICAgYW5kcm9pZE1lc3NhZ2Uuc3R5bGUgPSBuZXcgWGluZ2UuU3R5bGU7XG4gICAgICBhbmRyb2lkTWVzc2FnZS5hY3Rpb24gPSBuZXcgWGluZ2UuQ2xpY2tBY3Rpb247XG4gICAgICBfLmVhY2goeGluZ2VUb2tlbnMsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIFhpbmdlQXBwLnB1c2hUb1NpbmdsZURldmljZSh0LCBhbmRyb2lkTWVzc2FnZSwgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICghXy5pc0VtcHR5KGh1YXdlaVRva2VucykgJiYgKChyZWYyID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYyLmh1YXdlaSA6IHZvaWQgMCkpIHtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaHVhd2VpVG9rZW5zOiBcIiArIGh1YXdlaVRva2Vucyk7XG4gICAgICB9XG4gICAgICBwYWNrYWdlX25hbWUgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwUGtnTmFtZTtcbiAgICAgIHRva2VuRGF0YUxpc3QgPSBbXTtcbiAgICAgIF8uZWFjaChodWF3ZWlUb2tlbnMsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHRva2VuRGF0YUxpc3QucHVzaCh7XG4gICAgICAgICAgJ3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSxcbiAgICAgICAgICAndG9rZW4nOiB0XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBub3RpID0ge1xuICAgICAgICAnYW5kcm9pZCc6IHtcbiAgICAgICAgICAndGl0bGUnOiBub3RpZmljYXRpb24udGl0bGUsXG4gICAgICAgICAgJ21lc3NhZ2UnOiBub3RpZmljYXRpb24udGV4dFxuICAgICAgICB9LFxuICAgICAgICAnZXh0cmFzJzogbm90aWZpY2F0aW9uLnBheWxvYWRcbiAgICAgIH07XG4gICAgICBIdWF3ZWlQdXNoLmNvbmZpZyhbXG4gICAgICAgIHtcbiAgICAgICAgICAncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLFxuICAgICAgICAgICdjbGllbnRfaWQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwSWQsXG4gICAgICAgICAgJ2NsaWVudF9zZWNyZXQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwU2VjcmV0XG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgICAgSHVhd2VpUHVzaC5zZW5kTWFueShub3RpLCB0b2tlbkRhdGFMaXN0KTtcbiAgICB9XG4gICAgaWYgKCFfLmlzRW1wdHkobWlUb2tlbnMpICYmICgocmVmMyA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMy5taSA6IHZvaWQgMCkpIHtcbiAgICAgIE1pUHVzaCA9IHJlcXVpcmUoJ3hpYW9taS1wdXNoJyk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIm1pVG9rZW5zOiBcIiArIG1pVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIG1zZyA9IG5ldyBNaVB1c2guTWVzc2FnZTtcbiAgICAgIG1zZy50aXRsZShub3RpZmljYXRpb24udGl0bGUpLmRlc2NyaXB0aW9uKG5vdGlmaWNhdGlvbi50ZXh0KTtcbiAgICAgIG5vdGlmaWNhdGlvbiA9IG5ldyBNaVB1c2guTm90aWZpY2F0aW9uKHtcbiAgICAgICAgcHJvZHVjdGlvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkucHJvZHVjdGlvbixcbiAgICAgICAgYXBwU2VjcmV0OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5hcHBTZWNyZXRcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChtaVRva2VucywgZnVuY3Rpb24ocmVnaWQpIHtcbiAgICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5zZW5kKHJlZ2lkLCBtc2csIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjb25maWcsIHJlZiwgcmVmMSwgcmVmMTAsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjgsIHJlZjk7XG4gIGlmICghKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MuY3JvbikgIT0gbnVsbCA/IHJlZi5wdXNoX2ludGVydmFsIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25maWcgPSB7XG4gICAgZGVidWc6IHRydWUsXG4gICAga2VlcE5vdGlmaWNhdGlvbnM6IGZhbHNlLFxuICAgIHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLmNyb24ucHVzaF9pbnRlcnZhbCxcbiAgICBzZW5kQmF0Y2hTaXplOiAxMCxcbiAgICBwcm9kdWN0aW9uOiB0cnVlXG4gIH07XG4gIGlmICghXy5pc0VtcHR5KChyZWYxID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYxLmFwbiA6IHZvaWQgMCkgJiYgIV8uaXNFbXB0eSgocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMi5hcG4ua2V5RGF0YSA6IHZvaWQgMCkgJiYgIV8uaXNFbXB0eSgocmVmMyA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMy5hcG4uY2VydERhdGEgOiB2b2lkIDApKSB7XG4gICAgY29uZmlnLmFwbiA9IHtcbiAgICAgIGtleURhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5rZXlEYXRhLFxuICAgICAgY2VydERhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5jZXJ0RGF0YVxuICAgIH07XG4gIH1cbiAgaWYgKCFfLmlzRW1wdHkoKHJlZjQgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjQuZ2NtIDogdm9pZCAwKSAmJiAhXy5pc0VtcHR5KChyZWY1ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY1LmdjbS5wcm9qZWN0TnVtYmVyIDogdm9pZCAwKSAmJiAhXy5pc0VtcHR5KChyZWY2ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY2LmdjbS5hcGlLZXkgOiB2b2lkIDApKSB7XG4gICAgY29uZmlnLmdjbSA9IHtcbiAgICAgIHByb2plY3ROdW1iZXI6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5wcm9qZWN0TnVtYmVyLFxuICAgICAgYXBpS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20uYXBpS2V5XG4gICAgfTtcbiAgfVxuICBQdXNoLkNvbmZpZ3VyZShjb25maWcpO1xuICBpZiAoKCgocmVmNyA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmNy5hbGl5dW4gOiB2b2lkIDApIHx8ICgocmVmOCA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmOC54aW5nZSA6IHZvaWQgMCkgfHwgKChyZWY5ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY5Lmh1YXdlaSA6IHZvaWQgMCkgfHwgKChyZWYxMCA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMTAubWkgOiB2b2lkIDApKSAmJiBQdXNoICYmIHR5cGVvZiBQdXNoLnNlbmRHQ00gPT09ICdmdW5jdGlvbicpIHtcbiAgICBQdXNoLm9sZF9zZW5kR0NNID0gUHVzaC5zZW5kR0NNO1xuICAgIFB1c2guc2VuZEFsaXl1biA9IGZ1bmN0aW9uKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIEZpYmVyLCB1c2VyVG9rZW47XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgICBpZiAoTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpKSB7XG4gICAgICAgIG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJUb2tlbnMgPT09ICcnICsgdXNlclRva2Vucykge1xuICAgICAgICB1c2VyVG9rZW5zID0gW3VzZXJUb2tlbnNdO1xuICAgICAgfVxuICAgICAgaWYgKCF1c2VyVG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICAgICAgdXNlclRva2VuID0gdXNlclRva2Vucy5sZW5ndGggPT09IDEgPyB1c2VyVG9rZW5zWzBdIDogbnVsbDtcbiAgICAgIHJldHVybiBBbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5sb2coJ0FORFJPSUQgRVJST1I6IHJlc3VsdCBvZiBzZW5kZXI6ICcgKyByZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyIGlzIG51bGwnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlcjogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0LmNhbm9uaWNhbF9pZHMgPT09IDEgJiYgdXNlclRva2VuKSB7XG4gICAgICAgICAgICBGaWJlcihmdW5jdGlvbihzZWxmKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soc2VsZi5vbGRUb2tlbiwgc2VsZi5uZXdUb2tlbik7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnJ1bih7XG4gICAgICAgICAgICAgIG9sZFRva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiB1c2VyVG9rZW5cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmV3VG9rZW46IHtcbiAgICAgICAgICAgICAgICBnY206IFwiYWxpeXVuOlwiICsgcmVzdWx0LnJlc3VsdHNbMF0ucmVnaXN0cmF0aW9uX2lkXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhbGxiYWNrOiBfcmVwbGFjZVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdC5mYWlsdXJlICE9PSAwICYmIHVzZXJUb2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKHNlbGYpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhzZWxmLnRva2VuKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkucnVuKHtcbiAgICAgICAgICAgICAgdG9rZW46IHtcbiAgICAgICAgICAgICAgICBnY206IHVzZXJUb2tlblxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWxsYmFjazogX3JlbW92ZVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gICAgUHVzaC5zZW5kR0NNID0gZnVuY3Rpb24odXNlclRva2Vucywgbm90aWZpY2F0aW9uKSB7XG4gICAgICB2YXIgYWxpeXVuVG9rZW5zLCBnY21Ub2tlbnM7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTSBmcm9tIGFsaXl1bi0+IFB1c2guc2VuZEdDTScpO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KSkge1xuICAgICAgICBub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKTtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyVG9rZW5zID09PSAnJyArIHVzZXJUb2tlbnMpIHtcbiAgICAgICAgdXNlclRva2VucyA9IFt1c2VyVG9rZW5zXTtcbiAgICAgIH1cbiAgICAgIGlmICghdXNlclRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgYWxpeXVuVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5pbmRleE9mKCdhbGl5dW46JykgPiAtMSB8fCBpdGVtLmluZGV4T2YoJ3hpbmdlOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCdodWF3ZWk6JykgPiAtMSB8fCBpdGVtLmluZGV4T2YoJ21pOicpID4gLTE7XG4gICAgICB9KTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhbGl5dW5Ub2tlbnMgaXMgJywgYWxpeXVuVG9rZW5zLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAgZ2NtVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5pbmRleE9mKFwiYWxpeXVuOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwieGluZ2U6XCIpIDwgMCAmJiBpdGVtLmluZGV4T2YoXCJodWF3ZWk6XCIpIDwgMCAmJiBpdGVtLmluZGV4T2YoXCJtaTpcIikgPCAwO1xuICAgICAgfSk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2NtVG9rZW5zIGlzICcsIGdjbVRva2Vucy50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICAgIFB1c2guc2VuZEFsaXl1bihhbGl5dW5Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEdDTShnY21Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgfTtcbiAgICBQdXNoLm9sZF9zZW5kQVBOID0gUHVzaC5zZW5kQVBOO1xuICAgIHJldHVybiBQdXNoLnNlbmRBUE4gPSBmdW5jdGlvbih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIGUsIG5vdGk7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAobm90aWZpY2F0aW9uLnRpdGxlICYmIG5vdGlmaWNhdGlvbi50ZXh0KSB7XG4gICAgICAgICAgbm90aSA9IF8uY2xvbmUobm90aWZpY2F0aW9uKTtcbiAgICAgICAgICBub3RpLnRleHQgPSBub3RpLnRpdGxlICsgXCIgXCIgKyBub3RpLnRleHQ7XG4gICAgICAgICAgbm90aS50aXRsZSA9IFwiXCI7XG4gICAgICAgICAgcmV0dXJuIFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iXX0=
