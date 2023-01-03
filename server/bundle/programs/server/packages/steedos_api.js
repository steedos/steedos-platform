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

}},"routes":{"push.coffee":function module(){

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
require("/node_modules/meteor/steedos:api/routes/push.coffee");
require("/node_modules/meteor/steedos:api/routes/aliyun_push.coffee");

/* Exports */
Package._define("steedos:api");

})();

//# sourceURL=meteor://💻app/packages/steedos_api.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3BhcnNlX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFyc2VfZmlsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvbGliL3Jlc3RpdnVzL2lyb24tcm91dGVyLWVycm9yLXRvLXJlc3BvbnNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcm91dGUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FwaS9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3N0ZWVkb3Mvc3BhY2VfdXNlcnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zdGVlZG9zL3NwYWNlX3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc3RlZWRvcy9vcmdhbml6YXRpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiQnVzYm95IiwiRmliZXIiLCJyZXF1aXJlIiwiSnNvblJvdXRlcyIsInBhcnNlRmlsZXMiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYnVzYm95IiwiZmlsZXMiLCJtZXRob2QiLCJoZWFkZXJzIiwib24iLCJmaWVsZG5hbWUiLCJmaWxlIiwiZmlsZW5hbWUiLCJlbmNvZGluZyIsIm1pbWV0eXBlIiwiYnVmZmVycyIsImltYWdlIiwibWltZVR5cGUiLCJkYXRhIiwicHVzaCIsIkJ1ZmZlciIsImNvbmNhdCIsInZhbHVlIiwiYm9keSIsInJ1biIsInBpcGUiLCJnZXRVc2VyUXVlcnlTZWxlY3RvciIsInVzZXJWYWxpZGF0b3IiLCJBdXRoIiwiTWF0Y2giLCJXaGVyZSIsInVzZXIiLCJjaGVjayIsImlkIiwiT3B0aW9uYWwiLCJTdHJpbmciLCJ1c2VybmFtZSIsImVtYWlsIiwiXyIsImtleXMiLCJsZW5ndGgiLCJFcnJvciIsImxvZ2luV2l0aFBhc3N3b3JkIiwicGFzc3dvcmQiLCJhdXRoVG9rZW4iLCJhdXRoZW50aWNhdGluZ1VzZXIiLCJhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciIsImhhc2hlZFRva2VuIiwicGFzc3dvcmRWZXJpZmljYXRpb24iLCJyZWYiLCJzcGFjZV91c2VycyIsInNwYWNlcyIsIk1ldGVvciIsInVzZXJzIiwiZmluZE9uZSIsInNlcnZpY2VzIiwiQWNjb3VudHMiLCJfY2hlY2tQYXNzd29yZCIsImVycm9yIiwiX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4iLCJfaGFzaFN0YW1wZWRUb2tlbiIsIl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIiwiX2lkIiwiZGIiLCJmaW5kIiwiZmV0Y2giLCJlYWNoIiwic3UiLCJzcGFjZSIsImluZGV4T2YiLCJhZG1pbnMiLCJuYW1lIiwidG9rZW4iLCJ1c2VySWQiLCJhZG1pblNwYWNlcyIsImVudiIsInByb2Nlc3MiLCJOT0RFX0VOViIsImlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlIiwiZXJyIiwic3RhdHVzQ29kZSIsInN0YXR1cyIsIm1zZyIsInN0YWNrIiwidG9TdHJpbmciLCJjb25zb2xlIiwiaGVhZGVyc1NlbnQiLCJzb2NrZXQiLCJkZXN0cm95Iiwic2V0SGVhZGVyIiwiYnl0ZUxlbmd0aCIsImVuZCIsInNoYXJlIiwiUm91dGUiLCJhcGkiLCJwYXRoIiwib3B0aW9ucyIsImVuZHBvaW50czEiLCJlbmRwb2ludHMiLCJwcm90b3R5cGUiLCJhZGRUb0FwaSIsImF2YWlsYWJsZU1ldGhvZHMiLCJhbGxvd2VkTWV0aG9kcyIsImZ1bGxQYXRoIiwicmVqZWN0ZWRNZXRob2RzIiwic2VsZiIsImNvbnRhaW5zIiwiX2NvbmZpZyIsInBhdGhzIiwiZXh0ZW5kIiwiZGVmYXVsdE9wdGlvbnNFbmRwb2ludCIsIl9yZXNvbHZlRW5kcG9pbnRzIiwiX2NvbmZpZ3VyZUVuZHBvaW50cyIsImZpbHRlciIsInJlamVjdCIsImFwaVBhdGgiLCJlbmRwb2ludCIsImFkZCIsImRvbmVGdW5jIiwiZW5kcG9pbnRDb250ZXh0IiwicmVzcG9uc2VEYXRhIiwicmVzcG9uc2VJbml0aWF0ZWQiLCJ1cmxQYXJhbXMiLCJwYXJhbXMiLCJxdWVyeVBhcmFtcyIsInF1ZXJ5IiwiYm9keVBhcmFtcyIsInJlcXVlc3QiLCJyZXNwb25zZSIsImRvbmUiLCJfY2FsbEVuZHBvaW50IiwiZXJyb3IxIiwiX3Jlc3BvbmQiLCJtZXNzYWdlIiwiam9pbiIsInRvVXBwZXJDYXNlIiwiaXNGdW5jdGlvbiIsImFjdGlvbiIsInJlZjEiLCJyZWYyIiwicm9sZVJlcXVpcmVkIiwidW5pb24iLCJpc0VtcHR5IiwiYXV0aFJlcXVpcmVkIiwic3BhY2VSZXF1aXJlZCIsImludm9jYXRpb24iLCJfYXV0aEFjY2VwdGVkIiwiX3JvbGVBY2NlcHRlZCIsIl9zcGFjZUFjY2VwdGVkIiwiRERQQ29tbW9uIiwiTWV0aG9kSW52b2NhdGlvbiIsImlzU2ltdWxhdGlvbiIsImNvbm5lY3Rpb24iLCJyYW5kb21TZWVkIiwibWFrZVJwY1NlZWQiLCJERFAiLCJfQ3VycmVudEludm9jYXRpb24iLCJ3aXRoVmFsdWUiLCJjYWxsIiwiX2F1dGhlbnRpY2F0ZSIsImF1dGgiLCJ1c2VyU2VsZWN0b3IiLCJzcGFjZV91c2Vyc19jb3VudCIsInNwYWNlSWQiLCJjb3VudCIsImludGVyc2VjdGlvbiIsInJvbGVzIiwiZGVmYXVsdEhlYWRlcnMiLCJkZWxheUluTWlsbGlzZWNvbmRzIiwibWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMiLCJyYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byIsInNlbmRSZXNwb25zZSIsIl9sb3dlckNhc2VLZXlzIiwibWF0Y2giLCJwcmV0dHlKc29uIiwiSlNPTiIsInN0cmluZ2lmeSIsIndyaXRlSGVhZCIsIndyaXRlIiwiTWF0aCIsInJhbmRvbSIsInNldFRpbWVvdXQiLCJvYmplY3QiLCJjaGFpbiIsInBhaXJzIiwibWFwIiwiYXR0ciIsInRvTG93ZXJDYXNlIiwiUmVzdGl2dXMiLCJpdGVtIiwiaSIsImwiLCJjb3JzSGVhZGVycyIsIl9yb3V0ZXMiLCJ1c2VEZWZhdWx0QXV0aCIsInZlcnNpb24iLCJfdXNlciIsIl9oYXNoTG9naW5Ub2tlbiIsImVuYWJsZUNvcnMiLCJzbGljZSIsImxhc3QiLCJfaW5pdEF1dGgiLCJ1c2VBdXRoIiwid2FybiIsImFkZFJvdXRlIiwicm91dGUiLCJhZGRDb2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsImNvbGxlY3Rpb25FbmRwb2ludHMiLCJjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMiLCJlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24iLCJlbnRpdHlSb3V0ZUVuZHBvaW50cyIsImV4Y2x1ZGVkRW5kcG9pbnRzIiwibWV0aG9kcyIsIm1ldGhvZHNPbkNvbGxlY3Rpb24iLCJyb3V0ZU9wdGlvbnMiLCJfdXNlckNvbGxlY3Rpb25FbmRwb2ludHMiLCJfY29sbGVjdGlvbkVuZHBvaW50cyIsIl9uYW1lIiwiY29uZmlndXJlZEVuZHBvaW50IiwiZW5kcG9pbnRPcHRpb25zIiwibWV0aG9kVHlwZSIsImNsb25lIiwiZ2V0IiwiZW50aXR5Iiwic2VsZWN0b3IiLCJwdXQiLCJlbnRpdHlJc1VwZGF0ZWQiLCJ1cGRhdGUiLCIkc2V0IiwicmVtb3ZlIiwicG9zdCIsImVudGl0eUlkIiwiaW5zZXJ0IiwiZ2V0QWxsIiwiZW50aXRpZXMiLCJmaWVsZHMiLCJwcm9maWxlIiwiY3JlYXRlVXNlciIsImxvZ291dCIsImUiLCJleHRyYURhdGEiLCJzZWFyY2hRdWVyeSIsInJlYXNvbiIsIm9uTG9nZ2VkSW4iLCJleHRyYSIsImluZGV4IiwidG9rZW5GaWVsZE5hbWUiLCJ0b2tlbkxvY2F0aW9uIiwidG9rZW5QYXRoIiwidG9rZW5SZW1vdmFsUXVlcnkiLCJ0b2tlblRvUmVtb3ZlIiwibGFzdEluZGV4T2YiLCJzdWJzdHJpbmciLCIkcHVsbCIsIm9uTG9nZ2VkT3V0IiwiaXNTZXJ2ZXIiLCJBUEkiLCJzdGFydHVwIiwib3JnYW5pemF0aW9ucyIsInB1c2hUb3BpYyIsInVzZXJJZHMiLCJmcm9tIiwiYXBwTmFtZSIsImFsZXJ0VGl0bGUiLCJhbGVydCIsImJhZGdlIiwic291bmQiLCJQdXNoIiwic2VuZCIsInB1c2hTZW5kIiwidGV4dCIsInRpdGxlIiwiQWxpeXVuX3B1c2giLCJzZW5kTWVzc2FnZSIsInVzZXJUb2tlbnMiLCJub3RpZmljYXRpb24iLCJjYWxsYmFjayIsIkFMWSIsIkFMWVBVU0giLCJNaVB1c2giLCJYaW5nZSIsIlhpbmdlQXBwIiwiYWxpeXVuVG9rZW5zIiwiYW5kcm9pZE1lc3NhZ2UiLCJodWF3ZWlUb2tlbnMiLCJtaVRva2VucyIsIm5vdGkiLCJwYWNrYWdlX25hbWUiLCJyZWYzIiwidG9rZW5EYXRhTGlzdCIsInhpbmdlVG9rZW5zIiwiZGVidWciLCJsb2ciLCJBcnJheSIsImZvckVhY2giLCJ1c2VyVG9rZW4iLCJhcnIiLCJzcGxpdCIsInNldHRpbmdzIiwiYWxpeXVuIiwiUFVTSCIsImFjY2Vzc0tleUlkIiwic2VjcmV0QWNjZXNzS2V5IiwiYXBpVmVyc2lvbiIsIkFwcEtleSIsImFwcEtleSIsIlRhcmdldCIsIlRhcmdldFZhbHVlIiwiVGl0bGUiLCJTdW1tYXJ5IiwicHVzaE5vdGljZVRvQW5kcm9pZCIsInhpbmdlIiwiYWNjZXNzSWQiLCJzZWNyZXRLZXkiLCJBbmRyb2lkTWVzc2FnZSIsInR5cGUiLCJNRVNTQUdFX1RZUEVfTk9USUZJQ0FUSU9OIiwiY29udGVudCIsInN0eWxlIiwiU3R5bGUiLCJDbGlja0FjdGlvbiIsInQiLCJwdXNoVG9TaW5nbGVEZXZpY2UiLCJodWF3ZWkiLCJhcHBQa2dOYW1lIiwicGF5bG9hZCIsIkh1YXdlaVB1c2giLCJjb25maWciLCJhcHBJZCIsImFwcFNlY3JldCIsInNlbmRNYW55IiwibWkiLCJNZXNzYWdlIiwiZGVzY3JpcHRpb24iLCJOb3RpZmljYXRpb24iLCJwcm9kdWN0aW9uIiwicmVnaWQiLCJyZWYxMCIsInJlZjQiLCJyZWY1IiwicmVmNiIsInJlZjciLCJyZWY4IiwicmVmOSIsImNyb24iLCJwdXNoX2ludGVydmFsIiwia2VlcE5vdGlmaWNhdGlvbnMiLCJzZW5kSW50ZXJ2YWwiLCJzZW5kQmF0Y2hTaXplIiwiYXBuIiwia2V5RGF0YSIsImNlcnREYXRhIiwiZ2NtIiwicHJvamVjdE51bWJlciIsImFwaUtleSIsIkNvbmZpZ3VyZSIsInNlbmRHQ00iLCJvbGRfc2VuZEdDTSIsInNlbmRBbGl5dW4iLCJ0ZXN0IiwiT2JqZWN0IiwicmVzdWx0IiwiY2Fub25pY2FsX2lkcyIsIm9sZFRva2VuIiwibmV3VG9rZW4iLCJyZXN1bHRzIiwicmVnaXN0cmF0aW9uX2lkIiwiX3JlcGxhY2VUb2tlbiIsImZhaWx1cmUiLCJfcmVtb3ZlVG9rZW4iLCJnY21Ub2tlbnMiLCJvbGRfc2VuZEFQTiIsInNlbmRBUE4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0YsRTs7Ozs7Ozs7Ozs7O0FDQXJCLElBQUFDLE1BQUEsRUFBQUMsS0FBQTtBQUFBRCxTQUFTRSxRQUFRLFFBQVIsQ0FBVDtBQUNBRCxRQUFRQyxRQUFRLFFBQVIsQ0FBUjs7QUFFQUMsV0FBV0MsVUFBWCxHQUF3QixVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWDtBQUN2QixNQUFBQyxNQUFBLEVBQUFDLEtBQUE7QUFBQUEsVUFBUSxFQUFSOztBQUVBLE1BQUlKLElBQUlLLE1BQUosS0FBYyxNQUFsQjtBQUNDRixhQUFTLElBQUlSLE1BQUosQ0FBVztBQUFFVyxlQUFTTixJQUFJTTtBQUFmLEtBQVgsQ0FBVDtBQUNBSCxXQUFPSSxFQUFQLENBQVUsTUFBVixFQUFtQixVQUFDQyxTQUFELEVBQVlDLElBQVosRUFBa0JDLFFBQWxCLEVBQTRCQyxRQUE1QixFQUFzQ0MsUUFBdEM7QUFDbEIsVUFBQUMsT0FBQSxFQUFBQyxLQUFBO0FBQUFBLGNBQVEsRUFBUjtBQUNBQSxZQUFNQyxRQUFOLEdBQWlCSCxRQUFqQjtBQUNBRSxZQUFNSCxRQUFOLEdBQWlCQSxRQUFqQjtBQUNBRyxZQUFNSixRQUFOLEdBQWlCQSxRQUFqQjtBQUdBRyxnQkFBVSxFQUFWO0FBRUFKLFdBQUtGLEVBQUwsQ0FBUSxNQUFSLEVBQWdCLFVBQUNTLElBQUQ7QUNJ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LEVBQUV3TCxLQUFGLENBQVFzRCxZQUFSLENBQVA7QUFDQVcsZUFBS2hCLElBQUwsR0FBWWdCLEtBQUtmLEtBQUwsR0FBYSxHQUFiLEdBQW1CZSxLQUFLaEIsSUFBcEM7QUFDQWdCLGVBQUtmLEtBQUwsR0FBYSxFQUFiO0FDc0NLLGlCRHJDTEosS0FBS3dHLFdBQUwsQ0FBaUI1RSxTQUFqQixFQUE0QlQsSUFBNUIsQ0NxQ0s7QUR6Q047QUMyQ00saUJEckNMbkIsS0FBS3dHLFdBQUwsQ0FBaUI1RSxTQUFqQixFQUE0QnBCLFlBQTVCLENDcUNLO0FENUNQO0FBQUEsZUFBQTFOLEtBQUE7QUFRTXNMLFlBQUF0TCxLQUFBO0FDd0NELGVEdkNKMkIsUUFBUTNCLEtBQVIsQ0FBY3NMLENBQWQsQ0N1Q0k7QUFDRDtBRGxEVSxLQ29DYjtBQWdCRDtBRHBLSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2FwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbiIsIkJ1c2JveSA9IHJlcXVpcmUoJ2J1c2JveScpO1xuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuSnNvblJvdXRlcy5wYXJzZUZpbGVzID0gKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHRmaWxlcyA9IFtdOyAjIFN0b3JlIGZpbGVzIGluIGFuIGFycmF5IGFuZCB0aGVuIHBhc3MgdGhlbSB0byByZXF1ZXN0LlxuXG5cdGlmIChyZXEubWV0aG9kID09IFwiUE9TVFwiKVxuXHRcdGJ1c2JveSA9IG5ldyBCdXNib3koeyBoZWFkZXJzOiByZXEuaGVhZGVycyB9KTtcblx0XHRidXNib3kub24gXCJmaWxlXCIsICAoZmllbGRuYW1lLCBmaWxlLCBmaWxlbmFtZSwgZW5jb2RpbmcsIG1pbWV0eXBlKSAtPlxuXHRcdFx0aW1hZ2UgPSB7fTsgIyBjcmF0ZSBhbiBpbWFnZSBvYmplY3Rcblx0XHRcdGltYWdlLm1pbWVUeXBlID0gbWltZXR5cGU7XG5cdFx0XHRpbWFnZS5lbmNvZGluZyA9IGVuY29kaW5nO1xuXHRcdFx0aW1hZ2UuZmlsZW5hbWUgPSBmaWxlbmFtZTtcblxuXHRcdFx0IyBidWZmZXIgdGhlIHJlYWQgY2h1bmtzXG5cdFx0XHRidWZmZXJzID0gW107XG5cblx0XHRcdGZpbGUub24gJ2RhdGEnLCAoZGF0YSkgLT5cblx0XHRcdFx0YnVmZmVycy5wdXNoKGRhdGEpO1xuXG5cdFx0XHRmaWxlLm9uICdlbmQnLCAoKSAtPlxuXHRcdFx0XHQjIGNvbmNhdCB0aGUgY2h1bmtzXG5cdFx0XHRcdGltYWdlLmRhdGEgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xuXHRcdFx0XHQjIHB1c2ggdGhlIGltYWdlIG9iamVjdCB0byB0aGUgZmlsZSBhcnJheVxuXHRcdFx0XHRmaWxlcy5wdXNoKGltYWdlKTtcblxuXG5cdFx0YnVzYm95Lm9uIFwiZmllbGRcIiwgKGZpZWxkbmFtZSwgdmFsdWUpIC0+XG5cdFx0XHRyZXEuYm9keVtmaWVsZG5hbWVdID0gdmFsdWU7XG5cblx0XHRidXNib3kub24gXCJmaW5pc2hcIiwgICgpIC0+XG5cdFx0XHQjIFBhc3MgdGhlIGZpbGUgYXJyYXkgdG9nZXRoZXIgd2l0aCB0aGUgcmVxdWVzdFxuXHRcdFx0cmVxLmZpbGVzID0gZmlsZXM7XG5cblx0XHRcdEZpYmVyICgpLT5cblx0XHRcdFx0bmV4dCgpO1xuXHRcdFx0LnJ1bigpO1xuXG5cdFx0IyBQYXNzIHJlcXVlc3QgdG8gYnVzYm95XG5cdFx0cmVxLnBpcGUoYnVzYm95KTtcblxuXHRlbHNlXG5cdFx0bmV4dCgpO1xuXG5cbiNKc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKEpzb25Sb3V0ZXMucGFyc2VGaWxlcyk7IiwidmFyIEJ1c2JveSwgRmliZXI7XG5cbkJ1c2JveSA9IHJlcXVpcmUoJ2J1c2JveScpO1xuXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5Kc29uUm91dGVzLnBhcnNlRmlsZXMgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYnVzYm95LCBmaWxlcztcbiAgZmlsZXMgPSBbXTtcbiAgaWYgKHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgYnVzYm95ID0gbmV3IEJ1c2JveSh7XG4gICAgICBoZWFkZXJzOiByZXEuaGVhZGVyc1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpbGVcIiwgZnVuY3Rpb24oZmllbGRuYW1lLCBmaWxlLCBmaWxlbmFtZSwgZW5jb2RpbmcsIG1pbWV0eXBlKSB7XG4gICAgICB2YXIgYnVmZmVycywgaW1hZ2U7XG4gICAgICBpbWFnZSA9IHt9O1xuICAgICAgaW1hZ2UubWltZVR5cGUgPSBtaW1ldHlwZTtcbiAgICAgIGltYWdlLmVuY29kaW5nID0gZW5jb2Rpbmc7XG4gICAgICBpbWFnZS5maWxlbmFtZSA9IGZpbGVuYW1lO1xuICAgICAgYnVmZmVycyA9IFtdO1xuICAgICAgZmlsZS5vbignZGF0YScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGJ1ZmZlcnMucHVzaChkYXRhKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZpbGUub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpbWFnZS5kYXRhID0gQnVmZmVyLmNvbmNhdChidWZmZXJzKTtcbiAgICAgICAgcmV0dXJuIGZpbGVzLnB1c2goaW1hZ2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgYnVzYm95Lm9uKFwiZmllbGRcIiwgZnVuY3Rpb24oZmllbGRuYW1lLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHJlcS5ib2R5W2ZpZWxkbmFtZV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaW5pc2hcIiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXEuZmlsZXMgPSBmaWxlcztcbiAgICAgIHJldHVybiBGaWJlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgIH0pLnJ1bigpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXEucGlwZShidXNib3kpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXh0KCk7XG4gIH1cbn07XG4iLCJAQXV0aCBvcj0ge31cblxuIyMjXG4gIEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcbiMjI1xudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlICh1c2VyKSAtPlxuICBjaGVjayB1c2VyLFxuICAgIGlkOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG4gICAgZW1haWw6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuXG4gIGlmIF8ua2V5cyh1c2VyKS5sZW5ndGggaXMgbm90IDFcbiAgICB0aHJvdyBuZXcgTWF0Y2guRXJyb3IgJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnXG5cbiAgcmV0dXJuIHRydWVcblxuXG4jIyNcbiAgUmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxuIyMjXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9ICh1c2VyKSAtPlxuICBpZiB1c2VyLmlkXG4gICAgcmV0dXJuIHsnX2lkJzogdXNlci5pZH1cbiAgZWxzZSBpZiB1c2VyLnVzZXJuYW1lXG4gICAgcmV0dXJuIHsndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lfVxuICBlbHNlIGlmIHVzZXIuZW1haWxcbiAgICByZXR1cm4geydlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWx9XG5cbiAgIyBXZSBzaG91bGRuJ3QgYmUgaGVyZSBpZiB0aGUgdXNlciBvYmplY3Qgd2FzIHByb3Blcmx5IHZhbGlkYXRlZFxuICB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInXG5cblxuIyMjXG4gIExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuIyMjXG5AQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9ICh1c2VyLCBwYXNzd29yZCkgLT5cbiAgaWYgbm90IHVzZXIgb3Igbm90IHBhc3N3b3JkXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cbiAgIyBWYWxpZGF0ZSB0aGUgbG9naW4gaW5wdXQgdHlwZXNcbiAgY2hlY2sgdXNlciwgdXNlclZhbGlkYXRvclxuICBjaGVjayBwYXNzd29yZCwgU3RyaW5nXG5cbiAgIyBSZXRyaWV2ZSB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxuICBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpXG4gIGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKVxuXG4gIGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXJcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcbiAgaWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcz8ucGFzc3dvcmRcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuICAjIEF1dGhlbnRpY2F0ZSB0aGUgdXNlcidzIHBhc3N3b3JkXG4gIHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZFxuICBpZiBwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG4gICMgQWRkIGEgbmV3IGF1dGggdG9rZW4gdG8gdGhlIHVzZXIncyBhY2NvdW50XG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbiBhdXRoVG9rZW5cbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4gYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW5cblxuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWR9KS5mZXRjaCgpXG4gIHNwYWNlcyA9IFtdXG4gIF8uZWFjaCBzcGFjZV91c2VycywgKHN1KS0+XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSlcbiAgICAjIHNwYWNlIG11c3QgYmUgcGFpZCwgYW5kIHVzZXIgbXVzdCBiZSBhZG1pbnNcbiAgICBpZiBzcGFjZSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBzdS51c2VyKT49MFxuICAgICAgc3BhY2VzLnB1c2hcbiAgICAgICAgX2lkOiBzcGFjZS5faWRcbiAgICAgICAgbmFtZTogc3BhY2UubmFtZVxuICByZXR1cm4ge2F1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLCB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGFkbWluU3BhY2VzOiBzcGFjZXN9XG4iLCJ2YXIgZ2V0VXNlclF1ZXJ5U2VsZWN0b3IsIHVzZXJWYWxpZGF0b3I7XG5cbnRoaXMuQXV0aCB8fCAodGhpcy5BdXRoID0ge30pO1xuXG5cbi8qXG4gIEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcbiAqL1xuXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24odXNlcikge1xuICBjaGVjayh1c2VyLCB7XG4gICAgaWQ6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgZW1haWw6IE1hdGNoLk9wdGlvbmFsKFN0cmluZylcbiAgfSk7XG4gIGlmIChfLmtleXModXNlcikubGVuZ3RoID09PSAhMSkge1xuICAgIHRocm93IG5ldyBNYXRjaC5FcnJvcignVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCcpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cblxuLypcbiAgUmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxuICovXG5cbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gZnVuY3Rpb24odXNlcikge1xuICBpZiAodXNlci5pZCkge1xuICAgIHJldHVybiB7XG4gICAgICAnX2lkJzogdXNlci5pZFxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci51c2VybmFtZSkge1xuICAgIHJldHVybiB7XG4gICAgICAndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLmVtYWlsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWxcbiAgICB9O1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcicpO1xufTtcblxuXG4vKlxuICBMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcbiAqL1xuXG50aGlzLkF1dGgubG9naW5XaXRoUGFzc3dvcmQgPSBmdW5jdGlvbih1c2VyLCBwYXNzd29yZCkge1xuICB2YXIgYXV0aFRva2VuLCBhdXRoZW50aWNhdGluZ1VzZXIsIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yLCBoYXNoZWRUb2tlbiwgcGFzc3dvcmRWZXJpZmljYXRpb24sIHJlZiwgc3BhY2VfdXNlcnMsIHNwYWNlcztcbiAgaWYgKCF1c2VyIHx8ICFwYXNzd29yZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgY2hlY2sodXNlciwgdXNlclZhbGlkYXRvcik7XG4gIGNoZWNrKHBhc3N3b3JkLCBTdHJpbmcpO1xuICBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpO1xuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3Rvcik7XG4gIGlmICghYXV0aGVudGljYXRpbmdVc2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBpZiAoISgocmVmID0gYXV0aGVudGljYXRpbmdVc2VyLnNlcnZpY2VzKSAhPSBudWxsID8gcmVmLnBhc3N3b3JkIDogdm9pZCAwKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgcGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZChhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkKTtcbiAgaWYgKHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuKGF1dGhUb2tlbik7XG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuKGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuKTtcbiAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkXG4gIH0pLmZldGNoKCk7XG4gIHNwYWNlcyA9IFtdO1xuICBfLmVhY2goc3BhY2VfdXNlcnMsIGZ1bmN0aW9uKHN1KSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3Uuc3BhY2UpO1xuICAgIGlmIChzcGFjZSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBzdS51c2VyKSA+PSAwKSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2goe1xuICAgICAgICBfaWQ6IHNwYWNlLl9pZCxcbiAgICAgICAgbmFtZTogc3BhY2UubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBhdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbixcbiAgICB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsXG4gICAgYWRtaW5TcGFjZXM6IHNwYWNlc1xuICB9O1xufTtcbiIsIi8vIFdlIG5lZWQgYSBmdW5jdGlvbiB0aGF0IHRyZWF0cyB0aHJvd24gZXJyb3JzIGV4YWN0bHkgbGlrZSBJcm9uIFJvdXRlciB3b3VsZC5cbi8vIFRoaXMgZmlsZSBpcyB3cml0dGVuIGluIEphdmFTY3JpcHQgdG8gZW5hYmxlIGNvcHktcGFzdGluZyBJcm9uIFJvdXRlciBjb2RlLlxuXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0wzXG52YXIgZW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcblxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMNDdcbmlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlID0gZnVuY3Rpb24gKGVyciwgcmVxLCByZXMpIHtcbiAgaWYgKHJlcy5zdGF0dXNDb2RlIDwgNDAwKVxuICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuXG4gIGlmIChlcnIuc3RhdHVzKVxuICAgIHJlcy5zdGF0dXNDb2RlID0gZXJyLnN0YXR1cztcblxuICBpZiAoZW52ID09PSAnZGV2ZWxvcG1lbnQnKVxuICAgIG1zZyA9IChlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCkpICsgJ1xcbic7XG4gIGVsc2VcbiAgICAvL1hYWCBnZXQgdGhpcyBmcm9tIHN0YW5kYXJkIGRpY3Qgb2YgZXJyb3IgbWVzc2FnZXM/XG4gICAgbXNnID0gJ1NlcnZlciBlcnJvci4nO1xuXG4gIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKTtcblxuICBpZiAocmVzLmhlYWRlcnNTZW50KVxuICAgIHJldHVybiByZXEuc29ja2V0LmRlc3Ryb3koKTtcblxuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJyk7XG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgQnVmZmVyLmJ5dGVMZW5ndGgobXNnKSk7XG4gIGlmIChyZXEubWV0aG9kID09PSAnSEVBRCcpXG4gICAgcmV0dXJuIHJlcy5lbmQoKTtcbiAgcmVzLmVuZChtc2cpO1xuICByZXR1cm47XG59XG4iLCJjbGFzcyBzaGFyZS5Sb3V0ZVxuXG4gIGNvbnN0cnVjdG9yOiAoQGFwaSwgQHBhdGgsIEBvcHRpb25zLCBAZW5kcG9pbnRzKSAtPlxuICAgICMgQ2hlY2sgaWYgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkXG4gICAgaWYgbm90IEBlbmRwb2ludHNcbiAgICAgIEBlbmRwb2ludHMgPSBAb3B0aW9uc1xuICAgICAgQG9wdGlvbnMgPSB7fVxuXG5cbiAgYWRkVG9BcGk6IGRvIC0+XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ11cblxuICAgIHJldHVybiAtPlxuICAgICAgc2VsZiA9IHRoaXNcblxuICAgICAgIyBUaHJvdyBhbiBlcnJvciBpZiBhIHJvdXRlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgYXQgdGhpcyBwYXRoXG4gICAgICAjIFRPRE86IENoZWNrIGZvciBjb2xsaXNpb25zIHdpdGggcGF0aHMgdGhhdCBmb2xsb3cgc2FtZSBwYXR0ZXJuIHdpdGggZGlmZmVyZW50IHBhcmFtZXRlciBuYW1lc1xuICAgICAgaWYgXy5jb250YWlucyBAYXBpLl9jb25maWcucGF0aHMsIEBwYXRoXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiAje0BwYXRofVwiXG5cbiAgICAgICMgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgT1BUSU9OUyBlbmRwb2ludCB3aXRoIG91ciBvd25cbiAgICAgIEBlbmRwb2ludHMgPSBfLmV4dGVuZCBvcHRpb25zOiBAYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCwgQGVuZHBvaW50c1xuXG4gICAgICAjIENvbmZpZ3VyZSBlYWNoIGVuZHBvaW50IG9uIHRoaXMgcm91dGVcbiAgICAgIEBfcmVzb2x2ZUVuZHBvaW50cygpXG4gICAgICBAX2NvbmZpZ3VyZUVuZHBvaW50cygpXG5cbiAgICAgICMgQWRkIHRvIG91ciBsaXN0IG9mIGV4aXN0aW5nIHBhdGhzXG4gICAgICBAYXBpLl9jb25maWcucGF0aHMucHVzaCBAcGF0aFxuXG4gICAgICBhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyIGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKVxuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cbiAgICAgICAgXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXG5cbiAgICAgICMgU2V0dXAgZW5kcG9pbnRzIG9uIHJvdXRlXG4gICAgICBmdWxsUGF0aCA9IEBhcGkuX2NvbmZpZy5hcGlQYXRoICsgQHBhdGhcbiAgICAgIF8uZWFjaCBhbGxvd2VkTWV0aG9kcywgKG1ldGhvZCkgLT5cbiAgICAgICAgZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdXG4gICAgICAgIEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cbiAgICAgICAgICAjIEFkZCBmdW5jdGlvbiB0byBlbmRwb2ludCBjb250ZXh0IGZvciBpbmRpY2F0aW5nIGEgcmVzcG9uc2UgaGFzIGJlZW4gaW5pdGlhdGVkIG1hbnVhbGx5XG4gICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZVxuICAgICAgICAgIGRvbmVGdW5jID0gLT5cbiAgICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gdHJ1ZVxuXG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID1cbiAgICAgICAgICAgIHVybFBhcmFtczogcmVxLnBhcmFtc1xuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeVxuICAgICAgICAgICAgYm9keVBhcmFtczogcmVxLmJvZHlcbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcVxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlc1xuICAgICAgICAgICAgZG9uZTogZG9uZUZ1bmNcbiAgICAgICAgICAjIEFkZCBlbmRwb2ludCBjb25maWcgb3B0aW9ucyB0byBjb250ZXh0XG4gICAgICAgICAgXy5leHRlbmQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuXG4gICAgICAgICAgIyBSdW4gdGhlIHJlcXVlc3RlZCBlbmRwb2ludFxuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IG51bGxcbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHNlbGYuX2NhbGxFbmRwb2ludCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG4gICAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICAgICMgRG8gZXhhY3RseSB3aGF0IElyb24gUm91dGVyIHdvdWxkIGhhdmUgZG9uZSwgdG8gYXZvaWQgY2hhbmdpbmcgdGhlIEFQSVxuICAgICAgICAgICAgaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UoZXJyb3IsIHJlcSwgcmVzKTtcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgaWYgcmVzcG9uc2VJbml0aWF0ZWRcbiAgICAgICAgICAgICMgRW5zdXJlIHRoZSByZXNwb25zZSBpcyBwcm9wZXJseSBjb21wbGV0ZWRcbiAgICAgICAgICAgIHJlcy5lbmQoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgcmVzLmhlYWRlcnNTZW50XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogI3ttZXRob2R9ICN7ZnVsbFBhdGh9XCJcbiAgICAgICAgICAgIGVsc2UgaWYgcmVzcG9uc2VEYXRhIGlzIG51bGwgb3IgcmVzcG9uc2VEYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXG5cbiAgICAgICAgICAjIEdlbmVyYXRlIGFuZCByZXR1cm4gdGhlIGh0dHAgcmVzcG9uc2UsIGhhbmRsaW5nIHRoZSBkaWZmZXJlbnQgZW5kcG9pbnQgcmVzcG9uc2UgdHlwZXNcbiAgICAgICAgICBpZiByZXNwb25zZURhdGEuYm9keSBhbmQgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIG9yIHJlc3BvbnNlRGF0YS5oZWFkZXJzKVxuICAgICAgICAgICAgc2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YS5ib2R5LCByZXNwb25zZURhdGEuc3RhdHVzQ29kZSwgcmVzcG9uc2VEYXRhLmhlYWRlcnNcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhXG5cbiAgICAgIF8uZWFjaCByZWplY3RlZE1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cbiAgICAgICAgICByZXNwb25zZURhdGEgPSBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdBUEkgZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QnXG4gICAgICAgICAgaGVhZGVycyA9ICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxuICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVyc1xuXG5cbiAgIyMjXG4gICAgQ29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG4gICAgZnVuY3Rpb25cblxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAjIyNcbiAgX3Jlc29sdmVFbmRwb2ludHM6IC0+XG4gICAgXy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kLCBlbmRwb2ludHMpIC0+XG4gICAgICBpZiBfLmlzRnVuY3Rpb24oZW5kcG9pbnQpXG4gICAgICAgIGVuZHBvaW50c1ttZXRob2RdID0ge2FjdGlvbjogZW5kcG9pbnR9XG4gICAgcmV0dXJuXG5cblxuICAjIyNcbiAgICBDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG4gICAgYmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXG5cbiAgICBBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICAgIGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG4gICAgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG5cbiAgICBBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcbiAgICBhY2Nlc3NlZCBhdCA8Y29kZT5lbmRwb2ludC5hdXRoUmVxdWlyZWQ8L2NvZGU+IGFuZCA8Y29kZT5lbmRwb2ludC5yb2xlUmVxdWlyZWQ8L2NvZGU+LFxuICAgIHJlc3BlY3RpdmVseS5cblxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgIEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcbiAgIyMjXG4gIF9jb25maWd1cmVFbmRwb2ludHM6IC0+XG4gICAgXy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kKSAtPlxuICAgICAgaWYgbWV0aG9kIGlzbnQgJ29wdGlvbnMnXG4gICAgICAgICMgQ29uZmlndXJlIGFjY2VwdGFibGUgcm9sZXNcbiAgICAgICAgaWYgbm90IEBvcHRpb25zPy5yb2xlUmVxdWlyZWRcbiAgICAgICAgICBAb3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXVxuICAgICAgICBpZiBub3QgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW11cbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbiBlbmRwb2ludC5yb2xlUmVxdWlyZWQsIEBvcHRpb25zLnJvbGVSZXF1aXJlZFxuICAgICAgICAjIE1ha2UgaXQgZWFzaWVyIHRvIGNoZWNrIGlmIG5vIHJvbGVzIGFyZSByZXF1aXJlZFxuICAgICAgICBpZiBfLmlzRW1wdHkgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2VcblxuICAgICAgICAjIENvbmZpZ3VyZSBhdXRoIHJlcXVpcmVtZW50XG4gICAgICAgIGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZCBpcyB1bmRlZmluZWRcbiAgICAgICAgICBpZiBAb3B0aW9ucz8uYXV0aFJlcXVpcmVkIG9yIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlXG5cbiAgICAgICAgaWYgQG9wdGlvbnM/LnNwYWNlUmVxdWlyZWRcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gQG9wdGlvbnMuc3BhY2VSZXF1aXJlZFxuICAgICAgICByZXR1cm5cbiAgICAsIHRoaXNcbiAgICByZXR1cm5cblxuXG4gICMjI1xuICAgIEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcblxuICAgIEByZXR1cm5zIFRoZSBlbmRwb2ludCByZXNwb25zZSBvciBhIDQwMSBpZiBhdXRoZW50aWNhdGlvbiBmYWlsc1xuICAjIyNcbiAgX2NhbGxFbmRwb2ludDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG4gICAgIyBDYWxsIHRoZSBlbmRwb2ludCBpZiBhdXRoZW50aWNhdGlvbiBkb2Vzbid0IGZhaWxcbiAgICBpZiBAX2F1dGhBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG4gICAgICBpZiBAX3JvbGVBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG4gICAgICAgIGlmIEBfc3BhY2VBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG4gICAgICAgICAgI2VuZHBvaW50LmFjdGlvbi5jYWxsIGVuZHBvaW50Q29udGV4dFxuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb25cbiAgICAgICAgICAgIGlzU2ltdWxhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcbiAgICAgICAgICAgIGNvbm5lY3Rpb246IG51bGwsXG4gICAgICAgICAgICByYW5kb21TZWVkOiBERFBDb21tb24ubWFrZVJwY1NlZWQoKVxuICAgICAgIFxuICAgICAgICAgIHJldHVybiBERFAuX0N1cnJlbnRJbnZvY2F0aW9uLndpdGhWYWx1ZSBpbnZvY2F0aW9uLCAtPlxuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzdGF0dXNDb2RlOiA0MDNcbiAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ31cbiAgICAgIGVsc2VcbiAgICAgICAgc3RhdHVzQ29kZTogNDAzXG4gICAgICAgIGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLid9XG4gICAgZWxzZVxuICAgICAgc3RhdHVzQ29kZTogNDAxXG4gICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ31cblxuXG4gICMjI1xuICAgIEF1dGhlbnRpY2F0ZSB0aGUgZ2l2ZW4gZW5kcG9pbnQgaWYgcmVxdWlyZWRcblxuICAgIE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3JcbiAgICBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcbiAgICBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cblxuICAgIEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcbiAgIyMjXG4gIF9hdXRoQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuICAgIGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZFxuICAgICAgQF9hdXRoZW50aWNhdGUgZW5kcG9pbnRDb250ZXh0XG4gICAgZWxzZSB0cnVlXG5cblxuICAjIyNcbiAgICBWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxuXG4gICAgSWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxuXG4gICAgQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICMjI1xuICBfYXV0aGVudGljYXRlOiAoZW5kcG9pbnRDb250ZXh0KSAtPlxuICAgICMgR2V0IGF1dGggaW5mb1xuICAgIGF1dGggPSBAYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KVxuXG4gICAgIyBHZXQgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2VcbiAgICBpZiBhdXRoPy51c2VySWQgYW5kIGF1dGg/LnRva2VuIGFuZCBub3QgYXV0aD8udXNlclxuICAgICAgdXNlclNlbGVjdG9yID0ge31cbiAgICAgIHVzZXJTZWxlY3Rvci5faWQgPSBhdXRoLnVzZXJJZFxuICAgICAgdXNlclNlbGVjdG9yW0BhcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW5cbiAgICAgIGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lIHVzZXJTZWxlY3RvclxuXG4gICAgIyBBdHRhY2ggdGhlIHVzZXIgYW5kIHRoZWlyIElEIHRvIHRoZSBjb250ZXh0IGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgIGlmIGF1dGg/LnVzZXJcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VyID0gYXV0aC51c2VyXG4gICAgICBlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZFxuICAgICAgdHJ1ZVxuICAgIGVsc2UgZmFsc2VcblxuICAjIyNcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgICAgICAgICAgICBlbmRwb2ludFxuICAjIyNcbiAgX3NwYWNlQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuICAgIGlmIGVuZHBvaW50LnNwYWNlUmVxdWlyZWRcbiAgICAgIGF1dGggPSBAYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KVxuICAgICAgaWYgYXV0aD8uc3BhY2VJZFxuICAgICAgICBzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGgudXNlcklkLCBzcGFjZTphdXRoLnNwYWNlSWR9KS5jb3VudCgpXG4gICAgICAgIGlmIHNwYWNlX3VzZXJzX2NvdW50XG4gICAgICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShhdXRoLnNwYWNlSWQpXG4gICAgICAgICAgIyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXG4gICAgICAgICAgaWYgc3BhY2UgYW5kIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIGF1dGgudXNlcklkKT49MFxuICAgICAgICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWRcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCJcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG5cbiAgIyMjXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcblxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cblxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgIyMjXG4gIF9yb2xlQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuICAgIGlmIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgaWYgXy5pc0VtcHR5IF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIHRydWVcblxuXG4gICMjI1xuICAgIFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG4gICMjI1xuICBfcmVzcG9uZDogKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlPTIwMCwgaGVhZGVycz17fSkgLT5cbiAgICAjIE92ZXJyaWRlIGFueSBkZWZhdWx0IGhlYWRlcnMgdGhhdCBoYXZlIGJlZW4gcHJvdmlkZWQgKGtleXMgYXJlIG5vcm1hbGl6ZWQgdG8gYmUgY2FzZSBpbnNlbnNpdGl2ZSlcbiAgICAjIFRPRE86IENvbnNpZGVyIG9ubHkgbG93ZXJjYXNpbmcgdGhlIGhlYWRlciBrZXlzIHdlIG5lZWQgbm9ybWFsaXplZCwgbGlrZSBDb250ZW50LVR5cGVcbiAgICBkZWZhdWx0SGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBAYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnNcbiAgICBoZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIGhlYWRlcnNcbiAgICBoZWFkZXJzID0gXy5leHRlbmQgZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnNcblxuICAgICMgUHJlcGFyZSBKU09OIGJvZHkgZm9yIHJlc3BvbnNlIHdoZW4gQ29udGVudC1UeXBlIGluZGljYXRlcyBKU09OIHR5cGVcbiAgICBpZiBoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgaXNudCBudWxsXG4gICAgICBpZiBAYXBpLl9jb25maWcucHJldHR5SnNvblxuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keSwgdW5kZWZpbmVkLCAyXG4gICAgICBlbHNlXG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeSBib2R5XG5cbiAgICAjIFNlbmQgcmVzcG9uc2VcbiAgICBzZW5kUmVzcG9uc2UgPSAtPlxuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkIHN0YXR1c0NvZGUsIGhlYWRlcnNcbiAgICAgIHJlc3BvbnNlLndyaXRlIGJvZHlcbiAgICAgIHJlc3BvbnNlLmVuZCgpXG4gICAgaWYgc3RhdHVzQ29kZSBpbiBbNDAxLCA0MDNdXG4gICAgICAjIEhhY2tlcnMgY2FuIG1lYXN1cmUgdGhlIHJlc3BvbnNlIHRpbWUgdG8gZGV0ZXJtaW5lIHRoaW5ncyBsaWtlIHdoZXRoZXIgdGhlIDQwMSByZXNwb25zZSB3YXMgXG4gICAgICAjIGNhdXNlZCBieSBiYWQgdXNlciBpZCB2cyBiYWQgcGFzc3dvcmQuXG4gICAgICAjIEluIGRvaW5nIHNvLCB0aGV5IGNhbiBmaXJzdCBzY2FuIGZvciB2YWxpZCB1c2VyIGlkcyByZWdhcmRsZXNzIG9mIHZhbGlkIHBhc3N3b3Jkcy5cbiAgICAgICMgRGVsYXkgYnkgYSByYW5kb20gYW1vdW50IHRvIHJlZHVjZSB0aGUgYWJpbGl0eSBmb3IgYSBoYWNrZXIgdG8gZGV0ZXJtaW5lIHRoZSByZXNwb25zZSB0aW1lLlxuICAgICAgIyBTZWUgaHR0cHM6Ly93d3cub3dhc3Aub3JnL2luZGV4LnBocC9CbG9ja2luZ19CcnV0ZV9Gb3JjZV9BdHRhY2tzI0ZpbmRpbmdfT3RoZXJfQ291bnRlcm1lYXN1cmVzXG4gICAgICAjIFNlZSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9UaW1pbmdfYXR0YWNrXG4gICAgICBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMFxuICAgICAgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28gPSAxICsgTWF0aC5yYW5kb20oKVxuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd29cbiAgICAgIE1ldGVvci5zZXRUaW1lb3V0IHNlbmRSZXNwb25zZSwgZGVsYXlJbk1pbGxpc2Vjb25kc1xuICAgIGVsc2VcbiAgICAgIHNlbmRSZXNwb25zZSgpXG5cbiAgIyMjXG4gICAgUmV0dXJuIHRoZSBvYmplY3Qgd2l0aCBhbGwgb2YgdGhlIGtleXMgY29udmVydGVkIHRvIGxvd2VyY2FzZVxuICAjIyNcbiAgX2xvd2VyQ2FzZUtleXM6IChvYmplY3QpIC0+XG4gICAgXy5jaGFpbiBvYmplY3RcbiAgICAucGFpcnMoKVxuICAgIC5tYXAgKGF0dHIpIC0+XG4gICAgICBbYXR0clswXS50b0xvd2VyQ2FzZSgpLCBhdHRyWzFdXVxuICAgIC5vYmplY3QoKVxuICAgIC52YWx1ZSgpXG4iLCJzaGFyZS5Sb3V0ZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUm91dGUoYXBpLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMxKSB7XG4gICAgdGhpcy5hcGkgPSBhcGk7XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuZW5kcG9pbnRzID0gZW5kcG9pbnRzMTtcbiAgICBpZiAoIXRoaXMuZW5kcG9pbnRzKSB7XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IHRoaXMub3B0aW9ucztcbiAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIFJvdXRlLnByb3RvdHlwZS5hZGRUb0FwaSA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgYXZhaWxhYmxlTWV0aG9kcztcbiAgICBhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWxsb3dlZE1ldGhvZHMsIGZ1bGxQYXRoLCByZWplY3RlZE1ldGhvZHMsIHNlbGY7XG4gICAgICBzZWxmID0gdGhpcztcbiAgICAgIGlmIChfLmNvbnRhaW5zKHRoaXMuYXBpLl9jb25maWcucGF0aHMsIHRoaXMucGF0aCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGFkZCBhIHJvdXRlIGF0IGFuIGV4aXN0aW5nIHBhdGg6IFwiICsgdGhpcy5wYXRoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW5kcG9pbnRzID0gXy5leHRlbmQoe1xuICAgICAgICBvcHRpb25zOiB0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcbiAgICAgIH0sIHRoaXMuZW5kcG9pbnRzKTtcbiAgICAgIHRoaXMuX3Jlc29sdmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuX2NvbmZpZ3VyZUVuZHBvaW50cygpO1xuICAgICAgdGhpcy5hcGkuX2NvbmZpZy5wYXRocy5wdXNoKHRoaXMucGF0aCk7XG4gICAgICBhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyKGF2YWlsYWJsZU1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpO1xuICAgICAgfSk7XG4gICAgICByZWplY3RlZE1ldGhvZHMgPSBfLnJlamVjdChhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgZnVsbFBhdGggPSB0aGlzLmFwaS5fY29uZmlnLmFwaVBhdGggKyB0aGlzLnBhdGg7XG4gICAgICBfLmVhY2goYWxsb3dlZE1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB2YXIgZW5kcG9pbnQ7XG4gICAgICAgIGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXTtcbiAgICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKG1ldGhvZCwgZnVsbFBhdGgsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICAgICAgdmFyIGRvbmVGdW5jLCBlbmRwb2ludENvbnRleHQsIGVycm9yLCByZXNwb25zZURhdGEsIHJlc3BvbnNlSW5pdGlhdGVkO1xuICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2U7XG4gICAgICAgICAgZG9uZUZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZUluaXRpYXRlZCA9IHRydWU7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBlbmRwb2ludENvbnRleHQgPSB7XG4gICAgICAgICAgICB1cmxQYXJhbXM6IHJlcS5wYXJhbXMsXG4gICAgICAgICAgICBxdWVyeVBhcmFtczogcmVxLnF1ZXJ5LFxuICAgICAgICAgICAgYm9keVBhcmFtczogcmVxLmJvZHksXG4gICAgICAgICAgICByZXF1ZXN0OiByZXEsXG4gICAgICAgICAgICByZXNwb25zZTogcmVzLFxuICAgICAgICAgICAgZG9uZTogZG9uZUZ1bmNcbiAgICAgICAgICB9O1xuICAgICAgICAgIF8uZXh0ZW5kKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpO1xuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IG51bGw7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHNlbGYuX2NhbGxFbmRwb2ludChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UoZXJyb3IsIHJlcSwgcmVzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlSW5pdGlhdGVkKSB7XG4gICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChyZXMuaGVhZGVyc1NlbnQpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiBcIiArIG1ldGhvZCArIFwiIFwiICsgZnVsbFBhdGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZURhdGEgPT09IG51bGwgfHwgcmVzcG9uc2VEYXRhID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJldHVybiBudWxsIG9yIHVuZGVmaW5lZCBmcm9tIGFuIGVuZHBvaW50OiBcIiArIG1ldGhvZCArIFwiIFwiICsgZnVsbFBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzcG9uc2VEYXRhLmJvZHkgJiYgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIHx8IHJlc3BvbnNlRGF0YS5oZWFkZXJzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2gocmVqZWN0ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKG1ldGhvZCwgZnVsbFBhdGgsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICAgICAgdmFyIGhlYWRlcnMsIHJlc3BvbnNlRGF0YTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSB7XG4gICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgIH07XG4gICAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICAgICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVycyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSkoKTtcblxuXG4gIC8qXG4gICAgQ29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG4gICAgZnVuY3Rpb25cbiAgXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzb2x2ZUVuZHBvaW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIF8uZWFjaCh0aGlzLmVuZHBvaW50cywgZnVuY3Rpb24oZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKGVuZHBvaW50KSkge1xuICAgICAgICByZXR1cm4gZW5kcG9pbnRzW21ldGhvZF0gPSB7XG4gICAgICAgICAgYWN0aW9uOiBlbmRwb2ludFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG5cbiAgLypcbiAgICBDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG4gICAgYmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXG4gIFxuICAgIEF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3IgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuXG4gICAgZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcbiAgICBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gICAgQWZ0ZXIgdGhlIGVuZHBvaW50IGlzIGNvbmZpZ3VyZWQsIGFsbCBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudHMgb2YgYW4gZW5kcG9pbnQgY2FuIGJlXG4gICAgYWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgICByZXNwZWN0aXZlbHkuXG4gIFxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgIEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jb25maWd1cmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QpIHtcbiAgICAgIHZhciByZWYsIHJlZjEsIHJlZjI7XG4gICAgICBpZiAobWV0aG9kICE9PSAnb3B0aW9ucycpIHtcbiAgICAgICAgaWYgKCEoKHJlZiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZi5yb2xlUmVxdWlyZWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQpO1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50LnJvbGVSZXF1aXJlZCkpIHtcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICBpZiAoKChyZWYxID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmMS5hdXRoUmVxdWlyZWQgOiB2b2lkIDApIHx8IGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgocmVmMiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjIuc3BhY2VSZXF1aXJlZCA6IHZvaWQgMCkge1xuICAgICAgICAgIGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSB0aGlzLm9wdGlvbnMuc3BhY2VSZXF1aXJlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG4gIFxuICAgIEByZXR1cm5zIFRoZSBlbmRwb2ludCByZXNwb25zZSBvciBhIDQwMSBpZiBhdXRoZW50aWNhdGlvbiBmYWlsc1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2NhbGxFbmRwb2ludCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICB2YXIgaW52b2NhdGlvbjtcbiAgICBpZiAodGhpcy5fYXV0aEFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICBpZiAodGhpcy5fcm9sZUFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICAgIGlmICh0aGlzLl9zcGFjZUFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICAgICAgaW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvbih7XG4gICAgICAgICAgICBpc1NpbXVsYXRpb246IHRydWUsXG4gICAgICAgICAgICB1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXG4gICAgICAgICAgICBjb25uZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgcmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUoaW52b2NhdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZW5kcG9pbnQuYWN0aW9uLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdCYWQgWC1TcGFjZS1JZCwgT25seSBhZG1pbnMgb2YgcGFpZCBzcGFjZSBjYW4gY2FsbCB0aGlzIGFwaS4nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiA0MDMsXG4gICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRvIHRoaXMuJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzQ29kZTogNDAxLFxuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gZG8gdGhpcy4nXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG4gIFxuICAgIE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3JcbiAgICBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcbiAgICBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gICAgQHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlKGVuZHBvaW50Q29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgVmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcbiAgXG4gICAgSWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxuICBcbiAgICBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoZW50aWNhdGUgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQpIHtcbiAgICB2YXIgYXV0aCwgdXNlclNlbGVjdG9yO1xuICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgaWYgKChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXJJZCA6IHZvaWQgMCkgJiYgKGF1dGggIT0gbnVsbCA/IGF1dGgudG9rZW4gOiB2b2lkIDApICYmICEoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSkge1xuICAgICAgdXNlclNlbGVjdG9yID0ge307XG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWQ7XG4gICAgICB1c2VyU2VsZWN0b3JbdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW47XG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VyU2VsZWN0b3IpO1xuICAgIH1cbiAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSB7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlcjtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgICAgICAgICAgICBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3NwYWNlQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGF1dGgsIHNwYWNlLCBzcGFjZV91c2Vyc19jb3VudDtcbiAgICBpZiAoZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCkge1xuICAgICAgYXV0aCA9IHRoaXMuYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICAgIGlmIChhdXRoICE9IG51bGwgPyBhdXRoLnNwYWNlSWQgOiB2b2lkIDApIHtcbiAgICAgICAgc3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICB1c2VyOiBhdXRoLnVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogYXV0aC5zcGFjZUlkXG4gICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgIGlmIChzcGFjZV91c2Vyc19jb3VudCkge1xuICAgICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKTtcbiAgICAgICAgICBpZiAoc3BhY2UgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpID49IDApIHtcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yb2xlQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgaWYgKF8uaXNFbXB0eShfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qXG4gICAgUmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3RcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNwb25kID0gZnVuY3Rpb24ocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGUsIGhlYWRlcnMpIHtcbiAgICB2YXIgZGVmYXVsdEhlYWRlcnMsIGRlbGF5SW5NaWxsaXNlY29uZHMsIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzLCByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bywgc2VuZFJlc3BvbnNlO1xuICAgIGlmIChzdGF0dXNDb2RlID09IG51bGwpIHtcbiAgICAgIHN0YXR1c0NvZGUgPSAyMDA7XG4gICAgfVxuICAgIGlmIChoZWFkZXJzID09IG51bGwpIHtcbiAgICAgIGhlYWRlcnMgPSB7fTtcbiAgICB9XG4gICAgZGVmYXVsdEhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKGhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSBfLmV4dGVuZChkZWZhdWx0SGVhZGVycywgaGVhZGVycyk7XG4gICAgaWYgKGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYXBpLl9jb25maWcucHJldHR5SnNvbikge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSwgdm9pZCAwLCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNwb25zZS53cml0ZUhlYWQoc3RhdHVzQ29kZSwgaGVhZGVycyk7XG4gICAgICByZXNwb25zZS53cml0ZShib2R5KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5lbmQoKTtcbiAgICB9O1xuICAgIGlmIChzdGF0dXNDb2RlID09PSA0MDEgfHwgc3RhdHVzQ29kZSA9PT0gNDAzKSB7XG4gICAgICBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMDtcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKCk7XG4gICAgICBkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bztcbiAgICAgIHJldHVybiBNZXRlb3Iuc2V0VGltZW91dChzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2VuZFJlc3BvbnNlKCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fbG93ZXJDYXNlS2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBfLmNoYWluKG9iamVjdCkucGFpcnMoKS5tYXAoZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dO1xuICAgIH0pLm9iamVjdCgpLnZhbHVlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJvdXRlO1xuXG59KSgpO1xuIiwiY2xhc3MgQFJlc3RpdnVzXG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgIEBfcm91dGVzID0gW11cbiAgICBAX2NvbmZpZyA9XG4gICAgICBwYXRoczogW11cbiAgICAgIHVzZURlZmF1bHRBdXRoOiBmYWxzZVxuICAgICAgYXBpUGF0aDogJ2FwaS8nXG4gICAgICB2ZXJzaW9uOiBudWxsXG4gICAgICBwcmV0dHlKc29uOiBmYWxzZVxuICAgICAgYXV0aDpcbiAgICAgICAgdG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nXG4gICAgICAgIHVzZXI6IC0+XG4gICAgICAgICAgaWYgQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG4gICAgICAgICAgaWYgQHJlcXVlc3QudXNlcklkXG4gICAgICAgICAgICBfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogQHJlcXVlc3QudXNlcklkfSlcbiAgICAgICAgICAgIHVzZXI6IF91c2VyXG4gICAgICAgICAgICB1c2VySWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddXG4gICAgICAgICAgICBzcGFjZUlkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ11cbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHVzZXJJZDogQHJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ11cbiAgICAgICAgICAgIHNwYWNlSWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXVxuICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICBkZWZhdWx0SGVhZGVyczpcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgZW5hYmxlQ29yczogdHJ1ZVxuXG4gICAgIyBDb25maWd1cmUgQVBJIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcbiAgICBfLmV4dGVuZCBAX2NvbmZpZywgb3B0aW9uc1xuXG4gICAgaWYgQF9jb25maWcuZW5hYmxlQ29yc1xuICAgICAgY29yc0hlYWRlcnMgPVxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQnXG5cbiAgICAgIGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4nXG5cbiAgICAgICMgU2V0IGRlZmF1bHQgaGVhZGVyIHRvIGVuYWJsZSBDT1JTIGlmIGNvbmZpZ3VyZWRcbiAgICAgIF8uZXh0ZW5kIEBfY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVyc1xuXG4gICAgICBpZiBub3QgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxuICAgICAgICBAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gLT5cbiAgICAgICAgICBAcmVzcG9uc2Uud3JpdGVIZWFkIDIwMCwgY29yc0hlYWRlcnNcbiAgICAgICAgICBAZG9uZSgpXG5cbiAgICAjIE5vcm1hbGl6ZSB0aGUgQVBJIHBhdGhcbiAgICBpZiBAX2NvbmZpZy5hcGlQYXRoWzBdIGlzICcvJ1xuICAgICAgQF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGguc2xpY2UgMVxuICAgIGlmIF8ubGFzdChAX2NvbmZpZy5hcGlQYXRoKSBpc250ICcvJ1xuICAgICAgQF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGggKyAnLydcblxuICAgICMgVVJMIHBhdGggdmVyc2lvbmluZyBpcyB0aGUgb25seSB0eXBlIG9mIEFQSSB2ZXJzaW9uaW5nIGN1cnJlbnRseSBhdmFpbGFibGUsIHNvIGlmIGEgdmVyc2lvbiBpc1xuICAgICMgcHJvdmlkZWQsIGFwcGVuZCBpdCB0byB0aGUgYmFzZSBwYXRoIG9mIHRoZSBBUElcbiAgICBpZiBAX2NvbmZpZy52ZXJzaW9uXG4gICAgICBAX2NvbmZpZy5hcGlQYXRoICs9IEBfY29uZmlnLnZlcnNpb24gKyAnLydcblxuICAgICMgQWRkIGRlZmF1bHQgbG9naW4gYW5kIGxvZ291dCBlbmRwb2ludHMgaWYgYXV0aCBpcyBjb25maWd1cmVkXG4gICAgaWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcbiAgICAgIEBfaW5pdEF1dGgoKVxuICAgIGVsc2UgaWYgQF9jb25maWcudXNlQXV0aFxuICAgICAgQF9pbml0QXV0aCgpXG4gICAgICBjb25zb2xlLndhcm4gJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArXG4gICAgICAgICAgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJ1xuXG4gICAgcmV0dXJuIHRoaXNcblxuXG4gICMjIypcbiAgICBBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG5cbiAgICBAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXG4gICAgQHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAgQHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcbiAgICBAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXG4gICAgICAgIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcbiAgICAgICAgYW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxuICAjIyNcbiAgYWRkUm91dGU6IChwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIC0+XG4gICAgIyBDcmVhdGUgYSBuZXcgcm91dGUgYW5kIGFkZCBpdCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyByb3V0ZXNcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpXG4gICAgQF9yb3V0ZXMucHVzaChyb3V0ZSlcblxuICAgIHJvdXRlLmFkZFRvQXBpKClcblxuICAgIHJldHVybiB0aGlzXG5cblxuICAjIyMqXG4gICAgR2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAjIyNcbiAgYWRkQ29sbGVjdGlvbjogKGNvbGxlY3Rpb24sIG9wdGlvbnM9e30pIC0+XG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXVxuICAgIG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ11cblxuICAgICMgR3JhYiB0aGUgc2V0IG9mIGVuZHBvaW50c1xuICAgIGlmIGNvbGxlY3Rpb24gaXMgTWV0ZW9yLnVzZXJzXG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF91c2VyQ29sbGVjdGlvbkVuZHBvaW50c1xuICAgIGVsc2VcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSBAX2NvbGxlY3Rpb25FbmRwb2ludHNcblxuICAgICMgRmxhdHRlbiB0aGUgb3B0aW9ucyBhbmQgc2V0IGRlZmF1bHRzIGlmIG5lY2Vzc2FyeVxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIG9yIHt9XG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgb3Ige31cbiAgICBleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgb3IgW11cbiAgICAjIFVzZSBjb2xsZWN0aW9uIG5hbWUgYXMgZGVmYXVsdCBwYXRoXG4gICAgcGF0aCA9IG9wdGlvbnMucGF0aCBvciBjb2xsZWN0aW9uLl9uYW1lXG5cbiAgICAjIFNlcGFyYXRlIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRzIGJ5IHRoZSByb3V0ZSB0aGV5IGJlbG9uZyB0byAob25lIGZvciBvcGVyYXRpbmcgb24gdGhlIGVudGlyZVxuICAgICMgY29sbGVjdGlvbiBhbmQgb25lIGZvciBvcGVyYXRpbmcgb24gYSBzaW5nbGUgZW50aXR5IHdpdGhpbiB0aGUgY29sbGVjdGlvbilcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fVxuICAgIGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge31cbiAgICBpZiBfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSBhbmQgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKVxuICAgICAgIyBHZW5lcmF0ZSBhbGwgZW5kcG9pbnRzIG9uIHRoaXMgY29sbGVjdGlvblxuICAgICAgXy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgICMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xuICAgICAgICBpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxuICAgICAgICAgIF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcbiAgICAgICAgZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcbiAgICAgICAgcmV0dXJuXG4gICAgICAsIHRoaXNcbiAgICBlbHNlXG4gICAgICAjIEdlbmVyYXRlIGFueSBlbmRwb2ludHMgdGhhdCBoYXZlbid0IGJlZW4gZXhwbGljaXRseSBleGNsdWRlZFxuICAgICAgXy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIGlmIG1ldGhvZCBub3QgaW4gZXhjbHVkZWRFbmRwb2ludHMgYW5kIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdIGlzbnQgZmFsc2VcbiAgICAgICAgICAjIENvbmZpZ3VyZSBlbmRwb2ludCBhbmQgbWFwIHRvIGl0J3MgaHR0cCBtZXRob2RcbiAgICAgICAgICAjIFRPRE86IENvbnNpZGVyIHByZWRlZmluaW5nIGEgbWFwIG9mIG1ldGhvZHMgdG8gdGhlaXIgaHR0cCBtZXRob2QgdHlwZSAoZS5nLiwgZ2V0QWxsOiBnZXQpXG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF1cbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fVxuICAgICAgICAgIF8uZWFjaCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgKGFjdGlvbiwgbWV0aG9kVHlwZSkgLT5cbiAgICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9XG4gICAgICAgICAgICAgIF8uY2hhaW4gYWN0aW9uXG4gICAgICAgICAgICAgIC5jbG9uZSgpXG4gICAgICAgICAgICAgIC5leHRlbmQgZW5kcG9pbnRPcHRpb25zXG4gICAgICAgICAgICAgIC52YWx1ZSgpXG4gICAgICAgICAgIyBQYXJ0aXRpb24gdGhlIGVuZHBvaW50cyBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgcm91dGVzXG4gICAgICAgICAgaWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cbiAgICAgICAgICAgIF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XG4gICAgICAgICAgZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAsIHRoaXNcblxuICAgICMgQWRkIHRoZSByb3V0ZXMgdG8gdGhlIEFQSVxuICAgIEBhZGRSb3V0ZSBwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50c1xuICAgIEBhZGRSb3V0ZSBcIiN7cGF0aH0vOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHNcblxuICAgIHJldHVybiB0aGlzXG5cblxuICAjIyMqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG4gICMjI1xuICBfY29sbGVjdGlvbkVuZHBvaW50czpcbiAgICBnZXQ6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZ2V0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgc2VsZWN0b3JcbiAgICAgICAgICBpZiBlbnRpdHlcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuICAgIHB1dDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBwdXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCAkc2V0OiBAYm9keVBhcmFtc1xuICAgICAgICAgIGlmIGVudGl0eUlzVXBkYXRlZFxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuICAgIGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBkZWxldGU6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuICAgICAgICAgIGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuICAgIHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgcG9zdDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgQGJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXG4gICAgICAgICAgaWYgZW50aXR5XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDFcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCd9XG4gICAgZ2V0QWxsOiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIHNlbGVjdG9yID0ge31cbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG4gICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKClcbiAgICAgICAgICBpZiBlbnRpdGllc1xuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nfVxuXG5cbiAgIyMjKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcbiAgIyMjXG4gIF91c2VyQ29sbGVjdGlvbkVuZHBvaW50czpcbiAgICBnZXQ6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZ2V0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxuICAgICAgICAgIGlmIGVudGl0eVxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XG4gICAgcHV0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIHB1dDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIEB1cmxQYXJhbXMuaWQsICRzZXQ6IHByb2ZpbGU6IEBib2R5UGFyYW1zXG4gICAgICAgICAgaWYgZW50aXR5SXNVcGRhdGVkXG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZCwgZmllbGRzOiBwcm9maWxlOiAxXG4gICAgICAgICAgICB7c3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuICAgIGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBkZWxldGU6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBpZiBjb2xsZWN0aW9uLnJlbW92ZSBAdXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuICAgIHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgcG9zdDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgICMgQ3JlYXRlIGEgbmV3IHVzZXIgYWNjb3VudFxuICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlciBAYm9keVBhcmFtc1xuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZCwgZmllbGRzOiBwcm9maWxlOiAxXG4gICAgICAgICAgaWYgZW50aXR5XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDFcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCd9XG4gICAgZ2V0QWxsOiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCBmaWVsZHM6IHByb2ZpbGU6IDEpLmZldGNoKClcbiAgICAgICAgICBpZiBlbnRpdGllc1xuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2Vycyd9XG5cblxuICAjIyNcbiAgICBBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXG4gICMjI1xuICBfaW5pdEF1dGg6IC0+XG4gICAgc2VsZiA9IHRoaXNcbiAgICAjIyNcbiAgICAgIEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcblxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAjIyNcbiAgICBAYWRkUm91dGUgJ2xvZ2luJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LFxuICAgICAgcG9zdDogLT5cbiAgICAgICAgIyBHcmFiIHRoZSB1c2VybmFtZSBvciBlbWFpbCB0aGF0IHRoZSB1c2VyIGlzIGxvZ2dpbmcgaW4gd2l0aFxuICAgICAgICB1c2VyID0ge31cbiAgICAgICAgaWYgQGJvZHlQYXJhbXMudXNlclxuICAgICAgICAgIGlmIEBib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpIGlzIC0xXG4gICAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlclxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy51c2VyXG4gICAgICAgIGVsc2UgaWYgQGJvZHlQYXJhbXMudXNlcm5hbWVcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlcm5hbWVcbiAgICAgICAgZWxzZSBpZiBAYm9keVBhcmFtcy5lbWFpbFxuICAgICAgICAgIHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy5lbWFpbFxuXG4gICAgICAgICMgVHJ5IHRvIGxvZyB0aGUgdXNlciBpbnRvIHRoZSB1c2VyJ3MgYWNjb3VudCAoaWYgc3VjY2Vzc2Z1bCB3ZSdsbCBnZXQgYW4gYXV0aCB0b2tlbiBiYWNrKVxuICAgICAgICB0cnlcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCB1c2VyLCBAYm9keVBhcmFtcy5wYXNzd29yZFxuICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgY29uc29sZS5lcnJvciBlXG4gICAgICAgICAgcmV0dXJuIHt9ID1cbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3JcbiAgICAgICAgICAgIGJvZHk6IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogZS5yZWFzb25cblxuICAgICAgICAjIEdldCB0aGUgYXV0aGVudGljYXRlZCB1c2VyXG4gICAgICAgICMgVE9ETzogQ29uc2lkZXIgcmV0dXJuaW5nIHRoZSB1c2VyIGluIEF1dGgubG9naW5XaXRoUGFzc3dvcmQoKSwgaW5zdGVhZCBvZiBmZXRjaGluZyBpdCBhZ2FpbiBoZXJlXG4gICAgICAgIGlmIGF1dGgudXNlcklkIGFuZCBhdXRoLmF1dGhUb2tlblxuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge31cbiAgICAgICAgICBzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aC5hdXRoVG9rZW5cbiAgICAgICAgICBAdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcbiAgICAgICAgICAgIHNlYXJjaFF1ZXJ5XG4gICAgICAgICAgQHVzZXJJZCA9IEB1c2VyPy5faWRcblxuICAgICAgICByZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogYXV0aH1cblxuICAgICAgICAjIENhbGwgdGhlIGxvZ2luIGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXG4gICAgICAgIGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluPy5jYWxsKHRoaXMpXG4gICAgICAgIGlmIGV4dHJhRGF0YT9cbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXG5cbiAgICAgICAgcmVzcG9uc2VcblxuICAgIGxvZ291dCA9IC0+XG4gICAgICAjIFJlbW92ZSB0aGUgZ2l2ZW4gYXV0aCB0b2tlbiBmcm9tIHRoZSB1c2VyJ3MgYWNjb3VudFxuICAgICAgYXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGhUb2tlblxuICAgICAgdG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuXG4gICAgICBpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YgJy4nXG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyAwLCBpbmRleFxuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyBpbmRleCArIDFcbiAgICAgIHRva2VuVG9SZW1vdmUgPSB7fVxuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlblxuICAgICAgdG9rZW5SZW1vdmFsUXVlcnkgPSB7fVxuICAgICAgdG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmVcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUgQHVzZXIuX2lkLCB7JHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5fVxuXG4gICAgICByZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ319XG5cbiAgICAgICMgQ2FsbCB0aGUgbG9nb3V0IGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXG4gICAgICBleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQ/LmNhbGwodGhpcylcbiAgICAgIGlmIGV4dHJhRGF0YT9cbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxuXG4gICAgICByZXNwb25zZVxuXG4gICAgIyMjXG4gICAgICBBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgIyMjXG4gICAgQGFkZFJvdXRlICdsb2dvdXQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSxcbiAgICAgIGdldDogLT5cbiAgICAgICAgY29uc29sZS53YXJuIFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIlxuICAgICAgICBjb25zb2xlLndhcm4gXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCJcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpXG4gICAgICBwb3N0OiBsb2dvdXRcblxuUmVzdGl2dXMgPSBAUmVzdGl2dXNcbiIsInZhciBSZXN0aXZ1cyxcbiAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG50aGlzLlJlc3RpdnVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBSZXN0aXZ1cyhvcHRpb25zKSB7XG4gICAgdmFyIGNvcnNIZWFkZXJzO1xuICAgIHRoaXMuX3JvdXRlcyA9IFtdO1xuICAgIHRoaXMuX2NvbmZpZyA9IHtcbiAgICAgIHBhdGhzOiBbXSxcbiAgICAgIHVzZURlZmF1bHRBdXRoOiBmYWxzZSxcbiAgICAgIGFwaVBhdGg6ICdhcGkvJyxcbiAgICAgIHZlcnNpb246IG51bGwsXG4gICAgICBwcmV0dHlKc29uOiBmYWxzZSxcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgdG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nLFxuICAgICAgICB1c2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3VzZXIsIHRva2VuO1xuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10pIHtcbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QudXNlcklkKSB7XG4gICAgICAgICAgICBfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMucmVxdWVzdC51c2VySWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcjogX3VzZXIsXG4gICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddLFxuICAgICAgICAgICAgICBzcGFjZUlkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddLFxuICAgICAgICAgICAgICBzcGFjZUlkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdEhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGVuYWJsZUNvcnM6IHRydWVcbiAgICB9O1xuICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZywgb3B0aW9ucyk7XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5lbmFibGVDb3JzKSB7XG4gICAgICBjb3JzSGVhZGVycyA9IHtcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCdcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4nO1xuICAgICAgfVxuICAgICAgXy5leHRlbmQodGhpcy5fY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVycyk7XG4gICAgICBpZiAoIXRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50KSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZS53cml0ZUhlYWQoMjAwLCBjb3JzSGVhZGVycyk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLmFwaVBhdGhbMF0gPT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aC5zbGljZSgxKTtcbiAgICB9XG4gICAgaWYgKF8ubGFzdCh0aGlzLl9jb25maWcuYXBpUGF0aCkgIT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aCArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy52ZXJzaW9uKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCArPSB0aGlzLl9jb25maWcudmVyc2lvbiArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbmZpZy51c2VBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgKyAnXFxuICAgIFVzZSB0aGUgdXNlRGVmYXVsdEF1dGggb3B0aW9uIGluc3RlYWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICAgIEFkZCBlbmRwb2ludHMgZm9yIHRoZSBnaXZlbiBIVFRQIG1ldGhvZHMgYXQgdGhlIGdpdmVuIHBhdGhcbiAgXG4gICAgQHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuICAgIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgIEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG4gICAgQHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuICAgICAgICBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG4gICAgICAgIGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLmFkZFJvdXRlID0gZnVuY3Rpb24ocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSB7XG4gICAgdmFyIHJvdXRlO1xuICAgIHJvdXRlID0gbmV3IHNoYXJlLlJvdXRlKHRoaXMsIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cyk7XG4gICAgdGhpcy5fcm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJvdXRlLmFkZFRvQXBpKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgICBHZW5lcmF0ZSByb3V0ZXMgZm9yIHRoZSBNZXRlb3IgQ29sbGVjdGlvbiB3aXRoIHRoZSBnaXZlbiBuYW1lXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5hZGRDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgb3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uRW5kcG9pbnRzLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiwgZW50aXR5Um91dGVFbmRwb2ludHMsIGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2RzLCBtZXRob2RzT25Db2xsZWN0aW9uLCBwYXRoLCByb3V0ZU9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ2dldEFsbCddO1xuICAgIG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ107XG4gICAgaWYgKGNvbGxlY3Rpb24gPT09IE1ldGVvci51c2Vycykge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fY29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9XG4gICAgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgfHwge307XG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgfHwge307XG4gICAgZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIHx8IFtdO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGggfHwgY29sbGVjdGlvbi5fbmFtZTtcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGlmIChfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSAmJiBfLmlzRW1wdHkoZXhjbHVkZWRFbmRwb2ludHMpKSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGNvbmZpZ3VyZWRFbmRwb2ludCwgZW5kcG9pbnRPcHRpb25zO1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2QpIDwgMCAmJiBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBlbmRwb2ludE9wdGlvbnMgPSBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXTtcbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fTtcbiAgICAgICAgICBfLmVhY2goY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIGZ1bmN0aW9uKGFjdGlvbiwgbWV0aG9kVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9IF8uY2hhaW4oYWN0aW9uKS5jbG9uZSgpLmV4dGVuZChlbmRwb2ludE9wdGlvbnMpLnZhbHVlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyk7XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoICsgXCIvOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5fY29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5ib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCh0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXMsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChzZWxlY3RvcikuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBNZXRlb3IudXNlcnMgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQ7XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUodGhpcy51cmxQYXJhbXMuaWQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlcih0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgKHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzO1xuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoe30sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2VycydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX2luaXRBdXRoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxvZ291dCwgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcblxuICAgIC8qXG4gICAgICBBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIHRoZSBvbkxvZ2dlZEluIGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHRoaXMuYWRkUm91dGUoJ2xvZ2luJywge1xuICAgICAgYXV0aFJlcXVpcmVkOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIHBvc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXV0aCwgZSwgZXh0cmFEYXRhLCByZWYsIHJlZjEsIHJlc3BvbnNlLCBzZWFyY2hRdWVyeSwgdXNlcjtcbiAgICAgICAgdXNlciA9IHt9O1xuICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpID09PSAtMSkge1xuICAgICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VybmFtZSkge1xuICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLmVtYWlsKSB7XG4gICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy5lbWFpbDtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKHVzZXIsIHRoaXMuYm9keVBhcmFtcy5wYXNzd29yZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3IsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZS5yZWFzb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdXRoLnVzZXJJZCAmJiBhdXRoLmF1dGhUb2tlbikge1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGguYXV0aFRva2VuKTtcbiAgICAgICAgICB0aGlzLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcbiAgICAgICAgICB9LCBzZWFyY2hRdWVyeSk7XG4gICAgICAgICAgdGhpcy51c2VySWQgPSAocmVmID0gdGhpcy51c2VyKSAhPSBudWxsID8gcmVmLl9pZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICBkYXRhOiBhdXRoXG4gICAgICAgIH07XG4gICAgICAgIGV4dHJhRGF0YSA9IChyZWYxID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkSW4pICE9IG51bGwgPyByZWYxLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXV0aFRva2VuLCBleHRyYURhdGEsIGhhc2hlZFRva2VuLCBpbmRleCwgcmVmLCByZXNwb25zZSwgdG9rZW5GaWVsZE5hbWUsIHRva2VuTG9jYXRpb24sIHRva2VuUGF0aCwgdG9rZW5SZW1vdmFsUXVlcnksIHRva2VuVG9SZW1vdmU7XG4gICAgICBhdXRoVG9rZW4gPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ107XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuO1xuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICB0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKGluZGV4ICsgMSk7XG4gICAgICB0b2tlblRvUmVtb3ZlID0ge307XG4gICAgICB0b2tlblRvUmVtb3ZlW3Rva2VuRmllbGROYW1lXSA9IGhhc2hlZFRva2VuO1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnkgPSB7fTtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlO1xuICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh0aGlzLnVzZXIuX2lkLCB7XG4gICAgICAgICRwdWxsOiB0b2tlblJlbW92YWxRdWVyeVxuICAgICAgfSk7XG4gICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISdcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGV4dHJhRGF0YSA9IChyZWYgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQpICE9IG51bGwgPyByZWYuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgIEFkZCBhIGxvZ291dCBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMuYWRkUm91dGUoJ2xvZ291dCcsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCIpO1xuICAgICAgICBjb25zb2xlLndhcm4oXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCIpO1xuICAgICAgICByZXR1cm4gbG9nb3V0LmNhbGwodGhpcyk7XG4gICAgICB9LFxuICAgICAgcG9zdDogbG9nb3V0XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFJlc3RpdnVzO1xuXG59KSgpO1xuXG5SZXN0aXZ1cyA9IHRoaXMuUmVzdGl2dXM7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICBAQVBJID0gbmV3IFJlc3RpdnVzXG4gICAgICAgIGFwaVBhdGg6ICdzdGVlZG9zL2FwaS8nLFxuICAgICAgICB1c2VEZWZhdWx0QXV0aDogdHJ1ZVxuICAgICAgICBwcmV0dHlKc29uOiB0cnVlXG4gICAgICAgIGVuYWJsZUNvcnM6IGZhbHNlXG4gICAgICAgIGRlZmF1bHRIZWFkZXJzOlxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIHRoaXMuQVBJID0gbmV3IFJlc3RpdnVzKHtcbiAgICBhcGlQYXRoOiAnc3RlZWRvcy9hcGkvJyxcbiAgICB1c2VEZWZhdWx0QXV0aDogdHJ1ZSxcbiAgICBwcmV0dHlKc29uOiB0cnVlLFxuICAgIGVuYWJsZUNvcnM6IGZhbHNlLFxuICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfVxuICB9KTtcbn1cbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdEFQSS5hZGRDb2xsZWN0aW9uIGRiLnNwYWNlX3VzZXJzLCBcblx0XHRleGNsdWRlZEVuZHBvaW50czogW11cblx0XHRyb3V0ZU9wdGlvbnM6XG5cdFx0XHRhdXRoUmVxdWlyZWQ6IHRydWVcblx0XHRcdHNwYWNlUmVxdWlyZWQ6IHRydWUiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFQSS5hZGRDb2xsZWN0aW9uKGRiLnNwYWNlX3VzZXJzLCB7XG4gICAgZXhjbHVkZWRFbmRwb2ludHM6IFtdLFxuICAgIHJvdXRlT3B0aW9uczoge1xuICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgICAgc3BhY2VSZXF1aXJlZDogdHJ1ZVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdEFQSS5hZGRDb2xsZWN0aW9uIGRiLm9yZ2FuaXphdGlvbnMsIFxuXHRcdGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXVxuXHRcdHJvdXRlT3B0aW9uczpcblx0XHRcdGF1dGhSZXF1aXJlZDogdHJ1ZVxuXHRcdFx0c3BhY2VSZXF1aXJlZDogdHJ1ZSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gQVBJLmFkZENvbGxlY3Rpb24oZGIub3JnYW5pemF0aW9ucywge1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzOiBbXSxcbiAgICByb3V0ZU9wdGlvbnM6IHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHNwYWNlUmVxdWlyZWQ6IHRydWVcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJKc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL3B1c2gvbWVzc2FnZVwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgaWYgcmVxLmJvZHk/LnB1c2hUb3BpYyBhbmQgcmVxLmJvZHkudXNlcklkcyBhbmQgcmVxLmJvZHkuZGF0YVxuICAgICAgICBtZXNzYWdlID0gXG4gICAgICAgICAgICBmcm9tOiBcInN0ZWVkb3NcIlxuICAgICAgICAgICAgcXVlcnk6XG4gICAgICAgICAgICAgICAgYXBwTmFtZTogcmVxLmJvZHkucHVzaFRvcGljXG4gICAgICAgICAgICAgICAgdXNlcklkOiBcbiAgICAgICAgICAgICAgICAgICAgXCIkaW5cIjogdXNlcklkc1xuICAgICAgICBpZiByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGU/XG4gICAgICAgICAgICBtZXNzYWdlW1widGl0bGVcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGVcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5hbGVydD9cbiAgICAgICAgICAgIG1lc3NhZ2VbXCJ0ZXh0XCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydFxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLmJhZGdlP1xuICAgICAgICAgICAgbWVzc2FnZVtcImJhZGdlXCJdID0gcmVxLmJvZHkuZGF0YS5iYWRnZSArIFwiXCJcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5zb3VuZD9cbiAgICAgICAgICAgIG1lc3NhZ2VbXCJzb3VuZFwiXSA9IHJlcS5ib2R5LmRhdGEuc291bmRcbiAgICAgICAgI2lmIHJlcS5ib2R5LmRhdGEuZGF0YT9cbiAgICAgICAgIyAgICBtZXNzYWdlW1wiZGF0YVwiXSA9IHJlcS5ib2R5LmRhdGEuZGF0YVxuICAgICAgICBQdXNoLnNlbmQgbWVzc2FnZVxuXG4gICAgICAgIHJlcy5lbmQoXCJzdWNjZXNzXCIpO1xuXG5cblxuTWV0ZW9yLm1ldGhvZHNcbiAgICBwdXNoU2VuZDogKHRleHQsdGl0bGUsYmFkZ2UsdXNlcklkKSAtPlxuICAgICAgICBpZiAoIXVzZXJJZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgUHVzaC5zZW5kXG4gICAgICAgICAgICBmcm9tOiAnc3RlZWRvcycsXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICAgICAgYmFkZ2U6IGJhZGdlLFxuICAgICAgICAgICAgcXVlcnk6IFxuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXG4gICAgICAgICAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4iLCJKc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL3B1c2gvbWVzc2FnZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgbWVzc2FnZSwgcmVmO1xuICBpZiAoKChyZWYgPSByZXEuYm9keSkgIT0gbnVsbCA/IHJlZi5wdXNoVG9waWMgOiB2b2lkIDApICYmIHJlcS5ib2R5LnVzZXJJZHMgJiYgcmVxLmJvZHkuZGF0YSkge1xuICAgIG1lc3NhZ2UgPSB7XG4gICAgICBmcm9tOiBcInN0ZWVkb3NcIixcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIGFwcE5hbWU6IHJlcS5ib2R5LnB1c2hUb3BpYyxcbiAgICAgICAgdXNlcklkOiB7XG4gICAgICAgICAgXCIkaW5cIjogdXNlcklkc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAocmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJ0aXRsZVwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZTtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYWxlcnQgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcInRleHRcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0O1xuICAgIH1cbiAgICBpZiAocmVxLmJvZHkuZGF0YS5iYWRnZSAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1wiYmFkZ2VcIl0gPSByZXEuYm9keS5kYXRhLmJhZGdlICsgXCJcIjtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuc291bmQgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcInNvdW5kXCJdID0gcmVxLmJvZHkuZGF0YS5zb3VuZDtcbiAgICB9XG4gICAgUHVzaC5zZW5kKG1lc3NhZ2UpO1xuICAgIHJldHVybiByZXMuZW5kKFwic3VjY2Vzc1wiKTtcbiAgfVxufSk7XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgcHVzaFNlbmQ6IGZ1bmN0aW9uKHRleHQsIHRpdGxlLCBiYWRnZSwgdXNlcklkKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIFB1c2guc2VuZCh7XG4gICAgICBmcm9tOiAnc3RlZWRvcycsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgYmFkZ2U6IGJhZGdlLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkFsaXl1bl9wdXNoID0ge307XG5cbkFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlID0gKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbiwgY2FsbGJhY2spIC0+XG5cdGlmIG5vdGlmaWNhdGlvbi50aXRsZSBhbmQgbm90aWZpY2F0aW9uLnRleHRcblx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRjb25zb2xlLmxvZyB1c2VyVG9rZW5zXG5cblx0XHRhbGl5dW5Ub2tlbnMgPSBuZXcgQXJyYXlcblx0XHR4aW5nZVRva2VucyA9IG5ldyBBcnJheVxuXHRcdGh1YXdlaVRva2VucyA9IG5ldyBBcnJheVxuXHRcdG1pVG9rZW5zID0gbmV3IEFycmF5XG5cblx0XHR1c2VyVG9rZW5zLmZvckVhY2ggKHVzZXJUb2tlbikgLT5cblx0XHRcdGFyciA9IHVzZXJUb2tlbi5zcGxpdCgnOicpXG5cdFx0XHRpZiBhcnJbMF0gaXMgXCJhbGl5dW5cIlxuXHRcdFx0XHRhbGl5dW5Ub2tlbnMucHVzaCBfLmxhc3QoYXJyKVxuXHRcdFx0ZWxzZSBpZiBhcnJbMF0gaXMgXCJ4aW5nZVwiXG5cdFx0XHRcdHhpbmdlVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcblx0XHRcdGVsc2UgaWYgYXJyWzBdIGlzIFwiaHVhd2VpXCJcblx0XHRcdFx0aHVhd2VpVG9rZW5zLnB1c2ggXy5sYXN0KGFycilcblx0XHRcdGVsc2UgaWYgYXJyWzBdIGlzIFwibWlcIlxuXHRcdFx0XHRtaVRva2Vucy5wdXNoIF8ubGFzdChhcnIpXG5cblx0XHRpZiAhXy5pc0VtcHR5KGFsaXl1blRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5hbGl5dW5cblx0XHRcdEFMWSA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJhbGl5dW5Ub2tlbnM6ICN7YWxpeXVuVG9rZW5zfVwiXG5cdFx0XHRBTFlQVVNIID0gbmV3IChBTFkuUFVTSCkoXG5cdFx0XHRcdGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYWNjZXNzS2V5SWRcblx0XHRcdFx0c2VjcmV0QWNjZXNzS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uc2VjcmV0QWNjZXNzS2V5XG5cdFx0XHRcdGVuZHBvaW50OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uZW5kcG9pbnRcblx0XHRcdFx0YXBpVmVyc2lvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwaVZlcnNpb24pO1xuXG5cdFx0XHRkYXRhID0gXG5cdFx0XHRcdEFwcEtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwcEtleVxuXHRcdFx0XHRUYXJnZXQ6ICdkZXZpY2UnXG5cdFx0XHRcdFRhcmdldFZhbHVlOiBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKVxuXHRcdFx0XHRUaXRsZTogbm90aWZpY2F0aW9uLnRpdGxlXG5cdFx0XHRcdFN1bW1hcnk6IG5vdGlmaWNhdGlvbi50ZXh0XG5cblx0XHRcdEFMWVBVU0gucHVzaE5vdGljZVRvQW5kcm9pZCBkYXRhLCBjYWxsYmFja1xuXG5cdFx0aWYgIV8uaXNFbXB0eSh4aW5nZVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy54aW5nZVxuXHRcdFx0WGluZ2UgPSByZXF1aXJlKCd4aW5nZScpO1xuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcInhpbmdlVG9rZW5zOiAje3hpbmdlVG9rZW5zfVwiXG5cdFx0XHRYaW5nZUFwcCA9IG5ldyBYaW5nZS5YaW5nZUFwcChNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5hY2Nlc3NJZCwgTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2Uuc2VjcmV0S2V5KVxuXHRcdFx0XG5cdFx0XHRhbmRyb2lkTWVzc2FnZSA9IG5ldyBYaW5nZS5BbmRyb2lkTWVzc2FnZVxuXHRcdFx0YW5kcm9pZE1lc3NhZ2UudHlwZSA9IFhpbmdlLk1FU1NBR0VfVFlQRV9OT1RJRklDQVRJT05cblx0XHRcdGFuZHJvaWRNZXNzYWdlLnRpdGxlID0gbm90aWZpY2F0aW9uLnRpdGxlXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS5jb250ZW50ID0gbm90aWZpY2F0aW9uLnRleHRcblx0XHRcdGFuZHJvaWRNZXNzYWdlLnN0eWxlID0gbmV3IFhpbmdlLlN0eWxlXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS5hY3Rpb24gPSBuZXcgWGluZ2UuQ2xpY2tBY3Rpb25cblxuXHRcdFx0Xy5lYWNoIHhpbmdlVG9rZW5zLCAodCktPlxuXHRcdFx0XHRYaW5nZUFwcC5wdXNoVG9TaW5nbGVEZXZpY2UgdCwgYW5kcm9pZE1lc3NhZ2UsIGNhbGxiYWNrXG5cblx0XHRpZiAhXy5pc0VtcHR5KGh1YXdlaVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5odWF3ZWlcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJodWF3ZWlUb2tlbnM6ICN7aHVhd2VpVG9rZW5zfVwiXG5cblx0XHRcdHBhY2thZ2VfbmFtZSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBQa2dOYW1lXG5cdFx0XHR0b2tlbkRhdGFMaXN0ID0gW11cblx0XHRcdF8uZWFjaCBodWF3ZWlUb2tlbnMsICh0KS0+XG5cdFx0XHRcdHRva2VuRGF0YUxpc3QucHVzaCh7J3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSwgJ3Rva2VuJzogdH0pXG5cdFx0XHRub3RpID0geydhbmRyb2lkJzogeyd0aXRsZSc6IG5vdGlmaWNhdGlvbi50aXRsZSwgJ21lc3NhZ2UnOiBub3RpZmljYXRpb24udGV4dH0sICdleHRyYXMnOiBub3RpZmljYXRpb24ucGF5bG9hZH1cblxuXHRcdFx0SHVhd2VpUHVzaC5jb25maWcgW3sncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLCAnY2xpZW50X2lkJzogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcElkLCAnY2xpZW50X3NlY3JldCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBTZWNyZXR9XVxuXHRcdFx0XG5cdFx0XHRIdWF3ZWlQdXNoLnNlbmRNYW55IG5vdGksIHRva2VuRGF0YUxpc3RcblxuXG5cdFx0aWYgIV8uaXNFbXB0eShtaVRva2VucykgYW5kIE1ldGVvci5zZXR0aW5ncy5wdXNoPy5taVxuXHRcdFx0TWlQdXNoID0gcmVxdWlyZSgneGlhb21pLXB1c2gnKTtcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJtaVRva2VuczogI3ttaVRva2Vuc31cIlxuXHRcdFx0bXNnID0gbmV3IE1pUHVzaC5NZXNzYWdlXG5cdFx0XHRtc2cudGl0bGUobm90aWZpY2F0aW9uLnRpdGxlKS5kZXNjcmlwdGlvbihub3RpZmljYXRpb24udGV4dClcblx0XHRcdG5vdGlmaWNhdGlvbiA9IG5ldyBNaVB1c2guTm90aWZpY2F0aW9uKFxuXHRcdFx0XHRwcm9kdWN0aW9uOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5wcm9kdWN0aW9uXG5cdFx0XHRcdGFwcFNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkuYXBwU2VjcmV0XG5cdFx0XHQpXG5cdFx0XHRfLmVhY2ggbWlUb2tlbnMsIChyZWdpZCktPlxuXHRcdFx0XHRub3RpZmljYXRpb24uc2VuZCByZWdpZCwgbXNnLCBjYWxsYmFja1xuXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdFxuXHRpZiBub3QgTWV0ZW9yLnNldHRpbmdzLmNyb24/LnB1c2hfaW50ZXJ2YWxcblx0XHRyZXR1cm5cblxuXHRjb25maWcgPSB7XG5cdFx0ZGVidWc6IHRydWVcblx0XHRrZWVwTm90aWZpY2F0aW9uczogZmFsc2Vcblx0XHRzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5jcm9uLnB1c2hfaW50ZXJ2YWxcblx0XHRzZW5kQmF0Y2hTaXplOiAxMFxuXHRcdHByb2R1Y3Rpb246IHRydWVcblx0fVxuXG5cdGlmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFwbikgJiYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYXBuLmtleURhdGEpICYmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFwbi5jZXJ0RGF0YSlcblx0XHRjb25maWcuYXBuID0ge1xuXHRcdFx0a2V5RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmtleURhdGFcblx0XHRcdGNlcnREYXRhOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hcG4uY2VydERhdGFcblx0XHR9XG5cdGlmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmdjbSkgJiYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uZ2NtLnByb2plY3ROdW1iZXIpICYmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmdjbS5hcGlLZXkpXG5cdFx0Y29uZmlnLmdjbSA9IHtcblx0XHRcdHByb2plY3ROdW1iZXI6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5wcm9qZWN0TnVtYmVyXG5cdFx0XHRhcGlLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5hcGlLZXlcblx0XHR9XG5cblx0UHVzaC5Db25maWd1cmUgY29uZmlnXG5cdFxuXHRpZiAoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFsaXl1biBvciBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ueGluZ2Ugb3IgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lmh1YXdlaSBvciBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ubWkpIGFuZCBQdXNoIGFuZCB0eXBlb2YgUHVzaC5zZW5kR0NNID09ICdmdW5jdGlvbidcblx0XHRcblx0XHRQdXNoLm9sZF9zZW5kR0NNID0gUHVzaC5zZW5kR0NNO1xuXG5cdFx0UHVzaC5zZW5kQWxpeXVuID0gKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikgLT5cblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb25cblxuXHRcdFx0aWYgTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpXG5cdFx0XHRcdG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pXG5cdFx0XHQjIE1ha2Ugc3VyZSB1c2VyVG9rZW5zIGFyZSBhbiBhcnJheSBvZiBzdHJpbmdzXG5cdFx0XHRpZiB1c2VyVG9rZW5zID09ICcnICsgdXNlclRva2Vuc1xuXHRcdFx0XHR1c2VyVG9rZW5zID0gWyB1c2VyVG9rZW5zIF1cblx0XHRcdCMgQ2hlY2sgaWYgYW55IHRva2VucyBpbiB0aGVyZSB0byBzZW5kXG5cdFx0XHRpZiAhdXNlclRva2Vucy5sZW5ndGhcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvblxuXG5cdFx0XHRGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpXG5cdCAgXG5cdFx0XHR1c2VyVG9rZW4gPSBpZiB1c2VyVG9rZW5zLmxlbmd0aCA9PSAxIHRoZW4gdXNlclRva2Vuc1swXSBlbHNlIG51bGxcblx0XHRcdEFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbiwgKGVyciwgcmVzdWx0KSAtPlxuXHRcdFx0XHRpZiBlcnJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyAnQU5EUk9JRCBFUlJPUjogcmVzdWx0IG9mIHNlbmRlcjogJyArIHJlc3VsdFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aWYgcmVzdWx0ID09IG51bGxcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nICdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyIGlzIG51bGwnXG5cdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyAnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlcjogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdClcblxuXHRcdFx0XHRcdGlmIHJlc3VsdC5jYW5vbmljYWxfaWRzID09IDEgYW5kIHVzZXJUb2tlblxuXHRcdFx0XHRcdFx0RmliZXIoKHNlbGYpIC0+XG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHNlbGYuY2FsbGJhY2sgc2VsZi5vbGRUb2tlbiwgc2VsZi5uZXdUb2tlblxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJcblx0XHRcdFx0XHRcdCkucnVuXG5cdFx0XHRcdFx0XHRcdG9sZFRva2VuOiBnY206IHVzZXJUb2tlblxuXHRcdFx0XHRcdFx0XHRuZXdUb2tlbjogZ2NtOiBcImFsaXl1bjpcIiArIHJlc3VsdC5yZXN1bHRzWzBdLnJlZ2lzdHJhdGlvbl9pZFxuXHRcdFx0XHRcdFx0XHRjYWxsYmFjazogX3JlcGxhY2VUb2tlblxuXHRcdFx0XHRcdGlmIHJlc3VsdC5mYWlsdXJlICE9IDAgYW5kIHVzZXJUb2tlblxuXHRcdFx0XHRcdFx0RmliZXIoKHNlbGYpIC0+XG5cdFx0XHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0XHRcdHNlbGYuY2FsbGJhY2sgc2VsZi50b2tlblxuXHRcdFx0XHRcdFx0XHRjYXRjaCBlcnJcblx0XHRcdFx0XHRcdCkucnVuXG5cdFx0XHRcdFx0XHRcdHRva2VuOiBnY206IHVzZXJUb2tlblxuXHRcdFx0XHRcdFx0XHRjYWxsYmFjazogX3JlbW92ZVRva2VuXG5cblxuXG5cdFx0UHVzaC5zZW5kR0NNID0gKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikgLT5cblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00gZnJvbSBhbGl5dW4tPiBQdXNoLnNlbmRHQ00nXG5cdFx0XHRpZiBNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdClcblx0XHRcdFx0bm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSlcblx0XHRcdCMgTWFrZSBzdXJlIHVzZXJUb2tlbnMgYXJlIGFuIGFycmF5IG9mIHN0cmluZ3Ncblx0XHRcdGlmIHVzZXJUb2tlbnMgPT0gJycgKyB1c2VyVG9rZW5zXG5cdFx0XHRcdHVzZXJUb2tlbnMgPSBbIHVzZXJUb2tlbnMgXVxuXHRcdFx0IyBDaGVjayBpZiBhbnkgdG9rZW5zIGluIHRoZXJlIHRvIHNlbmRcblx0XHRcdGlmICF1c2VyVG9rZW5zLmxlbmd0aFxuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCdcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBQdXNoLmRlYnVnXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uXG5cblx0XHRcdGFsaXl1blRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKChpdGVtKSAtPlxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uaW5kZXhPZignYWxpeXVuOicpID4gLTEgb3IgaXRlbS5pbmRleE9mKCd4aW5nZTonKSA+IC0xIG9yIGl0ZW0uaW5kZXhPZignaHVhd2VpOicpID4gLTEgb3IgaXRlbS5pbmRleE9mKCdtaTonKSA+IC0xXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdGlmIFB1c2guZGVidWdcblx0XHRcdFx0Y29uc29sZS5sb2cgJ2FsaXl1blRva2VucyBpcyAnLCBhbGl5dW5Ub2tlbnMudG9TdHJpbmcoKVxuXG5cdFx0XHRnY21Ub2tlbnMgPSB1c2VyVG9rZW5zLmZpbHRlcigoaXRlbSkgLT5cblx0XHRcdFx0XHRcdFx0XHRpdGVtLmluZGV4T2YoXCJhbGl5dW46XCIpIDwgMCBhbmQgaXRlbS5pbmRleE9mKFwieGluZ2U6XCIpIDwgMCBhbmQgaXRlbS5pbmRleE9mKFwiaHVhd2VpOlwiKSA8IDAgYW5kIGl0ZW0uaW5kZXhPZihcIm1pOlwiKSA8IDBcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnZ2NtVG9rZW5zIGlzICcgLCBnY21Ub2tlbnMudG9TdHJpbmcoKTtcblxuXHRcdFx0UHVzaC5zZW5kQWxpeXVuKGFsaXl1blRva2Vucywgbm90aWZpY2F0aW9uKTtcblxuXHRcdFx0UHVzaC5vbGRfc2VuZEdDTShnY21Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG5cblx0XHRQdXNoLm9sZF9zZW5kQVBOID0gUHVzaC5zZW5kQVBOXG5cdFx0UHVzaC5zZW5kQVBOID0gKHVzZXJUb2tlbiwgbm90aWZpY2F0aW9uKSAtPlxuXHRcdFx0dHJ5XG5cdFx0XHRcdGlmIG5vdGlmaWNhdGlvbi50aXRsZSBhbmQgbm90aWZpY2F0aW9uLnRleHRcblx0XHRcdFx0XHRub3RpID0gXy5jbG9uZShub3RpZmljYXRpb24pXG5cdFx0XHRcdFx0bm90aS50ZXh0ID0gbm90aS50aXRsZSArIFwiIFwiICsgbm90aS50ZXh0XG5cdFx0XHRcdFx0bm90aS50aXRsZSA9IFwiXCJcblx0XHRcdFx0XHRQdXNoLm9sZF9zZW5kQVBOKHVzZXJUb2tlbiwgbm90aSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpZmljYXRpb24pXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSlcbiIsInZhciBBbGl5dW5fcHVzaDtcblxuQWxpeXVuX3B1c2ggPSB7fTtcblxuQWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbih1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIGNhbGxiYWNrKSB7XG4gIHZhciBBTFksIEFMWVBVU0gsIE1pUHVzaCwgWGluZ2UsIFhpbmdlQXBwLCBhbGl5dW5Ub2tlbnMsIGFuZHJvaWRNZXNzYWdlLCBkYXRhLCBodWF3ZWlUb2tlbnMsIG1pVG9rZW5zLCBtc2csIG5vdGksIHBhY2thZ2VfbmFtZSwgcmVmLCByZWYxLCByZWYyLCByZWYzLCB0b2tlbkRhdGFMaXN0LCB4aW5nZVRva2VucztcbiAgaWYgKG5vdGlmaWNhdGlvbi50aXRsZSAmJiBub3RpZmljYXRpb24udGV4dCkge1xuICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZyh1c2VyVG9rZW5zKTtcbiAgICB9XG4gICAgYWxpeXVuVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIHhpbmdlVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIGh1YXdlaVRva2VucyA9IG5ldyBBcnJheTtcbiAgICBtaVRva2VucyA9IG5ldyBBcnJheTtcbiAgICB1c2VyVG9rZW5zLmZvckVhY2goZnVuY3Rpb24odXNlclRva2VuKSB7XG4gICAgICB2YXIgYXJyO1xuICAgICAgYXJyID0gdXNlclRva2VuLnNwbGl0KCc6Jyk7XG4gICAgICBpZiAoYXJyWzBdID09PSBcImFsaXl1blwiKSB7XG4gICAgICAgIHJldHVybiBhbGl5dW5Ub2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9IGVsc2UgaWYgKGFyclswXSA9PT0gXCJ4aW5nZVwiKSB7XG4gICAgICAgIHJldHVybiB4aW5nZVRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyWzBdID09PSBcImh1YXdlaVwiKSB7XG4gICAgICAgIHJldHVybiBodWF3ZWlUb2tlbnMucHVzaChfLmxhc3QoYXJyKSk7XG4gICAgICB9IGVsc2UgaWYgKGFyclswXSA9PT0gXCJtaVwiKSB7XG4gICAgICAgIHJldHVybiBtaVRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIV8uaXNFbXB0eShhbGl5dW5Ub2tlbnMpICYmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYuYWxpeXVuIDogdm9pZCAwKSkge1xuICAgICAgQUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJhbGl5dW5Ub2tlbnM6IFwiICsgYWxpeXVuVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIEFMWVBVU0ggPSBuZXcgQUxZLlBVU0goe1xuICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFjY2Vzc0tleUlkLFxuICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5zZWNyZXRBY2Nlc3NLZXksXG4gICAgICAgIGVuZHBvaW50OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uZW5kcG9pbnQsXG4gICAgICAgIGFwaVZlcnNpb246IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5hcGlWZXJzaW9uXG4gICAgICB9KTtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIEFwcEtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwcEtleSxcbiAgICAgICAgVGFyZ2V0OiAnZGV2aWNlJyxcbiAgICAgICAgVGFyZ2V0VmFsdWU6IGFsaXl1blRva2Vucy50b1N0cmluZygpLFxuICAgICAgICBUaXRsZTogbm90aWZpY2F0aW9uLnRpdGxlLFxuICAgICAgICBTdW1tYXJ5OiBub3RpZmljYXRpb24udGV4dFxuICAgICAgfTtcbiAgICAgIEFMWVBVU0gucHVzaE5vdGljZVRvQW5kcm9pZChkYXRhLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIGlmICghXy5pc0VtcHR5KHhpbmdlVG9rZW5zKSAmJiAoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjEueGluZ2UgOiB2b2lkIDApKSB7XG4gICAgICBYaW5nZSA9IHJlcXVpcmUoJ3hpbmdlJyk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcInhpbmdlVG9rZW5zOiBcIiArIHhpbmdlVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIFhpbmdlQXBwID0gbmV3IFhpbmdlLlhpbmdlQXBwKE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLmFjY2Vzc0lkLCBNZXRlb3Iuc2V0dGluZ3MucHVzaC54aW5nZS5zZWNyZXRLZXkpO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UgPSBuZXcgWGluZ2UuQW5kcm9pZE1lc3NhZ2U7XG4gICAgICBhbmRyb2lkTWVzc2FnZS50eXBlID0gWGluZ2UuTUVTU0FHRV9UWVBFX05PVElGSUNBVElPTjtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLnRpdGxlID0gbm90aWZpY2F0aW9uLnRpdGxlO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UuY29udGVudCA9IG5vdGlmaWNhdGlvbi50ZXh0O1xuICAgICAgYW5kcm9pZE1lc3NhZ2Uuc3R5bGUgPSBuZXcgWGluZ2UuU3R5bGU7XG4gICAgICBhbmRyb2lkTWVzc2FnZS5hY3Rpb24gPSBuZXcgWGluZ2UuQ2xpY2tBY3Rpb247XG4gICAgICBfLmVhY2goeGluZ2VUb2tlbnMsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIFhpbmdlQXBwLnB1c2hUb1NpbmdsZURldmljZSh0LCBhbmRyb2lkTWVzc2FnZSwgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICghXy5pc0VtcHR5KGh1YXdlaVRva2VucykgJiYgKChyZWYyID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYyLmh1YXdlaSA6IHZvaWQgMCkpIHtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaHVhd2VpVG9rZW5zOiBcIiArIGh1YXdlaVRva2Vucyk7XG4gICAgICB9XG4gICAgICBwYWNrYWdlX25hbWUgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwUGtnTmFtZTtcbiAgICAgIHRva2VuRGF0YUxpc3QgPSBbXTtcbiAgICAgIF8uZWFjaChodWF3ZWlUb2tlbnMsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHRva2VuRGF0YUxpc3QucHVzaCh7XG4gICAgICAgICAgJ3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSxcbiAgICAgICAgICAndG9rZW4nOiB0XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBub3RpID0ge1xuICAgICAgICAnYW5kcm9pZCc6IHtcbiAgICAgICAgICAndGl0bGUnOiBub3RpZmljYXRpb24udGl0bGUsXG4gICAgICAgICAgJ21lc3NhZ2UnOiBub3RpZmljYXRpb24udGV4dFxuICAgICAgICB9LFxuICAgICAgICAnZXh0cmFzJzogbm90aWZpY2F0aW9uLnBheWxvYWRcbiAgICAgIH07XG4gICAgICBIdWF3ZWlQdXNoLmNvbmZpZyhbXG4gICAgICAgIHtcbiAgICAgICAgICAncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLFxuICAgICAgICAgICdjbGllbnRfaWQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwSWQsXG4gICAgICAgICAgJ2NsaWVudF9zZWNyZXQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwU2VjcmV0XG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgICAgSHVhd2VpUHVzaC5zZW5kTWFueShub3RpLCB0b2tlbkRhdGFMaXN0KTtcbiAgICB9XG4gICAgaWYgKCFfLmlzRW1wdHkobWlUb2tlbnMpICYmICgocmVmMyA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMy5taSA6IHZvaWQgMCkpIHtcbiAgICAgIE1pUHVzaCA9IHJlcXVpcmUoJ3hpYW9taS1wdXNoJyk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIm1pVG9rZW5zOiBcIiArIG1pVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIG1zZyA9IG5ldyBNaVB1c2guTWVzc2FnZTtcbiAgICAgIG1zZy50aXRsZShub3RpZmljYXRpb24udGl0bGUpLmRlc2NyaXB0aW9uKG5vdGlmaWNhdGlvbi50ZXh0KTtcbiAgICAgIG5vdGlmaWNhdGlvbiA9IG5ldyBNaVB1c2guTm90aWZpY2F0aW9uKHtcbiAgICAgICAgcHJvZHVjdGlvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkucHJvZHVjdGlvbixcbiAgICAgICAgYXBwU2VjcmV0OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5taS5hcHBTZWNyZXRcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChtaVRva2VucywgZnVuY3Rpb24ocmVnaWQpIHtcbiAgICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5zZW5kKHJlZ2lkLCBtc2csIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciBjb25maWcsIHJlZiwgcmVmMSwgcmVmMTAsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjgsIHJlZjk7XG4gIGlmICghKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MuY3JvbikgIT0gbnVsbCA/IHJlZi5wdXNoX2ludGVydmFsIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25maWcgPSB7XG4gICAgZGVidWc6IHRydWUsXG4gICAga2VlcE5vdGlmaWNhdGlvbnM6IGZhbHNlLFxuICAgIHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLmNyb24ucHVzaF9pbnRlcnZhbCxcbiAgICBzZW5kQmF0Y2hTaXplOiAxMCxcbiAgICBwcm9kdWN0aW9uOiB0cnVlXG4gIH07XG4gIGlmICghXy5pc0VtcHR5KChyZWYxID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYxLmFwbiA6IHZvaWQgMCkgJiYgIV8uaXNFbXB0eSgocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMi5hcG4ua2V5RGF0YSA6IHZvaWQgMCkgJiYgIV8uaXNFbXB0eSgocmVmMyA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMy5hcG4uY2VydERhdGEgOiB2b2lkIDApKSB7XG4gICAgY29uZmlnLmFwbiA9IHtcbiAgICAgIGtleURhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5rZXlEYXRhLFxuICAgICAgY2VydERhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5jZXJ0RGF0YVxuICAgIH07XG4gIH1cbiAgaWYgKCFfLmlzRW1wdHkoKHJlZjQgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjQuZ2NtIDogdm9pZCAwKSAmJiAhXy5pc0VtcHR5KChyZWY1ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY1LmdjbS5wcm9qZWN0TnVtYmVyIDogdm9pZCAwKSAmJiAhXy5pc0VtcHR5KChyZWY2ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY2LmdjbS5hcGlLZXkgOiB2b2lkIDApKSB7XG4gICAgY29uZmlnLmdjbSA9IHtcbiAgICAgIHByb2plY3ROdW1iZXI6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5wcm9qZWN0TnVtYmVyLFxuICAgICAgYXBpS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20uYXBpS2V5XG4gICAgfTtcbiAgfVxuICBQdXNoLkNvbmZpZ3VyZShjb25maWcpO1xuICBpZiAoKCgocmVmNyA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmNy5hbGl5dW4gOiB2b2lkIDApIHx8ICgocmVmOCA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmOC54aW5nZSA6IHZvaWQgMCkgfHwgKChyZWY5ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY5Lmh1YXdlaSA6IHZvaWQgMCkgfHwgKChyZWYxMCA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMTAubWkgOiB2b2lkIDApKSAmJiBQdXNoICYmIHR5cGVvZiBQdXNoLnNlbmRHQ00gPT09ICdmdW5jdGlvbicpIHtcbiAgICBQdXNoLm9sZF9zZW5kR0NNID0gUHVzaC5zZW5kR0NNO1xuICAgIFB1c2guc2VuZEFsaXl1biA9IGZ1bmN0aW9uKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIEZpYmVyLCB1c2VyVG9rZW47XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgICBpZiAoTWF0Y2gudGVzdChub3RpZmljYXRpb24uZ2NtLCBPYmplY3QpKSB7XG4gICAgICAgIG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pO1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJUb2tlbnMgPT09ICcnICsgdXNlclRva2Vucykge1xuICAgICAgICB1c2VyVG9rZW5zID0gW3VzZXJUb2tlbnNdO1xuICAgICAgfVxuICAgICAgaWYgKCF1c2VyVG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG4gICAgICBGaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuICAgICAgdXNlclRva2VuID0gdXNlclRva2Vucy5sZW5ndGggPT09IDEgPyB1c2VyVG9rZW5zWzBdIDogbnVsbDtcbiAgICAgIHJldHVybiBBbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5sb2coJ0FORFJPSUQgRVJST1I6IHJlc3VsdCBvZiBzZW5kZXI6ICcgKyByZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyIGlzIG51bGwnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlcjogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0LmNhbm9uaWNhbF9pZHMgPT09IDEgJiYgdXNlclRva2VuKSB7XG4gICAgICAgICAgICBGaWJlcihmdW5jdGlvbihzZWxmKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soc2VsZi5vbGRUb2tlbiwgc2VsZi5uZXdUb2tlbik7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnJ1bih7XG4gICAgICAgICAgICAgIG9sZFRva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiB1c2VyVG9rZW5cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmV3VG9rZW46IHtcbiAgICAgICAgICAgICAgICBnY206IFwiYWxpeXVuOlwiICsgcmVzdWx0LnJlc3VsdHNbMF0ucmVnaXN0cmF0aW9uX2lkXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhbGxiYWNrOiBfcmVwbGFjZVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdC5mYWlsdXJlICE9PSAwICYmIHVzZXJUb2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKHNlbGYpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhzZWxmLnRva2VuKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkucnVuKHtcbiAgICAgICAgICAgICAgdG9rZW46IHtcbiAgICAgICAgICAgICAgICBnY206IHVzZXJUb2tlblxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWxsYmFjazogX3JlbW92ZVRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gICAgUHVzaC5zZW5kR0NNID0gZnVuY3Rpb24odXNlclRva2Vucywgbm90aWZpY2F0aW9uKSB7XG4gICAgICB2YXIgYWxpeXVuVG9rZW5zLCBnY21Ub2tlbnM7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTSBmcm9tIGFsaXl1bi0+IFB1c2guc2VuZEdDTScpO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KSkge1xuICAgICAgICBub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKTtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyVG9rZW5zID09PSAnJyArIHVzZXJUb2tlbnMpIHtcbiAgICAgICAgdXNlclRva2VucyA9IFt1c2VyVG9rZW5zXTtcbiAgICAgIH1cbiAgICAgIGlmICghdXNlclRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgYWxpeXVuVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5pbmRleE9mKCdhbGl5dW46JykgPiAtMSB8fCBpdGVtLmluZGV4T2YoJ3hpbmdlOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCdodWF3ZWk6JykgPiAtMSB8fCBpdGVtLmluZGV4T2YoJ21pOicpID4gLTE7XG4gICAgICB9KTtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhbGl5dW5Ub2tlbnMgaXMgJywgYWxpeXVuVG9rZW5zLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAgZ2NtVG9rZW5zID0gdXNlclRva2Vucy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5pbmRleE9mKFwiYWxpeXVuOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwieGluZ2U6XCIpIDwgMCAmJiBpdGVtLmluZGV4T2YoXCJodWF3ZWk6XCIpIDwgMCAmJiBpdGVtLmluZGV4T2YoXCJtaTpcIikgPCAwO1xuICAgICAgfSk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2NtVG9rZW5zIGlzICcsIGdjbVRva2Vucy50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICAgIFB1c2guc2VuZEFsaXl1bihhbGl5dW5Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEdDTShnY21Ub2tlbnMsIG5vdGlmaWNhdGlvbik7XG4gICAgfTtcbiAgICBQdXNoLm9sZF9zZW5kQVBOID0gUHVzaC5zZW5kQVBOO1xuICAgIHJldHVybiBQdXNoLnNlbmRBUE4gPSBmdW5jdGlvbih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIGUsIG5vdGk7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAobm90aWZpY2F0aW9uLnRpdGxlICYmIG5vdGlmaWNhdGlvbi50ZXh0KSB7XG4gICAgICAgICAgbm90aSA9IF8uY2xvbmUobm90aWZpY2F0aW9uKTtcbiAgICAgICAgICBub3RpLnRleHQgPSBub3RpLnRpdGxlICsgXCIgXCIgKyBub3RpLnRleHQ7XG4gICAgICAgICAgbm90aS50aXRsZSA9IFwiXCI7XG4gICAgICAgICAgcmV0dXJuIFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iXX0=
