(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var DDPCommon = Package['ddp-common'].DDPCommon;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var Accounts = Package['accounts-base'].Accounts;

/* Package-scope variables */
var __coffeescriptShare, ironRouterSendErrorToResponse, msg;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:odata":{"checkNpm.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_odata/checkNpm.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);

// fix warning: xxx not installed
require("basic-auth/package.json");

checkNpmVersions({
  'basic-auth': '^2.0.1',
  'odata-v4-service-metadata': "^0.1.6",
  "odata-v4-service-document": "^0.0.3"
}, 'steedos:odata');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"restivus":{"auth.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_odata/lib/restivus/auth.coffee                                                                     //
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
// packages/steedos_odata/lib/restivus/iron-router-error-to-response.js                                                //
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
// packages/steedos_odata/lib/restivus/route.coffee                                                                    //
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

},"restivus.coffee":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_odata/lib/restivus/restivus.coffee                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Cookies,
    OdataRestivus,
    basicAuth,
    indexOf = [].indexOf || function (item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item) return i;
  }

  return -1;
};

basicAuth = require('basic-auth');
Cookies = require("cookies");

this.OdataRestivus = function () {
  function OdataRestivus(options) {
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
          var _user, authToken, cookies, spaceId, token, userId;

          cookies = new Cookies(this.request, this.response);
          userId = this.request.headers['x-user-id'] || cookies.get("X-User-Id");
          authToken = this.request.headers['x-auth-token'] || cookies.get("X-Auth-Token");
          spaceId = this.request.headers['x-space-id'] || this.urlParams['spaceId'];

          if (authToken) {
            token = Accounts._hashLoginToken(authToken);
          }

          if (this.request.userId) {
            _user = db.users.findOne({
              _id: this.request.userId
            });
            return {
              user: _user,
              userId: userId,
              spaceId: spaceId,
              token: token
            };
          } else {
            return {
              userId: userId,
              spaceId: spaceId,
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
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, OData-Version'
      };

      if (this._config.useDefaultAuth) {
        corsHeaders['Access-Control-Allow-Headers'] += ', X-User-Id, X-Auth-Token, X-Space-Id';
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

  OdataRestivus.prototype.addRoute = function (path, options, endpoints) {
    var route;
    route = new share.Route(this, path, options, endpoints);

    this._routes.push(route);

    route.addToApi();
    return this;
  }; /**
     		Generate routes for the Meteor Collection with the given name
      */

  OdataRestivus.prototype.addCollection = function (collection, options) {
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

  OdataRestivus.prototype._collectionEndpoints = {
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
  OdataRestivus.prototype._userCollectionEndpoints = {
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

  OdataRestivus.prototype._initAuth = function () {
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

  return OdataRestivus;
}();

OdataRestivus = this.OdataRestivus;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"objects.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_odata/server/objects.coffee                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  var getObject, getObjects;

  getObjects = function (spaceId, userId, object_names) {
    var data;
    data = {};
    object_names.split(',').forEach(function (object_name) {
      var object;
      object = getObject(spaceId, userId, object_name);
      return data[object.name] = object;
    });
    return data;
  };

  getObject = function (spaceId, userId, object_name) {
    var data, fields, object_permissions, psets, psetsAdmin, psetsCurrent, psetsUser;
    data = _.clone(Creator.Objects[Creator.getObjectName(Creator.getObject(object_name, spaceId))]);

    if (!data) {
      throw new Meteor.Error(500, "无效的id " + object_name);
    }

    psetsAdmin = Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'admin'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    });
    psetsUser = Creator.getCollection("permission_set").findOne({
      space: spaceId,
      name: 'user'
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    });
    psetsCurrent = Creator.getCollection("permission_set").find({
      users: userId,
      space: spaceId
    }, {
      fields: {
        _id: 1,
        assigned_apps: 1
      }
    }).fetch();
    psets = {
      psetsAdmin: psetsAdmin,
      psetsUser: psetsUser,
      psetsCurrent: psetsCurrent
    };
    object_permissions = Creator.getObjectPermissions.bind(psets)(spaceId, userId, object_name);
    delete data.list_views;
    delete data.permission_set;

    if (object_permissions.allowRead) {
      data.allowRead = true;
      data.allowEdit = object_permissions.allowEdit;
      data.allowDelete = object_permissions.allowDelete;
      data.allowCreate = object_permissions.allowCreate;
      data.modifyAllRecords = object_permissions.modifyAllRecords;
      fields = {};

      _.forEach(data.fields, function (field, key) {
        var _field;

        _field = _.clone(field);

        if (!_field.name) {
          _field.name = key;
        }

        if (_.indexOf(object_permissions.uneditable_fields, _field.name) > -1) {
          _field.readonly = true;
        }

        if (_.indexOf(object_permissions.unreadable_fields, _field.name) < 0) {
          return fields[key] = _field;
        }
      });

      data.fields = fields;
    } else {
      data.allowRead = false;
    }

    return data;
  };

  return JsonRoutes.add('get', SteedosOData.API_PATH + '/objects/:id', function (req, res, next) {
    var _obj, data, e, object_name, ref, ref1, spaceId, userId;

    try {
      userId = Steedos.getUserIdFromAuthToken(req, res);

      if (!userId) {
        throw new Meteor.Error(500, "No permission");
      }

      spaceId = (ref = req.params) != null ? ref.spaceId : void 0;

      if (!spaceId) {
        throw new Meteor.Error(500, "Miss spaceId");
      }

      object_name = (ref1 = req.params) != null ? ref1.id : void 0;

      if (!object_name) {
        throw new Meteor.Error(500, "Miss id");
      }

      _obj = Creator.getCollection("objects").findOne({
        _id: object_name
      });

      if (_obj && _obj.name) {
        object_name = _obj.name;
      }

      if (object_name.split(',').length > 1) {
        data = getObjects(spaceId, userId, object_name);
      } else {
        data = getObject(spaceId, userId, object_name);
      }

      return JsonRoutes.sendResult(res, {
        code: 200,
        data: data || {}
      });
    } catch (error) {
      e = error;
      console.error(e.stack);
      return JsonRoutes.sendResult(res, {
        code: e.error || 500,
        data: {
          errors: e.reason || e.message
        }
      });
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"odata.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_odata/server/odata.coffee                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"middleware.coffee":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_odata/server/middleware.coffee                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Fiber, authorizationCache, basicAuth;
Fiber = require('fibers');
basicAuth = require('basic-auth');
authorizationCache = {};
JsonRoutes.Middleware.use('/api/odata/v4/', function (req, res, next) {
  return Fiber(function () {
    var app_id, app_login_token, auth, authToken, client_id, hashedToken, isAuthed, loginTokens, ref, ref1, ref2, result, token, user, userId;

    if (!req.userId) {
      isAuthed = false;

      if (req != null ? (ref = req.query) != null ? ref.access_token : void 0 : void 0) {
        console.log('OAuth2: ', req.query.access_token);
        userId = Steedos.getUserIdFromAccessToken(req.query.access_token);

        if (userId) {
          user = Meteor.users.findOne({
            _id: userId
          });

          if (user) {
            isAuthed = true;
          }
        }
      }

      if (req.headers['authorization']) {
        auth = basicAuth.parse(req.headers['authorization']);

        if (auth) {
          user = Meteor.users.findOne({
            username: auth.name
          }, {
            fields: {
              'services': 1
            }
          });

          if (user) {
            if (authorizationCache[auth.name] === auth.pass) {
              isAuthed = true;
            } else {
              result = Accounts._checkPassword(user, auth.pass);

              if (!result.error) {
                isAuthed = true;

                if (_.keys(authorizationCache).length > 100) {
                  authorizationCache = {};
                }

                authorizationCache[auth.name] = auth.pass;
              }
            }
          }
        }
      }

      if (isAuthed) {
        req.headers['x-user-id'] = user._id;
        token = null;
        app_id = "creator";
        client_id = "pc";
        loginTokens = (ref1 = user.services) != null ? (ref2 = ref1.resume) != null ? ref2.loginTokens : void 0 : void 0;

        if (loginTokens) {
          app_login_token = _.find(loginTokens, function (t) {
            return t.app_id === app_id && t.client_id === client_id;
          });

          if (app_login_token) {
            token = app_login_token.token;
          }
        }

        if (!token) {
          authToken = Accounts._generateStampedLoginToken();
          token = authToken.token;
          hashedToken = Accounts._hashStampedToken(authToken);
          hashedToken.app_id = app_id;
          hashedToken.client_id = client_id;
          hashedToken.token = token;

          Accounts._insertHashedLoginToken(user._id, hashedToken);
        }

        if (token) {
          req.headers['x-auth-token'] = token;
        }
      }
    }

    return next();
  }).run();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"metadata.coffee":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_odata/server/metadata.coffee                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  var ServiceDocument, ServiceMetadata, _BOOLEAN_TYPES, _DATETIME_OFFSET_TYPES, _NAMESPACE, _NUMBER_TYPES, getObjectsOdataSchema;

  ServiceMetadata = require('odata-v4-service-metadata').ServiceMetadata;
  ServiceDocument = require('odata-v4-service-document').ServiceDocument;
  _NUMBER_TYPES = ["number", "currency"];
  _BOOLEAN_TYPES = ["boolean"];
  _DATETIME_OFFSET_TYPES = ['datetime'];
  _NAMESPACE = "CreatorEntities";

  getObjectsOdataSchema = function (spaceId) {
    var container_schema, entities_schema, schema;
    schema = {
      version: SteedosOData.VERSION,
      dataServices: {
        schema: []
      }
    };
    entities_schema = {};
    entities_schema.namespace = _NAMESPACE;
    entities_schema.entityType = [];
    entities_schema.annotations = [];

    _.each(Creator.Collections, function (value, key, list) {
      var _object, entitie, keys, navigationProperty, property;

      _object = Creator.getObject(key, spaceId);

      if (!(_object != null ? _object.enable_api : void 0)) {
        return;
      }

      keys = [{
        propertyRef: {
          name: "_id",
          computedKey: true
        }
      }];
      entitie = {
        name: _object.name,
        key: keys
      };
      keys.forEach(function (_key) {
        return entities_schema.annotations.push({
          target: _NAMESPACE + "." + _object.name + "/" + _key.propertyRef.name,
          annotation: [{
            "term": "Org.OData.Core.V1.Computed",
            "bool": "true"
          }]
        });
      });
      property = [];
      property.push({
        name: "_id",
        type: "Edm.String",
        nullable: false
      });
      navigationProperty = [];

      _.forEach(_object.fields, function (field, field_name) {
        var _property, reference_to;

        _property = {
          name: field_name,
          type: "Edm.String"
        };

        if (_.contains(_NUMBER_TYPES, field.type)) {
          _property.type = "Edm.Double";
        } else if (_.contains(_BOOLEAN_TYPES, field.type)) {
          _property.type = "Edm.Boolean";
        } else if (_.contains(_DATETIME_OFFSET_TYPES, field.type)) {
          _property.type = "Edm.DateTimeOffset";
          _property.precision = "8";
        }

        if (field.required) {
          _property.nullable = false;
        }

        property.push(_property);
        reference_to = field.reference_to;

        if (reference_to) {
          if (!_.isArray(reference_to)) {
            reference_to = [reference_to];
          }

          return reference_to.forEach(function (r) {
            var _name, reference_obj;

            reference_obj = Creator.getObject(r, spaceId);

            if (reference_obj) {
              _name = field_name + SteedosOData.EXPAND_FIELD_SUFFIX;

              if (_.isArray(field.reference_to)) {
                _name = field_name + SteedosOData.EXPAND_FIELD_SUFFIX + "." + reference_obj.name;
              }

              return navigationProperty.push({
                name: _name,
                type: _NAMESPACE + "." + reference_obj.name,
                partner: _object.name,
                _re_name: reference_obj.name,
                referentialConstraint: [{
                  property: field_name,
                  referencedProperty: "_id"
                }]
              });
            } else {
              return console.warn("reference to '" + r + "' invalid.");
            }
          });
        }
      });

      entitie.property = property;
      entitie.navigationProperty = navigationProperty;
      return entities_schema.entityType.push(entitie);
    });

    schema.dataServices.schema.push(entities_schema);
    container_schema = {};
    container_schema.entityContainer = {
      name: "container"
    };
    container_schema.entityContainer.entitySet = [];

    _.forEach(entities_schema.entityType, function (_et, k) {
      return container_schema.entityContainer.entitySet.push({
        "name": _et.name,
        "entityType": _NAMESPACE + "." + _et.name,
        "navigationPropertyBinding": []
      });
    });

    schema.dataServices.schema.push(container_schema);
    return schema;
  };

  SteedosOdataAPI.addRoute('', {
    authRequired: SteedosOData.AUTHREQUIRED
  }, {
    get: function () {
      var body, context, ref, ref1, serviceDocument;
      context = SteedosOData.getMetaDataPath((ref = this.urlParams) != null ? ref.spaceId : void 0);
      serviceDocument = ServiceDocument.processMetadataJson(getObjectsOdataSchema((ref1 = this.urlParams) != null ? ref1.spaceId : void 0), {
        context: context
      });
      body = serviceDocument.document();
      return {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'OData-Version': SteedosOData.VERSION
        },
        body: serviceDocument.document()
      };
    }
  });
  return SteedosOdataAPI.addRoute(SteedosOData.METADATA_PATH, {
    authRequired: SteedosOData.AUTHREQUIRED
  }, {
    get: function () {
      var body, ref, serviceMetadata;
      serviceMetadata = ServiceMetadata.processMetadataJson(getObjectsOdataSchema((ref = this.urlParams) != null ? ref.spaceId : void 0));
      body = serviceMetadata.document();
      return {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'OData-Version': SteedosOData.VERSION
        },
        body: body
      };
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"core.coffee":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_odata/core.coffee                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.SteedosOData = {};
SteedosOData.VERSION = '4.0';
SteedosOData.AUTHREQUIRED = true;
SteedosOData.API_PATH = '/api/odata/v4/:spaceId';
SteedosOData.METADATA_PATH = '$metadata';
SteedosOData.EXPAND_FIELD_SUFFIX = "_expand";

SteedosOData.getRootPath = function (spaceId) {
  return Meteor.absoluteUrl('api/odata/v4/' + spaceId);
};

SteedosOData.getODataPath = function (spaceId, object_name) {
  return SteedosOData.getRootPath(spaceId) + ("/" + object_name);
};

if (Meteor.isServer) {
  SteedosOData.getMetaDataPath = function (spaceId) {
    return SteedosOData.getRootPath(spaceId) + ("/" + SteedosOData.METADATA_PATH);
  };

  SteedosOData.getODataContextPath = function (spaceId, object_name) {
    return SteedosOData.getMetaDataPath(spaceId) + ("#" + object_name);
  };

  SteedosOData.getODataNextLinkPath = function (spaceId, object_name) {
    return SteedosOData.getRootPath(spaceId) + ("/" + object_name);
  };

  this.SteedosOdataAPI = new OdataRestivus({
    apiPath: SteedosOData.API_PATH,
    useDefaultAuth: true,
    prettyJson: true,
    enableCors: true,
    defaultHeaders: {
      'Content-Type': 'application/json'
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:odata/checkNpm.js");
require("/node_modules/meteor/steedos:odata/lib/restivus/auth.coffee");
require("/node_modules/meteor/steedos:odata/lib/restivus/iron-router-error-to-response.js");
require("/node_modules/meteor/steedos:odata/lib/restivus/route.coffee");
require("/node_modules/meteor/steedos:odata/lib/restivus/restivus.coffee");
require("/node_modules/meteor/steedos:odata/server/objects.coffee");
require("/node_modules/meteor/steedos:odata/server/odata.coffee");
require("/node_modules/meteor/steedos:odata/server/middleware.coffee");
require("/node_modules/meteor/steedos:odata/server/metadata.coffee");
require("/node_modules/meteor/steedos:odata/core.coffee");

/* Exports */
Package._define("steedos:odata");

})();

//# sourceURL=meteor://💻app/packages/steedos_odata.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvYXV0aC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9yZXN0aXZ1cy9hdXRoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpvZGF0YS9saWIvcmVzdGl2dXMvaXJvbi1yb3V0ZXItZXJyb3ItdG8tcmVzcG9uc2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL3Jlc3RpdnVzL3JvdXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vZGF0YS9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvcmVzdGl2dXMvcmVzdGl2dXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9vYmplY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL29iamVjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9taWRkbGV3YXJlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21pZGRsZXdhcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29kYXRhL3NlcnZlci9tZXRhZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRhZGF0YS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2RhdGEvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvcmUuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsInJlcXVpcmUiLCJnZXRVc2VyUXVlcnlTZWxlY3RvciIsInVzZXJWYWxpZGF0b3IiLCJBdXRoIiwiTWF0Y2giLCJXaGVyZSIsInVzZXIiLCJjaGVjayIsImlkIiwiT3B0aW9uYWwiLCJTdHJpbmciLCJ1c2VybmFtZSIsImVtYWlsIiwiXyIsImtleXMiLCJsZW5ndGgiLCJFcnJvciIsImxvZ2luV2l0aFBhc3N3b3JkIiwicGFzc3dvcmQiLCJhdXRoVG9rZW4iLCJhdXRoZW50aWNhdGluZ1VzZXIiLCJhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciIsImhhc2hlZFRva2VuIiwicGFzc3dvcmRWZXJpZmljYXRpb24iLCJyZWYiLCJzcGFjZV91c2VycyIsInNwYWNlcyIsIk1ldGVvciIsInVzZXJzIiwiZmluZE9uZSIsInNlcnZpY2VzIiwiQWNjb3VudHMiLCJfY2hlY2tQYXNzd29yZCIsImVycm9yIiwiX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4iLCJfaGFzaFN0YW1wZWRUb2tlbiIsIl9pbnNlcnRIYXNoZWRMb2dpblRva2VuIiwiX2lkIiwiZGIiLCJmaW5kIiwiZmV0Y2giLCJlYWNoIiwic3UiLCJzcGFjZSIsImluZGV4T2YiLCJhZG1pbnMiLCJwdXNoIiwibmFtZSIsInRva2VuIiwidXNlcklkIiwiYWRtaW5TcGFjZXMiLCJlbnYiLCJwcm9jZXNzIiwiTk9ERV9FTlYiLCJpcm9uUm91dGVyU2VuZEVycm9yVG9SZXNwb25zZSIsImVyciIsInJlcSIsInJlcyIsInN0YXR1c0NvZGUiLCJzdGF0dXMiLCJtc2ciLCJzdGFjayIsInRvU3RyaW5nIiwiY29uc29sZSIsImhlYWRlcnNTZW50Iiwic29ja2V0IiwiZGVzdHJveSIsInNldEhlYWRlciIsIkJ1ZmZlciIsImJ5dGVMZW5ndGgiLCJtZXRob2QiLCJlbmQiLCJzaGFyZSIsIlJvdXRlIiwiYXBpIiwicGF0aCIsIm9wdGlvbnMiLCJlbmRwb2ludHMxIiwiZW5kcG9pbnRzIiwicHJvdG90eXBlIiwiYWRkVG9BcGkiLCJhdmFpbGFibGVNZXRob2RzIiwiYWxsb3dlZE1ldGhvZHMiLCJmdWxsUGF0aCIsInJlamVjdGVkTWV0aG9kcyIsInNlbGYiLCJjb250YWlucyIsIl9jb25maWciLCJwYXRocyIsImV4dGVuZCIsImRlZmF1bHRPcHRpb25zRW5kcG9pbnQiLCJfcmVzb2x2ZUVuZHBvaW50cyIsIl9jb25maWd1cmVFbmRwb2ludHMiLCJmaWx0ZXIiLCJyZWplY3QiLCJhcGlQYXRoIiwiZW5kcG9pbnQiLCJKc29uUm91dGVzIiwiYWRkIiwiZG9uZUZ1bmMiLCJlbmRwb2ludENvbnRleHQiLCJyZXNwb25zZURhdGEiLCJyZXNwb25zZUluaXRpYXRlZCIsInVybFBhcmFtcyIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwicXVlcnkiLCJib2R5UGFyYW1zIiwiYm9keSIsInJlcXVlc3QiLCJyZXNwb25zZSIsImRvbmUiLCJfY2FsbEVuZHBvaW50IiwiZXJyb3IxIiwiaGVhZGVycyIsIl9yZXNwb25kIiwibWVzc2FnZSIsImpvaW4iLCJ0b1VwcGVyQ2FzZSIsImlzRnVuY3Rpb24iLCJhY3Rpb24iLCJyZWYxIiwicmVmMiIsInJvbGVSZXF1aXJlZCIsInVuaW9uIiwiaXNFbXB0eSIsImF1dGhSZXF1aXJlZCIsInNwYWNlUmVxdWlyZWQiLCJpbnZvY2F0aW9uIiwiX2F1dGhBY2NlcHRlZCIsIl9yb2xlQWNjZXB0ZWQiLCJfc3BhY2VBY2NlcHRlZCIsIkREUENvbW1vbiIsIk1ldGhvZEludm9jYXRpb24iLCJpc1NpbXVsYXRpb24iLCJjb25uZWN0aW9uIiwicmFuZG9tU2VlZCIsIm1ha2VScGNTZWVkIiwiRERQIiwiX0N1cnJlbnRJbnZvY2F0aW9uIiwid2l0aFZhbHVlIiwiY2FsbCIsIl9hdXRoZW50aWNhdGUiLCJhdXRoIiwidXNlclNlbGVjdG9yIiwic3BhY2VfdXNlcnNfY291bnQiLCJzcGFjZUlkIiwiY291bnQiLCJpbnRlcnNlY3Rpb24iLCJyb2xlcyIsImRlZmF1bHRIZWFkZXJzIiwiZGVsYXlJbk1pbGxpc2Vjb25kcyIsIm1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzIiwicmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28iLCJzZW5kUmVzcG9uc2UiLCJfbG93ZXJDYXNlS2V5cyIsIm1hdGNoIiwicHJldHR5SnNvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3cml0ZUhlYWQiLCJ3cml0ZSIsIk1hdGgiLCJyYW5kb20iLCJzZXRUaW1lb3V0Iiwib2JqZWN0IiwiY2hhaW4iLCJwYWlycyIsIm1hcCIsImF0dHIiLCJ0b0xvd2VyQ2FzZSIsInZhbHVlIiwiQ29va2llcyIsIk9kYXRhUmVzdGl2dXMiLCJiYXNpY0F1dGgiLCJpdGVtIiwiaSIsImwiLCJjb3JzSGVhZGVycyIsIl9yb3V0ZXMiLCJ1c2VEZWZhdWx0QXV0aCIsInZlcnNpb24iLCJfdXNlciIsImNvb2tpZXMiLCJnZXQiLCJfaGFzaExvZ2luVG9rZW4iLCJlbmFibGVDb3JzIiwic2xpY2UiLCJsYXN0IiwiX2luaXRBdXRoIiwidXNlQXV0aCIsIndhcm4iLCJhZGRSb3V0ZSIsInJvdXRlIiwiYWRkQ29sbGVjdGlvbiIsImNvbGxlY3Rpb24iLCJjb2xsZWN0aW9uRW5kcG9pbnRzIiwiY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzIiwiZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uIiwiZW50aXR5Um91dGVFbmRwb2ludHMiLCJleGNsdWRlZEVuZHBvaW50cyIsIm1ldGhvZHMiLCJtZXRob2RzT25Db2xsZWN0aW9uIiwicm91dGVPcHRpb25zIiwiX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzIiwiX2NvbGxlY3Rpb25FbmRwb2ludHMiLCJfbmFtZSIsImNvbmZpZ3VyZWRFbmRwb2ludCIsImVuZHBvaW50T3B0aW9ucyIsIm1ldGhvZFR5cGUiLCJjbG9uZSIsImVudGl0eSIsInNlbGVjdG9yIiwiZGF0YSIsInB1dCIsImVudGl0eUlzVXBkYXRlZCIsInVwZGF0ZSIsIiRzZXQiLCJyZW1vdmUiLCJwb3N0IiwiZW50aXR5SWQiLCJpbnNlcnQiLCJnZXRBbGwiLCJlbnRpdGllcyIsImZpZWxkcyIsInByb2ZpbGUiLCJjcmVhdGVVc2VyIiwibG9nb3V0IiwiZSIsImV4dHJhRGF0YSIsInNlYXJjaFF1ZXJ5IiwicmVhc29uIiwib25Mb2dnZWRJbiIsImV4dHJhIiwiaW5kZXgiLCJ0b2tlbkZpZWxkTmFtZSIsInRva2VuTG9jYXRpb24iLCJ0b2tlblBhdGgiLCJ0b2tlblJlbW92YWxRdWVyeSIsInRva2VuVG9SZW1vdmUiLCJsYXN0SW5kZXhPZiIsInN1YnN0cmluZyIsIiRwdWxsIiwib25Mb2dnZWRPdXQiLCJzdGFydHVwIiwiZ2V0T2JqZWN0IiwiZ2V0T2JqZWN0cyIsIm9iamVjdF9uYW1lcyIsInNwbGl0IiwiZm9yRWFjaCIsIm9iamVjdF9uYW1lIiwib2JqZWN0X3Blcm1pc3Npb25zIiwicHNldHMiLCJwc2V0c0FkbWluIiwicHNldHNDdXJyZW50IiwicHNldHNVc2VyIiwiQ3JlYXRvciIsIk9iamVjdHMiLCJnZXRPYmplY3ROYW1lIiwiZ2V0Q29sbGVjdGlvbiIsImFzc2lnbmVkX2FwcHMiLCJnZXRPYmplY3RQZXJtaXNzaW9ucyIsImJpbmQiLCJsaXN0X3ZpZXdzIiwicGVybWlzc2lvbl9zZXQiLCJhbGxvd1JlYWQiLCJhbGxvd0VkaXQiLCJhbGxvd0RlbGV0ZSIsImFsbG93Q3JlYXRlIiwibW9kaWZ5QWxsUmVjb3JkcyIsImZpZWxkIiwia2V5IiwiX2ZpZWxkIiwidW5lZGl0YWJsZV9maWVsZHMiLCJyZWFkb25seSIsInVucmVhZGFibGVfZmllbGRzIiwiU3RlZWRvc09EYXRhIiwiQVBJX1BBVEgiLCJuZXh0IiwiX29iaiIsIlN0ZWVkb3MiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwic2VuZFJlc3VsdCIsImNvZGUiLCJlcnJvcnMiLCJGaWJlciIsImF1dGhvcml6YXRpb25DYWNoZSIsIk1pZGRsZXdhcmUiLCJ1c2UiLCJhcHBfaWQiLCJhcHBfbG9naW5fdG9rZW4iLCJjbGllbnRfaWQiLCJpc0F1dGhlZCIsImxvZ2luVG9rZW5zIiwicmVzdWx0IiwiYWNjZXNzX3Rva2VuIiwibG9nIiwiZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuIiwicGFyc2UiLCJwYXNzIiwicmVzdW1lIiwidCIsInJ1biIsIlNlcnZpY2VEb2N1bWVudCIsIlNlcnZpY2VNZXRhZGF0YSIsIl9CT09MRUFOX1RZUEVTIiwiX0RBVEVUSU1FX09GRlNFVF9UWVBFUyIsIl9OQU1FU1BBQ0UiLCJfTlVNQkVSX1RZUEVTIiwiZ2V0T2JqZWN0c09kYXRhU2NoZW1hIiwiY29udGFpbmVyX3NjaGVtYSIsImVudGl0aWVzX3NjaGVtYSIsInNjaGVtYSIsIlZFUlNJT04iLCJkYXRhU2VydmljZXMiLCJuYW1lc3BhY2UiLCJlbnRpdHlUeXBlIiwiYW5ub3RhdGlvbnMiLCJDb2xsZWN0aW9ucyIsImxpc3QiLCJfb2JqZWN0IiwiZW50aXRpZSIsIm5hdmlnYXRpb25Qcm9wZXJ0eSIsInByb3BlcnR5IiwiZW5hYmxlX2FwaSIsInByb3BlcnR5UmVmIiwiY29tcHV0ZWRLZXkiLCJfa2V5IiwidGFyZ2V0IiwiYW5ub3RhdGlvbiIsInR5cGUiLCJudWxsYWJsZSIsImZpZWxkX25hbWUiLCJfcHJvcGVydHkiLCJyZWZlcmVuY2VfdG8iLCJwcmVjaXNpb24iLCJyZXF1aXJlZCIsImlzQXJyYXkiLCJyIiwicmVmZXJlbmNlX29iaiIsIkVYUEFORF9GSUVMRF9TVUZGSVgiLCJwYXJ0bmVyIiwiX3JlX25hbWUiLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCJyZWZlcmVuY2VkUHJvcGVydHkiLCJlbnRpdHlDb250YWluZXIiLCJlbnRpdHlTZXQiLCJfZXQiLCJrIiwiU3RlZWRvc09kYXRhQVBJIiwiQVVUSFJFUVVJUkVEIiwiY29udGV4dCIsInNlcnZpY2VEb2N1bWVudCIsImdldE1ldGFEYXRhUGF0aCIsInByb2Nlc3NNZXRhZGF0YUpzb24iLCJkb2N1bWVudCIsIk1FVEFEQVRBX1BBVEgiLCJzZXJ2aWNlTWV0YWRhdGEiLCJnZXRSb290UGF0aCIsImFic29sdXRlVXJsIiwiZ2V0T0RhdGFQYXRoIiwiaXNTZXJ2ZXIiLCJnZXRPRGF0YUNvbnRleHRQYXRoIiwiZ2V0T0RhdGFOZXh0TGlua1BhdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGOztBQUFyQjtBQUNBQyxPQUFPLENBQUMseUJBQUQsQ0FBUDs7QUFHQUosZ0JBQWdCLENBQUM7QUFDaEIsZ0JBQWMsUUFERTtBQUVoQiwrQkFBNkIsUUFGYjtBQUdoQiwrQkFBNkI7QUFIYixDQUFELEVBSWIsZUFKYSxDQUFoQixDOzs7Ozs7Ozs7Ozs7QUNKQSxJQUFBSyxvQkFBQSxFQUFBQyxhQUFBO0FBQUEsS0FBQ0MsSUFBRCxVQUFDQSxJQUFELEdBQVUsRUFBVixFLENBRUE7OztBQUdBRCxnQkFBZ0JFLE1BQU1DLEtBQU4sQ0FBWSxVQUFDQyxJQUFEO0FBQzNCQyxRQUFNRCxJQUFOLEVBQ0M7QUFBQUUsUUFBSUosTUFBTUssUUFBTixDQUFlQyxNQUFmLENBQUo7QUFDQUMsY0FBVVAsTUFBTUssUUFBTixDQUFlQyxNQUFmLENBRFY7QUFFQUUsV0FBT1IsTUFBTUssUUFBTixDQUFlQyxNQUFmO0FBRlAsR0FERDs7QUFLQSxNQUFHRyxFQUFFQyxJQUFGLENBQU9SLElBQVAsRUFBYVMsTUFBYixLQUF1QixDQUFJLENBQTlCO0FBQ0MsVUFBTSxJQUFJWCxNQUFNWSxLQUFWLENBQWdCLDZDQUFoQixDQUFOO0FDS0M7O0FESEYsU0FBTyxJQUFQO0FBVGUsRUFBaEIsQyxDQVlBOzs7O0FBR0FmLHVCQUF1QixVQUFDSyxJQUFEO0FBQ3RCLE1BQUdBLEtBQUtFLEVBQVI7QUFDQyxXQUFPO0FBQUMsYUFBT0YsS0FBS0U7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Qjs7QUFHQSxJQUFHL04sT0FBTzhVLFFBQVY7QUFDQ3JGLGVBQWE2RSxlQUFiLEdBQStCLFVBQUMvTSxPQUFEO0FBQzlCLFdBQU9rSSxhQUFha0YsV0FBYixDQUF5QnBOLE9BQXpCLEtBQW9DLE1BQUlrSSxhQUFhZ0YsYUFBckQsQ0FBUDtBQUQ4QixHQUEvQjs7QUFHQWhGLGVBQWFzRixtQkFBYixHQUFtQyxVQUFDeE4sT0FBRCxFQUFVd0csV0FBVjtBQUNsQyxXQUFPMEIsYUFBYTZFLGVBQWIsQ0FBNkIvTSxPQUE3QixLQUF3QyxNQUFJd0csV0FBNUMsQ0FBUDtBQURrQyxHQUFuQzs7QUFFQTBCLGVBQWF1RixvQkFBYixHQUFvQyxVQUFDek4sT0FBRCxFQUFTd0csV0FBVDtBQUNuQyxXQUFPMEIsYUFBYWtGLFdBQWIsQ0FBeUJwTixPQUF6QixLQUFvQyxNQUFJd0csV0FBeEMsQ0FBUDtBQURtQyxHQUFwQzs7QUFJQSxPQUFDbUcsZUFBRCxHQUFtQixJQUFJaEwsYUFBSixDQUNsQjtBQUFBOUUsYUFBU3FMLGFBQWFDLFFBQXRCO0FBQ0FqRyxvQkFBZ0IsSUFEaEI7QUFFQXZCLGdCQUFZLElBRlo7QUFHQTZCLGdCQUFZLElBSFo7QUFJQXBDLG9CQUNDO0FBQUEsc0JBQWdCO0FBQWhCO0FBTEQsR0FEa0IsQ0FBbkI7QUNpQkEsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGZpeCB3YXJuaW5nOiB4eHggbm90IGluc3RhbGxlZFxucmVxdWlyZShcImJhc2ljLWF1dGgvcGFja2FnZS5qc29uXCIpO1xuXG5pbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0J2Jhc2ljLWF1dGgnOiAnXjIuMC4xJyxcblx0J29kYXRhLXY0LXNlcnZpY2UtbWV0YWRhdGEnOiBcIl4wLjEuNlwiLFxuXHRcIm9kYXRhLXY0LXNlcnZpY2UtZG9jdW1lbnRcIjogXCJeMC4wLjNcIixcbn0sICdzdGVlZG9zOm9kYXRhJyk7XG4iLCJAQXV0aCBvcj0ge31cblxuIyMjXG5cdEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcbiMjI1xudXNlclZhbGlkYXRvciA9IE1hdGNoLldoZXJlICh1c2VyKSAtPlxuXHRjaGVjayB1c2VyLFxuXHRcdGlkOiBNYXRjaC5PcHRpb25hbCBTdHJpbmdcblx0XHR1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG5cdFx0ZW1haWw6IE1hdGNoLk9wdGlvbmFsIFN0cmluZ1xuXG5cdGlmIF8ua2V5cyh1c2VyKS5sZW5ndGggaXMgbm90IDFcblx0XHR0aHJvdyBuZXcgTWF0Y2guRXJyb3IgJ1VzZXIgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGlkZW50aWZpZXIgZmllbGQnXG5cblx0cmV0dXJuIHRydWVcblxuXG4jIyNcblx0UmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxuIyMjXG5nZXRVc2VyUXVlcnlTZWxlY3RvciA9ICh1c2VyKSAtPlxuXHRpZiB1c2VyLmlkXG5cdFx0cmV0dXJuIHsnX2lkJzogdXNlci5pZH1cblx0ZWxzZSBpZiB1c2VyLnVzZXJuYW1lXG5cdFx0cmV0dXJuIHsndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lfVxuXHRlbHNlIGlmIHVzZXIuZW1haWxcblx0XHRyZXR1cm4geydlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWx9XG5cblx0IyBXZSBzaG91bGRuJ3QgYmUgaGVyZSBpZiB0aGUgdXNlciBvYmplY3Qgd2FzIHByb3Blcmx5IHZhbGlkYXRlZFxuXHR0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgc2VsZWN0b3IgZnJvbSBpbnZhbGlkIHVzZXInXG5cblxuIyMjXG5cdExvZyBhIHVzZXIgaW4gd2l0aCB0aGVpciBwYXNzd29yZFxuIyMjXG5AQXV0aC5sb2dpbldpdGhQYXNzd29yZCA9ICh1c2VyLCBwYXNzd29yZCkgLT5cblx0aWYgbm90IHVzZXIgb3Igbm90IHBhc3N3b3JkXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsICdVbmF1dGhvcml6ZWQnXG5cblx0IyBWYWxpZGF0ZSB0aGUgbG9naW4gaW5wdXQgdHlwZXNcblx0Y2hlY2sgdXNlciwgdXNlclZhbGlkYXRvclxuXHRjaGVjayBwYXNzd29yZCwgU3RyaW5nXG5cblx0IyBSZXRyaWV2ZSB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxuXHRhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpXG5cdGF1dGhlbnRpY2F0aW5nVXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yKVxuXG5cdGlmIG5vdCBhdXRoZW50aWNhdGluZ1VzZXJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblx0aWYgbm90IGF1dGhlbnRpY2F0aW5nVXNlci5zZXJ2aWNlcz8ucGFzc3dvcmRcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1VuYXV0aG9yaXplZCdcblxuXHQjIEF1dGhlbnRpY2F0ZSB0aGUgdXNlcidzIHBhc3N3b3JkXG5cdHBhc3N3b3JkVmVyaWZpY2F0aW9uID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgYXV0aGVudGljYXRpbmdVc2VyLCBwYXNzd29yZFxuXHRpZiBwYXNzd29yZFZlcmlmaWNhdGlvbi5lcnJvclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNDAxLCAnVW5hdXRob3JpemVkJ1xuXG5cdCMgQWRkIGEgbmV3IGF1dGggdG9rZW4gdG8gdGhlIHVzZXIncyBhY2NvdW50XG5cdGF1dGhUb2tlbiA9IEFjY291bnRzLl9nZW5lcmF0ZVN0YW1wZWRMb2dpblRva2VuKClcblx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaFN0YW1wZWRUb2tlbiBhdXRoVG9rZW5cblx0QWNjb3VudHMuX2luc2VydEhhc2hlZExvZ2luVG9rZW4gYXV0aGVudGljYXRpbmdVc2VyLl9pZCwgaGFzaGVkVG9rZW5cblxuXHRzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IGF1dGhlbnRpY2F0aW5nVXNlci5faWR9KS5mZXRjaCgpXG5cdHNwYWNlcyA9IFtdXG5cdF8uZWFjaCBzcGFjZV91c2VycywgKHN1KS0+XG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzdS5zcGFjZSlcblx0XHQjIHNwYWNlIG11c3QgYmUgcGFpZCwgYW5kIHVzZXIgbXVzdCBiZSBhZG1pbnNcblx0XHRpZiBzcGFjZSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBzdS51c2VyKT49MFxuXHRcdFx0c3BhY2VzLnB1c2hcblx0XHRcdFx0X2lkOiBzcGFjZS5faWRcblx0XHRcdFx0bmFtZTogc3BhY2UubmFtZVxuXHRyZXR1cm4ge2F1dGhUb2tlbjogYXV0aFRva2VuLnRva2VuLCB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGFkbWluU3BhY2VzOiBzcGFjZXN9XG4iLCJ2YXIgZ2V0VXNlclF1ZXJ5U2VsZWN0b3IsIHVzZXJWYWxpZGF0b3I7XG5cbnRoaXMuQXV0aCB8fCAodGhpcy5BdXRoID0ge30pO1xuXG5cbi8qXG5cdEEgdmFsaWQgdXNlciB3aWxsIGhhdmUgZXhhY3RseSBvbmUgb2YgdGhlIGZvbGxvd2luZyBpZGVudGlmaWNhdGlvbiBmaWVsZHM6IGlkLCB1c2VybmFtZSwgb3IgZW1haWxcbiAqL1xuXG51c2VyVmFsaWRhdG9yID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24odXNlcikge1xuICBjaGVjayh1c2VyLCB7XG4gICAgaWQ6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgZW1haWw6IE1hdGNoLk9wdGlvbmFsKFN0cmluZylcbiAgfSk7XG4gIGlmIChfLmtleXModXNlcikubGVuZ3RoID09PSAhMSkge1xuICAgIHRocm93IG5ldyBNYXRjaC5FcnJvcignVXNlciBtdXN0IGhhdmUgZXhhY3RseSBvbmUgaWRlbnRpZmllciBmaWVsZCcpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufSk7XG5cblxuLypcblx0UmV0dXJuIGEgTW9uZ29EQiBxdWVyeSBzZWxlY3RvciBmb3IgZmluZGluZyB0aGUgZ2l2ZW4gdXNlclxuICovXG5cbmdldFVzZXJRdWVyeVNlbGVjdG9yID0gZnVuY3Rpb24odXNlcikge1xuICBpZiAodXNlci5pZCkge1xuICAgIHJldHVybiB7XG4gICAgICAnX2lkJzogdXNlci5pZFxuICAgIH07XG4gIH0gZWxzZSBpZiAodXNlci51c2VybmFtZSkge1xuICAgIHJldHVybiB7XG4gICAgICAndXNlcm5hbWUnOiB1c2VyLnVzZXJuYW1lXG4gICAgfTtcbiAgfSBlbHNlIGlmICh1c2VyLmVtYWlsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdlbWFpbHMuYWRkcmVzcyc6IHVzZXIuZW1haWxcbiAgICB9O1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBzZWxlY3RvciBmcm9tIGludmFsaWQgdXNlcicpO1xufTtcblxuXG4vKlxuXHRMb2cgYSB1c2VyIGluIHdpdGggdGhlaXIgcGFzc3dvcmRcbiAqL1xuXG50aGlzLkF1dGgubG9naW5XaXRoUGFzc3dvcmQgPSBmdW5jdGlvbih1c2VyLCBwYXNzd29yZCkge1xuICB2YXIgYXV0aFRva2VuLCBhdXRoZW50aWNhdGluZ1VzZXIsIGF1dGhlbnRpY2F0aW5nVXNlclNlbGVjdG9yLCBoYXNoZWRUb2tlbiwgcGFzc3dvcmRWZXJpZmljYXRpb24sIHJlZiwgc3BhY2VfdXNlcnMsIHNwYWNlcztcbiAgaWYgKCF1c2VyIHx8ICFwYXNzd29yZCkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgY2hlY2sodXNlciwgdXNlclZhbGlkYXRvcik7XG4gIGNoZWNrKHBhc3N3b3JkLCBTdHJpbmcpO1xuICBhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3RvciA9IGdldFVzZXJRdWVyeVNlbGVjdG9yKHVzZXIpO1xuICBhdXRoZW50aWNhdGluZ1VzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShhdXRoZW50aWNhdGluZ1VzZXJTZWxlY3Rvcik7XG4gIGlmICghYXV0aGVudGljYXRpbmdVc2VyKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBpZiAoISgocmVmID0gYXV0aGVudGljYXRpbmdVc2VyLnNlcnZpY2VzKSAhPSBudWxsID8gcmVmLnBhc3N3b3JkIDogdm9pZCAwKSkge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCAnVW5hdXRob3JpemVkJyk7XG4gIH1cbiAgcGFzc3dvcmRWZXJpZmljYXRpb24gPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZChhdXRoZW50aWNhdGluZ1VzZXIsIHBhc3N3b3JkKTtcbiAgaWYgKHBhc3N3b3JkVmVyaWZpY2F0aW9uLmVycm9yKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsICdVbmF1dGhvcml6ZWQnKTtcbiAgfVxuICBhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpO1xuICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuKGF1dGhUb2tlbik7XG4gIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuKGF1dGhlbnRpY2F0aW5nVXNlci5faWQsIGhhc2hlZFRva2VuKTtcbiAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiBhdXRoZW50aWNhdGluZ1VzZXIuX2lkXG4gIH0pLmZldGNoKCk7XG4gIHNwYWNlcyA9IFtdO1xuICBfLmVhY2goc3BhY2VfdXNlcnMsIGZ1bmN0aW9uKHN1KSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3Uuc3BhY2UpO1xuICAgIGlmIChzcGFjZSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBzdS51c2VyKSA+PSAwKSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2goe1xuICAgICAgICBfaWQ6IHNwYWNlLl9pZCxcbiAgICAgICAgbmFtZTogc3BhY2UubmFtZVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBhdXRoVG9rZW46IGF1dGhUb2tlbi50b2tlbixcbiAgICB1c2VySWQ6IGF1dGhlbnRpY2F0aW5nVXNlci5faWQsXG4gICAgYWRtaW5TcGFjZXM6IHNwYWNlc1xuICB9O1xufTtcbiIsIi8vIFdlIG5lZWQgYSBmdW5jdGlvbiB0aGF0IHRyZWF0cyB0aHJvd24gZXJyb3JzIGV4YWN0bHkgbGlrZSBJcm9uIFJvdXRlciB3b3VsZC5cbi8vIFRoaXMgZmlsZSBpcyB3cml0dGVuIGluIEphdmFTY3JpcHQgdG8gZW5hYmxlIGNvcHktcGFzdGluZyBJcm9uIFJvdXRlciBjb2RlLlxuXG4vLyBUYWtlbiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaXJvbi1tZXRlb3IvaXJvbi1yb3V0ZXIvYmxvYi85YzM2OTQ5OWM5OGFmOWZkMTJlZjllNjgzMzhkZWUzYjFiMTI3NmFhL2xpYi9yb3V0ZXJfc2VydmVyLmpzI0wzXG52YXIgZW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcblxuLy8gVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lyb24tbWV0ZW9yL2lyb24tcm91dGVyL2Jsb2IvOWMzNjk0OTljOThhZjlmZDEyZWY5ZTY4MzM4ZGVlM2IxYjEyNzZhYS9saWIvcm91dGVyX3NlcnZlci5qcyNMNDdcbmlyb25Sb3V0ZXJTZW5kRXJyb3JUb1Jlc3BvbnNlID0gZnVuY3Rpb24oZXJyLCByZXEsIHJlcykge1xuXHRpZiAocmVzLnN0YXR1c0NvZGUgPCA0MDApXG5cdFx0cmVzLnN0YXR1c0NvZGUgPSA1MDA7XG5cblx0aWYgKGVyci5zdGF0dXMpXG5cdFx0cmVzLnN0YXR1c0NvZGUgPSBlcnIuc3RhdHVzO1xuXG5cdGlmIChlbnYgPT09ICdkZXZlbG9wbWVudCcpXG5cdFx0bXNnID0gKGVyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKSkgKyAnXFxuJztcblx0ZWxzZVxuXHQvL1hYWCBnZXQgdGhpcyBmcm9tIHN0YW5kYXJkIGRpY3Qgb2YgZXJyb3IgbWVzc2FnZXM/XG5cdFx0bXNnID0gJ1NlcnZlciBlcnJvci4nO1xuXG5cdGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpKTtcblxuXHRpZiAocmVzLmhlYWRlcnNTZW50KVxuXHRcdHJldHVybiByZXEuc29ja2V0LmRlc3Ryb3koKTtcblxuXHRyZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJyk7XG5cdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgQnVmZmVyLmJ5dGVMZW5ndGgobXNnKSk7XG5cdGlmIChyZXEubWV0aG9kID09PSAnSEVBRCcpXG5cdFx0cmV0dXJuIHJlcy5lbmQoKTtcblx0cmVzLmVuZChtc2cpO1xuXHRyZXR1cm47XG59XG4iLCJjbGFzcyBzaGFyZS5Sb3V0ZVxuXG5cdGNvbnN0cnVjdG9yOiAoQGFwaSwgQHBhdGgsIEBvcHRpb25zLCBAZW5kcG9pbnRzKSAtPlxuXHRcdCMgQ2hlY2sgaWYgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkXG5cdFx0aWYgbm90IEBlbmRwb2ludHNcblx0XHRcdEBlbmRwb2ludHMgPSBAb3B0aW9uc1xuXHRcdFx0QG9wdGlvbnMgPSB7fVxuXG5cblx0YWRkVG9BcGk6IGRvIC0+XG5cdFx0YXZhaWxhYmxlTWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2RlbGV0ZScsICdvcHRpb25zJ11cblxuXHRcdHJldHVybiAtPlxuXHRcdFx0c2VsZiA9IHRoaXNcblxuXHRcdFx0IyBUaHJvdyBhbiBlcnJvciBpZiBhIHJvdXRlIGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgYXQgdGhpcyBwYXRoXG5cdFx0XHQjIFRPRE86IENoZWNrIGZvciBjb2xsaXNpb25zIHdpdGggcGF0aHMgdGhhdCBmb2xsb3cgc2FtZSBwYXR0ZXJuIHdpdGggZGlmZmVyZW50IHBhcmFtZXRlciBuYW1lc1xuXHRcdFx0aWYgXy5jb250YWlucyBAYXBpLl9jb25maWcucGF0aHMsIEBwYXRoXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCBhZGQgYSByb3V0ZSBhdCBhbiBleGlzdGluZyBwYXRoOiAje0BwYXRofVwiXG5cblx0XHRcdCMgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgT1BUSU9OUyBlbmRwb2ludCB3aXRoIG91ciBvd25cblx0XHRcdEBlbmRwb2ludHMgPSBfLmV4dGVuZCBvcHRpb25zOiBAYXBpLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCwgQGVuZHBvaW50c1xuXG5cdFx0XHQjIENvbmZpZ3VyZSBlYWNoIGVuZHBvaW50IG9uIHRoaXMgcm91dGVcblx0XHRcdEBfcmVzb2x2ZUVuZHBvaW50cygpXG5cdFx0XHRAX2NvbmZpZ3VyZUVuZHBvaW50cygpXG5cblx0XHRcdCMgQWRkIHRvIG91ciBsaXN0IG9mIGV4aXN0aW5nIHBhdGhzXG5cdFx0XHRAYXBpLl9jb25maWcucGF0aHMucHVzaCBAcGF0aFxuXG5cdFx0XHRhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyIGF2YWlsYWJsZU1ldGhvZHMsIChtZXRob2QpIC0+XG5cdFx0XHRcdF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKVxuXHRcdFx0cmVqZWN0ZWRNZXRob2RzID0gXy5yZWplY3QgYXZhaWxhYmxlTWV0aG9kcywgKG1ldGhvZCkgLT5cblx0XHRcdFx0Xy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpXG5cblx0XHRcdCMgU2V0dXAgZW5kcG9pbnRzIG9uIHJvdXRlXG5cdFx0XHRmdWxsUGF0aCA9IEBhcGkuX2NvbmZpZy5hcGlQYXRoICsgQHBhdGhcblx0XHRcdF8uZWFjaCBhbGxvd2VkTWV0aG9kcywgKG1ldGhvZCkgLT5cblx0XHRcdFx0ZW5kcG9pbnQgPSBzZWxmLmVuZHBvaW50c1ttZXRob2RdXG5cdFx0XHRcdEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cblx0XHRcdFx0XHQjIEFkZCBmdW5jdGlvbiB0byBlbmRwb2ludCBjb250ZXh0IGZvciBpbmRpY2F0aW5nIGEgcmVzcG9uc2UgaGFzIGJlZW4gaW5pdGlhdGVkIG1hbnVhbGx5XG5cdFx0XHRcdFx0cmVzcG9uc2VJbml0aWF0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdGRvbmVGdW5jID0gLT5cblx0XHRcdFx0XHRcdHJlc3BvbnNlSW5pdGlhdGVkID0gdHJ1ZVxuXG5cdFx0XHRcdFx0ZW5kcG9pbnRDb250ZXh0ID1cblx0XHRcdFx0XHRcdHVybFBhcmFtczogcmVxLnBhcmFtc1xuXHRcdFx0XHRcdFx0cXVlcnlQYXJhbXM6IHJlcS5xdWVyeVxuXHRcdFx0XHRcdFx0Ym9keVBhcmFtczogcmVxLmJvZHlcblx0XHRcdFx0XHRcdHJlcXVlc3Q6IHJlcVxuXHRcdFx0XHRcdFx0cmVzcG9uc2U6IHJlc1xuXHRcdFx0XHRcdFx0ZG9uZTogZG9uZUZ1bmNcblx0XHRcdFx0XHQjIEFkZCBlbmRwb2ludCBjb25maWcgb3B0aW9ucyB0byBjb250ZXh0XG5cdFx0XHRcdFx0Xy5leHRlbmQgZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludFxuXG5cdFx0XHRcdFx0IyBSdW4gdGhlIHJlcXVlc3RlZCBlbmRwb2ludFxuXHRcdFx0XHRcdHJlc3BvbnNlRGF0YSA9IG51bGxcblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHJlc3BvbnNlRGF0YSA9IHNlbGYuX2NhbGxFbmRwb2ludCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG5cdFx0XHRcdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdFx0XHRcdCMgRG8gZXhhY3RseSB3aGF0IElyb24gUm91dGVyIHdvdWxkIGhhdmUgZG9uZSwgdG8gYXZvaWQgY2hhbmdpbmcgdGhlIEFQSVxuXHRcdFx0XHRcdFx0aXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UoZXJyb3IsIHJlcSwgcmVzKTtcblx0XHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRcdFx0aWYgcmVzcG9uc2VJbml0aWF0ZWRcblx0XHRcdFx0XHRcdCMgRW5zdXJlIHRoZSByZXNwb25zZSBpcyBwcm9wZXJseSBjb21wbGV0ZWRcblx0XHRcdFx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgcmVzLmhlYWRlcnNTZW50XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciBcIk11c3QgY2FsbCB0aGlzLmRvbmUoKSBhZnRlciBoYW5kbGluZyBlbmRwb2ludCByZXNwb25zZSBtYW51YWxseTogI3ttZXRob2R9ICN7ZnVsbFBhdGh9XCJcblx0XHRcdFx0XHRcdGVsc2UgaWYgcmVzcG9uc2VEYXRhIGlzIG51bGwgb3IgcmVzcG9uc2VEYXRhIGlzIHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgcmV0dXJuIG51bGwgb3IgdW5kZWZpbmVkIGZyb20gYW4gZW5kcG9pbnQ6ICN7bWV0aG9kfSAje2Z1bGxQYXRofVwiXG5cblx0XHRcdFx0XHQjIEdlbmVyYXRlIGFuZCByZXR1cm4gdGhlIGh0dHAgcmVzcG9uc2UsIGhhbmRsaW5nIHRoZSBkaWZmZXJlbnQgZW5kcG9pbnQgcmVzcG9uc2UgdHlwZXNcblx0XHRcdFx0XHRpZiByZXNwb25zZURhdGEuYm9keSBhbmQgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIG9yIHJlc3BvbnNlRGF0YS5oZWFkZXJzKVxuXHRcdFx0XHRcdFx0c2VsZi5fcmVzcG9uZCByZXMsIHJlc3BvbnNlRGF0YS5ib2R5LCByZXNwb25zZURhdGEuc3RhdHVzQ29kZSwgcmVzcG9uc2VEYXRhLmhlYWRlcnNcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzZWxmLl9yZXNwb25kIHJlcywgcmVzcG9uc2VEYXRhXG5cblx0XHRcdF8uZWFjaCByZWplY3RlZE1ldGhvZHMsIChtZXRob2QpIC0+XG5cdFx0XHRcdEpzb25Sb3V0ZXMuYWRkIG1ldGhvZCwgZnVsbFBhdGgsIChyZXEsIHJlcykgLT5cblx0XHRcdFx0XHRyZXNwb25zZURhdGEgPSBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdBUEkgZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QnXG5cdFx0XHRcdFx0aGVhZGVycyA9ICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxuXHRcdFx0XHRcdHNlbGYuX3Jlc3BvbmQgcmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVyc1xuXG5cblx0IyMjXG5cdFx0Q29udmVydCBhbGwgZW5kcG9pbnRzIG9uIHRoZSBnaXZlbiByb3V0ZSBpbnRvIG91ciBleHBlY3RlZCBlbmRwb2ludCBvYmplY3QgaWYgaXQgaXMgYSBiYXJlXG5cdFx0ZnVuY3Rpb25cblxuXHRcdEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuXHQjIyNcblx0X3Jlc29sdmVFbmRwb2ludHM6IC0+XG5cdFx0Xy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kLCBlbmRwb2ludHMpIC0+XG5cdFx0XHRpZiBfLmlzRnVuY3Rpb24oZW5kcG9pbnQpXG5cdFx0XHRcdGVuZHBvaW50c1ttZXRob2RdID0ge2FjdGlvbjogZW5kcG9pbnR9XG5cdFx0cmV0dXJuXG5cblxuXHQjIyNcblx0XHRDb25maWd1cmUgdGhlIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50IG9uIGFsbCBlbmRwb2ludHMgKGV4Y2VwdCBPUFRJT05TLCB3aGljaCBtdXN0XG5cdFx0YmUgY29uZmlndXJlZCBkaXJlY3RseSBvbiB0aGUgZW5kcG9pbnQpXG5cblx0XHRBdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yIGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhblxuXHRcdGVudGlyZSByb3V0ZSwgdGhhdCBzZXJ2ZXMgYXMgdGhlIGRlZmF1bHQuIElmIHJlcXVpcmVkIGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsXG5cdFx0b3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG5cblx0XHRBZnRlciB0aGUgZW5kcG9pbnQgaXMgY29uZmlndXJlZCwgYWxsIGF1dGhlbnRpY2F0aW9uIGFuZCByb2xlIHJlcXVpcmVtZW50cyBvZiBhbiBlbmRwb2ludCBjYW4gYmVcblx0XHRhY2Nlc3NlZCBhdCA8Y29kZT5lbmRwb2ludC5hdXRoUmVxdWlyZWQ8L2NvZGU+IGFuZCA8Y29kZT5lbmRwb2ludC5yb2xlUmVxdWlyZWQ8L2NvZGU+LFxuXHRcdHJlc3BlY3RpdmVseS5cblxuXHRcdEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuXHRcdEBwYXJhbSB7RW5kcG9pbnR9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjb25maWd1cmVcblx0IyMjXG5cdF9jb25maWd1cmVFbmRwb2ludHM6IC0+XG5cdFx0Xy5lYWNoIEBlbmRwb2ludHMsIChlbmRwb2ludCwgbWV0aG9kKSAtPlxuXHRcdFx0aWYgbWV0aG9kIGlzbnQgJ29wdGlvbnMnXG5cdFx0XHRcdCMgQ29uZmlndXJlIGFjY2VwdGFibGUgcm9sZXNcblx0XHRcdFx0aWYgbm90IEBvcHRpb25zPy5yb2xlUmVxdWlyZWRcblx0XHRcdFx0XHRAb3B0aW9ucy5yb2xlUmVxdWlyZWQgPSBbXVxuXHRcdFx0XHRpZiBub3QgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG5cdFx0XHRcdFx0ZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gW11cblx0XHRcdFx0ZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gXy51bmlvbiBlbmRwb2ludC5yb2xlUmVxdWlyZWQsIEBvcHRpb25zLnJvbGVSZXF1aXJlZFxuXHRcdFx0XHQjIE1ha2UgaXQgZWFzaWVyIHRvIGNoZWNrIGlmIG5vIHJvbGVzIGFyZSByZXF1aXJlZFxuXHRcdFx0XHRpZiBfLmlzRW1wdHkgZW5kcG9pbnQucm9sZVJlcXVpcmVkXG5cdFx0XHRcdFx0ZW5kcG9pbnQucm9sZVJlcXVpcmVkID0gZmFsc2VcblxuXHRcdFx0XHQjIENvbmZpZ3VyZSBhdXRoIHJlcXVpcmVtZW50XG5cdFx0XHRcdGlmIGVuZHBvaW50LmF1dGhSZXF1aXJlZCBpcyB1bmRlZmluZWRcblx0XHRcdFx0XHRpZiBAb3B0aW9ucz8uYXV0aFJlcXVpcmVkIG9yIGVuZHBvaW50LnJvbGVSZXF1aXJlZFxuXHRcdFx0XHRcdFx0ZW5kcG9pbnQuYXV0aFJlcXVpcmVkID0gdHJ1ZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGVuZHBvaW50LmF1dGhSZXF1aXJlZCA9IGZhbHNlXG5cblx0XHRcdFx0aWYgQG9wdGlvbnM/LnNwYWNlUmVxdWlyZWRcblx0XHRcdFx0XHRlbmRwb2ludC5zcGFjZVJlcXVpcmVkID0gQG9wdGlvbnMuc3BhY2VSZXF1aXJlZFxuXHRcdFx0XHRyZXR1cm5cblx0XHQsIHRoaXNcblx0XHRyZXR1cm5cblxuXG5cdCMjI1xuXHRcdEF1dGhlbnRpY2F0ZSBhbiBlbmRwb2ludCBpZiByZXF1aXJlZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRcblxuXHRcdEByZXR1cm5zIFRoZSBlbmRwb2ludCByZXNwb25zZSBvciBhIDQwMSBpZiBhdXRoZW50aWNhdGlvbiBmYWlsc1xuXHQjIyNcblx0X2NhbGxFbmRwb2ludDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG5cdFx0IyBDYWxsIHRoZSBlbmRwb2ludCBpZiBhdXRoZW50aWNhdGlvbiBkb2Vzbid0IGZhaWxcblx0XHRpZiBAX2F1dGhBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG5cdFx0XHRpZiBAX3JvbGVBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG5cdFx0XHRcdGlmIEBfc3BhY2VBY2NlcHRlZCBlbmRwb2ludENvbnRleHQsIGVuZHBvaW50XG5cdFx0XHRcdFx0I2VuZHBvaW50LmFjdGlvbi5jYWxsIGVuZHBvaW50Q29udGV4dFxuXHRcdFx0XHRcdGludm9jYXRpb24gPSBuZXcgRERQQ29tbW9uLk1ldGhvZEludm9jYXRpb25cblx0XHRcdFx0XHRcdGlzU2ltdWxhdGlvbjogdHJ1ZSxcblx0XHRcdFx0XHRcdHVzZXJJZDogZW5kcG9pbnRDb250ZXh0LnVzZXJJZCxcblx0XHRcdFx0XHRcdGNvbm5lY3Rpb246IG51bGwsXG5cdFx0XHRcdFx0XHRyYW5kb21TZWVkOiBERFBDb21tb24ubWFrZVJwY1NlZWQoKVxuXG5cdFx0XHRcdFx0cmV0dXJuIEREUC5fQ3VycmVudEludm9jYXRpb24ud2l0aFZhbHVlIGludm9jYXRpb24sIC0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gZW5kcG9pbnQuYWN0aW9uLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwM1xuXHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdCYWQgWC1TcGFjZS1JZCwgT25seSBhZG1pbnMgb2YgcGFpZCBzcGFjZSBjYW4gY2FsbCB0aGlzIGFwaS4nfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRzdGF0dXNDb2RlOiA0MDNcblx0XHRcdFx0Ym9keToge3N0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRvIHRoaXMuJ31cblx0XHRlbHNlXG5cdFx0XHRzdGF0dXNDb2RlOiA0MDFcblx0XHRcdGJvZHk6IHtzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6ICdZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gZG8gdGhpcy4nfVxuXG5cblx0IyMjXG5cdFx0QXV0aGVudGljYXRlIHRoZSBnaXZlbiBlbmRwb2ludCBpZiByZXF1aXJlZFxuXG5cdFx0T25jZSBpdCdzIGdsb2JhbGx5IGNvbmZpZ3VyZWQgaW4gdGhlIEFQSSwgYXV0aGVudGljYXRpb24gY2FuIGJlIHJlcXVpcmVkIG9uIGFuIGVudGlyZSByb3V0ZSBvclxuXHRcdGluZGl2aWR1YWwgZW5kcG9pbnRzLiBJZiByZXF1aXJlZCBvbiBhbiBlbnRpcmUgZW5kcG9pbnQsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZFxuXHRcdGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuXG5cdFx0QHJldHVybnMgRmFsc2UgaWYgYXV0aGVudGljYXRpb24gZmFpbHMsIGFuZCB0cnVlIG90aGVyd2lzZVxuXHQjIyNcblx0X2F1dGhBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG5cdFx0aWYgZW5kcG9pbnQuYXV0aFJlcXVpcmVkXG5cdFx0XHRAX2F1dGhlbnRpY2F0ZSBlbmRwb2ludENvbnRleHRcblx0XHRlbHNlIHRydWVcblxuXG5cdCMjI1xuXHRcdFZlcmlmeSB0aGUgcmVxdWVzdCBpcyBiZWluZyBtYWRlIGJ5IGFuIGFjdGl2ZWx5IGxvZ2dlZCBpbiB1c2VyXG5cblx0XHRJZiB2ZXJpZmllZCwgYXR0YWNoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgdG8gdGhlIGNvbnRleHQuXG5cblx0XHRAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXV0aGVudGljYXRpb24gd2FzIHN1Y2Nlc3NmdWxcblx0IyMjXG5cdF9hdXRoZW50aWNhdGU6IChlbmRwb2ludENvbnRleHQpIC0+XG5cdFx0IyBHZXQgYXV0aCBpbmZvXG5cdFx0YXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXG5cblx0XHQjIEdldCB0aGUgdXNlciBmcm9tIHRoZSBkYXRhYmFzZVxuXHRcdGlmIGF1dGg/LnVzZXJJZCBhbmQgYXV0aD8udG9rZW4gYW5kIG5vdCBhdXRoPy51c2VyXG5cdFx0XHR1c2VyU2VsZWN0b3IgPSB7fVxuXHRcdFx0dXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkXG5cdFx0XHR1c2VyU2VsZWN0b3JbQGFwaS5fY29uZmlnLmF1dGgudG9rZW5dID0gYXV0aC50b2tlblxuXHRcdFx0YXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUgdXNlclNlbGVjdG9yXG5cblx0XHQjIEF0dGFjaCB0aGUgdXNlciBhbmQgdGhlaXIgSUQgdG8gdGhlIGNvbnRleHQgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG5cdFx0aWYgYXV0aD8udXNlclxuXHRcdFx0ZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXJcblx0XHRcdGVuZHBvaW50Q29udGV4dC51c2VySWQgPSBhdXRoLnVzZXIuX2lkXG5cdFx0XHR0cnVlXG5cdFx0ZWxzZSBmYWxzZVxuXG5cdCMjI1xuXHRcdEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG5cblx0XHRNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG5cblx0XHRAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuXHRcdFx0XHRcdFx0IGVuZHBvaW50XG5cdCMjI1xuXHRfc3BhY2VBY2NlcHRlZDogKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIC0+XG5cdFx0aWYgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZFxuXHRcdFx0YXV0aCA9IEBhcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpXG5cdFx0XHRpZiBhdXRoPy5zcGFjZUlkXG5cdFx0XHRcdHNwYWNlX3VzZXJzX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogYXV0aC51c2VySWQsIHNwYWNlOmF1dGguc3BhY2VJZH0pLmNvdW50KClcblx0XHRcdFx0aWYgc3BhY2VfdXNlcnNfY291bnRcblx0XHRcdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKGF1dGguc3BhY2VJZClcblx0XHRcdFx0XHQjIHNwYWNlIG11c3QgYmUgcGFpZCwgYW5kIHVzZXIgbXVzdCBiZSBhZG1pbnNcblx0XHRcdFx0XHRpZiBzcGFjZSAmJiBfLmluZGV4T2Yoc3BhY2UuYWRtaW5zLCBhdXRoLnVzZXJJZCk+PTBcblx0XHRcdFx0XHRcdGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0ZW5kcG9pbnRDb250ZXh0LnNwYWNlSWQgPSBcImJhZFwiXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdCMjI1xuXHRcdEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG5cblx0XHRNdXN0IGJlIGNhbGxlZCBhZnRlciBfYXV0aEFjY2VwdGVkKCkuXG5cblx0XHRAcmV0dXJucyBUcnVlIGlmIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgYmVsb25ncyB0byA8aT5hbnk8L2k+IG9mIHRoZSBhY2NlcHRhYmxlIHJvbGVzIG9uIHRoZVxuXHRcdFx0XHRcdFx0IGVuZHBvaW50XG5cdCMjI1xuXHRfcm9sZUFjY2VwdGVkOiAoZW5kcG9pbnRDb250ZXh0LCBlbmRwb2ludCkgLT5cblx0XHRpZiBlbmRwb2ludC5yb2xlUmVxdWlyZWRcblx0XHRcdGlmIF8uaXNFbXB0eSBfLmludGVyc2VjdGlvbihlbmRwb2ludC5yb2xlUmVxdWlyZWQsIGVuZHBvaW50Q29udGV4dC51c2VyLnJvbGVzKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHR0cnVlXG5cblxuXHQjIyNcblx0XHRSZXNwb25kIHRvIGFuIEhUVFAgcmVxdWVzdFxuXHQjIyNcblx0X3Jlc3BvbmQ6IChyZXNwb25zZSwgYm9keSwgc3RhdHVzQ29kZT0yMDAsIGhlYWRlcnM9e30pIC0+XG5cdFx0IyBPdmVycmlkZSBhbnkgZGVmYXVsdCBoZWFkZXJzIHRoYXQgaGF2ZSBiZWVuIHByb3ZpZGVkIChrZXlzIGFyZSBub3JtYWxpemVkIHRvIGJlIGNhc2UgaW5zZW5zaXRpdmUpXG5cdFx0IyBUT0RPOiBDb25zaWRlciBvbmx5IGxvd2VyY2FzaW5nIHRoZSBoZWFkZXIga2V5cyB3ZSBuZWVkIG5vcm1hbGl6ZWQsIGxpa2UgQ29udGVudC1UeXBlXG5cdFx0ZGVmYXVsdEhlYWRlcnMgPSBAX2xvd2VyQ2FzZUtleXMgQGFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzXG5cdFx0aGVhZGVycyA9IEBfbG93ZXJDYXNlS2V5cyBoZWFkZXJzXG5cdFx0aGVhZGVycyA9IF8uZXh0ZW5kIGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzXG5cblx0XHQjIFByZXBhcmUgSlNPTiBib2R5IGZvciByZXNwb25zZSB3aGVuIENvbnRlbnQtVHlwZSBpbmRpY2F0ZXMgSlNPTiB0eXBlXG5cdFx0aWYgaGVhZGVyc1snY29udGVudC10eXBlJ10ubWF0Y2goL2pzb258amF2YXNjcmlwdC8pIGlzbnQgbnVsbFxuXHRcdFx0aWYgQGFwaS5fY29uZmlnLnByZXR0eUpzb25cblx0XHRcdFx0Ym9keSA9IEpTT04uc3RyaW5naWZ5IGJvZHksIHVuZGVmaW5lZCwgMlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRib2R5ID0gSlNPTi5zdHJpbmdpZnkgYm9keVxuXG5cdFx0IyBTZW5kIHJlc3BvbnNlXG5cdFx0c2VuZFJlc3BvbnNlID0gLT5cblx0XHRcdHJlc3BvbnNlLndyaXRlSGVhZCBzdGF0dXNDb2RlLCBoZWFkZXJzXG5cdFx0XHRyZXNwb25zZS53cml0ZSBib2R5XG5cdFx0XHRyZXNwb25zZS5lbmQoKVxuXHRcdGlmIHN0YXR1c0NvZGUgaW4gWzQwMSwgNDAzXVxuXHRcdFx0IyBIYWNrZXJzIGNhbiBtZWFzdXJlIHRoZSByZXNwb25zZSB0aW1lIHRvIGRldGVybWluZSB0aGluZ3MgbGlrZSB3aGV0aGVyIHRoZSA0MDEgcmVzcG9uc2Ugd2FzXG5cdFx0XHQjIGNhdXNlZCBieSBiYWQgdXNlciBpZCB2cyBiYWQgcGFzc3dvcmQuXG5cdFx0XHQjIEluIGRvaW5nIHNvLCB0aGV5IGNhbiBmaXJzdCBzY2FuIGZvciB2YWxpZCB1c2VyIGlkcyByZWdhcmRsZXNzIG9mIHZhbGlkIHBhc3N3b3Jkcy5cblx0XHRcdCMgRGVsYXkgYnkgYSByYW5kb20gYW1vdW50IHRvIHJlZHVjZSB0aGUgYWJpbGl0eSBmb3IgYSBoYWNrZXIgdG8gZGV0ZXJtaW5lIHRoZSByZXNwb25zZSB0aW1lLlxuXHRcdFx0IyBTZWUgaHR0cHM6Ly93d3cub3dhc3Aub3JnL2luZGV4LnBocC9CbG9ja2luZ19CcnV0ZV9Gb3JjZV9BdHRhY2tzI0ZpbmRpbmdfT3RoZXJfQ291bnRlcm1lYXN1cmVzXG5cdFx0XHQjIFNlZSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9UaW1pbmdfYXR0YWNrXG5cdFx0XHRtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcyA9IDUwMFxuXHRcdFx0cmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28gPSAxICsgTWF0aC5yYW5kb20oKVxuXHRcdFx0ZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd29cblx0XHRcdE1ldGVvci5zZXRUaW1lb3V0IHNlbmRSZXNwb25zZSwgZGVsYXlJbk1pbGxpc2Vjb25kc1xuXHRcdGVsc2Vcblx0XHRcdHNlbmRSZXNwb25zZSgpXG5cblx0IyMjXG5cdFx0UmV0dXJuIHRoZSBvYmplY3Qgd2l0aCBhbGwgb2YgdGhlIGtleXMgY29udmVydGVkIHRvIGxvd2VyY2FzZVxuXHQjIyNcblx0X2xvd2VyQ2FzZUtleXM6IChvYmplY3QpIC0+XG5cdFx0Xy5jaGFpbiBvYmplY3Rcblx0XHQucGFpcnMoKVxuXHRcdC5tYXAgKGF0dHIpIC0+XG5cdFx0XHRbYXR0clswXS50b0xvd2VyQ2FzZSgpLCBhdHRyWzFdXVxuXHRcdC5vYmplY3QoKVxuXHRcdC52YWx1ZSgpXG4iLCJzaGFyZS5Sb3V0ZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUm91dGUoYXBpLCBwYXRoLCBvcHRpb25zLCBlbmRwb2ludHMxKSB7XG4gICAgdGhpcy5hcGkgPSBhcGk7XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuZW5kcG9pbnRzID0gZW5kcG9pbnRzMTtcbiAgICBpZiAoIXRoaXMuZW5kcG9pbnRzKSB7XG4gICAgICB0aGlzLmVuZHBvaW50cyA9IHRoaXMub3B0aW9ucztcbiAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIFJvdXRlLnByb3RvdHlwZS5hZGRUb0FwaSA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgYXZhaWxhYmxlTWV0aG9kcztcbiAgICBhdmFpbGFibGVNZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnZGVsZXRlJywgJ29wdGlvbnMnXTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWxsb3dlZE1ldGhvZHMsIGZ1bGxQYXRoLCByZWplY3RlZE1ldGhvZHMsIHNlbGY7XG4gICAgICBzZWxmID0gdGhpcztcbiAgICAgIGlmIChfLmNvbnRhaW5zKHRoaXMuYXBpLl9jb25maWcucGF0aHMsIHRoaXMucGF0aCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGFkZCBhIHJvdXRlIGF0IGFuIGV4aXN0aW5nIHBhdGg6IFwiICsgdGhpcy5wYXRoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW5kcG9pbnRzID0gXy5leHRlbmQoe1xuICAgICAgICBvcHRpb25zOiB0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcbiAgICAgIH0sIHRoaXMuZW5kcG9pbnRzKTtcbiAgICAgIHRoaXMuX3Jlc29sdmVFbmRwb2ludHMoKTtcbiAgICAgIHRoaXMuX2NvbmZpZ3VyZUVuZHBvaW50cygpO1xuICAgICAgdGhpcy5hcGkuX2NvbmZpZy5wYXRocy5wdXNoKHRoaXMucGF0aCk7XG4gICAgICBhbGxvd2VkTWV0aG9kcyA9IF8uZmlsdGVyKGF2YWlsYWJsZU1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gXy5jb250YWlucyhfLmtleXMoc2VsZi5lbmRwb2ludHMpLCBtZXRob2QpO1xuICAgICAgfSk7XG4gICAgICByZWplY3RlZE1ldGhvZHMgPSBfLnJlamVjdChhdmFpbGFibGVNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoXy5rZXlzKHNlbGYuZW5kcG9pbnRzKSwgbWV0aG9kKTtcbiAgICAgIH0pO1xuICAgICAgZnVsbFBhdGggPSB0aGlzLmFwaS5fY29uZmlnLmFwaVBhdGggKyB0aGlzLnBhdGg7XG4gICAgICBfLmVhY2goYWxsb3dlZE1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICB2YXIgZW5kcG9pbnQ7XG4gICAgICAgIGVuZHBvaW50ID0gc2VsZi5lbmRwb2ludHNbbWV0aG9kXTtcbiAgICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKG1ldGhvZCwgZnVsbFBhdGgsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICAgICAgdmFyIGRvbmVGdW5jLCBlbmRwb2ludENvbnRleHQsIGVycm9yLCByZXNwb25zZURhdGEsIHJlc3BvbnNlSW5pdGlhdGVkO1xuICAgICAgICAgIHJlc3BvbnNlSW5pdGlhdGVkID0gZmFsc2U7XG4gICAgICAgICAgZG9uZUZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZUluaXRpYXRlZCA9IHRydWU7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBlbmRwb2ludENvbnRleHQgPSB7XG4gICAgICAgICAgICB1cmxQYXJhbXM6IHJlcS5wYXJhbXMsXG4gICAgICAgICAgICBxdWVyeVBhcmFtczogcmVxLnF1ZXJ5LFxuICAgICAgICAgICAgYm9keVBhcmFtczogcmVxLmJvZHksXG4gICAgICAgICAgICByZXF1ZXN0OiByZXEsXG4gICAgICAgICAgICByZXNwb25zZTogcmVzLFxuICAgICAgICAgICAgZG9uZTogZG9uZUZ1bmNcbiAgICAgICAgICB9O1xuICAgICAgICAgIF8uZXh0ZW5kKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpO1xuICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IG51bGw7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHNlbGYuX2NhbGxFbmRwb2ludChlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgICAgICAgaXJvblJvdXRlclNlbmRFcnJvclRvUmVzcG9uc2UoZXJyb3IsIHJlcSwgcmVzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3BvbnNlSW5pdGlhdGVkKSB7XG4gICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChyZXMuaGVhZGVyc1NlbnQpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBjYWxsIHRoaXMuZG9uZSgpIGFmdGVyIGhhbmRsaW5nIGVuZHBvaW50IHJlc3BvbnNlIG1hbnVhbGx5OiBcIiArIG1ldGhvZCArIFwiIFwiICsgZnVsbFBhdGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZURhdGEgPT09IG51bGwgfHwgcmVzcG9uc2VEYXRhID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJldHVybiBudWxsIG9yIHVuZGVmaW5lZCBmcm9tIGFuIGVuZHBvaW50OiBcIiArIG1ldGhvZCArIFwiIFwiICsgZnVsbFBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzcG9uc2VEYXRhLmJvZHkgJiYgKHJlc3BvbnNlRGF0YS5zdGF0dXNDb2RlIHx8IHJlc3BvbnNlRGF0YS5oZWFkZXJzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEuYm9keSwgcmVzcG9uc2VEYXRhLnN0YXR1c0NvZGUsIHJlc3BvbnNlRGF0YS5oZWFkZXJzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2gocmVqZWN0ZWRNZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKG1ldGhvZCwgZnVsbFBhdGgsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICAgICAgdmFyIGhlYWRlcnMsIHJlc3BvbnNlRGF0YTtcbiAgICAgICAgICByZXNwb25zZURhdGEgPSB7XG4gICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnQVBJIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgIH07XG4gICAgICAgICAgaGVhZGVycyA9IHtcbiAgICAgICAgICAgICdBbGxvdyc6IGFsbG93ZWRNZXRob2RzLmpvaW4oJywgJykudG9VcHBlckNhc2UoKVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIHNlbGYuX3Jlc3BvbmQocmVzLCByZXNwb25zZURhdGEsIDQwNSwgaGVhZGVycyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSkoKTtcblxuXG4gIC8qXG4gIFx0XHRDb252ZXJ0IGFsbCBlbmRwb2ludHMgb24gdGhlIGdpdmVuIHJvdXRlIGludG8gb3VyIGV4cGVjdGVkIGVuZHBvaW50IG9iamVjdCBpZiBpdCBpcyBhIGJhcmVcbiAgXHRcdGZ1bmN0aW9uXG4gIFxuICBcdFx0QHBhcmFtIHtSb3V0ZX0gcm91dGUgVGhlIHJvdXRlIHRoZSBlbmRwb2ludHMgYmVsb25nIHRvXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzb2x2ZUVuZHBvaW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIF8uZWFjaCh0aGlzLmVuZHBvaW50cywgZnVuY3Rpb24oZW5kcG9pbnQsIG1ldGhvZCwgZW5kcG9pbnRzKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKGVuZHBvaW50KSkge1xuICAgICAgICByZXR1cm4gZW5kcG9pbnRzW21ldGhvZF0gPSB7XG4gICAgICAgICAgYWN0aW9uOiBlbmRwb2ludFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdENvbmZpZ3VyZSB0aGUgYXV0aGVudGljYXRpb24gYW5kIHJvbGUgcmVxdWlyZW1lbnQgb24gYWxsIGVuZHBvaW50cyAoZXhjZXB0IE9QVElPTlMsIHdoaWNoIG11c3RcbiAgXHRcdGJlIGNvbmZpZ3VyZWQgZGlyZWN0bHkgb24gdGhlIGVuZHBvaW50KVxuICBcbiAgXHRcdEF1dGhlbnRpY2F0aW9uIGNhbiBiZSByZXF1aXJlZCBvbiBhbiBlbnRpcmUgcm91dGUgb3IgaW5kaXZpZHVhbCBlbmRwb2ludHMuIElmIHJlcXVpcmVkIG9uIGFuXG4gIFx0XHRlbnRpcmUgcm91dGUsIHRoYXQgc2VydmVzIGFzIHRoZSBkZWZhdWx0LiBJZiByZXF1aXJlZCBpbiBhbnkgaW5kaXZpZHVhbCBlbmRwb2ludHMsIHRoYXQgd2lsbFxuICBcdFx0b3ZlcnJpZGUgdGhlIGRlZmF1bHQuXG4gIFxuICBcdFx0QWZ0ZXIgdGhlIGVuZHBvaW50IGlzIGNvbmZpZ3VyZWQsIGFsbCBhdXRoZW50aWNhdGlvbiBhbmQgcm9sZSByZXF1aXJlbWVudHMgb2YgYW4gZW5kcG9pbnQgY2FuIGJlXG4gIFx0XHRhY2Nlc3NlZCBhdCA8Y29kZT5lbmRwb2ludC5hdXRoUmVxdWlyZWQ8L2NvZGU+IGFuZCA8Y29kZT5lbmRwb2ludC5yb2xlUmVxdWlyZWQ8L2NvZGU+LFxuICBcdFx0cmVzcGVjdGl2ZWx5LlxuICBcbiAgXHRcdEBwYXJhbSB7Um91dGV9IHJvdXRlIFRoZSByb3V0ZSB0aGUgZW5kcG9pbnRzIGJlbG9uZyB0b1xuICBcdFx0QHBhcmFtIHtFbmRwb2ludH0gZW5kcG9pbnQgVGhlIGVuZHBvaW50IHRvIGNvbmZpZ3VyZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2NvbmZpZ3VyZUVuZHBvaW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIF8uZWFjaCh0aGlzLmVuZHBvaW50cywgZnVuY3Rpb24oZW5kcG9pbnQsIG1ldGhvZCkge1xuICAgICAgdmFyIHJlZiwgcmVmMSwgcmVmMjtcbiAgICAgIGlmIChtZXRob2QgIT09ICdvcHRpb25zJykge1xuICAgICAgICBpZiAoISgocmVmID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmLnJvbGVSZXF1aXJlZCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMucm9sZVJlcXVpcmVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbmRwb2ludC5yb2xlUmVxdWlyZWQpIHtcbiAgICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBlbmRwb2ludC5yb2xlUmVxdWlyZWQgPSBfLnVuaW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgdGhpcy5vcHRpb25zLnJvbGVSZXF1aXJlZCk7XG4gICAgICAgIGlmIChfLmlzRW1wdHkoZW5kcG9pbnQucm9sZVJlcXVpcmVkKSkge1xuICAgICAgICAgIGVuZHBvaW50LnJvbGVSZXF1aXJlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmRwb2ludC5hdXRoUmVxdWlyZWQgPT09IHZvaWQgMCkge1xuICAgICAgICAgIGlmICgoKHJlZjEgPSB0aGlzLm9wdGlvbnMpICE9IG51bGwgPyByZWYxLmF1dGhSZXF1aXJlZCA6IHZvaWQgMCkgfHwgZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmRwb2ludC5hdXRoUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChyZWYyID0gdGhpcy5vcHRpb25zKSAhPSBudWxsID8gcmVmMi5zcGFjZVJlcXVpcmVkIDogdm9pZCAwKSB7XG4gICAgICAgICAgZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCA9IHRoaXMub3B0aW9ucy5zcGFjZVJlcXVpcmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH07XG5cblxuICAvKlxuICBcdFx0QXV0aGVudGljYXRlIGFuIGVuZHBvaW50IGlmIHJlcXVpcmVkLCBhbmQgcmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdFxuICBcbiAgXHRcdEByZXR1cm5zIFRoZSBlbmRwb2ludCByZXNwb25zZSBvciBhIDQwMSBpZiBhdXRoZW50aWNhdGlvbiBmYWlsc1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX2NhbGxFbmRwb2ludCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICB2YXIgaW52b2NhdGlvbjtcbiAgICBpZiAodGhpcy5fYXV0aEFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICBpZiAodGhpcy5fcm9sZUFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICAgIGlmICh0aGlzLl9zcGFjZUFjY2VwdGVkKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpKSB7XG4gICAgICAgICAgaW52b2NhdGlvbiA9IG5ldyBERFBDb21tb24uTWV0aG9kSW52b2NhdGlvbih7XG4gICAgICAgICAgICBpc1NpbXVsYXRpb246IHRydWUsXG4gICAgICAgICAgICB1c2VySWQ6IGVuZHBvaW50Q29udGV4dC51c2VySWQsXG4gICAgICAgICAgICBjb25uZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgcmFuZG9tU2VlZDogRERQQ29tbW9uLm1ha2VScGNTZWVkKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gRERQLl9DdXJyZW50SW52b2NhdGlvbi53aXRoVmFsdWUoaW52b2NhdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZW5kcG9pbnQuYWN0aW9uLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAzLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdCYWQgWC1TcGFjZS1JZCwgT25seSBhZG1pbnMgb2YgcGFpZCBzcGFjZSBjYW4gY2FsbCB0aGlzIGFwaS4nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiA0MDMsXG4gICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRvIHRoaXMuJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzQ29kZTogNDAxLFxuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgc3RhdHVzOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gZG8gdGhpcy4nXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgXHRcdEF1dGhlbnRpY2F0ZSB0aGUgZ2l2ZW4gZW5kcG9pbnQgaWYgcmVxdWlyZWRcbiAgXG4gIFx0XHRPbmNlIGl0J3MgZ2xvYmFsbHkgY29uZmlndXJlZCBpbiB0aGUgQVBJLCBhdXRoZW50aWNhdGlvbiBjYW4gYmUgcmVxdWlyZWQgb24gYW4gZW50aXJlIHJvdXRlIG9yXG4gIFx0XHRpbmRpdmlkdWFsIGVuZHBvaW50cy4gSWYgcmVxdWlyZWQgb24gYW4gZW50aXJlIGVuZHBvaW50LCB0aGF0IHNlcnZlcyBhcyB0aGUgZGVmYXVsdC4gSWYgcmVxdWlyZWRcbiAgXHRcdGluIGFueSBpbmRpdmlkdWFsIGVuZHBvaW50cywgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0LlxuICBcbiAgXHRcdEByZXR1cm5zIEZhbHNlIGlmIGF1dGhlbnRpY2F0aW9uIGZhaWxzLCBhbmQgdHJ1ZSBvdGhlcndpc2VcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLl9hdXRoQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgaWYgKGVuZHBvaW50LmF1dGhSZXF1aXJlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2F1dGhlbnRpY2F0ZShlbmRwb2ludENvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cblxuICAvKlxuICBcdFx0VmVyaWZ5IHRoZSByZXF1ZXN0IGlzIGJlaW5nIG1hZGUgYnkgYW4gYWN0aXZlbHkgbG9nZ2VkIGluIHVzZXJcbiAgXG4gIFx0XHRJZiB2ZXJpZmllZCwgYXR0YWNoIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgdG8gdGhlIGNvbnRleHQuXG4gIFxuICBcdFx0QHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fYXV0aGVudGljYXRlID0gZnVuY3Rpb24oZW5kcG9pbnRDb250ZXh0KSB7XG4gICAgdmFyIGF1dGgsIHVzZXJTZWxlY3RvcjtcbiAgICBhdXRoID0gdGhpcy5hcGkuX2NvbmZpZy5hdXRoLnVzZXIuY2FsbChlbmRwb2ludENvbnRleHQpO1xuICAgIGlmICgoYXV0aCAhPSBudWxsID8gYXV0aC51c2VySWQgOiB2b2lkIDApICYmIChhdXRoICE9IG51bGwgPyBhdXRoLnRva2VuIDogdm9pZCAwKSAmJiAhKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkpIHtcbiAgICAgIHVzZXJTZWxlY3RvciA9IHt9O1xuICAgICAgdXNlclNlbGVjdG9yLl9pZCA9IGF1dGgudXNlcklkO1xuICAgICAgdXNlclNlbGVjdG9yW3RoaXMuYXBpLl9jb25maWcuYXV0aC50b2tlbl0gPSBhdXRoLnRva2VuO1xuICAgICAgYXV0aC51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUodXNlclNlbGVjdG9yKTtcbiAgICB9XG4gICAgaWYgKGF1dGggIT0gbnVsbCA/IGF1dGgudXNlciA6IHZvaWQgMCkge1xuICAgICAgZW5kcG9pbnRDb250ZXh0LnVzZXIgPSBhdXRoLnVzZXI7XG4gICAgICBlbmRwb2ludENvbnRleHQudXNlcklkID0gYXV0aC51c2VyLl9pZDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgXHRcdEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICBcdFx0TXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gIFx0XHRcdFx0XHRcdCBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3NwYWNlQWNjZXB0ZWQgPSBmdW5jdGlvbihlbmRwb2ludENvbnRleHQsIGVuZHBvaW50KSB7XG4gICAgdmFyIGF1dGgsIHNwYWNlLCBzcGFjZV91c2Vyc19jb3VudDtcbiAgICBpZiAoZW5kcG9pbnQuc3BhY2VSZXF1aXJlZCkge1xuICAgICAgYXV0aCA9IHRoaXMuYXBpLl9jb25maWcuYXV0aC51c2VyLmNhbGwoZW5kcG9pbnRDb250ZXh0KTtcbiAgICAgIGlmIChhdXRoICE9IG51bGwgPyBhdXRoLnNwYWNlSWQgOiB2b2lkIDApIHtcbiAgICAgICAgc3BhY2VfdXNlcnNfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICB1c2VyOiBhdXRoLnVzZXJJZCxcbiAgICAgICAgICBzcGFjZTogYXV0aC5zcGFjZUlkXG4gICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgIGlmIChzcGFjZV91c2Vyc19jb3VudCkge1xuICAgICAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoYXV0aC5zcGFjZUlkKTtcbiAgICAgICAgICBpZiAoc3BhY2UgJiYgXy5pbmRleE9mKHNwYWNlLmFkbWlucywgYXV0aC51c2VySWQpID49IDApIHtcbiAgICAgICAgICAgIGVuZHBvaW50Q29udGV4dC5zcGFjZUlkID0gYXV0aC5zcGFjZUlkO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbmRwb2ludENvbnRleHQuc3BhY2VJZCA9IFwiYmFkXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdEF1dGhlbnRpY2F0ZSB0aGUgdXNlciByb2xlIGlmIHJlcXVpcmVkXG4gIFxuICBcdFx0TXVzdCBiZSBjYWxsZWQgYWZ0ZXIgX2F1dGhBY2NlcHRlZCgpLlxuICBcbiAgXHRcdEByZXR1cm5zIFRydWUgaWYgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBiZWxvbmdzIHRvIDxpPmFueTwvaT4gb2YgdGhlIGFjY2VwdGFibGUgcm9sZXMgb24gdGhlXG4gIFx0XHRcdFx0XHRcdCBlbmRwb2ludFxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUuX3JvbGVBY2NlcHRlZCA9IGZ1bmN0aW9uKGVuZHBvaW50Q29udGV4dCwgZW5kcG9pbnQpIHtcbiAgICBpZiAoZW5kcG9pbnQucm9sZVJlcXVpcmVkKSB7XG4gICAgICBpZiAoXy5pc0VtcHR5KF8uaW50ZXJzZWN0aW9uKGVuZHBvaW50LnJvbGVSZXF1aXJlZCwgZW5kcG9pbnRDb250ZXh0LnVzZXIucm9sZXMpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLypcbiAgXHRcdFJlc3BvbmQgdG8gYW4gSFRUUCByZXF1ZXN0XG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fcmVzcG9uZCA9IGZ1bmN0aW9uKHJlc3BvbnNlLCBib2R5LCBzdGF0dXNDb2RlLCBoZWFkZXJzKSB7XG4gICAgdmFyIGRlZmF1bHRIZWFkZXJzLCBkZWxheUluTWlsbGlzZWNvbmRzLCBtaW5pbXVtRGVsYXlJbk1pbGxpc2Vjb25kcywgcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd28sIHNlbmRSZXNwb25zZTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PSBudWxsKSB7XG4gICAgICBzdGF0dXNDb2RlID0gMjAwO1xuICAgIH1cbiAgICBpZiAoaGVhZGVycyA9PSBudWxsKSB7XG4gICAgICBoZWFkZXJzID0ge307XG4gICAgfVxuICAgIGRlZmF1bHRIZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyh0aGlzLmFwaS5fY29uZmlnLmRlZmF1bHRIZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gdGhpcy5fbG93ZXJDYXNlS2V5cyhoZWFkZXJzKTtcbiAgICBoZWFkZXJzID0gXy5leHRlbmQoZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnMpO1xuICAgIGlmIChoZWFkZXJzWydjb250ZW50LXR5cGUnXS5tYXRjaCgvanNvbnxqYXZhc2NyaXB0LykgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmFwaS5fY29uZmlnLnByZXR0eUpzb24pIHtcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHksIHZvaWQgMCwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuICAgICAgcmVzcG9uc2Uud3JpdGUoYm9keSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZW5kKCk7XG4gICAgfTtcbiAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAxIHx8IHN0YXR1c0NvZGUgPT09IDQwMykge1xuICAgICAgbWluaW11bURlbGF5SW5NaWxsaXNlY29uZHMgPSA1MDA7XG4gICAgICByYW5kb21NdWx0aXBsaWVyQmV0d2Vlbk9uZUFuZFR3byA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgZGVsYXlJbk1pbGxpc2Vjb25kcyA9IG1pbmltdW1EZWxheUluTWlsbGlzZWNvbmRzICogcmFuZG9tTXVsdGlwbGllckJldHdlZW5PbmVBbmRUd287XG4gICAgICByZXR1cm4gTWV0ZW9yLnNldFRpbWVvdXQoc2VuZFJlc3BvbnNlLCBkZWxheUluTWlsbGlzZWNvbmRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSgpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRSZXR1cm4gdGhlIG9iamVjdCB3aXRoIGFsbCBvZiB0aGUga2V5cyBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5fbG93ZXJDYXNlS2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBfLmNoYWluKG9iamVjdCkucGFpcnMoKS5tYXAoZnVuY3Rpb24oYXR0cikge1xuICAgICAgcmV0dXJuIFthdHRyWzBdLnRvTG93ZXJDYXNlKCksIGF0dHJbMV1dO1xuICAgIH0pLm9iamVjdCgpLnZhbHVlKCk7XG4gIH07XG5cbiAgcmV0dXJuIFJvdXRlO1xuXG59KSgpO1xuIiwiYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblxuY2xhc3MgQE9kYXRhUmVzdGl2dXNcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG5cdFx0QF9yb3V0ZXMgPSBbXVxuXHRcdEBfY29uZmlnID1cblx0XHRcdHBhdGhzOiBbXVxuXHRcdFx0dXNlRGVmYXVsdEF1dGg6IGZhbHNlXG5cdFx0XHRhcGlQYXRoOiAnYXBpLydcblx0XHRcdHZlcnNpb246IG51bGxcblx0XHRcdHByZXR0eUpzb246IGZhbHNlXG5cdFx0XHRhdXRoOlxuXHRcdFx0XHR0b2tlbjogJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbidcblx0XHRcdFx0dXNlcjogLT5cblx0XHRcdFx0XHRjb29raWVzID0gbmV3IENvb2tpZXMoIEByZXF1ZXN0LCBAcmVzcG9uc2UgKVxuXHRcdFx0XHRcdHVzZXJJZCA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdFx0XHRcdFx0YXV0aFRva2VuID0gQHJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblx0XHRcdFx0XHRzcGFjZUlkID0gQHJlcXVlc3QuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IEB1cmxQYXJhbXNbJ3NwYWNlSWQnXVxuXHRcdFx0XHRcdGlmIGF1dGhUb2tlblxuXHRcdFx0XHRcdFx0dG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gYXV0aFRva2VuXG5cdFx0XHRcdFx0aWYgQHJlcXVlc3QudXNlcklkXG5cdFx0XHRcdFx0XHRfdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogQHJlcXVlc3QudXNlcklkfSlcblx0XHRcdFx0XHRcdHVzZXI6IF91c2VyXG5cdFx0XHRcdFx0XHR1c2VySWQ6IHVzZXJJZFxuXHRcdFx0XHRcdFx0c3BhY2VJZDogc3BhY2VJZFxuXHRcdFx0XHRcdFx0dG9rZW46IHRva2VuXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0dXNlcklkOiB1c2VySWRcblx0XHRcdFx0XHRcdHNwYWNlSWQ6IHNwYWNlSWRcblx0XHRcdFx0XHRcdHRva2VuOiB0b2tlblxuXHRcdFx0ZGVmYXVsdEhlYWRlcnM6XG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0XHRcdGVuYWJsZUNvcnM6IHRydWVcblxuXHRcdCMgQ29uZmlndXJlIEFQSSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXG5cdFx0Xy5leHRlbmQgQF9jb25maWcsIG9wdGlvbnNcblxuXHRcdGlmIEBfY29uZmlnLmVuYWJsZUNvcnNcblx0XHRcdGNvcnNIZWFkZXJzID1cblx0XHRcdFx0J0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xuXHRcdFx0XHQnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0LCBPRGF0YS1WZXJzaW9uJ1xuXG5cdFx0XHRpZiBAX2NvbmZpZy51c2VEZWZhdWx0QXV0aFxuXHRcdFx0XHRjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuLCBYLVNwYWNlLUlkJ1xuXG5cdFx0XHQjIFNldCBkZWZhdWx0IGhlYWRlciB0byBlbmFibGUgQ09SUyBpZiBjb25maWd1cmVkXG5cdFx0XHRfLmV4dGVuZCBAX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnNcblxuXHRcdFx0aWYgbm90IEBfY29uZmlnLmRlZmF1bHRPcHRpb25zRW5kcG9pbnRcblx0XHRcdFx0QF9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IC0+XG5cdFx0XHRcdFx0QHJlc3BvbnNlLndyaXRlSGVhZCAyMDAsIGNvcnNIZWFkZXJzXG5cdFx0XHRcdFx0QGRvbmUoKVxuXG5cdFx0IyBOb3JtYWxpemUgdGhlIEFQSSBwYXRoXG5cdFx0aWYgQF9jb25maWcuYXBpUGF0aFswXSBpcyAnLydcblx0XHRcdEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoLnNsaWNlIDFcblx0XHRpZiBfLmxhc3QoQF9jb25maWcuYXBpUGF0aCkgaXNudCAnLydcblx0XHRcdEBfY29uZmlnLmFwaVBhdGggPSBAX2NvbmZpZy5hcGlQYXRoICsgJy8nXG5cblx0XHQjIFVSTCBwYXRoIHZlcnNpb25pbmcgaXMgdGhlIG9ubHkgdHlwZSBvZiBBUEkgdmVyc2lvbmluZyBjdXJyZW50bHkgYXZhaWxhYmxlLCBzbyBpZiBhIHZlcnNpb24gaXNcblx0XHQjIHByb3ZpZGVkLCBhcHBlbmQgaXQgdG8gdGhlIGJhc2UgcGF0aCBvZiB0aGUgQVBJXG5cdFx0aWYgQF9jb25maWcudmVyc2lvblxuXHRcdFx0QF9jb25maWcuYXBpUGF0aCArPSBAX2NvbmZpZy52ZXJzaW9uICsgJy8nXG5cblx0XHQjIEFkZCBkZWZhdWx0IGxvZ2luIGFuZCBsb2dvdXQgZW5kcG9pbnRzIGlmIGF1dGggaXMgY29uZmlndXJlZFxuXHRcdGlmIEBfY29uZmlnLnVzZURlZmF1bHRBdXRoXG5cdFx0XHRAX2luaXRBdXRoKClcblx0XHRlbHNlIGlmIEBfY29uZmlnLnVzZUF1dGhcblx0XHRcdEBfaW5pdEF1dGgoKVxuXHRcdFx0Y29uc29sZS53YXJuICdXYXJuaW5nOiB1c2VBdXRoIEFQSSBjb25maWcgb3B0aW9uIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wICcgK1xuXHRcdFx0XHRcdCdcXG4gICAgVXNlIHRoZSB1c2VEZWZhdWx0QXV0aCBvcHRpb24gaW5zdGVhZCdcblxuXHRcdHJldHVybiB0aGlzXG5cblxuXHQjIyMqXG5cdFx0QWRkIGVuZHBvaW50cyBmb3IgdGhlIGdpdmVuIEhUVFAgbWV0aG9kcyBhdCB0aGUgZ2l2ZW4gcGF0aFxuXG5cdFx0QHBhcmFtIHBhdGgge1N0cmluZ30gVGhlIGV4dGVuZGVkIFVSTCBwYXRoICh3aWxsIGJlIGFwcGVuZGVkIHRvIGJhc2UgcGF0aCBvZiB0aGUgQVBJKVxuXHRcdEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IFJvdXRlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuXHRcdEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcblx0XHRAcGFyYW0gb3B0aW9ucy5yb2xlUmVxdWlyZWQge1N0cmluZyBvciBTdHJpbmdbXX0gVGhlIGRlZmF1bHQgcm9sZSByZXF1aXJlZCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcblx0XHRAcGFyYW0gZW5kcG9pbnRzIHtPYmplY3R9IEEgc2V0IG9mIGVuZHBvaW50cyBhdmFpbGFibGUgb24gdGhlIG5ldyByb3V0ZSAoZ2V0LCBwb3N0LCBwdXQsIHBhdGNoLCBkZWxldGUsIG9wdGlvbnMpXG5cdFx0QHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuXHRcdFx0XHRjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbmRwb2ludC4gT3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGFuIGBhY3Rpb25gXG5cdFx0XHRcdGFuZCBhbGwgb3RoZXIgcm91dGUgY29uZmlnIG9wdGlvbnMgYXZhaWxhYmxlLiBBbiBgYWN0aW9uYCBtdXN0IGJlIHByb3ZpZGVkIHdpdGggdGhlIG9iamVjdC5cblx0IyMjXG5cdGFkZFJvdXRlOiAocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSAtPlxuXHRcdCMgQ3JlYXRlIGEgbmV3IHJvdXRlIGFuZCBhZGQgaXQgdG8gb3VyIGxpc3Qgb2YgZXhpc3Rpbmcgcm91dGVzXG5cdFx0cm91dGUgPSBuZXcgc2hhcmUuUm91dGUodGhpcywgcGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKVxuXHRcdEBfcm91dGVzLnB1c2gocm91dGUpXG5cblx0XHRyb3V0ZS5hZGRUb0FwaSgpXG5cblx0XHRyZXR1cm4gdGhpc1xuXG5cblx0IyMjKlxuXHRcdEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcblx0IyMjXG5cdGFkZENvbGxlY3Rpb246IChjb2xsZWN0aW9uLCBvcHRpb25zPXt9KSAtPlxuXHRcdG1ldGhvZHMgPSBbJ2dldCcsICdwb3N0JywgJ3B1dCcsICdkZWxldGUnLCAnZ2V0QWxsJ11cblx0XHRtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddXG5cblx0XHQjIEdyYWIgdGhlIHNldCBvZiBlbmRwb2ludHNcblx0XHRpZiBjb2xsZWN0aW9uIGlzIE1ldGVvci51c2Vyc1xuXHRcdFx0Y29sbGVjdGlvbkVuZHBvaW50cyA9IEBfdXNlckNvbGxlY3Rpb25FbmRwb2ludHNcblx0XHRlbHNlXG5cdFx0XHRjb2xsZWN0aW9uRW5kcG9pbnRzID0gQF9jb2xsZWN0aW9uRW5kcG9pbnRzXG5cblx0XHQjIEZsYXR0ZW4gdGhlIG9wdGlvbnMgYW5kIHNldCBkZWZhdWx0cyBpZiBuZWNlc3Nhcnlcblx0XHRlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24gPSBvcHRpb25zLmVuZHBvaW50cyBvciB7fVxuXHRcdHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIG9yIHt9XG5cdFx0ZXhjbHVkZWRFbmRwb2ludHMgPSBvcHRpb25zLmV4Y2x1ZGVkRW5kcG9pbnRzIG9yIFtdXG5cdFx0IyBVc2UgY29sbGVjdGlvbiBuYW1lIGFzIGRlZmF1bHQgcGF0aFxuXHRcdHBhdGggPSBvcHRpb25zLnBhdGggb3IgY29sbGVjdGlvbi5fbmFtZVxuXG5cdFx0IyBTZXBhcmF0ZSB0aGUgcmVxdWVzdGVkIGVuZHBvaW50cyBieSB0aGUgcm91dGUgdGhleSBiZWxvbmcgdG8gKG9uZSBmb3Igb3BlcmF0aW5nIG9uIHRoZSBlbnRpcmVcblx0XHQjIGNvbGxlY3Rpb24gYW5kIG9uZSBmb3Igb3BlcmF0aW5nIG9uIGEgc2luZ2xlIGVudGl0eSB3aXRoaW4gdGhlIGNvbGxlY3Rpb24pXG5cdFx0Y29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge31cblx0XHRlbnRpdHlSb3V0ZUVuZHBvaW50cyA9IHt9XG5cdFx0aWYgXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgYW5kIF8uaXNFbXB0eShleGNsdWRlZEVuZHBvaW50cylcblx0XHRcdCMgR2VuZXJhdGUgYWxsIGVuZHBvaW50cyBvbiB0aGlzIGNvbGxlY3Rpb25cblx0XHRcdF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHQjIFBhcnRpdGlvbiB0aGUgZW5kcG9pbnRzIGludG8gdGhlaXIgcmVzcGVjdGl2ZSByb3V0ZXNcblx0XHRcdFx0aWYgbWV0aG9kIGluIG1ldGhvZHNPbkNvbGxlY3Rpb25cblx0XHRcdFx0XHRfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG5cdFx0XHRcdGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0LCB0aGlzXG5cdFx0ZWxzZVxuXHRcdFx0IyBHZW5lcmF0ZSBhbnkgZW5kcG9pbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIGV4cGxpY2l0bHkgZXhjbHVkZWRcblx0XHRcdF8uZWFjaCBtZXRob2RzLCAobWV0aG9kKSAtPlxuXHRcdFx0XHRpZiBtZXRob2Qgbm90IGluIGV4Y2x1ZGVkRW5kcG9pbnRzIGFuZCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb25bbWV0aG9kXSBpc250IGZhbHNlXG5cdFx0XHRcdFx0IyBDb25maWd1cmUgZW5kcG9pbnQgYW5kIG1hcCB0byBpdCdzIGh0dHAgbWV0aG9kXG5cdFx0XHRcdFx0IyBUT0RPOiBDb25zaWRlciBwcmVkZWZpbmluZyBhIG1hcCBvZiBtZXRob2RzIHRvIHRoZWlyIGh0dHAgbWV0aG9kIHR5cGUgKGUuZy4sIGdldEFsbDogZ2V0KVxuXHRcdFx0XHRcdGVuZHBvaW50T3B0aW9ucyA9IGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvblttZXRob2RdXG5cdFx0XHRcdFx0Y29uZmlndXJlZEVuZHBvaW50ID0ge31cblx0XHRcdFx0XHRfLmVhY2ggY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbiksIChhY3Rpb24sIG1ldGhvZFR5cGUpIC0+XG5cdFx0XHRcdFx0XHRjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPVxuXHRcdFx0XHRcdFx0XHRfLmNoYWluIGFjdGlvblxuXHRcdFx0XHRcdFx0XHQuY2xvbmUoKVxuXHRcdFx0XHRcdFx0XHQuZXh0ZW5kIGVuZHBvaW50T3B0aW9uc1xuXHRcdFx0XHRcdFx0XHQudmFsdWUoKVxuXHRcdFx0XHRcdCMgUGFydGl0aW9uIHRoZSBlbmRwb2ludHMgaW50byB0aGVpciByZXNwZWN0aXZlIHJvdXRlc1xuXHRcdFx0XHRcdGlmIG1ldGhvZCBpbiBtZXRob2RzT25Db2xsZWN0aW9uXG5cdFx0XHRcdFx0XHRfLmV4dGVuZCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuXHRcdFx0XHRcdGVsc2UgXy5leHRlbmQgZW50aXR5Um91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludFxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0LCB0aGlzXG5cblx0XHQjIEFkZCB0aGUgcm91dGVzIHRvIHRoZSBBUElcblx0XHRAYWRkUm91dGUgcGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHNcblx0XHRAYWRkUm91dGUgXCIje3BhdGh9LzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzXG5cblx0XHRyZXR1cm4gdGhpc1xuXG5cblx0IyMjKlxuXHRcdEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgQ29sbGVjdGlvbiBSb3V0ZVxuXHQjIyNcblx0X2NvbGxlY3Rpb25FbmRwb2ludHM6XG5cdFx0Z2V0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdGdldDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdHNlbGVjdG9yID0ge19pZDogQHVybFBhcmFtcy5pZH1cblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRcdHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIHNlbGVjdG9yXG5cdFx0XHRcdFx0aWYgZW50aXR5XG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cblx0XHRwdXQ6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0cHV0OlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBzZWxlY3RvciwgJHNldDogQGJvZHlQYXJhbXNcblx0XHRcdFx0XHRpZiBlbnRpdHlJc1VwZGF0ZWRcblx0XHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkXG5cdFx0XHRcdFx0XHR7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cblx0XHRkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0ZGVsZXRlOlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSB7X2lkOiBAdXJsUGFyYW1zLmlkfVxuXHRcdFx0XHRcdGlmIHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRpZiBjb2xsZWN0aW9uLnJlbW92ZSBzZWxlY3RvclxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ31cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ31cblx0XHRwb3N0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdHBvc3Q6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRpZiB0aGlzLnNwYWNlSWRcblx0XHRcdFx0XHRcdEBib2R5UGFyYW1zLnNwYWNlID0gdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0ZW50aXR5SWQgPSBjb2xsZWN0aW9uLmluc2VydCBAYm9keVBhcmFtc1xuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBlbnRpdHlJZFxuXHRcdFx0XHRcdGlmIGVudGl0eVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogMjAxXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnfVxuXHRcdGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRnZXQ6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRzZWxlY3RvciA9IHt9XG5cdFx0XHRcdFx0aWYgdGhpcy5zcGFjZUlkXG5cdFx0XHRcdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZFxuXHRcdFx0XHRcdGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpXG5cdFx0XHRcdFx0aWYgZW50aXRpZXNcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgaXRlbXMgZnJvbSBjb2xsZWN0aW9uJ31cblxuXG5cdCMjIypcblx0XHRBIHNldCBvZiBlbmRwb2ludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIE1ldGVvci51c2VycyBDb2xsZWN0aW9uIFJvdXRlXG5cdCMjI1xuXHRfdXNlckNvbGxlY3Rpb25FbmRwb2ludHM6XG5cdFx0Z2V0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdGdldDpcblx0XHRcdFx0YWN0aW9uOiAtPlxuXHRcdFx0XHRcdGVudGl0eSA9IGNvbGxlY3Rpb24uZmluZE9uZSBAdXJsUGFyYW1zLmlkLCBmaWVsZHM6IHByb2ZpbGU6IDFcblx0XHRcdFx0XHRpZiBlbnRpdHlcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXR5fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0YXR1c0NvZGU6IDQwNFxuXHRcdFx0XHRcdFx0Ym9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQnfVxuXHRcdHB1dDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRwdXQ6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSBAdXJsUGFyYW1zLmlkLCAkc2V0OiBwcm9maWxlOiBAYm9keVBhcmFtc1xuXHRcdFx0XHRcdGlmIGVudGl0eUlzVXBkYXRlZFxuXHRcdFx0XHRcdFx0ZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lIEB1cmxQYXJhbXMuaWQsIGZpZWxkczogcHJvZmlsZTogMVxuXHRcdFx0XHRcdFx0e3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cblx0XHRkZWxldGU6IChjb2xsZWN0aW9uKSAtPlxuXHRcdFx0ZGVsZXRlOlxuXHRcdFx0XHRhY3Rpb246IC0+XG5cdFx0XHRcdFx0aWYgY29sbGVjdGlvbi5yZW1vdmUgQHVybFBhcmFtcy5pZFxuXHRcdFx0XHRcdFx0e3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiBtZXNzYWdlOiAnVXNlciByZW1vdmVkJ31cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDRcblx0XHRcdFx0XHRcdGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ31cblx0XHRwb3N0OiAoY29sbGVjdGlvbikgLT5cblx0XHRcdHBvc3Q6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHQjIENyZWF0ZSBhIG5ldyB1c2VyIGFjY291bnRcblx0XHRcdFx0XHRlbnRpdHlJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIgQGJvZHlQYXJhbXNcblx0XHRcdFx0XHRlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUgZW50aXR5SWQsIGZpZWxkczogcHJvZmlsZTogMVxuXHRcdFx0XHRcdGlmIGVudGl0eVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogMjAxXG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGVudGl0eX1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiA0MDBcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnfVxuXHRcdGdldEFsbDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0XHRnZXQ6XG5cdFx0XHRcdGFjdGlvbjogLT5cblx0XHRcdFx0XHRlbnRpdGllcyA9IGNvbGxlY3Rpb24uZmluZCh7fSwgZmllbGRzOiBwcm9maWxlOiAxKS5mZXRjaCgpXG5cdFx0XHRcdFx0aWYgZW50aXRpZXNcblx0XHRcdFx0XHRcdHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YTogZW50aXRpZXN9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RhdHVzQ29kZTogNDA0XG5cdFx0XHRcdFx0XHRib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6ICdVbmFibGUgdG8gcmV0cmlldmUgdXNlcnMnfVxuXG5cblx0IyMjXG5cdFx0QWRkIC9sb2dpbiBhbmQgL2xvZ291dCBlbmRwb2ludHMgdG8gdGhlIEFQSVxuXHQjIyNcblx0X2luaXRBdXRoOiAtPlxuXHRcdHNlbGYgPSB0aGlzXG5cdFx0IyMjXG5cdFx0XHRBZGQgYSBsb2dpbiBlbmRwb2ludCB0byB0aGUgQVBJXG5cblx0XHRcdEFmdGVyIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiwgdGhlIG9uTG9nZ2VkSW4gaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG5cdFx0XHRhZGRpbmcgaG9vaykuXG5cdFx0IyMjXG5cdFx0QGFkZFJvdXRlICdsb2dpbicsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSxcblx0XHRcdHBvc3Q6IC0+XG5cdFx0XHRcdCMgR3JhYiB0aGUgdXNlcm5hbWUgb3IgZW1haWwgdGhhdCB0aGUgdXNlciBpcyBsb2dnaW5nIGluIHdpdGhcblx0XHRcdFx0dXNlciA9IHt9XG5cdFx0XHRcdGlmIEBib2R5UGFyYW1zLnVzZXJcblx0XHRcdFx0XHRpZiBAYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSBpcyAtMVxuXHRcdFx0XHRcdFx0dXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMudXNlclxuXHRcdFx0XHRlbHNlIGlmIEBib2R5UGFyYW1zLnVzZXJuYW1lXG5cdFx0XHRcdFx0dXNlci51c2VybmFtZSA9IEBib2R5UGFyYW1zLnVzZXJuYW1lXG5cdFx0XHRcdGVsc2UgaWYgQGJvZHlQYXJhbXMuZW1haWxcblx0XHRcdFx0XHR1c2VyLmVtYWlsID0gQGJvZHlQYXJhbXMuZW1haWxcblxuXHRcdFx0XHQjIFRyeSB0byBsb2cgdGhlIHVzZXIgaW50byB0aGUgdXNlcidzIGFjY291bnQgKGlmIHN1Y2Nlc3NmdWwgd2UnbGwgZ2V0IGFuIGF1dGggdG9rZW4gYmFjaylcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0YXV0aCA9IEF1dGgubG9naW5XaXRoUGFzc3dvcmQgdXNlciwgQGJvZHlQYXJhbXMucGFzc3dvcmRcblx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZVxuXHRcdFx0XHRcdHJldHVybiB7fSA9XG5cdFx0XHRcdFx0XHRzdGF0dXNDb2RlOiBlLmVycm9yXG5cdFx0XHRcdFx0XHRib2R5OiBzdGF0dXM6ICdlcnJvcicsIG1lc3NhZ2U6IGUucmVhc29uXG5cblx0XHRcdFx0IyBHZXQgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxuXHRcdFx0XHQjIFRPRE86IENvbnNpZGVyIHJldHVybmluZyB0aGUgdXNlciBpbiBBdXRoLmxvZ2luV2l0aFBhc3N3b3JkKCksIGluc3RlYWQgb2YgZmV0Y2hpbmcgaXQgYWdhaW4gaGVyZVxuXHRcdFx0XHRpZiBhdXRoLnVzZXJJZCBhbmQgYXV0aC5hdXRoVG9rZW5cblx0XHRcdFx0XHRzZWFyY2hRdWVyeSA9IHt9XG5cdFx0XHRcdFx0c2VhcmNoUXVlcnlbc2VsZi5fY29uZmlnLmF1dGgudG9rZW5dID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuIGF1dGguYXV0aFRva2VuXG5cdFx0XHRcdFx0QHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0XHRcdFx0J19pZCc6IGF1dGgudXNlcklkXG5cdFx0XHRcdFx0XHRzZWFyY2hRdWVyeVxuXHRcdFx0XHRcdEB1c2VySWQgPSBAdXNlcj8uX2lkXG5cblx0XHRcdFx0cmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IGF1dGh9XG5cblx0XHRcdFx0IyBDYWxsIHRoZSBsb2dpbiBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuXHRcdFx0XHRleHRyYURhdGEgPSBzZWxmLl9jb25maWcub25Mb2dnZWRJbj8uY2FsbCh0aGlzKVxuXHRcdFx0XHRpZiBleHRyYURhdGE/XG5cdFx0XHRcdFx0Xy5leHRlbmQocmVzcG9uc2UuZGF0YSwge2V4dHJhOiBleHRyYURhdGF9KVxuXG5cdFx0XHRcdHJlc3BvbnNlXG5cblx0XHRsb2dvdXQgPSAtPlxuXHRcdFx0IyBSZW1vdmUgdGhlIGdpdmVuIGF1dGggdG9rZW4gZnJvbSB0aGUgdXNlcidzIGFjY291bnRcblx0XHRcdGF1dGhUb2tlbiA9IEByZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbiBhdXRoVG9rZW5cblx0XHRcdHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlblxuXHRcdFx0aW5kZXggPSB0b2tlbkxvY2F0aW9uLmxhc3RJbmRleE9mICcuJ1xuXHRcdFx0dG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgMCwgaW5kZXhcblx0XHRcdHRva2VuRmllbGROYW1lID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcgaW5kZXggKyAxXG5cdFx0XHR0b2tlblRvUmVtb3ZlID0ge31cblx0XHRcdHRva2VuVG9SZW1vdmVbdG9rZW5GaWVsZE5hbWVdID0gaGFzaGVkVG9rZW5cblx0XHRcdHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge31cblx0XHRcdHRva2VuUmVtb3ZhbFF1ZXJ5W3Rva2VuUGF0aF0gPSB0b2tlblRvUmVtb3ZlXG5cdFx0XHRNZXRlb3IudXNlcnMudXBkYXRlIEB1c2VyLl9pZCwgeyRwdWxsOiB0b2tlblJlbW92YWxRdWVyeX1cblxuXHRcdFx0cmVzcG9uc2UgPSB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHttZXNzYWdlOiAnWW91XFwndmUgYmVlbiBsb2dnZWQgb3V0ISd9fVxuXG5cdFx0XHQjIENhbGwgdGhlIGxvZ291dCBob29rIHdpdGggdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBhdHRhY2hlZFxuXHRcdFx0ZXh0cmFEYXRhID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0Py5jYWxsKHRoaXMpXG5cdFx0XHRpZiBleHRyYURhdGE/XG5cdFx0XHRcdF8uZXh0ZW5kKHJlc3BvbnNlLmRhdGEsIHtleHRyYTogZXh0cmFEYXRhfSlcblxuXHRcdFx0cmVzcG9uc2VcblxuXHRcdCMjI1xuXHRcdFx0QWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcblxuXHRcdFx0QWZ0ZXIgdGhlIHVzZXIgaXMgbG9nZ2VkIG91dCwgdGhlIG9uTG9nZ2VkT3V0IGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuXHRcdFx0YWRkaW5nIGhvb2spLlxuXHRcdCMjI1xuXHRcdEBhZGRSb3V0ZSAnbG9nb3V0Jywge2F1dGhSZXF1aXJlZDogdHJ1ZX0sXG5cdFx0XHRnZXQ6IC0+XG5cdFx0XHRcdGNvbnNvbGUud2FybiBcIldhcm5pbmc6IERlZmF1bHQgbG9nb3V0IHZpYSBHRVQgd2lsbCBiZSByZW1vdmVkIGluIFJlc3RpdnVzIHYxLjAuIFVzZSBQT1NUIGluc3RlYWQuXCJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiXG5cdFx0XHRcdHJldHVybiBsb2dvdXQuY2FsbCh0aGlzKVxuXHRcdFx0cG9zdDogbG9nb3V0XG5cbk9kYXRhUmVzdGl2dXMgPSBAT2RhdGFSZXN0aXZ1c1xuIiwidmFyIENvb2tpZXMsIE9kYXRhUmVzdGl2dXMsIGJhc2ljQXV0aCxcbiAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG5iYXNpY0F1dGggPSByZXF1aXJlKCdiYXNpYy1hdXRoJyk7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxudGhpcy5PZGF0YVJlc3RpdnVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBPZGF0YVJlc3RpdnVzKG9wdGlvbnMpIHtcbiAgICB2YXIgY29yc0hlYWRlcnM7XG4gICAgdGhpcy5fcm91dGVzID0gW107XG4gICAgdGhpcy5fY29uZmlnID0ge1xuICAgICAgcGF0aHM6IFtdLFxuICAgICAgdXNlRGVmYXVsdEF1dGg6IGZhbHNlLFxuICAgICAgYXBpUGF0aDogJ2FwaS8nLFxuICAgICAgdmVyc2lvbjogbnVsbCxcbiAgICAgIHByZXR0eUpzb246IGZhbHNlLFxuICAgICAgYXV0aDoge1xuICAgICAgICB0b2tlbjogJ3NlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlbicsXG4gICAgICAgIHVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfdXNlciwgYXV0aFRva2VuLCBjb29raWVzLCBzcGFjZUlkLCB0b2tlbiwgdXNlcklkO1xuICAgICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyh0aGlzLnJlcXVlc3QsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIHVzZXJJZCA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgICAgICBhdXRoVG9rZW4gPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgICAgICAgc3BhY2VJZCA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgdGhpcy51cmxQYXJhbXNbJ3NwYWNlSWQnXTtcbiAgICAgICAgICBpZiAoYXV0aFRva2VuKSB7XG4gICAgICAgICAgICB0b2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5yZXF1ZXN0LnVzZXJJZCkge1xuICAgICAgICAgICAgX3VzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB0aGlzLnJlcXVlc3QudXNlcklkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHVzZXI6IF91c2VyLFxuICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgc3BhY2VJZDogc3BhY2VJZCxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgc3BhY2VJZDogc3BhY2VJZCxcbiAgICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRIZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBlbmFibGVDb3JzOiB0cnVlXG4gICAgfTtcbiAgICBfLmV4dGVuZCh0aGlzLl9jb25maWcsIG9wdGlvbnMpO1xuICAgIGlmICh0aGlzLl9jb25maWcuZW5hYmxlQ29ycykge1xuICAgICAgY29yc0hlYWRlcnMgPSB7XG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ09yaWdpbiwgWC1SZXF1ZXN0ZWQtV2l0aCwgQ29udGVudC1UeXBlLCBBY2NlcHQsIE9EYXRhLVZlcnNpb24nXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMuX2NvbmZpZy51c2VEZWZhdWx0QXV0aCkge1xuICAgICAgICBjb3JzSGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddICs9ICcsIFgtVXNlci1JZCwgWC1BdXRoLVRva2VuLCBYLVNwYWNlLUlkJztcbiAgICAgIH1cbiAgICAgIF8uZXh0ZW5kKHRoaXMuX2NvbmZpZy5kZWZhdWx0SGVhZGVycywgY29yc0hlYWRlcnMpO1xuICAgICAgaWYgKCF0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCkge1xuICAgICAgICB0aGlzLl9jb25maWcuZGVmYXVsdE9wdGlvbnNFbmRwb2ludCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2Uud3JpdGVIZWFkKDIwMCwgY29yc0hlYWRlcnMpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5hcGlQYXRoWzBdID09PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGguc2xpY2UoMSk7XG4gICAgfVxuICAgIGlmIChfLmxhc3QodGhpcy5fY29uZmlnLmFwaVBhdGgpICE9PSAnLycpIHtcbiAgICAgIHRoaXMuX2NvbmZpZy5hcGlQYXRoID0gdGhpcy5fY29uZmlnLmFwaVBhdGggKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudmVyc2lvbikge1xuICAgICAgdGhpcy5fY29uZmlnLmFwaVBhdGggKz0gdGhpcy5fY29uZmlnLnZlcnNpb24gKyAnLyc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudXNlRGVmYXVsdEF1dGgpIHtcbiAgICAgIHRoaXMuX2luaXRBdXRoKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jb25maWcudXNlQXV0aCkge1xuICAgICAgdGhpcy5faW5pdEF1dGgoKTtcbiAgICAgIGNvbnNvbGUud2FybignV2FybmluZzogdXNlQXV0aCBBUEkgY29uZmlnIG9wdGlvbiB3aWxsIGJlIHJlbW92ZWQgaW4gUmVzdGl2dXMgdjEuMCAnICsgJ1xcbiAgICBVc2UgdGhlIHVzZURlZmF1bHRBdXRoIG9wdGlvbiBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgXHRcdEFkZCBlbmRwb2ludHMgZm9yIHRoZSBnaXZlbiBIVFRQIG1ldGhvZHMgYXQgdGhlIGdpdmVuIHBhdGhcbiAgXG4gIFx0XHRAcGFyYW0gcGF0aCB7U3RyaW5nfSBUaGUgZXh0ZW5kZWQgVVJMIHBhdGggKHdpbGwgYmUgYXBwZW5kZWQgdG8gYmFzZSBwYXRoIG9mIHRoZSBBUEkpXG4gIFx0XHRAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBSb3V0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgXHRcdEBwYXJhbSBvcHRpb25zLmF1dGhSZXF1aXJlZCB7Qm9vbGVhbn0gVGhlIGRlZmF1bHQgYXV0aCByZXF1aXJlbWVudCBmb3IgZWFjaCBlbmRwb2ludCBvbiB0aGUgcm91dGVcbiAgXHRcdEBwYXJhbSBvcHRpb25zLnJvbGVSZXF1aXJlZCB7U3RyaW5nIG9yIFN0cmluZ1tdfSBUaGUgZGVmYXVsdCByb2xlIHJlcXVpcmVkIGZvciBlYWNoIGVuZHBvaW50IG9uIHRoZSByb3V0ZVxuICBcdFx0QHBhcmFtIGVuZHBvaW50cyB7T2JqZWN0fSBBIHNldCBvZiBlbmRwb2ludHMgYXZhaWxhYmxlIG9uIHRoZSBuZXcgcm91dGUgKGdldCwgcG9zdCwgcHV0LCBwYXRjaCwgZGVsZXRlLCBvcHRpb25zKVxuICBcdFx0QHBhcmFtIGVuZHBvaW50cy48bWV0aG9kPiB7RnVuY3Rpb24gb3IgT2JqZWN0fSBJZiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBhbGwgZGVmYXVsdCByb3V0ZVxuICBcdFx0XHRcdGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVuZHBvaW50LiBPdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYW4gYGFjdGlvbmBcbiAgXHRcdFx0XHRhbmQgYWxsIG90aGVyIHJvdXRlIGNvbmZpZyBvcHRpb25zIGF2YWlsYWJsZS4gQW4gYGFjdGlvbmAgbXVzdCBiZSBwcm92aWRlZCB3aXRoIHRoZSBvYmplY3QuXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLmFkZFJvdXRlID0gZnVuY3Rpb24ocGF0aCwgb3B0aW9ucywgZW5kcG9pbnRzKSB7XG4gICAgdmFyIHJvdXRlO1xuICAgIHJvdXRlID0gbmV3IHNoYXJlLlJvdXRlKHRoaXMsIHBhdGgsIG9wdGlvbnMsIGVuZHBvaW50cyk7XG4gICAgdGhpcy5fcm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJvdXRlLmFkZFRvQXBpKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICAvKipcbiAgXHRcdEdlbmVyYXRlIHJvdXRlcyBmb3IgdGhlIE1ldGVvciBDb2xsZWN0aW9uIHdpdGggdGhlIGdpdmVuIG5hbWVcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuYWRkQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbkVuZHBvaW50cywgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzLCBlbmRwb2ludHNBd2FpdGluZ0NvbmZpZ3VyYXRpb24sIGVudGl0eVJvdXRlRW5kcG9pbnRzLCBleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kcywgbWV0aG9kc09uQ29sbGVjdGlvbiwgcGF0aCwgcm91dGVPcHRpb25zO1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgbWV0aG9kcyA9IFsnZ2V0JywgJ3Bvc3QnLCAncHV0JywgJ2RlbGV0ZScsICdnZXRBbGwnXTtcbiAgICBtZXRob2RzT25Db2xsZWN0aW9uID0gWydwb3N0JywgJ2dldEFsbCddO1xuICAgIGlmIChjb2xsZWN0aW9uID09PSBNZXRlb3IudXNlcnMpIHtcbiAgICAgIGNvbGxlY3Rpb25FbmRwb2ludHMgPSB0aGlzLl91c2VyQ29sbGVjdGlvbkVuZHBvaW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbkVuZHBvaW50cyA9IHRoaXMuX2NvbGxlY3Rpb25FbmRwb2ludHM7XG4gICAgfVxuICAgIGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbiA9IG9wdGlvbnMuZW5kcG9pbnRzIHx8IHt9O1xuICAgIHJvdXRlT3B0aW9ucyA9IG9wdGlvbnMucm91dGVPcHRpb25zIHx8IHt9O1xuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzID0gb3B0aW9ucy5leGNsdWRlZEVuZHBvaW50cyB8fCBbXTtcbiAgICBwYXRoID0gb3B0aW9ucy5wYXRoIHx8IGNvbGxlY3Rpb24uX25hbWU7XG4gICAgY29sbGVjdGlvblJvdXRlRW5kcG9pbnRzID0ge307XG4gICAgZW50aXR5Um91dGVFbmRwb2ludHMgPSB7fTtcbiAgICBpZiAoXy5pc0VtcHR5KGVuZHBvaW50c0F3YWl0aW5nQ29uZmlndXJhdGlvbikgJiYgXy5pc0VtcHR5KGV4Y2x1ZGVkRW5kcG9pbnRzKSkge1xuICAgICAgXy5lYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICBpZiAoaW5kZXhPZi5jYWxsKG1ldGhvZHNPbkNvbGxlY3Rpb24sIG1ldGhvZCkgPj0gMCkge1xuICAgICAgICAgIF8uZXh0ZW5kKGNvbGxlY3Rpb25Sb3V0ZUVuZHBvaW50cywgY29sbGVjdGlvbkVuZHBvaW50c1ttZXRob2RdLmNhbGwodGhpcywgY29sbGVjdGlvbikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb2xsZWN0aW9uRW5kcG9pbnRzW21ldGhvZF0uY2FsbCh0aGlzLCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfLmVhY2gobWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHZhciBjb25maWd1cmVkRW5kcG9pbnQsIGVuZHBvaW50T3B0aW9ucztcbiAgICAgICAgaWYgKGluZGV4T2YuY2FsbChleGNsdWRlZEVuZHBvaW50cywgbWV0aG9kKSA8IDAgJiYgZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgZW5kcG9pbnRPcHRpb25zID0gZW5kcG9pbnRzQXdhaXRpbmdDb25maWd1cmF0aW9uW21ldGhvZF07XG4gICAgICAgICAgY29uZmlndXJlZEVuZHBvaW50ID0ge307XG4gICAgICAgICAgXy5lYWNoKGNvbGxlY3Rpb25FbmRwb2ludHNbbWV0aG9kXS5jYWxsKHRoaXMsIGNvbGxlY3Rpb24pLCBmdW5jdGlvbihhY3Rpb24sIG1ldGhvZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmVkRW5kcG9pbnRbbWV0aG9kVHlwZV0gPSBfLmNoYWluKGFjdGlvbikuY2xvbmUoKS5leHRlbmQoZW5kcG9pbnRPcHRpb25zKS52YWx1ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpbmRleE9mLmNhbGwobWV0aG9kc09uQ29sbGVjdGlvbiwgbWV0aG9kKSA+PSAwKSB7XG4gICAgICAgICAgICBfLmV4dGVuZChjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMsIGNvbmZpZ3VyZWRFbmRwb2ludCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGVudGl0eVJvdXRlRW5kcG9pbnRzLCBjb25maWd1cmVkRW5kcG9pbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICAgIHRoaXMuYWRkUm91dGUocGF0aCwgcm91dGVPcHRpb25zLCBjb2xsZWN0aW9uUm91dGVFbmRwb2ludHMpO1xuICAgIHRoaXMuYWRkUm91dGUocGF0aCArIFwiLzppZFwiLCByb3V0ZU9wdGlvbnMsIGVudGl0eVJvdXRlRW5kcG9pbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICBcdFx0QSBzZXQgb2YgZW5kcG9pbnRzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBDb2xsZWN0aW9uIFJvdXRlXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLl9jb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQsIHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgIF9pZDogdGhpcy51cmxQYXJhbXMuaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZUlkKSB7XG4gICAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gdGhpcy5zcGFjZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW50aXR5SXNVcGRhdGVkID0gY29sbGVjdGlvbi51cGRhdGUoc2VsZWN0b3IsIHtcbiAgICAgICAgICAgICAgJHNldDogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHlJc1VwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKHRoaXMudXJsUGFyYW1zLmlkKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICBfaWQ6IHRoaXMudXJsUGFyYW1zLmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uLnJlbW92ZShzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSXRlbSByZW1vdmVkJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ0l0ZW0gbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwb3N0OiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHksIGVudGl0eUlkO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICB0aGlzLmJvZHlQYXJhbXMuc3BhY2UgPSB0aGlzLnNwYWNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbnRpdHlJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0KHRoaXMuYm9keVBhcmFtcyk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUoZW50aXR5SWQpO1xuICAgICAgICAgICAgaWYgKGVudGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMSxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIGl0ZW0gYWRkZWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldEFsbDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdGllcywgc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BhY2VJZCkge1xuICAgICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHRoaXMuc3BhY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudGl0aWVzID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yKS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSBpdGVtcyBmcm9tIGNvbGxlY3Rpb24nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgXHRcdEEgc2V0IG9mIGVuZHBvaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgTWV0ZW9yLnVzZXJzIENvbGxlY3Rpb24gUm91dGVcbiAgICovXG5cbiAgT2RhdGFSZXN0aXZ1cy5wcm90b3R5cGUuX3VzZXJDb2xsZWN0aW9uRW5kcG9pbnRzID0ge1xuICAgIGdldDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHk7XG4gICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBlbnRpdHlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdXQ6IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHB1dDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJc1VwZGF0ZWQ7XG4gICAgICAgICAgICBlbnRpdHlJc1VwZGF0ZWQgPSBjb2xsZWN0aW9uLnVwZGF0ZSh0aGlzLnVybFBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdGhpcy5ib2R5UGFyYW1zXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVudGl0eUlzVXBkYXRlZCkge1xuICAgICAgICAgICAgICBlbnRpdHkgPSBjb2xsZWN0aW9uLmZpbmRPbmUodGhpcy51cmxQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXCJkZWxldGVcIjogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJkZWxldGVcIjoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbi5yZW1vdmUodGhpcy51cmxQYXJhbXMuaWQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgcmVtb3ZlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdmYWlsJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcG9zdDogZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zdDoge1xuICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5LCBlbnRpdHlJZDtcbiAgICAgICAgICAgIGVudGl0eUlkID0gQWNjb3VudHMuY3JlYXRlVXNlcih0aGlzLmJvZHlQYXJhbXMpO1xuICAgICAgICAgICAgZW50aXR5ID0gY29sbGVjdGlvbi5maW5kT25lKGVudGl0eUlkLCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHByb2ZpbGU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW50aXR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAxLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogZW50aXR5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgKHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDBcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIHVzZXIgYWRkZWQnXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0QWxsOiBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVudGl0aWVzO1xuICAgICAgICAgICAgZW50aXRpZXMgPSBjb2xsZWN0aW9uLmZpbmQoe30sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgcHJvZmlsZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICAgICAgaWYgKGVudGl0aWVzKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXRpZXNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogNDA0LFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2ZhaWwnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byByZXRyaWV2ZSB1c2VycydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gIFx0XHRBZGQgL2xvZ2luIGFuZCAvbG9nb3V0IGVuZHBvaW50cyB0byB0aGUgQVBJXG4gICAqL1xuXG4gIE9kYXRhUmVzdGl2dXMucHJvdG90eXBlLl9pbml0QXV0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2dvdXQsIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG5cbiAgICAvKlxuICAgIFx0XHRcdEFkZCBhIGxvZ2luIGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICBcdFx0XHRBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgaW4sIHRoZSBvbkxvZ2dlZEluIGhvb2sgaXMgY2FsbGVkIChzZWUgUmVzdGZ1bGx5LmNvbmZpZ3VyZSgpIGZvclxuICAgIFx0XHRcdGFkZGluZyBob29rKS5cbiAgICAgKi9cbiAgICB0aGlzLmFkZFJvdXRlKCdsb2dpbicsIHtcbiAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2VcbiAgICB9LCB7XG4gICAgICBwb3N0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF1dGgsIGUsIGV4dHJhRGF0YSwgcmVmLCByZWYxLCByZXNwb25zZSwgc2VhcmNoUXVlcnksIHVzZXI7XG4gICAgICAgIHVzZXIgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYm9keVBhcmFtcy51c2VyLmluZGV4T2YoJ0AnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHVzZXIudXNlcm5hbWUgPSB0aGlzLmJvZHlQYXJhbXMudXNlcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXNlci5lbWFpbCA9IHRoaXMuYm9keVBhcmFtcy51c2VyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvZHlQYXJhbXMudXNlcm5hbWUpIHtcbiAgICAgICAgICB1c2VyLnVzZXJuYW1lID0gdGhpcy5ib2R5UGFyYW1zLnVzZXJuYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9keVBhcmFtcy5lbWFpbCkge1xuICAgICAgICAgIHVzZXIuZW1haWwgPSB0aGlzLmJvZHlQYXJhbXMuZW1haWw7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhdXRoID0gQXV0aC5sb2dpbldpdGhQYXNzd29yZCh1c2VyLCB0aGlzLmJvZHlQYXJhbXMucGFzc3dvcmQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiBlLmVycm9yLFxuICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGUucmVhc29uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXV0aC51c2VySWQgJiYgYXV0aC5hdXRoVG9rZW4pIHtcbiAgICAgICAgICBzZWFyY2hRdWVyeSA9IHt9O1xuICAgICAgICAgIHNlYXJjaFF1ZXJ5W3NlbGYuX2NvbmZpZy5hdXRoLnRva2VuXSA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoLmF1dGhUb2tlbik7XG4gICAgICAgICAgdGhpcy51c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgJ19pZCc6IGF1dGgudXNlcklkXG4gICAgICAgICAgfSwgc2VhcmNoUXVlcnkpO1xuICAgICAgICAgIHRoaXMudXNlcklkID0gKHJlZiA9IHRoaXMudXNlcikgIT0gbnVsbCA/IHJlZi5faWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgZGF0YTogYXV0aFxuICAgICAgICB9O1xuICAgICAgICBleHRyYURhdGEgPSAocmVmMSA9IHNlbGYuX2NvbmZpZy5vbkxvZ2dlZEluKSAhPSBudWxsID8gcmVmMS5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICBfLmV4dGVuZChyZXNwb25zZS5kYXRhLCB7XG4gICAgICAgICAgICBleHRyYTogZXh0cmFEYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGF1dGhUb2tlbiwgZXh0cmFEYXRhLCBoYXNoZWRUb2tlbiwgaW5kZXgsIHJlZiwgcmVzcG9uc2UsIHRva2VuRmllbGROYW1lLCB0b2tlbkxvY2F0aW9uLCB0b2tlblBhdGgsIHRva2VuUmVtb3ZhbFF1ZXJ5LCB0b2tlblRvUmVtb3ZlO1xuICAgICAgYXV0aFRva2VuID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddO1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHRva2VuTG9jYXRpb24gPSBzZWxmLl9jb25maWcuYXV0aC50b2tlbjtcbiAgICAgIGluZGV4ID0gdG9rZW5Mb2NhdGlvbi5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdG9rZW5QYXRoID0gdG9rZW5Mb2NhdGlvbi5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgdG9rZW5GaWVsZE5hbWUgPSB0b2tlbkxvY2F0aW9uLnN1YnN0cmluZyhpbmRleCArIDEpO1xuICAgICAgdG9rZW5Ub1JlbW92ZSA9IHt9O1xuICAgICAgdG9rZW5Ub1JlbW92ZVt0b2tlbkZpZWxkTmFtZV0gPSBoYXNoZWRUb2tlbjtcbiAgICAgIHRva2VuUmVtb3ZhbFF1ZXJ5ID0ge307XG4gICAgICB0b2tlblJlbW92YWxRdWVyeVt0b2tlblBhdGhdID0gdG9rZW5Ub1JlbW92ZTtcbiAgICAgIE1ldGVvci51c2Vycy51cGRhdGUodGhpcy51c2VyLl9pZCwge1xuICAgICAgICAkcHVsbDogdG9rZW5SZW1vdmFsUXVlcnlcbiAgICAgIH0pO1xuICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbWVzc2FnZTogJ1lvdVxcJ3ZlIGJlZW4gbG9nZ2VkIG91dCEnXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBleHRyYURhdGEgPSAocmVmID0gc2VsZi5fY29uZmlnLm9uTG9nZ2VkT3V0KSAhPSBudWxsID8gcmVmLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgICBpZiAoZXh0cmFEYXRhICE9IG51bGwpIHtcbiAgICAgICAgXy5leHRlbmQocmVzcG9uc2UuZGF0YSwge1xuICAgICAgICAgIGV4dHJhOiBleHRyYURhdGFcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qXG4gICAgXHRcdFx0QWRkIGEgbG9nb3V0IGVuZHBvaW50IHRvIHRoZSBBUElcbiAgICBcbiAgICBcdFx0XHRBZnRlciB0aGUgdXNlciBpcyBsb2dnZWQgb3V0LCB0aGUgb25Mb2dnZWRPdXQgaG9vayBpcyBjYWxsZWQgKHNlZSBSZXN0ZnVsbHkuY29uZmlndXJlKCkgZm9yXG4gICAgXHRcdFx0YWRkaW5nIGhvb2spLlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLmFkZFJvdXRlKCdsb2dvdXQnLCB7XG4gICAgICBhdXRoUmVxdWlyZWQ6IHRydWVcbiAgICB9LCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBEZWZhdWx0IGxvZ291dCB2aWEgR0VUIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZXN0aXZ1cyB2MS4wLiBVc2UgUE9TVCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgY29uc29sZS53YXJuKFwiICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXMvaXNzdWVzLzEwMFwiKTtcbiAgICAgICAgcmV0dXJuIGxvZ291dC5jYWxsKHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHBvc3Q6IGxvZ291dFxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBPZGF0YVJlc3RpdnVzO1xuXG59KSgpO1xuXG5PZGF0YVJlc3RpdnVzID0gdGhpcy5PZGF0YVJlc3RpdnVzO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblxuXHRnZXRPYmplY3RzID0gKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWVzKS0+XG5cdFx0ZGF0YSA9IHt9XG5cdFx0b2JqZWN0X25hbWVzLnNwbGl0KCcsJykuZm9yRWFjaCAob2JqZWN0X25hbWUpLT5cblx0XHRcdG9iamVjdCA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdFx0ZGF0YVtvYmplY3QubmFtZV0gPSBvYmplY3Rcblx0XHRyZXR1cm4gZGF0YTtcblxuXHRnZXRPYmplY3QgPSAoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSktPlxuXHRcdGRhdGEgPSBfLmNsb25lKENyZWF0b3IuT2JqZWN0c1tDcmVhdG9yLmdldE9iamVjdE5hbWUoQ3JlYXRvci5nZXRPYmplY3Qob2JqZWN0X25hbWUsIHNwYWNlSWQpKV0pXG5cdFx0aWYgIWRhdGFcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuaXoOaViOeahGlkICN7b2JqZWN0X25hbWV9XCIpXG5cblx0XHRwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICdhZG1pbid9LCB7ZmllbGRzOntfaWQ6MSwgYXNzaWduZWRfYXBwczoxfX0pXG5cdFx0cHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIG5hbWU6ICd1c2VyJ30sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSlcblx0XHRwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHt1c2VyczogdXNlcklkLCBzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6e19pZDoxLCBhc3NpZ25lZF9hcHBzOjF9fSkuZmV0Y2goKVxuXHRcdHBzZXRzID0geyBwc2V0c0FkbWluLCBwc2V0c1VzZXIsIHBzZXRzQ3VycmVudCB9XG5cblx0XHRvYmplY3RfcGVybWlzc2lvbnMgPSBDcmVhdG9yLmdldE9iamVjdFBlcm1pc3Npb25zLmJpbmQocHNldHMpKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cblx0XHRkZWxldGUgZGF0YS5saXN0X3ZpZXdzXG5cdFx0ZGVsZXRlIGRhdGEucGVybWlzc2lvbl9zZXRcblxuXHRcdGlmIG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd1JlYWRcblx0XHRcdGRhdGEuYWxsb3dSZWFkID0gdHJ1ZVxuXHRcdFx0ZGF0YS5hbGxvd0VkaXQgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dFZGl0XG5cdFx0XHRkYXRhLmFsbG93RGVsZXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93RGVsZXRlXG5cdFx0XHRkYXRhLmFsbG93Q3JlYXRlID0gb2JqZWN0X3Blcm1pc3Npb25zLmFsbG93Q3JlYXRlXG5cdFx0XHRkYXRhLm1vZGlmeUFsbFJlY29yZHMgPSBvYmplY3RfcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3Jkc1xuXG5cdFx0XHRmaWVsZHMgPSB7fVxuXHRcdFx0Xy5mb3JFYWNoIGRhdGEuZmllbGRzLCAoZmllbGQsIGtleSktPlxuXHRcdFx0XHRfZmllbGQgPSBfLmNsb25lKGZpZWxkKVxuXG5cdFx0XHRcdGlmICFfZmllbGQubmFtZVxuXHRcdFx0XHRcdF9maWVsZC5uYW1lID0ga2V5XG5cblx0XHRcdFx0I+WwhuS4jeWPr+e8lui+keeahOWtl+auteiuvue9ruS4unJlYWRvbmx5ID0gdHJ1ZVxuXHRcdFx0XHRpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bmVkaXRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpID4gLTEpXG5cdFx0XHRcdFx0X2ZpZWxkLnJlYWRvbmx5ID0gdHJ1ZVxuXG5cdFx0XHRcdCPkuI3ov5Tlm57kuI3lj6/op4HlrZfmrrVcblx0XHRcdFx0aWYgKF8uaW5kZXhPZihvYmplY3RfcGVybWlzc2lvbnMudW5yZWFkYWJsZV9maWVsZHMsIF9maWVsZC5uYW1lKSA8IDApXG5cdFx0XHRcdFx0ZmllbGRzW2tleV0gPSBfZmllbGRcblxuXHRcdFx0ZGF0YS5maWVsZHMgPSBmaWVsZHNcblxuXHRcdGVsc2Vcblx0XHRcdGRhdGEuYWxsb3dSZWFkID0gZmFsc2VcblxuXHRcdHJldHVybiBkYXRhXG5cblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsIFN0ZWVkb3NPRGF0YS5BUElfUEFUSCArICcvb2JqZWN0cy86aWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdFx0dHJ5XG5cdFx0XHR1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4ocmVxLCByZXMpO1xuXHRcdFx0aWYgIXVzZXJJZFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJObyBwZXJtaXNzaW9uXCIpXG5cblx0XHRcdHNwYWNlSWQgPSByZXEucGFyYW1zPy5zcGFjZUlkXG5cdFx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJNaXNzIHNwYWNlSWRcIilcblxuXHRcdFx0b2JqZWN0X25hbWUgPSByZXEucGFyYW1zPy5pZFxuXHRcdFx0aWYgIW9iamVjdF9uYW1lXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3MgaWRcIilcblxuXHRcdFx0X29iaiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdHNcIikuZmluZE9uZSh7X2lkOiBvYmplY3RfbmFtZX0pXG5cblx0XHRcdGlmIF9vYmogJiYgX29iai5uYW1lXG5cdFx0XHRcdG9iamVjdF9uYW1lID0gX29iai5uYW1lXG5cblx0XHRcdGlmIG9iamVjdF9uYW1lLnNwbGl0KCcsJykubGVuZ3RoID4gMVxuXHRcdFx0XHRkYXRhID0gZ2V0T2JqZWN0cyhzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkYXRhID0gZ2V0T2JqZWN0KHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpXG5cblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIHtcblx0XHRcdFx0Y29kZTogMjAwLFxuXHRcdFx0XHRkYXRhOiBkYXRhIHx8IHt9XG5cdFx0XHR9XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCB7XG5cdFx0XHRcdGNvZGU6IGUuZXJyb3IgfHwgNTAwXG5cdFx0XHRcdGRhdGE6IHtlcnJvcnM6IGUucmVhc29uIHx8IGUubWVzc2FnZX1cblx0XHRcdH0iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIGdldE9iamVjdCwgZ2V0T2JqZWN0cztcbiAgZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWVzKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgZGF0YSA9IHt9O1xuICAgIG9iamVjdF9uYW1lcy5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICAgIHZhciBvYmplY3Q7XG4gICAgICBvYmplY3QgPSBnZXRPYmplY3Qoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgICByZXR1cm4gZGF0YVtvYmplY3QubmFtZV0gPSBvYmplY3Q7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG4gIGdldE9iamVjdCA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpIHtcbiAgICB2YXIgZGF0YSwgZmllbGRzLCBvYmplY3RfcGVybWlzc2lvbnMsIHBzZXRzLCBwc2V0c0FkbWluLCBwc2V0c0N1cnJlbnQsIHBzZXRzVXNlcjtcbiAgICBkYXRhID0gXy5jbG9uZShDcmVhdG9yLk9iamVjdHNbQ3JlYXRvci5nZXRPYmplY3ROYW1lKENyZWF0b3IuZ2V0T2JqZWN0KG9iamVjdF9uYW1lLCBzcGFjZUlkKSldKTtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuaXoOaViOeahGlkIFwiICsgb2JqZWN0X25hbWUpO1xuICAgIH1cbiAgICBwc2V0c0FkbWluID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICdhZG1pbidcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBhc3NpZ25lZF9hcHBzOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgcHNldHNVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwicGVybWlzc2lvbl9zZXRcIikuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIG5hbWU6ICd1c2VyJ1xuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwc2V0c0N1cnJlbnQgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwZXJtaXNzaW9uX3NldFwiKS5maW5kKHtcbiAgICAgIHVzZXJzOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIGFzc2lnbmVkX2FwcHM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBzZXRzID0ge1xuICAgICAgcHNldHNBZG1pbjogcHNldHNBZG1pbixcbiAgICAgIHBzZXRzVXNlcjogcHNldHNVc2VyLFxuICAgICAgcHNldHNDdXJyZW50OiBwc2V0c0N1cnJlbnRcbiAgICB9O1xuICAgIG9iamVjdF9wZXJtaXNzaW9ucyA9IENyZWF0b3IuZ2V0T2JqZWN0UGVybWlzc2lvbnMuYmluZChwc2V0cykoc3BhY2VJZCwgdXNlcklkLCBvYmplY3RfbmFtZSk7XG4gICAgZGVsZXRlIGRhdGEubGlzdF92aWV3cztcbiAgICBkZWxldGUgZGF0YS5wZXJtaXNzaW9uX3NldDtcbiAgICBpZiAob2JqZWN0X3Blcm1pc3Npb25zLmFsbG93UmVhZCkge1xuICAgICAgZGF0YS5hbGxvd1JlYWQgPSB0cnVlO1xuICAgICAgZGF0YS5hbGxvd0VkaXQgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dFZGl0O1xuICAgICAgZGF0YS5hbGxvd0RlbGV0ZSA9IG9iamVjdF9wZXJtaXNzaW9ucy5hbGxvd0RlbGV0ZTtcbiAgICAgIGRhdGEuYWxsb3dDcmVhdGUgPSBvYmplY3RfcGVybWlzc2lvbnMuYWxsb3dDcmVhdGU7XG4gICAgICBkYXRhLm1vZGlmeUFsbFJlY29yZHMgPSBvYmplY3RfcGVybWlzc2lvbnMubW9kaWZ5QWxsUmVjb3JkcztcbiAgICAgIGZpZWxkcyA9IHt9O1xuICAgICAgXy5mb3JFYWNoKGRhdGEuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwga2V5KSB7XG4gICAgICAgIHZhciBfZmllbGQ7XG4gICAgICAgIF9maWVsZCA9IF8uY2xvbmUoZmllbGQpO1xuICAgICAgICBpZiAoIV9maWVsZC5uYW1lKSB7XG4gICAgICAgICAgX2ZpZWxkLm5hbWUgPSBrZXk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8uaW5kZXhPZihvYmplY3RfcGVybWlzc2lvbnMudW5lZGl0YWJsZV9maWVsZHMsIF9maWVsZC5uYW1lKSA+IC0xKSB7XG4gICAgICAgICAgX2ZpZWxkLnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pbmRleE9mKG9iamVjdF9wZXJtaXNzaW9ucy51bnJlYWRhYmxlX2ZpZWxkcywgX2ZpZWxkLm5hbWUpIDwgMCkge1xuICAgICAgICAgIHJldHVybiBmaWVsZHNba2V5XSA9IF9maWVsZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYXRhLmZpZWxkcyA9IGZpZWxkcztcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YS5hbGxvd1JlYWQgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgU3RlZWRvc09EYXRhLkFQSV9QQVRIICsgJy9vYmplY3RzLzppZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIF9vYmosIGRhdGEsIGUsIG9iamVjdF9uYW1lLCByZWYsIHJlZjEsIHNwYWNlSWQsIHVzZXJJZDtcbiAgICB0cnkge1xuICAgICAgdXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk5vIHBlcm1pc3Npb25cIik7XG4gICAgICB9XG4gICAgICBzcGFjZUlkID0gKHJlZiA9IHJlcS5wYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMDtcbiAgICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCJNaXNzIHNwYWNlSWRcIik7XG4gICAgICB9XG4gICAgICBvYmplY3RfbmFtZSA9IChyZWYxID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZjEuaWQgOiB2b2lkIDA7XG4gICAgICBpZiAoIW9iamVjdF9uYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIk1pc3MgaWRcIik7XG4gICAgICB9XG4gICAgICBfb2JqID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0c1wiKS5maW5kT25lKHtcbiAgICAgICAgX2lkOiBvYmplY3RfbmFtZVxuICAgICAgfSk7XG4gICAgICBpZiAoX29iaiAmJiBfb2JqLm5hbWUpIHtcbiAgICAgICAgb2JqZWN0X25hbWUgPSBfb2JqLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAob2JqZWN0X25hbWUuc3BsaXQoJywnKS5sZW5ndGggPiAxKSB7XG4gICAgICAgIGRhdGEgPSBnZXRPYmplY3RzKHNwYWNlSWQsIHVzZXJJZCwgb2JqZWN0X25hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YSA9IGdldE9iamVjdChzcGFjZUlkLCB1c2VySWQsIG9iamVjdF9uYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgZGF0YTogZGF0YSB8fCB7fVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiBlLmVycm9yIHx8IDUwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGVycm9yczogZS5yZWFzb24gfHwgZS5tZXNzYWdlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJylcblxuYmFzaWNBdXRoID0gcmVxdWlyZSgnYmFzaWMtYXV0aCcpXG5cbmF1dGhvcml6YXRpb25DYWNoZSA9IHt9XG5cbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UgJy9hcGkvb2RhdGEvdjQvJywgKHJlcSwgcmVzLCBuZXh0KS0+XG5cblx0RmliZXIoKCktPlxuXHRcdGlmICFyZXEudXNlcklkXG5cdFx0XHRpc0F1dGhlZCA9IGZhbHNlXG5cdFx0XHQjIG9hdXRoMumqjOivgVxuXHRcdFx0aWYgcmVxPy5xdWVyeT8uYWNjZXNzX3Rva2VuXG5cdFx0XHRcdGNvbnNvbGUubG9nICdPQXV0aDI6ICcsIHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW5cblx0XHRcdFx0dXNlcklkID0gU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4ocmVxLnF1ZXJ5LmFjY2Vzc190b2tlbilcblx0XHRcdFx0aWYgdXNlcklkXG5cdFx0XHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXG5cdFx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdFx0aXNBdXRoZWQgPSB0cnVlXG5cdFx0XHQjIGJhc2lj6aqM6K+BXG5cdFx0XHRpZiByZXEuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddXG5cdFx0XHRcdGF1dGggPSBiYXNpY0F1dGgucGFyc2UocmVxLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXSlcblx0XHRcdFx0aWYgYXV0aFxuXHRcdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7dXNlcm5hbWU6IGF1dGgubmFtZX0sIHsgZmllbGRzOiB7ICdzZXJ2aWNlcyc6IDEgfSB9KVxuXHRcdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHRcdGlmIGF1dGhvcml6YXRpb25DYWNoZVthdXRoLm5hbWVdID09IGF1dGgucGFzc1xuXHRcdFx0XHRcdFx0XHRpc0F1dGhlZCA9IHRydWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgdXNlciwgYXV0aC5wYXNzXG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRpZiAhcmVzdWx0LmVycm9yXG5cdFx0XHRcdFx0XHRcdFx0aXNBdXRoZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdFx0aWYgXy5rZXlzKGF1dGhvcml6YXRpb25DYWNoZSkubGVuZ3RoID4gMTAwXG5cdFx0XHRcdFx0XHRcdFx0XHRhdXRob3JpemF0aW9uQ2FjaGUgPSB7fVxuXHRcdFx0XHRcdFx0XHRcdGF1dGhvcml6YXRpb25DYWNoZVthdXRoLm5hbWVdID0gYXV0aC5wYXNzXG5cdFx0XHRpZiBpc0F1dGhlZFxuXHRcdFx0XHRyZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gPSB1c2VyLl9pZFxuXHRcdFx0XHR0b2tlbiA9IG51bGxcblx0XHRcdFx0YXBwX2lkID0gXCJjcmVhdG9yXCJcblx0XHRcdFx0Y2xpZW50X2lkID0gXCJwY1wiXG5cdFx0XHRcdGxvZ2luVG9rZW5zID0gdXNlci5zZXJ2aWNlcz8ucmVzdW1lPy5sb2dpblRva2Vuc1xuXHRcdFx0XHRpZiBsb2dpblRva2Vuc1xuXHRcdFx0XHRcdGFwcF9sb2dpbl90b2tlbiA9IF8uZmluZChsb2dpblRva2VucywgKHQpLT5cblx0XHRcdFx0XHRcdHJldHVybiB0LmFwcF9pZCBpcyBhcHBfaWQgYW5kIHQuY2xpZW50X2lkIGlzIGNsaWVudF9pZFxuXHRcdFx0XHRcdClcblx0XHRcdFx0XHR0b2tlbiA9IGFwcF9sb2dpbl90b2tlbi50b2tlbiBpZiBhcHBfbG9naW5fdG9rZW5cblxuXHRcdFx0XHRpZiBub3QgdG9rZW5cblx0XHRcdFx0XHRhdXRoVG9rZW4gPSBBY2NvdW50cy5fZ2VuZXJhdGVTdGFtcGVkTG9naW5Ub2tlbigpXG5cdFx0XHRcdFx0dG9rZW4gPSBhdXRoVG9rZW4udG9rZW5cblx0XHRcdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuIGF1dGhUb2tlblxuXHRcdFx0XHRcdGhhc2hlZFRva2VuLmFwcF9pZCA9IGFwcF9pZFxuXHRcdFx0XHRcdGhhc2hlZFRva2VuLmNsaWVudF9pZCA9IGNsaWVudF9pZFxuXHRcdFx0XHRcdGhhc2hlZFRva2VuLnRva2VuID0gdG9rZW5cblx0XHRcdFx0XHRBY2NvdW50cy5faW5zZXJ0SGFzaGVkTG9naW5Ub2tlbiB1c2VyLl9pZCwgaGFzaGVkVG9rZW5cblxuXHRcdFx0XHRpZiB0b2tlblxuXHRcdFx0XHRcdHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSA9IHRva2VuXG5cdFx0bmV4dCgpXG5cdCkucnVuKClcbiIsInZhciBGaWJlciwgYXV0aG9yaXphdGlvbkNhY2hlLCBiYXNpY0F1dGg7XG5cbkZpYmVyID0gcmVxdWlyZSgnZmliZXJzJyk7XG5cbmJhc2ljQXV0aCA9IHJlcXVpcmUoJ2Jhc2ljLWF1dGgnKTtcblxuYXV0aG9yaXphdGlvbkNhY2hlID0ge307XG5cbkpzb25Sb3V0ZXMuTWlkZGxld2FyZS51c2UoJy9hcGkvb2RhdGEvdjQvJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgcmV0dXJuIEZpYmVyKGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcHBfaWQsIGFwcF9sb2dpbl90b2tlbiwgYXV0aCwgYXV0aFRva2VuLCBjbGllbnRfaWQsIGhhc2hlZFRva2VuLCBpc0F1dGhlZCwgbG9naW5Ub2tlbnMsIHJlZiwgcmVmMSwgcmVmMiwgcmVzdWx0LCB0b2tlbiwgdXNlciwgdXNlcklkO1xuICAgIGlmICghcmVxLnVzZXJJZCkge1xuICAgICAgaXNBdXRoZWQgPSBmYWxzZTtcbiAgICAgIGlmIChyZXEgIT0gbnVsbCA/IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYuYWNjZXNzX3Rva2VuIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdPQXV0aDI6ICcsIHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICB1c2VySWQgPSBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihyZXEucXVlcnkuYWNjZXNzX3Rva2VuKTtcbiAgICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICBpc0F1dGhlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVxLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXSkge1xuICAgICAgICBhdXRoID0gYmFzaWNBdXRoLnBhcnNlKHJlcS5oZWFkZXJzWydhdXRob3JpemF0aW9uJ10pO1xuICAgICAgICBpZiAoYXV0aCkge1xuICAgICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICB1c2VybmFtZTogYXV0aC5uYW1lXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICdzZXJ2aWNlcyc6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgaWYgKGF1dGhvcml6YXRpb25DYWNoZVthdXRoLm5hbWVdID09PSBhdXRoLnBhc3MpIHtcbiAgICAgICAgICAgICAgaXNBdXRoZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQodXNlciwgYXV0aC5wYXNzKTtcbiAgICAgICAgICAgICAgaWYgKCFyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpc0F1dGhlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKF8ua2V5cyhhdXRob3JpemF0aW9uQ2FjaGUpLmxlbmd0aCA+IDEwMCkge1xuICAgICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvbkNhY2hlID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb25DYWNoZVthdXRoLm5hbWVdID0gYXV0aC5wYXNzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNBdXRoZWQpIHtcbiAgICAgICAgcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddID0gdXNlci5faWQ7XG4gICAgICAgIHRva2VuID0gbnVsbDtcbiAgICAgICAgYXBwX2lkID0gXCJjcmVhdG9yXCI7XG4gICAgICAgIGNsaWVudF9pZCA9IFwicGNcIjtcbiAgICAgICAgbG9naW5Ub2tlbnMgPSAocmVmMSA9IHVzZXIuc2VydmljZXMpICE9IG51bGwgPyAocmVmMiA9IHJlZjEucmVzdW1lKSAhPSBudWxsID8gcmVmMi5sb2dpblRva2VucyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgaWYgKGxvZ2luVG9rZW5zKSB7XG4gICAgICAgICAgYXBwX2xvZ2luX3Rva2VuID0gXy5maW5kKGxvZ2luVG9rZW5zLCBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICByZXR1cm4gdC5hcHBfaWQgPT09IGFwcF9pZCAmJiB0LmNsaWVudF9pZCA9PT0gY2xpZW50X2lkO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChhcHBfbG9naW5fdG9rZW4pIHtcbiAgICAgICAgICAgIHRva2VuID0gYXBwX2xvZ2luX3Rva2VuLnRva2VuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgYXV0aFRva2VuID0gQWNjb3VudHMuX2dlbmVyYXRlU3RhbXBlZExvZ2luVG9rZW4oKTtcbiAgICAgICAgICB0b2tlbiA9IGF1dGhUb2tlbi50b2tlbjtcbiAgICAgICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoU3RhbXBlZFRva2VuKGF1dGhUb2tlbik7XG4gICAgICAgICAgaGFzaGVkVG9rZW4uYXBwX2lkID0gYXBwX2lkO1xuICAgICAgICAgIGhhc2hlZFRva2VuLmNsaWVudF9pZCA9IGNsaWVudF9pZDtcbiAgICAgICAgICBoYXNoZWRUb2tlbi50b2tlbiA9IHRva2VuO1xuICAgICAgICAgIEFjY291bnRzLl9pbnNlcnRIYXNoZWRMb2dpblRva2VuKHVzZXIuX2lkLCBoYXNoZWRUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddID0gdG9rZW47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfSkucnVuKCk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdFNlcnZpY2VNZXRhZGF0YSA9IHJlcXVpcmUoJ29kYXRhLXY0LXNlcnZpY2UtbWV0YWRhdGEnKS5TZXJ2aWNlTWV0YWRhdGE7XG5cdFNlcnZpY2VEb2N1bWVudCA9IHJlcXVpcmUoJ29kYXRhLXY0LXNlcnZpY2UtZG9jdW1lbnQnKS5TZXJ2aWNlRG9jdW1lbnQ7XG5cdF9OVU1CRVJfVFlQRVMgPSBbXCJudW1iZXJcIiwgXCJjdXJyZW5jeVwiXVxuXG5cdF9CT09MRUFOX1RZUEVTID0gW1wiYm9vbGVhblwiXVxuXG5cdF9EQVRFVElNRV9PRkZTRVRfVFlQRVMgPSBbJ2RhdGV0aW1lJ11cblxuXHRfTkFNRVNQQUNFID0gXCJDcmVhdG9yRW50aXRpZXNcIlxuXG5cdGdldE9iamVjdHNPZGF0YVNjaGVtYSA9IChzcGFjZUlkKS0+XG5cdFx0c2NoZW1hID0ge3ZlcnNpb246IFN0ZWVkb3NPRGF0YS5WRVJTSU9OLCBkYXRhU2VydmljZXM6IHtzY2hlbWE6IFtdfX1cblxuXHRcdGVudGl0aWVzX3NjaGVtYSA9IHt9XG5cblx0XHRlbnRpdGllc19zY2hlbWEubmFtZXNwYWNlID0gX05BTUVTUEFDRVxuXG5cdFx0ZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUgPSBbXVxuXG5cdFx0ZW50aXRpZXNfc2NoZW1hLmFubm90YXRpb25zID0gW11cblxuXHRcdF8uZWFjaCBDcmVhdG9yLkNvbGxlY3Rpb25zLCAodmFsdWUsIGtleSwgbGlzdCktPlxuXHRcdFx0X29iamVjdCA9IENyZWF0b3IuZ2V0T2JqZWN0KGtleSwgc3BhY2VJZClcblx0XHRcdGlmIG5vdCBfb2JqZWN0Py5lbmFibGVfYXBpXG5cdFx0XHRcdHJldHVyblxuXG5cdFx0XHQjIOS4u+mUrlxuXHRcdFx0a2V5cyA9IFt7cHJvcGVydHlSZWY6IHtuYW1lOiBcIl9pZFwiLCBjb21wdXRlZEtleTogdHJ1ZX19XVxuXG5cdFx0XHRlbnRpdGllID0ge1xuXHRcdFx0XHRuYW1lOiBfb2JqZWN0Lm5hbWVcblx0XHRcdFx0a2V5OmtleXNcblx0XHRcdH1cblxuXHRcdFx0a2V5cy5mb3JFYWNoIChfa2V5KS0+XG5cdFx0XHRcdGVudGl0aWVzX3NjaGVtYS5hbm5vdGF0aW9ucy5wdXNoIHtcblx0XHRcdFx0XHR0YXJnZXQ6IF9OQU1FU1BBQ0UgKyBcIi5cIiArIF9vYmplY3QubmFtZSArIFwiL1wiICsgX2tleS5wcm9wZXJ0eVJlZi5uYW1lLFxuXHRcdFx0XHRcdGFubm90YXRpb246IFt7XG5cdFx0XHRcdFx0XHRcInRlcm1cIjogXCJPcmcuT0RhdGEuQ29yZS5WMS5Db21wdXRlZFwiLFxuXHRcdFx0XHRcdFx0XCJib29sXCI6IFwidHJ1ZVwiXG5cdFx0XHRcdFx0fV1cblx0XHRcdFx0fVxuXG5cdFx0XHQjIEVudGl0eVR5cGVcblx0XHRcdHByb3BlcnR5ID0gW11cblx0XHRcdHByb3BlcnR5LnB1c2gge25hbWU6IFwiX2lkXCIsIHR5cGU6IFwiRWRtLlN0cmluZ1wiLCBudWxsYWJsZTogZmFsc2V9XG5cblx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0eSA9IFtdXG5cblx0XHRcdF8uZm9yRWFjaCBfb2JqZWN0LmZpZWxkcywgKGZpZWxkLCBmaWVsZF9uYW1lKS0+XG5cblx0XHRcdFx0X3Byb3BlcnR5ID0ge25hbWU6IGZpZWxkX25hbWUsIHR5cGU6IFwiRWRtLlN0cmluZ1wifVxuXG5cdFx0XHRcdGlmIF8uY29udGFpbnMgX05VTUJFUl9UWVBFUywgZmllbGQudHlwZVxuXHRcdFx0XHRcdF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uRG91YmxlXCJcblx0XHRcdFx0ZWxzZSBpZiBfLmNvbnRhaW5zIF9CT09MRUFOX1RZUEVTLCBmaWVsZC50eXBlXG5cdFx0XHRcdFx0X3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5Cb29sZWFuXCJcblx0XHRcdFx0ZWxzZSBpZiBfLmNvbnRhaW5zIF9EQVRFVElNRV9PRkZTRVRfVFlQRVMsIGZpZWxkLnR5cGVcblx0XHRcdFx0XHRfcHJvcGVydHkudHlwZSA9IFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCJcblx0XHRcdFx0XHRfcHJvcGVydHkucHJlY2lzaW9uID0gXCI4XCJcblxuXHRcdFx0XHRpZiBmaWVsZC5yZXF1aXJlZFxuXHRcdFx0XHRcdF9wcm9wZXJ0eS5udWxsYWJsZSA9IGZhbHNlXG5cblx0XHRcdFx0cHJvcGVydHkucHVzaCBfcHJvcGVydHlcblxuXHRcdFx0XHRyZWZlcmVuY2VfdG8gPSBmaWVsZC5yZWZlcmVuY2VfdG9cblxuXHRcdFx0XHRpZiByZWZlcmVuY2VfdG9cblx0XHRcdFx0XHRpZiAhXy5pc0FycmF5KHJlZmVyZW5jZV90bylcblx0XHRcdFx0XHRcdHJlZmVyZW5jZV90byA9IFtyZWZlcmVuY2VfdG9dXG5cblx0XHRcdFx0XHRyZWZlcmVuY2VfdG8uZm9yRWFjaCAociktPlxuXHRcdFx0XHRcdFx0cmVmZXJlbmNlX29iaiA9IENyZWF0b3IuZ2V0T2JqZWN0KHIsIHNwYWNlSWQpXG5cdFx0XHRcdFx0XHRpZiByZWZlcmVuY2Vfb2JqXG5cdFx0XHRcdFx0XHRcdF9uYW1lID0gZmllbGRfbmFtZSArIFN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYXG5cdFx0XHRcdFx0XHRcdGlmIF8uaXNBcnJheShmaWVsZC5yZWZlcmVuY2VfdG8pXG5cdFx0XHRcdFx0XHRcdFx0X25hbWUgPSBmaWVsZF9uYW1lICsgU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVggKyBcIi5cIiArIHJlZmVyZW5jZV9vYmoubmFtZVxuXHRcdFx0XHRcdFx0XHRuYXZpZ2F0aW9uUHJvcGVydHkucHVzaCB7XG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogX25hbWUsXG5cdCNcdFx0XHRcdFx0XHRcdHR5cGU6IFwiQ29sbGVjdGlvbihcIiArIF9OQU1FU1BBQ0UgKyBcIi5cIiArIHJlZmVyZW5jZV9vYmoubmFtZSArIFwiKVwiLFxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IF9OQU1FU1BBQ0UgKyBcIi5cIiArIHJlZmVyZW5jZV9vYmoubmFtZVxuXHRcdFx0XHRcdFx0XHRcdHBhcnRuZXI6IF9vYmplY3QubmFtZSAjVE9ET1xuXHRcdFx0XHRcdFx0XHRcdF9yZV9uYW1lOiByZWZlcmVuY2Vfb2JqLm5hbWVcblx0XHRcdFx0XHRcdFx0XHRyZWZlcmVudGlhbENvbnN0cmFpbnQ6IFtcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvcGVydHk6IGZpZWxkX25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJlZmVyZW5jZWRQcm9wZXJ0eTogXCJfaWRcIlxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4gXCJyZWZlcmVuY2UgdG8gJyN7cn0nIGludmFsaWQuXCJcblxuXHRcdFx0ZW50aXRpZS5wcm9wZXJ0eSA9IHByb3BlcnR5XG5cdFx0XHRlbnRpdGllLm5hdmlnYXRpb25Qcm9wZXJ0eSA9IG5hdmlnYXRpb25Qcm9wZXJ0eVxuXG5cdFx0XHRlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZS5wdXNoIGVudGl0aWVcblxuXHRcdHNjaGVtYS5kYXRhU2VydmljZXMuc2NoZW1hLnB1c2ggZW50aXRpZXNfc2NoZW1hXG5cblxuXHRcdGNvbnRhaW5lcl9zY2hlbWEgPSB7fVxuXHRcdGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyID0ge25hbWU6IFwiY29udGFpbmVyXCJ9XG5cdFx0Y29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0ID0gW11cblxuXHRcdF8uZm9yRWFjaCBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSwgKF9ldCwgayktPlxuXHRcdFx0Y29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0LnB1c2gge1xuXHRcdFx0XHRcIm5hbWVcIjogX2V0Lm5hbWUsXG5cdFx0XHRcdFwiZW50aXR5VHlwZVwiOiBfTkFNRVNQQUNFICsgXCIuXCIgKyBfZXQubmFtZSxcblx0XHRcdFx0XCJuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nXCI6IFtdXG5cdFx0XHR9XG5cblx0XHQjIFRPRE8gU2VydmljZU1ldGFkYXRh5LiN5pSv5oyBbmF2aWdhdGlvblByb3BlcnR5QmluZGluZ+WxnuaAp1xuI1x0XHRfLmZvckVhY2ggZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUsIChfZXQsIGspLT5cbiNcdFx0XHRfLmZvckVhY2ggX2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eSwgKF9ldF9ucCwgbnBfayktPlxuI1x0XHRcdFx0X2VzID0gXy5maW5kIGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyLmVudGl0eVNldCwgKF9lcyktPlxuI1x0XHRcdFx0XHRcdFx0cmV0dXJuIF9lcy5uYW1lID09IF9ldF9ucC5wYXJ0bmVyXG4jXG4jXHRcdFx0XHRfZXM/Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcucHVzaCB7XCJwYXRoXCI6IF9ldF9ucC5fcmVfbmFtZSwgXCJ0YXJnZXRcIjogX2V0X25wLl9yZV9uYW1lfVxuI1x0XHRcdFx0Y29uc29sZS5sb2coXCJfZXNcIiwgX2VzKVxuI1xuI1x0XHRjb25zb2xlLmxvZyhcImNvbnRhaW5lcl9zY2hlbWFcIiwgSlNPTi5zdHJpbmdpZnkoY29udGFpbmVyX3NjaGVtYSkpXG5cblx0XHRzY2hlbWEuZGF0YVNlcnZpY2VzLnNjaGVtYS5wdXNoIGNvbnRhaW5lcl9zY2hlbWFcblxuXHRcdHJldHVybiBzY2hlbWFcblxuXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoJycsIHthdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUR9LCB7XG5cdFx0Z2V0OiAoKS0+XG5cdFx0XHRjb250ZXh0ID0gU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aChAdXJsUGFyYW1zPy5zcGFjZUlkKVxuXHRcdFx0c2VydmljZURvY3VtZW50ICA9IFNlcnZpY2VEb2N1bWVudC5wcm9jZXNzTWV0YWRhdGFKc29uKGdldE9iamVjdHNPZGF0YVNjaGVtYShAdXJsUGFyYW1zPy5zcGFjZUlkKSwge2NvbnRleHQ6IGNvbnRleHR9KTtcblx0XHRcdGJvZHkgPSBzZXJ2aWNlRG9jdW1lbnQuZG9jdW1lbnQoKVxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXG5cdFx0XHRcdFx0J09EYXRhLVZlcnNpb24nOiBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRib2R5OiBzZXJ2aWNlRG9jdW1lbnQuZG9jdW1lbnQoKVxuXHRcdFx0fTtcblx0fSlcblxuXHRTdGVlZG9zT2RhdGFBUEkuYWRkUm91dGUoU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEgsIHthdXRoUmVxdWlyZWQ6IFN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUR9LCB7XG5cdFx0Z2V0OiAoKS0+XG5cdFx0XHRzZXJ2aWNlTWV0YWRhdGEgPSBTZXJ2aWNlTWV0YWRhdGEucHJvY2Vzc01ldGFkYXRhSnNvbihnZXRPYmplY3RzT2RhdGFTY2hlbWEoQHVybFBhcmFtcz8uc3BhY2VJZCkpXG5cdFx0XHRib2R5ID0gc2VydmljZU1ldGFkYXRhLmRvY3VtZW50KClcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbDsgY2hhcnNldD11dGYtOCcsXG5cdFx0XHRcdFx0J09EYXRhLVZlcnNpb24nOiBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRib2R5OiBib2R5XG5cdFx0XHR9O1xuXHR9KSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgU2VydmljZURvY3VtZW50LCBTZXJ2aWNlTWV0YWRhdGEsIF9CT09MRUFOX1RZUEVTLCBfREFURVRJTUVfT0ZGU0VUX1RZUEVTLCBfTkFNRVNQQUNFLCBfTlVNQkVSX1RZUEVTLCBnZXRPYmplY3RzT2RhdGFTY2hlbWE7XG4gIFNlcnZpY2VNZXRhZGF0YSA9IHJlcXVpcmUoJ29kYXRhLXY0LXNlcnZpY2UtbWV0YWRhdGEnKS5TZXJ2aWNlTWV0YWRhdGE7XG4gIFNlcnZpY2VEb2N1bWVudCA9IHJlcXVpcmUoJ29kYXRhLXY0LXNlcnZpY2UtZG9jdW1lbnQnKS5TZXJ2aWNlRG9jdW1lbnQ7XG4gIF9OVU1CRVJfVFlQRVMgPSBbXCJudW1iZXJcIiwgXCJjdXJyZW5jeVwiXTtcbiAgX0JPT0xFQU5fVFlQRVMgPSBbXCJib29sZWFuXCJdO1xuICBfREFURVRJTUVfT0ZGU0VUX1RZUEVTID0gWydkYXRldGltZSddO1xuICBfTkFNRVNQQUNFID0gXCJDcmVhdG9yRW50aXRpZXNcIjtcbiAgZ2V0T2JqZWN0c09kYXRhU2NoZW1hID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBjb250YWluZXJfc2NoZW1hLCBlbnRpdGllc19zY2hlbWEsIHNjaGVtYTtcbiAgICBzY2hlbWEgPSB7XG4gICAgICB2ZXJzaW9uOiBTdGVlZG9zT0RhdGEuVkVSU0lPTixcbiAgICAgIGRhdGFTZXJ2aWNlczoge1xuICAgICAgICBzY2hlbWE6IFtdXG4gICAgICB9XG4gICAgfTtcbiAgICBlbnRpdGllc19zY2hlbWEgPSB7fTtcbiAgICBlbnRpdGllc19zY2hlbWEubmFtZXNwYWNlID0gX05BTUVTUEFDRTtcbiAgICBlbnRpdGllc19zY2hlbWEuZW50aXR5VHlwZSA9IFtdO1xuICAgIGVudGl0aWVzX3NjaGVtYS5hbm5vdGF0aW9ucyA9IFtdO1xuICAgIF8uZWFjaChDcmVhdG9yLkNvbGxlY3Rpb25zLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBsaXN0KSB7XG4gICAgICB2YXIgX29iamVjdCwgZW50aXRpZSwga2V5cywgbmF2aWdhdGlvblByb3BlcnR5LCBwcm9wZXJ0eTtcbiAgICAgIF9vYmplY3QgPSBDcmVhdG9yLmdldE9iamVjdChrZXksIHNwYWNlSWQpO1xuICAgICAgaWYgKCEoX29iamVjdCAhPSBudWxsID8gX29iamVjdC5lbmFibGVfYXBpIDogdm9pZCAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBrZXlzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvcGVydHlSZWY6IHtcbiAgICAgICAgICAgIG5hbWU6IFwiX2lkXCIsXG4gICAgICAgICAgICBjb21wdXRlZEtleTogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXTtcbiAgICAgIGVudGl0aWUgPSB7XG4gICAgICAgIG5hbWU6IF9vYmplY3QubmFtZSxcbiAgICAgICAga2V5OiBrZXlzXG4gICAgICB9O1xuICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKF9rZXkpIHtcbiAgICAgICAgcmV0dXJuIGVudGl0aWVzX3NjaGVtYS5hbm5vdGF0aW9ucy5wdXNoKHtcbiAgICAgICAgICB0YXJnZXQ6IF9OQU1FU1BBQ0UgKyBcIi5cIiArIF9vYmplY3QubmFtZSArIFwiL1wiICsgX2tleS5wcm9wZXJ0eVJlZi5uYW1lLFxuICAgICAgICAgIGFubm90YXRpb246IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXJtXCI6IFwiT3JnLk9EYXRhLkNvcmUuVjEuQ29tcHV0ZWRcIixcbiAgICAgICAgICAgICAgXCJib29sXCI6IFwidHJ1ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcHJvcGVydHkgPSBbXTtcbiAgICAgIHByb3BlcnR5LnB1c2goe1xuICAgICAgICBuYW1lOiBcIl9pZFwiLFxuICAgICAgICB0eXBlOiBcIkVkbS5TdHJpbmdcIixcbiAgICAgICAgbnVsbGFibGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIG5hdmlnYXRpb25Qcm9wZXJ0eSA9IFtdO1xuICAgICAgXy5mb3JFYWNoKF9vYmplY3QuZmllbGRzLCBmdW5jdGlvbihmaWVsZCwgZmllbGRfbmFtZSkge1xuICAgICAgICB2YXIgX3Byb3BlcnR5LCByZWZlcmVuY2VfdG87XG4gICAgICAgIF9wcm9wZXJ0eSA9IHtcbiAgICAgICAgICBuYW1lOiBmaWVsZF9uYW1lLFxuICAgICAgICAgIHR5cGU6IFwiRWRtLlN0cmluZ1wiXG4gICAgICAgIH07XG4gICAgICAgIGlmIChfLmNvbnRhaW5zKF9OVU1CRVJfVFlQRVMsIGZpZWxkLnR5cGUpKSB7XG4gICAgICAgICAgX3Byb3BlcnR5LnR5cGUgPSBcIkVkbS5Eb3VibGVcIjtcbiAgICAgICAgfSBlbHNlIGlmIChfLmNvbnRhaW5zKF9CT09MRUFOX1RZUEVTLCBmaWVsZC50eXBlKSkge1xuICAgICAgICAgIF9wcm9wZXJ0eS50eXBlID0gXCJFZG0uQm9vbGVhblwiO1xuICAgICAgICB9IGVsc2UgaWYgKF8uY29udGFpbnMoX0RBVEVUSU1FX09GRlNFVF9UWVBFUywgZmllbGQudHlwZSkpIHtcbiAgICAgICAgICBfcHJvcGVydHkudHlwZSA9IFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCI7XG4gICAgICAgICAgX3Byb3BlcnR5LnByZWNpc2lvbiA9IFwiOFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZC5yZXF1aXJlZCkge1xuICAgICAgICAgIF9wcm9wZXJ0eS5udWxsYWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHByb3BlcnR5LnB1c2goX3Byb3BlcnR5KTtcbiAgICAgICAgcmVmZXJlbmNlX3RvID0gZmllbGQucmVmZXJlbmNlX3RvO1xuICAgICAgICBpZiAocmVmZXJlbmNlX3RvKSB7XG4gICAgICAgICAgaWYgKCFfLmlzQXJyYXkocmVmZXJlbmNlX3RvKSkge1xuICAgICAgICAgICAgcmVmZXJlbmNlX3RvID0gW3JlZmVyZW5jZV90b107XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZWZlcmVuY2VfdG8uZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICB2YXIgX25hbWUsIHJlZmVyZW5jZV9vYmo7XG4gICAgICAgICAgICByZWZlcmVuY2Vfb2JqID0gQ3JlYXRvci5nZXRPYmplY3Qociwgc3BhY2VJZCk7XG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlX29iaikge1xuICAgICAgICAgICAgICBfbmFtZSA9IGZpZWxkX25hbWUgKyBTdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWDtcbiAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShmaWVsZC5yZWZlcmVuY2VfdG8pKSB7XG4gICAgICAgICAgICAgICAgX25hbWUgPSBmaWVsZF9uYW1lICsgU3RlZWRvc09EYXRhLkVYUEFORF9GSUVMRF9TVUZGSVggKyBcIi5cIiArIHJlZmVyZW5jZV9vYmoubmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gbmF2aWdhdGlvblByb3BlcnR5LnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6IF9uYW1lLFxuICAgICAgICAgICAgICAgIHR5cGU6IF9OQU1FU1BBQ0UgKyBcIi5cIiArIHJlZmVyZW5jZV9vYmoubmFtZSxcbiAgICAgICAgICAgICAgICBwYXJ0bmVyOiBfb2JqZWN0Lm5hbWUsXG4gICAgICAgICAgICAgICAgX3JlX25hbWU6IHJlZmVyZW5jZV9vYmoubmFtZSxcbiAgICAgICAgICAgICAgICByZWZlcmVudGlhbENvbnN0cmFpbnQ6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IGZpZWxkX25hbWUsXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZWRQcm9wZXJ0eTogXCJfaWRcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKFwicmVmZXJlbmNlIHRvICdcIiArIHIgKyBcIicgaW52YWxpZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZW50aXRpZS5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuICAgICAgZW50aXRpZS5uYXZpZ2F0aW9uUHJvcGVydHkgPSBuYXZpZ2F0aW9uUHJvcGVydHk7XG4gICAgICByZXR1cm4gZW50aXRpZXNfc2NoZW1hLmVudGl0eVR5cGUucHVzaChlbnRpdGllKTtcbiAgICB9KTtcbiAgICBzY2hlbWEuZGF0YVNlcnZpY2VzLnNjaGVtYS5wdXNoKGVudGl0aWVzX3NjaGVtYSk7XG4gICAgY29udGFpbmVyX3NjaGVtYSA9IHt9O1xuICAgIGNvbnRhaW5lcl9zY2hlbWEuZW50aXR5Q29udGFpbmVyID0ge1xuICAgICAgbmFtZTogXCJjb250YWluZXJcIlxuICAgIH07XG4gICAgY29udGFpbmVyX3NjaGVtYS5lbnRpdHlDb250YWluZXIuZW50aXR5U2V0ID0gW107XG4gICAgXy5mb3JFYWNoKGVudGl0aWVzX3NjaGVtYS5lbnRpdHlUeXBlLCBmdW5jdGlvbihfZXQsIGspIHtcbiAgICAgIHJldHVybiBjb250YWluZXJfc2NoZW1hLmVudGl0eUNvbnRhaW5lci5lbnRpdHlTZXQucHVzaCh7XG4gICAgICAgIFwibmFtZVwiOiBfZXQubmFtZSxcbiAgICAgICAgXCJlbnRpdHlUeXBlXCI6IF9OQU1FU1BBQ0UgKyBcIi5cIiArIF9ldC5uYW1lLFxuICAgICAgICBcIm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIjogW11cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHNjaGVtYS5kYXRhU2VydmljZXMuc2NoZW1hLnB1c2goY29udGFpbmVyX3NjaGVtYSk7XG4gICAgcmV0dXJuIHNjaGVtYTtcbiAgfTtcbiAgU3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKCcnLCB7XG4gICAgYXV0aFJlcXVpcmVkOiBTdGVlZG9zT0RhdGEuQVVUSFJFUVVJUkVEXG4gIH0sIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGJvZHksIGNvbnRleHQsIHJlZiwgcmVmMSwgc2VydmljZURvY3VtZW50O1xuICAgICAgY29udGV4dCA9IFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoKHJlZiA9IHRoaXMudXJsUGFyYW1zKSAhPSBudWxsID8gcmVmLnNwYWNlSWQgOiB2b2lkIDApO1xuICAgICAgc2VydmljZURvY3VtZW50ID0gU2VydmljZURvY3VtZW50LnByb2Nlc3NNZXRhZGF0YUpzb24oZ2V0T2JqZWN0c09kYXRhU2NoZW1hKChyZWYxID0gdGhpcy51cmxQYXJhbXMpICE9IG51bGwgPyByZWYxLnNwYWNlSWQgOiB2b2lkIDApLCB7XG4gICAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICAgIH0pO1xuICAgICAgYm9keSA9IHNlcnZpY2VEb2N1bWVudC5kb2N1bWVudCgpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXG4gICAgICAgICAgJ09EYXRhLVZlcnNpb24nOiBTdGVlZG9zT0RhdGEuVkVSU0lPTlxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBzZXJ2aWNlRG9jdW1lbnQuZG9jdW1lbnQoKVxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gU3RlZWRvc09kYXRhQVBJLmFkZFJvdXRlKFN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRILCB7XG4gICAgYXV0aFJlcXVpcmVkOiBTdGVlZG9zT0RhdGEuQVVUSFJFUVVJUkVEXG4gIH0sIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGJvZHksIHJlZiwgc2VydmljZU1ldGFkYXRhO1xuICAgICAgc2VydmljZU1ldGFkYXRhID0gU2VydmljZU1ldGFkYXRhLnByb2Nlc3NNZXRhZGF0YUpzb24oZ2V0T2JqZWN0c09kYXRhU2NoZW1hKChyZWYgPSB0aGlzLnVybFBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwKSk7XG4gICAgICBib2R5ID0gc2VydmljZU1ldGFkYXRhLmRvY3VtZW50KCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWw7IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgICAgICdPRGF0YS1WZXJzaW9uJzogU3RlZWRvc09EYXRhLlZFUlNJT05cbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogYm9keVxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJAU3RlZWRvc09EYXRhID0ge31cblN0ZWVkb3NPRGF0YS5WRVJTSU9OID0gJzQuMCdcblN0ZWVkb3NPRGF0YS5BVVRIUkVRVUlSRUQgPSB0cnVlXG5TdGVlZG9zT0RhdGEuQVBJX1BBVEggPSAnL2FwaS9vZGF0YS92NC86c3BhY2VJZCdcblN0ZWVkb3NPRGF0YS5NRVRBREFUQV9QQVRIID0gJyRtZXRhZGF0YSdcblN0ZWVkb3NPRGF0YS5FWFBBTkRfRklFTERfU1VGRklYID0gXCJfZXhwYW5kXCJcblN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aCA9IChzcGFjZUlkKS0+XG5cdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwoJ2FwaS9vZGF0YS92NC8nICsgc3BhY2VJZClcblxuU3RlZWRvc09EYXRhLmdldE9EYXRhUGF0aCA9IChzcGFjZUlkLG9iamVjdF9uYW1lKS0+XG5cdHJldHVybiBTdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGgoc3BhY2VJZCkgKyBcIi8je29iamVjdF9uYW1lfVwiXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zT0RhdGEuZ2V0TWV0YURhdGFQYXRoID0gKHNwYWNlSWQpLT5cblx0XHRyZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgXCIvI3tTdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSH1cIlxuXG5cdFN0ZWVkb3NPRGF0YS5nZXRPRGF0YUNvbnRleHRQYXRoID0gKHNwYWNlSWQsIG9iamVjdF9uYW1lKS0+XG5cdFx0cmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoc3BhY2VJZCkgKyBcIiMje29iamVjdF9uYW1lfVwiXG5cdFN0ZWVkb3NPRGF0YS5nZXRPRGF0YU5leHRMaW5rUGF0aCA9IChzcGFjZUlkLG9iamVjdF9uYW1lKS0+XG5cdFx0cmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIFwiLyN7b2JqZWN0X25hbWV9XCJcblxuXG5cdEBTdGVlZG9zT2RhdGFBUEkgPSBuZXcgT2RhdGFSZXN0aXZ1c1xuXHRcdGFwaVBhdGg6IFN0ZWVkb3NPRGF0YS5BUElfUEFUSCxcblx0XHR1c2VEZWZhdWx0QXV0aDogdHJ1ZVxuXHRcdHByZXR0eUpzb246IHRydWVcblx0XHRlbmFibGVDb3JzOiB0cnVlXG5cdFx0ZGVmYXVsdEhlYWRlcnM6XG5cdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4iLCJ0aGlzLlN0ZWVkb3NPRGF0YSA9IHt9O1xuXG5TdGVlZG9zT0RhdGEuVkVSU0lPTiA9ICc0LjAnO1xuXG5TdGVlZG9zT0RhdGEuQVVUSFJFUVVJUkVEID0gdHJ1ZTtcblxuU3RlZWRvc09EYXRhLkFQSV9QQVRIID0gJy9hcGkvb2RhdGEvdjQvOnNwYWNlSWQnO1xuXG5TdGVlZG9zT0RhdGEuTUVUQURBVEFfUEFUSCA9ICckbWV0YWRhdGEnO1xuXG5TdGVlZG9zT0RhdGEuRVhQQU5EX0ZJRUxEX1NVRkZJWCA9IFwiX2V4cGFuZFwiO1xuXG5TdGVlZG9zT0RhdGEuZ2V0Um9vdFBhdGggPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwoJ2FwaS9vZGF0YS92NC8nICsgc3BhY2VJZCk7XG59O1xuXG5TdGVlZG9zT0RhdGEuZ2V0T0RhdGFQYXRoID0gZnVuY3Rpb24oc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgcmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIChcIi9cIiArIG9iamVjdF9uYW1lKTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvc09EYXRhLmdldE1ldGFEYXRhUGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICByZXR1cm4gU3RlZWRvc09EYXRhLmdldFJvb3RQYXRoKHNwYWNlSWQpICsgKFwiL1wiICsgU3RlZWRvc09EYXRhLk1FVEFEQVRBX1BBVEgpO1xuICB9O1xuICBTdGVlZG9zT0RhdGEuZ2V0T0RhdGFDb250ZXh0UGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQsIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRNZXRhRGF0YVBhdGgoc3BhY2VJZCkgKyAoXCIjXCIgKyBvYmplY3RfbmFtZSk7XG4gIH07XG4gIFN0ZWVkb3NPRGF0YS5nZXRPRGF0YU5leHRMaW5rUGF0aCA9IGZ1bmN0aW9uKHNwYWNlSWQsIG9iamVjdF9uYW1lKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3NPRGF0YS5nZXRSb290UGF0aChzcGFjZUlkKSArIChcIi9cIiArIG9iamVjdF9uYW1lKTtcbiAgfTtcbiAgdGhpcy5TdGVlZG9zT2RhdGFBUEkgPSBuZXcgT2RhdGFSZXN0aXZ1cyh7XG4gICAgYXBpUGF0aDogU3RlZWRvc09EYXRhLkFQSV9QQVRILFxuICAgIHVzZURlZmF1bHRBdXRoOiB0cnVlLFxuICAgIHByZXR0eUpzb246IHRydWUsXG4gICAgZW5hYmxlQ29yczogdHJ1ZSxcbiAgICBkZWZhdWx0SGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
