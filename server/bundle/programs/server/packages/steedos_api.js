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
  'csv': "^5.1.2",
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphcGkvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3Jlc3RpdnVzL2F1dGguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmFwaS9saWIvcmVzdGl2dXMvaXJvbi1yb3V0ZXItZXJyb3ItdG8tcmVzcG9uc2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2xpYi9yZXN0aXZ1cy9yb3V0ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9yb3V0ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2xpYi9yZXN0aXZ1cy9yZXN0aXZ1cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9yZXN0aXZ1cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYXBpL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL3MzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hcGkvcm91dGVzL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvcHVzaC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYnVzYm95IiwiY29va2llcyIsImdldFVzZXJRdWVyeVNlbGVjdG9yIiwidXNlclZhbGlkYXRvciIsIkF1dGgiLCJNYXRjaCIsIldoZXJlIiwidXNlciIsImNoZWNrIiwiaWQiLCJPcHRpb25hbCIsIlN0cmluZyIsInVzZXJuYW1lIiwiZW1haWwiLCJfIiwia2V5cyIsImxlbmd0aCIsIkVycm9yIiwibG9naW5XaXRoUGFzc3dvcmQiLCJwYXNzd29yZCIsImF1dGhUb2tlbiIsImF1dGhlbnRpY2F0aW5nVXNlciIsImF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yIiwiaGFzaGVkVG9rZW4iLCJwYXNzd29yZFZlcmlmaWNhdGlvbiIsInJlZiIsInNwYWNlX3VzZXJzIiwic3BhY2VzIiwiTWV0ZW9yIiwidXNlcnMiLCJmaW5kT25lIiwic2VydmljZXMiLCJBY2NvdW50cyIsIl9jaGVja1Bhc3N3b3JkIiwiZXJyb3IiLCJfZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbiIsIl9oYXNoU3RhbXBlZFRva2VuIiwiX2luc2VydEhhc2hlZExvZ2luVG9rZW4iLCJfaWQiLCJkYiIsImZpbmQiLCJmZXRjaCIsImVhY2giLCJzdSIsInNwYWNlIiwiaXNfcGFpZCIsImluZGV4T2YiLCJhZG1pbnMiLCJwdXNoIiwibmFtZSIsInRva2VuIiwidXNlcklkIiwiYWRtaW5TcGFjZXMiLCJlbnYiLCJwcm9jZXNzIiwiTk9ERV9FTlYiLCJpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSIsImVyciIsInJlcSIsInJlcyIsInN0YXR1c0NvZGUiLCJzdGF0dXMiLCJtc2ciLCJzdGFjayIsInRvU3RyaW5nIiwiY29uc29sZSIsImhlYWRlcnNTZW50Iiwic29ja2V0IiwiZGVzdHJveSIsInNldEhlYWRlciIsIkJ1ZmZlciIsImJ5dGVMZW5ndGgiLCJtZXRob2QiLCJlbmQiLCJzaGFyZSIsIlJvdXRlIiwiYXBpIiwicGF0aCIsIm9wdGlvbnMiLCJlbmRwb2ludHMxIiwiZW5kcG9pbnRzIiwicHJvdG90eXBlIiwiYWRkVG9BcGkiLCJhdmFpbGFibGVNZXRob2RzIiwiYWxsb3dlZE1ldGhvZHMiLCJmdWxsUGF0aCIsInJlamVjdGVkTWV0aG9kcyIsInNlbGYiLCJjb250YWlucyIsIl9jb25maWciLCJwYXRocyIsImV4dGVuZCIsImRlZmF1bHRPcHRpb25zRW5kcG9pbnQiLCJfcmVzb2x2ZUVuZHBvaW50cyIsIl9jb25maWd1cmVFbmRwb2ludHMiLCJmaWx0ZXIiLCJyZWplY3QiLCJhcGlQYXRoIiwiZW5kcG9pbnQiLCJKc29uUm91dGVzIiwiYWRkIiwiZG9uZUZ1bmMiLCJlbmRwb2ludENvbnRleHQiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZUluaXRpYXRlZCIsInVybFBhcmFtcyIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwicXVlcnkiLCJib2R5UGFyYW1zIiwiYm9keSIsInJlcXVlc3QiLCJyZXNwb25zZSIsImRvbmUiLCJfY2FsbEVuZHBvaW50IiwiZXJyb3IxIiwiaGVhZGVycyIsIl9yZXNwb25kIiwibWVzc2FnZSIsImpvaW4iLCJ0b1VwcGVyQ2FzZSIsImlzRnVuY3Rpb24iLCJhY3Rpb24iLCJyZWYxIiwicmVmMiIsInJvbGVSZXF1aXJlZCIsInVuaW9uIiwiaXNFbXB0eSIsImF1dGhSZXF1aXJlZCIsInNwYWNlUmVxdWlyZWQiLCJpbnZvY2F0aW9uIiwiX2F1dGhBY2NlcHRlZCIsIl9yb2xlQWNjZXB0ZWQiLCJfc3BhY2VBY2NlcHRlZCIsIkREUENvbW1vbiIsIk1ldGhvZEludm9jYXRpb24iLCJpc1NpbXVsYXRpb24iLCJjb25uZWN0aW9uIiwicmFuZG9tU2VlZCIsIm1ha2VScGNTZWVkIiwiRERQIiwiX0N1cnJlbnRJbnZvY2F0aW9uIiwid2l0aFZhbHVlIiwiY2FsbCIsIl9hdXRoZW50aWNhdGUiLCJhdXRoIiwidXNlclNlbGVjdG9yIiwic3BhY2VfdXNlcnNfY291bnQiLCJzcGFjZUlkIiwiY291bnQiLCJpbnRlcnNlY3Rpb24iLCJyb2xlcyIsImRlZmF1bHRIZWFkZXJzIiwiZGVsYXlJbk1pbGxpc2Vjb25kcyIsIm1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzIiwicmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28iLCJzZW5kUmVzcG9uc2UiLCJfbG93ZXJDYXNlS2V5cyIsIm1hdGNoIiwicHJldHR5SnNvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3cml0ZUhlYWQiLCJ3cml0ZSIsIk1hdGgiLCJyYW5kb20iLCJzZXRUaW1lb3V0Iiwib2JqZWN0IiwiY2hhaW4iLCJwYWlycyIsIm1hcCIsImF0dHIiLCJ0b0xvd2VyQ2FzZSIsInZhbHVlIiwiUmVzdGl2dXMiLCJpdGVtIiwiaSIsImwiLCJjb3JzSGVhZGVycyIsIl9yb3V0ZXMiLCJ1c2VEZWZhdWx0QXV0aCIsInZlcnNpb24iLCJfdXNlciIsIl9oYXNoTG9naW5Ub2tlbiIsImVuYWJsZUNvcnMiLCJzbGljZSIsImxhc3QiLCJfaW5pdEF1dGgiLCJ1c2VBdXRoIiwid2FybiIsImFkZFJvdXRlIiwicm91dGUiLCJhZGRDb2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsImNvbGxlY3Rpb25FbmRwb2ludHMiLCJjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMiLCJlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24iLCJlbnRpdHlSb3V0ZUVuZHBvaW50cyIsImV4Y2x1ZGVkRW5kcG9pbnRzIiwibWV0aG9kcyIsIm1ldGhvZHNPbkNvbGxlY3Rpb24iLCJyb3V0ZU9wdGlvbnMiLCJfdXNlckNvbGxlY3Rpb25FbmRwb2ludHMiLCJfY29sbGVjdGlvbkVuZHBvaW50cyIsIl9uYW1lIiwiY29uZmlndXJlZEVuZHBvaW50IiwiZW5kcG9pbnRPcHRpb25zIiwibWV0aG9kVHlwZSIsImNsb25lIiwiZ2V0IiwiZW50aXR5Iiwic2VsZWN0b3IiLCJkYXRhIiwicHV0IiwiZW50aXR5SXNVcGRhdGVkIiwidXBkYXRlIiwiJHNldCIsInJlbW92ZSIsInBvc3QiLCJlbnRpdHlJZCIsImluc2VydCIsImdldEFsbCIsImVudGl0aWVzIiwiZmllbGRzIiwicHJvZmlsZSIsImNyZWF0ZVVzZXIiLCJsb2dvdXQiLCJlIiwiZXh0cmFEYXRhIiwic2VhcmNoUXVlcnkiLCJyZWFzb24iLCJvbkxvZ2dlZEluIiwiZXh0cmEiLCJpbmRleCIsInRva2VuRmllbGROYW1lIiwidG9rZW5Mb2NhdGlvbiIsInRva2VuUGF0aCIsInRva2VuUmVtb3ZhbFF1ZXJ5IiwidG9rZW5Ub1JlbW92ZSIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwiJHB1bGwiLCJvbkxvZ2dlZE91dCIsImlzU2VydmVyIiwiQVBJIiwiQnVzYm95IiwiRmliZXIiLCJyZXF1aXJlIiwicGFyc2VGaWxlcyIsIm5leHQiLCJmaWxlcyIsImltYWdlIiwib24iLCJmaWVsZG5hbWUiLCJmaWxlIiwiZmlsZW5hbWUiLCJlbmNvZGluZyIsIm1pbWV0eXBlIiwiYnVmZmVycyIsIm1pbWVUeXBlIiwiY29uY2F0IiwicnVuIiwicGlwZSIsIm5ld0ZpbGUiLCJjZnMiLCJpbnN0YW5jZXMiLCJGUyIsIkZpbGUiLCJhdHRhY2hEYXRhIiwidHlwZSIsImZpbGVPYmoiLCJtZXRhZGF0YSIsInBhcmVudCIsInIiLCJyZXNwIiwic2l6ZSIsImluY2x1ZGVzIiwibW9tZW50IiwiRGF0ZSIsImZvcm1hdCIsInNwbGl0IiwicG9wIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwicmVwbGFjZSIsIm93bmVyIiwib3duZXJfbmFtZSIsImluc3RhbmNlIiwiYXBwcm92ZSIsImN1cnJlbnQiLCJ0b0xvY2FsZUxvd2VyQ2FzZSIsImlzX3ByaXZhdGUiLCJtYWluIiwiJHVuc2V0IiwibG9ja2VkX2J5IiwibG9ja2VkX2J5X25hbWUiLCIkbmUiLCJvcmlnaW5hbCIsInZlcnNpb25faWQiLCJTdGVlZG9zIiwiYWJzb2x1dGVVcmwiLCJwdXNoVG9waWMiLCJ1c2VySWRzIiwiZnJvbSIsImFwcE5hbWUiLCJhbGVydFRpdGxlIiwiYWxlcnQiLCJiYWRnZSIsInNvdW5kIiwiUHVzaCIsInNlbmQiLCJwdXNoU2VuZCIsInRleHQiLCJ0aXRsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElB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dCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHQnYWxpeXVuLXNkayc6ICdeMS45LjInLFxuXHRidXNib3k6IFwiXjAuMi4xM1wiLFxuXHRjb29raWVzOiBcIl4wLjYuMlwiLFxuXHQnY3N2JzogXCJeNS4xLjJcIixcblx0J3VybCc6ICdeMC4xMS4wJyxcblx0J3JlcXVlc3QnOiAnXjIuODEuMCcsXG5cdCd4aW5nZSc6ICdeMS4xLjMnLFxuXHQnaHVhd2VpLXB1c2gnOiAnXjAuMC42LTAnLFxuXHQneGlhb21pLXB1c2gnOiAnXjAuNC41J1xufSwgJ3N0ZWVkb3M6YXBpJyk7IiwiQEF1dGggb3I9IHt9XG5cbiMjI1xuICBBIHZhbGlkIHVzZXIgd2lsbCBoYXZlIGV4YWN0bHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgaWRlbnRpZmljYXRpb24gZmllbGRzOiBpZCwgdXNlcm5hbWUsIG9yIGVtYWlsXG4jIyNcbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZSAodXNlcikgLT5cbiAgY2hlY2sgdXNlcixcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcblxuICBpZiBfLmtleXModXNlcikubGVuZ3RoIGlzIG5vdCAxXG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yICdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJ1xuXG4gIHJldHVybiB0cnVlXG5cblxuIyMjXG4gIFJldHVybiBhIE1vbmdvREIgcXVlcnkgc2VsZWN0b3IgZm9yIGZpbmRpbmcgdGhlIGdpdmVuIHVzZXJcbiMjI1xuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSAodXNlcikgLT5cbiAgaWYgdXNlci5pZFxuICAgIHJldHVybiB7J19pZCc6IHVzZXIuaWR9XG4gIGVsc2UgaWYgdXNlci51c2VybmFtZVxuICAgIHJldHVybiB7J3VzZXJuYW1lJzogdXNlci51c2VybmFtZX1cbiAgZWxzZSBpZiB1c2VyLmVtYWlsXG4gICAgcmV0dXJuIHsnZW1haWxzLmFkZHJlc3MnOiB1c2VyLmVtYWlsfVxuXG4gICMgV2Ugc2hvdWxkbid0IGJlIGhlcmUgaWYgdGhlIHVzZXIgb2JqZWN0IHdhcyBwcm9wZXJseSB2YWxpZGF0ZWRcbiAgdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJ1xuXG5cbiMjI1xuICBMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcbiMjI1xuQEF1dGgubG9naW5XaXRoUGFzc3dvcmQgPSAodXNlciwgcGFzc3dvcmQpIC0+XG4gIGlmIG5vdCB1c2VyIG9yIG5vdCBwYXNzd29yZFxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG4gICMgVmFsaWRhdGUgdGhlIGxvZ2luIGlucHV0IHR5cGVzXG4gIGNoZWNrIHVzZXIsIHVzZXJWYWxpZGF0b3JcbiAgY2hlY2sgcGFzc3dvcmQsIFN0cmluZ1xuXG4gICMgUmV0cmlldmUgdGhlIHVzZXIgZnJvbSB0aGUgZGF0YWJhc2VcbiAgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IgPSBnZXRVc2VyUXVlcnlTZWxlY3Rvcih1c2VyKVxuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvcilcblxuICBpZiBub3QgYXV0aGVudGljYXRpbmdVc2VyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG4gIGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXM/LnBhc3N3b3JkXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cbiAgIyBBdXRoZW50aWNhdGUgdGhlIHVzZXIncyBwYXNzd29yZFxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmRcbiAgaWYgcGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3JcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuICAjIEFkZCBhIG5ldyBhdXRoIHRva2VuIHRvIHRoZSB1c2VyJ3MgYWNjb3VudFxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpXG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4gYXV0aFRva2VuXG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuXG5cbiAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkfSkuZmV0Y2goKVxuICBzcGFjZXMgPSBbXVxuICBfLmVhY2ggc3BhY2VfdXNlcnMsIChzdSktPlxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3Uuc3BhY2UpXG4gICAgIyBzcGFjZSBtdXN0IGJlIHBhaWQsIGFuZCB1c2VyIG11c3QgYmUgYWRtaW5zXG4gICAgaWYgc3BhY2U/LmlzX3BhaWQgYW5kIF8uaW5kZXhPZihzcGFjZS5hZG1pbnMsIHN1LnVzZXIpPj0wXG4gICAgICBzcGFjZXMucHVzaFxuICAgICAgICBfaWQ6IHNwYWNlLl9pZFxuICAgICAgICBuYW1lOiBzcGFjZS5uYW1lXG4gIHJldHVybiB7YXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sIHVzZXJJZDogYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgYWRtaW5TcGFjZXM6IHNwYWNlc31cbiIsInZhciBnZXRVc2VyUXVlcnlTZWxlY3RvciwgdXNlclZhbGlkYXRvcjtcblxudGhpcy5BdXRoIHx8ICh0aGlzLkF1dGggPSB7fSk7XG5cblxuLypcbiAgQSB2YWxpZCB1c2VyIHdpbGwgaGF2ZSBleGFjdGx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIGlkZW50aWZpY2F0aW9uIGZpZWxkczogaWQsIHVzZXJuYW1lLCBvciBlbWFpbFxuICovXG5cbnVzZXJWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZShmdW5jdGlvbih1c2VyKSB7XG4gIGNoZWNrKHVzZXIsIHtcbiAgICBpZDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKVxuICB9KTtcbiAgaWYgKF8ua2V5cyh1c2VyKS5sZW5ndGggPT09ICExKSB7XG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yKCdVc2VyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBpZGVudGlmaWVyIGZpZWxkJyk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuXG4vKlxuICBSZXR1cm4gYSBNb25nb0RCIHF1ZXJ5IHNlbGVjdG9yIGZvciBmaW5kaW5nIHRoZSBnaXZlbiB1c2VyXG4gKi9cblxuZ2V0VXNlclF1ZXJ5U2VsZWN0b3IgPSBmdW5jdGlvbih1c2VyKSB7XG4gIGlmICh1c2VyLmlkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdfaWQnOiB1c2VyLmlkXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICd1c2VybmFtZSc6IHVzZXIudXNlcm5hbWVcbiAgICB9O1xuICB9IGVsc2UgaWYgKHVzZXIuZW1haWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ2VtYWlscy5hZGRyZXNzJzogdXNlci5lbWFpbFxuICAgIH07XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIHNlbGVjdG9yIGZyb20gaW52YWxpZCB1c2VyJyk7XG59O1xuXG5cbi8qXG4gIExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuICovXG5cbnRoaXMuQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3N3b3JkKSB7XG4gIHZhciBhdXRoVG9rZW4sIGF1dGhlbnRpY2F0aW5nVXNlciwgYXV0aGVudGljYXRpbmdVc2VyU2VsZWN0b3IsIGhhc2hlZFRva2VuLCBwYXNzd29yZFZlcmlmaWNhdGlvbiwgcmVmLCBzcGFjZV91c2Vycywgc3BhY2VzO1xuICBpZiAoIXVzZXIgfHwgIXBhc3N3b3JkKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBjaGVjayh1c2VyLCB1c2VyVmFsaWRhdG9yKTtcbiAgY2hlY2socGFzc3dvcmQsIFN0cmluZyk7XG4gIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yID0gZ2V0VXNlclF1ZXJ5U2VsZWN0b3IodXNlcik7XG4gIGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKTtcbiAgaWYgKCFhdXRoZW50aWNhdGluZ1VzZXIpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGlmICghKChyZWYgPSBhdXRoZW50aWNhdGluZ1VzZXIuc2VydmljZXMpICE9IG51bGwgPyByZWYucGFzc3dvcmQgOiB2b2lkIDApKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBwYXNzd29yZFZlcmlmaWNhdGlvbiA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKGF1dGhlbnRpY2F0aW5nVXNlciwgcGFzc3dvcmQpO1xuICBpZiAocGFzc3dvcmRWZXJpZmljYXRpb24uZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgJ1VuYXV0aG9yaXplZCcpO1xuICB9XG4gIGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKCk7XG4gIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hTdGFtcGVkVG9rZW4oYXV0aFRva2VuKTtcbiAgQWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4oYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW4pO1xuICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWRcbiAgfSkuZmV0Y2goKTtcbiAgc3BhY2VzID0gW107XG4gIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24oc3UpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSk7XG4gICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgc3UudXNlcikgPj0gMCkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHtcbiAgICAgICAgX2lkOiBzcGFjZS5faWQsXG4gICAgICAgIG5hbWU6IHNwYWNlLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7XG4gICAgYXV0aFRva2VuOiBhdXRoVG9rZW4udG9rZW4sXG4gICAgdXNlcklkOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkLFxuICAgIGFkbWluU3BhY2VzOiBzcGFjZXNcbiAgfTtcbn07XG4iLCIvLyBXZSBuZWVkIGEgZnVuY3Rpb24gdGhhdCB0cmVhdHMgdGhyb3duIGVycm9ycyBleGFjdGx5IGxpa2UgSXJvbiBSb3V0ZXIgd291bGQuXG4vLyBUaGlzIGZpbGUgaXMgd3JpdHRlbiBpbiBKYXZhU2NyaXB0IHRvIGVuYWJsZSBjb3B5LXBhc3RpbmcgSXJvbiBSb3V0ZXIgY29kZS5cblxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMM1xudmFyIGVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XG5cbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9pcm9uLW1ldGVvci9pcm9uLXJvdXRlci9ibG9iLzljMzY5NDk5Yzk4YWY5ZmQxMmVmOWU2ODMzOGRlZTNiMWIxMjc2YWEvbGliL3JvdXRlcl9zZXJ2ZXIuanMjTDQ3XG5pcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSA9IGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzKSB7XG4gIGlmIChyZXMuc3RhdHVzQ29kZSA8IDQwMClcbiAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcblxuICBpZiAoZXJyLnN0YXR1cylcbiAgICByZXMuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXM7XG5cbiAgaWYgKGVudiA9PT0gJ2RldmVsb3BtZW50JylcbiAgICBtc2cgPSAoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKSArICdcXG4nO1xuICBlbHNlXG4gICAgLy9YWFggZ2V0IHRoaXMgZnJvbSBzdGFuZGFyZCBkaWN0IG9mIGVycm9yIG1lc3NhZ2VzP1xuICAgIG1zZyA9ICdTZXJ2ZXIgZXJyb3IuJztcblxuICBjb25zb2xlLmVycm9yKGVyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKSk7XG5cbiAgaWYgKHJlcy5oZWFkZXJzU2VudClcbiAgICByZXR1cm4gcmVxLnNvY2tldC5kZXN0cm95KCk7XG5cbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIEJ1ZmZlci5ieXRlTGVuZ3RoKG1zZykpO1xuICBpZiAocmVxLm1ldGhvZCA9PT0gJ0hFQUQnKVxuICAgIHJldHVybiByZXMuZW5kKCk7XG4gIHJlcy5lbmQobXNnKTtcbiAgcmV0dXJuO1xufVxuIiwiY2xhc3Mgc2hhcmUuUm91dGVcblxuICBjb25zdHJ1Y3RvcjogKEBhcGksIEBwYXRoLCBAb3B0aW9ucywgQGVuZHBvaW50cykgLT5cbiAgICAjIENoZWNrIGlmIG9wdGlvbnMgd2VyZSBwcm92aWRlZFxuICAgIGlmIG5vdCBAZW5kcG9pbnRzXG4gICAgICBAZW5kcG9pbnRzID0gQG9wdGlvbnNcbiAgICAgIEBvcHRpb25zID0ge31cblxuXG4gIGFkZFRvQXBpOiBkbyAtPlxuICAgIGF2YWlsYWJsZU1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdkZWxldGUnLCAnb3B0aW9ucyddXG5cbiAgICByZXR1cm4gLT5cbiAgICAgIHNlbGYgPSB0aGlzXG5cbiAgICAgICMgVGhyb3cgYW4gZXJyb3IgaWYgYSByb3V0ZSBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIGF0IHRoaXMgcGF0aFxuICAgICAgIyBUT0RPOiBDaGVjayBmb3IgY29sbGlzaW9ucyB3aXRoIHBhdGhzIHRoYXQgZm9sbG93IHNhbWUgcGF0dGVybiB3aXRoIGRpZmZlcmVudCBwYXJhbWV0ZXIgbmFtZXNcbiAgICAgIGlmIF8uY29udGFpbnMgQGFwaS5fY29uZmlnLnBhdGhzLCBAcGF0aFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgYWRkIGEgcm91dGUgYXQgYW4gZXhpc3RpbmcgcGF0aDogI3tAcGF0aH1cIlxuXG4gICAgICAjIE92ZXJyaWRlIHRoZSBkZWZhdWx0IE9QVElPTlMgZW5kcG9pbnQgd2l0aCBvdXIgb3duXG4gICAgICBAZW5kcG9pbnRzID0gXy5leHRlbmQgb3B0aW9uczogQGFwaS5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnQsIEBlbmRwb2ludHNcblxuICAgICAgIyBDb25maWd1cmUgZWFjaCBlbmRwb2ludCBvbiB0aGlzIHJvdXRlXG4gICAgICBAX3Jlc29sdmVFbmRwb2ludHMoKVxuICAgICAgQF9jb25maWd1cmVFbmRwb2ludHMoKVxuXG4gICAgICAjIEFkZCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyBwYXRoc1xuICAgICAgQGFwaS5fY29uZmlnLnBhdGhzLnB1c2ggQHBhdGhcblxuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlciBhdmFpbGFibGVNZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZClcbiAgICAgIHJlamVjdGVkTWV0aG9kcyA9IF8ucmVqZWN0IGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKVxuXG4gICAgICAjIFNldHVwIGVuZHBvaW50cyBvbiByb3V0ZVxuICAgICAgZnVsbFBhdGggPSBAYXBpLl9jb25maWcuYXBpUGF0aCArIEBwYXRoXG4gICAgICBfLmVhY2ggYWxsb3dlZE1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXVxuICAgICAgICBKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XG4gICAgICAgICAgIyBBZGQgZnVuY3Rpb24gdG8gZW5kcG9pbnQgY29udGV4dCBmb3IgaW5kaWNhdGluZyBhIHJlc3BvbnNlIGhhcyBiZWVuIGluaXRpYXRlZCBtYW51YWxseVxuICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2VcbiAgICAgICAgICBkb25lRnVuYyA9IC0+XG4gICAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IHRydWVcblxuICAgICAgICAgIGVuZHBvaW50Q29udGV4dCA9XG4gICAgICAgICAgICB1cmxQYXJhbXM6IHJlcS5wYXJhbXNcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiByZXEucXVlcnlcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5XG4gICAgICAgICAgICByZXF1ZXN0OiByZXFcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXNcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgIyBBZGQgZW5kcG9pbnQgY29uZmlnIG9wdGlvbnMgdG8gY29udGV4dFxuICAgICAgICAgIF8uZXh0ZW5kIGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnRcblxuICAgICAgICAgICMgUnVuIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsXG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICAjIERvIGV4YWN0bHkgd2hhdCBJcm9uIFJvdXRlciB3b3VsZCBoYXZlIGRvbmUsIHRvIGF2b2lkIGNoYW5naW5nIHRoZSBBUElcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgIGlmIHJlc3BvbnNlSW5pdGlhdGVkXG4gICAgICAgICAgICAjIEVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgcHJvcGVybHkgY29tcGxldGVkXG4gICAgICAgICAgICByZXMuZW5kKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIHJlcy5oZWFkZXJzU2VudFxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJNdXN0IGNhbGwgdGhpcy5kb25lKCkgYWZ0ZXIgaGFuZGxpbmcgZW5kcG9pbnQgcmVzcG9uc2UgbWFudWFsbHk6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXG4gICAgICAgICAgICBlbHNlIGlmIHJlc3BvbnNlRGF0YSBpcyBudWxsIG9yIHJlc3BvbnNlRGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IHJldHVybiBudWxsIG9yIHVuZGVmaW5lZCBmcm9tIGFuIGVuZHBvaW50OiAje21ldGhvZH0gI3tmdWxsUGF0aH1cIlxuXG4gICAgICAgICAgIyBHZW5lcmF0ZSBhbmQgcmV0dXJuIHRoZSBodHRwIHJlc3BvbnNlLCBoYW5kbGluZyB0aGUgZGlmZmVyZW50IGVuZHBvaW50IHJlc3BvbnNlIHR5cGVzXG4gICAgICAgICAgaWYgcmVzcG9uc2VEYXRhLmJvZHkgYW5kIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSBvciByZXNwb25zZURhdGEuaGVhZGVycylcbiAgICAgICAgICAgIHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YVxuXG4gICAgICBfLmVhY2ggcmVqZWN0ZWRNZXRob2RzLCAobWV0aG9kKSAtPlxuICAgICAgICBKc29uUm91dGVzLmFkZCBtZXRob2QsIGZ1bGxQYXRoLCAocmVxLCByZXMpIC0+XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0gc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgIGhlYWRlcnMgPSAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICBzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnNcblxuXG4gICMjI1xuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICAgIGZ1bmN0aW9uXG5cbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgIyMjXG4gIF9yZXNvbHZlRW5kcG9pbnRzOiAtPlxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSAtPlxuICAgICAgaWYgXy5pc0Z1bmN0aW9uKGVuZHBvaW50KVxuICAgICAgICBlbmRwb2ludHNbbWV0aG9kXSA9IHthY3Rpb246IGVuZHBvaW50fVxuICAgIHJldHVyblxuXG5cbiAgIyMjXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICAgIGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuXG4gICAgQXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvciBpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW5cbiAgICBlbnRpcmUgcm91dGUsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZCBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbFxuICAgIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuXG4gICAgQWZ0ZXIgdGhlIGVuZHBvaW50IGlzIGNvbmZpZ3VyZWQsIGFsbCBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudHMgb2YgYW4gZW5kcG9pbnQgY2FuIGJlXG4gICAgYWNjZXNzZWQgYXQgPGNvZGU+ZW5kcG9pbnQuYXV0aFJlcXVpcmVkPC9jb2RlPiBhbmQgPGNvZGU+ZW5kcG9pbnQucm9sZVJlcXVpcmVkPC9jb2RlPixcbiAgICByZXNwZWN0aXZlbHkuXG5cbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICMjI1xuICBfY29uZmlndXJlRW5kcG9pbnRzOiAtPlxuICAgIF8uZWFjaCBAZW5kcG9pbnRzLCAoZW5kcG9pbnQsIG1ldGhvZCkgLT5cbiAgICAgIGlmIG1ldGhvZCBpc250ICdvcHRpb25zJ1xuICAgICAgICAjIENvbmZpZ3VyZSBhY2NlcHRhYmxlIHJvbGVzXG4gICAgICAgIGlmIG5vdCBAb3B0aW9ucz8ucm9sZVJlcXVpcmVkXG4gICAgICAgICAgQG9wdGlvbnMucm9sZVJlcXVpcmVkID0gW11cbiAgICAgICAgaWYgbm90IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdXG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24gZW5kcG9pbnQucm9sZVJlcXVpcmVkLCBAb3B0aW9ucy5yb2xlUmVxdWlyZWRcbiAgICAgICAgIyBNYWtlIGl0IGVhc2llciB0byBjaGVjayBpZiBubyByb2xlcyBhcmUgcmVxdWlyZWRcbiAgICAgICAgaWYgXy5pc0VtcHR5IGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IGZhbHNlXG5cbiAgICAgICAgIyBDb25maWd1cmUgYXV0aCByZXF1aXJlbWVudFxuICAgICAgICBpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgQG9wdGlvbnM/LmF1dGhSZXF1aXJlZCBvciBlbmRwb2ludC5yb2xlUmVxdWlyZWRcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSBmYWxzZVxuXG4gICAgICAgIGlmIEBvcHRpb25zPy5zcGFjZVJlcXVpcmVkXG4gICAgICAgICAgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCA9IEBvcHRpb25zLnNwYWNlUmVxdWlyZWRcbiAgICAgICAgcmV0dXJuXG4gICAgLCB0aGlzXG4gICAgcmV0dXJuXG5cblxuICAjIyNcbiAgICBBdXRoZW50aWNhdGUgYW4gZW5kcG9pbnQgaWYgcmVxdWlyZWQsIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGl0XG5cbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgIyMjXG4gIF9jYWxsRW5kcG9pbnQ6IChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSAtPlxuICAgICMgQ2FsbCB0aGUgZW5kcG9pbnQgaWYgYXV0aGVudGljYXRpb24gZG9lc24ndCBmYWlsXG4gICAgaWYgQF9hdXRoQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgaWYgQF9yb2xlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICBpZiBAX3NwYWNlQWNjZXB0ZWQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuICAgICAgICAgICNlbmRwb2ludC5hY3Rpb24uY2FsbCBlbmRwb2ludENvbnRleHRcbiAgICAgICAgICBpbnZvY2F0aW9uID0gbmV3IEREUENvbW1vbi5NZXRob2RJbnZvY2F0aW9uXG4gICAgICAgICAgICBpc1NpbXVsYXRpb246IHRydWUsXG4gICAgICAgICAgICB1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXG4gICAgICAgICAgICBjb25uZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgcmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcbiAgICAgICBcbiAgICAgICAgICByZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUgaW52b2NhdGlvbiwgLT5cbiAgICAgICAgICAgIHJldHVybiBlbmRwb2ludC5hY3Rpb24uY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzXG4gICAgICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ0JhZCBYLVNwYWNlLUlkLCBPbmx5IGFkbWlucyBvZiBwYWlkIHNwYWNlIGNhbiBjYWxsIHRoaXMgYXBpLid9XG4gICAgICBlbHNlXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwM1xuICAgICAgICBib2R5OiB7c3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhpcy4nfVxuICAgIGVsc2VcbiAgICAgIHN0YXR1c0NvZGU6IDQwMVxuICAgICAgYm9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byBkbyB0aGlzLid9XG5cblxuICAjIyNcbiAgICBBdXRoZW50aWNhdGUgdGhlIGdpdmVuIGVuZHBvaW50IGlmIHJlcXVpcmVkXG5cbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gICAgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG5cbiAgICBAcmV0dXJucyBGYWxzZSBpZiBhdXRoZW50aWNhdGlvbiBmYWlscywgYW5kIHRydWUgb3RoZXJ3aXNlXG4gICMjI1xuICBfYXV0aEFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5hdXRoUmVxdWlyZWRcbiAgICAgIEBfYXV0aGVudGljYXRlIGVuZHBvaW50Q29udGV4dFxuICAgIGVsc2UgdHJ1ZVxuXG5cbiAgIyMjXG4gICAgVmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcblxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cblxuICAgIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAjIyNcbiAgX2F1dGhlbnRpY2F0ZTogKGVuZHBvaW50Q29udGV4dCkgLT5cbiAgICAjIEdldCBhdXRoIGluZm9cbiAgICBhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcblxuICAgICMgR2V0IHRoZSB1c2VyIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgaWYgYXV0aD8udXNlcklkIGFuZCBhdXRoPy50b2tlbiBhbmQgbm90IGF1dGg/LnVzZXJcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9XG4gICAgICB1c2VyU2VsZWN0b3IuX2lkID0gYXV0aC51c2VySWRcbiAgICAgIHVzZXJTZWxlY3RvcltAYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuXG4gICAgICBhdXRoLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSB1c2VyU2VsZWN0b3JcblxuICAgICMgQXR0YWNoIHRoZSB1c2VyIGFuZCB0aGVpciBJRCB0byB0aGUgY29udGV4dCBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICBpZiBhdXRoPy51c2VyXG4gICAgICBlbmRwb2ludENvbnRleHQudXNlciA9IGF1dGgudXNlclxuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXJJZCA9IGF1dGgudXNlci5faWRcbiAgICAgIHRydWVcbiAgICBlbHNlIGZhbHNlXG5cbiAgIyMjXG4gICAgQXV0aGVudGljYXRlIHRoZSB1c2VyIHJvbGUgaWYgcmVxdWlyZWRcblxuICAgIE11c3QgYmUgY2FsbGVkIGFmdGVyIF9hdXRoQWNjZXB0ZWQoKS5cblxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgIyMjXG4gIF9zcGFjZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5zcGFjZVJlcXVpcmVkXG4gICAgICBhdXRoID0gQGFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dClcbiAgICAgIGlmIGF1dGg/LnNwYWNlSWRcbiAgICAgICAgc3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiBhdXRoLnVzZXJJZCwgc3BhY2U6YXV0aC5zcGFjZUlkfSkuY291bnQoKVxuICAgICAgICBpZiBzcGFjZV91c2Vyc19jb3VudFxuICAgICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKVxuICAgICAgICAgICMgc3BhY2UgbXVzdCBiZSBwYWlkLCBhbmQgdXNlciBtdXN0IGJlIGFkbWluc1xuICAgICAgICAgIGlmIHNwYWNlPy5pc19wYWlkIGFuZCBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCk+PTBcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuXG4gICMjI1xuICAgIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG5cbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG5cbiAgICBAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuICAgICAgICAgICAgIGVuZHBvaW50XG4gICMjI1xuICBfcm9sZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cbiAgICBpZiBlbmRwb2ludC5yb2xlUmVxdWlyZWRcbiAgICAgIGlmIF8uaXNFbXB0eSBfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB0cnVlXG5cblxuICAjIyNcbiAgICBSZXNwb25kIHRvIGFuIEhUVFAgcmVxdWVzdFxuICAjIyNcbiAgX3Jlc3BvbmQ6IChyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZT0yMDAsIGhlYWRlcnM9e30pIC0+XG4gICAgIyBPdmVycmlkZSBhbnkgZGVmYXVsdCBoZWFkZXJzIHRoYXQgaGF2ZSBiZWVuIHByb3ZpZGVkIChrZXlzIGFyZSBub3JtYWxpemVkIHRvIGJlIGNhc2UgaW5zZW5zaXRpdmUpXG4gICAgIyBUT0RPOiBDb25zaWRlciBvbmx5IGxvd2VyY2FzaW5nIHRoZSBoZWFkZXIga2V5cyB3ZSBuZWVkIG5vcm1hbGl6ZWQsIGxpa2UgQ29udGVudC1UeXBlXG4gICAgZGVmYXVsdEhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgQGFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzXG4gICAgaGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBoZWFkZXJzXG4gICAgaGVhZGVycyA9IF8uZXh0ZW5kIGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzXG5cbiAgICAjIFByZXBhcmUgSlNPTiBib2R5IGZvciByZXNwb25zZSB3aGVuIENvbnRlbnQtVHlwZSBpbmRpY2F0ZXMgSlNPTiB0eXBlXG4gICAgaWYgaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pIGlzbnQgbnVsbFxuICAgICAgaWYgQGFwaS5fY29uZmlnLnByZXR0eUpzb25cbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHksIHVuZGVmaW5lZCwgMlxuICAgICAgZWxzZVxuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keVxuXG4gICAgIyBTZW5kIHJlc3BvbnNlXG4gICAgc2VuZFJlc3BvbnNlID0gLT5cbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCBzdGF0dXNDb2RlLCBoZWFkZXJzXG4gICAgICByZXNwb25zZS53cml0ZSBib2R5XG4gICAgICByZXNwb25zZS5lbmQoKVxuICAgIGlmIHN0YXR1c0NvZGUgaW4gWzQwMSwgNDAzXVxuICAgICAgIyBIYWNrZXJzIGNhbiBtZWFzdXJlIHRoZSByZXNwb25zZSB0aW1lIHRvIGRldGVybWluZSB0aGluZ3MgbGlrZSB3aGV0aGVyIHRoZSA0MDEgcmVzcG9uc2Ugd2FzIFxuICAgICAgIyBjYXVzZWQgYnkgYmFkIHVzZXIgaWQgdnMgYmFkIHBhc3N3b3JkLlxuICAgICAgIyBJbiBkb2luZyBzbywgdGhleSBjYW4gZmlyc3Qgc2NhbiBmb3IgdmFsaWQgdXNlciBpZHMgcmVnYXJkbGVzcyBvZiB2YWxpZCBwYXNzd29yZHMuXG4gICAgICAjIERlbGF5IGJ5IGEgcmFuZG9tIGFtb3VudCB0byByZWR1Y2UgdGhlIGFiaWxpdHkgZm9yIGEgaGFja2VyIHRvIGRldGVybWluZSB0aGUgcmVzcG9uc2UgdGltZS5cbiAgICAgICMgU2VlIGh0dHBzOi8vd3d3Lm93YXNwLm9yZy9pbmRleC5waHAvQmxvY2tpbmdfQnJ1dGVfRm9yY2VfQXR0YWNrcyNGaW5kaW5nX090aGVyX0NvdW50ZXJtZWFzdXJlc1xuICAgICAgIyBTZWUgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGltaW5nX2F0dGFja1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDBcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKClcbiAgICAgIGRlbGF5SW5NaWxsaXNlY29uZHMgPSBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyAqIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvXG4gICAgICBNZXRlb3Iuc2V0VGltZW91dCBzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHNcbiAgICBlbHNlXG4gICAgICBzZW5kUmVzcG9uc2UoKVxuXG4gICMjI1xuICAgIFJldHVybiB0aGUgb2JqZWN0IHdpdGggYWxsIG9mIHRoZSBrZXlzIGNvbnZlcnRlZCB0byBsb3dlcmNhc2VcbiAgIyMjXG4gIF9sb3dlckNhc2VLZXlzOiAob2JqZWN0KSAtPlxuICAgIF8uY2hhaW4gb2JqZWN0XG4gICAgLnBhaXJzKClcbiAgICAubWFwIChhdHRyKSAtPlxuICAgICAgW2F0dHJbMF0udG9Mb3dlckNhc2UoKSwgYXR0clsxXV1cbiAgICAub2JqZWN0KClcbiAgICAudmFsdWUoKVxuIiwic2hhcmUuUm91dGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFJvdXRlKGFwaSwgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzMSkge1xuICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmVuZHBvaW50cyA9IGVuZHBvaW50czE7XG4gICAgaWYgKCF0aGlzLmVuZHBvaW50cykge1xuICAgICAgdGhpcy5lbmRwb2ludHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBSb3V0ZS5wcm90b3R5cGUuYWRkVG9BcGkgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF2YWlsYWJsZU1ldGhvZHM7XG4gICAgYXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ107XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFsbG93ZWRNZXRob2RzLCBmdWxsUGF0aCwgcmVqZWN0ZWRNZXRob2RzLCBzZWxmO1xuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoXy5jb250YWlucyh0aGlzLmFwaS5fY29uZmlnLnBhdGhzLCB0aGlzLnBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiBcIiArIHRoaXMucGF0aCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IF8uZXh0ZW5kKHtcbiAgICAgICAgb3B0aW9uczogdGhpcy5hcGkuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50XG4gICAgICB9LCB0aGlzLmVuZHBvaW50cyk7XG4gICAgICB0aGlzLl9yZXNvbHZlRW5kcG9pbnRzKCk7XG4gICAgICB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuYXBpLl9jb25maWcucGF0aHMucHVzaCh0aGlzLnBhdGgpO1xuICAgICAgYWxsb3dlZE1ldGhvZHMgPSBfLmZpbHRlcihhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgcmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QoYXZhaWxhYmxlTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKF8ua2V5cyhzZWxmLmVuZHBvaW50cyksIG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICAgIGZ1bGxQYXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hcGlQYXRoICsgdGhpcy5wYXRoO1xuICAgICAgXy5lYWNoKGFsbG93ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGVuZHBvaW50O1xuICAgICAgICBlbmRwb2ludCA9IHNlbGYuZW5kcG9pbnRzW21ldGhvZF07XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBkb25lRnVuYywgZW5kcG9pbnRDb250ZXh0LCBlcnJvciwgcmVzcG9uc2VEYXRhLCByZXNwb25zZUluaXRpYXRlZDtcbiAgICAgICAgICByZXNwb25zZUluaXRpYXRlZCA9IGZhbHNlO1xuICAgICAgICAgIGRvbmVGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VJbml0aWF0ZWQgPSB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgZW5kcG9pbnRDb250ZXh0ID0ge1xuICAgICAgICAgICAgdXJsUGFyYW1zOiByZXEucGFyYW1zLFxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJlcS5xdWVyeSxcbiAgICAgICAgICAgIGJvZHlQYXJhbXM6IHJlcS5ib2R5LFxuICAgICAgICAgICAgcmVxdWVzdDogcmVxLFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlcyxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVGdW5jXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfLmV4dGVuZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSBudWxsO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSBzZWxmLl9jYWxsRW5kcG9pbnQoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgICAgICAgIGlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlKGVycm9yLCByZXEsIHJlcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZUluaXRpYXRlZCkge1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLmhlYWRlcnNTZW50KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VEYXRhID09PSBudWxsIHx8IHJlc3BvbnNlRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXR1cm4gbnVsbCBvciB1bmRlZmluZWQgZnJvbSBhbiBlbmRwb2ludDogXCIgKyBtZXRob2QgKyBcIiBcIiArIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlRGF0YS5ib2R5ICYmIChyZXNwb25zZURhdGEuc3RhdHVzQ29kZSB8fCByZXNwb25zZURhdGEuaGVhZGVycykpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLmJvZHksIHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlLCByZXNwb25zZURhdGEuaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKHJlamVjdGVkTWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBKc29uUm91dGVzLmFkZChtZXRob2QsIGZ1bGxQYXRoLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgICAgIHZhciBoZWFkZXJzLCByZXNwb25zZURhdGE7XG4gICAgICAgICAgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0FQSSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAnQWxsb3cnOiBhbGxvd2VkTWV0aG9kcy5qb2luKCcsICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBzZWxmLl9yZXNwb25kKHJlcywgcmVzcG9uc2VEYXRhLCA0MDUsIGhlYWRlcnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCk7XG5cblxuICAvKlxuICAgIENvbnZlcnQgYWxsIGVuZHBvaW50cyBvbiB0aGUgZ2l2ZW4gcm91dGUgaW50byBvdXIgZXhwZWN0ZWQgZW5kcG9pbnQgb2JqZWN0IGlmIGl0IGlzIGEgYmFyZVxuICAgIGZ1bmN0aW9uXG4gIFxuICAgIEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3Jlc29sdmVFbmRwb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICBfLmVhY2godGhpcy5lbmRwb2ludHMsIGZ1bmN0aW9uKGVuZHBvaW50LCBtZXRob2QsIGVuZHBvaW50cykge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbmRwb2ludCkpIHtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50c1ttZXRob2RdID0ge1xuICAgICAgICAgIGFjdGlvbjogZW5kcG9pbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQ29uZmlndXJlIHRoZSBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudCBvbiBhbGwgZW5kcG9pbnRzIChleGNlcHQgT1BUSU9OUywgd2hpY2ggbXVzdFxuICAgIGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuICBcbiAgICBBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuICAgIGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG4gICAgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEFmdGVyIHRoZSBlbmRwb2ludCBpcyBjb25maWd1cmVkLCBhbGwgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnRzIG9mIGFuIGVuZHBvaW50IGNhbiBiZVxuICAgIGFjY2Vzc2VkIGF0IDxjb2RlPmVuZHBvaW50LmF1dGhSZXF1aXJlZDwvY29kZT4gYW5kIDxjb2RlPmVuZHBvaW50LnJvbGVSZXF1aXJlZDwvY29kZT4sXG4gICAgcmVzcGVjdGl2ZWx5LlxuICBcbiAgICBAcGFyYW0ge1JvdXRlfSByb3V0ZSBUaGUgcm91dGUgdGhlIGVuZHBvaW50cyBiZWxvbmcgdG9cbiAgICBAcGFyYW0ge0VuZHBvaW50fSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY29uZmlndXJlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fY29uZmlndXJlRW5kcG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgXy5lYWNoKHRoaXMuZW5kcG9pbnRzLCBmdW5jdGlvbihlbmRwb2ludCwgbWV0aG9kKSB7XG4gICAgICB2YXIgcmVmLCByZWYxLCByZWYyO1xuICAgICAgaWYgKG1ldGhvZCAhPT0gJ29wdGlvbnMnKSB7XG4gICAgICAgIGlmICghKChyZWYgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYucm9sZVJlcXVpcmVkIDogdm9pZCAwKSkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IF8udW5pb24oZW5kcG9pbnQucm9sZVJlcXVpcmVkLCB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkKTtcbiAgICAgICAgaWYgKF8uaXNFbXB0eShlbmRwb2ludC5yb2xlUmVxdWlyZWQpKSB7XG4gICAgICAgICAgZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgaWYgKCgocmVmMSA9IHRoaXMub3B0aW9ucykgIT0gbnVsbCA/IHJlZjEuYXV0aFJlcXVpcmVkIDogdm9pZCAwKSB8fCBlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKHJlZjIgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYyLnNwYWNlUmVxdWlyZWQgOiB2b2lkIDApIHtcbiAgICAgICAgICBlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gdGhpcy5vcHRpb25zLnNwYWNlUmVxdWlyZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIGFuIGVuZHBvaW50IGlmIHJlcXVpcmVkLCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdFxuICBcbiAgICBAcmV0dXJucyBUaGUgZW5kcG9pbnQgcmVzcG9uc2Ugb3IgYSA0MDEgaWYgYXV0aGVudGljYXRpb24gZmFpbHNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9jYWxsRW5kcG9pbnQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGludm9jYXRpb247XG4gICAgaWYgKHRoaXMuX2F1dGhBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgaWYgKHRoaXMuX3JvbGVBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICBpZiAodGhpcy5fc3BhY2VBY2NlcHRlZChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSkge1xuICAgICAgICAgIGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb24oe1xuICAgICAgICAgICAgaXNTaW11bGF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgdXNlcklkOiBlbmRwb2ludENvbnRleHQudXNlcklkLFxuICAgICAgICAgICAgY29ubmVjdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IEREUENvbW1vbi5tYWtlUnBjU2VlZCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlKGludm9jYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVuZHBvaW50LmFjdGlvbi5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMyxcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnQmFkIFgtU3BhY2UtSWQsIE9ubHkgYWRtaW5zIG9mIHBhaWQgc3BhY2UgY2FuIGNhbGwgdGhpcyBhcGkuJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBkbyB0aGlzLidcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnWW91IG11c3QgYmUgbG9nZ2VkIGluIHRvIGRvIHRoaXMuJ1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuICBcbiAgICBPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG4gICAgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuIGVudGlyZSBlbmRwb2ludCwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkXG4gICAgaW4gYW55IGluZGl2aWR1YWwgZW5kcG9pbnRzLCB0aGF0IHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICAgIEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2F1dGhlbnRpY2F0ZShlbmRwb2ludENvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICAgIFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG4gIFxuICAgIElmIHZlcmlmaWVkLCBhdHRhY2ggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciB0byB0aGUgY29udGV4dC5cbiAgXG4gICAgQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aGVudGljYXRlID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0KSB7XG4gICAgdmFyIGF1dGgsIHVzZXJTZWxlY3RvcjtcbiAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgIGlmICgoYXV0aCAhPSBudWxsID8gYXV0aC51c2VySWQgOiB2b2lkIDApICYmIChhdXRoICE9IG51bGwgPyBhdXRoLnRva2VuIDogdm9pZCAwKSAmJiAhKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkpIHtcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9O1xuICAgICAgdXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkO1xuICAgICAgdXNlclNlbGVjdG9yW3RoaXMuYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuO1xuICAgICAgYXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUodXNlclNlbGVjdG9yKTtcbiAgICB9XG4gICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkge1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXI7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9zcGFjZUFjY2VwdGVkID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkge1xuICAgIHZhciBhdXRoLCBzcGFjZSwgc3BhY2VfdXNlcnNfY291bnQ7XG4gICAgaWYgKGVuZHBvaW50LnNwYWNlUmVxdWlyZWQpIHtcbiAgICAgIGF1dGggPSB0aGlzLmFwaS5fY29uZmlnLmF1dGgudXNlci5jYWxsKGVuZHBvaW50Q29udGV4dCk7XG4gICAgICBpZiAoYXV0aCAhPSBudWxsID8gYXV0aC5zcGFjZUlkIDogdm9pZCAwKSB7XG4gICAgICAgIHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgdXNlcjogYXV0aC51c2VySWQsXG4gICAgICAgICAgc3BhY2U6IGF1dGguc3BhY2VJZFxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcnNfY291bnQpIHtcbiAgICAgICAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZCk7XG4gICAgICAgICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpID49IDApIHtcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgICBBdXRoZW50aWNhdGUgdGhlIHVzZXIgcm9sZSBpZiByZXF1aXJlZFxuICBcbiAgICBNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG4gIFxuICAgIEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gICAgICAgICAgICAgZW5kcG9pbnRcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yb2xlQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LnJvbGVSZXF1aXJlZCkge1xuICAgICAgaWYgKF8uaXNFbXB0eShfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qXG4gICAgUmVzcG9uZCB0byBhbiBIVFRQIHJlcXVlc3RcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9yZXNwb25kID0gZnVuY3Rpb24ocmVzcG9uc2UsIGJvZHksIHN0YXR1c0NvZGUsIGhlYWRlcnMpIHtcbiAgICB2YXIgZGVmYXVsdEhlYWRlcnMsIGRlbGF5SW5NaWxsaXNlY29uZHMsIG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzLCByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bywgc2VuZFJlc3BvbnNlO1xuICAgIGlmIChzdGF0dXNDb2RlID09IG51bGwpIHtcbiAgICAgIHN0YXR1c0NvZGUgPSAyMDA7XG4gICAgfVxuICAgIGlmIChoZWFkZXJzID09IG51bGwpIHtcbiAgICAgIGhlYWRlcnMgPSB7fTtcbiAgICB9XG4gICAgZGVmYXVsdEhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKHRoaXMuYXBpLl9jb25maWcuZGVmYXVsdEhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSB0aGlzLl9sb3dlckNhc2VLZXlzKGhlYWRlcnMpO1xuICAgIGhlYWRlcnMgPSBfLmV4dGVuZChkZWZhdWx0SGVhZGVycywgaGVhZGVycyk7XG4gICAgaWYgKGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddLm1hdGNoKC9qc29ufGphdmFzY3JpcHQvKSAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuYXBpLl9jb25maWcucHJldHR5SnNvbikge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSwgdm9pZCAwLCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXNwb25zZS53cml0ZUhlYWQoc3RhdHVzQ29kZSwgaGVhZGVycyk7XG4gICAgICByZXNwb25zZS53cml0ZShib2R5KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5lbmQoKTtcbiAgICB9O1xuICAgIGlmIChzdGF0dXNDb2RlID09PSA0MDEgfHwgc3RhdHVzQ29kZSA9PT0gNDAzKSB7XG4gICAgICBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMDtcbiAgICAgIHJhbmRvbU11bHRpcGxpZXJCZXR3ZWVuT25lQW5kVHdvID0gMSArIE1hdGgucmFuZG9tKCk7XG4gICAgICBkZWxheUluTWlsbGlzZWNvbmRzID0gbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgKiByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3bztcbiAgICAgIHJldHVybiBNZXRlb3Iuc2V0VGltZW91dChzZW5kUmVzcG9uc2UsIGRlbGF5SW5NaWxsaXNlY29uZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2VuZFJlc3BvbnNlKCk7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgICBSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fbG93ZXJDYXNlS2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBfLmNoYWluKG9iamVjdCkucGFpcnMoKS5tYXAoZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dO1xuICAgIH0pLm9iamVjdCgpLnZhbHVlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJvdXRlO1xuXG59KSgpO1xuIiwiY2xhc3MgQFJlc3RpdnVzXG5cbiAgY29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuICAgIEBfcm91dGVzID0gW11cbiAgICBAX2NvbmZpZyA9XG4gICAgICBwYXRoczogW11cbiAgICAgIHVzZURlZmF1bHRBdXRoOiBmYWxzZVxuICAgICAgYXBpUGF0aDogJ2FwaS8nXG4gICAgICB2ZXJzaW9uOiBudWxsXG4gICAgICBwcmV0dHlKc29uOiBmYWxzZVxuICAgICAgYXV0aDpcbiAgICAgICAgdG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nXG4gICAgICAgIHVzZXI6IC0+XG4gICAgICAgICAgaWYgQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG4gICAgICAgICAgaWYgQHJlcXVlc3QudXNlcklkXG4gICAgICAgICAgICBfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogQHJlcXVlc3QudXNlcklkfSlcbiAgICAgICAgICAgIHVzZXI6IF91c2VyXG4gICAgICAgICAgICB1c2VySWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddXG4gICAgICAgICAgICBzcGFjZUlkOiBAcmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ11cbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHVzZXJJZDogQHJlcXVlc3QuaGVhZGVyc1sneC11c2VyLWlkJ11cbiAgICAgICAgICAgIHNwYWNlSWQ6IEByZXF1ZXN0LmhlYWRlcnNbJ3gtc3BhY2UtaWQnXVxuICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICBkZWZhdWx0SGVhZGVyczpcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgZW5hYmxlQ29yczogdHJ1ZVxuXG4gICAgIyBDb25maWd1cmUgQVBJIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcbiAgICBfLmV4dGVuZCBAX2NvbmZpZywgb3B0aW9uc1xuXG4gICAgaWYgQF9jb25maWcuZW5hYmxlQ29yc1xuICAgICAgY29yc0hlYWRlcnMgPVxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQnXG5cbiAgICAgIGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4nXG5cbiAgICAgICMgU2V0IGRlZmF1bHQgaGVhZGVyIHRvIGVuYWJsZSBDT1JTIGlmIGNvbmZpZ3VyZWRcbiAgICAgIF8uZXh0ZW5kIEBfY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVyc1xuXG4gICAgICBpZiBub3QgQF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludFxuICAgICAgICBAX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gLT5cbiAgICAgICAgICBAcmVzcG9uc2Uud3JpdGVIZWFkIDIwMCwgY29yc0hlYWRlcnNcbiAgICAgICAgICBAZG9uZSgpXG5cbiAgICAjIE5vcm1hbGl6ZSB0aGUgQVBJIHBhdGhcbiAgICBpZiBAX2NvbmZpZy5hcGlQYXRoWzBdIGlzICcvJ1xuICAgICAgQF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGguc2xpY2UgMVxuICAgIGlmIF8ubGFzdChAX2NvbmZpZy5hcGlQYXRoKSBpc250ICcvJ1xuICAgICAgQF9jb25maWcuYXBpUGF0aCA9IEBfY29uZmlnLmFwaVBhdGggKyAnLydcblxuICAgICMgVVJMIHBhdGggdmVyc2lvbmluZyBpcyB0aGUgb25seSB0eXBlIG9mIEFQSSB2ZXJzaW9uaW5nIGN1cnJlbnRseSBhdmFpbGFibGUsIHNvIGlmIGEgdmVyc2lvbiBpc1xuICAgICMgcHJvdmlkZWQsIGFwcGVuZCBpdCB0byB0aGUgYmFzZSBwYXRoIG9mIHRoZSBBUElcbiAgICBpZiBAX2NvbmZpZy52ZXJzaW9uXG4gICAgICBAX2NvbmZpZy5hcGlQYXRoICs9IEBfY29uZmlnLnZlcnNpb24gKyAnLydcblxuICAgICMgQWRkIGRlZmF1bHQgbG9naW4gYW5kIGxvZ291dCBlbmRwb2ludHMgaWYgYXV0aCBpcyBjb25maWd1cmVkXG4gICAgaWYgQF9jb25maWcudXNlRGVmYXVsdEF1dGhcbiAgICAgIEBfaW5pdEF1dGgoKVxuICAgIGVsc2UgaWYgQF9jb25maWcudXNlQXV0aFxuICAgICAgQF9pbml0QXV0aCgpXG4gICAgICBjb25zb2xlLndhcm4gJ1dhcm5pbmc6IHVzZUF1dGggQVBJIGNvbmZpZyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAgJyArXG4gICAgICAgICAgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJ1xuXG4gICAgcmV0dXJuIHRoaXNcblxuXG4gICMjIypcbiAgICBBZGQgZW5kcG9pbnRzIGZvciB0aGUgZ2l2ZW4gSFRUUCBtZXRob2RzIGF0IHRoZSBnaXZlbiBwYXRoXG5cbiAgICBAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXG4gICAgQHBhcmFtIG9wdGlvbnMge09iamVjdH0gUm91dGUgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAgQHBhcmFtIG9wdGlvbnMuYXV0aFJlcXVpcmVkIHtCb29sZWFufSBUaGUgZGVmYXVsdCBhdXRoIHJlcXVpcmVtZW50IGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICAgIEBwYXJhbSBlbmRwb2ludHMge09iamVjdH0gQSBzZXQgb2YgZW5kcG9pbnRzIGF2YWlsYWJsZSBvbiB0aGUgbmV3IHJvdXRlIChnZXQsIHBvc3QsIHB1dCwgcGF0Y2gsIGRlbGV0ZSwgb3B0aW9ucylcbiAgICBAcGFyYW0gZW5kcG9pbnRzLjxtZXRob2Q+IHtGdW5jdGlvbiBvciBPYmplY3R9IElmIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGFsbCBkZWZhdWx0IHJvdXRlXG4gICAgICAgIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcbiAgICAgICAgYW5kIGFsbCBvdGhlciByb3V0ZSBjb25maWcgb3B0aW9ucyBhdmFpbGFibGUuIEFuIGBhY3Rpb25gIG11c3QgYmUgcHJvdmlkZWQgd2l0aCB0aGUgb2JqZWN0LlxuICAjIyNcbiAgYWRkUm91dGU6IChwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpIC0+XG4gICAgIyBDcmVhdGUgYSBuZXcgcm91dGUgYW5kIGFkZCBpdCB0byBvdXIgbGlzdCBvZiBleGlzdGluZyByb3V0ZXNcbiAgICByb3V0ZSA9IG5ldyBzaGFyZS5Sb3V0ZSh0aGlzLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMpXG4gICAgQF9yb3V0ZXMucHVzaChyb3V0ZSlcblxuICAgIHJvdXRlLmFkZFRvQXBpKClcblxuICAgIHJldHVybiB0aGlzXG5cblxuICAjIyMqXG4gICAgR2VuZXJhdGUgcm91dGVzIGZvciB0aGUgTWV0ZW9yIENvbGxlY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxuICAjIyNcbiAgYWRkQ29sbGVjdGlvbjogKGNvbGxlY3Rpb24sIG9wdGlvbnM9e30pIC0+XG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXVxuICAgIG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ11cblxuICAgICMgR3JhYiB0aGUgc2V0IG9mIGVuZHBvaW50c1xuICAgIGlmIGNvbGxlY3Rpb24gaXMgTWV0ZW9yLnVzZXJzXG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF91c2VyQ29sbGVjdGlvbkVuZHBvaW50c1xuICAgIGVsc2VcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSBAX2NvbGxlY3Rpb25FbmRwb2ludHNcblxuICAgICMgRmxhdHRlbiB0aGUgb3B0aW9ucyBhbmQgc2V0IGRlZmF1bHRzIGlmIG5lY2Vzc2FyeVxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIG9yIHt9XG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgb3Ige31cbiAgICBleGNsdWRlZEVuZHBvaW50cyA9IG9wdGlvbnMuZXhjbHVkZWRFbmRwb2ludHMgb3IgW11cbiAgICAjIFVzZSBjb2xsZWN0aW9uIG5hbWUgYXMgZGVmYXVsdCBwYXRoXG4gICAgcGF0aCA9IG9wdGlvbnMucGF0aCBvciBjb2xsZWN0aW9uLl9uYW1lXG5cbiAgICAjIFNlcGFyYXRlIHRoZSByZXF1ZXN0ZWQgZW5kcG9pbnRzIGJ5IHRoZSByb3V0ZSB0aGV5IGJlbG9uZyB0byAob25lIGZvciBvcGVyYXRpbmcgb24gdGhlIGVudGlyZVxuICAgICMgY29sbGVjdGlvbiBhbmQgb25lIGZvciBvcGVyYXRpbmcgb24gYSBzaW5nbGUgZW50aXR5IHdpdGhpbiB0aGUgY29sbGVjdGlvbilcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fVxuICAgIGVudGl0eVJvdXRlRW5kcG9pbnRzID0ge31cbiAgICBpZiBfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSBhbmQgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKVxuICAgICAgIyBHZW5lcmF0ZSBhbGwgZW5kcG9pbnRzIG9uIHRoaXMgY29sbGVjdGlvblxuICAgICAgXy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgICMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xuICAgICAgICBpZiBtZXRob2QgaW4gbWV0aG9kc09uQ29sbGVjdGlvblxuICAgICAgICAgIF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcbiAgICAgICAgZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbilcbiAgICAgICAgcmV0dXJuXG4gICAgICAsIHRoaXNcbiAgICBlbHNlXG4gICAgICAjIEdlbmVyYXRlIGFueSBlbmRwb2ludHMgdGhhdCBoYXZlbid0IGJlZW4gZXhwbGljaXRseSBleGNsdWRlZFxuICAgICAgXy5lYWNoIG1ldGhvZHMsIChtZXRob2QpIC0+XG4gICAgICAgIGlmIG1ldGhvZCBub3QgaW4gZXhjbHVkZWRFbmRwb2ludHMgYW5kIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdIGlzbnQgZmFsc2VcbiAgICAgICAgICAjIENvbmZpZ3VyZSBlbmRwb2ludCBhbmQgbWFwIHRvIGl0J3MgaHR0cCBtZXRob2RcbiAgICAgICAgICAjIFRPRE86IENvbnNpZGVyIHByZWRlZmluaW5nIGEgbWFwIG9mIG1ldGhvZHMgdG8gdGhlaXIgaHR0cCBtZXRob2QgdHlwZSAoZS5nLiwgZ2V0QWxsOiBnZXQpXG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF1cbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fVxuICAgICAgICAgIF8uZWFjaCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSwgKGFjdGlvbiwgbWV0aG9kVHlwZSkgLT5cbiAgICAgICAgICAgIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9XG4gICAgICAgICAgICAgIF8uY2hhaW4gYWN0aW9uXG4gICAgICAgICAgICAgIC5jbG9uZSgpXG4gICAgICAgICAgICAgIC5leHRlbmQgZW5kcG9pbnRPcHRpb25zXG4gICAgICAgICAgICAgIC52YWx1ZSgpXG4gICAgICAgICAgIyBQYXJ0aXRpb24gdGhlIGVuZHBvaW50cyBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgcm91dGVzXG4gICAgICAgICAgaWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cbiAgICAgICAgICAgIF8uZXh0ZW5kIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XG4gICAgICAgICAgZWxzZSBfLmV4dGVuZCBlbnRpdHlSb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAsIHRoaXNcblxuICAgICMgQWRkIHRoZSByb3V0ZXMgdG8gdGhlIEFQSVxuICAgIEBhZGRSb3V0ZSBwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50c1xuICAgIEBhZGRSb3V0ZSBcIiN7cGF0aH0vOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHNcblxuICAgIHJldHVybiB0aGlzXG5cblxuICAjIyMqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG4gICMjI1xuICBfY29sbGVjdGlvbkVuZHBvaW50czpcbiAgICBnZXQ6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZ2V0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgc2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgc2VsZWN0b3JcbiAgICAgICAgICBpZiBlbnRpdHlcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuICAgIHB1dDogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBwdXQ6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIHNlbGVjdG9yLCAkc2V0OiBAYm9keVBhcmFtc1xuICAgICAgICAgIGlmIGVudGl0eUlzVXBkYXRlZFxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuICAgIGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBkZWxldGU6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBzZWxlY3RvciA9IHtfaWQ6IEB1cmxQYXJhbXMuaWR9XG4gICAgICAgICAgaWYgdGhpcy5zcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuICAgICAgICAgIGlmIGNvbGxlY3Rpb24ucmVtb3ZlIHNlbGVjdG9yXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdJdGVtIHJlbW92ZWQnfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnSXRlbSBub3QgZm91bmQnfVxuICAgIHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgcG9zdDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGlmIHRoaXMuc3BhY2VJZFxuICAgICAgICAgICAgQGJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWRcbiAgICAgICAgICBlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IEBib2R5UGFyYW1zXG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIGVudGl0eUlkXG4gICAgICAgICAgaWYgZW50aXR5XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDFcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gaXRlbSBhZGRlZCd9XG4gICAgZ2V0QWxsOiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIHNlbGVjdG9yID0ge31cbiAgICAgICAgICBpZiB0aGlzLnNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG4gICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoc2VsZWN0b3IpLmZldGNoKClcbiAgICAgICAgICBpZiBlbnRpdGllc1xuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nfVxuXG5cbiAgIyMjKlxuICAgIEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcbiAgIyMjXG4gIF91c2VyQ29sbGVjdGlvbkVuZHBvaW50czpcbiAgICBnZXQ6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgZ2V0OlxuICAgICAgICBhY3Rpb246IC0+XG4gICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxuICAgICAgICAgIGlmIGVudGl0eVxuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdHl9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0XG4gICAgICAgICAgICBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCd9XG4gICAgcHV0OiAoY29sbGVjdGlvbikgLT5cbiAgICAgIHB1dDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlIEB1cmxQYXJhbXMuaWQsICRzZXQ6IHByb2ZpbGU6IEBib2R5UGFyYW1zXG4gICAgICAgICAgaWYgZW50aXR5SXNVcGRhdGVkXG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgQHVybFBhcmFtcy5pZCwgZmllbGRzOiBwcm9maWxlOiAxXG4gICAgICAgICAgICB7c3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuICAgIGRlbGV0ZTogKGNvbGxlY3Rpb24pIC0+XG4gICAgICBkZWxldGU6XG4gICAgICAgIGFjdGlvbjogLT5cbiAgICAgICAgICBpZiBjb2xsZWN0aW9uLnJlbW92ZSBAdXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IG1lc3NhZ2U6ICdVc2VyIHJlbW92ZWQnfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNFxuICAgICAgICAgICAgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuICAgIHBvc3Q6IChjb2xsZWN0aW9uKSAtPlxuICAgICAgcG9zdDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgICMgQ3JlYXRlIGEgbmV3IHVzZXIgYWNjb3VudFxuICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlciBAYm9keVBhcmFtc1xuICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZCwgZmllbGRzOiBwcm9maWxlOiAxXG4gICAgICAgICAgaWYgZW50aXR5XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDFcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMFxuICAgICAgICAgICAge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnTm8gdXNlciBhZGRlZCd9XG4gICAgZ2V0QWxsOiAoY29sbGVjdGlvbikgLT5cbiAgICAgIGdldDpcbiAgICAgICAgYWN0aW9uOiAtPlxuICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHt9LCBmaWVsZHM6IHByb2ZpbGU6IDEpLmZldGNoKClcbiAgICAgICAgICBpZiBlbnRpdGllc1xuICAgICAgICAgICAge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBlbnRpdGllc31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDRcbiAgICAgICAgICAgIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2Vycyd9XG5cblxuICAjIyNcbiAgICBBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXG4gICMjI1xuICBfaW5pdEF1dGg6IC0+XG4gICAgc2VsZiA9IHRoaXNcbiAgICAjIyNcbiAgICAgIEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcblxuICAgICAgQWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIGluLCB0aGUgb25Mb2dnZWRJbiBob29rIGlzIGNhbGxlZCAoc2VlIFJlc3RmdWxseS5jb25maWd1cmUoKSBmb3JcbiAgICAgIGFkZGluZyBob29rKS5cbiAgICAjIyNcbiAgICBAYWRkUm91dGUgJ2xvZ2luJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LFxuICAgICAgcG9zdDogLT5cbiAgICAgICAgIyBHcmFiIHRoZSB1c2VybmFtZSBvciBlbWFpbCB0aGF0IHRoZSB1c2VyIGlzIGxvZ2dpbmcgaW4gd2l0aFxuICAgICAgICB1c2VyID0ge31cbiAgICAgICAgaWYgQGJvZHlQYXJhbXMudXNlclxuICAgICAgICAgIGlmIEBib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpIGlzIC0xXG4gICAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlclxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy51c2VyXG4gICAgICAgIGVsc2UgaWYgQGJvZHlQYXJhbXMudXNlcm5hbWVcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gQGJvZHlQYXJhbXMudXNlcm5hbWVcbiAgICAgICAgZWxzZSBpZiBAYm9keVBhcmFtcy5lbWFpbFxuICAgICAgICAgIHVzZXIuZW1haWwgPSBAYm9keVBhcmFtcy5lbWFpbFxuXG4gICAgICAgICMgVHJ5IHRvIGxvZyB0aGUgdXNlciBpbnRvIHRoZSB1c2VyJ3MgYWNjb3VudCAoaWYgc3VjY2Vzc2Z1bCB3ZSdsbCBnZXQgYW4gYXV0aCB0b2tlbiBiYWNrKVxuICAgICAgICB0cnlcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCB1c2VyLCBAYm9keVBhcmFtcy5wYXNzd29yZFxuICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgY29uc29sZS5lcnJvciBlXG4gICAgICAgICAgcmV0dXJuIHt9ID1cbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3JcbiAgICAgICAgICAgIGJvZHk6IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogZS5yZWFzb25cblxuICAgICAgICAjIEdldCB0aGUgYXV0aGVudGljYXRlZCB1c2VyXG4gICAgICAgICMgVE9ETzogQ29uc2lkZXIgcmV0dXJuaW5nIHRoZSB1c2VyIGluIEF1dGgubG9naW5XaXRoUGFzc3dvcmQoKSwgaW5zdGVhZCBvZiBmZXRjaGluZyBpdCBhZ2FpbiBoZXJlXG4gICAgICAgIGlmIGF1dGgudXNlcklkIGFuZCBhdXRoLmF1dGhUb2tlblxuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge31cbiAgICAgICAgICBzZWFyY2hRdWVyeVtzZWxmLl9jb25maWcuYXV0aC50b2tlbl0gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aC5hdXRoVG9rZW5cbiAgICAgICAgICBAdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcbiAgICAgICAgICAgIHNlYXJjaFF1ZXJ5XG4gICAgICAgICAgQHVzZXJJZCA9IEB1c2VyPy5faWRcblxuICAgICAgICByZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogYXV0aH1cblxuICAgICAgICAjIENhbGwgdGhlIGxvZ2luIGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXG4gICAgICAgIGV4dHJhRGF0YSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluPy5jYWxsKHRoaXMpXG4gICAgICAgIGlmIGV4dHJhRGF0YT9cbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7ZXh0cmE6IGV4dHJhRGF0YX0pXG5cbiAgICAgICAgcmVzcG9uc2VcblxuICAgIGxvZ291dCA9IC0+XG4gICAgICAjIFJlbW92ZSB0aGUgZ2l2ZW4gYXV0aCB0b2tlbiBmcm9tIHRoZSB1c2VyJ3MgYWNjb3VudFxuICAgICAgYXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ11cbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGhUb2tlblxuICAgICAgdG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuXG4gICAgICBpbmRleCA9IHRva2VuTG9jYXRpb24ubGFzdEluZGV4T2YgJy4nXG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyAwLCBpbmRleFxuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyBpbmRleCArIDFcbiAgICAgIHRva2VuVG9SZW1vdmUgPSB7fVxuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlblxuICAgICAgdG9rZW5SZW1vdmFsUXVlcnkgPSB7fVxuICAgICAgdG9rZW5SZW1vdmFsUXVlcnlbdG9rZW5QYXRoXSA9IHRva2VuVG9SZW1vdmVcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUgQHVzZXIuX2lkLCB7JHB1bGw6IHRva2VuUmVtb3ZhbFF1ZXJ5fVxuXG4gICAgICByZXNwb25zZSA9IHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdZb3VcXCd2ZSBiZWVuIGxvZ2dlZCBvdXQhJ319XG5cbiAgICAgICMgQ2FsbCB0aGUgbG9nb3V0IGhvb2sgd2l0aCB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGF0dGFjaGVkXG4gICAgICBleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQ/LmNhbGwodGhpcylcbiAgICAgIGlmIGV4dHJhRGF0YT9cbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxuXG4gICAgICByZXNwb25zZVxuXG4gICAgIyMjXG4gICAgICBBZGQgYSBsb2dvdXQgZW5kcG9pbnQgdG8gdGhlIEFQSVxuXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgIyMjXG4gICAgQGFkZFJvdXRlICdsb2dvdXQnLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSxcbiAgICAgIGdldDogLT5cbiAgICAgICAgY29uc29sZS53YXJuIFwiV2FybmluZzogRGVmYXVsdCBsb2dvdXQgdmlhIEdFVCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMC4gVXNlIFBPU1QgaW5zdGVhZC5cIlxuICAgICAgICBjb25zb2xlLndhcm4gXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCJcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpXG4gICAgICBwb3N0OiBsb2dvdXRcblxuUmVzdGl2dXMgPSBAUmVzdGl2dXNcbiIsInZhciBSZXN0aXZ1cyxcbiAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG50aGlzLlJlc3RpdnVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBSZXN0aXZ1cyhvcHRpb25zKSB7XG4gICAgdmFyIGNvcnNIZWFkZXJzO1xuICAgIHRoaXMuX3JvdXRlcyA9IFtdO1xuICAgIHRoaXMuX2NvbmZpZyA9IHtcbiAgICAgIHBhdGhzOiBbXSxcbiAgICAgIHVzZURlZmF1bHRBdXRoOiBmYWxzZSxcbiAgICAgIGFwaVBhdGg6ICdhcGkvJyxcbiAgICAgIHZlcnNpb246IG51bGwsXG4gICAgICBwcmV0dHlKc29uOiBmYWxzZSxcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgdG9rZW46ICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nLFxuICAgICAgICB1c2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3VzZXIsIHRva2VuO1xuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10pIHtcbiAgICAgICAgICAgIHRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnJlcXVlc3QudXNlcklkKSB7XG4gICAgICAgICAgICBfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMucmVxdWVzdC51c2VySWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdXNlcjogX3VzZXIsXG4gICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddLFxuICAgICAgICAgICAgICBzcGFjZUlkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddLFxuICAgICAgICAgICAgICBzcGFjZUlkOiB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddLFxuICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdEhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGVuYWJsZUNvcnM6IHRydWVcbiAgICB9O1xuICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZywgb3B0aW9ucyk7XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5lbmFibGVDb3JzKSB7XG4gICAgICBjb3JzSGVhZGVycyA9IHtcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCdcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5fY29uZmlnLnVzZURlZmF1bHRBdXRoKSB7XG4gICAgICAgIGNvcnNIZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gKz0gJywgWC1Vc2VyLUlkLCBYLUF1dGgtVG9rZW4nO1xuICAgICAgfVxuICAgICAgXy5leHRlbmQodGhpcy5fY29uZmlnLmRlZmF1bHRIZWFkZXJzLCBjb3JzSGVhZGVycyk7XG4gICAgICBpZiAoIXRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50KSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZy5kZWZhdWx0T3B0aW9uc0VuZHBvaW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZS53cml0ZUhlYWQoMjAwLCBjb3JzSGVhZGVycyk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLmFwaVBhdGhbMF0gPT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aC5zbGljZSgxKTtcbiAgICB9XG4gICAgaWYgKF8ubGFzdCh0aGlzLl9jb25maWcuYXBpUGF0aCkgIT09ICcvJykge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggPSB0aGlzLl9jb25maWcuYXBpUGF0aCArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy52ZXJzaW9uKSB7XG4gICAgICB0aGlzLl9jb25maWcuYXBpUGF0aCArPSB0aGlzLl9jb25maWcudmVyc2lvbiArICcvJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbmZpZy51c2VBdXRoKSB7XG4gICAgICB0aGlzLl9pbml0QXV0aCgpO1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgKyAnXFxuICAgIFVzZSB0aGUgdXNlRGVmYXVsdEF1dGggb3B0aW9uIGluc3RlYWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICAgIEFkZCBlbmRwb2ludHMgZm9yIHRoZSBnaXZlbiBIVFRQIG1ldGhvZHMgYXQgdGhlIGdpdmVuIHBhdGhcbiAgXG4gICAgQHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuICAgIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgIEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgICBAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG4gICAgQHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuICAgICAgICBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG4gICAgICAgIGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cbiAgICovXG5cbiAgUmVzdGl2dXMucHJvdG90eXBlLmFkZFJvdXRlID0gZnVuY3Rpb24ocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSB7XG4gICAgdmFyIHJvdXRlO1xuICAgIHJvdXRlID0gbmV3IHNoYXJlLlJvdXRlKHRoaXMsIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cyk7XG4gICAgdGhpcy5fcm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJvdXRlLmFkZFRvQXBpKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgICBHZW5lcmF0ZSByb3V0ZXMgZm9yIHRoZSBNZXRlb3IgQ29sbGVjdGlvbiB3aXRoIHRoZSBnaXZlbiBuYW1lXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5hZGRDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgb3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uRW5kcG9pbnRzLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiwgZW50aXR5Um91dGVFbmRwb2ludHMsIGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2RzLCBtZXRob2RzT25Db2xsZWN0aW9uLCBwYXRoLCByb3V0ZU9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ2dldEFsbCddO1xuICAgIG1ldGhvZHNPbkNvbGxlY3Rpb24gPSBbJ3Bvc3QnLCAnZ2V0QWxsJ107XG4gICAgaWYgKGNvbGxlY3Rpb24gPT09IE1ldGVvci51c2Vycykge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uRW5kcG9pbnRzID0gdGhpcy5fY29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9XG4gICAgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uID0gb3B0aW9ucy5lbmRwb2ludHMgfHwge307XG4gICAgcm91dGVPcHRpb25zID0gb3B0aW9ucy5yb3V0ZU9wdGlvbnMgfHwge307XG4gICAgZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIHx8IFtdO1xuICAgIHBhdGggPSBvcHRpb25zLnBhdGggfHwgY29sbGVjdGlvbi5fbmFtZTtcbiAgICBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9O1xuICAgIGlmIChfLmlzRW1wdHkoZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uKSAmJiBfLmlzRW1wdHkoZXhjbHVkZWRFbmRwb2ludHMpKSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgXy5leHRlbmQoY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF8uZWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgdmFyIGNvbmZpZ3VyZWRFbmRwb2ludCwgZW5kcG9pbnRPcHRpb25zO1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKGV4Y2x1ZGVkRW5kcG9pbnRzLCBtZXRob2QpIDwgMCAmJiBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBlbmRwb2ludE9wdGlvbnMgPSBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXTtcbiAgICAgICAgICBjb25maWd1cmVkRW5kcG9pbnQgPSB7fTtcbiAgICAgICAgICBfLmVhY2goY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIGZ1bmN0aW9uKGFjdGlvbiwgbWV0aG9kVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyZWRFbmRwb2ludFttZXRob2RUeXBlXSA9IF8uY2hhaW4oYWN0aW9uKS5jbG9uZSgpLmV4dGVuZChlbmRwb2ludE9wdGlvbnMpLnZhbHVlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGluZGV4T2YuY2FsbChtZXRob2RzT25Db2xsZWN0aW9uLCBtZXRob2QpID49IDApIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29uZmlndXJlZEVuZHBvaW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5leHRlbmQoZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoLCByb3V0ZU9wdGlvbnMsIGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cyk7XG4gICAgdGhpcy5hZGRSb3V0ZShwYXRoICsgXCIvOmlkXCIsIHJvdXRlT3B0aW9ucywgZW50aXR5Um91dGVFbmRwb2ludHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIFJlc3RpdnVzLnByb3RvdHlwZS5fY29sbGVjdGlvbkVuZHBvaW50cyA9IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHV0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwdXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0eSwgZW50aXR5SXNVcGRhdGVkLCBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0eUlzVXBkYXRlZCA9IGNvbGxlY3Rpb24udXBkYXRlKHNlbGVjdG9yLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHRoaXMuYm9keVBhcmFtc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5SXNVcGRhdGVkKSB7XG4gICAgICAgICAgICAgIGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSh0aGlzLnVybFBhcmFtcy5pZCk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnVybFBhcmFtcy5pZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJdGVtIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5ib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCh0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyBpdGVtIGFkZGVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRBbGw6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXRpZXMsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwYWNlSWQpIHtcbiAgICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZChzZWxlY3RvcikuZmV0Y2goKTtcbiAgICAgICAgICAgIGlmIChlbnRpdGllcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0aWVzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gICAgQSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBNZXRlb3IudXNlcnMgQ29sbGVjdGlvbiBSb3V0ZVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQ7XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUodGhpcy51cmxQYXJhbXMuaWQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlcih0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgKHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzO1xuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoe30sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2VycydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICAgQWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuICAgKi9cblxuICBSZXN0aXZ1cy5wcm90b3R5cGUuX2luaXRBdXRoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxvZ291dCwgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcblxuICAgIC8qXG4gICAgICBBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIHRoZSBvbkxvZ2dlZEluIGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgICAgYWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHRoaXMuYWRkUm91dGUoJ2xvZ2luJywge1xuICAgICAgYXV0aFJlcXVpcmVkOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIHBvc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXV0aCwgZSwgZXh0cmFEYXRhLCByZWYsIHJlZjEsIHJlc3BvbnNlLCBzZWFyY2hRdWVyeSwgdXNlcjtcbiAgICAgICAgdXNlciA9IHt9O1xuICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5ib2R5UGFyYW1zLnVzZXIuaW5kZXhPZignQCcpID09PSAtMSkge1xuICAgICAgICAgICAgdXNlci51c2VybmFtZSA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gdGhpcy5ib2R5UGFyYW1zLnVzZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VybmFtZSkge1xuICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5UGFyYW1zLmVtYWlsKSB7XG4gICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy5lbWFpbDtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF1dGggPSBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKHVzZXIsIHRoaXMuYm9keVBhcmFtcy5wYXNzd29yZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IGUuZXJyb3IsXG4gICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZS5yZWFzb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdXRoLnVzZXJJZCAmJiBhdXRoLmF1dGhUb2tlbikge1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5ID0ge307XG4gICAgICAgICAgc2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGguYXV0aFRva2VuKTtcbiAgICAgICAgICB0aGlzLnVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAnX2lkJzogYXV0aC51c2VySWRcbiAgICAgICAgICB9LCBzZWFyY2hRdWVyeSk7XG4gICAgICAgICAgdGhpcy51c2VySWQgPSAocmVmID0gdGhpcy51c2VyKSAhPSBudWxsID8gcmVmLl9pZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICBkYXRhOiBhdXRoXG4gICAgICAgIH07XG4gICAgICAgIGV4dHJhRGF0YSA9IChyZWYxID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkSW4pICE9IG51bGwgPyByZWYxLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgIF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtcbiAgICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXV0aFRva2VuLCBleHRyYURhdGEsIGhhc2hlZFRva2VuLCBpbmRleCwgcmVmLCByZXNwb25zZSwgdG9rZW5GaWVsZE5hbWUsIHRva2VuTG9jYXRpb24sIHRva2VuUGF0aCwgdG9rZW5SZW1vdmFsUXVlcnksIHRva2VuVG9SZW1vdmU7XG4gICAgICBhdXRoVG9rZW4gPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ107XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdG9rZW5Mb2NhdGlvbiA9IHNlbGYuX2NvbmZpZy5hdXRoLnRva2VuO1xuICAgICAgaW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICB0b2tlblBhdGggPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICB0b2tlbkZpZWxkTmFtZSA9IHRva2VuTG9jYXRpb24uc3Vic3RyaW5nKGluZGV4ICsgMSk7XG4gICAgICB0b2tlblRvUmVtb3ZlID0ge307XG4gICAgICB0b2tlblRvUmVtb3ZlW3Rva2VuRmllbGROYW1lXSA9IGhhc2hlZFRva2VuO1xuICAgICAgdG9rZW5SZW1vdmFsUXVlcnkgPSB7fTtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlO1xuICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZSh0aGlzLnVzZXIuX2lkLCB7XG4gICAgICAgICRwdWxsOiB0b2tlblJlbW92YWxRdWVyeVxuICAgICAgfSk7XG4gICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISdcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGV4dHJhRGF0YSA9IChyZWYgPSBzZWxmLl9jb25maWcub25Mb2dnZWRPdXQpICE9IG51bGwgPyByZWYuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICAgIGlmIChleHRyYURhdGEgIT0gbnVsbCkge1xuICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgZXh0cmE6IGV4dHJhRGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgIEFkZCBhIGxvZ291dCBlbmRwb2ludCB0byB0aGUgQVBJXG4gICAgXG4gICAgICBBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgICBhZGRpbmcgaG9vaykuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMuYWRkUm91dGUoJ2xvZ291dCcsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCIpO1xuICAgICAgICBjb25zb2xlLndhcm4oXCIgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1cy9pc3N1ZXMvMTAwXCIpO1xuICAgICAgICByZXR1cm4gbG9nb3V0LmNhbGwodGhpcyk7XG4gICAgICB9LFxuICAgICAgcG9zdDogbG9nb3V0XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFJlc3RpdnVzO1xuXG59KSgpO1xuXG5SZXN0aXZ1cyA9IHRoaXMuUmVzdGl2dXM7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICBAQVBJID0gbmV3IFJlc3RpdnVzXG4gICAgICAgIGFwaVBhdGg6ICdzdGVlZG9zL2FwaS8nLFxuICAgICAgICB1c2VEZWZhdWx0QXV0aDogdHJ1ZVxuICAgICAgICBwcmV0dHlKc29uOiB0cnVlXG4gICAgICAgIGVuYWJsZUNvcnM6IGZhbHNlXG4gICAgICAgIGRlZmF1bHRIZWFkZXJzOlxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIHRoaXMuQVBJID0gbmV3IFJlc3RpdnVzKHtcbiAgICBhcGlQYXRoOiAnc3RlZWRvcy9hcGkvJyxcbiAgICB1c2VEZWZhdWx0QXV0aDogdHJ1ZSxcbiAgICBwcmV0dHlKc29uOiB0cnVlLFxuICAgIGVuYWJsZUNvcnM6IGZhbHNlLFxuICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfVxuICB9KTtcbn1cbiIsIkJ1c2JveSA9IHJlcXVpcmUoJ2J1c2JveScpO1xuRmliZXIgPSByZXF1aXJlKCdmaWJlcnMnKTtcblxuSnNvblJvdXRlcy5wYXJzZUZpbGVzID0gKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIGZpbGVzID0gW107ICMgU3RvcmUgZmlsZXMgaW4gYW4gYXJyYXkgYW5kIHRoZW4gcGFzcyB0aGVtIHRvIHJlcXVlc3QuXG4gICAgaW1hZ2UgPSB7fTsgIyBjcmF0ZSBhbiBpbWFnZSBvYmplY3RcblxuICAgIGlmIChyZXEubWV0aG9kID09IFwiUE9TVFwiKVxuICAgICAgYnVzYm95ID0gbmV3IEJ1c2JveSh7IGhlYWRlcnM6IHJlcS5oZWFkZXJzIH0pO1xuICAgICAgYnVzYm95Lm9uIFwiZmlsZVwiLCAgKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkgLT5cbiAgICAgICAgaW1hZ2UubWltZVR5cGUgPSBtaW1ldHlwZTtcbiAgICAgICAgaW1hZ2UuZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgICAgICAgaW1hZ2UuZmlsZW5hbWUgPSBmaWxlbmFtZTtcblxuICAgICAgICAjIGJ1ZmZlciB0aGUgcmVhZCBjaHVua3NcbiAgICAgICAgYnVmZmVycyA9IFtdO1xuXG4gICAgICAgIGZpbGUub24gJ2RhdGEnLCAoZGF0YSkgLT5cbiAgICAgICAgICBidWZmZXJzLnB1c2goZGF0YSk7XG5cbiAgICAgICAgZmlsZS5vbiAnZW5kJywgKCkgLT5cbiAgICAgICAgICAjIGNvbmNhdCB0aGUgY2h1bmtzXG4gICAgICAgICAgaW1hZ2UuZGF0YSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycyk7XG4gICAgICAgICAgIyBwdXNoIHRoZSBpbWFnZSBvYmplY3QgdG8gdGhlIGZpbGUgYXJyYXlcbiAgICAgICAgICBmaWxlcy5wdXNoKGltYWdlKTtcblxuXG4gICAgICBidXNib3kub24gXCJmaWVsZFwiLCAoZmllbGRuYW1lLCB2YWx1ZSkgLT5cbiAgICAgICAgcmVxLmJvZHlbZmllbGRuYW1lXSA9IHZhbHVlO1xuXG4gICAgICBidXNib3kub24gXCJmaW5pc2hcIiwgICgpIC0+XG4gICAgICAgICMgUGFzcyB0aGUgZmlsZSBhcnJheSB0b2dldGhlciB3aXRoIHRoZSByZXF1ZXN0XG4gICAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuXG4gICAgICAgIEZpYmVyICgpLT5cbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIC5ydW4oKTtcblxuICAgICAgIyBQYXNzIHJlcXVlc3QgdG8gYnVzYm95XG4gICAgICByZXEucGlwZShidXNib3kpO1xuXG4gICAgZWxzZVxuICAgICAgbmV4dCgpO1xuXG5cbiNKc29uUm91dGVzLk1pZGRsZXdhcmUudXNlKEpzb25Sb3V0ZXMucGFyc2VGaWxlcyk7XG5cbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG4gIEpzb25Sb3V0ZXMucGFyc2VGaWxlcyByZXEsIHJlcywgKCktPlxuICAgIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzXG5cbiAgICBpZiByZXEuZmlsZXMgYW5kIHJlcS5maWxlc1swXVxuXG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YSByZXEuZmlsZXNbMF0uZGF0YSwge3R5cGU6IHJlcS5maWxlc1swXS5taW1lVHlwZX0sIChlcnIpIC0+XG4gICAgICAgIGZpbGVuYW1lID0gcmVxLmZpbGVzWzBdLmZpbGVuYW1lXG5cbiAgICAgICAgaWYgW1wiaW1hZ2UuanBnXCIsIFwiaW1hZ2UuZ2lmXCIsIFwiaW1hZ2UuanBlZ1wiLCBcImltYWdlLnBuZ1wiXS5pbmNsdWRlcyhmaWxlbmFtZS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgIGZpbGVuYW1lID0gXCJpbWFnZS1cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzJykgKyBcIi5cIiArIGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKClcblxuICAgICAgICBib2R5ID0gcmVxLmJvZHlcbiAgICAgICAgdHJ5XG4gICAgICAgICAgaWYgYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIklFXCIgb3IgYm9keVsndXBsb2FkX2Zyb20nXSBpcyBcIm5vZGVcIilcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbGVuYW1lKVxuICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgY29uc29sZS5lcnJvcihmaWxlbmFtZSlcbiAgICAgICAgICBjb25zb2xlLmVycm9yIGVcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpXG5cbiAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxuICAgICAgICBcbiAgICAgICAgaWYgYm9keSAmJiBib2R5Wydvd25lciddICYmIGJvZHlbJ293bmVyX25hbWUnXSAmJiBib2R5WydzcGFjZSddICYmIGJvZHlbJ2luc3RhbmNlJ10gICYmIGJvZHlbJ2FwcHJvdmUnXVxuICAgICAgICAgIHBhcmVudCA9ICcnXG4gICAgICAgICAgbWV0YWRhdGEgPSB7b3duZXI6Ym9keVsnb3duZXInXSwgb3duZXJfbmFtZTpib2R5Wydvd25lcl9uYW1lJ10sIHNwYWNlOmJvZHlbJ3NwYWNlJ10sIGluc3RhbmNlOmJvZHlbJ2luc3RhbmNlJ10sIGFwcHJvdmU6IGJvZHlbJ2FwcHJvdmUnXSwgY3VycmVudDogdHJ1ZX1cblxuICAgICAgICAgIGlmIGJvZHlbXCJpc19wcml2YXRlXCJdICYmIGJvZHlbXCJpc19wcml2YXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gXCJ0cnVlXCJcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSB0cnVlXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IGZhbHNlXG5cbiAgICAgICAgICBpZiBib2R5WydtYWluJ10gPT0gXCJ0cnVlXCJcbiAgICAgICAgICAgIG1ldGFkYXRhLm1haW4gPSB0cnVlXG5cbiAgICAgICAgICBpZiBib2R5Wydpc0FkZFZlcnNpb24nXSAmJiBib2R5WydwYXJlbnQnXVxuICAgICAgICAgICAgcGFyZW50ID0gYm9keVsncGFyZW50J11cbiAgICAgICAgICAjIGVsc2VcbiAgICAgICAgICAjICAgY29sbGVjdGlvbi5maW5kKHsnbWV0YWRhdGEuaW5zdGFuY2UnOiBib2R5WydpbnN0YW5jZSddLCAnbWV0YWRhdGEuY3VycmVudCcgOiB0cnVlfSkuZm9yRWFjaCAoYykgLT5cbiAgICAgICAgICAjICAgICBpZiBjLm5hbWUoKSA9PSBmaWxlbmFtZVxuICAgICAgICAgICMgICAgICAgcGFyZW50ID0gYy5tZXRhZGF0YS5wYXJlbnRcblxuICAgICAgICAgIGlmIHBhcmVudFxuICAgICAgICAgICAgciA9IGNvbGxlY3Rpb24udXBkYXRlKHsnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LCAnbWV0YWRhdGEuY3VycmVudCcgOiB0cnVlfSwgeyR1bnNldCA6IHsnbWV0YWRhdGEuY3VycmVudCcgOiAnJ319KVxuICAgICAgICAgICAgaWYgclxuICAgICAgICAgICAgICBtZXRhZGF0YS5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgICAgICAgaWYgYm9keVsnbG9ja2VkX2J5J10gJiYgYm9keVsnbG9ja2VkX2J5X25hbWUnXVxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxvY2tlZF9ieSA9IGJvZHlbJ2xvY2tlZF9ieSddXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubG9ja2VkX2J5X25hbWUgPSBib2R5Wydsb2NrZWRfYnlfbmFtZSddXG5cbiAgICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhXG4gICAgICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydCBuZXdGaWxlXG5cbiAgICAgICAgICAgICAgIyDliKDpmaTlkIzkuIDkuKrnlLPor7fljZXlkIzkuIDkuKrmraXpqqTlkIzkuIDkuKrkurrkuIrkvKDnmoTph43lpI3nmoTmlofku7ZcbiAgICAgICAgICAgICAgaWYgYm9keVtcIm92ZXJ3cml0ZVwiXSAmJiBib2R5W1wib3ZlcndyaXRlXCJdLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLnJlbW92ZSh7J21ldGFkYXRhLmluc3RhbmNlJzogYm9keVsnaW5zdGFuY2UnXSwgJ21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCwgJ21ldGFkYXRhLm93bmVyJzogYm9keVsnb3duZXInXSwgJ21ldGFkYXRhLmFwcHJvdmUnOiBib2R5WydhcHByb3ZlJ10sICdtZXRhZGF0YS5jdXJyZW50JzogeyRuZTogdHJ1ZX19KVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YVxuICAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcbiAgICAgICAgICAgIGZpbGVPYmoudXBkYXRlKHskc2V0OiB7J21ldGFkYXRhLnBhcmVudCcgOiBmaWxlT2JqLl9pZH19KVxuXG4gICAgICAgICMg5YW85a656ICB54mI5pysXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQgbmV3RmlsZVxuXG5cbiAgICAgICAgc2l6ZSA9IGZpbGVPYmoub3JpZ2luYWwuc2l6ZVxuICAgICAgICBpZiAhc2l6ZVxuICAgICAgICAgIHNpemUgPSAxMDI0XG5cbiAgICAgICAgcmVzcCA9XG4gICAgICAgICAgdmVyc2lvbl9pZDogZmlsZU9iai5faWQsXG4gICAgICAgICAgc2l6ZTogc2l6ZVxuXG4gICAgICAgIHJlcy5zZXRIZWFkZXIoXCJ4LWFtei12ZXJzaW9uLWlkXCIsZmlsZU9iai5faWQpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgICAgcmV0dXJuXG4gICAgZWxzZVxuICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICByZXMuZW5kKCk7XG5cblxuSnNvblJvdXRlcy5hZGQgXCJkZWxldGVcIiwgXCIvYXBpL3Y0L2luc3RhbmNlcy9zMy9cIiwgIChyZXEsIHJlcywgbmV4dCkgLT5cblxuICBjb2xsZWN0aW9uID0gY2ZzLmluc3RhbmNlc1xuXG4gIGlkID0gcmVxLnF1ZXJ5LnZlcnNpb25faWQ7XG4gIGlmIGlkXG4gICAgZmlsZSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogaWQgfSlcbiAgICBpZiBmaWxlXG4gICAgICBmaWxlLnJlbW92ZSgpXG4gICAgICByZXNwID0ge1xuICAgICAgICBzdGF0dXM6IFwiT0tcIlxuICAgICAgfVxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XG4gICAgICByZXR1cm5cblxuICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgcmVzLmVuZCgpO1xuXG5cbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsICAocmVxLCByZXMsIG5leHQpIC0+XG5cbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcblxuICByZXMuc3RhdHVzQ29kZSA9IDMwMjtcbiAgcmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvaW5zdGFuY2VzL1wiKSArIGlkICsgXCI/ZG93bmxvYWQ9MVwiXG4gIHJlcy5lbmQoKTtcblxuXG4jIE1ldGVvci5tZXRob2RzXG5cbiMgICBzM191cGdyYWRlOiAobWluLCBtYXgpIC0+XG4jICAgICBjb25zb2xlLmxvZyhcIi9zMy91cGdyYWRlXCIpXG5cbiMgICAgIGZzID0gcmVxdWlyZSgnZnMnKVxuIyAgICAgbWltZSA9IHJlcXVpcmUoJ21pbWUnKVxuXG4jICAgICByb290X3BhdGggPSBcIi9tbnQvZmFrZXMzLzEwXCJcbiMgICAgIGNvbnNvbGUubG9nKHJvb3RfcGF0aClcbiMgICAgIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzXG5cbiMgICAgICMg6YGN5Y6GaW5zdGFuY2Ug5ou85Ye66ZmE5Lu26Lev5b6EIOWIsOacrOWcsOaJvuWvueW6lOaWh+S7tiDliIbkuKTnp43mg4XlhrUgMS4vZmlsZW5hbWVfdmVyc2lvbklkIDIuL2ZpbGVuYW1l77ybXG4jICAgICBkZWFsX3dpdGhfdmVyc2lvbiA9IChyb290X3BhdGgsIHNwYWNlLCBpbnNfaWQsIHZlcnNpb24sIGF0dGFjaF9maWxlbmFtZSkgLT5cbiMgICAgICAgX3JldiA9IHZlcnNpb24uX3JldlxuIyAgICAgICBpZiAoY29sbGVjdGlvbi5maW5kKHtcIl9pZFwiOiBfcmV2fSkuY291bnQoKSA+MClcbiMgICAgICAgICByZXR1cm5cbiMgICAgICAgY3JlYXRlZF9ieSA9IHZlcnNpb24uY3JlYXRlZF9ieVxuIyAgICAgICBhcHByb3ZlID0gdmVyc2lvbi5hcHByb3ZlXG4jICAgICAgIGZpbGVuYW1lID0gdmVyc2lvbi5maWxlbmFtZSB8fCBhdHRhY2hfZmlsZW5hbWU7XG4jICAgICAgIG1pbWVfdHlwZSA9IG1pbWUubG9va3VwKGZpbGVuYW1lKVxuIyAgICAgICBuZXdfcGF0aCA9IHJvb3RfcGF0aCArIFwiL3NwYWNlcy9cIiArIHNwYWNlICsgXCIvd29ya2Zsb3cvXCIgKyBpbnNfaWQgKyBcIi9cIiArIGZpbGVuYW1lICsgXCJfXCIgKyBfcmV2XG4jICAgICAgIG9sZF9wYXRoID0gcm9vdF9wYXRoICsgXCIvc3BhY2VzL1wiICsgc3BhY2UgKyBcIi93b3JrZmxvdy9cIiArIGluc19pZCArIFwiL1wiICsgZmlsZW5hbWVcblxuIyAgICAgICByZWFkRmlsZSA9IChmdWxsX3BhdGgpIC0+XG4jICAgICAgICAgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyBmdWxsX3BhdGhcblxuIyAgICAgICAgIGlmIGRhdGFcbiMgICAgICAgICAgIG5ld0ZpbGUgPSBuZXcgRlMuRmlsZSgpO1xuIyAgICAgICAgICAgbmV3RmlsZS5faWQgPSBfcmV2O1xuIyAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IHtvd25lcjpjcmVhdGVkX2J5LCBzcGFjZTpzcGFjZSwgaW5zdGFuY2U6aW5zX2lkLCBhcHByb3ZlOiBhcHByb3ZlfTtcbiMgICAgICAgICAgIG5ld0ZpbGUuYXR0YWNoRGF0YSBkYXRhLCB7dHlwZTogbWltZV90eXBlfVxuIyAgICAgICAgICAgbmV3RmlsZS5uYW1lKGZpbGVuYW1lKVxuIyAgICAgICAgICAgZmlsZU9iaiA9IGNvbGxlY3Rpb24uaW5zZXJ0IG5ld0ZpbGVcbiMgICAgICAgICAgIGNvbnNvbGUubG9nKGZpbGVPYmouX2lkKVxuXG4jICAgICAgIHRyeVxuIyAgICAgICAgIG4gPSBmcy5zdGF0U3luYyBuZXdfcGF0aFxuIyAgICAgICAgIGlmIG4gJiYgbi5pc0ZpbGUoKVxuIyAgICAgICAgICAgcmVhZEZpbGUgbmV3X3BhdGhcbiMgICAgICAgY2F0Y2ggZXJyb3JcbiMgICAgICAgICB0cnlcbiMgICAgICAgICAgIG9sZCA9IGZzLnN0YXRTeW5jIG9sZF9wYXRoXG4jICAgICAgICAgICBpZiBvbGQgJiYgb2xkLmlzRmlsZSgpXG4jICAgICAgICAgICAgIHJlYWRGaWxlIG9sZF9wYXRoXG4jICAgICAgICAgY2F0Y2ggZXJyb3JcbiMgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaWxlIG5vdCBmb3VuZDogXCIgKyBvbGRfcGF0aClcblxuXG4jICAgICBjb3VudCA9IGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9fSkuY291bnQoKTtcbiMgICAgIGNvbnNvbGUubG9nKFwiYWxsIGluc3RhbmNlczogXCIgKyBjb3VudClcblxuIyAgICAgYiA9IG5ldyBEYXRlKClcblxuIyAgICAgaSA9IG1pblxuIyAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1wiYXR0YWNobWVudHMuY3VycmVudFwiOiB7JGV4aXN0czogdHJ1ZX19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIHNraXA6IG1pbiwgbGltaXQ6IG1heC1taW59KS5mb3JFYWNoIChpbnMpIC0+XG4jICAgICAgIGkgPSBpICsgMVxuIyAgICAgICBjb25zb2xlLmxvZyhpICsgXCI6XCIgKyBpbnMubmFtZSlcbiMgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50c1xuIyAgICAgICBzcGFjZSA9IGlucy5zcGFjZVxuIyAgICAgICBpbnNfaWQgPSBpbnMuX2lkXG4jICAgICAgIGF0dGFjaHMuZm9yRWFjaCAoYXR0KSAtPlxuIyAgICAgICAgIGRlYWxfd2l0aF92ZXJzaW9uIHJvb3RfcGF0aCwgc3BhY2UsIGluc19pZCwgYXR0LmN1cnJlbnQsIGF0dC5maWxlbmFtZVxuIyAgICAgICAgIGlmIGF0dC5oaXN0b3J5c1xuIyAgICAgICAgICAgYXR0Lmhpc3RvcnlzLmZvckVhY2ggKGhpcykgLT5cbiMgICAgICAgICAgICAgZGVhbF93aXRoX3ZlcnNpb24gcm9vdF9wYXRoLCBzcGFjZSwgaW5zX2lkLCBoaXMsIGF0dC5maWxlbmFtZVxuXG4jICAgICBjb25zb2xlLmxvZyhuZXcgRGF0ZSgpIC0gYilcblxuIyAgICAgcmV0dXJuIFwib2tcIlxuIiwidmFyIEJ1c2JveSwgRmliZXI7XG5cbkJ1c2JveSA9IHJlcXVpcmUoJ2J1c2JveScpO1xuXG5GaWJlciA9IHJlcXVpcmUoJ2ZpYmVycycpO1xuXG5Kc29uUm91dGVzLnBhcnNlRmlsZXMgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYnVzYm95LCBmaWxlcywgaW1hZ2U7XG4gIGZpbGVzID0gW107XG4gIGltYWdlID0ge307XG4gIGlmIChyZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgIGJ1c2JveSA9IG5ldyBCdXNib3koe1xuICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnNcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWxlXCIsIGZ1bmN0aW9uKGZpZWxkbmFtZSwgZmlsZSwgZmlsZW5hbWUsIGVuY29kaW5nLCBtaW1ldHlwZSkge1xuICAgICAgdmFyIGJ1ZmZlcnM7XG4gICAgICBpbWFnZS5taW1lVHlwZSA9IG1pbWV0eXBlO1xuICAgICAgaW1hZ2UuZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgICAgIGltYWdlLmZpbGVuYW1lID0gZmlsZW5hbWU7XG4gICAgICBidWZmZXJzID0gW107XG4gICAgICBmaWxlLm9uKCdkYXRhJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICByZXR1cm4gYnVmZmVycy5wdXNoKGRhdGEpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmlsZS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGltYWdlLmRhdGEgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xuICAgICAgICByZXR1cm4gZmlsZXMucHVzaChpbWFnZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBidXNib3kub24oXCJmaWVsZFwiLCBmdW5jdGlvbihmaWVsZG5hbWUsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVxLmJvZHlbZmllbGRuYW1lXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIGJ1c2JveS5vbihcImZpbmlzaFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJlcS5maWxlcyA9IGZpbGVzO1xuICAgICAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgfSkucnVuKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcS5waXBlKGJ1c2JveSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfVxufTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBKc29uUm91dGVzLnBhcnNlRmlsZXMocmVxLCByZXMsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb2xsZWN0aW9uLCBuZXdGaWxlO1xuICAgIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzO1xuICAgIGlmIChyZXEuZmlsZXMgJiYgcmVxLmZpbGVzWzBdKSB7XG4gICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgIHJldHVybiBuZXdGaWxlLmF0dGFjaERhdGEocmVxLmZpbGVzWzBdLmRhdGEsIHtcbiAgICAgICAgdHlwZTogcmVxLmZpbGVzWzBdLm1pbWVUeXBlXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIGJvZHksIGUsIGZpbGVPYmosIGZpbGVuYW1lLCBtZXRhZGF0YSwgcGFyZW50LCByLCByZXNwLCBzaXplO1xuICAgICAgICBmaWxlbmFtZSA9IHJlcS5maWxlc1swXS5maWxlbmFtZTtcbiAgICAgICAgaWYgKFtcImltYWdlLmpwZ1wiLCBcImltYWdlLmdpZlwiLCBcImltYWdlLmpwZWdcIiwgXCJpbWFnZS5wbmdcIl0uaW5jbHVkZXMoZmlsZW5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICBmaWxlbmFtZSA9IFwiaW1hZ2UtXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KCdZWVlZTU1EREhIbW1zcycpICsgXCIuXCIgKyBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgPSByZXEuYm9keTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoYm9keSAmJiAoYm9keVsndXBsb2FkX2Zyb20nXSA9PT0gXCJJRVwiIHx8IGJvZHlbJ3VwbG9hZF9mcm9tJ10gPT09IFwibm9kZVwiKSkge1xuICAgICAgICAgICAgZmlsZW5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQoZmlsZW5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihmaWxlbmFtZSk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUvZywgXCItXCIpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0ZpbGUubmFtZShmaWxlbmFtZSk7XG4gICAgICAgIGlmIChib2R5ICYmIGJvZHlbJ293bmVyJ10gJiYgYm9keVsnb3duZXJfbmFtZSddICYmIGJvZHlbJ3NwYWNlJ10gJiYgYm9keVsnaW5zdGFuY2UnXSAmJiBib2R5WydhcHByb3ZlJ10pIHtcbiAgICAgICAgICBwYXJlbnQgPSAnJztcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIG93bmVyOiBib2R5Wydvd25lciddLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogYm9keVsnb3duZXJfbmFtZSddLFxuICAgICAgICAgICAgc3BhY2U6IGJvZHlbJ3NwYWNlJ10sXG4gICAgICAgICAgICBpbnN0YW5jZTogYm9keVsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgIGFwcHJvdmU6IGJvZHlbJ2FwcHJvdmUnXSxcbiAgICAgICAgICAgIGN1cnJlbnQ6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChib2R5W1wiaXNfcHJpdmF0ZVwiXSAmJiBib2R5W1wiaXNfcHJpdmF0ZVwiXS50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgbWV0YWRhdGEuaXNfcHJpdmF0ZSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLmlzX3ByaXZhdGUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJvZHlbJ21haW4nXSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1haW4gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYm9keVsnaXNBZGRWZXJzaW9uJ10gJiYgYm9keVsncGFyZW50J10pIHtcbiAgICAgICAgICAgIHBhcmVudCA9IGJvZHlbJ3BhcmVudCddO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICByID0gY29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogcGFyZW50LFxuICAgICAgICAgICAgICAnbWV0YWRhdGEuY3VycmVudCc6IHRydWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJHVuc2V0OiB7XG4gICAgICAgICAgICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiAnJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgICAgaWYgKGJvZHlbJ2xvY2tlZF9ieSddICYmIGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ10pIHtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnkgPSBib2R5Wydsb2NrZWRfYnknXTtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5sb2NrZWRfYnlfbmFtZSA9IGJvZHlbJ2xvY2tlZF9ieV9uYW1lJ107XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbmV3RmlsZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgICAgICAgIGlmIChib2R5W1wib3ZlcndyaXRlXCJdICYmIGJvZHlbXCJvdmVyd3JpdGVcIl0udG9Mb2NhbGVMb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLnJlbW92ZSh7XG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEuaW5zdGFuY2UnOiBib2R5WydpbnN0YW5jZSddLFxuICAgICAgICAgICAgICAgICAgJ21ldGFkYXRhLnBhcmVudCc6IHBhcmVudCxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5vd25lcic6IGJvZHlbJ293bmVyJ10sXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEuYXBwcm92ZSc6IGJvZHlbJ2FwcHJvdmUnXSxcbiAgICAgICAgICAgICAgICAgICdtZXRhZGF0YS5jdXJyZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAkbmU6IHRydWVcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgICBmaWxlT2JqID0gY29sbGVjdGlvbi5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgICAgICBmaWxlT2JqLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAnbWV0YWRhdGEucGFyZW50JzogZmlsZU9iai5faWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbGVPYmogPSBjb2xsZWN0aW9uLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBzaXplID0gZmlsZU9iai5vcmlnaW5hbC5zaXplO1xuICAgICAgICBpZiAoIXNpemUpIHtcbiAgICAgICAgICBzaXplID0gMTAyNDtcbiAgICAgICAgfVxuICAgICAgICByZXNwID0ge1xuICAgICAgICAgIHZlcnNpb25faWQ6IGZpbGVPYmouX2lkLFxuICAgICAgICAgIHNpemU6IHNpemVcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLnNldEhlYWRlcihcIngtYW16LXZlcnNpb24taWRcIiwgZmlsZU9iai5faWQpO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3ApKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgIHJldHVybiByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcImRlbGV0ZVwiLCBcIi9hcGkvdjQvaW5zdGFuY2VzL3MzL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgY29sbGVjdGlvbiwgZmlsZSwgaWQsIHJlc3A7XG4gIGNvbGxlY3Rpb24gPSBjZnMuaW5zdGFuY2VzO1xuICBpZCA9IHJlcS5xdWVyeS52ZXJzaW9uX2lkO1xuICBpZiAoaWQpIHtcbiAgICBmaWxlID0gY29sbGVjdGlvbi5maW5kT25lKHtcbiAgICAgIF9pZDogaWRcbiAgICB9KTtcbiAgICBpZiAoZmlsZSkge1xuICAgICAgZmlsZS5yZW1vdmUoKTtcbiAgICAgIHJlc3AgPSB7XG4gICAgICAgIHN0YXR1czogXCJPS1wiXG4gICAgICB9O1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXNwKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHJlcy5zdGF0dXNDb2RlID0gNDA0O1xuICByZXR1cm4gcmVzLmVuZCgpO1xufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS92NC9pbnN0YW5jZXMvczMvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBpZDtcbiAgaWQgPSByZXEucXVlcnkudmVyc2lvbl9pZDtcbiAgcmVzLnN0YXR1c0NvZGUgPSAzMDI7XG4gIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2luc3RhbmNlcy9cIikgKyBpZCArIFwiP2Rvd25sb2FkPTFcIik7XG4gIHJldHVybiByZXMuZW5kKCk7XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvcHVzaC9tZXNzYWdlXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cbiAgICBpZiByZXEuYm9keT8ucHVzaFRvcGljIGFuZCByZXEuYm9keS51c2VySWRzIGFuZCByZXEuYm9keS5kYXRhXG4gICAgICAgIG1lc3NhZ2UgPSBcbiAgICAgICAgICAgIGZyb206IFwic3RlZWRvc1wiXG4gICAgICAgICAgICBxdWVyeTpcbiAgICAgICAgICAgICAgICBhcHBOYW1lOiByZXEuYm9keS5wdXNoVG9waWNcbiAgICAgICAgICAgICAgICB1c2VySWQ6IFxuICAgICAgICAgICAgICAgICAgICBcIiRpblwiOiB1c2VySWRzXG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZT9cbiAgICAgICAgICAgIG1lc3NhZ2VbXCJ0aXRsZVwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnRUaXRsZVxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLmFsZXJ0P1xuICAgICAgICAgICAgbWVzc2FnZVtcInRleHRcIl0gPSByZXEuYm9keS5kYXRhLmFsZXJ0XG4gICAgICAgIGlmIHJlcS5ib2R5LmRhdGEuYmFkZ2U/XG4gICAgICAgICAgICBtZXNzYWdlW1wiYmFkZ2VcIl0gPSByZXEuYm9keS5kYXRhLmJhZGdlICsgXCJcIlxuICAgICAgICBpZiByZXEuYm9keS5kYXRhLnNvdW5kP1xuICAgICAgICAgICAgbWVzc2FnZVtcInNvdW5kXCJdID0gcmVxLmJvZHkuZGF0YS5zb3VuZFxuICAgICAgICAjaWYgcmVxLmJvZHkuZGF0YS5kYXRhP1xuICAgICAgICAjICAgIG1lc3NhZ2VbXCJkYXRhXCJdID0gcmVxLmJvZHkuZGF0YS5kYXRhXG4gICAgICAgIFB1c2guc2VuZCBtZXNzYWdlXG5cbiAgICAgICAgcmVzLmVuZChcInN1Y2Nlc3NcIik7XG5cblxuXG5NZXRlb3IubWV0aG9kc1xuICAgIHB1c2hTZW5kOiAodGV4dCx0aXRsZSxiYWRnZSx1c2VySWQpIC0+XG4gICAgICAgIGlmICghdXNlcklkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBQdXNoLnNlbmRcbiAgICAgICAgICAgIGZyb206ICdzdGVlZG9zJyxcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgICBiYWRnZTogYmFkZ2UsXG4gICAgICAgICAgICBxdWVyeTogXG4gICAgICAgICAgICAgICAgdXNlcklkOiB1c2VySWRcbiAgICAgICAgICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiIsIkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvcHVzaC9tZXNzYWdlXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBtZXNzYWdlLCByZWY7XG4gIGlmICgoKHJlZiA9IHJlcS5ib2R5KSAhPSBudWxsID8gcmVmLnB1c2hUb3BpYyA6IHZvaWQgMCkgJiYgcmVxLmJvZHkudXNlcklkcyAmJiByZXEuYm9keS5kYXRhKSB7XG4gICAgbWVzc2FnZSA9IHtcbiAgICAgIGZyb206IFwic3RlZWRvc1wiLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgYXBwTmFtZTogcmVxLmJvZHkucHVzaFRvcGljLFxuICAgICAgICB1c2VySWQ6IHtcbiAgICAgICAgICBcIiRpblwiOiB1c2VySWRzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChyZXEuYm9keS5kYXRhLmFsZXJ0VGl0bGUgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVtcInRpdGxlXCJdID0gcmVxLmJvZHkuZGF0YS5hbGVydFRpdGxlO1xuICAgIH1cbiAgICBpZiAocmVxLmJvZHkuZGF0YS5hbGVydCAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1widGV4dFwiXSA9IHJlcS5ib2R5LmRhdGEuYWxlcnQ7XG4gICAgfVxuICAgIGlmIChyZXEuYm9keS5kYXRhLmJhZGdlICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbXCJiYWRnZVwiXSA9IHJlcS5ib2R5LmRhdGEuYmFkZ2UgKyBcIlwiO1xuICAgIH1cbiAgICBpZiAocmVxLmJvZHkuZGF0YS5zb3VuZCAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlW1wic291bmRcIl0gPSByZXEuYm9keS5kYXRhLnNvdW5kO1xuICAgIH1cbiAgICBQdXNoLnNlbmQobWVzc2FnZSk7XG4gICAgcmV0dXJuIHJlcy5lbmQoXCJzdWNjZXNzXCIpO1xuICB9XG59KTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICBwdXNoU2VuZDogZnVuY3Rpb24odGV4dCwgdGl0bGUsIGJhZGdlLCB1c2VySWQpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gUHVzaC5zZW5kKHtcbiAgICAgIGZyb206ICdzdGVlZG9zJyxcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIHRleHQ6IHRleHQsXG4gICAgICBiYWRnZTogYmFkZ2UsXG4gICAgICBxdWVyeToge1xuICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
