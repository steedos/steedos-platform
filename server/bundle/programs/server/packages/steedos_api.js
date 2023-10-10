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

}},"routes":{"aliyun_push.coffee":function module(require){

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
require("/node_modules/meteor/steedos:api/routes/aliyun_push.coffee");

/* Exports */
Package._define("steedos:api");

})();

//# sourceURL=meteor://💻app/packages/steedos_api.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3BhcnNlX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFyc2VfZmlsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvbGliL3Jlc3RpdnVzL2lyb24tcm91dGVyLWVycm9yLXRvLXJlc3BvbnNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3N0ZWVkb3Mvc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zdGVlZG9zL3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL2FsaXl1bl9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FsaXl1bl9wdXNoLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJCdXNib3kiLCJGaWJlciIsInJlcXVpcmUiLCJKc29uUm91dGVzIiwicGFyc2VGaWxlcyIsInJlcSIsInJlcyIsIm5leHQiLCJidXNib3kiLCJmaWxlcyIsIm1ldGhvZCIsImhlYWRlcnMiLCJvbiIsImZpZWxkbmFtZSIsImZpbGUiLCJmaWxlbmFtZSIsImVuY29kaW5nIiwibWltZXR5cGUiLCJidWZmZXJzIiwiaW1hZ2UiLCJtaW1lVHlwZSIsImRhdGEiLCJwdXNoIiwiQnVmZmVyIiwiY29uY2F0IiwidmFsdWUiLCJib2R5IiwicnVuIiwicGlwZSIsImdldFVzZXJRdWVyeVNlbGVjdG9yIiwidXNlclZhbGlkYXRvciIsIkF1dGgiLCJNYXRjaCIsIldoZXJlIiwidXNlciIsImNoZWNrIiwiaWQiLCJPcHRpb25hbCIsIlN0cmluZyIsInVzZXJuYW1lIiwiZW1haWwiLCJfIiwia2V5cyIsImxlbmd0aCIsIkVycm9yIiwibG9naW5XaXRoUGFzc3dvcmQiLCJwYXNzd29yZCIsImF1dGhUb2tlbiIsImF1dGhlbnRpY2F0aW5nVXNlciIsImF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yIiwiaGFzaGVkVG9rZW4iLCJwYXNzd29yZFZlcmlmaWNhdGlvbiIsInJlZiIsInNwYWNlX3VzZXJzIiwic3BhY2VzIiwiTWV0ZW9yIiwidXNlcnMiLCJmaW5kT25lIiwic2VydmljZXMiLCJBY2NvdW50cyIsIl9jaGVja1Bhc3N3b3JkIiwiZXJyb3IiLCJfZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbiIsIl9oYXNoU3RhbXBlZFRva2VuIiwiX2luc2VydEhhc2hlZExvZ2luVG9rZW4iLCJfaWQiLCJkYiIsImZpbmQiLCJmZXRjaCIsImVhY2giLCJzdSIsInNwYWNlIiwiaW5kZXhPZiIsImFkbWlucyIsIm5hbWUiLCJ0b2tlbiIsInVzZXJJZCIsImFkbWluU3BhY2VzIiwiZW52IiwicHJvY2VzcyIsIk5PREVfRU5WIiwiaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UiLCJlcnIiLCJzdGF0dXNDb2RlIiwic3RhdHVzIiwibXNnIiwic3RhY2siLCJ0b1N0cmluZyIsImNvbnNvbGUiLCJoZWFkZXJzU2VudCIsInNvY2tldCIsImRlc3Ryb3kiLCJzZXRIZWFkZXIiLCJieXRlTGVuZ3RoIiwiZW5kIiwic2hhcmUiLCJSb3V0ZSIsImFwaSIsInBhdGgiLCJvcHRpb25zIiwiZW5kcG9pbnRzMSIsImVuZHBvaW50cyIsInByb3RvdHlwZSIsImFkZFRvQXBpIiwiYXZhaWxhYmxlTWV0aG9kcyIsImFsbG93ZWRNZXRob2RzIiwiZnVsbFBhdGgiLCJyZWplY3RlZE1ldGhvZHMiLCJzZWxmIiwiY29udGFpbnMiLCJfY29uZmlnIiwicGF0aHMiLCJleHRlbmQiLCJkZWZhdWx0T3B0aW9uc0VuZHBvaW50IiwiX3Jlc29sdmVFbmRwb2ludHMiLCJfY29uZmlndXJlRW5kcG9pbnRzIiwiZmlsdGVyIiwicmVqZWN0IiwiYXBpUGF0aCIsImVuZHBvaW50IiwiYWRkIiwiZG9uZUZ1bmMiLCJlbmRwb2ludENvbnRleHQiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZUluaXRpYXRlZCIsInVybFBhcmFtcyIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwicXVlcnkiLCJib2R5UGFyYW1zIiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZG9uZSIsIl9jYWxsRW5kcG9pbnQiLCJlcnJvcjEiLCJfcmVzcG9uZCIsIm1lc3NhZ2UiLCJqb2luIiwidG9VcHBlckNhc2UiLCJpc0Z1bmN0aW9uIiwiYWN0aW9uIiwicmVmMSIsInJlZjIiLCJyb2xlUmVxdWlyZWQiLCJ1bmlvbiIsImlzRW1wdHkiLCJhdXRoUmVxdWlyZWQiLCJzcGFjZVJlcXVpcmVkIiwiaW52b2NhdGlvbiIsIl9hdXRoQWNjZXB0ZWQiLCJfcm9sZUFjY2VwdGVkIiwiX3NwYWNlQWNjZXB0ZWQiLCJERFBDb21tb24iLCJNZXRob2RJbnZvY2F0aW9uIiwiaXNTaW11bGF0aW9uIiwiY29ubmVjdGlvbiIsInJhbmRvbVNlZWQiLCJtYWtlUnBjU2VlZCIsIkREUCIsIl9DdXJyZW50SW52b2NhdGlvbiIsIndpdGhWYWx1ZSIsImNhbGwiLCJfYXV0aGVudGljYXRlIiwiYXV0aCIsInVzZXJTZWxlY3RvciIsInNwYWNlX3VzZXJzX2NvdW50Iiwic3BhY2VJZCIsImNvdW50IiwiaW50ZXJzZWN0aW9uIiwicm9sZXMiLCJkZWZhdWx0SGVhZGVycyIsImRlbGF5SW5NaWxsaXNlY29uZHMiLCJtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyIsInJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvIiwic2VuZFJlc3BvbnNlIiwiX2xvd2VyQ2FzZUtleXMiLCJtYXRjaCIsInByZXR0eUpzb24iLCJKU09OIiwic3RyaW5naWZ5Iiwid3JpdGVIZWFkIiwid3JpdGUiLCJNYXRoIiwicmFuZG9tIiwic2V0VGltZW91dCIsIm9iamVjdCIsImNoYWluIiwicGFpcnMiLCJtYXAiLCJhdHRyIiwidG9Mb3dlckNhc2UiLCJSZXN0aXZ1cyIsIml0ZW0iLCJpIiwibCIsImNvcnNIZWFkZXJzIiwiX3JvdXRlcyIsInVzZURlZmF1bHRBdXRoIiwidmVyc2lvbiIsIl91c2VyIiwiX2hhc2hMb2dpblRva2VuIiwiZW5hYmxlQ29ycyIsInNsaWNlIiwibGFzdCIsIl9pbml0QXV0aCIsInVzZUF1dGgiLCJ3YXJuIiwiYWRkUm91dGUiLCJyb3V0ZSIsImFkZENvbGxlY3Rpb24iLCJjb2xsZWN0aW9uIiwiY29sbGVjdGlvbkVuZHBvaW50cyIsImNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyIsImVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiIsImVudGl0eVJvdXRlRW5kcG9pbnRzIiwiZXhjbHVkZWRFbmRwb2ludHMiLCJtZXRob2RzIiwibWV0aG9kc09uQ29sbGVjdGlvbiIsInJvdXRlT3B0aW9ucyIsIl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyIsIl9jb2xsZWN0aW9uRW5kcG9pbnRzIiwiX25hbWUiLCJjb25maWd1cmVkRW5kcG9pbnQiLCJlbmRwb2ludE9wdGlvbnMiLCJtZXRob2RUeXBlIiwiY2xvbmUiLCJnZXQiLCJlbnRpdHkiLCJzZWxlY3RvciIsInB1dCIsImVudGl0eUlzVXBkYXRlZCIsInVwZGF0ZSIsIiRzZXQiLCJyZW1vdmUiLCJwb3N0IiwiZW50aXR5SWQiLCJpbnNlcnQiLCJnZXRBbGwiLCJlbnRpdGllcyIsImZpZWxkcyIsInByb2ZpbGUiLCJjcmVhdGVVc2VyIiwibG9nb3V0IiwiZSIsImV4dHJhRGF0YSIsInNlYXJjaFF1ZXJ5IiwicmVhc29uIiwib25Mb2dnZWRJbiIsImV4dHJhIiwiaW5kZXgiLCJ0b2tlbkZpZWxkTmFtZSIsInRva2VuTG9jYXRpb24iLCJ0b2tlblBhdGgiLCJ0b2tlblJlbW92YWxRdWVyeSIsInRva2VuVG9SZW1vdmUiLCJsYXN0SW5kZXhPZiIsInN1YnN0cmluZyIsIiRwdWxsIiwib25Mb2dnZWRPdXQiLCJpc1NlcnZlciIsIkFQSSIsInN0YXJ0dXAiLCJvcmdhbml6YXRpb25zIiwiQWxpeXVuX3B1c2giLCJzZW5kTWVzc2FnZSIsInVzZXJUb2tlbnMiLCJub3RpZmljYXRpb24iLCJjYWxsYmFjayIsIkFMWSIsIkFMWVBVU0giLCJNaVB1c2giLCJYaW5nZSIsIlhpbmdlQXBwIiwiYWxpeXVuVG9rZW5zIiwiYW5kcm9pZE1lc3NhZ2UiLCJodWF3ZWlUb2tlbnMiLCJtaVRva2VucyIsIm5vdGkiLCJwYWNrYWdlX25hbWUiLCJyZWYzIiwidG9rZW5EYXRhTGlzdCIsInhpbmdlVG9rZW5zIiwidGl0bGUiLCJ0ZXh0IiwiUHVzaCIsImRlYnVnIiwibG9nIiwiQXJyYXkiLCJmb3JFYWNoIiwidXNlclRva2VuIiwiYXJyIiwic3BsaXQiLCJzZXR0aW5ncyIsImFsaXl1biIsIlBVU0giLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsImFwaVZlcnNpb24iLCJBcHBLZXkiLCJhcHBLZXkiLCJUYXJnZXQiLCJUYXJnZXRWYWx1ZSIsIlRpdGxlIiwiU3VtbWFyeSIsInB1c2hOb3RpY2VUb0FuZHJvaWQiLCJ4aW5nZSIsImFjY2Vzc0lkIiwic2VjcmV0S2V5IiwiQW5kcm9pZE1lc3NhZ2UiLCJ0eXBlIiwiTUVTU0FHRV9UWVBFX05PVElGSUNBVElPTiIsImNvbnRlbnQiLCJzdHlsZSIsIlN0eWxlIiwiQ2xpY2tBY3Rpb24iLCJ0IiwicHVzaFRvU2luZ2xlRGV2aWNlIiwiaHVhd2VpIiwiYXBwUGtnTmFtZSIsInBheWxvYWQiLCJIdWF3ZWlQdXNoIiwiY29uZmlnIiwiYXBwSWQiLCJhcHBTZWNyZXQiLCJzZW5kTWFueSIsIm1pIiwiTWVzc2FnZSIsImRlc2NyaXB0aW9uIiwiTm90aWZpY2F0aW9uIiwicHJvZHVjdGlvbiIsInJlZ2lkIiwic2VuZCIsInJlZjEwIiwicmVmNCIsInJlZjUiLCJyZWY2IiwicmVmNyIsInJlZjgiLCJyZWY5IiwiY3JvbiIsInB1c2hfaW50ZXJ2YWwiLCJrZWVwTm90aWZpY2F0aW9ucyIsInNlbmRJbnRlcnZhbCIsInNlbmRCYXRjaFNpemUiLCJhcG4iLCJrZXlEYXRhIiwiY2VydERhdGEiLCJnY20iLCJwcm9qZWN0TnVtYmVyIiwiYXBpS2V5IiwiQ29uZmlndXJlIiwic2VuZEdDTSIsIm9sZF9zZW5kR0NNIiwic2VuZEFsaXl1biIsInRlc3QiLCJPYmplY3QiLCJyZXN1bHQiLCJjYW5vbmljYWxfaWRzIiwib2xkVG9rZW4iLCJuZXdUb2tlbiIsInJlc3VsdHMiLCJyZWdpc3RyYXRpb25faWQiLCJfcmVwbGFjZVRva2VuIiwiZmFpbHVyZSIsIl9yZW1vdmVUb2tlbiIsImdjbVRva2VucyIsIm9sZF9zZW5kQVBOIiwic2VuZEFQTiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFB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VUFBR29OLEtBQUtDLEtBQVI7QUFDQ3JNLGdCQUFRc00sR0FBUixDQUFZLGVBQVosRUFBOEIrRSxVQUFVdFIsUUFBVixFQUE5QjtBQ3NDRzs7QURwQ0pxTSxXQUFLcUUsVUFBTCxDQUFnQmhGLFlBQWhCLEVBQThCUCxZQUE5QjtBQ3NDRyxhRHBDSGtCLEtBQUtvRSxXQUFMLENBQWlCYSxTQUFqQixFQUE0Qm5HLFlBQTVCLENDb0NHO0FEakVXLEtBQWY7O0FBK0JBa0IsU0FBS2tGLFdBQUwsR0FBbUJsRixLQUFLbUYsT0FBeEI7QUNxQ0UsV0RwQ0ZuRixLQUFLbUYsT0FBTCxHQUFlLFVBQUM5RSxTQUFELEVBQVl2QixZQUFaO0FBQ2QsVUFBQXZCLENBQUEsRUFBQWtDLElBQUE7O0FBQUE7QUFDQyxZQUFHWCxhQUFhZ0IsS0FBYixJQUF1QmhCLGFBQWFpQixJQUF2QztBQUNDTixpQkFBTzVPLEVBQUV3TCxLQUFGLENBQVF5QyxZQUFSLENBQVA7QUFDQVcsZUFBS00sSUFBTCxHQUFZTixLQUFLSyxLQUFMLEdBQWEsR0FBYixHQUFtQkwsS0FBS00sSUFBcEM7QUFDQU4sZUFBS0ssS0FBTCxHQUFhLEVBQWI7QUNzQ0ssaUJEckNMRSxLQUFLa0YsV0FBTCxDQUFpQjdFLFNBQWpCLEVBQTRCWixJQUE1QixDQ3FDSztBRHpDTjtBQzJDTSxpQkRyQ0xPLEtBQUtrRixXQUFMLENBQWlCN0UsU0FBakIsRUFBNEJ2QixZQUE1QixDQ3FDSztBRDVDUDtBQUFBLGVBQUE3TSxLQUFBO0FBUU1zTCxZQUFBdEwsS0FBQTtBQ3dDRCxlRHZDSjJCLFFBQVEzQixLQUFSLENBQWNzTCxDQUFkLENDdUNJO0FBQ0Q7QURsRFUsS0NvQ2I7QUFnQkQ7QURwS0gsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19hcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG4iLCJCdXNib3kgPSByZXF1aXJlKCdidXNib3knKTtcbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbkpzb25Sb3V0ZXMucGFyc2VGaWxlcyA9IChyZXEsIHJlcywgbmV4dCkgLT5cblx0ZmlsZXMgPSBbXTsgIyBTdG9yZSBmaWxlcyBpbiBhbiBhcnJheSBhbmQgdGhlbiBwYXNzIHRoZW0gdG8gcmVxdWVzdC5cblxuXHRpZiAocmVxLm1ldGhvZCA9PSBcIlBPU1RcIilcblx0XHRidXNib3kgPSBuZXcgQnVzYm95KHsgaGVhZGVyczogcmVxLmhlYWRlcnMgfSk7XG5cdFx0YnVzYm95Lm9uIFwiZmlsZVwiLCAgKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkgLT5cblx0XHRcdGltYWdlID0ge307ICMgY3JhdGUgYW4gaW1hZ2Ugb2JqZWN0XG5cdFx0XHRpbWFnZS5taW1lVHlwZSA9IG1pbWV0eXBlO1xuXHRcdFx0aW1hZ2UuZW5jb2RpbmcgPSBlbmNvZGluZztcblx0XHRcdGltYWdlLmZpbGVuYW1lID0gZmlsZW5hbWU7XG5cblx0XHRcdCMgYnVmZmVyIHRoZSByZWFkIGNodW5rc1xuXHRcdFx0YnVmZmVycyA9IFtdO1xuXG5cdFx0XHRmaWxlLm9uICdkYXRhJywgKGRhdGEpIC0+XG5cdFx0XHRcdGJ1ZmZlcnMucHVzaChkYXRhKTtcblxuXHRcdFx0ZmlsZS5vbiAnZW5kJywgKCkgLT5cblx0XHRcdFx0IyBjb25jYXQgdGhlIGNodW5rc1xuXHRcdFx0XHRpbWFnZS5kYXRhID0gQnVmZmVyLmNvbmNhdChidWZmZXJzKTtcblx0XHRcdFx0IyBwdXNoIHRoZSBpbWFnZSBvYmplY3QgdG8gdGhlIGZpbGUgYXJyYXlcblx0XHRcdFx0ZmlsZXMucHVzaChpbWFnZSk7XG5cblxuXHRcdGJ1c2JveS5vbiBcImZpZWxkXCIsIChmaWVsZG5hbWUsIHZhbHVlKSAtPlxuXHRcdFx0cmVxLmJvZHlbZmllbGRuYW1lXSA9IHZhbHVlO1xuXG5cdFx0YnVzYm95Lm9uIFwiZmluaXNoXCIsICAoKSAtPlxuXHRcdFx0IyBQYXNzIHRoZSBmaWxlIGFycmF5IHRvZ2V0aGVyIHdpdGggdGhlIHJlcXVlc3Rcblx0XHRcdHJlcS5maWxlcyA9IGZpbGVzO1xuXG5cdFx0XHRGaWJlciAoKS0+XG5cdFx0XHRcdG5leHQoKTtcblx0XHRcdC5ydW4oKTtcblxuXHRcdCMgUGFzcyByZXF1ZXN0IHRvIGJ1c2JveVxuXHRcdHJlcS5waXBlKGJ1c2JveSk7XG5cblx0ZWxzZVxuXHRcdG5leHQoKTtcblxuXG4jSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZShKc29uUm91dGVzLnBhcnNlRmlsZXMpOyIsInZhciBCdXNib3ksIEZpYmVyO1xuXG5CdXNib3kgPSByZXF1aXJlKCdidXNib3knKTtcblxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuSnNvblJvdXRlcy5wYXJzZUZpbGVzID0gZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJ1c2JveSwgZmlsZXM7XG4gIGZpbGVzID0gW107XG4gIGlmIChyZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgIGJ1c2JveSA9IG5ldyBCdXNib3koe1xuICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnNcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWxlXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkge1xuICAgICAgdmFyIGJ1ZmZlcnMsIGltYWdlO1xuICAgICAgaW1hZ2UgPSB7fTtcbiAgICAgIGltYWdlLm1pbWVUeXBlID0gbWltZXR5cGU7XG4gICAgICBpbWFnZS5lbmNvZGluZyA9IGVuY29kaW5nO1xuICAgICAgaW1hZ2UuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbiAgICAgIGJ1ZmZlcnMgPSBbXTtcbiAgICAgIGZpbGUub24oJ2RhdGEnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHJldHVybiBidWZmZXJzLnB1c2goZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmaWxlLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaW1hZ2UuZGF0YSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycyk7XG4gICAgICAgIHJldHVybiBmaWxlcy5wdXNoKGltYWdlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpZWxkXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXEuYm9keVtmaWVsZG5hbWVdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgYnVzYm95Lm9uKFwiZmluaXNoXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgcmVxLmZpbGVzID0gZmlsZXM7XG4gICAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICB9KS5ydW4oKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVxLnBpcGUoYnVzYm95KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG59O1xuIiwiQEF1dGggb3I9IHt9XG5cbiMjI1xuICBBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXG4jIyNcbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZSAodXNlcikgLT5cbiAgY2hlY2sgdXNlcixcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcblxuICBpZiBfLmtleXModXNlcikubGVuZ3RoIGlzIG5vdCAxXG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yICdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJ1xuXG4gIHJldHVybiB0cnVlXG5cblxuIyMjXG4gIFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcbiMjI1xuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSAodXNlcikgLT5cbiAgaWYgdXNlci5pZFxuICAgIHJldHVybiB7J19pZCc6IHVzZXIuaWR9XG4gIGVsc2UgaWYgdXNlci51c2VybmFtZVxuICAgIHJldHVybiB7J3VzZXJuYW1lJzogdXNlci51c2VybmFtZX1cbiAgZWxzZSBpZiB1c2VyLmVtYWlsXG4gICAgcmV0dXJuIHsnZW1haWxzLmFkZHJlc3MnOiB1c2VyLmVtYWlsfVxuXG4gICMgV2Ugc2hvdWxkbid0IGJlIGhlcmUgaWYgdGhlIHVzZXIgb2JqZWN0IHdhcyBwcm9wZXJseSB2YWxpZGF0ZWRcbiAgdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJ1xuXG5cbiMjI1xuICBMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcbiMjI1xuQEF1dGgubG9naW5XaXRoUGFzc3dvcmQgPSAodXNlciwgcGFzc3dvcmQpIC0+XG4gIGlmIG5vdCB1c2VyIG9yIG5vdCBwYXNzd29yZFxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG4gICMgVmFsaWRhdGUgdGhlIGxvZ2luIGlucHV0IHR5cGVzXG4gIGNoZWNrIHVzZXIsIHVzZXJWYWxpZGF0b3JcbiAgY2hlY2sgcGFzc3dvcmQsIFN0cmluZ1xuXG4gICMgUmV0cmlldmUgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2VcbiAgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IgPSBnZXRVc2VyUXVlcnlTZWxlY3Rvcih1c2VyKVxuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvcilcblxuICBpZiBub3QgYXV0aGVudGljYXRpbmdVc2VyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG4gIGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXM/LnBhc3N3b3JkXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cbiAgIyBBdXRoZW50aWNhdGUgdGhlIHVzZXIncyBwYXNzd29yZFxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmRcbiAgaWYgcGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3JcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuICAjIEFkZCBhIG5ldyBhdXRoIHRva2VuIHRvIHRoZSB1c2VyJ3MgYWNjb3VudFxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpXG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4gYXV0aFRva2VuXG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuXG5cbiAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkfSkuZmV0Y2goKVxuICBzcGFjZXMgPSBbXVxuICBfLmVhY2ggc3BhY2VfdXNlcnMsIChzdSktPlxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3Uuc3BhY2UpXG4gICAgIyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXG4gICAgaWYgc3BhY2UgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcik+PTBcbiAgICAgIHNwYWNlcy5wdXNoXG4gICAgICAgIF9pZDogc3BhY2UuX2lkXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcbiAgcmV0dXJuIHthdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbiwgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBhZG1pblNwYWNlczogc3BhY2VzfVxuIiwidmFyIGdldFVzZXJRdWVyeVNlbGVjdG9yLCB1c2VyVmFsaWRhdG9yO1xuXG50aGlzLkF1dGggfHwgKHRoaXMuQXV0aCA9IHt9KTtcblxuXG4vKlxuICBBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXG4gKi9cblxudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlKGZ1bmN0aW9uKHVzZXIpIHtcbiAgY2hlY2sodXNlciwge1xuICAgIGlkOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpXG4gIH0pO1xuICBpZiAoXy5rZXlzKHVzZXIpLmxlbmd0aCA9PT0gITEpIHtcbiAgICB0aHJvdyBuZXcgTWF0Y2guRXJyb3IoJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5cbi8qXG4gIFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcbiAqL1xuXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgaWYgKHVzZXIuaWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ19pZCc6IHVzZXIuaWRcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIudXNlcm5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3VzZXJuYW1lJzogdXNlci51c2VybmFtZVxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci5lbWFpbCkge1xuICAgIHJldHVybiB7XG4gICAgICAnZW1haWxzLmFkZHJlc3MnOiB1c2VyLmVtYWlsXG4gICAgfTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInKTtcbn07XG5cblxuLypcbiAgTG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXG4gKi9cblxudGhpcy5BdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gZnVuY3Rpb24odXNlciwgcGFzc3dvcmQpIHtcbiAgdmFyIGF1dGhUb2tlbiwgYXV0aGVudGljYXRpbmdVc2VyLCBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciwgaGFzaGVkVG9rZW4sIHBhc3N3b3JkVmVyaWZpY2F0aW9uLCByZWYsIHNwYWNlX3VzZXJzLCBzcGFjZXM7XG4gIGlmICghdXNlciB8fCAhcGFzc3dvcmQpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGNoZWNrKHVzZXIsIHVzZXJWYWxpZGF0b3IpO1xuICBjaGVjayhwYXNzd29yZCwgU3RyaW5nKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IgPSBnZXRVc2VyUXVlcnlTZWxlY3Rvcih1c2VyKTtcbiAgYXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpO1xuICBpZiAoIWF1dGhlbnRpY2F0aW5nVXNlcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgaWYgKCEoKHJlZiA9IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IHJlZi5wYXNzd29yZCA6IHZvaWQgMCkpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQoYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZCk7XG4gIGlmIChwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvcikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgYXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKTtcbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbihhdXRoVG9rZW4pO1xuICBBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbihhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlbik7XG4gIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZFxuICB9KS5mZXRjaCgpO1xuICBzcGFjZXMgPSBbXTtcbiAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbihzdSkge1xuICAgIHZhciBzcGFjZTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKTtcbiAgICBpZiAoc3BhY2UgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcikgPj0gMCkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHtcbiAgICAgICAgX2lkOiBzcGFjZS5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7XG4gICAgYXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sXG4gICAgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLFxuICAgIGFkbWluU3BhY2VzOiBzcGFjZXNcbiAgfTtcbn07XG4iLCIvLyBXZSBuZWVkIGEgZnVuY3Rpb24gdGhhdCB0cmVhdHMgdGhyb3duIGVycm9ycyBleGFjdGx5IGxpa2UgSXJvbiBSb3V0ZXIgd291bGQuXG4vLyBUaGlzIGZpbGUgaXMgd3JpdHRlbiBpbiBKYXZhU2NyaXB0IHRvIGVuYWJsZSBjb3B5LXBhc3RpbmcgSXJvbiBSb3V0ZXIgY29kZS5cblxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMM1xudmFyIGVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XG5cbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDQ3XG5pcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSA9IGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzKSB7XG4gIGlmIChyZXMuc3RhdHVzQ29kZSA8IDQwMClcbiAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcblxuICBpZiAoZXJyLnN0YXR1cylcbiAgICByZXMuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXM7XG5cbiAgaWYgKGVudiA9PT0gJ2RldmVsb3BtZW50JylcbiAgICBtc2cgPSAoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKSArICdcXG4nO1xuICBlbHNlXG4gICAgLy9YWFggZ2V0IHRoaXMgZnJvbSBzdGFuZGFyZCBkaWN0IG9mIGVycm9yIG1lc3NhZ2VzP1xuICAgIG1zZyA9ICdTZXJ2ZXIgZXJyb3IuJztcblxuICBjb25zb2xlLmVycm9yKGVyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKSk7XG5cbiAgaWYgKHJlcy5oZWFkZXJzU2VudClcbiAgICByZXR1cm4gcmVxLnNvY2tldC5kZXN0cm95KCk7XG5cbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIEJ1ZmZlci5ieXRlTGVuZ3RoKG1zZykpO1xuICBpZiAocmVxLm1ldGhvZCA9PT0gJ0hFQUQnKVxuICAgIHJldHVybiByZXMuZW5kKCk7XG4gIHJlcy5lbmQobXNnKTtcbiAgcmV0dXJuO1xufVxuIiwiY2xhc3Mgc2hhcmUuUm91dGVcblxuICBjb25zdHJ1Y3RvcjogKEBhcGksIEBwYXRoLCBAb3B0aW9ucywgQGVuZHBvaW50cykgLT5cbiAgICAjIENoZWNrIGlmIG9wdGlvbnMgd2VyZSBwcm92aWRlZFxuICAgIGlmIG5vdCBAZW5kcG9pbnRzXG4gICAgICBAZW5kcG9pbnRzID0gQG9wdGlvbnNcbiAgICAgIEBvcHRpb25zID0ge31cblxuXG4gIGFkZFRvQXBpOiBkbyAtPlxuICAgIGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddXG5cbiAgICByZXR1cm4gLT5cbiAgICAgIHNlbGYgPSB0aGlzXG5cbiAgICAgICMgVGhyb3cgYW4gZXJyb3IgaWYgYSByb3V0ZSBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIGF0IHRoaXMgcGF0aFxuICAgICAgIyBUT0RPOiBDaGVjayBmb3IgY29sbGlzaW9ucyB3aXRoIHBhdGhzIHRoYXQgZm9sbG93IHNhbWUgcGF0dGVybiB3aXRoIGRpZmZlcmVudCBwYXJhbWV0ZXIgbmFtZXNcbiAgICAgIGlmIF8uY29udGFpbnMgQGFwaS5fY29uZmlnLnBhdGhzLCBAcGF0aFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgYWRkIGEgcm91dGUgYXQgYW4gZXhpc3RpbmcgcGF0aDogI3tAcGF0aH1cIlxuXG4gICAgICAjIE92ZXJyaWRlIHRoZSBkZWZhdWx0IE9QVElPTlMgZW5kcG9pbnQgd2l0aCBvdXIgb3duXG4gICAgICBAZW5kcG9pbnRzID0gXy5leHRlbmQgb3B0aW9uczogQGFwaS5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQsIEBlbmRwb2ludHNcblxuICAgICAgIyBDb25maWd1cmUgZWFjaCBlbmRwb2ludCBvbiB0aGlzIHJvdXRlXG4gICAgICBAX3Jlc29sdmVFbmRwb2ludHMoKVxuICAgICAgQF9jb25maWd1cmVFbmRwb2ludHMoKVxuXG4gICAgICAjIEFkZCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyBwYXRoc1xuICAgICAgQGFwaS5fY29uZmlnLnBhdGhzLnB1c2ggQHBhdGhcblxuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlciBhdmFpbGFibGVNZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcbiAgICAgIHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0IGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKVxuXG4gICAgICAjIFNldHVwIGVuZHBvaW50cyBvbiByb3V0ZVxuICAgICAgZnVsbFBhdGggPSBAYXBpLl9jb25maWcuYXBpUGF0aCArIEBwYXRoXG4gICAgICBfLmVhY2ggYWxsb3dlZE1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXVxuICAgICAgICBKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XG4gICAgICAgICAgIyBBZGQgZnVuY3Rpb24gdG8gZW5kcG9pbnQgY29udGV4dCBmb3IgaW5kaWNhdGluZyBhIHJlc3BvbnNlIGhhcyBiZWVuIGluaXRpYXRlZCBtYW51YWxseVxuICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2VcbiAgICAgICAgICBkb25lRnVuYyA9IC0+XG4gICAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IHRydWVcblxuICAgICAgICAgIGVuZHBvaW50Q29udGV4dCA9XG4gICAgICAgICAgICB1cmxQYXJhbXM6IHJlcS5wYXJhbXNcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiByZXEucXVlcnlcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5XG4gICAgICAgICAgICByZXF1ZXN0OiByZXFcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXNcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgIyBBZGQgZW5kcG9pbnQgY29uZmlnIG9wdGlvbnMgdG8gY29udGV4dFxuICAgICAgICAgIF8uZXh0ZW5kIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblxuICAgICAgICAgICMgUnVuIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsXG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICAjIERvIGV4YWN0bHkgd2hhdCBJcm9uIFJvdXRlciB3b3VsZCBoYXZlIGRvbmUsIHRvIGF2b2lkIGNoYW5naW5nIHRoZSBBUElcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgIGlmIHJlc3BvbnNlSW5pdGlhdGVkXG4gICAgICAgICAgICAjIEVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgcHJvcGVybHkgY29tcGxldGVkXG4gICAgICAgICAgICByZXMuZW5kKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIHJlcy5oZWFkZXJzU2VudFxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXG4gICAgICAgICAgICBlbHNlIGlmIHJlc3BvbnNlRGF0YSBpcyBudWxsIG9yIHJlc3BvbnNlRGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IHJldHVybiBudWxsIG9yIHVuZGVmaW5lZCBmcm9tIGFuIGVuZHBvaW50OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxuXG4gICAgICAgICAgIyBHZW5lcmF0ZSBhbmQgcmV0dXJuIHRoZSBodHRwIHJlc3BvbnNlLCBoYW5kbGluZyB0aGUgZGlmZmVyZW50IGVuZHBvaW50IHJlc3BvbnNlIHR5cGVzXG4gICAgICAgICAgaWYgcmVzcG9uc2VEYXRhLmJvZHkgYW5kIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSBvciByZXNwb25zZURhdGEuaGVhZGVycylcbiAgICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YVxuXG4gICAgICBfLmVhY2ggcmVqZWN0ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgIGhlYWRlcnMgPSAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnNcblxuXG4gICMjI1xuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICAgIGZ1bmN0aW9uXG5cbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgIyMjXG4gIF9yZXNvbHZlRW5kcG9pbnRzOiAtPlxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSAtPlxuICAgICAgaWYgXy5pc0Z1bmN0aW9uKGVuZHBvaW50KVxuICAgICAgICBlbmRwb2ludHNbbWV0aG9kXSA9IHthY3Rpb246IGVuZHBvaW50fVxuICAgIHJldHVyblxuXG5cbiAgIyMjXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICAgIGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuXG4gICAgQXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cbiAgICBlbnRpcmUgcm91dGUsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZCBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbFxuICAgIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuXG4gICAgQWZ0ZXIgdGhlIGVuZHBvaW50IGlzIGNvbmZpZ3VyZWQsIGFsbCBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudHMgb2YgYW4gZW5kcG9pbnQgY2FuIGJlXG4gICAgYWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgICByZXNwZWN0aXZlbHkuXG5cbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICMjI1xuICBfY29uZmlndXJlRW5kcG9pbnRzOiAtPlxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCkgLT5cbiAgICAgIGlmIG1ldGhvZCBpc250ICdvcHRpb25zJ1xuICAgICAgICAjIENvbmZpZ3VyZSBhY2NlcHRhYmxlIHJvbGVzXG4gICAgICAgIGlmIG5vdCBAb3B0aW9ucz8ucm9sZVJlcXVpcmVkXG4gICAgICAgICAgQG9wdGlvbnMucm9sZVJlcXVpcmVkID0gW11cbiAgICAgICAgaWYgbm90IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdXG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24gZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBAb3B0aW9ucy5yb2xlUmVxdWlyZWRcbiAgICAgICAgIyBNYWtlIGl0IGVhc2llciB0byBjaGVjayBpZiBubyByb2xlcyBhcmUgcmVxdWlyZWRcbiAgICAgICAgaWYgXy5pc0VtcHR5IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IGZhbHNlXG5cbiAgICAgICAgIyBDb25maWd1cmUgYXV0aCByZXF1aXJlbWVudFxuICAgICAgICBpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgQG9wdGlvbnM/LmF1dGhSZXF1aXJlZCBvciBlbmRwb2ludC5yb2xlUmVxdWlyZWRcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSBmYWxzZVxuXG4gICAgICAgIGlmIEBvcHRpb25zPy5zcGFjZVJlcXVpcmVkXG4gICAgICAgICAgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCA9IEBvcHRpb25zLnNwYWNlUmVxdWlyZWRcbiAgICAgICAgcmV0dXJuXG4gICAgLCB0aGlzXG4gICAgcmV0dXJuXG5cblxuICAjIyNcbiAgICBBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG5cbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgIyMjXG4gIF9jYWxsRW5kcG9pbnQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuICAgICMgQ2FsbCB0aGUgZW5kcG9pbnQgaWYgYXV0aGVudGljYXRpb24gZG9lc24ndCBmYWlsXG4gICAgaWYgQF9hdXRoQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgaWYgQF9yb2xlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICBpZiBAX3NwYWNlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICAgICNlbmRwb2ludC5hY3Rpb24uY2FsbCBlbmRwb2ludENvbnRleHRcbiAgICAgICAgICBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uXG4gICAgICAgICAgICBpc1NpbXVsYXRpb246IHRydWUsXG4gICAgICAgICAgICB1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXG4gICAgICAgICAgICBjb25uZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgcmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcbiAgICAgICBcbiAgICAgICAgICByZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUgaW52b2NhdGlvbiwgLT5cbiAgICAgICAgICAgIHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzXG4gICAgICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLid9XG4gICAgICBlbHNlXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwM1xuICAgICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nfVxuICAgIGVsc2VcbiAgICAgIHN0YXR1c0NvZGU6IDQwMVxuICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLid9XG5cblxuICAjIyNcbiAgICBBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG5cbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gICAgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG5cbiAgICBAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG4gICMjI1xuICBfYXV0aEFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWRcbiAgICAgIEBfYXV0aGVudGljYXRlIGVuZHBvaW50Q29udGV4dFxuICAgIGVsc2UgdHJ1ZVxuXG5cbiAgIyMjXG4gICAgVmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcblxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cblxuICAgIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAjIyNcbiAgX2F1dGhlbnRpY2F0ZTogKGVuZHBvaW50Q29udGV4dCkgLT5cbiAgICAjIEdldCBhdXRoIGluZm9cbiAgICBhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcblxuICAgICMgR2V0IHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgaWYgYXV0aD8udXNlcklkIGFuZCBhdXRoPy50b2tlbiBhbmQgbm90IGF1dGg/LnVzZXJcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9XG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWRcbiAgICAgIHVzZXJTZWxlY3RvcltAYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuXG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSB1c2VyU2VsZWN0b3JcblxuICAgICMgQXR0YWNoIHRoZSB1c2VyIGFuZCB0aGVpciBJRCB0byB0aGUgY29udGV4dCBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICBpZiBhdXRoPy51c2VyXG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlclxuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWRcbiAgICAgIHRydWVcbiAgICBlbHNlIGZhbHNlXG5cbiAgIyMjXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcblxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cblxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgIyMjXG4gIF9zcGFjZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5zcGFjZVJlcXVpcmVkXG4gICAgICBhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcbiAgICAgIGlmIGF1dGg/LnNwYWNlSWRcbiAgICAgICAgc3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoLnVzZXJJZCwgc3BhY2U6YXV0aC5zcGFjZUlkfSkuY291bnQoKVxuICAgICAgICBpZiBzcGFjZV91c2Vyc19jb3VudFxuICAgICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKVxuICAgICAgICAgICMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xuICAgICAgICAgIGlmIHNwYWNlIGFuZCBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCk+PTBcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuXG4gICMjI1xuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG5cbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG5cbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICAgICAgICAgICAgIGVuZHBvaW50XG4gICMjI1xuICBfcm9sZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5yb2xlUmVxdWlyZWRcbiAgICAgIGlmIF8uaXNFbXB0eSBfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB0cnVlXG5cblxuICAjIyNcbiAgICBSZXNwb25kIHRvIGFuIEhUVFAgcmVxdWVzdFxuICAjIyNcbiAgX3Jlc3BvbmQ6IChyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZT0yMDAsIGhlYWRlcnM9e30pIC0+XG4gICAgIyBPdmVycmlkZSBhbnkgZGVmYXVsdCBoZWFkZXJzIHRoYXQgaGF2ZSBiZWVuIHByb3ZpZGVkIChrZXlzIGFyZSBub3JtYWxpemVkIHRvIGJlIGNhc2UgaW5zZW5zaXRpdmUpXG4gICAgIyBUT0RPOiBDb25zaWRlciBvbmx5IGxvd2VyY2FzaW5nIHRoZSBoZWFkZXIga2V5cyB3ZSBuZWVkIG5vcm1hbGl6ZWQsIGxpa2UgQ29udGVudC1UeXBlXG4gICAgZGVmYXVsdEhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgQGFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzXG4gICAgaGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBoZWFkZXJzXG4gICAgaGVhZGVycyA9IF8uZXh0ZW5kIGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzXG5cbiAgICAjIFByZXBhcmUgSlNPTiBib2R5IGZvciByZXNwb25zZSB3aGVuIENvbnRlbnQtVHlwZSBpbmRpY2F0ZXMgSlNPTiB0eXBlXG4gICAgaWYgaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pIGlzbnQgbnVsbFxuICAgICAgaWYgQGFwaS5fY29uZmlnLnByZXR0eUpzb25cbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHksIHVuZGVmaW5lZCwgMlxuICAgICAgZWxzZVxuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keVxuXG4gICAgIyBTZW5kIHJlc3BvbnNlXG4gICAgc2VuZFJlc3BvbnNlID0gLT5cbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCBzdGF0dXNDb2RlLCBoZWFkZXJzXG4gICAgICByZXNwb25zZS53cml0ZSBib2R5XG4gICAgICByZXNwb25zZS5lbmQoKVxuICAgIGlmIHN0YXR1c0NvZGUgaW4gWzQwMSwgNDAzXVxuICAgICAgIyBIYWNrZXJzIGNhbiBtZWFzdXJlIHRoZSByZXNwb25zZSB0aW1lIHRvIGRldGVybWluZSB0aGluZ3MgbGlrZSB3aGV0aGVyIHRoZSA0MDEgcmVzcG9uc2Ugd2FzIFxuICAgICAgIyBjYXVzZWQgYnkgYmFkIHVzZXIgaWQgdnMgYmFkIHBhc3N3b3JkLlxuICAgICAgIyBJbiBkb2luZyBzbywgdGhleSBjYW4gZmlyc3Qgc2NhbiBmb3IgdmFsaWQgdXNlciBpZHMgcmVnYXJkbGVzcyBvZiB2YWxpZCBwYXNzd29yZHMuXG4gICAgICAjIERlbGF5IGJ5IGEgcmFuZG9tIGFtb3VudCB0byByZWR1Y2UgdGhlIGFiaWxpdHkgZm9yIGEgaGFja2VyIHRvIGRldGVybWluZSB0aGUgcmVzcG9uc2UgdGltZS5cbiAgICAgICMgU2VlIGh0dHBzOi8vd3d3Lm93YXNwLm9yZy9pbmRleC5waHAvQmxvY2tpbmdfQnJ1dGVfRm9yY2VfQXR0YWNrcyNGaW5kaW5nX090aGVyX0NvdW50ZXJtZWFzdXJlc1xuICAgICAgIyBTZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGltaW5nX2F0dGFja1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDBcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKClcbiAgICAgIGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvXG4gICAgICBNZXRlb3Iuc2V0VGltZW91dCBzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHNcbiAgICBlbHNlXG4gICAgICBzZW5kUmVzcG9uc2UoKVxuXG4gICMjI1xuICAgIFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcbiAgIyMjXG4gIF9sb3dlckNhc2VLZXlzOiAob2JqZWN0KSAtPlxuICAgIF8uY2hhaW4gb2JqZWN0XG4gICAgLnBhaXJzKClcbiAgICAubWFwIChhdHRyKSAtPlxuICAgICAgW2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV1cbiAgICAub2JqZWN0KClcbiAgICAudmFsdWUoKVxuIiwic2hhcmUuUm91dGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJvdXRlKGFwaSwgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzMSkge1xuICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmVuZHBvaW50cyA9IGVuZHBvaW50czE7XG4gICAgaWYgKCF0aGlzLmVuZHBvaW50cykge1xuICAgICAgdGhpcy5lbmRwb2ludHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBSb3V0ZS5wcm90b3R5cGUuYWRkVG9BcGkgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF2YWlsYWJsZU1ldGhvZHM7XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ107XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFsbG93ZWRNZXRob2RzLCBmdWxsUGF0aCwgcmVqZWN0ZWRNZXRob2RzLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoXy5jb250YWlucyh0aGlzLmFwaS5fY29uZmlnLnBhdGhzLCB0aGlzLnBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiBcIiArIHRoaXMucGF0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgb3B0aW9uczogdGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XG4gICAgICB9LCB0aGlzLmVuZHBvaW50cyk7XG4gICAgICB0aGlzLl9yZXNvbHZlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuYXBpLl9jb25maWcucGF0aHMucHVzaCh0aGlzLnBhdGgpO1xuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlcihhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIGZ1bGxQYXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hcGlQYXRoICsgdGhpcy5wYXRoO1xuICAgICAgXy5lYWNoKGFsbG93ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50O1xuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF07XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBkb25lRnVuYywgZW5kcG9pbnRDb250ZXh0LCBlcnJvciwgcmVzcG9uc2VEYXRhLCByZXNwb25zZUluaXRpYXRlZDtcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlO1xuICAgICAgICAgIGRvbmVGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID0ge1xuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeSxcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5LFxuICAgICAgICAgICAgcmVxdWVzdDogcmVxLFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlcyxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfLmV4dGVuZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZUluaXRpYXRlZCkge1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLmhlYWRlcnNTZW50KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VEYXRhID09PSBudWxsIHx8IHJlc3BvbnNlRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlRGF0YS5ib2R5ICYmIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSB8fCByZXNwb25zZURhdGEuaGVhZGVycykpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlamVjdGVkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBoZWFkZXJzLCByZXNwb25zZURhdGE7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCk7XG5cblxuICAvKlxuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICAgIGZ1bmN0aW9uXG4gIFxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc29sdmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbmRwb2ludCkpIHtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50c1ttZXRob2RdID0ge1xuICAgICAgICAgIGFjdGlvbjogZW5kcG9pbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICAgIGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuICBcbiAgICBBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICAgIGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG4gICAgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuICAgIGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG4gICAgcmVzcGVjdGl2ZWx5LlxuICBcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY29uZmlndXJlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kKSB7XG4gICAgICB2YXIgcmVmLCByZWYxLCByZWYyO1xuICAgICAgaWYgKG1ldGhvZCAhPT0gJ29wdGlvbnMnKSB7XG4gICAgICAgIGlmICghKChyZWYgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYucm9sZVJlcXVpcmVkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkKTtcbiAgICAgICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludC5yb2xlUmVxdWlyZWQpKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKCgocmVmMSA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjEuYXV0aFJlcXVpcmVkIDogdm9pZCAwKSB8fCBlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHJlZjIgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYyLnNwYWNlUmVxdWlyZWQgOiB2b2lkIDApIHtcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gdGhpcy5vcHRpb25zLnNwYWNlUmVxdWlyZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIGFuIGVuZHBvaW50IGlmIHJlcXVpcmVkLCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdFxuICBcbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jYWxsRW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGludm9jYXRpb247XG4gICAgaWYgKHRoaXMuX2F1dGhBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgaWYgKHRoaXMuX3JvbGVBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICBpZiAodGhpcy5fc3BhY2VBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb24oe1xuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlKGludm9jYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuICBcbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gICAgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2F1dGhlbnRpY2F0ZShlbmRwb2ludENvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG4gIFxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cbiAgXG4gICAgQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aGVudGljYXRlID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0KSB7XG4gICAgdmFyIGF1dGgsIHVzZXJTZWxlY3RvcjtcbiAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgIGlmICgoYXV0aCAhPSBudWxsID8gYXV0aC51c2VySWQgOiB2b2lkIDApICYmIChhdXRoICE9IG51bGwgPyBhdXRoLnRva2VuIDogdm9pZCAwKSAmJiAhKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkpIHtcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9O1xuICAgICAgdXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkO1xuICAgICAgdXNlclNlbGVjdG9yW3RoaXMuYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuO1xuICAgICAgYXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUodXNlclNlbGVjdG9yKTtcbiAgICB9XG4gICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkge1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXI7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9zcGFjZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBhdXRoLCBzcGFjZSwgc3BhY2VfdXNlcnNfY291bnQ7XG4gICAgaWYgKGVuZHBvaW50LnNwYWNlUmVxdWlyZWQpIHtcbiAgICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC5zcGFjZUlkIDogdm9pZCAwKSB7XG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgdXNlcjogYXV0aC51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IGF1dGguc3BhY2VJZFxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcnNfY291bnQpIHtcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKHNwYWNlICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIGF1dGgudXNlcklkKSA+PSAwKSB7XG4gICAgICAgICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IGF1dGguc3BhY2VJZDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcbiAgXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICAgICAgICAgICAgIGVuZHBvaW50XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcm9sZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIGlmIChlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgIGlmIChfLmlzRW1wdHkoXy5pbnRlcnNlY3Rpb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBlbmRwb2ludENvbnRleHQudXNlci5yb2xlcykpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKlxuICAgIFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzcG9uZCA9IGZ1bmN0aW9uKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlLCBoZWFkZXJzKSB7XG4gICAgdmFyIGRlZmF1bHRIZWFkZXJzLCBkZWxheUluTWlsbGlzZWNvbmRzLCBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcywgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28sIHNlbmRSZXNwb25zZTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PSBudWxsKSB7XG4gICAgICBzdGF0dXNDb2RlID0gMjAwO1xuICAgIH1cbiAgICBpZiAoaGVhZGVycyA9PSBudWxsKSB7XG4gICAgICBoZWFkZXJzID0ge307XG4gICAgfVxuICAgIGRlZmF1bHRIZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyh0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyhoZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gXy5leHRlbmQoZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnMpO1xuICAgIGlmIChoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFwaS5fY29uZmlnLnByZXR0eUpzb24pIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHksIHZvaWQgMCwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuICAgICAgcmVzcG9uc2Uud3JpdGUoYm9keSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZW5kKCk7XG4gICAgfTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAxIHx8IHN0YXR1c0NvZGUgPT09IDQwMykge1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDA7XG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd287XG4gICAgICByZXR1cm4gTWV0ZW9yLnNldFRpbWVvdXQoc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSgpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgUmV0dXJuIHRoZSBvYmplY3Qgd2l0aCBhbGwgb2YgdGhlIGtleXMgY29udmVydGVkIHRvIGxvd2VyY2FzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2xvd2VyQ2FzZUtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gXy5jaGFpbihvYmplY3QpLnBhaXJzKCkubWFwKGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHJldHVybiBbYXR0clswXS50b0xvd2VyQ2FzZSgpLCBhdHRyWzFdXTtcbiAgICB9KS5vYmplY3QoKS52YWx1ZSgpO1xuICB9O1xuXG4gIHJldHVybiBSb3V0ZTtcblxufSkoKTtcbiIsImNsYXNzIEBSZXN0aXZ1c1xuXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cbiAgICBAX3JvdXRlcyA9IFtdXG4gICAgQF9jb25maWcgPVxuICAgICAgcGF0aHM6IFtdXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2VcbiAgICAgIGFwaVBhdGg6ICdhcGkvJ1xuICAgICAgdmVyc2lvbjogbnVsbFxuICAgICAgcHJldHR5SnNvbjogZmFsc2VcbiAgICAgIGF1dGg6XG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJ1xuICAgICAgICB1c2VyOiAtPlxuICAgICAgICAgIGlmIEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXVxuICAgICAgICAgIGlmIEByZXF1ZXN0LnVzZXJJZFxuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IEByZXF1ZXN0LnVzZXJJZH0pXG4gICAgICAgICAgICB1c2VyOiBfdXNlclxuICAgICAgICAgICAgdXNlcklkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXVxuICAgICAgICAgICAgc3BhY2VJZDogQHJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddXG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1c2VySWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddXG4gICAgICAgICAgICBzcGFjZUlkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ11cbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgZGVmYXVsdEhlYWRlcnM6XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIGVuYWJsZUNvcnM6IHRydWVcblxuICAgICMgQ29uZmlndXJlIEFQSSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXG4gICAgXy5leHRlbmQgQF9jb25maWcsIG9wdGlvbnNcblxuICAgIGlmIEBfY29uZmlnLmVuYWJsZUNvcnNcbiAgICAgIGNvcnNIZWFkZXJzID1cbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0J1xuXG4gICAgICBpZiBAX2NvbmZpZy51c2VEZWZhdWx0QXV0aFxuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuJ1xuXG4gICAgICAjIFNldCBkZWZhdWx0IGhlYWRlciB0byBlbmFibGUgQ09SUyBpZiBjb25maWd1cmVkXG4gICAgICBfLmV4dGVuZCBAX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnNcblxuICAgICAgaWYgbm90IEBfY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcbiAgICAgICAgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IC0+XG4gICAgICAgICAgQHJlc3BvbnNlLndyaXRlSGVhZCAyMDAsIGNvcnNIZWFkZXJzXG4gICAgICAgICAgQGRvbmUoKVxuXG4gICAgIyBOb3JtYWxpemUgdGhlIEFQSSBwYXRoXG4gICAgaWYgQF9jb25maWcuYXBpUGF0aFswXSBpcyAnLydcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoLnNsaWNlIDFcbiAgICBpZiBfLmxhc3QoQF9jb25maWcuYXBpUGF0aCkgaXNudCAnLydcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoICsgJy8nXG5cbiAgICAjIFVSTCBwYXRoIHZlcnNpb25pbmcgaXMgdGhlIG9ubHkgdHlwZSBvZiBBUEkgdmVyc2lvbmluZyBjdXJyZW50bHkgYXZhaWxhYmxlLCBzbyBpZiBhIHZlcnNpb24gaXNcbiAgICAjIHByb3ZpZGVkLCBhcHBlbmQgaXQgdG8gdGhlIGJhc2UgcGF0aCBvZiB0aGUgQVBJXG4gICAgaWYgQF9jb25maWcudmVyc2lvblxuICAgICAgQF9jb25maWcuYXBpUGF0aCArPSBAX2NvbmZpZy52ZXJzaW9uICsgJy8nXG5cbiAgICAjIEFkZCBkZWZhdWx0IGxvZ2luIGFuZCBsb2dvdXQgZW5kcG9pbnRzIGlmIGF1dGggaXMgY29uZmlndXJlZFxuICAgIGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXG4gICAgICBAX2luaXRBdXRoKClcbiAgICBlbHNlIGlmIEBfY29uZmlnLnVzZUF1dGhcbiAgICAgIEBfaW5pdEF1dGgoKVxuICAgICAgY29uc29sZS53YXJuICdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgK1xuICAgICAgICAgICdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCdcblxuICAgIHJldHVybiB0aGlzXG5cblxuICAjIyMqXG4gICAgQWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuXG4gICAgQHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuICAgIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgIEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG4gICAgQHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuICAgICAgICBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG4gICAgICAgIGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cbiAgIyMjXG4gIGFkZFJvdXRlOiAocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSAtPlxuICAgICMgQ3JlYXRlIGEgbmV3IHJvdXRlIGFuZCBhZGQgaXQgdG8gb3VyIGxpc3Qgb2YgZXhpc3Rpbmcgcm91dGVzXG4gICAgcm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKVxuICAgIEBfcm91dGVzLnB1c2gocm91dGUpXG5cbiAgICByb3V0ZS5hZGRUb0FwaSgpXG5cbiAgICByZXR1cm4gdGhpc1xuXG5cbiAgIyMjKlxuICAgIEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgIyMjXG4gIGFkZENvbGxlY3Rpb246IChjb2xsZWN0aW9uLCBvcHRpb25zPXt9KSAtPlxuICAgIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ11cbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddXG5cbiAgICAjIEdyYWIgdGhlIHNldCBvZiBlbmRwb2ludHNcbiAgICBpZiBjb2xsZWN0aW9uIGlzIE1ldGVvci51c2Vyc1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IEBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHNcbiAgICBlbHNlXG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF9jb2xsZWN0aW9uRW5kcG9pbnRzXG5cbiAgICAjIEZsYXR0ZW4gdGhlIG9wdGlvbnMgYW5kIHNldCBkZWZhdWx0cyBpZiBuZWNlc3NhcnlcbiAgICBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyBvciB7fVxuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIG9yIHt9XG4gICAgZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIG9yIFtdXG4gICAgIyBVc2UgY29sbGVjdGlvbiBuYW1lIGFzIGRlZmF1bHQgcGF0aFxuICAgIHBhdGggPSBvcHRpb25zLnBhdGggb3IgY29sbGVjdGlvbi5fbmFtZVxuXG4gICAgIyBTZXBhcmF0ZSB0aGUgcmVxdWVzdGVkIGVuZHBvaW50cyBieSB0aGUgcm91dGUgdGhleSBiZWxvbmcgdG8gKG9uZSBmb3Igb3BlcmF0aW5nIG9uIHRoZSBlbnRpcmVcbiAgICAjIGNvbGxlY3Rpb24gYW5kIG9uZSBmb3Igb3BlcmF0aW5nIG9uIGEgc2luZ2xlIGVudGl0eSB3aXRoaW4gdGhlIGNvbGxlY3Rpb24pXG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge31cbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9XG4gICAgaWYgXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgYW5kIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cylcbiAgICAgICMgR2VuZXJhdGUgYWxsIGVuZHBvaW50cyBvbiB0aGlzIGNvbGxlY3Rpb25cbiAgICAgIF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICAjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcbiAgICAgICAgaWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cbiAgICAgICAgICBfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG4gICAgICAgIGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG4gICAgICAgIHJldHVyblxuICAgICAgLCB0aGlzXG4gICAgZWxzZVxuICAgICAgIyBHZW5lcmF0ZSBhbnkgZW5kcG9pbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIGV4cGxpY2l0bHkgZXhjbHVkZWRcbiAgICAgIF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBpZiBtZXRob2Qgbm90IGluIGV4Y2x1ZGVkRW5kcG9pbnRzIGFuZCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSBpc250IGZhbHNlXG4gICAgICAgICAgIyBDb25maWd1cmUgZW5kcG9pbnQgYW5kIG1hcCB0byBpdCdzIGh0dHAgbWV0aG9kXG4gICAgICAgICAgIyBUT0RPOiBDb25zaWRlciBwcmVkZWZpbmluZyBhIG1hcCBvZiBtZXRob2RzIHRvIHRoZWlyIGh0dHAgbWV0aG9kIHR5cGUgKGUuZy4sIGdldEFsbDogZ2V0KVxuICAgICAgICAgIGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdXG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge31cbiAgICAgICAgICBfLmVhY2ggY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIChhY3Rpb24sIG1ldGhvZFR5cGUpIC0+XG4gICAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPVxuICAgICAgICAgICAgICBfLmNoYWluIGFjdGlvblxuICAgICAgICAgICAgICAuY2xvbmUoKVxuICAgICAgICAgICAgICAuZXh0ZW5kIGVuZHBvaW50T3B0aW9uc1xuICAgICAgICAgICAgICAudmFsdWUoKVxuICAgICAgICAgICMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xuICAgICAgICAgIGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXG4gICAgICAgICAgICBfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuICAgICAgICAgIGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuICAgICAgICAgIHJldHVyblxuICAgICAgLCB0aGlzXG5cbiAgICAjIEFkZCB0aGUgcm91dGVzIHRvIHRoZSBBUElcbiAgICBAYWRkUm91dGUgcGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHNcbiAgICBAYWRkUm91dGUgXCIje3BhdGh9LzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzXG5cbiAgICByZXR1cm4gdGhpc1xuXG5cbiAgIyMjKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuICAjIyNcbiAgX2NvbGxlY3Rpb25FbmRwb2ludHM6XG4gICAgZ2V0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIHNlbGVjdG9yXG4gICAgICAgICAgaWYgZW50aXR5XG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiAgICBwdXQ6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgcHV0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgJHNldDogQGJvZHlQYXJhbXNcbiAgICAgICAgICBpZiBlbnRpdHlJc1VwZGF0ZWRcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiAgICBkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZGVsZXRlOlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cbiAgICBwb3N0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIHBvc3Q6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcbiAgICAgICAgICAgIEBib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkXG4gICAgICAgICAgZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxuICAgICAgICAgIGlmIGVudGl0eVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnfVxuICAgIGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBnZXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBzZWxlY3RvciA9IHt9XG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpXG4gICAgICAgICAgaWYgZW50aXRpZXNcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ31cblxuXG4gICMjIypcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXG4gICMjI1xuICBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHM6XG4gICAgZ2V0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcbiAgICAgICAgICBpZiBlbnRpdHlcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuICAgIHB1dDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBwdXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBAdXJsUGFyYW1zLmlkLCAkc2V0OiBwcm9maWxlOiBAYm9keVBhcmFtc1xuICAgICAgICAgIGlmIGVudGl0eUlzVXBkYXRlZFxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxuICAgICAgICAgICAge3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cbiAgICBkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZGVsZXRlOlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgaWYgY29sbGVjdGlvbi5yZW1vdmUgQHVybFBhcmFtcy5pZFxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cbiAgICBwb3N0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIHBvc3Q6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICAjIENyZWF0ZSBhIG5ldyB1c2VyIGFjY291bnRcbiAgICAgICAgICBlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIgQGJvZHlQYXJhbXNcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWQsIGZpZWxkczogcHJvZmlsZTogMVxuICAgICAgICAgIGlmIGVudGl0eVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgIHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnfVxuICAgIGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBnZXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwgZmllbGRzOiBwcm9maWxlOiAxKS5mZXRjaCgpXG4gICAgICAgICAgaWYgZW50aXRpZXNcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnfVxuXG5cbiAgIyMjXG4gICAgQWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuICAjIyNcbiAgX2luaXRBdXRoOiAtPlxuICAgIHNlbGYgPSB0aGlzXG4gICAgIyMjXG4gICAgICBBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG5cbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgIyMjXG4gICAgQGFkZFJvdXRlICdsb2dpbicsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSxcbiAgICAgIHBvc3Q6IC0+XG4gICAgICAgICMgR3JhYiB0aGUgdXNlcm5hbWUgb3IgZW1haWwgdGhhdCB0aGUgdXNlciBpcyBsb2dnaW5nIGluIHdpdGhcbiAgICAgICAgdXNlciA9IHt9XG4gICAgICAgIGlmIEBib2R5UGFyYW1zLnVzZXJcbiAgICAgICAgICBpZiBAYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSBpcyAtMVxuICAgICAgICAgICAgdXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMudXNlclxuICAgICAgICBlbHNlIGlmIEBib2R5UGFyYW1zLnVzZXJuYW1lXG4gICAgICAgICAgdXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJuYW1lXG4gICAgICAgIGVsc2UgaWYgQGJvZHlQYXJhbXMuZW1haWxcbiAgICAgICAgICB1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMuZW1haWxcblxuICAgICAgICAjIFRyeSB0byBsb2cgdGhlIHVzZXIgaW50byB0aGUgdXNlcidzIGFjY291bnQgKGlmIHN1Y2Nlc3NmdWwgd2UnbGwgZ2V0IGFuIGF1dGggdG9rZW4gYmFjaylcbiAgICAgICAgdHJ5XG4gICAgICAgICAgYXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQgdXNlciwgQGJvZHlQYXJhbXMucGFzc3dvcmRcbiAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuICAgICAgICAgIHJldHVybiB7fSA9XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yXG4gICAgICAgICAgICBib2R5OiBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6IGUucmVhc29uXG5cbiAgICAgICAgIyBHZXQgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxuICAgICAgICAjIFRPRE86IENvbnNpZGVyIHJldHVybmluZyB0aGUgdXNlciBpbiBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKCksIGluc3RlYWQgb2YgZmV0Y2hpbmcgaXQgYWdhaW4gaGVyZVxuICAgICAgICBpZiBhdXRoLnVzZXJJZCBhbmQgYXV0aC5hdXRoVG9rZW5cbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9XG4gICAgICAgICAgc2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGguYXV0aFRva2VuXG4gICAgICAgICAgQHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXG4gICAgICAgICAgICBzZWFyY2hRdWVyeVxuICAgICAgICAgIEB1c2VySWQgPSBAdXNlcj8uX2lkXG5cbiAgICAgICAgcmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGF1dGh9XG5cbiAgICAgICAgIyBDYWxsIHRoZSBsb2dpbiBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuICAgICAgICBleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbj8uY2FsbCh0aGlzKVxuICAgICAgICBpZiBleHRyYURhdGE/XG4gICAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxuXG4gICAgICAgIHJlc3BvbnNlXG5cbiAgICBsb2dvdXQgPSAtPlxuICAgICAgIyBSZW1vdmUgdGhlIGdpdmVuIGF1dGggdG9rZW4gZnJvbSB0aGUgdXNlcidzIGFjY291bnRcbiAgICAgIGF1dGhUb2tlbiA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoVG9rZW5cbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlblxuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mICcuJ1xuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgMCwgaW5kZXhcbiAgICAgIHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgaW5kZXggKyAxXG4gICAgICB0b2tlblRvUmVtb3ZlID0ge31cbiAgICAgIHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW5cbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge31cbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlXG4gICAgICBNZXRlb3IudXNlcnMudXBkYXRlIEB1c2VyLl9pZCwgeyRwdWxsOiB0b2tlblJlbW92YWxRdWVyeX1cblxuICAgICAgcmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHttZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISd9fVxuXG4gICAgICAjIENhbGwgdGhlIGxvZ291dCBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuICAgICAgZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0Py5jYWxsKHRoaXMpXG4gICAgICBpZiBleHRyYURhdGE/XG4gICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtleHRyYTogZXh0cmFEYXRhfSlcblxuICAgICAgcmVzcG9uc2VcblxuICAgICMjI1xuICAgICAgQWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcblxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICMjI1xuICAgIEBhZGRSb3V0ZSAnbG9nb3V0Jywge2F1dGhSZXF1aXJlZDogdHJ1ZX0sXG4gICAgICBnZXQ6IC0+XG4gICAgICAgIGNvbnNvbGUud2FybiBcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCJcbiAgICAgICAgY29uc29sZS53YXJuIFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiXG4gICAgICAgIHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKVxuICAgICAgcG9zdDogbG9nb3V0XG5cblJlc3RpdnVzID0gQFJlc3RpdnVzXG4iLCJ2YXIgUmVzdGl2dXMsXG4gIGluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxudGhpcy5SZXN0aXZ1cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUmVzdGl2dXMob3B0aW9ucykge1xuICAgIHZhciBjb3JzSGVhZGVycztcbiAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcbiAgICB0aGlzLl9jb25maWcgPSB7XG4gICAgICBwYXRoczogW10sXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2UsXG4gICAgICBhcGlQYXRoOiAnYXBpLycsXG4gICAgICB2ZXJzaW9uOiBudWxsLFxuICAgICAgcHJldHR5SnNvbjogZmFsc2UsXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJyxcbiAgICAgICAgdXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF91c2VyLCB0b2tlbjtcbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddKSB7XG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LnVzZXJJZCkge1xuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnJlcXVlc3QudXNlcklkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXI6IF91c2VyLFxuICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSxcbiAgICAgICAgICAgICAgc3BhY2VJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSxcbiAgICAgICAgICAgICAgc3BhY2VJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBlbmFibGVDb3JzOiB0cnVlXG4gICAgfTtcbiAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcsIG9wdGlvbnMpO1xuICAgIGlmICh0aGlzLl9jb25maWcuZW5hYmxlQ29ycykge1xuICAgICAgY29yc0hlYWRlcnMgPSB7XG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQnXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuJztcbiAgICAgIH1cbiAgICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnMpO1xuICAgICAgaWYgKCF0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCkge1xuICAgICAgICB0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2Uud3JpdGVIZWFkKDIwMCwgY29yc0hlYWRlcnMpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5hcGlQYXRoWzBdID09PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGguc2xpY2UoMSk7XG4gICAgfVxuICAgIGlmIChfLmxhc3QodGhpcy5fY29uZmlnLmFwaVBhdGgpICE9PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGggKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudmVyc2lvbikge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggKz0gdGhpcy5fY29uZmlnLnZlcnNpb24gKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jb25maWcudXNlQXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICAgIGNvbnNvbGUud2FybignV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICsgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgICBBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG4gIFxuICAgIEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcbiAgICBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBSb3V0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICBAcGFyYW0gb3B0aW9ucy5hdXRoUmVxdWlyZWQge0Jvb2xlYW59IFRoZSBkZWZhdWx0IGF1dGggcmVxdWlyZW1lbnQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIGVuZHBvaW50cyB7T2JqZWN0fSBBIHNldCBvZiBlbmRwb2ludHMgYXZhaWxhYmxlIG9uIHRoZSBuZXcgcm91dGUgKGdldCwgcG9zdCwgcHV0LCBwYXRjaCwgZGVsZXRlLCBvcHRpb25zKVxuICAgIEBwYXJhbSBlbmRwb2ludHMuPG1ldGhvZD4ge0Z1bmN0aW9uIG9yIE9iamVjdH0gSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgYWxsIGRlZmF1bHQgcm91dGVcbiAgICAgICAgY29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxuICAgICAgICBhbmQgYWxsIG90aGVyIHJvdXRlIGNvbmZpZyBvcHRpb25zIGF2YWlsYWJsZS4gQW4gYGFjdGlvbmAgbXVzdCBiZSBwcm92aWRlZCB3aXRoIHRoZSBvYmplY3QuXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5hZGRSb3V0ZSA9IGZ1bmN0aW9uKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykge1xuICAgIHZhciByb3V0ZTtcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpO1xuICAgIHRoaXMuX3JvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICByb3V0ZS5hZGRUb0FwaSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAgR2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuYWRkQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbkVuZHBvaW50cywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24sIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kcywgbWV0aG9kc09uQ29sbGVjdGlvbiwgcGF0aCwgcm91dGVPcHRpb25zO1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXTtcbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddO1xuICAgIGlmIChjb2xsZWN0aW9uID09PSBNZXRlb3IudXNlcnMpIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX2NvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfVxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIHx8IHt9O1xuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIHx8IHt9O1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzID0gb3B0aW9ucy5leGNsdWRlZEVuZHBvaW50cyB8fCBbXTtcbiAgICBwYXRoID0gb3B0aW9ucy5wYXRoIHx8IGNvbGxlY3Rpb24uX25hbWU7XG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgJiYgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKSkge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBjb25maWd1cmVkRW5kcG9pbnQsIGVuZHBvaW50T3B0aW9ucztcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kKSA8IDAgJiYgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF07XG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge307XG4gICAgICAgICAgXy5lYWNoKGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCBmdW5jdGlvbihhY3Rpb24sIG1ldGhvZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPSBfLmNoYWluKGFjdGlvbikuY2xvbmUoKS5leHRlbmQoZW5kcG9pbnRPcHRpb25zKS52YWx1ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICAgIHRoaXMuYWRkUm91dGUocGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMpO1xuICAgIHRoaXMuYWRkUm91dGUocGF0aCArIFwiLzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX2NvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZCwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3Rvciwge1xuICAgICAgICAgICAgICAkc2V0OiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQpO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYm9keVBhcmFtcy5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5O1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkO1xuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHRoaXMudXJsUGFyYW1zLmlkKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcztcbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIEFkZCAvbG9naW4gYW5kIC9sb2dvdXQgZW5kcG9pbnRzIHRvIHRoZSBBUElcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl9pbml0QXV0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2dvdXQsIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG5cbiAgICAvKlxuICAgICAgQWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICB0aGlzLmFkZFJvdXRlKCdsb2dpbicsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2VcbiAgICB9LCB7XG4gICAgICBwb3N0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF1dGgsIGUsIGV4dHJhRGF0YSwgcmVmLCByZWYxLCByZXNwb25zZSwgc2VhcmNoUXVlcnksIHVzZXI7XG4gICAgICAgIHVzZXIgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWUpIHtcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy5lbWFpbCkge1xuICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMuZW1haWw7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCh1c2VyLCB0aGlzLmJvZHlQYXJhbXMucGFzc3dvcmQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGUucmVhc29uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXV0aC51c2VySWQgJiYgYXV0aC5hdXRoVG9rZW4pIHtcbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5W3NlbGYuX2NvbmZpZy5hdXRoLnRva2VuXSA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoLmF1dGhUb2tlbik7XG4gICAgICAgICAgdGhpcy51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXG4gICAgICAgICAgfSwgc2VhcmNoUXVlcnkpO1xuICAgICAgICAgIHRoaXMudXNlcklkID0gKHJlZiA9IHRoaXMudXNlcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgZGF0YTogYXV0aFxuICAgICAgICB9O1xuICAgICAgICBleHRyYURhdGEgPSAocmVmMSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluKSAhPSBudWxsID8gcmVmMS5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF1dGhUb2tlbiwgZXh0cmFEYXRhLCBoYXNoZWRUb2tlbiwgaW5kZXgsIHJlZiwgcmVzcG9uc2UsIHRva2VuRmllbGROYW1lLCB0b2tlbkxvY2F0aW9uLCB0b2tlblBhdGgsIHRva2VuUmVtb3ZhbFF1ZXJ5LCB0b2tlblRvUmVtb3ZlO1xuICAgICAgYXV0aFRva2VuID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddO1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlbjtcbiAgICAgIGluZGV4ID0gdG9rZW5Mb2NhdGlvbi5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgICAgdG9rZW5Ub1JlbW92ZSA9IHt9O1xuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlbjtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge307XG4gICAgICB0b2tlblJlbW92YWxRdWVyeVt0b2tlblBhdGhdID0gdG9rZW5Ub1JlbW92ZTtcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUodGhpcy51c2VyLl9pZCwge1xuICAgICAgICAkcHVsbDogdG9rZW5SZW1vdmFsUXVlcnlcbiAgICAgIH0pO1xuICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbWVzc2FnZTogJ1lvdVxcJ3ZlIGJlZW4gbG9nZ2VkIG91dCEnXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBleHRyYURhdGEgPSAocmVmID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0KSAhPSBudWxsID8gcmVmLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICBBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLmFkZFJvdXRlKCdsb2dvdXQnLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWVcbiAgICB9LCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiKTtcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHBvc3Q6IGxvZ291dFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBSZXN0aXZ1cztcblxufSkoKTtcblxuUmVzdGl2dXMgPSB0aGlzLlJlc3RpdnVzO1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgQEFQSSA9IG5ldyBSZXN0aXZ1c1xuICAgICAgICBhcGlQYXRoOiAnc3RlZWRvcy9hcGkvJyxcbiAgICAgICAgdXNlRGVmYXVsdEF1dGg6IHRydWVcbiAgICAgICAgcHJldHR5SnNvbjogdHJ1ZVxuICAgICAgICBlbmFibGVDb3JzOiBmYWxzZVxuICAgICAgICBkZWZhdWx0SGVhZGVyczpcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICB0aGlzLkFQSSA9IG5ldyBSZXN0aXZ1cyh7XG4gICAgYXBpUGF0aDogJ3N0ZWVkb3MvYXBpLycsXG4gICAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gICAgcHJldHR5SnNvbjogdHJ1ZSxcbiAgICBlbmFibGVDb3JzOiBmYWxzZSxcbiAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH1cbiAgfSk7XG59XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRBUEkuYWRkQ29sbGVjdGlvbiBkYi5zcGFjZV91c2VycywgXG5cdFx0ZXhjbHVkZWRFbmRwb2ludHM6IFtdXG5cdFx0cm91dGVPcHRpb25zOlxuXHRcdFx0YXV0aFJlcXVpcmVkOiB0cnVlXG5cdFx0XHRzcGFjZVJlcXVpcmVkOiB0cnVlIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBBUEkuYWRkQ29sbGVjdGlvbihkYi5zcGFjZV91c2Vycywge1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXSxcbiAgICByb3V0ZU9wdGlvbnM6IHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHNwYWNlUmVxdWlyZWQ6IHRydWVcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRBUEkuYWRkQ29sbGVjdGlvbiBkYi5vcmdhbml6YXRpb25zLCBcblx0XHRleGNsdWRlZEVuZHBvaW50czogW11cblx0XHRyb3V0ZU9wdGlvbnM6XG5cdFx0XHRhdXRoUmVxdWlyZWQ6IHRydWVcblx0XHRcdHNwYWNlUmVxdWlyZWQ6IHRydWUiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFQSS5hZGRDb2xsZWN0aW9uKGRiLm9yZ2FuaXphdGlvbnMsIHtcbiAgICBleGNsdWRlZEVuZHBvaW50czogW10sXG4gICAgcm91dGVPcHRpb25zOiB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWUsXG4gICAgICBzcGFjZVJlcXVpcmVkOiB0cnVlXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiQWxpeXVuX3B1c2ggPSB7fTtcblxuQWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UgPSAodXNlclRva2Vucywgbm90aWZpY2F0aW9uLCBjYWxsYmFjaykgLT5cblx0aWYgbm90aWZpY2F0aW9uLnRpdGxlIGFuZCBub3RpZmljYXRpb24udGV4dFxuXHRcdGlmIFB1c2guZGVidWdcblx0XHRcdGNvbnNvbGUubG9nIHVzZXJUb2tlbnNcblxuXHRcdGFsaXl1blRva2VucyA9IG5ldyBBcnJheVxuXHRcdHhpbmdlVG9rZW5zID0gbmV3IEFycmF5XG5cdFx0aHVhd2VpVG9rZW5zID0gbmV3IEFycmF5XG5cdFx0bWlUb2tlbnMgPSBuZXcgQXJyYXlcblxuXHRcdHVzZXJUb2tlbnMuZm9yRWFjaCAodXNlclRva2VuKSAtPlxuXHRcdFx0YXJyID0gdXNlclRva2VuLnNwbGl0KCc6Jylcblx0XHRcdGlmIGFyclswXSBpcyBcImFsaXl1blwiXG5cdFx0XHRcdGFsaXl1blRva2Vucy5wdXNoIF8ubGFzdChhcnIpXG5cdFx0XHRlbHNlIGlmIGFyclswXSBpcyBcInhpbmdlXCJcblx0XHRcdFx0eGluZ2VUb2tlbnMucHVzaCBfLmxhc3QoYXJyKVxuXHRcdFx0ZWxzZSBpZiBhcnJbMF0gaXMgXCJodWF3ZWlcIlxuXHRcdFx0XHRodWF3ZWlUb2tlbnMucHVzaCBfLmxhc3QoYXJyKVxuXHRcdFx0ZWxzZSBpZiBhcnJbMF0gaXMgXCJtaVwiXG5cdFx0XHRcdG1pVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcblxuXHRcdGlmICFfLmlzRW1wdHkoYWxpeXVuVG9rZW5zKSBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFsaXl1blxuXHRcdFx0QUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcImFsaXl1blRva2VuczogI3thbGl5dW5Ub2tlbnN9XCJcblx0XHRcdEFMWVBVU0ggPSBuZXcgKEFMWS5QVVNIKShcblx0XHRcdFx0YWNjZXNzS2V5SWQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hY2Nlc3NLZXlJZFxuXHRcdFx0XHRzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5zZWNyZXRBY2Nlc3NLZXlcblx0XHRcdFx0ZW5kcG9pbnQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5lbmRwb2ludFxuXHRcdFx0XHRhcGlWZXJzaW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBpVmVyc2lvbik7XG5cblx0XHRcdGRhdGEgPSBcblx0XHRcdFx0QXBwS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBwS2V5XG5cdFx0XHRcdFRhcmdldDogJ2RldmljZSdcblx0XHRcdFx0VGFyZ2V0VmFsdWU6IGFsaXl1blRva2Vucy50b1N0cmluZygpXG5cdFx0XHRcdFRpdGxlOiBub3RpZmljYXRpb24udGl0bGVcblx0XHRcdFx0U3VtbWFyeTogbm90aWZpY2F0aW9uLnRleHRcblxuXHRcdFx0QUxZUFVTSC5wdXNoTm90aWNlVG9BbmRyb2lkIGRhdGEsIGNhbGxiYWNrXG5cblx0XHRpZiAhXy5pc0VtcHR5KHhpbmdlVG9rZW5zKSBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1c2g/LnhpbmdlXG5cdFx0XHRYaW5nZSA9IHJlcXVpcmUoJ3hpbmdlJyk7XG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwieGluZ2VUb2tlbnM6ICN7eGluZ2VUb2tlbnN9XCJcblx0XHRcdFhpbmdlQXBwID0gbmV3IFhpbmdlLlhpbmdlQXBwKE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLmFjY2Vzc0lkLCBNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5zZWNyZXRLZXkpXG5cdFx0XHRcblx0XHRcdGFuZHJvaWRNZXNzYWdlID0gbmV3IFhpbmdlLkFuZHJvaWRNZXNzYWdlXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS50eXBlID0gWGluZ2UuTUVTU0FHRV9UWVBFX05PVElGSUNBVElPTlxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UudGl0bGUgPSBub3RpZmljYXRpb24udGl0bGVcblx0XHRcdGFuZHJvaWRNZXNzYWdlLmNvbnRlbnQgPSBub3RpZmljYXRpb24udGV4dFxuXHRcdFx0YW5kcm9pZE1lc3NhZ2Uuc3R5bGUgPSBuZXcgWGluZ2UuU3R5bGVcblx0XHRcdGFuZHJvaWRNZXNzYWdlLmFjdGlvbiA9IG5ldyBYaW5nZS5DbGlja0FjdGlvblxuXG5cdFx0XHRfLmVhY2ggeGluZ2VUb2tlbnMsICh0KS0+XG5cdFx0XHRcdFhpbmdlQXBwLnB1c2hUb1NpbmdsZURldmljZSB0LCBhbmRyb2lkTWVzc2FnZSwgY2FsbGJhY2tcblxuXHRcdGlmICFfLmlzRW1wdHkoaHVhd2VpVG9rZW5zKSBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lmh1YXdlaVxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcImh1YXdlaVRva2VuczogI3todWF3ZWlUb2tlbnN9XCJcblxuXHRcdFx0cGFja2FnZV9uYW1lID0gTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFBrZ05hbWVcblx0XHRcdHRva2VuRGF0YUxpc3QgPSBbXVxuXHRcdFx0Xy5lYWNoIGh1YXdlaVRva2VucywgKHQpLT5cblx0XHRcdFx0dG9rZW5EYXRhTGlzdC5wdXNoKHsncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLCAndG9rZW4nOiB0fSlcblx0XHRcdG5vdGkgPSB7J2FuZHJvaWQnOiB7J3RpdGxlJzogbm90aWZpY2F0aW9uLnRpdGxlLCAnbWVzc2FnZSc6IG5vdGlmaWNhdGlvbi50ZXh0fSwgJ2V4dHJhcyc6IG5vdGlmaWNhdGlvbi5wYXlsb2FkfVxuXG5cdFx0XHRIdWF3ZWlQdXNoLmNvbmZpZyBbeydwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsICdjbGllbnRfaWQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwSWQsICdjbGllbnRfc2VjcmV0JzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcFNlY3JldH1dXG5cdFx0XHRcblx0XHRcdEh1YXdlaVB1c2guc2VuZE1hbnkgbm90aSwgdG9rZW5EYXRhTGlzdFxuXG5cblx0XHRpZiAhXy5pc0VtcHR5KG1pVG9rZW5zKSBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lm1pXG5cdFx0XHRNaVB1c2ggPSByZXF1aXJlKCd4aWFvbWktcHVzaCcpO1xuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcIm1pVG9rZW5zOiAje21pVG9rZW5zfVwiXG5cdFx0XHRtc2cgPSBuZXcgTWlQdXNoLk1lc3NhZ2Vcblx0XHRcdG1zZy50aXRsZShub3RpZmljYXRpb24udGl0bGUpLmRlc2NyaXB0aW9uKG5vdGlmaWNhdGlvbi50ZXh0KVxuXHRcdFx0bm90aWZpY2F0aW9uID0gbmV3IE1pUHVzaC5Ob3RpZmljYXRpb24oXG5cdFx0XHRcdHByb2R1Y3Rpb246IE1ldGVvci5zZXR0aW5ncy5wdXNoLm1pLnByb2R1Y3Rpb25cblx0XHRcdFx0YXBwU2VjcmV0OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5hcHBTZWNyZXRcblx0XHRcdClcblx0XHRcdF8uZWFjaCBtaVRva2VucywgKHJlZ2lkKS0+XG5cdFx0XHRcdG5vdGlmaWNhdGlvbi5zZW5kIHJlZ2lkLCBtc2csIGNhbGxiYWNrXG5cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0XG5cdGlmIG5vdCBNZXRlb3Iuc2V0dGluZ3MuY3Jvbj8ucHVzaF9pbnRlcnZhbFxuXHRcdHJldHVyblxuXG5cdGNvbmZpZyA9IHtcblx0XHRkZWJ1ZzogdHJ1ZVxuXHRcdGtlZXBOb3RpZmljYXRpb25zOiBmYWxzZVxuXHRcdHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLmNyb24ucHVzaF9pbnRlcnZhbFxuXHRcdHNlbmRCYXRjaFNpemU6IDEwXG5cdFx0cHJvZHVjdGlvbjogdHJ1ZVxuXHR9XG5cblx0aWYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYXBuKSAmJiAhXy5pc0VtcHR5KE1ldGVvci5zZXR0aW5ncy5wdXNoPy5hcG4ua2V5RGF0YSkgJiYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYXBuLmNlcnREYXRhKVxuXHRcdGNvbmZpZy5hcG4gPSB7XG5cdFx0XHRrZXlEYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4ua2V5RGF0YVxuXHRcdFx0Y2VydERhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5jZXJ0RGF0YVxuXHRcdH1cblx0aWYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uZ2NtKSAmJiAhXy5pc0VtcHR5KE1ldGVvci5zZXR0aW5ncy5wdXNoPy5nY20ucHJvamVjdE51bWJlcikgJiYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uZ2NtLmFwaUtleSlcblx0XHRjb25maWcuZ2NtID0ge1xuXHRcdFx0cHJvamVjdE51bWJlcjogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLnByb2plY3ROdW1iZXJcblx0XHRcdGFwaUtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLmFwaUtleVxuXHRcdH1cblxuXHRQdXNoLkNvbmZpZ3VyZSBjb25maWdcblx0XG5cdGlmIChNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYWxpeXVuIG9yIE1ldGVvci5zZXR0aW5ncy5wdXNoPy54aW5nZSBvciBNZXRlb3Iuc2V0dGluZ3MucHVzaD8uaHVhd2VpIG9yIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5taSkgYW5kIFB1c2ggYW5kIHR5cGVvZiBQdXNoLnNlbmRHQ00gPT0gJ2Z1bmN0aW9uJ1xuXHRcdFxuXHRcdFB1c2gub2xkX3NlbmRHQ00gPSBQdXNoLnNlbmRHQ007XG5cblx0XHRQdXNoLnNlbmRBbGl5dW4gPSAodXNlclRva2Vucywgbm90aWZpY2F0aW9uKSAtPlxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvblxuXG5cdFx0XHRpZiBNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdClcblx0XHRcdFx0bm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSlcblx0XHRcdCMgTWFrZSBzdXJlIHVzZXJUb2tlbnMgYXJlIGFuIGFycmF5IG9mIHN0cmluZ3Ncblx0XHRcdGlmIHVzZXJUb2tlbnMgPT0gJycgKyB1c2VyVG9rZW5zXG5cdFx0XHRcdHVzZXJUb2tlbnMgPSBbIHVzZXJUb2tlbnMgXVxuXHRcdFx0IyBDaGVjayBpZiBhbnkgdG9rZW5zIGluIHRoZXJlIHRvIHNlbmRcblx0XHRcdGlmICF1c2VyVG9rZW5zLmxlbmd0aFxuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCdcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kQWxpeXVuJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uXG5cblx0XHRcdEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJylcblx0ICBcblx0XHRcdHVzZXJUb2tlbiA9IGlmIHVzZXJUb2tlbnMubGVuZ3RoID09IDEgdGhlbiB1c2VyVG9rZW5zWzBdIGVsc2UgbnVsbFxuXHRcdFx0QWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UgdXNlclRva2Vucywgbm90aWZpY2F0aW9uLCAoZXJyLCByZXN1bHQpIC0+XG5cdFx0XHRcdGlmIGVyclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nICdBTkRST0lEIEVSUk9SOiByZXN1bHQgb2Ygc2VuZGVyOiAnICsgcmVzdWx0XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpZiByZXN1bHQgPT0gbnVsbFxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXIgaXMgbnVsbCdcblx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nICdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KVxuXG5cdFx0XHRcdFx0aWYgcmVzdWx0LmNhbm9uaWNhbF9pZHMgPT0gMSBhbmQgdXNlclRva2VuXG5cdFx0XHRcdFx0XHRGaWJlcigoc2VsZikgLT5cblx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5jYWxsYmFjayBzZWxmLm9sZFRva2VuLCBzZWxmLm5ld1Rva2VuXG5cdFx0XHRcdFx0XHRcdGNhdGNoIGVyclxuXHRcdFx0XHRcdFx0KS5ydW5cblx0XHRcdFx0XHRcdFx0b2xkVG9rZW46IGdjbTogdXNlclRva2VuXG5cdFx0XHRcdFx0XHRcdG5ld1Rva2VuOiBnY206IFwiYWxpeXVuOlwiICsgcmVzdWx0LnJlc3VsdHNbMF0ucmVnaXN0cmF0aW9uX2lkXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrOiBfcmVwbGFjZVRva2VuXG5cdFx0XHRcdFx0aWYgcmVzdWx0LmZhaWx1cmUgIT0gMCBhbmQgdXNlclRva2VuXG5cdFx0XHRcdFx0XHRGaWJlcigoc2VsZikgLT5cblx0XHRcdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5jYWxsYmFjayBzZWxmLnRva2VuXG5cdFx0XHRcdFx0XHRcdGNhdGNoIGVyclxuXHRcdFx0XHRcdFx0KS5ydW5cblx0XHRcdFx0XHRcdFx0dG9rZW46IGdjbTogdXNlclRva2VuXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrOiBfcmVtb3ZlVG9rZW5cblxuXG5cblx0XHRQdXNoLnNlbmRHQ00gPSAodXNlclRva2Vucywgbm90aWZpY2F0aW9uKSAtPlxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTSBmcm9tIGFsaXl1bi0+IFB1c2guc2VuZEdDTSdcblx0XHRcdGlmIE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KVxuXHRcdFx0XHRub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKVxuXHRcdFx0IyBNYWtlIHN1cmUgdXNlclRva2VucyBhcmUgYW4gYXJyYXkgb2Ygc3RyaW5nc1xuXHRcdFx0aWYgdXNlclRva2VucyA9PSAnJyArIHVzZXJUb2tlbnNcblx0XHRcdFx0dXNlclRva2VucyA9IFsgdXNlclRva2VucyBdXG5cdFx0XHQjIENoZWNrIGlmIGFueSB0b2tlbnMgaW4gdGhlcmUgdG8gc2VuZFxuXHRcdFx0aWYgIXVzZXJUb2tlbnMubGVuZ3RoXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJ1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb25cblxuXHRcdFx0YWxpeXVuVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoKGl0ZW0pIC0+XG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5pbmRleE9mKCdhbGl5dW46JykgPiAtMSBvciBpdGVtLmluZGV4T2YoJ3hpbmdlOicpID4gLTEgb3IgaXRlbS5pbmRleE9mKCdodWF3ZWk6JykgPiAtMSBvciBpdGVtLmluZGV4T2YoJ21pOicpID4gLTFcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnYWxpeXVuVG9rZW5zIGlzICcsIGFsaXl1blRva2Vucy50b1N0cmluZygpXG5cblx0XHRcdGdjbVRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKChpdGVtKSAtPlxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uaW5kZXhPZihcImFsaXl1bjpcIikgPCAwIGFuZCBpdGVtLmluZGV4T2YoXCJ4aW5nZTpcIikgPCAwIGFuZCBpdGVtLmluZGV4T2YoXCJodWF3ZWk6XCIpIDwgMCBhbmQgaXRlbS5pbmRleE9mKFwibWk6XCIpIDwgMFxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdnY21Ub2tlbnMgaXMgJyAsIGdjbVRva2Vucy50b1N0cmluZygpO1xuXG5cdFx0XHRQdXNoLnNlbmRBbGl5dW4oYWxpeXVuVG9rZW5zLCBub3RpZmljYXRpb24pO1xuXG5cdFx0XHRQdXNoLm9sZF9zZW5kR0NNKGdjbVRva2Vucywgbm90aWZpY2F0aW9uKTtcblxuXHRcdFB1c2gub2xkX3NlbmRBUE4gPSBQdXNoLnNlbmRBUE5cblx0XHRQdXNoLnNlbmRBUE4gPSAodXNlclRva2VuLCBub3RpZmljYXRpb24pIC0+XG5cdFx0XHR0cnlcblx0XHRcdFx0aWYgbm90aWZpY2F0aW9uLnRpdGxlIGFuZCBub3RpZmljYXRpb24udGV4dFxuXHRcdFx0XHRcdG5vdGkgPSBfLmNsb25lKG5vdGlmaWNhdGlvbilcblx0XHRcdFx0XHRub3RpLnRleHQgPSBub3RpLnRpdGxlICsgXCIgXCIgKyBub3RpLnRleHRcblx0XHRcdFx0XHRub3RpLnRpdGxlID0gXCJcIlxuXHRcdFx0XHRcdFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0UHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbilcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlKVxuIiwidmFyIEFsaXl1bl9wdXNoO1xuXG5BbGl5dW5fcHVzaCA9IHt9O1xuXG5BbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbiwgY2FsbGJhY2spIHtcbiAgdmFyIEFMWSwgQUxZUFVTSCwgTWlQdXNoLCBYaW5nZSwgWGluZ2VBcHAsIGFsaXl1blRva2VucywgYW5kcm9pZE1lc3NhZ2UsIGRhdGEsIGh1YXdlaVRva2VucywgbWlUb2tlbnMsIG1zZywgbm90aSwgcGFja2FnZV9uYW1lLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHRva2VuRGF0YUxpc3QsIHhpbmdlVG9rZW5zO1xuICBpZiAobm90aWZpY2F0aW9uLnRpdGxlICYmIG5vdGlmaWNhdGlvbi50ZXh0KSB7XG4gICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKHVzZXJUb2tlbnMpO1xuICAgIH1cbiAgICBhbGl5dW5Ub2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgeGluZ2VUb2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgaHVhd2VpVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIG1pVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIHVzZXJUb2tlbnMuZm9yRWFjaChmdW5jdGlvbih1c2VyVG9rZW4pIHtcbiAgICAgIHZhciBhcnI7XG4gICAgICBhcnIgPSB1c2VyVG9rZW4uc3BsaXQoJzonKTtcbiAgICAgIGlmIChhcnJbMF0gPT09IFwiYWxpeXVuXCIpIHtcbiAgICAgICAgcmV0dXJuIGFsaXl1blRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyWzBdID09PSBcInhpbmdlXCIpIHtcbiAgICAgICAgcmV0dXJuIHhpbmdlVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfSBlbHNlIGlmIChhcnJbMF0gPT09IFwiaHVhd2VpXCIpIHtcbiAgICAgICAgcmV0dXJuIGh1YXdlaVRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyWzBdID09PSBcIm1pXCIpIHtcbiAgICAgICAgcmV0dXJuIG1pVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghXy5pc0VtcHR5KGFsaXl1blRva2VucykgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZi5hbGl5dW4gOiB2b2lkIDApKSB7XG4gICAgICBBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImFsaXl1blRva2VuczogXCIgKyBhbGl5dW5Ub2tlbnMpO1xuICAgICAgfVxuICAgICAgQUxZUFVTSCA9IG5ldyBBTFkuUFVTSCh7XG4gICAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYWNjZXNzS2V5SWQsXG4gICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLnNlY3JldEFjY2Vzc0tleSxcbiAgICAgICAgZW5kcG9pbnQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5lbmRwb2ludCxcbiAgICAgICAgYXBpVmVyc2lvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwaVZlcnNpb25cbiAgICAgIH0pO1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgQXBwS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBwS2V5LFxuICAgICAgICBUYXJnZXQ6ICdkZXZpY2UnLFxuICAgICAgICBUYXJnZXRWYWx1ZTogYWxpeXVuVG9rZW5zLnRvU3RyaW5nKCksXG4gICAgICAgIFRpdGxlOiBub3RpZmljYXRpb24udGl0bGUsXG4gICAgICAgIFN1bW1hcnk6IG5vdGlmaWNhdGlvbi50ZXh0XG4gICAgICB9O1xuICAgICAgQUxZUFVTSC5wdXNoTm90aWNlVG9BbmRyb2lkKGRhdGEsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgaWYgKCFfLmlzRW1wdHkoeGluZ2VUb2tlbnMpICYmICgocmVmMSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMS54aW5nZSA6IHZvaWQgMCkpIHtcbiAgICAgIFhpbmdlID0gcmVxdWlyZSgneGluZ2UnKTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwieGluZ2VUb2tlbnM6IFwiICsgeGluZ2VUb2tlbnMpO1xuICAgICAgfVxuICAgICAgWGluZ2VBcHAgPSBuZXcgWGluZ2UuWGluZ2VBcHAoTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2UuYWNjZXNzSWQsIE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLnNlY3JldEtleSk7XG4gICAgICBhbmRyb2lkTWVzc2FnZSA9IG5ldyBYaW5nZS5BbmRyb2lkTWVzc2FnZTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLnR5cGUgPSBYaW5nZS5NRVNTQUdFX1RZUEVfTk9USUZJQ0FUSU9OO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UudGl0bGUgPSBub3RpZmljYXRpb24udGl0bGU7XG4gICAgICBhbmRyb2lkTWVzc2FnZS5jb250ZW50ID0gbm90aWZpY2F0aW9uLnRleHQ7XG4gICAgICBhbmRyb2lkTWVzc2FnZS5zdHlsZSA9IG5ldyBYaW5nZS5TdHlsZTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLmFjdGlvbiA9IG5ldyBYaW5nZS5DbGlja0FjdGlvbjtcbiAgICAgIF8uZWFjaCh4aW5nZVRva2VucywgZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gWGluZ2VBcHAucHVzaFRvU2luZ2xlRGV2aWNlKHQsIGFuZHJvaWRNZXNzYWdlLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCFfLmlzRW1wdHkoaHVhd2VpVG9rZW5zKSAmJiAoKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjIuaHVhd2VpIDogdm9pZCAwKSkge1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJodWF3ZWlUb2tlbnM6IFwiICsgaHVhd2VpVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIHBhY2thZ2VfbmFtZSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBQa2dOYW1lO1xuICAgICAgdG9rZW5EYXRhTGlzdCA9IFtdO1xuICAgICAgXy5lYWNoKGh1YXdlaVRva2VucywgZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdG9rZW5EYXRhTGlzdC5wdXNoKHtcbiAgICAgICAgICAncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLFxuICAgICAgICAgICd0b2tlbic6IHRcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIG5vdGkgPSB7XG4gICAgICAgICdhbmRyb2lkJzoge1xuICAgICAgICAgICd0aXRsZSc6IG5vdGlmaWNhdGlvbi50aXRsZSxcbiAgICAgICAgICAnbWVzc2FnZSc6IG5vdGlmaWNhdGlvbi50ZXh0XG4gICAgICAgIH0sXG4gICAgICAgICdleHRyYXMnOiBub3RpZmljYXRpb24ucGF5bG9hZFxuICAgICAgfTtcbiAgICAgIEh1YXdlaVB1c2guY29uZmlnKFtcbiAgICAgICAge1xuICAgICAgICAgICdwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsXG4gICAgICAgICAgJ2NsaWVudF9pZCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBJZCxcbiAgICAgICAgICAnY2xpZW50X3NlY3JldCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBTZWNyZXRcbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgICBIdWF3ZWlQdXNoLnNlbmRNYW55KG5vdGksIHRva2VuRGF0YUxpc3QpO1xuICAgIH1cbiAgICBpZiAoIV8uaXNFbXB0eShtaVRva2VucykgJiYgKChyZWYzID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYzLm1pIDogdm9pZCAwKSkge1xuICAgICAgTWlQdXNoID0gcmVxdWlyZSgneGlhb21pLXB1c2gnKTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibWlUb2tlbnM6IFwiICsgbWlUb2tlbnMpO1xuICAgICAgfVxuICAgICAgbXNnID0gbmV3IE1pUHVzaC5NZXNzYWdlO1xuICAgICAgbXNnLnRpdGxlKG5vdGlmaWNhdGlvbi50aXRsZSkuZGVzY3JpcHRpb24obm90aWZpY2F0aW9uLnRleHQpO1xuICAgICAgbm90aWZpY2F0aW9uID0gbmV3IE1pUHVzaC5Ob3RpZmljYXRpb24oe1xuICAgICAgICBwcm9kdWN0aW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5wcm9kdWN0aW9uLFxuICAgICAgICBhcHBTZWNyZXQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLm1pLmFwcFNlY3JldFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKG1pVG9rZW5zLCBmdW5jdGlvbihyZWdpZCkge1xuICAgICAgICByZXR1cm4gbm90aWZpY2F0aW9uLnNlbmQocmVnaWQsIG1zZywgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGNvbmZpZywgcmVmLCByZWYxLCByZWYxMCwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgcmVmNiwgcmVmNywgcmVmOCwgcmVmOTtcbiAgaWYgKCEoKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5jcm9uKSAhPSBudWxsID8gcmVmLnB1c2hfaW50ZXJ2YWwgOiB2b2lkIDApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbmZpZyA9IHtcbiAgICBkZWJ1ZzogdHJ1ZSxcbiAgICBrZWVwTm90aWZpY2F0aW9uczogZmFsc2UsXG4gICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5wdXNoX2ludGVydmFsLFxuICAgIHNlbmRCYXRjaFNpemU6IDEwLFxuICAgIHByb2R1Y3Rpb246IHRydWVcbiAgfTtcbiAgaWYgKCFfLmlzRW1wdHkoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjEuYXBuIDogdm9pZCAwKSAmJiAhXy5pc0VtcHR5KChyZWYyID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYyLmFwbi5rZXlEYXRhIDogdm9pZCAwKSAmJiAhXy5pc0VtcHR5KChyZWYzID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYzLmFwbi5jZXJ0RGF0YSA6IHZvaWQgMCkpIHtcbiAgICBjb25maWcuYXBuID0ge1xuICAgICAga2V5RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmtleURhdGEsXG4gICAgICBjZXJ0RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmNlcnREYXRhXG4gICAgfTtcbiAgfVxuICBpZiAoIV8uaXNFbXB0eSgocmVmNCA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmNC5nY20gOiB2b2lkIDApICYmICFfLmlzRW1wdHkoKHJlZjUgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjUuZ2NtLnByb2plY3ROdW1iZXIgOiB2b2lkIDApICYmICFfLmlzRW1wdHkoKHJlZjYgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjYuZ2NtLmFwaUtleSA6IHZvaWQgMCkpIHtcbiAgICBjb25maWcuZ2NtID0ge1xuICAgICAgcHJvamVjdE51bWJlcjogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLnByb2plY3ROdW1iZXIsXG4gICAgICBhcGlLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5hcGlLZXlcbiAgICB9O1xuICB9XG4gIFB1c2guQ29uZmlndXJlKGNvbmZpZyk7XG4gIGlmICgoKChyZWY3ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY3LmFsaXl1biA6IHZvaWQgMCkgfHwgKChyZWY4ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY4LnhpbmdlIDogdm9pZCAwKSB8fCAoKHJlZjkgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjkuaHVhd2VpIDogdm9pZCAwKSB8fCAoKHJlZjEwID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYxMC5taSA6IHZvaWQgMCkpICYmIFB1c2ggJiYgdHlwZW9mIFB1c2guc2VuZEdDTSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFB1c2gub2xkX3NlbmRHQ00gPSBQdXNoLnNlbmRHQ007XG4gICAgUHVzaC5zZW5kQWxpeXVuID0gZnVuY3Rpb24odXNlclRva2Vucywgbm90aWZpY2F0aW9uKSB7XG4gICAgICB2YXIgRmliZXIsIHVzZXJUb2tlbjtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kQWxpeXVuJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdCkpIHtcbiAgICAgICAgbm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSk7XG4gICAgICB9XG4gICAgICBpZiAodXNlclRva2VucyA9PT0gJycgKyB1c2VyVG9rZW5zKSB7XG4gICAgICAgIHVzZXJUb2tlbnMgPSBbdXNlclRva2Vuc107XG4gICAgICB9XG4gICAgICBpZiAoIXVzZXJUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kQWxpeXVuJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cbiAgICAgIEZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG4gICAgICB1c2VyVG9rZW4gPSB1c2VyVG9rZW5zLmxlbmd0aCA9PT0gMSA/IHVzZXJUb2tlbnNbMF0gOiBudWxsO1xuICAgICAgcmV0dXJuIEFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbiwgZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmxvZygnQU5EUk9JRCBFUlJPUjogcmVzdWx0IG9mIHNlbmRlcjogJyArIHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXIgaXMgbnVsbCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQuY2Fub25pY2FsX2lkcyA9PT0gMSAmJiB1c2VyVG9rZW4pIHtcbiAgICAgICAgICAgIEZpYmVyKGZ1bmN0aW9uKHNlbGYpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhzZWxmLm9sZFRva2VuLCBzZWxmLm5ld1Rva2VuKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkucnVuKHtcbiAgICAgICAgICAgICAgb2xkVG9rZW46IHtcbiAgICAgICAgICAgICAgICBnY206IHVzZXJUb2tlblxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBuZXdUb2tlbjoge1xuICAgICAgICAgICAgICAgIGdjbTogXCJhbGl5dW46XCIgKyByZXN1bHQucmVzdWx0c1swXS5yZWdpc3RyYXRpb25faWRcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FsbGJhY2s6IF9yZXBsYWNlVG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0LmZhaWx1cmUgIT09IDAgJiYgdXNlclRva2VuKSB7XG4gICAgICAgICAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oc2VsZikge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKHNlbGYudG9rZW4pO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5ydW4oe1xuICAgICAgICAgICAgICB0b2tlbjoge1xuICAgICAgICAgICAgICAgIGdjbTogdXNlclRva2VuXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhbGxiYWNrOiBfcmVtb3ZlVG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgICBQdXNoLnNlbmRHQ00gPSBmdW5jdGlvbih1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBhbGl5dW5Ub2tlbnMsIGdjbVRva2VucztcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNIGZyb20gYWxpeXVuLT4gUHVzaC5zZW5kR0NNJyk7XG4gICAgICB9XG4gICAgICBpZiAoTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpKSB7XG4gICAgICAgIG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJUb2tlbnMgPT09ICcnICsgdXNlclRva2Vucykge1xuICAgICAgICB1c2VyVG9rZW5zID0gW3VzZXJUb2tlbnNdO1xuICAgICAgfVxuICAgICAgaWYgKCF1c2VyVG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTScsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgICBhbGl5dW5Ub2tlbnMgPSB1c2VyVG9rZW5zLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmluZGV4T2YoJ2FsaXl1bjonKSA+IC0xIHx8IGl0ZW0uaW5kZXhPZigneGluZ2U6JykgPiAtMSB8fCBpdGVtLmluZGV4T2YoJ2h1YXdlaTonKSA+IC0xIHx8IGl0ZW0uaW5kZXhPZignbWk6JykgPiAtMTtcbiAgICAgIH0pO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2FsaXl1blRva2VucyBpcyAnLCBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICBnY21Ub2tlbnMgPSB1c2VyVG9rZW5zLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmluZGV4T2YoXCJhbGl5dW46XCIpIDwgMCAmJiBpdGVtLmluZGV4T2YoXCJ4aW5nZTpcIikgPCAwICYmIGl0ZW0uaW5kZXhPZihcImh1YXdlaTpcIikgPCAwICYmIGl0ZW0uaW5kZXhPZihcIm1pOlwiKSA8IDA7XG4gICAgICB9KTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnY21Ub2tlbnMgaXMgJywgZ2NtVG9rZW5zLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAgUHVzaC5zZW5kQWxpeXVuKGFsaXl1blRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICAgIHJldHVybiBQdXNoLm9sZF9zZW5kR0NNKGdjbVRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICB9O1xuICAgIFB1c2gub2xkX3NlbmRBUE4gPSBQdXNoLnNlbmRBUE47XG4gICAgcmV0dXJuIFB1c2guc2VuZEFQTiA9IGZ1bmN0aW9uKHVzZXJUb2tlbiwgbm90aWZpY2F0aW9uKSB7XG4gICAgICB2YXIgZSwgbm90aTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChub3RpZmljYXRpb24udGl0bGUgJiYgbm90aWZpY2F0aW9uLnRleHQpIHtcbiAgICAgICAgICBub3RpID0gXy5jbG9uZShub3RpZmljYXRpb24pO1xuICAgICAgICAgIG5vdGkudGV4dCA9IG5vdGkudGl0bGUgKyBcIiBcIiArIG5vdGkudGV4dDtcbiAgICAgICAgICBub3RpLnRpdGxlID0gXCJcIjtcbiAgICAgICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQdXNoLm9sZF9zZW5kQVBOKHVzZXJUb2tlbiwgbm90aWZpY2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiJdfQ==
