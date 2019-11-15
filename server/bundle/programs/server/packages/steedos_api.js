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

},"aliyun_push.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_api/routes/aliyun_push.coffee                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ALY, Aliyun_push, HwPush, MiPush, Xinge;
ALY = require('aliyun-sdk');
Xinge = require('xinge');
HwPush = require('huawei-push');
MiPush = require('xiaomi-push');
Aliyun_push = {};

Aliyun_push.sendMessage = function (userTokens, notification, callback) {
  var ALYPUSH, XingeApp, aliyunTokens, androidMessage, data, huaweiTokens, miTokens, msg, noti, package_name, ref, ref1, ref2, ref3, tokenDataList, xingeTokens;

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
require("/node_modules/meteor/steedos:api/lib/restivus/auth.coffee");
require("/node_modules/meteor/steedos:api/lib/restivus/iron-router-error-to-response.js");
require("/node_modules/meteor/steedos:api/lib/restivus/route.coffee");
require("/node_modules/meteor/steedos:api/lib/restivus/restivus.coffee");
require("/node_modules/meteor/steedos:api/core.coffee");
require("/node_modules/meteor/steedos:api/routes/s3.coffee");
require("/node_modules/meteor/steedos:api/routes/push.coffee");
require("/node_modules/meteor/steedos:api/routes/aliyun_push.coffee");

/* Exports */
Package._define("steedos:api");

})();

//# sourceURL=meteor://💻app/packages/steedos_api.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3Jlc3RpdnVzL2F1dGguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmFwaS9saWIvcmVzdGl2dXMvaXJvbi1yb3V0ZXItZXJyb3ItdG8tcmVzcG9uc2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2xpYi9yZXN0aXZ1cy9yb3V0ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9yb3V0ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2xpYi9yZXN0aXZ1cy9yZXN0aXZ1cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9yZXN0aXZ1cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hbGl5dW5fcHVzaC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYnVzYm95IiwiY29va2llcyIsImdldFVzZXJRdWVyeVNlbGVjdG9yIiwidXNlclZhbGlkYXRvciIsIkF1dGgiLCJNYXRjaCIsIldoZXJlIiwidXNlciIsImNoZWNrIiwiaWQiLCJPcHRpb25hbCIsIlN0cmluZyIsInVzZXJuYW1lIiwiZW1haWwiLCJfIiwia2V5cyIsImxlbmd0aCIsIkVycm9yIiwibG9naW5XaXRoUGFzc3dvcmQiLCJwYXNzd29yZCIsImF1dGhUb2tlbiIsImF1dGhlbnRpY2F0aW5nVXNlciIsImF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yIiwiaGFzaGVkVG9rZW4iLCJwYXNzd29yZFZlcmlmaWNhdGlvbiIsInJlZiIsInNwYWNlX3VzZXJzIiwic3BhY2VzIiwiTWV0ZW9yIiwidXNlcnMiLCJmaW5kT25lIiwic2VydmljZXMiLCJBY2NvdW50cyIsIl9jaGVja1Bhc3N3b3JkIiwiZXJyb3IiLCJfZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbiIsIl9oYXNoU3RhbXBlZFRva2VuIiwiX2luc2VydEhhc2hlZExvZ2luVG9rZW4iLCJfaWQiLCJkYiIsImZpbmQiLCJmZXRjaCIsImVhY2giLCJzdSIsInNwYWNlIiwiaXNfcGFpZCIsImluZGV4T2YiLCJhZG1pbnMiLCJwdXNoIiwibmFtZSIsInRva2VuIiwidXNlcklkIiwiYWRtaW5TcGFjZXMiLCJlbnYiLCJwcm9jZXNzIiwiTk9ERV9FTlYiLCJpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSIsImVyciIsInJlcSIsInJlcyIsInN0YXR1c0NvZGUiLCJzdGF0dXMiLCJtc2ciLCJzdGFjayIsInRvU3RyaW5nIiwiY29uc29sZSIsImhlYWRlcnNTZW50Iiwic29ja2V0IiwiZGVzdHJveSIsInNldEhlYWRlciIsIkJ1ZmZlciIsImJ5dGVMZW5ndGgiLCJtZXRob2QiLCJlbmQiLCJzaGFyZSIsIlJvdXRlIiwiYXBpIiwicGF0aCIsIm9wdGlvbnMiLCJlbmRwb2ludHMxIiwiZW5kcG9pbnRzIiwicHJvdG90eXBlIiwiYWRkVG9BcGkiLCJhdmFpbGFibGVNZXRob2RzIiwiYWxsb3dlZE1ldGhvZHMiLCJmdWxsUGF0aCIsInJlamVjdGVkTWV0aG9kcyIsInNlbGYiLCJjb250YWlucyIsIl9jb25maWciLCJwYXRocyIsImV4dGVuZCIsImRlZmF1bHRPcHRpb25zRW5kcG9pbnQiLCJfcmVzb2x2ZUVuZHBvaW50cyIsIl9jb25maWd1cmVFbmRwb2ludHMiLCJmaWx0ZXIiLCJyZWplY3QiLCJhcGlQYXRoIiwiZW5kcG9pbnQiLCJKc29uUm91dGVzIiwiYWRkIiwiZG9uZUZ1bmMiLCJlbmRwb2ludENvbnRleHQiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZUluaXRpYXRlZCIsInVybFBhcmFtcyIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwicXVlcnkiLCJib2R5UGFyYW1zIiwiYm9keSIsInJlcXVlc3QiLCJyZXNwb25zZSIsImRvbmUiLCJfY2FsbEVuZHBvaW50IiwiZXJyb3IxIiwiaGVhZGVycyIsIl9yZXNwb25kIiwibWVzc2FnZSIsImpvaW4iLCJ0b1VwcGVyQ2FzZSIsImlzRnVuY3Rpb24iLCJhY3Rpb24iLCJyZWYxIiwicmVmMiIsInJvbGVSZXF1aXJlZCIsInVuaW9uIiwiaXNFbXB0eSIsImF1dGhSZXF1aXJlZCIsInNwYWNlUmVxdWlyZWQiLCJpbnZvY2F0aW9uIiwiX2F1dGhBY2NlcHRlZCIsIl9yb2xlQWNjZXB0ZWQiLCJfc3BhY2VBY2NlcHRlZCIsIkREUENvbW1vbiIsIk1ldGhvZEludm9jYXRpb24iLCJpc1NpbXVsYXRpb24iLCJjb25uZWN0aW9uIiwicmFuZG9tU2VlZCIsIm1ha2VScGNTZWVkIiwiRERQIiwiX0N1cnJlbnRJbnZvY2F0aW9uIiwid2l0aFZhbHVlIiwiY2FsbCIsIl9hdXRoZW50aWNhdGUiLCJhdXRoIiwidXNlclNlbGVjdG9yIiwic3BhY2VfdXNlcnNfY291bnQiLCJzcGFjZUlkIiwiY291bnQiLCJpbnRlcnNlY3Rpb24iLCJyb2xlcyIsImRlZmF1bHRIZWFkZXJzIiwiZGVsYXlJbk1pbGxpc2Vjb25kcyIsIm1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzIiwicmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28iLCJzZW5kUmVzcG9uc2UiLCJfbG93ZXJDYXNlS2V5cyIsIm1hdGNoIiwicHJldHR5SnNvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3cml0ZUhlYWQiLCJ3cml0ZSIsIk1hdGgiLCJyYW5kb20iLCJzZXRUaW1lb3V0Iiwib2JqZWN0IiwiY2hhaW4iLCJwYWlycyIsIm1hcCIsImF0dHIiLCJ0b0xvd2VyQ2FzZSIsInZhbHVlIiwiUmVzdGl2dXMiLCJpdGVtIiwiaSIsImwiLCJjb3JzSGVhZGVycyIsIl9yb3V0ZXMiLCJ1c2VEZWZhdWx0QXV0aCIsInZlcnNpb24iLCJfdXNlciIsIl9oYXNoTG9naW5Ub2tlbiIsImVuYWJsZUNvcnMiLCJzbGljZSIsImxhc3QiLCJfaW5pdEF1dGgiLCJ1c2VBdXRoIiwid2FybiIsImFkZFJvdXRlIiwicm91dGUiLCJhZGRDb2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsImNvbGxlY3Rpb25FbmRwb2ludHMiLCJjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMiLCJlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24iLCJlbnRpdHlSb3V0ZUVuZHBvaW50cyIsImV4Y2x1ZGVkRW5kcG9pbnRzIiwibWV0aG9kcyIsIm1ldGhvZHNPbkNvbGxlY3Rpb24iLCJyb3V0ZU9wdGlvbnMiLCJfdXNlckNvbGxlY3Rpb25FbmRwb2ludHMiLCJfY29sbGVjdGlvbkVuZHBvaW50cyIsIl9uYW1lIiwiY29uZmlndXJlZEVuZHBvaW50IiwiZW5kcG9pbnRPcHRpb25zIiwibWV0aG9kVHlwZSIsImNsb25lIiwiZ2V0IiwiZW50aXR5Iiwic2VsZWN0b3IiLCJkYXRhIiwicHV0IiwiZW50aXR5SXNVcGRhdGVkIiwidXBkYXRlIiwiJHNldCIsInJlbW92ZSIsInBvc3QiLCJlbnRpdHlJZCIsImluc2VydCIsImdldEFsbCIsImVudGl0aWVzIiwiZmllbGRzIiwicHJvZmlsZSIsImNyZWF0ZVVzZXIiLCJsb2dvdXQiLCJlIiwiZXh0cmFEYXRhIiwic2VhcmNoUXVlcnkiLCJyZWFzb24iLCJvbkxvZ2dlZEluIiwiZXh0cmEiLCJpbmRleCIsInRva2VuRmllbGROYW1lIiwidG9rZW5Mb2NhdGlvbiIsInRva2VuUGF0aCIsInRva2VuUmVtb3ZhbFF1ZXJ5IiwidG9rZW5Ub1JlbW92ZSIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwiJHB1bGwiLCJvbkxvZ2dlZE91dCIsImlzU2VydmVyIiwiQVBJIiwiQnVzYm95IiwiRmliZXIiLCJyZXF1aXJlIiwicGFyc2VGaWxlcyIsIm5leHQiLCJmaWxlcyIsImltYWdlIiwib24iLCJmaWVsZG5hbWUiLCJmaWxlIiwiZmlsZW5hbWUiLCJlbmNvZGluZyIsIm1pbWV0eXBlIiwiYnVmZmVycyIsIm1pbWVUeXBlIiwiY29uY2F0IiwicnVuIiwicGlwZSIsIm5ld0ZpbGUiLCJjZnMiLCJpbnN0YW5jZXMiLCJGUyIsIkZpbGUiLCJhdHRhY2hEYXRhIiwidHlwZSIsImZpbGVPYmoiLCJtZXRhZGF0YSIsInBhcmVudCIsInIiLCJyZXNwIiwic2l6ZSIsImluY2x1ZGVzIiwibW9tZW50IiwiRGF0ZSIsImZvcm1hdCIsInNwbGl0IiwicG9wIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwicmVwbGFjZSIsIm93bmVyIiwib3duZXJfbmFtZSIsImluc3RhbmNlIiwiYXBwcm92ZSIsImN1cnJlbnQiLCJ0b0xvY2FsZUxvd2VyQ2FzZSIsImlzX3ByaXZhdGUiLCJtYWluIiwiJHVuc2V0IiwibG9ja2VkX2J5IiwibG9ja2VkX2J5X25hbWUiLCIkbmUiLCJvcmlnaW5hbCIsInZlcnNpb25faWQiLCJTdGVlZG9zIiwiYWJzb2x1dGVVcmwiLCJwdXNoVG9waWMiLCJ1c2VySWRzIiwiZnJvbSIsImFwcE5hbWUiLCJhbGVydFRpdGxlIiwiYWxlcnQiLCJiYWRnZSIsInNvdW5kIiwiUHVzaCIsInNlbmQiLCJwdXNoU2VuZCIsInRleHQiLCJ0aXRsZSIsIkFMWSIsIkFsaXl1bl9wdXNoIiwiSHdQdXNoIiwiTWlQdXNoIiwiWGluZ2UiLCJzZW5kTWVzc2FnZSIsInVzZXJUb2tlbnMiLCJub3RpZmljYXRpb24iLCJjYWxsYmFjayIsIkFMWVBVU0giLCJYaW5nZUFwcCIsImFsaXl1blRva2VucyIsImFuZHJvaWRNZXNzYWdlIiwiaHVhd2VpVG9rZW5zIiwibWlUb2tlbnMiLCJub3RpIiwicGFja2FnZV9uYW1lIiwicmVmMyIsInRva2VuRGF0YUxpc3QiLCJ4aW5nZVRva2VucyIsImRlYnVnIiwibG9nIiwiQXJyYXkiLCJmb3JFYWNoIiwidXNlclRva2VuIiwiYXJyIiwic2V0dGluZ3MiLCJhbGl5dW4iLCJQVVNIIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJhcGlWZXJzaW9uIiwiQXBwS2V5IiwiYXBwS2V5IiwiVGFyZ2V0IiwiVGFyZ2V0VmFsdWUiLCJUaXRsZSIsIlN1bW1hcnkiLCJwdXNoTm90aWNlVG9BbmRyb2lkIiwieGluZ2UiLCJhY2Nlc3NJZCIsInNlY3JldEtleSIsIkFuZHJvaWRNZXNzYWdlIiwiTUVTU0FHRV9UWVBFX05PVElGSUNBVElPTiIsImNvbnRlbnQiLCJzdHlsZSIsIlN0eWxlIiwiQ2xpY2tBY3Rpb24iLCJ0IiwicHVzaFRvU2luZ2xlRGV2aWNlIiwiaHVhd2VpIiwiYXBwUGtnTmFtZSIsInBheWxvYWQiLCJIdWF3ZWlQdXNoIiwiY29uZmlnIiwiYXBwSWQiLCJhcHBTZWNyZXQiLCJzZW5kTWFueSIsIm1pIiwiTWVzc2FnZSIsImRlc2NyaXB0aW9uIiwiTm90aWZpY2F0aW9uIiwicHJvZHVjdGlvbiIsInJlZ2lkIiwic3RhcnR1cCIsInJlZjQiLCJyZWY1IiwicmVmNiIsImNyb24iLCJwdXNoX2ludGVydmFsIiwia2VlcE5vdGlmaWNhdGlvbnMiLCJzZW5kSW50ZXJ2YWwiLCJzZW5kQmF0Y2hTaXplIiwiYXBuIiwia2V5RGF0YSIsImNlcnREYXRhIiwiZ2NtIiwicHJvamVjdE51bWJlciIsImFwaUtleSIsIkNvbmZpZ3VyZSIsInNlbmRHQ00iLCJvbGRfc2VuZEdDTSIsInNlbmRBbGl5dW4iLCJ0ZXN0IiwiT2JqZWN0IiwicmVzdWx0IiwiY2Fub25pY2FsX2lkcyIsIm9sZFRva2VuIiwibmV3VG9rZW4iLCJyZXN1bHRzIiwicmVnaXN0cmF0aW9uX2lkIiwiX3JlcGxhY2VUb2tlbiIsImZhaWx1cmUiLCJfcmVtb3ZlVG9rZW4iLCJnY21Ub2tlbnMiLCJvbGRfc2VuZEFQTiIsInNlbmRBUE4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBQ3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixnQkFBYyxTQURFO0FBRWhCSSxRQUFNLEVBQUUsVUFGUTtBQUdoQkMsU0FBTyxFQUFFLFNBSE87QUFJaEIsU0FBTyxTQUpTO0FBS2hCLFNBQU8sVUFMUztBQU1oQixhQUFXLFVBTks7QUFPaEIsV0FBUyxTQVBPO0FBUWhCLGlCQUFlLFdBUkM7QUFTaEIsaUJBQWU7QUFUQyxDQUFELEVBVWIsYUFWYSxDQUFoQixDOzs7Ozs7Ozs7Ozs7QUNEQSxJQUFBQyxvQkFBQSxFQUFBQyxhQUFBO0FBQUEsS0FBQ0MsSUFBRCxVQUFDQSxJQUFELEdBQVUsRUFBVixFLENBRUE7OztBQUdBRCxnQkFBZ0JFLE1BQU1DLEtBQU4sQ0FBWSxVQUFDQyxJQUFEO0FBQzFCQyxRQUFNRCxJQUFOLEVBQ0U7QUFBQUUsUUFBSUosTUFBTUssUUFBTixDQUFlQyxNQUFmLENBQUo7QUFDQUMsY0FBVVAsTUFBTUssUUFBTixDQUFlQyxNQUFmLENBRFY7QUFFQUUsV0FBT1IsTUFBTUssUUFBTixDQUFlQyxNQUFmO0FBRlAsR0FERjs7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YWNrYWdlcy9zdGVlZG9zX2FwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHQnYWxpeXVuLXNkayc6ICc+PTEuOS4yJyxcblx0YnVzYm95OiBcIj49MC4yLjEzXCIsXG5cdGNvb2tpZXM6IFwiPj0wLjYuMlwiLFxuXHQnY3N2JzogXCI+PTUuMS4yXCIsXG5cdCd1cmwnOiAnPj0wLjEwLjAnLFxuXHQncmVxdWVzdCc6ICc+PTIuODEuMCcsXG5cdCd4aW5nZSc6ICc+PTEuMS4zJyxcblx0J2h1YXdlaS1wdXNoJzogJz49MC4wLjYtMCcsXG5cdCd4aWFvbWktcHVzaCc6ICc+PTAuNC41J1xufSwgJ3N0ZWVkb3M6YXBpJyk7IiwiQEF1dGggb3I9IHt9XHJcblxyXG4jIyNcclxuICBBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXHJcbiMjI1xyXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUgKHVzZXIpIC0+XHJcbiAgY2hlY2sgdXNlcixcclxuICAgIGlkOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuICAgIHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcclxuXHJcbiAgaWYgXy5rZXlzKHVzZXIpLmxlbmd0aCBpcyBub3QgMVxyXG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yICdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJ1xyXG5cclxuICByZXR1cm4gdHJ1ZVxyXG5cclxuXHJcbiMjI1xyXG4gIFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcclxuIyMjXHJcbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gKHVzZXIpIC0+XHJcbiAgaWYgdXNlci5pZFxyXG4gICAgcmV0dXJuIHsnX2lkJzogdXNlci5pZH1cclxuICBlbHNlIGlmIHVzZXIudXNlcm5hbWVcclxuICAgIHJldHVybiB7J3VzZXJuYW1lJzogdXNlci51c2VybmFtZX1cclxuICBlbHNlIGlmIHVzZXIuZW1haWxcclxuICAgIHJldHVybiB7J2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbH1cclxuXHJcbiAgIyBXZSBzaG91bGRuJ3QgYmUgaGVyZSBpZiB0aGUgdXNlciBvYmplY3Qgd2FzIHByb3Blcmx5IHZhbGlkYXRlZFxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcidcclxuXHJcblxyXG4jIyNcclxuICBMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcclxuIyMjXHJcbkBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkID0gKHVzZXIsIHBhc3N3b3JkKSAtPlxyXG4gIGlmIG5vdCB1c2VyIG9yIG5vdCBwYXNzd29yZFxyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcblxyXG4gICMgVmFsaWRhdGUgdGhlIGxvZ2luIGlucHV0IHR5cGVzXHJcbiAgY2hlY2sgdXNlciwgdXNlclZhbGlkYXRvclxyXG4gIGNoZWNrIHBhc3N3b3JkLCBTdHJpbmdcclxuXHJcbiAgIyBSZXRyaWV2ZSB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxyXG4gIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcilcclxuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvcilcclxuXHJcbiAgaWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlclxyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXHJcbiAgaWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcz8ucGFzc3dvcmRcclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuICAjIEF1dGhlbnRpY2F0ZSB0aGUgdXNlcidzIHBhc3N3b3JkXHJcbiAgcGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCBhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkXHJcbiAgaWYgcGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3JcclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xyXG5cclxuICAjIEFkZCBhIG5ldyBhdXRoIHRva2VuIHRvIHRoZSB1c2VyJ3MgYWNjb3VudFxyXG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcclxuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuIGF1dGhUb2tlblxyXG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuXHJcblxyXG4gIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aGVudGljYXRpbmdVc2VyLl9pZH0pLmZldGNoKClcclxuICBzcGFjZXMgPSBbXVxyXG4gIF8uZWFjaCBzcGFjZV91c2VycywgKHN1KS0+XHJcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHN1LnNwYWNlKVxyXG4gICAgIyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXHJcbiAgICBpZiBzcGFjZT8uaXNfcGFpZCBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcik+PTBcclxuICAgICAgc3BhY2VzLnB1c2hcclxuICAgICAgICBfaWQ6IHNwYWNlLl9pZFxyXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcclxuICByZXR1cm4ge2F1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLCB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGFkbWluU3BhY2VzOiBzcGFjZXN9XHJcbiIsInZhciBnZXRVc2VyUXVlcnlTZWxlY3RvciwgdXNlclZhbGlkYXRvcjtcblxudGhpcy5BdXRoIHx8ICh0aGlzLkF1dGggPSB7fSk7XG5cblxuLypcbiAgQSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxuICovXG5cbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZShmdW5jdGlvbih1c2VyKSB7XG4gIGNoZWNrKHVzZXIsIHtcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKVxuICB9KTtcbiAgaWYgKF8ua2V5cyh1c2VyKS5sZW5ndGggPT09ICExKSB7XG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yKCdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJyk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuXG4vKlxuICBSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXG4gKi9cblxuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSBmdW5jdGlvbih1c2VyKSB7XG4gIGlmICh1c2VyLmlkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdfaWQnOiB1c2VyLmlkXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWVcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIuZW1haWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbFxuICAgIH07XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJyk7XG59O1xuXG5cbi8qXG4gIExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuICovXG5cbnRoaXMuQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3N3b3JkKSB7XG4gIHZhciBhdXRoVG9rZW4sIGF1dGhlbnRpY2F0aW5nVXNlciwgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IsIGhhc2hlZFRva2VuLCBwYXNzd29yZFZlcmlmaWNhdGlvbiwgcmVmLCBzcGFjZV91c2Vycywgc3BhY2VzO1xuICBpZiAoIXVzZXIgfHwgIXBhc3N3b3JkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBjaGVjayh1c2VyLCB1c2VyVmFsaWRhdG9yKTtcbiAgY2hlY2socGFzc3dvcmQsIFN0cmluZyk7XG4gIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcik7XG4gIGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKTtcbiAgaWYgKCFhdXRoZW50aWNhdGluZ1VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGlmICghKChyZWYgPSBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXMpICE9IG51bGwgPyByZWYucGFzc3dvcmQgOiB2b2lkIDApKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmQpO1xuICBpZiAocGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKCk7XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4oYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW4pO1xuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWRcbiAgfSkuZmV0Y2goKTtcbiAgc3BhY2VzID0gW107XG4gIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24oc3UpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSk7XG4gICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcikgPj0gMCkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHtcbiAgICAgICAgX2lkOiBzcGFjZS5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7XG4gICAgYXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sXG4gICAgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLFxuICAgIGFkbWluU3BhY2VzOiBzcGFjZXNcbiAgfTtcbn07XG4iLCIvLyBXZSBuZWVkIGEgZnVuY3Rpb24gdGhhdCB0cmVhdHMgdGhyb3duIGVycm9ycyBleGFjdGx5IGxpa2UgSXJvbiBSb3V0ZXIgd291bGQuXHJcbi8vIFRoaXMgZmlsZSBpcyB3cml0dGVuIGluIEphdmFTY3JpcHQgdG8gZW5hYmxlIGNvcHktcGFzdGluZyBJcm9uIFJvdXRlciBjb2RlLlxyXG5cclxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMM1xyXG52YXIgZW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcclxuXHJcbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDQ3XHJcbmlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlID0gZnVuY3Rpb24gKGVyciwgcmVxLCByZXMpIHtcclxuICBpZiAocmVzLnN0YXR1c0NvZGUgPCA0MDApXHJcbiAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcclxuXHJcbiAgaWYgKGVyci5zdGF0dXMpXHJcbiAgICByZXMuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXM7XHJcblxyXG4gIGlmIChlbnYgPT09ICdkZXZlbG9wbWVudCcpXHJcbiAgICBtc2cgPSAoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKSArICdcXG4nO1xyXG4gIGVsc2VcclxuICAgIC8vWFhYIGdldCB0aGlzIGZyb20gc3RhbmRhcmQgZGljdCBvZiBlcnJvciBtZXNzYWdlcz9cclxuICAgIG1zZyA9ICdTZXJ2ZXIgZXJyb3IuJztcclxuXHJcbiAgY29uc29sZS5lcnJvcihlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCkpO1xyXG5cclxuICBpZiAocmVzLmhlYWRlcnNTZW50KVxyXG4gICAgcmV0dXJuIHJlcS5zb2NrZXQuZGVzdHJveSgpO1xyXG5cclxuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJyk7XHJcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBCdWZmZXIuYnl0ZUxlbmd0aChtc2cpKTtcclxuICBpZiAocmVxLm1ldGhvZCA9PT0gJ0hFQUQnKVxyXG4gICAgcmV0dXJuIHJlcy5lbmQoKTtcclxuICByZXMuZW5kKG1zZyk7XHJcbiAgcmV0dXJuO1xyXG59XHJcbiIsImNsYXNzIHNoYXJlLlJvdXRlXHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQGFwaSwgQHBhdGgsIEBvcHRpb25zLCBAZW5kcG9pbnRzKSAtPlxyXG4gICAgIyBDaGVjayBpZiBvcHRpb25zIHdlcmUgcHJvdmlkZWRcclxuICAgIGlmIG5vdCBAZW5kcG9pbnRzXHJcbiAgICAgIEBlbmRwb2ludHMgPSBAb3B0aW9uc1xyXG4gICAgICBAb3B0aW9ucyA9IHt9XHJcblxyXG5cclxuICBhZGRUb0FwaTogZG8gLT5cclxuICAgIGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddXHJcblxyXG4gICAgcmV0dXJuIC0+XHJcbiAgICAgIHNlbGYgPSB0aGlzXHJcblxyXG4gICAgICAjIFRocm93IGFuIGVycm9yIGlmIGEgcm91dGUgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCBhdCB0aGlzIHBhdGhcclxuICAgICAgIyBUT0RPOiBDaGVjayBmb3IgY29sbGlzaW9ucyB3aXRoIHBhdGhzIHRoYXQgZm9sbG93IHNhbWUgcGF0dGVybiB3aXRoIGRpZmZlcmVudCBwYXJhbWV0ZXIgbmFtZXNcclxuICAgICAgaWYgXy5jb250YWlucyBAYXBpLl9jb25maWcucGF0aHMsIEBwYXRoXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IGFkZCBhIHJvdXRlIGF0IGFuIGV4aXN0aW5nIHBhdGg6ICN7QHBhdGh9XCJcclxuXHJcbiAgICAgICMgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgT1BUSU9OUyBlbmRwb2ludCB3aXRoIG91ciBvd25cclxuICAgICAgQGVuZHBvaW50cyA9IF8uZXh0ZW5kIG9wdGlvbnM6IEBhcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50LCBAZW5kcG9pbnRzXHJcblxyXG4gICAgICAjIENvbmZpZ3VyZSBlYWNoIGVuZHBvaW50IG9uIHRoaXMgcm91dGVcclxuICAgICAgQF9yZXNvbHZlRW5kcG9pbnRzKClcclxuICAgICAgQF9jb25maWd1cmVFbmRwb2ludHMoKVxyXG5cclxuICAgICAgIyBBZGQgdG8gb3VyIGxpc3Qgb2YgZXhpc3RpbmcgcGF0aHNcclxuICAgICAgQGFwaS5fY29uZmlnLnBhdGhzLnB1c2ggQHBhdGhcclxuXHJcbiAgICAgIGFsbG93ZWRNZXRob2RzID0gXy5maWx0ZXIgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cclxuICAgICAgICBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcclxuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cclxuICAgICAgICBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcclxuXHJcbiAgICAgICMgU2V0dXAgZW5kcG9pbnRzIG9uIHJvdXRlXHJcbiAgICAgIGZ1bGxQYXRoID0gQGFwaS5fY29uZmlnLmFwaVBhdGggKyBAcGF0aFxyXG4gICAgICBfLmVhY2ggYWxsb3dlZE1ldGhvZHMsIChtZXRob2QpIC0+XHJcbiAgICAgICAgZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdXHJcbiAgICAgICAgSnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxyXG4gICAgICAgICAgIyBBZGQgZnVuY3Rpb24gdG8gZW5kcG9pbnQgY29udGV4dCBmb3IgaW5kaWNhdGluZyBhIHJlc3BvbnNlIGhhcyBiZWVuIGluaXRpYXRlZCBtYW51YWxseVxyXG4gICAgICAgICAgcmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZVxyXG4gICAgICAgICAgZG9uZUZ1bmMgPSAtPlxyXG4gICAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IHRydWVcclxuXHJcbiAgICAgICAgICBlbmRwb2ludENvbnRleHQgPVxyXG4gICAgICAgICAgICB1cmxQYXJhbXM6IHJlcS5wYXJhbXNcclxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeVxyXG4gICAgICAgICAgICBib2R5UGFyYW1zOiByZXEuYm9keVxyXG4gICAgICAgICAgICByZXF1ZXN0OiByZXFcclxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlc1xyXG4gICAgICAgICAgICBkb25lOiBkb25lRnVuY1xyXG4gICAgICAgICAgIyBBZGQgZW5kcG9pbnQgY29uZmlnIG9wdGlvbnMgdG8gY29udGV4dFxyXG4gICAgICAgICAgXy5leHRlbmQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG5cclxuICAgICAgICAgICMgUnVuIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRcclxuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IG51bGxcclxuICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG4gICAgICAgICAgY2F0Y2ggZXJyb3JcclxuICAgICAgICAgICAgIyBEbyBleGFjdGx5IHdoYXQgSXJvbiBSb3V0ZXIgd291bGQgaGF2ZSBkb25lLCB0byBhdm9pZCBjaGFuZ2luZyB0aGUgQVBJXHJcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgIGlmIHJlc3BvbnNlSW5pdGlhdGVkXHJcbiAgICAgICAgICAgICMgRW5zdXJlIHRoZSByZXNwb25zZSBpcyBwcm9wZXJseSBjb21wbGV0ZWRcclxuICAgICAgICAgICAgcmVzLmVuZCgpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBpZiByZXMuaGVhZGVyc1NlbnRcclxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXHJcbiAgICAgICAgICAgIGVsc2UgaWYgcmVzcG9uc2VEYXRhIGlzIG51bGwgb3IgcmVzcG9uc2VEYXRhIGlzIHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogI3ttZXRob2R9ICN7ZnVsbFBhdGh9XCJcclxuXHJcbiAgICAgICAgICAjIEdlbmVyYXRlIGFuZCByZXR1cm4gdGhlIGh0dHAgcmVzcG9uc2UsIGhhbmRsaW5nIHRoZSBkaWZmZXJlbnQgZW5kcG9pbnQgcmVzcG9uc2UgdHlwZXNcclxuICAgICAgICAgIGlmIHJlc3BvbnNlRGF0YS5ib2R5IGFuZCAocmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUgb3IgcmVzcG9uc2VEYXRhLmhlYWRlcnMpXHJcbiAgICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGFcclxuXHJcbiAgICAgIF8uZWFjaCByZWplY3RlZE1ldGhvZHMsIChtZXRob2QpIC0+XHJcbiAgICAgICAgSnNvblJvdXRlcy5hZGQgbWV0aG9kLCBmdWxsUGF0aCwgKHJlcSwgcmVzKSAtPlxyXG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xyXG4gICAgICAgICAgaGVhZGVycyA9ICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxyXG4gICAgICAgICAgc2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YSwgNDA1LCBoZWFkZXJzXHJcblxyXG5cclxuICAjIyNcclxuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxyXG4gICAgZnVuY3Rpb25cclxuXHJcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cclxuICAjIyNcclxuICBfcmVzb2x2ZUVuZHBvaW50czogLT5cclxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSAtPlxyXG4gICAgICBpZiBfLmlzRnVuY3Rpb24oZW5kcG9pbnQpXHJcbiAgICAgICAgZW5kcG9pbnRzW21ldGhvZF0gPSB7YWN0aW9uOiBlbmRwb2ludH1cclxuICAgIHJldHVyblxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XHJcbiAgICBiZSBjb25maWd1cmVkIGRpcmVjdGx5IG9uIHRoZSBlbmRwb2ludClcclxuXHJcbiAgICBBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxyXG4gICAgZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcclxuICAgIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxyXG5cclxuICAgIEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxyXG4gICAgYWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcclxuICAgIHJlc3BlY3RpdmVseS5cclxuXHJcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cclxuICAgIEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcclxuICAjIyNcclxuICBfY29uZmlndXJlRW5kcG9pbnRzOiAtPlxyXG4gICAgXy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kKSAtPlxyXG4gICAgICBpZiBtZXRob2QgaXNudCAnb3B0aW9ucydcclxuICAgICAgICAjIENvbmZpZ3VyZSBhY2NlcHRhYmxlIHJvbGVzXHJcbiAgICAgICAgaWYgbm90IEBvcHRpb25zPy5yb2xlUmVxdWlyZWRcclxuICAgICAgICAgIEBvcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdXHJcbiAgICAgICAgaWYgbm90IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxyXG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW11cclxuICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBfLnVuaW9uIGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgQG9wdGlvbnMucm9sZVJlcXVpcmVkXHJcbiAgICAgICAgIyBNYWtlIGl0IGVhc2llciB0byBjaGVjayBpZiBubyByb2xlcyBhcmUgcmVxdWlyZWRcclxuICAgICAgICBpZiBfLmlzRW1wdHkgZW5kcG9pbnQucm9sZVJlcXVpcmVkXHJcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZVxyXG5cclxuICAgICAgICAjIENvbmZpZ3VyZSBhdXRoIHJlcXVpcmVtZW50XHJcbiAgICAgICAgaWYgZW5kcG9pbnQuYXV0aFJlcXVpcmVkIGlzIHVuZGVmaW5lZFxyXG4gICAgICAgICAgaWYgQG9wdGlvbnM/LmF1dGhSZXF1aXJlZCBvciBlbmRwb2ludC5yb2xlUmVxdWlyZWRcclxuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSBmYWxzZVxyXG5cclxuICAgICAgICBpZiBAb3B0aW9ucz8uc3BhY2VSZXF1aXJlZFxyXG4gICAgICAgICAgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCA9IEBvcHRpb25zLnNwYWNlUmVxdWlyZWRcclxuICAgICAgICByZXR1cm5cclxuICAgICwgdGhpc1xyXG4gICAgcmV0dXJuXHJcblxyXG5cclxuICAjIyNcclxuICAgIEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcclxuXHJcbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcclxuICAjIyNcclxuICBfY2FsbEVuZHBvaW50OiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuICAgICMgQ2FsbCB0aGUgZW5kcG9pbnQgaWYgYXV0aGVudGljYXRpb24gZG9lc24ndCBmYWlsXHJcbiAgICBpZiBAX2F1dGhBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XHJcbiAgICAgIGlmIEBfcm9sZUFjY2VwdGVkIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcclxuICAgICAgICBpZiBAX3NwYWNlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxyXG4gICAgICAgICAgI2VuZHBvaW50LmFjdGlvbi5jYWxsIGVuZHBvaW50Q29udGV4dFxyXG4gICAgICAgICAgaW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvblxyXG4gICAgICAgICAgICBpc1NpbXVsYXRpb246IHRydWUsXHJcbiAgICAgICAgICAgIHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcclxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcclxuICAgICAgICAgICAgcmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcclxuICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlIGludm9jYXRpb24sIC0+XHJcbiAgICAgICAgICAgIHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHN0YXR1c0NvZGU6IDQwM1xyXG4gICAgICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLid9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBzdGF0dXNDb2RlOiA0MDNcclxuICAgICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nfVxyXG4gICAgZWxzZVxyXG4gICAgICBzdGF0dXNDb2RlOiA0MDFcclxuICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLid9XHJcblxyXG5cclxuICAjIyNcclxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgZ2l2ZW4gZW5kcG9pbnQgaWYgcmVxdWlyZWRcclxuXHJcbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXHJcbiAgICBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcclxuICAgIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxyXG5cclxuICAgIEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcclxuICAjIyNcclxuICBfYXV0aEFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuICAgIGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZFxyXG4gICAgICBAX2F1dGhlbnRpY2F0ZSBlbmRwb2ludENvbnRleHRcclxuICAgIGVsc2UgdHJ1ZVxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBWZXJpZnkgdGhlIHJlcXVlc3QgaXMgYmVpbmcgbWFkZSBieSBhbiBhY3RpdmVseSBsb2dnZWQgaW4gdXNlclxyXG5cclxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cclxuXHJcbiAgICBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuICAjIyNcclxuICBfYXV0aGVudGljYXRlOiAoZW5kcG9pbnRDb250ZXh0KSAtPlxyXG4gICAgIyBHZXQgYXV0aCBpbmZvXHJcbiAgICBhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcclxuXHJcbiAgICAjIEdldCB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxyXG4gICAgaWYgYXV0aD8udXNlcklkIGFuZCBhdXRoPy50b2tlbiBhbmQgbm90IGF1dGg/LnVzZXJcclxuICAgICAgdXNlclNlbGVjdG9yID0ge31cclxuICAgICAgdXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkXHJcbiAgICAgIHVzZXJTZWxlY3RvcltAYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuXHJcbiAgICAgIGF1dGgudXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lIHVzZXJTZWxlY3RvclxyXG5cclxuICAgICMgQXR0YWNoIHRoZSB1c2VyIGFuZCB0aGVpciBJRCB0byB0aGUgY29udGV4dCBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuICAgIGlmIGF1dGg/LnVzZXJcclxuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXJcclxuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWRcclxuICAgICAgdHJ1ZVxyXG4gICAgZWxzZSBmYWxzZVxyXG5cclxuICAjIyNcclxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXHJcblxyXG4gICAgTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxyXG5cclxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXHJcbiAgICAgICAgICAgICBlbmRwb2ludFxyXG4gICMjI1xyXG4gIF9zcGFjZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cclxuICAgIGlmIGVuZHBvaW50LnNwYWNlUmVxdWlyZWRcclxuICAgICAgYXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXHJcbiAgICAgIGlmIGF1dGg/LnNwYWNlSWRcclxuICAgICAgICBzcGFjZV91c2Vyc19jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGgudXNlcklkLCBzcGFjZTphdXRoLnNwYWNlSWR9KS5jb3VudCgpXHJcbiAgICAgICAgaWYgc3BhY2VfdXNlcnNfY291bnRcclxuICAgICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKVxyXG4gICAgICAgICAgIyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXHJcbiAgICAgICAgICBpZiBzcGFjZT8uaXNfcGFpZCBhbmQgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpPj0wXHJcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gXCJiYWRcIlxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gICMjI1xyXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcclxuXHJcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXHJcblxyXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcclxuICAgICAgICAgICAgIGVuZHBvaW50XHJcbiAgIyMjXHJcbiAgX3JvbGVBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XHJcbiAgICBpZiBlbmRwb2ludC5yb2xlUmVxdWlyZWRcclxuICAgICAgaWYgXy5pc0VtcHR5IF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB0cnVlXHJcblxyXG5cclxuICAjIyNcclxuICAgIFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XHJcbiAgIyMjXHJcbiAgX3Jlc3BvbmQ6IChyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZT0yMDAsIGhlYWRlcnM9e30pIC0+XHJcbiAgICAjIE92ZXJyaWRlIGFueSBkZWZhdWx0IGhlYWRlcnMgdGhhdCBoYXZlIGJlZW4gcHJvdmlkZWQgKGtleXMgYXJlIG5vcm1hbGl6ZWQgdG8gYmUgY2FzZSBpbnNlbnNpdGl2ZSlcclxuICAgICMgVE9ETzogQ29uc2lkZXIgb25seSBsb3dlcmNhc2luZyB0aGUgaGVhZGVyIGtleXMgd2UgbmVlZCBub3JtYWxpemVkLCBsaWtlIENvbnRlbnQtVHlwZVxyXG4gICAgZGVmYXVsdEhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgQGFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzXHJcbiAgICBoZWFkZXJzID0gQF9sb3dlckNhc2VLZXlzIGhlYWRlcnNcclxuICAgIGhlYWRlcnMgPSBfLmV4dGVuZCBkZWZhdWx0SGVhZGVycywgaGVhZGVyc1xyXG5cclxuICAgICMgUHJlcGFyZSBKU09OIGJvZHkgZm9yIHJlc3BvbnNlIHdoZW4gQ29udGVudC1UeXBlIGluZGljYXRlcyBKU09OIHR5cGVcclxuICAgIGlmIGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSBpc250IG51bGxcclxuICAgICAgaWYgQGFwaS5fY29uZmlnLnByZXR0eUpzb25cclxuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keSwgdW5kZWZpbmVkLCAyXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keVxyXG5cclxuICAgICMgU2VuZCByZXNwb25zZVxyXG4gICAgc2VuZFJlc3BvbnNlID0gLT5cclxuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkIHN0YXR1c0NvZGUsIGhlYWRlcnNcclxuICAgICAgcmVzcG9uc2Uud3JpdGUgYm9keVxyXG4gICAgICByZXNwb25zZS5lbmQoKVxyXG4gICAgaWYgc3RhdHVzQ29kZSBpbiBbNDAxLCA0MDNdXHJcbiAgICAgICMgSGFja2VycyBjYW4gbWVhc3VyZSB0aGUgcmVzcG9uc2UgdGltZSB0byBkZXRlcm1pbmUgdGhpbmdzIGxpa2Ugd2hldGhlciB0aGUgNDAxIHJlc3BvbnNlIHdhcyBcclxuICAgICAgIyBjYXVzZWQgYnkgYmFkIHVzZXIgaWQgdnMgYmFkIHBhc3N3b3JkLlxyXG4gICAgICAjIEluIGRvaW5nIHNvLCB0aGV5IGNhbiBmaXJzdCBzY2FuIGZvciB2YWxpZCB1c2VyIGlkcyByZWdhcmRsZXNzIG9mIHZhbGlkIHBhc3N3b3Jkcy5cclxuICAgICAgIyBEZWxheSBieSBhIHJhbmRvbSBhbW91bnQgdG8gcmVkdWNlIHRoZSBhYmlsaXR5IGZvciBhIGhhY2tlciB0byBkZXRlcm1pbmUgdGhlIHJlc3BvbnNlIHRpbWUuXHJcbiAgICAgICMgU2VlIGh0dHBzOi8vd3d3Lm93YXNwLm9yZy9pbmRleC5waHAvQmxvY2tpbmdfQnJ1dGVfRm9yY2VfQXR0YWNrcyNGaW5kaW5nX090aGVyX0NvdW50ZXJtZWFzdXJlc1xyXG4gICAgICAjIFNlZSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9UaW1pbmdfYXR0YWNrXHJcbiAgICAgIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzID0gNTAwXHJcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKClcclxuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd29cclxuICAgICAgTWV0ZW9yLnNldFRpbWVvdXQgc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzXHJcbiAgICBlbHNlXHJcbiAgICAgIHNlbmRSZXNwb25zZSgpXHJcblxyXG4gICMjI1xyXG4gICAgUmV0dXJuIHRoZSBvYmplY3Qgd2l0aCBhbGwgb2YgdGhlIGtleXMgY29udmVydGVkIHRvIGxvd2VyY2FzZVxyXG4gICMjI1xyXG4gIF9sb3dlckNhc2VLZXlzOiAob2JqZWN0KSAtPlxyXG4gICAgXy5jaGFpbiBvYmplY3RcclxuICAgIC5wYWlycygpXHJcbiAgICAubWFwIChhdHRyKSAtPlxyXG4gICAgICBbYXR0clswXS50b0xvd2VyQ2FzZSgpLCBhdHRyWzFdXVxyXG4gICAgLm9iamVjdCgpXHJcbiAgICAudmFsdWUoKVxyXG4iLCJzaGFyZS5Sb3V0ZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUm91dGUoYXBpLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMxKSB7XG4gICAgdGhpcy5hcGkgPSBhcGk7XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuZW5kcG9pbnRzID0gZW5kcG9pbnRzMTtcbiAgICBpZiAoIXRoaXMuZW5kcG9pbnRzKSB7XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IHRoaXMub3B0aW9ucztcbiAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIFJvdXRlLnByb3RvdHlwZS5hZGRUb0FwaSA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgYXZhaWxhYmxlTWV0aG9kcztcbiAgICBhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWxsb3dlZE1ldGhvZHMsIGZ1bGxQYXRoLCByZWplY3RlZE1ldGhvZHMsIHNlbGY7XG4gICAgICBzZWxmID0gdGhpcztcbiAgICAgIGlmIChfLmNvbnRhaW5zKHRoaXMuYXBpLl9jb25maWcucGF0aHMsIHRoaXMucGF0aCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGFkZCBhIHJvdXRlIGF0IGFuIGV4aXN0aW5nIHBhdGg6IFwiICsgdGhpcy5wYXRoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW5kcG9pbnRzID0gXy5leHRlbmQoe1xuICAgICAgICBvcHRpb25zOiB0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcbiAgICAgIH0sIHRoaXMuZW5kcG9pbnRzKTtcbiAgICAgIHRoaXMuX3Jlc29sdmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuX2NvbmZpZ3VyZUVuZHBvaW50cygpO1xuICAgICAgdGhpcy5hcGkuX2NvbmZpZy5wYXRocy5wdXNoKHRoaXMucGF0aCk7XG4gICAgICBhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyKGF2YWlsYWJsZU1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpO1xuICAgICAgfSk7XG4gICAgICByZWplY3RlZE1ldGhvZHMgPSBfLnJlamVjdChhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgZnVsbFBhdGggPSB0aGlzLmFwaS5fY29uZmlnLmFwaVBhdGggKyB0aGlzLnBhdGg7XG4gICAgICBfLmVhY2goYWxsb3dlZE1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB2YXIgZW5kcG9pbnQ7XG4gICAgICAgIGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXTtcbiAgICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKG1ldGhvZCwgZnVsbFBhdGgsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICAgICAgdmFyIGRvbmVGdW5jLCBlbmRwb2ludENvbnRleHQsIGVycm9yLCByZXNwb25zZURhdGEsIHJlc3BvbnNlSW5pdGlhdGVkO1xuICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2U7XG4gICAgICAgICAgZG9uZUZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZUluaXRpYXRlZCA9IHRydWU7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBlbmRwb2ludENvbnRleHQgPSB7XG4gICAgICAgICAgICB1cmxQYXJhbXM6IHJlcS5wYXJhbXMsXG4gICAgICAgICAgICBxdWVyeVBhcmFtczogcmVxLnF1ZXJ5LFxuICAgICAgICAgICAgYm9keVBhcmFtczogcmVxLmJvZHksXG4gICAgICAgICAgICByZXF1ZXN0OiByZXEsXG4gICAgICAgICAgICByZXNwb25zZTogcmVzLFxuICAgICAgICAgICAgZG9uZTogZG9uZUZ1bmNcbiAgICAgICAgICB9O1xuICAgICAgICAgIF8uZXh0ZW5kKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpO1xuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IG51bGw7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHNlbGYuX2NhbGxFbmRwb2ludChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UoZXJyb3IsIHJlcSwgcmVzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlSW5pdGlhdGVkKSB7XG4gICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChyZXMuaGVhZGVyc1NlbnQpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiBcIiArIG1ldGhvZCArIFwiIFwiICsgZnVsbFBhdGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZURhdGEgPT09IG51bGwgfHwgcmVzcG9uc2VEYXRhID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJldHVybiBudWxsIG9yIHVuZGVmaW5lZCBmcm9tIGFuIGVuZHBvaW50OiBcIiArIG1ldGhvZCArIFwiIFwiICsgZnVsbFBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzcG9uc2VEYXRhLmJvZHkgJiYgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIHx8IHJlc3BvbnNlRGF0YS5oZWFkZXJzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2gocmVqZWN0ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKG1ldGhvZCwgZnVsbFBhdGgsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICAgICAgdmFyIGhlYWRlcnMsIHJlc3BvbnNlRGF0YTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSB7XG4gICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgIH07XG4gICAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICAgICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVycyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSkoKTtcblxuXG4gIC8qXG4gICAgQ29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG4gICAgZnVuY3Rpb25cbiAgXG4gICAgQHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzb2x2ZUVuZHBvaW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIF8uZWFjaCh0aGlzLmVuZHBvaW50cywgZnVuY3Rpb24oZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKGVuZHBvaW50KSkge1xuICAgICAgICByZXR1cm4gZW5kcG9pbnRzW21ldGhvZF0gPSB7XG4gICAgICAgICAgYWN0aW9uOiBlbmRwb2ludFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG5cbiAgLypcbiAgICBDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG4gICAgYmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXG4gIFxuICAgIEF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3IgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuXG4gICAgZW50aXJlIHJvdXRlLCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWQgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGxcbiAgICBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gICAgQWZ0ZXIgdGhlIGVuZHBvaW50IGlzIGNvbmZpZ3VyZWQsIGFsbCBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudHMgb2YgYW4gZW5kcG9pbnQgY2FuIGJlXG4gICAgYWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgICByZXNwZWN0aXZlbHkuXG4gIFxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgIEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jb25maWd1cmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QpIHtcbiAgICAgIHZhciByZWYsIHJlZjEsIHJlZjI7XG4gICAgICBpZiAobWV0aG9kICE9PSAnb3B0aW9ucycpIHtcbiAgICAgICAgaWYgKCEoKHJlZiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZi5yb2xlUmVxdWlyZWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQpO1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50LnJvbGVSZXF1aXJlZCkpIHtcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkID09PSB2b2lkIDApIHtcbiAgICAgICAgICBpZiAoKChyZWYxID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmMS5hdXRoUmVxdWlyZWQgOiB2b2lkIDApIHx8IGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgocmVmMiA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjIuc3BhY2VSZXF1aXJlZCA6IHZvaWQgMCkge1xuICAgICAgICAgIGVuZHBvaW50LnNwYWNlUmVxdWlyZWQgPSB0aGlzLm9wdGlvbnMuc3BhY2VSZXF1aXJlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG4gIFxuICAgIEByZXR1cm5zIFRoZSBlbmRwb2ludCByZXNwb25zZSBvciBhIDQwMSBpZiBhdXRoZW50aWNhdGlvbiBmYWlsc1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2NhbGxFbmRwb2ludCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICB2YXIgaW52b2NhdGlvbjtcbiAgICBpZiAodGhpcy5fYXV0aEFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICBpZiAodGhpcy5fcm9sZUFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICAgIGlmICh0aGlzLl9zcGFjZUFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICAgICAgaW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvbih7XG4gICAgICAgICAgICBpc1NpbXVsYXRpb246IHRydWUsXG4gICAgICAgICAgICB1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXG4gICAgICAgICAgICBjb25uZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgcmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUoaW52b2NhdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZW5kcG9pbnQuYWN0aW9uLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdCYWQgWC1TcGFjZS1JZCwgT25seSBhZG1pbnMgb2YgcGFpZCBzcGFjZSBjYW4gY2FsbCB0aGlzIGFwaS4nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiA0MDMsXG4gICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRvIHRoaXMuJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzQ29kZTogNDAxLFxuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gZG8gdGhpcy4nXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG4gIFxuICAgIE9uY2UgaXQncyBnbG9iYWxseSBjb25maWd1cmVkIGluIHRoZSBBUEksIGF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3JcbiAgICBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcbiAgICBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdC5cbiAgXG4gICAgQHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2F1dGhBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQuYXV0aFJlcXVpcmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXV0aGVudGljYXRlKGVuZHBvaW50Q29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgVmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcbiAgXG4gICAgSWYgdmVyaWZpZWQsIGF0dGFjaCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHRvIHRoZSBjb250ZXh0LlxuICBcbiAgICBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoZW50aWNhdGUgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQpIHtcbiAgICB2YXIgYXV0aCwgdXNlclNlbGVjdG9yO1xuICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgaWYgKChhdXRoICE9IG51bGwgPyBhdXRoLnVzZXJJZCA6IHZvaWQgMCkgJiYgKGF1dGggIT0gbnVsbCA/IGF1dGgudG9rZW4gOiB2b2lkIDApICYmICEoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSkge1xuICAgICAgdXNlclNlbGVjdG9yID0ge307XG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWQ7XG4gICAgICB1c2VyU2VsZWN0b3JbdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnRva2VuXSA9IGF1dGgudG9rZW47XG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VyU2VsZWN0b3IpO1xuICAgIH1cbiAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC51c2VyIDogdm9pZCAwKSB7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlcjtcbiAgICAgIGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgICAgICAgICAgICBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3NwYWNlQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGF1dGgsIHNwYWNlLCBzcGFjZV91c2Vyc19jb3VudDtcbiAgICBpZiAoZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCkge1xuICAgICAgYXV0aCA9IHRoaXMuYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICAgIGlmIChhdXRoICE9IG51bGwgPyBhdXRoLnNwYWNlSWQgOiB2b2lkIDApIHtcbiAgICAgICAgc3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICB1c2VyOiBhdXRoLnVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogYXV0aC5zcGFjZUlkXG4gICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgIGlmIChzcGFjZV91c2Vyc19jb3VudCkge1xuICAgICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKTtcbiAgICAgICAgICBpZiAoKHNwYWNlICE9IG51bGwgPyBzcGFjZS5pc19wYWlkIDogdm9pZCAwKSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCkgPj0gMCkge1xuICAgICAgICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBhdXRoLnNwYWNlSWQ7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gXCJiYWRcIjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKlxuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cbiAgXG4gICAgQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGJlbG9uZ3MgdG8gPGk+YW55PC9pPiBvZiB0aGUgYWNjZXB0YWJsZSByb2xlcyBvbiB0aGVcbiAgICAgICAgICAgICBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3JvbGVBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICBpZiAoXy5pc0VtcHR5KF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgICBSZXNwb25kIHRvIGFuIEhUVFAgcmVxdWVzdFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc3BvbmQgPSBmdW5jdGlvbihyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZSwgaGVhZGVycykge1xuICAgIHZhciBkZWZhdWx0SGVhZGVycywgZGVsYXlJbk1pbGxpc2Vjb25kcywgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMsIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvLCBzZW5kUmVzcG9uc2U7XG4gICAgaWYgKHN0YXR1c0NvZGUgPT0gbnVsbCkge1xuICAgICAgc3RhdHVzQ29kZSA9IDIwMDtcbiAgICB9XG4gICAgaWYgKGhlYWRlcnMgPT0gbnVsbCkge1xuICAgICAgaGVhZGVycyA9IHt9O1xuICAgIH1cbiAgICBkZWZhdWx0SGVhZGVycyA9IHRoaXMuX2xvd2VyQ2FzZUtleXModGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0SGVhZGVycyk7XG4gICAgaGVhZGVycyA9IHRoaXMuX2xvd2VyQ2FzZUtleXMoaGVhZGVycyk7XG4gICAgaGVhZGVycyA9IF8uZXh0ZW5kKGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzKTtcbiAgICBpZiAoaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5hcGkuX2NvbmZpZy5wcmV0dHlKc29uKSB7XG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5LCB2b2lkIDAsIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICAgICAgfVxuICAgIH1cbiAgICBzZW5kUmVzcG9uc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZChzdGF0dXNDb2RlLCBoZWFkZXJzKTtcbiAgICAgIHJlc3BvbnNlLndyaXRlKGJvZHkpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmVuZCgpO1xuICAgIH07XG4gICAgaWYgKHN0YXR1c0NvZGUgPT09IDQwMSB8fCBzdGF0dXNDb2RlID09PSA0MDMpIHtcbiAgICAgIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzID0gNTAwO1xuICAgICAgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28gPSAxICsgTWF0aC5yYW5kb20oKTtcbiAgICAgIGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvO1xuICAgICAgcmV0dXJuIE1ldGVvci5zZXRUaW1lb3V0KHNlbmRSZXNwb25zZSwgZGVsYXlJbk1pbGxpc2Vjb25kcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZW5kUmVzcG9uc2UoKTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9sb3dlckNhc2VLZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIF8uY2hhaW4ob2JqZWN0KS5wYWlycygpLm1hcChmdW5jdGlvbihhdHRyKSB7XG4gICAgICByZXR1cm4gW2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV07XG4gICAgfSkub2JqZWN0KCkudmFsdWUoKTtcbiAgfTtcblxuICByZXR1cm4gUm91dGU7XG5cbn0pKCk7XG4iLCJjbGFzcyBAUmVzdGl2dXNcclxuXHJcbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxyXG4gICAgQF9yb3V0ZXMgPSBbXVxyXG4gICAgQF9jb25maWcgPVxyXG4gICAgICBwYXRoczogW11cclxuICAgICAgdXNlRGVmYXVsdEF1dGg6IGZhbHNlXHJcbiAgICAgIGFwaVBhdGg6ICdhcGkvJ1xyXG4gICAgICB2ZXJzaW9uOiBudWxsXHJcbiAgICAgIHByZXR0eUpzb246IGZhbHNlXHJcbiAgICAgIGF1dGg6XHJcbiAgICAgICAgdG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nXHJcbiAgICAgICAgdXNlcjogLT5cclxuICAgICAgICAgIGlmIEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXHJcbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXHJcbiAgICAgICAgICBpZiBAcmVxdWVzdC51c2VySWRcclxuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IEByZXF1ZXN0LnVzZXJJZH0pXHJcbiAgICAgICAgICAgIHVzZXI6IF91c2VyXHJcbiAgICAgICAgICAgIHVzZXJJZDogQHJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ11cclxuICAgICAgICAgICAgc3BhY2VJZDogQHJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddXHJcbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB1c2VySWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddXHJcbiAgICAgICAgICAgIHNwYWNlSWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXVxyXG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cclxuICAgICAgZGVmYXVsdEhlYWRlcnM6XHJcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICBlbmFibGVDb3JzOiB0cnVlXHJcblxyXG4gICAgIyBDb25maWd1cmUgQVBJIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcclxuICAgIF8uZXh0ZW5kIEBfY29uZmlnLCBvcHRpb25zXHJcblxyXG4gICAgaWYgQF9jb25maWcuZW5hYmxlQ29yc1xyXG4gICAgICBjb3JzSGVhZGVycyA9XHJcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xyXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQnXHJcblxyXG4gICAgICBpZiBAX2NvbmZpZy51c2VEZWZhdWx0QXV0aFxyXG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4nXHJcblxyXG4gICAgICAjIFNldCBkZWZhdWx0IGhlYWRlciB0byBlbmFibGUgQ09SUyBpZiBjb25maWd1cmVkXHJcbiAgICAgIF8uZXh0ZW5kIEBfY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVyc1xyXG5cclxuICAgICAgaWYgbm90IEBfY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcclxuICAgICAgICBAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gLT5cclxuICAgICAgICAgIEByZXNwb25zZS53cml0ZUhlYWQgMjAwLCBjb3JzSGVhZGVyc1xyXG4gICAgICAgICAgQGRvbmUoKVxyXG5cclxuICAgICMgTm9ybWFsaXplIHRoZSBBUEkgcGF0aFxyXG4gICAgaWYgQF9jb25maWcuYXBpUGF0aFswXSBpcyAnLydcclxuICAgICAgQF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGguc2xpY2UgMVxyXG4gICAgaWYgXy5sYXN0KEBfY29uZmlnLmFwaVBhdGgpIGlzbnQgJy8nXHJcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoICsgJy8nXHJcblxyXG4gICAgIyBVUkwgcGF0aCB2ZXJzaW9uaW5nIGlzIHRoZSBvbmx5IHR5cGUgb2YgQVBJIHZlcnNpb25pbmcgY3VycmVudGx5IGF2YWlsYWJsZSwgc28gaWYgYSB2ZXJzaW9uIGlzXHJcbiAgICAjIHByb3ZpZGVkLCBhcHBlbmQgaXQgdG8gdGhlIGJhc2UgcGF0aCBvZiB0aGUgQVBJXHJcbiAgICBpZiBAX2NvbmZpZy52ZXJzaW9uXHJcbiAgICAgIEBfY29uZmlnLmFwaVBhdGggKz0gQF9jb25maWcudmVyc2lvbiArICcvJ1xyXG5cclxuICAgICMgQWRkIGRlZmF1bHQgbG9naW4gYW5kIGxvZ291dCBlbmRwb2ludHMgaWYgYXV0aCBpcyBjb25maWd1cmVkXHJcbiAgICBpZiBAX2NvbmZpZy51c2VEZWZhdWx0QXV0aFxyXG4gICAgICBAX2luaXRBdXRoKClcclxuICAgIGVsc2UgaWYgQF9jb25maWcudXNlQXV0aFxyXG4gICAgICBAX2luaXRBdXRoKClcclxuICAgICAgY29uc29sZS53YXJuICdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgK1xyXG4gICAgICAgICAgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJ1xyXG5cclxuICAgIHJldHVybiB0aGlzXHJcblxyXG5cclxuICAjIyMqXHJcbiAgICBBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXHJcblxyXG4gICAgQHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxyXG4gICAgQHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXHJcbiAgICBAcGFyYW0gb3B0aW9ucy5hdXRoUmVxdWlyZWQge0Jvb2xlYW59IFRoZSBkZWZhdWx0IGF1dGggcmVxdWlyZW1lbnQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXHJcbiAgICBAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcclxuICAgIEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcclxuICAgIEBwYXJhbSBlbmRwb2ludHMuPG1ldGhvZD4ge0Z1bmN0aW9uIG9yIE9iamVjdH0gSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgYWxsIGRlZmF1bHQgcm91dGVcclxuICAgICAgICBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXHJcbiAgICAgICAgYW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxyXG4gICMjI1xyXG4gIGFkZFJvdXRlOiAocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSAtPlxyXG4gICAgIyBDcmVhdGUgYSBuZXcgcm91dGUgYW5kIGFkZCBpdCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyByb3V0ZXNcclxuICAgIHJvdXRlID0gbmV3IHNoYXJlLlJvdXRlKHRoaXMsIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cylcclxuICAgIEBfcm91dGVzLnB1c2gocm91dGUpXHJcblxyXG4gICAgcm91dGUuYWRkVG9BcGkoKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcblxyXG5cclxuICAjIyMqXHJcbiAgICBHZW5lcmF0ZSByb3V0ZXMgZm9yIHRoZSBNZXRlb3IgQ29sbGVjdGlvbiB3aXRoIHRoZSBnaXZlbiBuYW1lXHJcbiAgIyMjXHJcbiAgYWRkQ29sbGVjdGlvbjogKGNvbGxlY3Rpb24sIG9wdGlvbnM9e30pIC0+XHJcbiAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ2dldEFsbCddXHJcbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddXHJcblxyXG4gICAgIyBHcmFiIHRoZSBzZXQgb2YgZW5kcG9pbnRzXHJcbiAgICBpZiBjb2xsZWN0aW9uIGlzIE1ldGVvci51c2Vyc1xyXG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF91c2VyQ29sbGVjdGlvbkVuZHBvaW50c1xyXG4gICAgZWxzZVxyXG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF9jb2xsZWN0aW9uRW5kcG9pbnRzXHJcblxyXG4gICAgIyBGbGF0dGVuIHRoZSBvcHRpb25zIGFuZCBzZXQgZGVmYXVsdHMgaWYgbmVjZXNzYXJ5XHJcbiAgICBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyBvciB7fVxyXG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgb3Ige31cclxuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzID0gb3B0aW9ucy5leGNsdWRlZEVuZHBvaW50cyBvciBbXVxyXG4gICAgIyBVc2UgY29sbGVjdGlvbiBuYW1lIGFzIGRlZmF1bHQgcGF0aFxyXG4gICAgcGF0aCA9IG9wdGlvbnMucGF0aCBvciBjb2xsZWN0aW9uLl9uYW1lXHJcblxyXG4gICAgIyBTZXBhcmF0ZSB0aGUgcmVxdWVzdGVkIGVuZHBvaW50cyBieSB0aGUgcm91dGUgdGhleSBiZWxvbmcgdG8gKG9uZSBmb3Igb3BlcmF0aW5nIG9uIHRoZSBlbnRpcmVcclxuICAgICMgY29sbGVjdGlvbiBhbmQgb25lIGZvciBvcGVyYXRpbmcgb24gYSBzaW5nbGUgZW50aXR5IHdpdGhpbiB0aGUgY29sbGVjdGlvbilcclxuICAgIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyA9IHt9XHJcbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9XHJcbiAgICBpZiBfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSBhbmQgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKVxyXG4gICAgICAjIEdlbmVyYXRlIGFsbCBlbmRwb2ludHMgb24gdGhpcyBjb2xsZWN0aW9uXHJcbiAgICAgIF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxyXG4gICAgICAgICMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xyXG4gICAgICAgIGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXHJcbiAgICAgICAgICBfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXHJcbiAgICAgICAgZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcclxuICAgICAgICByZXR1cm5cclxuICAgICAgLCB0aGlzXHJcbiAgICBlbHNlXHJcbiAgICAgICMgR2VuZXJhdGUgYW55IGVuZHBvaW50cyB0aGF0IGhhdmVuJ3QgYmVlbiBleHBsaWNpdGx5IGV4Y2x1ZGVkXHJcbiAgICAgIF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxyXG4gICAgICAgIGlmIG1ldGhvZCBub3QgaW4gZXhjbHVkZWRFbmRwb2ludHMgYW5kIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdIGlzbnQgZmFsc2VcclxuICAgICAgICAgICMgQ29uZmlndXJlIGVuZHBvaW50IGFuZCBtYXAgdG8gaXQncyBodHRwIG1ldGhvZFxyXG4gICAgICAgICAgIyBUT0RPOiBDb25zaWRlciBwcmVkZWZpbmluZyBhIG1hcCBvZiBtZXRob2RzIHRvIHRoZWlyIGh0dHAgbWV0aG9kIHR5cGUgKGUuZy4sIGdldEFsbDogZ2V0KVxyXG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF1cclxuICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludCA9IHt9XHJcbiAgICAgICAgICBfLmVhY2ggY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIChhY3Rpb24sIG1ldGhvZFR5cGUpIC0+XHJcbiAgICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9XHJcbiAgICAgICAgICAgICAgXy5jaGFpbiBhY3Rpb25cclxuICAgICAgICAgICAgICAuY2xvbmUoKVxyXG4gICAgICAgICAgICAgIC5leHRlbmQgZW5kcG9pbnRPcHRpb25zXHJcbiAgICAgICAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAgICMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xyXG4gICAgICAgICAgaWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cclxuICAgICAgICAgICAgXy5leHRlbmQgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnRcclxuICAgICAgICAgIGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICwgdGhpc1xyXG5cclxuICAgICMgQWRkIHRoZSByb3V0ZXMgdG8gdGhlIEFQSVxyXG4gICAgQGFkZFJvdXRlIHBhdGgsIHJvdXRlT3B0aW9ucywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzXHJcbiAgICBAYWRkUm91dGUgXCIje3BhdGh9LzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuXHJcblxyXG4gICMjIypcclxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxyXG4gICMjI1xyXG4gIF9jb2xsZWN0aW9uRW5kcG9pbnRzOlxyXG4gICAgZ2V0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgZ2V0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cclxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIHNlbGVjdG9yXHJcbiAgICAgICAgICBpZiBlbnRpdHlcclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XHJcbiAgICBwdXQ6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBwdXQ6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxyXG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXHJcbiAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgJHNldDogQGJvZHlQYXJhbXNcclxuICAgICAgICAgIGlmIGVudGl0eUlzVXBkYXRlZFxyXG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZFxyXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cclxuICAgIGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XHJcbiAgICAgIGRlbGV0ZTpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XHJcbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgIGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogbWVzc2FnZTogJ0l0ZW0gcmVtb3ZlZCd9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCd9XHJcbiAgICBwb3N0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgcG9zdDpcclxuICAgICAgICBhY3Rpb246IC0+XHJcbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgICAgQGJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWRcclxuICAgICAgICAgIGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQgQGJvZHlQYXJhbXNcclxuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxyXG4gICAgICAgICAgaWYgZW50aXR5XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMVxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnfVxyXG4gICAgZ2V0QWxsOiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgZ2V0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIHNlbGVjdG9yID0ge31cclxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxyXG4gICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKClcclxuICAgICAgICAgIGlmIGVudGl0aWVzXHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ31cclxuXHJcblxyXG4gICMjIypcclxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcclxuICAjIyNcclxuICBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHM6XHJcbiAgICBnZXQ6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBnZXQ6XHJcbiAgICAgICAgYWN0aW9uOiAtPlxyXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxyXG4gICAgICAgICAgaWYgZW50aXR5XHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxyXG4gICAgcHV0OiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgcHV0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIEB1cmxQYXJhbXMuaWQsICRzZXQ6IHByb2ZpbGU6IEBib2R5UGFyYW1zXHJcbiAgICAgICAgICBpZiBlbnRpdHlJc1VwZGF0ZWRcclxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxyXG4gICAgICAgICAgICB7c3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogZW50aXR5fVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcclxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxyXG4gICAgZGVsZXRlOiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgZGVsZXRlOlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIGlmIGNvbGxlY3Rpb24ucmVtb3ZlIEB1cmxQYXJhbXMuaWRcclxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ31cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XHJcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cclxuICAgIHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxyXG4gICAgICBwb3N0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgICMgQ3JlYXRlIGEgbmV3IHVzZXIgYWNjb3VudFxyXG4gICAgICAgICAgZW50aXR5SWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyIEBib2R5UGFyYW1zXHJcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWQsIGZpZWxkczogcHJvZmlsZTogMVxyXG4gICAgICAgICAgaWYgZW50aXR5XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMVxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnfVxyXG4gICAgZ2V0QWxsOiAoY29sbGVjdGlvbikgLT5cclxuICAgICAgZ2V0OlxyXG4gICAgICAgIGFjdGlvbjogLT5cclxuICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCBmaWVsZHM6IHByb2ZpbGU6IDEpLmZldGNoKClcclxuICAgICAgICAgIGlmIGVudGl0aWVzXHJcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxyXG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnfVxyXG5cclxuXHJcbiAgIyMjXHJcbiAgICBBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXHJcbiAgIyMjXHJcbiAgX2luaXRBdXRoOiAtPlxyXG4gICAgc2VsZiA9IHRoaXNcclxuICAgICMjI1xyXG4gICAgICBBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXHJcblxyXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIHRoZSBvbkxvZ2dlZEluIGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxyXG4gICAgICBhZGRpbmcgaG9vaykuXHJcbiAgICAjIyNcclxuICAgIEBhZGRSb3V0ZSAnbG9naW4nLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sXHJcbiAgICAgIHBvc3Q6IC0+XHJcbiAgICAgICAgIyBHcmFiIHRoZSB1c2VybmFtZSBvciBlbWFpbCB0aGF0IHRoZSB1c2VyIGlzIGxvZ2dpbmcgaW4gd2l0aFxyXG4gICAgICAgIHVzZXIgPSB7fVxyXG4gICAgICAgIGlmIEBib2R5UGFyYW1zLnVzZXJcclxuICAgICAgICAgIGlmIEBib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpIGlzIC0xXHJcbiAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSBAYm9keVBhcmFtcy51c2VyXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy51c2VyXHJcbiAgICAgICAgZWxzZSBpZiBAYm9keVBhcmFtcy51c2VybmFtZVxyXG4gICAgICAgICAgdXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJuYW1lXHJcbiAgICAgICAgZWxzZSBpZiBAYm9keVBhcmFtcy5lbWFpbFxyXG4gICAgICAgICAgdXNlci5lbWFpbCA9IEBib2R5UGFyYW1zLmVtYWlsXHJcblxyXG4gICAgICAgICMgVHJ5IHRvIGxvZyB0aGUgdXNlciBpbnRvIHRoZSB1c2VyJ3MgYWNjb3VudCAoaWYgc3VjY2Vzc2Z1bCB3ZSdsbCBnZXQgYW4gYXV0aCB0b2tlbiBiYWNrKVxyXG4gICAgICAgIHRyeVxyXG4gICAgICAgICAgYXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQgdXNlciwgQGJvZHlQYXJhbXMucGFzc3dvcmRcclxuICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuICAgICAgICAgIHJldHVybiB7fSA9XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3JcclxuICAgICAgICAgICAgYm9keTogc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiBlLnJlYXNvblxyXG5cclxuICAgICAgICAjIEdldCB0aGUgYXV0aGVudGljYXRlZCB1c2VyXHJcbiAgICAgICAgIyBUT0RPOiBDb25zaWRlciByZXR1cm5pbmcgdGhlIHVzZXIgaW4gQXV0aC5sb2dpbldpdGhQYXNzd29yZCgpLCBpbnN0ZWFkIG9mIGZldGNoaW5nIGl0IGFnYWluIGhlcmVcclxuICAgICAgICBpZiBhdXRoLnVzZXJJZCBhbmQgYXV0aC5hdXRoVG9rZW5cclxuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge31cclxuICAgICAgICAgIHNlYXJjaFF1ZXJ5W3NlbGYuX2NvbmZpZy5hdXRoLnRva2VuXSA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoLmF1dGhUb2tlblxyXG4gICAgICAgICAgQHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcclxuICAgICAgICAgICAgc2VhcmNoUXVlcnlcclxuICAgICAgICAgIEB1c2VySWQgPSBAdXNlcj8uX2lkXHJcblxyXG4gICAgICAgIHJlc3BvbnNlID0ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBhdXRofVxyXG5cclxuICAgICAgICAjIENhbGwgdGhlIGxvZ2luIGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXHJcbiAgICAgICAgZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkSW4/LmNhbGwodGhpcylcclxuICAgICAgICBpZiBleHRyYURhdGE/XHJcbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXHJcblxyXG4gICAgICAgIHJlc3BvbnNlXHJcblxyXG4gICAgbG9nb3V0ID0gLT5cclxuICAgICAgIyBSZW1vdmUgdGhlIGdpdmVuIGF1dGggdG9rZW4gZnJvbSB0aGUgdXNlcidzIGFjY291bnRcclxuICAgICAgYXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cclxuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aFRva2VuXHJcbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlblxyXG4gICAgICBpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YgJy4nXHJcbiAgICAgIHRva2VuUGF0aCA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nIDAsIGluZGV4XHJcbiAgICAgIHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgaW5kZXggKyAxXHJcbiAgICAgIHRva2VuVG9SZW1vdmUgPSB7fVxyXG4gICAgICB0b2tlblRvUmVtb3ZlW3Rva2VuRmllbGROYW1lXSA9IGhhc2hlZFRva2VuXHJcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge31cclxuICAgICAgdG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmVcclxuICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSBAdXNlci5faWQsIHskcHVsbDogdG9rZW5SZW1vdmFsUXVlcnl9XHJcblxyXG4gICAgICByZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ319XHJcblxyXG4gICAgICAjIENhbGwgdGhlIGxvZ291dCBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxyXG4gICAgICBleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQ/LmNhbGwodGhpcylcclxuICAgICAgaWYgZXh0cmFEYXRhP1xyXG4gICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtleHRyYTogZXh0cmFEYXRhfSlcclxuXHJcbiAgICAgIHJlc3BvbnNlXHJcblxyXG4gICAgIyMjXHJcbiAgICAgIEFkZCBhIGxvZ291dCBlbmRwb2ludCB0byB0aGUgQVBJXHJcblxyXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXHJcbiAgICAgIGFkZGluZyBob29rKS5cclxuICAgICMjI1xyXG4gICAgQGFkZFJvdXRlICdsb2dvdXQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSxcclxuICAgICAgZ2V0OiAtPlxyXG4gICAgICAgIGNvbnNvbGUud2FybiBcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCJcclxuICAgICAgICBjb25zb2xlLndhcm4gXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCJcclxuICAgICAgICByZXR1cm4gbG9nb3V0LmNhbGwodGhpcylcclxuICAgICAgcG9zdDogbG9nb3V0XHJcblxyXG5SZXN0aXZ1cyA9IEBSZXN0aXZ1c1xyXG4iLCJ2YXIgUmVzdGl2dXMsXG4gIGluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxudGhpcy5SZXN0aXZ1cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUmVzdGl2dXMob3B0aW9ucykge1xuICAgIHZhciBjb3JzSGVhZGVycztcbiAgICB0aGlzLl9yb3V0ZXMgPSBbXTtcbiAgICB0aGlzLl9jb25maWcgPSB7XG4gICAgICBwYXRoczogW10sXG4gICAgICB1c2VEZWZhdWx0QXV0aDogZmFsc2UsXG4gICAgICBhcGlQYXRoOiAnYXBpLycsXG4gICAgICB2ZXJzaW9uOiBudWxsLFxuICAgICAgcHJldHR5SnNvbjogZmFsc2UsXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHRva2VuOiAnc2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuJyxcbiAgICAgICAgdXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF91c2VyLCB0b2tlbjtcbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddKSB7XG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LnVzZXJJZCkge1xuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnJlcXVlc3QudXNlcklkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXI6IF91c2VyLFxuICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSxcbiAgICAgICAgICAgICAgc3BhY2VJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSxcbiAgICAgICAgICAgICAgc3BhY2VJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBlbmFibGVDb3JzOiB0cnVlXG4gICAgfTtcbiAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcsIG9wdGlvbnMpO1xuICAgIGlmICh0aGlzLl9jb25maWcuZW5hYmxlQ29ycykge1xuICAgICAgY29yc0hlYWRlcnMgPSB7XG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQnXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuJztcbiAgICAgIH1cbiAgICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnMpO1xuICAgICAgaWYgKCF0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCkge1xuICAgICAgICB0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2Uud3JpdGVIZWFkKDIwMCwgY29yc0hlYWRlcnMpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5hcGlQYXRoWzBdID09PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGguc2xpY2UoMSk7XG4gICAgfVxuICAgIGlmIChfLmxhc3QodGhpcy5fY29uZmlnLmFwaVBhdGgpICE9PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGggKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudmVyc2lvbikge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggKz0gdGhpcy5fY29uZmlnLnZlcnNpb24gKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jb25maWcudXNlQXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICAgIGNvbnNvbGUud2FybignV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICsgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgICBBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG4gIFxuICAgIEBwYXJhbSBwYXRoIHtTdHJpbmd9IFRoZSBleHRlbmRlZCBVUkwgcGF0aCAod2lsbCBiZSBhcHBlbmRlZCB0byBiYXNlIHBhdGggb2YgdGhlIEFQSSlcbiAgICBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBSb3V0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICBAcGFyYW0gb3B0aW9ucy5hdXRoUmVxdWlyZWQge0Jvb2xlYW59IFRoZSBkZWZhdWx0IGF1dGggcmVxdWlyZW1lbnQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIG9wdGlvbnMucm9sZVJlcXVpcmVkIHtTdHJpbmcgb3IgU3RyaW5nW119IFRoZSBkZWZhdWx0IHJvbGUgcmVxdWlyZWQgZm9yIGVhY2ggZW5kcG9pbnQgb24gdGhlIHJvdXRlXG4gICAgQHBhcmFtIGVuZHBvaW50cyB7T2JqZWN0fSBBIHNldCBvZiBlbmRwb2ludHMgYXZhaWxhYmxlIG9uIHRoZSBuZXcgcm91dGUgKGdldCwgcG9zdCwgcHV0LCBwYXRjaCwgZGVsZXRlLCBvcHRpb25zKVxuICAgIEBwYXJhbSBlbmRwb2ludHMuPG1ldGhvZD4ge0Z1bmN0aW9uIG9yIE9iamVjdH0gSWYgYSBmdW5jdGlvbiBpcyBwcm92aWRlZCwgYWxsIGRlZmF1bHQgcm91dGVcbiAgICAgICAgY29uZmlndXJhdGlvbiBvcHRpb25zIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZW5kcG9pbnQuIE90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBhbiBgYWN0aW9uYFxuICAgICAgICBhbmQgYWxsIG90aGVyIHJvdXRlIGNvbmZpZyBvcHRpb25zIGF2YWlsYWJsZS4gQW4gYGFjdGlvbmAgbXVzdCBiZSBwcm92aWRlZCB3aXRoIHRoZSBvYmplY3QuXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5hZGRSb3V0ZSA9IGZ1bmN0aW9uKHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cykge1xuICAgIHZhciByb3V0ZTtcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpO1xuICAgIHRoaXMuX3JvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICByb3V0ZS5hZGRUb0FwaSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAgR2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuYWRkQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbkVuZHBvaW50cywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24sIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kcywgbWV0aG9kc09uQ29sbGVjdGlvbiwgcGF0aCwgcm91dGVPcHRpb25zO1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXTtcbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddO1xuICAgIGlmIChjb2xsZWN0aW9uID09PSBNZXRlb3IudXNlcnMpIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX2NvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfVxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIHx8IHt9O1xuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIHx8IHt9O1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzID0gb3B0aW9ucy5leGNsdWRlZEVuZHBvaW50cyB8fCBbXTtcbiAgICBwYXRoID0gb3B0aW9ucy5wYXRoIHx8IGNvbGxlY3Rpb24uX25hbWU7XG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgJiYgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKSkge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBjb25maWd1cmVkRW5kcG9pbnQsIGVuZHBvaW50T3B0aW9ucztcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kKSA8IDAgJiYgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF07XG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge307XG4gICAgICAgICAgXy5lYWNoKGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCBmdW5jdGlvbihhY3Rpb24sIG1ldGhvZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPSBfLmNoYWluKGFjdGlvbikuY2xvbmUoKS5leHRlbmQoZW5kcG9pbnRPcHRpb25zKS52YWx1ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICAgIHRoaXMuYWRkUm91dGUocGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMpO1xuICAgIHRoaXMuYWRkUm91dGUocGF0aCArIFwiLzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX2NvbGxlY3Rpb25FbmRwb2ludHMgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1dDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHV0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlzVXBkYXRlZCwgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZShzZWxlY3Rvciwge1xuICAgICAgICAgICAgICAkc2V0OiB0aGlzLmJvZHlQYXJhbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQpO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYm9keVBhcmFtcy5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlkID0gY29sbGVjdGlvbi5pbnNlcnQodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKCk7XG4gICAgICAgICAgICBpZiAoZW50aXRpZXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdGllc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5hYmxlIHRvIHJldHJpZXZlIGl0ZW1zIGZyb20gY29sbGVjdGlvbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5O1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkO1xuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFwiZGVsZXRlXCI6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24ucmVtb3ZlKHRoaXMudXJsUGFyYW1zLmlkKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHBvc3Q6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3Q6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SWQ7XG4gICAgICAgICAgICBlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIodGhpcy5ib2R5UGFyYW1zKTtcbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShlbnRpdHlJZCwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBwcm9maWxlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyB1c2VyIGFkZGVkJ1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcztcbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIEFkZCAvbG9naW4gYW5kIC9sb2dvdXQgZW5kcG9pbnRzIHRvIHRoZSBBUElcbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLl9pbml0QXV0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2dvdXQsIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG5cbiAgICAvKlxuICAgICAgQWRkIGEgbG9naW4gZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICB0aGlzLmFkZFJvdXRlKCdsb2dpbicsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2VcbiAgICB9LCB7XG4gICAgICBwb3N0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF1dGgsIGUsIGV4dHJhRGF0YSwgcmVmLCByZWYxLCByZXNwb25zZSwgc2VhcmNoUXVlcnksIHVzZXI7XG4gICAgICAgIHVzZXIgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWUpIHtcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy5lbWFpbCkge1xuICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMuZW1haWw7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCh1c2VyLCB0aGlzLmJvZHlQYXJhbXMucGFzc3dvcmQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGUucmVhc29uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXV0aC51c2VySWQgJiYgYXV0aC5hdXRoVG9rZW4pIHtcbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5W3NlbGYuX2NvbmZpZy5hdXRoLnRva2VuXSA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoLmF1dGhUb2tlbik7XG4gICAgICAgICAgdGhpcy51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXG4gICAgICAgICAgfSwgc2VhcmNoUXVlcnkpO1xuICAgICAgICAgIHRoaXMudXNlcklkID0gKHJlZiA9IHRoaXMudXNlcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgZGF0YTogYXV0aFxuICAgICAgICB9O1xuICAgICAgICBleHRyYURhdGEgPSAocmVmMSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluKSAhPSBudWxsID8gcmVmMS5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF1dGhUb2tlbiwgZXh0cmFEYXRhLCBoYXNoZWRUb2tlbiwgaW5kZXgsIHJlZiwgcmVzcG9uc2UsIHRva2VuRmllbGROYW1lLCB0b2tlbkxvY2F0aW9uLCB0b2tlblBhdGgsIHRva2VuUmVtb3ZhbFF1ZXJ5LCB0b2tlblRvUmVtb3ZlO1xuICAgICAgYXV0aFRva2VuID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddO1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlbjtcbiAgICAgIGluZGV4ID0gdG9rZW5Mb2NhdGlvbi5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgICAgdG9rZW5Ub1JlbW92ZSA9IHt9O1xuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlbjtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge307XG4gICAgICB0b2tlblJlbW92YWxRdWVyeVt0b2tlblBhdGhdID0gdG9rZW5Ub1JlbW92ZTtcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUodGhpcy51c2VyLl9pZCwge1xuICAgICAgICAkcHVsbDogdG9rZW5SZW1vdmFsUXVlcnlcbiAgICAgIH0pO1xuICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbWVzc2FnZTogJ1lvdVxcJ3ZlIGJlZW4gbG9nZ2VkIG91dCEnXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBleHRyYURhdGEgPSAocmVmID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0KSAhPSBudWxsID8gcmVmLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICBBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuICAgIFxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLmFkZFJvdXRlKCdsb2dvdXQnLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWVcbiAgICB9LCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiKTtcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHBvc3Q6IGxvZ291dFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBSZXN0aXZ1cztcblxufSkoKTtcblxuUmVzdGl2dXMgPSB0aGlzLlJlc3RpdnVzO1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICBAQVBJID0gbmV3IFJlc3RpdnVzXHJcbiAgICAgICAgYXBpUGF0aDogJ3N0ZWVkb3MvYXBpLycsXHJcbiAgICAgICAgdXNlRGVmYXVsdEF1dGg6IHRydWVcclxuICAgICAgICBwcmV0dHlKc29uOiB0cnVlXHJcbiAgICAgICAgZW5hYmxlQ29yczogZmFsc2VcclxuICAgICAgICBkZWZhdWx0SGVhZGVyczpcclxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIHRoaXMuQVBJID0gbmV3IFJlc3RpdnVzKHtcbiAgICBhcGlQYXRoOiAnc3RlZWRvcy9hcGkvJyxcbiAgICB1c2VEZWZhdWx0QXV0aDogdHJ1ZSxcbiAgICBwcmV0dHlKc29uOiB0cnVlLFxuICAgIGVuYWJsZUNvcnM6IGZhbHNlLFxuICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfVxuICB9KTtcbn1cbiIsIkJ1c2JveSA9IHJlcXVpcmUoJ2J1c2JveScpO1xyXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xyXG5cclxuSnNvblJvdXRlcy5wYXJzZUZpbGVzID0gKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgZmlsZXMgPSBbXTsgIyBTdG9yZSBmaWxlcyBpbiBhbiBhcnJheSBhbmQgdGhlbiBwYXNzIHRoZW0gdG8gcmVxdWVzdC5cclxuICAgIGltYWdlID0ge307ICMgY3JhdGUgYW4gaW1hZ2Ugb2JqZWN0XHJcblxyXG4gICAgaWYgKHJlcS5tZXRob2QgPT0gXCJQT1NUXCIpXHJcbiAgICAgIGJ1c2JveSA9IG5ldyBCdXNib3koeyBoZWFkZXJzOiByZXEuaGVhZGVycyB9KTtcclxuICAgICAgYnVzYm95Lm9uIFwiZmlsZVwiLCAgKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkgLT5cclxuICAgICAgICBpbWFnZS5taW1lVHlwZSA9IG1pbWV0eXBlO1xyXG4gICAgICAgIGltYWdlLmVuY29kaW5nID0gZW5jb2Rpbmc7XHJcbiAgICAgICAgaW1hZ2UuZmlsZW5hbWUgPSBmaWxlbmFtZTtcclxuXHJcbiAgICAgICAgIyBidWZmZXIgdGhlIHJlYWQgY2h1bmtzXHJcbiAgICAgICAgYnVmZmVycyA9IFtdO1xyXG5cclxuICAgICAgICBmaWxlLm9uICdkYXRhJywgKGRhdGEpIC0+XHJcbiAgICAgICAgICBidWZmZXJzLnB1c2goZGF0YSk7XHJcblxyXG4gICAgICAgIGZpbGUub24gJ2VuZCcsICgpIC0+XHJcbiAgICAgICAgICAjIGNvbmNhdCB0aGUgY2h1bmtzXHJcbiAgICAgICAgICBpbWFnZS5kYXRhID0gQnVmZmVyLmNvbmNhdChidWZmZXJzKTtcclxuICAgICAgICAgICMgcHVzaCB0aGUgaW1hZ2Ugb2JqZWN0IHRvIHRoZSBmaWxlIGFycmF5XHJcbiAgICAgICAgICBmaWxlcy5wdXNoKGltYWdlKTtcclxuXHJcblxyXG4gICAgICBidXNib3kub24gXCJmaWVsZFwiLCAoZmllbGRuYW1lLCB2YWx1ZSkgLT5cclxuICAgICAgICByZXEuYm9keVtmaWVsZG5hbWVdID0gdmFsdWU7XHJcblxyXG4gICAgICBidXNib3kub24gXCJmaW5pc2hcIiwgICgpIC0+XHJcbiAgICAgICAgIyBQYXNzIHRoZSBmaWxlIGFycmF5IHRvZ2V0aGVyIHdpdGggdGhlIHJlcXVlc3RcclxuICAgICAgICByZXEuZmlsZXMgPSBmaWxlcztcclxuXHJcbiAgICAgICAgRmliZXIgKCktPlxyXG4gICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgIC5ydW4oKTtcclxuXHJcbiAgICAgICMgUGFzcyByZXF1ZXN0IHRvIGJ1c2JveVxyXG4gICAgICByZXEucGlwZShidXNib3kpO1xyXG5cclxuICAgIGVsc2VcclxuICAgICAgbmV4dCgpO1xyXG5cclxuXHJcbiNKc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKEpzb25Sb3V0ZXMucGFyc2VGaWxlcyk7XHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHJcbiAgSnNvblJvdXRlcy5wYXJzZUZpbGVzIHJlcSwgcmVzLCAoKS0+XHJcbiAgICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlc1xyXG5cclxuICAgIGlmIHJlcS5maWxlcyBhbmQgcmVxLmZpbGVzWzBdXHJcblxyXG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcclxuICAgICAgbmV3RmlsZS5hdHRhY2hEYXRhIHJlcS5maWxlc1swXS5kYXRhLCB7dHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlfSwgKGVycikgLT5cclxuICAgICAgICBmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZVxyXG5cclxuICAgICAgICBpZiBbXCJpbWFnZS5qcGdcIiwgXCJpbWFnZS5naWZcIiwgXCJpbWFnZS5qcGVnXCIsIFwiaW1hZ2UucG5nXCJdLmluY2x1ZGVzKGZpbGVuYW1lLnRvTG93ZXJDYXNlKCkpXHJcbiAgICAgICAgICBmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpXHJcblxyXG4gICAgICAgIGJvZHkgPSByZXEuYm9keVxyXG4gICAgICAgIHRyeVxyXG4gICAgICAgICAgaWYgYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIklFXCIgb3IgYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIm5vZGVcIilcclxuICAgICAgICAgICAgZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpXHJcbiAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgY29uc29sZS5lcnJvcihmaWxlbmFtZSlcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxyXG4gICAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8lL2csIFwiLVwiKVxyXG5cclxuICAgICAgICBuZXdGaWxlLm5hbWUoZmlsZW5hbWUpXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ293bmVyX25hbWUnXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ2luc3RhbmNlJ10gICYmIGJvZHlbJ2FwcHJvdmUnXVxyXG4gICAgICAgICAgcGFyZW50ID0gJydcclxuICAgICAgICAgIG1ldGFkYXRhID0ge293bmVyOmJvZHlbJ293bmVyJ10sIG93bmVyX25hbWU6Ym9keVsnb3duZXJfbmFtZSddLCBzcGFjZTpib2R5WydzcGFjZSddLCBpbnN0YW5jZTpib2R5WydpbnN0YW5jZSddLCBhcHByb3ZlOiBib2R5WydhcHByb3ZlJ10sIGN1cnJlbnQ6IHRydWV9XHJcblxyXG4gICAgICAgICAgaWYgYm9keVtcImlzX3ByaXZhdGVcIl0gJiYgYm9keVtcImlzX3ByaXZhdGVcIl0udG9Mb2NhbGVMb3dlckNhc2UoKSA9PSBcInRydWVcIlxyXG4gICAgICAgICAgICBtZXRhZGF0YS5pc19wcml2YXRlID0gdHJ1ZVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBtZXRhZGF0YS5pc19wcml2YXRlID0gZmFsc2VcclxuXHJcbiAgICAgICAgICBpZiBib2R5WydtYWluJ10gPT0gXCJ0cnVlXCJcclxuICAgICAgICAgICAgbWV0YWRhdGEubWFpbiA9IHRydWVcclxuXHJcbiAgICAgICAgICBpZiBib2R5Wydpc0FkZFZlcnNpb24nXSAmJiBib2R5WydwYXJlbnQnXVxyXG4gICAgICAgICAgICBwYXJlbnQgPSBib2R5WydwYXJlbnQnXVxyXG4gICAgICAgICAgIyBlbHNlXHJcbiAgICAgICAgICAjICAgY29sbGVjdGlvbi5maW5kKHsnbWV0YWRhdGEuaW5zdGFuY2UnOiBib2R5WydpbnN0YW5jZSddLCAnbWV0YWRhdGEuY3VycmVudCcgOiB0cnVlfSkuZm9yRWFjaCAoYykgLT5cclxuICAgICAgICAgICMgICAgIGlmIGMubmFtZSgpID09IGZpbGVuYW1lXHJcbiAgICAgICAgICAjICAgICAgIHBhcmVudCA9IGMubWV0YWRhdGEucGFyZW50XHJcblxyXG4gICAgICAgICAgaWYgcGFyZW50XHJcbiAgICAgICAgICAgIHIgPSBjb2xsZWN0aW9uLnVwZGF0ZSh7J21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCwgJ21ldGFkYXRhLmN1cnJlbnQnIDogdHJ1ZX0sIHskdW5zZXQgOiB7J21ldGFkYXRhLmN1cnJlbnQnIDogJyd9fSlcclxuICAgICAgICAgICAgaWYgclxyXG4gICAgICAgICAgICAgIG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudFxyXG4gICAgICAgICAgICAgIGlmIGJvZHlbJ2xvY2tlZF9ieSddICYmIGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ11cclxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieSA9IGJvZHlbJ2xvY2tlZF9ieSddXHJcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnlfbmFtZSA9IGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ11cclxuXHJcbiAgICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXHJcbiAgICAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcclxuXHJcbiAgICAgICAgICAgICAgIyDliKDpmaTlkIzkuIDkuKrnlLPor7fljZXlkIzkuIDkuKrmraXpqqTlkIzkuIDkuKrkurrkuIrkvKDnmoTph43lpI3nmoTmlofku7ZcclxuICAgICAgICAgICAgICBpZiBib2R5W1wib3ZlcndyaXRlXCJdICYmIGJvZHlbXCJvdmVyd3JpdGVcIl0udG9Mb2NhbGVMb3dlckNhc2UoKSA9PSBcInRydWVcIlxyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5yZW1vdmUoeydtZXRhZGF0YS5pbnN0YW5jZSc6IGJvZHlbJ2luc3RhbmNlJ10sICdtZXRhZGF0YS5wYXJlbnQnOiBwYXJlbnQsICdtZXRhZGF0YS5vd25lcic6IGJvZHlbJ293bmVyJ10sICdtZXRhZGF0YS5hcHByb3ZlJzogYm9keVsnYXBwcm92ZSddLCAnbWV0YWRhdGEuY3VycmVudCc6IHskbmU6IHRydWV9fSlcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXHJcbiAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcbiAgICAgICAgICAgIGZpbGVPYmoudXBkYXRlKHskc2V0OiB7J21ldGFkYXRhLnBhcmVudCcgOiBmaWxlT2JqLl9pZH19KVxyXG5cclxuICAgICAgICAjIOWFvOWuueiAgeeJiOacrFxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXHJcblxyXG5cclxuICAgICAgICBzaXplID0gZmlsZU9iai5vcmlnaW5hbC5zaXplXHJcbiAgICAgICAgaWYgIXNpemVcclxuICAgICAgICAgIHNpemUgPSAxMDI0XHJcblxyXG4gICAgICAgIHJlc3AgPVxyXG4gICAgICAgICAgdmVyc2lvbl9pZDogZmlsZU9iai5faWQsXHJcbiAgICAgICAgICBzaXplOiBzaXplXHJcblxyXG4gICAgICAgIHJlcy5zZXRIZWFkZXIoXCJ4LWFtei12ZXJzaW9uLWlkXCIsZmlsZU9iai5faWQpO1xyXG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgZWxzZVxyXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcclxuICAgICAgcmVzLmVuZCgpO1xyXG5cclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZGVsZXRlXCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblxyXG4gIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzXHJcblxyXG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XHJcbiAgaWYgaWRcclxuICAgIGZpbGUgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IGlkIH0pXHJcbiAgICBpZiBmaWxlXHJcbiAgICAgIGZpbGUucmVtb3ZlKClcclxuICAgICAgcmVzcCA9IHtcclxuICAgICAgICBzdGF0dXM6IFwiT0tcIlxyXG4gICAgICB9XHJcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xyXG4gICAgICByZXR1cm5cclxuXHJcbiAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XHJcbiAgcmVzLmVuZCgpO1xyXG5cclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XHJcblxyXG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XHJcblxyXG4gIHJlcy5zdGF0dXNDb2RlID0gMzAyO1xyXG4gIHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2luc3RhbmNlcy9cIikgKyBpZCArIFwiP2Rvd25sb2FkPTFcIlxyXG4gIHJlcy5lbmQoKTtcclxuXHJcblxyXG4jIE1ldGVvci5tZXRob2RzXHJcblxyXG4jICAgczNfdXBncmFkZTogKG1pbiwgbWF4KSAtPlxyXG4jICAgICBjb25zb2xlLmxvZyhcIi9zMy91cGdyYWRlXCIpXHJcblxyXG4jICAgICBmcyA9IHJlcXVpcmUoJ2ZzJylcclxuIyAgICAgbWltZSA9IHJlcXVpcmUoJ21pbWUnKVxyXG5cclxuIyAgICAgcm9vdF9wYXRoID0gXCIvbW50L2Zha2VzMy8xMFwiXHJcbiMgICAgIGNvbnNvbGUubG9nKHJvb3RfcGF0aClcclxuIyAgICAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXNcclxuXHJcbiMgICAgICMg6YGN5Y6GaW5zdGFuY2Ug5ou85Ye66ZmE5Lu26Lev5b6EIOWIsOacrOWcsOaJvuWvueW6lOaWh+S7tiDliIbkuKTnp43mg4XlhrUgMS4vZmlsZW5hbWVfdmVyc2lvbklkIDIuL2ZpbGVuYW1l77ybXHJcbiMgICAgIGRlYWxfd2l0aF92ZXJzaW9uID0gKHJvb3RfcGF0aCwgc3BhY2UsIGluc19pZCwgdmVyc2lvbiwgYXR0YWNoX2ZpbGVuYW1lKSAtPlxyXG4jICAgICAgIF9yZXYgPSB2ZXJzaW9uLl9yZXZcclxuIyAgICAgICBpZiAoY29sbGVjdGlvbi5maW5kKHtcIl9pZFwiOiBfcmV2fSkuY291bnQoKSA+MClcclxuIyAgICAgICAgIHJldHVyblxyXG4jICAgICAgIGNyZWF0ZWRfYnkgPSB2ZXJzaW9uLmNyZWF0ZWRfYnlcclxuIyAgICAgICBhcHByb3ZlID0gdmVyc2lvbi5hcHByb3ZlXHJcbiMgICAgICAgZmlsZW5hbWUgPSB2ZXJzaW9uLmZpbGVuYW1lIHx8IGF0dGFjaF9maWxlbmFtZTtcclxuIyAgICAgICBtaW1lX3R5cGUgPSBtaW1lLmxvb2t1cChmaWxlbmFtZSlcclxuIyAgICAgICBuZXdfcGF0aCA9IHJvb3RfcGF0aCArIFwiL3NwYWNlcy9cIiArIHNwYWNlICsgXCIvd29ya2Zsb3cvXCIgKyBpbnNfaWQgKyBcIi9cIiArIGZpbGVuYW1lICsgXCJfXCIgKyBfcmV2XHJcbiMgICAgICAgb2xkX3BhdGggPSByb290X3BhdGggKyBcIi9zcGFjZXMvXCIgKyBzcGFjZSArIFwiL3dvcmtmbG93L1wiICsgaW5zX2lkICsgXCIvXCIgKyBmaWxlbmFtZVxyXG5cclxuIyAgICAgICByZWFkRmlsZSA9IChmdWxsX3BhdGgpIC0+XHJcbiMgICAgICAgICBkYXRhID0gZnMucmVhZEZpbGVTeW5jIGZ1bGxfcGF0aFxyXG5cclxuIyAgICAgICAgIGlmIGRhdGFcclxuIyAgICAgICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XHJcbiMgICAgICAgICAgIG5ld0ZpbGUuX2lkID0gX3JldjtcclxuIyAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IHtvd25lcjpjcmVhdGVkX2J5LCBzcGFjZTpzcGFjZSwgaW5zdGFuY2U6aW5zX2lkLCBhcHByb3ZlOiBhcHByb3ZlfTtcclxuIyAgICAgICAgICAgbmV3RmlsZS5hdHRhY2hEYXRhIGRhdGEsIHt0eXBlOiBtaW1lX3R5cGV9XHJcbiMgICAgICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSlcclxuIyAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcclxuIyAgICAgICAgICAgY29uc29sZS5sb2coZmlsZU9iai5faWQpXHJcblxyXG4jICAgICAgIHRyeVxyXG4jICAgICAgICAgbiA9IGZzLnN0YXRTeW5jIG5ld19wYXRoXHJcbiMgICAgICAgICBpZiBuICYmIG4uaXNGaWxlKClcclxuIyAgICAgICAgICAgcmVhZEZpbGUgbmV3X3BhdGhcclxuIyAgICAgICBjYXRjaCBlcnJvclxyXG4jICAgICAgICAgdHJ5XHJcbiMgICAgICAgICAgIG9sZCA9IGZzLnN0YXRTeW5jIG9sZF9wYXRoXHJcbiMgICAgICAgICAgIGlmIG9sZCAmJiBvbGQuaXNGaWxlKClcclxuIyAgICAgICAgICAgICByZWFkRmlsZSBvbGRfcGF0aFxyXG4jICAgICAgICAgY2F0Y2ggZXJyb3JcclxuIyAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZpbGUgbm90IGZvdW5kOiBcIiArIG9sZF9wYXRoKVxyXG5cclxuXHJcbiMgICAgIGNvdW50ID0gZGIuaW5zdGFuY2VzLmZpbmQoe1wiYXR0YWNobWVudHMuY3VycmVudFwiOiB7JGV4aXN0czogdHJ1ZX19LCB7c29ydDoge21vZGlmaWVkOiAtMX19KS5jb3VudCgpO1xyXG4jICAgICBjb25zb2xlLmxvZyhcImFsbCBpbnN0YW5jZXM6IFwiICsgY291bnQpXHJcblxyXG4jICAgICBiID0gbmV3IERhdGUoKVxyXG5cclxuIyAgICAgaSA9IG1pblxyXG4jICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgc2tpcDogbWluLCBsaW1pdDogbWF4LW1pbn0pLmZvckVhY2ggKGlucykgLT5cclxuIyAgICAgICBpID0gaSArIDFcclxuIyAgICAgICBjb25zb2xlLmxvZyhpICsgXCI6XCIgKyBpbnMubmFtZSlcclxuIyAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzXHJcbiMgICAgICAgc3BhY2UgPSBpbnMuc3BhY2VcclxuIyAgICAgICBpbnNfaWQgPSBpbnMuX2lkXHJcbiMgICAgICAgYXR0YWNocy5mb3JFYWNoIChhdHQpIC0+XHJcbiMgICAgICAgICBkZWFsX3dpdGhfdmVyc2lvbiByb290X3BhdGgsIHNwYWNlLCBpbnNfaWQsIGF0dC5jdXJyZW50LCBhdHQuZmlsZW5hbWVcclxuIyAgICAgICAgIGlmIGF0dC5oaXN0b3J5c1xyXG4jICAgICAgICAgICBhdHQuaGlzdG9yeXMuZm9yRWFjaCAoaGlzKSAtPlxyXG4jICAgICAgICAgICAgIGRlYWxfd2l0aF92ZXJzaW9uIHJvb3RfcGF0aCwgc3BhY2UsIGluc19pZCwgaGlzLCBhdHQuZmlsZW5hbWVcclxuXHJcbiMgICAgIGNvbnNvbGUubG9nKG5ldyBEYXRlKCkgLSBiKVxyXG5cclxuIyAgICAgcmV0dXJuIFwib2tcIlxyXG4iLCJ2YXIgQnVzYm95LCBGaWJlcjtcblxuQnVzYm95ID0gcmVxdWlyZSgnYnVzYm95Jyk7XG5cbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbkpzb25Sb3V0ZXMucGFyc2VGaWxlcyA9IGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBidXNib3ksIGZpbGVzLCBpbWFnZTtcbiAgZmlsZXMgPSBbXTtcbiAgaW1hZ2UgPSB7fTtcbiAgaWYgKHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgYnVzYm95ID0gbmV3IEJ1c2JveSh7XG4gICAgICBoZWFkZXJzOiByZXEuaGVhZGVyc1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpbGVcIiwgZnVuY3Rpb24oZmllbGRuYW1lLCBmaWxlLCBmaWxlbmFtZSwgZW5jb2RpbmcsIG1pbWV0eXBlKSB7XG4gICAgICB2YXIgYnVmZmVycztcbiAgICAgIGltYWdlLm1pbWVUeXBlID0gbWltZXR5cGU7XG4gICAgICBpbWFnZS5lbmNvZGluZyA9IGVuY29kaW5nO1xuICAgICAgaW1hZ2UuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbiAgICAgIGJ1ZmZlcnMgPSBbXTtcbiAgICAgIGZpbGUub24oJ2RhdGEnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHJldHVybiBidWZmZXJzLnB1c2goZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmaWxlLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaW1hZ2UuZGF0YSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycyk7XG4gICAgICAgIHJldHVybiBmaWxlcy5wdXNoKGltYWdlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpZWxkXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiByZXEuYm9keVtmaWVsZG5hbWVdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgYnVzYm95Lm9uKFwiZmluaXNoXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgcmVxLmZpbGVzID0gZmlsZXM7XG4gICAgICByZXR1cm4gRmliZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICB9KS5ydW4oKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVxLnBpcGUoYnVzYm95KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG59O1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyhyZXEsIHJlcywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIG5ld0ZpbGU7XG4gICAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXM7XG4gICAgaWYgKHJlcS5maWxlcyAmJiByZXEuZmlsZXNbMF0pIHtcbiAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuICAgICAgcmV0dXJuIG5ld0ZpbGUuYXR0YWNoRGF0YShyZXEuZmlsZXNbMF0uZGF0YSwge1xuICAgICAgICB0eXBlOiByZXEuZmlsZXNbMF0ubWltZVR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICB2YXIgYm9keSwgZSwgZmlsZU9iaiwgZmlsZW5hbWUsIG1ldGFkYXRhLCBwYXJlbnQsIHIsIHJlc3AsIHNpemU7XG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lO1xuICAgICAgICBpZiAoW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSA9IHJlcS5ib2R5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChib2R5ICYmIChib2R5Wyd1cGxvYWRfZnJvbSddID09PSBcIklFXCIgfHwgYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJub2RlXCIpKSB7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZpbGVuYW1lKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUucmVwbGFjZSgvJS9nLCBcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKTtcbiAgICAgICAgaWYgKGJvZHkgJiYgYm9keVsnb3duZXInXSAmJiBib2R5Wydvd25lcl9uYW1lJ10gJiYgYm9keVsnc3BhY2UnXSAmJiBib2R5WydpbnN0YW5jZSddICYmIGJvZHlbJ2FwcHJvdmUnXSkge1xuICAgICAgICAgIHBhcmVudCA9ICcnO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgb3duZXI6IGJvZHlbJ293bmVyJ10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBib2R5Wydvd25lcl9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogYm9keVsnc3BhY2UnXSxcbiAgICAgICAgICAgIGluc3RhbmNlOiBib2R5WydpbnN0YW5jZSddLFxuICAgICAgICAgICAgYXBwcm92ZTogYm9keVsnYXBwcm92ZSddLFxuICAgICAgICAgICAgY3VycmVudDogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKGJvZHlbXCJpc19wcml2YXRlXCJdICYmIGJvZHlbXCJpc19wcml2YXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5pc19wcml2YXRlID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYm9keVsnbWFpbiddID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgbWV0YWRhdGEubWFpbiA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChib2R5Wydpc0FkZFZlcnNpb24nXSAmJiBib2R5WydwYXJlbnQnXSkge1xuICAgICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J107XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIHIgPSBjb2xsZWN0aW9uLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBwYXJlbnQsXG4gICAgICAgICAgICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAkdW5zZXQ6IHtcbiAgICAgICAgICAgICAgICAnbWV0YWRhdGEuY3VycmVudCc6ICcnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgbWV0YWRhdGEucGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgICAgICBpZiAoYm9keVsnbG9ja2VkX2J5J10gJiYgYm9keVsnbG9ja2VkX2J5X25hbWUnXSkge1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieSA9IGJvZHlbJ2xvY2tlZF9ieSddO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieV9uYW1lID0gYm9keVsnbG9ja2VkX2J5X25hbWUnXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgICAgICAgaWYgKGJvZHlbXCJvdmVyd3JpdGVcIl0gJiYgYm9keVtcIm92ZXJ3cml0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHtcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGJvZHlbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLm93bmVyJzogYm9keVsnb3duZXInXSxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5hcHByb3ZlJzogYm9keVsnYXBwcm92ZSddLFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICRuZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgICAgIGZpbGVPYmoudXBkYXRlKHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICdtZXRhZGF0YS5wYXJlbnQnOiBmaWxlT2JqLl9pZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0KG5ld0ZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHNpemUgPSBmaWxlT2JqLm9yaWdpbmFsLnNpemU7XG4gICAgICAgIGlmICghc2l6ZSkge1xuICAgICAgICAgIHNpemUgPSAxMDI0O1xuICAgICAgICB9XG4gICAgICAgIHJlc3AgPSB7XG4gICAgICAgICAgdmVyc2lvbl9pZDogZmlsZU9iai5faWQsXG4gICAgICAgICAgc2l6ZTogc2l6ZVxuICAgICAgICB9O1xuICAgICAgICByZXMuc2V0SGVhZGVyKFwieC1hbXotdmVyc2lvbi1pZFwiLCBmaWxlT2JqLl9pZCk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgcmV0dXJuIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZGVsZXRlXCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBjb2xsZWN0aW9uLCBmaWxlLCBpZCwgcmVzcDtcbiAgY29sbGVjdGlvbiA9IGNmcy5pbnN0YW5jZXM7XG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XG4gIGlmIChpZCkge1xuICAgIGZpbGUgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1xuICAgICAgX2lkOiBpZFxuICAgIH0pO1xuICAgIGlmIChmaWxlKSB7XG4gICAgICBmaWxlLnJlbW92ZSgpO1xuICAgICAgcmVzcCA9IHtcbiAgICAgICAgc3RhdHVzOiBcIk9LXCJcbiAgICAgIH07XG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gIHJldHVybiByZXMuZW5kKCk7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGlkO1xuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xuICByZXMuc3RhdHVzQ29kZSA9IDMwMjtcbiAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvaW5zdGFuY2VzL1wiKSArIGlkICsgXCI/ZG93bmxvYWQ9MVwiKTtcbiAgcmV0dXJuIHJlcy5lbmQoKTtcbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9wdXNoL21lc3NhZ2VcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgaWYgcmVxLmJvZHk/LnB1c2hUb3BpYyBhbmQgcmVxLmJvZHkudXNlcklkcyBhbmQgcmVxLmJvZHkuZGF0YVxyXG4gICAgICAgIG1lc3NhZ2UgPSBcclxuICAgICAgICAgICAgZnJvbTogXCJzdGVlZG9zXCJcclxuICAgICAgICAgICAgcXVlcnk6XHJcbiAgICAgICAgICAgICAgICBhcHBOYW1lOiByZXEuYm9keS5wdXNoVG9waWNcclxuICAgICAgICAgICAgICAgIHVzZXJJZDogXHJcbiAgICAgICAgICAgICAgICAgICAgXCIkaW5cIjogdXNlcklkc1xyXG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZT9cclxuICAgICAgICAgICAgbWVzc2FnZVtcInRpdGxlXCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlXHJcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5hbGVydD9cclxuICAgICAgICAgICAgbWVzc2FnZVtcInRleHRcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0XHJcbiAgICAgICAgaWYgcmVxLmJvZHkuZGF0YS5iYWRnZT9cclxuICAgICAgICAgICAgbWVzc2FnZVtcImJhZGdlXCJdID0gcmVxLmJvZHkuZGF0YS5iYWRnZSArIFwiXCJcclxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLnNvdW5kP1xyXG4gICAgICAgICAgICBtZXNzYWdlW1wic291bmRcIl0gPSByZXEuYm9keS5kYXRhLnNvdW5kXHJcbiAgICAgICAgI2lmIHJlcS5ib2R5LmRhdGEuZGF0YT9cclxuICAgICAgICAjICAgIG1lc3NhZ2VbXCJkYXRhXCJdID0gcmVxLmJvZHkuZGF0YS5kYXRhXHJcbiAgICAgICAgUHVzaC5zZW5kIG1lc3NhZ2VcclxuXHJcbiAgICAgICAgcmVzLmVuZChcInN1Y2Nlc3NcIik7XHJcblxyXG5cclxuXHJcbk1ldGVvci5tZXRob2RzXHJcbiAgICBwdXNoU2VuZDogKHRleHQsdGl0bGUsYmFkZ2UsdXNlcklkKSAtPlxyXG4gICAgICAgIGlmICghdXNlcklkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgUHVzaC5zZW5kXHJcbiAgICAgICAgICAgIGZyb206ICdzdGVlZG9zJyxcclxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICBiYWRnZTogYmFkZ2UsXHJcbiAgICAgICAgICAgIHF1ZXJ5OiBcclxuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXHJcbiAgICAgICAgICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcclxuIiwiSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9wdXNoL21lc3NhZ2VcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIG1lc3NhZ2UsIHJlZjtcbiAgaWYgKCgocmVmID0gcmVxLmJvZHkpICE9IG51bGwgPyByZWYucHVzaFRvcGljIDogdm9pZCAwKSAmJiByZXEuYm9keS51c2VySWRzICYmIHJlcS5ib2R5LmRhdGEpIHtcbiAgICBtZXNzYWdlID0ge1xuICAgICAgZnJvbTogXCJzdGVlZG9zXCIsXG4gICAgICBxdWVyeToge1xuICAgICAgICBhcHBOYW1lOiByZXEuYm9keS5wdXNoVG9waWMsXG4gICAgICAgIHVzZXJJZDoge1xuICAgICAgICAgIFwiJGluXCI6IHVzZXJJZHNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZSAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1widGl0bGVcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGU7XG4gICAgfVxuICAgIGlmIChyZXEuYm9keS5kYXRhLmFsZXJ0ICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJ0ZXh0XCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydDtcbiAgICB9XG4gICAgaWYgKHJlcS5ib2R5LmRhdGEuYmFkZ2UgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcImJhZGdlXCJdID0gcmVxLmJvZHkuZGF0YS5iYWRnZSArIFwiXCI7XG4gICAgfVxuICAgIGlmIChyZXEuYm9keS5kYXRhLnNvdW5kICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJzb3VuZFwiXSA9IHJlcS5ib2R5LmRhdGEuc291bmQ7XG4gICAgfVxuICAgIFB1c2guc2VuZChtZXNzYWdlKTtcbiAgICByZXR1cm4gcmVzLmVuZChcInN1Y2Nlc3NcIik7XG4gIH1cbn0pO1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gIHB1c2hTZW5kOiBmdW5jdGlvbih0ZXh0LCB0aXRsZSwgYmFkZ2UsIHVzZXJJZCkge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBQdXNoLnNlbmQoe1xuICAgICAgZnJvbTogJ3N0ZWVkb3MnLFxuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgdGV4dDogdGV4dCxcbiAgICAgIGJhZGdlOiBiYWRnZSxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJBTFkgPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XHJcblhpbmdlID0gcmVxdWlyZSgneGluZ2UnKTtcclxuSHdQdXNoID0gcmVxdWlyZSgnaHVhd2VpLXB1c2gnKTtcclxuTWlQdXNoID0gcmVxdWlyZSgneGlhb21pLXB1c2gnKTtcclxuXHJcbkFsaXl1bl9wdXNoID0ge307XHJcblxyXG5BbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSA9ICh1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIGNhbGxiYWNrKSAtPlxyXG5cdGlmIG5vdGlmaWNhdGlvbi50aXRsZSBhbmQgbm90aWZpY2F0aW9uLnRleHRcclxuXHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0Y29uc29sZS5sb2cgdXNlclRva2Vuc1xyXG5cclxuXHRcdGFsaXl1blRva2VucyA9IG5ldyBBcnJheVxyXG5cdFx0eGluZ2VUb2tlbnMgPSBuZXcgQXJyYXlcclxuXHRcdGh1YXdlaVRva2VucyA9IG5ldyBBcnJheVxyXG5cdFx0bWlUb2tlbnMgPSBuZXcgQXJyYXlcclxuXHJcblx0XHR1c2VyVG9rZW5zLmZvckVhY2ggKHVzZXJUb2tlbikgLT5cclxuXHRcdFx0YXJyID0gdXNlclRva2VuLnNwbGl0KCc6JylcclxuXHRcdFx0aWYgYXJyWzBdIGlzIFwiYWxpeXVuXCJcclxuXHRcdFx0XHRhbGl5dW5Ub2tlbnMucHVzaCBfLmxhc3QoYXJyKVxyXG5cdFx0XHRlbHNlIGlmIGFyclswXSBpcyBcInhpbmdlXCJcclxuXHRcdFx0XHR4aW5nZVRva2Vucy5wdXNoIF8ubGFzdChhcnIpXHJcblx0XHRcdGVsc2UgaWYgYXJyWzBdIGlzIFwiaHVhd2VpXCJcclxuXHRcdFx0XHRodWF3ZWlUb2tlbnMucHVzaCBfLmxhc3QoYXJyKVxyXG5cdFx0XHRlbHNlIGlmIGFyclswXSBpcyBcIm1pXCJcclxuXHRcdFx0XHRtaVRva2Vucy5wdXNoIF8ubGFzdChhcnIpXHJcblxyXG5cdFx0aWYgIV8uaXNFbXB0eShhbGl5dW5Ub2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYWxpeXVuXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyBcImFsaXl1blRva2VuczogI3thbGl5dW5Ub2tlbnN9XCJcclxuXHRcdFx0QUxZUFVTSCA9IG5ldyAoQUxZLlBVU0gpKFxyXG5cdFx0XHRcdGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYWNjZXNzS2V5SWRcclxuXHRcdFx0XHRzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5zZWNyZXRBY2Nlc3NLZXlcclxuXHRcdFx0XHRlbmRwb2ludDogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmVuZHBvaW50XHJcblx0XHRcdFx0YXBpVmVyc2lvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwaVZlcnNpb24pO1xyXG5cclxuXHRcdFx0ZGF0YSA9IFxyXG5cdFx0XHRcdEFwcEtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwcEtleVxyXG5cdFx0XHRcdFRhcmdldDogJ2RldmljZSdcclxuXHRcdFx0XHRUYXJnZXRWYWx1ZTogYWxpeXVuVG9rZW5zLnRvU3RyaW5nKClcclxuXHRcdFx0XHRUaXRsZTogbm90aWZpY2F0aW9uLnRpdGxlXHJcblx0XHRcdFx0U3VtbWFyeTogbm90aWZpY2F0aW9uLnRleHRcclxuXHJcblx0XHRcdEFMWVBVU0gucHVzaE5vdGljZVRvQW5kcm9pZCBkYXRhLCBjYWxsYmFja1xyXG5cclxuXHRcdGlmICFfLmlzRW1wdHkoeGluZ2VUb2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ueGluZ2VcclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwieGluZ2VUb2tlbnM6ICN7eGluZ2VUb2tlbnN9XCJcclxuXHRcdFx0WGluZ2VBcHAgPSBuZXcgWGluZ2UuWGluZ2VBcHAoTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2UuYWNjZXNzSWQsIE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLnNlY3JldEtleSlcclxuXHRcdFx0XHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlID0gbmV3IFhpbmdlLkFuZHJvaWRNZXNzYWdlXHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlLnR5cGUgPSBYaW5nZS5NRVNTQUdFX1RZUEVfTk9USUZJQ0FUSU9OXHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlLnRpdGxlID0gbm90aWZpY2F0aW9uLnRpdGxlXHJcblx0XHRcdGFuZHJvaWRNZXNzYWdlLmNvbnRlbnQgPSBub3RpZmljYXRpb24udGV4dFxyXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS5zdHlsZSA9IG5ldyBYaW5nZS5TdHlsZVxyXG5cdFx0XHRhbmRyb2lkTWVzc2FnZS5hY3Rpb24gPSBuZXcgWGluZ2UuQ2xpY2tBY3Rpb25cclxuXHJcblx0XHRcdF8uZWFjaCB4aW5nZVRva2VucywgKHQpLT5cclxuXHRcdFx0XHRYaW5nZUFwcC5wdXNoVG9TaW5nbGVEZXZpY2UgdCwgYW5kcm9pZE1lc3NhZ2UsIGNhbGxiYWNrXHJcblxyXG5cdFx0aWYgIV8uaXNFbXB0eShodWF3ZWlUb2tlbnMpIGFuZCBNZXRlb3Iuc2V0dGluZ3MucHVzaD8uaHVhd2VpXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyBcImh1YXdlaVRva2VuczogI3todWF3ZWlUb2tlbnN9XCJcclxuXHRcdFx0IyBtc2cgPSBuZXcgSHdQdXNoLk1lc3NhZ2VcclxuXHRcdFx0IyBtc2cudGl0bGUobm90aWZpY2F0aW9uLnRpdGxlKS5jb250ZW50KG5vdGlmaWNhdGlvbi50ZXh0KVxyXG5cdFx0XHQjIG1zZy5leHRyYXMobm90aWZpY2F0aW9uLnBheWxvYWQpXHJcblx0XHRcdCMgbm90aWZpY2F0aW9uID0gbmV3IEh3UHVzaC5Ob3RpZmljYXRpb24oXHJcblx0XHRcdCMgXHRhcHBJZDogTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpLmFwcElkXHJcblx0XHRcdCMgXHRhcHBTZWNyZXQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBTZWNyZXRcclxuXHRcdFx0IyApXHJcblx0XHRcdCMgXy5lYWNoIGh1YXdlaVRva2VucywgKHQpLT5cclxuXHRcdFx0IyBcdG5vdGlmaWNhdGlvbi5zZW5kIHQsIG1zZywgY2FsbGJhY2tcclxuXHJcblxyXG5cdFx0XHRwYWNrYWdlX25hbWUgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwUGtnTmFtZVxyXG5cdFx0XHR0b2tlbkRhdGFMaXN0ID0gW11cclxuXHRcdFx0Xy5lYWNoIGh1YXdlaVRva2VucywgKHQpLT5cclxuXHRcdFx0XHR0b2tlbkRhdGFMaXN0LnB1c2goeydwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsICd0b2tlbic6IHR9KVxyXG5cdFx0XHRub3RpID0geydhbmRyb2lkJzogeyd0aXRsZSc6IG5vdGlmaWNhdGlvbi50aXRsZSwgJ21lc3NhZ2UnOiBub3RpZmljYXRpb24udGV4dH0sICdleHRyYXMnOiBub3RpZmljYXRpb24ucGF5bG9hZH1cclxuXHJcblx0XHRcdEh1YXdlaVB1c2guY29uZmlnIFt7J3BhY2thZ2VfbmFtZSc6IHBhY2thZ2VfbmFtZSwgJ2NsaWVudF9pZCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBJZCwgJ2NsaWVudF9zZWNyZXQnOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuYXBwU2VjcmV0fV1cclxuXHRcdFx0XHJcblx0XHRcdEh1YXdlaVB1c2guc2VuZE1hbnkgbm90aSwgdG9rZW5EYXRhTGlzdFxyXG5cclxuXHJcblx0XHRpZiAhXy5pc0VtcHR5KG1pVG9rZW5zKSBhbmQgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lm1pXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyBcIm1pVG9rZW5zOiAje21pVG9rZW5zfVwiXHJcblx0XHRcdG1zZyA9IG5ldyBNaVB1c2guTWVzc2FnZVxyXG5cdFx0XHRtc2cudGl0bGUobm90aWZpY2F0aW9uLnRpdGxlKS5kZXNjcmlwdGlvbihub3RpZmljYXRpb24udGV4dClcclxuXHRcdFx0bm90aWZpY2F0aW9uID0gbmV3IE1pUHVzaC5Ob3RpZmljYXRpb24oXHJcblx0XHRcdFx0cHJvZHVjdGlvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkucHJvZHVjdGlvblxyXG5cdFx0XHRcdGFwcFNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkuYXBwU2VjcmV0XHJcblx0XHRcdClcclxuXHRcdFx0Xy5lYWNoIG1pVG9rZW5zLCAocmVnaWQpLT5cclxuXHRcdFx0XHRub3RpZmljYXRpb24uc2VuZCByZWdpZCwgbXNnLCBjYWxsYmFja1xyXG5cclxuXHJcbk1ldGVvci5zdGFydHVwIC0+XHJcblx0XHJcblx0aWYgbm90IE1ldGVvci5zZXR0aW5ncy5jcm9uPy5wdXNoX2ludGVydmFsXHJcblx0XHRyZXR1cm5cclxuXHJcblx0Y29uZmlnID0ge1xyXG5cdFx0ZGVidWc6IHRydWVcclxuXHRcdGtlZXBOb3RpZmljYXRpb25zOiBmYWxzZVxyXG5cdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5wdXNoX2ludGVydmFsXHJcblx0XHRzZW5kQmF0Y2hTaXplOiAxMFxyXG5cdFx0cHJvZHVjdGlvbjogdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgIV8uaXNFbXB0eShNZXRlb3Iuc2V0dGluZ3MucHVzaD8uYXBuKVxyXG5cdFx0Y29uZmlnLmFwbiA9IHtcclxuXHRcdFx0a2V5RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmtleURhdGFcclxuXHRcdFx0Y2VydERhdGE6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFwbi5jZXJ0RGF0YVxyXG5cdFx0fVxyXG5cdGlmICFfLmlzRW1wdHkoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmdjbSlcclxuXHRcdGNvbmZpZy5nY20gPSB7XHJcblx0XHRcdHByb2plY3ROdW1iZXI6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5wcm9qZWN0TnVtYmVyXHJcblx0XHRcdGFwaUtleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guZ2NtLmFwaUtleVxyXG5cdFx0fVxyXG5cclxuXHRQdXNoLkNvbmZpZ3VyZSBjb25maWdcclxuXHRcclxuXHRpZiAoTWV0ZW9yLnNldHRpbmdzLnB1c2g/LmFsaXl1biBvciBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ueGluZ2Ugb3IgTWV0ZW9yLnNldHRpbmdzLnB1c2g/Lmh1YXdlaSBvciBNZXRlb3Iuc2V0dGluZ3MucHVzaD8ubWkpIGFuZCBQdXNoIGFuZCB0eXBlb2YgUHVzaC5zZW5kR0NNID09ICdmdW5jdGlvbidcclxuXHRcdFxyXG5cdFx0UHVzaC5vbGRfc2VuZEdDTSA9IFB1c2guc2VuZEdDTTtcclxuXHJcblx0XHRQdXNoLnNlbmRBbGl5dW4gPSAodXNlclRva2Vucywgbm90aWZpY2F0aW9uKSAtPlxyXG5cdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb25cclxuXHJcblx0XHRcdGlmIE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KVxyXG5cdFx0XHRcdG5vdGlmaWNhdGlvbiA9IF8uZXh0ZW5kKHt9LCBub3RpZmljYXRpb24sIG5vdGlmaWNhdGlvbi5nY20pXHJcblx0XHRcdCMgTWFrZSBzdXJlIHVzZXJUb2tlbnMgYXJlIGFuIGFycmF5IG9mIHN0cmluZ3NcclxuXHRcdFx0aWYgdXNlclRva2VucyA9PSAnJyArIHVzZXJUb2tlbnNcclxuXHRcdFx0XHR1c2VyVG9rZW5zID0gWyB1c2VyVG9rZW5zIF1cclxuXHRcdFx0IyBDaGVjayBpZiBhbnkgdG9rZW5zIGluIHRoZXJlIHRvIHNlbmRcclxuXHRcdFx0aWYgIXVzZXJUb2tlbnMubGVuZ3RoXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnc2VuZEFsaXl1bicsIHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvblxyXG5cclxuXHRcdFx0RmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKVxyXG5cdCAgXHJcblx0XHRcdHVzZXJUb2tlbiA9IGlmIHVzZXJUb2tlbnMubGVuZ3RoID09IDEgdGhlbiB1c2VyVG9rZW5zWzBdIGVsc2UgbnVsbFxyXG5cdFx0XHRBbGl5dW5fcHVzaC5zZW5kTWVzc2FnZSB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24sIChlcnIsIHJlc3VsdCkgLT5cclxuXHRcdFx0XHRpZiBlcnJcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nICdBTkRST0lEIEVSUk9SOiByZXN1bHQgb2Ygc2VuZGVyOiAnICsgcmVzdWx0XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0aWYgcmVzdWx0ID09IG51bGxcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXIgaXMgbnVsbCdcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXI6ICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpXHJcblxyXG5cdFx0XHRcdFx0aWYgcmVzdWx0LmNhbm9uaWNhbF9pZHMgPT0gMSBhbmQgdXNlclRva2VuXHJcblx0XHRcdFx0XHRcdEZpYmVyKChzZWxmKSAtPlxyXG5cdFx0XHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5jYWxsYmFjayBzZWxmLm9sZFRva2VuLCBzZWxmLm5ld1Rva2VuXHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyXHJcblx0XHRcdFx0XHRcdCkucnVuXHJcblx0XHRcdFx0XHRcdFx0b2xkVG9rZW46IGdjbTogdXNlclRva2VuXHJcblx0XHRcdFx0XHRcdFx0bmV3VG9rZW46IGdjbTogXCJhbGl5dW46XCIgKyByZXN1bHQucmVzdWx0c1swXS5yZWdpc3RyYXRpb25faWRcclxuXHRcdFx0XHRcdFx0XHRjYWxsYmFjazogX3JlcGxhY2VUb2tlblxyXG5cdFx0XHRcdFx0aWYgcmVzdWx0LmZhaWx1cmUgIT0gMCBhbmQgdXNlclRva2VuXHJcblx0XHRcdFx0XHRcdEZpYmVyKChzZWxmKSAtPlxyXG5cdFx0XHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRcdFx0c2VsZi5jYWxsYmFjayBzZWxmLnRva2VuXHJcblx0XHRcdFx0XHRcdFx0Y2F0Y2ggZXJyXHJcblx0XHRcdFx0XHRcdCkucnVuXHJcblx0XHRcdFx0XHRcdFx0dG9rZW46IGdjbTogdXNlclRva2VuXHJcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2s6IF9yZW1vdmVUb2tlblxyXG5cclxuXHJcblxyXG5cdFx0UHVzaC5zZW5kR0NNID0gKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikgLT5cclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNIGZyb20gYWxpeXVuLT4gUHVzaC5zZW5kR0NNJ1xyXG5cdFx0XHRpZiBNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdClcclxuXHRcdFx0XHRub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKVxyXG5cdFx0XHQjIE1ha2Ugc3VyZSB1c2VyVG9rZW5zIGFyZSBhbiBhcnJheSBvZiBzdHJpbmdzXHJcblx0XHRcdGlmIHVzZXJUb2tlbnMgPT0gJycgKyB1c2VyVG9rZW5zXHJcblx0XHRcdFx0dXNlclRva2VucyA9IFsgdXNlclRva2VucyBdXHJcblx0XHRcdCMgQ2hlY2sgaWYgYW55IHRva2VucyBpbiB0aGVyZSB0byBzZW5kXHJcblx0XHRcdGlmICF1c2VyVG9rZW5zLmxlbmd0aFxyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJ1xyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRpZiBQdXNoLmRlYnVnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ3NlbmRHQ00nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb25cclxuXHJcblx0XHRcdGFsaXl1blRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKChpdGVtKSAtPlxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5pbmRleE9mKCdhbGl5dW46JykgPiAtMSBvciBpdGVtLmluZGV4T2YoJ3hpbmdlOicpID4gLTEgb3IgaXRlbS5pbmRleE9mKCdodWF3ZWk6JykgPiAtMSBvciBpdGVtLmluZGV4T2YoJ21pOicpID4gLTFcclxuXHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdGlmIFB1c2guZGVidWdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnYWxpeXVuVG9rZW5zIGlzICcsIGFsaXl1blRva2Vucy50b1N0cmluZygpXHJcblxyXG5cdFx0XHRnY21Ub2tlbnMgPSB1c2VyVG9rZW5zLmZpbHRlcigoaXRlbSkgLT5cclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0uaW5kZXhPZihcImFsaXl1bjpcIikgPCAwIGFuZCBpdGVtLmluZGV4T2YoXCJ4aW5nZTpcIikgPCAwIGFuZCBpdGVtLmluZGV4T2YoXCJodWF3ZWk6XCIpIDwgMCBhbmQgaXRlbS5pbmRleE9mKFwibWk6XCIpIDwgMFxyXG5cdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0aWYgUHVzaC5kZWJ1Z1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdnY21Ub2tlbnMgaXMgJyAsIGdjbVRva2Vucy50b1N0cmluZygpO1xyXG5cclxuXHRcdFx0UHVzaC5zZW5kQWxpeXVuKGFsaXl1blRva2Vucywgbm90aWZpY2F0aW9uKTtcclxuXHJcblx0XHRcdFB1c2gub2xkX3NlbmRHQ00oZ2NtVG9rZW5zLCBub3RpZmljYXRpb24pO1xyXG5cclxuXHRcdFB1c2gub2xkX3NlbmRBUE4gPSBQdXNoLnNlbmRBUE5cclxuXHRcdFB1c2guc2VuZEFQTiA9ICh1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbikgLT5cclxuXHRcdFx0aWYgbm90aWZpY2F0aW9uLnRpdGxlIGFuZCBub3RpZmljYXRpb24udGV4dFxyXG5cdFx0XHRcdG5vdGkgPSBfLmNsb25lKG5vdGlmaWNhdGlvbilcclxuXHRcdFx0XHRub3RpLnRleHQgPSBub3RpLnRpdGxlICsgXCIgXCIgKyBub3RpLnRleHRcclxuXHRcdFx0XHRub3RpLnRpdGxlID0gXCJcIlxyXG5cdFx0XHRcdFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0UHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbilcclxuIiwidmFyIEFMWSwgQWxpeXVuX3B1c2gsIEh3UHVzaCwgTWlQdXNoLCBYaW5nZTtcblxuQUxZID0gcmVxdWlyZSgnYWxpeXVuLXNkaycpO1xuXG5YaW5nZSA9IHJlcXVpcmUoJ3hpbmdlJyk7XG5cbkh3UHVzaCA9IHJlcXVpcmUoJ2h1YXdlaS1wdXNoJyk7XG5cbk1pUHVzaCA9IHJlcXVpcmUoJ3hpYW9taS1wdXNoJyk7XG5cbkFsaXl1bl9wdXNoID0ge307XG5cbkFsaXl1bl9wdXNoLnNlbmRNZXNzYWdlID0gZnVuY3Rpb24odXNlclRva2Vucywgbm90aWZpY2F0aW9uLCBjYWxsYmFjaykge1xuICB2YXIgQUxZUFVTSCwgWGluZ2VBcHAsIGFsaXl1blRva2VucywgYW5kcm9pZE1lc3NhZ2UsIGRhdGEsIGh1YXdlaVRva2VucywgbWlUb2tlbnMsIG1zZywgbm90aSwgcGFja2FnZV9uYW1lLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHRva2VuRGF0YUxpc3QsIHhpbmdlVG9rZW5zO1xuICBpZiAobm90aWZpY2F0aW9uLnRpdGxlICYmIG5vdGlmaWNhdGlvbi50ZXh0KSB7XG4gICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKHVzZXJUb2tlbnMpO1xuICAgIH1cbiAgICBhbGl5dW5Ub2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgeGluZ2VUb2tlbnMgPSBuZXcgQXJyYXk7XG4gICAgaHVhd2VpVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIG1pVG9rZW5zID0gbmV3IEFycmF5O1xuICAgIHVzZXJUb2tlbnMuZm9yRWFjaChmdW5jdGlvbih1c2VyVG9rZW4pIHtcbiAgICAgIHZhciBhcnI7XG4gICAgICBhcnIgPSB1c2VyVG9rZW4uc3BsaXQoJzonKTtcbiAgICAgIGlmIChhcnJbMF0gPT09IFwiYWxpeXVuXCIpIHtcbiAgICAgICAgcmV0dXJuIGFsaXl1blRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyWzBdID09PSBcInhpbmdlXCIpIHtcbiAgICAgICAgcmV0dXJuIHhpbmdlVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfSBlbHNlIGlmIChhcnJbMF0gPT09IFwiaHVhd2VpXCIpIHtcbiAgICAgICAgcmV0dXJuIGh1YXdlaVRva2Vucy5wdXNoKF8ubGFzdChhcnIpKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyWzBdID09PSBcIm1pXCIpIHtcbiAgICAgICAgcmV0dXJuIG1pVG9rZW5zLnB1c2goXy5sYXN0KGFycikpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghXy5pc0VtcHR5KGFsaXl1blRva2VucykgJiYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZi5hbGl5dW4gOiB2b2lkIDApKSB7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImFsaXl1blRva2VuczogXCIgKyBhbGl5dW5Ub2tlbnMpO1xuICAgICAgfVxuICAgICAgQUxZUFVTSCA9IG5ldyBBTFkuUFVTSCh7XG4gICAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYWNjZXNzS2V5SWQsXG4gICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLnNlY3JldEFjY2Vzc0tleSxcbiAgICAgICAgZW5kcG9pbnQ6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmFsaXl1bi5lbmRwb2ludCxcbiAgICAgICAgYXBpVmVyc2lvbjogTWV0ZW9yLnNldHRpbmdzLnB1c2guYWxpeXVuLmFwaVZlcnNpb25cbiAgICAgIH0pO1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgQXBwS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5hbGl5dW4uYXBwS2V5LFxuICAgICAgICBUYXJnZXQ6ICdkZXZpY2UnLFxuICAgICAgICBUYXJnZXRWYWx1ZTogYWxpeXVuVG9rZW5zLnRvU3RyaW5nKCksXG4gICAgICAgIFRpdGxlOiBub3RpZmljYXRpb24udGl0bGUsXG4gICAgICAgIFN1bW1hcnk6IG5vdGlmaWNhdGlvbi50ZXh0XG4gICAgICB9O1xuICAgICAgQUxZUFVTSC5wdXNoTm90aWNlVG9BbmRyb2lkKGRhdGEsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgaWYgKCFfLmlzRW1wdHkoeGluZ2VUb2tlbnMpICYmICgocmVmMSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMS54aW5nZSA6IHZvaWQgMCkpIHtcbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwieGluZ2VUb2tlbnM6IFwiICsgeGluZ2VUb2tlbnMpO1xuICAgICAgfVxuICAgICAgWGluZ2VBcHAgPSBuZXcgWGluZ2UuWGluZ2VBcHAoTWV0ZW9yLnNldHRpbmdzLnB1c2gueGluZ2UuYWNjZXNzSWQsIE1ldGVvci5zZXR0aW5ncy5wdXNoLnhpbmdlLnNlY3JldEtleSk7XG4gICAgICBhbmRyb2lkTWVzc2FnZSA9IG5ldyBYaW5nZS5BbmRyb2lkTWVzc2FnZTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLnR5cGUgPSBYaW5nZS5NRVNTQUdFX1RZUEVfTk9USUZJQ0FUSU9OO1xuICAgICAgYW5kcm9pZE1lc3NhZ2UudGl0bGUgPSBub3RpZmljYXRpb24udGl0bGU7XG4gICAgICBhbmRyb2lkTWVzc2FnZS5jb250ZW50ID0gbm90aWZpY2F0aW9uLnRleHQ7XG4gICAgICBhbmRyb2lkTWVzc2FnZS5zdHlsZSA9IG5ldyBYaW5nZS5TdHlsZTtcbiAgICAgIGFuZHJvaWRNZXNzYWdlLmFjdGlvbiA9IG5ldyBYaW5nZS5DbGlja0FjdGlvbjtcbiAgICAgIF8uZWFjaCh4aW5nZVRva2VucywgZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gWGluZ2VBcHAucHVzaFRvU2luZ2xlRGV2aWNlKHQsIGFuZHJvaWRNZXNzYWdlLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCFfLmlzRW1wdHkoaHVhd2VpVG9rZW5zKSAmJiAoKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MucHVzaCkgIT0gbnVsbCA/IHJlZjIuaHVhd2VpIDogdm9pZCAwKSkge1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJodWF3ZWlUb2tlbnM6IFwiICsgaHVhd2VpVG9rZW5zKTtcbiAgICAgIH1cbiAgICAgIHBhY2thZ2VfbmFtZSA9IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBQa2dOYW1lO1xuICAgICAgdG9rZW5EYXRhTGlzdCA9IFtdO1xuICAgICAgXy5lYWNoKGh1YXdlaVRva2VucywgZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdG9rZW5EYXRhTGlzdC5wdXNoKHtcbiAgICAgICAgICAncGFja2FnZV9uYW1lJzogcGFja2FnZV9uYW1lLFxuICAgICAgICAgICd0b2tlbic6IHRcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIG5vdGkgPSB7XG4gICAgICAgICdhbmRyb2lkJzoge1xuICAgICAgICAgICd0aXRsZSc6IG5vdGlmaWNhdGlvbi50aXRsZSxcbiAgICAgICAgICAnbWVzc2FnZSc6IG5vdGlmaWNhdGlvbi50ZXh0XG4gICAgICAgIH0sXG4gICAgICAgICdleHRyYXMnOiBub3RpZmljYXRpb24ucGF5bG9hZFxuICAgICAgfTtcbiAgICAgIEh1YXdlaVB1c2guY29uZmlnKFtcbiAgICAgICAge1xuICAgICAgICAgICdwYWNrYWdlX25hbWUnOiBwYWNrYWdlX25hbWUsXG4gICAgICAgICAgJ2NsaWVudF9pZCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBJZCxcbiAgICAgICAgICAnY2xpZW50X3NlY3JldCc6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5hcHBTZWNyZXRcbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgICBIdWF3ZWlQdXNoLnNlbmRNYW55KG5vdGksIHRva2VuRGF0YUxpc3QpO1xuICAgIH1cbiAgICBpZiAoIV8uaXNFbXB0eShtaVRva2VucykgJiYgKChyZWYzID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYzLm1pIDogdm9pZCAwKSkge1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJtaVRva2VuczogXCIgKyBtaVRva2Vucyk7XG4gICAgICB9XG4gICAgICBtc2cgPSBuZXcgTWlQdXNoLk1lc3NhZ2U7XG4gICAgICBtc2cudGl0bGUobm90aWZpY2F0aW9uLnRpdGxlKS5kZXNjcmlwdGlvbihub3RpZmljYXRpb24udGV4dCk7XG4gICAgICBub3RpZmljYXRpb24gPSBuZXcgTWlQdXNoLk5vdGlmaWNhdGlvbih7XG4gICAgICAgIHByb2R1Y3Rpb246IE1ldGVvci5zZXR0aW5ncy5wdXNoLm1pLnByb2R1Y3Rpb24sXG4gICAgICAgIGFwcFNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnB1c2gubWkuYXBwU2VjcmV0XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2gobWlUb2tlbnMsIGZ1bmN0aW9uKHJlZ2lkKSB7XG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uc2VuZChyZWdpZCwgbXNnLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgY29uZmlnLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlZjY7XG4gIGlmICghKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MuY3JvbikgIT0gbnVsbCA/IHJlZi5wdXNoX2ludGVydmFsIDogdm9pZCAwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25maWcgPSB7XG4gICAgZGVidWc6IHRydWUsXG4gICAga2VlcE5vdGlmaWNhdGlvbnM6IGZhbHNlLFxuICAgIHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLmNyb24ucHVzaF9pbnRlcnZhbCxcbiAgICBzZW5kQmF0Y2hTaXplOiAxMCxcbiAgICBwcm9kdWN0aW9uOiB0cnVlXG4gIH07XG4gIGlmICghXy5pc0VtcHR5KChyZWYxID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWYxLmFwbiA6IHZvaWQgMCkpIHtcbiAgICBjb25maWcuYXBuID0ge1xuICAgICAga2V5RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmtleURhdGEsXG4gICAgICBjZXJ0RGF0YTogTWV0ZW9yLnNldHRpbmdzLnB1c2guYXBuLmNlcnREYXRhXG4gICAgfTtcbiAgfVxuICBpZiAoIV8uaXNFbXB0eSgocmVmMiA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMi5nY20gOiB2b2lkIDApKSB7XG4gICAgY29uZmlnLmdjbSA9IHtcbiAgICAgIHByb2plY3ROdW1iZXI6IE1ldGVvci5zZXR0aW5ncy5wdXNoLmdjbS5wcm9qZWN0TnVtYmVyLFxuICAgICAgYXBpS2V5OiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5nY20uYXBpS2V5XG4gICAgfTtcbiAgfVxuICBQdXNoLkNvbmZpZ3VyZShjb25maWcpO1xuICBpZiAoKCgocmVmMyA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmMy5hbGl5dW4gOiB2b2lkIDApIHx8ICgocmVmNCA9IE1ldGVvci5zZXR0aW5ncy5wdXNoKSAhPSBudWxsID8gcmVmNC54aW5nZSA6IHZvaWQgMCkgfHwgKChyZWY1ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY1Lmh1YXdlaSA6IHZvaWQgMCkgfHwgKChyZWY2ID0gTWV0ZW9yLnNldHRpbmdzLnB1c2gpICE9IG51bGwgPyByZWY2Lm1pIDogdm9pZCAwKSkgJiYgUHVzaCAmJiB0eXBlb2YgUHVzaC5zZW5kR0NNID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUHVzaC5vbGRfc2VuZEdDTSA9IFB1c2guc2VuZEdDTTtcbiAgICBQdXNoLnNlbmRBbGl5dW4gPSBmdW5jdGlvbih1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBGaWJlciwgdXNlclRva2VuO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KSkge1xuICAgICAgICBub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKTtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VyVG9rZW5zID09PSAnJyArIHVzZXJUb2tlbnMpIHtcbiAgICAgICAgdXNlclRva2VucyA9IFt1c2VyVG9rZW5zXTtcbiAgICAgIH1cbiAgICAgIGlmICghdXNlclRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gbm8gcHVzaCB0b2tlbnMgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRBbGl5dW4nLCB1c2VyVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgICAgRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcbiAgICAgIHVzZXJUb2tlbiA9IHVzZXJUb2tlbnMubGVuZ3RoID09PSAxID8gdXNlclRva2Vuc1swXSA6IG51bGw7XG4gICAgICByZXR1cm4gQWxpeXVuX3B1c2guc2VuZE1lc3NhZ2UodXNlclRva2Vucywgbm90aWZpY2F0aW9uLCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdBTkRST0lEIEVSUk9SOiByZXN1bHQgb2Ygc2VuZGVyOiAnICsgcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlciBpcyBudWxsJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FORFJPSUQ6IFJlc3VsdCBvZiBzZW5kZXI6ICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdC5jYW5vbmljYWxfaWRzID09PSAxICYmIHVzZXJUb2tlbikge1xuICAgICAgICAgICAgRmliZXIoZnVuY3Rpb24oc2VsZikge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKHNlbGYub2xkVG9rZW4sIHNlbGYubmV3VG9rZW4pO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5ydW4oe1xuICAgICAgICAgICAgICBvbGRUb2tlbjoge1xuICAgICAgICAgICAgICAgIGdjbTogdXNlclRva2VuXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5ld1Rva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiBcImFsaXl1bjpcIiArIHJlc3VsdC5yZXN1bHRzWzBdLnJlZ2lzdHJhdGlvbl9pZFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWxsYmFjazogX3JlcGxhY2VUb2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQuZmFpbHVyZSAhPT0gMCAmJiB1c2VyVG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBGaWJlcihmdW5jdGlvbihzZWxmKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soc2VsZi50b2tlbik7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnJ1bih7XG4gICAgICAgICAgICAgIHRva2VuOiB7XG4gICAgICAgICAgICAgICAgZ2NtOiB1c2VyVG9rZW5cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FsbGJhY2s6IF9yZW1vdmVUb2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICAgIFB1c2guc2VuZEdDTSA9IGZ1bmN0aW9uKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikge1xuICAgICAgdmFyIGFsaXl1blRva2VucywgZ2NtVG9rZW5zO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRHQ00gZnJvbSBhbGl5dW4tPiBQdXNoLnNlbmRHQ00nKTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRjaC50ZXN0KG5vdGlmaWNhdGlvbi5nY20sIE9iamVjdCkpIHtcbiAgICAgICAgbm90aWZpY2F0aW9uID0gXy5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiwgbm90aWZpY2F0aW9uLmdjbSk7XG4gICAgICB9XG4gICAgICBpZiAodXNlclRva2VucyA9PT0gJycgKyB1c2VyVG9rZW5zKSB7XG4gICAgICAgIHVzZXJUb2tlbnMgPSBbdXNlclRva2Vuc107XG4gICAgICB9XG4gICAgICBpZiAoIXVzZXJUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNIG5vIHB1c2ggdG9rZW5zIGZvdW5kJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cbiAgICAgIGFsaXl1blRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaW5kZXhPZignYWxpeXVuOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCd4aW5nZTonKSA+IC0xIHx8IGl0ZW0uaW5kZXhPZignaHVhd2VpOicpID4gLTEgfHwgaXRlbS5pbmRleE9mKCdtaTonKSA+IC0xO1xuICAgICAgfSk7XG4gICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnYWxpeXVuVG9rZW5zIGlzICcsIGFsaXl1blRva2Vucy50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICAgIGdjbVRva2VucyA9IHVzZXJUb2tlbnMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaW5kZXhPZihcImFsaXl1bjpcIikgPCAwICYmIGl0ZW0uaW5kZXhPZihcInhpbmdlOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwiaHVhd2VpOlwiKSA8IDAgJiYgaXRlbS5pbmRleE9mKFwibWk6XCIpIDwgMDtcbiAgICAgIH0pO1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2djbVRva2VucyBpcyAnLCBnY21Ub2tlbnMudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICBQdXNoLnNlbmRBbGl5dW4oYWxpeXVuVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgICAgcmV0dXJuIFB1c2gub2xkX3NlbmRHQ00oZ2NtVG9rZW5zLCBub3RpZmljYXRpb24pO1xuICAgIH07XG4gICAgUHVzaC5vbGRfc2VuZEFQTiA9IFB1c2guc2VuZEFQTjtcbiAgICByZXR1cm4gUHVzaC5zZW5kQVBOID0gZnVuY3Rpb24odXNlclRva2VuLCBub3RpZmljYXRpb24pIHtcbiAgICAgIHZhciBub3RpO1xuICAgICAgaWYgKG5vdGlmaWNhdGlvbi50aXRsZSAmJiBub3RpZmljYXRpb24udGV4dCkge1xuICAgICAgICBub3RpID0gXy5jbG9uZShub3RpZmljYXRpb24pO1xuICAgICAgICBub3RpLnRleHQgPSBub3RpLnRpdGxlICsgXCIgXCIgKyBub3RpLnRleHQ7XG4gICAgICAgIG5vdGkudGl0bGUgPSBcIlwiO1xuICAgICAgICByZXR1cm4gUHVzaC5vbGRfc2VuZEFQTih1c2VyVG9rZW4sIG5vdGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFB1c2gub2xkX3NlbmRBUE4odXNlclRva2VuLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIl19
