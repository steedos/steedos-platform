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
var ServerSession = Package['steedos:base'].ServerSession;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
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
  'aliyun-sdk': '^1.9.2',
  busboy: "^0.2.13",
  cookies: "^0.6.2",
  'csv': "^1.1.0",
  'url': '^0.11.0',
  'request': '^2.81.0',
  'xinge': '^1.1.3',
  'huawei-push': '^0.0.6-0',
  'xiaomi-push': '^0.4.5'
}, 'steedos:api');
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

},"routes":{"s3.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/routes/s3.coffee                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Busboy, Fiber;
Busboy = require('busboy');
Fiber = require('fibers');

JsonRoutes.parseFiles = function (req, res, next) {
  var busboy, files, image;
  files = [];
  image = {};

  if (req.method === "POST") {
    busboy = new Busboy({
      headers: req.headers
    });
    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      var buffers;
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

JsonRoutes.add("post", "/api/v4/instances/s3/", function (req, res, next) {
  return JsonRoutes.parseFiles(req, res, function () {
    var collection, newFile;
    collection = cfs.instances;

    if (req.files && req.files[0]) {
      newFile = new FS.File();
      return newFile.attachData(req.files[0].data, {
        type: req.files[0].mimeType
      }, function (err) {
        var body, e, fileObj, filename, metadata, parent, r, resp, size;
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

        size = fileObj.original.size;

        if (!size) {
          size = 1024;
        }

        resp = {
          version_id: fileObj._id,
          size: size
        };
        res.setHeader("x-amz-version-id", fileObj._id);
        res.end(JSON.stringify(resp));
      });
    } else {
      res.statusCode = 500;
      return res.end();
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

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:api/checkNpm.js");
require("/node_modules/meteor/steedos:api/lib/restivus/auth.coffee");
require("/node_modules/meteor/steedos:api/lib/restivus/iron-router-error-to-response.js");
require("/node_modules/meteor/steedos:api/lib/restivus/route.coffee");
require("/node_modules/meteor/steedos:api/lib/restivus/restivus.coffee");
require("/node_modules/meteor/steedos:api/core.coffee");
require("/node_modules/meteor/steedos:api/routes/s3.coffee");
require("/node_modules/meteor/steedos:api/routes/push.coffee");

/* Exports */
Package._define("steedos:api");

})();

//# sourceURL=meteor://💻app/packages/steedos_api.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3Jlc3RpdnVzL2F1dGguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmFwaS9saWIvcmVzdGl2dXMvaXJvbi1yb3V0ZXItZXJyb3ItdG8tcmVzcG9uc2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2xpYi9yZXN0aXZ1cy9yb3V0ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9yb3V0ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2xpYi9yZXN0aXZ1cy9yZXN0aXZ1cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9yZXN0aXZ1cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvcHVzaC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYnVzYm95IiwiY29va2llcyIsImdldFVzZXJRdWVyeVNlbGVjdG9yIiwidXNlclZhbGlkYXRvciIsIkF1dGgiLCJNYXRjaCIsIldoZXJlIiwidXNlciIsImNoZWNrIiwiaWQiLCJPcHRpb25hbCIsIlN0cmluZyIsInVzZXJuYW1lIiwiZW1haWwiLCJfIiwia2V5cyIsImxlbmd0aCIsIkVycm9yIiwibG9naW5XaXRoUGFzc3dvcmQiLCJwYXNzd29yZCIsImF1dGhUb2tlbiIsImF1dGhlbnRpY2F0aW5nVXNlciIsImF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yIiwiaGFzaGVkVG9rZW4iLCJwYXNzd29yZFZlcmlmaWNhdGlvbiIsInJlZiIsInNwYWNlX3VzZXJzIiwic3BhY2VzIiwiTWV0ZW9yIiwidXNlcnMiLCJmaW5kT25lIiwic2VydmljZXMiLCJBY2NvdW50cyIsIl9jaGVja1Bhc3N3b3JkIiwiZXJyb3IiLCJfZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbiIsIl9oYXNoU3RhbXBlZFRva2VuIiwiX2luc2VydEhhc2hlZExvZ2luVG9rZW4iLCJfaWQiLCJkYiIsImZpbmQiLCJmZXRjaCIsImVhY2giLCJzdSIsInNwYWNlIiwiaXNfcGFpZCIsImluZGV4T2YiLCJhZG1pbnMiLCJwdXNoIiwibmFtZSIsInRva2VuIiwidXNlcklkIiwiYWRtaW5TcGFjZXMiLCJlbnYiLCJwcm9jZXNzIiwiTk9ERV9FTlYiLCJpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSIsImVyciIsInJlcSIsInJlcyIsInN0YXR1c0NvZGUiLCJzdGF0dXMiLCJtc2ciLCJzdGFjayIsInRvU3RyaW5nIiwiY29uc29sZSIsImhlYWRlcnNTZW50Iiwic29ja2V0IiwiZGVzdHJveSIsInNldEhlYWRlciIsIkJ1ZmZlciIsImJ5dGVMZW5ndGgiLCJtZXRob2QiLCJlbmQiLCJzaGFyZSIsIlJvdXRlIiwiYXBpIiwicGF0aCIsIm9wdGlvbnMiLCJlbmRwb2ludHMxIiwiZW5kcG9pbnRzIiwicHJvdG90eXBlIiwiYWRkVG9BcGkiLCJhdmFpbGFibGVNZXRob2RzIiwiYWxsb3dlZE1ldGhvZHMiLCJmdWxsUGF0aCIsInJlamVjdGVkTWV0aG9kcyIsInNlbGYiLCJjb250YWlucyIsIl9jb25maWciLCJwYXRocyIsImV4dGVuZCIsImRlZmF1bHRPcHRpb25zRW5kcG9pbnQiLCJfcmVzb2x2ZUVuZHBvaW50cyIsIl9jb25maWd1cmVFbmRwb2ludHMiLCJmaWx0ZXIiLCJyZWplY3QiLCJhcGlQYXRoIiwiZW5kcG9pbnQiLCJKc29uUm91dGVzIiwiYWRkIiwiZG9uZUZ1bmMiLCJlbmRwb2ludENvbnRleHQiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZUluaXRpYXRlZCIsInVybFBhcmFtcyIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwicXVlcnkiLCJib2R5UGFyYW1zIiwiYm9keSIsInJlcXVlc3QiLCJyZXNwb25zZSIsImRvbmUiLCJfY2FsbEVuZHBvaW50IiwiZXJyb3IxIiwiaGVhZGVycyIsIl9yZXNwb25kIiwibWVzc2FnZSIsImpvaW4iLCJ0b1VwcGVyQ2FzZSIsImlzRnVuY3Rpb24iLCJhY3Rpb24iLCJyZWYxIiwicmVmMiIsInJvbGVSZXF1aXJlZCIsInVuaW9uIiwiaXNFbXB0eSIsImF1dGhSZXF1aXJlZCIsInNwYWNlUmVxdWlyZWQiLCJpbnZvY2F0aW9uIiwiX2F1dGhBY2NlcHRlZCIsIl9yb2xlQWNjZXB0ZWQiLCJfc3BhY2VBY2NlcHRlZCIsIkREUENvbW1vbiIsIk1ldGhvZEludm9jYXRpb24iLCJpc1NpbXVsYXRpb24iLCJjb25uZWN0aW9uIiwicmFuZG9tU2VlZCIsIm1ha2VScGNTZWVkIiwiRERQIiwiX0N1cnJlbnRJbnZvY2F0aW9uIiwid2l0aFZhbHVlIiwiY2FsbCIsIl9hdXRoZW50aWNhdGUiLCJhdXRoIiwidXNlclNlbGVjdG9yIiwic3BhY2VfdXNlcnNfY291bnQiLCJzcGFjZUlkIiwiY291bnQiLCJpbnRlcnNlY3Rpb24iLCJyb2xlcyIsImRlZmF1bHRIZWFkZXJzIiwiZGVsYXlJbk1pbGxpc2Vjb25kcyIsIm1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzIiwicmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28iLCJzZW5kUmVzcG9uc2UiLCJfbG93ZXJDYXNlS2V5cyIsIm1hdGNoIiwicHJldHR5SnNvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3cml0ZUhlYWQiLCJ3cml0ZSIsIk1hdGgiLCJyYW5kb20iLCJzZXRUaW1lb3V0Iiwib2JqZWN0IiwiY2hhaW4iLCJwYWlycyIsIm1hcCIsImF0dHIiLCJ0b0xvd2VyQ2FzZSIsInZhbHVlIiwiUmVzdGl2dXMiLCJpdGVtIiwiaSIsImwiLCJjb3JzSGVhZGVycyIsIl9yb3V0ZXMiLCJ1c2VEZWZhdWx0QXV0aCIsInZlcnNpb24iLCJfdXNlciIsIl9oYXNoTG9naW5Ub2tlbiIsImVuYWJsZUNvcnMiLCJzbGljZSIsImxhc3QiLCJfaW5pdEF1dGgiLCJ1c2VBdXRoIiwid2FybiIsImFkZFJvdXRlIiwicm91dGUiLCJhZGRDb2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsImNvbGxlY3Rpb25FbmRwb2ludHMiLCJjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMiLCJlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24iLCJlbnRpdHlSb3V0ZUVuZHBvaW50cyIsImV4Y2x1ZGVkRW5kcG9pbnRzIiwibWV0aG9kcyIsIm1ldGhvZHNPbkNvbGxlY3Rpb24iLCJyb3V0ZU9wdGlvbnMiLCJfdXNlckNvbGxlY3Rpb25FbmRwb2ludHMiLCJfY29sbGVjdGlvbkVuZHBvaW50cyIsIl9uYW1lIiwiY29uZmlndXJlZEVuZHBvaW50IiwiZW5kcG9pbnRPcHRpb25zIiwibWV0aG9kVHlwZSIsImNsb25lIiwiZ2V0IiwiZW50aXR5Iiwic2VsZWN0b3IiLCJkYXRhIiwicHV0IiwiZW50aXR5SXNVcGRhdGVkIiwidXBkYXRlIiwiJHNldCIsInJlbW92ZSIsInBvc3QiLCJlbnRpdHlJZCIsImluc2VydCIsImdldEFsbCIsImVudGl0aWVzIiwiZmllbGRzIiwicHJvZmlsZSIsImNyZWF0ZVVzZXIiLCJsb2dvdXQiLCJlIiwiZXh0cmFEYXRhIiwic2VhcmNoUXVlcnkiLCJyZWFzb24iLCJvbkxvZ2dlZEluIiwiZXh0cmEiLCJpbmRleCIsInRva2VuRmllbGROYW1lIiwidG9rZW5Mb2NhdGlvbiIsInRva2VuUGF0aCIsInRva2VuUmVtb3ZhbFF1ZXJ5IiwidG9rZW5Ub1JlbW92ZSIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwiJHB1bGwiLCJvbkxvZ2dlZE91dCIsImlzU2VydmVyIiwiQVBJIiwiQnVzYm95IiwiRmliZXIiLCJyZXF1aXJlIiwicGFyc2VGaWxlcyIsIm5leHQiLCJmaWxlcyIsImltYWdlIiwib24iLCJmaWVsZG5hbWUiLCJmaWxlIiwiZmlsZW5hbWUiLCJlbmNvZGluZyIsIm1pbWV0eXBlIiwiYnVmZmVycyIsIm1pbWVUeXBlIiwiY29uY2F0IiwicnVuIiwicGlwZSIsIm5ld0ZpbGUiLCJjZnMiLCJpbnN0YW5jZXMiLCJGUyIsIkZpbGUiLCJhdHRhY2hEYXRhIiwidHlwZSIsImZpbGVPYmoiLCJtZXRhZGF0YSIsInBhcmVudCIsInIiLCJyZXNwIiwic2l6ZSIsImluY2x1ZGVzIiwibW9tZW50IiwiRGF0ZSIsImZvcm1hdCIsInNwbGl0IiwicG9wIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwicmVwbGFjZSIsIm93bmVyIiwib3duZXJfbmFtZSIsImluc3RhbmNlIiwiYXBwcm92ZSIsImN1cnJlbnQiLCJ0b0xvY2FsZUxvd2VyQ2FzZSIsImlzX3ByaXZhdGUiLCJtYWluIiwiJHVuc2V0IiwibG9ja2VkX2J5IiwibG9ja2VkX2J5X25hbWUiLCIkbmUiLCJvcmlnaW5hbCIsInZlcnNpb25faWQiLCJTdGVlZG9zIiwiYWJzb2x1dGVVcmwiLCJwdXNoVG9waWMiLCJ1c2VySWRzIiwiZnJvbSIsImFwcE5hbWUiLCJhbGVydFRpdGxlIiwiYWxlcnQiLCJiYWRnZSIsInNvdW5kIiwiUHVzaCIsInNlbmQiLCJwdXNoU2VuZCIsInRleHQiLCJ0aXRsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElB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dCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0J2FsaXl1bi1zZGsnOiAnXjEuOS4yJyxcclxuXHRidXNib3k6IFwiXjAuMi4xM1wiLFxyXG5cdGNvb2tpZXM6IFwiXjAuNi4yXCIsXHJcblx0J2Nzdic6IFwiXjEuMS4wXCIsXHJcblx0J3VybCc6ICdeMC4xMS4wJyxcclxuXHQncmVxdWVzdCc6ICdeMi44MS4wJyxcclxuXHQneGluZ2UnOiAnXjEuMS4zJyxcclxuXHQnaHVhd2VpLXB1c2gnOiAnXjAuMC42LTAnLFxyXG5cdCd4aWFvbWktcHVzaCc6ICdeMC40LjUnXHJcbn0sICdzdGVlZG9zOmFwaScpOyIsIkBBdXRoIG9yPSB7fVxyXG5cclxuIyMjXHJcbiAgQSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxyXG4jIyNcclxudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlICh1c2VyKSAtPlxyXG4gIGNoZWNrIHVzZXIsXHJcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXHJcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXHJcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXHJcblxyXG4gIGlmIF8ua2V5cyh1c2VyKS5sZW5ndGggaXMgbm90IDFcclxuICAgIHRocm93IG5ldyBNYXRjaC5FcnJvciAnVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCdcclxuXHJcbiAgcmV0dXJuIHRydWVcclxuXHJcblxyXG4jIyNcclxuICBSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXHJcbiMjI1xyXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9ICh1c2VyKSAtPlxyXG4gIGlmIHVzZXIuaWRcclxuICAgIHJldHVybiB7J19pZCc6IHVzZXIuaWR9XHJcbiAgZWxzZSBpZiB1c2VyLnVzZXJuYW1lXHJcbiAgICByZXR1cm4geyd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWV9XHJcbiAgZWxzZSBpZiB1c2VyLmVtYWlsXHJcbiAgICByZXR1cm4geydlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWx9XHJcblxyXG4gICMgV2Ugc2hvdWxkbid0IGJlIGhlcmUgaWYgdGhlIHVzZXIgb2JqZWN0IHdhcyBwcm9wZXJseSB2YWxpZGF0ZWRcclxuICB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInXHJcblxyXG5cclxuIyMjXHJcbiAgTG9nIGEgdXNlciBpbiB3aXRoIHRoZWlyIHBhc3N3b3JkXHJcbiMjI1xyXG5AQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9ICh1c2VyLCBwYXNzd29yZCkgLT5cclxuICBpZiBub3QgdXNlciBvciBub3QgcGFzc3dvcmRcclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuICAjIFZhbGlkYXRlIHRoZSBsb2dpbiBpbnB1dCB0eXBlc1xyXG4gIGNoZWNrIHVzZXIsIHVzZXJWYWxpZGF0b3JcclxuICBjaGVjayBwYXNzd29yZCwgU3RyaW5nXHJcblxyXG4gICMgUmV0cmlldmUgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2VcclxuICBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpXHJcbiAgYXV0aGVudGljYXRpbmdVc2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IpXHJcblxyXG4gIGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXJcclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG4gIGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXM/LnBhc3N3b3JkXHJcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuXHJcbiAgIyBBdXRoZW50aWNhdGUgdGhlIHVzZXIncyBwYXNzd29yZFxyXG4gIHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZFxyXG4gIGlmIHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yXHJcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcclxuXHJcbiAgIyBBZGQgYSBuZXcgYXV0aCB0b2tlbiB0byB0aGUgdXNlcidzIGFjY291bnRcclxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpXHJcbiAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbiBhdXRoVG9rZW5cclxuICBBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBoYXNoZWRUb2tlblxyXG5cclxuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWR9KS5mZXRjaCgpXHJcbiAgc3BhY2VzID0gW11cclxuICBfLmVhY2ggc3BhY2VfdXNlcnMsIChzdSktPlxyXG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSlcclxuICAgICMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xyXG4gICAgaWYgc3BhY2U/LmlzX3BhaWQgYW5kIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpPj0wXHJcbiAgICAgIHNwYWNlcy5wdXNoXHJcbiAgICAgICAgX2lkOiBzcGFjZS5faWRcclxuICAgICAgICBuYW1lOiBzcGFjZS5uYW1lXHJcbiAgcmV0dXJuIHthdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbiwgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLCBhZG1pblNwYWNlczogc3BhY2VzfVxyXG4iLCJ2YXIgZ2V0VXNlclF1ZXJ5U2VsZWN0b3IsIHVzZXJWYWxpZGF0b3I7XG5cbnRoaXMuQXV0aCB8fCAodGhpcy5BdXRoID0ge30pO1xuXG5cbi8qXG4gIEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcbiAqL1xuXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24odXNlcikge1xuICBjaGVjayh1c2VyLCB7XG4gICAgaWQ6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgZW1haWw6IE1hdGNoLk9wdGlvbmFsKFN0cmluZylcbiAgfSk7XG4gIGlmIChfLmtleXModXNlcikubGVuZ3RoID09PSAhMSkge1xuICAgIHRocm93IG5ldyBNYXRjaC5FcnJvcignVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCcpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cblxuLypcbiAgUmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxuICovXG5cbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gZnVuY3Rpb24odXNlcikge1xuICBpZiAodXNlci5pZCkge1xuICAgIHJldHVybiB7XG4gICAgICAnX2lkJzogdXNlci5pZFxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci51c2VybmFtZSkge1xuICAgIHJldHVybiB7XG4gICAgICAndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLmVtYWlsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWxcbiAgICB9O1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcicpO1xufTtcblxuXG4vKlxuICBMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcbiAqL1xuXG50aGlzLkF1dGgubG9naW5XaXRoUGFzc3dvcmQgPSBmdW5jdGlvbih1c2VyLCBwYXNzd29yZCkge1xuICB2YXIgYXV0aFRva2VuLCBhdXRoZW50aWNhdGluZ1VzZXIsIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yLCBoYXNoZWRUb2tlbiwgcGFzc3dvcmRWZXJpZmljYXRpb24sIHJlZiwgc3BhY2VfdXNlcnMsIHNwYWNlcztcbiAgaWYgKCF1c2VyIHx8ICFwYXNzd29yZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgY2hlY2sodXNlciwgdXNlclZhbGlkYXRvcik7XG4gIGNoZWNrKHBhc3N3b3JkLCBTdHJpbmcpO1xuICBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpO1xuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3Rvcik7XG4gIGlmICghYXV0aGVudGljYXRpbmdVc2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBpZiAoISgocmVmID0gYXV0aGVudGljYXRpbmdVc2VyLnNlcnZpY2VzKSAhPSBudWxsID8gcmVmLnBhc3N3b3JkIDogdm9pZCAwKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgcGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZChhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkKTtcbiAgaWYgKHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuKGF1dGhUb2tlbik7XG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuKGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuKTtcbiAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkXG4gIH0pLmZldGNoKCk7XG4gIHNwYWNlcyA9IFtdO1xuICBfLmVhY2goc3BhY2VfdXNlcnMsIGZ1bmN0aW9uKHN1KSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3Uuc3BhY2UpO1xuICAgIGlmICgoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmlzX3BhaWQgOiB2b2lkIDApICYmIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpID49IDApIHtcbiAgICAgIHJldHVybiBzcGFjZXMucHVzaCh7XG4gICAgICAgIF9pZDogc3BhY2UuX2lkLFxuICAgICAgICBuYW1lOiBzcGFjZS5uYW1lXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIGF1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLFxuICAgIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCxcbiAgICBhZG1pblNwYWNlczogc3BhY2VzXG4gIH07XG59O1xuIiwiLy8gV2UgbmVlZCBhIGZ1bmN0aW9uIHRoYXQgdHJlYXRzIHRocm93biBlcnJvcnMgZXhhY3RseSBsaWtlIElyb24gUm91dGVyIHdvdWxkLlxyXG4vLyBUaGlzIGZpbGUgaXMgd3JpdHRlbiBpbiBKYXZhU2NyaXB0IHRvIGVuYWJsZSBjb3B5LXBhc3RpbmcgSXJvbiBSb3V0ZXIgY29kZS5cclxuXHJcbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDNcclxudmFyIGVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XHJcblxyXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0w0N1xyXG5pcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSA9IGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzKSB7XHJcbiAgaWYgKHJlcy5zdGF0dXNDb2RlIDwgNDAwKVxyXG4gICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XHJcblxyXG4gIGlmIChlcnIuc3RhdHVzKVxyXG4gICAgcmVzLnN0YXR1c0NvZGUgPSBlcnIuc3RhdHVzO1xyXG5cclxuICBpZiAoZW52ID09PSAnZGV2ZWxvcG1lbnQnKVxyXG4gICAgbXNnID0gKGVyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKSkgKyAnXFxuJztcclxuICBlbHNlXHJcbiAgICAvL1hYWCBnZXQgdGhpcyBmcm9tIHN0YW5kYXJkIGRpY3Qgb2YgZXJyb3IgbWVzc2FnZXM/XHJcbiAgICBtc2cgPSAnU2VydmVyIGVycm9yLic7XHJcblxyXG4gIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKTtcclxuXHJcbiAgaWYgKHJlcy5oZWFkZXJzU2VudClcclxuICAgIHJldHVybiByZXEuc29ja2V0LmRlc3Ryb3koKTtcclxuXHJcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xyXG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgQnVmZmVyLmJ5dGVMZW5ndGgobXNnKSk7XHJcbiAgaWYgKHJlcS5tZXRob2QgPT09ICdIRUFEJylcclxuICAgIHJldHVybiByZXMuZW5kKCk7XHJcbiAgcmVzLmVuZChtc2cpO1xyXG4gIHJldHVybjtcclxufVxyXG4iLCJjbGFzcyBzaGFyZS5Sb3V0ZVxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEBhcGksIEBwYXRoLCBAb3B0aW9ucywgQGVuZHBvaW50cykgLT5cclxuICAgICMgQ2hlY2sgaWYgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkXHJcbiAgICBpZiBub3QgQGVuZHBvaW50c1xyXG4gICAgICBAZW5kcG9pbnRzID0gQG9wdGlvbnNcclxuICAgICAgQG9wdGlvbnMgPSB7fVxyXG5cclxuXHJcbiAgYWRkVG9BcGk6IGRvIC0+XHJcbiAgICBhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXVxyXG5cclxuICAgIHJldHVybiAtPlxyXG4gICAgICBzZWxmID0gdGhpc1xyXG5cclxuICAgICAgIyBUaHJvdyBhbiBlcnJvciBpZiBhIHJvdXRlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgYXQgdGhpcyBwYXRoXHJcbiAgICAgICMgVE9ETzogQ2hlY2sgZm9yIGNvbGxpc2lvbnMgd2l0aCBwYXRocyB0aGF0IGZvbGxvdyBzYW1lIHBhdHRlcm4gd2l0aCBkaWZmZXJlbnQgcGFyYW1ldGVyIG5hbWVzXHJcbiAgICAgIGlmIF8uY29udGFpbnMgQGFwaS5fY29uZmlnLnBhdGhzLCBAcGF0aFxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiAje0BwYXRofVwiXHJcblxyXG4gICAgICAjIE92ZXJyaWRlIHRoZSBkZWZhdWx0IE9QVElPTlMgZW5kcG9pbnQgd2l0aCBvdXIgb3duXHJcbiAgICAgIEBlbmRwb2ludHMgPSBfLmV4dGVuZCBvcHRpb25zOiBAYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCwgQGVuZHBvaW50c1xyXG5cclxuICAgICAgIyBDb25maWd1cmUgZWFjaCBlbmRwb2ludCBvbiB0aGlzIHJvdXRlXHJcbiAgICAgIEBfcmVzb2x2ZUVuZHBvaW50cygpXHJcbiAgICAgIEBfY29uZmlndXJlRW5kcG9pbnRzKClcclxuXHJcbiAgICAgICMgQWRkIHRvIG91ciBsaXN0IG9mIGV4aXN0aW5nIHBhdGhzXHJcbiAgICAgIEBhcGkuX2NvbmZpZy5wYXRocy5wdXNoIEBwYXRoXHJcblxyXG4gICAgICBhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyIGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XHJcbiAgICAgICAgXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXHJcbiAgICAgIHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0IGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XHJcbiAgICAgICAgXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXHJcblxyXG4gICAgICAjIFNldHVwIGVuZHBvaW50cyBvbiByb3V0ZVxyXG4gICAgICBmdWxsUGF0aCA9IEBhcGkuX2NvbmZpZy5hcGlQYXRoICsgQHBhdGhcclxuICAgICAgXy5lYWNoIGFsbG93ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxyXG4gICAgICAgIGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXVxyXG4gICAgICAgIEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cclxuICAgICAgICAgICMgQWRkIGZ1bmN0aW9uIHRvIGVuZHBvaW50IGNvbnRleHQgZm9yIGluZGljYXRpbmcgYSByZXNwb25zZSBoYXMgYmVlbiBpbml0aWF0ZWQgbWFudWFsbHlcclxuICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2VcclxuICAgICAgICAgIGRvbmVGdW5jID0gLT5cclxuICAgICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlXHJcblxyXG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID1cclxuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zXHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiByZXEucXVlcnlcclxuICAgICAgICAgICAgYm9keVBhcmFtczogcmVxLmJvZHlcclxuICAgICAgICAgICAgcmVxdWVzdDogcmVxXHJcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXNcclxuICAgICAgICAgICAgZG9uZTogZG9uZUZ1bmNcclxuICAgICAgICAgICMgQWRkIGVuZHBvaW50IGNvbmZpZyBvcHRpb25zIHRvIGNvbnRleHRcclxuICAgICAgICAgIF8uZXh0ZW5kIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuXHJcbiAgICAgICAgICAjIFJ1biB0aGUgcmVxdWVzdGVkIGVuZHBvaW50XHJcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsXHJcbiAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgcmVzcG9uc2VEYXRhID0gc2VsZi5fY2FsbEVuZHBvaW50IGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuICAgICAgICAgIGNhdGNoIGVycm9yXHJcbiAgICAgICAgICAgICMgRG8gZXhhY3RseSB3aGF0IElyb24gUm91dGVyIHdvdWxkIGhhdmUgZG9uZSwgdG8gYXZvaWQgY2hhbmdpbmcgdGhlIEFQSVxyXG4gICAgICAgICAgICBpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZShlcnJvciwgcmVxLCByZXMpO1xyXG4gICAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgICBpZiByZXNwb25zZUluaXRpYXRlZFxyXG4gICAgICAgICAgICAjIEVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgcHJvcGVybHkgY29tcGxldGVkXHJcbiAgICAgICAgICAgIHJlcy5lbmQoKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaWYgcmVzLmhlYWRlcnNTZW50XHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxyXG4gICAgICAgICAgICBlbHNlIGlmIHJlc3BvbnNlRGF0YSBpcyBudWxsIG9yIHJlc3BvbnNlRGF0YSBpcyB1bmRlZmluZWRcclxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXHJcblxyXG4gICAgICAgICAgIyBHZW5lcmF0ZSBhbmQgcmV0dXJuIHRoZSBodHRwIHJlc3BvbnNlLCBoYW5kbGluZyB0aGUgZGlmZmVyZW50IGVuZHBvaW50IHJlc3BvbnNlIHR5cGVzXHJcbiAgICAgICAgICBpZiByZXNwb25zZURhdGEuYm9keSBhbmQgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIG9yIHJlc3BvbnNlRGF0YS5oZWFkZXJzKVxyXG4gICAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVyc1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhXHJcblxyXG4gICAgICBfLmVhY2ggcmVqZWN0ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxyXG4gICAgICAgIEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cclxuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcclxuICAgICAgICAgIGhlYWRlcnMgPSAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcclxuICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVyc1xyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBDb252ZXJ0IGFsbCBlbmRwb2ludHMgb24gdGhlIGdpdmVuIHJvdXRlIGludG8gb3VyIGV4cGVjdGVkIGVuZHBvaW50IG9iamVjdCBpZiBpdCBpcyBhIGJhcmVcclxuICAgIGZ1bmN0aW9uXHJcblxyXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXHJcbiAgIyMjXHJcbiAgX3Jlc29sdmVFbmRwb2ludHM6IC0+XHJcbiAgICBfLmVhY2ggQGVuZHBvaW50cywgKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykgLT5cclxuICAgICAgaWYgXy5pc0Z1bmN0aW9uKGVuZHBvaW50KVxyXG4gICAgICAgIGVuZHBvaW50c1ttZXRob2RdID0ge2FjdGlvbjogZW5kcG9pbnR9XHJcbiAgICByZXR1cm5cclxuXHJcblxyXG4gICMjI1xyXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxyXG4gICAgYmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXHJcblxyXG4gICAgQXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cclxuICAgIGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXHJcbiAgICBvdmVycmlkZSB0aGUgZGVmYXVsdC5cclxuXHJcbiAgICBBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcclxuICAgIGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXHJcbiAgICByZXNwZWN0aXZlbHkuXHJcblxyXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXHJcbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXHJcbiAgIyMjXHJcbiAgX2NvbmZpZ3VyZUVuZHBvaW50czogLT5cclxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCkgLT5cclxuICAgICAgaWYgbWV0aG9kIGlzbnQgJ29wdGlvbnMnXHJcbiAgICAgICAgIyBDb25maWd1cmUgYWNjZXB0YWJsZSByb2xlc1xyXG4gICAgICAgIGlmIG5vdCBAb3B0aW9ucz8ucm9sZVJlcXVpcmVkXHJcbiAgICAgICAgICBAb3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXVxyXG4gICAgICAgIGlmIG5vdCBlbmRwb2ludC5yb2xlUmVxdWlyZWRcclxuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdXHJcbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbiBlbmRwb2ludC5yb2xlUmVxdWlyZWQsIEBvcHRpb25zLnJvbGVSZXF1aXJlZFxyXG4gICAgICAgICMgTWFrZSBpdCBlYXNpZXIgdG8gY2hlY2sgaWYgbm8gcm9sZXMgYXJlIHJlcXVpcmVkXHJcbiAgICAgICAgaWYgXy5pc0VtcHR5IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxyXG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2VcclxuXHJcbiAgICAgICAgIyBDb25maWd1cmUgYXV0aCByZXF1aXJlbWVudFxyXG4gICAgICAgIGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZCBpcyB1bmRlZmluZWRcclxuICAgICAgICAgIGlmIEBvcHRpb25zPy5hdXRoUmVxdWlyZWQgb3IgZW5kcG9pbnQucm9sZVJlcXVpcmVkXHJcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWVcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2VcclxuXHJcbiAgICAgICAgaWYgQG9wdGlvbnM/LnNwYWNlUmVxdWlyZWRcclxuICAgICAgICAgIGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSBAb3B0aW9ucy5zcGFjZVJlcXVpcmVkXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAsIHRoaXNcclxuICAgIHJldHVyblxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XHJcblxyXG4gICAgQHJldHVybnMgVGhlIGVuZHBvaW50IHJlc3BvbnNlIG9yIGEgNDAxIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzXHJcbiAgIyMjXHJcbiAgX2NhbGxFbmRwb2ludDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XHJcbiAgICAjIENhbGwgdGhlIGVuZHBvaW50IGlmIGF1dGhlbnRpY2F0aW9uIGRvZXNuJ3QgZmFpbFxyXG4gICAgaWYgQF9hdXRoQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG4gICAgICBpZiBAX3JvbGVBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XHJcbiAgICAgICAgaWYgQF9zcGFjZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuICAgICAgICAgICNlbmRwb2ludC5hY3Rpb24uY2FsbCBlbmRwb2ludENvbnRleHRcclxuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb25cclxuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXHJcbiAgICAgICAgICAgIGNvbm5lY3Rpb246IG51bGwsXHJcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXHJcbiAgICAgICBcclxuICAgICAgICAgIHJldHVybiBERFAuX0N1cnJlbnRJbnZvY2F0aW9uLndpdGhWYWx1ZSBpbnZvY2F0aW9uLCAtPlxyXG4gICAgICAgICAgICByZXR1cm4gZW5kcG9pbnQuYWN0aW9uLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBzdGF0dXNDb2RlOiA0MDNcclxuICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdCYWQgWC1TcGFjZS1JZCwgT25seSBhZG1pbnMgb2YgcGFpZCBzcGFjZSBjYW4gY2FsbCB0aGlzIGFwaS4nfVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgc3RhdHVzQ29kZTogNDAzXHJcbiAgICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRvIHRoaXMuJ31cclxuICAgIGVsc2VcclxuICAgICAgc3RhdHVzQ29kZTogNDAxXHJcbiAgICAgIGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gZG8gdGhpcy4nfVxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXHJcblxyXG4gICAgT25jZSBpdCdzIGdsb2JhbGx5IGNvbmZpZ3VyZWQgaW4gdGhlIEFQSSwgYXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvclxyXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXHJcbiAgICBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cclxuXHJcbiAgICBAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXHJcbiAgIyMjXHJcbiAgX2F1dGhBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XHJcbiAgICBpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWRcclxuICAgICAgQF9hdXRoZW50aWNhdGUgZW5kcG9pbnRDb250ZXh0XHJcbiAgICBlbHNlIHRydWVcclxuXHJcblxyXG4gICMjI1xyXG4gICAgVmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcclxuXHJcbiAgICBJZiB2ZXJpZmllZCwgYXR0YWNoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgdG8gdGhlIGNvbnRleHQuXHJcblxyXG4gICAgQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXHJcbiAgIyMjXHJcbiAgX2F1dGhlbnRpY2F0ZTogKGVuZHBvaW50Q29udGV4dCkgLT5cclxuICAgICMgR2V0IGF1dGggaW5mb1xyXG4gICAgYXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXHJcblxyXG4gICAgIyBHZXQgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2VcclxuICAgIGlmIGF1dGg/LnVzZXJJZCBhbmQgYXV0aD8udG9rZW4gYW5kIG5vdCBhdXRoPy51c2VyXHJcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9XHJcbiAgICAgIHVzZXJTZWxlY3Rvci5faWQgPSBhdXRoLnVzZXJJZFxyXG4gICAgICB1c2VyU2VsZWN0b3JbQGFwaS5fY29uZmlnLmF1dGgudG9rZW5dID0gYXV0aC50b2tlblxyXG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSB1c2VyU2VsZWN0b3JcclxuXHJcbiAgICAjIEF0dGFjaCB0aGUgdXNlciBhbmQgdGhlaXIgSUQgdG8gdGhlIGNvbnRleHQgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXHJcbiAgICBpZiBhdXRoPy51c2VyXHJcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VyID0gYXV0aC51c2VyXHJcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkXHJcbiAgICAgIHRydWVcclxuICAgIGVsc2UgZmFsc2VcclxuXHJcbiAgIyMjXHJcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxyXG5cclxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cclxuXHJcbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxyXG4gICAgICAgICAgICAgZW5kcG9pbnRcclxuICAjIyNcclxuICBfc3BhY2VBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XHJcbiAgICBpZiBlbmRwb2ludC5zcGFjZVJlcXVpcmVkXHJcbiAgICAgIGF1dGggPSBAYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KVxyXG4gICAgICBpZiBhdXRoPy5zcGFjZUlkXHJcbiAgICAgICAgc3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoLnVzZXJJZCwgc3BhY2U6YXV0aC5zcGFjZUlkfSkuY291bnQoKVxyXG4gICAgICAgIGlmIHNwYWNlX3VzZXJzX2NvdW50XHJcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZClcclxuICAgICAgICAgICMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xyXG4gICAgICAgICAgaWYgc3BhY2U/LmlzX3BhaWQgYW5kIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIGF1dGgudXNlcklkKT49MFxyXG4gICAgICAgICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IGF1dGguc3BhY2VJZFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCJcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAjIyNcclxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXHJcblxyXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxyXG5cclxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXHJcbiAgICAgICAgICAgICBlbmRwb2ludFxyXG4gICMjI1xyXG4gIF9yb2xlQWNjZXB0ZWQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxyXG4gICAgaWYgZW5kcG9pbnQucm9sZVJlcXVpcmVkXHJcbiAgICAgIGlmIF8uaXNFbXB0eSBfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgdHJ1ZVxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBSZXNwb25kIHRvIGFuIEhUVFAgcmVxdWVzdFxyXG4gICMjI1xyXG4gIF9yZXNwb25kOiAocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGU9MjAwLCBoZWFkZXJzPXt9KSAtPlxyXG4gICAgIyBPdmVycmlkZSBhbnkgZGVmYXVsdCBoZWFkZXJzIHRoYXQgaGF2ZSBiZWVuIHByb3ZpZGVkIChrZXlzIGFyZSBub3JtYWxpemVkIHRvIGJlIGNhc2UgaW5zZW5zaXRpdmUpXHJcbiAgICAjIFRPRE86IENvbnNpZGVyIG9ubHkgbG93ZXJjYXNpbmcgdGhlIGhlYWRlciBrZXlzIHdlIG5lZWQgbm9ybWFsaXplZCwgbGlrZSBDb250ZW50LVR5cGVcclxuICAgIGRlZmF1bHRIZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIEBhcGkuX2NvbmZpZy5kZWZhdWx0SGVhZGVyc1xyXG4gICAgaGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBoZWFkZXJzXHJcbiAgICBoZWFkZXJzID0gXy5leHRlbmQgZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnNcclxuXHJcbiAgICAjIFByZXBhcmUgSlNPTiBib2R5IGZvciByZXNwb25zZSB3aGVuIENvbnRlbnQtVHlwZSBpbmRpY2F0ZXMgSlNPTiB0eXBlXHJcbiAgICBpZiBoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgaXNudCBudWxsXHJcbiAgICAgIGlmIEBhcGkuX2NvbmZpZy5wcmV0dHlKc29uXHJcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHksIHVuZGVmaW5lZCwgMlxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHlcclxuXHJcbiAgICAjIFNlbmQgcmVzcG9uc2VcclxuICAgIHNlbmRSZXNwb25zZSA9IC0+XHJcbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCBzdGF0dXNDb2RlLCBoZWFkZXJzXHJcbiAgICAgIHJlc3BvbnNlLndyaXRlIGJvZHlcclxuICAgICAgcmVzcG9uc2UuZW5kKClcclxuICAgIGlmIHN0YXR1c0NvZGUgaW4gWzQwMSwgNDAzXVxyXG4gICAgICAjIEhhY2tlcnMgY2FuIG1lYXN1cmUgdGhlIHJlc3BvbnNlIHRpbWUgdG8gZGV0ZXJtaW5lIHRoaW5ncyBsaWtlIHdoZXRoZXIgdGhlIDQwMSByZXNwb25zZSB3YXMgXHJcbiAgICAgICMgY2F1c2VkIGJ5IGJhZCB1c2VyIGlkIHZzIGJhZCBwYXNzd29yZC5cclxuICAgICAgIyBJbiBkb2luZyBzbywgdGhleSBjYW4gZmlyc3Qgc2NhbiBmb3IgdmFsaWQgdXNlciBpZHMgcmVnYXJkbGVzcyBvZiB2YWxpZCBwYXNzd29yZHMuXHJcbiAgICAgICMgRGVsYXkgYnkgYSByYW5kb20gYW1vdW50IHRvIHJlZHVjZSB0aGUgYWJpbGl0eSBmb3IgYSBoYWNrZXIgdG8gZGV0ZXJtaW5lIHRoZSByZXNwb25zZSB0aW1lLlxyXG4gICAgICAjIFNlZSBodHRwczovL3d3dy5vd2FzcC5vcmcvaW5kZXgucGhwL0Jsb2NraW5nX0JydXRlX0ZvcmNlX0F0dGFja3MjRmluZGluZ19PdGhlcl9Db3VudGVybWVhc3VyZXNcclxuICAgICAgIyBTZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGltaW5nX2F0dGFja1xyXG4gICAgICBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMFxyXG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpXHJcbiAgICAgIGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvXHJcbiAgICAgIE1ldGVvci5zZXRUaW1lb3V0IHNlbmRSZXNwb25zZSwgZGVsYXlJbk1pbGxpc2Vjb25kc1xyXG4gICAgZWxzZVxyXG4gICAgICBzZW5kUmVzcG9uc2UoKVxyXG5cclxuICAjIyNcclxuICAgIFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcclxuICAjIyNcclxuICBfbG93ZXJDYXNlS2V5czogKG9iamVjdCkgLT5cclxuICAgIF8uY2hhaW4gb2JqZWN0XHJcbiAgICAucGFpcnMoKVxyXG4gICAgLm1hcCAoYXR0cikgLT5cclxuICAgICAgW2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV1cclxuICAgIC5vYmplY3QoKVxyXG4gICAgLnZhbHVlKClcclxuIiwic2hhcmUuUm91dGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJvdXRlKGFwaSwgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzMSkge1xuICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmVuZHBvaW50cyA9IGVuZHBvaW50czE7XG4gICAgaWYgKCF0aGlzLmVuZHBvaW50cykge1xuICAgICAgdGhpcy5lbmRwb2ludHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBSb3V0ZS5wcm90b3R5cGUuYWRkVG9BcGkgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF2YWlsYWJsZU1ldGhvZHM7XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ107XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFsbG93ZWRNZXRob2RzLCBmdWxsUGF0aCwgcmVqZWN0ZWRNZXRob2RzLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoXy5jb250YWlucyh0aGlzLmFwaS5fY29uZmlnLnBhdGhzLCB0aGlzLnBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiBcIiArIHRoaXMucGF0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgb3B0aW9uczogdGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XG4gICAgICB9LCB0aGlzLmVuZHBvaW50cyk7XG4gICAgICB0aGlzLl9yZXNvbHZlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuYXBpLl9jb25maWcucGF0aHMucHVzaCh0aGlzLnBhdGgpO1xuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlcihhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIGZ1bGxQYXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hcGlQYXRoICsgdGhpcy5wYXRoO1xuICAgICAgXy5lYWNoKGFsbG93ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50O1xuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF07XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBkb25lRnVuYywgZW5kcG9pbnRDb250ZXh0LCBlcnJvciwgcmVzcG9uc2VEYXRhLCByZXNwb25zZUluaXRpYXRlZDtcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlO1xuICAgICAgICAgIGRvbmVGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID0ge1xuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeSxcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5LFxuICAgICAgICAgICAgcmVxdWVzdDogcmVxLFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlcyxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfLmV4dGVuZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZUluaXRpYXRlZCkge1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLmhlYWRlcnNTZW50KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VEYXRhID09PSBudWxsIHx8IHJlc3BvbnNlRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlRGF0YS5ib2R5ICYmIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSB8fCByZXNwb25zZURhdGEuaGVhZGVycykpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlamVjdGVkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBoZWFkZXJzLCByZXNwb25zZURhdGE7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCk7XG5cblxuICAvKlxuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICAgIGZ1bmN0aW9uXG4gIFxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc29sdmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbmRwb2ludCkpIHtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50c1ttZXRob2RdID0ge1xuICAgICAgICAgIGFjdGlvbjogZW5kcG9pbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICAgIGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuICBcbiAgICBBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICAgIGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG4gICAgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuICAgIGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG4gICAgcmVzcGVjdGl2ZWx5LlxuICBcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY29uZmlndXJlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kKSB7XG4gICAgICB2YXIgcmVmLCByZWYxLCByZWYyO1xuICAgICAgaWYgKG1ldGhvZCAhPT0gJ29wdGlvbnMnKSB7XG4gICAgICAgIGlmICghKChyZWYgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYucm9sZVJlcXVpcmVkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkKTtcbiAgICAgICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludC5yb2xlUmVxdWlyZWQpKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKCgocmVmMSA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjEuYXV0aFJlcXVpcmVkIDogdm9pZCAwKSB8fCBlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHJlZjIgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYyLnNwYWNlUmVxdWlyZWQgOiB2b2lkIDApIHtcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gdGhpcy5vcHRpb25zLnNwYWNlUmVxdWlyZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIGFuIGVuZHBvaW50IGlmIHJlcXVpcmVkLCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdFxuICBcbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jYWxsRW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGludm9jYXRpb247XG4gICAgaWYgKHRoaXMuX2F1dGhBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgaWYgKHRoaXMuX3JvbGVBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICBpZiAodGhpcy5fc3BhY2VBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb24oe1xuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlKGludm9jYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuICBcbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gICAgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2F1dGhlbnRpY2F0ZShlbmRwb2ludENvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG4gIFxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cbiAgXG4gICAgQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aGVudGljYXRlID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0KSB7XG4gICAgdmFyIGF1dGgsIHVzZXJTZWxlY3RvcjtcbiAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgIGlmICgoYXV0aCAhPSBudWxsID8gYXV0aC51c2VySWQgOiB2b2lkIDApICYmIChhdXRoICE9IG51bGwgPyBhdXRoLnRva2VuIDogdm9pZCAwKSAmJiAhKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkpIHtcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9O1xuICAgICAgdXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkO1xuICAgICAgdXNlclNlbGVjdG9yW3RoaXMuYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuO1xuICAgICAgYXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUodXNlclNlbGVjdG9yKTtcbiAgICB9XG4gICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkge1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXI7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9zcGFjZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBhdXRoLCBzcGFjZSwgc3BhY2VfdXNlcnNfY291bnQ7XG4gICAgaWYgKGVuZHBvaW50LnNwYWNlUmVxdWlyZWQpIHtcbiAgICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC5zcGFjZUlkIDogdm9pZCAwKSB7XG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgdXNlcjogYXV0aC51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IGF1dGguc3BhY2VJZFxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcnNfY291bnQpIHtcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpID49IDApIHtcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yb2xlQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgaWYgKF8uaXNFbXB0eShfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qXG4gICAgUmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3RcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNwb25kID0gZnVuY3Rpb24ocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGUsIGhlYWRlcnMpIHtcbiAgICB2YXIgZGVmYXVsdEhlYWRlcnMsIGRlbGF5SW5NaWxsaXNlY29uZHMsIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzLCByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bywgc2VuZFJlc3BvbnNlO1xuICAgIGlmIChzdGF0dXNDb2RlID09IG51bGwpIHtcbiAgICAgIHN0YXR1c0NvZGUgPSAyMDA7XG4gICAgfVxuICAgIGlmIChoZWFkZXJzID09IG51bGwpIHtcbiAgICAgIGhlYWRlcnMgPSB7fTtcbiAgICB9XG4gICAgZGVmYXVsdEhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKGhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSBfLmV4dGVuZChkZWZhdWx0SGVhZGVycywgaGVhZGVycyk7XG4gICAgaWYgKGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYXBpLl9jb25maWcucHJldHR5SnNvbikge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSwgdm9pZCAwLCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNwb25zZS53cml0ZUhlYWQoc3RhdHVzQ29kZSwgaGVhZGVycyk7XG4gICAgICByZXNwb25zZS53cml0ZShib2R5KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5lbmQoKTtcbiAgICB9O1xuICAgIGlmIChzdGF0dXNDb2RlID09PSA0MDEgfHwgc3RhdHVzQ29kZSA9PT0gNDAzKSB7XG4gICAgICBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMDtcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKCk7XG4gICAgICBkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bztcbiAgICAgIHJldHVybiBNZXRlb3Iuc2V0VGltZW91dChzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2VuZFJlc3BvbnNlKCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fbG93ZXJDYXNlS2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBfLmNoYWluKG9iamVjdCkucGFpcnMoKS5tYXAoZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dO1xuICAgIH0pLm9iamVjdCgpLnZhbHVlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJvdXRlO1xuXG59KSgpO1xuIiwiY2xhc3MgQFJlc3RpdnVzXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cclxuICAgIEBfcm91dGVzID0gW11cclxuICAgIEBfY29uZmlnID1cclxuICAgICAgcGF0aHM6IFtdXHJcbiAgICAgIHVzZURlZmF1bHRBdXRoOiBmYWxzZVxyXG4gICAgICBhcGlQYXRoOiAnYXBpLydcclxuICAgICAgdmVyc2lvbjogbnVsbFxyXG4gICAgICBwcmV0dHlKc29uOiBmYWxzZVxyXG4gICAgICBhdXRoOlxyXG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJ1xyXG4gICAgICAgIHVzZXI6IC0+XHJcbiAgICAgICAgICBpZiBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXVxyXG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBAcmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXVxyXG4gICAgICAgICAgaWYgQHJlcXVlc3QudXNlcklkXHJcbiAgICAgICAgICAgIF91c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBAcmVxdWVzdC51c2VySWR9KVxyXG4gICAgICAgICAgICB1c2VyOiBfdXNlclxyXG4gICAgICAgICAgICB1c2VySWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddXHJcbiAgICAgICAgICAgIHNwYWNlSWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXVxyXG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdXNlcklkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXVxyXG4gICAgICAgICAgICBzcGFjZUlkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ11cclxuICAgICAgICAgICAgdG9rZW46IHRva2VuXHJcbiAgICAgIGRlZmF1bHRIZWFkZXJzOlxyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgZW5hYmxlQ29yczogdHJ1ZVxyXG5cclxuICAgICMgQ29uZmlndXJlIEFQSSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXHJcbiAgICBfLmV4dGVuZCBAX2NvbmZpZywgb3B0aW9uc1xyXG5cclxuICAgIGlmIEBfY29uZmlnLmVuYWJsZUNvcnNcclxuICAgICAgY29yc0hlYWRlcnMgPVxyXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKidcclxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0J1xyXG5cclxuICAgICAgaWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcclxuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuJ1xyXG5cclxuICAgICAgIyBTZXQgZGVmYXVsdCBoZWFkZXIgdG8gZW5hYmxlIENPUlMgaWYgY29uZmlndXJlZFxyXG4gICAgICBfLmV4dGVuZCBAX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnNcclxuXHJcbiAgICAgIGlmIG5vdCBAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XHJcbiAgICAgICAgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IC0+XHJcbiAgICAgICAgICBAcmVzcG9uc2Uud3JpdGVIZWFkIDIwMCwgY29yc0hlYWRlcnNcclxuICAgICAgICAgIEBkb25lKClcclxuXHJcbiAgICAjIE5vcm1hbGl6ZSB0aGUgQVBJIHBhdGhcclxuICAgIGlmIEBfY29uZmlnLmFwaVBhdGhbMF0gaXMgJy8nXHJcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoLnNsaWNlIDFcclxuICAgIGlmIF8ubGFzdChAX2NvbmZpZy5hcGlQYXRoKSBpc250ICcvJ1xyXG4gICAgICBAX2NvbmZpZy5hcGlQYXRoID0gQF9jb25maWcuYXBpUGF0aCArICcvJ1xyXG5cclxuICAgICMgVVJMIHBhdGggdmVyc2lvbmluZyBpcyB0aGUgb25seSB0eXBlIG9mIEFQSSB2ZXJzaW9uaW5nIGN1cnJlbnRseSBhdmFpbGFibGUsIHNvIGlmIGEgdmVyc2lvbiBpc1xyXG4gICAgIyBwcm92aWRlZCwgYXBwZW5kIGl0IHRvIHRoZSBiYXNlIHBhdGggb2YgdGhlIEFQSVxyXG4gICAgaWYgQF9jb25maWcudmVyc2lvblxyXG4gICAgICBAX2NvbmZpZy5hcGlQYXRoICs9IEBfY29uZmlnLnZlcnNpb24gKyAnLydcclxuXHJcbiAgICAjIEFkZCBkZWZhdWx0IGxvZ2luIGFuZCBsb2dvdXQgZW5kcG9pbnRzIGlmIGF1dGggaXMgY29uZmlndXJlZFxyXG4gICAgaWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcclxuICAgICAgQF9pbml0QXV0aCgpXHJcbiAgICBlbHNlIGlmIEBfY29uZmlnLnVzZUF1dGhcclxuICAgICAgQF9pbml0QXV0aCgpXHJcbiAgICAgIGNvbnNvbGUud2FybiAnV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICtcclxuICAgICAgICAgICdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCdcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG5cclxuXHJcbiAgIyMjKlxyXG4gICAgQWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxyXG5cclxuICAgIEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcclxuICAgIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xyXG4gICAgQHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxyXG4gICAgQHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXHJcbiAgICBAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXHJcbiAgICBAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXHJcbiAgICAgICAgY29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxyXG4gICAgICAgIGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cclxuICAjIyNcclxuICBhZGRSb3V0ZTogKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykgLT5cclxuICAgICMgQ3JlYXRlIGEgbmV3IHJvdXRlIGFuZCBhZGQgaXQgdG8gb3VyIGxpc3Qgb2YgZXhpc3Rpbmcgcm91dGVzXHJcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpXHJcbiAgICBAX3JvdXRlcy5wdXNoKHJvdXRlKVxyXG5cclxuICAgIHJvdXRlLmFkZFRvQXBpKClcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG5cclxuXHJcbiAgIyMjKlxyXG4gICAgR2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxyXG4gICMjI1xyXG4gIGFkZENvbGxlY3Rpb246IChjb2xsZWN0aW9uLCBvcHRpb25zPXt9KSAtPlxyXG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXVxyXG4gICAgbWV0aG9kc09uQ29sbGVjdGlvbiA9IFsncG9zdCcsICdnZXRBbGwnXVxyXG5cclxuICAgICMgR3JhYiB0aGUgc2V0IG9mIGVuZHBvaW50c1xyXG4gICAgaWYgY29sbGVjdGlvbiBpcyBNZXRlb3IudXNlcnNcclxuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IEBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHNcclxuICAgIGVsc2VcclxuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IEBfY29sbGVjdGlvbkVuZHBvaW50c1xyXG5cclxuICAgICMgRmxhdHRlbiB0aGUgb3B0aW9ucyBhbmQgc2V0IGRlZmF1bHRzIGlmIG5lY2Vzc2FyeVxyXG4gICAgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgb3Ige31cclxuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIG9yIHt9XHJcbiAgICBleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgb3IgW11cclxuICAgICMgVXNlIGNvbGxlY3Rpb24gbmFtZSBhcyBkZWZhdWx0IHBhdGhcclxuICAgIHBhdGggPSBvcHRpb25zLnBhdGggb3IgY29sbGVjdGlvbi5fbmFtZVxyXG5cclxuICAgICMgU2VwYXJhdGUgdGhlIHJlcXVlc3RlZCBlbmRwb2ludHMgYnkgdGhlIHJvdXRlIHRoZXkgYmVsb25nIHRvIChvbmUgZm9yIG9wZXJhdGluZyBvbiB0aGUgZW50aXJlXHJcbiAgICAjIGNvbGxlY3Rpb24gYW5kIG9uZSBmb3Igb3BlcmF0aW5nIG9uIGEgc2luZ2xlIGVudGl0eSB3aXRoaW4gdGhlIGNvbGxlY3Rpb24pXHJcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fVxyXG4gICAgZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fVxyXG4gICAgaWYgXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgYW5kIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cylcclxuICAgICAgIyBHZW5lcmF0ZSBhbGwgZW5kcG9pbnRzIG9uIHRoaXMgY29sbGVjdGlvblxyXG4gICAgICBfLmVhY2ggbWV0aG9kcywgKG1ldGhvZCkgLT5cclxuICAgICAgICAjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcclxuICAgICAgICBpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxyXG4gICAgICAgICAgXy5leHRlbmQgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKVxyXG4gICAgICAgIGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgICwgdGhpc1xyXG4gICAgZWxzZVxyXG4gICAgICAjIEdlbmVyYXRlIGFueSBlbmRwb2ludHMgdGhhdCBoYXZlbid0IGJlZW4gZXhwbGljaXRseSBleGNsdWRlZFxyXG4gICAgICBfLmVhY2ggbWV0aG9kcywgKG1ldGhvZCkgLT5cclxuICAgICAgICBpZiBtZXRob2Qgbm90IGluIGV4Y2x1ZGVkRW5kcG9pbnRzIGFuZCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSBpc250IGZhbHNlXHJcbiAgICAgICAgICAjIENvbmZpZ3VyZSBlbmRwb2ludCBhbmQgbWFwIHRvIGl0J3MgaHR0cCBtZXRob2RcclxuICAgICAgICAgICMgVE9ETzogQ29uc2lkZXIgcHJlZGVmaW5pbmcgYSBtYXAgb2YgbWV0aG9kcyB0byB0aGVpciBodHRwIG1ldGhvZCB0eXBlIChlLmcuLCBnZXRBbGw6IGdldClcclxuICAgICAgICAgIGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdXHJcbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fVxyXG4gICAgICAgICAgXy5lYWNoIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCAoYWN0aW9uLCBtZXRob2RUeXBlKSAtPlxyXG4gICAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPVxyXG4gICAgICAgICAgICAgIF8uY2hhaW4gYWN0aW9uXHJcbiAgICAgICAgICAgICAgLmNsb25lKClcclxuICAgICAgICAgICAgICAuZXh0ZW5kIGVuZHBvaW50T3B0aW9uc1xyXG4gICAgICAgICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgICAjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcclxuICAgICAgICAgIGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXHJcbiAgICAgICAgICAgIF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XHJcbiAgICAgICAgICBlbHNlIF8uZXh0ZW5kIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnRcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAsIHRoaXNcclxuXHJcbiAgICAjIEFkZCB0aGUgcm91dGVzIHRvIHRoZSBBUElcclxuICAgIEBhZGRSb3V0ZSBwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50c1xyXG4gICAgQGFkZFJvdXRlIFwiI3twYXRofS86aWRcIiwgcm91dGVPcHRpb25zLCBlbnRpdHlSb3V0ZUVuZHBvaW50c1xyXG5cclxuICAgIHJldHVybiB0aGlzXHJcblxyXG5cclxuICAjIyMqXHJcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIENvbGxlY3Rpb24gUm91dGVcclxuICAjIyNcclxuICBfY29sbGVjdGlvbkVuZHBvaW50czpcclxuICAgIGdldDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIGdldDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XHJcbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBzZWxlY3RvclxyXG4gICAgICAgICAgaWYgZW50aXR5XHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG4gICAgcHV0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgcHV0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cclxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUgc2VsZWN0b3IsICRzZXQ6IEBib2R5UGFyYW1zXHJcbiAgICAgICAgICBpZiBlbnRpdHlJc1VwZGF0ZWRcclxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWRcclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XHJcbiAgICBkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBkZWxldGU6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxyXG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICBpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnfVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxyXG4gICAgcG9zdDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIHBvc3Q6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICAgIEBib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICBlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXHJcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWRcclxuICAgICAgICAgIGlmIGVudGl0eVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDFcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ31cclxuICAgIGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIGdldDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBzZWxlY3RvciA9IHt9XHJcbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpXHJcbiAgICAgICAgICBpZiBlbnRpdGllc1xyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0aWVzfVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbid9XHJcblxyXG5cclxuICAjIyMqXHJcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXHJcbiAgIyMjXHJcbiAgX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzOlxyXG4gICAgZ2V0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgZ2V0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuICAgICAgICAgIGlmIGVudGl0eVxyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cclxuICAgIHB1dDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIHB1dDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBAdXJsUGFyYW1zLmlkLCAkc2V0OiBwcm9maWxlOiBAYm9keVBhcmFtc1xyXG4gICAgICAgICAgaWYgZW50aXR5SXNVcGRhdGVkXHJcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuICAgICAgICAgICAge3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGVudGl0eX1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cclxuICAgIGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIGRlbGV0ZTpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBpZiBjb2xsZWN0aW9uLnJlbW92ZSBAdXJsUGFyYW1zLmlkXHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCd9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XHJcbiAgICBwb3N0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgcG9zdDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICAjIENyZWF0ZSBhIG5ldyB1c2VyIGFjY291bnRcclxuICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlciBAYm9keVBhcmFtc1xyXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcclxuICAgICAgICAgIGlmIGVudGl0eVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDFcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxyXG4gICAgICAgICAgICB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ31cclxuICAgIGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIGdldDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwgZmllbGRzOiBwcm9maWxlOiAxKS5mZXRjaCgpXHJcbiAgICAgICAgICBpZiBlbnRpdGllc1xyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0aWVzfVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIHVzZXJzJ31cclxuXHJcblxyXG4gICMjI1xyXG4gICAgQWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxyXG4gICMjI1xyXG4gIF9pbml0QXV0aDogLT5cclxuICAgIHNlbGYgPSB0aGlzXHJcbiAgICAjIyNcclxuICAgICAgQWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxyXG5cclxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcclxuICAgICAgYWRkaW5nIGhvb2spLlxyXG4gICAgIyMjXHJcbiAgICBAYWRkUm91dGUgJ2xvZ2luJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LFxyXG4gICAgICBwb3N0OiAtPlxyXG4gICAgICAgICMgR3JhYiB0aGUgdXNlcm5hbWUgb3IgZW1haWwgdGhhdCB0aGUgdXNlciBpcyBsb2dnaW5nIGluIHdpdGhcclxuICAgICAgICB1c2VyID0ge31cclxuICAgICAgICBpZiBAYm9keVBhcmFtcy51c2VyXHJcbiAgICAgICAgICBpZiBAYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSBpcyAtMVxyXG4gICAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlclxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMudXNlclxyXG4gICAgICAgIGVsc2UgaWYgQGJvZHlQYXJhbXMudXNlcm5hbWVcclxuICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSBAYm9keVBhcmFtcy51c2VybmFtZVxyXG4gICAgICAgIGVsc2UgaWYgQGJvZHlQYXJhbXMuZW1haWxcclxuICAgICAgICAgIHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy5lbWFpbFxyXG5cclxuICAgICAgICAjIFRyeSB0byBsb2cgdGhlIHVzZXIgaW50byB0aGUgdXNlcidzIGFjY291bnQgKGlmIHN1Y2Nlc3NmdWwgd2UnbGwgZ2V0IGFuIGF1dGggdG9rZW4gYmFjaylcclxuICAgICAgICB0cnlcclxuICAgICAgICAgIGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkIHVzZXIsIEBib2R5UGFyYW1zLnBhc3N3b3JkXHJcbiAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcbiAgICAgICAgICByZXR1cm4ge30gPVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yXHJcbiAgICAgICAgICAgIGJvZHk6IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogZS5yZWFzb25cclxuXHJcbiAgICAgICAgIyBHZXQgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxyXG4gICAgICAgICMgVE9ETzogQ29uc2lkZXIgcmV0dXJuaW5nIHRoZSB1c2VyIGluIEF1dGgubG9naW5XaXRoUGFzc3dvcmQoKSwgaW5zdGVhZCBvZiBmZXRjaGluZyBpdCBhZ2FpbiBoZXJlXHJcbiAgICAgICAgaWYgYXV0aC51c2VySWQgYW5kIGF1dGguYXV0aFRva2VuXHJcbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9XHJcbiAgICAgICAgICBzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aC5hdXRoVG9rZW5cclxuICAgICAgICAgIEB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXHJcbiAgICAgICAgICAgIHNlYXJjaFF1ZXJ5XHJcbiAgICAgICAgICBAdXNlcklkID0gQHVzZXI/Ll9pZFxyXG5cclxuICAgICAgICByZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogYXV0aH1cclxuXHJcbiAgICAgICAgIyBDYWxsIHRoZSBsb2dpbiBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxyXG4gICAgICAgIGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluPy5jYWxsKHRoaXMpXHJcbiAgICAgICAgaWYgZXh0cmFEYXRhP1xyXG4gICAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxyXG5cclxuICAgICAgICByZXNwb25zZVxyXG5cclxuICAgIGxvZ291dCA9IC0+XHJcbiAgICAgICMgUmVtb3ZlIHRoZSBnaXZlbiBhdXRoIHRva2VuIGZyb20gdGhlIHVzZXIncyBhY2NvdW50XHJcbiAgICAgIGF1dGhUb2tlbiA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXHJcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGhUb2tlblxyXG4gICAgICB0b2tlbkxvY2F0aW9uID0gc2VsZi5fY29uZmlnLmF1dGgudG9rZW5cclxuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mICcuJ1xyXG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyAwLCBpbmRleFxyXG4gICAgICB0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nIGluZGV4ICsgMVxyXG4gICAgICB0b2tlblRvUmVtb3ZlID0ge31cclxuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlblxyXG4gICAgICB0b2tlblJlbW92YWxRdWVyeSA9IHt9XHJcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlXHJcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUgQHVzZXIuX2lkLCB7JHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5fVxyXG5cclxuICAgICAgcmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHttZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISd9fVxyXG5cclxuICAgICAgIyBDYWxsIHRoZSBsb2dvdXQgaG9vayB3aXRoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYXR0YWNoZWRcclxuICAgICAgZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0Py5jYWxsKHRoaXMpXHJcbiAgICAgIGlmIGV4dHJhRGF0YT9cclxuICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXHJcblxyXG4gICAgICByZXNwb25zZVxyXG5cclxuICAgICMjI1xyXG4gICAgICBBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxyXG5cclxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxyXG4gICAgICBhZGRpbmcgaG9vaykuXHJcbiAgICAjIyNcclxuICAgIEBhZGRSb3V0ZSAnbG9nb3V0Jywge2F1dGhSZXF1aXJlZDogdHJ1ZX0sXHJcbiAgICAgIGdldDogLT5cclxuICAgICAgICBjb25zb2xlLndhcm4gXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiXHJcbiAgICAgICAgY29uc29sZS53YXJuIFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiXHJcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpXHJcbiAgICAgIHBvc3Q6IGxvZ291dFxyXG5cclxuUmVzdGl2dXMgPSBAUmVzdGl2dXNcclxuIiwidmFyIFJlc3RpdnVzLFxuICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbnRoaXMuUmVzdGl2dXMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJlc3RpdnVzKG9wdGlvbnMpIHtcbiAgICB2YXIgY29yc0hlYWRlcnM7XG4gICAgdGhpcy5fcm91dGVzID0gW107XG4gICAgdGhpcy5fY29uZmlnID0ge1xuICAgICAgcGF0aHM6IFtdLFxuICAgICAgdXNlRGVmYXVsdEF1dGg6IGZhbHNlLFxuICAgICAgYXBpUGF0aDogJ2FwaS8nLFxuICAgICAgdmVyc2lvbjogbnVsbCxcbiAgICAgIHByZXR0eUpzb246IGZhbHNlLFxuICAgICAgYXV0aDoge1xuICAgICAgICB0b2tlbjogJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbicsXG4gICAgICAgIHVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfdXNlciwgdG9rZW47XG4gICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSkge1xuICAgICAgICAgICAgdG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMucmVxdWVzdC51c2VySWQpIHtcbiAgICAgICAgICAgIF91c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy5yZXF1ZXN0LnVzZXJJZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VyOiBfdXNlcixcbiAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ10sXG4gICAgICAgICAgICAgIHNwYWNlSWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10sXG4gICAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ10sXG4gICAgICAgICAgICAgIHNwYWNlSWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10sXG4gICAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgZW5hYmxlQ29yczogdHJ1ZVxuICAgIH07XG4gICAgXy5leHRlbmQodGhpcy5fY29uZmlnLCBvcHRpb25zKTtcbiAgICBpZiAodGhpcy5fY29uZmlnLmVuYWJsZUNvcnMpIHtcbiAgICAgIGNvcnNIZWFkZXJzID0ge1xuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0J1xuICAgICAgfTtcbiAgICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgICAgY29yc0hlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnXSArPSAnLCBYLVVzZXItSWQsIFgtQXV0aC1Ub2tlbic7XG4gICAgICB9XG4gICAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcuZGVmYXVsdEhlYWRlcnMsIGNvcnNIZWFkZXJzKTtcbiAgICAgIGlmICghdGhpcy5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlLndyaXRlSGVhZCgyMDAsIGNvcnNIZWFkZXJzKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcuYXBpUGF0aFswXSA9PT0gJy8nKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCA9IHRoaXMuX2NvbmZpZy5hcGlQYXRoLnNsaWNlKDEpO1xuICAgIH1cbiAgICBpZiAoXy5sYXN0KHRoaXMuX2NvbmZpZy5hcGlQYXRoKSAhPT0gJy8nKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCA9IHRoaXMuX2NvbmZpZy5hcGlQYXRoICsgJy8nO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnZlcnNpb24pIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoICs9IHRoaXMuX2NvbmZpZy52ZXJzaW9uICsgJy8nO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY29uZmlnLnVzZUF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArICdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgLyoqXG4gICAgQWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuICBcbiAgICBAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXG4gICAgQHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAgQHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcbiAgICBAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXG4gICAgICAgIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcbiAgICAgICAgYW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuYWRkUm91dGUgPSBmdW5jdGlvbihwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIHtcbiAgICB2YXIgcm91dGU7XG4gICAgcm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKTtcbiAgICB0aGlzLl9yb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgcm91dGUuYWRkVG9BcGkoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICAgIEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLmFkZENvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25FbmRwb2ludHMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uLCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgZXhjbHVkZWRFbmRwb2ludHMsIG1ldGhvZHMsIG1ldGhvZHNPbkNvbGxlY3Rpb24sIHBhdGgsIHJvdXRlT3B0aW9ucztcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ107XG4gICAgbWV0aG9kc09uQ29sbGVjdGlvbiA9IFsncG9zdCcsICdnZXRBbGwnXTtcbiAgICBpZiAoY29sbGVjdGlvbiA9PT0gTWV0ZW9yLnVzZXJzKSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fdXNlckNvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl9jb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH1cbiAgICBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyB8fCB7fTtcbiAgICByb3V0ZU9wdGlvbnMgPSBvcHRpb25zLnJvdXRlT3B0aW9ucyB8fCB7fTtcbiAgICBleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgfHwgW107XG4gICAgcGF0aCA9IG9wdGlvbnMucGF0aCB8fCBjb2xsZWN0aW9uLl9uYW1lO1xuICAgIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24pICYmIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cykpIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfLmV4dGVuZChlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB2YXIgY29uZmlndXJlZEVuZHBvaW50LCBlbmRwb2ludE9wdGlvbnM7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwoZXhjbHVkZWRFbmRwb2ludHMsIG1ldGhvZCkgPCAwICYmIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdICE9PSBmYWxzZSkge1xuICAgICAgICAgIGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdO1xuICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludCA9IHt9O1xuICAgICAgICAgIF8uZWFjaChjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgZnVuY3Rpb24oYWN0aW9uLCBtZXRob2RUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlndXJlZEVuZHBvaW50W21ldGhvZFR5cGVdID0gXy5jaGFpbihhY3Rpb24pLmNsb25lKCkuZXh0ZW5kKGVuZHBvaW50T3B0aW9ucykudmFsdWUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLmV4dGVuZChlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLmFkZFJvdXRlKHBhdGgsIHJvdXRlT3B0aW9ucywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzKTtcbiAgICB0aGlzLmFkZFJvdXRlKHBhdGggKyBcIi86aWRcIiwgcm91dGVPcHRpb25zLCBlbnRpdHlSb3V0ZUVuZHBvaW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl9jb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUoc2VsZWN0b3IsIHtcbiAgICAgICAgICAgICAgJHNldDogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZShzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICB0aGlzLmJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0KHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcywgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICBBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5fdXNlckNvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZDtcbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZSh0aGlzLnVybFBhcmFtcy5pZCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgZW50aXR5SWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAoe1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCdcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXM7XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIHVzZXJzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5faW5pdEF1dGggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbG9nb3V0LCBzZWxmO1xuICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgLypcbiAgICAgIEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgdGhpcy5hZGRSb3V0ZSgnbG9naW4nLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlXG4gICAgfSwge1xuICAgICAgcG9zdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdXRoLCBlLCBleHRyYURhdGEsIHJlZiwgcmVmMSwgcmVzcG9uc2UsIHNlYXJjaFF1ZXJ5LCB1c2VyO1xuICAgICAgICB1c2VyID0ge307XG4gICAgICAgIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcikge1xuICAgICAgICAgIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlci5pbmRleE9mKCdAJykgPT09IC0xKSB7XG4gICAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lKSB7XG4gICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VybmFtZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMuZW1haWwpIHtcbiAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLmVtYWlsO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQodXNlciwgdGhpcy5ib2R5UGFyYW1zLnBhc3N3b3JkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogZS5lcnJvcixcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBlLnJlYXNvblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF1dGgudXNlcklkICYmIGF1dGguYXV0aFRva2VuKSB7XG4gICAgICAgICAgc2VhcmNoUXVlcnkgPSB7fTtcbiAgICAgICAgICBzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aC5hdXRoVG9rZW4pO1xuICAgICAgICAgIHRoaXMudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICdfaWQnOiBhdXRoLnVzZXJJZFxuICAgICAgICAgIH0sIHNlYXJjaFF1ZXJ5KTtcbiAgICAgICAgICB0aGlzLnVzZXJJZCA9IChyZWYgPSB0aGlzLnVzZXIpICE9IG51bGwgPyByZWYuX2lkIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIGRhdGE6IGF1dGhcbiAgICAgICAgfTtcbiAgICAgICAgZXh0cmFEYXRhID0gKHJlZjEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbikgIT0gbnVsbCA/IHJlZjEuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgICAgaWYgKGV4dHJhRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhdXRoVG9rZW4sIGV4dHJhRGF0YSwgaGFzaGVkVG9rZW4sIGluZGV4LCByZWYsIHJlc3BvbnNlLCB0b2tlbkZpZWxkTmFtZSwgdG9rZW5Mb2NhdGlvbiwgdG9rZW5QYXRoLCB0b2tlblJlbW92YWxRdWVyeSwgdG9rZW5Ub1JlbW92ZTtcbiAgICAgIGF1dGhUb2tlbiA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXTtcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICB0b2tlbkxvY2F0aW9uID0gc2VsZi5fY29uZmlnLmF1dGgudG9rZW47XG4gICAgICBpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgIHRva2VuUGF0aCA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgIHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoaW5kZXggKyAxKTtcbiAgICAgIHRva2VuVG9SZW1vdmUgPSB7fTtcbiAgICAgIHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW47XG4gICAgICB0b2tlblJlbW92YWxRdWVyeSA9IHt9O1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmU7XG4gICAgICBNZXRlb3IudXNlcnMudXBkYXRlKHRoaXMudXNlci5faWQsIHtcbiAgICAgICAgJHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5XG4gICAgICB9KTtcbiAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZXh0cmFEYXRhID0gKHJlZiA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZE91dCkgIT0gbnVsbCA/IHJlZi5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgaWYgKGV4dHJhRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH07XG5cbiAgICAvKlxuICAgICAgQWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICAgIEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBvdXQsIHRoZSBvbkxvZ2dlZE91dCBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICByZXR1cm4gdGhpcy5hZGRSb3V0ZSgnbG9nb3V0Jywge1xuICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlXG4gICAgfSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIik7XG4gICAgICAgIGNvbnNvbGUud2FybihcIiAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzL2lzc3Vlcy8xMDBcIik7XG4gICAgICAgIHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKTtcbiAgICAgIH0sXG4gICAgICBwb3N0OiBsb2dvdXRcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gUmVzdGl2dXM7XG5cbn0pKCk7XG5cblJlc3RpdnVzID0gdGhpcy5SZXN0aXZ1cztcbiIsImlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgQEFQSSA9IG5ldyBSZXN0aXZ1c1xyXG4gICAgICAgIGFwaVBhdGg6ICdzdGVlZG9zL2FwaS8nLFxyXG4gICAgICAgIHVzZURlZmF1bHRBdXRoOiB0cnVlXHJcbiAgICAgICAgcHJldHR5SnNvbjogdHJ1ZVxyXG4gICAgICAgIGVuYWJsZUNvcnM6IGZhbHNlXHJcbiAgICAgICAgZGVmYXVsdEhlYWRlcnM6XHJcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICB0aGlzLkFQSSA9IG5ldyBSZXN0aXZ1cyh7XG4gICAgYXBpUGF0aDogJ3N0ZWVkb3MvYXBpLycsXG4gICAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gICAgcHJldHR5SnNvbjogdHJ1ZSxcbiAgICBlbmFibGVDb3JzOiBmYWxzZSxcbiAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH1cbiAgfSk7XG59XG4iLCJCdXNib3kgPSByZXF1aXJlKCdidXNib3knKTtcclxuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcclxuXHJcbkpzb25Sb3V0ZXMucGFyc2VGaWxlcyA9IChyZXEsIHJlcywgbmV4dCkgLT5cclxuICAgIGZpbGVzID0gW107ICMgU3RvcmUgZmlsZXMgaW4gYW4gYXJyYXkgYW5kIHRoZW4gcGFzcyB0aGVtIHRvIHJlcXVlc3QuXHJcbiAgICBpbWFnZSA9IHt9OyAjIGNyYXRlIGFuIGltYWdlIG9iamVjdFxyXG5cclxuICAgIGlmIChyZXEubWV0aG9kID09IFwiUE9TVFwiKVxyXG4gICAgICBidXNib3kgPSBuZXcgQnVzYm95KHsgaGVhZGVyczogcmVxLmhlYWRlcnMgfSk7XHJcbiAgICAgIGJ1c2JveS5vbiBcImZpbGVcIiwgIChmaWVsZG5hbWUsIGZpbGUsIGZpbGVuYW1lLCBlbmNvZGluZywgbWltZXR5cGUpIC0+XHJcbiAgICAgICAgaW1hZ2UubWltZVR5cGUgPSBtaW1ldHlwZTtcclxuICAgICAgICBpbWFnZS5lbmNvZGluZyA9IGVuY29kaW5nO1xyXG4gICAgICAgIGltYWdlLmZpbGVuYW1lID0gZmlsZW5hbWU7XHJcblxyXG4gICAgICAgICMgYnVmZmVyIHRoZSByZWFkIGNodW5rc1xyXG4gICAgICAgIGJ1ZmZlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgZmlsZS5vbiAnZGF0YScsIChkYXRhKSAtPlxyXG4gICAgICAgICAgYnVmZmVycy5wdXNoKGRhdGEpO1xyXG5cclxuICAgICAgICBmaWxlLm9uICdlbmQnLCAoKSAtPlxyXG4gICAgICAgICAgIyBjb25jYXQgdGhlIGNodW5rc1xyXG4gICAgICAgICAgaW1hZ2UuZGF0YSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycyk7XHJcbiAgICAgICAgICAjIHB1c2ggdGhlIGltYWdlIG9iamVjdCB0byB0aGUgZmlsZSBhcnJheVxyXG4gICAgICAgICAgZmlsZXMucHVzaChpbWFnZSk7XHJcblxyXG5cclxuICAgICAgYnVzYm95Lm9uIFwiZmllbGRcIiwgKGZpZWxkbmFtZSwgdmFsdWUpIC0+XHJcbiAgICAgICAgcmVxLmJvZHlbZmllbGRuYW1lXSA9IHZhbHVlO1xyXG5cclxuICAgICAgYnVzYm95Lm9uIFwiZmluaXNoXCIsICAoKSAtPlxyXG4gICAgICAgICMgUGFzcyB0aGUgZmlsZSBhcnJheSB0b2dldGhlciB3aXRoIHRoZSByZXF1ZXN0XHJcbiAgICAgICAgcmVxLmZpbGVzID0gZmlsZXM7XHJcblxyXG4gICAgICAgIEZpYmVyICgpLT5cclxuICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAucnVuKCk7XHJcblxyXG4gICAgICAjIFBhc3MgcmVxdWVzdCB0byBidXNib3lcclxuICAgICAgcmVxLnBpcGUoYnVzYm95KTtcclxuXHJcbiAgICBlbHNlXHJcbiAgICAgIG5leHQoKTtcclxuXHJcblxyXG4jSnNvblJvdXRlcy5NaWRkbGV3YXJlLnVzZShKc29uUm91dGVzLnBhcnNlRmlsZXMpO1xyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblxyXG4gIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxyXG4gICAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXNcclxuXHJcbiAgICBpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxyXG5cclxuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XHJcbiAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX0sIChlcnIpIC0+XHJcbiAgICAgICAgZmlsZW5hbWUgPSByZXEuZmlsZXNbMF0uZmlsZW5hbWVcclxuXHJcbiAgICAgICAgaWYgW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKVxyXG4gICAgICAgICAgZmlsZW5hbWUgPSBcImltYWdlLVwiICsgbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdCgnWVlZWU1NRERISG1tc3MnKSArIFwiLlwiICsgZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKVxyXG5cclxuICAgICAgICBib2R5ID0gcmVxLmJvZHlcclxuICAgICAgICB0cnlcclxuICAgICAgICAgIGlmIGJvZHkgJiYgKGJvZHlbJ3VwbG9hZF9mcm9tJ10gaXMgXCJJRVwiIG9yIGJvZHlbJ3VwbG9hZF9mcm9tJ10gaXMgXCJub2RlXCIpXHJcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKVxyXG4gICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZmlsZW5hbWUpXHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIilcclxuXHJcbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5Wydvd25lcl9uYW1lJ10gJiYgYm9keVsnc3BhY2UnXSAmJiBib2R5WydpbnN0YW5jZSddICAmJiBib2R5WydhcHByb3ZlJ11cclxuICAgICAgICAgIHBhcmVudCA9ICcnXHJcbiAgICAgICAgICBtZXRhZGF0YSA9IHtvd25lcjpib2R5Wydvd25lciddLCBvd25lcl9uYW1lOmJvZHlbJ293bmVyX25hbWUnXSwgc3BhY2U6Ym9keVsnc3BhY2UnXSwgaW5zdGFuY2U6Ym9keVsnaW5zdGFuY2UnXSwgYXBwcm92ZTogYm9keVsnYXBwcm92ZSddLCBjdXJyZW50OiB0cnVlfVxyXG5cclxuICAgICAgICAgIGlmIGJvZHlbXCJpc19wcml2YXRlXCJdICYmIGJvZHlbXCJpc19wcml2YXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gXCJ0cnVlXCJcclxuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IHRydWVcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IGZhbHNlXHJcblxyXG4gICAgICAgICAgaWYgYm9keVsnbWFpbiddID09IFwidHJ1ZVwiXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLm1haW4gPSB0cnVlXHJcblxyXG4gICAgICAgICAgaWYgYm9keVsnaXNBZGRWZXJzaW9uJ10gJiYgYm9keVsncGFyZW50J11cclxuICAgICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J11cclxuICAgICAgICAgICMgZWxzZVxyXG4gICAgICAgICAgIyAgIGNvbGxlY3Rpb24uZmluZCh7J21ldGFkYXRhLmluc3RhbmNlJzogYm9keVsnaW5zdGFuY2UnXSwgJ21ldGFkYXRhLmN1cnJlbnQnIDogdHJ1ZX0pLmZvckVhY2ggKGMpIC0+XHJcbiAgICAgICAgICAjICAgICBpZiBjLm5hbWUoKSA9PSBmaWxlbmFtZVxyXG4gICAgICAgICAgIyAgICAgICBwYXJlbnQgPSBjLm1ldGFkYXRhLnBhcmVudFxyXG5cclxuICAgICAgICAgIGlmIHBhcmVudFxyXG4gICAgICAgICAgICByID0gY29sbGVjdGlvbi51cGRhdGUoeydtZXRhZGF0YS5wYXJlbnQnOiBwYXJlbnQsICdtZXRhZGF0YS5jdXJyZW50JyA6IHRydWV9LCB7JHVuc2V0IDogeydtZXRhZGF0YS5jdXJyZW50JyA6ICcnfX0pXHJcbiAgICAgICAgICAgIGlmIHJcclxuICAgICAgICAgICAgICBtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnRcclxuICAgICAgICAgICAgICBpZiBib2R5Wydsb2NrZWRfYnknXSAmJiBib2R5Wydsb2NrZWRfYnlfbmFtZSddXHJcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnkgPSBib2R5Wydsb2NrZWRfYnknXVxyXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5X25hbWUgPSBib2R5Wydsb2NrZWRfYnlfbmFtZSddXHJcblxyXG4gICAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxyXG4gICAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcblxyXG4gICAgICAgICAgICAgICMg5Yig6Zmk5ZCM5LiA5Liq55Sz6K+35Y2V5ZCM5LiA5Liq5q2l6aqk5ZCM5LiA5Liq5Lq65LiK5Lyg55qE6YeN5aSN55qE5paH5Lu2XHJcbiAgICAgICAgICAgICAgaWYgYm9keVtcIm92ZXJ3cml0ZVwiXSAmJiBib2R5W1wib3ZlcndyaXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gXCJ0cnVlXCJcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHsnbWV0YWRhdGEuaW5zdGFuY2UnOiBib2R5WydpbnN0YW5jZSddLCAnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LCAnbWV0YWRhdGEub3duZXInOiBib2R5Wydvd25lciddLCAnbWV0YWRhdGEuYXBwcm92ZSc6IGJvZHlbJ2FwcHJvdmUnXSwgJ21ldGFkYXRhLmN1cnJlbnQnOiB7JG5lOiB0cnVlfX0pXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxyXG4gICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG4gICAgICAgICAgICBmaWxlT2JqLnVwZGF0ZSh7JHNldDogeydtZXRhZGF0YS5wYXJlbnQnIDogZmlsZU9iai5faWR9fSlcclxuXHJcbiAgICAgICAgIyDlhbzlrrnogIHniYjmnKxcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxyXG5cclxuXHJcbiAgICAgICAgc2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZVxyXG4gICAgICAgIGlmICFzaXplXHJcbiAgICAgICAgICBzaXplID0gMTAyNFxyXG5cclxuICAgICAgICByZXNwID1cclxuICAgICAgICAgIHZlcnNpb25faWQ6IGZpbGVPYmouX2lkLFxyXG4gICAgICAgICAgc2l6ZTogc2l6ZVxyXG5cclxuICAgICAgICByZXMuc2V0SGVhZGVyKFwieC1hbXotdmVyc2lvbi1pZFwiLGZpbGVPYmouX2lkKTtcclxuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcclxuICAgICAgICByZXR1cm5cclxuICAgIGVsc2VcclxuICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XHJcbiAgICAgIHJlcy5lbmQoKTtcclxuXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcImRlbGV0ZVwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlc1xyXG5cclxuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xyXG4gIGlmIGlkXHJcbiAgICBmaWxlID0gY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiBpZCB9KVxyXG4gICAgaWYgZmlsZVxyXG4gICAgICBmaWxlLnJlbW92ZSgpXHJcbiAgICAgIHJlc3AgPSB7XHJcbiAgICAgICAgc3RhdHVzOiBcIk9LXCJcclxuICAgICAgfVxyXG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcclxuICAgICAgcmV0dXJuXHJcblxyXG4gIHJlcy5zdGF0dXNDb2RlID0gNDA0O1xyXG4gIHJlcy5lbmQoKTtcclxuXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xyXG5cclxuICByZXMuc3RhdHVzQ29kZSA9IDMwMjtcclxuICByZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9pbnN0YW5jZXMvXCIpICsgaWQgKyBcIj9kb3dubG9hZD0xXCJcclxuICByZXMuZW5kKCk7XHJcblxyXG5cclxuIyBNZXRlb3IubWV0aG9kc1xyXG5cclxuIyAgIHMzX3VwZ3JhZGU6IChtaW4sIG1heCkgLT5cclxuIyAgICAgY29uc29sZS5sb2coXCIvczMvdXBncmFkZVwiKVxyXG5cclxuIyAgICAgZnMgPSByZXF1aXJlKCdmcycpXHJcbiMgICAgIG1pbWUgPSByZXF1aXJlKCdtaW1lJylcclxuXHJcbiMgICAgIHJvb3RfcGF0aCA9IFwiL21udC9mYWtlczMvMTBcIlxyXG4jICAgICBjb25zb2xlLmxvZyhyb290X3BhdGgpXHJcbiMgICAgIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzXHJcblxyXG4jICAgICAjIOmBjeWOhmluc3RhbmNlIOaLvOWHuumZhOS7tui3r+W+hCDliLDmnKzlnLDmib7lr7nlupTmlofku7Yg5YiG5Lik56eN5oOF5Ya1IDEuL2ZpbGVuYW1lX3ZlcnNpb25JZCAyLi9maWxlbmFtZe+8m1xyXG4jICAgICBkZWFsX3dpdGhfdmVyc2lvbiA9IChyb290X3BhdGgsIHNwYWNlLCBpbnNfaWQsIHZlcnNpb24sIGF0dGFjaF9maWxlbmFtZSkgLT5cclxuIyAgICAgICBfcmV2ID0gdmVyc2lvbi5fcmV2XHJcbiMgICAgICAgaWYgKGNvbGxlY3Rpb24uZmluZCh7XCJfaWRcIjogX3Jldn0pLmNvdW50KCkgPjApXHJcbiMgICAgICAgICByZXR1cm5cclxuIyAgICAgICBjcmVhdGVkX2J5ID0gdmVyc2lvbi5jcmVhdGVkX2J5XHJcbiMgICAgICAgYXBwcm92ZSA9IHZlcnNpb24uYXBwcm92ZVxyXG4jICAgICAgIGZpbGVuYW1lID0gdmVyc2lvbi5maWxlbmFtZSB8fCBhdHRhY2hfZmlsZW5hbWU7XHJcbiMgICAgICAgbWltZV90eXBlID0gbWltZS5sb29rdXAoZmlsZW5hbWUpXHJcbiMgICAgICAgbmV3X3BhdGggPSByb290X3BhdGggKyBcIi9zcGFjZXMvXCIgKyBzcGFjZSArIFwiL3dvcmtmbG93L1wiICsgaW5zX2lkICsgXCIvXCIgKyBmaWxlbmFtZSArIFwiX1wiICsgX3JldlxyXG4jICAgICAgIG9sZF9wYXRoID0gcm9vdF9wYXRoICsgXCIvc3BhY2VzL1wiICsgc3BhY2UgKyBcIi93b3JrZmxvdy9cIiArIGluc19pZCArIFwiL1wiICsgZmlsZW5hbWVcclxuXHJcbiMgICAgICAgcmVhZEZpbGUgPSAoZnVsbF9wYXRoKSAtPlxyXG4jICAgICAgICAgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyBmdWxsX3BhdGhcclxuXHJcbiMgICAgICAgICBpZiBkYXRhXHJcbiMgICAgICAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xyXG4jICAgICAgICAgICBuZXdGaWxlLl9pZCA9IF9yZXY7XHJcbiMgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSB7b3duZXI6Y3JlYXRlZF9ieSwgc3BhY2U6c3BhY2UsIGluc3RhbmNlOmluc19pZCwgYXBwcm92ZTogYXBwcm92ZX07XHJcbiMgICAgICAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YSBkYXRhLCB7dHlwZTogbWltZV90eXBlfVxyXG4jICAgICAgICAgICBuZXdGaWxlLm5hbWUoZmlsZW5hbWUpXHJcbiMgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcbiMgICAgICAgICAgIGNvbnNvbGUubG9nKGZpbGVPYmouX2lkKVxyXG5cclxuIyAgICAgICB0cnlcclxuIyAgICAgICAgIG4gPSBmcy5zdGF0U3luYyBuZXdfcGF0aFxyXG4jICAgICAgICAgaWYgbiAmJiBuLmlzRmlsZSgpXHJcbiMgICAgICAgICAgIHJlYWRGaWxlIG5ld19wYXRoXHJcbiMgICAgICAgY2F0Y2ggZXJyb3JcclxuIyAgICAgICAgIHRyeVxyXG4jICAgICAgICAgICBvbGQgPSBmcy5zdGF0U3luYyBvbGRfcGF0aFxyXG4jICAgICAgICAgICBpZiBvbGQgJiYgb2xkLmlzRmlsZSgpXHJcbiMgICAgICAgICAgICAgcmVhZEZpbGUgb2xkX3BhdGhcclxuIyAgICAgICAgIGNhdGNoIGVycm9yXHJcbiMgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaWxlIG5vdCBmb3VuZDogXCIgKyBvbGRfcGF0aClcclxuXHJcblxyXG4jICAgICBjb3VudCA9IGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9fSkuY291bnQoKTtcclxuIyAgICAgY29uc29sZS5sb2coXCJhbGwgaW5zdGFuY2VzOiBcIiArIGNvdW50KVxyXG5cclxuIyAgICAgYiA9IG5ldyBEYXRlKClcclxuXHJcbiMgICAgIGkgPSBtaW5cclxuIyAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1wiYXR0YWNobWVudHMuY3VycmVudFwiOiB7JGV4aXN0czogdHJ1ZX19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIHNraXA6IG1pbiwgbGltaXQ6IG1heC1taW59KS5mb3JFYWNoIChpbnMpIC0+XHJcbiMgICAgICAgaSA9IGkgKyAxXHJcbiMgICAgICAgY29uc29sZS5sb2coaSArIFwiOlwiICsgaW5zLm5hbWUpXHJcbiMgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50c1xyXG4jICAgICAgIHNwYWNlID0gaW5zLnNwYWNlXHJcbiMgICAgICAgaW5zX2lkID0gaW5zLl9pZFxyXG4jICAgICAgIGF0dGFjaHMuZm9yRWFjaCAoYXR0KSAtPlxyXG4jICAgICAgICAgZGVhbF93aXRoX3ZlcnNpb24gcm9vdF9wYXRoLCBzcGFjZSwgaW5zX2lkLCBhdHQuY3VycmVudCwgYXR0LmZpbGVuYW1lXHJcbiMgICAgICAgICBpZiBhdHQuaGlzdG9yeXNcclxuIyAgICAgICAgICAgYXR0Lmhpc3RvcnlzLmZvckVhY2ggKGhpcykgLT5cclxuIyAgICAgICAgICAgICBkZWFsX3dpdGhfdmVyc2lvbiByb290X3BhdGgsIHNwYWNlLCBpbnNfaWQsIGhpcywgYXR0LmZpbGVuYW1lXHJcblxyXG4jICAgICBjb25zb2xlLmxvZyhuZXcgRGF0ZSgpIC0gYilcclxuXHJcbiMgICAgIHJldHVybiBcIm9rXCJcclxuIiwidmFyIEJ1c2JveSwgRmliZXI7XG5cbkJ1c2JveSA9IHJlcXVpcmUoJ2J1c2JveScpO1xuXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5Kc29uUm91dGVzLnBhcnNlRmlsZXMgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYnVzYm95LCBmaWxlcywgaW1hZ2U7XG4gIGZpbGVzID0gW107XG4gIGltYWdlID0ge307XG4gIGlmIChyZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgIGJ1c2JveSA9IG5ldyBCdXNib3koe1xuICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnNcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWxlXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkge1xuICAgICAgdmFyIGJ1ZmZlcnM7XG4gICAgICBpbWFnZS5taW1lVHlwZSA9IG1pbWV0eXBlO1xuICAgICAgaW1hZ2UuZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgICAgIGltYWdlLmZpbGVuYW1lID0gZmlsZW5hbWU7XG4gICAgICBidWZmZXJzID0gW107XG4gICAgICBmaWxlLm9uKCdkYXRhJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICByZXR1cm4gYnVmZmVycy5wdXNoKGRhdGEpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmlsZS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGltYWdlLmRhdGEgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xuICAgICAgICByZXR1cm4gZmlsZXMucHVzaChpbWFnZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWVsZFwiLCBmdW5jdGlvbihmaWVsZG5hbWUsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVxLmJvZHlbZmllbGRuYW1lXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpbmlzaFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuICAgICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfSkucnVuKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcS5waXBlKGJ1c2JveSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfVxufTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb2xsZWN0aW9uLCBuZXdGaWxlO1xuICAgIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzO1xuICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIHJldHVybiBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgdHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIGJvZHksIGUsIGZpbGVPYmosIGZpbGVuYW1lLCBtZXRhZGF0YSwgcGFyZW50LCByLCByZXNwLCBzaXplO1xuICAgICAgICBmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZTtcbiAgICAgICAgaWYgKFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICBmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgPSByZXEuYm9keTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJJRVwiIHx8IGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwibm9kZVwiKSkge1xuICAgICAgICAgICAgZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihmaWxlbmFtZSk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSk7XG4gICAgICAgIGlmIChib2R5ICYmIGJvZHlbJ293bmVyJ10gJiYgYm9keVsnb3duZXJfbmFtZSddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsnaW5zdGFuY2UnXSAmJiBib2R5WydhcHByb3ZlJ10pIHtcbiAgICAgICAgICBwYXJlbnQgPSAnJztcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIG93bmVyOiBib2R5Wydvd25lciddLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogYm9keVsnb3duZXJfbmFtZSddLFxuICAgICAgICAgICAgc3BhY2U6IGJvZHlbJ3NwYWNlJ10sXG4gICAgICAgICAgICBpbnN0YW5jZTogYm9keVsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgIGFwcHJvdmU6IGJvZHlbJ2FwcHJvdmUnXSxcbiAgICAgICAgICAgIGN1cnJlbnQ6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChib2R5W1wiaXNfcHJpdmF0ZVwiXSAmJiBib2R5W1wiaXNfcHJpdmF0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJvZHlbJ21haW4nXSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1haW4gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYm9keVsnaXNBZGRWZXJzaW9uJ10gJiYgYm9keVsncGFyZW50J10pIHtcbiAgICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICByID0gY29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LFxuICAgICAgICAgICAgICAnbWV0YWRhdGEuY3VycmVudCc6IHRydWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJHVuc2V0OiB7XG4gICAgICAgICAgICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiAnJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgICAgaWYgKGJvZHlbJ2xvY2tlZF9ieSddICYmIGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ10pIHtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnkgPSBib2R5Wydsb2NrZWRfYnknXTtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnlfbmFtZSA9IGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ107XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgICAgICAgIGlmIChib2R5W1wib3ZlcndyaXRlXCJdICYmIGJvZHlbXCJvdmVyd3JpdGVcIl0udG9Mb2NhbGVMb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLnJlbW92ZSh7XG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEuaW5zdGFuY2UnOiBib2R5WydpbnN0YW5jZSddLFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5vd25lcic6IGJvZHlbJ293bmVyJ10sXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEuYXBwcm92ZSc6IGJvZHlbJ2FwcHJvdmUnXSxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5jdXJyZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAkbmU6IHRydWVcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgICAgICBmaWxlT2JqLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogZmlsZU9iai5faWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBzaXplID0gZmlsZU9iai5vcmlnaW5hbC5zaXplO1xuICAgICAgICBpZiAoIXNpemUpIHtcbiAgICAgICAgICBzaXplID0gMTAyNDtcbiAgICAgICAgfVxuICAgICAgICByZXNwID0ge1xuICAgICAgICAgIHZlcnNpb25faWQ6IGZpbGVPYmouX2lkLFxuICAgICAgICAgIHNpemU6IHNpemVcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLnNldEhlYWRlcihcIngtYW16LXZlcnNpb24taWRcIiwgZmlsZU9iai5faWQpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJldHVybiByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcImRlbGV0ZVwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY29sbGVjdGlvbiwgZmlsZSwgaWQsIHJlc3A7XG4gIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzO1xuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xuICBpZiAoaWQpIHtcbiAgICBmaWxlID0gY29sbGVjdGlvbi5maW5kT25lKHtcbiAgICAgIF9pZDogaWRcbiAgICB9KTtcbiAgICBpZiAoZmlsZSkge1xuICAgICAgZmlsZS5yZW1vdmUoKTtcbiAgICAgIHJlc3AgPSB7XG4gICAgICAgIHN0YXR1czogXCJPS1wiXG4gICAgICB9O1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHJlcy5zdGF0dXNDb2RlID0gNDA0O1xuICByZXR1cm4gcmVzLmVuZCgpO1xufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBpZDtcbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcbiAgcmVzLnN0YXR1c0NvZGUgPSAzMDI7XG4gIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2luc3RhbmNlcy9cIikgKyBpZCArIFwiP2Rvd25sb2FkPTFcIik7XG4gIHJldHVybiByZXMuZW5kKCk7XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvcHVzaC9tZXNzYWdlXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuICAgIGlmIHJlcS5ib2R5Py5wdXNoVG9waWMgYW5kIHJlcS5ib2R5LnVzZXJJZHMgYW5kIHJlcS5ib2R5LmRhdGFcclxuICAgICAgICBtZXNzYWdlID0gXHJcbiAgICAgICAgICAgIGZyb206IFwic3RlZWRvc1wiXHJcbiAgICAgICAgICAgIHF1ZXJ5OlxyXG4gICAgICAgICAgICAgICAgYXBwTmFtZTogcmVxLmJvZHkucHVzaFRvcGljXHJcbiAgICAgICAgICAgICAgICB1c2VySWQ6IFxyXG4gICAgICAgICAgICAgICAgICAgIFwiJGluXCI6IHVzZXJJZHNcclxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGU/XHJcbiAgICAgICAgICAgIG1lc3NhZ2VbXCJ0aXRsZVwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZVxyXG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuYWxlcnQ/XHJcbiAgICAgICAgICAgIG1lc3NhZ2VbXCJ0ZXh0XCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydFxyXG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuYmFkZ2U/XHJcbiAgICAgICAgICAgIG1lc3NhZ2VbXCJiYWRnZVwiXSA9IHJlcS5ib2R5LmRhdGEuYmFkZ2UgKyBcIlwiXHJcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5zb3VuZD9cclxuICAgICAgICAgICAgbWVzc2FnZVtcInNvdW5kXCJdID0gcmVxLmJvZHkuZGF0YS5zb3VuZFxyXG4gICAgICAgICNpZiByZXEuYm9keS5kYXRhLmRhdGE/XHJcbiAgICAgICAgIyAgICBtZXNzYWdlW1wiZGF0YVwiXSA9IHJlcS5ib2R5LmRhdGEuZGF0YVxyXG4gICAgICAgIFB1c2guc2VuZCBtZXNzYWdlXHJcblxyXG4gICAgICAgIHJlcy5lbmQoXCJzdWNjZXNzXCIpO1xyXG5cclxuXHJcblxyXG5NZXRlb3IubWV0aG9kc1xyXG4gICAgcHVzaFNlbmQ6ICh0ZXh0LHRpdGxlLGJhZGdlLHVzZXJJZCkgLT5cclxuICAgICAgICBpZiAoIXVzZXJJZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIFB1c2guc2VuZFxyXG4gICAgICAgICAgICBmcm9tOiAnc3RlZWRvcycsXHJcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICAgICAgYmFkZ2U6IGJhZGdlLFxyXG4gICAgICAgICAgICBxdWVyeTogXHJcbiAgICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJJZFxyXG4gICAgICAgICAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXHJcbiIsIkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvcHVzaC9tZXNzYWdlXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBtZXNzYWdlLCByZWY7XG4gIGlmICgoKHJlZiA9IHJlcS5ib2R5KSAhPSBudWxsID8gcmVmLnB1c2hUb3BpYyA6IHZvaWQgMCkgJiYgcmVxLmJvZHkudXNlcklkcyAmJiByZXEuYm9keS5kYXRhKSB7XG4gICAgbWVzc2FnZSA9IHtcbiAgICAgIGZyb206IFwic3RlZWRvc1wiLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYXBwTmFtZTogcmVxLmJvZHkucHVzaFRvcGljLFxuICAgICAgICB1c2VySWQ6IHtcbiAgICAgICAgICBcIiRpblwiOiB1c2VySWRzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChyZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGUgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcInRpdGxlXCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlO1xuICAgIH1cbiAgICBpZiAocmVxLmJvZHkuZGF0YS5hbGVydCAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1widGV4dFwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnQ7XG4gICAgfVxuICAgIGlmIChyZXEuYm9keS5kYXRhLmJhZGdlICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJiYWRnZVwiXSA9IHJlcS5ib2R5LmRhdGEuYmFkZ2UgKyBcIlwiO1xuICAgIH1cbiAgICBpZiAocmVxLmJvZHkuZGF0YS5zb3VuZCAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1wic291bmRcIl0gPSByZXEuYm9keS5kYXRhLnNvdW5kO1xuICAgIH1cbiAgICBQdXNoLnNlbmQobWVzc2FnZSk7XG4gICAgcmV0dXJuIHJlcy5lbmQoXCJzdWNjZXNzXCIpO1xuICB9XG59KTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICBwdXNoU2VuZDogZnVuY3Rpb24odGV4dCwgdGl0bGUsIGJhZGdlLCB1c2VySWQpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gUHVzaC5zZW5kKHtcbiAgICAgIGZyb206ICdzdGVlZG9zJyxcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIHRleHQ6IHRleHQsXG4gICAgICBiYWRnZTogYmFkZ2UsXG4gICAgICBxdWVyeToge1xuICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
